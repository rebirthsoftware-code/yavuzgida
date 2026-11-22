import type { Product, ProductIndex } from "./types";
import { categories, categoryMap } from "./categories";
import { mergeCatalog, applyCategoryOverrides } from "./content";
import type { Category } from "./types";
import { toIndex } from "./index-of";
import { loadContent } from "@/server/content-cache";
import catalogJson from "@/data/catalog.json";

/**
 * Katalog erişimi (sunucu tarafı).
 * Temel ürünler `data/catalog.json`dan gelir; yönetim panelindeki düzenlemeler (fiyat, stok, ad,
 * görsel, gizleme, yeni ürün) üstüne bindirilir. Sonuç içerik önbelleğiyle birlikte yenilenir.
 */
export const baseProducts = catalogJson as Product[];

export type Catalog = {
  products: Product[];
  index: ProductIndex[];
  bySlug: Map<string, Product>;
  counts: Record<string, number>;
  brands: string[];
};

export async function getCatalog(): Promise<Catalog> {
  const { patches, customs, config } = await loadContent();
  const hiddenCats = new Set(Object.entries(config.categories).filter(([, o]) => o.hidden).map(([k]) => k));
  const products = mergeCatalog(baseProducts, patches, customs).filter((p) => !hiddenCats.has(p.category));
  const counts: Record<string, number> = {};
  for (const p of products) counts[p.category] = (counts[p.category] ?? 0) + 1;
  return {
    products,
    index: products.map(toIndex),
    bySlug: new Map(products.map((p) => [p.slug, p])),
    counts,
    brands: [...new Set(products.map((p) => p.brand))].sort((a, b) => a.localeCompare(b, "tr")),
  };
}

export async function getProducts(): Promise<Product[]> {
  return (await getCatalog()).products;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await getCatalog()).bySlug.get(slug);
}

export function minPrice(p: Product): number {
  return Math.min(...p.variants.map((v) => v.price));
}

export async function productsIn(category: string, subcategory?: string): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.category === category && (!subcategory || p.subcategory === subcategory));
}

export async function countIn(category: string, subcategory?: string): Promise<number> {
  return (await productsIn(category, subcategory)).length;
}

export async function categoryCounts(): Promise<Record<string, number>> {
  return (await getCatalog()).counts;
}

export async function bestSellers(limit = 12): Promise<Product[]> {
  return [...(await getProducts())].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

export async function newArrivals(limit = 12): Promise<Product[]> {
  return [...(await getProducts())].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)).slice(0, limit);
}

export async function discounted(limit = 12): Promise<Product[]> {
  return (await getProducts()).filter((p) => p.tags.includes("indirim")).sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

export async function related(p: Product, limit = 8): Promise<Product[]> {
  const all = await getProducts();
  const same = all.filter((x) => x.slug !== p.slug && x.subcategory === p.subcategory && x.category === p.category);
  const more = all.filter((x) => x.slug !== p.slug && x.category === p.category && x.subcategory !== p.subcategory);
  return [...same, ...more].slice(0, limit);
}

export async function getBrands(): Promise<string[]> {
  return (await getCatalog()).brands;
}

/** Yönetim ayarları uygulanmış kategori listesi (gizliler hariç, adlar güncel). */
export async function getCategories(): Promise<Category[]> {
  const { config } = await loadContent();
  return applyCategoryOverrides(categories, config.categories);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return (await getCategories()).find((c) => c.slug === slug);
}

export { categories, categoryMap };
