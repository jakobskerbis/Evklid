// Evglena (Euglena gracilis): vretenast bičkar s kloroplasti in očesno pego; odrezan klin vzdolž celice pokaže notranjost.
// Pogodba graditelja: docs/3d.md. Brez uvozov; THREE pride od kompleta.

export const info = {
  id: "celica-evglena",
  naslov: "Evglena",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Enocelični bičkar iz mlakuž, dolg okoli 50 µm. Na svetlobi dela fotosintezo kot rastlina, v temi pa vsrkava hrano iz vode. Plava z bičem in se pri tem vrti okoli dolge osi.",
  merilo: { m: 70e-6, oznaka: "70 µm" },
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
  const gladko = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
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
      const p = g.attributes.position, n = g.attributes.normal, gc = g.attributes.color;
      const c = barve && barve[i] != null ? new THREE.Color(barve[i]) : null;
      for (let k = 0; k < p.count; k++) {
        pos.push(p.getX(k), p.getY(k), p.getZ(k));
        nor.push(n.getX(k), n.getY(k), n.getZ(k));
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
  // Odstrani trikotnike, katerih središče izpolni pogoj f(Vector3) (npr. odprtina, kjer se ploskvi stikata).
  function izrezi(g, f) {
    const p = g.attributes.position, ix = g.index.array, ost = [], c = new THREE.Vector3(), t = new THREE.Vector3();
    for (let i = 0; i < ix.length; i += 3) {
      c.set(0, 0, 0);
      for (let k = 0; k < 3; k++) c.add(t.fromBufferAttribute(p, ix[i + k]));
      if (!f(c.multiplyScalar(1 / 3))) ost.push(ix[i], ix[i + 1], ix[i + 2]);
    }
    g.setIndex(ost);
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
  // vse gradimo v »tel« (povečano 1,14-krat, 1 enota scene ≈ 35 µm)
  const tel = new THREE.Group();
  tel.scale.setScalar(1.14);
  tel.position.x = 0.09;
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

  const pelGeo = ploskev(P(0), odprta(q(150), q(112)), true), pelPGeo = ploskev(P(0), pokrov(q(150), q(112)), true);
  for (const g of [pelGeo, pelPGeo]) pobarvaj(g, (x, y, z, u, v, c) => {
    const s = 0.5 + 0.5 * Math.cos(N_TRAK * (v + x * 2.6));
    c.set(0x9cc48a).lerp(new THREE.Color(0x6e9e64), (1 - s) * 0.55);
  });
  const pelMat = mat(0xffffff, { vertexColors: true, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.2, sheen: 0.7, sheenColor: new THREE.Color(0xeaffdc) });
  const pelikula = new THREE.Mesh(pelGeo, pelMat);
  const pelPokrov = new THREE.Mesh(pelPGeo, pelMat);
  pelPokrov.visible = false;
  // plasti na ploskvah reza: trak med notranjo (A) in zunanjo (B) krivuljo, normala iz ploskve (debelina membrane je povečana)
  const trakMed = (A, B, plasti, pora) => { const m = Math.floor(A.length / 2); return trakPlasti(A, B, new THREE.Vector3().subVectors(A[m + 1], A[m - 1]).cross(new THREE.Vector3().subVectors(B[m], A[m])).normalize(), plasti, pora); };
  const memRez = new THREE.Mesh(zdruziPlasti([0, Math.PI / 2].map((v) => trakMed(robT(D_MEM, v), robT(0, v), DVOSLOJ(0xd88aa2)))), matPlasti({ roughness: 0.35, clearcoat: 0.9 }));
  const pelRez = new THREE.Mesh(zdruzi([pas(robT(D_MEM, 0), robT(D_PEL, 0)), pas(robT(D_MEM, Math.PI / 2), robT(D_PEL, Math.PI / 2))]),
    mat(0x86ad78, { roughness: 0.4, clearcoat: 0.8, side: THREE.DoubleSide }));
  const citGeo = ploskev(P(D_PEL + 0.002), odprta(q(110), q(72)), true);
  pobarvaj(citGeo, (x, y, z, u, v, c) => { const t = 0.5 + 0.5 * sum(x * 70, y * 70, z * 70); c.set(0xe6ecc8).lerp(new THREE.Color(0xc2cc9e), gladko(0.5, 0.8, t) * 0.7); });
  const citoplazma = new THREE.Mesh(citGeo, mat(0xffffff, { vertexColors: true, roughness: 0.7, clearcoat: 0.15, sheen: 0.3, side: THREE.BackSide }));

  // ---------- rezervoar (vbočen mehur na sprednjem koncu, iz katerega izrašča bič) ----------
  const rez = (d) => (u, v, out) => {
    // u = 0 ustje, u = 1 dno mehurja
    const x = X1 - 0.004 - u * 0.245;
    // ozek kanal, nato hruškast mehur; na dnu (u = 1) se zapre
    const r = (0.011 + 0.036 * gladko(0.28, 0.62, u)) * Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, u - 0.72) / 0.28, 2))) - d;
    return out.set(x, Math.max(0, r) * Math.cos(v) + 0.01, Math.max(0, r) * Math.sin(v));
  };
  const rezMat = mat(0xcfe6c4, { roughness: 0.35, clearcoat: 0.8, side: THREE.DoubleSide });
  const rezervoar = new THREE.Mesh(ploskev(rez(0), odprta(q(30), q(28)), false), rezMat);
  const rezPokrov = new THREE.Mesh(ploskev(rez(0), pokrov(q(30), q(28)), false), rezMat);
  rezPokrov.visible = false;
  tel.add(pelikula, pelPokrov, memRez, pelRez, citoplazma, rezervoar, rezPokrov);

  // ---------- bič (z zadebelitvijo – svetlobnim čutilom) ----------
  const L_BIC = 0.82, BAZA = new THREE.Vector3(X1 - 0.17, 0.01, -0.005);
  const _t = new THREE.Vector3();
  function bicTocka(s, t, out) {
    // s ∈ [0, 1]: v rezervoarju naravnost, zunaj valovanje z naraščajočo amplitudo (val potuje proti konici)
    const x = BAZA.x + s * L_BIC * 0.78;
    const zun = gladko(0.2, 0.45, s);
    const a = 0.12 * zun * Math.min(1, s * 1.3), f = 2 * Math.PI * (s * 2.1) - t * 5.5;
    const upogib = -0.16 * zun * s * s; // bič je usmerjen nekoliko nazaj in navzdol
    return out.set(x, BAZA.y + a * Math.sin(f) + upogib * 0.4, BAZA.z + a * 0.55 * Math.cos(f) - upogib * 0.25);
  }
  let casBic = 0;
  const UP = new THREE.Vector3(0, 1, 0), _a = new THREE.Vector3(), _b = new THREE.Vector3(), _n = new THREE.Vector3(), _bb = new THREE.Vector3();
  const Pbic = (s, psi, out) => {
    const ss = Math.min(1, Math.max(0, s));
    bicTocka(Math.min(1, ss + 0.004), casBic, _a); bicTocka(Math.max(0, ss - 0.004), casBic, _b);
    _t.subVectors(_a, _b).normalize();
    _n.crossVectors(UP, _t).normalize(); _bb.crossVectors(_t, _n);
    let r = 0.0075 * (ss > 0.985 ? Math.sqrt(Math.max(0, 1 - Math.pow((ss - 0.985) / 0.015, 2))) : 1);
    bicTocka(ss, casBic, out);
    return out.addScaledVector(_n, r * Math.cos(psi)).addScaledVector(_bb, r * Math.sin(psi));
  };
  const bicGeo = ploskev(Pbic, [[0, 1, q(120), 0, TAU, q(8)]], true);
  const bic = new THREE.Mesh(bicGeo, mat(0xb9e08a, { roughness: 0.35, clearcoat: 0.8 }));
  tel.add(bic);
  // svetlobno čutilo: zadebelitev ob dnu biča v rezervoarju (tam bič miruje)
  const cutiloP = bicTocka(0.1, 0, new THREE.Vector3());
  const cutilo = new THREE.Mesh(new THREE.SphereGeometry(1, q(18), q(12)).scale(0.026, 0.016, 0.016), mat(0xe8f070, { roughness: 0.3, clearcoat: 0.9 }));
  cutilo.position.copy(cutiloP);
  tel.add(cutilo);

  // ---------- očesna pega: skodelica rdečih kapljic ob rezervoarju ----------
  const pegaGeo = [];
  const PEGA = new THREE.Vector3(X1 - 0.135, 0.046, -0.03);
  for (let i = 0; i < 26; i++) {
    const a = rnd() * TAU, r = Math.sqrt(rnd()) * 0.028;
    const g = new THREE.SphereGeometry(0.0065 + rnd() * 0.004, q(8), q(6));
    g.translate(PEGA.x + Math.cos(a) * r, PEGA.y + 0.006 * Math.sin(a * 2), PEGA.z + Math.sin(a) * r * 0.9);
    pegaGeo.push(g);
  }
  const pega = new THREE.Mesh(zdruzi(pegaGeo), mat(0xe8402e, { roughness: 0.3, clearcoat: 1, emissive: 0x3a0800 }));
  tel.add(pega);

  // ---------- krčljivi mehurček ob rezervoarju ----------
  const KM = new THREE.Vector3(X1 - 0.23, -0.035, -0.04);
  const krcljivi = new THREE.Mesh(new THREE.SphereGeometry(1, q(24), q(16)), mat(0xbfeaff, { roughness: 0.05, clearcoat: 1, transparent: true, opacity: 0.8, sheen: 0.6 }));
  krcljivi.position.copy(KM);
  tel.add(krcljivi);
  const utrip = (t) => { const f = (t / 5) % 1; krcljivi.scale.setScalar(f < 0.85 ? 0.014 + 0.024 * gladko(0, 0.85, f) : 0.038 * (1 - (f - 0.85) / 0.15) + 0.008); };
  utrip(3);

  // ---------- jedro (prerezano) z velikim jedrcem ----------
  const J = new THREE.Vector3(-0.3, -0.005, -0.012);
  const jP = (d) => (u, v, out) => {
    const a = Math.PI * u, s = Math.sin(a), k = 1 + 0.03 * sum(u * 8, Math.cos(v) * 2, Math.sin(v) * 2);
    return out.set(J.x - (0.11 - d) * Math.cos(a), J.y + (0.085 - d) * s * k * Math.cos(v), J.z + (0.08 - d) * s * k * Math.sin(v));
  };
  const jMat = mat(0x7a68d8, { roughness: 0.34 });
  const jedro = new THREE.Mesh(ploskev(jP(0), [[0, 1, q(48), Math.PI / 2, TAU, q(36)]], true), jMat);
  const jPokrov = new THREE.Mesh(ploskev(jP(0), [[0, 1, q(48), 0, Math.PI / 2, q(12)]], true), jMat);
  jPokrov.visible = false;
  const jInG = ploskev(jP(0.008), [[0, 1, q(40), Math.PI / 2, TAU, q(30)]], true);
  pobarvaj(jInG, (x, y, z, u, v, c) => { const t = 0.5 + 0.5 * sum(x * 110, y * 110, z * 110); c.set(0xb9a8ff).lerp(new THREE.Color(0x5a48b8), gladko(0.55, 0.78, t)); });
  const jIn = new THREE.Mesh(jInG, mat(0xffffff, { vertexColors: true, roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide }));
  const jRobT = (v) => { const a = []; for (let i = 0; i <= 36; i++) a.push(jP(0.002)(i / 36, v, new THREE.Vector3())); return a; };
  const jKriv = (d, v) => { const a = []; for (let i = 0; i <= q(60); i++) a.push(jP(d)(i / q(60), v, new THREE.Vector3())); return a; };
  const jRob = new THREE.Mesh(zdruziPlasti([0, Math.PI / 2].map((v) => trakMed(jKriv(0.008, v), jKriv(0, v), DVOJNA(0x5a48c0, 0xcfc4f7), porePrereza(7, 0xb9a8ff)))), matPlasti({ roughness: 0.5 }));
  const jedrce = new THREE.Mesh(preoblikuj(new THREE.SphereGeometry(0.036, q(22), q(16)), (v) => v.multiplyScalar(1 + 0.08 * fbm(v.x * 70, v.y * 70, v.z * 70))), mat(0x34268a, { roughness: 0.6, clearcoat: 0.3 }));
  jedrce.position.copy(J).add(new THREE.Vector3(0.005, 0.0, 0.0));
  tel.add(jedro, jPokrov, jIn, jRob, jedrce);

  // ---------- kloroplasti (lečasti, ob površju, z beljakovinskim središčem – pirenoidom) ----------
  const kloGeo = new THREE.SphereGeometry(1, q(18), q(12));
  {
    const p = kloGeo.attributes.position, col = [], c = new THREE.Color();
    for (let k = 0; k < p.count; k++) {
      const x = p.getX(k), y = p.getY(k), z = p.getZ(k);
      const pir = Math.exp(-(x * x + z * z) / 0.08) * (Math.abs(y) > 0.6 ? 1 : 0);
      const pr = 0.5 + 0.5 * Math.sin(z * 14);
      c.set(0x4fae46).lerp(new THREE.Color(0x2f7f34), pr * 0.35).lerp(new THREE.Color(0xd8f0b0), pir * 0.8); col.push(c.r, c.g, c.b);
    }
    kloGeo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    kloGeo.scale(0.034, 0.012, 0.075);
  }
  const kloSez = [];
  const vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3(), M4 = new THREE.Matrix4();
  let pk = 0;
  while (kloSez.length < (hi ? 22 : 16) && pk++ < 4000) {
    const u = 0.12 + rnd() * 0.72, v = Math.PI / 2 + 0.25 + rnd() * (Math.PI * 1.5 - 0.5);
    const p = telo(u, v, 0.036, new THREE.Vector3());
    if (kloSez.some((k) => k.p.distanceTo(p) < 0.075) || p.distanceTo(J) < 0.12) continue;
    telo(u + 0.01, v, 0.036, vB); telo(u, v + 0.05, 0.036, vC);
    const tu = vB.sub(p).normalize(), tv = vC.sub(p).normalize(), n = new THREE.Vector3().crossVectors(tv, tu).normalize();
    const tvv = new THREE.Vector3().crossVectors(n, tu);
    M4.makeBasis(tvv, n, tu);
    // trakasti kloroplasti ležijo rahlo poševno, vzdolž spiralnih trakov
    kloSez.push({ p, r: new THREE.Quaternion().setFromRotationMatrix(M4).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.4 + rnd() * 0.3)), s: 0.8 + rnd() * 0.35 });
  }
  const kloroplasti = instance(kloGeo, mat(0xffffff, { vertexColors: true, roughness: 0.35, clearcoat: 0.9, sheen: 0.4 }), kloSez);
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
  const paramilon = instance(new THREE.CapsuleGeometry(0.009, 0.018, q(3), q(10)), mat(0xece4c8, { roughness: 0.25, clearcoat: 0.8, sheen: 0.5 }), parSez);
  tel.add(paramilon);

  // ---------- deli ----------
  const T = (u, v, d) => telo(u, v, d, new THREE.Vector3()).toArray();
  del("pelikula", "Pelikula", "Prožna ovojnica iz spiralno zvitih beljakovinskih trakov pod celično membrano (rožnati dvosloj na prerezu, debelina je povečana); evglena lahko z njo spreminja obliko.", "#9cc48a",
    [pelikula, pelPokrov, pelRez, memRez], T(0.42, 2.3, 0));
  del("bic", "Bič", "Dolg nitast izrastek, ki z valovanjem vleče celico naprej; izrašča iz rezervoarja na sprednjem koncu.", "#b9e08a",
    [bic], bicTocka(0.35, 0, new THREE.Vector3()).toArray());
  del("svetlobno-cutilo", "Svetlobno čutilo", "Zadebelitev ob dnu biča, ki zazna svetlobo; očesna pega jo z ene strani zasenči, zato evglena zazna smer svetlobe.", "#e8f070",
    [cutilo], cutiloP.clone().add(new THREE.Vector3(0, 0.012, 0.01)).toArray());
  del("ocesna-pega", "Očesna pega", "Rdeča pega iz kapljic barvila (karotenoidov); senči svetlobno čutilo, da evglena plava proti svetlobi.", "#e8402e",
    [pega], [PEGA.x, PEGA.y + 0.01, PEGA.z + 0.01]);
  del("rezervoar", "Rezervoar", "Vdolbina na sprednjem koncu, iz katere izrašča bič; vanjo krčljivi mehurček izprazni odvečno vodo.", "#cfe6c4",
    [rezervoar, rezPokrov], rez(0)(0.55, Math.PI * 1.2, new THREE.Vector3()).toArray());
  del("krcljivi-mehurcek", "Krčljivi mehurček", "Zbira odvečno vodo, ki z osmozo vdira v celico, in jo izprazni v rezervoar.", "#bfeaff", [krcljivi], [KM.x, KM.y + 0.03, KM.z]);
  del("kloroplasti", "Kloroplasti", "Zeleni organeli, v katerih evglena na svetlobi s fotosintezo izdeluje hrano; svetlejše središče je pirenoid.", "#4fae46",
    [kloroplasti], kloSez.reduce((b, k) => (k.p.z < b.z ? k.p : b), kloSez[0].p).toArray());
  del("jedro", "Jedro", "Veliko jedro z DNK in dvojno ovojnico s porami v sredini celice; upravlja njeno delovanje in delitev.", "#7a68d8", [jedro, jPokrov, jRob], jP(0)(0.3, 3.6, new THREE.Vector3()).toArray());
  del("jedrce", "Jedrce", "Veliko gosto telo v sredini jedra, kjer nastajajo deli ribosomov.", "#34268a", [jedrce, jIn], [jedrce.position.x - 0.01, jedrce.position.y + 0.03, jedrce.position.z + 0.02]);
  del("paramilon", "Paramilonska zrnca", "Bela zrnca paramilona, ogljikovega hidrata, ki ga evglena shrani kot zalogo hrane (podoben škrobu).", "#f6f2e2",
    [paramilon], parSez.reduce((b, k) => (k.p.y < b.y ? k.p : b), parSez[0].p).toArray());
  del("citoplazma", "Citoplazma", "Želatinasta notranjost celice, v kateri ležijo organeli.", "#e6ecc8", [citoplazma], T(0.25, 2.4, D_PEL + 0.003));

  deli.forEach((d) => { d.tocka = new THREE.Vector3(...d.tocka).applyMatrix4(tel.matrix).toArray().map((x) => Math.round(x * 1000) / 1000); });

  // ---------- nadzor ----------
  let cela = false;
  const nadzor = [
    {
      tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cela", "Cela celica"]], vrednost: "prerez",
      ob: (v) => {
        cela = v === "cela";
        pelPokrov.visible = rezPokrov.visible = jPokrov.visible = cela;
        for (const m of [memRez, pelRez, jRob]) m.visible = !cela;
        if (!gib) group.rotation.x = 0;
      },
    },
  ];
  if (ctx.zacetek && ctx.zacetek.prikaz) { nadzor[0].vrednost = ctx.zacetek.prikaz; nadzor[0].ob(ctx.zacetek.prikaz); }

  return {
    group,
    deli,
    nadzor,
    korak(t) {
      if (!gib) return;
      casBic = t;
      bicGeo.userData.osvezi(Pbic);
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
