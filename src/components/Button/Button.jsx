import Link from "next/link";

const slide =
  "transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

function Arrow({ className = "" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`size-[1.2em] ${className}`}
    >
      <path
        d="M3 8h10M9 4.5 13 8l-4 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Button({
  title,
  href,
  className = "",
  ...props
}) {
  const Comp = href ? Link : "div";

  return (
    <Comp
      {...(href ? { href } : {})}
      className={`group inline-flex cursor-pointer items-center gap-[0.7vw] bg-foreground px-[2vw] py-[1vw] text-background ${className}`}
      {...props}
    >
      <span className="relative overflow-hidden">
        <span className={`block ${slide} group-hover:-translate-y-[110%]`}>
          {title}
        </span>
        <span
          className={`absolute inset-0 block translate-y-[110%] ${slide} group-hover:translate-y-0`}
        >
          {title}
        </span>
      </span>
      <span className="relative inline-flex size-[1.2em] overflow-hidden">
        <Arrow className={`absolute inset-0 ${slide} group-hover:translate-x-[130%]`} />
        <Arrow
          className={`absolute inset-0 -translate-x-[130%] ${slide} group-hover:translate-x-0`}
        />
      </span>
    </Comp>
  );
}
