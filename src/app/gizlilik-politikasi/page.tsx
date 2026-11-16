import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Gizlilik ve Çerez Politikası" };

export default function Page() {
  return (
    <PageShell title="Gizlilik ve Çerez Politikası" crumb="Gizlilik ve Çerez Politikası" narrow>
      <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
        <p className="text-sm leading-relaxed text-ink-600">
          Bu sayfa yer tutucudur. {site.legal.companyName} için hazırlanacak “Gizlilik ve Çerez Politikası” metni hukuk danışmanı onayından sonra buraya eklenecektir.
        </p>
      </div>
    </PageShell>
  );
}
