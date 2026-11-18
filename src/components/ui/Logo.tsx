import Link from "next/link";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Marka logosu (altın/siyah). Koyu zeminler için tasarlandı; başlık ve altbilgide kullanılır. */
export function Logo({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const h = size === "lg" ? "h-24" : size === "sm" ? "h-12" : "h-16";
  return (
    <Link href="/" aria-label="Yavuz Gıda ana sayfa" className={`block shrink-0 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${base}/brand/logo-sm.png`} alt="Yavuz Gıda" width={560} height={418} className={`${h} w-auto`} />
    </Link>
  );
}
