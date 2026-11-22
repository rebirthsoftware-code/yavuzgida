import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";
import { LegalText } from "@/components/ui/LegalText";
import { legalTitles } from "@/lib/content";
import { getSiteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: legalTitles.gizlilik };

export default async function Page() {
  const { legal } = await getSiteConfig();
  return (
    <PageShell title={legalTitles.gizlilik} crumb={legalTitles.gizlilik} narrow>
      <LegalText text={legal.texts.gizlilik} />
    </PageShell>
  );
}
