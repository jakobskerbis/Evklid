// Pregled kakovosti generatorjev nalog po merilih iz docs/kakovost.md.
// Zagon: node scripts/kakovost-nalog.js [--vse] [predpona-id]
// Izpiše povzetek in generatorje, ki merilom ne zadostijo.
import { GENERATORS, generateTask } from "../server/practice/index.js";
import { getTopic, listPaths, getPath } from "../server/curriculum.js";
import { hasGenerator } from "../server/practice/index.js";

const all = process.argv.includes("--vse");
const prefix = process.argv.slice(2).find((a) => !a.startsWith("--")) || "";
const SEEDS = 24;
const skel = (s) => String(s).replace(/\d+([.,{}]+\d+)*/g, "#").replace(/\s+/g, " ");

const rows = [];
for (const g of GENERATORS) {
  if (!g.id.startsWith(prefix)) continue;
  const topicId = g.topics.find((t) => getTopic(t));
  if (!topicId) continue;
  const st = { id: g.id, n: 0, hint: 0, data: 0, formula: 0, solution: 0, steps: 0, mistakes: 0, types: new Set(), texts: [new Set(), new Set(), new Set()], skels: [new Set(), new Set(), new Set()] };
  for (let level = 1; level <= 3; level++) {
    for (let seed = 1; seed <= SEEDS * 4 && st.texts[level - 1].size + 0 < 1e9; seed++) {
      let t;
      try {
        t = generateTask(topicId, level, seed);
      } catch {
        continue;
      }
      if (t.generator !== g.id) continue;
      st.n++;
      if (t.hint) st.hint++;
      if (t.data?.given?.length || t.data?.find?.length) st.data++;
      if (t.formula) st.formula++;
      if (t.solution) {
        st.solution++;
        st.steps += String(t.solution).split("\n").filter((x) => x.trim()).length;
      }
      if (t.answer.mistakes?.length || t.mistakes?.length) st.mistakes++;
      st.types.add(t.answer.type);
      st.texts[level - 1].add(t.text);
      st.skels[level - 1].add(skel(t.text));
      if (st.texts[level - 1].size >= SEEDS) break;
    }
  }
  if (!st.n) continue;
  const pct = (k) => Math.round((100 * st[k]) / st.n);
  const lv = st.skels.map((s) => s.size);
  const same13 = [...st.skels[0]].every((s) => st.skels[2].has(s)) && st.skels[0].size > 0;
  const issues = [];
  if (pct("hint") < 100) issues.push(`namig ${pct("hint")} %`);
  if (pct("solution") < 100) issues.push(`rešitev ${pct("solution")} %`);
  if (pct("data") < 100) issues.push(`podatki ${pct("data")} %`);
  if (st.solution && st.steps / st.solution < 2 && !st.types.has("choice")) issues.push(`rešitev ima ${(st.steps / st.solution).toFixed(1)} vrstice`);
  if (same13) issues.push("raven 1 = raven 3 (ista predloga)");
  const variety = Math.min(...st.texts.map((s) => s.size).filter(Boolean));
  if (variety < 8) issues.push(`malo različnih nalog (${variety})`);
  if (st.types.size === 1 && st.types.has("choice")) issues.push("samo izbirni odgovori");
  rows.push({ ...st, pct, lv, issues, mistakesPct: pct("mistakes") });
}

const sum = (f) => rows.reduce((a, r) => a + f(r), 0);
console.log(`Generatorjev: ${rows.length}`);
for (const k of ["hint", "data", "formula", "solution", "mistakes"]) {
  console.log(`  ${k.padEnd(9)} pri vseh nalogah: ${rows.filter((r) => r.pct(k) === 100).length}, delno: ${rows.filter((r) => r.pct(k) > 0 && r.pct(k) < 100).length}, nikoli: ${rows.filter((r) => r.pct(k) === 0).length}`);
}
console.log(`  raven 1 = raven 3: ${rows.filter((r) => r.issues.some((i) => i.startsWith("raven"))).length}`);
console.log(`  malo različnih nalog: ${rows.filter((r) => r.issues.some((i) => i.startsWith("malo"))).length}`);
console.log(`  povprečno vrstic rešitve: ${(sum((r) => r.steps) / Math.max(1, sum((r) => r.solution))).toFixed(1)}`);

// Pokritost: teme OŠ/SŠ/TEK brez generatorja
const missing = [];
let topics = 0;
for (const subj of ["MAT", "FIZ", "KEM"]) {
  for (const p of listPaths(subj)) {
    for (const u of getPath(p.key).units) for (const t of u.topics) {
      topics++;
      if (!hasGenerator(t.id)) missing.push(t.id);
    }
  }
}
console.log(`Teme OŠ/SŠ/TEK brez generatorja: ${missing.length} od ${topics}`);
if (all) missing.forEach((m) => console.log("  - " + m));

const bad = rows.filter((r) => r.issues.length);
console.log(`\nGeneratorji z vrzelmi: ${bad.length}`);
for (const r of all ? bad : bad.slice(0, 40)) console.log(`  ${r.id}: ${r.issues.join("; ")}`);
