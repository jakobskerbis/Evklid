// Poudarek izbranega dela (public/3d/poudarek.js, j 6. 11.): izbrani del v polni motnosti nad prosojnimi ostalimi,
// kopije materialov enkrat na model (preklop med deli ne klonira), izvirniki nazaj ob preklicu, smer pogleda z najmanj
// ovirami, del povsem v odrezanem delu prereza ostane viden.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { naloziThree } from "./fixtures/3d-modeli.js";
import { ustvariPoudarek, povsemOdrezan, najboljsaSmer, kandidatiSmeri, oviraZarki, DUH_ALFA, VRSTNI_RED } from "../public/3d/poudarek.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const THREE = await naloziThree();

function prizor() {
  const g = new THREE.Group();
  const deljen = new THREE.MeshStandardMaterial({ color: "#c04040" }); // isti material (tkivo) v dveh delih
  const a = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), deljen);
  const b = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), deljen);
  b.position.x = 0.5;
  const c = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: "#4080ff" }));
  c.position.y = 0.5;
  const crta = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial());
  const sij = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial());
  sij.userData.k3Sij = true;
  g.add(a, b, c, crta, sij);
  return { g, a, b, c, crta, sij, deljen };
}

test("poudarek: izbrani del spredaj, ostali prosojni brez globine, izvirniki nazaj", { skip: !THREE }, () => {
  const { g, a, b, c, crta, sij, deljen } = prizor();
  const izvC = c.material;
  const p = ustvariPoudarek(THREE);
  p.uporabi(g, new Set([a]), { barva: "#ff0000", gibanje: false });
  assert.notEqual(a.material, deljen);
  assert.notEqual(b.material, deljen);
  assert.notEqual(a.material, b.material, "isti izvirnik: izbrani dobi kopijo »spredaj«, drugi »duh«");
  assert.equal(a.material.transparent, true, "izbrani v vrsti prosojnih, za duhovi");
  assert.equal(a.material.depthWrite, true);
  assert.equal(a.material.opacity, 1, "izbrani v polni motnosti");
  assert.equal(a.renderOrder, VRSTNI_RED);
  for (const o of [b, c, crta]) {
    assert.equal(o.material.transparent, true);
    assert.equal(o.material.depthWrite, false, "duh ne piše globine");
    assert.equal(o.renderOrder, 0);
  }
  assert.equal(sij.material.transparent, false, "prekrivne mreže (sij, obris) ostanejo");
  assert.ok(Math.abs(p.uniforme.alfa.value - DUH_ALFA) < 1e-9, "brez gibanja takoj poln poudarek");
  assert.equal(p.izvirnik(b), deljen);

  // senčilnik duha razbarva in zmanjša alfo, kopija spredaj doda rob v barvi dela
  const sh = { uniforms: {}, fragmentShader: "#include <common>\nvoid main(){\n#include <opaque_fragment>\n}", vertexShader: "" };
  b.material.onBeforeCompile(sh, null);
  assert.match(sh.fragmentShader, /diffuseColor\.a \*= uK3Alfa;\s*#include <opaque_fragment>/);
  assert.equal(sh.uniforms.uK3Alfa, p.uniforme.alfa);
  const sh2 = { uniforms: {}, fragmentShader: "#include <common>\nvoid main(){\n#include <opaque_fragment>\n}", vertexShader: "" };
  a.material.onBeforeCompile(sh2, null);
  assert.match(sh2.fragmentShader, /uK3RobBarva/);
  assert.equal(p.uniforme.robBarva.value.getHexString(), "ff0000");
  assert.notEqual(a.material.customProgramCacheKey(), b.material.customProgramCacheKey());

  // preklop na drug del: brez novih kopij
  const n = p.steviloKopij;
  p.uporabi(g, new Set([c]), { gibanje: false });
  assert.equal(c.material.depthWrite, true);
  assert.equal(a.material.depthWrite, false, "prej izbrani je zdaj duh");
  assert.equal(p.steviloKopij, n + 1, "le nova kopija »spredaj« za material dela c");
  p.uporabi(g, new Set([a]), { gibanje: false });
  assert.equal(p.steviloKopij, n + 1, "ponovna izbira ne klonira");

  // preklic: izvirniki in vrstni red nazaj
  p.izklopi(false);
  assert.equal(a.material, deljen);
  assert.equal(b.material, deljen);
  assert.equal(c.material, izvC);
  assert.equal(a.renderOrder, 0);
  assert.equal(p.aktiven, false);
  p.pocisti();
  assert.equal(p.steviloKopij, 0);
});

test("poudarek: mehki prehod in kopije sledijo izvirniku", { skip: !THREE }, () => {
  const { g, a, b, deljen } = prizor();
  const p = ustvariPoudarek(THREE);
  p.uporabi(g, new Set([a]), { gibanje: true });
  assert.equal(p.uniforme.alfa.value, 1, "prehod se začne pri polni motnosti");
  p.korak(0.1);
  assert.ok(p.uniforme.alfa.value < 1 && p.uniforme.alfa.value > DUH_ALFA);
  for (let i = 0; i < 10; i++) p.korak(0.1);
  assert.ok(Math.abs(p.uniforme.alfa.value - DUH_ALFA) < 1e-9);
  deljen.opacity = 0.5; // model animira motnost
  p.korak(0.016);
  assert.equal(b.material.opacity, 0.5);
  p.izklopi(true);
  assert.notEqual(b.material, deljen, "med prehodom nazaj še kopija");
  for (let i = 0; i < 10; i++) p.korak(0.1);
  assert.equal(b.material, deljen, "po prehodu izvirnik");
  assert.equal(p.uniforme.alfa.value, 1);
});

test("poudarek: model zamenja material med izbiro, stare kopije se sprostijo", { skip: !THREE }, () => {
  const { g, a, b } = prizor();
  const p = ustvariPoudarek(THREE);
  p.uporabi(g, new Set([a]), { gibanje: false });
  const nov = new THREE.MeshStandardMaterial();
  b.material = nov; // npr. nova faza
  p.uporabi(g, new Set([a]), { gibanje: false });
  assert.equal(p.izvirnik(b), nov);
  p.izklopi(false);
  assert.equal(b.material, nov);
});

test("povsemOdrezan: škatla za ravnino prereza", { skip: !THREE }, () => {
  const box = new THREE.Box3(new THREE.Vector3(1, 0, 0), new THREE.Vector3(2, 1, 1));
  const r = [new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0)]; // obdrži x ≤ 0
  assert.equal(povsemOdrezan(THREE, box, r), true);
  assert.equal(povsemOdrezan(THREE, new THREE.Box3(new THREE.Vector3(-1, 0, 0), new THREE.Vector3(1, 1, 1)), r), false, "prerezan del ostane prerezan");
  assert.equal(povsemOdrezan(THREE, box, []), false);
  // presek (četrtina): odrezano le, kar je za obema ravninama
  const q = [new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0), new THREE.Plane(new THREE.Vector3(0, -1, 0), 0)];
  assert.equal(povsemOdrezan(THREE, new THREE.Box3(new THREE.Vector3(1, 1, 0), new THREE.Vector3(2, 2, 1)), q, true), true);
  assert.equal(povsemOdrezan(THREE, new THREE.Box3(new THREE.Vector3(1, -2, 0), new THREE.Vector3(2, -1, 1)), q, true), false);
});

