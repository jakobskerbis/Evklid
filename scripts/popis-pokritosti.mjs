#!/usr/bin/env node
// Popis pokritosti trditev po delih aplikacije (PV-04, docs/preverjanje.md »Popis pokritosti«). Za vsebino, ki je
// vnaprej znana (lekcije, rešeni primeri, pole, generatorji, tekmovalne naloge, fakultetne lekcije), zašteje
// matematične trditve in za vsako ugotovi status, ki ji ga dajo obstoječi preverjevalniki, uporabljeni na vsaki
// formuli posebej; za mesta, kjer trditve nastanejo šele ob uporabi (inštruktor, skener, kalkulator …), pove, ali
// imajo status po trditvi.
//
//   node scripts/popis-pokritosti.mjs                         preglednica na zaslon
//   node scripts/popis-pokritosti.mjs --json p.json --porocilo p.md
//   node scripts/popis-pokritosti.mjs --brez-sympy            bloki RACUN ostanejo neizmerjeni (hitro, brez Pythona)
//
// Trditev v besedilu = formula $…$ ali $$…$$ z relacijo (=, ≈, <, >, ≤, ≥, ≠, ∈, ⇒ …). Status trditve:
//   numericno     server/lesson-math.js (checkArithmetic) je preračunal vse relacije formule s plavajočo vejico, ali pa
//                 simbolno enakost potrdi preizkus z naključnimi števili (server/lesson-identity.js)
//   delno         preračunal je le del relacij (ostale so simbolne)
//   napaka        preračun se ne izide
//   nepreverjeno  noben preverjevalnik je ne potrdi (simbolni koraki, besedne trditve, vrstice z »približno« …)
// Trditev iz bloka RACUN (strojni zapis, ponovi rezultate lekcije, zato ločeno od glavne številke): izracunano (SymPy
// simbolno ali uravnotežena enačba), numericno (SymPy številsko, molska masa z dopustom), napaka, nepreverjeno.
// Namerno napačne trditve (»Pogoste napake«, napačne možnosti in pojasnila ~ v »Preveri se«, »mistake« in napačne
// izbire na polah) in vprašanja (?) niso trditve vsebine in so šteti posebej.
// Popis je štetje celote (pri generatorjih: vsak generator, ravni 1–3, seme 1), ne vzorec: brez intervala.
//   --strogo      izhod 1, če SymPy ni tekel ali kakšna zahteva ni dobila odgovora (RACUN bi tiho padel na »nepreverjeno«)
//   --dodatek f   besedilo iz datoteke f (npr. pregled zaznanih napak) pod »Napake in neuspehi«
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { checkArithmetic } from "../server/lesson-math.js";
import { checkIdentities } from "../server/lesson-identity.js";

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
  if (r.checked) return r.checked >= n ? "numericno" : "delno";
  // simbolna enakost: server/lesson-identity.js vstavi naključna števila (CI lekcij). Brez okolice lekcije (definicije,
  // »enačba«) neujemanje ni dokaz napake (enačba ni identiteta), zato šteje le potrditev.
  const id = checkIdentities(`${besede} $${t}$`);
  return id.checked && !id.mismatches.length ? "numericno" : "nepreverjeno";
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
  const out = { razlaga: [], preveri: [], primeri: [], namerne: [], vprasanja: [] };
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
    // »Preveri se«: pravilni odgovor (+), pojasnilo (>), razvrščanje in nadaljevanja so vsebina; napačne možnosti (-)
    // in njihova pojasnila (~, pogosto ponovijo napačen račun) so namerno napačne; vprašanje (?) je podatek naloge.
    if (preveri) {
      const kamP = /^[-~] /.test(l) ? "namerne" : /^\? /.test(l) ? "vprasanja" : "preveri";
      for (const k of ["preveri", "namerne", "vprasanja"]) out[k].push(k === kamP ? l : "");
      continue;
    }
    out[kam].push(l);
  }
  return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.join("\n")]));
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
    else if (c.op === "molar") r = { ...molarOk(c.args[0], c.args[1]), how: "numeric" }; // dopust 0,6 %, ni točno
    else r = await casCheck(c.op, c.args);
  } catch (e) {
    return "nepreverjeno";
  }
  if (r.ok === true) return r.how === "symbolic" ? "izracunano" : "numericno";
  return r.ok === false ? "napaka" : "nepreverjeno";
}

