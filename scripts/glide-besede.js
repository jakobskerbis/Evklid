// Seznam slovenskih besed za drsenje po črkah (glide) iz lastnih vsebin aplikacije, brez zunanjih virov.
// Zagon: node scripts/glide-besede.js  → public/tipkovnica-glide-sl.js (pogostost padajoče, WORDS.sl najprej).
// Bere content/**/*.md; odstrani oznake, LaTeX in kodo, šteje samo besede iz črk slovenske abecede.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WORDS } from "../public/tipkovnica-besede.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public/tipkovnica-glide-sl.js");
const MAX_BYTES = 138 * 1024;
const MIN_COUNT = 2;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

export function clean(text) {
  return String(text)
    .replace(/^---\n[\s\S]*?\n---\n/, " ") // okvir z lastnostmi
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`\n]*`/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$[^$\n]*\$/g, " ")
    .replace(/\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\]\([^)]*\)/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\\[A-Za-z]+/g, " "); // ukazi LaTeX zunaj $…$
}

export function countWords(text, counts = new Map()) {
  for (const m of clean(text).toLocaleLowerCase("sl").matchAll(/\p{L}+/gu)) {
    const w = m[0];
    if (w.length < 2 || w.length > 20 || /[^a-zčšžćđ]/.test(w)) continue; // samo latinica slovenske abecede
    counts.set(w, (counts.get(w) || 0) + 1);
  }
  return counts;
}

// enote, kratice, orodja (besede iz WORDS.sl ostanejo, ker so na začetku seznama)
const STOP = ["mol", "kg", "cm", "mm", "km", "dm", "hz", "khz", "mhz", "kpa", "mpa", "hpa", "kwh", "kj", "kcal", "ml", "dl", "mg", "ms", "ns", "id", "approx", "python", "sql", "excel", "latex", "max", "min", "new", "by", "syn", "lys", "lacy", "frac", "cdot", "text", "sqrt", "lim", "int", "sum", "vec", "hat", "bar", "left", "right", "begin", "end", "partial", "infty", "times", "mathrm", "operatorname", "quad", "displaystyle", "tfrac", "dfrac", "overline", "underline", "ldots", "cdots", "dots", "leq", "geq", "neq", "pm", "deg", "sin", "cos", "tan", "cot", "log", "exp", "arcsin", "arccos", "arctan", "sinh", "cosh", "tanh", "alpha", "beta", "gamma", "delta", "theta", "lambda", "sigma", "omega", "epsilon", "mu", "rho", "phi", "psi", "tau", "eta", "kappa", "nu", "xi", "chi", "zeta", "overrightarrow", "mathbb", "boxed", "circ", "rightarrow", "leftarrow", "implies", "iff", "forall", "exists", "emptyset", "cup", "cap", "subset", "subseteq", "mathbf", "mathit", "ce", "pu", "si", "unit"].filter((w) => !WORDS.sl.includes(w));

export function build() {
  const counts = new Map();
  const files = walk(path.join(ROOT, "content"));
  // Ne-besede (pregled 3): imena ukazov LaTeX, enote, kratice in angleščina se ne smejo pojaviti pri drsenju.
  const stop = new Set([...STOP, ...(WORDS.en || [])]);
  for (const f of files) {
    const src = fs.readFileSync(f, "utf8");
    for (const m of src.matchAll(/\\([a-zA-Z]+)/g)) stop.add(m[1].toLowerCase());
    countWords(src, counts);
  }
  const seeds = WORDS.sl;
  const seen = new Set();
  const list = [];
  for (const w of seeds) if (!seen.has(w)) (seen.add(w), list.push(w));
  const rest = [...counts].filter(([w, n]) => n >= MIN_COUNT && !seen.has(w) && w.length > 2 && !stop.has(w)).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "sl"));
  let size = 300;
  for (const [w] of rest) {
    size += w.length + 4;
    if (size > MAX_BYTES) break;
    list.push(w);
  }
  return { list, files: files.length, seeds: seeds.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { list, files, seeds } = build();
  const lines = [];
  for (let i = 0; i < list.length; i += 12) lines.push("  " + list.slice(i, i + 12).map((w) => JSON.stringify(w)).join(", ") + ",");
  const src = `// Ustvari: node scripts/glide-besede.js (iz content/**/*.md; ne urejaj ročno). Slovenske besede za drsenje po črkah,
// najprej WORDS.sl, nato po pogostosti v vsebinah aplikacije (vsaj 2x).
export const GLIDE_SL = [\n${lines.join("\n")}\n];\n`;
  fs.writeFileSync(OUT, src);
  console.log(`${list.length} besed (${seeds} iz WORDS.sl, ${files} datotek), ${(Buffer.byteLength(src) / 1024).toFixed(0)} KB -> ${path.relative(ROOT, OUT)}`);
}
