#!/usr/bin/env node
// Sestavi vzporedni obliki A in B preizkusa znanja za pilot (N-10, j 2026-11-25): 12 nalog iz 12 sklopov
// Predmetnega izpitnega kataloga za splošno maturo – matematika (RIC 2026, docs/matura-katalog.md), ena naloga na
// sklop. Obliki imata na vsakem mestu isto temo, isto raven in ISTI generator (isti tip naloge), a druga števila.
// Naloge so zamrznjene v content/pilot-preizkus/matura-mat.json (besedilo in pravilni odgovor), da se med pilotom ne
// spremenijo, tudi če se generator popravi; oceni jih koda (checkAnswer), brez AI.
//
//   node scripts/pilot-preizkus.js           # preveri, ali je datoteka enaka ponovno sestavljeni
//   node scripts/pilot-preizkus.js --write   # zapiši (samo pred začetkom pilota: spremeni meritev)
import fs from "node:fs";
import { generateTask } from "../server/practice/index.js";
import { checkAnswer } from "../server/practice/check.js";
import * as MATH from "../public/graph/math.js";

export const VERSION = "matura-mat-1";
// [sklop kataloga, tema z generatorji, raven 1–3]
export const BLUEPRINT = [
  ["4.3.2 Racionalna števila", "MAT-SS-1/racionalna-stevila", 1],
  ["4.4 Algebrski izrazi, enačbe in neenačbe", "MAT-SS-1/linearne-enacbe", 2],
  ["4.5 Potence in koreni", "MAT-SS-2/koreni", 2],
  ["4.7 Geometrijski liki in telesa", "MAT-SS-1/trikotnik", 2],
  ["4.8 Vektorji v ravnini in prostoru", "MAT-SS-3/skalarni-produkt", 2],
  ["4.10.1 Linearna funkcija", "MAT-SS-1/linearna-funkcija", 1],
  ["4.10.4 Kvadratna funkcija", "MAT-SS-2/kvadratna-funkcija", 3],
  ["4.10.6 Logaritemska funkcija", "MAT-SS-2/logaritem", 2],
  ["4.10.9 Kotne funkcije", "MAT-SS-3/kotne-funkcije-poljubnega-kota", 2],
  ["4.12 Zaporedja in vrste", "MAT-SS-4/aritmeticno-in-geometrijsko-zaporedje", 2],
  ["4.13 Diferencialni račun", "MAT-SS-4/odvod", 3],
  ["4.16 Verjetnostni račun", "MAT-SS-4/verjetnost", 3],
];
const TYPES = ["number", "fraction", "choice"]; // eno polje ali gumbi, brez slike (kot preizkus v aplikaciji)
const START = { A: 1000, B: 100000 };

// Pravilni odgovor kot ga vpiše učenec (za samopreverjanje zamrznjene naloge).
export function rightInput(t) {
  const a = t.answer;
  if (a.type === "choice") return String(a.index);
  if (a.type === "fraction") return `${a.num}/${a.den}`;
  return a.unit ? `${a.value} ${a.unit}` : String(a.value);
}
const grades = (t, input) => checkAnswer(t.answer, input, { find: t.data?.find, text: t.text, math: MATH }).kind;

function usable(t) {
  // Samo osnovna raven (vsi maturanti): naloge z oznako »(višja raven)« ne.
  if (!t || t.figure || !TYPES.includes(t.answer?.type) || /višja raven/i.test(t.text)) return false;
  const k = grades(t, rightInput(t));
  return k === "correct";
}
// Samo to, kar preizkus potrebuje (brez namiga, formule in rešitve: v preizkusu jih učenec ne vidi).
const freeze = (t) => ({ text: t.text, answer: t.answer, data: t.data ?? null, topicId: t.topicId, level: t.level, generator: t.generator ?? null, seed: t.seed });

// Oblika besedila brez števil in imen: vzporedna naloga ima skoraj isto obliko (isti tip vprašanja, druga števila).
const shape = (t) => t.text.replace(/\\[a-z]+/gi, "").replace(/-?\d+(?:[.,{}]+\d+)*/g, "#").replace(/\b[A-ZČŠŽ][a-zčšžćđ]+\b/g, "N").replace(/\s+/g, " ");
function similar(a, b) {
  const x = shape(a), y = shape(b);
  const d = Array.from({ length: y.length + 1 }, (_, j) => j);
  for (let i = 1; i <= x.length; i++) {
    let prev = d[0];
    d[0] = i;
    for (let j = 1; j <= y.length; j++) {
      const tmp = d[j];
      d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (x[i - 1] === y[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return 1 - d[y.length] / Math.max(x.length, y.length, 1);
}
export const MIN_SIMILAR = 0.85;
// Pravilni odgovor (pri izbiri cela izbira), da B ni ista naloga z drugim besedilom.
const key = (t) => JSON.stringify(t.answer.type === "choice" ? [t.answer.options, t.answer.index] : [t.answer.value, t.answer.num, t.answer.den]);

export function build() {
  const forms = { A: [], B: [] };
  const texts = new Set();
  BLUEPRINT.forEach(([, topic, level], i) => {
    let a = null;
    for (let s = START.A + i * 100; s < START.A + i * 100 + 100 && !a; s++) {
      const t = generateTask(topic, level, s, "sl");
      if (usable(t) && !texts.has(t.text)) a = t;
    }
    if (!a) throw new Error(`Oblika A, mesto ${i + 1} (${topic}): ni primerne naloge.`);
    let b = null;
    for (let s = START.B + i * 1000; s < START.B + i * 1000 + 1000 && !b; s++) {
      const t = generateTask(topic, level, s, "sl");
      if (usable(t) && t.generator === a.generator && t.answer.type === a.answer.type && similar(t, a) >= MIN_SIMILAR && t.text !== a.text && key(t) !== key(a) && !texts.has(t.text)) b = t;
    }
    if (!b) throw new Error(`Oblika B, mesto ${i + 1} (${topic}): ni vzporedne naloge.`);
    texts.add(a.text).add(b.text);
    forms.A.push(freeze(a));
    forms.B.push(freeze(b));
  });
  return { version: VERSION, source: "Predmetni izpitni katalog za splošno maturo 2026 – matematika (RIC), docs/matura-katalog.md", slots: BLUEPRINT.map(([sklop, topic, level]) => ({ sklop, topic, level })), forms };
}

const FILE = new URL("../content/pilot-preizkus/matura-mat.json", import.meta.url);
if (import.meta.url === `file://${process.argv[1]}`) {
  const out = `${JSON.stringify(build(), null, 2)}\n`;
  if (process.argv.includes("--write")) {
    fs.writeFileSync(FILE, out);
    console.log("Zapisano: content/pilot-preizkus/matura-mat.json");
  } else {
    const now = fs.existsSync(FILE) ? fs.readFileSync(FILE, "utf8") : "";
    console.log(now === out ? "Obliki sta enaki ponovno sestavljenima." : "Obliki se razlikujeta od ponovno sestavljenih (generator se je spremenil). Zamrznjeni obliki veljata naprej.");
  }
}
