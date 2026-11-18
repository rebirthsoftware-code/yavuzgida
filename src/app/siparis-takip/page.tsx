import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/ui/PageShell";
import { OrderTracking } from "@/components/order/OrderTracking";

export const metadata: Metadata = { title: "Sipariş Takip", description: "Sipariş numaranız ve telefonunuzla siparişinizin durumunu ve kargo takibini üyeliksiz görüntüleyin." };

export default function Page() {
  return (
    <PageShell title="Sipariş takip" crumb="Sipariş takip" lead="Sipariş numaranızı ve siparişte kullandığınız telefon numarasını girin; durumu, kargo firmasını ve takip numarasını görün. Üyelik gerekmez.">
      <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-white" />}>
        <OrderTracking />
      </Suspense>
    </PageShell>
  );
}
