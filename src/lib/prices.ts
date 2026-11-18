import { site } from "./site";

/** Kargo ücreti ve ücretsiz kargo eşiği (yönetim panelinden düzenleme sonraki aşamada). */
export function getCommerceSettings() {
  return { shippingFee: site.commerce.shippingFee, freeShippingThreshold: site.commerce.freeShippingThreshold };
}
