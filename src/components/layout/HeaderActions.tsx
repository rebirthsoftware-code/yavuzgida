"use client";

import { Search, ShoppingBag, Menu } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { formatCompact } from "@/lib/format";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const { setSearchOpen } = useCart();
  if (compact) {
    return (
      <button onClick={() => setSearchOpen(true)} aria-label="Ara" className="grid size-11 place-items-center rounded-full text-navy-900 hover:bg-sky-50">
        <Search className="size-5" />
      </button>
    );
  }
  return (
    <button
      onClick={() => setSearchOpen(true)}
      className="group flex h-12 w-full items-center gap-3 rounded-full border border-ink-200 bg-paper-50 pl-5 pr-1.5 text-left text-ink-500 transition hover:border-orange-400 hover:bg-white"
    >
      <Search className="size-[18px] text-ink-400 group-hover:text-orange-600" />
      <span className="flex-1 truncate text-[0.95rem]">Ürün, marka veya kategori ara… <span className="hidden text-ink-300 lg:inline">(örn. baldo pirinç, pul biber)</span></span>
      <kbd className="hidden rounded-md border border-ink-200 bg-white px-1.5 py-0.5 text-[0.65rem] font-semibold text-ink-400 md:block">Ctrl K</kbd>
      <span className="bg-copper grid h-9 w-11 place-items-center rounded-full text-white shadow-glow">
        <Search className="size-4" />
      </span>
    </button>
  );
}

export function CartButton() {
  const { count, subtotal, setOpen, ready } = useCart();
  return (
    <button onClick={() => setOpen(true)} aria-label={`Sepet, ${count} ürün`} className="relative flex h-11 items-center gap-2.5 rounded-full bg-navy-900 pl-3.5 pr-4 text-white transition hover:bg-navy-800">
      <span className="relative">
        <ShoppingBag className="size-5" />
        {ready && count > 0 && (
          <span className="absolute -right-2 -top-2 grid min-w-[1.1rem] place-items-center rounded-full bg-orange-500 px-1 text-[0.65rem] font-bold leading-4 text-white">{count}</span>
        )}
      </span>
      <span className="hidden text-left leading-none sm:block">
        <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-sky-300">Sepet</span>
        <span className="block text-sm font-bold tabular-nums">{ready && count > 0 ? formatCompact(subtotal) : "0 ₺"}</span>
      </span>
    </button>
  );
}

export function MenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label="Menü" className="grid size-11 place-items-center rounded-full text-navy-900 hover:bg-sky-50 lg:hidden">
      <Menu className="size-6" />
    </button>
  );
}
