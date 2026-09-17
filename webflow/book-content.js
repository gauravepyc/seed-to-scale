/**
 * Reads book copy out of the Webflow page.
 *
 * Priority, lowest first:
 *   config.js  <  window.site.bookContent  <  [data-book-content] block
 *              <  [data-book-json] script  <  attributes on [data-book]
 *
 * Every field is optional. Anything left out keeps the value from config.js.
 */

const ATTRS = [
  ["data-book-series", ["series"]],
  ["data-book-author", ["author"]],
  ["data-book-number", ["cover", "number"]],
  ["data-book-badge", ["cover", "badge"]],
  ["data-book-stamp", ["cover", "stamp"]],
  ["data-book-title", ["cover", "title"]],
  ["data-book-back-title", ["back", "title"]],
  ["data-book-back-credit", ["back", "credit"]],
];

const LAYOUTS = ["intro", "index", "sections", "article"];

function text(el) {
  return el ? el.textContent.replace(/\s+/g, " ").trim() : "";
}

function textLines(el) {
  if (!el) return [];
  const blocks = Array.from(el.children).filter((child) => text(child));
  if (blocks.length) return blocks.map(text);
  return el.textContent
    .split(/\r?\n|\|/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function put(target, path, value) {
  if (value === "" || value === undefined || value === null) return;
  let node = target;
  for (let i = 0; i < path.length - 1; i++) {
    node[path[i]] = node[path[i]] || {};
    node = node[path[i]];
  }
  node[path[path.length - 1]] = value;
}

// Only the closest page owns a node, so nested collection lists stay separate.
function ownedBy(page, el, selector) {
  return el.closest(selector) === page;
}

function readSection(el) {
  return {
    number: text(el.querySelector("[data-book-section-number]")),
    heading: text(el.querySelector("[data-book-section-heading]")),
    body: text(el.querySelector("[data-book-section-body]")),
  };
}

function readPage(el) {
  const items = Array.from(el.querySelectorAll("[data-book-item]"))
    .filter((node) => ownedBy(el, node, "[data-book-page]"))
    .map(text)
    .filter(Boolean);

  const sections = Array.from(el.querySelectorAll("[data-book-section]"))
    .filter((node) => ownedBy(el, node, "[data-book-page]"))
    .map(readSection)
    .filter((section) => section.heading || section.body);

  const declared = (el.getAttribute("data-book-page") || el.getAttribute("data-book-layout") || "")
    .trim()
    .toLowerCase();
  const layout = LAYOUTS.includes(declared)
    ? declared
    : sections.length
      ? "sections"
      : items.length
        ? "index"
        : "article";

  const page = { layout };
  const kicker = text(el.querySelector("[data-book-kicker]"));
  const heading = text(el.querySelector("[data-book-heading]"));
  const body = text(el.querySelector("[data-book-body]"));
  if (kicker) page.kicker = kicker;
  if (heading) page.heading = heading;
  if (body) page.body = body;
  if (items.length) page.items = items;
  if (sections.length) page.sections = sections;
  if (el.hasAttribute("data-book-black")) {
    page.black = el.getAttribute("data-book-black") !== "false";
  }
  return page;
}

function readBlock(root) {
  if (!root) return null;
  const pick = (selector) => text(root.querySelector(selector));
  const content = {};

  put(content, ["series"], pick("[data-book-series]"));
  put(content, ["author"], pick("[data-book-author]"));
  put(content, ["cover", "number"], pick("[data-book-cover-number]"));
  put(content, ["cover", "badge"], pick("[data-book-cover-badge]"));
  put(content, ["cover", "stamp"], pick("[data-book-cover-stamp]"));
  put(content, ["back", "title"], pick("[data-book-back-title]"));
  put(content, ["back", "credit"], pick("[data-book-back-credit]"));

  const title = textLines(root.querySelector("[data-book-cover-title]"));
  if (title.length) put(content, ["cover", "title"], title);

  const pages = Array.from(root.querySelectorAll("[data-book-page]"))
    .filter((el) => !el.parentElement?.closest("[data-book-page]"))
    .map(readPage);
  if (pages.length) content.pages = pages;

  return content;
}

function readJson(root) {
  const script = root?.matches?.("[data-book-json]")
    ? root
    : root?.querySelector?.("[data-book-json]");
  if (!script) return null;
  try {
    return JSON.parse(script.textContent);
  } catch (error) {
    console.warn("[book] data-book-json is not valid JSON", error);
    return null;
  }
}

function readAttrs(canvas) {
  const content = {};
  ATTRS.forEach(([attr, path]) => {
    const value = (canvas.getAttribute(attr) || "").trim();
    if (!value) return;
    put(content, path, value);
  });
  return content;
}

function findBlock(canvas, wrap, variant) {
  const selector = canvas.getAttribute("data-book-content");
  if (selector) {
    const target = document.querySelector(selector);
    if (target) return target;
    console.warn(`[book] no element matches data-book-content="${selector}"`);
  }

  const forVariant = (nodes) =>
    nodes.find((node) => (node.getAttribute("data-book-for") || "") === variant) ||
    nodes.find((node) => !node.getAttribute("data-book-for")) ||
    null;

  const inWrap = wrap.querySelector("[data-book-content]");
  if (inWrap) return inWrap;

  const scope =
    canvas.closest("[data-library-card]") ||
    canvas.closest("[data-featured-scope]") ||
    canvas.closest("[data-featured-stage]") ||
    canvas.closest("section");
  if (scope) {
    const found = forVariant(Array.from(scope.querySelectorAll("[data-book-content]")));
    if (found) return found;
  }

  // Page-wide fallback: safe when the block names its variant, or there is one book.
  const all = Array.from(document.querySelectorAll("[data-book-content]"));
  if (!all.length) return null;
  const tagged = all.find((node) => (node.getAttribute("data-book-for") || "") === variant);
  if (tagged) return tagged;
  return document.querySelectorAll("[data-book]").length === 1 ? all[0] : null;
}

function globalContent(variant) {
  const global = window.site?.bookContent;
  if (!global || typeof global !== "object") return null;
  const scoped = global[variant];
  if (scoped && typeof scoped === "object") return { ...global, ...scoped };
  return global;
}

function stack(...sources) {
  const out = {};
  sources.filter(Boolean).forEach((source) => {
    Object.keys(source).forEach((key) => {
      const value = source[key];
      if (value === undefined) return;
      if (value && typeof value === "object" && !Array.isArray(value)) {
        out[key] = { ...(out[key] || {}), ...value };
      } else {
        out[key] = value;
      }
    });
  });
  return out;
}

/** Collect every override the page declares for this canvas. */
export function readBookContent(canvas, wrap, variant = "harness") {
  const block = findBlock(canvas, wrap, variant);
  if (block && !block.hasAttribute("data-book-content-visible")) {
    block.style.display = "none";
  }
  return stack(
    globalContent(variant),
    readBlock(block),
    readJson(block) || readJson(document),
    readAttrs(canvas)
  );
}
