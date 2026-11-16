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
import { PriceTable } from "@/components/product/PriceTable";
import { ProductRow } from "@/components/catalog/ProductRow";

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
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="border-b border-ink-200 px-4 pb-8 pt-6 lg:px-6 lg:pt-8">
        <Breadcrumbs items={[{ label: "Tüm ürünler", href: "/urunler" }, { label: cat.name, href: `/kategori/${cat.slug}` }, ...(sub ? [{ label: sub.name, href: `/kategori/${cat.slug}/${sub.slug}` }] : []), { label: p.name }]} />
        <div className="mt-5 flex flex-wrap items-end gap-x-6 gap-y-3">
          <span className="font-display text-6xl leading-none text-orange-500/80 sm:text-7xl">{String(cat.order).padStart(2, "0")}</span>
          <div className="min-w-0">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.24em] text-ink-500">
              <Link href={`/urunler?marka=${encodeURIComponent(p.brand)}`} className="hover:text-navy-900">
                {p.brand}
              </Link>
              <span className="mx-2 text-ink-300">·</span>
              {sub?.name ?? cat.name}
            </p>
            <h1 className="mt-1 text-4xl leading-[1.05] text-navy-900 sm:text-5xl">{p.name}</h1>
          </div>
          {p.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pb-1">
              {p.tags.slice(0, 3).map((t) => (
                <TagBadge key={t} tag={t} />
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="grid gap-8 px-4 py-8 lg:grid-cols-[300px_1fr] lg:px-6">
        {/* Künye */}
        <aside className="space-y-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-ink-200">
            <ProductVisual name={p.name} category={p.category} hue={p.hue} image={p.image} sizes="300px" priority />
          </div>
          <dl className="divide-y divide-ink-100 border-y border-ink-200 text-sm">
            {p.specs.map((s) => (
              <div key={s.label} className="flex justify-between gap-4 py-2">
                <dt className="text-ink-500">{s.label}</dt>
                <dd className="text-right font-medium text-ink-800">{s.value}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-ink-500">Stok kodu</dt>
              <dd className="text-right font-medium text-ink-800">{p.variants[0].sku}</dd>
            </div>
          </dl>
          <ul className="grid grid-cols-2 gap-2 text-xs text-ink-600">
            {[
              { icon: Truck, t: "Aynı gün kargo" },
              { icon: ShieldCheck, t: "3D Secure ödeme" },
              { icon: RotateCcw, t: "14 gün iade" },
              { icon: Building2, t: "E-fatura" },
            ].map(({ icon: I, t }) => (
              <li key={t} className="flex items-center gap-2">
                <I className="size-3.5 text-orange-600" /> {t}
              </li>
            ))}
          </ul>
        </aside>

        {/* Fiyat tablosu + açıklama */}
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.24em] text-ink-500">Fiyat tablosu · KDV dâhil</p>
          <div className="mt-3">
            <PriceTable product={p} />
          </div>
          <p className="mt-3 text-xs text-ink-500">
            {formatCompact(site.commerce.freeShippingThreshold)} ve üzeri siparişlerde kargo bedava. Toplu alımda kademeli indirim listede otomatik uygulanır; daha büyük hacim için{" "}
            <Link href="/kurumsal" className="font-semibold text-navy-900 underline-offset-2 hover:underline">
              kurumsal fiyat listesi
            </Link>{" "}
            isteyin.
          </p>

          <div className="mt-10 max-w-2xl">
            <h2 className="text-2xl text-navy-900">Ürün hakkında</h2>
            <p className="mt-2 text-[1.02rem] leading-relaxed text-ink-700">{p.short}</p>
            <p className="mt-3 leading-relaxed text-ink-600">{p.description}</p>
          </div>
        </div>
      </div>

      {rel.length > 0 && (
        <section className="border-t border-ink-200">
          <div className="flex items-end justify-between px-4 pb-4 pt-10 lg:px-6">
            <div>
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.24em] text-orange-600">Aynı gruptan</p>
              <h2 className="mt-2 text-3xl text-navy-900">{sub?.name ?? cat.name}</h2>
            </div>
            <Link href={`/kategori/${cat.slug}${sub ? `/${sub.slug}` : ""}`} className="text-sm font-semibold text-navy-900 underline-offset-4 hover:underline">
              Tümünü gör
            </Link>
          </div>
          <ul className="divide-y divide-ink-100 border-t border-ink-200">
            {rel.map((r) => (
              <ProductRow key={r.slug} p={r} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
