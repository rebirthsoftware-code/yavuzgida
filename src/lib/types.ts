/** Katalog veri modeli — 600+ ürün için alt kategori, marka ve çoklu varyant destekler. */

export type ProductTag = "cok-satan" | "yeni" | "indirim" | "yerli" | "organik" | "glutensiz" | "vegan";

export type UnitKind = "adet" | "kg" | "lt" | "koli" | "paket" | "cuval";

export type Variant = {
  id: string;
  /** Örn. "1 kg", "5 kg çuval", "12'li koli" */
  label: string;
  sku: string;
  price: number;
  /** İndirimli ürünlerde eski fiyat */
  oldPrice?: number;
  /** Birim fiyat hesaplaması için: miktar ve birim (örn. 1000 g) */
  amount: number;
  amountUnit: "g" | "ml" | "adet";
  inStock: boolean;
  /** Koli içi adet (B2B / toptan alım bilgisi) */
  caseQty?: number;
};

export type PackArt = "sack" | "pouch" | "bottle" | "jar" | "can" | "box" | "carton" | "cake" | "slice";

export type Product = {
  slug: string;
  name: string;
  brand: string;
  /** Ambalaj görseli tipi (fotoğraf yoksa üretilen görsel) */
  art: PackArt;
  rating: number;
  reviews: number;
  sold: number;
  category: string;
  subcategory: string;
  short: string;
  description: string;
  tags: ProductTag[];
  variants: Variant[];
  /** Ürün fotoğrafı (opsiyonel; yoksa görsel yer tutucu üretilir) */
  image?: string;
  specs: { label: string; value: string }[];
  /** Görsel yer tutucu için renk tonu */
  hue: number;
  /** Popülerlik puanı (sıralama için) */
  popularity: number;
  createdAt: string;
};

/** Listeleme ve aramada istemciye gönderilen hafif kayıt (açıklama/özellik yok, varyantlar var) */
export type ProductIndex = {
  slug: string;
  name: string;
  brand: string;
  art: PackArt;
  rating: number;
  reviews: number;
  sold: number;
  category: string;
  subcategory: string;
  tags: ProductTag[];
  variants: Variant[];
  hue: number;
  popularity: number;
  createdAt: string;
  image?: string;
};

export type Subcategory = {
  slug: string;
  name: string;
};

export type Category = {
  slug: string;
  name: string;
  short: string;
  description: string;
  icon: string;
  color: string;
  colorSoft: string;
  order: number;
  subcategories: Subcategory[];
};

export type Brand = { slug: string; name: string };
