import Link from "next/link";
import { ArrowRight, Building2, Truck } from "lucide-react";

export function SideBanners() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
      <Link href="/kurumsal" className="group relative flex min-h-[120px] flex-col justify-between overflow-hidden rounded-xl bg-navy-900 p-4 text-white lg:min-h-0 lg:flex-1">
        <Building2 className="size-6 text-orange-400" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/70">Kurumsal</p>
          <p className="mt-1 text-base font-bold leading-tight">Kafe & otel zincirlerine özel fiyat listesi</p>
          <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-orange-400">
            Teklif al <ArrowRight className="size-3 transition group-hover:translate-x-0.5" />
          </p>
        </div>
        <span className="absolute -bottom-10 -right-10 size-32 rounded-full bg-orange-500/30" />
      </Link>
      <Link href="/teslimat-ve-kargo" className="group relative flex min-h-[120px] flex-col justify-between overflow-hidden rounded-xl bg-sky-100 p-4 text-ink-900 lg:min-h-0 lg:flex-1">
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
