import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/categories";

/** Katalog dizini: numaralı, iki sütunlu içindekiler tablosu. */
export function CategoryIndex({ counts }: { counts: Record<string, number> }) {
  return (
    <section className="border-b border-ink-200 px-4 py-12 lg:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.24em] text-orange-600">Katalog dizini</p>
          <h2 className="mt-2 text-4xl text-navy-900">On iki bölüm</h2>
        </div>
        <Link href="/urunler" className="hidden text-sm font-semibold text-navy-900 underline-offset-4 hover:underline sm:inline">
          Tümünü tek listede gör
        </Link>
      </div>
      <ol className="grid grid-cols-1 border-t border-ink-200 md:grid-cols-2 md:[&>li:nth-child(odd)]:border-r md:[&>li:nth-child(odd)]:pr-6 md:[&>li:nth-child(even)]:pl-6">
        {categories.map((c, i) => (
          <li key={c.slug} className="min-w-0 border-b border-ink-200">
            <Link href={`/kategori/${c.slug}`} className="group flex items-start gap-4 py-4">
              <span className="w-9 shrink-0 pt-1 font-display text-2xl text-orange-500">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-[1.45rem] font-semibold text-navy-900 group-hover:text-orange-700">{c.name}</span>
                  <span className="text-xs tabular-nums text-ink-400">{counts[c.slug] ?? 0} ürün</span>
                </span>
                <span className="mt-1 block truncate text-xs text-ink-500">{c.subcategories.map((s) => s.name).join(" · ")}</span>
              </span>
              <ArrowUpRight className="mt-2 size-4 shrink-0 text-ink-300 transition group-hover:text-orange-600" />
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
