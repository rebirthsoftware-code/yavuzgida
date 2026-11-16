import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";
import { PageShell, Field, inputCls } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Sipariş Takip" };

export default function Page() {
  return (
    <PageShell title="Sipariş takip" crumb="Sipariş takip" lead="Sipariş numaranız ve telefon numaranızla kargo durumunu üyeliksiz sorgulayın." narrow>
      <form className="rounded-xl border border-ink-200 bg-white p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Sipariş numarası"><input className={inputCls} placeholder="YVZ-2026-000123" /></Field>
          <Field label="Telefon"><input className={inputCls} inputMode="tel" placeholder="05xx xxx xx xx" /></Field>
        </div>
        <Button type="button" size="lg" className="mt-5 w-full">
          <PackageSearch className="size-5" /> Sorgula
        </Button>
      </form>
    </PageShell>
  );
}
