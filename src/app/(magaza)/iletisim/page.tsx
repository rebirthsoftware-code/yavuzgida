import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { PageShell, Field, inputCls } from "@/components/ui/PageShell";
import { Button } from "@/components/ui/Button";
import { getSiteConfig } from "@/lib/site-config";
import { telHrefFor, whatsappHrefFor, t } from "@/lib/content";

export const metadata: Metadata = { title: "İletişim" };

export default async function Page() {
  const config = await getSiteConfig();
  const { contact } = config;
  return (
    <PageShell title="İletişim" crumb="İletişim" lead={t(config, "contact.lead")}>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {[
            { icon: Phone, t: "Telefon", v: contact.phone, href: telHrefFor(contact.phone) },
            { icon: MessageCircle, t: "WhatsApp", v: "Hızlı sipariş hattı", href: whatsappHrefFor(contact.whatsapp) },
            { icon: Mail, t: "E-posta", v: contact.email, href: `mailto:${contact.email}` },
            { icon: MapPin, t: "Adres", v: contact.address },
            { icon: Clock, t: "Çalışma saatleri", v: contact.workingHours },
          ].map(({ icon: I, t, v, href }) => (
            <div key={t} className="flex items-center gap-4 rounded-lg border border-ink-200 bg-white p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-600">
                <I className="size-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-ink-400">{t}</p>
                {href ? (
                  <a href={href} className="font-semibold hover:text-sky-700">
                    {v}
                  </a>
                ) : (
                  <p className="font-semibold">{v}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <form className="rounded-lg border border-ink-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold">Mesaj gönderin</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Ad Soyad"><input className={inputCls} /></Field>
            <Field label="Telefon"><input className={inputCls} inputMode="tel" /></Field>
            <div className="sm:col-span-2">
              <Field label="Mesaj"><textarea className={`${inputCls} h-32 py-2.5`} /></Field>
            </div>
          </div>
          <Button type="button" size="lg" className="mt-5 w-full">
            Gönder
          </Button>
        </form>
      </div>
    </PageShell>
  );
}
