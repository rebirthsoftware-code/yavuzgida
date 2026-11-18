const pick = (v: string | undefined, fallback: string) => (v && v.trim() ? v.trim() : fallback);

const phone = pick(process.env.NEXT_PUBLIC_PHONE, "0500 000 00 00");
const whatsapp = pick(process.env.NEXT_PUBLIC_WHATSAPP, "905000000000").replace(/\D/g, "");

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
    currency: "TRY",
  },
  legal: {
    companyName: "Yavuz Gıda Sanayi ve Ticaret Ltd. Şti.",
  },
} as const;
