"use client";

import type { PanelOrder } from "./panel-order";
import { site } from "./site";

const blobToBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
    r.onerror = reject;
    r.readAsDataURL(blob);
  });

/**
 * Fişi sunucuya yükler (Vercel + veritabanı varsa) ve herkese açık PDF bağlantısı döner.
 * Statik demoda (GitHub Pages) API yoktur; null döner ve paylaşım cihazdan yapılır.
 */
export async function uploadFis(order: PanelOrder, pdf: Blob): Promise<string | null> {
  if (!site.api.url) return null;
  try {
    const res = await fetch(`${site.api.url}/fis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref: order.ref, createdAt: order.createdAt, form: order.form, items: order.items, pdfBase64: await blobToBase64(pdf) }),
    });
    if (!res.ok) return null;
    const data = (await res.json().catch(() => ({}))) as { url?: string };
    return data.url ?? null;
  } catch {
    return null;
  }
}
