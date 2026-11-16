"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronRight, Search, PackageOpen } from "lucide-react";
import indexJson from "@/data/catalog-index.json";
import type { ProductIndex, ProductTag } from "@/lib/types";
import { categories, categoryMap } from "@/lib/categories";
import { searchProducts } from "@/lib/search";
import { ProductCard } from "@/components/product/ProductCard";
import { tagLabel } from "@/components/ui/Badge";
import { formatCompact } from "@/lib/format";

const all = indexJson as ProductIndex[];
const PAGE = 24;
const TAGS: ProductTag[] = ["indirim", "cok-satan", "yeni", "yerli", "organik", "glutensiz"];
const SORTS = [
  ["populer", "Popülerlik"],
  ["fiyat-artan", "Fiyat (artan)"],
  ["fiyat-azalan", "Fiyat (azalan)"],
  ["yeni", "Yeni eklenenler"],
  ["ad", "Ada göre (A–Z)"],
] as const;

type Props = {
  fixedCategory?: string;
  fixedSub?: string;
};

export function Catalog({ fixedCategory, fixedSub }: Props) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);

  const q = sp.get("q") ?? "";
  const cat = fixedCategory ?? sp.get("kategori") ?? "";
  const sub = fixedSub ?? sp.get("alt") ?? "";
  const brands = sp.getAll("marka");
  const tags = sp.getAll("etiket") as ProductTag[];
  const sort = sp.get("sirala") ?? "populer";
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

  /* ---- Filtreleme ---- */
  const base = useMemo(() => {
    let list = q ? searchProducts(all, q, 1000) : all;
    if (cat) list = list.filter((p) => p.category === cat);
    if (sub) list = list.filter((p) => p.subcategory === sub);
    return list;
  }, [q, cat, sub]);

  const brandOptions = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of base) m.set(p.brand, (m.get(p.brand) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [base]);

  const subOptions = useMemo(() => {
    if (!cat) return [];
    const m = new Map<string, number>();
    for (const p of base) m.set(p.subcategory, (m.get(p.subcategory) ?? 0) + 1);
    return (categoryMap[cat]?.subcategories ?? []).map((s) => ({ ...s, count: m.get(s.slug) ?? 0 }));
  }, [base, cat]);

  const catOptions = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of base) m.set(p.category, (m.get(p.category) ?? 0) + 1);
    return categories.map((c) => ({ ...c, count: m.get(c.slug) ?? 0 })).filter((c) => c.count > 0);
  }, [base]);

  const filtered = useMemo(() => {
    let list = base;
    if (brands.length) list = list.filter((p) => brands.includes(p.brand));
    if (tags.length) list = list.filter((p) => tags.every((t) => p.tags.includes(t)));
    if (min) list = list.filter((p) => p.price >= min);
    if (max) list = list.filter((p) => p.price <= max);
    if (stock) list = list.filter((p) => p.inStock);
    const sorted = [...list];
    switch (sort) {
      case "fiyat-artan":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "fiyat-azalan":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "yeni":
        sorted.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        break;
      case "ad":
        sorted.sort((a, b) => a.name.localeCompare(b.name, "tr"));
        break;
      default:
        if (!q) sorted.sort((a, b) => b.popularity - a.popularity);
    }
    return sorted;
  }, [base, brands, tags, min, max, stock, sort, q]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const current = Math.min(page, pages);
  const slice = filtered.slice((current - 1) * PAGE, current * PAGE);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const activeChips: { label: string; onClear: () => void }[] = [];
  if (q) activeChips.push({ label: `Arama: "${q}"`, onClear: () => setParams({ q: null }) });
  if (!fixedCategory && cat) activeChips.push({ label: categoryMap[cat]?.name ?? cat, onClear: () => setParams({ kategori: null, alt: null }) });
  if (!fixedSub && sub) activeChips.push({ label: categoryMap[cat]?.subcategories.find((s) => s.slug === sub)?.name ?? sub, onClear: () => setParams({ alt: null }) });
  brands.forEach((b) => activeChips.push({ label: b, onClear: () => setParams({ marka: brands.filter((x) => x !== b) }) }));
  tags.forEach((t) => activeChips.push({ label: tagLabel(t), onClear: () => setParams({ etiket: tags.filter((x) => x !== t) }) }));
  if (min || max) activeChips.push({ label: `${min ? formatCompact(min) : "0 ₺"} – ${max ? formatCompact(max) : "∞"}`, onClear: () => setParams({ min: null, max: null }) });
  if (stock) activeChips.push({ label: "Stoktakiler", onClear: () => setParams({ stok: null }) });

  const sidebar = (
    <div className="space-y-7">
      {/* Kategori / alt kategori */}
      {!fixedCategory ? (
        <FilterGroup title="Kategoriler">
          <ul className="space-y-0.5">
            {catOptions.map((c) => (
              <li key={c.slug}>
                <button onClick={() => setParams({ kategori: c.slug === cat ? null : c.slug, alt: null })} className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-sm transition ${c.slug === cat ? "bg-green-50 font-semibold text-green-900" : "text-ink-700 hover:bg-paper-100"}`}>
                  {c.name}
                  <span className="text-xs tabular-nums text-ink-400">{c.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </FilterGroup>
      ) : null}
      {cat && !fixedSub && subOptions.length > 0 && (
        <FilterGroup title="Alt kategori">
          <ul className="space-y-0.5">
            {subOptions.map((s) => {
              const href = fixedCategory ? `/kategori/${cat}/${s.slug}` : undefined;
              const cls = `flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-sm transition ${s.slug === sub ? "bg-green-50 font-semibold text-green-900" : "text-ink-700 hover:bg-paper-100"}`;
              return (
                <li key={s.slug}>
                  {href ? (
                    <Link href={href} className={cls}>
                      {s.name}
                      <span className="text-xs tabular-nums text-ink-400">{s.count}</span>
                    </Link>
                  ) : (
                    <button onClick={() => setParams({ alt: s.slug === sub ? null : s.slug })} className={cls}>
                      {s.name}
                      <span className="text-xs tabular-nums text-ink-400">{s.count}</span>
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </FilterGroup>
      )}

      <FilterGroup title="Etiketler">
        <div className="flex flex-wrap gap-1.5">
          {TAGS.map((t) => {
            const on = tags.includes(t);
            return (
              <button key={t} onClick={() => setParams({ etiket: on ? tags.filter((x) => x !== t) : [...tags, t] })} className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${on ? "border-green-800 bg-green-800 text-white" : "border-ink-200 text-ink-700 hover:border-green-700"}`}>
                {tagLabel(t)}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="Marka">
        <ul className="max-h-56 space-y-1 overflow-y-auto pr-1">
          {brandOptions.map(([b, n]) => {
            const on = brands.includes(b);
            return (
              <li key={b}>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1 text-sm hover:bg-paper-100">
                  <input type="checkbox" checked={on} onChange={() => setParams({ marka: on ? brands.filter((x) => x !== b) : [...brands, b] })} className="size-4 rounded border-ink-300 accent-green-800" />
                  <span className="flex-1 text-ink-800">{b}</span>
                  <span className="text-xs tabular-nums text-ink-400">{n}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </FilterGroup>

      <FilterGroup title="Fiyat aralığı (₺)">
        <PriceRange key={`${min}-${max}`} min={min} max={max} onApply={(a, b) => setParams({ min: a ? String(a) : null, max: b ? String(b) : null })} />
      </FilterGroup>

      <label className="flex cursor-pointer items-center gap-2.5 text-sm">
        <input type="checkbox" checked={stock} onChange={() => setParams({ stok: stock ? null : "1" })} className="size-4 accent-green-800" />
        Yalnızca stoktakiler
      </label>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
      {/* Masaüstü kenar çubuğu */}
      <aside className="hidden lg:block">
        <div className="sticky top-[140px] rounded-2xl bg-white p-5 shadow-card">{sidebar}</div>
      </aside>

      {/* Mobil filtre çekmecesi */}
      <div className={`fixed inset-0 z-[75] lg:hidden ${drawer ? "" : "pointer-events-none"}`}>
        <div onClick={() => setDrawer(false)} className={`absolute inset-0 bg-green-950/50 transition-opacity ${drawer ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute inset-y-0 left-0 w-[86%] max-w-sm overflow-y-auto bg-white p-5 transition-transform duration-300 ${drawer ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold">Filtreler</h2>
            <button onClick={() => setDrawer(false)} aria-label="Kapat" className="grid size-9 place-items-center rounded-lg hover:bg-ink-100">
              <X className="size-5" />
            </button>
          </div>
          {sidebar}
          <button onClick={() => setDrawer(false)} className="mt-6 h-11 w-full rounded-xl bg-green-800 font-semibold text-white">
            {filtered.length} ürünü göster
          </button>
        </div>
      </div>

      <div className="min-w-0">
        {/* Araç çubuğu */}
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-card">
          <button onClick={() => setDrawer(true)} className="inline-flex h-10 items-center gap-2 rounded-xl border border-ink-200 px-3 text-sm font-semibold lg:hidden">
            <SlidersHorizontal className="size-4" /> Filtrele
            {activeChips.length > 0 && <span className="rounded-full bg-tangerine-500 px-1.5 text-[0.65rem] text-white">{activeChips.length}</span>}
          </button>
          <p className="text-sm text-ink-500">
            <b className="text-ink-900">{filtered.length}</b> ürün
          </p>
          <div className="ml-auto flex items-center gap-2">
            <label htmlFor="sirala" className="hidden text-sm text-ink-500 sm:block">
              Sırala
            </label>
            <select id="sirala" value={sort} onChange={(e) => setParams({ sirala: e.target.value === "populer" ? null : e.target.value })} className="h-10 rounded-xl border border-ink-200 bg-white px-3 text-sm font-medium outline-none focus:border-green-700">
              {SORTS.map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeChips.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {activeChips.map((c, i) => (
              <button key={i} onClick={c.onClear} className="inline-flex items-center gap-1 rounded-full bg-green-100 py-1 pl-3 pr-2 text-xs font-semibold text-green-900 hover:bg-green-200">
                {c.label} <X className="size-3" />
              </button>
            ))}
            <button onClick={() => router.push(pathname)} className="text-xs font-semibold text-ink-500 underline-offset-2 hover:underline">
              Temizle
            </button>
          </div>
        )}

        {slice.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-2xl bg-white px-6 py-16 text-center shadow-card">
            <span className="grid size-16 place-items-center rounded-2xl bg-paper-100">
              {q ? <Search className="size-7 text-ink-400" /> : <PackageOpen className="size-7 text-ink-400" />}
            </span>
            <p className="mt-4 font-semibold">Bu kriterlere uyan ürün bulunamadı</p>
            <p className="mt-1 text-sm text-ink-500">Filtreleri gevşetmeyi veya farklı bir arama terimi denemeyi deneyin.</p>
            <button onClick={() => router.push(pathname)} className="mt-5 h-10 rounded-xl bg-green-800 px-4 text-sm font-semibold text-white">
              Filtreleri temizle
            </button>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {slice.map((p, i) => (
              <ProductCard key={p.slug} p={p} priority={i < 4} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <nav aria-label="Sayfalar" className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
            {Array.from({ length: pages }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === pages || Math.abs(n - current) <= 2)
              .reduce<(number | "…")[]>((acc, n) => {
                const last = acc[acc.length - 1];
                if (typeof last === "number" && n - last > 1) acc.push("…");
                acc.push(n);
                return acc;
              }, [])
              .map((n, i) =>
                n === "…" ? (
                  <span key={`e${i}`} className="px-1 text-ink-400">
                    …
                  </span>
                ) : (
                  <button key={n} onClick={() => { setParams({ sayfa: n === 1 ? null : String(n) }, false); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-current={n === current ? "page" : undefined} className={`grid size-10 place-items-center rounded-xl text-sm font-semibold transition ${n === current ? "bg-green-800 text-white" : "bg-white text-ink-700 shadow-card hover:bg-paper-100"}`}>
                    {n}
                  </button>
                ),
              )}
            {current < pages && (
              <button onClick={() => { setParams({ sayfa: String(current + 1) }, false); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="ml-1 inline-flex h-10 items-center gap-1 rounded-xl bg-white px-3 text-sm font-semibold shadow-card hover:bg-paper-100">
                Sonraki <ChevronRight className="size-4" />
              </button>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.18em] text-ink-400">{title}</p>
      {children}
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
      className="flex items-center gap-2"
    >
      <input inputMode="numeric" value={a} onChange={(e) => setA(e.target.value)} placeholder="Min" className="h-9 w-full rounded-lg border border-ink-200 px-2.5 text-sm outline-none focus:border-green-700" />
      <span className="text-ink-300">–</span>
      <input inputMode="numeric" value={b} onChange={(e) => setB(e.target.value)} placeholder="Max" className="h-9 w-full rounded-lg border border-ink-200 px-2.5 text-sm outline-none focus:border-green-700" />
      <button type="submit" className="h-9 shrink-0 rounded-lg bg-green-800 px-3 text-xs font-semibold text-white">
        Uygula
      </button>
    </form>
  );
}
