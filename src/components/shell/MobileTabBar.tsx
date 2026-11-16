"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Search, ClipboardList } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

/** Mobil alt sekme çubuğu (uygulama hissi). */
export function MobileTabBar() {
  const { count, ready, setSheetOpen, setSearchOpen, setCatsOpen, sheetOpen, catsOpen } = useCart();
  const pathname = usePathname();
  const item = "flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[0.65rem] font-semibold";
  const on = "text-orange-600";
  const off = "text-ink-500";
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden" aria-label="Alt menü">
      <div className="flex">
        <Link href="/" className={`${item} ${pathname === "/" && !sheetOpen && !catsOpen ? on : off}`} onClick={() => { setSheetOpen(false); setCatsOpen(false); }}>
          <Home className="size-5" /> Ana sayfa
        </Link>
        <button className={`${item} ${catsOpen ? on : off}`} onClick={() => { setSheetOpen(false); setCatsOpen(!catsOpen); }}>
          <LayoutGrid className="size-5" /> Kategoriler
        </button>
        <button className={`${item} ${off}`} onClick={() => setSearchOpen(true)}>
          <Search className="size-5" /> Ara
        </button>
        <button className={`${item} ${sheetOpen ? on : off}`} onClick={() => { setCatsOpen(false); setSheetOpen(!sheetOpen); }}>
          <span className="relative">
            <ClipboardList className="size-5" />
            {ready && count > 0 && <span className="absolute -right-2.5 -top-1.5 grid min-w-4 place-items-center rounded-full bg-orange-500 px-1 text-[0.6rem] leading-4 text-white">{count}</span>}
          </span>
          Liste
        </button>
      </div>
    </nav>
  );
}
