import {
  createDefaultRegistry,
  isApplePlatform,
  presets
} from "./buttons.js";
import {
  captureRange,
  caretEdge,
  editorRootNeedsNormalization,
  ejectsBlocks,
  flattenBlocks,
  hasBlockDescendant,
  isCaretHost,
  isInlineTag,
  isUnsupportedRootTag,
  keepsTextShape,
  nodeLength,
  normalizeEditorRoot,
  restoreRange,
  unsupportedRootReason
} from "./normalize.js";
import { Toolbar } from "./toolbar.js";
import { FloatingToolbar, pin, placePopover } from "./toolbar-float.js";
import { LinkPopover } from "./link-popover.js";
import {
  createSanitizer,
  flattenFragmentToSingleLine,
  inlineSanitizeConfig,
  normalizeUrl,
  sanitizeHTML as sanitizeHTMLString,
  sanitizeElement as sanitizeElementInPlace
} from "./sanitize.js";
import {
  RICHCLAY_SELECTOR,
  isRichClayHost,
  consumeInertContenteditable,
  installHyperclayBridge,
  isHyperclayEditMode,
  markChrome,
  parseEditableOptions,
  removeRuntimeState,
  shouldActivateEditor,
  shouldUseHyperclay,
  stripRichClayFromClone
} from "./hyperclay.js";
import { ensureStyles } from "./styles.js";
import { createContentView } from './lib/content-dom.js';
import { capabilitySelector, closestWithCapability } from './lib/region-capabilities.js';

const EDITOR_UI_SELECTOR = capabilitySelector('history');

function stripIncomingEditorUi(html, doc) {
  const template = doc.createElement('template');
  template.innerHTML = String(html || '');
  for (const node of template.content.querySelectorAll(EDITOR_UI_SELECTOR)) node.remove();
  return template.innerHTML;
}

function clipboardHTML(html, doc) {
  return stripIncomingEditorUi(html, doc)
}

