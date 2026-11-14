// Phosphor regular toolbar icons with selected house-style replacements.
const svg = (inner, viewBox = "0 0 18 18") =>
  `<svg viewBox="${viewBox}" width="18" height="18" aria-hidden="true" focusable="false">${inner}</svg>`;

const icons = {
  bold: svg(`<path fill="currentColor" d="M178.48,115.7A44,44,0,0,0,148,40H80a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8h80a48,48,0,0,0,18.48-92.3ZM88,56h60a28,28,0,0,1,0,56H88Zm72,136H88V128h72a32,32,0,0,1,0,64Z"/>`, "0 0 256 256"),
  italic: svg(`<path fill="currentColor" d="M200,56a8,8,0,0,1-8,8H157.77L115.1,192H144a8,8,0,0,1,0,16H64a8,8,0,0,1,0-16H98.23L140.9,64H112a8,8,0,0,1,0-16h80A8,8,0,0,1,200,56Z"/>`, "0 0 256 256"),
  underline: svg(`<path fill="currentColor" d="M200,224a8,8,0,0,1-8,8H64a8,8,0,0,1,0-16H192A8,8,0,0,1,200,224Zm-72-24a64.07,64.07,0,0,0,64-64V56a8,8,0,0,0-16,0v80a48,48,0,0,1-96,0V56a8,8,0,0,0-16,0v80A64.07,64.07,0,0,0,128,200Z"/>`, "0 0 256 256"),
  strike: svg(`<path fill="currentColor" d="M224,128a8,8,0,0,1-8,8H175.93c9.19,7.11,16.07,17.2,16.07,32,0,13.34-7,25.7-19.75,34.79C160.33,211.31,144.61,216,128,216s-32.33-4.69-44.25-13.21C71,193.7,64,181.34,64,168a8,8,0,0,1,16,0c0,17.35,22,32,48,32s48-14.65,48-32c0-14.85-10.54-23.58-38.77-32H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM76.33,104a8,8,0,0,0,7.61-10.49A17.3,17.3,0,0,1,83.11,88c0-18.24,19.3-32,44.89-32,18.84,0,34.16,7.42,41,19.85a8,8,0,0,0,14-7.7C173.33,50.52,152.77,40,128,40,93.29,40,67.11,60.63,67.11,88a33.73,33.73,0,0,0,1.62,10.49A8,8,0,0,0,76.33,104Z"/>`, "0 0 256 256"),
  link: svg(`<path fill="currentColor" d="M240,88.23a54.43,54.43,0,0,1-16,37L189.25,160a54.27,54.27,0,0,1-38.63,16h-.05A54.63,54.63,0,0,1,96,119.84a8,8,0,0,1,16,.45A38.62,38.62,0,0,0,150.58,160h0a38.39,38.39,0,0,0,27.31-11.31l34.75-34.75a38.63,38.63,0,0,0-54.63-54.63l-11,11A8,8,0,0,1,135.7,59l11-11A54.65,54.65,0,0,1,224,48,54.86,54.86,0,0,1,240,88.23ZM109,185.66l-11,11A38.41,38.41,0,0,1,70.6,208h0a38.63,38.63,0,0,1-27.29-65.94L78,107.31A38.63,38.63,0,0,1,144,135.71a8,8,0,0,0,16,.45A54.86,54.86,0,0,0,144,96a54.65,54.65,0,0,0-77.27,0L32,130.75A54.62,54.62,0,0,0,70.56,224h0a54.28,54.28,0,0,0,38.64-16l11-11A8,8,0,0,0,109,185.66Z"/>`, "0 0 256 256"),
  unlink: svg(`<path fill="currentColor" d="M198.63,57.37a32,32,0,0,0-45.19-.06L141.79,69.52a8,8,0,0,1-11.58-11l11.72-12.29a1.59,1.59,0,0,1,.13-.13,48,48,0,0,1,67.88,67.88,1.59,1.59,0,0,1-.13.13l-12.29,11.72a8,8,0,0,1-11-11.58l12.21-11.65A32,32,0,0,0,198.63,57.37ZM114.21,186.48l-11.65,12.21a32,32,0,0,1-45.25-45.25l12.21-11.65a8,8,0,0,0-11-11.58L46.19,141.93a1.59,1.59,0,0,0-.13.13,48,48,0,0,0,67.88,67.88,1.59,1.59,0,0,0,.13-.13l11.72-12.29a8,8,0,1,0-11.58-11ZM216,152H192a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16ZM40,104H64a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16Zm120,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V192A8,8,0,0,0,160,184ZM96,72a8,8,0,0,0,8-8V40a8,8,0,0,0-16,0V64A8,8,0,0,0,96,72Z"/>`, "0 0 256 256"),
  ul: svg(`<path fill="currentColor" d="M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z"/>`, "0 0 256 256"),
  ol: svg(`<path fill="currentColor" d="M224,128a8,8,0,0,1-8,8H104a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM104,72H216a8,8,0,0,0,0-16H104a8,8,0,0,0,0,16ZM216,184H104a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM43.58,55.16,48,52.94V104a8,8,0,0,0,16,0V40a8,8,0,0,0-11.58-7.16l-16,8a8,8,0,0,0,7.16,14.32ZM79.77,156.72a23.73,23.73,0,0,0-9.6-15.95,24.86,24.86,0,0,0-34.11,4.7,23.63,23.63,0,0,0-3.57,6.46,8,8,0,1,0,15,5.47,7.84,7.84,0,0,1,1.18-2.13,8.76,8.76,0,0,1,12-1.59A7.91,7.91,0,0,1,63.93,159a7.64,7.64,0,0,1-1.57,5.78,1,1,0,0,0-.08.11L33.59,203.21A8,8,0,0,0,40,216H72a8,8,0,0,0,0-16H56l19.08-25.53A23.47,23.47,0,0,0,79.77,156.72Z"/>`, "0 0 256 256"),
  quote: svg(`<path fill="currentColor" d="M100,56H40A16,16,0,0,0,24,72v64a16,16,0,0,0,16,16h60v8a32,32,0,0,1-32,32,8,8,0,0,0,0,16,48.05,48.05,0,0,0,48-48V72A16,16,0,0,0,100,56Zm0,80H40V72h60ZM216,56H156a16,16,0,0,0-16,16v64a16,16,0,0,0,16,16h60v8a32,32,0,0,1-32,32,8,8,0,0,0,0,16,48.05,48.05,0,0,0,48-48V72A16,16,0,0,0,216,56Zm0,80H156V72h60Z"/>`, "0 0 256 256"),
  undo: svg(`<path fill="currentColor" d="M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L44.59,96H72a8,8,0,0,1,0,16H24a8,8,0,0,1-8-8V56a8,8,0,0,1,16,0V85.8L60.25,60A96,96,0,0,1,224,128Z"/>`, "0 0 256 256"),
  redo: svg(`<path fill="currentColor" d="M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1,0-16H211.4L184.81,71.64l-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60L224,85.8V56a8,8,0,1,1,16,0Z"/>`, "0 0 256 256"),
  clear: svg(`<path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter" d="M3 3l18 18M5 5v3M9 5h10v3M12 5v3M12 12v7M8 19h8"/>`, "0 0 24 24"),
  code: svg(`<path fill="currentColor" d="M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.7-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z"/>`, "0 0 256 256"),
  indent: svg(`<path fill="currentColor" d="M224,128a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM112,72H216a8,8,0,0,0,0-16H112a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM34.34,141.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0,0-11.32l-40-40A8,8,0,0,0,34.34,61.66L68.69,96,34.34,130.34A8,8,0,0,0,34.34,141.66Z"/>`, "0 0 256 256"),
  outdent: svg(`<path fill="currentColor" d="M224,128a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM112,72H216a8,8,0,0,0,0-16H112a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM72,144a8,8,0,0,0,5.66-13.66L43.31,96,77.66,61.66A8,8,0,0,0,66.34,50.34l-40,40a8,8,0,0,0,0,11.32l40,40A8,8,0,0,0,72,144Z"/>`, "0 0 256 256"),
  blocks: svg(`<path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square" stroke-linejoin="miter" d="M19 4h-9a4.5 4.5 0 0 0 0 9h3M13 4v16M17 4v16"/>`, "0 0 24 24"),
  h1: svg(`<path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M3.5 5.5v12M12 5.5v12M3.5 11.5H12M17 12l3-2v10"/>`, "0 0 24 24"),
  h2: svg(`<path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M3.5 5.5v12M12 5.5v12M3.5 11.5H12M16 12.5c0-3.5 6-3.5 6 0 0 2-2.5 3.5-6 7.5h6"/>`, "0 0 24 24"),
  h3: svg(`<path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" d="M3.5 5.5v12M12 5.5v12M3.5 11.5H12M16 11c1.5-1.5 6-1.5 6 1.5 0 1.5-1.5 2.5-3 2.5h-1M19 15c1.5 0 3 1 3 2.5 0 3-4.5 3-6 1.5"/>`, "0 0 24 24")
};

