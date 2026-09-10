import Image from "next/image";
import Button from "@/components/Button/Button";
import SplitText from "@/components/Reusable/SplitText";

export default function Download() {
  return (
    <section
      id="download"
      className="flex w-full  min-h-[72vh] bg-foreground items-center text-background max-lg:min-h-0 max-lg:flex-col"
    >
      <div className="flex w-1/2 flex-col justify-center px-[5vw] py-[6vw] max-lg:w-full max-lg:py-12">
        <p className="text-meta uppercase tracking-[0.16em] text-background/55">
          Download
        </p>
        <SplitText
          as="h2"
          className="mt-[1.6vw] max-w-[50vw] text-title leading-[1.1] text-background max-lg:mt-4 max-lg:max-w-none"
        >
          The full playbook, plus the toolkit it ships with.
        </SplitText>

        <Button
          title="Download Report"
          arrow="down"
          className="mt-[2.4vw] w-fit !bg-background !text-foreground max-lg:mt-8"
        />
      </div>

      <div className="flex w-1/2 items-center justify-end px-[5vw] py-[5vw] max-lg:w-full max-lg:px-[5vw] max-lg:pb-12 max-lg:pt-0">
        <Image
          src="/book-detail/book-frame.png"
          alt="Propelling Partnerships"
          width={1200}
          height={1200}
          className="h-auto w-full max-w-[50vw] max-lg:max-w-none"
        />
      </div>
    </section>
  );
}
