"use client";

import { useEffect, useSyncExternalStore } from "react";
import indexJson from "@/data/catalog-index.json";
import type { ProductIndex } from "./types";
import { DEMO_ADMIN } from "./api";
import { site } from "./site";
import { mergeCatalog } from "./content";
import { readDemoContent, subscribeDemoContent } from "./demo-content";
import { toIndex } from "./index-of";
import type { Product } from "./types";
import catalogJson from "@/data/catalog.json";

/**
 * İstemci tarafı ürün dizini: derlemeyle gelen JSON ile başlar; sunucu varsa yayınlanan (yönetimde
 * düzenlenmiş) dizinle değiştirilir; demoda tarayıcıdaki düzenlemeler uygulanır.
 */
const staticIndex = indexJson as ProductIndex[];
let current: ProductIndex[] = staticIndex;
let fetched = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(l: () => void) {
  listeners.add(l);
  const unsubDemo = DEMO_ADMIN ? subscribeDemoContent(l) : () => {};
  return () => {
    listeners.delete(l);
    unsubDemo();
  };
}

let demoCache: { version: number; index: ProductIndex[] } | null = null;
function snapshot(): ProductIndex[] {
  if (DEMO_ADMIN) {
    const st = readDemoContent();
    if (!demoCache || demoCache.version !== st.version) demoCache = { version: st.version, index: mergeCatalog(catalogJson as Product[], st.patches, st.customs).map(toIndex) };
    return demoCache.index;
  }
  return current;
}

export function useCatalogIndex(): ProductIndex[] {
  const index = useSyncExternalStore(subscribe, snapshot, () => staticIndex);
  useEffect(() => {
    if (DEMO_ADMIN || fetched || !site.api.url) return;
    fetched = true;
    fetch(`${site.api.url}/catalog-index`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { index?: ProductIndex[] } | null) => {
        if (d?.index?.length) {
          current = d.index;
          emit();
        }
      })
      .catch(() => {});
  }, []);
  return index;
}
