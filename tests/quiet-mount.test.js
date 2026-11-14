import test from "node:test";
import assert from "node:assert/strict";
import { setupDom, FakeSquire } from "./helpers.js";
import RichClay from "../src/richclay.js";

function hub() {
  const calls = [];
  window.clay = {
    Mutation: {
      pause: () => calls.push("pause"),
      resume: () => calls.push("resume")
    }
  };
  return calls;
}

function region() {
  setupDom('<!doctype html><html><body><div id="field" data-richclay><p>Text</p></div></body></html>');
  return document.querySelector("#field");
}

test("mounting, reattaching and destroying each run between one pause and one resume of the host's hub", () => {
  const element = region();
  const calls = hub();

  const editor = new RichClay(element, { Squire: FakeSquire });
  assert.equal(element.getAttribute("data-richclay-active"), "true");
  assert.deepEqual(calls, ["pause", "resume"]);

  calls.length = 0;
  element.removeAttribute("contenteditable");
  assert.equal(editor.reattach(), true);
  assert.equal(element.getAttribute("contenteditable"), "true");
  assert.deepEqual(calls, ["pause", "resume"]);

  calls.length = 0;
  editor.destroy();
  assert.equal(element.hasAttribute("data-richclay-active"), false);
  assert.deepEqual(calls, ["pause", "resume"]);
});

test("the hub is resumed when the mount throws", () => {
  const element = region();
  const calls = hub();
  assert.throws(() => new RichClay(element, {}), /RichClay requires Squire/);
  assert.deepEqual(calls, ["pause", "resume"]);
});

test("the attribute writes of a mount happen while the hub is paused", () => {
  const element = region();
  let paused = 0;
  const writes = [];
  window.clay = { Mutation: { pause: () => { paused += 1; }, resume: () => { paused -= 1; } } };
  const set = element.setAttribute.bind(element);
  element.setAttribute = (name, value) => {
    writes.push([name, paused]);
    return set(name, value);
  };
  new RichClay(element, { Squire: FakeSquire });
  assert.ok(writes.some(([name]) => name === "no-undo"), "the mount writes the runtime no-undo attribute");
  assert.deepEqual(writes.filter(([, depth]) => depth !== 1), []);
  assert.equal(paused, 0);
});

test("without a host hub, mounting and destroying work as before", () => {
  const element = region();
  const editor = new RichClay(element, { Squire: FakeSquire });
  assert.equal(element.getAttribute("data-richclay-active"), "true");
  editor.destroy();
  assert.equal(element.hasAttribute("data-richclay-active"), false);
  assert.equal(element.hasAttribute("contenteditable"), false);
});

test("a hub on window.hyperclay alone is left alone, because it cannot deliver before pausing", () => {
  const element = region();
  const calls = [];
  window.hyperclay = { Mutation: { pause: () => calls.push("pause"), resume: () => calls.push("resume") } };
  const editor = new RichClay(element, { Squire: FakeSquire });
  assert.equal(element.getAttribute("data-richclay-active"), "true");
  editor.destroy();
  assert.equal(element.hasAttribute("data-richclay-active"), false);
  assert.deepEqual(calls, []);
});
