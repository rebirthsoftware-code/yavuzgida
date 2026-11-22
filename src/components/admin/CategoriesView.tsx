"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff, GripVertical } from "lucide-react";
import { admin } from "@/lib/api";
import type { Category, Subcategory } from "@/lib/types";
import { categories as baseCategories } from "@/lib/categories";
import { slugify, softColor, type SiteConfig } from "@/lib/content";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { cn } from "@/lib/format";
import { Field, Input, TextArea, Select, Toggle, Section, SaveButton, ErrorNote, useSaver } from "./fields";

const ICONS = ["coffee", "droplets", "leaf", "cup-soda", "milk", "glass-water", "cake", "croissant", "cookie", "wrench", "package", "spray-can", "candy"];

export function CategoriesView({ token }: { token: string }) {
  const [cfg, setCfg] = useState<SiteConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    admin.config(token).then((r) => (r.status === "success" ? setCfg(r.config) : setError(r.reason ?? "Ayarlar alınamadı")));
  }, [token]);
  if (!cfg)
    return (
      <div className="mt-4 flex h-40 items-center justify-center rounded-xl border border-ink-200 bg-white">
        {error ? <ErrorNote text={error} /> : <Loader2 className="size-5 animate-spin text-ink-400" />}
      </div>
    );
  // Eski biçimdeki ad/açıklama/gizleme ayarlarını ağaca taşı
  const initial: Category[] = (cfg.categoryTree?.length ? cfg.categoryTree : baseCategories).map((c) => {
    const o = cfg.categories[c.slug];
    return o ? { ...c, name: o.name?.trim() || c.name, description: o.description?.trim() || c.description, hidden: c.hidden || Boolean(o.hidden) } : c;
  });
  return (
    <div className="mt-4 space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900 sm:text-3xl">Kategoriler</h1>
        <p className="text-xs text-ink-500">Kategori ve alt kategorileri ekleyin, adlandırın, sıralayın, gizleyin. Ürünler kategoriye slug ile bağlıdır; slug yalnızca yeni kategoride serbestçe belirlenir.</p>
      </div>
      <TreeEditor token={token} initial={initial} />
    </div>
  );
}

function TreeEditor({ token, initial }: { token: string; initial: Category[] }) {
  const [cats, setCats] = useState<Category[]>(initial.map((c) => ({ ...c, subcategories: c.subcategories.map((s) => ({ ...s })) })));
  const [open, setOpen] = useState<number | null>(null);
  const { state, error, run } = useSaver();
  const upd = (i: number, patch: Partial<Category>) => setCats((s) => s.map((c, k) => (k === i ? { ...c, ...patch } : c)));
  const move = (i: number, dir: -1 | 1) =>
    setCats((s) => {
      const n = [...s];
      const j = i + dir;
      if (j < 0 || j >= n.length) return s;
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
  const addCat = () => {
    setOpen(cats.length);
    const slug = `kategori-${Math.random().toString(36).slice(2, 6)}`;
    setCats((s) => [...s, { slug, name: "Yeni kategori", short: "", description: "", icon: "package", color: "#6b3e1e", colorSoft: softColor("#6b3e1e"), order: s.length + 1, subcategories: [] }]);
  };
  const save = () =>
    run(async () => {
      const seen = new Set<string>();
      for (const c of cats) {
        if (!c.name.trim()) return { status: "failed", reason: "Her kategorinin adı olmalı" };
        if (!c.slug || seen.has(c.slug)) return { status: "failed", reason: `Slug tekrarlı veya boş: ${c.name}` };
        seen.add(c.slug);
        const subSeen = new Set<string>();
        for (const s of c.subcategories) {
          if (!s.name.trim() || !s.slug || subSeen.has(s.slug)) return { status: "failed", reason: `${c.name}: alt kategori adı/slug hatalı` };
          subSeen.add(s.slug);
        }
      }
      const tree = cats.map((c, i) => ({ ...c, order: i + 1, colorSoft: softColor(c.color) }));
      return admin.saveConfig(token, { categoryTree: tree, categories: {} });
    });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void save();
      }}
    >
      <Section
        title="Kategori ağacı"
        desc="Sıra, mağazadaki menü ve ana sayfadaki kategori dizilimini belirler. Gizlenen kategorinin ürünleri mağazada ve aramada görünmez."
        footer={
          <>
            <ErrorNote text={error} />
            <button type="button" onClick={addCat} className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-ink-200 px-3 text-sm font-semibold hover:bg-paper-100">
              <Plus className="size-4" /> Kategori ekle
            </button>
            <SaveButton state={state} />
          </>
        }
      >
        <ul className="divide-y divide-ink-100 overflow-hidden rounded-xl border border-ink-200">
          {cats.map((c, i) => (
            <li key={i} className="bg-white">
              <div className="flex items-center gap-2 px-3 py-2">
                <GripVertical className="size-4 shrink-0 text-ink-300" />
                <span className="grid size-9 shrink-0 place-items-center rounded-full" style={{ background: softColor(c.color), color: c.color }}>
                  <CategoryIcon name={c.icon} className="size-4" />
                </span>
                <button type="button" onClick={() => setOpen(open === i ? null : i)} className="min-w-0 flex-1 text-left">
                  <span className={cn("block truncate text-sm font-bold", c.hidden ? "text-ink-400 line-through" : "text-ink-900")}>{c.name}</span>
                  <span className="block truncate text-xs text-ink-500">
                    {c.slug} · {c.subcategories.length} alt kategori
                  </span>
                </button>
                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" onClick={() => upd(i, { hidden: !c.hidden })} aria-label={c.hidden ? "Göster" : "Gizle"} className="grid size-8 place-items-center rounded-lg hover:bg-paper-100">
                    {c.hidden ? <EyeOff className="size-4 text-ink-400" /> : <Eye className="size-4" />}
                  </button>
                  <button type="button" onClick={() => { setOpen(null); move(i, -1); }} disabled={i === 0} aria-label="Yukarı" className="grid size-8 place-items-center rounded-lg hover:bg-paper-100 disabled:opacity-30">
                    <ChevronUp className="size-4" />
                  </button>
                  <button type="button" onClick={() => { setOpen(null); move(i, 1); }} disabled={i === cats.length - 1} aria-label="Aşağı" className="grid size-8 place-items-center rounded-lg hover:bg-paper-100 disabled:opacity-30">
                    <ChevronDown className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`"${c.name}" kategorisi silinsin mi? İçindeki ürünler kategori sayfalarında görünmez; önce ürünleri başka kategoriye taşımanız önerilir.`)) {
                        setOpen(null);
                        setCats((x) => x.filter((_, k) => k !== i));
                      }
                    }}
                    disabled={cats.length <= 1}
                    aria-label="Sil"
                    className="grid size-8 place-items-center rounded-lg text-red-600 hover:bg-red-100 disabled:opacity-30"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              {open === i && <CategoryForm c={c} isNew={!baseCategories.some((b) => b.slug === c.slug) && !initial.some((b) => b.slug === c.slug)} onChange={(patch) => upd(i, patch)} />}
            </li>
          ))}
        </ul>
      </Section>
    </form>
  );
}

