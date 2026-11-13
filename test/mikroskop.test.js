// Mikroskop (docs/mikroskop.md): optika, seznam preparatov, barvanja, preslikava 3D sveta → preparat in prevodi.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  OBJEKTIVI, MIN_M, MAX_M, SVETLOBNI_MAX, vidnoPolje, locljivost, globinskaOstrina, zamegljenost, raven, utezModela, merilce,
  oznakaDolzine, oznakaPovecave, SEM_MAX, SEM_LOCLJIVOST, globinskaOstrinaSem,
} from "../public/mikroskop/optika.js";
import { BARVANJA, matrikaBarvil } from "../public/mikroskop/barvila.js";
import { PREPARATI, SKUPINE, ZACETNI, naloziPreparat } from "../public/mikroskop/preparati/index.js";
import { preparatAtlasa, preparatModela, pogledDela, MODELI_Z_MIKROSKOPOM } from "../public/mikroskop/mapa.js";
import { fragmentPreparata } from "../public/mikroskop/glsl.js";
import { povecava, izracunajPogled, ZACETNO, najblizjaMolekula, fino } from "../public/mikroskop/pogled.js";
import sl from "../public/i18n/sl.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const D3 = path.join(ROOT, "public", "3d");
const json = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));
const IDS = new Set(PREPARATI.map((p) => p.id));

test("mikroskop: povečava od 40× do 50 000 000×, svetlobni do 1000×", () => {
  assert.equal(MIN_M, 40);
  assert.equal(MAX_M, 50_000_000);
  assert.equal(SVETLOBNI_MAX, 1000);
  assert.deepEqual(OBJEKTIVI.map((o) => o.m), [4, 10, 40, 100]);
  assert.equal(OBJEKTIVI.filter((o) => o.olje).length, 1);
  assert.equal(povecava({ ...ZACETNO, nacin: "svetloba", objektiv: 3 }), 1000);
  assert.equal(oznakaPovecave(5e7), "50 000 000×");
});

test("mikroskop: optika se ujema z učbeniškimi vrednostmi", () => {
  // vidno polje: 18 mm številka polja / 10× objektiv = 1,8 mm; TEM 160 mm zaslon pri 5000× = 32 µm
  assert.equal(vidnoPolje(100), 1800);
  assert.equal(vidnoPolje(5000, "tem"), 32);
  // Rayleigh pri 100×/1,25 z oljem in polno odprto zaslonko ≈ 0,27 µm, brez olja slabše in bolj zamegljeno
  const sto = OBJEKTIVI[3];
  const d = locljivost(sto, 1, true);
  assert.ok(d > 0.2 && d < 0.3, `ločljivost ${d}`);
  assert.ok(locljivost(sto, 1, false) > d);
  assert.ok(zamegljenost(sto, { olje: false }) > 3 * zamegljenost(sto, { olje: true }));
  // globinska ostrina pada z NA; razostritev poveča zamegljenost
  assert.ok(globinskaOstrina(OBJEKTIVI[0]) > globinskaOstrina(OBJEKTIVI[2]));
  assert.ok(zamegljenost(OBJEKTIVI[2], { dz: 10 }) > zamegljenost(OBJEKTIVI[2], { dz: 0 }) * 3);
  // objektivi so skoraj parfokalni: pri menjavi ostane slika uporabna (odmik največ ~1 µm)
  for (const o of OBJEKTIVI) assert.ok(Math.abs(o.parfokal) <= 1, `${o.m}× parfokal ${o.parfokal}`);
});

test("mikroskop: ravni TEM od celic do atomov, model molekul šele nad ~800 000×", () => {
  assert.equal(raven(5000, "tem"), "celice");
  assert.equal(raven(50_000, "tem"), "organeli");
  assert.equal(raven(300_000, "tem"), "membrane");
  assert.equal(raven(2_000_000, "tem"), "molekule");
  assert.equal(raven(50_000_000, "tem"), "atomi");
  assert.equal(utezModela(100_000), 0);
  assert.equal(utezModela(50_000_000), 1);
  assert.deepEqual(merilce(37), [20, "20 µm"]);
  assert.equal(oznakaDolzine(0.0002), "2 Å");
});

