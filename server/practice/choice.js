// Izbirna vprašanja za izpite (SAT, JEE, NEET, gaokao …): številski ali ulomkovni odgovor
// spremeni v štiri (ali pet, ENEM) možnosti s pravilnim odgovorom in verjetnimi napakami (dvakrat, polovica,
// nasprotni predznak, zamik za korak, napačna desetiška enota, obrnjen ulomek).
import { makeRng } from "./rng.js";
import { fmt, gcd, roundHalfUp } from "./check.js";

const reduce = (n, d) => {
  const g = gcd(n, d);
  const s = d < 0 ? -1 : 1;
  return [(s * n) / g, (s * d) / g];
};
const fracTex = (n, d) => {
  const [a, b] = reduce(n, d);
  return b === 1 ? `${a}` : `${a < 0 ? "-" : ""}\\frac{${Math.abs(a)}}{${b}}`;
};

// Pravilni odgovor na naključno mesto (enakomerno A–D).
function place(r, right, picked) {
  const options = r.shuffle(picked);
  const index = Math.floor(r.next() * (options.length + 1));
  options.splice(index, 0, right);
  return { options, index };
}

function numberOptions(ans, lang, r, wrong) {
  const v = ans.value;
  const d = ans.decimals ?? (Number.isInteger(v) ? 0 : null);
  const show = (x) => {
    const s = lang === "en" ? (d === null ? String(Number(x.toFixed(6))) : roundHalfUp(x, d).toFixed(d)) : fmt(x, d);
    return ans.unit ? `${s} ${ans.unit}` : s;
  };
  const right = show(v);
  const mag = Math.abs(v) || 1;
  const unit = d === null ? 10 ** Math.floor(Math.log10(mag) - 1) : 10 ** -d;
  const step = Math.max(unit, roundHalfUp(mag * 0.1, d ?? 4) || unit);
  const raw = [v * 2, v / 2, -v, v + step, v - step, v * 10, v / 10, v + 2 * step, v * 1.5, v - 2 * step];
  const seen = new Set([right]);
  const picked = [];
  for (const x of r.shuffle(raw)) {
    if (!Number.isFinite(x)) continue;
    if (d === 0 && !Number.isInteger(roundHalfUp(x, 0))) continue;
    const s = show(x);
    if (seen.has(s)) continue;
    seen.add(s);
    picked.push(s);
    if (picked.length === wrong) break;
  }
  for (let k = 3; picked.length < wrong && k < 24; k++) {
    const s = show(v + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * step);
    if (!seen.has(s)) {
      seen.add(s);
      picked.push(s);
    }
  }
  return { ...place(r, right, picked), tex: false };
}

function fractionOptions(ans, r, wrong) {
  const { num: n, den: d } = ans;
  const right = fracTex(n, d);
  const value = n / d;
  const raw = [[d, n], [-n, d], [n + 1, d], [n, d + 1], [2 * n, d], [n, 2 * d], [n - 1, d], [n + d, d], [n, d - 1], [n + 1, d + 1], [n + 2, d], [n, d + 2]];
  // Verjetnost in podobno (0 < x < 1): tudi napačne možnosti med 0 in 1.
  const unitRange = value > 0 && value < 1;
  const seen = new Set([right]);
  const picked = [];
  const add = (a, b) => {
    if (!b || picked.length >= wrong) return;
    if (unitRange && !(a / b > 0 && a / b < 1)) return;
    const s = fracTex(a, b);
    if (seen.has(s)) return;
    seen.add(s);
    picked.push(s);
  };
  for (const [a, b] of r.shuffle(raw)) add(a, b);
  for (let k = 1; picked.length < wrong && k < 14; k++) add(n + k * (k % 2 ? 1 : -1), d + k);
  for (let k = 1; picked.length < wrong && k < 14; k++) add(k * (k % 2 ? 1 : -1), 1 + (k % 3));
  return { ...place(r, right, picked), tex: true };
}

// Vrne nalogo z izbirnim odgovorom (ali isto nalogo, če je že izbirna ali je ni mogoče spremeniti).
export function toChoice(task, seed = task.seed || 1, count = 4) {
  const a = task.answer;
  if (!a || a.type === "choice" || (a.type !== "number" && a.type !== "fraction")) return task;
  const r = makeRng((seed ^ 0x5bd1e995) >>> 0);
  const o = a.type === "number" ? numberOptions(a, task.lang, r, count - 1) : fractionOptions(a, r, count - 1);
  if (o.options.length < count || o.index < 0) return task;
  return {
    ...task,
    answer: { type: "choice", options: o.options, index: o.index },
    options_tex: o.tex,
    inputHint: null,
    format: "choice",
  };
}
