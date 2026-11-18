import { Suspense } from "react";
import Link from "next/link";
import { Catalog } from "./Catalog";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import type { Category } from "@/lib/types";
import { Coffee, ArrowRight } from "lucide-react";

export function CatalogPage({
  title,
  count,
  crumbs,
  fixedCategory,
  fixedSub,
  category,
  subCounts,
}: {
  title: string;
  count: number;
  crumbs: { label: string; href?: string }[];
  fixedCategory?: string;
  fixedSub?: string;
  category?: Category;
  subCounts?: Record<string, number>;
}) {
  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-12 pt-3">
      <Breadcrumbs items={crumbs} />
      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-xl text-ink-900 sm:text-2xl">{title}</h1>
        <span className="text-sm text-ink-500">{count} ürün</span>
      </div>
      {category && !fixedSub && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {category.subcategories.map((s) => (
            <Link key={s.slug} href={`/kategori/${category.slug}/${s.slug}`} className="shrink-0 rounded-full border border-ink-200 bg-white px-3.5 py-1.5 text-sm font-medium text-ink-700 transition hover:border-orange-500 hover:text-orange-600">
              {s.name} <span className="text-ink-400">({subCounts?.[s.slug] ?? 0})</span>
            </Link>
          ))}
        </div>
      )}
      {fixedCategory === "kahve" && (
        <Link href="/ozel-harman" className="mt-4 flex items-center gap-4 rounded-xl bg-coal-900 px-5 py-4 text-white transition hover:bg-coal-800">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gold-500/15 text-gold-400">
            <Coffee className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">Kendi markanızla espresso: Özel Harman</span>
            <span className="block text-xs text-ink-300">Orijin oranlarını belirleyin, markanızın adıyla paketleyelim. Minimum 10 kg.</span>
          </span>
          <ArrowRight className="size-5 shrink-0 text-gold-400" />
        </Link>
      )}
      <div className="mt-4">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-white" />}>
          <Catalog fixedCategory={fixedCategory} fixedSub={fixedSub} />
        </Suspense>
      </div>
    </div>
  );
}
