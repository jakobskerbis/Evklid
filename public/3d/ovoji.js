// Ovoji in stene okoli izbranega dela 3D modela (j, 4. 11. in 6. 11.): kaj pregledovalnik skrije, da se izbrani del ali
// skupina vidi. Brez uvozov (THREE poda klicatelj), zato teče tudi v Node (test/3d-ovoji.test.js).
//  1. Ovoj: večji del, ki ga zadene vseh šest žarkov od zunaj (±x, ±y, ±z) proti središču izbranega (celična stena,
//     membrana, ovojnica …; tudi skrit »pokrov« izreza sklene lupino). Razpršeni deli (ribosomi) tega ne izpolnijo.
//  2. Skupina (»skupina-<id>«, npr. Zaklopke, Organeli): vidni so samo člani (pregled #461 B2-N3: v skupinskem pogledu
//     naj ne ostanejo trabekule, vene ali vez okoli zaklopk). Vse druge mreže skrijemo; brez žarkov, zato je tap poceni
//     tudi na šibkem telefonu (prej žarki proti vsakemu članu 8–46 ms pri CPU ×4).
const SMER = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];

export function okvir(d, box) {
  box.makeEmpty();
  for (const m of d?.meshes || []) {
    if (!m) continue;
    m.updateWorldMatrix(true, true);
    m.traverseVisible((o) => {
      if (!o.isMesh || (o.isInstancedMesh && o.count === 0)) return;
      const g = o.isInstancedMesh ? (o.boundingBox || (o.computeBoundingBox(), o.boundingBox)) : (o.geometry.boundingBox || (o.geometry.computeBoundingBox(), o.geometry.boundingBox));
      if (g) box.union(g.clone().applyMatrix4(o.matrixWorld));
    });
  }
  return box;
}

const prostornina = (THREE, b) => {
  const v = b.getSize(new THREE.Vector3());
  return Math.max(v.x, 1e-6) * Math.max(v.y, 1e-6) * Math.max(v.z, 1e-6);
};

/** Mreže, ki jih je treba skriti za izbrani del ali skupino d (d.skupinaDelov, d.clani). Vrne Set mrež. */
export function najdiOvoje(THREE, d, deli, group) {
  const out = new Set();
  if (!d || !deli?.length || !group) return out;
  const smeri = SMER.map((v) => new THREE.Vector3(...v));
  const rc = new THREE.Raycaster();
  const izbrane = new Set();
  for (const m of d.meshes || []) m?.traverse((o) => izbrane.add(o));
  const bS = okvir(d, new THREE.Box3());
  if (bS.isEmpty()) return out;
  const c = bS.getCenter(new THREE.Vector3());
  const vS = prostornina(THREE, bS);
  const bP = new THREE.Box3();
  const R = new THREE.Box3().setFromObject(group).getBoundingSphere(new THREE.Sphere()).radius * 2 + 1;
  const izvor = new THREE.Vector3();
  const mrezeDela = (p) => {
    const r = [];
    for (const m of p.meshes || []) m?.traverse((o) => { if (o.isMesh && !izbrane.has(o)) r.push(o); });
    return r;
  };
  if (d.skupinaDelov && d.clani?.length) {
    for (const p of deli) if (!d.clani.includes(p)) for (const o of mrezeDela(p)) out.add(o);
    return out;
  }
  const vel = new Map(); // del → prostornina okvirja (enkrat)
  const velikost = (p) => (vel.has(p) ? vel.get(p) : (vel.set(p, prostornina(THREE, okvir(p, bP))), vel.get(p)));
  for (const p of deli) {
    if (p === d || d.clani?.includes(p) || !p.meshes?.length) continue;
    if (velikost(p) < vS * 1.25) continue;
    if (!okvir(p, bP).containsPoint(c)) continue; // ovoj mora vsebovati središče izbranega (brez žarkov)
    const mreze = mrezeDela(p);
    if (!mreze.length) continue;
    const obdaja = smeri.every((s) => {
      rc.set(izvor.copy(c).addScaledVector(s, R), s.clone().negate());
      rc.far = R;
      return rc.intersectObjects(mreze, false).length > 0;
    });
    if (obdaja) for (const o of mreze) out.add(o);
  }
  return out;
}
