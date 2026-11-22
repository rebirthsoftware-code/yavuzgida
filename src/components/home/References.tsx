"use client";

import Link from "next/link";
import { useSiteConfig } from "@/components/config/ConfigProvider";
import { BadgeCheck, MapPin, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const initials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toLocaleUpperCase("tr-TR");

/** Çalıştığımız mağazalar: güven bölümü (logo yoksa monogram). */
export function References({ compact = false }: { compact?: boolean }) {
  const { references, referenceStats: stats } = useSiteConfig();
  return (
    <section>
      <SectionHeading title="Çalıştığımız Mağazalar" sub="Türkiye genelinde kafe, pastane, otel ve restoranların tedarik ortağıyız" href="/kurumsal" linkLabel="Siz de katılın" />
      <div className="overflow-hidden rounded-xl border border-ink-200 bg-white">
        <dl className="grid grid-cols-2 divide-x divide-ink-100 border-b border-ink-100 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-4 text-center">
              <dt className="text-2xl font-extrabold text-ink-900 sm:text-3xl">{s.value}</dt>
              <dd className="text-xs text-ink-500">{s.label}</dd>
            </div>
          ))}
        </dl>
        <ul className={`grid grid-cols-2 gap-px bg-ink-100 sm:grid-cols-3 ${compact ? "lg:grid-cols-4" : "lg:grid-cols-3 xl:grid-cols-4"}`}>
          {references.map((r) => (
            <li key={r.name} className="flex items-center gap-3 bg-white p-4">
              {r.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.logo} alt={r.name} className="size-11 shrink-0 rounded-lg object-contain" />
              ) : (
                <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-coal-900 text-sm font-extrabold text-gold-400">{initials(r.name)}</span>
              )}
              <span className="min-w-0">
                <span className="flex items-center gap-1 truncate text-sm font-bold text-ink-900">
                  {r.name}
                  <BadgeCheck className="size-3.5 shrink-0 text-sky-600" />
                </span>
                <span className="block truncate text-xs text-ink-500">{r.type}</span>
                <span className="flex items-center gap-1 text-[0.7rem] text-ink-400">
                  <MapPin className="size-3" /> {r.city}
                  {r.since ? ` · ${r.since}'den beri` : ""}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 bg-paper-50 px-4 py-3 text-sm">
          <p className="text-ink-600">Referans listemizin tamamı ve iletişim bilgileri talep üzerine paylaşılır.</p>
          <Link href="/kurumsal" className="inline-flex items-center gap-1 font-semibold text-orange-600 hover:underline">
            Kurumsal teklif alın <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
