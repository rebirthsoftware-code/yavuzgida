import Link from "next/link";
import { ArrowRight, Truck, BadgePercent, Boxes, Search } from "lucide-react";
import { categories } from "@/lib/categories";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { ButtonLink } from "@/components/ui/Button";
import { HeroSearch } from "./HeroSearch";

export function Hero({ productCount }: { productCount: number }) {
  const featured = categories.slice(0, 6);
  return (
    <section className="relative overflow-hidden bg-green-900 text-white">
      <div className="bg-grid absolute inset-0" />
      <div className="absolute -right-32 -top-32 size-[520px] rounded-full bg-tangerine-500/20 blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 size-[420px] rounded-full bg-green-500/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:pb-20 lg:pt-16">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-green-100">
            <span className="size-1.5 rounded-full bg-tangerine-400 animate-pulse-soft" />
            {productCount}+ ürün · Aynı gün kargo · Toptan fiyat
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-[3.6rem]">
            Mutfağınızın
            <br />
            <span className="text-tangerine-400">toptancısı.</span>
          </h1>
          <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-green-100/90">
            Bakliyattan baharata, zeytinyağından kuruyemişe; market, restoran ve kafelerin ihtiyaç duyduğu her şey tek sipariş uzağınızda.
          </p>

          <div className="mt-7 max-w-xl">
            <HeroSearch />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {["Baldo pirinç", "Kırmızı mercimek", "Sızma zeytinyağı", "Pul biber", "Domates salçası"].map((t) => (
              <Link key={t} href={`/urunler?q=${encodeURIComponent(t)}`} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-green-100 transition hover:border-tangerine-400 hover:text-white">
                <Search className="size-3" /> {t}
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
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
              className={`group relative overflow-hidden rounded-2xl bg-white p-4 text-ink-900 transition hover:-translate-y-0.5 hover:shadow-pop ${i === 0 ? "sm:col-span-2 lg:col-span-2" : ""}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="absolute -right-6 -top-6 size-24 rounded-full transition-transform group-hover:scale-125" style={{ background: c.colorSoft }} />
              <span className="relative grid size-11 place-items-center rounded-xl" style={{ background: c.colorSoft, color: c.color }}>
                <CategoryIcon name={c.icon} className="size-5" />
              </span>
              <p className="relative mt-4 font-display text-lg font-bold leading-tight">{c.name}</p>
              <p className="relative mt-1 text-xs text-ink-500">{c.short}</p>
              <ArrowRight className="absolute bottom-4 right-4 size-4 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-green-800" />
            </Link>
          ))}
        </div>
      </div>

      {/* Alt şerit */}
      <div className="relative border-t border-white/10 bg-green-950/60">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
          {[
            { icon: Truck, t: "Aynı gün kargo", d: "14:00'a kadar verilen siparişler aynı gün yola çıkar" },
            { icon: BadgePercent, t: "Kademeli toptan fiyat", d: "Koli ve çuval alımlarında otomatik indirim" },
            { icon: Boxes, t: "Tek faturada 12 kategori", d: "Dağınık tedarikçilere veda edin" },
          ].map(({ icon: I, t, d }) => (
            <div key={t} className="flex items-center gap-3 py-4 sm:px-5 first:sm:pl-0">
              <I className="size-5 shrink-0 text-tangerine-400" />
              <div>
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-xs text-green-200/80">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
