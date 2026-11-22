import type { Metadata } from "next";
import { PanelHeader } from "@/components/panel/PanelHeader";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { PanelMobileNav } from "@/components/layout/MobileBits";
import { CategorySheet } from "@/components/layout/CategorySheet";
import { Suspense } from "react";
import { categoryCounts, getCategories } from "@/lib/catalog";
import { CartProvider } from "@/components/cart/CartProvider";
import { getSiteConfig } from "@/lib/site-config";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: "Anlaşmalı Müşteri Paneli", template: `%s | Panel | ${site.name}` },
  robots: { index: false, follow: false },
};

/** Anlaşmalı müşteri paneli kabuğu: fiyatsız katalog, sipariş listesi, WhatsApp/PDF fiş. */
export default async function PanelLayout({ children }: LayoutProps<"/panel">) {
  const [counts, cats, config] = await Promise.all([categoryCounts(), getCategories(), getSiteConfig()]);
  return (
    <CartProvider inPanel>
      <Suspense fallback={<div className="h-16 bg-coal-900" />}>
        <PanelHeader />
      </Suspense>
      <main className="flex-1">{children}</main>
      <footer className="mt-16 border-t border-ink-200 bg-white pb-16 md:pb-0 print:hidden">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-ink-500">
          <p>
            {site.name} · Anlaşmalı müşteri paneli · {config.contact.phone}
          </p>
          <p>Fiyatlar gösterilmez; anlaşmalı tarifeniz geçerlidir.</p>
        </div>
      </footer>
      <SearchOverlay />
      <CategorySheet categories={cats} counts={counts} />
      <Suspense fallback={null}>
        <PanelMobileNav />
      </Suspense>
      <WhatsAppButton />
    </CartProvider>
  );
}
