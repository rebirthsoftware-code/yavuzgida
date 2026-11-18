"use client";

import { useCart } from "./CartProvider";

/** Yalnızca fiyatlı (yeni müşteri) modda görünen bölümler; mevcut müşteri için alternatif içerik. */
export function OnlyNew({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const { showPrices } = useCart();
  return <>{showPrices ? children : fallback}</>;
}
