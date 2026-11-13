// Jeziki aplikacije: vsi jeziki z več kot približno milijon govorci (prvi in drugi jezik).
// Uporablja ga odjemalec (izbira jezika, vmesnik) in strežnik (sistemski prompt, preverjanje nastavitev).
//
// Vrstica: [koda, ime v jeziku, angleško ime, nadomestni jezik vmesnika, približno milijonov govorcev]
// - Inštruktor (Claude) odgovarja v vsakem jeziku s seznama.
// - Vmesnik je preveden v jezike, ki imajo datoteko v public/i18n/ui/<koda>.json (UI_LANGUAGES).
//   Ostali jeziki pokažejo vmesnik v nadomestnem jeziku (npr. bhodžpuri → hindijščina),
//   ta pa po potrebi v angleščini. Slovenščina je izvirnik (public/i18n/sl.js).
// Številke govorcev so zaokrožene ocene (Ethnologue, Wikipedia) in služijo le za razvrščanje.

export const LANGUAGES = [
  // Evropa
  ["sl", "Slovenščina", "Slovenian", "", 2.5],
  ["en", "English", "English", "", 1500],
  ["de", "Deutsch", "German", "en", 135],
  ["fr", "Français", "French", "en", 310],
  ["es", "Español", "Spanish", "en", 560],
  ["pt", "Português", "Portuguese", "en", 265],
  ["it", "Italiano", "Italian", "en", 68],
  ["nl", "Nederlands", "Dutch", "en", 30],
  ["pl", "Polski", "Polish", "en", 41],
  ["cs", "Čeština", "Czech", "sk", 11],
  ["sk", "Slovenčina", "Slovak", "cs", 7],
  ["hu", "Magyar", "Hungarian", "en", 13],
  ["ro", "Română", "Romanian", "en", 25],
  ["hr", "Hrvatski", "Croatian", "bs", 6],
  ["sr", "Српски", "Serbian (Cyrillic)", "hr", 11],
  ["sr-Latn", "Srpski (latinica)", "Serbian (Latin)", "hr", 11],
  ["bs", "Bosanski", "Bosnian", "hr", 3],
  ["mk", "Македонски", "Macedonian", "sr", 1.6],
  ["sq", "Shqip", "Albanian", "en", 7.5],
  ["bg", "Български", "Bulgarian", "en", 8],
  ["el", "Ελληνικά", "Greek", "en", 13],
  ["uk", "Українська", "Ukrainian", "en", 39],
  ["ru", "Русский", "Russian", "en", 255],
  ["be", "Беларуская", "Belarusian", "ru", 5],
  ["lt", "Lietuvių", "Lithuanian", "en", 3],
  ["lv", "Latviešu", "Latvian", "en", 1.5],
  ["et", "Eesti", "Estonian", "en", 1.1],
  ["fi", "Suomi", "Finnish", "en", 5.8],
  ["sv", "Svenska", "Swedish", "en", 13],
  ["da", "Dansk", "Danish", "en", 6],
  ["nb", "Norsk", "Norwegian", "en", 5],
  ["ga", "Gaeilge", "Irish", "en", 1.8],
  ["sco", "Scots", "Scots", "en", 1.5],
  ["ca", "Català", "Catalan", "es", 10],
  ["gl", "Galego", "Galician", "es", 2.4],
  ["eu", "Euskara", "Basque", "es", 1.2],
  ["scn", "Sicilianu", "Sicilian", "it", 4.7],
  ["nap", "Napulitano", "Neapolitan", "it", 5.7],
  ["vec", "Vèneto", "Venetian", "it", 3.9],
  ["lmo", "Lombard", "Lombard", "it", 3.6],
  ["bar", "Boarisch", "Bavarian", "de", 14],
  ["gsw", "Schwiizerdütsch", "Swiss German", "de", 5],
  ["nds", "Plattdüütsch", "Low German", "de", 2.5],
  ["li", "Limburgs", "Limburgish", "nl", 1.3],
  ["rom", "Romani čhib", "Romani", "en", 4.5],
  ["hy", "Հայերեն", "Armenian", "en", 5.3],
  ["ka", "ქართული", "Georgian", "en", 3.7],
  ["az", "Azərbaycan dili", "Azerbaijani", "tr", 24],
  ["tr", "Türkçe", "Turkish", "en", 90],
  ["tt", "Татар теле", "Tatar", "ru", 5.2],
  ["ba", "Башҡорт теле", "Bashkir", "ru", 1.2],
  ["ce", "Нохчийн мотт", "Chechen", "ru", 1.7],
  ["eo", "Esperanto", "Esperanto", "en", 2],

  // Srednja Azija in Kavkaz
  ["kk", "Қазақ тілі", "Kazakh", "ru", 13],
  ["uz", "Oʻzbekcha", "Uzbek", "ru", 35],
  ["ky", "Кыргызча", "Kyrgyz", "ru", 5],
  ["tg", "Тоҷикӣ", "Tajik", "ru", 9],
  ["tk", "Türkmençe", "Turkmen", "tr", 7],
  ["ug", "ئۇيغۇرچە", "Uyghur", "en", 10],
  ["mn", "Монгол хэл", "Mongolian", "en", 6],

  // Bližnji vzhod in severna Afrika
  ["ar", "العربية", "Arabic (Standard)", "en", 400],
  ["arz", "مصري", "Egyptian Arabic", "ar", 110],
  ["apc", "شامي", "Levantine Arabic", "ar", 60],
  ["ary", "الدارجة", "Moroccan Arabic", "ar", 30],
  ["arq", "دزيري", "Algerian Arabic", "ar", 36],
  ["acm", "عراقي", "Iraqi Arabic", "ar", 32],
  ["apd", "سوداني", "Sudanese Arabic", "ar", 37],
  ["ars", "نجدي", "Najdi Arabic", "ar", 15],
  ["acw", "حجازي", "Hejazi Arabic", "ar", 15],
  ["afb", "خليجي", "Gulf Arabic", "ar", 10],
  ["aeb", "تونسي", "Tunisian Arabic", "ar", 12],
  ["ayl", "ليبي", "Libyan Arabic", "ar", 6],
  ["ayn", "يمني", "Yemeni Arabic", "ar", 20],
  ["shu", "عربي تشادي", "Chadian Arabic", "ar", 3],
  ["fa", "فارسی", "Persian", "en", 80],
  ["prs", "دری", "Dari", "fa", 30],
  ["azb", "تۆرکجه", "South Azerbaijani", "fa", 15],
  ["ps", "پښتو", "Pashto", "fa", 50],
  ["haz", "هزارگی", "Hazaragi", "fa", 2],
  ["lrc", "لۊری", "Luri", "fa", 4],
  ["mzn", "مازرونی", "Mazanderani", "fa", 2.3],
  ["glk", "گیلکی", "Gilaki", "fa", 2.4],
  ["bal", "بلوچی", "Balochi", "ur", 8],
  ["kmr", "Kurmancî", "Kurdish (Kurmanji)", "en", 15],
  ["ckb", "کوردیی ناوەندی", "Kurdish (Sorani)", "en", 6],
  ["he", "עברית", "Hebrew", "en", 9],
  ["kab", "Taqbaylit", "Kabyle", "fr", 5.6],
  ["shi", "Taclḥit", "Tachelhit", "fr", 5],
  ["tzm", "Tamaziɣt", "Central Atlas Tamazight", "fr", 3],
  ["rif", "Tarifit", "Tarifit", "ar", 1.5],
  ["bej", "Bidhaawyeet", "Beja", "ar", 2.5],

  // Afrika
  ["sw", "Kiswahili", "Swahili", "en", 200],
  ["am", "አማርኛ", "Amharic", "en", 57],
  ["om", "Afaan Oromoo", "Oromo", "en", 45],
  ["ti", "ትግርኛ", "Tigrinya", "en", 9],
  ["tig", "ትግረ", "Tigre", "en", 1],
  ["so", "Soomaali", "Somali", "en", 22],
  ["sid", "Sidaamu Afoo", "Sidamo", "en", 4],
  ["wal", "Wolaytta", "Wolaytta", "en", 2.4],
  ["aa", "Qafar af", "Afar", "en", 2],
  ["ha", "Hausa", "Hausa", "en", 80],
  ["yo", "Yorùbá", "Yoruba", "en", 47],
  ["ig", "Igbo", "Igbo", "en", 31],
  ["pcm", "Naijá", "Nigerian Pidgin", "en", 120],
  ["ff", "Fulfulde", "Fula", "fr", 37],
  ["kr", "Kanuri", "Kanuri", "en", 9],
  ["tiv", "Tiv", "Tiv", "en", 4],
  ["ibb", "Ibibio", "Ibibio", "en", 3],
  ["efi", "Efik", "Efik", "en", 1],
  ["bin", "Ẹ̀dó", "Edo", "en", 1.6],
  ["ijc", "Izon", "Ijaw", "en", 2],
  ["urh", "Urhobo", "Urhobo", "en", 1],
  ["nup", "Nupe", "Nupe", "en", 1],
  ["igl", "Igala", "Igala", "en", 2],
  ["idu", "Idoma", "Idoma", "en", 1],
  ["ak", "Akan (Twi)", "Akan", "en", 11],
  ["ee", "Eʋegbe", "Ewe", "en", 7],
  ["dag", "Dagbanli", "Dagbani", "en", 3],
  ["mos", "Mooré", "Mossi", "fr", 8],
  ["bm", "Bamanankan", "Bambara", "fr", 15],
  ["dyu", "Julakan", "Dyula", "fr", 3],
  ["wo", "Wolof", "Wolof", "fr", 12],
  ["mnk", "Mandinka", "Mandinka", "fr", 2],
  ["snk", "Sooninkanxanne", "Soninke", "fr", 2],
  ["sus", "Sosoxui", "Susu", "fr", 1.5],
  ["kpe", "Kpɛlɛɛ", "Kpelle", "en", 1.3],
  ["men", "Mɛnde", "Mende", "en", 2],
  ["tem", "Themne", "Temne", "en", 2],
  ["kri", "Krio", "Krio", "en", 8],
  ["fon", "Fɔngbe", "Fon", "fr", 2.3],
  ["guw", "Gungbe", "Gun", "fr", 1.7],
  ["bci", "Baoulé", "Baoulé", "fr", 3],
  ["dje", "Zarmaciine", "Zarma", "fr", 6],
  ["taq", "Tamasheq", "Tamasheq", "fr", 1],
  ["kbp", "Kabɩyɛ", "Kabiye", "fr", 1],
  ["gux", "Gulmancema", "Gourmanchéma", "fr", 1.5],
  ["ln", "Lingála", "Lingala", "fr", 40],
  ["ktu", "Kikongo ya leta", "Kituba", "fr", 12],
  ["kg", "Kikongo", "Kongo", "fr", 7],
  ["lua", "Tshiluba", "Luba-Kasai", "fr", 6],
  ["sg", "Sängö", "Sango", "fr", 5],
  ["rw", "Ikinyarwanda", "Kinyarwanda", "en", 15],
  ["rn", "Ikirundi", "Kirundi", "fr", 12],
  ["lg", "Luganda", "Luganda", "en", 11],
  ["nyn", "Runyankore", "Nyankole", "en", 3.4],
  ["cgg", "Rukiga", "Kiga", "en", 2.4],
  ["xog", "Lusoga", "Soga", "en", 3],
  ["ach", "Acoli", "Acholi", "en", 1.5],
  ["laj", "Lëblaŋo", "Lango", "en", 2],
  ["teo", "Ateso", "Teso", "en", 2],
  ["ki", "Gĩkũyũ", "Kikuyu", "sw", 8],
  ["luo", "Dholuo", "Luo", "sw", 6],
  ["kam", "Kikamba", "Kamba", "sw", 4.7],
  ["luy", "Luluhya", "Luhya", "sw", 7],
  ["kln", "Kalenjin", "Kalenjin", "sw", 6],
  ["guz", "Ekegusii", "Gusii", "sw", 2.7],
  ["mer", "Kĩmĩrũ", "Meru", "sw", 2],
  ["mas", "Maa", "Maasai", "sw", 1.5],
  ["suk", "Kisukuma", "Sukuma", "sw", 9],
  ["nym", "Kinyamwezi", "Nyamwezi", "sw", 1.5],
  ["hay", "Ruhaya", "Haya", "sw", 1.3],
  ["din", "Thuɔŋjäŋ", "Dinka", "en", 4],
  ["nus", "Thok Naath", "Nuer", "en", 1.2],
  ["zne", "Pazande", "Zande", "en", 1.4],
  ["mg", "Malagasy", "Malagasy", "fr", 25],
  ["sn", "chiShona", "Shona", "en", 15],
  ["nd", "isiNdebele (Zimbabwe)", "Northern Ndebele", "en", 2.6],
  ["ndc", "Cindau", "Ndau", "en", 2.4],
  ["ny", "Chichewa", "Chichewa", "en", 15],
  ["tum", "Chitumbuka", "Tumbuka", "en", 3],
  ["bem", "Ichibemba", "Bemba", "en", 10],
  ["toi", "Chitonga", "Tonga (Zambia)", "en", 1.5],
  ["loz", "Silozi", "Lozi", "en", 1],
  ["vmw", "Emakhuwa", "Makhuwa", "pt", 9],
  ["seh", "Cisena", "Sena", "pt", 2.5],
  ["ngl", "Elomwe", "Lomwe", "pt", 2],
  ["umb", "Umbundu", "Umbundu", "pt", 7],
  ["kmb", "Kimbundu", "Kimbundu", "pt", 2],
  ["cjk", "Wuchokwe", "Chokwe", "pt", 1.3],
  ["ts", "Xitsonga", "Tsonga", "en", 13],
  ["tn", "Setswana", "Tswana", "en", 14],
  ["st", "Sesotho", "Sotho", "en", 14],
  ["nso", "Sesotho sa Leboa", "Northern Sotho", "en", 15],
  ["zu", "isiZulu", "Zulu", "en", 28],
  ["xh", "isiXhosa", "Xhosa", "en", 19],
  ["ss", "siSwati", "Swazi", "en", 2.5],
  ["ve", "Tshivenḓa", "Venda", "en", 1.3],
  ["nr", "isiNdebele (South Africa)", "Southern Ndebele", "en", 1.1],
  ["af", "Afrikaans", "Afrikaans", "en", 18],
  ["ng", "Oshiwambo", "Ovambo", "en", 1.5],

  // Južna Azija
  ["hi", "हिन्दी", "Hindi", "en", 610],
  ["bn", "বাংলা", "Bengali", "en", 280],
  ["ur", "اردو", "Urdu", "en", 230],
  ["pa", "ਪੰਜਾਬੀ", "Punjabi (Gurmukhi)", "hi", 150],
  ["pnb", "پنجابی", "Punjabi (Shahmukhi)", "ur", 90],
  ["skr", "سرائیکی", "Saraiki", "ur", 26],
  ["hno", "ہندکو", "Hindko", "ur", 5],
  ["brh", "براہوئی", "Brahui", "ur", 2.8],
  ["sd", "سنڌي", "Sindhi", "ur", 32],
  ["ks", "کٲشُر", "Kashmiri", "ur", 7],
  ["mr", "मराठी", "Marathi", "hi", 99],
  ["te", "తెలుగు", "Telugu", "en", 96],
  ["ta", "தமிழ்", "Tamil", "en", 87],
  ["gu", "ગુજરાતી", "Gujarati", "hi", 62],
  ["kn", "ಕನ್ನಡ", "Kannada", "en", 59],
  ["ml", "മലയാളം", "Malayalam", "en", 38],
  ["or", "ଓଡ଼ିଆ", "Odia", "hi", 40],
  ["as", "অসমীয়া", "Assamese", "en", 15],
  ["mai", "मैथिली", "Maithili", "hi", 34],
  ["bho", "भोजपुरी", "Bhojpuri", "hi", 52],
  ["awa", "अवधी", "Awadhi", "hi", 38],
  ["mag", "मगही", "Magahi", "hi", 14],
  ["hne", "छत्तीसगढ़ी", "Chhattisgarhi", "hi", 16],
  ["raj", "राजस्थानी", "Rajasthani", "hi", 20],
  ["bgc", "हरियाणवी", "Haryanvi", "hi", 10],
  ["kfy", "कुमाऊँनी", "Kumaoni", "hi", 2.3],
  ["gbm", "गढ़वळि", "Garhwali", "hi", 2.5],
  ["doi", "डोगरी", "Dogri", "hi", 2.6],
  ["bhb", "भीली", "Bhili", "hi", 4],
  ["gon", "गोंडी", "Gondi", "hi", 3],
  ["kru", "कुड़ुख़", "Kurukh", "hi", 2],
  ["sat", "ᱥᱟᱱᱛᱟᱲᱤ", "Santali", "hi", 7.6],
  ["kok", "कोंकणी", "Konkani", "en", 2.3],
  ["tcy", "ತುಳು", "Tulu", "en", 1.8],
  ["mni", "ꯃꯩꯇꯩꯂꯣꯟ", "Meitei (Manipuri)", "en", 1.8],
  ["brx", "बड़ो", "Bodo", "en", 1.5],
  ["ctg", "চাটগাঁইয়া", "Chittagonian", "bn", 13],
  ["syl", "ꠍꠤꠟꠐꠤ", "Sylheti", "bn", 11],
  ["rkt", "রংপুরী", "Rangpuri", "bn", 10],
  ["rhg", "Ruáingga", "Rohingya", "en", 2],
  ["ne", "नेपाली", "Nepali", "hi", 32],
  ["thl", "थारू", "Tharu", "ne", 2],
  ["taj", "तामाङ", "Tamang", "ne", 1.5],
  ["si", "සිංහල", "Sinhala", "en", 17],

  // Vzhodna Azija
  ["zh", "中文（简体）", "Chinese (Simplified)", "en", 1140],
  ["zh-Hant", "中文（繁體）", "Chinese (Traditional)", "zh", 40],
  ["yue", "粵語", "Cantonese", "zh-Hant", 86],
  ["wuu", "吴语", "Wu (Shanghainese)", "zh", 83],
  ["cjy", "晋语", "Jin", "zh", 63],
  ["nan", "閩南語", "Min Nan (Hokkien)", "zh-Hant", 50],
  ["hak", "客家話", "Hakka", "zh-Hant", 48],
  ["hsn", "湘语", "Xiang", "zh", 38],
  ["gan", "赣语", "Gan", "zh", 22],
  ["cdo", "閩東語", "Min Dong", "zh", 10],
  ["za", "Vahcuengh", "Zhuang", "zh", 16],
  ["ii", "ꆈꌠꉙ", "Nuosu (Yi)", "zh", 2],
  ["bo", "བོད་སྐད།", "Tibetan", "en", 1.2],
  ["hmn", "Hmoob", "Hmong", "en", 4],
  ["ja", "日本語", "Japanese", "en", 125],
  ["ko", "한국어", "Korean", "en", 82],

  // Jugovzhodna Azija in Oceanija
  ["id", "Bahasa Indonesia", "Indonesian", "en", 250],
  ["ms", "Bahasa Melayu", "Malay", "id", 80],
  ["jv", "Basa Jawa", "Javanese", "id", 68],
  ["su", "Basa Sunda", "Sundanese", "id", 32],
  ["mad", "Basa Madhura", "Madurese", "id", 7],
  ["min", "Baso Minang", "Minangkabau", "id", 5.5],
  ["bew", "Betawi", "Betawi", "id", 5],
  ["bug", "Basa Ugi", "Buginese", "id", 4],
  ["mui", "Musi", "Musi", "id", 3.9],
  ["bjn", "Bahasa Banjar", "Banjar", "id", 3.5],
  ["ace", "Bahsa Acèh", "Acehnese", "id", 3.5],
  ["ban", "Basa Bali", "Balinese", "id", 3.3],
  ["sas", "Basa Sasak", "Sasak", "id", 2.7],
  ["mak", "Basa Mangkasara", "Makassarese", "id", 2.1],
  ["bbc", "Hata Batak Toba", "Toba Batak", "id", 2],
  ["tl", "Filipino (Tagalog)", "Filipino", "en", 83],
  ["ceb", "Sinugbuanong Binisaya", "Cebuano", "tl", 28],
  ["ilo", "Ilokano", "Ilocano", "tl", 10],
  ["hil", "Hiligaynon", "Hiligaynon", "tl", 9],
  ["war", "Winaray", "Waray", "tl", 3.7],
  ["pam", "Kapampangan", "Kapampangan", "tl", 2.8],
  ["bcl", "Bikol Sentral", "Central Bikol", "tl", 2.5],
  ["pag", "Pangasinan", "Pangasinan", "tl", 1.8],
  ["vi", "Tiếng Việt", "Vietnamese", "en", 86],
  ["th", "ไทย", "Thai", "en", 61],
  ["tts", "ภาษาอีสาน", "Isan", "th", 22],
  ["nod", "คำเมือง", "Northern Thai", "th", 6],
  ["sou", "ภาษาไทยถิ่นใต้", "Southern Thai", "th", 4.5],
  ["lo", "ລາວ", "Lao", "en", 30],
  ["km", "ខ្មែរ", "Khmer", "en", 18],
  ["my", "မြန်မာ", "Burmese", "en", 43],
  ["shn", "လိၵ်ႈတႆး", "Shan", "my", 3.3],
  ["ksw", "ကညီကျိာ်", "S'gaw Karen", "my", 2],
  ["tet", "Tetun", "Tetum", "pt", 1.4],
  ["tpi", "Tok Pisin", "Tok Pisin", "en", 4],

  // Amerike
  ["qu", "Runasimi", "Quechua", "es", 8],
  ["gn", "Avañeʼẽ", "Guarani", "es", 6.5],
  ["ay", "Aymar aru", "Aymara", "es", 2],
  ["nah", "Nāhuatlahtōlli", "Nahuatl", "es", 1.7],
  ["quc", "Kʼicheʼ", "Kʼicheʼ", "es", 1.1],
  ["ht", "Kreyòl ayisyen", "Haitian Creole", "fr", 13],
  ["jam", "Patwa", "Jamaican Patois", "en", 3],
];

