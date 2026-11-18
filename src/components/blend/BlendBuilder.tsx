"use client";

import { useMemo, useState } from "react";
import { Check, MessageCircle, Scale, ShoppingCart, Sparkles, Wand2 } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { PackArt } from "@/components/product/PackArt";
import { formatPrice } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import { site } from "@/lib/site";
import { inputCls } from "@/components/ui/PageShell";

type Origin = { id: string; name: string; country: string; species: "arabica" | "robusta"; price: number; notes: string; body: number; acidity: number; sweet: number };

/* Orijinler: kg başı taban fiyat ve tat profili (0–5). Gerçek tedarik listesiyle güncellenecek. */
const ORIGINS: Origin[] = [
  { id: "brazil", name: "Brezilya Santos", country: "Brezilya", species: "arabica", price: 780, notes: "çikolata, fındık, düşük asidite", body: 4, acidity: 2, sweet: 4 },
  { id: "colombia", name: "Kolombiya Supremo", country: "Kolombiya", species: "arabica", price: 920, notes: "karamel, dengeli, temiz", body: 3, acidity: 3, sweet: 4 },
  { id: "ethiopia", name: "Etiyopya Yirgacheffe", country: "Etiyopya", species: "arabica", price: 1150, notes: "çiçeksi, narenciye, çay gövdesi", body: 2, acidity: 5, sweet: 3 },
  { id: "guatemala", name: "Guatemala Antigua", country: "Guatemala", species: "arabica", price: 980, notes: "kakao, baharat, tatlı", body: 4, acidity: 3, sweet: 4 },
  { id: "kenya", name: "Kenya AA", country: "Kenya", species: "arabica", price: 1250, notes: "kırmızı meyve, parlak asidite", body: 3, acidity: 5, sweet: 3 },
  { id: "honduras", name: "Honduras SHG", country: "Honduras", species: "arabica", price: 860, notes: "fındık, hafif meyve", body: 3, acidity: 3, sweet: 3 },
  { id: "peru", name: "Peru Organik", country: "Peru", species: "arabica", price: 900, notes: "yumuşak, kuru meyve", body: 3, acidity: 3, sweet: 4 },
  { id: "cuba", name: "Küba Serrano", country: "Küba", species: "arabica", price: 1100, notes: "yumuşak, tütsü, düşük asidite", body: 4, acidity: 2, sweet: 3 },
  { id: "sumatra", name: "Sumatra Mandheling", country: "Endonezya", species: "arabica", price: 1050, notes: "toprak, baharat, yoğun gövde", body: 5, acidity: 1, sweet: 3 },
  { id: "india-robusta", name: "Hindistan Robusta", country: "Hindistan", species: "robusta", price: 620, notes: "yoğun gövde, bol krema", body: 5, acidity: 1, sweet: 2 },
  { id: "vietnam-robusta", name: "Vietnam Robusta", country: "Vietnam", species: "robusta", price: 560, notes: "sert, kakao, krema", body: 5, acidity: 1, sweet: 2 },
];

const ROASTS = [
  { id: "acik", name: "Açık", d: "Meyvemsi, asiditesi belirgin", fee: 0 },
  { id: "orta", name: "Orta", d: "Dengeli, tatlı, en çok tercih edilen", fee: 0 },
  { id: "koyu", name: "Koyu", d: "Yoğun, bitter çikolata, bol krema", fee: 0 },
];
const GRINDS = [
  { id: "cekirdek", name: "Çekirdek" },
  { id: "espresso", name: "Espresso öğütüm" },
  { id: "filtre", name: "Filtre öğütüm" },
];
const PACKS = [
  { id: "250", name: "250 g valfli poşet", g: 250, fee: 18 },
  { id: "500", name: "500 g valfli poşet", g: 500, fee: 24 },
  { id: "1000", name: "1 kg valfli poşet", g: 1000, fee: 32 },
];
const COLORS = [
  { id: "kahve", h: 25, name: "Kahverengi" },
  { id: "siyah", h: 220, name: "Lacivert" },
  { id: "yesil", h: 150, name: "Yeşil" },
  { id: "bordo", h: 350, name: "Bordo" },
  { id: "altin", h: 42, name: "Altın" },
];
const PRESETS: { name: string; mix: Record<string, number> }[] = [
  { name: "Klasik İtalyan", mix: { brazil: 60, colombia: 20, "india-robusta": 20 } },
  { name: "Tatlı & Dengeli", mix: { brazil: 50, colombia: 30, guatemala: 20 } },
  { name: "Meyvemsi Spesiyal", mix: { ethiopia: 40, colombia: 40, kenya: 20 } },
  { name: "Yoğun Gövde", mix: { sumatra: 40, brazil: 40, "vietnam-robusta": 20 } },
];
const MIN_KG = 10;

