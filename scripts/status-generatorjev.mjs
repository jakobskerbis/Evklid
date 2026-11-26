#!/usr/bin/env node
// Status vsakega generatorja nalog (PV-10, docs/preverjanje.md). Za vsak generator vzame vzorec nalog (ravni 1–3,
// semena 1…N) in v vsaki rešitvi preveri tri vrste trditev:
//   račun     formula z relacijo v rešitvi: server/lesson-math.js in lesson-identity.js (kot popis PV-04)
//   korak     zaporedni enačbi ali neenačbi z isto eno neznanko (2x + 3 = 7 → 2x = 4): ukaz SymPy »korak« (PV-06)
//   odgovor   odgovor naloge (zaokrožen na decimalke odgovora) je končna vrednost katere od relacij v rešitvi;
//             če ga v rešitvi ni, trditev ostane brez statusa (rešitev lahko pove le pot, ne pa napake). To je
//             skladnost prikaza, ne preračun: v status generatorja ne šteje, poročilo ga navede posebej.
// Status generatorja je najšibkejši člen trditev »račun« in »korak« (statusOdgovora): ena napaka → napaka; vse
// izračunane → izracunano; vse vsaj numerične → numericno; nekaj preverjenih → delno; nič → nepreverjeno.
// Skripta ne kliče modela AI. Štetje vzorca (semena 1…N), interval je pri deležih generatorjev.
//
//   node scripts/status-generatorjev.mjs [--semena 3] [--predpona mat-] [--json p.json [--polno]] [--porocilo p.md]
//                                        [--dodatek pregled.md] [--brez-sympy]
//   --strogo   izhod 1, če SymPy ni tekel ali kakšna zahteva ni dobila odgovora
import { writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { GENERATORS, generateTask } from "../server/practice/index.js";
import { roundHalfUp } from "../server/practice/check.js";
import { trditveIzBesedila } from "./popis-pokritosti.mjs";
import { wilson } from "./meri-preverjanje.mjs";
import { statusOdgovora, STATUSI } from "../public/preverjanje/statusi.js";

const FORMULA = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
// Zapis TeX → zapis za worker. Le zapisi, ki jih znamo prevesti brez izgube (texToText npr. izpusti \pm in \le).
const TEX = [
  [/\\left|\\right|\\big|\\Big/g, ""],
  [/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, "(($1)/($2))"],
  [/\\sqrt\{([^{}]*)\}/g, "sqrt($1)"],
  [/\\sqrt\[3\]\{([^{}]*)\}/g, "cbrt($1)"],
  [/\\cdot|\\times/g, "*"],
  [/\\leq?(?![a-z])/g, "<="],
  [/\\geq?(?![a-z])/g, ">="],
  [/\\lt(?![a-z])/g, "<"],
  [/\\gt(?![a-z])/g, ">"],
  [/\\pi(?![a-z])/g, "pi"],
  [/\\(ln|sin|cos|tan|log)\s*\(/g, "$1("],
  [/\\,|\\;|\\!|\\ |~/g, " "],
  [/(\d)\{,\}(\d)/g, "$1.$2"],
  [/(\d)\s+(?=\d{3}(?!\d))/g, "$1"], // 8 896 405 (razmik med tisočicami)
  [/\^\{([^{}]*)\}/g, "^($1)"],
  [/\{([^{}]*)\}/g, "($1)"],
];

/** TeX formula → zapis za ukaz korak ali null, kadar zapisa ne znamo zanesljivo prevesti. */
export function vZapisZaKorak(tex) {
  let s = String(tex);
  for (let i = 0; i < 3; i++) for (const [re, z] of TEX) s = s.replace(re, z);
  s = s.trim().replace(/[.,;:]$/, "");
  // ostanki TeX (\pm, \text, \mathrm, \in …), indeksi, absolutne vrednosti, besede, funkcije f(5): ne prevajamo
  const brez = s.replace(/\b(?:sqrt|cbrt|ln|sin|cos|tan)\(/g, "(").replace(/\bpi\b/g, "");
  // \log brez osnove je v šoli desetiški, v workerju naravni; mešano število 2\frac{1}{2} in x^{2}3 sta dvoumna
  if (/[\\_|$%°€]|\b[a-zA-Z]{2,}\b|[a-zA-Z]\s*\(/.test(brez) || /\d\s*\(\(\d+\)\/\(\d+\)\)/.test(s) || /\)\s*\d/.test(s)) return null;
  if (!/^[0-9a-zA-Z+\-*/^().=<>, ]+$/.test(s)) return null;
  return s;
}

const REL_K = /<=|>=|=|<|>/g;
/** Neznanke zapisa: posamezne črke, ki niso konstante (e, imaginarna enota i) ali deli imen funkcij. */
export function neznanke(s) {
  const brez = s.replace(/\b(?:sqrt|cbrt|ln|sin|cos|tan|log|pi)\b/g, " ");
  return [...new Set(brez.match(/(?<![A-Za-z])[a-zA-Z](?![A-Za-z])/g) || [])].filter((c) => c !== "e" && c !== "i");
}

// Rešena oblika »x = 3« ali »x ≥ 4«: neznanka sama na eni strani, število na drugi.
const RESENA = /^\s*[a-zA-Z]\s*(?:<=|>=|=|<|>)\s*[-\d.()/*^ +sqrtpi]+$/;

/** Zaporedni enačbi (ali neenačbi) z isto edino neznanko v rešitvi, v sosednjih vrsticah ali isti vrstici.
 *  Le »čiste« vrstice: same formule, ločene z vejico ali »ali« (besedilo ob formuli, npr. »nima rešitve« ali
 *  »Rešitev:«, pomeni, da formula ni korak). Formule v vrstici, povezane z »ali«, so ena trditev (razbitje na
 *  primere). Rešena oblika (x = 3) ni začetek koraka: za njo pridejo drugi kandidati, preizkus ali pogoji; zaporedne
 *  rešene enačbe za enačbo so ena trditev »x = a ali x = b«. Celoštevilske neznanke (n, k) izpustimo. */
export function koraki(resitev) {
  const vrstice = String(resitev || "").split("\n");
  const f = [];
  vrstice.forEach((l, v) => {
    const fs = [...l.matchAll(FORMULA)].map((m) => m[1] ?? m[2]);
    if (!fs.length) return;
    const ostanek = l.replace(FORMULA, " ").replace(/\bali\b|[,;.]/g, " ").trim();
    if (ostanek) {
      f.push(null); // besedilo ob formuli: veriga se pretrga
      return;
    }
    const deli = fs.map((tex) => {
      const z = vZapisZaKorak(tex);
      const rel = z ? z.match(REL_K) || [] : [];
      return z && rel.length === 1 && !/^\s*[<>=]/.test(z) ? { zapis: z, vrsta: rel[0] === "=" ? "enacba" : "neenacba", x: neznanke(z), vrstica: v, tex } : null;
    });
    if (/\$\s*ali\s*\$/.test(l)) {
      // »$x + 4 \le -6$ ali $x + 4 \ge 6$«: ena trditev
      const ok = deli.every((d) => d && d.x.length === 1 && d.x[0] === deli[0].x[0]);
      f.push(ok ? { zapis: deli.map((d) => d.zapis).join(" ali "), vrsta: deli.every((d) => d.vrsta === "enacba") ? "enacba" : "neenacba", x: deli[0].x, vrstica: v, tex: fs.join(" ali "), ali: true } : null);
      return;
    }
    f.push(...deli);
  });
  const out = [];
  const isti = (a, b) => a && b && a.vrsta === b.vrsta && a.x.length === 1 && b.x.length === 1 && a.x[0] === b.x[0];
  const resena = (a) => !a.ali && RESENA.test(a.zapis);
  for (let i = 0; i + 1 < f.length; i++) {
    const a = f[i];
    const b = f[i + 1];
    if (!isti(a, b) || b.vrstica - a.vrstica > 1 || resena(a) || /^[nk]$/.test(a.x[0])) continue;
    let potem = b.zapis;
    let tex = b.tex;
    if (a.vrsta === "enacba" && resena(b)) {
      // x = 125, x = -5 v zaporednih formulah: ena trditev z »ali«
      for (let j = i + 2; j < f.length && isti(b, f[j]) && resena(f[j]) && f[j].vrstica - f[j - 1].vrstica <= 1; j++) {
        potem += ` ali ${f[j].zapis}`;
        tex += `, ${f[j].tex}`;
      }
    }
    out.push({ prej: a.zapis, potem, neznanka: a.x[0], tex: `${a.tex} → ${tex}`, vrstica: b.vrstica + 1 });
  }
  return out;
}

/** Zadnje število v rešitvi (desna stran zadnje relacije), brez enot; null, kadar ga ni ali ni jasno. */
export function zadnjeStevilo(resitev) {
  const fs = [...String(resitev || "").matchAll(FORMULA)].map((m) => m[1] ?? m[2]);
  for (let i = fs.length - 1; i >= 0; i--) {
    const deli = fs[i].split(/=|\\approx|\\doteq/);
    if (deli.length < 2) continue;
    const d = deli[deli.length - 1]
      .replace(/\\(?:mathrm|text)\{[^{}]*\}/g, "")
      .replace(/\\,|\\;|\\ |~|\s/g, "")
      .replace(/\{,\}/g, ".")
      .replace(/\\%|%/g, "");
    const m = d.match(/^(-?\d+(?:\.\d+)?)(?:\\cdot10\^\{?(-?\d+)\}?)?$/);
    if (!m) return null;
    return { vrednost: Number(m[1]) * 10 ** Number(m[2] || 0), decimalk: (m[1].split(".")[1] || "").length, tex: fs[i] };
  }
  return null;
}

/** Ali je odgovor naloge končna vrednost katere od relacij v rešitvi: { status, tex } | null (ni ga). */
export function statusOdgovoraNaloge(t) {
  const a = t.answer;
  if (!a || a.type !== "number" || !Number.isFinite(a.value)) return null;
  const fs = [...String(t.solution || "").matchAll(FORMULA)].map((m) => m[1] ?? m[2]);
  for (let i = fs.length - 1; i >= 0; i--) {
    const z = zadnjeStevilo(`$${fs[i]}$`);
    if (!z) continue;
    // pas so decimalke odgovora (z = 2 ne potrdi 2,28); brez njih decimalke vrednosti odgovora ali zapisa, kar je
    // strožje (p(3) = 0 ne potrdi odgovora 0,5)
    const d = a.decimals ?? Math.max(z.decimalk, (String(a.value).split(".")[1] || "").length);
    const tol = 0.5 * 10 ** -d + 1e-9 * Math.max(1, Math.abs(a.value));
    if (Math.abs(z.vrednost - roundHalfUp(a.value, d)) <= tol || Math.abs(z.vrednost - a.value) <= tol) return { status: "numericno", tex: z.tex };
  }
  return null;
}

// Korak z izgubljeno rešitvijo (a² = 289 → a = 17 pri dolžini, x > 0 pri koncentraciji) je pravilen, če rešitev
// izloči kontekst naloge, ki ga ukaz ne vidi: brez statusa, a naštet v poročilu. Napaka je le drugačna množica.
// Izgubljen interval (2x > 4 → x > 3) ali zoženo območje je napaka: tega kontekst navadno ne opraviči.
// Pri neenačbi je izgubljeno krajišče (2x ≥ 4 → x > 2) napaka: izjema velja le za korak med enačbama.
export const casStatus = (r, k = null) => {
  if (r.ok === true) return r.how === "symbolic" ? "izracunano" : "numericno";
  const enacbi = !k || ![k.prej, k.potem].some((z) => /<|>/.test(z));
  if (r.ok === false) return r.vrsta === "izguba" && enacbi && /^izgubljena rešitev /.test(r.why || "") ? "nepreverjeno" : "napaka";
  return "nepreverjeno";
};

// Identiteta (x + 6)² = x² + 12x + 36 ni enačba, ki jo rešujemo: identiteta ob enačbi ni korak (identitete preveri
// že »račun«, lesson-identity). Dve zaporedni »enačbi« brez rešitve (dve napačni identiteti) bi bili za ukaz korak
// enakovredni (∅ = ∅): tak par tudi ni korak, da napačni računi ne dobijo potrditve.
async function mnozica(cas, zapis, x) {
  if (/ ali /.test(zapis)) {
    // unija: prazna, če so prazni vsi deli; R, če je R kateri koli
    const m = await Promise.all(zapis.split(" ali ").map((z) => mnozica(cas, z.trim(), x)));
    return m.includes("R") ? "R" : m.every((y) => y === "prazna") ? "prazna" : null;
  }
  if (/<|>/.test(zapis)) {
    for (const [trditev, ime] of [["R", "R"], ["∅", "prazna"]]) {
      const r = await cas.casCheck("ineq", [zapis, x, trditev]);
      if (r.ok === true) return ime;
    }
    return null;
  }
  const [a, b] = zapis.split("=");
  for (const [trditev, ime] of [["all", "R"], ["none", "prazna"]]) {
    const r = await cas.casCheck("solve", [`${a} = ${b}`, x, trditev]);
    if (r.ok === true) return ime;
  }
  return null;
}
// Identiteta za enačbo (2x + 3 = 7 → 2x + 3 = 2x + 3) je napačen korak, ki ga ukaz ujame: tak par ostane.
// Prvotna enačba brez realne rešitve (x² + 6x + 34 = 0) za korak ne pove ničesar: iz prazne množice sledi vsaka
// enačba, zato bi ukaz korak potrdil karkoli (pregled PV-11 z vstavljenimi napakami). Tak korak je »prazen«
// (nepreverjen): na realnih številih ga ne moremo potrditi, v kompleksnih je lahko pravilen.
/** "ni" (ni korak), "prazen" (prvotna enačba nima realne rešitve, ostali ni) ali "korak". */
export async function vrstaKoraka(cas, k) {
  const a = await mnozica(cas, k.prej, k.neznanka);
  if (a === "R") return "ni";
  if (a !== "prazna") return "korak";
  const b = await mnozica(cas, k.potem, k.neznanka);
  // protislovje → identiteta (3x + 3 = 3x + 4 → 3x + 3 = 3x + 3) ukaz ujame kot napako: to ostane korak
  return b === "prazna" ? "ni" : b === "R" ? "korak" : "prazen";
}
export const niKorak = async (cas, k) => (await vrstaKoraka(cas, k)) === "ni";
export const PRAZEN = "prvotna enačba nima realne rešitve, zato iz nje sledi vsaka enačba: korak ni preverljiv";

/** Trditve ene naloge: [{ vir: racun|korak|odgovor, tex, status, why? }]. */
export async function trditveNaloge(t, { cas = null } = {}) {
  const out = trditveIzBesedila(t.solution).map((x) => ({ vir: "racun", tex: x.tex, status: x.status }));
  if (cas) {
    for (const k of koraki(t.solution)) {
      const v = await vrstaKoraka(cas, k);
      if (v === "ni") continue;
      if (v === "prazen") {
        out.push({ vir: "korak", tex: k.tex.slice(0, 160), status: "nepreverjeno", why: PRAZEN, vrsta: "prazen" });
        continue;
      }
      const r = await cas.casCheck("korak", [k.prej, k.potem, k.neznanka, ""]);
      out.push({ vir: "korak", tex: k.tex.slice(0, 160), status: casStatus(r, k), why: r.why || "", vrsta: r.vrsta || null });
    }
  }
  const o = statusOdgovoraNaloge(t);
  if (t.answer?.type === "number") out.push({ vir: "odgovor", tex: o ? `${o.tex.slice(0, 100)} ↔ ${t.answer.value}` : `${t.answer.value}`, status: o ? o.status : "nepreverjeno" });
  return out;
}

/** Naloge generatorja: ravni 1–3 × semena 1…n (za generatorje z maxYear najvišji razred). */
export function nalogeGeneratorja(g, semena) {
  const out = [];
  const leto = g.maxYear ?? undefined;
  for (const tema of g.topics.slice(0, 1))
    for (const raven of [1, 2, 3])
      for (let seme = 1; seme <= semena; seme++) {
        let t;
        try {
          t = generateTask(tema, raven, seme, undefined, leto);
        } catch {
          continue;
        }
        if (t && t.generator === g.id) out.push(t);
      }
  return out;
}

export async function popisGeneratorjev({ semena = 3, predpona = "", cas = null } = {}) {
  const gen = [];
  for (const g of GENERATORS) {
    if (!g.id.startsWith(predpona)) continue;
    const trditve = [];
    const naloge = nalogeGeneratorja(g, semena);
    for (const t of naloge)
      for (const x of await trditveNaloge(t, { cas })) trditve.push({ ...x, raven: t.level, seme: t.seed });
    // »odgovor« je skladnost prikaza, ne preračun: ne šteje v status generatorja, poročamo ga posebej
    const preverjene = trditve.filter((x) => x.vir !== "odgovor").map((x) => x.status);
    gen.push({ id: g.id, nalog: naloge.length, trditev: trditve.length, status: statusOdgovora(preverjene), trditve });
  }
  return gen;
}

const tocke = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const odst = (x) => `${(100 * x).toFixed(1).replace(".", ",")} %`;
const ki = (k, n) => {
  const w = wilson(k, n);
  return `${tocke(k)}/${tocke(n)} (${n ? odst(k / n) : "–"}; 95-% interval ${w ? `${odst(w[0])}–${odst(w[1])}` : "–"})`;
};

export function povzemi(gen) {
  const poStatusu = Object.fromEntries(STATUSI.map((s) => [s, gen.filter((g) => g.status === s).length]));
  const trd = gen.flatMap((g) => g.trditve);
  const poViru = {};
  for (const v of ["racun", "korak", "odgovor"]) {
    const t = trd.filter((x) => x.vir === v);
    poViru[v] = Object.fromEntries([["vse", t.length], ...STATUSI.map((s) => [s, t.filter((x) => x.status === s).length])]);
  }
  // generatorji, pri katerih vsaka naloga v rešitvi pokaže svoj odgovor (vsaj ena številska naloga)
  const odgovorSkladen = gen.filter((g) => {
    const o = g.trditve.filter((x) => x.vir === "odgovor");
    return o.length && o.every((x) => x.status === "numericno");
  }).length;
  return { generatorjev: gen.length, poStatusu, poViru, odgovorSkladen };
}

export function porocilo(gen, { datum, commit, semena, ukaz = "", dodatek = "" }) {
  const p = povzemi(gen);
  const n = p.generatorjev;
  const v = [];
  v.push(`# Status generatorjev nalog (PV-10), ${datum}`, "");
  v.push(`- Commit: \`${commit}\`; ukaz: \`${ukaz}\`; brez modela AI; SymPy prek server/cas.js (ukaz korak, PV-06)`);
  v.push(`- Vzorec: vsak generator, ravni 1–3, semena 1–${semena} (prva tema generatorja). Imenovalec deležev so generatorji (${n}).`);
  v.push("- Status generatorja je najšibkejši člen trditev »račun« in »korak« v vzorcu (statusOdgovora); »odgovor« v status");
  v.push(`  ne šteje (skladnost prikaza). Rešitev pokaže odgovor pri vseh številskih nalogah: ${ki(p.odgovorSkladen, n)} generatorjev.`);
  v.push("- Generator s statusom nižjim od");
  v.push("  »napaka« ni napačen; trditev brez statusa ni napačna, le noben program je ne preveri.", "");
  v.push("## Generatorji po statusu", "");
  v.push("| Status | Generatorjev |", "| --- | --- |");
  for (const s of STATUSI) if (s !== "v_teku") v.push(`| ${s} | ${ki(p.poStatusu[s], n)} |`);
  v.push("", "## Trditve po viru", "");
  v.push("| Vir | Trditev | izracunano | numericno | delno | napaka | nepreverjeno |", "| --- | --- | --- | --- | --- | --- | --- |");
  for (const [k, s] of Object.entries(p.poViru)) v.push(`| ${k} | ${tocke(s.vse)} | ${tocke(s.izracunano)} | ${tocke(s.numericno)} | ${tocke(s.delno)} | ${tocke(s.napaka)} | ${tocke(s.nepreverjeno)} |`);
  v.push("", "## Zaznane napake", "");
  const nap = gen.flatMap((g) => g.trditve.filter((x) => x.status === "napaka").map((x) => ({ g: g.id, ...x })));
  if (!nap.length) v.push("Nobene.");
  for (const x of nap) v.push(`- \`${x.g}\` (raven ${x.raven}, seme ${x.seme}, ${x.vir}): \`${x.tex.replace(/`/g, "'")}\`${x.why ? ` (${x.why})` : ""}`);
  v.push("", "## Koraki z izgubljeno rešitvijo", "");
  v.push("Izgubljene posamezne rešitve (a² = 289 → a = 17): pravilno le, če jih izloči kontekst naloge (dolžina,");
  v.push("koncentracija, celo število). Brez statusa. Izgubljen interval ali zoženo območje je napaka (zgoraj).", "");
  const izg = gen.flatMap((g) => g.trditve.filter((x) => x.vrsta === "izguba" && x.status !== "napaka").map((x) => ({ g: g.id, ...x })));
  if (!izg.length) v.push("Nobenega.");
  for (const x of izg) v.push(`- \`${x.g}\` (raven ${x.raven}, seme ${x.seme}): \`${x.tex.replace(/`/g, "'")}\` (${x.why})`);
  if (dodatek) v.push("", dodatek.trim());
  v.push("", "## Omejitve", "");
  v.push("- Vzorec semen, ne vse naloge: generator brez napake v vzorcu lahko pri drugem semenu da napako.");
  v.push("- »korak« preveri le zaporedni (ne)enačbi z isto eno neznanko v sosednjih vrsticah, ki ju zna prevesti iz TeX;");
  v.push("  besedni koraki, sistemi in koraki s parametri ostanejo brez statusa. Identiteta ob enačbi (razširjen kvadrat)");
  v.push("  ni korak. Korak »posledica« (kvadriranje, tuja rešitev) je izračunan kot račun; ali rešitev potem izloči tujo");
  v.push("  rešitev, preveri le končni »x = …« v isti verigi.");
  v.push("- »odgovor« pove le, ali rešitev pripelje do odgovora naloge (končna vrednost katere od relacij); to je skladnost");
  v.push("  prikaza, ne neodvisen preračun, in brez ujemanja ni napaka (rešitev lahko odgovor pove z besedo).");
  v.push("");
  return v.join("\n");
}

