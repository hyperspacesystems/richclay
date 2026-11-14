import test from "node:test";
import assert from "node:assert/strict";
import { setupDom, FakeSquire } from "./helpers.js";
import RichClay from "../src/richclay.js";
import { removeRuntimeState } from "../src/hyperclay.js";

test("standalone init preserves existing sanitized HTML", () => {
  setupDom(`
    <!doctype html><html><body>
      <div data-richclay><p>Hello <strong>DOM</strong></p><script>bad()</script></div>
    </body></html>
  `);

  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: "minimal"
  });

  assert.equal(editor.active, true);
  assert.equal(editor.getHTML(), "<p>Hello <strong>DOM</strong></p>");
  assert.equal(document.querySelector("[data-richclay-toolbar]") !== null, true);
});

test("setHTML/getHTML round trip through sanitizer", () => {
  setupDom('<!doctype html><html><body><div data-richclay></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: []
  });

  editor.setHTML('<p onclick="bad()">Safe <a href="javascript:bad()">link</a></p>');

  assert.equal(editor.getHTML(), "<p>Safe <a>link</a></p>");
});

test("destroy removes toolbar and runtime attrs but preserves marker and content", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>Keep</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: "minimal",
    placeholder: "Write"
  });

  editor.destroy();

  const element = document.querySelector("[data-richclay]");
  assert.equal(element.hasAttribute("data-richclay"), true);
  assert.equal(element.hasAttribute("contenteditable"), false);
  assert.equal(element.classList.contains("richclay-editor"), false);
  assert.equal(document.querySelector("[data-richclay-toolbar]"), null);
  assert.equal(element.innerHTML, "<p>Keep</p>");
});

test("global and instance custom button registration work", () => {
  setupDom('<!doctype html><html><body><div data-richclay></div></body></html>');
  RichClay.registerButton({
    id: "globalTest",
    label: "Global",
    run: editor => editor.squire.commands.push("global")
  });

  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: ["globalTest"]
  });
  document.querySelector("[aria-label='Global']").click();
  assert.equal(editor.squire.commands.includes("global"), true);

  editor.registerButton({
    id: "instanceTest",
    label: "Instance",
    run: rte => rte.squire.commands.push("instance")
  });
  editor.options.toolbar = ["instanceTest"];
  editor.renderToolbar();
  document.querySelector("[aria-label='Instance']").click();
  assert.equal(editor.squire.commands.includes("instance"), true);
});

test("unregisterButton removes a button (instance + global)", () => {
  setupDom('<!doctype html><html><body><div data-richclay></div></body></html>');
  RichClay.registerButton({ id: "gtmp", label: "G", run() {} });
  RichClay.unregisterButton("gtmp");

  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: "minimal"
  });
  assert.throws(() => editor.resolveToolbarControls(["gtmp"]));

  editor.registerButton({ id: "itmp", label: "I", run() {} });
  assert.doesNotThrow(() => editor.resolveToolbarControls(["itmp"]));
  editor.unregisterButton("itmp");
  assert.throws(() => editor.resolveToolbarControls(["itmp"]));
});

test("link dialog pre-fills the URL of the link under the selection", () => {
  setupDom('<!doctype html><html><body><div data-richclay></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: ["link"]
  });
  editor.setHTML('<p>Go <a href="https://example.com/x">here</a></p>');

  const anchor = editor.element.querySelector("a");
  const range = document.createRange();
  range.selectNodeContents(anchor);
  editor.squire.setSelection(range);

  assert.equal(editor.currentLinkHref(), "https://example.com/x");

  editor.openLinkDialog();
  const input = document.querySelector("[data-richclay-dialog] input");
  assert.equal(input.value, "https://example.com/x");
});

test("constructor validates its element and is idempotent per element", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>x</p></div></body></html>');
  assert.throws(() => new RichClay(null), /requires an element/);

  const element = document.querySelector("[data-richclay]");
  const first = new RichClay(element, { Squire: FakeSquire, toolbar: "minimal" });
  const second = new RichClay(element, { Squire: FakeSquire, toolbar: "standard" });

  assert.equal(first, second);
  assert.equal(document.querySelectorAll("[data-richclay-toolbar]").length, 1);
});

