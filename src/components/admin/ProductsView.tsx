"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react";
import { Search, Plus, Upload, Download, Loader2, ChevronLeft, ChevronRight, EyeOff, Trash2, RotateCcw, ImageIcon, X } from "lucide-react";
import { admin, DEMO_ADMIN, type AdminProduct } from "@/lib/api";
import type { Product, ProductTag, Variant } from "@/lib/types";
import { useCategories } from "@/components/config/ConfigProvider";
import { allCategories } from "@/lib/content";
import type { Category } from "@/lib/types";
import { formatPrice, cn } from "@/lib/format";
import { PackArt } from "@/components/product/PackArt";
import { Drawer } from "./Drawer";
import { Field, Input, TextArea, Select, Toggle, NumberInput, SaveButton, ErrorNote, useSaver, inputCls } from "./fields";

const TAGS: { v: ProductTag; l: string }[] = [
  { v: "cok-satan", l: "Çok satan" },
  { v: "yeni", l: "Yeni" },
  { v: "indirim", l: "İndirim" },
  { v: "yerli", l: "Yerli üretim" },
  { v: "organik", l: "Organik" },
  { v: "glutensiz", l: "Glutensiz" },
  { v: "vegan", l: "Vegan" },
];
const FILTERS = [
  { v: "", l: "Tümü" },
  { v: "duzenlenen", l: "Düzenlenen" },
  { v: "yeni", l: "Eklenen" },
  { v: "stoksuz", l: "Stokta yok" },
  { v: "gizli", l: "Gizli" },
];

