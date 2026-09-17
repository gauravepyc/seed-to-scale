import {
  CanvasTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  SRGBColorSpace,
} from "three";
import { CONFIG } from "./config";

const CREAM = "#F6F2EC";
const INK = "#222222";
const CORAL = "#FF7A61";
const CORAL_DEEP = "#FF6B4A";
const PAGE = "#EFE9E1";
const TX = 2;

function px(n) {
  return n * TX;
}

function cssFont(name) {
  if (typeof document === "undefined") return "";
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value ? `${value}, ` : "";
}

function sans(weight, size) {
  return `${weight} ${size}px ${cssFont("--font-fragment-sans")}Arial, sans-serif`;
}

function glare(weight, size) {
  return `${weight} ${size}px ${cssFont("--font-fragment-glare")}Georgia, serif`;
}

function avenir(weight, size) {
  return `${weight} ${size}px ${cssFont("--font-avenir")}Arial, sans-serif`;
}

function textWidth(ctx, text) {
  return ctx.measureText(text).width;
}

function fillCentered(ctx, text, x, y) {
  const prev = ctx.textAlign;
  ctx.textAlign = "left";
  ctx.fillText(text, x - textWidth(ctx, text) / 2, y);
  ctx.textAlign = prev;
}

function drawPixelRing(ctx, x, y, size, thickness, cell) {
  ctx.fillStyle = CORAL;
  const gap = Math.max(1, cell * 0.18);
  const drawCell = (cx, cy) => {
    ctx.fillRect(cx, cy, cell - gap, cell - gap);
  };

  for (let ix = x; ix < x + size; ix += cell) {
    for (let iy = y; iy < y + thickness; iy += cell) drawCell(ix, iy);
    for (let iy = y + size - thickness; iy < y + size; iy += cell)
      drawCell(ix, iy);
  }
  for (let iy = y; iy < y + size; iy += cell) {
    for (let ix = x; ix < x + thickness; ix += cell) drawCell(ix, iy);
    for (let ix = x + size - thickness; ix < x + size; ix += cell)
      drawCell(ix, iy);
  }
}

