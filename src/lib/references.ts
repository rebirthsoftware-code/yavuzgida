/**
 * Referanslar: Yavuz Gıda ile çalışan işletmeler (yer tutucu).
 * Gerçek liste ve logolar geldiğinde `logo` alanına /brand/refs/<dosya> eklenir; logo yoksa monogram gösterilir.
 */
export type Reference = { name: string; city: string; type: string; since?: number; logo?: string };

export const references: Reference[] = [
  { name: "Nova Coffee", city: "İstanbul", type: "Zincir kafe · 6 şube", since: 2019 },
  { name: "Kadıköy Roasters", city: "İstanbul", type: "Specialty kafe", since: 2020 },
  { name: "Moda Pastanesi", city: "İstanbul", type: "Pastane", since: 2018 },
  { name: "Bosphorus Hotel", city: "İstanbul", type: "Otel · 180 oda", since: 2021 },
  { name: "Kordon Kahve", city: "İzmir", type: "Kafe", since: 2020 },
  { name: "Alsancak Bistro", city: "İzmir", type: "Restoran & kafe", since: 2022 },
  { name: "Tunalı Coffee Lab", city: "Ankara", type: "Specialty kafe", since: 2021 },
  { name: "Çankaya Patisserie", city: "Ankara", type: "Pastane", since: 2019 },
  { name: "Kaleiçi Roastery", city: "Antalya", type: "Kavurmacı kafe", since: 2022 },
  { name: "Nilüfer Kahve Evi", city: "Bursa", type: "Kafe · 3 şube", since: 2020 },
  { name: "Campus Kafeterya", city: "Eskişehir", type: "Üniversite kafeteryası", since: 2023 },
  { name: "Liman Cafe", city: "Trabzon", type: "Kafe", since: 2021 },
];

export const referenceStats = [
  { value: "150+", label: "aktif işletme" },
  { value: "38", label: "il" },
  { value: "7 yıl", label: "sektör tecrübesi" },
  { value: "%96", label: "yeniden sipariş oranı" },
];
