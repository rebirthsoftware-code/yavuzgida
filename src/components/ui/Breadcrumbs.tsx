import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Konum" className="flex flex-wrap items-center gap-1 text-sm text-ink-500">
      <Link href="/" className="hover:text-green-800">
        Ana Sayfa
      </Link>
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="size-3.5 text-ink-300" />
          {it.href ? (
            <Link href={it.href} className="hover:text-green-800">
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
