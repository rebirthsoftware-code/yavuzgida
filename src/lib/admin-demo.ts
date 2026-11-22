"use client";

/**
 * Yönetim paneli demo arka ucu (GitHub Pages).
 * Sunucu olmadığı için örnek e-ticaret siparişleri tarayıcıda üretilir; anlaşmalı müşteri fişleri
 * bu tarayıcıda oluşturulan gerçek fişlerden (localStorage) + birkaç örnekten oluşur.
 * Durum değişiklikleri localStorage'da saklanır. Giriş şifresi: "demo".
 */
import type { ApiOrder, OrderStatus, OrderEvent, PanelApiOrder, PanelStatus, PanelStats, AdminStats, AdminListParams, AdminPatch } from "./api";
import type { ProductIndex } from "./types";
import { listPanelOrders } from "./panel-order";
import { applyPatch, CUSTOM_PREFIX, slugify, type ProductPatch, type SiteConfig } from "./content";
import { readDemoContent, demoSaveConfig, demoSavePatch, demoSaveCustom, demoRemoveProduct } from "./demo-content";
import { parseCsv, rowsToImport } from "./csv";
import type { Product } from "./types";

export const DEMO_PASSWORD = "demo";
const ORDERS_KEY = "yavuz-demo-orders-v1";
const PANEL_KEY = "yavuz-demo-panel-v1";

type Ok<T> = T & { status: "success" };
type Failed = { status: "failed"; reason: string };
const ok = <T,>(data: T): Ok<T> => ({ ...data, status: "success" });
const failed = (reason: string): Failed => ({ status: "failed", reason });
const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, v: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {}
};

/* ------------------------------ Örnek veri ------------------------------ */

const NAMES = ["Ayşe Demir", "Mehmet Kaya", "Elif Şahin", "Burak Yıldız", "Zeynep Arslan", "Can Öztürk", "Selin Koç", "Emre Aydın", "Deniz Çelik", "Merve Kurt", "Kerem Polat", "Nazlı Erdoğan", "Onur Aksoy", "Gizem Yalçın"];
const CITIES: [string, string][] = [["İstanbul", "Kadıköy"], ["Ankara", "Çankaya"], ["İzmir", "Konak"], ["Bursa", "Nilüfer"], ["Antalya", "Muratpaşa"], ["Eskişehir", "Tepebaşı"], ["Kocaeli", "İzmit"], ["Konya", "Selçuklu"]];
const FIRMS = ["Nova Coffee Kadıköy", "Köşe Kahve Moda", "Brew Lab Bornova", "Mado Çankaya", "Kahve Durağı Nilüfer", "Patisserie Lune"];
const STATUS_POOL: OrderStatus[] = ["beklemede", "onaylandi", "hazirlaniyor", "kargolandi", "teslim-edildi", "teslim-edildi", "onaylandi", "odeme-bekliyor", "iptal", "kargolandi", "hazirlaniyor", "teslim-edildi"];

let seed = 20261121;
const rnd = () => {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
};
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rnd() * arr.length)];

let indexCache: ProductIndex[] | null = null;
async function loadIndex(): Promise<ProductIndex[]> {
  if (!indexCache) indexCache = (await import("@/data/catalog-index.json")).default as unknown as ProductIndex[];
  return indexCache;
}

