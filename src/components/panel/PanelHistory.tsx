"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { FileText, ChevronRight, ClipboardList } from "lucide-react";
import { listPanelOrders, type PanelOrder } from "@/lib/panel-order";
import { formatDate } from "@/lib/format";

const noop = () => () => {};
const EMPTY: PanelOrder[] = [];
let cache: { raw: string; list: PanelOrder[] } | null = null;
function readOrders(): PanelOrder[] {
  try {
    const raw = localStorage.getItem("yavuz-panel-orders-v1") ?? "";
    if (!cache || cache.raw !== raw) cache = { raw, list: listPanelOrders() };
    return cache.list;
  } catch {
    return EMPTY;
  }
}

export function PanelHistory() {
  const orders = useSyncExternalStore(noop, readOrders, () => EMPTY);
  if (orders.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center rounded-xl border border-ink-200 bg-white px-6 py-14 text-center">
        <ClipboardList className="size-10 text-ink-300" />
        <p className="mt-3 font-bold text-ink-900">Henüz fiş yok</p>
        <p className="mt-1 text-sm text-ink-500">Ürünleri listeye ekleyip onayladığınızda fişleriniz burada birikir.</p>
        <Link href="/panel/urunler" className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-orange-500 px-5 text-sm font-bold text-white hover:bg-orange-600">
          Kataloğa git <ChevronRight className="size-4" />
        </Link>
      </div>
    );
  }
  return (
    <ul className="mt-6 divide-y divide-ink-100 overflow-hidden rounded-xl border border-ink-200 bg-white">
      {orders.map((o) => {
        const qty = o.items.reduce((s, it) => s + it.qty, 0);
        return (
          <li key={o.ref}>
            <Link href={`/panel/siparis?ref=${o.ref}`} className="flex items-center gap-3 px-4 py-3 hover:bg-paper-50">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-gold-100 text-gold-600">
                <FileText className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-sm font-bold text-ink-900">{o.ref}</span>
                <span className="block truncate text-xs text-ink-500">
                  {formatDate(o.createdAt)} · {o.form.firm} · {o.items.length} kalem, {qty} adet
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-ink-400" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
