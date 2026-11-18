"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown, Search, Star } from "lucide-react";
import indexJson from "@/data/catalog-index.json";
import type { ProductIndex, ProductTag } from "@/lib/types";
import { categories, categoryMap } from "@/lib/categories";
import { searchProducts } from "@/lib/search";
import { minPriceOf, inStockOf } from "@/lib/index-of";
import { ProductCard } from "@/components/product/ProductCard";
import { tagLabel } from "@/components/ui/Badge";
import { formatCompact } from "@/lib/format";
import { site } from "@/lib/site";
import { useCart } from "@/components/cart/CartProvider";

const all = indexJson as ProductIndex[];
const PAGE = 24;
const TAGS: ProductTag[] = ["indirim", "cok-satan", "yeni", "yerli", "organik", "glutensiz"];
const SORTS = [
  ["populer", "Önerilen"],
  ["cok-satan", "Çok Satanlar"],
  ["fiyat-artan", "En Düşük Fiyat"],
  ["fiyat-azalan", "En Yüksek Fiyat"],
  ["yeni", "En Yeniler"],
  ["puan", "En Çok Değerlendirilen"],
] as const;
const PRICE_RANGES: [number, number][] = [
  [0, 50],
  [50, 150],
  [150, 500],
  [500, 1500],
  [1500, 0],
];

