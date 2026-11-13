// Kotiček zanimanj: področja, ki jih učenec izbere v vprašalniku, in viri novic zanje.
// Isti seznam uporabljajo strežnik (server/corner.js: viri, filtri), register nastavitev
// (inštruktor jih spremeni iz klepeta) in vmesnik (public/corner.js). Imena v vmesniku so
// prevodi `int.<id>` v public/i18n; `name` in `en` sta za inštruktorja in iskanje po imenu.
//
// Viri (ključi v FEEDS spodaj). Pripona »?« pomeni, da vir pokriva več področij, zato
// iz njega vzamemo samo novice, ki se ujemajo s `kw` področja.
// Viri so ugledni in primerni za mlade: Science News Explores (pisano za 9–14 let),
// ScienceDaily, NASA, ESA in slovenska MMC RTV SLO (Znanost in tehnologija, Okolje) ter Kvarkadabra.

export const INTERESTS = [
  { id: "space", emoji: "🚀", name: "vesolje in astronomija", en: "space and astronomy",
    feeds: ["sne:space", "sd:space_time", "esa:Space_Science", "nasa"],
    kw: /vesolj|astronom|planet|zvezd|galaks|\bmars|raket|\bnasa\b|\besa\b|komet|asteroid|satelit|teleskop|space|astronom|planet|galax|rocket|comet|telescope|lunar|\bmoon/i },
  { id: "ai", emoji: "🤖", name: "umetna inteligenca", en: "artificial intelligence",
    feeds: ["sd:computers_math/artificial_intelligence", "sne:computing?", "sne:tech?"],
    kw: /umetn\w* inteligenc|\bUI\b|\bAI\b|klepetaln|jezikovn\w* model|strojn\w* učenj|artificial intelligence|machine learning|neural network|chatbot|language model/i },
  { id: "robots", emoji: "🦾", name: "robotika", en: "robotics",
    feeds: ["sd:computers_math/robotics", "sne:tech?", "sne:computing?"],
    kw: /robot|dron|drone/i },
  { id: "coding", emoji: "💻", name: "računalništvo in programiranje", en: "computing and programming",
    feeds: ["sne:computing", "sd:computers_math/computer_programming", "sd:computers_math/quantum_computers"],
    kw: /računalni|programir|kvantn\w* računal|algorit|kibernet|computer|software|coding|program|quantum comput|algorithm|cyber/i },
  { id: "math", emoji: "🔢", name: "matematika in uganke", en: "mathematics and puzzles",
    feeds: ["sne:math", "sd:computers_math/mathematics"],
    kw: /matemati|uganke|število|math|puzzle|prime number|geometr/i },
  { id: "physics", emoji: "⚛️", name: "fizika", en: "physics",
    feeds: ["sne:physics", "sd:matter_energy/physics"],
    kw: /fizik|delc|cern|kvant|svetlob|laser|physic|particle|quantum|light|laser|gravity/i },
  { id: "chemistry", emoji: "🧪", name: "kemija in materiali", en: "chemistry and materials",
    feeds: ["sne:chemistry", "sne:materials-science", "sd:matter_energy/chemistry"],
    kw: /kemij|kemik|molekul|element|materia|plastik|chemi|molecul|material|plastic|element/i },
  { id: "animals", emoji: "🐾", name: "živali", en: "animals",
    feeds: ["sne:animals", "sd:plants_animals/animals"],
    kw: /žival|ptic|ptič|medved|volk|ris\b|insekt|žuželk|\bkit\b|delfin|animal|bird|insect|mammal|whale|dolphin|shark|frog/i },
  { id: "plants", emoji: "🌱", name: "rastline in gozdovi", en: "plants and forests",
    feeds: ["sne:plants", "sne:agriculture?", "sd:plants_animals?"],
    kw: /rastlin|drev|gozd|cvet|gliv|plant|tree|forest|flower|fung|seed|crop/i },
  { id: "dinosaurs", emoji: "🦕", name: "dinozavri in fosili", en: "dinosaurs and fossils",
    feeds: ["sne:fossils", "sd:fossils_ruins/dinosaurs"],
    kw: /dinozav|fosil|okamnin|dinosaur|fossil|paleont/i },
  { id: "earth", emoji: "🌋", name: "vulkani, potresi in Zemlja", en: "volcanoes, earthquakes and Earth",
    feeds: ["sne:earth", "sd:earth_climate/volcanoes", "sd:earth_climate/earthquakes"],
    kw: /vulkan|potres|geolog|kamnin|jam[aei]\b|volcan|earthquake|geolog|rock|cave/i },
  { id: "climate", emoji: "🌍", name: "podnebje in okolje", en: "climate and environment",
    feeds: ["sne:climate", "sd:earth_climate/climate", "esa:Observing_the_Earth"],
    kw: /podneb|ogljik|segrevanj|toplogred|emisij|ledenik|onesnaž|recikl|climate|carbon|warming|greenhouse|glacier|pollut|recycl/i },
  { id: "oceans", emoji: "🌊", name: "oceani in morje", en: "oceans and the sea",
    feeds: ["sne:oceans", "sd:earth_climate/oceanography"],
    kw: /ocean|morj|morsk|korald|ocean|\bsea\b|coral|marine/i },
  { id: "body", emoji: "🫀", name: "človeško telo in zdravje", en: "human body and health",
    feeds: ["sne:health-medicine", "sd:health_medicine/human_biology"],
    kw: /telo|zdravj|medicin|cepiv|srce|kost|mišic|body|health|medicin|vaccin|heart|bone|muscle/i },
  { id: "brain", emoji: "🧠", name: "možgani in psihologija", en: "brain and psychology",
    feeds: ["sne:brain", "sd:mind_brain"],
    kw: /možgan|psiholog|spomin|spanj|brain|psycholog|memory|sleep|neuro/i },
  { id: "genetics", emoji: "🧬", name: "geni in DNK", en: "genes and DNA",
    feeds: ["sne:genetics", "sd:plants_animals/genetics"],
    kw: /\bgen[aiou]?\b|genet|\bdnk\b|\bdna\b|genom|crispr|gene/i },
  { id: "microbes", emoji: "🦠", name: "mikrobi in virusi", en: "microbes and viruses",
    feeds: ["sne:microbes"],
    kw: /mikrob|bakterij|virus|microb|bacteri|virus/i },
  { id: "energy", emoji: "⚡", name: "energija in elektrika", en: "energy and electricity",
    feeds: ["sd:matter_energy/energy_technology", "sd:matter_energy/nuclear_energy", "sne:tech?"],
    kw: /energij|elektrar|sončn\w* celic|baterij|jedrsk|vetrn|elektrik|energy|power plant|solar|battery|nuclear|wind|electric/i },
  { id: "inventions", emoji: "💡", name: "tehnologija in izumi", en: "technology and inventions",
    feeds: ["sne:tech", "sd:top/technology", "sd:matter_energy/engineering", "rtv:09"],
    kw: /tehnolog|izum|inovac|technolog|invent|engineer/i },
  { id: "transport", emoji: "✈️", name: "letala, avtomobili in rakete", en: "planes, cars and rockets",
    feeds: ["sd:matter_energy/aviation", "sd:matter_energy/automotive_and_transportation", "sne:tech?"],
    kw: /letal|avtomobil|\bavto|raket|vlak|vozil|aircraft|airplane|plane\b|\bcar\b|cars\b|rocket|train|vehicle/i },
];

