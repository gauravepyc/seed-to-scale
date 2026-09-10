import Image from "next/image";
import Button from "@/components/Button/Button";
import SplitText from "@/components/Reusable/SplitText";

export default function AuthorQuote() {
  return (
    <section className="flex w-full bg-foreground min-h-[72vh] max-lg:min-h-0 max-lg:flex-col">
      <div className="flex w-1/2 flex-col justify-center px-[5vw] py-[6vw] text-background max-lg:w-full max-lg:py-12">
        <SplitText
          as="p"
          className="max-w-[32vw] font-glare text-[2.1vw] leading-[1.25] text-background max-lg:max-w-none max-lg:text-[28px]"
        >
          &quot;A frontier model&apos;s competence is uneven in ways that do
          not match human intuition. Excellence at one task predicts little
          about the task beside it.&quot;
        </SplitText>

        <p className="mt-[2.4vw] text-meta uppercase tracking-[0.12em] text-background/55 max-lg:mt-8">
          Tarun Raheja
        </p>

        <Button
          title="View Profile"
          href="/"
          className="mt-[1.2vw] w-fit !bg-background !text-foreground max-lg:mt-4"
        />
      </div>

      <div className="relative min-h-[36vw] w-1/2 overflow-hidden max-lg:min-h-[90vw] max-lg:w-full">
        <Image
          src="/book-detail/author.png"
          alt="Tarun Raheja"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-[center_20%]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-primary to-transparent" />
      </div>
    </section>
  );
}
