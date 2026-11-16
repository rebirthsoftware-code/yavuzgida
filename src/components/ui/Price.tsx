import { formatPrice } from "@/lib/format";

export function Price({ value, old, size = "md", className = "" }: { value: number; old?: number; size?: "sm" | "md" | "lg"; className?: string }) {
  const sz = size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl";
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className={`font-display font-bold tabular-nums tracking-tight text-ink-900 ${sz}`}>{formatPrice(value)}</span>
      {old && old > value && <span className="text-sm tabular-nums text-ink-400 line-through">{formatPrice(old)}</span>}
    </span>
  );
}

/** Çentikli etiket biçimli fiyat (pazar tezgâhı etiketi) */
export function PriceTag({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`price-tag inline-flex items-center bg-tangerine-500 py-1 pl-2.5 pr-4 font-display text-sm font-bold tabular-nums text-white ${className}`}>
      {formatPrice(value)}
    </span>
  );
}
