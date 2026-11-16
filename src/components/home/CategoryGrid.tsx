import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/categories";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CategoryGrid({ counts }: { counts: Record<string, number> }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading eyebrow="Ürün grupları" title="12 kategori, tek tedarikçi" description="Her kategoride seçilmiş markalar ve farklı ambalaj boyları. İhtiyacınız olan birimi seçin, gerisini biz halledelim." href="/urunler" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {categories.map((c) => (
          <Link key={c.slug} href={`/kategori/${c.slug}`} className="group relative flex flex-col rounded-2xl bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
            <span className="grid size-12 place-items-center rounded-xl transition-transform group-hover:scale-105" style={{ background: c.colorSoft, color: c.color }}>
              <CategoryIcon name={c.icon} className="size-6" strokeWidth={1.8} />
            </span>
            <p className="mt-4 font-display text-[1.02rem] font-bold leading-tight text-ink-900">{c.name}</p>
            <p className="mt-1 text-xs leading-snug text-ink-500">{c.short}</p>
            <p className="mt-3 flex items-center justify-between text-xs font-semibold text-ink-400">
              {counts[c.slug] ?? 0} ürün
              <ArrowUpRight className="size-4 text-ink-300 transition group-hover:text-green-800" />
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
