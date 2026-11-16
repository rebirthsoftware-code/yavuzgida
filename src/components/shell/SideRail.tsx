import Link from "next/link";
import { Phone, MessageCircle, Sparkles, Building2, PackageSearch, LayoutList } from "lucide-react";
import { categories } from "@/lib/categories";
import { categoryCounts } from "@/lib/catalog";
import { site } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";
import { RailNav } from "./RailNav";

/** Masaüstünde her zaman görünen sol kategori rayı. */
export function SideRail() {
  const counts = categoryCounts();
  return (
    <aside className="sticky top-0 hidden h-screen flex-col overflow-y-auto border-r border-ink-200 bg-sky-50 lg:flex">
      <div className="px-5 pb-4 pt-6">
        <Logo />
        <p className="mt-1.5 text-xs text-ink-500">Toptan & perakende gıda tedariki</p>
      </div>

      <nav className="px-3">
        <p className="mb-2 px-2.5 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-ink-400">Katalog</p>
        <Link href="/urunler" className="mb-1 flex items-center gap-3 rounded-lg px-2.5 py-2 text-[0.92rem] text-ink-700 hover:bg-white/60 hover:text-navy-900">
          <span className="w-5" />
          <LayoutList className="size-4 text-ink-400" strokeWidth={1.8} />
          <span className="flex-1">Tüm ürünler</span>
        </Link>
        <RailNav categories={categories} counts={counts} />
      </nav>

      <nav className="mt-6 px-3">
        <p className="mb-2 px-2.5 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-ink-400">Öne çıkanlar</p>
        <ul className="space-y-0.5 text-[0.9rem]">
          {[
            { href: "/urunler?etiket=indirim", label: "Fırsatlar", icon: Sparkles, accent: true },
            { href: "/kurumsal", label: "Kurumsal & toptan", icon: Building2 },
            { href: "/siparis-takip", label: "Sipariş takip", icon: PackageSearch },
          ].map(({ href, label, icon: I, accent }) => (
            <li key={href}>
              <Link href={href} className={`flex items-center gap-3 rounded-lg px-2.5 py-2 hover:bg-white/60 ${accent ? "text-orange-700" : "text-ink-700 hover:text-navy-900"}`}>
                <span className="w-5" />
                <I className="size-4" strokeWidth={1.8} />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto border-t border-ink-200 p-5">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-ink-400">Sipariş hattı</p>
        <a href={site.contact.phoneHref} className="mt-2 flex items-center gap-2 font-display text-xl font-semibold text-navy-900">
          <Phone className="size-4 text-orange-600" /> {site.contact.phone}
        </a>
        <a href={site.contact.whatsappHref} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-2 rounded-lg bg-navy-900 px-3 py-2 text-xs font-semibold text-white hover:bg-navy-800">
          <MessageCircle className="size-3.5" /> WhatsApp ile sipariş
        </a>
        <p className="mt-3 text-[0.7rem] leading-relaxed text-ink-500">{site.contact.workingHours}</p>
      </div>
    </aside>
  );
}
