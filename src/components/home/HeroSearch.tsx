"use client";

import { Search } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

export function HeroSearch() {
  const { setSearchOpen } = useCart();
  return (
    <button
      onClick={() => setSearchOpen(true)}
      className="group flex h-14 w-full items-center gap-3 rounded-full border border-white bg-white pl-6 pr-2 text-left text-ink-500 shadow-pop transition hover:shadow-glow"
    >
      <Search className="size-5 text-ink-400" />
      <span className="flex-1 truncate text-base">600+ ürün arasında ara…</span>
      <span className="bg-copper grid h-10 place-items-center rounded-full px-5 text-sm font-semibold text-white">Ara</span>
    </button>
  );
}
