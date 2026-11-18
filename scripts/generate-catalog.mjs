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

/* Varyant şablonları: [etiket, miktar, birim, çarpan(kg/L başı fiyata göre), koli adedi] */
const TPL = {
  coffee: [["250 g", 250, "g", 1.12, 20], ["1 kg", 1000, "g", 1, 6], ["6 × 1 kg koli", 6000, "g", 0.93]],
  coffeeBig: [["1 kg", 1000, "g", 1, 6], ["6 × 1 kg koli", 6000, "g", 0.93]],
  capsule: [["10'lu kutu", 10, "adet", 1, 12], ["100'lü koli", 100, "adet", 0.9]],
  syrup: [["700 ml", 700, "ml", 1, 6], ["1 L pompalı", 1000, "ml", 0.95, 6], ["6'lı koli", 6000, "ml", 0.88]],
  sauce: [["1 kg sıkma şişe", 1000, "g", 1, 6], ["2,5 kg kova", 2500, "g", 0.9]],
  puree: [["1 L pompalı", 1000, "ml", 1, 6], ["6'lı koli", 6000, "ml", 0.9]],
  teaLoose: [["250 g", 250, "g", 1.1, 12], ["1 kg", 1000, "g", 1, 6], ["5 kg", 5000, "g", 0.92]],
  teaBag: [["20'li kutu", 40, "g", 1.2, 12], ["100'lü kutu", 200, "g", 1, 6], ["Demlik poşet 48'li", 480, "g", 0.95]],
  powder: [["1 kg", 1000, "g", 1, 10], ["5 kg", 5000, "g", 0.92], ["10 × 1 kg koli", 10000, "g", 0.9]],
  milk: [["1 L", 1000, "ml", 1, 12], ["12'li koli", 12000, "ml", 0.93]],
  cream: [["1 L", 1000, "ml", 1, 12], ["5 L", 5000, "ml", 0.93]],
  can330: [["330 ml", 330, "ml", 1.15, 24], ["24'lü koli", 7920, "ml", 1]],
  bottle500: [["500 ml", 500, "ml", 1.1, 12], ["12'li koli", 6000, "ml", 1]],
  water: [["6'lı paket", 3000, "ml", 1], ["Palet (84 paket)", 252000, "ml", 0.85]],
  bulk: [["1 kg", 1000, "g", 1, 12], ["5 kg", 5000, "g", 0.93], ["25 kg çuval", 25000, "g", 0.86]],
  pouch: [["500 g", 500, "g", 1.08, 20], ["1 kg", 1000, "g", 1, 12], ["5 kg", 5000, "g", 0.92]],
  snack: [["Tekli", 1, "adet", 1.2, 24], ["24'lü koli", 24, "adet", 1]],
  frozen: [["Koli (40 adet)", 40, "adet", 1], ["Palet (12 koli)", 480, "adet", 0.9]],
  tool: [["Adet", 1, "adet", 1]],
  paper: [["100'lü paket", 100, "adet", 1, 20], ["1000'lü koli", 1000, "adet", 0.85]],
  cups: [["50'li paket", 50, "adet", 1, 20], ["1000'lü koli", 1000, "adet", 0.86]],
  cleaner: [["1 L", 1000, "ml", 1, 12], ["5 L", 5000, "ml", 0.9]],
  cleanerPowder: [["900 g", 900, "g", 1, 12], ["3 kg", 3000, "g", 0.92]],
  stick: [["500'lü kutu", 500, "adet", 1, 10], ["5000'li koli", 5000, "adet", 0.88]],
  portion: [["100'lü kutu", 100, "adet", 1, 12], ["1000'li koli", 1000, "adet", 0.88]],
};

