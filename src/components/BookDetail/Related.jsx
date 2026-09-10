import SplitText from "@/components/Reusable/SplitText";
import PixelField from "./PixelField";

const FILES = [
  {
    seed: 100,
    meta: "Tarun Raheja · Verified Mar 2026",
    title: (
      <>
        <span className="text-primary">Frontier Model</span>
        <br />
        Capabilities
      </>
    ),
    body: "What models absorb as scoring gets easier, what stays out of reach, and where to invest.",
  },
  {
    seed: 100,
    meta: "Tarun Raheja · Verified Mar 2026",
    title: (
      <>
        <span className="text-primary">AI-Maximal Teams</span>
        <br />
        in Practice
      </>
    ),
    body: "Public case studies, private field notes, and operational guidance on how the fastest engineering orgs actually run AI.",
  },
];

export default function Related() {
  return (
    <section className="bg-background pb-[10vw] pt-[4vw] text-foreground">
      <div className="border-b border-t px-[5vw] border-foreground/25">
        <div className=" py-[4vw]">
          <p className="text-meta uppercase tracking-[0.16em] text-foreground/55">
            Related
          </p>
          <SplitText as="h2" className="mt-[1.4vw] text-title leading-[1.05]">
            More from <span className="text-primary">The Working Files.</span>
          </SplitText>
        </div>
      </div>

      <div className="flex w-full border-b border-foreground/25 max-md:flex-col">
        {FILES.map((file, index) => (
          <article
            key={file.meta + index}
            className={`flex min-w-0 flex-1 flex-col ${
              index === 0
                ? "border-r border-foreground/25 max-md:border-r-0 max-md:border-b"
                : ""
            }`}
          >
            <div className="h-[25vw] w-full overflow-hidden bg-[#EEE0DA] max-md:h-[46vw]">
              <PixelField seed={file.seed} />
            </div>

            <div className=" pb-[3.4vw] w-[95vw] px-[5vw] pt-[5vw] max-md:pb-10 max-md:pt-6">
              <p className="text-meta uppercase text-foreground/45">
                {file.meta}
              </p>
              <SplitText
                as="h3"
                className="mt-[1.5vw] font-glare text-[2vw] leading-[1.12] text-foreground max-md:mt-3 max-md:text-[28px]"
              >
                {file.title}
              </SplitText>
              <SplitText
                as="p"
                className="mt-[1.5vw] max-w-[28vw] text-content text-foreground/80 max-md:mt-4 max-md:max-w-none"
              >
                {file.body}
              </SplitText>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
