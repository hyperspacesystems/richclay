import test from "node:test";
import assert from "node:assert/strict";
import { setupRealSquire } from "./real-squire.js";
import RichClay from "../src/richclay.js";
import { editorRootNeedsNormalization } from "../src/normalize.js";
import { stripRichClayFromClone } from "../src/hyperclay.js";

const SOURCE = "\n  <p>One</p>\n  <p>Two</p>\n";

const mount = (html = SOURCE) => mountMarkup(`<div editable>${html}</div>`);

const mountMarkup = (markup, platform = "MacIntel") => {
  setupRealSquire(markup, platform);
  const element = document.querySelector("[editable]");
  return { element, editor: new RichClay(element, {}) };
};

// The region's own markup, reparsed. A block inside a phrasing-only root
// serializes fine and then splits the region on the next page load, which is the
// failure no innerHTML assertion on the live DOM can see.
const reparse = element => {
  const probe = element.ownerDocument.createElement("div");
  probe.innerHTML = element.outerHTML;
  return probe;
};

// What actually reaches the file, which is the only place the residue shows: the
// live DOM can hold a manufactured block that the save strip flattens on its way
// out, leaving the <br> behind.
const savedRegion = element => {
  const clone = element.ownerDocument.documentElement.cloneNode(true);
  stripRichClayFromClone(clone);
  return clone.querySelector("[editable]");
};

const captureWarnings = run => {
  const warnings = [];
  const original = console.warn;
  console.warn = (...args) => warnings.push(args[0]);
  try {
    run();
  } finally {
    console.warn = original;
  }
  return warnings;
};

const silenceWarnings = run => {
  const original = console.warn;
  console.warn = () => {};
  try {
    return run();
  } finally {
    console.warn = original;
  }
};

const caretAt = (editor, node, offset) => {
  const range = node.ownerDocument.createRange();
  range.setStart(node, offset);
  range.collapse(true);
  editor.squire.setSelection(range);
  editor.saveSelection();
};

const press = (target, key, init = {}) =>
  target.dispatchEvent(
    new window.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init })
  );

// jsdom has no native contenteditable insertion, and Squire's insertPlainText is
// the paste route rather than the typing one: it builds a block per line, so it
// manufactures the very <div> a keystroke never would. Typing is the keydown,
// which is what fires richclay's root guard, plus the character the browser
// itself would have put in the text node.
const type = (editor, node, offset, character) => {
  press(editor.element, character);
  node.insertData(offset, character);
};

// A block whose whole text is whitespace is the visible blank line fixContainer
// manufactures out of source indentation.
const blankBlocks = element =>
  Array.from(element.children)
    .filter(child => !/\S/.test(child.textContent))
    .map(child => child.outerHTML);

const selectAll = (editor, element) => {
  const range = element.ownerDocument.createRange();
  range.selectNodeContents(element);
  editor.squire.setSelection(range);
  editor.saveSelection();
  return range;
};

const selectText = (editor, node, start, end) => {
  const range = node.ownerDocument.createRange();
  range.setStart(node, start);
  range.setEnd(node, end);
  editor.squire.setSelection(range);
  editor.saveSelection();
  return range;
};

// Unpatched, one click of Clear formatting on a <span editable> walked out of the
// region, moved every character into the author's page, and left two empty copies
// of the region behind.
test("clear formatting keeps the content inside an inline region", () => {
  ["span", "b", "a"].forEach(tag => {
    const attrs = tag === "a" ? ' href="/x"' : "";
    const markup = `<div id="host">Lead <${tag}${attrs} editable id="r">Hello world</${tag}> tail</div>`;
    const { element, editor } = mountMarkup(markup);
    selectAll(editor, element);

    editor.runControl(editor.registry.get("clearFormatting"));

    const host = document.getElementById("host");
    assert.equal(host.querySelectorAll("[editable]").length, 1, tag);
    assert.equal(document.getElementById("r").textContent, "Hello world", tag);
    assert.equal(host.textContent, "Lead Hello world tail", tag);
    assert.equal(savedRegion(element).outerHTML, `<${tag}${attrs} editable="" id="r">Hello world</${tag}>`, tag);
  });
});

