# richclay

`richclay` is a small, no-build rich text editor for Hyperclay™-style malleable HTML. It wraps Squire for editing commands and undo/redo, uses DOMPurify for sanitization, and treats the editable element's live DOM as the document source of truth.

The generated toolbar, dialogs, live regions, runtime classes, and `contenteditable` state are editor chrome. They are added only while editing and stripped before Hyperclay serializes the page.

## Files

- `richclay.css` - default theme, exposed through CSS custom properties.
- `richclay.js` - classic-script global build. Loads as `window.RichClay`.
- `src/` - readable ESM source.
- `vendor/` - vendored Squire and DOMPurify files for offline use.
- `demo/index.html` - standalone editor, custom button, and simulated Hyperclay save round-trip.
- `tests/` - Node `node:test` + jsdom coverage for DOM behavior.

## Quick Start

Use this path for standalone HTML pages and Hyperclay apps. It needs no bundler, framework, or install step.

```html
<link rel="stylesheet" href="richclay.css">
<script src="vendor/purify.min.js"></script>
<script src="vendor/squire.js"></script>
<script src="richclay.js"></script>

<div data-richclay aria-label="Page body">
  <p>Edit this content.</p>
</div>

<script>
  RichClay.init();
</script>
```

For ESM source usage:

```js
import RichClay from "./src/richclay.js";

const editor = new RichClay(document.querySelector("[data-richclay]"), {
  toolbar: "standard",
  placeholder: "Write..."
});
```

Squire and DOMPurify must be available globally for normal browser use. Tests can inject a `Squire` class through options.

## Hyperclay Use

Mark persistent rich text regions with `data-richclay` or `richclay`:

```html
<div data-richclay aria-label="Article body">
  <h2>Saved content</h2>
  <p>This HTML is the document.</p>
</div>
```

In standalone pages, richclay activates by default. In Hyperclay mode, it activates only in edit mode unless `hyperclay: false` is passed. Edit mode is detected from, in order:

