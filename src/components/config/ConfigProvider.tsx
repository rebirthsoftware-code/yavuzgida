"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
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

export function useSiteConfig(): SiteConfig {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSiteConfig, ConfigProvider içinde kullanılmalı");
  return v;
}
