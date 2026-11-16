/**
 * Örnek katalog üretici — 600+ yer tutucu ürün.
 * Gerçek ürün listesi (Excel/CSV) geldiğinde bu script yerine `scripts/import-catalog.mjs`
 * kullanılacak; çıktı biçimi aynıdır: src/data/catalog.json + src/data/catalog-index.json
 *
 * Çalıştır: node scripts/generate-catalog.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/* Deterministik rastgele sayı üreteci (her çalıştırmada aynı katalog) */
let seed = 20261116;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const between = (a, b) => a + rnd() * (b - a);

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const round = (n) => Math.round(n * 2) / 2; // 0,50 ₺ hassasiyet

/* Varyant şablonları: [etiket, miktar, birim, çarpan(kg başı fiyata göre indirim), koli adedi] */
const TPL = {
  bulk: [["1 kg", 1000, "g", 1, 12], ["5 kg", 5000, "g", 0.93], ["25 kg çuval", 25000, "g", 0.86]],
  bulkSmall: [["500 g", 500, "g", 1.08, 20], ["1 kg", 1000, "g", 1, 12], ["5 kg", 5000, "g", 0.92]],
  spice: [["100 g", 100, "g", 1.3, 24], ["500 g", 500, "g", 1, 12], ["1 kg", 1000, "g", 0.9]],
  nuts: [["250 g", 250, "g", 1.15, 24], ["1 kg", 1000, "g", 1, 10], ["5 kg", 5000, "g", 0.93]],
  oil: [["1 L", 1000, "ml", 1, 12], ["5 L", 5000, "ml", 0.95], ["18 L teneke", 18000, "ml", 0.9]],
  bottle: [["500 ml", 500, "ml", 1.1, 12], ["1 L", 1000, "ml", 1, 12], ["5 L", 5000, "ml", 0.9]],
  jar: [["720 g kavanoz", 720, "g", 1.1, 12], ["1,7 kg", 1700, "g", 1, 6], ["5 kg kova", 5000, "g", 0.9]],
  jarSmall: [["380 g kavanoz", 380, "g", 1.15, 12], ["720 g kavanoz", 720, "g", 1, 12], ["2,5 kg", 2500, "g", 0.9]],
  can: [["400 g teneke", 400, "g", 1, 24], ["800 g teneke", 800, "g", 0.95, 12], ["2,5 kg teneke", 2500, "g", 0.88, 6]],
  pack: [["500 g paket", 500, "g", 1, 20], ["20'li koli", 10000, "g", 0.9]],
  pack350: [["350 g paket", 350, "g", 1, 24], ["24'lü koli", 8400, "g", 0.9]],
  snack: [["Tekli", 100, "g", 1.2, 24], ["24'lü koli", 2400, "g", 1]],
  tea: [["500 g", 500, "g", 1.05, 12], ["1 kg", 1000, "g", 1, 10], ["5 kg", 5000, "g", 0.93]],
  teaBag: [["20'li kutu", 40, "g", 1.2, 12], ["100'lü kutu", 200, "g", 1, 6]],
  drink: [["1 L", 1000, "ml", 1, 12], ["12'li koli", 12000, "ml", 0.92]],
  water: [["6'lı paket", 3000, "ml", 1], ["Palet (84 paket)", 252000, "ml", 0.85]],
  sarf: [["100'lü paket", 100, "adet", 1, 10], ["1000'lü koli", 1000, "adet", 0.85]],
  sarfBig: [["50'li paket", 50, "adet", 1, 20], ["500'lü koli", 500, "adet", 0.88]],
};

