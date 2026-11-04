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

// Telesa: pri spreminjanju mer merilo ostane (telo vidno zraste ali se skrči), zraven je obris začetne velikosti.
test("telesa: size change is visible (scale kept) and the start-size outline shows and fits", { skip: IMA_THREE ? false : "three ni nameščen" }, async () => {
  await preveriPodrocje("matematika"); // DOM stubs for canvas
  const THREE = await import("three");
  const { zgradi } = await import("../public/3d/modeli/matematika/telesa.js");
  const r = zgradi(THREE, { kakovost: "nizka", gibanje: false, zacetek: {} });
  const a = r.nadzor.find((c) => c.id === "a"), telo = r.nadzor.find((c) => c.id === "telo");
  const obris = r.group.getObjectByName("obris-zacetka");
  const m0 = r.merilo().oznaka;
  assert.equal(obris.visible, false, "no outline before a change");
  a.ob(3);
  assert.equal(r.merilo().oznaka, m0, "smaller cube keeps the scale, so it looks smaller");
  assert.equal(obris.visible, true, "outline of the start size is shown");
  a.ob(10);
  assert.notEqual(r.merilo().oznaka, m0, "a cube that outgrows the scene rescales");
  const meja = new THREE.Box3().setFromObject(r.group).getBoundingSphere(new THREE.Sphere());
  assert.ok(meja.center.length() + meja.radius < 1.6, "still fits");
  telo.ob("valj");
  assert.equal(obris.visible, false, "a new body starts without an outline");
});