// Unpatched, the walk climbed past the region into the author's own <a> and
// deleted a link the region only happened to sit inside.
test("the registered unlink control inside an author's <a> leaves that <a> alone", () => {
  const { element, editor } = mountMarkup(
    '<div id="host"><a href="/keep">Lead <span editable>Hello world</span> tail</a></div>'
  );
  selectAll(editor, element);

  editor.runControl(editor.registry.get("unlink"));

  assert.equal(document.querySelectorAll('a[href="/keep"]').length, 1);
  assert.equal(Boolean(element.closest('a[href="/keep"]')), true);
  assert.equal(document.getElementById("host").textContent, "Lead Hello world tail");
});

// Unpatched, removeEmptyInlines walked up past the root and deleted the region
// element itself, so one Select All plus Backspace removed the region from the
// author's page. <div> and <p> are the controls: a block root always survived.
test("select all then Backspace leaves the region element in place", () => {
  [
    ["span", ""],
    ["b", ""],
    ["em", ""],
    ["code", ""],
    ["a", ' href="/x"'],
    ["span", ' editable="single-line"'],
    ["div", ""],
    ["p", ""]
  ].forEach(([tag, attrs]) => {
    const editable = attrs.includes("editable") ? attrs : `${attrs} editable`;
    const label = `${tag}${attrs}`;
    const { element, editor } = mountMarkup(
      `<div id="host">Lead <${tag}${editable} id="r">Hello world</${tag}> tail</div>`
    );
    selectAll(editor, element);

    press(element, "Backspace");

    assert.equal(Boolean(document.getElementById("r")), true, label);
    assert.equal(document.getElementById("r"), element, label);
  });
});

// The guards must stop the walk at the root without disabling the walk: ordinary
// formatting still has to reach the selection.
test("bold, italic and link still work on an inline root", () => {
  const { element, editor } = mountMarkup('<div id="host">Lead <span editable>Hello world</span> tail</div>');
  selectText(editor, element.firstChild, 0, 5);
  editor.runControl(editor.registry.get("bold"));

  const bold = element.querySelector("b");
  assert.equal(bold.textContent, "Hello");

  selectAll(editor, bold);
  editor.runControl(editor.registry.get("italic"));
  assert.equal(element.querySelector("b > i").textContent, "Hello");

  selectAll(editor, element.querySelector("i"));
  editor.squire.makeLink("https://example.com/");

  assert.equal(element.querySelector("a").getAttribute("href"), "https://example.com/");
  assert.equal(document.getElementById("host").textContent, "Lead Hello world tail");
  assert.equal(
    savedRegion(element).innerHTML,
    '<b><i><a href="https://example.com/">Hello</a></i></b> world'
  );
});

// opus-a reported that applying a new link over part of an <a editable> splits the
// region into two elements carrying the same id. It does not split, but it nests an
// <a> in an <a>, which the parser takes apart on the next load. Two answers: the
// control is disabled, and if one arrives another way the save strip unwraps it.
test("the link control is disabled inside a link, and a nested <a> is repaired anyway", () => {
  const { element, editor } = mountMarkup('<div id="host"><a href="/one" editable id="r">Hello world</a></div>');
  assert.equal(editor.registry.get("link").isDisabled(editor), true);
  assert.equal(editor.registry.get("unlink").isDisabled, undefined);

  const before = element.innerHTML;
  selectText(editor, element.firstChild, 0, 5);
  editor.runControl(editor.registry.get("link"));
  assert.equal(element.innerHTML, before);
  assert.equal(document.querySelector("[data-richclay-dialog]"), null);

  // and the repair, for a nested <a> that arrives by any other route
  editor.squire.makeLink("https://example.com/two");
  const saved = savedRegion(element);
  assert.equal(document.querySelectorAll("#r").length, 1);
  assert.equal(saved.querySelectorAll("a").length, 0);
  assert.equal(reparse(saved).querySelector("[editable]").textContent, "Hello world");
});

