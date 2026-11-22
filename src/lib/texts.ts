/**
 * Yönetim panelinden düzenlenebilen site metinleri: anahtar → varsayılan.
 * Bileşenler `t(config, "anahtar")` (sunucu) veya `useText("anahtar")` (istemci) ile okur.
 */
export type TextDef = { key: string; label: string; group: string; multiline?: boolean; default: string };

export const TEXT_GROUPS = ["Site kimliği", "Footer", "Ana sayfa bölümleri", "Özel harman tanıtımı", "Anlaşmalı müşteri paneli", "Hakkımızda", "Kurumsal", "İletişim"] as const;

export const TEXTS: TextDef[] = [
  // Site kimliği
  { key: "site.tagline", label: "Slogan", group: "Site kimliği", default: "Kafenizin tedarik ortağı" },
  { key: "seo.title", label: "Tarayıcı başlığı (ana sayfa)", group: "Site kimliği", default: "Yavuz Gıda | Kafe & Barista Ürünleri Toptan — Kahve, Şurup, Çay, Bardak" },
  { key: "seo.description", label: "Arama motoru açıklaması", group: "Site kimliği", multiline: true, default: "Yavuz Gıda: espresso çekirdek, aroma şurubu, çay, sıcak çikolata, barista sütleri, karton bardak ve barista ekipmanları dâhil 600'den fazla kafe ürünü. Kafe, restoran ve oteller için toptan fiyat, aynı gün kargo." },
  // Footer
  { key: "footer.about", label: "Footer tanıtım metni", group: "Footer", multiline: true, default: "Yavuz Gıda: espresso çekirdek, aroma şurubu, çay, sıcak çikolata, barista sütleri, karton bardak ve barista ekipmanları dâhil 600'den fazla kafe ürünü. Kafe, restoran ve oteller için toptan fiyat, aynı gün kargo." },
  { key: "footer.strip1.title", label: "Şerit 1 başlık", group: "Footer", default: "Aynı gün kargo" },
  { key: "footer.strip1.text", label: "Şerit 1 açıklama", group: "Footer", default: "14:00 öncesi siparişlerde" },
  { key: "footer.strip2.title", label: "Şerit 2 başlık", group: "Footer", default: "Güvenli ödeme" },
  { key: "footer.strip2.text", label: "Şerit 2 açıklama", group: "Footer", default: "256-bit SSL · 3D Secure" },
  { key: "footer.strip3.title", label: "Şerit 3 başlık", group: "Footer", default: "14 gün iade" },
  { key: "footer.strip3.text", label: "Şerit 3 açıklama", group: "Footer", default: "Açılmamış ürünlerde" },
  { key: "footer.strip4.title", label: "Şerit 4 başlık", group: "Footer", default: "Destek hattı" },
  // Ana sayfa bölümleri
  { key: "home.flash.title", label: "Flaş ürünler başlığı", group: "Ana sayfa bölümleri", default: "⚡ Flaş Ürünler" },
  { key: "home.flash.sub", label: "Flaş ürünler alt yazısı", group: "Ana sayfa bölümleri", default: "Gün sonuna kadar geçerli fiyatlar" },
  { key: "home.best.title", label: "Çok satanlar başlığı", group: "Ana sayfa bölümleri", default: "Çok Satanlar" },
  { key: "home.best.sub", label: "Çok satanlar alt yazısı", group: "Ana sayfa bölümleri", default: "Kafelerin her hafta yeniden sipariş verdiği ürünler" },
  { key: "home.popular.title", label: "Popüler kategoriler başlığı", group: "Ana sayfa bölümleri", default: "Popüler Kategoriler" },
  { key: "home.new.title", label: "Yeni gelenler başlığı", group: "Ana sayfa bölümleri", default: "Yeni Gelenler" },
  { key: "home.new.sub", label: "Yeni gelenler alt yazısı", group: "Ana sayfa bölümleri", default: "Rafa bu ay eklenen ürünler" },
  { key: "home.picks.title", label: "Seçtiklerimiz başlığı", group: "Ana sayfa bölümleri", default: "Sizin İçin Seçtiklerimiz" },
  { key: "home.refs.title", label: "Referanslar başlığı", group: "Ana sayfa bölümleri", default: "Çalıştığımız Mağazalar" },
  { key: "home.refs.sub", label: "Referanslar alt yazısı", group: "Ana sayfa bölümleri", default: "Türkiye genelinde kafe, pastane, otel ve restoranların tedarik ortağıyız" },
  { key: "home.refs.note", label: "Referanslar alt notu", group: "Ana sayfa bölümleri", default: "Referans listemizin tamamı ve iletişim bilgileri talep üzerine paylaşılır." },
  { key: "home.brands.title", label: "Markalar başlığı", group: "Ana sayfa bölümleri", default: "Popüler Markalar" },
  // Özel harman tanıtımı
  { key: "blend.kicker", label: "Üst etiket", group: "Özel harman tanıtımı", default: "Private label · Özel harman" },
  { key: "blend.title", label: "Başlık", group: "Özel harman tanıtımı", default: "Kendi markanızla espresso çekirdeği" },
  { key: "blend.text", label: "Açıklama", group: "Özel harman tanıtımı", multiline: true, default: "Orijinleri ve oranları siz belirleyin (örn. %70 Brezilya, %20 Kolombiya, %10 Etiyopya), kavurma derecesini seçin, markanızın adını yazın. Yavuz Gıda harmanı sizin için kavursun, markanızın adıyla paketleyip göndersin." },
  { key: "blend.b1", label: "Madde 1", group: "Özel harman tanıtımı", default: "10 orijin, 3 kavurma derecesi" },
  { key: "blend.b2", label: "Madde 2", group: "Özel harman tanıtımı", default: "Markanızın adıyla etiket" },
  { key: "blend.b3", label: "Madde 3", group: "Özel harman tanıtımı", default: "Siparişe özel taze kavurma" },
  { key: "blend.cta", label: "Buton", group: "Özel harman tanıtımı", default: "Harmanınızı oluşturun" },
  // Panel
  { key: "panel.kicker", label: "Üst etiket", group: "Anlaşmalı müşteri paneli", default: "Anlaşmalı müşteri paneli" },
  { key: "panel.title", label: "Başlık", group: "Anlaşmalı müşteri paneli", default: "Hoş geldiniz. Siparişinizi üç adımda oluşturun." },
  { key: "panel.text", label: "Açıklama", group: "Anlaşmalı müşteri paneli", multiline: true, default: "Bu panelde fiyat gösterilmez; anlaşmalı tarifeniz geçerlidir. Ürünleri listeye ekleyin, onaylayın; fişiniz WhatsApp ile bize ulaşsın, dilerseniz PDF olarak kaydedin." },
  { key: "panel.step1.title", label: "Adım 1 başlık", group: "Anlaşmalı müşteri paneli", default: "Ürünleri listeye ekleyin" },
  { key: "panel.step1.text", label: "Adım 1 açıklama", group: "Anlaşmalı müşteri paneli", default: "Boy ve adedi seçin; liste sağ üstte birikir." },
  { key: "panel.step2.title", label: "Adım 2 başlık", group: "Anlaşmalı müşteri paneli", default: "Onaylayın, WhatsApp'tan gönderin" },
  { key: "panel.step2.text", label: "Adım 2 açıklama", group: "Anlaşmalı müşteri paneli", default: "Firma adı ve telefonunuzla tek tıkla iletin." },
  { key: "panel.step3.title", label: "Adım 3 başlık", group: "Anlaşmalı müşteri paneli", default: "Fişi PDF olarak saklayın" },
  { key: "panel.step3.text", label: "Adım 3 açıklama", group: "Anlaşmalı müşteri paneli", default: "Sipariş fişi numaralı ve yazdırılabilir." },
  { key: "panel.footer", label: "Panel alt notu", group: "Anlaşmalı müşteri paneli", default: "Fiyatlar gösterilmez; anlaşmalı tarifeniz geçerlidir." },
  // Hakkımızda
  { key: "about.lead", label: "Giriş cümlesi", group: "Hakkımızda", multiline: true, default: "Yavuz Gıda; kafe, restoran ve otellerin bar ve pastane tedarikini tek noktadan çözmek için kuruldu." },
  { key: "about.stat1.n", label: "Sayı 1", group: "Hakkımızda", default: "600+" },
  { key: "about.stat1.t", label: "Sayı 1 başlık", group: "Hakkımızda", default: "kafe ürünü" },
  { key: "about.stat1.d", label: "Sayı 1 açıklama", group: "Hakkımızda", default: "12 kategori, seçilmiş markalar" },
  { key: "about.stat2.n", label: "Sayı 2", group: "Hakkımızda", default: "81" },
  { key: "about.stat2.t", label: "Sayı 2 başlık", group: "Hakkımızda", default: "ile teslimat" },
  { key: "about.stat2.d", label: "Sayı 2 açıklama", group: "Hakkımızda", default: "Aynı gün kargo, 1–3 iş günü" },
  { key: "about.stat3.n", label: "Sayı 3", group: "Hakkımızda", default: "1 gün" },
  { key: "about.stat3.t", label: "Sayı 3 başlık", group: "Hakkımızda", default: "teklif süresi" },
  { key: "about.stat3.d", label: "Sayı 3 açıklama", group: "Hakkımızda", default: "Kurumsal fiyat listesi" },
  { key: "about.body", label: "Hikâye metni", group: "Hakkımızda", multiline: true, default: "Espresso çekirdekten aroma şurubuna, barista sütünden karton bardağa uzanan bir katalogla, kafelerin dağınık tedarikçilerle uğraşmadan tek faturada alışveriş yapmasını sağlıyoruz. Ürünlerimizi barista testinden geçiriyor, ambalaj boylarını kafelerin gerçek tüketimine göre planlıyoruz.\n\nBu bölümün metni, firmanın hikâyesi ve fotoğraflarıyla birlikte güncellenecektir." },
  // Kurumsal
  { key: "corp.title", label: "Sayfa başlığı", group: "Kurumsal", default: "Kurumsal & toptan satış" },
  { key: "corp.lead", label: "Giriş cümlesi", group: "Kurumsal", multiline: true, default: "Kafe, otel ve zincir işletmeler için aylık alım hacmine göre kademeli fiyat, vade ve atanmış satış temsilcisi. Formu doldurun, 1 iş günü içinde fiyat listenizi gönderelim." },
  { key: "corp.f1.t", label: "Avantaj 1", group: "Kurumsal", default: "Kademeli fiyat" },
  { key: "corp.f1.d", label: "Avantaj 1 açıklama", group: "Kurumsal", default: "Koli ve aylık hacme göre birim fiyat düşer." },
  { key: "corp.f2.t", label: "Avantaj 2", group: "Kurumsal", default: "Vadeli ödeme" },
  { key: "corp.f2.d", label: "Avantaj 2 açıklama", group: "Kurumsal", default: "Onaylı hesaplara 30 güne kadar vade." },
  { key: "corp.f3.t", label: "Avantaj 3", group: "Kurumsal", default: "E-fatura & cari" },
  { key: "corp.f3.d", label: "Avantaj 3 açıklama", group: "Kurumsal", default: "Tek faturada tüm kategoriler, cari hesap ekstresi." },
  { key: "corp.f4.t", label: "Avantaj 4", group: "Kurumsal", default: "Satış temsilcisi" },
  { key: "corp.f4.d", label: "Avantaj 4 açıklama", group: "Kurumsal", default: "WhatsApp'tan sipariş, tek kişiden takip." },
  { key: "corp.f5.t", label: "Avantaj 5", group: "Kurumsal", default: "Araçla teslimat" },
  { key: "corp.f5.d", label: "Avantaj 5 açıklama", group: "Kurumsal", default: "Bölgesel rotalarda kendi araçlarımızla teslim." },
  { key: "corp.f6.t", label: "Avantaj 6", group: "Kurumsal", default: "Numune & eğitim" },
  { key: "corp.f6.d", label: "Avantaj 6 açıklama", group: "Kurumsal", default: "Şurup ve kahvede ücretsiz numune, barista eğitimi desteği." },
  { key: "corp.who.title", label: "Kimler için başlığı", group: "Kurumsal", default: "Kimler için?" },
  { key: "corp.who.text", label: "Kimler için metni", group: "Kurumsal", multiline: true, default: "Kafe, coffee shop zincirleri, restoran, otel, pastane, ofis ve catering firmaları." },
  // İletişim
  { key: "contact.lead", label: "İletişim giriş cümlesi", group: "İletişim", default: "Sipariş, teklif ve tedarik soruları için bize ulaşın." },
];

export const TEXT_DEFAULTS: Record<string, string> = Object.fromEntries(TEXTS.map((d) => [d.key, d.default]));

export function textOf(texts: Record<string, string> | undefined, key: string): string {
  const v = texts?.[key];
  return v !== undefined && v !== "" ? v : (TEXT_DEFAULTS[key] ?? "");
}
