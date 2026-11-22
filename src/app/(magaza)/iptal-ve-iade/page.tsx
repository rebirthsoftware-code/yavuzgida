import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";
import { LegalText } from "@/components/ui/LegalText";
import { legalTitles } from "@/lib/content";
import { getSiteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: legalTitles.iade };

export default async function Page() {
  const { legal } = await getSiteConfig();
  return (
    <PageShell title={legalTitles.iade} crumb={legalTitles.iade} narrow>
      <LegalText text={legal.texts.iade} />
    </PageShell>
  );
}