test("mikroskop: SEM (j, 13. 11. 2026) – vidno polje, globinska ostrina, ravni in uniforme", () => {
  // slika 127 mm pri 1000× = 127 µm; ločljivost ~3 nm; do 300 000×
  assert.equal(vidnoPolje(1000, "sem"), 127);
  assert.equal(SEM_MAX, 300_000);
  assert.ok(SEM_LOCLJIVOST >= 0.001 && SEM_LOCLJIVOST <= 0.01);
  // globinska ostrina SEM je pri isti povečavi desetkrat do stokrat večja kot pri svetlobnem mikroskopu (Goldstein 2018)
  assert.equal(globinskaOstrinaSem(1000), 40);
  assert.ok(globinskaOstrinaSem(400) > 30 * globinskaOstrina(OBJEKTIVI[2]));
  assert.equal(raven(100, "sem"), "tkivo");
  assert.equal(raven(1000, "sem"), "celice");
  assert.equal(raven(10_000, "sem"), "povrsina"); // SEM ne vidi jeder
  assert.equal(raven(300_000, "sem"), "povrsina");
  assert.equal(povecava({ ...ZACETNO, nacin: "sem", m: 2500 }), 2500);
  const { v } = izracunajPogled(null, { barvanje: "he" }, { ...ZACETNO, nacin: "sem", m: 2500 }, 800);
  assert.equal(v.nacin, 3);
  assert.equal(v.elektroni, true);
  assert.equal(v.krog, false);
});

