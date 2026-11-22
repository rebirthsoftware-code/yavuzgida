"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { admin, DEMO_ADMIN } from "@/lib/api";
import { legalTitles, type SiteConfig, type LegalKey } from "@/lib/content";
import { categories } from "@/lib/categories";
import { demoReset } from "@/lib/demo-content";
import { Field, Input, TextArea, Toggle, NumberInput, Section, SaveButton, ErrorNote, useSaver } from "./fields";

export function SettingsView({ token }: { token: string }) {
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
        <h1 className="text-2xl font-semibold text-ink-900 sm:text-3xl">Ayarlar</h1>
        <p className="text-xs text-ink-500">İletişim, kargo kuralları, banka bilgileri, kategoriler ve yasal metinler. Her bölüm ayrı kaydedilir.</p>
      </div>
      <ContactSection token={token} initial={cfg} />
      <CommerceSection token={token} initial={cfg.commerce} />
      <BankSection token={token} initial={cfg.bank} legal={cfg.legal} />
      <CategoriesSection token={token} initial={cfg.categories} />
      <BlendSection token={token} initial={cfg.blend} />
      <LegalSection token={token} initial={cfg.legal.texts} legal={cfg.legal} />
      {DEMO_ADMIN && (
        <Section title="Demo" desc="Bu tarayıcıdaki tüm yönetim düzenlemelerini (ürün, slider, ayar) siler ve siteyi varsayılana döndürür.">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Demo düzenlemeleri silinsin mi?")) {
                demoReset();
                window.location.reload();
              }
            }}
            className="inline-flex h-10 items-center rounded-lg border border-red-600/40 px-4 text-sm font-bold text-red-600 hover:bg-red-100"
          >
            Demo verisini sıfırla
          </button>
        </Section>
      )}
    </div>
  );
}

function ContactSection({ token, initial }: { token: string; initial: SiteConfig }) {
  const [c, setC] = useState(initial.contact);
  const [s, setS] = useState(initial.social);
  const { state, error, run } = useSaver();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void run(() => admin.saveConfig(token, { contact: c, social: s }));
      }}
    >
      <Section title="İletişim ve sosyal medya" desc="Üst şerit, footer, iletişim sayfası, WhatsApp düğmesi ve sipariş fişlerinde kullanılır." footer={<><ErrorNote text={error} /><SaveButton state={state} /></>}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Telefon">
            <Input value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} placeholder="0212 000 00 00" />
          </Field>
          <Field label="WhatsApp numarası" hint="Ülke koduyla, boşluksuz: 905382120317. Birden fazla hat için virgülle ayırın.">
            <Input value={c.whatsapp} onChange={(e) => setC({ ...c, whatsapp: e.target.value })} />
          </Field>
          <Field label="E-posta">
            <Input type="email" value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} />
          </Field>
          <Field label="Çalışma saatleri">
            <Input value={c.workingHours} onChange={(e) => setC({ ...c, workingHours: e.target.value })} />
          </Field>
          <Field label="Adres" className="sm:col-span-2">
            <TextArea rows={2} value={c.address} onChange={(e) => setC({ ...c, address: e.target.value })} />
          </Field>
          <Field label="Instagram">
            <Input value={s.instagram} onChange={(e) => setS({ ...s, instagram: e.target.value })} placeholder="https://instagram.com/…" />
          </Field>
          <Field label="Facebook">
            <Input value={s.facebook} onChange={(e) => setS({ ...s, facebook: e.target.value })} placeholder="https://facebook.com/…" />
          </Field>
        </div>
      </Section>
    </form>
  );
}

function CommerceSection({ token, initial }: { token: string; initial: SiteConfig["commerce"] }) {
  const [v, setV] = useState(initial);
  const { state, error, run } = useSaver();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void run(() => admin.saveConfig(token, { commerce: v }));
      }}
    >
      <Section title="Kargo ve ödeme kuralları" desc="Sepet, ödeme ve ürün sayfalarındaki kargo hesabı bu değerlerle yapılır." footer={<><ErrorNote text={error} /><SaveButton state={state} /></>}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Ücretsiz kargo eşiği (₺)">
            <NumberInput value={v.freeShippingThreshold} onChange={(n) => setV({ ...v, freeShippingThreshold: n ?? 0 })} min={0} />
          </Field>
          <Field label="Kargo ücreti (₺)">
            <NumberInput value={v.shippingFee} onChange={(n) => setV({ ...v, shippingFee: n ?? 0 })} min={0} />
          </Field>
          <Field label="Teslimat süresi">
            <Input value={v.deliveryEstimate} onChange={(e) => setV({ ...v, deliveryEstimate: e.target.value })} placeholder="1–3 iş günü" />
          </Field>
          <Field label="Aynı gün kargo saati">
            <NumberInput value={v.cutoffHour} onChange={(n) => setV({ ...v, cutoffHour: n ?? 14 })} min={0} />
          </Field>
        </div>
        <Toggle checked={v.cardPayments} onChange={(c) => setV({ ...v, cardPayments: c })} label={v.cardPayments ? "Kredi kartı ile ödeme açık" : "Kredi kartı ile ödeme kapalı (yalnızca havale)"} />
      </Section>
    </form>
  );
}