// The control stays available on a region that merely contains links, and on one
// that is not a link at all. Only being inside an <a> turns it off.
test("the link control is still offered outside a link", () => {
  const plain = mountMarkup('<div id="host">Lead <span editable>Hello world</span> tail</div>');
  assert.equal(plain.editor.registry.get("link").isDisabled(plain.editor), false);

  const holdsLink = mountMarkup('<div editable><p>Hello <a href="/x">world</a></p></div>');
  assert.equal(holdsLink.editor.registry.get("link").isDisabled(holdsLink.editor), false);
});

// An author's <li> is a line of text they wrote, so it keeps that shape and gets no
// warning for being ordinary HTML.
test("<li editable> keeps the shape the author wrote through a first edit", () => {
  const { element, editor } = mountMarkup("<ul><li editable>Item one</li></ul>");

  const warnings = captureWarnings(() => {
    caretAt(editor, element.firstChild, 4);
    type(editor, element.firstChild, 4, "x");
  });

  assert.deepEqual(warnings, []);
  const saved = savedRegion(element);
  assert.equal(saved.innerHTML, "Itemx one");
  assert.equal(saved.querySelectorAll("div").length, 0);
});

// Squire acts on Tab only inside a list, so treating it as an editing key made
// merely tabbing out of a fresh region run the repair and strip the author's
// source indentation, which on an autosaving page writes the file.
test("Tab outside a list leaves a fresh region byte-identical, and still indents inside one", () => {
  const { element, editor } = mount();
  caretAt(editor, element.querySelector("p").firstChild, 1);
  press(element, "Tab");
  assert.equal(element.innerHTML, SOURCE);

  // Inside a list Tab does edit, so it still has to repair the root first: the
  // indent runs against a root Squire's own handlers can work on.
  const list = mount("\n  <p>Lead</p>\n  <ul>\n    <li>One</li>\n    <li>Two</li>\n  </ul>\n");
  const items = list.element.querySelectorAll("li");
  caretAt(list.editor, items[1].firstChild, 0);
  assert.equal(list.editor.caretIsInList(), true);
  press(list.element, "Tab");

  assert.equal(list.element.querySelectorAll("ul ul li").length, 1);
  assert.equal(editorRootNeedsNormalization(list.element, { wrapBareRoot: true }), false);
  assert.equal(list.element.innerHTML, "<p>Lead</p><ul><li>One</li><ul><li>Two</li></ul></ul>");
});

// Four inline styles including width: 0 written into an author's file for merely
// opening it is the byte-identical-on-open invariant broken. The <pre> richclay
// makes is richclay's to contain.
test("only a <pre> richclay created gets the containment style", () => {
  const authored = mountMarkup("<pre editable>one\n  two</pre>");
  assert.equal(savedRegion(authored.element).outerHTML, '<pre editable="">one\n  two</pre>');

  const { element, editor } = mountMarkup("<div editable><pre>authored</pre><p>Hello world</p></div>");
  caretAt(editor, element.querySelector("p").firstChild, 5);
  editor.runControl(editor.registry.get("code"));

  const [mine, theirs] = Array.from(savedRegion(element).querySelectorAll("pre")).sort((a, b) =>
    a.hasAttribute("style") ? 1 : -1
  );
  assert.equal(mine.hasAttribute("style"), false);
  assert.equal(mine.textContent, "authored");
  assert.equal(theirs.style.width, "0px");
  assert.equal(theirs.style.overflow, "auto");
  assert.equal(theirs.hasAttribute("data-richclay-pre"), false);
});

// Squire's paste path runs fixContainer over the pasted fragment, so two plain
// lines land a block per line in a region the author wrote as one line of text.
test("a two-line plain-text paste manufactures no block in a single-line region", () => {
  const { element, editor } = mountMarkup('<h1 editable="single-line">Hello</h1>');
  caretAt(editor, element.firstChild, 5);
  editor.squire.insertPlainText("One\nTwo", true);

  const saved = savedRegion(element);
  assert.equal(saved.innerHTML, "HelloOne Two");
  assert.equal(saved.querySelectorAll("div").length, 0);
});

