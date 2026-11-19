import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";
import { site } from "@/lib/site";
import { formatCompact } from "@/lib/format";

export const metadata: Metadata = { title: "Sık Sorulan Sorular" };

const faq = [
  ["Minimum sipariş tutarı var mı?", "Bireysel siparişlerde minimum tutar yoktur. Kurumsal fiyat listesi aylık alım hacmine göre düzenlenir."],
  ["Kargo ücreti ne kadar?", `${formatCompact(site.commerce.freeShippingThreshold)} ve üzeri siparişlerde kargo ücretsizdir; altında ${formatCompact(site.commerce.shippingFee)} kargo ücreti uygulanır.`],
  ["Siparişim ne zaman kargoya verilir?", "Hafta içi 14:00'a kadar verilen siparişler aynı gün kargoya teslim edilir; teslimat 1–3 iş günüdür."],
  ["Koli alımında fiyat düşer mi?", "Evet. Her ürünün ambalaj boylarında birim fiyat büyüdükçe düşer; ayrıca sepet tutarına göre kademeli indirim uygulanır."],
  ["Numune alabilir miyim?", "Kurumsal müşterilerimize şurup, kahve ve toz içeceklerde ücretsiz numune gönderiyoruz; teklif formundan talep edebilirsiniz."],
  ["Kurumsal fatura kesiyor musunuz?", "Evet, e-fatura mükellefiyiz. Ödeme adımında kurumsal fatura bilgilerinizi girebilirsiniz."],
  ["İade koşulları nedir?", "Açılmamış ve ambalajı bozulmamış ürünler 14 gün içinde iade edilebilir."],
];

export default function Page() {
  return (
    <PageShell title="Sık sorulan sorular" crumb="SSS" narrow>
      <div className="divide-y divide-ink-100 rounded-lg border border-ink-200 bg-white px-6">
        {faq.map(([q, a]) => (
          <details key={q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
              {q}
              <span className="ml-4 text-ink-300 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{a}</p>
          </details>
        ))}
      </div>
    </PageShell>
  );
}
