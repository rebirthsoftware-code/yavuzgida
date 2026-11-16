"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { cartCount, cartSubtotal, type CartItem } from "@/lib/cart";
import { cartStore } from "@/lib/cart-store";

type Ctx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  open: boolean;
  searchOpen: boolean;
  ready: boolean;
  setOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  add: (item: CartItem) => void;
  setQty: (slug: string, variantId: string, qty: number) => void;
  remove: (slug: string, variantId: string) => void;
  clear: () => void;
  toast: string | null;
};

const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { items, ready } = useSyncExternalStore(cartStore.subscribe, cartStore.get, cartStore.getServer);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToastState] = useState<string | null>(null);

  const setToast = useCallback((msg: string) => {
    setToastState(msg);
    setTimeout(() => setToastState((cur) => (cur === msg ? null : cur)), 2200);
  }, []);

  const add = useCallback(
    (item: CartItem) => {
      const prev = cartStore.get().items;
      const i = prev.findIndex((x) => x.slug === item.slug && x.variantId === item.variantId);
      const next = [...prev];
      if (i === -1) next.push(item);
      else next[i] = { ...next[i], qty: next[i].qty + item.qty };
      cartStore.set(next);
      setToast(`${item.name} (${item.variantLabel}) sepete eklendi`);
    },
    [setToast],
  );

  const setQty = useCallback((slug: string, variantId: string, qty: number) => {
    cartStore.set(cartStore.get().items.map((x) => (x.slug === slug && x.variantId === variantId ? { ...x, qty: Math.max(1, qty) } : x)));
  }, []);

  const remove = useCallback((slug: string, variantId: string) => {
    cartStore.set(cartStore.get().items.filter((x) => !(x.slug === slug && x.variantId === variantId)));
  }, []);

  const clear = useCallback(() => cartStore.set([]), []);

  const value = useMemo<Ctx>(
    () => ({ items, count: cartCount(items), subtotal: cartSubtotal(items), open, searchOpen, ready, setOpen, setSearchOpen, add, setQty, remove, clear, toast }),
    [items, open, searchOpen, ready, add, setQty, remove, clear, toast],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart, CartProvider içinde kullanılmalı");
  return ctx;
}