/* Marka havuzları (yer tutucu) */
const BRANDS = {
  bulk: ["Yavuz Seçkin", "Anadolu Bakliyat", "Harman", "Köy Pazarı"],
  spice: ["Yavuz Seçkin", "Baharat Evi", "Akdeniz Çeşni", "Harman"],
  nuts: ["Yavuz Seçkin", "Karadeniz Kuruyemiş", "Çerezci", "Köy Pazarı"],
  oil: ["Ege Zeytin", "Altın Damla", "Yavuz Seçkin", "Akdeniz Çeşni"],
  jar: ["Yavuz Seçkin", "Köy Pazarı", "Bereket Konserve", "Ege Zeytin"],
  pasta: ["Durum", "Harman", "Yavuz Seçkin", "Anadolu Bakliyat"],
  breakfast: ["Köy Pazarı", "Petek", "Yavuz Seçkin", "Bereket Konserve"],
  drink: ["Çaykent", "Yavuz Seçkin", "Pınar Su", "Mevsim"],
  snack: ["Kıtır", "Tatlıcı", "Yavuz Seçkin", "Harman"],
  sauce: ["Mutfak Şefi", "Yavuz Seçkin", "Bereket Konserve", "Akdeniz Çeşni"],
  sugar: ["Şekerpare", "Yavuz Seçkin", "Harman"],
  sarf: ["Ambalajcı", "Yavuz Seçkin", "Servis Pro"],
};

