"use client";

import { useCallback, useEffect, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2, Search, RefreshCw, LogOut, Truck, ExternalLink, ChevronLeft, ChevronRight, Phone, Mail, MapPin, CreditCard, AlertCircle, Save, ShoppingBag, Store, FileText, MessageCircle, Printer, Info, Package, LayoutTemplate, Settings } from "lucide-react";
import {
  admin,
  apiEnabled,
  DEMO_ADMIN,
  orderStatuses,
  statusLabels,
  statusTone,
  carriers,
  panelStatuses,
  panelStatusLabels,
  panelStatusTone,
  type ApiOrder,
  type OrderStatus,
  type PanelApiOrder,
  type PanelStatus,
  type PanelStats,
  type AdminStats,
} from "@/lib/api";
import { paymentLabels } from "@/lib/order";
import { formatPrice, cn } from "@/lib/format";
import { OrderTimeline } from "@/components/order/OrderTracking";
import { site } from "@/lib/site";
import { LogoImage } from "@/components/ui/Logo";
import { PushToggle } from "@/components/pwa/PushToggle";
import { Drawer, Card } from "./Drawer";
import { ProductsView } from "./ProductsView";
import { HomepageView } from "./HomepageView";
import { SettingsView } from "./SettingsView";

/* ------------------------------ Oturum deposu ------------------------------ */
const KEY = "yavuz:admin";
const listeners = new Set<() => void>();
const session = {
  read: () => {
    try {
      return window.sessionStorage.getItem(KEY) ?? "";
    } catch {
      return "";
    }
  },
  write: (v: string) => {
    try {
      if (v) window.sessionStorage.setItem(KEY, v);
      else window.sessionStorage.removeItem(KEY);
    } catch {
      /* yoksay */
    }
    for (const l of listeners) l();
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};
function useToken() {
  return useSyncExternalStore(session.subscribe, session.read, () => "");
}

type Tab = "shop" | "panel";

const fmtDateTime = (iso: string) => new Date(iso).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
const waLink = (phone: string, text: string) => `https://wa.me/${phone.replace(/\D/g, "").replace(/^0/, "90")}?text=${encodeURIComponent(text)}`;

/* İş akışına göre bir sonraki mantıklı adımlar */
const nextSteps: Partial<Record<OrderStatus, OrderStatus[]>> = {
  "odeme-bekliyor": ["onaylandi", "iptal"],
  beklemede: ["onaylandi", "iptal"],
  onaylandi: ["hazirlaniyor", "kargolandi", "iptal"],
  hazirlaniyor: ["kargolandi", "iptal"],
  kargolandi: ["teslim-edildi"],
  "teslim-edildi": [],
  iptal: ["onaylandi"],
  "odeme-basarisiz": ["onaylandi", "iptal"],
};
const panelNextSteps: Record<PanelStatus, PanelStatus[]> = {
  yeni: ["onaylandi", "iptal"],
  onaylandi: ["hazirlaniyor", "teslim-edildi", "iptal"],
  hazirlaniyor: ["teslim-edildi", "iptal"],
  "teslim-edildi": [],
  iptal: ["onaylandi"],
};

const shopFilters: { value: string; label: string }[] = [
  { value: "", label: "Tümü" },
  { value: "beklemede", label: "Havale bekleyen" },
  { value: "onaylandi", label: "Onaylı" },
  { value: "hazirlaniyor", label: "Hazırlanan" },
  { value: "kargolandi", label: "Kargoda" },
  { value: "teslim-edildi", label: "Teslim" },
  { value: "odeme-bekliyor", label: "Ödeme bekleyen" },
  { value: "iptal", label: "İptal" },
];
const panelFilters: { value: string; label: string }[] = [
  { value: "", label: "Tümü" },
  { value: "yeni", label: "Yeni" },
  { value: "onaylandi", label: "Onaylı" },
  { value: "hazirlaniyor", label: "Hazırlanan" },
  { value: "teslim-edildi", label: "Teslim" },
  { value: "iptal", label: "İptal" },
];

export function AdminPanel() {
  const token = useToken();
  const params = useSearchParams();
  const initialNo = params.get("no");
  const initialTab: Tab = params.get("tab") === "panel" ? "panel" : "shop";

  if (!apiEnabled()) {
    return (
      <section className="mx-auto max-w-[1320px] px-4 py-16">
        <div className="mx-auto max-w-lg rounded-xl border border-ink-200 bg-paper-50 p-8 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-ink-500" />
          <h1 className="mt-3 text-2xl font-semibold">Sipariş API&rsquo;si tanımlı değil</h1>
          <p className="mt-2 text-sm text-ink-700">Yönetim paneli için sunucu ortam değişkenlerini (veritabanı ve ADMIN_PASSWORD) tanımlayın. Bkz. README.</p>
        </div>
      </section>
    );
  }
  const initialSection: Section = (["siparisler", "urunler", "anasayfa", "ayarlar"] as const).includes(params.get("bolum") as Section) ? (params.get("bolum") as Section) : "siparisler";
  return token ? <Shell token={token} initialNo={initialNo} initialTab={initialTab} initialSection={initialSection} /> : <Login />;
}

type Section = "siparisler" | "urunler" | "anasayfa" | "ayarlar";
const SECTIONS: { key: Section; label: string; icon: ReactNode; sub: string }[] = [
  { key: "siparisler", label: "Siparişler", icon: <ShoppingBag className="size-4" />, sub: "E-ticaret ve anlaşmalı" },
  { key: "urunler", label: "Ürünler", icon: <Package className="size-4" />, sub: "Fiyat, stok, görsel" },
  { key: "anasayfa", label: "Ana Sayfa", icon: <LayoutTemplate className="size-4" />, sub: "Slider, kampanya, referans" },
  { key: "ayarlar", label: "Ayarlar", icon: <Settings className="size-4" />, sub: "İletişim, kargo, yasal" },
];

/* ---------------------------------- Kabuk --------------------------------- */
function Shell({ token, initialNo, initialTab, initialSection }: { token: string; initialNo: string | null; initialTab: Tab; initialSection: Section }) {
  const [section, setSection] = useState<Section>(initialSection);
  const [refreshKey, setRefreshKey] = useState(0);
  const go = (s: Section) => {
    setSection(s);
    try {
      const u = new URL(window.location.href);
      u.searchParams.set("bolum", s);
      u.searchParams.delete("no");
      u.searchParams.delete("tab");
      window.history.replaceState(null, "", u.toString());
    } catch {}
  };
  return (
    <section className="mx-auto max-w-[1320px] px-3 pb-10 sm:px-4 sm:pb-12">
      <AdminBar onRefresh={() => setRefreshKey((k) => k + 1)} loading={false} />
      <nav className="-mx-3 mt-3 flex gap-1.5 overflow-x-auto px-3 pb-1 no-scrollbar sm:mx-0 sm:mt-4 sm:px-0" aria-label="Yönetim bölümleri">
        {SECTIONS.map((s) => (
          <button key={s.key} type="button" onClick={() => go(s.key)} className={cn("flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-left transition", section === s.key ? "border-coal-900 bg-coal-900 text-white" : "border-ink-200 bg-white text-ink-800 hover:border-ink-400")}>
            <span className={cn("grid size-8 place-items-center rounded-lg", section === s.key ? "bg-white/10 text-gold-400" : "bg-paper-100 text-ink-600")}>{s.icon}</span>
            <span>
              <span className="block text-sm font-bold leading-tight">{s.label}</span>
              <span className={cn("hidden text-[0.68rem] sm:block", section === s.key ? "text-ink-300" : "text-ink-500")}>{s.sub}</span>
            </span>
          </button>
        ))}
      </nav>
      <div key={`${section}-${refreshKey}`}>
        {section === "siparisler" && <Dashboard token={token} initialNo={initialNo} initialTab={initialTab} />}
        {section === "urunler" && <ProductsView token={token} />}
        {section === "anasayfa" && <HomepageView token={token} />}
        {section === "ayarlar" && <SettingsView token={token} />}
      </div>
    </section>
  );
}

/* --------------------------------- Giriş ---------------------------------- */
function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await admin.login(password);
    if (res.status === "success") session.write(password);
    else setError(res.reason ?? "Giriş başarısız");
    setLoading(false);
  };
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-[1320px] items-center justify-center px-4 py-10 sm:py-16">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-xl border border-ink-200 bg-white p-6 shadow-menu sm:p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-coal-900 text-gold-400">
          <Lock className="h-5 w-5" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold text-ink-900">Yavuz Yönetim</h1>
        <p className="mt-1 text-sm text-ink-500">{site.name} · gelen siparişler</p>
        <label className="mt-6 block">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-ink-500">Şifre</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus className="mt-2 h-12 w-full rounded-xl border border-ink-200 bg-paper-50 px-4 text-base focus:border-ink-900 focus:outline-none" />
        </label>
        {error && <p role="alert" className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ink-900 text-sm font-bold text-white disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Giriş yap
        </button>
        {DEMO_ADMIN && (
          <p className="mt-4 flex items-start gap-2 rounded-lg bg-gold-100/60 px-3 py-2 text-xs text-ink-800">
            <Info className="mt-0.5 size-3.5 shrink-0 text-gold-600" />
            <span>
              Demo ortamı: şifre <b>demo</b>. E-ticaret siparişleri örnektir; anlaşmalı müşteri fişleri bu tarayıcıda panelden oluşturduğunuz gerçek fişlerdir.
            </span>
          </p>
        )}
      </form>
    </section>
  );
}

