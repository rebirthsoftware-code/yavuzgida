import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ShieldCheck, CreditCard, Landmark } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/ui/SocialIcons";
import { CopyrightYear } from "./CopyrightYear";
import { site } from "@/lib/site";
import { categories } from "@/lib/categories";
import { Logo } from "@/components/ui/Logo";
import { formatCompact } from "@/lib/format";

const links = {
  Kurumsal: [
    ["Hakkımızda", "/hakkimizda"],
    ["Kurumsal & Toptan Satış", "/kurumsal"],
    ["İletişim", "/iletisim"],
    ["Sipariş Takip", "/siparis-takip"],
    ["Sık Sorulan Sorular", "/sss"],
  ],
  Yardım: [
    ["Teslimat ve Kargo", "/teslimat-ve-kargo"],
    ["İptal ve İade Koşulları", "/iptal-ve-iade"],
    ["Mesafeli Satış Sözleşmesi", "/mesafeli-satis-sozlesmesi"],
    ["KVKK Aydınlatma Metni", "/kvkk"],
    ["Gizlilik ve Çerez Politikası", "/gizlilik-politikasi"],
  ],
};

export function Footer() {
  return (
    <footer className="bg-grid mt-20 bg-navy-950 text-sky-100">
      {/* Güven şeridi */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-8 sm:grid-cols-3 sm:px-6">
          {[
            { icon: ShieldCheck, t: "Güvenli alışveriş", d: "256-bit SSL, 3D Secure ödeme" },
            { icon: CreditCard, t: "Esnek ödeme", d: "Kredi kartı, havale/EFT, kurumsal vade" },
            { icon: Landmark, t: "Kurumsal fatura", d: "E-fatura ve toplu alımda kademeli fiyat" },
          ].map(({ icon: I, t, d }) => (
            <div key={t} className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/5 text-orange-400">
                <I className="size-5" />
              </span>
              <div>
                <p className="font-semibold text-white">{t}</p>
                <p className="text-sm text-sky-200/80">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-sky-200/80">{site.description}</p>
          <div className="mt-5 flex gap-2">
            <a href={site.social.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="grid size-10 place-items-center rounded-lg bg-white/5 hover:bg-white/10">
              <InstagramIcon className="size-4.5" />
            </a>
            <a href={site.social.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="grid size-10 place-items-center rounded-lg bg-white/5 hover:bg-white/10">
              <FacebookIcon className="size-4.5" />
            </a>
          </div>
        </div>
        {Object.entries(links).map(([title, items]) => (
          <div key={title}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">{title}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {items.map(([l, h]) => (
                <li key={h}>
                  <Link href={h} className="hover:text-white">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">İletişim</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-green-300" />
              {site.contact.address}
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-green-300" />
              <a href={site.contact.phoneHref} className="hover:text-white">
                {site.contact.phone}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-green-300" />
              <a href={`mailto:${site.contact.email}`} className="hover:text-white">
                {site.contact.email}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-green-300" />
              {site.contact.workingHours}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <nav className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-sky-200/70">
            {categories.map((c) => (
              <Link key={c.slug} href={`/kategori/${c.slug}`} className="hover:text-white">
                {c.name}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-sky-200/60">
            <p>© <CopyrightYear /> {site.legal.companyName} · Tüm hakları saklıdır.</p>
            <p>
              {formatCompact(site.commerce.freeShippingThreshold)} üzeri kargo bedava · Fiyatlara KDV dâhildir
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
