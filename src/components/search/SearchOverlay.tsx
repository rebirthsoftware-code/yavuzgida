"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { searchProducts } from "@/lib/search";
import { categoryMap, categories } from "@/lib/categories";
import type { ProductIndex } from "@/lib/types";
import indexJson from "@/data/catalog-index.json";
import { formatPrice } from "@/lib/format";
import { minPriceOf } from "@/lib/index-of";
import { PackArt } from "@/components/product/PackArt";

const index = indexJson as ProductIndex[];
const popular = ["Espresso", "Karamel şurubu", "Yulaf sütü", "Karton bardak", "Salep", "Matcha", "Tamper", "Stick şeker"];

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
  return <Panel close={() => setSearchOpen(false)} />;
}

function Panel({ close }: { close: () => void }) {
  const { showPrices } = useCart();
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const results = useMemo(() => searchProducts(index, q, 12), [q]);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  const go = (href: string) => {
    close();
    router.push(href);
  };
  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-white" role="dialog" aria-label="Ürün ara">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (q.trim()) go(`/urunler?q=${encodeURIComponent(q.trim())}`);
        }}
        className="flex items-center gap-2 border-b border-ink-200 px-3 py-2"
      >
        <div className="flex h-11 flex-1 items-center gap-2 rounded-lg border-2 border-orange-500 px-3">
          <Search className="size-4 text-ink-400" />
          <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ürün, marka veya kategori ara" className="h-full flex-1 bg-transparent text-sm outline-none" />
        </div>
        <button type="button" onClick={close} aria-label="Kapat" className="grid size-10 place-items-center rounded-lg hover:bg-paper-100">
          <X className="size-5" />
        </button>
      </form>
      <div className="flex-1 overflow-y-auto">
        {q.trim().length < 2 ? (
          <div className="p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Popüler aramalar</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {popular.map((p) => (
                <button key={p} onClick={() => setQ(p)} className="rounded-full border border-ink-200 px-3 py-1.5 text-sm">
                  {p}
                </button>
              ))}
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-ink-400">Kategoriler</p>
            <ul className="mt-2 divide-y divide-ink-100">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/kategori/${c.slug}`} onClick={close} className="flex items-center justify-between py-2.5 text-sm">
                    {c.name} <ArrowRight className="size-4 text-ink-300" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : results.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink-500">Sonuç bulunamadı.</p>
        ) : (
          <ul className="divide-y divide-ink-100">
            {results.map((r) => (
              <li key={r.slug}>
                <Link href={`/urun/${r.slug}`} onClick={close} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="grid size-12 shrink-0 place-items-center rounded-md bg-paper-100">
                    <PackArt art={r.art} hue={r.hue} name={r.name} brand={r.brand} className="h-10" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm">
                      <b>{r.brand}</b> {r.name}
                    </span>
                    <span className="block text-xs text-ink-500">{categoryMap[r.category]?.name}</span>
                  </span>
                  {showPrices && <span className="text-sm font-bold">{formatPrice(minPriceOf(r))}</span>}
                </Link>
              </li>
            ))}
            <li>
              <button onClick={() => go(`/urunler?q=${encodeURIComponent(q.trim())}`)} className="w-full bg-paper-50 px-4 py-3 text-center text-sm font-semibold text-orange-600">
                Tüm sonuçları gör
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