function clipboardText(html, doc) {
  const template = doc.createElement('template')
  template.innerHTML = clipboardHTML(html, doc)
  const blocks = new Set(['ADDRESS', 'ARTICLE', 'ASIDE', 'BLOCKQUOTE', 'DIV', 'DL', 'FIELDSET', 'FIGCAPTION', 'FIGURE', 'FOOTER', 'FORM', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER', 'HR', 'LI', 'MAIN', 'NAV', 'OL', 'P', 'PRE', 'SECTION', 'TABLE', 'UL'])
  let text = ''
  const visit = node => {
    if (node.nodeType === 3) text += node.data
    else if (node.nodeType === 1 && node.tagName === 'BR') text += '\n'
    else {
      const block = node.nodeType === 1 && blocks.has(node.tagName)
      if (block && text && !text.endsWith('\n')) text += '\n'
      for (const child of node.childNodes || []) visit(child)
      if (block && text && !text.endsWith('\n')) text += '\n'
    }
  }
  visit(template.content)
  return text.replace(/\n{3,}/g, '\n\n').replace(/^\n|\n$/g, '')
}

function serializeEditorRoot(root, editor, range = null) {
  const view = createContentView(root, { capability: 'history', inherit: false })
  const clone = view.root
  const boundaryFor = (container, offset) => {
    while (container && !view.cloneOf(container)) {
      const parent = container.parentNode
      if (!parent) return { container: clone, offset: 0 }
      offset = Array.from(parent.childNodes).indexOf(container)
      container = parent
    }
    const projected = view.cloneOf(container) || clone
    if (container?.nodeType === 3) return { container: projected, offset: Math.min(offset, projected.length) }
    const before = Array.from(container?.childNodes || []).slice(0, offset)
      .filter(node => view.cloneOf(node)).length
    return { container: projected, offset: Math.min(before, projected.childNodes.length) }
  }
  const insert = (id, container, offset) => {
    const point = boundaryFor(container, offset)
    const marker = clone.ownerDocument.createElement('input')
    marker.id = id
    marker.type = 'hidden'
    const markerRange = clone.ownerDocument.createRange()
    markerRange.setStart(point.container, point.offset)
    markerRange.collapse(true)
    markerRange.insertNode(marker)
  }
  if (range) {
    insert(editor.endSelectionId, range.endContainer, range.endOffset)
    insert(editor.startSelectionId, range.startContainer, range.startOffset)
  } else {
    for (const id of [editor.startSelectionId, editor.endSelectionId]) {
      if (clone.querySelector(`#${id}`)) continue
      const marker = root.querySelector(`#${id}`)
      if (!marker) continue
      insert(id, marker.parentNode, Array.from(marker.parentNode.childNodes).indexOf(marker))
    }
  }
  return clone.innerHTML
}
import {
  announce,
  cloneRange,
  connectDescription,
  createLiveRegion,
  getSquireSelection,
  restoreSquireSelection,
  setRuntimeAttribute
} from "./a11y.js";

const instances = new WeakMap();
const autoInitWindows = new WeakMap();
const watchedWindows = new WeakMap();
const globalRegistry = createDefaultRegistry();
const KEEP_FOCUS = Symbol("richclay-keep-focus");
const ROOT_TRANSFER_EVENTS = ["cut", "paste", "drop"];
const MODIFIER_ORDER = ["Alt", "Ctrl", "Meta", "Shift"];
let dialogSeq = 0;

// A real ClayJS core publishes its committed mode before it evaluates any plugin,
// and its richclay plugin is one of them. From that moment the ClayJS adapter owns
// the instances and the observer that mounts them, so richclay's own auto-init has
// to step aside: two owners mount, watch and destroy the same regions. Standalone
// pages and hyperclayjs publish no clay.mode, so they keep self-starting.
function isManagedByClayJS(win) {
  return typeof win.clay?.mode === "string";
}

const defaultOptions = {
  toolbar: "standard",
  toolbarContainer: null,
  sanitize: {},
  placeholder: "",
  readOnly: false,
  hyperclay: "auto",
  onChange: null,
  Squire: null,
  inline: false,
  singleLine: false,
  toolbarOnSelect: false,
  linkPopover: true,
  linkLabel: false
};

// A link label (`editable="link-label"`) is one line of plain text with at most one link,
// the shape a site's shared store keeps as text and address. Only these controls run in it.
const LINK_LABEL_CONTROLS = ["link", "undo", "redo"];

export default class RichClay {
  static presets = presets;
  static selector = RICHCLAY_SELECTOR;

  constructor(element, options = {}) {
    if (!element) throw new Error("RichClay requires an element.");
    const existing = instances.get(element);
    if (existing) return existing;

    this.element = element;
    this.unsupported = conflictsWithExistingEditor(element) || refuseUnsupportedRoot(element);
    const derived = { ...parseEditableOptions(element), ...options };
    this.options = { ...defaultOptions, ...derived };
    if (this.options.singleLine && !("toolbar" in derived)) {
      this.options.toolbar = "inline";
    }
    // Squire's _ensureBottomLine() appends a fresh default block whenever the
    // root's last element child differs from blockTag, and it runs from every
    // Backspace and Delete. With "P", any inline region ending in an <h2>, a
    // <ul>, or the repair's own wrapper gained a permanent empty margined
    // paragraph on the first delete. DIV also matches what Squire's fixContainer
    // produces and carries no margins, which is what inline mode needs.
    this._blockTag = this.options.inline ? "DIV" : "P";
    this.registry = new Map(globalRegistry);
    this.toolbar = null;
    this.float = null;
    this._onToolbarKey = null;
    this._onFloatFocusOut = null;
    this._onDocPointerDown = null;
    this.liveRegion = null;
    this.description = null;
    this.dialog = null;
    this.dialogCleanup = null;
    this.linkPopover = null;
    this.savedSelection = null;
    this.path = "";
    this.active = false;
    this._squire = null;
    this._squireListeners = [];
    this._onBeforeInput = null;
    this._onRootBeforeInput = null;
    this._onRootKeydown = null;
    this._onRootTransfer = null;
    this._shortcutKeys = [];
    this._appleDeleteKeys = new Set();
    this._authoredPres = new WeakSet();
    this._warnedInlineBlock = false;
    this._onFocus = () => {
      this.element.classList.add("richclay-focused");
      if (this.options.inline) this.ensureFloatingToolbar();
    };
    this._onBlur = event => {
      this.element.classList.remove("richclay-focused");
      this.linkPopover?.onEditorBlur(event);
      if (this.options.inline) this.scheduleFloatTeardown(event);
    };

    this._onLinkActivation = event => {
      if (!this.active || this.options.readOnly) return;
      const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement;
      const anchor = target?.closest("a[href]");
      if (!anchor) return;
      const chrome = closestWithCapability(target, "history");
      if (chrome && chrome !== this.element && this.element.contains(chrome) && chrome.contains(anchor)) return;
      event.preventDefault();
    };

    // The host rewrote this region's content (a shared value another page changed). That is
    // not an edit here: drop Squire's view of the write and start undo from the new content,
    // or the first undo would put the older value back.
    this._onExternalWrite = () => {
      if (!this._squire) return;
      this._squire._mutation?.takeRecords();
      if (this.options.linkLabel) this._labelHref = this.element.querySelector("a[href]")?.getAttribute("href") ?? this._labelHref;
      this.resetSquireUndoBaseline();
      this.updatePlaceholder();
    };

    this.ensureMarker();
    this.hyperclay = shouldUseHyperclay(this.options, this.window);
    if (this.hyperclay) installHyperclayBridge(this.window);

    instances.set(element, this);

    this.sanitizeConfig = this.options.inline
      ? inlineSanitizeConfig(this.options.sanitize)
      : this.options.sanitize;
    this.sanitizer = createSanitizer(this.sanitizeConfig, this.element.ownerDocument);
    if (!this.options.inline) {
      // Card editors sanitize their region up front. Inline editors must not:
      // the content is the page's own live DOM, and rewriting it on activation
      // would destroy author markup (classes, images, data attributes).
      sanitizeElementInPlace(this.element, this.sanitizeConfig);
    }

    if (shouldActivateEditor(this.options, this.window)) {
      this.activate();
    }
  }

  get squire() {
    return this._squire;
  }

  get window() {
    return this.element.ownerDocument.defaultView || window;
  }

  static init(selector = RICHCLAY_SELECTOR, options = {}) {
    // A caller who names its own hosts means them, custom elements included; the
    // custom-element guard only applies to the default catch-all selector.
    const guard = selector === RICHCLAY_SELECTOR ? isRichClayHost : () => true;
    const elements = resolveElements(selector)
      .filter(guard)
      .filter(element => !conflictsWithExistingEditor(element));
    return elements.map(element => new RichClay(element, options));
  }

  static autoInit(win = typeof window !== "undefined" ? window : undefined) {
    if (!win || !win.document) return () => {};
    const existing = autoInitWindows.get(win);
    if (existing) return existing;

    let cancelled = false;
    let stopWatching = null;
    const run = () => {
      if (cancelled || isManagedByClayJS(win)) return;
      if (shouldUseHyperclay({}, win) && isHyperclayEditMode(win)) {
        RichClay.init();
        stopWatching = RichClay.watch(win);
      }
    };
    const stop = () => {
      cancelled = true;
      stopWatching?.();
    };
    autoInitWindows.set(win, stop);
    if (win.document.readyState === "loading") {
      win.document.addEventListener("DOMContentLoaded", run, { once: true });
    } else {
      run();
    }
    return stop;
  }

  static watch(win = typeof window !== "undefined" ? window : undefined, options = {}) {
    if (!win || !win.document) return () => {};
    const existing = watchedWindows.get(win);
    if (existing) return existing;

    const mount = element => {
      if (!isMountable(element)) return;
      if (!instances.has(element) && !conflictsWithExistingEditor(element)) new RichClay(element, options);
    };
    const unmount = element => instances.get(element)?.destroy();

    const observer = new win.MutationObserver(records => {
      records.forEach(record => {
        if (record.type === "attributes") {
          const target = record.target;
          // Matching the selector is not enough to keep an editor alive. A custom
          // element carrying a bare `editable` matches it and is still refused by
          // the host guard, so deciding by the selector alone left such an element
          // mounted forever with its runtime chrome saved into the file.
          if (isMountable(target)) mount(target);
          else unmount(target);
          return;
        }
        record.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          if (node.matches?.(RICHCLAY_SELECTOR)) mount(node);
          node.querySelectorAll?.(RICHCLAY_SELECTOR).forEach(mount);
        });
        record.removedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          // A node that is still connected was moved, not removed; keep its
          // editor alive.
          const teardown = el => {
            // A removed field keeps its DOM as it was: undo may hold an exact copy and put it back.
            if (!el.isConnected) instances.get(el)?.destroy({ detached: true });
          };
          if (node.matches?.(RICHCLAY_SELECTOR)) teardown(node);
          node.querySelectorAll?.(RICHCLAY_SELECTOR).forEach(teardown);
        });
      });
    });

    let stopped = false;
    const stop = () => {
      if (stopped) return;
      stopped = true;
      observer.disconnect();
      if (watchedWindows.get(win) === stop) watchedWindows.delete(win);
    };
    observer.observe(win.document.documentElement || win.document, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["editable", "clay-editable", "data-richclay", "richclay"]
    });
    watchedWindows.set(win, stop);
    return stop;
  }

  static registerButton(def) {
    validateButton(def);
    globalRegistry.set(def.id, def);
    return RichClay;
  }

  static unregisterButton(id) {
    globalRegistry.delete(id);
    return RichClay;
  }

  static stripFromClone(docElem) {
    stripRichClayFromClone(docElem);
  }

  // Remove richclay's runtime state from ONE element, addressed by element
  // rather than by instance.
  //
  // A host that grows a list by cloning a row clones an active region with it,
  // and the copy carries contenteditable, the marker and the runtime classes.
  // Usually there is no editor behind them and destroy() cannot reach it,
  // because destroy belongs to an instance and that clone has none. But a clone
  // carrying the author's own data-richclay is mountable, so the watcher can
  // have given it an instance before the host gets here: this cannot assume the
  // element is instanceless.
  static stripElement(element) {
    if (!element || typeof element.getAttribute !== "function") return;
    // A watcher can have mounted an instance on the clone before the host got
    // here, and then this is not the instanceless orphan described above:
    // stripping the attributes while the instance stays in the cache leaves an
    // editor reporting active on an element with no contenteditable, and every
    // later constructor call hands that same dead instance back. destroy() is
    // the same cleanup and it clears the cache too.
    const existing = instances.get(element);
    if (existing) {
      existing.destroy();
      return;
    }
    removeRuntimeState(element, "destroy");
  }

  registerButton(def) {
    validateButton(def);
    this.registry.set(def.id, def);
    if (this.active) this.renderToolbar();
    return this;
  }

  unregisterButton(id) {
    this.registry.delete(id);
    if (this.active) this.renderToolbar();
    return this;
  }

  activate() {
    if (this.unsupported) return;
    if (this.active) return;

    this.active = true;
    this.applyInlineBox();
    ensureStyles(this.element.ownerDocument);
    consumeInertContenteditable(this.element);

    // Captured before Squire's constructor wipes the root. Inline mode keeps the
    // live nodes rather than a serialized string, so activation cannot lose
    // anything an innerHTML round trip would drop (form state, node identity).
    const initialNodes = this.options.inline ? Array.from(this.element.childNodes) : null;
    const initialHTML = this.options.inline ? null : this.element.innerHTML;
    const Squire = this.options.Squire || this.window.Squire || globalThis.Squire;
    if (!Squire) {
      throw new Error("RichClay requires Squire. Load vendor/squire.js before richclay.js.");
    }

    this.setupEditorAttributes();
    this.liveRegion = createLiveRegion(this.element.ownerDocument);

    this._squire = new Squire(this.element, {
      blockTag: this._blockTag,
      serializeRoot: serializeEditorRoot,
      willCutCopy: html => clipboardHTML(html, this.element.ownerDocument),
      toPlainText: html => clipboardText(html, this.element.ownerDocument),
      replaceRoot: (root, html, editor) => {
        const morph = this.window.clay?.morph || this.window.hyperclay?.morph;
        if (typeof morph !== 'function') {
          if (root.querySelector('[editor-ui], [clay~="editor-ui"]')) {
            throw new Error('RichClay requires a retention-aware morph host to replay history containing editor-ui.');
          }
          root.innerHTML = html;
          return;
        }
        morph(root, html, {
          morphStyle: 'innerHTML',
          restoreFocus: false,
          scripts: { handle: false, merge: false },
          policy: 'history',
        });
        editor._ensureBottomLine();
        editor._mutation?.takeRecords();
      },
      onMutations: (records, editor) => {
        const excluded = (node, capability) => {
          const boundary = closestWithCapability(node, capability);
          return !!boundary && boundary !== this.element && this.element.contains(boundary);
        };
        let authored = false;
        let local = false;
        for (const record of records) {
          if (excluded(record.target, 'history')) continue;
          const nodes = record.type === 'childList'
            ? [...record.addedNodes, ...record.removedNodes]
            : [record.target];
          for (const node of nodes) {
            if (excluded(node, 'history')) continue;
            if (excluded(record.target, 'undo') || excluded(node, 'undo')) local = true;
            else authored = true;
          }
        }
        if (authored) {
          const ignored = editor._ignoreChange;
          editor._docWasChanged();
          if (local && ignored) editor.fireEvent('input');
          // Here rather than on Squire's input event, which skips the change that follows
          // an undo checkpoint: a paste is always one.
          if (this.options.linkLabel) this.keepOneLink();
        }
        else if (local) {
          editor._mayHaveZWS = true;
          editor.fireEvent('input');
        } else editor._ignoreChange = false;
      },
      sanitizeToDOMFragment: (html, editor) => {
        const fragment = this.sanitizer.sanitizeToDOMFragment(stripIncomingEditorUi(html, this.element.ownerDocument), editor);
        return this.options.singleLine ? flattenFragmentToSingleLine(fragment) : fragment;
      },
      didError: error => {
        console.error("RichClay/Squire error", error);
      }
    });
    if (this.options.inline) {
      // Fidelity-first: Squire's constructor wiped the root; put the captured
      // nodes back verbatim. Running them through setHTML would sanitize and
      // re-wrap the page's own content into blocks on mere activation.
      //
      // The structural repair Squire needs is deliberately NOT done here. Merely
      // opening a page in edit mode must leave it byte-identical, or a Hyperclay
      // page with autosave on writes itself to disk for being looked at. It runs
      // on the first real edit instead — see ensureRootIsEditable.
      this.element.replaceChildren(...initialNodes);
      this.resetSquireUndoBaseline();
    } else {
      this._squire.setHTML(initialHTML);
    }

    this.bindSquire();
    if (this.options.singleLine) this.installSingleLineGuards();
    if (this.options.inline && !this.options.singleLine) this.installRootGuards();
    // Before installShortcuts, so an explicitly declared Ctrl+ shortcut wins.
    this.installAppleDeleteKeys();
    // Squire appends a default block whenever the root's last element child is not
    // its blockTag, from Backspace over a selection, cut, and paste. Where blocks
    // stay out that is a block nobody asked for, and the save hook is not enough on
    // its own: flattening the block leaves its <br> behind, the next session adds
    // another, and the file grows a blank line per edit. Prevention, because the
    // cleanup has a residue.
    if (this.blocksStayOut()) this._squire._ensureBottomLine = () => {};
    this.maskSquireCodeShortcut();
    this.maskSquireBlockShortcuts();
    this.installShortcuts();
    if (this.options.linkLabel) this.maskFormattingShortcuts();
    if (this.options.inline) {
      this._onToolbarKey = event => {
        if (event.altKey && event.key === "F10") {
          event.preventDefault();
          this.ensureFloatingToolbar();
          this.float?.toolbar.focusFirst();
        }
      };
      this.element.addEventListener("keydown", this._onToolbarKey);
    }
    // Squire's paste path runs fixContainer over the pasted fragment, so pasting
    // even two plain lines into a <h2 editable> lands a <div> the author never
    // wrote. Flatten it where it arrives: this is the same promise the rest of the
    // editor keeps, that richclay never manufactures a block in a region the
    // author wrote as a line of text.
    if (this.blocksStayOut()) {
      const willPaste = event => {
        const fragment = event.detail?.fragment;
        if (!fragment) return;
        const doc = this.element.ownerDocument;
        flattenBlocks(fragment, () =>
          this.options.singleLine ? doc.createTextNode(" ") : doc.createElement("br")
        );
      };
      this._squire.addEventListener("willPaste", willPaste);
      this._squireListeners.push(["willPaste", willPaste]);
    }
    if (this.options.linkLabel) {
      const plainPaste = event => {
        const fragment = event.detail?.fragment;
        if (!fragment) return;
        const text = fragment.textContent.replace(/\s+/g, " ");
        fragment.replaceChildren(this.element.ownerDocument.createTextNode(text));
      };
      this._squire.addEventListener("willPaste", plainPaste);
      this._squireListeners.push(["willPaste", plainPaste]);
      this._labelHref = this.element.querySelector("a[href]")?.getAttribute("href") ?? null;
    }
    this.renderToolbar();
    this.updatePlaceholder();
    this.warnOnBlockInInlineRegion();
    // Whatever <pre> elements exist before the first command are the author's.
    this.element.querySelectorAll("pre").forEach(pre => this._authoredPres.add(pre));
  }

  // Live sync morphs the page against an incoming copy, and that copy is clean:
  // contenteditable, the marker and the runtime attributes all come back off an
  // element this editor is still pointing at. The instance is fine and Squire is
  // still bound; only the element's own state is gone, and activate() cannot put
  // it back because it returns early on an instance that never stopped being
  // active. Rebuilding is not an option for a host that adopted an editor the
  // author mounted, so this re-applies the state instead.
  //
  // The marker is in here because it is the one whose absence is fatal rather
  // than cosmetic: without it the watcher stops recognising the element, which
  // is the failure ensureMarker's own comment describes.
  //
  // Returns whether it had to do anything, so a caller can tell a repair from a
  // no-op without asking the same question twice.
  reattach() {
    if (this.unsupported || !this.active) return false;
    // isMountable is the question ensureMarker asks, so this is "would the
    // watcher still adopt this element", not a guess at which attributes matter.
    const intact =
      this.element.getAttribute("contenteditable") === "true" &&
      this.element.getAttribute("data-richclay-active") === "true" &&
      isMountable(this.element);
    if (intact) return false;
    this.ensureMarker();
    this.applyInlineBox();
    consumeInertContenteditable(this.element);
    this.setupEditorAttributes();
    return true;
  }

  // A block inside an inline element renders as a run-on. This changes the box
  // and nothing else: whether a region survives a reload is decided by the
  // parser from tag names, before any CSS exists. Runtime only, so the author's
  // file keeps no style richclay put there.
  applyInlineBox() {
    if (isInlineTag(this.element) && !this.element.style.display) {
      this.element.style.display = "inline-block";
      this.element.setAttribute("data-richclay-runtime-display", "true");
    }
  }

  getHTML() {
    return this._squire ? this._squire.getHTML() : this.element.innerHTML;
  }

  setHTML(html) {
    if (this._squire) {
      this._squire.setHTML(String(html || ""));
    } else {
      this.element.innerHTML = sanitizeHTMLString(
        html,
        this.sanitizeConfig,
        this.element.ownerDocument
      );
    }
    this.updatePlaceholder();
    this.toolbar?.update();
    this.options.onChange?.(this.getHTML());
    return this;
  }

  focus() {
    if (this._squire) this._squire.focus();
    else this.element.focus();
    return this;
  }

  destroy({ detached = false } = {}) {
    this.closeLinkDialog();
    this.linkPopover?.destroy();
    this.linkPopover = null;
    this.teardownFloatingToolbar();
    this.toolbar?.destroy();
    this.toolbar = null;
    if (this._onToolbarKey) {
      this.element.removeEventListener("keydown", this._onToolbarKey);
      this._onToolbarKey = null;
    }
    this.liveRegion?.remove();
    this.liveRegion = null;
    this.description?.remove();
    this.description = null;

    this._shortcutKeys.forEach(key => this._squire?.setKeyHandler?.(key, null));
    this._squireListeners.forEach(([type, listener]) => {
      this._squire?.removeEventListener?.(type, listener);
    });
    this._squireListeners = [];
    this._shortcutKeys = [];

    if (this._onBeforeInput) {
      this.element.ownerDocument.removeEventListener("beforeinput", this._onBeforeInput, true);
      this._onBeforeInput = null;
    }

    const doc = this.element.ownerDocument;
    if (this._onRootBeforeInput) {
      doc.removeEventListener("beforeinput", this._onRootBeforeInput, true);
      this._onRootBeforeInput = null;
    }
    if (this._onRootKeydown) {
      doc.removeEventListener("keydown", this._onRootKeydown, true);
      this._onRootKeydown = null;
    }
    if (this._onRootTransfer) {
      ROOT_TRANSFER_EVENTS.forEach(type => doc.removeEventListener(type, this._onRootTransfer, true));
      this._onRootTransfer = null;
    }

    this._squire?.destroy?.();
    this._squire = null;
    this.cleanupEditorAttributes({ keepDom: detached });

    instances.delete(this.element);
  }

  saveSelection() {
    this.savedSelection = getSquireSelection(this._squire) || this.savedSelection;
    return this.savedSelection;
  }

  restoreSelection() {
    return restoreSquireSelection(this._squire, this.savedSelection);
  }

  // Squire's invariant is established on the first real edit rather than at
  // activation, so that opening a page in edit mode never rewrites it. These
  // listeners capture on the document, so the root is valid before Squire's own
  // handlers see the event. History inputs are skipped: repairing mid-undo would
  // fight the stack it is replaying.
  installRootGuards() {
    const doc = this.element.ownerDocument;
    const owns = event => this.element.contains(event.target);

    this._onRootBeforeInput = event => {
      // Repairing mid-composition mutates the DOM under the IME and moves the
      // selection out from under it; repairing mid-undo fights the stack being
      // replayed.
      if (!owns(event) || event.isComposing || /^history/.test(event.inputType || "")) return;
      this.ensureRootIsEditable();
    };
    this._onRootKeydown = event => {
      if (!owns(event) || event.defaultPrevented || event.isComposing) return;
      if (this.isEditingKey(event)) this.ensureRootIsEditable();
    };
    this._onRootTransfer = event => {
      if (owns(event)) this.ensureRootIsEditable();
    };

    doc.addEventListener("beforeinput", this._onRootBeforeInput, true);
    doc.addEventListener("keydown", this._onRootKeydown, true);
    ROOT_TRANSFER_EVENTS.forEach(type => {
      doc.addEventListener(type, this._onRootTransfer, true);
    });
  }

  // Re-checked rather than latched, because Hyperclay's live sync morphs new DOM
  // into the region long after activation and can reintroduce a loose text node.
  ensureRootIsEditable() {
    if (!this._squire || this.options.singleLine) return;
    const wrapBareRoot = this.options.inline;
    const blocksAllowed = !this.blocksStayOut();
    if (!editorRootNeedsNormalization(this.element, { wrapBareRoot, blocksAllowed })) return;

    const range = getSquireSelection(this._squire);
    const saved = range ? captureRange(this.element, range) : null;
    const repair = () => {
      normalizeEditorRoot(this.element, {
        blockTag: this._blockTag,
        wrapBareRoot,
        blocksAllowed,
        onBareRootWrapped: (root, wrapper) => {
          console.warn(
            "richclay: wrapped this region's loose text in a <div> so multi-line editing " +
              "works. Wrap the content in your own block element to keep the markup you wrote, " +
              'or use editable="single-line" if it is meant to be one line.',
            root,
            wrapper
          );
        }
      });
    };

    // Through modifyDocument so the repair is not recorded as a change of its
    // own: it folds into the first edit's diff, which is what makes undo restore
    // the byte-identical pre-repair source instead of stepping back into a
    // half-repaired state.
    if (typeof this._squire.modifyDocument === "function") this._squire.modifyDocument(repair);
    else repair();

    if (saved) {
      restoreRange(this.element, range, saved);
      restoreSquireSelection(this._squire, range);
      this.savedSelection = cloneRange(range);
    }
  }

  // Only keys that will actually edit. Repairing is not free on a root that has
  // not been repaired yet, which is every freshly opened page, so a blanket
  // "any single-character key" made Cmd+C and Cmd+S rewrite an untouched region.
  // The only modified keys that do edit are the ones this editor rebound itself,
  // which is why the set is asked rather than Squire's dispatch mirrored.
  isEditingKey(event) {
    if (["Backspace", "Delete", "Enter"].includes(event.key)) return true;
    // Squire acts on Tab only inside a list. Anywhere else it edits nothing, and
    // treating it as an editing key made merely tabbing out of a fresh region run
    // the repair and strip the author's source indentation.
    if (event.key === "Tab") return this.caretIsInList();
    if (event.key.length !== 1) return false;
    if (!event.ctrlKey && !event.metaKey && !event.altKey) return true;
    return (
      event.ctrlKey && !event.metaKey && !event.altKey &&
      this._appleDeleteKeys.has(event.key.toLowerCase())
    );
  }

  caretIsInList() {
    const range = this._squire?.getSelection();
    const container = range?.startContainer;
    if (!container) return false;
    const element = container.nodeType === 1 ? container : container.parentElement;
    return Boolean(element && this.element.contains(element) && element.closest("ul, ol"));
  }

  runControl(def) {
    if (!this._squire || typeof def.run !== "function") return;
    // Enforced here, not only where the toolbar renders: shortcuts and menu items
    // reach this same path, and the block commands they carry are exactly the
    // ones that put a <blockquote> inside a <p editable>.
    if (def.isDisabled?.(this)) return;
    this.restoreSelection();
    // Before the command, not only after. A toolbar click can be the first
    // interaction with a page and no root guard fires for it, so a block command
    // ran against the raw root: over two source-indented paragraphs, one list
    // command produced two separate <ul>s. Both halves are block-valid, so the
    // heal below cannot undo it.
    if (def.mutates !== false) this.ensureRootIsEditable();
    const result = def.run(this);
    // Stamp any <pre> this command just created, so the save hook can contain it
    // without touching one the author wrote themselves.
    this.element.querySelectorAll("pre:not([data-richclay-pre])").forEach(pre => {
      if (!this._authoredPres.has(pre)) pre.setAttribute("data-richclay-pre", "");
    });
    // After it too. Squire's removeCode() splices an emptied <pre> out onto the
    // root, and a caret parked on the orphan makes every later block command a
    // silent no-op.
    if (def.mutates !== false) {
      this.ensureRootIsEditable();
      this.anchorSelectionInBlock();
    }
    this.saveSelection();
    this.toolbar?.update();
    this.updatePlaceholder();
    this.announceControl(def);

    if (result !== KEEP_FOCUS) {
      this.focus();
    }
    this.warnOnBlockInInlineRegion();
  }

  // Squire's modifyBlocks leaves the caret anchored on the root itself, between
  // blocks. From there getStartBlockOfRange finds no block, so the next block
  // command is a silent no-op — the "it stopped working" the user hit. Push a
  // collapsed caret back inside the block it is sitting in front of.
  anchorSelectionInBlock() {
    const range = getSquireSelection(this._squire);
    if (!range?.collapsed || range.startContainer !== this.element) return;

    const children = Array.from(this.element.childNodes);
    const atEnd = range.startOffset >= children.length;
    // Comments are skipped: a caret set inside a comment node is not a text
    // position, and the region's markers are comments.
    const child = atEnd
      ? children.filter(isCaretHost).pop()
      : children.slice(range.startOffset).find(isCaretHost) ||
        children.slice(0, range.startOffset).filter(isCaretHost).pop();
    if (!child) return;

    // At the end of the region the caret belongs at the end of the last block,
    // not thrown back to the start of the line it was sitting after.
    const edge = caretEdge(child, !atEnd);
    range.setStart(edge, atEnd ? nodeLength(edge) : 0);
    range.collapse(true);
    restoreSquireSelection(this._squire, range);
  }

  selectionHasFormat(tag) {
    if (!tag || !this._squire?.hasFormat) return false;
    try {
      return this._squire.hasFormat(tag);
    } catch {
      return false;
    }
  }

  // Squire sets its path to "(selection)" whenever the selection spans more than
  // one node, so asking the path answered "no" for every multi-block selection.
  // Both boundaries must land in the same matching element, or a selection that
  // merely starts in a list would report as being in one.
  pathHas(tag) {
    const range = getSquireSelection(this._squire);
    if (!range) return false;
    const selector = tag.toLowerCase();
    const start = matchAtBoundary(this.element, range.startContainer, range.startOffset, true, selector);
    return Boolean(start) &&
      start === matchAtBoundary(this.element, range.endContainer, range.endOffset, false, selector);
  }

  // Blocks stay out of this region for either of two reasons, and both are fixed
  // for the editor's life, which is why the toolbar can leave the controls out
  // rather than grey them. Either the parser would eject a block on the next page
  // load, or the author wrote the region as a line of text and richclay does not
  // rewrite what they wrote.
  blocksStayOut() {
    return (
      this.options.singleLine ||
      ejectsBlocks(this.element) ||
      keepsTextShape(this.element)
    );
  }

  // Advisory only: the markup is stable and saves correctly, it just will not
  // validate. Checked when the editor mounts and after any command, which covers
  // the ways an author actually produces one. Paste is deliberately not covered:
  // nothing hooks paste any more, and a console note is not worth reinstating a
  // hook that took three rounds to get wrong.
  warnOnBlockInInlineRegion() {
    if (this._warnedInlineBlock || !isInlineTag(this.element)) return;
    if (!hasBlockDescendant(this.element)) return;
    this._warnedInlineBlock = true;
    const tag = this.element.nodeName.toLowerCase();
    console.warn(
      `richclay: a block element inside <${tag} editable> is not valid HTML. It stays where it is ` +
        "and saves correctly, but a validator will flag it. Put the editable attribute on a block " +
        "element if you want blocks here.",
      this.element
    );
  }

  toggleFormat(tag, addMethod, removeMethod) {
    if (this.selectionHasFormat(tag)) return this._squire[removeMethod]();
    return this._squire[addMethod]();
  }

  toggleList(tag) {
    if (this.pathHas(tag)) return this._squire.removeList();
    return tag === "UL" ? this._squire.makeUnorderedList() : this._squire.makeOrderedList();
  }

  indent() {
    if (this.pathHas("UL") || this.pathHas("OL")) return this._squire.increaseListLevel();
    return this._squire.increaseQuoteLevel();
  }

  outdent() {
    if (this.pathHas("UL") || this.pathHas("OL")) return this._squire.decreaseListLevel();
    return this._squire.decreaseQuoteLevel();
  }

  setBlockType(tag) {
    const target = tag.toUpperCase();
    if (target === "BLOCKQUOTE") return this._squire.increaseQuoteLevel();

    return this._squire.modifyBlocks(fragment => {
      const doc = this.element.ownerDocument;
      const output = doc.createDocumentFragment();

      Array.from(fragment.childNodes).forEach(node => {
        if (node.nodeType !== 1) {
          output.appendChild(node);
          return;
        }

        if (node.nodeName === target) {
          output.appendChild(node);
          return;
        }

        const replacement = doc.createElement(target);
        while (node.firstChild) replacement.appendChild(node.firstChild);
        output.appendChild(replacement);
      });

      return output;
    });
  }

  openLinkDialog() {
    this.saveSelection();
    this.closeLinkDialog();
    this.linkPopover?.hide();

    const doc = this.element.ownerDocument;
    const existingLink = this.currentLinkElement();
    const existing = existingLink?.getAttribute("href") || "";
    const dialog = doc.createElement("form");
    const labelId = `richclay-link-label-${++dialogSeq}`;
    dialog.className = "richclay-dialog";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", labelId);
    dialog.setAttribute("data-richclay-dialog", "");
    markChrome(dialog);
    dialog.setAttribute("save-remove", "");
    dialog.innerHTML = `
      <div class="richclay-dialog-title" id="${labelId}">${existingLink ? "Edit link" : "Insert link"}</div>
      <label class="richclay-field">
        <span>URL</span>
        <input class="richclay-input" name="url" type="text" inputmode="url" autocomplete="url" placeholder="https://example.com">
      </label>
      <div class="richclay-dialog-actions">
        ${existingLink && !this.options.linkLabel ? '<button type="button" class="richclay-secondary" data-richclay-remove-link>Remove link</button>' : ""}
        <button type="button" class="richclay-secondary" data-richclay-cancel>Cancel</button>
        <button type="submit" class="richclay-primary">Apply</button>
      </div>
    `;

    const close = () => {
      this.closeLinkDialog();
      this.toolbar?.update();
      this.focus();
      this.updateLinkPopover();
    };

    const remove = () => {
      this.restoreSelection();
      this.removeLinkElement(this.currentLinkElement());
      close();
    };

    // Cancel puts the selection back where the form found it, so the link bar returns for
    // the same link. Focus comes first: focusing the editor can move the selection.
    const cancel = () => {
      close();
      this.restoreSelection();
      this.updateLinkPopover();
    };

    dialog.addEventListener("submit", event => {
      event.preventDefault();
      const data = new FormData(dialog);
      const value = String(data.get("url") || "").trim();
      if (!value && existingLink) {
        remove();
        return;
      }
      const href = normalizeUrl(value);
      if (!href) {
        announce(this.liveRegion, "Enter a valid URL");
        return;
      }
      this.restoreSelection();
      // A link label holds at most one link, covering the whole label: the address
      // always goes on the whole field, and Squire's makeLink replaces any link in it.
      const anchor = this.options.linkLabel ? null : this.currentLinkElement();
      if (this.options.linkLabel) {
        const range = this.element.ownerDocument.createRange();
        range.selectNodeContents(this.element);
        this._squire.setSelection(range);
      }
      if (anchor) {
        this.selectElement(anchor);
        this._squire.saveUndoState();
        anchor.setAttribute("href", href);
      } else {
        this._squire.makeLink(href);
      }
      announce(this.liveRegion, "Link applied");
      close();
    });
    dialog.querySelector("[data-richclay-remove-link]")?.addEventListener("click", remove);
    dialog.querySelector("[data-richclay-cancel]").addEventListener("click", cancel);
    dialog.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        event.preventDefault();
        cancel();
      } else if (event.key === "Tab") {
        trapTab(event, dialog);
      }
    });

    // A modal <dialog> makes everything outside it inert, so the form mounts inside
    // the editor's own dialog when it has one. As a manual popover it renders in the
    // top layer, where no transformed or clipping ancestor can move or cut it.
    const host = this.element.closest("dialog") || doc.body;
    const layered = typeof dialog.showPopover === "function";
    if (layered) dialog.setAttribute("popover", "manual");
    pin(dialog, "position", "fixed");
    pin(dialog, "inset", "0px auto auto 0px");
    pin(dialog, "margin", "0");
    pin(dialog, "overflow", "visible");
    host.appendChild(dialog);
    if (layered) dialog.showPopover();
    this.dialog = dialog;

    const win = doc.defaultView || globalThis;
    const reposition = () => this.positionLinkDialog();
    const dismiss = event => {
      if (!dialog.contains(event.target)) this.closeLinkDialog();
    };
    const resizeObserver = typeof win.ResizeObserver === "function" ? new win.ResizeObserver(reposition) : null;
    resizeObserver?.observe(dialog);
    doc.addEventListener("scroll", reposition, { capture: true, passive: true });
    win.addEventListener("resize", reposition, { passive: true });
    win.visualViewport?.addEventListener("resize", reposition, { passive: true });
    win.visualViewport?.addEventListener("scroll", reposition, { passive: true });
    doc.addEventListener("pointerdown", dismiss, true);
    this.dialogCleanup = () => {
      resizeObserver?.disconnect();
      doc.removeEventListener("scroll", reposition, { capture: true });
      win.removeEventListener("resize", reposition);
      win.visualViewport?.removeEventListener("resize", reposition);
      win.visualViewport?.removeEventListener("scroll", reposition);
      doc.removeEventListener("pointerdown", dismiss, true);
    };
    this.positionLinkDialog();

    const input = dialog.querySelector("input");
    input.value = existing;
    input.focus();
    input.select();
    return KEEP_FOCUS;
  }

  // Unwraps one link and keeps its text, as one undo step. The link form's Remove and the
  // link popover's Remove are this same call.
  removeLinkElement(anchor) {
    if (!anchor || !this.element.contains(anchor)) return false;
    this.selectElement(anchor);
    this._squire.removeLink();
    announce(this.liveRegion, "Link removed");
    return true;
  }

  updateLinkPopover() {
    if (this.options.linkPopover === false || this.options.readOnly || !this._squire) return;
    if (!this.linkPopover) {
      if (this.dialog || !this.currentLinkElement()) return;
      this.linkPopover = new LinkPopover(this);
    }
    this.linkPopover.update();
  }

  currentLinkElement() {
    const range = getSquireSelection(this._squire);
    if (!range || !this.element.contains(range.commonAncestorContainer)) return null;
    if (range.collapsed) {
      const node = range.startContainer;
      const anchor = (node.nodeType === 1 ? node : node.parentElement)?.closest("a[href]");
      return anchor && anchor !== this.element && this.element.contains(anchor) ? anchor : null;
    }
    for (const anchor of this.element.querySelectorAll("a[href]")) {
      const contents = anchor.ownerDocument.createRange();
      let first = anchor;
      let last = anchor;
      while (first.firstChild) first = first.firstChild;
      while (last.lastChild) last = last.lastChild;
      contents.setStart(first, 0);
      contents.setEnd(last, last.nodeType === 3 ? last.length : last.childNodes.length);
      if (
        range.compareBoundaryPoints(range.END_TO_START, contents) < 0 &&
        range.compareBoundaryPoints(range.START_TO_END, contents) > 0
      ) return anchor;
    }
    return null;
  }

  currentLinkHref() {
    const anchor = this.currentLinkElement();
    return anchor ? anchor.getAttribute("href") || "" : "";
  }

  selectElement(node) {
    const range = node.ownerDocument.createRange();
    range.selectNode(node);
    this._squire.setSelection(range);
    this.saveSelection();
    return range;
  }

  // The selected text, or the caret, as the dialog's anchor. A saved range keeps
  // tracking the text it covers, so this stays right as the page scrolls.
  linkAnchorRect() {
    const range = this.savedSelection;
    if (typeof range?.getClientRects === "function") {
      const rects = [...range.getClientRects()].filter(rect => rect.width || rect.height);
      if (rects.length) return range.collapsed ? rects[0] : range.getBoundingClientRect();
    }
    const button = this.toolbar?.items.find(item => item.def.id === "link")?.button;
    return (button || this.toolbar?.root || this.element).getBoundingClientRect();
  }

  positionLinkDialog() {
    const dialog = this.dialog;
    if (!dialog) return;
    const win = dialog.ownerDocument.defaultView || globalThis;
    const placement = placePopover({
      anchor: this.linkAnchorRect(),
      box: { width: dialog.offsetWidth || 0, height: dialog.offsetHeight || 0 },
      viewport: {
        width: win.visualViewport?.width ?? win.innerWidth,
        height: win.visualViewport?.height ?? win.innerHeight
      }
    });
    dialog.setAttribute("data-richclay-side", placement.side);
    dialog.style.setProperty("--richclay-dialog-arrow", `${Math.round(placement.arrow)}px`);
    pin(dialog, "transform", `translate(${Math.round(placement.x)}px, ${Math.round(placement.y)}px)`);
  }

  closeLinkDialog() {
    this.dialogCleanup?.();
    this.dialogCleanup = null;
    this.dialog?.remove();
    this.dialog = null;
  }

  ensureMarker() {
    // The marker exists so an element mounted through an explicit selector is
    // still recognized on the next pass. What decides that is not whether the
    // element matches the selector but whether the watcher would adopt it again: a
    // custom element carrying a bare `editable` matches and is still refused by the
    // host guard, so with no marker its editor died on the first node replacement
    // and never came back. Stamping makes the guard pass, so the two agree.
    if (!isMountable(this.element)) {
      // Record that WE invented this marker. Without it, cleanup cannot tell an
      // element the author marked from one richclay stamped, so it either leaves
      // ours behind forever (the element stays adoptable on every later load,
      // and the attribute reaches the saved file) or strips theirs (silently
      // breaking a region they asked for). Same provenance idea as
      // data-richclay-runtime-contenteditable just below.
      this.element.setAttribute("data-richclay-runtime-marker", "true");
      this.element.setAttribute("data-richclay", "");
    }
  }

  setupEditorAttributes() {
    this.element.classList.add(
      this.options.inline ? "richclay-inline" : "richclay-editor",
      "richclay-active"
    );
    this.element.setAttribute("data-richclay-active", "true");

    if (!this.element.hasAttribute("data-richclay-runtime-contenteditable")) {
      const original = this.element.getAttribute("contenteditable");
      if (original === null) {
        this.element.setAttribute("data-richclay-runtime-contenteditable", "true");
      } else if (original !== "true" && original !== "") {
        // A bare contenteditable attribute is the "true" state; only meaningful
        // non-default values are recorded for restore.
        this.element.setAttribute("data-richclay-runtime-contenteditable", original);
      }
    }
    this.element.setAttribute("contenteditable", "true");

    if (!this.element.hasAttribute("role")) {
      setRuntimeAttribute(this.element, "role", "textbox", "data-richclay-runtime-role");
    }
    if (!this.element.hasAttribute("aria-multiline")) {
      setRuntimeAttribute(
        this.element,
        "aria-multiline",
        this.options.singleLine ? "false" : "true",
        "data-richclay-runtime-aria-multiline"
      );
    }

    // Squire owns this region's undo stack. Mark the region so Hyperclay's
    // optional page-level undo (hyper-undo) defers to Squire instead of fighting
    // it. Runtime-only: stripped on save, re-applied on the next edit-mode load.
    if (!this.element.hasAttribute("no-undo")) {
      setRuntimeAttribute(this.element, "no-undo", "", "data-richclay-runtime-no-undo");
    }

    if (this.options.placeholder) {
      this.element.setAttribute("data-richclay-placeholder", this.options.placeholder);
      // One description for the life of the instance. A second call that built
      // another would orphan the first: destroy() removes only the node this
      // points at, and removeRuntimeDescribedBy clears only the id named by the
      // runtime attribute, both of which the second call has overwritten. The
      // original node and a dangling aria-describedby would reach the saved page.
      // A morph can take the node itself away, so a detached one is put back
      // rather than replaced, which keeps its id and the wiring that names it.
      if (!this.description) {
        this.description = this.element.ownerDocument.createElement("div");
        this.description.id = `richclay-placeholder-${++dialogSeq}`;
        this.description.className = "richclay-sr-only";
        this.description.textContent = this.options.placeholder;
        this.description.setAttribute("data-richclay-live", "");
        markChrome(this.description);
      }
      if (!this.description.isConnected) {
        this.element.insertAdjacentElement("afterend", this.description);
      }
      // Outside the branch above, because a morph can strip the element's own
      // aria-describedby while leaving this node connected, and then the hint is
      // gone with nothing to notice it. connectDescription builds its id list
      // from a Set, so naming the same description twice costs nothing.
      connectDescription(this.element, this.description);
    }

    this.element.addEventListener("focus", this._onFocus);
    this.element.addEventListener("blur", this._onBlur);
    this.element.addEventListener("click", this._onLinkActivation, true);
    this.element.addEventListener("auxclick", this._onLinkActivation, true);
    this.element.addEventListener("clay:external-write", this._onExternalWrite);
  }

  cleanupEditorAttributes({ keepDom = false } = {}) {
    if (!keepDom) removeRuntimeState(this.element, "destroy");
    this.element.removeEventListener("focus", this._onFocus);
    this.element.removeEventListener("blur", this._onBlur);
    this.element.removeEventListener("click", this._onLinkActivation, true);
    this.element.removeEventListener("auxclick", this._onLinkActivation, true);
    this.element.removeEventListener("clay:external-write", this._onExternalWrite);
  }

  // A link label holds one link around all of its text, the shape its store reads back
  // as text and address. Squire puts a space typed at a link's end, and a paste, outside
  // the link (or splits it), and typing over the whole label deletes it; each of those
  // is folded back into the one link, with the caret kept at the same character.
  keepOneLink() {
    const element = this.element;
    const doc = element.ownerDocument;
    const first = element.querySelector("a[href]");
    const href = first?.getAttribute("href") ?? this._labelHref;
    if (!href) return;
    this._labelHref = href;
    const text = element.textContent.replace(/\u200B/g, "").replace(/\s*[\r\n]+\s*/g, " ");
    const only = element.childNodes.length === 1 && element.firstChild === first ? first : null;
    const clean = only && [...only.childNodes].every(node => node.nodeType === 3) && !only.textContent.includes("\u200B");
    if (clean || !text) return;

    const selection = this._squire.getSelection();
    let caret = text.length;
    if (selection && element.contains(selection.startContainer)) {
      const before = doc.createRange();
      before.selectNodeContents(element);
      before.setEnd(selection.startContainer, selection.startOffset);
      caret = before.toString().replace(/\u200B/g, "").replace(/\s*[\r\n]+\s*/g, " ").length;
    }
    this._squire.modifyDocument(() => {
      const anchor = first ?? doc.createElement("a");
      if (!first) anchor.setAttribute("href", href);
      anchor.replaceChildren(doc.createTextNode(text));
      element.replaceChildren(anchor);
      const range = doc.createRange();
      range.setStart(anchor.firstChild, Math.min(caret, text.length));
      range.collapse(true);
      this._squire.setSelection(range);
    });
  }

  bindSquire() {
    const input = () => {
      this.saveSelection();
      this.updatePlaceholder();
      this.options.onChange?.(this.getHTML());
      this.toolbar?.update();
      this.updateLinkPopover();
    };
    const pathChange = event => {
      this.path = event.detail?.path || this._squire.getPath?.() || "";
      this.saveSelection();
      this.toolbar?.update();
      this.updateLinkPopover();
    };
    const selection = () => {
      this.saveSelection();
      this.toolbar?.update();
      if (this.options.toolbarOnSelect) this.updateFloatVisibility();
      this.updateLinkPopover();
    };
    const undoState = () => this.toolbar?.update();

    [
      ["input", input],
      ["pathChange", pathChange],
      ["select", selection],
      ["cursor", selection],
      ["undoStateChange", undoState]
    ].forEach(([type, listener]) => {
      this._squire.addEventListener(type, listener);
      this._squireListeners.push([type, listener]);
    });
  }

  renderToolbar() {
    if (!this.active || this.options.readOnly) return;
    if (this.options.inline) {
      // Inline toolbars are floating and focus-scoped; if one is open, rebuild
      // it so registry changes show up immediately.
      if (this.float) {
        this.teardownFloatingToolbar();
        this.ensureFloatingToolbar();
      }
      return;
    }
    this.toolbar?.destroy();
    this.toolbar = null;
    const controls = this.resolveToolbarControls(this.options.toolbar);
    if (!controls.length) return;
    this.toolbar = new Toolbar(this, controls, {
      toolbarContainer: this.options.toolbarContainer
    });
  }

  ensureFloatingToolbar() {
    if (this.float || !this.active || this.options.readOnly) return;
    const controls = this.resolveToolbarControls(this.options.toolbar);
    if (!controls.length) return;
    this.float = new FloatingToolbar(this, controls);
    // Blur on the editor doesn't fire when focus later leaves the toolbar or
    // link dialog directly (Alt+F10 then Tab away), so the shell watches its
    // own focusout too.
    this._onFloatFocusOut = event => this.scheduleFloatTeardown(event);
    this.float.root.addEventListener("focusout", this._onFloatFocusOut);
    // A press on non-focusable page chrome never blurs a contenteditable, so
    // blur/focusout alone can't dismiss the float. Watch the document
    // (capture, so stopped events still count) and dismiss on any pointer
    // press the editor doesn't own, releasing focus with it.
    this._onDocPointerDown = event => {
      if (this.ownsFocusTarget(event.target)) return;
      const doc = this.element.ownerDocument;
      if (doc.activeElement && this.ownsFocusTarget(doc.activeElement)) {
        doc.activeElement.blur?.();
      }
      this.teardownFloatingToolbar();
    };
    this.element.ownerDocument.addEventListener("pointerdown", this._onDocPointerDown, true);
    this.toolbar = this.float.toolbar;
    this.toolbar.update();
    if (this.options.toolbarOnSelect) this.updateFloatVisibility();
  }

  teardownFloatingToolbar() {
    if (!this.float) return;
    if (this._onFloatFocusOut) {
      this.float.root.removeEventListener("focusout", this._onFloatFocusOut);
      this._onFloatFocusOut = null;
    }
    if (this._onDocPointerDown) {
      this.element.ownerDocument.removeEventListener("pointerdown", this._onDocPointerDown, true);
      this._onDocPointerDown = null;
    }
    this.float.destroy();
    this.float = null;
    this.toolbar = null;
  }

  scheduleFloatTeardown(event) {
    const next = event?.relatedTarget;
    if (next && this.ownsFocusTarget(next)) return;
    const doc = this.element.ownerDocument;
    const win = doc.defaultView || globalThis;
    win.setTimeout(() => {
      const active = doc.activeElement;
      if (active && this.ownsFocusTarget(active)) return;
      this.teardownFloatingToolbar();
    }, 0);
  }

  ownsFocusTarget(node) {
    return (
      node === this.element ||
      this.element.contains(node) ||
      Boolean(this.float?.root.contains(node)) ||
      Boolean(this.dialog?.contains(node)) ||
      Boolean(this.linkPopover?.root?.contains(node))
    );
  }

  updateFloatVisibility() {
    if (!this.float) return;
    const range = this.savedSelection;
    this.float.setVisible(Boolean(range && !range.collapsed));
  }

  resolveToolbarControls(toolbar) {
    if (toolbar === false || toolbar === null || toolbar === "none") return [];
    const requested = Array.isArray(toolbar) ? toolbar : presets[toolbar] || presets.standard;

    return requested.map(item => {
      if (typeof item === "string") {
        const def = this.registry.get(item);
        if (!def) throw new Error(`Unknown RichClay toolbar control: ${item}`);
        return def;
      }
      if (item?.type === "separator") return item;
      validateButton(item);
      return item;
    });
  }

  installShortcuts() {
    // Shortcuts are a capability of the registry plus this instance's toolbar
    // definitions, not of the visible toolbar: toolbar:false keeps shortcuts,
    // and inline toolbar defs win over registry defs with the same id.
    const seen = new Set();
    // Single-line editors must never gain block commands: registry defaults are
    // filtered to the inline preset (explicit toolbar defs still always bind).
    const registryDefs = [...this.registry.values()].filter(
      def =>
        (!this.options.singleLine || presets.inline.includes(def.id)) &&
        (!this.options.linkLabel || LINK_LABEL_CONTROLS.includes(def.id))
    );
    const defs = [...this.resolveToolbarControls(this.options.toolbar), ...registryDefs];
    defs.forEach(def => {
      if (def.type === "menu" || def.type === "separator") return;
      if (!def.shortcut || !def.id || seen.has(def.id)) return;
      // isDisabled is a property of the root, not of the selection, so a control
      // disabled here is disabled for this editor's whole life. Masked rather than
      // skipped, for the same reason as maskSquireBlockShortcuts: not installing
      // ours is what leaves Squire's own handler in charge.
      if (def.isDisabled?.(this)) {
        const masked = shortcutKey(def.shortcut, this.window);
        this._squire.setKeyHandler(masked, null);
        this._shortcutKeys.push(masked);
        return;
      }
      seen.add(def.id);
      const key = shortcutKey(def.shortcut, this.window);
      this._squire.setKeyHandler(key, (squire, event) => {
        event.preventDefault();
        this.runControl(def);
      });
      this._shortcutKeys.push(key);
    });
  }

  // Formatting typed into a link label would be dropped by the next save of the shared
  // store, which keeps only its text and address. Squire binds bold, italic and underline
  // on its own prototype, so each key is answered with preventDefault: a null handler
  // would hand it to the browser's own contenteditable formatting instead.
  maskFormattingShortcuts() {
    for (const def of this.registry.values()) {
      if (!def.shortcut || LINK_LABEL_CONTROLS.includes(def.id)) continue;
      const key = shortcutKey(def.shortcut, this.window);
      this._squire.setKeyHandler(key, (squire, event) => event.preventDefault());
      this._shortcutKeys.push(key);
    }
  }

  // macOS sends Ctrl+D and Ctrl+H to the browser's own forward/backward delete,
  // which merges two blocks by wrapping the moved text in a computed-style
  // <span> — permanent junk in an editor whose DOM is the saved document. Point
  // them at Squire's own handlers so they behave exactly like Delete and
  // Backspace. Reads Squire's key handler table; no-ops for other engines.
  // Squire binds Code to the platform modifier itself, on _keyHandlers' prototype,
  // so dropping richclay's own shortcut is not enough to retire it. An own
  // property of null shadows the inherited handler and the key falls through.
  maskSquireCodeShortcut() {
    const key = `${isApplePlatform(this.window) ? "Meta" : "Ctrl"}-d`;
    this._squire.setKeyHandler(key, null);
    this._shortcutKeys.push(key);
  }

  // Squire binds these on _keyHandlers' prototype, and richclay has no definition
  // carrying some of them, so filtering richclay's own shortcuts cannot reach
  // them: Mod+] kept building a <blockquote> in a <p editable> through every
  // round. An own property of null shadows the inherited handler and the key
  // falls through. The prefix must match the one Squire computed, which is why
  // the test harness has to agree about the platform.
  maskSquireBlockShortcuts() {
    if (!this.blocksStayOut()) return;
    const mod = isApplePlatform(this.window) ? "Meta" : "Ctrl";
    [`${mod}-]`, `${mod}-[`, `${mod}-Shift-8`, `${mod}-Shift-9`].forEach(key => {
      this._squire.setKeyHandler(key, null);
      this._shortcutKeys.push(key);
    });
  }

  // Squire's toggleCode() makes a block <pre> when the selection is collapsed,
  // which inside a heading or a paragraph root means a code block where no block
  // can legally go. Those regions get inline <code> instead.
  toggleCode() {
    if (!this.blocksStayOut()) return this._squire.toggleCode();
    if (this.selectionHasFormat("CODE")) return this._squire.changeFormat(null, { tag: "CODE" });
    return this._squire.changeFormat({ tag: "CODE" }, null);
  }

  installAppleDeleteKeys() {
    if (!isApplePlatform(this.window)) return;
    const handlers = this._squire._keyHandlers;
    if (!handlers) return;

    [["Ctrl-d", "Delete"], ["Ctrl-h", "Backspace"]].forEach(([key, native]) => {
      if (typeof handlers[native] !== "function") return;
      this._squire.setKeyHandler(key, handlers[native]);
      this._shortcutKeys.push(key);
      this._appleDeleteKeys.add(key.slice("Ctrl-".length));
    });
  }

  installSingleLineGuards() {
    ["Enter", "Shift-Enter"].forEach(key => {
      this._squire.setKeyHandler(key, (squire, event) => event.preventDefault());
      this._shortcutKeys.push(key);
    });
    // Belt for input paths that bypass keydown (IME confirm, mobile keyboards):
    // cancel paragraph/line-break insertions before Squire's own handler runs.
    this._onBeforeInput = event => {
      if (!this.element.contains(event.target)) return;
      // A link label also refuses the browser's own formatting commands (a mobile
      // selection menu's Bold, for one), which never pass through a keydown.
      const formats = this.options.linkLabel && event.inputType.startsWith("format");
      if (event.inputType === "insertParagraph" || event.inputType === "insertLineBreak" || formats) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    this.element.ownerDocument.addEventListener("beforeinput", this._onBeforeInput, true);
  }

  // The fidelity restore bypasses setHTML, so Squire's undo baseline is still
  // the empty document its constructor recorded; the first undo could wipe the
  // region. Rebase the stack on the restored content. This touches Squire
  // internals (property names survive its esbuild minify) and no-ops for other
  // engines, like the tests' FakeSquire.
  resetSquireUndoBaseline() {
    const squire = this._squire;
    if (!squire || !Array.isArray(squire._undoStack) || typeof squire.saveUndoState !== "function") {
      return;
    }
    squire._undoStack.length = 0;
    squire._undoStackLength = 0;
    squire._undoIndex = -1;
    squire._isInUndoState = false;
    squire.saveUndoState();
  }

  updatePlaceholder() {
    const view = createContentView(this.element, { capability: 'history', inherit: false });
    const text = view.text().replace(/\u200B/g, "").trim();
    const hasMeaningfulElement = view.root.querySelector("img, video, audio, iframe, table");
    const isEmpty = !text && !hasMeaningfulElement;
    this.element.classList.toggle("richclay-empty", isEmpty);
  }

  announceControl(def) {
    if (!this.liveRegion) return;
    const label = def.ariaLabel || def.label;
    if (!label) return;

    if (typeof def.isActive === "function") {
      announce(this.liveRegion, `${label} ${def.isActive(this) ? "on" : "off"}`);
    } else {
      announce(this.liveRegion, `${label} applied`);
    }
  }
}

