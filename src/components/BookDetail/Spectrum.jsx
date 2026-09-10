import SplitText from "@/components/Reusable/SplitText";

const ROWS = [
  {
    position: "Strongly verifiable",
    example: "Unit tests · Lean proofs",
    speed: "Instant, free",
  },
  {
    position: "Weakly verifiable",
    example: "LLM-as-judge · PRMs",
    speed: "Seconds, cheap",
  },
  {
    position: "Inferable",
    example: "Accept / reject signals",
    speed: "Hours, noisy",
  },
  {
    position: "Non-verifiable",
    example: "Video aesthetics · Negotiation",
    speed: "Days, expensive",
  },
];

export default function Spectrum() {
  return (
    <>
      <section className="bg-background border-b border-foreground/25 pt-[5vw] pb-[6vw] text-foreground">
        <div className="border-b border-foreground/25">
          <div className="px-[5vw] pb-[4vw]">
            <p className="text-meta uppercase tracking-[0.16em] text-foreground/55">
              The Framework
            </p>
            <SplitText as="h2" className="mt-[1.4vw] text-title leading-[1.05]">
              <span className="text-primary">The verifiability</span> spectrum
            </SplitText>
          </div>
        </div>

        <div className="hidden border-b border-foreground/25 md:block">
          <div className="grid grid-cols-[1.2fr_1.5fr_0.9fr] px-[5vw] py-[1.4vw] text-meta uppercase tracking-[0.1em] text-foreground/45">
            <span>Position</span>
            <span>Example</span>
            <span className="text-right">Speed / Cost</span>
          </div>
        </div>

        {ROWS.map((row) => (
          <div key={row.position} className="border-b border-foreground/25">
            <div className="grid grid-cols-1 gap-[0.6vw] px-[5vw] py-[1.8vw] md:grid-cols-[1.2fr_1.5fr_0.9fr] md:items-center md:gap-0">
              <SplitText
                as="p"
                className="font-glare text-[1.45vw] leading-[1.2] text-foreground max-md:text-[22px]"
              >
                {row.position}
              </SplitText>
              <p className="text-meta uppercase tracking-[0.08em] text-primary">
                {row.example}
              </p>
              <p className="text-meta uppercase tracking-[0.08em] text-foreground/70 md:text-right">
                {row.speed}
              </p>
            </div>
          </div>
        ))}

        <div className="px-[5vw]">
          <SplitText
            as="p"
            className="mt-[3.5vw] max-w-[52vw] font-glare text-[2vw] leading-[1.25] text-foreground max-md:mt-10 max-md:max-w-none max-md:text-[24px]"
          >
            Before the checker existed, the best model solved 3% of real bugs.
            After, 81%. The verifier unlocked a 27× improvement in two years.
          </SplitText>
        </div>
      </section>
      <div className="h-[5vw] bg-background w-full"></div>

    </>

  );
}
