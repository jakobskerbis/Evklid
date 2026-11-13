#!/usr/bin/env node
// Preveri liste s formulami (content/formulas/*.md): vsak razdelek ima blok :::simboli z vrstico
// za vsako črko iz svojih formul in brez pomenov iz drugega predmeta (server/lesson-check.js).
// Uporaba: node scripts/formule-simboli.js [MAT-OS …]   (brez argumentov: vsi listi)
import fs from "node:fs";
import path from "node:path";
import { FORMULAS_DIR } from "../server/textbook.js";
import { checkFormulaSheet } from "../server/lesson-check.js";

const keys = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(FORMULAS_DIR).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3));
let bad = 0;
for (const key of keys) {
  const raw = fs.readFileSync(path.join(FORMULAS_DIR, `${key}.md`), "utf8");
  const problems = checkFormulaSheet(raw, key.split("-")[0]);
  console.log(`${problems.length ? "✗" : "✓"} ${key}${problems.length ? "" : " v redu"}`);
  for (const p of problems) console.log(`  ${p}`);
  bad += problems.length;
}
process.exit(bad ? 1 : 0);
