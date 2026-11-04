// Kvasovka (Saccharomyces cerevisiae) v prerezu: matična celica z brstom; drsnik »Brstenje« vodi rast brsta in delitev jedra.
// Pogodba graditelja: docs/3d.md. Brez uvozov; THREE pride od kompleta.

export const info = {
  id: "celica-kvasovka",
  naslov: "Kvasovka",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Pivska kvasovka (Saccharomyces cerevisiae), enocelična gliva velikosti okoli 5 µm. Razmnožuje se z brstenjem: iz matične celice zraste brst, v katerega preide eno od obeh novih jeder. Organelov je manj kot v resnici.",
  merilo: { m: 10e-6, oznaka: "10 µm" },
};

export function zgradi(THREE, ctx = {}) {
  let seme = 41;
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const gib = ctx.gibanje !== false;
  const zac = ctx.zacetek || {};
  const group = new THREE.Group();
  let deli = [];
  const odpad = [];

  // ---------- orodja ----------
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
  const nakl = (s = 1) => V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(s);
  const gladko = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  function mat(barva, o = {}) {
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: barva, roughness: 0.4, clearcoat: 0.8, clearcoatRoughness: 0.3,
      sheen: 0.5, sheenColor: new THREE.Color(0xffffff), sheenRoughness: 0.5,
    }, o));
    odpad.push(m);
    return m;
  }
  // Združi geometrije (z index ali brez) v eno; po želji pobarva vsako z barvo oglišč
  // (barva null = obdrži barve oglišč te geometrije).
  function zdruzi(geos, barve) {
    const pos = [], nor = [], col = [], idx = [];
    let off = 0;
    geos.forEach((g, i) => {
      const p = g.attributes.position, n = g.attributes.normal, ca = g.attributes.color;
      const c = barve && barve[i] != null ? new THREE.Color(barve[i]) : null;
      for (let k = 0; k < p.count; k++) {
        pos.push(p.getX(k), p.getY(k), p.getZ(k));
        nor.push(n.getX(k), n.getY(k), n.getZ(k));
        if (barve) { if (c) col.push(c.r, c.g, c.b); else if (ca) col.push(ca.getX(k), ca.getY(k), ca.getZ(k)); else col.push(1, 1, 1); }
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
  // Premakne oglišča: fn(v) spremeni vektor v; nato nove normale.
  function deformiraj(g, fn) {
    const p = g.attributes.position, v = V();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); fn(v, i); p.setXYZ(i, v.x, v.y, v.z); }
    g.computeVertexNormals();
    return g;
  }
  // Barve oglišč iz funkcije fn(v) → THREE.Color.
  function pobarvaj(g, fn) {
    const p = g.attributes.position, v = V(), c = [];
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const b = fn(v); c.push(b.r, b.g, b.b); }
    g.setAttribute("color", new THREE.Float32BufferAttribute(c, 3));
    return g;
  }
  function del(id, ime, opis, barva, meshes, tocka) {
    meshes.forEach((m) => { m.userData.del = id; });
    deli.push({ id, ime, opis, barva, meshes, tocka: tocka.map((x) => Math.round(x * 1000) / 1000) });
  }
  // Odrezan osmi del: x < 0, y > 0, z > 0 (proti gledalcu levo zgoraj).
  const vIzrezu = (v, c = { x: 0, y: 0, z: 0 }) => v.x < c.x && v.y > c.y && v.z > c.z;
  // Trak (ploskev prereza) iz parov točk [zunanja, notranja] z dano normalo.
  function trak(pari, nrm) {
    const pos = [], nor = [], idx = [];
    pari.forEach(([a, b], i) => {
      pos.push(a.x, a.y, a.z, b.x, b.y, b.z); nor.push(nrm.x, nrm.y, nrm.z, nrm.x, nrm.y, nrm.z);
      if (i) { const k = 2 * i; idx.push(k - 2, k - 1, k, k - 1, k + 1, k); }
    });
    // ovijanje trikotnikov naj se ujema z normalo (sicer DoubleSide obrne osvetlitev)
    let sx = 0, sy = 0, sz = 0;
    for (let i = 0; i < idx.length; i += 3) {
      const a = idx[i] * 3, b = idx[i + 1] * 3, c = idx[i + 2] * 3;
      const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2];
      const vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
      sx += uy * vz - uz * vy; sy += uz * vx - ux * vz; sz += ux * vy - uy * vx;
    }
    if (sx * nrm.x + sy * nrm.y + sz * nrm.z < 0) for (let i = 0; i < idx.length; i += 3) { const t = idx[i]; idx[i] = idx[i + 2]; idx[i + 2] = t; }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    g.setIndex(idx);
    return g;
  }
  // Smer proti privzeti kameri (za izbiro vidnih točk).
  const KAM = V(-0.47, 0.34, 0.81).normalize();
  // Ali je točka p vidna skozi izrez? ovira(x) = true, če točka x zakriva pogled.
  function vidna(p, ovira, korak = 0.02) {
    const x = p.clone();
    for (let i = 0; i < 120; i++) {
      x.addScaledVector(KAM, korak);
      if (x.x < 0 && x.y > 0 && x.z > 0) return true;
      if (ovira(x)) return false;
    }
    return true;
  }
  // Oglišče mreže (v koordinatah skupine), ki je najbolj obrnjeno proti kameri; za točke delov.
  function najblizja(mesh, pogoj = () => true) {
    mesh.updateMatrix();
    const p = mesh.geometry.attributes.position, v = V(), m = mesh.matrix.clone();
    if (mesh.parent && mesh.parent !== group) { mesh.parent.updateMatrix(); m.premultiply(mesh.parent.matrix); }
    let best = null, bd = -1e9;
    for (let i = 0; i < p.count; i += 3) {
      v.fromBufferAttribute(p, i).applyMatrix4(m);
      const d = v.dot(KAM);
      if (d > bd && pogoj(v)) { bd = d; best = v.clone(); }
    }
    return (best || V()).toArray();
  }
  // Loki na meji odrezanega osmega dela (smeri, t = 0 … 1) in normale ravnin prereza.
  const LOKI = [
    [(t) => V(0, Math.cos(t * Math.PI / 2), Math.sin(t * Math.PI / 2)), V(-1, 0, 0)],
    [(t) => V(-Math.sin(t * Math.PI / 2), Math.cos(t * Math.PI / 2), 0), V(0, 0, 1)],
    [(t) => V(-Math.cos(t * Math.PI / 2), 0, Math.sin(t * Math.PI / 2)), V(0, 1, 0)],
  ];
  // Lupina z odrezanim osmim delom; f(smer) vrne polmer v tej smeri.
  function lupina(f, ws, hs) {
    const w4 = Math.max(2, Math.round(ws / 4)), h2 = Math.max(2, Math.round(hs / 2)); // enak razmik oglišč na šivih
    const zg = new THREE.SphereGeometry(1, w4 * 3, h2, Math.PI / 2, Math.PI * 1.5, 0, Math.PI / 2);
    const sp = new THREE.SphereGeometry(1, w4 * 4, h2, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const pokr = new THREE.SphereGeometry(1, w4, h2, 0, Math.PI / 2, 0, Math.PI / 2);
    for (const g of [zg, sp, pokr]) deformiraj(g, (v) => { v.normalize(); v.multiplyScalar(f(v)); });
    return { odprta: zgladi(zdruzi([zg, sp])), pokrov: pokr };
  }
  // Povpreči normale oglišč na istem mestu (šivi med deli mreže).
  function zgladi(g) {
    const p = g.attributes.position, n = g.attributes.normal, m = new Map();
    const kljuc = (i) => Math.round(p.getX(i) * 1e4) + "," + Math.round(p.getY(i) * 1e4) + "," + Math.round(p.getZ(i) * 1e4);
    for (let i = 0; i < p.count; i++) { const k = kljuc(i); const s = m.get(k); if (s) { s[0] += n.getX(i); s[1] += n.getY(i); s[2] += n.getZ(i); } else m.set(k, [n.getX(i), n.getY(i), n.getZ(i)]); }
    for (let i = 0; i < p.count; i++) { const s = m.get(kljuc(i)), l = Math.hypot(s[0], s[1], s[2]) || 1; n.setXYZ(i, s[0] / l, s[1] / l, s[2] / l); }
    return g;
  }
  // Rob prereza: cev po treh lokih.
  function rob(f, debelina, seg) {
    return zdruzi(LOKI.map(([L]) => {
      const pts = [];
      for (let i = 0; i <= seg; i++) { const d = L(i / seg).normalize(); pts.push(d.multiplyScalar(f(d) * 0.995)); }
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, debelina, q(8), false);
    }));
  }
  // Ploskev prereza debele plasti med fZ (zunaj) in fN (znotraj).
  function rezR(fZ, fN, seg) {
    return zdruzi(LOKI.map(([L, n]) => {
      const pari = [];
      for (let i = 0; i <= seg; i++) { const d = L(i / seg).normalize(); pari.push([d.clone().multiplyScalar(fZ(d)), d.clone().multiplyScalar(fN(d))]); }
      return trak(pari, n);
    }));
  }
  // Vrtenina okoli osi x. Profil [[x, r], …] od -x proti +x; normale v ravnini (x, r).
  function profil(pts) {
    const n = pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      const tx = b[0] - a[0], tr = b[1] - a[1], l = Math.hypot(tx, tr) || 1;
      return [-tr / l, tx / l];
    });
    return { p: pts, n };
  }
  function vrtTocka(P, i, th, zamik, sumF, out) {
    const [x, r] = P.p[i], [nx, nr] = P.n[i];
    const c = Math.cos(th), s = Math.sin(th);
    const d = (sumF ? sumF(x, r * c, r * s) : 0) - zamik;
    const rr = Math.max(0, r + d * nr);
    return out.set(x + d * nx, rr * c, rr * s);
  }
  // Vrne { g, posodobi(P), rez(bool) }; izrez: i < rezI in kot 0 … 90° (y > 0, z > 0).
  function vrtenina(P, nK, rezI, zamik = 0, sumF = null) {
    const nP = P.p.length;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(nP * (nK + 1) * 3), 3));
    const cela = [], izrez = [];
    for (let i = 0; i < nP - 1; i++) for (let j = 0; j < nK; j++) {
      const a = i * (nK + 1) + j, b = a + nK + 1;
      const t = [a, a + 1, b, b, a + 1, b + 1];
      cela.push(...t);
      if (!(i < rezI && j < nK / 4)) izrez.push(...t);
    }
    let zdaj = izrez;
    const v = V();
    const posodobi = (P2, z2 = zamik) => {
      zamik = z2;
      const p = g.attributes.position;
      for (let i = 0; i < nP; i++) for (let j = 0; j <= nK; j++) {
        vrtTocka(P2, i, (j / nK) * Math.PI * 2, zamik, sumF, v);
        p.setXYZ(i * (nK + 1) + j, v.x, v.y, v.z);
      }
      p.needsUpdate = true;
      g.setIndex(cela); g.computeVertexNormals(); g.setIndex(zdaj);
      g.computeBoundingSphere();
    };
    posodobi(P);
    return { g, posodobi, rez: (da) => { zdaj = da ? izrez : cela; g.setIndex(zdaj); } };
  }
  // Točke na meji izreza vrtenine (zaprta zanka: rob y>0 → lok → rob z>0).
  function vrtMeja(P, nK, rezI, zamik, sumF) {
    const pts = [];
    const dodaj = (i, th) => { const p = vrtTocka(P, i, th, zamik, sumF, V()); if (!pts.length || pts[pts.length - 1].distanceTo(p) > 1e-4) pts.push(p); };
    for (let i = 0; i <= rezI; i++) dodaj(i, 0);
    for (let j = 1; j <= nK / 4; j++) dodaj(rezI, (j / nK) * Math.PI * 2);
    for (let i = rezI - 1; i > 0; i--) dodaj(i, Math.PI / 2);
    return pts;
  }
  // Ploskve prereza med plastema vrtenine (zamika zA < zB).
  function vrtRez(P, nK, rezI, zA, zB, sumF) {
    const t = (i, th) => [vrtTocka(P, i, th, zA, sumF, V()), vrtTocka(P, i, th, zB, sumF, V())];
    const a = [], b = [], c = [];
    for (let i = 0; i <= rezI; i++) { a.push(t(i, 0)); c.push(t(i, Math.PI / 2)); }
    for (let j = 0; j <= nK / 4; j++) b.push(t(rezI, (j / nK) * Math.PI * 2));
    return zdruzi([trak(a, V(0, 0, 1)), trak(b, V(-1, 0, 0)), trak(c, V(0, 1, 0))]);
  }
  const o = new THREE.Object3D(), smer = V();

  // ---------- oblika (1 µm = 0,2 enote) ----------
  const M = V(-0.3, 0, 0), AXm = 0.5, Rm = 0.42;  // matična celica 5 × 4,2 µm
  const ABb = 0.34, RBb = 0.3, RNK = 0.1;          // zrel brst 3,4 × 3 µm, vrat ≈ 1 µm
  const ZS = 0.03, ZM = 0.038, ZC = 0.041;         // stena ≈ 150 nm, membrana, citoplazma
  const n1 = hi ? 24 : 14, n2 = hi ? 24 : 14, nK = hi ? 88 : 48;
  const sumF = (x, y, z) => 0.006 * fbm(x * 6 + 3, y * 6, z * 6);
  const vratX = (rn) => M.x + AXm * Math.sqrt(1 - (rn / Rm) ** 2);
  function profMati(rn) {
    const ft = Math.asin(Math.min(0.99, rn / Rm)), pts = [];
    for (let i = 0; i <= n1; i++) { const f = Math.PI - (i / n1) * Math.PI / 2; pts.push([M.x + AXm * Math.cos(f), Rm * Math.sin(f)]); }
    for (let i = 1; i <= n2; i++) { const f = Math.PI / 2 - (i / n2) * (Math.PI / 2 - ft); pts.push([M.x + AXm * Math.cos(f), Rm * Math.sin(f)]); }
    return profil(pts);
  }
  function profBrst(s, rn) {
    const a = ABb * s, r = RBb * s, pt = Math.PI - Math.asin(Math.min(0.99, rn / r));
    const Bx = vratX(rn) - a * Math.cos(pt), pts = [];
    for (let i = 0; i <= n1; i++) { const f = pt - (i / n1) * (pt - Math.PI / 2); pts.push([Bx + a * Math.cos(f), r * Math.sin(f)]); }
    for (let i = 1; i <= n2; i++) { const f = Math.PI / 2 - (i / n2) * (Math.PI / 2); pts.push([Bx + a * Math.cos(f), r * Math.sin(f)]); }
    return { P: profil(pts), Bx };
  }
  const izrezM = (p, m = 0) => p.x < M.x + m && p.y > -m && p.z > -m;
  const vMati = (p, m = 0) => ((p.x - M.x) / (AXm - m)) ** 2 + (p.y / (Rm - m)) ** 2 + (p.z / (Rm - m)) ** 2 < 1;

  // ---------- matična celica: stena, membrana, citoplazma ----------
  const P0 = profMati(0);
  const stc = new THREE.Color(), st1 = new THREE.Color(0xd9be86), st2 = new THREE.Color(0xa88654);
  const barvaSt = (v) => stc.copy(st1).lerp(st2, 0.5 + 0.5 * fbm(v.x * 14, v.y * 14, v.z * 14));
  const stenaMat = mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.55, sheen: 0.5 });
  const rezMat = mat(0xffffff, { vertexColors: true, roughness: 0.7, clearcoat: 0.2, side: THREE.DoubleSide });
  const memMat = mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide });
  // prerez po plasteh: stena (zunaj manoproteini, znotraj glukani s hitinom) in membrana (lipidni dvosloj)
  const plasti = (PP, meje, barve) => zdruzi(meje.slice(0, -1).map((a, i) => vrtRez(PP, nK, n1, a, meje[i + 1], sumF)), barve);
  const stenaRez = (PP, k = 1) => plasti(PP, [0, 0.01 * k, ZS * k], [0x9a7646, 0xe7cf9c]);
  const memRez = (PP, k = 1) => plasti(PP, [ZS * k, (ZS + 0.0022) * k, (ZM - 0.0022) * k, ZM * k], [0xb4587c, 0xf4d9c4, 0xb4587c]);
  const citMat = mat(0xeee2c6, { roughness: 0.7, clearcoat: 0.15, sheen: 0.3, side: THREE.BackSide });
  const mS = vrtenina(P0, nK, n1, 0, sumF);
  pobarvaj(mS.g, barvaSt);
  const mStena = new THREE.Mesh(mS.g, stenaMat);
  const mRez = new THREE.Mesh(stenaRez(P0), rezMat);
  const mMem = new THREE.Mesh(memRez(P0), memMat);
  const mC = vrtenina(P0, nK, n1, ZC, sumF);
  const mCit = new THREE.Mesh(mC.g, citMat);
  group.add(mStena, mRez, mMem, mCit);

  // ---------- brst: stena, membrana, citoplazma (oblika se spreminja z drsnikom) ----------
  const B1 = profBrst(1, RNK);
  const bStenaMat = mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.55, sheen: 0.5 });
  const bS = vrtenina(B1.P, nK, n1, 0, sumF);
  pobarvaj(bS.g, (v) => barvaSt(v).lerp(new THREE.Color(0xeedcae), 0.35)); // mlada stena je svetlejša
  const bStena = new THREE.Mesh(bS.g, bStenaMat);
  const bRez = new THREE.Mesh(new THREE.BufferGeometry(), rezMat);
  const bMem = new THREE.Mesh(new THREE.BufferGeometry(), memMat);
  const bC = vrtenina(B1.P, nK, n1, ZC, sumF);
  const bCit = new THREE.Mesh(bC.g, citMat);
  const vrat = new THREE.Mesh(new THREE.TorusGeometry(RNK, 0.011, q(8), q(40)).rotateY(Math.PI / 2), mat(0xc9a66c, { roughness: 0.45, clearcoat: 0.5 }));
  group.add(bStena, bRez, bMem, bCit, vrat);

  // ---------- brazgotine po prejšnjih brstih ----------
  const brz = [[2.3, 1.85], [2.75, 2.85], [1.25, 2.35]];
  const brzM = new THREE.InstancedMesh(new THREE.TorusGeometry(0.075, 0.013, q(8), q(30)).scale(1, 1, 0.5), mat(0xb59262, { roughness: 0.5, clearcoat: 0.4 }), brz.length);
  const brzT = [];
  brz.forEach(([u, v], i) => {
    const p = V(M.x + AXm * Math.cos(u), Rm * Math.sin(u) * Math.cos(v), Rm * Math.sin(u) * Math.sin(v));
    const n = V(Math.cos(u) / AXm, Math.sin(u) * Math.cos(v) / Rm, Math.sin(u) * Math.sin(v) / Rm).normalize();
    o.position.copy(p).addScaledVector(n, 0.002); o.quaternion.setFromUnitVectors(V(0, 0, 1), n); o.scale.setScalar(1); o.updateMatrix();
    brzM.setMatrixAt(i, o.matrix); brzT.push(p.addScaledVector(n, 0.012));
  });
  group.add(brzM);

  // ---------- vakuola (vrtenina na osi, prerezana kot celica) ----------
  const VCx = -0.47, RV = 0.19, nv = hi ? 20 : 12;
  const vp = [];
  for (let i = 0; i <= nv; i++) { const f = Math.PI - (i / nv) * Math.PI; vp.push([VCx + RV * Math.cos(f), RV * Math.sin(f)]); }
  let viR = 0; vp.forEach((p, i) => { if (p[0] <= M.x) viR = i; });
  vp[viR][0] = M.x;
  const PV = profil(vp), vSum = (x, y, z) => 0.012 * fbm(x * 7 + 8, y * 7, z * 7);
  const vakMat = mat(0x7fd3e3, { roughness: 0.22, clearcoat: 1, sheen: 0.4 });
  const vakOut = new THREE.Mesh(vrtenina(PV, nK, viR, 0, vSum).g, vakMat);
  const vakIn = new THREE.Mesh(vrtenina(PV, nK, viR, 0.006, vSum).g, mat(0xb5e6ee, { roughness: 0.55, clearcoat: 0.3, sheen: 0.3, side: THREE.BackSide }));
  const vakRob = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(vrtMeja(PV, nK, viR, 0.003, vSum), true), q(80), 0.0045, q(6), true), vakMat);
  const zrP = [];
  for (let posk = 0; zrP.length < 7 && posk < 5000; posk++) { const p = V(VCx, 0, 0).add(nakl(0.3)); if (Math.hypot(p.x - VCx, p.y, p.z) < RV - 0.05 && !izrezM(p, 0.02)) zrP.push(p); }
  const zrna = new THREE.InstancedMesh(new THREE.SphereGeometry(0.016, q(12), q(8)), mat(0x3f7f9a, { roughness: 0.5, clearcoat: 0.4 }), zrP.length);
  zrP.forEach((p, i) => { o.position.copy(p); o.rotation.set(0, 0, 0); o.scale.setScalar(0.7 + rnd() * 0.6); o.updateMatrix(); zrna.setMatrixAt(i, o.matrix); });
  group.add(vakOut, vakIn, vakRob, zrna);

  // ---------- jedro (dve mreži: materino in hčerinsko) in most med njima ----------
  const N0 = V(-0.12, 0.03, -0.03), RJ = 0.14;
  const jGeo = deformiraj(new THREE.SphereGeometry(1, q(44), q(30)), (v) => v.multiplyScalar(1 + 0.035 * fbm(v.x * 3 + 4, v.y * 3, v.z * 3)));
  const jMat = mat(0x7a68d8, { roughness: 0.34, clearcoat: 0.9 });
  const jM = new THREE.Mesh(jGeo, jMat), jH = new THREE.Mesh(jGeo, jMat);
  const most = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, q(20), 1, true), jMat);
  group.add(jM, jH, most);
  const jc = new THREE.Mesh(deformiraj(new THREE.SphereGeometry(1, q(20), q(14), 0, Math.PI * 2, 0, Math.PI * 0.42), (v) => v.multiplyScalar(1.012)), mat(0x34268a, { roughness: 0.5, clearcoat: 0.5, side: THREE.DoubleSide }));
  jM.add(jc); // jedrce kot polmesec ob ovojnici (kot pri kvasovkah)
  jc.quaternion.setFromUnitVectors(V(0, 1, 0), V(-0.2, 0.75, 0.6).normalize());

  // ---------- mitohondriji: razvejana mreža cevk ob površini ----------
  function cevi(n, kos, notri, polmer, korakD) {
    const gs = [];
    let posk = 0;
    while (gs.length < n && posk++ < 500) {
      let p = kos();
      if (!notri(p)) continue;
      const pts = [p.clone()];
      let d = nakl(1).normalize();
      for (let s = 0; s < 9; s++) {
        d.add(nakl(0.9)).normalize();
        const q2 = p.clone().addScaledVector(d, korakD);
        if (!notri(q2)) break;
        pts.push(q2); p = q2;
      }
      if (pts.length < 4) continue;
      gs.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), pts.length * 6, polmer, q(7), false));
    }
    return gs;
  }
  const naSkorji = (p) => { const e = ((p.x - M.x) / AXm) ** 2 + (p.y / Rm) ** 2 + (p.z / Rm) ** 2; return e > 0.5 && e < 0.7 && !izrezM(p, 0.03) && p.x < 0.08; };
  const mitMat = mat(0xe8743b, { roughness: 0.36, clearcoat: 0.8 });
  const mit = new THREE.Mesh(zdruzi(cevi(hi ? 10 : 7, () => M.clone().add(nakl(1.0)), naSkorji, 0.03, 0.065)), mitMat);
  group.add(mit);

  // ---------- endoplazemski retikulum: ploščice tik pod membrano ----------
  const erG = new THREE.SphereGeometry(1, q(84), q(52));
  {
    const p = erG.attributes.position, v = V(), keep = [];
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); p.setXYZ(i, M.x + v.x * (AXm - 0.05), v.y * (Rm - 0.05), v.z * (Rm - 0.05)); }
    const ix = erG.index.array, c = V();
    for (let t = 0; t < ix.length; t += 3) {
      c.set(0, 0, 0); for (let j = 0; j < 3; j++) c.add(v.fromBufferAttribute(p, ix[t + j]));
      c.multiplyScalar(1 / 3);
      if (fbm(c.x * 7 + 1, c.y * 7, c.z * 7) > 0.12 && !izrezM(c, 0.01) && c.x < vratX(RNK) - 0.1) keep.push(ix[t], ix[t + 1], ix[t + 2]);
    }
    erG.setIndex(keep);
    erG.computeVertexNormals();
  }
  const er = new THREE.Mesh(erG, mat(0x5b8fe0, { roughness: 0.45, side: THREE.DoubleSide }));
  group.add(er);

  // ---------- lipidne kapljice in ribosomi (matična celica) ----------
  const prosto = (p, m) => vMati(p, ZC + m) && !izrezM(p, 0.02) && Math.hypot(p.x - VCx, p.y, p.z) > RV + m && p.distanceTo(N0) > RJ + m && !(p.x > N0.x && Math.hypot(p.y, p.z) < RJ + m) && p.x < vratX(RNK) - 0.04;
  const kos = () => M.clone().add(V((rnd() - 0.5) * 2 * AXm, (rnd() - 0.5) * 2 * Rm, (rnd() - 0.5) * 2 * Rm));
  const lipMat = mat(0xf3d36b, { roughness: 0.15, clearcoat: 1, sheen: 0.3 });
  const lipP = [];
  const predJedrom = (p) => { const r = p.clone().sub(N0); const t = r.dot(KAM); return t > 0 && r.addScaledVector(KAM, -t).length() < RJ + 0.05; };
  for (let posk = 0; lipP.length < (hi ? 8 : 6) && posk < 20000; posk++) { const p = kos(); if (prosto(p, 0.05) && !predJedrom(p) && !lipP.some((x) => x.distanceTo(p) < 0.1)) lipP.push(p); }
  const lip = new THREE.InstancedMesh(new THREE.SphereGeometry(0.036, q(16), q(12)), lipMat, lipP.length);
  lipP.forEach((p, i) => { o.position.copy(p); o.rotation.set(0, 0, 0); o.scale.setScalar(0.75 + rnd() * 0.5); o.updateMatrix(); lip.setMatrixAt(i, o.matrix); });
  group.add(lip);
  const ribMat = mat(0x2b3f8f, { roughness: 0.6, clearcoat: 0.2 });
  const ribGeo = new THREE.IcosahedronGeometry(0.0055, 0);
  const nRib = hi ? 900 : 450;
  const rib = new THREE.InstancedMesh(ribGeo, ribMat, nRib);
  let k = 0;
  for (let posk = 0; k < nRib && posk < 400000; posk++) { const p = kos(); if (!prosto(p, 0.006) || lipP.some((x) => x.distanceTo(p) < 0.045)) continue; o.position.copy(p); o.updateMatrix(); rib.setMatrixAt(k++, o.matrix); }
  rib.count = k;
  group.add(rib);

  // ---------- vsebina brsta (v lokalnih koordinatah zrelega brsta, merilo s) ----------
  const brstG = new THREE.Group();
  group.add(brstG);
  const vBrstu = (p, m) => ((p.x) / (ABb - m)) ** 2 + (p.y / (RBb - m)) ** 2 + (p.z / (RBb - m)) ** 2 < 1 && !(p.x < 0 && p.y > -0.02 && p.z > -0.02);
  const bMit = new THREE.Mesh(zdruzi(cevi(hi ? 3 : 2, () => nakl(0.5), (p) => { const e = (p.x / ABb) ** 2 + (p.y / RBb) ** 2 + (p.z / RBb) ** 2; return e > 0.45 && e < 0.72 && !(p.x < 0.02 && p.y > -0.04 && p.z > -0.04); }, 0.024, 0.05)), mitMat);
  const bVak = new THREE.Mesh(deformiraj(new THREE.SphereGeometry(0.075, q(24), q(16)), (v) => v.multiplyScalar(1 + 0.08 * fbm(v.x * 30, v.y * 30, v.z * 30))), vakMat);
  bVak.position.set(0.1, -0.1, -0.08);
  const bLipP = [V(0.12, 0.09, -0.12), V(-0.02, -0.17, -0.06)];
  const bLip = new THREE.InstancedMesh(new THREE.SphereGeometry(0.03, q(14), q(10)), lipMat, bLipP.length);
  bLipP.forEach((p, i) => { o.position.copy(p); o.updateMatrix(); bLip.setMatrixAt(i, o.matrix); });
  const bnRib = hi ? 260 : 130;
  const bRib = new THREE.InstancedMesh(ribGeo, ribMat, bnRib);
  k = 0;
  for (let posk = 0; k < bnRib && posk < 100000; posk++) {
    const p = nakl(0.7);
    if (!vBrstu(p, ZC + 0.008) || p.distanceTo(bVak.position) < 0.085 || Math.hypot(p.x + 0.03, p.y, p.z) < RJ * 0.9) continue;
    o.position.copy(p); o.updateMatrix(); bRib.setMatrixAt(k++, o.matrix);
  }
  bRib.count = k;
  brstG.add(bMit, bVak, bLip, bRib);

  // ---------- deli ----------
  del("celicna-stena", "Celična stena", "Čvrsta plast iz glukanov in nekaj hitina, na zunanji strani pa iz manoproteinov (v prerezu temnejši pas); celico ščiti in ji daje obliko. Debelina je povečana.", "#c9a66c", [mStena, mRez, bRez, vrat],
    vrtTocka(P0, n1 + 6, Math.PI * 0.62, 0, sumF, V()).toArray());
  del("membrana", "Celična membrana", "Dvosloj fosfolipidov tik pod steno, ki uravnava prehod snovi v celico in iz nje; tanjši je od stene. Debelina je povečana.", "#d88aa2", [mMem, bMem], vrtTocka(P0, Math.round(n1 * 0.55), 0.03, (ZS + ZM) / 2, sumF, V()).toArray());
  del("citoplazma", "Citoplazma", "Tekočina v celici z ribosomi in organeli; v njej poteka tudi alkoholno vrenje, pri katerem iz sladkorja nastaneta alkohol in ogljikov dioksid.", "#eee2c6", [mCit, bCit],
    vrtTocka(P0, Math.round(n1 * 0.6), Math.PI * 1.3, ZC + 0.003, sumF, V()).toArray());
  const brstDel = { id: "brst", ime: "Brst (hčerinska celica)", opis: "Izboklina, ki zraste iz matične celice; ko je dovolj velika in dobi svoje jedro, se odcepi kot nova kvasovka.", barva: "#eedcae", meshes: [bStena], tocka: [0, 0, 0] };
  bStena.userData.del = "brst";
  deli.push(brstDel);
  del("brazgotine", "Brazgotine po brstenju", "Obročki iz hitina na steni matične celice: vsak ostane po enem odcepljenem brstu, zato po njih preštejemo, kolikokrat je celica brstela.", "#b59262", [brzM], brzT[0].toArray());
  const jedroDel = { id: "jedro", ime: "Jedro", opis: "Hrani DNK. Pri brstenju se podaljša skozi vrat brsta in razdeli; eno jedro ostane v matični celici, drugo preide v brst.", barva: "#7a68d8", meshes: [jM, jH, most], tocka: [0, 0, 0] };
  for (const m of jedroDel.meshes) m.userData.del = "jedro";
  deli.push(jedroDel);
  const jcDel = { id: "jedrce", ime: "Jedrce", opis: "Območje ob robu jedra, kjer nastajajo deli ribosomov; pri kvasovkah ima obliko polmeseca.", barva: "#34268a", meshes: [jc], tocka: [0, 0, 0] };
  jc.userData.del = "jedrce";
  deli.push(jcDel);
  del("vakuola", "Vakuola", "Velik mehur s celičnim sokom, ki shranjuje snovi in razgrajuje odslužene beljakovine; del vakuole preide tudi v brst.", "#7fd3e3", [vakOut, vakIn, vakRob, zrna, bVak],
    vrtTocka(PV, Math.round(viR * 0.6), Math.PI * 1.25, 0.008, vSum, V()).toArray());
  del("mitohondriji", "Mitohondriji", "Razvejane cevke ob površini celice; ob dovolj kisika pridobivajo energijo s celičnim dihanjem. Del mreže preide v brst.", "#e8743b", [mit, bMit],
    najblizja(mit, (v) => v.z < 0.05));
  del("er", "Endoplazemski retikulum", "Ploščice in cevke tik pod membrano in ob jedru, v katerih nastajajo beljakovine in maščobe.", "#5b8fe0", [er], najblizja(er, (v) => v.z < -0.05 && v.y > 0.05));
  del("lipidne-kapljice", "Lipidne kapljice", "Kapljice maščob, ki so celici zaloga energije in gradiva za membrane.", "#f3d36b", [lip, bLip], (lipP.find((p) => vidna(p.clone().sub(M), (x) => !vMati(x.clone().add(M), ZC))) || lipP[0]).toArray());
  del("ribosomi", "Ribosomi", "Drobna zrnca, ki sestavljajo beljakovine.", "#2b3f8f", [rib, bRib], [M.x - 0.12, -0.05, -0.3]);

  // ---------- brstenje ----------
  const smerX = V(1, 0, 0), tmp = V(), Bc = V();
  let b = 0;
  const vsiDeli = deli.slice();
  function nastavi(v) {
    b = Math.min(1, Math.max(0, +v || 0));
    const s = gladko(0.03, 0.85, b), ima = s > 0.015;
    const rn = ima ? Math.min(RNK, 0.85 * RBb * Math.max(s, 0.02)) : 0;
    const xt = vratX(rn);
    const Pm = profMati(rn);
    mS.posodobi(Pm); mC.posodobi(Pm);
    bStena.visible = bRez.visible = bMem.visible = bCit.visible = vrat.visible = brstG.visible = ima;
    if (ima) {
      const B = profBrst(Math.max(s, 0.02), rn);
      const zs = Math.min(1, s * 2.5);
      bS.posodobi(B.P, 0); bC.posodobi(B.P, ZC * zs);
      bRez.geometry.dispose(); bRez.geometry = stenaRez(B.P, zs);
      bMem.geometry.dispose(); bMem.geometry = memRez(B.P, zs);
      vrat.position.set(xt, 0, 0); vrat.scale.setScalar(rn / RNK);
      Bc.set(B.Bx, 0, 0);
      brstG.position.copy(Bc); brstG.scale.setScalar(Math.max(s, 0.02));
      brstDel.tocka = [Bc.x + ABb * s * 0.35, RBb * s * 0.55, RBb * s * 0.75 - 0.02].map((x) => Math.round(x * 1000) / 1000);
    }
    // jedro: v pozni fazi se podaljša skozi vrat in razdeli
    const t = gladko(0.55, 0.97, b);
    const rj = RJ * (1 - 0.2 * t);
    const cilj = Bc.clone().add(V(-0.03, 0, 0));
    const vratP = V(xt, 0, 0);
    // kvadratna Bézierjeva pot: N0 → vrat → središče brsta
    const pot = (u) => N0.clone().multiplyScalar((1 - u) ** 2).add(vratP.clone().multiplyScalar(2 * u * (1 - u))).add(cilj.clone().multiplyScalar(u * u));
    const pD = t > 0 ? pot(t) : N0.clone(), pM = N0.clone().add(V(-0.05 * t, 0, 0));
    jM.position.copy(pM); jM.scale.setScalar(rj);
    const doVrata = Math.abs(pD.x - xt);
    const stis = t > 0 ? Math.min(1, Math.max((RNK - 0.012) / rj, doVrata / rj)) : 1;
    jH.visible = t > 0.02;
    jH.position.copy(pD); jH.scale.set(rj / stis, rj * stis, rj * stis);
    const dl = pM.distanceTo(pD);
    most.visible = t > 0.02 && t < 0.985;
    if (most.visible) {
      const rm = rj * (0.78 - 0.68 * gladko(0.15, 0.95, t));
      most.position.copy(pM).add(pD).multiplyScalar(0.5);
      most.quaternion.setFromUnitVectors(V(0, 1, 0), tmp.copy(pD).sub(pM).normalize());
      most.scale.set(rm, dl, rm);
    }
    jedroDel.tocka = pM.clone().add(V(-0.06, rj * 0.75, rj * 0.55)).toArray().map((x) => Math.round(x * 1000) / 1000);
    group.updateMatrixWorld(true);
    jcDel.tocka = group.worldToLocal(jc.localToWorld(V(0, 1, 0))).toArray().map((x) => Math.round(x * 1000) / 1000);
    deli = vsiDeli.filter((d) => d !== brstDel || ima);
  }
  const faza = () => (b < 0.03 ? "Celica še ne brsti" : b < 0.55 ? "Brst raste" : b < 0.97 ? "Jedro potuje v brst in se deli" : "Brst ima svoje jedro; kmalu se odcepi");
  const nadzor = [
    { tip: "drsnik", id: "brstenje", oznaka: "Brstenje", min: 0, max: 1, korak: 0.01, vrednost: 0.5, ob: nastavi },
    { tip: "izpis", id: "faza", oznaka: "Faza", vrednost: faza },
  ];
  if (zac.brstenje != null && isFinite(+zac.brstenje)) nadzor[0].vrednost = Math.min(1, Math.max(0, +zac.brstenje));
  nastavi(nadzor[0].vrednost);

  // rahle razlike v svetlosti med ponovljenimi deli (organeli in beljakovine niso vsi povsem enaki)
  {
    const c = new THREE.Color();
    group.traverse((m) => {
      if (!m.isInstancedMesh || m.instanceColor) return;
      for (let i = 0; i < m.instanceMatrix.count; i++) { const k = 0.88 + 0.2 * hash(i * 1.37, m.instanceMatrix.count * 0.11, 7); m.setColorAt(i, c.setRGB(k, k, k)); }
    });
  }

  return {
    group,
    get deli() { return deli; },
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
