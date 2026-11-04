// Jetrni režnjič: šesterokotni režnjič s centralno veno v sredini in portalnimi prostori (vejica portalne vene, vejica
// jetrne arterije, žolčni vod) v vogalih; vmes ploščice jetrnih celic in sinusoidi. Mere: Ross & Pawlina, Histology
// (8. izd.), Junqueira's Basic Histology (16. izd.), pogl. Jetra; viri v viri.json. Gradi se v µm. Pogodba: docs/3d.md.

export const info = {
  id: "organ-jetrni-reznjic",
  naslov: "Jetrni režnjič",
  podrocje: "organi",
  predmet: "BIO",
  opis: "Rezina jetrnega režnjiča, širokega slabih 0,7 mm. Kri teče iz vogalov po sinusoidih med ploščicami jetrnih celic proti centralni veni, žolč pa v nasprotni smeri proti žolčnim vodom v vogalih. Ploščic je manj in sinusoidi so širši kot v resnici.",
  poskusi: "Primerjaj smer rdečih in zelenih kapljic: kam teče kri in kam žolč?",
  merilo: { m: 800e-6, oznaka: "0,8 mm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const gib = ctx.gibanje !== false;
  const S = 1 / 400;
  const group = new THREE.Group();
  const svet = new THREE.Group();
  svet.scale.setScalar(S);
  group.add(svet);
  const U = (v) => [v.x * S, v.y * S, v.z * S].map((x) => Math.round(x * 1000) / 1000);
  const odpad = [];
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const o = new THREE.Object3D();
  let seme = 13;
  const rnd = () => ((seme = (seme * 16807) % 2147483647) - 1) / 2147483646;

  // ---------- orodja ----------
  function mat(barva, x = {}) {
    const c = new THREE.Color(barva);
    const m = new THREE.MeshPhysicalMaterial({
      color: c, roughness: 0.52, clearcoat: 0.35, clearcoatRoughness: 0.4,
      sheen: 0.5, sheenRoughness: 0.55, sheenColor: c.clone().lerp(new THREE.Color(0xffffff), 0.45), ...x,
    });
    odpad.push(m);
    return m;
  }
  // Ponovljiv gladek šum na [0, 1]² (vsota sinusov s celimi frekvencami).
  function valovi(s, k, fu, fv = fu) {
    seme = s;
    const w = [];
    for (let i = 0; i < k; i++) w.push([Math.round((rnd() - 0.5) * 2 * fu), Math.round((rnd() - 0.5) * 2 * fv) || 1, rnd() * 6.283, 0.4 + rnd()]);
    const vs = w.reduce((a, x) => a + x[3], 0);
    return (u, v) => w.reduce((a, [m, n, p, am]) => a + am * Math.sin(6.283 * (m * u + n * v) + p), 0) / vs;
  }
  function tekstura(n, f) {
    const d = new Uint8Array(n * n * 4);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const g = Math.max(0, Math.min(255, Math.round(f(i / n, j / n) * 255))), k = (j * n + i) * 4;
      d[k] = d[k + 1] = d[k + 2] = g; d[k + 3] = 255;
    }
    const t = new THREE.DataTexture(d, n, n, THREE.RGBAFormat);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.magFilter = THREE.LinearFilter;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.generateMipmaps = true;
    t.needsUpdate = true;
    odpad.push(t);
    return t;
  }
  function geo(pos, nor, uv, idx) {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    if (nor) g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv || new Array((pos.length / 3) * 2).fill(0), 2));
    g.setIndex(idx);
    if (!nor) g.computeVertexNormals();
    return g;
  }
  function zdruzi(geos) {
    const pos = [], nor = [], uv = [], idx = [];
    let off = 0;
    for (const g0 of geos) {
      const g = g0.index ? g0 : g0.toNonIndexed();
      const p = g.attributes.position, n = g.attributes.normal, t = g.attributes.uv;
      for (let k = 0; k < p.count; k++) {
        pos.push(p.getX(k), p.getY(k), p.getZ(k));
        nor.push(n.getX(k), n.getY(k), n.getZ(k));
        uv.push(t ? t.getX(k) : 0, t ? t.getY(k) : 0);
      }
      if (g.index) for (let k = 0; k < g.index.count; k++) idx.push(g.index.getX(k) + off);
      else for (let k = 0; k < p.count; k++) idx.push(k + off);
      off += p.count;
      g0.dispose();
    }
    return geo(pos, nor, uv, idx);
  }
  // Cev s spremenljivim polmerom r(t) po krivulji skozi točke; zaobljena konca.
  function cev(tocke, r, nSeg, nRad = hi ? 8 : 6) {
    const kr = new THREE.CatmullRomCurve3(tocke.map((p) => V(...p)));
    const fr = kr.computeFrenetFrames(nSeg, false), P = new THREE.Vector3();
    const pos = [], idx = [];
    for (let i = 0; i <= nSeg; i++) {
      kr.getPointAt(i / nSeg, P);
      const rr = typeof r === "function" ? r(i / nSeg) : r, N = fr.normals[i], B = fr.binormals[i];
      for (let j = 0; j < nRad; j++) {
        const a = (j / nRad) * 6.283, c = Math.cos(a) * rr, s = Math.sin(a) * rr;
        pos.push(P.x + c * N.x + s * B.x, P.y + c * N.y + s * B.y, P.z + c * N.z + s * B.z);
      }
    }
    for (let i = 0; i < nSeg; i++) for (let j = 0; j < nRad; j++) {
      const a = i * nRad + j, b = i * nRad + ((j + 1) % nRad);
      idx.push(a, b, a + nRad, b, b + nRad, a + nRad);
    }
    for (const [i, sg] of [[0, -1], [nSeg, 1]]) {
      kr.getPointAt(i / nSeg, P);
      const T = fr.tangents[i], rr = typeof r === "function" ? r(i / nSeg) : r, c = pos.length / 3;
      pos.push(P.x + T.x * rr * 0.7 * sg, P.y + T.y * rr * 0.7 * sg, P.z + T.z * rr * 0.7 * sg);
      for (let j = 0; j < nRad; j++) {
        const a = i * nRad + j, b = i * nRad + ((j + 1) % nRad);
        if (sg < 0) idx.push(c, b, a); else idx.push(c, a, b);
      }
    }
    return geo(pos, null, null, idx);
  }
  const kroglica = (x, y, z, rx, ry = rx, rz = rx, n = hi ? 14 : 9) => new THREE.SphereGeometry(1, n, Math.round(n * 0.7)).scale(rx, ry, rz).translate(x, y, z);
  // Vrtenina iz profila [[r, y], …] z barvo oglišč po višini (barva(y) → THREE.Color).
  function vrtenina(prof, n, barva) {
    const g = new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(Math.max(r, 0.01), y)), n);
    const p = g.attributes.position, col = [];
    for (let i = 0; i < p.count; i++) { const c = barva(p.getY(i)); col.push(c.r, c.g, c.b); }
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    return g;
  }

  const RH = 340, H = 96, Y1 = H / 2, Y0 = -H / 2; // polmer šesterokotnika (do vogala), višina rezine
  const RCV = 42, RTR = 64; // centralna vena, portalni prostor
  const VOG = [0, 1, 2, 3, 4, 5].map((k) => V(Math.cos((k * Math.PI) / 3 + Math.PI / 6) * RH, 0, Math.sin((k * Math.PI) / 3 + Math.PI / 6) * RH));
  const rHex = (a) => { const f = ((((a - Math.PI / 6) % (Math.PI / 3)) + Math.PI / 3) % (Math.PI / 3)) - Math.PI / 6; return (RH * Math.cos(Math.PI / 6)) / Math.cos(f); };
  const vTriadi = (x, z, m = 0) => VOG.some((c) => Math.hypot(x - c.x, z - c.z) < RTR + m);

  // ---------- materiali ----------
  const sum = valovi(4, 12, 6), sum2 = valovi(9, 16, 14);
  // vrh ploščic: meje celic vsakih 25 µm (u) in žolčni kanalček po sredini (v = 0,5)
  const celTex = tekstura(128, (u, v) => {
    const m = Math.min(u % 1, 1 - (u % 1));
    return (0.78 + 0.22 * Math.min(1, m * 14)) * (0.93 + 0.07 * sum2(u, v));
  });
  const stTex = tekstura(128, (u, v) => 0.86 + 0.08 * sum(u, v) + 0.06 * sum2(u, v));
  const M = {
    hep: mat(0xe2a07a, { map: celTex, bumpMap: celTex, bumpScale: 1.4, roughness: 0.55, clearcoat: 0.35 }),
    hepSt: mat(0xcf8a68, { map: stTex, bumpMap: stTex, bumpScale: 1.2, roughness: 0.55, clearcoat: 0.3 }),
    jedro: mat(0x6c4aa0, { roughness: 0.45, clearcoat: 0.6 }),
    sin: mat(0x8e2f3a, { roughness: 0.45, clearcoat: 0.6, emissive: 0x2a0508 }),
    zolc: mat(0x58b05a, { roughness: 0.35, clearcoat: 0.8 }),
    cv: mat(0x6a62bc, { roughness: 0.35, clearcoat: 0.8 }), cvL: mat(0x3a1f3a, { roughness: 0.7 }),
    pv: mat(0x7b72cc, { roughness: 0.35, clearcoat: 0.8 }), art: mat(0xd23c48, { roughness: 0.35, clearcoat: 0.8 }),
    vod: mat(0x4fa86a, { roughness: 0.4, clearcoat: 0.7 }), lumen: mat(0x2b1d24, { roughness: 0.8 }),
    vez: mat(0xd9a7a2, { bumpMap: stTex, bumpScale: 1.5, roughness: 0.6, clearcoat: 0.3 }),
    kupf: mat(0xf0d08a, { roughness: 0.45, clearcoat: 0.5 }),
    kri: mat(0xe0303c, { roughness: 0.3, clearcoat: 1, emissive: 0x400808 }), bil: mat(0x7ae07a, { roughness: 0.3, clearcoat: 1, emissive: 0x104010 }),
  };

  // ---------- ploščice jetrnih celic: valovite stene od centralne vene navzven, ki se razvejijo ----------
  const PLOSCE = [];
  for (let k = 0; k < 12; k++) PLOSCE.push({ a: (k / 12) * 6.283 + 0.13, r0: RCV + 4 });
  for (let k = 0; k < 12; k++) PLOSCE.push({ a: ((k + 0.5) / 12) * 6.283 + 0.13, r0: 105 });
  for (let k = 0; k < 24; k++) PLOSCE.push({ a: ((k + 0.5) / 24) * 6.283 + 0.13, r0: 195 }); // tretja generacija: med sosednjima
  const t0 = 20; // debelina ploščice (ena celica, ~ 20–25 µm)
  const stene = [], vrhovi = [], jedra = [], kanalcki = [], ploscePoti = [];
  seme = 5;
  for (const p of PLOSCE) {
    const fa = rnd() * 6.283, fb = rnd() * 6.283;
    const pot = [];
    for (let r = p.r0; r < 420; r += hi ? 9 : 14) {
      const a = p.a + (5 * Math.sin(r * 0.03 + fa) + 3 * Math.sin(r * 0.071 + fb)) / Math.max(r, 60);
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      if (r > rHex(a) - 16 || vTriadi(x, z, 4)) break;
      pot.push([x, z, r]);
    }
    if (pot.length < 3) continue;
    ploscePoti.push(pot);
    const pos = [], uv = [], idx = [], posS = [], idxS = [];
    let s = 0;
    pot.forEach(([x, z, r], i) => {
      const [xn, zn] = pot[Math.min(i + 1, pot.length - 1)], [xp, zp] = pot[Math.max(i - 1, 0)];
      let dx = xn - xp, dz = zn - zp; const l = Math.hypot(dx, dz); dx /= l; dz /= l;
      const nx = -dz, nz = dx, t = (t0 / 2) * Math.min(1, 0.35 + (r - p.r0) / 30) * (1 + 0.08 * Math.sin(r * 0.12));
      if (i) s += Math.hypot(x - pot[i - 1][0], z - pot[i - 1][1]);
      const yv = Y1 + 1.2 * Math.sin(x * 0.02 + z * 0.03);
      pos.push(x + nx * t, yv, z + nz * t, x - nx * t, yv, z - nz * t); uv.push(s / 25, 0, s / 25, 1);
      for (const sg of [1, -1]) posS.push(x + nx * t * sg, yv, z + nz * t * sg, x + nx * t * sg, Y0, z + nz * t * sg);
      if (i && ((s / 25) % 1) < ((s - Math.hypot(x - pot[i - 1][0], z - pot[i - 1][1])) / 25) % 1) jedra.push([x + nx * t * (rnd() - 0.5) * 0.5, yv - 1.5, z + nz * t * (rnd() - 0.5) * 0.5, Math.atan2(dz, dx)]);
    });
    for (let i = 0; i < pot.length - 1; i++) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      const b = i * 4;
      idxS.push(b, b + 4, b + 1, b + 1, b + 4, b + 5, b + 2, b + 3, b + 6, b + 3, b + 7, b + 6);
    }
    const n0 = pot.length - 1, e = n0 * 4; // zaključka
    idxS.push(0, 1, 2, 1, 3, 2, e, e + 2, e + 1, e + 1, e + 2, e + 3);
    const gv = geo(pos, null, uv, idx), gs = geo(posS, null, null, idxS);
    // normale vrha navzgor
    vrhovi.push(gv); stene.push(gs);
    kanalcki.push(cev(pot.map(([x, z]) => [x, Y1 + 1.2 * Math.sin(x * 0.02 + z * 0.03) - 0.6, z]), 2.2, Math.max(4, pot.length * (hi ? 2 : 1)), hi ? 6 : 4));
  }
  // preveri smer normal vrha: obrni trikotnike, če kažejo navzdol
  for (const g of vrhovi) { const nm = g.attributes.normal; if (nm.getY(0) < 0) { const ix = g.index.array; for (let i = 0; i < ix.length; i += 3) [ix[i + 1], ix[i + 2]] = [ix[i + 2], ix[i + 1]]; g.computeVertexNormals(); } }
  for (const g of stene) g.computeVertexNormals();
  const vrh = new THREE.Mesh(zdruzi(vrhovi), M.hep);
  const stena = new THREE.Mesh(zdruzi(stene), M.hepSt);
  stena.material.side = THREE.DoubleSide;
  const kan = new THREE.Mesh(zdruzi(kanalcki), M.zolc);
  const jedM = new THREE.InstancedMesh(new THREE.SphereGeometry(1, hi ? 10 : 7, hi ? 7 : 5), M.jedro, jedra.length);
  jedra.forEach(([x, y, z, a], i) => { o.position.set(x, y, z); o.rotation.set(0, -a, 0); o.scale.set(6, 3, 5); o.updateMatrix(); jedM.setMatrixAt(i, o.matrix); });
  jedM.computeBoundingSphere();
  svet.add(vrh, stena, kan, jedM);

  // ---------- mejna plošča ob robu šesterokotnika (cel rez ob straneh) in dno s sinusoidno krvjo ----------
  const obodT = [];
  for (let i = 0; i <= 180; i++) { const a = (i / 180) * 6.283; obodT.push([Math.cos(a) * (rHex(a) - 9), Math.sin(a) * (rHex(a) - 9), a]); }
  const mejG = [];
  {
    const pos = [], uv = [], idx = [];
    obodT.forEach(([x, z, a], i) => {
      const r = Math.hypot(x, z), nx = x / r, nz = z / r, yv = Y1 + 1.2 * Math.sin(x * 0.02 + z * 0.03);
      for (const [d, y] of [[-9, yv], [9, yv], [9, Y0], [-9, Y0]]) { pos.push(x + nx * d, y, z + nz * d); uv.push(i / 6, y / 25); }
    });
    for (let i = 0; i < obodT.length - 1; i++) {
      const a = i * 4, b = a + 4;
      idx.push(a, b, a + 1, a + 1, b, b + 1, a + 1, b + 1, a + 2, a + 2, b + 1, b + 2, a + 3, a + 2, b + 3, a + 2, b + 2, b + 3, a, a + 3, b, a + 3, b + 3, b);
    }
    mejG.push(geo(pos, null, uv, idx));
  }
  const meja = new THREE.Mesh(zdruzi(mejG), M.hepSt);
  const dnoG = new THREE.CircleGeometry(RH, 6, Math.PI / 6).rotateX(-Math.PI / 2).translate(0, Y0 + 2, 0);
  const sin = new THREE.Mesh(dnoG, M.sin);
  svet.add(meja, sin);

  // ---------- centralna vena ----------
  const cvZ = new THREE.CylinderGeometry(RCV, RCV, H + 6, hi ? 40 : 24, 1, true);
  const cvR = new THREE.RingGeometry(RCV * 0.82, RCV, hi ? 40 : 24).rotateX(-Math.PI / 2).translate(0, Y1 + 3, 0);
  const cv = new THREE.Mesh(zdruzi([cvZ, cvR, new THREE.RingGeometry(RCV * 0.82, RCV, hi ? 40 : 24).rotateX(Math.PI / 2).translate(0, Y0 - 3, 0)]), M.cv);
  const cvL = new THREE.Mesh(new THREE.CircleGeometry(RCV * 0.82, hi ? 40 : 24).rotateX(-Math.PI / 2).translate(0, Y1 - 14, 0), M.cvL);
  svet.add(cv, cvL);

  // ---------- portalni prostori v vogalih ----------
  const vezG = [], pvG = [], artG = [], vodG = [], lumG = [];
  const cevNavp = (x, z, r, d, seg = hi ? 28 : 16) => [
    new THREE.CylinderGeometry(r, r, H + 8, seg, 1, true).translate(x, 0, z),
    new THREE.RingGeometry(r * (1 - d), r, seg).rotateX(-Math.PI / 2).translate(x, Y1 + 4, z),
    new THREE.RingGeometry(r * (1 - d), r, seg).rotateX(Math.PI / 2).translate(x, Y0 - 5, z),
  ];
  VOG.forEach((c, k) => {
    const sm = c.clone().normalize(), pr = V(-sm.z, 0, sm.x);
    const vez = new THREE.CylinderGeometry(RTR, RTR, H + 4, hi ? 36 : 20, 1, false).translate(c.x, 0, c.z);
    const p = vez.attributes.position; // rahlo nepravilna oblika
    for (let i = 0; i < p.count; i++) { const dx = p.getX(i) - c.x, dz = p.getZ(i) - c.z, f = 1 + 0.08 * Math.sin(Math.atan2(dz, dx) * 3 + k); p.setX(i, c.x + dx * f); p.setZ(i, c.z + dz * f); }
    vez.computeVertexNormals();
    vezG.push(vez);
    const pv = c.clone().add(pr.clone().multiplyScalar(-14)).add(sm.clone().multiplyScalar(4)), ar = c.clone().add(pr.clone().multiplyScalar(26)).add(sm.clone().multiplyScalar(-16)), bd = c.clone().add(pr.clone().multiplyScalar(22)).add(sm.clone().multiplyScalar(22));
    pvG.push(...cevNavp(pv.x, pv.z, 30, 0.14)); lumG.push(new THREE.CircleGeometry(30 * 0.86, hi ? 28 : 16).rotateX(-Math.PI / 2).translate(pv.x, Y1 + 3, pv.z));
    artG.push(...cevNavp(ar.x, ar.z, 11, 0.5, 16)); lumG.push(new THREE.CircleGeometry(5.5, 12).rotateX(-Math.PI / 2).translate(ar.x, Y1 + 3, ar.z));
    vodG.push(...cevNavp(bd.x, bd.z, 12, 0.55, 16)); lumG.push(new THREE.CircleGeometry(5.4, 12).rotateX(-Math.PI / 2).translate(bd.x, Y1 + 3, bd.z));
    VOG[k].pv = pv; VOG[k].ar = ar; VOG[k].bd = bd;
  });
  const vez = new THREE.Mesh(zdruzi(vezG), M.vez), pv = new THREE.Mesh(zdruzi(pvG), M.pv), art = new THREE.Mesh(zdruzi(artG), M.art), vod = new THREE.Mesh(zdruzi(vodG), M.vod), lum = new THREE.Mesh(zdruzi(lumG), M.lumen);
  svet.add(vez, pv, art, vod, lum);

  // Kupfferjeve celice na dnu sinusoidov
  const kupf = [];
  seme = 71;
  for (let i = 0, p = 0; i < (hi ? 26 : 14) && p < 400; p++) {
    const a = rnd() * 6.283, r = 80 + rnd() * 220, x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (vTriadi(x, z, 10) || r > rHex(a) - 30) continue;
    o.position.set(x, Y0 + 5, z); o.rotation.set(0, rnd() * 3, 0); o.scale.set(9, 4, 6); o.updateMatrix(); kupf.push(o.matrix.clone()); i++;
  }
  const kupM = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 7), M.kupf, kupf.length);
  kupf.forEach((m, i) => kupM.setMatrixAt(i, m));
  kupM.computeBoundingSphere();
  svet.add(kupM);

  // ---------- tok: kri iz vogalov proti centralni veni (po sinusoidih), žolč od sredine proti žolčnim vodom ----------
  const kotiP = ploscePoti.map((p) => Math.atan2(p[p.length - 1][1], p[p.length - 1][0])).sort((a, b) => a - b);
  const vmes = kotiP.map((a, i) => { const b = i + 1 < kotiP.length ? kotiP[i + 1] : kotiP[0] + 6.283; return (a + b) / 2; });
  const nKr = hi ? 90 : 48, nB = hi ? 60 : 32;
  const kri = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6).scale(1, 0.5, 1), M.kri, nKr);
  const bil = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), M.bil, nB);
  svet.add(kri, bil);
  const krvPoti = [], bilPoti = [];
  seme = 3;
  for (let i = 0; i < nKr; i++) krvPoti.push({ a: vmes[Math.floor(rnd() * vmes.length)], f: rnd(), y: Y1 - 14 - rnd() * 40 });
  for (let i = 0; i < nB; i++) bilPoti.push({ p: ploscePoti[Math.floor(rnd() * ploscePoti.length)], f: rnd() });
  function tok(t) {
    krvPoti.forEach((k, i) => {
      const f = (k.f + t * 0.09) % 1, rMax = rHex(k.a) - 20, r = rMax - f * (rMax - RCV * 0.6);
      const y = r < RCV ? k.y - (RCV - r) * 2 : k.y;
      o.position.set(Math.cos(k.a) * r, y, Math.sin(k.a) * r); o.rotation.set(0, -k.a, 0.3); o.scale.setScalar(4.2 * Math.min(1, f * 8, (1 - f) * 8)); o.updateMatrix(); kri.setMatrixAt(i, o.matrix);
    });
    bilPoti.forEach((b, i) => {
      const f = (b.f + t * 0.05) % 1, pot = b.p, s = f * (pot.length - 1), j = Math.min(pot.length - 2, Math.floor(s)), u = s - j;
      const x = pot[j][0] + (pot[j + 1][0] - pot[j][0]) * u, z = pot[j][1] + (pot[j + 1][1] - pot[j][1]) * u;
      o.position.set(x, Y1 + 2.5, z); o.rotation.set(0, 0, 0); o.scale.setScalar(3.4 * Math.min(1, f * 8, (1 - f) * 8)); o.updateMatrix(); bil.setMatrixAt(i, o.matrix);
    });
    kri.instanceMatrix.needsUpdate = bil.instanceMatrix.needsUpdate = true;
    kri.computeBoundingSphere(); bil.computeBoundingSphere();
  }
  tok(0.3);

  // ---------- deli ----------
  const deli = [];
  const del = (id, ime, la, opis, barva, meshes, p, x = {}) => deli.push({ id, ime, la, opis, barva, meshes, tocka: U(p), ...x });
  const c0 = VOG[5], c1 = VOG[0];
  const pl = ploscePoti[3], plT = pl[Math.floor(pl.length * 0.6)];
  del("hepatociti", "Jetrne celice (hepatociti)", "Hepatocyti", "Celice v ploščicah, debelih eno celico; predelujejo hranila, shranjujejo glikogen, razgrajujejo strupe in izdelujejo žolč.", "#e2a07a", [vrh, stena, meja, jedM], V(plT[0], Y1, plT[1]));
  del("sinusoidi", "Sinusoidi", "Vasa sinusoidea", "Široke kapilare med ploščicami; po njih teče mešana kri iz portalne vene in arterije proti centralni veni.", "#8e2f3a", [sin, kri], V(Math.cos(vmes[7]) * 200, Y1 - 30, Math.sin(vmes[7]) * 200));
  del("centralna-vena", "Centralna vena", "Vena centralis", "Zbira kri iz sinusoidov in jo odvaja v jetrne vene in naprej v spodnjo votlo veno.", "#6a62bc", [cv, cvL], V(0, Y1 + 3, RCV));
  del("portalna-vena", "Vejica portalne vene", "Ramus venae portae", "Prinaša kri iz črevesja, bogato s hranili; je največja cev v portalnem prostoru.", "#7b72cc", [pv], c0.pv.clone().setY(Y1 + 5));
  del("jetrna-arterija", "Vejica jetrne arterije", "Ramus arteriae hepaticae", "Prinaša kri, bogato s kisikom; ima debelo mišično steno in ozko svetlino.", "#d23c48", [art], c0.ar.clone().setY(Y1 + 5));
  del("zolcni-vod", "Žolčni vod", "Ductus biliferus interlobularis", "Cevka iz kockastih celic, ki odvaja žolč iz režnjiča proti žolčniku in dvanajstniku.", "#4fa86a", [vod, bil], c0.bd.clone().setY(Y1 + 5));
  del("portalni-prostor", "Portalni prostor (trias)", "Spatium portale", "Vezivo v vogalu režnjiča, v katerem ležijo vejica portalne vene, vejica jetrne arterije in žolčni vod.", "#f2e2d6", [vez, lum], c1.clone().multiplyScalar(1.12).setY(Y1 + 2));
  del("zolcni-kanalcki", "Žolčni kanalčki", "Canaliculi biliferi", "Drobni kanalčki med sosednjima jetrnima celicama; žolč po njih teče proti robu režnjiča.", "#58b05a", [kan], V(pl[3][0], Y1, pl[3][1]), { skrijTocko: true });
  del("kupffer", "Kupfferjeve celice", "Macrophagocyti stellati", "Makrofagi v steni sinusoidov, ki iz krvi odstranjujejo bakterije in stare rdeče krvničke.", "#f0d08a", [kupM], V(0, Y0, 0), { skrijTocko: true });

  return {
    group,
    deli,
    korak(t) { if (gib) tok(t); },
    pogled: [0.3, 1.0, 1],
    okvir: { sredisce: [0, 0, 0.03], polmer: 0.92 },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      for (const x of odpad) x.dispose();
    },
  };
}
