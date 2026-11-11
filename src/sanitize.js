export const DEFAULT_SANITIZE_CONFIG = {
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
  ALLOWED_URI_REGEXP:
    /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input"],
  FORBID_ATTR: ["style", "srcset", "onerror", "onclick", "onload"]
};

export function createSanitizer(config = {}, doc = document) {
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

export function sanitizeHTML(html, config = {}, doc = document, purify = resolveDOMPurify(doc)) {
  const template = doc.createElement("template");
  template.innerHTML = purify.sanitize(String(html || ""), mergeConfig(config));
  normalizeLinks(template.content);
  return template.innerHTML;
}

export function sanitizeElement(element, config = {}, purify = resolveDOMPurify(element.ownerDocument)) {
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

export function sanitizeToDOMFragment(
  html,
  config = {},
  doc = document,
  purify = resolveDOMPurify(doc)
) {
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

const SAFE_URL_SCHEMES = new Set(["http", "https", "mailto", "tel"]);
const URL_CONTROL_CHARS = new RegExp("[\\u0000-\\u0020\\u007F-\\u009F]", "g");

export function isSafeUrl(url) {
  const stripped = String(url == null ? "" : url).replace(URL_CONTROL_CHARS, "");
  const scheme = (stripped.match(/^([a-z][a-z0-9+.\-]*):/i) || [])[1];
  return !scheme || SAFE_URL_SCHEMES.has(scheme.toLowerCase());
}

// A single file name with a document extension (`cv.html`, `paper.pdf`), or a path whose
// first segment has no dot (`writing/twelve-hours.html`), is a page or file of this site.
// `example.com` and `example.com/page.html` are hosts: a first segment with a dot that is
// not a known file name.
const SITE_FILE = /^[^\s/?#:]+\.(?:html?|pdf|txt|csv|json|xml|svg|png|jpe?g|gif|webp|docx?|xlsx?|pptx?|bib|tex|zip)(?:[?#]\S*)?$/i;
const SITE_PATH = /^[^\s/?#:.]+\/\S*$/;

export function normalizeUrl(value) {
  const raw = String(value == null ? "" : value).trim();
  if (!raw || !isSafeUrl(raw)) return "";
  if (/^(?:https?:|mailto:|tel:)/i.test(raw)) return raw;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) return `mailto:${raw}`;
  // Preserve fragment, query, root-relative, protocol-relative, and explicitly
  // relative links as-is; only a bare hostname gets an https:// scheme.
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
  root.querySelectorAll?.("a[href]").forEach(link => {
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

const INLINE_SANITIZE_EXTENSIONS = {
  ADD_TAGS: ["img"],
  ADD_ATTR: ["class", "id", "src", "alt", "width", "height"]
};

// Inline editors live inside real page markup, so paste/setHTML ingress keeps
// structural attributes and images that the card allowlist strips. Everything
// XSS-relevant (scripts, on* handlers, javascript: URLs) stays forbidden.
export function inlineSanitizeConfig(config = {}) {
  return {
    ...config,
    ADD_TAGS: [...new Set([...INLINE_SANITIZE_EXTENSIONS.ADD_TAGS, ...(config.ADD_TAGS || [])])],
    ADD_ATTR: [...new Set([...INLINE_SANITIZE_EXTENSIONS.ADD_ATTR, ...(config.ADD_ATTR || [])])],
    ALLOW_DATA_ATTR: config.ALLOW_DATA_ATTR ?? true
  };
}

const FLATTEN_SELECTOR =
  "p, div, h1, h2, h3, h4, h5, h6, blockquote, pre, ul, ol, li, figure, figcaption, table, thead, tbody, tr, td, th";

export function flattenFragmentToSingleLine(fragment) {
  const doc = fragment.ownerDocument || document;
  fragment.querySelectorAll?.("br").forEach(br => br.replaceWith(doc.createTextNode(" ")));
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
  const walker = doc.createTreeWalker(fragment, 4 /* NodeFilter.SHOW_TEXT */);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    node.nodeValue = node.nodeValue.replace(/\s+/g, " ");
  });
  const first = fragment.firstChild;
  if (first?.nodeType === 3) first.nodeValue = first.nodeValue.replace(/^\s+/, "");
  const last = fragment.lastChild;
  if (last?.nodeType === 3) last.nodeValue = last.nodeValue.replace(/\s+$/, "");
}