// One block, not one per line. Squire's insertTreeFragmentIntoRange re-wraps after
// willPaste, so a single wrapper still lands here and no <br> is produced: chasing
// that means mutating the live DOM after the paste, which is the machinery that
// caused the caret bugs in rounds 2 and 3, for a wrapper that is cosmetic and
// stable under a reload. The listener's job is that two lines do not become two
// blocks, and that a single-line region ends up with no block at all.
test("a two-line plain-text paste lands one block in an <h2 editable>, not one per line", () => {
  const { element, editor } = mountMarkup("<div><h2 editable>Hello</h2></div>");
  caretAt(editor, element.firstChild, 5);
  editor.squire.insertPlainText("One\nTwo", true);

  const saved = savedRegion(element);
  assert.equal(saved.querySelectorAll("div").length, 1);
  assert.equal(saved.textContent, "HelloOneTwo");
  assert.equal(reparse(saved).querySelector("[editable]").textContent, "HelloOneTwo");
});

// installShortcuts masks a disabled control's shortcut with an own null rather
// than skipping it, because not installing richclay's own binding is what leaves
// Squire's inherited handler in charge of the key.
test("a disabled control's shortcut is masked, not left to Squire", () => {
  setupRealSquire("<div editable><p>x</p></div>", "MacIntel");
  const editor = new RichClay(document.querySelector("[editable]"), {
    toolbar: [{ id: "zap", label: "Zap", shortcut: "Mod+E", isDisabled: () => true, run: () => {} }]
  });
  const handlers = editor.squire._keyHandlers;

  assert.equal(Object.prototype.hasOwnProperty.call(handlers, "Meta-e"), true);
  assert.equal(handlers["Meta-e"], null);
});

// The old keydown guard ignored any key with a modifier, which skipped the repair
// for exactly the two keys installAppleDeleteKeys binds. Plain Delete already
// repaired, and is the control here.
test("Ctrl+D repairs the root before Squire's delete handler, exactly like Delete", () => {
  [["d", { ctrlKey: true }], ["Delete", {}]].forEach(([key, init]) => {
    const { element, editor } = mount();
    const paragraph = element.querySelector("p");
    caretAt(editor, paragraph.firstChild, 3);
    press(paragraph, key, init);

    assert.equal(editorRootNeedsNormalization(element, { wrapBareRoot: true }), false, key);
    assert.deepEqual(blankBlocks(element), [], key);
  });
});

// A toolbar click can be the first interaction with a page, so no root guard has
// fired: without the repair up front, the list command saw the indentation text
// nodes as block boundaries and built one <ul> per paragraph.
test("a toolbar block command repairs the root before it runs", () => {
  const { element, editor } = mount();
  const paragraphs = element.querySelectorAll("p");
  const range = element.ownerDocument.createRange();
  range.setStart(paragraphs[0].firstChild, 0);
  range.setEnd(paragraphs[1].firstChild, 3);
  editor.squire.setSelection(range);
  editor.saveSelection();

  editor.runControl(editor.registry.get("unorderedList"));

  assert.equal(element.querySelectorAll("ul").length, 1);
  assert.equal(element.querySelectorAll("li").length, 2);
});

// _ensureBottomLine appends a default block whenever the root's last element
// child is not blockTag. With blockTag "P" the repair's own <div> wrapper
// qualified, so the first delete left a permanent empty paragraph behind it.
test("_ensureBottomLine no longer appends a block after the repair's own wrapper", () => {
  const { element, editor } = mount("bare text here");
  const original = console.warn;
  console.warn = () => {};
  try {
    editor.ensureRootIsEditable();
  } finally {
    console.warn = original;
  }
  assert.equal(element.innerHTML, "<div>bare text here</div>");

  const wrapper = element.firstElementChild;
  const range = element.ownerDocument.createRange();
  range.setStart(wrapper.firstChild, 0);
  range.setEnd(wrapper.firstChild, 4);
  editor.squire.setSelection(range);
  editor.saveSelection();
  press(wrapper, "Backspace");

  assert.equal(element.children.length, 1);
  assert.equal(element.lastElementChild, wrapper);
});

