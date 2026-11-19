"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, MessageCircle, FileDown, Printer, ArrowRight, Clock, Share2, Link2 } from "lucide-react";
import { getPanelOrder, listPanelOrders, type PanelOrder } from "@/lib/panel-order";
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
  const [order, setOrder] = useState<PanelOrder | null | undefined>(undefined);
  const [phase, setPhase] = useState<"creating" | "ready">("creating");
  const [step, setStep] = useState("Sipariş fişiniz hazırlanıyor…");
  const [history, setHistory] = useState<PanelOrder[]>([]);
  const [pdf, setPdf] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [shareState, setShareState] = useState<"idle" | "sharing" | "fallback">("idle");

  useEffect(() => {
    let cancelled = false;
    const o = ref ? getPanelOrder(ref) : null;
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
  }, [ref]);

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
  const message = `${buildOrderMessage(order.items, order.form, false)}\nFiş no: ${order.ref}${pdfUrl ? `\nPDF: ${pdfUrl}` : ""}`;
  const total = order.items.reduce((s, i) => s + i.qty, 0);

  const downloadPdf = () => {
    if (!pdf) return window.print();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(pdf);
    a.download = fileName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
  };

  /** PDF'i WhatsApp ile gönder: paylaşım menüsü destekliyorsa dosya olarak; değilse indir + metin/bağlantı ile WhatsApp. */
  const shareViaWhatsApp = async () => {
    if (pdf && typeof navigator !== "undefined" && "canShare" in navigator) {
      const file = new File([pdf], fileName, { type: "application/pdf" });
      if (navigator.canShare({ files: [file] })) {
        try {
          setShareState("sharing");
          await navigator.share({ files: [file], title: `Sipariş Fişi ${order.ref}`, text: `Yavuz Gıda sipariş fişi ${order.ref} · ${order.form.firm}` });
          setShareState("idle");
          return;
        } catch (e) {
          setShareState("idle");
          if ((e as Error).name === "AbortError") return;
        }
      }
    }
    setShareState("fallback");
    downloadPdf();
    window.open(whatsappLink(message), "_blank", "noopener");
  };

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
        <button onClick={shareViaWhatsApp} disabled={shareState === "sharing"} className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#25d366] text-base font-bold text-white hover:bg-[#1ebe5b] disabled:opacity-60">
          {shareState === "sharing" ? <Loader2 className="size-5 animate-spin" /> : <MessageCircle className="size-5" />} PDF&apos;i WhatsApp ile Gönder
        </button>
        {shareState === "fallback" && (
          <p className="rounded-lg bg-orange-50 p-3 text-xs text-ink-800">
            Bu cihazda dosya paylaşımı desteklenmiyor: PDF indirildi ve WhatsApp açıldı. {pdfUrl ? "Mesajda PDF bağlantısı hazır." : "İndirilen PDF'i sohbete ataç olarak ekleyin."}
          </p>
        )}
        {pdfUrl && (
          <a href={pdfUrl} target="_blank" rel="noopener" className="flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2 text-xs text-ink-600 hover:bg-paper-100">
            <Link2 className="size-3.5 shrink-0 text-sky-700" /> <span className="truncate">{pdfUrl}</span>
          </a>
        )}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={downloadPdf} className="flex h-11 items-center justify-center gap-2 rounded-lg border border-ink-200 bg-white text-sm font-semibold text-ink-800 hover:bg-paper-100">
            <FileDown className="size-4" /> PDF indir
          </button>
          <button onClick={() => window.print()} className="flex h-11 items-center justify-center gap-2 rounded-lg border border-ink-200 bg-white text-sm font-semibold text-ink-800 hover:bg-paper-100">
            <Printer className="size-4" /> Yazdır
          </button>
        </div>
        <a href={whatsappLink(message)} target="_blank" rel="noopener" className="flex items-center justify-center gap-1.5 text-xs font-semibold text-ink-500 hover:text-[#128c4a]">
          <Share2 className="size-3.5" /> Yalnızca metin olarak WhatsApp&apos;tan gönder
        </a>
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
