#!/usr/bin/env node
// Na katerih aksiomih stoji vsak dokaz v lean/Evklid (docs/lean.md; pregled L1, 25. 11. 2026). Dovoljeni so samo
// standardni propext, Classical.choice in Quot.sound; sorryAx, Lean.ofReduceBool (native_decide) ali lasten
// aksiom pomeni, da trditev ni zares dokazana. Teče po `lake build` (.github/workflows/lean.yml).
// Uporaba: node scripts/lean-aksiomi.mjs  (v mapi lean mora biti zgrajen projekt)
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const LEAN = path.resolve(import.meta.dirname, "..", "lean");
const DOVOLJENI = new Set(["propext", "Classical.choice", "Quot.sound"]);

function walk(dir, out = []) {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) walk(p, out);
    else if (d.name.endsWith(".lean")) out.push(p);
  }
  return out;
}

// Imena izrekov: `theorem ime` znotraj `namespace X` (gnezdenje imenskih prostorov upoštevano). `private theorem`
// se izpusti: od zunaj ni dosegljiv, njegovi aksiomi pa se pokažejo pri javnih izrekih, ki ga uporabljajo.
export function izreki(src) {
  const ns = [];
  const out = [];
  for (const line of src.split("\n")) {
    let m;
    if ((m = line.match(/^namespace\s+(\S+)/))) ns.push(m[1]);
    else if ((m = line.match(/^end\s+(\S+)/)) && ns.at(-1) === m[1]) ns.pop();
    else if ((m = line.match(/^(?:protected\s+)?theorem\s+([^\s:({[]+)/))) out.push([...ns, m[1]].join("."));
  }
  return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const imena = [];
  const moduli = [];
  for (const f of walk(path.join(LEAN, "Evklid"))) {
    imena.push(...izreki(fs.readFileSync(f, "utf8")));
    moduli.push(path.relative(LEAN, f).replace(/\.lean$/, "").split(path.sep).join("."));
  }
  const tmp = path.join(LEAN, ".lake", "Aksiomi.lean");
  fs.writeFileSync(tmp, [...moduli.map((m) => `import ${m}`), ...imena.map((n) => `#print axioms ${n}`), ""].join("\n"));
  let izpis;
  try {
    izpis = execFileSync("lake", ["env", "lean", tmp], { cwd: LEAN, encoding: "utf8", maxBuffer: 64 << 20 });
  } catch (e) {
    console.error(String(e.stdout || "") + String(e.stderr || ""));
    process.exit(1);
  }
  const slabi = [];
  let n = 0;
  for (const m of izpis.matchAll(/'(\S+?)' (?:depends on axioms: \[([^\]]*)\]|does not depend on any axioms)/g)) {
    n++;
    const ax = (m[2] || "").split(",").map((s) => s.trim()).filter(Boolean);
    const tuji = ax.filter((a) => !DOVOLJENI.has(a));
    if (tuji.length) slabi.push(`${m[1]}: ${tuji.join(", ")}`);
  }
  if (n !== imena.length) {
    console.error(`Izpisanih aksiomov za ${n} od ${imena.length} izrekov:\n${izpis.slice(0, 4000)}`);
    process.exit(1);
  }
  console.log(`Aksiomi: ${n} izrekov, ${slabi.length} z nedovoljenimi aksiomi.`);
  for (const s of slabi) console.log(`✗ ${s}`);
  process.exit(slabi.length ? 1 : 0);
}
