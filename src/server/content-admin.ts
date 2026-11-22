import { revalidateTag } from "next/cache";
import { CONTENT_TAG } from "./content-cache";
import { readContentState } from "./content-store";
import { baseProducts } from "@/lib/catalog";
import { applyPatch, mergeCatalog, type ProductPatch } from "@/lib/content";
import type { Product } from "@/lib/types";

/** İçerik değişince önbelleği düşür: bir sonraki istek taze veriyi bekler. */
export function invalidateContent() {
  revalidateTag(CONTENT_TAG, { expire: 0 });
}

export type AdminProduct = Product & { hidden: boolean; custom: boolean; patched: boolean };

/** Yönetim listesi: gizliler dâhil tüm ürünler (yamalar uygulanmış). */
export async function listAdminProducts(): Promise<AdminProduct[]> {
  const { patches, customs } = await readContentState();
  const out: AdminProduct[] = [];
  const push = (p: Product, custom: boolean) => {
    const patch: ProductPatch | undefined = patches[p.slug];
    const applied = applyPatch(p, patch ? { ...patch, hidden: false } : undefined) ?? p;
    out.push({ ...applied, hidden: Boolean(patch?.hidden), custom, patched: Boolean(patch) });
  };
  for (const p of baseProducts) push(p, false);
  for (const c of customs) push(c, true);
  return out;
}

export async function publishedProducts(): Promise<Product[]> {
  const { patches, customs } = await readContentState();
  return mergeCatalog(baseProducts, patches, customs);
}
