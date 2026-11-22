import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProductIndex } from "@/lib/types";
import type { Category } from "@/lib/types";
import { PackArt } from "@/components/product/PackArt";

export function PopularCategories({ samples, counts , categories }: { samples: Record<string, ProductIndex[]>; counts: Record<string, number> ; categories: Category[] }) {
  const picks = categories.slice(0, 8);
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {picks.map((c) => (
        <Link key={c.slug} href={`/kategori/${c.slug}`} className="group relative overflow-hidden rounded-xl border border-ink-200 bg-white p-4 transition hover:border-orange-400 hover:shadow-hover">
          <p className="text-sm font-bold text-ink-900 group-hover:text-orange-600">{c.name}</p>
          <p className="text-xs text-ink-500">{counts[c.slug] ?? 0} ürün</p>
          <div className="mt-3 flex h-24 items-end justify-center gap-1 rounded-lg p-2" style={{ background: c.colorSoft }}>
            {(samples[c.slug] ?? []).slice(0, 3).map((p, i) => (
              <PackArt key={p.slug} art={p.art} hue={p.hue} name={p.name} brand={p.brand} className={`${i === 1 ? "h-full" : "h-[80%]"} w-auto drop-shadow-md`} />
            ))}
          </div>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-orange-600">
            İncele <ArrowRight className="size-3 transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      ))}
    </div>
  );
}
