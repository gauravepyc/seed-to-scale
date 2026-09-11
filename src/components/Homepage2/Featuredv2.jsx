"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Button from "@/components/Button/Button";
import SplitText from "@/components/Reusable/SplitText";
import BookCanvas from "../Book3D/BookCanvas";
import FeaturedStrips from "./FeaturedStrips";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Featuredv2() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const book = sectionRef.current?.querySelector("[data-featured-book]");
      if (!book) return;

      gsap.fromTo(
        book,
        {
          xPercent: 108,
          yPercent: -18,
          rotate: 10,
          rotateY: -16,
        },
        {
          xPercent: 0,
          yPercent: 0,
          rotate: 0,
          rotateY: 0,
          ease: "none",
          overwrite: "auto",
          immediateRender: true,
          scrollTrigger: {
            trigger: sectionRef.current,
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
      className="flex h-fit w-full bg-primary text-background max-md:min-h-0 max-md:flex-col"
    >
      <div className="flex w-1/2 flex-col justify-center px-[5vw] py-[4vw] max-md:w-full max-md:py-16">
        <p className="text-meta uppercase text-background">
          Featured · Latest issue
        </p>

        <SplitText
          as="h2"
          className="mt-[2vw] max-w-[34vw] text-title leading-[1.05] text-background max-md:mt-4 max-md:max-w-none"
        >
          Harness Engineering Playbook.
        </SplitText>

        <SplitText
          as="p"
          className="mt-[2.2vw] max-w-[32vw] text-content text-background/90 max-md:mt-6 max-md:max-w-none"
        >
          A frontier model is rented. It gets smarter on its own, with every
          release. The harness around it- the prompting, the tools, the checks-
          is what you actually build, and it&apos;s where the margin lives. This
          is how to build one, and know what to tear down every time the model
          improves.
        </SplitText>

        <p className="mt-[2.4vw] text-meta uppercase text-background max-md:mt-8">
          Tarun Raheja · Accel
        </p>

        <Button
          title="Read Now"
          href="/book-detail"
          className="mt-[3vw] w-fit !bg-background !text-foreground uppercase tracking-[0.08em] max-md:mt-8"
        />
      </div>

      <div className="relative min-h-[42vw] w-1/2 overflow-hidden [perspective:1400px] max-md:min-h-[90vw] max-md:w-full">
        <div className="pointer-events-none absolute inset-0">
          <FeaturedStrips />
        </div>
        <div className="pointer-events-none absolute inset-0 z-[5] bg-primary/55" />
        <div
          data-featured-book
          className="absolute inset-0 z-10 origin-center will-change-transform"
        >
          <BookCanvas />
        </div>
      </div>
    </section>
  );
}
