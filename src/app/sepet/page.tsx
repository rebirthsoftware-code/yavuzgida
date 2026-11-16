import type { Metadata } from "next";
import { CartPage } from "@/components/cart/CartPage";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = { title: "Sepet" };

export default function Page() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <div className="py-5">
        <Breadcrumbs items={[{ label: "Sepet" }]} />
      </div>
      <h1 className="mb-6 text-3xl font-bold">Sepetim</h1>
      <CartPage />
    </div>
  );
}