export { presets };

function resolveElements(selector) {
  if (typeof selector === "string") {
    return Array.from(document.querySelectorAll(selector));
  }
  if (selector?.nodeType === 1) return [selector];
  return Array.from(selector || []);
}

// A selection anchored on the root itself, which is what Select All produces, has
// no ancestor chain to walk, so the boundary is first resolved down to the node it
// actually points at. Type selectors are ASCII case-insensitive in HTML documents
// but jsdom's closest() is not, hence the lowercased selector.
function matchAtBoundary(root, container, offset, first, selector) {
  let node = container;
  if (node === root) {
    const children = Array.from(root.childNodes).filter(isCaretHost);
    if (!children.length) return null;
    const index = first
      ? Math.min(offset, children.length - 1)
      : Math.min(Math.max(offset - 1, 0), children.length - 1);
    node = caretEdge(children[index], first);
  }
  const element = node?.nodeType === 1 ? node : node?.parentElement;
  const match = element?.closest?.(selector);
  return match && root.contains(match) && match !== root ? match : null;
}

// An ancestor conflicts when it holds a live editor, or when it would get one.
// closest() cannot answer the second half on its own: it stops at the nearest
// element matching the selector, and a custom element the host guard refuses
// matches it while never becoming an editor, which made <my-grid editable> block a
// genuine <h2 editable> inside it and left the page with no editors at all.
function closestConflictingAncestor(element) {
  let node = element.parentElement;
  while (node) {
    if (instances.has(node) || isMountable(node)) return node;
    node = node.parentElement;
  }
  return null;
}

