"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";

/** Mevcut müşteri modunda ödeme sayfası yerine sipariş listesine yönlendirir. */
export function ModeRedirect({ to = "/sepet" }: { to?: string }) {
  const { mode, modeReady } = useCart();
  const router = useRouter();
  useEffect(() => {
    if (modeReady && mode === "mevcut") router.replace(to);
  }, [mode, modeReady, router, to]);
  return null;
}
