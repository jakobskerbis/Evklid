// Ovoji in stene, ki jih pregledovalnik skrije ob izbiri (public/3d/ovoji.js): vedenje na majhnem prizoru.
import { test } from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { najdiOvoje } from "../public/3d/ovoji.js";

function prizor() {
  const group = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
  const mesh = (g, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(g, mat);
    m.position.set(x, y, z);
    group.add(m);
    return m;
  };
  // dve kroglici (člana skupine) za levo in desno steno (vsaka pokrije le svojo polovico), spredaj na steni tanka žila
  const a = mesh(new THREE.SphereGeometry(0.2), -0.5, 0, 0);
  const b = mesh(new THREE.SphereGeometry(0.2), 0.5, 0, 0);
  const levaStena = mesh(new THREE.BoxGeometry(1, 2, 2), -0.5, 0, 0);
  const desnaStena = mesh(new THREE.BoxGeometry(1, 2, 2), 0.5, 0, 0);
  const zila = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3), 0.5, 0, 1.05);
  const membrana = mesh(new THREE.SphereGeometry(3), 0, 0, 0); // obdaja vse
  group.updateMatrixWorld(true);
  const d = (id, m) => ({ id, meshes: [m] });
  const deli = [d("a", a), d("b", b), d("leva", levaStena), d("desna", desnaStena), d("zila", zila), d("membrana", membrana)];
  return { group, deli, a, b, levaStena, desnaStena, zila, membrana };
}

test("en del: skrije samo ovoj, ki ga obdaja z vseh strani", () => {
  const s = prizor();
  const skrij = najdiOvoje(THREE, s.deli[0], s.deli, s.group);
  assert.ok(skrij.has(s.membrana));
  assert.ok(skrij.has(s.levaStena)); // leva stena obdaja kroglico a z vseh šestih smeri
  assert.ok(!skrij.has(s.desnaStena));
  assert.ok(!skrij.has(s.zila));
});

test("skupina: vidni so samo člani (stene, žila in ovoj skriti), hitro", () => {
  const s = prizor();
  const g = { id: "skupina-x", skupinaDelov: true, meshes: [s.a, s.b], clani: [s.deli[0], s.deli[1]] };
  const t0 = performance.now();
  const skrij = najdiOvoje(THREE, g, s.deli, s.group);
  const ms = performance.now() - t0;
  for (const m of [s.levaStena, s.desnaStena, s.membrana, s.zila]) assert.ok(skrij.has(m));
  assert.ok(!skrij.has(s.a) && !skrij.has(s.b), "člani ostanejo");
  assert.ok(ms < 50, `${ms.toFixed(1)} ms`);
});
