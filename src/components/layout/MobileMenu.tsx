"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X, ChevronDown, Phone, MessageCircle } from "lucide-react";
import { categories } from "@/lib/categories";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { MenuButton } from "./HeaderActions";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/lib/site";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <MenuButton onClick={() => setOpen(true)} />
      <div className={`fixed inset-0 z-[85] lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-navy-950/60 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} />
        <aside className={`absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
            <Logo tone="dark" />
            <button onClick={() => setOpen(false)} aria-label="Kapat" className="grid size-10 place-items-center rounded-lg text-navy-900 hover:bg-sky-50">
              <X className="size-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 p-4">
              {[
                ["Fırsatlar", "/urunler?etiket=indirim"],
                ["Çok satanlar", "/urunler?etiket=cok-satan"],
                ["Yeni gelenler", "/urunler?etiket=yeni"],
                ["Tüm ürünler", "/urunler"],
              ].map(([l, h]) => (
                <Link key={h} href={h} onClick={() => setOpen(false)} className="rounded-xl bg-paper-100 px-3 py-2.5 text-center text-sm font-semibold text-ink-800">
                  {l}
                </Link>
              ))}
            </div>
            <p className="px-4 pb-1 pt-2 text-xs font-bold uppercase tracking-wider text-ink-400">Kategoriler</p>
            <ul className="px-2">
              {categories.map((c) => (
                <li key={c.slug} className="border-b border-ink-100 last:border-0">
                  <div className="flex items-center">
                    <Link href={`/kategori/${c.slug}`} onClick={() => setOpen(false)} className="flex flex-1 items-center gap-3 px-2 py-3 text-sm font-semibold text-ink-800">
                      <span className="grid size-8 place-items-center rounded-lg" style={{ background: c.colorSoft, color: c.color }}>
                        <CategoryIcon name={c.icon} className="size-4" />
                      </span>
                      {c.name}
                    </Link>
                    <button onClick={() => setExpanded(expanded === c.slug ? null : c.slug)} aria-label="Alt kategoriler" className="grid size-10 place-items-center text-ink-400">
                      <ChevronDown className={`size-4 transition-transform ${expanded === c.slug ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                  {expanded === c.slug && (
                    <ul className="mb-2 ml-12 space-y-0.5">
                      {c.subcategories.map((s) => (
                        <li key={s.slug}>
                          <Link href={`/kategori/${c.slug}/${s.slug}`} onClick={() => setOpen(false)} className="block rounded-lg px-2 py-1.5 text-sm text-ink-600 hover:bg-paper-100">
                            {s.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <ul className="mt-2 border-t border-ink-100 px-4 py-3 text-sm font-medium text-ink-700">
              {[
                ["Kurumsal & Toptan", "/kurumsal"],
                ["Hakkımızda", "/hakkimizda"],
                ["İletişim", "/iletisim"],
                ["Sipariş takip", "/siparis-takip"],
              ].map(([l, h]) => (
                <li key={h}>
                  <Link href={h} onClick={() => setOpen(false)} className="block py-2">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-ink-100 p-4">
            <a href={site.contact.phoneHref} className="flex items-center justify-center gap-2 rounded-full bg-navy-900 py-2.5 text-sm font-semibold text-white">
              <Phone className="size-4" /> Ara
            </a>
            <a href={site.contact.whatsappHref} target="_blank" rel="noopener" className="flex items-center justify-center gap-2 rounded-full bg-[#25d366] py-2.5 text-sm font-semibold text-white">
              <MessageCircle className="size-4" /> WhatsApp
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
