import test from "node:test";
import assert from "node:assert/strict";
import { setupDom, FakeSquire } from "./helpers.js";
import RichClay from "../src/richclay.js";
import { stripRichClayFromClone, parseEditableOptions } from "../src/hyperclay.js";

test("parseEditableOptions maps attribute tokens to options", () => {
  setupDom();
  const el = document.createElement("h1");
  assert.equal(parseEditableOptions(el), null);
  el.setAttribute("editable", "");
  assert.deepEqual(parseEditableOptions(el), { inline: true, singleLine: false, toolbarOnSelect: false });
  el.setAttribute("editable", "single-line toolbar-on-select");
  assert.deepEqual(parseEditableOptions(el), { inline: true, singleLine: true, toolbarOnSelect: true });
  el.setAttribute("editable", "single-line no-toolbar");
  assert.deepEqual(parseEditableOptions(el), { inline: true, singleLine: true, toolbarOnSelect: false, toolbar: false });
  el.setAttribute("editable", "bogus-token");
  assert.deepEqual(parseEditableOptions(el), { inline: true, singleLine: false, toolbarOnSelect: false });
});

test("inline activation does not mutate author content and adds no marker", () => {
  setupDom('<!doctype html><html><body><div editable><p class="lead" data-x="1">Hi <img src="a.png" alt=""> <span class="icon"></span><em>there</em></p></div></body></html>');
  const element = document.querySelector("[editable]");
  const before = element.innerHTML;
  const editor = new RichClay(element, { Squire: FakeSquire });
  assert.equal(editor.active, true);
  assert.equal(editor.options.inline, true);
  assert.equal(element.innerHTML, before);
  assert.equal(element.hasAttribute("data-richclay"), false);
  assert.equal(element.classList.contains("richclay-inline"), true);
  assert.equal(element.classList.contains("richclay-editor"), false);
});

test("inline editors mount a floating toolbar on focus and tear it down on blur", async () => {
  setupDom('<!doctype html><html><body><div editable><p>x</p></div></body></html>');
  const element = document.querySelector("[editable]");
  const editor = new RichClay(element, { Squire: FakeSquire });
  assert.equal(document.querySelector("[data-richclay-float]"), null);
  const shortcuts = editor.squire.commands.filter(c => Array.isArray(c) && c[0] === "shortcut");
  assert.equal(shortcuts.length > 0, true);

  element.dispatchEvent(new window.FocusEvent("focus"));
  const float = document.querySelector("[data-richclay-float]");
  assert.equal(float !== null, true);
  assert.equal(float.hasAttribute("snapshot-remove"), true);
  assert.equal(float.hasAttribute("save-remove"), true);
  assert.equal(float.querySelector("[data-richclay-toolbar]") !== null, true);

  element.dispatchEvent(new window.FocusEvent("blur"));
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(document.querySelector("[data-richclay-float]"), null);
});

test("a pointer press outside the editor dismisses the floating toolbar", () => {
  setupDom('<!doctype html><html><body><div editable><p>x</p></div><p id="outside">chrome</p></body></html>');
  const element = document.querySelector("[editable]");
  new RichClay(element, { Squire: FakeSquire });

  element.dispatchEvent(new window.FocusEvent("focus"));
  assert.equal(document.querySelector("[data-richclay-float]") !== null, true);

  // clicking non-focusable chrome fires no blur on a contenteditable, only a
  // pointer press: the document listener alone must dismiss the float
  document.getElementById("outside").dispatchEvent(new window.Event("pointerdown", { bubbles: true }));
  assert.equal(document.querySelector("[data-richclay-float]"), null);

  // presses the editor owns leave the float alone
  element.dispatchEvent(new window.FocusEvent("focus"));
  assert.equal(document.querySelector("[data-richclay-float]") !== null, true);
  element.firstElementChild.dispatchEvent(new window.Event("pointerdown", { bubbles: true }));
  assert.equal(document.querySelector("[data-richclay-float]") !== null, true);
});

test("single-line editors suppress Enter and set aria-multiline=false", () => {
  setupDom('<!doctype html><html><body><h1 editable="single-line">Title</h1></body></html>');
  const element = document.querySelector("[editable]");
  const editor = new RichClay(element, { Squire: FakeSquire });
  assert.equal(element.getAttribute("aria-multiline"), "false");
  const enterHandlers = editor.squire.commands.filter(
    c => Array.isArray(c) && c[0] === "shortcut" && (c[1] === "Enter" || c[1] === "Shift-Enter")
  );
  assert.equal(enterHandlers.length, 2);
  let prevented = false;
  enterHandlers[0][2](editor.squire, { preventDefault: () => { prevented = true; } });
  assert.equal(prevented, true);
});

