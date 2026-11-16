"use client";

import Link from "next/link";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { ProductIndex, Variant } from "@/lib/types";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice, unitPrice } from "@/lib/format";
import { categoryMap } from "@/lib/categories";
import { TagBadge } from "@/components/ui/Badge";

/**
 * Fiyat listesi satırı: ürün adı · ambalaj boyu seçimi (fiyatlı) · adet.
 * Kart yok, fotoğraf yok; 600 ürünü taranabilir tutan yoğun ama ferah satır.
 */
export function ProductRow({ p, showCategory = false }: { p: ProductIndex; showCategory?: boolean }) {
  const { add, setQty, qtyOf } = useCart();
  const firstAvailable = p.variants.find((v) => v.inStock) ?? p.variants[0];
  const [vid, setVid] = useState(firstAvailable.id);
  const v = p.variants.find((x) => x.id === vid) ?? firstAvailable;
  const qty = qtyOf(p.slug, v.id);
  const cat = categoryMap[p.category];
  const sub = cat?.subcategories.find((s) => s.slug === p.subcategory)?.name;
  const badge = (["indirim", "cok-satan", "yeni"] as const).find((t) => p.tags.includes(t));

  const addOne = (variant: Variant) =>
    add({ slug: p.slug, variantId: variant.id, name: p.name, brand: p.brand, variantLabel: variant.label, sku: variant.sku, price: variant.price, qty: 1, hue: p.hue, image: p.image, category: p.category });

  return (
    <li className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 px-4 py-3 transition hover:bg-white md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.5fr)_auto] md:gap-x-5 lg:px-6">
      {/* Ad */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Link href={`/urun/${p.slug}`} className="truncate font-display text-[1.2rem] font-semibold leading-tight text-navy-900 hover:text-orange-700">
            {p.name}
          </Link>
          {badge && <TagBadge tag={badge} />}
        </div>
        <p className="truncate text-xs text-ink-500">
          {p.brand}
          {showCategory && cat ? ` · ${cat.name}` : ""}
          {sub ? ` · ${sub}` : ""}
          <span className="hidden sm:inline"> · {unitPrice(v.price, v.amount, v.amountUnit)}</span>
        </p>
      </div>

      {/* Adet (mobilde sağ üst) */}
      <div className="row-start-1 col-start-2 md:col-start-3">
        {qty > 0 ? (
          <span className="inline-flex h-9 items-center rounded-md bg-navy-900 text-white">
            <button aria-label="Azalt" onClick={() => setQty(p.slug, v.id, qty - 1)} className="grid size-9 place-items-center rounded-l-md hover:bg-navy-800">
              <Minus className="size-3.5" />
            </button>
            <span className="w-7 text-center text-sm font-semibold tabular-nums">{qty}</span>
            <button aria-label="Artır" onClick={() => setQty(p.slug, v.id, qty + 1)} className="grid size-9 place-items-center rounded-r-md hover:bg-navy-800">
              <Plus className="size-3.5" />
            </button>
          </span>
        ) : (
          <button
            disabled={!v.inStock}
            onClick={() => addOne(v)}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-orange-500 px-3 text-sm font-semibold text-orange-700 transition hover:bg-copper hover:text-white disabled:border-ink-200 disabled:text-ink-400 disabled:hover:bg-transparent"
          >
            <Plus className="size-3.5" /> {v.inStock ? "Ekle" : "Yok"}
          </button>
        )}
      </div>

      {/* Ambalaj boyları */}
      <div className="col-span-2 flex flex-wrap gap-1.5 md:col-span-1 md:col-start-2 md:row-start-1">
        {p.variants.map((x) => {
          const on = x.id === v.id;
          const inList = qtyOf(p.slug, x.id);
          return (
            <button
              key={x.id}
              onClick={() => setVid(x.id)}
              disabled={!x.inStock}
              title={unitPrice(x.price, x.amount, x.amountUnit)}
              className={`relative inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs transition disabled:border-dashed disabled:opacity-50 ${
                on ? "border-navy-900 bg-navy-900 text-white" : "border-ink-200 bg-white text-ink-700 hover:border-navy-900"
              }`}
            >
              <span className="font-medium">{x.label}</span>
              <span className={`font-semibold tabular-nums ${on ? "text-orange-300" : "text-navy-900"}`}>{formatPrice(x.price)}</span>
              {x.oldPrice && <span className="text-[0.65rem] tabular-nums line-through opacity-60">{formatPrice(x.oldPrice)}</span>}
              {inList > 0 && <span className="absolute -right-1.5 -top-1.5 grid min-w-4 place-items-center rounded-full bg-orange-500 px-1 text-[0.6rem] font-bold leading-4 text-white">{inList}</span>}
            </button>
          );
        })}
      </div>
    </li>
  );
}
