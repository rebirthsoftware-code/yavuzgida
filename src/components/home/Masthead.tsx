"use client";

import { Search, ArrowRight } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { ButtonLink } from "@/components/ui/Button";

export function Masthead({ productCount, categoryCount }: { productCount: number; categoryCount: number }) {
  const { setSearchOpen } = useCart();
  const month = new Date(2026, 10, 1).toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
  return (
    <section className="border-b border-ink-200 px-4 pb-10 pt-8 lg:px-6 lg:pt-12">
      <p className="flex flex-wrap items-center gap-x-3 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-ink-500">
        <span className="text-orange-600">Fiyat listesi</span>
        <span className="h-px w-6 bg-ink-300" />
        {month}
        <span className="h-px w-6 bg-ink-300" />
        {productCount} ürün · {categoryCount} kategori
      </p>
      <h1 className="mt-5 max-w-4xl text-[3.2rem] leading-[0.98] text-navy-900 sm:text-[4.4rem] lg:text-[5.4rem]">
        Mutfağınızın
        <br />
        <em className="font-medium italic text-orange-600">toptancısı.</em>
      </h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <p className="max-w-xl text-[1.05rem] leading-relaxed text-ink-700">
            Bakliyattan baharata, zeytinyağından kuruyemişe. Satırda ambalaj boyunu seçin, adedi girin; sipariş listeniz yanınızda oluşsun. Market, restoran ve kafeler için kademeli toptan fiyat.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => setSearchOpen(true)} className="inline-flex h-12 items-center gap-3 rounded-lg border border-ink-300 bg-white pl-4 pr-2 text-sm text-ink-500 transition hover:border-navy-900">
              <Search className="size-4 text-ink-400" />
              <span className="w-56 text-left">Ürün veya marka yazın…</span>
              <span className="bg-copper grid h-8 place-items-center rounded-md px-3 text-xs font-semibold text-white">Ara</span>
            </button>
            <ButtonLink href="/urunler" size="lg" variant="primary">
              Fiyat listesini aç <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>
        <dl className="grid grid-cols-3 divide-x divide-ink-200 border-y border-ink-200">
          {[
            ["14:00", "öncesi sipariş, aynı gün kargo"],
            ["81 il", "1–3 iş günü teslimat"],
            ["2.500 ₺", "üzeri kargo bedava"],
          ].map(([v, l]) => (
            <div key={l} className="px-4 py-4 first:pl-0">
              <dt className="font-display text-3xl font-semibold text-navy-900">{v}</dt>
              <dd className="mt-0.5 text-xs leading-snug text-ink-500">{l}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
