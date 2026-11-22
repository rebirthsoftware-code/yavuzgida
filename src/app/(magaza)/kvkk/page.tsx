import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";
import { LegalText } from "@/components/ui/LegalText";
import { legalTitles } from "@/lib/content";
import { getSiteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: legalTitles.kvkk };

export default async function Page() {
  const { legal } = await getSiteConfig();
  return (
    <PageShell title={legalTitles.kvkk} crumb={legalTitles.kvkk} narrow>
      <LegalText text={legal.texts.kvkk} />
    </PageShell>
  );
}
