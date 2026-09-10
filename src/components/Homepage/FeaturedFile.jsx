"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import BookCanvas from "../Book3D/BookCanvas";
import Button from "../Button/Button";
import SplitText from "@/components/Reusable/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function FeaturedFile() {
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
    <div
      ref={sectionRef}
      className="mt-[8vw] flex h-[120vh] w-full flex-col"
    >
      <div className="border-b border-t border-foreground/25 py-[4vw]">
        <SplitText
          as="h2"
          className="text-content text-center uppercase text-foreground"
        >
          Featured File
        </SplitText>
        <SplitText as="h2" className="text-title text-center text-foreground">
          Harness Engineering <span className="text-primary">Playbook.</span>
        </SplitText>
      </div>

      <div className="flex min-h-0 w-full flex-1">
        <div className="flex h-full w-full flex-col items-start justify-center gap-[2.4vw] border-r border-foreground/25 px-[3vw] py-[4vw]">
          <SplitText as="p" className="max-w-[32vw] text-content text-foreground">
            A frontier model is rented. It gets smarter on its own, with every
            release. The harness around it is what you actually build, and
            it&apos;s where the margin lives.
          </SplitText>
          <p className="text-meta tracking-[0.06em] text-foreground/60">
            Tarun Raheja · Accel
          </p>
          <Button title="Read More" />
        </div>
        <div className="h-full w-full overflow-hidden border-r border-foreground/25 [perspective:1400px]">
          <div
            data-featured-book
            className="h-full w-full origin-center will-change-transform"
          >
            <BookCanvas />
          </div>
        </div>
      </div>
    </div>
  );
}
