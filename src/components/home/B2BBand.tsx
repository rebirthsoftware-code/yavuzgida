import { ArrowRight, FileText, Percent, Clock, Headset } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export function B2BBand() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="bg-grid relative overflow-hidden rounded-4xl bg-navy-900 px-6 py-12 text-white sm:px-12 lg:px-16 lg:py-16">
        <div className="absolute -right-24 -top-24 size-80 rounded-full bg-orange-500/30 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 size-80 rounded-full bg-sky-500/25 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">Kurumsal & toptan</p>
            <h2 className="mt-3 text-3xl leading-tight sm:text-[2.6rem]">Restoran, kafe ve marketler için özel fiyat listesi</h2>
            <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-white/70">
              Aylık alım hacminize göre kademeli fiyat, vade seçenekleri ve atanmış satış temsilcisi. Teklif formunu doldurun, 1 iş günü içinde dönelim.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/kurumsal" variant="accent" size="lg">
                Teklif al <ArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/iletisim" variant="white" size="lg">
                Temsilciye ulaş
              </ButtonLink>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {[
              { icon: Percent, t: "Kademeli fiyat", d: "Hacim arttıkça birim fiyat düşer" },
              { icon: Clock, t: "Vadeli ödeme", d: "Onaylı hesaplara 30 gün vade" },
              { icon: FileText, t: "E-fatura", d: "Tek faturada tüm kategoriler" },
              { icon: Headset, t: "Satış temsilcisi", d: "Siparişinizi tek kişiden takip edin" },
            ].map(({ icon: I, t, d }) => (
              <li key={t} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <I className="size-5 text-orange-400" />
                <p className="mt-3 font-semibold">{t}</p>
                <p className="mt-1 text-xs text-white/60">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
