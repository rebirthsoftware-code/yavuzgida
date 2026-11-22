"use client";

/**
 * Demo (GitHub Pages) içerik deposu: yönetim panelindeki düzenlemeler tarayıcıda saklanır,
 * mağaza bileşenleri de aynı depodan okur. Gerçek sunucuda kullanılmaz.
 */
import { mergeConfig, type ContentState, type ProductPatch, type SiteConfig } from "./content";
import type { Product } from "./types";

const KEY = "yavuz-demo-content-v1";
const listeners = new Set<() => void>();
let cache: { raw: string; state: ContentState } | null = null;

type Stored = { config?: Partial<SiteConfig>; patches?: Record<string, ProductPatch>; customs?: Product[]; version?: number };

function readStored(): Stored {
  try {
    const raw = localStorage.getItem(KEY) ?? "";
    return raw ? (JSON.parse(raw) as Stored) : {};
  } catch {
    return {};
  }
}

export function readDemoContent(): ContentState {
  try {
    const raw = localStorage.getItem(KEY) ?? "";
    if (cache && cache.raw === raw) return cache.state;
    const st = raw ? (JSON.parse(raw) as Stored) : {};
    const state: ContentState = { config: mergeConfig(st.config), patches: st.patches ?? {}, customs: st.customs ?? [], version: st.version ?? 0 };
    cache = { raw, state };
    return state;
  } catch {
    return { config: mergeConfig(null), patches: {}, customs: [], version: 0 };
  }
}

function write(st: Stored) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...st, version: (st.version ?? 0) + 1 }));
  } catch {}
  for (const l of listeners) l();
}

export function subscribeDemoContent(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => e.key === KEY && l();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

export function demoSaveConfig(partial: Partial<SiteConfig>): SiteConfig {
  const st = readStored();
  const next = mergeConfig({ ...mergeConfig(st.config), ...partial });
  write({ ...st, config: next });
  return next;
}

export function demoSavePatch(slug: string, patch: ProductPatch): ProductPatch {
  const st = readStored();
  const patches = { ...(st.patches ?? {}) };
  const prev = patches[slug] ?? {};
  const merged: ProductPatch = { ...prev, ...patch };
  if (patch.variants) {
    const map = new Map((prev.variants ?? []).map((v) => [v.id, v]));
    for (const v of patch.variants) map.set(v.id, { ...(map.get(v.id) ?? { id: v.id }), ...v });
    merged.variants = [...map.values()];
  }
  patches[slug] = merged;
  write({ ...st, patches });
  return merged;
}

export function demoSaveCustom(product: Product) {
  const st = readStored();
  const customs = [...(st.customs ?? []).filter((c) => c.slug !== product.slug), product];
  write({ ...st, customs });
}

export function demoRemoveProduct(slug: string) {
  const st = readStored();
  const patches = { ...(st.patches ?? {}) };
  delete patches[slug];
  write({ ...st, patches, customs: (st.customs ?? []).filter((c) => c.slug !== slug) });
}

export function demoReset() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
  for (const l of listeners) l();
}
