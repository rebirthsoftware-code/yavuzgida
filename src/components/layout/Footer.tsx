import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ShieldCheck, Truck, RotateCcw, Headset } from "lucide-react";
import { site } from "@/lib/site";
import { getCategories } from "@/lib/catalog";
import { ConfigLink, ConfigValue } from "@/components/config/ConfigValue";
import { Logo } from "@/components/ui/Logo";
import { CopyrightYear } from "./CopyrightYear";
import { InstagramIcon, FacebookIcon } from "@/components/ui/SocialIcons";

const cols = {
  "Yavuz Gıda": [
    ["Hakkımızda", "/hakkimizda"],
    ["Kurumsal Satış", "/kurumsal"],
    ["İletişim", "/iletisim"],
    ["Kampanyalar", "/urunler?etiket=indirim"],
  ],
  "Yardım": [
    ["Sipariş Takip", "/siparis-takip"],
    ["Sık Sorulan Sorular", "/sss"],
    ["Teslimat ve Kargo", "/teslimat-ve-kargo"],
    ["İptal ve İade", "/iptal-ve-iade"],
  ],
  "Sözleşmeler": [
    ["Mesafeli Satış Sözleşmesi", "/mesafeli-satis-sozlesmesi"],
    ["KVKK Aydınlatma Metni", "/kvkk"],
    ["Gizlilik ve Çerez Politikası", "/gizlilik-politikasi"],
  ],
};

export async function Footer() {
  const categories = await getCategories();
  return (
    <footer className="mt-16 bg-coal-900 pb-20 text-ink-300 md:pb-0">
      {/* Güven şeridi */}
      <div className="border-b border-white/5 bg-coal-950">
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4">
          {[
            { icon: Truck, t: "Aynı gün kargo", d: "14:00 öncesi siparişlerde" },
            { icon: ShieldCheck, t: "Güvenli ödeme", d: "256-bit SSL · 3D Secure" },
            { icon: RotateCcw, t: "14 gün iade", d: "Açılmamış ürünlerde" },
            { icon: Headset, t: "Destek hattı", d: <ConfigValue path="contact.workingHours" /> },
          ].map(({ icon: I, t, d }) => (
            <div key={t} className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/5 text-gold-400">
                <I className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-white">{t}</p>
                <p className="text-xs text-ink-400">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1320px] gap-8 px-4 py-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.3fr]">
        <div>
          <Logo size="lg" />
          <p className="mt-3 text-sm leading-relaxed text-ink-400">{site.description}</p>
          <div className="mt-4 flex gap-2">
            <ConfigLink kind="instagram" className="grid size-9 place-items-center rounded-full bg-white/5 text-ink-300 hover:bg-white/10 hover:text-gold-400">
              <InstagramIcon className="size-4" />
            </ConfigLink>
            <ConfigLink kind="facebook" className="grid size-9 place-items-center rounded-full bg-white/5 text-ink-300 hover:bg-white/10 hover:text-gold-400">
              <FacebookIcon className="size-4" />
            </ConfigLink>
          </div>
        </div>
        {Object.entries(cols).map(([t, items]) => (
          <div key={t}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-400">{t}</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-300">
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
        <div className="text-sm text-ink-300">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-400">İletişim</p>
          <ul className="mt-3 space-y-2.5">
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-orange-500" />
              <ConfigLink kind="tel" className="font-semibold text-white">
                <ConfigValue path="contact.phone" />
              </ConfigLink>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-orange-500" />
              <ConfigValue path="contact.email" />
            </li>
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-orange-500" />
              <ConfigValue path="contact.address" />
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-orange-500" />
              <ConfigValue path="contact.workingHours" />
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto max-w-[1320px] px-4 py-4">
          <p className="text-xs font-bold text-ink-400">Popüler kategoriler</p>
          <nav className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-400">
            {categories.flatMap((c) => c.subcategories.slice(0, 3).map((s) => (
              <Link key={`${c.slug}-${s.slug}`} href={`/kategori/${c.slug}/${s.slug}`} className="hover:text-white">
                {s.name}
              </Link>
            )))}
          </nav>
        </div>
      </div>

      <div className="border-t border-white/5 bg-coal-950">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-ink-400">
          <p>
            © <CopyrightYear /> <ConfigValue path="legal.companyName" /> · Tüm hakları saklıdır.{" "}
            <Link href="/yonetim" className="ml-1 text-ink-500 hover:text-gold-400">
              Yönetim
            </Link>
          </p>
          <div className="flex items-center gap-1.5">
            {["VISA", "Mastercard", "Troy", "PayTR", "Havale/EFT"].map((p) => (
              <span key={p} className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[0.65rem] font-bold text-ink-300">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
