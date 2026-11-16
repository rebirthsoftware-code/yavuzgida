import type { Metadata } from "next";
import Link from "next/link";
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
  return { title: `${c.name} — Toptan Fiyatlarla`, description: c.description };
}

export default async function CategoryPage({ params }: PageProps<"/kategori/[slug]">) {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) notFound();
  return (
    <CatalogPage title={c.name} description={c.description} crumbs={[{ label: "Ürünler", href: "/urunler" }, { label: c.name }]} fixedCategory={c.slug} accent={{ color: c.color, soft: c.colorSoft }}>
      <div className="mt-5 flex flex-wrap gap-2">
        {c.subcategories.map((s) => (
          <Link key={s.slug} href={`/kategori/${c.slug}/${s.slug}`} className="rounded-full border border-ink-200 bg-white px-3.5 py-1.5 text-sm font-medium text-ink-800 transition hover:border-sky-600 hover:text-navy-900">
            {s.name} <span className="text-ink-400">{countIn(c.slug, s.slug)}</span>
          </Link>
        ))}
      </div>
    </CatalogPage>
  );
}
