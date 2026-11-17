import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory, getSubcategory } from "@/lib/categories";
import { countIn } from "@/lib/catalog";
import { CatalogPage } from "@/components/catalog/CatalogPage";

export function generateStaticParams() {
  return categories.flatMap((c) => c.subcategories.map((s) => ({ slug: c.slug, sub: s.slug })));
}

export async function generateMetadata({ params }: PageProps<"/kategori/[slug]/[sub]">): Promise<Metadata> {
  const { slug, sub } = await params;
  const c = getCategory(slug);
  const s = getSubcategory(slug, sub);
  if (!c || !s) return {};
  return { title: `${s.name} Fiyatları — ${c.name}`, description: `${c.name} › ${s.name}: toptan fiyatlarla, farklı ambalaj boylarında.` };
}

export default async function SubcategoryPage({ params }: PageProps<"/kategori/[slug]/[sub]">) {
  const { slug, sub } = await params;
  const c = getCategory(slug);
  const s = getSubcategory(slug, sub);
  if (!c || !s) notFound();
  return <CatalogPage title={s.name} count={countIn(c.slug, s.slug)} crumbs={[{ label: "Tüm Ürünler", href: "/urunler" }, { label: c.name, href: `/kategori/${c.slug}` }, { label: s.name }]} fixedCategory={c.slug} fixedSub={s.slug} category={c} />;
}
