import { flattenBlocks, hasBlockDescendant } from "./normalize.js";

export const RICHCLAY_SELECTOR = "[data-richclay], [richclay], [editable], [clay-editable]";

// The names that say "richclay" and nothing else. `editable` is deliberately not
// among them: it is the friendly spelling, and it is also a name other people use.
const RICHCLAY_OPT_IN = "[data-richclay], [richclay], [clay-editable]";

// Both spellings of the option-carrying attribute, in the order they are consulted.
// `clay-editable` is the escape hatch for a page whose custom element already owns
// the bare name, so it has to behave identically down to the token list: a spelling
// that mounts a different editor is worse than no escape hatch at all.
const EDITABLE_ATTRS = ["editable", "clay-editable"];

const singleLineSelector = ':is([editable~="single-line"], [clay-editable~="single-line"])';

// A custom element's tag name always contains a hyphen, and `editable` is a common
// boolean property on one: Lit reflects `@property({ type: Boolean }) editable`
// straight to this attribute, where it means whatever that component decided and
// never rich text. Mounting an editor on such an element makes its rendered output
// typeable and writes that output into the author's saved file, which is damage the
// author cannot see until they open the file. A custom element that does want
// richclay asks by name.
export function isRichClayHost(el) {
  if (!el || typeof el.matches !== "function") return false;
  if (!el.tagName.includes("-")) return true;
  return el.matches(RICHCLAY_OPT_IN);
}
export const CHROME_SELECTOR =
  "[data-richclay-toolbar], [data-richclay-menu], [data-richclay-dialog], [data-richclay-link-popover], [data-richclay-live], [data-richclay-float]";

const runtimeClasses = [
  "richclay-editor",
  "richclay-inline",
  "richclay-active",
  "richclay-empty",
  "richclay-focused"
];

const installedWindows = new WeakSet();
const armedWindows = new WeakSet();

// Both clients dispatch the same moment under different names.
const PLATFORM_READY = ["clay:ready", "hyperclay:ready"];

function platformReadyPromise(win) {
  return (
    [win.clay?.ready, win.hyperclay?.ready].find(
      ready => ready && typeof ready.then === "function"
    ) || null
  );
}

function platformEditMode(win) {
  if (typeof win.clay?.isEditMode === "boolean") return win.clay.isEditMode;
  if (typeof win.hyperclay?.isEditMode === "boolean") return win.hyperclay.isEditMode;
  return null;
}

// A bare namespace object proves nothing: every clayjs satellite creates
// window.clay for its own bookkeeping, and <div id="clay"> makes one via named
// window access. What distinguishes a real core is its lifecycle contract.
function hasPlatformLifecycle(win) {
  const modules = win.hyperclayModules;
  const legacyHyperclayLoader =
    win.__hyperclayNoAutoExport === false &&
    modules &&
    typeof modules === "object" &&
    typeof modules.nodeType !== "number";

  return (
    platformEditMode(win) !== null ||
    Boolean(platformReadyPromise(win)) ||
    Boolean(legacyHyperclayLoader)
  );
}

// Two clients provide this API and they spell three things differently. hyperclayjs
// owns window.hyperclay; clayjs owns window.clay and renamed the save transform to
// addDocumentTransform. Reading `clay ?? hyperclay` as one namespace would resolve to
// clay and then find no beforeSave, so richclay would silently stop stripping its own
// chrome and every save would write toolbars into the author's file. Hence per
// capability rather than per namespace.
function platformDocumentTransform(win) {
  return win.clay?.addDocumentTransform || win.hyperclay?.beforeSave || null;
}

// onSnapshot runs on EVERY snapshot, save and live sync alike; the document
// transform runs only on the save branch, after the sync frame has already been
// dispatched. Registering only on the latter meant every live-sync frame carried
// contenteditable, the active classes and the runtime data-richclay to every
// other browser, whose own watcher subscribes to data-richclay and mounted an
// editor on it. Prefer the snapshot hook; fall back for a client too old to have
// one.
function platformSnapshotTransform(win) {
  return win.clay?.onSnapshot || win.hyperclay?.onSnapshot || null;
}

