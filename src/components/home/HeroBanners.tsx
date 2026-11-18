"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { ProductIndex } from "@/lib/types";
import { PackArt } from "@/components/product/PackArt";
import { formatPrice } from "@/lib/format";
import { minPriceOf } from "@/lib/index-of";

type Slide = { cls: string; kicker: string; title: string; text: string; cta: string; href: string; dark?: boolean; items: ProductIndex[] };

export function HeroBanners({ picks }: { picks: ProductIndex[] }) {
  const slides: Slide[] = [
    { cls: "banner-a", kicker: "Haftanın fırsatları", title: "Şurup, çay ve sıcak çikolatada %25'e varan indirim", text: "Kış barı için stok yenileme indirimleri. Fırsatlar stoklarla sınırlıdır.", cta: "Fırsatları Gör", href: "/urunler?etiket=indirim", dark: true, items: picks.slice(0, 3) },
    { cls: "banner-b", kicker: "Kafeler için", title: "Koli alımında birim fiyat düşer", text: "Espresso çekirdekten karton bardağa; koli seçin, birim fiyatınız %6–14 azalsın. Zincir kafelere özel liste.", cta: "Kurumsal Fiyat Al", href: "/kurumsal", dark: true, items: picks.slice(3, 6) },
    { cls: "banner-c", kicker: "Yeni açılan kafelere", title: "İlk siparişte kargo bedava + ücretsiz numune", text: "Barınızı tek siparişle kurun: kahve, şurup, bardak ve ekipman aynı koliden çıksın.", cta: "Alışverişe Başla", href: "/urunler", items: picks.slice(6, 9) },
  ];
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [paused, slides.length]);
  const s = slides[i];

  return (
    <div className="relative overflow-hidden rounded-xl" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className={`${s.cls} relative flex min-h-[260px] items-center transition-all duration-500 sm:min-h-[320px] lg:min-h-[380px] ${s.dark ? "text-white" : "text-ink-900"}`} key={i}>
        <div className="relative z-10 w-full max-w-xl p-6 sm:p-10 animate-fade-in">
          <p className={`text-xs font-bold uppercase tracking-[0.2em] ${s.dark ? "text-white/80" : "text-orange-600"}`}>{s.kicker}</p>
          <h2 className="mt-2 text-2xl font-extrabold leading-tight sm:text-4xl">{s.title}</h2>
          <p className={`mt-3 max-w-md text-sm sm:text-base ${s.dark ? "text-white/85" : "text-ink-600"}`}>{s.text}</p>
          <Link href={s.href} className={`mt-5 inline-flex h-11 items-center gap-2 rounded-lg px-5 text-sm font-bold transition ${s.dark ? "bg-white text-ink-900 hover:bg-orange-50" : "bg-orange-500 text-white hover:bg-orange-600"}`}>
            {s.cta} <ArrowRight className="size-4" />
          </Link>
        </div>
        {/* Ürün kompozisyonu */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 items-end justify-center gap-3 pr-10 sm:flex">
          {s.items.map((p, k) => (
            <div key={p.slug} className={`relative ${k === 1 ? "mb-8 w-[34%]" : "mb-3 w-[27%]"}`}>
              <PackArt art={p.art} hue={p.hue} name={p.name} brand={p.brand} className="h-auto w-full drop-shadow-[0_24px_30px_rgba(0,0,0,0.35)]" />
              <span className="absolute -right-2 top-4 rounded-full bg-white px-2 py-0.5 text-[0.7rem] font-extrabold text-ink-900 shadow-card">{formatPrice(minPriceOf(p))}</span>
            </div>
          ))}
        </div>
        <span className="absolute -right-24 -top-24 size-72 rounded-full bg-white/10" />
        <span className="absolute -bottom-32 right-1/3 size-80 rounded-full bg-white/10" />
      </div>

      <button onClick={() => setI((i - 1 + slides.length) % slides.length)} aria-label="Önceki" className="absolute left-3 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 shadow-card hover:bg-white sm:grid">
        <ChevronLeft className="size-5" />
      </button>
      <button onClick={() => setI((i + 1) % slides.length)} aria-label="Sonraki" className="absolute right-3 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink-900 shadow-card hover:bg-white sm:grid">
        <ChevronRight className="size-5" />
      </button>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {slides.map((_, k) => (
          <button key={k} onClick={() => setI(k)} aria-label={`Slayt ${k + 1}`} className={`h-1.5 rounded-full transition-all ${k === i ? "w-6 bg-white" : "w-1.5 bg-white/50"}`} />
        ))}
      </div>
    </div>
  );
}
