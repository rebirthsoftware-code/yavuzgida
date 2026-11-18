const pick = (v: string | undefined, fallback: string) => (v && v.trim() ? v.trim() : fallback);

const phone = pick(process.env.NEXT_PUBLIC_PHONE, "0500 000 00 00");
const whatsappNumbers = pick(process.env.NEXT_PUBLIC_WHATSAPP, "905000000000").split(",").map((n) => n.replace(/\D/g, "")).filter(Boolean);
const whatsapp = whatsappNumbers[0] ?? "";

/** Site genel ayarları — gerçek bilgiler geldiğinde .env ile ezilir. */
export const site = {
  name: "Yavuz Gıda",
  tagline: "Kafenizin tedarik ortağı",
  description:
    "Yavuz Gıda: espresso çekirdek, aroma şurubu, çay, sıcak çikolata, barista sütleri, karton bardak ve barista ekipmanları dâhil 600'den fazla kafe ürünü. Kafe, restoran ve oteller için toptan fiyat, aynı gün kargo.",
  url: pick(process.env.NEXT_PUBLIC_SITE_URL, "https://yavuzgida.com").replace(/\/$/, ""),
  locale: "tr_TR",
  contact: {
    phone,
    phoneHref: `tel:+9${phone.replace(/\D/g, "").replace(/^0/, "0")}`,
    whatsapp,
    whatsappNumbers,
    whatsappHref: `https://wa.me/${whatsapp}?text=${encodeURIComponent("Merhaba Yavuz Gıda, kafe ürünleriniz ve toptan fiyatlar hakkında bilgi almak istiyorum.")}`,
    email: pick(process.env.NEXT_PUBLIC_EMAIL, "info@yavuzgida.com"),
    address: pick(process.env.NEXT_PUBLIC_ADDRESS, "Adres bilgisi eklenecek"),
    workingHours: "Hafta içi 08:30 – 18:30 · Cumartesi 09:00 – 14:00",
  },
  social: {
    instagram: "https://instagram.com/yavuzgida",
    facebook: "https://facebook.com/yavuzgida",
  },
  commerce: {
    freeShippingThreshold: 2500,
    shippingFee: 149,
    codFee: 0,
    currency: "TRY",
    deliveryEstimate: "1–3 iş günü",
    /** Kart ödemesi arayüzde gösterilsin mi (NEXT_PUBLIC_CARD_PAYMENTS=0 ile kapatılır) */
    cardPaymentsEnabled: process.env.NEXT_PUBLIC_CARD_PAYMENTS !== "0",
  },
  /** Sipariş API'si aynı uygulamadadır (Vercel). Statik demo (GitHub Pages) üzerinde çalışmaz. */
  api: { url: pick(process.env.NEXT_PUBLIC_API_URL, "/api") },
  forms: {
    endpoint: pick(process.env.NEXT_PUBLIC_FORM_ENDPOINT, ""),
    accessKey: pick(process.env.NEXT_PUBLIC_FORM_ACCESS_KEY, ""),
  },
  bank: {
    holder: pick(process.env.NEXT_PUBLIC_BANK_HOLDER, "Yavuz Gıda Sanayi ve Ticaret Ltd. Şti."),
    bankName: pick(process.env.NEXT_PUBLIC_BANK_NAME, "Banka Adı"),
    iban: pick(process.env.NEXT_PUBLIC_IBAN, "TR00 0000 0000 0000 0000 0000 00"),
  },
  legal: {
    companyName: pick(process.env.NEXT_PUBLIC_COMPANY_NAME, "Yavuz Gıda Sanayi ve Ticaret Ltd. Şti."),
    mersis: pick(process.env.NEXT_PUBLIC_MERSIS, "0000000000000000"),
  },
} as const;
