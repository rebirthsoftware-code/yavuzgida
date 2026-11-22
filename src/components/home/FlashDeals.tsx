"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import type { ProductIndex } from "@/lib/types";
import { ProductRail } from "@/components/product/ProductRail";
import { SectionHeading } from "@/components/ui/SectionHeading";

function Countdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 0);
    const tick = () => setLeft(Math.max(0, end.getTime() - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);
  if (left === null) return <span className="h-7 w-24 rounded bg-ink-100" />;
  const h = Math.floor(left / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  const cell = (n: number) => <span className="grid min-w-8 place-items-center rounded bg-navy-900 px-1 py-0.5 text-sm font-bold tabular-nums text-white">{String(n).padStart(2, "0")}</span>;
  return (
    <span className="flex items-center gap-1 text-ink-900">
      {cell(h)} : {cell(m)} : {cell(s)}
    </span>
  );
}

export function FlashDeals({ items , title = "⚡ Flaş Ürünler", sub = "Gün sonuna kadar geçerli fiyatlar" }: { items: ProductIndex[] ; title?: string; sub?: string }) {
  return (
    <section className="rounded-xl border border-orange-100 bg-gradient-to-b from-orange-50 to-white p-4 sm:p-5">
      <SectionHeading title={title} sub={sub} href="/urunler?etiket=indirim&sirala=populer">
        <span className="hidden items-center gap-2 text-xs font-semibold text-ink-600 sm:flex">
          <Zap className="size-4 text-orange-500" /> Bitimine
          <Countdown />
        </span>
      </SectionHeading>
      <ProductRail items={items} />
    </section>
  );
}
