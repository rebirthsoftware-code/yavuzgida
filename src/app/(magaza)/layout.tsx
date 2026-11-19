import { categories } from "@/lib/categories";
import { categoryCounts } from "@/lib/catalog";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileBits";
import { CategorySheet } from "@/components/layout/CategorySheet";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

/** Mağaza (herkese açık e-ticaret) kabuğu. */
export default function ShopLayout({ children }: LayoutProps<"/">) {
  const counts = categoryCounts();
  return (
    <>
      <a href="#icerik" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-menu">
        İçeriğe geç
      </a>
      <Header />
      <main id="icerik" className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileNav />
      <CategorySheet categories={categories} counts={counts} />
      <SearchOverlay />
      <WhatsAppButton />
    </>
  );
}
