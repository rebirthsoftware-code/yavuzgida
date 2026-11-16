import { ClipboardList, ShoppingBasket, Truck, PackageCheck } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  { icon: ClipboardList, t: "Listenizi hazırlayın", d: "600+ ürün arasından arayın, kategoriye göre filtreleyin." },
  { icon: ShoppingBasket, t: "Boyunu seçin, sepete atın", d: "1 kg paketten 25 kg çuvala; koli ve çuvalda fiyat otomatik düşer." },
  { icon: Truck, t: "Aynı gün yola çıksın", d: "14:00'a kadar verilen siparişler aynı gün kargoya verilir." },
  { icon: PackageCheck, t: "Kapınızda teslim alın", d: "81 ile 1–3 iş günü; kurumsal müşterilere araçla teslimat." },
];

export function Steps() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHeading eyebrow="Nasıl çalışır?" title="Dört adımda tedarik" align="center" />
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ icon: I, t, d }, i) => (
          <li key={t} className="relative rounded-2xl bg-white p-6 shadow-card">
            <span className="absolute right-5 top-4 font-display text-4xl font-black text-paper-200">0{i + 1}</span>
            <span className="grid size-11 place-items-center rounded-xl bg-green-50 text-green-800">
              <I className="size-5" />
            </span>
            <p className="mt-4 font-display text-lg font-bold">{t}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
