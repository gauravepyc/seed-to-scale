import { CONFIG } from "./config";

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function clone(value) {
  if (Array.isArray(value)) return value.map(clone);
  if (isObject(value)) {
    const out = {};
    Object.keys(value).forEach((key) => {
      out[key] = clone(value[key]);
    });
    return out;
  }
  return value;
}

// Empty values are skipped, not written. An unfilled Webflow / CMS field then
// falls back to the value baked into config.js instead of blanking the page.
function isEmpty(value) {
  if (value === undefined || value === null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (isObject(value)) return Object.keys(value).every((key) => isEmpty(value[key]));
  return false;
}

function merge(base, patch) {
  if (!isObject(patch)) return isEmpty(patch) ? clone(base) : clone(patch);
  const out = isObject(base) ? clone(base) : {};
  Object.keys(patch).forEach((key) => {
    const value = patch[key];
    if (isEmpty(value)) return;
    out[key] = isObject(value) ? merge(out[key], value) : clone(value);
  });
  return out;
}

// "Harness | Engineering" and "Harness\nEngineering" both mean two title lines.
export function toLines(value) {
  if (Array.isArray(value)) return value.map((line) => String(line).trim()).filter(Boolean);
  return String(value ?? "")
    .split(/\r?\n|\|/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function normalize(override) {
  if (!isObject(override)) return null;
  const out = clone(override);
  if (out.cover?.title) out.cover.title = toLines(out.cover.title);
  if (isObject(out.variants)) {
    Object.keys(out.variants).forEach((key) => {
      const variant = out.variants[key];
      if (variant?.title) variant.title = toLines(variant.title);
    });
  }
  return out;
}

/**
 * Base content for a variant, with an optional override layered on top.
 *
 * `cover` fields (number / badge / stamp / title) are routed to the variant the
 * canvas actually draws, so the same override shape works for every variant.
 */
export function resolveBookContent(override, variant = "harness") {
  const base = clone(CONFIG);
  base.variants = base.variants || {};

  const variantPages = base.variants[variant]?.pages;
  if (variantPages?.length) base.pages = variantPages;

  const patch = normalize(override);
  if (!patch) return base;

  const content = merge(base, patch);
  content.variants = content.variants || {};

  if (variant !== "harness" && isObject(patch.cover)) {
    content.variants[variant] = merge(content.variants[variant], patch.cover);
  }
  if (patch.pages?.length) {
    // Pages live at the top level; clear the variant copy so it cannot win.
    if (content.variants[variant]) delete content.variants[variant].pages;
  }
  return content;
}