export const INTEREST_IDS = INTERESTS.map((i) => i.id);
export const MAX_INTERESTS = 8;
export const NEWS_LEVELS = ["auto", "simple", "all"];
export const NEWS_LANGS = ["all", "mine"];

// Viri: ključ → [naslov, ime vira, jezik, zahtevnost]. simple = pisano za mlade ali širšo javnost.
const SNE = (topic) => [`https://www.snexplores.org/topic/${topic}/feed`, "Science News Explores", "en", "simple"];
const SD = (p) => [`https://www.sciencedaily.com/rss/${p}.xml`, "ScienceDaily", "en", "deep"];
const ESA = (p) => [`https://www.esa.int/rssfeed/Our_Activities/${p}`, "ESA", "en", "deep"];
const RTV = (n) => [`https://img.rtvslo.si/feeds/${n}.xml`, "MMC RTV SLO", "sl", "simple"];

export function feedInfo(key) {
  const [kind, arg] = key.replace(/\?$/, "").split(":");
  const f =
    kind === "sne" ? SNE(arg) : kind === "sd" ? SD(arg) : kind === "esa" ? ESA(arg) : kind === "rtv" ? RTV(arg)
    : kind === "nasa" ? ["https://www.nasa.gov/news-release/feed/", "NASA", "en", "deep"]
    : kind === "kvarkadabra" ? ["https://kvarkadabra.net/feed/", "Kvarkadabra", "sl", "simple"]
    : kind === "snemain" ? ["https://www.snexplores.org/feed", "Science News Explores", "en", "simple"]
    : null;
  if (!f) return null;
  return { key: key.replace(/\?$/, ""), url: f[0], source: f[1], lang: f[2], level: f[3], filtered: key.endsWith("?") };
}

// Slovenski viri splošne znanosti: pri vsakem področju (samo novice, ki imajo besedo področja v naslovu).
export const SL_POOL = ["rtv:09?", "rtv:12?", "kvarkadabra?"];
// Vir za lastno temo učenca (iskanje po ključnih besedah).
export const CUSTOM_POOL = ["snemain?", "sd:top/science?", "sd:top/technology?", "rtv:09?", "rtv:12?", "kvarkadabra?"];

export const interestById = (id) => INTERESTS.find((i) => i.id === id) || null;

// Ime ali id (»vesolje«, »space«, »Robotika«) → id; null, če ga ni.
export function findInterest(text) {
  const q = String(text ?? "").trim().toLowerCase();
  if (!q) return null;
  const exact = INTERESTS.find((i) => i.id === q || i.name === q || i.en === q);
  if (exact) return exact.id;
  const part = INTERESTS.filter((i) => i.name.includes(q) || i.en.includes(q) || q.includes(i.id) || i.name.split(/[ ,]+/).some((w) => w.length > 3 && q.includes(w.slice(0, -1))));
  return part.length === 1 ? part[0].id : null;
}

// Seznam (ali besedilo z vejicami) → veljavni id-ji brez ponovitev, največ MAX_INTERESTS.
export function cleanInterests(value) {
  if (value === null || value === undefined) return null;
  const list = Array.isArray(value) ? value : String(value).split(",");
  return [...new Set(list.map((v) => (INTEREST_IDS.includes(v) ? v : findInterest(v))).filter(Boolean))].slice(0, MAX_INTERESTS);
}