// richclay's stylesheet carries save-remove, so no rule in richclay.css reaches
// the saved file. A <pre> has `white-space: pre` and never wraps, so without
// containment one long line runs off the side of the published page. These four
// declarations are the only ones that have to outlive edit mode, so they ride the
// markup instead of the stylesheet.
const PRE_CONTAINMENT = {
  boxSizing: "border-box",
  minWidth: "100%",
  overflow: "auto",
  width: "0"
};

export function shouldUseHyperclay(options = {}, win = window) {
  if (options.hyperclay === false) return false;
  if (options.hyperclay === true) return true;
  return Boolean(hasPlatformLifecycle(win) || hasEditmodeSignal(win));
}

export function isHyperclayEditMode(win = window) {
  const fromQuery = readEditmodeParam(win);
  if (fromQuery !== null) return fromQuery;

  if (typeof win.__hyperclayEditMode === "boolean") {
    return win.__hyperclayEditMode;
  }

  const fromPlatform = platformEditMode(win);
  if (fromPlatform !== null) return fromPlatform;

  return readEditmodeCookie(win);
}

export function shouldActivateEditor(options = {}, win = window) {
  if (options.readOnly) return false;
  if (!shouldUseHyperclay(options, win)) return true;
  return isHyperclayEditMode(win);
}

// The editable attribute's value is a space-separated token list, like class.
// Unknown tokens are ignored for forward compatibility.
export function parseEditableOptions(element) {
  const name = EDITABLE_ATTRS.find(attr => element.hasAttribute(attr));
  if (!name) return null;
  const tokens = new Set(
    (element.getAttribute(name) || "").trim().split(/\s+/).filter(Boolean)
  );
  const options = {
    inline: true,
    singleLine: tokens.has("single-line"),
    toolbarOnSelect: tokens.has("toolbar-on-select")
  };
  if (tokens.has("no-toolbar")) options.toolbar = false;
  if (tokens.has("link-label")) {
    options.singleLine = true;
    options.linkLabel = true;
    options.toolbar = ["link", "undo", "redo"];
  }
  return options;
}

export function installHyperclayBridge(win = window) {
  if (installedWindows.has(win)) return;
  const register = platformSnapshotTransform(win) || platformDocumentTransform(win);
  if (typeof register !== "function") {
    armBridgeRetry(win);
    return;
  }

  register(docElem => stripRichClayFromClone(docElem));
  installedWindows.add(win);
}

// hyperclayjs publishes the transform from deep in its core waterfall while
// richclay arrives as one flat vendor bundle, and a flat bundle always resolves
// before a multi-level waterfall, so this first read reliably misses. Nothing
// constructs a region again afterwards, so with no retry the bridge never installs
// and every save writes richclay's chrome into the author's file. clayjs is immune
// by construction, assembling addDocumentTransform before any plugin import; the
// readiness pair is the signal hyperclayjs added for exactly this handshake.
function armBridgeRetry(win) {
  if (armedWindows.has(win)) return;
  const doc = win.document;
  const ready = platformReadyPromise(win);
  if (!doc && !ready) return;
  armedWindows.add(win);

  const retry = () => {
    installHyperclayBridge(win);
    if (installedWindows.has(win)) disarm();
  };
  const disarm = () => {
    if (!doc) return;
    PLATFORM_READY.forEach(name => doc.removeEventListener(name, retry));
  };

  if (doc) PLATFORM_READY.forEach(name => doc.addEventListener(name, retry));
  // A loader that never settles must not surface as an unhandled rejection.
  if (ready) ready.then(retry, () => {});
}

