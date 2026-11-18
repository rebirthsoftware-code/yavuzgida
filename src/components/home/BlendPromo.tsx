import Link from "next/link";
import { ArrowRight, Coffee, Tag, Flame } from "lucide-react";
import { PackArt } from "@/components/product/PackArt";

/** Özel harman (private label espresso) tanıtım bandı. */
export function BlendPromo() {
  return (
    <section className="relative overflow-hidden rounded-xl bg-[radial-gradient(900px_400px_at_90%_0%,#3b2415,#1a120c_60%)] text-white">
      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">Private label · Özel harman</p>
          <h2 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">Kendi markanızla espresso çekirdeği</h2>
          <p className="mt-3 max-w-xl text-sm text-white/80 sm:text-base">
            Orijinleri ve oranları siz belirleyin (örn. %70 Brezilya, %20 Kolombiya, %10 Etiyopya), kavurma derecesini seçin, markanızın adını yazın. Yavuz Gıda harmanı sizin için kavursun, markanızın adıyla paketleyip göndersin.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/80">
            <li className="flex items-center gap-1.5">
              <Coffee className="size-4 text-gold-400" /> 10 orijin, 3 kavurma derecesi
            </li>
            <li className="flex items-center gap-1.5">
              <Tag className="size-4 text-gold-400" /> Markanızın adıyla etiket
            </li>
            <li className="flex items-center gap-1.5">
              <Flame className="size-4 text-gold-400" /> Siparişe özel taze kavurma
            </li>
          </ul>
          <Link href="/ozel-harman" className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-gold px-5 text-sm font-bold text-coal-950 hover:brightness-105">
            Harmanınızı oluşturun <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="hidden items-end justify-center gap-3 lg:flex">
          {[
            { b: "NOVA COFFEE", n: "House Espresso", h: 24 },
            { b: "KADIKÖY ROASTERS", n: "Signature Blend", h: 18 },
            { b: "SİZİN MARKANIZ", n: "Espresso Blend", h: 30 },
          ].map((x, i) => (
            <div key={x.b} className={i === 1 ? "w-[32%]" : "w-[26%]"}>
              <PackArt art="pouch" hue={x.h} name={x.n} brand={x.b} label="1 kg" className="w-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