/* Marka havuzları (yer tutucu) */
const BRANDS = {
  coffee: ["Yavuz Roastery", "Roast Lab", "Nordic Bean", "Anatolia Coffee"],
  syrup: ["Yavuz Barista", "Sweet Cup", "Flavoria", "Roast Lab"],
  tea: ["Tea House", "Yavuz Barista", "Çaykent", "Herbal Garden"],
  powder: ["Yavuz Barista", "Sweet Cup", "Choco Nova", "Flavoria"],
  milk: ["Milkhouse", "Oatly Style", "Barista Blend", "Yavuz Barista"],
  cold: ["Sipp", "Fizzco", "Mevsim", "Pınar Su"],
  pastry: ["Patisse", "Choco Nova", "Yavuz Barista", "Harman"],
  snack: ["Patisse", "Kıtır", "Bake House", "Sweet Cup"],
  tool: ["Bar Sense", "Barista Pro", "Brew Craft"],
  pack: ["PackCup", "Yavuz Barista", "Servis Pro"],
  clean: ["Clean Bar", "Barista Pro", "Hijyen Plus"],
  sugar: ["Sweet Cup", "Yavuz Barista", "Şekerpare"],
};

/* Katalog kaynağı: kategori → alt kategori → [şablon, kg/L/adet başı taban fiyat, marka havuzu, ürün adları] */
const SOURCE = {
  kahve: {
    hue: 25,
    "espresso-cekirdek": ["coffee", 900, "coffee", ["Espresso Daily Blend", "Espresso Intenso", "Espresso Crema", "Espresso Reserve", "Espresso Bar Blend", "Espresso Dark Roast", "Espresso %100 Arabica", "Espresso Robusta Blend", "Espresso Decaf", "Espresso House Blend"]],
    "tek-orijin": ["coffee", 1250, "coffee", ["Colombia Supremo", "Brazil Santos", "Ethiopia Yirgacheffe", "Guatemala Antigua", "Kenya AA", "Costa Rica Tarrazu", "Honduras SHG", "Peru Organic", "Sumatra Mandheling", "Rwanda Bourbon"]],
    "filtre-kahve": ["coffee", 850, "coffee", ["Filtre Kahve (Öğütülmüş)", "Filtre Kahve Çekirdek", "French Press Öğütüm", "V60 Öğütüm", "Cold Brew Öğütüm", "Filtre Kahve Decaf", "Breakfast Blend"]],
    "turk-kahvesi": ["pouch", 700, "coffee", ["Türk Kahvesi", "Dibek Kahvesi", "Damla Sakızlı Türk Kahvesi", "Menengiç Kahvesi", "Osmanlı Kahvesi", "Kakuleli Türk Kahvesi"]],
    "kapsul-pod": ["capsule", 14, "coffee", ["Espresso Kapsül Intenso", "Espresso Kapsül Lungo", "Espresso Kapsül Decaf", "Espresso Kapsül Ristretto", "ESE Pod Espresso", "Kapsül Vanilya Aromalı"]],
    "hazir-kahve": ["powder", 650, "coffee", ["Hazır Granül Kahve", "Cold Brew Konsantre", "Hazır Kahve Gold", "3'ü 1 Arada Kahve", "Kafeinsiz Hazır Kahve", "Cold Brew Şişe 250 ml"]],
  },
  "surup-sos": {
    hue: 345,
    "aroma-surubu": ["syrup", 480, "syrup", ["Vanilya Şurubu", "Karamel Şurubu", "Fındık Şurubu", "Tuzlu Karamel Şurubu", "Beyaz Çikolata Şurubu", "Çilek Şurubu", "Mango Şurubu", "Şeftali Şurubu", "Mojito Şurubu", "Cool Lime Şurubu", "Yeşil Elma Şurubu", "Nane Şurubu", "Irish Cream Şurubu", "Cookies Şurubu", "Chai Tea Şurubu", "Damla Sakızı Şurubu", "Muz Şurubu", "Vişne Şurubu", "Lavanta Şurubu", "Karpuz Şurubu", "Badem Şurubu", "Hindistan Cevizi Şurubu", "Zencefil Şurubu", "Böğürtlen Şurubu"]],
    "sekersiz-surup": ["syrup", 560, "syrup", ["Şekersiz Vanilya Şurubu", "Şekersiz Karamel Şurubu", "Şekersiz Fındık Şurubu", "Şekersiz Çikolata Şurubu", "Şekersiz Tuzlu Karamel Şurubu", "Şekersiz Mocha Şurubu"]],
    "dekor-sos": ["sauce", 360, "syrup", ["Çikolata Dekor Sos", "Karamel Dekor Sos", "Beyaz Çikolata Dekor Sos", "Çilek Dekor Sos", "Fındık Dekor Sos", "Krema Sos Karamel 2,5 kg", "Mocha Sos"]],
    "meyve-puresi": ["puree", 520, "syrup", ["Çilek Püresi", "Mango Püresi", "Şeftali Püresi", "Vişne Püresi", "Orman Meyveleri Püresi", "Muz Püresi", "Yeşil Elma Püresi", "Karpuz Püresi", "Ananas Püresi", "Maracuja Püresi", "Kivi Püresi", "Limon Püresi"]],
    "kokteyl-bazi": ["puree", 420, "syrup", ["Limonata Bazı", "Mojito Bazı", "Sangria Bazı", "Pina Colada Bazı", "Ice Tea Şeftali Bazı", "Ice Tea Limon Bazı", "Frozen Çilek Bazı"]],
  },
  cay: {
    hue: 135,
    "siyah-cay": ["teaLoose", 320, "tea", ["Rize Çayı (Tomurcuk)", "Rize Çayı (Filiz)", "Dökme Siyah Çay", "Earl Grey", "Seylan Çayı", "English Breakfast", "Kokulu Çay", "Assam Çayı"]],
    "yesil-cay": ["teaLoose", 520, "tea", ["Yeşil Çay", "Yasemin Yeşil Çay", "Matcha Tozu", "Matcha Latte Karışımı", "Sencha", "Gunpowder Yeşil Çay", "Beyaz Çay"]],
    "bitki-cayi": ["teaLoose", 420, "tea", ["Ihlamur", "Papatya", "Nane Limon", "Adaçayı", "Rezene", "Melisa", "Kış Çayı", "Zencefil Limon", "Kuşburnu", "Hibiskus", "Rooibos", "Ekinezya"]],
    "meyve-cayi": ["teaLoose", 360, "tea", ["Elma Çayı", "Orman Meyveli Çay", "Böğürtlen Çayı", "Portakal Tarçın Çayı", "Nar Çayı", "Karadut Çayı", "Mango Çayı", "Vişne Çayı"]],
    "poset-cay": ["teaBag", 480, "tea", ["Siyah Çay Poşet", "Yeşil Çay Poşet", "Earl Grey Poşet", "Papatya Poşet", "Nane Limon Poşet", "Kuşburnu Poşet", "Ihlamur Poşet", "Kış Çayı Poşet", "Demlik Poşet Siyah Çay", "Demlik Poşet Earl Grey"]],
  },
  "sicak-icecek-tozlari": {
    hue: 15,
    "sicak-cikolata": ["powder", 420, "powder", ["Hot Chocolate Classic", "Hot Chocolate Premium", "Beyaz Sıcak Çikolata", "Bitter Sıcak Çikolata", "Fındıklı Sıcak Çikolata", "Karamelli Sıcak Çikolata", "Sıcak Çikolata Vegan"]],
    salep: ["powder", 380, "powder", ["Salep Classic", "Salep Premium", "Damla Sakızlı Salep", "Çikolatalı Salep", "Fındıklı Salep", "Tarçınlı Salep"]],
    "frappe-milkshake": ["powder", 360, "powder", ["Frappe Tozu Vanilya", "Frappe Tozu Çikolata", "Frappe Tozu Karamel", "Milkshake Tozu Vanilya", "Milkshake Tozu Çilek", "Milkshake Tozu Çikolata", "Frappe Bazı Mocha", "Frappe Tozu Cookies", "Frappe Tozu Beyaz Çikolata"]],
    "chai-latte": ["powder", 440, "powder", ["Chai Latte Tozu", "Zerdeçal Latte (Golden Milk)", "Matcha Latte Tozu", "Pumpkin Spice Latte Tozu", "Taro Latte Tozu", "Red Velvet Latte Tozu", "Lotus Latte Tozu"]],
    smoothie: ["powder", 390, "powder", ["Smoothie Bazı Çilek", "Smoothie Bazı Mango", "Smoothie Bazı Yeşil", "Smoothie Bazı Orman Meyveleri", "Açaí Bazı", "Protein Smoothie Bazı"]],
  },
  "sut-krema": {
    hue: 215,
    "barista-sut": ["milk", 48, "milk", ["Barista Süt %3,5", "Barista Süt Laktozsuz", "Barista Süt %1,5", "UHT Tam Yağlı Süt", "UHT Yarım Yağlı Süt", "Keçi Sütü UHT"]],
    "bitkisel-sut": ["milk", 95, "milk", ["Yulaf Sütü Barista", "Badem Sütü Barista", "Soya Sütü Barista", "Hindistan Cevizi Sütü", "Fındık Sütü", "Bezelye Sütü Barista", "Pirinç Sütü", "Yulaf Sütü Çikolatalı"]],
    krema: ["cream", 160, "milk", ["Krema %35", "Çırpma Kreması Bitkisel", "Çırpma Kreması Hayvansal", "Sprey Krema", "Pişirme Kreması %18", "Mascarpone 2 kg"]],
    kondanse: ["powder", 180, "milk", ["Kondanse Süt", "Süt Tozu Tam Yağlı", "Süt Tozu Yağsız", "Krema Tozu", "Dulce de Leche", "Kremşanti Tozu"]],
  },
  "soguk-icecek": {
    hue: 190,
    "soda-gazli": ["can330", 14, "cold", ["Soda Sade", "Soda Limonlu", "Tonik", "Gazoz", "Kola", "Kola Şekersiz", "Zencefilli Gazoz", "Portakallı Gazlı İçecek", "Premium Soda Şişe", "Elma Gazozu"]],
    "meyve-suyu": ["bottle500", 28, "cold", ["Portakal Suyu %100", "Vişne Nektarı", "Şeftali Nektarı", "Elma Suyu", "Nar Suyu", "Karışık Meyve Suyu", "Kayısı Nektarı", "Limonata Şişe", "Domates Suyu"]],
    "buzlu-cay": ["bottle500", 24, "cold", ["Buzlu Çay Şeftali", "Buzlu Çay Limon", "Buzlu Çay Mango", "Buzlu Çay Şekersiz", "Kombucha Zencefil", "Kombucha Orman Meyveli", "Yeşil Buzlu Çay"]],
    enerji: ["can330", 40, "cold", ["Enerji İçeceği", "Enerji İçeceği Şekersiz", "Enerji İçeceği Tropikal", "Enerji İçeceği Karpuz", "Spor İçeceği Limon"]],
    su: ["water", 9, "cold", ["Doğal Kaynak Suyu 500 ml", "Doğal Kaynak Suyu 330 ml Cam", "Doğal Kaynak Suyu 1,5 L", "Maden Suyu Sade", "Maden Suyu Limonlu", "Premium Cam Şişe Su 750 ml"]],
  },
  pastane: {
    hue: 40,
    kuvertur: ["pouch", 420, "pastry", ["Bitter Kuvertür %54", "Bitter Kuvertür %70", "Sütlü Kuvertür", "Beyaz Kuvertür", "Ruby Kuvertür", "Çikolata Damla", "Kakao Yağı", "Kaplama Çikolata Bitter"]],
    kakao: ["pouch", 380, "pastry", ["Kakao Tozu %22", "Kakao Tozu Alkalize", "Karamel Tozu", "Vanilin", "Kabartma Tozu", "Toz Şeker Pudra", "Nişasta Vanilyalı Puding", "Jöle Tozu Çilek"]],
    "un-nisasta": ["bulk", 55, "pastry", ["Pastalık Un", "Baklavalık Un", "Tam Buğday Unu", "Badem Unu", "Mısır Nişastası", "Pirinç Unu", "Glutensiz Un Karışımı", "Fındık Unu"]],
    "dolgu-krema": ["pouch", 260, "pastry", ["Fındık Kreması Dolgu", "Krema Şanti Tozu", "Pastacı Kreması Tozu", "Çilek Dolgu", "Karamel Dolgu", "Limon Kremi", "Cheesecake Bazı", "Tiramisu Bazı"]],
    susleme: ["pouch", 350, "pastry", ["Renkli Şeker Serpme", "Çikolata Parçacıkları", "Hindistan Cevizi Rende", "Fındık Kırığı", "Antep Fıstığı Kırığı", "Vanilya Aroması", "Badem File", "Yenilebilir Yaprak Altın 5'li"]],
  },
  atistirmalik: {
    hue: 20,
    kurabiye: ["snack", 28, "snack", ["Çikolatalı Kurabiye", "Yulaflı Kurabiye", "Fındıklı Kurabiye", "Biscotti Badem", "Un Kurabiyesi", "Tarçınlı Kurabiye", "Tuzlu Kurabiye", "Cookie Dough Dondurulmuş"]],
    "kek-brownie": ["snack", 38, "snack", ["Brownie", "Havuçlu Kek Dilim", "Limonlu Kek Dilim", "Muffin Çikolatalı", "Muffin Yaban Mersinli", "Banana Bread Dilim", "Cheesecake Dilim Dondurulmuş", "Red Velvet Dilim"]],
    "donuk-hamur": ["frozen", 18, "snack", ["Tereyağlı Kruvasan", "Çikolatalı Kruvasan", "Pain au Raisin", "Poğaça Peynirli", "Simit Dondurulmuş", "Açma", "Danish Elmalı", "Cinnamon Roll"]],
    "granola-bar": ["snack", 32, "snack", ["Granola Bal & Badem", "Granola Kakao", "Protein Bar Fıstık", "Hurma Bar", "Yulaf Bar Çikolatalı", "Müsli Porsiyon"]],
    cikolata: ["snack", 22, "snack", ["Madlen Çikolata", "Çikolata Bar Sütlü", "Çikolata Bar Bitter", "Draje Kahve Çekirdeği", "Napoliten Çikolata", "Trüf Çikolata"]],
  },
  "barista-ekipman": {
    hue: 215,
    "espresso-araclari": ["tool", 650, "tool", ["Tamper 58 mm", "Tamper 53 mm", "Distribütör 58 mm", "Dozaj Hunisi", "Knock Box", "Tamper Matı", "Portafiltre Sepeti 18 g", "Shot Bardağı 70 ml", "Barista Terazisi 0,1 g", "Zamanlayıcı"]],
    "sut-pitcher": ["tool", 380, "tool", ["Süt Pitcher 350 ml", "Süt Pitcher 600 ml", "Süt Pitcher 1 L", "Latte Art Kalemi", "Süt Termometresi", "Latte Art Şablon Seti", "Pitcher Siyah Teflon 600 ml"]],
    demleme: ["tool", 520, "tool", ["V60 Dripper 02", "V60 Sürahi 600 ml", "Chemex 6 Cup", "French Press 1 L", "Aeropress", "Cold Brew Sürahi 1,5 L", "Gooseneck Kettle 1 L", "Moka Pot 6 Cup", "Sifon Kahve Seti"]],
    "filtre-kagidi": ["paper", 1.2, "tool", ["V60 Filtre Kağıdı 02", "Chemex Filtre Kağıdı", "Aeropress Filtre Kağıdı", "Kalita Filtre Kağıdı 185", "Filtre Kahve Makinesi Kağıdı 1×4", "Cold Brew Filtre Torbası"]],
    "bar-araclari": ["tool", 240, "tool", ["Shaker 700 ml", "Bar Kaşığı", "Jigger 30/60 ml", "Muddler", "Buz Maşası", "Buz Kalıbı Küp", "Blender Sürahisi 2 L", "Pompa Şurup 10 ml", "Sos Sıkma Şişesi", "Süzgeç Strainer"]],
  },
  "servis-ambalaj": {
    hue: 35,
    "karton-bardak": ["cups", 1.6, "pack", ["Karton Bardak 4 oz", "Karton Bardak 7 oz", "Karton Bardak 8 oz", "Karton Bardak 12 oz", "Karton Bardak 16 oz", "Çift Katmanlı Bardak 8 oz", "Çift Katmanlı Bardak 12 oz", "Kraft Bardak 12 oz", "Bardak Kılıfı 12-16 oz"]],
    "kapak-pipet": ["cups", 0.9, "pack", ["Bardak Kapağı 8 oz", "Bardak Kapağı 12-16 oz", "Kubbe Kapak 12-16 oz", "Kağıt Pipet", "Kağıt Pipet Kalın", "Tahta Karıştırıcı", "Plastik Pipet Boba", "Kapak Tıpası"]],
    "soguk-bardak": ["cups", 2.4, "pack", ["PET Bardak 12 oz", "PET Bardak 16 oz", "PET Bardak 20 oz", "PP Bardak 400 ml", "Kubbe Kapaklı Frappe Bardağı", "Cam Görünümlü Bardak 350 ml"]],
    "take-away": ["cups", 3.5, "pack", ["Kraft Kutu Küçük", "Kraft Kutu Orta", "Pasta Kutusu Tekli", "Sandviç Kutusu", "Bardak Taşıyıcı 2'li", "Bardak Taşıyıcı 4'lü", "Kraft Poşet Küçük", "Kraft Poşet Büyük", "Burger Kutusu"]],
    "pecete-servis": ["paper", 0.6, "pack", ["Servis Peçetesi 30×30", "Dispenser Peçete", "Kokteyl Peçetesi", "Tahta Çatal", "Tahta Kaşık", "Tahta Bıçak", "Yağlı Kağıt", "Kahve Altlığı Karton", "Islak Mendil Tekli"]],
  },
  temizlik: {
    hue: 175,
    "makine-temizlik": ["cleanerPowder", 650, "clean", ["Espresso Makinesi Temizleme Tozu", "Grup Kafa Temizleme Tableti", "Değirmen Temizleme Tableti", "Süt Sistemi Temizleyici", "Filtre Kahve Makinesi Temizleyici", "Kör Filtre"]],
    "kirec-cozucu": ["cleaner", 180, "clean", ["Kireç Çözücü Sıvı", "Kireç Çözücü Toz", "Su Filtresi Kartuşu", "Kettle Kireç Çözücü", "Buhar Kazanı Kireç Çözücü"]],
    "genel-hijyen": ["cleaner", 60, "clean", ["Yüzey Dezenfektanı", "Bulaşık Deterjanı", "Cam Temizleyici", "El Sabunu Antibakteriyel", "Nitril Eldiven 100'lü", "Mikrofiber Bez 5'li", "Çöp Poşeti Jumbo", "Bar Havlusu"]],
  },
  "seker-cesni": {
    hue: 330,
    "stick-seker": ["stick", 0.25, "sugar", ["Stick Şeker Beyaz 4 g", "Stick Şeker Esmer 4 g", "Küp Şeker Tek Sargılı", "Stick Şeker Logolu", "Kahverengi Şeker Stick 5 g"]],
    tatlandirici: ["portion", 0.6, "sugar", ["Tatlandırıcı Stick Stevia", "Tatlandırıcı Tablet", "Tatlandırıcı Stick Sukraloz", "Hindistan Cevizi Şekeri Stick", "Bal Stick 8 g"]],
    serpme: ["pouch", 360, "sugar", ["Tarçın Toz", "Kakao Serpme", "Çikolata Rende", "Zencefil Toz", "Kakule Toz", "Muskat Toz", "Vanilya Şekeri", "Kahve Tuzu Karamel"]],
    "bal-recel": ["portion", 2.8, "sugar", ["Bal Porsiyon 20 g", "Reçel Porsiyon Çilek 20 g", "Reçel Porsiyon Kayısı 20 g", "Fındık Kreması Porsiyon 15 g", "Tereyağı Porsiyon 10 g", "Pekmez Porsiyon 20 g"]],
  },
};

