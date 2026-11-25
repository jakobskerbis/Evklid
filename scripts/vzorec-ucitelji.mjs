#!/usr/bin/env node
// Reprezentativni vzorec vsebine za neodvisen strokovni pregled učiteljev (N-06, načrt »Kakovost pred obsegom«;
// j 25. 11. 2026: »Vzorec zdaj, plačilo po 1. plačilu«). Navodila in obrazec: docs/strokovni-pregled.md.
//
// Slepi izbor: vzorec ni izbran na roko. Iz semena (privzeto zgoščena vrednost commita main, na katerem je bil vzorec
// prvič izbran) ga določi ponovljivo naključje (mulberry32), po plasteh (predmet, raven, letnik), zato ga nihče ne more
// »olepšati« z lažjimi lekcijami, vsak pa ga lahko ponovi z istim semenom.
//
// Uporaba:
//   node scripts/vzorec-ucitelji.mjs [--seme <niz>] [--json] [--md] [--slike <mapa>]
// --slike zapiše slike delov pol (SVG) v mapo, da jih učitelj vidi brez prijave (docs/strokovni-pregled-slike).
// Brez --json/--md izpiše kratek povzetek.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { makeRng, nOf } from "../server/practice/rng.js";
import { generateTask, hasGenerator } from "../server/practice/index.js";
import { ourPaperIds, loadOurPaper } from "../server/our-papers.js";
import { getTopic } from "../server/curriculum.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LESSONS = path.join(ROOT, "content", "lessons");
export const PRIVZETO_SEME = "77a3955"; // main 25. 11. 2026, preden je bil vzorec izbran

// Plasti lekcij: koliko lekcij iz vsake mape. Teža je na snovi, ki jo bodo uporabljali pilotni maturanti
// (MAT SŠ), FIZ in KEM SŠ za maturo, OŠ manj. BIO, NAR, tekmovanja in faks so v naslednjem krogu.
export const PLASTI = {
  "MAT-SS-1": 3, "MAT-SS-2": 3, "MAT-SS-3": 3, "MAT-SS-4": 3,
  "MAT-OS-6": 1, "MAT-OS-7": 1, "MAT-OS-8": 1, "MAT-OS-9": 1,
  "FIZ-SS-1": 2, "FIZ-SS-2": 2, "FIZ-SS-3": 1, "FIZ-SS-4": 1,
  "FIZ-OS-8": 1, "FIZ-OS-9": 1,
  "KEM-SS-1": 2, "KEM-SS-2": 2, "KEM-SS-3": 1, "KEM-SS-4": 1,
  "KEM-OS-8": 1, "KEM-OS-9": 1,
};
// Naloge Vadnice (generatorji): po predmetu, raven 2 (srednja), iz tem SŠ z generatorjem.
export const NALOGE = { MAT: 6, FIZ: 3, KEM: 3 };
// Deli naših maturitetnih pol: po predmetu.
export const POLE = { MAT: 2, FIZ: 2, KEM: 2 };

const seedNum = (s) => crypto.createHash("sha256").update(String(s)).digest().readUInt32BE(0);

// Ponovljivo izbere k elementov (brez ponavljanja) iz seznama, urejenega po imenu.
function izberi(list, k, rng) {
  const a = [...list].sort();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.min(k, a.length)).sort();
}

export function izberiVzorec(seme = PRIVZETO_SEME) {
  const lekcije = [];
  for (const [mapa, k] of Object.entries(PLASTI)) {
    const dir = path.join(LESSONS, mapa);
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3)) : [];
    const rng = makeRng(seedNum(`${seme}|lekcije|${mapa}`));
    for (const slug of izberi(files, k, rng)) {
      const id = `${mapa}/${slug}`;
      lekcije.push({ id, ime: getTopic(id)?.name || slug, plast: mapa, povezava: `https://evklid.app/ucbenik/${mapa}/${slug}` });
    }
  }
  const naloge = [];
  for (const [predmet, k] of Object.entries(NALOGE)) {
    const teme = fs
      .readdirSync(LESSONS)
      .filter((d) => new RegExp(`^${predmet}-SS-\\d$`).test(d))
      .flatMap((d) => fs.readdirSync(path.join(LESSONS, d)).filter((f) => f.endsWith(".md")).map((f) => `${d}/${f.slice(0, -3)}`))
      .filter((id) => hasGenerator(id));
    const rng = makeRng(seedNum(`${seme}|naloge|${predmet}`));
    for (const id of izberi(teme, k, rng)) {
      const seed = 1 + Math.floor(rng.next() * 100000);
      const t = generateTask(id, 2, seed, "sl");
      naloge.push({ tema: id, ime: getTopic(id)?.name || id, generator: t.generator, seme: seed, besedilo: t.text, odgovor: t.answer, resitev: t.solution || null });
    }
  }
  const pole = [];
  for (const [predmet, k] of Object.entries(POLE)) {
    const ids = [...ourPaperIds().keys()].filter((id) => id.startsWith(`MATURA-${predmet}-`)).sort();
    const deli = ids.flatMap((pid) => {
      const p = loadOurPaper(pid);
      return (p.tasks || []).flatMap((tk) => (tk.parts || []).map((part, i) => ({ pid, tk, part, kljuc: `${pid}#${tk.pola || 1}-${tk.section || ""}${tk.n}${part.id || (tk.parts.length > 1 ? String.fromCharCode(97 + i) : "")}` })));
    });
    const rng = makeRng(seedNum(`${seme}|pole|${predmet}`));
    const izbrani = new Set(izberi(deli.map((d) => d.kljuc), k, rng));
    for (const d of deli.filter((x) => izbrani.has(x.kljuc))) pole.push({ kljuc: d.kljuc, uvod: d.tk.intro || null, besedilo: d.part.text || "", odgovor: d.part.answer || "", tocke: d.part.points ?? null, slika: d.part.figure || d.tk.figure || null });
  }
  return { seme, lekcije, naloge, pole };
}

