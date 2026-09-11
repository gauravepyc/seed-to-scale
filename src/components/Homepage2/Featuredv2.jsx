import Button from "@/components/Button/Button";
import SplitText from "@/components/Reusable/SplitText";
import FeaturedStrips from "./FeaturedStrips";

export default function Featuredv2() {
  return (
    <section className="flex min-h-screen w-full bg-primary text-background max-md:min-h-0 max-md:flex-col">
      <div className="flex w-1/2 flex-col justify-center px-[5vw] py-[8vw] max-md:w-full max-md:py-16">
        <p className="text-meta uppercase text-background">
          Featured · Latest issue
        </p>

        <SplitText
          as="h2"
          className="mt-[2vw] max-w-[34vw] text-title leading-[1.05] text-background max-md:mt-4 max-md:max-w-none"
        >
          Harness Engineering Playbook.
        </SplitText>

        <SplitText
          as="p"
          className="mt-[2.2vw] max-w-[32vw] text-content text-background/90 max-md:mt-6 max-md:max-w-none"
        >
          A frontier model is rented. It gets smarter on its own, with every
          release. The harness around it- the prompting, the tools, the checks-
          is what you actually build, and it&apos;s where the margin lives. This
          is how to build one, and know what to tear down every time the model
          improves.
        </SplitText>

        <p className="mt-[2.4vw] text-meta uppercase text-background max-md:mt-8">
          Tarun Raheja · Accel
        </p>

        <Button
          title="Read Now"
          href="/book-detail"
          className="mt-[3vw] w-fit !bg-background !text-foreground uppercase tracking-[0.08em] max-md:mt-8"
        />
      </div>

      <div className="relative min-h-[42vw] w-1/2 overflow-hidden max-md:min-h-[90vw] max-md:w-full">
        <FeaturedStrips />
      </div>
    </section>
  );
}