/* Katalog kaynağı: kategori → alt kategori → [şablon, kg/L başı taban fiyat, marka havuzu, ürün adları] */
const SOURCE = {
  "bakliyat-tahil": {
    hue: 36,
    mercimek: ["bulk", 95, "bulk", ["Kırmızı Mercimek", "Yeşil Mercimek", "Sarı Mercimek", "Kırmızı Futbol Mercimek", "Kara Mercimek", "Siyah Mercimek (Beluga)"]],
    "nohut-fasulye": ["bulk", 120, "bulk", ["Koçbaşı Nohut 9 mm", "Nohut 8 mm", "Dermason Fasulye", "Şeker Fasulye", "Barbunya", "Çalı Fasulyesi", "Kırmızı Barbunya", "Börülce", "Bakla (Kuru)", "Soya Fasulyesi"]],
    pirinc: ["bulk", 110, "bulk", ["Baldo Pirinç", "Osmancık Pirinç", "Basmati Pirinç", "Jasmine Pirinç", "Kırık Pirinç", "Tosya Pirinci", "Yerli Baldo", "Kalrose Pirinç"]],
    bulgur: ["bulk", 70, "bulk", ["Pilavlık Bulgur", "Köftelik İnce Bulgur", "Esmer Pilavlık Bulgur", "Midyat Bulguru", "Çiğköftelik Bulgur", "Tam Buğday Bulguru"]],
    "un-irmik": ["bulk", 45, "bulk", ["Tip 550 Un", "Tam Buğday Unu", "Baklavalık Un", "Pizza Unu", "Mısır Unu", "Nohut Unu", "İnce İrmik", "Kalın İrmik", "Pirinç Unu", "Çavdar Unu", "Kepekli Un"]],
    "diger-tahil": ["bulkSmall", 130, "bulk", ["Yulaf Ezmesi", "Kinoa", "Karabuğday", "Aşurelik Buğday", "Çavdar", "Arpa (Yarma)", "Chia Tohumu", "Keten Tohumu", "Mısır (Patlatmalık)", "Firik"]],
  },
  "baharat-cesni": {
    hue: 20,
    "toz-baharat": ["spice", 420, "spice", ["Pul Biber", "Toz Kırmızı Biber (Tatlı)", "Toz Kırmızı Biber (Acı)", "Karabiber (Toz)", "Kimyon (Toz)", "Zerdeçal", "Zencefil (Toz)", "Tarçın (Toz)", "Sumak", "Köri", "Kekik", "Nane", "Kişniş (Toz)", "Sarımsak Tozu", "Soğan Tozu", "Yenibahar (Toz)", "Karanfil (Toz)", "Isot Biber", "Paprika", "Tatlı Toz Biber Çekilmiş"]],
    "tane-baharat": ["spice", 480, "spice", ["Karabiber (Tane)", "Kimyon (Tane)", "Kişniş (Tane)", "Karanfil (Tane)", "Yenibahar (Tane)", "Çörek Otu", "Susam", "Hardal Tohumu", "Defne Yaprağı", "Tarçın Çubuk", "Kakule", "Yıldız Anason", "Rezene", "Anason", "Çemen Tohumu", "Mahlep"]],
    karisim: ["spice", 390, "spice", ["Köfte Harcı", "Tavuk Baharatı", "Balık Baharatı", "Pizza Baharatı", "Patates Baharatı", "Salata Baharatı", "Mantı Baharatı", "Kebap Baharatı", "Döner Baharatı", "Çiğköfte Baharatı", "Garam Masala", "Kısır Baharatı", "Izgara Baharatı"]],
    tuz: ["bulkSmall", 25, "spice", ["Kaya Tuzu (İnce)", "Kaya Tuzu (Kalın)", "Deniz Tuzu", "İyotlu Sofra Tuzu", "Himalaya Tuzu", "Çankırı Kaya Tuzu", "Sarımsaklı Tuz", "Kekikli Tuz"]],
    "kurutulmus-bitki": ["spice", 350, "spice", ["Fesleğen", "Biberiye", "Dereotu", "Maydanoz (Kuru)", "Tarhun", "Nane (Kuru)", "Kuru Soğan Kıyım", "Kuru Domates", "Kuru Biber (Dolmalık)", "Kuru Patlıcan", "Kuru Bamya"]],
  },
  "kuruyemis-kuru-meyve": {
    hue: 28,
    findik: ["nuts", 520, "nuts", ["Çiğ Fındık İçi", "Kavrulmuş Fındık", "Fındık Kıyım", "Fındık Unu", "Kabuklu Fındık", "Beyazlatılmış Fındık", "Giresun Fındığı (Kalite)"]],
    "badem-ceviz": ["nuts", 640, "nuts", ["Çiğ Badem", "Kavrulmuş Tuzlu Badem", "Badem File", "Badem Unu", "Ceviz İçi (Kelebek)", "Ceviz İçi Kırık", "Kabuklu Ceviz", "Kaju (Çiğ)", "Kaju (Kavrulmuş)", "Çam Fıstığı", "Antep Fıstığı İçi", "Badem (Kabuklu)"]],
    fistik: ["nuts", 380, "nuts", ["Siirt Fıstığı", "Antep Fıstığı (Kavrulmuş)", "Yer Fıstığı (Kabuklu)", "Yer Fıstığı (Soyulmuş)", "Tuzlu Yer Fıstığı", "Fıstık Ezmesi"]],
    cekirdek: ["nuts", 180, "nuts", ["Ay Çekirdeği (Tuzlu)", "Ay Çekirdeği (Tuzsuz)", "Kabak Çekirdeği", "Siyah Çekirdek", "Dakota Çekirdek", "Kavun Çekirdeği", "Kabak Çekirdeği İçi"]],
    "kuru-meyve": ["nuts", 260, "nuts", ["Kuru Kayısı (Jumbo)", "Kuru Kayısı (Standart)", "Gün Kurusu Kayısı", "Kuru İncir", "Kuru Üzüm (Çekirdeksiz)", "Sultaniye Üzüm", "Kuru Erik", "Hurma (Medjool)", "Hurma (Deglet)", "Kuru Dut", "Kuru Kızılcık", "Kuru Elma Dilimi", "Kuru Muz", "Kuru Kivi", "Zeytinyağlı Kuru Üzüm"]],
    karisik: ["nuts", 420, "nuts", ["Karışık Kuruyemiş (Lüks)", "Karışık Kuruyemiş (Ekonomik)", "Çerez Karışımı", "Öğrenci Karışımı", "Leblebi (Sarı)", "Leblebi (Beyaz)", "Tuzlu Leblebi", "Şekerli Leblebi", "Mısır Çerezi"]],
  },
  "yag-sirke": {
    hue: 85,
    zeytinyagi: ["oil", 480, "oil", ["Naturel Sızma Zeytinyağı", "Erken Hasat Sızma Zeytinyağı", "Riviera Zeytinyağı", "Soğuk Sıkım Zeytinyağı", "Organik Sızma Zeytinyağı", "Ayvalık Zeytinyağı", "Memecik Zeytinyağı"]],
    "aycicek-misir": ["oil", 95, "oil", ["Ayçiçek Yağı", "Mısır Yağı", "Kızartmalık Ayçiçek Yağı", "Kanola Yağı", "Bitkisel Karışım Yağ"]],
    "ozel-yaglar": ["bottle", 420, "oil", ["Fındık Yağı", "Susam Yağı", "Hindistan Cevizi Yağı", "Üzüm Çekirdeği Yağı", "Avokado Yağı", "Tereyağı (Sade)", "Margarin (Paket)"]],
    sirke: ["bottle", 60, "oil", ["Elma Sirkesi", "Üzüm Sirkesi", "Beyaz Sirke", "Balzamik Sirke", "Nar Sirkesi", "Doğal Fermente Elma Sirkesi"]],
    "nar-eksisi": ["bottle", 150, "oil", ["Nar Ekşisi", "Nar Ekşili Sos", "Limon Sosu", "Sumak Ekşisi", "Koruk Suyu"]],
  },
  "konserve-salca": {
    hue: 0,
    salca: ["jar", 110, "jar", ["Domates Salçası", "Biber Salçası (Tatlı)", "Biber Salçası (Acı)", "Karışık Salça", "Güneşte Kurutulmuş Domates Salçası", "Organik Domates Salçası"]],
    tursu: ["jar", 85, "jar", ["Kornişon Turşu", "Karışık Turşu", "Biber Turşusu", "Lahana Turşusu", "Sarımsak Turşusu", "Salatalık Turşusu", "Pancar Turşusu", "Jalapeno Biber Turşusu"]],
    "konserve-sebze": ["can", 90, "jar", ["Konserve Bezelye", "Konserve Mısır", "Konserve Mantar", "Közlenmiş Biber", "Doğranmış Domates", "Kapya Biber (Közlenmiş)", "Enginar Kalbi", "Közlenmiş Patlıcan"]],
    "konserve-bakliyat": ["can", 80, "jar", ["Haşlanmış Nohut", "Haşlanmış Fasulye", "Haşlanmış Barbunya", "Haşlanmış Mercimek", "Fasulye Pilaki"]],
    zeytin: ["jar", 180, "jar", ["Siyah Zeytin (Gemlik)", "Yeşil Zeytin (Kırma)", "Siyah Zeytin (Sele)", "Yeşil Çizik Zeytin", "Yağlı Sele Zeytin", "Biber Dolgulu Yeşil Zeytin", "Çekirdeksiz Siyah Zeytin", "Kalamata Zeytin"]],
  },
  "makarna-hamur": {
    hue: 45,
    makarna: ["pack", 55, "pasta", ["Spagetti", "Burgu Makarna", "Fiyonk Makarna", "Kalem Makarna", "Arpa Şehriye", "Tel Şehriye", "Penne", "Fettuccine", "Mantı Makarna", "Yıldız Şehriye", "Tam Buğday Spagetti", "Lazanya", "Kuskus", "Tortellini"]],
    eriste: ["pack", 95, "pasta", ["Ev Eriştesi (Yumurtalı)", "Kesme Erişte", "Tam Buğday Erişte", "Kuskus (El Yapımı)", "Pirinç Eriştesi", "Soba Eriştesi"]],
    hamur: ["pack", 70, "pasta", ["Yufka (El Açması)", "Baklavalık Yufka", "Mantı (Dondurulmuş)", "Milföy Hamuru", "Pizza Hamuru", "Lahmacun Hamuru"]],
    "ekmek-cesitleri": ["pack350", 60, "pasta", ["Galeta Unu", "Galeta (Tam Buğday)", "Grissini", "Ekmek Kırıntısı", "Kruton", "Tortilla Lavaş", "Kuru Ekmek (Peksimet)"]],
  },
  kahvaltilik: {
    hue: 40,
    bal: ["jarSmall", 480, "breakfast", ["Çiçek Balı", "Çam Balı", "Kestane Balı", "Petek Bal", "Süzme Bal", "Yayla Balı", "Organik Çiçek Balı", "Karakovan Balı"]],
    "recel-marmelat": ["jarSmall", 120, "breakfast", ["Çilek Reçeli", "Vişne Reçeli", "Kayısı Reçeli", "Portakal Marmelatı", "İncir Reçeli", "Gül Reçeli", "Ayva Reçeli", "Böğürtlen Reçeli", "Karadut Reçeli", "Şekersiz Kayısı Reçeli"]],
    "tahin-pekmez": ["jar", 190, "breakfast", ["Tahin", "Üzüm Pekmezi", "Keçiboynuzu Pekmezi", "Dut Pekmezi", "Tahin-Pekmez Karışımı", "Andız Pekmezi", "Tam Tahin (Kabuklu)"]],
    surulebilir: ["jarSmall", 260, "breakfast", ["Fındık Ezmesi", "Fıstık Ezmesi", "Kakaolu Fındık Kreması", "Badem Ezmesi", "Susam Ezmesi", "Kayısı Ezmesi"]],
  },
  icecek: {
    hue: 190,
    cay: ["tea", 220, "drink", ["Rize Çayı (Tomurcuk)", "Rize Çayı (Filiz)", "Dökme Siyah Çay", "Earl Grey", "Yeşil Çay", "Kokulu Çay", "Seylan Çayı", "Organik Siyah Çay"]],
    kahve: ["tea", 450, "drink", ["Türk Kahvesi", "Dibek Kahvesi", "Menengiç Kahvesi", "Filtre Kahve (Öğütülmüş)", "Espresso Çekirdek", "Hazır Granül Kahve", "Damla Sakızlı Türk Kahvesi"]],
    "bitki-cayi": ["teaBag", 400, "drink", ["Ihlamur", "Kuşburnu Çayı", "Papatya Çayı", "Nane Limon", "Adaçayı", "Rezene Çayı", "Kış Çayı", "Melisa Çayı", "Hibiskus Çayı", "Zencefil Çayı"]],
    "meyve-suyu": ["drink", 45, "drink", ["Portakal Suyu", "Vişne Nektarı", "Şeftali Nektarı", "Elma Suyu", "Karışık Meyve Suyu", "Nar Suyu", "Kayısı Nektarı", "Limonata"]],
    "su-gazli": ["water", 8, "drink", ["Doğal Kaynak Suyu 500 ml", "Doğal Kaynak Suyu 1,5 L", "Soda (Sade)", "Soda (Limonlu)", "Gazoz", "Kola", "Ayran (Şişe)", "Şalgam Suyu"]],
  },
  atistirmalik: {
    hue: 275,
    biskuvi: ["pack350", 110, "snack", ["Pötibör Bisküvi", "Kremalı Bisküvi", "Çikolatalı Bisküvi", "Tuzlu Bisküvi", "Yulaflı Bisküvi", "Kepekli Bisküvi", "Çay Bisküvisi", "Sandviç Bisküvi", "Tam Buğday Bisküvi"]],
    "kraker-cips": ["snack", 180, "snack", ["Tuzlu Kraker", "Çubuk Kraker", "Patates Cipsi (Sade)", "Patates Cipsi (Baharatlı)", "Mısır Cipsi", "Simit Kraker", "Peynirli Kraker", "Susamlı Çubuk"]],
    "cikolata-sekerleme": ["snack", 320, "snack", ["Sütlü Çikolata", "Bitter Çikolata", "Fındıklı Çikolata", "Draje Çikolata", "Meyveli Şeker", "Nane Şekeri", "Jelibon", "Lolipop", "Çikolatalı Gofret", "Kokolin"]],
    "lokum-helva": ["jar", 240, "snack", ["Fındıklı Lokum", "Fıstıklı Lokum", "Sade Lokum", "Güllü Lokum", "Tahin Helvası (Sade)", "Kakaolu Tahin Helvası", "Fıstıklı Helva", "Cezerye", "Pişmaniye", "Pestil & Köme"]],
  },
  "sos-hazir": {
    hue: 5,
    sos: ["bottle", 90, "sauce", ["Ketçap", "Mayonez", "Hardal", "Acı Sos", "Barbekü Sos", "Soya Sosu", "Ranch Sos", "Köfte Sosu", "Pizza Sosu", "Sarımsaklı Mayonez", "Ketçap (Acılı)", "Tatlı Ekşi Sos", "Teriyaki Sos"]],
    "corba-bulyon": ["pack", 140, "sauce", ["Tavuk Bulyon", "Et Bulyon", "Sebze Bulyon", "Mercimek Çorbası (Hazır)", "Tarhana", "Domates Çorbası (Hazır)", "Ezogelin Çorbası (Hazır)", "Mantar Çorbası (Hazır)"]],
    "hazir-yemek": ["can", 120, "sauce", ["Kuru Fasulye (Hazır)", "Nohut Yemeği (Hazır)", "Patlıcan Musakka (Hazır)", "Yaprak Sarma (Konserve)", "Fasulye Pilaki (Hazır)"]],
    "pasta-malzeme": ["pack350", 160, "sauce", ["Kakao", "Vanilin", "Kabartma Tozu", "Puding (Sütlü)", "Krem Şanti", "Kuvertür Çikolata", "Jöle (Çilek)", "Hindistan Cevizi (Rendelenmiş)", "Nişasta (Mısır)", "Nişasta (Buğday)", "Toz Tarçın (Paket)"]],
  },
  "seker-tatlandirici": {
    hue: 330,
    "toz-seker": ["bulk", 38, "sugar", ["Toz Şeker", "Kristal Toz Şeker", "İnce Toz Şeker", "Esmer Şeker"]],
    "kup-seker": ["bulk", 45, "sugar", ["Küp Şeker", "Küp Şeker (Küçük)", "Esmer Küp Şeker", "Tek Sargılı Küp Şeker"]],
    "ozel-seker": ["bulkSmall", 120, "sugar", ["Pudra Şekeri", "Kahverengi Şeker (Demerara)", "Stevia Tatlandırıcı", "Glikoz Şurubu", "Vanilyalı Şeker", "Akçaağaç Şurubu", "Agave Şurubu"]],
  },
  "ambalaj-sarf": {
    hue: 215,
    "poset-torba": ["sarf", 2.5, "sarf", ["Market Poşeti (Küçük)", "Market Poşeti (Orta)", "Market Poşeti (Büyük)", "Kağıt Kese (Kraft)", "Buzdolabı Poşeti", "Çöp Torbası (Orta)", "Çöp Torbası (Jumbo)", "Vakum Poşeti"]],
    "kagit-urun": ["sarfBig", 3, "sarf", ["Peçete (Servis)", "Kağıt Havlu", "Yağlı Kağıt", "Alüminyum Folyo", "Streç Film", "Pişirme Kağıdı", "Kraft Ambalaj Kağıdı"]],
    servis: ["sarf", 4, "sarf", ["Karton Bardak 7 oz", "Karton Bardak 12 oz", "Plastik Çatal", "Plastik Kaşık", "Tahta Karıştırıcı", "Sızdırmaz Kap 500 ml", "Pizza Kutusu 33 cm", "Alüminyum Kap (Orta)"]],
  },
};

