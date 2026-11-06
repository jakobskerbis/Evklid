// Menjava stanja z odprtim delom (j, 6. 11.): isti del po skupnem ključu (public/3d/isti-del.js), okno z opisom novega
// stanja ali obvestilo ob modelu, poudarek in kader posodobljena (pregledovalnik.js obMenjavi). Brskalniški preizkus vseh
// vrst pregledovalnikov: scripts/preveri-3d-menjava.cjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { naloziThree } from "./fixtures/3d-modeli.js";
import { najdiIstiDel, kljuciDela, obvestiloManjka } from "../public/3d/isti-del.js";
import * as K from "../public/3d/modeli/kemija/kristali.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const THREE = await naloziThree();
const zgradi = async (pot) => {
  const mod = await import(`../public/3d/modeli/${pot}.js`);
  return { info: mod.info, m: await mod.zgradi(THREE, { kakovost: "nizka", t: (k) => k }) };
};

test("isti del: enak id, sinonimi in latinsko ime; prikazno ime ne šteje", () => {
  const seznam = [{ id: "mitohondriji", ime: "Mitohondriji" }, { id: "x", ime: "Jedro" }, { id: "y", ime: "Y", la: "Nucleolus" }, { id: "stena", ime: "Stena" }];
  assert.equal(najdiIstiDel(seznam, { id: "mitohondrij" })?.id, "mitohondriji");
  assert.equal(najdiIstiDel(seznam, { id: "celicna-stena" })?.id, "stena");
  assert.equal(najdiIstiDel(seznam, { id: "jedrce", la: "nucleolus" })?.id, "y");
  assert.equal(najdiIstiDel(seznam, { id: "jedro", ime: "Jedro" }), null, "ujemanje ne sme biti po prikaznem imenu");
  assert.equal(najdiIstiDel([{ id: "a", kljuci: ["jedro"] }], { id: "jedra" })?.id, "a", "kljuci modela in sinonimi");
  assert.ok(kljuciDela({ id: "jedro" }).has("jedra"));
  assert.equal(najdiIstiDel(seznam, null), null);
});

test("isti del: jedro iz živalske v rastlinsko celico ostane, opis je rastlinski", { skip: !THREE }, async () => {
  const z = await zgradi("celice/zivalska"), r = await zgradi("celice/rastlinska");
  const jz = z.m.deli.find((d) => d.id === "jedro");
  const jr = najdiIstiDel(r.m.deli, jz);
  assert.equal(jr?.id, "jedro");
  assert.notEqual(jr.opis, jz.opis, "okno mora pokazati opis jedra rastlinske celice");
  assert.equal(jr, r.m.deli.find((d) => d.id === "jedro"));
  z.m.dispose?.(); r.m.dispose?.();
});

test("isti del: celica brez jedra (eritrocit, bakterija) → »Ta celica nima jedra.«, virus → splošno obvestilo", { skip: !THREE }, async () => {
  const jz = (await zgradi("celice/zivalska")).m.deli.find((d) => d.id === "jedro");
  for (const pot of ["celice/eritrocit", "celice/bakterija"]) {
    const { info, m } = await zgradi(pot);
    assert.equal(najdiIstiDel(m.deli, jz), null, pot);
    assert.deepEqual(obvestiloManjka(jz, info), ["a3.noNucleus", {}], pot);
    m.dispose?.();
  }
  const { info, m } = await zgradi("celice/virus-hiv");
  assert.equal(najdiIstiDel(m.deli, jz), null);
  assert.deepEqual(obvestiloManjka(jz, info), ["a3.partMissing", { ime: "Jedro" }]);
  m.dispose?.();
});

test("obvestili v vseh 33 jezikih, {ime} povsod", () => {
  const slSrc = fs.readFileSync(path.join(ROOT, "public/i18n/sl.js"), "utf8");
  assert.match(slSrc, /"a3\.noNucleus": "Ta celica nima jedra\."/);
  assert.match(slSrc, /"a3\.partMissing": "Ta model nima dela ‘\{ime\}’\."/);
  const dir = path.join(ROOT, "public/i18n/ui");
  const jeziki = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  assert.equal(jeziki.length, 32);
  for (const f of jeziki) {
    const j = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    assert.ok(j["a3.noNucleus"]?.length > 3, `${f}: a3.noNucleus`);
    assert.ok(j["a3.partMissing"]?.includes("{ime}"), `${f}: a3.partMissing`);
  }
});

