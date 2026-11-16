import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "İptal ve İade Koşulları" };

export default function Page() {
  return (
    <PageShell title="İptal ve İade Koşulları" crumb="İptal ve İade Koşulları" narrow>
      <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
        <p className="text-sm leading-relaxed text-ink-600">
          Bu sayfa yer tutucudur. {site.legal.companyName} için hazırlanacak “İptal ve İade Koşulları” metni hukuk danışmanı onayından sonra buraya eklenecektir.
        </p>
      </div>
    </PageShell>
  );
}
