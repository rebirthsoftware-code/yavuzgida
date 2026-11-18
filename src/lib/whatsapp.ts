import type { CartItem } from "./cart";
import { site } from "./site";
import { formatPrice } from "./format";

export type OrderForm = { firm: string; name: string; phone: string; note: string };

/** Sepeti WhatsApp mesajına çevirir (mevcut müşteri: fiyatsız; yeni müşteri: fiyatlı). */
export function buildOrderMessage(items: CartItem[], form: OrderForm, withPrices: boolean): string {
  const lines: string[] = [];
  lines.push("*Yavuz Gıda — Sipariş Listesi*");
  if (form.firm) lines.push(`Firma: ${form.firm}`);
  if (form.name) lines.push(`Yetkili: ${form.name}`);
  if (form.phone) lines.push(`Telefon: ${form.phone}`);
  lines.push("");
  items.forEach((it, i) => {
    const price = withPrices ? ` — ${formatPrice(it.price * it.qty)}` : "";
    lines.push(`${i + 1}) ${it.brand} ${it.name} · ${it.variantLabel} × ${it.qty}${price}`);
    if (it.custom) lines.push(`   ${it.custom}`);
    lines.push(`   Stok kodu: ${it.sku}`);
  });
  if (withPrices) {
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    lines.push("", `Ara toplam: ${formatPrice(total)} (KDV dâhil)`);
  }
  if (form.note) lines.push("", `Not: ${form.note}`);
  lines.push("", `Toplam ${items.reduce((s, i) => s + i.qty, 0)} adet · ${items.length} kalem`);
  lines.push(`Gönderim: ${site.url}`);
  return lines.join("\n");
}

export function whatsappLink(message: string): string {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
