import type { Metadata } from "next";
import { CartPage } from "@/components/cart/CartPage";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CartTitle } from "@/components/cart/CartTitle";

export const metadata: Metadata = { title: "Sepetim" };

export default function Page() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-12 pt-3">
      <Breadcrumbs items={[{ label: "Sepet" }]} />
      <CartTitle />
      <CartPage />
    </div>
  );
}
