import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { PackSprite } from "@/components/product/PackSprite";
import { ConfigProvider } from "@/components/config/ConfigProvider";
import { getSiteConfig } from "@/lib/site-config";
import { t } from "@/lib/content";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"], display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  const tx = (k: string) => t(config, k);
  return {
    metadataBase: new URL(site.url),
    title: { default: tx("seo.title"), template: `%s | ${site.name}` },
    description: tx("seo.description"),
    openGraph: { type: "website", locale: site.locale, siteName: site.name, title: `${site.name} — ${tx("site.tagline")}`, description: tx("seo.description"), images: [{ url: "/brand/logo-dark.jpg", width: 1080, height: 807 }] },
  };
}

export const viewport: Viewport = {
  themeColor: "#141414",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const config = await getSiteConfig();
  return (
    <html lang="tr" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <PackSprite />
        <ConfigProvider config={config}>{children}</ConfigProvider>
      </body>
    </html>
  );
}
