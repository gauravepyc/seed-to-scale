/**
 * Title outline offset
 *
 * Webflow custom attributes:
 *   data-offset-scope   — section that tracks the mouse
 *   data-offset-title   — heading; movement is measured from its center
 *   data-offset-stroke  — outline copy of each line (same text as the live word)
 *
 * At rest the outline sits slightly above the fill.
 * Moving the cursor shifts it; leaving the section resets it.
 */

(function () {
  const SELECTOR = {
    scope: "[data-offset-scope]",
    title: "[data-offset-title]",
    stroke: "[data-offset-stroke]",
  };

  const REST_Y_EM = -0.04;
  const MOVE_EM = 0.035;
  const STROKE_COLOR = "#FF3621";

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function cursorFromCenter(event, element) {
    const box = element.getBoundingClientRect();
    const x = (event.clientX - (box.left + box.width / 2)) / Math.max(box.width / 2, 1);
    const y = (event.clientY - (box.top + box.height / 2)) / Math.max(box.height / 2, 1);
    return {
      x: clamp(x, -1, 1),
      y: clamp(y, -1, 1),
    };
  }

  function styleOutline(stroke) {
    const line = stroke.parentElement;
    if (line) line.style.position = "relative";

    stroke.style.position = "absolute";
    stroke.style.left = "0";
    stroke.style.top = "0";
    stroke.style.color = "transparent";
    stroke.style.webkitTextFillColor = "transparent";
    stroke.style.webkitTextStroke = `0.005em ${STROKE_COLOR}`;
    stroke.style.pointerEvents = "none";
    stroke.style.userSelect = "none";
    stroke.style.willChange = "transform";
    // The outline is a duplicate of the word; keep it out of the a11y tree.
    stroke.setAttribute("aria-hidden", "true");
  }

  function initTitleOffset(scope) {
    if (typeof gsap === "undefined") return;

    const title = scope.querySelector(SELECTOR.title);
    const strokes = title ? [...title.querySelectorAll(SELECTOR.stroke)] : [];
    if (!title || !strokes.length) return;

    strokes.forEach(styleOutline);

    const fontSize = () => parseFloat(getComputedStyle(title).fontSize) || 16;
    const restY = () => REST_Y_EM * fontSize();
    const moveRange = () => MOVE_EM * fontSize();

    gsap.set(strokes, { opacity: 0, x: 0, y: 0 });

    let ready = false;
    let moveX = [];
    let moveY = [];

    gsap
      .timeline({
        delay: 0.15,
        onComplete() {
          moveX = strokes.map((el) =>
            gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" })
          );
          moveY = strokes.map((el) =>
            gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" })
          );
          ready = true;
        },
      })
      .to(strokes, {
        opacity: 1,
        y: restY,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });

    function onMove(event) {
      if (!ready) return;
      const cursor = cursorFromCenter(event, title);
      const x = cursor.x * moveRange();
      const y = restY() + cursor.y * moveRange();
      moveX.forEach((to) => to(x));
      moveY.forEach((to) => to(y));
    }

    function onLeave() {
      if (!ready) return;
      moveX.forEach((to) => to(0));
      moveY.forEach((to) => to(restY()));
    }

    scope.addEventListener("mousemove", onMove);
    scope.addEventListener("mouseleave", onLeave);
  }

  onReady(() => {
    document.querySelectorAll(SELECTOR.scope).forEach(initTitleOffset);
  });
})();
