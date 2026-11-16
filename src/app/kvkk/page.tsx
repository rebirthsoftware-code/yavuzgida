import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "KVKK Aydınlatma Metni" };

export default function Page() {
  return (
    <PageShell title="KVKK Aydınlatma Metni" crumb="KVKK Aydınlatma Metni" narrow>
      <div className="rounded-xl border border-ink-200 bg-white p-6 sm:p-8">
        <p className="text-sm leading-relaxed text-ink-600">
          Bu sayfa yer tutucudur. {site.legal.companyName} için hazırlanacak “KVKK Aydınlatma Metni” metni hukuk danışmanı onayından sonra buraya eklenecektir.
        </p>
      </div>
    </PageShell>
  );
}
