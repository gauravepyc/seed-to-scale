import SplitText from "@/components/Reusable/SplitText";

const POINTS = [
  {
    number: "01",
    body: "How labs acquire capability — and when they stop.",
  },
  {
    number: "02",
    body: "How to re-underwrite portfolio companies through this lens.",
  },
  {
    number: "03",
    body: "New early-alpha names, with the framework to evaluate them yourself.",
  },
];

export default function Highlights() {
  return (
    <section className="flex w-full bg-foreground min-h-[72vh] max-lg:min-h-0 max-lg:flex-col">
      <div className="flex w-1/2 flex-col justify-center gap-[3.4vw] px-[5vw] py-[6vw] text-background max-lg:w-full max-lg:gap-10 max-lg:py-12">
        {POINTS.map((point) => (
          <article key={point.number} className="max-w-[28vw] max-lg:max-w-none">
            <p className="text-meta tracking-[0.08em] text-background/45">
              {point.number}
            </p>
            <SplitText
              as="p"
              className="mt-[1.1vw] text-content text-background/90 max-lg:mt-3"
            >
              {point.body}
            </SplitText>
          </article>
        ))}
      </div>

      <div className="flex w-1/2 flex-col items-center justify-center bg-primary px-[4vw] py-[8vw] text-center text-background max-lg:w-full max-lg:min-h-[56vw] max-lg:py-16">
        <SplitText as="p" className="text-hero leading-none">
          20+
        </SplitText>
        <SplitText
          as="p"
          className="mt-[1.4vw] text-content text-background max-lg:mt-4"
        >
          Case Studies & Companies
        </SplitText>
      </div>
    </section>
  );
}
