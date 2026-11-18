/** Puan yıldızları: tek SVG, sprite'taki yıldız sembolü 5 kez kullanılır; dolu kısım clip ile kesilir. */
export function Stars({ rating, count, size = "sm", showValue = true }: { rating: number; count?: number; size?: "sm" | "md"; showValue?: boolean }) {
  const px = size === "md" ? 16 : 12;
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className="inline-flex items-center gap-1">
      <svg width={px * 5 + 8} height={px} viewBox="0 0 68 12" aria-label={`${rating} / 5`} className="shrink-0">
        <g fill="#dde2e9">
          {[0, 14, 28, 42, 56].map((x) => (
            <use key={x} href="#pk-star" x={x} />
          ))}
        </g>
        <g fill="#f5a623" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
          {[0, 14, 28, 42, 56].map((x) => (
            <use key={x} href="#pk-star" x={x} />
          ))}
        </g>
      </svg>
      {showValue && <span className={`font-semibold text-ink-800 ${size === "md" ? "text-sm" : "text-xs"}`}>{rating.toFixed(1)}</span>}
      {count !== undefined && <span className={`text-ink-400 ${size === "md" ? "text-sm" : "text-[0.7rem]"}`}>({count})</span>}
    </span>
  );
}
