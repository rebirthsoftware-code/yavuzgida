import type { Metadata } from "next";
import { CreditCard, Landmark, Building2, Info } from "lucide-react";
import { PageShell, Field, inputCls } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Ödeme" };

/** Ön tasarım: ödeme adımı arayüzü. Sipariş kaydı ve PayTR entegrasyonu sonraki aşamada bağlanacak. */
export default function CheckoutPage() {
  return (
    <PageShell title="Ödeme" crumb="Ödeme" lead="Teslimat ve fatura bilgilerinizi girin, ödeme yöntemini seçin.">
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-700">
        <Info className="mt-0.5 size-4 shrink-0" />
        Ön tasarım: Bu adım görsel taslaktır; sipariş kaydı ve kart ödemesi bir sonraki aşamada bağlanacaktır.
      </div>
      <form className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-6">
          <section className="rounded-xl border border-ink-200 bg-white p-6">
            <h2 className="text-lg font-bold">Teslimat bilgileri</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Ad Soyad"><input className={inputCls} /></Field>
              <Field label="Telefon"><input className={inputCls} inputMode="tel" placeholder="05xx xxx xx xx" /></Field>
              <Field label="E-posta"><input className={inputCls} inputMode="email" /></Field>
              <Field label="İl / İlçe"><input className={inputCls} /></Field>
              <div className="sm:col-span-2">
                <Field label="Adres"><textarea className={`${inputCls} h-24 py-2.5`} /></Field>
              </div>
            </div>
          </section>
          <section className="rounded-xl border border-ink-200 bg-white p-6">
            <h2 className="text-lg font-bold">Fatura</h2>
            <div className="mt-4 flex gap-2">
              {["Bireysel", "Kurumsal"].map((t, i) => (
                <label key={t} className={`flex-1 cursor-pointer rounded-lg border px-4 py-3 text-center text-sm font-semibold ${i === 1 ? "border-sky-700 bg-sky-50" : "border-ink-100"}`}>
                  <input type="radio" name="fatura" defaultChecked={i === 1} className="sr-only" />
                  {t}
                </label>
              ))}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Firma unvanı"><input className={inputCls} /></Field>
              <Field label="Vergi dairesi / No"><input className={inputCls} /></Field>
            </div>
          </section>
          <section className="rounded-xl border border-ink-200 bg-white p-6">
            <h2 className="text-lg font-bold">Ödeme yöntemi</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {[
                { icon: CreditCard, t: "Kredi kartı", d: "3D Secure", on: true },
                { icon: Landmark, t: "Havale / EFT", d: "Dekont sonrası onay" },
                { icon: Building2, t: "Kurumsal vade", d: "Onaylı hesaplar" },
              ].map(({ icon: I, t, d, on }) => (
                <label key={t} className={`cursor-pointer rounded-xl border p-4 ${on ? "border-sky-700 bg-sky-50" : "border-ink-100"}`}>
                  <input type="radio" name="odeme" defaultChecked={on} className="sr-only" />
                  <I className="size-5 text-sky-700" />
                  <p className="mt-2 text-sm font-semibold">{t}</p>
                  <p className="text-xs text-ink-500">{d}</p>
                </label>
              ))}
            </div>
          </section>
        </div>
        <aside className="rounded-xl border border-ink-200 bg-white p-6">
          <h2 className="text-lg font-bold">Özet</h2>
          <p className="mt-2 text-sm text-ink-500">Sepet tutarı ödeme adımında sunucuda yeniden hesaplanacaktır.</p>
          <Button type="button" variant="accent" size="lg" className="mt-5 w-full">
            Siparişi tamamla
          </Button>
          <p className="mt-3 text-center text-xs text-ink-400">Devam ederek mesafeli satış sözleşmesini kabul etmiş olursunuz.</p>
        </aside>
      </form>
    </PageShell>
  );
}
