/**
 * Yönetim panelinden düzenlenen site içeriği: tipler, varsayılanlar ve birleştirme kuralları.
 * Saf modül (sunucu + istemci). Veritabanı erişimi `server/content.ts`, demo deposu `lib/demo-content.ts` içindedir.
 */
import type { Product, Variant, ProductTag, Category } from "./types";
import { categories as baseCategories } from "./categories";
import { textOf } from "./texts";
import { site } from "./site";
import { references as defaultReferences, referenceStats as defaultReferenceStats } from "./references";

/* ------------------------------- Site ayarları ------------------------------ */

export type HeroAccent = "gold" | "orange" | "pink" | "sky";
export type HeroSlideCfg = {
  id: string;
  enabled: boolean;
  /** /hero/<anahtar> yerleşik fotoğrafı veya tam URL */
  image: string;
  tab: string;
  tabSub: string;
  kicker: string;
  /** *yıldızlar* arasındaki bölüm vurgu rengiyle gösterilir */
  title: string;
  text: string;
  chips: string[];
  ctaLabel: string;
  ctaHref: string;
  altLabel?: string;
  altHref?: string;
  accent: HeroAccent;
};

export type TileStyle = "green" | "orange" | "blue" | "white" | "coal";
export type TileIcon = "truck" | "percent" | "boxes" | "building" | "store" | "coffee";
export type TileCfg = { id: string; title: string; text: string; href: string; style: TileStyle; icon: TileIcon };

export type ReferenceCfg = { name: string; city: string; type: string; since?: number; logo?: string };

export type LegalKey = "kvkk" | "mesafeli" | "iade" | "gizlilik" | "teslimat";
export const legalTitles: Record<LegalKey, string> = {
  kvkk: "KVKK Aydınlatma Metni",
  mesafeli: "Mesafeli Satış Sözleşmesi",
  iade: "İptal ve İade Koşulları",
  gizlilik: "Gizlilik ve Çerez Politikası",
  teslimat: "Teslimat ve Kargo",
};

export type SiteConfig = {
  announcement: { enabled: boolean; text: string; href: string };
  contact: { phone: string; whatsapp: string; email: string; address: string; workingHours: string };
  social: { instagram: string; facebook: string };
  commerce: { freeShippingThreshold: number; shippingFee: number; deliveryEstimate: string; cutoffHour: number; cardPayments: boolean };
  bank: { holder: string; bankName: string; iban: string };
  legal: { companyName: string; mersis: string; texts: Record<LegalKey, string> };
  hero: HeroSlideCfg[];
  tiles: TileCfg[];
  references: ReferenceCfg[];
  referenceStats: { value: string; label: string }[];
  blend: { minKg: number; leadTime: string; note: string };
  /** Kategori başına ek ayar: gizle / ad / açıklama (eski biçim; categoryTree varsa onun üstüne uygulanır) */
  categories: Record<string, { hidden?: boolean; name?: string; description?: string }>;
  /** Yönetimden düzenlenen tam kategori ağacı; yoksa koddaki varsayılan liste kullanılır */
  categoryTree?: Category[];
  /** Serbest metinler (bkz. lib/texts.ts) */
  texts: Record<string, string>;
  /** Sık sorulan sorular */
  faq: { q: string; a: string }[];
  /** Sepet tutarına göre indirim kademeleri (₺) */
  discountTiers: { min: number; amount: number }[];
};

export type FaqItem = { q: string; a: string };
export type DiscountTierCfg = { min: number; amount: number };

export const defaultFaq: FaqItem[] = [
  { q: "Minimum sipariş tutarı var mı?", a: "Bireysel siparişlerde minimum tutar yoktur. Kurumsal fiyat listesi aylık alım hacmine göre düzenlenir." },
  { q: "Kargo ücreti ne kadar?", a: "2.500 ₺ ve üzeri siparişlerde kargo ücretsizdir; altında 149 ₺ kargo ücreti uygulanır." },
  { q: "Siparişim ne zaman kargoya verilir?", a: "Hafta içi 14:00'a kadar verilen siparişler aynı gün kargoya teslim edilir; teslimat 1–3 iş günüdür." },
  { q: "Koli alımında fiyat düşer mi?", a: "Evet. Her ürünün ambalaj boylarında birim fiyat büyüdükçe düşer; ayrıca sepet tutarına göre kademeli indirim uygulanır." },
  { q: "Numune alabilir miyim?", a: "Kurumsal müşterilerimize şurup, kahve ve toz içeceklerde ücretsiz numune gönderiyoruz; teklif formundan talep edebilirsiniz." },
  { q: "Kurumsal fatura kesiyor musunuz?", a: "Evet, e-fatura mükellefiyiz. Ödeme adımında kurumsal fatura bilgilerinizi girebilirsiniz." },
  { q: "İade koşulları nedir?", a: "Açılmamış ve ambalajı bozulmamış ürünler 14 gün içinde iade edilebilir." },
];

