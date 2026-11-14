/* richclay global build. Source lives in src/. Run npm run build to regenerate. */
var RichClayBundle = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/browser-global.js
  var browser_global_exports = {};
  __export(browser_global_exports, {
    default: () => browser_global_default
  });

  // src/buttons.js
  var svg = (inner, viewBox = "0 0 18 18") => `<svg viewBox="${viewBox}" width="18" height="18" aria-hidden="true" focusable="false">${inner}</svg>`;
  var icons = {
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
  var blocksOnly = (editor) => editor.blocksStayOut();
  var notInsideLink = (editor) => Boolean(editor.element.closest("a"));
  var presets = {
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
  function createDefaultRegistry() {
    return new Map(defaultButtons.map((button) => [button.id, button]));
  }
  function isApplePlatform(win = globalThis) {
    const nav = win?.navigator;
    if (!nav) return false;
    return /Mac|iPhone|iPad|iPod/.test(nav.platform || nav.userAgent || "");
  }
  function formatShortcut(shortcut, win = globalThis) {
    if (!shortcut) return "";
    return shortcut.replace("Mod", isApplePlatform(win) ? "Cmd" : "Ctrl");
  }
  var defaultButtons = [
    toggle("bold", "Bold", icons.bold, "Mod+B", "inline", (editor) => editor.toggleFormat("B", "bold", "removeBold")),
    toggle(
      "italic",
      "Italic",
      icons.italic,
      "Mod+I",
      "inline",
      (editor) => editor.toggleFormat("I", "italic", "removeItalic")
    ),
    toggle(
      "underline",
      "Underline",
      icons.underline,
      "Mod+U",
      "inline",
      (editor) => editor.toggleFormat("U", "underline", "removeUnderline")
    ),
    toggle(
      "strikethrough",
      "Strikethrough",
      icons.strike,
      "Mod+Shift+7",
      "inline",
      (editor) => editor.toggleFormat("S", "strikethrough", "removeStrikethrough")
    ),
    // No shortcut. One keystroke turning a paragraph of prose into a code block is
    // a sharp edge in an editor whose DOM is the saved file, and Mod+D also shadows
    // the browser's own bookmark shortcut. The toolbar button stays.
    toggle(
      "code",
      "Code",
      icons.code,
      null,
      "inline",
      (editor) => editor.toggleCode(),
      (editor) => editor.selectionHasFormat("CODE") || editor.selectionHasFormat("PRE")
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
      run: (editor) => editor.openLinkDialog(),
      isActive: (editor) => Boolean(editor.currentLinkElement())
    },
    {
      id: "unlink",
      label: "Remove link",
      ariaLabel: "Remove link",
      icon: icons.unlink,
      group: "links",
      run: (editor) => editor.squire.removeLink()
    },
    toggle(
      "unorderedList",
      "Bulleted list",
      icons.ul,
      "Mod+Shift+8",
      "lists",
      (editor) => editor.toggleList("UL"),
      (editor) => editor.pathHas("UL"),
      blocksOnly
    ),
    toggle(
      "orderedList",
      "Numbered list",
      icons.ol,
      "Mod+Shift+9",
      "lists",
      (editor) => editor.toggleList("OL"),
      (editor) => editor.pathHas("OL"),
      blocksOnly
    ),
    toggle("quote", "Quote", icons.quote, null, "blocks", (editor) => {
      if (editor.pathHas("BLOCKQUOTE")) return editor.squire.decreaseQuoteLevel();
      return editor.squire.increaseQuoteLevel();
    }, (editor) => editor.pathHas("BLOCKQUOTE"), blocksOnly),
    {
      id: "outdent",
      label: "Outdent",
      ariaLabel: "Decrease indent",
      icon: icons.outdent,
      group: "blocks",
      shortcut: "Mod+[",
      isDisabled: blocksOnly,
      run: (editor) => editor.outdent()
    },
    {
      id: "indent",
      label: "Indent",
      ariaLabel: "Increase indent",
      icon: icons.indent,
      group: "blocks",
      shortcut: "Mod+]",
      isDisabled: blocksOnly,
      run: (editor) => editor.indent()
    },
    {
      id: "undo",
      label: "Undo",
      ariaLabel: "Undo",
      icon: icons.undo,
      group: "history",
      shortcut: "Mod+Z",
      mutates: false,
      run: (editor) => editor.history("undo")
    },
    {
      id: "redo",
      label: "Redo",
      ariaLabel: "Redo",
      icon: icons.redo,
      group: "history",
      shortcut: "Mod+Shift+Z",
      mutates: false,
      run: (editor) => editor.history("redo")
    },
    {
      id: "clearFormatting",
      label: "Clear formatting",
      ariaLabel: "Clear formatting",
      icon: icons.clear,
      group: "cleanup",
      run: (editor) => editor.squire.removeAllFormatting()
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
          run: (editor) => editor.squire.increaseQuoteLevel(),
          isActive: (editor) => editor.pathHas("BLOCKQUOTE")
        },
        {
          label: "Code block",
          icon: icons.code,
          value: "PRE",
          isDisabled: blocksOnly,
          run: (editor) => editor.setBlockType("PRE"),
          isActive: (editor) => editor.pathHas("PRE")
        }
      ]
    }
  ];
  function toggle(id, label, icon, shortcut, group, run, isActive = (editor) => editor.selectionHasFormat(labelTag(id)), isDisabled) {
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
      run: (editor) => editor.setBlockType(tag),
      isActive: (editor) => editor.pathHas(tag)
    };
  }

  // src/normalize.js
  var INLINE_NODE_NAMES = /^(?:#text|A(?:BBR|CRONYM)?|B(?:R|D[IO])?|C(?:ITE|ODE)|D(?:ATA|EL|FN)|EM|FONT|HR|I(?:FRAME|MG|NPUT|NS)?|KBD|Q|R(?:P|T|UBY)|S(?:AMP|MALL|PAN|TR(?:IKE|ONG)|U[BP])?|TIME|U|VAR|WBR)$/;
  var NOT_WHITESPACE = /[^ \t\r\n]/;
  var ELEMENT_NODE = 1;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;
  var LEAF_NODE_NAMES = /* @__PURE__ */ new Set(["BR", "HR", "IFRAME", "IMG", "INPUT", "WBR"]);
  var isEditorUi = (node) => node?.nodeType === ELEMENT_NODE && node.matches('[editor-ui],[clay~="editor-ui"]');
  var FOREIGN_INLINE_ROOTS = /* @__PURE__ */ new Set(["svg", "math"]);
  function isInlineNode(node) {
    const type = node.nodeType;
    if (type === TEXT_NODE || type === COMMENT_NODE) return true;
    if (type !== ELEMENT_NODE) return false;
    if (FOREIGN_INLINE_ROOTS.has(node.nodeName)) return true;
    if (!INLINE_NODE_NAMES.test(node.nodeName)) return false;
    return Array.from(node.childNodes).every(isInlineNode);
  }
  function isBlockContainer(element) {
    return Array.from(element.childNodes).some((node) => !isInlineNode(node));
  }
  var isBlockElement = (node) => node?.nodeType === ELEMENT_NODE && !FOREIGN_INLINE_ROOTS.has(node.nodeName) && !INLINE_NODE_NAMES.test(node.nodeName);
  function flattenBlocks(parent, createBoundary) {
    const children = Array.from(parent.childNodes);
    let removed = 0;
    children.forEach((child, index) => {
      if (child.nodeType !== ELEMENT_NODE || FOREIGN_INLINE_ROOTS.has(child.nodeName)) return;
      removed += flattenBlocks(child, createBoundary);
      if (!isBlockElement(child)) return;
      if (isBlockElement(children[index - 1])) parent.insertBefore(createBoundary(), child);
      while (child.firstChild) parent.insertBefore(child.firstChild, child);
      child.remove();
      removed += 1;
    });
    return removed;
  }
  var TABLE_STRUCTURE = /* @__PURE__ */ new Set(["TABLE", "THEAD", "TBODY", "TFOOT", "TR", "COLGROUP"]);
  function ejectsBlocks(root) {
    return Boolean(root.closest?.("p")) || TABLE_STRUCTURE.has(root.nodeName);
  }
  var TEXT_LINE_ROOTS = /* @__PURE__ */ new Set([
    "P",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "PRE",
    "LABEL",
    "LEGEND",
    "LI",
    "TD",
    "TH",
    "DT",
    "DD",
    "FIGCAPTION",
    "SUMMARY",
    "CAPTION"
  ]);
  function keepsTextShape(root) {
    return TEXT_LINE_ROOTS.has(root.nodeName) || isInlineTag(root);
  }
  var VOID_ROOTS = /* @__PURE__ */ new Set([
    "AREA",
    "BASE",
    "BR",
    "COL",
    "EMBED",
    "HR",
    "IMG",
    "INPUT",
    "LINK",
    "META",
    "PARAM",
    "SOURCE",
    "TRACK",
    "WBR"
  ]);
  var RAW_TEXT_ROOTS = /* @__PURE__ */ new Set(["SCRIPT", "STYLE", "TEXTAREA", "TITLE", "IFRAME", "NOSCRIPT", "XMP"]);
  var HTML_NS = "http://www.w3.org/1999/xhtml";
  function isUnsupportedRootTag(root) {
    return TABLE_STRUCTURE.has(root.nodeName) || VOID_ROOTS.has(root.nodeName) || RAW_TEXT_ROOTS.has(root.nodeName) || root.nodeName === "TEMPLATE" || Boolean(root.namespaceURI) && root.namespaceURI !== HTML_NS;
  }
  function unsupportedRootReason(root) {
    if (TABLE_STRUCTURE.has(root.nodeName)) {
      return "a table element cannot be an editable region. Move the editable attribute to a <td>, a <th>, or an element inside one.";
    }
    if (root.namespaceURI && root.namespaceURI !== HTML_NS) {
      return "an SVG or MathML element cannot be an editable region: an edit puts an HTML block inside it, and the next page load moves that text out of the graphic entirely. Put a <foreignObject> in the SVG and mark an HTML element inside it instead.";
    }
    if (VOID_ROOTS.has(root.nodeName)) {
      return "this element cannot contain anything, so there is nothing to edit. Move the editable attribute to an element that holds text.";
    }
    if (root.nodeName === "TEMPLATE") {
      return "a <template> keeps its content out of the document, so edits to it are never saved.";
    }
    return "this element treats its content as plain text, so any edit would be saved as visible markup rather than formatting.";
  }
  function isInlineTag(node) {
    return node.nodeType === ELEMENT_NODE && !FOREIGN_INLINE_ROOTS.has(node.nodeName) && INLINE_NODE_NAMES.test(node.nodeName);
  }
  function hasBlockDescendant(root) {
    return Array.from(root.querySelectorAll("*")).some(isBlockElement);
  }
  function normalizeEditorRoot(root, options = {}) {
    const {
      blockTag = "DIV",
      wrapBareRoot = false,
      onBareRootWrapped,
      blocksAllowed = !ejectsBlocks(root)
    } = options;
    dropFormattingWhitespace(root);
    if (blocksAllowed) {
      wrapStrayInlineChildren(root, blockTag, wrapBareRoot, onBareRootWrapped);
    }
    return root;
  }
  var needsWrapping = (node) => isInlineNode(node) && node.nodeType !== COMMENT_NODE && !isEditorUi(node);
  var isAuthorContent = (node) => node.nodeType !== COMMENT_NODE && !isEditorUi(node) && !(node.nodeType === TEXT_NODE && !NOT_WHITESPACE.test(node.nodeValue));
  function editorRootNeedsNormalization(root, { wrapBareRoot = false, blocksAllowed = !ejectsBlocks(root) } = {}) {
    if (!blocksAllowed) return false;
    if (!isBlockContainer(root)) return wrapBareRoot;
    return Array.from(root.childNodes).some(needsWrapping) || hasNestedFormattingWhitespace(root);
  }
  function hasNestedFormattingWhitespace(element) {
    return Array.from(element.children).some((child) => {
      if (!isBlockContainer(child)) return false;
      const ownWhitespace = !preservesWhitespace(child) && Array.from(child.childNodes).some(
        (node) => node.nodeType === TEXT_NODE && !NOT_WHITESPACE.test(node.nodeValue)
      );
      return ownWhitespace || hasNestedFormattingWhitespace(child);
    });
  }
  function dropFormattingWhitespace(element) {
    if (!isBlockContainer(element)) return;
    if (!preservesWhitespace(element)) {
      Array.from(element.childNodes).forEach((child) => {
        if (child.nodeType === TEXT_NODE && !NOT_WHITESPACE.test(child.nodeValue)) child.remove();
      });
    }
    Array.from(element.children).forEach(dropFormattingWhitespace);
  }
  function wrapStrayInlineChildren(root, blockTag, wrapBareRoot, onBareRootWrapped) {
    if (!isBlockContainer(root)) {
      if (!wrapBareRoot) return;
      const wrapper = root.ownerDocument.createElement(blockTag);
      if (!Array.from(root.childNodes).some(isAuthorContent)) {
        wrapper.appendChild(root.ownerDocument.createElement("BR"));
        root.appendChild(wrapper);
        return;
      }
      while (root.firstChild) wrapper.appendChild(root.firstChild);
      root.appendChild(wrapper);
      onBareRootWrapped?.(root, wrapper);
      return;
    }
    let run = [];
    const flush = () => {
      const nodes = run;
      run = [];
      if (!nodes.some((node) => node.nodeType !== COMMENT_NODE)) return;
      const block = root.ownerDocument.createElement(blockTag);
      root.insertBefore(block, nodes[0]);
      nodes.forEach((node) => block.appendChild(node));
    };
    Array.from(root.childNodes).forEach((child) => {
      if (isEditorUi(child)) flush();
      else if (isInlineNode(child)) run.push(child);
      else flush();
    });
    flush();
  }
  function preservesWhitespace(element) {
    return element.nodeName === "PRE";
  }
  function captureRange(root, range) {
    return {
      start: captureBoundary(root, range.startContainer, range.startOffset),
      end: captureBoundary(root, range.endContainer, range.endOffset),
      collapsed: range.collapsed
    };
  }
  function restoreRange(root, range, saved) {
    applyBoundary(range, "setStart", root, saved.start);
    if (saved.collapsed) range.collapse(true);
    else applyBoundary(range, "setEnd", root, saved.end);
  }
  function captureBoundary(root, container, offset) {
    if (!root.contains(container)) return { scope: root, after: [], before: [] };
    if (container.nodeType === TEXT_NODE) {
      if (!isDroppedWhitespace(container)) return { container, offset };
      const scope = container.parentNode;
      return siblingAnchor(scope, Array.from(scope.childNodes).indexOf(container));
    }
    return {
      container,
      offset,
      childCount: container.childNodes.length,
      ...siblingAnchor(container, offset)
    };
  }
  function siblingAnchor(scope, index) {
    const children = Array.from(scope.childNodes);
    const at = Math.max(0, index);
    return { scope, after: children.slice(at), before: children.slice(0, at).reverse() };
  }
  function applyBoundary(range, method, root, boundary) {
    const { container, childCount } = boundary;
    if (container && root.contains(container)) {
      if (childCount === void 0 || childCount === container.childNodes.length) {
        range[method](container, Math.min(boundary.offset, nodeLength(container)));
        return;
      }
    }
    const after = boundary.after?.find((node) => root.contains(node));
    if (after) {
      range[method](caretEdge(after, true), 0);
      return;
    }
    const before = boundary.before?.find((node) => root.contains(node));
    if (before) {
      const edge = caretEdge(before, false);
      range[method](edge, nodeLength(edge));
      return;
    }
    const scope = boundary.scope && root.contains(boundary.scope) ? boundary.scope : root;
    range[method](scope, 0);
  }
  function isDroppedWhitespace(node) {
    return node.nodeType === TEXT_NODE && !NOT_WHITESPACE.test(node.nodeValue) && Boolean(node.parentNode) && node.parentNode.nodeType === ELEMENT_NODE && isBlockContainer(node.parentNode) && !preservesWhitespace(node.parentNode);
  }
  var isCaretHost = (node) => node.nodeType === ELEMENT_NODE || node.nodeType === TEXT_NODE;
  function caretEdge(node, first = true) {
    let current = node;
    while (current.nodeType === ELEMENT_NODE && !FOREIGN_INLINE_ROOTS.has(current.nodeName)) {
      const children = Array.from(current.childNodes).filter(isCaretHost);
      const next = first ? children[0] : children[children.length - 1];
      if (!next || LEAF_NODE_NAMES.has(next.nodeName)) break;
      current = next;
    }
    return current;
  }
  function nodeLength(node) {
    return node.nodeType === TEXT_NODE ? node.nodeValue.length : node.childNodes.length;
  }

  // src/hyperclay.js
  var RICHCLAY_SELECTOR = "[data-richclay], [richclay], [editable], [clay-editable]";
  var RICHCLAY_OPT_IN = "[data-richclay], [richclay], [clay-editable]";
  var EDITABLE_ATTRS = ["editable", "clay-editable"];
  var singleLineSelector = ':is([editable~="single-line"], [clay-editable~="single-line"])';
  function isRichClayHost(el) {
    if (!el || typeof el.matches !== "function") return false;
    if (!el.tagName.includes("-")) return true;
    return el.matches(RICHCLAY_OPT_IN);
  }
  var CHROME_SELECTOR = "[data-richclay-toolbar], [data-richclay-menu], [data-richclay-dialog], [data-richclay-link-popover], [data-richclay-live], [data-richclay-float]";
  var runtimeClasses = [
    "richclay-editor",
    "richclay-inline",
    "richclay-active",
    "richclay-empty",
    "richclay-focused"
  ];
  var installedWindows = /* @__PURE__ */ new WeakSet();
  var armedWindows = /* @__PURE__ */ new WeakSet();
  var PLATFORM_READY = ["clay:ready", "hyperclay:ready"];
  function platformReadyPromise(win) {
    return [win.clay?.ready, win.hyperclay?.ready].find(
      (ready) => ready && typeof ready.then === "function"
    ) || null;
  }
  function platformEditMode(win) {
    if (typeof win.clay?.isEditMode === "boolean") return win.clay.isEditMode;
    if (typeof win.hyperclay?.isEditMode === "boolean") return win.hyperclay.isEditMode;
    return null;
  }
  function hasPlatformLifecycle(win) {
    const modules = win.hyperclayModules;
    const legacyHyperclayLoader = win.__hyperclayNoAutoExport === false && modules && typeof modules === "object" && typeof modules.nodeType !== "number";
    return platformEditMode(win) !== null || Boolean(platformReadyPromise(win)) || Boolean(legacyHyperclayLoader);
  }
  function platformDocumentTransform(win) {
    return win.clay?.addDocumentTransform || win.hyperclay?.beforeSave || null;
  }
  function platformSnapshotTransform(win) {
    return win.clay?.onSnapshot || win.hyperclay?.onSnapshot || null;
  }
  var PRE_CONTAINMENT = {
    boxSizing: "border-box",
    minWidth: "100%",
    overflow: "auto",
    width: "0"
  };
  function shouldUseHyperclay(options = {}, win = window) {
    if (options.hyperclay === false) return false;
    if (options.hyperclay === true) return true;
    return Boolean(hasPlatformLifecycle(win) || hasEditmodeSignal(win));
  }
  function isHyperclayEditMode(win = window) {
    const fromQuery = readEditmodeParam(win);
    if (fromQuery !== null) return fromQuery;
    if (typeof win.__hyperclayEditMode === "boolean") {
      return win.__hyperclayEditMode;
    }
    const fromPlatform = platformEditMode(win);
    if (fromPlatform !== null) return fromPlatform;
    return readEditmodeCookie(win);
  }
  function shouldActivateEditor(options = {}, win = window) {
    if (options.readOnly) return false;
    if (!shouldUseHyperclay(options, win)) return true;
    return isHyperclayEditMode(win);
  }
  function parseEditableOptions(element) {
    const name = EDITABLE_ATTRS.find((attr) => element.hasAttribute(attr));
    if (!name) return null;
    const tokens = new Set(
      (element.getAttribute(name) || "").trim().split(/\s+/).filter(Boolean)
    );
    const options = {
      inline: true,
      singleLine: tokens.has("single-line"),
      toolbarOnSelect: tokens.has("toolbar-on-select")
    };
    if (tokens.has("no-toolbar")) options.toolbar = false;
    if (tokens.has("link-label")) {
      options.singleLine = true;
      options.linkLabel = true;
      options.toolbar = ["link", "undo", "redo"];
    }
    return options;
  }
  function installHyperclayBridge(win = window) {
    if (installedWindows.has(win)) return;
    const register = platformSnapshotTransform(win) || platformDocumentTransform(win);
    if (typeof register !== "function") {
      armBridgeRetry(win);
      return;
    }
    register((docElem) => stripRichClayFromClone(docElem));
    installedWindows.add(win);
  }
  function armBridgeRetry(win) {
    if (armedWindows.has(win)) return;
    const doc = win.document;
    const ready = platformReadyPromise(win);
    if (!doc && !ready) return;
    armedWindows.add(win);
    const retry = () => {
      installHyperclayBridge(win);
      if (installedWindows.has(win)) disarm();
    };
    const disarm = () => {
      if (!doc) return;
      PLATFORM_READY.forEach((name) => doc.removeEventListener(name, retry));
    };
    if (doc) PLATFORM_READY.forEach((name) => doc.addEventListener(name, retry));
    if (ready) ready.then(retry, () => {
    });
  }
  function stripRichClayFromClone(docElem) {
    docElem.querySelectorAll?.(CHROME_SELECTOR).forEach((node) => node.remove());
    docElem.querySelectorAll?.(RICHCLAY_SELECTOR).forEach((region) => {
      if (region.getAttribute("data-richclay-active") !== "true") return;
      removeRuntimeState(region, "save");
      if (needsFlattening(region)) {
        const doc = region.ownerDocument;
        const singleLine = Boolean(region.matches?.(singleLineSelector));
        flattenBlocks(
          region,
          () => singleLine ? doc.createTextNode(" ") : doc.createElement("br")
        );
        region.querySelectorAll(region.localName).forEach((nested) => {
          while (nested.firstChild) nested.parentNode.insertBefore(nested.firstChild, nested);
          nested.remove();
        });
      }
      if (region.matches?.(singleLineSelector)) unwrapLoneSingleLineBlock(region);
      region.querySelectorAll("#squire-selection-start, #squire-selection-end").forEach((node) => {
        node.remove();
      });
      region.querySelectorAll(".squire-image-resize-container").forEach((node) => node.remove());
      stripZeroWidthArtifacts(region);
      const codeBlocks = (region.matches?.("pre") ? [region, ...region.querySelectorAll("pre")] : Array.from(region.querySelectorAll("pre"))).filter((pre) => pre.hasAttribute("data-richclay-pre"));
      codeBlocks.forEach((pre) => {
        Object.entries(PRE_CONTAINMENT).forEach(([property, value]) => {
          if (!pre.style[property]) pre.style[property] = value;
        });
        pre.removeAttribute("data-richclay-pre");
      });
    });
    docElem.querySelectorAll?.("#squire-selection-start, #squire-selection-end").forEach((node) => node.remove());
  }
  var BLOCK_SCOPE = "p, td, th, li, dl, dt, dd, table, blockquote, div, section, article, aside, main, header, footer, figure, figcaption";
  var MEASURE_ATTR = "data-richclay-measure";
  function ejectsOnReload(region) {
    const doc = region.ownerDocument;
    const scope = region.closest(BLOCK_SCOPE) || region;
    region.setAttribute(MEASURE_ATTR, "");
    const probe = doc.createElement("div");
    try {
      probe.innerHTML = scope.outerHTML;
    } finally {
      region.removeAttribute(MEASURE_ATTR);
    }
    const reparsed = probe.querySelector(`[${MEASURE_ATTR}]`);
    return !reparsed || reparsed.textContent !== region.textContent;
  }
  var selfNests = (region) => Boolean(region.querySelector(region.localName));
  var needsFlattening = (region) => Boolean(region.matches?.(singleLineSelector)) || (hasBlockDescendant(region) || selfNests(region)) && ejectsOnReload(region);
  function removeRuntimeState(region, mode) {
    const origin = region.getAttribute("data-richclay-runtime-contenteditable");
    if (region.hasAttribute("contenteditable")) {
      if (origin === "true") {
        region.removeAttribute("contenteditable");
      } else if (origin) {
        if (mode === "destroy") {
          region.setAttribute("contenteditable", origin);
        } else {
          region.setAttribute("inert-contenteditable", origin);
          region.removeAttribute("contenteditable");
        }
      } else if (mode === "save") {
        region.setAttribute("inert-contenteditable", region.getAttribute("contenteditable"));
        region.removeAttribute("contenteditable");
      }
    }
    runtimeClasses.forEach((className) => region.classList.remove(className));
    if (region.getAttribute("class") === "") region.removeAttribute("class");
    removeRuntimeAttribute(region, "role", "data-richclay-runtime-role");
    removeRuntimeAttribute(region, "aria-multiline", "data-richclay-runtime-aria-multiline");
    removeRuntimeAttribute(region, "no-undo", "data-richclay-runtime-no-undo");
    if (region.getAttribute("data-richclay-runtime-display") === "true") {
      region.style.removeProperty("display");
      if (region.getAttribute("style") === "") region.removeAttribute("style");
    }
    removeRuntimeDescribedBy(region);
    region.removeAttribute("data-richclay-active");
    region.removeAttribute("data-richclay-placeholder");
    region.removeAttribute("data-richclay-pre");
    region.removeAttribute("data-richclay-runtime-role");
    region.removeAttribute("data-richclay-runtime-aria-multiline");
    region.removeAttribute("data-richclay-runtime-no-undo");
    region.removeAttribute("data-richclay-runtime-describedby");
    region.removeAttribute("data-richclay-runtime-contenteditable");
    region.removeAttribute("data-richclay-runtime-display");
    if (region.getAttribute("data-richclay-runtime-marker") === "true") {
      region.removeAttribute("data-richclay");
    }
    region.removeAttribute("data-richclay-runtime-marker");
  }
  function stripZeroWidthArtifacts(region) {
    const zwsp = String.fromCharCode(8203);
    const stack = [region];
    while (stack.length) {
      const node = stack.pop();
      node.childNodes.forEach((child) => {
        if (child.nodeType === 3) {
          if (child.nodeValue.includes(zwsp)) {
            child.nodeValue = child.nodeValue.split(zwsp).join("");
          }
        } else if (child.nodeType === 1) {
          stack.push(child);
        }
      });
    }
    region.querySelectorAll("b, i, u, s, em, strong, code, sub, sup, span").forEach((el) => {
      if (el.children.length === 0 && (el.textContent || "") === "" && el.attributes.length === 0) {
        el.remove();
      }
    });
  }
  function unwrapLoneSingleLineBlock(region) {
    const meaningful = Array.from(region.childNodes).filter(
      (node) => node.nodeType !== 3 || (node.nodeValue || "").trim() !== ""
    );
    if (meaningful.length !== 1) return;
    const block = meaningful[0];
    if (block.nodeType !== 1 || block.nodeName !== "P" || block.attributes.length > 0) return;
    while (block.firstChild) region.insertBefore(block.firstChild, block);
    block.remove();
  }
  function consumeInertContenteditable(element) {
    if (!element.hasAttribute("inert-contenteditable")) return null;
    let value = element.getAttribute("inert-contenteditable");
    if (!["false", "plaintext-only"].includes(value)) value = "true";
    element.setAttribute("contenteditable", value);
    element.removeAttribute("inert-contenteditable");
    if (value === "true") {
      element.setAttribute("data-richclay-runtime-contenteditable", "true");
    }
    return value;
  }
  function markChrome(element) {
    element.setAttribute("snapshot-remove", "");
    element.setAttribute("no-watch", "");
    return element;
  }
  function readEditmodeParam(win) {
    try {
      const params = new URLSearchParams(win.location?.search || "");
      if (params.get("editmode") === "true") return true;
      if (params.get("editmode") === "false") return false;
    } catch {
      return null;
    }
    return null;
  }
  function hasEditmodeSignal(win) {
    return readEditmodeParam(win) !== null || typeof win.__hyperclayEditMode === "boolean";
  }
  function readEditmodeCookie(win) {
    const cookie = win.document?.cookie || "";
    const match = cookie.match(/(?:^|;\s*)isAdminOfCurrentResource=([^;]*)/);
    return Boolean(match && match[1] !== "");
  }
  function removeRuntimeAttribute(region, attribute, marker) {
    if (!region.hasAttribute(marker)) return;
    region.removeAttribute(attribute);
  }
  function removeRuntimeDescribedBy(region) {
    const id = region.getAttribute("data-richclay-runtime-describedby");
    if (!id) return;
    const ids = (region.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean).filter((value) => value !== id);
    if (ids.length) {
      region.setAttribute("aria-describedby", ids.join(" "));
    } else {
      region.removeAttribute("aria-describedby");
    }
  }

  // src/a11y.js
  var liveId = 0;
  function createLiveRegion(doc = document) {
    const region = doc.createElement("div");
    region.id = `richclay-live-${++liveId}`;
    region.className = "richclay-sr-only";
    region.setAttribute("aria-live", "polite");
    region.setAttribute("aria-atomic", "true");
    region.setAttribute("data-richclay-live", "");
    markChrome(region);
    doc.body.appendChild(region);
    return region;
  }
  function announce(region, message) {
    if (!region || !message) return;
    region.textContent = "";
    region.ownerDocument.defaultView.setTimeout(() => {
      region.textContent = message;
    }, 20);
  }
  function preservePointerSelection(event) {
    event.preventDefault();
  }
  function cloneRange(range) {
    try {
      return range?.cloneRange?.() || null;
    } catch {
      return null;
    }
  }
  function getSquireSelection(squire) {
    try {
      return cloneRange(squire?.getSelection?.());
    } catch {
      return null;
    }
  }
  function restoreSquireSelection(squire, range) {
    if (!squire || !range) return false;
    try {
      squire.setSelection(range);
      return true;
    } catch {
      return false;
    }
  }
  function setRuntimeAttribute(element, attribute, value, marker) {
    if (!element.hasAttribute(attribute)) {
      element.setAttribute(marker, "true");
    }
    element.setAttribute(attribute, value);
  }
  function connectDescription(element, description) {
    const ids = new Set((element.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
    ids.add(description.id);
    element.setAttribute("aria-describedby", Array.from(ids).join(" "));
    element.setAttribute("data-richclay-runtime-describedby", description.id);
  }

  // src/toolbar.js
  var toolbarId = 0;
  var Toolbar = class {
    constructor(editor, controls, options = {}) {
      this.editor = editor;
      this.controls = controls;
      this.options = options;
      this.id = ++toolbarId;
      this.items = [];
      this.menus = /* @__PURE__ */ new Map();
      this.activeIndex = 0;
      this.root = this.createRoot();
      this.onRootKeydown = (event) => this.handleRootKeydown(event);
      this.onRootClick = (event) => this.handleRootClick(event);
      this.onRootPointerDown = (event) => this.handleRootPointerDown(event);
      this.onDocumentPointerDown = (event) => this.handleDocumentPointerDown(event);
      this.render();
      this.root.addEventListener("keydown", this.onRootKeydown);
      this.root.addEventListener("click", this.onRootClick);
      this.root.addEventListener("mousedown", this.onRootPointerDown);
      this.root.ownerDocument.addEventListener("mousedown", this.onDocumentPointerDown);
    }
    destroy() {
      this.closeMenus();
      this.root.removeEventListener("keydown", this.onRootKeydown);
      this.root.removeEventListener("click", this.onRootClick);
      this.root.removeEventListener("mousedown", this.onRootPointerDown);
      this.root.ownerDocument.removeEventListener("mousedown", this.onDocumentPointerDown);
      this.root.remove();
    }
    update() {
      this.items.forEach((item) => {
        const { def, button } = item;
        if (typeof def.isActive === "function") {
          const active = Boolean(def.isActive(this.editor));
          button.setAttribute("aria-pressed", active ? "true" : "false");
          button.classList.toggle("is-active", active);
        }
        if (typeof def.isDisabled === "function") {
          button.disabled = Boolean(def.isDisabled(this.editor));
        }
      });
      this.ensureSingleTabStop();
    }
    focusFirst() {
      this.activeIndex = 0;
      this.ensureSingleTabStop();
      this.items[0]?.button.focus();
    }
    createRoot() {
      const doc = this.editor.element.ownerDocument;
      const root = doc.createElement("div");
      root.className = "richclay-toolbar";
      root.setAttribute("role", "toolbar");
      root.setAttribute("aria-label", this.options.ariaLabel || "Rich text formatting");
      root.setAttribute("data-richclay-toolbar", "");
      markChrome(root);
      const container = resolveContainer(this.options.toolbarContainer, doc);
      if (container) {
        container.appendChild(root);
      } else {
        this.editor.element.insertAdjacentElement("beforebegin", root);
      }
      return root;
    }
    render() {
      this.root.textContent = "";
      this.items = [];
      this.menus.clear();
      let lastGroup = null;
      this.visibleControls().forEach((def, index) => {
        if (def.type === "separator") {
          this.root.appendChild(createSeparator(this.root.ownerDocument));
          lastGroup = null;
          return;
        }
        if (lastGroup && def.group && def.group !== lastGroup) {
          this.root.appendChild(createSeparator(this.root.ownerDocument));
        }
        lastGroup = def.group || lastGroup;
        if (def.type === "menu") {
          this.renderMenu(def, index);
        } else {
          this.renderButton(def, index);
        }
      });
      this.ensureSingleTabStop();
      this.update();
    }
    // A control disabled by the root is disabled for this editor's whole life, not
    // for this selection, so it is left out of the toolbar rather than rendered
    // greyed: a greyed button says "not right now" and invites clicking, an absent
    // one just gives a simpler toolbar. It stays disabled at dispatch as well,
    // because hiding a button stops neither its shortcut nor its menu item.
    visibleControls() {
      const kept = this.controls.filter(
        (def) => def.type === "separator" || !def.isDisabled?.(this.editor)
      );
      const trimmed = [];
      kept.forEach((def) => {
        const previous = trimmed[trimmed.length - 1];
        if (def.type === "separator" && (!previous || previous.type === "separator")) return;
        trimmed.push(def);
      });
      while (trimmed[trimmed.length - 1]?.type === "separator") trimmed.pop();
      return trimmed;
    }
    renderButton(def, index) {
      const button = createToolbarButton(this.root.ownerDocument, def);
      button.dataset.richclayControl = def.id;
      button.dataset.richclayIndex = String(index);
      if (typeof def.isActive === "function") {
        button.setAttribute("aria-pressed", "false");
      }
      this.root.appendChild(button);
      this.items.push({ def, button, type: "button" });
    }
    renderMenu(def, index) {
      const doc = this.root.ownerDocument;
      const button = createToolbarButton(doc, def);
      const menuId = `richclay-menu-${this.id}-${def.id}`;
      button.dataset.richclayControl = def.id;
      button.dataset.richclayIndex = String(index);
      button.setAttribute("aria-haspopup", "menu");
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", menuId);
      const menu = doc.createElement("div");
      menu.id = menuId;
      menu.className = "richclay-menu";
      menu.hidden = true;
      menu.setAttribute("role", "menu");
      menu.setAttribute("data-richclay-menu", "");
      markChrome(menu);
      def.options.forEach((option, optionIndex) => {
        const item = doc.createElement("button");
        item.type = "button";
        item.className = "richclay-menu-item";
        item.setAttribute("role", "menuitemradio");
        item.setAttribute("tabindex", "-1");
        item.dataset.richclayMenuItem = def.id;
        item.dataset.richclayOptionIndex = String(optionIndex);
        item.innerHTML = option.icon || "";
        item.appendChild(doc.createTextNode(option.label));
        item.addEventListener("mousedown", preservePointerSelection);
        item.addEventListener("click", (event) => {
          event.preventDefault();
          this.chooseMenuItem(def, option, button);
        });
        item.addEventListener("keydown", (event) => this.handleMenuKeydown(event, def, button));
        menu.appendChild(item);
      });
      const wrap = doc.createElement("span");
      wrap.className = "richclay-menu-wrap";
      wrap.append(button, menu);
      this.root.appendChild(wrap);
      this.items.push({ def, button, type: "menu", menu });
      this.menus.set(def.id, { def, button, menu });
    }
    handleRootPointerDown(event) {
      const control = event.target.closest?.("[data-richclay-control]");
      if (!control || !this.root.contains(control)) return;
      preservePointerSelection(event);
      this.editor.saveSelection();
    }
    handleRootClick(event) {
      const button = event.target.closest?.("[data-richclay-control]");
      if (!button || !this.root.contains(button)) return;
      event.preventDefault();
      const item = this.items.find((candidate) => candidate.button === button);
      if (!item || button.disabled) return;
      this.activeIndex = this.items.indexOf(item);
      this.ensureSingleTabStop();
      if (item.type === "menu") {
        this.toggleMenu(item.def.id);
        return;
      }
      this.closeMenus();
      this.editor.runControl(item.def);
    }
    handleRootKeydown(event) {
      const key = event.key;
      const navigation = {
        ArrowRight: 1,
        ArrowDown: 1,
        ArrowLeft: -1,
        ArrowUp: -1
      };
      if (key in navigation) {
        event.preventDefault();
        this.moveFocus(navigation[key]);
        return;
      }
      if (key === "Home") {
        event.preventDefault();
        this.setFocusIndex(0);
        return;
      }
      if (key === "End") {
        event.preventDefault();
        this.setFocusIndex(this.items.length - 1);
        return;
      }
      const current = this.items[this.activeIndex];
      if (!current) return;
      if ((key === "Enter" || key === " ") && current.type === "menu") {
        event.preventDefault();
        this.openMenu(current.def.id, "first");
      }
      if (key === "Escape") {
        const hadOpenMenu = Array.from(this.menus.values()).some((entry) => !entry.menu.hidden);
        this.closeMenus();
        if (hadOpenMenu) current.button.focus();
        else this.editor.focus();
      }
    }
    handleMenuKeydown(event, def, trigger) {
      event.stopPropagation();
      const menu = this.menus.get(def.id)?.menu;
      const items = Array.from(menu.querySelectorAll(".richclay-menu-item"));
      const index = items.indexOf(event.currentTarget);
      let next = index;
      if (event.key === "ArrowDown") next = (index + 1) % items.length;
      if (event.key === "ArrowUp") next = (index - 1 + items.length) % items.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = items.length - 1;
      if (next !== index) {
        event.preventDefault();
        items[next].focus();
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        this.closeMenus();
        trigger.focus();
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const option = def.options[index];
        this.chooseMenuItem(def, option, trigger);
      }
    }
    handleDocumentPointerDown(event) {
      if (this.root.contains(event.target)) return;
      this.closeMenus();
    }
    chooseMenuItem(def, option, trigger) {
      this.closeMenus();
      this.editor.runControl({
        ...option,
        id: `${def.id}:${option.value}`,
        ariaLabel: option.label
      });
      trigger.focus();
    }
    toggleMenu(id) {
      const menu = this.menus.get(id);
      if (!menu) return;
      if (menu.menu.hidden) this.openMenu(id, "first");
      else this.closeMenus();
    }
    openMenu(id, focus = "first") {
      this.closeMenus(id);
      const entry = this.menus.get(id);
      if (!entry) return;
      entry.menu.hidden = false;
      entry.button.setAttribute("aria-expanded", "true");
      this.updateMenuState(entry);
      const items = Array.from(entry.menu.querySelectorAll(".richclay-menu-item"));
      const active = items.find((item) => item.getAttribute("aria-checked") === "true");
      const target = focus === "active" ? active || items[0] : items[0];
      target?.focus();
    }
    closeMenus(exceptId = null) {
      this.menus.forEach((entry, id) => {
        if (id === exceptId) return;
        entry.menu.hidden = true;
        entry.button.setAttribute("aria-expanded", "false");
      });
    }
    updateMenuState(entry) {
      const items = Array.from(entry.menu.querySelectorAll(".richclay-menu-item"));
      items.forEach((item, index) => {
        const option = entry.def.options[index];
        const active = Boolean(option.isActive?.(this.editor));
        item.setAttribute("aria-checked", active ? "true" : "false");
        item.classList.toggle("is-active", active);
      });
    }
    moveFocus(delta) {
      if (!this.items.length) return;
      let next = this.activeIndex;
      do {
        next = (next + delta + this.items.length) % this.items.length;
      } while (this.items[next].button.disabled && next !== this.activeIndex);
      this.setFocusIndex(next);
    }
    setFocusIndex(index) {
      this.activeIndex = Math.max(0, Math.min(index, this.items.length - 1));
      this.ensureSingleTabStop();
      this.items[this.activeIndex]?.button.focus();
    }
    ensureSingleTabStop() {
      const enabled = this.items.filter((item) => !item.button.disabled);
      if (!enabled.length) return;
      if (!enabled.includes(this.items[this.activeIndex])) {
        this.activeIndex = this.items.indexOf(enabled[0]);
      }
      this.items.forEach((item, index) => {
        item.button.tabIndex = index === this.activeIndex ? 0 : -1;
      });
    }
  };
  function createToolbarButton(doc, def) {
    const button = doc.createElement("button");
    button.type = "button";
    button.className = "richclay-button";
    const shortcut = formatShortcut(def.shortcut, doc.defaultView);
    const label = shortcut ? `${def.ariaLabel || def.label} (${shortcut})` : def.ariaLabel || def.label;
    button.setAttribute("aria-label", label);
    button.title = label;
    button.innerHTML = `${def.icon || ""}<span class="richclay-sr-only">${def.label}</span>`;
    return button;
  }
  function createSeparator(doc) {
    const separator = doc.createElement("span");
    separator.className = "richclay-separator";
    separator.setAttribute("role", "separator");
    separator.setAttribute("aria-orientation", "vertical");
    return separator;
  }
  function resolveContainer(container, doc) {
    if (!container) return null;
    if (typeof container === "string") return doc.querySelector(container);
    return container;
  }

  // src/toolbar-float.js
  var GAP = 16;
  var GAP_LADDER = [16, 8, 0];
  var VIEWPORT_INSET = 8;
  var PLACEMENT_SLACK = 4;
  function placeToolbar({ anchor, bar, rail, viewport, current = null }) {
    const slack = (mode) => current === mode ? PLACEMENT_SLACK : 0;
    if (anchor.bottom <= 0 || anchor.top >= viewport.height || anchor.right <= 0 || anchor.left >= viewport.width) {
      return { mode: "hidden", x: 0, y: 0 };
    }
    const clampX = (width) => Math.max(VIEWPORT_INSET, Math.min(anchor.left, viewport.width - width - VIEWPORT_INSET));
    const aboveY = anchor.top - GAP - bar.height;
    if (aboveY >= VIEWPORT_INSET - slack("above")) {
      return { mode: "above", x: clampX(bar.width), y: aboveY };
    }
    const belowY = anchor.bottom + GAP;
    if (belowY + bar.height <= viewport.height - VIEWPORT_INSET + slack("below")) {
      return { mode: "below", x: clampX(bar.width), y: belowY };
    }
    const rightSpace = viewport.width - anchor.right - VIEWPORT_INSET;
    const leftSpace = anchor.left - VIEWPORT_INSET;
    const sides = rightSpace >= leftSpace ? [["rail-right", rightSpace], ["rail-left", leftSpace]] : [["rail-left", leftSpace], ["rail-right", rightSpace]];
    for (const [mode, space] of sides) {
      for (const gap of GAP_LADDER) {
        if (rail.width + gap > space + slack(mode)) continue;
        const x = mode === "rail-right" ? Math.min(anchor.right + gap, viewport.width - rail.width - VIEWPORT_INSET) : Math.max(anchor.left - gap - rail.width, VIEWPORT_INSET);
        const maxY = Math.min(anchor.bottom, viewport.height - VIEWPORT_INSET) - rail.height;
        const y = Math.max(VIEWPORT_INSET, Math.min(Math.max(anchor.top, VIEWPORT_INSET), maxY));
        return { mode, x, y, gap };
      }
    }
    return { mode: "pinned", x: clampX(bar.width), y: VIEWPORT_INSET };
  }
  var POPOVER_GAP = 10;
  var POPOVER_ARROW_INSET = 28;
  function placePopover({ anchor, box, viewport, gap = POPOVER_GAP }) {
    const spaceBelow = viewport.height - VIEWPORT_INSET - anchor.bottom - gap;
    const spaceAbove = anchor.top - gap - VIEWPORT_INSET;
    const side = spaceBelow >= box.height || spaceBelow >= spaceAbove ? "below" : "above";
    const rawY = side === "below" ? anchor.bottom + gap : anchor.top - gap - box.height;
    const y = Math.max(VIEWPORT_INSET, Math.min(rawY, viewport.height - VIEWPORT_INSET - box.height));
    const center = (anchor.left + anchor.right) / 2;
    const x = Math.max(VIEWPORT_INSET, Math.min(center - POPOVER_ARROW_INSET, viewport.width - VIEWPORT_INSET - box.width));
    const arrow = Math.max(14, Math.min(center - x, box.width - 14));
    return { side, x, y, arrow };
  }
  function pin(el, prop, value) {
    el.style.setProperty(prop, value, "important");
  }
  var FloatingToolbar = class {
    constructor(editor, controls) {
      this.editor = editor;
      this.mode = null;
      this.hidden = false;
      this.frame = 0;
      this.bar = { width: 0, height: 0 };
      this.rail = { width: 0, height: 0 };
      const doc = editor.element.ownerDocument;
      this.doc = doc;
      this.win = doc.defaultView || globalThis;
      this.root = doc.createElement("div");
      this.root.className = "richclay-float";
      this.root.setAttribute("data-richclay-float", "");
      this.root.setAttribute("save-remove", "");
      markChrome(this.root);
      doc.body.appendChild(this.root);
      this.toolbar = new Toolbar(editor, controls, { toolbarContainer: this.root });
      this.onScroll = () => this.schedule();
      this.onResize = () => {
        this.measure();
        this.schedule();
      };
      doc.addEventListener("scroll", this.onScroll, { capture: true, passive: true });
      this.win.addEventListener("resize", this.onResize, { passive: true });
      this.win.visualViewport?.addEventListener("resize", this.onResize, { passive: true });
      this.win.visualViewport?.addEventListener("scroll", this.onScroll, { passive: true });
      this.resizeObserver = typeof this.win.ResizeObserver === "function" ? new this.win.ResizeObserver(() => this.schedule()) : null;
      this.resizeObserver?.observe(editor.element);
      this.measure();
      this.reposition();
    }
    // Measure both orientations up front so the placement math can evaluate the
    // rail without first switching to it.
    measure() {
      const wasRail = this.root.classList.contains("richclay-float-rail");
      pin(this.root, "visibility", "hidden");
      this.root.classList.remove("richclay-float-rail");
      this.bar = { width: this.root.offsetWidth || 0, height: this.root.offsetHeight || 0 };
      this.root.classList.add("richclay-float-rail");
      this.rail = { width: this.root.offsetWidth || 0, height: this.root.offsetHeight || 0 };
      this.root.classList.toggle("richclay-float-rail", wasRail);
      this.root.style.removeProperty("visibility");
    }
    schedule() {
      if (!this.win.requestAnimationFrame) {
        this.reposition();
        return;
      }
      if (this.frame) return;
      this.frame = this.win.requestAnimationFrame(() => {
        this.frame = 0;
        this.reposition();
      });
    }
    setVisible(visible) {
      this.hidden = !visible;
      this.reposition();
    }
    reposition() {
      if (this.hidden) {
        pin(this.root, "display", "none");
        return;
      }
      const anchor = this.editor.element.getBoundingClientRect();
      const viewport = {
        width: this.win.visualViewport?.width ?? this.win.innerWidth,
        height: this.win.visualViewport?.height ?? this.win.innerHeight
      };
      const placement = placeToolbar({
        anchor,
        bar: this.bar,
        rail: this.rail,
        viewport,
        current: this.mode
      });
      this.mode = placement.mode;
      if (placement.mode === "hidden") {
        pin(this.root, "display", "none");
        return;
      }
      this.root.style.removeProperty("display");
      this.root.classList.toggle(
        "richclay-float-rail",
        placement.mode === "rail-left" || placement.mode === "rail-right"
      );
      this.root.classList.toggle("richclay-float-pinned", placement.mode === "pinned");
      pin(this.root, "transform", `translate(${Math.round(placement.x)}px, ${Math.round(placement.y)}px)`);
    }
    destroy() {
      if (this.frame) this.win.cancelAnimationFrame?.(this.frame);
      this.frame = 0;
      this.doc.removeEventListener("scroll", this.onScroll, { capture: true });
      this.win.removeEventListener("resize", this.onResize);
      this.win.visualViewport?.removeEventListener("resize", this.onResize);
      this.win.visualViewport?.removeEventListener("scroll", this.onScroll);
      this.resizeObserver?.disconnect();
      this.toolbar.destroy();
      this.root.remove();
    }
  };

  // src/sanitize.js
  var DEFAULT_SANITIZE_CONFIG = {
    ALLOWED_TAGS: [
      "a",
      "b",
      "blockquote",
      "br",
      "code",
      "div",
      "em",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "i",
      "li",
      "ol",
      "p",
      "pre",
      "s",
      "span",
      "strong",
      "sub",
      "sup",
      "u",
      "ul"
    ],
    ALLOWED_ATTR: ["aria-label", "href", "rel", "target", "title"],
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: true,
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input"],
    FORBID_ATTR: ["style", "srcset", "onerror", "onclick", "onload"]
  };
  function createSanitizer(config = {}, doc = document) {
    const purify = resolveDOMPurify(doc);
    return {
      sanitizeHTML(html) {
        return sanitizeHTML(html, config, doc, purify);
      },
      sanitizeElement(element) {
        return sanitizeElement(element, config, purify);
      },
      sanitizeToDOMFragment(html, editor) {
        const ownerDocument = editor?.getRoot?.().ownerDocument || doc;
        return sanitizeToDOMFragment(html, config, ownerDocument, purify);
      }
    };
  }
  function sanitizeHTML(html, config = {}, doc = document, purify = resolveDOMPurify(doc)) {
    const template = doc.createElement("template");
    template.innerHTML = purify.sanitize(String(html || ""), mergeConfig(config));
    normalizeLinks(template.content);
    return template.innerHTML;
  }
  function sanitizeElement(element, config = {}, purify = resolveDOMPurify(element.ownerDocument)) {
    const doc = element.ownerDocument;
    const wrapper = doc.createElement("div");
    while (element.firstChild) wrapper.appendChild(element.firstChild);
    purify.sanitize(wrapper, {
      ...mergeConfig(config),
      IN_PLACE: true
    });
    normalizeLinks(wrapper);
    while (wrapper.firstChild) element.appendChild(wrapper.firstChild);
    return element;
  }
  function sanitizeToDOMFragment(html, config = {}, doc = document, purify = resolveDOMPurify(doc)) {
    const fragment = purify.sanitize(String(html || ""), {
      ...mergeConfig(config),
      RETURN_DOM_FRAGMENT: true
    });
    const clean = fragment?.ownerDocument === doc ? fragment : doc.importNode(fragment, true);
    normalizeLinks(clean);
    return clean || doc.createDocumentFragment();
  }
  function mergeConfig(config) {
    return { ...DEFAULT_SANITIZE_CONFIG, ...config };
  }
  var SAFE_URL_SCHEMES = /* @__PURE__ */ new Set(["http", "https", "mailto", "tel"]);
  var URL_CONTROL_CHARS = new RegExp("[\\u0000-\\u0020\\u007F-\\u009F]", "g");
  function isSafeUrl(url) {
    const stripped = String(url == null ? "" : url).replace(URL_CONTROL_CHARS, "");
    const scheme = (stripped.match(/^([a-z][a-z0-9+.\-]*):/i) || [])[1];
    return !scheme || SAFE_URL_SCHEMES.has(scheme.toLowerCase());
  }
  var SITE_FILE = /^[^\s/?#:]+\.(?:html?|pdf|txt|csv|json|xml|svg|png|jpe?g|gif|webp|docx?|xlsx?|pptx?|bib|tex|zip)(?:[?#]\S*)?$/i;
  var SITE_PATH = /^[^\s/?#:.]+\/\S*$/;
  function normalizeUrl(value) {
    const raw = String(value == null ? "" : value).trim();
    if (!raw || !isSafeUrl(raw)) return "";
    if (/^(?:https?:|mailto:|tel:)/i.test(raw)) return raw;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) return `mailto:${raw}`;
    if (/^(?:[#?]|\/|\.{1,2}\/)/.test(raw)) return raw;
    if (SITE_FILE.test(raw) || SITE_PATH.test(raw)) return raw;
    return `https://${raw}`;
  }
  function resolveDOMPurify(doc) {
    const supplied = globalThis.DOMPurify;
    if (supplied?.sanitize) return supplied;
    if (typeof supplied === "function") return supplied(doc.defaultView || globalThis);
    throw new Error(
      "RichClay requires DOMPurify. Load vendor/purify.min.js before richclay.js or provide globalThis.DOMPurify."
    );
  }
  function normalizeLinks(root) {
    root.querySelectorAll?.("a[href]").forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (/^\s*javascript:/i.test(href)) {
        link.removeAttribute("href");
      }
      if (link.getAttribute("target") === "_blank") {
        const rel = new Set((link.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
        rel.add("noopener");
        rel.add("noreferrer");
        link.setAttribute("rel", Array.from(rel).join(" "));
      }
    });
  }
  var INLINE_SANITIZE_EXTENSIONS = {
    ADD_TAGS: ["img"],
    ADD_ATTR: ["class", "id", "src", "alt", "width", "height"]
  };
  function inlineSanitizeConfig(config = {}) {
    return {
      ...config,
      ADD_TAGS: [.../* @__PURE__ */ new Set([...INLINE_SANITIZE_EXTENSIONS.ADD_TAGS, ...config.ADD_TAGS || []])],
      ADD_ATTR: [.../* @__PURE__ */ new Set([...INLINE_SANITIZE_EXTENSIONS.ADD_ATTR, ...config.ADD_ATTR || []])],
      ALLOW_DATA_ATTR: config.ALLOW_DATA_ATTR ?? true
    };
  }
  var FLATTEN_SELECTOR = "p, div, h1, h2, h3, h4, h5, h6, blockquote, pre, ul, ol, li, figure, figcaption, table, thead, tbody, tr, td, th";
  function flattenFragmentToSingleLine(fragment) {
    const doc = fragment.ownerDocument || document;
    fragment.querySelectorAll?.("br").forEach((br) => br.replaceWith(doc.createTextNode(" ")));
    let block = fragment.querySelector?.(FLATTEN_SELECTOR);
    while (block) {
      const parent = block.parentNode;
      parent.insertBefore(doc.createTextNode(" "), block);
      while (block.firstChild) parent.insertBefore(block.firstChild, block);
      parent.insertBefore(doc.createTextNode(" "), block);
      block.remove();
      block = fragment.querySelector(FLATTEN_SELECTOR);
    }
    collapseFragmentWhitespace(fragment, doc);
    return fragment;
  }
  function collapseFragmentWhitespace(fragment, doc) {
    fragment.normalize?.();
    const walker = doc.createTreeWalker(
      fragment,
      4
      /* NodeFilter.SHOW_TEXT */
    );
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      node.nodeValue = node.nodeValue.replace(/\s+/g, " ");
    });
    const first = fragment.firstChild;
    if (first?.nodeType === 3) first.nodeValue = first.nodeValue.replace(/^\s+/, "");
    const last = fragment.lastChild;
    if (last?.nodeType === 3) last.nodeValue = last.nodeValue.replace(/\s+$/, "");
  }

  // src/link-popover.js
  var LINK_POPOVER_GRACE_MS = 300;
  var shownAddress = (href) => href.replace(/^mailto:/i, "").replace(/^https?:\/\//i, "");
  var LinkPopover = class {
    constructor(editor) {
      this.editor = editor;
      this.root = null;
      this.anchor = null;
      this.href = null;
      this.dismissed = null;
      this.hideTimer = null;
      this.pointerInside = false;
      this.cleanup = null;
    }
    currentAnchor() {
      const editor = this.editor;
      if (!editor.active || editor.options.readOnly || editor.dialog) return null;
      const doc = editor.element.ownerDocument;
      if (doc.hidden) return null;
      const live = doc.getSelection?.();
      if (!live || !live.rangeCount || !editor.element.contains(live.anchorNode)) return null;
      return editor.currentLinkElement();
    }
    update() {
      const anchor = this.currentAnchor();
      if (anchor && anchor === this.dismissed) return;
      this.dismissed = null;
      if (!anchor) {
        this.scheduleHide();
        return;
      }
      this.cancelHide();
      this.show(anchor);
    }
    show(anchor) {
      if (!this.root) this.mount();
      const href = anchor.getAttribute("href") || "";
      if (anchor !== this.anchor || href !== this.href) {
        this.anchor = anchor;
        this.href = href;
        const address = this.root.querySelector(".richclay-link-address");
        address.textContent = shownAddress(href) || href;
        address.title = href;
        if (href && isSafeUrl(href)) address.setAttribute("href", href);
        else address.removeAttribute("href");
        if (/^(?:mailto|tel):/i.test(href)) address.removeAttribute("target");
        else address.setAttribute("target", "_blank");
      }
      this.position();
    }
    mount() {
      const editor = this.editor;
      const doc = editor.element.ownerDocument;
      const win = doc.defaultView || globalThis;
      const root = doc.createElement("div");
      root.className = "richclay-dialog richclay-link-popover";
      root.setAttribute("role", "group");
      root.setAttribute("aria-label", "Link");
      root.setAttribute("data-richclay-link-popover", "");
      markChrome(root);
      root.setAttribute("save-remove", "");
      root.innerHTML = `
      <a class="richclay-link-address" rel="noopener noreferrer"></a>
      <button type="button" class="richclay-secondary" data-richclay-link-edit>Edit</button>
      <button type="button" class="richclay-secondary" data-richclay-link-remove>Remove</button>
    `;
      if (editor.options.linkLabel) root.querySelector("[data-richclay-link-remove]").remove();
      root.addEventListener("pointerdown", preservePointerSelection);
      root.addEventListener("pointerenter", () => {
        this.pointerInside = true;
        this.cancelHide();
      });
      root.addEventListener("pointerleave", () => {
        this.pointerInside = false;
        this.update();
      });
      root.querySelector("[data-richclay-link-edit]").addEventListener("click", () => {
        const anchor = this.anchor;
        if (!anchor || !editor.element.contains(anchor)) return this.hide();
        editor.selectElement(anchor);
        editor.openLinkDialog();
      });
      root.querySelector("[data-richclay-link-remove]")?.addEventListener("click", () => {
        const anchor = this.anchor;
        this.hide();
        editor.removeLinkElement(anchor);
        editor.focus();
      });
      const host = editor.element.closest("dialog") || doc.body;
      const layered = typeof root.showPopover === "function";
      if (layered) root.setAttribute("popover", "manual");
      pin(root, "position", "fixed");
      pin(root, "inset", "0px auto auto 0px");
      pin(root, "margin", "0");
      pin(root, "overflow", "visible");
      host.appendChild(root);
      if (layered) root.showPopover();
      this.root = root;
      const reposition = () => this.position();
      const onKeydown = (event) => {
        if (event.key !== "Escape" || !this.root) return;
        this.dismissed = this.anchor;
        this.hide();
      };
      doc.addEventListener("scroll", reposition, { capture: true, passive: true });
      win.addEventListener("resize", reposition, { passive: true });
      editor.element.addEventListener("keydown", onKeydown);
      this.cleanup = () => {
        doc.removeEventListener("scroll", reposition, { capture: true });
        win.removeEventListener("resize", reposition);
        editor.element.removeEventListener("keydown", onKeydown);
      };
    }
    position() {
      const root = this.root;
      if (!root || !this.anchor) return;
      const win = root.ownerDocument.defaultView || globalThis;
      const placement = placePopover({
        anchor: this.anchor.getBoundingClientRect(),
        box: { width: root.offsetWidth || 0, height: root.offsetHeight || 0 },
        viewport: {
          width: win.visualViewport?.width ?? win.innerWidth,
          height: win.visualViewport?.height ?? win.innerHeight
        }
      });
      root.setAttribute("data-richclay-side", placement.side);
      root.style.setProperty("--richclay-dialog-arrow", `${Math.round(placement.arrow)}px`);
      pin(root, "transform", `translate(${Math.round(placement.x)}px, ${Math.round(placement.y)}px)`);
    }
    scheduleHide() {
      if (!this.root || this.hideTimer !== null) return;
      const win = this.root.ownerDocument.defaultView || globalThis;
      this.hideTimer = win.setTimeout(() => {
        this.hideTimer = null;
        if (!this.pointerInside) this.hide();
      }, LINK_POPOVER_GRACE_MS);
    }
    cancelHide() {
      if (this.hideTimer === null) return;
      const win = this.editor.element.ownerDocument.defaultView || globalThis;
      win.clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
    onEditorBlur(event) {
      const next = event?.relatedTarget;
      if (next && this.editor.ownsFocusTarget(next)) return;
      this.hide();
    }
    hide() {
      this.cancelHide();
      this.cleanup?.();
      this.cleanup = null;
      this.root?.remove();
      this.root = null;
      this.anchor = null;
      this.href = null;
      this.pointerInside = false;
    }
    destroy() {
      this.hide();
      this.dismissed = null;
    }
  };

  // src/styles.js
  var STYLE_ID = "richclay-styles";
  var styledDocs = /* @__PURE__ */ new WeakSet();
  var cssText = "";
  function setRichClayStyles(text) {
    cssText = text || "";
  }
  function ensureStyles(doc = document) {
    if (!doc || styledDocs.has(doc)) return;
    if (doc.getElementById(STYLE_ID)) {
      styledDocs.add(doc);
      return;
    }
    if (!cssText) return;
    const style = doc.createElement("style");
    style.id = STYLE_ID;
    style.setAttribute("save-remove", "");
    style.setAttribute("save-ignore", "");
    style.textContent = cssText;
    (doc.head || doc.documentElement).appendChild(style);
    styledDocs.add(doc);
  }

  // src/lib/region-capabilities.js
  var CAPABILITIES = Object.freeze({
    data: Object.freeze({ tokens: ["no-data"], bundles: ["editor-ui"] }),
    save: Object.freeze({ tokens: ["no-save"], bundles: ["editor-ui"] }),
    snapshot: Object.freeze({ tokens: ["no-snapshot"], bundles: ["editor-ui"] }),
    watch: Object.freeze({ tokens: ["no-watch"], bundles: ["editor-ui"] }),
    undo: Object.freeze({ tokens: ["no-undo"], bundles: ["editor-ui"] }),
    history: Object.freeze({ tokens: [], bundles: ["editor-ui"] })
  });
  var BUNDLES = Object.freeze({
    "editor-ui": Object.freeze(["no-data", "no-save", "no-snapshot", "no-watch", "no-undo"])
  });
  var POLICY_TOKENS = Object.freeze([
    "no-save",
    "no-snapshot",
    "no-trigger-autosave",
    "no-dirty",
    "no-watch",
    "no-undo",
    "no-data",
    "freeze",
    "editor-ui",
    "live"
  ]);
  function hasPolicyToken(element, token) {
    if (!element || element.nodeType !== 1) return false;
    const clay = element.getAttribute?.("clay");
    return !!(clay && clay.split(/\s+/).includes(token) || element.hasAttribute?.(token));
  }
  function expandsTo(element, token) {
    if (hasPolicyToken(element, token)) return true;
    for (const [bundle, members] of Object.entries(BUNDLES)) {
      if (members.includes(token) && hasPolicyToken(element, bundle)) return true;
    }
    return false;
  }
  function capabilitySelector(capability) {
    const definition = CAPABILITIES[capability];
    if (!definition) throw new Error(`Unknown region capability: ${capability}`);
    return [...definition.tokens, ...definition.bundles].flatMap((token) => [`[clay~="${token}"]`, `[${token}]`]).join(", ");
  }
  function closestWithCapability(node, capability) {
    let element = node && node.nodeType === 1 ? node : node?.parentElement;
    while (element && element.nodeType === 1) {
      const definition = CAPABILITIES[capability];
      if (!definition) throw new Error(`Unknown region capability: ${capability}`);
      if (definition.tokens.some((token) => expandsTo(element, token)) || definition.bundles.some((bundle) => hasPolicyToken(element, bundle))) return element;
      element = element.parentElement;
    }
    return null;
  }
  function hasCapability(node, capability) {
    return !!closestWithCapability(node, capability);
  }

  // src/lib/content-dom.js
  var UNSUPPORTED_SELECTOR = /:(?:focus(?:-within|-visible)?|hover|active|visited|defined)\b/i;
  function copyControlState(source, copy) {
    if (!/^(INPUT|TEXTAREA|SELECT|OPTION)$/.test(source.tagName || "")) return;
    const type = (source.getAttribute?.("type") || "").toLowerCase();
    if ("value" in source && "value" in copy && source.tagName !== "OPTION" && type !== "checkbox" && type !== "radio" && type !== "file") copy.value = source.value;
    if (source.tagName === "INPUT" && (type === "checkbox" || type === "radio")) copy.checked = source.checked;
    if (source.tagName === "OPTION") copy.selected = source.selected;
    if ("indeterminate" in source && "indeterminate" in copy) copy.indeterminate = source.indeterminate;
  }
  function matchesWithin(node, selector, boundary, inherit) {
    if (inherit) return !!node.closest?.(selector);
    let current = node;
    while (current?.nodeType === 1) {
      if (current.matches(selector)) return true;
      if (current === boundary) break;
      current = current.parentElement;
    }
    return false;
  }
  function excluded(source, capability, capabilityMatch, exclude, boundary, inherit) {
    return (inherit ? hasCapability(source, capability) : matchesWithin(source, capabilityMatch, boundary, false)) || !!(exclude && (inherit && source !== boundary ? source.matches(exclude) : matchesWithin(source, exclude, boundary, inherit)));
  }
  function hasOwnCapability(element, capability) {
    const definition = CAPABILITIES[capability];
    return definition.tokens.some((token) => expandsTo(element, token)) || definition.bundles.some((bundle) => hasPolicyToken(element, bundle));
  }
  var CONTROL_TAGS = /* @__PURE__ */ new Set(["INPUT", "TEXTAREA", "SELECT", "OPTION"]);
  function pairTree(source, copy, maps, drop) {
    if (source.nodeType === 1 && drop(source)) {
      maps.dropped.push(copy);
      return;
    }
    maps.cloneToLive.set(copy, source);
    maps.liveToClone.set(source, copy);
    let sourceChildren = source;
    let copyChildren = copy;
    if (source.nodeType === 1) {
      if (CONTROL_TAGS.has(source.tagName)) maps.controls.push(source, copy);
      if (source.tagName === "TEMPLATE") {
        while (copy.firstChild) copy.removeChild(copy.firstChild);
        sourceChildren = source.content;
        copyChildren = copy.content;
        maps.cloneToLive.set(copyChildren, sourceChildren);
        maps.liveToClone.set(sourceChildren, copyChildren);
      }
    } else if (source.nodeType !== 11) return;
    let c = copyChildren.firstChild;
    for (let s = sourceChildren.firstChild; s && c; s = s.nextSibling) {
      pairTree(s, c, maps, drop);
      c = c.nextSibling;
    }
  }
  function createContentView(context, { capability = "data", exclude = null, inherit = true, provenance = null } = {}) {
    if (!context) throw new TypeError("createContentView requires a DOM context");
    const sourceDocument = context.nodeType === 9 ? context : context.ownerDocument;
    if (!sourceDocument?.implementation?.createHTMLDocument) {
      throw new TypeError("createContentView requires an HTML DOM implementation");
    }
    const inertDocument = sourceDocument.implementation.createHTMLDocument("");
    const cloneToLive = provenance || /* @__PURE__ */ new WeakMap();
    const liveToClone = /* @__PURE__ */ new WeakMap();
    const sourceRoot = context.nodeType === 9 ? context.documentElement : context;
    if (exclude) inertDocument.documentElement.matches(exclude);
    const capabilityMatch = capabilitySelector(capability);
    const drop = inherit ? (el) => hasOwnCapability(el, capability) || !!(exclude && el.matches(exclude)) : (el) => excluded(el, capability, capabilityMatch, exclude, sourceRoot, false);
    let root = null;
    if (sourceRoot.nodeType !== 1 || !excluded(sourceRoot, capability, capabilityMatch, exclude, sourceRoot, inherit)) {
      root = inertDocument.importNode(sourceRoot, true);
      const maps = { cloneToLive, liveToClone, dropped: [], controls: [] };
      pairTree(sourceRoot, root, maps, drop);
      for (const node of maps.dropped) node.remove();
      for (let i = 0; i < maps.controls.length; i += 2) copyControlState(maps.controls[i], maps.controls[i + 1]);
    }
    if (context.nodeType === 9 && root) {
      inertDocument.replaceChild(root, inertDocument.documentElement);
      liveToClone.set(context, inertDocument);
      cloneToLive.set(inertDocument, context);
    }
    const assertSelector = (selector) => {
      if (UNSUPPORTED_SELECTOR.test(selector)) {
        throw new Error(`Filtered content queries do not support stateful selector: ${selector}`);
      }
    };
    return {
      root,
      document: inertDocument,
      capability,
      selector: capabilitySelector(capability),
      cloneToLive,
      liveToClone,
      original(node) {
        return cloneToLive.get(node) || null;
      },
      cloneOf(node) {
        return liveToClone.get(node) || null;
      },
      query(selector, queryRoot = root) {
        assertSelector(selector);
        return Array.from(queryRoot.querySelectorAll(selector), (node) => cloneToLive.get(node) || node);
      },
      text(node = root) {
        const projected = node === root ? root : liveToClone.get(node);
        return projected?.textContent || "";
      },
      html(node = root) {
        const projected = node === root ? root : liveToClone.get(node);
        return projected?.innerHTML ?? "";
      },
      clone(node = root) {
        const projected = node === root ? root : liveToClone.get(node);
        return projected ? inertDocument.importNode(projected, true) : null;
      }
    };
  }

  // src/richclay.js
  var EDITOR_UI_SELECTOR = capabilitySelector("history");
  function stripIncomingEditorUi(html, doc) {
    const template = doc.createElement("template");
    template.innerHTML = String(html || "");
    for (const node of template.content.querySelectorAll(EDITOR_UI_SELECTOR)) node.remove();
    return template.innerHTML;
  }
  function clipboardHTML(html, doc) {
    return stripIncomingEditorUi(html, doc);
  }
  function clipboardText(html, doc) {
    const template = doc.createElement("template");
    template.innerHTML = clipboardHTML(html, doc);
    const blocks = /* @__PURE__ */ new Set(["ADDRESS", "ARTICLE", "ASIDE", "BLOCKQUOTE", "DIV", "DL", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "H1", "H2", "H3", "H4", "H5", "H6", "HEADER", "HR", "LI", "MAIN", "NAV", "OL", "P", "PRE", "SECTION", "TABLE", "UL"]);
    let text = "";
    const visit = (node) => {
      if (node.nodeType === 3) text += node.data;
      else if (node.nodeType === 1 && node.tagName === "BR") text += "\n";
      else {
        const block = node.nodeType === 1 && blocks.has(node.tagName);
        if (block && text && !text.endsWith("\n")) text += "\n";
        for (const child of node.childNodes || []) visit(child);
        if (block && text && !text.endsWith("\n")) text += "\n";
      }
    };
    visit(template.content);
    return text.replace(/\n{3,}/g, "\n\n").replace(/^\n|\n$/g, "");
  }
  function serializeEditorRoot(root, editor, range = null) {
    const view = createContentView(root, { capability: "history", inherit: false });
    const clone = view.root;
    const boundaryFor = (container, offset) => {
      while (container && !view.cloneOf(container)) {
        const parent = container.parentNode;
        if (!parent) return { container: clone, offset: 0 };
        offset = Array.from(parent.childNodes).indexOf(container);
        container = parent;
      }
      const projected = view.cloneOf(container) || clone;
      if (container?.nodeType === 3) return { container: projected, offset: Math.min(offset, projected.length) };
      const before = Array.from(container?.childNodes || []).slice(0, offset).filter((node) => view.cloneOf(node)).length;
      return { container: projected, offset: Math.min(before, projected.childNodes.length) };
    };
    const insert = (id, container, offset) => {
      const point = boundaryFor(container, offset);
      const marker = clone.ownerDocument.createElement("input");
      marker.id = id;
      marker.type = "hidden";
      const markerRange = clone.ownerDocument.createRange();
      markerRange.setStart(point.container, point.offset);
      markerRange.collapse(true);
      markerRange.insertNode(marker);
    };
    if (range) {
      insert(editor.endSelectionId, range.endContainer, range.endOffset);
      insert(editor.startSelectionId, range.startContainer, range.startOffset);
    } else {
      for (const id of [editor.startSelectionId, editor.endSelectionId]) {
        if (clone.querySelector(`#${id}`)) continue;
        const marker = root.querySelector(`#${id}`);
        if (!marker) continue;
        insert(id, marker.parentNode, Array.from(marker.parentNode.childNodes).indexOf(marker));
      }
    }
    return clone.innerHTML;
  }
  var instances = /* @__PURE__ */ new WeakMap();
  var autoInitWindows = /* @__PURE__ */ new WeakMap();
  var watchedWindows = /* @__PURE__ */ new WeakMap();
  var globalRegistry = createDefaultRegistry();
  var KEEP_FOCUS = Symbol("richclay-keep-focus");
  var ROOT_TRANSFER_EVENTS = ["cut", "paste", "drop"];
  var MODIFIER_ORDER = ["Alt", "Ctrl", "Meta", "Shift"];
  var dialogSeq = 0;
  function isManagedByClayJS(win) {
    return typeof win.clay?.mode === "string";
  }
  var defaultOptions = {
    toolbar: "standard",
    toolbarContainer: null,
    sanitize: {},
    placeholder: "",
    readOnly: false,
    hyperclay: "auto",
    onChange: null,
    Squire: null,
    inline: false,
    singleLine: false,
    toolbarOnSelect: false,
    linkPopover: true,
    linkLabel: false
  };
  var LINK_LABEL_CONTROLS = ["link", "undo", "redo"];
  var RichClay = class _RichClay {
    static presets = presets;
    static selector = RICHCLAY_SELECTOR;
    static hostHistory = false;
    static keepsOwnHistory = null;
    constructor(element, options = {}) {
      if (!element) throw new Error("RichClay requires an element.");
      const existing = instances.get(element);
      if (existing) return existing;
      this.element = element;
      this.unsupported = conflictsWithExistingEditor(element) || refuseUnsupportedRoot(element);
      const derived = { ...parseEditableOptions(element), ...options };
      this.options = { ...defaultOptions, ...derived };
      if (this.options.singleLine && !("toolbar" in derived)) {
        this.options.toolbar = "inline";
      }
      this._blockTag = this.options.inline ? "DIV" : "P";
      this.registry = new Map(globalRegistry);
      this.toolbar = null;
      this.float = null;
      this._onToolbarKey = null;
      this._onFloatFocusOut = null;
      this._onDocPointerDown = null;
      this.liveRegion = null;
      this.description = null;
      this.dialog = null;
      this.dialogCleanup = null;
      this.linkPopover = null;
      this.savedSelection = null;
      this.path = "";
      this.active = false;
      this._squire = null;
      this._squireHTML = null;
      this._squireListeners = [];
      this._onBeforeInput = null;
      this._onHistoryInput = null;
      this._onRootBeforeInput = null;
      this._onRootKeydown = null;
      this._onRootTransfer = null;
      this._shortcutKeys = [];
      this._appleDeleteKeys = /* @__PURE__ */ new Set();
      this._authoredPres = /* @__PURE__ */ new WeakSet();
      this._warnedInlineBlock = false;
      this._onFocus = () => {
        this.element.classList.add("richclay-focused");
        if (this.options.inline) this.ensureFloatingToolbar();
      };
      this._onBlur = (event) => {
        this.element.classList.remove("richclay-focused");
        this.linkPopover?.onEditorBlur(event);
        if (this.options.inline) this.scheduleFloatTeardown(event);
      };
      this._onLinkActivation = (event) => {
        if (!this.active || this.options.readOnly) return;
        const target = event.target?.nodeType === 1 ? event.target : event.target?.parentElement;
        const anchor = target?.closest("a[href]");
        if (!anchor) return;
        const chrome = closestWithCapability(target, "history");
        if (chrome && chrome !== this.element && this.element.contains(chrome) && chrome.contains(anchor)) return;
        event.preventDefault();
      };
      this._onExternalWrite = () => {
        if (!this._squire) return;
        this._squire._mutation?.takeRecords();
        if (this.options.linkLabel) this._labelHref = this.element.querySelector("a[href]")?.getAttribute("href") ?? this._labelHref;
        this.resetSquireUndoBaseline();
        this.updatePlaceholder();
      };
      this.ensureMarker();
      this.hyperclay = shouldUseHyperclay(this.options, this.window);
      if (this.hyperclay) installHyperclayBridge(this.window);
      instances.set(element, this);
      this.sanitizeConfig = this.options.inline ? inlineSanitizeConfig(this.options.sanitize) : this.options.sanitize;
      this.sanitizer = createSanitizer(this.sanitizeConfig, this.element.ownerDocument);
      if (!this.options.inline) {
        sanitizeElement(this.element, inlineSanitizeConfig(this.options.sanitize));
      }
      if (shouldActivateEditor(this.options, this.window)) {
        this.activate();
      }
    }
    get squire() {
      return this._squire;
    }
    get window() {
      return this.element.ownerDocument.defaultView || window;
    }
    static init(selector = RICHCLAY_SELECTOR, options = {}) {
      const guard = selector === RICHCLAY_SELECTOR ? isRichClayHost : () => true;
      const elements = resolveElements(selector).filter(guard).filter((element) => !conflictsWithExistingEditor(element));
      return elements.map((element) => new _RichClay(element, options));
    }
    static autoInit(win = typeof window !== "undefined" ? window : void 0) {
      if (!win || !win.document) return () => {
      };
      const existing = autoInitWindows.get(win);
      if (existing) return existing;
      let cancelled = false;
      let stopWatching = null;
      const run = () => {
        if (cancelled || isManagedByClayJS(win)) return;
        if (shouldUseHyperclay({}, win) && isHyperclayEditMode(win)) {
          _RichClay.init();
          stopWatching = _RichClay.watch(win);
        }
      };
      const stop = () => {
        cancelled = true;
        stopWatching?.();
      };
      autoInitWindows.set(win, stop);
      if (win.document.readyState === "loading") {
        win.document.addEventListener("DOMContentLoaded", run, { once: true });
      } else {
        run();
      }
      return stop;
    }
    static watch(win = typeof window !== "undefined" ? window : void 0, options = {}) {
      if (!win || !win.document) return () => {
      };
      const existing = watchedWindows.get(win);
      if (existing) return existing;
      const mount = (element) => {
        if (!isMountable(element)) return;
        if (!instances.has(element) && !conflictsWithExistingEditor(element)) new _RichClay(element, options);
      };
      const unmount = (element) => instances.get(element)?.destroy();
      const observer = new win.MutationObserver((records) => {
        records.forEach((record) => {
          if (record.type === "attributes") {
            const target = record.target;
            if (isMountable(target)) mount(target);
            else unmount(target);
            return;
          }
          record.addedNodes.forEach((node) => {
            if (node.nodeType !== 1) return;
            if (node.matches?.(RICHCLAY_SELECTOR)) mount(node);
            node.querySelectorAll?.(RICHCLAY_SELECTOR).forEach(mount);
          });
          record.removedNodes.forEach((node) => {
            if (node.nodeType !== 1) return;
            const teardown = (el) => {
              if (!el.isConnected) instances.get(el)?.destroy();
            };
            if (node.matches?.(RICHCLAY_SELECTOR)) teardown(node);
            node.querySelectorAll?.(RICHCLAY_SELECTOR).forEach(teardown);
          });
        });
      });
      let stopped = false;
      const stop = () => {
        if (stopped) return;
        stopped = true;
        observer.disconnect();
        if (watchedWindows.get(win) === stop) watchedWindows.delete(win);
      };
      observer.observe(win.document.documentElement || win.document, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["editable", "clay-editable", "data-richclay", "richclay"]
      });
      watchedWindows.set(win, stop);
      return stop;
    }
    static registerButton(def) {
      validateButton(def);
      globalRegistry.set(def.id, def);
      return _RichClay;
    }
    static unregisterButton(id) {
      globalRegistry.delete(id);
      return _RichClay;
    }
    static stripFromClone(docElem) {
      stripRichClayFromClone(docElem);
    }
    // Remove richclay's runtime state from ONE element, addressed by element
    // rather than by instance.
    //
    // A host that grows a list by cloning a row clones an active region with it,
    // and the copy carries contenteditable, the marker and the runtime classes.
    // Usually there is no editor behind them and destroy() cannot reach it,
    // because destroy belongs to an instance and that clone has none. But a clone
    // carrying the author's own data-richclay is mountable, so the watcher can
    // have given it an instance before the host gets here: this cannot assume the
    // element is instanceless.
    static stripElement(element) {
      if (!element || typeof element.getAttribute !== "function") return;
      const existing = instances.get(element);
      if (existing) {
        existing.destroy();
        return;
      }
      removeRuntimeState(element, "destroy");
    }
    // The content this field would save, the same whether its editor is mounted,
    // destroyed or never mounted. A host's undo uses it to tell a real text change
    // from editor runtime state. Only the field's children are returned: mounting
    // rewrites the field element's own attributes (style serialization, attribute
    // order, contenteditable and inert-contenteditable) without any edit, so they
    // cannot tell a change from a mount. Returns undefined for an element richclay
    // does not own.
    static savedContent(element) {
      if (!element || typeof element.matches !== "function") return void 0;
      if (!element.matches(RICHCLAY_SELECTOR) || !isRichClayHost(element)) return void 0;
      const holder = element.ownerDocument.createElement("div");
      const clone = element.cloneNode(true);
      clone.setAttribute("data-richclay-active", "true");
      holder.append(clone);
      stripRichClayFromClone(holder);
      return holder.firstElementChild ? holder.firstElementChild.innerHTML : "";
    }
    static setSavedContent(element, html, { morph } = {}) {
      if (typeof _RichClay.savedContent(element) !== "string") return false;
      const instance = instances.get(element);
      if (!instance || !instance.active) {
        element.innerHTML = html;
        return true;
      }
      instance.replaceContent(html, morph);
      instance._onExternalWrite();
      instance.toolbar?.update();
      return true;
    }
    registerButton(def) {
      validateButton(def);
      this.registry.set(def.id, def);
      if (this.active) this.renderToolbar();
      return this;
    }
    unregisterButton(id) {
      this.registry.delete(id);
      if (this.active) this.renderToolbar();
      return this;
    }
    canHistory(direction) {
      const squire = this._squire;
      if (!squire) return false;
      if (_RichClay.hostHistory && this.element.hasAttribute("data-richclay-runtime-no-undo") && !_RichClay.keepsOwnHistory?.(this.element)) return false;
      if (direction === "redo") return squire._undoIndex + 1 < squire._undoStackLength && squire._isInUndoState;
      return squire._undoIndex > 0 || !squire._isInUndoState;
    }
    history(direction) {
      if (this.canHistory(direction)) {
        if (direction === "redo") this._squire.redo();
        else this._squire.undo();
        return this;
      }
      this.element.dispatchEvent(
        new this.window.CustomEvent("richclay:history-exhausted", { bubbles: true, detail: { direction } })
      );
      return this;
    }
    quiet(fn) {
      const hub = this.window.clay?.Mutation;
      if (typeof hub?.pause !== "function" || typeof hub?.resume !== "function") return fn();
      hub.pause();
      try {
        return fn();
      } finally {
        hub.resume();
      }
    }
    activate() {
      return this.quiet(() => this.activateNow());
    }
    destroy() {
      return this.quiet(() => this.destroyNow());
    }
    reattach() {
      return this.quiet(() => this.reattachNow());
    }
    activateNow() {
      if (this.unsupported) return;
      if (this.active) return;
      this.active = true;
      this.applyInlineBox();
      ensureStyles(this.element.ownerDocument);
      consumeInertContenteditable(this.element);
      const initialNodes = this.options.inline ? Array.from(this.element.childNodes) : null;
      const initialHTML = this.options.inline ? null : this.element.innerHTML;
      const Squire = this.options.Squire || this.window.Squire || globalThis.Squire;
      if (!Squire) {
        throw new Error("RichClay requires Squire. Load vendor/squire.js before richclay.js.");
      }
      this.setupEditorAttributes();
      this.liveRegion = createLiveRegion(this.element.ownerDocument);
      this._squire = new Squire(this.element, {
        blockTag: this._blockTag,
        serializeRoot: serializeEditorRoot,
        willCutCopy: (html) => clipboardHTML(html, this.element.ownerDocument),
        toPlainText: (html) => clipboardText(html, this.element.ownerDocument),
        replaceRoot: (root, html, editor) => {
          if (!this.replaceContent(html)) return;
          editor._ensureBottomLine();
          editor._mutation?.takeRecords();
        },
        onMutations: (records, editor) => {
          const excluded2 = (node, capability) => {
            const boundary = closestWithCapability(node, capability);
            return !!boundary && boundary !== this.element && this.element.contains(boundary);
          };
          let authored = false;
          let local = false;
          for (const record of records) {
            if (excluded2(record.target, "history")) continue;
            const nodes = record.type === "childList" ? [...record.addedNodes, ...record.removedNodes] : [record.target];
            for (const node of nodes) {
              if (excluded2(node, "history")) continue;
              if (excluded2(record.target, "undo") || excluded2(node, "undo")) local = true;
              else authored = true;
            }
          }
          if (authored) {
            const ignored = editor._ignoreChange;
            editor._docWasChanged();
            if (local && ignored) editor.fireEvent("input");
            if (this.options.linkLabel) this.keepOneLink();
          } else if (local) {
            editor._mayHaveZWS = true;
            editor.fireEvent("input");
          } else editor._ignoreChange = false;
        },
        sanitizeToDOMFragment: (html, editor) => {
          const fragment = this.sanitizer.sanitizeToDOMFragment(stripIncomingEditorUi(html, this.element.ownerDocument), editor);
          return this.options.singleLine ? flattenFragmentToSingleLine(fragment) : fragment;
        },
        didError: (error) => {
          console.error("RichClay/Squire error", error);
        }
      });
      if (this.options.inline) {
        this.element.replaceChildren(...initialNodes);
        this.resetSquireUndoBaseline();
      } else {
        const sanitizer = this.sanitizer;
        this.sanitizer = createSanitizer(inlineSanitizeConfig(this.options.sanitize), this.element.ownerDocument);
        try {
          this._squire.setHTML(initialHTML);
        } finally {
          this.sanitizer = sanitizer;
        }
      }
      this.bindSquire();
      if (this.options.singleLine) this.installSingleLineGuards();
      if (this.options.inline && !this.options.singleLine) this.installRootGuards();
      this.installAppleDeleteKeys();
      if (this.blocksStayOut()) this._squire._ensureBottomLine = () => {
      };
      this.maskSquireCodeShortcut();
      this.maskSquireBlockShortcuts();
      this.installShortcuts();
      this._onHistoryInput = (event) => {
        if (!this.element.contains(event.target)) return;
        if (event.inputType !== "historyUndo" && event.inputType !== "historyRedo") return;
        const target = event.target;
        if (target !== this.element && target.closest?.('input, textarea, select, [editor-ui], [clay~="editor-ui"]')) {
          event.stopPropagation();
          return;
        }
        event.preventDefault();
        event.stopImmediatePropagation();
        this.history(event.inputType === "historyRedo" ? "redo" : "undo");
      };
      this.element.ownerDocument.addEventListener("beforeinput", this._onHistoryInput, true);
      if (this.options.linkLabel) this.maskFormattingShortcuts();
      if (this.options.inline) {
        this._onToolbarKey = (event) => {
          if (event.altKey && event.key === "F10") {
            event.preventDefault();
            this.ensureFloatingToolbar();
            this.float?.toolbar.focusFirst();
          }
        };
        this.element.addEventListener("keydown", this._onToolbarKey);
      }
      if (this.blocksStayOut()) {
        const willPaste = (event) => {
          const fragment = event.detail?.fragment;
          if (!fragment) return;
          const doc = this.element.ownerDocument;
          flattenBlocks(
            fragment,
            () => this.options.singleLine ? doc.createTextNode(" ") : doc.createElement("br")
          );
        };
        this._squire.addEventListener("willPaste", willPaste);
        this._squireListeners.push(["willPaste", willPaste]);
      }
      if (this.options.linkLabel) {
        const plainPaste = (event) => {
          const fragment = event.detail?.fragment;
          if (!fragment) return;
          const text = fragment.textContent.replace(/\s+/g, " ");
          fragment.replaceChildren(this.element.ownerDocument.createTextNode(text));
        };
        this._squire.addEventListener("willPaste", plainPaste);
        this._squireListeners.push(["willPaste", plainPaste]);
        this._labelHref = this.element.querySelector("a[href]")?.getAttribute("href") ?? null;
      }
      this.renderToolbar();
      this.updatePlaceholder();
      this.warnOnBlockInInlineRegion();
      this.element.querySelectorAll("pre").forEach((pre) => this._authoredPres.add(pre));
      this._squireHTML = this.element.innerHTML;
      this.element.dispatchEvent(new this.window.CustomEvent("richclay:mount", { bubbles: true }));
    }
    // Live sync morphs the page against an incoming copy, and that copy is clean:
    // contenteditable, the marker and the runtime attributes all come back off an
    // element this editor is still pointing at. The instance is fine and Squire is
    // still bound; only the element's own state is gone, and activate() cannot put
    // it back because it returns early on an instance that never stopped being
    // active. Rebuilding is not an option for a host that adopted an editor the
    // author mounted, so this re-applies the state instead.
    //
    // The marker is in here because it is the one whose absence is fatal rather
    // than cosmetic: without it the watcher stops recognising the element, which
    // is the failure ensureMarker's own comment describes.
    //
    // Returns whether it had to do anything, so a caller can tell a repair from a
    // no-op without asking the same question twice.
    reattachNow() {
      if (this.unsupported || !this.active) return false;
      const intact = this.element.getAttribute("contenteditable") === "true" && this.element.getAttribute("data-richclay-active") === "true" && isMountable(this.element);
      if (!intact) {
        this.ensureMarker();
        this.applyInlineBox();
        consumeInertContenteditable(this.element);
        this.setupEditorAttributes();
      }
      if (this._squire && this.element.innerHTML !== this._squireHTML) {
        this.resetSquireUndoBaseline();
      }
      return !intact;
    }
    // A block inside an inline element renders as a run-on. This changes the box
    // and nothing else: whether a region survives a reload is decided by the
    // parser from tag names, before any CSS exists. Runtime only, so the author's
    // file keeps no style richclay put there.
    applyInlineBox() {
      if (isInlineTag(this.element) && !this.element.style.display) {
        this.element.style.display = "inline-block";
        this.element.setAttribute("data-richclay-runtime-display", "true");
      }
    }
    replaceContent(html, morph = this.window.clay?.morph || this.window.hyperclay?.morph) {
      const root = this.element;
      if (typeof morph !== "function") {
        if (root.querySelector('[editor-ui], [clay~="editor-ui"]')) {
          throw new Error("RichClay requires a retention-aware morph host to replay history containing editor-ui.");
        }
        root.innerHTML = html;
        return false;
      }
      morph(root, html, {
        morphStyle: "innerHTML",
        restoreFocus: false,
        scripts: { handle: false, merge: false },
        policy: "history"
      });
      return true;
    }
    getHTML() {
      return this._squire ? this._squire.getHTML() : this.element.innerHTML;
    }
    setHTML(html) {
      if (this._squire) {
        this._squire.setHTML(String(html || ""));
      } else {
        this.element.innerHTML = sanitizeHTML(
          html,
          this.sanitizeConfig,
          this.element.ownerDocument
        );
      }
      this.updatePlaceholder();
      this.toolbar?.update();
      this.options.onChange?.(this.getHTML());
      return this;
    }
    focus() {
      if (this._squire) this._squire.focus();
      else this.element.focus();
      return this;
    }
    destroyNow() {
      this.closeLinkDialog();
      this.linkPopover?.destroy();
      this.linkPopover = null;
      this.teardownFloatingToolbar();
      this.toolbar?.destroy();
      this.toolbar = null;
      if (this._onToolbarKey) {
        this.element.removeEventListener("keydown", this._onToolbarKey);
        this._onToolbarKey = null;
      }
      this.liveRegion?.remove();
      this.liveRegion = null;
      this.description?.remove();
      this.description = null;
      this._shortcutKeys.forEach((key) => this._squire?.setKeyHandler?.(key, null));
      this._squireListeners.forEach(([type, listener]) => {
        this._squire?.removeEventListener?.(type, listener);
      });
      this._squireListeners = [];
      this._shortcutKeys = [];
      if (this._onBeforeInput) {
        this.element.ownerDocument.removeEventListener("beforeinput", this._onBeforeInput, true);
        this._onBeforeInput = null;
      }
      if (this._onHistoryInput) {
        this.element.ownerDocument.removeEventListener("beforeinput", this._onHistoryInput, true);
        this._onHistoryInput = null;
      }
      const doc = this.element.ownerDocument;
      if (this._onRootBeforeInput) {
        doc.removeEventListener("beforeinput", this._onRootBeforeInput, true);
        this._onRootBeforeInput = null;
      }
      if (this._onRootKeydown) {
        doc.removeEventListener("keydown", this._onRootKeydown, true);
        this._onRootKeydown = null;
      }
      if (this._onRootTransfer) {
        ROOT_TRANSFER_EVENTS.forEach((type) => doc.removeEventListener(type, this._onRootTransfer, true));
        this._onRootTransfer = null;
      }
      this._squire?.destroy?.();
      this._squire = null;
      this.cleanupEditorAttributes();
      instances.delete(this.element);
    }
    saveSelection() {
      this.savedSelection = getSquireSelection(this._squire) || this.savedSelection;
      return this.savedSelection;
    }
    restoreSelection() {
      return restoreSquireSelection(this._squire, this.savedSelection);
    }
    // Squire's invariant is established on the first real edit rather than at
    // activation, so that opening a page in edit mode never rewrites it. These
    // listeners capture on the document, so the root is valid before Squire's own
    // handlers see the event. History inputs are skipped: repairing mid-undo would
    // fight the stack it is replaying.
    installRootGuards() {
      const doc = this.element.ownerDocument;
      const owns = (event) => this.element.contains(event.target);
      this._onRootBeforeInput = (event) => {
        if (!owns(event) || event.isComposing || /^history/.test(event.inputType || "")) return;
        this.ensureRootIsEditable();
      };
      this._onRootKeydown = (event) => {
        if (!owns(event) || event.defaultPrevented || event.isComposing) return;
        if (this.isEditingKey(event)) this.ensureRootIsEditable();
      };
      this._onRootTransfer = (event) => {
        if (owns(event)) this.ensureRootIsEditable();
      };
      doc.addEventListener("beforeinput", this._onRootBeforeInput, true);
      doc.addEventListener("keydown", this._onRootKeydown, true);
      ROOT_TRANSFER_EVENTS.forEach((type) => {
        doc.addEventListener(type, this._onRootTransfer, true);
      });
    }
    // Re-checked rather than latched, because Hyperclay's live sync morphs new DOM
    // into the region long after activation and can reintroduce a loose text node.
    ensureRootIsEditable() {
      if (!this._squire || this.options.singleLine) return;
      const wrapBareRoot = this.options.inline;
      const blocksAllowed = !this.blocksStayOut();
      if (!editorRootNeedsNormalization(this.element, { wrapBareRoot, blocksAllowed })) return;
      const range = getSquireSelection(this._squire);
      const saved = range ? captureRange(this.element, range) : null;
      const repair = () => {
        normalizeEditorRoot(this.element, {
          blockTag: this._blockTag,
          wrapBareRoot,
          blocksAllowed,
          onBareRootWrapped: (root, wrapper) => {
            console.warn(
              `richclay: wrapped this region's loose text in a <div> so multi-line editing works. Wrap the content in your own block element to keep the markup you wrote, or use editable="single-line" if it is meant to be one line.`,
              root,
              wrapper
            );
          }
        });
      };
      if (typeof this._squire.modifyDocument === "function") this._squire.modifyDocument(repair);
      else repair();
      if (saved) {
        restoreRange(this.element, range, saved);
        restoreSquireSelection(this._squire, range);
        this.savedSelection = cloneRange(range);
      }
    }
    // Only keys that will actually edit. Repairing is not free on a root that has
    // not been repaired yet, which is every freshly opened page, so a blanket
    // "any single-character key" made Cmd+C and Cmd+S rewrite an untouched region.
    // The only modified keys that do edit are the ones this editor rebound itself,
    // which is why the set is asked rather than Squire's dispatch mirrored.
    isEditingKey(event) {
      if (["Backspace", "Delete", "Enter"].includes(event.key)) return true;
      if (event.key === "Tab") return this.caretIsInList();
      if (event.key.length !== 1) return false;
      if (!event.ctrlKey && !event.metaKey && !event.altKey) return true;
      return event.ctrlKey && !event.metaKey && !event.altKey && this._appleDeleteKeys.has(event.key.toLowerCase());
    }
    caretIsInList() {
      const range = this._squire?.getSelection();
      const container = range?.startContainer;
      if (!container) return false;
      const element = container.nodeType === 1 ? container : container.parentElement;
      return Boolean(element && this.element.contains(element) && element.closest("ul, ol"));
    }
    runControl(def) {
      if (!this._squire || typeof def.run !== "function") return;
      if (def.isDisabled?.(this)) return;
      this.restoreSelection();
      if (def.mutates !== false) this.ensureRootIsEditable();
      const result = def.run(this);
      this.element.querySelectorAll("pre:not([data-richclay-pre])").forEach((pre) => {
        if (!this._authoredPres.has(pre)) pre.setAttribute("data-richclay-pre", "");
      });
      if (def.mutates !== false) {
        this.ensureRootIsEditable();
        this.anchorSelectionInBlock();
      }
      this.saveSelection();
      this.toolbar?.update();
      this.updatePlaceholder();
      this.announceControl(def);
      if (result !== KEEP_FOCUS) {
        this.focus();
      }
      this.warnOnBlockInInlineRegion();
    }
    // Squire's modifyBlocks leaves the caret anchored on the root itself, between
    // blocks. From there getStartBlockOfRange finds no block, so the next block
    // command is a silent no-op — the "it stopped working" the user hit. Push a
    // collapsed caret back inside the block it is sitting in front of.
    anchorSelectionInBlock() {
      const range = getSquireSelection(this._squire);
      if (!range?.collapsed || range.startContainer !== this.element) return;
      const children = Array.from(this.element.childNodes);
      const atEnd = range.startOffset >= children.length;
      const child = atEnd ? children.filter(isCaretHost).pop() : children.slice(range.startOffset).find(isCaretHost) || children.slice(0, range.startOffset).filter(isCaretHost).pop();
      if (!child) return;
      const edge = caretEdge(child, !atEnd);
      range.setStart(edge, atEnd ? nodeLength(edge) : 0);
      range.collapse(true);
      restoreSquireSelection(this._squire, range);
    }
    selectionHasFormat(tag) {
      if (!tag || !this._squire?.hasFormat) return false;
      try {
        return this._squire.hasFormat(tag);
      } catch {
        return false;
      }
    }
    // Squire sets its path to "(selection)" whenever the selection spans more than
    // one node, so asking the path answered "no" for every multi-block selection.
    // Both boundaries must land in the same matching element, or a selection that
    // merely starts in a list would report as being in one.
    pathHas(tag) {
      const range = getSquireSelection(this._squire);
      if (!range) return false;
      const selector = tag.toLowerCase();
      const start = matchAtBoundary(this.element, range.startContainer, range.startOffset, true, selector);
      return Boolean(start) && start === matchAtBoundary(this.element, range.endContainer, range.endOffset, false, selector);
    }
    // Blocks stay out of this region for either of two reasons, and both are fixed
    // for the editor's life, which is why the toolbar can leave the controls out
    // rather than grey them. Either the parser would eject a block on the next page
    // load, or the author wrote the region as a line of text and richclay does not
    // rewrite what they wrote.
    blocksStayOut() {
      return this.options.singleLine || ejectsBlocks(this.element) || keepsTextShape(this.element);
    }
    // Advisory only: the markup is stable and saves correctly, it just will not
    // validate. Checked when the editor mounts and after any command, which covers
    // the ways an author actually produces one. Paste is deliberately not covered:
    // nothing hooks paste any more, and a console note is not worth reinstating a
    // hook that took three rounds to get wrong.
    warnOnBlockInInlineRegion() {
      if (this._warnedInlineBlock || !isInlineTag(this.element)) return;
      if (!hasBlockDescendant(this.element)) return;
      this._warnedInlineBlock = true;
      const tag = this.element.nodeName.toLowerCase();
      console.warn(
        `richclay: a block element inside <${tag} editable> is not valid HTML. It stays where it is and saves correctly, but a validator will flag it. Put the editable attribute on a block element if you want blocks here.`,
        this.element
      );
    }
    toggleFormat(tag, addMethod, removeMethod) {
      if (this.selectionHasFormat(tag)) return this._squire[removeMethod]();
      return this._squire[addMethod]();
    }
    toggleList(tag) {
      if (this.pathHas(tag)) return this._squire.removeList();
      return tag === "UL" ? this._squire.makeUnorderedList() : this._squire.makeOrderedList();
    }
    indent() {
      if (this.pathHas("UL") || this.pathHas("OL")) return this._squire.increaseListLevel();
      return this._squire.increaseQuoteLevel();
    }
    outdent() {
      if (this.pathHas("UL") || this.pathHas("OL")) return this._squire.decreaseListLevel();
      return this._squire.decreaseQuoteLevel();
    }
    setBlockType(tag) {
      const target = tag.toUpperCase();
      if (target === "BLOCKQUOTE") return this._squire.increaseQuoteLevel();
      return this._squire.modifyBlocks((fragment) => {
        const doc = this.element.ownerDocument;
        const output = doc.createDocumentFragment();
        Array.from(fragment.childNodes).forEach((node) => {
          if (node.nodeType !== 1) {
            output.appendChild(node);
            return;
          }
          if (node.nodeName === target) {
            output.appendChild(node);
            return;
          }
          const replacement = doc.createElement(target);
          while (node.firstChild) replacement.appendChild(node.firstChild);
          output.appendChild(replacement);
        });
        return output;
      });
    }
    openLinkDialog() {
      this.saveSelection();
      this.closeLinkDialog();
      this.linkPopover?.hide();
      const doc = this.element.ownerDocument;
      const existingLink = this.currentLinkElement();
      const existing = existingLink?.getAttribute("href") || "";
      const dialog = doc.createElement("form");
      const labelId = `richclay-link-label-${++dialogSeq}`;
      dialog.className = "richclay-dialog";
      dialog.setAttribute("role", "dialog");
      dialog.setAttribute("aria-modal", "true");
      dialog.setAttribute("aria-labelledby", labelId);
      dialog.setAttribute("data-richclay-dialog", "");
      markChrome(dialog);
      dialog.setAttribute("save-remove", "");
      dialog.innerHTML = `
      <div class="richclay-dialog-title" id="${labelId}">${existingLink ? "Edit link" : "Insert link"}</div>
      <label class="richclay-field">
        <span>URL</span>
        <input class="richclay-input" name="url" type="text" inputmode="url" autocomplete="url" placeholder="https://example.com">
      </label>
      <div class="richclay-dialog-actions">
        ${existingLink && !this.options.linkLabel ? '<button type="button" class="richclay-secondary" data-richclay-remove-link>Remove link</button>' : ""}
        <button type="button" class="richclay-secondary" data-richclay-cancel>Cancel</button>
        <button type="submit" class="richclay-primary">Apply</button>
      </div>
    `;
      const close = () => {
        this.closeLinkDialog();
        this.toolbar?.update();
        this.focus();
        this.updateLinkPopover();
      };
      const remove = () => {
        this.restoreSelection();
        this.removeLinkElement(this.currentLinkElement());
        close();
      };
      const cancel = () => {
        close();
        this.restoreSelection();
        this.updateLinkPopover();
      };
      dialog.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(dialog);
        const value = String(data.get("url") || "").trim();
        if (!value && existingLink) {
          remove();
          return;
        }
        const href = normalizeUrl(value);
        if (!href) {
          announce(this.liveRegion, "Enter a valid URL");
          return;
        }
        this.restoreSelection();
        const anchor = this.options.linkLabel ? null : this.currentLinkElement();
        if (this.options.linkLabel) {
          const range = this.element.ownerDocument.createRange();
          range.selectNodeContents(this.element);
          this._squire.setSelection(range);
        }
        if (anchor) {
          this.selectElement(anchor);
          this._squire.saveUndoState();
          anchor.setAttribute("href", href);
        } else {
          this._squire.makeLink(href);
        }
        announce(this.liveRegion, "Link applied");
        close();
      });
      dialog.querySelector("[data-richclay-remove-link]")?.addEventListener("click", remove);
      dialog.querySelector("[data-richclay-cancel]").addEventListener("click", cancel);
      dialog.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          cancel();
        } else if (event.key === "Tab") {
          trapTab(event, dialog);
        }
      });
      const host = this.element.closest("dialog") || doc.body;
      const layered = typeof dialog.showPopover === "function";
      if (layered) dialog.setAttribute("popover", "manual");
      pin(dialog, "position", "fixed");
      pin(dialog, "inset", "0px auto auto 0px");
      pin(dialog, "margin", "0");
      pin(dialog, "overflow", "visible");
      host.appendChild(dialog);
      if (layered) dialog.showPopover();
      this.dialog = dialog;
      const win = doc.defaultView || globalThis;
      const reposition = () => this.positionLinkDialog();
      const dismiss = (event) => {
        if (!dialog.contains(event.target)) this.closeLinkDialog();
      };
      const resizeObserver = typeof win.ResizeObserver === "function" ? new win.ResizeObserver(reposition) : null;
      resizeObserver?.observe(dialog);
      doc.addEventListener("scroll", reposition, { capture: true, passive: true });
      win.addEventListener("resize", reposition, { passive: true });
      win.visualViewport?.addEventListener("resize", reposition, { passive: true });
      win.visualViewport?.addEventListener("scroll", reposition, { passive: true });
      doc.addEventListener("pointerdown", dismiss, true);
      this.dialogCleanup = () => {
        resizeObserver?.disconnect();
        doc.removeEventListener("scroll", reposition, { capture: true });
        win.removeEventListener("resize", reposition);
        win.visualViewport?.removeEventListener("resize", reposition);
        win.visualViewport?.removeEventListener("scroll", reposition);
        doc.removeEventListener("pointerdown", dismiss, true);
      };
      this.positionLinkDialog();
      const input = dialog.querySelector("input");
      input.value = existing;
      input.focus();
      input.select();
      return KEEP_FOCUS;
    }
    // Unwraps one link and keeps its text, as one undo step. The link form's Remove and the
    // link popover's Remove are this same call.
    removeLinkElement(anchor) {
      if (!anchor || !this.element.contains(anchor)) return false;
      this.selectElement(anchor);
      this._squire.removeLink();
      announce(this.liveRegion, "Link removed");
      return true;
    }
    updateLinkPopover() {
      if (this.options.linkPopover === false || this.options.readOnly || !this._squire) return;
      if (!this.linkPopover) {
        if (this.dialog || !this.currentLinkElement()) return;
        this.linkPopover = new LinkPopover(this);
      }
      this.linkPopover.update();
    }
    currentLinkElement() {
      const range = getSquireSelection(this._squire);
      if (!range || !this.element.contains(range.commonAncestorContainer)) return null;
      if (range.collapsed) {
        const node = range.startContainer;
        const anchor = (node.nodeType === 1 ? node : node.parentElement)?.closest("a[href]");
        return anchor && anchor !== this.element && this.element.contains(anchor) ? anchor : null;
      }
      for (const anchor of this.element.querySelectorAll("a[href]")) {
        const contents = anchor.ownerDocument.createRange();
        let first = anchor;
        let last = anchor;
        while (first.firstChild) first = first.firstChild;
        while (last.lastChild) last = last.lastChild;
        contents.setStart(first, 0);
        contents.setEnd(last, last.nodeType === 3 ? last.length : last.childNodes.length);
        if (range.compareBoundaryPoints(range.END_TO_START, contents) < 0 && range.compareBoundaryPoints(range.START_TO_END, contents) > 0) return anchor;
      }
      return null;
    }
    currentLinkHref() {
      const anchor = this.currentLinkElement();
      return anchor ? anchor.getAttribute("href") || "" : "";
    }
    selectElement(node) {
      const range = node.ownerDocument.createRange();
      range.selectNode(node);
      this._squire.setSelection(range);
      this.saveSelection();
      return range;
    }
    // The selected text, or the caret, as the dialog's anchor. A saved range keeps
    // tracking the text it covers, so this stays right as the page scrolls.
    linkAnchorRect() {
      const range = this.savedSelection;
      if (typeof range?.getClientRects === "function") {
        const rects = [...range.getClientRects()].filter((rect) => rect.width || rect.height);
        if (rects.length) return range.collapsed ? rects[0] : range.getBoundingClientRect();
      }
      const button = this.toolbar?.items.find((item) => item.def.id === "link")?.button;
      return (button || this.toolbar?.root || this.element).getBoundingClientRect();
    }
    positionLinkDialog() {
      const dialog = this.dialog;
      if (!dialog) return;
      const win = dialog.ownerDocument.defaultView || globalThis;
      const placement = placePopover({
        anchor: this.linkAnchorRect(),
        box: { width: dialog.offsetWidth || 0, height: dialog.offsetHeight || 0 },
        viewport: {
          width: win.visualViewport?.width ?? win.innerWidth,
          height: win.visualViewport?.height ?? win.innerHeight
        }
      });
      dialog.setAttribute("data-richclay-side", placement.side);
      dialog.style.setProperty("--richclay-dialog-arrow", `${Math.round(placement.arrow)}px`);
      pin(dialog, "transform", `translate(${Math.round(placement.x)}px, ${Math.round(placement.y)}px)`);
    }
    closeLinkDialog() {
      this.dialogCleanup?.();
      this.dialogCleanup = null;
      this.dialog?.remove();
      this.dialog = null;
    }
    ensureMarker() {
      if (!isMountable(this.element)) {
        this.element.setAttribute("data-richclay-runtime-marker", "true");
        this.element.setAttribute("data-richclay", "");
      }
    }
    setupEditorAttributes() {
      this.element.classList.add(
        this.options.inline ? "richclay-inline" : "richclay-editor",
        "richclay-active"
      );
      this.element.setAttribute("data-richclay-active", "true");
      if (!this.element.hasAttribute("data-richclay-runtime-contenteditable")) {
        const original = this.element.getAttribute("contenteditable");
        if (original === null) {
          this.element.setAttribute("data-richclay-runtime-contenteditable", "true");
        } else if (original !== "true" && original !== "") {
          this.element.setAttribute("data-richclay-runtime-contenteditable", original);
        }
      }
      this.element.setAttribute("contenteditable", "true");
      if (!this.element.hasAttribute("role")) {
        setRuntimeAttribute(this.element, "role", "textbox", "data-richclay-runtime-role");
      }
      if (!this.element.hasAttribute("aria-multiline")) {
        setRuntimeAttribute(
          this.element,
          "aria-multiline",
          this.options.singleLine ? "false" : "true",
          "data-richclay-runtime-aria-multiline"
        );
      }
      if (!this.element.hasAttribute("no-undo")) {
        setRuntimeAttribute(this.element, "no-undo", "", "data-richclay-runtime-no-undo");
      }
      if (this.options.placeholder) {
        this.element.setAttribute("data-richclay-placeholder", this.options.placeholder);
        if (!this.description) {
          this.description = this.element.ownerDocument.createElement("div");
          this.description.id = `richclay-placeholder-${++dialogSeq}`;
          this.description.className = "richclay-sr-only";
          this.description.textContent = this.options.placeholder;
          this.description.setAttribute("data-richclay-live", "");
          markChrome(this.description);
        }
        if (!this.description.isConnected) {
          this.element.insertAdjacentElement("afterend", this.description);
        }
        connectDescription(this.element, this.description);
      }
      this.element.addEventListener("focus", this._onFocus);
      this.element.addEventListener("blur", this._onBlur);
      this.element.addEventListener("click", this._onLinkActivation, true);
      this.element.addEventListener("auxclick", this._onLinkActivation, true);
      this.element.addEventListener("clay:external-write", this._onExternalWrite);
    }
    cleanupEditorAttributes() {
      removeRuntimeState(this.element, "destroy");
      this.element.removeEventListener("focus", this._onFocus);
      this.element.removeEventListener("blur", this._onBlur);
      this.element.removeEventListener("click", this._onLinkActivation, true);
      this.element.removeEventListener("auxclick", this._onLinkActivation, true);
      this.element.removeEventListener("clay:external-write", this._onExternalWrite);
    }
    // A link label holds one link around all of its text, the shape its store reads back
    // as text and address. Squire puts a space typed at a link's end, and a paste, outside
    // the link (or splits it), and typing over the whole label deletes it; each of those
    // is folded back into the one link, with the caret kept at the same character.
    keepOneLink() {
      const element = this.element;
      const doc = element.ownerDocument;
      const first = element.querySelector("a[href]");
      const href = first?.getAttribute("href") ?? this._labelHref;
      if (!href) return;
      this._labelHref = href;
      const text = element.textContent.replace(/\u200B/g, "").replace(/\s*[\r\n]+\s*/g, " ");
      const only = element.childNodes.length === 1 && element.firstChild === first ? first : null;
      const clean = only && [...only.childNodes].every((node) => node.nodeType === 3) && !only.textContent.includes("\u200B");
      if (clean || !text) return;
      const selection = this._squire.getSelection();
      let caret = text.length;
      if (selection && element.contains(selection.startContainer)) {
        const before = doc.createRange();
        before.selectNodeContents(element);
        before.setEnd(selection.startContainer, selection.startOffset);
        caret = before.toString().replace(/\u200B/g, "").replace(/\s*[\r\n]+\s*/g, " ").length;
      }
      this._squire.modifyDocument(() => {
        const anchor = first ?? doc.createElement("a");
        if (!first) anchor.setAttribute("href", href);
        anchor.replaceChildren(doc.createTextNode(text));
        element.replaceChildren(anchor);
        const range = doc.createRange();
        range.setStart(anchor.firstChild, Math.min(caret, text.length));
        range.collapse(true);
        this._squire.setSelection(range);
      });
    }
    bindSquire() {
      const input = () => {
        this._squireHTML = this.element.innerHTML;
        this.saveSelection();
        this.updatePlaceholder();
        this.options.onChange?.(this.getHTML());
        this.toolbar?.update();
        this.updateLinkPopover();
      };
      const pathChange = (event) => {
        this.path = event.detail?.path || this._squire.getPath?.() || "";
        this.saveSelection();
        this.toolbar?.update();
        this.updateLinkPopover();
      };
      const selection = () => {
        this.saveSelection();
        this.toolbar?.update();
        if (this.options.toolbarOnSelect) this.updateFloatVisibility();
        this.updateLinkPopover();
      };
      const undoState = () => this.toolbar?.update();
      [
        ["input", input],
        ["pathChange", pathChange],
        ["select", selection],
        ["cursor", selection],
        ["undoStateChange", undoState]
      ].forEach(([type, listener]) => {
        this._squire.addEventListener(type, listener);
        this._squireListeners.push([type, listener]);
      });
    }
    renderToolbar() {
      if (!this.active || this.options.readOnly) return;
      if (this.options.inline) {
        if (this.float) {
          this.teardownFloatingToolbar();
          this.ensureFloatingToolbar();
        }
        return;
      }
      this.toolbar?.destroy();
      this.toolbar = null;
      const controls = this.resolveToolbarControls(this.options.toolbar);
      if (!controls.length) return;
      this.toolbar = new Toolbar(this, controls, {
        toolbarContainer: this.options.toolbarContainer
      });
    }
    ensureFloatingToolbar() {
      if (this.float || !this.active || this.options.readOnly) return;
      const controls = this.resolveToolbarControls(this.options.toolbar);
      if (!controls.length) return;
      this.float = new FloatingToolbar(this, controls);
      this._onFloatFocusOut = (event) => this.scheduleFloatTeardown(event);
      this.float.root.addEventListener("focusout", this._onFloatFocusOut);
      this._onDocPointerDown = (event) => {
        if (this.ownsFocusTarget(event.target)) return;
        const doc = this.element.ownerDocument;
        if (doc.activeElement && this.ownsFocusTarget(doc.activeElement)) {
          doc.activeElement.blur?.();
        }
        this.teardownFloatingToolbar();
      };
      this.element.ownerDocument.addEventListener("pointerdown", this._onDocPointerDown, true);
      this.toolbar = this.float.toolbar;
      this.toolbar.update();
      if (this.options.toolbarOnSelect) this.updateFloatVisibility();
    }
    teardownFloatingToolbar() {
      if (!this.float) return;
      if (this._onFloatFocusOut) {
        this.float.root.removeEventListener("focusout", this._onFloatFocusOut);
        this._onFloatFocusOut = null;
      }
      if (this._onDocPointerDown) {
        this.element.ownerDocument.removeEventListener("pointerdown", this._onDocPointerDown, true);
        this._onDocPointerDown = null;
      }
      this.float.destroy();
      this.float = null;
      this.toolbar = null;
    }
    scheduleFloatTeardown(event) {
      const next = event?.relatedTarget;
      if (next && this.ownsFocusTarget(next)) return;
      const doc = this.element.ownerDocument;
      const win = doc.defaultView || globalThis;
      win.setTimeout(() => {
        const active = doc.activeElement;
        if (active && this.ownsFocusTarget(active)) return;
        this.teardownFloatingToolbar();
      }, 0);
    }
    ownsFocusTarget(node) {
      return node === this.element || this.element.contains(node) || Boolean(this.float?.root.contains(node)) || Boolean(this.dialog?.contains(node)) || Boolean(this.linkPopover?.root?.contains(node));
    }
    updateFloatVisibility() {
      if (!this.float) return;
      const range = this.savedSelection;
      this.float.setVisible(Boolean(range && !range.collapsed));
    }
    resolveToolbarControls(toolbar) {
      if (toolbar === false || toolbar === null || toolbar === "none") return [];
      const requested = Array.isArray(toolbar) ? toolbar : presets[toolbar] || presets.standard;
      return requested.map((item) => {
        if (typeof item === "string") {
          const def = this.registry.get(item);
          if (!def) throw new Error(`Unknown RichClay toolbar control: ${item}`);
          return def;
        }
        if (item?.type === "separator") return item;
        validateButton(item);
        return item;
      });
    }
    installShortcuts() {
      const seen = /* @__PURE__ */ new Set();
      const registryDefs = [...this.registry.values()].filter(
        (def) => (!this.options.singleLine || presets.inline.includes(def.id)) && (!this.options.linkLabel || LINK_LABEL_CONTROLS.includes(def.id))
      );
      const defs = [...this.resolveToolbarControls(this.options.toolbar), ...registryDefs];
      defs.forEach((def) => {
        if (def.type === "menu" || def.type === "separator") return;
        if (!def.shortcut || !def.id || seen.has(def.id)) return;
        if (def.isDisabled?.(this)) {
          const masked = shortcutKey(def.shortcut, this.window);
          this._squire.setKeyHandler(masked, null);
          this._shortcutKeys.push(masked);
          return;
        }
        seen.add(def.id);
        const key = shortcutKey(def.shortcut, this.window);
        this._squire.setKeyHandler(key, (squire, event) => {
          event.preventDefault();
          this.runControl(def);
        });
        this._shortcutKeys.push(key);
      });
      if (!isApplePlatform(this.window)) {
        const redo = defs.find((def) => def.id === "redo" && def.shortcut);
        if (redo && !redo.isDisabled?.(this)) {
          this._squire.setKeyHandler("Ctrl-y", (squire, event) => {
            event.preventDefault();
            this.runControl(redo);
          });
          this._shortcutKeys.push("Ctrl-y");
        }
      }
    }
    // Formatting typed into a link label would be dropped by the next save of the shared
    // store, which keeps only its text and address. Squire binds bold, italic and underline
    // on its own prototype, so each key is answered with preventDefault: a null handler
    // would hand it to the browser's own contenteditable formatting instead.
    maskFormattingShortcuts() {
      for (const def of this.registry.values()) {
        if (!def.shortcut || LINK_LABEL_CONTROLS.includes(def.id)) continue;
        const key = shortcutKey(def.shortcut, this.window);
        this._squire.setKeyHandler(key, (squire, event) => event.preventDefault());
        this._shortcutKeys.push(key);
      }
    }
    // macOS sends Ctrl+D and Ctrl+H to the browser's own forward/backward delete,
    // which merges two blocks by wrapping the moved text in a computed-style
    // <span> — permanent junk in an editor whose DOM is the saved document. Point
    // them at Squire's own handlers so they behave exactly like Delete and
    // Backspace. Reads Squire's key handler table; no-ops for other engines.
    // Squire binds Code to the platform modifier itself, on _keyHandlers' prototype,
    // so dropping richclay's own shortcut is not enough to retire it. An own
    // property of null shadows the inherited handler and the key falls through.
    maskSquireCodeShortcut() {
      const key = `${isApplePlatform(this.window) ? "Meta" : "Ctrl"}-d`;
      this._squire.setKeyHandler(key, null);
      this._shortcutKeys.push(key);
    }
    // Squire binds these on _keyHandlers' prototype, and richclay has no definition
    // carrying some of them, so filtering richclay's own shortcuts cannot reach
    // them: Mod+] kept building a <blockquote> in a <p editable> through every
    // round. An own property of null shadows the inherited handler and the key
    // falls through. The prefix must match the one Squire computed, which is why
    // the test harness has to agree about the platform.
    maskSquireBlockShortcuts() {
      if (!this.blocksStayOut()) return;
      const mod = isApplePlatform(this.window) ? "Meta" : "Ctrl";
      [`${mod}-]`, `${mod}-[`, `${mod}-Shift-8`, `${mod}-Shift-9`].forEach((key) => {
        this._squire.setKeyHandler(key, null);
        this._shortcutKeys.push(key);
      });
    }
    // Squire's toggleCode() makes a block <pre> when the selection is collapsed,
    // which inside a heading or a paragraph root means a code block where no block
    // can legally go. Those regions get inline <code> instead.
    toggleCode() {
      if (!this.blocksStayOut()) return this._squire.toggleCode();
      if (this.selectionHasFormat("CODE")) return this._squire.changeFormat(null, { tag: "CODE" });
      return this._squire.changeFormat({ tag: "CODE" }, null);
    }
    installAppleDeleteKeys() {
      if (!isApplePlatform(this.window)) return;
      const handlers = this._squire._keyHandlers;
      if (!handlers) return;
      [["Ctrl-d", "Delete"], ["Ctrl-h", "Backspace"]].forEach(([key, native]) => {
        if (typeof handlers[native] !== "function") return;
        this._squire.setKeyHandler(key, handlers[native]);
        this._shortcutKeys.push(key);
        this._appleDeleteKeys.add(key.slice("Ctrl-".length));
      });
    }
    installSingleLineGuards() {
      ["Enter", "Shift-Enter"].forEach((key) => {
        this._squire.setKeyHandler(key, (squire, event) => event.preventDefault());
        this._shortcutKeys.push(key);
      });
      this._onBeforeInput = (event) => {
        if (!this.element.contains(event.target)) return;
        const formats = this.options.linkLabel && event.inputType.startsWith("format");
        if (event.inputType === "insertParagraph" || event.inputType === "insertLineBreak" || formats) {
          event.preventDefault();
          event.stopPropagation();
        }
      };
      this.element.ownerDocument.addEventListener("beforeinput", this._onBeforeInput, true);
    }
    // The fidelity restore bypasses setHTML, so Squire's undo baseline is still
    // the empty document its constructor recorded; the first undo could wipe the
    // region. Rebase the stack on the restored content. This touches Squire
    // internals (property names survive its esbuild minify) and no-ops for other
    // engines, like the tests' FakeSquire.
    resetSquireUndoBaseline() {
      const squire = this._squire;
      if (!squire || !Array.isArray(squire._undoStack) || typeof squire.saveUndoState !== "function") {
        return;
      }
      this._squireHTML = this.element.innerHTML;
      squire._undoStack.length = 0;
      squire._undoStackLength = 0;
      squire._undoIndex = -1;
      squire._isInUndoState = false;
      squire.saveUndoState();
    }
    updatePlaceholder() {
      const view = createContentView(this.element, { capability: "history", inherit: false });
      const text = view.text().replace(/\u200B/g, "").trim();
      const hasMeaningfulElement = view.root.querySelector("img, video, audio, iframe, table");
      const isEmpty = !text && !hasMeaningfulElement;
      this.element.classList.toggle("richclay-empty", isEmpty);
    }
    announceControl(def) {
      if (!this.liveRegion) return;
      const label = def.ariaLabel || def.label;
      if (!label) return;
      if (typeof def.isActive === "function") {
        announce(this.liveRegion, `${label} ${def.isActive(this) ? "on" : "off"}`);
      } else {
        announce(this.liveRegion, `${label} applied`);
      }
    }
  };
  function resolveElements(selector) {
    if (typeof selector === "string") {
      return Array.from(document.querySelectorAll(selector));
    }
    if (selector?.nodeType === 1) return [selector];
    return Array.from(selector || []);
  }
  function matchAtBoundary(root, container, offset, first, selector) {
    let node = container;
    if (node === root) {
      const children = Array.from(root.childNodes).filter(isCaretHost);
      if (!children.length) return null;
      const index = first ? Math.min(offset, children.length - 1) : Math.min(Math.max(offset - 1, 0), children.length - 1);
      node = caretEdge(children[index], first);
    }
    const element = node?.nodeType === 1 ? node : node?.parentElement;
    const match = element?.closest?.(selector);
    return match && root.contains(match) && match !== root ? match : null;
  }
  function closestConflictingAncestor(element) {
    let node = element.parentElement;
    while (node) {
      if (instances.has(node) || isMountable(node)) return node;
      node = node.parentElement;
    }
    return null;
  }
  function isMountable(element) {
    return Boolean(element.matches?.(RICHCLAY_SELECTOR)) && isRichClayHost(element);
  }
  function conflictsWithExistingEditor(element) {
    const host = closestConflictingAncestor(element);
    const nested = Array.from(element.querySelectorAll?.(RICHCLAY_SELECTOR) || []).find(
      (node) => instances.has(node)
    );
    const other = host || nested;
    if (!other) return false;
    console.warn(
      "richclay: nested editable regions are not supported, so this one was skipped. Remove the editable attribute from either it or the other region.",
      element,
      other
    );
    return true;
  }
  function refuseUnsupportedRoot(element) {
    if (!isUnsupportedRootTag(element)) return false;
    console.warn(`richclay: ${unsupportedRootReason(element)} This region was skipped.`, element);
    return true;
  }
  function validateButton(def) {
    if (!def || !def.id) throw new Error("RichClay button definitions require an id.");
    if (def.type !== "menu" && typeof def.run !== "function") {
      throw new Error(`RichClay button "${def.id}" requires a run(editor) function.`);
    }
  }
  function shortcutKey(shortcut, win) {
    const parts = shortcut.split("+");
    const keyPart = parts[parts.length - 1];
    const modifiers = new Set(parts.slice(0, -1).map(normalizeModifier));
    if (modifiers.delete("Mod")) modifiers.add(isApplePlatform(win) ? "Meta" : "Ctrl");
    const key = keyPart.length === 1 ? modifiers.has("Shift") ? keyPart.toUpperCase() : keyPart.toLowerCase() : keyPart;
    const prefix = MODIFIER_ORDER.filter((modifier) => modifiers.has(modifier)).join("-");
    return `${prefix ? `${prefix}-` : ""}${key}`;
  }
  function normalizeModifier(modifier) {
    return modifier === "Cmd" ? "Meta" : modifier;
  }
  function trapTab(event, container) {
    const focusables = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = container.ownerDocument.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  // richclay.css
  var richclay_default = ":root {\n  --richclay-surface: #ffffff;\n  --richclay-surface-alt: #f6f7f9;\n  --richclay-text: #0b0e14;\n  --richclay-muted: #667085;\n  --richclay-border: #c9ced8;\n  --richclay-accent: #0f766e;\n  --richclay-accent-ink: #ffffff;\n  --richclay-focus: #2563eb;\n  --richclay-danger: #b42318;\n  --richclay-radius: 6px;\n  --richclay-control-size: 34px;\n  --richclay-shadow: 0 10px 24px rgb(15 23 42 / 0.16);\n  --richclay-dialog-arrow: 28px;\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --richclay-surface: #16181d;\n    --richclay-surface-alt: #22252c;\n    --richclay-text: #ffffff;\n    --richclay-muted: #a3aab8;\n    --richclay-border: #4a5260;\n    --richclay-accent: #2dd4bf;\n    --richclay-accent-ink: #05201d;\n    --richclay-focus: #93c5fd;\n    --richclay-shadow: 0 12px 28px rgb(0 0 0 / 0.35);\n  }\n}\n\n.richclay-toolbar {\n  align-items: center;\n  background: var(--richclay-surface-alt);\n  border: 1px solid var(--richclay-border);\n  border-radius: var(--richclay-radius);\n  color: var(--richclay-text);\n  display: flex;\n  flex-wrap: wrap;\n  gap: 2px;\n  margin-block: 0 6px;\n  padding: 4px;\n}\n\n/* Seamless card: in the default layout the toolbar sits directly above the\n   editor. Fuse them into a single bordered card with one divider \u2014 the\n   toolbar's bottom border \u2014 instead of two stacked, separated boxes. */\n.richclay-toolbar:has(+ .richclay-editor) {\n  margin-block-end: 0;\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: 0;\n}\n\n.richclay-toolbar + .richclay-editor {\n  border-top: 0;\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n}\n\n/* In a fused card, draw the focus ring inside the body so it never crosses\n   the toolbar divider. */\n.richclay-toolbar + .richclay-editor:focus-visible {\n  outline-offset: -3px;\n}\n\n.richclay-button {\n  align-items: center;\n  appearance: none;\n  background: transparent;\n  border: 1px solid transparent;\n  border-radius: 5px;\n  color: currentColor;\n  display: inline-flex;\n  height: var(--richclay-control-size);\n  justify-content: center;\n  margin: 0;\n  min-width: var(--richclay-control-size);\n  padding: 0;\n  position: relative;\n}\n\n.richclay-button:hover,\n.richclay-button[aria-expanded=\"true\"],\n.richclay-menu-item:hover {\n  background: var(--richclay-surface);\n  border-color: var(--richclay-border);\n}\n\n.richclay-button.is-active,\n.richclay-button[aria-pressed=\"true\"],\n.richclay-menu-item.is-active {\n  background: rgb(0 0 0 / 0.13);\n  border-color: rgb(0 0 0 / 0.22);\n  color: var(--richclay-text);\n  box-shadow: inset 0 1px 3px rgb(0 0 0 / 0.26);\n}\n\n.richclay-button:focus-visible,\n.richclay-menu-item:focus-visible,\n.richclay-editor:focus-visible,\n.richclay-input:focus-visible,\n.richclay-primary:focus-visible,\n.richclay-secondary:focus-visible {\n  outline: 3px solid var(--richclay-focus);\n  outline-offset: 2px;\n}\n\n.richclay-button:disabled {\n  color: var(--richclay-muted);\n  cursor: not-allowed;\n  opacity: 0.55;\n}\n\n.richclay-separator {\n  align-self: stretch;\n  background: var(--richclay-border);\n  display: inline-block;\n  margin: 5px 4px;\n  width: 1px;\n}\n\n.richclay-menu-wrap {\n  display: inline-flex;\n  position: relative;\n}\n\n.richclay-menu {\n  background: var(--richclay-surface);\n  border: 1px solid var(--richclay-border);\n  border-radius: var(--richclay-radius);\n  box-shadow: var(--richclay-shadow);\n  color: var(--richclay-text);\n  display: grid;\n  gap: 2px;\n  inset-block-start: calc(100% + 4px);\n  inset-inline-start: 0;\n  min-width: 160px;\n  padding: 4px;\n  position: absolute;\n  z-index: 1000;\n}\n\n.richclay-menu[hidden] {\n  display: none;\n}\n\n.richclay-menu-item {\n  align-items: center;\n  appearance: none;\n  background: transparent;\n  border: 1px solid transparent;\n  border-radius: 4px;\n  color: inherit;\n  display: flex;\n  font: inherit;\n  gap: 8px;\n  min-height: 32px;\n  padding: 5px 9px;\n  text-align: start;\n}\n\n.richclay-editor {\n  background: var(--richclay-surface);\n  border: 1px solid var(--richclay-border);\n  border-radius: var(--richclay-radius);\n  color: var(--richclay-text);\n  min-height: 9rem;\n  /* Break a long unbreakable string (e.g. a bare URL) in prose rather than let\n     it widen the editor. `anywhere` also lowers min-content, so the editor can't\n     grow even as a flex/grid item. Inert on the code <pre> (white-space: pre). */\n  overflow-wrap: anywhere;\n  padding: 12px;\n  position: relative;\n}\n\n.richclay-editor.richclay-empty::before {\n  color: var(--richclay-muted);\n  content: attr(data-richclay-placeholder);\n  inset-block-start: 12px;\n  inset-inline-start: 12px;\n  pointer-events: none;\n  position: absolute;\n}\n\n.richclay-editor p,\n.richclay-editor h1,\n.richclay-editor h2,\n.richclay-editor h3,\n.richclay-editor h4,\n.richclay-editor h5,\n.richclay-editor h6,\n.richclay-editor blockquote,\n.richclay-editor pre,\n.richclay-editor ul,\n.richclay-editor ol {\n  margin-block: 0 0.75em;\n}\n\n.richclay-editor > :last-child {\n  margin-block-end: 0;\n}\n\n/* Inline editors ([editable]) inherit the page's own styling. richclay adds\n   only a caret, a discoverability outline, and empty-state affordances. */\n.richclay-inline {\n  caret-color: currentColor;\n}\n\n.richclay-inline:hover {\n  outline: 1px dashed var(--richclay-border);\n  outline-offset: 2px;\n}\n\n.richclay-inline.richclay-focused,\n.richclay-inline:focus-visible {\n  outline: 2px dashed var(--richclay-focus);\n  outline-offset: 2px;\n}\n\n.richclay-inline.richclay-empty {\n  min-height: 1em;\n  min-width: 1ch;\n}\n\n.richclay-inline.richclay-empty::before {\n  color: var(--richclay-muted);\n  content: attr(data-richclay-placeholder);\n  pointer-events: none;\n}\n\n/* Floating toolbar shell for inline editors. Fixed-position and body-mounted:\n   fixed elements never create scrollbars, and body mounting avoids transformed\n   ancestors silently turning fixed into ancestor-relative. */\n.richclay-float {\n  left: 0;\n  position: fixed;\n  top: 0;\n  will-change: transform;\n  z-index: 99999;\n}\n\n.richclay-float .richclay-toolbar {\n  box-shadow: var(--richclay-shadow);\n  margin-block: 0;\n}\n\n/* Compact vertical rail for narrow margins. */\n.richclay-float-rail .richclay-toolbar {\n  --richclay-control-size: 28px;\n  flex-direction: column;\n  flex-wrap: nowrap;\n}\n\n.richclay-float-rail .richclay-toolbar svg {\n  height: 15px;\n  width: 15px;\n}\n\n.richclay-float-rail .richclay-separator {\n  align-self: stretch;\n  height: 1px;\n  margin: 4px 5px;\n  width: auto;\n}\n\n.richclay-float-rail .richclay-menu {\n  inset-block-start: 0;\n  inset-inline-start: calc(100% + 4px);\n}\n\n.richclay-editor blockquote {\n  border-inline-start: 3px solid var(--richclay-border);\n  color: var(--richclay-muted);\n  margin-inline: 0;\n  padding-inline-start: 12px;\n}\n\n/* Code blocks scroll horizontally inside the editor instead of widening it.\n   `width: 0; min-width: 100%` zeroes the pre's intrinsic-width contribution so a\n   long unbreakable line can't push an intrinsically-sized ancestor (flex/grid\n   item, inline-block, table cell) wider, while still filling the editor and\n   scrolling its own overflow. box-sizing keeps padding inside that 100%.\n   Containment applies to inline editors too: `white-space: pre` never wraps, so\n   without it one code block runs off the side of the page. Only the decoration\n   below stays card-scoped, since inline mode keeps the page's own typography. */\n.richclay-editor pre,\n.richclay-inline pre {\n  box-sizing: border-box;\n  min-width: 100%;\n  overflow: auto;\n  width: 0;\n}\n\n.richclay-editor pre {\n  background: var(--richclay-surface-alt);\n  border-radius: 4px;\n  padding: 10px;\n}\n\n.richclay-dialog {\n  background: var(--richclay-surface);\n  border: 1px solid var(--richclay-border);\n  border-radius: var(--richclay-radius);\n  box-shadow: var(--richclay-shadow);\n  color: var(--richclay-text);\n  display: grid;\n  gap: 10px;\n  box-sizing: border-box;\n  width: min(420px, calc(100vw - 16px));\n  z-index: 99999;\n  padding: 12px;\n}\n\n.richclay-dialog-title {\n  font-weight: 650;\n}\n\n.richclay-dialog.richclay-link-popover {\n  align-items: center;\n  display: flex;\n  gap: 6px;\n  max-width: min(420px, calc(100vw - 16px));\n  padding: 6px;\n  width: auto;\n}\n\n.richclay-link-address {\n  color: inherit;\n  font-size: 0.875rem;\n  max-width: 260px;\n  overflow: hidden;\n  padding: 0 6px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.richclay-link-popover .richclay-secondary {\n  min-height: 30px;\n  padding: 3px 9px;\n}\n\n.richclay-field {\n  display: grid;\n  gap: 4px;\n}\n\n.richclay-field span {\n  color: var(--richclay-muted);\n  font-size: 0.875rem;\n}\n\n.richclay-input {\n  background: var(--richclay-surface);\n  border: 1px solid var(--richclay-border);\n  border-radius: 4px;\n  color: var(--richclay-text);\n  font: inherit;\n  min-height: 36px;\n  padding: 6px 8px;\n}\n\n.richclay-dialog-actions {\n  display: flex;\n  gap: 8px;\n  justify-content: flex-end;\n}\n\n.richclay-dialog-actions [data-richclay-remove-link] {\n  margin-inline-end: auto;\n}\n\n.richclay-primary,\n.richclay-secondary {\n  appearance: none;\n  border: 1px solid var(--richclay-border);\n  border-radius: 4px;\n  font: inherit;\n  min-height: 34px;\n  padding: 5px 10px;\n}\n\n.richclay-primary {\n  background: var(--richclay-accent);\n  border-color: var(--richclay-accent);\n  color: var(--richclay-accent-ink);\n}\n\n.richclay-secondary {\n  background: var(--richclay-surface-alt);\n  color: var(--richclay-text);\n}\n\n.richclay-sr-only {\n  border: 0;\n  clip: rect(0 0 0 0);\n  clip-path: inset(50%);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  white-space: nowrap;\n  width: 1px;\n}\n\n@media (forced-colors: active) {\n  .richclay-toolbar,\n  .richclay-editor,\n  .richclay-menu,\n  .richclay-dialog,\n  .richclay-input {\n    border-color: CanvasText;\n  }\n\n  .richclay-button.is-active,\n  .richclay-button[aria-pressed=\"true\"],\n  .richclay-menu-item.is-active,\n  .richclay-primary {\n    background: Highlight;\n    color: HighlightText;\n  }\n\n  .richclay-button:focus-visible,\n  .richclay-menu-item:focus-visible,\n  .richclay-editor:focus-visible,\n  .richclay-input:focus-visible {\n    outline-color: Highlight;\n  }\n}\n";

  // src/browser-global.js
  setRichClayStyles(richclay_default);
  var browser_global_default = RichClay;
  return __toCommonJS(browser_global_exports);
})();
window.RichClay = RichClayBundle.default;
