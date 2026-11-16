"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight, Search } from "lucide-react";
import indexJson from "@/data/catalog-index.json";
import type { ProductIndex, ProductTag } from "@/lib/types";
import { categories, categoryMap } from "@/lib/categories";
import { searchProducts } from "@/lib/search";
import { minPriceOf, inStockOf } from "@/lib/index-of";
import { ProductRow } from "./ProductRow";
import { tagLabel } from "@/components/ui/Badge";
import { formatCompact } from "@/lib/format";

const all = indexJson as ProductIndex[];
const PAGE = 40;
const TAGS: ProductTag[] = ["indirim", "cok-satan", "yeni", "yerli", "organik", "glutensiz"];
const SORTS = [
  ["katalog", "Katalog sırası"],
  ["populer", "Popülerlik"],
  ["fiyat-artan", "Fiyat (artan)"],
  ["fiyat-azalan", "Fiyat (azalan)"],
  ["yeni", "Yeni eklenenler"],
  ["ad", "Ada göre (A–Z)"],
] as const;

type Props = { fixedCategory?: string; fixedSub?: string };

export function Catalog({ fixedCategory, fixedSub }: Props) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [panel, setPanel] = useState(false);

  const q = sp.get("q") ?? "";
  const cat = fixedCategory ?? sp.get("kategori") ?? "";
  const sub = fixedSub ?? sp.get("alt") ?? "";
  const brands = sp.getAll("marka");
  const tags = sp.getAll("etiket") as ProductTag[];
  const sort = sp.get("sirala") ?? (q ? "populer" : "katalog");
  const page = Math.max(1, Number(sp.get("sayfa") ?? 1));
  const min = Number(sp.get("min") ?? 0) || 0;
  const max = Number(sp.get("max") ?? 0) || 0;
  const stock = sp.get("stok") === "1";

  const setParams = useCallback(
    (patch: Record<string, string | string[] | null>, resetPage = true) => {
      const next = new URLSearchParams(sp.toString());
      for (const [k, v] of Object.entries(patch)) {
        next.delete(k);
        if (v === null) continue;
        if (Array.isArray(v)) v.forEach((x) => next.append(k, x));
        else if (v !== "") next.set(k, v);
      }
      if (resetPage) next.delete("sayfa");
      const s = next.toString();
      router.push(s ? `${pathname}?${s}` : pathname, { scroll: false });
    },
    [sp, router, pathname],
  );

  const base = useMemo(() => {
    let list = q ? searchProducts(all, q, 2000) : all;
    if (cat) list = list.filter((p) => p.category === cat);
    if (sub) list = list.filter((p) => p.subcategory === sub);
    return list;
  }, [q, cat, sub]);

  const brandOptions = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of base) m.set(p.brand, (m.get(p.brand) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [base]);

  const filtered = useMemo(() => {
    let list = base;
    if (brands.length) list = list.filter((p) => brands.includes(p.brand));
    if (tags.length) list = list.filter((p) => tags.every((t) => p.tags.includes(t)));
    if (min) list = list.filter((p) => minPriceOf(p) >= min);
    if (max) list = list.filter((p) => minPriceOf(p) <= max);
    if (stock) list = list.filter(inStockOf);
    const sorted = [...list];
    const catOrder = (p: ProductIndex) => categoryMap[p.category]?.order ?? 99;
    const subOrder = (p: ProductIndex) => categoryMap[p.category]?.subcategories.findIndex((s) => s.slug === p.subcategory) ?? 99;
    switch (sort) {
      case "fiyat-artan":
        sorted.sort((a, b) => minPriceOf(a) - minPriceOf(b));
        break;
      case "fiyat-azalan":
        sorted.sort((a, b) => minPriceOf(b) - minPriceOf(a));
        break;
      case "yeni":
        sorted.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        break;
      case "ad":
        sorted.sort((a, b) => a.name.localeCompare(b.name, "tr"));
        break;
      case "populer":
        if (!q) sorted.sort((a, b) => b.popularity - a.popularity);
        break;
      default:
        sorted.sort((a, b) => catOrder(a) - catOrder(b) || subOrder(a) - subOrder(b) || a.name.localeCompare(b.name, "tr"));
    }
    return sorted;
  }, [base, brands, tags, min, max, stock, sort, q]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const current = Math.min(page, pages);
  const slice = filtered.slice((current - 1) * PAGE, current * PAGE);

  /* Katalog sırasında alt kategori başlıklarıyla grupla */
  const grouped = useMemo(() => {
    if (sort !== "katalog") return [{ key: "", title: "", items: slice }];
    const out: { key: string; title: string; items: ProductIndex[] }[] = [];
    for (const p of slice) {
      const c = categoryMap[p.category];
      const s = c?.subcategories.find((x) => x.slug === p.subcategory);
      const key = `${p.category}/${p.subcategory}`;
      const title = fixedCategory ? (s?.name ?? "") : `${c?.name ?? ""} — ${s?.name ?? ""}`;
      const last = out[out.length - 1];
      if (last && last.key === key) last.items.push(p);
      else out.push({ key, title, items: [p] });
    }
    return out;
  }, [slice, sort, fixedCategory]);

  const goPage = (n: number) => {
    setParams({ sayfa: n === 1 ? null : String(n) }, false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chips: { label: string; onClear: () => void }[] = [];
  if (q) chips.push({ label: `“${q}”`, onClear: () => setParams({ q: null }) });
  if (!fixedCategory && cat) chips.push({ label: categoryMap[cat]?.name ?? cat, onClear: () => setParams({ kategori: null, alt: null }) });
  if (!fixedSub && sub) chips.push({ label: categoryMap[cat]?.subcategories.find((s) => s.slug === sub)?.name ?? sub, onClear: () => setParams({ alt: null }) });
  brands.forEach((b) => chips.push({ label: b, onClear: () => setParams({ marka: brands.filter((x) => x !== b) }) }));
  tags.forEach((t) => chips.push({ label: tagLabel(t), onClear: () => setParams({ etiket: tags.filter((x) => x !== t) }) }));
  if (min || max) chips.push({ label: `${min ? formatCompact(min) : "0 ₺"} – ${max ? formatCompact(max) : "∞"}`, onClear: () => setParams({ min: null, max: null }) });
  if (stock) chips.push({ label: "Stoktakiler", onClear: () => setParams({ stok: null }) });

  return (
    <div>
      {/* Araç çubuğu */}
      <div className="sticky top-16 z-20 border-y border-ink-200 bg-paper-50/95 backdrop-blur">
        <div className="flex flex-wrap items-center gap-2 px-4 py-2 lg:px-6">
          <p className="mr-2 text-sm text-ink-600">
            <b className="font-display text-xl text-navy-900">{filtered.length}</b> ürün
          </p>

          {!fixedCategory && (
            <select value={cat} onChange={(e) => setParams({ kategori: e.target.value || null, alt: null })} className="h-9 max-w-[11rem] rounded-md border border-ink-200 bg-white px-2.5 text-sm outline-none focus:border-navy-900">
              <option value="">Tüm kategoriler</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          <button onClick={() => setPanel((v) => !v)} className={`inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-semibold ${panel ? "border-navy-900 bg-navy-900 text-white" : "border-ink-200 bg-white text-ink-700 hover:border-navy-900"}`}>
            <SlidersHorizontal className="size-4" /> Filtreler
            {chips.length > 0 && <span className="rounded-full bg-orange-500 px-1.5 text-[0.65rem] text-white">{chips.length}</span>}
          </button>

          <div className="ml-auto flex items-center gap-2">
            <select value={sort} onChange={(e) => setParams({ sirala: e.target.value })} className="h-9 rounded-md border border-ink-200 bg-white px-2.5 text-sm outline-none focus:border-navy-900">
              {SORTS.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 px-4 pb-2 lg:px-6">
            {chips.map((c, i) => (
              <button key={i} onClick={c.onClear} className="inline-flex items-center gap-1 rounded-full bg-sky-100 py-0.5 pl-2.5 pr-1.5 text-xs font-semibold text-navy-900 hover:bg-sky-200">
                {c.label} <X className="size-3" />
              </button>
            ))}
            <button onClick={() => router.push(pathname)} className="text-xs text-ink-500 underline-offset-2 hover:underline">
              Temizle
            </button>
          </div>
        )}

        {panel && (
          <div className="grid gap-6 border-t border-ink-200 bg-white px-4 py-5 md:grid-cols-[1fr_1fr_auto] lg:px-6">
            <div>
              <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-ink-400">Marka</p>
              <div className="flex flex-wrap gap-1.5">
                {brandOptions.map(([b, n]) => {
                  const on = brands.includes(b);
                  return (
                    <button key={b} onClick={() => setParams({ marka: on ? brands.filter((x) => x !== b) : [...brands, b] })} className={`rounded-md border px-2.5 py-1 text-xs ${on ? "border-navy-900 bg-navy-900 text-white" : "border-ink-200 text-ink-700 hover:border-navy-900"}`}>
                      {b} <span className={on ? "text-sky-300" : "text-ink-400"}>{n}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-ink-400">Etiket</p>
              <div className="flex flex-wrap gap-1.5">
                {TAGS.map((t) => {
                  const on = tags.includes(t);
                  return (
                    <button key={t} onClick={() => setParams({ etiket: on ? tags.filter((x) => x !== t) : [...tags, t] })} className={`rounded-md border px-2.5 py-1 text-xs ${on ? "border-orange-600 bg-orange-600 text-white" : "border-ink-200 text-ink-700 hover:border-orange-600"}`}>
                      {tagLabel(t)}
                    </button>
                  );
                })}
              </div>
              <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-ink-700">
                <input type="checkbox" checked={stock} onChange={() => setParams({ stok: stock ? null : "1" })} className="size-4 accent-navy-900" />
                Yalnızca stoktakiler
              </label>
            </div>
            <PriceRange key={`${min}-${max}`} min={min} max={max} onApply={(a, b) => setParams({ min: a ? String(a) : null, max: b ? String(b) : null })} />
          </div>
        )}
      </div>

      {/* Liste */}
      {slice.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-24 text-center">
          <Search className="size-8 text-ink-300" strokeWidth={1.5} />
          <p className="mt-4 font-display text-2xl text-navy-900">Sonuç bulunamadı</p>
          <p className="mt-1 text-sm text-ink-500">Filtreleri gevşetmeyi veya farklı bir arama denemeyi deneyin.</p>
          <button onClick={() => router.push(pathname)} className="mt-5 h-10 rounded-md bg-navy-900 px-4 text-sm font-semibold text-white">
            Filtreleri temizle
          </button>
        </div>
      ) : (
        grouped.map((g) => (
          <section key={g.key || "flat"}>
            {g.title && (
              <h2 className="sticky top-[6.6rem] z-10 border-b border-ink-200 bg-paper-100 px-4 py-1.5 text-[0.7rem] font-sans font-bold uppercase tracking-[0.22em] text-ink-500 lg:px-6">
                {g.title}
              </h2>
            )}
            <ul className="divide-y divide-ink-100">
              {g.items.map((p) => (
                <ProductRow key={p.slug} p={p} showCategory={!fixedCategory && sort !== "katalog"} />
              ))}
            </ul>
          </section>
        ))
      )}

      {pages > 1 && (
        <nav aria-label="Sayfalar" className="flex items-center justify-between border-t border-ink-200 px-4 py-4 text-sm lg:px-6">
          <button disabled={current <= 1} onClick={() => goPage(current - 1)} className="inline-flex h-9 items-center gap-1 rounded-md border border-ink-200 px-3 font-semibold disabled:opacity-40">
            <ChevronLeft className="size-4" /> Önceki
          </button>
          <p className="text-ink-600">
            Sayfa <b className="text-navy-900">{current}</b> / {pages}
          </p>
          <button disabled={current >= pages} onClick={() => goPage(current + 1)} className="inline-flex h-9 items-center gap-1 rounded-md border border-ink-200 px-3 font-semibold disabled:opacity-40">
            Sonraki <ChevronRight className="size-4" />
          </button>
        </nav>
      )}
    </div>
  );
}

function PriceRange({ min, max, onApply }: { min: number; max: number; onApply: (a: number, b: number) => void }) {
  const [a, setA] = useState(min ? String(min) : "");
  const [b, setB] = useState(max ? String(max) : "");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onApply(Number(a) || 0, Number(b) || 0);
      }}
    >
      <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-ink-400">Fiyat (₺)</p>
      <div className="flex items-center gap-2">
        <input inputMode="numeric" value={a} onChange={(e) => setA(e.target.value)} placeholder="Min" className="h-9 w-20 rounded-md border border-ink-200 px-2.5 text-sm outline-none focus:border-navy-900" />
        <span className="text-ink-300">–</span>
        <input inputMode="numeric" value={b} onChange={(e) => setB(e.target.value)} placeholder="Max" className="h-9 w-20 rounded-md border border-ink-200 px-2.5 text-sm outline-none focus:border-navy-900" />
        <button type="submit" className="h-9 rounded-md bg-navy-900 px-3 text-xs font-semibold text-white">
          Uygula
        </button>
      </div>
    </form>
  );
}
