import Link from "next/link";
import { ArrowRight, ClipboardList, MessageCircle, FileDown, Coffee } from "lucide-react";
import { categoryCounts, bestSellers, getCategories } from "@/lib/catalog";
import { toIndex } from "@/lib/index-of";
import { getSiteConfig } from "@/lib/site-config";
import { t } from "@/lib/content";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { ProductRail } from "@/components/product/ProductRail";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default async function PanelHome() {
  const [counts, best, categories, config] = await Promise.all([categoryCounts(), bestSellers(12), getCategories(), getSiteConfig()]);
  const tx = (k: string) => t(config, k);
  return (
    <div className="mx-auto max-w-[1320px] space-y-10 px-4 pb-10 pt-5">
      <section className="overflow-hidden rounded-xl bg-coal-900 text-white">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">{tx("panel.kicker")}</p>
            <h1 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">{tx("panel.title")}</h1>
            <p className="mt-3 max-w-xl text-sm text-white/75">{tx("panel.text")}</p>
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
              { icon: ClipboardList, t: tx("panel.step1.title"), d: tx("panel.step1.text") },
              { icon: MessageCircle, t: tx("panel.step2.title"), d: tx("panel.step2.text") },
              { icon: FileDown, t: tx("panel.step3.title"), d: tx("panel.step3.text") },
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
                <span className="line-clamp-2 text-sm font-bold leading-tight text-ink-900 group-hover:text-orange-600">{c.name}</span>
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
        <ProductRail items={best.map(toIndex)} />
      </section>
    </div>
  );
}