test("najboljsaSmer: pogled s strani brez ovir (npr. pljučne vene zadaj)", { skip: !THREE }, () => {
  // del v izhodišču, spredaj (+z) in levo (−x) debela stena, zadaj prosto
  const g = new THREE.Group();
  for (const [x, z, sx, sz] of [[0, 0.5, 2, 0.1], [-0.5, 0, 0.1, 2], [0.5, 0, 0.1, 2], [0, 0, 2, 0.1]].slice(0, 3)) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(sx, 2, sz), new THREE.MeshBasicMaterial());
    m.position.set(x, 0, z);
    g.add(m);
  }
  const strop = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 2), new THREE.MeshBasicMaterial());
  strop.position.y = 0.6;
  const tla = strop.clone();
  tla.position.y = -0.6;
  g.add(strop, tla);
  g.updateMatrixWorld(true);
  const s = najboljsaSmer(THREE, {
    tocke: [new THREE.Vector3()],
    trenutna: new THREE.Vector3(0, 0, 1),
    kandidati: kandidatiSmeri(THREE),
    ovire: oviraZarki(THREE, g.children),
  });
  assert.ok(s.z < -0.9, `pogled od zadaj, dobil ${s.toArray().map((x) => x.toFixed(2))}`);
  // brez ovir ostane trenutna smer
  const s2 = najboljsaSmer(THREE, { tocke: [new THREE.Vector3()], trenutna: new THREE.Vector3(1, 0, 1), kandidati: kandidatiSmeri(THREE), ovire: () => 0 });
  assert.ok(s2.distanceTo(new THREE.Vector3(1, 0, 1).normalize()) < 1e-9);
  // pokončno (atlas): smeri skoraj vodoravne
  for (const k of kandidatiSmeri(THREE, { pokoncno: true })) assert.ok(Math.abs(k.y) < 0.3);
});

test("pregledovalnik in atlas: zmanjšano gibanje brez animacije, izbrani del pred prosojnimi", () => {
  const pr = fs.readFileSync(path.join(ROOT, "public/3d/pregledovalnik.js"), "utf8");
  assert.match(pr, /gibanje: kit\.gibanje/);
  assert.match(pr, /poudarek\.izklopi\(kit\?\.gibanje\)/);
  assert.match(pr, /trajanje: TRAJANJE_IZBIRE/, "kit.poleti brez gibanja skoči takoj");
  assert.match(pr, /vsi\.find\(\(h\) => delZa\(h\)\?\.id === izbran\)/, "tap na izbrani del za prosojnim delom prekliče izbiro");
  const at = fs.readFileSync(path.join(ROOT, "public/3d/atlas.js"), "utf8");
  assert.match(at, /if \(!kit\.gibanje\) duh\.p = duh\.cilj;/);
  assert.match(at, /smer: smerZaDel\(d\)/);
  const tk = fs.readFileSync(path.join(ROOT, "public/3d/tkiva.js"), "utf8");
  assert.match(tk, /uniform float uSiv;/);
});
