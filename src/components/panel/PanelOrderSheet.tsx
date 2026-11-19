"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, MessageCircle, FileDown, Printer, ArrowRight, Clock } from "lucide-react";
import { getPanelOrder, listPanelOrders, type PanelOrder } from "@/lib/panel-order";
import { buildOrderMessage, whatsappLink } from "@/lib/whatsapp";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/format";
import { LogoImage } from "@/components/ui/Logo";

/** "Siparişiniz oluşturuluyor" → sipariş fişi: WhatsApp gönderimi ve PDF (yazdır) çıktısı. */
export function PanelOrderSheet() {
  const sp = useSearchParams();
  const ref = sp.get("ref") ?? "";
  const [order, setOrder] = useState<PanelOrder | null | undefined>(undefined);
  const [phase, setPhase] = useState<"creating" | "ready">("creating");
  const [history, setHistory] = useState<PanelOrder[]>([]);

  useEffect(() => {
    const o = ref ? getPanelOrder(ref) : null;
    const t = setTimeout(() => {
      setOrder(o);
      setHistory(listPanelOrders());
      setPhase("ready");
    }, 1400);
    return () => clearTimeout(t);
  }, [ref]);

  if (phase === "creating") {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-gold-100 text-gold-600">
          <Loader2 className="size-9 animate-spin" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-ink-900">Siparişiniz oluşturuluyor…</h1>
        <p className="mt-1 text-sm text-ink-500">Sipariş fişiniz hazırlanıyor, lütfen bekleyin.</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-lg border border-ink-200 bg-white p-10 text-center">
        <h1 className="text-xl font-bold text-ink-900">Sipariş fişi bulunamadı</h1>
        <p className="mt-1 text-sm text-ink-500">Bu cihazda kayıtlı bir fiş yok veya bağlantı eksik.</p>
        {history.length > 0 && (
          <ul className="mx-auto mt-5 max-w-sm divide-y divide-ink-100 rounded-lg border border-ink-200 text-left text-sm">
            {history.map((h) => (
              <li key={h.ref}>
                <Link href={`/panel/siparis?ref=${h.ref}`} className="flex items-center justify-between px-4 py-2.5 hover:bg-paper-50">
                  <span className="font-semibold">{h.ref}</span>
                  <span className="text-xs text-ink-500">{formatDate(h.createdAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Link href="/panel/urunler" className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-orange-500 px-5 text-sm font-bold text-white">
          Kataloğa dön <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  const message = `${buildOrderMessage(order.items, order.form, false)}\nFiş no: ${order.ref}`;
  const total = order.items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px] lg:items-start">
      {/* Fiş (yazdırılır) */}
      <div id="siparis-fisi" className="rounded-lg border border-ink-200 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-200 pb-5">
          <div className="flex items-center gap-3">
            <span className="rounded-lg bg-coal-900 p-1.5">
              <LogoImage className="h-12 w-auto" />
            </span>
            <div>
              <p className="text-lg font-extrabold text-ink-900">Sipariş Fişi</p>
              <p className="text-xs text-ink-500">{site.legal.companyName}</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p className="font-mono text-base font-bold text-ink-900">{order.ref}</p>
            <p className="text-xs text-ink-500">{formatDate(order.createdAt)}</p>
            <p className="mt-1 inline-flex items-center gap-1 rounded bg-gold-100 px-2 py-0.5 text-[0.7rem] font-bold text-gold-600">
              <Clock className="size-3" /> Onay bekliyor
            </p>
          </div>
        </div>
        <dl className="grid gap-x-6 gap-y-2 border-b border-ink-200 py-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-ink-400">Müşteri</dt>
            <dd className="font-semibold text-ink-900">{order.form.firm}</dd>
            {order.form.name && <dd className="text-ink-700">{order.form.name}</dd>}
            <dd className="text-ink-700">{order.form.phone}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-wider text-ink-400">Tedarikçi</dt>
            <dd className="font-semibold text-ink-900">{site.name}</dd>
            <dd className="text-ink-700">{site.contact.phone}</dd>
            <dd className="text-ink-700">{site.contact.email}</dd>
          </div>
          {order.form.note && (
            <div className="sm:col-span-2">
              <dt className="text-xs font-bold uppercase tracking-wider text-ink-400">Not</dt>
              <dd className="text-ink-700">{order.form.note}</dd>
            </div>
          )}
        </dl>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-ink-200 text-left text-xs font-bold uppercase tracking-wider text-ink-500">
              <th className="py-2 pr-2">#</th>
              <th className="py-2 pr-2">Ürün</th>
              <th className="py-2 pr-2">Ambalaj</th>
              <th className="py-2 pr-2">Stok kodu</th>
              <th className="py-2 text-right">Adet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {order.items.map((it, i) => (
              <tr key={`${it.slug}-${it.variantId}`}>
                <td className="py-2 pr-2 text-ink-400">{i + 1}</td>
                <td className="py-2 pr-2">
                  <span className="font-semibold text-ink-900">{it.brand}</span> {it.name}
                  {it.custom && <span className="block text-xs text-ink-500">{it.custom}</span>}
                </td>
                <td className="py-2 pr-2 text-ink-700">{it.variantLabel}</td>
                <td className="py-2 pr-2 font-mono text-xs text-ink-500">{it.sku}</td>
                <td className="py-2 text-right font-bold text-ink-900">{it.qty}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-ink-200">
              <td colSpan={4} className="py-2 text-right text-xs font-bold uppercase tracking-wider text-ink-500">
                Toplam
              </td>
              <td className="py-2 text-right font-extrabold text-ink-900">
                {total} adet · {order.items.length} kalem
              </td>
            </tr>
          </tfoot>
        </table>
        <p className="mt-6 text-[0.7rem] text-ink-400">Bu fiş fiyat içermez; anlaşmalı tarifeniz üzerinden faturalandırılır. Sipariş, Yavuz Gıda tarafından teyit edildikten sonra kesinleşir.</p>
      </div>

      {/* Eylemler */}
      <aside className="space-y-3 print:hidden">
        <div className="rounded-lg border border-green-100 bg-green-100/50 p-4">
          <p className="flex items-center gap-2 font-bold text-green-600">
            <CheckCircle2 className="size-5" /> Sipariş fişiniz hazır
          </p>
          <p className="mt-1 text-xs text-ink-700">Listeyi WhatsApp ile bize gönderin; ekibimiz teyit edip hazırlığa başlasın.</p>
        </div>
        <a href={whatsappLink(message)} target="_blank" rel="noopener" className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#25d366] text-base font-bold text-white hover:bg-[#1ebe5b]">
          <MessageCircle className="size-5" /> WhatsApp&apos;tan Gönder
        </a>
        <button onClick={() => window.print()} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-ink-200 bg-white text-sm font-semibold text-ink-800 hover:bg-paper-100">
          <FileDown className="size-4" /> PDF olarak kaydet
        </button>
        <button onClick={() => window.print()} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-ink-200 bg-white text-sm font-semibold text-ink-800 hover:bg-paper-100">
          <Printer className="size-4" /> Yazdır
        </button>
        <p className="text-[0.7rem] text-ink-400">PDF: açılan yazdırma penceresinde hedef olarak &quot;PDF olarak kaydet&quot; seçin.</p>
        <Link href="/panel/urunler" className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-coal-900 text-sm font-semibold text-white hover:bg-coal-800">
          Yeni sipariş listesi <ArrowRight className="size-4" />
        </Link>
        {history.length > 1 && (
          <div className="rounded-lg border border-ink-200 bg-white p-3 text-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-400">Önceki fişler</p>
            <ul className="mt-2 divide-y divide-ink-100">
              {history
                .filter((h) => h.ref !== order.ref)
                .slice(0, 5)
                .map((h) => (
                  <li key={h.ref}>
                    <Link href={`/panel/siparis?ref=${h.ref}`} className="flex items-center justify-between py-1.5 hover:text-orange-600">
                      <span className="font-mono text-xs font-semibold">{h.ref}</span>
                      <span className="text-xs text-ink-500">{formatDate(h.createdAt)}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}