test("readOnly stays inert: no activation, no toolbar, no contenteditable, but setHTML still sanitizes", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>keep</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    readOnly: true
  });

  assert.equal(editor.active, false);
  assert.equal(editor.element.hasAttribute("contenteditable"), false);
  assert.equal(document.querySelector("[data-richclay-toolbar]"), null);
  assert.equal(editor.getHTML(), "<p>keep</p>");

  editor.setHTML('<p>fresh<script>bad()</script></p>');
  assert.equal(editor.element.innerHTML, "<p>fresh</p>");
});

test("hostile initial content is sanitized in the live DOM even without activation", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>Keep<script>bad()</script></p><img src=x onerror="bad()"></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    readOnly: true
  });

  assert.equal(editor.active, false);
  assert.equal(editor.element.querySelector("script"), null);
  const img = editor.element.querySelector("img");
  assert.ok(img);
  assert.equal(img.getAttribute("onerror"), null);
  assert.equal(img.getAttribute("src"), "x");
  assert.equal(editor.element.innerHTML, '<p>Keep</p><img src="x">');
});

// The author's own region keeps its markup through the construction clean: the
// card allowlist has no img, class or id, so running it here deleted the images
// on every edit-mode open and the next save wrote the loss into the file.
test("card construction keeps the author's images, classes and ids", () => {
  const markup =
    '<!doctype html><html><body><div data-richclay><p class="lead" id="intro">Hi</p><img src="photo.jpg" alt="A" width="10" height="20"></div></body></html>';
  const assertPreserved = editor => {
    const paragraph = editor.element.querySelector("p");
    assert.equal(paragraph.getAttribute("class"), "lead");
    assert.equal(paragraph.getAttribute("id"), "intro");
    const img = editor.element.querySelector("img");
    assert.ok(img);
    assert.equal(img.getAttribute("src"), "photo.jpg");
    assert.equal(img.getAttribute("alt"), "A");
    assert.equal(img.getAttribute("width"), "10");
    assert.equal(img.getAttribute("height"), "20");
  };

  setupDom(markup);
  const activated = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: []
  });
  assert.equal(activated.active, true);
  assertPreserved(activated);

  setupDom(markup);
  const inactive = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    readOnly: true
  });
  assert.equal(inactive.active, false);
  assertPreserved(inactive);
});

// Only the construction clean is extended. Ingress stays on the card allowlist.
test("setHTML on a card editor still drops images and classes", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>Hi</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: []
  });

  editor.setHTML('<p class="x">a</p><img src="y.jpg">');

  assert.equal(editor.element.querySelector("img"), null);
  assert.equal(editor.element.querySelector("p").getAttribute("class"), null);
  assert.equal(editor.getHTML(), "<p>a</p>");
});

test("onChange fires with sanitized HTML when content changes", () => {
  setupDom('<!doctype html><html><body><div data-richclay></div></body></html>');
  const changes = [];
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: [],
    onChange: html => changes.push(html)
  });

  editor.setHTML('<p>Hi<script>x()</script></p>');
  assert.deepEqual(changes, ["<p>Hi</p>"]);
});

test("static init activates every matching region", () => {
  setupDom(
    '<!doctype html><html><body><div data-richclay><p>1</p></div><div data-richclay><p>2</p></div></body></html>'
  );

  const editors = RichClay.init(undefined, { Squire: FakeSquire, toolbar: "minimal" });

  assert.equal(editors.length, 2);
  assert.equal(editors.every(editor => editor.active), true);
  assert.equal(document.querySelectorAll("[data-richclay-toolbar]").length, 2);
});

test("the bare `richclay` attribute is honored without adding `data-richclay`", () => {
  setupDom('<!doctype html><html><body><div richclay><p>v</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[richclay]"), {
    Squire: FakeSquire,
    toolbar: "minimal"
  });

  assert.equal(editor.active, true);
  assert.equal(editor.element.hasAttribute("richclay"), true);
  assert.equal(editor.element.hasAttribute("data-richclay"), false);
});

test("destroy is idempotent and unwires Squire listeners", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>Keep</p></div></body></html>');
  const editor = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    toolbar: "minimal"
  });

  const squire = editor.squire;
  editor.destroy();

  assert.deepEqual(squire.events.get("input"), []);
  assert.equal(editor.element.innerHTML, "<p>Keep</p>");
  assert.doesNotThrow(() => editor.destroy());
});