const SPEC_ORIGIN = ["Türkiye", "Türkiye", "Türkiye", "İthal"];
const SHELF = ["12 ay", "18 ay", "24 ay", "36 ay"];
const STORAGE = ["Serin ve kuru yerde saklayınız", "Doğrudan güneş ışığından uzak tutunuz", "Açıldıktan sonra ağzı kapalı saklayınız"];

const SHORTS = [
  "Günlük kullanım için güvenilir kalite.",
  "Toplu alımda avantajlı fiyat.",
  "Restoran ve kafelerin tercihi.",
  "Taze parti, hızlı sevkiyat.",
  "Standart kalite, istikrarlı tedarik.",
  "Seçilmiş hammadde, özenli paketleme.",
];

const products = [];
const usedSlug = new Set();
let n = 0;
const now = new Date("2026-11-16T00:00:00Z").getTime();

for (const [catSlug, subs] of Object.entries(SOURCE)) {
  const hue = subs.hue;
  for (const [subSlug, def] of Object.entries(subs)) {
    if (subSlug === "hue") continue;
    const [tplKey, ppk, brandKey, names] = def;
    for (const baseName of names) {
      const pool = BRANDS[brandKey];
      const brandCount = rnd() < 0.5 ? 2 : 1;
      const brands = [...new Set([pick(pool), pick(pool)])].slice(0, brandCount);
      for (const brand of brands) {
        n += 1;
        let slug = slugify(`${baseName} ${brand === brands[0] ? "" : brand}`);
        if (usedSlug.has(slug)) slug = slugify(`${baseName} ${brand}`);
        if (usedSlug.has(slug)) slug = `${slug}-${n}`;
        usedSlug.add(slug);

        const tpl = TPL[tplKey];
        const basePpk = ppk * between(0.85, 1.2);
        const popularity = Math.round(between(5, 100));
        const daysAgo = Math.floor(between(0, 540));
        const createdAt = new Date(now - daysAgo * 86400000).toISOString().slice(0, 10);
        const discounted = rnd() < 0.1;
        const code = slug.toUpperCase().replace(/-/g, "").slice(0, 10);
        const variants = tpl.map(([label, amount, unit, mult, caseQty], i) => {
          const perUnit = unit === "adet" ? basePpk : basePpk / 1000;
          let price = round(perUnit * amount * mult);
          if (price < 10) price = round(price + 5);
          const v = {
            id: slugify(label),
            label,
            sku: `YVZ-${code}-${i + 1}`,
            price,
            amount,
            amountUnit: unit,
            inStock: rnd() > 0.06,
          };
          if (discounted) v.oldPrice = round(price * between(1.1, 1.25));
          if (caseQty) v.caseQty = caseQty;
          return v;
        });

        const tags = [];
        if (popularity > 86) tags.push("cok-satan");
        if (daysAgo < 45) tags.push("yeni");
        if (discounted) tags.push("indirim");
        if (rnd() < 0.55 && brandKey !== "sarf") tags.push("yerli");
        if (rnd() < 0.08 && ["bulk", "nuts", "oil", "breakfast"].includes(brandKey)) tags.push("organik");
        if (["bulk", "nuts", "oil"].includes(brandKey) && rnd() < 0.25) tags.push("glutensiz");

        products.push({
          slug,
          name: baseName,
          brand,
          category: catSlug,
          subcategory: subSlug,
          short: pick(SHORTS),
          description: `${baseName}, ${brand} kalitesiyle; ${tpl[0][0]} ambalajdan ${tpl[tpl.length - 1][0]} ambalaja kadar farklı boylarda. Market, restoran, kafe ve toplu tüketim noktaları için istikrarlı tedarik ve toplu alımda kademeli fiyat.`,
          tags,
          variants,
          specs: [
            { label: "Marka", value: brand },
            { label: "Menşei", value: pick(SPEC_ORIGIN) },
            { label: "Raf ömrü", value: pick(SHELF) },
            { label: "Saklama", value: pick(STORAGE) },
          ],
          hue: Math.round(hue + between(-8, 8)),
          popularity,
          createdAt,
        });
      }
    }
  }
}

const index = products.map((p) => ({
  slug: p.slug,
  name: p.name,
  brand: p.brand,
  category: p.category,
  subcategory: p.subcategory,
  tags: p.tags,
  variants: p.variants.map((v) => ({
    id: v.id,
    label: v.label,
    sku: v.sku,
    price: v.price,
    ...(v.oldPrice ? { oldPrice: v.oldPrice } : {}),
    amount: v.amount,
    amountUnit: v.amountUnit,
    inStock: v.inStock,
    ...(v.caseQty ? { caseQty: v.caseQty } : {}),
  })),
  hue: p.hue,
  popularity: p.popularity,
  createdAt: p.createdAt,
}));

mkdirSync(join(root, "src/data"), { recursive: true });
writeFileSync(join(root, "src/data/catalog.json"), JSON.stringify(products));
writeFileSync(join(root, "src/data/catalog-index.json"), JSON.stringify(index));
const perCat = {};
for (const p of products) perCat[p.category] = (perCat[p.category] ?? 0) + 1;
console.log(`${products.length} ürün üretildi`, perCat);
