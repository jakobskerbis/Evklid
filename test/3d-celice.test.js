// 3D celice: every builder in public/3d/modeli/celice follows the contract in docs/3d.md
// (info, zgradi, parts with ime + opis, unit sphere, triangle and draw-call budgets).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "3d", "modeli", "celice");
let THREE = null;
try { THREE = await import("three"); } catch { /* three arrives with the 3D kit */ }
const skip = THREE ? false : "three ni nameščen";

const MEJE = { visoka: 350000, nizka: 60000 };
const KLICI = 60;

// Draw calls and triangles the way the renderer counts them for visible objects.
function stej(group) {
  let tri = 0, klici = 0;
  group.updateMatrixWorld(true);
  group.traverseVisible((o) => {
    if (!o.isMesh && !o.isLine && !o.isPoints) return;
    const g = o.geometry;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    const skupine = Array.isArray(o.material) && g.groups.length ? g.groups.length : 1;
    const n = o.isInstancedMesh ? o.count : 1;
    if (n === 0) return;
    // three draws transparent double-sided materials in two passes
    klici += skupine * (mats.some((m) => m && m.transparent && m.side === THREE.DoubleSide && !m.forceSinglePass) ? 2 : 1);
    if (o.isMesh) {
      const idx = g.index ? g.index.count : g.attributes.position.count;
      const range = Math.min(idx, g.drawRange.count);
      tri += (range / 3) * n;
    }
  });
  return { tri: Math.round(tri), klici };
}

function polmer(group) {
  const box = new THREE.Box3().setFromObject(group, true);
  const c = box.getCenter(new THREE.Vector3());
  let r = 0;
  const v = new THREE.Vector3();
  group.updateMatrixWorld(true);
  group.traverseVisible((o) => {
    if (!o.isMesh || o.isInstancedMesh) return;
    const pos = o.geometry.attributes.position;
    const step = Math.max(1, Math.floor(pos.count / 400));
    for (let i = 0; i < pos.count; i += step) {
      v.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld);
      r = Math.max(r, v.length());
    }
  });
  return { r, c };
}

function preveriDele(f, M) {
  assert.ok(Array.isArray(M.deli) && M.deli.length >= 3, "vsaj 3 deli");
  const ids = new Set();
  const meshes = new Set();
  M.group.traverse((o) => meshes.add(o));
  for (const d of M.deli) {
    assert.ok(/^[a-z0-9-]+$/.test(d.id) && !ids.has(d.id), `${f}: id dela ${d.id}`);
    ids.add(d.id);
    assert.ok(d.ime && d.opis && d.opis.length >= 15 && d.opis.length <= 260, `${f}/${d.id}: ime in opis`);
    assert.ok(/^#[0-9a-f]{6}$/i.test(d.barva), `${f}/${d.id}: barva`);
    assert.ok(Array.isArray(d.meshes) && d.meshes.length, `${f}/${d.id}: meshes`);
    for (const x of d.meshes) assert.ok(meshes.has(x), `${f}/${d.id}: mesh ni v skupini`);
    assert.ok(Array.isArray(d.tocka) && d.tocka.length === 3 && d.tocka.every(Number.isFinite), `${f}/${d.id}: tocka`);
  }
  if (M.merilo) assert.ok(M.merilo.m > 0 && M.merilo.oznaka, `${f}: merilo`);
}

const datoteke = readdirSync(DIR).filter((f) => f.endsWith(".js") && f !== "index.js");

test("celice: index.js navaja vse modele", { skip: false }, async () => {
  const idx = (await import(pathToFileURL(path.join(DIR, "index.js")))).default;
  assert.ok(Array.isArray(idx) && idx.length >= 27, "vsaj 27 modelov");
  const poti = idx.map((e) => e.pot.replace("./", ""));
  assert.deepEqual([...poti].sort(), [...datoteke].sort(), "index.js in datoteke se ujemajo");
  const ids = new Set();
  for (const e of idx) {
    assert.ok(/^[a-z0-9-]+$/.test(e.id), e.id);
    assert.ok(!ids.has(e.id), "podvojen id " + e.id);
    ids.add(e.id);
    assert.ok(e.naslov && ["BIO", "NAR"].includes(e.predmet), e.id);
    const m = await import(pathToFileURL(path.join(DIR, e.pot)));
    assert.equal(m.info.id, e.id, "id v index.js = info.id");
    assert.equal(m.info.naslov, e.naslov);
  }
});

for (const f of datoteke) {
  test("celice: " + f, { skip }, async () => {
    const m = await import(pathToFileURL(path.join(DIR, f)));
    const { info } = m;
    assert.ok(info && /^celica-|^virus-|^celice-/.test(info.id), "info.id " + info?.id);
    assert.equal(info.podrocje, "celice");
    assert.ok(["BIO", "NAR"].includes(info.predmet));
    assert.ok(info.naslov && info.opis && info.opis.length > 20);
    assert.ok(info.merilo && info.merilo.m > 0 && info.merilo.m < 1e-3 && /µm|nm|mm/.test(info.merilo.oznaka), "merilo");
    assert.equal(typeof m.zgradi, "function");

    for (const kakovost of ["visoka", "nizka"]) {
      const M = m.zgradi(THREE, { kakovost, gibanje: true });
      assert.ok(M.group && M.group.isGroup, "group");
      const { tri, klici } = stej(M.group);
      assert.ok(tri <= MEJE[kakovost], `${f} ${kakovost}: ${tri} trikotnikov > ${MEJE[kakovost]}`);
      assert.ok(klici <= KLICI, `${f} ${kakovost}: ${klici} klicev risanja > ${KLICI}`);
      const { r, c } = polmer(M.group);
      assert.ok(r <= 1.08 && r >= 0.6, `${f}: polmer ${r.toFixed(2)} (mora biti ≈ 1)`);
      assert.ok(c.length() < 0.35, `${f}: središče ${c.toArray().map((x) => x.toFixed(2))}`);

      preveriDele(f, M);
      for (const n of M.nadzor || []) {
        assert.ok(["drsnik", "izbira", "gumb", "stikalo", "izpis"].includes(n.tip) && n.id && n.oznaka, `${f}: nadzor ${n.id}`);
        if (n.tip === "izpis") { assert.equal(typeof n.vrednost(), "string"); continue; }
        assert.equal(typeof n.ob, "function", `${f}: nadzor ${n.id}.ob`);
        if (n.tip === "gumb") { n.ob(); continue; }
        if (n.tip === "stikalo") { n.ob(!n.vrednost); n.ob(n.vrednost); continue; }
        if (n.tip === "izbira") {
          for (const [v] of n.moznosti) {
            n.ob(v);
            const s = stej(M.group);
            assert.ok(s.tri <= MEJE[kakovost] && s.klici <= KLICI, `${f}: ${n.id}=${v} ${s.tri}/${s.klici}`);
            preveriDele(`${f} ${n.id}=${v}`, M);
          }
          n.ob(n.vrednost);
        } else {
          for (const v of [n.min, n.max, n.vrednost]) n.ob(v);
        }
      }
      if (M.korak) for (let i = 0; i < 5; i++) M.korak(i / 30, 1 / 30);
      const mirno = m.zgradi(THREE, { kakovost, gibanje: false });
      if (mirno.korak) mirno.korak(1, 1 / 30);
      M.dispose && M.dispose();
    }
  });
}
