import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Truck, ShieldCheck, RotateCcw, Building2 } from "lucide-react";
import { products, getProduct, related, minPrice } from "@/lib/catalog";
import { categoryMap } from "@/lib/categories";
import { site } from "@/lib/site";
import { toIndex } from "@/lib/index-of";
import { formatCompact } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { TagBadge } from "@/components/ui/Badge";
import { ProductVisual } from "@/components/product/ProductVisual";
import { AddToCartPanel } from "@/components/product/AddToCartPanel";
import { ProductRail } from "@/components/product/ProductRail";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/urun/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return { title: `${p.name} ${p.brand} — ${p.variants[0].label}`, description: p.description };
}

export default async function ProductPage({ params }: PageProps<"/urun/[slug]">) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const cat = categoryMap[p.category];
  const sub = cat.subcategories.find((s) => s.slug === p.subcategory);
  const rel = related(p, 6).map(toIndex);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    brand: { "@type": "Brand", name: p.brand },
    sku: p.variants[0].sku,
    description: p.description,
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
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="py-5">
        <Breadcrumbs items={[{ label: "Ürünler", href: "/urunler" }, { label: cat.name, href: `/kategori/${cat.slug}` }, ...(sub ? [{ label: sub.name, href: `/kategori/${cat.slug}/${sub.slug}` }] : []), { label: p.name }]} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        {/* Görsel */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-3xl shadow-card">
            <ProductVisual name={p.name} category={p.category} hue={p.hue} image={p.image} sizes="(min-width: 1024px) 50vw, 100vw" priority />
            {p.tags.length > 0 && (
              <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
                {p.tags.slice(0, 3).map((t) => (
                  <TagBadge key={t} tag={t} />
                ))}
              </div>
            )}
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            {[
              { icon: Truck, t: "Aynı gün kargo", d: "14:00'a kadar" },
              { icon: ShieldCheck, t: "Güvenli ödeme", d: "3D Secure" },
              { icon: RotateCcw, t: "14 gün iade", d: "Açılmamış ürün" },
              { icon: Building2, t: "Kurumsal fatura", d: "E-fatura" },
            ].map(({ icon: I, t, d }) => (
              <li key={t} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 shadow-card">
                <I className="size-4 shrink-0 text-green-700" />
                <span>
                  <span className="block font-semibold text-ink-800">{t}</span>
                  <span className="text-ink-400">{d}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bilgi + satın alma */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-400">
            <Link href={`/urunler?marka=${encodeURIComponent(p.brand)}`} className="hover:text-green-800">
              {p.brand}
            </Link>
            <span className="mx-1.5 text-ink-300">·</span>
            <Link href={`/kategori/${cat.slug}`} className="hover:text-green-800">
              {cat.name}
            </Link>
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">{p.name}</h1>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-ink-600">{p.short}</p>

          <div className="mt-6">
            <AddToCartPanel product={p} />
          </div>

          <p className="mt-4 text-xs text-ink-500">
            {formatCompact(site.commerce.freeShippingThreshold)} ve üzeri siparişlerde kargo bedava. Toptan alım için{" "}
            <Link href="/kurumsal" className="font-semibold text-green-800 underline-offset-2 hover:underline">
              kurumsal fiyat listesi
            </Link>{" "}
            isteyin.
          </p>
        </div>
      </div>

      {/* Açıklama ve özellikler */}
      <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
          <h2 className="text-xl font-bold">Ürün açıklaması</h2>
          <p className="mt-3 leading-relaxed text-ink-600">{p.description}</p>
        </section>
        <section className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
          <h2 className="text-xl font-bold">Ürün bilgileri</h2>
          <dl className="mt-3 divide-y divide-ink-100 text-sm">
            {p.specs.map((s) => (
              <div key={s.label} className="flex justify-between gap-4 py-2.5">
                <dt className="text-ink-500">{s.label}</dt>
                <dd className="text-right font-medium text-ink-800">{s.value}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="text-ink-500">Ambalaj boyları</dt>
              <dd className="text-right font-medium text-ink-800">{p.variants.map((v) => v.label).join(" · ")}</dd>
            </div>
          </dl>
        </section>
      </div>

      {rel.length > 0 && (
        <section className="mt-16">
          <SectionHeading eyebrow="Benzer ürünler" title={`${sub?.name ?? cat.name} grubundan`} href={`/kategori/${cat.slug}${sub ? `/${sub.slug}` : ""}`} />
          <ProductRail items={rel} />
        </section>
      )}
    </div>
  );
}
