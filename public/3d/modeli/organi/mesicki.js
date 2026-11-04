// Pljučni mešički pod povečavo: grozd mešičkov (alveol) na koncu respiratornega bronhiola, okoli njih kapilarna mreža;
// sprednji mešiček je prerezan (stena z alveolarnimi celicami tipa I in II, makrofag). Mere: Ross & Pawlina, Histology
// (8. izd.), Junqueira's Basic Histology (16. izd.), pogl. Dihala; viri v viri.json. Gradi se v µm. Pogodba: docs/3d.md.

export const info = {
  id: "organ-mesicki",
  naslov: "Pljučni mešički",
  podrocje: "organi",
  predmet: "BIO",
  opis: "Grozd pljučnih mešičkov na koncu najtanjše dihalne cevke, prepreden s kapilarami. Kisik gre iz zraka v mešičku skozi tanko steno v kri, ogljikov dioksid pa v obratni smeri. Stena mešička in kapilare so narisane približno dvakrat debelejše kot v resnici.",
  poskusi: "Sledi eni rdeči krvnički: kje je modrikasta in kje svetlo rdeča?",
  merilo: { m: 660e-6, oznaka: "0,66 mm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const gib = ctx.gibanje !== false;
  const S = 1 / 330, YC = -20;
  const group = new THREE.Group();
  const svet = new THREE.Group();
  svet.scale.setScalar(S);
  svet.position.y = -YC * S;
  group.add(svet);
  const U = (v) => [v.x * S, (v.y - YC) * S, v.z * S].map((x) => Math.round(x * 1000) / 1000);
  const odpad = [];
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const o = new THREE.Object3D();
  let seme = 5;
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

  // ---------- mešički ----------
  const R = 100; // polmer mešička (premer ~ 200 µm)
  const MES = [[0, 40, 150], [-182, 60, 58], [182, 48, 60], [0, 218, 40], [-125, 192, -72], [128, 186, -62], [-152, -72, -44], [154, -82, -30], [0, 70, -96], [0, -92, -12]]
    .map(([x, y, z], i) => ({ c: V(x, y, z), r: i === 0 ? R : R * (0.9 + 0.12 * Math.sin(i * 2.3)) }));
  const smer = V(0.22, 0.3, 1).normalize(); // odprtina prerezanega mešička
  const q0 = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), smer);
  const T0 = 16, H = 0.34 * R; // debelina stene (povečana), ravnina reza v lokalnem y
  const vNotranjosti = (p, izv = -1, rob = 0) => MES.some((m, i) => i !== izv && p.distanceTo(m.c) < m.r - rob);

  const M = {
    mes: mat(0xf2b8b5, { roughness: 0.45, clearcoat: 0.6, sheen: 0.7 }),
    not: null,
    rob: mat(0xffffff, { vertexColors: true, roughness: 0.6, clearcoat: 0.2 }),
    tip2: mat(0xc99ae0, { roughness: 0.4, clearcoat: 0.6 }),
    jedro1: mat(0x8a6cc8, { roughness: 0.45, clearcoat: 0.5 }),
    makro: mat(0xe7c48c, { roughness: 0.5, clearcoat: 0.4 }),
    kap: mat(0xe2707a, { roughness: 0.2, clearcoat: 1, transparent: true, opacity: 0.45, depthWrite: false }),
    art: mat(0x6274c8, { roughness: 0.35, clearcoat: 0.8 }),
    ven: mat(0xd23c48, { roughness: 0.35, clearcoat: 0.8 }),
    bron: mat(0xeeb6ae, { roughness: 0.45, clearcoat: 0.6 }),
    bronN: mat(0xf7dccf, { roughness: 0.6, side: THREE.BackSide }),
    misica: mat(0xe0968a, { roughness: 0.5, clearcoat: 0.4 }),
    rbc: mat(0xffffff, { roughness: 0.35, clearcoat: 0.7, sheen: 0.3 }),
    o2: mat(0x8fd8ff, { roughness: 0.2, clearcoat: 1, emissive: 0x1a5070 }),
    co2: mat(0xb9b2c4, { roughness: 0.3, clearcoat: 1, emissive: 0x2a2633 }),
  };
  // tip I: tanke ploščate celice (meje celic na notranji ploskvi)
  {
    const n = 22, tocke = [];
    seme = 21;
    for (let i = 0; i < n; i++) tocke.push([rnd(), rnd()]);
    const tex = tekstura(hi ? 256 : 128, (u, v) => {
      let d1 = 9, d2 = 9;
      for (const [x, y] of tocke) for (const ox of [-1, 0, 1]) for (const oy of [-1, 0, 1]) {
        const d = Math.hypot(u - x - ox, v - y - oy);
        if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
      }
      return 0.97 - 0.32 * Math.max(0, 1 - (d2 - d1) * 38);
    });
    tex.repeat.set(3, 2);
    M.not = mat(0xffe2dc, { emissive: 0x3a2422, map: tex, bumpMap: tex, bumpScale: 1.2, roughness: 0.4, clearcoat: 0.7, side: THREE.BackSide });
  }

  // Gosta kapilarna mreža na površini mešičkov kot barvna in reliefna tekstura (Voronojeve meje = kapilare).
  {
    const n = hi ? 384 : 256, d = new Uint8Array(n * n * 4), b = new Uint8Array(n * n * 4);
    const GX = 22, GY = 11, sem = []; // razmetana mreža semen: vsaka celica eno seme, iščemo samo 3 × 3 sosede
    seme = 44;
    for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) sem.push([(i + 0.15 + 0.7 * rnd()) / GX, (j + 0.15 + 0.7 * rnd()) / GY]);
    const baza = new THREE.Color(0xf6d3cf), kri = new THREE.Color(0xc23a4c), c = new THREE.Color();
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
      const u = i / n, v = j / n;
      let d1 = 9, d2 = 9;
      const ci = Math.floor(u * GX), cj = Math.floor(v * GY);
      for (let a = -1; a <= 1; a++) for (let bb = -1; bb <= 1; bb++) {
        const ii = ci + a, jj = cj + bb, [x, y] = sem[((jj + GY) % GY) * GX + ((ii + GX) % GX)];
        const dd = Math.hypot((u - x - Math.floor(ii / GX)) * 2, v - y - Math.floor(jj / GY));
        if (dd < d1) { d2 = d1; d1 = dd; } else if (dd < d2) d2 = dd;
      }
      const e = d2 - d1, k = Math.max(0, Math.min(1, 1 - (e - 0.008) / 0.018)), hb = Math.sqrt(Math.max(0, 1 - (e / 0.024) ** 2));
      c.copy(baza).lerp(kri, k * 0.85);
      const x = (j * n + i) * 4;
      d[x] = c.r * 255; d[x + 1] = c.g * 255; d[x + 2] = c.b * 255; d[x + 3] = 255;
      b[x] = b[x + 1] = b[x + 2] = 255 * hb; b[x + 3] = 255;
    }
    const mk = (arr, srgb) => {
      const t = new THREE.DataTexture(arr, n, n, THREE.RGBAFormat);
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true;
      if (srgb) t.colorSpace = THREE.SRGBColorSpace;
      t.repeat.set(2, 1); t.needsUpdate = true; odpad.push(t); return t;
    };
    M.mes = mat(0xffffff, { map: mk(d, true), bumpMap: mk(b, false), bumpScale: 2.2, roughness: 0.42, clearcoat: 0.6, sheen: 0.5, sheenColor: new THREE.Color(0xffd6d0) });
  }

  // zunanje lupine neprerezanih mešičkov (ena mreža)
  const segW = hi ? 34 : 24, segH = hi ? 24 : 16;
  const lupine = [];
  for (let i = 1; i < MES.length; i++) {
    const m = MES[i];
    const g = new THREE.SphereGeometry(m.r, segW, segH);
    const p = g.attributes.position, n = new THREE.Vector3();
    for (let k = 0; k < p.count; k++) { // rahlo nepravilna oblika
      n.fromBufferAttribute(p, k).normalize();
      const f = 1 + 0.035 * Math.sin(n.x * 5 + i) * Math.sin(n.y * 4 - i) + 0.02 * Math.sin(n.z * 7 + i * 2);
      p.setXYZ(k, n.x * m.r * f, n.y * m.r * f, n.z * m.r * f);
    }
    g.computeVertexNormals();
    lupine.push(g.translate(m.c.x, m.c.y, m.c.z));
  }
  const mesicki = new THREE.Mesh(zdruzi(lupine), M.mes);
  svet.add(mesicki);

  // prerezan mešiček: zunanja in notranja lupina do ravnine y = H (lokalno) in obroč reza
  const prerez = new THREE.Group();
  prerez.position.copy(MES[0].c);
  prerez.quaternion.copy(q0);
  svet.add(prerez);
  const kapa = (r, h) => new THREE.SphereGeometry(r, segW, segH, 0, Math.PI * 2, Math.acos(h / r), Math.PI - Math.acos(h / r));
  const zun = new THREE.Mesh(kapa(R, H), M.mes);
  const not = new THREE.Mesh(kapa(R - T0, H), M.not);
  const rRob = Math.sqrt(R * R - H * H), rNot = Math.sqrt((R - T0) ** 2 - H * H);
  const robG = new THREE.RingGeometry(rNot, rRob, hi ? 72 : 40, 3).rotateX(-Math.PI / 2).translate(0, H, 0);
  {
    const p = robG.attributes.position, col = [];
    const ep = new THREE.Color(0xf7d6d2), vez = new THREE.Color(0xeab0b6), c = new THREE.Color();
    for (let k = 0; k < p.count; k++) {
      const t = (Math.hypot(p.getX(k), p.getZ(k)) - rNot) / (rRob - rNot);
      c.copy(ep).lerp(vez, Math.min(1, Math.abs(t - 0.5) < 0.3 ? 1 : 0.3)); col.push(c.r, c.g, c.b);
    }
    robG.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  }
  const rob = new THREE.Mesh(robG, M.rob);
  prerez.add(zun, not, rob);
  // kapilare v prerezu stene (svetline z rdečo krvničko)
  const kapRezG = [];
  for (let i = 0, n = hi ? 16 : 10; i < n; i++) {
    const a = (i / n) * 6.283 + 0.2, rr = (rNot + rRob) / 2;
    kapRezG.push(new THREE.CylinderGeometry(5.2, 5.2, 1.2, hi ? 14 : 8).translate(Math.cos(a) * rr, H + 0.3, Math.sin(a) * rr));
  }
  const kapRez = new THREE.Mesh(zdruzi(kapRezG), mat(0xb3202e, { roughness: 0.4, clearcoat: 0.6 }));
  prerez.add(kapRez);

  // celice na notranji ploskvi prerezanega mešička
  const naNotranji = (n, h0) => {
    const out = [];
    for (let i = 0, p = 0; i < n && p < 500; p++) {
      const th = Math.acos(H / (R - T0)) + 0.15 + rnd() * (Math.PI - Math.acos(H / (R - T0)) - 0.3), ph = rnd() * 6.283;
      const d = V(Math.sin(th) * Math.cos(ph), Math.cos(th), Math.sin(th) * Math.sin(ph));
      if (d.y > h0) continue;
      out.push(d); i++;
    }
    return out;
  };
  seme = 33;
  const postavi = (d, rr, sx, sy) => {
    o.position.copy(d).multiplyScalar(rr);
    o.quaternion.setFromUnitVectors(V(0, 1, 0), d.clone().negate());
    o.scale.set(sx, sy, sx);
    o.updateMatrix();
    return o.matrix.clone();
  };
  const instanc = (g, m, mats, parent = svet) => {
    const im = new THREE.InstancedMesh(g, m, mats.length);
    mats.forEach((x, i) => im.setMatrixAt(i, x));
    im.computeBoundingSphere();
    parent.add(im);
    return im;
  };
  const kG = new THREE.SphereGeometry(1, hi ? 16 : 10, hi ? 12 : 7);
  const j1 = instanc(kG, M.jedro1, naNotranji(hi ? 10 : 7, 0.25).map((d) => postavi(d, R - T0 - 0.5, 7.5, 2.2)), prerez);
  const t2pol = naNotranji(6, 0.1);
  const tip2 = instanc(kG, M.tip2, t2pol.map((d) => postavi(d, R - T0 + 2, 8.5, 7.5)), prerez);
  // lamelarna telesca (surfaktant) kot drobne kroglice na celicah tipa II
  const lam = [];
  for (const d of t2pol) for (let k = 0; k < 5; k++) {
    const e = d.clone().add(V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(0.09)).normalize();
    lam.push(postavi(e, R - T0 - 4.4, 1.6, 1.6));
  }
  const lamM = instanc(new THREE.IcosahedronGeometry(1, 1), mat(0xfff1d6, { roughness: 0.3, clearcoat: 1 }), lam, prerez);
  // alveolarni makrofag na dnu mešička
  const dm = V(0.15, -0.95, 0.25).normalize();
  const makG = [kroglica(0, 0, 0, 9, 6, 8)];
  for (let k = 0; k < 6; k++) { const a = k * 1.05; makG.push(cev([[0, 0, 0], [Math.cos(a) * 9, -1, Math.sin(a) * 8], [Math.cos(a + 0.3) * 15, -2.5, Math.sin(a + 0.3) * 14]], (t) => 2.6 - 1.6 * t, 8, 6)); }
  const makro = new THREE.Mesh(zdruzi(makG), M.makro);
  makro.position.copy(dm).multiplyScalar(R - T0 - 4.5);
  makro.quaternion.setFromUnitVectors(V(0, 1, 0), dm.clone().negate());
  prerez.add(makro);

  // ---------- respiratorni bronhiol (prerezan spodaj) ----------
  const bronT = [V(30, -350, 60), V(20, -260, 40), V(5, -170, 15), V(0, -95, 0)];
  const bk = new THREE.CatmullRomCurve3(bronT);
  const RB = 62, RBn = 46;
  const bronZ = new THREE.TubeGeometry(bk, hi ? 32 : 16, RB, hi ? 36 : 20, false);
  const bronN = new THREE.TubeGeometry(bk, hi ? 32 : 16, RBn, hi ? 36 : 20, false);
  const t0 = bk.getTangentAt(0), konec = bk.getPointAt(0);
  const bronRob = new THREE.RingGeometry(RBn, RB, hi ? 36 : 20, 2);
  {
    const p = bronRob.attributes.position, col = [], c = new THREE.Color();
    for (let k = 0; k < p.count; k++) {
      const t = (Math.hypot(p.getX(k), p.getY(k)) - RBn) / (RB - RBn);
      c.set(t < 0.3 ? 0xf7e0d4 : t < 0.65 ? 0xd9786a : 0xeec2ba); col.push(c.r, c.g, c.b);
    }
    bronRob.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  }
  const bronR = new THREE.Mesh(bronRob, M.rob);
  bronR.position.copy(konec);
  bronR.quaternion.setFromUnitVectors(V(0, 0, 1), t0.clone().negate());
  const bron = new THREE.Mesh(bronZ, M.bron), bronNm = new THREE.Mesh(bronN, M.bronN);
  const misG = [];
  for (let k = 0; k < 3; k++) {
    const pts = [];
    for (let i = 0; i <= 30; i++) {
      const u = 0.06 + (i / 30) * 0.55, P = bk.getPointAt(u), Tg = bk.getTangentAt(u);
      const N = V(1, 0, 0).cross(Tg).normalize(), Bn = Tg.clone().cross(N);
      const a = k * 2.1 + i * 0.22;
      pts.push(P.clone().add(N.multiplyScalar(Math.cos(a) * (RB - 3))).add(Bn.multiplyScalar(Math.sin(a) * (RB - 3))).toArray());
    }
    misG.push(cev(pts, 5, hi ? 60 : 30, 8));
  }
  const misice = new THREE.Mesh(zdruzi(misG), M.misica);
  svet.add(bron, bronNm, bronR, misice);

  // ---------- žile: vejica pljučne arterije (levo) in vene (desno) ----------
  const ART = [V(-95, -350, 70), V(-105, -230, 40), V(-150, -110, 10), V(-255, 20, 10), V(-262, 150, -30), V(-200, 260, -70)];
  const VEN = ART.map((p) => V(-p.x, p.y, p.z));
  const artK = new THREE.CatmullRomCurve3(ART), venK = new THREE.CatmullRomCurve3(VEN);
  const ziG = (k, r) => {
    const g = new THREE.TubeGeometry(k, hi ? 48 : 24, r, hi ? 16 : 10, false);
    const kp = new THREE.CircleGeometry(r, hi ? 16 : 10);
    kp.lookAt(k.getTangentAt(0).negate());
    kp.translate(...k.getPointAt(0).toArray());
    return [g, kp];
  };
  const [aG, aK] = ziG(artK, 20), [vG, vK] = ziG(venK, 24);

  // ---------- kapilarna mreža na mešičkih in poti krvničk ----------
  const vozl = [], robovi = new Set(), sosedi = [];
  MES.forEach((m, mi) => {
    const n = mi === 0 ? (hi ? 40 : 30) : hi ? 30 : 22, prvi = vozl.length;
    for (let k = 0; k < n; k++) {
      const y = 1 - (2 * (k + 0.5)) / n, r = Math.sqrt(1 - y * y), f = k * 2.39996 + mi;
      const d = V(Math.cos(f) * r, y, Math.sin(f) * r);
      if (mi === 0 && d.clone().applyQuaternion(q0.clone().invert()).y > H / R - 0.12) continue;
      const p = m.c.clone().add(d.clone().multiplyScalar(m.r + 2));
      if (vNotranjosti(p, mi, 6)) continue;
      vozl.push({ p, d, m: mi });
    }
    for (let a = prvi; a < vozl.length; a++) {
      const naj = [];
      for (let b = prvi; b < vozl.length; b++) if (b !== a) naj.push([vozl[a].d.distanceTo(vozl[b].d), b]);
      naj.sort((x, y) => x[0] - y[0]);
      for (const [dd, b] of naj.slice(0, 4)) if (dd < 0.7) robovi.add(a < b ? `${a},${b}` : `${b},${a}`);
    }
  });
  vozl.forEach(() => sosedi.push([]));
  const lok = (a, b, n = 5) => {
    const A = vozl[a], Bv = vozl[b], m = MES[A.m], out = [];
    for (let i = 0; i <= n; i++) {
      const d = A.d.clone().lerp(Bv.d, i / n).normalize();
      out.push(m.c.clone().add(d.multiplyScalar(m.r + 4.5 + 2 * Math.sin((i / n) * Math.PI))));
    }
    return out;
  };
  const kapG = [];
  for (const k of robovi) {
    const [a, b] = k.split(",").map(Number);
    sosedi[a].push(b); sosedi[b].push(a);
  }
  // poti: vozlišče najbližje arteriji → (najkrajša pot po mreži) → vozlišče najbližje veni
  const blizu = (k, p) => { let bp = null, bd = 1e9; for (let i = 0; i <= 40; i++) { const q = k.getPointAt(i / 40), d = q.distanceTo(p); if (d < bd) { bd = d; bp = q; } } return bp; };
  const poti = [], vejeG = [];
  MES.forEach((m, mi) => {
    const moja = vozl.map((v, i) => [v, i]).filter(([v]) => v.m === mi);
    if (moja.length < 4) return;
    const pa = blizu(artK, m.c), pv = blizu(venK, m.c);
    const s0 = moja.reduce((x, y) => (y[0].p.distanceTo(pa) < x[0].p.distanceTo(pa) ? y : x))[1];
    const s1 = moja.reduce((x, y) => (y[0].p.distanceTo(pv) < x[0].p.distanceTo(pv) ? y : x))[1];
    const prev = new Map([[s0, -1]]), vrsta = [s0];
    while (vrsta.length) { const x = vrsta.shift(); if (x === s1) break; for (const y of sosedi[x]) if (!prev.has(y)) { prev.set(y, x); vrsta.push(y); } }
    if (!prev.has(s1)) return;
    const red = [];
    for (let x = s1; x !== -1; x = prev.get(x)) red.unshift(x);
    const pts = [pa.clone()];
    for (let i = 0; i < red.length - 1; i++) {
      const l = lok(red[i], red[i + 1]);
      pts.push(...l.slice(i ? 1 : 0));
      kapG.push(cev(l.map((p) => p.toArray()), 5.6, hi ? 8 : 5, hi ? 10 : 7));
    }
    pts.push(pv.clone());
    vejeG.push(cev([pa, pa.clone().lerp(vozl[s0].p, 0.5).add(m.c.clone().sub(pa).normalize().multiplyScalar(6)), vozl[s0].p].map((p) => p.toArray()), (t) => 9 - 3.5 * t, 10, 7));
    vejeG.push(cev([vozl[s1].p, vozl[s1].p.clone().lerp(pv, 0.5), pv].map((p) => p.toArray()), (t) => 5.5 + 4 * t, 10, 7));
    const dol = [0];
    for (let i = 1; i < pts.length; i++) dol.push(dol[i - 1] + pts[i].distanceTo(pts[i - 1]));
    poti.push({ pts, dol, L: dol[dol.length - 1], art: dol[1] / dol[dol.length - 1], ven: dol[dol.length - 2] / dol[dol.length - 1] });
  });
  const vejeA = vejeG.filter((_, i) => i % 2 === 0), vejeV = vejeG.filter((_, i) => i % 2 === 1);
  const art = new THREE.Mesh(zdruzi([aG, aK, ...vejeA]), M.art);
  const ven = new THREE.Mesh(zdruzi([vG, vK, ...vejeV]), M.ven);
  const kap = new THREE.Mesh(zdruzi(kapG), M.kap);
  kap.renderOrder = 1;
  svet.add(art, ven, kap);

  // rdeče krvničke: dvojno vbočene ploščice (Evans–Fung), premer 7,5 µm (povečano na 8,5 µm)
  const prof = [];
  const nP = hi ? 6 : 5;
  for (let i = 0; i <= nP; i++) { const r = i / nP; prof.push([r * 4.25, -0.5 * Math.sqrt(Math.max(0, 1 - r * r)) * (0.207 + 2.003 * r * r - 1.123 * r ** 4) * 4.25]); }
  const rbcG = new THREE.LatheGeometry([...prof, ...prof.slice(0, -1).reverse().map(([r, y]) => [r, -y])].map(([r, y]) => new THREE.Vector2(Math.max(r, 0.01), y)), hi ? 10 : 7);
  rbcG.rotateX(Math.PI / 2); // os ploščice vzdolž z → vzdolž toka
  const nRbc = hi ? 170 : 90;
  const rbc = new THREE.InstancedMesh(rbcG, M.rbc, nRbc);
  rbc.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(nRbc * 3), 3);
  svet.add(rbc);
  const krv = [];
  seme = 77;
  for (let i = 0; i < nRbc; i++) krv.push({ pot: poti[i % poti.length], u: rnd(), hitro: 0.07 + rnd() * 0.04 });
  const MODRA = new THREE.Color(0x7d4a9a), RDECA = new THREE.Color(0xe8343c), cc = new THREE.Color(), P1 = V(0, 0, 0), P2 = V(0, 0, 0);
  function postaviKrv() {
    krv.forEach((k, i) => {
      const { pts, dol, L } = k.pot, s = k.u * L;
      let j = 1;
      while (j < dol.length - 1 && dol[j] < s) j++;
      const t = (s - dol[j - 1]) / Math.max(1e-6, dol[j] - dol[j - 1]);
      P1.copy(pts[j - 1]).lerp(pts[j], t);
      P2.copy(pts[j]).sub(pts[j - 1]).normalize();
      o.position.copy(P1);
      o.quaternion.setFromUnitVectors(V(0, 0, 1), P2);
      o.scale.setScalar(1);
      o.updateMatrix();
      rbc.setMatrixAt(i, o.matrix);
      const f = Math.min(1, Math.max(0, (k.u - k.pot.art) / ((k.pot.ven - k.pot.art) * 0.45)));
      cc.copy(MODRA).lerp(RDECA, f * f * (3 - 2 * f));
      rbc.setColorAt(i, cc);
    });
    rbc.instanceMatrix.needsUpdate = true;
    rbc.instanceColor.needsUpdate = true;
    rbc.computeBoundingSphere();
  }
  postaviKrv();

  // izmenjava plinov v prerezanem mešičku: O₂ iz zraka v steno, CO₂ iz stene v zrak
  const nPl = hi ? 18 : 10;
  const plG = new THREE.IcosahedronGeometry(1, hi ? 2 : 1);
  const o2 = new THREE.InstancedMesh(plG, M.o2, nPl * 2), co2 = new THREE.InstancedMesh(plG, M.co2, nPl);
  prerez.add(o2, co2);
  const plini = [];
  seme = 91;
  for (let i = 0; i < nPl; i++) {
    const d = naNotranji(1, 0.2)[0];
    plini.push({ d, f: rnd(), a: V((rnd() - 0.5) * 50, H - 20 - rnd() * 40, (rnd() - 0.5) * 50) });
  }
  function postaviPline(t) {
    plini.forEach((p, i) => {
      const f = (p.f + t * 0.22) % 1, stena = p.d.clone().multiplyScalar(R - T0 - 3);
      // O₂: molekula iz dveh atomov, od zraka do stene
      const a = p.a.clone().lerp(stena, f), sc = 2.6 * Math.min(1, (1 - f) * 6);
      for (const [k, dx] of [[0, -1.3], [1, 1.3]]) { o.position.copy(a).add(V(dx * sc * 0.8, 0, 0)); o.quaternion.identity(); o.scale.setScalar(sc); o.updateMatrix(); o2.setMatrixAt(i * 2 + k, o.matrix); }
      const g = (p.f + 0.5 + t * 0.18) % 1, b = stena.clone().lerp(p.a.clone().multiplyScalar(0.8), g), sb = 3.2 * Math.min(1, g * 6, (1 - g) * 4);
      o.position.copy(b); o.scale.setScalar(sb); o.updateMatrix(); co2.setMatrixAt(i, o.matrix);
    });
    o2.instanceMatrix.needsUpdate = co2.instanceMatrix.needsUpdate = true;
    o2.computeBoundingSphere(); co2.computeBoundingSphere();
  }
  postaviPline(0.3);

  // napisi O₂ in CO₂ (samo v brskalniku)
  if (typeof document !== "undefined") {
    for (const [txt, barva, p] of [["O₂ → kri", "#9adcff", V(-42, H - 10, 24)], ["CO₂ → zrak", "#d3cbe0", V(36, H - 30, -30)]]) {
      const cv = document.createElement("canvas");
      cv.width = 512; cv.height = 128;
      const c2 = cv.getContext("2d");
      if (!c2) continue;
      c2.font = "700 64px system-ui, sans-serif"; c2.textAlign = "center"; c2.textBaseline = "middle";
      c2.lineWidth = 12; c2.lineJoin = "round"; c2.strokeStyle = "rgba(20, 24, 36, 0.85)"; c2.strokeText(txt, 256, 64);
      c2.fillStyle = barva; c2.fillText(txt, 256, 64);
      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sm = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false });
      odpad.push(sm, tex);
      const sp = new THREE.Sprite(sm);
      sp.scale.set(104, 26, 1);
      sp.position.copy(p);
      sp.raycast = () => {};
      sp.renderOrder = 5;
      prerez.add(sp);
      plini.napisi = (plini.napisi || []).concat(sp);
    }
  }

  // ---------- deli ----------
  const deli = [];
  const vSvet = (obj, v) => { obj.updateMatrix(); return v.clone().applyMatrix4(obj.matrix); };
  const del = (id, ime, la, opis, barva, meshes, p, x = {}) => deli.push({ id, ime, la, opis, barva, meshes, tocka: U(p), ...x });
  del("mesicki", "Pljučni mešički", "Alveoli pulmonis", "Drobni mehurčki na koncu dihalnih poti, prepredeni z gosto mrežo kapilar; v pljučih jih je okoli 300 milijonov.", "#f2b8b5", [mesicki], MES[5].c.clone().add(V(40, 60, 60)));
  del("stena", "Stena mešička", "Septum interalveolare", "Zelo tanka stena med mešički; v njej so kapilare, zato je pot kisika do krvi krajša od tisočinke milimetra.", "#eab0b6", [zun, rob, kapRez], vSvet(prerez, V(rRob * 0.7, H, rRob * 0.7)));
  del("tip1", "Alveolarne celice tipa I", "Pneumocyti typi I", "Zelo tanke ploščate celice, ki pokrivajo skoraj vso notranjost mešička; skoznje kisik preide v kri.", "#8a6cc8", [not, j1], vSvet(prerez, V(-30, -40, -70)));
  del("tip2", "Alveolarne celice tipa II", "Pneumocyti typi II", "Okrogle celice v kotih mešička; izdelujejo surfaktant, ki preprečuje, da bi se mešički ob izdihu sesedli.", "#c99ae0", [tip2, lamM], vSvet(prerez, t2pol[0].clone().multiplyScalar(R - T0 - 8)));
  del("makrofag", "Alveolarni makrofag", "Macrophagus alveolaris", "Celica, ki se plazi po notranjosti mešička in požira prah in mikrobe.", "#e7c48c", [makro], vSvet(prerez, dm.clone().multiplyScalar(R - T0 - 10)));
  del("kapilare", "Kapilare", "Rete capillare alveolare", "Najtanjše žile, ki kot gosta mreža objemajo vsak mešiček; tu kri odda ogljikov dioksid in sprejme kisik. Nekaj jih je narisanih prosojno, da vidiš krvničke.", "#e0606a", [kap], vozl[Math.floor(vozl.length * 0.12)].p);
  del("eritrociti", "Rdeče krvničke", "Erythrocyti", "Krvničke gredo skozi kapilare ena za drugo; s hemoglobinom vežejo kisik in se pri tem obarvajo svetlo rdeče.", "#e8343c", [rbc], poti[0].pts[Math.floor(poti[0].pts.length / 2)], { povecava: "celica-eritrocit" });
  del("plini", "Kisik in ogljikov dioksid", "O₂ et CO₂", "Plina prehajata z difuzijo: kisik iz zraka v kri, ogljikov dioksid iz krvi v zrak, ki ga izdihnemo.", "#8fd8ff", [o2, co2], vSvet(prerez, V(-10, H - 30, 0)));
  del("arterija", "Vejica pljučne arterije", "Arteriola pulmonalis", "Prinaša kri z malo kisika iz desnega prekata; na shemah jo rišemo modro.", "#6274c8", [art], artK.getPointAt(0.12));
  del("vena", "Vejica pljučne vene", "Venula pulmonalis", "Odnaša kri, bogato s kisikom, proti levemu preddvoru srca.", "#d23c48", [ven], venK.getPointAt(0.12));
  del("bronhiol", "Respiratorni bronhiol", "Bronchiolus respiratorius", "Najtanjša dihalna cevka; po njej pride zrak v mešičke. V prerezu so vidni sluznica in gladke mišice.", "#f3c6c0", [bron, bronNm, bronR, misice], bk.getPointAt(0.25).add(V(RB, 0, 20)));

  let prikazPlinov = true;
  const nadzor = [
    { tip: "stikalo", id: "plini", oznaka: "Pokaži izmenjavo plinov", vrednost: true, ob: (v) => { prikazPlinov = !!v; o2.visible = co2.visible = prikazPlinov; for (const s of plini.napisi || []) s.visible = prikazPlinov; } },
  ];
  if (ctx.zacetek && "plini" in ctx.zacetek) { const v = /^(1|true|da)$/i.test(String(ctx.zacetek.plini)); nadzor[0].vrednost = v; nadzor[0].ob(v); }

  let zadnji = 0;
  return {
    group,
    get deli() { return prikazPlinov ? deli : deli.filter((d) => d.id !== "plini"); },
    nadzor,
    korak(t) {
      if (!gib) return;
      const dt = Math.min(0.1, Math.max(0, t - zadnji));
      zadnji = t;
      for (const k of krv) k.u = (k.u + (dt * k.hitro * 300) / k.pot.L) % 1;
      postaviKrv();
      if (prikazPlinov) postaviPline(t);
      svet.scale.setScalar(S * (1 + 0.018 * Math.sin(t * 1.5))); // dihanje
    },
    pogled: [0.28, 0.32, 1],
    okvir: { sredisce: [0, -0.02, 0], polmer: 0.9 },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      for (const x of odpad) x.dispose();
    },
  };
}
