/**
 * robots.txt ve sitemap.xml üretir (public/ altına). Statik dışa aktarım (GitHub Pages)
 * ile uyumlu olması için route handler yerine düz dosya kullanılır.
 * Çalıştır: node scripts/generate-seo.mjs  (npm run build öncesi otomatik)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://yavuzgida.com").replace(/\/$/, "");
const products = JSON.parse(readFileSync(join(root, "src/data/catalog.json"), "utf8"));
const catSrc = readFileSync(join(root, "src/lib/categories.ts"), "utf8");
const catSlugs = [...catSrc.matchAll(/^\s{4}slug: "([^"]+)"/gm)].map((m) => m[1]);
const subSlugs = [...catSrc.matchAll(/\{ slug: "([^"]+)", name: "[^"]+" \}/g)].map((m) => m[1]);

const statics = ["", "/urunler", "/kurumsal", "/hakkimizda", "/iletisim", "/sss", "/siparis-takip"];
const urls = [
  ...statics.map((p) => ({ loc: `${base}${p}`, pri: p === "" ? "1.0" : "0.7" })),
  ...catSlugs.map((c) => ({ loc: `${base}/kategori/${c}`, pri: "0.8" })),
  ...products.map((p) => ({ loc: `${base}/urun/${p.slug}`, pri: "0.5", mod: p.createdAt })),
];
void subSlugs;
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((u) => `  <url><loc>${u.loc}</loc>${u.mod ? `<lastmod>${u.mod}</lastmod>` : ""}<changefreq>weekly</changefreq><priority>${u.pri}</priority></url>`)
  .join("\n")}\n</urlset>\n`;
writeFileSync(join(root, "public/sitemap.xml"), xml);
writeFileSync(join(root, "public/robots.txt"), `User-agent: *\nAllow: /\nDisallow: /odeme\nDisallow: /sepet\n\nSitemap: ${base}/sitemap.xml\n`);
console.log(`sitemap: ${urls.length} adres`);
