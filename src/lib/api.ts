import type { OrderRecord, PaymentMethod } from "./order";
import { site } from "./site";
import { demoAdmin } from "./admin-demo";

/**
 * Sipariş API'si istemcisi (api/worker.js). Adres NEXT_PUBLIC_API_URL ile verilir.
 * Tanımlı değilse site WhatsApp / e-posta akışına düşer (bkz. CheckoutForm).
 */

export const orderStatuses = ["odeme-bekliyor", "beklemede", "onaylandi", "hazirlaniyor", "kargolandi", "teslim-edildi", "iptal", "odeme-basarisiz"] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export const statusLabels: Record<OrderStatus, string> = {
  "odeme-bekliyor": "Ödeme bekleniyor",
  beklemede: "Havale bekleniyor",
  onaylandi: "Onaylandı",
  hazirlaniyor: "Hazırlanıyor",
  kargolandi: "Kargoya verildi",
  "teslim-edildi": "Teslim edildi",
  iptal: "İptal edildi",
  "odeme-basarisiz": "Ödeme başarısız",
};

export const statusTone: Record<OrderStatus, string> = {
  "odeme-bekliyor": "bg-orange-100 text-ink-900",
  beklemede: "bg-orange-100 text-ink-900",
  onaylandi: "bg-green-100 text-green-600",
  hazirlaniyor: "bg-[#e3ecf7] text-[#2a5a9a]",
  kargolandi: "bg-[#efe3f7] text-[#6a3a9a]",
  "teslim-edildi": "bg-ink-900 text-white",
  iptal: "bg-paper-100 text-ink-500",
  "odeme-basarisiz": "bg-red-100 text-red-600",
};

/** Müşteriye gösterilen ilerleme adımları. */
export const progressSteps: { key: OrderStatus; label: string }[] = [
  { key: "onaylandi", label: "Onaylandı" },
  { key: "hazirlaniyor", label: "Hazırlanıyor" },
  { key: "kargolandi", label: "Kargoda" },
  { key: "teslim-edildi", label: "Teslim edildi" },
];

export const carriers: Record<string, string> = {
  yurtici: "Yurtiçi Kargo",
  aras: "Aras Kargo",
  mng: "MNG Kargo",
  ptt: "PTT Kargo",
  surat: "Sürat Kargo",
  hepsijet: "HepsiJET",
  ups: "UPS",
  diger: "Diğer",
};

export interface OrderEvent {
  at: string;
  type: "created" | "payment" | "status" | "cargo" | "note";
  status: OrderStatus | null;
  message: string | null;
  actor: "system" | "paytr" | "admin" | "customer";
}

export interface ApiOrder {
  orderNo: string;
  merchantOid?: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: "bekliyor" | "odendi" | "basarisiz" | "kapida";
  paidAmount: number | null;
  totals: { subtotal: number; shipping: number; codFee: number; discount: number; total: number };
  customer: OrderRecord["customer"];
  lines: OrderRecord["lines"];
  carrier: string | null;
  carrierName: string | null;
  trackingNo: string | null;
  trackingUrl: string;
  adminNote?: string | null;
  testMode: boolean;
  events: OrderEvent[];
}

/* ------------------ Anlaşmalı müşteri fişleri (panel) ------------------ */

export const panelStatuses = ["yeni", "onaylandi", "hazirlaniyor", "teslim-edildi", "iptal"] as const;
export type PanelStatus = (typeof panelStatuses)[number];

export const panelStatusLabels: Record<PanelStatus, string> = {
  yeni: "Yeni",
  onaylandi: "Onaylandı",
  hazirlaniyor: "Hazırlanıyor",
  "teslim-edildi": "Teslim edildi",
  iptal: "İptal edildi",
};

export const panelStatusTone: Record<PanelStatus, string> = {
  yeni: "bg-orange-100 text-orange-700",
  onaylandi: "bg-green-100 text-green-600",
  hazirlaniyor: "bg-[#e3ecf7] text-[#2a5a9a]",
  "teslim-edildi": "bg-ink-900 text-white",
  iptal: "bg-paper-100 text-ink-500",
};

export interface PanelApiItem {
  slug: string;
  variantId: string;
  brand: string;
  name: string;
  variantLabel: string;
  sku: string;
  qty: number;
  custom?: string;
}

export interface PanelApiOrder {
  ref: string;
  createdAt: string;
  updatedAt: string;
  status: PanelStatus;
  firm: string;
  name: string;
  phone: string;
  note: string;
  adminNote: string;
  items: PanelApiItem[];
  totalQty: number;
  pdfUrl: string | null;
}

export interface PanelStats {
  byStatus: { status: PanelStatus; n: number }[];
  today: number;
  month: number;
}