// Odgovor generatorja, kot ga učenec vidi ob preverjanju (zaokrožen na zahtevane decimalke, z decimalno vejico).
const vejica = (x) => String(x).replace(".", ",");
// Brez decimalk: 12 veljavnih mest (0,1 + 0,2 → 0,3), majhne vrednosti (1,6e-19) ostanejo.
const stevilo = (v, d) => (typeof v === "number" && Number.isInteger(d) ? vejica(v.toFixed(d)) : typeof v === "number" ? vejica(Number(v.toPrecision(12))) : String(v));
const enota = (u) => (!u ? "" : /^[°′″]$/.test(u) ? u : ` ${u}`); // 60,0° brez presledka, 5 % in 734 J s presledkom
const zaokrozeno = (d) => (!Number.isInteger(d) ? "" : d === 0 ? " (zaokroženo na celo število)" : ` (zaokroženo na ${nOf(d, "decimalko", "decimalki", "decimalke", "decimalk")})`);
export function odg(a) {
  if (a == null) return "";
  if (typeof a === "string") return a;
  if (a.type === "choice" && Array.isArray(a.options)) return String(a.options[a.index] ?? "");
  if (a.type === "fraction") return `${a.num}/${a.den}`;
  if (a.type === "coefficients" && Array.isArray(a.values)) return a.values.join(", ");
  if (a.value != null) return `${[].concat(a.value).map((v) => stevilo(v, a.decimals)).join("; ")}${enota(a.unit)}${zaokrozeno(a.decimals)}`;
  return JSON.stringify(a);
}
const ena = (s) => String(s || "").replace(/\s*\n\s*/g, " ").replace(/\|/g, "&#124;");

export function vzorecMd(v) {
  const L = [];
  L.push(`# Vzorec za strokovni pregled (N-06)`, "");
  L.push(`Seme: \`${v.seme}\` · izbral \`node scripts/vzorec-ucitelji.mjs --md\` · navodila in obrazec: \`docs/strokovni-pregled.md\`.`, "");
  L.push(`## A. Lekcije (${v.lekcije.length})`, "", "| # | Lekcija | Plast | Povezava |", "|---|---|---|---|");
  v.lekcije.forEach((l, i) => L.push(`| A${i + 1} | ${ena(l.ime)} | ${l.plast} | ${l.povezava} |`));
  L.push("", `## B. Naloge Vadnice (${v.naloge.length}, raven 2)`, "", "Vsaka naloga je izdelana s programom (generator, seme); učitelj preveri besedilo, odgovor in rešitev.", "");
  v.naloge.forEach((n, i) => {
    L.push(`**B${i + 1}.** ${ena(n.ime)} (\`${n.generator}\`, seme ${n.seme})`, "", `- Naloga: ${ena(n.besedilo)}`, `- Odgovor Evklida: ${ena(odg(n.odgovor))}`);
    if (n.resitev) L.push(`- Rešitev Evklida: ${ena([].concat(n.resitev).join(" "))}`);
    L.push("");
  });
  L.push(`## C. Deli naših maturitetnih pol (${v.pole.length})`, "", "Naloge je napisal Evklid (AI) po zgradbi izvirne pole; učitelj preveri besedilo, odgovor in točkovnik.", "");
  v.pole.forEach((p, i) => {
    L.push(`**C${i + 1}.** \`${p.kljuc}\`${p.tocke != null ? ` (${p.tocke} t.)` : ""}`, "");
    if (p.uvod) L.push(`- Uvod naloge: ${ena(p.uvod)}`);
    if (p.slika) L.push(`- Slika: \`docs/strokovni-pregled-slike/C${i + 1}.svg\``);
    L.push(`- Besedilo: ${ena(p.besedilo)}`, `- Odgovor Evklida: ${ena(odg(p.odgovor))}`, "");
  });
  return L.join("\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const i = process.argv.indexOf("--seme");
  const v = izberiVzorec(i > 0 ? process.argv[i + 1] : PRIVZETO_SEME);
  if (process.argv.includes("--json")) console.log(JSON.stringify(v, null, 2));
  else if (process.argv.includes("--md")) console.log(vzorecMd(v));
  const j = process.argv.indexOf("--slike");
  if (j > 0) {
    const dir = path.resolve(process.argv[j + 1] || path.join(ROOT, "docs", "strokovni-pregled-slike"));
    fs.mkdirSync(dir, { recursive: true });
    v.pole.forEach((p, i) => p.slika && fs.writeFileSync(path.join(dir, `C${i + 1}.svg`), p.slika));
  }
  if (!["--json", "--md", "--slike"].some((f) => process.argv.includes(f))) console.log(`Seme ${v.seme}: ${v.lekcije.length} lekcij, ${v.naloge.length} nalog Vadnice, ${v.pole.length} delov pol.`);
}
