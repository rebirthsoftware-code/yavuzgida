import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function SectionHeading({ title, sub, href, linkLabel = "Tümünü Gör", children }: { title: string; sub?: string; href?: string; linkLabel?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl text-ink-900 sm:text-2xl">{title}</h2>
        {sub && <p className="mt-0.5 text-sm text-ink-500">{sub}</p>}
      </div>
      <div className="flex items-center gap-3">
        {children}
        {href && (
          <Link href={href} className="inline-flex items-center gap-0.5 text-sm font-semibold text-orange-600 hover:underline">
            {linkLabel} <ChevronRight className="size-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
