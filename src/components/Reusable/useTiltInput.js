"use client";

import { useEffect, useRef } from "react";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function useTiltInput(boundsRef) {
  const tilt = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = boundsRef?.current;
    if (!el) return;

    const onPointerMove = (event) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      tilt.current.x = clamp(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -1,
        1
      );
      tilt.current.y = clamp(
        ((event.clientY - rect.top) / rect.height) * 2 - 1,
        -1,
        1
      );
    };

    const onPointerLeave = () => {
      tilt.current.x = 0;
      tilt.current.y = 0;
    };

    el.addEventListener("pointermove", onPointerMove, { passive: true });
    el.addEventListener("pointerleave", onPointerLeave);

    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [boundsRef]);

  return tilt;
}
