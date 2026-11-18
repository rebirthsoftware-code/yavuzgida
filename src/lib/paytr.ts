import { site } from "./site";

/** Kart ödemesi: sipariş API'si ve arayüz ayarı birlikte açık olmalı. */
export function paytrEnabled(): boolean {
  return Boolean(site.api.url) && site.commerce.cardPaymentsEnabled;
}

export function paytrIframeUrl(token: string): string {
  return `https://www.paytr.com/odeme/guvenli/${token}`;
}
