// Tipke kalkulatorja po poglavju (j 2026-11-04: »tipke, ki niso obvezne, naj se prilagodijo poglavju«).
// Števke, + − × ÷, oklepaji, puščice, 2nd in »⋯« ostanejo na mestu; ostalih 18 funkcijskih tipk
// znanstvenega kalkulatorja dobi vrstni red in izbor poglavja. Evklidova tipkovnica odpre ustrezno skupino f(x).
// Brez DOM (testi v test/tipke-poglavja.test.js).

// Poglavje → profil. Iščemo po id-ju teme (»MAT-SS-2/logaritem«) in imenu sklopa, brez šumnikov, sl in en.
const RULES = [
  ["cplx", /komplek|complex/],
  ["trig", /kotn[a-z]*-funkc|kotov|trigonom|sinus|kosinus|adicijsk|polarn|\btrig|sine|cosine/],
  ["log", /logarit|eksponent|exponent|potenc.*racional|\blog/],
  ["ana", /odvod|integral|limit|zvezn|diferencial|derivat|calculus|analiz|taylor|vrst[ae]\b/],
  ["comb", /kombinator|permutac|variac|combinator|binom/],
  ["stat", /statist|verjetn|podatk|probab|porazdel|frekvenc|vzor[ce]/],
  ["fin", /obrest|financ|kredit|interest|odstot|percent|procent/],
  ["geo", /geometr|trikotnik|stirikotnik|krog|kroznic|telo|teles|povrsin|prostornin|pitagor|podobnost|mnogokotnik|triangle|circle|area|volume/],
  ["num", /naravn|cela-stevil|racionaln|ulom|deljiv|delitel|praštevil|prastevil|fraction|integer|stevil/],
  ["eq", /enacb|neenacb|funkcij|polinom|sistem|izraz|zaporedj|equation|inequal|function|polynom|razstav|sequence/],
];

/** Profil za temo { id, unit, name, subject } ali null (privzete tipke). */
export function chapterProfile(topic) {
  if (!topic) return null;
  const text = [topic.id, topic.unit, topic.name]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  const subj = String(topic.subject || topic.id || "").slice(0, 3).toUpperCase();
  if (subj === "KEM") return "kem";
  for (const [p, re] of RULES) if (re.test(text)) return p;
  if (subj === "FIZ") return "fiz";
  return null;
}

// Dodatne tipke (niso med privzetimi): [napis, vstavi, 2nd napis, 2nd vstavi]
const EXTRA = {
  "cot(": ["cot", "cot(", "cot⁻¹", "arccot("],
  "e^(": ["eˣ", "e^(", "e", "e"],
  "10^(": ["10ˣ", "10^(", "log", "log("],
  "logb(@;)": ["logₐ", "logb(@;)", "log₂", "logb(@;2)"],
  "mean(": ["mean", "mean(", "med", "median("],
  "stdev(": ["σ", "stdev(", "σₙ", "stdevp("],
  "total(": ["Σ", "total(", "n", "count("],
  "min(": ["min", "min(", "max", "max("],
  "gcd(@;)": ["gcd", "gcd(@;)", "lcm", "lcm(@;)"],
  "mod(@;)": ["mod", "mod(@;)", "|x|", "abs("],
  "Pol(@;)": ["Pol", "Pol(@;)", "Rec", "Rec(@;)"],
  "abs(": ["|x|", "abs(", "i", "i"],
  "nCr(@;)": ["nCr", "nCr(@;)", "nPr", "nPr(@;)"],
  "root(@;)": ["ⁿ√x", "root(@;)", "∛", "∛("],
  "³": ["x³", "³", "∛", "∛("],
};

// Profil: tipke po pomembnosti (vstavi glavne tipke); ostala mesta zapolnijo privzete v svojem vrstnem redu.
const PROFILES = {
  trig: ["sin(", "cos(", "tan(", "π", "#dms", "cot(", "√(", "²", "^(", "⁻¹", "x", "="],
  log: ["log(", "ln(", "logb(@;)", "^(", "e^(", "10^(", "√(", "²", "x", "=", "π", "⁻¹"],
  ana: ["d/dx(@)", "∫(@;;)", "x", "=", "ln(", "e^(", "sin(", "cos(", "^(", "√(", "²", "π"],
  comb: ["!", "nCr(@;)", "^(", "²", "%", ";", "√(", "⁻¹"],
  stat: ["mean(", "stdev(", "total(", "min(", "nCr(@;)", "!", "%", ";", "√(", "²", "^(", "x"],
  fin: ["%", "^(", "root(@;)", "log(", "ln(", "e^(", "⁻¹", "√(", "x", "="],
  geo: ["π", "√(", "²", "³", "sin(", "cos(", "tan(", "#dms", "^(", "⁻¹", "x", "="],
  num: ["gcd(@;)", "mod(@;)", "%", "!", "²", "^(", "√(", "⁻¹", "x", "="],
  eq: ["x", "=", "²", "^(", "√(", ";", "<", "abs(", "⁻¹", "f(x)=", "π", "sin("],
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
  return keys.map((k) => (FIXED.has(k[1]) ? k : chosen[i++]));
}
