"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { cartCount, cartSubtotal, type CartItem } from "@/lib/cart";
import { cartStore } from "@/lib/cart-store";
import { modeStore, type CustomerMode } from "@/lib/mode-store";

type Ctx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  /** Mobil tam ekran sipariş listesi */
  sheetOpen: boolean;
  setSheetOpen: (v: boolean) => void;
  /** Mobil kategori sayfası */
  catsOpen: boolean;
  setCatsOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  add: (item: CartItem) => void;
  setQty: (slug: string, variantId: string, qty: number) => void;
  remove: (slug: string, variantId: string) => void;
  clear: () => void;
  qtyOf: (slug: string, variantId: string) => number;
  /** Son eklenen kalem (panelde vurgulamak için) */
  lastKey: string | null;
  /** Müşteri modu */
  mode: CustomerMode | null;
  modeReady: boolean;
  setMode: (m: CustomerMode | null) => void;
  /** Mevcut müşteri modunda fiyatlar gizlenir */
  showPrices: boolean;
};

const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { items, ready } = useSyncExternalStore(cartStore.subscribe, cartStore.get, cartStore.getServer);
  const { mode, ready: modeReady } = useSyncExternalStore(modeStore.subscribe, modeStore.get, modeStore.getServer);
  const setMode = useCallback((m: CustomerMode | null) => modeStore.set(m), []);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lastKey, setLastKey] = useState<string | null>(null);

  const add = useCallback((item: CartItem) => {
    const prev = cartStore.get().items;
    const i = prev.findIndex((x) => x.slug === item.slug && x.variantId === item.variantId);
    const next = [...prev];
    if (i === -1) next.push(item);
    else next[i] = { ...next[i], qty: next[i].qty + item.qty };
    cartStore.set(next);
    const key = `${item.slug}:${item.variantId}`;
    setLastKey(key);
    setTimeout(() => setLastKey((k) => (k === key ? null : k)), 1200);
  }, []);

  const setQty = useCallback((slug: string, variantId: string, qty: number) => {
    const list = cartStore.get().items;
    if (qty <= 0) cartStore.set(list.filter((x) => !(x.slug === slug && x.variantId === variantId)));
    else cartStore.set(list.map((x) => (x.slug === slug && x.variantId === variantId ? { ...x, qty } : x)));
  }, []);

  const remove = useCallback((slug: string, variantId: string) => {
    cartStore.set(cartStore.get().items.filter((x) => !(x.slug === slug && x.variantId === variantId)));
  }, []);

  const clear = useCallback(() => cartStore.set([]), []);

  const qtyOf = useCallback((slug: string, variantId: string) => items.find((x) => x.slug === slug && x.variantId === variantId)?.qty ?? 0, [items]);

  const value = useMemo<Ctx>(
    () => ({ items, count: cartCount(items), subtotal: cartSubtotal(items), ready, sheetOpen, setSheetOpen, catsOpen, setCatsOpen, searchOpen, setSearchOpen, add, setQty, remove, clear, qtyOf, lastKey, mode, modeReady, setMode, showPrices: mode !== "mevcut" }),
    [items, ready, sheetOpen, catsOpen, searchOpen, add, setQty, remove, clear, qtyOf, lastKey, mode, modeReady, setMode],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart, CartProvider içinde kullanılmalı");
  return ctx;
}
