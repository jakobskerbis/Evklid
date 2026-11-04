// Živalska in rastlinska celica druga ob drugi; izbira »Poudari« pokaže skupne dele in dele, ki jih ima le ena.
// Pogodba graditelja: docs/3d.md. Brez uvozov; THREE pride od kompleta.

export const info = {
  id: "celice-primerjava",
  naslov: "Živalska in rastlinska celica",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Poenostavljeni celici v istem merilu, obe v prerezu. Z izbiro »Poudari« vidiš, kateri deli so skupni in katere ima le živalska ali le rastlinska celica.",
  merilo: { m: 60e-6, oznaka: "60 µm" },
};

export function zgradi(THREE, ctx = {}) {
  let seme = 23;
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

  const mat1 = (barva, o2 = {}) => mat(barva, Object.assign({ forceSinglePass: true }, o2));
  const CZ = V(-0.433, 0, -0.25), CR = V(0.41, 0, 0.235); // središči živalske in rastlinske celice
  const izrezan = (p, c, m = 0.02) => p.x < c.x + m && p.y > c.y - m && p.z > c.z - m;
  const gor = V(0, 1, 0);
  const postavi = (mesh, c) => { mesh.position.copy(c); group.add(mesh); return mesh; };
  // skupine delov za »Poudari«
  const skup = {};
  function delS(sk, id, ime, opis, barva, meshes, tocka) { skup[id] = sk; del(id, ime, opis, barva, meshes, tocka); }

  // ================= ŽIVALSKA CELICA =================
  const RZ = 0.31;
  const oblZ = (d) => RZ * (1 + 0.035 * fbm(d.x * 1.6 + 3, d.y * 1.6, d.z * 1.6) - 0.02);
  const memZ = lupina(oblZ, q(84), q(52));
  const memMat = mat1(0xd88aa2, { roughness: 0.32, clearcoat: 1 });
  const memZOut = postavi(new THREE.Mesh(memZ.odprta, memMat), CZ);
  const citMat = mat1(0xf1c9b6, { roughness: 0.75, clearcoat: 0.1, sheen: 0.2, side: THREE.BackSide });
  const citZ = postavi(new THREE.Mesh(memZ.odprta.clone().scale(0.98, 0.98, 0.98), citMat), CZ);
  const memZRob = postavi(new THREE.Mesh(rob(oblZ, 0.007, q(36)), memMat), CZ);
  const memZPok = postavi(new THREE.Mesh(memZ.pokrov, memMat), CZ);
  memZPok.visible = false;

  // jedro (skupni del)
  const jMat = mat1(0x7a68d8, { roughness: 0.34 });
  const nukMat = mat1(0xb9a8ff, { roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide });
  const jcMat = mat1(0x34268a, { roughness: 0.6, clearcoat: 0.3 });
  function jedro(c, r) {
    const f = (d) => r * (1 + 0.04 * sum(d.x * 2 + 9, d.y * 2, d.z * 2));
    const l = lupina(f, q(48), q(32));
    l.pokrov.dispose();
    const out = postavi(new THREE.Mesh(l.odprta, jMat), c);
    const inn = postavi(new THREE.Mesh(l.odprta.clone().scale(0.95, 0.95, 0.95), nukMat), c);
    const rb = postavi(new THREE.Mesh(rob(f, 0.005, q(20)), jMat), c);
    const jc = postavi(new THREE.Mesh(deformiraj(new THREE.SphereGeometry(r * 0.33, q(20), q(14)), (v) => v.multiplyScalar(1 + 0.1 * fbm(v.x * 60, v.y * 60, v.z * 60))), jcMat), c.clone().add(V(-r * 0.25, r * 0.2, r * 0.2)));
    return { meshes: [out, inn, rb], jc };
  }
  const NZ = CZ.clone().add(V(0.02, -0.01, -0.03)), RNZ = 0.105;
  const jZ = jedro(NZ, RNZ);

  // ER (skupni): listi za jedrom
  const erMat = mat1(0x5b8fe0, { roughness: 0.45, side: THREE.DoubleSide });
  function erListi(c, r0, n, phi0, phiL) {
    const gs = [], tocke = [];
    for (let s = 0; s < n; s++) {
      const rr = r0 + s * 0.026;
      const g = new THREE.SphereGeometry(rr, q(36), q(16), phi0, phiL, Math.PI * 0.3, Math.PI * 0.45);
      deformiraj(g, (v, i) => { const d = v.clone().normalize(); v.multiplyScalar(1 + 0.07 * Math.sin(d.x * 14 + s) * Math.cos(d.y * 11 - s * 2)); if (i % 5 === 0) tocke.push(v.clone().add(c)); });
      gs.push(g);
    }
    return { m: postavi(new THREE.Mesh(zdruzi(gs), erMat), c), tocke };
  }
  const erZ = erListi(NZ, RNZ + 0.03, 3, Math.PI * 0.62, Math.PI * 1.15);

  // Golgi (skupni)
  const golMat = mat1(0xf2c94c, { roughness: 0.35 });
  function golgi(c, s, rot) {
    const gs = [];
    for (let i = 0; i < 5; i++) {
      const t = new THREE.TorusGeometry(0.1 - i * 0.009, 0.0068, q(8), q(32), Math.PI * (0.78 - i * 0.05));
      t.scale(1, 1, 3.2); t.rotateZ(Math.PI * (0.11 + i * 0.025)); gs.push(t);
    }
    for (let i = 0; i < 6; i++) {
      const a = rnd() * Math.PI * 0.9, rr = 0.08 + rnd() * 0.045;
      const sp = new THREE.SphereGeometry(0.009 + rnd() * 0.005, q(10), q(8));
      sp.translate(Math.cos(a) * rr + 0.03, Math.sin(a) * rr, (rnd() - 0.5) * 0.05); gs.push(sp);
    }
    const m = postavi(new THREE.Mesh(zdruzi(gs), golMat), c);
    m.scale.setScalar(s); m.rotation.set(...rot);
    return m;
  }
  const golZ = golgi(CZ.clone().add(V(-0.15, 0.11, 0.06)), 0.75, [-0.9, -0.5, 0.6]);

  // mitohondriji (skupni)
  function mitohondrij() {
    const L = 0.034, r = 0.017, prof = [];
    for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + (i / 10) * Math.PI; prof.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r + (a < 0 ? -L / 2 : L / 2))); }
    const zun = new THREE.LatheGeometry(prof, q(14), 0.5 * Math.PI, 1.45 * Math.PI);
    const not = new THREE.LatheGeometry(prof.map((p) => new THREE.Vector2(p.x * 0.86, p.y * 0.93)), q(14), 0.5 * Math.PI, 1.45 * Math.PI);
    const ix = not.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i]; ix[i] = ix[i + 2]; ix[i + 2] = t; }
    not.computeVertexNormals();
    const kr = [];
    for (let i = 0; i < 4; i++) {
      const y = -L / 2 - r * 0.3 + i * ((L + r * 0.6) / 3);
      const w = Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, Math.abs(y) - L / 2) / r, 2))) * r * 0.85;
      const c = new THREE.BoxGeometry(w * 1.5, 0.003, w * 1.6);
      c.translate(i % 2 ? w * 0.25 : -w * 0.25, y, 0); kr.push(c);
    }
    return zdruzi([zun, not, ...kr], [0xe8743b, 0xf5a96e, ...kr.map(() => 0xffc58a)]);
  }
  const mitMat = mat1(0xffffff, { vertexColors: true, roughness: 0.38, side: THREE.DoubleSide });
  const mitGeo = mitohondrij();
  function razporedi(n, test, kos) {
    const pts = [];
    let posk = 0;
    while (pts.length < n && posk++ < 40000) { const p = kos(); if (test(p) && !pts.some((x) => x.distanceTo(p) < 0.07)) pts.push(p); }
    return pts;
  }
  const vZ = (p, m) => p.distanceTo(CZ) < RZ - m;
  const prostZ = (p) => vZ(p, 0.05) && p.distanceTo(NZ) > RNZ + 0.06 && p.distanceTo(golZ.position) > 0.09 && !izrezan(p, CZ, 0.03);
  const kosZ = () => CZ.clone().add(nakl(2 * RZ));
  const mitZ = razporedi(hi ? 8 : 6, prostZ, kosZ);

  // lizosomi in centrosom (samo v živalski)
  const lizMat = mat1(0x7fcf6a, { roughness: 0.3 });
  const lizP = razporedi(hi ? 7 : 5, (p) => prostZ(p) && !mitZ.some((x) => x.distanceTo(p) < 0.06), kosZ);
  const liz = new THREE.InstancedMesh(new THREE.SphereGeometry(0.022, q(14), q(10)), lizMat, lizP.length);
  lizP.forEach((p, i) => { o.position.copy(p); o.rotation.set(0, 0, 0); o.scale.setScalar(0.8 + rnd() * 0.4); o.updateMatrix(); liz.setMatrixAt(i, o.matrix); });
  group.add(liz);
  function centriola() {
    const g = [];
    for (let i = 0; i < 9; i++) for (let t = 0; t < 3; t++) {
      const a = (i / 9) * Math.PI * 2 + t * 0.09, rr = 0.014 - t * 0.002;
      const c = new THREE.CylinderGeometry(0.002, 0.002, 0.05, q(5), 1);
      c.translate(Math.cos(a) * rr, 0, Math.sin(a) * rr); g.push(c);
    }
    return g;
  }
  const cent = postavi(new THREE.Mesh(zdruzi(centriola().concat(centriola().map((g) => g.rotateX(Math.PI / 2).translate(0, 0.024, 0.028)))), mat1(0x66d3f0, { roughness: 0.35 })), CZ.clone().add(V(-0.13, 0.03, 0.12)));
  cent.rotation.set(0.4, 0.3, 0.5);

  // ================= RASTLINSKA CELICA =================
  const sup = (a, b, c, p) => (d) => 1 / Math.pow(Math.pow(Math.abs(d.x) / a, p) + Math.pow(Math.abs(d.y) / b, p) + Math.pow(Math.abs(d.z) / c, p), 1 / p);
  const AR = [0.46, 0.32, 0.32], DS = 0.022;
  const val = (d) => 1 + 0.008 * fbm(d.x * 2.2 + 5, d.y * 2.2, d.z * 2.2);
  const g0 = sup(...AR, 6), g1 = sup(AR[0] - DS, AR[1] - DS, AR[2] - DS, 6), g2 = sup(AR[0] - DS - 0.008, AR[1] - DS - 0.008, AR[2] - DS - 0.008, 6);
  const fS = (d) => g0(d) * val(d), fSn = (d) => g1(d) * val(d), fM = (d) => g2(d) * val(d);
  const st = lupina(fS, q(92), q(60));
  const temna = new THREE.Color(0x5f6230), svetla = new THREE.Color(0xc4bd7c), cS = new THREE.Color();
  const barvaStene = (v) => { const vl = 0.5 + 0.5 * fbm(v.x * 4.5, v.y * 44, v.z * 44); return cS.copy(svetla).lerp(temna, 0.1 + 0.45 * vl * vl); };
  pobarvaj(st.odprta, barvaStene); pobarvaj(st.pokrov, barvaStene);
  const stMat = mat1(0xffffff, { vertexColors: true, roughness: 0.62, clearcoat: 0.35, sheen: 0.3 });
  const stOut = postavi(new THREE.Mesh(st.odprta, stMat), CR);
  const stRez = postavi(new THREE.Mesh(rezR(fS, fSn, q(70)), mat1(0xd8c78f, { roughness: 0.75, clearcoat: 0.15, side: THREE.DoubleSide })), CR);
  const stPok = postavi(new THREE.Mesh(st.pokrov, stMat), CR);
  stPok.visible = false;
  const memR = postavi(new THREE.Mesh(rezR(fSn, fM, q(70)), memMat), CR);
  const lupR = lupina(fM, q(92), q(60));
  lupR.pokrov.dispose();
  const memROut = postavi(new THREE.Mesh(lupR.odprta.clone(), memMat), CR);
  const citR = postavi(new THREE.Mesh(lupR.odprta.scale(0.985, 0.985, 0.985), citMat.clone()), CR);
  odpad.push(citR.material);
  citR.material.color.set(0xe1dfae);

  // jedro rastlinske celice ob strani
  const NR = CR.clone().add(V(-0.28, 0.05, -0.11)), RNR = 0.08;
  const jR = jedro(NR, RNR);
  const erR = erListi(NR, RNR + 0.025, 2, Math.PI * 1.12, Math.PI * 0.95);
  const golR = golgi(CR.clone().add(V(-0.35, 0.17, -0.08)), 0.55, [-0.3, -0.5, 0.4]);

  // osrednja vakuola (samo v rastlinski)
  const CV = V(0.07, 0, 0), AV = [0.3, 0.235, 0.235];
  const smax = (a, b, s = 24) => Math.log(Math.exp(a * s) + Math.exp(b * s)) / s;
  const NRl = NR.clone().sub(CR);
  const Fv = (p) => smax(Math.pow(Math.pow(Math.abs(p.x - CV.x) / AV[0], 3.2) + Math.pow(Math.abs(p.y) / AV[1], 3.2) + Math.pow(Math.abs(p.z) / AV[2], 3.2), 1 / 3.2), (RNR + 0.035) / Math.max(0.01, p.distanceTo(NRl)));
  const pv = V();
  const fV0 = (d) => { let lo = 0, h2 = 0.7; for (let i = 0; i < 24; i++) { const m = (lo + h2) / 2; if (Fv(pv.copy(d).multiplyScalar(m)) < 1) lo = m; else h2 = m; } return lo; };
  const fV = (d) => fV0(d) * (1 + 0.02 * fbm(d.x * 3 + 1, d.y * 3, d.z * 3));
  const vak = lupina(fV, q(72), q(48));
  vak.pokrov.dispose();
  const tonMat = mat1(0x7fd3e3, { roughness: 0.22, clearcoat: 1, sheen: 0.4 });
  const vakOut = postavi(new THREE.Mesh(vak.odprta, tonMat), CR);
  const vakIn = postavi(new THREE.Mesh(vak.odprta.clone().scale(0.985, 0.985, 0.985), mat1(0xc6eef4, { roughness: 0.15, clearcoat: 1, sheen: 0.2, side: THREE.BackSide })), CR);
  const vakRob = postavi(new THREE.Mesh(rob((d) => fV(d) - 0.006, 0.0045, q(56)), tonMat), CR);
  const vVak = (p, m) => Fv(p.clone().sub(CR)) < 1 + m;

  // kloroplasti ob steni (samo v rastlinski)
  const lecGeo = deformiraj(new THREE.SphereGeometry(1, q(18), q(10)), (v) => v.set(v.x * 0.068, v.y * 0.022, v.z * 0.046));
  const kz = new THREE.Color(0x45b553), kt = new THREE.Color(0x2a7d3a), kc = new THREE.Color();
  pobarvaj(lecGeo, (v) => kc.copy(kz).lerp(kt, Math.max(0, sum(v.x * 120, v.y * 120, v.z * 120)) * 0.9));
  const nKl = hi ? 26 : 18;
  const kls = new THREE.InstancedMesh(lecGeo, mat1(0xffffff, { vertexColors: true, roughness: 0.35, clearcoat: 0.9 }), nKl);
  const grad = (p) => V(Math.sign(p.x) * Math.pow(Math.abs(p.x) / AR[0], 5) / AR[0], Math.sign(p.y) * Math.pow(Math.abs(p.y) / AR[1], 5) / AR[1], Math.sign(p.z) * Math.pow(Math.abs(p.z) / AR[2], 5) / AR[2]).normalize();
  const klP = [];
  let posk = 0, k = 0;
  while (k < nKl && posk++ < 20000) {
    smer.set(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
    if (smer.lengthSq() > 1 || smer.lengthSq() < 0.05) continue;
    smer.normalize();
    const pl = smer.clone().multiplyScalar(fM(smer) - 0.032), p = pl.clone().add(CR);
    if (izrezan(p, CR, 0.05) || vVak(p, 0.1) || p.distanceTo(NR) < RNR + 0.07 || p.distanceTo(golR.position) < 0.09 || klP.some((x) => x.distanceTo(p) < 0.11)) continue;
    const n = grad(pl);
    o.position.copy(p); o.quaternion.setFromUnitVectors(gor, n); o.rotateY(rnd() * Math.PI); o.scale.setScalar(0.85 + rnd() * 0.3); o.updateMatrix();
    kls.setMatrixAt(k++, o.matrix); klP.push(p);
  }
  kls.count = k;
  group.add(kls);

  const vR = (p, m) => { const l = p.clone().sub(CR); const L = l.length(); return L < 1e-6 || L < fSn(l.divideScalar(L)) - m; };
  const prostR = (p) => vR(p, 0.04) && !vVak(p, 0.06) && p.distanceTo(NR) > RNR + 0.05 && p.distanceTo(golR.position) > 0.08 && !izrezan(p, CR, 0.03) && !klP.some((x) => x.distanceTo(p) < 0.07);
  const kosR = () => CR.clone().add(V((rnd() - 0.5) * 2 * AR[0], (rnd() - 0.5) * 2 * AR[1], (rnd() - 0.5) * 2 * AR[2]));
  const mitR = razporedi(hi ? 7 : 5, prostR, kosR);
  const mitP = mitZ.concat(mitR);
  const mit = new THREE.InstancedMesh(mitGeo, mitMat, mitP.length);
  mitP.forEach((p, i) => { o.position.copy(p); o.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); o.scale.setScalar(0.9 + rnd() * 0.3); o.updateMatrix(); mit.setMatrixAt(i, o.matrix); });
  group.add(mit);

  // ribosomi (skupni): na ER in prosti v obeh celicah
  const nRib = hi ? 900 : 480;
  const rib = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.0042, 0), mat1(0x2b3f8f, { roughness: 0.6, clearcoat: 0.2 }), nRib);
  k = 0;
  const erT = erZ.tocke.concat(erR.tocke);
  for (; k < nRib * 0.3 && k < erT.length; k++) { o.position.copy(erT[(k * 7919) % erT.length]); o.rotation.set(0, 0, 0); o.scale.setScalar(1); o.updateMatrix(); rib.setMatrixAt(k, o.matrix); }
  posk = 0;
  while (k < nRib && posk++ < 200000) {
    const z = k % 2 === 0, p = z ? kosZ() : kosR();
    if (z ? !(vZ(p, 0.015) && p.distanceTo(NZ) > RNZ + 0.01 && !izrezan(p, CZ, 0)) : !(vR(p, 0.01) && !vVak(p, 0.02) && p.distanceTo(NR) > RNR + 0.01 && !izrezan(p, CR, 0))) continue;
    o.position.copy(p); o.updateMatrix(); rib.setMatrixAt(k++, o.matrix);
  }
  rib.count = k;
  group.add(rib);

  // ================= DELI =================
  const vidZ = (x) => x.distanceTo(CZ) > RZ || (x.distanceTo(NZ) < RNZ);
  const prviVid = (pts, c, ov) => (pts.find((p) => vidna(p.clone().sub(c), (x) => ov(x.clone().add(c)))) || pts[0]).toArray();
  delS("skupni", "membrana", "Celična membrana", "Tanka prožna plast, ki obdaja vsako celico in odloča, katere snovi vstopijo vanjo in izstopijo iz nje.", "#d88aa2", [memZOut, memZRob, memZPok, memR, memROut], CZ.clone().add(V(0.12, -0.12, 0.26)).toArray());
  delS("skupni", "citoplazma", "Citoplazma", "Želatinasta tekočina, ki napolnjuje celico; v njej so organeli.", "#f1c9b6", [citZ, citR], CZ.clone().add(V(0.05, -0.22, -0.15)).toArray());
  delS("skupni", "jedro", "Jedro", "Hrani DNK z navodili za delovanje celice; imata ga obe celici.", "#7a68d8", [...jZ.meshes, ...jR.meshes], NZ.clone().add(V(-0.04, 0.08, 0.07)).toArray());
  delS("skupni", "jedrce", "Jedrce", "Gosto območje v jedru, kjer nastajajo deli ribosomov.", "#34268a", [jZ.jc, jR.jc], jZ.jc.position.toArray());
  delS("skupni", "er", "Endoplazemski retikulum", "Sistem membranskih listov in cevk, v katerem nastajajo beljakovine in maščobe.", "#5b8fe0", [erZ.m, erR.m], NZ.clone().add(V(0.08, 0.1, -0.08)).toArray());
  delS("skupni", "golgi", "Golgijev aparat", "Kup sploščenih mešičkov, ki dodela, zapakira in razpošlje beljakovine.", "#f2c94c", [golZ, golR], golZ.position.toArray());
  delS("skupni", "mitohondrij", "Mitohondrij", "Pri celičnem dihanju pridobi energijo (ATP) iz glukoze in kisika; imajo ga živalske in rastlinske celice.", "#e8743b", [mit], prviVid(mitZ, CZ, vidZ));
  delS("skupni", "ribosomi", "Ribosomi", "Drobna zrnca, ki sestavljajo beljakovine.", "#2b3f8f", [rib], CZ.clone().add(V(-0.12, 0.06, -0.1)).toArray());
  delS("zival", "lizosom", "Lizosom", "Mehurček s prebavnimi encimi, ki razgradi odslužene dele celice; značilen za živalske celice.", "#7fcf6a", [liz], prviVid(lizP, CZ, vidZ));
  delS("zival", "centrosom", "Centrosom s centriolama", "Par valjčkov iz mikrotubulov, ki pomaga pri delitvi živalske celice; rastlinske celice centriol nimajo.", "#66d3f0", [cent], cent.position.toArray());
  delS("rastl", "celicna-stena", "Celična stena", "Trdna plast iz celuloze zunaj membrane; rastlinsko celico ščiti in ji daje obliko. Živalske celice je nimajo.", "#b9a46a", [stOut, stRez, stPok], CR.clone().add(V(0.25, -0.15, 0.325)).toArray());
  const vidR = (x) => { const l = x.clone().sub(CR); const L = l.length(); return L > fSn(l.divideScalar(L)) || vVak(x, 0) || x.distanceTo(NR) < RNR; };
  delS("rastl", "kloroplast", "Kloroplast", "Zeleni organel, v katerem poteka fotosinteza; imajo ga le rastlinske celice.", "#3fae4f", [kls], prviVid(klP, CR, vidR));
  delS("rastl", "vakuola", "Osrednja vakuola", "Velik mehur s celičnim sokom, ki zavzema večino rastlinske celice in jo drži napeto; živalske celice imajo le majhne mehurčke.", "#7fd3e3", [vakOut, vakIn, vakRob], CR.clone().add(V(0.05, 0.08, -0.2)).toArray());

  // ================= NAPISA =================
  const napisi = [];
  if (typeof document !== "undefined") {
    for (const [t, c] of [["Živalska celica", CZ], ["Rastlinska celica", CR]]) {
      const cv = document.createElement("canvas");
      cv.width = 512; cv.height = 96;
      const c2 = cv.getContext("2d");
      if (!c2) continue;
      c2.font = "600 52px system-ui, sans-serif"; c2.textAlign = "center"; c2.textBaseline = "middle";
      c2.fillStyle = "#e8ecf4"; c2.fillText(t, 256, 50);
      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sm = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
      odpad.push(sm, tex);
      const sp = new THREE.Sprite(sm);
      sp.scale.set(0.5, 0.094, 1);
      sp.position.set(c.x, 0.45, c.z);
      group.add(sp);
      napisi.push(sp);
    }
  }

  // ================= POUDARI =================
  const temno = new THREE.Color(0x1a2130);
  const izvirne = new Map();
  for (const d of deli) for (const m of d.meshes) if (!izvirne.has(m.material)) izvirne.set(m.material, m.material.color.clone());
  const OPISI = {
    vse: "Vsi deli obeh celic",
    skupni: "Skupno: membrana, citoplazma, jedro, ER, Golgi, mitohondriji, ribosomi",
    zival: "Samo v živalski: lizosomi, centriole",
    rastl: "Samo v rastlinski: celična stena, kloroplasti, osrednja vakuola",
  };
  let poudari = "vse";
  function nastavi(v) {
    poudari = OPISI[v] ? v : "vse";
    for (const d of deli) {
      const ja = poudari === "vse" || skup[d.id] === poudari;
      for (const m of d.meshes) {
        const mt = m.material, c = izvirne.get(mt);
        mt.color.copy(c);
        if (!ja) mt.color.lerp(temno, 0.55);
        const prej = mt.transparent;
        mt.transparent = !ja;
        mt.opacity = ja ? 1 : 0.16;
        mt.depthWrite = ja;
        if (prej !== mt.transparent) mt.needsUpdate = true;
      }
    }
  }
  const nadzor = [
    {
      tip: "izbira", id: "poudari", oznaka: "Poudari",
      moznosti: [["vse", "Vse"], ["skupni", "Skupni deli"], ["zival", "Samo v živalski"], ["rastl", "Samo v rastlinski"]],
      vrednost: "vse", ob: nastavi,
    },
    { tip: "izpis", id: "kaj", oznaka: "Poudarjeno", vrednost: () => OPISI[poudari] },
    {
      tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["celi", "Celi celici"]], vrednost: "prerez",
      ob: (v) => { const c = v === "celi"; memZPok.visible = stPok.visible = c; memZRob.visible = stRez.visible = memR.visible = vakRob.visible = !c; },
    },
  ];
  if (zac.poudari) { nadzor[0].vrednost = zac.poudari; nastavi(zac.poudari); }
  if (zac.prikaz) { nadzor[2].vrednost = zac.prikaz; nadzor[2].ob(zac.prikaz); }

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
