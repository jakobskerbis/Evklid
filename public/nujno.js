// Zaznavalnik nujnih primerov brez AI (strošek 0), za strežnik in vmesnik (j, 6. 11. 2026: »varnost ima
// prednost pred mejo porabe in pred maržo«). Teče pred vsako zavrnitvijo (meja porabe, gost, izklopljen
// klepet), ob napaki AI, brez povezave in tudi pod mejo (varnostni odgovor nad odgovorom inštruktorja).
//
// Vrne vrsto: "zdravje" | "stiska" | "nasilje" | "nevarnost" ali null. Besedila odgovorov so ključi
// i18n »nujno.*« (public/i18n/sl.js, j jih je potrdil 6. 11.; kartica-nujno). Raje lažni alarm kot zgrešen,
// a števila v nalogah brez znaka bolezni (»x² = 42«, »voda ima 42 °C«) alarma ne sprožijo.
//
// Znaki so zapisani naravno (s šumniki, v cirilici …); normalize() jih in sporočilo poenoti enako:
// male črke, brez naglasov in šumnikov, cirilica v latinico, brez apostrofov in ZWNJ. Latinični znak se
// ujema na začetku besede (»zastrupil« ujame »zastrupila«), pisave brez presledkov (kitajščina,
// japonščina, tajščina) kot podniz. Znak z »=« na začetku se primerja z besedilom S šumniki (vietnamščina:
// »tự tử« ni »từ từ«).
import { SCHOOL_SYSTEMS, COUNTRY_SYSTEM, isRegional } from "./regions.js";
import { jeFaks } from "./stopnja.js";

const CYR = {
  а: "a", б: "b", в: "v", г: "g", ґ: "g", д: "d", ђ: "dj", ѓ: "gj", е: "e", ё: "e", є: "je", ж: "z", з: "z", ѕ: "dz", и: "i", і: "i", ї: "ji", й: "j",
  ј: "j", к: "k", ќ: "kj", л: "l", љ: "lj", м: "m", н: "n", њ: "nj", о: "o", п: "p", р: "r", с: "s", т: "t", ћ: "c", у: "u", ў: "u", ф: "f", х: "h",
  ц: "c", ч: "c", џ: "dz", ш: "s", щ: "sc", ъ: "", ы: "y", ь: "", э: "e", ю: "ju", я: "ja",
};
const EXTRA = {
  ł: "l", đ: "d", ı: "i", ß: "ss", ø: "o", æ: "ae", œ: "oe", ى: "ي", ة: "ه", ـ: "",
};

