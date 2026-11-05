// Tipke kalkulatorja po poglavju (j 2026-11-04: »tipke, ki niso obvezne, naj se prilagodijo poglavju«).
// Števke, + − × ÷, oklepaji, puščice, 2nd in »⋯« ostanejo na mestu; ostalih 18 funkcijskih tipk
// znanstvenega kalkulatorja dobi vrstni red in izbor poglavja. Evklidova tipkovnica odpre ustrezno skupino f(x).
// Brez DOM (testi v test/tipke-poglavja.test.js).

// Poglavje → profil. Iščemo po id-ju in imenu teme (»MAT-SS-2/logaritem«), šele nato po imenu sklopa
// (»obrestni-racun« v sklopu »Zaporedja in vrste« je fin), brez šumnikov, sl in en.
const RULES = [
  ["cplx", /komplek|complex/],
  ["trig", /kotn[a-z]*-funkc|kotov|trigonom|sinus|kosinus|adicijsk|polarn|\btrig|sine|cosine/],
  ["log", /logarit|eksponent|exponent|potenc.*racional|\blog\b/],
  ["ana", /odvod|integral|limit|zvezn|diferencial|derivat|calculus|analiz(?!a[- ]varianc)|taylor|-vrst[ae]\b|in vrste\b/],
  ["comb", /kombinator|permutac|variac|combinator|binom/],
  ["stat", /statist|verjetn|varianc|regresij|podatk|probab|porazdel|frekvenc|vzor[ce]/],
  ["fin", /obrest|financ|kredit|interest|odstot|percent|procent/],
  ["geo", /geometr(?!ijsk[a-z]*[- ]zaporedj)|trikotnik|stirikotnik|krog|kroznic|telo|teles|povrsin|prostornin|pitagor|podobnost|mnogokotnik|triangle|circle|area|volume/],
  ["num", /cela-stevil|racionaln|\bulom|deljiv|delitel|praštevil|prastevil|fraction|integer|stevil/],
  ["eq", /enacb|neenacb|funkcij|polinom|izraz|zaporedj|equation|inequal|function|polynom|razstav|sequence/],
];
// drugi predmeti (biologija, geografija, računalništvo, ekonomija): »telo«, »izražanje«, »analiza«, »podatki«
// tam niso matematična poglavja, zato samo izrazita statistika in finance, sicer privzete tipke
const OTHER = [
  ["stat", /statist|verjetn|probab|varianc|regresij/],
  ["fin", /obrest|financ|kredit|interest/],
];

/** Profil za temo { id, unit, name, subject } ali null (privzete tipke). */
export function chapterProfile(topic) {
  if (!topic) return null;
  const norm = (...parts) =>
    parts
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
  const subj = String(topic.subject || topic.id || "").slice(0, 3).toUpperCase();
  if (subj === "KEM") return "kem";
  if (subj === "FIZ") return "fiz"; // »električni krog«, »plinska enačba«, »dimenzijska analiza« so fizika
  const rules = subj === "MAT" || !/^[A-Z]{3}$/.test(subj) ? RULES : OTHER;
  for (const text of [norm(topic.id, topic.name), norm(topic.unit)]) for (const [p, re] of rules) if (re.test(text)) return p;
  return null;
}

// Dodatne tipke (niso med privzetimi): [napis, vstavi, 2nd napis, 2nd vstavi]
const EXTRA = {
  "cot(": ["cot", "cot(", "cot⁻¹", "arccot("],
  "e^(": ["eˣ", "e^(", "e", "e"],
  "10^(": ["10ˣ", "10^(", "log", "log("],
  "logb(@;)": ["logₐ", "logb(@;)", "log₂", "logb(@;2)"],
  // šolski zapis: x̅ (aritmetična sredina; U+0305, ker U+0304 v pisavi zdrsne desno kot x⁻), Me (mediana), σ z N v imenovalcu (MAT-SS-4/statistika), s z n − 1
  "mean(": ["x̅", "mean(", "Me", "median("],
  "stdevp(": ["σ", "stdevp(", "s", "stdev("],
  "total(": ["Σ", "total(", "n", "count("],
  "min(": ["min", "min(", "max", "max("],
  "gcd(@;)": ["gcd", "gcd(@;)", "lcm", "lcm(@;)"],
  "mod(@;)": ["mod", "mod(@;)", "|x|", "abs("],
  "Pol(@;)": ["Pol", "Pol(@;)", "Rec", "Rec(@;)"],
  "abs(": ["|x|", "abs(", "i", "i"],
  "nCr(@;)": ["nCr", "nCr(@;)", "nPr", "nPr(@;)"],
  "root(@;)": ["ⁿ√x", "root(@;)", "∛", "∛("],
  "³": ["x³", "³", "∛", "∛("],
  "<": ["<", "<", "≤", "≤"],
  ">": [">", ">", "≥", "≥"],
};