function hash(ix, iy) {
  const n = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function drawCoverFrame(ctx, w, h) {
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = INK;
  ctx.lineWidth = px(4);
  ctx.strokeRect(px(28), px(28), w - px(56), h - px(56));
}

function drawSeriesLabel(ctx, number, series = CONFIG.series) {
  ctx.fillStyle = INK;
  ctx.font = avenir(500, px(28));
  ctx.fillText(`${series}  ·  ${number}`, px(64), px(110));
}

function drawFilledBadge(ctx, w, label) {
  ctx.fillStyle = INK;
  ctx.fillRect(w - px(168), px(72), px(92), px(36));
  ctx.fillStyle = CREAM;
  ctx.font = avenir(500, px(20));
  ctx.fillText(label, w - px(148), px(97));
}

function drawOutlineBadge(ctx, w, label) {
  ctx.font = avenir(500, px(18));
  const textW = textWidth(ctx, label);
  const padX = px(14);
  const boxW = Math.max(px(118), textW + padX * 2);
  const boxH = px(40);
  const x = w - px(68) - boxW;
  ctx.strokeStyle = INK;
  ctx.lineWidth = px(3);
  ctx.strokeRect(x, px(70), boxW, boxH);
  ctx.fillStyle = INK;
  ctx.fillText(label, x + padX, px(97));
}

function roundedRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function fillSpacedText(ctx, text, x, y, spacing) {
  const chars = [...text];
  const widths = chars.map((char) => textWidth(ctx, char));
  const total =
    widths.reduce((sum, width) => sum + width, 0) +
    spacing * (chars.length - 1);
  let cursor = x - total / 2;
  ctx.textAlign = "left";
  chars.forEach((char, i) => {
    ctx.fillText(char, cursor, y);
    cursor += widths[i] + spacing;
  });
}

function drawStamp(ctx, x, y, rotation, label = "IN PROGRESS") {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const w = Math.max(px(420), px(48) + [...label].length * px(28));
  const h = px(112);
  const color = "#FF3621";

  ctx.strokeStyle = color;
  ctx.fillStyle = "rgba(255, 54, 33, 0.07)";
  ctx.lineWidth = px(10);
  roundedRect(ctx, -w / 2, -h / 2, w, h, px(12));
  ctx.fill();
  ctx.stroke();

  ctx.lineWidth = px(3);
  roundedRect(ctx, -w / 2 + px(13), -h / 2 + px(13), w - px(26), h - px(26), px(7));
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.font = avenir(500, px(34));
  fillSpacedText(ctx, label, 0, px(2), px(6));

  ctx.globalAlpha = 0.18;
  for (let i = 0; i < 28; i++) {
    const ix = -w / 2 + px(8) + hash(i, 2) * (w - px(16));
    const iy = -h / 2 + px(6) + hash(i, 9) * (h - px(12));
    ctx.fillRect(ix, iy, px(2.4), px(2.4));
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawCoverTitles(ctx, w, h, lines, author = CONFIG.author) {
  ctx.fillStyle = INK;
  ctx.font = glare(400, px(72));
  lines.forEach((line, i) => {
    ctx.fillText(line, px(64), h - px(220) + i * px(80));
  });
  ctx.font = avenir(500, px(22));
  ctx.fillText(author, px(64), h - px(84));
}

function drawFrontierArt(ctx, w) {
  const x = px(150);
  const y = px(190);
  const size = w - px(300);
  const cols = 18;
  const cell = size / cols;
  const palette = ["#F6D5C4", "#F0B8A4", "#E8C4B4", "#FADFD2", "#E7A992", "#F3E6DC"];

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < cols; j++) {
      const dx = i - cols / 2;
      const dy = j - cols / 2;
      const falloff = 1 - Math.min(1, Math.hypot(dx, dy) / (cols * 0.62));
      if (falloff <= 0.04) continue;
      ctx.globalAlpha = 0.35 + falloff * 0.65;
      ctx.fillStyle = palette[Math.floor(hash(i, j) * palette.length)];
      ctx.fillRect(x + i * cell, y + j * cell, cell + 0.6, cell + 0.6);
    }
  }
  ctx.globalAlpha = 1;
}

function drawTeamsArt(ctx, w) {
  const x = px(150);
  const y = px(190);
  const size = w - px(300);
  const cols = 42;
  const cell = size / cols;

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < cols; j++) {
      const nx = i / cols - 0.5;
      const ny = j / cols - 0.5;
      const blob = Math.exp(-(nx * nx * 18 + ny * ny * 22));
      const grain = hash(i, j);
      if (grain > blob * 0.92 + 0.18) continue;
      ctx.fillStyle = blob > 0.45 ? CORAL : grain > 0.55 ? "#C8C2B8" : "#8A8680";
      ctx.fillRect(x + i * cell, y + j * cell, cell * 0.82, cell * 0.82);
    }
  }
}

function layoutLines(ctx, text, maxWidth) {
  const words = String(text || "")
    .split(/\s+/)
    .filter(Boolean);
  const lines = [];
  let line = "";

  const pushChunked = (word) => {
    let chunk = "";
    for (const ch of word) {
      const next = chunk + ch;
      if (chunk && textWidth(ctx, next) > maxWidth) {
        lines.push(chunk);
        chunk = ch;
      } else {
        chunk = next;
      }
    }
    line = chunk;
  };

  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (textWidth(ctx, test) <= maxWidth) {
      line = test;
      continue;
    }
    if (line) lines.push(line);
    if (textWidth(ctx, word) <= maxWidth) line = word;
    else pushChunked(word);
  }
  if (line) lines.push(line);
  return lines;
}

function drawLines(ctx, lines, x, y, lineHeight) {
  const centered = ctx.textAlign === "center";
  lines.forEach((line, i) => {
    if (centered) fillCentered(ctx, line, x, y + i * lineHeight);
    else ctx.fillText(line, x, y + i * lineHeight);
  });
  return y + Math.max(lines.length - 1, 0) * lineHeight;
}

function fitFontSize(ctx, text, maxWidth, maxHeight, fontFn, minSize, maxSize, lineRatio) {
  let size = maxSize;
  let lines = [];
  while (size >= minSize) {
    ctx.font = fontFn(size);
    lines = layoutLines(ctx, text, maxWidth);
    if (lines.length * size * lineRatio <= maxHeight) break;
    size -= TX;
  }
  return { size, lines, lineHeight: size * lineRatio };
}

