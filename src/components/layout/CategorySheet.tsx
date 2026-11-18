"use client";

import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import type { Category } from "@/lib/types";

export function CategorySheet({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  const { catsOpen, setCatsOpen } = useCart();
  if (!catsOpen) return null;
  return (
    <div className="fixed inset-0 z-[45] flex flex-col bg-paper-50 pb-16 md:hidden" role="dialog" aria-label="Kategoriler">
      <div className="flex items-center justify-between bg-coal-900 px-4 py-3 text-white">
        <h2 className="text-lg">Tüm Kategoriler</h2>
        <button onClick={() => setCatsOpen(false)} aria-label="Kapat" className="grid size-9 place-items-center rounded-lg hover:bg-white/10">
          <X className="size-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-3 gap-2">
          {categories.map((c) => (
            <Link key={c.slug} href={`/kategori/${c.slug}`} onClick={() => setCatsOpen(false)} className="flex flex-col items-center rounded-lg bg-white p-3 text-center shadow-card">
              <span className="grid size-11 place-items-center rounded-full" style={{ background: c.colorSoft, color: c.color }}>
                <CategoryIcon name={c.icon} className="size-5" />
              </span>
              <span className="mt-2 text-xs font-semibold leading-tight text-ink-900">{c.name}</span>
              <span className="text-[0.65rem] text-ink-400">{counts[c.slug] ?? 0} ürün</span>
            </Link>
          ))}
        </div>
        <ul className="mt-4 divide-y divide-ink-100 rounded-lg bg-white shadow-card">
          {categories.map((c) => (
            <li key={c.slug}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-ink-900">
                  {c.name}
                  <ChevronRight className="size-4 text-ink-400 transition group-open:rotate-90" />
                </summary>
                <ul className="pb-2">
                  {c.subcategories.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/kategori/${c.slug}/${s.slug}`} onClick={() => setCatsOpen(false)} className="block px-6 py-1.5 text-sm text-ink-600">
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