// The repair runs inside modifyDocument, which suppresses change recording, so it
// folds into the first edit's diff instead of becoming an undo step of its own.
test("undo restores the byte-identical pre-repair source, indentation included", async () => {
  const { element, editor } = mount();
  assert.equal(element.innerHTML, SOURCE);

  const paragraph = element.querySelector("p");
  caretAt(editor, paragraph.firstChild, 3);
  press(paragraph, "x");
  editor.squire.insertPlainText("x", false);
  // Squire leaves its undo state from the MutationObserver, which jsdom delivers
  // on a later tick.
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.notEqual(element.innerHTML, SOURCE);

  editor.squire.undo();
  assert.equal(element.innerHTML, SOURCE);
});

const typeText = (editor, node, start, text) => {
  let offset = start;
  for (const character of text) {
    type(editor, node, offset, character);
    offset += 1;
  }
};

// Squire's constructor leaves _ignoreChange set, which swallows the first
// mutation the observer sees. Let that one land before typing.
const settle = () => new Promise(resolve => setTimeout(resolve, 5));

// A live-sync frame replaces the region's content behind Squire's back. Squire's
// undo is a whole-region snapshot, so without a fresh baseline the first undo
// puts the pre-merge region back and erases the other person's text.
test("undo after a live-sync frame does not roll the co-editor's text back", async () => {
  const { element, editor } = mount("<p>start</p>");
  await settle();
  caretAt(editor, element.querySelector("p").firstChild, 5);
  typeText(editor, element.querySelector("p").firstChild, 5, " mine");
  await settle();
  assert.equal(element.textContent, "start mine");

  element.querySelector("p").textContent = "theirs plus mine";
  editor.reattach();

  editor.squire.undo();
  assert.match(element.textContent, /theirs/);
});

// The control: reattach alone must not throw the history away, or undo stops
// working for the editor who typed.
test("reattach without an external change leaves the undo history alone", async () => {
  const { element, editor } = mount("<p>start</p>");
  await settle();
  caretAt(editor, element.querySelector("p").firstChild, 5);
  typeText(editor, element.querySelector("p").firstChild, 5, "a");
  await settle();
  assert.equal(element.textContent, "starta");

  assert.equal(editor.reattach(), false);

  editor.squire.undo();
  assert.equal(element.textContent, "start");
});

// isDisabled was only read where the toolbar renders, so the shortcut and the
// menu item reached the block commands anyway and Indent quoted a <p editable>.
test("a block command refuses to run on a phrasing-only root", () => {
  const { element, editor } = mountMarkup("<p editable>Hello world</p>");
  const before = element.innerHTML;
  caretAt(editor, element.firstChild, 2);

  editor.runControl(editor.registry.get("indent"));

  assert.equal(element.innerHTML, before);
  assert.equal(element.querySelectorAll("blockquote").length, 0);
});

// The round 3 P0. installShortcuts skipped installing a disabled shortcut, and
// richclay's own binding was the only thing shadowing Squire's inherited Mod+],
// so the key kept building a <blockquote> in a <p editable>. Both platforms,
// because the mask only lands if richclay and Squire agree on the prefix: the
// key-table assertion is what catches a harness that puts them on different
// keyboards, which pressing the key on one platform alone never did.
test("Mod+] builds nothing in a region a <p> ejects blocks from", () => {
  [["MacIntel", "Meta-]", { metaKey: true }], ["Win32", "Ctrl-]", { ctrlKey: true }]].forEach(
    ([platform, key, init]) => {
    ["<p editable>Hello world</p>", "<p>Lead <span editable>Hello world</span> tail</p>"].forEach(
      markup => {
        const label = `${platform} ${markup}`;
        const { element, editor } = mountMarkup(markup, platform);
        const before = element.innerHTML;
        caretAt(editor, element.firstChild, 5);

        // Squire's own binding lives on the prototype at the key its platform
        // prefix produced; richclay has to shadow that exact key with an own null.
        const handlers = editor.squire._keyHandlers;
        assert.equal(typeof Object.getPrototypeOf(handlers)[key], "function", label);
        assert.equal(Object.prototype.hasOwnProperty.call(handlers, key), true, label);
        assert.equal(handlers[key], null, label);

        press(element, "]", init);

        assert.equal(element.innerHTML, before, label);
        assert.equal(element.querySelectorAll("blockquote").length, 0, label);
        // The <p> is what the reload takes apart, so it is the <p> that reparses.
        assert.equal(reparse(element.closest("p")).childNodes.length, 1, label);
      }
    );
    }
  );
});