/** GitHub Pages demosu: sunucu yok, yönetim paneli tarayıcı içi örnek veriyle çalışır. */
export const DEMO_ADMIN = process.env.NEXT_PUBLIC_DEMO_ADMIN === "1";

export function apiEnabled(): boolean {
  return DEMO_ADMIN || Boolean(site.api.url);
}

async function call<T>(path: string, init: RequestInit = {}, token?: string): Promise<T & { status: "success" | "failed"; reason?: string }> {
  const headers: Record<string, string> = { Accept: "application/json", ...(init.body ? { "Content-Type": "application/json" } : {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const res = await fetch(`${site.api.url}${path}`, { ...init, headers });
    const data = (await res.json().catch(() => ({}))) as T & { status: "success" | "failed"; reason?: string };
    if (!res.ok && !data.reason) data.reason = res.status === 401 ? "Yetkisiz" : `Sunucu hatası (${res.status})`;
    if (!data.status) data.status = res.ok ? "success" : "failed";
    return data;
  } catch {
    return { status: "failed", reason: "Sunucuya ulaşılamadı" } as T & { status: "failed"; reason: string };
  }
}

/* ------------------------------- Müşteri ---------------------------------- */

export interface CreateOrderResponse {
  orderNo: string;
  merchantOid: string;
  total: number;
  totals: ApiOrder["totals"];
  lines: OrderRecord["lines"];
  token?: string;
  demo?: boolean;
  orderStatus: OrderStatus;
}

export function createRemoteOrder(order: OrderRecord) {
  return call<CreateOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify({
      customer: order.customer,
      paymentMethod: order.paymentMethod,
      items: order.lines.map((l) => ({ productSlug: l.productSlug, variantId: l.variantId, quantity: l.quantity })),
    }),
  });
}

export function completeDemoPayment(orderNo: string, approve: boolean) {
  return call<object>("/paytr/demo", { method: "POST", body: JSON.stringify({ orderNo, approve }) });
}

export function trackOrder(orderNo: string, phone: string) {
  return call<{ order: ApiOrder }>(`/track?no=${encodeURIComponent(orderNo.trim())}&phone=${encodeURIComponent(phone.replace(/\D/g, ""))}`);
}

/* -------------------------------- Yönetim --------------------------------- */

export type AdminStats = { byStatus: { status: OrderStatus; n: number; sum: number }[]; today: { n: number; sum: number }; month: { n: number; sum: number } };
export type AdminListParams = { status?: string; q?: string; page?: number };
export type AdminPatch = { status?: OrderStatus; carrier?: string; trackingNo?: string; trackingUrl?: string; adminNote?: string; message?: string };

const realAdmin = {
  login: (password: string) => call<object>("/admin/login", { method: "POST", body: JSON.stringify({ password }) }),
  stats: (token: string) =>
    call<{ byStatus: { status: OrderStatus; n: number; sum: number }[]; today: { n: number; sum: number }; month: { n: number; sum: number } }>("/admin/stats", {}, token),
  list: (token: string, params: { status?: string; q?: string; page?: number }) => {
    const qs = new URLSearchParams();
    if (params.status) qs.set("status", params.status);
    if (params.q) qs.set("q", params.q);
    if (params.page) qs.set("page", String(params.page));
    return call<{ orders: ApiOrder[]; page: number; pages: number; total: number }>(`/admin/orders?${qs}`, {}, token);
  },
  get: (token: string, orderNo: string) => call<{ order: ApiOrder }>(`/admin/orders/${encodeURIComponent(orderNo)}`, {}, token),
  update: (token: string, orderNo: string, patch: AdminPatch) =>
    call<{ order: ApiOrder }>(`/admin/orders/${encodeURIComponent(orderNo)}`, { method: "PATCH", body: JSON.stringify(patch) }, token),
  panelList: (token: string, params: AdminListParams) => {
    const qs = new URLSearchParams();
    if (params.status) qs.set("status", params.status);
    if (params.q) qs.set("q", params.q);
    if (params.page) qs.set("page", String(params.page));
    return call<{ orders: PanelApiOrder[]; page: number; pages: number; total: number; stats: PanelStats }>(`/admin/panel-orders?${qs}`, {}, token);
  },
  panelGet: (token: string, ref: string) => call<{ order: PanelApiOrder }>(`/admin/panel-orders/${encodeURIComponent(ref)}`, {}, token),
  panelUpdate: (token: string, ref: string, patch: { status?: PanelStatus; adminNote?: string }) =>
    call<{ order: PanelApiOrder }>(`/admin/panel-orders/${encodeURIComponent(ref)}`, { method: "PATCH", body: JSON.stringify(patch) }, token),
};

export type AdminApi = typeof realAdmin;

/** Demo modunda tarayıcı içi sahte arka uç; aksi hâlde gerçek API. */
export const admin: AdminApi = DEMO_ADMIN ? (demoAdmin as AdminApi) : realAdmin;
