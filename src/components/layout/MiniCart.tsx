"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/format";
import { PackArt } from "@/components/product/PackArt";
import { ButtonLink } from "@/components/ui/Button";

/** Başlıktaki "Sepetim" düğmesi + üzerine gelince açılan mini sepet. */
export function MiniCart() {
  const { items, count, subtotal, ready, remove, lastKey } = useCart();
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    timer.current = setTimeout(() => setOpen(false), 180);
  };

  // Ürün eklenince kısa süre aç (lastKey değişimini render sırasında yakala)
  const [seenKey, setSeenKey] = useState<string | null>(null);
  if (lastKey && lastKey !== seenKey) {
    setSeenKey(lastKey);
    setOpen(true);
  }
  useEffect(() => {
    if (!lastKey) return;
    const t = setTimeout(() => setOpen(false), 2200);
    return () => clearTimeout(t);
  }, [lastKey]);

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      <Link href="/sepet" className={`flex h-11 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition ${open ? "border-orange-500 bg-orange-50 text-orange-600" : "border-transparent text-ink-800 hover:border-ink-200"}`}>
        <span className="relative">
          <ShoppingCart className="size-5" />
          {ready && count > 0 && <span className="absolute -right-2 -top-2 grid min-w-[1.1rem] place-items-center rounded-full bg-orange-500 px-1 text-[0.65rem] font-bold leading-[1.1rem] text-white">{count}</span>}
        </span>
        <span className="hidden lg:block">Sepetim</span>
      </Link>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-[22rem] overflow-hidden rounded-lg border border-ink-200 bg-white shadow-menu animate-slide-down">
          <div className="flex items-center justify-between border-b border-ink-100 px-4 py-2.5 text-sm">
            <span className="font-bold text-ink-900">Sepetim ({count} Ürün)</span>
            <span className="text-ink-500">Toplam {formatPrice(subtotal)}</span>
          </div>
          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-ink-500">Sepetinizde ürün bulunmamaktadır.</p>
          ) : (
            <ul className="max-h-72 divide-y divide-ink-100 overflow-y-auto">
              {items.slice(0, 6).map((it) => (
                <li key={`${it.slug}-${it.variantId}`} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="grid size-12 shrink-0 place-items-center rounded-md bg-paper-100">
                    <PackArt art={it.art} hue={it.hue} name={it.name} brand={it.brand} className="h-10" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-semibold text-ink-900">
                      {it.brand} {it.name}
                    </span>
                    <span className="block text-[0.7rem] text-ink-500">
                      {it.variantLabel} · Adet: {it.qty}
                    </span>
                    <span className="block text-sm font-bold text-orange-600">{formatPrice(it.price * it.qty)}</span>
                  </span>
                  <button onClick={() => remove(it.slug, it.variantId)} aria-label="Kaldır" className="grid size-8 place-items-center rounded-md text-ink-400 hover:bg-paper-100 hover:text-red-600">
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="grid grid-cols-2 gap-2 border-t border-ink-100 p-3">
            <ButtonLink href="/sepet" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Sepete Git
            </ButtonLink>
            <ButtonLink href="/odeme" size="sm" onClick={() => setOpen(false)}>
              Siparişi Tamamla
            </ButtonLink>
          </div>
        </div>
      )}
    </div>
  );
}
