import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { B2BBand } from "@/components/home/B2BBand";
import { BrandStrip } from "@/components/home/BrandStrip";
import { Steps } from "@/components/home/Steps";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductRail } from "@/components/product/ProductRail";
import { bestSellers, newArrivals, discounted, categoryCounts, products, brands } from "@/lib/catalog";
import { toIndex } from "@/lib/index-of";

export default function HomePage() {
  const counts = categoryCounts();
  return (
    <>
      <Hero productCount={Math.floor(products.length / 10) * 10} />
      <CategoryGrid counts={counts} />

      <section className="bg-tangerine-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Haftanın fırsatları" title="İndirimli ürünler" description="Stok yenileme döneminde seçili ürünlerde %10–25 indirim. Fırsatlar stoklarla sınırlıdır." href="/urunler?etiket=indirim" linkLabel="Tüm fırsatlar" />
          <ProductRail items={discounted(12).map(toIndex)} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading eyebrow="Çok satanlar" title="En çok sipariş edilenler" description="Restoran ve marketlerin her hafta yeniden sipariş verdiği ürünler." href="/urunler?etiket=cok-satan" />
        <ProductRail items={bestSellers(12).map(toIndex)} />
      </section>

      <B2BBand />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading eyebrow="Yeni gelenler" title="Rafa yeni eklenenler" href="/urunler?etiket=yeni" />
        <ProductRail items={newArrivals(6).map(toIndex)} />
      </section>

      <BrandStrip brands={brands} />
      <Steps />
    </>
  );
}
