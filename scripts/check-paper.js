#!/usr/bin/env node
// Preveri našo polo (server/our-papers.js): oblika, točke po delih kot izvirna pola, LaTeX, številski koraki.
// Uporaba: node scripts/check-paper.js content/exam-papers/<id>.json [...] [--pola N]
import fs from "node:fs";
import { validatePaper } from "../server/our-papers.js";
import { PAPER_STRUCTURES } from "../server/our-paper-structures.js";

const files = process.argv.slice(2).filter((a) => a.endsWith(".json"));
// --pola N: preveri le del pole (pisec ene izpitne pole): zgradba samo nalog te pole, brez vsote točk.
const polaArg = process.argv.indexOf("--pola");
const onlyPola = polaArg > 0 ? Number(process.argv[polaArg + 1]) : null;
const forPola = (s) => (s && onlyPola ? { ...s, points: null, maxListed: null, tasks: s.tasks.filter((t) => t.pola === onlyPola) } : s);
let bad = 0;
for (const f of files) {
  let p;
  try {
    p = JSON.parse(fs.readFileSync(f, "utf8"));
  } catch (e) {
    console.log(`✗ ${f}: ni veljaven JSON (${e.message})`);
    bad++;
    continue;
  }
  // Pri --pola tudi iz datoteke le naloge te pole (datoteka ima lahko že vse pole), brez skupne vsote points.
  if (onlyPola && Array.isArray(p?.tasks)) p = { ...p, points: undefined, tasks: p.tasks.filter((t) => t?.pola === onlyPola) };
  const r = validatePaper(p, forPola(PAPER_STRUCTURES[p.id]) || null);
  if (r.errors.length) bad++;
  console.log(`${r.errors.length ? "✗" : "✓"} ${f}: ${r.points} točk, ${r.checked} preračunanih korakov${PAPER_STRUCTURES[p.id] ? "" : " (brez zgradbe izvirne pole)"}`);
  for (const e of r.errors) console.log(`  - ${e}`);
}
process.exit(bad ? 1 : 0);
