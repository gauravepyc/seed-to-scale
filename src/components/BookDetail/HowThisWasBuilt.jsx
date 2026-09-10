import Button from "@/components/Button/Button";
import SplitText from "@/components/Reusable/SplitText";

const STAGES = [
  { number: "01", title: "Map the Frontier" },
  { number: "02", title: "Build the Harness" },
  { number: "03", title: "Stay Ahead" },
];

export default function HowThisWasBuilt() {
  return (
    <section className="relative bg-[#F0EBE3] w-full my-[8vw] border-b border-foreground/25 border-t pt-[5vw] pb-[8vw] text-foreground">
      <div className="flex items-start px-[5vw] justify-between gap-[5vw] max-md:flex-col max-md:gap-10">
        <div className="w-[52%] shrink-0 max-md:w-full">
          <p className="text-meta uppercase tracking-[0.16em] text-foreground/55">
            How this was built
          </p>
          <SplitText
            as="h2"
            className="mt-[1.6vw] font-glare text-[2.4vw] leading-[1.18] text-foreground max-md:mt-4 max-md:text-[28px]"
          >
            A harness is built in three stages: mapping where a model is
            actually weak, building only where that map earns its keep, and
            re-mapping on every release to remove whatever the new model has
            made unnecessary.
          </SplitText>
        </div>

        <div className="w-[40%] pt-[3.2vw] max-md:w-full max-md:pt-0">
          <SplitText as="p" className="text-content text-foreground">
            Tasks that land at the edge, the ones a model gets right 70 to 95%
            of the time on a plain prompt, are where harness engineering earns
            its keep. Everything else is either safe to ship directly or not
            worth building for yet.
          </SplitText>

          <ul className="mt-[3.4vw] flex flex-col gap-[2.2vw] max-md:mt-8 max-md:gap-6">
            {STAGES.map((stage) => (
              <li
                key={stage.number}
                className="flex items-baseline gap-[2.4vw] max-md:gap-6"
              >
                <p className="w-[7.5vw] shrink-0 text-meta uppercase tracking-[0.12em] text-primary max-md:w-[5.5rem]">
                  Stage {stage.number}
                </p>
                <p className="text-content text-foreground">{stage.title}</p>
              </li>
            ))}
          </ul>

          <Button
            title="Download Report"
            arrow="down"
            href="#download"
            className="mt-[3.2vw] w-fit max-md:mt-8"
          />
        </div>
      </div>
    </section>
  );
}
