import { Masthead } from "@/components/home/Masthead";
import { CategoryIndex } from "@/components/home/CategoryIndex";
import { PriceListPreview } from "@/components/home/PriceListPreview";
import { Tickets } from "@/components/home/Tickets";
import { CorporateNote } from "@/components/home/CorporateNote";
import { bestSellers, newArrivals, categoryCounts, products, categories } from "@/lib/catalog";
import { toIndex } from "@/lib/index-of";

export default function HomePage() {
  const counts = categoryCounts();
  const discountCount = products.filter((p) => p.tags.includes("indirim")).length;
  return (
    <>
      <Masthead productCount={Math.floor(products.length / 10) * 10} categoryCount={categories.length} />
      <CategoryIndex counts={counts} />
      <PriceListPreview eyebrow="Bu haftanın listesi" title="En çok sipariş edilenler" items={bestSellers(10).map(toIndex)} href="/urunler?etiket=cok-satan&sirala=populer" linkLabel="Tüm çok satanlar" />
      <Tickets discountCount={discountCount} />
      <PriceListPreview eyebrow="Rafa yeni girenler" title="Yeni eklenenler" items={newArrivals(6).map(toIndex)} href="/urunler?etiket=yeni&sirala=yeni" linkLabel="Tüm yeniler" />
      <CorporateNote />
    </>
  );
}
