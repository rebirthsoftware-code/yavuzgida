"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, ChevronUp, ChevronDown, Eye, EyeOff } from "lucide-react";
import { admin } from "@/lib/api";
import type { SiteConfig, HeroSlideCfg, TileCfg, ReferenceCfg, HeroAccent, TileStyle, TileIcon } from "@/lib/content";
import { cn } from "@/lib/format";
import { Field, Input, TextArea, Select, Toggle, Section, SaveButton, ErrorNote, useSaver } from "./fields";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const BUILTIN_IMAGES = [
  { v: "kahve", l: "Kahve çuvalı" },
  { v: "firsat", l: "Kafede latte" },
  { v: "pasta", l: "Çikolatalı pasta" },
  { v: "harman", l: "Çekirdek yakın plan" },
  { v: "panel", l: "Kafe iç mekân" },
];
const ACCENTS: { v: HeroAccent; l: string }[] = [
  { v: "gold", l: "Altın" },
  { v: "orange", l: "Turuncu" },
  { v: "pink", l: "Pembe" },
  { v: "sky", l: "Mavi" },
];
const STYLES: { v: TileStyle; l: string }[] = [
  { v: "green", l: "Yeşil" },
  { v: "orange", l: "Turuncu" },
  { v: "blue", l: "Mavi" },
  { v: "coal", l: "Siyah" },
  { v: "white", l: "Beyaz" },
];
const ICONS: { v: TileIcon; l: string }[] = [
  { v: "truck", l: "Kargo" },
  { v: "percent", l: "İndirim" },
  { v: "boxes", l: "Koli" },
  { v: "building", l: "Kurumsal" },
  { v: "store", l: "Mağaza" },
  { v: "coffee", l: "Kahve" },
];

const uid = () => Math.random().toString(36).slice(2, 8);
const thumb = (image: string) => (/^(https?:)?\/\//.test(image) || image.startsWith("/") ? image : `${BASE}/hero/${image}-t.webp`);

export function HomepageView({ token }: { token: string }) {
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
  return (
    <div className="mt-4 space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900 sm:text-3xl">Ana Sayfa</h1>
        <p className="text-xs text-ink-500">Duyuru çubuğu, slider, kampanya kutuları ve referanslar. Her bölüm ayrı kaydedilir; değişiklik anında yayınlanır.</p>
      </div>
      <AnnouncementSection token={token} initial={cfg.announcement} />
      <HeroSection token={token} initial={cfg.hero} />
      <TilesSection token={token} initial={cfg.tiles} />
      <ReferencesSection token={token} initial={cfg.references} initialStats={cfg.referenceStats} />
    </div>
  );
}

function AnnouncementSection({ token, initial }: { token: string; initial: SiteConfig["announcement"] }) {
  const [v, setV] = useState(initial);
  const { state, error, run } = useSaver();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void run(() => admin.saveConfig(token, { announcement: v }));
      }}
    >
      <Section title="Duyuru çubuğu" desc="Masaüstünde üst şeritte görünen kısa mesaj." footer={<><ErrorNote text={error} /><SaveButton state={state} /></>}>
        <Toggle checked={v.enabled} onChange={(c) => setV({ ...v, enabled: c })} label={v.enabled ? "Gösteriliyor" : "Gizli"} />
        <div className="grid gap-3 sm:grid-cols-[1fr_16rem]">
          <Field label="Metin">
            <Input value={v.text} onChange={(e) => setV({ ...v, text: e.target.value })} maxLength={120} />
          </Field>
          <Field label="Bağlantı">
            <Input value={v.href} onChange={(e) => setV({ ...v, href: e.target.value })} placeholder="/teslimat-ve-kargo" />
          </Field>
        </div>
      </Section>
    </form>
  );
}

