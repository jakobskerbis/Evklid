// Ovoji izbranega dela (docs/3d.md »Part window and framing«): deli, ki izbrani del res obdajajo (celična stena,
// membrana, ovojnica ...), pregledovalnik skrije, da se izbrani vidi (j, 4. 11.). Brez uvozov (THREE pride kot
// argument), da ga preizkus naloži v Node.
//
// »Obdaja« = (1) vseh šest žarkov od zunaj (±x, ±y, ±z) proti središču izbranega zadene ploskev tega dela (tudi skrit
// pokrov izreza), preden pride do središča; (2) ovoj je večji od izbranega; (3) žarek ovoj doseže pred izbranim
// delom v večini smeri; (4) del nima `ovoj: false`. Brez (3) je vsebina, ki leži znotraj izbranega in obkroža njegovo središče, veljala za ovoj: pri
// bakteriofagu T4 z izbrano glavo je DNK v glavi (z delom DNK, ki je že v bakteriji, ima večji okvir) izginila med
// vbrizgavanjem (j, 13. 11.). Razpršeni deli (ribosomi, silnice, pasovi, vijačnica DNK) ne izpolnijo (1).

export const SMERI = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];

// Okvir vidnih mrež dela v svetovnih koordinatah.
export function okvirDela(THREE, d, box = new THREE.Box3()) {
  box.makeEmpty();
  for (const m of d?.meshes || []) {
    if (!m) continue;
    m.updateWorldMatrix(true, true);
    m.traverseVisible((o) => {
      if (!(o.isMesh || o.isPoints) || (o.isInstancedMesh && o.count === 0)) return; // tudi točke (glikokaliks, ribosomi)
      const g = o.isInstancedMesh ? (o.boundingBox || (o.computeBoundingBox(), o.boundingBox)) : (o.geometry.boundingBox || (o.geometry.computeBoundingBox(), o.geometry.boundingBox));
      if (g) box.union(g.clone().applyMatrix4(o.matrixWorld));
    });
  }
  return box;
}

export function prostornina(THREE, b) {
  const v = b.getSize(new THREE.Vector3());
  return Math.max(v.x, 1e-6) * Math.max(v.y, 1e-6) * Math.max(v.z, 1e-6);
}

// Geometrijska razdalja do najbližjega zadetka. Nekateri modeli (mitoza, mejoza) zadetkom ovojnic za izbiro
// prištejejo zamik, zato `distance` ni nujno prava razdalja; točka zadetka je.
function prva(zadetki, izvor) {
  let m = Infinity;
  for (const h of zadetki) m = Math.min(m, h.point ? h.point.distanceTo(izvor) : h.distance);
  return m;
}

// Ali je mreža vidna (sama in vsi predniki do korena).
function vidna(o) {
  for (let x = o; x; x = x.parent) if (!x.visible) return false;
  return true;
}

// Vrne mreže delov, ki obdajajo del d (med deli `deli`), v vrstnem redu delov. `raycaster` je lahko skupen; uporabi
// se s privzetimi plastmi, zato morajo biti prej skrite mreže že vrnjene na svoje plasti.
export function mrezeOvojev(THREE, deli, d, { group = null, raycaster = new THREE.Raycaster() } = {}) {
  const out = [];
  if (!d || !Array.isArray(deli)) return out;
  const izbrane = new Set();
  for (const m of d.meshes || []) m?.traverse((o) => izbrane.add(o));
  const bS = okvirDela(THREE, d);
  if (bS.isEmpty()) return out;
  const c = bS.getCenter(new THREE.Vector3());
  const vS = prostornina(THREE, bS);
  const koren = group || d.meshes?.find(Boolean)?.parent;
  if (!koren) return out;
  const R = new THREE.Box3().setFromObject(koren).getBoundingSphere(new THREE.Sphere()).radius * 2 + 1;
  const smeri = SMERI.map((v) => new THREE.Vector3(...v));
  const izvor = new THREE.Vector3(), bP = new THREE.Box3();
  // razdalja do prvega zadetka vidnih mrež izbranega dela v vsaki smeri (R, če ga žarek do središča ne zadene)
  const svoje = [];
  for (const m of d.meshes || []) m?.traverse((o) => { if (o.isMesh && vidna(o)) svoje.push(o); });
  const doIzbranega = smeri.map((s) => {
    raycaster.set(izvor.copy(c).addScaledVector(s, R), s.clone().negate());
    raycaster.near = 0;
    raycaster.far = R;
    return Math.min(R, prva(raycaster.intersectObjects(svoje, false), izvor));
  });
  for (const p of deli) {
    // ovoj: false = del nikoli ni ovoj (vsebina, ki teče skozi model, npr. DNK bakteriofaga: tanek izbrani del, ki ga
    // osni žarki ne zadenejo, bi jo sicer lahko imel za ovoj)
    if (p === d || p.ovoj === false || !p.meshes?.length) continue;
    if (prostornina(THREE, okvirDela(THREE, p, bP)) < vS * 1.25) continue; // ovoj je večji od izbranega
    const mreze = [];
    // tudi skrite mreže dela: skrit »pokrov« izreza sklene lupino (celica, HIV), da jo žarek iz izreza zadene
    for (const m of p.meshes) m?.traverse((o) => { if (o.isMesh && !izbrane.has(o)) mreze.push(o); });
    if (!mreze.length) continue;
    let pred = 0, obdaja = true;
    for (let i = 0; i < smeri.length && obdaja; i++) {
      const s = smeri[i];
      raycaster.set(izvor.copy(c).addScaledVector(s, R), s.clone().negate());
      raycaster.near = 0;
      raycaster.far = R;
      const zad = raycaster.intersectObjects(mreze, false);
      if (!zad.length) obdaja = false;
      else if (prva(zad, izvor) < doIzbranega[i] - 1e-6) pred++;
    }
    // ovoj je zunaj izbranega: žarek ga doseže prej v večini smeri (pri izrezu ali delu, ki gleda ven, ne v vseh)
    if (!obdaja || pred * 2 <= smeri.length) continue;
    out.push(...mreze);
  }
  return out;
}
