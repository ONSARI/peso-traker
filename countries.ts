export interface Country {
  name: string;
  dial_code: string;
  code: string;
  flag: string;
}

// Static data for countries, name will be populated from translations
const countryData: Omit<Country, 'name'>[] = [
  { dial_code: '+34', code: 'ES', flag: '🇪🇸' },
  { dial_code: '+52', code: 'MX', flag: '🇲🇽' },
  { dial_code: '+54', code: 'AR', flag: '🇦🇷' },
  { dial_code: '+57', code: 'CO', flag: '🇨🇴' },
  { dial_code: '+1', code: 'US', flag: '🇺🇸' },
  { dial_code: '+55', code: 'BR', flag: '🇧🇷' },
  { dial_code: '+44', code: 'GB', flag: '🇬🇧' },
  { dial_code: '+33', code: 'FR', flag: '🇫🇷' },
  { dial_code: '+49', code: 'DE', flag: '🇩🇪' },
  { dial_code: '+39', code: 'IT', flag: '🇮🇹' },
  { dial_code: '+351', code: 'PT', flag: '🇵🇹' },
  { dial_code: '+56', code: 'CL', flag: '🇨🇱' },
  { dial_code: '+51', code: 'PE', flag: '🇵🇪' },
  { dial_code: '+58', code: 'VE', flag: '🇻🇪' },
  { dial_code: '+593', code: 'EC', flag: '🇪🇨' },
  { dial_code: '+591', code: 'BO', flag: '🇧🇴' },
  { dial_code: '+595', code: 'PY', flag: '🇵🇾' },
  { dial_code: '+598', code: 'UY', flag: '🇺🇾' },
  { dial_code: '+53', code: 'CU', flag: '🇨🇺' },
  { dial_code: '+1', code: 'DO', flag: '🇩🇴' },
  { dial_code: '+504', code: 'HN', flag: '🇭🇳' },
  { dial_code: '+505', code: 'NI', flag: '🇳🇮' },
  { dial_code: '+503', code: 'SV', flag: '🇸🇻' },
  { dial_code: '+506', code: 'CR', flag: '🇨🇷' },
  { dial_code: '+507', code: 'PA', flag: '🇵🇦' },
  { dial_code: '+502', code: 'GT', flag: '🇬🇹' },
  { dial_code: '+1', code: 'CA', flag: '🇨🇦' },
];