const baseDiscount: DiscountTierCfg[] = [
  { min: 2000, amount: 50 },
  { min: 2400, amount: 70 },
  { min: 2900, amount: 140 },
  { min: 3500, amount: 200 },
  { min: 4100, amount: 246 },
  { min: 4700, amount: 329 },
  { min: 5300, amount: 424 },
  { min: 5900, amount: 531 },
  { min: 6500, amount: 650 },
];
for (let min = 7100, amount = 710; min <= 20000; min += 600, amount += 60) baseDiscount.push({ min, amount });
export const defaultDiscountTiers: DiscountTierCfg[] = baseDiscount;

export const defaultHero: HeroSlideCfg[] = [
  { id: "kahve", enabled: true, image: "kahve", tab: "Kahve", tabSub: "Taze kavrum çekirdekler", kicker: "Kahve · siparişe özel kavrum", title: "Kavurma tazeliğinde *espresso* çekirdekleri", text: "Tek orijinler ve imza harmanlar siparişinizle kavrulur, 48 saat içinde kapınızda. Koli alımında birim fiyat düşer.", chips: ["66 çeşit kahve", "48 saatte teslim", "Kolide %6–14 avantaj"], ctaLabel: "Kahveleri Keşfet", ctaHref: "/kategori/kahve", altLabel: "Çok satanlar", altHref: "/urunler?etiket=cok-satan", accent: "gold" },
  { id: "firsat", enabled: true, image: "firsat", tab: "Haftanın Fırsatları", tabSub: "%25'e varan indirim", kicker: "Haftanın fırsatları", title: "Şurup, sos ve sıcak çikolatada *%25'e varan* indirim", text: "Kış barı için stok yenileme zamanı: karamel, fındık, beyaz çikolata ve chai şurupları fırsat fiyatıyla. Stoklarla sınırlıdır.", chips: ["Sepette ek %4 (5.000 ₺ üzeri)", "2.500 ₺ üzeri kargo bedava", "14:00'a kadar aynı gün kargo"], ctaLabel: "Fırsatları Gör", ctaHref: "/urunler?etiket=indirim", altLabel: "Tüm şuruplar", altHref: "/kategori/surup-sos", accent: "orange" },
  { id: "pasta", enabled: true, image: "pasta", tab: "Pasta & Tatlı", tabSub: "180'den fazla çeşit", kicker: "Pasta & Tatlı · 180+ çeşit", title: "Vitrininizi dolduran *pastalar*, dilim dilim", text: "Bütün pasta, dilim ve tepsi tatlılar soğuk zincirle gelir; çözündür, servis et. Kafe vitrini için tasarlanmış porsiyonlar.", chips: ["Soğuk zincir sevkiyat", "12'li kolide avantaj", "Katkısız seçenekler"], ctaLabel: "Pastaları İncele", ctaHref: "/kategori/pasta-tatli", altLabel: "Dilim pastalar", altHref: "/kategori/pasta-tatli/dilim-pastalar", accent: "pink" },
  { id: "harman", enabled: true, image: "harman", tab: "Özel Harman", tabSub: "Kendi markanızla espresso", kicker: "Private label · Özel harman", title: "Kendi markanızla *espresso harmanı* oluşturun", text: "Orijin oranlarını belirleyin, kavurma derecesini seçin, markanızın adını yazın. Yavuz Gıda kavursun, etiketlesin, göndersin.", chips: ["11 orijin, 3 kavurma derecesi", "Markanızın adıyla etiket", "Minimum 10 kg"], ctaLabel: "Harmanınızı Oluşturun", ctaHref: "/ozel-harman", altLabel: "Nasıl çalışır?", altHref: "/ozel-harman#nasil", accent: "gold" },
  { id: "panel", enabled: true, image: "panel", tab: "Anlaşmalı Müşteri", tabSub: "Fiyatsız sipariş paneli", kicker: "Anlaşmalı müşteriler için", title: "Listele, onayla; siparişiniz *WhatsApp'a* düşsün", text: "Çalıştığımız kafeler için üyeliksiz sipariş paneli: ürünleri listeye ekleyin, firma adınızla onaylayın; numaralı PDF fiş saniyeler içinde bize ulaşsın.", chips: ["Tek tıkla WhatsApp", "Numaralı PDF fiş", "Üyelik ve şifre yok"], ctaLabel: "Panele Gir", ctaHref: "/panel", altLabel: "Kurumsal satış", altHref: "/kurumsal", accent: "sky" },
];

