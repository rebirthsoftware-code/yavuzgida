import Link from "next/link";
import { Phone, Truck, Building2, PackageSearch } from "lucide-react";
import { site } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";
import { SearchBar, CartButton } from "./HeaderActions";
import { CategoryNav } from "./CategoryNav";
import { MobileMenu } from "./MobileMenu";
import { categoryCounts } from "@/lib/catalog";
import { formatCompact } from "@/lib/format";

export function Header() {
  const counts = categoryCounts();
  return (
    <header className="sticky top-0 z-40 bg-green-900 text-white shadow-[0_2px_0_rgb(0_0_0/0.08)]">
      {/* Üst bilgi şeridi */}
      <div className="hidden border-b border-white/10 text-xs md:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 sm:px-6">
          <p className="flex items-center gap-2 text-green-100">
            <Truck className="size-3.5 text-tangerine-400" />
            <b className="text-white">{formatCompact(site.commerce.freeShippingThreshold)}</b> ve üzeri siparişlerde kargo bedava · 81 ile teslimat
          </p>
          <nav className="flex items-center gap-5 text-green-100">
            <Link href="/kurumsal" className="flex items-center gap-1.5 hover:text-white">
              <Building2 className="size-3.5" /> Kurumsal & Toptan
            </Link>
            <Link href="/siparis-takip" className="flex items-center gap-1.5 hover:text-white">
              <PackageSearch className="size-3.5" /> Sipariş takip
            </Link>
            <a href={site.contact.phoneHref} className="flex items-center gap-1.5 font-semibold text-white">
              <Phone className="size-3.5 text-tangerine-400" /> {site.contact.phone}
            </a>
          </nav>
        </div>
      </div>

      {/* Ana satır */}
      <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-3 px-3 sm:gap-5 sm:px-6">
        <MobileMenu />
        <Logo tone="light" className="shrink-0" />
        <div className="hidden flex-1 md:block">
          <SearchBar />
        </div>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <div className="md:hidden">
            <SearchBar compact />
          </div>
          <CartButton />
        </div>
      </div>
      <div className="px-3 pb-3 md:hidden">
        <SearchBar />
      </div>

      <CategoryNav counts={counts} />
    </header>
  );
}
