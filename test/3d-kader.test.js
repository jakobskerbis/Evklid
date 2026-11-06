// Kadriranje 3D modelov (public/3d/kader.js, docs/3d.md »Okno dela in kader«): obseg šteje le, kar kamera res vidi,
// vKadru prepozna model, ki sega čez rob. Okno dela ni nikoli čez model: pregledovalnik nima več točk ali oznak na odru.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { naloziThree } from "./fixtures/3d-modeli.js";
import { obsegVidnega, vKadru, kroglaNaZaslonu, vidnaKrogla } from "../public/3d/kader.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const THREE = await naloziThree();

test("obsegVidnega: skrite veje, nevidni materiali, sij in sprite ne štejejo", { skip: !THREE }, () => {
  const g = new THREE.Group();
  const kocka = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial());
  const skrita = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial());
  skrita.position.x = 10;
  const veja = new THREE.Group();
  veja.visible = false;
  veja.add(skrita);
  const nevidna = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ visible: false }));
  nevidna.position.y = 10;
  const sij = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial());
  sij.position.z = 10;
  sij.userData.k3Sij = true;
  const napis = new THREE.Sprite(new THREE.SpriteMaterial());
  napis.position.x = -10;
  g.add(kocka, veja, nevidna, sij, napis);
  const b = obsegVidnega(THREE, g);
  assert.deepEqual(b.min.toArray(), [-0.5, -0.5, -0.5]);
  assert.deepEqual(b.max.toArray(), [0.5, 0.5, 0.5]);
  // InstancedMesh: obseg vseh primerkov
  const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial(), 2);
  inst.setMatrixAt(0, new THREE.Matrix4().makeTranslation(3, 0, 0));
  inst.setMatrixAt(1, new THREE.Matrix4().makeTranslation(-3, 0, 0));
  const g2 = new THREE.Group();
  g2.add(inst);
  assert.equal(obsegVidnega(THREE, g2).max.x, 3.5);
});

test("vKadru: krogla na sredini da, ob robu ali za kamero ne", { skip: !THREE }, () => {
  const kam = new THREE.PerspectiveCamera(40, 390 / 500, 0.01, 100);
  kam.position.set(0, 0, 5);
  kam.lookAt(0, 0, 0);
  const o = new THREE.Vector3();
  assert.ok(vKadru(THREE, kam, o, 1));
  assert.ok(!vKadru(THREE, kam, new THREE.Vector3(2, 0, 0), 1), "premaknjena vstran");
  assert.ok(!vKadru(THREE, kam, o, 3), "prevelika");
  assert.ok(!vKadru(THREE, kam, new THREE.Vector3(0, 0, 10), 1), "za kamero");
  const k = kroglaNaZaslonu(THREE, kam, o, 1);
  assert.ok(Math.abs(k.x) < 1e-9 && k.rx > k.ry, "pokončen zaslon: vodoravno je krogla relativno širša");
});

test("vidnaKrogla: povsem izven kadra le, ko krogla ne seka vidnega polja", { skip: !THREE }, () => {
  const kam = new THREE.PerspectiveCamera(40, 390 / 500, 0.01, 100);
  kam.position.set(0, 0, 5);
  kam.lookAt(0, 0, 0);
  kam.updateProjectionMatrix();
  assert.ok(vidnaKrogla(THREE, kam, new THREE.Vector3(), 1));
  assert.ok(vidnaKrogla(THREE, kam, new THREE.Vector3(), 30), "kamera v krogli (močno povečan model) je vidna");
  assert.ok(vidnaKrogla(THREE, kam, new THREE.Vector3(2.2, 0, 0), 1), "delno čez rob je še vidna");
  assert.ok(!vidnaKrogla(THREE, kam, new THREE.Vector3(8, 0, 0), 1), "povsem ob strani");
  assert.ok(!vidnaKrogla(THREE, kam, new THREE.Vector3(0, 0, 10), 1), "za kamero");
});

test("pregledovalnik: kamera ne oddalji kadra, ki ga je povečal uporabnik; kopije materialov se sprostijo", () => {
  const src = fs.readFileSync(path.join(ROOT, "public/3d/pregledovalnik.js"), "utf8");
  assert.match(src, /uporabnikovKader\(\)/, "izbira upošteva uporabnikov kader");
  const unici = src.slice(src.indexOf("unici() {"));
  assert.match(unici, /ustaviNamigSij\(\);\s*narisiObris\(null\);\s*poudarek\.pocisti\(\)/, "unici pospravi sij, obris in kopije");
});

test("pregledovalnik: brez barvnih točk in oznak čez model, okno dela v plošči", () => {
  const src = fs.readFileSync(path.join(ROOT, "public/3d/pregledovalnik.js"), "utf8");
  assert.ok(!/kit\.(nastaviTocke|pokaziOznako|izbranaTocka)\(/.test(src), "pregledovalnik ne sme risati točk ali oznak na odru");
  assert.match(src, /spodaj\.append\(infoEl/, "okno dela je v plošči ob odru");
  const css = fs.readFileSync(path.join(ROOT, "public/3d/3d.css"), "utf8");
  assert.ok(!/\.k3-oznaka\s*\{/.test(css) && !/\.k3-tocka\s*\{/.test(css), "ni več sloga za oznake čez model");
});
