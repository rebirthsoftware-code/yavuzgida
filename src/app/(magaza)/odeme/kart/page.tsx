import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PaytrFrame } from "@/components/checkout/PaytrFrame";

export const metadata: Metadata = { title: "Kart ile ödeme", robots: { index: false } };

export default function CardPaymentPage() {
  return (
    <section className="mx-auto max-w-[1320px] px-4 pb-12 pt-3">
      <Breadcrumbs items={[{ label: "Sepet", href: "/sepet" }, { label: "Ödeme", href: "/odeme" }, { label: "Kart ile ödeme" }]} />
      <h1 className="mt-3 text-2xl text-ink-900">Kart ile ödeme</h1>
      <p className="mt-2 text-ink-700">Kart bilgilerinizi PayTR&apos;nin güvenli ödeme penceresine girin.</p>
      <div className="mt-8">
        <PaytrFrame />
      </div>
    </section>
  );
}
