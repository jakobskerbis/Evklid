// Mikroskop (docs/mikroskop.md): optika, seznam preparatov, barvanja, preslikava 3D sveta → preparat in prevodi.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  OBJEKTIVI, MIN_M, MAX_M, TEM_MAX, TEM_LOCLJIVOST, svetlostSnopa, svetlost, SVETLOBNI_MAX, vidnoPolje, locljivost, globinskaOstrina, zamegljenost, raven, utezModela, merilce,
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

test("mikroskop: povečava od 40× do 100 000 000×, svetlobni do 1000×", () => {
  assert.equal(MIN_M, 40);
  assert.equal(MAX_M, 100_000_000);
  assert.equal(SVETLOBNI_MAX, 1000);
  assert.deepEqual(OBJEKTIVI.map((o) => o.m), [4, 10, 40, 100]);
  assert.equal(OBJEKTIVI.filter((o) => o.olje).length, 1);
  assert.equal(povecava({ ...ZACETNO, nacin: "svetloba", objektiv: 3 }), 1000);
  assert.equal(oznakaPovecave(5e7), "50 000 000×");
  assert.equal(oznakaPovecave(MAX_M), "100 000 000×");
  assert.ok(vidnoPolje(MAX_M, "tem") > 0.0015 && vidnoPolje(MAX_M, "tem") < 0.002); // 1,6 nm: nekaj atomov čez polje
});

test("mikroskop: TEM brez barv le do uporabne povečave (~20 ločljivih točk čez vidno polje)", () => {
  assert.equal(TEM_MAX, 5_000_000);
  assert.ok(TEM_MAX < MAX_M && TEM_MAX > SEM_MAX);
  const tocke = vidnoPolje(TEM_MAX, "tem") / TEM_LOCLJIVOST;
  assert.ok(Math.abs(vidnoPolje(TEM_MAX, "tem") - 0.032) < 1e-12);
  assert.ok(tocke >= 20 && tocke < 25, `${tocke} točk`);
  assert.ok(vidnoPolje(MAX_M, "tem") / TEM_LOCLJIVOST < 3); // pri 100 000 000× le še ena točka: prazna povečava
  assert.equal(utezModela(TEM_MAX), 1); // model molekul je pri meji že poln
  assert.equal(oznakaPovecave(TEM_MAX), "5 000 000×");
  const ui = fs.readFileSync(path.join(ROOT, "public", "mikroskop", "mikroskop.js"), "utf8");
  assert.match(ui, /temMax = \(\) => \(s\.barve \? MAX_M : TEM_MAX\)/);
  assert.ok(sl["mk.temLimit"]);
});

