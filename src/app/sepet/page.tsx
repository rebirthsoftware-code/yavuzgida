import type { Metadata } from "next";
import { CartPage } from "@/components/cart/CartPage";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = { title: "Sepetim" };

export default function Page() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-12 pt-3">
      <Breadcrumbs items={[{ label: "Sepetim" }]} />
      <h1 className="mb-4 mt-3 text-2xl text-ink-900">Sepetim</h1>
      <CartPage />
    </div>
  );
}
