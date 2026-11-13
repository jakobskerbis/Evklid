// Rdeča krvnička: dvojno vbočena ploščica, oblika iz enačbe Evansa in Funga (1972).
// Pogodba graditelja: docs/3d.md. THREE pride od kompleta; skupni videz celic iz public/3d/celice-videz.js.
// Celica je zgrajena v µm in nato umerjena v enotsko kroglo.
import { videzCelic, BARVE as B } from "../../celice-videz.js";

export const info = {
  id: "celica-eritrocit",
  naslov: "Rdeča krvnička (eritrocit)",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Dvojno vbočena ploščica s premerom 7,8 µm; oblika je izračunana iz enačbe Evansa in Funga. Zrela rdeča krvnička nima jedra in mitohondrijev, zato je v njej več prostora za hemoglobin, ki veže kisik. Molekule hemoglobina in sladkorne verige so močno povečane.",
  poskusi: "Izberi »Prerez« in z »Mere« primerjaj debelino krvničke ob robu in na sredini.",
  merilo: { m: 9e-6, oznaka: "9 µm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const gib = ctx.gibanje !== false;
  const group = new THREE.Group();
  const deli = [];
  const odpad = [];

  const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  const kit = videzCelic(THREE, { hi, odpad });
  const { hash, sum, fbm } = kit;
  // ---------- orodja ----------
  let seme = 7;
  const rnd = () => ((seme = (seme * 16807) % 2147483647) - 1) / 2147483646;
  const V = V3;
  // mat(barva, {…}): mokra organska površina (relief in vlažen videz doda kit.poliraj na koncu).
  function mat(barva, o = {}) {
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: barva, roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.22,
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
  // tocka je lahko funkcija (točka je odvisna od prikaza)
  function del(id, ime, opis, barva, meshes, tocka) {
    meshes.forEach((m) => { m.userData.del = id; });
    const d = { id, ime, opis, barva, meshes };
    if (typeof tocka === "function") Object.defineProperty(d, "tocka", { get: tocka, enumerable: true });
    else d.tocka = tocka;
    deli.push(d);
  }
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

  // ---------- oblika: Evans in Fung ----------
  // debelina T(r) = √(1 − (r/R0)²) · (C0 + C2 (r/R0)² + C4 (r/R0)⁴), vse v µm
  const R0 = 3.91, C0 = 0.81, C2 = 7.83, C4 = -4.39;
  const P = (x) => C0 + C2 * x + C4 * x * x;
  // a ∈ [0, π]: od središča zgornje ploskve prek roba do središča spodnje
  const profil = (a) => { const s = Math.sin(a); return [R0 * s, 0.5 * Math.cos(a) * P(s * s)]; };
  const povrsje = (a, f, p, hrup = true) => {
    const [r, y] = profil(a);
    p.set(r * Math.cos(f), y, r * Math.sin(f));
    if (hrup) p.multiplyScalar(1 + 0.006 * fbm(p.x * 0.9 + 4, p.y * 0.9, p.z * 0.9));
    return p;
  };
  const kos = (a0, a1, f0, f1) => (u, v, p) => povrsje(a0 + (a1 - a0) * v, f0 + (f1 - f0) * u, p);
  const nF = (df) => Math.max(3, Math.round(q(150) * df / (Math.PI * 2)));
  let Tmax = 0, rMax = 0;
  for (let i = 0; i <= 400; i++) { const x = i / 400, T = Math.sqrt(1 - x) * P(x); if (T > Tmax) { Tmax = T; rMax = R0 * Math.sqrt(x); } }

  const AD = 0.5; // meja osrednje vdolbine (r ≈ 1,9 µm, kjer se ploskev iz sklede prevesi v rob)
  const AO = 0.98; // zunanja meja okna v membrani (r ≈ 3,3 µm)

  // ---------- ena celica in prerez (skupina v µm) ----------
  const sCel = new THREE.Group(); group.add(sCel);
  const cel = new THREE.Group(); sCel.add(cel);
  // os celice nagnemo za 20° proti privzeti kameri (od spredaj levo zgoraj), da se vidita vdolbina in prerez
  const kam = V(-0.47, 0.34, 0.81).normalize();
  const nag = new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0).cross(kam).normalize(), THREE.MathUtils.degToRad(20));
  cel.quaternion.copy(nag);
  const kamL = kam.clone().applyQuaternion(nag.clone().invert());
  const fc = Math.atan2(kamL.z, kamL.x);
  const W = 1.95, fa = fc - W / 2, fb = fc + W / 2; // odrezan klin
  const fw0 = fb + 0.12, fw1 = fb + 1.15; // okno v membrani nad citoskeletom
  const fk = fa + Math.PI * 2;

  // Membrana: mokra temno rdeča ploskev (barvo ji da hemoglobin pod njo). Nad citoskeletom je okno iz »stekla«, da se
  // skozi membrano vidi mreža spektrina, ki je od spodaj pripeta nanjo.
  const memMat = mat(0x9c1424, { roughness: 0.4, clearcoat: 0.65, clearcoatRoughness: 0.12, sheen: 0.6, sheenColor: new THREE.Color(0xff7a86), sheenRoughness: 0.35 });
  const vdMat = mat(0xb21e2e, { roughness: 0.38, clearcoat: 0.65, clearcoatRoughness: 0.12, sheen: 0.6, sheenColor: new THREE.Color(0xff9096), sheenRoughness: 0.35 });
  // cela celica
  const memCela = new THREE.Mesh(ploskev(kos(AD, Math.PI - AD, 0, Math.PI * 2), nF(Math.PI * 2), q(90)), memMat);
  const vdCela = new THREE.Mesh(zdruzi([
    ploskev(kos(0, AD, 0, Math.PI * 2), nF(Math.PI * 2), q(22)),
    ploskev(kos(Math.PI - AD, Math.PI, 0, Math.PI * 2), nF(Math.PI * 2), q(22)),
  ]), vdMat);
  // prerez: brez klina; okno nad citoskeletom je stekleno
  const memPrerez = new THREE.Mesh(zdruzi([
    ploskev(kos(AD, Math.PI - AD, fb, fw0), nF(fw0 - fb), q(90)),
    ploskev(kos(AO, Math.PI - AD, fw0, fw1), nF(fw1 - fw0), q(60)),
    ploskev(kos(AD, Math.PI - AD, fw1, fk), nF(fk - fw1), q(90)),
  ]), memMat);
  const okno = new THREE.Mesh(ploskev(kos(AD, AO, fw0, fw1), nF(fw1 - fw0), q(24)),
    kit.steklo(mat(0xd04656, { side: THREE.FrontSide }), { a: 0.1, rf: 5, k: 0.8, rob: "#ff9cab", rk: 0.95, iri: 0.4 }));
  const vdPrerez = new THREE.Mesh(zdruzi([
    ploskev(kos(0, AD, fb, fk), nF(fk - fb), q(22)),
    ploskev(kos(Math.PI - AD, Math.PI, fb, fk), nF(fk - fb), q(22)),
  ]), vdMat);
  // debela membrana na obeh ploskvah prereza: trak med profilom in profilom, zamaknjenim navznoter (debelina povečana)
  const TM = 0.17;
  const robPrereza = [], rezTocke = [];
  const trakProfila = (f, sm) => {
    const A = [], Bz = [], n = V(-Math.sin(f), 0, Math.cos(f)).multiplyScalar(sm), N = q(160);
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI, [r, y] = profil(a), [r1, y1] = profil(Math.min(Math.PI, a + 1e-3)), [r0, y0] = profil(Math.max(0, a - 1e-3));
      let nr = y1 - y0, ny = -(r1 - r0); const l = Math.hypot(nr, ny) || 1; nr /= l; ny /= l;
      const k = 1 + 0.006 * fbm(r * Math.cos(f) * 0.9 + 4, y * 0.9, r * Math.sin(f) * 0.9);
      Bz.push(V(r * k * 0.999 * Math.cos(f), y * k * 0.999, r * k * 0.999 * Math.sin(f)).addScaledVector(n, 0.004));
      const ri = Math.max(0, r * k + nr * TM), yi = y * k + ny * TM;
      A.push(V(ri * Math.cos(f), yi, ri * Math.sin(f)).addScaledVector(n, 0.004));
    }
    // beljakovine pas 3, ki prečkajo dvosloj (na ploskvi prereza)
    for (let i = 3; i < N - 2; i += hi ? 5 : 7) if (rnd() < 0.55) rezTocke.push({ p: A[i].clone().lerp(Bz[i], 0.5).addScaledVector(n, 0.01), n: Bz[i].clone().sub(A[i]).normalize() });
    // ostra obroba prereza: svetla cevka ob zunanjem robu, temnejša ob notranjem
    robPrereza.push(pobarvaj(nit(Bz.map((p) => p.clone().addScaledVector(n, 0.004)), 0.024, 120, 6), 0xe0566a), pobarvaj(nit(A.map((p) => p.clone().addScaledVector(n, 0.004)), 0.016, 120, 5), 0x5e0c1c));
    const C = (x) => new THREE.Color(x); // od notranje strani: temna citoplazemska stran, glave, repi (svetlejši), glave, zunanja stran
    return trakPlasti(A, Bz, n, [[0, 0.06, C(0x3e0814)], [0.1, 0.28, C(0x9a1a30)], [0.38, 0.62, C(0xf2b0b4)], [0.72, 0.9, C(0x9a1a30)], [0.95, 1, C(0xc8344a)]]);
  };
  const memTrakG = [trakProfila(fa, 1), trakProfila(fb, -1)];
  const memTrak = new THREE.Mesh(zdruziPlasti(memTrakG), matPlasti({ roughness: 0.42, clearcoat: 0.5, clearcoatRoughness: 0.15, sheen: 0.3, sheenColor: new THREE.Color(0xffc0c8) }));
  memTrak.material.userData.rez = true; // plasti dvosloja ostanejo kot so (brez reliefa in brez učbeniških barv)
  const memRob = new THREE.Mesh(zdruzi(robPrereza, true), mat(0xffffff, { vertexColors: true, roughness: 0.32, clearcoat: 0.8 }));
  cel.add(memCela, vdCela, memPrerez, vdPrerez, memTrak, memRob, okno);

  // citoplazma: ploskvi prereza (prečni prerez v obliki ročke) in dno okna
  const pokrovF = (f) => (u, v, p) => { const a = v * Math.PI / 2, [r, h] = profil(a); return p.set(r * 0.996 * Math.cos(f), (2 * u - 1) * h * 0.99, r * 0.996 * Math.sin(f)); };
  const notranja = odmik(kos(AD - 0.03, AO + 0.03, fw0 - 0.03, fw1 + 0.03), -0.12);
  const citMat = mat(0x6e0f1e, { roughness: 0.55, clearcoat: 0.35, sheen: 0.35, sheenColor: new THREE.Color(0xb03848), side: THREE.DoubleSide });
  const cit = new THREE.Mesh(zdruzi([ploskev(pokrovF(fa), q(24), q(48)), ploskev(pokrovF(fb), q(24), q(48)), ploskev(notranja, q(30), q(24))]), citMat);
  cel.add(cit);

  // hemoglobin: molekule (2 α in 2 β verigi) na ploskvah prereza in na dnu okna
  const lobi = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map(([x, y, z], i) => {
    const g = new THREE.IcosahedronGeometry(0.042, 0), nr = g.attributes.normal, pp = g.attributes.position;
    for (let k = 0; k < nr.count; k++) { const l = Math.hypot(pp.getX(k), pp.getY(k), pp.getZ(k)); nr.setXYZ(k, pp.getX(k) / l, pp.getY(k) / l, pp.getZ(k) / l); } // gladke normale
    g.translate(x * 0.028, y * 0.028, z * 0.028);
    return pobarvaj(g, i < 2 ? 0xf0303f : 0xa3102a);
  });
  // hem (rdeča kepica z železom) v vsaki verigi: drobne temnejše zrnce na površini
  const hemi = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map(([x, y, z]) => pobarvaj(new THREE.IcosahedronGeometry(0.014, 0).translate(x * 0.052, y * 0.052, z * 0.052), 0x4a0410));
  const hbGeo = zdruzi(hi ? [...lobi, ...hemi] : lobi, true);
  const hbTocke = [];
  for (const [f, s] of [[fa, 1], [fb, -1]]) {
    const n = V(-Math.sin(f), 0, Math.cos(f)).multiplyScalar(s);
    // gosto zložene molekule (v krvnički je hemoglobina ~ tretjina mase), v dveh rahlo zamaknjenih plasteh za globino
    const dmin = hi ? 0.13 : 0.165, nase = [];
    for (let t = 0; t < 18000; t++) {
      const r = 0.06 + rnd() * (R0 - 0.28), x = (r / R0) ** 2, h = 0.5 * Math.sqrt(1 - x) * P(x) - TM - 0.04;
      if (h < 0.04) continue;
      const y = (rnd() * 2 - 1) * h, z = hi && rnd() < 0.3 ? -0.03 : 0.018;
      if (nase.some((p) => (p[0] - r) ** 2 + (p[1] - y) ** 2 < dmin * dmin * (p[2] === z ? 1 : 0.3))) continue;
      nase.push([r, y, z]);
      hbTocke.push(V(r * Math.cos(f), y, r * Math.sin(f)).addScaledVector(n, z));
    }
  }
  const hb = new THREE.InstancedMesh(hbGeo, mat(0xffffff, { vertexColors: true, roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.1, sheen: 0.3, sheenColor: new THREE.Color(0xff8a8a) }), hbTocke.length);
  hbTocke.forEach((p, i) => {
    o.position.copy(p); o.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6); o.scale.setScalar(0.85 + rnd() * 0.3); o.updateMatrix(); hb.setMatrixAt(i, o.matrix);
    const k = 0.8 + 0.35 * rnd(); hb.setColorAt(i, new THREE.Color(k, k * (0.9 + 0.1 * rnd()), k)); // nekaj svetlejših (s kisikom) in temnejših molekul
  });
  cel.add(hb);

  // citoskelet: trikotna mreža spektrina s stičnimi kompleksi (aktin) tik pod membrano, pripeta z ankirinom na pas 3
  const plast = odmik(kos(AD - 0.04, AO + 0.04, fw0 - 0.05, fw1 + 0.05), -0.055);
  const vozli = [], dV = hi ? 0.3 : 0.36, p0 = V();
  for (let t = 0; t < 6000 && vozli.length < 175; t++) {
    const u = rnd(), v = rnd();
    plast(u, v, p0);
    if (vozli.some((w) => w.distanceToSquared(p0) < dV * dV)) continue;
    vozli.push(p0.clone());
  }
  const spK = [], voz = [], ankTocke = [];
  const robovi = new Set();
  vozli.forEach((a, i) => {
    vozli.map((b, j) => [j, a.distanceTo(b)]).filter(([j, d]) => j !== i && d < dV * 1.75).sort((x, y) => x[1] - y[1]).slice(0, 6).forEach(([j]) => {
      const kl = i < j ? i + "-" + j : j + "-" + i;
      if (robovi.has(kl)) return;
      robovi.add(kl);
      // tetramer spektrina: dve prepleteni verigi (α in β), ki vijugata med stičnima kompleksoma; na sredini ankirin
      const b = vozli[j], ab = b.clone().sub(a), L = ab.length(), u = V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).cross(ab).normalize(), w = u.clone().cross(ab).normalize();
      for (const fz of hi ? [0, Math.PI] : [0]) {
        const t = [];
        for (let i = 0; i <= 8; i++) { const s = i / 8, ov = Math.sin(s * Math.PI) * (0.022 + 0.012 * Math.sin(s * 9 + fz)), a2 = s * 11 + fz; t.push(a.clone().addScaledVector(ab, s).addScaledVector(u, Math.cos(a2) * ov + Math.sin(s * Math.PI * 2) * 0.03).addScaledVector(w, Math.sin(a2) * ov)); }
        spK.push(new THREE.CatmullRomCurve3(t));
      }
      if (L > 0.2 && (hi || rnd() < 0.5)) {
        const m = a.clone().addScaledVector(ab, 0.5), g = new THREE.IcosahedronGeometry(0.034, 0); g.scale(1, 0.8, 1.25); g.translate(m.x, m.y, m.z);
        voz.push(pobarvaj(g, 0x7fe0ff)); ankTocke.push(m);
      }
    });
  });
  vozli.forEach((a) => { // stični kompleks: kratek aktinski filament z beljakovino 4.1
    const g = new THREE.CapsuleGeometry(0.022, 0.06, 1, hi ? 6 : 4); g.rotateX(rnd() * 3); g.rotateZ(rnd() * 3); g.translate(a.x, a.y, a.z); voz.push(pobarvaj(g, 0xff9a3c));
  });
  const spektrin = kit.vlakna(spK, 0.011, B.citoskelet, { sij: 0.5, seg: hi ? 12 : 6, rad: hi ? 4 : 3 });
  const spVoz = new THREE.Mesh(zdruzi(voz, true), mat(0xffffff, { vertexColors: true, roughness: 0.35, clearcoat: 0.7, emissive: new THREE.Color(0x2a1a08) }));
  cel.add(spektrin, spVoz);

  // Točke na površju celice (enakomerno po ploščini) z normalo; klin = v odrezanem klinu, okno = pod steklenim oknom.
  function povrsinske(n) {
    const out = [], pA = V(), pB = V(), nn = V();
    for (let t = 0; out.length < n && t < n * 40; t++) {
      const a = rnd() * Math.PI, f = rnd() * Math.PI * 2;
      povrsje(a, f, pA); povrsje(a + 0.01, f, pB);
      const w = (pA.distanceTo(pB) / 0.01) * Math.sin(a) * R0;
      if (rnd() * 6 > w) continue;
      const fn = (u, v, p) => povrsje(a + (v - 0.5) * 0.02, f + (u - 0.5) * 0.02, p);
      normala(fn, 0.5, 0.5, nn);
      const df = ((f - fa) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      out.push({ p: pA.clone(), n: nn.clone(), klin: df < W + 0.02, okno: df > fw0 - fa && df < fw1 - fa && a > AD && a < AO });
    }
    // najprej točke zunaj klina: v prerezu prikažemo le prvih »zunaj« primerkov
    out.sort((x, y) => x.klin - y.klin);
    out.zunaj = out.filter((x) => !x.klin).length;
    return out;
  }
  // beljakovina pas 3 (izmenjevalec anionov): dvojne kepice v membrani; nad vsakim ankirinom ena, ki drži spektrin
  const pasT = povrsinske(hi ? 1300 : 400);
  const nadA = ankTocke.map((m) => {
    let best = pasT[0], bd = 1e9;
    for (const t of pasT) { const x = t.p.distanceToSquared(m); if (x < bd) { bd = x; best = t; } }
    return { p: m.clone().addScaledVector(best.n, 0.055), n: best.n };
  });
  const pasVse = [...nadA, ...pasT];
  const pasZunaj = nadA.length + pasT.zunaj;
  const dvig = (t, d) => ({ p: t.p.clone().addScaledVector(t.n, d), n: t.n });
  const pas3 = kit.beljakovine(pasVse.map((t) => dvig(t, 0.008)), "#4f7dff", 0.034, { visina: 1.2, razp: 0.45 });
  const pas3Rez = kit.beljakovine(rezTocke, "#4f7dff", TM * 0.3, { visina: 2, razp: 0.3 });
  // glikoforin: tanko steblo čez membrano z razvejanimi sladkorji (sialna kislina na koncih)
  const glfDeli = [], glfBarve = [];
  { const s = new THREE.CylinderGeometry(0.011, 0.016, 0.2, hi ? 5 : 3, 1, true); s.translate(0, 0.1, 0); glfDeli.push(s); glfBarve.push(0x2ad6c4);
    for (const [x, y, z] of hi ? [[0, 0.22, 0], [0.04, 0.19, 0.02], [-0.035, 0.17, -0.025], [0.01, 0.15, 0.04]] : [[0, 0.22, 0], [0.04, 0.18, 0.02]]) { glfDeli.push(new THREE.IcosahedronGeometry(0.022, 0).translate(x, y, z)); glfBarve.push(0xff6fb4); } }
  const glfT = povrsinske(hi ? 520 : 170);
  const glikoforin = new THREE.InstancedMesh(zdruzi(glfDeli, glfBarve), mat(0xffffff, { vertexColors: true, roughness: 0.35, clearcoat: 0.7 }), glfT.length);
  glfT.forEach((t, i) => { o.position.copy(t.p); o.quaternion.setFromUnitVectors(V(0, 1, 0), t.n); o.rotateY(rnd() * 6); o.scale.setScalar(0.8 + rnd() * 0.4); o.updateMatrix(); glikoforin.setMatrixAt(i, o.matrix); });
  cel.add(pas3, pas3Rez, glikoforin);

  // glikokaliks: sladkorne verige z antigeni krvnih skupin
  // razvejana sladkorna veriga: steblo, dve stranski veji in kroglice sladkorjev na koncih (antigeni krvnih skupin)
  const drevo = [];
  for (const [rx, rz, h, y0] of [[0, 0, 0.1, 0], [0.6, 0.25, 0.065, 0.06], [-0.55, -0.35, 0.06, 0.075]]) {
    const c = new THREE.ConeGeometry(0.013, h, 3, 1, true);
    c.translate(0, h / 2, 0); c.rotateX(rx); c.rotateZ(rz); c.translate(0, y0, 0);
    drevo.push(c);
    if (hi || !rx) { const k = new THREE.TetrahedronGeometry(0.02, 0); k.translate(0, h, 0); k.rotateX(rx); k.rotateZ(rz); k.translate(0, y0, 0); drevo.push(k); }
  }
  const glikGeo = zdruzi(drevo);
  const glTocke = povrsinske(hi ? 2000 : 700);
  const glik = new THREE.InstancedMesh(glikGeo, mat(0xc2a0f0, { roughness: 0.45, clearcoat: 0.4, sheen: 0.4, sheenColor: new THREE.Color(0xe0d0ff) }), glTocke.length);
  const Y = V(0, 1, 0);
  const _gc = new THREE.Color();
  glTocke.forEach((g, k) => {
    o.position.copy(g.p); o.quaternion.setFromUnitVectors(Y, g.n); o.rotateY(rnd() * 6); o.scale.setScalar(0.5 + rnd() * 0.35); o.updateMatrix();
    glik.setMatrixAt(k, o.matrix); const sv = 0.78 + 0.4 * hash(g.p.x * 7, g.p.y * 7, g.p.z * 7); glik.setColorAt(k, _gc.setRGB(sv, sv * 0.97, sv));
  });
  cel.add(glik);
  // v prerezu skrije primerke v odrezanem klinu (urejeni so na konec)
  function povrsje3(prerez) {
    for (const [m, n, z] of [[glik, glTocke.length, glTocke.zunaj], [glikoforin, glfT.length, glfT.zunaj], [pas3, pasVse.length, pasZunaj]]) {
      m.count = prerez ? z : n; m.computeBoundingSphere(); m.computeBoundingBox();
    }
  }
  povrsje3(true);
  const sCel_s = umeri(sCel, 0.93);

  // ---------- skupek: kupček krvničk (rouleaux) v kapilari ----------
  const sKup = new THREE.Group(); group.add(sKup);
  const celaGeo = zdruzi([
    pobarvaj(ploskev(kos(AD, Math.PI - AD, 0, Math.PI * 2), q(96), q(56)), 0xb82c3a),
    pobarvaj(ploskev(kos(0, AD, 0, Math.PI * 2), q(96), q(14)), 0xc53a46),
    pobarvaj(ploskev(kos(Math.PI - AD, Math.PI, 0, Math.PI * 2), q(96), q(14)), 0xc53a46),
  ], true);
  const nKup = 6, razmik = 2.42;
  const kupcek = new THREE.InstancedMesh(celaGeo, mat(0xffffff, { vertexColors: true, roughness: 0.46, clearcoat: 0.5, clearcoatRoughness: 0.14, sheen: 0.5, sheenColor: new THREE.Color(0xe0646c) }), nKup);
  const kupPol = [];
  for (let i = 0; i < nKup; i++) {
    const x = (i - (nKup - 1) / 2) * razmik;
    kupPol.push({ x, y: (rnd() - 0.5) * 0.35, z: (rnd() - 0.5) * 0.35, rx: (rnd() - 0.5) * 0.5, ry: (rnd() - 0.5) * 0.1, rz: -Math.PI / 2 + (rnd() - 0.5) * 0.12, f: rnd() * 6 });
  }
  function postaviKup(t) {
    kupPol.forEach((c, i) => {
      const s = gib ? Math.sin(t * 0.8 + c.f) : 0;
      o.position.set(c.x + Math.sin(t * 0.35) * 0.25 * (gib ? 1 : 0), c.y + s * 0.04, c.z);
      o.rotation.set(c.rx + s * 0.02, c.ry, c.rz); o.scale.setScalar(1); o.updateMatrix();
      kupcek.setMatrixAt(i, o.matrix);
    });
    kupcek.instanceMatrix.needsUpdate = true;
  }
  postaviKup(0);
  sKup.add(kupcek);
  // stena kapilare iz ploščatih endotelijskih celic, odprta spredaj zgoraj
  const L = 18.5, Rn = 4.35, Rz = 4.8, p0k = -0.2, p1k = 1.85, pk = p0k + Math.PI * 2;
  const valj = (r, ps, pe) => (u, v, p) => { const ps2 = ps + (pe - ps) * v, x = (u - 0.5) * L; const rr = r * (1 + 0.012 * fbm(x * 0.4, Math.cos(ps2) * 2, Math.sin(ps2) * 2)); return p.set(x, rr * Math.cos(ps2), rr * Math.sin(ps2)); };
  const presek = (ps) => (u, v, p) => { const x = (u - 0.5) * L, r = Rn + (Rz - Rn) * v; return p.set(x, r * Math.cos(ps), r * Math.sin(ps)); };
  const konec = (s) => (u, v, p) => { const ps = p1k + (pk - p1k) * u, r = Rn + (Rz - Rn) * v; return p.set(s * L / 2, r * Math.cos(ps), r * Math.sin(ps)); };
  const stik = [];
  for (const ps of [2.05, 2.95, 5.75]) {
    const t = [];
    for (let i = 0; i <= 24; i++) { const x = (i / 24 - 0.5) * L * 0.98, pp = ps + 0.25 * Math.sin(x * 0.35 + ps * 3); t.push(V(x, Rz * 1.004 * Math.cos(pp), Rz * 1.004 * Math.sin(pp))); }
    stik.push(pobarvaj(nit(t, 0.05, 80, 5), 0xa86558));
  }
  const kapGeo = zdruzi([
    pobarvaj(ploskev(valj(Rz, p1k, pk), q(60), q(80)), 0xc98a7c),
    pobarvaj(ploskev(valj(Rn, p1k, pk), q(60), q(80), true), 0x8e5048),
    pobarvaj(ploskev(presek(p0k + Math.PI * 2), q(30), 2), 0xc89484),
    pobarvaj(ploskev(presek(p1k), q(30), 2), 0xc89484),
    pobarvaj(ploskev(konec(-1), q(60), 2), 0xc89484),
    pobarvaj(ploskev(konec(1), q(60), 2), 0xc89484),
    ...stik,
  ], true);
  const kapilara = new THREE.Mesh(kapGeo, mat(0xffffff, { vertexColors: true, roughness: 0.56, clearcoat: 0.35, clearcoatRoughness: 0.2, sheen: 0.4, sheenColor: new THREE.Color(0xd8a090), side: THREE.DoubleSide }));
  sKup.add(kapilara);
  // jedra endotelijskih celic: sploščena, izbočena v svetlino žile
  const jedGeo = [];
  for (const [x, ps] of [[-3.8, 2.45], [4.6, 5.45]]) {
    const g = new THREE.SphereGeometry(1, q(28), q(16));
    deformiraj(g, (v) => { v.set(v.x * 2.4, v.y * 0.5, v.z * 1.15).multiplyScalar(1 + 0.04 * sum(v.x * 3, v.y * 3, v.z * 3)); });
    const m = new THREE.Matrix4().makeRotationX(ps).setPosition(x, (Rn + Rz) / 2 * Math.cos(ps), (Rn + Rz) / 2 * Math.sin(ps));
    g.applyMatrix4(m); jedGeo.push(g);
  }
  const endJedra = new THREE.Mesh(zdruzi(jedGeo), mat(0x6654c4, { roughness: 0.45, clearcoat: 0.4, sheen: 0.4 }));
  sKup.add(endJedra);
  const sKup_s = umeri(sKup, 0.95);

  // ---------- deli (vsi enkrat; seznam pokaže le dele, ki so v trenutnem prikazu vidni) ----------
  let prikaz = "prerez";
  const loc = (x, y, z) => V(x, y, z).applyQuaternion(nag).multiplyScalar(sCel_s).add(sCel.position).toArray();
  const tockaL = (a, f, d = 0) => { const p = povrsje(a, f, V()); return loc(p.x * (1 + d), p.y * (1 + d), p.z * (1 + d)); };
  const fm = (fw1 + fk) / 2 + 0.3;
  const kp = (x, y, z) => V(x, y, z).multiplyScalar(sKup_s).add(sKup.position).toArray();
  const pr = () => prikaz === "prerez";
  const sredOkna = (d) => tockaL((AD + AO) / 2, (fw0 + fw1) / 2, d);
  del("membrana", "Celična membrana", "Tanka prožna ovojnica iz dveh plasti maščob z beljakovinami; krvnička se z njo zvije in stisne skozi kapilare, ki so ožje od nje. Okno v njej je prozorno, debelina povečana.", "#d9545f",
    [memCela, memPrerez, memTrak, memRob, okno], () => (pr() ? tockaL(1.25, fm) : tockaL(1.3, fc - 0.5)));
  del("vdolbina", "Osrednja vdolbina", "Na sredini je krvnička tanjša (0,8 µm) kot ob robu (2,6 µm). Zato ima veliko površino in kisik hitro pride do vsega hemoglobina.", "#e26a72",
    [vdCela, vdPrerez], () => (pr() ? tockaL(0.12, fm) : tockaL(0.05, fc)));
  const pp3 = pasVse[nadA.length + 3].p;
  del("pas-3", "Beljakovina pas 3", "Najpogostejša beljakovina membrane (okoli milijon v krvnički). Izmenjuje hidrogenkarbonatne in kloridne ione, kar pomaga odnašati CO₂, in prek ankirina drži mrežo spektrina.", "#4f7dff",
    [pas3, pas3Rez], () => (pr() ? sredOkna(0.02) : loc(pp3.x, pp3.y, pp3.z)));
  const pgf = glfT[5].p;
  del("glikoforin", "Glikoforin", "Beljakovina, ki prečka membrano in nosi veliko sladkorjev s sialno kislino. Ta da krvnički negativen naboj, zato se krvničke odbijajo in ne zlepijo.", "#2ad6c4",
    [glikoforin], () => loc(pgf.x, pgf.y, pgf.z));
  del("glikokaliks", "Glikokaliks (antigeni krvnih skupin)", "Kratke sladkorne verige na beljakovinah in maščobah membrane; po njih telo prepozna svoje krvničke, njihova vrsta pa določa krvno skupino (A, B, AB ali 0).", "#cfb0ec",
    [glik], () => tockaL(1.1, pr() ? fm + 0.8 : fc + 0.9, 0.03));
  del("citoplazma", "Citoplazma", "Notranjost krvničke brez jedra in mitohondrijev; skoraj tretjino njene mase predstavlja hemoglobin.", "#8f1d2c",
    [cit], loc(1.0 * Math.cos(fb), -0.1, 1.0 * Math.sin(fb)));
  const ph = hbTocke.reduce((a, p) => (Math.abs(p.y) < 0.4 && Math.hypot(p.x, p.z) > 2.2 && Math.hypot(p.x, p.z) < 2.6 ? p : a), hbTocke[0]);
  del("hemoglobin", "Hemoglobin", "Rdeča beljakovina iz štirih verig, vsaka s hemom z železom; v pljučih veže kisik in ga odda v tkivih. V eni krvnički je okoli 270 milijonov molekul.", "#e23b48",
    [hb], loc(ph.x, ph.y, ph.z));
  const pv = vozli[Math.floor(vozli.length / 2)];
  del("citoskelet", "Citoskelet (mreža spektrina)", "Mreža niti spektrina tik pod membrano, povezana s kratkimi aktinskimi niti in z ankirinom pripeta na pas 3; krvnički daje obliko in prožnost.", B.citoskelet,
    [spektrin, spVoz], loc(pv.x, pv.y, pv.z));
  del("krvnicke", "Rdeče krvničke v kupčku", "V počasnem toku se krvničke zložijo ena na drugo kot kovanci; v ozkih kapilarah sicer potujejo ena za drugo in se pri tem zvijejo.", "#d9545f",
    [kupcek], kp(-razmik * 2.5 - 0.6, 1.8, 1.2));
  del("kapilara", "Stena kapilare", "Najtanjša krvna žila; njeno steno gradi ena plast ploščatih endotelijskih celic, skozi katero prehajata kisik in hrana.", "#e3a796",
    [kapilara], kp(2, Rz * Math.cos(2.3), Rz * Math.sin(2.3)));
  del("endotel-jedro", "Jedro endotelijske celice", "Sploščeno jedro celice, ki gradi steno kapilare; tam je stena nekoliko debelejša.", B.jedro,
    [endJedra], kp(-3.8, (Rz + 0.5) * Math.cos(2.45), (Rz + 0.5) * Math.sin(2.45)));

  function nastavi(v) {
    prikaz = v;
    const p = v === "prerez";
    sCel.visible = v !== "skupek"; sKup.visible = v === "skupek";
    memCela.visible = vdCela.visible = !p;
    for (const m of [memPrerez, vdPrerez, okno, memTrak, memRob, cit, hb, spektrin, spVoz, pas3Rez]) m.visible = p;
    povrsje3(p);
  }
  const fmt = (x) => x.toFixed(1).replace(".", ",");
  const nadzor = [
    { tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["ena", "Ena celica"], ["prerez", "Prerez"], ["skupek", "Skupek"]], vrednost: "prerez", ob: nastavi },
    { tip: "izpis", id: "mere", oznaka: "Mere", vrednost: () => `premer ${fmt(2 * R0)} µm · rob ${fmt(Tmax)} µm · sredina ${fmt(C0)} µm` },
  ];
  const zac = ctx.zacetek && ctx.zacetek.prikaz;
  if (zac && ["ena", "prerez", "skupek"].includes(zac)) nadzor[0].vrednost = zac;
  nastavi(nadzor[0].vrednost);

  // mokri sijaj in relief (obe skupini sta v µm, zato gostote na µm; skupek je pomanjšan bolj)
  kit.poliraj(group, deli, {
    membrana: { tex: "zrna", rf: 4.5, k: hi ? 0.7 : 0.3, b: 0.2, s: 0.12, lisa: 0.18, f: 0.7, sheen: 0.22, cc: 0.6, ccr: 0.14, rough: 0.36 },
    vdolbina: { tex: "zrna", rf: 4.5, k: hi ? 0.6 : 0.3, b: 0.18, s: 0.12, lisa: 0.16, f: 0.7, sheen: 0.22, cc: 0.6, ccr: 0.14, rough: 0.34 },
    "pas-3": { tex: "zrna", rf: 60, k: 0.6 },
    glikoforin: { tex: null },
    glikokaliks: { tex: null },
    citoplazma: { tex: "fino", rf: 7, k: 1.2, b: 0.26, lisa: 0.22, f: 1.4, sheen: 0.12, temni: 0.75 },
    hemoglobin: { tex: "zrna", rf: 40, k: 0.5, b: 0.12 },
    citoskelet: { tex: null },
    krvnicke: { tex: "zrna", rf: 2.5, k: 0.45, b: 0.14, s: 0.14, sheen: 0.25 },
    kapilara: { tex: "gube", rf: 0.9, k: 0.5, b: 0.14, lisa: 0.1, f: 0.4, sheen: 0.3 },
    "endotel-jedro": { tex: "zrna", rf: 3, k: 1, b: 0.18 },
  });
  // stikalo »Barve kot v učbeniku« (po poliranju, da shrani končne barve)
  nadzor.push(kit.barveUcbenika(deli, { membrana: "#e0485a", vdolbina: "#f08a94", "pas-3": "#3a6fd8", glikoforin: "#2fb8a8", glikokaliks: "#c9a0e6",
    citoplazma: "#c8303e", hemoglobin: "#9e1424", krvnicke: "#e0485a", kapilara: "#e8b4a0", "endotel-jedro": "#9a6fe0" }));

  return {
    group,
    oder: "celica",
    pogled: [-0.47, 0.34, 0.81], // smer kamere: yaw −30°, pitch 20° (odrezani del proti gledalcu)
    get deli() { return deli.filter((d) => d.meshes.some((m) => { for (let x = m; x; x = x.parent) if (!x.visible) return false; return true; })); },
    nadzor,
    get merilo() {
      const um = prikaz === "skupek" ? 2 / sKup_s : 2 / sCel_s;
      return { m: um * 1e-6, oznaka: oznaka(um) };
    },
    korak(t) {
      if (!gib) return;
      if (prikaz === "skupek") postaviKup(t);
      else cel.quaternion.copy(nag).multiply(new THREE.Quaternion().setFromAxisAngle(Y, Math.sin(t * 0.15) * 0.05));
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