// Male črke in brez znakov za naglas (z = brez pretvorbe šumnikov: za znake z »=«).
export function lower(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFC")
    .replace(/[‌‍'’ʼ`´]/g, "");
}
export function normalize(text) {
  return lower(text)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .normalize("NFC")
    .replace(/./gu, (ch) => CYR[ch] ?? EXTRA[ch] ?? ch)
    .replace(/[^\p{L}\p{N}°.,]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// --- znaki po vrstah (vsi jeziki skupaj) ---------------------------------------------------------
const ZDRAVJE = [
  // sl
  "nezavesten", "nezavestna", "v nezavesti", "onesvestil", "onesvestila", "ne diha ", "ne more dihat", "težko diha", "se duši", "zadušil", "zadušila",
  "se ne odziva", "močno krvavi", "zelo krvavi", "ne neha krvavet", "veliko krvi", "kri mu teče", "kri ji teče", "teče mu kri", "teče ji kri",
  "kri ne neha", "kri kar teče", "?zastrupil", "?zastrupila", "?zastrupljen", "popil čistil", "popila čistil", "pojedel tablet", "pojedla tablet",
  "popil tablet", "popila tablet", "preveč tablet", "preveč zdravil", "too many pills", "lot of pills", "alergijsko reakcijo", "oteka mu", "oteka ji",
  "zatekel cel", "zatekla cel", "zateklo cel", "udaril v glavo", "udarila v glavo", "udarec v glavo", "padel na glavo", "padla na glavo",
  "ima pretres možganov", "ima krče", "dobil krče", "dobila krče", "krči ga", "krči jo", "ima epileptični napad", "dobil epileptični",
  "dobila epileptični", "?srčni napad", "ima infarkt", "bolečine v prsih", "boli ga v prsih", "boli jo v prsih", "ima kap", "dobil kap", "dobila kap",
  "se utaplja", "utopil", "stresla elektrika", "elektrika ga je", "elektrika jo je", "kača ga je", "kača jo je", "se ne zbudi", "ne morem ga zbudit",
  "ne morem je zbudit", "se je zgrudil", "se zgrudil", "se je zgrudila", "se zgrudila", "zgrudil se je", "ne odpre oči", "se ne premakne",
  "krvavi iz glave", "padel po stopnicah", "padla po stopnicah", "modre ustnice", "pomodrel", "pomodrela", "rešilca", "rešilec", "reševalce",
  "reševalci",
  // hr, sr, bs
  "bez svijesti", "bez svesti", "onesvijest", "onesvest", "izgubio svijest", "izgubila svijest", "izgubio svest", "izgubila svest", "ne diše",
  "ne može disat", "ne moze da dise", "ne može da diše", "guši se", "jako krvari", "puno krvi", "mnogo krvi", "krvari jako", "otrovao", "otrovala",
  "otrovan", "popio tablete", "popila tablete", "progutao tablet", "progutala tablet", "alergijsku reakciju", "otiče", "otice mu", "udario glavom",
  "udarila glavom", "pao na glavu", "pala na glavu", "ima potres mozga", "ima grčeve", "dobio grčeve", "ima napad epilepsije", "ima srčani udar",
  "dobio srčani udar", "dobila srčani udar", "bol u prsima", "utapa se", "udarila ga struja", "udarila ju struja", "ne mogu ga probudit",
  "ne budi se", "se ne budi", "ne reaguje", "pao je i ne", "pala je i ne", "plave usne", "hitna pomoć", "hitnu pomoć", "hitnu", "zovi hitnu",
  // en
  "unconscious", "passed out", "fainted", "not breathing", "cant breathe", "can not breathe", "cannot breathe", "stopped breathing",
  "struggling to breathe", "choking", "bleeding a lot", "bleeding heavily", "bleeding badly", "wont stop bleeding", "lots of blood", "so much blood",
  "poisoned", "swallowed pills", "took pills", "took a lot of pills", "drank bleach", "overdosed", "took an overdose", "having an allergic reaction",
  "had an allergic reaction", "throat is swelling", "going into anaphyla", "hit his head", "hit her head", "hit my head", "hit their head",
  "has a concussion", "having a seizure", "had a seizure", "having convulsions", "having a heart attack", "had a heart attack", "chest hurts",
  "chest pain", "having a stroke", "drowning", "electrocuted", "snake bit", "wont wake up", "lips are blue", "call an ambulance", "need an ambulance",
  "get an ambulance", "collapsed", "turning blue",
  // de
  "bewusstlos", "ohnmächtig", "atmet nicht", "bekommt keine luft", "kriegt keine luft", "er erstickt", "sie erstickt", "erstickt gerade",
  "blutet stark", "viel blut", "vergiftet", "vergiftung", "tabletten geschluckt", "allergische reaktion", "kopf gestoßen", "kopf angeschlagen",
  "gehirnerschütterung", "krampfanfall", "herzinfarkt", "ertrinkt", "wacht nicht auf", "blaue lippen", "krankenwagen", "notarzt",
  // fr
  "inconscient", "évanoui", "ne respire pas", "ne respire plus", "étouffe", "saigne beaucoup", "beaucoup de sang", "empoisonné", "intoxiqué",
  "avalé des médicaments", "réaction allergique", "cogné la tête", "commotion", "convulsion", "crise d'épilepsie", "crise cardiaque", "se noie",
  "ne se réveille pas", "lèvres bleues", "appelle une ambulance", "le samu",
  // es
  "inconsciente", "se desmayó", "no respira", "no puede respirar", "se ahoga", "sangra mucho", "mucha sangre", "envenenad", "intoxicad",
  "tomó pastillas", "reacción alérgica", "golpe en la cabeza", "golpeó la cabeza", "convulsi", "ataque al corazón", "infarto", "no despierta",
  "labios azules", "ambulancia",
  // it
  "svenut", "privo di sensi", "priva di sensi", "incosciente", "non respira", "soffoca", "sanguina molto", "tanto sangue", "avvelenat", "intossicat",
  "preso pastiglie", "reazione allergica", "battuto la testa", "convulsion", "attacco di cuore", "annega", "non si sveglia", "labbra blu",
  "ambulanza",
  // pt
  "desmaiou", "não respira", "não consegue respirar", "engasgad", "sangrando muito", "muito sangue", "envenenad", "tomou comprimidos",
  "reação alérgica", "bateu a cabeça", "convuls", "ataque cardíaco", "afogando", "não acorda", "lábios roxos", "ambulância",
  // pl
  "nieprzytomn", "zemdlał", "zemdlała", "nie oddycha", "nie może oddychać", "dusi się", "mocno krwawi", "dużo krwi", "zatruł", "zatruła", "zatrucie",
  "połknął tabletki", "połknęła tabletki", "reakcja alergiczna", "uderzył się w głowę", "uderzyła się w głowę", "wstrząśnienie mózgu", "drgawki",
  "atak padaczki", "zawał", "topi się", "nie mogę go obudzić", "sine usta", "karetk", "pogotowie",
  // cs, sk
  "v bezvědomí", "omdlel", "omdlela", "nedýchá", "nemůže dýchat", "dusí se", "silně krvácí", "hodně krve", "otrávil", "otrava jídlem", "má otravu",
  "spolkl prášky", "alergická reakce", "uhodil se do hlavy", "otřes mozku", "křeče", "má infarkt", "topí se", "nemůžu ho probudit", "modré rty",
  "záchranku", "záchranka", "v bezvedomí", "odpadol", "odpadla", "nedýcha", "nemôže dýchať", "dusí sa", "silno krvácia", "veľa krvi", "otrávil sa",
  "otrava jedlom", "má otravu", "prehltol tabletky", "alergická reakcia", "udrel sa do hlavy", "otras mozgu", "kŕče", "topí sa", "neviem ho zobudiť",
  "modré pery", "záchranku",
  // hu
  "eszméletlen", "elájult", "nem lélegzik", "nem kap levegőt", "fullad", "erősen vérzik", "sok vér", "megmérgez", "mérgezés", "gyógyszert vett be",
  "allergiás reakció", "beverte a fejét", "agyrázkódás", "görcsöl", "rohama van", "szívroham", "infarktus", "nem ébred", "kék az ajka", "mentőt",
  // ro
  "inconștient", "a leșinat", "nu respiră", "nu poate respira", "se sufocă", "sângerează mult", "mult sânge", "otrăvit", "intoxicat",
  "a înghițit pastile", "reacție alergică", "s-a lovit la cap", "comoție", "criză de epilepsie", "infarct", "atac de cord", "se îneacă",
  "nu se trezește", "buze vinete", "ambulanța", "salvarea",
  // sq
  "pa ndjenja", "i ra të fikët", "humbi ndjenjat", "nuk merr frymë", "s merr frymë", "po mbytet", "gjakon shumë", "shumë gjak", "u helmua", "helmim",
  "piu tableta", "reaksion alergjik", "goditi kokën", "kriza epileptike", "sulm në zemër", "nuk zgjohet", "buzët blu", "thirr ambulancë",
  "thirrni ambulancë", "urgjencën",
  // mk
  "без свест", "се онесвести", "не дише", "не може да дише", "се гуши", "многу крвари", "отруен", "труење", "испи таблети", "алергиска реакција",
  "удри во глава", "потрес на мозок", "грчеви", "епилептичен напад", "срцев удар", "се дави", "не се буди", "сини усни", "брза помош",
  // ru, uk
  "без сознания", "потерял сознание", "потеряла сознание", "не дышит", "не может дышать", "задыхается", "сильно кровоточит", "много крови",
  "кровь не останавливается", "отравился", "отравилась", "отравление", "выпил таблетки", "выпила таблетки", "наглотался", "наглоталась",
  "аллергическая реакция", "ударился головой", "ударилась головой", "сотрясение мозга", "судороги", "эпилептический приступ", "сердечный приступ",
  "тонет в реке", "тонет в море", "тонет в бассейне", "человек тонет", "он тонет", "она тонет", "не просыпается", "синие губы", "вызови скорую",
  "скорую", "без свідомості", "знепритомнів", "знепритомніла", "не дихає", "не може дихати", "задихається", "сильно кровить", "багато крові",
  "отруївся", "отруїлася", "отруєння", "випив таблетки", "випила таблетки", "алергічна реакція", "вдарився головою", "вдарилася головою",
  "струс мозку", "судоми", "серцевий напад", "не прокидається", "сині губи", "швидку",
  // tr
  "bilinci kapalı", "bayıldı", "nefes almıyor", "nefes alamıyor", "boğuluyor", "çok kanıyor", "kan durmuyor", "çok kan", "zehirlendi", "zehirlenme",
  "hap içti", "çok ilaç içti", "alerjik reaksiyon", "kafasını çarptı", "kafasını vurdu", "beyin sarsıntısı", "nöbet geçiriyor", "kalp krizi",
  "uyanmıyor", "dudakları mor", "ambulans",
  // id
  "pingsan", "tidak sadar", "tidak bernapas", "tidak bisa bernapas", "sesak napas", "tersedak", "berdarah banyak", "banyak darah", "keracunan",
  "reaksi alergi", "kepalanya terbentur", "gegar otak", "kejang", "serangan jantung", "hampir tenggelam", "sedang tenggelam", "tenggelam di laut",
  "tenggelam di sungai", "tenggelam di kolam", "tidak bangun", "bibir biru",
  // sw
  "amezimia", "hana fahamu", "hapumui", "hawezi kupumua", "anavuja damu", "damu nyingi", "amekunywa sumu", "amekula sumu", "amegonga kichwa",
  "degedege", "kifafa", "shambulio la moyo", "anazama", "haamki", "gari la wagonjwa", "ambulensi",
  // vi
  "bất tỉnh", "ngất xỉu", "bị ngất", "không thở", "khó thở", "nghẹt thở", "chảy máu nhiều", "nhiều máu", "ngộ độc", "uống nhiều thuốc", "dị ứng nặng",
  "đập đầu", "chấn thương đầu", "co giật", "đau tim", "đuối nước", "không tỉnh", "môi tím", "xe cấp cứu", "gọi cấp cứu",
  // hi (in hinglish)
  "बेहोश", "सांस नहीं", "साँस नहीं", "खून बह रहा", "बहुत खून", "ज़हर खा", "जहर खा", "ज़हर पी", "दौरा पड़", "दिल का दौरा", "सिर पर चोट", "डूब रहा",
  "एम्बुलेंस", "होश नहीं", "behosh", "saans nahi", "sans nahi", "bahut khoon", "zeher kha", "jahar kha",
  // bn
  "অজ্ঞান", "শ্বাস নিচ্ছে না", "শ্বাস নিতে পারছে না", "রক্ত পড়ছে", "অনেক রক্ত", "বিষ খেয়েছে", "খিঁচুনি", "হার্ট অ্যাটাক", "মাথায় আঘাত",
  "ডুবে যাচ্ছে", "অ্যাম্বুলেন্স",
  // ur
  "بے ہوش", "سانس نہیں", "بہت خون", "خون بہہ رہا", "زہر کھا", "زہر پی", "دل کا دورہ", "سر پر چوٹ", "ڈوب رہا", "ایمبولینس",
  // fa
  "بیهوش", "نفس نمی‌کشد", "نمی‌تواند نفس", "نفس نمیکشه", "خونریزی", "خون زیادی", "مسموم", "واکنش آلرژیک", "تشنج", "حمله قلبی", "سکته", "سرش ضربه",
  "غرق شد", "آمبولانس", "اورژانس",
  // ar
  "فاقد الوعي", "فقد الوعي", "مغمى عليه", "أغمي عليه", "لا يتنفس", "لا تتنفس", "لا يستطيع التنفس", "يختنق", "تختنق", "ينزف كثيرا", "نزيف", "دم كثير",
  "تسمم", "ابتلع حبوب", "حساسية شديدة", "ضرب رأسه", "ارتجاج", "تشنج", "نوبة قلبية", "يغرق الآن", "أخي يغرق", "طفل يغرق", "لا يستيقظ", "شفاه زرقاء",
  "إسعاف",
  // zh, zh-Hant
  "昏迷", "晕倒", "暈倒", "昏倒", "没有呼吸", "沒有呼吸", "不能呼吸", "喘不过气", "喘不過氣", "窒息", "流血不止", "大量出血", "很多血", "中毒", "吞了药", "吞了藥", "吃了很多药", "吃了很多藥", "过敏反应", "過敏反應",
  "撞到头", "撞到頭", "脑震荡", "腦震盪", "抽搐", "癫痫发作", "癲癇發作", "心脏病发作", "心臟病發作", "溺水", "叫不醒", "嘴唇发紫", "嘴唇發紫", "救护车", "救護車",
  // ja
  "意識がない", "意識不明", "気を失", "気絶", "息をしていない", "息をしてない", "呼吸していない", "息ができない", "血が止まらない", "薬を大量", "アレルギー反応", "頭を打", "脳震盪", "けいれん", "痙攣", "心臓発作", "溺れ",
  "起こしても起きない", "目を覚まさない", "唇が紫", "救急車",
  // ko
  "의식이 없", "의식을 잃", "기절", "숨을 안 쉬", "숨을 못 쉬", "숨이 안", "질식", "피가 멈추지", "피가 많이", "출혈", "약을 많이", "알레르기 반응", "머리를 부딪", "뇌진탕", "경련", "심장마비", "익사", "물에 빠",
  "깨워도 안 일어나", "흔들어도 안 일어나", "입술이 파래", "구급차",
  // th
  "หมดสติ", "เป็นลม", "ไม่หายใจ", "หายใจไม่ออก", "เลือดออกมาก", "เลือดไม่หยุด", "กินยาเกิน", "แพ้รุนแรง", "หัวกระแทก", "ชักเกร็ง", "หัวใจวาย",
  "จมน้ำ", "ไม่ตื่น", "ปากเขียว", "รถพยาบาล",
];

const STISKA = [
  // sl (tudi brez šumnikov in narečno: normalize)
  "samomor", "ubil bi se", "ubila bi se", "ubu bi se", "ubijem se", "se bom ubil", "se bom ubila", "nočem več živet", "ne želim več živet",
  "nočem živet", "ne želim živet", "nočem bit živ", "rajši bi bil mrtev", "rajši bi bila mrtva", "raje bi bil mrtev", "raje bi bila mrtva",
  "da me ne bi bilo", "rajši bi izginil", "rajši bi izginila", "ni vredno živet", "nima smisla živet", "končati vse", "končal bom vse",
  "končala bom vse", "si kaj naredim", "si nekaj naredim", "naredil si bom nekaj", "naredila si bom nekaj", "režem se", "se režem", "porezal sem se",
  "porezala sem se", "sem se rezal", "sem se porezal", "se bi ubil", "se bi ubila", "bi se ubil", "bi se ubila", "končat vse", "lažje brez mene",
  "boljše brez mene", "bolje brez mene", "pod vlak", "nocm zivt", "nocm zivet", "nočem živt", "ne bi rad živel", "ne bi rada živela", "samopoškod",
  "hočem umret", "želim umret", "rad bi umrl", "rada bi umrla", "nihče me ne bi pogrešal",
  // hr, sr, bs
  "samoubist", "ubit ću se", "ubiću se", "ubio bih se", "ubila bih se", "ne želim živjet", "ne želim više živjet", "ne želim da živim",
  "ne želim više da živim", "neću da živim", "necu da zivim", "da se ubijem", "bolje bez mene", "neću više živjeti", "neću više da živim",
  "želim umrijeti", "želim da umrem", "hoću da umrem", "bolje da sam mrtav", "bolje da sam mrtva", "bolje da me nema", "režem se", "sečem se",
  "samoozljeđ", "samopovređ",
  // en
  "kill myself", "killing myself", "suicide", "suicidal", "want to die", "wanna die", "dont want to live", "dont want to be alive", "better off dead",
  "end my life", "end it all", "hurt myself", "hurting myself", "cut myself", "cutting myself", "self harm", "unalive", "no reason to live",
  "better off without me", "want to disappear", "kms ", "wish i was dead", "wish i were dead", "wish i wasnt here", "wish i didnt exist",
  // de
  "mich umbringen", "bring mich um", "selbstmord", "suizid", "will nicht mehr leben", "will sterben", "ritze mich", "mich ritzen", "mir was antun",
  "mir etwas antun", "wäre lieber tot",
  // fr
  "me suicider", "me tuer", "envie de mourir", "veux mourir", "veux plus vivre", "me faire du mal", "me scarifie", "mieux mort",
  // es, it, pt
  "suicid", "matarme", "quiero morir", "no quiero vivir", "hacerme daño", "me corto", "mejor muerto", "mejor muerta", "acabar con todo", "uccidermi",
  "ammazzarmi", "voglio morire", "non voglio più vivere", "farmi del male", "mi taglio", "farla finita", "me matar", "matar me", "quero morrer",
  "não quero viver", "me machucar", "me cortar", "acabar com tudo",
  // pl, cs, sk
  "samobój", "zabić się", "zabiję się", "chcę umrzeć", "nie chcę żyć", "tnę się", "okaleczam", "zrobić sobie krzywdę", "sebevražd", "zabít se",
  "zabiju se", "chci umřít", "nechci žít", "řežu se", "sebepoškoz", "ublížit si", "samovražd", "zabiť sa", "zabijem sa", "chcem zomrieť",
  "nechcem žiť", "režem sa", "sebapoškod", "ublížiť si",
  // hu, ro, sq
  "öngyilkos", "megölöm magam", "meg akarok halni", "nem akarok élni", "vagdosom magam", "bántani magam", "sinucid", "să mă omor", "vreau să mor",
  "nu vreau să trăiesc", "să mi fac rău", "mă tai", "vetëvras", "të vras veten", "dua të vdes", "nuk dua të jetoj", "nuk dua më të jetoj",
  "të dëmtoj veten", "pres veten",
  // mk, ru, uk
  "самоубиств", "ќе се убијам", "сакам да умрам", "не сакам да живеам", "се сечам", "самоповред", "суицид", "самоубийств", "покончить с собой",
  "убить себя", "убью себя", "хочу умереть", "не хочу жить", "режу себя", "селфхарм", "лучше бы меня не было", "суїцид", "самогубств", "вбити себе",
  "вб'ю себе", "хочу померти", "не хочу жити", "ріжу себе", "краще б мене не було",
  // tr, id, sw
  "intihar", "kendimi öldür", "ölmek istiyorum", "yaşamak istemiyorum", "kendime zarar", "kendimi kes", "keşke ölsem", "bunuh diri", "ingin mati",
  "pengen mati", "mau mati", "tidak ingin hidup", "gak mau hidup", "melukai diri", "menyakiti diri", "kujiua", "nataka kufa", "sitaki kuishi",
  "kujidhuru", "kujikata",
  // vi (s šumniki: »từ từ« = počasi)
  "=tự tử", "=tự sát", "=muốn chết", "=không muốn sống", "=tự làm hại", "=rạch tay",
  // hi, bn, ur, fa, ar
  "आत्महत्या", "मरना चाहता", "मरना चाहती", "जीना नहीं चाहता", "जीना नहीं चाहती", "खुद को मार", "खुद को नुकसान", "marna chahta", "marna chahti",
  "jeena nahi chahta", "jina nahi chahta", "khud ko maar", "আত্মহত্যা", "মরতে চাই", "বাঁচতে চাই না", "নিজেকে শেষ", "নিজের ক্ষতি", "خودکشی",
  "مرنا چاہتا", "مرنا چاہتی", "جینا نہیں چاہتا", "جینا نہیں چاہتی", "خود کو نقصان", "می‌خواهم بمیرم", "میخوام بمیرم", "نمی‌خواهم زندگی کنم",
  "نمیخوام زندگی کنم", "به خودم آسیب", "انتحار", "انتحر", "أقتل نفسي", "أريد أن أموت", "لا أريد أن أعيش", "أؤذي نفسي", "أجرح نفسي",
  // zh, ja, ko, th
  "自杀", "自殺", "想死", "不想活", "活不下去", "伤害自己", "傷害自己", "割腕", "自残", "自殘", "轻生", "輕生", "死にたい", "消えたい", "生きたくない", "自傷", "リスカ", "リストカット", "自分を傷つけ", "자살",
  "죽고 싶", "죽고싶", "살고 싶지 않", "살기 싫", "자해", "사라지고 싶", "ฆ่าตัวตาย", "อยากตาย", "ไม่อยากมีชีวิต", "ทำร้ายตัวเอง", "กรีดแขน",
];

const NASILJE = [
  // sl
  "me tepe", "me tepejo", "me pretepa", "me pretepajo", "me udari", "me udarja", "me udarjajo", "me brca", "me zlorablja", "me je posilil",
  "me nadleguje", "me izsiljuje", "me ustrahuje", "me zalezuje", "me tuče", "me tuku", "me udara", "me maltretira", "me zlostavlja", "me dira",
  "me bije", "me ucjenjuje", "me ucenjuje", "me proganja", "is hitting me", "keeps hitting me", "tepe me", "tepejo me", "pretepa me", "pretepajo me",
  "udari me", "udarja me", "udarjajo me", "brca me", "zlorablja", "spolno zlorab", "posilil", "posiljen", "posiljena", "se me dotika", "dotika se me",
  "dotikal me je", "dotikal se me je", "grozi mi da", "mi grozi da", "grozi mi z", "grozi mi s ", "grozijo mi da", "grozi da me bo", "da me bo ubil",
  "da me bo ubila", "da me bodo ubili", "tepel mamo", "tepe mamo", "tepel brata", "tepe brata", "tepe sestro", "ustrahuje me", "ustrahujejo me",
  "nasilje doma", "zaprli so me", "zaklenil me je", "ne smem nikomur povedat", "gole slike", "golo sliko", "pošlji gol", "nadleguje me",
  "zalezuje me", "izsiljuje me", "izsiljujejo me",
  // hr, sr, bs
  "tuče me", "tuku me", "udara me", "maltretira me", "maltretiraju me", "zlostavlja", "seksualno zlostavlj", "silovao", "silovana", "dira me",
  "dirao me", "bije me", "prijeti mi da", "prijete mi da", "preti mi da", "prete mi da", "nasilje u obitelji", "nasilje u porodici", "ucjenjuje me",
  "ucenjuje me", "proganja me", "zaključao me",
  // en
  "hits me", "beats me", "beat me up", "abuses me", "abused me", "abusing me", "sexually abus", "molest", "raped", "rape me", "touches me",
  "touched me", "touching me", "hit me", "hits me again", "threatens me", "threatened to kill", "domestic violence", "bullying me", "being bullied",
  "send nudes", "nude pics", "blackmailing me", "stalking me", "locked me in", "kicks me",
  // de
  "schlägt mich", "schlagen mich", "missbraucht mich", "missbrauch", "vergewaltig", "fasst mich an", "bedroht mich", "häusliche gewalt",
  "werde gemobbt", "erpresst mich", "nacktbilder",
  // fr
  "me frappe", "me bat", "m'a violé", "violée", "abus sexuel", "me touche", "me menace", "violence conjugale", "violences familiales", "me harcèle",
  "harcèlement", "me fait chanter", "photos nues",
  // es, it, pt
  "me pega", "me golpea", "abusa de mí", "abuso sexual", "me violó", "violación", "me toca sin permiso", "me toca las partes", "me manosea",
  "me amenaza", "violencia doméstica", "me acosa", "fotos desnud", "mi picchia", "mi picchiano", "abusa di me", "abuso sessuale", "violentat",
  "mi tocca le parti intime", "mi tocca senza permesso", "mi palpa", "mi minaccia", "violenza domestica", "mi ricatta", "foto nud", "me bate",
  "batem em mim", "abusa de mim", "estupr", "me ameaça", "violência doméstica", "me chantageia", "fotos nuas",
  // pl, cs, sk
  "bije mnie", "biją mnie", "molestuj", "wykorzystuje mnie", "zgwałcił", "dotyka mnie", "przemoc domowa", "znęca się", "szantażuje", "nagie zdjęcia",
  "bije mě", "bijí mě", "zneužív", "znásil", "osahává", "sahá na mě", "vyhrožuje mi", "domácí násilí", "šikan", "vydírá", "bije ma", "bijú ma",
  "zneuží", "osahováva", "siaha na mňa", "vyhráža sa mi", "domáce násilie", "vydiera",
  // hu, ro, sq
  "megver", "ver engem", "bántalmaz", "molesztál", "megerőszak", "fogdos", "fenyeget", "családon belüli erőszak", "zaklat", "zsarol", "meztelen kép",
  "mă bate tata", "mă bate mama", "mă bate tatăl", "mă bate mereu", "abuzează de mine", "abuz sexual", "m a violat", "mă atinge", "mă amenință",
  "violență domestică", "mă șantajează", "më rreh", "abuzon me mua", "përdhun", "më prek", "më kërcënon", "dhunë në familje", "më shantazhon",
  // mk, ru, uk
  "ме тепа", "ме удира", "сексуално злоставува", "силува", "ме допира", "ми се заканува", "семејно насилство", "ме уценува", "бьёт меня",
  "избивает меня", "домогается", "изнасил", "трогает меня", "угрожает мне", "домашнее насилие", "травят меня", "шантажирует", "б'є мене", "згвалт",
  "чіпляється до мене", "торкається мене", "погрожує мені", "домашнє насильство", "цькують", "шантажує",
  // tr, id, sw
  "beni dövüyor", "dövüyor", "taciz", "tecavüz", "bana dokunuyor", "beni tehdit", "aile içi şiddet", "zorbalık", "şantaj", "memukul saya",
  "memukulku", "dipukul", "pelecehan", "diperkosa", "memperkosa", "menyentuh saya", "mengancam saya", "kekerasan dalam rumah tangga", "kdrt",
  "dibully", "diperas", "ananipiga", "wananipiga", "unyanyasaji", "amenibaka", "ubakaji", "ananigusa", "ananitishia",
  // vi, hi, bn, ur, fa, ar
  "=đánh tôi", "=đánh em", "=bạo hành", "=lạm dụng", "=xâm hại", "=hiếp dâm", "=đe dọa", "=bắt nạt", "=tống tiền", "मुझे मारता", "मुझे मारती",
  "पीटता", "पीटते", "यौन शोषण", "बलात्कार", "धमकी", "घरेलू हिंसा", "mujhe maarta", "mujhe marta", "dhamki", "আমাকে মারে", "মারধর", "যৌন নির্যাতন",
  "ধর্ষণ", "হুমকি", "পারিবারিক সহিংসতা", "مجھے مارتا", "مجھے مارتی", "پٹائی", "جنسی زیادتی", "زیادتی", "دھمکی", "گھریلو تشدد", "مرا می‌زند",
  "منو میزنه", "کتک", "آزار جنسی", "تجاوز", "تهدید", "خشونت خانگی", "اخاذی", "يضربني", "تضربني", "يضربونني", "تحرش", "اغتصاب", "يلمسني", "يهددني",
  "عنف أسري", "تنمر", "ابتزاز", "صور عارية",
  // zh, ja, ko, th
  "他打我", "她打我", "打我了", "总是打我", "總是打我", "打骂我", "打罵我", "家暴", "性侵", "强奸", "強姦", "猥亵", "猥褻", "摸我", "威胁我", "威脅我", "霸凌", "欺负我", "欺負我", "勒索", "裸照", "殴られ",
  "叩かれ", "暴力を振る", "虐待", "性的虐待", "レイプ", "触られ", "脅され", "いじめ", "裸の写真", "때려", "폭력", "학대", "성폭행", "성추행", "협박", "괴롭힘", "왕따", "나체 사진", "ตีฉัน",
  "ทำร้ายร่างกาย", "ล่วงละเมิด", "ข่มขืน", "ลวนลาม", "ความรุนแรงในครอบครัว", "กลั่นแกล้ง", "แบล็กเมล", "รูปโป๊",
];

const NEVARNOST = [
  // sl
  "?požar ", "požaru", "gori hiša", "gori v hiši", "gori v stanovanju", "gori v sobi", "gori v kuhinji", "gori v bloku", "polno dima", "puno dima",
  "hiša gori", "gori stanovanje", "stanovanje gori", "gori soba", "gori kuhinja", "dim v sobi", "dim v hiši", "dim v stanovanju", "veliko dima",
  "diši po plinu", "smrdi po plinu", "vonj po plinu", "vonja po plinu", "uhaja plin", "puščanje plina", "imamo poplavo", "poplavlja nam",
  "poplavilo nam", "voda nam teče v", "voda vdira", "nekdo je vdrl", "vlomilec",
  // hr, sr, bs
  "gori kuća", "kuća gori", "gori stan", "dim u kući", "dim u sobi", "miriše na plin", "smrdi na plin", "miris plina", "curi plin", "provalnik",
  "netko je provalio", "neko je provalio",
  // en
  "house is on fire", "is on fire", "fire in the", "fire in my", "fire in our", "smell gas", "smells like gas", "smells of gas", "gas leak",
  "smoke everywhere", "lots of smoke", "flooding", "someone broke in", "broke in", "breaking in", "broke into", "intruder", "carbon monoxide alarm",
  // de, fr, es, it, pt
  "es brennt", "haus brennt", "wohnung brennt", "feuer in der", "riecht nach gas", "gasgeruch", "gasleck", "überschwemmung", "einbrecher", "au feu",
  "il y a le feu", "incendie", "la maison brûle", "odeur de gaz", "ça sent le gaz", "fuite de gaz", "inondation", "cambrioleur", "incendio",
  "se quema la casa", "huele a gas", "fuga de gas", "inundación", "alguien entró", "va a fuoco", "brucia la casa", "puzza di gas", "odore di gas",
  "fuga di gas", "alluvione", "ladro in casa", "incêndio", "pegando fogo", "cheiro de gás", "vazamento de gás", "inundação", "enchente",
  // pl, cs, sk, hu, ro, sq
  "?pożar ", "pali się dom", "pali się mieszkanie", "w domu pali się", "zapach gazu", "czuć gaz", "wyciek gazu", "ulatnia się gaz", "powódź",
  "włamywacz", "?požár ", "hoří dům", "hoří byt", "cítím plyn", "zápach plynu", "uniká plyn", "povodeň", "?požiar ", "horí dom", "horí byt",
  "cítim plyn", "tűz van", "ég a ház", "gázszag", "szivárog a gáz", "árvíz", "betörő", "incendiu", "arde casa", "miroase a gaz", "scurgere de gaz",
  "inundație", "zjarr në", "digjet shtëpia", "erë gazi", "rrjedhje gazi", "përmbytje",
  // mk, ru, uk
  "?пожар ", "гори куќата", "мириса на гас", "истекува гас", "имаме поплава", "поплава во", "провалник", "горит дом", "горит квартира",
  "пахнет газом", "утечка газа", "наводнение", "кто то залез", "пожежа", "горить будинок", "пахне газом", "витік газу", "повінь",
  // tr, id, sw, vi
  "yangın", "ev yanıyor", "gaz kokusu", "gaz kaçağı", "sel bastı", "kebakaran", "rumah terbakar", "bau gas", "gas bocor", "kebocoran gas", "banjir",
  "moto unawaka", "nyumba inaungua", "harufu ya gesi", "gesi inavuja", "mafuriko", "=cháy nhà", "=hỏa hoạn", "=đám cháy", "=mùi gas", "=rò rỉ khí",
  "=lũ lụt", "=ngập lụt",
  // hi, bn, ur, fa, ar
  "आग लग", "गैस की गंध", "गैस लीक", "बाढ़", "aag lag", "gas leak", "আগুন লেগেছে", "গ্যাসের গন্ধ", "গ্যাস লিক", "বন্যা", "آگ لگ", "گیس کی بو",
  "گیس لیک", "سیلاب", "آتش سوزی", "آتش‌سوزی", "آتش گرفت", "بوی گاز", "نشت گاز", "حريق", "النار في", "رائحة غاز", "تسرب غاز", "فيضان",
  // zh, ja, ko, th
  "着火", "著火", "失火", "火灾", "火災", "煤气味", "煤氣味", "燃气泄漏", "瓦斯外洩", "漏气", "漏氣", "火事", "燃えてる", "ガス臭い", "ガス漏れ", "불이 났", "불났", "화재", "가스 냄새", "가스가 새",
  "ไฟไหม้", "กลิ่นแก๊ส", "แก๊สรั่ว", "น้ำท่วม",
];

// Vročina: beseda za vročino in število 40–45 (°C) ali 104–113 (°F) blizu nje.
const VROCINA = [
  "vročin", "vročino", "fever", "groznic", "fieber", "fièvre", "fiebre", "febbre", "febre", "gorączk", "horečk", "horúčk", "láz", "febră", "ethe",
  "треска", "жар", "лихорад", "гарячк", "ateş", "ateşi", "demam", "homa", "=sốt", "बुखार", "bukhar", "bukhaar", "জ্বর", "بخار", "تب ", "حمى", "发烧",
  "發燒", "高烧", "高燒", "熱が", "高熱", "열이", "고열", "ไข้",
];
// Temperatura sama ni znak (»voda ima 42 °C«): šteje le skupaj z osebo (brat, mama, imam …).
const TEMPERATURA = ["temperatur", "температур", "حرارة", "체온", "体温", "體溫", "ไข้"];
const OSEBA = [
  "brat", "sestr", "mama", "mami", "oči", "ati", "tata", "otrok", "sin ", "hči", "hčer", "babi", "dedi", "imam", "moj", "moja", "mojemu", "prijatel",
  "sošol", "dijete", "dete", "djete", "baka", "deda", "drug", "brother", "sister", "mom", "mum", "dad", "child", "son ", "daughter", "friend",
  "grandma", "grandpa", "i have", "he has", "she has", "my ", "bruder", "schwester", "kind", "ich habe", "mein", "брат", "сестр", "мама", "ребен",
  "дете",
];
// Dojenček + znak bolezni (tudi brez števila).
const DOJENCEK = [
  "dojenček", "novorojen", "baby", "infant", "newborn", "beba", "bebe", "bebi", "säugling", "bébé", "bebé", "neonat", "bebê", "niemowl", "kojenec",
  "dojča", "csecsemő", "bebeluș", "foshnj", "бебе", "младен", "грудн", "немовл", "bebek", "bayi", "mtoto mchanga", "=em bé", "शिशु", "رضيع", "婴儿",
  "嬰兒", "赤ちゃん", "아기", "ทารก",
];
const DOJENCEK_ZNAK = [
  ...VROCINA,
  "temperatur", "ne pije", "ne je ", "noče pit", "bruha", "mlahav", "zelo zaspan", "pomodr", "modre ustnice", "ne joka", "povraća", "povraca",
  "ne jede", "mlitav", "poplav", "plave usne", "vomit", "not drinking", "wont feed", "not feeding", "floppy", "turning blue", "blue lips",
  "very sleepy", "trinkt nicht", "erbricht",
];

// Pripravljeni vzorci: { re } za latinico in ostale pisave s presledki (začetek besede), { sub } za
// pisave brez presledkov, { raw } za znake z »=« (primerja se lower(), s šumniki).
const NOSPACE = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}]/u;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function compile(list) {
  return list.map((p0) => {
    // »?« = šibek znak (pogost tudi v snovi): ne šteje v vprašanju o snovi (SNOV spodaj).
    const weak = p0.startsWith("?");
    const p = weak ? p0.slice(1) : p0;
    if (weak) return { ...compile([p])[0], weak };
    if (p.startsWith("=")) return { raw: lower(p.slice(1)) };
    const n = normalize(p);
    if (NOSPACE.test(n)) return { sub: n };
    // Presledek na koncu (»sin «) pomeni celo besedo.
    const whole = /\s$/.test(p);
    return {
      re: new RegExp(`(?:^|[^\\p{L}\\p{N}])${esc(n)}${whole ? "(?![\\p{L}\\p{N}])" : ""}`, "u"),
    };
  });
}
const PATTERNS = {
  stiska: compile(STISKA),
  nasilje: compile(NASILJE),
  zdravje: compile(ZDRAVJE),
  nevarnost: compile(NEVARNOST),
};
const P_VROCINA = compile(VROCINA);
const P_TEMP = compile(TEMPERATURA);
const P_OSEBA = compile(OSEBA);
const P_DOJENCEK = compile(DOJENCEK);
const P_DOJENCEK_ZNAK = compile(DOJENCEK_ZNAK);

// Indeks prvega ujemanja ali -1. norm je lahko seznam (besedilo in besedilo brez polnil).
function find(pats, norm, low, snov = false) {
  if (Array.isArray(norm)) {
    for (const n of norm) {
      const i = find(pats, n, low, snov);
      if (i >= 0) return i;
    }
    return -1;
  }
  for (const p of pats) {
    if (p.weak && snov) continue;
    if (p.raw) {
      const i = low.indexOf(p.raw);
      if (i >= 0) return i;
    } else if (p.sub) {
      const i = norm.indexOf(p.sub);
      if (i >= 0) return i;
    } else {
      const m = p.re.exec(norm);
      if (m) return m.index;
    }
  }
  return -1;
}
const any = (pats, norm, low, snov) => find(pats, norm, low, snov) >= 0;

// Polnila med besedami (»mama me SPET tepe«, »me JE udarila«, »sošolci me VSAK DAN pretepajo«): drugo
// iskanje teče po besedilu brez njih, zato znak ujame tudi vrinjene besede (pregled A, C: 6. 11.).
const POLNILA = new RegExp(
  "(?<=^| )(?:" +
    [
      "spet", "zopet", "ponovno", "stalno", "vedno", "zmeraj", "vsak dan", "vsaki dan", "res", "cisto", "zdaj", "sedaj", "tudi", "ze", "vec", "je",
      "sem", "kar", "zmeraj", "najrajsi", "rajsi", "jutri", "opet", "jos", "vise", "uvijek", "stalno", "sad", "again", "always", "still", "really",
      "now", "anymore", "already", "constantly", "just", "bolse", "bilse", "juz", "mar", "mai", "povekje", "poveke", "noch", "immer", "schon",
    ].join("|") +
    ")(?=[ ,.]|$)",
  "g",
);
const brezPolnil = (norm) => norm.replace(POLNILA, " ").replace(/\s+/g, " ").trim();

// Vprašanje o snovi (»Kaj je srčni napad?«, »Kako se je Sokrat zastrupil?«): šibki znaki ne štejejo.
const SNOV =
  /^(?:kaj (?:je|so|pomeni|pomenijo)|kdaj (?:je|so)|kdo je|kako (?:se je|je|so|deluje|nastane)|zakaj|razlozi|opisi|napisi|what (?:is|are|was|were)|why|how (?:does|do|did)|explain|describe)(?=[ ,.]|$)/;

// Opisi z več deli (oseba … stanje, padec … se ne odziva, izsiljevanje s slikami) kot izrazi nad normalize().
const OS =
  "(?:brat\\S*|bratec\\S*|sestr\\S*|mam\\S*|mami|oc[ei]\\S*|ati|tat\\S*|ded\\S*|bab\\S*|dojenc\\S*|otrok\\S*|prijatel\\S*|sosol\\S*|beb\\S*|sin|hci|hcer\\S*|dijete|dete|otac|majka|brother|sister|mom|mum|dad|baby|friend|on|ona)";
const R = (src) => ({ re: new RegExp(`(?:^| )${src}`) });
const IZRAZI = {
  zdravje: [
    R(
      `${OS}(?: \\S+){0,2} (?:je|so|postaja|postal\\S*|ratal\\S*|is|turned)(?: (?:cist\\S*|cel\\S*|ves|vsa|potpuno|sav|sva|all))? (?:modr[aeio]?|moder|pomodr\\S*|plav[aeio]?|poplavi[o]?|poplavila|blue)(?=[,.]|$| in | v obraz| ne | i | and )`,
    ),
    R(
      `(?:padl?[aeo]?|pal[ao]?|zgrud\\S*|collapsed|fell)(?: \\S+){0,4} (?:ne odgovarja|ne odziva|ne reagira|ne reaguje|ne odgovara|se ne premakne|wont respond|not responding)`,
    ),
    R(
      `(?:pojedl?\\S*|popil\\S*|spil\\S*|pogoltnil\\S*|progutao|progutala|popio|popila|swallowed|ate|drank)(?: \\S+){0,3} (?:tablet\\S*|cistil\\S*|zdravil\\S*|pilul\\S*|bleach|pills|lijek\\S*|lek\\S*)`,
    ),
    R(`pen[aei]?(?: \\S+){0,3} iz ust`),
    R(`${OS}(?: \\S+){0,4} pod vodo`),
    R(`porez\\S*(?: \\S+){0,3} kri`),
    R(`${OS} (?:ima|ma|has) (?:39|4[0-3])[.,]\\d`),
    R(
      `(?:pogoltnil\\S*|pojedl?\\S*|spil\\S*|progutao|progutala|swallowed)(?: \\S+){0,4} (?:baterij\\S*|magnet\\S*|cistil\\S*|steklenic\\S* za cisc\\S*|battery|magnet)`,
    ),
  ],
  stiska: [R(`(?:kms|kys myself)(?=[ ,.]|$)`), R(`se (?:bo|bom|bos|bi|bodo|ce|cu) (?:\\S+ )?ubi(?:l|la|li|jem|jes|t|ti)?(?=[ ,.]|$)`)],
  nasilje: [
    // kdo me tepe / pretepa / udari (tudi pretekli čas in vrinjene besede); grožnja »da me bo …«
    R(`me (?:\\S+ ){0,3}(?:tep[aeil]\\S*|pretep\\S*|udar[ijl]\\S*|brc[ae]\\S*|tuku|tukl\\S*|tuc[ae]\\S*|zlorab\\S*|posil\\S*)`),
    R(`(?:groz|prijet|pret|rekel|rekla|pravi|napisal\\S*|zagroz)\\S*(?: \\S+){0,3} da me (?:bo|bodo|ce|cu)(?=[ ,.]|$)`),
    R(`(?:sili|hoce|zahteva|tera)\\S*(?: \\S+){0,3} (?:da se slec|da se skin|slec)\\S*`),
    R(
      `(?:dad|mom|mum|father|mother|stepdad|stepmom|brother|he|she|they|uncle|teacher) (?:\\S+ ){0,2}(?:beat|beats|hit|hits|kicked|kicks|punched|punches|slapped|slaps|choked|chokes) me(?=[ ,.]|$)`,
    ),
    // izsiljevanje s slikami (tudi na spletu): slike … ali/drugače … objavim; grozi … objaviti … slike; denar … drugače.
    R(
      `(?:slik|fotk|posnet|pics?|photos?|pictures?|nudes?|bilder|fotos?)\\S*(?: \\S+){0,3} (?:ali|al pa|drugace|sicer|ili|or|otherwise|sonst|o)(?: \\S+){0,3} (?:objavim|posljem|razposljem|delim|objavit\\S*|objavil\\S*|objavi[cs]\\S*|posalj[ue]m|post|leak|share|veroffentlich\\S*|publico|pubblico)(?=[ ,.]|$)`,
    ),
    R(
      `(?:groz|prijet|pret|threat|droh|amenaz|minacc|menac|amea|ugroz)\\S*(?: \\S+){0,4} (?:objav|posl|razposl|post|leak|share|publi|veroffentl|pubblic|vylo|deli)\\S*(?: \\S+){0,3} (?:slik|fotk|posnet|pics?|photos?|pictures?|nudes?|bild|foto|fotos)\\S*`,
    ),
    R(`(?:groz|droh|threat)\\S*(?: \\S+){0,3} (?:slik|fotk|pics?|photos?|bilder|fotos)\\S*(?: \\S+){0,2} (?:zu )?(?:objav|post|leak|share|veroffentl)\\S*`),
    R(`(?:hoce|zahteva|wants|trazi|hoce)(?: \\S+){0,3} (?:evr|eur|denar|money|novc|para|kn)\\S*(?: \\S+){0,3} (?:drugace|sicer|ali|or|otherwise|ili)`),
  ],
  nevarnost: [
    R(`(?:smrdi|disi|vonja|mirise|smrdi) (?:\\S+ )?(?:po|na|kot) pl[aiu]?n`),
    R(`v (?:kuhinji|hisi|sobi|stanovanju|bloku|garazi|kleti|kuci|stanu|sobi) gori(?=[ ,.]|$)`),
  ],
};
const izraz = (vrsta, norms) => norms.some((n) => IZRAZI[vrsta].some((r) => r.re.test(n)));

// Število 40–45 (°C, tudi 40,5) ali 104–113 (°F) v oknu okoli besede za vročino.
function feverNumber(norm, at) {
  const win = norm.slice(Math.max(0, at - 20), at + 40);
  for (const m of win.matchAll(/(?<![\p{N}.,])(\d{2,3})(?:[.,](\d))?(?![\p{N}])/gu)) {
    const v = Number(`${m[1]}.${m[2] || 0}`);
    if ((v >= 40 && v <= 45) || (v >= 104 && v <= 113)) return true;
  }
  return false;
}
function fever(norm, low) {
  for (const pats of [P_VROCINA, P_TEMP]) {
    for (const p of pats) {
      // Vsa ujemanja vzorca (beseda se lahko ponovi); znak z »=« išče v besedilu s šumniki.
      const src = p.raw ? low : norm;
      const hits = [];
      if (p.raw || p.sub) for (let i = src.indexOf(p.raw || p.sub); i >= 0; i = src.indexOf(p.raw || p.sub, i + 1)) hits.push(i);
      else for (const m of norm.matchAll(new RegExp(p.re.source, "gu"))) hits.push(m.index);
      if (hits.some((i) => feverNumber(src, i)) && (pats === P_VROCINA || any(P_OSEBA, norm, low))) return true;
    }
  }
  return false;
}

/** Vrsta nujnega primera ali null. Stiska in nasilje pred zdravjem (zahtevata drugačen odgovor). */
export function zaznajNujno(text) {
  const low = lower(text);
  if (!low.trim()) return null;
  const norm = normalize(text);
  const norms = [norm, brezPolnil(norm)];
  const snov = SNOV.test(norm);
  if (any(PATTERNS.stiska, norms, low, snov) || izraz("stiska", norms)) return "stiska";
  if (any(PATTERNS.nasilje, norms, low, snov) || izraz("nasilje", norms)) return "nasilje";
  if (any(PATTERNS.zdravje, norms, low, snov) || izraz("zdravje", norms) || fever(norm, low)) return "zdravje";
  if (any(P_DOJENCEK, norm, low) && any(P_DOJENCEK_ZNAK, norm, low)) return "zdravje";
  if (any(PATTERNS.nevarnost, norms, low, snov) || izraz("nevarnost", norms)) return "nevarnost";
  return null;
}

export const VRSTE = ["zdravje", "stiska", "nasilje", "nevarnost"];

// --- številke za pomoč -------------------------------------------------------------------------
// Slovenija: 112 (reševalci, gasilci), 113 (policija), TOM 116 111 (vsak dan 12–20), Samarijan 116 123
// (vedno). Imena služb (TOM, Samarijan, Hrabri telefon …) se pokažejo samo v njihovi državi (j, 6. 11.).
//
// DRZAVE: preverjene številke po državi (viri v PR #479, 6. 11. 2026). sos = splošna številka za nujno
// pomoč; kjer 112 še ne deluje (RS, BA, MK), po vrsti: reševalci (zdravje, stiska), gasilci (nevarnost),
// policija (nasilje). Linije samo z brezplačno številko; ure: [vrsta, od, do] (vedno | delavniki | ponSob).
export const DRZAVE = {
  HR: { sos: "112", policija: "192", otroci: { ime: "Hrabri telefon", st: "116 111", ure: ["delavniki", 9, 20] } },
  RS: { sos: "194", gasilci: "193", policija: "192", otroci: { ime: "NADEL", st: "116 111", ure: ["vedno"] } },
  BA: { sos: "124", gasilci: "123", policija: "122", otroci: { ime: "Plavi telefon", st: "080 05 03 05" } },
  MK: { sos: "194", gasilci: "193", policija: "192" },
  AL: { sos: "112", policija: "129", otroci: { ime: "ALO 116 111", st: "116 111", ure: ["vedno"] } },
  AT: {
    sos: "112",
    policija: "133",
    otroci: { ime: "Rat auf Draht", st: "147", ure: ["vedno"] },
    odrasli: { ime: "Telefonseelsorge", st: "142", ure: ["vedno"] },
  },
  DE: {
    sos: "112",
    policija: "110",
    otroci: { ime: "Nummer gegen Kummer", st: "116 111", ure: ["ponSob", 14, 20] },
    odrasli: { ime: "TelefonSeelsorge", st: "0800 111 0 111", ure: ["vedno"] },
  },
};

// Država naprave brez poizvedb pri tretjih: najprej časovni pas (Europe/Zagreb …), nato regija jezika (hr-HR).
const PAS = {
  "Europe/Ljubljana": "SI", "Europe/Zagreb": "HR", "Europe/Belgrade": "RS", "Europe/Sarajevo": "BA", "Europe/Skopje": "MK",
  "Europe/Tirane": "AL", "Europe/Vienna": "AT", "Europe/Berlin": "DE", "Europe/Busingen": "DE",
};
export function drzavaNaprave(tz, jeziki) {
  try {
    tz ??= Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {}
  if (PAS[tz]) return PAS[tz];
  const list = jeziki ?? (typeof navigator === "undefined" ? [] : navigator.languages?.length ? navigator.languages : [navigator.language]);
  for (const l of list || []) {
    const r = String(l || "").split(/[-_]/)[1]?.toUpperCase();
    if (r && /^[A-Z]{2}$/.test(r)) return r;
  }
  return "";
}

// Številka za nujno pomoč iz besedila »help« (public/regions.js): reševalci pred policijo (pregled C).
function izPomoci(help) {
  const num = (word) =>
    help.match(new RegExp(`${word}\\s+([0-9][0-9 -]*[0-9]|[0-9]+)`, "i"))?.[1]?.trim() ||
    help.match(new RegExp(`([0-9]+)\\s*\\(${word}\\)`, "i"))?.[1];
  return num("ambulance") || num("emergency") || num("rescue") || num("police") || "112";
}

/**
 * Številke za varnostni odgovor.
 * @param {object} settings  nastavitve profila (school_system, educational_track)
 * @param {string} naprava   država naprave (drzavaNaprave()); šteje, ko šolski sistem ni druga država
 */
export function stevilke(settings = {}, naprava = "") {
  const sys = settings?.school_system;
  const faks = jeFaks(settings);
  const regional = isRegional(sys) && sys !== "INTL";
  const drzava = regional ? SCHOOL_SYSTEMS[sys].country : String(naprava || "").toUpperCase();
  const d = DRZAVE[drzava];
  if (d) {
    const sosZa = { zdravje: d.sos, stiska: d.sos, nevarnost: d.gasilci || d.sos, nasilje: d.gasilci ? d.policija : d.sos };
    return { si: false, drzava, faks, sos: d.sos, sosZa, policija: d.policija, linije: { otroci: d.otroci || null, odrasli: d.odrasli || null } };
  }
  // Drug šolski sistem ali naprava v državi z vpisanim sistemom: besedilo »help«; sicer Slovenija.
  const id = regional ? sys : drzava && drzava !== "SI" && COUNTRY_SYSTEM[drzava];
  if (!id || !SCHOOL_SYSTEMS[id]) return { si: true, drzava: "SI", faks, sos: "112", policija: "113", otroci: "116 111", odrasli: "116 123" };
  const help = SCHOOL_SYSTEMS[id].help || "";
  return { si: false, drzava, faks, sos: izPomoci(help), pomoc: help || null };
}

// Številke v besedilu kot samostojen del od leve proti desni (LRI … PDI): v arabščini, perzijščini in urdujščini
// bi se »116 111« sicer prikazala kot »111 116« (posnetek ar, 6. 11.).
const LTR = ["sos", "policija", "otroci", "odrasli", "stevilka", "n"];
export const izoliraj = (p = {}) => Object.fromEntries(Object.entries(p).map(([k, v]) => [k, LTR.includes(k) && v ? `\u2066${v}\u2069` : v]));

// Telefonska povezava za gumb »Pokliči« (samo številke).
export const telHref = (n) => `tel:${String(n).replace(/[^0-9+]/g, "")}`;

// Ure linije kot [ključ i18n, parametri]; vmesnik ga prevede in vstavi v {ure}.
const ure = (u) => (!u ? null : u[0] === "vedno" ? ["nujno.ure.vedno", {}] : [`nujno.ure.${u[0]}`, { od: u[1], do: u[2] }]);

/**
 * Vrstice varnostnega odgovora kot [ključ i18n, parametri]. t(ključ, parametri) jih prevede; parameter
 * »ure« je sam [ključ, parametri] (najprej ga prevedi).
 * @param {string} vrsta  zdravje | stiska | nasilje | nevarnost
 * @param {object} st     stevilke(settings, naprava)
 */
export function vrstice(vrsta, st) {
  const sos = st.sosZa?.[vrsta] || st.sos;
  const p = { sos, policija: st.policija, otroci: st.otroci, odrasli: st.odrasli, pomoc: st.pomoc };
  const L = (k, extra = {}) => [`nujno.${k}`, { ...p, ...extra }];
  const lin = (k, l) => L(l.ure ? k : `${k}BrezUr`, { ime: l.ime, stevilka: l.st, ure: ure(l.ure) });
  if (vrsta === "zdravje") return [L("zdravje.naslov"), L("zdravje.1"), L("zdravje.2"), L("zdravje.3"), L("zdravje.4")];
  if (st.linije) {
    // Država iz tabele DRZAVE: študent najprej linija za odrasle (če obstaja), sicer otroška linija.
    const { otroci, odrasli } = st.linije;
    const prva = st.faks ? odrasli || null : otroci || odrasli;
    const druga = !st.faks && otroci && odrasli && otroci.ure?.[0] !== "vedno" ? odrasli : null;
    if (vrsta === "stiska") {
      const pomoc = [...(prva ? [lin("linija", prva)] : []), ...(druga ? [L("linijaDrugic", { ime: druga.ime, stevilka: druga.st, ure: ure(druga.ure) })] : [])];
      return [L("stiska.naslov"), L("stiska.1"), ...pomoc, L("stiska.112"), L("stiska.vprasanje")];
    }
    if (vrsta === "nasilje") {
      const zadnja = prva ? [lin("nasilje.linija", prva)] : [];
      return [L("nasilje.naslov"), L(st.policija && st.policija !== sos ? "nasilje.1" : "nasilje.1b"), L("nasilje.2"), ...zadnja];
    }
    return [L("nevarnost.naslov"), L("nevarnost.1"), L("nevarnost.2"), L("nevarnost.3")];
  }
  if (vrsta === "stiska") {
    const pomoc = !st.si ? (st.pomoc ? [L("stiska.drugje")] : []) : st.faks ? [L("stiska.faks")] : [L("stiska.tom"), L("stiska.sam")];
    return [L("stiska.naslov"), L("stiska.1"), ...pomoc, L("stiska.112"), L("stiska.vprasanje")];
  }
  if (vrsta === "nasilje") {
    const zadnja = !st.si ? (st.pomoc ? [L("stiska.drugje")] : []) : st.faks ? [L("nasilje.faks")] : [L("nasilje.tom")];
    return [L("nasilje.naslov"), L(st.si ? "nasilje.1" : "nasilje.1b"), L("nasilje.2"), ...zadnja];
  }
  return [L("nevarnost.naslov"), L("nevarnost.1"), L("nevarnost.2"), L("nevarnost.3")];
}

// Gumbi za klic po vrsti (vrstni red kot v kartici).
export function klici(vrsta, st) {
  const sos = st.sosZa?.[vrsta] || st.sos;
  if (st.linije) {
    const { otroci, odrasli } = st.linije;
    const prva = st.faks ? odrasli : otroci || odrasli;
    const druga = !st.faks && otroci && odrasli && otroci.ure?.[0] !== "vedno" ? odrasli : null;
    const pol = st.policija && st.policija !== sos ? st.policija : null;
    if (vrsta === "stiska") return [prva?.st, druga?.st, sos].filter(Boolean);
    if (vrsta === "nasilje") return [sos, pol, prva?.st].filter(Boolean);
    return [sos];
  }
  if (!st.si) return [st.sos];
  if (vrsta === "stiska") return st.faks ? [st.odrasli, st.sos] : [st.otroci, st.odrasli, st.sos];
  if (vrsta === "nasilje") return st.faks ? [st.sos, st.policija, st.odrasli] : [st.sos, st.policija, st.otroci];
  return [st.sos];
}
