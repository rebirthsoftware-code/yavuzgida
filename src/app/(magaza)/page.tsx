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
import { bestSellers, newArrivals, discounted, categoryCounts, products, categories, brands } from "@/lib/catalog";
import { toIndex } from "@/lib/index-of";

export default function HomePage() {
  const counts = categoryCounts();
  const best = bestSellers(60);
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
        <CategoryCircles />
      </section>

      <FlashDeals items={discounted(12).map(toIndex)} />

      <BlendPromo />

      <CampaignTiles />

      <BestSellerTabs groups={groups} />

      <section>
        <SectionHeading title="Popüler Kategoriler" href="/urunler" />
        <PopularCategories samples={samples} counts={counts} />
      </section>

      <section>
        <SectionHeading title="Yeni Gelenler" sub="Rafa bu ay eklenen ürünler" href="/urunler?etiket=yeni&sirala=yeni" />
        <ProductRail items={newArrivals(12).map(toIndex)} />
      </section>

      <section>
        <SectionHeading title="Sizin İçin Seçtiklerimiz" href="/urunler?sirala=populer" />
        <ProductRail items={best.slice(12, 24).map(toIndex)} />
      </section>

      <References />

      <BrandStrip brands={brands} />
    </div>
  );
}
