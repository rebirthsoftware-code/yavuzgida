import type { Product, Variant } from "./types";

export type CartItem = {
  slug: string;
  variantId: string;
  name: string;
  brand: string;
  variantLabel: string;
  sku: string;
  price: number;
  qty: number;
  hue: number;
  image?: string;
  category: string;
};

export const CART_KEY = "yavuz-cart-v1";

export function toCartItem(p: Product, v: Variant, qty = 1): CartItem {
  return {
    slug: p.slug,
    variantId: v.id,
    name: p.name,
    brand: p.brand,
    variantLabel: v.label,
    sku: v.sku,
    price: v.price,
    qty,
    hue: p.hue,
    image: p.image,
    category: p.category,
  };
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.price * i.qty, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((s, i) => s + i.qty, 0);
}
