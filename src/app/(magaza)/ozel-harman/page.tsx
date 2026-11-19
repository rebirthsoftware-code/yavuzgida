import type { Metadata } from "next";
import { Coffee, Tag, Truck, FlaskConical } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BlendBuilder } from "@/components/blend/BlendBuilder";

export const metadata: Metadata = {
  title: "Özel Harman — Kendi Markanızla Espresso",
  description: "Orijinleri ve oranları belirleyin, kavurma derecesini seçin, markanızın adını yazın; Yavuz Gıda harmanı kavurup markanızla paketlesin.",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-12 pt-3">
      <Breadcrumbs items={[{ label: "Kahve", href: "/kategori/kahve" }, { label: "Özel Harman" }]} />
      <header className="mt-4 overflow-hidden rounded-xl bg-coal-900 text-white">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">Private label · Espresso</p>
            <h1 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">Kendi markanızla espresso harmanı oluşturun</h1>
            <p className="mt-3 max-w-xl text-sm text-white/80">
              Kafenizde kendi adınızla satacağınız espressonun içeriğini siz belirleyin. Orijin oranlarını ayarlayın, kavurma ve öğütümü seçin, markanızı yazın. Yavuz Gıda siparişinize özel kavursun, markanızın adıyla valfli poşete paketleyip göndersin.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-2 text-xs">
            {[
              { icon: FlaskConical, t: "Oranları siz belirleyin", d: "%5 adımlarla 11 orijin" },
              { icon: Coffee, t: "Siparişe özel kavurma", d: "Açık, orta veya koyu" },
              { icon: Tag, t: "Markanızın etiketi", d: "Marka ve ürün adı poşette" },
              { icon: Truck, t: "7–10 iş günü teslim", d: "Minimum 10 kg" },
            ].map(({ icon: I, t, d }) => (
              <li key={t} className="rounded-lg border border-white/10 bg-white/5 p-3">
                <I className="size-4 text-gold-400" />
                <p className="mt-1.5 font-bold">{t}</p>
                <p className="text-white/60">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </header>
      <div className="mt-5">
        <BlendBuilder />
      </div>
      <p className="mt-6 text-xs text-ink-400">Fiyatlar tahminidir; yeşil çekirdek piyasasına göre değişebilir. Nihai teklif numune onayından sonra verilir. Özel harman siparişleri iade kapsamı dışındadır.</p>
    </div>
  );
}
