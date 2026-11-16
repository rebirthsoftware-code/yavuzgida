import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { OrderList } from "@/components/order/OrderList";

export const metadata: Metadata = { title: "Sipariş Listesi" };

export default function Page() {
  return (
    <div>
      <header className="border-b border-ink-200 px-4 pb-6 pt-6 lg:px-6 lg:pt-8">
        <Breadcrumbs items={[{ label: "Sipariş listesi" }]} />
        <h1 className="mt-5 text-4xl text-navy-900 sm:text-5xl">Sipariş listesi</h1>
        <p className="mt-2 text-sm text-ink-500">Kalemleri düzenleyin; adetleri değiştirin veya kaldırın. Liste cihazınızda saklanır.</p>
      </header>
      <div className="mx-4 my-8 overflow-hidden rounded-xl border border-ink-200 bg-paper-50 lg:mx-6">
        <OrderList wide />
      </div>
    </div>
  );
}
