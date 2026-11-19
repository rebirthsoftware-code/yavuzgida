"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ClipboardList, ArrowRight, MessageCircle, Copy, Check, Loader2 } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { PackArt } from "@/components/product/PackArt";
import { ButtonLink } from "@/components/ui/Button";
import { Field, inputCls } from "@/components/ui/PageShell";
import { buildOrderMessage, type OrderForm } from "@/lib/whatsapp";
import { savePanelOrder, newPanelRef } from "@/lib/panel-order";

/** Anlaşmalı müşteri sipariş listesi: fiyatsız, onayda WhatsApp + PDF'e dönüşen sipariş fişi. */
export function PanelList() {
  const { items, count, setQty, remove, clear, ready } = useCart();
  const router = useRouter();
  const [form, setForm] = useState<OrderForm>({ firm: "", name: "", phone: "", note: "" });
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const formOk = form.firm.trim().length > 1 && form.phone.replace(/\D/g, "").length >= 10;
  const message = buildOrderMessage(items, form, false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const confirm = () => {
    if (!formOk || busy) return;
    setBusy(true);
    const ref = newPanelRef();
    savePanelOrder({ ref, createdAt: new Date().toISOString(), form, items });
    clear();
    router.push(`/panel/siparis?ref=${encodeURIComponent(ref)}`);
  };

  if (!ready) return <div className="h-64 animate-pulse rounded-lg bg-white" />;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-lg border border-ink-200 bg-white px-6 py-20 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-gold-100 text-gold-600">
          <ClipboardList className="size-9" />
        </span>
        <h2 className="mt-5 text-xl font-bold text-ink-900">Sipariş listeniz boş</h2>
        <p className="mt-1 text-sm text-ink-500">Katalogdan ürünleri seçip “Listeye Ekle” deyin; listeniz burada oluşsun.</p>
        <ButtonLink href="/panel/urunler" className="mt-6">
          Kataloğa Git <ArrowRight className="size-4" />
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_380px] lg:items-start">
      <div className="rounded-lg border border-ink-200 bg-white">
        <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3 text-sm">
          <p className="font-bold text-ink-900">
            Sipariş listesi · {items.length} kalem · {count} adet
          </p>
          <button onClick={clear} className="text-xs font-semibold text-ink-500 hover:text-red-600">
            Listeyi Temizle
          </button>
        </div>
        <ul className="divide-y divide-ink-100">
          {items.map((it) => (
            <li key={`${it.slug}-${it.variantId}`} className="grid grid-cols-[64px_1fr] gap-3 px-4 py-3 sm:grid-cols-[72px_1fr_auto_auto] sm:items-center sm:gap-4">
              <Link href={`/panel/urun/${it.slug}`} className="grid aspect-square place-items-center rounded-md border border-ink-100 bg-paper-50">
                <PackArt art={it.art} hue={it.hue} name={it.name} brand={it.brand} className="h-[80%]" />
              </Link>
              <div className="min-w-0">
                <Link href={`/panel/urun/${it.slug}`} className="text-sm text-ink-800 hover:text-orange-600">
                  <b className="text-ink-900">{it.brand}</b> {it.name} {it.variantLabel}
                </Link>
                {it.custom && <p className="mt-0.5 text-xs text-ink-600">{it.custom}</p>}
                <p className="mt-0.5 text-xs text-ink-500">Stok kodu: {it.sku}</p>
              </div>
              <div className="col-start-2 flex items-center sm:col-start-auto">
                <div className="flex h-9 items-center rounded-md border border-ink-200">
                  <button aria-label="Azalt" onClick={() => setQty(it.slug, it.variantId, it.qty - 1)} className="grid size-9 place-items-center text-orange-600 hover:bg-paper-100">
                    {it.qty <= 1 ? <Trash2 className="size-4" /> : <Minus className="size-4" />}
                  </button>
                  <span className="w-9 text-center text-sm font-bold">{it.qty}</span>
                  <button aria-label="Artır" onClick={() => setQty(it.slug, it.variantId, it.qty + 1)} className="grid size-9 place-items-center text-orange-600 hover:bg-paper-100">
                    <Plus className="size-4" />
                  </button>
                </div>
              </div>
              <button onClick={() => remove(it.slug, it.variantId)} className="hidden text-xs text-ink-400 hover:text-red-600 sm:block">
                Kaldır
              </button>
            </li>
          ))}
        </ul>
      </div>

      <aside className="rounded-lg border border-ink-200 bg-white p-4 lg:sticky lg:top-[9.5rem]">
        <h2 className="text-base font-bold text-ink-900">Siparişi Onayla</h2>
        <p className="mt-1 text-xs text-ink-500">Onayladığınızda sipariş fişiniz oluşturulur; WhatsApp ile Yavuz Gıda&apos;ya iletebilir, PDF olarak kaydedebilirsiniz.</p>
        <div className="mt-3 space-y-3">
          <Field label="Firma / Kafe adı">
            <input className={inputCls} value={form.firm} onChange={(e) => setForm({ ...form, firm: e.target.value })} placeholder="Örn. Nova Coffee Kadıköy" />
          </Field>
          <Field label="Yetkili">
            <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Telefon">
            <input className={inputCls} inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="05xx xxx xx xx" />
          </Field>
          <Field label="Not (opsiyonel)">
            <textarea className={`${inputCls} h-20 py-2`} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Teslimat günü, özel istek…" />
          </Field>
        </div>
        <button onClick={confirm} disabled={!formOk || busy} className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-orange-500 text-base font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-ink-300">
          {busy ? <Loader2 className="size-5 animate-spin" /> : <ClipboardList className="size-5" />}
          {busy ? "Oluşturuluyor…" : "Siparişi Onayla"}
        </button>
        {!formOk && <p className="mt-2 text-center text-[0.7rem] text-ink-400">Firma adı ve telefon zorunludur.</p>}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <button onClick={copy} className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-ink-200 font-semibold text-ink-700 hover:bg-paper-100">
            {copied ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5" />} {copied ? "Kopyalandı" : "Metni kopyala"}
          </button>
          <span className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-paper-50 font-semibold text-ink-500">
            <MessageCircle className="size-3.5 text-[#128c4a]" /> Onayda WhatsApp açılır
          </span>
        </div>
      </aside>
    </div>
  );
}
