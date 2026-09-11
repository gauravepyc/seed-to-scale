"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitText from "@/components/Reusable/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const COLUMNS = [
  {
    title: "Gets stronger",
    body: "Data a lab can't physically reach: NDA'd chip designs, classified specs, results only a company's own work produces. Regulatory certification tied to the product builds in years of switching cost. Real usage signal compounds with every customer.",
  },
  {
    title: "Survives, faces pressure",
    body: "Workflow integration lives in the CI/CD hooks, approval flows, and pipeline orchestration built into how a team works. It's a real advantage, but it lasts only a few release cycles before the model closes the gap.",
  },
  {
    title: "Gets eaten",
    body: "Whatever a lab can train from what's already public turns to commodity fast: generic codegen, writing, video, search. The same goes for any task where the verifier itself is learnable from what's already online.",
  },
];

export default function FrameworkV2() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const row = sectionRef.current?.querySelector("[data-framework-row]");
      const cards = gsap.utils.toArray("[data-framework-card]");
      if (!row || cards.length < 2) return;

      const offsets = { current: [] };

      const measure = () => {
        const rowBox = row.getBoundingClientRect();
        const ox = rowBox.left + rowBox.width / 2;
        const oy = rowBox.top + rowBox.height / 2;
        offsets.current = cards.map((card) => {
          const box = card.getBoundingClientRect();
          const x = Number(gsap.getProperty(card, "x")) || 0;
          const y = Number(gsap.getProperty(card, "y")) || 0;
          const cx = box.left + box.width / 2 - x;
          const cy = box.top + box.height / 2 - y;
          return { x: ox - cx, y: oy - cy };
        });
      };

      measure();

      const tiltFor = (i) => {
        const dir = i - (cards.length - 1) / 2;
        return dir === 0 ? 2.5 : dir * 5;
      };

      cards.forEach((card, i) => {
        gsap.set(card, {
          x: offsets.current[i].x,
          y: offsets.current[i].y,
          rotation: tiltFor(i),
          zIndex: cards.length - i,
          force3D: true,
        });
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: row,
          start: "top 75%",
          end: "top 20%",
          scrub: 1.1,
          invalidateOnRefresh: true,
          onRefresh: measure,
        },
      });

      cards.forEach((card, i) => {
        const tilt = tiltFor(i);
        tl.fromTo(
          card,
          {
            x: () => offsets.current[i].x,
            y: () => offsets.current[i].y,
          },
          {
            x: 0,
            y: 0,
            duration: 1,
            immediateRender: false,
          },
          0
        );
        tl.fromTo(
          card,
          { rotation: tilt },
          { rotation: tilt * 1.7, duration: 0.5, immediateRender: false },
          0
        );
        tl.to(card, { rotation: 0, duration: 0.5 }, 0.5);
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set(cards, { clearProps: "transform,zIndex" });
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="framework"
      className="w-full pb-[8vw] text-foreground"
    >
      <div className="border-b border-t border-foreground/25 py-[4vw] pl-[4vw]">
        <p className="text-meta uppercase tracking-[0.16em] text-foreground">
          The Framework
        </p>
        <SplitText
          as="h2"
          className="mt-[1.4vw] max-w-[72vw] text-title leading-[1.08] text-foreground max-md:max-w-none"
        >
          How to think about{" "}
          <span className="text-primary">what survives as models improve.</span>
        </SplitText>
      </div>

      <div
        data-framework-row
        className="relative mt-[2.5vw] flex w-full gap-[2.5vw] max-md:flex-col max-md:gap-4"
      >
        {COLUMNS.map((column) => (
          <article
            key={column.title}
            data-framework-card
            className="relative flex min-w-0 flex-1 flex-col border border-foreground/25 bg-background px-[5vw] py-[8vw] will-change-transform max-md:px-5 max-md:py-8"
          >
            <p className="text-meta uppercase text-foreground">{column.title}</p>
            <SplitText
              as="p"
              className="mt-[2.4vw] text-content text-foreground max-md:mt-5"
            >
              {column.body}
            </SplitText>
          </article>
        ))}
      </div>
    </section>
  );
}
