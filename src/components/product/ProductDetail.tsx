import Link from "next/link";
import { Heart, Share2 } from "lucide-react";
import type { Product } from "@/lib/types";
import { getProducts, related, minPrice, getCategories } from "@/lib/catalog";
import { toIndex } from "@/lib/index-of";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Stars } from "@/components/ui/Stars";
import { TagBadge } from "@/components/ui/Badge";
import { Gallery } from "@/components/product/Gallery";
import { BuyBox } from "@/components/product/BuyBox";
import { ProductRail } from "@/components/product/ProductRail";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductTabs } from "@/components/product/ProductTabs";

/** Ürün detayı: mağaza ve anlaşmalı müşteri paneli ortak kullanır (base: "" | "/panel"). */
export async function ProductDetail({ p, base = "" }: { p: Product; base?: string }) {
  const [relRaw, products, cats] = await Promise.all([related(p, 8), getProducts(), getCategories()]);
  const cat = cats.find((c) => c.slug === p.category) ?? { slug: p.category, name: p.category, subcategories: [] as { slug: string; name: string }[] };
  const sub = cat.subcategories.find((s) => s.slug === p.subcategory);
  const rel = relRaw.map(toIndex);
  const others = products.filter((x) => x.brand === p.brand && x.slug !== p.slug).slice(0, 8).map(toIndex);
  const home = base ? { label: "Panel", href: base } : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${p.brand} ${p.name}`,
    brand: { "@type": "Brand", name: p.brand },
    sku: p.variants[0].sku,
    description: p.description,
    aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviews },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "TRY",
      lowPrice: minPrice(p),
      highPrice: Math.max(...p.variants.map((v) => v.price)),
      offerCount: p.variants.length,
      availability: p.variants.some((v) => v.inStock) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-24 pt-3 md:pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs home={home} items={[{ label: "Tüm Ürünler", href: `${base}/urunler` }, { label: cat.name, href: `${base}/kategori/${cat.slug}` }, ...(sub ? [{ label: sub.name, href: `${base}/kategori/${cat.slug}/${sub.slug}` }] : []), { label: p.name }]} />

      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Gallery product={p} />

        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl leading-snug text-ink-900 sm:text-2xl">
                <Link href={`${base}/urunler?marka=${encodeURIComponent(p.brand)}`} className="text-orange-600 hover:underline">
                  {p.brand}
                </Link>{" "}
                {p.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Stars rating={p.rating} count={p.reviews} size="md" />
                <span className="text-xs text-ink-500">{p.reviews} Değerlendirme</span>
                <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[0.7rem] font-semibold text-sky-700">{p.sold} adet satıldı</span>
              </div>
              {p.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <TagBadge key={t} tag={t} />
                  ))}
                </div>
              )}
            </div>
            <div className="flex shrink-0 gap-1">
              <button aria-label="Favorilere ekle" className="grid size-10 place-items-center rounded-full border border-ink-200 text-ink-500 hover:border-orange-500 hover:text-orange-600">
                <Heart className="size-4" />
              </button>
              <button aria-label="Paylaş" className="grid size-10 place-items-center rounded-full border border-ink-200 text-ink-500 hover:border-orange-500 hover:text-orange-600">
                <Share2 className="size-4" />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <BuyBox product={p} />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ProductTabs product={p} />
      </div>

      {rel.length > 0 && (
        <section className="mt-10">
          <SectionHeading title="Benzer Ürünler" href={`${base}/kategori/${cat.slug}${sub ? `/${sub.slug}` : ""}`} />
          <ProductRail items={rel} />
        </section>
      )}
      {others.length > 0 && (
        <section className="mt-10">
          <SectionHeading title={`${p.brand} Markasının Diğer Ürünleri`} href={`${base}/urunler?marka=${encodeURIComponent(p.brand)}`} />
          <ProductRail items={others} />
        </section>
      )}
    </div>
  );
}
