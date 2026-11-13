// Iz podatkov PubChem (NCBI, javna domena) zgradi public/graph/pse-extra.js:
// elektronska konfiguracija, elektronegativnost (Pauling), pogosta oksidacijska števila,
// agregatno stanje, tališče in vrelišče (°C), gostota.
// Vir: https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/CSV (shranjen v scripts/pubchem-elementi.csv)
// Zagon: node scripts/build-pse-extra.js
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const csv = fs.readFileSync(path.join(root, "scripts/pubchem-elementi.csv"), "utf8").trim().split("\n");
const parseLine = (line) => {
  const out = [];
  let cur = "";
  let q = false;
  for (const ch of line) {
    if (ch === '"') q = !q;
    else if (ch === "," && !q) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
};
const head = parseLine(csv[0]);
const rows = csv.slice(1).map((l) => Object.fromEntries(parseLine(l).map((v, i) => [head[i], v.trim()])));

// vrstni red polnjenja (Madelung)
const L = "spdf";
const ORDER = [];
for (let s = 1; s <= 8; s++) for (let l = Math.min(3, s - 1); l >= 0; l--) {
  const n = s - l;
  if (n >= 1 && l < n) ORDER.push(`${n}${L[l]}`);
}
const NOBLE = { He: 2, Ne: 10, Ar: 18, Kr: 36, Xe: 54, Rn: 86 };
const occ = {};
for (const r of rows) {
  const z = Number(r.AtomicNumber);
  const m = {};
  let s = r.ElectronConfiguration.replace(/\(.*?\)/g, "").trim();
  const core = /^\[(\w+)\]/.exec(s);
  if (core) {
    Object.assign(m, occ[NOBLE[core[1]]]);
    s = s.slice(core[0].length);
  }
  for (const [, sub, k] of s.matchAll(/(\d[spdf])(\d+)/g)) m[sub] = Number(k);
  const sum = Object.values(m).reduce((a, b) => a + b, 0);
  if (sum !== z) throw new Error(`Z=${z}: vsota elektronov ${sum}`);
  occ[z] = m;
}
const nobleZ = [2, 10, 18, 36, 54, 86, 118];
const nobleSym = { 2: "He", 10: "Ne", 18: "Ar", 36: "Kr", 54: "Xe", 86: "Rn" };
function config(z) {
  const m = occ[z];
  const core = [...nobleZ].reverse().find((n) => n < z);
  const base = core ? occ[core] : {};
  const parts = ORDER.filter((sub) => m[sub] && m[sub] !== base[sub]).map((sub) => `${sub}${m[sub]}`);
  // podlupine jedra, ki se razlikujejo, ne obstajajo (jedro je vedno polno)
  for (const sub of Object.keys(base)) if (m[sub] !== base[sub]) throw new Error(`Z=${z}: jedro ${sub}`);
  return (core ? `[${nobleSym[core]}] ` : "") + parts.join(" ");
}
// Dopolnila k PubChem pri številih, ki jih uči šola (peroksidi, HClO2, manganat).
const OX_ADD = { 8: ["-1"], 17: ["+3"], 25: ["+6"] };
const kelvinToC = (v) => (v === "" ? "" : String(Math.round((Number(v) - 273.15) * 10) / 10));
const lines = rows.map((r) => {
  const z = Number(r.AtomicNumber);
  const predicted = /predicted|calculated/.test(r.ElectronConfiguration);
  let ox = z <= 103 ? r.OxidationStates.split(/,\s*/).filter(Boolean).map((x) => (x === "0" || /^[+-]/.test(x) ? x : `+${x}`)) : [];
  if (OX_ADD[z]) ox = [...new Set([...ox, ...OX_ADD[z]])];
  ox.sort((a, b) => Number(b) - Number(a));
  const state = z > 103 || /Expected/.test(r.StandardState) ? "" : { Solid: "s", Liquid: "l", Gas: "g" }[r.StandardState] || "";
  return [z, config(z) + (predicted ? "*" : ""), r.Electronegativity, ox.join(" "), state, kelvinToC(r.MeltingPoint), kelvinToC(r.BoilingPoint), z > 103 ? "" : r.Density].join("|");
});
const out = `// GENERIRANO: node scripts/build-pse-extra.js (vir: PubChem, NCBI, javna domena). Ne urejaj ročno.
// Vrstica: Z|konfiguracija (* = napovedana)|elektronegativnost (Pauling)|oksidacijska števila|stanje (s, l, g)|tališče °C|vrelišče °C|gostota (g/cm³)
const RAW = \`${lines.join("\n")}\`;

export const EXTRA = RAW.split("\\n").map((line) => {
  const [z, conf, en, ox, state, mp, bp, rho] = line.split("|");
  const num = (v) => (v === "" ? null : Number(v));
  return { z: Number(z), conf: conf.replace("*", ""), predicted: conf.endsWith("*"), en: num(en), ox: ox ? ox.split(" ") : [], state, mp: num(mp), bp: num(bp), rho: num(rho) };
});
`;
fs.writeFileSync(path.join(root, "public/graph/pse-extra.js"), out);
console.log("pse-extra.js:", lines.length, "elementov");
