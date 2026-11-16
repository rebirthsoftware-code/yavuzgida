"use client";

import Link from "next/link";
import { Search, ClipboardList, Truck } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { Logo } from "@/components/ui/Logo";
import { formatCompact } from "@/lib/format";
import { site } from "@/lib/site";

/** Üst çubuk: mobilde logo + arama; masaüstünde arama + kargo bilgisi + liste özeti (xl altı). */
export function TopBar() {
  const { setSearchOpen, count, subtotal, ready, setSheetOpen } = useCart();
  return (
    <div className="sticky top-0 z-30 border-b border-ink-200 bg-paper-50/90 backdrop-blur-md">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="lg:hidden">
          <Logo size="sm" />
        </div>
        <button
          onClick={() => setSearchOpen(true)}
          className="group ml-auto flex h-10 w-full max-w-xl items-center gap-3 rounded-lg border border-ink-200 bg-white px-3.5 text-left text-sm text-ink-500 transition hover:border-navy-900 lg:ml-0"
        >
          <Search className="size-4 text-ink-400 group-hover:text-navy-900" />
          <span className="flex-1 truncate">Ürün, marka ara…</span>
          <kbd className="hidden rounded border border-ink-200 px-1.5 py-0.5 text-[0.65rem] font-semibold text-ink-400 md:block">Ctrl K</kbd>
        </button>
        <p className="ml-auto hidden items-center gap-2 whitespace-nowrap text-xs text-ink-500 xl:flex">
          <Truck className="size-4 text-orange-600" />
          <b className="text-navy-900">{formatCompact(site.commerce.freeShippingThreshold)}</b> üzeri kargo bedava
        </p>
        <nav className="ml-auto hidden items-center gap-4 text-sm text-ink-700 lg:flex xl:ml-0">
          <Link href="/hakkimizda" className="hover:text-navy-900">Hakkımızda</Link>
          <Link href="/iletisim" className="hover:text-navy-900">İletişim</Link>
        </nav>
        {/* xl altı: sipariş listesi özeti */}
        <button onClick={() => setSheetOpen(true)} className="hidden h-10 items-center gap-2 rounded-lg bg-navy-900 px-3 text-sm font-semibold text-white lg:flex xl:hidden">
          <ClipboardList className="size-4" />
          {ready && count > 0 ? `${count} kalem · ${formatCompact(subtotal)}` : "Sipariş listesi"}
        </button>
      </div>
    </div>
  );
}
