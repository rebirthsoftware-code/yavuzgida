import type { Metadata } from "next";
import { Suspense } from "react";
import { PanelOrderSheet } from "@/components/panel/PanelOrderSheet";

export const metadata: Metadata = { title: "Sipariş Fişi" };

export default function Page() {
  return (
    <div className="mx-auto max-w-[1320px] px-4 pb-12 pt-5">
      <Suspense fallback={<div className="h-64 animate-pulse rounded-lg bg-white" />}>
        <PanelOrderSheet />
      </Suspense>
    </div>
  );
}