// Nothing rearranges any of these on reload, so the parser is not what decides
// here. A container root stays forgiving: the list command runs and the region
// comes back from a reparse exactly as it was written. A root the author wrote as
// a line of text keeps the shape they gave it, so the command is never offered.
test("a bullet list is allowed in a container root and left off a text-line root", () => {
  [
    ["<div><x-widget editable>Hello world</x-widget></div>", true],
    ["<div><h2 editable>Hello world</h2></div>", false],
    ["<div><span editable>Hello world</span></div>", false]
  ].forEach(([markup, allowed]) => {
    const { element, editor } = mountMarkup(markup);
    const before = element.innerHTML;
    caretAt(editor, element.firstChild, 0);

    silenceWarnings(() => editor.runControl(editor.registry.get("unorderedList")));

    if (!allowed) {
      assert.equal(editor.registry.get("unorderedList").isDisabled(editor), true, markup);
      assert.equal(element.innerHTML, before, markup);
      return;
    }

    assert.equal(element.querySelectorAll("ul").length, 1, markup);
    assert.equal(element.querySelector("li").textContent, "Hello world", markup);

    const probe = reparse(element);
    assert.equal(probe.childNodes.length, 1, markup);
    assert.equal(probe.firstElementChild.innerHTML, element.innerHTML, markup);
  });
});

// Cmd+C, Cmd+S and Cmd+F edit nothing, so they must not trigger the repair: on a
// freshly opened page the repair is the whole rewrite, and a region nobody
// touched would be saved changed.
test("modified keys that do not edit leave a fresh region byte-identical", () => {
  const { element, editor } = mount();
  const paragraph = element.querySelector("p");
  caretAt(editor, paragraph.firstChild, 1);

  [["c", { metaKey: true }], ["s", { metaKey: true }], ["z", { metaKey: true }]].forEach(
    ([key, init]) => {
      press(element, key, init);
      assert.equal(element.innerHTML, SOURCE, key);
    }
  );

  // The narrowing must not undo round 2's fix: Ctrl+D is a key this editor
  // rebound to Squire's own Delete, so it still repairs.
  press(paragraph, "d", { ctrlKey: true });
  assert.equal(editorRootNeedsNormalization(element, { wrapBareRoot: true }), false);
  assert.equal(element.innerHTML, "<p>One</p><p>Two</p>");
});

// The control: a root that can hold blocks must keep the paragraphs it was
// handed.
test("pasting two paragraphs into a block-capable root keeps them as paragraphs", () => {
  const { element, editor } = mountMarkup("<div editable><p>Hello world</p></div>");
  const paragraph = element.querySelector("p");
  caretAt(editor, paragraph.firstChild, 5);

  editor.squire.insertHTML("<p>A</p><p>B</p>");

  assert.equal(element.innerHTML, "<p>HelloA</p><p>B world</p><div><br></div>");
  const probe = reparse(element);
  assert.equal(probe.firstElementChild.innerHTML, element.innerHTML);
});

// Select All anchors both boundaries on the root itself, where closest() has no
// ancestor to walk, so the list reported as absent and the button re-made it.
test("Select All over a lone list still turns the list off", () => {
  const { element, editor } = mount("<ul><li>One</li><li>Two</li></ul>");
  const range = element.ownerDocument.createRange();
  range.selectNodeContents(element);
  editor.squire.setSelection(range);
  editor.saveSelection();

  assert.equal(editor.pathHas("UL"), true);
  editor.runControl(editor.registry.get("unorderedList"));

  assert.equal(element.querySelectorAll("ul").length, 0);
  assert.equal(element.textContent.replace(/\s+/g, ""), "OneTwo");
});

