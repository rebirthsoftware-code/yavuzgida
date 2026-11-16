import { Suspense } from "react";
import { Catalog } from "./Catalog";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

/** Listeleme sayfası kabuğu: büyük serif başlık + açıklama, ardından liste. */
export function CatalogPage({
  index,
  title,
  description,
  crumbs,
  fixedCategory,
  fixedSub,
  children,
}: {
  index?: string;
  title: string;
  description?: string;
  crumbs: { label: string; href?: string }[];
  fixedCategory?: string;
  fixedSub?: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <header className="px-4 pb-6 pt-6 lg:px-6 lg:pt-8">
        <Breadcrumbs items={crumbs} />
        <div className="mt-5 flex flex-wrap items-end gap-x-6 gap-y-3">
          {index && <span className="font-display text-6xl leading-none text-orange-500/80 sm:text-7xl">{index}</span>}
          <div className="max-w-2xl">
            <h1 className="text-4xl leading-[1.05] text-navy-900 sm:text-5xl">{title}</h1>
            {description && <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-500">{description}</p>}
          </div>
        </div>
        {children}
      </header>
      <Suspense fallback={<div className="h-64 animate-pulse-soft border-t border-ink-200 bg-paper-100" />}>
        <Catalog fixedCategory={fixedCategory} fixedSub={fixedSub} />
      </Suspense>
    </div>
  );
}
