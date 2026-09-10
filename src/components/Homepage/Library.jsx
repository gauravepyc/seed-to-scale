"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import BookCanvas from "../Book3D/BookCanvas";
import Button from "../Button/Button";
import SplitText from "@/components/Reusable/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FILES = [
  {
    variant: "harness",
    title: "Harness Engineering Playbook",
    body: "The model is rented. The harness is what you own, and it's where the margin lives.",
    meta: ["V1.2", "Verified Aug 2026", "Last edited 12 Aug 2026"],
    restRotation: [0.04, -0.22, -0.08],
    ready: true,
  },
  {
    variant: "frontier",
    title: "Frontier Model Capabilities",
    body: "What models absorb, what they don't, and where to invest.",
    meta: ["Draft", "3 of 7 chapters", "Last edited 28 Aug 2026"],
    restRotation: [0.05, 0.05, 0.02],
    ready: false,
  },
  {
    variant: "teams",
    title: "AI-Maximal Teams in Practice",
    body: "Case studies and patterns from the world’s most effective AI-powered teams.",
    meta: ["Draft", "1 of 7 chapters", "Last edited 2 Sep 2026"],
    restRotation: [0.03, 0.2, 0.07],
    ready: false,
  },
];

export default function Library() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const books = gsap.utils.toArray("[data-library-book]");
      const row = sectionRef.current.querySelector("[data-library-row]");
      if (!row || !books.length) return;

      gsap.fromTo(
        books,
        { yPercent: -100 },
        {
          yPercent: 0,
          stagger: 0.12,
          ease: "none",
          overwrite: "auto",
          immediateRender: true,
          scrollTrigger: {
            trigger: row,
            start: "top 50%",
            end: "top 12%",
            scrub: 1,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="library"
      className=" w-full border-b border-foreground/25 "
    >
      <div className="border-b border-t border-foreground/25 py-[4vw] pl-[1vw] flex justify-center">
        <SplitText as="h2" className="text-title leading-[1.05] text-foreground text-center">
          Research. <span className="text-primary">One evolving thesis.</span>
        </SplitText>
      </div>
 

      <div data-library-row className="flex w-full max-md:flex-col">
        {FILES.map((file, index) => {
          const Comp = file.ready ? Link : "div";

          return (
            <Comp
              key={file.variant}
              {...(file.ready ? { href: "/book-detail" } : { "aria-disabled": true })}
              className={`group flex min-w-0 flex-1 flex-col ${
                file.ready ? "cursor-pointer" : "cursor-default"
              } ${index < FILES.length - 1 ? "border-r border-foreground/25" : ""}`}
            >
              <div className="relative h-[36vw] w-full overflow-hidden max-md:h-[80vw]">
                <div data-library-book className="h-full w-full will-change-transform">
                  <BookCanvas
                    variant={file.variant}
                    interactive={false}
                    restRotation={file.restRotation}
                    cameraDistance={3.15}
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {file.ready ? (
                    <Button title="Read the book!" />
                  ) : (
                    <span className="font-glare text-[1.5vw] leading-none text-primary max-md:text-[22px]">
                      In progress
                    </span>
                  )}
                </div>
              </div>

              <div
                className={`px-[2vw] pb-[3vw] pt-[1.6vw] max-md:px-5 max-md:pb-8 max-md:pt-5 ${
                  file.ready ? "" : "opacity-45 grayscale"
                }`}
              >
                <SplitText
                  as="h3"
                  className={`max-w-[18vw] font-glare text-[1.75vw] leading-[1.12] text-primary max-md:max-w-none max-md:text-[28px] ${
                    file.ready ? "transition-opacity duration-300 group-hover:opacity-70" : ""
                  }`}
                >
                  {file.title}
                </SplitText>
                <SplitText
                  as="p"
                  className="mt-[0.9vw] max-w-[22vw] text-[1.05vw] leading-[1.45] text-foreground max-md:mt-3 max-md:max-w-none max-md:text-base"
                >
                  {file.body}
                </SplitText>
                <div className="mt-[1.15vw] flex flex-wrap gap-[0.4vw] max-md:mt-4">
                  {file.meta.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-foreground/25 px-[0.75vw] py-[0.28vw] text-[0.65vw] uppercase tracking-[0.08em] text-foreground max-md:px-2.5 max-md:py-1 max-md:text-[10px]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Comp>
          );
        })}
      </div>
    </section>
  );
}