function CategoryForm({ c, isNew, onChange }: { c: Category; isNew: boolean; onChange: (patch: Partial<Category>) => void }) {
  const updSub = (i: number, patch: Partial<Subcategory>) => onChange({ subcategories: c.subcategories.map((s, k) => (k === i ? { ...s, ...patch } : s)) });
  const moveSub = (i: number, dir: -1 | 1) => {
    const n = [...c.subcategories];
    const j = i + dir;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    onChange({ subcategories: n });
  };
  return (
    <div className="grid gap-3 border-t border-ink-100 bg-paper-50 p-3 sm:grid-cols-2">
      <Field label="Ad">
        <Input value={c.name} onChange={(e) => onChange(isNew ? { name: e.target.value, slug: slugify(e.target.value) || c.slug } : { name: e.target.value })} />
      </Field>
      <Field label="Slug (adres)" hint={isNew ? "Adres: /kategori/<slug>" : "Mevcut kategoride değiştirilemez (ürün bağlantıları bozulur)"}>
        <Input value={c.slug} onChange={(e) => onChange({ slug: slugify(e.target.value) })} disabled={!isNew} className="font-mono" />
      </Field>
      <Field label="Kısa açıklama (menüde)">
        <Input value={c.short} onChange={(e) => onChange({ short: e.target.value })} />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Simge">
          <Select value={c.icon} onChange={(e) => onChange({ icon: e.target.value })}>
            {ICONS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Renk">
          <input type="color" value={/^#[0-9a-f]{6}$/i.test(c.color) ? c.color : "#6b3e1e"} onChange={(e) => onChange({ color: e.target.value, colorSoft: softColor(e.target.value) })} className="h-10 w-full cursor-pointer rounded-lg border border-ink-200 bg-white p-1" />
        </Field>
      </div>
      <Field label="Açıklama (kategori sayfası ve SEO)" className="sm:col-span-2">
        <TextArea rows={2} value={c.description} onChange={(e) => onChange({ description: e.target.value })} />
      </Field>
      <div className="sm:col-span-2">
        <div className="mb-1.5 flex items-center justify-between">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-500">Alt kategoriler</p>
          <button type="button" onClick={() => onChange({ subcategories: [...c.subcategories, { slug: `alt-${Math.random().toString(36).slice(2, 6)}`, name: "" }] })} className="inline-flex h-8 items-center gap-1 rounded-lg border border-ink-200 bg-white px-2.5 text-xs font-semibold hover:bg-paper-100">
            <Plus className="size-3.5" /> Alt kategori ekle
          </button>
        </div>
        <div className="divide-y divide-ink-100 overflow-hidden rounded-lg border border-ink-200 bg-white">
          {c.subcategories.length === 0 && <p className="px-3 py-2 text-xs text-ink-400">Alt kategori yok.</p>}
          {c.subcategories.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2 px-3 py-2">
              <Input value={s.name} onChange={(e) => updSub(i, { name: e.target.value, ...(s.slug.startsWith("alt-") ? { slug: slugify(e.target.value) || s.slug } : {}) })} placeholder="Alt kategori adı" />
              <Input value={s.slug} onChange={(e) => updSub(i, { slug: slugify(e.target.value) })} className="font-mono text-xs" placeholder="slug" />
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => moveSub(i, -1)} disabled={i === 0} aria-label="Yukarı" className="grid size-8 place-items-center rounded-lg hover:bg-paper-100 disabled:opacity-30">
                  <ChevronUp className="size-4" />
                </button>
                <button type="button" onClick={() => moveSub(i, 1)} disabled={i === c.subcategories.length - 1} aria-label="Aşağı" className="grid size-8 place-items-center rounded-lg hover:bg-paper-100 disabled:opacity-30">
                  <ChevronDown className="size-4" />
                </button>
                <button type="button" onClick={() => onChange({ subcategories: c.subcategories.filter((_, k) => k !== i) })} aria-label="Sil" className="grid size-8 place-items-center rounded-lg text-red-600 hover:bg-red-100">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sm:col-span-2">
        <Toggle checked={!c.hidden} onChange={(on) => onChange({ hidden: !on })} label={c.hidden ? "Mağazada gizli" : "Mağazada yayında"} />
      </div>
    </div>
  );
}
