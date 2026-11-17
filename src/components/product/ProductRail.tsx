"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductIndex } from "@/lib/types";
import { ProductCard } from "./ProductCard";

/** Yatay kaydırmalı ürün rayı, oklarla. */
export function ProductRail({ items }: { items: ProductIndex[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className="relative">
      <div ref={ref} className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:px-0">
        {items.map((p) => (
          <div key={p.slug} className="w-[46%] shrink-0 snap-start sm:w-[31%] md:w-[23.5%] lg:w-[19%] xl:w-[15.6%]">
            <ProductCard p={p} compact />
          </div>
        ))}
      </div>
      <button onClick={() => scroll(-1)} aria-label="Geri" className="absolute -left-4 top-1/3 hidden size-10 place-items-center rounded-full border border-ink-200 bg-white shadow-card hover:border-orange-500 hover:text-orange-600 lg:grid">
        <ChevronLeft className="size-5" />
      </button>
      <button onClick={() => scroll(1)} aria-label="İleri" className="absolute -right-4 top-1/3 hidden size-10 place-items-center rounded-full border border-ink-200 bg-white shadow-card hover:border-orange-500 hover:text-orange-600 lg:grid">
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
