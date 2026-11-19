import type { Metadata } from "next";
import { PanelHeader } from "@/components/panel/PanelHeader";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: "Anlaşmalı Müşteri Paneli", template: `%s | Panel | ${site.name}` },
  robots: { index: false, follow: false },
};

/** Anlaşmalı müşteri paneli kabuğu: fiyatsız katalog, sipariş listesi, WhatsApp/PDF fiş. */
export default function PanelLayout({ children }: LayoutProps<"/panel">) {
  return (
    <>
      <PanelHeader />
      <main className="flex-1">{children}</main>
      <footer className="mt-16 border-t border-ink-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-ink-500">
          <p>
            {site.name} · Anlaşmalı müşteri paneli · {site.contact.phone}
          </p>
          <p>Fiyatlar gösterilmez; anlaşmalı tarifeniz geçerlidir.</p>
        </div>
      </footer>
      <SearchOverlay />
      <WhatsAppButton />
    </>
  );
}
