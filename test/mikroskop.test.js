// Mikroskop (docs/mikroskop.md): optika, seznam preparatov, barvanja, preslikava 3D sveta → preparat in prevodi.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  OBJEKTIVI, MIN_M, MAX_M, SVETLOBNI_MAX, vidnoPolje, locljivost, globinskaOstrina, zamegljenost, raven, utezModela, merilce,
  oznakaDolzine, oznakaPovecave,
} from "../public/mikroskop/optika.js";
import { BARVANJA, matrikaBarvil } from "../public/mikroskop/barvila.js";
import { PREPARATI, SKUPINE, ZACETNI, naloziPreparat } from "../public/mikroskop/preparati/index.js";
import { preparatAtlasa, preparatModela, MODELI_Z_MIKROSKOPOM } from "../public/mikroskop/mapa.js";
import { fragmentPreparata } from "../public/mikroskop/glsl.js";
import { povecava, ZACETNO } from "../public/mikroskop/pogled.js";
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
    const frag = fragmentPreparata(p.glsl);
    assert.match(frag, /^#version 300 es/);
    // oklepaji v senčilniku so uravnoteženi (napaka prevajanja bi sicer počakala na brskalnik)
    for (const [a, b] of [["{", "}"], ["(", ")"]]) assert.equal(frag.split(a).length, frag.split(b).length, `${e.id}: ${a}${b}`);
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

test("mikroskop: prevodi gumbov v vseh jezikih in vstop iz lekcij", () => {
  const kljuci = ["mk.title", "mk.open", "mk.start", "mk.hub"];
  for (const k of kljuci) assert.ok(sl[k], `sl ${k}`);
  const dir = path.join(ROOT, "public", "i18n", "ui");
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    for (const k of kljuci) assert.ok(d[k], `${f}: ${k}`);
  }
  const katalog = fs.readFileSync(path.join(ROOT, "public", "sim", "katalog.js"), "utf8");
  assert.ok((katalog.match(/\["mikroskop",/g) || []).length >= 4);
  const index = fs.readFileSync(path.join(ROOT, "public", "sim", "index.js"), "utf8");
  assert.match(index, /mikroskop: \["\.\.\/mikroskop\/mikroskop\.js", "simMikroskop"\]/);
});