function HeroSection({ token, initial }: { token: string; initial: HeroSlideCfg[] }) {
  const [slides, setSlides] = useState(initial);
  const [open, setOpen] = useState<string | null>(initial[0]?.id ?? null);
  const { state, error, run } = useSaver();
  const upd = (id: string, patch: Partial<HeroSlideCfg>) => setSlides((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const move = (i: number, dir: -1 | 1) =>
    setSlides((s) => {
      const n = [...s];
      const j = i + dir;
      if (j < 0 || j >= n.length) return s;
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
  const add = () => {
    const id = `s-${uid()}`;
    setSlides((s) => [...s, { id, enabled: true, image: "kahve", tab: "Yeni slayt", tabSub: "", kicker: "", title: "Başlık *vurgulu bölüm*", text: "", chips: [], ctaLabel: "İncele", ctaHref: "/urunler", accent: "gold" }]);
    setOpen(id);
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void run(() => admin.saveConfig(token, { hero: slides }));
      }}
    >
      <Section title="Slider" desc="Başlıkta *yıldızlar* arasına aldığınız bölüm vurgu rengiyle gösterilir. Fotoğraf için yerleşik görsellerden birini seçin veya kendi fotoğrafınızın adresini yapıştırın (önerilen 1920×820)." footer={<><ErrorNote text={error} /><button type="button" onClick={add} className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-ink-200 px-3 text-sm font-semibold hover:bg-paper-100"><Plus className="size-4" /> Slayt ekle</button><SaveButton state={state} /></>}>
        <ul className="divide-y divide-ink-100 overflow-hidden rounded-xl border border-ink-200">
          {slides.map((s, i) => (
            <li key={s.id} className="bg-white">
              <div className="flex items-center gap-3 px-3 py-2">
                <img src={thumb(s.image)} alt="" className="h-10 w-14 shrink-0 rounded-md object-cover" />
                <button type="button" onClick={() => setOpen(open === s.id ? null : s.id)} className="min-w-0 flex-1 text-left">
                  <span className={cn("block truncate text-sm font-bold", s.enabled ? "text-ink-900" : "text-ink-400 line-through")}>{s.tab || "Adsız slayt"}</span>
                  <span className="block truncate text-xs text-ink-500">{s.title.replace(/\*/g, "")}</span>
                </button>
                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" onClick={() => upd(s.id, { enabled: !s.enabled })} aria-label={s.enabled ? "Gizle" : "Göster"} className="grid size-8 place-items-center rounded-lg hover:bg-paper-100">
                    {s.enabled ? <Eye className="size-4" /> : <EyeOff className="size-4 text-ink-400" />}
                  </button>
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Yukarı" className="grid size-8 place-items-center rounded-lg hover:bg-paper-100 disabled:opacity-30">
                    <ChevronUp className="size-4" />
                  </button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === slides.length - 1} aria-label="Aşağı" className="grid size-8 place-items-center rounded-lg hover:bg-paper-100 disabled:opacity-30">
                    <ChevronDown className="size-4" />
                  </button>
                  <button type="button" onClick={() => setSlides((x) => x.filter((y) => y.id !== s.id))} disabled={slides.length <= 1} aria-label="Sil" className="grid size-8 place-items-center rounded-lg text-red-600 hover:bg-red-100 disabled:opacity-30">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              {open === s.id && (
                <div className="grid gap-3 border-t border-ink-100 bg-paper-50 p-3 sm:grid-cols-2">
                  <Field label="Sekme adı">
                    <Input value={s.tab} onChange={(e) => upd(s.id, { tab: e.target.value })} />
                  </Field>
                  <Field label="Sekme alt yazısı">
                    <Input value={s.tabSub} onChange={(e) => upd(s.id, { tabSub: e.target.value })} />
                  </Field>
                  <Field label="Üst etiket">
                    <Input value={s.kicker} onChange={(e) => upd(s.id, { kicker: e.target.value })} />
                  </Field>
                  <Field label="Vurgu rengi">
                    <Select value={s.accent} onChange={(e) => upd(s.id, { accent: e.target.value as HeroAccent })}>
                      {ACCENTS.map((a) => (
                        <option key={a.v} value={a.v}>
                          {a.l}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Başlık" className="sm:col-span-2" hint="Örn. Kavurma tazeliğinde *espresso* çekirdekleri">
                    <Input value={s.title} onChange={(e) => upd(s.id, { title: e.target.value })} />
                  </Field>
                  <Field label="Açıklama" className="sm:col-span-2">
                    <TextArea rows={2} value={s.text} onChange={(e) => upd(s.id, { text: e.target.value })} />
                  </Field>
                  <Field label="Rozetler (virgülle ayırın, en fazla 3)" className="sm:col-span-2">
                    <Input value={s.chips.join(", ")} onChange={(e) => upd(s.id, { chips: e.target.value.split(",").map((x) => x.trim()).filter(Boolean).slice(0, 3) })} />
                  </Field>
                  <Field label="Buton yazısı">
                    <Input value={s.ctaLabel} onChange={(e) => upd(s.id, { ctaLabel: e.target.value })} />
                  </Field>
                  <Field label="Buton bağlantısı">
                    <Input value={s.ctaHref} onChange={(e) => upd(s.id, { ctaHref: e.target.value })} placeholder="/kategori/kahve" />
                  </Field>
                  <Field label="İkinci bağlantı yazısı">
                    <Input value={s.altLabel ?? ""} onChange={(e) => upd(s.id, { altLabel: e.target.value })} />
                  </Field>
                  <Field label="İkinci bağlantı adresi">
                    <Input value={s.altHref ?? ""} onChange={(e) => upd(s.id, { altHref: e.target.value })} />
                  </Field>
                  <Field label="Fotoğraf">
                    <Select value={BUILTIN_IMAGES.some((b) => b.v === s.image) ? s.image : "url"} onChange={(e) => upd(s.id, { image: e.target.value === "url" ? "https://" : e.target.value })}>
                      {BUILTIN_IMAGES.map((b) => (
                        <option key={b.v} value={b.v}>
                          {b.l}
                        </option>
                      ))}
                      <option value="url">Kendi fotoğrafım (URL)</option>
                    </Select>
                  </Field>
                  {!BUILTIN_IMAGES.some((b) => b.v === s.image) && (
                    <Field label="Fotoğraf adresi">
                      <Input value={s.image} onChange={(e) => upd(s.id, { image: e.target.value })} placeholder="https://…/slider.jpg" />
                    </Field>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </Section>
    </form>
  );
}

function TilesSection({ token, initial }: { token: string; initial: TileCfg[] }) {
  const [tiles, setTiles] = useState(initial);
  const { state, error, run } = useSaver();
  const upd = (id: string, patch: Partial<TileCfg>) => setTiles((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void run(() => admin.saveConfig(token, { tiles }));
      }}
    >
      <Section title="Kampanya kutuları" desc="Ana sayfadaki dört renkli kutu." footer={<><ErrorNote text={error} /><button type="button" onClick={() => setTiles((t) => [...t, { id: `t-${uid()}`, title: "Yeni kutu", text: "", href: "/urunler", style: "white", icon: "store" }])} className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-ink-200 px-3 text-sm font-semibold hover:bg-paper-100"><Plus className="size-4" /> Kutu ekle</button><SaveButton state={state} /></>}>
        <div className="grid gap-3 md:grid-cols-2">
          {tiles.map((t) => (
            <div key={t.id} className="grid grid-cols-2 gap-2 rounded-xl border border-ink-200 p-3">
              <Field label="Başlık" className="col-span-2">
                <Input value={t.title} onChange={(e) => upd(t.id, { title: e.target.value })} />
              </Field>
              <Field label="Alt yazı" className="col-span-2">
                <Input value={t.text} onChange={(e) => upd(t.id, { text: e.target.value })} />
              </Field>
              <Field label="Bağlantı" className="col-span-2">
                <Input value={t.href} onChange={(e) => upd(t.id, { href: e.target.value })} />
              </Field>
              <Field label="Renk">
                <Select value={t.style} onChange={(e) => upd(t.id, { style: e.target.value as TileStyle })}>
                  {STYLES.map((s) => (
                    <option key={s.v} value={s.v}>
                      {s.l}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Simge">
                <Select value={t.icon} onChange={(e) => upd(t.id, { icon: e.target.value as TileIcon })}>
                  {ICONS.map((s) => (
                    <option key={s.v} value={s.v}>
                      {s.l}
                    </option>
                  ))}
                </Select>
              </Field>
              <button type="button" onClick={() => setTiles((x) => x.filter((y) => y.id !== t.id))} className="col-span-2 inline-flex h-8 items-center justify-center gap-1 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-100">
                <Trash2 className="size-3.5" /> Kaldır
              </button>
            </div>
          ))}
        </div>
      </Section>
    </form>
  );
}

function ReferencesSection({ token, initial, initialStats }: { token: string; initial: ReferenceCfg[]; initialStats: { value: string; label: string }[] }) {
  const [refs, setRefs] = useState(initial);
  const [stats, setStats] = useState(initialStats);
  const { state, error, run } = useSaver();
  const upd = (i: number, patch: Partial<ReferenceCfg>) => setRefs((s) => s.map((x, k) => (k === i ? { ...x, ...patch } : x)));
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void run(() => admin.saveConfig(token, { references: refs, referenceStats: stats }));
      }}
    >
      <Section title="Çalıştığımız mağazalar" desc="Referans listesi ve üstteki dört sayı. Logo adresi boşsa baş harflerden rozet gösterilir." footer={<><ErrorNote text={error} /><button type="button" onClick={() => setRefs((r) => [...r, { name: "", city: "", type: "" }])} className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-ink-200 px-3 text-sm font-semibold hover:bg-paper-100"><Plus className="size-4" /> Referans ekle</button><SaveButton state={state} /></>}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="rounded-lg border border-ink-200 p-2">
              <Input value={s.value} onChange={(e) => setStats(stats.map((x, k) => (k === i ? { ...x, value: e.target.value } : x)))} className="font-bold" />
              <Input value={s.label} onChange={(e) => setStats(stats.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)))} className="mt-1 text-xs" />
            </div>
          ))}
        </div>
        <div className="overflow-hidden rounded-xl border border-ink-200">
          <div className="hidden grid-cols-[1.3fr_1fr_1.3fr_5rem_1.3fr_2rem] gap-2 bg-paper-50 px-3 py-2 text-[0.65rem] font-bold uppercase tracking-wider text-ink-500 sm:grid">
            <span>İşletme</span>
            <span>Şehir</span>
            <span>Tür</span>
            <span>Yıl</span>
            <span>Logo URL</span>
            <span />
          </div>
          <div className="divide-y divide-ink-100">
            {refs.map((r, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-[1.3fr_1fr_1.3fr_5rem_1.3fr_2rem] sm:items-center">
                <Input value={r.name} onChange={(e) => upd(i, { name: e.target.value })} placeholder="İşletme adı" />
                <Input value={r.city} onChange={(e) => upd(i, { city: e.target.value })} placeholder="Şehir" />
                <Input value={r.type} onChange={(e) => upd(i, { type: e.target.value })} placeholder="Kafe · 3 şube" />
                <Input value={r.since ?? ""} onChange={(e) => upd(i, { since: e.target.value ? Number(e.target.value) : undefined })} placeholder="2021" inputMode="numeric" />
                <Input value={r.logo ?? ""} onChange={(e) => upd(i, { logo: e.target.value })} placeholder="https://…/logo.png" />
                <button type="button" onClick={() => setRefs((x) => x.filter((_, k) => k !== i))} aria-label="Sil" className="grid size-9 place-items-center justify-self-end rounded-lg text-red-600 hover:bg-red-100">
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </form>
  );
}
