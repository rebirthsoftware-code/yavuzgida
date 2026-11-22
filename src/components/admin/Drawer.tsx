"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/format";

/* ------------------------------ Çekmece kabuğu ----------------------------- */
export function Drawer({ title, subtitle, badge, onClose, children }: { title: string; subtitle?: string; badge?: ReactNode; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-coal-950/50" onClick={onClose} />
      <aside role="dialog" aria-modal="true" aria-label={title} className="absolute inset-y-0 right-0 flex w-full flex-col overflow-y-auto bg-white shadow-menu sm:max-w-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-ink-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 sm:py-4">
          <div className="min-w-0">
            <p className="truncate font-mono text-base font-bold text-ink-900 sm:text-lg">{title}</p>
            {subtitle && <p className="truncate text-xs text-ink-500">{subtitle}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {badge}
            <button type="button" onClick={onClose} aria-label="Kapat" className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-paper-100">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        {children}
      </aside>
    </div>
  );
}

export const Card = ({ title, icon, children, className }: { title: string; icon?: ReactNode; children: ReactNode; className?: string }) => (
  <div className={cn("rounded-xl border border-ink-200 p-4 sm:p-5", className)}>
    <p className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink-500">
      {icon} {title}
    </p>
    {children}
  </div>
);

