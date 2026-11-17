"use client";

import { useState, useSyncExternalStore } from "react";

const noop = () => () => {};
const useBeforeCutoff = () => useSyncExternalStore(noop, () => new Date().getHours() < 14, () => true);
import { Minus, Plus, ShoppingCart, Zap, Check, Truck, ShieldCheck, RotateCcw, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart/CartProvider";
import { toCartItem } from "@/lib/cart";
import { formatPrice, unitPrice, formatCompact } from "@/lib/format";
import { site } from "@/lib/site";

export function BuyBox({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [vid, setVid] = useState(product.variants.find((v) => v.inStock)?.id ?? product.variants[0].id);
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const v = product.variants.find((x) => x.id === vid)!;
  const beforeCutoff = useBeforeCutoff();
  const pct = v.oldPrice ? Math.round((1 - v.price / v.oldPrice) * 100) : 0;
  const freeShip = v.price * qty >= site.commerce.freeShippingThreshold;

  const addNow = () => {
    add(toCartItem(product, v, qty));
    setDone(true);
    setTimeout(() => setDone(false), 1200);
  };

  return (
    <div className="space-y-5">
      {/* Fiyat */}
      <div className="rounded-lg border border-ink-200 bg-white p-4">
        <div className="flex flex-wrap items-end gap-3">
          {pct > 0 && <span className="rounded bg-red-600 px-2 py-1 text-sm font-extrabold text-white">%{pct}</span>}
          <div>
            {v.oldPrice && <p className="text-sm text-ink-400 line-through">{formatPrice(v.oldPrice)}</p>}
            <p className={`text-3xl font-extrabold ${pct > 0 ? "text-orange-600" : "text-ink-900"}`}>{formatPrice(v.price)}</p>
          </div>
          <p className="pb-1 text-xs text-ink-500">
            {unitPrice(v.price, v.amount, v.amountUnit)} · KDV dâhil
          </p>
        </div>
        {v.caseQty && <p className="mt-2 text-xs text-ink-500">Koli içi {v.caseQty} adet · koli alımında sepette kademeli indirim</p>}
      </div>

      {/* Boy seçimi */}
      <div>
        <p className="mb-2 text-sm font-semibold text-ink-900">
          Ambalaj: <span className="font-normal text-ink-600">{v.label}</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((x) => (
            <button
              key={x.id}
              disabled={!x.inStock}
              onClick={() => setVid(x.id)}
              className={`rounded-lg border-2 px-3 py-2 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${x.id === vid ? "border-orange-500 bg-orange-50" : "border-ink-200 bg-white hover:border-ink-400"}`}
            >
              <span className="block text-sm font-bold text-ink-900">{x.label}</span>
              <span className="block text-xs text-ink-600">{formatPrice(x.price)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Adet + butonlar */}
      <div className="flex flex-wrap gap-2">
        <div className="flex h-12 items-center rounded-lg border border-ink-200 bg-white">
          <button aria-label="Azalt" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-12 place-items-center hover:bg-paper-100">
            <Minus className="size-4" />
          </button>
          <input value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value.replace(/\D/g, "")) || 1))} inputMode="numeric" aria-label="Adet" className="w-12 bg-transparent text-center font-bold outline-none" />
          <button aria-label="Artır" onClick={() => setQty((q) => q + 1)} className="grid size-12 place-items-center hover:bg-paper-100">
            <Plus className="size-4" />
          </button>
        </div>
        <button onClick={addNow} disabled={!v.inStock} className={`inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg text-base font-bold text-white transition disabled:opacity-50 ${done ? "bg-green-600" : "bg-orange-500 hover:bg-orange-600"}`}>
          {done ? <Check className="size-5" /> : <ShoppingCart className="size-5" />}
          {done ? "Sepete Eklendi" : v.inStock ? "Sepete Ekle" : "Tükendi"}
        </button>
        <button
          onClick={() => {
            add(toCartItem(product, v, qty));
            router.push("/odeme");
          }}
          disabled={!v.inStock}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-navy-900 px-5 text-base font-bold text-white hover:bg-navy-800 disabled:opacity-50"
        >
          <Zap className="size-4" /> Şimdi Al
        </button>
      </div>

      {/* Teslimat bilgileri */}
      <ul className="divide-y divide-ink-100 rounded-lg border border-ink-200 bg-white text-sm">
        <li className="flex items-center gap-3 px-4 py-2.5">
          <Truck className="size-4 shrink-0 text-green-600" />
          <span>
            <b className="text-green-600">Tahmini kargoya teslim: </b>
            {beforeCutoff ? "bugün" : "yarın"} · Teslimat 1–3 iş günü
          </span>
        </li>
        <li className="flex items-center gap-3 px-4 py-2.5">
          <Truck className="size-4 shrink-0 text-ink-400" />
          <span>{freeShip ? <b className="text-green-600">Bu siparişte kargo bedava</b> : <>{formatCompact(site.commerce.freeShippingThreshold)} üzeri siparişlerde kargo bedava</>}</span>
        </li>
        <li className="flex items-center gap-3 px-4 py-2.5">
          <RotateCcw className="size-4 shrink-0 text-ink-400" /> 14 gün içinde koşulsuz iade
        </li>
        <li className="flex items-center gap-3 px-4 py-2.5">
          <ShieldCheck className="size-4 shrink-0 text-ink-400" /> 3D Secure güvenli ödeme · Havale/EFT
        </li>
        <li className="flex items-center gap-3 px-4 py-2.5">
          <Building2 className="size-4 shrink-0 text-ink-400" /> Kurumsal e-fatura ve vade seçeneği
        </li>
      </ul>
    </div>
  );
}
