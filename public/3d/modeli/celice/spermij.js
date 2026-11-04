// Semenčica (spermij): cela celica z bičem, ki valovi, in povečana glava z vratom in srednjim delom v prerezu.
// Pogodba graditelja: docs/3d.md.

export const info = {
  id: "celica-spermij",
  naslov: "Semenčica (spermij)",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Moška spolna celica, dolga okoli 60 µm: glava z akrosomom in jedrom, vrat s centriolama, srednji del z vijačnico mitohondrijev in dolg bič. Povečan pogled pokaže notranjost glave in zgradbo biča 9 + 2; mikrotubuli so narisani debelejši kot v resnici.",
  poskusi: "Izberi »Cela semenčica« in primerjaj dolžino glave z dolžino biča.",
  merilo: { m: 12e-6, oznaka: "12 µm" },
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

  const osX = (g) => g.rotateZ(-Math.PI / 2);
  // Lupina z odrezano četrtino y > 0, z > 0 (po vsej dolžini).
  function lupinaK(f, ws, hs) {
    const zg = new THREE.SphereGeometry(1, ws / 2, hs / 2, Math.PI, Math.PI, 0, Math.PI / 2);
    const sp = new THREE.SphereGeometry(1, ws, hs / 2, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const pokr = new THREE.SphereGeometry(1, ws / 2, hs / 2, 0, Math.PI, 0, Math.PI / 2);
    const v = new THREE.Vector3();
    for (const g of [zg, sp, pokr]) {
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).normalize(); v.multiplyScalar(f(v)); p.setXYZ(i, v.x, v.y, v.z); }
      g.computeVertexNormals();
    }
    return { odprta: zdruzi([zg, sp]), pokrov: pokr };
  }
  function robK(f, deb, seg) {
    return zdruzi([(t) => V(Math.cos(t), Math.sin(t), 0), (t) => V(Math.cos(t), 0, Math.sin(t))].map((L) => {
      const pts = [];
      for (let i = 0; i <= seg; i++) { const d = L((i / seg) * Math.PI).normalize(); pts.push(d.multiplyScalar(f(d) * 0.995)); }
      return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, deb, q(6), false);
    }));
  }
  // oblika glave: sploščen oval s topim zadnjim delom, proti konici tanjši
  // (af, ar: pol dolžine spredaj in zadaj, b: pol širine, c: pol debeline)
  const glavaF = (af, ar, b, c) => (d) => {
    const g = (r) => {
      const x = r * d.x, a = x > 0 ? af : ar, pe = x > 0 ? 2 : 3;
      const cc = c * (1 - 0.4 * Math.max(0, x / af)) * (1 + 0.1 * Math.max(0, -x / ar));
      return Math.pow(Math.abs(x) / a, pe) + (r * d.y / b) ** 2 + (r * d.z / cc) ** 2 - 1;
    };
    let lo = 0, hi2 = Math.max(af, ar, b, c) * 1.5;
    for (let i = 0; i < 24; i++) { const m = (lo + hi2) / 2; if (g(m) > 0) hi2 = m; else lo = m; }
    return (lo + hi2) / 2;
  };

  // =====================================================================
  // POGLED 1: CELA SEMENČICA (1 enota = 30 µm)
  // =====================================================================
  const G1 = new THREE.Group();
  group.add(G1);
  const deli1 = [];
  const a1 = 0.068, HC1 = V(0.98 - 0.094, 0, 0);
  const f1 = glavaF(0.094, a1, 0.05, 0.026);
  const gl1 = new THREE.SphereGeometry(1, q(48), q(32));
  { const p = gl1.attributes.position, v = V(0, 0, 0); for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).normalize(); v.multiplyScalar(f1(v)); p.setXYZ(i, v.x, v.y, v.z); } gl1.computeVertexNormals(); }
  const akr1 = odrezi(gl1.clone(), (c) => c.x < -a1 * 0.15).translate(HC1.x, 0, 0);
  const jed1 = odrezi(gl1, (c) => c.x >= -a1 * 0.15).translate(HC1.x, 0, 0);
  const akrM1 = new THREE.Mesh(akr1, mat(0x5fd0b8, { roughness: 0.3, clearcoat: 1 }));
  const jedM1 = new THREE.Mesh(jed1, mat(0x8c7ae0, { roughness: 0.32, clearcoat: 1 }));
  const XV0 = HC1.x - a1 + 0.004; // zadnji rob glave
  const vrat1 = new THREE.Mesh(osX(new THREE.CylinderGeometry(0.011, 0.014, 0.018, q(12))).translate(XV0 - 0.008, 0, 0), mat(0x66d3f0, { roughness: 0.35, clearcoat: 0.8 }));
  const XS0 = XV0 - 0.017, XS1 = XS0 - 0.167; // srednji del
  const sredG = [osX(new THREE.CylinderGeometry(0.011, 0.011, XS0 - XS1, q(10), 1, true)).translate((XS0 + XS1) / 2, 0, 0)];
  { const pts = []; const n = 13 * 16; for (let i = 0; i <= n; i++) { const t = i / n, a = t * 13 * Math.PI * 2; pts.push(V(XS0 - t * (XS0 - XS1), Math.cos(a) * 0.0115, Math.sin(a) * 0.0115)); } sredG.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), q(n), 0.0058, q(6), false)); }
  const sred1 = new THREE.Mesh(zdruzi(sredG), mat(0xe8743b, { roughness: 0.38, clearcoat: 0.8 }));
  // bič: cev, ki jo vsak korak preračunamo (potujoč val)
  const XR0 = XS1 + 0.002, XR1 = -0.975, nS = q(200), nR = q(10);
  const rRep = (s) => (s < 0.9 ? 0.0105 - 0.005 * (s / 0.9) : 0.0045 * (1 - (s - 0.9) / 0.1 * 0.5));
  const repGeo = new THREE.BufferGeometry();
  repGeo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array((nS + 1) * nR * 3 + 6), 3));
  { const idx = []; for (let i = 0; i < nS; i++) for (let j = 0; j < nR; j++) { const a = i * nR + j, b = i * nR + ((j + 1) % nR), c = a + nR, d = b + nR; idx.push(a, b, c, b, d, c); }
    const kon = (nS + 1) * nR; for (let j = 0; j < nR; j++) { idx.push(kon + 1, nS * nR + j, nS * nR + ((j + 1) % nR)); } repGeo.setIndex(idx); }
  const repM = new THREE.Mesh(repGeo, mat(0xe6a8bd, { roughness: 0.32, clearcoat: 1 }));
  const LAMBDA = 0.95, AMAX = 0.1;
  const sredina = [];
  function postaviRep(t) {
    const p = repGeo.attributes.position, c = [];
    for (let i = 0; i <= nS; i++) {
      const s = i / nS, x = XR0 + (XR1 - XR0) * s, A = AMAX * Math.pow(s, 1.25);
      c.push(V(x, A * Math.sin((2 * Math.PI * s * (XR0 - XR1)) / LAMBDA - t * Math.PI * 2 * 2.2), 0));
    }
    const T = V(0, 0, 0), N = V(0, 0, 0), B = V(0, 0, 1);
    for (let i = 0; i <= nS; i++) {
      T.copy(c[Math.min(nS, i + 1)]).sub(c[Math.max(0, i - 1)]).normalize();
      N.set(-T.y, T.x, 0);
      const r = rRep(i / nS);
      for (let j = 0; j < nR; j++) {
        const a = (j / nR) * Math.PI * 2, k = (i * nR + j);
        p.setXYZ(k, c[i].x + r * (Math.cos(a) * N.x), c[i].y + r * (Math.cos(a) * N.y), r * Math.sin(a));
      }
    }
    const kon = (nS + 1) * nR;
    p.setXYZ(kon, c[0].x, c[0].y, 0);
    p.setXYZ(kon + 1, c[nS].x - T.x * 0.003, c[nS].y - T.y * 0.003, 0);
    p.needsUpdate = true;
    repGeo.computeVertexNormals();
    repGeo.computeBoundingSphere();
    sredina.length = 0; sredina.push(...c);
  }
  postaviRep(0);
  G1.add(akrM1, jedM1, vrat1, sred1, repM);
  del("akrosom", "Akrosom", "Kapica na sprednjem delu glave z encimi, ki semenčici pomagajo prebiti ovojnico jajčne celice.", "#5fd0b8", [akrM1], [HC1.x + 0.03, 0.02, 0.02], deli1);
  del("jedro", "Jedro (v glavi)", "Zelo zgoščeno jedro s polovičnim številom kromosomov (23); to je očetov delež dednega zapisa.", "#8c7ae0", [jedM1], [HC1.x - 0.035, 0.01, 0.022], deli1);
  del("vrat", "Vrat s centriolama", "Kratek vrat povezuje glavo in bič; v njem sta dve centrioli, iz ene izrašča bič.", "#66d3f0", [vrat1], [XV0 - 0.008, 0.012, 0.01], deli1);
  del("srednji-del", "Srednji del z mitohondriji", "Mitohondriji so zviti v vijačnico okoli začetka biča in dajejo energijo (ATP) za plavanje.", "#e8743b", [sred1], [(XS0 + XS1) / 2, 0.016, 0.01], deli1);
  del("rep", "Rep (bič)", "Dolg bič, ki z valovanjem poganja semenčico naprej; v njem je aksonema iz mikrotubulov (9 + 2).", "#e6a8bd", [repM], [-0.3, 0, 0.01], deli1);

  // =====================================================================
  // POGLED 2: GLAVA, VRAT IN SREDNJI DEL (1 enota = 6 µm)
  // =====================================================================
  const G2 = new THREE.Group();
  group.add(G2);
  G2.visible = false;
  const deli2 = [];
  const a2 = 0.34, HC2 = V(0.98 - 0.47, 0, 0);
  const fM = glavaF(0.47, a2, 0.25, 0.125), fJ = (d) => fM(d) * 0.86, fA = (d) => fM(d) * 0.94;
  // celična membrana glave
  const mg = lupinaK(fM, q(96), q(64));
  const memMat = mat(0xd88aa2, { roughness: 0.32, clearcoat: 1 });
  const memG = new THREE.Mesh(mg.odprta.translate(HC2.x, 0, 0), memMat);
  const memGP = new THREE.Mesh(mg.pokrov.translate(HC2.x, 0, 0), memMat);
  const memGR = new THREE.Mesh(prerezK(fM, (d) => fM(d) * 0.965, q(64), DVOSLOJ(0xb4587c, 0xf4d9c4)).translate(HC2.x, 0, 0), mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide }));
  // akrosom: kapica na sprednjih ~ 60 % jedra
  const ak = lupinaK(fA, q(96), q(64)), sprednji = (c) => c.x < -0.12 * a2;
  const akMat = mat(0x5fd0b8, { roughness: 0.3, clearcoat: 1, side: THREE.DoubleSide });
  const akM = new THREE.Mesh(odrezi(ak.odprta, sprednji).translate(HC2.x, 0, 0), akMat);
  const akP = new THREE.Mesh(odrezi(ak.pokrov, sprednji).translate(HC2.x, 0, 0), akMat);
  // rob prereza akrosoma: debelejši trak, da se kapica vidi tudi v prerezu
  const akR = new THREE.Mesh(odrezi(robK((d) => fM(d) * 0.9, 0.016, q(48)), sprednji).translate(HC2.x, 0, 0), akMat);
  // jedro z zgoščenim kromatinom
  const jg = lupinaK(fJ, q(80), q(56));
  const jMat = mat(0x7a68d8, { roughness: 0.34 });
  const jM = new THREE.Mesh(jg.odprta.translate(HC2.x, 0, 0), jMat);
  const jP = new THREE.Mesh(jg.pokrov.translate(HC2.x, 0, 0), jMat);
  const jR = new THREE.Mesh(prerezK(fJ, (d) => fJ(d) * 0.97, q(56), [[0, 0.32, 0x5a46b8], [0.32, 0.68, 0xd9cffb], [0.68, 1, 0x5a46b8]]).translate(HC2.x, 0, 0), mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide }));
  const kromTex = tekstura(64, 64, (u, v) => { const n = 0.5 + 0.5 * fbm(u * 12, v * 12, 3); return [60 + 50 * n, 40 + 30 * n, 140 + 50 * n]; });
  const jIn = new THREE.Mesh(jg.odprta.clone().translate(-HC2.x, 0, 0).scale(0.97, 0.97, 0.97).translate(HC2.x, 0, 0), mat(0xffffff, { map: kromTex, roughness: 0.6, clearcoat: 0.2, side: THREE.BackSide }));
  for (const m of [akP, memGP, jP]) m.visible = false;
  G2.add(memG, memGP, memGR, akM, akP, akR, jM, jP, jR, jIn);

  // vrat, srednji del in začetek glavnega dela biča: membrana kot vrtenina okoli osi x
  const XG = HC2.x - a2 * 0.97; // zadnji rob glave
  const XN = XG - 0.08, XA = -0.66, XK = -0.97; // konec vratu, obroček, prerezan konec
  const profB = [];
  for (let i = 0; i <= 80; i++) {
    const x = XK + ((XG + 0.03 - XK) * i) / 80;
    let r = x < XA ? 0.072 : 0.09;
    if (x > XA - 0.02 && x < XA + 0.02) r = 0.072 + 0.018 * (x - XA + 0.02) / 0.04;
    if (x > XN) r = 0.09 + 0.025 * Math.pow((x - XN) / (XG + 0.03 - XN), 2);
    profB.push([x, r * (1 + 0.015 * sum(x * 20, 1, 2))]);
  }
  const vb = vrtenina(profB, q(56));
  const memB = new THREE.Mesh(osX(vb.odprta), memMat), memBP = new THREE.Mesh(osX(vb.pokrov), memMat), memBR = new THREE.Mesh(osX(prerezVrtenine(profB, (y, r) => r * 0.95, [[0, 0.12, 0xb4587c], [0.12, 0.28, 0xf4d9c4], [0.28, 0.4, 0xb4587c], [0.4, 1, 0xf1c9b6]])), mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide }));
  memBP.visible = false;
  const vbIn = vrtenina(profB.map(([x, r]) => [x, r * 0.95]), q(40));
  const citM = new THREE.Mesh(osX(vbIn.odprta), mat(0xf1c9b6, { roughness: 0.75, clearcoat: 0.1, side: THREE.BackSide }));
  G2.add(memB, memBP, memBR, citM);

  // aksonema 9 + 2 in zunanja gosta vlakna
  const axG = [], odfG = [];
  const RA = 0.03;
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2;
    for (const [dr, da] of [[0, 0], [0.004, 0.2]]) {
      const y = Math.cos(a + da) * (RA + dr), z = Math.sin(a + da) * (RA + dr);
      axG.push(osX(new THREE.CylinderGeometry(0.0058, 0.0058, XN + 0.03 - XK, q(8))).translate((XN + 0.03 + XK) / 2, y, z));
    }
    const y = Math.cos(a + 0.1) * 0.052, z = Math.sin(a + 0.1) * 0.052;
    odfG.push(osX(new THREE.CylinderGeometry(0.0085, 0.0085, XN + 0.02 - XK, q(8))).translate((XN + 0.02 + XK) / 2, y, z));
  }
  for (const s of [-1, 1]) axG.push(osX(new THREE.CylinderGeometry(0.0055, 0.0055, XN - XK, q(8))).translate((XN + XK) / 2, s * 0.007, 0));
  const aks = new THREE.Mesh(zdruzi(axG), mat(0x9fe3a0, { roughness: 0.4, clearcoat: 0.6 }));
  // vlaknati plašč glavnega dela: obročki in dva vzdolžna stebra
  for (let x = XK + 0.012; x < XA - 0.02; x += 0.026) odfG.push(new THREE.TorusGeometry(0.064, 0.0045, q(5), q(24)).rotateY(Math.PI / 2).translate(x, 0, 0));
  for (const s of [-1, 1]) odfG.push(osX(new THREE.CylinderGeometry(0.008, 0.008, XA - XK - 0.02, q(6))).translate((XA - 0.02 + XK) / 2, 0, s * 0.064));
  const odf = new THREE.Mesh(zdruzi(odfG), mat(0xe9dcc0, { roughness: 0.5, clearcoat: 0.4 }));
  // mitohondrijska vijačnica srednjega dela in obroček (anulus)
  const vijG = [];
  {
    const n = 13, pts = [], x0 = XA + 0.018, x1 = XN - 0.012;
    for (let i = 0; i <= n * 20; i++) { const t = i / (n * 20), a = t * n * Math.PI * 2; pts.push(V(x0 + t * (x1 - x0), Math.cos(a) * 0.068, Math.sin(a) * 0.068)); }
    vijG.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), q(n * 20), 0.0185, q(8), false));
  }
  const vij = new THREE.Mesh(zdruzi(vijG), mat(0xe8743b, { roughness: 0.38, clearcoat: 0.7 }));
  const anulus = new THREE.Mesh(new THREE.TorusGeometry(0.074, 0.009, q(8), q(28)).rotateY(Math.PI / 2).translate(XA, 0, 0), mat(0x6a3b2a, { roughness: 0.5 }));
  // vrat: bližnja centriola (prečno) in oddaljena centriola (bazalno telesce) ter vezni del
  const cent = [];
  const centriola = (os, c, L) => {
    for (let i = 0; i < 9; i++) for (let t = 0; t < 3; t++) {
      const a = (i / 9) * Math.PI * 2 + t * 0.11, rr = 0.03 - t * 0.0045;
      const g = new THREE.CylinderGeometry(0.0034, 0.0034, L, q(5));
      g.translate(Math.cos(a) * rr, 0, Math.sin(a) * rr);
      if (os === "x") g.rotateZ(-Math.PI / 2);
      else g.rotateX(Math.PI / 2);
      cent.push(g.translate(c.x, c.y, c.z));
    }
  };
  centriola("z", V(XG - 0.035, 0.0, 0), 0.06);
  centriola("x", V(XN + 0.012, 0, 0), 0.04);
  cent.push(new THREE.CylinderGeometry(0.06, 0.06, 0.012, q(20)).rotateZ(Math.PI / 2).translate(XG - 0.01, 0, 0));
  const centM = new THREE.Mesh(zdruzi(cent), mat(0x66d3f0, { roughness: 0.35, clearcoat: 0.8 }));
  // prerezan konec biča
  const konec = new THREE.Mesh(new THREE.CircleGeometry(0.068, q(24)).rotateY(-Math.PI / 2).translate(XK + 0.01, 0, 0), mat(0xf1c9b6, { roughness: 0.75, clearcoat: 0.1 }));
  G2.add(aks, odf, vij, anulus, centM, konec);

  const naB = (x, a, f = 1.02) => { const r = profB.reduce((m, p) => (Math.abs(p[0] - x) < Math.abs(m[0] - x) ? p : m))[1]; return [x, Math.cos(a) * r * f, Math.sin(a) * r * f]; };
  del("membrana", "Celična membrana", "Dvosloj fosfolipidov, ki ovija vso semenčico; na glavi se ob oploditvi zlije z membrano jajčne celice. Debelina je povečana.", "#d88aa2", [memG, memGP, memGR, memB, memBP, memBR, citM, konec], naB(-0.3, -0.9), deli2);
  del("akrosom", "Akrosom", "Kapica z encimi na sprednjih dveh tretjinah jedra; ob stiku z jajčno celico encime sprosti in prebavi pot skozi njeno ovojnico.", "#5fd0b8", [akM, akP, akR], [HC2.x + 0.18, 0.06, 0.05], deli2);
  del("jedro", "Jedro", "Zelo zgoščeno jedro s 23 kromosomi; DNK je stisnjena, da je glava čim manjša.", "#7a68d8", [jM, jP, jR, jIn], [HC2.x - 0.12, 0.04, 0.03], deli2);
  del("centriola", "Vrat s centriolama", "V vratu sta dve centrioli; ena je bazalno telesce, iz katerega raste bič, drugo semenčica prinese v jajčno celico.", "#66d3f0", [centM], [XG - 0.035, 0.03, 0.03], deli2);
  del("mitohondriji", "Mitohondriji srednjega dela", "Okoli 13 zavojev mitohondrijev, ovitih kot vijačnica; s celičnim dihanjem dajejo ATP za gibanje biča.", "#e8743b", [vij, anulus], [-0.3, 0.06, 0.05], deli2);
  del("aksonema", "Aksonema 9 + 2", "Os biča: devet parov mikrotubulov v krogu in dva v sredini; z drsenjem drug ob drugem upogibajo bič.", "#9fe3a0", [aks], [XK - 0.002, 0.02, 0.012], deli2);
  del("oporna-vlakna", "Oporna vlakna in vlaknati plašč", "Debela vlakna in obročki okoli aksoneme bič utrdijo, da se ne zlomi pri močnem valovanju.", "#e9dcc0", [odf], [-0.8, 0.045, 0.045], deli2);

  // Oba pogleda rahlo nagnemo (glava desno zgoraj), da podolgovata celica bolje zapolni zaslon.
  const NAGIB1 = 0.3, NAGIB2 = 0.36;
  G1.rotation.z = NAGIB1; G2.rotation.z = NAGIB2;
  G1.updateMatrix(); G2.updateMatrix();
  const vSkupino = (G, t) => V(...t).applyMatrix4(G.matrix).toArray().map((x) => Math.round(x * 1000) / 1000);
  for (const d of deli1) d.tocka = vSkupino(G1, d.tocka);
  for (const d of deli2) d.tocka = vSkupino(G2, d.tocka);
  G1.visible = false; G2.visible = true;
  // ---------- nadzor ----------
  let pogled = "glava";
  const nadzor = [
    {
      tip: "izbira", id: "pogled", oznaka: "Pogled", moznosti: [["glava", "Glava in vrat (povečano)"], ["celota", "Cela semenčica"]], vrednost: "glava",
      ob: (v) => { pogled = v === "glava" ? "glava" : "celota"; G1.visible = pogled === "celota"; G2.visible = !G1.visible; },
    },
    {
      tip: "izbira", id: "prikaz", oznaka: "Prikaz (povečano)", moznosti: [["prerez", "Prerez"], ["cela", "Cela"]], vrednost: "prerez",
      ob: (v) => { const cela = v === "cela"; for (const m of [memGP, akP, jP, memBP]) m.visible = cela; akR.visible = !cela; memGR.visible = !cela; memBR.visible = !cela; jR.visible = !cela; },
    },
  ];
  const z = ctx.zacetek || {};
  for (const n of nadzor) if (z[n.id] !== undefined) { n.vrednost = z[n.id]; n.ob(z[n.id]); }

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

  // Ploskvi prereza plasti lupine z odrezano četrtino (y > 0, z > 0) med fZ in fN; pasovi kot pri prerezVrtenine.
  function prerezK(fZ, fN, seg, pasovi) {
    const loki = [(t) => V(Math.cos(t), Math.sin(t), 0), (t) => V(Math.cos(t), 0, Math.sin(t))];
    const pos = [], col = [], idx = [], c = new THREE.Color();
    for (const L of loki) for (const [t0, t1, barva] of pasovi) {
      c.set(barva);
      const off = pos.length / 3;
      for (let i = 0; i <= seg; i++) {
        const d = L((i / seg) * Math.PI).normalize(), rz = fZ(d), rn = fN(d);
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
    membrana: { tex: "zrna", rep: [16, 8], k: 0.25, lisa: 0.1, f: 8, sheen: 0.7 },
    akrosom: { tex: "fino", rep: [6, 3], k: 0.25, lisa: 0.08, f: 10 },
    jedro: { tex: "zrna", rep: [10, 5], k: 0.3, lisa: 0.1, f: 14 },
    mitohondriji: { tex: "fino", rep: [3, 2], k: 0.25 },
    "srednji-del": { tex: "fino", rep: [3, 2], k: 0.25 },
    rep: { tex: "fino", rep: [2, 30], k: 0.2 },
  }, [...deli1, ...deli2]);

  return {
    group,
    get deli() { return pogled === "glava" ? deli2 : deli1; },
    nadzor,
    pogled: [-0.47, 0.34, 0.81],
    get merilo() { return pogled === "glava" ? info.merilo : { m: 60e-6, oznaka: "60 µm" }; },
    korak(t) {
      if (!gib || pogled !== "celota") return;
      postaviRep(t);
      const rep = deli1.find((d) => d.id === "rep");
      const c = sredina[Math.round(sredina.length * 0.6)];
      if (rep && c) rep.tocka = vSkupino(G1, [c.x, c.y, 0.01]);
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