async function main(argv) {
  const opt = (ime, privzeto = null) => {
    const i = argv.indexOf(ime);
    return i >= 0 ? argv[i + 1] : privzeto;
  };
  const semena = Number(opt("--semena", 3));
  let cas = null;
  if (!argv.includes("--brez-sympy")) {
    cas = await import("../server/cas.js");
    if (!(await cas.casAvailable())) {
      console.error("SymPy ni na voljo: koraki ostanejo brez statusa");
      cas = null;
    }
  }
  const gen = await popisGeneratorjev({ semena, predpona: opt("--predpona", ""), cas });
  const p = povzemi(gen);
  console.log(`Generatorjev ${p.generatorjev}:`, JSON.stringify(p.poStatusu));
  console.log("Trditve po viru:", JSON.stringify(p.poViru));
  const j = opt("--json");
  // JSON: status in števci na generator, trditve le z napako ali izgubljeno rešitvijo (--polno: vse trditve)
  const zapis = argv.includes("--polno")
    ? gen
    : gen.map((g) => ({
        id: g.id,
        nalog: g.nalog,
        trditev: g.trditve.length,
        status: g.status,
        poStatusu: Object.fromEntries(STATUSI.map((s) => [s, g.trditve.filter((x) => x.status === s).length]).filter(([, k]) => k)),
        izpostavljene: g.trditve.filter((x) => x.status === "napaka" || x.vrsta === "izguba"),
      }));
  if (j) writeFileSync(j, JSON.stringify({ povzetek: p, generatorji: zapis }) + "\n");
  const r = opt("--porocilo");
  if (r) {
    let commit = "";
    try {
      commit = execSync("git rev-parse HEAD").toString().trim();
    } catch {}
    const dodatek = opt("--dodatek") ? (await import("node:fs")).readFileSync(opt("--dodatek"), "utf8") : "";
    writeFileSync(r, porocilo(gen, { datum: new Date().toISOString().slice(0, 10), commit, semena, ukaz: `node scripts/status-generatorjev.mjs ${argv.join(" ")}`, dodatek }));
  }
  let koda = 0;
  if (argv.includes("--strogo")) {
    const iz = cas ? cas.casIzpadi() : { skupaj: 1 };
    if (!cas || iz.skupaj) {
      console.error("SymPy ni tekel ali ni odgovoril na vse zahteve:", JSON.stringify(iz));
      koda = 1;
    }
  }
  if (cas) cas.casStop();
  return koda;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) process.exit(await main(process.argv.slice(2)));
