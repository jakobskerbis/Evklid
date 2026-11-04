// Bakteriofag T4 na steni bakterije: glava (podaljšan dvajsetploskovec) z DNK, krčljivi rep, bazalna plošča, repna vlakna.
// Drsnik »Vbrizgavanje«: plašč repa se skrči, cevka prebode steno, DNK preide v bakterijo.
// Pogodba graditelja: docs/3d.md. Brez uvozov; THREE pride od kompleta.

export const info = {
  id: "virus-bakteriofag-t4",
  naslov: "Bakteriofag T4",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Virus, ki napada bakterijo E. coli (visok okoli 200 nm). Z repnimi vlakni se pritrdi na bakterijo, skrči plašč repa in vbrizga svojo DNK. Okno v glavi pokaže navito DNK; navojev je manj kot v resnici.",
  merilo: { m: 360e-9, oznaka: "360 nm" },
};

export function zgradi(THREE, ctx = {}) {
  let seme = 53;
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

  // 1 enota = 180 nm
  const gor = V(0, 1, 0);
  function palica(a, b, r, seg = q(8), r2 = r) {
    const d = b.clone().sub(a), g = new THREE.CylinderGeometry(r2, r, d.length(), seg, 1);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(gor, d.clone().normalize()));
    const c = a.clone().add(b).multiplyScalar(0.5);
    return g.translate(c.x, c.y, c.z);
  }
  const krogla = (p, r, w = q(12), h = q(8)) => new THREE.SphereGeometry(r, w, h).translate(p.x, p.y, p.z);

  // ---------- glava: podaljšan dvajsetploskovec (120 × 86 nm) ----------
  const S = 0.267, E = 0.249, YH = 0.467;
  const az = (Math.atan2(KAM.z, KAM.x) - Math.PI / 5);
  const ogl = (r, y, a) => V(r * Math.cos(a + az), y, r * Math.sin(a + az));
  const VR = [ogl(0, S * (1 + E), 0)];
  for (let k = 0; k < 5; k++) VR.push(ogl(0.894 * S, S * (0.447 + E), (2 * Math.PI * k) / 5));
  for (let k = 0; k < 5; k++) VR.push(ogl(0.894 * S, -S * (0.447 + E), (2 * Math.PI * k) / 5 + Math.PI / 5));
  VR.push(ogl(0, -S * (1 + E), 0));
  const U = (k) => 1 + (k % 5), Lw = (k) => 6 + (k % 5), BOT = 11;
  let ploskve = [];
  for (let k = 0; k < 5; k++) ploskve.push([0, U(k + 1), U(k)], [U(k), U(k + 1), Lw(k)], [Lw(k), U(k + 1), Lw(k + 1)], [BOT, Lw(k), Lw(k + 1)]);
  ploskve = ploskve.map((f) => {
    const [a, b, c] = f.map((i) => VR[i]);
    const n = V().crossVectors(b.clone().sub(a), c.clone().sub(a));
    return n.dot(a.clone().add(b).add(c)) < 0 ? [f[0], f[2], f[1]] : f;
  });
  const normala = (f) => V().crossVectors(VR[f[1]].clone().sub(VR[f[0]]), VR[f[2]].clone().sub(VR[f[0]])).normalize();
  // okno: tri ploskve, najbolj obrnjene proti gledalcu
  const okno = new Set(ploskve.map((f, i) => [i, normala(f).dot(KAM)]).sort((a, b) => b[1] - a[1]).slice(0, 3).map((x) => x[0]));

  const cKaps = 0x8fa9cf, cRob = 0xc9d7ec, cHeks = 0xaec5e8, cPent = 0xe3a04f;
  function glavaGeo(izberi) { // izberi(i) = ali ploskev i sodi v to mrežo
    const gs = [], bv = [];
    ploskve.forEach((f, i) => {
      if (!izberi(i)) return;
      const [a, b, c] = f.map((j) => VR[j]), n = normala(f);
      const t = new THREE.BufferGeometry().setFromPoints([a, b, c]);
      t.computeVertexNormals();
      gs.push(t); bv.push(cKaps);
      // heksameri (kapsomere) na mreži znotraj ploskve
      const ex = b.clone().sub(a).normalize(), ez = V().crossVectors(ex, n);
      const m4 = new THREE.Matrix4().makeBasis(ex, n, ez);
      for (const [x, y, z] of [[1, 1, 3], [1, 3, 1], [3, 1, 1], [1, 2, 2], [2, 1, 2], [2, 2, 1]]) {
        const p = a.clone().multiplyScalar(x).addScaledVector(b, y).addScaledVector(c, z).multiplyScalar(0.2).addScaledVector(n, 0.005);
        const h = new THREE.CylinderGeometry(0.022, 0.027, 0.011, 6, 1).applyMatrix4(m4).translate(p.x, p.y, p.z);
        gs.push(h); bv.push(cHeks);
      }
    });
    return [gs, bv];
  }
  const [gk, bk] = glavaGeo((i) => !okno.has(i));
  // robovi (brez tistih med dvema ploskvama okna) in pentameri v ogliščih
  const robovi = new Map();
  ploskve.forEach((f, i) => { for (let j = 0; j < 3; j++) { const a = f[j], b = f[(j + 1) % 3], key = Math.min(a, b) + "-" + Math.max(a, b); robovi.set(key, (robovi.get(key) || 0) + (okno.has(i) ? 1 : 0)); } });
  for (const [key, nOk] of robovi) {
    if (nOk === 2) continue;
    const [a, b] = key.split("-").map(Number);
    gk.push(palica(VR[a], VR[b], 0.0075, q(8))); bk.push(cRob);
  }
  VR.forEach((p, i) => {
    if (i === BOT) return; // spodnje oglišče: vratni portal
    const n = p.clone().normalize();
    gk.push(new THREE.CylinderGeometry(0.026, 0.031, 0.018, 5, 1).applyQuaternion(new THREE.Quaternion().setFromUnitVectors(gor, n)).translate(p.x, p.y, p.z));
    bk.push(cPent);
  });
  const glavaMat = mat(0xffffff, { vertexColors: true, roughness: 0.38, clearcoat: 0.9, sheen: 0.3, flatShading: false });
  const glava = new THREE.Mesh(zdruzi(gk, bk), glavaMat);
  // notranja stran kapside (vidna skozi okno)
  const notr = [];
  ploskve.forEach((f, i) => { if (okno.has(i)) return; const t = new THREE.BufferGeometry().setFromPoints([VR[f[0]], VR[f[2]], VR[f[1]]].map((v) => v.clone().multiplyScalar(0.955))); t.computeVertexNormals(); notr.push(t); });
  const glavaIn = new THREE.Mesh(zdruzi(notr), mat(0x55688f, { roughness: 0.6, clearcoat: 0.2 }));
  // pokrov okna (za »Zaprta glava«)
  const [gp, bp] = glavaGeo((i) => okno.has(i));
  const glavaPok = new THREE.Mesh(zdruzi(gp, bp), glavaMat);
  glavaPok.visible = false;

  // ---------- DNK, navita v glavi kot na tuljavi ----------
  const dnkTocke = [VR[BOT].clone().multiplyScalar(0.8)];
  const RIN = 0.205, HIN = 0.3;
  const plasti = [0.172, 0.138, 0.104, 0.07, 0.036];
  let navzgor = true;
  for (const r of plasti) {
    const h = HIN * Math.sqrt(Math.max(0, 1 - (r / RIN) ** 2)) - 0.02;
    const navoji = Math.max(2, Math.floor((2 * h) / 0.03)), korak = 20;
    for (let i = 0; i <= navoji * korak; i++) {
      const u = i / (navoji * korak), a = u * navoji * Math.PI * 2 + r * 9;
      const y = navzgor ? -h + 2 * h * u : h - 2 * h * u;
      dnkTocke.push(V(r * Math.cos(a), y, r * Math.sin(a)));
    }
    navzgor = !navzgor;
  }
  const dnkSeg = dnkTocke.length * 2;
  const dnkGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(dnkTocke), dnkSeg, 0.0105, q(5), false);
  const dnkMat = mat(0xb08af0, { roughness: 0.4, clearcoat: 0.7 });
  const dnk = new THREE.Mesh(dnkGeo, dnkMat);

  // ---------- vrat z ovratnikom in brčicami ----------
  const yP = VR[BOT].y;
  const vg = [palica(V(0, yP + 0.01, 0), V(0, yP - 0.05, 0), 0.042, q(16), 0.05), new THREE.CylinderGeometry(0.085, 0.08, 0.014, q(24)).translate(0, yP - 0.035, 0)];
  for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2 + 0.3; vg.push(palica(V(Math.cos(a) * 0.075, yP - 0.035, Math.sin(a) * 0.075), V(Math.cos(a) * 0.15, yP + 0.02, Math.sin(a) * 0.15), 0.0045, q(5))); }
  const vrat = new THREE.Mesh(zdruzi(vg), mat(0x7f97c4, { roughness: 0.4, clearcoat: 0.7 }));

  // ---------- repna cevka ----------
  const yN = yP - 0.05, yB = -0.47, CEV = 0.484;
  const cevka = new THREE.Mesh(zdruzi([new THREE.CylinderGeometry(0.025, 0.025, CEV, q(16), 1).translate(0, yN - CEV / 2, 0), new THREE.CylinderGeometry(0.025, 0.012, 0.025, q(16), 1).translate(0, yN - CEV - 0.0125, 0)]), mat(0xe6edf5, { roughness: 0.3, clearcoat: 0.9 }));

  const glavaG = new THREE.Group();
  for (const m of [glava, glavaIn, glavaPok, dnk]) m.position.y = YH;
  glavaG.add(glava, glavaIn, glavaPok, dnk, vrat, cevka);
  vrat.position.y = YH; cevka.position.y = YH;
  group.add(glavaG);

  // ---------- krčljivi plašč: 24 obročev po 6 podenot ----------
  const pod = [];
  for (let k = 0; k < 6; k++) { const a = (k / 6) * Math.PI * 2; pod.push(new THREE.SphereGeometry(1, q(10), q(7)).scale(0.026, 0.0125, 0.03).rotateY(-a).translate(Math.cos(a) * 0.046, 0, Math.sin(a) * 0.046)); }
  const NO = 24;
  const plasc = new THREE.InstancedMesh(zdruzi(pod), mat(0x5fb3a3, { roughness: 0.38, clearcoat: 0.8 }), NO);
  group.add(plasc);

  // ---------- bazalna plošča ----------
  const bg = [new THREE.CylinderGeometry(0.15, 0.125, 0.06, 6, 1).rotateY(Math.PI / 2 - Math.atan2(KAM.z, KAM.x) - Math.PI / 6).translate(0, yB - 0.03, 0), new THREE.CylinderGeometry(0.055, 0.045, 0.03, q(16)).translate(0, yB - 0.07, 0)];
  const bb = [0xc9796a, 0xa85c50];
  const vog = [];
  const aK = Math.atan2(KAM.z, KAM.x);
  for (let k = 0; k < 6; k++) { const a = aK + Math.PI / 6 + (k / 6) * Math.PI * 2; vog.push(a); bg.push(krogla(V(Math.cos(a) * 0.14, yB - 0.03, Math.sin(a) * 0.14), 0.028)); bb.push(0xd98c7a); }
  const plosca = new THREE.Mesh(zdruzi(bg, bb), mat(0xffffff, { vertexColors: true, roughness: 0.42, clearcoat: 0.7 }));
  group.add(plosca);

  // ---------- repna vlakna ----------
  const YS = -0.565; // vrh bakterijske stene
  const dv = [], kv = [], vlT = [];
  for (const a of vog) {
    const c = Math.cos(a), s = Math.sin(a);
    const p0 = V(c * 0.15, yB - 0.025, s * 0.15), p1 = V(c * 0.42, -0.3, s * 0.42), p2 = V(c * 0.6, YS + 0.012, s * 0.6);
    dv.push(palica(p0, p1, 0.0095, q(8)), palica(p1, p2, 0.0085, q(8), 0.0075), krogla(p1, 0.016), krogla(p2, 0.017));
    vlT.push(p1);
    const k0 = V(c * 0.11, yB - 0.06, s * 0.11), k1 = V(c * 0.17, YS + 0.008, s * 0.17);
    kv.push(palica(k0, k1, 0.01, q(7)), krogla(k1, 0.013, q(8), q(6)));
  }
  const dolga = new THREE.Mesh(zdruzi(dv), mat(0xd9c27a, { roughness: 0.4, clearcoat: 0.6 }));
  const kratka = new THREE.Mesh(zdruzi(kv), mat(0xb58a5a, { roughness: 0.45, clearcoat: 0.5 }));
  group.add(dolga, kratka);

  // ---------- košček bakterijske stene: zunanja membrana, peptidoglikan, celična membrana ----------
  // košček stene je prerezan: izrezan klin proti gledalcu pokaže plasti, cevko in DNK v bakteriji
  const fiK = Math.atan2(KAM.x, KAM.z), KLIN = 0.44, fi0 = fiK + KLIN, fiL = Math.PI * 2 - 2 * KLIN;
  function plast(y0, y1, R, barva, hrapav) {
    const pr = [], nR = q(14);
    for (let i = 0; i <= nR; i++) pr.push(new THREE.Vector2((i / nR) * (R - 0.012), y1));
    pr.push(new THREE.Vector2(R, y1 - 0.006), new THREE.Vector2(R + 0.004, (y0 + y1) / 2), new THREE.Vector2(R, y0 + 0.006));
    for (let i = nR; i >= 0; i--) pr.push(new THREE.Vector2((i / nR) * (R - 0.012), y0));
    const deli2 = [new THREE.LatheGeometry(pr, q(60), fi0, fiL)];
    for (const fi of [fi0, fi0 + fiL]) {
      const sx = Math.sin(fi), sz = Math.cos(fi), pari = [];
      for (let i = 0; i <= nR; i++) { const r = (i / nR) * (R - 0.004); pari.push([V(r * sx, y1, r * sz), V(r * sx, y0, r * sz)]); }
      deli2.push(trak(pari, V(sz, 0, -sx).multiplyScalar(fi === fi0 ? -1 : 1)));
    }
    const g = zdruzi(deli2);
    deformiraj(g, (v) => {
      const a = Math.atan2(v.z, v.x), rr = Math.hypot(v.x, v.z);
      const f = 1 + 0.05 * sum(Math.cos(a) * 2.5 + 7, Math.sin(a) * 2.5, y0 * 3) * Math.min(1, rr / R);
      v.x *= f; v.z *= f;
      if (hrapav && v.y > (y0 + y1) / 2) v.y += hrapav * sum(v.x * 40, 3, v.z * 40);
    });
    return new THREE.Mesh(g, mat(barva, { roughness: 0.45, clearcoat: 0.6, sheen: 0.4, side: THREE.DoubleSide }));
  }
  const zun = plast(-0.605, YS, 0.68, 0xd88aa2, 0.006);
  const pg = plast(-0.645, -0.615, 0.66, 0xc8a66e, 0.003);
  const memB = plast(-0.72, -0.68, 0.64, 0xe3a3b8, 0.004);
  group.add(zun, pg, memB);

  // DNK v bakteriji (raste med vbrizgavanjem)
  const YT = -0.75; // konica cevke po krčenju (tik pod celično membrano)
  const CB = V(KAM.x, 0, KAM.z).normalize().multiplyScalar(0.2).setY(-0.85);
  const vp = [V(0, YT + 0.02, 0), V(0, YT - 0.03, 0)];
  let p = vp[1].clone(), d = V(KAM.x, -0.6, KAM.z).normalize();
  for (let i = 0; i < 70; i++) {
    d.add(nakl(1.1)).normalize();
    let q2 = p.clone().addScaledVector(d, 0.05);
    for (let t = 0; t < 8 && (((q2.x - CB.x) / 0.26) ** 2 + ((q2.y - CB.y) / 0.08) ** 2 + ((q2.z - CB.z) / 0.26) ** 2 > 1); t++) { d.add(CB.clone().sub(q2).multiplyScalar(4)).normalize(); q2 = p.clone().addScaledVector(d, 0.05); }
    vp.push(q2); p = q2;
  }
  const notSeg = q(700);
  const dnkB = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(vp), notSeg, 0.0095, q(5), false), dnkMat);
  group.add(dnkB);

  // ---------- deli ----------
  const okT = [...okno].map((i) => ploskve[i].map((j) => VR[j]).reduce((a, b) => a.clone().add(b), V()).multiplyScalar(1 / 3));
  const najT = okT.sort((a, b) => b.dot(KAM) - a.dot(KAM));
  del("glava", "Glava (kapsida)", "Beljakovinski ovoj v obliki podaljšanega dvajsetploskovca, zložen iz ponavljajočih se beljakovin (kapsomer); varuje DNK.", "#8fa9cf", [glava, glavaIn, glavaPok],
    najblizja(glava, (x) => x.y > YH + 0.12));
  const tDnk = { t: [0, YH - 0.02, 0] };
  del("dnk", "DNK", "Dedni zapis virusa: dolga dvojna vijačnica (okoli 169 000 parov baz), tesno navita v glavi; ob okužbi potuje skozi rep v bakterijo.", "#b08af0", [dnk, dnkB], tDnk.t);
  const dDnk = deli[deli.length - 1];
  del("vrat", "Vrat z ovratnikom", "Kratek vrat pod glavo, ki glavo povezuje z repom; na ovratniku so kratke brčice.", "#7f97c4", [vrat], [0.05, yP - 0.035 + YH, 0.07]);
  const dGl = deli[0], dVr = deli[deli.length - 1], tGl = dGl.tocka.slice(), tVr = dVr.tocka.slice();
  const dPlasc = { id: "plasc", ime: "Krčljivi plašč repa", opis: "Ovoj iz 24 obročev beljakovin okoli repne cevke; ob okužbi se skrči kot vzmet in potisne cevko skozi steno bakterije.", barva: "#5fb3a3", meshes: [plasc], tocka: [0, 0, 0] };
  plasc.userData.del = "plasc"; deli.push(dPlasc);
  const dCev = { id: "cevka", ime: "Repna cevka", opis: "Votla cevka v repu, skozi katero DNK potuje iz glave v bakterijo; vidna je, ko se plašč skrči.", barva: "#e6edf5", meshes: [cevka], tocka: [0, 0, 0] };
  cevka.userData.del = "cevka"; deli.push(dCev);
  del("bazalna-plosca", "Bazalna plošča", "Šesterokotna plošča na koncu repa; ko vlakna najdejo bakterijo, sproži krčenje plašča. Encim v njej načne steno bakterije.", "#c9796a", [plosca],
    V(Math.cos(aK) * 0.13, yB - 0.03, Math.sin(aK) * 0.13).toArray());
  const tv = V(Math.cos(vog[0]) * 0.51, (-0.3 + YS) / 2, Math.sin(vog[0]) * 0.51);
  del("dolga-vlakna", "Dolga repna vlakna", "Šest dolgih, v kolenu zalomljenih vlaken, s katerimi virus otipa bakterijo in prepozna njeno površino.", "#d9c27a", [dolga], tv.toArray());
  del("kratka-vlakna", "Kratka repna vlakna", "Kratka vlakna pod bazalno ploščo, ki virus trdno pripnejo na steno bakterije.", "#b58a5a", [kratka],
    V(Math.cos(vog[5]) * 0.16, YS + 0.012, Math.sin(vog[5]) * 0.16).toArray());
  del("stena-bakterije", "Celična stena bakterije", "Zunanja membrana in plast peptidoglikana bakterije E. coli, ki jo virus prebode z repno cevko.", "#d88aa2", [zun, pg], [Math.sin(fiK + 1.1) * 0.45, YS + 0.004, Math.cos(fiK + 1.1) * 0.45]);
  del("membrana-bakterije", "Celična membrana bakterije", "Notranja membrana bakterije; pod njo je citoplazma, kamor pride virusna DNK.", "#e3a3b8", [memB], [Math.sin(fiK + 0.55) * 0.3, -0.7, Math.cos(fiK + 0.55) * 0.3]);

  // ---------- vbrizgavanje ----------
  const L0 = YH + yN - yB, LK = 0.205, idxDnk = dnkGeo.index.count, idxB = dnkB.geometry.index.count, nRad = q(5) * 6;
  let v = 0;
  function nastavi(x) {
    v = Math.min(1, Math.max(0, +x || 0));
    const a = gladko(0, 0.5, v), dd = gladko(0.5, 1, v);
    const D = a * (L0 - LK), L = L0 - D;
    glavaG.position.y = -D;
    const rs = 1 + 0.36 * a;
    for (let i = 0; i < NO; i++) {
      o.position.set(0, yB + (i + 0.5) * (L / NO), 0);
      o.rotation.set(0, i * 0.3 + a * 0.6, 0);
      o.scale.set(rs, 1 - 0.55 * a, rs); o.updateMatrix(); plasc.setMatrixAt(i, o.matrix);
    }
    plasc.instanceMatrix.needsUpdate = true;
    const zac = Math.floor(dd * dnkSeg) * nRad;
    dnk.geometry.setDrawRange(zac, Math.max(0, idxDnk - zac));
    dnk.visible = zac < idxDnk;
    dnkB.geometry.setDrawRange(0, Math.floor(dd * notSeg) * nRad);
    dnkB.visible = dd > 0.005;
    dPlasc.tocka = [Math.cos(az + 2) * 0.07 * rs, yB + L * 0.6, Math.sin(az + 2) * 0.07 * rs].map((x) => Math.round(x * 1000) / 1000);
    dCev.tocka = (a > 0.3 ? [KAM.x * 0.03, -0.66, KAM.z * 0.03] : [0.02, yB + 0.05, 0.03]);
    const kj = dd < 0.995 ? dnkTocke[Math.min(dnkTocke.length - 1, Math.floor(dd * dnkTocke.length + dnkTocke.length * 0.02))] : null;
    dDnk.tocka = kj ? [kj.x, kj.y + YH - D, kj.z] : vp[Math.floor(vp.length / 2)].toArray();
    dGl.tocka = [tGl[0], tGl[1] - D, tGl[2]]; dVr.tocka = [tVr[0], tVr[1] - D, tVr[2]];
    deli = vsiDeli.filter((d) => d !== dCev || a > 0.05);
  }
  const vsiDeli = deli.slice();
  const faza = () => (v < 0.02 ? "Virus je pritrjen na bakterijo" : v < 0.5 ? "Plašč repa se krči, cevka prebija steno" : v < 0.98 ? "DNK potuje iz glave v bakterijo" : "Vsa DNK je v bakteriji, glava je prazna");
  const nadzor = [
    { tip: "drsnik", id: "vbrizgavanje", oznaka: "Vbrizgavanje", min: 0, max: 1, korak: 0.01, vrednost: 0, ob: nastavi },
    { tip: "izpis", id: "faza", oznaka: "Faza", vrednost: faza },
    { tip: "izbira", id: "prikaz", oznaka: "Glava", moznosti: [["odprta", "Z oknom"], ["zaprta", "Zaprta"]], vrednost: "odprta", ob: (x) => { glavaPok.visible = x === "zaprta"; } },
  ];
  if (zac.vbrizgavanje != null && isFinite(+zac.vbrizgavanje)) nadzor[0].vrednost = Math.min(1, Math.max(0, +zac.vbrizgavanje));
  if (zac.prikaz === "zaprta") { nadzor[2].vrednost = "zaprta"; glavaPok.visible = true; }
  nastavi(nadzor[0].vrednost);

  return {
    group,
    get deli() { return deli; },
    nadzor,
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
