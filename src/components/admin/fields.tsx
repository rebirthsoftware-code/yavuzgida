"use client";

import { useState, type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";
import { Loader2, Save, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/format";

export const inputCls = "h-10 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none focus:border-ink-900 disabled:bg-paper-50";

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1 block text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-500">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[0.7rem] text-ink-400">{hint}</span>}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputCls, props.className)} />;
}
export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputCls, "h-auto py-2 leading-relaxed", props.className)} />;
}
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(inputCls, "pr-8", props.className)} />;
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="inline-flex items-center gap-2 text-sm font-semibold text-ink-800">
      <span className={cn("relative inline-block h-6 w-11 rounded-full transition", checked ? "bg-green-600" : "bg-ink-300")}>
        <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition", checked ? "left-[1.35rem]" : "left-0.5")} />
      </span>
      {label}
    </button>
  );
}

export function NumberInput({ value, onChange, step = 1, min, ...rest }: { value: number | undefined; onChange: (v: number | undefined) => void; step?: number; min?: number } & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <input
      {...rest}
      type="number"
      inputMode="decimal"
      step={step}
      min={min}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
      className={cn(inputCls, rest.className)}
    />
  );
}

/** Kaydet butonu + durum bildirimi (kaydediliyor / kaydedildi / hata) */
export function useSaver() {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const run = async (fn: () => Promise<{ status: string; reason?: string }>) => {
    setState("saving");
    setError(null);
    try {
      const r = await fn();
      if (r.status === "success") {
        setState("saved");
        setTimeout(() => setState("idle"), 1800);
        return true;
      }
      setState("error");
      setError(r.reason ?? "Kaydedilemedi");
      return false;
    } catch (e) {
      setState("error");
      setError(e instanceof Error ? e.message : "Kaydedilemedi");
      return false;
    }
  };
  return { state, error, run };
}

export function SaveButton({ state, label = "Kaydet", onClick, className }: { state: "idle" | "saving" | "saved" | "error"; label?: string; onClick?: () => void; className?: string }) {
  return (
    <button type={onClick ? "button" : "submit"} onClick={onClick} disabled={state === "saving"} className={cn("inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-bold text-white transition disabled:opacity-60", state === "saved" ? "bg-green-600" : "bg-ink-900 hover:bg-ink-800", className)}>
      {state === "saving" ? <Loader2 className="size-4 animate-spin" /> : state === "saved" ? <Check className="size-4" /> : <Save className="size-4" />}
      {state === "saving" ? "Kaydediliyor…" : state === "saved" ? "Kaydedildi" : label}
    </button>
  );
}

export function Section({ title, desc, children, footer }: { title: string; desc?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <section className="rounded-xl border border-ink-200 bg-white">
      <header className="border-b border-ink-100 px-4 py-3 sm:px-5">
        <h2 className="text-base font-bold text-ink-900">{title}</h2>
        {desc && <p className="mt-0.5 text-xs text-ink-500">{desc}</p>}
      </header>
      <div className="space-y-4 px-4 py-4 sm:px-5">{children}</div>
      {footer && <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-ink-100 px-4 py-3 sm:px-5">{footer}</footer>}
    </section>
  );
}

export function ErrorNote({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <p role="alert" className="flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-xs font-semibold text-red-600">
      <AlertCircle className="size-4" /> {text}
    </p>
  );
}
