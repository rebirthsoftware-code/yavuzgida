import type { Product, ProductIndex } from "./types";

/** Tam üründen hafif liste kaydı üretir (sunucu bileşenlerinden kartlara geçerken) */
export function toIndex(p: Product): ProductIndex {
  const first = p.variants[0];
  return {
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.category,
    subcategory: p.subcategory,
    tags: p.tags,
    price: first.price,
    ...(first.oldPrice ? { oldPrice: first.oldPrice } : {}),
    unit: first.label,
    variantId: first.id,
    sku: first.sku,
    variants: p.variants.length,
    inStock: p.variants.some((v) => v.inStock),
    hue: p.hue,
    popularity: p.popularity,
    createdAt: p.createdAt,
    ...(p.image ? { image: p.image } : {}),
  };
}
