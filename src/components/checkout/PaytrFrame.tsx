"use client";

import Link from "next/link";
import Script from "next/script";
import { ShieldCheck, ExternalLink, Lock } from "lucide-react";
import { useLastOrder } from "@/lib/last-order";
import { paytrIframeUrl } from "@/lib/paytr";
import { formatPrice } from "@/lib/format";
import { DemoCardForm } from "./DemoCardForm";

declare global {
  interface Window {
    iFrameResize?: (options: Record<string, unknown>, selector: string) => void;
  }
}

export function PaytrFrame() {
  const order = useLastOrder();
  const token = order?.paytr?.token;
  const demo = order?.paytr?.demo;

  if (!order || (!token && !demo)) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-dashed border-ink-200 p-10 text-center">
        <h2 className="text-2xl font-semibold text-ink-900">Ödeme oturumu bulunamadı</h2>
        <p className="mt-2 text-sm text-ink-500">Ödeme sayfasının süresi dolmuş olabilir. Lütfen ödeme adımına geri dönün.</p>
        <Link href="/odeme" className="mt-6 inline-flex h-12 items-center rounded-full bg-ink-900 px-7 text-sm font-semibold text-white">
          Ödeme adımına dön
        </Link>
      </div>
    );
  }

  const url = paytrIframeUrl(token ?? "");

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8">
        {demo ? (
          <DemoCardForm order={order} />
        ) : (
        <div className="overflow-hidden rounded-xl border border-ink-200 bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-ink-200 bg-paper-50 px-5 py-3 text-xs font-semibold text-ink-700">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-green-600" /> PayTR güvenli ödeme · 3D Secure
            </span>
            <span className="font-mono">{order.orderNo}</span>
          </div>
          <Script src="https://www.paytr.com/js/iframeResizer.min.js" strategy="afterInteractive" onLoad={() => window.iFrameResize?.({}, "#paytriframe")} />
          <iframe
            src={url}
            id="paytriframe"
            title="PayTR güvenli ödeme"
            frameBorder="0"
            scrolling="no"
            className="min-h-[560px] w-full"
            allow="payment"
          />
        </div>
        )}
        {!demo && (
        <p className="mt-3 text-xs text-ink-500">
          Ödeme penceresi açılmadıysa{" "}
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-orange-600 underline underline-offset-2">
            yeni sekmede açın <ExternalLink className="h-3 w-3" />
          </a>
          .
        </p>
        )}
      </div>
      <aside className="lg:col-span-4">
        <div className="sticky top-28 rounded-xl border border-ink-200 bg-paper-50 p-6">
          <h2 className="text-xl font-semibold text-ink-900">Sipariş özeti</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {order.lines.map((l) => (
              <li key={`${l.productSlug}-${l.variantId}`} className="flex justify-between gap-3">
                <span className="text-ink-800">
                  {l.name} <span className="text-ink-500">({l.variantLabel}) × {l.quantity}</span>
                </span>
                <span className="font-semibold tabular-nums">{formatPrice(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1.5 border-t border-ink-200 pt-3 text-sm">
            {order.totals.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <dt>Sepet indirimi</dt>
                <dd className="tabular-nums">-{formatPrice(order.totals.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink-700">Kargo</dt>
              <dd className="tabular-nums">{order.totals.shipping ? formatPrice(order.totals.shipping) : "Ücretsiz"}</dd>
            </div>
            <div className="flex justify-between text-base font-bold">
              <dt>Toplam</dt>
              <dd className="tabular-nums">{formatPrice(order.totals.total)}</dd>
            </div>
          </dl>
          <p className="mt-4 flex items-start gap-2 text-xs text-ink-500">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
            {demo ? "Demo modu: kart bilgisi gönderilmez, tahsilat yapılmaz." : "Kart bilgileriniz Yavuz sunucularına ulaşmaz; ödeme PayTR'nin güvenli sayfasında tamamlanır."}
          </p>
        </div>
      </aside>
    </div>
  );
}
