import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminPanel } from "@/components/admin/AdminPanel";

export const metadata: Metadata = {
  title: { absolute: "Yavuz Yönetim" },
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "Yavuz Yönetim", statusBarStyle: "black-translucent" },
};

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1320px] px-4 py-12"><div className="h-64 animate-pulse rounded-xl bg-white" /></div>}>
      <AdminPanel />
    </Suspense>
  );
}
