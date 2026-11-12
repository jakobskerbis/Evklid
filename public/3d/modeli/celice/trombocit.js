// Krvna ploščica: mirujoča (ploščica) in aktivirana (kroglica z nitastimi izrastki), z odrezanim osmim delom.
// Pogodba graditelja: docs/3d.md. THREE pride od kompleta; skupni videz celic iz public/3d/celice-videz.js. Zgrajena je v µm.
import { videzCelic, BARVE as BC } from "../../celice-videz.js";

export const info = {
  id: "celica-trombocit",
  naslov: "Krvna ploščica (trombocit)",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Krvna ploščica (2–3 µm) ni prava celica, temveč odcepljen delček velike celice kostnega mozga, megakariocita, zato nima jedra. Ob poškodbi žile se aktivira: postane okrogla, izrastki se oprimejo rane in zrnca izločijo snovi za strjevanje krvi. Zrnc je manj kot v resnici.",
  poskusi: "Preklopi na »Aktivirana« in opazuj, kako ploščica spremeni obliko.",
  merilo: { m: 2.9e-6, oznaka: "2,9 µm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const gib = ctx.gibanje !== false;
  const group = new THREE.Group();
  const deli = [];
  const odpad = [];

  const kit = videzCelic(THREE, { hi, odpad });
  const { sum, fbm } = kit;
  // ---------- orodja ----------
  let seme = 7;
  const rnd = () => ((seme = (seme * 16807) % 2147483647) - 1) / 2147483646;
  const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  const Y = V(0, 1, 0);
  // mat(barva, {…}): mokra organska površina (relief in vlažen videz doda kit.poliraj na koncu).
  function mat(barva, o = {}) {
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: barva, roughness: 0.45, clearcoat: 0.6, clearcoatRoughness: 0.2,
      sheen: 0.35, sheenColor: new THREE.Color(barva).lerp(new THREE.Color(0xffffff), 0.45).multiplyScalar(0.8), sheenRoughness: 0.45,
    }, o));
    odpad.push(m);
    return m;
  }
  // ---------- debele membrane (debelina je povečana, da je vidna) ----------
  // Plasti na prerezu od notranje (s = 0) do zunanje strani (s = 1): [s0, s1, barva].
  function barvaPlasti(plasti, s, out) {
    for (let i = 0; i < plasti.length; i++) {
      const [a, b, c] = plasti[i];
      if (s <= b + 1e-6) return s >= a - 1e-6 || i === 0 ? out.copy(c) : out.copy(plasti[i - 1][2]).lerp(c, (s - plasti[i - 1][1]) / (a - plasti[i - 1][1]));
    }
    return out.copy(plasti[plasti.length - 1][2]);
  }
  const vrsticePlasti = (plasti) => [...new Set(plasti.flatMap(([a, b]) => [a, b]).concat([0, 1]).map((x) => Math.round(x * 1000) / 1000))].sort((a, b) => a - b);
  // Trak prereza med dvema krivuljama: A[i] (notranja) in B[i] (zunanja), normala n; pora(t) → barva pore ali null.
  function trakPlasti(A, B, n, plasti, pora) {
    const S = vrsticePlasti(plasti), C = A.length, pos = [], nor = [], col = [], idx = [], c = new THREE.Color(), p = new THREE.Vector3();
    for (let j = 0; j < S.length; j++) for (let i = 0; i < C; i++) {
      p.copy(A[i]).lerp(B[i], S[j]); pos.push(p.x, p.y, p.z); nor.push(n.x, n.y, n.z);
      const pc = pora && pora(i / (C - 1));
      if (pc && S[j] > 0.01 && S[j] < 0.99) c.copy(pc); else barvaPlasti(plasti, S[j], c);
      col.push(c.r, c.g, c.b);
    }
    // zavoj trikotnikov naj se ujema z normalo
    const m = Math.floor(C / 2), e1 = new THREE.Vector3().subVectors(A[Math.min(C - 1, m + 1)], A[Math.max(0, m - 1)]), e2 = new THREE.Vector3().subVectors(B[m], A[m]);
    const obrni = e1.cross(e2).dot(n) < 0;
    for (let j = 0; j < S.length - 1; j++) for (let i = 0; i < C - 1; i++) {
      const a = j * C + i, b = a + 1, d = a + C, e = d + 1;
      if (obrni) idx.push(a, d, b, b, d, e); else idx.push(a, b, d, b, e, d);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    return g;
  }
  // Prerez debele lupine na treh ravninah odrezanega osmega dela (x < 0, y > 0, z > 0).
  // rz(d), rn(d): zunanji in notranji polmer v smeri d (|d| = 1); c: središče; zamik: odmik od ravnine proti gledalcu.
  function prerezLupine(rz, rn, plasti, seg, { c = new THREE.Vector3(), pora = null, zamik = 0 } = {}) {
    const ravnine = [
      [(t) => new THREE.Vector3(0, Math.cos(t * Math.PI / 2), Math.sin(t * Math.PI / 2)), new THREE.Vector3(-1, 0, 0)],
      [(t) => new THREE.Vector3(-Math.sin(t * Math.PI / 2), Math.cos(t * Math.PI / 2), 0), new THREE.Vector3(0, 0, 1)],
      [(t) => new THREE.Vector3(-Math.cos(t * Math.PI / 2), 0, Math.sin(t * Math.PI / 2)), new THREE.Vector3(0, 1, 0)],
    ];
    const geos = ravnine.map(([L, n], k) => {
      const A = [], B = [];
      for (let i = 0; i <= seg; i++) { const d = L(i / seg).normalize(); A.push(d.clone().multiplyScalar(rn(d)).add(c).addScaledVector(n, zamik)); B.push(d.clone().multiplyScalar(rz(d)).add(c).addScaledVector(n, zamik)); }
      return trakPlasti(A, B, n, plasti, pora && ((t) => pora(t, k)));
    });
    return zdruziPlasti(geos);
  }
  function zdruziPlasti(geos) {
    const pos = [], nor = [], col = [], idx = []; let off = 0;
    for (const g of geos) {
      const p = g.attributes.position, n = g.attributes.normal, cc = g.attributes.color;
      for (let k = 0; k < p.count; k++) { pos.push(p.getX(k), p.getY(k), p.getZ(k)); nor.push(n.getX(k), n.getY(k), n.getZ(k)); col.push(cc.getX(k), cc.getY(k), cc.getZ(k)); }
      for (let k = 0; k < g.index.count; k++) idx.push(g.index.getX(k) + off);
      off += p.count; g.dispose();
    }
    const out = new THREE.BufferGeometry();
    out.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    out.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    out.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    out.setIndex(idx);
    return out;
  }
  const matPlasti = (o = {}) => mat(0xffffff, Object.assign({ vertexColors: true, roughness: 0.5, clearcoat: 0.5, clearcoatRoughness: 0.3, sheen: 0.2, side: THREE.DoubleSide }, o));
  // Združi geometrije (z index ali brez) v eno; po želji pobarva vsako z barvo oglišč.
  function zdruzi(geos, barve) {
    const pos = [], nor = [], col = [], idx = [], uv = [];
    let off = 0;
    geos.forEach((g, i) => {
      const tu = g.attributes.uv, p = g.attributes.position, n = g.attributes.normal;
      const c = Array.isArray(barve) ? new THREE.Color(barve[i]) : null;
      const gc = !c && barve === true ? g.attributes.color : null;
      for (let k = 0; k < p.count; k++) {
        pos.push(p.getX(k), p.getY(k), p.getZ(k));
        nor.push(n.getX(k), n.getY(k), n.getZ(k));
        if (tu) uv.push(tu.getX(k), tu.getY(k)); else { const x = p.getX(k), y = p.getY(k), zz = p.getZ(k); uv.push(0.5 + Math.atan2(zz, x) / (2 * Math.PI), 0.5 + Math.asin(Math.max(-1, Math.min(1, y / (Math.hypot(x, y, zz) || 1)))) / Math.PI); }
        if (c) col.push(c.r, c.g, c.b);
        else if (gc) col.push(gc.getX(k), gc.getY(k), gc.getZ(k));
      }
      if (g.index) for (let k = 0; k < g.index.count; k++) idx.push(g.index.getX(k) + off);
      else for (let k = 0; k < p.count; k++) idx.push(k + off);
      off += p.count;
      g.dispose();
    });
    const out = new THREE.BufferGeometry();
    out.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    out.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    out.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    if (barve) out.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    out.setIndex(idx);
    return out;
  }
  // Pobarva geometrijo z barvo oglišč (za združevanje z barve === true).
  function pobarvaj(g, barva) {
    const c = new THREE.Color(barva), n = g.attributes.position.count, a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
    g.setAttribute("color", new THREE.BufferAttribute(a, 3));
    return g;
  }
  // Drobni delci (ribosomi, zrnca, mehurčki) v škatli od a do b, kjer pogoj(p) velja: ikozaedri z rahlo različno barvo in velikostjo.
  function drobci(n, a, b, velikost, material, pogoj, { razlika = 0.25, detajl = 0 } = {}) {
    const m = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, detajl), material, n), ob = new THREE.Object3D(), p = new THREE.Vector3(), c = new THREE.Color();
    let k = 0;
    for (let t = 0; t < n * 80 && k < n; t++) {
      p.set(a.x + (b.x - a.x) * rnd(), a.y + (b.y - a.y) * rnd(), a.z + (b.z - a.z) * rnd());
      if (!pogoj(p)) continue;
      ob.position.copy(p); ob.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6);
      ob.scale.set(1, 0.75 + rnd() * 0.4, 0.8 + rnd() * 0.3).multiplyScalar(velikost * (0.6 + rnd() * 0.8)); ob.updateMatrix();
      m.setMatrixAt(k, ob.matrix); const s = 1 + (rnd() * 2 - 1) * razlika; m.setColorAt(k, c.setRGB(s, s, s)); k++;
    }
    m.count = k; m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true;
    m.computeBoundingSphere(); m.computeBoundingBox();
    return m;
  }
  // deli so trajni predmeti (seznam se ob preklopu stanja zgradi na novo, barva iz stikala učbeniških barv pa ostane)
  const vsiDeli = new Map();
  function del(id, ime, opis, barva, meshes, tocka) {
    meshes.forEach((m) => { m.userData.del = id; });
    let d = vsiDeli.get(id);
    if (!d) vsiDeli.set(id, (d = { id, barva }));
    Object.assign(d, { ime, opis, meshes, tocka });
    deli.push(d);
  }
  // Odrezan osmi del: x < 0, y > 0, z > 0 (proti gledalcu levo zgoraj).
  const vIzrezu = (v, c = { x: 0, y: 0, z: 0 }) => v.x < c.x && v.y > c.y && v.z > c.z;
  // Parametrična ploskev f(u, v, p) za u, v ∈ [0, 1]; normale iz končnih razlik, zato se kosi stikajo brez šivov.
  function normala(f, u, v, n) { // lastni vektorji, ker f lahko spet kliče normala (odmik)
    const e = 1e-4, _a = V(), _b = V(), _c = V(), _d = V(), _t = V();
    for (const [du, dv] of [[0, 0], [0, 0.004], [0, -0.004], [0.004, 0], [-0.004, 0]]) {
      const uu = u + du, vv = v + dv;
      f(uu + e, vv, _a); f(uu - e, vv, _b); f(uu, vv + e, _c); f(uu, vv - e, _d);
      n.subVectors(_a, _b).cross(_t.subVectors(_c, _d));
      if (n.lengthSq() > 1e-24) return n.normalize();
    }
    return n.set(0, 1, 0);
  }
  function ploskev(f, nu, nv, obrni = false) {
    const pos = new Float32Array((nu + 1) * (nv + 1) * 3), nor = new Float32Array(pos.length), idx = [], uvp = new Float32Array((nu + 1) * (nv + 1) * 2);
    const p = V(), n = V();
    for (let j = 0, k = 0; j <= nv; j++) for (let i = 0; i <= nu; i++, k += 3) {
      f(i / nu, j / nv, p); normala(f, i / nu, j / nv, n); uvp[(k / 3) * 2] = i / nu; uvp[(k / 3) * 2 + 1] = j / nv;
      if (obrni) n.negate();
      pos[k] = p.x; pos[k + 1] = p.y; pos[k + 2] = p.z; nor[k] = n.x; nor[k + 1] = n.y; nor[k + 2] = n.z;
    }
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
      const A = j * (nu + 1) + i, B = A + 1, C = A + nu + 2, D = A + nu + 1;
      if (obrni) idx.push(A, D, B, B, D, C); else idx.push(A, B, D, B, C, D);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
    g.setAttribute("uv", new THREE.BufferAttribute(uvp, 2));
    g.setIndex(idx);
    return g;
  }
  // Ploskev, zamaknjena za d vzdolž normale (d > 0 navzven).
  const odmik = (f, d) => { const n = V(); return (u, v, p) => { normala(f, u, v, n); f(u, v, p); return p.addScaledVector(n, d); }; };
  // Cevka skozi točke (gladka krivulja).
  const nit = (tocke, r, seg, rs = 6, zaprta = false) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tocke, zaprta), q(seg), r, q(rs), zaprta);
  // Deformira oglišča geometrije s f(v) in na novo izračuna normale.
  function deformiraj(g, f) {
    const p = g.attributes.position, v = V();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); f(v); p.setXYZ(i, v.x, v.y, v.z); }
    g.computeVertexNormals();
    return g;
  }
  // Lupina z odrezanim osmim delom; f(smer) vrne polmer v tej smeri.
  function lupina(f, ws, hs) {
    const zg = new THREE.SphereGeometry(1, ws, hs / 2, Math.PI / 2, Math.PI * 1.5, 0, Math.PI / 2);
    const sp = new THREE.SphereGeometry(1, ws, hs / 2, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const pokr = new THREE.SphereGeometry(1, Math.round(ws / 4), hs / 2, 0, Math.PI / 2, 0, Math.PI / 2);
    const v = new THREE.Vector3();
    // uv v skupnih kotnih enotah krogle (u = φ / 2π, v = θ / π), da se normalna mapa na šivih ujema
    [[zg, 0.25, 0.75, 0.5], [sp, 0, 1, 0], [pokr, 0, 0.25, 0.5]].forEach(([g, u0, su, v0]) => { const t = g.attributes.uv; for (let i = 0; i < t.count; i++) t.setXY(i, u0 + t.getX(i) * su, v0 + t.getY(i) * 0.5); });
    for (const g of [zg, sp, pokr]) {
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i).normalize();
        v.multiplyScalar(f(v));
        p.setXYZ(i, v.x, v.y, v.z);
      }
      g.computeVertexNormals();
    }
    return { odprta: zdruzi([zg, sp]), pokrov: pokr };
  }
  // Rob prereza: tri loki na meji odrezanega osmega dela.
  function rob(f, debelina, seg) {
    const loki = [
      (t) => new THREE.Vector3(0, Math.cos(t * Math.PI / 2), Math.sin(t * Math.PI / 2)),
      (t) => new THREE.Vector3(-Math.sin(t * Math.PI / 2), Math.cos(t * Math.PI / 2), 0),
      (t) => new THREE.Vector3(-Math.cos(t * Math.PI / 2), 0, Math.sin(t * Math.PI / 2)),
    ];
    return zdruzi(loki.map((L) => {
      const pts = [];
      for (let i = 0; i <= seg; i++) { const d = L(i / seg).normalize(); pts.push(d.multiplyScalar(f(d) * 0.99)); }
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, debelina, q(8), false);
    }));
  }
  // Postavi vsebino (zgrajeno v µm) v enotsko kroglo: središče škatle v izhodišče, največji polmer = cilj. Vrne enote na µm.
  function umeri(o, cilj = 0.98) {
    o.position.set(0, 0, 0); o.scale.setScalar(1); o.updateMatrixWorld(true);
    o.traverse((m) => { if (m.isInstancedMesh) { m.computeBoundingBox(); m.computeBoundingSphere(); } });
    const c = new THREE.Box3().setFromObject(o, true).getCenter(V());
    let r = 0; const v = V();
    o.traverseVisible((m) => {
      if (!m.isMesh) return;
      if (m.isInstancedMesh) { // vsak primerek posebej (skupna krogla je ohlapna)
        if (!m.geometry.boundingSphere) m.geometry.computeBoundingSphere();
        const mi = new THREE.Matrix4(), sf = new THREE.Sphere();
        for (let i = 0; i < m.count; i++) { m.getMatrixAt(i, mi); sf.copy(m.geometry.boundingSphere).applyMatrix4(mi).applyMatrix4(m.matrixWorld); r = Math.max(r, sf.center.distanceTo(c) + sf.radius); }
        return;
      }
      const p = m.geometry.attributes.position, st = Math.max(1, Math.floor(p.count / 3000));
      for (let i = 0; i < p.count; i += st) r = Math.max(r, v.fromBufferAttribute(p, i).applyMatrix4(m.matrixWorld).distanceTo(c));
    });
    const s = cilj / r;
    o.scale.setScalar(s); o.position.copy(c).multiplyScalar(-s);
    return s;
  }
  // Oznaka merila z decimalno vejico.
  const oznaka = (um) => (um >= 10 ? String(Math.round(um)) : String(Math.round(um * 10) / 10).replace(".", ",")) + " µm";
  const o = new THREE.Object3D();

  // Mitohondrij v prerezu: zunanja membrana, odprtina proti gledalcu, v njej kriste.
  function mitohondrijGeo() {
    const L = 0.12, r = 0.055, prof = [];
    for (let i = 0; i <= 12; i++) { const a = -Math.PI / 2 + (i / 12) * Math.PI; prof.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r + (a < 0 ? -L / 2 : L / 2))); }
    const zun = new THREE.LatheGeometry(prof, q(18), 0.5 * Math.PI, 1.45 * Math.PI);
    const not = new THREE.LatheGeometry(prof.map((p) => new THREE.Vector2(p.x * 0.86, p.y * 0.93)), q(18), 0.5 * Math.PI, 1.45 * Math.PI);
    const ix = not.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i]; ix[i] = ix[i + 2]; ix[i + 2] = t; }
    not.computeVertexNormals();
    const kr = [];
    for (let i = 0; i < 6; i++) {
      const y = -L / 2 - r * 0.45 + i * ((L + r * 0.9) / 5);
      const w = Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, Math.abs(y) - L / 2) / r, 2))) * r * 0.85;
      const c = new THREE.BoxGeometry(w * 1.5, 0.008, w * 1.6, 1, 1, 1);
      c.translate(i % 2 ? w * 0.25 : -w * 0.25, y, 0);
      kr.push(c);
    }
    const g = zdruzi([zun, not, ...kr], [0xd98a1e, 0xf0b24a, ...kr.map(() => 0xffd67e)]);
    const p = g.attributes.position, v = V(), H = L / 2 + r;
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const t = v.y / H, w = 1 + 0.07 * Math.sin(t * 3.1 + 0.6) + 0.04 * sum(v.x * 40, v.y * 40, v.z * 40);
      p.setXYZ(i, v.x * w + 0.032 * (t * t - 0.4), v.y, v.z * w);
    }
    g.computeVertexNormals();
    return g;
  }
  // Odprtina mitohondrija gleda proti kameri, os je naključna, a pravokotna na smer pogleda.
  const mW = V(Math.sin(0.225 * Math.PI), 0, Math.cos(0.225 * Math.PI)), mP = V(0, 1, 0).cross(mW);
  function protiKameri() {
    const w = POGt.clone().add(V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(0.5)).normalize();
    const y = V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).projectOnPlane(w).normalize();
    const L = new THREE.Matrix4().makeBasis(mP, V(0, 1, 0), mW), T = new THREE.Matrix4().makeBasis(y.clone().cross(w), y, w);
    return new THREE.Quaternion().setFromRotationMatrix(T.multiply(L.transpose()));
  }
  const A = 1.3, Bp = 0.42; // polosi mirujoče ploščice (premer 2,6 µm, debelina 0,84 µm)
  const RA = Math.cbrt(A * A * Bp); // kroglica z enako prostornino
  const fD = (d) => (1 / Math.sqrt((d.x * d.x + d.z * d.z) / (A * A) + (d.y * d.y) / (Bp * Bp))) * (1 + 0.012 * fbm(d.x * 2 + 1, d.y * 2, d.z * 2));
  const fA = (d) => RA * (1 + 0.05 * fbm(d.x * 2.2 + 7, d.y * 2.2, d.z * 2.2));
  let t = 0, cilj = 0;
  const fT = (d) => fD(d) + (fA(d) - fD(d)) * t;
  // točka v notranjosti: preslikava iz ploščice v kroglico
  const M = (p, out, cent = 0) => { const d = p.clone().normalize(); return out.copy(p).multiplyScalar((1 + (fA(d) / fD(d) - 1) * t) * (1 - cent * t)); };
  // normala površja v smeri d (elipsoid → krogla)
  const normalaT = (d, out) => out.set(d.x / (A * A), d.y / (Bp * Bp), d.z / (A * A)).normalize().lerp(d, t).normalize();

  const svet = new THREE.Group(); group.add(svet);
  const tel = new THREE.Group(); svet.add(tel);
  tel.rotation.set(0.42, 0.25, 0);
  const POGt = V(-0.47, 0.34, 0.81).normalize().applyEuler(new THREE.Euler(-0.42, 0, 0)).applyEuler(new THREE.Euler(0, -0.25, 0)); // smer kamere v koordinatah ploščice (približno)

  // ---------- membrana (steklena), citoplazma in prerez membrane (oglišča se pretapljajo med oblikama) ----------
  const enota = lupina(() => 1, q(120), q(72));
  const smeri = [enota.odprta.attributes.position.array.slice()];
  enota.pokrov.dispose();
  const memMat = kit.steklo(mat(BC.membrana, { side: THREE.FrontSide }), { a: 0.14, rf: 15, rob: "#8c9cff", rk: 1.3 });
  const memOut = new THREE.Mesh(enota.odprta, memMat);
  const citIn = new THREE.Mesh(enota.odprta.clone(), mat(0x3e2a62, { roughness: 0.62, clearcoat: 0.25, sheen: 0.3, side: THREE.BackSide }));
  const TM = 0.06; // debelina membrane (povečana)
  const robMat = matPlasti({ roughness: 0.45, clearcoat: 0.5 });
  robMat.userData.rez = true;
  const memRob = new THREE.Mesh(new THREE.BufferGeometry(), robMat);
  const DVOSLOJ = [[0, 0.2, new THREE.Color(0x5a32b8)], [0.34, 0.66, new THREE.Color(0xeee6ff)], [0.8, 1, new THREE.Color(0x5a32b8)]];
  tel.add(memOut, citIn, memRob);
  const dv = V();
  function oblikuj() {
    for (const [g, s0, k] of [[memOut.geometry, smeri[0], 0], [citIn.geometry, smeri[0], TM]]) {
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) { dv.set(s0[i * 3], s0[i * 3 + 1], s0[i * 3 + 2]); const r = fT(dv) - k; p.setXYZ(i, dv.x * r, dv.y * r, dv.z * r); }
      p.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingSphere();
    }
    memRob.geometry.dispose(); memRob.geometry = prerezLupine((d) => fT(d) * 0.999, (d) => fT(d) - TM, DVOSLOJ, q(110), { zamik: 0.002 });
  }
  // receptorji v membrani (GPIb veže von Willebrandov dejavnik, GPIIb/IIIa fibrinogen)
  const recD = [];
  for (let k = 0; recD.length < (hi ? 240 : 90) && k < 5000; k++) {
    const d = V(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
    if (d.lengthSq() > 1 || d.lengthSq() < 0.02) continue;
    d.normalize();
    if (vIzrezu(d, { x: 0.03, y: -0.03, z: -0.03 })) continue;
    recD.push({ d, z: rnd() * 6, s: 0.75 + rnd() * 0.5 });
  }
  const rec = kit.beljakovine(recD.map((r) => ({ p: r.d.clone(), n: r.d.clone() })), "#6f7dff", 0.02, { visina: 1.7 });
  const nn = V();
  function postaviRec() {
    recD.forEach((r, i) => {
      normalaT(r.d, nn);
      o.position.copy(r.d).multiplyScalar(fT(r.d)).addScaledVector(nn, 0.012);
      o.quaternion.setFromUnitVectors(Y, nn); o.rotateY(r.z); o.scale.setScalar(r.s); o.updateMatrix(); rec.setMatrixAt(i, o.matrix);
    });
    rec.instanceMatrix.needsUpdate = true; rec.computeBoundingSphere(); rec.computeBoundingBox();
  }
  tel.add(rec);

  // ---------- filopodiji (nitasti izrastki) ----------
  const fil = new THREE.CylinderGeometry(0.014, 0.055, 1, q(6), 6, false);
  fil.translate(0, 0.5, 0);
  deformiraj(fil, (v) => { v.x += 0.2 * v.y * v.y; v.z += 0.06 * Math.sin(v.y * 6); });
  const nFil = 18;
  const filo = new THREE.InstancedMesh(fil, kit.steklo(mat(0xa8b4ff, { side: THREE.FrontSide }), { a: 0.3, rf: 30, k: 0.5, rob: "#a8b8ff", rk: 1.3, difuzno: 0.3 }), nFil);
  const filPod = [];
  for (let i = 0; i < nFil; i++) {
    const d = V(rnd() * 2 - 1, (rnd() * 2 - 1) * 0.55, rnd() * 2 - 1).normalize();
    if (vIzrezu(d, { x: 0.1, y: -0.1, z: -0.1 })) { i--; continue; }
    filPod.push({ d, L: 0.55 + rnd() * 1.25, zas: rnd() * 6, deb: 0.8 + rnd() * 0.5, z: rnd() * 0.35 });
  }
  function postaviFil() {
    filo.visible = t > 0.02;
    filPod.forEach((f, i) => {
      const g = THREE.MathUtils.clamp((t - f.z) / (1 - f.z), 0, 1);
      o.position.copy(f.d).multiplyScalar(fT(f.d) * 0.97);
      o.quaternion.setFromUnitVectors(Y, f.d); o.rotateY(f.zas);
      o.scale.set(f.deb, Math.max(0.001, f.L * g), f.deb); o.updateMatrix(); filo.setMatrixAt(i, o.matrix);
    });
    filo.instanceMatrix.needsUpdate = true; filo.computeBoundingSphere(); filo.computeBoundingBox();
  }
  tel.add(filo);

  // ---------- obroč mikrotubulov: en dolg mikrotubul, 8- do 12-krat zvit ob robu (sijoča vlakna) ----------
  const nNiti = hi ? 10 : 5;
  const obroc = kit.vlakna([new THREE.LineCurve3(V(), V(0, 0.01, 0))], 0.012, BC.citoskelet, { sij: 0.5 });
  const obFaze = Array.from({ length: nNiti }, () => [rnd() * 6.28, 0.6 + rnd() * 0.8, rnd() * 6.28]);
  function postaviObroc() {
    const Rr = (A - 0.12) * (1 - 0.55 * t), niti = [];
    obFaze.forEach(([f0, rr, f1], h) => {
      const pts = [];
      for (let i = 0; i <= 160; i++) {
        const a = (i / 160) * Math.PI * 2, b = a * 7 + f0, w = 0.026 * rr * (1 + 0.3 * Math.sin(a * 3 + f1));
        pts.push(V((Rr + w * Math.cos(b)) * Math.cos(a), w * Math.sin(b) + 0.018 * Math.sin(a * 3 + h * 0.3), (Rr + w * Math.cos(b)) * Math.sin(a)));
      }
      niti.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), q(220), 0.011, hi ? 5 : 3, true));
    });
    obroc.geometry.dispose(); obroc.geometry = zdruzi(niti);
  }
  tel.add(obroc);

  // ---------- zrnca, mitohondriji ----------
  function vPloscici(rr, ymax = 1) {
    for (let k = 0; k < 3000; k++) {
      const p = V((rnd() * 2 - 1) * A, (rnd() * 2 - 1) * Bp, (rnd() * 2 - 1) * A);
      const d = p.clone().normalize(), m = fD(d) * 0.86 - rr;
      if (p.length() > m || Math.hypot(p.x, p.z) > A - 0.3 || Math.abs(p.y) > (Bp - rr - 0.06) * ymax) continue;
      return p;
    }
    return V();
  }
  const vsiZ = [];
  function skupina(n, geo, material, velikost) {
    const m = new THREE.InstancedMesh(geo, material, n), seznam = [];
    for (let i = 0; i < n; i++) {
      const s = velikost();
      let p, k = 0;
      do { p = vPloscici(s); k++; } while (k < 60 && vsiZ.some((x) => x.p.distanceTo(p) < (x.s + s) * 1.1));
      const x = { p, s, e: new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3) };
      seznam.push(x); vsiZ.push(x);
    }
    tel.add(m);
    return { m, seznam };
  }
  const kroglaG = (n) => { const g = new THREE.SphereGeometry(1, q(14), q(10)); return deformiraj(g, (v) => v.multiplyScalar(1 + 0.07 * sum(v.x * 1.7 + n, v.y * 1.7, v.z * 1.7))); };
  const alfa = skupina(hi ? 54 : 34, kroglaG(1), mat("#ff7ab8", { roughness: 0.3, clearcoat: 0.85, clearcoatRoughness: 0.12 }), () => 0.085 + rnd() * 0.05);
  // gosta zrnca: temno jedro v svetlem prozornem ovoju (videz »volovskega očesa«)
  const goste = skupina(hi ? 8 : 6, kroglaG(2), kit.steklo(mat("#9fe6ff"), { a: 0.32, rf: 30, k: 0.3, rob: "#c8f4ff", rk: 1.2, difuzno: 0.55, iri: 0.3 }), () => 0.07 + rnd() * 0.02);
  const gJedra = new THREE.InstancedMesh(kroglaG(3), mat(0x1c1440, { roughness: 0.25, clearcoat: 0.9 }), goste.seznam.length);
  tel.add(gJedra);
  const mito = skupina(4, mitohondrijGeo(), mat(0xffffff, { vertexColors: true, roughness: 0.38, side: THREE.DoubleSide }), () => 0.13);
  mito.seznam.forEach((x) => { x.q = protiKameri(); });
  // drobna zrnca glikogena v citoplazmi (sledijo spremembi oblike)
  const glik = drobci(hi ? 520 : 260, V(-A, -Bp, -A), V(A, Bp, A), 0.02, mat(0xc6b4ff, { roughness: 0.4, clearcoat: 0.5 }), (p) => !vIzrezu(p, { x: 0.03, y: -0.03, z: -0.03 }) && p.length() < fD(p.clone().normalize()) * 0.86 - 0.02);
  const glikP = [], _q = new THREE.Quaternion(), _s = V(), _m = new THREE.Matrix4();
  for (let i = 0; i < glik.count; i++) { glik.getMatrixAt(i, _m); const p = V(); _m.decompose(p, _q, _s); glikP.push([p, _q.clone(), _s.clone()]); }
  tel.add(glik);
  const pv = V();
  function postaviZrnca() {
    glikP.forEach(([p, qq, sc], i) => { M(p, pv, 0.3); glik.setMatrixAt(i, _m.compose(pv, qq, sc)); });
    glik.instanceMatrix.needsUpdate = true; glik.computeBoundingSphere();
    for (const [sk, cent, enakomerno] of [[alfa, 0.45, true], [goste, 0.45, true], [mito, 0.3, false]]) {
      sk.seznam.forEach((x, i) => {
        M(x.p, pv, cent);
        o.position.copy(pv);
        if (x.q) o.quaternion.copy(x.q); else o.rotation.copy(x.e);
        if (enakomerno) o.scale.set(x.s, x.s * 0.85, x.s); else o.scale.setScalar(1.3);
        o.updateMatrix(); sk.m.setMatrixAt(i, o.matrix);
        if (sk === goste) { o.scale.multiplyScalar(0.55); o.updateMatrix(); gJedra.setMatrixAt(i, o.matrix); }
      });
      sk.m.instanceMatrix.needsUpdate = true; sk.m.computeBoundingSphere(); sk.m.computeBoundingBox();
    }
    gJedra.instanceMatrix.needsUpdate = true; gJedra.computeBoundingSphere(); gJedra.computeBoundingBox();
  }

  // ---------- odprt kanalikularni sistem (uvihana membrana) in gost cevast sistem (zaloga kalcija) ----------
  const kanali = [];
  for (let i = 0; i < (hi ? 9 : 7); i++) {
    let d;
    do { d = V(rnd() * 2 - 1, (rnd() * 2 - 1) * 0.6, rnd() * 2 - 1).normalize(); } while (vIzrezu(d, { x: 0.2, y: -0.3, z: -0.2 }) && i > 1);
    if (i < 2) d.set(-0.3 - i * 0.3, i ? -0.3 : 0.75, 0.6).normalize(); // dva sta vidna ob prerezu
    const pts = [d.clone().multiplyScalar(fD(d) * 1.0)];
    let p = d.clone().multiplyScalar(fD(d) * 0.8);
    pts.push(p.clone());
    for (let s = 0; s < 5; s++) {
      p = p.clone().add(V(rnd() - 0.5, (rnd() - 0.5) * 0.35, rnd() - 0.5).multiplyScalar(0.45)).multiplyScalar(0.88);
      p.y = THREE.MathUtils.clamp(p.y, -Bp * 0.5, Bp * 0.5);
      pts.push(p);
    }
    // stranska veja
    const v0 = pts[3], veja = [v0.clone()];
    let pp = v0.clone();
    for (let s = 0; s < 3; s++) { pp = pp.clone().add(V(rnd() - 0.5, (rnd() - 0.5) * 0.3, rnd() - 0.5).multiplyScalar(0.35)).multiplyScalar(0.92); pp.y = THREE.MathUtils.clamp(pp.y, -Bp * 0.5, Bp * 0.5); veja.push(pp); }
    kanali.push({ pts, d, veja });
  }
  const ocs = new THREE.Mesh(new THREE.BufferGeometry(), mat(0xbfa4ff, { roughness: 0.32, clearcoat: 0.8, side: THREE.DoubleSide }));
  const dtsP = [];
  for (let i = 0; i < (hi ? 9 : 6); i++) {
    const a0 = rnd() * 6.28, r0 = A * (0.45 + rnd() * 0.4), pts = [];
    let p = V(Math.cos(a0) * r0, (rnd() - 0.5) * Bp * 0.5, Math.sin(a0) * r0);
    if (vIzrezu(p, { x: 0.15, y: -0.15, z: -0.15 }) && i > 2) { i--; continue; }
    for (let s = 0; s < 6; s++) {
      pts.push(p.clone());
      const a = Math.atan2(p.z, p.x) + 0.25 + rnd() * 0.15, r = THREE.MathUtils.clamp(Math.hypot(p.x, p.z) + (rnd() - 0.5) * 0.18, 0.35, A * 0.86);
      p = V(Math.cos(a) * r, THREE.MathUtils.clamp(p.y + (rnd() - 0.5) * 0.1, -Bp * 0.45, Bp * 0.45), Math.sin(a) * r);
    }
    dtsP.push(pts);
  }
  const dts = new THREE.Mesh(new THREE.BufferGeometry(), mat(BC.zer, { roughness: 0.3, clearcoat: 0.9, emissive: new THREE.Color(0x101a60) }));
  function postaviKanale() {
    const g = [];
    for (const k of kanali) {
      const pts = k.pts.map((p, i) => (i === 0 ? k.d.clone().multiplyScalar(fT(k.d) * 1.005) : M(p, V())));
      g.push(nit(pts, 0.04, 40, 6));
      g.push(nit(k.veja.map((p) => M(p, V())), 0.03, 16, 5));
      const tor = new THREE.TorusGeometry(0.05, 0.013, q(5), q(14));
      const m = new THREE.Matrix4().lookAt(V(), k.d, Y).setPosition(pts[0]);
      g.push(tor.applyMatrix4(m));
    }
    ocs.geometry.dispose(); ocs.geometry = zdruzi(g);
    dts.geometry.dispose(); dts.geometry = zdruzi(dtsP.map((pts) => nit(pts.map((p) => M(p, V(), 0.3)), 0.017, 30, 5)));
  }
  tel.add(ocs, dts);

  // ---------- stanje ----------
  let s = 1;
  function posodobi() {
    oblikuj(); postaviRec(); postaviFil(); postaviObroc(); postaviZrnca(); postaviKanale();
    const doseg = t < 0.02 ? A * 1.02 : Math.max(A + (RA - A) * t, Math.max(...filPod.map((f) => fT(f.d) + f.L * THREE.MathUtils.clamp((t - f.z) / (1 - f.z), 0, 1))));
    s = 0.93 / doseg;
    svet.scale.setScalar(s);
  }
  posodobi();

  const W = (p) => V(...p).applyEuler(tel.rotation).multiplyScalar(s).toArray();
  function postaviDele() {
    deli.length = 0;
    const akt = cilj > 0.5;
    const sm = V(0.35, 0.55, 0.75).normalize();
    del("membrana", "Celična membrana", "Ovojnica ploščice iz dvosloja fosfolipidov (v prerezu temni glavi in svetli repi). Debelina membrane je povečana.", "#9fb4ff", [memOut, memRob], W(sm.clone().multiplyScalar(fT(sm) * 1.01).toArray()));
    const rr = recD.reduce((a, b) => (b.d.z + b.d.y * 0.5 > a.d.z + a.d.y * 0.5 ? b : a));
    del("receptorji", "Receptorji (GPIb, GPIIb/IIIa)", "Beljakovine v membrani: GPIb ploščico prilepi na poškodovano steno žile, aktivirani GPIIb/IIIa pa prek fibrinogena poveže ploščice med seboj v čep.", "#6f7dff", [rec],
      W(rr.d.clone().multiplyScalar(fT(rr.d) * 1.03).toArray()));
    if (akt) {
      const f = filPod.reduce((a, b) => (b.d.z + b.d.x * 0.3 > a.d.z + a.d.x * 0.3 ? b : a));
      del("filopodiji", "Nitasti izrastki (filopodiji)", "Aktivirana ploščica požene dolge tanke izrastke, s katerimi se oprime rane in drugih ploščic; tako nastane čep.", "#a8b4ff", [filo], W(f.d.clone().multiplyScalar(fT(f.d) + f.L * 0.6).toArray()));
    }
    del("citoplazma", "Citoplazma", "Notranjost ploščice; ker je ploščica delček megakariocita, nima jedra, ima pa veliko zrnc.", "#5a3e8a", [citIn], W((() => { const d = akt ? V(0.35, 0.4, -0.6).normalize() : V(-0.5, -0.3, 0.55).normalize(); return d.multiplyScalar(fT(d) * 0.93).toArray(); })()));
    del("glikogen", "Zrnca glikogena", "Zaloga sladkorja, iz katere ploščica dobi energijo za spremembo oblike in izločanje.", "#c6b4ff", [glik], W(M(glikP[Math.floor(glikP.length / 3)][0], V(), 0.3).toArray()));
    del("obroc", "Obroč mikrotubulov", "En dolg mikrotubul, 8- do 12-krat zvit ob robu kot obroč; mirujoči ploščici daje obliko diska. Ob aktivaciji se stisne v sredino.", BC.citoskelet,
      [obroc], W([-(A - 0.12) * (1 - 0.55 * cilj) * 0.7, 0.03, (A - 0.12) * (1 - 0.55 * cilj) * 0.7]));
    const izb = (sk) => { const x = sk.seznam.reduce((a, b) => (vIzrezu(b.p) || (b.p.z - b.p.x > a.p.z - a.p.x) ? b : a)); return W(M(x.p, V(), 0.45).toArray()); };
    del("alfa-zrnca", "Alfa zrnca", "Najštevilnejša zrnca; vsebujejo beljakovine za strjevanje krvi (fibrinogen, von Willebrandov dejavnik) in rastne dejavnike, ki pomagajo celiti rano.", "#ff7ab8", [alfa.m], izb(alfa));
    del("gosta-zrnca", "Gosta zrnca", "Majhna zrnca s temnim jedrom iz kalcija, ADP in serotonina; ko se izločijo, privabijo in aktivirajo še več ploščic.", "#9fe6ff", [goste.m, gJedra], izb(goste));
    del("ocs", "Odprt kanalikularni sistem", "Razvejana mreža kanalčkov, ki so uvihana membrana; skozi odprtine na površini ploščica izloči vsebino zrnc.", "#bfa4ff", [ocs], W(kanali[0].pts[0].toArray()));
    del("gost-cevast-sistem", "Gost cevast sistem", "Tanke cevke (ostanek endoplazemskega retikuluma), v katerih je shranjen kalcij; ob aktivaciji ga sprostijo in sprožijo krčenje ploščice.", BC.zer, [dts], W(M(dtsP[0][3], V(), 0.3).toArray()));
    del("mitohondrij", "Mitohondriji", "Nekaj majhnih mitohondrijev, ki dajejo energijo za spremembo oblike in izločanje. Notranja membrana je nagubana v kriste.", BC.mitohondrij, [mito.m], izb(mito));
  }
  const nadzor = [
    {
      tip: "izbira", id: "stanje", oznaka: "Stanje", moznosti: [["mirujoca", "Mirujoča"], ["aktivirana", "Aktivirana"]], vrednost: "mirujoca",
      ob: (v) => { cilj = v === "aktivirana" ? 1 : 0; if (!gib || !korakTece) { t = cilj; posodobi(); } postaviDele(); },
    },
  ];
  let korakTece = false;
  const zac = ctx.zacetek && ctx.zacetek.stanje;
  if (zac === "aktivirana") { nadzor[0].vrednost = zac; cilj = t = 1; posodobi(); }
  postaviDele();

  // vlažen videz in relief (enote so µm); filopodiji in ploščica se pretapljajo, zato poliramo vse dele, tudi skrite
  if (!vsiDeli.has("filopodiji")) vsiDeli.set("filopodiji", { id: "filopodiji", barva: "#a8b4ff", meshes: [filo] });
  const vsi = [...vsiDeli.values()];
  kit.poliraj(group, vsi, {
    citoplazma: { tex: "fino", rf: 26, k: 1.1, b: 0.24, lisa: 0.22, f: 2.6 },
    receptorji: { tex: "zrna", rf: 300, k: 0.5 },
    glikogen: { tex: null },
    obroc: { tex: null },
    "alfa-zrnca": { tex: "zrna", rf: 70, k: 0.8, b: 0.2 },
    "gosta-zrnca": { tex: null },
    ocs: { tex: "fino", rf: 60, k: 0.7 },
    "gost-cevast-sistem": { tex: "fino", rf: 60, k: 0.6 },
    mitohondrij: { tex: "zrna", rf: 140, k: 0.7, b: 0.18 },
  });
  // stikalo »Barve kot v učbeniku« (po poliranju); filopodiji so v seznamu le pri aktivirani ploščici, zato jih damo posebej
  const ucb = kit.barveUcbenika(vsi, { receptorji: "#3a6fd8", filopodiji: "#e8809a", glikogen: "#d8c8f0", obroc: "#4fa3d8", "alfa-zrnca": "#a85cc8", "gosta-zrnca": "#2a2060",
    ocs: "#f0b0c8", "gost-cevast-sistem": "#35c4b0" });
  nadzor.push(ucb);

  return {
    group,
    oder: "celica",
    pogled: [-0.47, 0.34, 0.81], // smer kamere: yaw −30°, pitch 20° (odrezani del proti gledalcu)
    deli,
    nadzor,
    get merilo() { const um = 2 / s; return { m: um * 1e-6, oznaka: oznaka(um) }; },
    korak(cas, dt) {
      korakTece = true;
      if (!gib) return;
      if (t !== cilj) {
        t = cilj > t ? Math.min(cilj, t + (dt || 1 / 60) / 1.2) : Math.max(cilj, t - (dt || 1 / 60) / 1.2);
        posodobi();
        if (t === cilj) postaviDele();
      }
      group.rotation.y = Math.sin(cas * 0.15) * 0.05;
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
