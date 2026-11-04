// Paličica in čepek: čutnici za svetlobo iz mrežnice, druga ob drugi, v prerezu.
// Zgoraj zunanja členka (diski, gube), spodaj sinaptična končiča. Pogodba graditelja: docs/3d.md.

export const info = {
  id: "celica-palicica-cepek",
  naslov: "Paličica in čepek",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Čutnici v mrežnici očesa: paličice zaznavajo šibko svetlobo, čepki barve. Svetloba pride od spodaj, skozi celo mrežnico, do zunanjih členkov zgoraj. Celici sta narisani približno dvakrat širši, vlakni krajši, diskov pa je manj kot v resnici (paličica jih ima okoli 1000). Debelina membrane je povečana.",
  merilo: { m: 64e-6, oznaka: "64 µm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const gib = ctx.gibanje !== false;
  const group = new THREE.Group();
  const odpad = [];
  let deli = [];

  // ---------- orodja (kot v zivalska.js) ----------
  let seme = 7;
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
  function mat(barva, o = {}) {
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: barva, roughness: 0.4, clearcoat: 0.8, clearcoatRoughness: 0.3,
      sheen: 0.5, sheenColor: new THREE.Color(0xffffff), sheenRoughness: 0.5,
    }, o));
    odpad.push(m);
    return m;
  }
  // Združi geometrije (z index ali brez) v eno; po želji pobarva vsako z barvo oglišč.
  function zdruzi(geos, barve) {
    const pos = [], nor = [], col = [], uv = [], idx = [];
    const zUv = geos.every((g) => g.attributes.uv);
    let off = 0;
    geos.forEach((g, i) => {
      const p = g.attributes.position, n = g.attributes.normal, t = g.attributes.uv;
      const c = barve ? new THREE.Color(barve[i]) : null;
      for (let k = 0; k < p.count; k++) {
        pos.push(p.getX(k), p.getY(k), p.getZ(k));
        nor.push(n.getX(k), n.getY(k), n.getZ(k));
        if (c) col.push(c.r, c.g, c.b);
        if (zUv) uv.push(t.getX(k), t.getY(k));
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
    if (zUv) out.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    out.setIndex(idx);
    return out;
  }
  function del(id, ime, opis, barva, meshes, tocka, seznam = deli) {
    meshes.forEach((m) => { m.userData.del = id; });
    seznam.push({ id, ime, opis, barva, meshes, tocka: tocka.map((x) => Math.round(x * 1000) / 1000) });
  }
  // Odrezan osmi del: x < 0, y > 0, z > 0 (proti gledalcu levo zgoraj).
  const vIzrezu = (v, c = { x: 0, y: 0, z: 0 }) => v.x < c.x && v.y > c.y && v.z > c.z;
  // Lupina z odrezanim osmim delom; f(smer) vrne polmer v tej smeri.
  function lupina(f, ws, hs) {
    const zg = new THREE.SphereGeometry(1, ws, hs / 2, Math.PI / 2, Math.PI * 1.5, 0, Math.PI / 2);
    const sp = new THREE.SphereGeometry(1, ws, hs / 2, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const pokr = new THREE.SphereGeometry(1, Math.round(ws / 4), hs / 2, 0, Math.PI / 2, 0, Math.PI / 2);
    const v = new THREE.Vector3();
    for (const g of [zg, sp, pokr]) {
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i).normalize();
        v.multiplyScalar(f(v));
        p.setXYZ(i, v.x, v.y, v.z);
      }
      g.computeVertexNormals();
    }
    return { odprta: zdruzi([zg, sp]), pokrov: pokr };
  }
  // Rob prereza: tri loki na meji odrezanega osmega dela.
  function rob(f, debelina, seg) {
    const loki = [
      (t) => new THREE.Vector3(0, Math.cos(t * Math.PI / 2), Math.sin(t * Math.PI / 2)),
      (t) => new THREE.Vector3(-Math.sin(t * Math.PI / 2), Math.cos(t * Math.PI / 2), 0),
      (t) => new THREE.Vector3(-Math.cos(t * Math.PI / 2), 0, Math.sin(t * Math.PI / 2)),
    ];
    return zdruzi(loki.map((L) => {
      const pts = [];
      for (let i = 0; i <= seg; i++) { const d = L(i / seg).normalize(); pts.push(d.multiplyScalar(f(d) * 0.99)); }
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, debelina, q(8), false);
    }));
  }
  // Cev s spremenljivim polmerom rF(t) vzdolž krivulje; zaobljena konca.
  function cev(krivulja, nSeg, rF, nRad, kape = true) {
    const fr = krivulja.computeFrenetFrames(nSeg, false);
    const pos = [], idx = [], P = new THREE.Vector3();
    for (let i = 0; i <= nSeg; i++) {
      krivulja.getPointAt(i / nSeg, P);
      const r = rF(i / nSeg), N = fr.normals[i], B = fr.binormals[i];
      for (let j = 0; j < nRad; j++) {
        const a = (j / nRad) * Math.PI * 2, c = Math.cos(a) * r, s = Math.sin(a) * r;
        pos.push(P.x + c * N.x + s * B.x, P.y + c * N.y + s * B.y, P.z + c * N.z + s * B.z);
      }
    }
    for (let i = 0; i < nSeg; i++) for (let j = 0; j < nRad; j++) {
      const a = i * nRad + j, b = i * nRad + ((j + 1) % nRad), c = a + nRad, d = b + nRad;
      idx.push(a, b, c, b, d, c);
    }
    if (kape) {
      for (const [i, sg] of [[0, -1], [nSeg, 1]]) {
        krivulja.getPointAt(i / nSeg, P);
        const T = fr.tangents[i], r = rF(i / nSeg), c = pos.length / 3;
        pos.push(P.x + T.x * r * 0.6 * sg, P.y + T.y * r * 0.6 * sg, P.z + T.z * r * 0.6 * sg);
        for (let j = 0; j < nRad; j++) {
          const a = i * nRad + j, b = i * nRad + ((j + 1) % nRad);
          if (sg < 0) idx.push(c, b, a); else idx.push(c, a, b);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  // Vrtenina okoli osi y iz profila [[y, r], …] (y narašča); odprta = brez četrtine x < 0, z > 0.
  function vrtenina(prof, n, odprto = true) {
    const pts = prof.map(([y, r]) => new THREE.Vector2(Math.max(r, 1e-4), y));
    if (!odprto) return { cela: new THREE.LatheGeometry(pts, n, 0, Math.PI * 2) };
    return {
      odprta: new THREE.LatheGeometry(pts, Math.round(n * 0.75), 0, Math.PI * 1.5),
      pokrov: new THREE.LatheGeometry(pts, Math.max(3, Math.round(n * 0.25)), Math.PI * 1.5, Math.PI * 0.5),
    };
  }
  // Rob prereza vrtenine: cevki po profilu pri kotih 0 in 1,5π.
  function robVrtenine(prof, debelina) {
    return zdruzi([0, Math.PI * 1.5].map((f) => {
      const pts = prof.map(([y, r]) => new THREE.Vector3(r * Math.sin(f), y, r * Math.cos(f)));
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), pts.length * 2, debelina, q(6), false);
    }));
  }
  // Ploskvi prereza vrtenine (kota 0 in 1,5π) med polmeroma rNot(y) in rZun(y); uv.x teče od notranjega do zunanjega roba.
  function ploskviPrereza(prof, rNot, nPrecno) {
    const geos = [];
    for (const f of [0, Math.PI * 1.5]) {
      const pos = [], uv = [], idx = [];
      prof.forEach(([y, r], i) => {
        const r0 = Math.min(rNot(y), r);
        for (let j = 0; j <= nPrecno; j++) {
          const rr = r0 + (r - r0) * (j / nPrecno);
          pos.push(rr * Math.sin(f), y, rr * Math.cos(f));
          uv.push(j / nPrecno, i / (prof.length - 1));
        }
      });
      const w = nPrecno + 1;
      for (let i = 0; i < prof.length - 1; i++) for (let j = 0; j < nPrecno; j++) {
        const a = i * w + j;
        idx.push(a, a + w, a + 1, a + 1, a + w, a + w + 1);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      geos.push(g);
    }
    return zdruzi(geos);
  }
  // Odstrani trikotnike, katerih težišče (v koordinatah skupine) izpolni pogoj.
  function odrezi(g, pogoj, premik = new THREE.Vector3()) {
    const p = g.attributes.position, ix = g.index.array, ost = [], a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    for (let i = 0; i < ix.length; i += 3) {
      a.fromBufferAttribute(p, ix[i]); b.fromBufferAttribute(p, ix[i + 1]); c.fromBufferAttribute(p, ix[i + 2]);
      a.add(b).add(c).multiplyScalar(1 / 3).add(premik);
      if (!pogoj(a)) ost.push(ix[i], ix[i + 1], ix[i + 2]);
    }
    g.setIndex(ost);
    return g;
  }
  // Tekstura iz funkcije f(u, v) → [r, g, b, a] (0 … 255).
  function tekstura(w, h, f, barvna = true) {
    const d = new Uint8Array(w * h * 4);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const c = f((i + 0.5) / w, (j + 0.5) / h), k = (j * w + i) * 4;
      d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = c.length > 3 ? c[3] : 255;
    }
    const t = new THREE.DataTexture(d, w, h, THREE.RGBAFormat);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.magFilter = THREE.LinearFilter;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.generateMipmaps = true;
    if (barvna) t.colorSpace = THREE.SRGBColorSpace;
    t.needsUpdate = true;
    odpad.push(t);
    return t;
  }
  // valj med točkama a in b
  function palica(a, b, r, n) {
    const d = b.clone().sub(a), L = d.length();
    const g = new THREE.CylinderGeometry(r, r, L, n, 1, true);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), d.normalize()));
    g.translate((a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
    return g;
  }
  // 3/4 krog prereza na koncu izseka (brez četrtine y > 0, z > 0), normala ±x
  function kapa(x, R, sg, nKot, nR) {
    const pos = [], uv = [], idx = [];
    for (let i = 0; i <= nR; i++) for (let j = 0; j <= nKot; j++) {
      const r = (R * i) / nR, a = Math.PI / 2 + (j / nKot) * Math.PI * 1.5, y = r * Math.cos(a), z = r * Math.sin(a);
      pos.push(x, y, z); uv.push(0.5 + y / (2 * R), 0.5 + z / (2 * R));
    }
    const w = nKot + 1;
    for (let i = 0; i < nR; i++) for (let j = 0; j < nKot; j++) {
      const a = i * w + j;
      if (sg > 0) idx.push(a, a + 1, a + w, a + 1, a + w + 1, a + w); else idx.push(a, a + w, a + 1, a + 1, a + w, a + w + 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  const o = new THREE.Object3D(), smer = new THREE.Vector3();
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const nakljucna = (s = 1) => V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(s * 2);

  // ---------- obrisa celic (polmer v odvisnosti od višine y) ----------
  const PAL = [[0, -0.955], [0.035, -0.95], [0.055, -0.925], [0.06, -0.89], [0.05, -0.855], [0.022, -0.83], [0.02, -0.75], [0.02, -0.65],
    [0.06, -0.615], [0.098, -0.57], [0.103, -0.53], [0.094, -0.49], [0.05, -0.457], [0.03, -0.432], [0.03, -0.385],
    [0.05, -0.355], [0.062, -0.3], [0.066, -0.1], [0.076, -0.02], [0.078, 0.1], [0.07, 0.155], [0.045, 0.183], [0.021, 0.198],
    [0.05, 0.214], [0.069, 0.236], [0.069, 0.6], [0.069, 0.925], [0.05, 0.952], [0, 0.962]];
  const CEP = [[0, -0.955], [0.1, -0.95], [0.158, -0.94], [0.165, -0.915], [0.13, -0.893], [0.06, -0.868], [0.028, -0.84], [0.025, -0.7], [0.025, -0.585],
    [0.07, -0.555], [0.118, -0.51], [0.128, -0.46], [0.122, -0.41], [0.112, -0.365], [0.13, -0.33], [0.15, -0.25],
    [0.185, -0.12], [0.195, -0.02], [0.18, 0.06], [0.13, 0.108], [0.06, 0.128], [0.023, 0.138],
    [0.1, 0.151], [0.134, 0.165], [0.1, 0.33], [0.066, 0.46], [0.04, 0.5], [0, 0.512]];
  function gost(ctrl, n) { // gost obris iz kontrolnih točk (r, y) → [[y, r], …]
    const c = new THREE.SplineCurve(ctrl.map(([r, y]) => new THREE.Vector2(r, y)));
    const p = c.getSpacedPoints(n).map((v) => [v.y, Math.max(0, v.x)]);
    for (let i = 1; i < p.length; i++) if (p[i][0] <= p[i - 1][0]) p[i][0] = p[i - 1][0] + 1e-5;
    return p;
  }
  function kos(P, y0, y1) {
    const r = (y) => { for (let i = 1; i < P.length; i++) if (P[i][0] >= y) { const t = (y - P[i - 1][0]) / (P[i][0] - P[i - 1][0]); return P[i - 1][1] + (P[i][1] - P[i - 1][1]) * t; } return P[P.length - 1][1]; };
    const out = [[y0, r(y0)]];
    for (const p of P) if (p[0] > y0 + 1e-4 && p[0] < y1 - 1e-4) out.push(p);
    out.push([y1, r(y1)]);
    return out;
  }
  const XP = -0.33, XC = 0.3; // osi celic
  const Ppal = gost(PAL, q(200)), Pcep = gost(CEP, q(200));
  const rPal = (y) => kos(Ppal, y - 1e-3, y + 1e-3)[0][1], rCep = (y) => kos(Pcep, y - 1e-3, y + 1e-3)[0][1];
  const nKot = q(48);
  const kosi = {}; // id dela → { odprta: [], pokrov: [], notranja: [] }
  function zgradiKos(id, P, y0, y1, x) {
    const k = kos(P, y0, y1), v = vrtenina(k, nKot);
    const vin = vrtenina(k.filter((p, i) => i % 2 === 0 || i === k.length - 1).map(([y, r]) => [y, r * 0.92]), q(32));
    const e = kosi[id] || (kosi[id] = { odprta: [], pokrov: [], notranja: [] });
    e.odprta.push(v.odprta.translate(x, 0, 0));
    // prerez membrane: lipidni dvosloj (≈ 3 % polmera, povečano), navznoter citoplazma do notranje ploskve
    (e.pasovi || (e.pasovi = [])).push(prerezVrtenine(k, (y, r) => r * 0.92, [[0, 0.11, 0xb4587c], [0.11, 0.27, 0xf4d9c4], [0.27, 0.38, 0xb4587c], [0.38, 1, 0xf1c9b6]]).translate(x, 0, 0));
    e.pokrov.push(v.pokrov.translate(x, 0, 0));
    e.notranja.push(vin.odprta.translate(x, 0, 0));
  }
  const MEJE = { pal: [-0.955, -0.83, -0.36, 0.198, 0.962], cep: [-0.955, -0.84, -0.36, 0.138, 0.512] };
  const IDS = ["koncic", "telo", "notranji", "zunanji"];
  for (const [P, M, x, ime] of [[Ppal, MEJE.pal, XP, "pal"], [Pcep, MEJE.cep, XC, "cep"]]) {
    for (let i = 0; i < 4; i++) zgradiKos(IDS[i] === "zunanji" ? "zunanji-" + ime : IDS[i], P, M[i], M[i + 1], x);
  }
  const barve = { koncic: 0xf2b45c, telo: 0xd88aa2, notranji: 0xe39cb2, "zunanji-pal": 0xc77fb0, "zunanji-cep": 0xd9a35e };
  const memM = {}, pokrovi = [], vseNotr = [];
  for (const id of Object.keys(kosi)) {
    const m = mat(barve[id], { roughness: 0.32, clearcoat: 1 });
    memM[id] = new THREE.Mesh(zdruzi(kosi[id].odprta), m);
    const pk = new THREE.Mesh(zdruzi(kosi[id].pokrov), m);
    pk.visible = false;
    memM[id].userData.pokrov = pk;
    memM[id].userData.pas = new THREE.Mesh(zdruziBarvno(kosi[id].pasovi), mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide }));
    group.add(memM[id].userData.pas);
    pokrovi.push(pk);
    vseNotr.push(...kosi[id].notranja);
    group.add(memM[id], pk);
  }
  const citM = new THREE.Mesh(zdruzi(vseNotr), mat(0xf1c9b6, { roughness: 0.75, clearcoat: 0.1, sheen: 0.2, side: THREE.BackSide }));
  group.add(citM);

  // ---------- zunanji členek paličice: prosti diski z rodopsinom ----------
  const rodTex = tekstura(64, 64, (u, v) => {
    const fu = (u * 22) % 1 - 0.5, fv = (v * 22 + (Math.floor(u * 22) % 2) * 0.5) % 1 - 0.5;
    return fu * fu + fv * fv < 0.07 ? [96, 36, 120] : [168, 84, 190];
  });
  const diskG = new THREE.CylinderGeometry(0.06, 0.06, 0.0055, q(28), 1);
  const diskiY = [];
  for (let y = 0.248; y < 0.918; y += 0.0152) diskiY.push(y);
  const diski = new THREE.InstancedMesh(diskG, mat(0xffffff, { map: rodTex, roughness: 0.4, clearcoat: 0.7 }), diskiY.length);
  diskiY.forEach((y, i) => { o.position.set(XP, y, 0); o.rotation.set(0, i * 0.7, 0); o.scale.setScalar(1); o.updateMatrix(); diski.setMatrixAt(i, o.matrix); });
  group.add(diski);

  // ---------- zunanji členek čepka: gube membrane (na zadnji strani povezane z membrano) ----------
  const gubeG = [], zadaj = V(0.7071, 0, -0.7071);
  for (let y = 0.172; y < 0.49; y += 0.0135) {
    const r = rCep(y) - 0.007;
    if (r < 0.02) continue;
    const g = new THREE.CylinderGeometry(r, r, 0.005, q(28), 1);
    g.translate(XC + zadaj.x * 0.0068, y, zadaj.z * 0.0068);
    gubeG.push(g);
  }
  const gube = new THREE.Mesh(zdruzi(gubeG), mat(0xf0c05a, { roughness: 0.4, clearcoat: 0.7 }));
  group.add(gube);

  // ---------- povezovalni cilij z bazalnim telescem ----------
  const cilG = [];
  for (const [x, y0, y1] of [[XP, 0.168, 0.27], [XC, 0.108, 0.2]]) {
    cilG.push(palica(V(x, y0, 0), V(x, y1, 0), 0.0085, q(10)));
    cilG.push(new THREE.CylinderGeometry(0.012, 0.012, 0.026, q(10)).translate(x, y0 - 0.012, 0));
    cilG.push(new THREE.CylinderGeometry(0.012, 0.012, 0.022, q(10)).rotateZ(Math.PI / 2).translate(x + 0.012, y0 - 0.03, 0));
  }
  const cilij = new THREE.Mesh(zdruzi(cilG), mat(0x66d3f0, { roughness: 0.35, clearcoat: 0.8 }));
  group.add(cilij);

  // ---------- mitohondriji v elipsoidu notranjega členka ----------
  const mitK = [];
  const polni = (x, rF, y0, y1, n, rm) => {
    for (let i = 0, p = 0; i < n && p < 6000; p++) {
      const y = y0 + rnd() * (y1 - y0), a = rnd() * Math.PI * 2, rr = (rF(y) * 0.92 - rm) * Math.sqrt(rnd());
      const pos = V(x + Math.sin(a) * rr, y, Math.cos(a) * rr);
      if (mitK.some((m) => Math.hypot(m.p.x - pos.x, m.p.z - pos.z) < rm * 2.1 && Math.abs(m.p.y - pos.y) < 0.09)) continue;
      mitK.push({ p: pos, s: rm }); i++;
    }
  };
  polni(XP, rPal, -0.03, 0.12, hi ? 16 : 11, 0.0115);
  polni(XC, rCep, -0.16, 0.04, hi ? 46 : 30, 0.0155);
  const mit = new THREE.InstancedMesh(new THREE.CapsuleGeometry(1, 3.6, 3, q(10)), mat(0xe8743b, { roughness: 0.38 }), mitK.length);
  mitK.forEach((m, i) => { o.position.copy(m.p); o.rotation.set((rnd() - 0.5) * 0.25, 0, (rnd() - 0.5) * 0.25); o.scale.setScalar(m.s); o.updateMatrix(); mit.setMatrixAt(i, o.matrix); });
  group.add(mit);

  // ---------- jedri (prerezani) ----------
  const jedroG = [], jedroPk = [], jedroIn = [], jedroRez = [];
  for (const [x, cy, h, r] of [[XP, -0.535, 0.066, 0.085], [XC, -0.458, 0.074, 0.106]]) {
    const pr = [];
    for (let i = 0; i <= 28; i++) { const t = -1 + (2 * i) / 28; pr.push([cy + t * h, r * Math.sqrt(Math.max(0, 1 - t * t)) * (1 + 0.03 * sum(t * 4, x * 9, 1))]); }
    const v = vrtenina(pr, q(40));
    jedroG.push(v.odprta.translate(x, 0, 0));
    jedroRez.push(prerezVrtenine(pr, (y, rr) => rr * 0.94, [[0, 0.32, 0x5a46b8], [0.32, 0.68, 0xd9cffb], [0.68, 1, 0x5a46b8]]).translate(x, 0, 0));
    jedroPk.push(v.pokrov.translate(x, 0, 0));
    jedroIn.push(vrtenina(pr.map(([y, rr]) => [y, rr * 0.94]), q(40)).odprta.translate(x, 0, 0));
  }
  const jMat = mat(0x7a68d8, { roughness: 0.34 });
  const jedro = new THREE.Mesh(zdruzi(jedroG), jMat), jedroPok = new THREE.Mesh(zdruzi(jedroPk), jMat);
  const jedroOvoj = new THREE.Mesh(zdruziBarvno(jedroRez), mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide })); // dvojna jedrna ovojnica v prerezu
  jedroPok.visible = false;
  const nuk = new THREE.Mesh(zdruzi(jedroIn), mat(0xb9a8ff, { roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide }));
  // kromatin: paličica ima gost, temen kromatin, čepek redkejšega in jedrce
  const kromG = [];
  for (let i = 0; i < (hi ? 26 : 16); i++) {
    const g = new THREE.IcosahedronGeometry(0.012 + rnd() * 0.012, 1);
    const a = rnd() * Math.PI * 2, rr = rnd() * 0.06, y = -0.535 + (rnd() - 0.5) * 0.09;
    g.translate(XP + Math.sin(a) * rr, y, Math.cos(a) * rr);
    kromG.push(g);
  }
  kromG.push(new THREE.IcosahedronGeometry(0.022, 2).translate(XC - 0.03, -0.45, 0.03));
  for (let i = 0; i < (hi ? 8 : 5); i++) { const a = rnd() * Math.PI * 2; kromG.push(new THREE.IcosahedronGeometry(0.01, 1).translate(XC + Math.sin(a) * 0.08, -0.458 + (rnd() - 0.5) * 0.08, Math.cos(a) * 0.08)); }
  const krom = new THREE.Mesh(zdruzi(kromG), mat(0x34268a, { roughness: 0.6, clearcoat: 0.3 }));
  group.add(jedro, jedroPok, jedroOvoj, nuk, krom);

  // ---------- sinaptična končiča: mešički in sinaptični trakovi ----------
  const mesK = [], trakG = [];
  for (const [x, cy, rr, n, nt] of [[XP, -0.892, 0.046, hi ? 60 : 35, 1], [XC, -0.912, 0.13, hi ? 150 : 80, 4]]) {
    for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2, r = rr * Math.sqrt(rnd()), y = cy + (rnd() - 0.5) * (x === XP ? 0.07 : 0.035);
      mesK.push(V(x + Math.sin(a) * r, y, Math.cos(a) * r));
    }
    for (let t = 0; t < nt; t++) {
      const a = nt === 1 ? -2.4 : (t / nt) * Math.PI * 2 + 0.5, r = nt === 1 ? 0 : 0.07;
      trakG.push(new THREE.BoxGeometry(0.004, 0.026, 0.03).rotateY(a).translate(x + Math.sin(a) * r, x === XP ? -0.925 : -0.928, Math.cos(a) * r));
    }
  }
  const mes = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.0058, hi ? 1 : 0), mat(0xfff0b8, { roughness: 0.3, clearcoat: 0.8 }), mesK.length);
  mesK.forEach((p, i) => { o.position.copy(p); o.rotation.set(0, 0, 0); o.scale.setScalar(1); o.updateMatrix(); mes.setMatrixAt(i, o.matrix); });
  const trak = new THREE.Mesh(zdruzi(trakG), mat(0x3a2540, { roughness: 0.5 }));
  group.add(mes, trak);

  // ---------- deli ----------
  const pk = (id) => [memM[id], memM[id].userData.pokrov, memM[id].userData.pas];
  del("zunanji-clenek-palicice", "Zunanji členek paličice", "Dolg valjast vrh paličice; v njem je kup diskov s svetlobnim barvilom.", "#c77fb0", pk("zunanji-pal"), [XP + 0.05, 0.75, 0.05]);
  del("diski-rodopsin", "Diski z rodopsinom", "Ploščati membranski mešički, ki prosto ležijo v paličici; rodopsin v njih zazna že zelo šibko svetlobo, a ne loči barv.", "#a854be", [diski], [XP - 0.03, 0.62, 0.03]);
  del("zunanji-clenek-cepka", "Zunanji členek čepka", "Stožčast vrh čepka; je krajši od zunanjega členka paličice.", "#d9a35e", pk("zunanji-cep"), [XC + 0.07, 0.33, 0.06]);
  del("gube-jodopsin", "Membranske gube z jodopsinom", "Pri čepku so diski gube celične membrane; barvilo jodopsin je v treh različicah (za modro, zeleno, rdečo svetlobo), zato vidimo barve.", "#f0c05a", [gube], [XC - 0.04, 0.3, 0.04]);
  del("cilij", "Povezovalni cilij", "Tanek most med notranjim in zunanjim členkom; po njem potujejo beljakovine za nove diske.", "#66d3f0", [cilij], [XP, 0.2, 0.012]);
  del("notranji-clenek", "Notranji členek", "Presnovni del čutnice, poln mitohondrijev; izdeluje beljakovine in daje energijo zunanjemu členku.", "#e39cb2", pk("notranji"), [XC + 0.12, -0.2, 0.12]);
  del("mitohondriji", "Mitohondriji", "Gosto zloženi v zgornjem delu notranjega členka; zaznavanje svetlobe porabi veliko energije (ATP).", "#e8743b", [mit], (mitK.find((m) => m.p.x > XC - 0.12 && m.p.x < XC - 0.03 && m.p.z > 0.04) || mitK[0]).p.toArray());
  del("jedro", "Jedro", "Jedro čutnice; pri paličici je manjše in temnejše od jedra čepka.", "#7a68d8", [jedro, jedroPok, jedroOvoj, krom], [XC - 0.05, -0.44, 0.06]);
  del("nukleoplazma", "Nukleoplazma", "Notranjost jedra z DNK.", "#b9a8ff", [nuk], [XP - 0.03, -0.52, 0.03]);
  del("celicno-telo", "Celično telo in akson", "Del celice z jedrom; tanko vlakno (akson) ga povezuje s sinaptičnim končičem.", "#d88aa2", pk("telo"), [XP + 0.02, -0.72, 0.012]);
  del("sinapticni-koncic", "Sinaptični končič", "Končič odda signal naslednjim živčnim celicam mrežnice; paličica ima majhen okrogel končič, čepek širšo ploščico.", "#f2b45c", pk("koncic"), [XC + 0.14, -0.92, 0.07]);
  del("sinapticni-mesicki", "Sinaptični mešički", "Mešički z živčnim prenašalcem (glutamatom); v temi jih čutnica sprošča največ, svetloba to zmanjša.", "#fff0b8", [mes, trak], [XC - 0.06, -0.91, 0.06]);
  del("citoplazma", "Citoplazma", "Notranjost celic, ki povezuje vse dele čutnice.", "#f1c9b6", [citM], [XC - 0.12, -0.15, -0.1]);

  // ---------- nadzor ----------
  const nadzor = [
    {
      tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cela", "Celi celici"]], vrednost: "prerez",
      ob: (v) => { const cela = v === "cela"; for (const p of pokrovi) p.visible = cela; jedroPok.visible = cela; jedroOvoj.visible = !cela; },
    },
  ];
  if (ctx.zacetek && ctx.zacetek.prikaz) { nadzor[0].vrednost = ctx.zacetek.prikaz; nadzor[0].ob(ctx.zacetek.prikaz); }

  // rahle razlike v svetlosti med ponovljenimi deli (organeli in beljakovine niso vsi povsem enaki)
  {
    const c = new THREE.Color();
    group.traverse((m) => {
      if (!m.isInstancedMesh || m.instanceColor) return;
      for (let i = 0; i < m.instanceMatrix.count; i++) { const k = 0.88 + 0.2 * hash(i * 1.37, m.instanceMatrix.count * 0.11, 7); m.setColorAt(i, c.setRGB(k, k, k)); }
    });
  }

  // Ploskvi prereza plasti vrtenine (kota 0 in 1,5π) med zunanjim polmerom r in notranjim rNot(y, r);
  // pasovi [[t0, t1, barva], …] od zunaj (t = 0) navznoter (t = 1), npr. lipidni dvosloj membrane.
  function prerezVrtenine(prof, rNot, pasovi) {
    const pos = [], col = [], idx = [], c = new THREE.Color();
    for (const f of [0, Math.PI * 1.5]) for (const [t0, t1, barva] of pasovi) {
      c.set(barva);
      const off = pos.length / 3;
      prof.forEach(([y, r]) => {
        const r0 = Math.min(rNot(y, r), r);
        for (const t of [t0, t1]) { const rr = r + (r0 - r) * t; pos.push(rr * Math.sin(f), y, rr * Math.cos(f)); col.push(c.r, c.g, c.b); }
      });
      for (let i = 0; i < prof.length - 1; i++) { const a = off + i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
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

  // Združi geometrije z barvami oglišč (ohrani atribut color).
  function zdruziBarvno(geos) {
    const pos = [], col = [], idx = [];
    let off = 0;
    for (const g of geos) {
      pos.push(...g.attributes.position.array); col.push(...g.attributes.color.array);
      for (let k = 0; k < g.index.count; k++) idx.push(g.index.getX(k) + off);
      off += g.attributes.position.count;
      g.dispose();
    }
    const out = new THREE.BufferGeometry();
    out.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    out.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    out.setIndex(idx);
    out.computeVertexNormals();
    return out;
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
    "notranji-clenek": { tex: "zrna", rep: [8, 16], k: 0.25, lisa: 0.1, f: 8, temni: 0.95 },
    "celicno-telo": { tex: "zrna", rep: [8, 16], k: 0.25, lisa: 0.1, f: 8, temni: 0.95 },
    citoplazma: { tex: "fino", rep: [6, 12], k: 0.2, lisa: 0.18, f: 10 },
    jedro: { tex: "zrna", rep: [8, 4], k: 0.35, lisa: 0.1, f: 20 },
    nukleoplazma: { tex: "fino", rep: [4, 2], k: 0.25, lisa: 0.15, f: 20 },
    mitohondriji: { tex: "fino", rep: [3, 2], k: 0.25 },
    "sinapticni-mesicki": { tex: null },
  });

  return {
    group,
    deli,
    nadzor,
    pogled: [-0.47, 0.34, 0.81],
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
