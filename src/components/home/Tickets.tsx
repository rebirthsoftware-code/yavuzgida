import Link from "next/link";
import { Percent, Boxes, Building2, ArrowRight } from "lucide-react";

export function Tickets({ discountCount }: { discountCount: number }) {
  const tickets = [
    { icon: Percent, k: "Fırsatlar", v: `${discountCount} ürün`, d: "Stok yenileme döneminde %10–25 indirim.", href: "/urunler?etiket=indirim", tone: "bg-orange-50 text-orange-700" },
    { icon: Boxes, k: "Koli & çuval avantajı", v: "%6–14", d: "Büyük ambalajda birim fiyat kendiliğinden düşer.", href: "/urunler", tone: "bg-sky-100 text-navy-900" },
    { icon: Building2, k: "Kurumsal fiyat listesi", v: "1 iş günü", d: "Aylık hacme göre kademeli fiyat ve vade.", href: "/kurumsal", tone: "bg-navy-900 text-white" },
  ];
  return (
    <section className="grid gap-4 border-b border-ink-200 px-4 py-12 md:grid-cols-3 lg:px-6">
      {tickets.map(({ icon: I, k, v, d, href, tone }) => (
        <Link key={k} href={href} className={`group relative flex min-h-44 flex-col justify-between overflow-hidden rounded-xl p-5 transition hover:-translate-y-0.5 ${tone}`}>
          <span className="absolute inset-y-0 left-0 w-px border-l border-dashed border-current opacity-30" style={{ left: "3.25rem" }} />
          <div className="flex items-start justify-between">
            <I className="size-5 opacity-80" />
            <ArrowRight className="size-4 opacity-50 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
          </div>
          <div className="pl-10">
            <p className="font-display text-4xl font-semibold leading-none">{v}</p>
            <p className="mt-2 text-sm font-semibold">{k}</p>
            <p className="mt-0.5 text-xs opacity-75">{d}</p>
          </div>
        </Link>
      ))}
    </section>
  );
}
