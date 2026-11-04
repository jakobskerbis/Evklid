// Virus HIV v prerezu: ovojnica z bodicami gp120/gp41, matriksni protein p17, stožčasta kapsida p24 z dvema RNK in encimi.
// Pogodba graditelja: docs/3d.md. Brez uvozov; THREE pride od kompleta.

export const info = {
  id: "virus-hiv",
  naslov: "Virus HIV",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Virus človeške imunske pomanjkljivosti (premer okoli 110 nm), ki povzroča aids. Izrezan klin pokaže stožčasto kapsido z dvema molekulama RNK in encimi; model ima 10 bodic, toliko kot pravi virusi (ti jih imajo od okoli 7 do 14).",
  merilo: { m: 150e-9, oznaka: "150 nm" },
};

export function zgradi(THREE, ctx = {}) {
  let seme = 79;
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

  // 1 enota = 75 nm
  const gor = V(0, 1, 0);
  const RE = 0.74; // ovojnica: premer ≈ 111 nm
  const oblE = (d) => RE * (1 + 0.02 * fbm(d.x * 1.7 + 4, d.y * 1.7, d.z * 1.7) + 0.005 * sum(d.x * 9, d.y * 9, d.z * 9));
  const odm = (dz) => (d) => oblE(d) - dz;
  // izrezan klin: x < 0, z > 0 po vsej višini (proti gledalcu)
  const vKlinu = (d, m = 0) => d.x < m && d.z > -m;
  const MER = [
    [(t) => V(0, Math.cos(t * Math.PI), Math.sin(t * Math.PI)), V(-1, 0, 0)],
    [(t) => V(-Math.sin(t * Math.PI), Math.cos(t * Math.PI), 0), V(0, 0, 1)],
  ];
  function lupinaK(f, ws, hs) {
    const odp = new THREE.SphereGeometry(1, ws, hs, Math.PI / 2, Math.PI * 1.5, 0, Math.PI);
    const pok = new THREE.SphereGeometry(1, Math.round(ws / 4), hs, 0, Math.PI / 2, 0, Math.PI);
    for (const g of [odp, pok]) deformiraj(g, (v) => { v.normalize(); v.multiplyScalar(f(v)); });
    return { odprta: odp, pokrov: pok };
  }
  const rezK = (fZ, fN2, seg) => zdruzi(MER.map(([L, n]) => {
    const pari = [];
    for (let i = 0; i <= seg; i++) { const d = L(i / seg).normalize(); pari.push([d.clone().multiplyScalar(fZ(d)), d.clone().multiplyScalar(fN2(d))]); }
    return trak(pari, n);
  }));

  // ---------- ovojnica in matriksni protein (p17) ----------
  const ov = lupinaK(oblE, q(104), q(68));
  const ovMat = mat(0xd88aa2, { roughness: 0.35, clearcoat: 1, sheen: 0.6 });
  const ovOut = new THREE.Mesh(ov.odprta, ovMat);
  const ovPok = new THREE.Mesh(ov.pokrov, ovMat);
  ovPok.visible = false;
  const ovRez = new THREE.Mesh(zdruzi([rezK(oblE, odm(0.016), q(80)), rezK(odm(0.016), odm(0.042), q(80)), rezK(odm(0.042), odm(0.056), q(80))], [0xe59ab2, 0xf3e2b8, 0xe59ab2]),
    mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide }));
  const fMx = (d) => oblE(d) - 0.1 + 0.009 * Math.max(0, sum(d.x * 30, d.y * 30, d.z * 30));
  const mx = lupinaK(fMx, q(110), q(72));
  mx.pokrov.dispose();
  const mxMat = mat(0x8aa0e6, { roughness: 0.68, clearcoat: 0.4, sheen: 0.3, side: THREE.BackSide });
  const mxIn = new THREE.Mesh(mx.odprta, mxMat);
  const mxRez = new THREE.Mesh(rezK(odm(0.056), (d) => oblE(d) - 0.1, q(80)), mat(0x8aa0e6, { roughness: 0.55, clearcoat: 0.3, side: THREE.DoubleSide }));
  group.add(ovOut, ovPok, ovRez, mxIn, mxRez);

  // ---------- bodice: gp41 (pecelj) in gp120 (glavica), trimeri ----------
  const g41 = [], g120 = [];
  for (let k = 0; k < 3; k++) {
    const a = (k / 3) * Math.PI * 2, pts = [];
    for (let i = 0; i <= 6; i++) { const u = i / 6, b = a + u * 1.2; pts.push(V(Math.cos(b) * (0.012 + 0.012 * u), -0.04 + u * 0.1, Math.sin(b) * (0.012 + 0.012 * u))); }
    g41.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), q(10), 0.0095, q(6), false));
    g120.push(deformiraj(new THREE.SphereGeometry(1, q(14), q(10)), (v) => {
      v.set(v.x * 0.047, v.y * 0.04, v.z * 0.05);
      v.applyAxisAngle(V(-Math.sin(a), 0, Math.cos(a)), 0.5);
      v.x += Math.cos(a) * 0.04; v.z += Math.sin(a) * 0.04; v.y += 0.105;
      v.multiplyScalar(1 + 0.05 * sum(v.x * 70, v.y * 70, v.z * 70));
    }));
  }
  const vse = [], rezB = [], N2 = 15;
  for (let i = 0; i < N2; i++) {
    const y = 1 - (2 * (i + 0.5)) / N2, r = Math.sqrt(1 - y * y), a = i * 2.39996 + 0.4;
    const d = V(Math.cos(a) * r, y, Math.sin(a) * r).add(nakl(0.15)).normalize();
    (vKlinu(d, 0.1) ? rezB : vse).push(d);
  }
  const bodD = vse.concat(rezB), nB0 = vse.length;
  const gp41 = new THREE.InstancedMesh(zdruzi(g41), mat(0x3f9c86, { roughness: 0.4, clearcoat: 0.7 }), bodD.length);
  const gp120 = new THREE.InstancedMesh(zdruzi(g120), mat(0x6cc4a1, { roughness: 0.38, clearcoat: 0.8, sheen: 0.4 }), bodD.length);
  bodD.forEach((d, i) => {
    o.position.copy(d).multiplyScalar(oblE(d) - 0.01); o.quaternion.setFromUnitVectors(gor, d.clone().add(nakl(0.25)).normalize()); o.rotateY(rnd() * 6); o.updateMatrix();
    gp41.setMatrixAt(i, o.matrix); gp120.setMatrixAt(i, o.matrix);
  });
  gp41.count = gp120.count = nB0;
  group.add(gp41, gp120);

  // ---------- stožčasta kapsida (p24) ----------
  // lokalne osi: y = os stožca, z = proti gledalcu (ta polovica je odrezana)
  const R0 = V().crossVectors(gor, KAM).normalize(), U0 = V().crossVectors(KAM, R0).normalize();
  const osK = U0.clone().addScaledVector(R0, -0.32).normalize();
  const zK = KAM.clone().addScaledVector(osK, -KAM.dot(osK)).normalize(), xK = V().crossVectors(osK, zK);
  const kapsG = new THREE.Group();
  kapsG.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(xK, osK, zK));
  kapsG.position.copy(R0).multiplyScalar(-0.07).addScaledVector(U0, 0.02);
  group.add(kapsG);
  const prof = [];
  for (let i = 0; i <= 8; i++) { const t = -Math.PI / 2 + (i / 8) * (Math.PI / 2 + 0.22); prof.push([0.1 * Math.cos(t), -0.5 + 0.1 * Math.sin(t)]); }
  const c0 = prof[prof.length - 1];
  for (let i = 1; i <= 24; i++) { const u = i / 24; prof.push([c0[0] + (0.3 - c0[0]) * u, c0[1] + (0.38 - c0[1]) * u]); }
  for (let i = 1; i <= 12; i++) { const t = (i / 12) * Math.PI / 2; prof.push([0.3 * Math.cos(t), 0.38 + 0.18 * Math.sin(t)]); }
  prof[prof.length - 1][0] = 0;
  const odmikP = (dz) => prof.map(([r, h], i) => {
    const a = prof[Math.max(0, i - 1)], b = prof[Math.min(prof.length - 1, i + 1)];
    const tr = b[0] - a[0], th = b[1] - a[1], l = Math.hypot(tr, th) || 1;
    return new THREE.Vector2(Math.max(0, r - dz * (th / l)), h + dz * (tr / l));
  });
  // ožji del kapside ostane cel (vidi se mreža), širši del je odprt (polovica proti gledalcu odrezana)
  const HS = -0.12;
  let iS = prof.findIndex((p) => p[1] >= HS);
  prof[iS][1] = HS;
  const P0 = odmikP(0), P1 = odmikP(0.022);
  const lat = (P, a, b2, full) => new THREE.LatheGeometry(P.slice(a, b2 + 1), q(full ? 64 : 40), full ? 0 : Math.PI / 2, full ? Math.PI * 2 : Math.PI);
  const kOut = new THREE.Mesh(zdruzi([lat(P0, 0, iS, true), lat(P0, iS, P0.length - 1, false)]), mat(0xc77f2c, { roughness: 0.45, clearcoat: 0.6 }));
  const kIn = new THREE.Mesh(zdruzi([lat(P1, 0, iS, true), lat(P1, iS, P1.length - 1, false)]), mat(0xf6c886, { roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide }));
  const rezP = [];
  for (const sx of [1, -1]) rezP.push(trak(P0.slice(iS).map((p, i) => [V(sx * p.x, p.y, 0), V(sx * P1[iS + i].x, P1[iS + i].y, 0)]), V(0, 0, 1)));
  { const pari = []; for (let j = 0; j <= 24; j++) { const f = -Math.PI / 2 + (j / 24) * Math.PI; pari.push([V(P0[iS].x * Math.sin(f), HS, P0[iS].x * Math.cos(f)), V(P1[iS].x * Math.sin(f), HS, P1[iS].x * Math.cos(f))]); } rezP.push(trak(pari, V(0, 1, 0))); }
  const kRez = new THREE.Mesh(zdruzi(rezP), mat(0xe39a45, { roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide }));
  // heksameri in pentameri na mreži po površini (polovica, ki ostane)
  const dl = [0];
  for (let i = 1; i < prof.length; i++) dl.push(dl[i - 1] + Math.hypot(prof[i][0] - prof[i - 1][0], prof[i][1] - prof[i - 1][1]));
  const naS = (s) => { let i = 1; while (i < dl.length - 1 && dl[i] < s) i++; const u = (s - dl[i - 1]) / (dl[i] - dl[i - 1]); const a = prof[i - 1], b = prof[i]; const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return { r: a[0] + (b[0] - a[0]) * u, h: a[1] + (b[1] - a[1]) * u, nr: (b[1] - a[1]) / l, nh: -(b[0] - a[0]) / l }; };
  const DH = 0.105, heks = [], pent = [];
  const vrst = Math.floor(dl[dl.length - 1] / (DH * 0.866));
  for (let rI = 0; rI <= vrst; rI++) {
    const s = 0.03 + rI * DH * 0.866, P = naS(Math.min(s, dl[dl.length - 1] - 0.02));
    const cel = P.h < HS - 0.03, obseg = cel ? Math.PI * 2 : Math.PI;
    const nT = Math.max(1, Math.round((obseg * P.r) / DH));
    for (let j = 0; j < nT; j++) {
      const f = (cel ? 0 : Math.PI / 2) + ((j + (rI % 2 ? 0.75 : 0.25)) / nT) * obseg;
      if (!cel && f > Math.PI * 1.5 - 0.05) continue;
      if (Math.abs(P.h - HS) < 0.03) continue;
      const n = V(P.nr * Math.sin(f), P.nh, P.nr * Math.cos(f)).normalize();
      const pos = V(P.r * Math.sin(f), P.h, P.r * Math.cos(f)).addScaledVector(n, 0.006);
      const tang = V(-(P.nh) * Math.sin(f), P.nr, -(P.nh) * Math.cos(f)).normalize();
      const m4 = new THREE.Matrix4().makeBasis(V().crossVectors(tang, n), tang, n).setPosition(pos);
      heks.push({ m4, h: P.h, s, p: pos });
    }
  }
  // 12 pentamerov kot v pravi kapsidi: 5 na ožjem koncu, 7 na širšem; od širših so 3 na odrezani polovici (niso narisani)
  const izberiP = (kand, n, raz) => {
    for (const x of kand) if (pent.filter((y) => y.kon === kand).length < n && pent.every((y) => y.p.distanceTo(x.p) > raz)) { x.kon = kand; pent.push(x); }
  };
  izberiP(heks.filter((x) => x.h < -0.3).sort((a, b) => a.s - b.s), 5, 0.085);
  izberiP(heks.filter((x) => x.h > 0.4).sort((a, b) => b.s - a.s), 4, 0.16);
  for (const x of pent) heks.splice(heks.indexOf(x), 1);
  const torus = (n) => new THREE.TorusGeometry(0.033, 0.0145, q(8), n);
  const hexM = new THREE.InstancedMesh(torus(6), mat(0xf2a541, { roughness: 0.38, clearcoat: 0.7, sheen: 0.3 }), heks.length);
  heks.forEach((x, i) => hexM.setMatrixAt(i, x.m4));
  const penM = new THREE.InstancedMesh(torus(5), mat(0xd9622b, { roughness: 0.38, clearcoat: 0.7 }), Math.max(1, pent.length));
  pent.forEach((x, i) => penM.setMatrixAt(i, x.m4));
  penM.count = pent.length;
  kapsG.add(kOut, kIn, kRez, hexM, penM);

  // ---------- vsebina kapside: dve RNK, reverzna transkriptaza, integraza ----------
  const rKon = (h) => (h < -0.5 ? 0.1 * Math.sqrt(Math.max(0, 1 - ((h + 0.5) / 0.1) ** 2)) : h > 0.38 ? 0.3 * Math.sqrt(Math.max(0, 1 - ((h - 0.38) / 0.18) ** 2)) : 0.1 + ((h + 0.5) / 0.88) * 0.2);
  const rnkG = [];
  for (let k = 0; k < 2; k++) {
    const pts = [];
    for (let i = 0; i <= 90; i++) {
      const h = -0.46 + (i / 90) * 0.88, rr = Math.max(0.01, rKon(h) - 0.07) * (0.55 + 0.35 * Math.sin(i * 0.9 + k * 2));
      const a = k * Math.PI + h * 11 + Math.sin(i * 0.5 + k) * 0.8;
      pts.push(V(Math.cos(a) * rr, h, Math.sin(a) * rr * 0.9 - 0.02));
    }
    rnkG.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), q(320), 0.0095, q(5), false));
  }
  const rnk = new THREE.Mesh(zdruzi(rnkG, [0xffd36e, 0xffb84d]), mat(0xffffff, { vertexColors: true, roughness: 0.35, clearcoat: 0.8 }));
  const rtGeo = zdruzi([deformiraj(new THREE.SphereGeometry(1, q(12), q(9)), (v) => v.set(v.x * 0.034, v.y * 0.026, v.z * 0.026).multiplyScalar(1 + 0.1 * sum(v.x * 90, v.y * 90, v.z * 90))), new THREE.SphereGeometry(1, q(10), q(8)).scale(0.026, 0.022, 0.022).translate(0.03, 0.018, 0)]);
  const inGeo = zdruzi([[1, 1, 0], [-1, 1, 0], [1, -1, 0.4], [-1, -1, 0.4]].map(([x, y, z]) => new THREE.SphereGeometry(0.017, q(9), q(7)).translate(x * 0.016, y * 0.016, z * 0.016)));
  const rtP = [V(0.04, -0.28, 0.02), V(-0.08, 0.05, -0.04), V(0.1, 0.27, 0.03), V(-0.03, 0.4, 0.05)];
  const inP = [V(-0.03, -0.16, 0.04), V(0.09, -0.02, 0.02), V(-0.11, 0.25, 0.0), V(0.05, 0.43, -0.06)];
  const rt = new THREE.InstancedMesh(rtGeo, mat(0xe5566b, { roughness: 0.4, clearcoat: 0.7 }), rtP.length);
  rtP.forEach((p, i) => { o.position.copy(p); o.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6); o.scale.setScalar(1); o.updateMatrix(); rt.setMatrixAt(i, o.matrix); });
  const integ = new THREE.InstancedMesh(inGeo, mat(0xb07be8, { roughness: 0.4, clearcoat: 0.7 }), inP.length);
  inP.forEach((p, i) => { o.position.copy(p); o.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6); o.updateMatrix(); integ.setMatrixAt(i, o.matrix); });
  kapsG.add(rnk, rt, integ);
  kapsG.updateMatrix();
  const vSk = (p) => p.clone().applyMatrix4(kapsG.matrix);

  // ---------- deli ----------
  const tB = bodD.slice(0, nB0).filter((d) => d.dot(KAM) > 0.3).sort((a, b) => b.y - a.y)[0] || bodD[0];
  const tB2 = bodD.slice(0, nB0).filter((d) => d.dot(KAM) > 0.3 && d !== tB).sort((a, b) => a.y - b.y)[0] || tB;
  del("ovojnica", "Ovojnica", "Dvojna plast maščob, ki jo virus vzame membrani celice, iz katere izbrsti; vanjo so vgrajene bodice.", "#d88aa2", [ovOut, ovPok, ovRez],
    MER[1][0](0.38).normalize().multiplyScalar(RE - 0.02).add(V(0, 0, 0.004)).toArray());
  del("gp120", "Beljakovina gp120", "Glavica bodice, ki se veže na receptor CD4 na celicah T pomagalkah; tako virus najde celico, ki jo okuži.", "#6cc4a1", [gp120],
    tB.clone().multiplyScalar(oblE(tB) + 0.11).toArray());
  del("gp41", "Beljakovina gp41", "Pecelj bodice, zasidran v ovojnico; po vezavi zlije ovojnico virusa z membrano celice, da kapsida pride v celico.", "#3f9c86", [gp41],
    tB2.clone().multiplyScalar(oblE(tB2) + 0.04).toArray());
  del("matriks", "Matriksni protein (p17)", "Plast beljakovin tik pod ovojnico, ki ovojnico podpira in jo povezuje z notranjostjo virusa.", "#8aa0e6", [mxIn, mxRez],
    V(-0.35, -0.5, -0.25).normalize().multiplyScalar(RE - 0.1).toArray());
  del("kapsida", "Kapsida (p24)", "Stožčast ovoj iz več sto šesterokotnih in 12 peterokotnih skupin beljakovine p24 (5 na ožjem in 7 na širšem koncu, 3 od teh na odrezani polovici); v njej sta dedni zapis in encimi.", "#f2a541", [kOut, kIn, kRez, hexM, penM],
    vSk(V(0.27, 0.2, -0.1)).toArray());
  del("rnk", "RNK (dve molekuli)", "Virus nosi dve enaki molekuli RNK, vsaka ima okoli 9 700 nukleotidov z navodili za izdelavo novih virusov.", "#ffd36e", [rnk], vSk(V(0, -0.05, 0.02)).toArray());
  del("reverzna-transkriptaza", "Reverzna transkriptaza", "Encim, ki po virusni RNK izdela DNK; zato HIV uvrščamo med retroviruse.", "#e5566b", [rt], vSk(rtP[0]).toArray());
  del("integraza", "Integraza", "Encim, ki virusno DNK vgradi v DNK okužene celice; tam lahko ostane skrita več let.", "#b07be8", [integ], vSk(inP[2]).toArray());

  // ---------- nadzor ----------
  const nadzor = [
    { tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cel", "Cel virus"]], vrednost: "prerez", ob: (v) => { const c = v === "cel"; ovPok.visible = c; ovRez.visible = mxRez.visible = !c; gp41.count = gp120.count = c ? bodD.length : nB0; } },
  ];
  if (zac.prikaz) { nadzor[0].vrednost = zac.prikaz; nadzor[0].ob(zac.prikaz); }

  // rahle razlike v svetlosti med ponovljenimi deli (organeli in beljakovine niso vsi povsem enaki)
  {
    const c = new THREE.Color();
    group.traverse((m) => {
      if (!m.isInstancedMesh || m.instanceColor) return;
      for (let i = 0; i < m.instanceMatrix.count; i++) { const k = 0.88 + 0.2 * hash(i * 1.37, m.instanceMatrix.count * 0.11, 7); m.setColorAt(i, c.setRGB(k, k, k)); }
    });
  }

  // ---------- videz: globlje barve, vlažni materiali, drobna površinska tekstura, senčenje v vdolbinah ----------
  // nast[idDela] = { tex: "zrna" | "gube" | "fino" | "vlakna" | null, rep: [u, v], k: moč normal mape, lisa: lise,
  //   f: gostota lis, uv: "smer" (krogelni uv), ton: 0 … 1 (poglobitev barve), rough, cc, sheen, temni: zatemnitev, ao(p, n) → faktor }
  function poliraj(nast = {}, seznam) {
    seznam = seznam || deli;
    const N = 128, teks = {}, obdelane = new Set(), hsl = {}, c = new THREE.Color(), bel = new THREE.Color(1, 1, 1);
    const per = (x, y, P, s) => { // periodičen šum vrednosti (ploščica brez šiva)
      const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
      const h = (a, b) => hash(((xi + a) % P + P) % P, ((yi + b) % P + P) % P, s);
      return h(0, 0) * (1 - u) * (1 - v) + h(1, 0) * u * (1 - v) + h(0, 1) * (1 - u) * v + h(1, 1) * u * v;
    };
    const vrste = {
      zrna: (x, y) => 0.5 * per(x * 16, y * 16, 16, 1) + 0.3 * Math.pow(per(x * 32, y * 32, 32, 2), 2) + 0.2 * per(x * 64, y * 64, 64, 3),
      gube: (x, y) => 0.6 * (1 - Math.abs(2 * per(x * 8, y * 8, 8, 4) - 1)) + 0.25 * per(x * 24, y * 24, 24, 5) + 0.15 * per(x * 64, y * 64, 64, 6),
      fino: (x, y) => 0.6 * per(x * 32, y * 32, 32, 7) + 0.4 * per(x * 64, y * 64, 64, 8),
      vlakna: (x, y) => 0.55 * per(x * 4, y * 48, 4, 9) + 0.3 * per(x * 8, y * 96, 8, 10) + 0.15 * per(x * 32, y * 64, 32, 11),
    };
    function tekstura(vrsta, rep) {
      const kl = vrsta + rep;
      if (teks[kl]) return teks[kl];
      if (!teks[vrsta]) {
        const H = new Float32Array(N * N), d = new Uint8Array(N * N * 4), f = vrste[vrsta];
        for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) H[j * N + i] = f(i / N, j / N);
        for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
          const dx = (H[j * N + (i + 1) % N] - H[j * N + (i + N - 1) % N]) * 6, dy = (H[((j + 1) % N) * N + i] - H[((j + N - 1) % N) * N + i]) * 6;
          const l = Math.hypot(dx, dy, 1), k = (j * N + i) * 4;
          d[k] = (-dx / l * 0.5 + 0.5) * 255; d[k + 1] = (-dy / l * 0.5 + 0.5) * 255; d[k + 2] = (1 / l * 0.5 + 0.5) * 255; d[k + 3] = 255;
        }
        const t = new THREE.DataTexture(d, N, N, THREE.RGBAFormat);
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true;
        t.needsUpdate = true;
        odpad.push(t);
        teks[vrsta] = t;
      }
      const t = teks[vrsta].clone();
      t.repeat.set(rep[0], rep[1]); t.needsUpdate = true;
      odpad.push(t);
      return (teks[kl] = t);
    }
    function poglobi(col, moc) { // nasičenost gor, svetlost dol (pastel → barva znanstvene ilustracije)
      col.getHSL(hsl);
      const s = hsl.s < 0.06 ? hsl.s : Math.min(1, hsl.s * (1 + 0.2 * moc) + 0.03 * moc);
      const l = hsl.l > 0.42 ? hsl.l - (hsl.l - 0.42) * 0.3 * moc : hsl.l * (1 - 0.03 * moc);
      return col.setHSL(hsl.h, s, l);
    }
    function uvIzSmeri(g) { // manjkajoči uv: krogelna projekcija okoli središča geometrije
      g.computeBoundingBox();
      const s = g.boundingBox.getCenter(new THREE.Vector3()), p = g.attributes.position, uv = new Float32Array(p.count * 2), v = new THREE.Vector3();
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i).sub(s);
        const r = v.length() || 1;
        uv[i * 2] = Math.atan2(v.z, v.x) / (2 * Math.PI) + 0.5; uv[i * 2 + 1] = Math.acos(Math.max(-1, Math.min(1, v.y / r))) / Math.PI;
      }
      g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    }
    function obdelajGeo(g, o, m) { // barve oglišč: poglobitev, lise, zatemnitev v vdolbinah in na notranjih stenah
      if (obdelane.has(g)) return;
      obdelane.add(g);
      if (!g.attributes.uv || (o.uv === "smer" && !m.map)) uvIzSmeri(g);
      const p = g.attributes.position, nrm = g.attributes.normal;
      if (!(o.lisa || o.ao || m.side === THREE.BackSide || m.vertexColors)) return;
      let col = g.attributes.color;
      if (!col) { col = new THREE.BufferAttribute(new Float32Array(p.count * 3).fill(1), 3); g.setAttribute("color", col); }
      const P = new THREE.Vector3(), Nn = new THREE.Vector3(), f = o.f || 3, zn = m.side === THREE.BackSide;
      for (let i = 0; i < p.count; i++) {
        P.fromBufferAttribute(p, i);
        if (nrm) Nn.fromBufferAttribute(nrm, i);
        c.fromBufferAttribute(col, i);
        if (m.vertexColors && o.ton !== 0) poglobi(c, o.ton == null ? 1 : o.ton);
        let k = 1;
        if (o.lisa) k *= 1 + o.lisa * fbm(P.x * f + 11, P.y * f + 5, P.z * f + 3);
        if (zn) k *= 0.84 + 0.12 * (P.y / (Math.hypot(P.x, P.y, P.z) || 1));
        if (o.ao) k *= o.ao(P, Nn);
        c.multiplyScalar(k);
        col.setXYZ(i, c.r, c.g, c.b);
      }
      col.needsUpdate = true;
    }
    const mati = new Map();
    for (const d of seznam) for (const x of d.meshes) x.traverse((y) => { if (y.isMesh && y.material && !mati.has(y.material)) mati.set(y.material, d.id); });
    group.traverse((y) => { if (y.isMesh && y.material && !mati.has(y.material)) mati.set(y.material, null); });
    for (const [m, id] of mati) {
      if (!m.isMeshPhysicalMaterial) continue;
      const o = Object.assign({}, nast["*"] || {}, (id && nast[id]) || {});
      const ton = o.ton == null ? 1 : o.ton, zn = m.side === THREE.BackSide;
      const meshes = [];
      group.traverse((y) => { if (y.isMesh && y.material === m) meshes.push(y); });
      const geos = meshes.map((y) => y.geometry);
      if (!m.vertexColors) poglobi(m.color, ton);
      if (o.temni) m.color.multiplyScalar(o.temni);
      if (zn) m.color.multiplyScalar(0.88);
      m.roughness = o.rough != null ? o.rough : Math.min(0.74, Math.max(0.44, m.roughness * 0.55 + 0.3 + (zn ? 0.1 : 0)));
      m.clearcoat = o.cc != null ? o.cc : Math.min(0.5, m.clearcoat * 0.55);
      m.clearcoatRoughness = 0.2;
      m.sheen = o.sheen != null ? o.sheen : Math.max(m.sheen, 0.4);
      m.sheenRoughness = 0.45;
      const sc = m.vertexColors ? c.set(id ? seznam.find((d) => d.id === id).barva : 0xffffff) : c.copy(m.color);
      m.sheenColor = sc.clone().lerp(bel, 0.4).multiplyScalar(0.7);
      m.envMapIntensity = 0.9;
      if (o.lisa || o.ao || zn) m.vertexColors = true;
      for (const g of geos) obdelajGeo(g, o, m);
      if (o.tex !== null) {
        let rep = o.rep;
        if (!rep) {
          const g = geos[0]; g.computeBoundingSphere();
          const n = Math.max(1, Math.round(g.boundingSphere.radius * 9));
          rep = [2 * n, n];
        }
        m.normalMap = tekstura(o.tex || "zrna", rep);
        const k = o.k != null ? o.k : 0.3;
        m.normalScale.set(k, k);
      }
      m.userData.pol = (g) => obdelajGeo(g, o, m);
      m.needsUpdate = true;
    }
  }
  // Drobna zrnca v citoplazmi (točke brez trikotnikov); tocke(i) → Vector3 ali null.
  function zrnca(n, tocke, barva, velikost, razp = 0.35) {
    const pos = [], col = [], b = new THREE.Color(barva), c = new THREE.Color();
    for (let i = 0, p = 0; i < n && p < n * 20; p++) {
      const v = tocke(p);
      if (!v) continue;
      i++;
      pos.push(v.x, v.y, v.z);
      c.copy(b).multiplyScalar(1 - razp / 2 + razp * hash(p * 0.37, 3.1, 9.7));
      col.push(c.r, c.g, c.b);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    const S = 32, d = new Uint8Array(S * S * 4);
    for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
      const r = Math.hypot(i + 0.5 - S / 2, j + 0.5 - S / 2) / (S / 2), k = (j * S + i) * 4, a = Math.max(0, 1 - r);
      d[k] = d[k + 1] = d[k + 2] = 255 * (0.55 + 0.45 * Math.sqrt(a)); d[k + 3] = r < 0.9 ? 255 : 0;
    }
    const t = new THREE.DataTexture(d, S, S, THREE.RGBAFormat);
    t.magFilter = THREE.LinearFilter; t.needsUpdate = true;
    const m = new THREE.PointsMaterial({ size: velikost, map: t, alphaTest: 0.5, vertexColors: true, sizeAttenuation: true });
    odpad.push(t, m);
    const pt = new THREE.Points(g, m);
    pt.raycast = () => {};
    return pt;
  }

  poliraj({
    ovojnica: { tex: "zrna", rep: [26, 13], k: 0.3, lisa: 0.12, f: 3, sheen: 0.7, temni: 0.94, uv: "smer" },
    matriks: { tex: "zrna", rep: [30, 15], k: 0.4, lisa: 0.15, f: 6, uv: "smer" },
    kapsida: { tex: "fino", rep: [8, 4], k: 0.18, uv: "smer" },
    rnk: { tex: null },
    gp120: { tex: "gube", rep: [2, 1], k: 0.4 },
  });

  return {
    group,
    deli,
    nadzor,
    pogled: [-0.47, 0.34, 0.81],
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
