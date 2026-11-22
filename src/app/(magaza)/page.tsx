import { HeroSlider } from "@/components/home/HeroSlider";
import { SideBanners } from "@/components/home/SideBanners";
import { CategoryCircles } from "@/components/home/CategoryCircles";
import { FlashDeals } from "@/components/home/FlashDeals";
import { CampaignTiles } from "@/components/home/CampaignTiles";
import { BestSellerTabs } from "@/components/home/BestSellerTabs";
import { PopularCategories } from "@/components/home/PopularCategories";
import { BrandStrip } from "@/components/home/BrandStrip";
import { ProductRail } from "@/components/product/ProductRail";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BlendPromo } from "@/components/home/BlendPromo";
import { References } from "@/components/home/References";
import { bestSellers, newArrivals, discounted, categoryCounts, getProducts, getBrands, getCategories } from "@/lib/catalog";
import { toIndex } from "@/lib/index-of";
import { getSiteConfig } from "@/lib/site-config";
import { t } from "@/lib/content";

export default async function HomePage() {
  const [counts, best, products, brands, deals, fresh, categories, config] = await Promise.all([categoryCounts(), bestSellers(60), getProducts(), getBrands(), discounted(12), newArrivals(12), getCategories(), getSiteConfig()]);
  const tx = (k: string) => t(config, k);
  const groups = [
    { key: "all", label: "Tümü", items: best.slice(0, 12).map(toIndex) },
    ...categories.slice(0, 6).map((c) => ({ key: c.slug, label: c.name, items: best.filter((p) => p.category === c.slug).slice(0, 12).map(toIndex) })).filter((g) => g.items.length >= 4),
  ];
  const samples: Record<string, ReturnType<typeof toIndex>[]> = {};
  for (const c of categories) samples[c.slug] = products.filter((p) => p.category === c.slug).slice(0, 3).map(toIndex);

  return (
    <div className="mx-auto max-w-[1320px] space-y-10 px-4 pb-10 pt-4">
      <section className="space-y-3">
        <HeroSlider />
        <SideBanners />
      </section>

      <section>
        <CategoryCircles categories={categories} />
      </section>

      <FlashDeals items={deals.map(toIndex)} title={tx("home.flash.title")} sub={tx("home.flash.sub")} />

      <BlendPromo />

      <CampaignTiles />

      <BestSellerTabs groups={groups} title={tx("home.best.title")} sub={tx("home.best.sub")} />

      <section>
        <SectionHeading title={tx("home.popular.title")} href="/urunler" />
        <PopularCategories samples={samples} counts={counts} categories={categories} />
      </section>

      <section>
        <SectionHeading title={tx("home.new.title")} sub={tx("home.new.sub")} href="/urunler?etiket=yeni&sirala=yeni" />
        <ProductRail items={fresh.map(toIndex)} />
      </section>

      <section>
        <SectionHeading title={tx("home.picks.title")} href="/urunler?sirala=populer" />
        <ProductRail items={best.slice(12, 24).map(toIndex)} />
      </section>

      <References />

      <BrandStrip brands={brands} title={tx("home.brands.title")} />
    </div>
  );
}
