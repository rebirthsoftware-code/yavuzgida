"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Store, ArrowLeft } from "lucide-react";
import { MobileSearchBar } from "@/components/layout/MobileBits";
import { ScrollCompact } from "@/components/layout/ScrollCompact";
import { useCart, useHydrated } from "@/components/cart/CartProvider";
import { Logo } from "@/components/ui/Logo";
import { SearchBox } from "@/components/layout/SearchBox";
import { useCategories } from "@/components/config/ConfigProvider";

/** Anlaşmalı müşteri paneli başlığı: fiyatsız katalog, sipariş listesi, mağazaya dönüş. */
export function PanelHeader() {
  const categories = useCategories();
  const { count, ready: storeReady } = useCart();
  const ready = useHydrated() && storeReady;
  const pathname = usePathname();
  return (
    <header className="m-header sticky top-0 z-40 bg-coal-900 text-white shadow-[0_1px_0_rgb(255_255_255/0.06)]">
      <ScrollCompact />
      <div className="m-collapse border-b border-white/5 bg-coal-950">
        <div className="mx-auto flex h-9 max-w-[1320px] items-center justify-between px-4 text-xs">
          <p className="flex items-center gap-2 font-semibold text-gold-400">
            <Store className="size-3.5" /> Anlaşmalı Müşteri Sipariş Paneli
            <span className="hidden text-ink-400 sm:inline">· fiyatlar gösterilmez, anlaşmalı tarifeniz geçerlidir</span>
          </p>
          <Link href="/" className="flex items-center gap-1.5 text-ink-300 hover:text-white">
            <ArrowLeft className="size-3.5" /> Mağazaya dön
          </Link>
        </div>
      </div>
      <div className="m-collapse mx-auto flex h-16 max-w-[1320px] items-center gap-3 px-3 sm:px-4 md:h-[76px] lg:gap-8">
        <div className="md:hidden">
          <Logo size="sm" />
        </div>
        <div className="hidden md:block">
          <Logo />
        </div>
        <SearchBox className="hidden flex-1 md:block lg:max-w-2xl" />
        <div className="ml-auto flex items-center gap-1">
          <Link href="/panel/sepet" className={`flex h-11 items-center gap-2 rounded-lg border px-3 text-sm font-semibold transition ${pathname === "/panel/sepet" ? "border-gold-500 bg-white/10 text-gold-400" : "border-transparent text-white hover:border-white/15"}`}>
            <span className="relative">
              <ClipboardList className="size-5 text-gold-400" />
              {ready && count > 0 && <span className="absolute -right-2 -top-2 grid min-w-[1.1rem] place-items-center rounded-full bg-orange-500 px-1 text-[0.65rem] font-bold leading-[1.1rem] text-white">{count}</span>}
            </span>
            <span className="hidden sm:block">Sipariş Listem</span>
          </Link>
        </div>
      </div>
      <div className="m-collapse"><MobileSearchBar placeholder="Listeye eklemek için ürün ara" /></div>
      <nav className="border-t border-white/5 bg-white">
        <div className="mx-auto flex max-w-[1320px] items-center gap-0 overflow-x-auto px-2 no-scrollbar sm:px-4">
          <Link href="/panel/urunler" className={`shrink-0 whitespace-nowrap px-3 py-2.5 text-[0.82rem] font-bold ${pathname === "/panel/urunler" ? "text-orange-600" : "text-ink-800 hover:text-orange-600"}`}>
            Tüm Ürünler
          </Link>
          {categories.map((c) => {
            const on = pathname.startsWith(`/panel/kategori/${c.slug}`);
            return (
              <Link key={c.slug} href={`/panel/kategori/${c.slug}`} className={`shrink-0 whitespace-nowrap px-2.5 py-2.5 text-[0.82rem] font-medium transition ${on ? "text-orange-600 shadow-[inset_0_-2px_0_#f27a1a]" : "text-ink-700 hover:text-orange-600"}`}>
                {c.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
