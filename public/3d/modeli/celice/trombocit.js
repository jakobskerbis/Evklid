// Krvna ploščica: mirujoča (ploščica) in aktivirana (kroglica z nitastimi izrastki), z odrezanim osmim delom.
// Pogodba graditelja: docs/3d.md. Brez uvozov; THREE pride od kompleta. Model je zgrajen v µm.

export const info = {
  id: "celica-trombocit",
  naslov: "Krvna ploščica (trombocit)",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Krvna ploščica (2–3 µm) ni prava celica, temveč odcepljen delček velike celice kostnega mozga, megakariocita, zato nima jedra. Ob poškodbi žile se aktivira: postane okrogla, izrastki se oprimejo rane in zrnca izločijo snovi za strjevanje krvi. Zrnc je manj kot v resnici.",
  merilo: { m: 2.9e-6, oznaka: "2,9 µm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const gib = ctx.gibanje !== false;
  const group = new THREE.Group();
  const deli = [];
  const odpad = [];

  // ---------- orodja ----------
  let seme = 7;
  const rnd = () => ((seme = (seme * 16807) % 2147483647) - 1) / 2147483646;
  const hash = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };
  function sum(x, y, z) { // gladek 3D šum vrednosti, -1 … 1
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const xf = x - xi, yf = y - yi, zf = z - zi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
    const l = (a, b, t) => a + (b - a) * t;
    const h = (a, b, c) => hash(xi + a, yi + b, zi + c);
    return 2 * l(l(l(h(0, 0, 0), h(1, 0, 0), u), l(h(0, 1, 0), h(1, 1, 0), u), v),
      l(l(h(0, 0, 1), h(1, 0, 1), u), l(h(0, 1, 1), h(1, 1, 1), u), v), w) - 1;
  }
  const fbm = (x, y, z) => sum(x, y, z) * 0.6 + sum(x * 2.1, y * 2.1, z * 2.1) * 0.3 + sum(x * 4.3, y * 4.3, z * 4.3) * 0.1;
  const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  function mat(barva, o = {}) {
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: barva, roughness: 0.4, clearcoat: 0.8, clearcoatRoughness: 0.3,
      sheen: 0.5, sheenColor: new THREE.Color(0xffffff), sheenRoughness: 0.5,
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
    const pos = [], nor = [], col = [], idx = [];
    let off = 0;
    geos.forEach((g, i) => {
      const p = g.attributes.position, n = g.attributes.normal;
      const c = Array.isArray(barve) ? new THREE.Color(barve[i]) : null;
      const gc = !c && barve === true ? g.attributes.color : null;
      for (let k = 0; k < p.count; k++) {
        pos.push(p.getX(k), p.getY(k), p.getZ(k));
        nor.push(n.getX(k), n.getY(k), n.getZ(k));
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
    const pos = new Float32Array((nu + 1) * (nv + 1) * 3), nor = new Float32Array(pos.length), idx = [];
    const p = V(), n = V();
    for (let j = 0, k = 0; j <= nv; j++) for (let i = 0; i <= nu; i++, k += 3) {
      f(i / nu, j / nv, p); normala(f, i / nu, j / nv, n);
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

  const A = 1.3, B = 0.42; // polosi mirujoče ploščice (premer 2,6 µm, debelina 0,84 µm)
  const RA = Math.cbrt(A * A * B); // kroglica z enako prostornino
  const fD = (d) => (1 / Math.sqrt((d.x * d.x + d.z * d.z) / (A * A) + (d.y * d.y) / (B * B))) * (1 + 0.012 * fbm(d.x * 2 + 1, d.y * 2, d.z * 2));
  const fA = (d) => RA * (1 + 0.05 * fbm(d.x * 2.2 + 7, d.y * 2.2, d.z * 2.2));
  let t = 0, cilj = 0;
  const fT = (d) => fD(d) + (fA(d) - fD(d)) * t;
  // točka v notranjosti: preslikava iz ploščice v kroglico
  const M = (p, out, cent = 0) => { const d = p.clone().normalize(); return out.copy(p).multiplyScalar((1 + (fA(d) / fD(d) - 1) * t) * (1 - cent * t)); };

  const svet = new THREE.Group(); group.add(svet);
  const tel = new THREE.Group(); svet.add(tel);
  tel.rotation.set(0.42, 0.25, 0);

  // ---------- membrana in citoplazma (oglišča se pretapljajo med oblikama) ----------
  const enota = lupina(() => 1, q(120), q(72));
  const smeri = [enota.odprta.attributes.position.array.slice()];
  enota.pokrov.dispose();
  const memMat = mat(0xd88aa2, { roughness: 0.32, clearcoat: 1, sheen: 0.6 });
  const memOut = new THREE.Mesh(enota.odprta, memMat);
  const citIn = new THREE.Mesh(enota.odprta.clone(), mat(0xeadbe4, { roughness: 0.75, clearcoat: 0.1, sheen: 0.25, side: THREE.BackSide }));
  const TM = 0.045; // debelina membrane (povečana)
  const memRob = new THREE.Mesh(new THREE.BufferGeometry(), matPlasti({ roughness: 0.45 }));
  tel.add(memOut, citIn, memRob);
  const dv = V();
  function oblikuj() {
    for (const [g, s0, k] of [[memOut.geometry, smeri[0], 0], [citIn.geometry, smeri[0], TM]]) {
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) { dv.set(s0[i * 3], s0[i * 3 + 1], s0[i * 3 + 2]); const r = fT(dv) - k; p.setXYZ(i, dv.x * r, dv.y * r, dv.z * r); }
      p.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingSphere();
    }
    memRob.geometry.dispose(); memRob.geometry = prerezLupine((d) => fT(d) * 0.999, (d) => fT(d) - TM, DVOSLOJ(0xd88aa2), q(110), { zamik: 0.002 });
  }

  // ---------- filopodiji (nitasti izrastki) ----------
  const fil = new THREE.CylinderGeometry(0.014, 0.055, 1, q(6), 6, false);
  fil.translate(0, 0.5, 0);
  deformiraj(fil, (v) => { v.x += 0.2 * v.y * v.y; v.z += 0.06 * Math.sin(v.y * 6); });
  const nFil = 18;
  const filo = new THREE.InstancedMesh(fil, memMat, nFil);
  const filPod = [];
  for (let i = 0; i < nFil; i++) {
    const d = V(rnd() * 2 - 1, (rnd() * 2 - 1) * 0.55, rnd() * 2 - 1).normalize();
    if (vIzrezu(d, { x: 0.1, y: -0.1, z: -0.1 })) { i--; continue; }
    filPod.push({ d, L: 0.55 + rnd() * 1.25, zas: rnd() * 6, deb: 0.8 + rnd() * 0.5, z: rnd() * 0.35 });
  }
  const Y = V(0, 1, 0);
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

  // ---------- obroč mikrotubulov (zvit snop ob robu) ----------
  const obMat = mat(0x7fd6f2, { roughness: 0.35, clearcoat: 0.6 });
  const obroc = new THREE.Mesh(new THREE.BufferGeometry(), obMat);
  function postaviObroc() {
    const Rr = (A - 0.13) * (1 - 0.55 * t), niti = [];
    for (let h = 0; h < 3; h++) {
      const pts = [];
      for (let i = 0; i <= 160; i++) {
        const a = (i / 160) * Math.PI * 2, b = a * 9 + (h * Math.PI * 2) / 3;
        pts.push(V((Rr + 0.03 * Math.cos(b)) * Math.cos(a), 0.03 * Math.sin(b) + 0.02 * Math.sin(a * 3), (Rr + 0.03 * Math.cos(b)) * Math.sin(a)));
      }
      niti.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), q(220), 0.017, q(5), true));
    }
    obroc.geometry.dispose(); obroc.geometry = zdruzi(niti);
  }
  tel.add(obroc);

  // ---------- zrnca, mitohondriji ----------
  function vPloscici(rr, ymax = 1) {
    for (let k = 0; k < 3000; k++) {
      const p = V((rnd() * 2 - 1) * A, (rnd() * 2 - 1) * B, (rnd() * 2 - 1) * A);
      const d = p.clone().normalize(), m = fD(d) * 0.86 - rr;
      if (p.length() > m || Math.hypot(p.x, p.z) > A - 0.3 || Math.abs(p.y) > (B - rr - 0.06) * ymax) continue;
      return p;
    }
    return V();
  }
  function skupina(n, geo, material, velikost) {
    const m = new THREE.InstancedMesh(geo, material, n), seznam = [];
    for (let i = 0; i < n; i++) {
      const s = velikost();
      let p, k = 0;
      do { p = vPloscici(s); k++; } while (k < 60 && seznam.some((x) => x.p.distanceTo(p) < (x.s + s) * 1.1));
      seznam.push({ p, s, e: new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3) });
    }
    tel.add(m);
    return { m, seznam };
  }
  const alfa = skupina(hi ? 48 : 34, new THREE.SphereGeometry(1, q(14), q(10)), mat(0xf0c05a, { roughness: 0.3, clearcoat: 0.9 }), () => 0.085 + rnd() * 0.05);
  const goste = skupina(6, new THREE.SphereGeometry(1, q(14), q(10)), mat(0x3a3170, { roughness: 0.2, clearcoat: 1, sheenColor: new THREE.Color(0xb0a0ff), sheen: 0.8 }), () => 0.06 + rnd() * 0.02);
  const mitoGeo = (() => {
    const L = 0.18, r = 0.075, prof = [];
    for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + (i / 10) * Math.PI; prof.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r + (a < 0 ? -L / 2 : L / 2))); }
    return new THREE.LatheGeometry(prof, q(12));
  })();
  const mito = skupina(4, mitoGeo, mat(0xe8743b, { roughness: 0.38 }), () => 0.13);
  mito.seznam.forEach((x) => { x.e.set(Math.PI / 2, 0, rnd() * 3); });
  const pv = V();
  function postaviZrnca() {
    for (const [sk, cent, enakomerno] of [[alfa, 0.45, true], [goste, 0.45, true], [mito, 0.3, false]]) {
      sk.seznam.forEach((x, i) => {
        M(x.p, pv, cent);
        o.position.copy(pv); o.rotation.copy(x.e);
        if (enakomerno) o.scale.set(x.s, x.s * 0.85, x.s); else o.scale.setScalar(1);
        o.updateMatrix(); sk.m.setMatrixAt(i, o.matrix);
      });
      sk.m.instanceMatrix.needsUpdate = true; sk.m.computeBoundingSphere(); sk.m.computeBoundingBox();
    }
  }

  // ---------- odprt kanalikularni sistem (uvihana membrana) ----------
  const kanali = [];
  for (let i = 0; i < 7; i++) {
    let d;
    do { d = V(rnd() * 2 - 1, (rnd() * 2 - 1) * 0.6, rnd() * 2 - 1).normalize(); } while (vIzrezu(d, { x: 0.2, y: -0.3, z: -0.2 }) && i > 1);
    if (i < 2) d.set(-0.3 - i * 0.3, i ? -0.3 : 0.75, 0.6).normalize(); // dva sta vidna ob prerezu
    const pts = [d.clone().multiplyScalar(fD(d) * 1.0)];
    let p = d.clone().multiplyScalar(fD(d) * 0.8);
    pts.push(p.clone());
    for (let s = 0; s < 5; s++) {
      p = p.clone().add(V(rnd() - 0.5, (rnd() - 0.5) * 0.35, rnd() - 0.5).multiplyScalar(0.45)).multiplyScalar(0.88);
      p.y = THREE.MathUtils.clamp(p.y, -B * 0.5, B * 0.5);
      pts.push(p);
    }
    kanali.push({ pts, d });
  }
  const ocs = new THREE.Mesh(new THREE.BufferGeometry(), mat(0xf4b3c8, { roughness: 0.4, clearcoat: 0.6, side: THREE.DoubleSide }));
  function postaviKanale() {
    const g = [];
    for (const k of kanali) {
      const pts = k.pts.map((p, i) => (i === 0 ? k.d.clone().multiplyScalar(fT(k.d) * 1.005) : M(p, V())));
      g.push(nit(pts, 0.04, 40, 6));
      const tor = new THREE.TorusGeometry(0.05, 0.013, q(5), q(14));
      const m = new THREE.Matrix4().lookAt(V(), k.d, Y).setPosition(pts[0]);
      g.push(tor.applyMatrix4(m));
    }
    ocs.geometry.dispose(); ocs.geometry = zdruzi(g);
  }
  tel.add(ocs);

  // ---------- stanje ----------
  let s = 1;
  function posodobi() {
    oblikuj(); postaviFil(); postaviObroc(); postaviZrnca(); postaviKanale();
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
    del("membrana", "Celična membrana", "Ovojnica ploščice z beljakovinami, s katerimi se ob poškodbi prilepi na steno žile in na druge ploščice. Debelina membrane je povečana.", "#d88aa2", [memOut, memRob], W(sm.clone().multiplyScalar(fT(sm) * 1.01).toArray()));
    if (akt) {
      const f = filPod.reduce((a, b) => (b.d.z + b.d.x * 0.3 > a.d.z + a.d.x * 0.3 ? b : a));
      del("filopodiji", "Nitasti izrastki (filopodiji)", "Aktivirana ploščica požene dolge tanke izrastke, s katerimi se oprime rane in drugih ploščic; tako nastane čep.", "#e7a0b8", [filo], W(f.d.clone().multiplyScalar(fT(f.d) + f.L * 0.6).toArray()));
    }
    del("citoplazma", "Citoplazma", "Notranjost ploščice; ker je ploščica delček megakariocita, nima jedra, ima pa veliko zrnc.", "#eadbe4", [citIn], W((() => { const d = akt ? V(0.35, 0.4, -0.6).normalize() : V(-0.5, -0.3, 0.55).normalize(); return d.multiplyScalar(fT(d) * 0.93).toArray(); })()));
    del("obroc", "Obroč mikrotubulov", "Snop mikrotubulov, zvit ob robu kot obroč; mirujoči ploščici daje obliko diska. Ob aktivaciji se stisne v sredino.", "#7fd6f2",
      [obroc], W([-(A - 0.13) * (1 - 0.55 * cilj) * 0.7, 0.03, (A - 0.13) * (1 - 0.55 * cilj) * 0.7]));
    const izb = (sk) => { const x = sk.seznam.reduce((a, b) => (vIzrezu(b.p) || (b.p.z - b.p.x > a.p.z - a.p.x) ? b : a)); return W(M(x.p, V(), 0.45).toArray()); };
    del("alfa-zrnca", "Alfa zrnca", "Najštevilnejša zrnca; vsebujejo beljakovine za strjevanje krvi in rastne dejavnike, ki pomagajo celiti rano.", "#f0c05a", [alfa.m], izb(alfa));
    del("gosta-zrnca", "Gosta zrnca", "Majhna temna zrnca s kalcijem, ADP in serotoninom; ko se izločijo, privabijo in aktivirajo še več ploščic.", "#4a3f86", [goste.m], izb(goste));
    del("ocs", "Odprt kanalikularni sistem", "Mreža kanalčkov, ki so uvihana membrana; skozi odprtine na površini ploščica izloči vsebino zrnc.", "#f4b3c8", [ocs], W(kanali[0].pts[0].toArray()));
    del("mitohondrij", "Mitohondriji", "Nekaj majhnih mitohondrijev, ki dajejo energijo za spremembo oblike in izločanje.", "#e8743b", [mito.m], izb(mito));
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

  return {
    group,
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
