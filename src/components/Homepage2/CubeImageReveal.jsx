"use client";

import { useEffect, useRef } from "react";

const CONFIG = {
  copy: {
    title: "The Working Files",
    line1: "The working paper for AI",
    line2: "builders",
  },
  layout: {
    sectionClass:
      "relative my-[5vw] border-l border-r h-[30vw] w-full overflow-hidden border-b border-t border-foreground/25 bg-background",
    titleClass:
      "font-sans text-[6vw] font-medium leading-none tracking-tight text-foreground",
    bodyClass:
      "mt-[1.2vw] max-w-[40vw]  font-sans text-[1.5vw] leading-snug text-primary",
  },
  grid: {
    cell: 40,
    gap: 0,
    minCols: 8,
    minRows: 6,
  },
  lock: {
    top: 2,
    side:3.5,
    bottom: 3,
    jitter: .2,
  },
  trail: {
    spread: 2,
    stamps: 6,
  },
  fade: {
    rate: 0.94,
    done: 0.02,
  },
  click: {
    waveSpeed: 0.5,
    skipChance: 0.58,
  },
  cube: {
    hue: 10,
    hueSpread: 18,
    sat: 0.68,
    satSpread: 0.22,
    litMin: 0.38,
    litMax: 0.72,
  },
  loop: {
    idleMs: 50,
    rootMargin: "80px",
  },
};

function hash(n) {
  const t = Math.sin(n * 127.1) * 43758.5453;
  return t - Math.floor(t);
}

function hslRgb(hue, sat, lit) {
  const a = sat * Math.min(lit, 1 - lit);
  const f = (n) => {
    const k = (n + hue / 30) % 12;
    return lit - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4)),
  };
}

function cubeRgb(seed, lit) {
  const { hue, hueSpread, sat, satSpread } = CONFIG.cube;
  return hslRgb(
    hue + hash(seed) * hueSpread,
    sat + hash(seed + 11) * satSpread,
    lit
  );
}

function lockChance(x, y, cols, rows) {
  const { top, side, bottom, jitter } = CONFIG.lock;
  const topD = Math.max(0.4, top + (hash(x * 17 + 3) - 0.5) * 2 * jitter);
  const botD = Math.max(0.4, bottom + (hash(x * 23 + 9) - 0.5) * 2 * jitter);
  const leftD = Math.max(0.4, side + (hash(y * 19 + 5) - 0.5) * 2 * jitter);
  const rightD = Math.max(0.4, side + (hash(y * 29 + 11) - 0.5) * 2 * jitter);
  const p = Math.max(
    1 - (y + 0.5) / topD,
    1 - (rows - y - 0.5) / botD,
    1 - (x + 0.5) / leftD,
    1 - (cols - x - 0.5) / rightD
  );
  if (p <= 0) return 0;
  return hash(x * 47 + y * 13 + 71) < p * 0.58 ? 1 : 0;
}

function buildField(cols, rows) {
  const n = cols * rows;
  const restR = new Uint8Array(n);
  const restG = new Uint8Array(n);
  const restB = new Uint8Array(n);
  const cover = new Float32Array(n);
  const fading = new Uint8Array(n);
  const locked = new Uint8Array(n);
  const { litMin, litMax } = CONFIG.cube;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      const gx = Math.floor(x / 2);
      const gy = Math.floor(y / 2);
      const nx = gx / Math.max(Math.floor(cols / 2), 1);
      const ny = gy / Math.max(Math.floor(rows / 2), 1);
      const g = Math.min(
        1,
        Math.max(
          0,
          0.16 + nx * 0.28 + ny * 0.52 + (hash(gx * 17 + gy * 29) - 0.5) * 0.22
        )
      );
      const lit = Math.min(
        litMax,
        Math.max(litMin, litMin + g * (litMax - litMin) + (hash(i + 41) - 0.5) * 0.1)
      );
      const rgb = cubeRgb(gx * 17 + gy * 29 + i, lit);
      restR[i] = rgb.r;
      restG[i] = rgb.g;
      restB[i] = rgb.b;
      cover[i] = 1;
      locked[i] = lockChance(x, y, cols, rows);
    }
  }

  return { restR, restG, restB, cover, fading, locked, dirty: [] };
}

