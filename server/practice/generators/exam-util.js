// Pomožne funkcije za izpitne generatorje (SAT, gaokao, JEE, NEET, CBSE …).
// Naloge so v angleščini (decimalna pika), ker so izpiti mednarodni; inštruktor jih
// razloži v jeziku učenca.
import { roundHalfUp, gcd } from "../check.js";
import { withMistakes, choiceWhy } from "./tek-util.js";

// Tipične napake (answer.mistakes) in izbira z razlago: isti pomožni funkciji kot pri tekmovanjih.
export { withMistakes, choiceWhy };

// Število z decimalno piko: en(2.5) → "2.5", en(2.456, 2) → "2.46".
export const en = (x, d = null) => (d === null ? String(Number(Number(x).toFixed(10))) : roundHalfUp(x, d).toFixed(d));
// Za LaTeX: negativna števila z navadnim minusom.
export const tn = (x, d = null) => en(x, d);
// Člen s predznakom: sg(3) → "+ 3", sg(-3) → "- 3".
export const sg = (v) => (v < 0 ? `- ${-v}` : `+ ${v}`);
// Koeficient pred spremenljivko: co(1, "x") → "x", co(-1, "x") → "-x", co(3, "x") → "3x".
export const co = (a, v = "x") => (a === 1 ? v : a === -1 ? `-${v}` : `${a}${v}`);
// Člen s predznakom in spremenljivko: sco(-2, "x") → "- 2x".
export const sco = (a, v = "x") => (a < 0 ? `- ${co(-a, v)}` : `+ ${co(a, v)}`);
export const par = (x) => (x < 0 ? `(${x})` : `${x}`);
export const frac = (n, d) => `\\frac{${n}}{${d}}`;

export function reduce(n, d) {
  const g = gcd(n, d);
  const s = d < 0 ? -1 : 1;
  return [(s * n) / g, (s * d) / g];
}
export const fracTex = (n, d) => {
  const [a, b] = reduce(n, d);
  return b === 1 ? `${a}` : a < 0 ? `-${frac(-a, b)}` : frac(a, b);
};

// Odgovor s številom; d = število decimalk (zaokroževanje), brez d točen rezultat.
export const num = (value, d = null, extra = {}) => ({ type: "number", value, dot: true, ...(d === null ? {} : { decimals: d }), ...extra });
// Številski odgovor s tipičnimi napakami: numM(12.5, 1, [[25, "Forgot the ½?"], …]).
export const numM = (value, d, list) => withMistakes(num(value, d), list);
export const fraction = (n, d) => {
  const [a, b] = reduce(n, d);
  return { type: "fraction", num: a, den: b };
};

// Navodilo za zaokroževanje v besedilu.
export const roundTo = (d) => (d === 0 ? " Round to the nearest whole number." : ` Round to ${d} decimal place${d === 1 ? "" : "s"}.`);

// Skupna oblika naloge: angleška naloga, oznaka jezika za izbirne odgovore.
// Podatki so samo količine z vrednostjo (»x = …«); pojmovno vprašanje brez njih nima podatkov.
// Ponovljena enaka vrednost v rešitvi (»= 4/5 = 4/5«, »= 98 = 98 m«) se skrči v eno.
const once = (s) => (typeof s === "string" ? s.replace(/= (-?[^\s$=]+) = \1(?![0-9.])/g, "= $1") : s);
export const task = (o) => {
  const t = { lang: "en", formula: false, data: false, ...o };
  t.solution = once(t.solution);
  if (t.data && Array.isArray(t.data.given)) {
    const given = t.data.given.filter((g) => typeof g === "string" && g.includes("="));
    const find = (t.data.find || []).filter((f) => typeof f === "string" && f && !f.includes("="));
    t.data = given.length && find.length ? { ...t.data, given, find } : false;
  }
  return t;
};

export const nCr = (n, k) => {
  if (k < 0 || k > n) return 0;
  let out = 1;
  for (let i = 1; i <= k; i++) out = (out * (n - k + i)) / i;
  return Math.round(out);
};
export const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));

// Polinom brez ničelnih členov: poly([[2, "x^2"], [-3, "x"], [0, ""]]) → "2x^2 - 3x".
export function poly(terms) {
  const out = [];
  for (const [c, v] of terms) {
    if (!c) continue;
    const abs = Math.abs(c);
    const body = v ? (abs === 1 ? v : `${abs}${v}`) : `${abs}`;
    out.push(out.length ? `${c < 0 ? "-" : "+"} ${body}` : `${c < 0 ? "-" : ""}${body}`);
  }
  return out.join(" ") || "0";
}
// Faktor (x - p): pri p = 0 samo x.
export const factor = (p, v = "x") => (p === 0 ? v : `(${v} ${sg(-p)})`);
// Ulomek s tipičnimi napakami (vrednosti kot decimalna števila).
export function fractionM(n, d, list) {
  const a = fraction(n, d);
  const m = withMistakes({ value: n / d }, list).mistakes;
  if (m) a.mistakes = m;
  return a;
}
// Vrstica podatka v angleški nalogi: dq("m", 2.5, "kg") → "m = 2.5\ \mathrm{kg}" (število zapisano kot v besedilu).
export const dq = (sym, v, u = "") => `${sym} = ${typeof v === "number" ? en(v) : v}${u ? `\\ \\mathrm{${u}}` : ""}`;

// Dvojezične naloge za indijske izpite (angleško / hindijsko, exam-in-*.js).
// Generator dobi jezik naloge (4. argument gen): const L = bi(lang); L("Find …", "ज्ञात कीजिए …").
// Števila, LaTeX in naključne izbire so v obeh jezikih enaki (isto seme → ista naloga).
export const bi = (lang) => (en, hi) => (lang === "hi" ? hi : en);
// Navodilo za zaokroževanje v jeziku naloge.
export const roundToL = (d, lang) =>
  lang !== "hi" ? roundTo(d) : d === 0 ? " निकटतम पूर्ण संख्या तक पूर्णांकित कीजिए।" : ` ${d} दशमलव ${d === 1 ? "स्थान" : "स्थानों"} तक पूर्णांकित कीजिए।`;
