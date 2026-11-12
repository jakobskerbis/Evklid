// Evglena (Euglena gracilis): vretenast bičkar s kloroplasti in očesno pego; odrezan klin vzdolž celice pokaže notranjost.
// Pogodba graditelja: docs/3d.md. THREE pride od kompleta; skupni videz celic iz public/3d/celice-videz.js.
import { videzCelic, BARVE as B } from "../../celice-videz.js";

export const info = {
  id: "celica-evglena",
  naslov: "Evglena",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Enocelični bičkar iz mlakuž, dolg okoli 50 µm. Na svetlobi dela fotosintezo kot rastlina, v temi pa vsrkava hrano iz vode. Plava z bičem in se pri tem vrti okoli dolge osi.",
  poskusi: "Poišči očesno pego ob biču: čemu služi?",
  merilo: { m: 58e-6, oznaka: "58 µm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const gib = ctx.gibanje !== false;
  const group = new THREE.Group();
  const deli = [];
  const odpad = [];
  let seme = 71;
  // ---------- orodja (enaka kot v zivalska.js, z dodatki za ploskve in prereze) ----------
  const rnd = () => ((seme = (seme * 16807) % 2147483647) - 1) / 2147483646;
  const V = videzCelic(THREE, { hi, odpad });
  const { sum, fbm } = V;
  const gladko = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  // mat(barva, {…}): mokra organska površina (relief in vlažen videz doda V.poliraj na koncu).
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
  const _bela = new THREE.Color(0xffffff);
  // dvosloj fosfolipidov: temni glavi ob obeh straneh, svetlejši rep v sredini
  const DVOSLOJ = (b) => { const c = new THREE.Color(b); return [[0, 0.2, c.clone().multiplyScalar(0.58)], [0.34, 0.66, c.clone().lerp(_bela, 0.42)], [0.8, 1, c.clone().multiplyScalar(0.58)]]; };
  // dvojna ovojnica (jedro, mitohondrij): dva dvosloja z ozkim presledkom med njima
  const DVOJNA = (b, vmes) => { const c = new THREE.Color(b), g = c.clone().multiplyScalar(0.55), r = c.clone().lerp(_bela, 0.35), v = new THREE.Color(vmes); return [[0, 0.07, g], [0.12, 0.24, r], [0.29, 0.31, g], [0.38, 0.62, v], [0.69, 0.71, g], [0.76, 0.88, r], [0.93, 1, g]]; };
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
      const tu = g.attributes.uv, p = g.attributes.position, n = g.attributes.normal, gc = g.attributes.color;
      const c = barve && barve[i] != null ? new THREE.Color(barve[i]) : null;
      for (let k = 0; k < p.count; k++) {
        pos.push(p.getX(k), p.getY(k), p.getZ(k));
        nor.push(n.getX(k), n.getY(k), n.getZ(k));
        if (tu) uv.push(tu.getX(k), tu.getY(k)); else { const x = p.getX(k), y = p.getY(k), zz = p.getZ(k); uv.push(0.5 + Math.atan2(zz, x) / (2 * Math.PI), 0.5 + Math.asin(Math.max(-1, Math.min(1, y / (Math.hypot(x, y, zz) || 1)))) / Math.PI); }
        if (c) col.push(c.r, c.g, c.b);
        else if (barve) { if (gc) col.push(gc.getX(k), gc.getY(k), gc.getZ(k)); else col.push(1, 1, 1); }
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
  function del(id, ime, opis, barva, meshes, tocka) {
    meshes.forEach((m) => { m.userData.del = id; });
    deli.push({ id, ime, opis, barva, meshes, tocka: tocka.map((x) => Math.round(x * 1000) / 1000) });
  }
  // Ploskev iz parametrov: P(u, v, izhod) za več krp [u0, u1, nu, v0, v1, nv] v eni geometriji.
  // Normale računa numerično iz P, zato se krpe zlepijo brez šivov; geo.userData.osvezi(P) premakne oglišča.
  function ploskev(P, krpe, obrni = false) {
    const pos = [], idx = [], uv = [];
    let off = 0;
    for (const [u0, u1, nu, v0, v1, nv] of krpe) {
      for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) uv.push(u0 + (u1 - u0) * i / nu, v0 + (v1 - v0) * j / nv);
      for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
        const a = off + i * (nv + 1) + j, b = a + nv + 1, c = b + 1, d = a + 1;
        if (obrni) idx.push(a, d, b, b, d, c); else idx.push(a, b, d, b, c, d);
      }
      off += (nu + 1) * (nv + 1);
    }
    const n = uv.length / 2;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3));
    g.setIndex(idx);
    const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3(), D = new THREE.Vector3(), E = new THREE.Vector3(), N = new THREE.Vector3();
    g.userData.uv = uv;
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.userData.osvezi = (Pf) => {
      const p = g.attributes.position.array, no = g.attributes.normal.array, e = 1e-3;
      for (let k = 0; k < n; k++) {
        const u = uv[2 * k], v = uv[2 * k + 1];
        Pf(u, v, A);
        p[3 * k] = A.x; p[3 * k + 1] = A.y; p[3 * k + 2] = A.z;
        Pf(u + e, v, B); Pf(u - e, v, C); B.sub(C);
        Pf(u, v + e, C); Pf(u, v - e, D); C.sub(D);
        N.crossVectors(B, C);
        for (let t = 0, eu = e; t < 4 && N.lengthSq() < 1e-14; t++) {
          // izrojena točka (pol, konica): smer v vzemi na sosednjih krogih
          eu *= 6;
          Pf(u + eu, v, B); Pf(u - eu, v, C); B.sub(C);
          Pf(u + eu, v + e, C); Pf(u + eu, v - e, D); C.sub(D);
          Pf(u - eu, v + e, D); Pf(u - eu, v - e, E); D.sub(E); C.add(D);
          N.crossVectors(B, C);
        }
        if (N.lengthSq() < 1e-16) N.copy(A).normalize();
        N.normalize();
        if (obrni) N.negate();
        no[3 * k] = N.x; no[3 * k + 1] = N.y; no[3 * k + 2] = N.z;
      }
      g.attributes.position.needsUpdate = true;
      g.attributes.normal.needsUpdate = true;
      g.computeBoundingSphere();
    };
    g.userData.osvezi(P);
    return g;
  }
  // Barve oglišč iz funkcije položaja (x, y, z, u, v) -> THREE.Color.
  function pobarvaj(g, f) {
    const p = g.attributes.position, uv = g.userData.uv || [];
    const col = new Float32Array(p.count * 3), c = new THREE.Color();
    for (let k = 0; k < p.count; k++) {
      f(p.getX(k), p.getY(k), p.getZ(k), uv[2 * k], uv[2 * k + 1], c);
      col[3 * k] = c.r; col[3 * k + 1] = c.g; col[3 * k + 2] = c.b;
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    return g;
  }
  // Trak med dvema nizoma točk (enako dolgima): ploskev prereza med dvema plastema.
  function pas(A, B) {
    const pos = [], idx = [];
    for (let i = 0; i < A.length; i++) pos.push(A[i].x, A[i].y, A[i].z, B[i].x, B[i].y, B[i].z);
    for (let i = 0; i < A.length - 1; i++) { const a = 2 * i; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  // Cev vzdolž točk.
  const cev = (pts, r, seg, rad, zaprta = false) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, zaprta), seg, r, rad, zaprta);
  // Premakni oglišča s funkcijo f(v: Vector3) (spremeni v na mestu) in preračunaj normale.
  function preoblikuj(g, f) {
    const p = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); f(v, i); p.setXYZ(i, v.x, v.y, v.z); }
    g.computeVertexNormals();
    return g;
  }
  const o = new THREE.Object3D();
  // InstancedMesh iz seznama {p, r (Euler ali Quaternion), s (število ali Vector3)}.
  function instance(geo, material, sez) {
    const m = new THREE.InstancedMesh(geo, material, Math.max(1, sez.length));
    m.count = sez.length;
    postaviInstance(m, sez);
    return m;
  }
  function postaviInstance(m, sez) {
    sez.forEach((x, i) => {
      o.position.copy(x.p);
      if (x.r && x.r.isQuaternion) o.quaternion.copy(x.r); else if (x.r) o.rotation.copy(x.r); else o.rotation.set(0, 0, 0);
      if (x.s == null) o.scale.setScalar(1); else if (typeof x.s === "number") o.scale.setScalar(x.s); else o.scale.copy(x.s);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere && m.computeBoundingSphere();
  }
  // vse gradimo v »tel« (povečano 1,38-krat, 1 enota scene ≈ 29 µm; premer enotske krogle 58 µm); bič leži nazaj ob telesu
  const tel = new THREE.Group();
  tel.scale.setScalar(1.38);
  tel.position.x = 0.39;
  group.add(tel);
  tel.updateMatrix();

  // ---------- vretenasto telo ----------
  // 1 enota (v »tel«) = 40 µm; telo je dolgo 1,25 enote (50 µm) in široko 0,3 (12 µm). Spredaj (+x) je top, zadaj koničast.
  // u ∈ [0, 1] od zadnje konice do sprednjega konca, v okoli osi x; klin v ∈ (0, π/2) je odrezan.
  const X0 = -0.97, X1 = 0.28, RM = 0.152, TAU = Math.PI * 2;
  const profil = (u) => RM * Math.pow(Math.sin(Math.PI * Math.pow(Math.min(1, Math.max(0, u)), 1.45)), 0.78);
  const N_TRAK = 18; // spiralni trakovi pelikule
  function telo(u, v, d, out) {
    const x = X0 + (X1 - X0) * u;
    const trak = 0.0032 * Math.cos(N_TRAK * (v + x * 2.6)) * gladko(0, 0.15, u) * (d < 0.006 ? 1 : 0);
    const r = Math.max(0, profil(u) - d + trak + 0.004 * sum(u * 9, Math.cos(v) * 2, Math.sin(v) * 2));
    return out.set(x * (1 - d * 0.6), r * Math.cos(v) * 1.02, r * Math.sin(v) * 0.94);
  }
  const P = (d) => (u, v, out) => telo(u, v, d, out);
  const odprta = (nu, nv) => [[0, 1, nu, Math.PI / 2, TAU, Math.round(nv * 0.75)]];
  const pokrov = (nu, nv) => [[0, 1, nu, 0, Math.PI / 2, Math.round(nv * 0.25)]];
  const robT = (d, v, n = q(100)) => { const a = []; for (let i = 0; i <= n; i++) a.push(telo(i / n, v, d, new THREE.Vector3())); return a; };
  const D_MEM = 0.004, D_PEL = 0.013;

  // klin v ∈ (0, π/2) je odrezan: ali je kot v (poljuben) v klinu
  const vKlinu = (v) => { const w = ((v % TAU) + TAU) % TAU; return w > 0 && w < Math.PI / 2; };

  // pelikula je steklena (prosojna s svetlim robom), da se skoznjo vidi notranjost; spiralne trakove kažejo grebeni in vlakna
  const pelGeo = ploskev(P(0), odprta(q(150), q(112)), true), pelPGeo = ploskev(P(0), pokrov(q(150), q(112)), true);
  const pelMat = V.steklo(mat(B.membrana, { side: THREE.FrontSide }), { a: 0.15, rf: 38, k: 1, tex: "vlakna", rob: "#9ee8c8", rk: 1.3 });
  const pelikula = new THREE.Mesh(pelGeo, pelMat);
  const pelPokrov = new THREE.Mesh(pelPGeo, pelMat);
  pelPokrov.visible = false;
  // beljakovinski trakovi pelikule: vlakno pod vsakim grebenom (v = 2πk/N − 2,6·x), razdeljeno na del zunaj in znotraj klina
  const trakOdp = [], trakKlin = [];
  for (let k = 0; k < N_TRAK; k++) {
    let tek = [], vKl = null;
    const n = hi ? 90 : 46;
    for (let i = 0; i <= n; i++) {
      const u = 0.035 + 0.93 * i / n, x = X0 + (X1 - X0) * u, v = TAU * k / N_TRAK - x * 2.6;
      const p = telo(u, v, 0.0062, new THREE.Vector3()), kl = vKlinu(v);
      if (vKl !== null && kl !== vKl) { tek.push(p); if (tek.length > 3) (vKl ? trakKlin : trakOdp).push(new THREE.CatmullRomCurve3(tek)); tek = [p]; }
      else tek.push(p);
      vKl = kl;
    }
    if (tek.length > 3) (vKl ? trakKlin : trakOdp).push(new THREE.CatmullRomCurve3(tek));
  }
  const trakovi = V.vlakna(trakOdp, 0.0018, "#57cf9f", { seg: hi ? 44 : 20, rad: hi ? 5 : 3, sij: 0.22 });
  const trakoviK = V.vlakna(trakKlin, 0.0018, "#57cf9f", { seg: hi ? 20 : 10, rad: hi ? 5 : 3, sij: 0.22 });
  trakoviK.visible = false;
  // beljakovine v celični membrani (zunaj) – na odprtem delu in na pokrovu klina
  const naRadij = (t) => { if (t.n.y * t.p.y + t.n.z * t.p.z < 0) t.n.negate(); return t; };
  const beljO = V.beljakovine(V.posej(pelikula, hi ? 700 : 220).map(naRadij), B.beljakovine, 0.003, { visina: 1.3 });
  const beljK = V.beljakovine(V.posej(pelPokrov, hi ? 240 : 70).map(naRadij), B.beljakovine, 0.003, { visina: 1.3 });
  beljK.visible = false;
  // plasti na ploskvah reza: trak med notranjo (A) in zunanjo (B) krivuljo, normala iz ploskve (debelina membrane je povečana)
  const trakMed = (A, B, plasti, pora) => { const m = Math.floor(A.length / 2); return trakPlasti(A, B, new THREE.Vector3().subVectors(A[m + 1], A[m - 1]).cross(new THREE.Vector3().subVectors(B[m], A[m])).normalize(), plasti, pora); };
  const memRezMat = matPlasti({ roughness: 0.42, clearcoat: 0.6 });
  memRezMat.userData.rez = true;
  const memRez = new THREE.Mesh(zdruziPlasti([0, Math.PI / 2].map((v) => trakMed(robT(D_MEM, v), robT(0, v), DVOSLOJ(B.dvosloj)))), memRezMat);
  // pod membrano zaporedje beljakovinskih trakov (na vzdolžnem prerezu kot členi, ki se prekrivajo)
  const pelRezG = zdruzi([pas(robT(D_MEM, 0), robT(D_PEL, 0)), pas(robT(D_MEM, Math.PI / 2), robT(D_PEL, Math.PI / 2))]);
  {
    const p = pelRezG.attributes.position, col = new Float32Array(p.count * 3), c = new THREE.Color(), sv = new THREE.Color("#5fd8b0"), tm = new THREE.Color("#1f6f62");
    for (let k = 0; k < p.count; k++) {
      const x = p.getX(k), y = p.getY(k), z = p.getZ(k), v = Math.atan2(z / 0.94, y / 1.02), r = Math.hypot(y, z);
      const s = 0.5 + 0.5 * Math.cos(N_TRAK * (v + x * 2.6) + r * 120);
      c.copy(tm).lerp(sv, gladko(0.3, 0.7, s));
      col[3 * k] = c.r; col[3 * k + 1] = c.g; col[3 * k + 2] = c.b;
    }
    pelRezG.setAttribute("color", new THREE.BufferAttribute(col, 3));
  }
  const pelRez = new THREE.Mesh(pelRezG, mat(0xffffff, { vertexColors: true, roughness: 0.4, clearcoat: 0.6, side: THREE.DoubleSide }));
  const citGeo = ploskev(P(D_PEL + 0.002), odprta(q(110), q(72)), true);
  pobarvaj(citGeo, (x, y, z, u, v, c) => { const t = 0.5 + 0.5 * sum(x * 70, y * 70, z * 70); c.setScalar(1 - 0.66 * gladko(0.45, 0.8, t) * 0.8); });
  // odtenek je v barvi materiala, barve oglišč le senčijo (tako stikalo učbeniških barv doseže tudi svetlo barvo)
  const citoplazma = new THREE.Mesh(citGeo, mat(0x4b3d9a, { vertexColors: true, roughness: 0.68, clearcoat: 0.15, sheen: 0.35, sheenColor: new THREE.Color(0x8d7ee0), side: THREE.BackSide }));

  // ---------- rezervoar (vbočen mehur na sprednjem koncu, iz katerega izrašča bič) ----------
  const rez = (d) => (u, v, out) => {
    // u = 0 ustje, u = 1 dno mehurja
    const x = X1 - 0.004 - u * 0.245;
    // ozek kanal, nato hruškast mehur; na dnu (u = 1) se zapre
    const r = (0.011 + 0.036 * gladko(0.28, 0.62, u)) * Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, u - 0.72) / 0.28, 2))) - d;
    return out.set(x, Math.max(0, r) * Math.cos(v) + 0.01, Math.max(0, r) * Math.sin(v));
  };
  const rezMat = mat(0x7fd3e6, { roughness: 0.4, clearcoat: 0.6, side: THREE.DoubleSide });
  const rezervoar = new THREE.Mesh(ploskev(rez(0), odprta(q(30), q(28)), false), rezMat);
  const rezPokrov = new THREE.Mesh(ploskev(rez(0), pokrov(q(30), q(28)), false), rezMat);
  rezPokrov.visible = false;
  tel.add(pelikula, pelPokrov, trakovi, trakoviK, beljO, beljK, memRez, pelRez, citoplazma, rezervoar, rezPokrov);

  // ---------- bič (z zadebelitvijo – svetlobnim čutilom); prosti del biča je dolg skoraj kot telo (≈ 47 µm) ----------
  // Dolgi bič izraste iz rezervoarja naprej, se zavije in med plavanjem leži nazaj ob zgornjem boku celice (≈ 44 µm);
  // val z naraščajočo amplitudo potuje proti konici. l: razdalja ob biču od bazalnega telesca.
  const BAZA = new THREE.Vector3(X1 - 0.17, 0.01, -0.005);
  const R_LOK = 0.1, L1 = 0.19, L2 = Math.PI * R_LOK, L3 = 0.62, L_BIC = L1 + L2 + L3;
  const DD = new THREE.Vector3(0, 0.75, -0.66).normalize(), WW = new THREE.Vector3(1, 0, 0).cross(DD);
  const _t = new THREE.Vector3();
  function bicTocka(s, t, out) {
    const l = s * L_BIC;
    if (l <= L1) out.set(BAZA.x + l, BAZA.y, BAZA.z);
    else if (l <= L1 + L2) { const f = (l - L1) / R_LOK; out.set(BAZA.x + L1 + R_LOK * Math.sin(f), BAZA.y, BAZA.z).addScaledVector(DD, R_LOK * (1 - Math.cos(f))); }
    else out.set(BAZA.x + L1 - (l - L1 - L2), BAZA.y, BAZA.z).addScaledVector(DD, 2 * R_LOK);
    const a = 0.045 * gladko(L1 + 0.04, L1 + L2 + 0.2, l), f = 2 * Math.PI * (l / 0.26) - t * 5.5;
    return out.addScaledVector(WW, a * Math.sin(f)).addScaledVector(DD, a * 0.3 * Math.cos(f));
  }
  let casBic = 0;
  const UP = new THREE.Vector3(0, 1, 0), _a = new THREE.Vector3(), _b = new THREE.Vector3(), _n = new THREE.Vector3(), _bb = new THREE.Vector3();
  const R_BIC = 0.0075;
  const Pbic = (s, psi, out) => {
    const ss = Math.min(1, Math.max(0, s));
    bicTocka(Math.min(1, ss + 0.004), casBic, _a); bicTocka(Math.max(0, ss - 0.004), casBic, _b);
    _t.subVectors(_a, _b).normalize();
    _n.crossVectors(UP, _t).normalize(); _bb.crossVectors(_t, _n);
    let r = R_BIC * (ss > 0.985 ? Math.sqrt(Math.max(0, 1 - Math.pow((ss - 0.985) / 0.015, 2))) : 1);
    bicTocka(ss, casBic, out);
    return out.addScaledVector(_n, r * Math.cos(psi)).addScaledVector(_bb, r * Math.sin(psi));
  };
  const bicMat = mat(B.bicek, { roughness: 0.4, clearcoat: 0.6, sheen: 0.45 });
  const bicGeo = ploskev(Pbic, [[0, 1, q(120), 0, TAU, q(8)]], true);
  const bic = new THREE.Mesh(bicGeo, bicMat);
  // mastigoneme: niz tankih dlačic ob eni strani prostega dela biča
  const N_DL = hi ? 170 : 64, Y1 = new THREE.Vector3(0, 1, 0), _d = new THREE.Vector3(), _q = new THREE.Quaternion(), _m4 = new THREE.Matrix4(), _p2 = new THREE.Vector3(), _ena = new THREE.Vector3(1, 1, 1);
  const dlake = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.0006, 0.0009, 0.024, 3, 1).translate(0, 0.012 + R_BIC * 0.8, 0), bicMat, N_DL);
  function postaviDlake() {
    for (let i = 0; i < N_DL; i++) {
      const s = (L1 + 0.03) / L_BIC + (0.97 - (L1 + 0.03) / L_BIC) * i / (N_DL - 1);
      bicTocka(Math.min(1, s + 0.004), casBic, _a); bicTocka(s - 0.004, casBic, _b);
      _t.subVectors(_a, _b).normalize();
      _n.crossVectors(UP, _t).normalize();
      _d.copy(_n).addScaledVector(_t, 0.45).normalize();
      _q.setFromUnitVectors(Y1, _d);
      _m4.compose(bicTocka(s, casBic, _p2), _q, _ena);
      dlake.setMatrixAt(i, _m4);
    }
    dlake.instanceMatrix.needsUpdate = true;
    dlake.computeBoundingSphere();
  }
  postaviDlake();
  // kratki bič ostane v rezervoarju in se prisloni k dolgemu ob svetlobnem čutilu; oba izraščata iz bazalnih telesc
  const cutiloP = bicTocka(0.075 / L_BIC, 0, new THREE.Vector3());
  const BAZA2 = BAZA.clone().add(new THREE.Vector3(-0.004, -0.014, 0.016));
  const kratki = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([BAZA2, BAZA2.clone().add(new THREE.Vector3(0.03, -0.004, 0.006)), cutiloP.clone().add(new THREE.Vector3(-0.012, -0.012, 0.004))]), q(24), 0.0058, q(8), false), bicMat);
  const btGeo = new THREE.CylinderGeometry(0.0075, 0.0075, 0.02, q(12), 1).rotateZ(Math.PI / 2);
  const bazalna = instance(btGeo, mat(B.centrosom, { roughness: 0.3, clearcoat: 0.8 }), [{ p: BAZA.clone().add(new THREE.Vector3(-0.012, 0, 0)) }, { p: BAZA2.clone().add(new THREE.Vector3(-0.01, 0, 0)), r: new THREE.Euler(0, 0, 0.5) }]);
  tel.add(bic, dlake, kratki, bazalna);
  // svetlobno čutilo: zadebelitev ob dnu biča v rezervoarju (tam bič miruje)
  const cutilo = new THREE.Mesh(new THREE.SphereGeometry(1, q(18), q(12)).scale(0.026, 0.016, 0.016), mat(0xe6ef5a, { roughness: 0.35, clearcoat: 0.7, sheen: 0.4, emissive: 0x2a3000 }));
  cutilo.position.copy(cutiloP);
  tel.add(cutilo);

  // ---------- očesna pega: skodelica rdečih kapljic karotenoidov ob rezervoarju (rdeča je prava barva) ----------
  const pegaGeo = [];
  const PEGA = new THREE.Vector3(X1 - 0.135, 0.046, -0.03);
  for (let i = 0; i < 30; i++) {
    const a = rnd() * TAU, r = Math.sqrt(rnd()) * 0.028;
    const g = new THREE.SphereGeometry(0.0065 + rnd() * 0.004, q(8), q(6));
    g.translate(PEGA.x + Math.cos(a) * r, PEGA.y + 0.006 * Math.sin(a * 2), PEGA.z + Math.sin(a) * r * 0.9);
    pegaGeo.push(g);
  }
  const pega = new THREE.Mesh(zdruzi(pegaGeo), mat(0xe0281a, { roughness: 0.3, clearcoat: 0.9, emissive: 0x4a0a00 }));
  tel.add(pega);

  // ---------- krčljivi mehurček ob rezervoarju (z drobnimi zbiralnimi mehurčki okoli) ----------
  const KM = new THREE.Vector3(X1 - 0.23, -0.035, -0.04);
  const kmMat = V.steklo(mat(B.vakuola), { a: 0.45, rf: 3, k: 0.3, rob: "#9ff0ff", rk: 1.3, difuzno: 0.6, iri: 0.3 });
  const krcljivi = new THREE.Mesh(new THREE.SphereGeometry(1, q(28), q(18)), kmMat);
  krcljivi.position.copy(KM);
  const satSez = [];
  for (let i = 0; satSez.length < 12 && i < 400; i++) {
    const d = new THREE.Vector3(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
    if (d.lengthSq() > 1 || d.lengthSq() < 0.05) continue;
    satSez.push({ p: KM.clone().addScaledVector(d.normalize(), 0.048 + rnd() * 0.012), s: 0.005 + rnd() * 0.006 });
  }
  const sateliti = instance(new THREE.SphereGeometry(1, q(12), q(8)), kmMat, satSez);
  tel.add(krcljivi, sateliti);
  const utrip = (t) => { const f = (t / 5) % 1; krcljivi.scale.setScalar(f < 0.85 ? 0.014 + 0.024 * gladko(0, 0.85, f) : 0.038 * (1 - (f - 0.85) / 0.15) + 0.008); };
  utrip(3);

  // ---------- jedro (prerezano) z velikim jedrcem in zgoščenimi kromosomi ----------
  const J = new THREE.Vector3(-0.3, -0.005, -0.012);
  const jP = (d) => (u, v, out) => {
    const a = Math.PI * u, s = Math.sin(a), k = 1 + 0.03 * sum(u * 8, Math.cos(v) * 2, Math.sin(v) * 2);
    return out.set(J.x - (0.11 - d) * Math.cos(a), J.y + (0.085 - d) * s * k * Math.cos(v), J.z + (0.08 - d) * s * k * Math.sin(v));
  };
  const jMat = mat(B.jedro, { roughness: 0.4, clearcoat: 0.55, sheen: 0.4, sheenColor: new THREE.Color(B.nukleoplazma) });
  const jedro = new THREE.Mesh(ploskev(jP(0), [[0, 1, q(48), Math.PI / 2, TAU, q(36)]], true), jMat);
  const jPokrov = new THREE.Mesh(ploskev(jP(0), [[0, 1, q(48), 0, Math.PI / 2, q(12)]], true), jMat);
  jPokrov.visible = false;
  const jInG = ploskev(jP(0.008), [[0, 1, q(40), Math.PI / 2, TAU, q(30)]], true);
  pobarvaj(jInG, (x, y, z, u, v, c) => { const t = 0.5 + 0.5 * sum(x * 110, y * 110, z * 110); c.set(B.nukleoplazma).lerp(new THREE.Color(B.jedro), gladko(0.45, 0.8, t) * 0.7); });
  const jIn = new THREE.Mesh(jInG, mat(0xffffff, { vertexColors: true, roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide }));
  const jKriv = (d, v) => { const a = []; for (let i = 0; i <= q(60); i++) a.push(jP(d)(i / q(60), v, new THREE.Vector3())); return a; };
  const jRobMat = matPlasti({ roughness: 0.5, clearcoat: 0.35 });
  jRobMat.userData.rez = true;
  const jRob = new THREE.Mesh(zdruziPlasti([0, Math.PI / 2].map((v) => trakMed(jKriv(0.008, v), jKriv(0, v), DVOJNA(B.ovojnica, B.nukleoplazma), porePrereza(7, 0xffd36b)))), jRobMat);
  // jedrne pore na površju ovojnice
  const pore = V.beljakovine(V.posej(jedro, hi ? 120 : 50).map((t) => { if (t.n.dot(t.p.clone().sub(J)) < 0) t.n.negate(); return t; }), B.nukleoplazma, 0.0045, { visina: 0.55, razp: 0.25 });
  const jedrce = new THREE.Mesh(preoblikuj(new THREE.SphereGeometry(0.036, q(22), q(16)), (v) => v.multiplyScalar(1 + 0.08 * fbm(v.x * 70, v.y * 70, v.z * 70))), mat(B.jedrce, { roughness: 0.55, clearcoat: 0.35 }));
  jedrce.position.copy(J).add(new THREE.Vector3(0.005, 0.0, 0.0));
  // pri evgleni so kromosomi zgoščeni tudi med delitvama: kratke debele niti v nukleoplazmi
  const kromK = [];
  for (let t = 0; kromK.length < (hi ? 44 : 22) && t < 4000; t++) {
    const a = new THREE.Vector3((rnd() * 2 - 1) * 0.085, (rnd() * 2 - 1) * 0.064, (rnd() * 2 - 1) * 0.06);
    if ((a.x / 0.085) ** 2 + (a.y / 0.064) ** 2 + (a.z / 0.06) ** 2 > 1 || a.length() < 0.048 || (a.y > -0.008 && a.z > -0.008)) continue;
    const tocke = [a.clone().add(J)], smer = new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize();
    for (let i = 0; i < 4; i++) { smer.add(new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(0.9)).normalize(); tocke.push(tocke[i].clone().addScaledVector(smer, 0.011)); }
    if (tocke.some((p) => { const b = p.clone().sub(J); return (b.x / 0.095) ** 2 + (b.y / 0.073) ** 2 + (b.z / 0.068) ** 2 > 1 || (b.y > -0.006 && b.z > -0.006); })) continue;
    kromK.push(new THREE.CatmullRomCurve3(tocke));
  }
  const kromosomi = V.vlakna(kromK, 0.0042, B.kromatin, { seg: hi ? 14 : 8, rad: hi ? 6 : 4, sij: 0.18 });
  tel.add(jedro, jPokrov, jIn, jRob, pore, jedrce, kromosomi);
  const vJedru = (p, rob = 0.02) => { const b = p.clone().sub(J); return (b.x / (0.11 + rob)) ** 2 + (b.y / (0.085 + rob)) ** 2 + (b.z / (0.08 + rob)) ** 2 < 1; };

  // ---------- kloroplasti (lečasti, ob površju, s tilakoidi in beljakovinskim središčem – pirenoidom) ----------
  const kloGeo = new THREE.SphereGeometry(1, q(22), q(14));
  {
    const p = kloGeo.attributes.position, col = [], c = new THREE.Color(), tl = new THREE.Color(B.tilakoid), sv = new THREE.Color(B.kloroplast), pi = new THREE.Color("#d8f0a8");
    for (let k = 0; k < p.count; k++) {
      const x = p.getX(k), y = p.getY(k), z = p.getZ(k);
      const pir = Math.exp(-(x * x + z * z) / 0.06) * (Math.abs(y) > 0.6 ? 1 : 0);
      const pr = 0.5 + 0.5 * Math.sin(x * 15 + 0.6 * Math.sin(z * 4));
      c.copy(sv).lerp(tl, gladko(0.45, 0.85, pr) * 0.7).lerp(pi, pir * 0.85); col.push(c.r, c.g, c.b);
    }
    kloGeo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    kloGeo.scale(0.034, 0.012, 0.075);
  }
  const kloSez = [];
  const vB = new THREE.Vector3(), vC = new THREE.Vector3(), M4 = new THREE.Matrix4();
  let pk = 0;
  while (kloSez.length < (hi ? 24 : 16) && pk++ < 4000) {
    const u = 0.12 + rnd() * 0.72, v = Math.PI / 2 + 0.25 + rnd() * (Math.PI * 1.5 - 0.5);
    const p = telo(u, v, 0.036, new THREE.Vector3());
    if (kloSez.some((k) => k.p.distanceTo(p) < 0.075) || p.distanceTo(J) < 0.12) continue;
    telo(u + 0.01, v, 0.036, vB); telo(u, v + 0.05, 0.036, vC);
    const tu = vB.sub(p).normalize(), tv = vC.sub(p).normalize(), n = new THREE.Vector3().crossVectors(tv, tu).normalize();
    const tvv = new THREE.Vector3().crossVectors(n, tu);
    M4.makeBasis(tvv, n, tu);
    // trakasti kloroplasti ležijo rahlo poševno, vzdolž spiralnih trakov
    kloSez.push({ p, r: new THREE.Quaternion().setFromRotationMatrix(M4).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.4 + rnd() * 0.3)), s: 0.9 + rnd() * 0.35 });
  }
  const kloroplasti = instance(kloGeo, mat(0xffffff, { vertexColors: true, roughness: 0.35, clearcoat: 0.7, clearcoatRoughness: 0.12, sheen: 0.45, sheenColor: new THREE.Color(0x9adf80) }), kloSez);
  tel.add(kloroplasti);

  // ---------- paramilonska zrnca (zaloga ogljikovih hidratov) ----------
  const parSez = [];
  pk = 0;
  while (parSez.length < (hi ? 26 : 18) && pk++ < 4000) {
    const u = 0.08 + rnd() * 0.78, v = Math.PI / 2 + 0.2 + rnd() * (Math.PI * 1.5 - 0.4), d = 0.04 + rnd() * 0.06;
    const p = telo(u, v, d, new THREE.Vector3());
    if (p.distanceTo(J) < 0.12 || parSez.some((x) => x.p.distanceTo(p) < 0.04) || kloSez.some((k) => k.p.distanceTo(p) < 0.04)) continue;
    parSez.push({ p, r: new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3), s: 0.7 + rnd() * 0.6 });
  }
  const paramilon = instance(preoblikuj(new THREE.CapsuleGeometry(0.009, 0.018, q(3), q(10)), (v) => { v.x += 6 * v.y * v.y; v.z *= 0.8; }), mat(B.skrob, { roughness: 0.28, clearcoat: 0.8, clearcoatRoughness: 0.1, sheen: 0.5 }), parSez);
  tel.add(paramilon);

  // ---------- naključna točka v citoplazmi odprtega dela (d: globina pod površjem) ----------
  const _p = new THREE.Vector3();
  function vCitoplazmi(dMin, dMaxDel, u0 = 0.04, u1 = 0.96) {
    const u = u0 + rnd() * (u1 - u0), v = Math.PI / 2 + 0.04 + rnd() * (Math.PI * 1.5 - 0.08);
    return telo(u, v, dMin + rnd() * Math.max(0.002, profil(u) * dMaxDel - dMin), _p);
  }
  const prosto = (p, r) => !vJedru(p, r) && !kloSez.some((k) => k.p.distanceTo(p) < 0.035 + r) && !parSez.some((k) => k.p.distanceTo(p) < 0.015 + r) && p.distanceTo(KM) > 0.05 + r;

  // ---------- mitohondriji (podolgovati, rahlo upognjeni; bolj rdečkasti, da se ločijo od zlatih ribosomov) ----------
  const MIT = "#e5672c";
  const mitSez = [];
  for (let t = 0; mitSez.length < (hi ? 46 : 24) && t < 8000; t++) {
    const p = vCitoplazmi(0.025, 0.75, 0.1, 0.86);
    if (!prosto(p, 0.012) || mitSez.some((m) => m.p.distanceTo(p) < 0.04) || p.x > X1 - 0.27) continue;
    mitSez.push({ p: p.clone(), r: new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3), s: 0.8 + rnd() * 0.45 });
  }
  const mitGeo = preoblikuj(new THREE.CapsuleGeometry(0.0062, 0.03, q(4), q(10)), (v) => { v.x += 9 * v.y * v.y; v.multiplyScalar(1 + 0.05 * sum(v.x * 300, v.y * 300, v.z * 300)); });
  const mitohondriji = instance(mitGeo, mat(MIT, { roughness: 0.3, clearcoat: 0.85 }), mitSez);
  tel.add(mitohondriji);

  // ---------- Golgijev aparat: kupčki ukrivljenih cistern (diktiosomi) ----------
  const cist = [];
  for (let i = 0; i < 5; i++) {
    const r = 0.022 * (1 - Math.abs(i - 2) * 0.1);
    const g = new THREE.SphereGeometry(r, q(18), q(6));
    preoblikuj(g, (v) => { v.y = v.y * 0.16 + 14 * (v.x * v.x + v.z * v.z); });
    g.translate(0, i * 0.0058, 0);
    cist.push(g);
  }
  const golGeo = V.zdruzi(cist);
  const golSez = [];
  for (let t = 0; golSez.length < (hi ? 8 : 5) && t < 8000; t++) {
    const p = vCitoplazmi(0.04, 0.7, 0.3, 0.75);
    if (!prosto(p, 0.025) || golSez.some((m) => m.p.distanceTo(p) < 0.07) || mitSez.some((m) => m.p.distanceTo(p) < 0.03)) continue;
    golSez.push({ p: p.clone(), r: new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3), s: 0.85 + rnd() * 0.3 });
  }
  const golgi = instance(golGeo, mat(B.golgi, { roughness: 0.3, clearcoat: 0.85 }), golSez);
  tel.add(golgi);

  // ---------- ribosomi (zlata zrnca) in drobna temna zrnca citoplazme ----------
  const ribSez = [];
  for (let t = 0; ribSez.length < (hi ? 2200 : 600) && t < 40000; t++) {
    const p = vCitoplazmi(D_PEL + 0.004, 0.92);
    if (vJedru(p, 0.006) || kloSez.some((k) => k.p.distanceTo(p) < 0.03)) continue;
    ribSez.push({ p: p.clone(), r: new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3), s: 0.75 + rnd() * 0.5 });
  }
  const ribosomi = instance(new THREE.IcosahedronGeometry(0.002, 0), mat(B.ribosomi, { roughness: 0.3, clearcoat: 0.7, emissive: new THREE.Color(B.ribosomi).multiplyScalar(0.12) }), ribSez);
  tel.add(ribosomi);
  const prahT = [];
  for (let t = 0; prahT.length < (hi ? 3200 : 1200) && t < 30000; t++) {
    const p = vCitoplazmi(D_PEL + 0.004, 0.95);
    if (!vJedru(p, 0)) prahT.push(p.clone());
  }
  tel.add(V.pike(prahT, 0x6a58c0, 0.0042, 0.5));

  // ---------- deli ----------
  const T = (u, v, d) => telo(u, v, d, new THREE.Vector3()).toArray();
  del("pelikula", "Pelikula", "Prožna ovojnica: celična membrana z beljakovinami, pod njo spiralno zviti beljakovinski trakovi (zeleni členi na prerezu). Debelina je povečana; evglena lahko z njo spreminja obliko.", "#9ee8c8",
    [pelikula, pelPokrov, trakovi, trakoviK, beljO, beljK, pelRez, memRez], T(0.42, 2.3, 0));
  del("bic", "Bič", "Dolgi bič z nizom tankih dlačic valovito vleče celico naprej; drugi, kratki bič ostane v rezervoarju. Oba izraščata iz bazalnih telesc.", B.bicek,
    [bic, dlake, kratki, bazalna], bicTocka(0.5, 0, new THREE.Vector3()).toArray());
  del("svetlobno-cutilo", "Svetlobno čutilo", "Zadebelitev ob dnu biča, ki zazna svetlobo; očesna pega jo z ene strani zasenči, zato evglena zazna smer svetlobe.", "#e6ef5a",
    [cutilo], cutiloP.clone().add(new THREE.Vector3(0, 0.012, 0.01)).toArray());
  del("ocesna-pega", "Očesna pega", "Rdeča pega iz kapljic barvila (karotenoidov); senči svetlobno čutilo, da evglena plava proti svetlobi.", "#e8402e",
    [pega], [PEGA.x, PEGA.y + 0.01, PEGA.z + 0.01]);
  del("rezervoar", "Rezervoar", "Vdolbina na sprednjem koncu, iz katere izrašča bič; vanjo krčljivi mehurček izprazni odvečno vodo.", "#7fd3e6",
    [rezervoar, rezPokrov], rez(0)(0.55, Math.PI * 1.2, new THREE.Vector3()).toArray());
  del("krcljivi-mehurcek", "Krčljivi mehurček", "Zbira odvečno vodo, ki z osmozo vdira v celico (pomagajo mu drobni mehurčki okoli), in jo izprazni v rezervoar.", B.vakuola, [krcljivi, sateliti], [KM.x, KM.y + 0.03, KM.z]);
  del("kloroplasti", "Kloroplasti", "Zeleni organeli s tilakoidi (temnejše proge), v katerih evglena na svetlobi s fotosintezo izdeluje hrano; svetlejše središče je pirenoid.", B.kloroplast,
    [kloroplasti], kloSez.reduce((b, k) => (k.p.z < b.z ? k.p : b), kloSez[0].p).toArray());
  del("jedro", "Jedro", "Veliko jedro z DNK in dvojno ovojnico s porami v sredini celice; upravlja njeno delovanje in delitev.", B.jedro, [jedro, jPokrov, jRob, pore], jP(0)(0.3, 3.6, new THREE.Vector3()).toArray());
  del("kromatin", "Kromosomi", "Pri evgleni so kromosomi v jedru ves čas zgoščeni, zato jih vidimo kot kratke debele niti z DNK.", B.kromatin,
    [kromosomi], kromK[0].getPoint(0.5).toArray());
  del("jedrce", "Jedrce", "Veliko gosto telo v sredini jedra, kjer nastajajo deli ribosomov.", B.jedrce, [jedrce, jIn], [jedrce.position.x - 0.01, jedrce.position.y + 0.03, jedrce.position.z + 0.02]);
  del("mitohondriji", "Mitohondriji", "Pridobivajo energijo s celičnim dihanjem; v temi, ko evglena ne more fotosintetizirati, so njen glavni vir energije.", MIT,
    [mitohondriji], (mitSez.find((m) => m.p.z < -0.05) || mitSez[0]).p.toArray());
  del("golgi", "Golgijev aparat", "Kupčki sploščenih cistern, ki dodelajo beljakovine in jih zapakirajo v mešičke; evglena jih ima več.", B.golgi,
    [golgi], golSez[0].p.toArray());
  del("ribosomi", "Ribosomi", "Drobna zrnca po vsej citoplazmi, na katerih nastajajo beljakovine. Narisana so povečana.", B.ribosomi,
    [ribosomi], ribSez[Math.round(ribSez.length / 2)].p.toArray());
  del("paramilon", "Paramilonska zrnca", "Bela zrnca paramilona, ogljikovega hidrata, ki ga evglena shrani kot zalogo hrane (podoben škrobu).", B.skrob,
    [paramilon], parSez.reduce((b, k) => (k.p.y < b.y ? k.p : b), parSez[0].p).toArray());
  del("citoplazma", "Citoplazma", "Želatinasta notranjost celice, v kateri ležijo organeli.", "#4b3d9a", [citoplazma], T(0.25, 2.4, D_PEL + 0.003));

  deli.forEach((d) => { d.tocka = new THREE.Vector3(...d.tocka).applyMatrix4(tel.matrix).toArray().map((x) => Math.round(x * 1000) / 1000); });

  // ---------- nadzor ----------
  let cela = false;
  const nadzor = [
    {
      tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cela", "Cela celica"]], vrednost: "prerez",
      ob: (v) => {
        cela = v === "cela";
        pelPokrov.visible = rezPokrov.visible = jPokrov.visible = trakoviK.visible = beljK.visible = cela;
        for (const m of [memRez, pelRez, jRob]) m.visible = !cela;
        if (!gib) group.rotation.x = 0;
      },
    },
  ];
  if (ctx.zacetek && ctx.zacetek.prikaz) { nadzor[0].vrednost = ctx.zacetek.prikaz; nadzor[0].ob(ctx.zacetek.prikaz); }

  V.poliraj(group, deli, {
    pelikula: { tex: "fino", rf: 300, k: 0.4 },
    bic: { tex: null },
    "svetlobno-cutilo": { rf: 160, k: 0.6 },
    "ocesna-pega": { tex: null },
    rezervoar: { tex: "fino", rf: 160, k: 0.8, b: 0.2 },
    "krcljivi-mehurcek": { tex: null },
    kloroplasti: { tex: "vlakna", rf: 60, k: 0.8 },
    jedro: { tex: "gube", rf: 40, k: 1.2, b: 0.22 },
    kromatin: { tex: null },
    jedrce: { tex: "fino", rf: 120, k: 1, b: 0.22 },
    mitohondriji: { tex: "gube", rf: 160, k: 0.7 },
    golgi: { tex: "fino", rf: 120, k: 0.8 },
    ribosomi: { tex: null },
    paramilon: { tex: null },
    citoplazma: { tex: "fino", rf: 60, k: 1.1, b: 0.24, lisa: 0.2, f: 8 },
  });
  // stikalo »Barve kot v učbeniku« (po poliranju, da shrani končne barve)
  nadzor.push(V.barveUcbenika(deli, { pelikula: "#8cc06a", bic: "#c9a46a", "svetlobno-cutilo": "#f5e663", "ocesna-pega": "#e0301e", rezervoar: "#bfe3f0",
    "krcljivi-mehurcek": "#7ccdf0", paramilon: "#f2ecd6" }));

  return {
    group,
    oder: "celica",
    pogled: [-0.39, 0.62, 0.68], // smer kamere: yaw −30°, pitch 38° – bolj od zgoraj, da se vidi v notranjost podolgovate celice
    deli,
    nadzor,
    korak(t) {
      if (!gib) return;
      casBic = t;
      bicGeo.userData.osvezi(Pbic);
      postaviDlake();
      utrip(t);
      // med plavanjem se evglena vrti okoli dolge osi; v prerezu se le rahlo ziba, da rez ostane obrnjen proti gledalcu
      group.rotation.x = cela ? t * 0.5 : 0.28 * Math.sin(t * 0.5);
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
