import Link from "next/link";
import { MessageCircle, ClipboardList, Coffee, ArrowRight } from "lucide-react";

/** Mevcut müşteri modunda fırsat bölümleri yerine gösterilen yönlendirme bandı. */
export function ExistingCustomerBand() {
  const steps = [
    { icon: ClipboardList, t: "Ürünleri listeye ekleyin", d: "Kataloğu gezin, boy ve adedi seçin; fiyat göstermeden listeniz oluşsun." },
    { icon: MessageCircle, t: "WhatsApp'tan gönderin", d: "Listem sayfasında firma adınızı yazın, tek tıkla hazır mesaj bize ulaşsın." },
    { icon: Coffee, t: "Özel harmanınızı tanımlayın", d: "Orijin oranlarını belirleyin; kendi markanızla kavurup paketleyelim." },
  ];
  return (
    <section className="rounded-xl bg-coal-900 p-5 text-white sm:p-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">Mevcut müşteri</p>
          <h2 className="mt-1 text-2xl font-extrabold">Üç adımda sipariş</h2>
        </div>
        <Link href="/ozel-harman" className="inline-flex items-center gap-1.5 rounded-lg border border-gold-500/50 px-4 py-2 text-sm font-semibold text-gold-400 hover:bg-gold-500/10">
          Özel harman oluştur <ArrowRight className="size-4" />
        </Link>
      </div>
      <ol className="mt-5 grid gap-3 sm:grid-cols-3">
        {steps.map(({ icon: I, t, d }, i) => (
          <li key={t} className="rounded-lg border border-white/10 bg-white/5 p-4">
            <span className="flex items-center gap-2 text-gold-400">
              <I className="size-5" />
              <span className="text-xs font-bold">0{i + 1}</span>
            </span>
            <p className="mt-2 font-bold">{t}</p>
            <p className="mt-1 text-xs text-ink-300">{d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
