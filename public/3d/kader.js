// Kadriranje 3D modelov (docs/3d.md »Okno dela in kader«): obseg vidnih mrež in preverba, ali je krogla cela v kadru.
// Brez DOM-a, zato ga preverja tudi test/3d-kader.test.js v Node.

// Obseg (Box3) vsega, kar kamera res vidi: mreže in točke v vidnih vejah, v plasteh kamere, z vsaj enim vidnim
// materialom. Črte (silnice, osi) in napisi (sprite) ne štejejo, ker segajo čez rob modela. Prekrivni sij (userData.k3Sij)
// ne šteje. Mreže iz `izpusti` (Set) ne štejejo.
export function obsegVidnega(THREE, koren, { kamera = null, izpusti = null } = {}) {
  const box = new THREE.Box3();
  if (!koren) return box;
  const del = new THREE.Box3();
  koren.updateWorldMatrix(true, true);
  const vidna = (o) => {
    for (let x = o; x && x !== koren.parent; x = x.parent) if (!x.visible) return false;
    return true;
  };
  koren.traverse((o) => {
    if (!(o.isMesh || o.isPoints) || o.userData?.k3Sij || izpusti?.has(o)) return;
    if (o.isInstancedMesh && o.count === 0) return;
    if (kamera && !o.layers.test(kamera.layers)) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    if (mats.every((m) => !m || m.visible === false)) return;
    if (!vidna(o)) return;
    let b = null;
    if (o.isInstancedMesh) {
      o.computeBoundingBox();
      b = o.boundingBox;
    } else {
      const g = o.geometry;
      if (!g?.attributes?.position) return;
      if (!g.boundingBox) g.computeBoundingBox();
      b = g.boundingBox;
    }
    if (!b || b.isEmpty() || ![b.min.x, b.min.y, b.min.z, b.max.x, b.max.y, b.max.z].every(Number.isFinite)) return;
    box.union(del.copy(b).applyMatrix4(o.matrixWorld));
  });
  return box;
}

// Krogla (središče, polmer) v normaliziranih koordinatah zaslona: x, y središča in polmer rx, ry (1 = pol zaslona).
export function kroglaNaZaslonu(THREE, kamera, sredisce, polmer) {
  kamera.updateMatrixWorld();
  const v = new THREE.Vector3().copy(sredisce).applyMatrix4(kamera.matrixWorldInverse);
  const z = -v.z;
  if (z <= polmer * 0.2) return null; // za kamero ali kamera v krogli
  const tanY = Math.tan(THREE.MathUtils.degToRad(kamera.fov / 2));
  const tanX = tanY * kamera.aspect;
  return { x: v.x / (z * tanX), y: v.y / (z * tanY), rx: polmer / (z * tanX), ry: polmer / (z * tanY) };
}

// Je krogla cela v kadru (z robom: 0,94 = 3 % prostora ob vsakem robu)?
export function vKadru(THREE, kamera, sredisce, polmer, rob = 0.94) {
  const k = kroglaNaZaslonu(THREE, kamera, sredisce, polmer);
  if (!k) return false;
  return Math.abs(k.x) + k.rx <= rob && Math.abs(k.y) + k.ry <= rob;
}

// Je krogla vsaj delno v vidnem polju kamere (seka piramido pogleda)? false = povsem izven kadra (za kamero, ob strani).
// Kamera v krogli (uporabnik je model močno povečal) šteje kot vidna.
export function vidnaKrogla(THREE, kamera, sredisce, polmer) {
  kamera.updateMatrixWorld();
  const m = new THREE.Matrix4().multiplyMatrices(kamera.projectionMatrix, kamera.matrixWorldInverse);
  return new THREE.Frustum().setFromProjectionMatrix(m).intersectsSphere(new THREE.Sphere(new THREE.Vector3().copy(sredisce), polmer));
}