// Pisave od desne proti levi.
export const RTL = new Set([
  "ar", "arz", "apc", "ary", "arq", "acm", "apd", "ars", "acw", "afb", "aeb", "ayl", "ayn", "shu",
  "fa", "prs", "azb", "ps", "haz", "lrc", "mzn", "glk", "bal", "ckb", "he", "ug",
  "ur", "pnb", "skr", "hno", "brh", "sd", "ks",
]);

// Jeziki z lastnim prevodom vmesnika (public/i18n/ui/<koda>.json). sr-Latn nastane iz sr (prečrkovanje).
export const UI_LANGUAGES = [
  "sl", "en", "de", "it", "fr", "es", "pt", "hr", "sr", "bs", "mk", "sq", "hu", "pl", "cs", "sk", "ro",
  "uk", "ru", "tr", "ar", "fa", "hi", "bn", "ur", "id", "vi", "zh", "zh-Hant", "ja", "ko", "th", "sw",
];

export const DEFAULT_LANGUAGE = "sl";
export const LANGUAGE_CODES = LANGUAGES.map((l) => l[0]);

const BY_CODE = new Map(LANGUAGES.map(([code, native, english, fallback, speakers]) => [code, { code, native, english, fallback, speakers, rtl: RTL.has(code) }]));

export function langInfo(code) {
  return BY_CODE.get(code) || BY_CODE.get(DEFAULT_LANGUAGE);
}

