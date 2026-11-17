"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { ProductImage } from "./ProductImage";
import { PackArt } from "./PackArt";

/** Görsel + küçük resimler (fotoğraf yoksa her boy için ambalaj görseli). */
export function Gallery({ product }: { product: Product }) {
  const [i, setI] = useState(0);
  const v = product.variants[i] ?? product.variants[0];
  return (
    <div className="flex gap-3">
      <div className="hidden w-16 flex-col gap-2 sm:flex">
        {product.variants.map((x, k) => (
          <button key={x.id} onClick={() => setI(k)} aria-label={x.label} className={`grid aspect-square place-items-center rounded-md border-2 bg-paper-50 ${k === i ? "border-orange-500" : "border-ink-200 hover:border-ink-400"}`}>
            <PackArt art={product.art} hue={product.hue} name={product.name} brand={product.brand} className="h-12" />
          </button>
        ))}
      </div>
      <div className="relative aspect-square flex-1 overflow-hidden rounded-lg border border-ink-200 bg-white">
        <ProductImage name={product.name} brand={product.brand} art={product.art} hue={product.hue} image={product.image} label={v.label} sizes="(min-width: 1024px) 40vw, 100vw" priority />
      </div>
    </div>
  );
}
