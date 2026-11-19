"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, MessageCircle, FileDown, Printer, ArrowRight, Clock, Share2, Link2 } from "lucide-react";
import { getPanelOrder, listPanelOrders, savePanelOrder, encodePanelOrder, decodePanelOrder, type PanelOrder } from "@/lib/panel-order";
import indexJson from "@/data/catalog-index.json";
import type { ProductIndex } from "@/lib/types";

const index = indexJson as ProductIndex[];
const lookup = (slug: string, variantId: string) => {
  const p = index.find((x) => x.slug === slug);
  const v = p?.variants.find((x) => x.id === variantId);
  if (!p || !v) return null;
  return { slug, variantId, name: p.name, brand: p.brand, variantLabel: v.label, sku: v.sku, price: v.price, hue: p.hue, art: p.art, image: p.image, category: p.category };
};
import { buildOrderMessage, whatsappLink } from "@/lib/whatsapp";
import { buildOrderPdf, pdfFileName } from "@/lib/order-pdf";
import { uploadFis } from "@/lib/fis-api";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/format";
import { LogoImage } from "@/components/ui/Logo";

/** "Siparişiniz oluşturuluyor" → sipariş fişi: WhatsApp gönderimi ve PDF (yazdır) çıktısı. */
export function PanelOrderSheet() {
  const sp = useSearchParams();
  const ref = sp.get("ref") ?? "";
  const packed = sp.get("d") ?? "";
  const [order, setOrder] = useState<PanelOrder | null | undefined>(undefined);
  const [phase, setPhase] = useState<"creating" | "ready">("creating");
  const [step, setStep] = useState("Sipariş fişiniz hazırlanıyor…");
  const [history, setHistory] = useState<PanelOrder[]>([]);
  const [pdf, setPdf] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [shareState, setShareState] = useState<"idle" | "sharing" | "shared" | "fallback">("idle");

  useEffect(() => {
    let cancelled = false;
    let o = ref ? getPanelOrder(ref) : null;
    if (!o && packed) {
      // Bağlantıyla açıldı (firma tarafı): fişi bağlantıdan kur ve bu cihaza da kaydet
      o = decodePanelOrder(packed, lookup);
      if (o) savePanelOrder(o);
    }
    (async () => {
      let blob: Blob | null = null;
      let url: string | null = null;
      if (o) {
        setStep("PDF oluşturuluyor…");
        blob = await buildOrderPdf(o).catch(() => null);
        if (blob) {
          setStep("Fiş kaydediliyor…");
          url = await uploadFis(o, blob);
        }
      }
      await new Promise((r) => setTimeout(r, 500));
      if (cancelled) return;
      setOrder(o);
      setPdf(blob);
      setPdfUrl(url);
      setHistory(listPanelOrders());
      setPhase("ready");
    })();
    return () => {
      cancelled = true;
    };
  }, [ref, packed]);

  if (phase === "creating") {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-gold-100 text-gold-600">
          <Loader2 className="size-9 animate-spin" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-ink-900">Siparişiniz oluşturuluyor…</h1>
        <p className="mt-1 text-sm text-ink-500">{step}</p>
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

  const fileName = pdfFileName(order.ref);
  const sheetUrl = `${site.url}/panel/siparis?ref=${encodeURIComponent(order.ref)}&d=${encodePanelOrder(order)}`;
  const message = `${buildOrderMessage(order.items, order.form, false)}\nFiş no: ${order.ref}\n\nPDF fiş: ${pdfUrl ?? sheetUrl}`;
  const total = order.items.reduce((s, i) => s + i.qty, 0);

  const downloadPdf = () => {
    if (!pdf) return window.print();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(pdf);
    a.download = fileName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
  };

  const waHref = whatsappLink(message);

  /**
   * PDF'i WhatsApp ile gönder (2 adım): 1) paylaşım menüsüyle PDF dosya olarak gider;
   * WhatsApp dosya paylaşımında metni düşürdüğü için 2) paylaşım bitince sipariş mesajı
   * otomatik WhatsApp'ta açılır. Paylaşım desteklenmiyorsa PDF indirilir + mesaj açılır.
   */
  const shareViaWhatsApp = async () => {
    if (pdf && typeof navigator !== "undefined" && "canShare" in navigator) {
      const file = new File([pdf], fileName, { type: "application/pdf" });
      if (navigator.canShare({ files: [file] })) {
        try {
          setShareState("sharing");
          await navigator.share({ files: [file], title: `Sipariş Fişi ${order.ref}`, text: message });
          setShareState("shared");
          // 2. adım: sipariş mesajı (paylaşımda metin iletilmez)
          setTimeout(() => {
            window.location.href = waHref;
          }, 700);
          return;
        } catch (e) {
          setShareState("idle");
          if ((e as Error).name === "AbortError") return;
        }
      }
    }
    setShareState("fallback");
    downloadPdf();
    window.open(waHref, "_blank", "noopener");
  };

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
      {/* Fiş (yazdırılır) */}
      <div id="siparis-fisi" className="min-w-0 rounded-lg border border-ink-200 bg-white p-4 sm:p-8">
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
          <div className="text-left text-sm sm:text-right">
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
        <table className="mt-4 w-full table-fixed text-sm sm:table-auto">
          <thead>
            <tr className="border-b border-ink-200 text-left text-xs font-bold uppercase tracking-wider text-ink-500">
              <th className="w-6 py-2 pr-2">#</th>
              <th className="py-2 pr-2">Ürün</th>
              <th className="w-16 py-2 pr-2 sm:w-auto">Ambalaj</th>
              <th className="hidden py-2 pr-2 sm:table-cell">Stok kodu</th>
              <th className="w-12 py-2 text-right sm:w-auto">Adet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {order.items.map((it, i) => (
              <tr key={`${it.slug}-${it.variantId}`}>
                <td className="py-2 pr-2 text-ink-400">{i + 1}</td>
                <td className="break-words py-2 pr-2">
                  <span className="font-semibold text-ink-900">{it.brand}</span> {it.name}
                  {it.custom && <span className="block text-xs text-ink-500">{it.custom}</span>}
                  <span className="block font-mono text-[0.65rem] text-ink-400 sm:hidden">{it.sku}</span>
                </td>
                <td className="py-2 pr-2 text-ink-700">{it.variantLabel}</td>
                <td className="hidden py-2 pr-2 font-mono text-xs text-ink-500 sm:table-cell">{it.sku}</td>
                <td className="py-2 text-right font-bold text-ink-900">{it.qty}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-ink-200">
              <td colSpan={3} className="py-2 text-right sm:hidden">
                Toplam
              </td>
              <td colSpan={4} className="hidden py-2 text-right sm:table-cell text-xs font-bold uppercase tracking-wider text-ink-500">
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
      <aside className="min-w-0 space-y-3 print:hidden">
        <div className="rounded-lg border border-green-100 bg-green-100/50 p-4">
          <p className="flex items-center gap-2 font-bold text-green-600">
            <CheckCircle2 className="size-5" /> Sipariş fişiniz hazır
          </p>
          <p className="mt-1 text-xs text-ink-700">Listeyi WhatsApp ile bize gönderin; ekibimiz teyit edip hazırlığa başlasın.</p>
        </div>
        <a href={waHref} target="_blank" rel="noopener" className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#25d366] text-base font-bold text-white hover:bg-[#1ebe5b]">
          <MessageCircle className="size-5" /> WhatsApp&apos;tan Gönder
        </a>
        <p className="text-[0.7rem] leading-relaxed text-ink-500">Mesajda sipariş listesi ve <b>PDF fiş bağlantısı</b> yer alır; firma bağlantıdan fişi açar ve indirir.</p>
        <details className="rounded-lg border border-ink-200 bg-white p-3 text-sm">
          <summary className="cursor-pointer text-xs font-bold uppercase tracking-wider text-ink-500">PDF&apos;i dosya olarak paylaş (isteğe bağlı)</summary>
          <button onClick={shareViaWhatsApp} disabled={shareState === "sharing"} className={`mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg border text-sm font-bold disabled:opacity-60 ${shareState === "shared" ? "border-green-600 text-green-600" : "border-ink-200 text-ink-700 hover:bg-paper-100"}`}>
            {shareState === "sharing" ? <Loader2 className="size-4 animate-spin" /> : shareState === "shared" ? <CheckCircle2 className="size-4" /> : <Share2 className="size-4" />}
            {shareState === "shared" ? "PDF paylaşıldı" : "PDF dosyasını paylaş"}
          </button>
          <p className="mt-2 text-[0.7rem] leading-relaxed text-ink-500">Paylaşım menüsünden WhatsApp seçilir; WhatsApp dosyayla birlikte metni almadığı için ardından sipariş mesajı otomatik açılır.</p>
          {shareState === "fallback" && <p className="mt-2 rounded-lg bg-orange-50 p-2.5 text-xs text-ink-800">Bu cihazda dosya paylaşımı desteklenmiyor: PDF indirildi ve WhatsApp mesajı açıldı.</p>}
        </details>
        <a href={pdfUrl ?? sheetUrl} target="_blank" rel="noopener" className="flex min-w-0 items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2 text-xs text-ink-600 hover:bg-paper-100">
          <Link2 className="size-3.5 shrink-0 text-sky-700" /> <span className="min-w-0 truncate">{pdfUrl ?? sheetUrl}</span>
        </a>
        <div className="grid grid-cols-3 gap-2 text-center">
          <button onClick={downloadPdf} className="flex h-11 items-center justify-center gap-1.5 rounded-lg border border-ink-200 bg-white px-1 text-xs font-semibold text-ink-800 hover:bg-paper-100 sm:gap-2 sm:text-sm">
            <FileDown className="size-4 shrink-0" /> PDF indir
          </button>
          <button onClick={() => pdf && window.open(URL.createObjectURL(pdf), "_blank")} className="flex h-11 items-center justify-center gap-1.5 rounded-lg border border-ink-200 bg-white px-1 text-xs font-semibold text-ink-800 hover:bg-paper-100 sm:gap-2 sm:text-sm">
            <Link2 className="size-4 shrink-0" /> PDF&apos;i aç
          </button>
          <button onClick={() => window.print()} className="flex h-11 items-center justify-center gap-1.5 rounded-lg border border-ink-200 bg-white px-1 text-xs font-semibold text-ink-800 hover:bg-paper-100 sm:gap-2 sm:text-sm">
            <Printer className="size-4 shrink-0" /> Yazdır
          </button>
        </div>
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
