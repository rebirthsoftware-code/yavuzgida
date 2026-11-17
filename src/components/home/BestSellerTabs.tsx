"use client";

import { useState } from "react";
import type { ProductIndex } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function BestSellerTabs({ groups }: { groups: { key: string; label: string; items: ProductIndex[] }[] }) {
  const [active, setActive] = useState(groups[0]?.key);
  const g = groups.find((x) => x.key === active) ?? groups[0];
  return (
    <section>
      <SectionHeading title="Çok Satanlar" sub="Restoran ve marketlerin her hafta yeniden sipariş verdiği ürünler" href={`/urunler?etiket=cok-satan&sirala=populer${g.key !== "all" ? `&kategori=${g.key}` : ""}`} />
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
        {groups.map((x) => (
          <button key={x.key} onClick={() => setActive(x.key)} className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition ${x.key === g.key ? "border-orange-500 bg-orange-500 text-white" : "border-ink-200 bg-white text-ink-700 hover:border-orange-400"}`}>
            {x.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {g.items.map((p) => (
          <ProductCard key={p.slug} p={p} compact />
        ))}
      </div>
    </section>
  );
}