function drawCover(ctx, w, h, content = CONFIG) {
  const { number, badge, title } = content.cover;
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = INK;
  ctx.lineWidth = px(4);
  ctx.strokeRect(px(28), px(28), w - px(56), h - px(56));

  drawSeriesLabel(ctx, number, content.series);

  ctx.fillStyle = INK;
  ctx.fillRect(w - px(168), px(72), px(92), px(36));
  ctx.fillStyle = CREAM;
  ctx.font = avenir(500, px(20));
  ctx.fillText(badge, w - px(148), px(97));

  const artX = px(150);
  const artY = px(180);
  const artSize = w - px(300);
  const cell = artSize / 26;
  ctx.fillStyle = CORAL;
  for (let i = 0; i < 26; i++) {
    ctx.fillRect(artX + i * cell, artY, cell * 0.82, cell * 0.82);
    ctx.fillRect(artX + i * cell, artY + cell * 2, cell * 0.82, cell * 0.82);
  }
  drawPixelRing(ctx, artX, artY + cell * 4, artSize, cell * 2.2, cell);
  drawPixelRing(
    ctx,
    artX + cell * 4.2,
    artY + cell * 8.2,
    artSize - cell * 8.4,
    cell * 2,
    cell
  );
  drawPixelRing(
    ctx,
    artX + cell * 8.2,
    artY + cell * 12.2,
    artSize - cell * 16.4,
    cell * 1.8,
    cell
  );
  ctx.fillStyle = CORAL_DEEP;
  const core = cell * 3.4;
  ctx.fillRect(
    artX + artSize / 2 - core / 2,
    artY + cell * 4 + artSize / 2 - core / 2,
    core,
    core
  );
  ctx.fillStyle = CORAL;
  for (let i = 0; i < 26; i++) {
    ctx.fillRect(
      artX + i * cell,
      artY + artSize + cell * 2.2,
      cell * 0.82,
      cell * 0.82
    );
    ctx.fillRect(
      artX + i * cell,
      artY + artSize + cell * 4.2,
      cell * 0.82,
      cell * 0.82
    );
  }

  drawCoverTitles(ctx, w, h, title, content.author);
}

function drawFrontierCover(ctx, w, h, content = CONFIG) {
  const variant = content.variants.frontier;
  drawCoverFrame(ctx, w, h);
  drawSeriesLabel(ctx, variant.number, content.series);
  drawOutlineBadge(ctx, w, variant.badge);
  drawFrontierArt(ctx, w);
  drawCoverTitles(ctx, w, h, variant.title, content.author);
  drawStamp(ctx, w * 0.7, h - px(310), -0.32, variant.stamp ?? "IN PROGRESS");
}

function drawTeamsCover(ctx, w, h, content = CONFIG) {
  const variant = content.variants.teams;
  drawCoverFrame(ctx, w, h);
  drawSeriesLabel(ctx, variant.number, content.series);
  drawOutlineBadge(ctx, w, variant.badge);
  drawTeamsArt(ctx, w);
  ctx.fillStyle = INK;
  ctx.font = glare(400, px(64));
  variant.title.forEach((line, i) => {
    ctx.fillText(line, px(64), h - px(240) + i * px(80));
  });
  ctx.font = avenir(500, px(22));
  ctx.fillText(content.author, px(64), h - px(84));
  drawStamp(ctx, w * 0.7, h - px(310), -0.28, variant.stamp ?? "UPCOMING");
}

function drawHairline(ctx, x, y, width, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = px(2);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.stroke();
}