function BankSection({ token, initial, legal }: { token: string; initial: SiteConfig["bank"]; legal: SiteConfig["legal"] }) {
  const [b, setB] = useState(initial);
  const [l, setL] = useState({ companyName: legal.companyName, mersis: legal.mersis });
  const { state, error, run } = useSaver();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void run(() => admin.saveConfig(token, { bank: b, legal: { ...legal, ...l } }));
      }}
    >
      <Section title="Firma ve banka bilgileri" desc="Havale/EFT ekranı, sipariş fişi ve footer." footer={<><ErrorNote text={error} /><SaveButton state={state} /></>}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Firma unvanı">
            <Input value={l.companyName} onChange={(e) => setL({ ...l, companyName: e.target.value })} />
          </Field>
          <Field label="MERSİS no">
            <Input value={l.mersis} onChange={(e) => setL({ ...l, mersis: e.target.value })} />
          </Field>
          <Field label="Banka">
            <Input value={b.bankName} onChange={(e) => setB({ ...b, bankName: e.target.value })} />
          </Field>
          <Field label="Hesap sahibi">
            <Input value={b.holder} onChange={(e) => setB({ ...b, holder: e.target.value })} />
          </Field>
          <Field label="IBAN" className="sm:col-span-2">
            <Input value={b.iban} onChange={(e) => setB({ ...b, iban: e.target.value })} className="font-mono" />
          </Field>
        </div>
      </Section>
    </form>
  );
}

function CategoriesSection({ token, initial }: { token: string; initial: SiteConfig["categories"] }) {
  const [v, setV] = useState(initial);
  const { state, error, run } = useSaver();
  const upd = (slug: string, patch: { hidden?: boolean; name?: string; description?: string }) => setV((s) => ({ ...s, [slug]: { ...(s[slug] ?? {}), ...patch } }));
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void run(() => admin.saveConfig(token, { categories: v }));
      }}
    >
      <Section title="Kategoriler" desc="Kategori adını ve açıklamasını değiştirin veya kategoriyi geçici olarak gizleyin. Boş bırakılan alanlar varsayılanı kullanır." footer={<><ErrorNote text={error} /><SaveButton state={state} /></>}>
        <div className="divide-y divide-ink-100 overflow-hidden rounded-xl border border-ink-200">
          {categories.map((c) => {
            const o = v[c.slug] ?? {};
            return (
              <div key={c.slug} className="grid gap-2 p-3 sm:grid-cols-[12rem_1fr_1.6fr] sm:items-center">
                <Toggle checked={!o.hidden} onChange={(on) => upd(c.slug, { hidden: !on })} label={c.name} />
                <Input value={o.name ?? ""} onChange={(e) => upd(c.slug, { name: e.target.value })} placeholder={`Görünen ad (${c.name})`} />
                <Input value={o.description ?? ""} onChange={(e) => upd(c.slug, { description: e.target.value })} placeholder="Açıklama (SEO ve kategori başlığı)" />
              </div>
            );
          })}
        </div>
      </Section>
    </form>
  );
}

function BlendSection({ token, initial }: { token: string; initial: SiteConfig["blend"] }) {
  const [v, setV] = useState(initial);
  const { state, error, run } = useSaver();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void run(() => admin.saveConfig(token, { blend: v }));
      }}
    >
      <Section title="Özel harman" desc="Özel harman sayfasındaki minimum miktar ve süre bilgileri." footer={<><ErrorNote text={error} /><SaveButton state={state} /></>}>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Minimum sipariş (kg)">
            <NumberInput value={v.minKg} onChange={(n) => setV({ ...v, minKg: n ?? 10 })} min={1} />
          </Field>
          <Field label="Hazırlık süresi">
            <Input value={v.leadTime} onChange={(e) => setV({ ...v, leadTime: e.target.value })} />
          </Field>
          <Field label="Not">
            <Input value={v.note} onChange={(e) => setV({ ...v, note: e.target.value })} />
          </Field>
        </div>
      </Section>
    </form>
  );
}

function LegalSection({ token, initial, legal }: { token: string; initial: Record<LegalKey, string>; legal: SiteConfig["legal"] }) {
  const [texts, setTexts] = useState(initial);
  const [active, setActive] = useState<LegalKey>("kvkk");
  const { state, error, run } = useSaver();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void run(() => admin.saveConfig(token, { legal: { ...legal, texts } }));
      }}
    >
      <Section title="Yasal metinler" desc="Boş satırla ayrılan paragraflar; '## ' ile başlayan satır başlık, '- ' ile başlayan satırlar madde olur." footer={<><ErrorNote text={error} /><SaveButton state={state} /></>}>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(legalTitles) as LegalKey[]).map((k) => (
            <button key={k} type="button" onClick={() => setActive(k)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${active === k ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200 bg-white hover:border-ink-900"}`}>
              {legalTitles[k]}
            </button>
          ))}
        </div>
        <TextArea rows={14} value={texts[active]} onChange={(e) => setTexts({ ...texts, [active]: e.target.value })} className="font-mono text-xs" />
      </Section>
    </form>
  );
}
