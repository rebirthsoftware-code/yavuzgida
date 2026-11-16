"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBasket, Check, Package } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart/CartProvider";
import { toCartItem } from "@/lib/cart";
import { formatPrice, unitPrice } from "@/lib/format";
import { Price } from "@/components/ui/Price";

export function AddToCartPanel({ product }: { product: Product }) {
  const { add, setOpen } = useCart();
  const [vid, setVid] = useState(product.variants.find((v) => v.inStock)?.id ?? product.variants[0].id);
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const v = product.variants.find((x) => x.id === vid)!;
  const cheapestPerUnit = Math.min(...product.variants.map((x) => x.price / x.amount));

  const submit = () => {
    add(toCartItem(product, v, qty));
    setDone(true);
    setTimeout(() => setDone(false), 1200);
  };

  return (
    <div className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-400">Ambalaj seçin</p>
      <div className="mt-3 grid gap-2">
        {product.variants.map((x) => {
          const on = x.id === vid;
          const best = x.price / x.amount === cheapestPerUnit && product.variants.length > 1;
          return (
            <button
              key={x.id}
              disabled={!x.inStock}
              onClick={() => setVid(x.id)}
              className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3 text-left transition disabled:opacity-50 ${on ? "border-navy-900 bg-sky-50" : "border-ink-100 hover:border-ink-300"}`}
            >
              <span>
                <span className="flex items-center gap-2 font-semibold">
                  {x.label}
                  {best && <span className="rounded-md bg-orange-100 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase text-orange-700">En avantajlı</span>}
                  {!x.inStock && <span className="text-xs font-medium text-ink-400">Stokta yok</span>}
                </span>
                <span className="block text-xs text-ink-500">
                  {unitPrice(x.price, x.amount, x.amountUnit)}
                  {x.caseQty ? ` · Koli: ${x.caseQty} adet` : ""}
                </span>
              </span>
              <span className="text-right">
                <span className="block font-display text-lg font-bold tabular-nums">{formatPrice(x.price)}</span>
                {x.oldPrice && <span className="block text-xs tabular-nums text-ink-400 line-through">{formatPrice(x.oldPrice)}</span>}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-end justify-between gap-4 border-t border-ink-100 pt-5">
        <div>
          <p className="text-xs text-ink-500">Toplam (KDV dâhil)</p>
          <Price value={v.price * qty} size="lg" />
        </div>
        <div className="flex items-center rounded-xl border-2 border-ink-100">
          <button aria-label="Azalt" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-11 place-items-center hover:bg-paper-100">
            <Minus className="size-4" />
          </button>
          <input value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value.replace(/\D/g, "")) || 1))} inputMode="numeric" className="w-12 bg-transparent text-center font-bold tabular-nums outline-none" aria-label="Adet" />
          <button aria-label="Artır" onClick={() => setQty((q) => q + 1)} className="grid size-11 place-items-center hover:bg-paper-100">
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
        <button onClick={submit} disabled={!v.inStock} className={`inline-flex h-13 items-center justify-center gap-2 rounded-full text-base font-semibold text-white transition active:scale-[0.98] disabled:opacity-50 ${done ? "bg-navy-900" : "bg-copper shadow-glow hover:brightness-105"}`}>
          {done ? <Check className="size-5" /> : <ShoppingBasket className="size-5" />}
          {done ? "Sepete eklendi" : "Sepete ekle"}
        </button>
        <button onClick={() => setOpen(true)} className="inline-flex h-13 items-center justify-center rounded-full border border-ink-200 px-5 text-sm font-semibold hover:border-navy-900">
          Sepet
        </button>
      </div>

      {v.caseQty && (
        <p className="mt-4 flex items-center gap-2 rounded-xl bg-paper-50 px-3 py-2.5 text-xs text-ink-600">
          <Package className="size-4 shrink-0 text-orange-600" />
          Koli alımı için {v.caseQty} adet seçin; toplu alımda kademeli indirim sepette otomatik uygulanır.
        </p>
      )}
      <p className="mt-3 text-xs text-ink-400">Stok kodu: {v.sku}</p>
    </div>
  );
}
