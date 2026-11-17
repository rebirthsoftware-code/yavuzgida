import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/lib/categories";
import { countIn } from "@/lib/catalog";
import { CatalogPage } from "@/components/catalog/CatalogPage";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/kategori/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) return {};
  return { title: `${c.name} Fiyatları ve Modelleri`, description: c.description };
}

export default async function CategoryPage({ params }: PageProps<"/kategori/[slug]">) {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) notFound();
  const subCounts = Object.fromEntries(c.subcategories.map((s) => [s.slug, countIn(c.slug, s.slug)]));
  return <CatalogPage title={c.name} count={countIn(c.slug)} crumbs={[{ label: "Tüm Ürünler", href: "/urunler" }, { label: c.name }]} fixedCategory={c.slug} category={c} subCounts={subCounts} />;
}