export default function CubeImageReveal() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    canvas.style.background = "transparent";

    const prepCtx = () => {
      ctx.imageSmoothingEnabled = false;
      ctx.globalAlpha = 1;
    };

    const { cell, gap, minCols, minRows } = CONFIG.grid;
    const { spread, stamps } = CONFIG.trail;
    const { rate: fadeRate, done: fadeDone } = CONFIG.fade;
    const { waveSpeed, skipChance } = CONFIG.click;
    const idleMs = CONFIG.loop.idleMs;

    let cols = 24;
    let rows = 12;
    let field = buildField(cols, rows);
    let raf = 0;
    let visible = true;
    let lastIdle = 0;
    let lastCol = -1;
    let lastRow = -1;
    let seed = 1;
    const waves = [];
    const rect = { left: 0, top: 0, width: 1, height: 1 };

    const cacheRect = () => {
      const r = canvas.getBoundingClientRect();
      rect.left = r.left;
      rect.top = r.top;
      rect.width = r.width || 1;
      rect.height = r.height || 1;
    };

    const reveal = (x, y) => {
      if (x < 0 || y < 0 || x >= cols || y >= rows) return;
      const i = y * cols + x;
      if (field.locked[i] || field.cover[i] <= 0) return;
      if (!field.fading[i]) {
        field.fading[i] = 1;
        field.dirty.push(i);
      }
    };

    const stampAt = (cx, cy, s) => {
      const span = spread * 2 + 1;
      for (let k = 0; k < stamps; k++) {
        reveal(
          cx + Math.floor(hash(s * 17 + k * 91) * span) - spread,
          cy + Math.floor(hash(s * 29 + k * 53) * span) - spread
        );
      }
      const radius = spread + 0.35;
      for (let y = cy - spread; y <= cy + spread; y++) {
        for (let x = cx - spread; x <= cx + spread; x++) {
          const dd = (x - cx) * (x - cx) + (y - cy) * (y - cy);
          if (dd > radius * radius) continue;
          reveal(x, y);
        }
      }
    };

    const stampRing = (ox, oy, r, s) => {
      const visit = (x, y) => {
        if (hash(x * 13 + y * 47 + s + r * 9) > skipChance) return;
        reveal(x, y);
      };
      if (r <= 0) {
        visit(ox, oy);
        return;
      }
      for (let x = ox - r; x <= ox + r; x++) {
        visit(x, oy - r);
        visit(x, oy + r);
      }
      for (let y = oy - r + 1; y < oy + r; y++) {
        visit(ox - r, y);
        visit(ox + r, y);
      }
    };

    const cellFromEvent = (event) => {
      const col = Math.max(
        0,
        Math.min(
          cols - 1,
          Math.floor(((event.clientX - rect.left) / rect.width) * cols)
        )
      );
      const row = Math.max(
        0,
        Math.min(
          rows - 1,
          Math.floor(((event.clientY - rect.top) / rect.height) * rows)
        )
      );
      return { col, row };
    };

    const paint = () => {
      const { restR, restG, restB, cover } = field;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0, y = 0; y < rows; y++) {
        const y0 = Math.floor((y * h) / rows);
        const y1 = Math.floor(((y + 1) * h) / rows) + 1;
        for (let x = 0; x < cols; x++, i++) {
          const vis = cover[i];
          if (vis < fadeDone) continue;
          const x0 = Math.floor((x * w) / cols);
          const x1 = Math.floor(((x + 1) * w) / cols) + 1;
          ctx.globalAlpha = vis;
          ctx.fillStyle = `rgb(${restR[i]},${restG[i]},${restB[i]})`;
          ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now) => {
      if (!visible) {
        raf = 0;
        return;
      }

      const busy = waves.length || field.dirty.length;
      if (!busy && now - lastIdle < idleMs) {
        raf = requestAnimationFrame(tick);
        return;
      }
      lastIdle = now;

      const maxR = Math.max(cols, rows) + 3;
      let keep = 0;
      for (let w = 0; w < waves.length; w++) {
        const wave = waves[w];
        wave.r += waveSpeed;
        const ri = Math.floor(wave.r);
        while (wave.last < ri) {
          wave.last += 1;
          stampRing(wave.ox, wave.oy, wave.last, wave.seed);
        }
        if (wave.r <= maxR) waves[keep++] = wave;
      }
      waves.length = keep;

      const { cover, fading, dirty } = field;
      let write = 0;
      for (let d = 0; d < dirty.length; d++) {
        const i = dirty[d];
        const next = cover[i] * fadeRate;
        if (next < fadeDone) {
          cover[i] = 0;
          fading[i] = 0;
        } else {
          cover[i] = next;
          dirty[write++] = i;
        }
      }
      dirty.length = write;

      paint();
      raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(tick);
    };

    const resize = () => {
      const { width, height } = section.getBoundingClientRect();
      const nextCols = Math.max(
        minCols,
        Math.round((width + gap) / (cell + gap))
      );
      const nextRows = Math.max(
        minRows,
        Math.round((height + gap) / (cell + gap))
      );
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      prepCtx();
      if (nextCols !== cols || nextRows !== rows) {
        cols = nextCols;
        rows = nextRows;
        field = buildField(cols, rows);
        lastCol = -1;
        lastRow = -1;
        waves.length = 0;
      }
      cacheRect();
      paint();
    };

    const onMove = (event) => {
      const { col, row } = cellFromEvent(event);
      if (col === lastCol && row === lastRow) return;
      if (lastCol < 0) {
        seed += 1;
        stampAt(col, row, seed);
      } else {
        const steps = Math.max(Math.abs(col - lastCol), Math.abs(row - lastRow));
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          seed += 1;
          stampAt(
            Math.round(lastCol + (col - lastCol) * t),
            Math.round(lastRow + (row - lastRow) * t),
            seed
          );
        }
      }
      lastCol = col;
      lastRow = row;
      kick();
    };

    const onLeave = () => {
      lastCol = -1;
      lastRow = -1;
    };

    const onClick = (event) => {
      cacheRect();
      const { col, row } = cellFromEvent(event);
      seed += 1;
      waves.push({ ox: col, oy: row, r: 0, last: -1, seed });
      kick();
    };

    resize();
    cacheRect();
    raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(resize);
    ro.observe(section);
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        if (visible) kick();
        else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: CONFIG.loop.rootMargin }
    );
    io.observe(section);

    canvas.addEventListener("pointerenter", cacheRect);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("click", onClick);
    window.addEventListener("scroll", cacheRect, { passive: true });

    return () => {
      visible = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerenter", cacheRect);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("scroll", cacheRect);
    };
  }, []);

  return (
    <section ref={sectionRef} className={CONFIG.layout.sectionClass}>
      <div className="pointer-events-none absolute  inset-0 z-0 flex flex-col items-center justify-center px-[5vw] text-center">
        <p className={CONFIG.layout.titleClass}>{CONFIG.copy.title}</p>
        <p className={CONFIG.layout.bodyClass}>
          {CONFIG.copy.line1}
          <br />
          {CONFIG.copy.line2}
        </p>
      </div>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 block h-full w-full cursor-pointer bg-transparent"
      />
    </section>
  );
}
