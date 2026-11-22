import type { Metadata } from "next";
import { Percent, Clock, FileText, Headset, Truck, CheckCircle2 } from "lucide-react";
import { PageShell, Field, inputCls } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { References } from "@/components/home/References";
import { getSiteConfig } from "@/lib/site-config";
import { t } from "@/lib/content";

export const metadata: Metadata = { title: "Kurumsal & Toptan Satış", description: "Restoran, kafe, otel ve marketler için toptan fiyat listesi, vade ve atanmış satış temsilcisi." };

export default async function Page() {
  const config = await getSiteConfig();
  const tx = (k: string) => t(config, k);
  const icons = [Percent, Clock, FileText, Headset, Truck, CheckCircle2];
  return (
    <PageShell title={tx("corp.title")} crumb="Kurumsal" lead={tx("corp.lead")}>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-6">
          <ul className="grid gap-3 sm:grid-cols-2">
            {icons.map((I, i) => ({ icon: I, t: tx(`corp.f${i + 1}.t`), d: tx(`corp.f${i + 1}.d`) })).map(({ icon: I, t, d }) => (
              <li key={t} className="rounded-lg border border-ink-200 bg-white p-5">
                <I className="size-5 text-orange-500" />
                <p className="mt-3 font-semibold">{t}</p>
                <p className="mt-1 text-sm text-ink-500">{d}</p>
              </li>
            ))}
          </ul>
          <div className="rounded-lg bg-navy-900 p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">{tx("corp.who.title")}</p>
            <p className="mt-2 text-lg font-semibold">{tx("corp.who.text")}</p>
          </div>
        </div>
        <form className="rounded-lg border border-ink-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold">Teklif formu</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Firma adı"><input className={inputCls} /></Field>
            <Field label="Yetkili"><input className={inputCls} /></Field>
            <Field label="Telefon"><input className={inputCls} inputMode="tel" /></Field>
            <Field label="E-posta"><input className={inputCls} inputMode="email" /></Field>
            <Field label="İşletme türü">
              <select className={inputCls}>
                {["Kafe / Coffee Shop", "Zincir Kafe", "Restoran", "Otel", "Pastane", "Ofis", "Diğer"].map((o) => (
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
          <Button type="button" variant="primary" size="lg" className="mt-5 w-full">
            Fiyat listesi iste
          </Button>
        </form>
      </div>
      <div className="mt-10">
        <References compact />
      </div>
    </PageShell>
  );
}
