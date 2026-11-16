import Link from "next/link";
import { Layers } from "lucide-react";
import type { ProductIndex } from "@/lib/types";
import { categoryMap } from "@/lib/categories";
import { TagBadge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { ProductVisual } from "./ProductVisual";
import { QuickAdd } from "./QuickAdd";

/** Katalog kartı: listeleme, raylar ve aramada kullanılan tek kart. */
export function ProductCard({ p, priority }: { p: ProductIndex; priority?: boolean }) {
  const cat = categoryMap[p.category];
  const sub = cat?.subcategories.find((s) => s.slug === p.subcategory);
  const badge = (["indirim", "cok-satan", "yeni"] as const).find((t) => p.tags.includes(t));
  const discountPct = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;

  return (
    <article className="group relative flex h-full flex-col rounded-2xl bg-white p-2.5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <Link href={`/urun/${p.slug}`} className="relative block aspect-square overflow-hidden rounded-xl" aria-label={p.name}>
        <ProductVisual name={p.name} category={p.category} hue={p.hue} image={p.image} label={p.unit} priority={priority} className="transition-transform duration-500 group-hover:scale-[1.04]" />
        {badge && (
          <span className="absolute left-2 top-2">
            {badge === "indirim" && discountPct > 0 ? <span className="rounded-md bg-red-600 px-2 py-0.5 text-[0.7rem] font-bold text-white">%{discountPct}</span> : <TagBadge tag={badge} />}
          </span>
        )}
        {p.variants > 1 && (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-white/90 px-1.5 py-0.5 text-[0.65rem] font-bold text-ink-700">
            <Layers className="size-3" /> {p.variants} boy
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-1.5 pb-1 pt-3">
        <p className="truncate text-[0.68rem] font-bold uppercase tracking-[0.14em] text-ink-400">
          {p.brand} <span className="text-ink-300">·</span> {sub?.name ?? cat?.name}
        </p>
        <h3 className="mt-1 line-clamp-2 text-[0.95rem] font-semibold leading-snug text-ink-900">
          <Link href={`/urun/${p.slug}`} className="hover:text-green-800">
            {p.name}
          </Link>
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div>
            <Price value={p.price} old={p.oldPrice} size="md" />
            <p className="text-[0.72rem] text-ink-500">{p.unit}</p>
          </div>
          <QuickAdd
            compact
            disabled={!p.inStock}
            item={{ slug: p.slug, variantId: p.variantId, name: p.name, brand: p.brand, variantLabel: p.unit, sku: p.sku, price: p.price, hue: p.hue, image: p.image, category: p.category }}
          />
        </div>
      </div>
    </article>
  );
}
