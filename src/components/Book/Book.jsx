"use client";

import { useId, useState } from "react";
import "./Book.css";

function PixelFrame({ x, y, size, thickness, fill }) {
  return (
    <>
      <rect x={x} y={y} width={size} height={thickness} fill={fill} />
      <rect
        x={x}
        y={y + size - thickness}
        width={size}
        height={thickness}
        fill={fill}
      />
      <rect x={x} y={y} width={thickness} height={size} fill={fill} />
      <rect
        x={x + size - thickness}
        y={y}
        width={thickness}
        height={size}
        fill={fill}
      />
    </>
  );
}

function CoverArt() {
  const id = `book-pixel-${useId().replace(/:/g, "")}`;
  const fill = `url(#${id})`;

  return (
    <svg
      className="book-art"
      viewBox="0 0 100 108"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={id}
          width="3.2"
          height="3.2"
          patternUnits="userSpaceOnUse"
        >
          <rect width="2.5" height="2.5" fill="#FF7A61" />
        </pattern>
      </defs>
      <rect x="8" y="0" width="84" height="5.5" fill={fill} />
      <rect x="8" y="8" width="84" height="5.5" fill={fill} />
      <PixelFrame x="8" y="16" size="84" thickness="8" fill={fill} />
      <PixelFrame x="22" y="30" size="56" thickness="7" fill={fill} />
      <PixelFrame x="34" y="42" size="32" thickness="6" fill={fill} />
      <rect x="43" y="51" width="14" height="14" fill="#FF6B4A" />
      <rect x="8" y="94" width="84" height="5.5" fill={fill} />
      <rect x="8" y="102" width="84" height="5.5" fill={fill} />
    </svg>
  );
}

export default function Book({
  kicker = "The Working Knowledge · 01",
  version = "V1.2",
  title = "Harness Engineering",
  author = "Tarun Raheja · Accel",
  meta = "V1.2 · Verified Aug 2026 · Last edited 12 Aug 2026",
  className = "",
}) {
  const [open, setOpen] = useState(false);

  return (
    <figure className={`book-wrap ${className}`.trim()}>
      <div
        className={`book${open ? " is-open" : ""}`}
        role="button"
        tabIndex={0}
        aria-pressed={open}
        aria-label={open ? `Close ${title}` : `Open ${title}`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
      >
        <div className="book-page">
          <span className="book-page-kicker">{kicker}</span>
          <p className="book-page-title">{title}</p>
          <p className="book-page-author">{author}</p>
        </div>

        <div className="book-cover">
          <div className="book-cover-front">
            <span className="book-kicker">{kicker}</span>
            <span className="book-version">{version}</span>
            <CoverArt />
            <div className="book-copy">
              <p className="book-title">{title}</p>
              <p className="book-author">{author}</p>
            </div>
          </div>
          <div className="book-cover-inside" />
        </div>

        <div className="book-pages" />
      </div>
      {meta ? <figcaption className="book-meta">{meta}</figcaption> : null}
    </figure>
  );
}
