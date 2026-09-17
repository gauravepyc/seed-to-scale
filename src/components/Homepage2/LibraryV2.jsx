"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import BookCanvas from "../Book3D/BookCanvas";
import Button from "../Button/Button";
import SplitText from "@/components/Reusable/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FILES = [
    {
        variant: "harness",
        title: "Harness Engineering Playbook",
        body: "The model is rented. The harness is what you own, and it's where the margin lives.",
        meta: ["V1.2", "Verified Aug 2026", "Last edited 12 Aug 2026"],
        restRotation: [0.04, -0.22, -0.08],
        ready: true,
    },
    {
        variant: "frontier",
        status: "COMING SOON!",
        restRotation: [0.05, 0.05, 0.02],
        ready: false,
    },
    {
        variant: "teams",
        status: "COMING SOON!",
        restRotation: [0.03, 0.2, 0.07],
        ready: false,
    },
];

export default function Libraryv2() {
    const sectionRef = useRef(null);

    useGSAP(
        () => {
            const books = gsap.utils.toArray("[data-library-book]");
            const row = sectionRef.current.querySelector("[data-library-row]");
            if (!row || !books.length) return;

            const tl = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                    trigger: row,
                    start: "top 72%",
                    end: "top 18%",
                    scrub: 1.15,
                },
            });

            books.forEach((book, i) => {
                const mid = (books.length - 1) / 2;
                const from =
                    i < mid
                        ? { xPercent: 110, yPercent: 0, rotateY: -18 }
                        : i > mid
                          ? { xPercent: -110, yPercent: 0, rotateY: 18 }
                          : { xPercent: 0, yPercent: -100, rotateY: 0 };

                tl.fromTo(
                    book,
                    {
                        ...from,
                        scale: 0.88,
                        autoAlpha: 0.4,
                        transformPerspective: 1100,
                        transformOrigin: "50% 50%",
                    },
                    {
                        xPercent: 0,
                        yPercent: 0,
                        rotateY: 0,
                        scale: 1,
                        autoAlpha: 1,
                        duration: 1,
                        immediateRender: true,
                    },
                    i * 0.1
                );
            });
        },
        { scope: sectionRef }
    );

    return (
        <section
            ref={sectionRef}
            id="library"
            className=" w-full border-b border-foreground/25 "
        >
            <div className="border-b border-t border-foreground/25 py-[4vw] gap-[2vw] flex-col flex justify-start pl-[4vw]">
                <p className="text-meta uppercase text-black">
                    THE LIBRARY
                </p>
                <SplitText as="h2" className="text-title leading-[1.05] text-foreground">
                    Research. <span className="text-primary">One evolving thesis.</span>
                </SplitText>
            </div>


            <div data-library-row className="flex w-full max-md:flex-col">
                {FILES.map((file, index) => {
                    const Comp = file.ready ? Link : "div";

                    return (
                        <Comp
                            key={file.variant}
                            {...(file.ready ? { href: "/book-detail" } : { "aria-disabled": true })}
                            className={`group flex min-w-0 flex-1 flex-col ${file.ready ? "cursor-pointer" : "cursor-default"
                                } ${index < FILES.length - 1 ? "border-r border-foreground/25" : ""}`}
                        >
                            <div className="relative flex h-[30vw] w-full items-center justify-center overflow-hidden px-[1.4vw] py-[1.2vw] max-md:h-[70vw] max-md:px-4 max-md:py-6">
                                <div data-library-book className="h-full w-full will-change-transform [transform-style:preserve-3d]">
                                    <BookCanvas
                                        variant={file.variant}
                                        interactive={false}
                                        restRotation={file.restRotation}
                                        cameraDistance={3.28}
                                    />
                                </div>
                                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    {file.ready ? (
                                        <Button title="Read the book!" className="cursor-pointer" />
                                    ) : (
                                        <span className="font-glare text-[1.5vw] leading-none text-foreground/40 max-md:text-[22px]">
                                            {file.status}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="px-[2vw] pb-[3vw] pt-[1.6vw] max-md:px-5 max-md:pb-8 max-md:pt-5">
                                {file.ready ? (
                                    <>
                                        <SplitText
                                            as="h3"
                                            className="max-w-[18vw] font-glare text-[1.75vw] leading-[1.12] text-primary transition-opacity duration-300 group-hover:opacity-70 max-md:max-w-none max-md:text-[28px]"
                                        >
                                            {file.title}
                                        </SplitText>
                                        <SplitText
                                            as="p"
                                            className="mt-[0.9vw] max-w-[22vw] text-[1.05vw] leading-[1.45] text-foreground max-md:mt-3 max-md:max-w-none max-md:text-base"
                                        >
                                            {file.body}
                                        </SplitText>
                                        <div className="mt-[1.15vw] flex flex-wrap gap-[0.4vw] max-md:mt-4">
                                            {file.meta.map((item) => (
                                                <span
                                                    key={item}
                                                    className="rounded-full border border-foreground/25 px-[0.75vw] py-[0.28vw] text-[0.65vw] uppercase tracking-[0.08em] text-foreground max-md:px-2.5 max-md:py-1 max-md:text-[10px]"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <SplitText
                                        as="h3"
                                        className="max-w-[18vw] font-glare text-[1.75vw] leading-[1.12] text-foreground/40 max-md:max-w-none max-md:text-[28px]"
                                    >
                                        {file.status}
                                    </SplitText>
                                )}
                            </div>
                        </Comp>
                    );
                })}
            </div>
        </section>
    );
}
