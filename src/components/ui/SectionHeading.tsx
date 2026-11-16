import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "Tümünü gör",
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={`mb-8 flex flex-wrap items-end justify-between gap-4 ${align === "center" ? "text-center" : ""}`}>
      <div className={align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}>
        {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-tangerine-600">{eyebrow}</p>}
        <h2 className="text-3xl font-bold leading-tight text-ink-900 sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-500">{description}</p>}
      </div>
      {href && (
        <Link href={href} className="group inline-flex items-center gap-1.5 text-sm font-semibold text-green-800 hover:text-green-600">
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
