"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitText from "@/components/Reusable/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const POINTS = [
  {
    number: "01",
    title: "Traceable",
    description:
      "Every claim traces straight back to a conversation, a paper, or a number, plainly enough to check yourself.",
  },
  {
    number: "02",
    title: "Practical",
    description:
      "A framework built to be put to use the same day you read it.",
  },
  {
    number: "03",
    title: "Direct",
    description:
      "Every report can open a direct conversation with the person who wrote it.",
  },
];

export default function AboutTheSeries() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      if (window.innerWidth < 1025) return;

      const cards = gsap.utils.toArray("[data-series-card]");
      const tweens = cards.map((card) =>
        gsap.fromTo(
          card,
          { width: "65%" },
          {
            width: "100%",
            ease: "power1.out",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom 35%",
              scrub: true,
            },
          }
        )
      );

      return () =>
        tweens.forEach((tween) => tween.scrollTrigger && tween.scrollTrigger.kill());
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-visible border-t border-foreground/25 pt-[4vw] pb-[8vw]"
    >
      <div className="flex items-center flex-col justify-between gap-[2vw] max-md:flex-col max-md:gap-6">
        <SplitText
          as="h2"
          className="text-title w-full text-center shrink-0 text-foreground max-md:w-full"
        >
          About the Series
        </SplitText>
        <div className="w-[50vw] max-md:w-full">
          <SplitText as="p" className="text-content text-foreground">
            Each report starts as a private working memo before it&apos;s
            refined for publication. Three reports so far, each dense enough to
            hand straight to the teams building fastest.
          </SplitText>
        </div>
      </div>

      <div className="mt-[6vw] flex w-full flex-col items-end gap-[1vw] overflow-visible max-md:mt-10 max-md:items-stretch max-md:gap-4">
        {POINTS.map((point) => (
          <article
            key={point.number}
            data-series-card
            className="flex w-[65%] items-stretch overflow-visible border-t border-b border-l border-foreground/25 max-md:w-full max-md:flex-col"
          >
            <div className="flex w-[28%] shrink-0 items-end justify-end overflow-visible border-r border-foreground/25 pb-[2vw] pt-[2.5vw] max-md:w-full max-md:items-start max-md:justify-start max-md:border-r-0 max-md:border-b max-md:px-5 max-md:py-3">
              <p className="pr-[1vw] text-hero font-medium leading-none text-primary max-md:pr-0">
                {point.number}
              </p>
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-center gap-[1.2vw] px-[2.4vw] py-[2.4vw] max-md:gap-4 max-md:p-5">
              <SplitText as="h3" className="text-content text-primary">
                {point.title}
              </SplitText>
              <SplitText
                as="p"
                className="max-w-[36vw] text-content text-foreground/90 max-md:max-w-none"
              >
                {point.description}
              </SplitText>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
