import { notFound } from "next/navigation";
import { categories, getCategory } from "@/lib/categories";
import { countIn } from "@/lib/catalog";
import { CatalogPage } from "@/components/catalog/CatalogPage";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function Page({ params }: PageProps<"/panel/kategori/[slug]">) {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) notFound();
  const subCounts = Object.fromEntries(c.subcategories.map((s) => [s.slug, countIn(c.slug, s.slug)]));
  return <CatalogPage base="/panel" title={c.name} count={countIn(c.slug)} crumbs={[{ label: "Tüm Ürünler", href: "/panel/urunler" }, { label: c.name }]} fixedCategory={c.slug} category={c} subCounts={subCounts} />;
}
