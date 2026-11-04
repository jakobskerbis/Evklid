// Rastlinska celica v prerezu: celična stena, osrednja vakuola, jedro, kloroplasti (eden odprt), organeli.
// Pogodba graditelja: docs/3d.md. Brez uvozov; THREE pride od kompleta.

export const info = {
  id: "celica-rastlinska",
  naslov: "Rastlinska celica",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Celica iz lista, oblikovana kot kvader z zaobljenimi robovi (okoli 45 µm). Ima celično steno, kloroplaste in veliko osrednjo vakuolo; organelov je zaradi preglednosti manj kot v resnici, odprti kloroplast je povečan.",
  merilo: { m: 50e-6, oznaka: "50 µm" },
};

export function zgradi(THREE, ctx = {}) {
  let seme = 11;
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

  // ---------- oblika celice: zaobljen kvader (superelipsoid) ----------
  const sup = (a, b, c, p) => (d) => 1 / Math.pow(Math.pow(Math.abs(d.x) / a, p) + Math.pow(Math.abs(d.y) / b, p) + Math.pow(Math.abs(d.z) / c, p), 1 / p);
  const A = [0.92, 0.6, 0.6], P = 6, DS = 0.04; // stena ≈ 1 µm
  const valov = (d) => 1 + 0.008 * fbm(d.x * 2.2 + 5, d.y * 2.2, d.z * 2.2);
  const f0 = sup(A[0], A[1], A[2], P), f1 = sup(A[0] - DS, A[1] - DS, A[2] - DS, P), f2 = sup(A[0] - DS - 0.012, A[1] - DS - 0.012, A[2] - DS - 0.012, P);
  const fS = (d) => f0(d) * valov(d), fSn = (d) => f1(d) * valov(d), fM = (d) => f2(d) * valov(d);
  const notri = (p, m = 0) => { const l = p.length(); return l < 1e-6 || l < fSn(p.clone().divideScalar(l)) - m; };
  const izrezan = (p, m = 0.04) => p.x < m && p.y > -m && p.z > -m;

  // piknje (tanjša mesta v steni) s plazmodezmami
  const piknje = [];
  while (piknje.length < (hi ? 18 : 12)) {
    smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
    if (smer.lengthSq() > 1 || smer.lengthSq() < 0.1) continue;
    smer.normalize();
    const p = smer.clone().multiplyScalar(fS(smer));
    if (izrezan(p, 0.08) || piknje.some((x) => x.distanceTo(p) < 0.3)) continue;
    piknje.push(p);
  }

  // ---------- celična stena ----------
  const stena = lupina(fS, q(104), q(68));
  const temna = new THREE.Color(0x5f6230), svetla = new THREE.Color(0xc4bd7c), cS = new THREE.Color();
  const barvaStene = (v) => {
    const vl = 0.5 + 0.5 * fbm(v.x * 2.5, v.y * 26, v.z * 26); // vlakna celuloze vzdolž celice
    cS.copy(svetla).lerp(temna, 0.1 + 0.45 * vl * vl);
    let m = 9;
    for (const p of piknje) m = Math.min(m, p.distanceTo(v));
    if (m < 0.075) cS.lerp(temna, 0.55 * (1 - m / 0.075));
    return cS;
  };
  pobarvaj(stena.odprta, barvaStene);
  pobarvaj(stena.pokrov, barvaStene);
  const stenaMat = mat(0xffffff, { vertexColors: true, roughness: 0.62, clearcoat: 0.35, sheen: 0.3 });
  const stenaOut = new THREE.Mesh(stena.odprta, stenaMat);
  // prerez stene: temna srednja lamela (lepilo med sosednjima celicama) in plasti celuloznih vlaken
  const stenaRez = new THREE.Mesh(prerezPlasti(fS, fSn, q(90), [[0, 0.12, 0x7d6c34], [0.12, 0.55, 0xd8c78f], [0.55, 1, 0xc6b475]]), mat(0xffffff, { vertexColors: true, roughness: 0.78, clearcoat: 0.15, side: THREE.DoubleSide }));
  const pokrov = new THREE.Mesh(stena.pokrov, stenaMat);
  pokrov.visible = false;
  group.add(stenaOut, stenaRez, pokrov);
  del("celicna-stena", "Celična stena", "Trdna, a prepustna plast iz celuloze zunaj membrane; celico ščiti, ji daje obliko in preprečuje, da bi ob vpijanju vode počila.", "#b9a46a", [stenaOut, stenaRez, pokrov], [0.45, -0.25, 0.62]);

  // plazmodezme: kanalčki skozi steno v piknjah (na površini in v prerezu stene)
  const nPl = piknje.length * 9;
  const plMat = mat(0x3d3a1c, { roughness: 0.7, clearcoat: 0.1 });
  const plaz = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.0075, 0.0075, 0.016, q(8), 1), plMat, nPl);
  const gor = V(0, 1, 0);
  let k = 0;
  for (const c of piknje) {
    const n = c.clone().normalize();
    const t1 = V().crossVectors(n, Math.abs(n.y) < 0.9 ? gor : V(1, 0, 0)).normalize(), t2 = V().crossVectors(n, t1);
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + rnd(), r = i === 0 ? 0 : 0.018 + rnd() * 0.022;
      const p = c.clone().addScaledVector(t1, Math.cos(a) * r).addScaledVector(t2, Math.sin(a) * r);
      const d = p.clone().normalize();
      p.copy(d).multiplyScalar(fS(d) - 0.004);
      o.position.copy(p); o.quaternion.setFromUnitVectors(gor, d); o.scale.set(1, 1, 1); o.updateMatrix();
      plaz.setMatrixAt(k++, o.matrix);
    }
  }
  group.add(plaz);
  // v prerezu stene: temne črtice čez debelino stene
  const kan = [];
  LOKI.forEach(([L, n], li) => {
    for (const t0 of [0.3, 0.72]) {
      for (let i = 0; i < 5; i++) {
        const d = L(t0 + (i - 2) * 0.012 + li * 0.03).normalize();
        const a = d.clone().multiplyScalar(fSn(d) - 0.002), b = d.clone().multiplyScalar(fS(d) + 0.002);
        const g = new THREE.CylinderGeometry(0.0035, 0.0035, a.distanceTo(b), 6, 1);
        g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(gor, d));
        const s = a.clone().add(b).multiplyScalar(0.5).addScaledVector(n, 0.003);
        g.translate(s.x, s.y, s.z);
        kan.push(g);
      }
    }
  });
  const kanali = new THREE.Mesh(zdruzi(kan), plMat);
  group.add(kanali);
  const pkT = piknje.reduce((a, p) => (p.z * 1.2 - p.x * 0.5 + p.y * 0.4 > a.z * 1.2 - a.x * 0.5 + a.y * 0.4 ? p : a), piknje[0]);
  del("plazmodezme", "Piknje s plazmodezmami", "Tanjša mesta v celični steni s kanalčki (plazmodezmami), skozi katere je citoplazma povezana s sosednjimi celicami.", "#3d3a1c", [plaz, kanali], pkT.clone().multiplyScalar(1.01).toArray());

  // ---------- celična membrana in citoplazma ----------
  const memMat = mat(0xd88aa2, { roughness: 0.3, clearcoat: 1, side: THREE.DoubleSide });
  const memRez = new THREE.Mesh(prerezPlasti(fSn, fM, q(90), DVOSLOJ(0xb4587c, 0xf4d9c4)), mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide }));
  const memRob = new THREE.Mesh(rob(fM, 0.0025, q(60)), memMat);
  const lupM = lupina(fM, q(104), q(68));
  lupM.pokrov.dispose();
  const citIn = new THREE.Mesh(lupM.odprta, mat(0xe1dfae, { roughness: 0.75, clearcoat: 0.1, sheen: 0.25, side: THREE.BackSide }));
  group.add(memRez, memRob, citIn);
  del("membrana", "Celična membrana", "Prožna plast iz dveh plasti fosfolipidov tik ob celični steni (v prerezu tanjša od stene); uravnava, katere snovi vstopajo v celico in iz nje. Debelina je povečana.", "#d88aa2", [memRez, memRob],
    V(-0.62, 0.5, 0).normalize().multiplyScalar(0.001).add(LOKI[1][0](0.45).normalize().multiplyScalar(fM(LOKI[1][0](0.45).normalize()))).toArray());
  del("citoplazma", "Citoplazma", "Želatinasta tekočina med membrano in vakuolo; v njej so organeli in poteka veliko kemijskih reakcij.", "#e1dfae", [citIn], [-0.62, -0.3, -0.42]);

  // ---------- jedro (ob strani, ker ga vakuola potisne k steni) ----------
  const N = V(-0.56, 0.07, -0.2), RN = 0.17;

  // ---------- osrednja vakuola ----------
  const CV = V(0.16, 0, 0), AV = [0.6, 0.43, 0.43], PV = 3.2;
  const smax = (a, b, s = 24) => Math.log(Math.exp(a * s) + Math.exp(b * s)) / s;
  const Fv = (p) => {
    const e = Math.pow(Math.pow(Math.abs(p.x - CV.x) / AV[0], PV) + Math.pow(Math.abs(p.y - CV.y) / AV[1], PV) + Math.pow(Math.abs(p.z - CV.z) / AV[2], PV), 1 / PV);
    return smax(e, (RN + 0.05) / Math.max(0.01, p.distanceTo(N)));
  };
  const pv = V();
  const fV0 = (d) => { let lo = 0, hi2 = 1.1; for (let i = 0; i < 26; i++) { const m = (lo + hi2) / 2; if (Fv(pv.copy(d).multiplyScalar(m)) < 1) lo = m; else hi2 = m; } return lo; };
  const fV = (d) => fV0(d) * (1 + 0.022 * fbm(d.x * 3 + 1, d.y * 3, d.z * 3));
  const fVn = (d) => fV(d) - 0.01;
  const vak = lupina(fV, q(84), q(56));
  vak.pokrov.dispose();
  const tonMat = mat(0x7fd3e3, { roughness: 0.22, clearcoat: 1, sheen: 0.4, transmission: 0 });
  const vakOut = new THREE.Mesh(vak.odprta, tonMat);
  const vakIn = new THREE.Mesh(vak.odprta.clone().scale(0.982, 0.982, 0.982), mat(0xc6eef4, { roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.1, sheen: 0.2, side: THREE.BackSide }));
  const vakRob = new THREE.Mesh(prerezPlasti(fV, (d) => fV(d) * 0.982, q(70), DVOSLOJ(0x3f9fb3, 0xd8f4f7)), mat(0xffffff, { vertexColors: true, roughness: 0.4, clearcoat: 0.6, side: THREE.DoubleSide }));
  group.add(vakOut, vakIn, vakRob);
  del("vakuola", "Osrednja vakuola", "Velik mehur s celičnim sokom (voda, sladkorji, soli, barvila); zavzema večino celice in jo s pritiskom vode drži napeto.", "#c6eef4", [vakIn], [-0.05, 0.12, -0.3]);
  const tT = LOKI[2][0](0.55).normalize();
  del("tonoplast", "Tonoplast (membrana vakuole)", "Membrana, ki obdaja osrednjo vakuolo in uravnava prehod snovi med citoplazmo in celičnim sokom.", "#7fd3e3", [vakOut, vakRob], tT.multiplyScalar(fVn(tT)).toArray());
  const vVak = (p, m) => Fv(p) < 1 + m;
  const ovira = (x) => !notri(x) || Fv(x) < 1 || x.distanceTo(N) < RN;

  // ---------- jedro ----------
  const oblJ = (d) => RN * (1 + 0.04 * sum(d.x * 2 + 9, d.y * 2, d.z * 2));
  const jl = lupina(oblJ, q(56), q(36));
  const jMat = mat(0x7a68d8, { roughness: 0.34 });
  const jOut = new THREE.Mesh(jl.odprta, jMat);
  const jIn = new THREE.Mesh(jl.odprta.clone().scale(0.93, 0.93, 0.93), mat(0xb9a8ff, { roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide }));
  // dvojna jedrna ovojnica v prerezu: dve membrani s presledkom
  const jRob = new THREE.Mesh(prerezPlasti(oblJ, (d) => oblJ(d) * 0.93, q(40), [[0, 0.32, 0x5a46b8], [0.32, 0.68, 0xd9cffb], [0.68, 1, 0x5a46b8]]), mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide }));
  const jPokrov = new THREE.Mesh(jl.pokrov, jMat);
  jPokrov.visible = false;
  for (const m of [jOut, jIn, jRob, jPokrov]) m.position.copy(N);
  group.add(jOut, jIn, jRob, jPokrov);
  const nPor = hi ? 60 : 36;
  const pore = new THREE.InstancedMesh(new THREE.TorusGeometry(0.0065, 0.0026, 4, q(10)), mat(0x5440b0, { roughness: 0.5 }), nPor);
  k = 0;
  while (k < nPor) {
    smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
    if (smer.lengthSq() > 1 || smer.lengthSq() < 0.05) continue;
    smer.normalize();
    if (vIzrezu(smer)) continue;
    o.position.copy(smer).multiplyScalar(oblJ(smer) * 1.004).add(N);
    o.quaternion.setFromUnitVectors(V(0, 0, 1), smer); o.updateMatrix();
    pore.setMatrixAt(k++, o.matrix);
  }
  group.add(pore);
  del("jedro", "Jedro", "Največji organel; hrani DNK z navodili za delovanje celice. Obdaja ga jedrna ovojnica s porami.", "#7a68d8", [jOut, jRob, jPokrov, pore], [N.x - 0.1, N.y + 0.12, N.z + 0.13]);
  const kromGeo = [];
  for (let i = 0; i < (hi ? 12 : 7); i++) {
    const pts = [];
    let p = nakl(RN * 1.1);
    for (let s = 0; s < 8; s++) {
      p = p.clone().add(nakl(0.06));
      if (p.length() > RN * 0.8) p.multiplyScalar(0.7);
      pts.push(p);
    }
    kromGeo.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), q(28), 0.0045, q(5), false));
  }
  const krom = new THREE.Mesh(zdruzi(kromGeo), mat(0x4b3aa6, { roughness: 0.55, clearcoat: 0.4 }));
  krom.position.copy(N);
  group.add(krom);
  del("kromatin", "Kromatin", "Dolge niti DNK, navite na beljakovine; pred delitvijo celice se zgostijo v kromosome.", "#4b3aa6", [krom], [N.x - 0.04, N.y + 0.05, N.z + 0.1]);
  const jcGeo = deformiraj(new THREE.SphereGeometry(0.055, q(28), q(20)), (v) => v.multiplyScalar(1 + 0.12 * fbm(v.x * 40, v.y * 40, v.z * 40)));
  const jedrce = new THREE.Mesh(jcGeo, mat(0x34268a, { roughness: 0.6, clearcoat: 0.3 }));
  jedrce.position.set(N.x - 0.03, N.y + 0.02, N.z + 0.03);
  group.add(jedrce);
  del("jedrce", "Jedrce", "Gosto območje v jedru, kjer nastajajo deli ribosomov.", "#34268a", [jedrce], jedrce.position.toArray());

  // ---------- endoplazemski retikulum (listi okoli jedra) ----------
  const erGeo = [], erTocke = [];
  for (let s = 0; s < 3; s++) {
    const rr = RN + 0.045 + s * 0.04;
    const g = new THREE.SphereGeometry(rr, q(48), q(22), Math.PI * 1.12, Math.PI * 0.95, Math.PI * 0.32, Math.PI * 0.5);
    deformiraj(g, (v, i) => {
      const d = v.clone().normalize();
      v.multiplyScalar(1 + 0.08 * Math.sin(d.x * 13 + s) * Math.cos(d.y * 10 - s * 2));
      if (i % 4 === 0) erTocke.push(v.clone().add(N));
    });
    erGeo.push(g);
  }
  const er = new THREE.Mesh(zdruzi(erGeo), mat(0x5b8fe0, { roughness: 0.45, side: THREE.DoubleSide }));
  er.position.copy(N);
  group.add(er);
  del("er", "Endoplazemski retikulum", "Sistem membranskih listov in cevk ob jedru; na zrnatem ER ribosomi izdelujejo beljakovine, gladki ER izdeluje maščobe.", "#5b8fe0", [er], [N.x - 0.02, N.y - 0.06, N.z - RN - 0.08]);

  // ---------- Golgijev aparat ----------
  const golGeo = [];
  for (let i = 0; i < 5; i++) {
    const t = new THREE.TorusGeometry(0.11 - i * 0.01, 0.0075, q(8), q(36), Math.PI * (0.78 - i * 0.05));
    t.scale(1, 1, 3.2); t.rotateZ(Math.PI * (0.11 + i * 0.025));
    golGeo.push(t);
  }
  for (let i = 0; i < 7; i++) {
    const a = rnd() * Math.PI * 0.9, rr = 0.085 + rnd() * 0.05;
    const s = new THREE.SphereGeometry(0.01 + rnd() * 0.006, q(12), q(8));
    s.translate(Math.cos(a) * rr + 0.035, Math.sin(a) * rr, (rnd() - 0.5) * 0.05);
    golGeo.push(s);
  }
  const golgi = new THREE.Mesh(zdruzi(golGeo), mat(0xf2c94c, { roughness: 0.35 }));
  golgi.position.set(-0.71, 0.3, -0.13);
  golgi.rotation.set(-0.3, -0.5, 0.4);
  group.add(golgi);
  del("golgi", "Golgijev aparat", "Kup sploščenih mešičkov, ki dodela in razpošilja beljakovine; v rastlinski celici pripravlja tudi snovi za celično steno.", "#f2c94c", [golgi], [-0.69, 0.33, -0.08]);

  // ---------- odprt kloroplast (povečan) ----------
  const S = V(-0.44, 0.465, 0), KA = 0.128, KT = 0.04, KB = 0.088;
  const kMat = mat(0x3fae4f, { roughness: 0.35, clearcoat: 0.9 });
  const lec = (s) => deformiraj(new THREE.SphereGeometry(1, q(40), q(24), Math.PI, Math.PI), (v) => v.set(v.x * KA * s, v.y * KT * s, v.z * KB * s));
  const kOvoj = new THREE.Mesh(lec(1), kMat);
  const stroma = new THREE.Mesh(lec(0.93), mat(0xbfe39a, { roughness: 0.55, clearcoat: 0.3, side: THREE.BackSide }));
  const robK = [];
  for (const s of [1, 0.935]) {
    const pts = [];
    for (let i = 0; i <= 48; i++) { const a = (i / 48) * Math.PI * 2; pts.push(V(Math.cos(a) * KA * s, Math.sin(a) * KT * s, -0.001)); }
    robK.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), q(64), 0.0028, q(6), true));
  }
  const kRob = new THREE.Mesh(zdruzi(robK), kMat);
  // tilakoidi: grana (kupčki ploščic) in stromalni tilakoidi med njimi
  const til = [];
  const nG = 7;
  for (let g = 0; g < nG; g++) {
    const x = -KA * 0.72 + (g / (nG - 1)) * KA * 1.44, y0 = (g % 2 ? 0.006 : -0.006);
    const h = KT * 0.86 * Math.sqrt(Math.max(0, 1 - (x / KA) ** 2));
    const nP = Math.max(3, Math.min(8, Math.floor((h * 1.6) / 0.0062)));
    for (const z of [0, -0.05]) {
      for (let i = 0; i < nP; i++) {
        const c = new THREE.CylinderGeometry(0.0175, 0.0175, 0.0038, q(18), 1);
        c.translate(x + (z ? 0.012 : 0), y0 + (i - (nP - 1) / 2) * 0.0062, z === 0 ? -0.013 : z);
        til.push(c);
      }
    }
    if (g < nG - 1) {
      const x2 = -KA * 0.72 + ((g + 1) / (nG - 1)) * KA * 1.44;
      for (const dy of [-0.008, 0.007]) {
        const b = new THREE.BoxGeometry(x2 - x - 0.03, 0.0022, 0.045);
        b.rotateZ(dy * 3);
        b.translate((x + x2) / 2, (y0 + dy) * 0.9, -0.025);
        til.push(b);
      }
    }
  }
  const tila = new THREE.Mesh(zdruzi(til), mat(0x17863a, { roughness: 0.35, clearcoat: 0.8, sheen: 0.2, side: THREE.DoubleSide }));
  const skrob = new THREE.Mesh(deformiraj(new THREE.SphereGeometry(1, q(16), q(12)), (v) => v.set(v.x * 0.02, v.y * 0.011, v.z * 0.016)), mat(0xf4f1e4, { roughness: 0.5, clearcoat: 0.2 }));
  skrob.position.set(0.07, -0.004, -0.03);
  const kloro = new THREE.Group();
  kloro.add(kOvoj, stroma, kRob, tila, skrob);
  kloro.position.copy(S);
  kloro.rotation.z = 0.05;
  group.add(kloro);

  // ---------- kloroplasti ob steni ----------
  const lecGeo = deformiraj(new THREE.SphereGeometry(1, q(18), q(10)), (v) => v.set(v.x * 0.095, v.y * 0.03, v.z * 0.064));
  const kz = new THREE.Color(0x45b553), kt = new THREE.Color(0x2a7d3a), kc = new THREE.Color();
  pobarvaj(lecGeo, (v) => kc.copy(kz).lerp(kt, Math.max(0, sum(v.x * 90, v.y * 90, v.z * 90)) * 0.9));
  const nK = hi ? 38 : 26;
  const kls = new THREE.InstancedMesh(lecGeo, mat(0xffffff, { vertexColors: true, roughness: 0.35, clearcoat: 0.9 }), nK);
  const grad = (p) => V(Math.sign(p.x) * Math.pow(Math.abs(p.x) / A[0], P - 1) / A[0], Math.sign(p.y) * Math.pow(Math.abs(p.y) / A[1], P - 1) / A[1], Math.sign(p.z) * Math.pow(Math.abs(p.z) / A[2], P - 1) / A[2]).normalize();
  const klPol = [];
  let posk = 0;
  k = 0;
  while (k < nK && posk++ < 20000) {
    smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
    if (smer.lengthSq() > 1 || smer.lengthSq() < 0.05) continue;
    smer.normalize();
    const p = smer.clone().multiplyScalar(fM(smer) - 0.045);
    if (izrezan(p, 0.07) || vVak(p, 0.12) || p.distanceTo(N) < RN + 0.1 || p.distanceTo(S) < 0.2 || p.distanceTo(golgi.position) < 0.14 || klPol.some((x) => x.distanceTo(p) < 0.15)) continue;
    const n = grad(p);
    o.position.copy(p).addScaledVector(n, -0.01); o.quaternion.setFromUnitVectors(gor, n);
    o.rotateY(rnd() * Math.PI); o.scale.setScalar(0.85 + rnd() * 0.3); o.updateMatrix();
    kls.setMatrixAt(k++, o.matrix);
    klPol.push(p);
  }
  kls.count = k;
  group.add(kls);
  del("kloroplast", "Kloroplast", "Zeleni organel s klorofilom, v katerem poteka fotosinteza: iz ogljikovega dioksida in vode z energijo svetlobe nastaneta glukoza in kisik.", "#3fae4f", [kls, kOvoj, kRob], [S.x + 0.1, S.y + 0.02, S.z - 0.02]);
  del("tilakoidi", "Tilakoidi in grana", "Sploščeni membranski mešički s klorofilom, zloženi v kupčke (grana); v njih svetloba sproži prvi del fotosinteze.", "#1f8a3a", [tila], [S.x - 0.035, S.y, S.z]);
  del("stroma", "Stroma", "Tekočina v kloroplastu okoli tilakoidov; v njej iz ogljikovega dioksida nastaja glukoza, ki se shrani kot škrobna zrna.", "#bfe39a", [stroma, skrob], [S.x + 0.075, S.y - 0.022, S.z - 0.03]);

  // ---------- mitohondriji ----------
  function mitohondrij() {
    const L = 0.05, r = 0.026, prof = [];
    for (let i = 0; i <= 12; i++) { const a = -Math.PI / 2 + (i / 12) * Math.PI; prof.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r + (a < 0 ? -L / 2 : L / 2))); }
    const zun = new THREE.LatheGeometry(prof, q(14), 0.5 * Math.PI, 1.45 * Math.PI);
    const not = new THREE.LatheGeometry(prof.map((p) => new THREE.Vector2(p.x * 0.86, p.y * 0.93)), q(14), 0.5 * Math.PI, 1.45 * Math.PI);
    const ix = not.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i]; ix[i] = ix[i + 2]; ix[i + 2] = t; }
    not.computeVertexNormals();
    const kr = [];
    for (let i = 0; i < 5; i++) {
      const y = -L / 2 - r * 0.4 + i * ((L + r * 0.8) / 4);
      const w = Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, Math.abs(y) - L / 2) / r, 2))) * r * 0.85;
      const c = new THREE.BoxGeometry(w * 1.5, 0.004, w * 1.6);
      c.translate(i % 2 ? w * 0.25 : -w * 0.25, y, 0);
      kr.push(c);
    }
    // ploskvi prereza na obeh robovih odprtine: zunanja membrana, medmembranski prostor, notranja membrana
    const rez = [], rezB = [];
    for (const a of [0.5 * Math.PI, 1.95 * Math.PI]) for (const [t0, t1, b] of [[0, 0.32, 0xc85a2a], [0.32, 0.62, 0xffe0c2], [0.62, 1, 0xf08a4a]]) {
      const pos = [], idx = [];
      prof.forEach((pt) => { for (const t of [t0, t1]) { const sx = 1 - 0.14 * t, sy = 1 - 0.07 * t; pos.push(pt.x * sx * Math.sin(a), pt.y * sy, pt.x * sx * Math.cos(a)); } });
      for (let i = 0; i < prof.length - 1; i++) { const j = i * 2; idx.push(j, j + 2, j + 1, j + 1, j + 2, j + 3); }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setIndex(idx); g.computeVertexNormals();
      rez.push(g); rezB.push(b);
    }
    return zdruzi([zun, not, ...kr, ...rez], [0xe8743b, 0xf5a96e, ...kr.map(() => 0xffc58a), ...rezB]);
  }
  const nMit = hi ? 12 : 8;
  const mit = new THREE.InstancedMesh(mitohondrij(), mat(0xffffff, { vertexColors: true, roughness: 0.38, side: THREE.DoubleSide }), nMit);
  const mitPol = [];
  posk = 0;
  k = 0;
  while (k < nMit && posk++ < 20000) {
    smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).multiplyScalar(0.9);
    if (!notri(smer, 0.06) || izrezan(smer, 0.05) || vVak(smer, 0.08) || smer.distanceTo(N) < RN + 0.07 || smer.distanceTo(S) < 0.17 || smer.distanceTo(golgi.position) < 0.13
      || klPol.some((x) => x.distanceTo(smer) < 0.1) || mitPol.some((x) => x.p.distanceTo(smer) < 0.12)) continue;
    mitPol.push({ p: smer.clone() });
    o.position.copy(smer); o.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); o.scale.setScalar(0.9 + rnd() * 0.3); o.updateMatrix();
    mit.setMatrixAt(k++, o.matrix);
  }
  mit.count = k;
  group.add(mit);
  const mitT = (mitPol.find((m) => vidna(m.p, ovira)) || mitPol[0]).p;
  del("mitohondrij", "Mitohondrij", "Pri celičnem dihanju iz glukoze in kisika pridobi energijo (ATP); potrebujejo ga tudi rastlinske celice.", "#e8743b", [mit], mitT.toArray());

  // ---------- ribosomi ----------
  const nRib = hi ? 700 : 400;
  const rib = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.0055, 0), mat(0x2b3f8f, { roughness: 0.6, clearcoat: 0.2 }), nRib);
  k = 0;
  for (; k < nRib * 0.35 && k < erTocke.length; k++) {
    const v = erTocke[(k * 7919) % erTocke.length].clone().sub(N).multiplyScalar(1.03).add(N);
    o.position.copy(v); o.rotation.set(0, 0, 0); o.scale.setScalar(1); o.updateMatrix(); rib.setMatrixAt(k, o.matrix);
  }
  posk = 0;
  while (k < nRib && posk++ < 200000) {
    smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
    if (!notri(smer, 0.02) || izrezan(smer, 0.0) || vVak(smer, 0.03) || smer.distanceTo(N) < RN + 0.02 || smer.distanceTo(S) < 0.14) continue;
    o.position.copy(smer); o.updateMatrix(); rib.setMatrixAt(k++, o.matrix);
  }
  rib.count = k;
  group.add(rib);
  del("ribosomi", "Ribosomi", "Drobna zrnca, ki po navodilih iz DNK sestavljajo beljakovine; nekateri prosto plavajo, drugi sedijo na zrnatem ER.", "#2b3f8f", [rib], [-0.75, 0.12, -0.1]);

  // ---------- nadzor ----------
  const nadzor = [
    {
      tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cela", "Cela celica"]], vrednost: "prerez",
      ob: (v) => { const cela = v === "cela"; pokrov.visible = cela; jPokrov.visible = cela; stenaRez.visible = memRez.visible = memRob.visible = !cela; kanali.visible = !cela; },
    },
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

  // Ploskev prereza plasti med zunanjo fZ in notranjo fN ploskvijo na treh ravninah izreza (x = 0, y = 0, z = 0).
  // pasovi [[t0, t1, barva], …] od zunaj (t = 0) navznoter (t = 1) pokažejo zgradbo plasti, npr. lipidni dvosloj.
  function prerezPlasti(fZ, fN, seg, pasovi) {
    const loki = [
      (t) => new THREE.Vector3(0, Math.cos(t * Math.PI / 2), Math.sin(t * Math.PI / 2)),
      (t) => new THREE.Vector3(-Math.sin(t * Math.PI / 2), Math.cos(t * Math.PI / 2), 0),
      (t) => new THREE.Vector3(-Math.cos(t * Math.PI / 2), 0, Math.sin(t * Math.PI / 2)),
    ];
    const pos = [], col = [], idx = [], c = new THREE.Color();
    for (const L of loki) for (const [t0, t1, barva] of pasovi) {
      c.set(barva);
      const off = pos.length / 3;
      for (let i = 0; i <= seg; i++) {
        const d = L(i / seg).normalize(), rz = fZ(d), rn = fN(d);
        for (const t of [t0, t1]) { const rr = rz + (rn - rz) * t; pos.push(d.x * rr, d.y * rr, d.z * rr); col.push(c.r, c.g, c.b); }
      }
      for (let i = 0; i < seg; i++) { const a = off + i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  // lipidni dvosloj: temni plasti glav fosfolipidov, svetlejša sredica iz repov
  function DVOSLOJ(glave, repi) { return [[0, 0.3, glave], [0.3, 0.7, repi], [0.7, 1, glave]]; }

  return {
    group,
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
