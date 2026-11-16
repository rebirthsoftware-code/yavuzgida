import { Breadcrumbs } from "./Breadcrumbs";

export function PageShell({ title, lead, crumb, children, narrow }: { title: string; lead?: string; crumb: string; children: React.ReactNode; narrow?: boolean }) {
  return (
    <div className={`mx-auto px-4 pb-16 sm:px-6 ${narrow ? "max-w-3xl" : "max-w-7xl"}`}>
      <div className="py-5">
        <Breadcrumbs items={[{ label: crumb }]} />
      </div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {lead && <p className="mt-3 max-w-2xl text-[1.02rem] leading-relaxed text-ink-500">{lead}</p>}
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

export const inputCls = "h-11 w-full rounded-xl border border-ink-200 bg-white px-3.5 text-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-100";
