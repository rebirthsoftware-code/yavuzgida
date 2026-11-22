import Link from "next/link";
import { Phone, Heart, PackageSearch, Building2, HelpCircle, Search } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { SearchBox } from "./SearchBox";
import { MiniCart } from "./MiniCart";
import { CategoryBar } from "./CategoryBar";
import { MobileSearchBar } from "./MobileBits";
import { ScrollCompact } from "./ScrollCompact";
import { Store } from "lucide-react";
import { categoryCounts } from "@/lib/catalog";
import { ConfigLink } from "@/components/config/ConfigValue";

export async function Header() {
  const counts = await categoryCounts();
  return (
    <header className="m-header sticky top-0 z-40 bg-coal-900 shadow-[0_1px_0_rgb(255_255_255/0.06)]">
      <ScrollCompact />
      {/* Üst bağlantılar */}
      <div className="hidden border-b border-white/5 bg-coal-950 text-xs text-ink-300 md:block">
        <div className="mx-auto flex h-8 max-w-[1320px] items-center justify-between px-4">
          <nav className="flex items-center gap-5">
            <Link href="/kurumsal" className="flex items-center gap-1.5 hover:text-gold-400">
              <Building2 className="size-3.5" /> Kurumsal Satış
            </Link>
            <Link href="/siparis-takip" className="flex items-center gap-1.5 hover:text-gold-400">
              <PackageSearch className="size-3.5" /> Sipariş Takip
            </Link>
            <Link href="/sss" className="flex items-center gap-1.5 hover:text-gold-400">
              <HelpCircle className="size-3.5" /> Yardım & Destek
            </Link>
            <Link href="/panel" className="flex items-center gap-1.5 rounded-full border border-gold-500/50 bg-gold-500/10 px-2.5 py-0.5 font-semibold text-gold-400 hover:bg-gold-500/20">
              <Store className="size-3.5" /> Anlaşmalı Müşteri Paneli
            </Link>
          </nav>
          <div className="flex items-center gap-5">
            <ConfigLink kind="announcement" className="hidden font-semibold text-gold-400 hover:underline lg:inline" />
            <span className="flex items-center gap-1.5 font-semibold text-white">
              <Phone className="size-3.5 text-gold-400" /> <ConfigLink kind="tel" />
            </span>
          </div>
        </div>
      </div>

      {/* Ana satır */}
      <div className="m-collapse mx-auto flex h-16 max-w-[1320px] items-center gap-3 px-3 sm:px-4 md:h-[84px] lg:gap-8">
        <div className="md:hidden">
          <Logo size="sm" />
        </div>
        <div className="hidden md:block">
          <Logo />
        </div>
        <SearchBox className="hidden flex-1 md:block lg:max-w-2xl" />
        <div className="ml-auto flex items-center gap-1">
          <Link href="/panel" className="mr-1 flex h-9 items-center gap-1.5 rounded-full border border-gold-500/50 bg-gold-500/10 px-2.5 text-xs font-semibold text-gold-400 md:hidden">
            <Store className="size-3.5" /> Panel
          </Link>
          <Link href="/siparis-takip" className="hidden h-11 items-center gap-2 rounded-lg border border-transparent px-3 text-sm font-semibold text-white hover:border-white/15 lg:flex">
            <PackageSearch className="size-5 text-gold-400" /> Sipariş Takip
          </Link>
          <Link href="/urunler?etiket=cok-satan" className="hidden h-11 items-center gap-2 rounded-lg border border-transparent px-3 text-sm font-semibold text-white hover:border-white/15 lg:flex">
            <Heart className="size-5 text-gold-400" /> Favorilerim
          </Link>
          <MiniCart />
        </div>
      </div>

      <div className="m-collapse"><MobileSearchBar /></div>
      <CategoryBar counts={counts} />
    </header>
  );
}

export { Search };
