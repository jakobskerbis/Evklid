// Čašasta celica med dvema prerezanima valjastima sosedama; zrnca sluzi zapolnijo čašo (teko) in se izločijo na vrhu.
// Pogodba graditelja: docs/3d.md. THREE pride od kompleta; skupni videz celic iz public/3d/celice-videz.js.
// Zgrajena je v µm in nato umerjena v enotsko kroglo.
import { videzCelic, BARVE as BC } from "../../celice-videz.js";

export const info = {
  id: "celica-casasta",
  naslov: "Čašasta celica",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Celica v obliki čaše med valjastimi celicami črevesnega epitelija. Zgornji razširjeni del (teka) je poln zrnc sluzi, jedro je stisnjeno v ozkem dnu. Sluz prekrije in varuje površino črevesa. Zrnc in organelov je manj kot v resnici.",
  poskusi: "Tapni sluzna zrnca in opazuj, kje celica izloča sluz.",
  merilo: { m: 29e-6, oznaka: "29 µm" },
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
  const _bela = new THREE.Color(0xffffff);
  // dvosloj fosfolipidov: temni glavi ob obeh straneh, svetlejši rep v sredini
  const DVOSLOJ = (b) => { const c = new THREE.Color(b); return [[0, 0.2, c.clone().multiplyScalar(0.58)], [0.34, 0.66, c.clone().lerp(_bela, 0.42)], [0.8, 1, c.clone().multiplyScalar(0.58)]]; };
  // dvojna ovojnica (jedro, mitohondrij): dva dvosloja z ozkim presledkom med njima
  const DVOJNA = (b, vmes) => { const c = new THREE.Color(b), g = c.clone().multiplyScalar(0.55), r = c.clone().lerp(_bela, 0.35), v = new THREE.Color(vmes); return [[0, 0.07, g], [0.12, 0.24, r], [0.29, 0.31, g], [0.38, 0.62, v], [0.69, 0.71, g], [0.76, 0.88, r], [0.93, 1, g]]; };
  // celična stena: celulozna vlakna (rahle proge), na zunanji strani temnejša srednja lamela
  const STENA = (b) => { const c = new THREE.Color(b); return [[0, 0.1, c.clone().lerp(_bela, 0.18)], [0.2, 0.42, c.clone()], [0.5, 0.58, c.clone().multiplyScalar(0.9)], [0.66, 0.86, c.clone().lerp(_bela, 0.1)], [0.93, 1, c.clone().multiplyScalar(0.62)]]; };
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
  // pore jedrne ovojnice: na prerezu presledki v obeh membranah na približno enakih razdaljah
  const porePrereza = (n, barva) => { const c = new THREE.Color(barva); return (t, k) => (Math.abs(((t * n + k * 0.37) % 1) - 0.5) < 0.045 && t > 0.04 && t < 0.96 ? c : null); };
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
  // Barve oglišč kot množilnik okoli 1 (material obdrži svojo barvo): rahle lise iz šuma, po želji toplejše/hladnejše.
  // Material mora imeti vertexColors: true in ga ne sme deliti z geometrijo brez barv.
  // mnozi: true pomnoži obstoječe barve oglišč (npr. iz pobarvaj) namesto da jih zamenja.
  function lise(g, { j = 0.14, fr = 3, odtenek = 0.04, temno = null, mnozi = false } = {}) {
    const p = g.attributes.position, a = new Float32Array(p.count * 3), st = mnozi && g.attributes.color;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i), n = fbm(x * fr + 3.1, y * fr - 0.7, z * fr + 1.9), h = sum(x * fr * 0.5 - 4, y * fr * 0.5 + 2, z * fr * 0.5);
      const k = (1 + n * j) * (temno ? temno(x, y, z) : 1);
      a[i * 3] = k * (1 + h * odtenek); a[i * 3 + 1] = k; a[i * 3 + 2] = k * (1 - h * odtenek);
      if (st) { a[i * 3] *= st.getX(i); a[i * 3 + 1] *= st.getY(i); a[i * 3 + 2] *= st.getZ(i); }
    }
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
  function del(id, ime, opis, barva, meshes, tocka) {
    meshes.forEach((m) => { m.userData.del = id; });
    deli.push({ id, ime, opis, barva, meshes, tocka });
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

  const H = 20, w = 3.9, GAP = 0.18;
  const gladko = (a, b, x) => { const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const rG = (y) => 1.55 + 2.2 * gladko(6.8, 13.8, y) - 0.75 * gladko(16.8, 20, y); // polmer čaše na višini y
  // profil čaše (d, y) od središča dna prek boka do vrha
  const prof = (() => {
    const t = [[0, 0]], kb = 0.5, kt = 0.5;
    t.push([rG(0) - kb, 0]);
    for (let i = 1; i <= 6; i++) { const a = -Math.PI / 2 + (i / 6) * Math.PI / 2; t.push([rG(0) - kb + kb * Math.cos(a), kb + kb * Math.sin(a)]); }
    for (let i = 1; i <= 60; i++) { const y = kb + (H - kt - kb) * (i / 60); t.push([rG(y), y]); }
    const rt = rG(H - kt);
    for (let i = 1; i <= 6; i++) { const a = (i / 6) * Math.PI / 2; t.push([rt - kt + kt * Math.cos(a), H - kt + kt * Math.sin(a)]); }
    for (let i = 1; i <= 10; i++) { const d = (rt - kt) * (1 - i / 10); t.push([d, H + 0.35 * (1 - (d / (rt - kt)) ** 2)]); }
    const L = [0];
    for (let i = 1; i < t.length; i++) L.push(L[i - 1] + Math.hypot(t[i][0] - t[i - 1][0], t[i][1] - t[i - 1][1]));
    return (v, k = 0) => {
      const s = THREE.MathUtils.clamp(v, 0, 1) * L[L.length - 1];
      let i = 1; while (i < L.length - 1 && L[i] < s) i++;
      const f = (s - L[i - 1]) / (L[i] - L[i - 1] || 1);
      const d = t[i - 1][0] + (t[i][0] - t[i - 1][0]) * f, y = t[i - 1][1] + (t[i][1] - t[i - 1][1]) * f;
      return [Math.max(0, d - k), k ? k + y * (1 - 2 * k / H) : y];
    };
  })();
  const vrhG = H + 0.35;
  const casa = (k, hrup = 0.015) => (u, v, p) => {
    const th = Math.PI + Math.PI * u, [d, y] = prof(v, k);
    p.set(d * Math.cos(th), y, d * Math.sin(th));
    const n = fbm(p.x * 0.6 + 3, p.y * 0.6, p.z * 0.6);
    return p.set(p.x * (1 + hrup * n), p.y + 0.04 * n, p.z * (1 + hrup * n));
  };
  const svet = new THREE.Group(); group.add(svet);

  // ---------- čašasta celica: odprta spredaj, membrana je steklena ----------
  const memMat = mat("#f0a0aa", { side: THREE.DoubleSide, roughness: 0.5 });
  const mem = new THREE.Mesh(ploskev(casa(0), hi ? 64 : 30, hi ? 120 : 52, true), memMat);
  // notranja stena: temna (zadaj in ob dnu še temnejša, navidezna senca), da organeli in zrnca izstopijo
  const cit = new THREE.Mesh(lise(ploskev(casa(0.12, 0.01), hi ? 48 : 22, hi ? 100 : 44, true), { j: 0.2, fr: 0.45, odtenek: 0.05, temno: (x, y, z) => (0.62 + 0.38 * THREE.MathUtils.smoothstep(z, -3.5, -0.4)) * (0.8 + 0.2 * THREE.MathUtils.smoothstep(y, 0, 2.5)) }),
    mat(0x4a2a6e, { vertexColors: true, roughness: 0.62, clearcoat: 0.25, sheen: 0.3, side: THREE.BackSide }));
  // debela membrana na ploskvi prereza z = 0 (debelina povečana); neprosojna, da se vidi dvosloj
  const PLASTI_MEM = [[0, 0.2, new THREE.Color(0x8a2a5e)], [0.34, 0.66, new THREE.Color(0xffe2ee)], [0.8, 1, new THREE.Color(0x8a2a5e)]];
  const trakCase = (u) => { const A = [], B = [], N = hi ? 110 : 50; for (let i = 0; i <= N; i++) { const v = i / N; A.push(casa(0.12, 0.01)(u, v, V()).setZ(0.012)); B.push(casa(0)(u, v, V()).setZ(0.012)); } return trakPlasti(A, B, V(0, 0, 1), PLASTI_MEM); };
  const memRob = new THREE.Mesh(zdruziPlasti([trakCase(0), trakCase(1)]), matPlasti({ roughness: 0.45, clearcoat: 0.5 }));
  memRob.material.userData.rez = true;
  svet.add(mem, cit, memRob);
  // beljakovine v membrani (receptorji, kanalčki, glikoproteini)
  const bTocke = kit.posej(mem, hi ? 260 : 90, (p) => p.z < -0.08 && p.y > 0.3).map((t) => { if (t.n.x * t.p.x + t.n.z * t.p.z < 0) t.n.negate(); return t; });
  const belj = kit.beljakovine(bTocke, BC.beljakovine, 0.045, { visina: 1.3 });
  svet.add(belj);

  // ---------- sosednji valjasti celici (enterocita), ki objemata čašo (prerezani na z = 0 in x = ±8) ----------
  const xin = (y, z) => { const r = rG(Math.min(y, H)) + GAP; return Math.sqrt(Math.max(0, r * r - z * z)) + GAP / 2; };
  const MITO_PL = [[0, 0.28, new THREE.Color(0xb4621a)], [0.4, 0.6, new THREE.Color(0xffe6b0)], [0.72, 1, new THREE.Color(0xe8a032)]];
  const OVOJ = (svet2) => [[0, 0.07, new THREE.Color(0x34107a)], [0.12, 0.24, new THREE.Color(0xc39af5)], [0.29, 0.31, new THREE.Color(0x34107a)], [0.38, 0.62, new THREE.Color(svet2)], [0.69, 0.71, new THREE.Color(0x34107a)], [0.76, 0.88, new THREE.Color(0xc39af5)], [0.93, 1, new THREE.Color(0x34107a)]];
  const PLASTI_SOS = [[0, 0.2, new THREE.Color(0x5a32b8)], [0.34, 0.66, new THREE.Color(0xeee6ff)], [0.8, 1, new THREE.Color(0x5a32b8)]];
  const sosGeo = [];
  for (const sx of [-1, 1]) {
    const X = (x) => sx * x; // gradimo za levo (x < 0) in zrcalimo
    const notr = (u, v, p) => { const z = -w * (1 - u), y = H * v; return p.set(X(-xin(y, z)), y, z); };
    const zad = (u, v, p) => { const y = H * v, x = -8 + (8 - xin(y, -w)) * u; return p.set(X(x), y, -w); };
    const zgo = (u, v, p) => { const z = -w * (1 - v), x = -8 + (8 - xin(H, z)) * u; return p.set(X(x), H + 0.04 * sum(x, z, 1), z); };
    const capZ = (u, v, p) => { const y = H * v, x = -8 + (8 - xin(y, 0) - 0.01) * u; return p.set(X(x), y, 0); };
    const capX = (u, v, p) => p.set(X(-8), H * v, -w * u);
    const zr = sx > 0; // zrcaljenje obrne ploskve; material je dvostranski
    sosGeo.push(pobarvaj(ploskev(notr, hi ? 40 : 14, hi ? 90 : 36, zr), 0xe6a2a6), pobarvaj(ploskev(zad, hi ? 10 : 6, hi ? 50 : 24, zr), 0xe6a2a6), pobarvaj(ploskev(zgo, hi ? 12 : 6, hi ? 8 : 4, zr), 0x8577d0));
    sosGeo.push(pobarvaj(ploskev(capZ, hi ? 8 : 4, hi ? 80 : 32), 0xb06a70), pobarvaj(ploskev(capX, hi ? 6 : 4, hi ? 40 : 24), 0xb06a70));
    const elipsa = (cx2, cy, a, b, ravnina, zac = -Math.PI / 2, kon = Math.PI / 2) => (u, v, p) => {
      const ang = zac + (kon - zac) * u, x = a * v * Math.cos(ang), y = cy + b * v * Math.sin(ang);
      return ravnina === "z" ? p.set(X(cx2 + x), y, 0.025) : p.set(X(-8 - 0.025), y, -x);
    };
    sosGeo.push(pobarvaj(ploskev(elipsa(-8, 6.8, 2.0, 3.5, "z"), 16, 6), 0xa565f0), pobarvaj(ploskev(elipsa(-8, 6.8, 2.0, 3.5, "x"), 16, 6), 0xa565f0));
    sosGeo.push(pobarvaj(ploskev(elipsa(-7.6, 7.6, 0.55, 0.6, "z", 0, Math.PI * 2), 12, 3), 0x37128c));
    for (const [mx, my, ra, rb] of [[-6.2, 16.5, 0.28, 0.8], [-5.0, 2.2, 0.28, 0.75], [-4.6, 14.4, 0.3, 0.7], [-6.6, 12.4, 0.3, 0.75], [-3.4, 4.0, 0.25, 0.7]]) {
      const e = (u, v, p) => { const ang = u * Math.PI * 2; return p.set(X(mx + ra * v * Math.cos(ang)), my + rb * v * Math.sin(ang), 0.03); };
      sosGeo.push(pobarvaj(ploskev(e, 10, 2), 0xffd67e));
      const A = [], B = []; // dvojna membrana mitohondrija
      for (let i = 0, n = hi ? 20 : 10; i <= n; i++) { B.push(e(i / n, 1, V()).setZ(0.036)); A.push(e(i / n, 0.72, V()).setZ(0.036)); }
      sosGeo.push(trakPlasti(A, B, V(0, 0, 1), MITO_PL));
    }
    for (const rv of ["z", "x"]) { // dvojna ovojnica jedra
      const e = elipsa(-8, 6.8, 2.0, 3.5, rv), A = [], B = [], np = rv === "z" ? V(0, 0, 1) : V(-sx, 0, 0);
      for (let i = 0, n = hi ? 40 : 24; i <= n; i++) { B.push(e(i / n, 1, V()).addScaledVector(np, 0.006)); A.push(e(i / n, 0.94, V()).addScaledVector(np, 0.006)); }
      sosGeo.push(trakPlasti(A, B, np, OVOJ(0xe8d6ff), porePrereza(7, 0xe8d6ff)));
    }
    // membrana sosede na obeh ploskvah prereza: trak ob robu, zamaknjen navznoter za TM
    const TM = 0.13, trak = (tocke, smer, np) => trakPlasti(tocke.map((p) => p.clone().addScaledVector(smer(p), TM).addScaledVector(np, 0.012)), tocke.map((p) => p.clone().addScaledVector(np, 0.012)), np, PLASTI_SOS);
    const nZ = V(0, 0, 1), nX = V(-sx, 0, 0), N = hi ? 36 : 24;
    const notranji = [], spodaj = [], zgoraj = [], xSp = [], xZg = [], xZad = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N, y = H * t;
      notranji.push(V(X(-xin(y, 0)), y, 0));
      spodaj.push(V(X(-8 + (8 - xin(0, 0)) * t), 0, 0)); zgoraj.push(V(X(-8 + (8 - xin(H, 0)) * t), H, 0));
      xSp.push(V(X(-8), 0, -w * t)); xZg.push(V(X(-8), H, -w * t)); xZad.push(V(X(-8), y, -w));
    }
    sosGeo.push(trak(notranji, () => V(-sx, 0, 0), nZ), trak(spodaj, () => V(0, 1, 0), nZ), trak(zgoraj, () => V(0, -1, 0), nZ));
    sosGeo.push(trak(xSp, () => V(0, 1, 0), nX), trak(xZg, () => V(0, -1, 0), nX), trak(xZad, () => V(0, 0, 1), nX));
  }
  const sosedi = new THREE.Mesh(lise(zdruzi(sosGeo, true), { j: 0.24, fr: 0.7, odtenek: 0.05, mnozi: true }), mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.45, clearcoatRoughness: 0.2, sheen: 0.35, side: THREE.DoubleSide }));
  svet.add(sosedi);

  // ---------- mikrovili: gosti na sosedah, redki in kratki na vrhu čašaste celice; v vsakem snop aktina ----------
  const mvGeo = new THREE.CapsuleGeometry(0.05, 0.9, hi ? 2 : 1, hi ? 6 : 4); mvGeo.translate(0, 0.45, 0);
  const jgGeo = new THREE.CylinderGeometry(0.016, 0.016, 1.4, 3, 1, true); jgGeo.translate(0, 0.18, 0);
  const mvT = [];
  const kM = hi ? 0.22 : 0.43;
  for (let x = -8 + kM / 2; x < 8; x += kM) for (let z = -w + kM / 2; z < -0.02; z += kM * 0.87) {
    const xx = x + (rnd() - 0.5) * kM * 0.35, zz = z + (rnd() - 0.5) * kM * 0.35 + ((Math.round((x + 8) / kM) % 2) * kM * 0.43);
    if (zz > -0.03 || zz < -w + 0.04) continue;
    const ax = Math.abs(xx), meja = xin(H, zz);
    if (ax > meja + 0.12 && ax < 7.95) mvT.push([V(xx, H - 0.02, zz), 1]);
    else if (ax < rG(H - 0.5) - 0.7 && rnd() < (hi ? 0.18 : 0.3)) mvT.push([V(xx, H + 0.35 * (1 - (Math.hypot(xx, zz) / (rG(H - 0.5) - 0.5)) ** 2) - 0.05, zz), 0.45]);
  }
  const mv = new THREE.InstancedMesh(mvGeo, kit.steklo(mat(0xb4a8ff, { side: THREE.FrontSide }), { a: 0.34, rf: 30, k: 0.4, rob: "#c4c0ff", rk: 1.25, difuzno: 0.45, iri: 0.4 }), mvT.length);
  const jedraMv = new THREE.InstancedMesh(jgGeo, mat(BC.aktin, { roughness: 0.3, clearcoat: 0.6, emissive: new THREE.Color(BC.aktin).multiplyScalar(0.45) }), mvT.length);
  mvT.forEach(([p, h], i) => { o.position.copy(p); o.rotation.set((rnd() - 0.5) * 0.1, 0, (rnd() - 0.5) * 0.1); o.scale.set(1, h * (0.9 + rnd() * 0.25), 1); o.updateMatrix(); mv.setMatrixAt(i, o.matrix); jedraMv.setMatrixAt(i, o.matrix); });
  svet.add(jedraMv, mv);

  // ---------- tesni stiki: pas tik pod vrhom, kjer se čašasta celica stika s sosedama ----------
  const tjGeo = [];
  for (let k = 0; k < 3; k++) {
    const pts = [];
    for (let i = 0; i <= 60; i++) {
      const th = Math.PI + Math.PI * (i / 60), y = H - 0.45 - k * 0.22 + 0.06 * Math.sin(i * 0.9 + k * 2), r = rG(y) + GAP * 0.5;
      pts.push(V(r * Math.cos(th), y, Math.min(-0.02, r * Math.sin(th))));
    }
    tjGeo.push(nit(pts, 0.06, hi ? 140 : 80, hi ? 5 : 4));
  }
  const tesni = new THREE.Mesh(zdruzi(tjGeo), mat(0x1fd6a8, { roughness: 0.35, clearcoat: 0.7, emissive: new THREE.Color(0x0a4a3a) }));
  svet.add(tesni);

  // ---------- košara iz vmesnih filamentov (keratin) okoli teke ----------
  const kerK = [];
  for (let i = 0; i < (hi ? 9 : 6); i++) { // poldnevniki po steni teke
    const th = Math.PI + 0.12 + (Math.PI - 0.24) * (i / ((hi ? 9 : 6) - 1)), pts = [];
    for (let j = 0; j <= 6; j++) { const y = 8.6 + (H - 1.0 - 8.6) * (j / 6), r = rG(y) - 0.24; pts.push(V(r * Math.cos(th + 0.1 * Math.sin(j + i)), y, Math.min(-0.06, r * Math.sin(th + 0.1 * Math.sin(j + i))))); }
    kerK.push(new THREE.CatmullRomCurve3(pts));
  }
  for (let j = 0; j < (hi ? 7 : 5); j++) { // obroči
    const y = 9.2 + (H - 2 - 9.2) * (j / ((hi ? 7 : 5) - 1)), r = rG(y) - 0.22, pts = [];
    for (let i = 0; i <= 10; i++) { const th = Math.PI + 0.06 + (Math.PI - 0.12) * (i / 10); pts.push(V(r * Math.cos(th), y + 0.18 * Math.sin(i * 1.3 + j), Math.min(-0.06, r * Math.sin(th)))); }
    kerK.push(new THREE.CatmullRomCurve3(pts));
  }
  const keratin = kit.vlakna(kerK, 0.04, "#ea9cff", { sij: 0.45, seg: hi ? 40 : 18, rad: 3 });
  svet.add(keratin);

  // ---------- jedro v ozkem dnu (sploščeno, prerezano) ----------
  const J = V(0, 3.7, 0), ja = 1.2, jb = 1.9;
  const jOb = (t, f) => { const p = V(ja * Math.sin(t) * Math.cos(f), jb * Math.cos(t), ja * Math.sin(t) * Math.sin(f)); if (p.y > 0) p.y *= 0.75; return p.multiplyScalar(1 + 0.04 * sum(p.x * 2 + 2, p.y * 2, p.z * 2)); };
  const jedro = new THREE.Mesh(ploskev((u, v, p) => p.copy(jOb(Math.PI * v, Math.PI + Math.PI * u)).add(J), q(36), q(40), true), mat(BC.jedro, { roughness: 0.4, clearcoat: 0.6 }));
  const jCap = ploskev((u, v, p) => { const a = u * Math.PI * 2, b = jOb(Math.PI / 2 - Math.sin(a) * Math.PI / 2, Math.cos(a) > 0 ? 0 : Math.PI); return p.set(b.x * v * 0.985, b.y * v * 0.985, 0).add(J); }, q(48), q(14));
  { // gost kromatin (temne lise, več ob ovojnici)
    const p = jCap.attributes.position, col = new Float32Array(p.count * 3), a = new THREE.Color(0xa874f6), b = new THREE.Color(BC.kromatin), t = new THREE.Color();
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), rr = Math.hypot((x - J.x) / ja, (y - J.y) / jb);
      t.copy(a).lerp(b, THREE.MathUtils.clamp(sum(x * 3, y * 3, 5) * 0.8 + 0.3 + 0.5 * THREE.MathUtils.smoothstep(rr, 0.7, 0.97), 0, 0.92));
      col.set([t.r, t.g, t.b], i * 3);
    }
    jCap.setAttribute("color", new THREE.BufferAttribute(col, 3));
  }
  const jPlo = new THREE.Mesh(jCap, mat(0xffffff, { vertexColors: true, roughness: 0.55, clearcoat: 0.35, side: THREE.DoubleSide }));
  const jOvoj = (() => { // dvojna jedrna ovojnica s porami na prerezu
    const A = [], B = [], N = hi ? 120 : 64;
    for (let i = 0; i <= N; i++) { const a = (i / N) * Math.PI * 2, b = jOb(Math.PI / 2 - Math.sin(a) * Math.PI / 2, Math.cos(a) > 0 ? 0 : Math.PI).setZ(0).multiplyScalar(0.985), l = b.length(); B.push(b.clone().add(J).setZ(0.014)); A.push(b.multiplyScalar(Math.max(0, 1 - 0.17 / l)).add(J).setZ(0.014)); }
    return new THREE.Mesh(trakPlasti(A, B, V(0, 0, 1), OVOJ(0xe8d6ff), porePrereza(10, 0xe8d6ff)), matPlasti({ roughness: 0.5, clearcoat: 0.4 }));
  })();
  jOvoj.material.userData.rez = true;
  const jcG = new THREE.SphereGeometry(0.36, q(20), q(14));
  deformiraj(jcG, (v) => { v.multiplyScalar(1 + 0.12 * fbm(v.x * 8, v.y * 8, v.z * 8)); v.z *= 0.55; });
  const jedrce = new THREE.Mesh(jcG, mat(BC.jedrce, { roughness: 0.5, clearcoat: 0.5 }));
  jedrce.position.set(0.3, 3.9, 0);
  svet.add(jedro, jPlo, jOvoj, jedrce);

  // ---------- zrnati ER ob jedru in nad njim (cisterne z odprtinami, zlati ribosomi) ----------
  const erLu = { f: 2.2, prag: 0.74 };
  const erGeo = [], ribT = [];
  for (let i = 0; i < 4; i++) {
    const r = 0.75 + i * 0.27;
    const f = (u, v, p) => { const a = Math.PI * 1.08 + Math.PI * 0.84 * u, y = 5.4 + 2.4 * v; const rr = Math.min(r, rG(y) - 0.35); return p.set(rr * Math.cos(a), y + 0.08 * Math.sin(a * 5 + i), rr * Math.sin(a)); };
    erGeo.push(ploskev(f, q(30), q(14)));
    for (let k = 0; k < (hi ? 90 : 40); k++) { const p = f(rnd(), rnd(), V()); if (kit.vLuknji(p, erLu)) continue; const d = V(p.x, 0, p.z).normalize().multiplyScalar(rnd() < 0.5 ? 0.06 : -0.06); ribT.push(p.add(d)); }
  }
  for (let i = 0; i < 3; i++) { // ob boku jedra
    const f = (u, v, p) => { const a = Math.PI * 1.15 + Math.PI * 0.7 * u, y = 1.2 + 3.6 * v, rr = 1.32 + i * 0.09; return p.set(rr * Math.cos(a), y, rr * Math.sin(a)); };
    erGeo.push(ploskev(f, q(20), q(10)));
    for (let k = 0; k < (hi ? 40 : 18); k++) { const p = f(rnd(), rnd(), V()); if (kit.vLuknji(p, erLu)) continue; const d = V(p.x, 0, p.z).normalize().multiplyScalar(rnd() < 0.5 ? 0.06 : -0.06); ribT.push(p.add(d)); }
  }
  const zer = new THREE.Mesh(zdruzi(erGeo), kit.sencilo(mat(0x3550d8, { roughness: 0.38, clearcoat: 0.35, clearcoatRoughness: 0.12, sheen: 0, side: THREE.DoubleSide }), { vr: 2, rf: 7, k: 0.6, b: 0.22, s: 0.1, luknje: erLu }));
  const rib = new THREE.InstancedMesh(hi ? new THREE.IcosahedronGeometry(0.06, 0) : new THREE.OctahedronGeometry(0.068, 0), mat(BC.ribosomi, { roughness: 0.28, clearcoat: 0.9, emissive: new THREE.Color(BC.ribosomi).multiplyScalar(0.22) }), ribT.length);
  ribT.forEach((p, i) => { o.position.copy(p); o.rotation.set(rnd() * 3, rnd() * 3, 0); o.scale.setScalar(0.8 + rnd() * 0.45); o.updateMatrix(); rib.setMatrixAt(i, o.matrix); });
  svet.add(zer, rib);

  // ---------- velik Golgijev aparat v obliki skodelice pod teko; na vrhu brstijo nezrela zrnca sluzi ----------
  const golGeo = [];
  for (let i = 0; i < 6; i++) {
    const y0 = 8.1 + i * 0.3, R = Math.min(rG(y0) - 0.35, 1.5 + i * 0.12);
    const f = (u, v, p) => { const a = Math.PI * 1.05 + Math.PI * 0.9 * u, rr = R * (0.35 + 0.65 * v); return p.set(rr * Math.cos(a), y0 + 0.45 * (rr / R) ** 2, rr * Math.sin(a)); };
    const b = i % 2 ? BC.golgiSvetel : BC.golgi;
    golGeo.push(pobarvaj(ploskev(f, q(26), 6), b), pobarvaj(ploskev(odmik(f, 0.08), q(26), 6, true), b));
    // odebeljen rob cisterne (tam se odcepljajo mešički)
    const rb = []; for (let k = 0; k <= 12; k++) rb.push(f(k / 12, 1, V()).add(V(0, 0.04, 0)));
    golGeo.push(pobarvaj(nit(rb, 0.07, hi ? 30 : 16, hi ? 6 : 4), b));
  }
  for (let i = 0; i < 16; i++) { // prenašalni mešički (zlati) in nezrela zrnca sluzi (svetlo modra) na vrhu sklada
    const nezr = i >= 9, a = Math.PI * (1.1 + rnd() * 0.8), r = 0.5 + rnd() * 1.5, y = nezr ? 10.0 + rnd() * 0.6 : 7.7 + rnd() * 2.2;
    const sp = new THREE.SphereGeometry(nezr ? 0.24 + rnd() * 0.08 : 0.12 + rnd() * 0.06, q(10), q(8));
    sp.translate(Math.min(r, rG(y) - 0.4) * Math.cos(a), y, Math.min(r, rG(y) - 0.4) * Math.sin(a));
    golGeo.push(pobarvaj(sp, nezr ? 0xbfe4ff : BC.golgiSvetel));
  }
  const golgi = new THREE.Mesh(zdruzi(golGeo, true), mat(0xffffff, { vertexColors: true, roughness: 0.4, clearcoat: 0.55, side: THREE.DoubleSide }));
  svet.add(golgi);

  // ---------- mitohondriji (malo, v dnu), s kristami in prerezano dvojno membrano ----------
  function mitohondrij() {
    const L = 1.3, r = 0.42, prof = [];
    for (let i = 0, nP = hi ? 14 : 8; i <= nP; i++) { const a = -Math.PI / 2 + (i / nP) * Math.PI; prof.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r + (a < 0 ? -L / 2 : L / 2))); }
    const zun = new THREE.LatheGeometry(prof, hi ? 13 : 6, 0.5 * Math.PI, 1.45 * Math.PI);
    const not = new THREE.LatheGeometry(prof.map((p) => new THREE.Vector2(p.x * 0.8, p.y * 0.9)), hi ? 13 : 6, 0.5 * Math.PI, 1.45 * Math.PI);
    const ix = not.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i]; ix[i] = ix[i + 2]; ix[i + 2] = t; }
    not.computeVertexNormals();
    const kr = [];
    for (let i = 0, nK = hi ? 6 : 4; i < nK; i++) {
      const y = -L / 2 - r * 0.45 + i * ((L + r * 0.9) / (nK - 1));
      const wd = Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, Math.abs(y) - L / 2) / r, 2))) * r * 0.6;
      const c = new THREE.BoxGeometry(wd * 1.5, 0.06, wd * 1.6);
      c.translate(i % 2 ? wd * 0.25 : -wd * 0.25, y, 0);
      kr.push(c);
    }
    const konca = [0.5 * Math.PI, 1.95 * Math.PI].map((phi, k) => {
      const A = [], B = [], sn = Math.sin(phi), cs = Math.cos(phi);
      for (const pt of prof.filter((_, i) => hi || i % 2 === 0 || i === prof.length - 1)) { B.push(V(pt.x * sn, pt.y, pt.x * cs)); A.push(V(pt.x * 0.8 * sn, pt.y * 0.9, pt.x * 0.8 * cs)); }
      const n = V(cs, 0, -sn).multiplyScalar(k ? 1 : -1);
      return trakPlasti(A, B, n, MITO_PL);
    });
    for (const [g, b] of [[zun, 0xd98a1e], [not, 0xf0b24a]]) pobarvaj(g, b);
    kr.forEach((g) => pobarvaj(g, 0xffd67e));
    return zdruziPlasti([zun, not, ...kr, ...konca]);
  }
  const mitPol = [V(-0.85, 1.0, -0.8), V(0.9, 1.5, -0.65), V(-1.05, 6.4, -0.6), V(0.95, 7.1, -0.9), V(-0.6, 5.0, -1.05), V(0.3, 8.6, -1.4)];
  const mit = new THREE.InstancedMesh(mitohondrij(), mat(0xffffff, { vertexColors: true, roughness: 0.38, side: THREE.DoubleSide }), mitPol.length);
  mitPol.forEach((p, i) => { o.position.copy(p); o.rotation.set(0.2 + (rnd() - 0.5) * 0.4, rnd() * 6, (rnd() - 0.5) * 0.6); o.scale.setScalar(0.6 + rnd() * 0.12); o.updateMatrix(); mit.setMatrixAt(i, o.matrix); });
  svet.add(mit);

  // ---------- zrnca sluzi (mucin) gosto zapolnijo teko ----------
  const zr = [];
  for (let t = 0; t < 30000 && zr.length < (hi ? 170 : 110); t++) {
    const y = 9.9 + rnd() * (H - 10.2), r = 0.42 + rnd() * 0.3, R = rG(y) - 0.2 - r;
    if (R < 0.2) continue;
    const a = Math.PI + rnd() * Math.PI, d = Math.sqrt(rnd()) * R;
    const p = V(d * Math.cos(a), y, Math.min(-r * 0.25, d * Math.sin(a)));
    if (Math.hypot(p.x, p.z) > R) continue;
    if (zr.some((g) => g.p.distanceTo(p) < (g.r + r) * 0.9)) continue;
    zr.push({ p, r });
  }
  const zrnca = new THREE.InstancedMesh(new THREE.SphereGeometry(1, hi ? 18 : 10, hi ? 14 : 7), mat(0xffffff, { roughness: 0.22, clearcoat: 0.9, clearcoatRoughness: 0.08, sheen: 0.3, sheenColor: new THREE.Color(0xb8e0ff) }), zr.length);
  const zc = new THREE.Color(), zb = new THREE.Color(0x6aaef0);
  zr.forEach((g, i) => { o.position.copy(g.p); o.rotation.set(0, 0, 0); o.scale.setScalar(g.r); o.updateMatrix(); zrnca.setMatrixAt(i, o.matrix); zrnca.setColorAt(i, zc.copy(zb).multiplyScalar(0.8 + 0.25 * rnd()).lerp(new THREE.Color(0xa8d8ff), rnd() * 0.45)); });
  svet.add(zrnca);
  // izločanje: zrnca blizu vrha potujejo skozi odprtino in se razlijejo v sluz
  const izl = zr.map((g, i) => ({ g, i })).filter(({ g }) => g.p.y > 16.5).sort((a, b) => b.g.p.y - a.g.p.y).slice(0, 6);
  izl.forEach((x, k) => { x.f = k / izl.length; });

  // ---------- sluz na površini (prosojna plast nad vrhom) ----------
  const sluzGeo = new THREE.SphereGeometry(1, q(48), q(24), 0, Math.PI * 2, 0, Math.PI / 2);
  deformiraj(sluzGeo, (v) => { const n = fbm(v.x * 2 + 1, v.y * 2, v.z * 2); v.set(v.x * 4.6 * (1 + 0.08 * n), v.y * 1.4 * (1 + 0.15 * n), Math.min(0, v.z) * 3.4 * (1 + 0.08 * n)); });
  const sluz = new THREE.Mesh(sluzGeo, kit.steklo(mat(BC.sluz, { side: THREE.FrontSide }), { a: 0.22, rf: 6, k: 0.5, rob: "#cfeeff", rk: 1.2, difuzno: 0.5 }));
  sluz.position.set(0, vrhG + 0.75, -0.05);
  svet.add(sluz);
  function izlocanje(t) {
    for (const x of izl) {
      const u = (x.f + t / 7) % 1, g = x.g;
      const cilj = V(0, vrhG + 0.3, -0.6);
      let s2 = g.r;
      o.position.copy(g.p).lerp(cilj, gladko(0, 0.6, u));
      if (u > 0.6) { s2 = g.r * (1 - gladko(0.6, 0.95, u)); o.position.y += 0.9 * gladko(0.6, 0.95, u); }
      o.rotation.set(0, 0, 0); o.scale.setScalar(Math.max(0.001, s2)); o.updateMatrix(); zrnca.setMatrixAt(x.i, o.matrix);
    }
    zrnca.instanceMatrix.needsUpdate = true;
    sluz.scale.set(1, 1 + 0.06 * Math.sin(t * 0.9), 1);
  }

  // ---------- bazalna membrana (bazalna lamina iz kolagena IV in laminina) ----------
  const bm = new THREE.BoxGeometry(16.4, 0.4, 4.4, hi ? 80 : 34, 1, hi ? 22 : 9);
  bm.translate(0, -0.34, -2.2);
  deformiraj(bm, (v) => { if (v.y > -0.2) v.y += 0.035 * fbm(v.x * 1.5, 0, v.z * 1.5); });
  const bazalna = new THREE.Mesh(bm, mat(0x2f9a88, { roughness: 0.55, clearcoat: 0.35, sheen: 0.4 }));
  const bmK = [];
  for (let i = 0; i < (hi ? 110 : 40); i++) {
    const p = V((rnd() * 2 - 1) * 8, -0.12, -0.15 - rnd() * 4.1), sm = V(rnd() - 0.5, 0, rnd() - 0.5).normalize(), pts = [];
    for (let j = 0; j < 4; j++) pts.push(p.clone().addScaledVector(sm, (j - 1.5) * 0.5).add(V(0, 0.03 * Math.sin(j * 2 + i), 0)));
    if (pts.some((x) => Math.abs(x.x) > 8.1 || x.z > -0.05 || x.z < -4.35)) continue;
    bmK.push(new THREE.CatmullRomCurve3(pts));
  }
  const bmVl = kit.vlakna(bmK, 0.03, "#9ff5dc", { sij: 0.3, seg: hi ? 10 : 5, rad: 3 });
  svet.add(bazalna, bmVl);

  // drobni prosti ribosomi in temna zrnca citoplazme v ozkem dnu (točke)
  const prostiR = [], prah = [];
  for (let t = 0; (prostiR.length < (hi ? 260 : 120) || prah.length < (hi ? 900 : 400)) && t < 60000; t++) {
    const y = 0.4 + rnd() * 9.2, R = rG(y) - 0.3, a = Math.PI + rnd() * Math.PI, d = Math.sqrt(rnd()) * R;
    const p = V(d * Math.cos(a), y, Math.min(-0.08, d * Math.sin(a)));
    if (Math.hypot((p.x - J.x) / (ja + 0.12), (p.y - J.y) / (jb + 0.12)) < 1) continue;
    if (prostiR.length < (hi ? 260 : 120) && rnd() < 0.3) prostiR.push(p); else if (prah.length < (hi ? 900 : 400)) prah.push(p);
  }
  const ribP = kit.pike(prostiR, BC.ribosomi, 0.1, 0.4), prahP = kit.pike(prah, 0x2a1a48, 0.07, 0.5);
  svet.add(ribP, prahP);

  const s = umeri(svet, 0.985);
  for (const pt of [ribP, prahP]) pt.material.size *= s; // velikost točk je v enotah sveta
  const L = (x, y, z) => V(x, y, z).multiplyScalar(s).add(svet.position).toArray();
  const zv = zr.reduce((a, g) => (g.p.y > 12 && g.p.y < 15 && g.p.z > a.p.z ? g : a), zr[0]);

  del("zrnca-sluzi", "Zrnca sluzi", "Mešički, polni mucina, ki gosto zapolnijo teko; ko pridejo do vrha, se izpraznijo in mucin z vodo nabrekne v sluz.", BC.sluz, [zrnca], L(zv.p.x, zv.p.y, zv.p.z + zv.r));
  del("sluz", "Izločena sluz", "Spolzka plast na površini črevesa; varuje celice pred prebavnimi encimi in olajša drsenje hrane.", "#a9c9ef", [sluz], L(-2.4, vrhG + 1.3, -0.3));
  del("membrana", "Celična membrana", "Ovojnica čašaste celice iz dvosloja maščob z beljakovinami; na vrhu ima le malo mikrovilov, skozi njo se izloča sluz. Debelina membrane je povečana.", "#f0a0aa", [mem, memRob, belj], L(-rG(12), 12, -0.05));
  del("citoplazma", "Citoplazma", "Notranjost celice; v ozkem dnu je skoraj vsa zapolnjena z jedrom, zrnatim ER in Golgijevim aparatom.", "#6a4296", [cit], L(0.9, 3.0, -1.35));
  del("jedro", "Jedro", "Sploščeno jedro z gostim kromatinom, dvojno ovojnico in porami; zrnca sluzi ga potisnejo v ozko dno celice.", BC.jedro, [jedro, jPlo, jOvoj], L(-0.4, 3.3, 0.05));
  del("jedrce", "Jedrce", "Gosto območje v jedru, kjer nastajajo deli ribosomov.", BC.jedrce, [jedrce], L(0.3, 3.9, 0.2));
  del("zrnati-er", "Zrnati endoplazemski retikulum", "Sploščeni membranski mešički z ribosomi v dnu celice; tu nastaja beljakovina mucin.", BC.zer, [zer], L(-1.25, 6.5, -0.2));
  del("ribosomi", "Ribosomi", "Drobna zrnca na zrnatem ER in prosto v citoplazmi, ki sestavljajo beljakovino mucin.", BC.ribosomi, [rib, ribP], L(1.1, 6.0, -0.25));
  del("golgi", "Golgijev aparat", "Velik sklad sploščenih mešičkov v obliki skodelice pod teko; mucinu doda sladkorje in ga zapakira v zrnca sluzi.", BC.golgi, [golgi], L(-1.7, 9.4, -0.2));
  del("mitohondrij", "Mitohondriji", "Nekaj mitohondrijev z dvojno membrano in kristami v dnu celice daje energijo za izdelovanje in izločanje sluzi.", BC.mitohondrij, [mit], L(...mitPol[3].clone().add(V(0, 0, 0.3)).toArray()));
  del("mikrovili", "Mikrovili", "Sosednje valjaste celice imajo gost krtačasti obrobek mikrovilov, čašasta celica pa le nekaj kratkih.", "#b4a8ff", [mv], L(-5.5, H + 0.9, -0.2));
  del("aktin-mikrovilov", "Aktinska vlakna mikrovilov", "V vsakem mikrovilu je snop aktinskih vlaken, ki ga drži pokonci.", BC.aktin, [jedraMv], L(-4.5, H + 0.4, -0.3));
  del("tesni-stiki", "Tesni stiki", "Pas beljakovinskih niti tik pod vrhom, ki čašasto celico tesno zlepi s sosedama, da snovi ne zdrsnejo med celicami.", "#1fd6a8", [tesni], L(-rG(H - 0.5) - 0.1, H - 0.6, -0.6));
  del("keratin", "Košara iz keratina", "Mreža vmesnih filamentov (keratina) objema teko in jo drži v obliki čaše, ko se napolni z zrnci sluzi.", "#ea9cff", [keratin], L(rG(13) - 0.3, 13, -1.6));
  del("bazalna-membrana", "Bazalna membrana", "Tanka plast beljakovinskih vlaken (kolagena IV in laminina) pod epitelijem, na kateri celice stojijo.", "#2f9a88", [bazalna, bmVl], L(-1, -0.3, -0.02));
  del("sosednje-celice", "Sosednji valjasti celici", "Celici z mikrovili (enterocita), ki vsrkavata hranila; čašasta celica je stisnjena med njiju.", "#e6a2a6", [sosedi], L(-6.2, 9.5, 0.05));

  kit.poliraj(svet, deli, {
    citoplazma: { tex: "fino", rf: hi ? 9 : 6, k: hi ? 0.55 : 0.3, b: 0.2 },
    jedro: { tex: "zrna", rf: hi ? 10 : 7, k: hi ? 0.6 : 0.35, b: 0.2 },
    jedrce: { tex: "zrna", rf: 9, k: 0.8, b: 0.22 },
    mitohondrij: { tex: "zrna", rf: 6, k: 0.7, b: 0.18 },
    ribosomi: { tex: null },
    "aktin-mikrovilov": { tex: null },
    golgi: { tex: "fino", rf: 7, k: 0.6 },
    "zrnca-sluzi": { tex: "fino", rf: hi ? 7 : 5, k: hi ? 0.35 : 0.2, b: 0.12 },
    "tesni-stiki": { tex: "zrna", rf: 10, k: 0.6 },
    "bazalna-membrana": { tex: "vlakna", rf: 3, k: 0.8, b: 0.2 },
    "sosednje-celice": { tex: "fino", rf: hi ? 7 : 5, k: hi ? 0.45 : 0.25, b: 0.16 },
  });
  const nadzor = [kit.barveUcbenika(deli, { "zrnca-sluzi": "#cfe6f7", sluz: "#bfe0f5", mikrovili: "#e8809a", "aktin-mikrovilov": "#c0504a", "tesni-stiki": "#2fb89a",
    keratin: "#c49ad8", "bazalna-membrana": "#8fb0a8", "sosednje-celice": "#f0c8b0" })];

  return {
    group,
    oder: "celica",
    pogled: [-0.47, 0.34, 0.81], // smer kamere: yaw −30°, pitch 20° (odrezani del proti gledalcu)
    deli,
    nadzor,
    korak(t) {
      if (!gib) return;
      izlocanje(t);
      group.rotation.y = Math.sin(t * 0.15) * 0.04;
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
