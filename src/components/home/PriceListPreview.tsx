import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProductIndex } from "@/lib/types";
import { ProductRow } from "@/components/catalog/ProductRow";

export function PriceListPreview({ eyebrow, title, items, href, linkLabel }: { eyebrow: string; title: string; items: ProductIndex[]; href: string; linkLabel: string }) {
  return (
    <section className="border-b border-ink-200">
      <div className="flex items-end justify-between gap-4 px-4 pb-4 pt-12 lg:px-6">
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.24em] text-orange-600">{eyebrow}</p>
          <h2 className="mt-2 text-4xl text-navy-900">{title}</h2>
        </div>
        <Link href={href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 underline-offset-4 hover:underline">
          {linkLabel} <ArrowRight className="size-4" />
        </Link>
      </div>
      <ul className="divide-y divide-ink-100 border-t border-ink-200 bg-paper-50">
        {items.map((p) => (
          <ProductRow key={p.slug} p={p} showCategory />
        ))}
      </ul>
    </section>
  );
}
