import type { ProductIndex } from "@/lib/types";
import { ProductCard } from "./ProductCard";

/** Yatay kaydırmalı ürün rayı (mobil) / grid (masaüstü) */
export function ProductRail({ items }: { items: ProductIndex[] }) {
  return (
    <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4 xl:grid-cols-6">
      {items.map((p) => (
        <div key={p.slug} className="w-[58%] shrink-0 snap-start xs:w-[46%] sm:w-auto">
          <ProductCard p={p} />
        </div>
      ))}
    </div>
  );
}
