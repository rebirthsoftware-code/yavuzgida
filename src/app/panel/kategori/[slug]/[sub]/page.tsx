import { notFound } from "next/navigation";
import { categories, getCategory, getSubcategory } from "@/lib/categories";
import { countIn } from "@/lib/catalog";
import { CatalogPage } from "@/components/catalog/CatalogPage";

export function generateStaticParams() {
  return categories.flatMap((c) => c.subcategories.map((s) => ({ slug: c.slug, sub: s.slug })));
}

export default async function Page({ params }: PageProps<"/panel/kategori/[slug]/[sub]">) {
  const { slug, sub } = await params;
  const c = getCategory(slug);
  const s = getSubcategory(slug, sub);
  if (!c || !s) notFound();
  return <CatalogPage base="/panel" title={s.name} count={countIn(c.slug, s.slug)} crumbs={[{ label: "Tüm Ürünler", href: "/panel/urunler" }, { label: c.name, href: `/panel/kategori/${c.slug}` }, { label: s.name }]} fixedCategory={c.slug} fixedSub={s.slug} category={c} />;
}
