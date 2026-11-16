import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function CorporateNote() {
  return (
    <section className="grid gap-8 px-4 py-14 lg:grid-cols-[1fr_1.2fr] lg:px-6">
      <div>
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.24em] text-orange-600">Kurumsal & toptan</p>
        <h2 className="mt-2 text-4xl leading-tight text-navy-900">Tek faturada on iki kategori, tek temsilciden takip.</h2>
      </div>
      <div className="text-[0.98rem] leading-relaxed text-ink-700">
        <p>
          Restoran, kafe, otel ve marketler için aylık alım hacmine göre kademeli fiyat listesi hazırlıyoruz. Onaylı hesaplara 30 güne kadar vade, e-fatura ve cari ekstre; bölgesel rotalarda kendi araçlarımızla teslimat.
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-ink-200 pt-6 text-sm sm:grid-cols-4">
          {[
            ["Vade", "30 güne kadar"],
            ["Fatura", "E-fatura & cari"],
            ["Numune", "Ücretsiz"],
            ["Yanıt", "1 iş günü"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ink-400">{k}</dt>
              <dd className="mt-1 font-semibold text-navy-900">{v}</dd>
            </div>
          ))}
        </dl>
        <ButtonLink href="/kurumsal" variant="accent" className="mt-7">
          Fiyat listesi iste <ArrowRight className="size-4" />
        </ButtonLink>
      </div>
    </section>
  );
}
