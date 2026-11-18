"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Flame, Percent } from "lucide-react";
import { categories } from "@/lib/categories";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

/** Kategori çubuğu: üzerine gelince alt kategoriler açılır. Mobilde yatay kaydırılır. */
export function CategoryBar({ counts }: { counts: Record<string, number> }) {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div className="relative border-t border-white/5 bg-white" onMouseLeave={() => setHover(null)}>
      <nav className="mx-auto flex max-w-[1320px] items-center gap-0 overflow-x-auto px-2 no-scrollbar sm:px-4">
        <Link href="/urunler?etiket=indirim" className="flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-[0.85rem] font-bold text-orange-600 hover:bg-orange-50">
          <Percent className="size-3.5" /> Fırsatlar
        </Link>
        <Link href="/urunler?etiket=cok-satan&sirala=populer" className="flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-[0.85rem] font-bold text-ink-800 hover:bg-paper-100">
          <Flame className="size-3.5 text-orange-500" /> Çok Satanlar
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/kategori/${c.slug}`}
            onMouseEnter={() => setHover(c.slug)}
            className={`flex shrink-0 items-center gap-1 whitespace-nowrap px-2.5 py-2.5 text-[0.82rem] font-medium transition ${hover === c.slug ? "text-orange-600 shadow-[inset_0_-2px_0_#f27a1a]" : "text-ink-700 hover:text-orange-600"}`}
          >
            {c.name}
            <ChevronDown className="hidden size-3 text-ink-300 2xl:block" />
          </Link>
        ))}
      </nav>

      {hover && (
        <div className="absolute inset-x-0 top-full z-40 hidden border-t border-ink-100 bg-white shadow-menu lg:block animate-fade-in">
          <div className="mx-auto grid max-w-[1320px] grid-cols-[1fr_280px] gap-8 px-4 py-6">
            {(() => {
              const c = categories.find((x) => x.slug === hover)!;
              return (
                <>
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-lg" style={{ background: c.colorSoft, color: c.color }}>
                        <CategoryIcon name={c.icon} className="size-5" />
                      </span>
                      <div>
                        <p className="font-bold text-ink-900">{c.name}</p>
                        <p className="text-xs text-ink-500">{counts[c.slug] ?? 0} ürün · {c.short}</p>
                      </div>
                    </div>
                    <ul className="grid grid-cols-3 gap-x-6 gap-y-1.5 text-sm">
                      <li>
                        <Link href={`/kategori/${c.slug}`} className="font-semibold text-orange-600 hover:underline">
                          Tüm {c.name}
                        </Link>
                      </li>
                      {c.subcategories.map((s) => (
                        <li key={s.slug}>
                          <Link href={`/kategori/${c.slug}/${s.slug}`} className="text-ink-700 hover:text-orange-600 hover:underline">
                            {s.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href={`/kategori/${c.slug}`} className="flex flex-col justify-end rounded-lg p-5 text-white" style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}cc)` }}>
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Toptan avantajı</p>
                    <p className="mt-1 text-lg font-bold leading-tight">Koli alımında birim fiyat %6–14 düşer</p>
                    <p className="mt-2 text-xs opacity-80">{c.name} kategorisinde tüm boylar →</p>
                  </Link>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
