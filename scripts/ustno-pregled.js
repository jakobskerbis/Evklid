#!/usr/bin/env node
// Ročni pregled vprašanj iz :::premisli za ustno spraševanje (vzorec 2, pravilo 6).
//   node scripts/ustno-pregled.js                 vprašanja brez veljavnega pregleda (novo ali spremenjeno v lekciji)
//   node scripts/ustno-pregled.js --vsa           vsa vprašanja iz :::premisli (za ponoven pregled)
//   node scripts/ustno-pregled.js --od 0 --n 60   serija (za pregled po delih)
//   node scripts/ustno-pregled.js --sprejmi f.json  vpiše odločitve { "<id>": { "o": "D"|"I", "r": "razlog", "k": [pojmi] } }
//   node scripts/ustno-pregled.js --stej          število ponujenih vprašanj po vrstah
// Merilo: vprašanje je smiselno samostojno na glas, brez sklica na zgodbo, sliko, poskus ali prejšnji korak lekcije,
// in pojmi točkovnika zahtevajo le, kar vprašanje sprašuje (»k« obdrži le te pojme).
import fs from "node:fs";
import path from "node:path";
import { loadLesson } from "../server/textbook.js";
import { getTopic } from "../server/curriculum.js";
import { lessonQuestions, reviewed } from "../server/ustno.js";

const root = path.join(import.meta.dirname, "..");
const file = path.join(root, "server", "ustno-pregled.json");
const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
let data = { opis: "", vprasanja: {} };
try {
  data = JSON.parse(fs.readFileSync(file, "utf8"));
} catch (e) {
  if (e.code !== "ENOENT") throw e;
}

const all = [];
const dir = path.join(root, "content", "lessons");
for (const d of fs.readdirSync(dir).filter((x) => !x.includes(".")).sort()) {
  for (const f of fs.readdirSync(path.join(dir, d)).filter((x) => x.endsWith(".md")).sort()) {
    const id = `${d}/${f.slice(0, -3)}`;
    const name = getTopic(id)?.name || id;
    for (const q of lessonQuestions(id, loadLesson(id), name, { pregled: false })) all.push(q);
  }
}
const premisli = all.filter((q) => q.h);

if (args.includes("--stej")) {
  const by = {};
  for (const q of all) if (reviewed(q, data.vprasanja)) by[q.vrsta] = (by[q.vrsta] || 0) + 1;
  const izl = premisli.filter((q) => data.vprasanja[q.id]?.h === q.h && data.vprasanja[q.id].o === "I").length;
  const brez = premisli.filter((q) => data.vprasanja[q.id]?.h !== q.h).length;
  console.log(JSON.stringify({ ponujeno: by, skupaj: Object.values(by).reduce((a, b) => a + b, 0), premisli: premisli.length, izlocenih: izl, brezPregleda: brez }));
} else if (args.includes("--sprejmi")) {
  const dec = JSON.parse(fs.readFileSync(opt("--sprejmi"), "utf8"));
  // Tudi pogosta napaka (neobvezen vnos, npr. »k«): zgoščena vrednost iz »hn«.
  const byId = new Map(all.filter((q) => q.h || q.hn).map((q) => [q.id, q]));
  let n = 0;
  for (const [id, e] of Object.entries(dec)) {
    const q = byId.get(id);
    if (!q || !["D", "I"].includes(e.o)) throw new Error(`neznano vprašanje ali odločitev: ${id}`);
    if (e.k && !e.k.every((p) => q.pojmi.includes(p))) throw new Error(`pojem ni v točkovniku: ${id}`);
    data.vprasanja[id] = { h: q.h || q.hn, o: e.o, ...(e.r ? { r: e.r } : {}), ...(e.k ? { k: e.k } : {}) };
    n++;
  }
  data.vprasanja = Object.fromEntries(Object.entries(data.vprasanja).sort(([a], [b]) => (a < b ? -1 : 1)));
  fs.writeFileSync(file, JSON.stringify(data, null, 1) + "\n");
  console.log(`vpisanih ${n}`);
} else {
  const list = args.includes("--vsa") || args.includes("--od") ? premisli : premisli.filter((q) => data.vprasanja[q.id]?.h !== q.h);
  const od = Number(opt("--od", 0));
  const part = list.slice(od, od + Number(opt("--n", list.length)));
  for (const q of part) console.log(`${q.id} [${q.vrsta}] ${q.besedilo.replace(/\s+/g, " ")}\n${q.pojmi.map((p, i) => `  ${i + 1}. ${p}`).join("\n")}`);
  console.error(`${part.length} od ${list.length}`);
}