async function sampleOrders(): Promise<ApiOrder[]> {
  const idx = await loadIndex();
  seed = 20261121;
  const out: ApiOrder[] = [];
  const now = Date.now();
  for (let i = 0; i < 16; i++) {
    const created = new Date(now - (i === 0 ? 0 : Math.floor(rnd() * 28 + 1)) * 86400000 - Math.floor(rnd() * 36000000));
    const status = i === 0 ? "beklemede" : STATUS_POOL[i % STATUS_POOL.length];
    const nLines = 1 + Math.floor(rnd() * 4);
    const lines = Array.from({ length: nLines }, () => {
      const p = pick(idx);
      const v = pick(p.variants);
      const quantity = 1 + Math.floor(rnd() * 6);
      return { productSlug: p.slug, name: `${p.brand} ${p.name}`, variantId: v.id, variantLabel: v.label, sku: v.sku, unitPrice: v.price, quantity, lineTotal: Math.round(v.price * quantity * 100) / 100 };
    });
    const subtotal = Math.round(lines.reduce((s, l) => s + l.lineTotal, 0) * 100) / 100;
    const shipping = subtotal >= 2500 ? 0 : 149;
    const discount = subtotal >= 5000 ? Math.round(subtotal * 0.04 * 100) / 100 : 0;
    const total = Math.round((subtotal + shipping - discount) * 100) / 100;
    const paymentMethod = rnd() > 0.45 ? "kart" : "havale";
    const paid = status !== "beklemede" && status !== "odeme-bekliyor" && status !== "iptal" && status !== "odeme-basarisiz";
    const [city, district] = pick(CITIES);
    const fullName = NAMES[i % NAMES.length];
    const d = created.toISOString().slice(2, 10).replace(/-/g, "");
    const orderNo = `YVZ-${d}-${String(1000 + i * 37).slice(-3)}${"ABCDEFGHJKLMNPRSTUVYZ"[i % 21]}`;
    const kurumsal = rnd() > 0.6;
    const events: OrderEvent[] = [{ at: created.toISOString(), type: "created", status: paymentMethod === "havale" ? "beklemede" : "odeme-bekliyor", message: "Sipariş oluşturuldu", actor: "system" }];
    if (paid) events.push({ at: new Date(created.getTime() + 3600000).toISOString(), type: "payment", status: "onaylandi", message: paymentMethod === "kart" ? "Kart ödemesi alındı (PayTR)" : "Havale geldi, onaylandı", actor: paymentMethod === "kart" ? "paytr" : "admin" });
    if (["hazirlaniyor", "kargolandi", "teslim-edildi"].includes(status)) events.push({ at: new Date(created.getTime() + 7200000).toISOString(), type: "status", status: "hazirlaniyor", message: null, actor: "admin" });
    if (["kargolandi", "teslim-edildi"].includes(status)) events.push({ at: new Date(created.getTime() + 86400000).toISOString(), type: "cargo", status: "kargolandi", message: "Yurtiçi Kargo · 1234567890", actor: "admin" });
    if (status === "teslim-edildi") events.push({ at: new Date(created.getTime() + 2 * 86400000).toISOString(), type: "status", status: "teslim-edildi", message: null, actor: "admin" });
    if (status === "iptal") events.push({ at: new Date(created.getTime() + 5400000).toISOString(), type: "status", status: "iptal", message: "Müşteri talebiyle iptal", actor: "admin" });
    const shipped = ["kargolandi", "teslim-edildi"].includes(status);
    out.push({
      orderNo,
      merchantOid: orderNo.replace(/-/g, ""),
      createdAt: created.toISOString(),
      updatedAt: events[events.length - 1].at,
      status,
      paymentMethod,
      paymentStatus: paid ? "odendi" : status === "odeme-basarisiz" ? "basarisiz" : "bekliyor",
      paidAmount: paid ? total : null,
      totals: { subtotal, shipping, codFee: 0, discount, total },
      customer: {
        fullName,
        email: `${fullName.toLowerCase().replace(/[^a-z]/g, "")}@ornek.com`,
        phone: `05${String(300000000 + Math.floor(rnd() * 99999999)).slice(0, 9)}`,
        address: `${pick(["Bağdat Cad.", "Atatürk Bulv.", "Cumhuriyet Mah.", "İnönü Cad."])} No:${1 + Math.floor(rnd() * 120)} ${kurumsal ? "Kafe girişi" : "Daire " + (1 + Math.floor(rnd() * 20))}`,
        district,
        city,
        postalCode: "",
        note: rnd() > 0.7 ? "Lütfen 14:00'ten önce teslim edin." : "",
        invoiceType: kurumsal ? "kurumsal" : "bireysel",
        companyName: kurumsal ? pick(FIRMS) : "",
        taxOffice: kurumsal ? "Kadıköy" : "",
        taxNo: kurumsal ? "1234567890" : "",
      } as ApiOrder["customer"],
      lines,
      carrier: shipped ? "yurtici" : null,
      carrierName: shipped ? "Yurtiçi Kargo" : null,
      trackingNo: shipped ? "1234567890" : null,
      trackingUrl: shipped ? "https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=1234567890" : "",
      adminNote: "",
      testMode: true,
      events,
    });
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

type Overrides = Record<string, Partial<Pick<ApiOrder, "status" | "carrier" | "carrierName" | "trackingNo" | "trackingUrl" | "adminNote" | "events" | "updatedAt" | "paymentStatus" | "paidAmount">>>;

async function allOrders(): Promise<ApiOrder[]> {
  const base = await sampleOrders();
  const ov = read<Overrides>(ORDERS_KEY, {});
  return base.map((o) => (ov[o.orderNo] ? { ...o, ...ov[o.orderNo] } : o));
}

/* --------------------------- Panel fişleri (demo) --------------------------- */

function samplePanelOrders(): PanelApiOrder[] {
  seed = 777;
  const now = Date.now();
  const items = [
    { slug: "espresso-daily-blend", variantId: "1kg", brand: "Anatolia Coffee", name: "Espresso Daily Blend", variantLabel: "1 kg", sku: "YVZ-ESPRESSODA-2", qty: 6 },
    { slug: "karamel-surubu", variantId: "700ml", brand: "Yavuz Barista", name: "Karamel Şurubu", variantLabel: "700 ml", sku: "YVZ-KARAMELSU-1", qty: 12 },
    { slug: "barista-sut", variantId: "1l", brand: "Yavuz Barista", name: "Barista Süt", variantLabel: "1 L × 12 koli", sku: "YVZ-BARISTASU-2", qty: 4 },
    { slug: "cheesecake-dilim", variantId: "12li", brand: "Patisse", name: "Fıstıklı Cheesecake Dilim", variantLabel: "12'li koli", sku: "YVZ-CHEESECAK-1", qty: 3 },
    { slug: "karton-bardak-8oz", variantId: "1000", brand: "Sweet Cup", name: "Karton Bardak 8 oz", variantLabel: "1000 adet", sku: "YVZ-KARTONBAR-1", qty: 2 },
  ];
  const statuses: PanelStatus[] = ["yeni", "onaylandi", "hazirlaniyor", "teslim-edildi", "teslim-edildi"];
  return statuses.map((status, i) => {
    const created = new Date(now - (i + 1) * 86400000 - Math.floor(rnd() * 20000000));
    const its = items.slice(i % 2, (i % 2) + 2 + (i % 3));
    const d = created.toISOString().slice(2, 10).replace(/-/g, "");
    return {
      ref: `YL-${d}-${["A7K", "M2Q", "X9P", "C4R", "T6N"][i]}`,
      createdAt: created.toISOString(),
      updatedAt: created.toISOString(),
      status,
      firm: FIRMS[i % FIRMS.length],
      name: NAMES[(i + 3) % NAMES.length],
      phone: `05${String(320000000 + i * 1234567).slice(0, 9)}`,
      note: i === 0 ? "Perşembe sabahı teslim olursa süper olur." : "",
      adminNote: "",
      items: its,
      totalQty: its.reduce((s, it) => s + it.qty, 0),
      pdfUrl: null,
    };
  });
}

type PanelOverrides = Record<string, { status?: PanelStatus; adminNote?: string; updatedAt?: string }>;

function allPanelOrders(): PanelApiOrder[] {
  const local: PanelApiOrder[] = listPanelOrders().map((o) => ({
    ref: o.ref,
    createdAt: o.createdAt,
    updatedAt: o.createdAt,
    status: "yeni",
    firm: o.form.firm,
    name: o.form.name ?? "",
    phone: o.form.phone,
    note: o.form.note ?? "",
    adminNote: "",
    items: o.items.map((it) => ({ slug: it.slug, variantId: it.variantId, brand: it.brand, name: it.name, variantLabel: it.variantLabel, sku: it.sku, qty: it.qty, custom: it.custom })),
    totalQty: o.items.reduce((s, it) => s + it.qty, 0),
    pdfUrl: null,
  }));
  const ov = read<PanelOverrides>(PANEL_KEY, {});
  return [...local, ...samplePanelOrders()].map((o) => (ov[o.ref] ? { ...o, ...ov[o.ref] } : o)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/* -------------------------------- Arayüz -------------------------------- */

const paginate = <T,>(arr: T[], page = 1, size = 30) => ({ page, pages: Math.max(1, Math.ceil(arr.length / size)), total: arr.length, slice: arr.slice((page - 1) * size, page * size) });

type AdminProduct = Product & { hidden: boolean; custom: boolean; patched: boolean };
let baseCache: Product[] | null = null;
async function baseProducts(): Promise<Product[]> {
  if (!baseCache) baseCache = (await import("@/data/catalog.json")).default as unknown as Product[];
  return baseCache;
}
async function adminProducts(): Promise<AdminProduct[]> {
  const { patches, customs } = readDemoContent();
  const out: AdminProduct[] = [];
  const push = (p: Product, custom: boolean) => {
    const patch = patches[p.slug];
    const applied = applyPatch(p, patch ? { ...patch, hidden: false } : undefined) ?? p;
    out.push({ ...applied, hidden: Boolean(patch?.hidden), custom, patched: Boolean(patch) });
  };
  for (const p of await baseProducts()) push(p, false);
  for (const c of customs) push(c, true);
  return out;
}

export const demoAdmin = {
  async products(_t: string, params: { q?: string; kategori?: string; filtre?: string; page?: number }) {
    await delay(120);
    let items = await adminProducts();
    if (params.kategori) items = items.filter((p) => p.category === params.kategori);
    if (params.filtre === "gizli") items = items.filter((p) => p.hidden);
    if (params.filtre === "stoksuz") items = items.filter((p) => !p.variants.some((v) => v.inStock));
    if (params.filtre === "duzenlenen") items = items.filter((p) => p.patched || p.custom);
    if (params.filtre === "yeni") items = items.filter((p) => p.custom);
    const q = params.q?.trim().toLowerCase();
    if (q) items = items.filter((p) => [p.name, p.brand, p.slug, ...p.variants.map((v) => v.sku)].some((s) => s.toLowerCase().includes(q)));
    const p = paginate(items, params.page, 40);
    return ok({ products: p.slice, total: p.total, page: p.page, pages: p.pages });
  },
  async product(_t: string, slug: string) {
    const p = (await adminProducts()).find((x) => x.slug === slug);
    return p ? ok({ product: p }) : failed("Ürün bulunamadı");
  },
  async createProduct(_t: string, body: Partial<Product>) {
    if (!body.name || !body.category || !body.variants?.length) return failed("Ad, kategori ve en az bir varyant gerekli");
    const slug = CUSTOM_PREFIX + slugify(body.slug || `${body.brand ?? ""} ${body.name}`);
    const product: Product = { slug, name: body.name, brand: body.brand || "Yavuz Gıda", art: body.art ?? "box", rating: 0, reviews: 0, sold: 0, category: body.category, subcategory: body.subcategory ?? "", short: body.short || body.name, description: body.description || body.short || body.name, tags: body.tags ?? [], variants: body.variants.map((v, k) => ({ id: v.id || `v${k + 1}`, label: v.label || `Seçenek ${k + 1}`, sku: v.sku || `YVZ-${slugify(body.name!).toUpperCase().slice(0, 9)}-${k + 1}`, price: Number(v.price) || 0, oldPrice: v.oldPrice ? Number(v.oldPrice) : undefined, amount: Number(v.amount) || 1, amountUnit: v.amountUnit ?? "adet", inStock: v.inStock !== false, caseQty: v.caseQty ? Number(v.caseQty) : undefined })), specs: body.specs ?? [], hue: typeof body.hue === "number" ? body.hue : 30, popularity: 50, createdAt: new Date().toISOString().slice(0, 10), ...(body.image ? { image: body.image } : {}) };
    demoSaveCustom(product);
    return ok({ product });
  },
  async patchProduct(_t: string, slug: string, patch: ProductPatch & { full?: Product }) {
    const existing = (await adminProducts()).find((x) => x.slug === slug);
    if (!existing) return failed("Ürün bulunamadı");
    if (existing.custom && patch.full) {
      demoSaveCustom({ ...patch.full, slug });
      if (patch.hidden !== undefined) demoSavePatch(slug, { hidden: patch.hidden });
    } else {
      const { full: _f, ...rest } = patch;
      void _f;
      demoSavePatch(slug, rest);
    }
    const updated = (await adminProducts()).find((x) => x.slug === slug);
    return ok({ product: updated });
  },
  async resetProduct(_t: string, slug: string) {
    demoRemoveProduct(slug);
    return ok({});
  },
  async config() {
    return ok({ config: readDemoContent().config });
  },
  async saveConfig(_t: string, partial: Partial<SiteConfig>) {
    await delay(120);
    return ok({ config: demoSaveConfig(partial) });
  },
  async importCsv(_t: string, csv: string) {
    const rows = parseCsv(csv);
    if (!rows.length) return failed("Satır bulunamadı; ilk satır başlık olmalı");
    const known = new Set((await adminProducts()).map((p) => p.slug));
    const { patches, customs, errors } = rowsToImport(rows, known);
    for (const c of customs) demoSaveCustom(c);
    for (const [slug, patch] of Object.entries(patches)) demoSavePatch(slug, patch);
    return ok({ updated: Object.keys(patches).length, created: customs.length, errors });
  },
  exportUrl: () => "",
  async login(password: string) {
    await delay();
    return password === DEMO_PASSWORD ? ok({}) : failed("Şifre hatalı (demo şifresi: demo)");
  },
  async stats(): Promise<Ok<AdminStats> | Failed> {
    const orders = await allOrders();
    const by = new Map<OrderStatus, { n: number; sum: number }>();
    for (const o of orders) {
      const e = by.get(o.status) ?? { n: 0, sum: 0 };
      e.n++;
      e.sum += o.totals.total;
      by.set(o.status, e);
    }
    const today = new Date().toISOString().slice(0, 10);
    const agg = (since: string) => {
      const sel = orders.filter((o) => o.createdAt >= since && o.status !== "iptal" && o.status !== "odeme-basarisiz");
      return { n: sel.length, sum: sel.reduce((s, o) => s + o.totals.total, 0) };
    };
    return ok({ byStatus: [...by].map(([status, v]) => ({ status, ...v })), today: agg(today), month: agg(today.slice(0, 7) + "-01") });
  },
  async list(_t: string, params: AdminListParams) {
    await delay();
    let orders = await allOrders();
    if (params.status) orders = orders.filter((o) => o.status === params.status);
    if (params.q?.trim()) {
      const q = params.q.trim().toLowerCase();
      orders = orders.filter((o) => [o.orderNo, o.customer.fullName, o.customer.email, o.customer.phone, o.trackingNo ?? ""].some((v) => v.toLowerCase().includes(q)));
    }
    const p = paginate(orders, params.page);
    return ok({ orders: p.slice, page: p.page, pages: p.pages, total: p.total });
  },
  async get(_t: string, orderNo: string) {
    const o = (await allOrders()).find((x) => x.orderNo === orderNo);
    return o ? ok({ order: o }) : failed("Sipariş bulunamadı");
  },
  async update(_t: string, orderNo: string, patch: AdminPatch) {
    await delay(150);
    const o = (await allOrders()).find((x) => x.orderNo === orderNo);
    if (!o) return failed("Sipariş bulunamadı");
    const ov = read<Overrides>(ORDERS_KEY, {});
    const cur = { ...o, ...(ov[orderNo] ?? {}) };
    const at = new Date().toISOString();
    const events = [...cur.events];
    if (patch.status && patch.status !== cur.status) {
      cur.status = patch.status;
      if (patch.status === "onaylandi" && cur.paymentStatus !== "odendi") {
        cur.paymentStatus = "odendi";
        cur.paidAmount = cur.totals.total;
      }
      events.push({ at, type: "status", status: patch.status, message: patch.message ?? null, actor: "admin" });
    }
    if (patch.trackingNo !== undefined) {
      const names: Record<string, string> = { yurtici: "Yurtiçi Kargo", aras: "Aras Kargo", mng: "MNG Kargo", ptt: "PTT Kargo", surat: "Sürat Kargo", hepsijet: "HepsiJET", ups: "UPS", diger: "Diğer" };
      cur.carrier = patch.carrier ?? "yurtici";
      cur.carrierName = names[cur.carrier] ?? "Kargo";
      cur.trackingNo = patch.trackingNo;
      cur.trackingUrl = patch.trackingUrl || (patch.trackingNo ? `https://www.google.com/search?q=${encodeURIComponent(`${cur.carrierName} ${patch.trackingNo}`)}` : "");
      if (patch.trackingNo && cur.status !== "kargolandi" && cur.status !== "teslim-edildi") {
        cur.status = "kargolandi";
        events.push({ at, type: "cargo", status: "kargolandi", message: `${cur.carrierName} · ${patch.trackingNo}`, actor: "admin" });
      }
    }
    if (patch.adminNote !== undefined) {
      cur.adminNote = patch.adminNote;
      events.push({ at, type: "note", status: null, message: "İç not güncellendi", actor: "admin" });
    }
    cur.updatedAt = at;
    cur.events = events;
    ov[orderNo] = { status: cur.status, carrier: cur.carrier, carrierName: cur.carrierName, trackingNo: cur.trackingNo, trackingUrl: cur.trackingUrl, adminNote: cur.adminNote, events, updatedAt: at, paymentStatus: cur.paymentStatus, paidAmount: cur.paidAmount };
    write(ORDERS_KEY, ov);
    return ok({ order: cur });
  },
  async panelList(_t: string, params: AdminListParams) {
    await delay();
    const all = allPanelOrders();
    let orders = all;
    if (params.status) orders = orders.filter((o) => o.status === params.status);
    if (params.q?.trim()) {
      const q = params.q.trim().toLowerCase();
      orders = orders.filter((o) => [o.ref, o.firm, o.name, o.phone].some((v) => v.toLowerCase().includes(q)));
    }
    const by = new Map<PanelStatus, number>();
    for (const o of all) by.set(o.status, (by.get(o.status) ?? 0) + 1);
    const today = new Date().toISOString().slice(0, 10);
    const stats: PanelStats = { byStatus: [...by].map(([status, n]) => ({ status, n })), today: all.filter((o) => o.createdAt >= today && o.status !== "iptal").length, month: all.filter((o) => o.createdAt >= today.slice(0, 7) + "-01" && o.status !== "iptal").length };
    const p = paginate(orders, params.page);
    return ok({ orders: p.slice, page: p.page, pages: p.pages, total: p.total, stats });
  },
  async panelGet(_t: string, ref: string) {
    const o = allPanelOrders().find((x) => x.ref === ref);
    return o ? ok({ order: o }) : failed("Fiş bulunamadı");
  },
  async panelUpdate(_t: string, ref: string, patch: { status?: PanelStatus; adminNote?: string }) {
    await delay(150);
    const o = allPanelOrders().find((x) => x.ref === ref);
    if (!o) return failed("Fiş bulunamadı");
    const ov = read<PanelOverrides>(PANEL_KEY, {});
    ov[ref] = { ...(ov[ref] ?? {}), ...patch, updatedAt: new Date().toISOString() };
    write(PANEL_KEY, ov);
    return ok({ order: { ...o, ...ov[ref] } });
  },
};
