import test from "node:test";
import assert from "node:assert/strict";
import { setupRealSquire } from "./real-squire.js";
import RichClay from "../src/richclay.js";
import { LINK_POPOVER_GRACE_MS } from "../src/link-popover.js";

// Every test here runs the real Squire engine. jsdom has no layout, so where the bar sits
// is not asserted: that belongs to a browser.

const mount = (markup, options = {}) => {
  setupRealSquire(`<div data-richclay>${markup}</div>`);
  const element = document.querySelector("[data-richclay]");
  const editor = new RichClay(element, { toolbar: ["link"], ...options });
  editor.squire.focus();
  return { element, editor };
};

const popover = () => document.querySelector("[data-richclay-link-popover]");
const address = () => popover().querySelector(".richclay-link-address");
const dialog = () => document.querySelector("[data-richclay-dialog]");
const click = node => node.dispatchEvent(new window.MouseEvent("click", { bubbles: true, cancelable: true }));
const afterGrace = () => new Promise(resolve => setTimeout(resolve, LINK_POPOVER_GRACE_MS + 80));
// Squire hands its construction-time root replacement to its observer on a later task, and
// swallows the first real mutation until then (see tests/link-dialog.test.js). An undo test
// has to wait for that, and for the change itself to be heard, before it can undo.
const settle = () => new Promise(resolve => setTimeout(resolve, 0));

const emitSelection = (editor, range) => {
  editor.squire.setSelection(range);
  document.dispatchEvent(new window.Event("selectionchange"));
};

const caretIn = (editor, node, offset) => {
  const range = document.createRange();
  range.setStart(node, offset);
  range.collapse(true);
  emitSelection(editor, range);
};

const TWO = '<p>lead <a href="/one">one</a> mid <a href="https://example.org/two">two</a> tail</p>';

test("a caret inside a link shows its address with Open, Edit and Remove, and leaving hides it after the grace", async () => {
  const { element, editor } = mount(TWO);
  const [one] = element.querySelectorAll("a");

  assert.equal(popover(), null);
  caretIn(editor, one.firstChild, 1);

  assert.notEqual(popover(), null);
  assert.equal(popover().getAttribute("role"), "group");
  assert.equal(address().textContent, "/one");
  assert.equal(address().getAttribute("href"), "/one");
  assert.equal(address().getAttribute("target"), "_blank");
  assert.equal(address().getAttribute("rel"), "noopener noreferrer");
  assert.notEqual(popover().querySelector("[data-richclay-link-edit]"), null);
  assert.notEqual(popover().querySelector("[data-richclay-link-remove]"), null);

  caretIn(editor, one.previousSibling, 1);
  assert.notEqual(popover(), null);
  await afterGrace();
  assert.equal(popover(), null);
  editor.destroy();
});

test("moving from one link to another changes the address without a hide in between", () => {
  const { element, editor } = mount(TWO);
  const [one, two] = element.querySelectorAll("a");

  caretIn(editor, one.firstChild, 1);
  const bar = popover();
  caretIn(editor, two.firstChild, 1);

  assert.equal(popover(), bar);
  assert.equal(address().textContent, "example.org/two");
  assert.equal(address().getAttribute("href"), "https://example.org/two");
  editor.destroy();
});

test("a mail link opens its app, and a page of the same site opens beside the editor", () => {
  const { element, editor } = mount('<p><a href="mailto:ines@example.org">write</a> and <a href="cv.html">CV</a></p>');
  const [mail, page] = element.querySelectorAll("a");

  caretIn(editor, mail.firstChild, 1);
  assert.equal(address().textContent, "ines@example.org");
  assert.equal(address().getAttribute("href"), "mailto:ines@example.org");
  assert.equal(address().hasAttribute("target"), false);

  caretIn(editor, page.firstChild, 1);
  assert.equal(address().textContent, "cv.html");
  assert.equal(address().getAttribute("href"), "cv.html");
  assert.equal(address().getAttribute("target"), "_blank");
  editor.destroy();
});

test("an address that is not safe to follow is shown as text, not as a link", () => {
  const { element, editor } = mount('<p>lead <a href="/one">one</a> tail</p>');
  const anchor = element.querySelector("a");
  anchor.setAttribute("href", "javascript:alert(1)");

  caretIn(editor, anchor.firstChild, 1);

  assert.equal(address().hasAttribute("href"), false);
  assert.equal(address().textContent, "javascript:alert(1)");
  editor.destroy();
});

