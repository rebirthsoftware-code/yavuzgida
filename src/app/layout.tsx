import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { categories } from "@/lib/categories";
import { categoryCounts } from "@/lib/catalog";
import { CartProvider } from "@/components/cart/CartProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileBits";
import { CategorySheet } from "@/components/layout/CategorySheet";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { PackSprite } from "@/components/product/PackSprite";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Toptan Gıda — Bakliyat, Baharat, Kuruyemiş, Yağ, Konserve`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: { type: "website", locale: site.locale, siteName: site.name, title: `${site.name} — ${site.tagline}`, description: site.description, images: [{ url: "/brand/logo-dark.jpg", width: 1080, height: 807 }] },
};

export const viewport: Viewport = {
  themeColor: "#141414",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const counts = categoryCounts();
  return (
    <html lang="tr" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <PackSprite />
        <CartProvider>
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
        </CartProvider>
      </body>
    </html>
  );
}
