import Link from "next/link";
import { ArrowRight, Store, Truck } from "lucide-react";

export function SideBanners() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Link href="/panel" className="group relative flex min-h-[120px] flex-col justify-between overflow-hidden rounded-xl bg-coal-900 p-4 text-white">
        <Store className="size-6 text-gold-400" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gold-400">Anlaşmalı müşteriler</p>
          <p className="mt-1 text-base font-bold leading-tight">Fiyatsız sipariş paneli: listele, onayla, WhatsApp&apos;a düşsün</p>
          <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-gold-400">
            Panele gir <ArrowRight className="size-3 transition group-hover:translate-x-0.5" />
          </p>
        </div>
        <span className="absolute -bottom-10 -right-10 size-32 rounded-full bg-gold-500/20" />
      </Link>
      <Link href="/teslimat-ve-kargo" className="group relative flex min-h-[120px] flex-col justify-between overflow-hidden rounded-xl bg-sky-100 p-4 text-ink-900">
        <Truck className="size-6 text-sky-700" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-700">Kargo</p>
          <p className="mt-1 text-base font-bold leading-tight">14:00&apos;a kadar sipariş, aynı gün kargo</p>
          <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-sky-700">
            Detaylar <ArrowRight className="size-3 transition group-hover:translate-x-0.5" />
          </p>
        </div>
        <span className="absolute -bottom-10 -right-10 size-32 rounded-full bg-white/60" />
      </Link>
    </div>
  );
}
