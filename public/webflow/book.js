(() => {
  // webflow/three-shim.js
  var T = window.THREE;
  var ACESFilmicToneMapping = T.ACESFilmicToneMapping;
  var AmbientLight = T.AmbientLight;
  var Bone = T.Bone;
  var BoxGeometry = T.BoxGeometry;
  var CanvasTexture = T.CanvasTexture;
  var Clock = T.Clock;
  var Color = T.Color;
  var DirectionalLight = T.DirectionalLight;
  var Float32BufferAttribute = T.Float32BufferAttribute;
  var Group = T.Group;
  var HemisphereLight = T.HemisphereLight;
  var MathUtils = T.MathUtils;
  var Mesh = T.Mesh;
  var MeshPhysicalMaterial = T.MeshPhysicalMaterial;
  var MeshStandardMaterial = T.MeshStandardMaterial;
  var PCFSoftShadowMap = T.PCFSoftShadowMap;
  var PerspectiveCamera = T.PerspectiveCamera;
  var PlaneGeometry = T.PlaneGeometry;
  var Raycaster = T.Raycaster;
  var SRGBColorSpace = T.SRGBColorSpace;
  var Scene = T.Scene;
  var ShadowMaterial = T.ShadowMaterial;
  var Skeleton = T.Skeleton;
  var SkinnedMesh = T.SkinnedMesh;
  var Uint16BufferAttribute = T.Uint16BufferAttribute;
  var Vector2 = T.Vector2;
  var Vector3 = T.Vector3;
  var WebGLRenderer = T.WebGLRenderer;

  // src/components/Book3D/config.js
  var CONFIG = {
    openAngle: 50,
    series: "THE WORKING KNOWLEDGE",
    author: "TARUN RAHEJA  \xB7  ACCEL  \xB7  21 SEPT 2026",
    cover: {
      number: "01",
      badge: "V1.0",
      title: ["Harness", "Engineering"]
    },
    back: {
      title: "The Working Knowledge",
      credit: "TARUN RAHEJA  \xB7  ACCEL  \xB7  21 SEPT 2026"
    },
    pages: [
      {
        layout: "intro",
        kicker: "THE FILE",
        body: "This playbook discusses how to extend frontier model capabilities via Harness Engineering, and how to durably retain your moat."
      },
      {
        layout: "index",
        kicker: "INDEX",
        items: [
          "Benchmarking model capabilities in your domain",
          "Harness engineering to improve frontier performance",
          "Productionizing and scaling up",
          "Retaining moats and staying ahead"
        ]
      },
      {
        layout: "sections",
        kicker: "THE FILE",
        sections: [
          {
            number: "01",
            heading: "BENCHMARKING MODEL CAPABILITIES IN YOUR DOMAIN",
            body: "Frontier models are superhuman at some tasks, and useless at others - unpredictably. We show ways to understand where the model is weak / strong in your domain in a principled manner."
          },
          {
            number: "02",
            heading: "HARNESS ENGINEERING TO IMPROVE FRONTIER PERFORMANCE",
            body: "Simple prompts cannot elicit peak capabilities from frontier models. We show how to achieve it - with tools, context management, loops, decomposition - and how to cleanly measure improvements."
          }
        ]
      },
      {
        layout: "sections",
        kicker: "THE FILE",
        sections: [
          {
            number: "03",
            heading: "PRODUCTIONIZING AND SCALING UP",
            body: "Demo harnesses are too unreliable and expensive in production. We show how you can build bulletproof evals, route model calls by reliability, and decide when fine-tuning is worth it."
          },
          {
            number: "04",
            heading: "RETAINING MOATS AND STAYING AHEAD",
            body: "Every new model release makes parts of our harness unnecessary or unwieldy, and throttles performance. We show what to delete when, and what parts of it a competitor cannot copy."
          }
        ]
      }
    ],
    variants: {
      frontier: {
        number: "02",
        badge: "IN PROGRESS",
        stamp: "IN PROGRESS",
        title: ["In the", "Making"]
      },
      teams: {
        number: "03",
        badge: "UPCOMING",
        stamp: "IN PROGRESS",
        title: ["Coming", "Next"]
      }
    }
  };

  // src/components/Book3D/textures.js
  var CREAM = "#F6F2EC";
  var INK = "#222222";
  var CORAL = "#FF7A61";
  var CORAL_DEEP = "#FF6B4A";
  var PAGE = "#EFE9E1";
  function cssFont(name) {
    if (typeof document === "undefined") return "sans-serif";
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "sans-serif";
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
    ctx.fillText(`${series}  \xB7  ${number}`, 64, 110);
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
    const total = widths.reduce((sum, width) => sum + width, 0) + spacing * (chars.length - 1);
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
    const words = String(text || "").split(/\s+/).filter(Boolean);
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
    const blockHeight = fitted.size * 0.92 + Math.max(fitted.lines.length - 1, 0) * fitted.lineHeight;
    const contentTop = y + (page?.kicker ? 88 : 12);
    const contentBottom = bottom - 110;
    const start = contentTop + Math.max(0, (contentBottom - contentTop - blockHeight) * 0.38);
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
      backcover: (ctx, w, h) => drawBackCover(ctx, w, h, content)
    };
  }
  var canvasCache = /* @__PURE__ */ new Map();
  function createPageTexture(side, content = CONFIG) {
    const key = JSON.stringify({
      side,
      series: content.series,
      author: content.author,
      cover: content.cover,
      back: content.back,
      variants: content.variants
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

  // src/components/Book3D/createBook.js
  var easingFactor = 0.5;
  var PAGE_CLOSED_Y = Math.PI / 2;
  var PAGE_WIDTH = 1.28;
  var PAGE_HEIGHT = 1.71;
  var PAGE_DEPTH = 0.01;
  var PAGE_SEGMENTS = 30;
  var SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;
  var pageGeometry = new BoxGeometry(
    PAGE_WIDTH,
    PAGE_HEIGHT,
    PAGE_DEPTH,
    PAGE_SEGMENTS,
    2
  );
  pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);
  var position = pageGeometry.attributes.position;
  var vertex = new Vector3();
  var skinIndexes = [];
  var skinWeights = [];
  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i);
    const x = vertex.x;
    const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH));
    const skinWeight = x % SEGMENT_WIDTH / SEGMENT_WIDTH;
    skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
    skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
  }
  pageGeometry.setAttribute(
    "skinIndex",
    new Uint16BufferAttribute(skinIndexes, 4)
  );
  pageGeometry.setAttribute(
    "skinWeight",
    new Float32BufferAttribute(skinWeights, 4)
  );
  var paperColor = new Color("#ffffff");
  var emissiveColor = new Color("#FF3621");
  var mattePaper = {
    roughness: 0.72,
    metalness: 0,
    envMapIntensity: 0
  };
  function createEdgeMaterials() {
    return [
      new MeshStandardMaterial({ color: "#EFE9E1", ...mattePaper }),
      new MeshStandardMaterial({ color: "#1A1A1A", ...mattePaper, roughness: 0.88 }),
      new MeshStandardMaterial({ color: "#EFE9E1", ...mattePaper }),
      new MeshStandardMaterial({ color: "#E8E1D8", ...mattePaper })
    ];
  }
  function shortestAngle(from, to) {
    let delta = to - from;
    while (delta > Math.PI) delta -= Math.PI * 2;
    while (delta < -Math.PI) delta += Math.PI * 2;
    return delta;
  }
  function dampAngle(object, key, target, smoothTime, dt) {
    const current = object[key];
    const delta = shortestAngle(current, target);
    object[key] = current + delta * (1 - Math.exp(-1 / smoothTime * dt));
  }
  function degToRad(deg) {
    return deg * Math.PI / 180;
  }
  function pageSide(page, index) {
    return {
      kind: "page",
      layout: page.layout ?? "article",
      kicker: page.kicker ?? "",
      heading: page.heading ?? "",
      body: page.body ?? "",
      items: page.items ?? [],
      sections: page.sections ?? [],
      black: Boolean(page.black),
      slot: index + 1
    };
  }
  function sheetsFromPages(content, coverKind) {
    const pages = content.pages ?? [];
    const sheets = [
      {
        front: { kind: coverKind },
        back: pages[0] ? pageSide(pages[0], 0) : { kind: "backcover" }
      }
    ];
    for (let i = 1; i < pages.length; i += 2) {
      sheets.push({
        front: pageSide(pages[i], i),
        back: pages[i + 1] ? pageSide(pages[i + 1], i + 1) : { kind: "backcover" }
      });
    }
    return sheets;
  }
  function createSkinnedPage(number, front, back, pageCount, edgeMaterials, content) {
    const bones = [];
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      const bone = new Bone();
      bones.push(bone);
      bone.position.x = i === 0 ? 0 : SEGMENT_WIDTH;
      if (i > 0) bones[i - 1].add(bone);
    }
    const skeleton = new Skeleton(bones);
    const picture = createPageTexture(front, content);
    const picture2 = createPageTexture(back, content);
    const isCover = number === 0 || number === pageCount - 1;
    const roughness = isCover ? 0.32 : 0.68;
    const materials = [
      ...edgeMaterials,
      new MeshPhysicalMaterial({
        color: paperColor,
        map: picture,
        roughness,
        metalness: 0,
        clearcoat: isCover ? 0.24 : 0.06,
        clearcoatRoughness: isCover ? 0.78 : 0.9,
        envMapIntensity: 0,
        emissive: emissiveColor,
        emissiveIntensity: 0
      }),
      new MeshPhysicalMaterial({
        color: paperColor,
        map: picture2,
        roughness,
        metalness: 0,
        clearcoat: isCover ? 0.24 : 0.06,
        clearcoatRoughness: isCover ? 0.78 : 0.9,
        envMapIntensity: 0,
        emissive: emissiveColor,
        emissiveIntensity: 0
      })
    ];
    const mesh = new SkinnedMesh(pageGeometry.clone(), materials);
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    mesh.frustumCulled = false;
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);
    mesh.userData.pageIndex = number;
    return mesh;
  }
  var PageSheet = class {
    constructor(number, front, back, pageCount, edgeMaterials, content) {
      this.number = number;
      this.opened = false;
      this.highlighted = false;
      this.group = new Group();
      this.group.rotation.y = Math.PI / 2;
      this.mesh = createSkinnedPage(
        number,
        front,
        back,
        pageCount,
        edgeMaterials,
        content
      );
      this.group.add(this.mesh);
      this.openY = -((content.openAngle ?? 50) * Math.PI) / 180;
    }
    setState({ opened, page, bookClosed }) {
      this.opened = opened;
      this.bookClosed = bookClosed;
      this.mesh.position.z = -this.number * PAGE_DEPTH + page * PAGE_DEPTH;
    }
    update(delta) {
      const emissiveIntensity = this.highlighted ? 0.42 : 0;
      this.mesh.material[4].emissiveIntensity = this.mesh.material[5].emissiveIntensity = MathUtils.lerp(
        this.mesh.material[4].emissiveIntensity,
        emissiveIntensity,
        0.22
      );
      let targetRotation = this.opened ? this.openY : PAGE_CLOSED_Y;
      if (!this.bookClosed) {
        targetRotation += degToRad(this.number * 0.8);
      }
      const bones = this.mesh.skeleton.bones;
      for (let i = 0; i < bones.length; i++) {
        const target = i === 0 ? this.group : bones[i];
        dampAngle(target.rotation, "y", i === 0 ? targetRotation : 0, easingFactor, delta);
        dampAngle(target.rotation, "x", 0, easingFactor, delta);
      }
    }
  };
  function createBook(cover = "cover", content = CONFIG) {
    const pageList = sheetsFromPages(content, cover);
    const edgeMaterials = createEdgeMaterials();
    const group = new Group();
    group.rotation.y = -Math.PI / 2;
    group.position.x = -PAGE_WIDTH / 2;
    const sheets = pageList.map(
      (pageData, index) => new PageSheet(
        index,
        pageData.front,
        pageData.back,
        pageList.length,
        edgeMaterials,
        content
      )
    );
    sheets.forEach((sheet) => group.add(sheet.group));
    let page = 0;
    let delayedPage = 0;
    let timeout = null;
    const applyPage = (value) => {
      delayedPage = value;
      const bookClosed = delayedPage === 0 || delayedPage === pageList.length;
      sheets.forEach((sheet, index) => {
        sheet.setState({
          opened: delayedPage > index,
          page: delayedPage,
          bookClosed
        });
      });
    };
    applyPage(0);
    const stepToward = () => {
      if (page === delayedPage) return;
      timeout = setTimeout(
        () => {
          if (page > delayedPage) applyPage(delayedPage + 1);
          else if (page < delayedPage) applyPage(delayedPage - 1);
          stepToward();
        },
        Math.abs(page - delayedPage) > 2 ? 50 : 150
      );
    };
    return {
      group,
      meshes: sheets.map((sheet) => sheet.mesh),
      sheets,
      setPage(next) {
        page = Math.max(0, Math.min(pageList.length, next));
        clearTimeout(timeout);
        stepToward();
      },
      highlight(index) {
        sheets.forEach((sheet, i) => {
          sheet.highlighted = i === index;
        });
      },
      update(delta) {
        const targetX = delayedPage === 0 ? -PAGE_WIDTH / 2 : delayedPage === pageList.length ? PAGE_WIDTH / 2 : 0;
        group.position.x += (targetX - group.position.x) * (1 - Math.exp(-3.4 * delta));
        sheets.forEach((sheet) => sheet.update(delta));
      },
      dispose() {
        clearTimeout(timeout);
      }
    };
  }

  // webflow/book-entry.js
  var COVERS = {
    harness: "cover",
    frontier: "cover-frontier",
    teams: "cover-teams"
  };
  var TILT_PITCH = 18;
  var TILT_YAW = 24;
  var TILT_ROLL = 10;
  var TILT_FOLLOW = 7;
  var TILT_RETURN = 4.5;
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }
  function parseRest(value) {
    const parts = String(value || "0,0,0").split(",").map((n) => Number(n.trim()));
    return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
  }
  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
  function mountBook(canvas) {
    const wrap = canvas.parentElement;
    if (!wrap) return null;
    const variant = canvas.getAttribute("data-book-variant") || "harness";
    const interactive = canvas.getAttribute("data-book-interactive") !== "false";
    const cameraDistance = Number(canvas.getAttribute("data-book-distance") || 4.2);
    const tiltStrength = Number(canvas.getAttribute("data-book-tilt") || 0.45);
    const [restX, restY, restZ] = parseRest(canvas.getAttribute("data-book-rest") || "0,-0.42,0");
    const cover = COVERS[variant] ?? "cover";
    const hint = wrap.querySelector("[data-book-hint]");
    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, interactive ? 2 : 1.5));
    renderer.shadowMap.enabled = interactive;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.42;
    renderer.setClearColor(0, 0);
    const scene = new Scene();
    const camera = new PerspectiveCamera(42, 1, 0.1, 50);
    camera.position.set(0, 0, cameraDistance);
    camera.lookAt(0, 0, 0);
    scene.add(new AmbientLight(16774892, 0.82));
    scene.add(new HemisphereLight(16775410, 12891812, 0.95));
    const key = new DirectionalLight(16775410, interactive ? 1.45 : 1.62);
    key.position.set(2.6, 3.8, 3.4);
    key.castShadow = interactive;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.radius = 8;
    key.shadow.intensity = 0.12;
    key.shadow.bias = -15e-4;
    key.shadow.normalBias = 0.035;
    scene.add(key);
    const fill = new DirectionalLight(16774376, 0.78);
    fill.position.set(-3.4, 1.6, 2.6);
    scene.add(fill);
    const bounce = new DirectionalLight(16775410, 0.58);
    bounce.position.set(-1.1, 2.4, 3.2);
    scene.add(bounce);
    const rim = new DirectionalLight(15722977, 0.58);
    rim.position.set(-1.4, 2.6, -3.6);
    scene.add(rim);
    const pages = CONFIG.variants?.[variant]?.pages;
    const content = pages ? { ...CONFIG, pages } : CONFIG;
    const book = createBook(cover, content);
    book.meshes.forEach((mesh) => {
      mesh.castShadow = interactive;
    });
    const tiltGroup = new Group();
    const pivot = new Group();
    pivot.rotation.set(restX, restY, restZ);
    pivot.add(book.group);
    tiltGroup.add(pivot);
    scene.add(tiltGroup);
    const ground = new Mesh(
      new PlaneGeometry(8, 8),
      new ShadowMaterial({ opacity: 0.1, transparent: true })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.92;
    ground.receiveShadow = true;
    scene.add(ground);
    const raycaster = new Raycaster();
    const pointer = new Vector2();
    const clock = new Clock();
    const tilt = { x: 0, y: 0 };
    let frame = 0;
    let running = true;
    const pageCount = book.sheets.length;
    const setPointer = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    const pickPage = () => {
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(book.meshes, false);
      if (!hits.length) return null;
      return hits[0].object.userData.pageIndex;
    };
    const hintTarget = { x: 0, y: 0 };
    const hintPos = { x: 0, y: 0 };
    let hintShow = false;
    let hintVis = 0;
    const applyHint = () => {
      if (!hint) return;
      const scale = 0.82 + 0.18 * hintVis;
      hint.style.opacity = String(hintVis);
      hint.style.transform = `translate3d(${hintPos.x}px, ${hintPos.y}px, 0) translate(-50%, -50%) scale(${scale})`;
    };
    const onMove = (event) => {
      const rect = wrap.getBoundingClientRect();
      if (rect.width && rect.height) {
        tilt.x = clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1);
        tilt.y = clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1);
      }
      if (!interactive) return;
      setPointer(event);
      const index = pickPage();
      wrap.style.cursor = index !== null ? "pointer" : "default";
      book.highlight(index);
      hintShow = Boolean(hint) && index !== null && !book.sheets[0].opened;
      if (hintShow) {
        hintTarget.x = event.clientX - rect.left;
        hintTarget.y = event.clientY - rect.top;
        if (hintVis < 0.02) {
          hintPos.x = hintTarget.x;
          hintPos.y = hintTarget.y;
        }
      }
    };
    const onClick = (event) => {
      if (!interactive) return;
      setPointer(event);
      const index = pickPage();
      if (index === null) {
        book.setPage(0);
        book.highlight(null);
        return;
      }
      const opened = book.sheets[index].opened;
      book.setPage(opened ? index : index + 1);
      book.highlight(null);
      hintShow = false;
    };
    const onLeave = () => {
      tilt.x = 0;
      tilt.y = 0;
      wrap.style.cursor = "default";
      book.highlight(null);
      hintShow = false;
    };
    const resize = () => {
      const { clientWidth, clientHeight } = wrap;
      if (!clientWidth || !clientHeight) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight, false);
    };
    const tick = () => {
      if (!running) return;
      const delta = Math.min(clock.getDelta(), 1 / 30);
      book.update(delta);
      if (hint) {
        const followHint = 1 - Math.exp(-12 * delta);
        const openHint = 1 - Math.exp(-9 * delta);
        hintVis += ((hintShow ? 1 : 0) - hintVis) * openHint;
        hintPos.x += (hintTarget.x - hintPos.x) * followHint;
        hintPos.y += (hintTarget.y - hintPos.y) * followHint;
        applyHint();
      }
      const idle = Math.abs(tilt.x) < 1e-3 && Math.abs(tilt.y) < 1e-3;
      const follow = delta * (idle ? TILT_RETURN : TILT_FOLLOW);
      const targetX = -tilt.y * MathUtils.degToRad(TILT_PITCH * tiltStrength);
      const targetY = tilt.x * MathUtils.degToRad(TILT_YAW * tiltStrength);
      const targetZ = -tilt.x * MathUtils.degToRad(TILT_ROLL * tiltStrength);
      tiltGroup.rotation.x += (targetX - tiltGroup.rotation.x) * follow;
      tiltGroup.rotation.y += (targetY - tiltGroup.rotation.y) * follow;
      tiltGroup.rotation.z += (targetZ - tiltGroup.rotation.z) * follow;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    resize();
    tick();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    const vis = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        if (visible && !running) {
          running = true;
          clock.getDelta();
          tick();
        } else if (!visible && running) {
          running = false;
          cancelAnimationFrame(frame);
        }
      },
      { rootMargin: "20% 0px", threshold: 0 }
    );
    vis.observe(wrap.parentElement ?? wrap);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("click", onClick);
    const api = {
      canvas,
      pageCount,
      open(page = 1) {
        book.setPage(Math.max(1, Math.min(pageCount, page)));
      },
      close() {
        book.setPage(0);
      },
      setPage(page) {
        book.setPage(page);
      },
      dispose() {
        running = false;
        cancelAnimationFrame(frame);
        observer.disconnect();
        vis.disconnect();
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerleave", onLeave);
        canvas.removeEventListener("click", onClick);
        book.dispose();
        ground.geometry.dispose();
        ground.material.dispose();
        renderer.dispose();
        wrap.style.cursor = "default";
      }
    };
    canvas.dispatchEvent(new CustomEvent("book:ready", { detail: api, bubbles: true }));
    return api;
  }
  function init() {
    if (typeof window.THREE === "undefined") {
      console.warn("[book] Three.js is not loaded");
      return;
    }
    window.site = window.site || {};
    window.site.books = window.site.books || /* @__PURE__ */ new Map();
    document.querySelectorAll("[data-book]").forEach((canvas) => {
      if (window.site.books.has(canvas)) return;
      const api = mountBook(canvas);
      if (api) window.site.books.set(canvas, api);
    });
  }
  onReady(init);
})();