test("Remove unwraps the link, keeps its text, hides the bar, and undo brings the link back", async () => {
  const { element, editor } = mount('<p>lead <a href="/one">one</a> tail</p>');
  await settle();
  const anchor = element.querySelector("a");
  caretIn(editor, anchor.firstChild, 1);

  click(popover().querySelector("[data-richclay-link-remove]"));

  assert.equal(element.querySelector("a"), null);
  assert.equal(element.textContent.replace(/\s+/g, " ").trim(), "lead one tail");
  assert.equal(popover(), null);

  await new Promise(resolve => setTimeout(resolve, 30));
  editor.squire.undo();
  assert.equal(element.querySelector("a")?.getAttribute("href"), "/one");
  editor.destroy();
});

test("Edit opens the link form filled with the address, and closing it brings the bar back", () => {
  const { element, editor } = mount('<p>lead <a href="/one">one</a> tail</p>');
  const anchor = element.querySelector("a");
  caretIn(editor, anchor.firstChild, 1);

  click(popover().querySelector("[data-richclay-link-edit]"));

  assert.equal(popover(), null);
  assert.notEqual(dialog(), null);
  assert.equal(dialog().querySelector("input").value, "/one");

  click(dialog().querySelector("[data-richclay-cancel]"));

  assert.equal(dialog(), null);
  assert.notEqual(popover(), null);
  assert.equal(address().textContent, "/one");
  editor.destroy();
});

test("Escape hides the bar until the caret has left that link and come back", () => {
  const { element, editor } = mount('<p>lead <a href="/one">one</a> tail</p>');
  const anchor = element.querySelector("a");
  caretIn(editor, anchor.firstChild, 1);

  const escape = new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true });
  element.dispatchEvent(escape);
  assert.equal(popover(), null);
  assert.equal(escape.defaultPrevented, false, "Escape still reaches a modal dialog around the editor");

  caretIn(editor, anchor.firstChild, 2);
  assert.equal(popover(), null);

  caretIn(editor, anchor.nextSibling, 2);
  caretIn(editor, anchor.firstChild, 1);
  assert.notEqual(popover(), null);
  editor.destroy();
});

test("the bar is editor chrome: marked for removal and absent from the editor's HTML", () => {
  const { element, editor } = mount('<p>lead <a href="/one">one</a> tail</p>');
  caretIn(editor, element.querySelector("a").firstChild, 1);

  assert.equal(popover().hasAttribute("snapshot-remove"), true);
  assert.equal(popover().hasAttribute("no-watch"), true);
  assert.equal(popover().hasAttribute("save-remove"), true);
  assert.equal(element.contains(popover()), false);
  assert.equal(editor.getHTML().includes("richclay-link-popover"), false);
  editor.destroy();
});

test("a destroyed editor leaves no bar behind", () => {
  const { element, editor } = mount('<p>lead <a href="/one">one</a> tail</p>');
  caretIn(editor, element.querySelector("a").firstChild, 1);
  assert.notEqual(popover(), null);

  editor.destroy();

  assert.equal(popover(), null);
});

test("linkPopover: false shows nothing", () => {
  const { element, editor } = mount('<p>lead <a href="/one">one</a> tail</p>', { linkPopover: false });
  caretIn(editor, element.querySelector("a").firstChild, 1);

  assert.equal(popover(), null);
  editor.destroy();
});

test("the bar does not come back after the caret leaves the editor", async () => {
  const { element, editor } = mount('<p>lead <a href="/one">one</a> tail</p>');
  caretIn(editor, element.querySelector("a").firstChild, 1);
  assert.notEqual(popover(), null);

  const outside = document.createElement("p");
  outside.textContent = "elsewhere on the page";
  document.body.appendChild(outside);
  document.getSelection().collapse(outside.firstChild, 0);

  editor.updateLinkPopover();
  await afterGrace();

  assert.equal(document.querySelector("[data-richclay-link-popover]"), null);
  editor.destroy();
});

test("two editors never show two bars", async () => {
  setupRealSquire(
    '<div data-richclay><p>lead <a href="/one">one</a> tail</p></div>' +
    '<div data-richclay><p>lead <a href="https://example.org/two">two</a> tail</p></div>'
  );
  const [first, second] = document.querySelectorAll("[data-richclay]");
  const one = new RichClay(first, { toolbar: ["link"] });
  const two = new RichClay(second, { toolbar: ["link"] });

  one.squire.focus();
  caretIn(one, first.querySelector("a").firstChild, 1);
  assert.notEqual(popover(), null);

  two.squire.focus();
  caretIn(two, second.querySelector("a").firstChild, 1);
  one.updateLinkPopover();
  two.updateLinkPopover();
  await afterGrace();

  assert.equal(document.querySelectorAll("[data-richclay-link-popover]").length, 1);
  assert.equal(address().textContent, "example.org/two");
  one.destroy();
  two.destroy();
});
