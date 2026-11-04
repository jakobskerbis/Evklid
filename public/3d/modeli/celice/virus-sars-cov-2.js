// Koronavirus SARS-CoV-2 v prerezu: lipidna ovojnica z beljakovinami S, M in E, v notranjosti nukleokapsida (N + RNK).
// Pogodba graditelja: docs/3d.md. Brez uvozov; THREE pride od kompleta.

export const info = {
  id: "virus-sars-cov-2",
  naslov: "Koronavirus SARS-CoV-2",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Virus, ki povzroča covid-19 (premer ovojnice okoli 90 nm). Model ima 30 konic S, toliko kot pravi virusi (ti jih imajo od okoli 25 do 40). Odrezan del pokaže nukleokapsido: RNK, ovito okoli beljakovin N.",
  merilo: { m: 140e-9, oznaka: "140 nm" },
};

export function zgradi(THREE, ctx = {}) {
  let seme = 67;
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

  // 1 enota = 70 nm
  const gor = V(0, 1, 0);
  const RE = 0.62, DB = 0.06; // ovojnica (premer ≈ 87 nm), lipidni dvosloj ≈ 4 nm
  const oblE = (d) => RE * (1 + 0.025 * fbm(d.x * 1.8 + 2, d.y * 1.8, d.z * 1.8) + 0.005 * sum(d.x * 9, d.y * 9, d.z * 9));
  const fN = (d) => oblE(d) - DB;

  // ---------- ovojnica ----------
  const ov = lupina(oblE, q(100), q(64));
  const ovMat = mat(0xd88aa2, { roughness: 0.35, clearcoat: 1, sheen: 0.6 });
  const ovOut = new THREE.Mesh(ov.odprta, ovMat);
  const lIn = lupina(fN, q(80), q(52));
  lIn.pokrov.dispose();
  const ovIn = new THREE.Mesh(lIn.odprta, mat(0xb86f8a, { roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide }));
  // prerez dvosloja: glave (rožnate) – repi (svetli) – glave
  const dv = zdruzi([rezR(oblE, (d) => oblE(d) - 0.016, q(70)), rezR((d) => oblE(d) - 0.016, (d) => oblE(d) - 0.044, q(70)), rezR((d) => oblE(d) - 0.044, fN, q(70))], [0xe59ab2, 0xf3e2b8, 0xe59ab2]);
  const ovRez = new THREE.Mesh(dv, mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide }));
  const ovPok = new THREE.Mesh(ov.pokrov, ovMat);
  ovPok.visible = false;
  group.add(ovOut, ovIn, ovRez, ovPok);

  // razpored po površini (zlati kot); tiste v odrezanem delu postavi na konec (vidne le pri celem virusu)
  const vRezu = (d) => d.x < 0.08 && d.y > -0.08 && d.z > -0.08;
  function povrsina(n, odmik, zamik = 0) {
    const out = [], rez = [], N2 = Math.round(n * 1.15);
    for (let i = 0; i < N2; i++) {
      const y = 1 - (2 * (i + 0.5)) / N2, r = Math.sqrt(1 - y * y), a = i * 2.39996 + zamik;
      const d = V(Math.cos(a) * r, y, Math.sin(a) * r).add(nakl(odmik)).normalize();
      (vRezu(d) ? rez : out).push(d);
    }
    return out.concat(rez);
  }
  const zunaj = (arr) => arr.filter((d) => !vRezu(d)).length;

  // ---------- beljakovina S: trimer s steblom in glavico ----------
  function konica() {
    const g = [], b = [];
    for (let k = 0; k < 3; k++) { // steblo: tri prepletene vijačnice (S2)
      const pts = [];
      for (let i = 0; i <= 10; i++) { const u = i / 10, a = (k / 3) * Math.PI * 2 + u * Math.PI * 1.6; pts.push(V(Math.cos(a) * 0.013, -0.015 + u * 0.15, Math.sin(a) * 0.013)); }
      g.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), q(11), 0.0085, q(5), false)); b.push(0xa8323a);
    }
    for (let k = 0; k < 3; k++) { // glavica: trije režnji (S1) in vezavne domene (RBD) na vrhu
      const a = (k / 3) * Math.PI * 2;
      g.push(deformiraj(new THREE.SphereGeometry(1, q(13), q(9)), (v) => { v.set(v.x * 0.044, v.y * 0.068, v.z * 0.044); v.x += Math.cos(a) * 0.035 * (1 + v.y * 4); v.z += Math.sin(a) * 0.035 * (1 + v.y * 4); v.y += 0.205; v.multiplyScalar(1 + 0.04 * sum(v.x * 60, v.y * 60, v.z * 60)); })); b.push(0xe0574a);
      g.push(new THREE.SphereGeometry(0.026, q(9), q(6)).translate(Math.cos(a + 0.6) * 0.045, 0.27, Math.sin(a + 0.6) * 0.045)); b.push(0xf3907a);
    }
    g.push(new THREE.CylinderGeometry(0.02, 0.026, 0.03, q(10)).translate(0, -0.01, 0)); b.push(0x8a2a32);
    return zdruzi(g, b);
  }
  const smS = povrsina(30, 0.12), nS0 = zunaj(smS);
  const sMat = mat(0xffffff, { vertexColors: true, roughness: 0.36, clearcoat: 0.8, sheen: 0.4 });
  const spike = new THREE.InstancedMesh(konica(), sMat, smS.length);
  const sPol = smS.map((d) => {
    const nagib = nakl(0.5); nagib.sub(d.clone().multiplyScalar(nagib.dot(d))); // nagib do ≈ 25°
    const os = d.clone().add(nagib).normalize();
    return { p: d.clone().multiplyScalar(oblE(d) - 0.012), os, f: rnd() * 6, t1: V().crossVectors(os, Math.abs(os.y) < 0.9 ? gor : V(1, 0, 0)).normalize(), vrt: rnd() * 6 };
  });
  const qa = new THREE.Quaternion(), qb = new THREE.Quaternion();
  function postaviS(t) {
    sPol.forEach((s, i) => {
      const nihaj = gib ? Math.sin(t * 0.9 + s.f) * 0.07 : 0;
      qb.setFromAxisAngle(s.t1, nihaj);
      qa.setFromUnitVectors(gor, s.os).premultiply(qb);
      o.position.copy(s.p); o.quaternion.copy(qa); o.rotateY(s.vrt); o.scale.setScalar(1); o.updateMatrix();
      spike.setMatrixAt(i, o.matrix);
    });
    spike.instanceMatrix.needsUpdate = true;
  }
  postaviS(0);
  spike.count = nS0;
  group.add(spike);

  // ---------- beljakovina M (dimeri) in E (peterni kanalčki) ----------
  const mGeo = zdruzi([new THREE.SphereGeometry(1, q(7), q(5)).scale(0.017, 0.012, 0.013).translate(-0.012, 0, 0), new THREE.SphereGeometry(1, q(7), q(5)).scale(0.017, 0.012, 0.013).translate(0.012, 0, 0)]);
  const smM = povrsina(hi ? 230 : 140, 0.03, 1.3).filter((d) => smS.every((s) => s.angleTo(d) > 0.09));
  const mProt = new THREE.InstancedMesh(mGeo, mat(0x9b7fd0, { roughness: 0.45, clearcoat: 0.6 }), smM.length);
  smM.forEach((d, i) => { o.position.copy(d).multiplyScalar(oblE(d) + 0.002); o.quaternion.setFromUnitVectors(gor, d); o.rotateY(rnd() * 6); o.scale.setScalar(1); o.updateMatrix(); mProt.setMatrixAt(i, o.matrix); });
  const nM0 = zunaj(smM);
  mProt.count = nM0;
  group.add(mProt);
  const eG = [];
  for (let k = 0; k < 5; k++) { const a = (k / 5) * Math.PI * 2; eG.push(new THREE.SphereGeometry(1, q(8), q(6)).scale(0.011, 0.02, 0.011).translate(Math.cos(a) * 0.016, 0.006, Math.sin(a) * 0.016)); }
  const smE = povrsina(12, 0.1, 2.7).filter((d) => smS.every((s) => s.angleTo(d) > 0.12));
  const eProt = new THREE.InstancedMesh(zdruzi(eG), mat(0x6cc47f, { roughness: 0.4, clearcoat: 0.7 }), smE.length);
  smE.forEach((d, i) => { o.position.copy(d).multiplyScalar(oblE(d)); o.quaternion.setFromUnitVectors(gor, d); o.updateMatrix(); eProt.setMatrixAt(i, o.matrix); });
  const nE0 = zunaj(smE);
  eProt.count = nE0;
  group.add(eProt);

  // ---------- nukleokapsida: kroglice iz beljakovin N, na katere je navita RNK ----------
  const RB = 0.085, nKr = hi ? 34 : 26;
  const kr = [];
  let p = V(0.15, -0.1, -0.15), posk = 0;
  kr.push(p.clone());
  while (kr.length < nKr && posk++ < 20000) {
    const c = p.clone().add(nakl(1).normalize().multiplyScalar(0.17 + rnd() * 0.03));
    if (c.length() > fN(c.clone().normalize()) - RB - 0.03 || (c.x < 0.05 && c.y > -0.05 && c.z > -0.05) || kr.some((x) => x.distanceTo(c) < 0.16)) { if (posk % 40 === 0) p = kr[Math.floor(rnd() * kr.length)].clone(); continue; }
    kr.push(c); p = c;
  }
  const kG = [];
  for (let k = 0; k < 7; k++) { const d = k === 6 ? V(0, 0, 0) : V(Math.cos(k * 1.047), (k % 2 ? 0.5 : -0.5), Math.sin(k * 1.047)).normalize(); kG.push(new THREE.SphereGeometry(1, q(9), q(7)).scale(0.04, 0.034, 0.04).translate(d.x * 0.05, d.y * 0.05, d.z * 0.05)); }
  const nMat = mat(0x5fa8d3, { roughness: 0.42, clearcoat: 0.6 });
  const nProt = new THREE.InstancedMesh(zdruzi(kG), nMat, kr.length);
  kr.forEach((c, i) => { o.position.copy(c); o.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6); o.scale.setScalar(0.9 + rnd() * 0.25); o.updateMatrix(); nProt.setMatrixAt(i, o.matrix); });
  group.add(nProt);
  // RNK: ovije se okoli vsake kroglice in nadaljuje do naslednje
  const rp = [];
  kr.forEach((c, i) => {
    const sl = kr[i + 1] || c.clone().add(V(0.05, 0.05, 0));
    const ax = sl.clone().sub(c).normalize(), u = V().crossVectors(ax, Math.abs(ax.y) < 0.9 ? gor : V(1, 0, 0)).normalize(), w = V().crossVectors(ax, u);
    for (let s = 0; s < 14; s++) {
      const a = (s / 14) * Math.PI * 3, h = (s / 14 - 0.5) * 0.08;
      rp.push(c.clone().addScaledVector(u, Math.cos(a) * (RB + 0.005)).addScaledVector(w, Math.sin(a) * (RB + 0.005)).addScaledVector(ax, h));
    }
  });
  const rnk = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rp), rp.length * 3, 0.0085, q(5), false), mat(0xffd36e, { roughness: 0.35, clearcoat: 0.8 }));
  group.add(rnk);

  // ---------- deli ----------
  const tS = sPol.slice(0, nS0).filter((s) => s.os.dot(KAM) > 0.45).sort((a, b) => a.p.y - b.p.y)[0] || sPol[0];
  const tM = smM.slice(0, nM0).filter((d) => d.dot(KAM) > 0.75)[0] || smM[0];
  const tE = smE.slice(0, nE0).filter((d) => d.y < -0.1).sort((a, b) => b.dot(KAM) - a.dot(KAM))[0] || smE[0];
  const tK = kr.filter((c) => vidna(c, (x) => x.length() > fN(x.clone().normalize()))).sort((a, b) => b.dot(KAM) - a.dot(KAM));
  del("ovojnica", "Ovojnica (lipidna membrana)", "Dvojna plast maščob, ki jo virus vzame celici, iz katere izide; vanjo so vgrajene virusne beljakovine.", "#d88aa2", [ovOut, ovIn, ovRez, ovPok],
    LOKI[1][0](0.55).normalize().multiplyScalar(RE - 0.02).toArray());
  del("beljakovina-s", "Beljakovina S (konica)", "Konice iz treh enakih verig; z njimi se virus pripne na receptor ACE2 na celicah dihal. Po njih je virus dobil ime korona (venec).", "#e0574a", [spike],
    tS.p.clone().addScaledVector(tS.os, 0.22).toArray());
  del("beljakovina-m", "Beljakovina M", "Najpogostejša beljakovina ovojnice; daje virusu obliko in povezuje ovojnico z nukleokapsido.", "#9b7fd0", [mProt], tM.clone().multiplyScalar(oblE(tM) + 0.01).toArray());
  del("beljakovina-e", "Beljakovina E", "Majhna beljakovina, ki v ovojnici tvori drobne kanalčke; pomaga pri sestavljanju in sproščanju novih virusov.", "#6cc47f", [eProt], tE.clone().multiplyScalar(oblE(tE) + 0.012).toArray());
  del("nukleokapsida", "Nukleokapsida (beljakovina N)", "Beljakovine N, ki se vežejo na RNK in jo zvijejo v kroglice; tako je dedni zapis zaščiten v notranjosti virusa.", "#5fa8d3", [nProt], (tK[0] || kr[0]).toArray());
  const r0 = tK[1] || kr[1];
  del("rnk", "RNK (dedni zapis)", "Ena dolga molekula RNK z okoli 30 000 nukleotidi; v okuženi celici se po njej izdelajo nove virusne beljakovine.", "#ffd36e", [rnk],
    rp.reduce((a, x) => (x.distanceTo(r0) < a.distanceTo(r0) && x.dot(KAM) > r0.dot(KAM) ? x : a), rp[0]).toArray());

  // ---------- nadzor ----------
  const nadzor = [
    { tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cel", "Cel virus"]], vrednost: "prerez", ob: (v) => { const c = v === "cel"; ovPok.visible = c; ovRez.visible = !c; spike.count = c ? smS.length : nS0; mProt.count = c ? smM.length : nM0; eProt.count = c ? smE.length : nE0; } },
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
    ovojnica: { tex: "zrna", rep: [30, 15], k: 0.3, lisa: 0.12, f: 3, sheen: 0.7, temni: 0.94, uv: "smer" },
    "beljakovina-s": { tex: "gube", rep: [2, 2], k: 0.35, ton: 0.4 },
    nukleokapsida: { tex: "fino", rep: [2, 1], k: 0.35 },
    rnk: { tex: null },
  });

  return {
    group,
    deli,
    nadzor,
    pogled: [-0.47, 0.34, 0.81],
    korak(t) {
      if (!gib) return;
      postaviS(t);
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