export function stripRichClayFromClone(docElem) {
  docElem.querySelectorAll?.(CHROME_SELECTOR).forEach(node => node.remove());

  docElem.querySelectorAll?.(RICHCLAY_SELECTOR).forEach(region => {
    // richclay only cleans up after itself. A region it never took ownership of,
    // because it refused the root or was never activated, is the author's markup
    // and has to come through the save byte for byte. setupEditorAttributes sets
    // this marker in the same breath as every other runtime attribute, so its
    // absence means there is nothing here to strip and nothing here to repair.
    if (region.getAttribute("data-richclay-active") !== "true") return;
    removeRuntimeState(region, "save");
    // The only place this has to be right. Damage happens when markup reaches the
    // file, so a flatten here sits downstream of every Squire route: setHTML,
    // clear formatting, the image resizer, shortcuts, paste, and whatever a future
    // Squire adds. Three rounds of chasing entry points end here.
    //
    // It cannot destroy the author's own blocks, which is what round 3b's version
    // did: a block inside a region with a <p> ancestor cannot have come from their
    // file, because the parser would have ejected it before richclay ever saw it.
    // And it runs on a clone, so it cannot disturb the caret or the undo stack.
    if (needsFlattening(region)) {
      const doc = region.ownerDocument;
      const singleLine = Boolean(region.matches?.(singleLineSelector));
      flattenBlocks(region, () =>
        singleLine ? doc.createTextNode(" ") : doc.createElement("br")
      );
      // flattenBlocks only unwraps blocks, so it cannot repair <a> inside <a>. Same
      // idea, one tag: keep the text, drop the nested duplicate.
      region.querySelectorAll(region.localName).forEach(nested => {
        while (nested.firstChild) nested.parentNode.insertBefore(nested.firstChild, nested);
        nested.remove();
      });
    }
    if (region.matches?.(singleLineSelector)) unwrapLoneSingleLineBlock(region);
    region.querySelectorAll("#squire-selection-start, #squire-selection-end").forEach(node => {
      node.remove();
    });
    region.querySelectorAll(".squire-image-resize-container").forEach(node => node.remove());
    stripZeroWidthArtifacts(region);
    // PRE_CONTAINMENT keeps a long line from running off the side of the published
    // page, where richclay's stylesheet has been stripped by save-remove. It has to
    // ride the markup for that reason. It must not ride an author's own <pre>: those
    // are theirs, their CSS already handles them, and writing width: 0 into a file
    // that was only opened breaks the byte-identical-on-open invariant everything
    // else here defends. Only a <pre> richclay made gets contained.
    const codeBlocks = (region.matches?.("pre")
      ? [region, ...region.querySelectorAll("pre")]
      : Array.from(region.querySelectorAll("pre"))
    ).filter(pre => pre.hasAttribute("data-richclay-pre"));

    codeBlocks.forEach(pre => {
      Object.entries(PRE_CONTAINMENT).forEach(([property, value]) => {
        if (!pre.style[property]) pre.style[property] = value;
      });
      pre.removeAttribute("data-richclay-pre");
    });
  });

  // Squire leaves its selection bookmarks wherever the command was operating,
  // which is not always inside a region. Sweeping the document costs one query and
  // cannot leave one behind.
  docElem
    .querySelectorAll?.("#squire-selection-start, #squire-selection-end")
    .forEach(node => node.remove());
}

// The region's nearest block ancestor is the smallest subtree whose serialization
// reproduces the ejection, for `p > span > span editable` as well as for
// `div > h2 editable`. Deliberately no BODY: a region with no block ancestor at
// all reparses correctly on its own, and scoping to BODY would serialize the
// whole page on every save.
const BLOCK_SCOPE =
  "p, td, th, li, dl, dt, dd, table, blockquote, div, section, article, aside, main, header, footer, figure, figcaption";
const MEASURE_ATTR = "data-richclay-measure";

