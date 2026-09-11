"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitText from "@/components/Reusable/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CYCLES = 4;
const CREAM = "#FBF8F3";

function DigitReel({ digit }) {
  const strip = Array.from({ length: CYCLES * 10 }, (_, i) => i % 10);

  return (
    <span className="relative inline-block h-[1.2em] overflow-hidden">
      <span className="invisible block leading-none">{digit}</span>
      <span
        data-stat-reel
        data-digit={digit}
        className="absolute inset-x-0 top-0 flex flex-col items-center will-change-transform"
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

function SlotValue({ value, className = "" }) {
  return (
    <span
      className={`flex h-[1.2em] items-center font-glare leading-none ${className}`}
      style={{ color: CREAM }}
    >
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

export default function StatsV2() {
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
    <section
      ref={sectionRef}
      className=" flex h-fit my-[8vw] w-full max-md:min-h-0 max-md:flex-col"
    >
      <div className="flex w-1/2 flex-col justify-between bg-foreground px-[5vw] py-[6vw] max-md:w-full max-md:gap-16 max-md:py-16">
        <SplitText
          as="h2"
          className="max-w-[34vw] text-title leading-[1.05] text-[#FAFFE9] max-md:max-w-none"
        >
          Research built for <span className="text-primary">AI builders.</span>
        </SplitText>

        <div className="flex gap-[4vw] max-md:gap-10">
          <div aria-label="3 Original Research Reports">
            <SlotValue value="3" className="text-hero text-#FAFFE9][" />
            <p className="mt-[1vw] max-w-[10vw] text-meta text-[#FBF8F3]/80 max-md:mt-3 max-md:max-w-[8rem]">
              Original Research Reports
            </p>
          </div>
          <div aria-label="20+ Frontier Companies & Case Studies">
            <SlotValue value="20+" className="text-hero text-[#FAFFE9]" />
            <p className="mt-[1vw] max-w-[12vw] text-meta text-[#FBF8F3]/80 max-md:mt-3 max-md:max-w-[10rem]">
              Frontier Companies & Case Studies
            </p>
          </div>
        </div>
      </div>

      <div
        className="flex w-1/2 flex-col items-center justify-center bg-primary px-[4vw] py-[10vw] text-center max-md:w-full max-md:min-h-[70vw] max-md:py-20"
        aria-label="4 AI Capability Frontiers Explored"
      >
        <SlotValue value="4" className="text-[16vw] max-md:text-[28vw]" />
        <p className="-mt-[1.4vw] text-content text-[#FBF8F3] max-md:mt-4">
          AI Capability
          <br />
          Frontiers Explored
        </p>
      </div>
    </section>
  );
}
