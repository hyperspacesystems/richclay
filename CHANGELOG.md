# Changelog

## [0.6.1] - 2026-10-15

### Changed
- Synced content-dom.js and region-capabilities.js with the latest ClayJS versions

### Fixed
- A select with an excluded option now keeps its selection in the content view



## [0.6.0] - 2026-10-03

### Changed
- Apply finalized RichClay toolbar and menu icons
- Remove existing links when their URL is cleared
- Move link removal into the link dialog
- Remove retired RichClay icon styles
- Adopt Phosphor toolbar icons
- Rebuild dist bundle for the floating link dialog
- Float the link dialog as a positioned popover

### Fixed
- Prevent link navigation while editing in RichClay
- Copy checked, selected, and file input state correctly
- Import hyper-morph from its index in the editor UI test
- Write the floating toolbar's placement inline with !important
- Check a descendant's own region marker on the element itself, synced from ClayJS content-dom.js



## [Unreleased]

## [0.8.0] - 2026-11-11

### Added
- A link popover for viewing and editing a link where it sits in the document.
- Link-label mode for shared navigation links, so a shared link can show its own label.
- Relative file names are accepted in the link form.

### Fixed
- Escape closes the link popover and still reaches a modal dialog open around the editor, so the dialog closes too.

## [0.7.0] - 2026-10-30

### Added
- `RichClay.watch` returns a stop function that ends watching, and calling it more than once is safe.

### Changed
- Use the selected house pilcrow and clear-formatting toolbar icons, and add paragraph, heading, quote, and code icons to the block-style menu. Other toolbar icons retain their Phosphor regular drawings.
- When ClayJS manages the page, RichClay's auto-init leaves setup to ClayJS.

### Fixed
- Prevent link clicks and middle-clicks from navigating away while a RichClay editor is active.

## [0.5.0] - 2026-09-04

### Fixed
- **A `data-richclay` marker richclay invented is now taken back off.** Binding an editor to an element carrying none of richclay's four selectors stamps `data-richclay` on it, so the watcher re-adopts the region after a node replacement. Nothing removed that stamp, so a single editing session permanently changed the author's file and the element stayed independently editable on every later load. Richclay now records its own stamps with `data-richclay-runtime-marker` and removes both on save and on `destroy()`. A `data-richclay` the author wrote has no provenance attribute and is preserved byte for byte, exactly as before. This is the same provenance mechanism `data-richclay-runtime-contenteditable` already used.
- **Live-sync frames no longer carry the editor's runtime state.** The save-strip registered only through the host's document transform, which runs on the save branch only, after the sync frame has already gone out. Every collaborator therefore received `contenteditable`, the active classes, the runtime marker and the floating toolbar, and their own watcher, which subscribes to `data-richclay`, mounted an editor on it. The strip now registers through the host's `onSnapshot` hook where one exists, which covers save and sync alike, and falls back to the document transform for an older client.

### Changed
- Because the strip now runs at snapshot time, it also runs over the clone used for dirty comparison. Editor chrome therefore no longer contributes to whether the page is considered changed.

## [0.4.0] - 2026-08-27

### Changed
- **A custom element carrying a bare `editable` attribute is no longer mounted as an editor.** `editable` is a common boolean property name on web components (Lit reflects `@property({ type: Boolean }) editable` straight to this attribute), where it means whatever that component decided and never rich text. Mounting an editor on one made its rendered output typeable and wrote that output into the author's saved file, damage they could not see until opening the file. The rule is exact: a custom element's tag name always contains a hyphen. Passing an explicit selector to `RichClay.init()` is unaffected, since a caller who names its own hosts means them.

### Added
- `clay-editable` is accepted everywhere `editable` is, down to the option tokens: `clay-editable="single-line no-toolbar toolbar-on-select"` behaves exactly as the bare spelling does, mounts the same inline editor, and is followed by the runtime watcher in both directions. On a custom element it is how one opts back in. On any other element it is a plain alias, left out of the documentation on purpose, so a file written today has a spelling to fall back to if the bare name ever stops being available. An alias that behaved differently from the name it aliases would be worse than none, since the page reaching for it is already in trouble.

### Fixed
- The recognition marker richclay stamps on an element it adopted now asks whether the watcher would adopt that element again, rather than whether it merely matches the selector. Those are different questions for a custom element mounted through an explicit selector: it matches by its bare `editable` and is still refused by the host guard, so without a marker its editor died on the first node replacement, which is what every live-sync morph does, and never came back.
- A custom element the host guard skipped no longer blocks a genuine editable inside it. The nesting check walked ancestors with the unguarded selector, so `<my-grid editable>` wrapping an `<h2 editable>` left the page with no editors at all.
- Removing the opt-in attribute from a custom element tears its editor down. The watcher decided by the selector alone, which such an element still matched through its bare `editable`, so it stayed mounted and its classes, `contenteditable`, ARIA state and provenance attributes were serialized into the author's file.

### Internal
- `scripts/propagate.js` no longer lists hyperclay-actual-website as a destination.



## [0.2.3] - 2026-08-21

### Changed
- Update richclay
- License: relicensed to MIT-0 (MIT No Attribution). Same rights, attribution no longer required for our code; vendored third-party files keep their original licenses (see THIRD-PARTY-NOTICES.md). This shipped in 0.2.3 and was recorded here later; it was previously stranded under an `[Unreleased]` heading between two released versions.

## [0.2.2] - 2026-08-15

### Added
- Update richclay



## [0.2.1] - 2026-08-14

### Changed
- Update richclay



## [0.2.0] - 2026-08-12

### Added
- Squire vendoring patches

### Changed
- Expanded editable root support
- Declare kind, status, and url in the hyper key
- Update richclay


