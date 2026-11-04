// Skupna preverba 3D modelov (pogodba v docs/3d.md): info, zgradi, deli, proračun trikotnikov in klicev risanja.
// Vsako izbiro in skrajni vrednosti vsakega drsnika preizkusi posebej.
import assert from "node:assert/strict";

export const MEJE = { visoka: { tri: 150000, klici: 60 }, nizka: { tri: 60000, klici: 60 } };
const PODROCJA = ["celice", "organi", "sistemi", "kemija", "fizika", "matematika", "vesolje", "procesi"];
const PREDMETI = ["BIO", "KEM", "FIZ", "MAT", "NAR"];

export async function naloziThree() {
  try { return await import("three"); } catch { return null; }
}

function vidno(o) { for (let x = o; x; x = x.parent) if (!x.visible) return false; return true; }

/** Trikotniki in klici risanja vidnih predmetov v skupini. */
export function prestej(group) {
  let tri = 0, klici = 0;
  group.updateMatrixWorld(true);
  group.traverse((o) => {
    if (!vidno(o) || !o.geometry) return;
    if (!(o.isMesh || o.isLine || o.isPoints)) return;
    const g = o.geometry, n = g.index ? g.index.count : g.attributes.position ? g.attributes.position.count : 0;
    const inst = o.isInstancedMesh ? o.count : g.isInstancedBufferGeometry ? g.instanceCount : 1;
    const mats = Array.isArray(o.material) ? Math.max(1, g.groups.length) : 1;
    klici += mats;
    if (o.isMesh) tri += (n / 3) * (Number.isFinite(inst) ? inst : 1);
  });
  return { tri: Math.round(tri), klici };
}

function preveriDele(m, ime) {
  assert.ok(m.group && m.group.isGroup, `${ime}: group`);
  assert.ok(Array.isArray(m.deli) && m.deli.length > 0, `${ime}: deli`);
  const ids = new Set();
  for (const d of m.deli) {
    assert.ok(d.id && !ids.has(d.id), `${ime}: podvojen ali prazen id dela ${d.id}`); ids.add(d.id);
    assert.ok(typeof d.ime === "string" && d.ime.length > 1, `${ime}/${d.id}: ime`);
    assert.ok(typeof d.opis === "string" && d.opis.length > 10, `${ime}/${d.id}: opis`);
    assert.ok(Array.isArray(d.meshes) && d.meshes.length > 0, `${ime}/${d.id}: meshes`);
    assert.ok(Array.isArray(d.tocka) && d.tocka.length === 3 && d.tocka.every(Number.isFinite), `${ime}/${d.id}: tocka`);
    assert.ok(Math.hypot(...d.tocka) < 1.6, `${ime}/${d.id}: tocka izven modela`);
    if (d.barva) assert.match(d.barva, /^#[0-9a-f]{6}$/i, `${ime}/${d.id}: barva`);
  }
}

function preveriVelikost(THREE, m, ime) {
  const box = new THREE.Box3().setFromObject(m.group, true);
  if (box.isEmpty()) return;
  const s = box.getBoundingSphere(new THREE.Sphere());
  assert.ok(s.radius < 1.6 && s.radius > 0.3, `${ime}: polmer ${s.radius.toFixed(2)} (pričakovano okoli 1)`);
  assert.ok(s.center.length() < 0.5, `${ime}: središče ${s.center.toArray().map((x) => x.toFixed(2))}`);
}

function preveriProracun(m, kakovost, ime) {
  const { tri, klici } = prestej(m.group);
  assert.ok(tri <= MEJE[kakovost].tri, `${ime} (${kakovost}): ${tri} trikotnikov > ${MEJE[kakovost].tri}`);
  assert.ok(klici <= MEJE[kakovost].klici, `${ime} (${kakovost}): ${klici} klicev risanja > ${MEJE[kakovost].klici}`);
  return { tri, klici };
}

/** Preveri en modul modela pri obeh kakovostih in pri vsaki nastavitvi nadzora. */
export function preveriModel(THREE, mod, podrocje) {
  const { info } = mod;
  assert.ok(info && /^[a-z0-9-]+$/.test(info.id), "info.id");
  assert.equal(info.podrocje, podrocje, `${info.id}: podrocje`);
  assert.ok(PODROCJA.includes(info.podrocje));
  assert.ok(PREDMETI.includes(info.predmet), `${info.id}: predmet`);
  assert.ok(info.naslov && info.opis && info.opis.length > 20, `${info.id}: naslov/opis`);
  assert.ok(info.merilo && info.merilo.m > 0 && info.merilo.oznaka, `${info.id}: merilo`);
  assert.equal(typeof mod.zgradi, "function");
  const porocilo = {};
  for (const kakovost of ["visoka", "nizka"]) {
    for (const gibanje of [true, false]) {
      const m = mod.zgradi(THREE, { kakovost, gibanje });
      const ime = `${info.id}`;
      preveriDele(m, ime); preveriVelikost(THREE, m, ime);
      let naj = preveriProracun(m, kakovost, ime);
      if (m.korak) { m.korak(0.5, 1 / 60); m.korak(1, 1 / 60); }
      for (const n of m.nadzor || []) {
        assert.ok(n.id && n.oznaka && (n.tip === "izpis" || typeof n.ob === "function"), `${ime}: nadzor ${n.id}`);
        assert.ok(["drsnik", "izbira", "gumb", "stikalo", "izpis"].includes(n.tip), `${ime}: tip ${n.tip}`);
        if (n.tip === "izpis") { assert.equal(typeof n.vrednost(), "string", `${ime}: izpis ${n.id}`); continue; }
        if (n.tip === "gumb") { n.ob(); preveriDele(m, `${ime} [${n.id}]`); if (m.korak) m.korak(3, 1 / 60); continue; }
        const vrednosti = n.tip === "izbira" ? n.moznosti.map((o) => o[0]) : n.tip === "drsnik" ? [n.min, n.max, n.vrednost] : [!n.vrednost, n.vrednost];
        if (n.tip === "izbira") assert.ok(n.moznosti.some((o) => o[0] === n.vrednost), `${ime}: ${n.id} privzeta vrednost`);
        for (const v of vrednosti) {
          n.ob(v);
          const tag = `${ime} [${n.id}=${v}]`;
          preveriDele(m, tag); preveriVelikost(THREE, m, tag);
          if (m.merilo) assert.ok(m.merilo.m > 0 && m.merilo.oznaka, `${tag}: merilo`);
          if (m.korak) m.korak(2, 1 / 60);
          const p = preveriProracun(m, kakovost, tag);
          if (p.tri > naj.tri) naj = p;
        }
        n.ob(n.vrednost);
        for (const x of m.nadzor || []) if (x.tip === "izpis") assert.equal(typeof x.vrednost(), "string", `${ime}: izpis ${x.id}`);
      }
      porocilo[kakovost] = naj;
      m.dispose && m.dispose();
    }
  }
  return porocilo;
}
