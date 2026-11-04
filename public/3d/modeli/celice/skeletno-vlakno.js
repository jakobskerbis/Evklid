// Skeletno mišično vlakno: odsek vlakna v prerezu (miofibrile s progami, jedra, SR, T-cevke) in ena sarkomera
// (aktin, miozin, titin, Z-linije, M-linija). Drsnik »Krčenje« pokaže drsenje filamentov. Pogodba graditelja: docs/3d.md.

export const info = {
  id: "celica-skeletno-misicno-vlakno",
  naslov: "Skeletno mišično vlakno",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Dolgo valjasto vlakno z mnogimi jedri ob robu, polno prečno progastih miofibril. Pogled »Sarkomera« pokaže, kako aktinski filamenti drsijo med miozinske; filamentov je manj in so debelejši kot v resnici.",
  merilo: { m: 100e-6, oznaka: "100 µm" },
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
  const DEBELI = 1.6, TANKI = 1.0; // dolžina debelih (miozin) in tankih (aktin) filamentov v µm
  let Lsar = 2.5; // dolžina sarkomere v µm
  const hex = (a) => { const c = new THREE.Color(a); return [c.r * 255, c.g * 255, c.b * 255]; };

  // =====================================================================
  // POGLED 1: VLAKNO (1 enota = 50 µm)
  // =====================================================================
  const GV = new THREE.Group();
  group.add(GV);
  const deliV = [];
  const XV = 0.88, RV = 0.4, nSar = Math.round((2 * XV * 50) / 2.5); // ≈ 35 sarkomer
  const RF = 0.016, SP = 0.042, RMF = 0.33; // miofibrila: polmer, razmik, največja oddaljenost od osi
  const vRezu = (y, z) => y > 0.001 && z > 0.001;

  // tekstura prog ene sarkomere (v: 0 … 1 od Z do Z)
  const pasovi = (v) => {
    const x = v * Lsar, dc = Math.abs(x - Lsar / 2);
    if (x < 0.06 || x > Lsar - 0.06) return "z";
    if (dc < DEBELI / 2) { if (dc < 0.035) return "m"; return dc < Lsar / 2 - TANKI ? "h" : "a"; }
    return "i";
  };
  const BP = { z: hex(0x4a1d2e), m: hex(0x6b2234), h: hex(0xb4505e), a: hex(0x8a2a3b), i: hex(0xf3c6cb) };
  const progeTex = tekstura(4, 256, (u, v) => BP[pasovi(v)]);
  progeTex.repeat.set(1, nSar);
  // SR: vzdolžne cevke in končne cisterne ob T-cevkah; T-cevke na meji pasov A in I
  const mejeAI = () => [0.5 - DEBELI / (2 * Lsar), 0.5 + DEBELI / (2 * Lsar)];
  const srF = (u, v) => {
    const [a0, a1] = mejeAI(), d = Math.min(Math.abs(v - a0), Math.abs(v - a1));
    if (d < 0.014) return [0, 0, 0, 0];
    if (d < 0.05) return [255, 255, 255, 255];
    const cev = Math.abs(Math.sin(u * Math.PI * 9)) > 0.72 || (Math.abs(v - 0.5) > 0.3 && Math.abs(Math.sin(v * Math.PI * 14)) > 0.93);
    const okno = Math.abs(v - 0.5) < 0.06 && hash(Math.floor(u * 30), Math.floor(v * 60), 1) > 0.5;
    return cev || okno ? [255, 255, 255, 255] : [0, 0, 0, 0];
  };
  const srTex = tekstura(64, 128, srF, false);
  srTex.repeat.set(1, nSar);
  for (const t of [srTex]) { t.minFilter = THREE.LinearFilter; t.generateMipmaps = false; }
  const tF = (u, v) => { const [a0, a1] = mejeAI(), d = Math.min(Math.abs(v - a0), Math.abs(v - a1)); return d < 0.014 ? [255, 255, 255, 255] : [0, 0, 0, 0]; };
  const tTex = tekstura(4, 128, tF, false);
  tTex.repeat.set(1, nSar);
  tTex.minFilter = THREE.LinearFilter; tTex.generateMipmaps = false;
  // sarkolema: odprtine T-cevk v vrsticah na meji pasov A in I
  const slF = (u, v) => {
    const [a0, a1] = mejeAI(), d = Math.min(Math.abs(v - a0), Math.abs(v - a1)), fu = (u * 24) % 1 - 0.5;
    const n = 0.94 + 0.06 * sum(u * 30, v * 3, 2);
    if (d < 0.03 && fu * fu < 0.02) return [150, 70, 95];
    return [216 * n, 138 * n, 162 * n];
  };
  const slTex = tekstura(128, 64, slF);
  slTex.repeat.set(4, nSar);
  function osveziTeksture() {
    for (const [t, f, w, h] of [[progeTex, (u, v) => BP[pasovi(v)], 4, 256], [srTex, srF, 64, 128], [tTex, tF, 4, 128], [slTex, slF, 128, 64]]) {
      const d = t.image.data;
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
        const c = f((i + 0.5) / w, (j + 0.5) / h), k = (j * w + i) * 4;
        d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = c.length > 3 ? c[3] : 255;
      }
      t.needsUpdate = true;
    }
  }

  // sarkolema (prosojna, da se vidijo jedra in proge pod njo)
  const profV = [];
  for (let i = 0; i <= 50; i++) { const x = -XV + (2 * XV * i) / 50; profV.push([x, RV * (1 + 0.012 * sum(x * 6, 3, 1))]); }
  const vv = vrtenina(profV, q(72));
  const slMat = mat(0xffffff, { map: slTex, roughness: 0.3, clearcoat: 1, transparent: true, opacity: 0.42, depthWrite: false });
  const slOut = new THREE.Mesh(osX(vv.odprta), slMat);
  // prerez sarkoleme: lipidni dvosloj (debelina povečana)
  const slRob = new THREE.Mesh(osX(prerezVrtenine(profV, (y, r) => r * 0.975, DVOSLOJ(0xb4587c, 0xf4d9c4))), mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide }));
  const vin = vrtenina(profV.map(([x, r]) => [x, r * 0.975]), q(72));
  const spMat = mat(0xf1c9b6, { roughness: 0.75, clearcoat: 0.1, sheen: 0.2, side: THREE.BackSide });
  const spIn = new THREE.Mesh(osX(vin.odprta), spMat);
  const kapM = mat(0xe6b6a6, { roughness: 0.7, clearcoat: 0.15 });
  const kapi = [new THREE.Mesh(kapa(-XV, RV * 0.98, -1, q(36), 6), kapM), new THREE.Mesh(kapa(XV, RV * 0.98, 1, q(36), 6), kapM)];
  GV.add(slOut, slRob, spIn, ...kapi);

  // miofibrile v šesterokotni mreži; robne (ob prerezu) dobijo SR in T-cevke
  const mf = [];
  for (let i = -12; i <= 12; i++) for (let j = -12; j <= 12; j++) {
    const y = SP * (i + j / 2), z = SP * j * 0.866;
    if (Math.hypot(y, z) > RMF || vRezu(y, z)) continue;
    const rob = (z > -0.001 && z < SP * 0.5 && y > 0) || (y > -SP * 0.75 && y < 0.001 && z > 0) || (Math.abs(y) < SP && Math.abs(z) < SP);
    mf.push({ y, z, rob });
  }
  const Lf = 2 * XV - 0.004;
  const mfGeo = osX(new THREE.CylinderGeometry(RF, RF, Lf, q(12), 1, true));
  const mfM = new THREE.InstancedMesh(mfGeo, mat(0xffffff, { map: progeTex, roughness: 0.45, clearcoat: 0.5, sheen: 0.3 }), mf.length);
  const robne = mf.filter((m) => m.rob);
  const zSR = robne.filter((m, i) => Math.round((m.y + m.z) / SP) % 2 === 0);
  const srM = new THREE.InstancedMesh(osX(new THREE.CylinderGeometry(RF * 1.12, RF * 1.12, Lf, q(14), 1, true)),
    mat(0x5b8fe0, { alphaMap: srTex, alphaTest: 0.5, roughness: 0.4, clearcoat: 0.6, side: THREE.DoubleSide }), zSR.length);
  const tM = new THREE.InstancedMesh(osX(new THREE.CylinderGeometry(RF * 1.2, RF * 1.2, Lf, q(14), 1, true)),
    mat(0xeef2fb, { alphaMap: tTex, alphaTest: 0.5, roughness: 0.35, clearcoat: 0.6, side: THREE.DoubleSide }), zSR.length);
  mf.forEach((m, i) => { o.position.set(0, m.y, m.z); o.rotation.set(0, 0, 0); o.scale.setScalar(1); o.updateMatrix(); mfM.setMatrixAt(i, o.matrix); });
  zSR.forEach((m, i) => { o.position.set(0, m.y, m.z); o.updateMatrix(); srM.setMatrixAt(i, o.matrix); tM.setMatrixAt(i, o.matrix); });
  // konci miofibril na obeh prerezanih koncih vlakna
  const mfKon = new THREE.InstancedMesh(new THREE.CircleGeometry(RF, q(12)), mat(0x9c3346, { roughness: 0.55, clearcoat: 0.3 }), mf.length * 2);
  mf.forEach((m, i) => {
    for (const s of [0, 1]) {
      o.position.set(s ? XV + 0.002 : -XV - 0.002, m.y, m.z); o.rotation.set(0, s ? Math.PI / 2 : -Math.PI / 2, 0); o.updateMatrix();
      mfKon.setMatrixAt(i * 2 + s, o.matrix);
    }
  });
  // rahle razlike v svetlosti in zatemnitev globje ležečih miofibril (namesto senčenja), da prerez dobi globino
  const cc = new THREE.Color();
  mf.forEach((m, i) => {
    const r = Math.hypot(m.y, m.z) / RMF, k = (0.58 + 0.42 * Math.min(1, r * 1.15)) * (0.9 + 0.2 * hash(m.y * 91, m.z * 37, 5));
    cc.setRGB(k, k, k);
    mfM.setColorAt(i, cc); mfKon.setColorAt(i * 2, cc); mfKon.setColorAt(i * 2 + 1, cc);
  });
  GV.add(mfM, srM, tM, mfKon);

  // T-cevke od roba miofibril do sarkoleme na ploskvah prereza
  const tcG = [];
  for (let k = 0; k < nSar; k++) for (const a of mejeAI()) {
    const x = -XV + (k + a) * (2 * XV / nSar);
    tcG.push(palica(V(x, RMF - 0.01, 0.002), V(x, RV * 0.985, 0.002), 0.0026, q(5)));
    tcG.push(palica(V(x, 0.002, RMF - 0.01), V(x, 0.002, RV * 0.985), 0.0026, q(5)));
  }
  const tCev = new THREE.Mesh(zdruzi(tcG), mat(0xeef2fb, { roughness: 0.35, clearcoat: 0.6 }));
  GV.add(tCev);

  // jedra pod sarkolemo
  const jedraKos = [];
  for (let i = 0, p = 0; i < (hi ? 30 : 22) && p < 3000; p++) {
    const x = -XV + 0.08 + rnd() * (2 * XV - 0.16), a = rnd() * Math.PI * 2, y = Math.cos(a) * 0.362, z = Math.sin(a) * 0.362;
    if (vRezu(y + 0.03, z + 0.03) || jedraKos.some((j) => Math.abs(j.x - x) < 0.2 && Math.abs(Math.atan2(Math.sin(j.a - a), Math.cos(j.a - a))) < 0.4)) continue;
    jedraKos.push({ x, a, y, z }); i++;
  }
  const jMat = mat(0x7a68d8, { roughness: 0.36, clearcoat: 0.6 });
  const jedra = new THREE.InstancedMesh(new THREE.SphereGeometry(1, q(20), q(12)), jMat, jedraKos.length);
  jedraKos.forEach((j, i) => {
    o.position.set(j.x, j.y, j.z); o.rotation.set(j.a, 0, 0); o.scale.set(0.085, 0.022, 0.036); o.updateMatrix(); jedra.setMatrixAt(i, o.matrix);
  });
  jedraKos.forEach((j, i) => { const k = 0.88 + 0.24 * hash(j.x * 13, j.a, 2); jedra.setColorAt(i, cc.setRGB(k, k, k * 1.02)); });
  GV.add(jedra);

  // mitohondriji: med miofibrilami ob Z-linijah in skupine pod sarkolemo
  const mitKos = [];
  const zx = (k) => -XV + k * (2 * XV / nSar);
  for (const m of robne) for (const n of robne) {
    if (Math.hypot(m.y - n.y, m.z - n.z) > SP * 1.05 || m.y + m.z >= n.y + n.z) continue;
    let cy = (m.y + n.y) / 2, cz = (m.z + n.z) / 2;
    if (Math.abs(m.z) < 0.01 && Math.abs(n.z) < 0.01) cz -= 0.011;
    else if (m.y <= 0.001 && n.y <= 0.001 && m.z > 0 && n.z > 0) cy -= 0.011;
    else continue;
    for (let k = 1; k < nSar; k++) mitKos.push([zx(k), cy, cz]);
  }
  for (let i = 0; i < (hi ? 40 : 24); i++) {
    const j = jedraKos[i % jedraKos.length], a = j.a + (rnd() - 0.5) * 0.5;
    mitKos.push([j.x + (rnd() - 0.5) * 0.25, Math.cos(a) * 0.35, Math.sin(a) * 0.35]);
  }
  const mitV = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.0065, 0.016, 2, q(6)), mat(0xe8743b, { roughness: 0.4 }), mitKos.length);
  mitKos.forEach((p, i) => {
    o.position.set(...p); o.rotation.set(0, 0, Math.PI / 2); o.scale.setScalar(1); o.updateMatrix(); mitV.setMatrixAt(i, o.matrix);
    const k = 0.85 + 0.25 * hash(p[0] * 17, p[1] * 23, p[2] * 29); mitV.setColorAt(i, cc.setRGB(k, k * 0.97, k * 0.94));
  });
  GV.add(mitV);

  const naRobu = robne.filter((m) => m.z > -0.001 && m.z < 0.01 && m.y > 0.1)[0] || robne[0];
  del("sarkolema", "Sarkolema", "Celična membrana mišičnega vlakna (v prerezu dvosloj, debelina povečana); vanjo se odpirajo T-cevke, po katerih se električni signal razširi globoko v vlakno.", "#d88aa2", [slOut, slRob], [0.3, -0.2, RV * 0.98], deliV);
  del("sarkoplazma", "Sarkoplazma", "Citoplazma mišičnega vlakna; vsebuje glikogen in mioglobin, ki hrani kisik.", "#f1c9b6", [spIn, ...kapi], [-XV - 0.005, -0.1, -0.36], deliV);
  del("jedra", "Jedra", "Vlakno nastane z zlitjem mnogih celic, zato ima na stotine jeder; ležijo ob robu, tik pod sarkolemo.", "#7a68d8", [jedra], (() => { const j = jedraKos.reduce((a, b) => (b.z - Math.abs(b.x) * 0.3 > a.z - Math.abs(a.x) * 0.3 ? b : a)); return [j.x, j.y * 1.08, j.z * 1.08]; })(), deliV);
  del("miofibrile", "Miofibrile", "Dolge niti iz zaporedja sarkomer; temni pasovi A in svetli pasovi I sosednjih miofibril se ujemajo, zato je vlakno prečno progasto.", "#9c3346", [mfM, mfKon], [-0.3, naRobu.y, naRobu.z + RF], deliV);
  del("sarkoplazemski-retikulum", "Sarkoplazemski retikulum", "Mreža cevk okoli vsake miofibrile, ki hrani kalcijeve ione; ob signalu jih sprosti in sproži krčenje.", "#5b8fe0", [srM], [0.15, zSR[2] ? zSR[2].y : 0.1, (zSR[2] ? zSR[2].z : 0) + RF * 1.15], deliV);
  del("t-cevke", "T-cevke (prečne cevke)", "Vdolbine sarkoleme, ki obkrožajo miofibrile na meji pasov A in I; signal z membrane hitro prenesejo do sarkoplazemskega retikuluma.", "#eef2fb", [tM, tCev], [zx(Math.round(nSar * 0.62)) + 0.015, 0.36, 0.004], deliV);
  del("mitohondriji", "Mitohondriji", "Ležijo med miofibrilami in pod sarkolemo; z ATP oskrbujejo miozinske glavice in črpalke za kalcij.", "#e8743b", [mitV], mitKos[Math.floor(mitKos.length * 0.4)] || [0, 0, 0], deliV);

  // =====================================================================
  // POGLED 2: SARKOMERA (1 enota = 1,5 µm)
  // =====================================================================
  const GS = new THREE.Group();
  group.add(GS);
  GS.visible = false;
  const deliS = [];
  const K = 2 / 3, D = 0.14; // enot na µm; razmik debelih filamentov (povečan)
  const debeli = [];
  for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) {
    const y = D * (i + j / 2), z = D * j * 0.866;
    if (Math.hypot(y, z) < D * 2.01) debeli.push(V(0, y, z));
  }
  const tanki = [];
  for (let a = 0; a < debeli.length; a++) for (let b = a + 1; b < debeli.length; b++) for (let c = b + 1; c < debeli.length; c++) {
    const A = debeli[a], B = debeli[b], C = debeli[c], s = D * 1.01;
    if (A.distanceTo(B) < s && B.distanceTo(C) < s && A.distanceTo(C) < s) tanki.push(A.clone().add(B).add(C).multiplyScalar(1 / 3));
  }
  // debeli filamenti (miozin) z glavicami; v sredini gola cona in M-linija
  const xD = (DEBELI / 2) * K;
  const deb = new THREE.InstancedMesh(osX(new THREE.CylinderGeometry(0.019, 0.019, 2 * xD, q(12), 1, false)), mat(0x5a7de0, { roughness: 0.4, clearcoat: 0.5 }), debeli.length);
  debeli.forEach((p, i) => { o.position.copy(p); o.rotation.set(0, 0, 0); o.scale.setScalar(1); o.updateMatrix(); deb.setMatrixAt(i, o.matrix); });
  const glG = [];
  const nKr = hi ? 12 : 8;
  debeli.forEach((p, fi) => {
    for (const sg of [-1, 1]) for (let k = 0; k < nKr; k++) {
      const x = sg * (0.075 + (k + 0.5) * ((xD - 0.09) / nKr));
      for (let h = 0; h < 2; h++) {
        const a = k * 1.05 + h * Math.PI + fi * 0.7, r = V(0, Math.cos(a), Math.sin(a));
        const g = new THREE.SphereGeometry(1, q(6), q(4));
        g.scale(0.011, 0.02, 0.011);
        const smerG = r.clone().addScaledVector(V(1, 0, 0), -sg * 0.7).normalize();
        g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), smerG));
        g.translate(x + smerG.x * 0.03, p.y + smerG.y * 0.03, p.z + smerG.z * 0.03);
        glG.push(g);
      }
    }
  });
  const glave = new THREE.Mesh(zdruzi(glG), mat(0x8fb0ff, { roughness: 0.35, clearcoat: 0.6 }));
  // M-linija: prečne povezave med debelimi filamenti
  const mG = [];
  for (let a = 0; a < debeli.length; a++) for (let b = a + 1; b < debeli.length; b++) if (debeli[a].distanceTo(debeli[b]) < D * 1.01) mG.push(palica(debeli[a], debeli[b], 0.007, q(6)));
  debeli.forEach((p) => mG.push(osX(new THREE.CylinderGeometry(0.026, 0.026, 0.03, q(12))).translate(0, p.y, p.z)));
  const mLin = new THREE.Mesh(zdruzi(mG), mat(0xd86fa0, { roughness: 0.4, clearcoat: 0.6 }));
  GS.add(deb, glave, mLin);

  // tanki filamenti (aktin): dvojna vijačnica, pripeta na Z-linijo
  const xT = TANKI * K;
  const aktG = [];
  for (const f of [0, Math.PI]) {
    const pts = [];
    for (let i = 0; i <= 60; i++) { const x = (i / 60) * xT, a = (x / 0.12) * Math.PI * 2 + f; pts.push(V(x, Math.cos(a) * 0.0065, Math.sin(a) * 0.0065)); }
    aktG.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), q(48), 0.0062, q(5), false));
  }
  const aktGeo = zdruzi(aktG);
  const akt = new THREE.InstancedMesh(aktGeo, mat(0x8fdcc2, { roughness: 0.45, clearcoat: 0.4 }), tanki.length * 2);
  GS.add(akt);

  // Z-linije: valovite (cikcak) plošče iz α-aktinina
  const RZ = 0.345;
  function zDisk() {
    const zig = (y, z) => 0.022 * (2 * Math.abs(((y * 7 + z * 3 + 10) % 1) - 0.5) * 2 - 1);
    const n = q(44), geos = [];
    for (const sg of [-1, 1]) {
      const g = new THREE.PlaneGeometry(2 * RZ, 2 * RZ, n, n);
      g.rotateY(sg > 0 ? Math.PI / 2 : -Math.PI / 2);
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) { const y = p.getY(i), z = p.getZ(i); p.setX(i, zig(y, z) + sg * 0.011); }
      g.computeVertexNormals();
      odrezi(g, (c) => Math.hypot(c.y, c.z) > RZ * 0.975);
      geos.push(g);
    }
    const pts = [];
    for (let i = 0; i <= 160; i++) { const a = (i / 160) * Math.PI * 2, y = Math.cos(a) * RZ, z = Math.sin(a) * RZ; pts.push(V(zig(y, z), y, z)); }
    geos.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 160, 0.017, q(8), true));
    return zdruzi(geos);
  }
  const zMat = mat(0xc4bce8, { roughness: 0.4, clearcoat: 0.7, side: THREE.DoubleSide });
  const zGeo = zDisk();
  const zL = new THREE.Mesh(zGeo, zMat), zD = new THREE.Mesh(zGeo.clone(), zMat);
  GS.add(zL, zD);

  // titin: vzmet od Z-linije do konca debelega filamenta
  const titMat = mat(0xf0b44a, { roughness: 0.45, clearcoat: 0.5 });
  const titin = new THREE.Mesh(new THREE.BufferGeometry(), titMat);
  GS.add(titin);
  function titinGeo(xz) {
    const geos = [];
    for (const p of debeli) for (const sg of [-1, 1]) {
      const a0 = sg * xz, a1 = sg * xD, pts = [], nOv = 7;
      for (let i = 0; i <= 56; i++) {
        const t = i / 56, x = a0 + (a1 - a0) * t, a = t * nOv * Math.PI * 2, r = 0.008 * Math.min(1, t * 6, (1 - t) * 6);
        pts.push(V(x, p.y + Math.cos(a) * r, p.z + Math.sin(a) * r));
      }
      geos.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), q(56), 0.0032, q(4), false));
    }
    return zdruzi(geos);
  }

  // trakovi pod sarkomero: pas A, pas I (dve polovici), cona H
  const trak = (barva) => new THREE.Mesh(osX(new THREE.CylinderGeometry(0.018, 0.018, 1, q(12))), mat(barva, { roughness: 0.4, clearcoat: 0.8 }));
  const YT = -0.46;
  const pasA = trak(0x4c6fd8), pasI1 = trak(0x7fcfb4), pasI2 = new THREE.Mesh(pasI1.geometry.clone(), pasI1.material), conaH = trak(0xb6c3f5);
  GS.add(pasA, pasI1, pasI2, conaH);

  function postaviSarkomero() {
    const xz = (Lsar / 2) * K;
    zL.position.x = -xz; zD.position.x = xz;
    tanki.forEach((p, i) => {
      o.position.set(-xz, p.y, p.z); o.rotation.set(i * 0.7, 0, 0); o.scale.setScalar(1); o.updateMatrix(); akt.setMatrixAt(i * 2, o.matrix);
      o.position.set(xz, p.y, p.z); o.rotation.set(i * 0.7, Math.PI, 0); o.updateMatrix(); akt.setMatrixAt(i * 2 + 1, o.matrix);
    });
    akt.instanceMatrix.needsUpdate = true;
    akt.computeBoundingSphere();
    titin.geometry.dispose();
    titin.geometry = titinGeo(xz - 0.012);
    pasA.position.set(0, YT, 0); pasA.scale.set(2 * xD, 1, 1);
    pasI1.position.set(-(xz + xD) / 2, YT, 0); pasI1.scale.set(Math.max(0.001, xz - xD), 1, 1);
    pasI2.position.set((xz + xD) / 2, YT, 0); pasI2.scale.set(Math.max(0.001, xz - xD), 1, 1);
    const h = Math.max(0, xz - xT);
    conaH.visible = h > 0.004 && GS.visible;
    conaH.position.set(0, YT + 0.045, 0); conaH.scale.set(Math.max(0.001, 2 * h), 1, 1);
    // točke delov, ki se premikajo
    for (const d of deliS) {
      if (d.id === "z-linija") d.tocka = [-xz, 0.2, 0.25];
      if (d.id === "aktin") d.tocka = [-xz + xT * 0.3, tanki[0].y, tanki[0].z];
      if (d.id === "titin") d.tocka = [-(xz + xD) / 2, debeli[0].y + 0.03, debeli[0].z + 0.02];
      if (d.id === "pas-i") d.tocka = [-(xz + xD) / 2, YT, 0.02];
      if (d.id === "cona-h") d.tocka = [0, YT + 0.045, 0.02];
    }
  }
  const zgornji = debeli.reduce((a, b) => (b.y + b.z > a.y + a.z ? b : a));
  del("z-linija", "Z-linija (Z-disk)", "Meja med sosednjima sarkomerama; nanjo so pripeti aktinski filamenti. V prerezu je videti kot cikcak črta.", "#c4bce8", [zL, zD], [0, 0, 0], deliS);
  del("aktin", "Aktinski (tanki) filamenti", "Tanke niti iz dveh zvitih verižic aktina; s Z-linije segajo proti sredini sarkomere.", "#8fdcc2", [akt], [0, 0, 0], deliS);
  del("miozin", "Miozinski (debeli) filamenti", "Debele niti v sredini sarkomere; njihova dolžina (1,6 µm) določa širino pasu A in se pri krčenju ne spremeni.", "#5a7de0", [deb], [0.3, zgornji.y + 0.02, zgornji.z + 0.012], deliS);
  del("miozinske-glavice", "Miozinske glavice", "Izrastki miozina, ki se z energijo iz ATP pripnejo na aktin, ga potegnejo proti sredini in spustijo – kot veslači.", "#8fb0ff", [glave], [-0.4, zgornji.y + 0.04, zgornji.z + 0.02], deliS);
  del("m-linija", "M-linija", "Sredina sarkomere, kjer so debeli filamenti povezani med seboj in držijo pravilno razporeditev.", "#d86fa0", [mLin], [0, zgornji.y + 0.03, zgornji.z + 0.02], deliS);
  del("titin", "Titin", "Velikanska prožna beljakovina od Z-linije do miozina; kot vzmet vrne sproščeno sarkomero na prvotno dolžino.", "#f0b44a", [titin], [0, 0, 0], deliS);
  del("pas-a", "Pas A", "Temni pas, širok toliko, kot je dolg miozinski filament; pri krčenju ostane enako širok.", "#4c6fd8", [pasA], [0.25, YT, 0.02], deliS);
  del("pas-i", "Pas I", "Svetli pas samo z aktinom na obeh straneh Z-linije; pri krčenju se zoži.", "#7fcfb4", [pasI1, pasI2], [0, 0, 0], deliS);
  del("cona-h", "Cona H", "Srednji del pasu A, kjer je samo miozin; ko aktin zdrsne do sredine, izgine.", "#b6c3f5", [conaH], [0, 0, 0], deliS);
  postaviSarkomero();

  // ---------- nadzor ----------
  let pogled = "vlakno", krc = 0;
  const f1 = (x) => x.toFixed(1).replace(".", ",");
  function nastaviKrcenje(v) {
    krc = Math.min(1, Math.max(0, +v || 0));
    Lsar = 2.5 - 0.6 * krc;
    const s = Lsar / 2.5, g = 1 / Math.sqrt(s);
    GV.scale.set(s, g, g);
    for (const d of deliV) d.tocka = nagni(d.tockaOsn.map((x, i) => x * (i ? g : s)));
    osveziTeksture();
    postaviSarkomero();
  }
  // vlakno rahlo nagnemo, da bolje zapolni zaslon in deluje bolj prostorsko
  const GVn = new THREE.Group();
  group.remove(GV); GVn.add(GV); group.add(GVn);
  GVn.rotation.z = 0.2;
  GVn.updateMatrix();
  const nagni = (t) => V(...t).applyMatrix4(GVn.matrix).toArray().map((x) => Math.round(x * 1000) / 1000);
  deliV.forEach((d) => { d.tockaOsn = d.tocka.slice(); d.tocka = nagni(d.tockaOsn); });
  const nadzor = [
    {
      tip: "izbira", id: "pogled", oznaka: "Pogled", moznosti: [["vlakno", "Vlakno"], ["sarkomera", "Sarkomera"]], vrednost: "vlakno",
      ob: (v) => { pogled = v === "sarkomera" ? "sarkomera" : "vlakno"; GVn.visible = pogled === "vlakno"; GS.visible = !GVn.visible; postaviSarkomero(); },
    },
    { tip: "drsnik", id: "krcenje", oznaka: "Krčenje", min: 0, max: 1, korak: 0.01, vrednost: 0, ob: nastaviKrcenje },
    { tip: "izpis", id: "dolzina", oznaka: "Sarkomera", vrednost: () => `Dolžina sarkomere: ${f1(Lsar)} µm` },
    { tip: "izpis", id: "pasovi", oznaka: "Pasovi", vrednost: () => `pas A: 1,6 µm · pas I: ${f1(Lsar - DEBELI)} µm · cona H: ${f1(Math.max(0, Lsar - 2 * TANKI))} µm` },
  ];
  const z = ctx.zacetek || {};
  for (const n of nadzor) if (n.ob && z[n.id] !== undefined) { n.vrednost = z[n.id]; n.ob(z[n.id]); }

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

  return {
    group,
    get deli() { return pogled === "sarkomera" ? deliS : deliV; },
    nadzor,
    get merilo() { return pogled === "sarkomera" ? { m: 3e-6, oznaka: "3 µm" } : info.merilo; },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
