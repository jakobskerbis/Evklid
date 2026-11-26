#!/usr/bin/env node
// Popis pokritosti trditev po delih aplikacije (PV-04, docs/preverjanje.md »Popis pokritosti«). Za vsebino, ki je
// vnaprej znana (lekcije, rešeni primeri, pole, generatorji, tekmovalne naloge, fakultetne lekcije), zašteje
// matematične trditve in za vsako ugotovi status, ki ga ji dajo obstoječi preverjevalniki; za mesta, kjer trditve
// nastanejo šele ob uporabi (inštruktor, skener, kalkulator …), pove, ali imajo status po trditvi.
//
//   node scripts/popis-pokritosti.mjs                         preglednica na zaslon
//   node scripts/popis-pokritosti.mjs --json p.json --porocilo p.md
//   node scripts/popis-pokritosti.mjs --brez-sympy            bloki RACUN ostanejo neizmerjeni (hitro, brez Pythona)
//
// Trditev v besedilu = formula $…$ ali $$…$$ z relacijo (=, ≈, <, >, ≤, ≥, ≠, ∈, ⇒ …). Status trditve:
//   numericno     server/lesson-math.js (checkArithmetic) je preračunal vse relacije formule s plavajočo vejico
//   delno         preračunal je le del relacij (ostale so simbolne)
//   napaka        preračun se ne izide
//   nepreverjeno  noben preverjevalnik je ne pogleda (simbolni koraki, besedne trditve, vrstice z »približno« …)
// Trditev iz bloka RACUN (lekcije, strojni zapis): izracunano (SymPy simbolno ali točna kemija), numericno
// (SymPy številsko), napaka, nepreverjeno. Namerno napačne trditve (»Pogoste napake«, napačne možnosti v »Preveri
// se«, polje »mistake« in izbire na polah) niso trditve vsebine in so šteti posebej.
// Popis je štetje celote (pri generatorjih: vsak generator, ravni 1–3, seme 1), ne vzorec: brez intervala.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { checkArithmetic } from "../server/lesson-math.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LEKCIJE = join(ROOT, "content/lessons");
const POLE = join(ROOT, "content/exam-papers");

export const STATUSI = ["dokazano", "izracunano", "numericno", "delno", "v_teku", "napaka", "nepreverjeno"];
const REL = /=|\\approx|\\doteq|\\neq?\b|\\l(?:e|eq|t)\b|\\g(?:e|eq|t)\b|\\leqslant|\\geqslant|[<>≤≥≠≈∈⇒⇔]|\\in\b|\\notin\b|\\subset(?:eq)?\b|\\equiv\b|\\Rightarrow|\\Leftrightarrow|\\iff\b|\\implies\b/;
const SEP = /(=|\\approx|\\doteq)/;
const FORMULA = /\$\$([\s\S]+?)\$\$|(^|[^\\$])\$([^$\n]+?)\$/g;

/** Število relacij v formuli, ki jih lesson-math sploh lahko preračuna (=, ≈, ≐). */
const verige = (tex) => (tex.match(new RegExp(SEP.source, "g")) || []).length;

/**
 * Status ene formule v njeni vrstici (besede v vrstici, npr. »približno«, »napačno«, vplivajo na lesson-math).
 * prejsnja = zadnji del prejšnje formule, ko se veriga nadaljuje v novi vrstici (»$= \frac{5}{10}$«).
 */
export function statusFormule(tex, vrstica = "", prejsnja = null) {
  let t = tex.trim();
  if (prejsnja && /^(=|\\approx|\\doteq)/.test(t)) t = `${prejsnja} ${t}`;
  const n = verige(t);
  if (!n) return "nepreverjeno"; // neenačbe, pripadnost, implikacije: lesson-math jih ne preverja
  // formula ostane v svoji vrstici (besede »približno«, »napačno« veljajo zanjo), druge formule odstranimo
  const besede = vrstica.replace(FORMULA, (x, _a, pred = "") => `${pred} … `);
  const r = checkArithmetic(`${besede} $${t}$`);
  if (r.mismatches.length) return "napaka";
  if (!r.checked) return "nepreverjeno";
  return r.checked >= n ? "numericno" : "delno";
}

