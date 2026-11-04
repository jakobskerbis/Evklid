// Nevron (živčna celica): celično telo v prerezu, dendriti, aksonski grič, akson z mielinsko ovojnico in končiči.
// Pogodba graditelja: docs/3d.md. Brez uvozov; THREE pride od kompleta.

export const info = {
  id: "celica-nevron",
  naslov: "Nevron (živčna celica)",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Gibalni nevron z dendriti, celičnim telesom v prerezu in aksonom z mielinsko ovojnico. Akson je močno skrajšan: v resnici je lahko dolg do 1 m, odsek med dvema Ranvierjevima zažemkoma pa meri okoli 1 mm.",
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

  // ---------- celično telo (soma) ----------
  const S = V(-0.5, 0.07, -0.02);
  const RS = 0.185;
  const osA = V(1, -0.14, 0).normalize(); // smer aksona
  const kam = V(-0.47, 0.34, 0.81).normalize(); // privzeta smer proti gledalcu
  const dSmeri = [
    [-0.92, 0.3, -0.25], [-0.55, -0.72, 0.42], [-0.15, 0.92, -0.38], [0.32, 0.82, 0.3],
    [0.12, -0.88, -0.45], [-0.62, -0.18, -0.76], [-0.86, -0.36, 0.36], [0.28, 0.32, -0.9],
  ].map(([x, y, z]) => V(x, y, z).normalize());
  const oblS = (d) => {
    let b = 0;
    for (const u of dSmeri) b += 0.55 * Math.pow(Math.max(0, d.dot(u)), 7);
    b += 0.3 * Math.pow(Math.max(0, d.dot(osA)), 4);
    return RS * (1 + b + 0.045 * fbm(d.x * 2.2 + 1, d.y * 2.2, d.z * 2.2));
  };
  const soma = lupina(oblS, q(120), q(72));
  const somaMat = mat(0xd88aa2, { roughness: 0.32, clearcoat: 1 });
  const somaOut = new THREE.Mesh(soma.odprta, somaMat);
  const citMat = mat(0xf1c9b6, { roughness: 0.75, clearcoat: 0.1, sheen: 0.2, side: THREE.BackSide });
  const somaIn = new THREE.Mesh(soma.odprta.clone().scale(0.975, 0.975, 0.975), citMat);
  const somaRob = new THREE.Mesh(rob(oblS, 0.008, q(48)), somaMat);
  const somaPokrov = new THREE.Mesh(soma.pokrov, somaMat);
  somaPokrov.visible = false;
  for (const m of [somaOut, somaIn, somaRob, somaPokrov]) { m.position.copy(S); group.add(m); }
  const naS = (x, y, z, f = 1) => { const d = V(x, y, z).normalize(); return d.multiplyScalar(oblS(d) * f).add(S).toArray(); };

  // jedro z jedrcem (tudi prerezano)
  const RJ = 0.074, J = S.clone().add(V(0.01, -0.005, -0.015));
  const oblJ = (d) => RJ * (1 + 0.03 * sum(d.x * 2 + 5, d.y * 2, d.z * 2));
  const jl = lupina(oblJ, q(64), q(40));
  const jMat = mat(0x7a68d8, { roughness: 0.34 });
  const jOut = new THREE.Mesh(jl.odprta, jMat);
  const nukMat = mat(0xb9a8ff, { roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide });
  const jIn = new THREE.Mesh(jl.odprta.clone().scale(0.95, 0.95, 0.95), nukMat);
  const jRob = new THREE.Mesh(rob(oblJ, 0.005, q(24)), jMat);
  const jPokrov = new THREE.Mesh(jl.pokrov, jMat);
  jPokrov.visible = false;
  for (const m of [jOut, jIn, jRob, jPokrov]) { m.position.copy(J); group.add(m); }
  const jcGeo = new THREE.IcosahedronGeometry(0.024, hi ? 4 : 2);
  {
    const p = jcGeo.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); v.multiplyScalar(1 + 0.1 * fbm(v.x * 90, v.y * 90, v.z * 90)); p.setXYZ(i, v.x, v.y, v.z); }
    jcGeo.computeVertexNormals();
  }
  const jedrce = new THREE.Mesh(jcGeo, mat(0x34268a, { roughness: 0.6, clearcoat: 0.3 }));
  jedrce.position.copy(J).add(V(-0.02, 0.02, 0.02));
  group.add(jedrce);

  // Nisslova telesca: skladi zrnatega ER (ni jih v aksonskem griču)
  const nisslGeo = zdruzi([-1, 0, 1].map((s) => {
    const g = new THREE.SphereGeometry(1, q(10), q(6));
    g.scale(0.017, 0.0032, 0.011).translate(s * 0.0015, s * 0.0065, 0);
    return g;
  }));
  const nNissl = hi ? 70 : 40;
  const nissl = new THREE.InstancedMesh(nisslGeo, mat(0x4f74d6, { roughness: 0.5 }), nNissl);
  const nisslT = [];
  for (let k = 0; k < nNissl;) {
    smer.copy(nakljucna()).normalize();
    if (smer.dot(osA) > 0.7) continue;
    const r = RJ + 0.02 + rnd() * (oblS(smer) * 0.9 - RJ - 0.025);
    o.position.copy(smer).multiplyScalar(r).add(S);
    if (o.position.distanceTo(J) < RJ + 0.015) continue;
    o.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); o.scale.setScalar(0.8 + rnd() * 0.5); o.updateMatrix();
    nissl.setMatrixAt(k++, o.matrix);
    if (vIzrezu(smer)) nisslT.push(o.position.clone());
  }
  group.add(nissl);

  // mitohondriji v somi
  const nMit = hi ? 16 : 10;
  const mitG = new THREE.CapsuleGeometry(0.0065, 0.02, q(4), q(10));
  const mito = new THREE.InstancedMesh(mitG, mat(0xe8743b, { roughness: 0.38 }), nMit);
  const mitT = [];
  for (let k = 0; k < nMit;) {
    smer.copy(nakljucna()).normalize();
    const r = RJ + 0.025 + rnd() * (oblS(smer) * 0.85 - RJ - 0.03);
    o.position.copy(smer).multiplyScalar(r).add(S);
    o.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); o.scale.setScalar(1); o.updateMatrix();
    mito.setMatrixAt(k++, o.matrix);
    if (vIzrezu(smer)) mitT.push(o.position.clone());
  }
  group.add(mito);

  // ---------- dendriti: razvejana drevesca, ki se tanjšajo; na tanjših vejah dendritni trni ----------
  const dGeo = [], trni = [];
  function veja(p0, dir, dol, r0, glob) {
    const pts = [p0.clone()];
    let p = p0.clone();
    const d = dir.clone();
    for (let i = 0; i < 4; i++) {
      d.add(nakljucna(0.22)).normalize();
      const k = d.dot(kam);
      if (k > 0.25 && p.distanceTo(S) < 0.5) d.addScaledVector(kam, -(k - 0.25)).normalize();
      p = p.clone().addScaledVector(d, dol / 4);
      if (p.length() > 0.94) { p.multiplyScalar(0.94 / p.length()); d.addScaledVector(p.clone().normalize(), -0.6).normalize(); }
      pts.push(p);
    }
    const r1 = Math.max(0.0045, r0 * 0.66);
    const kr = new THREE.CatmullRomCurve3(pts);
    dGeo.push(cev(kr, q(glob ? 8 : 12), (t) => r0 + (r1 - r0) * t, q(glob > 1 ? 5 : 8), true));
    if (glob >= 1) {
      const n = Math.round(dol * (hi ? 70 : 40));
      for (let i = 0; i < n; i++) {
        const t = 0.1 + 0.9 * rnd(), c = kr.getPointAt(t), tan = kr.getTangentAt(t);
        const st = nakljucna().cross(tan).normalize();
        trni.push({ p: c.addScaledVector(st, r0 + (r1 - r0) * t + 0.001), s: 0.6 + rnd() * 0.5 });
      }
    }
    if (glob < 3) {
      const n = glob === 0 ? 2 : (rnd() < 0.3 ? 3 : 2);
      for (let i = 0; i < n; i++) {
        const nd = d.clone().add(nakljucna(0.55)).normalize();
        veja(p, nd, dol * (0.72 + rnd() * 0.2), r1, glob + 1);
      }
    }
  }
  dSmeri.forEach((u, i) => veja(S.clone().addScaledVector(u, RS * 1.45), u, 0.15 + (i % 3) * 0.02, 0.034, 0));
  const dendMat = mat(0xd48aa8, { roughness: 0.35, clearcoat: 0.9 });
  const dendriti = new THREE.Mesh(zdruzi(dGeo), dendMat);
  const trn = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.0042, 0), dendMat, trni.length);
  trni.forEach((t, i) => { o.position.copy(t.p); o.rotation.set(0, 0, 0); o.scale.setScalar(t.s); o.updateMatrix(); trn.setMatrixAt(i, o.matrix); });
  group.add(dendriti, trn);

  // ---------- akson (v lokalnem sistemu: os x vzdolž aksona, izhodišče v središču some) ----------
  const aks = new THREE.Group();
  aks.position.copy(S);
  aks.quaternion.setFromUnitVectors(V(1, 0, 0), osA);
  group.add(aks);
  aks.updateMatrix();
  const vSkupino = (x, y, z) => V(x, y, z).applyMatrix4(aks.matrix).toArray();
  const osX = (g) => g.rotateZ(-Math.PI / 2); // vrtenina okoli y → okoli x

  // aksonski grič
  const ra = 0.028;
  const gric = [];
  for (let i = 0; i <= 20; i++) { const s = i / 20; gric.push([0.15 + s * 0.22, ra + (0.09 - ra) * Math.pow(1 - s, 2.2)]); }
  const gricMat = mat(0xe39cb2, { roughness: 0.32, clearcoat: 1 });
  const gricM = new THREE.Mesh(osX(vrtenina(gric, q(28), false).cela), gricMat);
  aks.add(gricM);

  // akson
  const X0 = 0.33, XK = 1.03;
  const aksonM = new THREE.Mesh(osX(new THREE.CylinderGeometry(ra, ra, XK - X0, q(16), 1, true)).translate((X0 + XK) / 2, 0, 0), mat(0xeaa6bb, { roughness: 0.3, clearcoat: 1 }));
  aks.add(aksonM);

  // mielinska ovojnica: odseki (vsak je ena Schwannova celica), med njimi Ranvierjevi zažemki
  const nOdsek = 4, Lm = 0.15, rez = 0.022, xm0 = 0.375, rm = 0.049, rp = ra + 0.0015;
  const profilOdseka = (x0) => {
    const p = [];
    for (let i = 0; i <= 26; i++) {
      const s = i / 26, e = Math.min(s, 1 - s) / 0.14, f = e >= 1 ? 1 : Math.sqrt(1 - (1 - e) * (1 - e));
      p.push([x0 + s * Lm, rp + (rm - rp) * f]);
    }
    return p;
  };
  const RZ = 1; // prerezani odsek
  const mielGeo = [], zazX = [];
  let rezGeo = null, rezPokrov = null, rezRob = null, rezPl = null;
  for (let k = 0; k < nOdsek; k++) {
    const x0 = xm0 + k * (Lm + rez), prof = profilOdseka(x0);
    zazX.push(x0 + Lm + rez / 2);
    if (k === RZ) {
      const v = vrtenina(prof, q(40));
      rezGeo = osX(v.odprta); rezPokrov = osX(v.pokrov);
      rezRob = osX(robVrtenine(prof, 0.0028));
      rezPl = osX(ploskviPrereza(prof, () => rp, 12));
    } else mielGeo.push(osX(vrtenina(prof, q(40), false).cela));
  }
  const mielMat = mat(0xf0e6cc, { roughness: 0.45, clearcoat: 0.6, sheen: 0.6 });
  const miel = new THREE.Mesh(zdruzi(mielGeo), mielMat);
  const mielRez = new THREE.Mesh(rezGeo, mielMat);
  const mielRob = new THREE.Mesh(rezRob, mielMat);
  const mielPokrov = new THREE.Mesh(rezPokrov, mielMat);
  mielPokrov.visible = false;
  // plasti mielina v prerezu: membrana Schwannove celice je večkrat ovita okoli aksona
  const plastiTex = tekstura(128, 4, (u) => {
    const pas = Math.abs(Math.sin(u * Math.PI * 9));
    const t = pas > 0.82 ? 0.62 : 1;
    return [240 * t, 228 * t, 200 * t];
  });
  const mielPl = new THREE.Mesh(rezPl, mat(0xffffff, { map: plastiTex, roughness: 0.6, clearcoat: 0.2, side: THREE.DoubleSide }));
  aks.add(miel, mielRez, mielRob, mielPokrov, mielPl);

  // jedra Schwannovih celic na zunanji strani odsekov
  const sjGeo = [];
  for (let k = 0; k < nOdsek; k++) {
    const a = k === RZ ? -2.2 : -2.4 + k * 1.9, x = xm0 + k * (Lm + rez) + Lm * (0.4 + 0.2 * rnd());
    const g = new THREE.SphereGeometry(1, q(18), q(10));
    g.scale(0.036, 0.008, 0.019).translate(0, rm - 0.0005, 0).rotateX(a).translate(x, 0, 0);
    sjGeo.push(g);
  }
  const schwJ = new THREE.Mesh(zdruzi(sjGeo), mat(0x8f7fe0, { roughness: 0.4 }));
  aks.add(schwJ);
  const sjT = (() => { const k = 2, a = -2.4 + k * 1.9, x = xm0 + k * (Lm + rez) + Lm * 0.5; return vSkupino(x, Math.cos(a) * (rm + 0.006), Math.sin(a) * (rm + 0.006)); })();

  // Ranvierjevi zažemki: goli deli aksona z Na⁺-kanalčki
  const zazGeo = osX(new THREE.CylinderGeometry(ra + 0.0022, ra + 0.0022, 0.013, q(18), 1, true));
  const zaz = new THREE.InstancedMesh(zazGeo, mat(0x3fbfae, { roughness: 0.35, clearcoat: 0.8 }), nOdsek);
  zazX.forEach((x, i) => { o.position.set(x, 0, 0); o.rotation.set(0, 0, 0); o.scale.setScalar(1); o.updateMatrix(); zaz.setMatrixAt(i, o.matrix); });
  aks.add(zaz);

  // ---------- končne razvejitve s sinaptičnimi končiči ----------
  const E = V(XK, 0, 0);
  const kGeo = [], koncici = [];
  const aksInv = aks.matrix.clone().invert();
  const vLok = (v) => v.clone().applyMatrix4(aks.matrix);
  function konc(p0, dir, dol, r0, glob) {
    const pts = [p0.clone()];
    let p = p0.clone();
    const d = dir.clone();
    for (let i = 0; i < 3; i++) {
      d.add(nakljucna(0.16)).normalize();
      p = p.clone().addScaledVector(d, dol / 3);
      const g = vLok(p);
      if (g.length() > 0.93) p = g.multiplyScalar(0.93 / g.length()).applyMatrix4(aksInv);
      pts.push(p);
    }
    const r1 = Math.max(0.0055, r0 * 0.72);
    kGeo.push(cev(new THREE.CatmullRomCurve3(pts), q(10), (t) => r0 + (r1 - r0) * t, q(7), true));
    if (glob < 3) {
      const n = glob === 0 ? 3 : 2;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + glob * 0.9 + rnd() * 0.6;
        konc(p, d.clone().add(V(0, Math.cos(a), Math.sin(a)).multiplyScalar(glob === 0 ? 1.0 : 0.75)).normalize(), dol * 0.85, r1, glob + 1);
      }
    } else koncici.push({ p, d: d.clone() });
  }
  konc(E.clone().add(V(-0.004, 0, 0)), V(1, 0, 0), 0.06, ra, 0);
  const koncMat = mat(0xe6a0b6, { roughness: 0.32, clearcoat: 1 });
  const koncM = new THREE.Mesh(zdruzi(kGeo), koncMat);
  aks.add(koncM);
  const bulbGeo = [];
  for (const k of koncici) {
    const g = new THREE.SphereGeometry(1, q(18), q(12));
    g.scale(0.024, 0.019, 0.019);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(V(1, 0, 0), k.d));
    g.translate(k.p.x + k.d.x * 0.018, k.p.y + k.d.y * 0.018, k.p.z + k.d.z * 0.018);
    bulbGeo.push(g);
  }
  const bulbi = new THREE.Mesh(zdruzi(bulbGeo), mat(0xf2b45c, { roughness: 0.35, clearcoat: 0.9 }));
  aks.add(bulbi);

  // ---------- akcijski potencial: svetel utrip, ki preskakuje od zažemka do zažemka ----------
  const tockeAP = [V(X0, 0, 0), ...zazX.map((x) => V(x, 0, 0))];
  const nAP = tockeAP.length + koncici.length;
  const ap = new THREE.InstancedMesh(new THREE.SphereGeometry(1, q(16), q(12)),
    new THREE.MeshBasicMaterial({ color: 0x47d4ff, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }), nAP);
  odpad.push(ap.material);
  ap.visible = false;
  aks.add(ap);
  const KORAK_AP = 0.24;
  function postaviAP(tau, mirno) {
    for (let i = 0; i < nAP; i++) {
      const kk = i - tockeAP.length;
      const p = kk < 0 ? tockeAP[i] : koncici[kk].p.clone().addScaledVector(koncici[kk].d, 0.018);
      const ti = kk < 0 ? i * KORAK_AP : tockeAP.length * KORAK_AP + 0.1;
      const f = mirno ? 0.7 : Math.exp(-Math.pow((tau - ti) / 0.075, 2));
      o.position.copy(p); o.rotation.set(0, 0, 0); o.scale.setScalar(Math.max(1e-4, (kk < 0 ? 0.034 : 0.03) * f)); o.updateMatrix();
      ap.setMatrixAt(i, o.matrix);
    }
    ap.instanceMatrix.needsUpdate = true;
  }
  let apZacetek = null, apMirno = false;
  postaviAP(-10, false);

  // ---------- deli ----------
  del("celicno-telo", "Celično telo (soma)", "Najdebelejši del nevrona z jedrom; zbira signale iz dendritov in jih pošlje naprej v akson.", "#d88aa2", [somaOut, somaRob, somaPokrov], naS(0.35, -0.2, 0.92));
  del("citoplazma", "Citoplazma", "Tekočina v celičnem telesu, v kateri so jedro, Nisslova telesca in mitohondriji.", "#f1c9b6", [somaIn], naS(-0.2, 0.25, -0.95, 0.95));
  del("jedro", "Jedro", "Veliko okroglo jedro z DNK, ki usmerja delovanje nevrona; nevroni se praviloma ne delijo več.", "#7a68d8", [jOut, jRob, jPokrov], J.clone().add(V(0.035, 0.04, 0.035)).toArray());
  del("nukleoplazma", "Nukleoplazma", "Tekočina v notranjosti jedra, v kateri sta kromatin in jedrce.", "#b9a8ff", [jIn], J.clone().add(V(-0.02, 0.01, -0.03)).toArray());
  del("jedrce", "Jedrce", "Izrazito temno telesce v jedru; v njem nastajajo deli ribosomov, ki jih nevron potrebuje veliko.", "#34268a", [jedrce], jedrce.position.toArray());
  del("nisslova-telesca", "Nisslova telesca", "Kupčki zrnatega endoplazemskega retikuluma z ribosomi; izdelujejo beljakovine za ves nevron. V aksonskem griču jih ni.", "#4f74d6", [nissl], (nisslT[0] || S).toArray());
  del("mitohondriji", "Mitohondriji", "Pridobivajo energijo (ATP), ki jo nevron porablja predvsem za črpanje ionov skozi membrano.", "#e8743b", [mito], (mitT[0] || S).toArray());
  del("dendriti", "Dendriti", "Kratki, močno razvejani izrastki, ki sprejemajo signale drugih nevronov; drobni trni na njih povečajo površino za sinapse.", "#d48aa8", [dendriti, trn], S.clone().addScaledVector(dSmeri[3], RS * 1.7).toArray());
  del("aksonski-gric", "Aksonski grič", "Stožčast prehod iz celičnega telesa v akson; tu se sproži živčni impulz, ko je vzburjenje dovolj močno.", "#e39cb2", [gricM], vSkupino(0.28, 0.026, 0.026));
  del("akson", "Akson (nevrit)", "Dolg izrastek, ki prevaja živčni impulz stran od celičnega telesa do naslednje celice; v resnici je lahko dolg do 1 m.", "#eaa6bb", [aksonM], vSkupino(xm0 + RZ * (Lm + rez) + Lm * 0.5, 0.006, 0.012));
  del("mielinska-ovojnica", "Mielinska ovojnica", "Maščobna ovojnica iz Schwannovih celic, ki se večkrat ovijejo okoli aksona; akson električno izolira, zato impulz potuje hitreje.", "#f0e6cc", [miel, mielRez, mielRob, mielPokrov, mielPl], vSkupino(xm0 + 3 * (Lm + rez) + Lm * 0.4, 0.02, rm * 0.9));
  del("schwannova-celica", "Jedro Schwannove celice", "Vsak odsek mielinske ovojnice je ena Schwannova celica; njeno jedro je potisnjeno na zunanjo stran ovojnice.", "#8f7fe0", [schwJ], sjT);
  del("ranvierjev-zazemek", "Ranvierjev zažemek", "Kratek gol del aksona med dvema odsekoma mielina; impulz skače od zažemka do zažemka (skokovito prevajanje).", "#3fbfae", [zaz], vSkupino(zazX[2], 0.004, ra + 0.004));
  del("koncne-razvejitve", "Končne razvejitve aksona", "Na koncu se akson razveji v tanke veje, tako da lahko en nevron vzburi več celic hkrati.", "#e6a0b6", [koncM], vSkupino(XK + 0.05, 0.01, 0.01));
  const kT = koncici.reduce((a, k) => (vLok(k.p).z > vLok(a.p).z ? k : a), koncici[0]);
  del("sinapticni-koncici", "Sinaptični končiči", "Odebeljeni konci aksona; v njih so mehurčki z živčnim prenašalcem, ki ga izločijo v sinapso k naslednji celici.", "#f2b45c", [bulbi], vSkupino(kT.p.x + kT.d.x * 0.03, kT.p.y + kT.d.y * 0.03, kT.p.z + kT.d.z * 0.03));

  // ---------- nadzor ----------
  const nadzor = [
    {
      tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cela", "Cel nevron"]], vrednost: "prerez",
      ob: (v) => {
        const cela = v === "cela";
        somaPokrov.visible = cela; jPokrov.visible = cela; somaRob.visible = !cela;
        mielPokrov.visible = cela; mielRob.visible = !cela; mielPl.visible = !cela;
      },
    },
    {
      tip: "gumb", id: "signal", oznaka: "Pošlji signal",
      ob: () => {
        if (gib) { apZacetek = -1; ap.visible = true; postaviAP(-1, false); return; }
        apMirno = !apMirno; ap.visible = apMirno; postaviAP(0, true);
      },
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

  return {
    group,
    deli,
    nadzor,
    korak(t) {
      if (!gib || apZacetek === null) return;
      if (apZacetek < 0) apZacetek = t;
      const tau = t - apZacetek;
      if (tau > tockeAP.length * KORAK_AP + 0.45) { apZacetek = null; ap.visible = false; return; }
      postaviAP(tau, false);
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
