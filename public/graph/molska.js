// Kemijska formula v znanstvenem kalkulatorju: M(H2SO4) je molska masa žveplove kisline (98,08 g/mol),
// tudi sredi računa: m = 0,5 · M(H₂SO₄), 2 = n · M(NaCl). Brez DOM (preizkusi v test/formula-calc.test.js).
// Kalkulator M(…) ne pozna, zato vsako formulo zamenjamo s spremenljivko M_kem0, M_kem1 … z vrednostjo iz
// periodnega sistema in v zapisu rezultata (TeX) spet pokažemo M(H₂SO₄). M brez oklepaja ostane spomin (MR).
import { molarMass } from "./toolscore.js";
import { MASSES } from "./pse-data.js";

const KEM = /^[A-Z([][A-Za-z0-9₀-₉()[\]·•*×.]*$/;

/** TeX kemijske formule: H2SO4 → \mathrm{H_{2}SO_{4}}, CuSO4·5H2O → \mathrm{CuSO_{4}\cdot 5H_{2}O}. */
export function chemTex(f) {
  const s = String(f)
    .replace(/[₀-₉]/g, (c) => String(c.charCodeAt(0) - 0x2080))
    .replace(/[·•*×.]/g, "·")
    .replace(/(\d+)/g, (m, d, i, str) => (i === 0 || str[i - 1] === "·" ? m : `_{${m}}`))
    .replace(/·/g, "\\cdot ");
  return `\\mathrm{${s}}`;
}

/**
 * Poišče M(formula) v vnosu. Vrne null, če ga ni; sicer { text, vars, fix(r) }: text je vnos s spremenljivkami
 * namesto M(…), vars njihove molske mase, fix(r) pa v rezultatu zamenja imena spremenljivk z M(formula).
 */
export function chemSub(text) {
  const src = String(text ?? "");
  if (!/M\s*\(/.test(src)) return null;
  const found = [];
  let out = "";
  let i = 0;
  while (i < src.length) {
    const at = src.indexOf("M", i);
    if (at < 0) break;
    let o = at + 1;
    while (src[o] === " ") o++;
    if (src[o] !== "(" || /[A-Za-z0-9_α-ωΑ-Ω]/.test(src[at - 1] || "")) {
      out += src.slice(i, at + 1);
      i = at + 1;
      continue;
    }
    // zaklepaj, ki zapre M( … ); vmes so lahko oklepaji formule: M(Ca(OH)2)
    let d = 0;
    let c = o;
    for (; c < src.length; c++) {
      if (src[c] === "(") d++;
      else if (src[c] === ")" && --d === 0) break;
    }
    const f = src.slice(o + 1, c).trim();
    const r = c < src.length && KEM.test(f) ? molarMass(f.replace(/×/g, "·"), MASSES) : null;
    if (!r || r.error || !Number.isFinite(r.M)) {
      out += src.slice(i, at + 1);
      i = at + 1;
      continue;
    }
    let k = found.findIndex((x) => x.f === f);
    if (k < 0) k = found.push({ f, M: r.M }) - 1;
    out += `${src.slice(i, at)}M_(kem${k})`;
    i = c + 1;
  }
  if (!found.length) return null;
  out += src.slice(i);
  const vars = Object.fromEntries(found.map((x, k) => [`M_kem${k}`, x.M]));
  const fixStr = (s) => s.replace(/M_\{kem(\d+)\}/g, (m, k) => `M(${chemTex(found[k].f)})`);
  const fix = (r) => {
    if (typeof r === "string") return fixStr(r);
    if (Array.isArray(r)) return r.map(fix);
    if (r && typeof r === "object") return Object.fromEntries(Object.entries(r).map(([key, v]) => [key, fix(v)]));
    return r;
  };
  return { text: out, vars, fix };
}

const SUB = "₀₁₂₃₄₅₆₇₈₉";
/**
 * Besedilo za vnos v kalkulator iz periodnega sistema: »H2SO4« → »M(H₂SO₄)«, »CuSO4·5H2O« → »M(CuSO₄·5H₂O)«.
 * Naboj iona (SO4^2-, NH4+) odpade, ker ne spremeni molske mase. Vrne null, če kalkulator formule ne bi prebral.
 */
export function chemText(formula) {
  const f = String(formula ?? "")
    .replace(/\s+/g, "")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+$/, "")
    .replace(/\^\d*[+-]$|[+-]$/, "")
    .replace(/[*•×]/g, "·")
    .replace(/[₀-₉]/g, (c) => String(c.charCodeAt(0) - 0x2080))
    .replace(/(\d+)/g, (m, d, i, s) => (i === 0 || s[i - 1] === "·" ? m : [...m].map((x) => SUB[x]).join("")));
  const text = `M(${f})`;
  return f && chemSub(text) ? text : null;
}

/** M(…) zamenja s številom (za »Po korakih«, ki molskih mas ne pozna): »2 = n·M(NaCl)« → »2 = n·58.44«. */
export function chemNumbers(text) {
  const k = chemSub(text);
  if (!k) return text;
  return k.text.replace(/M_\(kem(\d+)\)/g, (m, i) => String(Number(k.vars[`M_kem${i}`].toPrecision(12))));
}
