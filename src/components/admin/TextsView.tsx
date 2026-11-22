"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { admin } from "@/lib/api";
import type { SiteConfig, FaqItem } from "@/lib/content";
import { TEXTS, TEXT_GROUPS, TEXT_DEFAULTS } from "@/lib/texts";
import { Field, Input, TextArea, Section, SaveButton, ErrorNote, useSaver } from "./fields";

export function TextsView({ token }: { token: string }) {
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
        <h1 className="text-2xl font-semibold text-ink-900 sm:text-3xl">Metinler</h1>
        <p className="text-xs text-ink-500">Sitedeki başlıklar, açıklamalar ve sayfa metinleri. Boş bırakılan alan varsayılan metne döner. Her grup ayrı kaydedilir.</p>
      </div>
      <TextsEditor token={token} initial={cfg.texts} />
      <FaqEditor token={token} initial={cfg.faq} />
    </div>
  );
}

function TextsEditor({ token, initial }: { token: string; initial: Record<string, string> }) {
  const [texts, setTexts] = useState<Record<string, string>>(initial);
  const [group, setGroup] = useState<(typeof TEXT_GROUPS)[number]>(TEXT_GROUPS[0]);
  const { state, error, run } = useSaver();
  const defs = TEXTS.filter((d) => d.group === group);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const clean = Object.fromEntries(Object.entries(texts).filter(([k, v]) => v !== undefined && v !== TEXT_DEFAULTS[k]));
        void run(() => admin.saveConfig(token, { texts: clean }));
      }}
    >
      <Section title="Site metinleri" desc="Bir gruptaki alanları düzenleyip kaydedin; diğer gruplar etkilenmez." footer={<><ErrorNote text={error} /><SaveButton state={state} /></>}>
        <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
          {TEXT_GROUPS.map((g) => (
            <button key={g} type="button" onClick={() => setGroup(g)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${group === g ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200 bg-white hover:border-ink-900"}`}>
              {g}
            </button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {defs.map((d) => {
            const v = texts[d.key] ?? "";
            const props = { value: v, placeholder: d.default, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setTexts({ ...texts, [d.key]: e.target.value }) };
            return (
              <Field key={d.key} label={d.label} className={d.multiline ? "sm:col-span-2" : undefined} hint={v && v !== d.default ? "Değiştirildi" : undefined}>
                {d.multiline ? <TextArea rows={3} {...props} /> : <Input {...props} />}
              </Field>
            );
          })}
        </div>
      </Section>
    </form>
  );
}

function FaqEditor({ token, initial }: { token: string; initial: FaqItem[] }) {
  const [faq, setFaq] = useState(initial);
  const { state, error, run } = useSaver();
  const upd = (i: number, patch: Partial<FaqItem>) => setFaq((s) => s.map((x, k) => (k === i ? { ...x, ...patch } : x)));
  const move = (i: number, dir: -1 | 1) =>
    setFaq((s) => {
      const n = [...s];
      const j = i + dir;
      if (j < 0 || j >= n.length) return s;
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void run(() => admin.saveConfig(token, { faq: faq.filter((f) => f.q.trim()) }));
      }}
    >
      <Section title="Sık sorulan sorular" desc="/sss sayfasındaki soru ve cevaplar." footer={<><ErrorNote text={error} /><button type="button" onClick={() => setFaq((f) => [...f, { q: "", a: "" }])} className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-ink-200 px-3 text-sm font-semibold hover:bg-paper-100"><Plus className="size-4" /> Soru ekle</button><SaveButton state={state} /></>}>
        <div className="divide-y divide-ink-100 overflow-hidden rounded-xl border border-ink-200">
          {faq.map((f, i) => (
            <div key={i} className="grid gap-2 p-3 sm:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <Input value={f.q} onChange={(e) => upd(i, { q: e.target.value })} placeholder="Soru" className="font-semibold" />
                <TextArea rows={2} value={f.a} onChange={(e) => upd(i, { a: e.target.value })} placeholder="Cevap" />
              </div>
              <div className="flex items-start gap-1 sm:flex-col">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Yukarı" className="grid size-8 place-items-center rounded-lg hover:bg-paper-100 disabled:opacity-30">
                  <ChevronUp className="size-4" />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === faq.length - 1} aria-label="Aşağı" className="grid size-8 place-items-center rounded-lg hover:bg-paper-100 disabled:opacity-30">
                  <ChevronDown className="size-4" />
                </button>
                <button type="button" onClick={() => setFaq((s) => s.filter((_, k) => k !== i))} aria-label="Sil" className="grid size-8 place-items-center rounded-lg text-red-600 hover:bg-red-100">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </form>
  );
}
