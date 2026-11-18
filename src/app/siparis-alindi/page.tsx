import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderSuccess } from "@/components/checkout/OrderSuccess";

export const metadata: Metadata = {
  title: "Siparişiniz alındı",
  robots: { index: false },
};

export default function OrderSuccessPage() {
  return (
    <section className="mx-auto max-w-[1320px] px-4 py-10">
      <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-paper-100" />}>
        <OrderSuccess />
      </Suspense>
    </section>
  );
}