/** Vse trditve v besedilu (markdown s TeX): [{ tex, vrstica, status }]. */
export function trditveIzBesedila(md) {
  const out = [];
  let prejsnja = null;
  let prejVrstica = -2;
  let prejKonec = false;
  const vrstice = String(md || "").split("\n");
  const zacetki = [];
  let acc = 0;
  for (const l of vrstice) (zacetki.push(acc), (acc += l.length + 1));
  const vrsticaOd = (i) => {
    let k = 0;
    while (k + 1 < zacetki.length && zacetki[k + 1] <= i) k++;
    return k;
  };
  for (const m of String(md || "").matchAll(FORMULA)) {
    const tex = m[1] ?? m[3];
    const v = vrsticaOd(m.index + (m[2] ? m[2].length : 0));
    // nadaljevanje verige: formula začne vrstico, prejšnja formula je končala prejšnjo vrstico (»$= \frac{5}{10}$«)
    const naZacetku = /^\s*(?:[-*+>]\s*|\d+\.\s*)?\$/.test(vrstice[v] || "");
    const nadaljuje = naZacetku && v - prejVrstica === 1 && prejKonec ? prejsnja : null;
    if (REL.test(tex)) out.push({ tex: tex.trim().slice(0, 120), vrstica: v + 1, status: statusFormule(tex, vrstice[v] || "", nadaljuje) });
    const deli = tex.split(SEP);
    prejsnja = deli[deli.length - 1].trim() || null;
    const konec = m.index + m[0].length;
    prejVrstica = vrsticaOd(konec - 1);
    prejKonec = konec >= zacetki[prejVrstica] + String(vrstice[prejVrstica]).trimEnd().replace(/[.,;]$/, "").length;
  }
  return out;
}

// ---------- lekcije ----------

