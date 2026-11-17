import Link from "next/link";

export function Logo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" aria-label="Yavuz Gıda ana sayfa" className={`inline-flex items-center gap-2 ${className}`}>
      <span className="grid size-9 place-items-center rounded-lg bg-orange-500 text-lg font-black text-white">Y</span>
      {!compact && (
        <span className="leading-none">
          <span className="block text-[1.35rem] font-extrabold tracking-tight text-navy-900">
            yavuz<span className="text-orange-500">gıda</span>
          </span>
          <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-ink-500">toptan & perakende</span>
        </span>
      )}
    </Link>
  );
}
