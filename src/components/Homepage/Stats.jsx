"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CYCLES = 4;
const DIGITS = Array.from({ length: 10 }, (_, i) => i);

const STATS = [
  {
    value: "3",
    label: "Original Research Reports",
  },
  {
    value: "20+",
    label: "Frontier Companies & Case Studies",
  },
  {
    value: "4",
    label: (
      <>
        AI Capability
        <br />
        Frontiers Explored
      </>
    ),
  },
];

function DigitReel({ digit }) {
  const strip = Array.from({ length: CYCLES * 10 }, (_, i) => i % 10);

  return (
    <span className="relative block h-[1.2em] overflow-hidden px-[0.04em]">
      <span
        data-stat-reel
        data-digit={digit}
        className="flex flex-col will-change-transform"
      >
        {strip.map((n, i) => (
          <span
            key={`${n}-${i}`}
            className="flex h-[1.2em] items-center justify-center leading-none"
          >
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

function SlotValue({ value }) {
  return (
    <span className="flex h-[1.2em] items-center justify-center overflow-visible text-hero leading-none text-primary">
      {[...value].map((char, i) =>
        /\d/.test(char) ? (
          <DigitReel key={`${char}-${i}`} digit={char} />
        ) : (
          <span key={`${char}-${i}`} className="leading-none">
            {char}
          </span>
        )
      )}
    </span>
  );
}

export default function Stats() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const reels = gsap.utils.toArray("[data-stat-reel]");

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 78%",
        once: true,
        onEnter: () => {
          reels.forEach((reel, i) => {
            const digit = Number(reel.dataset.digit);
            const item = reel.firstElementChild;
            if (!item) return;
            const height = item.offsetHeight;
            const targetIndex = (CYCLES - 1) * 10 + digit;

            gsap.fromTo(
              reel,
              { y: 0 },
              {
                y: -targetIndex * height,
                duration: 1.9,
                delay: i * 0.16,
                ease: "power4.out",
              }
            );
          });
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <div
      ref={sectionRef}
      className="flex w-full border-t border-b border-foreground/25"
    >
      {STATS.map((stat, index) => (
        <div
          key={stat.value}
          className={`flex flex-1 flex-col items-center justify-center gap-[0.8vw] px-[2vw] py-[3vw] text-center ${
            index < STATS.length - 1 ? "border-r border-foreground/25" : ""
          }`}
          aria-label={`${stat.value} ${typeof stat.label === "string" ? stat.label : "AI Capability Frontiers Explored"}`}
        >
          <SlotValue value={stat.value} />
          <p className="text-meta text-foreground/70">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
