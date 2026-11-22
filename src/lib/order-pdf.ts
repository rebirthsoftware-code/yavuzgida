"use client";

import type { PanelOrder } from "./panel-order";
import { site } from "./site";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

async function toBase64(url: string): Promise<string> {
  const buf = await (await fetch(url)).arrayBuffer();
  let bin = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

const fmtDate = (iso: string) => new Date(iso).toLocaleString("tr-TR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

/**
 * Sipariş fişini gerçek PDF dosyası olarak üretir (A4, Türkçe karakter destekli Roboto gömülü).
 * jsPDF yalnızca tarayıcıda, ihtiyaç anında yüklenir.
 */
export async function buildOrderPdf(order: PanelOrder, supplier: { phone: string; email: string; companyName: string } = { phone: site.contact.phone, email: site.contact.email, companyName: site.legal.companyName }): Promise<Blob> {
  const [{ jsPDF }, { default: autoTable }, regular, bold, logo] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
    toBase64(`${base}/fonts/Roboto-400.ttf`),
    toBase64(`${base}/fonts/Roboto-700.ttf`),
    toBase64(`${base}/brand/logo-pdf.png`).catch(() => ""),
  ]);
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  doc.addFileToVFS("Roboto-400.ttf", regular);
  doc.addFont("Roboto-400.ttf", "Roboto", "normal");
  doc.addFileToVFS("Roboto-700.ttf", bold);
  doc.addFont("Roboto-700.ttf", "Roboto", "bold");
  doc.setFont("Roboto", "normal");

  const W = doc.internal.pageSize.getWidth();
  const M = 14;

  // Üst bant
  doc.setFillColor(20, 20, 20);
  doc.rect(0, 0, W, 30, "F");
  if (logo) doc.addImage(`data:image/png;base64,${logo}`, "PNG", M, 4, 29, 21.6);
  doc.setTextColor(255, 255, 255);
  doc.setFont("Roboto", "bold");
  doc.setFontSize(16);
  doc.text("SİPARİŞ FİŞİ", W - M, 13, { align: "right" });
  doc.setFont("Roboto", "normal");
  doc.setFontSize(9);
  doc.setTextColor(212, 162, 76);
  doc.text("Anlaşmalı müşteri siparişi · fiyat içermez", W - M, 19, { align: "right" });
  doc.setTextColor(200, 200, 200);
  doc.text(`${order.ref} · ${fmtDate(order.createdAt)}`, W - M, 24.5, { align: "right" });

  // Taraflar
  let y = 40;
  doc.setTextColor(40, 40, 40);
  const block = (x: number, title: string, lines: string[]) => {
    doc.setFont("Roboto", "bold");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(title.toUpperCase(), x, y);
    doc.setFontSize(10.5);
    doc.setTextColor(30, 30, 30);
    lines.forEach((l, i) => {
      doc.setFont("Roboto", i === 0 ? "bold" : "normal");
      doc.text(l, x, y + 5.5 + i * 5);
    });
  };
  block(M, "Müşteri", [order.form.firm, order.form.name, order.form.phone].filter(Boolean));
  block(W / 2 + 4, "Tedarikçi", [site.name, supplier.phone, supplier.email, supplier.companyName]);
  y += 30;
  if (order.form.note) {
    doc.setFont("Roboto", "bold");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("NOT", M, y);
    doc.setFont("Roboto", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    const lines = doc.splitTextToSize(order.form.note, W - 2 * M) as string[];
    doc.text(lines, M, y + 5);
    y += 8 + lines.length * 5;
  }

  // Kalemler
  autoTable(doc, {
    startY: y + 2,
    margin: { left: M, right: M },
    head: [["#", "Ürün", "Ambalaj", "Stok kodu", "Adet"]],
    body: order.items.map((it, i) => [String(i + 1), `${it.brand} ${it.name}${it.custom ? `\n${it.custom}` : ""}`, it.variantLabel, it.sku, String(it.qty)]),
    foot: [["", "", "", "Toplam", `${order.items.reduce((s, i) => s + i.qty, 0)} adet · ${order.items.length} kalem`]],
    styles: { font: "Roboto", fontSize: 9.5, cellPadding: 2.5, textColor: [30, 30, 30] },
    headStyles: { fillColor: [20, 20, 20], textColor: [255, 255, 255], font: "Roboto", fontStyle: "bold" },
    footStyles: { fillColor: [245, 245, 245], textColor: [20, 20, 20], font: "Roboto", fontStyle: "bold" },
    columnStyles: { 0: { cellWidth: 8, textColor: [140, 140, 140] }, 2: { cellWidth: 34 }, 3: { cellWidth: 40, fontSize: 8, textColor: [110, 110, 110] }, 4: { cellWidth: 30, halign: "right", fontStyle: "bold" } },
    alternateRowStyles: { fillColor: [250, 250, 249] },
  });

  // Alt bilgi
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    const H = doc.internal.pageSize.getHeight();
    doc.setFont("Roboto", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(140, 140, 140);
    doc.text("Bu fiş fiyat içermez; anlaşmalı tarifeniz üzerinden faturalandırılır. Sipariş, Yavuz Gıda tarafından teyit edildikten sonra kesinleşir.", M, H - 10, { maxWidth: W - 2 * M - 20 });
    doc.text(`${p} / ${pageCount}`, W - M, H - 10, { align: "right" });
  }
  return doc.output("blob");
}

export const pdfFileName = (ref: string) => `YavuzGida-Siparis-${ref}.pdf`;
