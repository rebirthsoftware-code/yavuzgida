import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Teslimat ve Kargo" };

export default function Page() {
  return (
    <PageShell title="Teslimat ve Kargo" crumb="Teslimat ve Kargo" narrow>
      <div className="rounded-xl border border-ink-200 bg-white p-6 sm:p-8">
        <p className="text-sm leading-relaxed text-ink-600">
          Bu sayfa yer tutucudur. {site.legal.companyName} için hazırlanacak “Teslimat ve Kargo” metni hukuk danışmanı onayından sonra buraya eklenecektir.
        </p>
      </div>
    </PageShell>
  );
}
