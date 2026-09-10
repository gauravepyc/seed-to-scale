"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, GSAPSplitText);

export default function SplitText({
  as: Tag = "p",
  children,
  className = "",
  start = "top 85%",
  once = true,
  delay = 0,
  stagger = 0.08,
  duration = 0.9,
  ease = "power3.out",
  yPercent = 110,
  ...props
}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !el.textContent?.trim()) return;

      gsap.set(el, { visibility: "hidden" });

      const split = GSAPSplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        aria: "auto",
        onSplit(self) {
          if (!self.lines.length) {
            gsap.set(el, { visibility: "visible" });
            return;
          }
          gsap.set(el, { visibility: "visible" });
          return gsap.from(self.lines, {
            yPercent,
            duration,
            stagger,
            delay,
            ease,
            immediateRender: true,
            overwrite: "auto",
            scrollTrigger: {
              trigger: el,
              start,
              once,
            },
          });
        },
      });

      return () => split.revert();
    },
    { dependencies: [start, once, delay, stagger, duration, ease, yPercent] }
  );

  return (
    <Tag ref={ref} className={className} {...props}>
      {children}
    </Tag>
  );
}
