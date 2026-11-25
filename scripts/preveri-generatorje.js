// Preveri vse generatorje nalog: vsaka naloga mora prestati preverjanje s svojim
// odgovorom, besedilo ne sme vsebovati "undefined"/"NaN", vsaka tema mora obstajati.
// Zagon: node scripts/preveri-generatorje.js [predpona-id]   (npr. uni-)
import { GENERATORS, generateTask } from "../server/practice/index.js";
import { checkAnswer, roundHalfUp, fmt } from "../server/practice/check.js";
import { getTopic } from "../server/curriculum.js";
import * as MATH from "../public/graph/math.js";

const prefix = process.argv[2] || "";
const SEEDS = Number(process.env.SEEDS || 40);

function correctInput(a) {
  if (a.type === "number") return (a.decimals != null ? fmt(roundHalfUp(a.value, a.decimals), a.decimals) : fmt(a.value)) + (a.unit ? " " + a.unit : "");
  if (a.type === "fraction") return `${a.num}/${a.den}`;
  if (a.type === "choice") return String(a.index);
  return a.values.join(",");
}

// Odgovor brez besedil (razlage napak in možnosti so v jeziku naloge).
const stripWhy = (a) => ({ ...a, why: undefined, options: a.type === "choice" ? a.options.length : undefined, mistakes: (a.mistakes || []).map((m) => m.value) });

let n = 0;
let bad = 0;
const ids = new Set();
for (const g of GENERATORS) {
  if (!g.id.startsWith(prefix)) continue;
  if (ids.has(g.id)) {
    console.log(`PODVOJEN ID: ${g.id}`);
    bad++;
  }
  ids.add(g.id);
  if (!g.topics.length) {
    console.log(`${g.id}: brez tem (napačen naslov teme?)`);
    bad++;
  }
  for (const topicId of g.topics) {
    if (!getTopic(topicId)) {
      console.log(`${g.id}: tema ${topicId} ne obstaja`);
      bad++;
      continue;
    }
    // Generatorji z maxYear (npr. tek-mladi-* do 4. razreda) se brez razreda ne izberejo: preverimo jih
    // za vsak razred od 1 (oz. minYear) do maxYear.
    const years = g.maxYear != null ? Array.from({ length: g.maxYear - (g.minYear ?? 1) + 1 }, (_, i) => (g.minYear ?? 1) + i) : [null];
    for (const [year, level] of years.flatMap((y) => [1, 2, 3].map((l) => [y, l]))) {
      for (let seed = 1; seed <= SEEDS; seed++) {
        try {
          const t = generateTask(topicId, level, seed, undefined, year);
          if (t.generator !== g.id) continue;
          n++;
          const a = t.answer;
          if (a.type === "number" && !Number.isFinite(a.value)) throw new Error(`odgovor ni število: ${a.value}`);
          if (a.type === "number" && a.decimals != null && Math.abs(a.value) < 0.5 * 10 ** -a.decimals && a.value !== 0) {
            throw new Error(`odgovor ${a.value} se zaokroži na 0 pri ${a.decimals} decimalkah`);
          }
          // Iste možnosti kot pri vaji (server/progress.js): cel zapis, »b = 7«, izraz namesto števila.
          const opts = { convert: true, text: t.text, find: t.data?.find, math: MATH };
          const res = checkAnswer(a, correctInput(a), opts);
          if (res.kind !== "correct") throw new Error(`lastni odgovor ${correctInput(a)} ni sprejet: ${JSON.stringify(res)}`);
          for (const m of a.mistakes || []) {
            if (!Number.isFinite(m.value) || !m.why) throw new Error(`napaka brez vrednosti ali razlage: ${JSON.stringify(m)}`);
            if (checkAnswer(a, fmt(m.value) + (a.unit ? " " + a.unit : ""), opts).kind === "correct") throw new Error(`tipična napaka ${m.value} je sprejeta kot pravilna`);
          }
          // Cel zapis s pravimi vrednostmi (»5√7« pri iskanem b) ni napačen poskus.
          if (a.form) {
            const whole = a.form.expr.replace(/\b[a-zA-Z]\b/g, (c) => (c in a.form.vals ? `(${a.form.vals[c]})` : c));
            const w = checkAnswer(a, whole, opts);
            if (w.code !== "chk.partOnly") throw new Error(`cel zapis ${whole} ni prepoznan: ${JSON.stringify(w)}`);
          }
          if (a.type === "choice" && a.why && a.why.length !== a.options.length) throw new Error("answer.why mora imeti razlago za vsako možnost (pri pravilni null)");
          const text = [t.text, t.hint, t.solution].join(" ");
          if (/undefined|NaN(?!O)|Infinity/.test(text)) throw new Error(`besedilo vsebuje undefined/NaN: ${t.text}`);
          if (/\$\$|\\\\\(/.test(t.text) === false && (t.text.split("$").length - 1) % 2) throw new Error(`neparno število $ v besedilu: ${t.text}`);
          // Dvojezični generatorji (indijski izpiti): hindijska naloga z istim semenom mora imeti
          // enak odgovor, besedilo v devanagariju in prav toliko $ kot angleška.
          if (g.langs?.includes("hi")) {
            const h = generateTask(topicId, level, seed, "hi", year);
            if (h.generator !== g.id || JSON.stringify(stripWhy(h.answer)) !== JSON.stringify(stripWhy(a))) throw new Error("hindijska naloga ima drug odgovor kot angleška (isto seme)");
            for (const f of ["text", "hint", "solution"]) {
              if (!h[f]) throw new Error(`hindijska naloga nima polja ${f}`);
              if (!/[\u0900-\u097F]/.test(h[f].replace(/\$[^$]*\$/g, ""))) throw new Error(`hindijsko polje ${f} ni v devanagariju: ${h[f].slice(0, 80)}`);
            }
            if (a.type === "choice" && a.why && (!h.answer.why || h.answer.why.length !== a.why.length)) throw new Error("hindijska razlaga možnosti manjka");
            for (const m of h.answer.mistakes || []) if (!/[\u0900-\u097F]/.test(m.why)) throw new Error(`hindijska razlaga napake ni v devanagariju: ${m.why}`);
            if (/undefined|NaN(?!O)|Infinity/.test([h.text, h.hint, h.solution].join(" "))) throw new Error(`hindijsko besedilo vsebuje undefined/NaN: ${h.text}`);
            if ((h.text.split("$").length - 1) % 2) throw new Error(`neparno število $ v hindijskem besedilu: ${h.text}`);
          }
        } catch (e) {
          bad++;
          if (bad <= 40) console.log(`${g.id} | ${topicId} | raven ${level}${year ? ` | ${year}. razred` : ""} | seme ${seed}: ${e.message}`);
        }
      }
    }
  }
}
console.log(`Generatorjev: ${ids.size}, nalog: ${n}, napak: ${bad}`);
process.exit(bad ? 1 : 0);
