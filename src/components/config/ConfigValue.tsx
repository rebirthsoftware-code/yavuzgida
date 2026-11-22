"use client";

import type { ReactNode } from "react";
import { useSiteConfig } from "./ConfigProvider";
import type { SiteConfig } from "@/lib/content";
import { telHrefFor, whatsappHrefFor, t } from "@/lib/content";

type Path = "contact.phone" | "contact.email" | "contact.address" | "contact.workingHours" | "legal.companyName" | "social.instagram" | "social.facebook" | "announcement.text";

function read(c: SiteConfig, path: Path): string {
  const [a, b] = path.split(".") as [keyof SiteConfig, string];
  const v = (c[a] as unknown as Record<string, unknown>)[b];
  return typeof v === "string" ? v : "";
}

/** Sunucu bileşenlerinde ayar metni göstermek için (demoda tarayıcıdaki düzenlemeyi de yansıtır). */
export function ConfigValue({ path }: { path: Path }) {
  return <>{read(useSiteConfig(), path)}</>;
}

/** Serbest metin (lib/texts.ts anahtarları) */
export function TextValue({ k }: { k: string }) {
  return <>{t(useSiteConfig(), k)}</>;
}

export function ConfigLink({ kind, className, children }: { kind: "tel" | "mail" | "whatsapp" | "instagram" | "facebook" | "announcement"; className?: string; children?: ReactNode }) {
  const c = useSiteConfig();
  const href =
    kind === "tel" ? telHrefFor(c.contact.phone) : kind === "mail" ? `mailto:${c.contact.email}` : kind === "whatsapp" ? whatsappHrefFor(c.contact.whatsapp, "Merhaba Yavuz Gıda, kafe ürünleriniz ve toptan fiyatlar hakkında bilgi almak istiyorum.") : kind === "instagram" ? c.social.instagram : kind === "facebook" ? c.social.facebook : c.announcement.href || "/";
  if (kind === "announcement" && !c.announcement.enabled) return null;
  const external = kind === "whatsapp" || kind === "instagram" || kind === "facebook";
  return (
    <a href={href} className={className} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
      {children ?? (kind === "tel" ? c.contact.phone : kind === "mail" ? c.contact.email : kind === "announcement" ? c.announcement.text : null)}
    </a>
  );
}
