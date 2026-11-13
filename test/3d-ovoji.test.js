// Ovoji izbranega dela (public/3d/ovoji.js) in faze drsnikov, ki morajo ustrezati besedilu (j, 13. 11. 2026:
// »Popravi vse take hrošče«): pri bakteriofagu T4 z izbrano glavo je DNK med vbrizgavanjem izginila, ker je veljala
// za ovoj glave; pri kvasovki je v vratu brsta ostala luknja.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mrezeOvojev } from "../public/3d/ovoji.js";
import { naloziThree } from "./fixtures/3d-modeli.js";

const THREE = await naloziThree();
const skip = THREE ? false : "three ni nameščen";

const del = (id, ...meshes) => ({ id, meshes });
const skrijeId = (deli, d, group) => {
  const m = new Set(mrezeOvojev(THREE, deli, d, { group }));
  return deli.filter((p) => p.meshes.some((x) => m.has(x))).map((p) => p.id);
};

test("ovoji: lupina okoli izbranega se skrije, vsebina znotraj izbranega pa ne", { skip }, () => {
  const g = new THREE.Group();
  const krogla = (r, x = 0, y = 0) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })); m.position.set(x, y, 0); g.add(m); return m; };
  // celica: membrana okoli jedra
  const membrana = del("membrana", krogla(1)), jedro = del("jedro", krogla(0.3));
  g.updateMatrixWorld(true);
  assert.deepEqual(skrijeId([membrana, jedro], jedro, g), ["membrana"], "membrana obdaja jedro");
  assert.deepEqual(skrijeId([membrana, jedro], membrana, g), [], "jedro ni ovoj membrane");

  // glava virusa z DNK: del DNK je že daleč stran (v bakteriji), zato je okvir DNK večji od glave
  const h = new THREE.Group();
  const k2 = (r, y) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), new THREE.MeshBasicMaterial()); m.position.y = y; h.add(m); return m; };
  const glava = del("glava", k2(0.5, 0.6)), dnk = del("dnk", k2(0.35, 0.6), k2(0.3, -0.8));
  h.updateMatrixWorld(true);
  assert.deepEqual(skrijeId([glava, dnk], glava, h), [], "DNK v glavi ni ovoj glave");
  assert.deepEqual(skrijeId([glava, dnk], dnk, h), [], "glava ne obdaja vse DNK");
});

const t4 = THREE ? await import("../public/3d/modeli/celice/virus-t4.js") : null;
const kv = THREE ? await import("../public/3d/modeli/celice/kvasovka.js") : null;

test("bakteriofag T4: z izbrano glavo DNK med vbrizgavanjem ostane vidna", { skip }, () => {
  for (const kakovost of ["visoka", "nizka"]) {
    const M = t4.zgradi(THREE, { kakovost });
    const vb = M.nadzor.find((c) => c.id === "vbrizgavanje");
    for (let v = 0; v <= 1.0001; v += 0.05) {
      vb.ob(v);
      M.group.updateMatrixWorld(true);
      const glava = M.deli.find((d) => d.id === "glava");
      assert.ok(!skrijeId(M.deli, glava, M.group).includes("dnk"), `${kakovost} v=${v.toFixed(2)}: DNK ne sme biti »ovoj« glave`);
    }
    vb.ob(0.1);
    M.group.updateMatrixWorld(true);
    assert.ok(skrijeId(M.deli, M.deli.find((d) => d.id === "dnk"), M.group).includes("glava"), "glava obdaja DNK v njej");
  }
});

