"use client";

import { useEffect, useRef } from "react";

const CELL = 40;
const GAP = 2;
const BG = "#FBF8F3";
const HOT = { r: 255, g: 54, b: 33 };
const SPREAD = 2;
const STAMPS = 6;
const REVEAL = 2;
const IDLE_MS = 50;

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

function orangeRgb(seed) {
  return hslRgb(
    10 + hash(seed) * 14,
    0.62 + hash(seed + 11) * 0.3,
    0.5 + hash(seed + 23) * 0.16
  );
}

const GLYPHS = {
  T: ["11111", "00100", "00100", "00100", "00100"],
  W: ["10001", "10001", "10101", "11011", "10001"],
  F: ["11110", "10000", "11100", "10000", "10000"],
};

function stampTWF(field, cols, rows) {
  const letters = ["T", "W", "F"];
  const gh = 5;
  const gap = 1;
  const unitsW = letters.reduce(
    (w, ch, i) =>
      w + GLYPHS[ch][0].length + (i < letters.length - 1 ? gap : 0),
    0
  );
  const scale = Math.max(
    1,
    Math.min(Math.floor(cols / unitsW), Math.floor(rows / gh)) - 1
  );
  const cellW = scale;
  const cellH = scale;
  const ox = Math.floor((cols - unitsW * cellW) / 2);
  const oy = Math.floor((rows - gh * cellH) / 2);
  const letter = new Uint8Array(cols * rows);

  const paintCell = (gx, gy) => {
    for (let dy = 0; dy < cellH; dy++) {
      for (let dx = 0; dx < cellW; dx++) {
        const x = gx + dx;
        const y = gy + dy;
        if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
        letter[y * cols + x] = 1;
      }
    }
  };

  let cursor = ox;
  letters.forEach((ch, i) => {
    const rowsG = GLYPHS[ch];
    const gw = rowsG[0].length;
    for (let gy = 0; gy < gh; gy++) {
      for (let gx = 0; gx < gw; gx++) {
        if (rowsG[gy][gx] !== "1") continue;
        paintCell(cursor + gx * cellW, oy + gy * cellH);
      }
    }
    cursor += (gw + (i < letters.length - 1 ? gap : 0)) * cellW;
  });

  field.letter = letter;
}

function buildField(cols, rows) {
  const n = cols * rows;
  const restA = new Float32Array(n);
  const restR = new Uint8Array(n);
  const restG = new Uint8Array(n);
  const restB = new Uint8Array(n);
  const phase = new Float32Array(n);
  const heat = new Float32Array(n);
  const marked = new Uint8Array(n);
  const shown = new Float32Array(n);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      const gx = Math.floor(x / 2);
      const gy = Math.floor(y / 2);
      const nx = gx / Math.max(Math.floor(cols / 2), 1);
      const ny = gy / Math.max(Math.floor(rows / 2), 1);
      const g =
        0.16 + nx * 0.22 + ny * 0.6 + (hash(gx * 17 + gy * 29) - 0.5) * 0.2;
      const a = Math.min(0.95, Math.max(0.18, g));
      const rgb = orangeRgb(gx * 17 + gy * 29 + i);
      restA[i] = a;
      restR[i] = rgb.r;
      restG[i] = rgb.g;
      restB[i] = rgb.b;
      phase[i] = hash(i * 19 + 7) * Math.PI * 2;
    }
  }

  const field = {
    restA,
    restR,
    restG,
    restB,
    phase,
    heat,
    marked,
    shown,
    letter: new Uint8Array(n),
    dirty: [],
  };
  stampTWF(field, cols, rows);
  return field;
}

