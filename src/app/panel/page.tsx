import Link from "next/link";
import { ArrowRight, ClipboardList, MessageCircle, FileDown, Coffee } from "lucide-react";
import { categories } from "@/lib/categories";
import { categoryCounts, bestSellers } from "@/lib/catalog";
import { toIndex } from "@/lib/index-of";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { ProductRail } from "@/components/product/ProductRail";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function PanelHome() {
  const counts = categoryCounts();
  return (
    <div className="mx-auto max-w-[1320px] space-y-10 px-4 pb-10 pt-5">
      <section className="overflow-hidden rounded-xl bg-coal-900 text-white">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">Anlaşmalı müşteri paneli</p>
            <h1 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">Hoş geldiniz. Siparişinizi üç adımda oluşturun.</h1>
            <p className="mt-3 max-w-xl text-sm text-white/75">Bu panelde fiyat gösterilmez; anlaşmalı tarifeniz geçerlidir. Ürünleri listeye ekleyin, onaylayın; fişiniz WhatsApp ile bize ulaşsın, dilerseniz PDF olarak kaydedin.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/panel/urunler" className="inline-flex h-11 items-center gap-2 rounded-lg bg-gold px-5 text-sm font-bold text-coal-950 hover:brightness-105">
                Kataloğa git <ArrowRight className="size-4" />
              </Link>
              <Link href="/panel/sepet" className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/20 px-5 text-sm font-semibold text-white hover:bg-white/10">
                <ClipboardList className="size-4" /> Sipariş listem
              </Link>
            </div>
          </div>
          <ol className="grid gap-2 text-sm">
            {[
              { icon: ClipboardList, t: "Ürünleri listeye ekleyin", d: "Boy ve adedi seçin; liste sağ üstte birikir." },
              { icon: MessageCircle, t: "Onaylayın, WhatsApp'tan gönderin", d: "Firma adı ve telefonunuzla tek tıkla iletin." },
              { icon: FileDown, t: "Fişi PDF olarak saklayın", d: "Sipariş fişi numaralı ve yazdırılabilir." },
            ].map(({ icon: I, t, d }, i) => (
              <li key={t} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gold-500/15 text-xs font-bold text-gold-400">{i + 1}</span>
                <span>
                  <span className="flex items-center gap-1.5 font-bold">
                    <I className="size-4 text-gold-400" /> {t}
                  </span>
                  <span className="block text-xs text-white/60">{d}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section>
        <SectionHeading title="Kategoriler" href="/panel/urunler" linkLabel="Tüm ürünler" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {categories.map((c) => (
            <Link key={c.slug} href={`/panel/kategori/${c.slug}`} className="group flex items-center gap-3 rounded-xl border border-ink-200 bg-white p-3 transition hover:border-orange-400 hover:shadow-hover">
              <span className="grid size-11 shrink-0 place-items-center rounded-full" style={{ background: c.colorSoft, color: c.color }}>
                <CategoryIcon name={c.icon} className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-ink-900 group-hover:text-orange-600">{c.name}</span>
                <span className="block text-xs text-ink-500">{counts[c.slug] ?? 0} ürün</span>
              </span>
            </Link>
          ))}
          <Link href="/ozel-harman" className="group flex items-center gap-3 rounded-xl bg-coal-900 p-3 text-white transition hover:bg-coal-800">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gold-500/15 text-gold-400">
              <Coffee className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold">Özel Harman</span>
              <span className="block text-xs text-ink-300">Kendi markanızla espresso</span>
            </span>
          </Link>
        </div>
      </section>

      <section>
        <SectionHeading title="Sık Sipariş Edilenler" sub="Kafelerin her hafta yenilediği ürünler" href="/panel/urunler?etiket=cok-satan&sirala=populer" />
        <ProductRail items={bestSellers(12).map(toIndex)} />
      </section>
    </div>
  );
}
