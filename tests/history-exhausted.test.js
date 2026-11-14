import test from "node:test";
import assert from "node:assert/strict";
import { setupRealSquire } from "./real-squire.js";
import RichClay from "../src/richclay.js";
import { defaultButtons } from "../src/buttons.js";

const SOURCE = "<p>One</p>";
const rest = () => new Promise(resolve => setTimeout(resolve, 0));

// Squire ignores the first change after it takes over a root, and jsdom delivers
// the mount's own mutation records a tick later, so a test that edits must let
// that tick pass first, as a real page always does.
async function mount() {
  setupRealSquire(`<div editable>${SOURCE}</div>`);
  const element = document.querySelector("[editable]");
  const editor = new RichClay(element, {});
  const seen = [];
  document.addEventListener("richclay:history-exhausted", event => seen.push(event.detail.direction));
  await rest();
  return { element, editor, seen };
}

async function edit(editor, element) {
  const text = element.querySelector("p").firstChild;
  const range = document.createRange();
  range.setStart(text, 3);
  range.collapse(true);
  editor.squire.setSelection(range);
  editor.squire.insertPlainText("x", false);
  await rest();
}

test("a field with no step of its own hands Undo and Redo to the host and keeps its content", async () => {
  const { element, editor, seen } = await mount();
  assert.equal(editor.canHistory("undo"), false);
  assert.equal(editor.canHistory("redo"), false);
  editor.history("undo");
  editor.history("redo");
  assert.deepEqual(seen, ["undo", "redo"]);
  assert.equal(element.innerHTML, SOURCE);
});

test("a field with a step of its own uses it, and hands over only once it runs out", async () => {
  const { element, editor, seen } = await mount();
  await edit(editor, element);
  const edited = element.innerHTML;
  assert.notEqual(edited, SOURCE);
  assert.equal(editor.canHistory("undo"), true);

  editor.history("undo");
  assert.equal(element.textContent, "One");
  assert.deepEqual(seen, []);
  assert.equal(editor.canHistory("undo"), false);
  assert.equal(editor.canHistory("redo"), true);

  editor.history("undo");
  assert.deepEqual(seen, ["undo"]);
  assert.equal(element.textContent, "One");

  editor.history("redo");
  assert.equal(element.innerHTML, edited);
  assert.deepEqual(seen, ["undo"]);
  assert.equal(editor.canHistory("redo"), false);

  editor.history("redo");
  assert.deepEqual(seen, ["undo", "redo"]);
});

test("the browser's own undo input goes to the host when the field has no step", async () => {
  const { element, seen } = await mount();
  const event = new window.Event("beforeinput", { bubbles: true, cancelable: true });
  Object.defineProperty(event, "inputType", { value: "historyUndo" });
  element.querySelector("p").dispatchEvent(event);
  assert.deepEqual(seen, ["undo"]);
  assert.equal(event.defaultPrevented, true);
  assert.equal(element.innerHTML, SOURCE);
});

test("Ctrl-y redoes on Windows and Linux", async () => {
  setupRealSquire(`<div editable>${SOURCE}</div>`, "Win32");
  const element = document.querySelector("[editable]");
  const editor = new RichClay(element, {});
  assert.ok(editor._shortcutKeys.includes("Ctrl-y"));
  assert.ok(editor.squire._keyHandlers["Ctrl-y"], "the key is bound, not masked");
});

test("the toolbar's Undo and Redo buttons go through the same route", async () => {
  const { editor, seen } = await mount();
  const byName = Object.fromEntries(defaultButtons.map(button => [button.id, button]));
  byName.undo.run(editor);
  byName.redo.run(editor);
  assert.deepEqual(seen, ["undo", "redo"]);
});
