"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const GRID_CELLS = 4;
const PAIR = 0.32;

const GRID_LINES = Array.from({ length: GRID_CELLS }, (_, i) => {
  const origin = (i / GRID_CELLS) * 100;
  return [origin, origin + PAIR * (100 / GRID_CELLS)];
})
  .flat()
  .filter((pos) => pos > 0.5 && pos < 99.5);

const POINTS = [
  {
    number: "01",
    description:
      "Every claim traces straight back to a conversation, a paper, or a number, plainly enough to check yourself.",
  },
  {
    number: "02",
    description:
      "A framework built to be put to use the same day you read it.",
  },
  {
    number: "03",
    description:
      "Every report can open a direct conversation with the person who wrote it.",
  },
];

export default function AboutV2() {
  const wrapRef = useRef(null);
  const pinRef = useRef(null);

  useGSAP(
    () => {
      const pin = pinRef.current;
      const wrap = wrapRef.current;
      if (!pin || !wrap) return;

      const heading = pin.querySelector("[data-about-heading]");
      const body = pin.querySelector("[data-about-body]");
      const kicker = pin.querySelector("[data-about-kicker]");
      const points = gsap.utils.toArray("[data-about-point]");
      if (!heading || !body) return;

      const splits = [];
      const headingSplit = SplitText.create(heading, {
        type: "lines",
        mask: "lines",
      });
      const bodySplit = SplitText.create(body, {
        type: "lines",
        mask: "lines",
      });
      splits.push(headingSplit, bodySplit);

      const pointCopy = points.map((point) => {
        const desc = point.querySelector("[data-about-desc]");
        const num = point.querySelector("[data-about-num]");
        const split = SplitText.create(desc, {
          type: "lines",
          mask: "lines",
        });
        splits.push(split);
        return { num, lines: split.lines };
      });

      gsap.set(kicker, { autoAlpha: 0, y: 16 });
      gsap.set(headingSplit.lines, { yPercent: 110 });
      gsap.set(bodySplit.lines, { yPercent: 110 });
      pointCopy.forEach(({ num, lines }) => {
        gsap.set(num, { autoAlpha: 0, y: 12 });
        gsap.set(lines, { yPercent: 110 });
      });

      const vLines = gsap.utils.toArray("[data-about-grid-v]");
      const hLines = gsap.utils.toArray("[data-about-grid-h]");
      gsap.set(vLines, { scaleY: 0, transformOrigin: "50% 0%" });
      gsap.set(hLines, { scaleX: 0, transformOrigin: "0% 50%" });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrap,
          start: "top 75%",
          end: "bottom bottom",
          markers: false,
          scrub: true,
        },
      });

      tl.to(kicker, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.12);
      tl.to(
        headingSplit.lines,
        { yPercent: 0, stagger: 0.12, duration: 1.2 },
        0.05
      );
      tl.to(
        bodySplit.lines,
        { yPercent: 0, stagger: 0.1, duration: 0.9 },
        0.35
      );
      tl.to({}, { duration: 0.85 });

      pointCopy.forEach(({ num, lines }, i) => {
        const at = 1.8 + i * 0.5;
        tl.to(num, { autoAlpha: 1, y: 0, duration: 0.28 }, at);
        tl.to(
          lines,
          { yPercent: 0, stagger: 0.08, duration: 0.55 },
          at + 0.04
        );
      });

      const total = tl.duration();
      tl.to(vLines, { scaleY: 1, duration: total }, 0);
      tl.to(hLines, { scaleX: 1, duration: total }, 0);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        splits.forEach((split) => split.revert());
      };
    },
    { scope: pinRef }
  );

  return (
    <div ref={wrapRef} className="relative h-[150vh]">
      <section
        ref={pinRef}
        className="sticky top-0 flex h-screen w-full items-center border-l border-r border-t border-foreground/25 bg-[#EFEBE4] text-foreground"
      >

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-px overflow-hidden"
        >
          {GRID_LINES.map((pos) => (
            <span
              key={`v-${pos}`}
              data-about-grid-v
              className="absolute top-0 h-full w-px bg-foreground/10 will-change-transform"
              style={{ left: `${pos}%` }}
            />
          ))}
          {GRID_LINES.map((pos) => (
            <span
              key={`h-${pos}`}
              data-about-grid-h
              className="absolute left-0 h-px w-full bg-foreground/10 will-change-transform"
              style={{ top: `${pos}%` }}
            />
          ))}
        </div>
        <div className="flex relative z-10 w-full items-start justify-between gap-[5vw] px-[5vw] py-[8vw] max-md:flex-col max-md:gap-12">
          <div className="w-[50%] shrink-0 max-md:w-full">
            <p
              data-about-kicker
              className="text-meta uppercase text-foreground"
            >
              About the Series
            </p>
            <h2
              data-about-heading
              className="mt-[4vw] pr-[2vw] font-glare text-[2.35vw] font-light leading-[1.18] text-foreground max-md:mt-4 max-md:text-[28px]"
            >
              Every model generation gets louder. The Working Knowledge is where
              that noise gets sorted into ground-level thinking: research and
              reasoning built from direct conversations with the engineers and
              founders running these systems, checked against what&apos;s
              already public, and credited to the person who wrote it.
            </h2>
          </div>

          <div className="w-[40%] pt-[2.8vw] max-md:w-full max-md:pt-0">
            <p
              data-about-body
              className="w-[95%] text-content text-foreground"
            >
              Each report starts as a private working memo before it&apos;s
              refined for publication. Three reports so far, each dense enough
              to hand straight to the teams building fastest.
            </p>

            <ul className="mt-[3.6vw] flex flex-col gap-[2.6vw] max-md:mt-10 max-md:gap-8">
              {POINTS.map((point) => (
                <li
                  key={point.number}
                  data-about-point
                  className="flex items-start gap-[2.2vw] max-md:gap-5"
                >
                  <p
                    data-about-num
                    className="w-[3.2vw] shrink-0 pt-[0.15vw] text-meta text-primary max-md:w-8"
                  >
                    {point.number}
                  </p>
                  <p
                    data-about-desc
                    className="max-w-[24vw] text-content text-foreground max-md:max-w-none"
                  >
                    {point.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