/* ---------------------------------- Panel --------------------------------- */
function Dashboard({ token, initialNo, initialTab }: { token: string; initialNo: string | null; initialTab: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [shop, setShop] = useState<{ orders: ApiOrder[]; pages: number; total: number } | null>(null);
  const [panel, setPanel] = useState<{ orders: PanelApiOrder[]; pages: number; total: number } | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pstats, setPstats] = useState<PanelStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(initialNo && initialTab === "shop" ? initialNo : null);
  const [selectedRef, setSelectedRef] = useState<string | null>(initialNo && initialTab === "panel" ? initialNo : null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [list, st, pl] = await Promise.all([
      admin.list(token, tab === "shop" ? { status, q, page } : {}),
      admin.stats(token),
      admin.panelList(token, tab === "panel" ? { status, q, page } : {}),
    ]);
    if (list.status !== "success" && pl.status !== "success") {
      setError(list.reason ?? "Liste alınamadı");
      if (list.reason === "Yetkisiz") session.write("");
    }
    if (list.status === "success") setShop({ orders: list.orders, pages: list.pages, total: list.total });
    if (pl.status === "success") {
      setPanel({ orders: pl.orders, pages: pl.pages, total: pl.total });
      setPstats(pl.stats);
    }
    if (st.status === "success") setStats(st);
    setLoading(false);
  }, [token, tab, status, q, page]);

  useEffect(() => {
    const t = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(t);
  }, [load]);

  const switchTab = (t: Tab) => {
    setTab(t);
    setStatus("");
    setQ("");
    setPage(1);
  };

  const count = (s: OrderStatus) => stats?.byStatus.find((b) => b.status === s)?.n ?? 0;
  const pcount = (s: PanelStatus) => pstats?.byStatus.find((b) => b.status === s)?.n ?? 0;
  const shopPending = count("beklemede") + count("onaylandi") + count("odeme-bekliyor");
  const panelPending = pcount("yeni");
  const filters = tab === "shop" ? shopFilters : panelFilters;
  const data = tab === "shop" ? shop : panel;

  return (
    <div>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900 sm:text-3xl">Gelen Siparişler</h1>
          <p className="text-xs text-ink-500">{loading ? "Yükleniyor…" : "E-ticaret siparişleri ve anlaşmalı müşteri fişleri"}</p>
        </div>
        {!DEMO_ADMIN && <PushToggle token={token} />}
      </div>

      {/* Sekmeler */}
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-ink-200 bg-white p-1.5">
        <TabButton active={tab === "shop"} onClick={() => switchTab("shop")} icon={<ShoppingBag className="size-4" />} label="E-Ticaret" sub="Ödemeli siparişler" badge={shopPending} />
        <TabButton active={tab === "panel"} onClick={() => switchTab("panel")} icon={<Store className="size-4" />} label="Anlaşmalı" sub="Müşteri paneli fişleri" badge={panelPending} />
      </div>

      {/* Özet kartları */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        {(tab === "shop"
          ? [
              { k: "Bugün", v: `${stats?.today.n ?? 0} sipariş`, s: formatPrice(stats?.today.sum ?? 0) },
              { k: "Bu ay", v: `${stats?.month.n ?? 0} sipariş`, s: formatPrice(stats?.month.sum ?? 0) },
              { k: "İşlem bekleyen", v: `${count("beklemede") + count("onaylandi")}`, s: "havale + onaylı" },
              { k: "Hazırlanan / kargoda", v: `${count("hazirlaniyor")} / ${count("kargolandi")}`, s: "sipariş" },
            ]
          : [
              { k: "Bugün", v: `${pstats?.today ?? 0} fiş`, s: "anlaşmalı müşteri" },
              { k: "Bu ay", v: `${pstats?.month ?? 0} fiş`, s: "iptal hariç" },
              { k: "Yeni", v: `${pcount("yeni")}`, s: "onay bekliyor" },
              { k: "Hazırlanan", v: `${pcount("onaylandi") + pcount("hazirlaniyor")}`, s: "onaylı + hazırlanıyor" },
            ]
        ).map((c) => (
          <div key={c.k} className="rounded-xl border border-ink-200 bg-white p-3 sm:p-4">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-ink-500">{c.k}</p>
            <p className="mt-1 text-xl font-semibold text-ink-900 sm:text-2xl">{c.v}</p>
            <p className="text-xs text-ink-500">{c.s}</p>
          </div>
        ))}
      </div>

      {/* Filtre + arama */}
      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 no-scrollbar sm:mx-0 sm:px-0">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                setStatus(f.value);
                setPage(1);
              }}
              className={cn("shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors", status === f.value ? "border-ink-900 bg-ink-900 text-white" : "border-ink-200 bg-white hover:border-ink-900")}
            >
              {f.label}
              {f.value && <span className="ml-1.5 opacity-70">{tab === "shop" ? count(f.value as OrderStatus) : pcount(f.value as PanelStatus)}</span>}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            void load();
          }}
          className="relative lg:w-80"
        >
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tab === "shop" ? "Sipariş no, ad, e-posta, takip no…" : "Fiş no, firma, yetkili, telefon…"} className="h-10 w-full rounded-full border border-ink-200 bg-white pl-10 pr-4 text-sm focus:border-ink-900 focus:outline-none" />
        </form>
      </div>

      {error && <p role="alert" className="mt-4 rounded-xl bg-red-100 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}

      {/* Liste */}
      {tab === "shop" ? <ShopList data={shop} onSelect={setSelected} /> : <PanelList data={panel} onSelect={setSelectedRef} />}

      {data && data.pages > 1 && (
        <div className="mt-3 flex items-center justify-between rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm">
          <span className="text-ink-500">
            {data.total} kayıt · sayfa {page} / {data.pages}
          </span>
          <div className="flex gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink-200 disabled:opacity-40">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink-200 disabled:opacity-40">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {selected && <OrderDrawer token={token} orderNo={selected} onClose={() => setSelected(null)} onChanged={() => void load()} />}
      {selectedRef && <PanelDrawer token={token} orderRef={selectedRef} onClose={() => setSelectedRef(null)} onChanged={() => void load()} />}
    </div>
  );
}

function TabButton({ active, onClick, icon, label, sub, badge }: { active: boolean; onClick: () => void; icon: ReactNode; label: string; sub: string; badge: number }) {
  return (
    <button type="button" onClick={onClick} className={cn("flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors", active ? "bg-coal-900 text-white" : "hover:bg-paper-100")}>
      <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", active ? "bg-white/10 text-gold-400" : "bg-paper-100 text-ink-700")}>{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 text-sm font-bold">
          <span className="truncate">{label}</span>
          {badge > 0 && <span className={cn("rounded-full px-1.5 text-[0.65rem] font-bold leading-4", active ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-700")}>{badge}</span>}
        </span>
        <span className={cn("block truncate text-[0.7rem]", active ? "text-ink-300" : "text-ink-500")}>{sub}</span>
      </span>
    </button>
  );
}

/* ------------------------- E-ticaret sipariş listesi ------------------------ */
function ShopList({ data, onSelect }: { data: { orders: ApiOrder[] } | null; onSelect: (no: string) => void }) {
  if (!data) return <ListSkeleton />;
  if (data.orders.length === 0) return <Empty text="Bu filtrede sipariş yok." />;
  return (
    <>
      {/* Mobil kartlar */}
      <ul className="mt-4 space-y-2 md:hidden">
        {data.orders.map((o) => (
          <li key={o.orderNo}>
            <button type="button" onClick={() => onSelect(o.orderNo)} className="flex w-full items-start gap-3 rounded-xl border border-ink-200 bg-white p-3 text-left active:bg-paper-50">
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-x-2 font-mono text-sm font-bold text-ink-900">
                  {o.orderNo}
                  {o.testMode && <span className="rounded bg-orange-100/60 px-1 text-[0.6rem] font-bold">TEST</span>}
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-ink-800">{o.customer.fullName}</p>
                <p className="truncate text-xs text-ink-500">
                  {fmtDateTime(o.createdAt)} · {o.customer.city} · {paymentLabels[o.paymentMethod]}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-ink-900">{formatPrice(o.totals.total)}</p>
                <span className={cn("mt-1 inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[0.68rem] font-bold", statusTone[o.status])}>{statusLabels[o.status]}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
      {/* Masaüstü tablo */}
      <div className="mt-4 hidden overflow-hidden rounded-xl border border-ink-200 bg-white md:block">
        <table className="w-full text-sm">
          <thead className="bg-paper-50 text-left text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink-500">
            <tr>
              <th className="px-4 py-3">Sipariş</th>
              <th className="px-4 py-3">Müşteri</th>
              <th className="hidden px-4 py-3 lg:table-cell">Ödeme</th>
              <th className="px-4 py-3 text-right">Tutar</th>
              <th className="px-4 py-3">Durum</th>
              <th className="hidden px-4 py-3 lg:table-cell">Kargo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-200">
            {data.orders.map((o) => (
              <tr key={o.orderNo} onClick={() => onSelect(o.orderNo)} className="cursor-pointer transition-colors hover:bg-paper-50">
                <td className="px-4 py-3">
                  <p className="font-mono font-bold text-ink-900">{o.orderNo}</p>
                  <p className="text-xs text-ink-500">
                    {fmtDateTime(o.createdAt)}
                    {o.testMode && <span className="ml-1 rounded bg-orange-100/60 px-1 text-[0.6rem] font-bold">TEST</span>}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold">{o.customer.fullName}</p>
                  <p className="text-xs text-ink-500">
                    {o.customer.city} · {o.customer.phone}
                  </p>
                </td>
                <td className="hidden px-4 py-3 text-xs lg:table-cell">
                  {paymentLabels[o.paymentMethod]}
                  <span className={cn("ml-1 rounded px-1 font-bold", o.paymentStatus === "odendi" ? "bg-green-100 text-green-600" : o.paymentStatus === "basarisiz" ? "bg-red-100 text-red-600" : "bg-paper-100")}>{o.paymentStatus}</span>
                </td>
                <td className="px-4 py-3 text-right font-semibold">{formatPrice(o.totals.total)}</td>
                <td className="px-4 py-3">
                  <span className={cn("whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold", statusTone[o.status])}>{statusLabels[o.status]}</span>
                </td>
                <td className="hidden px-4 py-3 text-xs lg:table-cell">{o.trackingNo ? `${o.carrierName ?? ""} ${o.trackingNo}` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ----------------------- Anlaşmalı müşteri fiş listesi ---------------------- */
function PanelList({ data, onSelect }: { data: { orders: PanelApiOrder[] } | null; onSelect: (ref: string) => void }) {
  if (!data) return <ListSkeleton />;
  if (data.orders.length === 0) return <Empty text="Bu filtrede fiş yok. Anlaşmalı müşteriler panelden sipariş onayladığında burada listelenir." />;
  return (
    <>
      <ul className="mt-4 space-y-2 md:hidden">
        {data.orders.map((o) => (
          <li key={o.ref}>
            <button type="button" onClick={() => onSelect(o.ref)} className="flex w-full items-start gap-3 rounded-xl border border-ink-200 bg-white p-3 text-left active:bg-paper-50">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm font-bold text-ink-900">{o.ref}</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-ink-800">{o.firm}</p>
                <p className="truncate text-xs text-ink-500">
                  {fmtDateTime(o.createdAt)}
                  {o.name ? ` · ${o.name}` : ""}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-ink-900">
                  {o.items.length} kalem · {o.totalQty} adet
                </p>
                <span className={cn("mt-1 inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[0.68rem] font-bold", panelStatusTone[o.status])}>{panelStatusLabels[o.status]}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 hidden overflow-hidden rounded-xl border border-ink-200 bg-white md:block">
        <table className="w-full text-sm">
          <thead className="bg-paper-50 text-left text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink-500">
            <tr>
              <th className="px-4 py-3">Fiş</th>
              <th className="px-4 py-3">Firma</th>
              <th className="hidden px-4 py-3 lg:table-cell">Telefon</th>
              <th className="px-4 py-3 text-right">Kalem / Adet</th>
              <th className="px-4 py-3">Durum</th>
              <th className="hidden px-4 py-3 lg:table-cell">Not</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-200">
            {data.orders.map((o) => (
              <tr key={o.ref} onClick={() => onSelect(o.ref)} className="cursor-pointer transition-colors hover:bg-paper-50">
                <td className="px-4 py-3">
                  <p className="font-mono font-bold text-ink-900">{o.ref}</p>
                  <p className="text-xs text-ink-500">{fmtDateTime(o.createdAt)}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold">{o.firm}</p>
                  <p className="text-xs text-ink-500">{o.name || "—"}</p>
                </td>
                <td className="hidden px-4 py-3 text-xs lg:table-cell">{o.phone}</td>
                <td className="px-4 py-3 text-right font-semibold">
                  {o.items.length} / {o.totalQty}
                </td>
                <td className="px-4 py-3">
                  <span className={cn("whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold", panelStatusTone[o.status])}>{panelStatusLabels[o.status]}</span>
                </td>
                <td className="hidden max-w-[16rem] truncate px-4 py-3 text-xs text-ink-500 lg:table-cell">{o.note || o.adminNote || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function ListSkeleton() {
  return (
    <div className="mt-4 flex h-40 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-500">
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return <div className="mt-4 rounded-xl border border-ink-200 bg-white px-4 py-10 text-center text-sm text-ink-500">{text}</div>;
}

/* ------------------------------ Üst çubuk ---------------------------------- */
function AdminBar({ onRefresh, loading }: { onRefresh: () => void; loading: boolean }) {
  return (
    <div className="sticky top-0 z-20 -mx-3 flex items-center justify-between gap-3 border-b border-ink-200 bg-white/95 px-3 py-2.5 backdrop-blur sm:-mx-4 sm:px-4 sm:py-3">
      <Link href="/yonetim" className="inline-flex items-center gap-2">
        <span className="rounded-md bg-coal-900 p-1">
          <LogoImage className="h-6 w-auto" />
        </span>
        <span className="rounded-full bg-ink-900 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white">Yönetim</span>
        {DEMO_ADMIN && <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-gold-600">Demo</span>}
      </Link>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button type="button" onClick={onRefresh} aria-label="Yenile" className="inline-flex h-10 items-center gap-2 rounded-full border border-ink-200 px-3 text-sm font-semibold hover:bg-paper-100 sm:px-4">
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> <span className="hidden sm:inline">Yenile</span>
        </button>
        <Link href="/" className="hidden h-10 items-center rounded-full border border-ink-200 px-4 text-sm font-semibold hover:bg-paper-100 lg:inline-flex">
          Mağaza
        </Link>
        <button type="button" onClick={() => session.write("")} aria-label="Çıkış" className="inline-flex h-10 items-center gap-2 rounded-full border border-ink-200 px-3 text-sm font-semibold hover:bg-paper-100 sm:px-4">
          <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Çıkış</span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ Sipariş detayı ----------------------------- */
function OrderDrawer({ token, orderNo, onClose, onChanged }: { token: string; orderNo: string; onClose: () => void; onChanged: () => void }) {
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [carrier, setCarrier] = useState("yurtici");
  const [trackingNo, setTrackingNo] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [note, setNote] = useState("");
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await admin.get(token, orderNo);
    if (res.status === "success" && res.order) setOrder(res.order);
    else setError(res.reason ?? "Sipariş yüklenemedi");
  }, [token, orderNo]);

  useEffect(() => {
    const t = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(t);
  }, [refresh]);

  // Form alanlarını sipariş ilk yüklendiğinde doldur (render sırasında, effect'siz)
  if (order && loadedFor !== order.orderNo) {
    setLoadedFor(order.orderNo);
    setCarrier(order.carrier ?? "yurtici");
    setTrackingNo(order.trackingNo ?? "");
    setTrackingUrl(order.carrier ? "" : (order.trackingUrl ?? ""));
    setNote(order.adminNote ?? "");
  }

  const patch = async (p: Parameters<typeof admin.update>[2]) => {
    setBusy(true);
    setError(null);
    const res = await admin.update(token, orderNo, p);
    if (res.status === "success" && res.order) {
      setOrder(res.order);
      onChanged();
    } else setError(res.reason ?? "Güncellenemedi");
    setBusy(false);
  };

  const c = order?.customer;
  return (
    <Drawer title={orderNo} subtitle={order ? `${fmtDateTime(order.createdAt)} · ${paymentLabels[order.paymentMethod]}${order.testMode ? " · TEST" : ""}` : undefined} badge={order && <span className={cn("hidden rounded-full px-3 py-1.5 text-xs font-bold sm:inline", statusTone[order.status])}>{statusLabels[order.status]}</span>} onClose={onClose}>
      {!order ? (
        <div className="flex flex-1 items-center justify-center p-10">{error ? <p className="text-red-600">{error}</p> : <Loader2 className="h-6 w-6 animate-spin" />}</div>
      ) : (
        <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
          {error && <p role="alert" className="rounded-xl bg-red-100 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
          <span className={cn("inline-block rounded-full px-3 py-1.5 text-xs font-bold sm:hidden", statusTone[order.status])}>{statusLabels[order.status]}</span>

          <Card title="Durumu güncelle">
            <div className="mt-3 flex flex-wrap gap-2">
              {(nextSteps[order.status] ?? []).map((s) => (
                <button key={s} type="button" disabled={busy} onClick={() => void patch({ status: s })} className={cn("rounded-full px-4 py-2 text-sm font-bold transition-colors disabled:opacity-50", s === "iptal" ? "border border-red-600/40 text-red-600 hover:bg-red-100" : "bg-ink-900 text-white hover:bg-ink-800")}>
                  {s === "onaylandi" && order.paymentMethod === "havale" && order.paymentStatus !== "odendi" ? "Havale geldi, onayla" : statusLabels[s]}
                </button>
              ))}
              <details className="ml-auto">
                <summary className="cursor-pointer rounded-full border border-ink-200 px-3 py-2 text-xs font-semibold">Diğer</summary>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {orderStatuses
                    .filter((s) => s !== order.status)
                    .map((s) => (
                      <button key={s} type="button" disabled={busy} onClick={() => void patch({ status: s })} className="rounded-full border border-ink-200 px-2.5 py-1 text-xs font-semibold hover:bg-paper-100">
                        {statusLabels[s]}
                      </button>
                    ))}
                </div>
              </details>
            </div>
          </Card>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void patch({ carrier, trackingNo, trackingUrl: carrier === "diger" ? trackingUrl : "" });
            }}
            className="rounded-xl border border-ink-200 p-4 sm:p-5"
          >
            <p className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink-500">
              <Truck className="h-3.5 w-3.5" /> Kargo bilgisi
            </p>
            <div className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-[10rem_1fr_auto]">
              <select value={carrier} onChange={(e) => setCarrier(e.target.value)} className="h-11 rounded-xl border border-ink-200 bg-paper-50 px-3 text-sm">
                {Object.entries(carriers).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
              <input value={trackingNo} onChange={(e) => setTrackingNo(e.target.value)} placeholder="Takip numarası" className="h-11 rounded-xl border border-ink-200 bg-paper-50 px-3 font-mono text-sm" />
              <button type="submit" disabled={busy} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-ink-900 px-4 text-sm font-bold text-white disabled:opacity-50">
                <Save className="h-4 w-4" /> Kaydet
              </button>
            </div>
            {carrier === "diger" && <input value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)} placeholder="Takip bağlantısı (https://…)" className="mt-3 h-11 w-full rounded-xl border border-ink-200 bg-paper-50 px-3 text-sm" />}
            <p className="mt-2 text-xs text-ink-500">Takip numarası girince durum otomatik &ldquo;Kargoya verildi&rdquo; olur; müşteri takip sayfasında kargo bağlantısını görür.</p>
            {order.trackingUrl && (
              <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-4">
                Kargo takip sayfası <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </form>

          <div className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
            <Card title="Müşteri" className="text-sm">
              <p className="mt-2 font-bold">{c?.fullName}</p>
              <p className="mt-1 flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <a href={`tel:${c?.phone}`} className="underline underline-offset-2">
                  {c?.phone}
                </a>
              </p>
              <p className="mt-1 flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <a href={`mailto:${c?.email}`} className="truncate underline underline-offset-2">
                  {c?.email}
                </a>
              </p>
              <p className="mt-1 flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  {c?.address}, {c?.district} / {c?.city} {c?.postalCode}
                </span>
              </p>
              {c?.invoiceType === "kurumsal" && (
                <p className="mt-2 text-xs">
                  Fatura: {c.companyName} · {c.taxOffice} · VKN {c.taxNo}
                </p>
              )}
              {c?.note && <p className="mt-2 rounded-lg bg-orange-100/30 px-3 py-2 text-xs">Müşteri notu: {c.note}</p>}
              <a href={waLink(c?.phone ?? "", `Merhaba ${c?.fullName}, ${orderNo} numaralı Yavuz Gıda siparişiniz hakkında: `)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-[#25D366] px-3 text-xs font-bold text-white">
                <MessageCircle className="size-3.5" /> WhatsApp&rsquo;tan yaz
              </a>
            </Card>
            <Card title="Ödeme" icon={<CreditCard className="h-3.5 w-3.5" />} className="text-sm">
              <p className="mt-2">
                {paymentLabels[order.paymentMethod]} · <span className="font-bold">{order.paymentStatus}</span>
                {order.paidAmount ? ` · ${formatPrice(order.paidAmount)} tahsil edildi` : ""}
              </p>
              <ul className="mt-3 divide-y divide-ink-200">
                {order.lines.map((l, i) => (
                  <li key={i} className="flex justify-between gap-2 py-1.5">
                    <span>
                      {l.name} <span className="text-ink-500">({l.variantLabel}) × {l.quantity}</span>
                    </span>
                    <span className="shrink-0 font-semibold">{formatPrice(l.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-2 border-t border-ink-200 pt-2 text-xs">
                <div className="flex justify-between">
                  <dt>Kargo</dt>
                  <dd>{formatPrice(order.totals.shipping)}</dd>
                </div>
                {order.totals.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <dt>Sepet indirimi</dt>
                    <dd>-{formatPrice(order.totals.discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold">
                  <dt>Toplam</dt>
                  <dd>{formatPrice(order.totals.total)}</dd>
                </div>
              </dl>
            </Card>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void patch({ adminNote: note });
            }}
            className="rounded-xl border border-ink-200 p-4 sm:p-5"
          >
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink-500">İç not (müşteri görmez)</p>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="mt-2 w-full rounded-xl border border-ink-200 bg-paper-50 px-3 py-2 text-sm" />
            <button type="submit" disabled={busy} className="mt-2 inline-flex h-9 items-center gap-2 rounded-full border border-ink-200 px-3 text-xs font-bold hover:bg-paper-100 disabled:opacity-50">
              <Save className="h-3.5 w-3.5" /> Notu kaydet
            </button>
          </form>

          <Card title="Geçmiş">
            <div className="mt-3">
              <OrderTimeline order={order} />
            </div>
          </Card>
        </div>
      )}
    </Drawer>
  );
}

/* ------------------------ Anlaşmalı müşteri fiş detayı ---------------------- */
function PanelDrawer({ token, orderRef, onClose, onChanged }: { token: string; orderRef: string; onClose: () => void; onChanged: () => void }) {
  const [order, setOrder] = useState<PanelApiOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await admin.panelGet(token, orderRef);
    if (res.status === "success" && res.order) setOrder(res.order);
    else setError(res.reason ?? "Fiş yüklenemedi");
  }, [token, orderRef]);

  useEffect(() => {
    const t = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(t);
  }, [refresh]);

  if (order && loadedFor !== order.ref) {
    setLoadedFor(order.ref);
    setNote(order.adminNote ?? "");
  }

  const patch = async (p: { status?: PanelStatus; adminNote?: string }) => {
    setBusy(true);
    setError(null);
    const res = await admin.panelUpdate(token, orderRef, p);
    if (res.status === "success" && res.order) {
      setOrder(res.order);
      onChanged();
    } else setError(res.reason ?? "Güncellenemedi");
    setBusy(false);
  };

  const waText = (o: PanelApiOrder) => `Merhaba ${o.name || o.firm}, ${o.ref} numaralı siparişiniz alındı. ${o.status === "hazirlaniyor" ? "Hazırlanıyor." : o.status === "teslim-edildi" ? "Teslim edildi." : "Onaylandı, hazırlığa başlıyoruz."} — Yavuz Gıda`;

  return (
    <Drawer title={orderRef} subtitle={order ? `${fmtDateTime(order.createdAt)} · ${order.firm}` : undefined} badge={order && <span className={cn("hidden rounded-full px-3 py-1.5 text-xs font-bold sm:inline", panelStatusTone[order.status])}>{panelStatusLabels[order.status]}</span>} onClose={onClose}>
      {!order ? (
        <div className="flex flex-1 items-center justify-center p-10">{error ? <p className="text-red-600">{error}</p> : <Loader2 className="h-6 w-6 animate-spin" />}</div>
      ) : (
        <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
          {error && <p role="alert" className="rounded-xl bg-red-100 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
          <span className={cn("inline-block rounded-full px-3 py-1.5 text-xs font-bold sm:hidden", panelStatusTone[order.status])}>{panelStatusLabels[order.status]}</span>

          <Card title="Durumu güncelle">
            <div className="mt-3 flex flex-wrap gap-2">
              {panelNextSteps[order.status].map((s) => (
                <button key={s} type="button" disabled={busy} onClick={() => void patch({ status: s })} className={cn("rounded-full px-4 py-2 text-sm font-bold transition-colors disabled:opacity-50", s === "iptal" ? "border border-red-600/40 text-red-600 hover:bg-red-100" : "bg-ink-900 text-white hover:bg-ink-800")}>
                  {panelStatusLabels[s]}
                </button>
              ))}
              <details className="ml-auto">
                <summary className="cursor-pointer rounded-full border border-ink-200 px-3 py-2 text-xs font-semibold">Diğer</summary>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {panelStatuses
                    .filter((s) => s !== order.status)
                    .map((s) => (
                      <button key={s} type="button" disabled={busy} onClick={() => void patch({ status: s })} className="rounded-full border border-ink-200 px-2.5 py-1 text-xs font-semibold hover:bg-paper-100">
                        {panelStatusLabels[s]}
                      </button>
                    ))}
                </div>
              </details>
            </div>
          </Card>

          <div className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
            <Card title="Firma" icon={<Store className="h-3.5 w-3.5" />} className="text-sm">
              <p className="mt-2 font-bold">{order.firm}</p>
              {order.name && <p className="text-ink-700">{order.name}</p>}
              <p className="mt-1 flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <a href={`tel:${order.phone}`} className="underline underline-offset-2">
                  {order.phone}
                </a>
              </p>
              {order.note && <p className="mt-2 rounded-lg bg-orange-100/30 px-3 py-2 text-xs">Müşteri notu: {order.note}</p>}
              <a href={waLink(order.phone, waText(order))} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-[#25D366] px-3 text-xs font-bold text-white">
                <MessageCircle className="size-3.5" /> WhatsApp&rsquo;tan bilgi ver
              </a>
            </Card>
            <Card title="Fiş" icon={<FileText className="h-3.5 w-3.5" />} className="text-sm">
              <p className="mt-2">
                <span className="font-bold">{order.items.length} kalem</span> · {order.totalQty} adet · fiyatsız (anlaşmalı tarife)
              </p>
              <p className="mt-1 text-xs text-ink-500">Son güncelleme: {fmtDateTime(order.updatedAt)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {order.pdfUrl && (
                  <a href={order.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-full border border-ink-200 px-3 text-xs font-bold hover:bg-paper-100">
                    <FileText className="size-3.5" /> PDF fişi aç
                  </a>
                )}
                <button type="button" onClick={() => window.print()} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-ink-200 px-3 text-xs font-bold hover:bg-paper-100">
                  <Printer className="size-3.5" /> Yazdır
                </button>
              </div>
            </Card>
          </div>

          <Card title="Sipariş kalemleri">
            <ul className="mt-3 divide-y divide-ink-200 text-sm">
              {order.items.map((it, i) => (
                <li key={`${it.slug}-${it.variantId}-${i}`} className="flex items-start justify-between gap-3 py-2">
                  <div className="min-w-0">
                    <p>
                      <span className="font-semibold">{it.brand}</span> {it.name}
                    </p>
                    <p className="text-xs text-ink-500">
                      {it.variantLabel} · <span className="font-mono">{it.sku}</span>
                    </p>
                    {it.custom && <p className="mt-0.5 text-xs text-ink-600">{it.custom}</p>}
                  </div>
                  <span className="shrink-0 rounded-md bg-paper-100 px-2 py-0.5 text-sm font-bold">× {it.qty}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 border-t border-ink-200 pt-2 text-right text-sm font-bold">
              Toplam {order.totalQty} adet · {order.items.length} kalem
            </p>
          </Card>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void patch({ adminNote: note });
            }}
            className="rounded-xl border border-ink-200 p-4 sm:p-5"
          >
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink-500">İç not (müşteri görmez)</p>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Teslimat günü, araç, eksik ürün…" className="mt-2 w-full rounded-xl border border-ink-200 bg-paper-50 px-3 py-2 text-sm" />
            <button type="submit" disabled={busy} className="mt-2 inline-flex h-9 items-center gap-2 rounded-full border border-ink-200 px-3 text-xs font-bold hover:bg-paper-100 disabled:opacity-50">
              <Save className="h-3.5 w-3.5" /> Notu kaydet
            </button>
          </form>
        </div>
      )}
    </Drawer>
  );
}


