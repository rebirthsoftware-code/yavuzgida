"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBasket, ArrowRight, Truck } from "lucide-react";
import { useCart } from "./CartProvider";
import { ProductVisual } from "@/components/product/ProductVisual";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";

export function CartPage() {
  const { items, subtotal, setQty, remove, clear, ready } = useCart();
  const shipping = subtotal >= site.commerce.freeShippingThreshold || subtotal === 0 ? 0 : site.commerce.shippingFee;
  const total = subtotal + shipping;

  if (!ready) return <div className="h-64 animate-pulse-soft rounded-3xl bg-white shadow-card" />;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl bg-white px-6 py-20 text-center shadow-card">
        <span className="grid size-20 place-items-center rounded-3xl bg-paper-100">
          <ShoppingBasket className="size-9 text-ink-400" />
        </span>
        <h2 className="mt-5 text-2xl font-bold">Sepetiniz boş</h2>
        <p className="mt-2 text-ink-500">600’den fazla ürün arasından seçim yapın.</p>
        <ButtonLink href="/urunler" className="mt-6">
          Alışverişe başla <ArrowRight className="size-4" />
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="rounded-3xl bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <p className="font-semibold">{items.length} kalem ürün</p>
          <button onClick={clear} className="text-xs font-semibold text-ink-500 hover:text-red-600">
            Sepeti boşalt
          </button>
        </div>
        <ul className="divide-y divide-ink-100">
          {items.map((it) => (
            <li key={`${it.slug}-${it.variantId}`} className="grid grid-cols-[72px_1fr] gap-4 px-5 py-4 sm:grid-cols-[88px_1fr_auto_auto] sm:items-center">
              <Link href={`/urun/${it.slug}`} className="relative aspect-square overflow-hidden rounded-xl">
                <ProductVisual name={it.name} category={it.category} hue={it.hue} image={it.image} sizes="88px" />
              </Link>
              <div className="min-w-0">
                <p className="text-[0.68rem] font-bold uppercase tracking-wider text-ink-400">{it.brand}</p>
                <Link href={`/urun/${it.slug}`} className="font-semibold hover:text-sky-700">
                  {it.name}
                </Link>
                <p className="text-sm text-ink-500">
                  {it.variantLabel} · {formatPrice(it.price)}
                </p>
                <p className="text-xs text-ink-400">{it.sku}</p>
              </div>
              <div className="col-start-2 flex items-center rounded-xl border border-ink-200 sm:col-start-auto">
                <button aria-label="Azalt" onClick={() => (it.qty <= 1 ? remove(it.slug, it.variantId) : setQty(it.slug, it.variantId, it.qty - 1))} className="grid size-10 place-items-center hover:bg-paper-100">
                  {it.qty <= 1 ? <Trash2 className="size-4" /> : <Minus className="size-4" />}
                </button>
                <span className="w-10 text-center font-bold tabular-nums">{it.qty}</span>
                <button aria-label="Artır" onClick={() => setQty(it.slug, it.variantId, it.qty + 1)} className="grid size-10 place-items-center hover:bg-paper-100">
                  <Plus className="size-4" />
                </button>
              </div>
              <div className="col-start-2 flex items-center justify-between sm:col-start-auto sm:block sm:text-right">
                <span className="font-display text-lg font-bold tabular-nums">{formatPrice(it.price * it.qty)}</span>
                <button onClick={() => remove(it.slug, it.variantId)} className="ml-3 text-xs text-ink-400 hover:text-red-600 sm:ml-0 sm:block">
                  Kaldır
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="sticky top-[150px] rounded-3xl bg-white p-6 shadow-card">
        <h2 className="text-lg font-bold">Sipariş özeti</h2>
        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-500">Ara toplam</dt>
            <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">Kargo</dt>
            <dd className="tabular-nums">{shipping === 0 ? <span className="font-semibold text-sky-600">Ücretsiz</span> : formatPrice(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-ink-100 pt-3 text-base">
            <dt className="font-semibold">Toplam</dt>
            <dd className="font-display text-2xl font-bold tabular-nums">{formatPrice(total)}</dd>
          </div>
        </dl>
        {shipping > 0 && (
          <p className="mt-3 flex items-start gap-2 rounded-xl bg-sky-50 px-3 py-2.5 text-xs text-navy-900">
            <Truck className="mt-0.5 size-4 shrink-0" />
            {formatPrice(site.commerce.freeShippingThreshold - subtotal)} daha ekleyin, kargo bedava olsun.
          </p>
        )}
        <ButtonLink href="/odeme" variant="accent" size="lg" className="mt-5 w-full">
          Ödemeye geç <ArrowRight className="size-4" />
        </ButtonLink>
        <p className="mt-3 text-center text-xs text-ink-400">Kredi kartı · Havale/EFT · Kurumsal vade</p>
      </aside>
    </div>
  );
}