function drawIntroPage(ctx, page, x, y, maxW, bottom, ink) {
  const text = page.body || page.heading || "";
  const cx = x + maxW / 2;
  const measure = maxW * 0.92;

  ctx.save();
  ctx.textAlign = "left";
  ctx.fillStyle = ink;

  if (page?.kicker) {
    ctx.font = avenir(500, px(22));
    fillSpacedText(ctx, page.kicker, cx, y, px(8));
  }

  const fitted = fitFontSize(
    ctx,
    text,
    measure,
    bottom - y - px(160),
    (size) => glare(400, size),
    px(44),
    px(68),
    1.28
  );
  const blockHeight =
    fitted.size * 0.92 + Math.max(fitted.lines.length - 1, 0) * fitted.lineHeight;
  const contentTop = y + (page?.kicker ? px(88) : px(12));
  const contentBottom = bottom - px(110);
  const start =
    contentTop + Math.max(0, (contentBottom - contentTop - blockHeight) * 0.38);

  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.font = glare(400, fitted.size);
  const lastY = drawLines(
    ctx,
    fitted.lines,
    cx,
    start + fitted.size * 0.92,
    fitted.lineHeight
  );

  const ruleY = lastY + px(52);
  ctx.strokeStyle = ink;
  ctx.lineWidth = px(1.5);
  ctx.beginPath();
  ctx.moveTo(cx - px(36), ruleY);
  ctx.lineTo(cx + px(36), ruleY);
  ctx.stroke();

  ctx.fillStyle = ink;
  ctx.font = avenir(500, px(20));
  fillCentered(ctx, CONFIG.author, cx, ruleY + px(44));

  if (page?.slot) {
    ctx.font = avenir(500, px(20));
    fillCentered(ctx, String(page.slot).padStart(2, "0"), cx, bottom + px(32));
  }

  ctx.restore();
}

function drawIndexPage(ctx, page, x, y, maxW, bottom, ink) {
  const items = page.items ?? [];
  if (!items.length) return;
  const slot = (bottom - y) / items.length;

  items.forEach((item, i) => {
    const y0 = y + i * slot;
    if (i > 0) drawHairline(ctx, x, y0, maxW, ink);

    ctx.fillStyle = ink;
    ctx.font = avenir(500, px(28));
    ctx.fillText(String(i + 1).padStart(2, "0"), x, y0 + px(48));

    const fitted = fitFontSize(
      ctx,
      item,
      maxW,
      slot - px(84),
      (size) => glare(400, size),
      px(36),
      px(50),
      1.16
    );
    ctx.fillStyle = ink;
    ctx.font = glare(400, fitted.size);
    drawLines(ctx, fitted.lines, x, y0 + px(48) + fitted.size + px(18), fitted.lineHeight);
  });
}

function drawSectionsPage(ctx, page, x, y, maxW, bottom, ink) {
  const sections = page.sections ?? [];
  if (!sections.length) return;
  const slot = (bottom - y) / sections.length;

  sections.forEach((section, i) => {
    const y0 = y + i * slot;
    const y1 = y0 + slot - px(16);
    if (i > 0) drawHairline(ctx, x, y0, maxW, ink);

    let cursor = y0 + px(44);
    if (section.number) {
      ctx.fillStyle = ink;
      ctx.font = avenir(500, px(26));
      ctx.fillText(section.number, x, cursor);
      cursor += px(28);
    }

    const heading = fitFontSize(
      ctx,
      section.heading,
      maxW,
      Math.min(px(240), (y1 - cursor) * 0.4),
      (size) => glare(400, size),
      px(32),
      px(46),
      1.16
    );
    ctx.fillStyle = ink;
    ctx.font = glare(400, heading.size);
    const headingBottom = drawLines(
      ctx,
      heading.lines,
      x,
      cursor + heading.size,
      heading.lineHeight
    );

    const bodyTop = headingBottom + px(64);
    const body = fitFontSize(
      ctx,
      section.body,
      maxW,
      Math.max(px(80), y1 - bodyTop),
      (size) => sans(400, size),
      px(24),
      px(34),
      1.42
    );
    ctx.fillStyle = ink;
    ctx.font = sans(400, body.size);
    drawLines(ctx, body.lines, x, bodyTop + body.size * 0.85, body.lineHeight);
  });
}

function drawArticlePage(ctx, page, x, y, maxW, bottom, ink) {
  let cursor = y;
  if (page?.heading) {
    const heading = fitFontSize(
      ctx,
      page.heading,
      maxW,
      px(280),
      (size) => glare(400, size),
      px(40),
      px(64),
      1.16
    );
    ctx.fillStyle = ink;
    ctx.font = glare(400, heading.size);
    cursor = drawLines(ctx, heading.lines, x, cursor + heading.size, heading.lineHeight);
    cursor += px(64);
  }
  if (page?.body) {
    const body = fitFontSize(
      ctx,
      page.body,
      maxW,
      Math.max(px(80), bottom - cursor),
      (size) => sans(400, size),
      px(26),
      px(36),
      1.4
    );
    ctx.fillStyle = ink;
    ctx.font = sans(400, body.size);
    drawLines(ctx, body.lines, x, cursor + body.size * 0.85, body.lineHeight);
  }
}

