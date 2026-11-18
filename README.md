# Yavuz Gıda — E-Ticaret Sitesi (ön tasarım)

Kahve, şurup, çay, sıcak çikolata, barista sütleri, bardak ve barista ekipmanları satan **Yavuz Gıda** (kafe & HoReCa tedarikçisi) için
Next.js 16 ile geliştirilen, Türkçe, mobil uyumlu, 600+ ürünlük e-ticaret sitesi.
Altyapı [umbagida.com](https://umbagida.com) projesiyle aynıdır (Next.js 16, Tailwind v4, Vercel); tasarım sıfırdan ve tamamen farklıdır.

## Durum

Bu sürüm **ön tasarımdır**: tüm sayfalar ve akışlar görsel olarak hazırdır, ürünler yer tutucudur.

| Hazır | Sonraki aşama |
|---|---|
| **Sipariş sistemi:** siparişler veritabanına yazılır (libSQL/Turso), PayTR kart ödemesi (3D Secure) ve Havale/EFT, demo ödeme modu, `/siparis-takip` üyeliksiz takip, `/yonetim` paneli (durum, kargo takip no, not, anlık bildirim) | Yönetim panelinden fiyat/stok düzenleme (gerçek katalog sonrası) |
| Referanslar bölümü (ana sayfa + kurumsal), müşteri modları, özel harman | Gerçek referans logoları |
| Ana sayfa, kategori / alt kategori, filtreli listeleme (sıralama, sayfalama), ürün sayfası (galeri, satın alma kutusu, sekmeler), sepet sayfası + mini sepet, arama (öneri paneli), kategori menüleri, mobil alt gezinme, üretilen ürün görselleri | Gerçek ürün listesi içe aktarma (Excel/CSV → `src/data/catalog.json`) |
| Kurumsal, Hakkımızda, İletişim, SSS, Sipariş takip, yasal sayfa iskeletleri, sitemap, robots | Ürün fotoğrafları (jsDelivr CDN, umba ile aynı yöntem) |

## Tasarım sistemi

- **Kurgu:** pazar yeri (Trendyol / Hepsiburada) düzeni. Üst bağlantı şeridi, büyük arama çubuğu (öneri paneli), Giriş / Favoriler / Sepetim (üzerine gelince mini sepet), üzerine gelince açılan kategori çubuğu. Ana sayfa: banner karuseli + yan bannerlar, kategori daireleri, geri sayımlı flaş ürünler, kampanya kutuları, sekmeli çok satanlar, popüler kategoriler, raylar, markalar. Listeleme: sol filtre paneli (kategori, marka arama, fiyat aralığı, özellikler, puan, kargo), hızlı filtre çipleri, sıralama, sayfalama. Ürün sayfası: galeri, puan ve satış rozeti, fiyat kutusu, boy seçimi, adet, Sepete Ekle / Şimdi Al, teslimat bilgileri, sekmeler. Sepet: satıcı kutusu, adet, özet ve kupon. Mobilde alt gezinme (Anasayfa · Kategoriler · Sepetim · Hesabım).
- **Ürün görselleri:** fotoğraf gelene kadar `PackArt` her ürün için ambalaj tipine (çuval, poşet, şişe, kavanoz, teneke, kutu, karton) göre SVG "packshot" üretir; marka ve ürün adı etiketin üzerinde yazar. Fotoğraf eklenince `ProductImage` otomatik fotoğrafı gösterir.
- **Renkler:** turuncu aksiyon (`orange-500`), açık mavi yüzey ve rozetler (`sky-50…200`), lacivert (`navy-900`), açık gri sayfa zemini (`paper-50`). Tanımlar `src/app/globals.css` içindeki `@theme` bloğunda.
- **Yazı tipi:** Inter, `next/font/google`.

## Müşteri modları ve özel harman

- **Üyelik yok:** hiçbir modda giriş/şifre bulunmaz; mevcut müşteri ayrımı yalnızca akış farkıdır.
- **Giriş kapısı:** ilk ziyarette "Mevcut Müşteriyim / Yeni Müşteriyim" seçimi (`WelcomeGate`), tercih `localStorage`'da (`mode-store.ts`); üst şeritteki rozetten değiştirilir.
- **Mevcut müşteri:** fiyatlar, indirim rozetleri, kargo eşiği ve fiyat filtreleri gizlenir; "Sepete Ekle" → "Listeye Ekle". Liste sayfasında firma/telefon girilir, **"Listeyi Onayla ve WhatsApp'tan Gönder"** `wa.me` bağlantısıyla hazır mesajı açar (`lib/whatsapp.ts`). Ödeme sayfası bu modda listeye yönlendirir.
- **Yeni müşteri:** fiyatlı katalog, sepet, ödeme; ayrıca sepette WhatsApp ile sipariş seçeneği.
- **Özel harman (`/ozel-harman`):** 11 orijin için %5 adımlı oranlar (toplam %100), kavurma, öğütüm, ambalaj, etiket rengi, marka ve ürün adı; canlı paket önizlemesi ve tat profili. Yeni müşteri modunda tahmini fiyat; her iki modda sepete/listeye eklenir ve WhatsApp talebi oluşturulur. Orijin fiyatları ve işçilik `BlendBuilder.tsx` içinde yer tutucudur.

## Yayın

İki hedef vardır:

- **GitHub Pages (demo, statik):** `.github/workflows/pages.yml` her push'ta `GITHUB_PAGES=1` ile `output: export` derlemesi yapar; sunucu rotaları (`src/app/api`, `src/app/yonetim`) derleme öncesi çıkarılır. Sepet ve özel harman çalışır; sipariş kaydı ve kart ödemesi çalışmaz (havale seçilirse özet WhatsApp ile iletilir). Adres: https://rebirthsoftware-code.github.io/yavuzgida/
- **Vercel (canlı):** tam Next.js. Adımlar Umba ile aynı:
  1. Vercel'de projeyi depoya bağlayın (Framework: Next.js).
  2. Storage → **Turso** ekleyin (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` otomatik gelir; tablolar ilk istekte oluşur).
  3. Ortam değişkenleri: `ADMIN_PASSWORD`, `PAYTR_MERCHANT_ID/KEY/SALT`, `PAYTR_TEST_MODE=1`, `NEXT_PUBLIC_SITE_URL`, iletişim ve banka bilgileri (`.env.example`).
  4. PayTR paneli → Bildirim URL: `https://<alan-adi>/api/paytr/callback`
  5. Kontrol: `/api/health` → `{"ok":true,"db":true,"paytr":true,...}`. PayTR anahtarları girilmemişken kart ödemesi **demo ekranıyla** simüle edilir.

### Sipariş akışı

| Ödeme | Sipariş oluşunca | Sonra |
|---|---|---|
| Kredi kartı | `odeme-bekliyor`; PayTR penceresi (veya demo) açılır | Bildirim gelince `onaylandi` |
| Havale / EFT | `beklemede` | Dekont gelince panelden onay |
| Mevcut müşteri (WhatsApp) | Sipariş kaydı yok; liste WhatsApp mesajı olarak firmaya düşer | Firma telefonla/WhatsApp'la teyit eder |

Panelden: Hazırlanıyor → Kargoya verildi (kargo firması + takip no) → Teslim edildi; gerekirse İptal. Özel harman kalemleri katalog dışı olduğu için online ödemeye girmez; teklif süreci WhatsApp üzerinden yürür.

### API uç noktaları

`POST /api/orders` · `POST /api/paytr/callback` · `POST /api/paytr/demo` · `GET /api/track?no=&phone=` · `POST /api/admin/login` · `GET /api/admin/orders` · `GET|PATCH /api/admin/orders/:no` · `GET /api/admin/stats` · `GET|POST|DELETE|PUT /api/admin/push` · `GET /api/health`

Yerel test: `mkdir data && DATABASE_URL=file:./data/yavuz.db ADMIN_PASSWORD=admin123 npm run build && npm start`

## Katalog veri modeli

`src/lib/types.ts` → `Product` (marka, kategori, alt kategori, etiketler, çoklu **varyant**: etiket, SKU, fiyat, eski fiyat, miktar/birim, koli adedi, stok).

- Kategoriler ve alt kategoriler: `src/lib/categories.ts` (13 ana, 66 alt kategori; kafe ve pastane odaklı)
- Ürünler: `src/data/catalog.json` (tam) ve `src/data/catalog-index.json` (listeleme/arama için hafif kopya, varyantlar dâhil ~35 KB gzip)
- Örnek katalog üretici: `node scripts/generate-catalog.mjs` (780+ yer tutucu kafe ve pastane ürünü, deterministik; puan, satış adedi ve ambalaj tipi dâhil)

Gerçek liste geldiğinde aynı JSON biçimini üreten bir içe aktarma scripti yazılacak; bileşenler değişmeyecek.

## Yerel çalıştırma

```bash
npm install
cp .env.example .env.local   # yerel veritabanı için DATABASE_URL=file:./data/yavuz.db ve mkdir data
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint && npx tsc --noEmit
```

## Dizin yapısı

```
src/
  app/            sayfalar (urunler, kategori/[slug]/[sub], urun/[slug], sepet, odeme, ozel-harman, siparis-takip, yonetim, kurumsal …) ve API (app/api)
  components/     layout, home, catalog, product (kart, galeri, satın alma, PackArt), cart, checkout, order, admin, blend, search, ui
  lib/            site ayarları, katalog, arama, sepet/mod depoları, sipariş şeması, API istemcisi, WhatsApp mesajı
  server/         veritabanı (libSQL/Turso), PayTR, sipariş mantığı, anlık bildirim
  data/           katalog JSON dosyaları
scripts/          katalog üretici
```