export function ProductsView({ token }: { token: string }) {
  const published = useCategories();
  const [categories, setCategories] = useState<Category[]>(published);
  useEffect(() => {
    admin.config(token).then((r) => r.status === "success" && setCategories(allCategories(r.config)));
  }, [token]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ products: AdminProduct[]; total: number; pages: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const r = await admin.products(token, { q, kategori: cat, filtre: filter, page });
    if (r.status === "success") setData({ products: r.products, total: r.total, pages: r.pages });
    else setError(r.reason ?? "Liste alınamadı");
  }, [token, q, cat, filter, page]);

  useEffect(() => {
    const t = window.setTimeout(() => void load(), 150);
    return () => window.clearTimeout(t);
  }, [load]);

  const onImport = async (file: File) => {
    setImporting(true);
    setImportMsg(null);
    const text = await file.text();
    const r = await admin.importCsv(token, text);
    if (r.status === "success") {
      setImportMsg(`${r.updated} ürün güncellendi, ${r.created} yeni ürün eklendi.${r.errors.length ? ` ${r.errors.length} satır atlandı: ${r.errors.slice(0, 3).join(" · ")}` : ""}`);
      void load();
    } else setImportMsg(r.reason ?? "İçe aktarma başarısız");
    setImporting(false);
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900 sm:text-3xl">Ürünler</h1>
          <p className="text-xs text-ink-500">{data ? `${data.total} ürün` : "Yükleniyor…"} · fiyat, stok, görsel ve açıklamaları düzenleyin; Excel ile toplu güncelleyin</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => e.target.files?.[0] && void onImport(e.target.files[0])} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={importing} className="inline-flex h-10 items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 text-sm font-semibold hover:bg-paper-100 disabled:opacity-60">
            {importing ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} CSV içe aktar
          </button>
          {!DEMO_ADMIN && (
            <a href={admin.exportUrl()} onClick={(e) => downloadWithToken(e, token)} className="inline-flex h-10 items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 text-sm font-semibold hover:bg-paper-100">
              <Download className="size-4" /> CSV dışa aktar
            </a>
          )}
          <button type="button" onClick={() => setCreating(true)} className="inline-flex h-10 items-center gap-2 rounded-lg bg-orange-500 px-4 text-sm font-bold text-white hover:bg-orange-600">
            <Plus className="size-4" /> Yeni ürün
          </button>
        </div>
      </div>
      {importMsg && <p className="rounded-lg bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-800">{importMsg}</p>}
      <p className="text-[0.7rem] text-ink-500">
        CSV sütunları: <code className="rounded bg-paper-100 px-1">slug; marka; urun_adi; kategori; alt_kategori; varyant_id; varyant; fiyat; eski_fiyat; stok; stok_kodu; miktar; birim; koli_ici; etiketler; gorsel; kisa_aciklama; aciklama; gizli</code> — her satır bir varyant, aynı slug satırları tek ürün. Mevcut ürünlerde boş hücreler değiştirilmez.
      </p>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Ürün adı, marka, slug veya stok kodu…"
            className={cn(inputCls, "pl-9")}
          />
        </div>
        <Select
          value={cat}
          onChange={(e) => {
            setCat(e.target.value);
            setPage(1);
          }}
          className="lg:w-64"
        >
          <option value="">Tüm kategoriler</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
        <div className="-mx-3 flex gap-1.5 overflow-x-auto px-3 pb-1 no-scrollbar sm:mx-0 sm:px-0">
          {FILTERS.map((f) => (
            <button
              key={f.v}
              type="button"
              onClick={() => {
                setFilter(f.v);
                setPage(1);
              }}
              className={cn("shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold", filter === f.v ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200 bg-white hover:border-ink-900")}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      <ErrorNote text={error} />

      {!data ? (
        <div className="flex h-40 items-center justify-center rounded-xl border border-ink-200 bg-white">
          <Loader2 className="size-5 animate-spin text-ink-400" />
        </div>
      ) : data.products.length === 0 ? (
        <div className="rounded-xl border border-ink-200 bg-white px-4 py-10 text-center text-sm text-ink-500">Bu filtrede ürün yok.</div>
      ) : (
        <>
          <ul className="space-y-2 md:hidden">
            {data.products.map((p) => (
              <li key={p.slug}>
                <button type="button" onClick={() => setSelected(p.slug)} className="flex w-full items-center gap-3 rounded-xl border border-ink-200 bg-white p-3 text-left active:bg-paper-50">
                  <Thumb p={p} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-ink-900">
                      {p.brand} {p.name}
                    </span>
                    <span className="block truncate text-xs text-ink-500">
                      {categories.find((c) => c.slug === p.category)?.name ?? p.category} · {p.variants.length} boy · {formatPrice(Math.min(...p.variants.map((v) => v.price)))}
                    </span>
                    <span className="mt-1 flex flex-wrap gap-1">
                      <Badges p={p} />
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-ink-400" />
                </button>
              </li>
            ))}
          </ul>
          <div className="hidden overflow-hidden rounded-xl border border-ink-200 bg-white md:block">
            <table className="w-full text-sm">
              <thead className="bg-paper-50 text-left text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink-500">
                <tr>
                  <th className="px-4 py-3">Ürün</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Boylar / Fiyat</th>
                  <th className="px-4 py-3">Stok</th>
                  <th className="px-4 py-3">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {data.products.map((p) => (
                  <tr key={p.slug} onClick={() => setSelected(p.slug)} className="cursor-pointer hover:bg-paper-50">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <Thumb p={p} />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-ink-900">
                            {p.brand} <span className="font-normal">{p.name}</span>
                          </p>
                          <p className="truncate font-mono text-[0.7rem] text-ink-400">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-ink-600">{categories.find((c) => c.slug === p.category)?.name ?? p.category}</td>
                    <td className="px-4 py-2.5 text-xs">
                      {p.variants.slice(0, 3).map((v) => (
                        <span key={v.id} className="mr-2 inline-block whitespace-nowrap">
                          {v.label}: <b>{formatPrice(v.price)}</b>
                        </span>
                      ))}
                      {p.variants.length > 3 && <span className="text-ink-400">+{p.variants.length - 3}</span>}
                    </td>
                    <td className="px-4 py-2.5 text-xs">
                      {p.variants.filter((v) => v.inStock).length}/{p.variants.length} boy
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        <Badges p={p} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.pages > 1 && (
            <div className="flex items-center justify-between rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm">
              <span className="text-ink-500">
                sayfa {page} / {data.pages}
              </span>
              <div className="flex gap-2">
                <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="grid size-9 place-items-center rounded-full border border-ink-200 disabled:opacity-40">
                  <ChevronLeft className="size-4" />
                </button>
                <button type="button" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)} className="grid size-9 place-items-center rounded-full border border-ink-200 disabled:opacity-40">
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {selected && <ProductEditor token={token} slug={selected} categories={categories} onClose={() => setSelected(null)} onChanged={() => void load()} />}
      {creating && <ProductEditor token={token} slug={null} categories={categories} onClose={() => setCreating(false)} onChanged={() => void load()} />}
    </div>
  );
}

async function downloadWithToken(e: React.MouseEvent<HTMLAnchorElement>, token: string) {
  e.preventDefault();
  const href = (e.currentTarget as HTMLAnchorElement).href;
  const res = await fetch(href, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) return;
  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `yavuz-urunler-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function Thumb({ p }: { p: Product }) {
  void 0;
  return (
    <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-lg border border-ink-100 bg-paper-50">
      {p.image ? <img src={p.image} alt="" className="h-full w-full object-cover" /> : <PackArt art={p.art} hue={p.hue} name={p.name} brand={p.brand} className="h-9 w-auto" />}
    </span>
  );
}

function Badges({ p }: { p: AdminProduct }) {
  return (
    <>
      {p.hidden && <span className="rounded bg-ink-900 px-1.5 py-0.5 text-[0.62rem] font-bold text-white">Gizli</span>}
      {p.custom && <span className="rounded bg-gold-100 px-1.5 py-0.5 text-[0.62rem] font-bold text-gold-600">Eklenen</span>}
      {!p.custom && p.patched && <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[0.62rem] font-bold text-sky-700">Düzenlendi</span>}
      {!p.variants.some((v) => v.inStock) && <span className="rounded bg-red-100 px-1.5 py-0.5 text-[0.62rem] font-bold text-red-600">Stok yok</span>}
    </>
  );
}

/* ------------------------------- Ürün düzenleyici ------------------------------- */
type Draft = {
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  short: string;
  description: string;
  image: string;
  tags: ProductTag[];
  hidden: boolean;
  variants: Variant[];
};

const emptyVariant = (k: number): Variant => ({ id: `v${k}`, label: "", sku: "", price: 0, amount: 1, amountUnit: "adet", inStock: true });

function ProductEditor({ token, slug, categories, onClose, onChanged }: { token: string; slug: string | null; categories: Category[]; onClose: () => void; onChanged: () => void }) {
  const isNew = slug === null;
  const [orig, setOrig] = useState<AdminProduct | null>(null);
  const [draft, setDraft] = useState<Draft | null>(isNew ? { name: "", brand: "", category: categories[0].slug, subcategory: categories[0].subcategories[0]?.slug ?? "", short: "", description: "", image: "", tags: [], hidden: false, variants: [emptyVariant(1)] } : null);
  const [removed, setRemoved] = useState<string[]>([]);
  const { state, error, run } = useSaver();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let alive = true;
    admin.product(token, slug).then((r) => {
      if (!alive) return;
      if (r.status === "success" && r.product) {
        setOrig(r.product);
        setDraft({ name: r.product.name, brand: r.product.brand, category: r.product.category, subcategory: r.product.subcategory, short: r.product.short, description: r.product.description, image: r.product.image ?? "", tags: r.product.tags, hidden: r.product.hidden, variants: r.product.variants.map((v) => ({ ...v })) });
      }
    });
    return () => {
      alive = false;
    };
  }, [token, slug]);

  const cat = categories.find((c) => c.slug === draft?.category);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d));
  const setVar = (i: number, patch: Partial<Variant>) => setDraft((d) => (d ? { ...d, variants: d.variants.map((v, k) => (k === i ? { ...v, ...patch } : v)) } : d));

  const save = async () => {
    if (!draft) return;
    if (!draft.name.trim() || !draft.category || draft.variants.some((v) => !v.label.trim())) {
      await run(async () => ({ status: "failed", reason: "Ürün adı, kategori ve her boy için ad zorunlu" }));
      return;
    }
    const ok = await run(async () => {
      if (isNew) return admin.createProduct(token, { name: draft.name, brand: draft.brand, category: draft.category, subcategory: draft.subcategory, short: draft.short, description: draft.description, tags: draft.tags, image: draft.image || undefined, variants: draft.variants });
      if (orig?.custom) {
        const full: Product = { ...orig, name: draft.name, brand: draft.brand, category: draft.category, subcategory: draft.subcategory, short: draft.short, description: draft.description, tags: draft.tags, variants: draft.variants, image: draft.image || undefined };
        return admin.patchProduct(token, slug!, { full, hidden: draft.hidden });
      }
      const patch = {
        name: draft.name,
        brand: draft.brand,
        category: draft.category,
        subcategory: draft.subcategory,
        short: draft.short,
        description: draft.description,
        tags: draft.tags,
        image: draft.image,
        hidden: draft.hidden,
        variants: [...draft.variants.map((v) => ({ ...v })), ...removed.map((id) => ({ id, remove: true as const }))],
      };
      return admin.patchProduct(token, slug!, patch);
    });
    if (ok) {
      onChanged();
      if (isNew) onClose();
    }
  };

  const reset = async () => {
    if (!slug) return;
    if (!window.confirm(orig?.custom ? "Bu ürün tamamen silinecek. Emin misiniz?" : "Bu üründeki tüm düzenlemeler silinip katalogdaki varsayılan hâline dönülecek. Emin misiniz?")) return;
    setBusy(true);
    await admin.resetProduct(token, slug);
    setBusy(false);
    onChanged();
    onClose();
  };

  return (
    <Drawer title={isNew ? "Yeni ürün" : (orig ? `${orig.brand} ${orig.name}` : slug ?? "")} subtitle={isNew ? "Mağazada ve panelde hemen yayınlanır" : orig ? `${orig.slug}${orig.custom ? " · yönetimde eklendi" : orig.patched ? " · düzenlenmiş" : ""}` : undefined} onClose={onClose}>
      {!draft ? (
        <div className="flex flex-1 items-center justify-center p-10">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
          className="space-y-5 p-4 sm:p-6"
        >
          <ErrorNote text={error} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Marka">
              <Input value={draft.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Yavuz Roastery" />
            </Field>
            <Field label="Ürün adı">
              <Input value={draft.name} onChange={(e) => set("name", e.target.value)} required />
            </Field>
            <Field label="Kategori">
              <Select
                value={draft.category}
                onChange={(e) => {
                  const c = categories.find((x) => x.slug === e.target.value);
                  set("category", e.target.value);
                  set("subcategory", c?.subcategories[0]?.slug ?? "");
                }}
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Alt kategori">
              <Select value={draft.subcategory} onChange={(e) => set("subcategory", e.target.value)}>
                {(cat?.subcategories ?? []).map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Görsel adresi (URL)" hint="Fotoğrafı bir adrese yükleyip bağlantısını yapıştırın; boş bırakılırsa üretilen ambalaj görseli gösterilir.">
            <div className="flex items-center gap-3">
              <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-lg border border-ink-200 bg-paper-50">{draft.image ? <img src={draft.image} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="size-5 text-ink-300" />}</span>
              <Input value={draft.image} onChange={(e) => set("image", e.target.value)} placeholder="https://…/urun.jpg" />
              {draft.image && (
                <button type="button" onClick={() => set("image", "")} aria-label="Görseli kaldır" className="grid size-9 shrink-0 place-items-center rounded-lg border border-ink-200 hover:bg-paper-100">
                  <X className="size-4" />
                </button>
              )}
            </div>
          </Field>

          <Field label="Kısa açıklama (kartlarda)">
            <Input value={draft.short} onChange={(e) => set("short", e.target.value)} maxLength={140} />
          </Field>
          <Field label="Açıklama">
            <TextArea rows={4} value={draft.description} onChange={(e) => set("description", e.target.value)} />
          </Field>

          <div>
            <p className="mb-1.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-500">Etiketler</p>
            <div className="flex flex-wrap gap-1.5">
              {TAGS.map((t) => {
                const on = draft.tags.includes(t.v);
                return (
                  <button key={t.v} type="button" onClick={() => set("tags", on ? draft.tags.filter((x) => x !== t.v) : [...draft.tags, t.v])} className={cn("rounded-full border px-3 py-1 text-xs font-semibold", on ? "border-orange-500 bg-orange-50 text-orange-700" : "border-ink-200 hover:border-ink-900")}>
                    {t.l}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-ink-200">
            <div className="flex items-center justify-between border-b border-ink-100 px-3 py-2">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-500">Boylar ve fiyatlar</p>
              <button type="button" onClick={() => set("variants", [...draft.variants, emptyVariant(draft.variants.length + 1)])} className="inline-flex h-8 items-center gap-1 rounded-lg border border-ink-200 px-2.5 text-xs font-semibold hover:bg-paper-100">
                <Plus className="size-3.5" /> Boy ekle
              </button>
            </div>
            <div className="divide-y divide-ink-100">
              {draft.variants.map((v, i) => (
                <div key={v.id} className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
                  <Field label="Boy adı" className="col-span-2 sm:col-span-1">
                    <Input value={v.label} onChange={(e) => setVar(i, { label: e.target.value })} placeholder="1 kg" required />
                  </Field>
                  <Field label="Fiyat (₺)">
                    <NumberInput value={v.price} onChange={(n) => setVar(i, { price: n ?? 0 })} step={0.5} min={0} />
                  </Field>
                  <Field label="Eski fiyat (₺)" hint="İndirim için">
                    <NumberInput value={v.oldPrice} onChange={(n) => setVar(i, { oldPrice: n })} step={0.5} min={0} />
                  </Field>
                  <Field label="Stok kodu">
                    <Input value={v.sku} onChange={(e) => setVar(i, { sku: e.target.value })} placeholder="otomatik" />
                  </Field>
                  <div className="col-span-2 flex items-end justify-between gap-2 sm:col-span-1 sm:flex-col sm:items-end">
                    <Toggle checked={v.inStock} onChange={(c) => setVar(i, { inStock: c })} label={v.inStock ? "Stokta" : "Tükendi"} />
                    {draft.variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          set("variants", draft.variants.filter((_, k) => k !== i));
                          if (orig?.variants.some((o) => o.id === v.id)) setRemoved((r) => [...r, v.id]);
                        }}
                        aria-label="Boyu sil"
                        className="grid size-8 place-items-center rounded-lg text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                  <div className="col-span-2 grid grid-cols-3 gap-2 sm:col-span-5">
                    <Field label="Miktar">
                      <NumberInput value={v.amount} onChange={(n) => setVar(i, { amount: n ?? 1 })} min={0} />
                    </Field>
                    <Field label="Birim">
                      <Select value={v.amountUnit} onChange={(e) => setVar(i, { amountUnit: e.target.value as Variant["amountUnit"] })}>
                        <option value="g">g</option>
                        <option value="ml">ml</option>
                        <option value="adet">adet</option>
                      </Select>
                    </Field>
                    <Field label="Koli içi adet">
                      <NumberInput value={v.caseQty} onChange={(n) => setVar(i, { caseQty: n })} min={0} />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!isNew && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-200 p-3">
              <Toggle checked={!draft.hidden} onChange={(c) => set("hidden", !c)} label={draft.hidden ? "Mağazada gizli" : "Mağazada yayında"} />
              <button type="button" onClick={() => void reset()} disabled={busy || (!orig?.custom && !orig?.patched)} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-600/40 px-3 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-40">
                {orig?.custom ? <Trash2 className="size-3.5" /> : <RotateCcw className="size-3.5" />} {orig?.custom ? "Ürünü sil" : "Varsayılana dön"}
              </button>
            </div>
          )}

          <div className="sticky bottom-0 -mx-4 flex items-center justify-between gap-3 border-t border-ink-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
            <span className="flex items-center gap-1.5 text-xs text-ink-500">{draft.hidden && <EyeOff className="size-3.5" />} {isNew ? "Kaydedince yayınlanır" : "Değişiklikler anında yayınlanır"}</span>
            <SaveButton state={state} label={isNew ? "Ürünü ekle" : "Kaydet"} />
          </div>
        </form>
      )}
    </Drawer>
  );
}
