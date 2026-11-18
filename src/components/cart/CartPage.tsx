"use client";

import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Truck, Tag, ShieldCheck } from "lucide-react";
import { useCart } from "./CartProvider";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { PackArt } from "@/components/product/PackArt";

export function CartPage() {
  const { items, subtotal, count, setQty, remove, clear, ready } = useCart();
  const [coupon, setCoupon] = useState("");
  const shipping = subtotal >= site.commerce.freeShippingThreshold || subtotal === 0 ? 0 : site.commerce.shippingFee;
  const discount = subtotal >= 5000 ? Math.round(subtotal * 0.04) : 0;
  const total = subtotal + shipping - discount;
  const remaining = Math.max(0, site.commerce.freeShippingThreshold - subtotal);

  if (!ready) return <div className="h-64 animate-pulse rounded-lg bg-white" />;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-lg border border-ink-200 bg-white px-6 py-20 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-orange-50 text-orange-500">
          <ShoppingCart className="size-9" />
        </span>
        <h2 className="mt-5 text-xl font-bold text-ink-900">Sepetinizde ürün bulunmamaktadır</h2>
        <p className="mt-1 text-sm text-ink-500">600&apos;den fazla kafe ürünü arasından seçim yapın.</p>
        <ButtonLink href="/urunler" className="mt-6">
          Alışverişe Başla <ArrowRight className="size-4" />
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_340px] lg:items-start">
      <div className="space-y-3">
        {remaining > 0 ? (
          <div className="flex items-center gap-3 rounded-lg border border-green-100 bg-green-100/60 px-4 py-3 text-sm text-ink-800">
            <Truck className="size-5 shrink-0 text-green-600" />
            <span>
              <b>{formatPrice(remaining)}</b> daha ekleyin, <b className="text-green-600">kargo bedava</b> olsun.
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-lg border border-green-100 bg-green-100/60 px-4 py-3 text-sm font-semibold text-green-600">
            <Truck className="size-5 shrink-0" /> Kargonuz bedava!
          </div>
        )}

        <div className="rounded-lg border border-ink-200 bg-white">
          <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3 text-sm">
            <p>
              <b className="text-ink-900">Satıcı: Yavuz Gıda</b> <span className="ml-2 rounded bg-green-100 px-1.5 py-0.5 text-[0.7rem] font-bold text-green-600">9.6</span>
            </p>
            <button onClick={clear} className="text-xs font-semibold text-ink-500 hover:text-red-600">
              Sepeti Boşalt
            </button>
          </div>
          <ul className="divide-y divide-ink-100">
            {items.map((it) => (
              <li key={`${it.slug}-${it.variantId}`} className="grid grid-cols-[72px_1fr] gap-3 px-4 py-4 sm:grid-cols-[88px_1fr_auto_auto] sm:items-center sm:gap-4">
                <Link href={`/urun/${it.slug}`} className="grid aspect-square place-items-center rounded-md border border-ink-100 bg-paper-50">
                  <PackArt art={it.art} hue={it.hue} name={it.name} brand={it.brand} className="h-[80%]" />
                </Link>
                <div className="min-w-0">
                  <Link href={`/urun/${it.slug}`} className="text-sm text-ink-800 hover:text-orange-600">
                    <b className="text-ink-900">{it.brand}</b> {it.name} {it.variantLabel}
                  </Link>
                  <p className="mt-0.5 text-xs text-ink-500">Birim: {formatPrice(it.price)} · {it.sku}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-[0.7rem] font-semibold text-green-600">
                    <Truck className="size-3" /> Tahmini kargoya teslim: 1 iş günü
                  </p>
                </div>
                <div className="col-start-2 flex items-center justify-between gap-3 sm:col-start-auto sm:justify-start">
                  <div className="flex h-9 items-center rounded-md border border-ink-200">
                    <button aria-label="Azalt" onClick={() => setQty(it.slug, it.variantId, it.qty - 1)} className="grid size-9 place-items-center text-orange-600 hover:bg-paper-100">
                      {it.qty <= 1 ? <Trash2 className="size-4" /> : <Minus className="size-4" />}
                    </button>
                    <span className="w-9 text-center text-sm font-bold">{it.qty}</span>
                    <button aria-label="Artır" onClick={() => setQty(it.slug, it.variantId, it.qty + 1)} className="grid size-9 place-items-center text-orange-600 hover:bg-paper-100">
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <span className="text-base font-extrabold text-orange-600 sm:hidden">{formatPrice(it.price * it.qty)}</span>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-base font-extrabold text-orange-600">{formatPrice(it.price * it.qty)}</p>
                  <button onClick={() => remove(it.slug, it.variantId)} className="text-xs text-ink-400 hover:text-red-600">
                    Kaldır
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <aside className="space-y-3 lg:sticky lg:top-[8.6rem]">
        <div className="rounded-lg border border-ink-200 bg-white p-4">
          <h2 className="text-base font-bold text-ink-900">Sipariş Özeti</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-600">Ürünler ({count})</dt>
              <dd className="font-medium">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-600">Kargo</dt>
              <dd className="font-medium">{shipping === 0 ? <span className="text-green-600">Bedava</span> : formatPrice(shipping)}</dd>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <dt>Sepette %4 indirim</dt>
                <dd>-{formatPrice(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-ink-100 pt-2 text-base">
              <dt className="font-bold text-ink-900">Toplam</dt>
              <dd className="text-xl font-extrabold text-orange-600">{formatPrice(total)}</dd>
            </div>
          </dl>
          <ButtonLink href="/odeme" size="lg" className="mt-4 w-full">
            Sepeti Onayla <ArrowRight className="size-4" />
          </ButtonLink>
          <p className="mt-2 flex items-center justify-center gap-1 text-[0.7rem] text-ink-400">
            <ShieldCheck className="size-3" /> 256-bit SSL ile güvenli ödeme
          </p>
        </div>
        <div className="rounded-lg border border-ink-200 bg-white p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-ink-900">
            <Tag className="size-4 text-orange-500" /> İndirim Kodu
          </p>
          <div className="mt-2 flex gap-2">
            <input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="Kodu girin" className="h-10 flex-1 rounded-md border border-ink-200 px-3 text-sm uppercase outline-none focus:border-orange-500" />
            <button type="button" className="h-10 rounded-md border border-orange-500 px-3 text-sm font-semibold text-orange-600 hover:bg-orange-50">
              Uygula
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