export default function CubeIntrerationsection() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const hintRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    let cols = 24;
    let rows = 12;
    let field = buildField(cols, rows);
    let raf = 0;
    let visible = true;
    let lastIdle = 0;
    let lastCol = -1;
    let lastRow = -1;
    let seed = 1;
    let twfRevealed = false;
    const waves = [];
    const rect = { left: 0, top: 0, width: 1, height: 1 };

    const cacheRect = () => {
      const r = canvas.getBoundingClientRect();
      rect.left = r.left;
      rect.top = r.top;
      rect.width = r.width || 1;
      rect.height = r.height || 1;
    };

    const mark = (i) => {
      if (field.marked[i]) return;
      field.marked[i] = 1;
      field.dirty.push(i);
    };

    const stampAt = (cx, cy, s) => {
      const span = SPREAD * 2 + 1;
      const { heat, letter, shown } = field;
      for (let k = 0; k < STAMPS; k++) {
        const x = cx + Math.floor(hash(s * 17 + k * 91) * span) - SPREAD;
        const y = cy + Math.floor(hash(s * 29 + k * 53) * span) - SPREAD;
        if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
        const i = y * cols + x;
        heat[i] = 1;
        mark(i);
      }
      for (let y = cy - REVEAL; y <= cy + REVEAL; y++) {
        for (let x = cx - REVEAL; x <= cx + REVEAL; x++) {
          if (x < 0 || y < 0 || x >= cols || y >= rows) continue;
          const dd = (x - cx) * (x - cx) + (y - cy) * (y - cy);
          if (dd > REVEAL * REVEAL) continue;
          const i = y * cols + x;
          const fall = 1 - Math.sqrt(dd) / (REVEAL + 0.35);
          heat[i] = Math.max(heat[i], fall);
          if (letter[i]) shown[i] = Math.min(1, shown[i] + 0.4 + fall * 0.6);
          mark(i);
        }
      }
    };

    const stampRing = (ox, oy, r, s) => {
      const { heat, letter, shown } = field;
      const visit = (x, y) => {
        if (x < 0 || y < 0 || x >= cols || y >= rows) return;
        if (hash(x * 13 + y * 47 + s + r * 9) > 0.58) return;
        const i = y * cols + x;
        heat[i] = heat[i] > 0.75 ? 1 : heat[i] + 0.65;
        if (letter[i]) shown[i] = Math.min(1, shown[i] + 0.85);
        mark(i);
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
        Math.min(cols - 1, Math.floor(((event.clientX - rect.left) / rect.width) * cols))
      );
      const row = Math.max(
        0,
        Math.min(rows - 1, Math.floor(((event.clientY - rect.top) / rect.height) * rows))
      );
      return { col, row };
    };

    const paint = (now) => {
      const { restA, restR, restG, restB, phase, heat, letter, shown } = field;
      const w = canvas.width;
      const h = canvas.height;
      const cw = (w - GAP * (cols - 1)) / cols;
      const ch = (h - GAP * (rows - 1)) / rows;
      const hasPointer = lastCol >= 0;

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0, y = 0; y < rows; y++) {
        const py = y * (ch + GAP);
        for (let x = 0; x < cols; x++, i++) {
          const ht = heat[i];
          let a =
            restA[i] *
            (0.9 + 0.1 * (0.5 + 0.5 * Math.sin(now * 0.0017 + phase[i])));
          let r = restR[i];
          let g = restG[i];
          let b = restB[i];
          let vis = shown[i];
          if (hasPointer) {
            const dx = x - lastCol;
            const dy = y - lastRow;
            vis = Math.max(vis, Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 3.4));
          }
          if (letter[i] && vis > 0.02) {
            a = restA[i] + (1 - restA[i]) * vis;
            r += (HOT.r - r) * vis;
            g += (HOT.g - g) * vis;
            b += (HOT.b - b) * vis;
          } else if (ht > 0.02) {
            a = Math.min(1, restA[i] + 0.25 + ht * 0.75);
            const t = Math.min(1, ht * 1.2);
            r += (HOT.r - r) * t;
            g += (HOT.g - g) * t;
            b += (HOT.b - b) * t;
          }
          ctx.globalAlpha = a;
          ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
          ctx.fillRect(x * (cw + GAP), py, cw, ch);
        }
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now) => {
      if (!visible) {
        raf = 0;
        return;
      }

      const busy = field.dirty.length || waves.length;
      if (!busy && now - lastIdle < IDLE_MS) {
        raf = requestAnimationFrame(tick);
        return;
      }
      lastIdle = now;

      const maxR = Math.max(cols, rows) + 3;
      let keep = 0;
      for (let w = 0; w < waves.length; w++) {
        const wave = waves[w];
        wave.r += 0.5;
        const ri = Math.floor(wave.r);
        while (wave.last < ri) {
          wave.last += 1;
          stampRing(wave.ox, wave.oy, wave.last, wave.seed);
        }
        if (wave.r <= maxR) waves[keep++] = wave;
      }
      waves.length = keep;

      const { heat, marked, dirty } = field;
      let write = 0;
      for (let d = 0; d < dirty.length; d++) {
        const i = dirty[d];
        const next = heat[i] * 0.93;
        if (next < 0.03) {
          heat[i] = 0;
          marked[i] = 0;
        } else {
          heat[i] = next;
          dirty[write++] = i;
        }
      }
      dirty.length = write;

      checkReveal();
      paint(now);
      raf = requestAnimationFrame(tick);
    };

    const hideHint = () => {
      if (hintRef.current) hintRef.current.style.opacity = "0";
    };

    const showHint = () => {
      if (twfRevealed || !hintRef.current) return;
      hintRef.current.style.opacity = "1";
    };

    const checkReveal = () => {
      if (twfRevealed) return;
      const { letter, shown } = field;
      let n = 0;
      let lit = 0;
      for (let i = 0; i < letter.length; i++) {
        if (!letter[i]) continue;
        n += 1;
        if (shown[i] > 0.45) lit += 1;
      }
      if (n && lit / n >= 0.22) {
        twfRevealed = true;
        hideHint();
      }
    };

    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(tick);
    };

    const resize = () => {
      const { width, height } = section.getBoundingClientRect();
      const nextCols = Math.max(8, Math.round((width + GAP) / (CELL + GAP)));
      const nextRows = Math.max(6, Math.round((height + GAP) / (CELL + GAP)));
      canvas.width = Math.max(1, Math.round(width));
      canvas.height = Math.max(1, Math.round(height));
      if (nextCols !== cols || nextRows !== rows) {
        cols = nextCols;
        rows = nextRows;
        field = buildField(cols, rows);
        lastCol = -1;
        lastRow = -1;
        waves.length = 0;
        twfRevealed = false;
        showHint();
      }
      cacheRect();
      paint(performance.now());
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
      hideHint();
      kick();
    };

    const onLeave = () => {
      lastCol = -1;
      lastRow = -1;
      showHint();
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
        visible = entry.isIntersecting;
        if (visible) kick();
        else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "80px" }
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
    <section
      ref={sectionRef}
      className="relative my-[5vw] h-[30vw] w-full overflow-hidden border-b border-t border-foreground/25"
    >
      <canvas ref={canvasRef} className="block h-full w-full cursor-pointer" />
      <div
        ref={hintRef}
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-foreground/40 transition-opacity duration-700"
      >
        <span
          aria-hidden
          className="block size-[1.5vw] rounded-full bg-white/60 max-md:size-2.5 [animation:cue-slide_4.8s_ease-in-out_infinite]"
        />
      </div>
    </section>
  );
}
