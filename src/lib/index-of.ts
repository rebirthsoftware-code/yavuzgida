import type { Product, ProductIndex } from "./types";

/** Tam üründen hafif liste kaydı üretir (sunucu bileşenlerinden satırlara geçerken) */
export function toIndex(p: Product): ProductIndex {
  return {
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.category,
    subcategory: p.subcategory,
    tags: p.tags,
    variants: p.variants,
    hue: p.hue,
    popularity: p.popularity,
    createdAt: p.createdAt,
    ...(p.image ? { image: p.image } : {}),
  };
}

export const minPriceOf = (p: ProductIndex) => Math.min(...p.variants.map((v) => v.price));
export const inStockOf = (p: ProductIndex) => p.variants.some((v) => v.inStock);