// Two Squire instances mutating one subtree is undefined: the outer editor's
// repair restructures the inner one's content behind its back, inside the outer's
// modifyDocument, so the inner instance never sees it. Checked in both directions,
// because the editors can be constructed in either order.
// The single question every mount path asks: would the default watcher adopt this?
function isMountable(element) {
  return Boolean(element.matches?.(RICHCLAY_SELECTOR)) && isRichClayHost(element);
}

function conflictsWithExistingEditor(element) {
  const host = closestConflictingAncestor(element);
  const nested = Array.from(element.querySelectorAll?.(RICHCLAY_SELECTOR) || []).find(node =>
    instances.has(node)
  );
  const other = host || nested;
  if (!other) return false;
  console.warn(
    "richclay: nested editable regions are not supported, so this one was skipped. " +
      "Remove the editable attribute from either it or the other region.",
    element,
    other
  );
  return true;
}

function refuseUnsupportedRoot(element) {
  if (!isUnsupportedRootTag(element)) return false;
  console.warn(`richclay: ${unsupportedRootReason(element)} This region was skipped.`, element);
  return true;
}

function validateButton(def) {
  if (!def || !def.id) throw new Error("RichClay button definitions require an id.");
  if (def.type !== "menu" && typeof def.run !== "function") {
    throw new Error(`RichClay button "${def.id}" requires a run(editor) function.`);
  }
}

// Squire looks a handler up by "Alt-Ctrl-Meta-Shift-<key>", in that order, and
// binds Mod to Meta on Apple platforms and to Ctrl elsewhere. richclay used to
// bind both, which on macOS swallowed the Emacs bindings every text field has:
// Ctrl+D (delete forward), Ctrl+K (kill line), Ctrl+B, Ctrl+U, Ctrl+I.
function shortcutKey(shortcut, win) {
  const parts = shortcut.split("+");
  const keyPart = parts[parts.length - 1];
  const modifiers = new Set(parts.slice(0, -1).map(normalizeModifier));
  if (modifiers.delete("Mod")) modifiers.add(isApplePlatform(win) ? "Meta" : "Ctrl");

  const key =
    keyPart.length === 1
      ? modifiers.has("Shift")
        ? keyPart.toUpperCase()
        : keyPart.toLowerCase()
      : keyPart;
  const prefix = MODIFIER_ORDER.filter(modifier => modifiers.has(modifier)).join("-");
  return `${prefix ? `${prefix}-` : ""}${key}`;
}

function normalizeModifier(modifier) {
  return modifier === "Cmd" ? "Meta" : modifier;
}

function trapTab(event, container) {
  const focusables = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = container.ownerDocument.activeElement;
  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}