// A live-sync morph hands the element the incoming copy's state, and that copy
// went through the save strip, so removeRuntimeState is the strip itself rather
// than a guessed list of attributes.
test("reattach puts back everything the save strip took, including the marker richclay invented", () => {
  setupDom('<!doctype html><html><body><my-widget editable><p>hi</p></my-widget></body></html>');
  const element = document.querySelector("my-widget");
  const editor = new RichClay(element, { Squire: FakeSquire, toolbar: false });
  const activated = element.getAttributeNames().sort();

  removeRuntimeState(element, "save");
  assert.deepEqual(element.getAttributeNames(), ["editable"]);

  assert.equal(editor.reattach(), true);
  assert.deepEqual(element.getAttributeNames().sort(), activated);
  assert.equal(element.getAttribute("data-richclay"), "");
  assert.equal(element.getAttribute("data-richclay-runtime-marker"), "true");
  assert.equal(element.getAttribute("contenteditable"), "true");
  assert.equal(element.getAttribute("data-richclay-active"), "true");
  assert.equal(element.classList.contains("richclay-active"), true);
  assert.equal(new RichClay(element), editor);
});

test("reattach on a healthy instance returns false and changes nothing", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p>hi</p></div></body></html>');
  const element = document.querySelector("[data-richclay]");
  const editor = new RichClay(element, { Squire: FakeSquire, toolbar: "minimal" });
  const before = element.outerHTML;

  assert.equal(editor.reattach(), false);
  assert.equal(element.outerHTML, before);
});

test("reattach returns false on an unsupported instance and on one that never activated", () => {
  setupDom('<!doctype html><html><body><table editable><tr><td>one</td></tr></table></body></html>');
  const original = console.warn;
  console.warn = () => {};
  let table;
  try {
    table = new RichClay(document.querySelector("[editable]"), { Squire: FakeSquire });
  } finally {
    console.warn = original;
  }
  assert.equal(table.unsupported, true);
  assert.equal(table.reattach(), false);

  setupDom('<!doctype html><html><body><div data-richclay><p>hi</p></div></body></html>');
  const idle = new RichClay(document.querySelector("[data-richclay]"), {
    Squire: FakeSquire,
    readOnly: true
  });
  assert.equal(idle.active, false);
  assert.equal(idle.reattach(), false);
});

test("a second setupEditorAttributes keeps one description, and destroy leaves none behind", () => {
  setupDom('<!doctype html><html><body><div data-richclay></div></body></html>');
  const element = document.querySelector("[data-richclay]");
  const editor = new RichClay(element, {
    Squire: FakeSquire,
    toolbar: false,
    placeholder: "Write here"
  });
  const description = editor.description;
  const descriptions = () => document.querySelectorAll('[id^="richclay-placeholder-"]');

  editor.setupEditorAttributes();

  assert.equal(editor.description, description);
  assert.equal(descriptions().length, 1);
  assert.equal(element.getAttribute("aria-describedby"), description.id);

  editor.destroy();

  assert.equal(descriptions().length, 0);
  assert.equal(element.hasAttribute("aria-describedby"), false);
});

test("a description the morph took away is put back by reattach, keeping its id", () => {
  setupDom('<!doctype html><html><body><div data-richclay></div></body></html>');
  const element = document.querySelector("[data-richclay]");
  const editor = new RichClay(element, {
    Squire: FakeSquire,
    toolbar: false,
    placeholder: "Write here"
  });
  const description = editor.description;
  const id = description.id;

  description.remove();
  removeRuntimeState(element, "save");

  assert.equal(editor.reattach(), true);
  assert.equal(editor.description, description);
  assert.equal(description.id, id);
  assert.equal(element.nextElementSibling, description);
  assert.equal(element.getAttribute("aria-describedby"), id);
  assert.equal(document.querySelectorAll('[id^="richclay-placeholder-"]').length, 1);
});

test("reattach rewires the hint when the morph stripped it but left the description in place", () => {
  setupDom('<!doctype html><html><body><div data-richclay></div></body></html>');
  const element = document.querySelector("[data-richclay]");
  const editor = new RichClay(element, {
    Squire: FakeSquire,
    toolbar: false,
    placeholder: "Write here"
  });
  const description = editor.description;

  removeRuntimeState(element, "save");
  assert.equal(element.hasAttribute("aria-describedby"), false);
  assert.equal(element.hasAttribute("data-richclay-runtime-describedby"), false);
  assert.equal(description.isConnected, true);

  assert.equal(editor.reattach(), true);

  assert.equal(element.getAttribute("aria-describedby"), description.id);
  assert.equal(element.getAttribute("data-richclay-runtime-describedby"), description.id);
  assert.equal(
    (element.getAttribute("aria-describedby").match(new RegExp(description.id, "g")) || []).length,
    1
  );
});
