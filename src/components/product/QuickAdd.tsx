"use client";

import { useState } from "react";
import { Plus, Minus, Check } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import type { CartItem } from "@/lib/cart";

/** Kartta hızlı ekleme: ilk tıklama ekler, sonra adet artır/azalt gösterir. */
export function QuickAdd({ item, disabled, compact }: { item: Omit<CartItem, "qty">; disabled?: boolean; compact?: boolean }) {
  const { items, add, setQty, remove } = useCart();
  const inCart = items.find((x) => x.slug === item.slug && x.variantId === item.variantId);
  const [flash, setFlash] = useState(false);

  const onAdd = () => {
    add({ ...item, qty: 1 });
    setFlash(true);
    setTimeout(() => setFlash(false), 900);
  };

  if (disabled) {
    return <span className="inline-flex h-10 items-center rounded-full bg-paper-100 px-3 text-xs font-semibold text-ink-400">Stokta yok</span>;
  }

  if (inCart) {
    return (
      <span className="inline-flex h-10 items-center rounded-full bg-navy-900 text-white shadow-[0_8px_20px_-10px_rgb(12_33_56/0.6)]">
        <button aria-label="Azalt" onClick={() => (inCart.qty <= 1 ? remove(item.slug, item.variantId) : setQty(item.slug, item.variantId, inCart.qty - 1))} className="grid size-10 place-items-center rounded-l-full hover:bg-navy-800">
          <Minus className="size-4" />
        </button>
        <span className="min-w-7 text-center text-sm font-bold tabular-nums">{inCart.qty}</span>
        <button aria-label="Artır" onClick={() => setQty(item.slug, item.variantId, inCart.qty + 1)} className="grid size-10 place-items-center rounded-r-full hover:bg-navy-800">
          <Plus className="size-4" />
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={onAdd}
      aria-label={`${item.name} sepete ekle`}
      className={`inline-flex h-10 items-center justify-center gap-1.5 rounded-full font-semibold text-white transition active:scale-95 ${
        flash ? "bg-navy-900" : "bg-copper shadow-glow hover:brightness-105"
      } ${compact ? "w-10" : "px-3.5 text-sm"}`}
    >
      {flash ? <Check className="size-4" /> : <Plus className="size-4" />}
      {!compact && !flash && <span>Ekle</span>}
    </button>
  );
}