function Bar({ label, v }: { label: string; v: number }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-16 text-ink-600">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100">
        <div className="bg-gold h-full rounded-full transition-all" style={{ width: `${(v / 5) * 100}%` }} />
      </div>
      <span className="w-6 text-right font-semibold text-ink-800">{v.toFixed(1)}</span>
    </div>
  );
}
const ROAST_LABOR_PER_KG = 140; // kavurma + markalama işçiliği (yer tutucu)

export function BlendBuilder() {
  const { add, showPrices } = useCart();
  const [mix, setMix] = useState<Record<string, number>>(PRESETS[1].mix);
  const [roast, setRoast] = useState("orta");
  const [grind, setGrind] = useState("cekirdek");
  const [pack, setPack] = useState("1000");
  const [color, setColor] = useState("kahve");
  const [brand, setBrand] = useState("");
  const [product, setProduct] = useState("Espresso Blend");
  const [kg, setKg] = useState(20);
  const [done, setDone] = useState(false);

  const total = Object.values(mix).reduce((s, v) => s + v, 0);
  const active = ORIGINS.filter((o) => (mix[o.id] ?? 0) > 0);
  const packDef = PACKS.find((p) => p.id === pack)!;
  const units = Math.max(1, Math.round((kg * 1000) / packDef.g));
  const hue = COLORS.find((c) => c.id === color)!.h;
  const brandName = brand.trim() || "Sizin Markanız";

  const profile = useMemo(() => {
    if (total === 0) return { body: 0, acidity: 0, sweet: 0, arabica: 0 };
    const w = (k: "body" | "acidity" | "sweet") => ORIGINS.reduce((s, o) => s + (mix[o.id] ?? 0) * o[k], 0) / total;
    const arabica = ORIGINS.filter((o) => o.species === "arabica").reduce((s, o) => s + (mix[o.id] ?? 0), 0) / total;
    return { body: w("body"), acidity: w("acidity"), sweet: w("sweet"), arabica: Math.round(arabica * 100) };
  }, [mix, total]);

  const pricePerKg = useMemo(() => {
    if (total === 0) return 0;
    const green = ORIGINS.reduce((s, o) => s + ((mix[o.id] ?? 0) / total) * o.price, 0);
    return Math.round((green + ROAST_LABOR_PER_KG) / 0.5) * 0.5; // 0,50 ₺ hassasiyet
  }, [mix, total]);
  const pricePerUnit = Math.round((pricePerKg * packDef.g) / 1000 + packDef.fee);
  const grandTotal = pricePerUnit * units;

  const setPct = (id: string, v: number) => setMix((m) => ({ ...m, [id]: Math.max(0, Math.min(100, Math.round(v))) }));
  const balance = () => {
    if (total === 0) return;
    const next: Record<string, number> = {};
    let acc = 0;
    const ids = Object.keys(mix).filter((k) => mix[k] > 0);
    ids.forEach((k, i) => {
      const v = i === ids.length - 1 ? 100 - acc : Math.round((mix[k] / total) * 100);
      next[k] = v;
      acc += v;
    });
    setMix(next);
  };

  const summary = `${active.map((o) => `%${mix[o.id]} ${o.name}`).join(", ")} · ${ROASTS.find((r) => r.id === roast)!.name} kavurma · ${GRINDS.find((g) => g.id === grind)!.name} · Etiket: ${COLORS.find((c) => c.id === color)!.name}`;
  const valid = total === 100 && brand.trim().length >= 2 && kg >= MIN_KG;

  const addToCart = () => {
    if (!valid) return;
    const key = `${active.map((o) => `${o.id}${mix[o.id]}`).join("-")}-${roast}-${grind}-${color}`;
    add({
      slug: `ozel-harman-${key}`,
      variantId: pack,
      name: product.trim() || "Espresso Blend",
      brand: brandName,
      variantLabel: packDef.name,
      sku: "OZEL-HARMAN",
      price: pricePerUnit,
      qty: units,
      hue,
      art: "pouch",
      category: "kahve",
      custom: `Özel harman: ${summary}. Toplam ${kg} kg.`,
    });
    setDone(true);
    setTimeout(() => setDone(false), 1500);
  };

  const waMessage = `*Yavuz Gıda — Özel Harman Talebi*\nMarka: ${brandName}\nÜrün adı: ${product}\nHarman: ${active.map((o) => `%${mix[o.id]} ${o.name}`).join(", ")}\nKavurma: ${ROASTS.find((r) => r.id === roast)!.name} · Öğütüm: ${GRINDS.find((g) => g.id === grind)!.name}\nAmbalaj: ${packDef.name} × ${units} adet (${kg} kg) · Etiket rengi: ${COLORS.find((c) => c.id === color)!.name}${showPrices ? `\nTahmini: ${formatPrice(grandTotal)} (KDV dâhil)` : ""}\n${site.url}/ozel-harman`;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_380px] lg:items-start">
      <div className="space-y-5">
        {/* 1. Harman */}
        <section className="rounded-lg border border-ink-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-bold text-ink-900">
              <span className="mr-2 rounded bg-coal-900 px-1.5 py-0.5 text-xs text-gold-400">1</span>Orijinler ve oranlar
            </h2>
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${total === 100 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>Toplam %{total}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button key={p.name} onClick={() => setMix(p.mix)} className="inline-flex items-center gap-1 rounded-full border border-ink-200 px-3 py-1 text-xs font-semibold text-ink-700 hover:border-gold-500 hover:text-gold-600">
                <Sparkles className="size-3" /> {p.name}
              </button>
            ))}
            <button onClick={balance} className="inline-flex items-center gap-1 rounded-full border border-ink-200 px-3 py-1 text-xs font-semibold text-ink-700 hover:border-gold-500 hover:text-gold-600">
              <Wand2 className="size-3" /> %100&apos;e dengele
            </button>
          </div>
          <ul className="mt-4 divide-y divide-ink-100">
            {ORIGINS.map((o) => {
              const v = mix[o.id] ?? 0;
              return (
                <li key={o.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-2.5 sm:grid-cols-[200px_1fr_auto]">
                  <div>
                    <p className="text-sm font-semibold text-ink-900">
                      {o.name} <span className={`ml-1 rounded px-1 text-[0.6rem] font-bold uppercase ${o.species === "robusta" ? "bg-orange-50 text-orange-600" : "bg-sky-50 text-sky-700"}`}>{o.species}</span>
                    </p>
                    <p className="text-xs text-ink-500">{o.notes}</p>
                  </div>
                  <input type="range" min={0} max={100} step={5} value={v} onChange={(e) => setPct(o.id, Number(e.target.value))} className="col-span-2 w-full accent-orange-500 sm:col-span-1" aria-label={`${o.name} oranı`} />
                  <div className="row-start-1 flex items-center gap-1 sm:row-start-auto">
                    <input type="number" min={0} max={100} value={v} onChange={(e) => setPct(o.id, Number(e.target.value))} className="h-9 w-16 rounded-md border border-ink-200 px-2 text-right text-sm font-bold outline-none focus:border-orange-500" />
                    <span className="text-sm text-ink-500">%</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 2. Kavurma & öğütüm */}
        <section className="grid gap-5 rounded-lg border border-ink-200 bg-white p-5 sm:grid-cols-2">
          <div>
            <h2 className="text-base font-bold text-ink-900">
              <span className="mr-2 rounded bg-coal-900 px-1.5 py-0.5 text-xs text-gold-400">2</span>Kavurma derecesi
            </h2>
            <div className="mt-3 grid gap-2">
              {ROASTS.map((r) => (
                <button key={r.id} onClick={() => setRoast(r.id)} className={`rounded-lg border-2 px-3 py-2 text-left ${roast === r.id ? "border-orange-500 bg-orange-50" : "border-ink-200 hover:border-ink-400"}`}>
                  <span className="block text-sm font-bold text-ink-900">{r.name}</span>
                  <span className="block text-xs text-ink-500">{r.d}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-base font-bold text-ink-900">
              <span className="mr-2 rounded bg-coal-900 px-1.5 py-0.5 text-xs text-gold-400">3</span>Öğütüm
            </h2>
            <div className="mt-3 grid gap-2">
              {GRINDS.map((g) => (
                <button key={g.id} onClick={() => setGrind(g.id)} className={`rounded-lg border-2 px-3 py-2 text-left text-sm font-bold text-ink-900 ${grind === g.id ? "border-orange-500 bg-orange-50" : "border-ink-200 hover:border-ink-400"}`}>
                  {g.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Marka & ambalaj */}
        <section className="rounded-lg border border-ink-200 bg-white p-5">
          <h2 className="text-base font-bold text-ink-900">
            <span className="mr-2 rounded bg-coal-900 px-1.5 py-0.5 text-xs text-gold-400">4</span>Marka ve ambalaj
          </h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-800">Marka adı (etikete yazılır)</span>
              <input className={inputCls} value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Örn. Nova Coffee" maxLength={24} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-ink-800">Ürün adı</span>
              <input className={inputCls} value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Espresso Blend" maxLength={24} />
            </label>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <span className="mb-1.5 block text-sm font-semibold text-ink-800">Ambalaj</span>
              <div className="grid gap-2">
                {PACKS.map((p) => (
                  <button key={p.id} onClick={() => setPack(p.id)} className={`flex items-center justify-between rounded-lg border-2 px-3 py-2 text-sm ${pack === p.id ? "border-orange-500 bg-orange-50" : "border-ink-200 hover:border-ink-400"}`}>
                    <span className="font-bold text-ink-900">{p.name}</span>
                    {showPrices && <span className="text-xs text-ink-500">+{formatPrice(p.fee)} / adet</span>}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="mb-1.5 block text-sm font-semibold text-ink-800">Etiket rengi</span>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button key={c.id} onClick={() => setColor(c.id)} title={c.name} aria-label={c.name} className={`size-9 rounded-full ring-2 ring-offset-2 ${color === c.id ? "ring-orange-500" : "ring-transparent"}`} style={{ background: `hsl(${c.h} 60% 45%)` }} />
                ))}
              </div>
              <label className="mt-4 block">
                <span className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink-800">
                  <Scale className="size-4 text-ink-400" /> Toplam miktar (kg)
                </span>
                <div className="flex items-center gap-2">
                  <input type="number" min={MIN_KG} step={5} value={kg} onChange={(e) => setKg(Math.max(0, Number(e.target.value)))} className={`${inputCls} w-28`} />
                  <span className="text-sm text-ink-500">= {units} × {packDef.name.split(" valfli")[0]}</span>
                </div>
                <span className="mt-1 block text-xs text-ink-400">Minimum sipariş {MIN_KG} kg.</span>
              </label>
            </div>
          </div>
        </section>
      </div>

      {/* Önizleme & özet */}
      <aside className="space-y-3 lg:sticky lg:top-[8.6rem]">
        <div className="rounded-lg border border-ink-200 bg-white p-5">
          <div className="grid place-items-center rounded-lg bg-[radial-gradient(circle_at_50%_30%,#fff,#efe7dc)] py-4">
            <PackArt art="pouch" hue={hue} name={product.trim() || "Espresso Blend"} brand={brandName} label={packDef.name.split(" valfli")[0]} className="h-56 drop-shadow-[0_18px_24px_rgba(0,0,0,0.25)]" />
          </div>
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-ink-400">Tat profili</p>
          <div className="mt-2 space-y-1.5">
            <Bar label="Gövde" v={profile.body} />
            <Bar label="Asidite" v={profile.acidity} />
            <Bar label="Tatlılık" v={profile.sweet} />
          </div>
          <p className="mt-2 text-xs text-ink-500">
            %{profile.arabica} Arabica · %{100 - profile.arabica} Robusta
          </p>
          <p className="mt-3 border-t border-ink-100 pt-3 text-xs leading-relaxed text-ink-700">{total > 0 ? summary : "Orijin seçin."}</p>

          {showPrices ? (
            <dl className="mt-3 space-y-1 border-t border-ink-100 pt-3 text-sm">
              <div className="flex justify-between text-ink-600">
                <dt>Kg fiyatı (tahmini)</dt>
                <dd>{formatPrice(pricePerKg)}</dd>
              </div>
              <div className="flex justify-between text-ink-600">
                <dt>
                  {units} × {packDef.name.split(" valfli")[0]}
                </dt>
                <dd>{formatPrice(pricePerUnit)} / adet</dd>
              </div>
              <div className="flex justify-between border-t border-ink-100 pt-2">
                <dt className="font-bold text-ink-900">Toplam ({kg} kg)</dt>
                <dd className="text-xl font-extrabold text-orange-600">{formatPrice(grandTotal)}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-3 rounded-md bg-gold-100/50 px-3 py-2 text-xs text-ink-800">Fiyat, anlaşmalı tarifenize göre WhatsApp üzerinden bildirilir.</p>
          )}

          <button onClick={addToCart} disabled={!valid} className={`mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg text-base font-bold text-white transition disabled:opacity-50 ${done ? "bg-green-600" : "bg-orange-500 hover:bg-orange-600"}`}>
            {done ? <Check className="size-5" /> : <ShoppingCart className="size-5" />}
            {done ? "Eklendi" : showPrices ? "Sepete Ekle" : "Listeye Ekle"}
          </button>
          <a href={valid ? whatsappLink(waMessage) : undefined} onClick={(e) => !valid && e.preventDefault()} target="_blank" rel="noopener" className={`mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg border text-sm font-semibold ${valid ? "border-[#25d366] text-[#128c4a] hover:bg-[#25d366]/10" : "cursor-not-allowed border-ink-200 text-ink-400"}`}>
            <MessageCircle className="size-4" /> WhatsApp&apos;tan talep gönder
          </a>
          {!valid && <p className="mt-2 text-center text-[0.7rem] text-ink-400">{total !== 100 ? "Oranların toplamı %100 olmalı." : brand.trim().length < 2 ? "Marka adını yazın." : `Minimum ${MIN_KG} kg.`}</p>}
        </div>
      </aside>
    </div>
  );
}
