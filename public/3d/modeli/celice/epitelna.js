// Epitelna celica z mikrovili (enterocit tankega črevesa) med dvema prerezanima sosedama.
// Pogodba graditelja: docs/3d.md. THREE pride od kompleta; skupni videz celic iz public/3d/celice-videz.js.
// Zgrajena je v µm in nato umerjena v enotsko kroglo.
import { videzCelic, BARVE as BC } from "../../celice-videz.js";

export const info = {
  id: "celica-epitelna",
  naslov: "Epitelna celica z mikrovili",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Visoka valjasta celica črevesnega epitelija (enterocit, približno 20 µm × 8 µm) med dvema prerezanima sosedama. Na vrhu ima gost krtačasti obrobek iz mikrovilov, ki močno poveča površino za vsrkavanje hranil. Mikrovilov in organelov je manj kot v resnici.",
  poskusi: "Tapni mikrovile in pomisli, zakaj črevo potrebuje tako veliko površino.",
  merilo: { m: 28e-6, oznaka: "28 µm" },
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

  // Golgijev aparat: ukrivljene sploščene cisterne (cis svetlejše, trans temnejše) in mehurčki ob koncih.
  function golgiGeo(n) {
    const zb = { pos: [], col: [], idx: [] };
    const mreza = (nU, nV, f, b) => {
      const off = zb.pos.length / 3, P = V();
      for (let j = 0; j <= nV; j++) for (let i = 0; i <= nU; i++) { f(i / nU, j / nV, P); zb.pos.push(P.x, P.y, P.z); const c = b(i / nU, j / nV); zb.col.push(c[0], c[1], c[2]); }
      for (let j = 0; j < nV; j++) for (let i = 0; i < nU; i++) { const a = off + j * (nU + 1) + i, c = a + nU + 1; zb.idx.push(a, c, a + 1, a + 1, c, c + 1); }
    };
    const gCis = new THREE.Color(BC.golgiSvetel), gTrans = new THREE.Color(0xd9781a), gRob = new THREE.Color(0xffeaa8), gC = new THREE.Color();
    const konci = [];
    for (let i = 0; i < n; i++) {
      const R = 0.26 - i * 0.022, L = Math.PI * (0.78 - i * 0.05), a0 = Math.PI * (0.11 + i * 0.025), W = 0.05 * (1 - i * 0.03), T = 0.0075;
      const prerez = (u, v) => {
        const s = 2 * u - 1, e = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(s), 6)), 0.3) * (1 + 0.7 * Math.pow(s, 4));
        const b = v * Math.PI * 2, cb = Math.cos(b), sb = Math.sin(b);
        return { cb, sb, rad: T * e * (1 + 3 * Math.pow(sb, 12)) * Math.sign(cb) * Math.pow(Math.abs(cb), 0.4), z: W * e * sb };
      };
      mreza(q(30), q(12), (u, v, P) => { const a = a0 + u * L, x = prerez(u, v), r = R + x.rad; P.set(Math.cos(a) * r, Math.sin(a) * r, x.z); },
        (u, v) => { const x = prerez(u, v); gC.copy(gCis).lerp(gTrans, i / Math.max(1, n - 1)).lerp(gRob, 0.3 * Math.pow(Math.abs(x.sb), 10)); const k = 0.84 + 0.16 * x.cb; return [gC.r * k, gC.g * k, gC.b * k]; });
      for (const u of [0, 1]) konci.push({ a: a0 + u * L + (u ? 1 : -1) * 0.12, r: R });
    }
    for (let k = 0; k < (hi ? 8 : 5); k++) {
      const kk = konci[(k * 3) % konci.length], c = V(Math.cos(kk.a) * kk.r, Math.sin(kk.a) * kk.r, (rnd() - 0.5) * 0.06), r = 0.017 + rnd() * 0.01, b = gC.copy(gCis).lerp(gTrans, 0.6);
      mreza(q(10), q(7), (u, v, P) => { P.set(Math.sin(Math.PI * v) * Math.cos(2 * Math.PI * u), Math.cos(Math.PI * v), Math.sin(Math.PI * v) * Math.sin(2 * Math.PI * u)).multiplyScalar(r).add(c); },
        (u, v) => { const t = 0.8 + 0.2 * Math.cos(Math.PI * v); return [b.r * t, b.g * t, b.b * t]; });
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(zb.pos, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(zb.col, 3));
    g.setIndex(zb.idx);
    g.computeVertexNormals();
    return g;
  }
  const H = 20, w = 3.9, KB = 0.7, KT = 0.55, DOME = 0.25, NSE = 5;
  const se = (th) => Math.pow(Math.pow(Math.abs(Math.cos(th)), NSE) + Math.pow(Math.abs(Math.sin(th)), NSE), -1 / NSE);
  // profil stebra (d od osi, y) z zaobljenima robovoma, enakomerno po dolžini
  function profil(wd, h, kb, kt, dome) {
    const t = [[0, 0]];
    t.push([wd - kb, 0]);
    for (let i = 1; i <= 8; i++) { const a = -Math.PI / 2 + (i / 8) * Math.PI / 2; t.push([wd - kb + kb * Math.cos(a), kb + kb * Math.sin(a)]); }
    t.push([wd, h - kt]);
    for (let i = 1; i <= 8; i++) { const a = (i / 8) * Math.PI / 2; t.push([wd - kt + kt * Math.cos(a), h - kt + kt * Math.sin(a)]); }
    for (let i = 1; i <= 10; i++) { const d = (wd - kt) * (1 - i / 10); t.push([d, h + dome * (1 - (d / (wd - kt)) ** 2)]); }
    const L = [0];
    for (let i = 1; i < t.length; i++) L.push(L[i - 1] + Math.hypot(t[i][0] - t[i - 1][0], t[i][1] - t[i - 1][1]));
    return (v) => {
      const s = THREE.MathUtils.clamp(v, 0, 1) * L[L.length - 1];
      let i = 1; while (i < L.length - 1 && L[i] < s) i++;
      const f = (s - L[i - 1]) / (L[i] - L[i - 1] || 1);
      return [t[i - 1][0] + (t[i][0] - t[i - 1][0]) * f, t[i - 1][1] + (t[i][1] - t[i - 1][1]) * f];
    };
  }
  const zunPr = profil(w, H, KB, KT, DOME), notPr = profil(w - 0.13, H - 0.13, KB - 0.1, KT - 0.1, DOME);
  const vrh = (d) => H + DOME * (1 - Math.min(1, d / (w - KT)) ** 2);
  const steber = (pr, cx, t0, t1, hrup = 0.012) => (u, v, p) => {
    const th = t0 + (t1 - t0) * u, [d, y] = pr(v), r = d * se(th);
    p.set(cx + r * Math.cos(th), y, r * Math.sin(th));
    const n = fbm(p.x * 0.5 + 3, p.y * 0.5, p.z * 0.5);
    return p.set(cx + (p.x - cx) * (1 + hrup * n), p.y + 0.05 * n, p.z * (1 + hrup * n));
  };
  const svet = new THREE.Group(); group.add(svet);

  // ---------- glavna celica: odprta spredaj (z > 0 odrezano) ----------
  // membrana je steklena: na vrhu se skoznjo vidijo korenine mikrovilov in terminalna mreža
  const memMat = kit.steklo(mat(BC.membrana, { side: THREE.FrontSide }), { a: 0.16, rf: 2.2, rob: "#8c9cff", rk: 1.3 });
  const mem = new THREE.Mesh(ploskev(steber(zunPr, 0, Math.PI, Math.PI * 2), q(64), q(100), true), memMat);
  // notranja stena: temnejša globlje (zadaj, ob dnu in vrhu) – navidezna senca
  const cit = new THREE.Mesh(lise(ploskev(steber(notPr, 0, Math.PI, Math.PI * 2, 0.008), q(48), q(80), true), { j: 0.2, fr: 0.45, odtenek: 0.05, temno: (x, y, z) => (0.62 + 0.38 * THREE.MathUtils.smoothstep(z, -w, -0.5)) * (0.8 + 0.2 * THREE.MathUtils.smoothstep(y, 0, 2.5) * (1 - THREE.MathUtils.smoothstep(y, H - 1.5, H))) }),
    mat(0x3d3182, { vertexColors: true, roughness: 0.62, clearcoat: 0.25, sheen: 0.3, side: THREE.BackSide }));
  // debela membrana na ploskvi prereza z = 0: trak med zunanjo in notranjo ploskvijo (debelina povečana)
  const PLASTI_MEM = [[0, 0.2, new THREE.Color(0x5a32b8)], [0.34, 0.66, new THREE.Color(0xeee6ff)], [0.8, 1, new THREE.Color(0x5a32b8)]];
  const trakStebra = (cx, th, ravnina, sx = 1) => {
    const A = [], B = [], N = hi ? 110 : 46;
    for (let i = 0; i <= N; i++) {
      const v = i / N, a = steber(notPr, cx, th, th, 0.008)(0, v, V()), b = steber(zunPr, cx, th, th)(0, v, V());
      if (ravnina === "x") { a.x = b.x = cx - sx * 0.012; } else { a.z = b.z = 0.012; }
      A.push(a); B.push(b);
    }
    return trakPlasti(A, B, ravnina === "x" ? V(-sx, 0, 0) : V(0, 0, 1), PLASTI_MEM);
  };
  const memRob = new THREE.Mesh(zdruziPlasti([trakStebra(0, Math.PI), trakStebra(0, Math.PI * 2)]), matPlasti({ roughness: 0.45, clearcoat: 0.5 }));
  memRob.material.userData.rez = true;
  svet.add(mem, cit, memRob);

  // ---------- sosednji celici: prerezani na ravninah z = 0 in x = ±8 ----------
  const sosGeo = [];
  const MITO_PL = [[0, 0.28, new THREE.Color(0xb4621a)], [0.4, 0.6, new THREE.Color(0xffe6b0)], [0.72, 1, new THREE.Color(0xe8a032)]];
  const OVOJ = (svet2) => [[0, 0.07, new THREE.Color(0x34107a)], [0.12, 0.24, new THREE.Color(0xc39af5)], [0.29, 0.31, new THREE.Color(0x34107a)], [0.38, 0.62, new THREE.Color(svet2)], [0.69, 0.71, new THREE.Color(0x34107a)], [0.76, 0.88, new THREE.Color(0xc39af5)], [0.93, 1, new THREE.Color(0x34107a)]];
  for (const [cx, t0, t1, sx] of [[-8, Math.PI * 1.5, Math.PI * 2, 1], [8, Math.PI, Math.PI * 1.5, -1]]) {
    sosGeo.push(pobarvaj(ploskev(steber(zunPr, cx, t0, t1), hi ? 24 : 10, hi ? 80 : 34, true), 0x7a6cc8));
    // ploskev prereza z = 0 in x = cx
    const kz = (u, v, p) => { const [d, y] = zunPr(v); return p.set(cx + sx * u * d * 0.998, y, 0); };
    const kx = (u, v, p) => { const [d, y] = zunPr(v); return p.set(cx, y, -u * d * 0.998); };
    sosGeo.push(pobarvaj(ploskev(kz, hi ? 6 : 4, hi ? 70 : 30), 0x4a3c96), pobarvaj(ploskev(kx, hi ? 6 : 4, hi ? 70 : 30), 0x4a3c96));
    // prerez jedra in nekaj mitohondrijev na obeh ploskvah
    const elipsa = (cx2, cy, a, b, ravnina, zac = -Math.PI / 2, kon = Math.PI / 2) => (u, v, p) => {
      const ang = zac + (kon - zac) * u, x = a * v * Math.cos(ang), y = cy + b * v * Math.sin(ang);
      return ravnina === "z" ? p.set(cx2 + sx * x, y, 0.025) : p.set(cx - sx * 0.025, y, -x);
    };
    sosGeo.push(pobarvaj(ploskev(elipsa(cx, 6.8, 2.1, 3.6, "z"), 16, 6), 0xa565f0), pobarvaj(ploskev(elipsa(cx, 6.8, 2.1, 3.6, "x"), 16, 6), 0xa565f0));
    sosGeo.push(pobarvaj(ploskev(elipsa(cx + sx * 0.4, 7.6, 0.55, 0.6, "z", 0, Math.PI * 2), 12, 3), 0x37128c));
    for (const [mx, my, ra, rb, rv] of [[1.6, 16.5, 0.28, 0.8, "z"], [2.8, 2.2, 0.28, 0.75, "z"], [2.9, 14.4, 0.3, 0.7, "z"], [1.4, 17.2, 0.3, 0.75, "x"], [2.5, 2.6, 0.28, 0.8, "x"], [2.8, 12.6, 0.3, 0.7, "x"]]) {
      const e = (u, v, p) => { const ang = u * Math.PI * 2, x = mx + ra * v * Math.cos(ang), y = my + rb * v * Math.sin(ang); return rv === "z" ? p.set(cx + sx * x, y, 0.03) : p.set(cx - sx * 0.03, y, -x); };
      sosGeo.push(pobarvaj(ploskev(e, 10, 2), 0xffd67e));
      const A = [], B = [], np = rv === "z" ? V(0, 0, 1) : V(-sx, 0, 0);
      for (let i = 0, n = hi ? 20 : 10; i <= n; i++) { B.push(e(i / n, 1, V()).addScaledVector(np, 0.006)); A.push(e(i / n, 0.72, V()).addScaledVector(np, 0.006)); }
      sosGeo.push(trakPlasti(A, B, np, MITO_PL));
    }
    for (const rv of ["z", "x"]) { // dvojna ovojnica jeder sosed
      const e = elipsa(cx, 6.8, 2.1, 3.6, rv), np = rv === "z" ? V(0, 0, 1) : V(-sx, 0, 0), A = [], B = [];
      for (let i = 0, n = hi ? 40 : 24; i <= n; i++) { B.push(e(i / n, 1, V()).addScaledVector(np, 0.006)); A.push(e(i / n, 0.94, V()).addScaledVector(np, 0.006)); }
      sosGeo.push(trakPlasti(A, B, np, OVOJ(0xe8d6ff), porePrereza(7, 0xe8d6ff)));
    }
  }
  for (const [cx, sx] of [[-8, 1], [8, -1]]) { // membrana sosed na obeh ploskvah prereza
    sosGeo.push(trakStebra(cx, sx > 0 ? Math.PI * 2 : Math.PI, "z"));
    sosGeo.push(trakStebra(cx, Math.PI * 1.5, "x", sx));
  }
  const sosedi = new THREE.Mesh(lise(zdruzi(sosGeo, true), { j: 0.24, fr: 0.7, odtenek: 0.05, mnozi: true }), mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.45, clearcoatRoughness: 0.2, sheen: 0.35, side: THREE.DoubleSide }));
  svet.add(sosedi);

  // ---------- mikrovili (krtačasti obrobek): steklena membrana, v vsakem snop aktinskih vlaken s koreninico ----------
  const mvGeo = new THREE.CapsuleGeometry(0.05, 0.9, hi ? 2 : 1, hi ? 6 : 4); mvGeo.translate(0, 0.45, 0);
  const jgGeo = new THREE.CylinderGeometry(0.016, 0.016, 1.4, 3, 1, true); jgGeo.translate(0, 0.88 - 0.7, 0);
  const mvTocke = [];
  const korakM = hi ? 0.22 : 0.42;
  for (const [cx, x0, x1] of [[0, -w, w], [-8, -8, -8 + w], [8, 8 - w, 8]]) {
    for (let x = x0 + korakM / 2; x < x1; x += korakM) for (let z = -w + korakM / 2; z < -0.02; z += korakM * 0.87) {
      const xx = x + (rnd() - 0.5) * korakM * 0.35, zz = z + (rnd() - 0.5) * korakM * 0.35 + ((Math.round((x - x0) / korakM) % 2) * korakM * 0.43);
      if (zz > -0.03) continue;
      const th = Math.atan2(zz, xx - cx), d = Math.hypot(xx - cx, zz) / se(th);
      if (d > w - KT - 0.05) continue;
      mvTocke.push(V(xx, vrh(d) - 0.05, zz));
    }
  }
  const mvMat = kit.steklo(mat(0xb4a8ff, { side: THREE.FrontSide }), { a: 0.34, rf: 30, k: 0.4, rob: "#b8c4ff", rk: 1.25, difuzno: 0.45, iri: 0.4 });
  const mv = new THREE.InstancedMesh(mvGeo, mvMat, mvTocke.length);
  const jedraMv = new THREE.InstancedMesh(jgGeo, mat(BC.aktin, { roughness: 0.3, clearcoat: 0.6, emissive: new THREE.Color(BC.aktin).multiplyScalar(0.45) }), mvTocke.length);
  mvTocke.forEach((p, i) => { o.position.copy(p); o.rotation.set((rnd() - 0.5) * 0.08, 0, (rnd() - 0.5) * 0.08); o.scale.set(1, 0.9 + rnd() * 0.25, 1); o.updateMatrix(); mv.setMatrixAt(i, o.matrix); jedraMv.setMatrixAt(i, o.matrix); });
  svet.add(jedraMv, mv);
  // glikokaliks na vrhu mikrovilov (encimi, ki dokončno razgradijo hrano): drobne beljakovine na konicah
  const glkT = [];
  mvTocke.forEach((p, i) => { if (i % (hi ? 1 : 3) === 0) glkT.push({ p: p.clone().add(V((rnd() - 0.5) * 0.06, 0.93 + rnd() * 0.12, (rnd() - 0.5) * 0.06)), n: V(rnd() - 0.5, 2, rnd() - 0.5).normalize() }); });
  const encimi = kit.beljakovine(glkT, BC.beljakovine, 0.035, { visina: 1.3 });
  svet.add(encimi);

  // ---------- terminalna mreža (aktin, spektrin, keratin) tik pod vrhom, v njej korenine mikrovilov ----------
  const tmK = [];
  for (let i = 0, t = 0; i < (hi ? 150 : 55) && t < 4000; t++) {
    const p = V((rnd() * 2 - 1) * (w - 0.45), H - 0.32 - rnd() * 0.55, -0.15 - rnd() * (w - 0.5));
    const sm = V(rnd() - 0.5, (rnd() - 0.5) * 0.12, rnd() - 0.5).normalize(), pts = [];
    for (let j = 0; j < 4; j++) pts.push(p.clone().addScaledVector(sm, (j - 1.5) * 0.45).add(V(0, (rnd() - 0.5) * 0.08, (rnd() - 0.5) * 0.1)));
    if (pts.some((x) => x.z > -0.05 || Math.abs(x.x) > w - 0.3 || x.z < -w + 0.3)) continue;
    tmK.push(new THREE.CatmullRomCurve3(pts)); i++;
  }
  const termMreza = kit.vlakna(tmK, 0.022, "#ffd27a", { sij: 0.45, seg: hi ? 12 : 6, rad: 3 });
  svet.add(termMreza);

  // ---------- jedro (prerezano na ravnini z = 0) ----------
  const J = V(0, 6.8, 0), ja = 2.1, jb = 3.7;
  const jF = (u, v, p) => { const f = Math.PI + Math.PI * u, t = Math.PI * v; p.set(ja * Math.sin(t) * Math.cos(f), jb * Math.cos(t), ja * Math.sin(t) * Math.sin(f)); return p.multiplyScalar(1 + 0.03 * sum(p.x * 1.4 + 2, p.y * 1.4, p.z * 1.4)).add(J); };
  const jedro = new THREE.Mesh(ploskev(jF, q(40), q(48), true), mat(BC.jedro, { roughness: 0.4, clearcoat: 0.6 }));
  const jPrerez = (u, v, p) => { const a = u * Math.PI * 2; p.set(ja * v * Math.cos(a), jb * v * Math.sin(a), 0); p.multiplyScalar(0.985); return p.add(J); };
  const jCap = ploskev(jPrerez, q(64), q(18));
  { // kromatin (temne lise, več ob ovojnici) z barvo oglišč
    const p = jCap.attributes.position, col = new Float32Array(p.count * 3), a = new THREE.Color(0xb27af8), b = new THREE.Color(BC.kromatin), t = new THREE.Color();
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), rr = Math.hypot((x - J.x) / ja, (y - J.y) / jb);
      t.copy(a).lerp(b, THREE.MathUtils.clamp(sum(x * 2.2, y * 2.2, 3) * 0.9 + 0.15 + 0.5 * THREE.MathUtils.smoothstep(rr, 0.75, 0.97), 0, 0.9));
      col.set([t.r, t.g, t.b], i * 3);
    }
    jCap.setAttribute("color", new THREE.BufferAttribute(col, 3));
  }
  const jPlo = new THREE.Mesh(jCap, mat(0xffffff, { vertexColors: true, roughness: 0.55, clearcoat: 0.35, side: THREE.DoubleSide }));
  // dvojna jedrna ovojnica s porami na prerezu
  const ovoj = (() => {
    const A = [], B = [], N = q(160), E = 0.2;
    for (let i = 0; i <= N; i++) { const a = (i / N) * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a); B.push(V(ja * c, jb * sn, 0).multiplyScalar(0.995).add(J).setZ(0.014)); A.push(V((ja - E) * c, (jb - E) * sn, 0).multiplyScalar(0.995).add(J).setZ(0.014)); }
    return trakPlasti(A, B, V(0, 0, 1), OVOJ(0xe8d6ff), porePrereza(14, 0xe8d6ff));
  })();
  const jOvoj = new THREE.Mesh(ovoj, matPlasti({ roughness: 0.5, clearcoat: 0.4 }));
  jOvoj.material.userData.rez = true;
  // jedrce: izboklina na ploskvi prereza
  const jcG = new THREE.SphereGeometry(0.72, q(28), q(18));
  deformiraj(jcG, (v) => { v.multiplyScalar(1 + 0.12 * kit.fbm(v.x * 5, v.y * 5, v.z * 5)); v.z *= 0.55; });
  const jedrce = new THREE.Mesh(jcG, mat(BC.jedrce, { roughness: 0.5, clearcoat: 0.5 }));
  jedrce.position.set(0.45, 8.0, 0);
  svet.add(jedro, jPlo, jOvoj, jedrce);

  // ---------- mitohondriji ----------
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
    // ploskvi prereza na obeh koncih odprtine: zunanja in notranja membrana (kriste so gube notranje)
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
  const mitPol = [];
  const obmocja = [[1.2, 3.2, 6], [14.9, 18.6, 11], [4, 10.5, 5]];
  for (const [y0, y1, n] of obmocja) {
    for (let k = 0, t = 0; k < n && t < 500; t++) {
      const p = V((rnd() * 2 - 1) * 3.0, y0 + rnd() * (y1 - y0), -0.7 - rnd() * 2.6);
      if (y0 === 4 && Math.abs(p.x) < 2.7) continue;
      if (mitPol.some((m) => m.distanceTo(p) < 1.15)) continue;
      mitPol.push(p); k++;
    }
  }
  const mit = new THREE.InstancedMesh(mitohondrij(), mat(0xffffff, { vertexColors: true, roughness: 0.38, side: THREE.DoubleSide }), mitPol.length);
  mitPol.forEach((p, i) => { o.position.copy(p); o.rotation.set((rnd() - 0.5) * 0.5, rnd() * 6, (rnd() - 0.5) * 0.5); o.scale.setScalar(0.85 + rnd() * 0.35); o.updateMatrix(); mit.setMatrixAt(i, o.matrix); });
  svet.add(mit);
  const zasedeno = mitPol.map((p) => ({ p, r: 1 }));

  // ---------- zrnati ER z ribosomi (cisterne z odprtinami) ----------
  const erLu = { f: 1.6, prag: 0.72 };
  const erGeo = [], ribT = [];
  for (let i = 0; i < 4; i++) {
    const y0 = 12.35 + i * 0.55;
    const f = (u, v, p) => { const x = -3.0 + 6.0 * u, z = -3.3 + 2.8 * v; return p.set(x, y0 + 0.13 * Math.sin(x * 1.4 + i) + 0.09 * Math.cos(z * 1.9 + i * 2), z); };
    erGeo.push(ploskev(f, q(40), q(18)));
    for (let k = 0; k < (hi ? 170 : 70); k++) { const p = f(rnd(), rnd(), V()); if (kit.vLuknji(p, erLu)) continue; p.y += rnd() < 0.5 ? 0.07 : -0.07; ribT.push(p); }
  }
  for (const sx of [-1, 1]) { // ob jedru
    const f = (u, v, p) => { const y = 4.2 + 6.5 * u, z = -3.2 + 2.7 * v; return p.set(sx * (2.85 + 0.1 * Math.sin(y * 1.3)), y, z); };
    erGeo.push(ploskev(f, q(28), q(12)));
    for (let k = 0; k < (hi ? 100 : 40); k++) { const p = f(rnd(), rnd(), V()); if (kit.vLuknji(p, erLu)) continue; p.x += rnd() < 0.5 ? 0.07 : -0.07; ribT.push(p); }
  }
  const zer = new THREE.Mesh(zdruzi(erGeo), kit.sencilo(mat(0x3550d8, { roughness: 0.38, clearcoat: 0.35, clearcoatRoughness: 0.12, sheen: 0, side: THREE.DoubleSide }), { vr: 2, rf: 7, k: 0.6, b: 0.22, s: 0.1, luknje: erLu }));
  const rib = new THREE.InstancedMesh(hi ? new THREE.IcosahedronGeometry(0.06, 0) : new THREE.OctahedronGeometry(0.068, 0), mat(BC.ribosomi, { roughness: 0.28, clearcoat: 0.9, emissive: new THREE.Color(BC.ribosomi).multiplyScalar(0.22) }), ribT.length);
  ribT.forEach((p, i) => { o.position.copy(p); o.rotation.set(rnd() * 3, rnd() * 3, 0); o.scale.setScalar(0.8 + rnd() * 0.45); o.updateMatrix(); rib.setMatrixAt(i, o.matrix); });
  svet.add(zer, rib);

  // ---------- gladki ER (cevke; v enterocitu iz maščob nastajajo hilomikroni) ----------
  const ger = [], vozl = [];
  for (let i = 0, t = 0; i < (hi ? 16 : 10) && t < 4000; t++) {
    const c = V((rnd() * 2 - 1) * 3.0, 14.6 + rnd() * 4.0, -0.4 - rnd() * 3.0);
    if (vozl.some((x) => x.distanceTo(c) < 0.9) || mitPol.some((m) => m.distanceTo(c) < 0.75)) continue;
    vozl.push(c); i++;
  }
  const povezave = new Set();
  vozl.forEach((a, i) => {
    vozl.map((b, j) => [a.distanceTo(b), j]).filter(([, j]) => j !== i).sort((x, y) => x[0] - y[0]).slice(0, 2 + (i % 2)).forEach(([d, j]) => {
      const kl = Math.min(i, j) + "-" + Math.max(i, j);
      if (povezave.has(kl) || d > 2.2) return;
      povezave.add(kl);
      const b = vozl[j], m = a.clone().lerp(b, 0.5).add(V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(0.5));
      ger.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([a, m, b]), q(12), 0.09 + rnd() * 0.03, q(7), false));
    });
  });
  for (const c of vozl) ger.push(new THREE.SphereGeometry(0.15, q(10), q(8)).translate(c.x, c.y, c.z));
  const gladki = new THREE.Mesh(zdruzi(ger), mat(BC.ger, { roughness: 0.3, clearcoat: 0.9 }));
  svet.add(gladki);

  // ---------- Golgijev aparat (nad jedrom) ----------
  const golgi = new THREE.Mesh(golgiGeo(6), mat(0xffffff, { vertexColors: true, roughness: 0.34, clearcoat: 0.85, side: THREE.DoubleSide }));
  golgi.position.set(0.2, 9.95, -1.7); golgi.scale.set(7, 7, 9); golgi.rotation.y = 0.15;
  svet.add(golgi);

  // ---------- lizosomi ----------
  const lizT = [];
  for (let t = 0; lizT.length < 6 && t < 2000; t++) {
    const p = V((rnd() * 2 - 1) * 2.9, 11 + rnd() * 7.5, -0.5 - rnd() * 2.8);
    if (mitPol.some((m) => m.distanceTo(p) < 1) || vozl.some((c) => c.distanceTo(p) < 0.5) || (p.y > 12.1 && p.y < 14.2)) continue;
    lizT.push(p);
  }
  const lizG = new THREE.SphereGeometry(0.3, q(16), q(12));
  deformiraj(lizG, (v) => v.multiplyScalar(1 + 0.08 * sum(v.x * 6, v.y * 6, v.z * 6)));
  const liz = new THREE.InstancedMesh(lizG, mat(BC.lizosom, { roughness: 0.18, clearcoat: 1 }), lizT.length);
  lizT.forEach((p, i) => { o.position.copy(p); o.rotation.set(0, 0, 0); o.scale.setScalar(0.8 + rnd() * 0.5); o.updateMatrix(); liz.setMatrixAt(i, o.matrix); });
  svet.add(liz);

  // ---------- stični kompleks: tesni stik, pasasti stik (z aktinskim obročem), dezmosomi; keratinske niti ----------
  const tjGeo = [];
  for (let s = 0; s < 4; s++) {
    const pts = [];
    for (let i = 0; i <= 90; i++) {
      const th = Math.PI + Math.PI * (i / 90), y = H - KT - 0.35 - s * 0.24 + 0.08 * Math.sin(i * 0.9 + s * 2);
      const r = (w - 0.2) * se(th);
      pts.push(V(r * Math.cos(th), y, Math.min(-0.02, r * Math.sin(th))));
    }
    tjGeo.push(nit(pts, 0.055, hi ? 200 : 110, hi ? 5 : 4));
  }
  const tesni = new THREE.Mesh(zdruzi(tjGeo), mat(0x1fd6a8, { roughness: 0.35, clearcoat: 0.7, emissive: new THREE.Color(0x0a4a3a) }));
  svet.add(tesni);
  const ajK = [];
  for (let s = 0; s < 3; s++) {
    const pts = [];
    for (let i = 0; i <= 60; i++) {
      const th = Math.PI + Math.PI * (i / 60), y = H - KT - 1.45 - s * 0.13 + 0.05 * Math.sin(i * 0.7 + s);
      const r = (w - 0.32 - s * 0.06) * se(th);
      pts.push(V(r * Math.cos(th), y, Math.min(-0.04, r * Math.sin(th))));
    }
    ajK.push(new THREE.CatmullRomCurve3(pts));
  }
  const pasasti = kit.vlakna(ajK, 0.05, BC.aktin, { sij: 0.5, seg: hi ? 120 : 60, rad: hi ? 5 : 3 });
  svet.add(pasasti);
  const dezGeo = [], dezT = [];
  const dezPol = [[1, 15.8, -2.2], [1, 12.0, -1.0], [1, 8.4, -2.6], [1, 4.6, -1.4], [1, 2.2, -2.8], [0, 16.8, 1.2], [0, 13.2, -1.6], [0, 9.6, 0.4], [0, 5.5, 1.8], [0, 3.0, -0.6], [-1, 14.5, -2.0], [-1, 6.5, -1.2]];
  const kerK = [];
  for (const [stran, y, s] of dezPol) {
    // stran 1: desna stena (x ≈ w), 0: zadnja stena (z ≈ -w), -1: leva stena
    const p = stran === 0 ? V(s, y, -(w - 0.17)) : V(stran * (w - 0.17), y, s);
    const n = stran === 0 ? V(0, 0, 1) : V(-stran, 0, 0);
    const plosca = new THREE.CylinderGeometry(0.42, 0.42, 0.1, q(16));
    plosca.applyMatrix4(new THREE.Matrix4().compose(p, new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), n), V(1, 1, 1)));
    dezGeo.push(pobarvaj(plosca, 0xe0408a));
    // gosta notranja plošča in kadherini v medceličnem prostoru
    const pl2 = new THREE.CylinderGeometry(0.34, 0.34, 0.08, q(14));
    pl2.applyMatrix4(new THREE.Matrix4().compose(p.clone().addScaledVector(n, 0.1), new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), n), V(1, 1, 1)));
    dezGeo.push(pobarvaj(pl2, 0xff8cc0));
    for (let k = 0; k < 4; k++) { // keratinske niti, ki se zankajo v ploščo
      const a = (k / 4) * Math.PI * 2 + rnd(), t = V(0, Math.cos(a), Math.sin(a));
      if (stran === 0) t.set(Math.sin(a), Math.cos(a), 0);
      const z = p.clone().addScaledVector(t, 0.25), k1 = z.clone().addScaledVector(n, 0.9).addScaledVector(t, 0.6), k2 = p.clone().addScaledVector(t, -0.2).addScaledVector(n, 0.35);
      kerK.push(new THREE.CatmullRomCurve3([z, k1, k1.clone().addScaledVector(t, -0.6).addScaledVector(n, 0.3), k2]));
    }
    dezT.push(p.clone().addScaledVector(n, 0.05));
  }
  // keratinska mreža čez celico: od dezmosoma do dezmosoma in do terminalne mreže
  dezT.forEach((a, i) => {
    for (const b of [dezT[(i + 5) % dezT.length], V(a.x * 0.3, H - 0.6, Math.min(-0.4, a.z))]) {
      const m = a.clone().lerp(b, 0.5).add(V(rnd() - 0.5, rnd() - 0.5, -rnd() * 0.6).multiplyScalar(1.4));
      if (m.z > -0.2) m.z = -0.2;
      kerK.push(new THREE.CatmullRomCurve3([a.clone(), a.clone().lerp(m, 0.6), m, b]));
    }
  });
  const dez = new THREE.Mesh(zdruzi(dezGeo, true), mat(0xffffff, { vertexColors: true, roughness: 0.4, clearcoat: 0.6 }));
  const keratin = kit.vlakna(kerK, 0.03, "#ea9cff", { sij: 0.45, seg: hi ? 24 : 8, rad: 3 });
  svet.add(dez, keratin);

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

  // drobni prosti ribosomi in temna zrnca citoplazme (točke)
  const prostiR = [], prah = [];
  for (let t = 0; (prostiR.length < (hi ? 500 : 220) || prah.length < (hi ? 2200 : 900)) && t < 80000; t++) {
    const p = V((rnd() * 2 - 1) * (w - 0.35), 0.4 + rnd() * (H - 1.2), -0.08 - rnd() * (w - 0.4));
    if (Math.hypot((p.x - J.x) / (ja + 0.15), (p.y - J.y) / (jb + 0.15)) < 1 && p.z > -ja - 0.2) continue;
    if (prostiR.length < (hi ? 500 : 220) && rnd() < 0.3) prostiR.push(p); else if (prah.length < (hi ? 2200 : 900)) prah.push(p);
  }
  const ribP = kit.pike(prostiR, BC.ribosomi, 0.1, 0.4), prahP = kit.pike(prah, 0x2c2462, 0.07, 0.5);
  svet.add(ribP, prahP);

  const s = umeri(svet, 0.985);
  for (const pt of [ribP, prahP]) pt.material.size *= s; // velikost točk je v enotah sveta
  const L = (x, y, z) => V(x, y, z).multiplyScalar(s).add(svet.position).toArray();

  del("mikrovili", "Mikrovili (krtačasti obrobek)", "Na tisoče prstastih izrastkov, dolgih okoli 1 µm; kot krtača povečajo površino celice več kot 20-krat, zato celica hitreje vsrka hranila.", "#b4a8ff", [mv, encimi], L(-1.6, H + 1.0, -0.15));
  del("aktin-mikrovilov", "Aktinska vlakna mikrovilov", "V vsakem mikrovilu je snop 20 do 30 aktinskih vlaken, ki ga drži pokonci; njegova koreninica sega v terminalno mrežo.", BC.aktin, [jedraMv], L(-0.9, H + 0.5, -0.3));
  del("terminalna-mreza", "Terminalna mreža", "Gosta mreža vlaken (aktin, spektrin, keratin) tik pod vrhom celice; vanjo so zasidrane korenine mikrovilov.", "#ffd27a", [termMreza], L(1.4, H - 0.55, -1.2));
  del("membrana", "Celična membrana", "Ovojnica celice iz dvosloja maščob; na vrhu je nagubana v mikrovile, ob straneh pa se dotika sosednjih celic. Debelina membrane je povečana.", "#9fb4ff", [mem, memRob], L(-w, 13, -0.05));
  del("citoplazma", "Citoplazma", "Želatinasta notranjost celice z organeli.", "#4a3d9a", [cit], L(1.2, 16, -w + 0.2));
  del("jedro", "Jedro", "Ovalno jedro z dvojno ovojnico in porami leži v spodnjem delu celice; v njem je DNK (kromatin).", BC.jedro, [jedro, jPlo, jOvoj], L(-0.8, 5.4, 0.05));
  del("jedrce", "Jedrce", "Gosto območje v jedru, kjer nastajajo deli ribosomov.", BC.jedrce, [jedrce], L(0.45, 8.0, 0.3));
  del("mitohondrij", "Mitohondriji", "Imajo dvojno membrano; notranja je nagubana v kriste. Pridobivajo energijo (ATP) za črpanje hranil skozi membrano; največ jih je pod vrhom in ob dnu.", BC.mitohondrij, [mit], L(...mitPol.reduce((a, p) => (p.y > 14 && p.z > a.z ? p : a), V(0, 16, -9)).clone().add(V(0, 0, 0.4)).toArray()));
  del("zrnati-er", "Zrnati endoplazemski retikulum", "Sploščeni membranski mešički z ribosomi; v njem nastajajo beljakovine, na primer encimi na mikrovilih.", BC.zer, [zer], L(-2.4, 12.95, -0.6));
  del("ribosomi", "Ribosomi", "Drobna zrnca, ki sestavljajo beljakovine; mnogo jih sedi na zrnatem ER, druga so prosta.", BC.ribosomi, [rib], L(2.0, 13.5, -0.55));
  del("gladki-er", "Gladki endoplazemski retikulum", "Mreža cevk brez ribosomov; v enterocitu iz vsrkanih maščob sestavi nove maščobe, ki jih celica pošlje v limfo.", BC.ger, [gladki], vozl.reduce((a, c) => (c.z > a.z ? c : a)).toArray().map((x, i) => x * s + svet.position.getComponent(i)));
  del("golgi", "Golgijev aparat", "Leži nad jedrom; beljakovine in maščobe dodela in zapakira v mešičke.", BC.golgi, [golgi], L(-0.2, 11.6, -1.4));
  del("lizosomi", "Lizosomi", "Mešički z encimi, ki razgradijo odslužene dele celice.", BC.lizosom, [liz], L(...lizT.reduce((a, p) => (p.z > a.z ? p : a)).toArray()));
  del("tesni-stiki", "Tesni stiki", "Pas beljakovinskih niti tik pod vrhom, ki sosednji celici tesno zlepi; tako snovi iz črevesa ne morejo zdrsniti med celicama.", "#1fd6a8", [tesni], L(w - 0.25, H - KT - 0.6, -1.0));
  del("pasasti-stik", "Pasasti stik", "Pas pod tesnim stikom, kjer se celici držita s kadherini; na notranji strani ga obkroža obroč aktinskih vlaken.", BC.aktin, [pasasti], L(w - 0.4, H - KT - 1.5, -1.2));
  del("dezmosomi", "Dezmosomi", "Točkasti stiki kot zakovice; s keratinskimi nitmi povežejo sosednji celici, da se tkivo ne raztrga.", "#e0408a", [dez], L(...dezT[1].toArray()));
  del("keratin", "Keratinske niti", "Vmesni filamenti iz keratina, ki se raztezajo od dezmosoma do dezmosoma čez vso celico in ji dajejo trdnost.", "#ea9cff", [keratin], L(...dezT[6].clone().add(V(0.6, 0.4, 0.6)).toArray()));
  del("bazalna-membrana", "Bazalna membrana", "Tanka plast prepletenih beljakovinskih vlaken (kolagen IV, laminin) pod epitelijem, na kateri celice stojijo.", "#2f9a88", [bazalna, bmVl], L(-1, -0.3, -0.02));
  del("sosednje-celice", "Sosednji celici (prerez)", "Enake celice ob strani, prerezane, da se vidita jedro in mitohondriji; skupaj tvorijo enoslojni valjasti epitelij.", "#7a6cc8", [sosedi], L(-6.4, 9.5, 0.05));

  kit.poliraj(svet, deli, {
    citoplazma: { tex: "fino", rf: hi ? 9 : 6, k: hi ? 0.55 : 0.3, b: 0.2, lisa: 0.2, f: 0.3 },
    jedro: { tex: "zrna", rf: hi ? 10 : 7, k: hi ? 0.6 : 0.35, b: 0.2 },
    jedrce: { tex: "zrna", rf: 8, k: 1.3, b: 0.25 },
    mitohondrij: { tex: "zrna", rf: 6, k: 0.7, b: 0.18 },
    ribosomi: { tex: null },
    "aktin-mikrovilov": { tex: null },
    "gladki-er": { tex: "fino", rf: 6, k: 0.7 },
    golgi: { tex: "fino", rf: 7, k: 0.8 },
    lizosomi: { tex: "zrna", rf: 7, k: 0.9, b: 0.22 },
    "tesni-stiki": { tex: "zrna", rf: 10, k: 0.6 },
    dezmosomi: { tex: "zrna", rf: 8, k: 0.7 },
    "bazalna-membrana": { tex: "vlakna", rf: 3, k: 0.8, b: 0.2 },
    "sosednje-celice": { tex: "fino", rf: hi ? 7 : 5, k: hi ? 0.45 : 0.25, b: 0.16 },
  });
  const nadzor = [kit.barveUcbenika(deli, { mikrovili: "#e8809a", "aktin-mikrovilov": "#c0504a", "terminalna-mreza": "#c08a4a", jedrce: "#2f1e80", "tesni-stiki": "#2fb89a",
    "pasasti-stik": "#e0a040", dezmosomi: "#b5507f", keratin: "#c49ad8", "bazalna-membrana": "#8fb0a8", "sosednje-celice": "#f0c8b0" })];

  return {
    group,
    oder: "celica",
    pogled: [-0.47, 0.34, 0.81], // smer kamere: yaw −30°, pitch 20° (odrezani del proti gledalcu)
    deli,
    nadzor,
    korak(t) {
      if (!gib) return;
      group.rotation.y = Math.sin(t * 0.15) * 0.04;
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
