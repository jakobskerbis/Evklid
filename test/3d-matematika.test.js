import test from "node:test";
import assert from "node:assert/strict";
import { preveriPodrocje, IMA_THREE } from "./3d-preveri-gradnik.js";

// Every matematika model follows the builder contract (docs/3d.md): info, parts with ime + opis,
// controls at every extreme, triangle and draw-call budgets, fits the unit sphere.
test("3D matematika: gradniki po pogodbi in v proračunu", { skip: IMA_THREE ? false : "three ni nameščen" }, async () => {
  const { seznam, izid } = await preveriPodrocje("matematika");
  assert.ok(seznam.length > 0);
  assert.equal(new Set(seznam.map((e) => e.id)).size, seznam.length, "id-ji niso enolični");
  for (const { e, mod, napake } of izid) {
    assert.deepEqual(napake, [], e.id);
    assert.equal(mod.info.podrocje, "matematika", e.id);
    assert.equal(mod.info.naslov, e.naslov, e.id);
    assert.equal(mod.info.predmet, e.predmet, e.id);
  }
});

// Telesa (j, 4. 11.): ob spremembi mer telo na zaslonu obdrži velikost, podlaga in koordinatni sistem pa se prilagodita,
// zato se spremeni merilo in številke na oseh kažejo prave mere; obris začetne velikosti je viden, ko ostane v prizoru.
test("telesa: body keeps its screen size, grid and axes rescale, start-size outline shows when it fits", { skip: IMA_THREE ? false : "three ni nameščen" }, async () => {
  await preveriPodrocje("matematika"); // DOM stubs for canvas
  const THREE = await import("three");
  const { zgradi } = await import("../public/3d/modeli/matematika/telesa.js");
  const r = zgradi(THREE, { kakovost: "nizka", gibanje: false, zacetek: {} });
  const a = r.nadzor.find((c) => c.id === "a"), telo = r.nadzor.find((c) => c.id === "telo");
  const obris = r.group.getObjectByName("obris-zacetka"), osi = r.group.getObjectByName("koordinatne-osi");
  const velikost = () => {
    r.group.updateMatrixWorld(true);
    const p = osi.parent; // skupina »telo« v cm
    return p.scale.x * Math.hypot(1, 1, 1) * r.nadzor.find((c) => c.id === "a").vrednost;
  };
  const m0 = r.merilo().oznaka, v0 = velikost();
  assert.equal(obris.visible, false, "no outline before a change");
  assert.ok(osi.count > 3, "axes with tick marks");
  assert.ok(r.deli.some((d) => d.id === "osi"), "coordinate system is a part with a description");
  assert.match(r.deli.find((d) => d.id === "osi").opis, /x = 4,0\scm/);
  for (const v of [6, 3]) {
    a.vrednost = v; a.ob(v);
    assert.notEqual(r.merilo().oznaka, m0, "grid rescales");
    assert.ok(Math.abs(velikost() - v0) < 1e-6, "cube keeps its size on screen");
    assert.match(r.deli.find((d) => d.id === "osi").opis, new RegExp(`x = ${v},0\\scm`), "axis values follow the slider");
    assert.match(r.povzetek(), new RegExp(`V = ${v ** 3},0`), "volume shown on the stage");
  }
  assert.equal(obris.visible, false, "outline of a bigger start size would leave the scene: hidden");
  a.vrednost = 6; a.ob(6);
  assert.equal(obris.visible, true, "outline of the smaller start size is shown");
  const meja = new THREE.Box3().setFromObject(r.group).getBoundingSphere(new THREE.Sphere());
  assert.ok(meja.center.length() + meja.radius < 1.6, "still fits");
  telo.ob("valj");
  assert.equal(obris.visible, false, "a new body starts without an outline");
});
