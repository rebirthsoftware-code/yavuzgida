import { MessageCircle } from "lucide-react";
import { site } from "@/lib/site";

/** Masaüstünde sol altta sabit; mobilde alt sekme çubuğu olduğu için gizli. */
export function WhatsAppButton() {
  return (
    <a
      href={site.contact.whatsappHref}
      target="_blank"
      rel="noopener"
      aria-label="WhatsApp ile yazın"
      className="fixed bottom-5 left-[calc(248px+1.25rem)] z-[35] hidden size-12 place-items-center rounded-full bg-[#25d366] text-white shadow-float transition hover:scale-105 lg:grid xl:left-[calc(232px+1.25rem)] 2xl:left-[calc(256px+1.25rem)] 3xl:left-[calc(280px+1.25rem)]"
    >
      <MessageCircle className="size-6" />
    </a>
  );
}
