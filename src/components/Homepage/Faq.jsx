"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "@/components/Reusable/SplitText";

gsap.registerPlugin(useGSAP);

const ITEMS = [
  {
    question: "What is The Working Files?",
    answer:
      "A small, primary-research series for AI builders — three reports, written from direct conversations with frontier labs and the AI-native teams building fastest, not summarized from press releases.",
  },
  {
    question: "Who writes it?",
    answer:
      "Tarun Raheja at Accel. Each file starts as a private working memo before it's refined for publication.",
  },
  {
    question: "Can I talk to the author directly?",
    answer:
      "Yes. Every report can open a direct conversation with the person who wrote it.",
  },
  {
    question: "How is this different from Inside The Engine Room or Decoding AI?",
    answer:
      "Those are the public theses. These are the working versions — ground-level notes from the people closest to the frontier, before they're report-ready. Every claim traces back to a conversation, a paper, or a number.",
  },
];

const EASE = "power3.inOut";
const DURATION = 0.62;

function Chevron({ open }) {
  return (
    <svg
      viewBox="0 0 18 10"
      fill="none"
      aria-hidden="true"
      className={`mt-[0.35em] w-[1.1vw] min-w-3 shrink-0 text-primary transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        d="M1 1.2 9 8.8 17 1.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Faq() {
  const [open, setOpen] = useState(0);
  const openRef = useRef(0);
  const panelsRef = useRef([]);

  useGSAP(() => {
    panelsRef.current.forEach((panel, i) => {
      if (!panel) return;
      gsap.set(panel, {
        height: i === 0 ? "auto" : 0,
        overflow: "hidden",
      });
      const body = panel.firstElementChild;
      if (body) gsap.set(body, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 8 });
    });
  });

  const toggle = (index) => {
    const prev = openRef.current;
    const next = prev === index ? -1 : index;

    if (prev === next) return;

    const closePanel = (i) => {
      const panel = panelsRef.current[i];
      if (!panel) return;
      const body = panel.firstElementChild;
      gsap.to(body, {
        autoAlpha: 0,
        y: 8,
        duration: DURATION * 0.7,
        ease: "power2.in",
        overwrite: "auto",
      });
      gsap.to(panel, {
        height: 0,
        duration: DURATION,
        ease: EASE,
        overwrite: "auto",
      });
    };

    const openPanel = (i) => {
      const panel = panelsRef.current[i];
      if (!panel) return;
      const body = panel.firstElementChild;
      gsap.set(body, { autoAlpha: 0, y: 10 });
      gsap.to(panel, {
        height: "auto",
        duration: DURATION,
        ease: EASE,
        overwrite: "auto",
      });
      gsap.to(body, {
        autoAlpha: 1,
        y: 0,
        duration: DURATION,
        delay: 0.08,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    if (prev >= 0) closePanel(prev);
    if (next >= 0) openPanel(next);

    openRef.current = next;
    setOpen(next);
  };

  return (
    <section id="faq" className="w-full pb-[8vw]">
      <div className="px-[3.5vw] pt-[6vw] pb-[4.5vw] text-center">
        <p className="text-meta uppercase tracking-[0.16em] text-foreground/55">
          FAQ
        </p>
        <SplitText as="h2" className="mt-[.6vw] mx-auto text-title text-foreground">
          Before <span className="text-primary">you</span> ask.
        </SplitText>
      </div>

      <div>
        {ITEMS.map((item, index) => {
          const isOpen = open === index;
          const number = String(index + 1).padStart(2, "0");

          return (
            <div
              key={item.question}
              className="border-t border-foreground/25"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggle(index)}
                className="flex w-full cursor-pointer items-start gap-[2.4vw] px-[3.5vw] py-[3vw] text-left"
              >
                <span
                  className={`w-[6vw] shrink-0 pt-[0.15em] text-meta tracking-[0.08em] transition-colors duration-500 max-md:w-10 ${
                    isOpen ? "text-primary" : "text-foreground/45"
                  }`}
                >
                  {number}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-content text-foreground">
                    {item.question}
                  </span>
                  <span
                    ref={(el) => {
                      panelsRef.current[index] = el;
                    }}
                    className="block"
                  >
                    <span className="mt-[1.4vw] block max-w-[46vw] pb-[0.4vw] text-content text-foreground/80 max-md:max-w-none">
                      {item.answer}
                    </span>
                  </span>
                </span>

                <Chevron open={isOpen} />
              </button>
            </div>
          );
        })}
        <div className="border-t border-foreground/25" />
      </div>
    </section>
  );
}
