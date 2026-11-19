import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = { title: "Ödeme", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-12 pt-3">
      <Breadcrumbs items={[{ label: "Sepet", href: "/sepet" }, { label: "Ödeme" }]} />
      <h1 className="mb-1 mt-3 text-2xl text-ink-900">Ödeme</h1>
      <p className="mb-6 text-sm text-ink-500">Teslimat ve fatura bilgilerinizi girin, ödeme yöntemini seçin. Fiyatlar sipariş anında sunucuda yeniden hesaplanır.</p>
      <CheckoutForm />
    </div>
  );
}
