import test from "node:test";
import assert from "node:assert/strict";
import { setupRealSquire } from "./real-squire.js";
import RichClay from "../src/richclay.js";
import { parseEditableOptions, stripRichClayFromClone } from "../src/hyperclay.js";

// A link label is one line of plain text with at most one link: the shape a site's shared
// store keeps as text and address. Every test runs the real Squire engine.

const mount = (markup, platform = "MacIntel") => {
  setupRealSquire(markup, platform);
  const element = document.querySelector("[editable]");
  return { element, editor: new RichClay(element, {}) };
};

const caretAt = (editor, node, offset) => {
  editor.squire.focus();
  const range = node.ownerDocument.createRange();
  range.setStart(node, offset);
  range.collapse(true);
  editor.squire.setSelection(range);
  editor.saveSelection();
};

const selectAll = (editor, element) => {
  const range = element.ownerDocument.createRange();
  range.selectNodeContents(element);
  editor.squire.setSelection(range);
  editor.saveSelection();
};

const press = (target, key, init = {}) => {
  const event = new window.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
  target.dispatchEvent(event);
  return event;
};

const selectText = (editor, node, start, end) => {
  const range = node.ownerDocument.createRange();
  range.setStart(node, start);
  range.setEnd(node, end);
  editor.squire.setSelection(range);
  editor.saveSelection();
};

const saved = element => {
  const clone = element.ownerDocument.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  return clone.querySelector("[editable]");
};

const FORMAT_TAGS = "b, strong, i, em, u, s, strike, code";

test("the link-label token makes a single-line region whose only controls are link, undo and redo", () => {
  setupRealSquire('<span editable="link-label">CV</span>');
  const element = document.querySelector("[editable]");
  const options = parseEditableOptions(element);
  assert.equal(options.singleLine, true);
  assert.equal(options.linkLabel, true);
  assert.deepEqual(options.toolbar, ["link", "undo", "redo"]);

  element.setAttribute("editable", "single-line");
  assert.equal(parseEditableOptions(element).linkLabel, undefined);
});

test("formatting shortcuts do nothing in a link label, on both platforms", () => {
  [["MacIntel", { metaKey: true }], ["Win32", { ctrlKey: true }]].forEach(([platform, mod]) => {
    const { element, editor } = mount('<span editable="link-label"><a href="cv.html">Curriculum vitae</a></span>', platform);
    selectAll(editor, element);
    for (const key of ["b", "i", "u"]) {
      const event = press(element, key, mod);
      assert.equal(event.defaultPrevented, true, `${platform} ${key} is taken from the browser`);
    }
    assert.equal(element.querySelectorAll(FORMAT_TAGS).length, 0, platform);
    assert.equal(saved(element).innerHTML, '<a href="cv.html">Curriculum vitae</a>', platform);
  });
});

test("an ordinary single-line region still formats with the same shortcut", () => {
  const { element, editor } = mount('<span editable="single-line"><a href="cv.html">Curriculum vitae</a></span>');
  selectAll(editor, element);
  press(element, "b", { metaKey: true });
  assert.ok(element.querySelectorAll("b, strong").length > 0);
});

const settle = () => new Promise(resolve => setTimeout(resolve, 0));

test("a paste into a link label lands as plain text, inside the one link", async () => {
  const { element, editor } = mount('<span editable="link-label"><a href="cv.html">CV</a></span>');
  caretAt(editor, element.querySelector("a").firstChild, 2);
  editor.squire.insertHTML('<b>full</b> <a href="https://example.org">record</a><i>!</i>', true);
  await settle();

  const region = saved(element);
  assert.equal(region.querySelectorAll(FORMAT_TAGS).length, 0);
  assert.equal(region.querySelectorAll("a").length, 1);
  assert.equal(region.querySelector("a").getAttribute("href"), "cv.html");
  assert.equal(region.innerHTML, '<a href="cv.html">CVfull record!</a>');
});

test("a paste over part of the link text stays inside the one link, with no block", async () => {
  const { element, editor } = mount('<span editable="link-label"><a href="cv.html">CV page</a></span>');
  selectText(editor, element.querySelector("a").firstChild, 0, 2);
  editor.squire.insertPlainText("Curriculum Vitae", true);
  await settle();
  assert.equal(saved(element).innerHTML, '<a href="cv.html">Curriculum Vitae page</a>');
});

