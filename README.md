# Yavuz Gıda — E-Ticaret Sitesi (ön tasarım)

Kahve, şurup, çay, sıcak çikolata, barista sütleri, bardak ve barista ekipmanları satan **Yavuz Gıda** (kafe & HoReCa tedarikçisi) için
Next.js 16 ile geliştirilen, Türkçe, mobil uyumlu, 600+ ürünlük e-ticaret sitesi.
Altyapı [umbagida.com](https://umbagida.com) projesiyle aynıdır (Next.js 16, Tailwind v4, Vercel); tasarım sıfırdan ve tamamen farklıdır.

## Durum

Bu sürüm **ön tasarımdır**: tüm sayfalar ve akışlar görsel olarak hazırdır, ürünler yer tutucudur.

| Hazır | Sonraki aşama |
|---|---|
| **Sipariş sistemi:** siparişler veritabanına yazılır (libSQL/Turso), PayTR kart ödemesi (3D Secure) ve Havale/EFT, demo ödeme modu, `/siparis-takip` üyeliksiz takip, `/yonetim` paneli (durum, kargo takip no, not, anlık bildirim) | Yönetim panelinden fiyat/stok düzenleme (gerçek katalog sonrası) |
| Referanslar bölümü (ana sayfa + kurumsal), anlaşmalı müşteri paneli (WhatsApp + PDF fiş), özel harman | Gerçek referans logoları |
| Ana sayfa, kategori / alt kategori, filtreli listeleme (sıralama, sayfalama), ürün sayfası (galeri, satın alma kutusu, sekmeler), sepet sayfası + mini sepet, arama (öneri paneli), kategori menüleri, mobil alt gezinme, üretilen ürün görselleri | Gerçek ürün listesi içe aktarma (Excel/CSV → `src/data/catalog.json`) |
| Kurumsal, Hakkımızda, İletişim, SSS, Sipariş takip, yasal sayfa iskeletleri, sitemap, robots | Ürün fotoğrafları (jsDelivr CDN, umba ile aynı yöntem) |

## Tasarım sistemi

- **Kurgu:** pazar yeri (Trendyol / Hepsiburada) düzeni. Üst bağlantı şeridi, büyük arama çubuğu (öneri paneli), Giriş / Favoriler / Sepetim (üzerine gelince mini sepet), üzerine gelince açılan kategori çubuğu. Ana sayfa: banner karuseli + yan bannerlar, kategori daireleri, geri sayımlı flaş ürünler, kampanya kutuları, sekmeli çok satanlar, popüler kategoriler, raylar, markalar. Listeleme: sol filtre paneli (kategori, marka arama, fiyat aralığı, özellikler, puan, kargo), hızlı filtre çipleri, sıralama, sayfalama. Ürün sayfası: galeri, puan ve satış rozeti, fiyat kutusu, boy seçimi, adet, Sepete Ekle / Şimdi Al, teslimat bilgileri, sekmeler. Sepet: satıcı kutusu, adet, özet ve kupon. Mobilde alt gezinme (Anasayfa · Kategoriler · Sepetim · Hesabım).
- **Ürün görselleri:** fotoğraf gelene kadar `PackArt` her ürün için ambalaj tipine (çuval, poşet, şişe, kavanoz, teneke, kutu, karton) göre SVG "packshot" üretir; marka ve ürün adı etiketin üzerinde yazar. Fotoğraf eklenince `ProductImage` otomatik fotoğrafı gösterir.
- **Renkler:** turuncu aksiyon (`orange-500`), açık mavi yüzey ve rozetler (`sky-50…200`), lacivert (`navy-900`), açık gri sayfa zemini (`paper-50`). Tanımlar `src/app/globals.css` içindeki `@theme` bloğunda.
- **Yazı tipi:** Inter, `next/font/google`.

## Mağaza, anlaşmalı müşteri paneli ve özel harman

- **Üyelik yok:** sitede giriş/şifre bulunmaz.
- **Mağaza (`/`):** herkese açık e-ticaret; fiyatlar, sepet, PayTR / havale ile ödeme.
- **Anlaşmalı Müşteri Paneli (`/panel`):** hâlihazırda çalışılan kafeler için ayrı kabuk (`src/app/panel`, `PanelHeader`). Aynı katalog fiyatsız gösterilir ("Listeye Ekle"); liste mağaza sepetinden bağımsızdır (`panelStore`). `/panel/sepet` sayfasında firma/telefon girilip **Siparişi Onayla** denince "Siparişiniz oluşturuluyor" ekranında gerçek bir **PDF fiş** üretilir (`lib/order-pdf.ts`, jsPDF + gömülü Roboto, Türkçe karakter destekli, ~70 KB) ve sunucu varsa `POST /api/fis` ile kaydedilir (`panel_orders` tablosu; `GET /api/fis/<ref>` PDF'i sunar). Ardından fiş sayfası (`/panel/siparis?ref=YL-…`): **PDF'i WhatsApp ile Gönder** (telefonda paylaşım menüsüyle dosya olarak; desteklenmeyen cihazda PDF indirilir ve WhatsApp mesajı PDF bağlantısıyla açılır), PDF indir, yazdır, yalnızca metin gönder, önceki fişler. Fişler cihazda da saklanır (`lib/panel-order.ts`).
- **Yönetim paneli (`/yonetim`, `AdminPanel.tsx`):** şifreyle (`ADMIN_PASSWORD`) giriş; iki sekme: **E-Ticaret** (ödemeli siparişler: durum, kargo takip, iç not, geçmiş) ve **Anlaşmalı** (panel fişleri: Yeni → Onaylandı → Hazırlanıyor → Teslim edildi / İptal, iç not, PDF fiş, WhatsApp'tan bilgi ver). Mobilde kart listesi + tam ekran detay çekmecesi. Yeni panel fişi geldiğinde `NOTIFY_WEBHOOK` ve anlık bildirim (web push) tetiklenir. Kendi kabuğu vardır (`src/app/(yonetim)`), mağaza başlığı/alt menüsü görünmez.
- **İçerik yönetimi (Yönetim → Ürünler / Ana Sayfa / Ayarlar):** ürün adı, açıklama, kategori, etiket, görsel URL'si, boy/fiyat/stok (varyant ekle-sil), gizleme, yeni ürün ekleme; CSV içe/dışa aktarma (Excel; noktalı virgül ayraç, her satır bir varyant); duyuru çubuğu, slider slaytları (yerleşik 5 fotoğraf veya kendi URL'niz, `*vurgu*` işaretli başlık), kampanya kutuları, referanslar; iletişim, sosyal medya, kargo eşiği/ücreti, kart ödemesi açık/kapalı, banka/IBAN, firma unvanı, kategori ad/açıklama/gizleme, özel harman notları, yasal metinler. Veri modeli: `lib/content.ts` (tipler, varsayılanlar, `mergeCatalog`), DB erişimi `server/content-store.ts` (`settings.site_config`, `content_products`), önbellek `server/content-cache.ts` (`use cache` + `content` etiketi; yönetim API'si `revalidateTag` ile düşürür). Temel katalog hâlâ `data/catalog.json`; yönetim düzenlemeleri **yama** olarak saklanır, yeni ürünler `u-` ön ekiyle tam kayıt tutulur. Sunucu bileşenleri `lib/catalog.ts` (async) ve `lib/site-config.ts` üzerinden okur; istemci `ConfigProvider` / `useCatalogIndex` ile alır.
- **Demo modu:** `NEXT_PUBLIC_DEMO_ADMIN=1` ile (GitHub Pages derlemesinde açık) yönetim paneli sunucusuz çalışır: şifre `demo`; e-ticaret siparişleri örnek veridir, anlaşmalı fişler aynı tarayıcıda panelden oluşturulan gerçek fişlerdir; durum değişiklikleri tarayıcıda saklanır (`lib/admin-demo.ts`).
- Bağlantı ön eki: bileşenler `useCart().base` ("" | "/panel") ile doğru kabuğa bağlanır; `showPrices` panelde false.
- **Özel harman (`/ozel-harman`):** 11 orijin için %5 adımlı oranlar (toplam %100), kavurma, öğütüm, ambalaj, etiket rengi, marka ve ürün adı; canlı paket önizlemesi ve tat profili; tahmini fiyat; sepete/listeye eklenir ve WhatsApp talebi oluşturur. Orijin fiyatları ve işçilik `BlendBuilder.tsx` içinde yer tutucudur.

## Yayın

İki hedef vardır:

- **GitHub Pages (demo, statik):** `.github/workflows/pages.yml` her push'ta `GITHUB_PAGES=1` ile `output: export` derlemesi yapar; sunucu rotaları (`src/app/api`) derleme öncesi çıkarılır. Sepet, özel harman, anlaşmalı panel (fiş cihazda) ve yönetim paneli (demo modu) çalışır; gerçek sipariş kaydı ve kart ödemesi çalışmaz (havale seçilirse özet WhatsApp ile iletilir). Adres: https://rebirthsoftware-code.github.io/yavuzgida/
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
| Anlaşmalı müşteri paneli | Numaralı fiş oluşur (`panel_orders`, durum `yeni`), WhatsApp mesajı PDF bağlantısıyla firmaya düşer | Yönetim → Anlaşmalı sekmesinden Onaylandı → Hazırlanıyor → Teslim edildi |

Panelden: Hazırlanıyor → Kargoya verildi (kargo firması + takip no) → Teslim edildi; gerekirse İptal. Özel harman kalemleri katalog dışı olduğu için online ödemeye girmez; teklif süreci WhatsApp üzerinden yürür.

### API uç noktaları

`POST /api/orders` · `POST /api/fis` · `GET /api/fis/:ref` · `POST /api/paytr/callback` · `POST /api/paytr/demo` · `GET /api/track?no=&phone=` · `POST /api/admin/login` · `GET /api/admin/orders` · `GET|PATCH /api/admin/orders/:no` · `GET /api/admin/stats` · `GET /api/admin/panel-orders` · `GET|PATCH /api/admin/panel-orders/:ref` · `GET|POST /api/admin/products` · `GET|PATCH|DELETE /api/admin/products/:slug` · `GET|PUT /api/admin/config` · `POST /api/admin/import` · `GET /api/admin/export` · `GET /api/catalog-index` · `GET|POST|DELETE|PUT /api/admin/push` · `GET /api/health`

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
  app/            (magaza) mağaza sayfaları · panel/ anlaşmalı müşteri paneli · api/ sipariş API'si
  components/     layout, panel, home, catalog, product (kart, galeri, satın alma, PackArt, ProductDetail), cart, checkout, order, admin, blend, search, ui
  lib/            site ayarları, katalog, arama, sepet/mod depoları, sipariş şeması, API istemcisi, WhatsApp mesajı
  server/         veritabanı (libSQL/Turso), PayTR, sipariş mantığı, anlık bildirim
  data/           katalog JSON dosyaları
scripts/          katalog üretici
```
