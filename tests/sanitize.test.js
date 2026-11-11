import test from "node:test";
import assert from "node:assert/strict";
import { setupDom } from "./helpers.js";
import {
  sanitizeHTML,
  sanitizeElement,
  sanitizeToDOMFragment,
  normalizeUrl,
  isSafeUrl
} from "../src/sanitize.js";

test("sanitizeHTML strips hostile markup and URLs", () => {
  setupDom();
  const clean = sanitizeHTML(`
    <script>alert(1)</script>
    <img src=x onerror=alert(1)>
    <a href="javascript:alert(1)" onclick="alert(1)">bad</a>
    <p onclick="alert(1)">ok</p>
  `);

  assert.equal(clean.includes("<script"), false);
  assert.equal(clean.includes("<img"), false);
  assert.equal(clean.includes("onclick"), false);
  assert.equal(clean.includes("javascript:"), false);
  assert.match(clean, /<a>bad<\/a>/);
  assert.match(clean, /<p>ok<\/p>/);
});

test("sanitizeElement preserves the editor root marker while cleaning children", () => {
  setupDom('<!doctype html><html><body><div data-richclay><p onclick="x()">Hi</p></div></body></html>');
  const element = document.querySelector("[data-richclay]");

  sanitizeElement(element);

  assert.equal(element.hasAttribute("data-richclay"), true);
  assert.equal(element.querySelector("p").hasAttribute("onclick"), false);
  assert.equal(element.innerHTML, "<p>Hi</p>");
});

test("normalizeUrl rejects dangerous schemes and obfuscation, keeps safe URLs", () => {
  // dangerous schemes are rejected outright (the link command aborts on "")
  assert.equal(normalizeUrl("javascript:alert(1)"), "");
  assert.equal(normalizeUrl("data:text/html,<script>x</script>"), "");
  assert.equal(normalizeUrl("vbscript:msgbox"), "");
  // control-character obfuscation of a scheme is still rejected
  assert.equal(normalizeUrl("java\tscript:alert(1)"), "");
  assert.equal(normalizeUrl("java\nscript:alert(1)"), "");
  // safe schemes pass through untouched
  assert.equal(normalizeUrl("https://example.com"), "https://example.com");
  assert.equal(normalizeUrl("mailto:a@b.com"), "mailto:a@b.com");
  assert.equal(normalizeUrl("tel:+15551234"), "tel:+15551234");
  // bare host gets https, bare email becomes mailto
  assert.equal(normalizeUrl("example.com/path"), "https://example.com/path");
  assert.equal(normalizeUrl("a@b.com"), "mailto:a@b.com");
  assert.equal(normalizeUrl("   "), "");
  // in-page, root-relative, protocol-relative, and explicit-relative links are
  // preserved verbatim instead of being forced under https://
  assert.equal(normalizeUrl("#section"), "#section");
  assert.equal(normalizeUrl("?q=1"), "?q=1");
  assert.equal(normalizeUrl("/about"), "/about");
  assert.equal(normalizeUrl("//cdn.example.com/x"), "//cdn.example.com/x");
  assert.equal(normalizeUrl("./page"), "./page");
  assert.equal(normalizeUrl("../up"), "../up");
});

test("normalizeUrl keeps a site's own files and paths relative", () => {
  const table = [
    ["cv.html", "cv.html"],
    ["CV.HTML", "CV.HTML"],
    ["paper.pdf", "paper.pdf"],
    ["cv.html#teaching", "cv.html#teaching"],
    ["writing/twelve-hours.html", "writing/twelve-hours.html"],
    ["pdfs/okafor-2024.pdf", "pdfs/okafor-2024.pdf"],
    ["example.com", "https://example.com"],
    ["example.com/page.html", "https://example.com/page.html"],
    ["www.example.org/cv.html", "https://www.example.org/cv.html"],
    ["example", "https://example"],
    ["a@b.org", "mailto:a@b.org"],
    ["#top", "#top"],
    ["../x.html", "../x.html"],
    ["/about", "/about"],
    ["my file.html", "https://my file.html"],
  ];
  for (const [typed, expected] of table) assert.equal(normalizeUrl(typed), expected, typed);
});

test("isSafeUrl allows scheme-less and safe-scheme URLs, blocks the rest", () => {
  assert.equal(isSafeUrl("/relative/path"), true);
  assert.equal(isSafeUrl("https://x.com"), true);
  assert.equal(isSafeUrl("javascript:x"), false);
  assert.equal(isSafeUrl("data:x"), false);
});

test("external target=_blank links gain rel=noopener noreferrer", () => {
  setupDom();
  const clean = sanitizeHTML('<a href="https://example.com" target="_blank">out</a>');

  assert.match(clean, /href="https:\/\/example\.com"/);
  assert.match(clean, /target="_blank"/);
  // Prevents reverse-tabnabbing on links that open a new tab.
  assert.match(clean, /rel="noopener noreferrer"/);
});

test("additive ADD_TAGS widens the allowlist while keeping core protections", () => {
  setupDom();
  // <mark> is not in the strict default allowlist, so its tag is dropped.
  assert.equal(sanitizeHTML("<mark>hi</mark>").includes("<mark>"), false);

  const widened = sanitizeHTML('<mark>hi</mark><script>bad()</script>', { ADD_TAGS: ["mark"] });
  assert.match(widened, /<mark>hi<\/mark>/);
  // Widening one tag must not reopen script execution.
  assert.equal(widened.includes("<script"), false);
});

test("sanitizeToDOMFragment returns a cleaned document fragment for the paste path", () => {
  setupDom();
  const fragment = sanitizeToDOMFragment('<p>ok</p><script>bad()</script>', {}, document);

  assert.equal(fragment.nodeType, 11);
  assert.equal(fragment.querySelector("p") !== null, true);
  assert.equal(fragment.querySelector("script"), null);
});