test("text that lands after the link's end is folded back into the link", async () => {
  const { element, editor } = mount('<span editable="link-label"><a href="research.html">Research</a></span>');
  // What Squire's Space handler and the browser leave behind when someone types at the end.
  element.append(document.createTextNode(" Areas"));
  await settle();
  assert.equal(saved(element).innerHTML, '<a href="research.html">Research Areas</a>');
  assert.equal(editor.squire.getSelection().startContainer, element.querySelector("a").firstChild);
});

test("typing over the whole label keeps its address", async () => {
  const { element } = mount('<span editable="link-label"><a href="cv.html">CV</a></span>');
  element.replaceChildren(document.createTextNode("Curriculum vitae"));
  await settle();
  assert.equal(saved(element).innerHTML, '<a href="cv.html">Curriculum vitae</a>');
});

test("a link label offers no Remove, in the link form or the link bar", () => {
  const { element, editor } = mount('<span editable="link-label"><a href="cv.html">CV</a></span>');
  caretAt(editor, element.querySelector("a").firstChild, 1);
  editor.updateLinkPopover();
  assert.ok(document.querySelector("[data-richclay-link-popover] [data-richclay-link-edit]"));
  assert.equal(document.querySelector("[data-richclay-link-remove]"), null);
  editor.openLinkDialog();
  assert.equal(document.querySelector("[data-richclay-remove-link]"), null);
});

const submitForm = (form, url) => {
  form.querySelector("input").value = url;
  const previous = globalThis.FormData;
  globalThis.FormData = window.FormData;
  try {
    form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
  } finally {
    globalThis.FormData = previous;
  }
};

test("the link form never makes a second link in a link label", () => {
  const { element, editor } = mount('<span editable="link-label"><a href="cv.html">CV</a> and publications</span>');
  const tail = element.querySelector("a").nextSibling;
  selectText(editor, tail, 5, 17);
  editor.openLinkDialog();
  submitForm(document.querySelector("[data-richclay-dialog]"), "publications.html");

  const region = saved(element);
  assert.equal(region.querySelectorAll("a").length, 1);
  assert.equal(region.querySelector("a").getAttribute("href"), "publications.html");
  assert.equal(region.querySelector("a").textContent, "CV and publications");
});

test("a link form on an unlinked label links the whole label", () => {
  const { element, editor } = mount('<span editable="link-label">Curriculum vitae</span>');
  caretAt(editor, element.firstChild, 3);
  editor.openLinkDialog();
  submitForm(document.querySelector("[data-richclay-dialog]"), "cv.html");

  const region = saved(element);
  assert.equal(region.querySelectorAll("a").length, 1);
  assert.equal(region.querySelector("a").textContent, "Curriculum vitae");
});

test("the browser's own formatting commands are refused in a link label", () => {
  const { element, editor } = mount('<span editable="link-label"><a href="cv.html">CV</a></span>');
  selectAll(editor, element);
  for (const inputType of ["formatBold", "formatItalic", "formatUnderline"]) {
    const event = new window.InputEvent("beforeinput", { inputType, bubbles: true, cancelable: true });
    element.querySelector("a").dispatchEvent(event);
    assert.equal(event.defaultPrevented, true, inputType);
  }
  assert.equal(saved(element).innerHTML, '<a href="cv.html">CV</a>');
});

test("after the host rewrites a field, undo does not bring the older value back", async () => {
  const { element, editor } = mount('<span editable="link-label"><a href="cv.html">CV</a></span>');
  // What ClayJS does when the host reports a newer shared value: rewrite in place, then say so.
  element.querySelector("a").textContent = "Curriculum Vitae";
  element.dispatchEvent(new window.CustomEvent("clay:external-write"));
  await settle();

  // The person then types once: Squire takes a checkpoint before the keystroke.
  const text = element.querySelector("a").firstChild;
  caretAt(editor, text, text.length);
  editor.squire.saveUndoState(editor.squire.getSelection());
  text.appendData("!");
  await settle();

  editor.squire.undo();
  await settle();
  assert.equal(saved(element).innerHTML, '<a href="cv.html">Curriculum Vitae</a>');
});
