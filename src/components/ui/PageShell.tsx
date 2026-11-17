import { Breadcrumbs } from "./Breadcrumbs";

export function PageShell({ title, lead, crumb, children, narrow }: { title: string; lead?: string; crumb: string; children: React.ReactNode; narrow?: boolean }) {
  return (
    <div className={`mx-auto px-4 pb-16 ${narrow ? "max-w-3xl" : "max-w-[1320px]"}`}>
      <div className="py-4">
        <Breadcrumbs items={[{ label: crumb }]} />
      </div>
      <header className="mb-6">
        <h1 className="text-2xl text-ink-900 sm:text-3xl">{title}</h1>
        {lead && <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-ink-500">{lead}</p>}
      </header>
      {children}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink-800">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-400">{hint}</span>}
    </label>
  );
}

export const inputCls = "h-11 w-full rounded-lg border border-ink-200 bg-white px-3.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";
