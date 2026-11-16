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
        {eyebrow && <p className="mb-2.5 flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-orange-600">{align === "left" && <span className="h-px w-6 bg-orange-400" />}{eyebrow}</p>}
        <h2 className="text-3xl leading-tight text-navy-900 sm:text-[2.6rem]">{title}</h2>
        {description && <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-500">{description}</p>}
      </div>
      {href && (
        <Link href={href} className="group inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-semibold text-navy-900 hover:border-orange-400 hover:text-orange-700">
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