// Round trip the region through the real parser and see whether it still owns its
// own content. This cannot be wrong about the parser, because it is the parser: it
// covers the <p> rule, the whole implicitly-closes family (heading in heading, li
// in li, a in a, dt/dd, td in td, button, form), and anything a future spec adds,
// with no list to maintain and no list to get wrong for a fourth time.
//
// It also draws the line the old structural predicate could not see. A <ul> pasted
// into an <h2 editable> is stable, so it measures clean and is left alone; an <h3>
// pasted into the same region ejects, so it is flattened. The hook no longer has to
// know the difference between markup that is merely invalid and markup that is
// doomed, because it can watch which one happens.
function ejectsOnReload(region) {
  const doc = region.ownerDocument;
  const scope = region.closest(BLOCK_SCOPE) || region;
  region.setAttribute(MEASURE_ATTR, "");
  const probe = doc.createElement("div");
  try {
    probe.innerHTML = scope.outerHTML;
  } finally {
    region.removeAttribute(MEASURE_ATTR);
  }
  const reparsed = probe.querySelector(`[${MEASURE_ATTR}]`);
  return !reparsed || reparsed.textContent !== region.textContent;
}

// A region can also lose content to an element of its own tag: the parser closes
// the outer one when the inner start tag arrives. Asking the region which tag it is
// keeps this out of list territory.
const selfNests = region => Boolean(region.querySelector(region.localName));

// hasBlockDescendant first, and not only as an optimisation: a region with no block
// in it has nothing this hook could flatten, so measuring it would be work with no
// possible outcome. Measured on an 8-paragraph region: the check is 0.02 ms and the
// reparse it skips is 0.43 ms, so an ordinary save pays almost nothing.
const needsFlattening = region =>
  Boolean(region.matches?.(singleLineSelector)) ||
  ((hasBlockDescendant(region) || selfNests(region)) && ejectsOnReload(region));

// Shared runtime-state removal used by both the save strip (on the cloned
// document) and destroy() (on the live element). The contenteditable marker
// records provenance: "true" means richclay added the attribute; any other
// value is the author's original non-"true" value; no marker with the
// attribute present means the author wrote contenteditable="true" themselves.
export function removeRuntimeState(region, mode) {
  const origin = region.getAttribute("data-richclay-runtime-contenteditable");

  if (region.hasAttribute("contenteditable")) {
    if (origin === "true") {
      region.removeAttribute("contenteditable");
    } else if (origin) {
      if (mode === "destroy") {
        region.setAttribute("contenteditable", origin);
      } else {
        region.setAttribute("inert-contenteditable", origin);
        region.removeAttribute("contenteditable");
      }
    } else if (mode === "save") {
      region.setAttribute("inert-contenteditable", region.getAttribute("contenteditable"));
      region.removeAttribute("contenteditable");
    }
    // destroy with no marker: the author wrote contenteditable; leave it.
  }

  runtimeClasses.forEach(className => region.classList.remove(className));
  if (region.getAttribute("class") === "") region.removeAttribute("class");

  removeRuntimeAttribute(region, "role", "data-richclay-runtime-role");
  removeRuntimeAttribute(region, "aria-multiline", "data-richclay-runtime-aria-multiline");
  removeRuntimeAttribute(region, "no-undo", "data-richclay-runtime-no-undo");
  if (region.getAttribute("data-richclay-runtime-display") === "true") {
    region.style.removeProperty("display");
    if (region.getAttribute("style") === "") region.removeAttribute("style");
  }
  removeRuntimeDescribedBy(region);

  region.removeAttribute("data-richclay-active");
  region.removeAttribute("data-richclay-placeholder");
  region.removeAttribute("data-richclay-pre");
  region.removeAttribute("data-richclay-runtime-role");
  region.removeAttribute("data-richclay-runtime-aria-multiline");
  region.removeAttribute("data-richclay-runtime-no-undo");
  region.removeAttribute("data-richclay-runtime-describedby");
  region.removeAttribute("data-richclay-runtime-contenteditable");
  region.removeAttribute("data-richclay-runtime-display");

  // Only a marker richclay invented comes off; an authored data-richclay has no
  // provenance attribute and survives byte for byte. Note this list is an
  // explicit enumeration, not a prefix sweep, so a new runtime attribute is only
  // removed if it is named here.
  if (region.getAttribute("data-richclay-runtime-marker") === "true") {
    region.removeAttribute("data-richclay");
  }
  region.removeAttribute("data-richclay-runtime-marker");
}

