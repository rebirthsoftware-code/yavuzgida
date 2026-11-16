import { Suspense } from "react";
import { Catalog } from "./Catalog";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

/** Listeleme sayfalarının ortak kabuğu: başlık + açıklama + katalog */
export function CatalogPage({
  title,
  description,
  crumbs,
  fixedCategory,
  fixedSub,
  accent,
  children,
}: {
  title: string;
  description?: string;
  crumbs: { label: string; href?: string }[];
  fixedCategory?: string;
  fixedSub?: string;
  accent?: { color: string; soft: string };
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <div className="py-5">
        <Breadcrumbs items={crumbs} />
      </div>
      <header className="relative mb-8 overflow-hidden rounded-3xl bg-white px-6 py-8 shadow-card sm:px-10">
        {accent && <span className="absolute -right-16 -top-16 size-56 rounded-full" style={{ background: accent.soft }} />}
        <div className="relative">
          <h1 className="text-3xl font-bold sm:text-4xl" style={accent ? { color: accent.color } : undefined}>
            {title}
          </h1>
          {description && <p className="mt-2 max-w-2xl text-[0.98rem] leading-relaxed text-ink-500">{description}</p>}
          {children}
        </div>
      </header>
      <Suspense fallback={<CatalogSkeleton />}>
        <Catalog fixedCategory={fixedCategory} fixedSub={fixedSub} />
      </Suspense>
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
      <div className="hidden h-[520px] rounded-2xl bg-white shadow-card lg:block" />
      <div>
        <div className="h-16 rounded-2xl bg-white shadow-card" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse-soft rounded-2xl bg-white shadow-card" />
          ))}
        </div>
      </div>
    </div>
  );
}
