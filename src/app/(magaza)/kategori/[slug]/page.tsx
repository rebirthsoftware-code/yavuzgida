import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/lib/categories";
import { countIn, getCategoryBySlug } from "@/lib/catalog";
import { CatalogPage } from "@/components/catalog/CatalogPage";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/kategori/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCategoryBySlug(slug);
  if (!c) return {};
  return { title: `${c.name} Fiyatları ve Modelleri`, description: c.description };
}

async function Content({ params }: Pick<PageProps<"/kategori/[slug]">, "params">) {
  const { slug } = await params;
  const c = await getCategoryBySlug(slug);
  if (!c) notFound();
  const subCounts = Object.fromEntries(await Promise.all(c.subcategories.map(async (s) => [s.slug, await countIn(c.slug, s.slug)] as const)));
  const total = await countIn(c.slug);
  return <CatalogPage title={c.name} count={total} crumbs={[{ label: "Tüm Ürünler", href: "/urunler" }, { label: c.name }]} fixedCategory={c.slug} category={c} subCounts={subCounts} />;
}

export default function CategoryPage(props: PageProps<"/kategori/[slug]">) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1320px] px-4 py-6"><div className="h-80 animate-pulse rounded-xl bg-white" /></div>}>
      <Content params={props.params} />
    </Suspense>
  );
}
