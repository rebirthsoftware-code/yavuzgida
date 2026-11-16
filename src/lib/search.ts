import type { ProductIndex } from "./types";
import { categoryMap } from "./categories";

const fold = (s: string) =>
  s
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function normalize(s: string) {
  return fold(s);
}

/** Basit skorlu arama: ad > marka > kategori. Kelime başı eşleşme daha değerli. */
export function searchProducts(items: ProductIndex[], query: string, limit = 24): ProductIndex[] {
  const q = fold(query);
  if (q.length < 2) return [];
  const terms = q.split(" ");
  const scored: { item: ProductIndex; score: number }[] = [];
  for (const item of items) {
    const name = fold(item.name);
    const brand = fold(item.brand);
    const cat = fold(categoryMap[item.category]?.name ?? "");
    const sub = fold(categoryMap[item.category]?.subcategories.find((s) => s.slug === item.subcategory)?.name ?? "");
    let score = 0;
    for (const t of terms) {
      if (name === t) score += 20;
      else if (name.startsWith(t)) score += 12;
      else if (name.split(" ").some((w) => w.startsWith(t))) score += 8;
      else if (name.includes(t)) score += 5;
      else if (brand.includes(t)) score += 3;
      else if (sub.includes(t) || cat.includes(t)) score += 2;
      else {
        score = 0;
        break;
      }
    }
    if (score > 0) scored.push({ item, score: score + item.popularity / 100 });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, limit).map((s) => s.item);
}
