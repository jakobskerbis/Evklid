// Preimenuje aplikacijo: node scripts/preimenuj.js <Ime> [--slug ime] [--env IME] [--znak Ime,] [--domena ime.app] [--suho]
//   --slug   notranje ime z malimi črkami (privzeto ime brez šumnikov, z malimi črkami): baza, ključi, dogodki
//   --env    predpona nastavitev v .env (privzeto SLUG z velikimi črkami)
//   --znak   logotip v dveh delih, drugi je v barvi poudarka (privzeto »Imen,o«: zadnja črka v barvi)
//   --suho   samo pokaže, kaj bi se spremenilo
// Zamenja trenutno ime (brand.json) povsod: vidno besedilo, logotip, nastavitve <ENV>_*, ključe <slug>.*,
// imena datotek. Trenutno ime doda v brand.json → legacy, da se nastavitve, baza, piškotki in
// bližnjice prenesejo same (koda za prenos bere legacy). Menja samo cele besede: če je ime tudi
// običajna beseda (Evklid → Evklidov algoritem, id simulacije »evklid«), preglej seznam na koncu. Sklonov (»v Komprenu«, »Komprenóban«) ne zna:
// na koncu izpiše vse vrstice, kjer je ostal koren starega imena, te popravi ročno v vseh jezikih.
// Nato: npm test (test/ime.test.js pade, dokler kje ostane staro ime).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const name = args.find((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));
const dry = args.includes("--suho");
if (!name) {
  console.log("Uporaba: node scripts/preimenuj.js <Ime> [--slug ime] [--env IME] [--znak Ime,] [--domena ime.app] [--suho]");
  process.exit(1);
}
const brandFile = path.join(root, "brand.json");
const cur = JSON.parse(fs.readFileSync(brandFile, "utf8"));
const plain = name.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z]/g, "");
const slug = opt("--slug") || plain.toLowerCase();
const env = opt("--env") || slug.toUpperCase();
const wordmark = (opt("--znak") || `${name.slice(0, -1)},${name.slice(-1)}`).split(",");
if (wordmark.join("") !== name) throw new Error("--znak mora skupaj dati ime, npr. --znak Razum,ko");
if (!/^[a-z]+$/.test(slug) || !/^[A-Z]+$/.test(env)) throw new Error("slug in env: samo črke a–z");
if (slug === cur.slug) throw new Error(`Aplikacija se že imenuje ${cur.name}.`);

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const stem = cur.slug.replace(/[aeiou]$/, ""); // koren za sklone: kompreno → kompren
const SKIP_DIRS = new Set([".git", ".claude", "node_modules", "data", "vendor"]);
const SKIP_FILES = new Set(["brand.json", "test/ime.test.js", "scripts/preimenuj.js"]);
const TEXT = /\.(js|cjs|mjs|json|md|html|css|bat|cmd|command|yaml|yml|txt|svg|webmanifest|py|csv)$|^(Dockerfile|\.env\.example)$/;
// Ime repozitorija in j-jeve mape (<slug>-main, <slug>-sim) se ne menjata sama: repozitorij preimenuje j na GitHubu,
// nato v brand.json → repo vpiši novo ime in staro dodaj v legacy[].repo.
// Zgodovinska dejstva (ključi »greek.*« in »era.<slog>.*« v public/i18n, npr. Evklidovi Elementi) govorijo o
// matematiku Evklidu, ne o aplikaciji: ostanejo, kot so. Ob preimenovanju v greek.f1 v vseh jezikih ročno odstrani
// stavek, da se aplikacija imenuje po njem.
const KEEP = [new RegExp(esc(cur.repo || "\u0000"), "g"), new RegExp(`${esc(cur.slug)}-(?:main|sim)\\b`, "g"), /^\s*"(?:greek|era)\.[^\n]*/gm];

function* walk(dir) {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(d.name)) continue;
    const p = path.join(dir, d.name);
    if (d.isDirectory()) yield* walk(p);
    else yield p;
  }
}

function replaceAll(text) {
  const kept = [];
  let s = KEEP.reduce((t, re) => t.replace(re, (m) => `\u0000${kept.push(m) - 1}\u0000`), text);
  s = s.replace(new RegExp(`${esc(cur.wordmark[0])}(<span[^>]*>)${esc(cur.wordmark[1])}(</span>)`, "g"), `${wordmark[0]}$1${wordmark[1]}$2`);
  // Samo cele besede (ne »Evklidov algoritem«); _ . - : za imenom so dovoljeni (EVKLID_DB, evklid.theme).
  const word = (w) => new RegExp(`(?<![\\p{L}\\d])${esc(w)}(?![\\p{L}\\d])`, "gu");
  s = s.replace(word(cur.env), env).replace(word(cur.name), name).replace(word(cur.slug), slug);
  // seznam prejšnjih imen v theme.js (po zamenjavi, da staro ime v njem ostane)
  s = s.replace(/(const LEGACY = )(\[.*?\])(; \/\/ brand:legacy)/, (_m, a, list, b) => `${a}${JSON.stringify([cur.slug, ...JSON.parse(list)]).replace(/,/g, ", ")}${b}`);
  return s.replace(/\u0000(\d+)\u0000/g, (_m, i) => kept[i]);
}