test("single-line defaults to the inline toolbar preset", () => {
  setupDom('<!doctype html><html><body><h1 editable="single-line">T</h1></body></html>');
  const editor = new RichClay(document.querySelector("[editable]"), { Squire: FakeSquire });
  assert.equal(editor.options.toolbar, "inline");
  const controls = editor.resolveToolbarControls(editor.options.toolbar).map(def => def.id);
  assert.equal(controls.includes("bold"), true);
  assert.equal(controls.includes("blockMenu"), false);
  assert.equal(controls.includes("unorderedList"), false);
});

test("editable save round-trip keeps the attribute and leaves no runtime residue", () => {
  setupDom('<!doctype html><html><body><h1 editable="single-line">Title</h1></body></html>', "https://example.test/?editmode=true");
  window.hyperclay = { isEditMode: true, beforeSave() {} };
  new RichClay(document.querySelector("[editable]"), { Squire: FakeSquire });

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  const saved = clone.querySelector("[editable]");
  assert.equal(saved.getAttribute("editable"), "single-line");
  assert.equal(saved.hasAttribute("contenteditable"), false);
  assert.equal(saved.hasAttribute("inert-contenteditable"), false);
  assert.equal(saved.hasAttribute("data-richclay"), false);
  assert.equal(saved.hasAttribute("class"), false);
  assert.equal(saved.textContent, "Title");
});

test("save-strip unwraps a lone attribute-less P inside a single-line region", () => {
  setupDom(
    '<!doctype html><html><body><h1 editable="single-line" data-richclay-active="true"><p>Wrapped</p></h1></body></html>'
  );
  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  const saved = clone.querySelector("[editable]");
  assert.equal(saved.querySelector("p"), null);
  assert.equal(saved.textContent, "Wrapped");
});

test("single-line paste ingress flattens blocks to one line", () => {
  setupDom('<!doctype html><html><body><h1 editable="single-line">T</h1></body></html>');
  const editor = new RichClay(document.querySelector("[editable]"), { Squire: FakeSquire });
  const fragment = editor.squire.config.sanitizeToDOMFragment("<p>One</p><p>Two <strong>bold</strong></p><br>Three", editor.squire);
  const probe = document.createElement("div");
  probe.appendChild(fragment);
  assert.equal(probe.querySelector("p"), null);
  assert.equal(probe.querySelector("br"), null);
  assert.match(probe.textContent.replace(/\s+/g, " ").trim(), /^One Two bold Three$/);
  assert.equal(probe.querySelector("strong") !== null, true);
});

