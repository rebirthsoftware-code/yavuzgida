import { loadContent } from "@/server/content-cache";
import type { SiteConfig } from "./content";

/** Yönetim panelinden düzenlenen site ayarları (sunucu bileşenleri için). */
export async function getSiteConfig(): Promise<SiteConfig> {
  return (await loadContent()).config;
}
