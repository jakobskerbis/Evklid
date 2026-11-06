// Ovoji in stene okoli izbranega dela 3D modela (j, 4. 11. in 6. 11.): kaj pregledovalnik skrije, da se izbrani del ali
// skupina vidi. Brez uvozov (THREE poda klicatelj), zato teče tudi v Node (test/3d-ovoji.test.js).
//  1. Ovoj: večji del, ki ga zadenejo vsi šest žarki od zunaj (±x, ±y, ±z) proti središču izbranega (celična stena,
//     membrana, ovojnica …; tudi skrit »pokrov« izreza sklene lupino). Razpršeni deli (ribosomi) tega ne izpolnijo.
//  2. Skupina (»skupina-<id>«, npr. Zaklopke, Organeli): člani so pogosto za več stenami, od katerih nobena sama ne obdaja
//     vsega. Skrijemo še vsak nečlanski del, večji od člana, ki ga žarek od zunaj zadene pred središčem člana. Manjši
//     deli na poti (žila na steni) ostanejo. S kamero (opts.kamera) en žarek na člana iz smeri pogleda in dva poševna,
//     brez kamere šest osi; na žarek največ PLASTI zadetkov. Cena (telefon, Chromium s CPU ×4): prej 6 osi × člani ×
//     vse mreže ~200 ms, zdaj s predizborom po okvirjih 8–46 ms (Zaklopke 20, Organeli 10, jedro nevrona 46).
const SMER = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
const PLASTI = 4;

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
export function najdiOvoje(THREE, d, deli, group, opts = {}) {
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
  if (!d.skupinaDelov || !d.clani?.length) return out;
  const lastnik = new Map(); // mreža → del (posamezni deli pred skupinskimi)
  for (const p of [...deli].sort((x, y) => (x.skupina ? 0 : 1) - (y.skupina ? 0 : 1))) {
    if (d.clani.includes(p)) continue;
    for (const o of mrezeDela(p)) lastnik.set(o, p);
  }
  const vse = [...lastnik.keys()].filter((o) => !o.isInstancedMesh); // primerki (ribosomi) so majhni: ne skrivamo
  const okvirji = new Map(), _tocka = new THREE.Vector3();
  const okvirMreze = (o) => {
    if (!okvirji.has(o)) {
      const g = o.geometry.boundingBox || (o.geometry.computeBoundingBox(), o.geometry.boundingBox);
      okvirji.set(o, g.clone().applyMatrix4(o.matrixWorld));
    }
    return okvirji.get(o);
  };
  const bC = new THREE.Box3(), cC = new THREE.Vector3();
  for (const clan of d.clani) {
    if (okvir(clan, bC).isEmpty()) continue;
    bC.getCenter(cC);
    const vC = prostornina(THREE, bC);
    let smeriClana = smeri;
    if (opts.kamera) {
      const k = new THREE.Vector3().copy(opts.kamera).sub(cC).normalize(); // od člana proti kameri
      const st = new THREE.Vector3(k.z, 0, -k.x).normalize();
      if (!Number.isFinite(st.x) || st.lengthSq() < 0.5) st.set(1, 0, 0);
      smeriClana = [k, k.clone().addScaledVector(st, 0.6).normalize(), k.clone().addScaledVector(st, -0.6).normalize()];
    }
    for (const s of smeriClana) {
      rc.set(izvor.copy(cC).addScaledVector(s, R), s.clone().negate());
      rc.far = R; // izvor je R od središča člana: zadetki do R so pred njim
      let plasti = 0;
      // predizbor (cena): samo mreže večjih delov, katerih okvir žarek seka pred središčem člana; trikotnike testira
      // three le za te (polovica prizora za članom in drobni deli odpadejo brez testa trikotnikov)
      const kand = vse.filter((o) => {
        if (out.has(o)) return false;
        const p = lastnik.get(o);
        if (!p || velikost(p) < vC * 1.25) return false;
        const t = rc.ray.intersectBox(okvirMreze(o), _tocka);
        return !!t && t.distanceTo(rc.ray.origin) < R;
      });
      for (const z of kand.length ? rc.intersectObjects(kand, false) : []) {
        const p = lastnik.get(z.object);
        for (const o of mrezeDela(p)) out.add(o);
        if (++plasti >= PLASTI) break;
      }
    }
  }
  return out;
}
