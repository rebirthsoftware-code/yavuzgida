"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LayoutGrid, ChevronDown, ArrowRight } from "lucide-react";
import { categories } from "@/lib/categories";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

const quick = [
  { label: "Tüm ürünler", href: "/urunler" },
  { label: "Fırsatlar", href: "/urunler?etiket=indirim", accent: true },
  { label: "Çok satanlar", href: "/urunler?etiket=cok-satan" },
  { label: "Yeni gelenler", href: "/urunler?etiket=yeni" },
  { label: "Kurumsal", href: "/kurumsal" },
  { label: "Sipariş takip", href: "/siparis-takip" },
];

export function CategoryNav({ counts }: { counts: Record<string, number> }) {
  const [open, setOpen] = useState(false);
  const [activeCat, setActiveCat] = useState(categories[0].slug);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = categories.find((c) => c.slug === activeCat)!;

  return (
    <div ref={ref} className="relative hidden border-t border-ink-100 lg:block">
      <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className={`flex h-12 items-center gap-2.5 px-5 text-sm font-semibold transition ${open ? "bg-copper text-white" : "bg-navy-900 text-white hover:bg-navy-800"}`}
        >
          <LayoutGrid className="size-4.5" />
          Tüm kategoriler
          <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        <nav className="flex items-center gap-0.5 overflow-x-auto no-scrollbar">
          {quick.map((q) => (
            <Link key={q.href} href={q.href} className={`whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium transition ${q.accent ? "text-orange-600 hover:bg-orange-50" : "text-ink-700 hover:bg-sky-50 hover:text-navy-900"}`}>
              {q.label}
            </Link>
          ))}
        </nav>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full z-50 border-t border-ink-100 bg-white shadow-pop animate-fade-up">
          <div className="mx-auto grid max-w-7xl grid-cols-[280px_1fr] px-4 sm:px-6">
            <ul className="border-r border-ink-100 py-3">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/kategori/${c.slug}`}
                    onMouseEnter={() => setActiveCat(c.slug)}
                    onFocus={() => setActiveCat(c.slug)}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-l-xl py-2.5 pl-3 pr-4 text-sm font-semibold transition ${c.slug === activeCat ? "bg-sky-50 text-navy-900" : "text-ink-700 hover:bg-paper-50"}`}
                  >
                    <span className="grid size-8 place-items-center rounded-lg" style={{ background: c.colorSoft, color: c.color }}>
                      <CategoryIcon name={c.icon} className="size-4" />
                    </span>
                    <span className="flex-1">{c.name}</span>
                    <span className="text-xs font-medium tabular-nums text-ink-400">{counts[c.slug] ?? 0}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="p-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: active.color }}>
                    {active.short}
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-ink-900">{active.name}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-500">{active.description}</p>
                </div>
                <Link href={`/kategori/${active.slug}`} onClick={() => setOpen(false)} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800">
                  Kategoriye git <ArrowRight className="size-4" />
                </Link>
              </div>
              <ul className="mt-6 grid grid-cols-3 gap-2">
                {active.subcategories.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/kategori/${active.slug}/${s.slug}`} onClick={() => setOpen(false)} className="flex items-center justify-between rounded-xl border border-ink-100 px-4 py-3 text-sm font-medium text-ink-800 transition hover:border-orange-400 hover:bg-orange-50 hover:text-navy-900">
                      {s.name}
                      <ArrowRight className="size-3.5 text-ink-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
