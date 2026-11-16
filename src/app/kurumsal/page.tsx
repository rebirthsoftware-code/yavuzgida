import type { Metadata } from "next";
import { Percent, Clock, FileText, Headset, Truck, CheckCircle2 } from "lucide-react";
import { PageShell, Field, inputCls } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Kurumsal & Toptan Satış", description: "Restoran, kafe, otel ve marketler için toptan fiyat listesi, vade ve atanmış satış temsilcisi." };

export default function Page() {
  return (
    <PageShell title="Kurumsal & toptan satış" crumb="Kurumsal" lead="Aylık alım hacminize göre kademeli fiyat, vade ve atanmış satış temsilcisi. Formu doldurun, 1 iş günü içinde fiyat listenizi gönderelim.">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-6">
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Percent, t: "Kademeli fiyat", d: "Koli/çuval ve aylık hacme göre birim fiyat düşer." },
              { icon: Clock, t: "Vadeli ödeme", d: "Onaylı hesaplara 30 güne kadar vade." },
              { icon: FileText, t: "E-fatura & cari", d: "Tek faturada tüm kategoriler, cari hesap ekstresi." },
              { icon: Headset, t: "Satış temsilcisi", d: "WhatsApp'tan sipariş, tek kişiden takip." },
              { icon: Truck, t: "Araçla teslimat", d: "Bölgesel rotalarda kendi araçlarımızla teslim." },
              { icon: CheckCircle2, t: "Numune", d: "Yeni ürünlerde ücretsiz numune." },
            ].map(({ icon: I, t, d }) => (
              <li key={t} className="rounded-2xl bg-white p-5 shadow-card">
                <I className="size-5 text-tangerine-600" />
                <p className="mt-3 font-semibold">{t}</p>
                <p className="mt-1 text-sm text-ink-500">{d}</p>
              </li>
            ))}
          </ul>
          <div className="rounded-2xl bg-green-900 p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-tangerine-400">Kimler için?</p>
            <p className="mt-2 text-lg font-semibold">Restoran, kafe, otel, yemekhane, market, bakkal, pastane ve e-ticaret satıcıları.</p>
          </div>
        </div>
        <form className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
          <h2 className="text-xl font-bold">Teklif formu</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Firma adı"><input className={inputCls} /></Field>
            <Field label="Yetkili"><input className={inputCls} /></Field>
            <Field label="Telefon"><input className={inputCls} inputMode="tel" /></Field>
            <Field label="E-posta"><input className={inputCls} inputMode="email" /></Field>
            <Field label="İşletme türü">
              <select className={inputCls}>
                {["Restoran", "Kafe", "Otel / Yemekhane", "Market / Bakkal", "Pastane", "E-ticaret", "Diğer"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
            <Field label="Aylık tahmini alım">
              <select className={inputCls}>
                {["10.000 ₺ altı", "10.000 – 50.000 ₺", "50.000 – 150.000 ₺", "150.000 ₺ üzeri"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="İhtiyaç listeniz" hint="Ürün adları ve yaklaşık miktarlar; dosya eklemek için e-posta ile de gönderebilirsiniz."><textarea className={`${inputCls} h-28 py-2.5`} /></Field>
            </div>
          </div>
          <Button type="button" variant="accent" size="lg" className="mt-5 w-full">
            Fiyat listesi iste
          </Button>
        </form>
      </div>
    </PageShell>
  );
}
