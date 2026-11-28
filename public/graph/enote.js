// Enote v znanstvenem kalkulatorju (j, 27. 11. 2026: »Naj ima kalkulator možnost računati z enotami«).
// Enota je v vnosu svoj žeton ⟦km⟧ (vstavi ga le tipka iz skupine »Enote«), zato se »m« za meter nikoli ne
// zamenja s spremenljivko m. Vsaka enota ima faktor do koherentne enote SI in dimenzijo (m, kg, s, A, K, mol).
// Brez DOM in brez knjižnic (testi v test/enote.test.js; faktorji se ujemajo s pretvornikom QUANTITIES v scicore.js
// in s preračunom lekcij unitSI v server/lesson-math.js).

export const OPEN = "⟦";
export const CLOSE = "⟧";
export const DIMS = ["m", "kg", "s", "A", "K", "mol"];
const N = DIMS.length;

const U = (f, m = 0, kg = 0, s = 0, a = 0, k = 0, mol = 0) => ({ f, d: [m, kg, s, a, k, mol] });

// Osnovni simboli (brez predpone). Imena, ki bi jih predpona razbila napačno (min ni mili-in, mi ni mili-i, kn ni
// kilo-n), so tu cela in imajo prednost.
const ATOMS = {
  m: U(1, 1), g: U(1e-3, 0, 1), t: U(1000, 0, 1), s: U(1, 0, 0, 1), min: U(60, 0, 0, 1), h: U(3600, 0, 0, 1), d: U(86400, 0, 0, 1),
  A: U(1, 0, 0, 0, 1), K: U(1, 0, 0, 0, 0, 1), mol: U(1, 0, 0, 0, 0, 0, 1),
  N: U(1, 1, 1, -2), J: U(1, 2, 1, -2), W: U(1, 2, 1, -3), Wh: U(3600, 2, 1, -2), Pa: U(1, -1, 1, -2), bar: U(1e5, -1, 1, -2),
  atm: U(101325, -1, 1, -2), mmHg: U(133.322387415, -1, 1, -2), V: U(1, 2, 1, -3, -1), "Ω": U(1, 2, 1, -3, -2), C: U(1, 0, 0, 1, 1),
  As: U(1, 0, 0, 1, 1), Ah: U(3600, 0, 0, 1, 1), Hz: U(1, 0, 0, -1), L: U(1e-3, 3), eV: U(1.602176634e-19, 2, 1, -2), cal: U(4.184, 2, 1, -2),
  a: U(100, 2), ha: U(1e4, 2), mi: U(1609.344, 1), ft: U(0.3048, 1), in: U(0.0254, 1), lb: U(0.45359237, 0, 1), oz: U(0.028349523125, 0, 1),
  mph: U(0.44704, 1, 0, -1), kn: U(1852 / 3600, 1, 0, -1), KM: U(735.49875, 2, 1, -3),
};
// Predpone le pri enotah, kjer jih šola uporablja (brez »mt« ali »kmin«).
const PREFIXED = new Set(["m", "g", "s", "A", "mol", "N", "J", "W", "Wh", "Pa", "bar", "V", "Ω", "C", "Ah", "Hz", "L", "eV", "cal"]);
const PREFIXES = { da: 10, h: 100, k: 1e3, M: 1e6, G: 1e9, d: 0.1, c: 0.01, m: 1e-3, "μ": 1e-6, n: 1e-9 };
// Temperatura: K je navadna enota, °C in °F imata zamik in sta le za pretvorbo (20 °C → K).
export const OFFSET_TEMP = { "°C": { a: 1, b: 273.15 }, "°F": { a: 5 / 9, b: 273.15 - (32 * 5) / 9 } };

const SUP_N = { "²": 2, "³": 3, "⁴": 4, "⁵": 5, "⁶": 6 };
function atom(sym) {
  if (ATOMS[sym]) return ATOMS[sym];
  for (const p of Object.keys(PREFIXES).sort((x, y) => y.length - x.length)) {
    const rest = sym.slice(p.length);
    if (sym.startsWith(p) && rest && PREFIXED.has(rest)) return { f: PREFIXES[p] * ATOMS[rest].f, d: ATOMS[rest].d };
  }
  return null;
}

const cache = new Map();
/**
 * Enota iz simbola (»km/h«, »m/s²«, »g/cm³«, »kg·m²/s²«, »kΩ«) → { f, d } ali null. °C in °F vrneta null
 * (nista navadni enoti, glej OFFSET_TEMP).
 */
