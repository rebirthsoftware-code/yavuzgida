# Yavuz Gıda — E-Ticaret Sitesi (ön tasarım)

Bakliyat, baharat, kuruyemiş, yağ, konserve, kahvaltılık, içecek ve daha fazlasını satan **Yavuz Gıda** için
Next.js 16 ile geliştirilen, Türkçe, mobil uyumlu, 600+ ürünlük e-ticaret sitesi.
Altyapı [umbagida.com](https://umbagida.com) projesiyle aynıdır (Next.js 16, Tailwind v4, Vercel); tasarım sıfırdan ve tamamen farklıdır.

## Durum

Bu sürüm **ön tasarımdır**: tüm sayfalar ve akışlar görsel olarak hazırdır, ürünler yer tutucudur.

| Hazır | Sonraki aşama |
|---|---|
| Ana sayfa (katalog dizini), kategori / alt kategori, fiyat listesi görünümü (filtre, sıralama, sayfalama), ürün sayfası (fiyat tablosu), sipariş listesi paneli + sayfası, arama (Ctrl K), sol ray, mobil sekme çubuğu | Gerçek ürün listesi içe aktarma (Excel/CSV → `src/data/catalog.json`) |
| Kurumsal, Hakkımızda, İletişim, SSS, Sipariş takip, yasal sayfa iskeletleri, sitemap, robots | Ürün fotoğrafları (jsDelivr CDN, umba ile aynı yöntem) |
| Ödeme sayfası arayüzü (form) | Sipariş kaydı + PayTR + Turso + yönetim paneli (umba'dan taşınacak) |

## Tasarım sistemi

- **Yapı:** üç sütunlu uygulama kabuğu. Solda sabit **kategori rayı** (numaralı 01–12, aktif kategorinin alt başlıkları açılır), ortada içerik, sağda (xl+) her zaman açık **sipariş listesi paneli**. Çekmece sepet yok; satırdaki + anında sağdaki fişe yazar. Mobilde alt sekme çubuğu (Ana sayfa · Kategoriler · Ara · Liste) ve tam ekran sayfalar.
- **Ürünler kart değil satır:** fiyat listesi mantığı. Her satırda ad, marka, birim fiyat; ambalaj boyları fiyatlı "pill"ler olarak yan yana; adet sayacı satırda. Katalog sırasında alt kategori başlıklarıyla gruplanır.
- **Renkler:** gece mavisi (`navy-900`), açık mavi (`sky-50…300`, sol ray zemini), turuncu (`orange-500`, `.bg-copper`), kağıt (`paper-50`). Tanımlar `src/app/globals.css` içindeki `@theme` bloğunda.
- **Yazı tipleri:** Cormorant Garamond (serif başlık, fiyat ve numaralar) + Figtree (metin), `next/font/google`.

## Katalog veri modeli

`src/lib/types.ts` → `Product` (marka, kategori, alt kategori, etiketler, çoklu **varyant**: etiket, SKU, fiyat, eski fiyat, miktar/birim, koli adedi, stok).

- Kategoriler ve alt kategoriler: `src/lib/categories.ts` (12 ana, 55 alt kategori)
- Ürünler: `src/data/catalog.json` (tam) ve `src/data/catalog-index.json` (listeleme/arama için hafif kopya, varyantlar dâhil ~35 KB gzip)
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
  components/     shell (ray, üst çubuk, mobil sekmeler), order (sipariş listesi), catalog (satırlar), home, product, search, ui
  lib/            site ayarları, katalog erişimi, arama, sepet deposu, biçimlendirme
  data/           katalog JSON dosyaları
scripts/          katalog üretici
```
