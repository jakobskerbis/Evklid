import test from "node:test";
import assert from "node:assert/strict";
import { preveriPodrocje, IMA_THREE, izmeri, MEJE } from "./3d-preveri-gradnik.js";

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

// Telesa (j, 4. 11.): ob spremembi mer se podlaga in koordinatni sistem prilagodita (številke kažejo prave mere),
// obris začetne velikosti (»hologram«) ostane viden, tudi ko je večji od telesa, kamera pa se mehko umakne ali približa.
test("telesa: axes follow the sliders, the start-size hologram stays visible, the camera eases to the new scale", { skip: IMA_THREE ? false : "three ni nameščen" }, async () => {
  await preveriPodrocje("matematika"); // DOM stubs for canvas
  const THREE = await import("three");
  const { zgradi } = await import("../public/3d/modeli/matematika/telesa.js");
  const r = zgradi(THREE, { kakovost: "nizka", gibanje: false, zacetek: {} });
  const a = r.nadzor.find((c) => c.id === "a"), telo = r.nadzor.find((c) => c.id === "telo");
  const obris = r.group.getObjectByName("obris-zacetka"), osi = r.group.getObjectByName("koordinatne-osi");
  const opis = () => r.deli.find((d) => d.id === "osi").opis;
  const m0 = r.merilo().oznaka;
  assert.equal(obris.visible, false, "no outline before a change");
  assert.ok(osi.count > 3, "axes with tick marks");
  assert.match(opis(), /x = 4,0\scm/);
  const fits = () => izmeri(r.group).polmer <= MEJE.polmer;
  a.vrednost = 6; a.ob(6);
  assert.notEqual(r.merilo().oznaka, m0, "a bigger cube rescales the grid");
  assert.match(opis(), /x = 6,0\scm/, "axis values follow the slider");
  assert.match(r.povzetek(), /V = 216,0/, "volume shown on the stage");
  assert.equal(obris.visible, true, "hologram of the start size is shown");
  assert.ok(fits());
  a.vrednost = 2; a.ob(2);
  assert.equal(obris.visible, true, "hologram stays visible when it is bigger than the solid");
  assert.equal(r.merilo().oznaka, m0, "the bigger hologram sets the scale, so the solid looks smaller");
  assert.ok(fits());
  telo.ob("valj");
  assert.equal(obris.visible, false, "a new body starts without an outline");

  // with motion: the scene first keeps the old scale (the solid visibly grows), then eases back to 1
  const g = zgradi(THREE, { kakovost: "nizka", gibanje: true, zacetek: {} });
  const ga = g.nadzor.find((c) => c.id === "a");
  ga.vrednost = 8; ga.ob(8);
  assert.ok(g.group.scale.x > 1.2, "solid looks bigger right after the change");
  assert.equal(g.korakBrezGumba, true, "no play button for this transition");
  let t = 0; while (g.korak(t, 1 / 30) !== false && t < 10) t += 1 / 30;
  assert.ok(t < 5, "the transition ends");
  assert.equal(g.group.scale.x, 1);
});
