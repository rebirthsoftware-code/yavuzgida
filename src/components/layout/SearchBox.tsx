"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, TrendingUp, ArrowUpRight } from "lucide-react";
import indexJson from "@/data/catalog-index.json";
import type { ProductIndex } from "@/lib/types";
import { searchProducts } from "@/lib/search";
import { categories, categoryMap } from "@/lib/categories";
import { minPriceOf } from "@/lib/index-of";
import { formatPrice } from "@/lib/format";
import { PackArt } from "@/components/product/PackArt";

const index = indexJson as ProductIndex[];
const popular = ["Kırmızı mercimek", "Baldo pirinç", "Sızma zeytinyağı", "Pul biber", "Fındık içi", "Domates salçası", "Rize çayı", "Toz şeker"];

/** Masaüstü arama kutusu: yazarken açılır öneri paneli, Enter ile listeye gider. */
export function SearchBox({ className = "" }: { className?: string }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const results = useMemo(() => searchProducts(index, q, 6), [q]);
  const cats = useMemo(() => {
    const n = q.trim().toLocaleLowerCase("tr-TR");
    if (n.length < 2) return [];
    return categories.filter((c) => c.name.toLocaleLowerCase("tr-TR").includes(n) || c.subcategories.some((s) => s.name.toLocaleLowerCase("tr-TR").includes(n))).slice(0, 3);
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) go(`/urunler?q=${encodeURIComponent(q.trim())}`);
        }}
        className="flex h-11 overflow-hidden rounded-lg border-2 border-orange-500 bg-white"
      >
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Aradığınız ürün, kategori veya markayı yazınız"
          className="h-full flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-ink-400"
          aria-label="Ara"
        />
        <button type="submit" aria-label="Ara" className="grid w-14 place-items-center bg-orange-500 text-white hover:bg-orange-600">
          <Search className="size-5" />
        </button>
      </form>

      {open && (
        <div className="absolute inset-x-0 top-full z-50 mt-1.5 overflow-hidden rounded-lg border border-ink-200 bg-white shadow-menu animate-slide-down">
          {q.trim().length < 2 ? (
            <div className="p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-400">
                <TrendingUp className="size-3.5" /> Popüler aramalar
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {popular.map((p) => (
                  <button key={p} type="button" onClick={() => go(`/urunler?q=${encodeURIComponent(p)}`)} className="rounded-full border border-ink-200 px-3 py-1 text-sm text-ink-700 hover:border-orange-500 hover:text-orange-600">
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {cats.length > 0 && (
                <div className="flex flex-wrap gap-1.5 border-b border-ink-100 px-3 py-2">
                  {cats.map((c) => (
                    <Link key={c.slug} href={`/kategori/${c.slug}`} onClick={() => setOpen(false)} className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-100">
                      {c.name} kategorisi <ArrowUpRight className="size-3" />
                    </Link>
                  ))}
                </div>
              )}
              {results.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-ink-500">Sonuç bulunamadı.</p>
              ) : (
                <ul>
                  {results.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/urun/${r.slug}`} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2 hover:bg-paper-50">
                        <span className="grid size-11 shrink-0 place-items-center rounded-md bg-paper-100">
                          <PackArt art={r.art} hue={r.hue} name={r.name} brand={r.brand} className="h-9" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-ink-900">
                            <b>{r.brand}</b> {r.name}
                          </span>
                          <span className="block text-xs text-ink-500">{categoryMap[r.category]?.name}</span>
                        </span>
                        <span className="text-sm font-bold text-ink-900">{formatPrice(minPriceOf(r))}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <button type="button" onClick={() => go(`/urunler?q=${encodeURIComponent(q.trim())}`)} className="block w-full border-t border-ink-100 bg-paper-50 px-4 py-2.5 text-center text-sm font-semibold text-orange-600 hover:bg-orange-50">
                “{q}” için tüm sonuçları gör
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