function stripZeroWidthArtifacts(region) {
  const zwsp = String.fromCharCode(0x200b);
  const stack = [region];
  while (stack.length) {
    const node = stack.pop();
    node.childNodes.forEach(child => {
      if (child.nodeType === 3) {
        if (child.nodeValue.includes(zwsp)) {
          child.nodeValue = child.nodeValue.split(zwsp).join("");
        }
      } else if (child.nodeType === 1) {
        stack.push(child);
      }
    });
  }
  // Drop inline wrappers Squire left empty once the caret placeholder is gone.
  region.querySelectorAll("b, i, u, s, em, strong, code, sub, sup, span").forEach(el => {
    if (el.children.length === 0 && (el.textContent || "") === "" && el.attributes.length === 0) {
      el.remove();
    }
  });
}

// Safety net for single-line regions: with the fidelity-first attach Squire
// never wraps the content, but if a lone bare <P> wrapper ever appears, the
// saved file must not contain it.
function unwrapLoneSingleLineBlock(region) {
  const meaningful = Array.from(region.childNodes).filter(
    node => node.nodeType !== 3 || (node.nodeValue || "").trim() !== ""
  );
  if (meaningful.length !== 1) return;
  const block = meaningful[0];
  if (block.nodeType !== 1 || block.nodeName !== "P" || block.attributes.length > 0) return;
  while (block.firstChild) region.insertBefore(block.firstChild, block);
  block.remove();
}

export function consumeInertContenteditable(element) {
  if (!element.hasAttribute("inert-contenteditable")) return null;

  let value = element.getAttribute("inert-contenteditable");
  if (!["false", "plaintext-only"].includes(value)) value = "true";
  element.setAttribute("contenteditable", value);
  element.removeAttribute("inert-contenteditable");
  if (value === "true") {
    // Self-heal: a saved inert "true" is redundant with what activation
    // re-adds. Mark it runtime so the next save drops it from the file
    // instead of round-tripping it forever.
    element.setAttribute("data-richclay-runtime-contenteditable", "true");
  }
  return value;
}

export function markChrome(element) {
  // snapshot-remove drops it from every Hyperclay snapshot (save, live-sync, and
  // dirty comparison). no-watch additionally keeps the mutation observer from
  // walking this high-churn subtree at all. Both stay out of the saved file.
  element.setAttribute("snapshot-remove", "");
  element.setAttribute("no-watch", "");
  return element;
}

function readEditmodeParam(win) {
  try {
    const params = new URLSearchParams(win.location?.search || "");
    if (params.get("editmode") === "true") return true;
    if (params.get("editmode") === "false") return false;
  } catch {
    return null;
  }
  return null;
}

function hasEditmodeSignal(win) {
  return readEditmodeParam(win) !== null || typeof win.__hyperclayEditMode === "boolean";
}

function readEditmodeCookie(win) {
  // Hyperclay signals an owner's edit session with the isAdminOfCurrentResource
  // cookie (see hyperclayjs isAdminOfCurrentResource.js); any non-empty value
  // means the logged-in owner is editing. Read it directly so richclay stays
  // standalone and never imports hyperclayjs.
  const cookie = win.document?.cookie || "";
  const match = cookie.match(/(?:^|;\s*)isAdminOfCurrentResource=([^;]*)/);
  return Boolean(match && match[1] !== "");
}

function removeRuntimeAttribute(region, attribute, marker) {
  if (!region.hasAttribute(marker)) return;
  region.removeAttribute(attribute);
}

function removeRuntimeDescribedBy(region) {
  const id = region.getAttribute("data-richclay-runtime-describedby");
  if (!id) return;

  const ids = (region.getAttribute("aria-describedby") || "")
    .split(/\s+/)
    .filter(Boolean)
    .filter(value => value !== id);

  if (ids.length) {
    region.setAttribute("aria-describedby", ids.join(" "));
  } else {
    region.removeAttribute("aria-describedby");
  }
}
