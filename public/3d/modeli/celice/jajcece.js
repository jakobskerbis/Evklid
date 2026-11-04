// Jajčna celica v prerezu s prozorno ovojnico in korono radiato; ob njej semenčice za primerjavo velikosti.
// Izbira »Stopnja«: ob ovulaciji (delitveno vreteno, polarno telesce) ali pred ovulacijo (jedro – zarodni mešiček).
// Pogodba graditelja: docs/3d.md.

export const info = {
  id: "celica-jajcece",
  naslov: "Jajčna celica",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Največja celica človeškega telesa (okoli 120 µm), obdana s prozorno ovojnico in venčkom foliklovih celic (korona radiata). Ob njej so semenčice v pravi velikosti. Zrnc in celic korone je manj kot v resnici.",
  merilo: { m: 200e-6, oznaka: "200 µm" },
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

  const RE = 0.58, ZI = 0.62, ZO = 0.74, KR = 0.745; // oolema, zona (notranji, zunanji rob), začetek korone
  const dPT = V(-0.62, 0.78, 0.02).normalize(); // smer polarnega telesca
  const tPT = V(1, 0, 0).cross(dPT).normalize(); // tangenta (smer vretena)

  // ---------- jajčna celica: membrana (oolema) in citoplazma ----------
  let ovulacija = true;
  const oblE = (d) => RE * (1 + 0.012 * fbm(d.x * 3 + 2, d.y * 3, d.z * 3) - (ovulacija ? 0.1 * Math.pow(Math.max(0, d.dot(dPT)), 60) : 0));
  function jajce() {
    const l = lupina(oblE, q(96), q(64));
    return { l, rob: rob(oblE, 0.009, q(48)) };
  }
  const memMat = mat(0xd88aa2, { roughness: 0.34, clearcoat: 0.9, sheen: 0.6 });
  const citMat = mat(0xf3dcae, { roughness: 0.75, clearcoat: 0.1, sheen: 0.2, side: THREE.BackSide });
  const memOut = new THREE.Mesh(new THREE.BufferGeometry(), memMat);
  const memPok = new THREE.Mesh(new THREE.BufferGeometry(), memMat);
  const memRob = new THREE.Mesh(new THREE.BufferGeometry(), memMat);
  const citIn = new THREE.Mesh(new THREE.BufferGeometry(), citMat);
  memPok.visible = false;
  function postaviJajce() {
    const j = jajce();
    for (const m of [memOut, memPok, memRob, citIn]) m.geometry.dispose();
    memOut.geometry = j.l.odprta; memPok.geometry = j.l.pokrov; memRob.geometry = j.rob;
    citIn.geometry = j.l.odprta.clone().scale(0.985, 0.985, 0.985);
  }
  postaviJajce();
  group.add(memOut, memPok, memRob, citIn);

  // rumenjakova zrnca (v odprtem delu in ob njem), mitohondriji
  const nRum = hi ? 190 : 140, rumK = [];
  for (let p = 0; rumK.length < nRum && p < 20000; p++) {
    const v = nakljucna(RE * 0.95);
    if (v.length() > RE * 0.93 || v.x > 0.12 || v.y < -0.12 || v.z < -0.12) continue;
    if (v.clone().sub(V(-0.04, 0.04, 0.03)).length() < 0.15 || v.distanceTo(dPT.clone().multiplyScalar(0.5)) < 0.09) continue;
    rumK.push(v);
  }
  const rum = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.0085, hi ? 1 : 0), mat(0xf2c94c, { roughness: 0.4, clearcoat: 0.6 }), rumK.length);
  rumK.forEach((v, i) => { o.position.copy(v); o.rotation.set(0, 0, 0); o.scale.setScalar(0.6 + rnd() * 0.9); o.updateMatrix(); rum.setMatrixAt(i, o.matrix); });
  const mitK = [];
  for (let p = 0; mitK.length < (hi ? 70 : 40) && p < 20000; p++) {
    const v = nakljucna(RE * 0.95);
    if (v.length() > RE * 0.9 || v.x > 0.1 || v.y < -0.1 || v.z < -0.1 || rumK.some((r) => r.distanceTo(v) < 0.02)) continue;
    if (v.clone().sub(V(-0.04, 0.04, 0.03)).length() < 0.15) continue;
    mitK.push(v);
  }
  const mit = new THREE.InstancedMesh(new THREE.SphereGeometry(0.0095, q(8), q(6)), mat(0xe8743b, { roughness: 0.4 }), mitK.length);
  mitK.forEach((v, i) => { o.position.copy(v); o.scale.set(1, 0.8, 1); o.rotation.set(rnd() * 3, rnd() * 3, 0); o.updateMatrix(); mit.setMatrixAt(i, o.matrix); });
  group.add(rum, mit);

  // kortikalna zrnca: plast tik pod membrano (vidna na notranji steni)
  const korK = [];
  for (let p = 0; korK.length < (hi ? 900 : 450) && p < 40000; p++) {
    smer.copy(nakljucna()).normalize();
    if (vIzrezu(V(smer.x + 0.04, smer.y - 0.04, smer.z - 0.04)) || smer.dot(dPT) > 0.93) continue;
    korK.push(smer.clone().multiplyScalar(oblE(smer) * (0.955 - rnd() * 0.02)));
  }
  const kor = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.0075, 0), mat(0xd95a8c, { roughness: 0.35, clearcoat: 0.8 }), korK.length);
  korK.forEach((v, i) => { o.position.copy(v); o.rotation.set(0, 0, 0); o.scale.setScalar(1); o.updateMatrix(); kor.setMatrixAt(i, o.matrix); });
  group.add(kor);

  // ---------- ob ovulaciji: delitveno vreteno (2. mejotska delitev) in prvo polarno telesce ----------
  const vretG = [], krG = [];
  const VC = dPT.clone().multiplyScalar(RE * 0.83);
  const bT = dPT.clone().cross(tPT).normalize();
  for (let i = 0; i < (hi ? 30 : 18); i++) {
    const a = (i / 30) * Math.PI * 2 * 1.0 + rnd() * 0.2, w = 0.028 + rnd() * 0.01, pts = [];
    for (let k = 0; k <= 12; k++) {
      const t = -1 + (2 * k) / 12, r = w * Math.cos((t * Math.PI) / 2.4);
      pts.push(VC.clone().addScaledVector(tPT, t * 0.06).addScaledVector(dPT, Math.cos(a) * r).addScaledVector(bT, Math.sin(a) * r));
    }
    vretG.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), q(16), 0.0016, 3, false));
  }
  for (let i = 0; i < 12; i++) { // kromosomi (dve sestrski kromatidi) v ekvatorialni ravnini
    const a = (i / 12) * Math.PI * 2, r = 0.016 + (i % 3) * 0.008;
    const c = VC.clone().addScaledVector(dPT, Math.cos(a) * r).addScaledVector(bT, Math.sin(a) * r);
    for (const s of [-1, 1]) krG.push(palica(c.clone().addScaledVector(tPT, s * 0.004).addScaledVector(dPT, -0.008), c.clone().addScaledVector(tPT, s * 0.004).addScaledVector(dPT, 0.008), 0.0035, q(6)));
  }
  const vreteno = new THREE.Mesh(zdruzi(vretG), mat(0xa9d8f0, { roughness: 0.4, clearcoat: 0.5 }));
  const kromV = new THREE.Mesh(zdruzi(krG), mat(0x4b3aa6, { roughness: 0.5, clearcoat: 0.5 }));
  group.add(vreteno, kromV);
  // polarno telesce v perivitelinskem prostoru (prerezano kot celica)
  const PC = dPT.clone().multiplyScalar(RE * 0.985), RP = 0.056;
  const ptG = new THREE.SphereGeometry(RP, q(40), q(28));
  { const p = ptG.attributes.position, v = V(0, 0, 0); for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); v.multiplyScalar(1 + 0.04 * sum(v.x * 40, v.y * 40, v.z * 40)); p.setXYZ(i, v.x, v.y, v.z); } ptG.computeVertexNormals(); }
  const ptMat = mat(0xe6a2b8, { roughness: 0.34, clearcoat: 0.9 });
  const polT = new THREE.Mesh(odrezi(ptG.clone(), (c) => vIzrezu(c), PC), ptMat);
  const polTIn = new THREE.Mesh(odrezi(ptG.clone().scale(0.95, 0.95, 0.95), (c) => vIzrezu(c), PC), mat(0xf3dcae, { roughness: 0.7, side: THREE.BackSide }));
  const polTPok = new THREE.Mesh(odrezi(ptG, (c) => !vIzrezu(c), PC), ptMat);
  polTPok.visible = false;
  for (const m of [polT, polTIn, polTPok]) m.position.copy(PC);
  const ptKr = [];
  for (let i = 0; i < 5; i++) ptKr.push(new THREE.IcosahedronGeometry(0.006, 1).translate(PC.x + (rnd() - 0.5) * 0.04, PC.y + (rnd() - 0.5) * 0.04, PC.z + (rnd() - 0.5) * 0.04));
  const polKr = new THREE.Mesh(zdruzi(ptKr), mat(0x4b3aa6, { roughness: 0.5, clearcoat: 0.5 }));
  group.add(polT, polTIn, polTPok, polKr);

  // ---------- pred ovulacijo: jedro (zarodni mešiček) z jedrcem ----------
  const JC = V(-0.04, 0.04, 0.03), RJ = 0.125;
  const oblJ = (d) => RJ * (1 + 0.03 * sum(d.x * 2 + 7, d.y * 2, d.z * 2));
  const jl = lupina(oblJ, q(56), q(36));
  const jMat = mat(0x7a68d8, { roughness: 0.34 });
  const jOut = new THREE.Mesh(jl.odprta, jMat), jPok = new THREE.Mesh(jl.pokrov, jMat), jRob = new THREE.Mesh(rob(oblJ, 0.005, q(32)), jMat);
  const jIn = new THREE.Mesh(jl.odprta.clone().scale(0.95, 0.95, 0.95), mat(0xb9a8ff, { roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide }));
  jPok.visible = false;
  for (const m of [jOut, jPok, jRob, jIn]) m.position.copy(JC);
  const jcG = new THREE.IcosahedronGeometry(0.04, hi ? 3 : 2);
  { const p = jcG.attributes.position, v = V(0, 0, 0); for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); v.multiplyScalar(1 + 0.1 * fbm(v.x * 50, v.y * 50, v.z * 50)); p.setXYZ(i, v.x, v.y, v.z); } jcG.computeVertexNormals(); }
  const jedrce = new THREE.Mesh(jcG, mat(0x34268a, { roughness: 0.6, clearcoat: 0.3 }));
  jedrce.position.copy(JC).add(V(-0.03, 0.03, 0.02));
  const jedroSk = [jOut, jPok, jRob, jIn, jedrce];
  group.add(...jedroSk);

  // ---------- prozorna ovojnica (zona pellucida) ----------
  const zlo = lupina(() => ZO, q(80), q(56)), zli = lupina(() => ZI, q(64), q(44));
  const zMat = mat(0xd9d4f2, { roughness: 0.2, clearcoat: 1, sheen: 0.8, sheenColor: new THREE.Color(0xe8f0ff), transparent: true, opacity: 0.55, depthWrite: false });
  const zOut = new THREE.Mesh(zlo.odprta, zMat), zPok = new THREE.Mesh(zlo.pokrov, zMat);
  const zIn = new THREE.Mesh(zli.odprta, mat(0xc9c2ea, { roughness: 0.3, clearcoat: 0.8, side: THREE.BackSide, transparent: true, opacity: 0.7, depthWrite: false }));
  zPok.visible = false;
  // ploskve prereza: četrtine kolobarja v ravninah x = 0, y = 0, z = 0 (vlaknasta zgradba)
  const vlakTex = tekstura(128, 32, (u, v) => { const n = 0.5 + 0.5 * Math.sin(v * 180 + sum(u * 6, v * 30, 1) * 3); return [212 + 20 * n, 206 + 20 * n, 238 + 14 * n]; });
  const ploskve = [];
  for (const [ax, sg] of [["x", 1], ["y", -1], ["z", -1]]) {
    const pos = [], uv = [], idx = [], nr = 6, nk = q(24);
    for (let i = 0; i <= nr; i++) for (let j = 0; j <= nk; j++) {
      const r = ZI + ((ZO - ZI) * i) / nr, a = ((j / nk) * Math.PI) / 2, c = Math.cos(a) * r, s = Math.sin(a) * r;
      if (ax === "x") pos.push(0, c, s); else if (ax === "y") pos.push(-c, 0, s); else pos.push(-c, s, 0);
      uv.push(i / nr, j / nk);
    }
    const w = nk + 1;
    for (let i = 0; i < nr; i++) for (let j = 0; j < nk; j++) { const a = i * w + j; if (sg > 0) idx.push(a, a + 1, a + w, a + 1, a + w + 1, a + w); else idx.push(a, a + w, a + 1, a + 1, a + w, a + w + 1); }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); g.computeVertexNormals();
    ploskve.push(g);
  }
  const zPl = new THREE.Mesh(zdruzi(ploskve), mat(0xffffff, { map: vlakTex, roughness: 0.45, clearcoat: 0.6, side: THREE.DoubleSide }));
  zOut.renderOrder = 2; zIn.renderOrder = 1;
  group.add(zOut, zPok, zIn, zPl);

  // ---------- korona radiata: stebričaste foliklove celice okoli ovojnice ----------
  const korona = [];
  const nK = hi ? 1190 : 700, nZun = hi ? 200 : 100;
  const kSkupaj = nK + nZun;
  for (let i = 0, p = 0; korona.length < kSkupaj && p < 60000; p++) {
    smer.copy(nakljucna()).normalize();
    const zun = korona.length >= nK;
    if (vIzrezu(V(smer.x + 0.02, smer.y - 0.02, smer.z - 0.02))) continue;
    const r = zun ? 0.86 + rnd() * 0.05 : KR + 0.06 + rnd() * 0.012;
    const pos = smer.clone().multiplyScalar(r);
    const min = zun ? 0.075 : 0.05;
    if (korona.some((k) => k.p.distanceToSquared(pos) < min * min)) continue;
    korona.push({ p: pos, d: smer.clone(), zun });
  }
  const kGeo = new THREE.SphereGeometry(1, hi ? 6 : 5, 4);
  const kMat = mat(0xffffff, { roughness: 0.45, clearcoat: 0.5, sheen: 0.5 });
  const kor2 = new THREE.InstancedMesh(kGeo, kMat, korona.length);
  const cA = new THREE.Color(0xf3c2a4), cB = new THREE.Color(0xe7a88e), cT = new THREE.Color();
  korona.forEach((k, i) => {
    o.position.copy(k.p); o.quaternion.setFromUnitVectors(V(0, 1, 0), k.d); o.rotateY(rnd() * 3);
    if (k.zun) o.scale.set(0.034, 0.03, 0.03); else o.scale.set(0.028 + rnd() * 0.006, 0.062, 0.026 + rnd() * 0.006);
    o.updateMatrix(); kor2.setMatrixAt(i, o.matrix);
    kor2.setColorAt(i, cT.copy(cA).lerp(cB, rnd()));
  });
  // izrastki foliklovih celic skozi ovojnico do oocite (na ploskvah prereza)
  const izG = [];
  for (let i = 0; i < (hi ? 36 : 20); i++) {
    const a = ((i % 12) / 12 + 0.04) * (Math.PI / 2), r0 = KR + 0.01, r1 = RE + 0.005, pl = Math.floor(i / 12);
    const pt = (r) => (pl === 0 ? V(0.002, Math.cos(a) * r, Math.sin(a) * r) : pl === 1 ? V(-Math.cos(a) * r, 0.002, Math.sin(a) * r) : V(-Math.cos(a) * r, Math.sin(a) * r, 0.002));
    izG.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([pt(r0), pt((r0 + r1) / 2).add(V(0.003, 0.003, 0.003)), pt(r1)]), 8, 0.0024, 4, false));
  }
  const izr = new THREE.Mesh(zdruzi(izG), kMat);
  group.add(kor2, izr);

  // ---------- semenčice v pravi velikosti (≈ 60 µm, pol premera jajčne celice) ----------
  const semMat = mat(0xd9f0ff, { roughness: 0.35, clearcoat: 0.9 });
  const semGlMat = mat(0x8fe0d0, { roughness: 0.3, clearcoat: 1 });
  const sem = [];
  for (const [dx, dy, dz, tx, ty, tz, fz] of [[0.62, -0.22, 0.75, 0.2, 0.95, -0.1, 0], [0.25, -0.72, 0.65, -0.95, 0.1, 0.3, 1.7], [0.92, 0.32, 0.22, -0.2, 0.3, 0.9, 3.1]]) {
    const d = V(dx, dy, dz).normalize(), t = V(tx, ty, tz).projectOnPlane(d).normalize(), n = d.clone().cross(t);
    const glava = new THREE.SphereGeometry(1, q(14), q(10)).scale(0.026, 0.016, 0.008);
    glava.applyMatrix4(new THREE.Matrix4().makeBasis(d.clone().negate(), t, n));
    const gp = d.clone().multiplyScalar(0.9);
    glava.translate(gp.x, gp.y, gp.z);
    const rep = new THREE.Mesh(new THREE.BufferGeometry(), semMat);
    sem.push({ d, t, n, f: fz, rep });
    group.add(rep);
    sem.glave = (sem.glave || []).concat([glava]);
  }
  const semGlave = new THREE.Mesh(zdruzi(sem.glave), semGlMat);
  group.add(semGlave);
  function postaviSemencice(cas) {
    for (const s of sem) {
      const pts = [];
      for (let i = 0; i <= 40; i++) {
        const u = i / 40, th = (u * 0.58) / 0.95, R = 0.922 + 0.045 * Math.min(1, u * 2.5);
        const val = 0.03 * Math.pow(u, 1.1) * Math.sin(u * 14 - cas * 9 + s.f);
        pts.push(s.d.clone().multiplyScalar(Math.cos(th)).addScaledVector(s.t, Math.sin(th)).multiplyScalar(R).addScaledVector(s.n, val));
      }
      s.rep.geometry.dispose();
      s.rep.geometry = cev(new THREE.CatmullRomCurve3(pts), q(60), (u) => (u < 0.08 ? 0.0065 : 0.0052 - 0.0028 * u), q(6), true);
    }
  }
  postaviSemencice(0);
  const semMeshes = [semGlave, ...sem.map((s) => s.rep)];

  // ---------- deli ----------
  const D = {};
  const dd = (id, ime, opis, barva, meshes, tocka) => { const sez = []; del(id, ime, opis, barva, meshes, tocka, sez); D[id] = sez[0]; };
  const naE = (x, y, z, f = 1.01) => { const d = V(x, y, z).normalize(); return d.multiplyScalar(oblE(d) * f).toArray(); };
  dd("membrana", "Celična membrana", "Meja jajčne celice; ko se z njo zlije membrana ene semenčice, se jajčna celica takoj zaščiti pred drugimi.", "#d88aa2", [memOut, memPok, memRob], naE(-0.55, 0.2, 0.8, 1.0));
  dd("citoplazma", "Citoplazma", "Bogata zaloga snovi in organelov, iz katerih živi zarodek prve dni po oploditvi.", "#f3dcae", [citIn], naE(0.2, -0.3, -0.9, 0.96));
  dd("rumenjak", "Rumenjakova zrnca", "Zrnca s hranilnimi snovmi; človeška jajčna celica jih ima malo, ker zarodek kmalu dobi hrano od matere.", "#f2c94c", [rum], (rumK.find((v) => v.x < -0.15 && v.y > 0.15 && v.z > 0.15) || rumK[0]).toArray());
  dd("mitohondriji", "Mitohondriji", "Jajčna celica jih ima več sto tisoč; vsi mitohondriji zarodka so materini.", "#e8743b", [mit], (mitK.find((v) => v.x < -0.1 && v.y > 0.1 && v.z > 0.1) || mitK[0]).toArray());
  dd("kortikalna-zrnca", "Kortikalna zrnca", "Mehurčki tik pod membrano; ob oploditvi izpraznijo vsebino in prozorno ovojnico strdijo, da ne vstopi druga semenčica.", "#d95a8c", [kor], naE(0.3, 0.35, -0.85, 0.94));
  dd("vreteno", "Delitveno vreteno s kromosomi", "Ob ovulaciji jedrne ovojnice ni: kromosomi čakajo na delitvenem vretenu in drugo mejotsko delitev dokončajo šele ob oploditvi.", "#a9d8f0", [vreteno, kromV], VC.toArray());
  dd("polarno-telesce", "Polarno telesce", "Majhna celica, ki se odcepi pri mejozi; dobi polovico kromosomov, a skoraj nič citoplazme, in propade.", "#e6a2b8", [polT, polTIn, polTPok, polKr], PC.clone().add(V(-0.01, 0.02, 0.02)).toArray());
  dd("jedro", "Jedro (zarodni mešiček)", "Veliko jedro nezrele jajčne celice v jajčniku; tik pred ovulacijo se ovojnica razgradi in celica nadaljuje mejozo.", "#7a68d8", [jOut, jPok, jRob, jIn], JC.clone().add(V(0.06, 0.1, 0.06)).toArray());
  dd("jedrce", "Jedrce", "Telesce v jedru, kjer nastajajo ribosomi; nezrela jajčna celica jih potrebuje zelo veliko.", "#34268a", [jedrce], jedrce.position.toArray());
  dd("zona", "Prozorna ovojnica", "Debela prosojna plast iz beljakovin in sladkorjev (zona pellucida); nanjo se pripne semenčica iste vrste.", "#d9d4f2", [zOut, zPok, zIn, zPl], [-0.02, 0.48, 0.47]);
  dd("korona", "Korona radiata (žarkasti venec)", "Venec foliklovih celic, ki jajčno celico hranijo; z izrastki segajo skozi prozorno ovojnico. Semenčice se morajo preriniti med njimi.", "#f3c2a4", [kor2, izr], [0.25, 0.55, 0.62]);
  dd("semencice", "Semenčice (za primerjavo)", "Semenčice v pravi velikosti: s 60 µm so dolge pol premera jajčne celice, njihova glava pa meri le 5 µm.", "#8fe0d0", semMeshes, sem[0].d.clone().multiplyScalar(0.91).toArray());

  let semVidne = true, cela = false;
  function osvezi() {
    for (const m of [vreteno, kromV, polT, polTIn, polKr]) m.visible = ovulacija;
    polTPok.visible = ovulacija && cela;
    for (const m of jedroSk) m.visible = !ovulacija;
    jPok.visible = !ovulacija && cela; jRob.visible = !ovulacija && !cela;
    memPok.visible = cela; zPok.visible = cela; memRob.visible = !cela; zPl.visible = !cela; izr.visible = !cela;
    for (const m of semMeshes) m.visible = semVidne;
    deli = ["membrana", "citoplazma", ...(ovulacija ? ["vreteno", "polarno-telesce"] : ["jedro", "jedrce"]), "rumenjak", "mitohondriji", "kortikalna-zrnca", "zona", "korona", ...(semVidne ? ["semencice"] : [])].map((id) => D[id]);
  }
  osvezi();

  const nadzor = [
    {
      tip: "izbira", id: "stopnja", oznaka: "Stopnja", moznosti: [["ovulacija", "Ob ovulaciji"], ["jajcnik", "Pred ovulacijo"]], vrednost: "ovulacija",
      ob: (v) => { const n = v !== "jajcnik"; if (n !== ovulacija) { ovulacija = n; postaviJajce(); } osvezi(); },
    },
    { tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cela", "Cela celica"]], vrednost: "prerez", ob: (v) => { cela = v === "cela"; osvezi(); } },
    { tip: "stikalo", id: "semencice", oznaka: "Semenčice za primerjavo", vrednost: true, ob: (v) => { semVidne = !!v; osvezi(); } },
  ];
  const z = ctx.zacetek || {};
  for (const n of nadzor) if (z[n.id] !== undefined) { n.vrednost = z[n.id]; n.ob(z[n.id]); }

  // rahle razlike v svetlosti med ponovljenimi deli (organeli in beljakovine niso vsi povsem enaki)
  {
    const c = new THREE.Color();
    group.traverse((m) => {
      if (!m.isInstancedMesh || m.instanceColor) return;
      for (let i = 0; i < m.instanceMatrix.count; i++) { const k = 0.88 + 0.2 * hash(i * 1.37, m.instanceMatrix.count * 0.11, 7); m.setColorAt(i, c.setRGB(k, k, k)); }
    });
  }

  return {
    group,
    get deli() { return deli; },
    nadzor,
    korak(t) {
      if (!gib || !semVidne) return;
      postaviSemencice(t);
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
