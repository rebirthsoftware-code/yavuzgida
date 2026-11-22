import { Suspense } from "react";
import { notFound } from "next/navigation";
import { categories } from "@/lib/categories";
import { countIn, getCategoryBySlug } from "@/lib/catalog";
import { CatalogPage } from "@/components/catalog/CatalogPage";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

async function Content({ params }: Pick<PageProps<"/panel/kategori/[slug]">, "params">) {
  const { slug } = await params;
  const c = await getCategoryBySlug(slug);
  if (!c) notFound();
  const subCounts = Object.fromEntries(await Promise.all(c.subcategories.map(async (s) => [s.slug, await countIn(c.slug, s.slug)] as const)));
  const total = await countIn(c.slug);
  return <CatalogPage base="/panel" title={c.name} count={total} crumbs={[{ label: "Tüm Ürünler", href: "/panel/urunler" }, { label: c.name }]} fixedCategory={c.slug} category={c} subCounts={subCounts} />;
}

export default function Page(props: PageProps<"/panel/kategori/[slug]">) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1320px] px-4 py-6"><div className="h-80 animate-pulse rounded-xl bg-white" /></div>}>
      <Content params={props.params} />
    </Suspense>
  );
}