const blocksOnly = editor => editor.blocksStayOut();

// A link inside a link is not a thing HTML has: the parser splits them on the next
// page load and everything after the inner one leaves the region. Squire will build
// it happily, so the control is the place to stop it.
const notInsideLink = editor => Boolean(editor.element.closest("a"));

export const presets = {
  minimal: ["bold", "italic", "link", "unorderedList"],
  inline: [
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "code",
    "link",
    "undo",
    "redo",
    "clearFormatting"
  ],
  standard: [
    "blockMenu",
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "code",
    "link",
    "unorderedList",
    "orderedList",
    "quote",
    "outdent",
    "indent",
    "undo",
    "redo",
    "clearFormatting"
  ]
};

export function createDefaultRegistry() {
  return new Map(defaultButtons.map(button => [button.id, button]));
}

// Squire binds Meta on Apple platforms and Ctrl everywhere else (its `ctrlKey`,
// source/keyboard/KeyHandlers.ts). richclay has to agree, or a shortcut label
// and the key that actually fires it drift apart.
export function isApplePlatform(win = globalThis) {
  const nav = win?.navigator;
  if (!nav) return false;
  return /Mac|iPhone|iPad|iPod/.test(nav.platform || nav.userAgent || "");
}

export function formatShortcut(shortcut, win = globalThis) {
  if (!shortcut) return "";
  return shortcut.replace("Mod", isApplePlatform(win) ? "Cmd" : "Ctrl");
}

