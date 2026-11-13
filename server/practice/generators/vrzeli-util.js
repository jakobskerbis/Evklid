// Skupne pomožne funkcije za naloge tem, dodanih po primerjavi z učnimi načrti (2026-10-30):
// dodatne-vrzeli-mat.js in dodatne-vrzeli-fiz-kem.js. Merila: docs/kakovost.md §2.
import { roundHalfUp } from "../check.js";
import { tx } from "./mat.js";
import { SETS } from "../../../public/sim/nar-data.js";

export { tx };
export const lv = (level) => Math.min(3, Math.max(1, level || 1));
export const tt = (s) => `\\text{${s}}`;
const unitTex = (u) =>
  u === "%" ? "\\%" : u.startsWith("\\") ? u : `\\mathrm{${u.replace(/²/g, "^2").replace(/³/g, "^3").replace(/⁴/g, "^4").replace(/µ/g, "\\mu ").replace(/Ω/g, "\\Omega").replace(/°/g, "{}^\\circ ")}}`;
// Količina z enoto (brez $): qty("2{,}5", "kg") → "2{,}5\ \mathrm{kg}".
export const qty = (v, u) => (u ? `${v}\\ ${unitTex(u)}` : `${v}`);
export const dat = (sym, v, u) => `${sym} = ${qty(v, u)}`;
const needsR = (x, d) => d != null && Math.abs(x - roundHalfUp(x, d)) > 1e-9;
export const eq = (x, d) => (needsR(x, d) ? "\\approx" : "=");
export const res = (x, d, u) => `${eq(x, d)} ${qty(tx(x, d), u)}`;
export const dw = (d) => (d === 0 ? "na celo število" : d === 1 ? "na eno decimalko" : d === 2 ? "na dve decimalki" : `na ${d} decimalke`);
export const M = (value, why) => ({ value, why });
// Število v znanstvenem zapisu za TeX: sci(6.67e-11) → "6{,}67 \cdot 10^{-11}".
export function sci(x, dm = 2) {
  let e = Math.floor(Math.log10(Math.abs(x)));
  let m = roundHalfUp(x / 10 ** e, dm);
  if (Math.abs(m) >= 10) (m /= 10), e++;
  return e === 0 ? tx(m, dm) : `${tx(m, dm)} \\cdot 10^{${e}}`;
}

// Številski odgovor; tipične napake, ki bi se zaokrožile v pravilni rezultat ali se ponovijo, izpustimo.
export function num(value, unit, decimals, mistakes = [], extra = {}) {
  const same = (a, b) => (decimals == null ? Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)) : roundHalfUp(a, decimals) === roundHalfUp(b, decimals));
  const kept = [];
  for (const m of mistakes) {
    if (!m || !Number.isFinite(m.value) || same(m.value, value) || kept.some((k) => same(k.value, m.value))) continue;
    kept.push(m);
  }
  const a = { type: "number", value, unit, decimals, ...extra };
  const alts = [...(extra.unitAlternatives || [])];
  if (unit.includes("µ")) alts.push(unit.replace("µ", "u"), unit.replace("µ", "μ"));
  if (unit.includes("Ω")) alts.push(unit.replace("Ω", "ohm"));
  if (alts.length) a.unitAlternatives = alts;
  if (kept.length) a.mistakes = kept.slice(0, 3);
  return a;
}
// Odgovor kot okrajšan ulomek; mistakes z vrednostmi ulomkov.
export function frac(n, d, mistakes = []) {
  const g = (a, b) => (b ? g(b, a % b) : Math.abs(a));
  if (d < 0) (n = -n), (d = -d);
  const k = g(n, d) || 1;
  const v = n / d;
  return { type: "fraction", num: n / k, den: d / k, mistakes: mistakes.filter((m, i) => m && Number.isFinite(m.value) && Math.abs(m.value - v) > 1e-9 && !mistakes.slice(0, i).some((p) => p && Math.abs(p.value - m.value) < 1e-9)).slice(0, 3) };
}
// Izbirni odgovor: correct je besedilo pravilne možnosti, wrong = [[besedilo, zakaj narobe], …] (vzamemo največ 3).
export function choice(r, correct, wrong, extra = {}) {
  const opts = r.shuffle([[correct, null], ...r.shuffle(wrong).slice(0, 3)]);
  return { type: "choice", options: opts.map((o) => o[0]), index: opts.findIndex((o) => o[1] === null), why: opts.map((o) => o[1]), ...extra };
}
// Naloga: steps so vrstice rešitve.
export const T = (text, answer, hint, given, find, formula, steps) => ({ text, answer, hint, data: { given, find }, formula, solution: steps.join("\n") });

// Razvrščanje iz nabora (public/sim/nar-data.js): 1. raven tri možnosti, 2. raven vse skupine,
// 3. raven obratno vprašanje (kateri primer sodi v skupino). Podatki: skupine, med katerimi izbiraš.
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
export function sortiraj(set, level, r) {
  const def = SETS[set];
  const nm = (k) => def.cats.find((c) => c[0] === k)[1];
  const given = [`${tt("skupine")} = ${tt(def.cats.map((c) => c[1]).join(", "))}`];
  if (level === 3) {
    const cats = def.cats.filter(([k]) => def.items.some((i) => i[1] === k) && def.items.filter((i) => i[1] !== k).length >= 3);
    const [k] = r.pick(cats);
    const right = r.pick(def.items.filter((i) => i[1] === k));
    const wrong = r.shuffle(def.items.filter((i) => i[1] !== k)).slice(0, 3);
    const options = r.shuffle([right, ...wrong]);
    return {
      text: `${def.q}\n\nPoišči primer, pri katerem je odgovor **${nm(k)}**.`,
      answer: { type: "choice", options: options.map((o) => cap(o[0])), index: options.indexOf(right), why: options.map((o) => (o === right ? null : `»${cap(o[0])}« sodi v skupino »${nm(o[1])}«: ${o[2]}`)) },
      hint: def.hint,
      data: { given, find: [tt("primer iz skupine")] },
      formula: false,
      solution: [`${cap(right[0]).replace(/\.$/, "")}: ${nm(k)}.`, right[2]].join("\n"),
    };
  }
  const item = r.pick(def.items);
  const own = def.cats.find(([k]) => k === item[1]);
  const cats = level === 1 && def.cats.length > 3 ? [own, ...r.shuffle(def.cats.filter((c) => c !== own)).slice(0, 2)] : def.cats;
  const ordered = def.cats.filter((c) => cats.includes(c));
  return {
    text: `${def.q}\n\n**${cap(item[0])}**`,
    answer: { type: "choice", options: ordered.map(([, t]) => cap(t)), index: ordered.findIndex(([k]) => k === item[1]), why: ordered.map(([k, t]) => (k === item[1] ? null : `Ne »${t}«: ${item[2]}`)) },
    hint: def.hint,
    data: { given, find: [tt("skupina")] },
    formula: false,
    solution: [`${cap(nm(item[1]))}.`, item[2]].join("\n"),
  };
}
