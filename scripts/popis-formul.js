// Popis matematičnega zapisa v lekcijah (j, 24. 11. 2026: »Evklid – obvezen enoten standard matematičnega zapisa«,
// faza F0 v projektnem dokumentu predlogi/enoten-matematicni-zapis-nacrt-2026-11-24.md). SAMO POROČILO: nič ne
// spreminja. Vsako lekcijo izriše po isti poti kot aplikacija (public/rich.js, KaTeX, marked) in v vidnem besedilu
// (brez izrisanih formul) poišče ostanke, ki jih učenec ne bi smel videti:
//   napaka   – formula, ki je KaTeX ne zna izrisati (prikaže se kot besedilo)
//   latex    – ukaz LaTeX zunaj formule (\frac, \sqrt, \cdot …)
//   dolar    – osamljen $ (nezaprta formula)
//   potenca  – x^2, a_n zunaj formule
//   koren    – sqrt(…) zunaj formule
// Uporaba: node scripts/popis-formul.js [--json] [--vzorci N] [poti …]   (privzeto vse content/lessons/**/*.md)
import fs from "node:fs";
import path from "node:path";
import katex from "katex";
import { marked } from "marked";
import { createRenderer } from "../public/rich.js";
import { parseLesson, expandFormulaBlocks, hideSolutions, hideQuickAnswers, viewCheck, stripRacunBlocks } from "../server/textbook.js";

const args = process.argv.slice(2);
const json = args.includes("--json");
const vi = args.indexOf("--vzorci");
const VZORCI = vi >= 0 ? Number(args[vi + 1]) || 3 : 3;
const poti = args.filter((a, i) => !a.startsWith("--") && (vi < 0 || i !== vi + 1));

function vseLekcije(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...vseLekcije(p));
    else if (e.name.endsWith(".md") && e.name !== "README.md") out.push(p);
  }
  return out;
}
const datoteke = poti.length ? poti : vseLekcije("content/lessons");

// Napake KaTeX štejemo posebej: izris z throwOnError (kot aplikacija ob neuspehu pade na besedilo).
let napakeTrenutne = [];
const katexStet = {
  renderToString(tex, o) {
    try {
      return `\u0001${katex.renderToString(tex, { ...o, throwOnError: true })}\u0002`;
    } catch (e) {
      if (o.throwOnError) throw e;
      napakeTrenutne.push({ tex, sporocilo: String(e.message).split("\n")[0] });
      return `\u0001${katex.renderToString(tex, o)}\u0002`;
    }
  },
};
const { renderRich } = createRenderer({ marked, katex: katexStet, sanitize: (h) => h });

// Vidno besedilo brez izrisanih formul in brez kode (```, `…`).
const vidno = (html) =>
  html
    .replace(/\u0001[^\u0002]*\u0002/g, " ⟦F⟧ ")
    .replace(/<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>|<svg[\s\S]*?<\/svg>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");

const VZOREC = {
  latex: /\\(?:frac|sqrt|cdot|times|int|sum|lim|left|right|mathrm|text|alpha|beta|pi|Delta|vec|overline|le|ge|neq|approx|infty)\b/g,
  dolar: /\$/g,
  // ^ brez pogleda nazaj (cm^2, 10^3); _ s pogledom nazaj (imena v SQL, npr. id_kluba), kemija posebej (CO_2).
  potenca: /[A-Za-z0-9)\]]\^[\w({]|(?<![\w/:.])[A-Za-z]_[\w{(]|(?<![\w/:.])[A-Z][a-z]?[A-Z]?[a-z]?_\d/g,
  koren: /\bsqrt\s*\(/g,
};

const izid = { lekcij: 0, cistih: 0, vrste: { napaka: 0, latex: 0, dolar: 0, potenca: 0, koren: 0 }, lekcije: [] };
for (const f of datoteke) {
  izid.lekcij++;
  napakeTrenutne = [];
  // Kot v aplikaciji (server/textbook.js lessonView): razdelki in drugačne razlage z razširjenimi bloki :::formula,
  // :::premisli, :::risba (:::simboli so podatki za klikljive oznake, niso vidni) in rešitvami za gumbom; »Preveri se«
  // po delih, kot jih izriše public/preveri-se-ziv.js (vprašanje, možnosti, enota, odgovor, namigi, razlaga).
  const L = parseLesson(stripRacunBlocks(fs.readFileSync(f, "utf8")));
  const deli = [...(L.sections || []), ...(L.alternatives || [])].map((x) => hideSolutions(hideQuickAnswers(expandFormulaBlocks(x.md, "html"))));
  for (const c0 of L.checks || []) {
    const c = viewCheck(c0);
    deli.push(c.q, ...(c.options || []), ...(c.items || []).map((x) => (typeof x === "string" ? x : x?.text ?? x?.t ?? "")), c.unit, c.answer, c.why, ...(c.wrong || []).map((w) => w.why));
  }
  const html = deli.filter((x) => typeof x === "string" && x.trim()).map((x) => renderRich(x)).join("\n");
  const t = vidno(html);
  const najdbe = { napaka: napakeTrenutne.map((n) => `${n.tex.slice(0, 80)} — ${n.sporocilo.slice(0, 80)}`) };
  for (const [k, re] of Object.entries(VZOREC)) {
    najdbe[k] = [];
    for (const m of t.matchAll(re)) najdbe[k].push(t.slice(Math.max(0, m.index - 30), m.index + 30).replace(/\s+/g, " ").trim());
  }
  const skupaj = Object.values(najdbe).reduce((a, b) => a + b.length, 0);
  if (!skupaj) {
    izid.cistih++;
    continue;
  }
  for (const k of Object.keys(najdbe)) izid.vrste[k] += najdbe[k].length;
  izid.lekcije.push({ datoteka: f, skupaj, najdbe });
}
izid.lekcije.sort((a, b) => b.skupaj - a.skupaj);

if (json) {
  console.log(JSON.stringify(izid, null, 1));
} else {
  console.log(`Lekcij: ${izid.lekcij} · brez ostankov: ${izid.cistih} · z ostanki: ${izid.lekcije.length}`);
  console.log("Po vrstah:", Object.entries(izid.vrste).map(([k, v]) => `${k} ${v}`).join(", "));
  for (const l of izid.lekcije) {
    console.log(`\n${l.datoteka} (${l.skupaj})`);
    for (const [k, v] of Object.entries(l.najdbe)) for (const s of v.slice(0, VZORCI)) console.log(`  ${k}: ${s}`);
  }
}
