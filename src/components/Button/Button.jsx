"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

const slide =
  "transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]";
const FILL = 24;

function ArrowRight({ className = "" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`size-[1.2em] ${className}`}
    >
      <path
        d="M3 8h10M9 4.5 13 8l-4 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowDown({ className = "" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`size-[1.2em] ${className}`}
    >
      <path
        d="M8 3v10M4.5 9.5 8 13l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function coverScale(x, y, w, h) {
  const radius = Math.max(
    Math.hypot(x, y),
    Math.hypot(w - x, y),
    Math.hypot(x, h - y),
    Math.hypot(w - x, h - y)
  );
  return (radius * 2) / FILL;
}

export default function Button({
  title,
  href,
  arrow = "right",
  className = "",
  ...props
}) {
  const wrapRef = useRef(null);
  const fillRef = useRef(null);
  const tween = useRef(null);
  const Comp = href ? Link : "div";
  const down = arrow === "down";
  const Icon = down ? ArrowDown : ArrowRight;
  const light = className.includes("bg-background");
  const fillClass = light ? "bg-foreground" : "bg-primary";

  useEffect(() => () => tween.current?.kill(), []);

  const localPoint = (event) => {
    const rect = wrapRef.current.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      w: rect.width,
      h: rect.height,
    };
  };

  const onEnter = (event) => {
    const fill = fillRef.current;
    if (!fill) return;
    const { x, y, w, h } = localPoint(event);
    tween.current?.kill();
    gsap.set(fill, { left: x, top: y, scale: 0 });
    tween.current = gsap.to(fill, {
      scale: coverScale(x, y, w, h),
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const onLeave = (event) => {
    const fill = fillRef.current;
    if (!fill) return;
    const { x, y } = localPoint(event);
    tween.current?.kill();
    gsap.set(fill, { left: x, top: y });
    tween.current = gsap.to(fill, {
      scale: 0,
      duration: 0.5,
      ease: "power2.inOut",
    });
  };

  return (
    <Comp
      ref={wrapRef}
      {...(href ? { href } : {})}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`group relative inline-flex cursor-pointer items-center gap-[0.7vw] overflow-hidden bg-foreground px-[2vw] py-[1vw] text-background ${className} ${light ? "hover:!text-background" : ""}`}
      {...props}
    >
      <span
        ref={fillRef}
        aria-hidden
        className={`pointer-events-none absolute top-0 left-0 z-0 block rounded-full ${fillClass}`}
        style={{
          width: FILL,
          height: FILL,
          marginLeft: -FILL / 2,
          marginTop: -FILL / 2,
          transform: "scale(0)",
        }}
      />
      <span className="relative z-10 overflow-hidden">
        <span className={`block ${slide} group-hover:-translate-y-[110%]`}>
          {title}
        </span>
        <span
          className={`absolute inset-0 block translate-y-[110%] ${slide} group-hover:translate-y-0`}
        >
          {title}
        </span>
      </span>
      <span className="relative z-10 inline-flex size-[1.2em] overflow-hidden">
        <Icon
          className={`absolute inset-0 ${slide} ${
            down
              ? "group-hover:translate-y-[130%]"
              : "group-hover:translate-x-[130%]"
          }`}
        />
        <Icon
          className={`absolute inset-0 ${slide} ${
            down
              ? "-translate-y-[130%] group-hover:translate-y-0"
              : "-translate-x-[130%] group-hover:translate-x-0"
          }`}
        />
      </span>
    </Comp>
  );
}
