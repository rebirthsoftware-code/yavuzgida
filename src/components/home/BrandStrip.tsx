export function BrandStrip({ brands }: { brands: string[] }) {
  const list = [...brands, ...brands];
  return (
    <section className="border-y border-ink-100 bg-white py-6">
      <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-ink-400">Çalıştığımız markalar</p>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />
        <div className="flex w-max animate-marquee gap-10 px-4">
          {list.map((b, i) => (
            <span key={i} className="font-display text-xl font-bold tracking-tight text-ink-300 whitespace-nowrap">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
