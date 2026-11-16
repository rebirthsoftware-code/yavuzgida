import type { Product, ProductIndex } from "./types";
import { categories, categoryMap } from "./categories";
import catalogJson from "@/data/catalog.json";
import indexJson from "@/data/catalog-index.json";

/**
 * Katalog erişimi (sunucu tarafı). Ürünler şimdilik JSON dosyasından okunur;
 * ilerleyen aşamada veritabanı/yönetim paneline taşınacak — bu modülün imzası sabit kalır.
 */
export const products = catalogJson as Product[];
export const productIndex = indexJson as ProductIndex[];

const bySlug = new Map(products.map((p) => [p.slug, p]));

export function getProduct(slug: string): Product | undefined {
  return bySlug.get(slug);
}

export function minPrice(p: Product): number {
  return Math.min(...p.variants.map((v) => v.price));
}

export function productsIn(category: string, subcategory?: string): Product[] {
  return products.filter((p) => p.category === category && (!subcategory || p.subcategory === subcategory));
}

export function countIn(category: string, subcategory?: string): number {
  return productIndex.filter((p) => p.category === category && (!subcategory || p.subcategory === subcategory)).length;
}

export function categoryCounts(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of productIndex) out[p.category] = (out[p.category] ?? 0) + 1;
  return out;
}

export function bestSellers(limit = 12): Product[] {
  return [...products].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

export function newArrivals(limit = 12): Product[] {
  return [...products].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, limit);
}

export function discounted(limit = 12): Product[] {
  return products.filter((p) => p.tags.includes("indirim")).sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

export function related(p: Product, limit = 8): Product[] {
  const same = products.filter((x) => x.slug !== p.slug && x.subcategory === p.subcategory && x.category === p.category);
  const more = products.filter((x) => x.slug !== p.slug && x.category === p.category && x.subcategory !== p.subcategory);
  return [...same, ...more].slice(0, limit);
}

export const brands = [...new Set(products.map((p) => p.brand))].sort((a, b) => a.localeCompare(b, "tr"));

export { categories, categoryMap };
