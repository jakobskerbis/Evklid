// Nevron (živčna celica): celično telo v prerezu, dendriti, aksonski grič, akson z mielinsko ovojnico in končiči.
// Pogodba graditelja: docs/3d.md. Brez uvozov; THREE pride od kompleta.

export const info = {
  id: "celica-nevron",
  naslov: "Nevron (živčna celica)",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Gibalni nevron z dendriti, celičnim telesom v prerezu in aksonom z mielinsko ovojnico. Akson je močno skrajšan: v resnici je lahko dolg do 1 m, odsek med dvema Ranvierjevima zažemkoma pa meri okoli 1 mm.",
  poskusi: "Pritisni »Pošlji signal« in opazuj, kako signal skače med Ranvierjevimi zažemki.",
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
  // ---------- mokri sijaj (kot tkiva.js): relief iz 3D šuma v senčilniku, lise, mehka presevnost ob robu ----------
  // Višina iz šuma v lokalnih koordinatah mreže (vsak primerek InstancedMesh ima svoj zamik), naklon normale iz odvodov
  // po zaslonu; prevleka (clearcoat) ostane gladka kot tanek moker film. Brez tekstur in brez dodatnih trikotnikov.
  // Kit izbrani del poudari s kopijo materiala, zato kopija (clone) obdrži kljuko in ključ programa.
  const GLSL_SUM = `float evkHash(vec3 p){ p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3)); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float evkSum(vec3 x){ vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(evkHash(i), evkHash(i + vec3(1, 0, 0)), f.x), mix(evkHash(i + vec3(0, 1, 0)), evkHash(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(evkHash(i + vec3(0, 0, 1)), evkHash(i + vec3(1, 0, 1)), f.x), mix(evkHash(i + vec3(0, 1, 1)), evkHash(i + vec3(1, 1, 1)), f.x), f.y), f.z); }`;
  const fl = (x) => (Math.round(x * 1000) / 1000).toFixed(3);
  // vlazno(m, { f: gostota zrn na enoto mreže, r: moč reliefa, gube: vijugaste gubice namesto zrn, b: lise v barvi,
  //   s: mehka presevnost ob robu, rough / cc / ccr: hrapavost, moč in hrapavost prevleke (moker film), sheen: barvni sijaj })
  function vlazno(m, { f = 30, r = 0.5, gube = false, b = 0.1, s = 0.1, rough, cc, ccr = 0.14, sheen } = {}) {
    if (!m || !m.isMeshPhysicalMaterial) return m;
    if (rough != null) m.roughness = rough;
    if (cc != null) m.clearcoat = cc;
    if (sheen != null) m.sheen = sheen;
    m.clearcoatRoughness = ccr;
    const F = fl(f), H = (0.1 * r * (hi ? 1 : 0.7) / f).toExponential(3);
    const kljuc = `evk3-${F}-${H}-${gube ? 1 : 0}-${fl(b)}-${fl(s)}-${hi ? 2 : 1}`;
    m.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vEvk;")
        .replace("#include <project_vertex>", `#include <project_vertex>
        vEvk = transformed;
        #ifdef USE_INSTANCING
          vEvk += instanceMatrix[3].xyz * 7.31;
        #endif`);
      sh.fragmentShader = sh.fragmentShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vEvk;\n" + GLSL_SUM)
        .replace("#include <color_fragment>", `#include <color_fragment>
        vec3 evkQ = vEvk * ${F};
        float evkLod = clamp(1.6 - length(fwidth(evkQ)) * 1.1, 0.0, 1.0);
        float evkA = evkSum(evkQ);${gube ? "\n        evkA = 1.0 - abs(2.0 * evkA - 1.0);" : ""}
        float evkZ = mix(0.5, ${hi ? "evkA * 0.66 + evkSum(evkQ * 2.37 + 3.1) * 0.34" : "evkA"}, evkLod);
        diffuseColor.rgb *= ${fl(1 - b * 0.6)} + ${fl(b)} * evkZ;`)
        .replace("#include <roughnessmap_fragment>", `#include <roughnessmap_fragment>
        roughnessFactor = clamp(roughnessFactor + (0.5 - evkZ) * 0.16, 0.05, 1.0);`)
        .replace("#include <normal_fragment_maps>", `#include <normal_fragment_maps>
        {
          float evkH = evkZ * ${H};
          vec3 evkDx = dFdx(-vViewPosition), evkDy = dFdy(-vViewPosition);
          vec3 evkR1 = cross(evkDy, normal), evkR2 = cross(normal, evkDx);
          float evkDet = dot(evkDx, evkR1) * faceDirection;
          vec3 evkG = sign(evkDet) * (dFdx(evkH) * evkR1 + dFdy(evkH) * evkR2);
          normal = normalize(abs(evkDet) * normal - evkG);
        }`)
        .replace("#include <opaque_fragment>", `float evkFr = 1.0 - abs(dot(normal, normalize(vViewPosition)));
        outgoingLight += diffuseColor.rgb * ${fl(s)} * pow(evkFr, 1.6) * (0.6 + 0.4 * evkZ);
        #include <opaque_fragment>`);
    };
    m.customProgramCacheKey = () => kljuc;
    m.clone = function () {
      const c = THREE.MeshPhysicalMaterial.prototype.clone.call(this);
      c.onBeforeCompile = this.onBeforeCompile; c.customProgramCacheKey = this.customProgramCacheKey; c.clone = this.clone;
      return c;
    };
    m.needsUpdate = true;
    return m;
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
  const MS = 0.93; // debelina membrane v prerezu (povečana): ≈ 7 % polmera some
  const somaInL = lupina((d) => oblS(d) * MS, q(84), q(52));
  somaInL.pokrov.dispose();
  const somaIn = new THREE.Mesh(somaInL.odprta, citMat);
  // polna ploskev prereza: temnejši glavi, svetlejši repi; ob zunanjem robu ostra svetla obroba
  const somaRobMat = mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide });
  const somaRob = new THREE.Mesh(prerezPlasti(oblS, (d) => oblS(d) * MS, q(64), [[0, 0.1, 0xe0a0b8], [0.1, 0.34, 0x9a4067], [0.34, 0.66, 0xd7a99a], [0.66, 0.9, 0x9a4067], [0.9, 1, 0x7a3a5c]]), somaRobMat);
  const somaObr = new THREE.Mesh(barvaj(rob(oblS, 0.0026, q(80)), 0xe9a7bf), somaRobMat);
  const somaPokrov = new THREE.Mesh(soma.pokrov, somaMat);
  somaPokrov.visible = false;
  for (const m of [somaOut, somaIn, somaRob, somaObr, somaPokrov]) { m.position.copy(S); group.add(m); }
  const naS = (x, y, z, f = 1) => { const d = V(x, y, z).normalize(); return d.multiplyScalar(oblS(d) * f).add(S).toArray(); };

  // jedro z jedrcem (tudi prerezano)
  const RJ = 0.074, J = S.clone().add(V(0.01, -0.005, -0.015));
  const oblJ = (d) => RJ * (1 + 0.03 * sum(d.x * 2 + 5, d.y * 2, d.z * 2));
  const jl = lupina(oblJ, q(64), q(40));
  const jMat = mat(0x7a68d8, { roughness: 0.34 });
  const jOut = new THREE.Mesh(jl.odprta, jMat);
  const nukMat = mat(0xb9a8ff, { roughness: 0.6, clearcoat: 0.3, side: THREE.BackSide });
  const jIn = new THREE.Mesh(jl.odprta.clone().scale(0.9, 0.9, 0.9), nukMat);
  // jedrna ovojnica: dve membrani (vsaka dvosloj) z ozkim presledkom med njima
  const jRobMat = mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, side: THREE.DoubleSide });
  const jRob = new THREE.Mesh(prerezPlasti(oblJ, (d) => oblJ(d) * 0.9, q(32), [[0, 0.14, 0x4a389e], [0.14, 0.3, 0xa697e6], [0.3, 0.42, 0x4a389e], [0.42, 0.58, 0x7e6cc8], [0.58, 0.7, 0x4a389e], [0.7, 0.86, 0xa697e6], [0.86, 1, 0x3c2d88]]), jRobMat);
  const jObr = new THREE.Mesh(barvaj(rob(oblJ, 0.0016, q(48)), 0x9a88ee), jRobMat);
  const jPokrov = new THREE.Mesh(jl.pokrov, jMat);
  jPokrov.visible = false;
  for (const m of [jOut, jIn, jRob, jObr, jPokrov]) { m.position.copy(J); group.add(m); }
  const jcGeo = new THREE.IcosahedronGeometry(0.024, hi ? 4 : 2);
  {
    const p = jcGeo.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); v.multiplyScalar(1 + 0.1 * fbm(v.x * 90, v.y * 90, v.z * 90)); p.setXYZ(i, v.x, v.y, v.z); }
    jcGeo.computeVertexNormals();
  }
  const jedrce = new THREE.Mesh(jcGeo, mat(0x34268a, { roughness: 0.6, clearcoat: 0.3 }));
  jedrce.position.copy(J).add(V(-0.02, 0.02, 0.02));
  group.add(jedrce);

  // Nisslova telesca: skladi upognjenih cistern zrnatega ER (ni jih v aksonskem griču)
  const nisslGeo = zdruzi([-1.5, -0.5, 0.5, 1.5].map((s, k) => {
    const g = new THREE.SphereGeometry(1, q(10), q(5));
    deformiraj(g, (v) => {
      v.set(v.x * (0.018 - Math.abs(s) * 0.0015), v.y * 0.0026, v.z * (0.011 - Math.abs(s) * 0.001));
      v.y += s * 0.0058 + 2.4 * (v.x * v.x) * (1 - 0.2 * k) + 0.0012 * sum(v.x * 260 + k, v.z * 260, k);
    });
    return g;
  }));
  // organeli ne zakrivajo jedra v privzetem pogledu (pred jedrom, gledano od kamere, jih ni)
  const predJedrom = (p) => { const d = p.clone().sub(J), t = d.dot(kam); return t > 0 && d.addScaledVector(kam, -t).length() < RJ + 0.012; };
  // točka p v somi je vidna skozi prerez, če pot proti kameri zapusti somo skozi odrezani del
  const vidnaS = (p) => { const x = p.clone().sub(S); for (let i = 0; i < 60; i++) { x.addScaledVector(kam, 0.006); if (x.length() > oblS(x.clone().normalize()) * MS) return vIzrezu(x); } return false; };
  const nNissl = hi ? 118 : 56;
  const nissl = new THREE.InstancedMesh(nisslGeo, mat(0x4f74d6, { roughness: 0.5 }), nNissl);
  const nisslT = [], globina = (p) => 0.72 + 0.32 * Math.max(0, Math.min(1, 0.5 + p.clone().sub(S).dot(kam) / (RS * 1.6)));
  for (let k = 0, t = 0; k < nNissl && t < 20000; t++) {
    smer.copy(nakljucna()).normalize();
    if (smer.dot(osA) > 0.7) continue;
    const r = RJ + 0.02 + rnd() * (oblS(smer) * 0.88 - RJ - 0.025);
    o.position.copy(smer).multiplyScalar(r).add(S);
    if (o.position.distanceTo(J) < RJ + 0.03) continue;
    if (predJedrom(o.position)) continue;
    o.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); o.scale.setScalar(0.7 + rnd() * 0.6); o.updateMatrix();
    nissl.setMatrixAt(k, o.matrix);
    const g = globina(o.position) * (0.9 + 0.2 * rnd()); nissl.setColorAt(k++, new THREE.Color(g, g, g));
    if (vIzrezu(smer)) nisslT.push(o.position.clone());
  }
  group.add(nissl);

  // mitohondriji v somi: upognjeni, različno dolgi
  const nMit = hi ? 34 : 18;
  const mitG = deformiraj(new THREE.CapsuleGeometry(0.0062, 0.022, q(4), q(10)), (v) => { v.x += 0.0035 * Math.sin(v.y * 90) + 9 * v.y * v.y * 0.04; v.multiplyScalar(1 + 0.04 * sum(v.x * 400, v.y * 400, v.z * 400)); });
  const mito = new THREE.InstancedMesh(mitG, mat(0xe8743b, { roughness: 0.38 }), nMit);
  const mitT = [];
  for (let k = 0, t = 0; k < nMit && t < 20000; t++) {
    smer.copy(nakljucna()).normalize();
    const r = RJ + 0.025 + rnd() * (oblS(smer) * 0.85 - RJ - 0.03);
    o.position.copy(smer).multiplyScalar(r).add(S);
    if (o.position.distanceTo(J) < RJ + 0.018) continue;
    if (predJedrom(o.position)) continue;
    o.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); o.scale.set(0.85 + rnd() * 0.3, 0.7 + rnd() * 0.6, 0.85 + rnd() * 0.3); o.updateMatrix();
    mito.setMatrixAt(k, o.matrix);
    const g = globina(o.position) * (0.9 + 0.2 * rnd()); mito.setColorAt(k++, new THREE.Color(g, g, g));
    if (vidnaS(o.position)) mitT.push(o.position.clone());
  }
  group.add(mito);

  // prosti ribosomi v citoplazmi in zrnca kromatina v jedru (točke, brez trikotnikov; zunaj odrezanega dela)
  group.add(zrnca(hi ? 3200 : 1300, () => {
    const d = nakljucna().normalize(), p = d.clone().multiplyScalar(oblS(d) * MS * Math.cbrt(rnd()) * 0.97);
    if (vIzrezu(p) || p.length() < RJ * 1.08) return null;
    return p.add(S);
  }, 0x3a5cc0, 0.0055));
  group.add(zrnca(hi ? 900 : 400, () => {
    const d = nakljucna().normalize(), p = d.clone().multiplyScalar(oblJ(d) * 0.88 * Math.cbrt(rnd()));
    if (vIzrezu(p)) return null;
    return p.add(J);
  }, 0x5b48b8, 0.005));

  seme = hi ? 1000464049 : 1723809692; // stanje naključnega niza kot v prejšnji različici: dendriti ostanejo enako razvejani
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
  // začetki dendritov, ki segajo v notranjost some, odrežemo (sicer bi skozi prerez videli njihove konce)
  const dendriti = new THREE.Mesh(odrezi(zdruzi(dGeo), (p) => { const d = p.clone().sub(S); return d.length() < oblS(d.normalize()) * MS; }), dendMat);
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
  del("celicno-telo", "Celično telo (soma)", "Najdebelejši del nevrona z jedrom, obdan s celično membrano (v prerezu dvosloj, debelina povečana); zbira signale iz dendritov in jih pošlje naprej v akson.", "#d88aa2", [somaOut, somaRob, somaObr, somaPokrov], naS(0.35, -0.2, 0.92));
  del("citoplazma", "Citoplazma", "Tekočina v celičnem telesu, v kateri so jedro, Nisslova telesca in mitohondriji.", "#f1c9b6", [somaIn], naS(-0.2, 0.25, -0.95, 0.95));
  del("jedro", "Jedro", "Veliko okroglo jedro z DNK, ki usmerja delovanje nevrona; nevroni se praviloma ne delijo več.", "#7a68d8", [jOut, jRob, jObr, jPokrov], J.clone().add(V(0.035, 0.04, 0.035)).toArray());
  del("nukleoplazma", "Nukleoplazma", "Tekočina v notranjosti jedra, v kateri sta kromatin in jedrce.", "#b9a8ff", [jIn], J.clone().add(V(-0.02, 0.01, -0.03)).toArray());
  del("jedrce", "Jedrce", "Izrazito temno telesce v jedru; v njem nastajajo deli ribosomov, ki jih nevron potrebuje veliko.", "#34268a", [jedrce], jedrce.position.toArray());
  del("nisslova-telesca", "Nisslova telesca", "Kupčki zrnatega endoplazemskega retikuluma z ribosomi; izdelujejo beljakovine za ves nevron. V aksonskem griču jih ni.", "#4f74d6", [nissl], (nisslT.filter((p) => p.dot(kam) > S.dot(kam) + 0.04).sort((a, b) => b.y - a.y)[0] || nisslT[0] || S).toArray());
  del("mitohondriji", "Mitohondriji", "Pridobivajo energijo (ATP), ki jo nevron porablja predvsem za črpanje ionov skozi membrano.", "#e8743b", [mito], (mitT.filter((p) => p.dot(kam) > S.dot(kam) + 0.02).sort((a, b) => a.x + a.y - b.x - b.y)[0] || mitT[0] || S).toArray());
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
        somaPokrov.visible = cela; jPokrov.visible = cela; somaRob.visible = somaObr.visible = !cela;
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

  // Ploskev prereza plasti med zunanjo fZ in notranjo fN ploskvijo na treh ravninah izreza (x = 0, y = 0, z = 0).
  // pasovi [[t0, t1, barva], …] od zunaj (t = 0) navznoter (t = 1) pokažejo zgradbo plasti, npr. lipidni dvosloj.
  function prerezPlasti(fZ, fN, seg, pasovi) {
    const loki = [
      (t) => new THREE.Vector3(0, Math.cos(t * Math.PI / 2), Math.sin(t * Math.PI / 2)),
      (t) => new THREE.Vector3(-Math.sin(t * Math.PI / 2), Math.cos(t * Math.PI / 2), 0),
      (t) => new THREE.Vector3(-Math.cos(t * Math.PI / 2), 0, Math.sin(t * Math.PI / 2)),
    ];
    const pos = [], col = [], idx = [], c = new THREE.Color();
    for (const L of loki) for (const [t0, t1, barva] of pasovi) {
      c.set(barva);
      const off = pos.length / 3;
      for (let i = 0; i <= seg; i++) {
        const d = L(i / seg).normalize(), rz = fZ(d), rn = fN(d);
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
  // Premakne oglišča: fn(v) spremeni vektor v; nato nove normale.
  function deformiraj(g, fn) {
    const p = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); fn(v); p.setXYZ(i, v.x, v.y, v.z); }
    g.computeVertexNormals();
    return g;
  }
  // Enobarvne barve oglišč (za mreže, ki si delijo material z barvami oglišč).
  function barvaj(g, barva) {
    const c = new THREE.Color(barva), a = new Float32Array(g.attributes.position.count * 3);
    for (let i = 0; i < a.length; i += 3) { a[i] = c.r; a[i + 1] = c.g; a[i + 2] = c.b; }
    g.setAttribute("color", new THREE.BufferAttribute(a, 3));
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

  for (const d of deli) if (d.id === "jedro") d.tocka = [-0.494, 0.065, 0.037]; // vidno skozi prerez v privzetem pogledu

  poliraj({
    "celicno-telo": { tex: "zrna", rep: [20, 10], k: 0.3, lisa: 0.12, f: 6, sheen: 0.7, temni: 0.94 },
    citoplazma: { tex: "fino", rep: [8, 4], k: 0.25, lisa: 0.2, f: 10 },
    jedro: { tex: "zrna", rep: [10, 5], k: 0.35, lisa: 0.1, f: 14 },
    nukleoplazma: { tex: "fino", rep: [6, 3], k: 0.25, lisa: 0.15, f: 14 },
    jedrce: { tex: "gube", rep: [3, 2], k: 0.45 },
    dendriti: { tex: "zrna", rep: [4, 12], k: 0.3, lisa: 0.1, f: 8, temni: 0.94 },
    akson: { tex: "zrna", rep: [4, 12], k: 0.25, temni: 0.94 },
    "mielinska-ovojnica": { tex: "vlakna", rep: [3, 3], k: 0.25, lisa: 0.06, f: 8 },
    mitohondriji: { tex: "fino", rep: [3, 2], k: 0.25 },
  });
  // mokri sijaj in relief iz šuma: močnejši na membranah, rahel na organelih
  const ml = { f: 120, r: 1.1, b: 0.16, s: 0.16, rough: 0.42, cc: 0.7, ccr: 0.12 };
  for (const m of [somaMat, dendMat, gricMat, koncMat, aksonM.material]) vlazno(m, ml);
  vlazno(citMat, { f: 90, r: 0.8, b: 0.22, s: 0.05, rough: 0.62, cc: 0.2 });
  vlazno(somaRobMat, { f: 300, r: 0.4, b: 0.1, s: 0.04, rough: 0.5, cc: 0.3 });
  vlazno(jRobMat, { f: 300, r: 0.4, b: 0.1, s: 0.04, rough: 0.5, cc: 0.3 });
  vlazno(jMat, { f: 160, r: 0.9, b: 0.14, s: 0.14, rough: 0.42, cc: 0.6 });
  vlazno(nukMat, { f: 140, r: 0.6, b: 0.2, s: 0.05, rough: 0.6, cc: 0.2 });
  vlazno(jedrce.material, { f: 260, r: 0.8, gube: true, b: 0.2, s: 0.1, rough: 0.5, cc: 0.35 });
  vlazno(nissl.material, { f: 420, r: 0.5, b: 0.16, s: 0.12, rough: 0.46, cc: 0.5 });
  vlazno(mito.material, { f: 380, r: 0.5, gube: true, b: 0.16, s: 0.14, rough: 0.42, cc: 0.55 });
  vlazno(mielMat, { f: 90, r: 0.7, gube: true, b: 0.12, s: 0.18, rough: 0.4, cc: 0.65, ccr: 0.12 });
  vlazno(mielPl.material, { f: 200, r: 0.3, b: 0.06, s: 0.04, rough: 0.55, cc: 0.25 });
  vlazno(schwJ.material, { f: 220, r: 0.6, b: 0.14, s: 0.12, rough: 0.44, cc: 0.5 });
  vlazno(zaz.material, { f: 220, r: 0.5, b: 0.12, s: 0.14, rough: 0.4, cc: 0.6 });
  vlazno(bulbi.material, { f: 180, r: 0.7, b: 0.14, s: 0.16, rough: 0.4, cc: 0.65 });

  return {
    group,
    deli,
    nadzor,
    pogled: [-0.2, 0.31, 0.93],
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
