import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items, home = { label: "Anasayfa", href: "/" } }: { items: { label: string; href?: string }[]; home?: { label: string; href: string } }) {
  return (
    <nav aria-label="Konum" className="flex flex-wrap items-center gap-1 text-xs text-ink-500">
      <Link href={home.href} className="hover:text-orange-600">
        {home.label}
      </Link>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="size-3 text-ink-300" />
          {it.href ? (
            <Link href={it.href} className="hover:text-orange-600">
              {it.label}
            </Link>
          ) : (
            <span className="font-medium text-ink-800">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
