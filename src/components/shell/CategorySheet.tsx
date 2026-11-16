"use client";

import Link from "next/link";
import { X, ArrowRight } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import type { Category } from "@/lib/types";

/** Mobil: tam ekran kategori dizini. */
export function CategorySheet({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  const { catsOpen, setCatsOpen } = useCart();
  if (!catsOpen) return null;
  return (
    <div className="fixed inset-0 z-[45] flex flex-col bg-paper-50 pb-16 lg:hidden" role="dialog" aria-label="Kategoriler">
      <div className="flex items-center justify-between border-b border-ink-200 px-4 py-3">
        <h2 className="text-2xl">Katalog dizini</h2>
        <button onClick={() => setCatsOpen(false)} aria-label="Kapat" className="grid size-9 place-items-center rounded-lg hover:bg-paper-100">
          <X className="size-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Link href="/urunler" onClick={() => setCatsOpen(false)} className="flex items-center justify-between border-b border-ink-200 px-4 py-3 text-sm font-semibold text-navy-900">
          Tüm ürünler <ArrowRight className="size-4" />
        </Link>
        <ol>
          {categories.map((c, i) => (
            <li key={c.slug} className="border-b border-ink-200">
              <Link href={`/kategori/${c.slug}`} onClick={() => setCatsOpen(false)} className="flex items-center gap-3 px-4 py-3">
                <span className="w-6 font-display text-base text-orange-600">{String(i + 1).padStart(2, "0")}</span>
                <CategoryIcon name={c.icon} className="size-4 text-ink-400" strokeWidth={1.8} />
                <span className="flex-1 font-semibold text-navy-900">{c.name}</span>
                <span className="text-xs text-ink-400">{counts[c.slug] ?? 0}</span>
              </Link>
              <div className="flex gap-1.5 overflow-x-auto px-4 pb-3 no-scrollbar">
                {c.subcategories.map((s) => (
                  <Link key={s.slug} href={`/kategori/${c.slug}/${s.slug}`} onClick={() => setCatsOpen(false)} className="shrink-0 rounded-full border border-ink-200 bg-white px-3 py-1 text-xs text-ink-700">
                    {s.name}
                  </Link>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
