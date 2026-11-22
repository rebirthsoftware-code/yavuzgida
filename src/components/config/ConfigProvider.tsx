"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import type { Category } from "@/lib/types";
import { effectiveCategories, t } from "@/lib/content";
import type { SiteConfig } from "@/lib/content";
import { DEMO_ADMIN } from "@/lib/api";
import { readDemoContent, subscribeDemoContent } from "@/lib/demo-content";

const Ctx = createContext<SiteConfig | null>(null);

/** Sunucudan gelen site ayarlarını istemci bileşenlerine taşır; demoda tarayıcıdaki düzenlemeleri üstüne bindirir. */
export function ConfigProvider({ config, children }: { config: SiteConfig; children: ReactNode }) {
  const demo = useSyncExternalStore(
    subscribeDemoContent,
    () => (DEMO_ADMIN ? readDemoContent().config : null),
    () => null,
  );
  return <Ctx.Provider value={demo ?? config}>{children}</Ctx.Provider>;
}

/** Yayınlanan kategori listesi (yönetim düzenlemeleri uygulanmış). */
export function useCategories(): Category[] {
  const config = useSiteConfig();
  return useMemo(() => effectiveCategories(config), [config]);
}

export function useCategoryMap(): Record<string, Category> {
  const cats = useCategories();
  return useMemo(() => Object.fromEntries(cats.map((c) => [c.slug, c])), [cats]);
}

export function useText(key: string): string {
  return t(useSiteConfig(), key);
}

export function useSiteConfig(): SiteConfig {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSiteConfig, ConfigProvider içinde kullanılmalı");
  return v;
}
