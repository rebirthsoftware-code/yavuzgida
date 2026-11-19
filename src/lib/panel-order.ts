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
