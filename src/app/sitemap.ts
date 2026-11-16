import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { categories } from "@/lib/categories";
import { products } from "@/lib/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const statics = ["", "/urunler", "/kurumsal", "/hakkimizda", "/iletisim", "/sss", "/siparis-takip"].map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 }));
  const cats = categories.flatMap((c) => [{ url: `${base}/kategori/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.8 }, ...c.subcategories.map((s) => ({ url: `${base}/kategori/${c.slug}/${s.slug}`, changeFrequency: "weekly" as const, priority: 0.6 }))]);
  const prods = products.map((p) => ({ url: `${base}/urun/${p.slug}`, lastModified: p.createdAt, changeFrequency: "weekly" as const, priority: 0.5 }));
  return [...statics, ...cats, ...prods];
}
