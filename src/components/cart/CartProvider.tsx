"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { cartCount, cartSubtotal, type CartItem } from "@/lib/cart";
import { cartStore, panelStore } from "@/lib/cart-store";

export const PANEL_BASE = "/panel";

type Ctx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  /** Anlaşmalı müşteri panelinde miyiz? (/panel altı) */
  inPanel: boolean;
  /** Bağlantı ön eki: mağazada "", panelde "/panel" */
  base: string;
  /** Panelde fiyatlar gizlenir */
  showPrices: boolean;
  catsOpen: boolean;
  setCatsOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  add: (item: CartItem) => void;
  setQty: (slug: string, variantId: string, qty: number) => void;
  remove: (slug: string, variantId: string) => void;
  clear: () => void;
  qtyOf: (slug: string, variantId: string) => number;
  lastKey: string | null;
};

const CartContext = createContext<Ctx | null>(null);

const noopSub = () => () => {};
/**
 * Bu alt ağaç sunucu HTML'iyle eşleştirildi mi? Geç hidrate olan (Suspense içindeki) bileşenler
 * sepet rozetini ancak bundan sonra çizer; aksi hâlde sunucu/istemci uyuşmazlığı oluşur.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSub, () => true, () => false);
}

export function CartProvider({ children, inPanel = false }: { children: ReactNode; inPanel?: boolean }) {
  const store = inPanel ? panelStore : cartStore;
  const { items, ready } = useSyncExternalStore(store.subscribe, store.get, store.getServer);
  const [catsOpen, setCatsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lastKey, setLastKey] = useState<string | null>(null);

  const add = useCallback(
    (item: CartItem) => {
      const prev = store.get().items;
      const i = prev.findIndex((x) => x.slug === item.slug && x.variantId === item.variantId);
      const next = [...prev];
      if (i === -1) next.push(item);
      else next[i] = { ...next[i], qty: next[i].qty + item.qty };
      store.set(next);
      const key = `${item.slug}:${item.variantId}`;
      setLastKey(key);
      setTimeout(() => setLastKey((k) => (k === key ? null : k)), 1200);
    },
    [store],
  );

  const setQty = useCallback(
    (slug: string, variantId: string, qty: number) => {
      const list = store.get().items;
      if (qty <= 0) store.set(list.filter((x) => !(x.slug === slug && x.variantId === variantId)));
      else store.set(list.map((x) => (x.slug === slug && x.variantId === variantId ? { ...x, qty } : x)));
    },
    [store],
  );

  const remove = useCallback((slug: string, variantId: string) => store.set(store.get().items.filter((x) => !(x.slug === slug && x.variantId === variantId))), [store]);
  const clear = useCallback(() => store.clear(), [store]);
  const qtyOf = useCallback((slug: string, variantId: string) => items.find((x) => x.slug === slug && x.variantId === variantId)?.qty ?? 0, [items]);

  const value = useMemo<Ctx>(
    () => ({ items, count: cartCount(items), subtotal: cartSubtotal(items), ready, inPanel, base: inPanel ? PANEL_BASE : "", showPrices: !inPanel, catsOpen, setCatsOpen, searchOpen, setSearchOpen, add, setQty, remove, clear, qtyOf, lastKey }),
    [items, ready, inPanel, catsOpen, searchOpen, add, setQty, remove, clear, qtyOf, lastKey],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart, CartProvider içinde kullanılmalı");
  return ctx;
}