export const defaultTiles: TileCfg[] = [
  { id: "kargo", title: "2.500 ₺ üzeri kargo bedava", text: "Türkiye geneli 81 il", href: "/teslimat-ve-kargo", style: "green", icon: "truck" },
  { id: "indirim", title: "Sepette ek indirim", text: "5.000 ₺ üzeri alışverişte %4", href: "/urunler", style: "orange", icon: "percent" },
  { id: "koli", title: "Koli fiyatı avantajı", text: "6'lı ve 12'li kolide birim fiyat düşer", href: "/urunler", style: "blue", icon: "boxes" },
  { id: "vade", title: "Kurumsal vade", text: "Onaylı hesaplara 30 gün", href: "/kurumsal", style: "white", icon: "building" },
];

const placeholderLegal = (title: string) => `Bu sayfa yer tutucudur. ${site.legal.companyName} için hazırlanacak “${title}” metni hukuk danışmanı onayından sonra yönetim panelinden (Ayarlar → Yasal metinler) eklenecektir.`;

export const defaultConfig: SiteConfig = {
  announcement: { enabled: true, text: "2.500 ₺ üzeri kargo bedava · 14:00'a kadar verilen siparişler aynı gün kargoda", href: "/teslimat-ve-kargo" },
  contact: { phone: site.contact.phone, whatsapp: site.contact.whatsapp, email: site.contact.email, address: site.contact.address, workingHours: site.contact.workingHours },
  social: { instagram: site.social.instagram, facebook: site.social.facebook },
  commerce: { freeShippingThreshold: site.commerce.freeShippingThreshold, shippingFee: site.commerce.shippingFee, deliveryEstimate: site.commerce.deliveryEstimate, cutoffHour: 14, cardPayments: site.commerce.cardPaymentsEnabled },
  bank: { holder: site.bank.holder, bankName: site.bank.bankName, iban: site.bank.iban },
  legal: {
    companyName: site.legal.companyName,
    mersis: site.legal.mersis,
    texts: { kvkk: placeholderLegal(legalTitles.kvkk), mesafeli: placeholderLegal(legalTitles.mesafeli), iade: placeholderLegal(legalTitles.iade), gizlilik: placeholderLegal(legalTitles.gizlilik), teslimat: placeholderLegal(legalTitles.teslimat) },
  },
  hero: defaultHero,
  tiles: defaultTiles,
  references: defaultReferences,
  referenceStats: defaultReferenceStats,
  blend: { minKg: 10, leadTime: "7–10 iş günü", note: "Orijin fiyatları ve işçilik; kesin fiyat teklifle netleşir." },
  categories: {},
  texts: {},
  faq: defaultFaq,
  discountTiers: defaultDiscountTiers,
};

/** Kayıtlı (kısmi) yapılandırmayı varsayılanların üstüne bindirir; eksik alanlar varsayılandan tamamlanır. */
export function mergeConfig(saved: unknown): SiteConfig {
  const s = (saved && typeof saved === "object" ? saved : {}) as Partial<Record<keyof SiteConfig, unknown>>;
  const obj = <T extends object>(d: T, v: unknown): T => (v && typeof v === "object" && !Array.isArray(v) ? { ...d, ...(v as Partial<T>) } : d);
  const arr = <T,>(d: T[], v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : d);
  const legal = obj(defaultConfig.legal, s.legal);
  return {
    announcement: obj(defaultConfig.announcement, s.announcement),
    contact: obj(defaultConfig.contact, s.contact),
    social: obj(defaultConfig.social, s.social),
    commerce: obj(defaultConfig.commerce, s.commerce),
    bank: obj(defaultConfig.bank, s.bank),
    legal: { ...legal, texts: obj(defaultConfig.legal.texts, (s.legal as { texts?: unknown } | undefined)?.texts) },
    hero: arr(defaultConfig.hero, s.hero),
    tiles: arr(defaultConfig.tiles, s.tiles),
    references: arr(defaultConfig.references, s.references),
    referenceStats: arr(defaultConfig.referenceStats, s.referenceStats),
    blend: obj(defaultConfig.blend, s.blend),
    categories: obj(defaultConfig.categories, s.categories),
    categoryTree: Array.isArray(s.categoryTree) ? (s.categoryTree as Category[]) : undefined,
    texts: obj(defaultConfig.texts, s.texts),
    faq: arr(defaultConfig.faq, s.faq),
    discountTiers: arr(defaultConfig.discountTiers, s.discountTiers),
  };
}

/** `*vurgu*` işaretli başlığı parçalara ayırır. */
export function splitHighlight(title: string): { text: string; accent: boolean }[] {
  return title
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part) => (part.startsWith("*") && part.endsWith("*") ? { text: part.slice(1, -1), accent: true } : { text: part, accent: false }));
}