export const defaultButtons = [
  toggle("bold", "Bold", icons.bold, "Mod+B", "inline", editor => editor.toggleFormat("B", "bold", "removeBold")),
  toggle("italic", "Italic", icons.italic, "Mod+I", "inline", editor =>
    editor.toggleFormat("I", "italic", "removeItalic")
  ),
  toggle("underline", "Underline", icons.underline, "Mod+U", "inline", editor =>
    editor.toggleFormat("U", "underline", "removeUnderline")
  ),
  toggle("strikethrough", "Strikethrough", icons.strike, "Mod+Shift+7", "inline", editor =>
    editor.toggleFormat("S", "strikethrough", "removeStrikethrough")
  ),
  // No shortcut. One keystroke turning a paragraph of prose into a code block is
  // a sharp edge in an editor whose DOM is the saved file, and Mod+D also shadows
  // the browser's own bookmark shortcut. The toolbar button stays.
  toggle("code", "Code", icons.code, null, "inline", editor => editor.toggleCode(), editor =>
    editor.selectionHasFormat("CODE") || editor.selectionHasFormat("PRE")
  ),
  {
    id: "link",
    label: "Link",
    ariaLabel: "Insert or edit link",
    icon: icons.link,
    group: "links",
    shortcut: "Mod+K",
    mutates: false,
    isDisabled: notInsideLink,
    run: editor => editor.openLinkDialog(),
    isActive: editor => Boolean(editor.currentLinkElement())
  },
  {
    id: "unlink",
    label: "Remove link",
    ariaLabel: "Remove link",
    icon: icons.unlink,
    group: "links",
    run: editor => editor.squire.removeLink()
  },
  toggle("unorderedList", "Bulleted list", icons.ul, "Mod+Shift+8", "lists",
    editor => editor.toggleList("UL"),
    editor => editor.pathHas("UL"),
    blocksOnly
  ),
  toggle("orderedList", "Numbered list", icons.ol, "Mod+Shift+9", "lists",
    editor => editor.toggleList("OL"),
    editor => editor.pathHas("OL"),
    blocksOnly
  ),
  toggle("quote", "Quote", icons.quote, null, "blocks", editor => {
    if (editor.pathHas("BLOCKQUOTE")) return editor.squire.decreaseQuoteLevel();
    return editor.squire.increaseQuoteLevel();
  }, editor => editor.pathHas("BLOCKQUOTE"), blocksOnly),
  {
    id: "outdent",
    label: "Outdent",
    ariaLabel: "Decrease indent",
    icon: icons.outdent,
    group: "blocks",
    shortcut: "Mod+[",
    isDisabled: blocksOnly,
    run: editor => editor.outdent()
  },
  {
    id: "indent",
    label: "Indent",
    ariaLabel: "Increase indent",
    icon: icons.indent,
    group: "blocks",
    shortcut: "Mod+]",
    isDisabled: blocksOnly,
    run: editor => editor.indent()
  },
  {
    id: "undo",
    label: "Undo",
    ariaLabel: "Undo",
    icon: icons.undo,
    group: "history",
    shortcut: "Mod+Z",
    mutates: false,
    run: editor => editor.history("undo")
  },
  {
    id: "redo",
    label: "Redo",
    ariaLabel: "Redo",
    icon: icons.redo,
    group: "history",
    shortcut: "Mod+Shift+Z",
    mutates: false,
    run: editor => editor.history("redo")
  },
  {
    id: "clearFormatting",
    label: "Clear formatting",
    ariaLabel: "Clear formatting",
    icon: icons.clear,
    group: "cleanup",
    run: editor => editor.squire.removeAllFormatting()
  },
  {
    id: "blockMenu",
    type: "menu",
    label: "Block style",
    ariaLabel: "Choose block style",
    icon: icons.blocks,
    group: "blocks",
    isDisabled: blocksOnly,
    options: [
      blockOption("Paragraph", "P", icons.blocks),
      blockOption("Heading 1", "H1", icons.h1),
      blockOption("Heading 2", "H2", icons.h2),
      blockOption("Heading 3", "H3", icons.h3),
      {
        label: "Quote",
        icon: icons.quote,
        value: "BLOCKQUOTE",
        isDisabled: blocksOnly,
        run: editor => editor.squire.increaseQuoteLevel(),
        isActive: editor => editor.pathHas("BLOCKQUOTE")
      },
      {
        label: "Code block",
        icon: icons.code,
        value: "PRE",
        isDisabled: blocksOnly,
        run: editor => editor.setBlockType("PRE"),
        isActive: editor => editor.pathHas("PRE")
      }
    ]
  }
];

function toggle(id, label, icon, shortcut, group, run, isActive = editor => editor.selectionHasFormat(labelTag(id)), isDisabled) {
  return {
    id,
    label,
    ariaLabel: label,
    icon,
    group,
    shortcut,
    isDisabled,
    run,
    isActive
  };
}

function labelTag(id) {
  return {
    bold: "B",
    italic: "I",
    underline: "U",
    strikethrough: "S"
  }[id];
}

function blockOption(label, tag, icon) {
  return {
    label,
    icon,
    value: tag,
    isDisabled: blocksOnly,
    run: editor => editor.setBlockType(tag),
    isActive: editor => editor.pathHas(tag)
  };
}
