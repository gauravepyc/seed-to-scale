import { CanvasTexture, SRGBColorSpace } from "three";

const CREAM = "#F7F4EE";
const INK = "#222222";
const CORAL = "#FF7A61";
const CORAL_DEEP = "#FF6B4A";
const PAGE = "#FAF7F2";

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

function drawSeriesLabel(ctx, number) {
  ctx.fillStyle = INK;
  ctx.font = avenir(500, 28);
  ctx.fillText(`THE WORKING FILES  ·  ${number}`, 64, 110);
}

function drawFilledBadge(ctx, w, label) {
  ctx.fillStyle = INK;
  ctx.fillRect(w - 168, 72, 92, 36);
  ctx.fillStyle = CREAM;
  ctx.font = avenir(500, 20);
  ctx.fillText(label, w - 148, 97);
}

function drawOutlineBadge(ctx, w, label) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.strokeRect(w - 186, 70, 118, 40);
  ctx.fillStyle = INK;
  ctx.font = avenir(500, 18);
  ctx.fillText(label, w - 162, 97);
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

function drawStamp(ctx, x, y, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const w = 420;
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
  fillSpacedText(ctx, "IN PROGRESS", 0, 2, 6);

  ctx.globalAlpha = 0.18;
  for (let i = 0; i < 28; i++) {
    const px = -w / 2 + 8 + hash(i, 2) * (w - 16);
    const py = -h / 2 + 6 + hash(i, 9) * (h - 12);
    ctx.fillRect(px, py, 2.4, 2.4);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawCoverTitles(ctx, w, h, lines) {
  ctx.fillStyle = INK;
  ctx.font = glare(400, 72);
  lines.forEach((line, i) => {
    ctx.fillText(line, 64, h - 220 + i * 80);
  });
  ctx.font = avenir(500, 22);
  ctx.fillText("TARUN RAHEJA  ·  ACCEL", 64, h - 84);
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

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let cursorY = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth) {
      ctx.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, cursorY);
}

function drawCover(ctx, w, h) {
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  ctx.strokeRect(28, 28, w - 56, h - 56);

  ctx.fillStyle = INK;
  ctx.font = avenir(500, 28);
  ctx.fillText("THE WORKING FILES  ·  01", 64, 110);

  ctx.fillRect(w - 168, 72, 92, 36);
  ctx.fillStyle = CREAM;
  ctx.font = avenir(500, 20);
  ctx.fillText("V1.2", w - 148, 97);

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

  ctx.fillStyle = INK;
  ctx.font = glare(400, 72);
  ctx.fillText("Harness", 64, h - 220);
  ctx.fillText("Engineering", 64, h - 140);
  ctx.font = avenir(500, 22);
  ctx.fillText("TARUN RAHEJA  ·  ACCEL", 64, h - 84);
}

function drawFrontierCover(ctx, w, h) {
  drawCoverFrame(ctx, w, h);
  drawSeriesLabel(ctx, "02");
  drawOutlineBadge(ctx, w, "DRAFT");
  drawFrontierArt(ctx, w);
  drawCoverTitles(ctx, w, h, ["Frontier Model", "Capabilities"]);
  drawStamp(ctx, w * 0.7, h - 310, -0.32);
}

function drawTeamsCover(ctx, w, h) {
  drawCoverFrame(ctx, w, h);
  drawSeriesLabel(ctx, "03");
  drawOutlineBadge(ctx, w, "DRAFT");
  drawTeamsArt(ctx, w);
  ctx.fillStyle = INK;
  ctx.font = glare(400, 64);
  ctx.fillText("AI-Maximal", 64, h - 240);
  ctx.fillText("Teams in Practice", 64, h - 160);
  ctx.font = avenir(500, 22);
  ctx.fillText("TARUN RAHEJA  ·  ACCEL", 64, h - 84);
  drawStamp(ctx, w * 0.7, h - 310, -0.28);
}

function drawPage(ctx, w, h, { kicker, heading, body }) {
  ctx.fillStyle = PAGE;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(34,34,34,0.16)";
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, w - 80, h - 80);

  ctx.fillStyle = "rgba(34,34,34,0.45)";
  ctx.font = avenir(500, 22);
  ctx.fillText(kicker, 80, 120);

  if (heading) {
    ctx.fillStyle = INK;
    ctx.font = glare(400, 54);
    wrapText(ctx, heading, 80, 220, w - 160, 64);
  }

  if (body) {
    ctx.fillStyle = INK;
    ctx.font = sans(400, 28);
    wrapText(ctx, body, 80, heading ? 420 : 220, w - 160, 42);
  }
}

function drawBackCover(ctx, w, h) {
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 4;
  ctx.strokeRect(28, 28, w - 56, h - 56);
  ctx.fillStyle = INK;
  ctx.font = glare(400, 36);
  ctx.fillText("The Working Files", 80, h / 2 - 20);
  ctx.font = avenir(500, 20);
  ctx.fillText("ACCEL  ·  01", 80, h / 2 + 24);
}

const drawings = {
  cover: drawCover,
  "cover-frontier": drawFrontierCover,
  "cover-teams": drawTeamsCover,
  contents: (ctx, w, h) =>
    drawPage(ctx, w, h, {
      kicker: "CONTENTS",
      heading: "Inside this file",
      body: "A working note on harnesses, model rent, and where the margin actually lives.",
    }),
  quote: (ctx, w, h) =>
    drawPage(ctx, w, h, {
      kicker: "THE FILE",
      heading: "Harness Engineering",
      body: "A frontier model is rented. It gets smarter on its own, with every release. The harness around it is what you actually build, and it's where the margin lives.",
    }),
  notes: (ctx, w, h) =>
    drawPage(ctx, w, h, {
      kicker: "NOTE",
      heading: "Build the harness.",
      body: "Tarun Raheja · Accel. Verified Aug 2026. Last edited 12 Aug 2026.",
    }),
  blank: (ctx, w, h) => {
    ctx.fillStyle = PAGE;
    ctx.fillRect(0, 0, w, h);
  },
  backcover: drawBackCover,
};

const canvasCache = new Map();

export function createPageTexture(id) {
  let canvas = canvasCache.get(id);
  if (!canvas) {
    const w = 1024;
    const h = 1370;
    canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = PAGE;
    ctx.fillRect(0, 0, w, h);
    drawings[id]?.(ctx, w, h);
    canvasCache.set(id, canvas);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}
