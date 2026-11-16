import Link from "next/link";

/** Geçici logo: serif tipografik marka işareti. Gerçek logo geldiğinde bu bileşen değişir. */
export function Logo({ tone = "dark", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const text = tone === "light" ? "text-white" : "text-navy-900";
  const sub = tone === "light" ? "text-sky-300" : "text-ink-500";
  return (
    <Link href="/" aria-label="Yavuz Gıda ana sayfa" className={`flex items-center gap-3 ${className}`}>
      <span className="bg-copper grid size-10 place-items-center rounded-xl font-display text-xl font-bold italic text-white shadow-glow">Y</span>
      <span className="leading-none">
        <span className={`block font-display text-[1.45rem] font-semibold tracking-tight ${text}`}>Yavuz Gıda</span>
        <span className={`block text-[0.6rem] font-semibold uppercase tracking-[0.28em] ${sub}`}>toptan & perakende</span>
      </span>
    </Link>
  );
}
