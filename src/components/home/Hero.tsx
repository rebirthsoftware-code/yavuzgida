import Link from "next/link";
import { ArrowRight, Truck, BadgePercent, Boxes, Search } from "lucide-react";
import { categories } from "@/lib/categories";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { ButtonLink } from "@/components/ui/Button";
import { HeroSearch } from "./HeroSearch";

export function Hero({ productCount }: { productCount: number }) {
  const featured = categories.slice(0, 6);
  return (
    <section className="bg-sky-glow relative overflow-hidden">
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pb-24 lg:pt-20">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/70 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-navy-900 backdrop-blur">
            <span className="size-1.5 rounded-full bg-orange-500 animate-pulse-soft" />
            {productCount}+ ürün · Aynı gün kargo · Toptan fiyat
          </p>
          <h1 className="mt-6 text-5xl leading-[1.02] text-navy-900 sm:text-6xl lg:text-[4.4rem]">
            Mutfağınızın
            <br />
            <span className="italic text-orange-600">toptancısı.</span>
          </h1>
          <p className="mt-6 max-w-lg text-[1.08rem] leading-relaxed text-ink-700">
            Bakliyattan baharata, zeytinyağından kuruyemişe; market, restoran ve kafelerin ihtiyaç duyduğu her şey tek sipariş uzağınızda.
          </p>

          <div className="mt-8 max-w-xl">
            <HeroSearch />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {["Baldo pirinç", "Kırmızı mercimek", "Sızma zeytinyağı", "Pul biber", "Domates salçası"].map((t) => (
              <Link key={t} href={`/urunler?q=${encodeURIComponent(t)}`} className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white/60 px-3 py-1.5 text-xs font-medium text-ink-700 transition hover:border-orange-400 hover:text-orange-700">
                <Search className="size-3" /> {t}
              </Link>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/urunler" variant="accent" size="lg">
              Ürünleri keşfet <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/kurumsal" variant="white" size="lg">
              Toptan fiyat al
            </ButtonLink>
          </div>
        </div>

        {/* Kategori bento */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
          {featured.map((c, i) => (
            <Link
              key={c.slug}
              href={`/kategori/${c.slug}`}
              className={`group relative overflow-hidden rounded-3xl border border-white/80 bg-white/80 p-5 text-ink-900 shadow-card backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lift ${i === 0 ? "sm:col-span-2 lg:col-span-2" : ""}`}
            >
              <span className="absolute -right-8 -top-8 size-28 rounded-full opacity-70 transition-transform group-hover:scale-125" style={{ background: c.colorSoft }} />
              <span className="relative grid size-11 place-items-center rounded-2xl" style={{ background: c.colorSoft, color: c.color }}>
                <CategoryIcon name={c.icon} className="size-5" />
              </span>
              <p className="relative mt-5 font-display text-xl font-semibold leading-tight">{c.name}</p>
              <p className="relative mt-1 text-xs text-ink-500">{c.short}</p>
              <ArrowRight className="absolute bottom-5 right-5 size-4 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-orange-600" />
            </Link>
          ))}
        </div>
      </div>

      {/* Alt şerit */}
      <div className="relative border-t border-sky-200/70 bg-white/60 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-sky-200/70 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
          {[
            { icon: Truck, t: "Aynı gün kargo", d: "14:00'a kadar verilen siparişler aynı gün yola çıkar" },
            { icon: BadgePercent, t: "Kademeli toptan fiyat", d: "Koli ve çuval alımlarında otomatik indirim" },
            { icon: Boxes, t: "Tek faturada 12 kategori", d: "Dağınık tedarikçilere veda edin" },
          ].map(({ icon: I, t, d }) => (
            <div key={t} className="flex items-center gap-3 py-4 sm:px-6 first:sm:pl-0">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-orange-50 text-orange-600">
                <I className="size-4.5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-navy-900">{t}</p>
                <p className="text-xs text-ink-500">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
