import { MessageCircle } from "lucide-react";
import { site } from "@/lib/site";

export function WhatsAppButton() {
  return (
    <a
      href={site.contact.whatsappHref}
      target="_blank"
      rel="noopener"
      aria-label="WhatsApp ile yazın"
      className="group fixed bottom-5 right-5 z-[60] flex h-13 items-center gap-2 rounded-full bg-[#25d366] pl-3.5 pr-4 text-sm font-semibold text-white shadow-pop transition hover:scale-[1.03]"
    >
      <MessageCircle className="size-6" />
      <span className="hidden sm:inline">Hızlı sipariş</span>
    </a>
  );
}