export const isLanguage = (code) => BY_CODE.has(code);

// Zaporedje jezikov vmesnika za izbrani jezik: sam jezik, nadomestni …, angleščina, slovenščina.
export function uiChain(code) {
  const out = [];
  let c = isLanguage(code) ? code : DEFAULT_LANGUAGE;
  while (c && !out.includes(c)) {
    out.push(c);
    c = BY_CODE.get(c)?.fallback;
  }
  for (const last of ["en", "sl"]) if (!out.includes(last)) out.push(last);
  return out;
}

// Prvi jezik iz verige, ki ima prevod vmesnika.
export function uiLanguage(code) {
  return uiChain(code).find((c) => UI_LANGUAGES.includes(c) || c === "sr-Latn");
}

// Brskalniške oznake, ki isti jezik imenujejo z drugo kodo.
const ALIASES = { no: "nb", nn: "nb", fil: "tl", iw: "he", in: "id", mo: "ro", sh: "sr-Latn", tw: "ak", pes: "fa", zsm: "ms", cmn: "zh", arb: "ar", swh: "sw", khk: "mn", lvs: "lv", ekk: "et", uzn: "uz", azj: "az", npi: "ne", gaz: "om", ory: "or", plt: "mg" };
// Različica, ki v državi najbolj ustreza (pisava ali narečje).
const BY_SCRIPT = { "zh-Hant": "zh-Hant", "sr-Latn": "sr-Latn", "pa-Arab": "pnb", "az-Arab": "azb" };
const BY_REGION = {
  ar: { EG: "arz", SY: "apc", LB: "apc", JO: "apc", PS: "apc", MA: "ary", DZ: "arq", IQ: "acm", SD: "apd", TN: "aeb", LY: "ayl", YE: "ayn", TD: "shu", KW: "afb", BH: "afb", QA: "afb", AE: "afb", OM: "afb" },
  fa: { AF: "prs" },
};

