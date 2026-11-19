"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Check, Truck } from "lucide-react";
import { useState } from "react";
import type { ProductIndex } from "@/lib/types";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/format";
import { Stars } from "@/components/ui/Stars";
import { ProductImage } from "./ProductImage";
import { site } from "@/lib/site";

/** Pazar yeri ürün kartı: görsel, rozetler, marka + ad, puan, fiyat, sepete ekle. */
export function ProductCard({ p, priority, compact }: { p: ProductIndex; priority?: boolean; compact?: boolean }) {
  const { add, qtyOf, showPrices, base } = useCart();
  const v = p.variants.find((x) => x.inStock) ?? p.variants[0];
  const inCart = qtyOf(p.slug, v.id);
  const [fav, setFav] = useState(false);
  const [flash, setFlash] = useState(false);
  const pct = v.oldPrice ? Math.round((1 - v.price / v.oldPrice) * 100) : 0;
  const freeShip = v.price >= site.commerce.freeShippingThreshold;
  const soldLabel = p.sold >= 1000 ? `${(p.sold / 1000).toFixed(1).replace(".0", "")}B+` : `${p.sold}`;

  const addToCart = () => {
    add({ slug: p.slug, variantId: v.id, name: p.name, brand: p.brand, variantLabel: v.label, sku: v.sku, price: v.price, qty: 1, hue: p.hue, art: p.art, image: p.image, category: p.category });
    setFlash(true);
    setTimeout(() => setFlash(false), 1000);
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-ink-200 bg-white transition hover:border-orange-400 hover:shadow-hover">
      <Link href={`${base}/urun/${p.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-paper-50" aria-label={p.name}>
        <ProductImage name={p.name} brand={p.brand} art={p.art} hue={p.hue} image={p.image} label={v.label} priority={priority} className="transition-transform duration-500 group-hover:scale-[1.05]" />
        <span className="absolute left-2 top-2 flex flex-col gap-1">
          {showPrices && pct > 0 && <span className="rounded bg-red-600 px-1.5 py-0.5 text-[0.7rem] font-extrabold text-white">%{pct}</span>}
          {p.tags.includes("cok-satan") && <span className="rounded bg-orange-500 px-1.5 py-0.5 text-[0.65rem] font-bold text-white">Çok Satan</span>}
          {p.tags.includes("yeni") && <span className="rounded bg-sky-600 px-1.5 py-0.5 text-[0.65rem] font-bold text-white">Yeni</span>}
        </span>
        {p.variants.length > 1 && <span className="absolute bottom-2 left-2 rounded bg-white/90 px-1.5 py-0.5 text-[0.65rem] font-semibold text-ink-700">+{p.variants.length - 1} boy</span>}
      </Link>
      <button
        onClick={() => setFav((f) => !f)}
        aria-label="Favorilere ekle"
        className={`absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white shadow-card transition ${fav ? "text-orange-500" : "text-ink-400 hover:text-orange-500"}`}
      >
        <Heart className="size-4" fill={fav ? "currentColor" : "none"} />
      </button>

      <div className={`flex flex-1 flex-col ${compact ? "p-2.5" : "p-3"}`}>
        <h3 className="line-clamp-2 min-h-[2.5rem] text-[0.82rem] leading-snug text-ink-800">
          <Link href={`${base}/urun/${p.slug}`}>
            <b className="font-bold text-ink-900">{p.brand}</b> {p.name} {v.label}
          </Link>
        </h3>
        <div className="mt-1.5">
          <Stars rating={p.rating} count={p.reviews} />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1 text-[0.65rem] font-semibold">
          {showPrices && freeShip && (
            <span className="inline-flex items-center gap-1 rounded bg-green-100 px-1.5 py-0.5 text-green-600">
              <Truck className="size-3" /> Kargo Bedava
            </span>
          )}
          <span className="rounded bg-sky-50 px-1.5 py-0.5 text-sky-700">{soldLabel} satıldı</span>
        </div>
        <div className="mt-auto pt-3">
          {!showPrices ? (
            <span className="text-xs font-semibold text-ink-500">Anlaşmalı fiyatınız geçerlidir</span>
          ) : v.oldPrice ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-ink-400 line-through">{formatPrice(v.oldPrice)}</span>
              <span className="text-[1.05rem] font-extrabold text-orange-600">{formatPrice(v.price)}</span>
            </div>
          ) : (
            <span className="text-[1.05rem] font-extrabold text-ink-900">{formatPrice(v.price)}</span>
          )}
          <button
            onClick={addToCart}
            disabled={!v.inStock}
            className={`mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-md border text-sm font-semibold transition disabled:opacity-50 ${
              flash ? "border-green-600 bg-green-600 text-white" : inCart > 0 ? "border-orange-500 bg-orange-500 text-white hover:bg-orange-600" : "border-orange-500 bg-white text-orange-600 hover:bg-orange-500 hover:text-white"
            }`}
          >
            {flash ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
            {flash ? "Eklendi" : inCart > 0 ? `${showPrices ? "Sepette" : "Listede"} (${inCart}) · Ekle` : v.inStock ? (showPrices ? "Sepete Ekle" : "Listeye Ekle") : "Tükendi"}
          </button>
        </div>
      </div>
    </article>
  );
}
