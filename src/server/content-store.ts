import type { InValue } from "@libsql/client";
import { db, dbConfigured } from "./db";
import { CUSTOM_PREFIX, defaultConfig, mergeConfig, type ContentState, type ProductPatch, type SiteConfig } from "@/lib/content";
import type { Product } from "@/lib/types";

/**
 * Yönetim panelinden düzenlenen içerik (site ayarları, ürün yamaları, eklenen ürünler) — veritabanı erişimi.
 * Tablolar: settings(key,value) içinde `site_config` ve `content_version`; content_products(slug, kind, json).
 */

const now = () => new Date().toISOString();

export const defaultState: ContentState = { config: defaultConfig, patches: {}, customs: [], version: 0 };

export async function readContentState(): Promise<ContentState> {
  if (!dbConfigured()) return defaultState;
  const c = await db();
  const [cfgRow, verRow, rows] = await Promise.all([
    c.execute({ sql: "SELECT value FROM settings WHERE key = ?1", args: ["site_config"] }),
    c.execute({ sql: "SELECT value FROM settings WHERE key = ?1", args: ["content_version"] }),
    c.execute("SELECT slug, kind, json FROM content_products"),
  ]);
  let saved: unknown = null;
  try {
    saved = cfgRow.rows[0]?.value ? JSON.parse(String(cfgRow.rows[0].value)) : null;
  } catch {}
  const patches: Record<string, ProductPatch> = {};
  const customs: Product[] = [];
  for (const r of rows.rows) {
    try {
      const data = JSON.parse(String(r.json));
      if (r.kind === "custom") customs.push(data as Product);
      else patches[String(r.slug)] = data as ProductPatch;
    } catch {}
  }
  return { config: mergeConfig(saved), patches, customs, version: Number(verRow.rows[0]?.value ?? 0) };
}

async function setSetting(key: string, value: string) {
  const c = await db();
  await c.execute({ sql: "INSERT INTO settings (key, value, updated_at) VALUES (?1, ?2, ?3) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at", args: [key, value, now()] });
}

export async function bumpVersion() {
  const c = await db();
  const cur = Number((await c.execute({ sql: "SELECT value FROM settings WHERE key = ?1", args: ["content_version"] })).rows[0]?.value ?? 0);
  await setSetting("content_version", String(cur + 1));
}

export async function writeConfig(partial: Partial<SiteConfig>): Promise<SiteConfig> {
  const current = (await readContentState()).config;
  const next = mergeConfig({ ...current, ...partial });
  await setSetting("site_config", JSON.stringify(next));
  await bumpVersion();
  return next;
}

async function upsertProductRow(slug: string, kind: "patch" | "custom", data: unknown) {
  const c = await db();
  const args: InValue[] = [slug, kind, JSON.stringify(data), now()];
  await c.execute({ sql: "INSERT INTO content_products (slug, kind, json, updated_at) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(slug) DO UPDATE SET kind = excluded.kind, json = excluded.json, updated_at = excluded.updated_at", args });
}

/** Temel katalog ürününe yama yazar (var olan yamayla birleştirir). */
export async function writePatch(slug: string, patch: ProductPatch): Promise<ProductPatch> {
  const state = await readContentState();
  const prev = state.patches[slug] ?? {};
  const merged: ProductPatch = { ...prev, ...patch };
  if (patch.variants) {
    const map = new Map((prev.variants ?? []).map((v) => [v.id, v]));
    for (const v of patch.variants) map.set(v.id, { ...(map.get(v.id) ?? { id: v.id }), ...v });
    merged.variants = [...map.values()];
  }
  await upsertProductRow(slug, "patch", merged);
  await bumpVersion();
  return merged;
}

/** Yönetimde oluşturulan ürünü tam kayıt olarak yazar. */
export async function writeCustom(product: Product): Promise<Product> {
  const slug = product.slug.startsWith(CUSTOM_PREFIX) ? product.slug : CUSTOM_PREFIX + product.slug;
  const p = { ...product, slug };
  await upsertProductRow(slug, "custom", p);
  await bumpVersion();
  return p;
}

/** Yamayı siler (temel ürün varsayılana döner) veya eklenen ürünü tamamen kaldırır. */
export async function removeProductRow(slug: string) {
  const c = await db();
  await c.execute({ sql: "DELETE FROM content_products WHERE slug = ?1", args: [slug] });
  await bumpVersion();
}