// Translations for country names
// Keys are country codes (e.g., 'ES'), values are objects with language codes (e.g., 'en')
const translatedNames: Record<string, Record<string, string>> = {
    ES: { en: "Spain", es: "España", fr: "Espagne", de: "Spanien", pt: "Espanha", ru: "Испания", zh: "西班牙", ar: "إسبانيا", hi: "स्पेन", bn: "স্পেন", it: "Spagna", id: "Spanyol", tr: "İspanya", ja: "スペイン", yo: "Spéìnì", ur: "ہسپانیہ", fa: "اسپانیا", he: "ספרד" },
    MX: { en: "Mexico", es: "México", fr: "Mexique", de: "Mexiko", pt: "México", ru: "Мексика", zh: "墨西哥", ar: "المكسيك", hi: "मेक्सिको", bn: "মেক্সিকো", it: "Messico", id: "Meksiko", tr: "Meksika", ja: "メキシコ", yo: "Mẹ́síkò", ur: "میکسیکو", fa: "مکزیک", he: "מקסיקו" },
    AR: { en: "Argentina", es: "Argentina", fr: "Argentine", de: "Argentinien", pt: "Argentina", ru: "Аргентина", zh: "阿根廷", ar: "الأرجنتين", hi: "अर्जेंटीना", bn: "আর্জেন্টিনা", it: "Argentina", id: "Argentina", tr: "Arjantin", ja: "アルゼンチン", yo: "Agentínà", ur: "ارجنٹائن", fa: "آرژانتین", he: "ארגנטינה" },
    CO: { en: "Colombia", es: "Colombia", fr: "Colombie", de: "Kolumbien", pt: "Colômbia", ru: "Колумбия", zh: "哥伦比亚", ar: "كولومبيا", hi: "कोलंबिया", bn: "কলম্বিয়া", it: "Colombia", id: "Kolombia", tr: "Kolombiya", ja: "コロンビア", yo: "Kòlóḿbíà", ur: "کولمبیا", fa: "کلمبیا", he: "קולומביה" },
    US: { en: "United States", es: "Estados Unidos", fr: "États-Unis", de: "Vereinigte Staaten", pt: "Estados Unidos", ru: "Соединенные Штаты", zh: "美国", ar: "الولايات المتحدة", hi: "संयुक्त राज्य अमेरिका", bn: "যুক্তরাষ্ট্র", it: "Stati Uniti", id: "Amerika Serikat", tr: "Amerika Birleşik Devletleri", ja: "アメリカ合衆国", yo: "Orílẹ̀-èdè Amẹ́ríkà", ur: "ریاستہائے متحدہ", fa: "ایالات متحده آمریکا", he: "ארצות הברית" },
    BR: { en: "Brazil", es: "Brasil", fr: "Brésil", de: "Brasilien", pt: "Brasil", ru: "Бразилия", zh: "巴西", ar: "البرازيل", hi: "ब्राज़िल", bn: "ব্রাজিল", it: "Brasile", id: "Brasil", tr: "Brezilya", ja: "ブラジル", yo: "Brasil", ur: "برازیل", fa: "برزیل", he: "ברזיל" },
    GB: { en: "United Kingdom", es: "Reino Unido", fr: "Royaume-Uni", de: "Vereinigtes Königreich", pt: "Reino Unido", ru: "Великобритания", zh: "英国", ar: "المملكة المتحدة", hi: "यूनाइटेड किंगडम", bn: "যুক্তরাজ্য", it: "Regno Unito", id: "Britania Raya", tr: "Birleşik Krallık", ja: "イギリス", yo: "Ilẹ̀ọba Aṣọ̀kan", ur: "برطانیہ", fa: "بریتانیا", he: "הממלכה המאוחדת" },
    FR: { en: "France", es: "Francia", fr: "France", de: "Frankreich", pt: "França", ru: "Франция", zh: "法国", ar: "فرنسا", hi: "फ्रांस", bn: "ফ্রান্স", it: "Francia", id: "Prancis", tr: "Fransa", ja: "フランス", yo: "Fránsì", ur: "فرانس", fa: "فرانسه", he: "צרפת" },
    DE: { en: "Germany", es: "Alemania", fr: "Allemagne", de: "Deutschland", pt: "Alemanha", ru: "Германия", zh: "德国", ar: "ألمانيا", hi: "जर्मनी", bn: "জার্মানি", it: "Germania", id: "Jerman", tr: "Almanya", ja: "ドイツ", yo: "Jẹ́mánì", ur: "جرمنی", fa: "آلمان", he: "גרמניה" },
    IT: { en: "Italy", es: "Italia", fr: "Italie", de: "Italien", pt: "Itália", ru: "Италия", zh: "意大利", ar: "إيطاليا", hi: "इटली", bn: "ইতালি", it: "Italia", id: "Italia", tr: "İtalya", ja: "イタリア", yo: "Itálíà", ur: "اٹلی", fa: "ایتالیا", he: "איטליה" },
    PT: { en: "Portugal", es: "Portugal", fr: "Portugal", de: "Portugal", pt: "Portugal", ru: "Португалия", zh: "葡萄牙", ar: "البرتغال", hi: "पुर्तगाल", bn: "পর্তুগাল", it: "Portogallo", id: "Portugal", tr: "Portekiz", ja: "ポルトガル", yo: "Pọ́rtúgàl", ur: "پرتگال", fa: "پرتغال", he: "פורטוגל" },
    CL: { en: "Chile", es: "Chile", fr: "Chili", de: "Chile", pt: "Chile", ru: "Чили", zh: "智利", ar: "تشيلي", hi: "चिली", bn: "চিলি", it: "Cile", id: "Chili", tr: "Şili", ja: "チリ", yo: "Ṣílè", ur: "چلی", fa: "شیلی", he: "צ'ילה" },
    PE: { en: "Peru", es: "Perú", fr: "Pérou", de: "Peru", pt: "Peru", ru: "Перу", zh: "秘鲁", ar: "بيرو", hi: "पेरू", bn: "পেরু", it: "Perù", id: "Peru", tr: "Peru", ja: "ペルー", yo: "Perú", ur: "پیرو", fa: "پرو", he: "פרו" },
    VE: { en: "Venezuela", es: "Venezuela", fr: "Venezuela", de: "Venezuela", pt: "Venezuela", ru: "Венесуэла", zh: "委내瑞拉", ar: "فنزويلا", hi: "वेनेजुएला", bn: "ভেনেজুয়েলা", it: "Venezuela", id: "Venezuela", tr: "Venezuela", ja: "ベネズエラ", yo: "Benesuẹla", ur: "وینزویلا", fa: "ونزوئلا", he: "ונצואלה" },
    EC: { en: "Ecuador", es: "Ecuador", fr: "Équateur", de: "Ecuador", pt: "Equador", ru: "Эквадор", zh: "厄瓜多尔", ar: "الإكوادور", hi: "इक्वाडोर", bn: "ইকুয়েডর", it: "Ecuador", id: "Ekuador", tr: "Ekvador", ja: "エクアドル", yo: "Ekuador", ur: "ایکواڈور", fa: "اکوادور", he: "אקוודור" },
    BO: { en: "Bolivia", es: "Bolivia", fr: "Bolivie", de: "Bolivien", pt: "Bolívia", ru: "Боливия", zh: "玻利维亚", ar: "بوليفيا", hi: "बोलीविया", bn: "বলিভিয়া", it: "Bolivia", id: "Bolivia", tr: "Bolivya", ja: "ボリビア", yo: "Bòlífíà", ur: "بولیویا", fa: "بولیوی", he: "בוליביה" },
    PY: { en: "Paraguay", es: "Paraguay", fr: "Paraguay", de: "Paraguay", pt: "Paraguai", ru: "Парагвай", zh: "巴拉圭", ar: "باراغواي", hi: "पैराग्वे", bn: "প্যারাগুয়ে", it: "Paraguay", id: "Paraguay", tr: "Paraguay", ja: "パラグアイ", yo: "Paragúáì", ur: "پیراگوئے", fa: "پاراگوئه", he: "פרגוואי" },
    UY: { en: "Uruguay", es: "Uruguay", fr: "Uruguay", de: "Uruguay", pt: "Uruguai", ru: "Уругвай", zh: "乌拉圭", ar: "أوروغواي", hi: "उरुग्वे", bn: "উরুগুয়ে", it: "Uruguay", id: "Uruguay", tr: "Uruguay", ja: "ウルグアイ", yo: "Úrúgúáì", ur: "یوراگوئے", fa: "اروگوئه", he: "אורוגוואי" },
    CU: { en: "Cuba", es: "Cuba", fr: "Cuba", de: "Kuba", pt: "Cuba", ru: "Куба", zh: "古巴", ar: "كوبا", hi: "क्यूबा", bn: "কিউবা", it: "Cuba", id: "Kuba", tr: "Küba", ja: "キューバ", yo: "Kúbà", ur: "کیوبا", fa: "کوبا", he: "קובה" },
    DO: { en: "Dominican Republic", es: "República Dominicana", fr: "République dominicaine", de: "Dominikanische Republik", pt: "República Dominicana", ru: "Доминиканская Республика", zh: "多明尼加共和国", ar: "جمهورية الدومينيكان", hi: "डोमिनिकन गणराज्य", bn: "ডোমিনিকান প্রজাতন্ত্র", it: "Repubblica Dominicana", id: "Republik Dominika", tr: "Dominik Cumhuriyeti", ja: "ドミニカ共和国", yo: "Orílẹ̀-èdè Olómìnira Dómíníkánì", ur: "ڈومینیکن جمہوریہ", fa: "جمهوری دومینیکن", he: "הרפובליקה הדומיניקנית" },
    HN: { en: "Honduras", es: "Honduras", fr: "Honduras", de: "Honduras", pt: "Honduras", ru: "Гондурас", zh: "洪都拉斯", ar: "هندوراس", hi: "होंडुरास", bn: "হন্ডুরাস", it: "Honduras", id: "Honduras", tr: "Honduras", ja: "ホンジュラス", yo: "Honduras", ur: "ہونڈوراس", fa: "هندوراس", he: "הונדורס" },
    NI: { en: "Nicaragua", es: "Nicaragua", fr: "Nicaragua", de: "Nicaragua", pt: "Nicarágua", ru: "Никарагуа", zh: "尼加拉瓜", ar: "نيكاراغوا", hi: "निकारागुआ", bn: "নিকারাগুয়া", it: "Nicaragua", id: "Nikaragua", tr: "Nikaragua", ja: "ニカラグア", yo: "Nikaragua", ur: "نکاراگوا", fa: "نیکاراگوئه", he: "ניקרגואה" },
    SV: { en: "El Salvador", es: "El Salvador", fr: "Salvador", de: "El Salvador", pt: "El Salvador", ru: "Сальвадор", zh: "萨尔ва多", ar: "السلفادور", hi: "अल साल्वाडोर", bn: "এল সালভাদর", it: "El Salvador", id: "El Salvador", tr: "El Salvador", ja: "エルサルバドル", yo: "El Salvador", ur: "ایل سلواڈور", fa: "السالوادور", he: "אל סלוודור" },
    CR: { en: "Costa Rica", es: "Costa Rica", fr: "Costa Rica", de: "Costa Rica", pt: "Costa Rica", ru: "Коста-Рика", zh: "哥斯达黎加", ar: "كوستاريكا", hi: "कोस्टा रिका", bn: "কোস্টা রিকা", it: "Costa Rica", id: "Kosta Rika", tr: "Kosta Rika", ja: "コスタリカ", yo: "Kosta Rika", ur: "کوسٹا ریکا", fa: "کاستاریکا", he: "קוסטה ריקה" },
    PA: { en: "Panama", es: "Panamá", fr: "Panama", de: "Panama", pt: "Panamá", ru: "Панама", zh: "巴拿马", ar: "بنما", hi: "पनामा", bn: "পানামা", it: "Panama", id: "Panama", tr: "Panama", ja: "パナマ", yo: "Panama", ur: "پاناما", fa: "پاناما", he: "פנמה" },
    GT: { en: "Guatemala", es: "Guatemala", fr: "Guatemala", de: "Guatemala", pt: "Guatemala", ru: "Гватемала", zh: "危地马拉", ar: "غواتيمالا", hi: "ग्वाटेमाला", bn: "গুয়াতেমালা", it: "Guatemala", id: "Guatemala", tr: "Guatemala", ja: "グアテマラ", yo: "Guatemala", ur: "گواتیمالا", fa: "گواتمالا", he: "גואטמלה" },
    CA: { en: "Canada", es: "Canadá", fr: "Canada", de: "Kanada", pt: "Canadá", ru: "Канада", zh: "加拿大", ar: "كندا", hi: "कनाडा", bn: "কানাডা", it: "Canada", id: "Kanada", tr: "Kanada", ja: "カナダ", yo: "Kánádà", ur: "کینیڈا", fa: "کانادا", he: "קנדה" }
};


/**
 * Returns a list of countries with names translated to the specified language.
 * @param lang - The language code (e.g., 'en', 'es'). Falls back to 'en' if the language is not supported.
 * @returns An array of Country objects.
 */
export const getCountriesByLanguage = (lang: string): Country[] => {
  const supportedLanguages = Object.keys(translatedNames.US);
  const language = supportedLanguages.includes(lang) ? lang : 'en';

  return countryData.map(country => ({
    ...country,
    name: translatedNames[country.code]?.[language] || translatedNames[country.code]?.['en'] || country.code
  })).sort((a, b) => a.name.localeCompare(b.name));
};