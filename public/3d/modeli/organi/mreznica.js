// Mrežnica pod povečavo (»Poglej pod povečavo« iz organa Oko): košček mrežnice v prerezu, zgoraj žilnica in pigmentni
// epitelij, spodaj notranja mejna membrana in steklovina. Mere: Ross & Pawlina, Histology (8. izd.), Junqueira's Basic
// Histology (16. izd.), pogl. Oko; viri v viri.json. Gradi se v µm (notranja skupina `svet`), skupina ima polmer ≈ 1.
// Pogodba graditelja: docs/3d.md.

export const info = {
  id: "organ-mreznica",
  naslov: "Mrežnica pod povečavo",
  podrocje: "organi",
  predmet: "BIO",
  opis: "Košček mrežnice, debel približno četrt milimetra, v prerezu. Svetloba pride od spodaj iz steklovine in gre skozi vse plasti do paličic in čepkov zgoraj; signal se vrne do ganglijskih celic in po vidnem živcu v možgane. Paličice in čepki so narisani približno dvakrat debelejši in jih je manj kot v resnici, jamica rumene pege je zelo stisnjena.",
  poskusi: "Pošlji svetlobo in preštej, skozi koliko plasti gre, preden zadene čepek. Nato izberi rumeno pego.",
  merilo: { m: 280e-6, oznaka: "280 µm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const gib = ctx.gibanje !== false;
  const S = 1 / 140, YC = -60; // µm → enote; navpično središče bloka
  const group = new THREE.Group();
  const svet = new THREE.Group();
  svet.scale.setScalar(S);
  svet.position.y = -YC * S;
  group.add(svet);
  const U = (x, y, z) => [x * S, (y - YC) * S, z * S].map((v) => Math.round(v * 1000) / 1000);
  const odpad = [];
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const o = new THREE.Object3D();
  let seme = 11;
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

  // ---------- obod bloka: zaobljen pravokotnik 2A × 2B ----------
  const A = 80, B = 30, RC = 7, a = A - RC, b = B - RC;
  const ravna = (x0, z0, x1, z1, nx, nz) => [Math.hypot(x1 - x0, z1 - z0), (t) => ({ x: x0 + (x1 - x0) * t, z: z0 + (z1 - z0) * t, nx, nz })];
  const lok = (cx, cz, a0) => [(Math.PI / 2) * RC, (t) => { const f = a0 + (t * Math.PI) / 2; return { x: cx + RC * Math.cos(f), z: cz + RC * Math.sin(f), nx: Math.cos(f), nz: Math.sin(f) }; }];
  const ODSEKI = [ravna(A, -b, A, b, 1, 0), lok(a, b, 0), ravna(a, B, -a, B, 0, 1), lok(-a, b, Math.PI / 2), ravna(-A, b, -A, -b, -1, 0), lok(-a, -b, Math.PI), ravna(-a, -B, a, -B, 0, -1), lok(a, -b, 1.5 * Math.PI)];
  const OBOD = [];
  {
    let s = 0;
    for (const [L, f] of ODSEKI) {
      const n = Math.max(3, Math.ceil(L / (hi ? 2.5 : 4)));
      for (let i = 0; i <= n; i++) OBOD.push({ ...f(i / n), s: s + (L * i) / n });
      s += L;
    }
  }
  const vObodu = (x, z, m) => {
    const dx = Math.abs(x) - (a - 0), dz = Math.abs(z) - (b - 0);
    if (Math.abs(x) > A - m || Math.abs(z) > B - m) return false;
    return !(dx > 0 && dz > 0 && Math.hypot(dx, dz) > RC - m);
  };

  // ---------- meje plasti (µm, y navzgor; 0 = zunanja mejna membrana) ----------
  // Ross: mrežnica ob rumeni pegi ~ 250 µm, na obrobju ~ 100–200 µm; tu tipičen sloj blizu pege.
  const GL = { bruch: 60, pe: 58, peSp: 46, olm: 0, onl: -45, opl: -65, inl: -100, ipl: -135, gcl: -150, nfl: -170 };
  let fovea = false;
  const jama = (x) => (fovea ? 1 - 0.95 * Math.exp(-((x / 34) ** 2)) : 1);
  const FAZA = { bruch: 0.3, pe: 0.3, onl: 1.1, opl: 2.3, inl: 3.4, ipl: 4.6, gcl: 5.2, nfl: 6.1 };
  const val = (k, x, z) => (FAZA[k] == null ? 0 : 0.9 * Math.sin(x * 0.07 + FAZA[k] * 1.7 + z * 0.05) + 0.6 * Math.sin(x * 0.13 - z * 0.11 + FAZA[k] * 2.9));
  function Y(k, x, z) {
    if (k === "ilm") return Y("nfl", x, z) - 2.2;
    const d0 = GL[k];
    if (d0 >= GL.olm) return d0 + (k === "bruch" || k === "pe" ? val(k, x, z) * 0.5 : 0);
    if (k === "onl") return d0 + val(k, x, z);
    const j = jama(x);
    return GL.onl + (d0 - GL.onl) * j + val(k, x, z) * j;
  }
  const sredina = (k1, k2, x, z = B) => (Y(k1, x, z) + Y(k2, x, z)) / 2;

  // Plast med mejama: stene po obodu (rez), po želji zgornja/spodnja ploskev. Skupine: 0 stene, 1 zgoraj, 2 spodaj.
  function plast(kZg, kSp, { zgoraj = false, spodaj = false } = {}) {
    const pos = [], nor = [], uv = [], idx = [];
    for (const p of OBOD) {
      const y0 = Y(kSp, p.x, p.z), y1 = Y(kZg, p.x, p.z);
      for (const yy of [y0, y1]) { pos.push(p.x, yy, p.z); nor.push(p.nx, 0, p.nz); uv.push(p.s / 40, yy / 40); }
    }
    for (let i = 0; i < OBOD.length - 1; i++) {
      const a0 = i * 2, a1 = a0 + 1, b0 = a0 + 2, b1 = a0 + 3;
      idx.push(a0, b1, b0, a0, a1, b1);
    }
    const geos = [geo(pos, nor, uv, idx)];
    if (zgoraj) geos.push(ploskev(kZg, true));
    if (spodaj) geos.push(ploskev(kSp, false));
    const counts = geos.map((g) => g.index.count);
    const g = zdruzi(geos);
    let start = 0;
    counts.forEach((c, i) => { g.addGroup(start, c, i); start += c; });
    return g;
  }
  // Zgornja (gor) ali spodnja ploskev plasti po meji k.
  function ploskev(k, gor) {
      const nx = hi ? 64 : 30, nz = hi ? 24 : 10, P = [], I = [], T = [];
      for (let j = 0; j <= nz; j++) for (let i = 0; i <= nx; i++) {
        let x = -A + (2 * A * i) / nx, z = -B + (2 * B * j) / nz;
        const dx = Math.abs(x) - a, dz = Math.abs(z) - b;
        if (dx > 0 && dz > 0) { const l = Math.hypot(dx, dz), f = Math.min(l, RC) / l; x = Math.sign(x) * (a + dx * f); z = Math.sign(z) * (b + dz * f); }
        P.push(x, Y(k, x, z), z); T.push(x / 40, z / 40);
      }
      const w = nx + 1;
      for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
        const p00 = j * w + i, p10 = p00 + 1, p01 = p00 + w, p11 = p01 + 1;
        if (gor) I.push(p00, p01, p10, p10, p01, p11); else I.push(p00, p10, p01, p10, p11, p01);
      }
      return geo(P, null, T, I);
  }

  // ---------- teksture rezov ----------
  const T = {};
  {
    const n1 = valovi(3, 9, 4), n2 = valovi(5, 14, 12), n3 = valovi(8, 10, 3, 24), n4 = valovi(13, 16, 22);
    T.pleksi = tekstura(128, (u, v) => 0.8 + 0.09 * n1(u, v) + 0.08 * n2(u, v) + 0.05 * n4(u, v));
    T.vlakna = tekstura(128, (u, v) => 0.8 + 0.06 * n1(u, v) + 0.13 * n3(u, v) + 0.03 * n4(u, v));
    T.matriks = tekstura(128, (u, v) => 0.86 + 0.08 * n1(u, v) + 0.05 * n2(u, v));
    // pigmentni epitelij: meje celic (vsakih 14 µm), melanin temnejši v spodnjem (apikalnem) delu
    T.pe = tekstura(128, (u, v) => { const m = Math.abs(((u * 40) / 13.3) % 1 - 0.5); return (0.55 + 0.3 * Math.min(1, (0.5 - m) * 9)) * (0.9 + 0.1 * n2(u, v)) * (0.92 + 0.08 * n4(u, v)); });
  }
  const rezMat = (barva, tex, x = {}) => mat(barva, { map: tex, bumpMap: tex, bumpScale: 1.4, roughness: 0.62, clearcoat: 0.18, ...x });
  const M = {
    bruch: rezMat(0xead9c0, T.matriks, { clearcoat: 0.4 }),
    pe: rezMat(0x6a3d2c, T.pe, { roughness: 0.55 }),
    peSp: mat(0x4a2a1e, { roughness: 0.6 }),
    onl: rezMat(0xc9a6d6, T.matriks),
    olm: mat(0xf2dbe6, { roughness: 0.45, clearcoat: 0.5 }),
    opl: rezMat(0xeab4c0, T.pleksi),
    inl: rezMat(0xc7a2cf, T.matriks),
    ipl: rezMat(0xe6aeba, T.pleksi),
    gcl: rezMat(0xe6c0b8, T.matriks),
    nfl: rezMat(0xf0cfb4, T.vlakna),
    ilm: mat(0xdff1f4, { roughness: 0.25, clearcoat: 1 }),
  };
  const jedroMat = { onl: mat(0x6650b4, { roughness: 0.42, clearcoat: 0.6 }), inl: mat(0x7d63c4, { roughness: 0.42, clearcoat: 0.6 }), gcl: mat(0xeec872, { roughness: 0.45, clearcoat: 0.5 }) };
  const recMat = mat(0xffffff, { vertexColors: true, roughness: 0.4, clearcoat: 0.6, sheen: 0.6 });
  const conMat = mat(0xffffff, { vertexColors: true, roughness: 0.38, clearcoat: 0.6, sheen: 0.6 });
  const mvMat = mat(0x3f2318, { roughness: 0.6 });
  const kapMat = mat(0xc4505a, { roughness: 0.35, clearcoat: 0.8 }), kriMat = mat(0x8e1f2c, { roughness: 0.5 });
  const VERIGA = {
    cep: mat(0xf0b45e, { emissive: 0x000000 }), pal: mat(0xb07ad2, { emissive: 0x000000 }), hor: mat(0xf08a5d, { emissive: 0x000000 }),
    bip: mat(0x5aa6ea, { emissive: 0x000000 }), ama: mat(0x46c2a2, { emissive: 0x000000 }), gan: mat(0xf2d35c, { emissive: 0x000000 }),
  };
  const zarekMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  odpad.push(zarekMat);

  // Barve čutnic po višini (zunanji členek paličice: rodopsin, vijoličen; čepek: zlat).
  const C = (h) => new THREE.Color(h);
  const mesaj = (c1, c2, t) => c1.clone().lerp(c2, Math.max(0, Math.min(1, t)));
  const palBarva = (y) => (y < 21 ? mesaj(C(0xf3c9cf), C(0xe7a3b6), (y - 4) / 12) : y < 23.5 ? C(0xfbe6dc) : mesaj(C(0xb27ccc), C(0x8c56b0), (y - 24) / 24));
  const cepBarva = (y, vrh) => (y < 21 ? mesaj(C(0xf8d6a4), C(0xf0b67a), (y - 4) / 12) : y < 23.2 ? C(0xfdeccf) : mesaj(C(0xeaa648), C(0xcf8128), (y - 23) / (vrh - 23)));
  const nR = hi ? 7 : 5;
  const PAL = [[1.0, -1], [1.2, 4], [1.9, 9], [2.3, 14], [2.2, 18], [1.4, 21], [0.6, 22.2], [0.6, 23.2], [1.9, 24.1], [2.0, 26], [2.0, 45.5], [1.5, 47.4], [0.01, 48]];
  const CEP = [[1.5, -1], [1.9, 2], [3.2, 6], [3.9, 11], [3.8, 15], [3.0, 19], [1.6, 21.4], [0.7, 22.3], [0.7, 23], [2.1, 23.6], [1.8, 27], [1.2, 31], [0.6, 34], [0.01, 34.6]];
  const CEPF = [[0.9, -1], [1.05, 4], [1.6, 10], [1.95, 16], [1.7, 21.5], [0.55, 23.2], [0.55, 24.2], [1.25, 25], [1.2, 38], [0.8, 44.5], [0.01, 46]];
  const palG = vrtenina(PAL, nR, palBarva);
  const cepG = vrtenina(CEP, hi ? 10 : 7, (y) => cepBarva(y, 34.6));
  const cepfG = vrtenina(CEPF, nR, (y) => cepBarva(y, 46));
  const jedroG = new THREE.SphereGeometry(1, hi ? 7 : 6, hi ? 5 : 4);
  const mvG = new THREE.ConeGeometry(0.75, 1, hi ? 5 : 4, 1, true).rotateX(Math.PI).translate(0, -0.5, 0); // vrh navzdol
  const somaG = new THREE.SphereGeometry(1, hi ? 12 : 8, hi ? 9 : 6);
  odpad.push(palG, cepG, cepfG, jedroG, mvG, somaG);

  // ---------- stanje sestave (zgradi se znova ob preklopu obrobje/rumena pega) ----------
  let deli = [], veriga = [], zarek = null, fotoni = null, fotonY = [], xZ = 0, vrhZ = 34;
  const mreze = []; // mreže te sestave (geometrija se ob preklopu zavrže)
  const dodaj = (m) => { svet.add(m); mreze.push(m); return m; };
  const instanc = (g, m, mats, deljena = true) => {
    const im = new THREE.InstancedMesh(g, m, Math.max(1, mats.length));
    mats.forEach((x, i) => im.setMatrixAt(i, x));
    im.count = mats.length;
    im.userData.deljena = deljena;
    im.computeBoundingSphere();
    return dodaj(im);
  };
  const matrika = (x, y, z, sx, sy = sx, sz = sx, ry = 0) => { o.position.set(x, y, z); o.rotation.set(0, ry, 0); o.scale.set(sx, sy, sz); o.updateMatrix(); return o.matrix.clone(); };
  function del(id, ime, la, opis, barva, meshes, tocka, x = {}) {
    deli.push({ id, ime, la, opis, barva, meshes, tocka: U(...tocka), ...x });
  }

  // Jedra na stenah reza: polovica jedra moli iz reza (kot pri pravem rezu tkiva).
  function jedraNaSteni(kZg, kSp, razmik, rx, ry, vrste = 1) {
    const out = [];
    seme = 101 + razmik * 7;
    for (let i = 0; i < OBOD.length; i++) {
      const p = OBOD[i];
      if (i > 0 && p.s - (out._s ?? -99) < razmik * (0.85 + 0.3 * rnd())) continue;
      out._s = p.s;
      const y0 = Y(kSp, p.x, p.z), y1 = Y(kZg, p.x, p.z), h = y1 - y0;
      if (h < ry * 1.6) continue;
      const n = Math.max(1, Math.round((h / (ry * 2.15)) * vrste));
      for (let k = 0; k < n; k++) {
        const t = (k + 0.5 + (rnd() - 0.5) * 0.5) / n, s = 0.85 + rnd() * 0.3;
        const y = y0 + ry + (h - 2 * ry) * Math.max(0, Math.min(1, t));
        const off = rx * (0.25 + rnd() * 0.25), dz = (rnd() - 0.5) * razmik * 0.35;
        out.push(matrika(p.x - p.nx * off - p.nz * dz, y, p.z - p.nz * off + p.nx * dz, rx * s, ry * s, rx * s, rnd() * 3));
      }
    }
    return out;
  }

  function sestavi() {
    for (const m of mreze) { svet.remove(m); if (!m.userData.deljena || !m.isInstancedMesh) m.geometry.dispose(); }
    mreze.length = 0;
    deli = [];
    seme = 11;

    // plasti
    const pl = (kZg, kSp, m, x = {}) => dodaj(new THREE.Mesh(plast(kZg, kSp, x), Array.isArray(m) ? m : [m, m, m]));
    const bruch = pl("bruch", "pe", [M.bruch, M.bruch, M.bruch], { zgoraj: true });
    const pe = pl("pe", "peSp", [M.pe, M.pe, M.peSp], { spodaj: true });
    const onl = pl("olm", "onl", M.onl);
    const olm = dodaj(new THREE.Mesh(ploskev("olm", true), M.olm));
    const opl = pl("onl", "opl", M.opl);
    const inl = pl("opl", "inl", M.inl);
    const ipl = pl("inl", "ipl", M.ipl);
    const gcl = pl("ipl", "gcl", M.gcl);
    const nfl = pl("gcl", "nfl", M.nfl);
    const ilm = pl("nfl", "ilm", [M.ilm, M.ilm, M.ilm], { spodaj: true });

    // žilnica: kapilare na Bruchovi membrani, prerezane na stenah (kri v svetlini)
    const kapG = [], kriG = [];
    for (const [z0, f] of [[-21, 0.3], [-7, 1.9], [8, 3.1], [21, 4.4]]) {
      const pts = [];
      for (let i = 0; i <= 16; i++) { const x = -A + 0.3 + ((2 * A - 0.6) * i) / 16; pts.push([x, GL.bruch + 3.6 + 0.6 * Math.sin(x * 0.09 + f), z0 + 2.2 * Math.sin(x * 0.045 + f * 2)]); }
      const g = cev(pts, 4.0, hi ? 48 : 28, hi ? 12 : 8);
      kapG.push(g);
      for (const p of [pts[0], pts[16]]) kriG.push(new THREE.CircleGeometry(3.1, hi ? 14 : 9).rotateY(p[0] > 0 ? Math.PI / 2 : -Math.PI / 2).translate(p[0] + Math.sign(p[0]) * 0.35, p[1], p[2]));
    }
    const kap = dodaj(new THREE.Mesh(zdruzi(kapG), kapMat));
    const kri = dodaj(new THREE.Mesh(zdruzi(kriG), kriMat));

    // čutnice: šesterokotna mreža; obrobje: paličice + redki čepki (≈ 1 : 20), rumena pega: samo vitki čepki
    const xc = fovea ? -50 : -30; // veriga celic na sprednjem rezu
    xZ = fovea ? 0 : xc;
    const z0 = B - 4;
    const korak = fovea ? (hi ? 4.6 : 6.4) : hi ? 5.2 : 6.6;
    const dz = korak * 0.866;
    const pal = [], cep = [];
    const cepki = [];
    if (!fovea) {
      const kc = 28, dzc = kc * 0.866;
      for (let j = 0; j < 4; j++) for (let i = -4; i <= 4; i++) {
        const x = xc + i * kc + (j % 2) * kc * 0.5, z = z0 - j * dzc;
        if (vObodu(x, z, 4)) cepki.push([x, z]);
      }
    }
    for (let j = 0; z0 - j * dz > -B + 2; j++) for (let i = -40; i <= 40; i++) {
      const x = (fovea ? 0 : xc) + i * korak + (j % 2) * korak * 0.5, z = z0 - j * dz;
      if (!vObodu(x, z, 2.4)) continue;
      if (cepki.some(([cx, cz]) => Math.hypot(cx - x, cz - z) < 6.2)) continue;
      const ry = rnd() * 6.283, h = 1 + (rnd() - 0.5) * 0.04;
      (fovea ? cep : pal).push(matrika(x, 0, z, 1, h, 1, ry));
    }
    for (const [x, z] of cepki) cep.push(matrika(x, 0, z, 1, 1, 1, rnd() * 6.283));
    const palM = pal.length ? instanc(palG, recMat, pal) : null;
    const cepM = instanc(fovea ? cepfG : cepG, conMat, cep);
    vrhZ = fovea ? 46 : 34.6;

    // mikrovili pigmentnega epitelija med zunanjimi členki
    const mv = [];
    for (let j = 0; z0 - j * dz - dz / 3 > -B + 2; j++) for (let i = -40; i <= 40; i++) {
      const x = (fovea ? 0 : xc) + i * korak + (j % 2) * korak * 0.5 + korak * 0.5, z = z0 - j * dz - dz * 0.33;
      if (!vObodu(x, z, 2) || rnd() < 0.25) continue;
      mv.push(matrika(x, GL.peSp + 0.5, z, 0.9, 6 + rnd() * 4, 0.9));
    }
    const mvM = instanc(mvG, mvMat, mv);

    // jedra in telesa celic na rezih
    const onlJ = instanc(jedroG, jedroMat.onl, jedraNaSteni("olm", "onl", hi ? 5.2 : 8.6, 2.6, 3.0, 1.12));
    const inlJ = instanc(jedroG, jedroMat.inl, jedraNaSteni("opl", "inl", hi ? 6.6 : 9.5, 3.3, 3.7, 1.1));
    const ganJ = instanc(somaG, jedroMat.gcl, jedraNaSteni("ipl", "gcl", 15, 6.2, 5.4));

    // ---------- veriga na sprednjem rezu: čepek → bipolarna → ganglijska celica (+ paličica, horizontalna, amakrina) ----------
    const zf = B + 0.2;
    const yOPL = (x) => sredina("onl", "opl", x), yINL = (x) => sredina("opl", "inl", x), yIPL = (x) => sredina("inl", "ipl", x), yGCL = (x) => sredina("ipl", "gcl", x), yNFL = (x) => sredina("gcl", "nfl", x);
    const xp = fovea ? xc + 4 : xc + 6; // pedikel čepka
    // čepek: jedro tik pod zunanjo mejno membrano, vlakno do pedikla v zunanjem pleksiformnem sloju
    const cepVl = fovea ? [[0, -1, z0], [-6, -14, zf], [-24, -32, zf], [xp, Y("onl", xp, B) - 2, zf]] : [[xc, -1, z0 + 0.5], [xc + 0.5, -12, zf], [xc + 3, -30, zf], [xp, Y("onl", xp, B) - 2, zf]];
    const gCep = [cev(cepVl, 1.5, 24), kroglica(fovea ? -3 : xc + 0.4, -6, zf - 0.6, 3.6, 4.6, 3.2), kroglica(xp, Y("onl", xp, B) - 4.5, zf - 0.4, 5.2, 2.8, 3.0)];
    // paličica: jedro globlje v zunanjem jedrnem sloju, majhna kroglica (sferula)
    const xr = xc + 19;
    const gPal = [cev([[xr, -1, zf - 0.8], [xr + 0.6, -14, zf], [xr, -36, zf], [xr + 1, Y("onl", xr, B) - 2.5, zf]], 1.1, 18), kroglica(xr, -24, zf - 0.6, 2.9, 3.4, 2.8), kroglica(xr + 1, Y("onl", xr, B) - 3, zf - 0.3, 2.2)];
    // horizontalna celica: ploščato telo na vrhu notranjega jedrnega sloja, odrastki vodoravno v zunanjem pleksiformnem
    const xh = xc + 22, yh = Y("opl", xh, B) - 4.5;
    const gHor = [kroglica(xh, yh, zf - 0.8, 7.5, 3.8, 3.4)];
    for (const [x1, y1] of [[xh - 24, yOPL(xh - 24) + 2], [xh + 22, yOPL(xh + 22) + 3], [xp + 1, Y("onl", xp, B) - 6.5], [xr + 1, Y("onl", xr, B) - 4.5]]) gHor.push(cev([[xh + Math.sign(x1 - xh) * 3, yh + 1.5, zf], [(xh + x1) / 2, yOPL(xh) - 1, zf], [x1, y1, zf]], (t) => 1.8 - 0.8 * t, 14));
    // bipolarna celica
    const xb = xc + 8, yb = yINL(xb);
    const gBip = [kroglica(xb, yb, zf - 0.6, 4.4, 5.8, 3.4), cev([[xb, yb - 4, zf], [xb + 0.6, yIPL(xb), zf], [xb + 1.5, yIPL(xb) - 9, zf]], (t) => 1.6 - 0.4 * t, 16), kroglica(xb + 1.5, yIPL(xb) - 10, zf - 0.4, 2.8)];
    for (const dx of [-3.5, 0, 3.5]) gBip.push(cev([[xb, yb + 4, zf], [xb + dx * 0.4, Y("opl", xb, B) + 1, zf], [xp + dx, Y("onl", xp, B) - 6.2, zf]], (t) => 1.4 - 0.6 * t, 12));
    // amakrina celica: telo na dnu notranjega jedrnega sloja, odrastki samo v notranjem pleksiformnem sloju
    const xa = xc - 16, ya = Y("inl", xa, B) + 4.5;
    const gAma = [kroglica(xa, ya, zf - 0.6, 5.0, 4.6, 3.4)];
    for (const [x1, y1] of [[xa - 18, yIPL(xa) - 6], [xa - 6, yIPL(xa) - 11], [xa + 9, yIPL(xa) - 8], [xa + 17, yIPL(xa) - 3]]) gAma.push(cev([[xa, ya - 3, zf], [(xa + x1) / 2, yIPL(xa) + 3, zf], [x1, y1, zf]], (t) => 1.6 - 0.8 * t, 14));
    // ganglijska celica: telo v ganglijskem sloju, dendriti navzgor, akson v sloj živčnih vlaken in proti vidnemu živcu
    const xg = xc + 11, yg = yGCL(xg);
    const gGan = [kroglica(xg, yg, zf - 0.9, 7.6, 6.6, 4.2)];
    for (const [x1, y1] of [[xb + 1.5, yIPL(xb) - 10], [xg + 14, yIPL(xg) - 2], [xg - 12, yIPL(xg) - 6]]) gGan.push(cev([[xg, yg + 5, zf], [(xg + x1) / 2, yg + 14, zf], [x1, y1, zf]], (t) => 2.2 - 1.1 * t, 14));
    const ys = yNFL(xg);
    gGan.push(cev([[xg, yg - 5, zf], [xg - 2, ys + 2, zf], [xg - 12, ys, zf], [-A + 18, yNFL(-A + 18), zf], [-A + 1.2, yNFL(-A + 1), zf]], 1.7, 40));
    const vm = (g, m, z) => [dodaj(new THREE.Mesh(zdruzi(g), m)), m, z];
    veriga = [
      vm(gCep, VERIGA.cep, 0), vm(gPal, VERIGA.pal, 0.05), vm(gHor, VERIGA.hor, 0.35),
      vm(gBip, VERIGA.bip, 0.38), vm(gAma, VERIGA.ama, 0.62), vm(gGan, VERIGA.gan, 0.75),
    ];

    // ---------- svetloba: žarek iz steklovine skozi vse plasti do čepka ----------
    const yDno = -196, zz = B - 1.2;
    const zg = new THREE.CylinderGeometry(3.4, 3.4, vrhZ - yDno, hi ? 20 : 12, 24, true).translate(xZ, (vrhZ + yDno) / 2, zz);
    const zp = zg.attributes.position, zc = [];
    for (let i = 0; i < zp.count; i++) { const t = (zp.getY(i) - yDno) / (vrhZ - yDno); const al = Math.min(1, t * 5) * (0.55 - 0.25 * t); zc.push(1, 0.84, 0.45, al * 0.6); }
    zg.setAttribute("color", new THREE.Float32BufferAttribute(zc, 4));
    zarek = dodaj(new THREE.Mesh(zg, zarekMat));
    zarek.raycast = () => {};
    zarek.renderOrder = 2;
    fotonY = [];
    const fp = [];
    for (let i = 0; i < 7; i++) { fotonY.push(yDno + ((vrhZ - yDno) * i) / 7); fp.push(xZ, fotonY[i], B + 1.6); }
    const fg = new THREE.BufferGeometry();
    fg.setAttribute("position", new THREE.Float32BufferAttribute(fp, 3));
    fotoni = dodaj(new THREE.Points(fg, fotonMat));
    fotoni.raycast = () => {};
    fotoni.renderOrder = 3;
    if (napis) napis.position.set((xZ + 6) * S, (yDno + 4 - YC) * S, B * S);

    // ---------- deli ----------
    const yMid = (k1, k2, x) => sredina(k1, k2, x);
    const xd = 62; // točke ob desnem robu sprednjega reza
    del("zilnica", "Žilnica (kapilare)", "Lamina choroidocapillaris", "Gosta mreža širokih kapilar tik nad mrežnico; hrani pigmentni epitelij in čutnice.", "#d0606a", [kap, kri], [40, GL.bruch + 6, 8]);
    del("bruchova-membrana", "Bruchova membrana", "Lamina basalis choroideae", "Tanka plast med žilnico in pigmentnim epitelijem; skoznjo prehajajo hranila in kisik.", "#ead9c0", [bruch], [xd, GL.bruch, B], { skrijTocko: true });
    del("pigmentni-epitelij", "Pigmentni epitelij", "Stratum pigmentosum", "Ena plast celic s temnim pigmentom melaninom; vpije odvečno svetlobo in vsak dan »poje« obrabljene konice zunanjih členkov.", "#8a5a44", [pe, mvM], [xd, 52, B]);
    if (palM) del("palicice", "Paličice", "Cellulae bacilliferae", "Vitke čutnice z dolgim valjastim zunanjim členkom; zaznajo že zelo šibko svetlobo, ne ločijo pa barv. Zunaj rumene pege jih je okoli 20-krat več kot čepkov.", "#b27ccc", [palM], [xd - 6, 34, B - 4], { povecava: "celica-palicica-cepek" });
    del("cepki", "Čepki", "Cellulae coniferae", fovea ? "V rumeni pegi so samo čepki, tanki in tesno skupaj; zato tu vidimo najostreje in v barvah." : "Čutnice s stožčastim zunanjim členkom; delujejo pri dnevni svetlobi in nam omogočajo barvni vid.", "#eaa648", [cepM], fovea ? [10, 30, B - 4] : [xc, 28, B - 3], { povecava: "celica-palicica-cepek" });
    del("zunanja-mejna-membrana", "Zunanja mejna membrana", "Stratum limitans externum", "Ni prava membrana, temveč vrsta stikov med čutnicami in Müllerjevimi celicami; loči členke od jeder.", "#f2dbe6", [olm], [xd + 8, 0.5, 4], { skrijTocko: true });
    del("zunanji-jedrni-sloj", "Zunanji jedrni sloj", "Stratum nucleare externum", "Jedra paličic in čepkov, naložena v več vrstah; jedra čepkov so večja in ležijo tik pod zunanjo mejno membrano.", "#6650b4", [onlJ, onl], [xd, -24, B]);
    del("zunanji-pleksiformni-sloj", "Zunanji pleksiformni sloj", "Stratum plexiforme externum", "Tu se čutnice s sinapsami povežejo z bipolarnimi in horizontalnimi celicami.", "#eab4c0", [opl], [xd, yMid("onl", "opl", xd), B], { skrijTocko: true });
    del("horizontalne-celice", "Horizontalne celice", "Neurocyti horizontales", "Povezujejo sosednje čutnice vodoravno in poudarijo meje med svetlim in temnim (kontrast).", "#f08a5d", [veriga[2][0]], [xh, yh, zf]);
    del("bipolarne-celice", "Bipolarne celice", "Neurocyti bipolares", "Prenašajo signal od čutnic do ganglijskih celic; so drugi nevron na vidni poti.", "#5aa6ea", [veriga[3][0]], [xb, yb, zf]);
    del("amakrine-celice", "Amakrine celice", "Neurocyti amacrini", "Celice brez aksona, ki v notranjem pleksiformnem sloju povezujejo bipolarne in ganglijske celice; pomagajo zaznati gibanje.", "#46c2a2", [veriga[4][0]], [xa, ya, zf]);
    del("notranji-jedrni-sloj", "Notranji jedrni sloj", "Stratum nucleare internum", "Jedra bipolarnih, horizontalnih, amakrinih in Müllerjevih (opornih) celic.", "#7d63c4", [inl, inlJ], [xd, yMid("opl", "inl", xd), B], { skrijTocko: true });
    del("notranji-pleksiformni-sloj", "Notranji pleksiformni sloj", "Stratum plexiforme internum", "Tu se bipolarne in amakrine celice s sinapsami povežejo z dendriti ganglijskih celic.", "#e6aeba", [ipl], [xd, yMid("inl", "ipl", xd), B], { skrijTocko: true });
    del("ganglijske-celice", "Ganglijske celice", "Neurocyti ganglionares", "Največji nevroni mrežnice; njihovi aksoni gredo po vidnem živcu v možgane.", "#f2d35c", [veriga[5][0], ganJ, gcl], [xg, yg, zf]);
    del("veriga-cutnic", "Pot signala v čutnici", "Fibra photoreceptoria", "Vlakno čutnice vodi signal od jedra do sinapse v zunanjem pleksiformnem sloju.", "#f0b45e", [veriga[0][0], veriga[1][0]], [xc + 0.5, -16, zf], { skrijTocko: true });
    del("sloj-zivcnih-vlaken", "Sloj živčnih vlaken", "Stratum neurofibrarum", "Aksoni ganglijskih celic tečejo vzporedno s površino do slepe pege, kjer skupaj zapustijo oko kot vidni živec.", "#f0cfb4", [nfl], [xd, yMid("gcl", "nfl", xd), B]);
    del("notranja-mejna-membrana", "Notranja mejna membrana", "Stratum limitans internum", "Gladka meja med mrežnico in steklovino; iz te strani pride svetloba.", "#bfe6ee", [ilm], [xd, Y("ilm", xd, B) - 1, B], { skrijTocko: true });
  }

  // fotoni: svetle točke, ki potujejo po žarku navzgor
  const fotonTex = tekstura(32, (u, v) => Math.max(0, 1 - Math.hypot(u - 0.5, v - 0.5) * 2.1) ** 1.5);
  const fotonMat = new THREE.PointsMaterial({ color: 0xfff1b0, size: 0.3, map: fotonTex, alphaMap: fotonTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
  odpad.push(fotonMat);

  // napis »svetloba« pod blokom (samo v brskalniku)
  let napis = null;
  if (typeof document !== "undefined") {
    const cv = document.createElement("canvas");
    cv.width = 640; cv.height = 128;
    const c2 = cv.getContext("2d");
    if (c2) {
      c2.font = "600 46px system-ui, sans-serif"; c2.textAlign = "left"; c2.textBaseline = "middle";
      c2.fillStyle = "#ffe9a8"; c2.fillText("↑ svetloba iz steklovine", 6, 64);
      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sm = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
      odpad.push(sm, tex);
      napis = new THREE.Sprite(sm);
      napis.scale.set(0.5, 0.1, 1);
      napis.center.set(0, 0.5);
      napis.raycast = () => {};
      group.add(napis);
    }
  }

  sestavi();

  // ---------- animacija: fotoni navzgor, nato val signala po verigi ----------
  let t0 = 0, zadnji = 0;
  const CIKEL = 4.2;
  function korak(t) {
    if (!gib) return;
    zadnji = t;
    const f = (t - t0) % CIKEL;
    const p = fotoni.geometry.attributes.position, pot = vrhZ + 196, n = fotonY.length;
    for (let i = 0; i < n; i++) p.setY(i, -196 + ((i / n + f / 1.6) % 1) * pot);
    p.needsUpdate = true;
    fotoni.visible = f < 1.6;
    // val signala: od čutnic (z = 0) do ganglijske celice (z = 0,75) v 1,2 s
    for (const [, m, z] of veriga) {
      const d = Math.abs(f - 1.7 - z * 1.6);
      m.emissive.setRGB(1, 0.95, 0.75).multiplyScalar(Math.max(0, 1 - d / 0.35) * 0.55);
    }
  }
  const prikazFotonov = () => { // brez gibanja: fotoni mirujejo vzdolž žarka
    const p = fotoni.geometry.attributes.position;
    for (let i = 0; i < fotonY.length; i++) p.setY(i, fotonY[i]);
    p.needsUpdate = true;
  };
  if (!gib) prikazFotonov();

  const nadzor = [
    {
      tip: "izbira", id: "mesto", oznaka: "Del mrežnice", moznosti: [["obrobje", "Zunaj rumene pege"], ["pega", "Rumena pega"]], vrednost: "obrobje",
      ob: (v) => { fovea = v === "pega"; sestavi(); if (!gib) prikazFotonov(); t0 = zadnji; },
    },
    { tip: "gumb", id: "svetloba", oznaka: "Pošlji svetlobo", ob: () => { t0 = zadnji; } },
  ];
  if (ctx.zacetek?.mesto === "pega") { nadzor[0].vrednost = "pega"; nadzor[0].ob("pega"); }

  return {
    group,
    get deli() { return deli; },
    nadzor,
    korak,
    pogled: [0.62, 0.16, 1],
    okvir: { sredisce: [0, -0.05, 0], polmer: 1 },
    dispose() {
      for (const m of mreze) m.geometry.dispose();
      for (const x of odpad) x.dispose();
      if (napis) napis.geometry.dispose();
    },
  };
}