// Jezik in regija iz nastavitev naprave (navigator.languages), npr. ["de-AT", "en"] → de, AT.
// Prvi znani jezik zmaga; regija lahko izbere narečje ali pisavo (zh-TW → zh-Hant, ar-EG → arz).
// Brez ujemanja angleščina.
// Oznaka jezika → { language, script, region }. Brez Intl.Locale (Hermes v aplikaciji za telefon)
// jo razčlenimo sami, sicer bi vsak telefon dobil angleščino.
function parseTag(tag) {
  try {
    const loc = new Intl.Locale(tag);
    let script = loc.script;
    try {
      script = script || loc.maximize().script;
    } catch {}
    return { language: loc.language, script, region: loc.region };
  } catch {}
  const parts = tag.replace(/_/g, "-").split("-");
  if (!/^[a-z]{2,8}$/i.test(parts[0])) return null;
  const rest = parts.slice(1);
  const s = rest.find((p) => /^[a-z]{4}$/i.test(p));
  const region = rest.find((p) => /^([a-z]{2}|\d{3})$/i.test(p))?.toUpperCase();
  const language = parts[0].toLowerCase();
  const script = s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : language === "zh" && /^(TW|HK|MO)$/.test(region || "") ? "Hant" : undefined;
  return { language, script, region };
}

// Naprava v angleščini v Sloveniji (časovni pas Ljubljana): Evklid je slovenski, zato slovenščina.
// Drug jezik učenec izbere v Nastavitvah (j, 2026-10-30: angleški iPad je pokazal angleške zaslone).
export function homeLanguage(code, timeZone) {
  return code === "en" && timeZone === "Europe/Ljubljana" ? "sl" : code;
}

export function detectLanguage(tags = []) {
  const byLower = new Map(LANGUAGE_CODES.map((c) => [c.toLowerCase(), c]));
  for (const tag of tags) {
    if (typeof tag !== "string" || !tag) continue;
    const loc = parseTag(tag);
    if (!loc) continue;
    const region = /^[A-Z]{2}$/.test(loc.region || "") ? loc.region : "";
    const exact = byLower.get(tag.toLowerCase());
    if (exact) return { code: exact, region };
    const base = ALIASES[loc.language] || loc.language;
    const code = BY_SCRIPT[`${base}-${loc.script}`] || BY_REGION[base]?.[region] || base;
    if (BY_CODE.has(code)) return { code, region };
  }
  return { code: "en", region: "" };
}
