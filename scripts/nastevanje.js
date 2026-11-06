#!/usr/bin/env node
// Najde (in s --popravi popravi) naštevanja števil z decimalno vejico, ločena z vejico:
// »1,5, 2 ali 2,99« → »1,5; 2 ali 2,99« (server/nastevanje.js; j, 6. 11. 2026).
//   node scripts/nastevanje.js                 # slovenske vsebine (lekcije, gradiva, formule, izpiti, razlage)
//   node scripts/nastevanje.js --popravi [poti] # popravi .md in .json; .js samo izpiše (popravi ročno)
// Vsak zadetek preglej: popravek je podpičje samo med elementi naštevanja, ki stojijo ob številu.
// »!« pri zadetku: vrstica že ima »; « (ločilo skupin), zato meja med skupinami po popravku morda ni več
// jasna. Naštevanje daj v oklepaj (»kosmiči ($4\,g$; $0{,}50$ €), jogurt (…)«), uporabi »in« ali razdeli stavek.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { najdiNastevanja, popraviNastevanja } from "../server/nastevanje.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fix = process.argv.includes("--popravi");
let roots = process.argv.slice(2).filter((a) => !a.startsWith("-"));
if (!roots.length) roots = ["content/lessons", "content/gradiva", "content/formulas", "content/exam-papers", "content/explanations.json", "public/i18n/sl.js"].map((p) => path.join(ROOT, p));
// Angleška in druga tujejezična besedila imajo drugačen zapis števil.
const SKIP = /university-extra\.js|[\\/]i18n[\\/]ui[\\/]|[\\/]references[\\/]|-(?:en|hi|in)\.json$|INDIA|JEE|CBSE/;

const files = [];
const walk = (p) => {
  const st = fs.statSync(p);
  if (st.isDirectory()) for (const f of fs.readdirSync(p).sort()) walk(path.join(p, f));
  else if (/\.(md|json|js)$/.test(p) && !SKIP.test(p)) files.push(p);
};
roots.forEach((r) => walk(path.resolve(r)));

// JSON: popravi vsak niz posebej (razkodiran), da se LaTeX z \\ prebere prav.
const JSON_STR = /"(?:[^"\\\n]|\\.)*"/g;
const fixJson = (raw) => raw.replace(JSON_STR, (lit) => {
  let s;
  try { s = JSON.parse(lit); } catch { return lit; }
  const f = popraviNastevanja(s);
  return f === s ? lit : JSON.stringify(f);
});

let n = 0;
let opozorila = 0;
// Podpičje, ki je bilo v vrstici že pred popravkom (ne LaTeX-ov presledek »\;«), ločuje nekaj drugega.
const zePodpicje = (line) => /(?<!\\);\s/.test(line);
for (const f of files) {
  const raw = fs.readFileSync(f, "utf8");
  const fixed = f.endsWith(".json") ? fixJson(raw) : f.endsWith(".md") ? popraviNastevanja(raw) : null;
  const hits = fixed != null ? diffLines(raw, fixed) : najdiNastevanja(raw);
  if (!hits.length) continue;
  const rel = path.relative(ROOT, f);
  const lines = raw.split("\n");
  for (const h of hits) {
    console.log(`${rel}:${h.line}\n  - ${h.before}\n  + ${h.after}`);
    if (zePodpicje(lines[h.line - 1])) {
      opozorila++;
      console.log("  ! vrstica že ima »; « zunaj naštevanja: preveri, da je meja med skupinami še jasna (naštevanje v oklepaj, »in« ali nov stavek).");
    }
  }
  n += hits.length;
  if (fix && fixed != null && fixed !== raw) fs.writeFileSync(f, fixed);
}
console.log(`${n} mest${fix ? " (popravljeno v .md in .json; .js popravi ročno)" : ""}.${opozorila ? ` Opozoril »!«: ${opozorila}.` : ""}`);
process.exit(n && !fix ? 1 : 0);

function diffLines(a, b) {
  const A = a.split("\n");
  const B = b.split("\n");
  const out = [];
  for (let i = 0; i < A.length; i++) {
    if (A[i] === B[i]) continue;
    let s = 0;
    while (A[i][s] === B[i][s]) s++;
    const from = Math.max(0, s - 40);
    out.push({ line: i + 1, before: A[i].slice(from, s + 60), after: B[i].slice(from, s + 60) });
  }
  return out;
}
