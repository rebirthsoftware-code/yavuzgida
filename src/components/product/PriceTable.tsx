"use client";

import { Minus, Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart/CartProvider";
import { toCartItem } from "@/lib/cart";
import { formatPrice, unitPrice } from "@/lib/format";

/** Ürün sayfası fiyat tablosu: her ambalaj boyu bir satır, her satırın kendi adedi. */
export function PriceTable({ product }: { product: Product }) {
  const { add, setQty, qtyOf } = useCart();
  const cheapest = Math.min(...product.variants.map((x) => x.price / x.amount));
  return (
    <div className="overflow-hidden rounded-xl border border-ink-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink-200 bg-paper-100 text-left text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ink-500">
            <th className="px-4 py-2.5 font-bold">Ambalaj</th>
            <th className="hidden px-4 py-2.5 font-bold sm:table-cell">Birim fiyat</th>
            <th className="hidden px-4 py-2.5 font-bold md:table-cell">Koli</th>
            <th className="px-4 py-2.5 text-right font-bold">Fiyat</th>
            <th className="px-4 py-2.5 text-right font-bold">Adet</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {product.variants.map((v) => {
            const qty = qtyOf(product.slug, v.id);
            const best = product.variants.length > 1 && v.price / v.amount === cheapest;
            return (
              <tr key={v.id} className={!v.inStock ? "opacity-50" : ""}>
                <td className="px-4 py-3">
                  <p className="font-semibold text-navy-900">{v.label}</p>
                  <p className="text-xs text-ink-500 sm:hidden">{unitPrice(v.price, v.amount, v.amountUnit)}</p>
                  {best && <span className="mt-1 inline-block rounded bg-orange-100 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wide text-orange-700">En avantajlı</span>}
                  {!v.inStock && <span className="ml-2 text-xs text-ink-500">Stokta yok</span>}
                </td>
                <td className="hidden px-4 py-3 text-ink-600 sm:table-cell">{unitPrice(v.price, v.amount, v.amountUnit)}</td>
                <td className="hidden px-4 py-3 text-ink-600 md:table-cell">{v.caseQty ? `${v.caseQty} adet` : "—"}</td>
                <td className="px-4 py-3 text-right">
                  <span className="font-display text-xl font-semibold tabular-nums text-navy-900">{formatPrice(v.price)}</span>
                  {v.oldPrice && <span className="ml-1.5 text-xs tabular-nums text-ink-400 line-through">{formatPrice(v.oldPrice)}</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  {qty > 0 ? (
                    <span className="inline-flex h-9 items-center rounded-md bg-navy-900 text-white">
                      <button aria-label="Azalt" onClick={() => setQty(product.slug, v.id, qty - 1)} className="grid size-9 place-items-center rounded-l-md hover:bg-navy-800">
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-7 text-center font-semibold tabular-nums">{qty}</span>
                      <button aria-label="Artır" onClick={() => setQty(product.slug, v.id, qty + 1)} className="grid size-9 place-items-center rounded-r-md hover:bg-navy-800">
                        <Plus className="size-3.5" />
                      </button>
                    </span>
                  ) : (
                    <button disabled={!v.inStock} onClick={() => add(toCartItem(product, v, 1))} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-orange-500 px-3 font-semibold text-orange-700 transition hover:bg-copper hover:text-white disabled:border-ink-200 disabled:text-ink-400">
                      <Plus className="size-3.5" /> Ekle
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
