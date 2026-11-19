import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PanelList } from "@/components/panel/PanelList";

export const metadata: Metadata = { title: "Sipariş Listem" };

export default function Page() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-12 pt-3">
      <Breadcrumbs home={{ label: "Panel", href: "/panel" }} items={[{ label: "Sipariş Listem" }]} />
      <h1 className="mb-4 mt-3 text-2xl text-ink-900">Sipariş Listem</h1>
      <PanelList />
    </div>
  );
}
