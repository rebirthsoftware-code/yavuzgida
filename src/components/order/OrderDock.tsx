"use client";

import { ClipboardList, X } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { OrderList } from "./OrderList";

/** Masaüstü (xl+): sağda her zaman açık sipariş paneli. Altında: tam ekran sayfa. */
export function OrderDock() {
  const { count, ready, sheetOpen, setSheetOpen } = useCart();

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  const header = (onClose?: () => void) => (
    <div className="flex items-center justify-between border-b border-ink-200 bg-navy-900 px-4 py-3 text-white">
      <div className="flex items-center gap-2">
        <ClipboardList className="size-4 text-orange-400" />
        <h2 className="font-display text-xl">Sipariş listesi</h2>
        {ready && count > 0 && <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold">{count}</span>}
      </div>
      {onClose ? (
        <button onClick={onClose} aria-label="Kapat" className="grid size-8 place-items-center rounded-md hover:bg-white/10">
          <X className="size-4" />
        </button>
      ) : (
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sky-300">Canlı</span>
      )}
    </div>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-screen flex-col border-l border-ink-200 bg-paper-50 xl:flex" aria-label="Sipariş listesi">
        {header()}
        <div className="min-h-0 flex-1">
          <OrderList />
        </div>
      </aside>

      {sheetOpen && (
        <div className="fixed inset-0 z-[46] flex flex-col bg-paper-50 pb-16 lg:pb-0 xl:hidden" role="dialog" aria-label="Sipariş listesi">
          {header(() => setSheetOpen(false))}
          <div className="min-h-0 flex-1">
            <OrderList onNavigate={() => setSheetOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
