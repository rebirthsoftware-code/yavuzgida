import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/lib/categories";
import { countIn, getCategoryBySlug } from "@/lib/catalog";
import { CatalogPage } from "@/components/catalog/CatalogPage";

export function generateStaticParams() {
  return categories.flatMap((c) => c.subcategories.map((s) => ({ slug: c.slug, sub: s.slug })));
}

export async function generateMetadata({ params }: PageProps<"/kategori/[slug]/[sub]">): Promise<Metadata> {
  const { slug, sub } = await params;
  const c = await getCategoryBySlug(slug);
  const s = c?.subcategories.find((x) => x.slug === sub);
  if (!c || !s) return {};
  return { title: `${s.name} Fiyatları — ${c.name}`, description: `${c.name} › ${s.name}: toptan fiyatlarla, farklı ambalaj boylarında.` };
}

async function Content({ params }: Pick<PageProps<"/kategori/[slug]/[sub]">, "params">) {
  const { slug, sub } = await params;
  const c = await getCategoryBySlug(slug);
  const s = c?.subcategories.find((x) => x.slug === sub);
  if (!c || !s) notFound();
  return <CatalogPage title={s.name} count={await countIn(c.slug, s.slug)} crumbs={[{ label: "Tüm Ürünler", href: "/urunler" }, { label: c.name, href: `/kategori/${c.slug}` }, { label: s.name }]} fixedCategory={c.slug} fixedSub={s.slug} category={c} />;
}

export default function SubcategoryPage(props: PageProps<"/kategori/[slug]/[sub]">) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1320px] px-4 py-6"><div className="h-80 animate-pulse rounded-xl bg-white" /></div>}>
      <Content params={props.params} />
    </Suspense>
  );
}
