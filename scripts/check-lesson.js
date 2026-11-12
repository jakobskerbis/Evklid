#!/usr/bin/env node
// Preveri obliko lekcij učbenika (content/lessons/README.md).
//   node scripts/check-lesson.js content/lessons/MAT-OS-8/pitagorov-izrek.md [...]
//   node scripts/check-lesson.js            # vse lekcije
//   node scripts/check-lesson.js -q [...]   # izpiše samo lekcije z napako/opozorilom + skupno vrstico
// Izhodna koda 1, če ima katera lekcija napako. Opozorila ne štejejo.
import fs from "node:fs";
import path from "node:path";
import { LESSONS_DIR, stripRacunBlocks } from "../server/textbook.js";
import { parseClaims, checkClaims } from "../server/racun.js";
import { casStop } from "../server/cas.js";
import { checkLessonSource } from "../server/lesson-check.js";

const strict = process.argv.includes("--strict"); // tudi opozorila so napake
const quiet = process.argv.includes("-q") || process.argv.includes("--tiho"); // varčno z izhodom (docs/token-rules.md)
let files = process.argv.slice(2).filter((a) => !a.startsWith("-"));
if (!files.length) {
  for (const dir of fs.readdirSync(LESSONS_DIR)) {
    const d = path.join(LESSONS_DIR, dir);
    if (!fs.statSync(d).isDirectory()) continue;
    for (const f of fs.readdirSync(d)) if (f.endsWith(".md")) files.push(path.join(d, f));
  }
}
let bad = 0;
let calcChecked = 0; // številskih korakov, ki jih je preračunal server/lesson-math.js
for (const file of files) {
  const abs = path.resolve(file);
  const id = `${path.basename(path.dirname(abs))}/${path.basename(abs, ".md")}`;
  let src;
  try {
    src = fs.readFileSync(abs, "utf8");
  } catch {
    console.log(`${file}: datoteke ni`);
    bad++;
    continue;
  }
  const r = checkLessonSource(stripRacunBlocks(src), id);
  // Blok <<RACUN …>> (server/racun.js): vsako trditev preveri SymPy ali urejevalnik enačb; napačna je napaka lekcije.
  const claims = parseClaims(src);
  if (claims.length) {
    const c = await checkClaims(claims);
    r.calcChecked += c.checked;
    for (const f of c.failed) r.errors.push(`RACUN: ${f.line} – ${f.why}`);
    for (const u of c.unsure) r.warnings.push(`RACUN ni preverjen: ${u.line} – ${u.why}`);
  }
  const fail = r.errors.length || (strict && r.warnings.length);
  if (fail) bad++;
  calcChecked += r.calcChecked;
  if (quiet && !r.errors.length && !r.warnings.length) continue;
  console.log(`${fail ? "NAPAKA" : "OK"} ${id} (${r.words} besed, ${r.examples} primerov, ${r.questions} vprašanj, ${r.calcChecked} računov preverjenih)`);
  for (const e of r.errors) console.log(`  napaka: ${e}`);
  for (const w of r.warnings) console.log(`  opozorilo: ${w}`);
}
console.log(`${files.length - bad}/${files.length} lekcij v redu; ${calcChecked} številskih korakov preračunanih.`);
casStop();
process.exit(bad ? 1 : 0);
