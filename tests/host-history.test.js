import test from "node:test";
import assert from "node:assert/strict";
import { setupRealSquire } from "./real-squire.js";
import RichClay from "../src/richclay.js";

const rest = () => new Promise(resolve => setTimeout(resolve, 0));

// Squire ignores the first change after it takes over a root, and jsdom delivers
// the mount's own mutation records a tick later, so a test that edits must let
// that tick pass first, as a real page always does.
async function mount(bodyHtml) {
  setupRealSquire(bodyHtml);
  const element = document.querySelector("[editable]");
  const seen = [];
  document.addEventListener("richclay:history-exhausted", event => seen.push(event.detail.direction));
  const editor = new RichClay(element, {});
  await rest();
  return { element, editor, seen };
}

function firstText(element) {
  return element.ownerDocument.createTreeWalker(element, 4).nextNode();
}

async function edit(editor, element, text) {
  const node = firstText(element);
  const range = element.ownerDocument.createRange();
  range.setStart(node, node.data.length);
  range.collapse(true);
  editor.squire.setSelection(range);
  editor.squire.insertPlainText(text, false);
  await rest();
}

async function withHostHistory(fn) {
  RichClay.hostHistory = true;
  try {
    return await fn();
  } finally {
    RichClay.hostHistory = false;
  }
}

test("with host history on, a field has no step of its own and announces the exhaustion", () =>
  withHostHistory(async () => {
    const { element, editor, seen } = await mount("<div editable><p>One</p></div>");
    await edit(editor, element, "x");
    const edited = element.innerHTML;
    assert.notEqual(edited, "<p>One</p>");

    assert.equal(editor.canHistory("undo"), false);
    assert.equal(editor.canHistory("redo"), false);
    editor.history("undo");
    assert.deepEqual(seen, ["undo"]);
    assert.equal(element.innerHTML, edited);
  }));

test("with host history off, the same edit is the field's own step and nothing is announced", async () => {
  const { element, editor, seen } = await mount("<div editable><p>One</p></div>");
  await edit(editor, element, "x");
  assert.equal(element.textContent, "Onex");
  assert.equal(editor.canHistory("undo"), true);

  editor.history("undo");
  assert.equal(element.textContent, "One");
  assert.deepEqual(seen, []);
});

test("a field the author marked no-undo keeps its own history when the host owns the page's", () =>
  withHostHistory(async () => {
    const { element, editor, seen } = await mount('<div editable no-undo><p>One</p></div>');
    await edit(editor, element, "x");
    assert.equal(editor.canHistory("undo"), true);

    editor.history("undo");
    assert.equal(element.textContent, "One");
    assert.deepEqual(seen, []);
  }));

test("a host can name a field that keeps its own history while it owns the page\u2019s", async () => {
  RichClay.hostHistory = true;
  try {
    const { element, editor } = await mount("<div editable><p>One</p></div>");
    await edit(editor, element, "x");
    assert.equal(editor.canHistory("undo"), false);

    RichClay.keepsOwnHistory = (field) => field === element;
    assert.equal(editor.canHistory("undo"), true);

    RichClay.keepsOwnHistory = null;
    assert.equal(editor.canHistory("undo"), false);
  } finally {
    RichClay.hostHistory = false;
    RichClay.keepsOwnHistory = null;
  }
});

test("a saved write round trips a single line field exactly", async () => {
  const A = "Alpha text";
  const { element, editor } = await mount(`<span editable="single-line">${A}</span>`);
  assert.equal(RichClay.savedContent(element), A);

  await edit(editor, element, " and more");
  const B = RichClay.savedContent(element);
  assert.notEqual(B, A);

  assert.equal(RichClay.setSavedContent(element, A), true);
  await rest();
  assert.equal(RichClay.savedContent(element), A);

  assert.equal(RichClay.setSavedContent(element, B), true);
  await rest();
  assert.equal(RichClay.savedContent(element), B);
});

test("a saved write round trips a link label and leaves its href alone", async () => {
  const href = "https://x.test/a";
  const { element, editor } = await mount(
    `<span editable="link-label"><a href="${href}">PDF guide</a></span>`
  );
  const A = RichClay.savedContent(element);
  assert.match(A, /PDF guide/);

  await edit(editor, element, " here");
  const B = RichClay.savedContent(element);
  assert.notEqual(B, A);

  assert.equal(RichClay.setSavedContent(element, A), true);
  await rest();
  assert.equal(RichClay.savedContent(element), A);
  assert.equal(element.querySelector("a").getAttribute("href"), href);

  assert.equal(RichClay.setSavedContent(element, B), true);
  await rest();
  assert.equal(RichClay.savedContent(element), B);
  assert.equal(element.querySelector("a").getAttribute("href"), href);
});

