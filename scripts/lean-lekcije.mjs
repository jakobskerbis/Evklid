#!/usr/bin/env node
// Lean dokazi lekcij (docs/lean.md, L2): vsaka datoteka lean/Evklid/Lekcije/**.lean ima v glavi
//   vir: content/lessons/<pot>.md
//   sha256: <zgoščena vrednost lekcije, ko je bil dokaz napisan in pregledan>
// Skripta javi, če lekcija ne obstaja več ali je bila spremenjena po dokazu (dokaz morda ni več za isto
// besedilo), in izpiše pokritost lekcij matematike. Izhod 1 ob neujemanju (.github/workflows/lean-lekcije.yml;
// ni med testi za objavo, zato sprememba lekcije ne zadrži objave, le opozori).
// Uporaba: node scripts/lean-lekcije.mjs [--json]
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIR = path.join(ROOT, "lean", "Evklid", "Lekcije");

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) walk(p, out);
    else if (d.name.endsWith(".lean")) out.push(p);
  }
  return out;
}

export function preveri() {
  const napake = [];
  const pokrite = new Set();
  for (const f of walk(DIR)) {
    const rel = path.relative(ROOT, f);
    const txt = fs.readFileSync(f, "utf8").slice(0, 4000);
    const vir = txt.match(/^vir: (content\/lessons\/\S+\.md)$/m)?.[1];
    const sha = txt.match(/^sha256: ([0-9a-f]{64})$/m)?.[1];
    if (!vir || !sha) { napake.push(`${rel}: v glavi manjka »vir:« ali »sha256:«`); continue; }
    const pot = path.join(ROOT, vir);
    if (!fs.existsSync(pot)) { napake.push(`${rel}: lekcija ${vir} ne obstaja več`); continue; }
    const zdaj = crypto.createHash("sha256").update(fs.readFileSync(pot)).digest("hex");
    if (zdaj !== sha) napake.push(`${rel}: lekcija ${vir} je bila spremenjena po dokazu; preveri dokaz in posodobi sha256`);
    if (pokrite.has(vir)) napake.push(`${rel}: lekcija ${vir} ima že drugo datoteko z dokazi`);
    pokrite.add(vir);
  }
  const vseMat = fs.readdirSync(path.join(ROOT, "content", "lessons"))
    .filter((d) => /^MAT-(OS|SS)-/.test(d))
    .flatMap((d) => fs.readdirSync(path.join(ROOT, "content", "lessons", d)).filter((f) => f.endsWith(".md")).map((f) => `content/lessons/${d}/${f}`));
  const pokriteMat = vseMat.filter((v) => pokrite.has(v)).length;
  return { napake, pokrite: [...pokrite].sort(), pokriteMat, vseMat: vseMat.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = preveri();
  if (process.argv.includes("--json")) console.log(JSON.stringify(r, null, 2));
  else {
    console.log(`Lean dokazi lekcij matematike OŠ/SŠ: ${r.pokriteMat} od ${r.vseMat}.`);
    for (const n of r.napake) console.log(`✗ ${n}`);
  }
  process.exit(r.napake.length ? 1 : 0);
}