// Squire's _ensureBottomLine appends a default block whenever the root's last
// element child is not its blockTag, and Backspace over a selection runs it. In a
// region that keeps no blocks that is a block nobody asked for, and the save hook
// cannot clean it up without leaving the <br> behind.
test("Backspace over a selection leaves no block and no stray <br>", () => {
  ["<p editable>Hello world</p>", '<h1 editable="single-line">Hello world</h1>'].forEach(markup => {
    const { element, editor } = mountMarkup(markup);
    const text = element.firstChild;
    const range = element.ownerDocument.createRange();
    range.setStart(text, 4);
    range.setEnd(text, 5);
    editor.squire.setSelection(range);
    editor.saveSelection();

    press(element, "Backspace");

    const saved = savedRegion(element);
    assert.equal(saved.innerHTML, "Hell world", markup);
    assert.equal(saved.querySelectorAll("br").length, 0, markup);
    assert.equal(saved.querySelectorAll("div").length, 0, markup);
  });
});

// The residue, over two sessions: the save hook flattens the manufactured block
// but its <br> stays, the reopened file gets another, and the region grows a
// blank line per edit. Only the file matters here, so each round starts from the
// markup the previous save produced.
test("the manufactured <br> does not accumulate across sessions", () => {
  let markup = "<p editable>Hello world</p>";
  [
    [4, "Hell world"],
    [3, "Hel world"]
  ].forEach(([offset, expected]) => {
    const { element, editor } = mountMarkup(markup);
    const text = element.firstChild;
    const range = element.ownerDocument.createRange();
    range.setStart(text, offset);
    range.setEnd(text, offset + 1);
    editor.squire.setSelection(range);
    editor.saveSelection();

    press(element, "Backspace");

    const saved = savedRegion(element);
    assert.equal(saved.innerHTML, expected);
    assert.equal(saved.querySelectorAll("br").length, 0);
    markup = saved.outerHTML;
  });
});

// The author wrote a heading as a line of text, so their file still says exactly
// that after an edit: no manufactured <div> around it, and no warning telling
// them off for writing a heading.
test("<h2 editable> keeps the shape the author wrote through a first edit", () => {
  const { element, editor } = mountMarkup("<div><h2 editable>Hello world</h2></div>");

  const warnings = captureWarnings(() => {
    caretAt(editor, element.firstChild, 5);
    type(editor, element.firstChild, 5, "x");
  });

  assert.deepEqual(warnings, []);
  const saved = savedRegion(element);
  assert.equal(saved.innerHTML, "Hellox world");
  assert.equal(saved.querySelectorAll("div").length, 0);
});

// Nothing rearranges a block inside a <span>, so the save hook leaves one alone
// and a manufactured wrapper would reach the file unopposed. The runtime display
// is the one thing richclay still adds, and it never gets saved.
test("<span editable> is unrewritten too, and still gets its runtime display", () => {
  const { element, editor } = mountMarkup("<div><span editable>Hello world</span></div>");
  assert.equal(element.style.display, "inline-block");

  const warnings = captureWarnings(() => {
    caretAt(editor, element.firstChild, 5);
    type(editor, element.firstChild, 5, "x");
  });

  assert.deepEqual(warnings, []);
  const saved = savedRegion(element);
  assert.equal(saved.innerHTML, "Hellox world");
  assert.equal(saved.querySelectorAll("div").length, 0);
  assert.equal(saved.hasAttribute("style"), false);
});

// The rule is scoped to roots written as a line of text, not to "has no blocks
// yet": a <div> is a container, so it still gets the wrapper Squire's Enter and
// Backspace need, and every block control with it.
test("<div editable> still gets the bare-root wrap and the block controls", () => {
  const { element, editor } = mountMarkup("<div editable>Hello</div>");

  assert.equal(editor.blocksStayOut(), false);
  assert.equal(editor.registry.get("unorderedList").isDisabled(editor), false);

  silenceWarnings(() => editor.ensureRootIsEditable());
  assert.equal(element.innerHTML, "<div>Hello</div>");
});
