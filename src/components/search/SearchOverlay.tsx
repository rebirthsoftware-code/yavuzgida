"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, CornerDownLeft } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { searchProducts } from "@/lib/search";
import { categoryMap, categories } from "@/lib/categories";
import type { ProductIndex } from "@/lib/types";
import indexJson from "@/data/catalog-index.json";
import { ProductVisual } from "@/components/product/ProductVisual";
import { formatPrice } from "@/lib/format";

const index = indexJson as ProductIndex[];
const popular = ["Mercimek", "Zeytinyağı", "Pul biber", "Fındık", "Salça", "Rize çayı", "Baldo pirinç", "Toz şeker"];

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, setSearchOpen]);

  useEffect(() => {
    document.body.style.overflow = searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  if (!searchOpen) return null;
  return <SearchPanel close={() => setSearchOpen(false)} />;
}

function SearchPanel({ close }: { close: () => void }) {
  const [q, setQState] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const setQ = (v: string) => {
    setQState(v);
    setActive(0);
  };
  const setSearchOpen = (v: boolean) => {
    if (!v) close();
  };

  const results = useMemo(() => searchProducts(index, q, 10), [q]);
  const catHits = useMemo(() => {
    const n = q.trim().toLocaleLowerCase("tr-TR");
    if (n.length < 2) return [];
    return categories.filter((c) => c.name.toLocaleLowerCase("tr-TR").includes(n) || c.subcategories.some((s) => s.name.toLocaleLowerCase("tr-TR").includes(n))).slice(0, 3);
  }, [q]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const go = (href: string) => {
    setSearchOpen(false);
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) go(`/urun/${results[active].slug}`);
      else if (q.trim()) go(`/urunler?q=${encodeURIComponent(q.trim())}`);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[8vh] sm:pt-[12vh]" role="dialog" aria-label="Ürün ara">
      <div className="absolute inset-0 bg-green-950/60 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-pop animate-fade-up">
        <div className="flex items-center gap-3 border-b border-ink-100 px-4">
          <Search className="size-5 text-ink-400" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ürün, marka veya kategori ara…"
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-ink-400"
          />
          <kbd className="hidden rounded-md border border-ink-200 px-1.5 py-0.5 text-[0.65rem] font-semibold text-ink-500 sm:block">ESC</kbd>
          <button onClick={() => setSearchOpen(false)} aria-label="Kapat" className="grid size-8 place-items-center rounded-lg hover:bg-ink-100 sm:hidden">
            <X className="size-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {q.trim().length < 2 ? (
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Popüler aramalar</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {popular.map((p) => (
                  <button key={p} onClick={() => setQ(p)} className="rounded-full border border-ink-200 px-3 py-1.5 text-sm hover:border-green-700 hover:text-green-800">
                    {p}
                  </button>
                ))}
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-wider text-ink-400">Kategoriler</p>
              <div className="mt-3 grid grid-cols-2 gap-1 sm:grid-cols-3">
                {categories.map((c) => (
                  <Link key={c.slug} href={`/kategori/${c.slug}`} onClick={() => setSearchOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-paper-100">
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-2">
              {catHits.length > 0 && (
                <div className="mb-1 flex flex-wrap gap-2 px-2 py-2">
                  {catHits.map((c) => (
                    <Link key={c.slug} href={`/kategori/${c.slug}`} onClick={() => setSearchOpen(false)} className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-900 hover:bg-green-100">
                      {c.name} <ArrowRight className="size-3" />
                    </Link>
                  ))}
                </div>
              )}
              {results.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-ink-500">“{q}” için sonuç bulunamadı.</p>
              ) : (
                <ul>
                  {results.map((r, i) => (
                    <li key={r.slug}>
                      <Link
                        href={`/urun/${r.slug}`}
                        onClick={() => setSearchOpen(false)}
                        onMouseEnter={() => setActive(i)}
                        className={`flex items-center gap-3 rounded-xl px-2 py-2 ${i === active ? "bg-paper-100" : ""}`}
                      >
                        <span className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                          <ProductVisual name={r.name} category={r.category} hue={r.hue} image={r.image} sizes="48px" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">{r.name}</span>
                          <span className="block truncate text-xs text-ink-500">
                            {r.brand} · {categoryMap[r.category]?.name}
                          </span>
                        </span>
                        <span className="text-sm font-bold tabular-nums">{formatPrice(r.price)}</span>
                        {i === active && <CornerDownLeft className="size-4 text-ink-400" />}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <button onClick={() => go(`/urunler?q=${encodeURIComponent(q.trim())}`)} className="mt-1 flex w-full items-center justify-between rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-900 hover:bg-green-100">
                “{q}” için tüm sonuçları gör
                <ArrowRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
