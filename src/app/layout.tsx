import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Figtree } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { categories } from "@/lib/categories";
import { categoryCounts } from "@/lib/catalog";
import { CartProvider } from "@/components/cart/CartProvider";
import { SideRail } from "@/components/shell/SideRail";
import { TopBar } from "@/components/shell/TopBar";
import { MobileTabBar } from "@/components/shell/MobileTabBar";
import { CategorySheet } from "@/components/shell/CategorySheet";
import { OrderDock } from "@/components/order/OrderDock";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { SearchOverlay } from "@/components/search/SearchOverlay";

const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin", "latin-ext"], weight: ["500", "600", "700"], style: ["normal", "italic"], display: "swap" });
const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin", "latin-ext"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Toptan Gıda — Bakliyat, Baharat, Kuruyemiş, Yağ, Konserve`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: { type: "website", locale: site.locale, siteName: site.name, title: `${site.name} — ${site.tagline}`, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#0c2138",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const counts = categoryCounts();
  return (
    <html lang="tr" className={`${cormorant.variable} ${figtree.variable} h-full antialiased`}>
      <body className="min-h-full">
        <CartProvider>
          <a href="#icerik" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-float">
            İçeriğe geç
          </a>
          {/* Üç sütun: sol ray · içerik · sipariş paneli */}
          <div className="grid min-h-screen lg:grid-cols-[248px_1fr] xl:grid-cols-[232px_1fr_312px] 2xl:grid-cols-[256px_1fr_352px] 3xl:grid-cols-[280px_1fr_380px]">
            <SideRail />
            <div className="flex min-w-0 flex-col pb-16 lg:pb-0">
              <TopBar />
              <main id="icerik" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <OrderDock />
          </div>
          <MobileTabBar />
          <CategorySheet categories={categories} counts={counts} />
          <SearchOverlay />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
