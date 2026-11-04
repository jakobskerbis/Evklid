// Rdeča krvnička: dvojno vbočena ploščica, oblika iz enačbe Evansa in Funga (1972).
// Pogodba graditelja: docs/3d.md. Brez uvozov; THREE pride od kompleta. Model je zgrajen v µm in nato umerjen v enotsko kroglo.

export const info = {
  id: "celica-eritrocit",
  naslov: "Rdeča krvnička (eritrocit)",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Dvojno vbočena ploščica s premerom 7,8 µm; oblika je izračunana iz enačbe Evansa in Funga. Zrela rdeča krvnička nima jedra in mitohondrijev, zato je v njej več prostora za hemoglobin, ki veže kisik. Molekule hemoglobina in sladkorne verige so močno povečane.",
  merilo: { m: 9e-6, oznaka: "9 µm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const gib = ctx.gibanje !== false;
  const group = new THREE.Group();
  const deli = [];
  const odpad = [];

  // ---------- orodja ----------
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
  const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
  // Proceduralna normalna mapa (DataTexture iz periodičnega šuma, brez platna): "zrnje" drobne izbokline, "gube" gubice, "vlakna" proge.
  const _nm = {}, odpadT = [];
  function normalnaMapa(vrsta) {
    if (_nm[vrsta]) return _nm[vrsta];
    const N = 128, P = vrsta === "gube" ? 5 : vrsta === "vlakna" ? 4 : 12, h = new Float32Array(N * N), sl = vrsta.length * 13.1;
    const hp = (i, j, s) => hash(((i % s) + s) % s, ((j % s) + s) % s, s * 7.3 + sl);
    const vn = (x, y, s) => {
      const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
      const a = hp(xi, yi, s), b = hp(xi + 1, yi, s), c = hp(xi, yi + 1, s), d = hp(xi + 1, yi + 1, s);
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    };
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      let s = 0, a = 1, f = P;
      for (let o = 0; o < 4; o++) {
        let n = vrsta === "vlakna" ? vn(i / N * f * 6, j / N * f, f * 6) * 0.7 + vn(i / N * f, j / N * f, f) * 0.3 : vn(i / N * f, j / N * f, f);
        if (vrsta === "gube") n = 1 - Math.abs(2 * n - 1);
        s += n * a; a *= 0.5; f *= 2;
      }
      h[j * N + i] = s;
    }
    const d = new Uint8Array(N * N * 4), k = vrsta === "gube" ? 2.4 : 3.4;
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const dx = h[j * N + (i + 1) % N] - h[j * N + (i + N - 1) % N], dy = h[((j + 1) % N) * N + i] - h[((j + N - 1) % N) * N + i];
      let x = -dx * k, y = -dy * k, z = 1; const l = Math.hypot(x, y, z);
      const o = (j * N + i) * 4; d[o] = (x / l * 0.5 + 0.5) * 255; d[o + 1] = (y / l * 0.5 + 0.5) * 255; d[o + 2] = (z / l * 0.5 + 0.5) * 255; d[o + 3] = 255;
    }
    const t = new THREE.DataTexture(d, N, N, THREE.RGBAFormat);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.needsUpdate = true;
    odpadT.push(t);
    return (_nm[vrsta] = t);
  }
  // mat(barva, { …, zrnje: [vrsta, ponovitev u, ponovitev v, jakost] }): mokra, rahlo prosojna organska površina.
  function mat(barva, o = {}) {
    const { zrnje, ...ost } = o;
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: barva, roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.22,
      sheen: 0.35, sheenColor: new THREE.Color(barva).lerp(new THREE.Color(0xffffff), 0.45).multiplyScalar(0.8), sheenRoughness: 0.45,
    }, ost));
    if (zrnje) {
      const [vrsta = "zrnje", ru = 4, rv = 2, j = 0.3] = zrnje, t = normalnaMapa(vrsta).clone();
      t.repeat.set(ru, rv); t.needsUpdate = true; odpadT.push(t);
      m.normalMap = t; m.normalScale = new THREE.Vector2(j, j);
    }
    odpad.push(m);
    return m;
  }
  // ---------- debele membrane (debelina je povečana, da je vidna) ----------
  // Plasti na prerezu od notranje (s = 0) do zunanje strani (s = 1): [s0, s1, barva].
  const _bela = new THREE.Color(0xffffff);
  // dvosloj fosfolipidov: temni glavi ob obeh straneh, svetlejši rep v sredini
  const DVOSLOJ = (b) => { const c = new THREE.Color(b); return [[0, 0.2, c.clone().multiplyScalar(0.58)], [0.34, 0.66, c.clone().lerp(_bela, 0.42)], [0.8, 1, c.clone().multiplyScalar(0.58)]]; };
  // dvojna ovojnica (jedro, mitohondrij): dva dvosloja z ozkim presledkom med njima
  const DVOJNA = (b, vmes) => { const c = new THREE.Color(b), g = c.clone().multiplyScalar(0.55), r = c.clone().lerp(_bela, 0.35), v = new THREE.Color(vmes); return [[0, 0.07, g], [0.12, 0.24, r], [0.29, 0.31, g], [0.38, 0.62, v], [0.69, 0.71, g], [0.76, 0.88, r], [0.93, 1, g]]; };
  // celična stena: celulozna vlakna (rahle proge), na zunanji strani temnejša srednja lamela
  const STENA = (b) => { const c = new THREE.Color(b); return [[0, 0.1, c.clone().lerp(_bela, 0.18)], [0.2, 0.42, c.clone()], [0.5, 0.58, c.clone().multiplyScalar(0.9)], [0.66, 0.86, c.clone().lerp(_bela, 0.1)], [0.93, 1, c.clone().multiplyScalar(0.62)]]; };
  function barvaPlasti(plasti, s, out) {
    for (let i = 0; i < plasti.length; i++) {
      const [a, b, c] = plasti[i];
      if (s <= b + 1e-6) return s >= a - 1e-6 || i === 0 ? out.copy(c) : out.copy(plasti[i - 1][2]).lerp(c, (s - plasti[i - 1][1]) / (a - plasti[i - 1][1]));
    }
    return out.copy(plasti[plasti.length - 1][2]);
  }
  const vrsticePlasti = (plasti) => [...new Set(plasti.flatMap(([a, b]) => [a, b]).concat([0, 1]).map((x) => Math.round(x * 1000) / 1000))].sort((a, b) => a - b);
  // Trak prereza med dvema krivuljama: A[i] (notranja) in B[i] (zunanja), normala n; pora(t) → barva pore ali null.
  function trakPlasti(A, B, n, plasti, pora) {
    const S = vrsticePlasti(plasti), C = A.length, pos = [], nor = [], col = [], idx = [], c = new THREE.Color(), p = new THREE.Vector3();
    for (let j = 0; j < S.length; j++) for (let i = 0; i < C; i++) {
      p.copy(A[i]).lerp(B[i], S[j]); pos.push(p.x, p.y, p.z); nor.push(n.x, n.y, n.z);
      const pc = pora && pora(i / (C - 1));
      if (pc && S[j] > 0.01 && S[j] < 0.99) c.copy(pc); else barvaPlasti(plasti, S[j], c);
      col.push(c.r, c.g, c.b);
    }
    // zavoj trikotnikov naj se ujema z normalo
    const m = Math.floor(C / 2), e1 = new THREE.Vector3().subVectors(A[Math.min(C - 1, m + 1)], A[Math.max(0, m - 1)]), e2 = new THREE.Vector3().subVectors(B[m], A[m]);
    const obrni = e1.cross(e2).dot(n) < 0;
    for (let j = 0; j < S.length - 1; j++) for (let i = 0; i < C - 1; i++) {
      const a = j * C + i, b = a + 1, d = a + C, e = d + 1;
      if (obrni) idx.push(a, d, b, b, d, e); else idx.push(a, b, d, b, e, d);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    return g;
  }
  // Prerez debele lupine na treh ravninah odrezanega osmega dela (x < 0, y > 0, z > 0).
  // rz(d), rn(d): zunanji in notranji polmer v smeri d (|d| = 1); c: središče; zamik: odmik od ravnine proti gledalcu.
  function prerezLupine(rz, rn, plasti, seg, { c = new THREE.Vector3(), pora = null, zamik = 0 } = {}) {
    const ravnine = [
      [(t) => new THREE.Vector3(0, Math.cos(t * Math.PI / 2), Math.sin(t * Math.PI / 2)), new THREE.Vector3(-1, 0, 0)],
      [(t) => new THREE.Vector3(-Math.sin(t * Math.PI / 2), Math.cos(t * Math.PI / 2), 0), new THREE.Vector3(0, 0, 1)],
      [(t) => new THREE.Vector3(-Math.cos(t * Math.PI / 2), 0, Math.sin(t * Math.PI / 2)), new THREE.Vector3(0, 1, 0)],
    ];
    const geos = ravnine.map(([L, n], k) => {
      const A = [], B = [];
      for (let i = 0; i <= seg; i++) { const d = L(i / seg).normalize(); A.push(d.clone().multiplyScalar(rn(d)).add(c).addScaledVector(n, zamik)); B.push(d.clone().multiplyScalar(rz(d)).add(c).addScaledVector(n, zamik)); }
      return trakPlasti(A, B, n, plasti, pora && ((t) => pora(t, k)));
    });
    return zdruziPlasti(geos);
  }
  function zdruziPlasti(geos) {
    const pos = [], nor = [], col = [], idx = []; let off = 0;
    for (const g of geos) {
      const p = g.attributes.position, n = g.attributes.normal, cc = g.attributes.color;
      for (let k = 0; k < p.count; k++) { pos.push(p.getX(k), p.getY(k), p.getZ(k)); nor.push(n.getX(k), n.getY(k), n.getZ(k)); col.push(cc.getX(k), cc.getY(k), cc.getZ(k)); }
      for (let k = 0; k < g.index.count; k++) idx.push(g.index.getX(k) + off);
      off += p.count; g.dispose();
    }
    const out = new THREE.BufferGeometry();
    out.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    out.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    out.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    out.setIndex(idx);
    return out;
  }
  // pore jedrne ovojnice: na prerezu presledki v obeh membranah na približno enakih razdaljah
  const porePrereza = (n, barva) => { const c = new THREE.Color(barva); return (t, k) => (Math.abs(((t * n + k * 0.37) % 1) - 0.5) < 0.045 && t > 0.04 && t < 0.96 ? c : null); };
  const matPlasti = (o = {}) => mat(0xffffff, Object.assign({ vertexColors: true, roughness: 0.5, clearcoat: 0.5, clearcoatRoughness: 0.3, sheen: 0.2, side: THREE.DoubleSide }, o));
  // Združi geometrije (z index ali brez) v eno; po želji pobarva vsako z barvo oglišč.
  function zdruzi(geos, barve) {
    const pos = [], nor = [], col = [], idx = [], uv = [];
    let off = 0;
    geos.forEach((g, i) => {
      const tu = g.attributes.uv, p = g.attributes.position, n = g.attributes.normal;
      const c = Array.isArray(barve) ? new THREE.Color(barve[i]) : null;
      const gc = !c && barve === true ? g.attributes.color : null;
      for (let k = 0; k < p.count; k++) {
        pos.push(p.getX(k), p.getY(k), p.getZ(k));
        nor.push(n.getX(k), n.getY(k), n.getZ(k));
        if (tu) uv.push(tu.getX(k), tu.getY(k)); else { const x = p.getX(k), y = p.getY(k), zz = p.getZ(k); uv.push(0.5 + Math.atan2(zz, x) / (2 * Math.PI), 0.5 + Math.asin(Math.max(-1, Math.min(1, y / (Math.hypot(x, y, zz) || 1)))) / Math.PI); }
        if (c) col.push(c.r, c.g, c.b);
        else if (gc) col.push(gc.getX(k), gc.getY(k), gc.getZ(k));
      }
      if (g.index) for (let k = 0; k < g.index.count; k++) idx.push(g.index.getX(k) + off);
      else for (let k = 0; k < p.count; k++) idx.push(k + off);
      off += p.count;
      g.dispose();
    });
    const out = new THREE.BufferGeometry();
    out.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    out.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    out.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    if (barve) out.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    out.setIndex(idx);
    return out;
  }
  // Pobarva geometrijo z barvo oglišč (za združevanje z barve === true).
  function pobarvaj(g, barva) {
    const c = new THREE.Color(barva), n = g.attributes.position.count, a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; }
    g.setAttribute("color", new THREE.BufferAttribute(a, 3));
    return g;
  }
  // Barve oglišč kot množilnik okoli 1 (material obdrži svojo barvo): rahle lise iz šuma, po želji toplejše/hladnejše.
  // Material mora imeti vertexColors: true in ga ne sme deliti z geometrijo brez barv.
  // mnozi: true pomnoži obstoječe barve oglišč (npr. iz pobarvaj) namesto da jih zamenja.
  function lise(g, { j = 0.14, fr = 3, odtenek = 0.04, temno = null, mnozi = false } = {}) {
    const p = g.attributes.position, a = new Float32Array(p.count * 3), st = mnozi && g.attributes.color;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i), n = fbm(x * fr + 3.1, y * fr - 0.7, z * fr + 1.9), h = sum(x * fr * 0.5 - 4, y * fr * 0.5 + 2, z * fr * 0.5);
      const k = (1 + n * j) * (temno ? temno(x, y, z) : 1);
      a[i * 3] = k * (1 + h * odtenek); a[i * 3 + 1] = k; a[i * 3 + 2] = k * (1 - h * odtenek);
      if (st) { a[i * 3] *= st.getX(i); a[i * 3 + 1] *= st.getY(i); a[i * 3 + 2] *= st.getZ(i); }
    }
    g.setAttribute("color", new THREE.BufferAttribute(a, 3));
    return g;
  }
  // Drobni delci (ribosomi, zrnca, mehurčki) v škatli od a do b, kjer pogoj(p) velja: ikozaedri z rahlo različno barvo in velikostjo.
  function drobci(n, a, b, velikost, material, pogoj, { razlika = 0.25, detajl = 0 } = {}) {
    const m = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, detajl), material, n), ob = new THREE.Object3D(), p = new THREE.Vector3(), c = new THREE.Color();
    let k = 0;
    for (let t = 0; t < n * 80 && k < n; t++) {
      p.set(a.x + (b.x - a.x) * rnd(), a.y + (b.y - a.y) * rnd(), a.z + (b.z - a.z) * rnd());
      if (!pogoj(p)) continue;
      ob.position.copy(p); ob.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6);
      ob.scale.set(1, 0.75 + rnd() * 0.4, 0.8 + rnd() * 0.3).multiplyScalar(velikost * (0.6 + rnd() * 0.8)); ob.updateMatrix();
      m.setMatrixAt(k, ob.matrix); const s = 1 + (rnd() * 2 - 1) * razlika; m.setColorAt(k, c.setRGB(s, s, s)); k++;
    }
    m.count = k; m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true;
    m.computeBoundingSphere(); m.computeBoundingBox();
    return m;
  }
  function del(id, ime, opis, barva, meshes, tocka) {
    meshes.forEach((m) => { m.userData.del = id; });
    deli.push({ id, ime, opis, barva, meshes, tocka });
  }
  // Odrezan osmi del: x < 0, y > 0, z > 0 (proti gledalcu levo zgoraj).
  const vIzrezu = (v, c = { x: 0, y: 0, z: 0 }) => v.x < c.x && v.y > c.y && v.z > c.z;
  // Parametrična ploskev f(u, v, p) za u, v ∈ [0, 1]; normale iz končnih razlik, zato se kosi stikajo brez šivov.
  function normala(f, u, v, n) { // lastni vektorji, ker f lahko spet kliče normala (odmik)
    const e = 1e-4, _a = V(), _b = V(), _c = V(), _d = V(), _t = V();
    for (const [du, dv] of [[0, 0], [0, 0.004], [0, -0.004], [0.004, 0], [-0.004, 0]]) {
      const uu = u + du, vv = v + dv;
      f(uu + e, vv, _a); f(uu - e, vv, _b); f(uu, vv + e, _c); f(uu, vv - e, _d);
      n.subVectors(_a, _b).cross(_t.subVectors(_c, _d));
      if (n.lengthSq() > 1e-24) return n.normalize();
    }
    return n.set(0, 1, 0);
  }
  function ploskev(f, nu, nv, obrni = false) {
    const pos = new Float32Array((nu + 1) * (nv + 1) * 3), nor = new Float32Array(pos.length), idx = [], uvp = new Float32Array((nu + 1) * (nv + 1) * 2);
    const p = V(), n = V();
    for (let j = 0, k = 0; j <= nv; j++) for (let i = 0; i <= nu; i++, k += 3) {
      f(i / nu, j / nv, p); normala(f, i / nu, j / nv, n); uvp[(k / 3) * 2] = i / nu; uvp[(k / 3) * 2 + 1] = j / nv;
      if (obrni) n.negate();
      pos[k] = p.x; pos[k + 1] = p.y; pos[k + 2] = p.z; nor[k] = n.x; nor[k + 1] = n.y; nor[k + 2] = n.z;
    }
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
      const A = j * (nu + 1) + i, B = A + 1, C = A + nu + 2, D = A + nu + 1;
      if (obrni) idx.push(A, D, B, B, D, C); else idx.push(A, B, D, B, C, D);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
    g.setAttribute("uv", new THREE.BufferAttribute(uvp, 2));
    g.setIndex(idx);
    return g;
  }
  // Ploskev, zamaknjena za d vzdolž normale (d > 0 navzven).
  const odmik = (f, d) => { const n = V(); return (u, v, p) => { normala(f, u, v, n); f(u, v, p); return p.addScaledVector(n, d); }; };
  // Cevka skozi točke (gladka krivulja).
  const nit = (tocke, r, seg, rs = 6, zaprta = false) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tocke, zaprta), q(seg), r, q(rs), zaprta);
  // Deformira oglišča geometrije s f(v) in na novo izračuna normale.
  function deformiraj(g, f) {
    const p = g.attributes.position, v = V();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); f(v); p.setXYZ(i, v.x, v.y, v.z); }
    g.computeVertexNormals();
    return g;
  }
  // Lupina z odrezanim osmim delom; f(smer) vrne polmer v tej smeri.
  function lupina(f, ws, hs) {
    const zg = new THREE.SphereGeometry(1, ws, hs / 2, Math.PI / 2, Math.PI * 1.5, 0, Math.PI / 2);
    const sp = new THREE.SphereGeometry(1, ws, hs / 2, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const pokr = new THREE.SphereGeometry(1, Math.round(ws / 4), hs / 2, 0, Math.PI / 2, 0, Math.PI / 2);
    const v = new THREE.Vector3();
    // uv v skupnih kotnih enotah krogle (u = φ / 2π, v = θ / π), da se normalna mapa na šivih ujema
    [[zg, 0.25, 0.75, 0.5], [sp, 0, 1, 0], [pokr, 0, 0.25, 0.5]].forEach(([g, u0, su, v0]) => { const t = g.attributes.uv; for (let i = 0; i < t.count; i++) t.setXY(i, u0 + t.getX(i) * su, v0 + t.getY(i) * 0.5); });
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
  // Postavi vsebino (zgrajeno v µm) v enotsko kroglo: središče škatle v izhodišče, največji polmer = cilj. Vrne enote na µm.
  function umeri(o, cilj = 0.98) {
    o.position.set(0, 0, 0); o.scale.setScalar(1); o.updateMatrixWorld(true);
    o.traverse((m) => { if (m.isInstancedMesh) { m.computeBoundingBox(); m.computeBoundingSphere(); } });
    const c = new THREE.Box3().setFromObject(o, true).getCenter(V());
    let r = 0; const v = V();
    o.traverseVisible((m) => {
      if (!m.isMesh) return;
      if (m.isInstancedMesh) { // vsak primerek posebej (skupna krogla je ohlapna)
        if (!m.geometry.boundingSphere) m.geometry.computeBoundingSphere();
        const mi = new THREE.Matrix4(), sf = new THREE.Sphere();
        for (let i = 0; i < m.count; i++) { m.getMatrixAt(i, mi); sf.copy(m.geometry.boundingSphere).applyMatrix4(mi).applyMatrix4(m.matrixWorld); r = Math.max(r, sf.center.distanceTo(c) + sf.radius); }
        return;
      }
      const p = m.geometry.attributes.position, st = Math.max(1, Math.floor(p.count / 3000));
      for (let i = 0; i < p.count; i += st) r = Math.max(r, v.fromBufferAttribute(p, i).applyMatrix4(m.matrixWorld).distanceTo(c));
    });
    const s = cilj / r;
    o.scale.setScalar(s); o.position.copy(c).multiplyScalar(-s);
    return s;
  }
  // Oznaka merila z decimalno vejico.
  const oznaka = (um) => (um >= 10 ? String(Math.round(um)) : String(Math.round(um * 10) / 10).replace(".", ",")) + " µm";
  const o = new THREE.Object3D();

  // ---------- oblika: Evans in Fung ----------
  // debelina T(r) = √(1 − (r/R0)²) · (C0 + C2 (r/R0)² + C4 (r/R0)⁴), vse v µm
  const R0 = 3.91, C0 = 0.81, C2 = 7.83, C4 = -4.39;
  const P = (x) => C0 + C2 * x + C4 * x * x;
  // a ∈ [0, π]: od središča zgornje ploskve prek roba do središča spodnje
  const profil = (a) => { const s = Math.sin(a); return [R0 * s, 0.5 * Math.cos(a) * P(s * s)]; };
  const povrsje = (a, f, p, hrup = true) => {
    const [r, y] = profil(a);
    p.set(r * Math.cos(f), y, r * Math.sin(f));
    if (hrup) p.multiplyScalar(1 + 0.006 * fbm(p.x * 0.9 + 4, p.y * 0.9, p.z * 0.9));
    return p;
  };
  const kos = (a0, a1, f0, f1) => (u, v, p) => povrsje(a0 + (a1 - a0) * v, f0 + (f1 - f0) * u, p);
  const nF = (df) => Math.max(3, Math.round(q(150) * df / (Math.PI * 2)));
  let Tmax = 0, rMax = 0;
  for (let i = 0; i <= 400; i++) { const x = i / 400, T = Math.sqrt(1 - x) * P(x); if (T > Tmax) { Tmax = T; rMax = R0 * Math.sqrt(x); } }

  const AD = 0.5; // meja osrednje vdolbine (r ≈ 1,9 µm, kjer se ploskev iz sklede prevesi v rob)
  const AO = 0.98; // zunanja meja okna v membrani (r ≈ 3,3 µm)

  // ---------- ena celica in prerez (skupina v µm) ----------
  const sCel = new THREE.Group(); group.add(sCel);
  const cel = new THREE.Group(); sCel.add(cel);
  // os celice nagnemo za 20° proti privzeti kameri (od spredaj levo zgoraj), da se vidita vdolbina in prerez
  const kam = V(-0.47, 0.34, 0.81).normalize();
  const nag = new THREE.Quaternion().setFromAxisAngle(V(0, 1, 0).cross(kam).normalize(), THREE.MathUtils.degToRad(20));
  cel.quaternion.copy(nag);
  const kamL = kam.clone().applyQuaternion(nag.clone().invert());
  const fc = Math.atan2(kamL.z, kamL.x);
  const W = 1.95, fa = fc - W / 2, fb = fc + W / 2; // odrezan klin
  const fw0 = fb + 0.12, fw1 = fb + 1.15; // okno v membrani nad citoskeletom
  const fk = fa + Math.PI * 2;

  const memMat = mat(0xac2634, { vertexColors: true, roughness: 0.46, clearcoat: 0.5, clearcoatRoughness: 0.14, sheen: 0.5, sheenColor: new THREE.Color(0xe0646c), sheenRoughness: 0.35, zrnje: ["zrnje", 22, 5, 0.22] });
  const vdMat = mat(0xc53a46, { vertexColors: true, roughness: 0.44, clearcoat: 0.5, clearcoatRoughness: 0.14, sheen: 0.5, sheenColor: new THREE.Color(0xe87a80), sheenRoughness: 0.35, zrnje: ["zrnje", 22, 2, 0.2] });
  // cela celica
  const memCela = new THREE.Mesh(ploskev(kos(AD, Math.PI - AD, 0, Math.PI * 2), nF(Math.PI * 2), q(90)), memMat);
  const vdCela = new THREE.Mesh(zdruzi([
    ploskev(kos(0, AD, 0, Math.PI * 2), nF(Math.PI * 2), q(22)),
    ploskev(kos(Math.PI - AD, Math.PI, 0, Math.PI * 2), nF(Math.PI * 2), q(22)),
  ]), vdMat);
  // prerez: brez klina in z oknom
  const memPrerez = new THREE.Mesh(zdruzi([
    ploskev(kos(AD, Math.PI - AD, fb, fw0), nF(fw0 - fb), q(90)),
    ploskev(kos(AO, Math.PI - AD, fw0, fw1), nF(fw1 - fw0), q(60)),
    ploskev(kos(AD, Math.PI - AD, fw1, fk), nF(fk - fw1), q(90)),
  ]), memMat);
  const vdPrerez = new THREE.Mesh(zdruzi([
    ploskev(kos(0, AD, fb, fk), nF(fk - fb), q(22)),
    ploskev(kos(Math.PI - AD, Math.PI, fb, fk), nF(fk - fb), q(22)),
  ]), vdMat);
  // robovi prereza in okna
  const krivulja = (a0, a1, f0, f1, n) => { const t = []; for (let i = 0; i <= n; i++) t.push(povrsje(a0 + (a1 - a0) * i / n, f0 + (f1 - f0) * i / n, V()).multiplyScalar(0.994)); return t; };
  // debela membrana na obeh ploskvah prereza: trak med profilom in profilom, zamaknjenim navznoter (debelina povečana)
  const TM = 0.1;
  const trakProfila = (f, sm) => {
    const A = [], B = [], n = V(-Math.sin(f), 0, Math.cos(f)).multiplyScalar(sm), N = q(160);
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI, [r, y] = profil(a), [r1, y1] = profil(Math.min(Math.PI, a + 1e-3)), [r0, y0] = profil(Math.max(0, a - 1e-3));
      let nr = y1 - y0, ny = -(r1 - r0); const l = Math.hypot(nr, ny) || 1; nr /= l; ny /= l;
      const k = 1 + 0.006 * fbm(r * Math.cos(f) * 0.9 + 4, y * 0.9, r * Math.sin(f) * 0.9);
      B.push(V(r * k * 0.999 * Math.cos(f), y * k * 0.999, r * k * 0.999 * Math.sin(f)).addScaledVector(n, 0.004));
      const ri = Math.max(0, r * k + nr * TM), yi = y * k + ny * TM;
      A.push(V(ri * Math.cos(f), yi, ri * Math.sin(f)).addScaledVector(n, 0.004));
    }
    return trakPlasti(A, B, n, DVOSLOJ(0xd9545f));
  };
  const memTrak = new THREE.Mesh(zdruziPlasti([trakProfila(fa, 1), trakProfila(fb, -1)]), matPlasti({ roughness: 0.52, clearcoat: 0.3 }));
  const robGeo = zdruzi([
    nit(krivulja(AD, AO, fw0, fw0, 20), 0.035, 30, 6), nit(krivulja(AD, AO, fw1, fw1, 20), 0.035, 30, 6),
    nit(krivulja(AD, AD, fw0, fw1, 24), 0.035, 36, 6), nit(krivulja(AO, AO, fw0, fw1, 24), 0.035, 36, 6),
  ]);
  const memRob = new THREE.Mesh(robGeo, memMat);
  for (const m of [memCela, vdCela, memPrerez, vdPrerez, memRob]) lise(m.geometry, { j: 0.16, fr: 0.7, odtenek: 0.05 });
  cel.add(memCela, vdCela, memPrerez, vdPrerez, memRob, memTrak);

  // citoplazma: ploskvi prereza (prečni prerez v obliki ročke) in dno okna
  const pokrovF = (f) => (u, v, p) => { const a = v * Math.PI / 2, [r, h] = profil(a); return p.set(r * 0.996 * Math.cos(f), (2 * u - 1) * h * 0.99, r * 0.996 * Math.sin(f)); };
  const notranja = odmik(kos(AD - 0.03, AO + 0.03, fw0 - 0.03, fw1 + 0.03), -0.075);
  const citMat = mat(0x7a1424, { vertexColors: true, roughness: 0.62, clearcoat: 0.3, sheen: 0.3, sheenColor: new THREE.Color(0x9a3040), side: THREE.DoubleSide, zrnje: ["zrnje", 6, 6, 0.4] });
  const cit = new THREE.Mesh(zdruzi([ploskev(pokrovF(fa), q(24), q(48)), ploskev(pokrovF(fb), q(24), q(48)), ploskev(notranja, q(30), q(24))]), citMat);
  lise(cit.geometry, { j: 0.22, fr: 1.4, odtenek: 0.05 });
  cel.add(cit);

  // hemoglobin: molekule (2 α in 2 β verigi) na ploskvah prereza
  const lobi = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map(([x, y, z], i) => {
    const g = new THREE.IcosahedronGeometry(0.042, 0);
    g.translate(x * 0.028, y * 0.028, z * 0.028);
    return pobarvaj(g.index ? g : g, i < 2 ? 0xe0404c : 0xa82038);
  });
  const hbGeo = zdruzi(lobi.map((g) => g.toNonIndexed ? g : g), true);
  const hbTocke = [];
  for (const [f, s] of [[fa, 1], [fb, -1]]) {
    const n = V(-Math.sin(f), 0, Math.cos(f)).multiplyScalar(s);
    const dmin = hi ? 0.14 : 0.22, nase = [];
    for (let t = 0; t < 9000; t++) {
      const r = 0.1 + rnd() * (R0 - 0.3), x = (r / R0) ** 2, h = 0.5 * Math.sqrt(1 - x) * P(x) - 0.15;
      if (h < 0.05) continue;
      const y = (rnd() * 2 - 1) * h;
      if (nase.some((p) => (p[0] - r) ** 2 + (p[1] - y) ** 2 < dmin * dmin)) continue;
      nase.push([r, y]);
      hbTocke.push(V(r * Math.cos(f), y, r * Math.sin(f)).addScaledVector(n, 0.018));
    }
  }
  const hb = new THREE.InstancedMesh(hbGeo, mat(0xffffff, { vertexColors: true, roughness: 0.42, clearcoat: 0.5, sheen: 0.3, sheenColor: new THREE.Color(0xf08080) }), hbTocke.length);
  hbTocke.forEach((p, i) => { o.position.copy(p); o.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6); o.scale.setScalar(0.85 + rnd() * 0.3); o.updateMatrix(); hb.setMatrixAt(i, o.matrix); });
  cel.add(hb);

  // citoskelet: trikotna mreža spektrina s stičnimi kompleksi (aktin) tik pod membrano
  const plast = odmik(kos(AD - 0.04, AO + 0.04, fw0 - 0.05, fw1 + 0.05), -0.04);
  const vozli = [], dV = 0.36, p0 = V();
  for (let t = 0; t < 4000 && vozli.length < 140; t++) {
    const u = rnd(), v = rnd();
    plast(u, v, p0);
    if (vozli.some((w) => w.distanceToSquared(p0) < dV * dV)) continue;
    vozli.push(p0.clone());
  }
  const skel = [];
  const robovi = new Set();
  vozli.forEach((a, i) => {
    vozli.map((b, j) => [j, a.distanceTo(b)]).filter(([j, d]) => j !== i && d < dV * 1.75).sort((x, y) => x[1] - y[1]).slice(0, 6).forEach(([j]) => {
      const kl = i < j ? i + "-" + j : j + "-" + i;
      if (robovi.has(kl)) return;
      robovi.add(kl);
      const b = vozli[j], m1 = a.clone().lerp(b, 0.33), m2 = a.clone().lerp(b, 0.67);
      const pr = V(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(0.06);
      skel.push(pobarvaj(nit([a, m1.add(pr), m2.sub(pr), b], 0.016, 10, 4), 0xb6c8ee));
    });
  });
  vozli.forEach((a) => { const g = new THREE.IcosahedronGeometry(0.042, hi ? 1 : 0); g.translate(a.x, a.y, a.z); skel.push(pobarvaj(g, 0x7d93e0)); });
  const spektrin = new THREE.Mesh(zdruzi(skel, true), mat(0xffffff, { vertexColors: true, roughness: 0.45, clearcoat: 0.4, sheen: 0.3 }));
  cel.add(spektrin);

  // glikokaliks: sladkorne verige z antigeni krvnih skupin
  const drevo = [];
  for (const [rx, rz, h, y0] of [[0, 0, 0.09, 0], [0.55, 0.2, 0.06, 0.07], [-0.5, -0.3, 0.06, 0.07]]) {
    const c = new THREE.ConeGeometry(0.014, h, 3, 1, true);
    c.translate(0, h / 2, 0); c.rotateX(rx); c.rotateZ(rz); c.translate(0, y0, 0);
    drevo.push(c);
  }
  const glikGeo = zdruzi(drevo);
  const nGl = hi ? 1700 : 650;
  const glik = new THREE.InstancedMesh(glikGeo, mat(0xb592da, { roughness: 0.5, clearcoat: 0.3, sheen: 0.4, sheenColor: new THREE.Color(0xe0d0ff) }), nGl);
  const glTocke = [];
  { const pA = V(), pB = V(), nn = V(); let t = 0;
    while (glTocke.length < nGl && t++ < 40000) {
      const a = rnd() * Math.PI, f = rnd() * Math.PI * 2;
      povrsje(a, f, pA); povrsje(a + 0.01, f, pB);
      const w = (pA.distanceTo(pB) / 0.01) * Math.sin(a) * R0;
      if (rnd() * 6 > w) continue;
      const fn = (u, v, p) => povrsje(a + (v - 0.5) * 0.02, f + (u - 0.5) * 0.02, p);
      normala(fn, 0.5, 0.5, nn);
      const df = ((f - fa) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      glTocke.push({ p: pA.clone(), n: nn.clone(), klin: df < W + 0.02, okno: df > fw0 - fa - 0.02 && df < fw1 - fa + 0.02 && a > AD - 0.02 && a < AO + 0.02 });
    }
  }
  const Y = V(0, 1, 0);
  function glikokaliks(prerez) {
    let k = 0;
    for (const g of glTocke) {
      if (prerez && (g.klin || g.okno)) continue;
      o.position.copy(g.p); o.quaternion.setFromUnitVectors(Y, g.n); o.rotateY(rnd() * 6); o.scale.setScalar(0.5 + rnd() * 0.35); o.updateMatrix();
      glik.setMatrixAt(k++, o.matrix);
    }
    glik.count = k; glik.instanceMatrix.needsUpdate = true;
    glik.computeBoundingSphere(); glik.computeBoundingBox();
  }
  cel.add(glik);

  glikokaliks(true);
  const sCel_s = umeri(sCel, 0.93);

  // ---------- skupek: kupček krvničk (rouleaux) v kapilari ----------
  const sKup = new THREE.Group(); group.add(sKup);
  const celaGeo = zdruzi([
    pobarvaj(ploskev(kos(AD, Math.PI - AD, 0, Math.PI * 2), q(96), q(56)), 0xb82c3a),
    pobarvaj(ploskev(kos(0, AD, 0, Math.PI * 2), q(96), q(14)), 0xc53a46),
    pobarvaj(ploskev(kos(Math.PI - AD, Math.PI, 0, Math.PI * 2), q(96), q(14)), 0xc53a46),
  ], true);
  const nKup = 6, razmik = 2.42;
  const kupcek = new THREE.InstancedMesh(celaGeo, mat(0xffffff, { vertexColors: true, roughness: 0.46, clearcoat: 0.5, clearcoatRoughness: 0.14, sheen: 0.5, sheenColor: new THREE.Color(0xe0646c), zrnje: ["zrnje", 22, 5, 0.22] }), nKup);
  const kupPol = [];
  for (let i = 0; i < nKup; i++) {
    const x = (i - (nKup - 1) / 2) * razmik;
    kupPol.push({ x, y: (rnd() - 0.5) * 0.35, z: (rnd() - 0.5) * 0.35, rx: (rnd() - 0.5) * 0.5, ry: (rnd() - 0.5) * 0.1, rz: -Math.PI / 2 + (rnd() - 0.5) * 0.12, f: rnd() * 6 });
  }
  function postaviKup(t) {
    kupPol.forEach((c, i) => {
      const s = gib ? Math.sin(t * 0.8 + c.f) : 0;
      o.position.set(c.x + Math.sin(t * 0.35) * 0.25 * (gib ? 1 : 0), c.y + s * 0.04, c.z);
      o.rotation.set(c.rx + s * 0.02, c.ry, c.rz); o.scale.setScalar(1); o.updateMatrix();
      kupcek.setMatrixAt(i, o.matrix);
    });
    kupcek.instanceMatrix.needsUpdate = true;
  }
  postaviKup(0);
  sKup.add(kupcek);
  // stena kapilare iz ploščatih endotelijskih celic, odprta spredaj zgoraj
  const L = 18.5, Rn = 4.35, Rz = 4.8, p0k = -0.2, p1k = 1.85, pk = p0k + Math.PI * 2;
  const valj = (r, ps, pe) => (u, v, p) => { const ps2 = ps + (pe - ps) * v, x = (u - 0.5) * L; const rr = r * (1 + 0.012 * fbm(x * 0.4, Math.cos(ps2) * 2, Math.sin(ps2) * 2)); return p.set(x, rr * Math.cos(ps2), rr * Math.sin(ps2)); };
  const presek = (ps) => (u, v, p) => { const x = (u - 0.5) * L, r = Rn + (Rz - Rn) * v; return p.set(x, r * Math.cos(ps), r * Math.sin(ps)); };
  const konec = (s) => (u, v, p) => { const ps = p1k + (pk - p1k) * u, r = Rn + (Rz - Rn) * v; return p.set(s * L / 2, r * Math.cos(ps), r * Math.sin(ps)); };
  const stik = [];
  for (const ps of [2.05, 2.95, 5.75]) {
    const t = [];
    for (let i = 0; i <= 24; i++) { const x = (i / 24 - 0.5) * L * 0.98, pp = ps + 0.25 * Math.sin(x * 0.35 + ps * 3); t.push(V(x, Rz * 1.004 * Math.cos(pp), Rz * 1.004 * Math.sin(pp))); }
    stik.push(pobarvaj(nit(t, 0.05, 80, 5), 0xa86558));
  }
  const kapGeo = zdruzi([
    pobarvaj(ploskev(valj(Rz, p1k, pk), q(60), q(80)), 0xc98a7c),
    pobarvaj(ploskev(valj(Rn, p1k, pk), q(60), q(80), true), 0x8e5048),
    pobarvaj(ploskev(presek(p0k + Math.PI * 2), q(30), 2), 0xc89484),
    pobarvaj(ploskev(presek(p1k), q(30), 2), 0xc89484),
    pobarvaj(ploskev(konec(-1), q(60), 2), 0xc89484),
    pobarvaj(ploskev(konec(1), q(60), 2), 0xc89484),
    ...stik,
  ], true);
  const kapilara = new THREE.Mesh(kapGeo, mat(0xffffff, { vertexColors: true, roughness: 0.56, clearcoat: 0.35, clearcoatRoughness: 0.2, sheen: 0.4, sheenColor: new THREE.Color(0xd8a090), side: THREE.DoubleSide, zrnje: ["gube", 10, 6, 0.35] }));
  sKup.add(kapilara);
  // jedra endotelijskih celic: sploščena, izbočena v svetlino žile
  const jedGeo = [];
  for (const [x, ps] of [[-3.8, 2.45], [4.6, 5.45]]) {
    const g = new THREE.SphereGeometry(1, q(28), q(16));
    deformiraj(g, (v) => { v.set(v.x * 2.4, v.y * 0.5, v.z * 1.15).multiplyScalar(1 + 0.04 * sum(v.x * 3, v.y * 3, v.z * 3)); });
    const m = new THREE.Matrix4().makeRotationX(ps).setPosition(x, (Rn + Rz) / 2 * Math.cos(ps), (Rn + Rz) / 2 * Math.sin(ps));
    g.applyMatrix4(m); jedGeo.push(g);
  }
  const endJedra = new THREE.Mesh(zdruzi(jedGeo), mat(0x6654c4, { roughness: 0.45, clearcoat: 0.4, sheen: 0.4, zrnje: ["gube", 3, 2, 0.35] }));
  sKup.add(endJedra);
  const sKup_s = umeri(sKup, 0.95);

  // ---------- deli ----------
  const loc = (x, y, z) => V(x, y, z).applyQuaternion(nag).multiplyScalar(sCel_s).add(sCel.position).toArray();
  const tockaL = (a, f, d = 0) => { const p = povrsje(a, f, V()); return loc(p.x * (1 + d), p.y * (1 + d), p.z * (1 + d)); };
  const fm = (fw1 + fk) / 2 + 0.3;
  function deliCel(prerez) {
    deli.length = 0;
    del("membrana", "Celična membrana", "Tanka prožna ovojnica iz dveh plasti maščob z beljakovinami; krvnička se z njo zvije in stisne skozi kapilare, ki so ožje od nje. Debelina membrane je povečana.", "#d9545f",
      [memCela, memPrerez, memRob, memTrak], prerez ? tockaL(1.25, fm) : tockaL(1.3, fc - 0.5));
    del("vdolbina", "Osrednja vdolbina", "Na sredini je krvnička tanjša (0,8 µm) kot ob robu (2,6 µm). Zato ima veliko površino in kisik hitro pride do vsega hemoglobina.", "#e26a72",
      [vdCela, vdPrerez], prerez ? tockaL(0.12, fm) : tockaL(0.05, fc));
    del("glikokaliks", "Glikokaliks (antigeni krvnih skupin)", "Kratke sladkorne verige na površini; po njih telo prepozna svoje krvničke, njihova vrsta pa določa krvno skupino (A, B, AB ali 0).", "#cfb0ec",
      [glik], tockaL(1.1, prerez ? fm + 0.8 : fc + 0.9, 0.03));
    if (!prerez) return;
    del("citoplazma", "Citoplazma", "Notranjost krvničke brez jedra in mitohondrijev; skoraj tretjino njene mase predstavlja hemoglobin.", "#8f1d2c",
      [cit], loc(1.0 * Math.cos(fb), -0.1, 1.0 * Math.sin(fb)));
    const ph = hbTocke.reduce((a, p) => (Math.abs(p.y) < 0.4 && Math.hypot(p.x, p.z) > 2.2 && Math.hypot(p.x, p.z) < 2.6 ? p : a), hbTocke[0]);
    del("hemoglobin", "Hemoglobin", "Rdeča beljakovina iz štirih verig z železom; v pljučih veže kisik in ga odda v tkivih. V eni krvnički je okoli 270 milijonov molekul.", "#e23b48",
      [hb], loc(ph.x, ph.y, ph.z));
    const pv = vozli[Math.floor(vozli.length / 2)];
    del("citoskelet", "Citoskelet (mreža spektrina)", "Mreža beljakovinskih niti tik pod membrano; krvnički daje obliko in prožnost, da se po stiskanju vrne v ploščico.", "#b6c8ee",
      [spektrin], loc(pv.x, pv.y, pv.z));
  }
  function deliKup() {
    deli.length = 0;
    const k = (x, y, z) => V(x, y, z).multiplyScalar(sKup_s).add(sKup.position).toArray();
    del("krvnicke", "Rdeče krvničke v kupčku", "V počasnem toku se krvničke zložijo ena na drugo kot kovanci; v ozkih kapilarah sicer potujejo ena za drugo in se pri tem zvijejo.", "#d9545f",
      [kupcek], k(-razmik * 2.5 - 0.6, 1.8, 1.2));
    del("kapilara", "Stena kapilare", "Najtanjša krvna žila; njeno steno gradi ena plast ploščatih endotelijskih celic, skozi katero prehajata kisik in hrana.", "#e3a796",
      [kapilara], k(2, Rz * Math.cos(2.3), Rz * Math.sin(2.3)));
    del("endotel-jedro", "Jedro endotelijske celice", "Sploščeno jedro celice, ki gradi steno kapilare; tam je stena nekoliko debelejša.", "#7a68d8",
      [endJedra], k(-3.8, (Rz + 0.5) * Math.cos(2.45), (Rz + 0.5) * Math.sin(2.45)));
  }

  let prikaz = "prerez";
  function nastavi(v) {
    prikaz = v;
    const pr = v === "prerez";
    sCel.visible = v !== "skupek"; sKup.visible = v === "skupek";
    memCela.visible = vdCela.visible = !pr;
    memPrerez.visible = vdPrerez.visible = memRob.visible = memTrak.visible = cit.visible = hb.visible = spektrin.visible = pr;
    glikokaliks(pr);
    if (v === "skupek") deliKup(); else deliCel(pr);
  }
  const fmt = (x) => x.toFixed(1).replace(".", ",");
  const nadzor = [
    { tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["ena", "Ena celica"], ["prerez", "Prerez"], ["skupek", "Skupek"]], vrednost: "prerez", ob: nastavi },
    { tip: "izpis", id: "mere", oznaka: "Mere", vrednost: () => `premer ${fmt(2 * R0)} µm · rob ${fmt(Tmax)} µm · sredina ${fmt(C0)} µm` },
  ];
  const zac = ctx.zacetek && ctx.zacetek.prikaz;
  if (zac && ["ena", "prerez", "skupek"].includes(zac)) nadzor[0].vrednost = zac;
  nastavi(nadzor[0].vrednost);
  void rMax;

  return {
    group,
    pogled: [-0.47, 0.34, 0.81], // smer kamere: yaw −30°, pitch 20° (odrezani del proti gledalcu)
    deli,
    nadzor,
    get merilo() {
      const um = prikaz === "skupek" ? 2 / sKup_s : 2 / sCel_s;
      return { m: um * 1e-6, oznaka: oznaka(um) };
    },
    korak(t) {
      if (!gib) return;
      if (prikaz === "skupek") postaviKup(t);
      else cel.quaternion.copy(nag).multiply(new THREE.Quaternion().setFromAxisAngle(Y, Math.sin(t * 0.15) * 0.05));
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
      odpadT.forEach((t) => t.dispose());
    },
  };
}
