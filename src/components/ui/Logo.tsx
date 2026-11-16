import Link from "next/link";

/** Geçici logo: serif kelime işareti. Gerçek logo geldiğinde bu bileşen değişir. */
export function Logo({ tone = "dark", size = "md", className = "" }: { tone?: "light" | "dark"; size?: "sm" | "md" | "lg"; className?: string }) {
  const text = tone === "light" ? "text-white" : "text-navy-900";
  const sub = tone === "light" ? "text-sky-300" : "text-ink-500";
  const sz = size === "lg" ? "text-4xl" : size === "sm" ? "text-xl" : "text-[1.7rem]";
  return (
    <Link href="/" aria-label="Yavuz Gıda ana sayfa" className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className={`font-display font-bold leading-none tracking-tight ${sz} ${text}`}>
        Yavuz<span className="text-orange-500">.</span>Gıda
      </span>
      {size !== "sm" && <span className={`hidden text-[0.6rem] font-semibold uppercase tracking-[0.28em] sm:inline ${sub}`}>toptan</span>}
    </Link>
  );
}
