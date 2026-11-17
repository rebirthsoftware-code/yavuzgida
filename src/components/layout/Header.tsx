import Link from "next/link";
import { Phone, User, Heart, PackageSearch, Building2, HelpCircle, Search } from "lucide-react";
import { site } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";
import { SearchBox } from "./SearchBox";
import { MiniCart } from "./MiniCart";
import { CategoryBar } from "./CategoryBar";
import { MobileSearchButton } from "./MobileBits";
import { categoryCounts } from "@/lib/catalog";

export function Header() {
  const counts = categoryCounts();
  return (
    <header className="sticky top-0 z-40 bg-white shadow-card">
      {/* Üst bağlantılar */}
      <div className="hidden border-b border-ink-100 bg-paper-50 text-xs text-ink-600 md:block">
        <div className="mx-auto flex h-8 max-w-[1320px] items-center justify-between px-4">
          <nav className="flex items-center gap-5">
            <Link href="/kurumsal" className="flex items-center gap-1.5 hover:text-orange-600">
              <Building2 className="size-3.5" /> Kurumsal Satış
            </Link>
            <Link href="/siparis-takip" className="flex items-center gap-1.5 hover:text-orange-600">
              <PackageSearch className="size-3.5" /> Sipariş Takip
            </Link>
            <Link href="/sss" className="flex items-center gap-1.5 hover:text-orange-600">
              <HelpCircle className="size-3.5" /> Yardım & Destek
            </Link>
          </nav>
          <div className="flex items-center gap-5">
            <span className="font-semibold text-green-600">2.500 ₺ üzeri kargo bedava</span>
            <a href={site.contact.phoneHref} className="flex items-center gap-1.5 font-semibold text-ink-800">
              <Phone className="size-3.5 text-orange-500" /> {site.contact.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Ana satır */}
      <div className="mx-auto flex h-16 max-w-[1320px] items-center gap-3 px-3 sm:px-4 lg:gap-8">
        <Logo />
        <SearchBox className="hidden flex-1 md:block lg:max-w-2xl" />
        <div className="ml-auto flex items-center gap-1">
          <MobileSearchButton />
          <button className="hidden h-11 items-center gap-2 rounded-lg border border-transparent px-3 text-sm font-semibold text-ink-800 hover:border-ink-200 lg:flex">
            <User className="size-5" />
            <span className="text-left leading-tight">
              Giriş Yap
              <span className="block text-[0.65rem] font-normal text-ink-500">veya üye ol</span>
            </span>
          </button>
          <Link href="/urunler?etiket=cok-satan" className="hidden h-11 items-center gap-2 rounded-lg border border-transparent px-3 text-sm font-semibold text-ink-800 hover:border-ink-200 lg:flex">
            <Heart className="size-5" /> Favorilerim
          </Link>
          <MiniCart />
        </div>
      </div>

      <CategoryBar counts={counts} />
    </header>
  );
}

export { Search };