test("a saved write round trips a multi line field with two paragraphs and a link", async () => {
  const href = "https://x.test/b";
  const { element, editor } = await mount(
    `<div editable><p>First line</p><p>Second <a href="${href}">link</a></p></div>`
  );
  const A = RichClay.savedContent(element);
  assert.equal(element.querySelectorAll("p").length, 2);

  await edit(editor, element, " tail");
  const B = RichClay.savedContent(element);
  assert.notEqual(B, A);

  assert.equal(RichClay.setSavedContent(element, A), true);
  await rest();
  assert.equal(RichClay.savedContent(element), A);
  assert.equal(element.querySelectorAll("p").length, 2);
  assert.equal(element.querySelector("a").getAttribute("href"), href);

  assert.equal(RichClay.setSavedContent(element, B), true);
  await rest();
  assert.equal(RichClay.savedContent(element), B);
  assert.equal(element.querySelector("a").getAttribute("href"), href);
});

test("after a saved write, the field's own undo returns to the written content", async () => {
  const { element, editor } = await mount("<div editable><p>Original</p></div>");
  const written = "<p>Written</p>";

  assert.equal(RichClay.setSavedContent(element, written), true);
  await rest();
  assert.equal(RichClay.savedContent(element), written);

  await edit(editor, element, " more");
  const edited = RichClay.savedContent(element);
  assert.notEqual(edited, written);
  assert.match(edited, /more/);

  editor.squire.undo();
  await rest();
  assert.equal(RichClay.savedContent(element), written);
  assert.equal(element.textContent, "Written");

  editor.squire.undo();
  await rest();
  assert.equal(RichClay.savedContent(element), written);
});

test("a saved write reaches an unmounted field and refuses an element richclay does not own", async () => {
  setupRealSquire('<div editable><p>One</p></div><div class="other">Text</div>');
  const element = document.querySelector("[editable]");
  const other = document.querySelector(".other");
  assert.equal(element.hasAttribute("data-richclay-active"), false);

  assert.equal(RichClay.setSavedContent(element, "<p>Two</p>"), true);
  assert.equal(element.innerHTML, "<p>Two</p>");

  assert.equal(RichClay.setSavedContent(other, "<p>Changed</p>"), false);
  assert.equal(other.innerHTML, "Text");
  assert.equal(RichClay.setSavedContent(null, "<p>Changed</p>"), false);
});

test("richclay:mount bubbles to the document once per mount, and again after a remount", async () => {
  setupRealSquire("<div editable><p>One</p></div>");
  const element = document.querySelector("[editable]");
  const seen = [];
  document.addEventListener("richclay:mount", event => seen.push(event.target));

  const editor = new RichClay(element, {});
  await rest();
  assert.deepEqual(seen, [element]);

  editor.destroy();
  await rest();
  const again = new RichClay(element, {});
  await rest();
  assert.deepEqual(seen, [element, element]);
  again.destroy();
});

test("a saved write keeps a non-breaking space exactly as written", async () => {
  const A = "a&nbsp;b";
  const { element } = await mount('<span editable="single-line">ab</span>');

  assert.equal(RichClay.setSavedContent(element, A), true);
  await rest();
  assert.equal(RichClay.savedContent(element), A);
});

test("setSavedContent applies a passed morph at once, before it returns, instead of the page's async morph", async () => {
  const { element } = await mount("<div editable><p>One</p></div>");
  const calls = [];
  const view = element.ownerDocument.defaultView;
  const previous = view.clay;
  view.clay = { ...(previous || {}), morph: (root, html) => { calls.push("async"); return Promise.resolve().then(() => { root.innerHTML = html; }); } };
  try {
    const sync = (root, html) => { calls.push("sync"); root.innerHTML = html; };
    assert.equal(RichClay.setSavedContent(element, "<p>Two</p>", { morph: sync }), true);
    assert.equal(RichClay.savedContent(element), "<p>Two</p>", "the write landed before setSavedContent returned");
    assert.deepEqual(calls, ["sync"]);
  } finally {
    view.clay = previous;
  }
});

test("the browser’s own Undo in a form control inside a field stays with the control", () =>
  withHostHistory(async () => {
    const { element, seen } = await mount(
      '\u003cdiv editable\u003e\u003cp\u003eOne\u003c/p\u003e\u003cspan editor-ui contenteditable="false"\u003e\u003cinput value="query"\u003e\u003c/span\u003e\u003c/div\u003e'
    );
    const view = element.ownerDocument.defaultView;
    const control = element.querySelector("input");
    control.focus();
    const inControl = new view.InputEvent("beforeinput", { bubbles: true, cancelable: true, inputType: "historyUndo" });
    control.dispatchEvent(inControl);
    assert.equal(inControl.defaultPrevented, false);
    assert.deepEqual(seen, []);

    const inField = new view.InputEvent("beforeinput", { bubbles: true, cancelable: true, inputType: "historyUndo" });
    element.dispatchEvent(inField);
    assert.equal(inField.defaultPrevented, true);
    assert.deepEqual(seen, ["undo"]);
  }));
