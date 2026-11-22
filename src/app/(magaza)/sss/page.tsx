import type { Metadata } from "next";
import { PageShell } from "@/components/ui/PageShell";
import { getSiteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Sık Sorulan Sorular" };

export default async function Page() {
  const { faq } = await getSiteConfig();
  return (
    <PageShell title="Sık sorulan sorular" crumb="SSS" narrow>
      <div className="divide-y divide-ink-100 rounded-lg border border-ink-200 bg-white px-6">
        {faq.map((f, i) => (
          <details key={i} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
              {f.q}
              <span className="ml-4 text-ink-300 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-600">{f.a}</p>
          </details>
        ))}
      </div>
    </PageShell>
  );
}
