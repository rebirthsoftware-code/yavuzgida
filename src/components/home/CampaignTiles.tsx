import Link from "next/link";
import { Truck, Boxes, BadgePercent, Building2 } from "lucide-react";

export function CampaignTiles() {
  const tiles = [
    { icon: Truck, t: "2.500 ₺ üzeri kargo bedava", d: "Türkiye geneli 81 il", cls: "banner-d text-white", href: "/teslimat-ve-kargo" },
    { icon: BadgePercent, t: "Sepette ek indirim", d: "5.000 ₺ üzeri alışverişte %4", cls: "banner-b text-white", href: "/urunler" },
    { icon: Boxes, t: "Koli & çuval fiyatı", d: "Büyük boyda birim fiyat düşer", cls: "banner-a text-white", href: "/urunler" },
    { icon: Building2, t: "Kurumsal vade", d: "Onaylı hesaplara 30 gün", cls: "bg-white border border-ink-200 text-ink-900", href: "/kurumsal" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map(({ icon: I, t, d, cls, href }) => (
        <Link key={t} href={href} className={`flex items-center gap-3 rounded-xl p-4 transition hover:-translate-y-0.5 hover:shadow-hover ${cls}`}>
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/20">
            <I className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-bold leading-tight">{t}</span>
            <span className="block text-xs opacity-80">{d}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
