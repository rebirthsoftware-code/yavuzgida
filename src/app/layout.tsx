import type { Metadata, Viewport } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { SearchOverlay } from "@/components/search/SearchOverlay";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin", "latin-ext"], display: "swap" });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin", "latin-ext"], display: "swap" });

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
  themeColor: "#0b3b2c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${outfit.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <a href="#icerik" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lift">
            İçeriğe geç
          </a>
          <Header />
          <main id="icerik" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <SearchOverlay />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
