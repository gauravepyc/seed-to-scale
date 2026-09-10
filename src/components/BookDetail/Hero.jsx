import Image from "next/image";
import Button from "@/components/Button/Button";
import SplitText from "@/components/Reusable/SplitText";

export default function BookDetailHero() {
  return (
    <section className="px-[5vw] bg-foreground pb-[6vw] pt-[10vw] text-background">
      <div className="flex w-full max-lg:flex-col">
        <div className="flex w-[55%] flex-col justify-center py-[3vw] pr-[3vw] max-lg:w-full max-lg:pr-0 max-lg:pt-0">
          <p className="text-meta uppercase tracking-[0.16em] text-background/55">
            Featured · This issue
          </p>

          <SplitText
            as="h1"
            className="mt-[1.4vw] text-title leading-[1.05] text-primary max-lg:mt-4"
          >
            Harness Engineering{" "}
            <span className="text-background">Playbook</span>
          </SplitText>

          <SplitText
            as="p"
            className="mt-[2vw] max-w-[34vw] text-content text-background/80 max-lg:mt-6 max-lg:max-w-none"
          >
            A frontier model is rented. It gets smarter on its own, with every
            release. The harness around it— the prompting, the tools, the
            checks— is what you actually build, and it&apos;s where the margin
            lives. This is how to build one, and know what to tear down every
            time the model improves.
          </SplitText>

          <p className="mt-[2.2vw] text-meta uppercase tracking-[0.08em] text-background/70 max-lg:mt-6">
            Tarun Raheja · AI Expert · Mar 2026 · Coding · Math · World Models
          </p>
        </div>

        <div className="relative min-h-[32vw] w-[45%] overflow-hidden max-lg:mt-8 max-lg:min-h-[72vw] max-lg:w-full">
          <Image
            src="/book-detail/strips.png"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 90vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="flex items-center mt-[6vw] justify-between gap-[2vw] bg-background px-[2.4vw] py-[1.6vw] text-foreground max-lg:flex-col max-lg:items-start max-lg:gap-5 max-lg:px-5 max-lg:py-5">
        <p className="max-w-[28vw] text-meta uppercase tracking-[0.1em] text-foreground/80 max-lg:max-w-none">
          Full report with frameworks, case studies, and references.
        </p>

        <Button title="Download Report" arrow="down" href="#download" />
      </div>
    </section>
  );
}
