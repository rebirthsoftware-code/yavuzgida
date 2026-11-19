import type { Metadata } from "next";
import { PaymentResult } from "@/components/checkout/PaymentResult";

export const metadata: Metadata = { title: "Ödeme başarısız", robots: { index: false } };

const breakout = "if (window.top !== window.self) { window.top.location.href = window.location.href; }";

export default function PaymentFailedPage() {
  return (
    <section className="mx-auto max-w-[1320px] px-4 py-10">
      <script dangerouslySetInnerHTML={{ __html: breakout }} />
      <PaymentResult status="failed" />
    </section>
  );
}