export function parseUnit(sym) {
  const s = String(sym ?? "");
  if (cache.has(s)) return cache.get(s);
  let out = null;
  const parts = s.split("/");
  if (parts.length <= 2 && parts.every((p) => p)) {
    let f = 1;
    const d = new Array(N).fill(0);
    let ok = true;
    parts.forEach((part, k) => {
      for (const piece of part.split("·")) {
        if (piece === "1" && k === 0 && parts.length === 2) continue; // 1/s
        const m = /^([A-Za-zμΩ]+)([²³⁴⁵⁶]?)$/u.exec(piece);
        const a = m && atom(m[1]);
        if (!a) {
          ok = false;
          return;
        }
        const e = (SUP_N[m[2]] || 1) * (k ? -1 : 1);
        f *= a.f ** e;
        a.d.forEach((x, i) => (d[i] += x * e));
      }
    });
    if (ok) out = { f, d };
  }
  cache.set(s, out);
  return out;
}

/** Je simbol enota, ki jo kalkulator pozna (tudi °C, °F)? */
export const knownUnit = (sym) => !!parseUnit(sym) || sym in OFFSET_TEMP;
export const sameDims = (a, b) => a.every((x, i) => x === b[i]);
export const dimless = (d) => d.every((x) => x === 0);

/** Sestavni deli enote (»km/h« → km, h): kandidati za enoto rezultata (72 km/h · 2 h = 144 km). */
export function unitParts(sym) {
  const out = [];
  for (const p of String(sym).split(/[/·]/)) if (p && p !== sym && parseUnit(p)) out.push(p);
  return out;
}

/** Simboli in potence v enoti (»km/h« → km¹ h⁻¹, »m/s²« → m¹ s⁻²) ali null. */
export function unitPieces(sym) {
  if (!parseUnit(sym)) return null;
  const out = new Map();
  String(sym)
    .split("/")
    .forEach((part, k) => {
      for (const piece of part.split("·")) {
        if (piece === "1") continue;
        const m = /^(.*?)([²³⁴⁵⁶]?)$/u.exec(piece);
        const e = (SUP_N[m[2]] || 1) * (k ? -1 : 1);
        out.set(m[1], (out.get(m[1]) || 0) + e);
      }
    });
  return out;
}
/** Zapis enote iz simbolov in potenc (obratno od unitPieces): km¹ h⁻¹ → »km/h«, cm² → »cm²«. null, če ne gre. */
export function composeUnit(pieces) {
  const num = [];
  const den = [];
  const seen = [];
  for (const [sym, e] of pieces) {
    if (!e) continue;
    // cm·m, km/h/s: dva simbola iste količine nista smiselna enota (raje SI: m², m/s²)
    const d = parseUnit(sym)?.d;
    if (!d || seen.some((x) => sameDims(x, d))) return null;
    seen.push(d);
    if (!Number.isInteger(e) || Math.abs(e) > 6 || /[/·²³⁴⁵⁶]/u.test(sym)) return null;
    (e > 0 ? num : den).push(sym + (Math.abs(e) > 1 ? SUP_TXT[Math.abs(e)] : ""));
  }
  if (!num.length && !den.length) return "";
  const s = `${num.join("·") || "1"}${den.length ? `/${den.join("·")}` : ""}`;
  return parseUnit(s) ? s : null;
}