export function Catalog({ fixedCategory, fixedSub }: { fixedCategory?: string; fixedSub?: string }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const [brandQ, setBrandQ] = useState("");
  const { showPrices } = useCart();

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
  const rated = sp.get("puan") === "4";
  const freeShip = sp.get("kargo") === "1";

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
  const catOptions = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of base) m.set(p.category, (m.get(p.category) ?? 0) + 1);
    return categories.map((c) => ({ ...c, count: m.get(c.slug) ?? 0 })).filter((c) => c.count > 0);
  }, [base]);
  const subOptions = useMemo(() => {
    if (!cat) return [];
    const m = new Map<string, number>();
    const pool = q ? searchProducts(all, q, 2000) : all;
    for (const p of pool) if (p.category === cat) m.set(p.subcategory, (m.get(p.subcategory) ?? 0) + 1);
    return (categoryMap[cat]?.subcategories ?? []).map((s) => ({ ...s, count: m.get(s.slug) ?? 0 }));
  }, [q, cat]);

  const filtered = useMemo(() => {
    let list = base;
    if (brands.length) list = list.filter((p) => brands.includes(p.brand));
    if (tags.length) list = list.filter((p) => tags.every((t) => p.tags.includes(t)));
    if (min) list = list.filter((p) => minPriceOf(p) >= min);
    if (max) list = list.filter((p) => minPriceOf(p) <= max);
    if (stock) list = list.filter(inStockOf);
    if (rated) list = list.filter((p) => p.rating >= 4);
    if (freeShip) list = list.filter((p) => minPriceOf(p) >= site.commerce.freeShippingThreshold);
    const sorted = [...list];
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
      case "puan":
        sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        break;
      case "cok-satan":
        sorted.sort((a, b) => b.sold - a.sold);
        break;
      default:
        if (!q) sorted.sort((a, b) => b.popularity - a.popularity);
    }
    return sorted;
  }, [base, brands, tags, min, max, stock, rated, freeShip, sort, q]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const current = Math.min(page, pages);
  const slice = filtered.slice((current - 1) * PAGE, current * PAGE);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const chips: { label: string; onClear: () => void }[] = [];
  if (q) chips.push({ label: `“${q}”`, onClear: () => setParams({ q: null }) });
  if (!fixedCategory && cat) chips.push({ label: categoryMap[cat]?.name ?? cat, onClear: () => setParams({ kategori: null, alt: null }) });
  if (!fixedSub && sub) chips.push({ label: categoryMap[cat]?.subcategories.find((s) => s.slug === sub)?.name ?? sub, onClear: () => setParams({ alt: null }) });
  brands.forEach((b) => chips.push({ label: b, onClear: () => setParams({ marka: brands.filter((x) => x !== b) }) }));
  tags.forEach((t) => chips.push({ label: tagLabel(t), onClear: () => setParams({ etiket: tags.filter((x) => x !== t) }) }));
  if (min || max) chips.push({ label: `${min ? formatCompact(min) : "0 ₺"} – ${max ? formatCompact(max) : "∞"}`, onClear: () => setParams({ min: null, max: null }) });
  if (stock) chips.push({ label: "Stoktakiler", onClear: () => setParams({ stok: null }) });
  if (rated) chips.push({ label: "4 yıldız ve üzeri", onClear: () => setParams({ puan: null }) });
  if (freeShip) chips.push({ label: "Kargo bedava", onClear: () => setParams({ kargo: null }) });

  const check = "size-4 rounded border-ink-300 accent-orange-500";

  const sidebar = (
    <div className="divide-y divide-ink-100 text-sm">
      {/* Kategoriler */}
      <Group title={fixedCategory ? "İlgili Kategoriler" : "Kategori"} open>
        {!fixedCategory ? (
          <ul className="space-y-1">
            {catOptions.map((c) => (
              <li key={c.slug}>
                <button onClick={() => setParams({ kategori: c.slug === cat ? null : c.slug, alt: null })} className={`flex w-full items-center justify-between rounded px-1 py-1 text-left hover:text-orange-600 ${c.slug === cat ? "font-bold text-orange-600" : "text-ink-700"}`}>
                  {c.name}
                  <span className="text-xs text-ink-400">({c.count})</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-1">
            <li>
              <Link href={`/kategori/${cat}`} className={`block rounded px-1 py-1 ${!sub ? "font-bold text-orange-600" : "text-ink-700 hover:text-orange-600"}`}>
                Tüm {categoryMap[cat]?.name}
              </Link>
            </li>
            {subOptions.map((s) => (
              <li key={s.slug}>
                <Link href={`/kategori/${cat}/${s.slug}`} className={`flex items-center justify-between rounded px-1 py-1 ${s.slug === sub ? "font-bold text-orange-600" : "text-ink-700 hover:text-orange-600"}`}>
                  {s.name}
                  <span className="text-xs text-ink-400">({s.count})</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Group>

      <Group title="Marka" open>
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-400" />
          <input value={brandQ} onChange={(e) => setBrandQ(e.target.value)} placeholder="Marka ara" className="h-9 w-full rounded-md border border-ink-200 pl-8 pr-2 text-sm outline-none focus:border-orange-500" />
        </div>
        <ul className="max-h-52 space-y-1 overflow-y-auto pr-1">
          {brandOptions
            .filter(([b]) => b.toLocaleLowerCase("tr-TR").includes(brandQ.toLocaleLowerCase("tr-TR")))
            .map(([b, n]) => {
              const on = brands.includes(b);
              return (
                <li key={b}>
                  <label className="flex cursor-pointer items-center gap-2 py-0.5">
                    <input type="checkbox" checked={on} onChange={() => setParams({ marka: on ? brands.filter((x) => x !== b) : [...brands, b] })} className={check} />
                    <span className="flex-1 text-ink-700">{b}</span>
                    <span className="text-xs text-ink-400">({n})</span>
                  </label>
                </li>
              );
            })}
        </ul>
      </Group>

      {showPrices && (
      <Group title="Fiyat" open>
        <ul className="space-y-1">
          {PRICE_RANGES.map(([a, b]) => {
            const on = min === a && max === b;
            return (
              <li key={`${a}-${b}`}>
                <label className="flex cursor-pointer items-center gap-2 py-0.5">
                  <input type="radio" name="fiyat" checked={on} onChange={() => setParams({ min: a ? String(a) : null, max: b ? String(b) : null })} className={check} />
                  <span className="text-ink-700">{b ? `${formatCompact(a)} – ${formatCompact(b)}` : `${formatCompact(a)} ve üzeri`}</span>
                </label>
              </li>
            );
          })}
        </ul>
        <PriceRange key={`${min}-${max}`} min={min} max={max} onApply={(a, b) => setParams({ min: a ? String(a) : null, max: b ? String(b) : null })} />
      </Group>
      )}

      <Group title="Özellikler" open>
        <ul className="space-y-1">
          {TAGS.map((t) => {
            const on = tags.includes(t);
            return (
              <li key={t}>
                <label className="flex cursor-pointer items-center gap-2 py-0.5">
                  <input type="checkbox" checked={on} onChange={() => setParams({ etiket: on ? tags.filter((x) => x !== t) : [...tags, t] })} className={check} />
                  <span className="text-ink-700">{tagLabel(t)}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </Group>

      <Group title="Diğer" open>
        <label className="flex cursor-pointer items-center gap-2 py-0.5">
          <input type="checkbox" checked={rated} onChange={() => setParams({ puan: rated ? null : "4" })} className={check} />
          <span className="inline-flex items-center gap-1 text-ink-700">
            <Star className="size-3.5 text-star" fill="currentColor" strokeWidth={0} /> 4 yıldız ve üzeri
          </span>
        </label>
        {showPrices && (
        <label className="flex cursor-pointer items-center gap-2 py-0.5">
          <input type="checkbox" checked={freeShip} onChange={() => setParams({ kargo: freeShip ? null : "1" })} className={check} />
          <span className="text-ink-700">Kargo bedava</span>
        </label>
        )}
        <label className="flex cursor-pointer items-center gap-2 py-0.5">
          <input type="checkbox" checked={stock} onChange={() => setParams({ stok: stock ? null : "1" })} className={check} />
          <span className="text-ink-700">Yalnızca stoktakiler</span>
        </label>
      </Group>
    </div>
  );

  return (
    <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:block">
        <div className="filter-scroll sticky top-[8.6rem] max-h-[calc(100vh-9.6rem)] overflow-y-auto overscroll-contain rounded-lg border border-ink-200 bg-white px-4">{sidebar}</div>
      </aside>

      {/* Mobil filtre çekmecesi */}
      <div className={`fixed inset-0 z-[70] lg:hidden ${drawer ? "" : "pointer-events-none"}`}>
        <div onClick={() => setDrawer(false)} className={`absolute inset-0 bg-ink-900/50 transition-opacity ${drawer ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-white transition-transform duration-300 ${drawer ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
            <h2 className="text-lg">Filtrele</h2>
            <button onClick={() => setDrawer(false)} aria-label="Kapat" className="grid size-9 place-items-center rounded-lg hover:bg-paper-100">
              <X className="size-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4">{sidebar}</div>
          <div className="border-t border-ink-100 p-3">
            <button onClick={() => setDrawer(false)} className="h-11 w-full rounded-lg bg-orange-500 font-semibold text-white">
              {filtered.length} ürünü göster
            </button>
          </div>
        </div>
      </div>

      <div className="min-w-0">
        {/* Üst çubuk */}
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2">
          <button onClick={() => setDrawer(true)} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-ink-200 px-3 text-sm font-semibold lg:hidden">
            <SlidersHorizontal className="size-4" /> Filtrele
            {chips.length > 0 && <span className="rounded-full bg-orange-500 px-1.5 text-[0.65rem] text-white">{chips.length}</span>}
          </button>
          <div className="hidden items-center gap-1.5 lg:flex">
            {[
              { k: "etiket", v: "indirim", l: "İndirimli" },
              { k: "etiket", v: "cok-satan", l: "Çok Satan" },
              { k: "kargo", v: "1", l: "Kargo Bedava" },
              { k: "puan", v: "4", l: "4★ ve üzeri" },
            ].filter(({ k, v }) => showPrices || (k !== "kargo" && v !== "indirim")).map(({ k, v, l }) => {
              const on = k === "etiket" ? tags.includes(v as ProductTag) : sp.get(k) === v;
              const toggle = () => (k === "etiket" ? setParams({ etiket: on ? tags.filter((x) => x !== v) : [...tags, v] }) : setParams({ [k]: on ? null : v }));
              return (
                <button key={l} onClick={toggle} className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${on ? "border-orange-500 bg-orange-50 text-orange-600" : "border-ink-200 text-ink-700 hover:border-orange-400"}`}>
                  {l}
                </button>
              );
            })}
          </div>
          <p className="ml-auto text-xs text-ink-500">
            <b className="text-ink-900">{filtered.length}</b> ürün
          </p>
          <div className="relative">
            <select value={sort} onChange={(e) => setParams({ sirala: e.target.value === "populer" ? null : e.target.value })} className="h-9 appearance-none rounded-md border border-ink-200 bg-white pl-3 pr-8 text-sm font-medium outline-none focus:border-orange-500">
              {SORTS.filter(([v]) => showPrices || !v.startsWith("fiyat")).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
          </div>
        </div>

        {chips.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {chips.map((c, i) => (
              <button key={i} onClick={c.onClear} className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 py-0.5 pl-2.5 pr-1.5 text-xs font-semibold text-orange-700 hover:bg-orange-100">
                {c.label} <X className="size-3" />
              </button>
            ))}
            <button onClick={() => router.push(pathname)} className="text-xs font-semibold text-ink-500 hover:underline">
              Temizle
            </button>
          </div>
        )}

        {slice.length === 0 ? (
          <div className="mt-4 flex flex-col items-center rounded-lg border border-ink-200 bg-white px-6 py-16 text-center">
            <Search className="size-8 text-ink-300" />
            <p className="mt-3 text-lg font-bold text-ink-900">Aradığınız kriterlere uygun ürün bulunamadı</p>
            <p className="mt-1 text-sm text-ink-500">Filtreleri gevşetmeyi veya farklı bir arama denemeyi deneyin.</p>
            <button onClick={() => router.push(pathname)} className="mt-4 h-10 rounded-lg bg-orange-500 px-4 text-sm font-semibold text-white">
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 xl:grid-cols-4">
            {slice.map((p, i) => (
              <ProductCard key={p.slug} p={p} priority={i < 4} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <nav aria-label="Sayfalar" className="mt-6 flex flex-wrap items-center justify-center gap-1">
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
                  <button key={n} onClick={() => { setParams({ sayfa: n === 1 ? null : String(n) }, false); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-current={n === current ? "page" : undefined} className={`grid size-9 place-items-center rounded-md border text-sm font-semibold ${n === current ? "border-orange-500 bg-orange-500 text-white" : "border-ink-200 bg-white text-ink-700 hover:border-orange-400"}`}>
                    {n}
                  </button>
                ),
              )}
          </nav>
        )}
      </div>
    </div>
  );
}

function Group({ title, open, children }: { title: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details open={open} className="group py-3">
      <summary className="flex cursor-pointer list-none items-center justify-between py-1 text-sm font-bold text-ink-900">
        {title}
        <ChevronDown className="size-4 text-ink-400 transition group-open:rotate-180" />
      </summary>
      <div className="pt-2">{children}</div>
    </details>
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
      className="mt-2 flex items-center gap-1.5"
    >
      <input inputMode="numeric" value={a} onChange={(e) => setA(e.target.value)} placeholder="En az" className="h-8 w-full rounded-md border border-ink-200 px-2 text-xs outline-none focus:border-orange-500" />
      <span className="text-ink-300">-</span>
      <input inputMode="numeric" value={b} onChange={(e) => setB(e.target.value)} placeholder="En çok" className="h-8 w-full rounded-md border border-ink-200 px-2 text-xs outline-none focus:border-orange-500" />
      <button type="submit" aria-label="Uygula" className="grid size-8 shrink-0 place-items-center rounded-md bg-orange-500 text-white">
        <Search className="size-3.5" />
      </button>
    </form>
  );
}
