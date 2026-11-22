/**
 * Ürün listesi CSV içe/dışa aktarma (Excel uyumlu; ayraç otomatik: ; veya ,).
 * Her satır bir varyanttır; aynı `slug` satırları tek ürün olarak gruplanır.
 */
import type { Product, ProductTag, Variant } from "./types";
import { CUSTOM_PREFIX, slugify, type ProductPatch } from "./content";

export const CSV_COLUMNS = ["slug", "marka", "urun_adi", "kategori", "alt_kategori", "varyant_id", "varyant", "fiyat", "eski_fiyat", "stok", "stok_kodu", "miktar", "birim", "koli_ici", "etiketler", "gorsel", "kisa_aciklama", "aciklama", "gizli"] as const;
type Col = (typeof CSV_COLUMNS)[number];

export function parseCsv(text: string): Record<string, string>[] {
  const src = text.replace(/^﻿/, "");
  const firstLine = src.split(/\r?\n/)[0] ?? "";
  const delim = (firstLine.match(/;/g)?.length ?? 0) > (firstLine.match(/,/g)?.length ?? 0) ? ";" : ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let q = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (q) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else q = false;
      } else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === delim) {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      cell = "";
      if (row.some((c) => c.trim() !== "")) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((c) => c.trim() !== "")) rows.push(row);
  if (!rows.length) return [];
  const header = rows[0].map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  return rows.slice(1).map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()])));
}

const esc = (v: unknown) => {
  const s = v === undefined || v === null ? "" : String(v);
  return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function productsToCsv(products: Product[], hidden: Set<string> = new Set()): string {
  const lines = [CSV_COLUMNS.join(";")];
  for (const p of products) {
    for (const v of p.variants) {
      const rec: Record<Col, unknown> = {
        slug: p.slug,
        marka: p.brand,
        urun_adi: p.name,
        kategori: p.category,
        alt_kategori: p.subcategory,
        varyant_id: v.id,
        varyant: v.label,
        fiyat: v.price,
        eski_fiyat: v.oldPrice ?? "",
        stok: v.inStock ? "1" : "0",
        stok_kodu: v.sku,
        miktar: v.amount,
        birim: v.amountUnit,
        koli_ici: v.caseQty ?? "",
        etiketler: p.tags.join("|"),
        gorsel: p.image ?? "",
        kisa_aciklama: p.short,
        aciklama: p.description,
        gizli: hidden.has(p.slug) ? "1" : "0",
      };
      lines.push(CSV_COLUMNS.map((c) => esc(rec[c])).join(";"));
    }
  }
  return "﻿" + lines.join("\r\n");
}

const num = (s: string | undefined) => {
  if (!s) return undefined;
  const n = Number(String(s).replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "") || String(s).replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
};
const bool = (s: string | undefined) => (s === undefined || s === "" ? undefined : /^(1|evet|true|var|e)$/i.test(s));
const VALID_TAGS: ProductTag[] = ["cok-satan", "yeni", "indirim", "yerli", "organik", "glutensiz", "vegan"];

export type ImportResult = { patches: Record<string, ProductPatch>; customs: Product[]; errors: string[] };

/** CSV satırlarını yamalara (mevcut ürün) ve yeni ürünlere dönüştürür. */
export function rowsToImport(rows: Record<string, string>[], known: Set<string>): ImportResult {
  const bySlug = new Map<string, Record<string, string>[]>();
  const errors: string[] = [];
  rows.forEach((r, i) => {
    const slug = (r.slug || slugify(`${r.marka ?? ""} ${r.urun_adi ?? ""}`)).trim();
    if (!slug) {
      errors.push(`Satır ${i + 2}: slug veya ürün adı yok`);
      return;
    }
    bySlug.set(slug, [...(bySlug.get(slug) ?? []), r]);
  });
  const patches: Record<string, ProductPatch> = {};
  const customs: Product[] = [];
  for (const [slug, rs] of bySlug) {
    const first = rs[0];
    const tags = first.etiketler !== undefined && first.etiketler !== "" ? (first.etiketler.split(/[|,]/).map((t) => t.trim()).filter((t): t is ProductTag => VALID_TAGS.includes(t as ProductTag))) : undefined;
    const variants = rs.map((r, k) => {
      const price = num(r.fiyat);
      const id = r.varyant_id || slugify(r.varyant || `v${k + 1}`) || `v${k + 1}`;
      const v: Partial<Variant> & { id: string } = { id };
      if (r.varyant) v.label = r.varyant;
      if (price !== undefined) v.price = price;
      const old = num(r.eski_fiyat);
      if (r.eski_fiyat !== undefined) v.oldPrice = old;
      const st = bool(r.stok);
      if (st !== undefined) v.inStock = st;
      if (r.stok_kodu) v.sku = r.stok_kodu;
      const amt = num(r.miktar);
      if (amt !== undefined) v.amount = amt;
      if (r.birim && ["g", "ml", "adet"].includes(r.birim)) v.amountUnit = r.birim as Variant["amountUnit"];
      const cq = num(r.koli_ici);
      if (cq !== undefined) v.caseQty = cq;
      return v;
    });
    const common: ProductPatch = {};
    if (first.urun_adi) common.name = first.urun_adi;
    if (first.marka) common.brand = first.marka;
    if (first.kategori) common.category = first.kategori;
    if (first.alt_kategori) common.subcategory = first.alt_kategori;
    if (tags) common.tags = tags;
    if (first.gorsel !== undefined && first.gorsel !== "") common.image = first.gorsel;
    if (first.kisa_aciklama) common.short = first.kisa_aciklama;
    if (first.aciklama) common.description = first.aciklama;
    const hidden = bool(first.gizli);
    if (hidden !== undefined) common.hidden = hidden;

    if (known.has(slug)) {
      patches[slug] = { ...common, variants };
    } else {
      const missing = variants.filter((v) => !v.label || v.price === undefined);
      if (!first.urun_adi || !first.kategori || missing.length) {
        errors.push(`${slug}: yeni ürün için ad, kategori, varyant adı ve fiyat zorunlu`);
        continue;
      }
      const full: Product = {
        slug: slug.startsWith(CUSTOM_PREFIX) ? slug : CUSTOM_PREFIX + slug,
        name: first.urun_adi,
        brand: first.marka || "Yavuz Gıda",
        art: "box",
        rating: 0,
        reviews: 0,
        sold: 0,
        category: first.kategori,
        subcategory: first.alt_kategori || "",
        short: first.kisa_aciklama || first.urun_adi,
        description: first.aciklama || first.kisa_aciklama || first.urun_adi,
        tags: tags ?? [],
        variants: variants.map((v, k) => ({ id: v.id, label: v.label!, sku: v.sku ?? `YVZ-${slugify(first.urun_adi).toUpperCase().slice(0, 9)}-${k + 1}`, price: v.price!, oldPrice: v.oldPrice, amount: v.amount ?? 1, amountUnit: v.amountUnit ?? "adet", inStock: v.inStock ?? true, caseQty: v.caseQty })),
        specs: [],
        hue: 30,
        popularity: 50,
        createdAt: new Date().toISOString().slice(0, 10),
        ...(first.gorsel ? { image: first.gorsel } : {}),
      };
      customs.push(full);
      if (hidden) patches[full.slug] = { hidden: true };
    }
  }
  return { patches, customs, errors };
}
