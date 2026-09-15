"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Button from "@/components/Button/Button";
import SplitText from "@/components/Reusable/SplitText";

gsap.registerPlugin(useGSAP);

const REST_Y_EM = -0.04;
const MAX_EM = 0.035;

function OffsetLine({ children, className = "" }) {
  return (
    <span className={`relative mx-auto block w-fit ${className}`}>
      <span
        data-hero-stroke
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 select-none will-change-transform"
        style={{
          color: "transparent",
          WebkitTextFillColor: "transparent",
          WebkitTextStroke: "0.005em #FF3621",
        }}
      >
        {children}
      </span>
      <span className="relative">{children}</span>
    </span>
  );
}

export default function Herov2() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const heading = section.querySelector("[data-hero-title]");
      const strokes = gsap.utils.toArray("[data-hero-stroke]");
      if (!section || !heading || !strokes.length) return;

      const emPx = () => parseFloat(getComputedStyle(heading).fontSize);
      const restY = () => REST_Y_EM * emPx();
      const max = () => MAX_EM * emPx();

      gsap.set(strokes, { opacity: 0, x: 0, y: 0 });

      let armed = false;
      let xTos = [];
      let yTos = [];

      const tl = gsap.timeline({
        delay: 0.15,
        onComplete() {
          xTos = strokes.map((el) =>
            gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" })
          );
          yTos = strokes.map((el) =>
            gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" })
          );
          armed = true;
        },
      });

      tl.to(strokes, {
        opacity: 1,
        y: () => restY(),
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });

      const onMove = (e) => {
        if (!armed) return;
        const rect = heading.getBoundingClientRect();
        const nx = Math.max(
          -1,
          Math.min(
            1,
            (e.clientX - (rect.left + rect.width / 2)) / Math.max(rect.width / 2, 1)
          )
        );
        const ny = Math.max(
          -1,
          Math.min(
            1,
            (e.clientY - (rect.top + rect.height / 2)) / Math.max(rect.height / 2, 1)
          )
        );
        const x = nx * max();
        const y = restY() + ny * max();
        xTos.forEach((to) => to(x));
        yTos.forEach((to) => to(y));
      };

      const onLeave = () => {
        if (!armed) return;
        xTos.forEach((to) => to(0));
        yTos.forEach((to) => to(restY()));
      };

      section.addEventListener("mousemove", onMove);
      section.addEventListener("mouseleave", onLeave);

      return () => {
        armed = false;
        section.removeEventListener("mousemove", onMove);
        section.removeEventListener("mouseleave", onLeave);
        tl.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="flex h-fit w-full mt-[5vw] border-b border-foreground/25 bg-background max-md:h-auto max-md:flex-col max-md:pt-28"
    >
      <div className="flex w-1/2 items-center justify-center px-[2vw] max-md:w-full max-md:px-0 max-md:py-16">
        <h1
          data-hero-title
          className="mx-auto w-fit text-center text-[7.5vw] leading-[0.82] tracking-tighter text-primary max-md:text-[18vw]"
        >
          <OffsetLine>The</OffsetLine>
          <OffsetLine>Working</OffsetLine>
          <OffsetLine>Knowledge</OffsetLine>
        </h1>
      </div>

      <div className="flex w-1/2 flex-col  py-[10vw]  justify-center border-l border-foreground/25 px-[6vw] max-md:w-full max-md:border-l-0 max-md:border-t max-md:px-0 max-md:py-16">
        <SplitText
          as="p"
          className="max-w-[28vw]  text-[1.65vw] text-foreground max-md:max-w-none"
        >
          Ground-level thinking on AI, from the people closest to the frontier
          — the working versions, before they&apos;re report-ready.
        </SplitText>

        <SplitText
          as="p"
          className="mt-[2vw] max-w-[22vw] font-glare text-[1.8vw] leading-[1.2] text-[#CA5F2B] font-medium! max-md:mt-8 max-md:max-w-none max-md:text-[28px]"
        >
          The working paper for AI builders
        </SplitText>

        <Button
          title="Read The Latest"
          href="/book-detail"
          className="text-[.8vw] mt-[2vw] w-fit uppercase "
        />
      </div>
    </section>
  );
}
