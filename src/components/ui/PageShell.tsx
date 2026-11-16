import { Breadcrumbs } from "./Breadcrumbs";

export function PageShell({ title, lead, crumb, children, narrow }: { title: string; lead?: string; crumb: string; children: React.ReactNode; narrow?: boolean }) {
  return (
    <div className="pb-16">
      <header className="border-b border-ink-200 px-4 pb-8 pt-6 lg:px-6 lg:pt-8">
        <Breadcrumbs items={[{ label: crumb }]} />
        <h1 className="mt-5 text-4xl text-navy-900 sm:text-5xl">{title}</h1>
        {lead && <p className="mt-3 max-w-2xl text-[1.02rem] leading-relaxed text-ink-500">{lead}</p>}
      </header>
      <div className={`px-4 pt-8 lg:px-6 ${narrow ? "max-w-3xl" : ""}`}>{children}</div>
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

export const inputCls = "h-11 w-full rounded-lg border border-ink-200 bg-white px-3.5 text-sm outline-none transition focus:border-navy-900 focus:ring-2 focus:ring-sky-100";
