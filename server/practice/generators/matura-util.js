// Skupne pomožne funkcije generatorjev za maturitetne teme (matura-mat-ss2/3/4.js).
import { NAMES } from "../rng.js";
import { gcd, roundHalfUp } from "../check.js";
import { choicesWhy, tx } from "./mat.js";

// Okrajšan ulomek s pozitivnim imenovalcem.
export function fr(n, d) {
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const k = gcd(n, d);
  return [n / k, d / k];
}
const sameAt = (a, b, d) => Math.abs(roundHalfUp(a, d ?? 6) - roundHalfUp(b, d ?? 6)) < 1e-9;
function cleanMistakes(value, decimals, mistakes) {
  const ms = [];
  for (const m of mistakes) {
    if (!m || !Number.isFinite(m.value)) continue;
    if (sameAt(m.value, value, decimals)) continue;
    if (ms.some((x) => sameAt(x.value, m.value, decimals))) continue;
    ms.push(m);
  }
  return ms.slice(0, 3);
}
// Številski odgovor; napake, ki bi se ujemale s pravilnim odgovorom ali med seboj, izpustimo.
export function num(value, decimals = null, mistakes = [], unit = null) {
  const a = { type: "number", value, decimals, mistakes: cleanMistakes(value, decimals, mistakes) };
  if (unit) a.unit = unit;
  return a;
}
// Okrajšan ulomek kot odgovor (napake po vrednosti).
export function frA(n, d, mistakes = []) {
  const [a, b] = fr(n, d);
  return { type: "fraction", num: a, den: b, mistakes: cleanMistakes(a / b, 9, mistakes) };
}
// Ulomek v TeX (okrajšan): 3/4 → \frac{3}{4}, -6/3 → -2.
export function ft(n, d) {
  const [a, b] = fr(n, d);
  if (b === 1) return `${a}`;
  return `${a < 0 ? "-" : ""}\\frac{${Math.abs(a)}}{${b}}`;
}
// Koliko decimalk (vsaj d) potrebujejo izpisani vmesni rezultati xs, da račun f iz izpisanih (zaokroženih) števil,
// zaokrožen na dEnd decimalk, da isti rezultat kot f iz natančnih vrednosti (ta je ocenjeni odgovor). Šolsko pravilo:
// vmesne rezultate pišemo z več mesti in zaokrožimo šele na koncu; sicer dijak, ki sledi rešitvi, pride do druge
// zadnje števke in dobi »Zaokrožil si v napačno smer« (test/matura-zaokrozevanje.test.js).
// Vrne null, če niti dMax mest ne zadošča (rezultat leži tik ob meji zaokrožanja): generator naj tedaj izbere
// druga števila (wrapGens ponovi nalogo, ki vrne null).
export function decimalke(xs, d, f, dEnd, dMax = 10) {
  const arr = [].concat(xs);
  const prav = roundHalfUp(f(...arr), dEnd);
  for (let k = d; k <= Math.max(d, dMax); k++) {
    if (Math.abs(roundHalfUp(f(...arr.map((x) => roundHalfUp(x, k))), dEnd) - prav) < 10 ** -dEnd / 2) return k;
  }
  return null;
}
// »=« le, če je x na d decimalk natančno (z dopustom, ki je majhen glede na d, ne le 1e-9: 1,131408213 ≠ 1,025^5).
export const ap = (x, d) => (Math.abs(roundHalfUp(x, d) - x) < Math.max(10 ** -(d + 4), Math.abs(x) * 1e-13) ? "=" : "\\approx");
export const sg = (c) => (c < 0 ? `- ${tx(-c)}` : `+ ${tx(c)}`);
export const pickAns = (r, correct, wrongs) => ({ type: "choice", ...choicesWhy(r, correct, wrongs) });
export const name = (r) => r.pick(NAMES);

// Odgovor 0 je pogosto trivialen; tak primer zavržemo, razen kjer je 0 namenoma možen
// odgovor (zeroOk). Tudi null (neprimerna kombinacija števil) ponovimo tukaj.
// dropZero: po 60 poskusih z ničelnim odgovorom vrni null namesto takšne naloge.
const isZero = (a) => (a.type === "number" && Math.abs(a.value) < 1e-12) || (a.type === "fraction" && a.num === 0);
export function wrapGens(gens, { dropZero = true } = {}) {
  return gens.map((gn) => ({
    ...gn,
    gen(level, r, topic) {
      let t = null;
      for (let i = 0; i < 60; i++) {
        t = gn.gen(level, r, topic);
        if (t && (t.zeroOk || !isZero(t.answer))) break;
      }
      if (!t || (dropZero && !t.zeroOk && isZero(t.answer))) return null;
      const { zeroOk, ...task } = t;
      return task;
    },
  }));
}
