"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, User, Search } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

export function MobileSearchButton() {
  const { setSearchOpen } = useCart();
  return (
    <button onClick={() => setSearchOpen(true)} aria-label="Ara" className="grid size-11 place-items-center rounded-lg text-ink-800 hover:bg-paper-100 md:hidden">
      <Search className="size-5" />
    </button>
  );
}

/** Mobil alt gezinme (uygulama gibi). */
export function MobileNav() {
  const { count, ready, setCatsOpen, catsOpen } = useCart();
  const pathname = usePathname();
  const item = "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[0.65rem] font-semibold";
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden" aria-label="Alt menü">
      <div className="flex">
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
          Sepetim
        </Link>
        <Link href="/siparis-takip" onClick={() => setCatsOpen(false)} className={`${item} text-ink-500`}>
          <User className="size-5" /> Hesabım
        </Link>
      </div>
    </nav>
  );
}
