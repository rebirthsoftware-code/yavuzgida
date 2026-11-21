import type { Metadata } from "next";
import { PanelHistory } from "@/components/panel/PanelHistory";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = { title: "Fişlerim" };

export default function Page() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-12 pt-5">
      <Breadcrumbs home={{ label: "Panel", href: "/panel" }} items={[{ label: "Fişlerim" }]} />
      <h1 className="mt-2 text-2xl font-extrabold text-ink-900 sm:text-3xl">Fişlerim</h1>
      <p className="mt-1 text-sm text-ink-500">Bu cihazda oluşturduğunuz sipariş fişleri. Fişi açıp yeniden WhatsApp ile gönderebilir veya PDF indirebilirsiniz.</p>
      <PanelHistory />
    </div>
  );
}
