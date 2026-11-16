"use client";

import { Search, ShoppingBasket, Menu } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { formatCompact } from "@/lib/format";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const { setSearchOpen } = useCart();
  if (compact) {
    return (
      <button onClick={() => setSearchOpen(true)} aria-label="Ara" className="grid size-11 place-items-center rounded-xl text-white hover:bg-white/10">
        <Search className="size-5" />
      </button>
    );
  }
  return (
    <button
      onClick={() => setSearchOpen(true)}
      className="group flex h-12 w-full items-center gap-3 rounded-xl bg-white pl-4 pr-1.5 text-left text-ink-500 shadow-[inset_0_0_0_1px_rgb(0_0_0/0.06)] transition hover:shadow-[inset_0_0_0_2px_#f2762e]"
    >
      <Search className="size-5 text-ink-400 group-hover:text-tangerine-600" />
      <span className="flex-1 truncate text-[0.95rem]">Ürün, marka veya kategori ara… <span className="hidden text-ink-400 lg:inline">(örn. baldo pirinç, pul biber)</span></span>
      <kbd className="hidden rounded-md border border-ink-200 px-1.5 py-0.5 text-[0.65rem] font-semibold text-ink-400 md:block">Ctrl K</kbd>
      <span className="grid h-9 w-11 place-items-center rounded-lg bg-green-800 text-white group-hover:bg-tangerine-500">
        <Search className="size-4" />
      </span>
    </button>
  );
}

export function CartButton() {
  const { count, subtotal, setOpen, ready } = useCart();
  return (
    <button onClick={() => setOpen(true)} aria-label={`Sepet, ${count} ürün`} className="relative flex h-11 items-center gap-2.5 rounded-xl bg-white/10 px-3 text-white transition hover:bg-white/15">
      <span className="relative">
        <ShoppingBasket className="size-5" />
        {ready && count > 0 && (
          <span className="absolute -right-2 -top-2 grid min-w-[1.1rem] place-items-center rounded-full bg-tangerine-500 px-1 text-[0.65rem] font-bold leading-4 text-white">{count}</span>
        )}
      </span>
      <span className="hidden text-left leading-none sm:block">
        <span className="block text-[0.62rem] font-semibold uppercase tracking-wider text-green-200">Sepet</span>
        <span className="block text-sm font-bold tabular-nums">{ready && count > 0 ? formatCompact(subtotal) : "0 ₺"}</span>
      </span>
    </button>
  );
}

export function MenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label="Menü" className="grid size-11 place-items-center rounded-xl text-white hover:bg-white/10 lg:hidden">
      <Menu className="size-6" />
    </button>
  );
}