// Profil: tipke po pomembnosti (vstavi glavne tipke); ostala mesta zapolnijo privzete v svojem vrstnem redu.
const PROFILES = {
  trig: ["sin(", "cos(", "tan(", "π", "#dms", "cot(", "√(", "²", "^(", "⁻¹", "x", "="],
  log: ["log(", "ln(", "logb(@;)", "^(", "e^(", "10^(", "√(", "²", "x", "=", "π", "⁻¹"],
  ana: ["d/dx(@)", "∫(@;;)", "x", "=", "ln(", "e^(", "sin(", "cos(", "^(", "√(", "²", "π"],
  comb: ["!", "nCr(@;)", "^(", "²", "%", ";", "√(", "⁻¹"],
  stat: ["mean(", "stdevp(", "total(", "min(", "nCr(@;)", "!", "%", ";", "√(", "²", "^(", "x"],
  fin: ["%", "^(", "root(@;)", "log(", "ln(", "e^(", "⁻¹", "√(", "x", "="],
  geo: ["π", "√(", "²", "³", "sin(", "cos(", "tan(", "#dms", "^(", "⁻¹", "x", "="],
  num: ["gcd(@;)", "mod(@;)", "%", "!", "²", "^(", "√(", "⁻¹", "x", "="],
  eq: ["x", "=", "<", ">", "²", "^(", "√(", ";", "abs(", "⁻¹", "f(x)=", "π"],
  cplx: ["i", "abs(", "Pol(@;)", "^(", "²", "√(", "x", "=", "π", "#dms", "e^(", "ln("],
  fiz: ["²", "√(", "^(", "⁻¹", "sin(", "cos(", "tan(", "π", "#dms", "log(", "ln(", "e^("],
  kem: ["log(", "10^(", "ln(", "^(", "²", "√(", "%", "x", "=", "⁻¹", "e^(", "π"],
};

// skupina f(x) na Evklidovi tipkovnici (FX_GROUPS v tipkovnica-data.js)
const FX_GROUP = { trig: "trig", log: "pow", ana: "ana", comb: "num", stat: "stat", fin: "pow", geo: "pow", num: "num", eq: "pow", cplx: "cplx", fiz: "pow", kem: "pow" };
export const fxGroupFor = (profile) => FX_GROUP[profile] || null;

const FIXED = new Set(["#2nd", "#left", "#right", "#more", "(", ")"]);

/**
 * Funkcijske tipke za profil. keys: privzete [napis, vstavi, 2nd napis, 2nd vstavi];
 * stalne tipke (2nd, ◀, ▶, ⋯, oklepaja) ostanejo na svojih mestih.
 */
export function adaptKeys(keys, profile) {
  const want = PROFILES[profile];
  if (!want) return keys;
  const pool = new Map();
  for (const k of keys) {
    if (FIXED.has(k[1])) continue;
    pool.set(k[1], k);
    if (k[3] && !pool.has(k[3])) pool.set(k[3], [k[2], k[3]]); // 2nd funkcija kot samostojna tipka
  }
  for (const [ins, k] of Object.entries(EXTRA)) if (!pool.has(ins) || pool.get(ins).length < 4) pool.set(ins, k);
  const slots = keys.filter((k) => !FIXED.has(k[1])).length;
  const chosen = [];
  const used = new Set();
  const take = (k) => {
    if (!k || used.has(k[1]) || chosen.length >= slots) return;
    chosen.push(k);
    used.add(k[1]);
  };
  for (const ins of want) take(pool.get(ins));
  for (const k of keys) if (!FIXED.has(k[1])) take(k);
  let i = 0;
  return brezPodvojitev(keys.map((k) => (FIXED.has(k[1]) ? k : chosen[i++])));
}

/**
 * V načinu 2nd nobena funkcija ni dvakrat (j 2026-11-05: »i« in »e« sta bila dvakrat): tipka, katere 2nd funkcija
 * je že na tipki pred njo, ostane brez 2nd (v načinu 2nd kaže svojo glavno funkcijo).
 */
export function brezPodvojitev(keys) {
  const videne = new Set();
  const vse = new Set(keys.flatMap((k) => [k[1], k[3]].filter(Boolean)));
  const out = keys.map((k) => {
    if (FIXED.has(k[1])) return k;
    const druga = k[3] ?? k[1];
    if (!videne.has(druga)) return videne.add(druga), k;
    if (k[3] && !videne.has(k[1])) return videne.add(k[1]), [k[0], k[1]];
    // Obe funkciji tipke sta že drugje: tipko nadomesti koristna, ki je še ni.
    const r = REZERVA.find((x) => ![x[1], x[3]].some((a) => vse.has(a)) && !videne.has(x[3]));
    if (!r) return k;
    vse.add(r[1]), vse.add(r[3]), videne.add(r[3]);
    return r;
  });
  return out;
}
// Tipke za nadomestilo (niso med privzetimi), po koristnosti.
const REZERVA = [
  ["cot", "cot(", "cot⁻¹", "arccot("],
  ["gcd", "gcd(@;)", "lcm", "lcm(@;)"],
  ["min", "min(", "max", "max("],
  ["mod", "mod(@;)", "|x|", "abs("],
];