test("bakteriofag T4: slika sledi fazi (plašč se krči, DNK gre iz glave skozi cevko v bakterijo)", { skip }, () => {
  const M = t4.zgradi(THREE, { kakovost: "visoka" });
  const vb = M.nadzor.find((c) => c.id === "vbrizgavanje"), faza = M.nadzor.find((c) => c.id === "faza");
  const [glavaDnk, , cevDnk, celDnk] = M.deli.find((d) => d.id === "dnk").meshes;
  const plasc = M.deli.find((d) => d.id === "plasc").meshes[0];
  const steje = (m) => (m.visible ? Math.min(m.geometry.index.count, m.geometry.drawRange.count) : 0);
  const dolzina = () => { const b = new THREE.Box3(); const mm = new THREE.Matrix4(), p = new THREE.Vector3(); for (let i = 0; i < plasc.count; i++) { plasc.getMatrixAt(i, mm); b.expandByPoint(p.setFromMatrixPosition(mm)); } return b.max.y - b.min.y; };
  let prej = null;
  for (let k = 0; k <= 100; k++) {
    const v = k / 100;
    vb.ob(v);
    const s = { glava: steje(glavaDnk), cev: steje(cevDnk), cel: steje(celDnk), L: dolzina(), f: faza.vrednost() };
    const vidna = s.glava + s.cev + s.cel > 0;
    assert.ok(vidna, `v=${v}: DNK mora biti nekje vidna`);
    if (prej) {
      assert.ok(s.glava <= prej.glava, `v=${v}: glava se ne polni nazaj`);
      assert.ok(s.cel >= prej.cel, `v=${v}: DNK v bakteriji ne izginja`);
      assert.ok(s.L <= prej.L + 1e-9, `v=${v}: plašč se ne podaljšuje`);
    }
    if (/krči/.test(s.f)) assert.ok(v === 0 || s.L < dolzina.zacetna, `v=${v}: »krči« – plašč mora biti krajši kot na začetku`);
    if (v === 0) dolzina.zacetna = s.L;
    if (/potuje/.test(s.f)) {
      assert.ok(s.L < dolzina.zacetna * 0.45, `v=${v}: DNK potuje šele, ko je plašč skrčen`);
      assert.ok(s.cev > 0 || (s.glava > 0 && s.cel > 0), `v=${v}: med potovanjem je DNK v cevki ali na obeh straneh`);
    }
    if (/Vsa DNK je v bakteriji/.test(s.f)) assert.ok(s.glava === 0 && s.cev === 0 && s.cel > 0, `v=${v}: »vsa DNK v bakteriji«`);
    prej = s;
  }
  vb.ob(0.83);
  assert.ok(steje(glavaDnk) > 0 && steje(cevDnk) > 0 && steje(celDnk) > 0, "pri 0,83 je DNK v glavi, v cevki in v bakteriji");
});

test("kvasovka: vrat brsta je brez luknje, na koncu ga zapre pregrada", { skip }, () => {
  for (const kakovost of ["visoka", "nizka"]) {
    const M = kv.zgradi(THREE, { kakovost });
    const br = M.nadzor.find((c) => c.id === "brstenje"), faza = M.nadzor.find((c) => c.id === "faza");
    const [mCit, bCit, ovr] = M.deli.find((d) => d.id === "citoplazma").meshes;
    const a = new THREE.Vector3(), b = new THREE.Vector3();
    for (const v of [0.1, 0.3, 0.6, 0.9, 1]) {
      br.ob(v);
      assert.ok(ovr.visible, `${kakovost} ${v}: notranjost vratu`);
      // trak se drži notranjega roba matične celice (zadnja vrsta) in brsta (prva vrsta)
      const o = ovr.geometry.attributes.position, m = mCit.geometry.attributes.position, c = bCit.geometry.attributes.position;
      const nK = o.count / 2 - 1, zadnja = m.count - (nK + 1);
      for (let j = 0; j <= nK; j += Math.ceil(nK / 8)) {
        assert.ok(a.fromBufferAttribute(o, j).distanceTo(b.fromBufferAttribute(m, zadnja + j)) < 1e-5, `${kakovost} ${v}: rob matične celice ${j}`);
        assert.ok(a.fromBufferAttribute(o, nK + 1 + j).distanceTo(b.fromBufferAttribute(c, j)) < 1e-5, `${kakovost} ${v}: rob brsta ${j}`);
      }
    }
    br.ob(0.5);
    assert.ok(!M.deli.some((d) => d.id === "septum"), "pregrade med rastjo brsta ni");
    br.ob(1);
    assert.ok(M.deli.some((d) => d.id === "septum"), "na koncu pregrada zapre vrat");
    assert.match(faza.vrednost(), /vrat je zaprt/);
    br.ob(0.95);
    assert.match(faza.vrednost(), /pregrado/);
  }
});
