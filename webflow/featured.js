/**
 * Featured section
 *
 * Webflow custom attributes:
 *   data-featured-scope    — the section (scroll trigger)
 *   data-featured-stage    — right column
 *   data-featured-strips   — background canvas (moving bars)
 *   data-featured-book     — wrapper around the 3D book (flies in on scroll)
 *   data-book              — the 3D book canvas (mounted by book.js)
 *   data-book-scroll="1"   — optional auto-open. Leave off for click-only.
 *
 * Copy, images, and button live in Webflow.
 */

(function () {
  const SELECTOR = {
    scope: "[data-featured-scope]",
    book: "[data-featured-book]",
    canvas: "[data-book]",
    strips: "[data-featured-strips]",
  };

  const STRIP_COLORS = [
    "#FF3621",
    "#FF5A3A",
    "#E02E1C",
    "#FF7A62",
    "#F4A090",
    "#FFB5A3",
    "#E8A090",
    "#C9B8E8",
    "#B8C4F0",
    "#FBF8F3",
    "#E8E0D8",
  ];

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function makeStrip(w, h, fromRight, row, barH) {
    const barW = rand(w * 0.18, w * 0.85);
    return {
      x: fromRight ? w + rand(0, w * 0.6) : rand(-barW * 0.15, w * 0.55),
      y: row * barH,
      w: barW,
      h: barH,
      speed: rand(55, 140),
      color: STRIP_COLORS[(Math.random() * STRIP_COLORS.length) | 0],
      alpha: rand(0.45, 1),
      row,
    };
  }

  function makePixel(w, h, fromRight) {
    const size = rand(5, 14);
    return {
      x: fromRight ? w + rand(0, w * 0.5) : rand(0, w),
      y: rand(0, h),
      s: size,
      speed: rand(32, 110),
      color: STRIP_COLORS[(Math.random() * STRIP_COLORS.length) | 0],
      alpha: rand(0.35, 1),
    };
  }

  function mountStrips(canvas) {
    const wrap = canvas.parentElement;
    if (!wrap) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let strips = [];
    let pixels = [];
    let frame = 0;
    let running = true;
    let last = performance.now();

    const resize = () => {
      const nextW = wrap.clientWidth;
      const nextH = wrap.clientHeight;
      if (!nextW || !nextH) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = nextW;
      height = nextH;
      canvas.width = Math.floor(nextW * dpr);
      canvas.height = Math.floor(nextH * dpr);
      canvas.style.width = `${nextW}px`;
      canvas.style.height = `${nextH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(14, Math.round(nextH / 18));
      const barH = nextH / count;
      strips = Array.from({ length: count }, (_, i) =>
        makeStrip(nextW, nextH, true, i, barH)
      );
      pixels = Array.from({ length: 28 }, () => makePixel(nextW, nextH, true));
    };

    const draw = (now) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const g = ctx.createLinearGradient(0, 0, width, 0);
      g.addColorStop(0, "#D8D4CE");
      g.addColorStop(0.42, "#C9C4BE");
      g.addColorStop(0.72, "#E8A090");
      g.addColorStop(1, "#FF5A3A");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      for (const strip of strips) {
        strip.x -= strip.speed * dt;
        if (strip.x + strip.w < -40) {
          Object.assign(strip, makeStrip(width, height, true, strip.row, strip.h));
        }
        ctx.globalAlpha = strip.alpha;
        ctx.fillStyle = strip.color;
        ctx.fillRect(strip.x, strip.y, strip.w, strip.h + 1);
      }

      for (const pixel of pixels) {
        pixel.x -= pixel.speed * dt;
        if (pixel.x + pixel.s < -20) {
          Object.assign(pixel, makePixel(width, height, true));
        }
        ctx.globalAlpha = pixel.alpha;
        ctx.fillStyle = pixel.color;
        ctx.fillRect(pixel.x, pixel.y, pixel.s, pixel.s);
      }

      ctx.globalAlpha = 1;
      const haze = ctx.createLinearGradient(width * 0.45, 0, width, 0);
      haze.addColorStop(0, "rgba(255,54,33,0)");
      haze.addColorStop(1, "rgba(255,54,33,0.22)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, width, height);

      frame = requestAnimationFrame(draw);
    };

    resize();
    last = performance.now();
    frame = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const vis = new IntersectionObserver(
      ([entry]) => {
        const visible = Boolean(entry?.isIntersecting);
        if (visible && !running) {
          running = true;
          last = performance.now();
          frame = requestAnimationFrame(draw);
        } else if (!visible && running) {
          running = false;
          cancelAnimationFrame(frame);
        }
      },
      { rootMargin: "15% 0px" }
    );
    vis.observe(wrap);
  }

  function flyIn(scope, bookWrap) {
    gsap.fromTo(
      bookWrap,
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
          trigger: scope,
          start: "-10% 75%",
          end: "-40% -10%",
          scrub: true,
        },
      }
    );
  }

  function bookApiFor(canvas) {
    return window.site?.books?.get(canvas) || null;
  }

  function bindOpenClose(scope, canvas) {
    const raw = scope.getAttribute("data-book-scroll");
    if (raw === null || raw === "") return;

    const page = raw === "open" || raw === "true" ? 1 : Number(raw);
    if (!Number.isFinite(page) || page < 1) return;

    const run = (fn) => {
      const api = bookApiFor(canvas);
      if (api) fn(api);
    };

    ScrollTrigger.create({
      trigger: scope,
      start: "top 55%",
      end: "bottom 35%",
      onEnter: () => run((api) => api.open(page)),
      onEnterBack: () => run((api) => api.open(page)),
      onLeave: () => run((api) => api.close()),
      onLeaveBack: () => run((api) => api.close()),
    });
  }

  function initScope(scope) {
    const strips = scope.querySelector(SELECTOR.strips);
    if (strips) mountStrips(strips);

    const bookWrap = scope.querySelector(SELECTOR.book);
    if (bookWrap) flyIn(scope, bookWrap);

    const canvas = scope.querySelector(SELECTOR.canvas);
    if (!canvas) return;

    if (bookApiFor(canvas)) {
      bindOpenClose(scope, canvas);
      return;
    }

    canvas.addEventListener(
      "book:ready",
      () => bindOpenClose(scope, canvas),
      { once: true }
    );
  }

  function init() {
    if (typeof gsap === "undefined") {
      console.warn("[featured] GSAP is not loaded");
      return;
    }
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    document.querySelectorAll(SELECTOR.scope).forEach(initScope);
  }

  onReady(init);
})();
