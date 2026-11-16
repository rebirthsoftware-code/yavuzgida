import Link from "next/link";

/** Geçici logo: tipografik marka işareti. Gerçek logo geldiğinde bu bileşen değişir. */
export function Logo({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const text = tone === "light" ? "text-white" : "text-green-900";
  const sub = tone === "light" ? "text-green-200" : "text-ink-500";
  return (
    <Link href="/" aria-label="Yavuz Gıda ana sayfa" className={`flex items-center gap-2.5 ${className}`}>
      <span className="grid size-10 place-items-center rounded-xl bg-tangerine-500 font-display text-xl font-black text-white shadow-[0_6px_14px_-6px_rgb(222_95_23/0.9)]">Y</span>
      <span className="leading-none">
        <span className={`block font-display text-[1.35rem] font-bold tracking-tight ${text}`}>Yavuz Gıda</span>
        <span className={`block text-[0.62rem] font-semibold uppercase tracking-[0.22em] ${sub}`}>toptan & perakende</span>
      </span>
    </Link>
  );
}
