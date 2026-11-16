# Yavuz Gıda — E-Ticaret Sitesi (ön tasarım)

Bakliyat, baharat, kuruyemiş, yağ, konserve, kahvaltılık, içecek ve daha fazlasını satan **Yavuz Gıda** için
Next.js 16 ile geliştirilen, Türkçe, mobil uyumlu, 600+ ürünlük e-ticaret sitesi.
Altyapı [umbagida.com](https://umbagida.com) projesiyle aynıdır (Next.js 16, Tailwind v4, Vercel); tasarım sıfırdan ve tamamen farklıdır.

## Durum

Bu sürüm **ön tasarımdır**: tüm sayfalar ve akışlar görsel olarak hazırdır, ürünler yer tutucudur.

| Hazır | Sonraki aşama |
|---|---|
| Ana sayfa, kategori / alt kategori, ürün listeleme (filtre, sıralama, sayfalama), ürün sayfası, sepet (çekmece + sayfa), arama (Ctrl K), mega menü, mobil menü | Gerçek ürün listesi içe aktarma (Excel/CSV → `src/data/catalog.json`) |
| Kurumsal, Hakkımızda, İletişim, SSS, Sipariş takip, yasal sayfa iskeletleri, sitemap, robots | Ürün fotoğrafları (jsDelivr CDN, umba ile aynı yöntem) |
| Ödeme sayfası arayüzü (form) | Sipariş kaydı + PayTR + Turso + yönetim paneli (umba'dan taşınacak) |

## Tasarım sistemi

- **Renkler:** koyu yeşil (`green-900` başlık/altbilgi), mandalina turuncusu (`tangerine-500` aksiyon), kağıt beyazı zemin (`paper-50`). Tanımlar `src/app/globals.css` içindeki `@theme` bloğunda.
- **Yazı tipleri:** Outfit (başlık) + DM Sans (metin), `next/font/google`.
- **Yapı:** üç katmanlı başlık (bilgi şeridi · logo + büyük arama + sepet · kategori çubuğu + mega menü), sol kenar çubuklu listeleme, kompakt kartlar (+ hızlı ekleme ve adet sayacı), ambalaj boyu seçimli ürün sayfası.

## Katalog veri modeli

`src/lib/types.ts` → `Product` (marka, kategori, alt kategori, etiketler, çoklu **varyant**: etiket, SKU, fiyat, eski fiyat, miktar/birim, koli adedi, stok).

- Kategoriler ve alt kategoriler: `src/lib/categories.ts` (12 ana, 55 alt kategori)
- Ürünler: `src/data/catalog.json` (tam) ve `src/data/catalog-index.json` (listeleme/arama için hafif kopya, ~19 KB gzip)
- Örnek katalog üretici: `node scripts/generate-catalog.mjs` (640 yer tutucu ürün, deterministik)

Gerçek liste geldiğinde aynı JSON biçimini üreten bir içe aktarma scripti yazılacak; bileşenler değişmeyecek.

## Yerel çalıştırma

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint && npx tsc --noEmit
```

## Dizin yapısı

```
src/
  app/            sayfalar (urunler, kategori/[slug]/[sub], urun/[slug], sepet, odeme, kurumsal …)
  components/     layout, home, catalog, product, cart, search, ui
  lib/            site ayarları, katalog erişimi, arama, sepet deposu, biçimlendirme
  data/           katalog JSON dosyaları
scripts/          katalog üretici
```