function drawPage(ctx, w, h, page) {
  const black = Boolean(page?.black);
  const bg = black ? INK : PAGE;
  const ink = black ? CREAM : INK;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = ink;
  ctx.lineWidth = px(3);
  ctx.lineJoin = "miter";
  ctx.setLineDash([]);
  ctx.strokeRect(px(40), px(40), w - px(80), h - px(80));

  const padX = px(88);
  const top = px(118);
  const bottom = h - px(96);
  const maxW = w - padX * 2;
  const layout = page?.layout || "article";

  if (layout === "intro") {
    drawIntroPage(ctx, page, padX, top, maxW, bottom, ink);
    return;
  }

  if (page?.kicker) {
    ctx.fillStyle = ink;
    ctx.font = avenir(500, px(26));
    ctx.fillText(page.kicker, padX, top);
  }

  const contentTop = page?.kicker ? top + px(52) : top;
  if (layout === "index") {
    drawIndexPage(ctx, page, padX, contentTop, maxW, bottom, ink);
  } else if (layout === "sections") {
    drawSectionsPage(ctx, page, padX, contentTop, maxW, bottom, ink);
  } else {
    drawArticlePage(ctx, page, padX, contentTop, maxW, bottom, ink);
  }

  if (page?.slot) {
    ctx.fillStyle = ink;
    ctx.font = avenir(500, px(20));
    ctx.textAlign = "right";
    ctx.fillText(String(page.slot).padStart(2, "0"), w - padX, h - px(64));
    ctx.textAlign = "left";
  }
}

function drawBlank(ctx, w, h, black) {
  ctx.fillStyle = black ? INK : PAGE;
  ctx.fillRect(0, 0, w, h);
}

function drawBackCover(ctx, w, h, content = CONFIG) {
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = INK;
  ctx.lineWidth = px(4);
  ctx.strokeRect(px(28), px(28), w - px(56), h - px(56));

  ctx.fillStyle = INK;
  ctx.font = glare(400, px(40));
  fillCentered(ctx, content.back.title, w / 2, h / 2 - px(12));
  ctx.font = avenir(500, px(20));
  fillCentered(ctx, content.back.credit, w / 2, h / 2 + px(36));
}

function drawSide(ctx, w, h, side, content) {
  if (!side) return;
  if (side.kind === "page") {
    drawPage(ctx, w, h, side);
    return;
  }
  if (side.kind === "blank") {
    drawBlank(ctx, w, h, side.black);
    return;
  }
  makeDrawings(content)[side.kind]?.(ctx, w, h);
}

function makeDrawings(content) {
  return {
    cover: (ctx, w, h) => drawCover(ctx, w, h, content),
    "cover-frontier": (ctx, w, h) => drawFrontierCover(ctx, w, h, content),
    "cover-teams": (ctx, w, h) => drawTeamsCover(ctx, w, h, content),
    backcover: (ctx, w, h) => drawBackCover(ctx, w, h, content),
  };
}

const canvasCache = new Map();
const painted = new Set();
let fontWatch = false;

function paint(canvas, side, content) {
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = PAGE;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawSide(ctx, canvas.width, canvas.height, side, content);
}

// Webflow loads its faces after the book mounts, so the first paint bakes in
// fallback type. Repaint once the real faces are ready.
function watchFonts() {
  if (fontWatch || typeof document === "undefined" || !document.fonts) return;
  fontWatch = true;
  document.fonts.ready.then(() => {
    painted.forEach((entry) => {
      paint(entry.canvas, entry.side, entry.content);
      entry.texture.needsUpdate = true;
    });
  });
}

export function createPageTexture(side, content = CONFIG) {
  const key = JSON.stringify({
    side,
    series: content.series,
    author: content.author,
    cover: content.cover,
    back: content.back,
    variants: content.variants,
  });
  let canvas = canvasCache.get(key);
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.width = px(1024);
    canvas.height = px(1370);
    paint(canvas, side, content);
    canvasCache.set(key, canvas);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 16;
  texture.needsUpdate = true;

  painted.add({ texture, canvas, side, content });
  watchFonts();
  return texture;
}
