#!/usr/bin/env node
// Oznake lekcij (blok :::simboli, content/lessons/README.md) za klikljive formule.
//   node scripts/simboli.js <lekcije…>        # povzetek za pisca: formule, manjkajoče oznake, slovar, stavki
//   node scripts/simboli.js --brez [<poti…>]  # samo seznam lekcij, ki jim oznake še manjkajo
// Pisec iz povzetka napiše blok :::simboli na konec lekcije (ne bere cele lekcije).
import fs from "node:fs";
import path from "node:path";
import { LESSONS_DIR, parseLesson } from "../server/textbook.js";
import { getTopic } from "../server/curriculum.js";
import { checkSymbols } from "../server/lesson-check.js";
import { symbolsIn, lookupSymbol, SYMBOLS_BLOCK_RE } from "../public/formula-data.js";

const args = process.argv.slice(2);
const listOnly = args.includes("--brez");
let files = args.filter((a) => !a.startsWith("-"));
if (!files.length || (listOnly && files.every((f) => !f.endsWith(".md")))) {
  const only = files.length ? files : null;
  files = [];
  for (const dir of fs.readdirSync(LESSONS_DIR).sort()) {
    const d = path.join(LESSONS_DIR, dir);
    if (!fs.statSync(d).isDirectory() || (only && !only.some((p) => dir.startsWith(p)))) continue;
    for (const f of fs.readdirSync(d).sort()) if (f.endsWith(".md")) files.push(path.join(d, f));
  }
}

const missingOf = (body) => {
  const warns = [];
  checkSymbols(body, () => {}, (w) => warns.push(w));
  return warns;
};
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

for (const file of files) {
  const abs = path.resolve(file);
  const id = `${path.basename(path.dirname(abs))}/${path.basename(abs, ".md")}`;
  const src = fs.readFileSync(abs, "utf8");
  const body = src.replace(/^---\n[\s\S]*?\n---\n?/, "");
  const has = SYMBOLS_BLOCK_RE.test(body);
  SYMBOLS_BLOCK_RE.lastIndex = 0;
  if (listOnly) {
    if (!has) console.log(path.relative(process.cwd(), abs));
    continue;
  }
  const t = getTopic(id);
  const subject = t?.subject || id.slice(0, 3);
  // Vse oznake iz izpostavljenih formul, s slovarskim pomenom in stavki, kjer se pojavijo.
  const text = body.replace(SYMBOLS_BLOCK_RE, "");
  const display = [];
  text.replace(/\$\$([\s\S]+?)\$\$/g, (_, x) => (display.push(x.trim()), ""));
  text.replace(/^[ \t]*:::[ \t]*formula[ \t]*\n([\s\S]*?)\n[ \t]*:::[ \t]*$/gm, (_, f) => (f.replace(/\$\$?([^$]+?)\$\$?/g, (__, x) => (display.push(x.trim()), "")), ""));
  const uniq = [...new Set(display.map((d) => d.replace(/\s+/g, " ")))];
  const keys = [];
  for (const d of uniq) for (const [k] of symbolsIn(d, "@*")) if (!keys.includes(k) && k !== "π") keys.push(k);
  console.log(`\n## ${id} | ${subject} | ${t ? clip(t.name, 60) : "?"}${has ? " | ŽE IMA :::simboli" : ""}`);
  if (has) for (const m of body.matchAll(SYMBOLS_BLOCK_RE)) console.log(`obstoječi blok:\n${m[1]}`);
  console.log(`formule: ${clip(uniq.slice(0, 14).map((d) => clip(d, 90)).join("  ;  "), 1100)}`);
  const sentences = text.replace(/\$\$[\s\S]+?\$\$/g, " [F] ").split(/(?<=[.!?:])\s+|\n+/);
  for (const k of keys) {
    const base = k.replace(/^Δ/, "").split("_")[0];
    const d = lookupSymbol(k, subject, uniq.join(" ")) || lookupSymbol(base, subject, uniq.join(" "));
    const hits = sentences.filter((s) => /\$/.test(s) && symbolsIn((s.match(/\$([^$]+)\$/g) || []).join(" ").replace(/\$/g, " "), "@*").some(([x]) => x === k)).slice(0, 2);
    console.log(`- ${k}${d ? ` [slovar: ${d.n}${d.u ? `, ${d.u}` : ""}]` : ""}${hits.length ? ` :: ${hits.map((h) => clip(h.trim(), 150)).join(" // ")}` : ""}`);
  }
}
