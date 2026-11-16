"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import type { Category } from "@/lib/types";

/** Sol ray: kategori listesi, aktif olanı ve alt kategorilerini açar. */
export function RailNav({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  const pathname = usePathname();
  return (
    <ol className="space-y-0.5">
      {categories.map((c, i) => {
        const active = pathname.startsWith(`/kategori/${c.slug}`);
        return (
          <li key={c.slug}>
            <Link
              href={`/kategori/${c.slug}`}
              className={`group flex items-center gap-3 rounded-lg px-2.5 py-2 text-[0.92rem] transition ${active ? "bg-white font-semibold text-navy-900 shadow-card" : "text-ink-700 hover:bg-white/60 hover:text-navy-900"}`}
            >
              <span className={`w-5 font-display text-sm tabular-nums ${active ? "text-orange-600" : "text-ink-400"}`}>{String(i + 1).padStart(2, "0")}</span>
              <CategoryIcon name={c.icon} className={`size-4 ${active ? "text-orange-600" : "text-ink-400 group-hover:text-navy-900"}`} strokeWidth={1.8} />
              <span className="flex-1 truncate">{c.name}</span>
              <span className="text-xs tabular-nums text-ink-400">{counts[c.slug] ?? 0}</span>
            </Link>
            {active && (
              <ul className="mb-2 ml-[2.9rem] mt-1 space-y-0.5 border-l border-ink-200 pl-3">
                {c.subcategories.map((s) => {
                  const on = pathname === `/kategori/${c.slug}/${s.slug}`;
                  return (
                    <li key={s.slug}>
                      <Link href={`/kategori/${c.slug}/${s.slug}`} className={`block rounded-md px-2 py-1 text-[0.82rem] ${on ? "font-semibold text-orange-700" : "text-ink-500 hover:text-navy-900"}`}>
                        {s.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ol>
  );
}
