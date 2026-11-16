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

export type Product = {
  slug: string;
  name: string;
  brand: string;
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

/** Listeleme ve aramada istemciye gönderilen hafif kayıt */
export type ProductIndex = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  tags: ProductTag[];
  price: number;
  oldPrice?: number;
  unit: string;
  variantId: string;
  sku: string;
  variants: number;
  inStock: boolean;
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
