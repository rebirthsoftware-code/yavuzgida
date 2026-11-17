"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import type { Product } from "@/lib/types";

export function ProductTabs({ product: p }: { product: Product }) {
  const tabs = ["Ürün Açıklaması", "Özellikler", `Değerlendirmeler (${p.reviews})`, "Teslimat & İade"];
  const [t, setT] = useState(0);
  const dist = [62, 24, 9, 3, 2];
  return (
    <div className="rounded-lg border border-ink-200 bg-white">
      <div className="flex overflow-x-auto border-b border-ink-100 no-scrollbar">
        {tabs.map((x, i) => (
          <button key={x} onClick={() => setT(i)} className={`shrink-0 px-5 py-3 text-sm font-semibold transition ${i === t ? "border-b-2 border-orange-500 text-orange-600" : "text-ink-600 hover:text-ink-900"}`}>
            {x}
          </button>
        ))}
      </div>
      <div className="p-5 text-sm leading-relaxed text-ink-700">
        {t === 0 && (
          <div className="max-w-3xl space-y-3">
            <p className="text-base font-semibold text-ink-900">{p.short}</p>
            <p>{p.description}</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Ambalaj boyları: {p.variants.map((v) => v.label).join(", ")}</li>
              <li>Toplu alımlarda kademeli indirim sepette otomatik uygulanır.</li>
              <li>Kurumsal müşterilere e-fatura ve cari hesap imkânı.</li>
            </ul>
          </div>
        )}
        {t === 1 && (
          <dl className="grid max-w-3xl gap-x-8 sm:grid-cols-2">
            {[...p.specs, { label: "Stok kodu", value: p.variants[0].sku }, { label: "Kategori", value: p.category }].map((s) => (
              <div key={s.label} className="flex justify-between gap-4 border-b border-ink-100 py-2">
                <dt className="text-ink-500">{s.label}</dt>
                <dd className="text-right font-medium text-ink-900">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {t === 2 && (
          <div className="grid max-w-3xl gap-6 sm:grid-cols-[180px_1fr]">
            <div className="text-center">
              <p className="text-5xl font-extrabold text-ink-900">{p.rating.toFixed(1)}</p>
              <div className="mt-1 flex justify-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`size-4 ${i <= Math.round(p.rating) ? "text-star" : "text-ink-200"}`} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-1 text-xs text-ink-500">{p.reviews} değerlendirme</p>
            </div>
            <div className="space-y-1.5">
              {dist.map((pct, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-10 text-ink-600">{5 - i} yıldız</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100">
                    <div className="h-full bg-star" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-right text-ink-500">%{pct}</span>
                </div>
              ))}
              <p className="pt-3 text-xs text-ink-400">Müşteri yorumları yayın öncesi gerçek siparişlerden toplanacaktır.</p>
            </div>
          </div>
        )}
        {t === 3 && (
          <ul className="max-w-3xl space-y-2">
            <li>Hafta içi 14:00&apos;a kadar verilen siparişler aynı gün kargoya teslim edilir.</li>
            <li>Teslimat süresi 1–3 iş günüdür; kurumsal müşterilere bölgesel rotalarda araçla teslimat yapılır.</li>
            <li>Açılmamış ve ambalajı bozulmamış ürünler 14 gün içinde iade edilebilir.</li>
          </ul>
        )}
      </div>
    </div>
  );
}