/** Razdeli lekcijo na dele: { razlaga, primeri, namerne } (besedilo), brez glave, blokov RACUN in :::simboli. */
export function deliLekcije(src) {
  let body = String(src).replace(/^﻿/, "").replace(/\r\n/g, "\n");
  body = body.replace(/^---\n[\s\S]*?\n---\n?/, "");
  body = body.replace(/<<\s*RA[CČ]UN\b[\s\S]*?>>/g, "").replace(/^:::simboli\s*\n[\s\S]*?^:::\s*$/gm, "");
  const out = { razlaga: [], primeri: [], namerne: [] };
  let kam = "razlaga";
  let preveri = false;
  for (const l of body.split("\n")) {
    const h = l.match(/^## +(.*)/);
    if (h) {
      const t = h[1].trim();
      preveri = /^preveri/i.test(t);
      kam = /^pogoste/i.test(t) ? "namerne" : /^rešen/i.test(t) ? "primeri" : "razlaga";
      out[kam].push("");
      continue;
    }
    // »Preveri se«: pravilni odgovor (+) in razlaga (>) sta trditvi; vprašanje in napačne možnosti (-) nista
    if (preveri) {
      if (/^[+>] /.test(l)) out.razlaga.push(l);
      else if (/^- /.test(l)) out.namerne.push(l);
      else out.razlaga.push("");
      continue;
    }
    out[kam].push(l);
  }
  return { razlaga: out.razlaga.join("\n"), primeri: out.primeri.join("\n"), namerne: out.namerne.join("\n") };
}

/** Trditve iz blokov RACUN: [{ line, op, args }] (isti zapis kot server/racun.js parseClaims). */
export async function racunTrditve(src) {
  const { parseClaims } = await import("../server/racun.js");
  return parseClaims(src, Infinity);
}

/** Status trditve RACUN: kemija in molska masa točno v JS, ostalo SymPy z načinom (PV-03). */
export async function statusRacuna(c, { casCheck, chemBalanced, molarOk }) {
  let r;
  try {
    if (c.op === "chem") r = { ...chemBalanced(c.args[0]), how: "symbolic" };
    else if (c.op === "molar") r = { ...molarOk(c.args[0], c.args[1]), how: "symbolic" };
    else r = await casCheck(c.op, c.args);
  } catch (e) {
    return "nepreverjeno";
  }
  if (r.ok === true) return r.how === "symbolic" ? "izracunano" : "numericno";
  return r.ok === false ? "napaka" : "nepreverjeno";
}

const prazno = () => ({ ...Object.fromEntries(STATUSI.map((s) => [s, 0])), vse: 0, namerne: 0, enot: 0, primeri: [] });
function dodaj(st, trditve, kje) {
  for (const t of trditve) {
    st[t.status]++;
    st.vse++;
    if (t.status === "napaka" && st.primeri.length < 20) st.primeri.push(`${kje}: $${t.tex}$`);
  }
}

function lekcije() {
  const out = [];
  for (const dir of readdirSync(LEKCIJE).sort()) {
    const d = join(LEKCIJE, dir);
    if (!statSync(d).isDirectory()) continue;
    for (const f of readdirSync(d).sort()) if (f.endsWith(".md")) out.push({ id: `${dir}/${f.slice(0, -3)}`, uni: dir.startsWith("UNI-"), src: readFileSync(join(d, f), "utf8") });
  }
  return out;
}

/** Popis vseh statičnih mest. cas = { casCheck, chemBalanced, molarOk } ali null (RACUN neizmerjen). */
export async function popisi({ cas = null } = {}) {
  const m = { lekcije: prazno(), primeri: prazno(), racun: prazno(), fakulteta: prazno(), pole: prazno(), generatorji: prazno(), tekmovanja: prazno() };
  for (const l of lekcije()) {
    const d = deliLekcije(l.src);
    const tR = trditveIzBesedila(d.razlaga);
    const tP = trditveIzBesedila(d.primeri);
    const nam = trditveIzBesedila(d.namerne).length;
    if (l.uni) {
      dodaj(m.fakulteta, [...tR, ...tP], l.id);
      m.fakulteta.namerne += nam;
      m.fakulteta.enot++;
    } else {
      dodaj(m.lekcije, tR, l.id);
      dodaj(m.primeri, tP, l.id);
      m.lekcije.namerne += nam;
      m.lekcije.enot++;
      if (tP.length) m.primeri.enot++;
    }
    const rc = await racunTrditve(l.src);
    if (rc.length) m.racun.enot++;
    for (const c of rc) {
      const status = cas ? await statusRacuna(c, cas) : "nepreverjeno";
      dodaj(m.racun, [{ tex: c.line, status }], l.id);
    }
  }
  if (!cas) m.racun.neizmerjeno = true;
  // pole: rešitve (answer, ways); besedilo naloge so podatki, »mistake« in izbire so namerno napačni
  for (const f of readdirSync(POLE).sort()) {
    if (!f.endsWith(".json")) continue;
    const p = JSON.parse(readFileSync(join(POLE, f), "utf8"));
    m.pole.enot++;
    for (const task of p.tasks || []) {
      for (const part of task.parts || []) {
        const kje = `${p.id} ${task.n ?? ""}${part.id || ""}`;
        dodaj(m.pole, trditveIzBesedila(part.answer), kje);
        for (const w of part.ways || []) dodaj(m.pole, trditveIzBesedila(w.text), kje);
        m.pole.namerne += trditveIzBesedila([part.mistake, ...(part.choices || [])].join("\n")).length;
      }
    }
  }
  // generatorji: rešitev naloge (besedilo naloge so podatki); seme 1 na ravneh 1–3
  const { GENERATORS, plainCommas } = await import("../server/practice/index.js");
  const { makeRng } = await import("../server/practice/rng.js");
  for (const g of GENERATORS) {
    const st = g.id.startsWith("tek-") ? m.tekmovanja : m.generatorji;
    st.enot++;
    for (const level of [1, 2, 3]) {
      let t;
      try {
        t = g.gen(level, makeRng(1), g.topics[0], "sl");
      } catch {
        t = null;
      }
      if (!t?.text) continue;
      t = plainCommas(t);
      const res = Array.isArray(t.solution) ? t.solution.join("\n") : String(t.solution || "");
      dodaj(st, trditveIzBesedila(res), `${g.id} r${level}`);
    }
  }
  return m;
}

// ---------- 19 mest (načrt PV, točka 2) ----------

// staticno: ključ popisa ali null (trditve nastanejo ob uporabi). poTrditvi: ali ima mesto danes status po trditvi.
export const MESTA = [
  { st: 1, mesto: "AI-inštruktor, odgovori", enota: "trditev v odgovoru", staticno: null, poTrditvi: "le trditve iz bloka RACUN (SymPy), brez statusa za učenca", lastnik: "B" },
  { st: 2, mesto: "Sodba učenčevega koraka", enota: "korak učenca", staticno: null, poTrditvi: "da/ne, brez sedmih statusov", lastnik: "B" },
  { st: 3, mesto: "Shranjeni odgovori in kartice", enota: "kartica", staticno: null, poTrditvi: "da/ne", lastnik: "B" },
  { st: 4, mesto: "Znanstveni kalkulator", enota: "rezultat", staticno: null, poTrditvi: "ne", lastnik: "B" },
  { st: 5, mesto: "Grafični kalkulator, CAS", enota: "rezultat", staticno: null, poTrditvi: "ne (statusi niso prikazani)", lastnik: "B" },
  { st: 6, mesto: "Učbenik: razlaga in »Preveri se«", enota: "formula z relacijo", staticno: "lekcije", lastnik: "A" },
  { st: 6, mesto: "Učbenik: bloki RACUN (strojni zapis)", enota: "vrstica RACUN", staticno: "racun", lastnik: "A" },
  { st: 7, mesto: "Rešeni primeri v lekcijah", enota: "formula z relacijo", staticno: "primeri", lastnik: "A" },
  { st: 8, mesto: "Vadnica: generatorji (rešitve)", enota: "formula z relacijo v rešitvi", staticno: "generatorji", lastnik: "A" },
  { st: 9, mesto: "Matura in NPZ: naše pole (rešitve)", enota: "formula z relacijo v rešitvi", staticno: "pole", lastnik: "A" },
  { st: 10, mesto: "Tekmovalne naloge (generatorji tek-*)", enota: "formula z relacijo v rešitvi", staticno: "tekmovanja", lastnik: "A" },
  { st: 11, mesto: "Priprava na test", enota: "naloga iz zapiskov", staticno: null, poTrditvi: "ne", lastnik: "A" },
  { st: 12, mesto: "Uvoženi zapiski in kartice", enota: "trditev zapiska", staticno: null, poTrditvi: "zapiski: trditve RACUN; vaja iz lista: ne", lastnik: "A" },
  { st: 13, mesto: "Skener", enota: "rešitev naloge", staticno: null, poTrditvi: "da: pet statusov (meritev PV-05 na naboru N-01)", lastnik: "A" },
  { st: 14, mesto: "Virtualni laboratorij", enota: "učenčev račun", staticno: null, poTrditvi: "ne (formule pokrivajo enotni testi)", lastnik: "A" },
  { st: 15, mesto: "Interaktivne simulacije", enota: "formula na zaslonu", staticno: null, poTrditvi: "ne (sim.test.js, ni popisa formul)", lastnik: "A" },
  { st: 16, mesto: "Formule v 3D svetu", enota: "formula", staticno: null, poTrditvi: "ne (ni popisa)", lastnik: "A" },
  { st: 17, mesto: "Fizikalni in kemijski izračuni", enota: "rezultat z enoto", staticno: null, poTrditvi: "enote in kemija v RACUN, sicer ne", lastnik: "skupno" },
  { st: 18, mesto: "Fakultetna matematika (lekcije UNI-*)", enota: "formula z relacijo", staticno: "fakulteta", lastnik: "A" },
  { st: 19, mesto: "Ustno spraševanje, kvizi, dnevna uganka", enota: "odgovor", staticno: null, poTrditvi: "pravila po vrsti vprašanja, ne status", lastnik: "A" },
];

const ENOTE = { lekcije: "lekcij", primeri: "lekcij s primeri", racun: "lekcij z RACUN", fakulteta: "lekcij", pole: "pol", generatorji: "generatorjev", tekmovanja: "generatorjev" };
const odst = (k, n) => (n ? `${((100 * k) / n).toFixed(1).replace(".", ",")} %` : "–");
export const sStatusom = (s) => s.vse - s.nepreverjeno;

/** Poročilo po predlogi docs/meritve/README.md. */
export function porocilo(m, { datum, commit, ukaz = "", okolje = "" }) {
  const st = MESTA.filter((x) => x.staticno).map((x) => m[x.staticno]).filter((s) => !s.neizmerjeno);
  const vse = st.reduce((a, s) => a + s.vse, 0);
  const s = st.reduce((a, x) => a + sStatusom(x), 0);
  const v = [`# Pokritost matematičnih trditev po delih aplikacije (${datum})`, "", "## Povzetek"];
  v.push(`- Glavna številka: ${s} od ${vse} trditev v vnaprej znani vsebini ima status, ki ga je dal program (${odst(s, vse)}; cilj 100 %, višje je bolje). Štetje celote, ne vzorec, zato brez intervala.`);
  v.push("- Pomeni: koliko formul z relacijo v lekcijah, rešenih primerih, polah in rešitvah generatorjev je preračunal ali preveril program; ostale so »Nepreverjeno« (simbolni koraki, besedne trditve).");
  v.push("- Ne pomeni: da so nepreverjene trditve napačne, niti da je »numerično« dokaz. Vsebina z oznako »preverjeno« ima lahko večino trditev brez statusa po trditvi; oznaka lekcije pove, da je račune pregledal program in model, ne da ima vsaka trditev status.");
  v.push("", "## Nabor");
  v.push("- Vir: vsa vsebina v repozitoriju na spodnjem commitu (content/lessons, content/exam-papers, server/practice/generators); generatorji: seme 1 na ravneh 1–3. Fakultetne zbirke v server/university-*.js niso zajete.");
  v.push("- Pričakovani izid: ni ga (popis ne meri pravilnosti, le ali ima trditev status). Uradnih virov: ne velja.");
  v.push("", "## Metoda");
  v.push(`- Ukaz: \`${ukaz || "node scripts/popis-pokritosti.mjs"}\``);
  v.push(`- Commit: \`${commit}\`; brez modela AI${okolje ? `; ${okolje}` : ""}`);
  v.push("- Trditev = formula $…$ ali $$…$$ z relacijo (=, ≈, <, >, ≤, ≥, ≠, ∈, ⇒ …); vrstica RACUN = ena trditev. Status: preračun server/lesson-math.js (numerično, delno, napaka) in za RACUN SymPy z načinom ali točna kemija (izračunano, numerično, napaka). Namerno napačne trditve (»Pogoste napake«, napačne možnosti, »mistake«) so izločene in naštete posebej.");
  v.push("", "## Izidi", "", "| # | Mesto | Enota trditve | Trditev | S statusom | Izračunano | Numerično | Delno | Napaka | Nepreverjeno | Izločene (namerno napačne) | Obseg |", "|---|---|---|---|---|---|---|---|---|---|---|---|");
  for (const x of MESTA) {
    if (!x.staticno) {
      v.push(`| ${x.st} | ${x.mesto} | ${x.enota} | ob uporabi | status po trditvi: ${x.poTrditvi} | – | – | – | – | – | – | lastnik ${x.lastnik} |`);
      continue;
    }
    const a = m[x.staticno];
    if (a.neizmerjeno) {
      v.push(`| ${x.st} | ${x.mesto} | ${x.enota} | ${a.vse} | ni izmerjeno (brez SymPy) | – | – | – | – | – | – | ${a.enot} ${ENOTE[x.staticno]} |`);
      continue;
    }
    v.push(`| ${x.st} | ${x.mesto} | ${x.enota} | ${a.vse} | ${sStatusom(a)} (${odst(sStatusom(a), a.vse)}) | ${a.izracunano} | ${a.numericno} | ${a.delno} | ${a.napaka} | ${a.nepreverjeno} | ${a.namerne} | ${a.enot} ${ENOTE[x.staticno]} |`);
  }
  v.push("", "## Napake in neuspehi");
  let nic = true;
  for (const x of MESTA.filter((y) => y.staticno)) {
    const a = m[x.staticno];
    if (a.napaka) {
      nic = false;
      v.push(`- ${x.mesto}: ${a.napaka} trditev, kjer preračun ne izide${a.primeri.length ? ` (prvih ${a.primeri.length}: ${a.primeri.join("; ")})` : ""}`);
    }
  }
  if (nic) v.push("- Nobena trditev s statusom »Zaznana napaka«.");
  v.push("", "## Omejitve");
  v.push("- Trditev je formula z relacijo: besedne trditve (»funkcija je naraščajoča«) in formule brez relacije niso šteti, zato je pravo število trditev večje.");
  v.push("- Ena formula z več relacijami je ena trditev; »delno« pomeni, da je program preračunal le del verige.");
  v.push("- »Numerično« iz lesson-math je preračun s plavajočo vejico z dopustom, ne dokaz; »napaka« je lahko tudi pretvorba ali zaokrožitev, ki je lesson-math ne prepozna (CI lekcij in pol take vrstice že pregleda).");
  v.push("- Mesta, kjer trditve nastanejo ob uporabi (inštruktor, kalkulatorji, skener …), nimajo štetja; skener meri PV-05 na naboru N-01.");
  v.push("", "## Stroški", "Klicev API: 0, cena: 0 $.", "");
  return v.join("\n");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  const arg = (ime) => (a.indexOf(ime) >= 0 ? a[a.indexOf(ime) + 1] : undefined);
  let cas = null;
  let casStop = () => {};
  if (!a.includes("--brez-sympy")) {
    const c = await import("../server/cas.js");
    const r = await import("../server/racun.js");
    casStop = c.casStop;
    if (await c.casAvailable()) cas = { casCheck: c.casCheck, chemBalanced: r.chemBalanced, molarOk: r.molarOk };
    else console.log("OPOMBA: SymPy ni na voljo, bloki RACUN ostanejo neizmerjeni");
  }
  const m = await popisi({ cas });
  for (const x of MESTA.filter((y) => y.staticno)) {
    const s = m[x.staticno];
    console.log(`${x.st}\t${x.mesto}\t${s.vse} trditev\t${s.neizmerjeno ? "neizmerjeno" : `${sStatusom(s)} s statusom`}\t${STATUSI.map((k) => `${k} ${s[k]}`).join(", ")}\tizločenih ${s.namerne}`);
  }
  const { execFileSync } = await import("node:child_process");
  let commit = process.env.GITHUB_SHA || "";
  try {
    commit ||= execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    commit ||= "neznan";
  }
  const meta = { datum: new Date().toISOString().slice(0, 10), commit, ukaz: ["node scripts/popis-pokritosti.mjs", ...a].join(" "), okolje: `Node ${process.version}` };
  if (arg("--json")) writeFileSync(arg("--json"), JSON.stringify({ ...meta, mesta: m }, null, 1) + "\n");
  if (arg("--porocilo")) writeFileSync(arg("--porocilo"), porocilo(m, meta));
  casStop();
}
