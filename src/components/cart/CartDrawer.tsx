"use client";

import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBasket, Truck } from "lucide-react";
import { useCart } from "./CartProvider";
import { ProductVisual } from "@/components/product/ProductVisual";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { useEffect } from "react";

export function CartDrawer() {
  const { items, open, setOpen, subtotal, setQty, remove, toast, count } = useCart();
  const threshold = site.commerce.freeShippingThreshold;
  const remaining = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, (subtotal / threshold) * 100);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  return (
    <>
      {/* Bildirim */}
      <div aria-live="polite" className={`pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4 transition-all duration-300 ${toast ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
        {toast && (
          <button onClick={() => setOpen(true)} className="pointer-events-auto flex items-center gap-3 rounded-full bg-ink-900 py-2.5 pl-4 pr-5 text-sm font-medium text-white shadow-pop">
            <ShoppingBasket className="size-4 text-tangerine-400" />
            {toast}
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs">Sepeti aç</span>
          </button>
        )}
      </div>

      <div className={`fixed inset-0 z-[80] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-green-950/50 backdrop-blur-[2px] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
        <aside
          role="dialog"
          aria-label="Sepet"
          className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-pop transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <header className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <h2 className="text-lg font-bold">
              Sepetim <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-900">{count} ürün</span>
            </h2>
            <button onClick={() => setOpen(false)} aria-label="Kapat" className="grid size-9 place-items-center rounded-lg hover:bg-ink-100">
              <X className="size-5" />
            </button>
          </header>

          <div className="border-b border-ink-100 bg-paper-50 px-5 py-3">
            <div className="flex items-center gap-2 text-xs font-medium text-ink-700">
              <Truck className="size-4 text-green-700" />
              {remaining > 0 ? (
                <span>
                  Ücretsiz kargo için <b className="text-green-800">{formatPrice(remaining)}</b> daha ekleyin
                </span>
              ) : (
                <span className="text-green-800">Kargonuz ücretsiz 🎉</span>
              )}
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100">
              <div className="h-full rounded-full bg-gradient-to-r from-green-600 to-tangerine-500 transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <span className="grid size-16 place-items-center rounded-2xl bg-paper-100">
                  <ShoppingBasket className="size-8 text-ink-400" />
                </span>
                <p className="mt-4 font-semibold">Sepetiniz boş</p>
                <p className="mt-1 text-sm text-ink-500">600’den fazla ürün sizi bekliyor.</p>
                <ButtonLink href="/urunler" onClick={() => setOpen(false)} className="mt-5">
                  Alışverişe başla
                </ButtonLink>
              </div>
            ) : (
              <ul className="divide-y divide-ink-100">
                {items.map((it) => (
                  <li key={`${it.slug}-${it.variantId}`} className="flex gap-3 py-4">
                    <Link href={`/urun/${it.slug}`} onClick={() => setOpen(false)} className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                      <ProductVisual name={it.name} category={it.category} hue={it.hue} image={it.image} sizes="80px" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink-400">{it.brand}</p>
                      <Link href={`/urun/${it.slug}`} onClick={() => setOpen(false)} className="line-clamp-2 text-sm font-semibold leading-snug hover:text-green-800">
                        {it.name}
                      </Link>
                      <p className="text-xs text-ink-500">{it.variantLabel}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-ink-200">
                          <button aria-label="Azalt" onClick={() => (it.qty <= 1 ? remove(it.slug, it.variantId) : setQty(it.slug, it.variantId, it.qty - 1))} className="grid size-8 place-items-center hover:bg-ink-100">
                            {it.qty <= 1 ? <Trash2 className="size-3.5" /> : <Minus className="size-3.5" />}
                          </button>
                          <span className="w-8 text-center text-sm font-semibold tabular-nums">{it.qty}</span>
                          <button aria-label="Artır" onClick={() => setQty(it.slug, it.variantId, it.qty + 1)} className="grid size-8 place-items-center hover:bg-ink-100">
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <span className="font-display font-bold tabular-nums">{formatPrice(it.price * it.qty)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <footer className="border-t border-ink-100 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">Ara toplam</span>
                <span className="font-display text-xl font-bold tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-ink-400">KDV dâhil · Kargo ödeme adımında hesaplanır</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <ButtonLink href="/sepet" variant="outline" onClick={() => setOpen(false)}>
                  Sepete git
                </ButtonLink>
                <ButtonLink href="/odeme" variant="accent" onClick={() => setOpen(false)}>
                  Ödemeye geç
                </ButtonLink>
              </div>
            </footer>
          )}
        </aside>
      </div>
    </>
  );
}
