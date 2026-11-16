import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";
import { CopyrightYear } from "./CopyrightYear";
import { InstagramIcon, FacebookIcon } from "@/components/ui/SocialIcons";

const cols = {
  Kurumsal: [
    ["Hakkımızda", "/hakkimizda"],
    ["Kurumsal & Toptan", "/kurumsal"],
    ["İletişim", "/iletisim"],
    ["Sipariş Takip", "/siparis-takip"],
    ["SSS", "/sss"],
  ],
  Yardım: [
    ["Teslimat ve Kargo", "/teslimat-ve-kargo"],
    ["İptal ve İade", "/iptal-ve-iade"],
    ["Mesafeli Satış Sözleşmesi", "/mesafeli-satis-sozlesmesi"],
    ["KVKK", "/kvkk"],
    ["Gizlilik ve Çerez", "/gizlilik-politikasi"],
  ],
};

/** İçerik sütununun altında kompakt altbilgi. */
export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-200 px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-500">{site.description}</p>
          <div className="mt-4 flex gap-2">
            <a href={site.social.instagram} target="_blank" rel="noopener" aria-label="Instagram" className="grid size-9 place-items-center rounded-md border border-ink-200 text-ink-600 hover:border-navy-900 hover:text-navy-900">
              <InstagramIcon className="size-4" />
            </a>
            <a href={site.social.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="grid size-9 place-items-center rounded-md border border-ink-200 text-ink-600 hover:border-navy-900 hover:text-navy-900">
              <FacebookIcon className="size-4" />
            </a>
          </div>
        </div>
        {Object.entries(cols).map(([t, items]) => (
          <div key={t}>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-ink-400">{t}</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-700">
              {items.map(([l, h]) => (
                <li key={h}>
                  <Link href={h} className="hover:text-navy-900">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="text-sm text-ink-700">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-ink-400">İletişim</p>
          <p className="mt-3">{site.contact.address}</p>
          <a href={site.contact.phoneHref} className="mt-2 block font-semibold text-navy-900">
            {site.contact.phone}
          </a>
          <a href={`mailto:${site.contact.email}`} className="block hover:text-navy-900">
            {site.contact.email}
          </a>
          <p className="mt-2 text-xs text-ink-500">{site.contact.workingHours}</p>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-ink-200 pt-5 text-xs text-ink-400">
        <p>
          © <CopyrightYear /> {site.legal.companyName}
        </p>
        <p>Fiyatlara KDV dâhildir · 256-bit SSL · PayTR</p>
      </div>
    </footer>
  );
}
