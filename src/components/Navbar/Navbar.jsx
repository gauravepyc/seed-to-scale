"use client";

import { useCallback, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import Link from "next/link";
import Logo from "./Logo";

const links = [
  { label: "All Resources", href: "/" },
  { label: "Focus Theme", href: "/", chevron: true },
  { label: "Podcast", href: "/", chevron: true },
  { label: "Community", href: "/", chevron: true },
];

function Chevron() {
  return (
    <svg
      width="8"
      height="5"
      viewBox="0 0 8 5"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 1.1L4 4L7 1.1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      viewBox="0 0 18 18"
      fill="none"
      className="size-4.5"
    >
      <rect
        x="0.502625"
        y="0.500488"
        width="14.1627"
        height="14.1627"
        rx="7.08133"
        stroke="currentColor"
      />
      <path d="M12.7764 12.7786L17.4973 17.4995" stroke="currentColor" />
    </svg>
  );
}

export default function Navbar() {
  const navRef = useRef(null);
  const yTo = useRef(null);
  const yRef = useRef(0);

  useGSAP(() => {
    yTo.current = gsap.quickTo(navRef.current, "y", {
      duration: 0.45,
      ease: "power3.out",
    });
  });

  const onScroll = useCallback((lenis) => {
    if (!yTo.current || !navRef.current) return;
    if (typeof lenis.velocity !== "number") return;

    const max = navRef.current.offsetHeight;

    if (lenis.scroll <= 8) {
      yRef.current = 0;
      yTo.current(0);
      return;
    }

    yRef.current = gsap.utils.clamp(
      -max,
      0,
      yRef.current - lenis.velocity
    );

    yTo.current(yRef.current);
  }, []);

  useLenis(onScroll);

  return (
    <header
      ref={navRef}
      className="bg-background fixed top-0 left-0 z-999 w-full will-change-transform border-b border-foreground/25 text-foreground"
    >
      <nav className="flex items-center justify-between px-[5.2vw] py-[1.4vw]">
        <Link href="/" aria-label="SeedToScale home">
          <Logo />
        </Link>

        <div className="flex items-center gap-[2.2vw]">
          <ul className="hidden items-center gap-[1.6vw] lg:flex">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="flex items-center gap-1.5 text-[14px] leading-none text-foreground transition-opacity hover:opacity-60"
                >
                  {link.label}
                  {link.chevron ? <Chevron /> : null}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center">
            <Link
              href="/search"
              aria-label="Search"
              className="flex size-[52px] items-center justify-center rounded-tr-2xl bg-[#E4E7E2] text-foreground transition-colors hover:bg-[#d8dcd6]"
            >
              <SearchIcon />
            </Link>
            <Link
              href="/login"
              className="flex h-[52px] items-center justify-center rounded-bl-2xl bg-[#1A2330] px-8 text-[13px] font-medium tracking-[0.14em] text-[#F7F3EC] transition-opacity hover:opacity-85"
            >
              LOGIN
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
