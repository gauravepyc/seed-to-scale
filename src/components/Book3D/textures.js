import { CanvasTexture, SRGBColorSpace } from "three";
import { CONFIG } from "./config";

const CREAM = "#F6F2EC";
const INK = "#222222";
const CORAL = "#FF7A61";
const CORAL_DEEP = "#FF6B4A";
const PAGE = "#EFE9E1";

function cssFont(name) {
  if (typeof document === "undefined") return "sans-serif";
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    "sans-serif"
  );
}

function sans(weight, size) {
  return `${weight} ${size}px ${cssFont("--font-fragment-sans")}, Arial, sans-serif`;
}

function glare(weight, size) {
  return `${weight} ${size}px ${cssFont("--font-fragment-glare")}, Georgia, serif`;
}

function avenir(weight, size) {
  return `${weight} ${size}px ${cssFont("--font-avenir")}, Arial, sans-serif`;
}

function drawPixelRing(ctx, x, y, size, thickness, cell) {
  ctx.fillStyle = CORAL;
  const gap = Math.max(1, cell * 0.18);
  const drawCell = (cx, cy) => {
    ctx.fillRect(cx, cy, cell - gap, cell - gap);
  };

  for (let px = x; px < x + size; px += cell) {
    for (let py = y; py < y + thickness; py += cell) drawCell(px, py);
    for (let py = y + size - thickness; py < y + size; py += cell)
      drawCell(px, py);
  }
  for (let py = y; py < y + size; py += cell) {
    for (let px = x; px < x + thickness; px += cell) drawCell(px, py);
    for (let px = x + size - thickness; px < x + size; px += cell)
      drawCell(px, py);
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
  ctx.lineWidth = 4;
  ctx.strokeRect(28, 28, w - 56, h - 56);
}

function drawSeriesLabel(ctx, number, series = CONFIG.series) {
  ctx.fillStyle = INK;
  ctx.font = avenir(500, 28);
  ctx.fillText(`${series}  ·  ${number}`, 64, 110);
}

function drawFilledBadge(ctx, w, label) {
  ctx.fillStyle = INK;
  ctx.fillRect(w - 168, 72, 92, 36);
  ctx.fillStyle = CREAM;
  ctx.font = avenir(500, 20);
  ctx.fillText(label, w - 148, 97);
}

function drawOutlineBadge(ctx, w, label) {
  ctx.font = avenir(500, 18);
  const textW = ctx.measureText(label).width;
  const padX = 14;
  const boxW = Math.max(118, textW + padX * 2);
  const boxH = 40;
  const x = w - 68 - boxW;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.strokeRect(x, 70, boxW, boxH);
  ctx.fillStyle = INK;
  ctx.fillText(label, x + padX, 97);
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
  const widths = chars.map((char) => ctx.measureText(char).width);
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

  const w = Math.max(420, 48 + [...label].length * 28);
  const h = 112;
  const color = "#FF3621";

  ctx.strokeStyle = color;
  ctx.fillStyle = "rgba(255, 54, 33, 0.07)";
  ctx.lineWidth = 10;
  roundedRect(ctx, -w / 2, -h / 2, w, h, 12);
  ctx.fill();
  ctx.stroke();

  ctx.lineWidth = 3;
  roundedRect(ctx, -w / 2 + 13, -h / 2 + 13, w - 26, h - 26, 7);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.font = avenir(500, 34);
  fillSpacedText(ctx, label, 0, 2, 6);

  ctx.globalAlpha = 0.18;
  for (let i = 0; i < 28; i++) {
    const px = -w / 2 + 8 + hash(i, 2) * (w - 16);
    const py = -h / 2 + 6 + hash(i, 9) * (h - 12);
    ctx.fillRect(px, py, 2.4, 2.4);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawCoverTitles(ctx, w, h, lines, author = CONFIG.author) {
  ctx.fillStyle = INK;
  ctx.font = glare(400, 72);
  lines.forEach((line, i) => {
    ctx.fillText(line, 64, h - 220 + i * 80);
  });
  ctx.font = avenir(500, 22);
  ctx.fillText(author, 64, h - 84);
}

function drawFrontierArt(ctx, w) {
  const x = 150;
  const y = 190;
  const size = w - 300;
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
  const x = 150;
  const y = 190;
  const size = w - 300;
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
      if (chunk && ctx.measureText(next).width > maxWidth) {
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
    if (ctx.measureText(test).width <= maxWidth) {
      line = test;
      continue;
    }
    if (line) lines.push(line);
    if (ctx.measureText(word).width <= maxWidth) line = word;
    else pushChunked(word);
  }
  if (line) lines.push(line);
  return lines;
}

function drawLines(ctx, lines, x, y, lineHeight) {
  lines.forEach((line, i) => ctx.fillText(line, x, y + i * lineHeight));
  return y + Math.max(lines.length - 1, 0) * lineHeight;
}

function fitFontSize(ctx, text, maxWidth, maxHeight, fontFn, minSize, maxSize, lineRatio) {
  let size = maxSize;
  let lines = [];
  while (size >= minSize) {
    ctx.font = fontFn(size);
    lines = layoutLines(ctx, text, maxWidth);
    if (lines.length * size * lineRatio <= maxHeight) break;
    size -= 1;
  }
  return { size, lines, lineHeight: size * lineRatio };
}

function drawCover(ctx, w, h, content = CONFIG) {
  const { number, badge, title } = content.cover;
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  ctx.strokeRect(28, 28, w - 56, h - 56);

  drawSeriesLabel(ctx, number, content.series);

  ctx.fillStyle = INK;
  ctx.fillRect(w - 168, 72, 92, 36);
  ctx.fillStyle = CREAM;
  ctx.font = avenir(500, 20);
  ctx.fillText(badge, w - 148, 97);

  const artX = 150;
  const artY = 180;
  const artSize = w - 300;
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
  drawStamp(ctx, w * 0.7, h - 310, -0.32, variant.stamp ?? "IN PROGRESS");
}

function drawTeamsCover(ctx, w, h, content = CONFIG) {
  const variant = content.variants.teams;
  drawCoverFrame(ctx, w, h);
  drawSeriesLabel(ctx, variant.number, content.series);
  drawOutlineBadge(ctx, w, variant.badge);
  drawTeamsArt(ctx, w);
  ctx.fillStyle = INK;
  ctx.font = glare(400, 64);
  variant.title.forEach((line, i) => {
    ctx.fillText(line, 64, h - 240 + i * 80);
  });
  ctx.font = avenir(500, 22);
  ctx.fillText(content.author, 64, h - 84);
  drawStamp(ctx, w * 0.7, h - 310, -0.28, variant.stamp ?? "UPCOMING");
}

function drawHairline(ctx, x, y, width, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
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
  ctx.textAlign = "center";
  ctx.fillStyle = ink;

  if (page?.kicker) {
    ctx.font = avenir(500, 22);
    fillSpacedText(ctx, page.kicker, cx, y, 8);
  }

  const fitted = fitFontSize(
    ctx,
    text,
    measure,
    bottom - y - 160,
    (size) => glare(400, size),
    44,
    68,
    1.28
  );
  const blockHeight =
    fitted.size * 0.92 + Math.max(fitted.lines.length - 1, 0) * fitted.lineHeight;
  const contentTop = y + (page?.kicker ? 88 : 12);
  const contentBottom = bottom - 110;
  const start =
    contentTop + Math.max(0, (contentBottom - contentTop - blockHeight) * 0.38);

  ctx.textAlign = "center";
  ctx.fillStyle = ink;
  ctx.font = glare(400, fitted.size);
  const lastY = drawLines(
    ctx,
    fitted.lines,
    cx,
    start + fitted.size * 0.92,
    fitted.lineHeight
  );

  const ruleY = lastY + 52;
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 36, ruleY);
  ctx.lineTo(cx + 36, ruleY);
  ctx.stroke();

  ctx.fillStyle = ink;
  ctx.font = avenir(500, 20);
  ctx.fillText(CONFIG.author, cx, ruleY + 44);

  if (page?.slot) {
    ctx.font = avenir(500, 20);
    ctx.fillText(String(page.slot).padStart(2, "0"), cx, bottom + 32);
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
    ctx.font = avenir(500, 28);
    ctx.fillText(String(i + 1).padStart(2, "0"), x, y0 + 48);

    const fitted = fitFontSize(
      ctx,
      item,
      maxW,
      slot - 84,
      (size) => glare(400, size),
      36,
      50,
      1.16
    );
    ctx.fillStyle = ink;
    ctx.font = glare(400, fitted.size);
    drawLines(ctx, fitted.lines, x, y0 + 48 + fitted.size + 18, fitted.lineHeight);
  });
}

function drawSectionsPage(ctx, page, x, y, maxW, bottom, ink) {
  const sections = page.sections ?? [];
  if (!sections.length) return;
  const slot = (bottom - y) / sections.length;

  sections.forEach((section, i) => {
    const y0 = y + i * slot;
    const y1 = y0 + slot - 16;
    if (i > 0) drawHairline(ctx, x, y0, maxW, ink);

    let cursor = y0 + 44;
    if (section.number) {
      ctx.fillStyle = ink;
      ctx.font = avenir(500, 26);
      ctx.fillText(section.number, x, cursor);
      cursor += 28;
    }

    const heading = fitFontSize(
      ctx,
      section.heading,
      maxW,
      Math.min(240, (y1 - cursor) * 0.4),
      (size) => glare(400, size),
      32,
      46,
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

    const bodyTop = headingBottom + 64;
    const body = fitFontSize(
      ctx,
      section.body,
      maxW,
      Math.max(80, y1 - bodyTop),
      (size) => sans(400, size),
      24,
      34,
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
      280,
      (size) => glare(400, size),
      40,
      64,
      1.16
    );
    ctx.fillStyle = ink;
    ctx.font = glare(400, heading.size);
    cursor = drawLines(ctx, heading.lines, x, cursor + heading.size, heading.lineHeight);
    cursor += 64;
  }
  if (page?.body) {
    const body = fitFontSize(
      ctx,
      page.body,
      maxW,
      Math.max(80, bottom - cursor),
      (size) => sans(400, size),
      26,
      36,
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
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, w - 80, h - 80);

  const padX = 88;
  const top = 118;
  const bottom = h - 96;
  const maxW = w - padX * 2;
  const layout = page?.layout || "article";

  if (layout === "intro") {
    drawIntroPage(ctx, page, padX, top, maxW, bottom, ink);
    return;
  }

  if (page?.kicker) {
    ctx.fillStyle = ink;
    ctx.font = avenir(500, 26);
    ctx.fillText(page.kicker, padX, top);
  }

  const contentTop = page?.kicker ? top + 52 : top;
  if (layout === "index") {
    drawIndexPage(ctx, page, padX, contentTop, maxW, bottom, ink);
  } else if (layout === "sections") {
    drawSectionsPage(ctx, page, padX, contentTop, maxW, bottom, ink);
  } else {
    drawArticlePage(ctx, page, padX, contentTop, maxW, bottom, ink);
  }

  if (page?.slot) {
    ctx.fillStyle = ink;
    ctx.font = avenir(500, 20);
    ctx.textAlign = "right";
    ctx.fillText(String(page.slot).padStart(2, "0"), w - padX, h - 64);
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
  ctx.lineWidth = 4;
  ctx.strokeRect(28, 28, w - 56, h - 56);

  ctx.fillStyle = INK;
  ctx.textAlign = "center";
  ctx.font = glare(400, 40);
  ctx.fillText(content.back.title, w / 2, h / 2 - 12);
  ctx.font = avenir(500, 20);
  ctx.fillText(content.back.credit, w / 2, h / 2 + 36);
  ctx.textAlign = "left";
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
    const w = 1024;
    const h = 1370;
    canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = PAGE;
    ctx.fillRect(0, 0, w, h);
    drawSide(ctx, w, h, side, content);
    canvasCache.set(key, canvas);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}
