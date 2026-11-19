"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, Store, Search } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

export function MobileSearchBar({ placeholder = "Ürün, marka veya kategori ara" }: { placeholder?: string }) {
  const { setSearchOpen } = useCart();
  return (
    <div className="px-3 pb-2.5 md:hidden">
      <button onClick={() => setSearchOpen(true)} className="flex h-10 w-full items-center gap-2 rounded-lg bg-white/10 px-3 text-left text-sm text-ink-300 ring-1 ring-white/10">
        <Search className="size-4 shrink-0 text-gold-400" />
        <span className="truncate">{placeholder}</span>
      </button>
    </div>
  );
}

export function MobileSearchButton() {
  const { setSearchOpen } = useCart();
  return (
    <button onClick={() => setSearchOpen(true)} aria-label="Ara" className="grid size-11 place-items-center rounded-lg text-white hover:bg-white/10 md:hidden">
      <Search className="size-5" />
    </button>
  );
}

/** Mobil alt gezinme (uygulama gibi). */
export function MobileNav() {
  const { count, ready, setCatsOpen, catsOpen, showPrices } = useCart();
  const pathname = usePathname();
  const item = "flex flex-1 flex-col items-center justify-center gap-0.5 text-[0.65rem] font-semibold";
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden" aria-label="Alt menü">
      <div className="flex h-14">
        <Link href="/" onClick={() => setCatsOpen(false)} className={`${item} ${pathname === "/" && !catsOpen ? "text-orange-600" : "text-ink-500"}`}>
          <Home className="size-5" /> Anasayfa
        </Link>
        <button onClick={() => setCatsOpen(!catsOpen)} className={`${item} ${catsOpen ? "text-orange-600" : "text-ink-500"}`}>
          <LayoutGrid className="size-5" /> Kategoriler
        </button>
        <Link href="/sepet" onClick={() => setCatsOpen(false)} className={`${item} ${pathname === "/sepet" ? "text-orange-600" : "text-ink-500"}`}>
          <span className="relative">
            <ShoppingCart className="size-5" />
            {ready && count > 0 && <span className="absolute -right-2.5 -top-1.5 grid min-w-4 place-items-center rounded-full bg-orange-500 px-1 text-[0.6rem] leading-4 text-white">{count}</span>}
          </span>
          {showPrices ? "Sepetim" : "Listem"}
        </Link>
        <Link href="/panel" onClick={() => setCatsOpen(false)} className={`${item} text-ink-500`}>
          <Store className="size-5" /> Panel
        </Link>
      </div>
    </nav>
  );
}
