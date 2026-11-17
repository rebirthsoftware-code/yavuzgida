import Link from "next/link";

export function BrandStrip({ brands }: { brands: string[] }) {
  return (
    <div className="rounded-xl border border-ink-200 bg-white p-4">
      <p className="mb-3 text-sm font-bold text-ink-900">Popüler Markalar</p>
      <div className="flex flex-wrap gap-2">
        {brands.map((b) => (
          <Link key={b} href={`/urunler?marka=${encodeURIComponent(b)}`} className="rounded-lg border border-ink-200 px-4 py-2 text-sm font-bold tracking-tight text-ink-700 transition hover:border-orange-500 hover:text-orange-600">
            {b}
          </Link>
        ))}
      </div>
    </div>
  );
}
