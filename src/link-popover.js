import { markChrome } from "./hyperclay.js";
import { preservePointerSelection } from "./a11y.js";
import { isSafeUrl } from "./sanitize.js";
import { pin, placePopover } from "./toolbar-float.js";

// How long the bar outlives the caret leaving its link, so the pointer can reach it.
export const LINK_POPOVER_GRACE_MS = 300;

const shownAddress = href => href.replace(/^mailto:/i, "").replace(/^https?:\/\//i, "");

// Open, Edit and Remove for the link the caret is in. One per editor, mounted while a link
// is current and removed from the document otherwise, so an idle editor leaves nothing behind.
export class LinkPopover {
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
    if (editor.element.ownerDocument.hidden) return null;
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
      // A mail or phone link opens its app; everything else opens beside the editor.
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
    // A link label's store needs its address: the label keeps its link, and only Edit changes it.
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

    // Hosted and layered exactly as the link form is (openLinkDialog): inside the editor's
    // own <dialog> when it has one, and in the top layer where the browser supports it.
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
    const onKeydown = event => {
      if (event.key !== "Escape" || !this.root) return;
      event.preventDefault();
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
}
