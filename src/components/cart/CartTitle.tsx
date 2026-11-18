"use client";

import { useCart } from "./CartProvider";

export function CartTitle() {
  const { showPrices } = useCart();
  return <h1 className="mb-4 mt-3 text-2xl text-ink-900">{showPrices ? "Sepetim" : "Sipariş Listem"}</h1>;
}
