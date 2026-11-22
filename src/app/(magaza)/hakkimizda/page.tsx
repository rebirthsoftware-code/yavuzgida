import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";
import { getSiteConfig } from "@/lib/site-config";
import { t } from "@/lib/content";

export const metadata: Metadata = { title: "Hakkımızda" };

export default async function Page() {
  const config = await getSiteConfig();
  const tx = (k: string) => t(config, k);
  const stats = [1, 2, 3].map((i) => ({ n: tx(`about.stat${i}.n`), t: tx(`about.stat${i}.t`), d: tx(`about.stat${i}.d`) }));
  const paragraphs = tx("about.body").split(/\n{2,}/).filter(Boolean);
  return (
    <PageShell title="Hakkımızda" crumb="Hakkımızda" lead={tx("about.lead")}>
      <div className="grid gap-6 lg:grid-cols-3">
        {stats.map((s, i) => (
          <div key={i} className="rounded-lg border border-ink-200 bg-white p-6">
            <p className="font-display text-4xl font-black text-orange-500">{s.n}</p>
            <p className="mt-1 font-semibold">{s.t}</p>
            <p className="text-sm text-ink-500">{s.d}</p>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral mt-10 max-w-3xl text-ink-700">
        {paragraphs.map((p, i) => (
          <p key={i} className={i === 0 ? "text-lg leading-relaxed" : "mt-4 leading-relaxed text-ink-600"}>
            {p}
          </p>
        ))}
      </div>
    </PageShell>
  );
}