- `?editmode=true` or `?editmode=false`
- `window.__hyperclayEditMode`
- `window.hyperclay.isEditMode`
- a non-empty `isAdminOfCurrentResource` cookie (Hyperclay's owner-session signal)

When `window.hyperclay.beforeSave` exists, richclay registers one cleanup hook for the page. The hook runs on Hyperclay's cloned document before serialization and:

- preserves the editor marker and semantic content HTML,
- removes toolbar, menu, dialog, and live-region DOM,
- removes richclay-added `contenteditable` outright; author-provided `contenteditable` becomes `inert-contenteditable`,
- removes richclay runtime classes and runtime-only ARIA attributes,
- removes generated `no-undo`, `snapshot-remove`, `no-watch`, and known Squire artifacts.

On the next edit-mode load, `inert-contenteditable` is consumed back into `contenteditable` and Squire reattaches to the existing inner HTML. View-mode pages remain static and non-editable.

## Inline Editing With `editable`

Put an `editable` attribute on any element and it becomes a rich text editor in place while editing: same element, same page styles, no card chrome. The attribute value is a space-separated token list, like `class`:

```html
<h1 editable="single-line">Page title</h1>
<div editable>
  <p>Multi-line rich text, the default.</p>
</div>
<p editable="single-line no-toolbar">Caption</p>
```

| Token | Meaning |
| --- | --- |
| *(none)* | Multi-line rich text editor. |
| `single-line` | Enter and Shift+Enter do nothing; pasted blocks are flattened to one line. |
| `no-toolbar` | No toolbar UI. Keyboard shortcuts stay active. |
| `toolbar-on-select` | The toolbar appears only while text is selected. |

Unknown tokens are ignored. In Hyperclay pages, `editable` activates only in edit mode. In view mode and in the saved file it is an inert marker: the saved markup contains no `contenteditable` or other runtime state, just the author's content plus the attribute.

### Setup

In a Hyperclay app, load hyperclayjs with a preset that includes richclay (`smooth-sailing` or `everything`) and add the attribute. richclay is bundled inside hyperclayjs and self-activates in edit mode; there is nothing else to load and no init call:

```html
<script src="https://hyperclay.com/public/js/hyperclay.js?preset=smooth-sailing" type="module"></script>

<h1 editable="single-line">Page title</h1>
```

On a standalone page, load the same three scripts as the Quick Start and call `RichClay.init()`; it picks up `[editable]` elements alongside `[data-richclay]`:

```html
<link rel="stylesheet" href="richclay.css">
<script src="vendor/purify.min.js"></script>
<script src="vendor/squire.js"></script>
<script src="richclay.js"></script>

<h1 editable="single-line">Page title</h1>

<script>
  RichClay.init();
</script>
```

The self-contained `dist/richclay.min.js` (Squire and DOMPurify bundled, the build hyperclayjs vendors) needs no init call in Hyperclay pages: it auto-activates in edit mode. `demo/inline.html` is a working standalone example of every token and toolbar placement.

Differences from card editors (`data-richclay`):

- **Content fidelity.** Activation never rewrites the element's content: no sanitize pass, no block re-wrapping. Sanitization still guards paste and `setHTML()`, with an allowlist extended for real page markup (`class`, `id`, `data-*`, `img`).
- **Floating toolbar.** Created when the editor gains focus, removed on blur. It floats 16px above the element; if that scrolls out of view it flips below; if both edges are off-screen it becomes a compact vertical rail in the wider page margin, shrinking its gap 16px to 8px to 0px to fit; when nothing fits it pins to the top of the viewport. Alt+F10 moves focus into the toolbar, Escape returns it to the editor.
- **Single-line preset.** `single-line` editors default to the `inline` toolbar preset (inline formatting, links, history, clear; no block controls).

The same behavior is available from JS: `new RichClay(el, { inline: true, singleLine: true, toolbarOnSelect: false })`. Attribute tokens are derived automatically when the element has `editable`; explicit constructor options win over tokens.

Dynamically added `editable` (or `data-richclay`) elements mount automatically once `RichClay.watch()` is running; `autoInit` starts it in edit mode. Removing the marker attribute destroys that editor.

## API

```js
const editor = new RichClay(element, options);
const editors = RichClay.init("[data-richclay]", options);

editor.getHTML();
editor.setHTML("<p>Hello</p>");
editor.focus();
editor.history("undo");
editor.destroy();
editor.registerButton(def);
editor.unregisterButton(id);
editor.squire;

RichClay.registerButton(def);
RichClay.unregisterButton(id);
RichClay.presets;
RichClay.selector;
RichClay.stripFromClone(document.documentElement);
RichClay.savedContent(element);
RichClay.setSavedContent(element, html);
RichClay.hostHistory;
RichClay.keepsOwnHistory;
RichClay.watch(win, options);
```

Options:

| Option | Default | Notes |
| --- | --- | --- |
| `toolbar` | `"standard"` | Preset name or ordered array of built-in ids, separators, and custom definitions. `false` renders no toolbar (shortcuts stay active). |
| `toolbarContainer` | `null` | Element or selector. Defaults to inline above the editor. |
| `sanitize` | `{}` | DOMPurify config merged over the default allowlist. |
| `placeholder` | `""` | Visual placeholder plus screen-reader description while empty. |
| `readOnly` | `false` | Leaves the region inert, but `setHTML()` still sanitizes. |
| `hyperclay` | `"auto"` | `true`, `false`, or auto-detect. |
| `onChange` | `null` | Called with sanitized HTML on Squire input. |
| `Squire` | `null` | Optional constructor override, mainly for tests. |

`new RichClay(element)` is idempotent per element. Calling it again with the same element returns the existing instance.

`editor.history(direction)` undoes (`"undo"`) or redoes (`"redo"`) this field's own step and returns the editor; when the field has no step left it dispatches a bubbling `richclay:history-exhausted` event with `detail.direction`, so the host can run its own page undo instead of the field silently doing nothing.

`RichClay.savedContent(element)` returns the content (child markup) that field would save, the same string whether its editor is mounted, destroyed or never mounted, and `undefined` for an element richclay does not own; a host's page undo compares it to tell a real text change from editor runtime state.

`RichClay.setSavedContent(element, html, { morph })` writes saved content back to a field exactly, returns `true`, and restarts the field's own undo baseline there, so the next edit undoes to the written content; it returns `false` and changes nothing for an element richclay does not own. Pass `morph`, a synchronous `morph(root, html, options)`, when the write must land before the call returns (an undo engine that rebaselines right after it); without it the page's `clay.morph` is used, which may apply later.

`RichClay.hostHistory` is a static boolean, `false` by default. When a host owns the page's undo timeline it sets it to `true`: then `editor.canHistory(direction)` answers `false` and `editor.history(direction)` dispatches `richclay:history-exhausted`, so the host's page undo runs instead. A field the author marked `no-undo` keeps its own history either way.

`RichClay.keepsOwnHistory` is a static function `(element) => boolean`, `null` by default. A host sets it to name the fields its own author kept out of page undo: such a field keeps its own Squire history even while `hostHistory` is on, so `canHistory` answers from the field.

Each mount dispatches a bubbling `richclay:mount` event on the field, so the host can start tracking it. `editor.replaceContent(html)` replaces the field's children the same way Squire's own undo does.

Mounting, reattaching and destroying an editor pause `window.clay.Mutation` around their own DOM writes when that hub is present, so the host's autosave does not record richclay's runtime attributes as edits.

## Toolbar

Presets:

- `minimal`: bold, italic, link, unordered list.
- `inline`: inline formatting, inline code, link, undo/redo, clear formatting (no block controls).
- `standard`: block menu, inline formatting, inline code, link, lists, quote, indent/outdent, undo/redo, clear formatting.

Toolbar arrays are the extension surface. Include built-in ids, omit ids to remove buttons, change order to reorder, and use `{ type: "separator" }` for an explicit separator.

Keyboard shortcuts come from the button registry plus your toolbar definitions, so they stay active even with `toolbar: false`. Unregister a button to remove its shortcut.

Built-in control ids are `blockMenu`, `bold`, `italic`, `underline`, `strikethrough`, `code`, `link`, `unlink`, `unorderedList`, `orderedList`, `quote`, `outdent`, `indent`, `undo`, `redo`, and `clearFormatting`. The `unlink` id stays registered for explicit custom toolbars even though no preset lists it.

```js
RichClay.registerButton({
  id: "timestamp",
  label: "Timestamp",
  ariaLabel: "Insert timestamp",
  icon: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 5v5l4 2-1 2-5-3V7h2Z"/></svg>',
  group: "insert",
  run(editor) {
    editor.squire.insertHTML(
      "<p><strong>Updated:</strong> " + new Date().toLocaleString() + "</p>"
    );
  }
});

new RichClay(document.querySelector("[data-richclay]"), {
  toolbar: ["bold", "italic", "link", { type: "separator" }, "timestamp"]
});
```

Button definitions support `id`, `label`, `ariaLabel`, `icon`, `run(editor)`, `isActive(editor)`, `isDisabled(editor)`, `shortcut`, and `group`. Menu controls use `type: "menu"` with an `options` array. Commands should call Squire APIs; do not use `document.execCommand`.

## Links

RichClay presets offer one Link control. It is pressed whenever the caret is inside an `a[href]` or any part of the selection covers linked content. A caret just outside a link, or a selection that only touches a link's text boundary, leaves the control unpressed. When a selection overlaps more than one link, the form opens the first one in document order. Apply updates that link's URL and preserves the surrounding selection's other text and links.

Pressing the control opens a form with the URL filled in. For an existing link the form shows a **Remove link** button before Cancel and Apply; a form for a new link has none. Remove link deletes the anchor and keeps its text and inline formatting, closes the form, returns focus to the editor, and announces "Link removed".

## Sanitization

DOMPurify is required. The default allowlist keeps semantic rich text: paragraphs, headings, lists, blockquotes, code/pre, inline emphasis, spans, and links. Scripts, event handlers, active embeds, forms, images, inline styles, and unsafe URL schemes are stripped by default.

Sanitization runs during activation, `setHTML()`, and Squire paste/insert paths through `sanitizeToDOMFragment`. Link dialog URLs also pass through `normalizeUrl()` before `squire.makeLink()`, so `javascript:`, `data:`, `vbscript:`, and control-character obfuscation are rejected.

An editable region may contain in flow controls marked `editor-ui` or
`clay="editor-ui"`. RichClay excludes those controls from public HTML,
clipboard HTML and text, mutation driven input events, and Squire history.
History replay retains the live control while restoring authored content. A
host with runtime controls must provide the shared retention aware morph
function; RichClay reports an explicit error instead of replacing that root.

Use additive DOMPurify options when possible:

```js
new RichClay(element, {
  sanitize: {
    ADD_TAGS: ["mark"],
    ADD_ATTR: ["data-id"]
  }
});
```

Passing `ALLOWED_TAGS` or `ALLOWED_ATTR` replaces the default list, matching DOMPurify semantics.

## Accessibility

The toolbar follows the ARIA toolbar pattern:

- `role="toolbar"` with an accessible label.
- Exactly one roving `tabindex="0"` control.
- Arrow keys move through controls; Home and End jump to the ends.
- Toggle buttons expose `aria-pressed`.
- Menus use `aria-haspopup`, `aria-expanded`, `role="menu"`, and `menuitemradio`.
- Escape closes menus and the link dialog, returning focus to the trigger/editor.

Toolbar pointer activation prevents focus theft and preserves the Squire selection. A polite live region announces command results such as `Bold on` or `Heading 2 applied`. The editor region gets native `contenteditable` behavior plus `role="textbox"` and `aria-multiline="true"` when those attributes were not provided by the author.

Keyboard shortcuts:

- Ctrl/Cmd+B - bold
- Ctrl/Cmd+I - italic
- Ctrl/Cmd+U - underline
- Ctrl/Cmd+K - link
- Ctrl/Cmd+Shift+8 - unordered list
- Ctrl/Cmd+Shift+9 - ordered list
- Ctrl/Cmd+Z - undo
- Ctrl/Cmd+Shift+Z - redo

`Mod` binds to Cmd on macOS and iOS and to Ctrl everywhere else, never both, so the platform's own Ctrl bindings keep working. On macOS, Ctrl+D and Ctrl+H stay forward delete and backward delete.

Keyboard-only walkthrough:

1. Tab into the toolbar.
2. Use Arrow keys to move between controls.
3. Press Enter or Space to activate a button.
4. Open the block menu, choose with Arrow keys, then press Enter.
5. Press Escape to close menus or the link dialog.
6. Tab into the editor and type normally.

Screen-reader checklist:

- Give each editor an `aria-label` or `aria-labelledby`.
- Confirm the toolbar announces as a toolbar with named controls.
- Confirm pressed state is spoken for toggle buttons.
- Confirm menu expanded/collapsed state is spoken.
- Confirm live-region announcements do not move focus.
- Confirm placeholder text is exposed through `aria-describedby` while empty.

## Styling

The default CSS is intentionally small and themeable. Override custom properties on `:root` or a container:

```css
.my-editor-shell {
  --richclay-accent: #7c3aed;
  --richclay-focus: #111827;
  --richclay-radius: 4px;
}
```

The stylesheet includes dark-mode defaults, visible focus states, forced-colors support, and reduced-motion handling.

## Demo And Development

Open `demo/index.html` in a browser to exercise the standalone editor, a registered custom button, and a simulated Hyperclay save/rehydrate flow.

Development commands:

```sh
npm install
npm test
npm run build
```

`npm install` is for development only. The shipped library path works offline from checked-in files. `npm run build` regenerates the classic-script `richclay.js` from `src/browser-global.js`.

## License

Our code is MIT-0 (MIT No Attribution): use it, remix it, ship it, no attribution
needed. richclay wraps Squire (MIT) and DOMPurify (Apache-2.0 OR MPL-2.0), which
keep their own licenses; see [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md) and
the license files in vendor/.
