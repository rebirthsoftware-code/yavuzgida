"use client";

import { useEffect } from "react";
import { UserCheck, UserPlus, ArrowRight, MessageCircle, CreditCard } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { Logo } from "@/components/ui/Logo";

/** İlk girişte müşteri tipi seçimi. Seçim cihazda saklanır; başlıktan değiştirilebilir. */
export function WelcomeGate() {
  const { mode, modeReady, setMode } = useCart();
  const open = modeReady && mode === null;
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center overflow-y-auto bg-coal-950/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Müşteri tipi seçimi">
      <div className="w-full max-w-3xl animate-fade-in">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo size="lg" />
          <h1 className="mt-5 text-2xl font-extrabold text-white sm:text-3xl">Hoş geldiniz</h1>
          <p className="mt-2 max-w-md text-sm text-ink-300">Üyelik veya şifre gerekmez. Size uygun deneyimi sunabilmemiz için seçim yapın; tercihi daha sonra üst menüden değiştirebilirsiniz.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <button onClick={() => setMode("mevcut")} className="group rounded-2xl border border-gold-500/40 bg-coal-900 p-6 text-left transition hover:border-gold-400 hover:bg-coal-800">
            <span className="grid size-12 place-items-center rounded-xl bg-gold-500/15 text-gold-400">
              <UserCheck className="size-6" />
            </span>
            <h2 className="mt-4 text-xl font-bold text-white">Mevcut Müşteriyim</h2>
            <p className="mt-1 text-sm text-ink-300">Yavuz Gıda ile hâlihazırda çalışıyorum. Katalogdan ürünleri seçip sipariş listemi WhatsApp&apos;tan göndereyim.</p>
            <ul className="mt-4 space-y-1.5 text-xs text-ink-300">
              <li className="flex items-center gap-2">
                <MessageCircle className="size-3.5 text-gold-400" /> Fiyatsız katalog, anlaşmalı fiyatlarınız geçerli
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="size-3.5 text-gold-400" /> Sepet onayında liste WhatsApp&apos;a düşer
              </li>
            </ul>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-gold-400">
              Devam et <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </span>
          </button>
          <button onClick={() => setMode("yeni")} className="group rounded-2xl border border-white/10 bg-white p-6 text-left transition hover:border-orange-400 hover:shadow-hover">
            <span className="grid size-12 place-items-center rounded-xl bg-orange-50 text-orange-600">
              <UserPlus className="size-6" />
            </span>
            <h2 className="mt-4 text-xl font-bold text-ink-900">Yeni Müşteriyim</h2>
            <p className="mt-1 text-sm text-ink-600">İlk kez alışveriş yapacağım. Fiyatları göreyim, sepetimi oluşturup online ödeyeyim.</p>
            <ul className="mt-4 space-y-1.5 text-xs text-ink-600">
              <li className="flex items-center gap-2">
                <CreditCard className="size-3.5 text-orange-500" /> Liste fiyatları ve kampanyalar görünür
              </li>
              <li className="flex items-center gap-2">
                <CreditCard className="size-3.5 text-orange-500" /> Kredi kartı veya havale ile ödeme
              </li>
            </ul>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-orange-600">
              Alışverişe başla <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
