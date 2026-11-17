import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";

export const metadata: Metadata = { title: "Hakkımızda" };

export default function Page() {
  return (
    <PageShell title="Hakkımızda" crumb="Hakkımızda" lead="Yavuz Gıda; market, restoran ve kafelerin kuru gıda tedarikini tek noktadan çözmek için kuruldu.">
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { n: "600+", t: "aktif ürün", d: "12 kategori, seçilmiş markalar" },
          { n: "81", t: "ile teslimat", d: "Aynı gün kargo, 1–3 iş günü" },
          { n: "1 gün", t: "teklif süresi", d: "Kurumsal fiyat listesi" },
        ].map((s) => (
          <div key={s.t} className="rounded-lg border border-ink-200 bg-white p-6">
            <p className="font-display text-4xl font-black text-orange-500">{s.n}</p>
            <p className="mt-1 font-semibold">{s.t}</p>
            <p className="text-sm text-ink-500">{s.d}</p>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral mt-10 max-w-3xl text-ink-700">
        <p className="text-lg leading-relaxed">
          Bakliyattan baharata, zeytinyağından kuruyemişe uzanan geniş bir katalogla, işletmelerin dağınık tedarikçilerle uğraşmadan tek faturada alışveriş yapmasını sağlıyoruz.
          Ürünlerimizi kaynağından seçiyor, ambalaj boylarını işletmelerin gerçek tüketimine göre planlıyoruz.
        </p>
        <p className="mt-4 leading-relaxed text-ink-500">Bu bölümün metni, firmanın hikâyesi ve fotoğraflarıyla birlikte güncellenecektir.</p>
      </div>
    </PageShell>
  );
}
