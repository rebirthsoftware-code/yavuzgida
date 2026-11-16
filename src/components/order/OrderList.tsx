"use client";

import Link from "next/link";
import { Minus, Plus, X, ClipboardList, ArrowRight, Truck, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { categoryMap } from "@/lib/categories";

/**
 * Sipariş listesi gövdesi: masaüstünde sağ panelde, mobilde tam ekran sayfada,
 * /sepet sayfasında geniş hâliyle kullanılır. "Sepet" yerine satır satır sipariş fişi mantığı.
 */
export function OrderList({ onNavigate, wide = false }: { onNavigate?: () => void; wide?: boolean }) {
  const { items, subtotal, count, setQty, remove, clear, ready, lastKey } = useCart();
  const threshold = site.commerce.freeShippingThreshold;
  const remaining = Math.max(0, threshold - subtotal);
  const shipping = subtotal === 0 || remaining === 0 ? 0 : site.commerce.shippingFee;

  if (!ready) return <div className="p-5 text-sm text-ink-400">Yükleniyor…</div>;

  if (items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
        <ClipboardList className="size-8 text-ink-300" strokeWidth={1.5} />
        <p className="mt-4 font-display text-2xl text-navy-900">Listeniz boş</p>
        <p className="mt-1 max-w-[16rem] text-sm text-ink-500">Satırlardaki + ile ürünleri ekleyin; liste burada anında oluşsun.</p>
        <ButtonLink href="/urunler" variant="outline" size="sm" className="mt-5" onClick={onNavigate}>
          Kataloğa git
        </ButtonLink>
      </div>
    );
  }

  /* Kategoriye göre grupla (fiş gibi) */
  const groups = new Map<string, typeof items>();
  for (const it of items) {
    const g = groups.get(it.category) ?? [];
    g.push(it);
    groups.set(it.category, g);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        {[...groups.entries()].map(([cat, list]) => (
          <section key={cat}>
            <p className="sticky top-0 z-[1] border-y border-ink-200 bg-paper-100 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ink-500">{categoryMap[cat]?.name ?? cat}</p>
            <ul className="divide-y divide-ink-100">
              {list.map((it) => {
                const key = `${it.slug}:${it.variantId}`;
                return (
                  <li key={key} className={`grid gap-x-3 px-4 py-3 ${wide ? "grid-cols-[1fr_auto_auto_auto] items-center" : "grid-cols-[1fr_auto]"} ${lastKey === key ? "row-pop" : ""}`}>
                    <div className="min-w-0">
                      <Link href={`/urun/${it.slug}`} onClick={onNavigate} className="block truncate text-[0.92rem] font-semibold text-navy-900 hover:text-orange-700">
                        {it.name}
                      </Link>
                      <p className="truncate text-xs text-ink-500">
                        {it.variantLabel} · {it.brand} · {formatPrice(it.price)}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 ${wide ? "" : "col-start-2 row-span-2"}`}>
                      <span className="inline-flex items-center rounded-md border border-ink-200 bg-white">
                        <button aria-label="Azalt" onClick={() => setQty(it.slug, it.variantId, it.qty - 1)} className="grid size-7 place-items-center hover:bg-paper-100">
                          <Minus className="size-3" />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold tabular-nums">{it.qty}</span>
                        <button aria-label="Artır" onClick={() => setQty(it.slug, it.variantId, it.qty + 1)} className="grid size-7 place-items-center hover:bg-paper-100">
                          <Plus className="size-3" />
                        </button>
                      </span>
                    </div>
                    <p className={`font-display text-lg font-semibold tabular-nums text-navy-900 ${wide ? "w-28 text-right" : "col-start-1 mt-1"}`}>{formatPrice(it.price * it.qty)}</p>
                    {wide && (
                      <button onClick={() => remove(it.slug, it.variantId)} aria-label="Kaldır" className="grid size-8 place-items-center rounded-md text-ink-400 hover:bg-paper-100 hover:text-red-600">
                        <X className="size-4" />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <div className="border-t border-ink-200 bg-white p-4">
        <div className="flex items-center gap-2 text-xs text-ink-600">
          <Truck className="size-4 shrink-0 text-orange-600" />
          {remaining > 0 ? (
            <span>
              Ücretsiz kargoya <b className="text-navy-900">{formatPrice(remaining)}</b> kaldı
            </span>
          ) : (
            <span className="font-semibold text-navy-900">Kargo ücretsiz</span>
          )}
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink-100">
          <div className="h-full bg-copper transition-all duration-500" style={{ width: `${Math.min(100, (subtotal / threshold) * 100)}%` }} />
        </div>
        <dl className="mt-4 space-y-1 text-sm">
          <div className="flex justify-between text-ink-600">
            <dt>{count} kalem</dt>
            <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-ink-600">
            <dt>Kargo</dt>
            <dd className="tabular-nums">{shipping === 0 ? "Ücretsiz" : formatPrice(shipping)}</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-ink-200 pt-2">
            <dt className="font-semibold text-navy-900">Toplam</dt>
            <dd className="font-display text-2xl font-semibold tabular-nums text-navy-900">{formatPrice(subtotal + shipping)}</dd>
          </div>
        </dl>
        <ButtonLink href="/odeme" variant="accent" className="mt-4 w-full" onClick={onNavigate}>
          Siparişi tamamla <ArrowRight className="size-4" />
        </ButtonLink>
        <div className="mt-2 flex items-center justify-between text-xs">
          {wide ? (
            <Link href="/urunler" onClick={onNavigate} className="font-semibold text-navy-900 underline-offset-2 hover:underline">
              Kataloğa dön
            </Link>
          ) : (
            <Link href="/sepet" onClick={onNavigate} className="font-semibold text-navy-900 underline-offset-2 hover:underline">
              Listeyi düzenle
            </Link>
          )}
          <button onClick={clear} className="inline-flex items-center gap-1 text-ink-400 hover:text-red-600">
            <Trash2 className="size-3" /> Temizle
          </button>
        </div>
      </div>
    </div>
  );
}