// Izpeljane enote SI za prikaz rezultata, ko nobena enota iz vnosa nima prave dimenzije (2 kg · 9,81 m/s² = 19,62 N).
const NAMED = ["N", "J", "W", "Pa", "C", "V", "Ω"];
const SUP_TXT = { 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶" };
/** Enota za dimenzijo d: izpeljana enota SI (N, J, W …) ali zmnožek osnovnih (kg·m/s). null, če ni celih potenc. */
export function siUnit(d) {
  if (!d.every(Number.isInteger) || d.some((x) => Math.abs(x) > 6)) return null;
  const named = NAMED.find((n) => sameDims(ATOMS[n].d, d));
  if (named) return named;
  const name = ["m", "kg", "s", "A", "K", "mol"];
  const order = [1, 0, 3, 4, 5, 2]; // kg, m, A, K, mol, s (kg·m²/s², ne m²·kg/s²)
  const pow = (i, e) => name[i] + (e > 1 ? SUP_TXT[e] : "");
  const num = order.filter((i) => d[i] > 0).map((i) => pow(i, d[i]));
  const den = order.filter((i) => d[i] < 0).map((i) => pow(i, -d[i]));
  if (!num.length && !den.length) return "";
  // vse za »/« je imenovalec (parseUnit): kg/m·s² = kg/(m·s²), v zapisu z oklepajem (unitTexInner)
  return `${num.join("·") || "1"}${den.length ? `/${den.join("·")}` : ""}`;
}

/** TeX vsebina enote (za \operatorname v vnosu in \mathrm v rezultatu). Ω ostane znak (ključ za ujemanje z vnosom). */
export function unitTexInner(sym) {
  const [num, den] = String(sym).split("/");
  const s = den?.includes("·") ? `${num}/(${den})` : String(sym);
  return s
    .replace(/μ/g, "\\mu ")
    .replace(/°/g, "{}^{\\circ}")
    .replace(/·/g, "\\cdot ")
    .replace(/[²³⁴⁵⁶]/g, (c) => `^{${SUP_N[c]}}`)
    .trim();
}
/**
 * Enota v vnosu: en sam žeton TeX (kazalec ne more v ime enote; sci-vnos.js lex, OPAQUE). Prazna skupina {} za njo je
 * navaden znak, da je razmik okoli + in · enak na obeh straneh (operator pred + bi ga sicer naredil za predznak: »m +3«).
 */
export const unitTex = (sym) => `\\operatorname{${unitTexInner(sym)}}{}`;
/** Enota za številom v rezultatu. */
export const unitResultTex = (sym) => (sym ? `\\,\\mathrm{${unitTexInner(sym)}}` : "");
/** Ključi enote za ujemanje besedila in zapisa (enako kot lex v sci-vnos.js za \operatorname). */
export const unitKeys = (sym) => unitTexInner(sym).replace(/\\[A-Za-z]+/g, "").replace(/[^\p{L}\p{N}]/gu, "");

/** Žetoni enot v besedilu: [{ sym, start, end }] (end za ⟧). */
export function unitTokens(text) {
  const out = [];
  const s = String(text ?? "");
  for (let i = s.indexOf(OPEN); i >= 0; i = s.indexOf(OPEN, i + 1)) {
    const e = s.indexOf(CLOSE, i + 1);
    if (e < 0) break;
    out.push({ sym: s.slice(i + 1, e), start: i, end: e + 1 });
  }
  return out;
}
export const hasUnits = (text) => String(text ?? "").includes(OPEN);
/** Žeton, v katerem je položaj p (strogo znotraj), ali null. */
export function tokenAround(text, p) {
  for (const t of unitTokens(text)) if (t.start < p && p < t.end) return t;
  return null;
}
export const token = (sym) => `${OPEN}${sym}${CLOSE}`;

// Skupine za tipkovnico (vrstni red kot pretvornik; nove količine za fiziko in kemijo). id → ime sc.q.<id>.
export const UNIT_GROUPS = [
  ["length", ["m", "km", "dm", "cm", "mm", "μm", "nm", "mi", "ft", "in"]],
  ["area", ["m²", "km²", "ha", "a", "dm²", "cm²", "mm²"]],
  ["volume", ["m³", "dm³", "L", "hL", "dL", "cL", "mL", "cm³", "mm³"]],
  ["mass", ["kg", "t", "dag", "g", "mg", "μg", "lb", "oz"]],
  ["time", ["s", "ms", "μs", "min", "h", "d"]],
  ["speed", ["m/s", "km/h", "km/s", "mph", "kn"]],
  ["accel", ["m/s²"]],
  ["force", ["N", "kN", "MN", "mN"]],
  ["pressure", ["Pa", "hPa", "kPa", "MPa", "bar", "mbar", "atm", "mmHg"]],
  ["energy", ["J", "kJ", "MJ", "Wh", "kWh", "cal", "kcal", "eV"]],
  ["power", ["W", "mW", "kW", "MW", "KM"]],
  ["temperature", ["K", "°C", "°F"]],
  ["density", ["kg/m³", "g/cm³", "kg/dm³", "g/L"]],
  ["current", ["A", "mA", "μA", "kA"]],
  ["voltage", ["V", "mV", "kV"]],
  ["resistance", ["Ω", "kΩ", "MΩ"]],
  ["charge", ["C", "mC", "μC", "As", "mAh", "Ah"]],
  ["frequency", ["Hz", "kHz", "MHz"]],
  ["amount", ["mol", "mmol", "kmol"]],
  ["concentration", ["mol/L", "mmol/L", "mol/m³"]],
  ["molarMass", ["g/mol", "kg/mol"]],
];