test("mikroskop: vsak preparat obstaja, ima opis, barvanje in GLSL s funkcijo tkivo", async () => {
  assert.ok(PREPARATI.length >= 45);
  assert.ok(IDS.has(ZACETNI));
  assert.equal(IDS.size, PREPARATI.length, "podvojen id");
  const skupine = new Set(SKUPINE.map(([k]) => k));
  for (const e of PREPARATI) {
    assert.ok(skupine.has(e.skupina), `${e.id}: skupina ${e.skupina}`);
    const p = await naloziPreparat(e.id);
    assert.ok(p, `${e.id}: ni izvoza ${e.izvoz} v ${e.datoteka}.js`);
    assert.equal(p.id, e.id);
    assert.ok(p.ime && p.opis && p.opis.length > 60, `${e.id}: opis`);
    assert.ok(BARVANJA[p.barvanje], `${e.id}: barvanje ${p.barvanje}`);
    assert.equal(matrikaBarvil(p.barvanje).length, 9);
    assert.match(p.glsl, /T\s+tkivo\s*\(\s*vec2\s+p\s*,\s*float\s+px\s*\)/, `${e.id}: tkivo()`);
    // oklepaji v senčilniku (tudi v ločenem programu SEM) so uravnoteženi (napaka prevajanja bi sicer počakala na brskalnik)
    for (const frag of [fragmentPreparata(p.glsl), fragmentPreparata(p.glsl, { sem: true })]) {
      assert.match(frag, /^#version 300 es/);
      for (const [a, b] of [["{", "}"], ["(", ")"]]) assert.equal(frag.split(a).length, frag.split(b).length, `${e.id}: ${a}${b}`);
    }
  }
});

test("mikroskop: vsaka struktura atlasa telesa ima preparat", () => {
  const atlas = json("public/3d/atlas-strukture.json");
  const zenski = json("public/3d/atlas-zenski.json").strukture || [];
  const brez = [];
  for (const r of [...atlas, ...zenski]) {
    const p = preparatAtlasa(r);
    if (!p) brez.push(`${r.ime} (${r.material})`);
    else assert.ok(IDS.has(p), `${r.ime} → ${p} ne obstaja`);
  }
  assert.deepEqual([...new Set(brez)].slice(0, 20), []);
  // nekaj značilnih primerov
  assert.equal(preparatAtlasa({ ime: "Femur", material: "Bone-1" }), "kost");
  assert.equal(preparatAtlasa({ ime: "Left ventricle of heart", material: "Organ" }), "srcna-misica");
  assert.equal(preparatAtlasa({ ime: "Cerebellum", material: "Brain" }), "mali-mozgani");
  assert.equal(preparatAtlasa({ ime: "Biceps brachii", material: "Flexion" }), "skeletna-misica");
  // tkivo v imenu ima prednost pred organom v imenu
  assert.equal(preparatAtlasa({ ime: "Left renal artery", material: "Artery" }), "arterija");
  assert.equal(preparatAtlasa({ ime: "Lacrimal bone", material: "Bone-6" }), "kost");
  assert.equal(preparatAtlasa({ ime: "Thyroid cartilage", material: "Cartilage" }), "hrustanec");
  assert.equal(preparatAtlasa({ ime: "Uvula of vermis", material: "Cerebellum" }), "mali-mozgani");
});

test("mikroskop: vsak model celice in organa ter vsak del iz preslikave obstaja", async () => {
  const modeli = [];
  for (const d of ["celice", "organi", "procesi"]) {
    const mod = await import(pathToFileURL(path.join(D3, "modeli", d, "index.js")).href);
    modeli.push(...mod.default.map((m) => m.id));
  }
  const vsi = new Set(modeli);
  for (const id of MODELI_Z_MIKROSKOPOM) {
    assert.ok(vsi.has(id), `model ${id} ne obstaja`);
    assert.ok(IDS.has(preparatModela(id)), `${id} → ${preparatModela(id)}`);
  }
  // vsaka celica in vsak organ ima mikroskop
  for (const id of modeli.filter((m) => /^(celica|organ)-/.test(m))) assert.ok(preparatModela(id), `${id} nima preparata`);
  // deli organov iz GLB
  for (const organ of ["jetra", "ledvica", "mozgani", "oko", "pljuca", "srce"]) {
    const deli = new Set(json(`public/3d/modeli/organi-3d/${organ}.json`).deli.map((d) => d.id));
    for (const del of deli) assert.ok(IDS.has(preparatModela(`organ-${organ}`, del)), `${organ}/${del}`);
  }
  assert.equal(preparatModela("organ-srce", "aorta"), "arterija");
  assert.equal(preparatModela("organ-srce", "levi-prekat"), "srcna-misica");
  assert.equal(preparatModela("ne-obstaja"), null);
});

// j, 13. 11. 2026: »Gumb poglej pod mikroskopom pokaže za jedrce in osrednjo vakuolo isto stvar … Naj bo prilagojeno
// vsakemu posameznemu organelu«
test("mikroskop: vsak del celice odpre svoj pogled (preparat, povečava, snov pod kazalcem)", () => {
  const pogled = (m, d) => pogledDela(m, d);
  const r = (d) => pogled("celica-rastlinska", d);
  assert.deepEqual(r("jedrce"), { p: "cebula", m: 6000, snov: [28] });
  assert.deepEqual(r("vakuola"), { p: "cebula", m: 400, snov: [12] });
  assert.equal(r("kloroplast").p, "list");
  assert.notDeepEqual(r("jedrce"), r("vakuola"));
  assert.equal(pogled("celica-zivalska", "mitohondrij").snov[0], 20);
  assert.equal(pogled("celica-zivalska", "golgi").snov[0], 29);
  assert.equal(pogled("celica-eritrocit", "hemoglobin").p, "kri");
  assert.equal(pogled("virus-hiv", "rnk").snov[0], 31);
  // gladki ER je svoj organel (j, 13. 11. 2026: gumb je odprl zrnati ER ustne sluznice): v živalski celici jetra
  assert.deepEqual(pogled("celica-zivalska", "gladki-er"), { p: "jetra", m: 30000, snov: [32] });
  assert.equal(pogled("celica-zivalska", "zrnati-er").snov[0], 21);
  assert.equal(pogled("celica-epitelna", "gladki-er").p, "tanko-crevo"); // enterocit ima svoj gladki ER
  assert.equal(pogled("celica-gladka-misicna", "sarkoplazemski-retikulum").snov[0], 32);
  // T-cevke so uvihana membrana, zrnca levkocitov se vidijo v razmazu krvi, Schwannove celice so v živcu
  assert.equal(pogled("celica-srcna-misicna", "t-cevke").snov[0], 24);
  assert.equal(pogled("celica-levkociti", "zrnca").p, "kri");
  assert.equal(pogled("celica-nevron", "schwannova-celica").p, "zivec");
  // progasta mišica: SR in T-cevke (triade) sta narisana v skeletni in srčni mišici, gosti cevasti sistem trombocita v krvi
  for (const [m, p] of [["celica-skeletno-misicno-vlakno", "skeletna-misica"], ["celica-srcna-misicna", "srcna-misica"]]) {
    assert.deepEqual(pogled(m, "sarkoplazemski-retikulum"), { p, m: 30000, snov: [32] }, m);
  }
  assert.equal(pogled("celica-skeletno-misicno-vlakno", "t-cevke").p, "skeletna-misica");
  assert.equal(pogled("celica-skeletno-misicno-vlakno", "sarkolema").snov[0], 24);
  const gcs = pogled("celica-trombocit", "gost-cevast-sistem");
  assert.equal(gcs.p, "kri");
  assert.equal(gcs.snov[0], 32);
  // vsak pogled ima obstoječ preparat in povečavo v obsegu mikroskopa; tudi deli brez posebne snovi dobijo pogled
  for (const m of MODELI_Z_MIKROSKOPOM.filter((x) => /^(celica|virus)/.test(x))) {
    for (const d of ["jedro", "jedrce", "mitohondrij", "membrana", "citoplazma", "ribosomi", "neznan-del"]) {
      const v = pogled(m, d);
      assert.ok(IDS.has(v.p), `${m}/${d} → ${v.p}`);
      assert.ok(v.m >= 40 && v.m <= 5e7 && v.snov?.length, `${m}/${d}: ${JSON.stringify(v)}`);
    }
  }
  // deli organov iz GLB ostanejo pri svojem preparatu
  assert.deepEqual(pogled("organ-srce", "aorta"), { p: "arterija" });
});

// Pregled PR #643: rastline, bakterije, kvasovke in praživali nikoli ne skočijo v človeško tkivo, deli organov ostanejo
// pri organu; preverjeno na vseh pravih delih 3D celic in procesov (public/3d/modeli/celice in procesi).
test("mikroskop: pogled dela ostane v isti skupini živih bitij", () => {
  const RASTLINSKI = new Set(["cebula", "list", "reza", "koren", "steblo"]);
  const MIKROBNI = new Set(["bakterije", "kvasovke", "kapljica"]);
  let preverjenih = 0;
  for (const mapa of ["celice", "procesi"]) {
    const indeks = fs.readFileSync(`public/3d/modeli/${mapa}/index.js`, "utf8");
    for (const [, id, pot] of indeks.matchAll(/id: "([a-z0-9-]+)", pot: "\.\/([a-z0-9-]+\.js)"/g)) {
      const osnova = pogledDela(id)?.p;
      if (!osnova) continue;
      const vir = fs.readFileSync(`public/3d/modeli/${mapa}/${pot}`, "utf8");
      const vzorec = mapa === "celice" ? /del\("([a-z0-9-]+)"/g : /\bid: "([a-z0-9-]+)"/g; // procesi: deli kot { id: "…" }
      for (const [, del] of vir.matchAll(vzorec)) {
        if (del === id) continue;
        const v = pogledDela(id, del);
        assert.ok(IDS.has(v.p) && v.m >= 40 && v.m <= 5e7, `${id}/${del}: ${JSON.stringify(v)}`);
        if (RASTLINSKI.has(osnova)) assert.ok(RASTLINSKI.has(v.p), `${id}/${del} → ${v.p}`);
        if (MIKROBNI.has(osnova)) assert.equal(v.p, osnova, `${id}/${del} → ${v.p}`);
        preverjenih++;
      }
    }
  }
  assert.ok(preverjenih > 300, `preverjenih ${preverjenih}`);
  assert.deepEqual(pogledDela("organ-mesicki", "mesicki"), { p: "pljuca" });
  assert.deepEqual(pogledDela("celica-bakterijska", "membrana").p, "bakterije");
  assert.deepEqual(pogledDela("mitoza", "kromosomi"), { p: "koren", m: 1000, snov: [27] });
  assert.equal(pogledDela("celica-nevron", "nisslova-telesca").p, "skorja");
  assert.equal(pogledDela("celica-skeletno-misicno-vlakno", "z-linija").snov[0], 7);
});

test("mikroskop: prevodi gumbov v vseh jezikih in vstop iz lekcij", () => {
  const kljuci = ["mk.title", "mk.open", "mk.start", "mk.hub", "mk.sem", "mk.surface", "mk.semResolution", "mk.level.povrsina", "mk.truth.sem"];
  for (const k of kljuci) assert.ok(sl[k], `sl ${k}`);
  const dir = path.join(ROOT, "public", "i18n", "ui");
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    for (const k of kljuci) assert.ok(d[k], `${f}: ${k}`);
  }
  // gumba − in + ob drsniku povečave (j, 13. 11. 2026), z oznakama za bralnike zaslona
  const ui = fs.readFileSync(path.join(ROOT, "public", "mikroskop", "mikroskop.js"), "utf8");
  assert.match(ui, /gumbPov\("zoom-out", "a3\.zoomOut", 0\.5\)/);
  assert.match(ui, /gumbPov\("zoom-in", "a3\.zoomIn", 2\)/);
  assert.ok(sl["a3.zoomIn"] && sl["a3.zoomOut"]);
  // trije načini: svetloba (objektivi), SEM in TEM
  assert.match(ui, /mk-obj mk-sem/);
  assert.match(sl["mk.electron"], /TEM/);
  assert.match(sl["mk.sem"], /SEM/);
  const katalog = fs.readFileSync(path.join(ROOT, "public", "sim", "katalog.js"), "utf8");
  assert.ok((katalog.match(/\["mikroskop",/g) || []).length >= 4);
  const index = fs.readFileSync(path.join(ROOT, "public", "sim", "index.js"), "utf8");
  assert.match(index, /mikroskop: \["\.\.\/mikroskop\/mikroskop\.js", "simMikroskop"\]/);
});

// Molekule (j, 13. 11. 2026): vsak preparat pokaže molekule, ki jih v njem najpogosteje najdemo, z imeni in vlogami.
test("mikroskop: prizori molekul, membrane in značilna mesta se ujemajo s katalogom in shaderjem", async () => {
  const { MOL, PRIZORI, MEMBRANE, ZNACILNO, ZNACILNA_TOCKA, S, prizor, uniformeMolekul, elementiMolekule } = await import("../public/mikroskop/molekule-vrste.js");
  const { MOLEKULE } = await import("../public/mikroskop/molekule.js");
  for (const [ime, [koda, ...mol]] of Object.entries(PRIZORI)) {
    assert.ok(mol.length <= 6, `${ime}: največ 6 rež`);
    for (const id of mol) if (id) assert.ok(MOL[id], `${ime}: ${id}`);
    assert.match(MOLEKULE, new RegExp(`#define P_[A-Z0-9_]+ ${koda}\\b`), `${ime}: koda ${koda} v shaderju`);
  }
  for (const [ime, [, ...mol]] of Object.entries(MEMBRANE)) for (const id of mol) assert.ok(MOL[id], `${ime}: ${id}`);
  for (const [id, m] of Object.entries(MOL)) {
    assert.match(m.barva, /^#[0-9a-f]{6}$/i, id);
    assert.ok(m.g >= 0 && Number.isInteger(m.at), id);
    assert.ok(elementiMolekule(id).length > 0, `${id}: elementi`);
  }
  for (const [p, snovi] of Object.entries(ZNACILNO)) {
    assert.ok(IDS.has(p), p);
    for (const k of snovi) assert.ok(Number.isInteger(k), `${p}: ${k}`);
  }
  for (const [p, z] of Object.entries(ZNACILNA_TOCKA)) {
    assert.ok(ZNACILNO[p], `${p}: točka brez snovi`);
    assert.ok(z.length === 2 && z.every(Number.isFinite), p);
  }
  assert.deepEqual(Object.keys(ZNACILNO).sort(), Object.keys(ZNACILNA_TOCKA).sort());
  // gojišče virusov ni krvna plazma; glava T4 ob repu nima gumbov Hoc
  assert.equal(prizor({ snov: S.PLAZMA, tip: 0, r1: 0 }, "virus-hiv").ime, "voda");
  // značilne molekule: kri → hemoglobin, mišica → miozin, T4 → DNK v glavi, rep → gp18, hrustanec → agrekan
  const pr = (snov, prep, tip = 0, r1 = 0) => prizor({ snov, tip, r1 }, prep).mol;
  assert.ok(pr(S.ERITROCIT, "kri").includes("hemoglobin"));
  assert.ok(pr(S.MIOFIBRILA, "skeletna-misica").includes("miozin"));
  assert.ok(pr(S.GENOM, "virus-t4", 7, 3.0).includes("dnk"));
  assert.ok(pr(S.VIRUS, "virus-t4", 7, 3.1).includes("gp18"));
  assert.ok(pr(S.MATRIKS, "hrustanec").includes("agrekan"));
  const u = uniformeMolekul({ snov: S.GENOM, tip: 7, r1: 3.0 }, { snov: S.VAKUOLA, tip: 7, r1: 0 }, true, "virus-t4");
  assert.equal(u.reze.length, 16);
  assert.equal(u.barve3.length, 48);
  assert.equal(u.gost.length, 16);
  assert.ok(u.reze.includes("gp23"), "glavo T4 obdaja gp23");
  // shader: oklepaji v ravnovesju, uniforme, ki jih nastavi upodobi.js
  assert.equal((MOLEKULE.match(/\{/g) || []).length, (MOLEKULE.match(/\}/g) || []).length);
  for (const un of ["uPA", "uPB", "uMemVrsta", "uZun", "uBodice", "uBarvaMol", "uGostMol", "uAtMol", "uIdPass"]) assert.match(MOLEKULE, new RegExp(`uniform \\w+ ${un}\\b`), un);
  // imena in vloge v vseh jezikih, oznake na sliki in seznam pod njo
  const dir = path.join(ROOT, "public", "i18n", "ui");
  const jeziki = [["sl", sl], ...fs.readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => [f, json(`public/i18n/ui/${f}`)])];
  for (const [j, d] of jeziki) {
    for (const k of ["mk.molList", "mk.atomList"]) assert.ok(d[k], `${j}: ${k}`);
    for (const id of Object.keys(MOL)) assert.ok(d[`mk.mol.${id}`] && d[`mk.molv.${id}`], `${j}: ${id}`);
  }
  const ui = fs.readFileSync(path.join(ROOT, "public", "mikroskop", "mikroskop.js"), "utf8");
  assert.match(ui, /mk-mol-oznaka/);
  assert.match(ui, /ZNACILNO\[prep\.id\]/);
});

test("mikroskop: pri atomih se sredina premakne na najbližjo molekulo, ne ostane v vodi (j, 13. 11. 2026)", () => {
  const k = 16;
  const reze = ["voda", "miozin", "aktin"];
  const id = new Uint8Array(k * k).fill(1); // povsod voda
  assert.equal(najblizjaMolekula(id, k, reze), null, "le voda: ni premika");
  for (let j = 0; j < k; j++) for (let i = 11; i < 15; i++) id[j * k + i] = 2; // miozin desno od sredine
  const [dx, dy] = najblizjaMolekula(id, k, reze);
  assert.ok(dx >= 3.5 && dx <= 5.5 && Math.abs(dy) < 1, `premik v miozin: ${dx}, ${dy}`);
  const id2 = new Uint8Array(k * k).fill(3); // sredina je že v aktinu
  assert.equal(najblizjaMolekula(id2, k, reze), null);
  const id3 = new Uint8Array(k * k); // prazno (0 = ni molekule)
  assert.equal(najblizjaMolekula(id3, k, reze), null);
  // šiv sveta molekul ni blizu okroglih števil (začetki preparatov, npr. arterija pri y = 150 µm)
  for (const x of [0, 0.5, 1, 2, 4, 150, -1100, 900, 1150.9]) {
    const f = fino(x);
    assert.ok(f > 100 && f < 3900, `${x} µm → ${f} nm`);
  }
});