test("mikroskop: snop 0 % je črn, šibek snop temen, privzeti in samodejni kot prej", () => {
  assert.equal(svetlostSnopa(0), 0);
  for (const e of [0.3, 0.365, 0.5, 0.7, 0.9, 1]) assert.ok(Math.abs(svetlostSnopa(e) - (0.9 + 0.5 * e)) < 1e-12, `${e}`);
  assert.ok(svetlostSnopa(0.05) < 0.2 && svetlostSnopa(0.1) < 0.35);
  for (let e = 0; e < 1; e += 0.01) assert.ok(svetlostSnopa(e + 0.01) > svetlostSnopa(e));
  const prep = { id: "kri", barvanje: "he" };
  const v = (nacin, zarnica) => izracunajPogled(null, prep, { ...ZACETNO, nacin, m: 20000, zarnica }, 256, { hitro: true }).v;
  for (const nacin of ["tem", "sem"]) {
    assert.equal(v(nacin, 0).svetlost, 0, nacin);
    assert.ok(Math.abs(v(nacin, ZACETNO.zarnica).svetlost - 1.25) < 1e-12, nacin);
  }
  assert.ok(v("sem", 0.1).sum > v("sem", 0.7).sum); // SEM: manj elektronov, več šuma
  // lučka svetlobnega mikroskopa: ista vrednost, 0 je temno, samodejna lučka (mikroskop.js) da svetlo podlago
  assert.equal(v("svetloba", 0).svetlost, 0);
  const obj = OBJEKTIVI[ZACETNO.objektiv];
  const auto = Math.max(0.05, Math.min(1, 0.95 / svetlost(obj, 1, ZACETNO.zaslonka, false)));
  assert.ok(Math.abs(v("svetloba", auto).svetlost - 0.95) < 1e-9);
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
  // vnaprej najdena točka T-cevke velja le za T-cevke (oznaka tocka), ne za sarkolemo ali druge membrane
  assert.equal(pogled("celica-srcna-misicna", "t-cevke").tocka, "cevke");
  assert.equal(pogled("celica-srcna-misicna", "sarkolema").tocka, undefined);
  assert.equal(pogled("celica-skeletno-misicno-vlakno", "sarkolema").tocka, undefined);
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
      assert.ok(v.m >= 40 && v.m <= MAX_M && v.snov?.length, `${m}/${d}: ${JSON.stringify(v)}`);
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
        assert.ok(IDS.has(v.p) && v.m >= 40 && v.m <= MAX_M, `${id}/${del}: ${JSON.stringify(v)}`);
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
  // specializiran program za en pogled (hitrost, j 16. 11. 2026): le prizori strani A in B, izbrana membrana, vrste atomov
  const { molekuleZa, kljucMolekul } = await import("../public/mikroskop/molekule.js");
  const kode = [...MOLEKULE.matchAll(/^#define (P_[A-Z0-9_]+) (\d+)$/gm)].map((m) => [m[1], +m[2]]);
  const veje = (src) => [...src.matchAll(/^  (?:\} else )?if \(P == (.*)\) \{$/gm)].map((m) => m[1]);
  const vse = veje(MOLEKULE).join(" ");
  for (const [ime] of kode) assert.match(vse, new RegExp(`\\b${ime}\\b`), `${ime}: veja v prizor()`);
  for (const [ime, koda] of kode) {
    for (const mem of [false, true]) {
      const pB = kode[(koda * 7) % kode.length][1];
      const src = molekuleZa({ pA: koda, pB, mem, memVrsta: 0, atomi: true, vrsteAtomov: [0, 1, 9] });
      assert.equal((src.match(/\{/g) || []).length, (src.match(/\}/g) || []).length, `${ime}: oklepaji`);
      assert.match(src, new RegExp(`^#define K_PA ${koda}$`, "m"));
      const ostale = veje(src).join(" ");
      assert.ok(new RegExp(`\\b${ime}\\b`).test(ostale), `${ime}: veja ostane`);
      const imeB = kode.find((k) => k[1] === pB)[0];
      assert.equal(new RegExp(`\\b${imeB}\\b`).test(ostale), mem || imeB === ime, `${ime}: veja strani B le z membrano`);
      assert.ok(veje(src).length <= 2, `${ime}: največ dve veji`);
    }
  }
  const zA = molekuleZa({ pA: 2, pB: 2, mem: false, memVrsta: 4, atomi: true, vrsteAtomov: [0, 1, 9, 1] });
  assert.match(zA, /if \(a == A_VODA\)/);
  assert.match(zA, /else if \(a == A_HEM\)/);
  assert.doesNotMatch(zA, /a == A_APATIT|organska\(b, x \* 1\.4/, "vrste atomov, ki jih ni, ni v programu");
  assert.match(molekuleZa({ pA: 2, pB: 2, mem: false, memVrsta: 4, atomi: true, vrsteAtomov: [11] }), /^  \{ organska\(b, x \* 1\.4/m, "le smola: ostane splošna veja");
  assert.equal(kljucMolekul({ pA: 2, pB: 9, mem: false, memVrsta: 3, atomi: false, vrsteAtomov: [1] }), kljucMolekul({ pA: 2, pB: 5, mem: false, memVrsta: 0, atomi: false }));
  assert.notEqual(kljucMolekul({ pA: 2, pB: 9, mem: true, memVrsta: 0, atomi: true, vrsteAtomov: [1] }), kljucMolekul({ pA: 2, pB: 9, mem: true, memVrsta: 0, atomi: true, vrsteAtomov: [1, 9] }));
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

// j, 16. 11. 2026: »na racunalniku molekule se vedno niso izrisane«. Splošni program molekul (vseh 37 prizorov v eni
// verigi) se je na namizju prevajal ~20 s in risal ~65 µs na točko: pri 1920 × 1080 je bila po 90 s narisana šele
// četrtina sloja, ob vsakem premiku pa se je začel znova. Sloj molekul mora risati program, specializiran za pogled.
test("mikroskop: sloj molekul riše program za en pogled, ne splošnega s 37 prizori", async () => {
  const upo = fs.readFileSync(path.join(ROOT, "public", "mikroskop", "upodobi.js"), "utf8");
  assert.doesNotMatch(upo, /import \{[^}]*\bMOLEKULE\b[^}]*\} from "\.\/molekule\.js"/, "upodobi.js ne prevaja splošnega programa");
  assert.match(upo, /programVzporedno\(gl, molekuleZa\(/);
  const mod = await import("../public/mikroskop/molekule.js");
  assert.equal(typeof mod.molekuleZa, "function");
  const veje = (src) => [...src.matchAll(/^  (?:\} else )?if \(P == (.*)\) \{$/gm)].length;
  assert.ok(veje(mod.MOLEKULE) > 20);
  const kode = [...mod.MOLEKULE.matchAll(/^#define P_[A-Z0-9_]+ (\d+)$/gm)].map((m) => +m[1]);
  for (const pA of kode) assert.ok(veje(mod.molekuleZa({ pA, pB: kode[0], mem: true, memVrsta: 0, atomi: false })) <= 2, `prizor ${pA}`);
  // ko molekule povsem prekrijejo preparat (utež 1), se preparat v polni ločljivosti ne riše
  const ui = fs.readFileSync(path.join(ROOT, "public", "mikroskop", "mikroskop.js"), "utf8");
  assert.match(ui, /const rabiP = kljuc !== pKljuc && !skrit;/);
});
