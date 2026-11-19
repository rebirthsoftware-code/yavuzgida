import { MessageCircle } from "lucide-react";
import { site } from "@/lib/site";

export function WhatsAppButton() {
  return (
    <a
      href={site.contact.whatsappHref}
      target="_blank"
      rel="noopener"
      aria-label="WhatsApp ile yazın"
      className="wa-fab fixed bottom-20 right-4 z-[35] flex h-12 items-center gap-2 rounded-full bg-[#25d366] pl-3 pr-4 text-sm font-bold text-white shadow-menu transition hover:scale-105 md:bottom-6 md:right-6"
    >
      <MessageCircle className="size-6" />
      <span className="hidden sm:inline">WhatsApp Sipariş</span>
    </a>
  );
}
