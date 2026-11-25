#!/usr/bin/env node
// Preveri obliko lekcij učbenika (content/lessons/README.md).
//   node scripts/check-lesson.js content/lessons/MAT-OS-8/pitagorov-izrek.md [...]
//   node scripts/check-lesson.js            # vse lekcije
//   node scripts/check-lesson.js -q [...]   # izpiše samo lekcije z napako/opozorilom + skupno vrstico
//   node scripts/check-lesson.js --strogo   # (tudi samo, če CI=true) brez preverjevalnika SymPy izhodna koda 2
// Izhodna koda 1, če ima katera lekcija napako. Opozorila ne štejejo.
// Brez SymPy so trditve <<RACUN le opozorila »ni preverjen«, in lekcije so »v redu«, čeprav jih ni nihče preveril.
// Zato v CI (.github/workflows/testi.yml, posel lekcije) in z --strogo nedosegljiv preverjevalnik ni tiho opozorilo.
import fs from "node:fs";
import path from "node:path";
import { LESSONS_DIR, stripRacunBlocks } from "../server/textbook.js";
import { parseClaims, checkClaims } from "../server/racun.js";
import { casAvailable, casStop } from "../server/cas.js";
import { checkLessonSource } from "../server/lesson-check.js";

const strict = process.argv.includes("--strict"); // tudi opozorila so napake
const quiet = process.argv.includes("-q") || process.argv.includes("--tiho"); // varčno z izhodom (docs/token-rules.md)
const strogo = process.argv.includes("--strogo") || process.env.CI === "true"; // preverjevalnik SymPy mora delati
// why iz server/cas.js, ko preverjevalnika ni ali se je med tekom ustavil. »prepočasno« (rok ene trditve) ostane le opozorilo:
// tam preverjevalnik dela, le ta izraz je pretežak, naslednji klic zažene nov proces.
const NI_PREVERJEVALNIKA = new Set(["preverjevalnik ni na voljo", "preverjevalnik se je ustavil"]);
function brezPreverjevalnika(kje) {
  console.log(`NAPAKA: preverjevalnik računov (SymPy, server/cas.js) ni na voljo ${kje}, zato trditve <<RACUN niso preverjene.`);
  console.log("  Namesti ga z `node scripts/namesti-sympy.cjs` (Python 3 + pip; teče tudi ob npm ci). Brez --strogo (in brez CI=true) so to samo opozorila.");
  casStop();
  process.exit(2);
}
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
let casPreverjen = false; // --strogo: ali je preverjevalnik že potrjen (enkrat, pred prvo lekcijo s trditvami)
let brezCas = 0; // --strogo: trditve, ki jih preverjevalnik med tekom ni preveril, ker se je ustavil ali ga ni bilo več
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
  const claims = parseClaims(src, Infinity); // lekcija: vse trditve, ne le prvih 16 (meja velja za odgovore inštruktorja)
  if (claims.length) {
    if (strogo && !casPreverjen) {
      if (!(await casAvailable())) brezPreverjevalnika(process.argv.includes("--strogo") ? "(--strogo)" : "(CI=true)");
      casPreverjen = true;
    }
    const c = await checkClaims(claims, { max: Infinity, budgetMs: Infinity });
    r.calcChecked += c.checked;
    for (const f of c.failed) r.errors.push(`RACUN: ${f.line} – ${f.why}`);
    for (const u of c.unsure) r.warnings.push(`RACUN ni preverjen: ${u.line} – ${u.why}`);
    if (strogo) brezCas += c.unsure.filter((u) => NI_PREVERJEVALNIKA.has(u.why)).length;
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
if (brezCas) brezPreverjevalnika(`za ${brezCas} trditev (med preverjanjem se je ustavil)`);
casStop();
process.exit(bad ? 1 : 0);
