import test from "node:test";
import assert from "node:assert/strict";
import { setupDom, FakeSquire } from "./helpers.js";
import RichClay from "../src/richclay.js";

const tick = () => new Promise(resolve => setTimeout(resolve, 0));
const isMounted = element => element.getAttribute("data-richclay-active") === "true";

async function addRegion(id) {
  const element = document.createElement("div");
  element.id = id;
  element.setAttribute("data-richclay", "");
  element.innerHTML = "<p>Text</p>";
  document.body.appendChild(element);
  await tick();
  return element;
}

async function ready() {
  if (document.readyState === "loading") {
    await new Promise(resolve => window.addEventListener("DOMContentLoaded", resolve, { once: true }));
  }
  await tick();
}

test("watch() returns a stop function, and a stopped watcher mounts nothing", async () => {
  setupDom();
  const stop = RichClay.watch(window, { Squire: FakeSquire });
  assert.equal(typeof stop, "function", "watch() has to hand back ownership");

  const watched = await addRegion("watched");
  assert.equal(isMounted(watched), true, "a running watcher mounts a region added later");

  const toolbars = document.querySelectorAll("[data-richclay-toolbar]").length;

  stop();
  const afterStop = await addRegion("after-stop");
  assert.equal(isMounted(afterStop), false, "a stopped watcher must not mount a new node");
  assert.equal(afterStop.hasAttribute("contenteditable"), false);
  assert.equal(
    document.querySelectorAll("[data-richclay-toolbar]").length,
    toolbars,
    "no editor chrome arrives for the region a stopped watcher ignored"
  );
});

test("a later watch() mounts again once the earlier one has stopped", async () => {
  setupDom();
  const first = RichClay.watch(window, { Squire: FakeSquire });
  first();

  const second = RichClay.watch(window, { Squire: FakeSquire });
  assert.equal(typeof second, "function");
  assert.notEqual(second, first, "the stopped registration is gone, so this is a new watcher");

  const region = await addRegion("rewatched");
  assert.equal(isMounted(region), true, "a later watcher can mount one");
});

test("stopping twice is idempotent, and the window registration survives the extra call", async () => {
  setupDom();
  const stop = RichClay.watch(window, { Squire: FakeSquire });
  stop();
  stop();

  const region = await addRegion("after-double-stop");
  assert.equal(isMounted(region), false);

  const replacement = RichClay.watch(window, { Squire: FakeSquire });
  const later = await addRegion("after-replacement");
  assert.equal(isMounted(later), true);
  replacement();
});

test("watch() also declines to mount after its attribute-triggered path is stopped", async () => {
  setupDom('<!doctype html><html><body><div id="authored"></div></body></html>');
  const authored = document.getElementById("authored");
  const stop = RichClay.watch(window, { Squire: FakeSquire });
  stop();

  authored.setAttribute("data-richclay", "");
  await tick();
  assert.equal(isMounted(authored), false, "the observer is disconnected, not merely paused");
});

test("managed auto-init defers to the ClayJS adapter, and that adapter can mount", async () => {
  setupDom();
  window.__hyperclayEditMode = true;
  window.clay = { mode: "edit", isEditMode: true };
  globalThis.Squire = FakeSquire;
  try {
    RichClay.autoInit(window);
    await ready();
    assert.equal(isMounted(document.querySelector("[data-richclay]") || document.body), false);
    assert.equal(document.querySelector("[data-richclay-active]"), null, "no editor mounts behind the adapter");

    const region = await addRegion("adapter-owned");
    assert.equal(isMounted(region), false, "and the vendor starts no watcher of its own");

    RichClay.watch(window, { Squire: FakeSquire });
    const adopted = await addRegion("adapter-watched");
    assert.equal(isMounted(adopted), true, "the adapter owns observation on a managed page");
  } finally {
    delete globalThis.Squire;
  }
});

test("hyperclayjs auto-init still mounts, as it always did", async () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>Text</p></div></body></html>');
  window.hyperclay = { isEditMode: true, beforeSave() {} };
  globalThis.Squire = FakeSquire;
  try {
    RichClay.autoInit(window);
    await ready();
    assert.equal(isMounted(document.querySelector("[data-richclay]")), true, "hyperclayjs edit mode is unchanged");
  } finally {
    delete globalThis.Squire;
  }
});

test("a standalone page still auto-inits to nothing", async () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>Text</p></div></body></html>');
  globalThis.Squire = FakeSquire;
  try {
    RichClay.autoInit(window);
    await ready();
    assert.equal(isMounted(document.querySelector("[data-richclay]")), false);
    assert.equal(document.querySelector("[data-richclay-toolbar]"), null);
  } finally {
    delete globalThis.Squire;
  }
});
