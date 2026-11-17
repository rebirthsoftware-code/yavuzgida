import { Star } from "lucide-react";

export function Stars({ rating, count, size = "sm", showValue = true }: { rating: number; count?: number; size?: "sm" | "md"; showValue?: boolean }) {
  const s = size === "md" ? "size-4" : "size-3";
  return (
    <span className="inline-flex items-center gap-1">
      <span className="inline-flex" aria-label={`${rating} / 5`}>
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.max(0, Math.min(1, rating - (i - 1)));
          return (
            <span key={i} className={`relative ${s}`}>
              <Star className={`absolute inset-0 ${s} text-ink-200`} fill="currentColor" strokeWidth={0} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={`${s} text-star`} fill="currentColor" strokeWidth={0} />
              </span>
            </span>
          );
        })}
      </span>
      {showValue && <span className={`font-semibold text-ink-800 ${size === "md" ? "text-sm" : "text-xs"}`}>{rating.toFixed(1)}</span>}
      {count !== undefined && <span className={`text-ink-400 ${size === "md" ? "text-sm" : "text-[0.7rem]"}`}>({count})</span>}
    </span>
  );
}