const prazno = () => ({ ...Object.fromEntries(STATUSI.map((s) => [s, 0])), vse: 0, namerne: 0, vprasanja: 0, enot: 0, primeri: [] });
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
  const m = { lekcije: prazno(), preveri: prazno(), primeri: prazno(), racun: prazno(), fakulteta: prazno(), pole: prazno(), generatorji: prazno(), tekmovanja: prazno() };
  for (const l of lekcije()) {
    const d = deliLekcije(l.src);
    const tR = trditveIzBesedila(d.razlaga);
    const tQ = trditveIzBesedila(d.preveri);
    const tP = trditveIzBesedila(d.primeri);
    const nam = trditveIzBesedila(d.namerne).length;
    const vpr = trditveIzBesedila(d.vprasanja).length;
    if (l.uni) {
      dodaj(m.fakulteta, [...tR, ...tQ, ...tP], l.id);
      m.fakulteta.namerne += nam;
      m.fakulteta.vprasanja += vpr;
      m.fakulteta.enot++;
    } else {
      dodaj(m.lekcije, tR, l.id);
      dodaj(m.preveri, tQ, l.id);
      dodaj(m.primeri, tP, l.id);
      m.lekcije.namerne += nam;
      m.preveri.vprasanja += vpr;
      m.lekcije.enot++;
      if (tQ.length) m.preveri.enot++;
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
        dodaj(m.pole, trditveIzBesedila(part.scoring), kje);
        for (const w of part.ways || []) dodaj(m.pole, trditveIzBesedila(w.text), kje);
        // napačne izbire in »mistake« so namerno napačne; pravilna izbira (indeks v »correct«) je vsebina
        const prave = new Set(part.correct || []);
        const izbire = (part.choices || []).map((c, i) => ({ c: String(c), prava: prave.has(i) }));
        for (const x of izbire.filter((y) => y.prava)) dodaj(m.pole, trditveIzBesedila(x.c), kje);
        m.pole.namerne += trditveIzBesedila([part.mistake, ...izbire.filter((y) => !y.prava).map((y) => y.c)].join("\n")).length;
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

// staticno: ključ popisa ali null (trditve nastanejo ob uporabi). poTrditvi: kaj mesto danes preveri in ali ima status
// po trditvi. ci: kaj od tega danes preračuna CI (popis sam preverjevalnike uporabi na vsaki formuli posebej).
export const MESTA = [
  { st: 1, mesto: "AI-inštruktor, odgovori", enota: "trditev v odgovoru", staticno: null, poTrditvi: "program preračuna številske korake in končne vrednosti (live-check.js) ter trditve RACUN (SymPy); učenec ne vidi statusa po trditvi", lastnik: "B" },
  { st: 2, mesto: "Sodba učenčevega koraka", enota: "korak učenca", staticno: null, poTrditvi: "program presodi pravilno ali napačno, brez sedmih statusov", lastnik: "B" },
  { st: 3, mesto: "Shranjeni odgovori in kartice", enota: "kartica", staticno: null, poTrditvi: "pravilno ali napačno, brez sedmih statusov", lastnik: "B" },
  { st: 4, mesto: "Znanstveni kalkulator", enota: "rezultat", staticno: null, poTrditvi: "rezultat, ki ne prestane številske preizkušnje, se ne pokaže; statusa ni", lastnik: "B" },
  { st: 5, mesto: "Grafični kalkulator, CAS", enota: "rezultat", staticno: null, poTrditvi: "CAS rezultat preizkusi s števili in neprestanega ne pokaže (casUnverified); statusa ni", lastnik: "B" },
  { st: 6, mesto: "Učbenik: razlaga", enota: "formula z relacijo", staticno: "lekcije", ci: "da: check-lesson.js preračuna račune in identitete", lastnik: "A" },
  { st: 6, mesto: "Učbenik: »Preveri se« (pravilni odgovor, pojasnilo)", enota: "formula z relacijo", staticno: "preveri", ci: "delno: check-lesson.js preizkusi identitete v vrsticah + in >, računov ne preračuna", lastnik: "A" },
  { st: 6, mesto: "Učbenik: bloki RACUN (strojni zapis, učenec jih ne vidi)", enota: "vrstica RACUN", staticno: "racun", ci: "da: check-lesson.js (SymPy)", lastnik: "A" },
  { st: 7, mesto: "Rešeni primeri v lekcijah", enota: "formula z relacijo", staticno: "primeri", ci: "da: check-lesson.js (računi; od identitet le rešitve)", lastnik: "A" },
  { st: 8, mesto: "Vadnica: generatorji (rešitve)", enota: "formula z relacijo v rešitvi", staticno: "generatorji", ci: "ne: preveri-generatorje.js preveri odgovor naloge, korakov rešitve ne", lastnik: "A" },
  { st: 9, mesto: "Matura in NPZ: naše pole (rešitve)", enota: "formula z relacijo v rešitvi", staticno: "pole", ci: "delno: test pol preračuna odgovor, točkovnik in »mistake«, poti rešitve ne", lastnik: "A" },
  { st: 10, mesto: "Tekmovalne naloge (generatorji tek-*)", enota: "formula z relacijo v rešitvi", staticno: "tekmovanja", ci: "ne: kot generatorji", lastnik: "A" },
  { st: 11, mesto: "Priprava na test", enota: "naloga iz zapiskov", staticno: null, poTrditvi: "naloga, v kateri koda najde računsko napako, se izloči (codeCheck); statusa ni", lastnik: "A" },
  { st: 12, mesto: "Uvoženi zapiski in kartice", enota: "trditev zapiska", staticno: null, poTrditvi: "zapiski: trditve RACUN; vaja iz lista: ne", lastnik: "A" },
  { st: 13, mesto: "Skener", enota: "rešitev naloge", staticno: null, poTrditvi: "da: pet statusov (meritev PV-05 na naboru N-01)", lastnik: "A" },
  { st: 14, mesto: "Virtualni laboratorij", enota: "učenčev račun", staticno: null, poTrditvi: "pravilno ali napačno z dopustom (preveriRacun), brez sedmih statusov", lastnik: "A" },
  { st: 15, mesto: "Interaktivne simulacije", enota: "formula na zaslonu", staticno: null, poTrditvi: "ne (sim.test.js preizkusi fiziko, formul na zaslonu ne popiše)", lastnik: "A" },
  { st: 16, mesto: "Formule v 3D svetu", enota: "formula", staticno: null, poTrditvi: "ne (ni popisa)", lastnik: "A" },
  { st: 17, mesto: "Fizikalni in kemijski izračuni", enota: "rezultat z enoto", staticno: null, poTrditvi: "enote in kemija v RACUN, sicer ne", lastnik: "skupno" },
  { st: 18, mesto: "Fakultetna matematika (lekcije UNI-*)", enota: "formula z relacijo", staticno: "fakulteta", ci: "kot učbenik; zbirke server/university-*.js niso zajete", lastnik: "A" },
  { st: 19, mesto: "Ustno spraševanje, kvizi, dnevna uganka", enota: "odgovor", staticno: null, poTrditvi: "pravila po vrsti vprašanja, ne status", lastnik: "A" },
];

const ENOTE = { lekcije: "lekcij", preveri: "lekcij s »Preveri se«", primeri: "lekcij s primeri", racun: "lekcij z RACUN", fakulteta: "lekcij", pole: "pol", generatorji: "generatorjev", tekmovanja: "generatorjev" };
const odst = (k, n) => (n ? `${((100 * k) / n).toFixed(1).replace(".", ",")} %` : "–");
const st = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const trditev = (n) => `${st(n)} ${n % 100 === 1 ? "trditev" : n % 100 === 2 ? "trditvi" : n % 100 === 3 || n % 100 === 4 ? "trditve" : "trditev"}`;
export const sStatusom = (s) => s.vse - s.nepreverjeno;
export const polno = (s) => s.dokazano + s.izracunano + s.numericno;
/** Vsebina, ki jo učenec vidi (brez strojnih vrstic RACUN, ki ponovijo njene rezultate). */
export const VIDNA = MESTA.filter((x) => x.staticno && x.staticno !== "racun").map((x) => x.staticno);

/** Poročilo po predlogi docs/meritve/README.md. */
export function porocilo(m, { datum, commit, ukaz = "", okolje = "", dodatek = "" }) {
  const sk = VIDNA.map((k) => m[k]);
  const sum = (f) => sk.reduce((a, s) => a + f(s), 0);
  const vse = sum((s) => s.vse), s = sum(sStatusom), p = sum(polno), d = sum((s) => s.delno), n = sum((s) => s.nepreverjeno), e = sum((s) => s.napaka);
  const r = m.racun;
  const v = [`# Pokritost matematičnih trditev po delih aplikacije (${datum})`, "", "## Povzetek"];
  v.push(`- Glavna številka: ${trditev(p)} od ${st(vse)} v vsebini, ki jo učenec vidi (${odst(p, vse)}), je program v celoti preračunal (izračunano ali numerično). Delno (le del verige): ${st(d)} (${odst(d, vse)}). Brez statusa (»Nepreverjeno«): ${st(n)} (${odst(n, vse)}). Cilj: višje je bolje. Štetje celote, ne vzorec, zato brez intervala.`);
  v.push(r.neizmerjeno ? `- Strojni bloki RACUN (${trditev(r.vse)}) niso izmerjeni (brez SymPy).` : `- Strojni bloki RACUN, ločeno: ${trditev(polno(r))} od ${st(r.vse)} (${odst(polno(r), r.vse)}) v celoti preveri SymPy ali kemijski preizkus. Ponovijo rezultate vidne vsebine, zato niso v glavni številki.`);
  v.push(`- Pomeni: koliko formul z relacijo v lekcijah, rešenih primerih, polah in rešitvah generatorjev dobi status, ko obstoječe preverjevalnike (lesson-math, preizkus identitet, SymPy) uporabimo na vsaki formuli posebej. Zaznanih napak: ${e}.`);
  v.push("- Ne pomeni: da so formule brez statusa napačne, niti da je »numerično« dokaz. Tudi ne, da vse te statuse danes izračuna CI ali vidi učenec: stolpec »Preverjanje danes« pove, kaj se preračuna ob vsaki spremembi (koraki rešitev generatorjev in računi v »Preveri se« se ne). Oznaka lekcije »Strojno preverjeno« pomeni, da program preračuna vsaj en račun brez napake, ne da ima vsaka trditev status.");
  v.push("", "## Nabor");
  v.push("- Vir: vsa vsebina v repozitoriju na spodnjem commitu (content/lessons, content/exam-papers, server/practice/generators); generatorji: seme 1 na ravneh 1–3. Fakultetne zbirke v server/university-*.js niso zajete.");
  v.push("- Pričakovani izid: ni ga (popis ne meri pravilnosti, le ali ima trditev status). Uradnih virov: ne velja. Predloga docs/meritve/README.md je za vzorce; tu sta »Sestava« in »Skriti kontrolni del« brez pomena (štetje celote), stolpca n in interval pa nadomesti štetje.");
  v.push("", "## Metoda");
  v.push(`- Ukaz: \`${ukaz || "node scripts/popis-pokritosti.mjs"}\``);
  v.push(`- Commit: \`${commit}\` (veja PR; vsebina je enaka kot na \`main\` po združitvi); skripta ne kliče modela AI${okolje ? `; ${okolje}` : ""}${m.izpadi_cas ? `; zahtev SymPy brez odgovora: ${m.izpadi_cas}` : ""}`);
  v.push("- Trditev = formula $…$ ali $$…$$ z relacijo (=, ≈, <, >, ≤, ≥, ≠, ∈, ⇒ …); vrstica RACUN = ena trditev. Status: preračun server/lesson-math.js (numerično, delno, napaka); simbolna enakost, ki jo potrdi preizkus z naključnimi števili server/lesson-identity.js, je numerično (neujemanje brez okolice lekcije ne šteje kot napaka, ker je lahko enačba); RACUN: SymPy z načinom (izračunano ali numerično), uravnotežena enačba izračunano, molska masa z dopustom numerično.");
  v.push("- Izločeno in našteto posebej: namerno napačne (»Pogoste napake« v celoti, napačne možnosti v »Preveri se« in njihova pojasnila ~, »mistake« in napačne izbire na polah) in vprašanja (? v »Preveri se«: podatek naloge, ne trditev).");
  v.push("", "## Izidi", "", "| # | Mesto | Enota trditve | Trditev | V celoti | Delno | Napaka | Nepreverjeno | Izračunano / numerično | Izločene: namerno napačne / vprašanja | Preverjanje danes | Obseg |", "|---|---|---|---|---|---|---|---|---|---|---|---|");
  for (const x of MESTA) {
    if (!x.staticno) {
      v.push(`| ${x.st} | ${x.mesto} | ${x.enota} | ob uporabi | – | – | – | – | – | – | ${x.poTrditvi} | lastnik ${x.lastnik} |`);
      continue;
    }
    const a = m[x.staticno];
    if (a.neizmerjeno) {
      v.push(`| ${x.st} | ${x.mesto} | ${x.enota} | ${st(a.vse)} | ni izmerjeno (brez SymPy) | – | – | – | – | – | ${x.ci} | ${a.enot} ${ENOTE[x.staticno]} |`);
      continue;
    }
    v.push(`| ${x.st} | ${x.mesto} | ${x.enota} | ${st(a.vse)} | ${st(polno(a))} (${odst(polno(a), a.vse)}) | ${st(a.delno)} | ${a.napaka} | ${st(a.nepreverjeno)} (${odst(a.nepreverjeno, a.vse)}) | ${st(a.izracunano)} / ${st(a.numericno)} | ${st(a.namerne)} / ${st(a.vprasanja)} | ${x.ci} | ${a.enot} ${ENOTE[x.staticno]} |`);
  }
  v.push("", "## Napake in neuspehi");
  let nic = true;
  for (const x of MESTA.filter((y) => y.staticno)) {
    const a = m[x.staticno];
    if (a.napaka) {
      nic = false;
      v.push(`- ${x.mesto}: ${trditev(a.napaka)}, kjer preračun ne izide${a.primeri.length ? ` (${a.primeri.join("; ")})` : ""}`);
    }
  }
  if (nic) v.push("- Nobena trditev s statusom »Zaznana napaka«.");
  if (m.izpadi_cas) v.push(`- SymPy ni odgovoril na ${m.izpadi_cas} zahtev: te trditve RACUN so »Nepreverjeno«, meritev RACUN ni veljavna.`);
  if (dodatek) v.push("", dodatek.trim());
  v.push("", "## Omejitve");
  v.push("- Trditev je formula z relacijo: besedne trditve (»funkcija je naraščajoča«) in formule brez relacije niso štete, zato je pravo število trditev večje.");
  v.push("- Ena formula z več relacijami je ena trditev; »delno« pomeni, da je program preračunal le del verige.");
  v.push("- Popis uporabi preverjevalnike na vsaki formuli posebej, tudi tam, kjer jih CI ne (generatorji, računi v »Preveri se«, poti rešitev na polah); brez okolice lekcije preizkus identitet le potrjuje, zato je del simbolnih trditev, ki jih CI lekcij preizkusi, tu »Nepreverjeno«.");
  v.push("- »Numerično« je preračun s plavajočo vejico ali preizkus z naključnimi števili, ne dokaz; »napaka« je lahko tudi pretvorba enote, zapis ure ali ocena reda velikosti, ki je lesson-math ne prepozna (glej pregled zgoraj).");
  v.push("- Izločene skupine niso vse napačne: »Pogoste napake« vsebujejo tudi pravilne različice, pojasnila ~ tudi pravilne račune.");
  v.push("- Bloki RACUN ponovijo rezultate vidne vsebine (content/lessons/README.md), zato so ločeni od glavne številke.");
  v.push("- Fakultetne zbirke v server/university-*.js (del mesta 18) niso zajete.");
  v.push("- Mesta, kjer trditve nastanejo ob uporabi (inštruktor, kalkulatorji, skener …), nimajo štetja; skener meri PV-05 na naboru N-01.");
  v.push("", "## Stroški", "Klicev API: 0, cena: 0 $.", "");
  return v.join("\n");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2);
  const arg = (ime) => (a.indexOf(ime) >= 0 ? a[a.indexOf(ime) + 1] : undefined);
  let cas = null;
  let c = null;
  if (!a.includes("--brez-sympy")) {
    c = await import("../server/cas.js");
    const r = await import("../server/racun.js");
    if (await c.casAvailable()) cas = { casCheck: c.casCheck, chemBalanced: r.chemBalanced, molarOk: r.molarOk };
    else console.log("OPOMBA: SymPy ni na voljo, bloki RACUN ostanejo neizmerjeni");
  }
  const pred = c ? c.casIzpadi().skupaj : 0;
  const m = await popisi({ cas });
  m.izpadi_cas = c ? c.casIzpadi().skupaj - pred : 0;
  for (const x of MESTA.filter((y) => y.staticno)) {
    const s = m[x.staticno];
    console.log(`${x.st}\t${x.mesto}\t${s.vse} trditev\t${s.neizmerjeno ? "neizmerjeno" : `${polno(s)} v celoti, ${s.delno} delno`}\t${STATUSI.map((k) => `${k} ${s[k]}`).join(", ")}\tizločenih ${s.namerne}, vprašanj ${s.vprasanja}`);
  }
  const { execFileSync } = await import("node:child_process");
  let commit = process.env.GITHUB_SHA || "";
  try {
    commit ||= execFileSync("git", ["rev-parse", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    commit ||= "neznan";
  }
  let okolje = `Node ${process.version}`;
  if (cas) {
    try {
      const pp = [join(ROOT, ".pylib"), process.env.PYTHONPATH].filter(Boolean).join(":");
      okolje += `, SymPy ${execFileSync("python3", ["-c", "import sympy; print(sympy.__version__)"], { encoding: "utf8", env: { ...process.env, PYTHONPATH: pp } }).trim()}`;
    } catch {
      okolje += ", SymPy (različica neznana)";
    }
  }
  const dodatek = arg("--dodatek") ? readFileSync(arg("--dodatek"), "utf8") : "";
  const meta = { datum: new Date().toISOString().slice(0, 10), commit, ukaz: ["node scripts/popis-pokritosti.mjs", ...a].join(" "), okolje };
  if (arg("--json")) writeFileSync(arg("--json"), JSON.stringify({ ...meta, mesta: m }, null, 1) + "\n");
  if (arg("--porocilo")) writeFileSync(arg("--porocilo"), porocilo(m, { ...meta, dodatek }));
  c?.casStop();
  // --strogo: brez SymPy ali z zahtevo brez odgovora meritev RACUN ni veljavna
  if (a.includes("--strogo") && (!cas || m.izpadi_cas)) {
    console.log(`NEUSPEH: ${!cas ? "SymPy ni tekel" : `${m.izpadi_cas} zahtev SymPy brez odgovora`}`);
    process.exitCode = 1;
  }
}
