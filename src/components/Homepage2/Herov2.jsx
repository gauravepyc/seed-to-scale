"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Button from "@/components/Button/Button";
import SplitText from "@/components/Reusable/SplitText";

gsap.registerPlugin(useGSAP);

const LAYERS = 5;
const MOVE = 0.02;
const TILT_X = 3;
const TILT_Y = 4;

function OffsetLine({ children, className = "" }) {
  return (
    <span
      data-hero-line
      className={`relative mx-auto block w-fit [transform-style:preserve-3d] ${className}`}
    >
      {Array.from({ length: LAYERS }, (_, i) => (
        <span
          key={i}
          data-hero-extrude
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 select-none text-foreground will-change-transform"
          style={{
            transform:
              "translate3d(calc(var(--ex) * var(--i) * var(--depth)), calc(var(--ey) * var(--i) * var(--depth)), calc(var(--i) * -1.6px))",
            "--i": i + 1,
          }}
        >
          {children}
        </span>
      ))}
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
      const lines = gsap.utils.toArray("[data-hero-line]");
      if (!section || !heading || !lines.length) return;

      const emPx = () => parseFloat(getComputedStyle(heading).fontSize);
      const pose = { ex: 0, ey: 0, rx: 0, ry: 0, depth: 0 };

      const apply = () => {
        heading.style.setProperty("--ex", `${pose.ex}px`);
        heading.style.setProperty("--ey", `${pose.ey}px`);
        heading.style.setProperty("--depth", String(pose.depth));
        heading.style.transform = `rotateX(${pose.rx}deg) rotateY(${pose.ry}deg)`;
      };

      gsap.set(heading, {
        transformPerspective: 900,
        transformOrigin: "50% 50%",
      });
      gsap.set(lines, { rotateX: 72, z: -80, opacity: 0, transformOrigin: "50% 100%" });
      apply();

      const tl = gsap.timeline({ delay: 0.12 });
      tl.to(lines, {
        rotateX: 0,
        z: 0,
        opacity: 1,
        duration: 1.05,
        stagger: 0.11,
        ease: "power3.out",
      }).to(
        pose,
        {
          depth: 1,
          duration: 0.7,
          ease: "power2.out",
          onUpdate: apply,
        },
        "-=0.55"
      );

      const toEx = gsap.quickTo(pose, "ex", {
        duration: 0.5,
        ease: "power3.out",
        onUpdate: apply,
      });
      const toEy = gsap.quickTo(pose, "ey", {
        duration: 0.5,
        ease: "power3.out",
        onUpdate: apply,
      });
      const toRx = gsap.quickTo(pose, "rx", {
        duration: 0.55,
        ease: "power3.out",
        onUpdate: apply,
      });
      const toRy = gsap.quickTo(pose, "ry", {
        duration: 0.55,
        ease: "power3.out",
        onUpdate: apply,
      });

      let armed = false;
      tl.eventCallback("onComplete", () => {
        armed = true;
      });

      const onMove = (e) => {
        if (!armed) return;
        const rect = heading.getBoundingClientRect();
        const nx = Math.max(
          -1,
          Math.min(1, (e.clientX - (rect.left + rect.width / 2)) / Math.max(rect.width / 2, 1))
        );
        const ny = Math.max(
          -1,
          Math.min(1, (e.clientY - (rect.top + rect.height / 2)) / Math.max(rect.height / 2, 1))
        );
        const size = emPx();
        toEx(nx * MOVE * size);
        toEy(ny * MOVE * size);
        toRx(-ny * TILT_X);
        toRy(nx * TILT_Y);
      };

      const onLeave = () => {
        if (!armed) return;
        toEx(0);
        toEy(0);
        toRx(0);
        toRy(0);
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
      <div className="flex w-1/2 items-center justify-center px-[2vw] [perspective:56vw] max-md:w-full max-md:px-0 max-md:py-16">
        <h1
          data-hero-title
          className="mx-auto w-fit text-center text-[7.5vw] leading-[0.84] tracking-tighter text-primary [transform-style:preserve-3d] max-md:text-[14vw]"
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
