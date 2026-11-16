const tl = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 2 });

export function formatPrice(n: number): string {
  return tl.format(n).replace("₺", "").trim() + " ₺";
}

export function formatCompact(n: number): string {
  return n.toLocaleString("tr-TR", { maximumFractionDigits: 0 }) + " ₺";
}

/** Birim fiyat: "₺95,00 / kg" gibi */
export function unitPrice(price: number, amount: number, unit: "g" | "ml" | "adet"): string {
  if (unit === "adet") return `${formatPrice(price / amount)} / adet`;
  const per = (price / amount) * 1000;
  return `${formatPrice(per)} / ${unit === "g" ? "kg" : "L"}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}
