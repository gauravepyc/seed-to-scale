import SplitText from "@/components/Reusable/SplitText";

const COLUMNS = [
  {
    title: "Gets stronger",
    body: "Data a lab can't physically reach: NDA'd chip designs, classified specs, results only a company's own work produces. Regulatory certification tied to the product builds in years of switching cost. Real usage signal compounds with every customer.",
  },
  {
    title: "Survives, faces pressure",
    body: "Workflow integration lives in the CI/CD hooks, approval flows, and pipeline orchestration built into how a team works. It's a real advantage, but it lasts only a few release cycles before the model closes the gap.",
  },
  {
    title: "Gets eaten",
    body: "Whatever a lab can train from what's already public turns to commodity fast: generic codegen, writing, video, search. The same goes for any task where the verifier itself is learnable from what's already online.",
  },
];

export default function Framework() {
  return (
    <section id="framework" className="w-full border-b border-foreground/25">
      <div className="border-b border-foreground/25 py-[4vw] text-center">
        <p className="text-meta uppercase tracking-[0.16em] text-foreground/55">
          The Framework
        </p>
        <SplitText as="h2" className="mt-[1.4vw] text-title leading-[1.05] text-foreground">
          How to think about{" "}
          <span className="text-primary">what survives as models improve.</span>
        </SplitText>
      </div>

      <div className="flex w-full max-md:flex-col">
        {COLUMNS.map((column, index) => (
          <article
            key={column.title}
            className={`flex min-w-0 flex-1 flex-col px-[2vw] py-[8vw] max-md:px-5 max-md:py-8 ${
              index < COLUMNS.length - 1
                ? "border-r border-foreground/25 max-md:border-r-0 max-md:border-b"
                : ""
            }`}
          >
            <SplitText
              as="h3"
              className="max-w-[18vw] font-glare text-[1.75vw] leading-[1.12] text-primary max-md:max-w-none max-md:text-[28px]"
            >
              {column.title}
            </SplitText>
            <SplitText
              as="p"
              className="mt-[1.1vw] max-w-[24vw] text-content text-foreground max-md:mt-4 max-md:max-w-none"
            >
              {column.body}
            </SplitText>
          </article>
        ))}
      </div>
    </section>
  );
}
