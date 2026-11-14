import test from "node:test";
import assert from "node:assert/strict";
import { setupRealSquire } from "./real-squire.js";
import RichClay from "../src/richclay.js";

const rest = () => new Promise(resolve => setTimeout(resolve, 0));

const SOURCE = '<span editable="single-line"><a href="https://x.test/a">PDF</a></span>';

// Squire ignores the first change after it takes over a root, and jsdom delivers
// the mount's own mutation records a tick later, so a test that edits must let
// that tick pass first, as a real page always does.
async function mount() {
  setupRealSquire(SOURCE);
  const element = document.querySelector("[editable]");
  const editor = new RichClay(element, {});
  await rest();
  return { element, editor };
}

test("savedContent is the same before mount, while mounted and after destroy", async () => {
  setupRealSquire(SOURCE);
  const element = document.querySelector("[editable]");
  const before = RichClay.savedContent(element);
  assert.equal(typeof before, "string");
  assert.match(before, /PDF/);
  assert.doesNotMatch(before, /contenteditable/);
  assert.doesNotMatch(before, /data-richclay-active/);
  assert.doesNotMatch(before, /richclay-/);

  const editor = new RichClay(element, {});
  await rest();
  const mounted = RichClay.savedContent(element);
  assert.equal(mounted, before);
  assert.match(mounted, /PDF/);
  assert.doesNotMatch(mounted, /contenteditable/);
  assert.doesNotMatch(mounted, /data-richclay-active/);
  assert.doesNotMatch(mounted, /richclay-/);

  editor.destroy();
  const destroyed = RichClay.savedContent(element);
  assert.equal(destroyed, before);
  assert.match(destroyed, /PDF/);
  assert.doesNotMatch(destroyed, /contenteditable/);
  assert.doesNotMatch(destroyed, /data-richclay-active/);
  assert.doesNotMatch(destroyed, /richclay-/);
});

test("savedContent follows the text of a mounted field", async () => {
  const { element, editor } = await mount();
  const before = RichClay.savedContent(element);

  const text = element.querySelector("a").firstChild;
  const range = document.createRange();
  range.setStart(text, 3);
  range.collapse(true);
  editor.squire.setSelection(range);
  editor.squire.insertPlainText(" guide", false);
  await rest();

  const after = RichClay.savedContent(element);
  assert.notEqual(after, before);
  assert.match(after, /PDF/);
  assert.match(after, /guide/);
});

// A destroyed field keeps whatever the last edit left in the root, including a
// block Squire leaked into a single-line region, so the destroy path is where the
// forced active mark earns its keep: the saved string still has to be the one the
// mount would have written.
test("a field destroyed after an edit still saves what its mount would have saved", async () => {
  setupRealSquire('<span editable="single-line">Hello</span>');
  const element = document.querySelector("[editable]");
  const editor = new RichClay(element, {});
  await rest();

  const text = element.firstChild;
  const range = document.createRange();
  range.setStart(text, 5);
  range.collapse(true);
  editor.squire.setSelection(range);
  editor.squire.insertPlainText(" world", false);
  await rest();

  const mounted = RichClay.savedContent(element);
  editor.destroy();
  assert.equal(RichClay.savedContent(element), mounted);
  assert.doesNotMatch(mounted, /contenteditable/);
});

test("savedContent is undefined for a custom element richclay does not own", () => {
  setupRealSquire("<x-card editable>Card</x-card>");
  const element = document.querySelector("x-card");
  assert.equal(RichClay.savedContent(element), undefined);
  assert.equal(RichClay.savedContent(null), undefined);
});

test("savedContent leaves the original element untouched", async () => {
  const { element } = await mount();
  const before = element.outerHTML;
  RichClay.savedContent(element);
  assert.equal(element.outerHTML, before);
});

// Mounting rewrites the field element's own attributes with no edit: style is
// re-serialized, contenteditable and inert-contenteditable are consumed, and
// attribute order can change. None of that may read as a content change.
for (const source of [
  '<span editable="single-line" style="color:red">Untyped title</span>',
  '<span editable="single-line" contenteditable>Untyped title</span>',
  '<span editable="single-line" inert-contenteditable="true">Untyped title</span>',
  '<span editable="single-line" inert-contenteditable="false" class="title">Untyped title</span>',
]) {
  test(`savedContent ignores what mounting does to the field's own attributes: ${source}`, async () => {
    setupRealSquire(source);
    const element = document.querySelector("[editable]");
    const before = RichClay.savedContent(element);
    assert.equal(before, "Untyped title");
    const editor = new RichClay(element, {});
    await rest();
    assert.equal(RichClay.savedContent(element), before);
    editor.destroy();
    assert.equal(RichClay.savedContent(element), before);
  });
}

test("savedContent returns undefined for an element richclay does not own", () => {
  setupRealSquire('<div id="ordinary">Plain</div><x-card editable>Card</x-card>');
  assert.equal(RichClay.savedContent(document.querySelector("#ordinary")), undefined);
  assert.equal(RichClay.savedContent(document.querySelector("x-card")), undefined);
});
