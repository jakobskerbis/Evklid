#!/usr/bin/env node
// Preveri našo polo (server/our-papers.js): oblika, točke po delih kot izvirna pola, LaTeX, številski koraki.
// Uporaba: node scripts/check-paper.js content/exam-papers/NPZ9-MAT-2026-redni.json [--zgradba "1+1+1+1+2,1+1+1+3,…"]
import fs from "node:fs";
import { validatePaper } from "../server/our-papers.js";
import { PAPER_STRUCTURES } from "../server/our-paper-structures.js";

const files = process.argv.slice(2).filter((a) => a.endsWith(".json"));
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
  const r = validatePaper(p, PAPER_STRUCTURES[p.id] || null);
  if (r.errors.length) bad++;
  console.log(`${r.errors.length ? "✗" : "✓"} ${f}: ${r.points} točk, ${r.checked} preračunanih korakov${PAPER_STRUCTURES[p.id] ? "" : " (brez zgradbe izvirne pole)"}`);
  for (const e of r.errors) console.log(`  - ${e}`);
}
process.exit(bad ? 1 : 0);
