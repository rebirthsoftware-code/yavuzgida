"use client";

import { Search } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

export function HeroSearch() {
  const { setSearchOpen } = useCart();
  return (
    <button
      onClick={() => setSearchOpen(true)}
      className="group flex h-14 w-full items-center gap-3 rounded-2xl bg-white pl-5 pr-2 text-left text-ink-500 shadow-pop transition hover:shadow-[0_24px_60px_-24px_rgb(242_118_46/0.6)]"
    >
      <Search className="size-5 text-ink-400" />
      <span className="flex-1 truncate text-base">600+ ürün arasında ara…</span>
      <span className="grid h-10 place-items-center rounded-xl bg-tangerine-500 px-4 text-sm font-semibold text-white group-hover:bg-tangerine-600">Ara</span>
    </button>
  );
}
