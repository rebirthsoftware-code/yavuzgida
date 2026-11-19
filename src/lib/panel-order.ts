import type { CartItem } from "./cart";
import type { OrderForm } from "./whatsapp";

/** Anlaşmalı müşteri paneli sipariş fişi: cihazda saklanır (sunucu kaydı yok; liste WhatsApp ile iletilir). */
export type PanelOrder = { ref: string; createdAt: string; form: OrderForm; items: CartItem[] };

const KEY = "yavuz-panel-orders-v1";

export function newPanelRef(date = new Date()): string {
  const ymd = `${String(date.getFullYear()).slice(2)}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(Math.random() * 36 ** 3).toString(36).toUpperCase().padStart(3, "0");
  return `YL-${ymd}-${rand}`;
}

function readAll(): PanelOrder[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PanelOrder[]) : [];
  } catch {
    return [];
  }
}

export function savePanelOrder(order: PanelOrder) {
  try {
    const all = [order, ...readAll().filter((o) => o.ref !== order.ref)].slice(0, 20);
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {}
}

export function getPanelOrder(ref: string): PanelOrder | null {
  return readAll().find((o) => o.ref === ref) ?? null;
}

export function listPanelOrders(): PanelOrder[] {
  return readAll();
}

/* ---------- Bağlantıya gömülü fiş (sunucusuz paylaşım) ---------- */

type Packed = { r: string; t: string; f: string; n?: string; p: string; o?: string; i: (string | number)[][] };

const b64url = {
  enc: (s: string) => btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
  dec: (s: string) => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0))),
};

/** Fişi kısa bir bağlantı parametresine çevirir; katalog ürünleri slug+boy+adet, özel kalemler açık yazılır. */
export function encodePanelOrder(o: PanelOrder): string {
  const packed: Packed = {
    r: o.ref,
    t: o.createdAt,
    f: o.form.firm,
    ...(o.form.name ? { n: o.form.name } : {}),
    p: o.form.phone,
    ...(o.form.note ? { o: o.form.note } : {}),
    i: o.items.map((it) => (it.custom ? [it.slug, it.variantId, it.qty, it.name, it.brand, it.variantLabel, it.sku, it.custom] : [it.slug, it.variantId, it.qty])),
  };
  return b64url.enc(JSON.stringify(packed));
}

/** Bağlantı parametresinden fişi geri kurar; katalog bilgisi `lookup` ile tamamlanır. */
export function decodePanelOrder(d: string, lookup: (slug: string, variantId: string) => Omit<CartItem, "qty"> | null): PanelOrder | null {
  try {
    const x = JSON.parse(b64url.dec(d)) as Packed;
    if (!x.r || !Array.isArray(x.i)) return null;
    const items: CartItem[] = [];
    for (const row of x.i) {
      const [slug, variantId, qty, name, brand, label, sku, custom] = row as [string, string, number, string?, string?, string?, string?, string?];
      if (name) items.push({ slug, variantId, qty: Number(qty) || 1, name, brand: brand ?? "", variantLabel: label ?? "", sku: sku ?? "", price: 0, hue: 25, art: "pouch", category: "kahve", custom });
      else {
        const base = lookup(slug, variantId);
        if (base) items.push({ ...base, qty: Number(qty) || 1 });
      }
    }
    if (items.length === 0) return null;
    return { ref: x.r, createdAt: x.t ?? new Date().toISOString(), form: { firm: x.f ?? "", name: x.n ?? "", phone: x.p ?? "", note: x.o ?? "" }, items };
  } catch {
    return null;
  }
}