test("inline ingress keeps class, id, data attributes and images", () => {
  setupDom('<!doctype html><html><body><div editable><p>x</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[editable]"), { Squire: FakeSquire });
  const fragment = editor.squire.config.sanitizeToDOMFragment(
    '<p class="lead" id="p1" data-x="1">Hello <img src="a.png" alt="a"> <script>evil()</script></p>',
    editor.squire
  );
  const probe = document.createElement("div");
  probe.appendChild(fragment);
  const p = probe.querySelector("p");
  assert.equal(p.getAttribute("class"), "lead");
  assert.equal(p.getAttribute("id"), "p1");
  assert.equal(p.getAttribute("data-x"), "1");
  assert.equal(probe.querySelector("img") !== null, true);
  assert.equal(probe.querySelector("script"), null);
});

test("watch() mounts dynamically added editable elements", async () => {
  setupDom('<!doctype html><html><body></body></html>', "https://example.test/?editmode=true");
  window.hyperclay = { isEditMode: true, beforeSave() {} };
  RichClay.watch(window, { Squire: FakeSquire });

  const el = document.createElement("div");
  el.setAttribute("editable", "");
  el.innerHTML = "<p>New</p>";
  document.body.appendChild(el);
  await new Promise(resolve => setTimeout(resolve, 0));

  assert.equal(el.getAttribute("contenteditable"), "true");
  assert.equal(el.classList.contains("richclay-inline"), true);

  el.removeAttribute("editable");
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(el.hasAttribute("contenteditable"), false);
  assert.equal(el.classList.contains("richclay-inline"), false);
});

test("toolbar-on-select hides the floating toolbar until text is selected", () => {
  setupDom('<!doctype html><html><body><div editable="toolbar-on-select"><p>Some text</p></div></body></html>');
  const element = document.querySelector("[editable]");
  element.getBoundingClientRect = () => ({ top: 100, bottom: 140, left: 50, right: 400 });
  const editor = new RichClay(element, { Squire: FakeSquire });

  element.dispatchEvent(new window.FocusEvent("focus"));
  const float = document.querySelector("[data-richclay-float]");
  assert.equal(float.style.display, "none");

  const range = document.createRange();
  const text = element.querySelector("p").firstChild;
  range.setStart(text, 0);
  range.setEnd(text, 4);
  editor.squire.selection = range;
  editor.squire.fire("select");
  assert.equal(float.style.display === "none", false);

  editor.squire.selection.collapse(true);
  editor.squire.fire("cursor");
  assert.equal(float.style.display, "none");
});

test("the floating toolbar's placement is inline and !important, so a page rule cannot show or move it", () => {
  setupDom('<!doctype html><html><body><div editable="toolbar-on-select"><p>Some text</p></div></body></html>');
  const element = document.querySelector("[editable]");
  element.getBoundingClientRect = () => ({ top: 100, bottom: 140, left: 50, right: 400 });
  const editor = new RichClay(element, { Squire: FakeSquire });

  element.dispatchEvent(new window.FocusEvent("focus"));
  const float = document.querySelector("[data-richclay-float]");
  assert.equal(float.style.getPropertyValue("display"), "none");
  assert.equal(float.style.getPropertyPriority("display"), "important");

  const range = document.createRange();
  const text = element.querySelector("p").firstChild;
  range.setStart(text, 0);
  range.setEnd(text, 4);
  editor.squire.selection = range;
  editor.squire.fire("select");
  assert.equal(float.style.getPropertyValue("display"), "");
  assert.match(float.style.getPropertyValue("transform"), /^translate\(/);
  assert.equal(float.style.getPropertyPriority("transform"), "important");
  assert.equal(float.style.getPropertyValue("visibility"), "");
});

test("Alt+F10 opens and focuses the floating toolbar", () => {
  setupDom('<!doctype html><html><body><div editable><p>x</p></div></body></html>');
  const element = document.querySelector("[editable]");
  new RichClay(element, { Squire: FakeSquire });

  element.dispatchEvent(new window.KeyboardEvent("keydown", { key: "F10", altKey: true }));
  const float = document.querySelector("[data-richclay-float]");
  assert.equal(float !== null, true);
  assert.equal(document.activeElement?.classList.contains("richclay-button"), true);
});

test("the floating toolbar is stripped from saves", () => {
  setupDom('<!doctype html><html><body><div editable><p>x</p></div></body></html>', "https://example.test/?editmode=true");
  window.hyperclay = { isEditMode: true, beforeSave() {} };
  const element = document.querySelector("[editable]");
  new RichClay(element, { Squire: FakeSquire });
  element.dispatchEvent(new window.FocusEvent("focus"));
  assert.equal(document.querySelector("[data-richclay-float]") !== null, true);

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  assert.equal(clone.querySelector("[data-richclay-float]"), null);
  assert.equal(clone.querySelector("[data-richclay-toolbar]"), null);
});

// Not installing richclay's own binding is what leaves Squire's inherited handler
// in charge, so the block keys are masked with an own null rather than skipped.
test("single-line editors mask the block-command shortcuts", () => {
  setupDom('<!doctype html><html><body><h1 editable="single-line">T</h1></body></html>');
  const editor = new RichClay(document.querySelector("[editable]"), { Squire: FakeSquire });
  const bindings = new Map(
    editor.squire.commands
      .filter(c => Array.isArray(c) && c[0] === "shortcut")
      .map(c => [c[1], c[2]])
  );
  assert.equal(typeof bindings.get("Ctrl-b"), "function");
  ["Ctrl-Shift-8", "Ctrl-Shift-9", "Ctrl-]", "Ctrl-["].forEach(key => {
    assert.equal(bindings.get(key), null, key);
  });
});

test("registerButton on a focused inline editor rebuilds the floating toolbar", () => {
  setupDom('<!doctype html><html><body><div editable><p>x</p></div></body></html>');
  const element = document.querySelector("[editable]");
  const editor = new RichClay(element, { Squire: FakeSquire });
  element.dispatchEvent(new window.FocusEvent("focus"));
  assert.equal(document.querySelector("[data-richclay-float]") !== null, true);

  // registerButton triggers one rebuild; pointing the toolbar at the new id
  // (the documented pattern) triggers another. Neither may orphan the shell.
  editor.registerButton({ id: "zap", label: "Zap", run: () => {} });
  assert.equal(document.querySelector("[data-richclay-float]") !== null, true);
  assert.equal(editor.float !== null, true);
  assert.equal(editor.toolbar !== null, true);

  editor.options.toolbar = ["bold", "zap"];
  editor.renderToolbar();
  const float = document.querySelector("[data-richclay-float]");
  assert.equal(float !== null, true);
  assert.equal(float.querySelector('[data-richclay-control="zap"]') !== null, true);
  assert.equal(editor.float !== null, true);
  assert.equal(editor.toolbar !== null, true);
});

test("the float tears down when focus leaves via the toolbar", async () => {
  setupDom('<!doctype html><html><body><div editable><p>x</p></div><input id="outside"></body></html>');
  const element = document.querySelector("[editable]");
  new RichClay(element, { Squire: FakeSquire });
  element.dispatchEvent(new window.KeyboardEvent("keydown", { key: "F10", altKey: true }));
  const float = document.querySelector("[data-richclay-float]");
  assert.equal(float !== null, true);
  assert.equal(document.activeElement?.classList.contains("richclay-button"), true);

  document.getElementById("outside").focus();
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(document.querySelector("[data-richclay-float]"), null);
});

test("watch() keeps an editor alive when its element is moved, not removed", async () => {
  setupDom('<!doctype html><html><body><section id="a"></section><section id="b"></section></body></html>', "https://example.test/?editmode=true");
  window.hyperclay = { isEditMode: true, beforeSave() {} };
  RichClay.watch(window, { Squire: FakeSquire });

  const el = document.createElement("div");
  el.setAttribute("editable", "");
  el.innerHTML = "<p>Move me</p>";
  document.getElementById("a").appendChild(el);
  await new Promise(resolve => setTimeout(resolve, 0));
  const editorBefore = new RichClay(el, { Squire: FakeSquire });

  document.getElementById("b").appendChild(el);
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(el.getAttribute("contenteditable"), "true");
  const editorAfter = new RichClay(el, { Squire: FakeSquire });
  assert.equal(editorAfter, editorBefore);
});

test("a bare author contenteditable attribute round-trips like contenteditable=true", () => {
  setupDom('<!doctype html><html><body><div data-richclay contenteditable><p>x</p></div></body></html>');
  const element = document.querySelector("[data-richclay]");
  const editor = new RichClay(element, { Squire: FakeSquire, toolbar: "minimal" });
  assert.equal(element.hasAttribute("data-richclay-runtime-contenteditable"), false);

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  assert.equal(clone.querySelector("[data-richclay]").getAttribute("inert-contenteditable"), "true");

  editor.destroy();
  assert.equal(element.hasAttribute("contenteditable"), true);
});

test("a custom element carrying a bare editable attribute is left alone", () => {
  setupDom('<!doctype html><html><body><my-grid editable><p>rows</p></my-grid><h1 editable>title</h1></body></html>');
  const editors = RichClay.init(undefined, { Squire: FakeSquire });

  const custom = document.querySelector("my-grid");
  const heading = document.querySelector("h1");
  assert.equal(editors.length, 1);
  assert.equal(editors[0].element, heading);
  assert.equal(custom.getAttribute("data-richclay-active"), null);
  assert.equal(custom.getAttribute("contenteditable"), null);
});

test("editable=plain is a plain-text field and gets no rich text editor", () => {
  setupDom('<!doctype html><html><body><h1 editable="plain">title</h1><my-note clay-editable="plain">note</my-note><div editable><p>rich</p></div></body></html>');
  const editors = RichClay.init(undefined, { Squire: FakeSquire });

  assert.equal(editors.length, 1);
  assert.equal(editors[0].element, document.querySelector("div"));
  assert.equal(document.querySelector("h1").getAttribute("contenteditable"), null);
  assert.equal(document.querySelector("my-note").getAttribute("contenteditable"), null);
});

test("a custom element opts in with clay-editable", () => {
  setupDom('<!doctype html><html><body><my-note clay-editable><p>text</p></my-note></body></html>');
  const editors = RichClay.init(undefined, { Squire: FakeSquire });

  assert.equal(editors.length, 1);
  assert.equal(editors[0].element, document.querySelector("my-note"));
});

test("clay-editable is an alias, down to the options and the author's markup", () => {
  setupDom('<!doctype html><html><body><section clay-editable><p class="lead" data-x="1">Hi <img src="a.png" alt=""><em>there</em></p></section></body></html>');
  const element = document.querySelector("section");
  const before = element.innerHTML;
  const editors = RichClay.init(undefined, { Squire: FakeSquire });

  assert.equal(editors.length, 1);
  assert.equal(editors[0].element, element);
  // The whole point of the escape hatch. A spelling that mounts the card editor
  // runs its sanitizer over the live DOM here and takes the class, the data
  // attribute and the image with it, which is the damage this release prevents.
  assert.equal(editors[0].options.inline, true);
  assert.equal(element.innerHTML, before);
  assert.equal(element.classList.contains("richclay-inline"), true);
  assert.equal(element.classList.contains("richclay-editor"), false);
});

test("clay-editable carries the same option tokens as editable", () => {
  setupDom('<!doctype html><html><body><h1 clay-editable="single-line toolbar-on-select">Title</h1></body></html>');
  const el = document.querySelector("h1");
  assert.deepEqual(parseEditableOptions(el), {
    inline: true,
    singleLine: true,
    toolbarOnSelect: true
  });

  const editor = new RichClay(el, { Squire: FakeSquire });
  assert.equal(editor.options.singleLine, true);
  el.innerHTML = "<div>one</div><div>two</div>";
  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  assert.equal(clone.querySelector("h1").innerHTML, "one two");
});

test("watch() follows clay-editable in both directions", async () => {
  setupDom('<!doctype html><html><body><section><p>text</p></section></body></html>', "https://example.test/?editmode=true");
  window.hyperclay = { isEditMode: true, beforeSave() {} };
  RichClay.watch(window, { Squire: FakeSquire });

  const el = document.querySelector("section");
  el.setAttribute("clay-editable", "");
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(el.getAttribute("contenteditable"), "true");

  el.removeAttribute("clay-editable");
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(el.hasAttribute("contenteditable"), false);
  assert.equal(el.classList.contains("richclay-inline"), false);
  assert.equal(el.hasAttribute("data-richclay-active"), false);
});

test("watch() unmounts a custom element whose opt-in marker is removed", async () => {
  setupDom('<!doctype html><html><body><my-grid editable><p>rows</p></my-grid></body></html>', "https://example.test/?editmode=true");
  window.hyperclay = { isEditMode: true, beforeSave() {} };
  const grid = document.querySelector("my-grid");
  RichClay.init("my-grid", { Squire: FakeSquire });
  RichClay.watch(window, { Squire: FakeSquire });

  // The marker is the opt-in. Removing it has to tear the editor down: the bare
  // `editable` beside it still matches the selector, so deciding by the selector
  // alone left the element mounted and saved its chrome into the author's file.
  grid.removeAttribute("data-richclay");
  await new Promise(resolve => setTimeout(resolve, 0));

  assert.equal(grid.hasAttribute("contenteditable"), false);
  assert.equal(grid.hasAttribute("data-richclay-active"), false);
  assert.equal(grid.classList.contains("richclay-inline"), false);
});

test("a skipped custom element does not block a genuine editable inside it", () => {
  setupDom('<!doctype html><html><body><my-grid editable><h2 editable>Title</h2></my-grid></body></html>');
  const editors = RichClay.init(undefined, { Squire: FakeSquire });

  assert.equal(editors.length, 1);
  assert.equal(editors[0].element, document.querySelector("h2"));
});

test("an explicitly mounted custom element survives being replaced", async () => {
  setupDom('<!doctype html><html><body><my-grid editable><p>rows</p></my-grid></body></html>', "https://example.test/?editmode=true");
  window.hyperclay = { isEditMode: true, beforeSave() {} };
  const grid = document.querySelector("my-grid");
  RichClay.init("my-grid", { Squire: FakeSquire });
  // Without a marker the default watcher refuses it, so a live-sync morph that
  // swaps the node kills the editor for good.
  assert.equal(grid.hasAttribute("data-richclay"), true);

  RichClay.watch(window, { Squire: FakeSquire });
  const replacement = grid.cloneNode(true);
  ["class", "contenteditable", "role", "aria-multiline"].forEach(a => replacement.removeAttribute(a));
  grid.replaceWith(replacement);
  await new Promise(resolve => setTimeout(resolve, 0));

  assert.equal(replacement.getAttribute("contenteditable"), "true");
});

test("an explicit selector still reaches a custom element", () => {
  setupDom('<!doctype html><html><body><my-grid editable><p>rows</p></my-grid></body></html>');
  const editors = RichClay.init("my-grid", { Squire: FakeSquire });

  assert.equal(editors.length, 1);
  assert.equal(editors[0].element, document.querySelector("my-grid"));
});

test("an opted-in custom element saves without a stray richclay marker", () => {
  setupDom('<!doctype html><html><body><my-note clay-editable><p>text</p></my-note></body></html>');
  RichClay.init(undefined, { Squire: FakeSquire });

  const note = document.querySelector("my-note");
  assert.equal(note.hasAttribute("data-richclay"), false);

  const clone = document.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  assert.equal(
    clone.querySelector("my-note").outerHTML,
    '<my-note clay-editable=""><p>text</p></my-note>'
  );
});
