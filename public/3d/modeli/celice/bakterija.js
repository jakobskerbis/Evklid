// Bakterijska celica (Escherichia coli) v prerezu: kapsula, stena, membrana, nukleoid, plazmidi, ribosomi, bički, pili.
// Pogodba graditelja: docs/3d.md. Brez uvozov; THREE pride od kompleta.

export const info = {
  id: "celica-bakterijska",
  naslov: "Bakterijska celica",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Paličasta bakterija Escherichia coli (dolga okoli 2 µm). Nima jedra ne organelov z membrano: DNK leži prosto v citoplazmi kot nukleoid. Bički so skrajšani (v resnici so nekajkrat daljši od celice).",
  merilo: { m: 3.33e-6, oznaka: "3,3 µm" },
};

export function zgradi(THREE, ctx = {}) {
  let seme = 31;
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

  // ---------- oblika: valj s polkroglastima koncema (1 µm = 0,6 enote) ----------
  const H = 0.35, RB = 0.25;
  const nCap = hi ? 16 : 10, nCyl = hi ? 28 : 16, nK = hi ? 96 : 52;
  const pts = [];
  for (let i = 0; i < nCap; i++) { const a = Math.PI - (i / nCap) * (Math.PI / 2); pts.push([-H + RB * Math.cos(a), RB * Math.sin(a)]); }
  for (let i = 0; i <= nCyl; i++) pts.push([-H + (2 * H * i) / nCyl, RB]);
  for (let i = 1; i <= nCap; i++) { const a = Math.PI / 2 - (i / nCap) * (Math.PI / 2); pts.push([H + RB * Math.cos(a), RB * Math.sin(a)]); }
  const P = profil(pts), rezI = pts.length - 1; // izrez po vsej dolžini: četrtina y > 0, z > 0
  const sumF = (x, y, z) => 0.004 * fbm(x * 9 + 2, y * 9, z * 9);
  const ZS = 0.022, ZM = 0.03, ZC = 0.032, ZK = -0.06; // stena ≈ 37 nm, membrana, citoplazma, kapsula
  const tocka = (x, th, zamik) => { let i = 0; while (i < P.p.length - 1 && P.p[i][0] < x) i++; return vrtTocka(P, i, th, zamik, sumF, V()); };
  const osDist = (p) => Math.hypot(Math.max(0, Math.abs(p.x) - H), Math.hypot(p.y, p.z));
  const vCeli = (p, m = 0) => osDist(p) < RB - m;
  const izrezan = (p, m = 0) => p.y > -m && p.z > -m;
  const ovira = (x) => !vCeli(x, ZC);
  const vidnaB = (p) => { const x = p.clone(); for (let i = 0; i < 80; i++) { x.addScaledVector(KAM, 0.01); if (izrezan(x) || !vCeli(x, -0.01)) return izrezan(x) || osDist(x) > RB; if (ovira(x)) return false; } return true; };

  // ---------- celična stena ----------
  const stG = vrtenina(P, nK, rezI, 0, sumF);
  const sc = new THREE.Color(), s1 = new THREE.Color(0xd2b073), s2 = new THREE.Color(0x9c7b45);
  pobarvaj(stG.g, (v) => sc.copy(s1).lerp(s2, 0.5 + 0.5 * fbm(v.x * 30, v.y * 30, v.z * 30)));
  const stena = new THREE.Mesh(stG.g, mat(0xffffff, { vertexColors: true, roughness: 0.55, clearcoat: 0.5, sheen: 0.4 }));
  // prerez ovojnice po plasteh: zunanja membrana, peptidoglikan, periplazemski prostor
  const plasti = (meje, barve) => zdruzi(meje.slice(0, -1).map((a, i) => vrtRez(P, nK, rezI, a, meje[i + 1], sumF)), barve);
  const stRez = new THREE.Mesh(plasti([0, 0.0025, 0.0045, 0.007, 0.016, ZS], [0xb4587c, 0xf0d2c2, 0xb4587c, 0xc99a4f, 0xf0e2c0]), mat(0xffffff, { vertexColors: true, roughness: 0.7, clearcoat: 0.2, side: THREE.DoubleSide }));
  group.add(stena, stRez);
  del("celicna-stena", "Celična stena", "Čvrsta plast iz peptidoglikana (mureina, v prerezu rjava), ki daje bakteriji obliko in jo varuje; pri E. coli jo obdaja še tanka zunanja membrana. Debelina plasti je povečana.", "#c8a66e",
    [stena, stRez], tocka(0.2, Math.PI * 0.68, 0).toArray());

  // ---------- celična membrana in citoplazma ----------
  const memMat = mat(0xd88aa2, { roughness: 0.3, clearcoat: 1, side: THREE.DoubleSide });
  const memRez = new THREE.Mesh(plasti([ZS, ZS + 0.0025, ZM - 0.0025, ZM], [0xb4587c, 0xf4d9c4, 0xb4587c]), mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide }));
  const cG = vrtenina(P, nK, rezI, ZC, sumF);
  const cit = new THREE.Mesh(cG.g, mat(0xeadcbc, { roughness: 0.7, clearcoat: 0.15, sheen: 0.3, side: THREE.BackSide }));
  group.add(memRez, cit);
  del("membrana", "Celična membrana", "Dvosloj fosfolipidov z beljakovinami pod steno; uravnava prehod snovi, na njej poteka tudi celično dihanje, saj bakterija nima mitohondrijev. Debelina je povečana.", "#d88aa2",
    [memRez], tocka(-0.12, 0.02, (ZS + ZM) / 2).add(V(0, 0, 0.004)).toArray());
  del("citoplazma", "Citoplazma", "Gosta tekočina v celici z ribosomi, encimi in hranili; v njej ni organelov z membrano.", "#eadcbc", [cit], tocka(-0.25, Math.PI * 1.25, ZC + 0.002).toArray());

  // ---------- kapsula (sluzasta ovojnica) ----------
  const kG = vrtenina(P, nK, rezI, ZK, (x, y, z) => 0.012 * fbm(x * 5, y * 5, z * 5));
  const kMat = mat(0x9fd6c9, { roughness: 0.2, clearcoat: 0.6, transparent: true, opacity: 0.2, depthWrite: false });
  const kapsula = new THREE.Mesh(kG.g, kMat);
  kapsula.renderOrder = 2;
  group.add(kapsula);
  del("kapsula", "Kapsula", "Sluzasta plast zunaj stene, ki bakterijo varuje pred izsušitvijo in obrambnimi celicami; nimajo je vse bakterije.", "#9fd6c9",
    [kapsula], tocka(0.05, Math.PI * 0.55, ZK).toArray());

  // ---------- nukleoid: krožna DNK, zvita v klobčič ----------
  const K = 34, ak = [], bk = [];
  for (let k = 1; k <= K; k++) { const a = 1 / Math.pow(k, 0.75); ak.push(nakl(a)); bk.push(nakl(a)); }
  const zanka = [];
  const nZ = hi ? 1800 : 900;
  for (let i = 0; i < nZ; i++) {
    const t = (i / nZ) * Math.PI * 2, p = V();
    for (let k = 1; k <= K; k++) p.addScaledVector(ak[k - 1], Math.cos(k * t)).addScaledVector(bk[k - 1], Math.sin(k * t));
    zanka.push(p);
  }
  const bb = new THREE.Box3().setFromPoints(zanka), bs = bb.getSize(V()), bc = bb.getCenter(V());
  zanka.forEach((p) => p.sub(bc).multiply(V(0.66 / bs.x, 0.25 / bs.y, 0.25 / bs.z)));
  const dnk = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(zanka, true), nZ * 2, 0.0042, q(5), true), mat(0xa98bf0, { roughness: 0.4, clearcoat: 0.6 }));
  group.add(dnk);
  const dnkT = zanka.filter((p) => izrezan(p, -0.03)).sort((a, b) => b.dot(KAM) - a.dot(KAM))[0] || zanka[0];
  del("nukleoid", "Nukleoid (krožna DNK)", "Območje, kjer leži ena sama velika krožna molekula DNK, gosto zvita v klobčič. Bakterija nima jedra, zato DNK ni ločena od citoplazme.", "#a98bf0", [dnk], dnkT.toArray());

  // ---------- plazmidi ----------
  const plG = [];
  const plC = [V(-0.3, 0.1, -0.1), V(-0.12, -0.12, 0.06), V(0.4, 0.05, -0.12)];
  for (const c of plC) {
    const pp = [], R0 = 0.032 + rnd() * 0.008, e = new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3);
    for (let i = 0; i < 80; i++) {
      const t = (i / 80) * Math.PI * 2;
      pp.push(V(Math.cos(t) * R0 * (1 + 0.25 * Math.sin(3 * t)), Math.sin(t) * R0 * 0.8, 0.012 * Math.sin(5 * t)).applyEuler(e).add(c));
    }
    plG.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pp, true), 160, 0.004, q(5), true));
  }
  const plazmid = new THREE.Mesh(zdruzi(plG), mat(0xe58cc8, { roughness: 0.35, clearcoat: 0.7 }));
  group.add(plazmid);
  del("plazmidi", "Plazmidi", "Majhne krožne molekule DNK poleg nukleoida; nosijo dodatne gene (na primer za odpornost proti antibiotikom) in jih bakterije lahko izmenjajo.", "#e58cc8", [plazmid], plC[0].toArray());

  // ---------- ribosomi 70S (velika in mala podenota) ----------
  const ribGeo = zdruzi([new THREE.IcosahedronGeometry(0.0064, 0), new THREE.IcosahedronGeometry(0.0047, 0).translate(0.005, 0.0042, 0)]);
  const nRib = hi ? 1300 : 600;
  const rib = new THREE.InstancedMesh(ribGeo, mat(0x34509f, { roughness: 0.5, clearcoat: 0.4 }), nRib);
  const vNuk = (p) => (p.x / 0.36) ** 2 + (p.y / 0.14) ** 2 + (p.z / 0.14) ** 2 < 1;
  const ribT = [];
  let k = 0, posk = 0;
  while (k < nRib && posk++ < 300000) {
    smer.set((rnd() * 2 - 1) * (H + RB), (rnd() * 2 - 1) * RB, (rnd() * 2 - 1) * RB);
    if (!vCeli(smer, ZC + 0.012) || izrezan(smer, 0) || (vNuk(smer) && rnd() < 0.85) || plC.some((c) => c.distanceTo(smer) < 0.05)) continue;
    o.position.copy(smer); o.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6); o.updateMatrix(); rib.setMatrixAt(k++, o.matrix);
    if (ribT.length < 60 && smer.x < 0) ribT.push(smer.clone());
  }
  rib.count = k;
  group.add(rib);
  del("ribosomi", "Ribosomi (70S)", "Tisoči drobnih zrnc, ki sestavljajo beljakovine; bakterijski ribosomi so manjši od ribosomov v evkariontskih celicah.", "#2b3f8f", [rib],
    (ribT.find((p) => vidnaB(p) && p.y < -0.06) || ribT[0] || V()).toArray());

  // ---------- bički: bazalno telo (motor), kavelj in vijačna nit ----------
  const X = V(1, 0, 0), Y = V(0, 1, 0);
  const sidra = [
    { x: -0.18, th: 0.02 },               // na robu prereza: vidi se bazalno telo
    { x: 0.22, th: Math.PI * 0.62 }, { x: 0.1, th: Math.PI * 0.95 }, { x: -0.3, th: Math.PI * 1.35 },
    { x: 0.5, th: Math.PI * 1.7 }, { x: 0.32, th: Math.PI * 1.15 }, { x: -0.5, th: Math.PI * 0.75 },
  ];
  const bMat = mat(0xf0d9a8, { roughness: 0.35, clearcoat: 0.8 });
  const bicki = [], kavlji = [];
  const PITCH = 0.3, RH = 0.027; // razmerje korak : premer vijačnice kot pri pravem bičku
  for (const s of sidra) {
    const b = tocka(s.x, s.th, 0);
    const n = b.clone().sub(V(Math.max(-H, Math.min(H, b.x)), 0, 0)).normalize();
    const d = n.clone().multiplyScalar(0.8).addScaledVector(X, 0.45).add(nakl(0.3)).normalize();
    const zac0 = b.clone().addScaledVector(n, 0.03);
    let L = 0.85;
    while (L > 0.2 && zac0.clone().addScaledVector(d, L).length() > 0.95) L -= 0.02;
    // vijačna nit (levosučna), os = lokalna y
    const seg = hi ? 220 : 120, hp = [];
    for (let i = 0; i <= seg; i++) {
      const u = (i / seg) * L, r = RH * gladko(0, 0.08, u), a = (u / PITCH) * Math.PI * 2;
      hp.push(V(Math.cos(a) * r, u, -Math.sin(a) * r));
    }
    const nit = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hp), seg, 0.0065, q(6), false), bMat);
    nit.position.copy(zac0);
    nit.quaternion.setFromUnitVectors(Y, d);
    nit.userData.q0 = nit.quaternion.clone();
    group.add(nit);
    bicki.push(nit);
    // kavelj: kratek ukrivljen del od stene do niti
    kavlji.push(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(b.clone().addScaledVector(n, -0.004), b.clone().addScaledVector(n, 0.026), zac0.clone().addScaledVector(d, 0.006)), 10, 0.0085, q(8), false));
    s.b = b; s.n = n; s.d = d;
  }
  const kavelj = new THREE.Mesh(zdruzi(kavlji), mat(0xd9b36a, { roughness: 0.35, clearcoat: 0.6 }));
  group.add(kavelj);
  del("bicki", "Bički", "Dolge vijačne niti iz beljakovine flagelina; motor v steni jih vrti kot ladijski vijak, da bakterija plava. Kavelj povezuje nit z motorjem.", "#f0d9a8",
    [...bicki, kavelj], sidra[0].b.clone().addScaledVector(sidra[0].d, 0.22).toArray());

  // bazalno telo vidnega bička: obroči v zunanji membrani, steni in membrani ter os
  const s0 = sidra[0], bt = [];
  const obr = (zam, r, deb) => { const t = new THREE.TorusGeometry(r, deb, q(8), q(22)); t.rotateX(Math.PI / 2); t.translate(0, -zam, 0); return t; };
  bt.push(obr(0.004, 0.011, 0.003), obr(0.014, 0.011, 0.003), obr(0.026, 0.013, 0.0035));
  const cRing = new THREE.CylinderGeometry(0.02, 0.016, 0.012, q(20), 1, true); cRing.translate(0, -0.042, 0); bt.push(cRing);
  const os = new THREE.CylinderGeometry(0.004, 0.004, 0.046, q(8)); os.translate(0, -0.021, 0); bt.push(os);
  const motor = new THREE.Mesh(zdruzi(bt), mat(0xb7793a, { roughness: 0.4, clearcoat: 0.5, side: THREE.DoubleSide }));
  motor.position.copy(s0.b);
  motor.quaternion.setFromUnitVectors(Y, s0.n);
  group.add(motor);
  del("bazalno-telo", "Bazalno telo (motor bička)", "Drobni motor iz beljakovinskih obročev, vgrajen v steno in membrano; poganja ga tok protonov in vrti biček do sto obratov na sekundo.", "#b7793a",
    [motor], s0.b.clone().addScaledVector(s0.n, -0.03).toArray());

  // ---------- pili (fimbrije) in en spolni pilus ----------
  const nPil = hi ? 230 : 140;
  const pil = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.0016, 0.0024, 1, 5, 1, true).translate(0, 0.5, 0), mat(0x86aec4, { roughness: 0.45, clearcoat: 0.4 }), nPil + 1);
  const pilT = [];
  k = 0; posk = 0;
  while (k < nPil && posk++ < 20000) {
    const x = (rnd() * 2 - 1) * (H + RB * 0.9), th = rnd() * Math.PI * 2;
    if (th < Math.PI / 2 + 0.04) continue; // izrez
    const b = tocka(x, th, 0.003);
    const n = b.clone().sub(V(Math.max(-H, Math.min(H, b.x)), 0, 0)).normalize().add(nakl(0.35)).normalize();
    o.position.copy(b); o.quaternion.setFromUnitVectors(Y, n); o.scale.set(1, 0.06 + rnd() * 0.08, 1); o.updateMatrix();
    pil.setMatrixAt(k++, o.matrix);
    if (n.dot(KAM) > 0.75 && b.y < 0.1) pilT.push(b.clone().addScaledVector(n, 0.09));
  }
  { // spolni pilus (F-pilus): daljši in debelejši
    const b = tocka(0.15, Math.PI * 1.6, 0.003), n = b.clone().sub(V(b.x, 0, 0)).normalize().addScaledVector(X, 0.3).normalize();
    o.position.copy(b); o.quaternion.setFromUnitVectors(Y, n); o.scale.set(2.2, 0.42, 2.2); o.updateMatrix(); pil.setMatrixAt(k++, o.matrix);
  }
  pil.count = k;
  group.add(pil);
  del("pili", "Pili (fimbrije)", "Kratki tanki laski na površini, s katerimi se bakterija prime podlage ali drugih celic; daljši spolni pilus služi za prenos plazmidov.", "#8fc7e8", [pil], (pilT[0] || V(0, -0.3, 0.2)).toArray());

  // ---------- nadzor ----------
  let rez = true, kap = true;
  const vsiDeli = deli.slice();
  const posodobi = () => {
    for (const x of [stG, cG, kG]) x.rez(rez);
    stRez.visible = memRez.visible = motor.visible = rez;
    kapsula.visible = kap;
    deli = vsiDeli.filter((d) => (d.id !== "kapsula" || kap) && (d.id !== "bazalno-telo" || rez));
  };
  const nadzor = [
    { tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cela", "Cela celica"]], vrednost: "prerez", ob: (v) => { rez = v !== "cela"; posodobi(); } },
    { tip: "stikalo", id: "kapsula", oznaka: "Pokaži kapsulo", vrednost: true, ob: (v) => { kap = !!v; posodobi(); } },
  ];
  if (zac.prikaz) { nadzor[0].vrednost = zac.prikaz; rez = zac.prikaz !== "cela"; }
  if (zac.kapsula === false || zac.kapsula === "false" || zac.kapsula === 0) { nadzor[1].vrednost = false; kap = false; }
  posodobi();

  const qr = new THREE.Quaternion();
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
      bicki.forEach((b, i) => { qr.setFromAxisAngle(Y, -t * 5 - i); b.quaternion.copy(b.userData.q0).multiply(qr); });
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
