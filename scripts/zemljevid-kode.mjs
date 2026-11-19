#!/usr/bin/env node
// Zemljevid kode za človeka (zunanji pregled 18. 11. 2026, točki 41 in 42 načrta izboljšav): za vsako datoteko v
// server/, public/ (samo .js na vrhu mape) in scripts/ izpiše število vrstic in prvo vrstico uvodnega komentarja.
// Datoteke, ki so večinoma podatki (velike tabele lekcij, izpitov, učnih načrtov), so v svojem razdelku, da se
// koda in podatki ne mešata. Na koncu so vsote, ki jih primerjamo iz meseca v mesec (pravilo obsega v docs/pregled.md).
//
//   node scripts/zemljevid-kode.mjs            → zapiše docs/zemljevid-kode.md
//   node scripts/zemljevid-kode.mjs --vsote    → izpiše samo vsote (za mesečni zapis)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXT = /\.(m|c)?js$/;
// Podatkovne datoteke: ime to pove ali pa so to velike tabele (več kot 3000 vrstic in malo funkcij).
// Ime se primerja ozko: tipkovnica.js, demos.js, exam-papers.js (vmesnik) in build-pse-extra.js so koda.
const DATA_NAME = /(^|-)data[-.]|^[a-z]+-extra\.|razsiritve|vsebina|^exam-papers-|^our-papers|^regions\.|^tipkovnica-(data|glide|besede)/;

function files(dir, { recursive = true } = {}) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return [];
  const out = [];
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.posix.join(dir, e.name);
    if (e.isDirectory()) {
      if (recursive) out.push(...files(rel));
    } else if (EXT.test(e.name)) out.push(rel);
  }
  return out.sort();
}

function describe(rel) {
  const text = fs.readFileSync(path.join(root, rel), "utf8");
  const lines = text.split("\n");
  let desc = "";
  for (const l of lines.slice(0, 40)) {
    const t = l.trim();
    if (!t || t.startsWith("#!") || /^import\s/.test(t) || /^["']use strict/.test(t)) continue;
    const m = t.match(/^(?:\/\/+|\/?\*+)\s?(.*)$/);
    if (!m) break;
    if (m[1].trim()) {
      desc = m[1].trim();
      break;
    }
  }
  const fns = (text.match(/\bfunction\b|=>/g) || []).length;
  const n = lines.length - (text.endsWith("\n") ? 1 : 0);
  const data = DATA_NAME.test(path.basename(rel)) || (n > 3000 && fns < n / 200);
  return { rel, n, desc: desc.replace(/\|/g, "/").slice(0, 160), data };
}

const groups = [
  ["Strežnik", files("server")],
  ["Odjemalec (public/*.js, samo vrhnja mapa)", files("public", { recursive: false })],
  ["Skripte", files("scripts", { recursive: false })],
];

const sum = (arr) => arr.reduce((a, b) => a + b.n, 0);
const rows = groups.map(([name, list]) => [name, list.map(describe)]);
const totals = rows.map(([name, items]) => ({
  name,
  koda: sum(items.filter((i) => !i.data)),
  podatki: sum(items.filter((i) => i.data)),
  datotek: items.length,
}));

if (process.argv.includes("--vsote")) {
  for (const t of totals) console.log(`${t.name}: koda ${t.koda} vrstic, podatki ${t.podatki} vrstic, ${t.datotek} datotek`);
  process.exit(0);
}

const fmt = (n) => n.toLocaleString("sl-SI");
let md = `# Zemljevid kode

Samodejno ustvarjeno z \`node scripts/zemljevid-kode.mjs\` (${new Date().toISOString().slice(0, 10)}). Ne urejaj ročno: popravi uvodni
komentar datoteke in znova poženi skripto. Opis je prva vrstica komentarja na vrhu datoteke.

## Kje je kaj

| Kaj | Kje |
|---|---|
| Zagon strežnika, vse poti API | \`server/app.js\`, \`server/index.js\` |
| Računi, prijava, starost in privolitev staršev, izbris | \`server/accounts/\` (\`auth.js\`, \`age.js\`, \`izbris.js\`, \`index.js\`) |
| Plačila, paketi, odstop, garancija | \`server/accounts/plans.js\`, \`server/accounts/billing.js\`, \`server/accounts/stripe.js\`, \`server/placila/\` |
| Klic modela AI, poziv inštruktorja, meje porabe | \`server/claude.js\`, \`server/prompt.js\`, \`prompts/system_prompt.md\`, \`server/usage.js\`, \`server/meje-ai.js\` |
| Preverjanje odgovorov | \`server/live-check.js\`, \`server/verify.js\`, \`server/sodba-koraka.js\`, \`server/hitri-korak.js\` |
| Varnost učencev (stiska, nujni primeri) | \`server/nujno.js\`, \`server/stiska-obvestilo.js\`, \`public/nujno.js\` |
| Baza, šifriranje, roki hrambe, kopije | \`server/db.js\`, \`server/crypto-polje.js\`, \`server/zasebnost.js\`, \`server/kopije*.js\` |
| Vadnica (generatorji nalog) | \`server/practice/\` |
| Vsebina lekcij | \`content/lessons/\` (Markdown, ni v tem seznamu) |

## Vsote

| Del | Koda (vrstic) | Podatki (vrstic) | Datotek |
|---|---:|---:|---:|
${totals.map((t) => `| ${t.name} | ${fmt(t.koda)} | ${fmt(t.podatki)} | ${t.datotek} |`).join("\n")}

»Podatki« so datoteke, ki so večinoma tabele (učni načrti, izpitne pole, fakultetni predmeti), ne logika.
`;
for (const [name, items] of rows) {
  md += `\n## ${name}\n\n| Datoteka | Vrstic | Kaj dela |\n|---|---:|---|\n`;
  for (const i of items) md += `| \`${i.rel}\`${i.data ? " (podatki)" : ""} | ${fmt(i.n)} | ${i.desc || "–"} |\n`;
}
fs.writeFileSync(path.join(root, "docs/zemljevid-kode.md"), md);
console.log(`docs/zemljevid-kode.md: ${rows.reduce((a, [, it]) => a + it.length, 0)} datotek`);
