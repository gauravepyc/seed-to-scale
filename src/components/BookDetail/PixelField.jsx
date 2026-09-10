"use client";

import { useMemo, useRef } from "react";

const COLS = 28;
const ROWS = 14;

const PALETTE = [
  "#FF3621",
  "#FF5A3A",
  "#E02E1C",
  "#C42818",
  "#FF7A62",
  "#F4A090",
];

function hash(n) {
  const t = Math.sin(n * 127.1) * 43758.5453;
  return t - Math.floor(t);
}

function cellsFor(seed) {
  const cells = [];

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const edge = x < 2 || y < 2 || x > COLS - 3 || y > ROWS - 3;
      const live = !edge && hash(x * 19 + y * 47 + seed * 13) > 0.42;
      const rest = live ? 0.28 + hash(x * 7 + y * 31 + seed * 5) * 0.72 : 0;
      cells.push({
        x,
        y,
        live,
        rest,
        hot: live ? 0.14 + hash(x * 11 + y * 29 + seed * 9) * 0.86 : 0,
        color: PALETTE[Math.floor(hash(x + y * COLS + seed) * PALETTE.length)],
      });
    }
  }

  for (const cell of cells) {
    if (!cell.live) continue;
    let neighbors = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = cell.x + dx;
        const ny = cell.y + dy;
        if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) continue;
        if (cells[ny * COLS + nx].live) neighbors += 1;
      }
    }
    if (neighbors < 2) {
      cell.live = false;
      cell.rest = 0;
      cell.hot = 0;
    }
  }

  return cells;
}

export default function PixelField({ seed = 1, className = "" }) {
  const wrapRef = useRef(null);
  const frameRef = useRef(0);
  const posRef = useRef({ x: -999, y: -999 });
  const cells = useMemo(() => cellsFor(seed), [seed]);

  const paint = () => {
    frameRef.current = 0;
    const el = wrapRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const { x: mx, y: my } = posRef.current;
    const radius = window.innerWidth * 0.08;
    const kids = el.children;

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      if (!cell.live) continue;

      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const dx = ((col + 0.5) / COLS) * rect.width - mx;
      const dy = ((row + 0.5) / ROWS) * rect.height - my;
      const falloff = Math.max(0, 1 - Math.hypot(dx, dy) / radius);

      kids[i].style.opacity = String(
        cell.rest + (cell.hot - cell.rest) * falloff
      );
    }
  };

  const onMove = (event) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    posRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    if (!frameRef.current) frameRef.current = requestAnimationFrame(paint);
  };

  const onLeave = () => {
    posRef.current = { x: -999, y: -999 };
    if (!frameRef.current) frameRef.current = requestAnimationFrame(paint);
  };

  return (
    <div
      ref={wrapRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`pixel-field grid h-full w-full ${className}`}
      style={{
        backgroundColor: "#EEE0DA",
        gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
      }}
    >
      {cells.map((cell, i) => (
        <div
          key={i}
          className="pixel-cube"
          style={{
            backgroundColor: cell.color,
            opacity: cell.rest,
          }}
        />
      ))}
    </div>
  );
}