test("kristali: ob menjavi kristala ima osnovna celica opis novega kristala (število delcev pravilno)", { skip: !THREE }, () => {
  const m = K.zgradi(THREE, { kakovost: "nizka" });
  const nad = (id) => m.nadzor.find((x) => x.id === id);
  const PRICAKUJ = {
    nacl: [4, "so 4 ioni Na⁺ in 4 ioni Cl⁻"], cscl: [1, "sta en ion Cs⁺ in en ion Cl⁻"], diamant: [8, "je 8 atomov C"], grafit: [4, "so 4 atomi C"],
    bcc: [2, "sta 2 atoma Fe"], fcc: [4, "so 4 atomi Cu"], hcp: [2, "sta 2 atoma Mg"], led: [4, "so 4 molekule H₂O"],
  };
  let prej = m.deli.find((d) => d.id === "celica");
  for (const M of [...K.MREZE.slice(1), K.MREZE[0]]) {
    nad("mreza").ob(M.id);
    const d = najdiIstiDel(m.deli, prej);
    assert.equal(d?.id, "celica", M.id);
    const [n, besedilo] = PRICAKUJ[M.id];
    assert.equal(K.enoteVCelici(M), n, M.id);
    assert.ok(d.opis.includes(`V njej ${besedilo}`), `${M.id}: ${d.opis}`);
    assert.notEqual(d.meshes[0], prej.meshes[0], `${M.id}: poudarek mora iti na nove mreže`);
    prej = d;
  }
  // ionska kristala: oba iona štejeta enako (NaCl 4 + 4, CsCl 1 + 1)
  for (const id of ["nacl", "cscl"]) {
    const st = K.stetjeVCelici(K.MREZE.find((x) => x.id === id));
    assert.equal(st.length, 2);
    assert.equal(st[0].vsota, st[1].vsota, id);
  }
  // hcp: primitivna celica 2, šesterokotna prizma (3 celice) 6
  const hcp = K.MREZE.find((x) => x.id === "hcp");
  assert.match(hcp.vCelici, /primitivna celica/);
  assert.match(hcp.vCelici, /šesterokotni prizmi.*6 atomov Mg/);
  assert.equal(3 * K.enoteVCelici(hcp), 6);
  // del, ki ga novi kristal nima (atomi Fe pri ledu), se ne ujema
  nad("mreza").ob("bcc");
  const fe = m.deli.find((d) => d.id === "fe");
  nad("mreza").ob("led");
  assert.equal(najdiIstiDel(m.deli, fe), null);
  m.dispose();
});

test("pregledovalnik: ena skupna funkcija ob menjavi, kader po izbiri/stikalu/gumbu, prenos dela med modeli", () => {
  const src = fs.readFileSync(path.join(ROOT, "public/3d/pregledovalnik.js"), "utf8");
  const deli = src.slice(src.indexOf("function deli()"), src.indexOf("const merilo"));
  assert.match(deli, /obMenjavi\(seznam, prejDel\)/, "deli() kliče obMenjavi s prejšnjim delom");
  assert.ok(!/izberi\(null, \{ leti: false \}\);\s*\n\s*else if \(izbran\)/.test(deli), "stari zapis brez osvežitve okna");
  assert.match(src, /c\.tip !== "drsnik"[\s\S]{0,120}poleti\(\.\.\.kadrModela\(\)/, "menjava stanja znova kadrira cel model");
  assert.match(src, /opts\.prenos/);
  const stran = fs.readFileSync(path.join(ROOT, "public/3d/stran.js"), "utf8");
  assert.match(stran, /izbraniDel\?\.\(\)/);
  assert.match(stran, /prenos \}\)/);
});
