"use client";

import { useEffect, useId, useRef } from "react";

export default function GooeyLayers({
  srcA = "https://images.unsplash.com/photo-1644435687609-78b4afcba3e6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  srcB = "https://images.unsplash.com/photo-1515125520141-3e3b67bc0a88?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
}) {
  const wrapRef = useRef(null);
  const uid = useId().replace(/:/g, "");
  const className = `gooey-images gooey-images-${uid}`;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let cancelled = false;
    const images = [...wrap.querySelectorAll("img")];

    const waitForImages = () =>
      Promise.all(
        images.map(
          (img) =>
            img.decode?.().catch(() => undefined) ??
            (img.complete
              ? Promise.resolve()
              : new Promise((resolve) => {
                  img.onload = resolve;
                  img.onerror = resolve;
                }))
        )
      );

    const start = async () => {
      await waitForImages();
      const mod = await import("sheryjs");
      if (cancelled || !wrap.isConnected) return;

      const Shery = mod.default ?? mod;
      Shery.imageEffect(`.gooey-images-${uid}`, {
        style: 6,
        gooey: true,
        config: {
          speed: { value: 0, range: [0, 1] },
          scale: { value: 0, range: [0, 100] },
          distortionAmount: { value: 0, range: [0, 10] },
          noiseDetail: { value: 0, range: [0, 100] },
          noise_speed: { value: 0, range: [0, 10] },
        },
      });

      const canvas = document.querySelector("._canvas_container");
      if (canvas) canvas.style.zIndex = "20";
    };

    start();

    return () => {
      cancelled = true;
    };
  }, [uid, srcA, srcB]);

  return (
    <section
      ref={wrapRef}
      className="relative my-[5vw] h-[30vw] w-full overflow-hidden border-b border-t border-foreground/25"
    >
      <div className={`${className} h-full w-full`}>
        <img src={srcA} alt="" crossOrigin="anonymous" />
        <img src={srcB} alt="" crossOrigin="anonymous" />
      </div>
    </section>
  );
}