export const whatsappHrefFor = (number: string, text?: string) => `https://wa.me/${number.replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
export const telHrefFor = (phone: string) => `tel:+9${phone.replace(/\D/g, "")}`;

/* -------------------------------- Ürün yamaları ------------------------------ */

export type VariantPatch = Partial<Variant> & { id: string; remove?: boolean };
export type ProductPatch = {
  name?: string;
  brand?: string;
  short?: string;
  description?: string;
  category?: string;
  subcategory?: string;
  tags?: ProductTag[];
  image?: string;
  specs?: { label: string; value: string }[];
  hidden?: boolean;
  variants?: VariantPatch[];
  /** Vitrinde öne çıkarma sırası (küçük önce) */
  featured?: number;
};

/** Yönetimde oluşturulan ürünler bu ön ekle saklanır; katalog JSON'una karışmaz. */
export const CUSTOM_PREFIX = "u-";

export type ContentState = {
  config: SiteConfig;
  patches: Record<string, ProductPatch>;
  customs: Product[];
  version: number;
};

export function applyPatch(p: Product, patch: ProductPatch | undefined): Product | null {
  if (!patch) return p;
  if (patch.hidden) return null;
  let variants = p.variants;
  if (patch.variants?.length) {
    const map = new Map(variants.map((v) => [v.id, v]));
    for (const vp of patch.variants) {
      if (vp.remove) {
        map.delete(vp.id);
        continue;
      }
      const cur = map.get(vp.id);
      if (cur) map.set(vp.id, { ...cur, ...stripUndefined(vp) });
      else if (vp.label && typeof vp.price === "number") map.set(vp.id, { id: vp.id, label: vp.label, sku: vp.sku ?? `YVZ-${p.slug.toUpperCase().slice(0, 9)}-${vp.id}`, price: vp.price, oldPrice: vp.oldPrice, amount: vp.amount ?? 1, amountUnit: vp.amountUnit ?? "adet", inStock: vp.inStock ?? true, caseQty: vp.caseQty });
    }
    variants = [...map.values()];
    if (!variants.length) variants = p.variants;
  }
  const { variants: _v, hidden: _h, featured: _f, ...rest } = patch;
  void _v;
  void _h;
  void _f;
  return { ...p, ...stripUndefined(rest), variants } as Product;
}

function stripUndefined<T extends object>(o: T): T {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as T;
}

/** Temel katalog + yamalar + yönetimde eklenen ürünler → yayınlanan ürün listesi. */
export function mergeCatalog(base: Product[], patches: Record<string, ProductPatch>, customs: Product[]): Product[] {
  const out: Product[] = [];
  for (const p of base) {
    const r = applyPatch(p, patches[p.slug]);
    if (r) out.push(r);
  }
  for (const c of customs) {
    const r = applyPatch(c, patches[c.slug]);
    if (r) out.push(r);
  }
  return out;
}

/** Metin anahtarı (bkz. lib/texts.ts) */
export const t = (config: SiteConfig, key: string) => textOf(config.texts, key);

/** Yayınlanan kategori ağacı: yönetimden düzenlenen ağaç (yoksa varsayılan) + eski ayarlar; gizliler düşer, sıraya dizilir. */
export function effectiveCategories(config: SiteConfig, base: Category[] = baseCategories): Category[] {
  const tree = config.categoryTree?.length ? config.categoryTree : base;
  return applyCategoryOverrides(tree, config.categories)
    .filter((c) => !c.hidden)
    .slice()
    .sort((a, b) => a.order - b.order);
}

/** Yönetim için tüm kategoriler (gizliler dâhil), sıralı. */
export function allCategories(config: SiteConfig, base: Category[] = baseCategories): Category[] {
  const tree = config.categoryTree?.length ? config.categoryTree : base;
  return applyCategoryOverrides(tree, config.categories, true)
    .slice()
    .sort((a, b) => a.order - b.order);
}

/** Açık renkli arka plan: ana rengin çok açık tonu. */
export function softColor(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "#f3f4f6";
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const mix = (c: number) => Math.round(c + (255 - c) * 0.86);
  return `#${[mix(r), mix(g), mix(b)].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

/** Kategori ad/açıklama/gizleme ayarlarını uygular; gizli kategoriler listeden düşer. */
export function applyCategoryOverrides<T extends { slug: string; name: string; description: string }>(cats: T[], overrides: SiteConfig["categories"], keepHidden = false): T[] {
  return cats
    .filter((c) => keepHidden || !overrides[c.slug]?.hidden)
    .map((c) => {
      const o = overrides[c.slug];
      if (!o) return c;
      return { ...c, name: o.name?.trim() ? o.name.trim() : c.name, description: o.description?.trim() ? o.description.trim() : c.description };
    });
}

export function slugify(s: string): string {
  const map: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u" };
  return s
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (ch) => map[ch] ?? ch)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
