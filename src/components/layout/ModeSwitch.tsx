"use client";

import { UserCheck, UserPlus, RefreshCw } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

/** Başlıkta aktif müşteri modunu gösterir; tıklayınca seçim ekranı yeniden açılır. */
export function ModeSwitch({ compact = false }: { compact?: boolean }) {
  const { mode, modeReady, setMode } = useCart();
  if (!modeReady || !mode) return null;
  const existing = mode === "mevcut";
  return (
    <button
      onClick={() => setMode(null)}
      title="Müşteri tipini değiştir"
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold transition ${existing ? "border-gold-500/50 bg-gold-500/10 text-gold-400 hover:bg-gold-500/20" : "border-white/15 text-ink-300 hover:text-white"}`}
    >
      {existing ? <UserCheck className="size-3.5" /> : <UserPlus className="size-3.5" />}
      {!compact && (existing ? "Mevcut müşteri" : "Yeni müşteri")}
      <RefreshCw className="size-3 opacity-60" />
    </button>
  );
}
