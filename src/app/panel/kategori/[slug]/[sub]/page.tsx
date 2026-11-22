import { Suspense } from "react";
import { notFound } from "next/navigation";
import { categories, getSubcategory } from "@/lib/categories";
import { countIn, getCategoryBySlug } from "@/lib/catalog";
import { CatalogPage } from "@/components/catalog/CatalogPage";

export function generateStaticParams() {
  return categories.flatMap((c) => c.subcategories.map((s) => ({ slug: c.slug, sub: s.slug })));
}

async function Content({ params }: Pick<PageProps<"/panel/kategori/[slug]/[sub]">, "params">) {
  const { slug, sub } = await params;
  const c = await getCategoryBySlug(slug);
  const s = getSubcategory(slug, sub);
  if (!c || !s) notFound();
  return <CatalogPage base="/panel" title={s.name} count={await countIn(c.slug, s.slug)} crumbs={[{ label: "Tüm Ürünler", href: "/panel/urunler" }, { label: c.name, href: `/panel/kategori/${c.slug}` }, { label: s.name }]} fixedCategory={c.slug} fixedSub={s.slug} category={c} />;
}

export default function Page(props: PageProps<"/panel/kategori/[slug]/[sub]">) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1320px] px-4 py-6"><div className="h-80 animate-pulse rounded-xl bg-white" /></div>}>
      <Content params={props.params} />
    </Suspense>
  );
}