/* Şablon → ambalaj görseli tipi */
const ART = { coffee: "pouch", coffeeBig: "pouch", capsule: "box", syrup: "bottle", sauce: "bottle", puree: "bottle", teaLoose: "pouch", teaBag: "box", powder: "can", milk: "carton", cream: "carton", can330: "can", bottle500: "bottle", water: "bottle", bulk: "sack", pouch: "pouch", snack: "box", frozen: "box", tool: "box", paper: "box", cups: "box", cleaner: "bottle", cleanerPowder: "can", stick: "box", portion: "box" };

const SPEC_ORIGIN = ["Türkiye", "Türkiye", "İtalya", "İthal"];
const SHELF = ["12 ay", "18 ay", "24 ay", "36 ay"];
const STORAGE = ["Serin ve kuru yerde saklayınız", "Doğrudan güneş ışığından uzak tutunuz", "Açıldıktan sonra ağzı kapalı saklayınız"];

const SHORTS = [
  "Kafe barının vazgeçilmezi.",
  "Barista testinden geçmiş kalite.",
  "Toplu alımda avantajlı fiyat.",
  "Taze parti, aynı gün kargo.",
  "Zincir kafelerin tercihi.",
  "İstikrarlı tat, istikrarlı tedarik.",
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
      const brandCount = rnd() < 0.58 ? 2 : 1;
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
        if (rnd() < 0.5 && !["tool", "pack", "clean"].includes(brandKey)) tags.push("yerli");
        if (rnd() < 0.1 && ["coffee", "tea", "milk", "pastry"].includes(brandKey)) tags.push("organik");
        if (["coffee", "tea", "syrup", "milk"].includes(brandKey) && rnd() < 0.2) tags.push("glutensiz");
        if (["milk"].includes(brandKey) && baseName.match(/Yulaf|Badem|Soya|Hindistan|Fındık|Bezelye|Pirinç/) ) tags.push("vegan");

        const rating = Math.round((3.9 + (popularity / 100) * 1.0 + between(-0.15, 0.15)) * 10) / 10;
        const reviews = Math.round(popularity * between(0.4, 3.5));
        const sold = Math.round(popularity * between(3, 30));

        products.push({
          slug,
          name: baseName,
          brand,
          art: ART[tplKey] ?? "box",
          rating: Math.min(5, rating),
          reviews,
          sold,
          category: catSlug,
          subcategory: subSlug,
          short: pick(SHORTS),
          description: `${baseName}, ${brand} kalitesiyle; ${tpl[0][0]} ambalajdan ${tpl[tpl.length - 1][0]} ambalaja kadar farklı boylarda. Kafe, restoran, otel ve ofisler için istikrarlı tedarik, toplu alımda kademeli fiyat.`,
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
  art: p.art,
  rating: p.rating,
  reviews: p.reviews,
  sold: p.sold,
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