// Zagonske .bat se lahko prepišejo med tekom: cmd nadaljuje na istem bajtu za vrstico »call "%~f0"«,
// zato mora biti vse do tam enako dolgo. Razliko poravnamo v komentarju z oznako SAMOPOSODOBITEV.
function keepBatOffsets(before, after) {
  const callAt = (s) => { const i = s.indexOf('call "%~f0"'); return i < 0 ? -1 : s.indexOf("\n", i) + 1; };
  const a = callAt(before), b = callAt(after);
  if (a < 0 || a === b) return after;
  const lines = after.split("\n");
  const k = lines.findIndex((l) => l.includes("-SAMOPOSODOBITEV:"));
  if (k < 0) throw new Error("zagonska datoteka brez oznake SAMOPOSODOBITEV");
  const cr = lines[k].endsWith("\r") ? "\r" : "";
  const body = lines[k].slice(0, lines[k].length - cr.length);
  const diff = b - a; // > 0: nova je daljša
  lines[k] = (diff > 0 ? body.slice(0, body.length - diff) : body + " ".repeat(-diff)) + cr;
  const out = lines.join("\n");
  if (callAt(out) !== a) throw new Error("poravnava .bat ni uspela");
  return out;
}

const changed = [], renamed = [];
for (const file of walk(root)) {
  const rel = path.relative(root, file).split(path.sep).join("/");
  if (!SKIP_FILES.has(rel) && TEXT.test(path.basename(file))) {
    const before = fs.readFileSync(file, "utf8");
    let after = replaceAll(before);
    if (/\.bat$/i.test(file)) after = keepBatOffsets(before, after);
    if (after !== before) { changed.push(rel); if (!dry) fs.writeFileSync(file, after); }
  }
  if (path.basename(file).includes(cur.slug)) {
    const to = path.join(path.dirname(file), path.basename(file).split(cur.slug).join(slug));
    renamed.push(`${rel} → ${path.relative(root, to)}`);
    if (!dry) {
      try { execFileSync("git", ["mv", file, to], { cwd: root, stdio: "ignore" }); } catch { fs.renameSync(file, to); }
    }
  }
}

const next = {
  ...cur, name, slug, env, wordmark,
  domain: opt("--domena") || undefined, // stara domena ne velja za novo ime
  legacy: [{ name: cur.name, slug: cur.slug, env: cur.env, until: new Date().toISOString().slice(0, 10), match: stem }, ...(cur.legacy || [])],
};
if (!dry) fs.writeFileSync(brandFile, JSON.stringify(next, null, 2) + "\n");

console.log(`${cur.name} → ${name} (slug ${slug}, nastavitve ${env}_*, logotip ${wordmark[0]}[${wordmark[1]}])${dry ? " – SUHO" : ""}`);
console.log(`Spremenjenih datotek: ${changed.length}${renamed.length ? `, preimenovanih: ${renamed.join(", ")}` : ""}.`);
const left = [], suffix = [];
const stemRe = new RegExp(stem, "i");
const suffixRe = new RegExp(`${esc(name)}(?:['’-]?[\\p{L}]+)`, "u"); // npr. Razumko'yu, Razumko-তে, Razumko가
for (const file of walk(root)) {
  const rel = path.relative(root, file).split(path.sep).join("/");
  if (SKIP_FILES.has(rel) || !TEXT.test(path.basename(file))) continue;
  let text = fs.readFileSync(file, "utf8");
  if (dry) text = replaceAll(text);
  text.split("\n").forEach((line, i) => {
    const at = `  ${rel}:${i + 1}: ${line.trim().slice(0, 140)}`;
    if (stemRe.test(line) && !line.includes("brand:legacy")) left.push(at);
    else if (suffixRe.test(line)) suffix.push(at);
  });
}
if (left.length) console.log(`\nRočno popravi sklone (ostal je koren »${stem}«), v vseh jezikih:\n${left.join("\n")}`);
if (suffix.length) console.log(`\nPreveri pripone za novim imenom (turščina, korejščina, bengalščina …):\n${suffix.join("\n")}`);
console.log("\nNato: npm test (test/ime.test.js), README/docs po potrebi, ime repozitorija na GitHubu je j-jeva odločitev.");
