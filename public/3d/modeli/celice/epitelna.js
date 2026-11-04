// Epitelna celica z mikrovili (enterocit tankega črevesa) med dvema prerezanima sosedama.
// Pogodba graditelja: docs/3d.md. Brez uvozov; THREE pride od kompleta. Model je zgrajen v µm in nato umerjen v enotsko kroglo.

export const info = {
  id: "celica-epitelna",
  naslov: "Epitelna celica z mikrovili",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Visoka valjasta celica črevesnega epitelija (enterocit, približno 20 µm × 8 µm) med dvema prerezanima sosedama. Na vrhu ima gost krtačasti obrobek iz mikrovilov, ki močno poveča površino za vsrkavanje hranil. Mikrovilov in organelov je manj kot v resnici.",
  poskusi: "Tapni mikrovile in pomisli, zakaj črevo potrebuje tako veliko površino.",
  merilo: { m: 28e-6, oznaka: "28 µm" },
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

  const H = 20, w = 3.9, KB = 0.7, KT = 0.55, DOME = 0.25, NSE = 5;
  const se = (th) => Math.pow(Math.pow(Math.abs(Math.cos(th)), NSE) + Math.pow(Math.abs(Math.sin(th)), NSE), -1 / NSE);
  // profil stebra (d od osi, y) z zaobljenima robovoma, enakomerno po dolžini
  function profil(wd, h, kb, kt, dome) {
    const t = [[0, 0]];
    t.push([wd - kb, 0]);
    for (let i = 1; i <= 8; i++) { const a = -Math.PI / 2 + (i / 8) * Math.PI / 2; t.push([wd - kb + kb * Math.cos(a), kb + kb * Math.sin(a)]); }
    t.push([wd, h - kt]);
    for (let i = 1; i <= 8; i++) { const a = (i / 8) * Math.PI / 2; t.push([wd - kt + kt * Math.cos(a), h - kt + kt * Math.sin(a)]); }
    for (let i = 1; i <= 10; i++) { const d = (wd - kt) * (1 - i / 10); t.push([d, h + dome * (1 - (d / (wd - kt)) ** 2)]); }
    const L = [0];
    for (let i = 1; i < t.length; i++) L.push(L[i - 1] + Math.hypot(t[i][0] - t[i - 1][0], t[i][1] - t[i - 1][1]));
    return (v) => {
      const s = THREE.MathUtils.clamp(v, 0, 1) * L[L.length - 1];
      let i = 1; while (i < L.length - 1 && L[i] < s) i++;
      const f = (s - L[i - 1]) / (L[i] - L[i - 1] || 1);
      return [t[i - 1][0] + (t[i][0] - t[i - 1][0]) * f, t[i - 1][1] + (t[i][1] - t[i - 1][1]) * f];
    };
  }
  const zunPr = profil(w, H, KB, KT, DOME), notPr = profil(w - 0.13, H - 0.13, KB - 0.1, KT - 0.1, DOME);
  const vrh = (d) => H + DOME * (1 - Math.min(1, d / (w - KT)) ** 2);
  const steber = (pr, cx, t0, t1, hrup = 0.012) => (u, v, p) => {
    const th = t0 + (t1 - t0) * u, [d, y] = pr(v), r = d * se(th);
    p.set(cx + r * Math.cos(th), y, r * Math.sin(th));
    const n = fbm(p.x * 0.5 + 3, p.y * 0.5, p.z * 0.5);
    return p.set(cx + (p.x - cx) * (1 + hrup * n), p.y + 0.05 * n, p.z * (1 + hrup * n));
  };
  const svet = new THREE.Group(); group.add(svet);

  // ---------- glavna celica: odprta spredaj (z > 0 odrezano) ----------
  const memMat = mat(0xc06e8e, { vertexColors: true, roughness: 0.5, clearcoat: 0.42, clearcoatRoughness: 0.18, sheen: 0.45, sheenColor: new THREE.Color(0xd895b4), sheenRoughness: 0.35, zrnje: ["zrnje", 8, 24, 0.28] });
  const mem = new THREE.Mesh(lise(ploskev(steber(zunPr, 0, Math.PI, Math.PI * 2), q(64), q(100), true), { j: 0.15, fr: 0.35, odtenek: 0.05 }), memMat);
  // notranja stena: temnejša od zunanje, globlje (zadaj, ob dnu in vrhu) še temnejša – navidezna senca
  const cit = new THREE.Mesh(lise(ploskev(steber(notPr, 0, Math.PI, Math.PI * 2, 0.008), q(48), q(80), true), { j: 0.2, fr: 0.45, odtenek: 0.05, temno: (x, y, z) => (0.62 + 0.38 * THREE.MathUtils.smoothstep(z, -w, -0.5)) * (0.8 + 0.2 * THREE.MathUtils.smoothstep(y, 0, 2.5) * (1 - THREE.MathUtils.smoothstep(y, H - 1.5, H))) }), mat(0xb98272, { vertexColors: true, roughness: 0.72, clearcoat: 0.12, sheen: 0.25, sheenColor: new THREE.Color(0x9a6a5e), side: THREE.BackSide, zrnje: ["zrnje", 8, 20, 0.4] }));
  const obris = [];
  for (let i = 0; i <= 80; i++) { const v = i / 80; obris.push(steber(zunPr, 0, Math.PI, Math.PI)(0, v, V()).multiplyScalar(1)); }
  const obris2 = [];
  for (let i = 0; i <= 80; i++) obris2.push(steber(zunPr, 0, Math.PI * 2, Math.PI * 2)(0, i / 80, V()));
  // debela membrana na ploskvi prereza z = 0: trak med zunanjo in notranjo ploskvijo (debelina povečana)
  const trakStebra = (cx, th, ravnina, sx = 1) => {
    const A = [], B = [], N = q(110);
    for (let i = 0; i <= N; i++) {
      const v = i / N, a = steber(notPr, cx, th, th, 0.008)(0, v, V()), b = steber(zunPr, cx, th, th)(0, v, V());
      if (ravnina === "x") { a.x = b.x = cx - sx * 0.012; } else { a.z = b.z = 0.012; }
      A.push(a); B.push(b);
    }
    return trakPlasti(A, B, ravnina === "x" ? V(-sx, 0, 0) : V(0, 0, 1), DVOSLOJ(0xd88aa2));
  };
  const memRob = new THREE.Mesh(zdruziPlasti([trakStebra(0, Math.PI), trakStebra(0, Math.PI * 2)]), matPlasti({ roughness: 0.55, clearcoat: 0.25 }));
  svet.add(mem, cit, memRob);

  // ---------- sosednji celici: prerezani na ravninah z = 0 in x = ±8 ----------
  const sosGeo = [];
  for (const [cx, t0, t1, sx] of [[-8, Math.PI * 1.5, Math.PI * 2, 1], [8, Math.PI, Math.PI * 1.5, -1]]) {
    sosGeo.push(pobarvaj(ploskev(steber(zunPr, cx, t0, t1), q(24), q(80), true), 0xb4668a));
    // ploskev prereza z = 0 in x = cx
    const kz = (u, v, p) => { const [d, y] = zunPr(v); return p.set(cx + sx * u * d * 0.998, y, 0); };
    const kx = (u, v, p) => { const [d, y] = zunPr(v); return p.set(cx, y, -u * d * 0.998); };
    sosGeo.push(pobarvaj(ploskev(kz, 6, q(70)), 0xcf9a86), pobarvaj(ploskev(kx, 6, q(70)), 0xcf9a86));
    // prerez jedra in nekaj mitohondrijev na obeh ploskvah
    const elipsa = (cx2, cy, a, b, ravnina, zac = -Math.PI / 2, kon = Math.PI / 2) => (u, v, p) => {
      const ang = zac + (kon - zac) * u, x = a * v * Math.cos(ang), y = cy + b * v * Math.sin(ang);
      return ravnina === "z" ? p.set(cx2 + sx * x, y, 0.025) : p.set(cx - sx * 0.025, y, -x);
    };
    sosGeo.push(pobarvaj(ploskev(elipsa(cx, 6.8, 2.1, 3.6, "z"), 16, 6), 0x6654c4), pobarvaj(ploskev(elipsa(cx, 6.8, 2.1, 3.6, "x"), 16, 6), 0x6654c4));
    sosGeo.push(pobarvaj(ploskev(elipsa(cx + sx * 0.4, 7.6, 0.55, 0.6, "z", 0, Math.PI * 2), 12, 3), 0x34268a));
    for (const [mx, my, ra, rb, rv] of [[1.6, 16.5, 0.28, 0.8, "z"], [2.8, 2.2, 0.28, 0.75, "z"], [2.9, 14.4, 0.3, 0.7, "z"], [1.4, 17.2, 0.3, 0.75, "x"], [2.5, 2.6, 0.28, 0.8, "x"], [2.8, 12.6, 0.3, 0.7, "x"]]) {
      const e = (u, v, p) => { const ang = u * Math.PI * 2, x = mx + ra * v * Math.cos(ang), y = my + rb * v * Math.sin(ang); return rv === "z" ? p.set(cx + sx * x, y, 0.03) : p.set(cx - sx * 0.03, y, -x); };
      sosGeo.push(pobarvaj(ploskev(e, 10, 2), 0xe8743b));
      const A = [], B = [], np = rv === "z" ? V(0, 0, 1) : V(-sx, 0, 0);
      for (let i = 0, n = q(20); i <= n; i++) { B.push(e(i / n, 1, V()).addScaledVector(np, 0.006)); A.push(e(i / n, 0.72, V()).addScaledVector(np, 0.006)); }
      sosGeo.push(trakPlasti(A, B, np, [[0, 0.28, new THREE.Color(0xb8501f)], [0.4, 0.6, new THREE.Color(0xf7c29a)], [0.72, 1, new THREE.Color(0xc85a26)]]));
    }
    for (const rv of ["z", "x"]) { // dvojna ovojnica jeder sosed
      const e = elipsa(cx, 6.8, 2.1, 3.6, rv), np = rv === "z" ? V(0, 0, 1) : V(-sx, 0, 0), A = [], B = [];
      for (let i = 0, n = q(40); i <= n; i++) { B.push(e(i / n, 1, V()).addScaledVector(np, 0.006)); A.push(e(i / n, 0.94, V()).addScaledVector(np, 0.006)); }
      sosGeo.push(trakPlasti(A, B, np, DVOJNA(0x5a48c0, 0xcfc4f7), porePrereza(7, 0xb9a8ff)));
    }
  }
  for (const [cx, sx] of [[-8, 1], [8, -1]]) { // membrana sosed na obeh ploskvah prereza
    sosGeo.push(trakStebra(cx, sx > 0 ? Math.PI * 2 : Math.PI, "z"));
    sosGeo.push(trakStebra(cx, Math.PI * 1.5, "x", sx));
  }
  const sosedi = new THREE.Mesh(lise(zdruzi(sosGeo, true), { j: 0.24, fr: 0.7, odtenek: 0.05, mnozi: true }), mat(0xffffff, { vertexColors: true, roughness: 0.58, clearcoat: 0.3, clearcoatRoughness: 0.2, sheen: 0.35, sheenColor: new THREE.Color(0xb08890), side: THREE.DoubleSide, zrnje: ["zrnje", 2, 8, 0.35] }));
  svet.add(sosedi);

  // ---------- mikrovili (krtačasti obrobek) ----------
  const mvGeo = new THREE.CylinderGeometry(0.05, 0.055, 1, q(6), 1, false); mvGeo.translate(0, 0.5, 0);
  const mvTocke = [];
  const korakM = hi ? 0.22 : 0.33;
  for (const [cx, x0, x1] of [[0, -w, w], [-8, -8, -8 + w], [8, 8 - w, 8]]) {
    for (let x = x0 + korakM / 2; x < x1; x += korakM) for (let z = -w + korakM / 2; z < -0.02; z += korakM * 0.87) {
      const xx = x + (rnd() - 0.5) * korakM * 0.35, zz = z + (rnd() - 0.5) * korakM * 0.35 + ((Math.round((x - x0) / korakM) % 2) * korakM * 0.43);
      if (zz > -0.03) continue;
      const th = Math.atan2(zz, xx - cx), d = Math.hypot(xx - cx, zz) / se(th);
      if (d > w - KT - 0.05) continue;
      mvTocke.push(V(xx, vrh(d) - 0.05, zz));
    }
  }
  const mvMat = mat(0xcf86a2, { roughness: 0.48, clearcoat: 0.45, clearcoatRoughness: 0.15, sheen: 0.5, sheenColor: new THREE.Color(0xf0b8cc) });
  const mv = new THREE.InstancedMesh(mvGeo, mvMat, mvTocke.length);
  mvTocke.forEach((p, i) => { o.position.copy(p); o.rotation.set((rnd() - 0.5) * 0.08, 0, (rnd() - 0.5) * 0.08); o.scale.set(1, 0.9 + rnd() * 0.25, 1); o.updateMatrix(); mv.setMatrixAt(i, o.matrix); });
  svet.add(mv);

  // ---------- jedro (prerezano na ravnini z = 0) ----------
  const J = V(0, 6.8, 0), ja = 2.1, jb = 3.7;
  const jF = (u, v, p) => { const f = Math.PI + Math.PI * u, t = Math.PI * v; p.set(ja * Math.sin(t) * Math.cos(f), jb * Math.cos(t), ja * Math.sin(t) * Math.sin(f)); return p.multiplyScalar(1 + 0.03 * sum(p.x * 1.4 + 2, p.y * 1.4, p.z * 1.4)).add(J); };
  const jedro = new THREE.Mesh(ploskev(jF, q(40), q(48), true), mat(0x6654c4, { roughness: 0.45, clearcoat: 0.4, sheen: 0.4, sheenColor: new THREE.Color(0xa898f0), zrnje: ["gube", 6, 4, 0.4] }));
  const jPrerez = (u, v, p) => { const a = u * Math.PI * 2; p.set(ja * v * Math.cos(a), jb * v * Math.sin(a), 0); p.multiplyScalar(0.985); return p.add(J); };
  const jCap = ploskev(jPrerez, q(48), q(14));
  { // kromatin in jedrce z barvo oglišč
    const p = jCap.attributes.position, col = new Float32Array(p.count * 3), a = new THREE.Color(0xa08ef0), b = new THREE.Color(0x4a38a8), c = new THREE.Color(0x2a1e78), t = new THREE.Color();
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), dj = Math.hypot(x - 0.45, (y - 8.0) * 0.9);
      t.copy(a).lerp(b, THREE.MathUtils.clamp(sum(x * 2.2, y * 2.2, 3) * 0.9 + 0.1, 0, 0.8));
      if (dj < 0.75) t.copy(c);
      col.set([t.r, t.g, t.b], i * 3);
    }
    jCap.setAttribute("color", new THREE.BufferAttribute(col, 3));
  }
  const jPlo = new THREE.Mesh(jCap, mat(0xffffff, { vertexColors: true, roughness: 0.62, clearcoat: 0.25, side: THREE.DoubleSide, zrnje: ["zrnje", 5, 3, 0.35] }));
  // dvojna jedrna ovojnica s porami na prerezu
  const ovoj = (() => {
    const A = [], B = [], N = q(160), E = 0.2;
    for (let i = 0; i <= N; i++) { const a = (i / N) * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a); B.push(V(ja * c, jb * sn, 0).multiplyScalar(0.995).add(J).setZ(0.014)); A.push(V((ja - E) * c, (jb - E) * sn, 0).multiplyScalar(0.995).add(J).setZ(0.014)); }
    return trakPlasti(A, B, V(0, 0, 1), DVOJNA(0x5a48c0, 0xcfc4f7), porePrereza(14, 0xb9a8ff));
  })();
  const jOvoj = new THREE.Mesh(ovoj, matPlasti({ roughness: 0.58, clearcoat: 0.2 }));
  svet.add(jedro, jPlo, jOvoj);

  // ---------- mitohondriji ----------
  function mitohondrij() {
    const L = 1.3, r = 0.42, prof = [];
    for (let i = 0; i <= 14; i++) { const a = -Math.PI / 2 + (i / 14) * Math.PI; prof.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r + (a < 0 ? -L / 2 : L / 2))); }
    const zun = new THREE.LatheGeometry(prof, q(13), 0.5 * Math.PI, 1.45 * Math.PI);
    const not = new THREE.LatheGeometry(prof.map((p) => new THREE.Vector2(p.x * 0.8, p.y * 0.9)), q(13), 0.5 * Math.PI, 1.45 * Math.PI);
    const ix = not.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i]; ix[i] = ix[i + 2]; ix[i + 2] = t; }
    not.computeVertexNormals();
    const kr = [];
    for (let i = 0; i < 6; i++) {
      const y = -L / 2 - r * 0.45 + i * ((L + r * 0.9) / 5);
      const wd = Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, Math.abs(y) - L / 2) / r, 2))) * r * 0.6;
      const c = new THREE.BoxGeometry(wd * 1.5, 0.06, wd * 1.6);
      c.translate(i % 2 ? wd * 0.25 : -wd * 0.25, y, 0);
      kr.push(c);
    }
    // ploskvi prereza na obeh koncih odprtine: zunanja in notranja membrana (kriste so gube notranje)
    const konca = [0.5 * Math.PI, 1.95 * Math.PI].map((phi, k) => {
      const A = [], B = [], sn = Math.sin(phi), cs = Math.cos(phi);
      for (const pt of prof.filter((_, i) => hi || i % 2 === 0 || i === prof.length - 1)) { B.push(V(pt.x * sn, pt.y, pt.x * cs)); A.push(V(pt.x * 0.8 * sn, pt.y * 0.9, pt.x * 0.8 * cs)); }
      const n = V(cs, 0, -sn).multiplyScalar(k ? 1 : -1);
      return trakPlasti(A, B, n, [[0, 0.28, new THREE.Color(0xb8501f)], [0.4, 0.6, new THREE.Color(0xf7c29a)], [0.72, 1, new THREE.Color(0xc85a26)]]);
    });
    for (const [g, b] of [[zun, 0xd8642c], [not, 0xc0582a]]) pobarvaj(g, b);
    kr.forEach((g) => pobarvaj(g, 0xf0a868));
    return zdruziPlasti([zun, not, ...kr, ...konca]);
  }
  const mitPol = [];
  const obmocja = [[1.2, 3.2, 6], [14.9, 18.6, 11], [4, 10.5, 5]];
  for (const [y0, y1, n] of obmocja) {
    for (let k = 0, t = 0; k < n && t < 500; t++) {
      const p = V((rnd() * 2 - 1) * 3.0, y0 + rnd() * (y1 - y0), -0.7 - rnd() * 2.6);
      if (y0 === 4 && Math.abs(p.x) < 2.7) continue;
      if (mitPol.some((m) => m.distanceTo(p) < 1.15)) continue;
      mitPol.push(p); k++;
    }
  }
  const mit = new THREE.InstancedMesh(mitohondrij(), mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, sheen: 0.35, sheenColor: new THREE.Color(0xf0a070), side: THREE.DoubleSide }), mitPol.length);
  mitPol.forEach((p, i) => { o.position.copy(p); o.rotation.set((rnd() - 0.5) * 0.5, rnd() * 6, (rnd() - 0.5) * 0.5); o.scale.setScalar(0.85 + rnd() * 0.35); o.updateMatrix(); mit.setMatrixAt(i, o.matrix); });
  svet.add(mit);

  // ---------- zrnati ER z ribosomi ----------
  const erGeo = [], ribT = [];
  for (let i = 0; i < 4; i++) {
    const y0 = 12.35 + i * 0.55;
    const f = (u, v, p) => { const x = -3.0 + 6.0 * u, z = -3.3 + 2.8 * v; return p.set(x, y0 + 0.13 * Math.sin(x * 1.4 + i) + 0.09 * Math.cos(z * 1.9 + i * 2), z); };
    erGeo.push(ploskev(f, q(40), q(18)));
    for (let k = 0; k < (hi ? 115 : 60); k++) { const p = f(rnd(), rnd(), V()); p.y += rnd() < 0.5 ? 0.07 : -0.07; ribT.push(p); }
  }
  for (const sx of [-1, 1]) { // ob jedru
    const f = (u, v, p) => { const y = 4.2 + 6.5 * u, z = -3.2 + 2.7 * v; return p.set(sx * (2.85 + 0.1 * Math.sin(y * 1.3)), y, z); };
    erGeo.push(ploskev(f, q(28), q(12)));
    for (let k = 0; k < (hi ? 70 : 36); k++) { const p = f(rnd(), rnd(), V()); p.x += rnd() < 0.5 ? 0.07 : -0.07; ribT.push(p); }
  }
  const zer = new THREE.Mesh(zdruzi(erGeo), mat(0x4676c8, { roughness: 0.5, clearcoat: 0.4, sheen: 0.4, sheenColor: new THREE.Color(0x9ac0f0), side: THREE.DoubleSide, zrnje: ["gube", 3, 2, 0.45] }));
  const rib = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.065, 0), mat(0x22337a, { roughness: 0.6, clearcoat: 0.2 }), ribT.length);
  ribT.forEach((p, i) => { o.position.copy(p); o.rotation.set(0, 0, 0); o.scale.setScalar(1); o.updateMatrix(); rib.setMatrixAt(i, o.matrix); });
  svet.add(zer, rib);

  // ---------- Golgijev aparat (nad jedrom) ----------
  const golGeo = [];
  for (let i = 0; i < 5; i++) {
    const R = 1.9 - i * 0.15;
    const g = new THREE.SphereGeometry(1, q(28), q(8));
    deformiraj(g, (v) => { v.set(v.x * R, v.y * 0.085, v.z * R * 0.6); v.y += 0.32 * (v.x / R) ** 2 + i * 0.26; });
    golGeo.push(g);
  }
  for (let i = 0; i < 10; i++) { const a = rnd() * Math.PI * 2, s = new THREE.SphereGeometry(0.13 + rnd() * 0.07, q(10), q(8)); s.translate(Math.cos(a) * (1.9 + rnd() * 0.4), 0.4 + rnd() * 1.2, Math.sin(a) * 0.9); golGeo.push(s); }
  const golgi = new THREE.Mesh(zdruzi(golGeo), mat(0xdcab34, { roughness: 0.48, clearcoat: 0.45, sheen: 0.4, sheenColor: new THREE.Color(0xf5d890), zrnje: ["gube", 3, 1, 0.35] }));
  golgi.position.set(0.2, 10.75, -1.9);
  svet.add(golgi);

  // ---------- tesni stiki (pas pod vrhom) in dezmosomi (na notranji strani bočne membrane) ----------
  const tjGeo = [];
  for (let s = 0; s < 4; s++) {
    const pts = [];
    for (let i = 0; i <= 90; i++) {
      const th = Math.PI + Math.PI * (i / 90), y = H - KT - 0.35 - s * 0.24 + 0.08 * Math.sin(i * 0.9 + s * 2);
      const r = (w - 0.2) * se(th);
      pts.push(V(r * Math.cos(th), y, Math.min(-0.02, r * Math.sin(th))));
    }
    tjGeo.push(nit(pts, 0.055, 200, 5));
  }
  const tesni = new THREE.Mesh(zdruzi(tjGeo), mat(0x24a888, { roughness: 0.45, clearcoat: 0.45, sheen: 0.4, sheenColor: new THREE.Color(0x80e0c8) }));
  svet.add(tesni);
  const dezGeo = [], dezT = [];
  const dezPol = [[1, 15.8, -2.2], [1, 12.0, -1.0], [1, 8.4, -2.6], [1, 4.6, -1.4], [1, 2.2, -2.8], [0, 16.8, 1.2], [0, 13.2, -1.6], [0, 9.6, 0.4], [0, 5.5, 1.8], [0, 3.0, -0.6], [-1, 14.5, -2.0], [-1, 6.5, -1.2]];
  for (const [stran, y, s] of dezPol) {
    // stran 1: desna stena (x ≈ w), 0: zadnja stena (z ≈ -w), -1: leva stena
    const p = stran === 0 ? V(s, y, -(w - 0.17)) : V(stran * (w - 0.17), y, s);
    const n = stran === 0 ? V(0, 0, 1) : V(-stran, 0, 0);
    const plosca = new THREE.CylinderGeometry(0.42, 0.42, 0.1, q(16));
    plosca.applyMatrix4(new THREE.Matrix4().compose(p, new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), n), V(1, 1, 1)));
    dezGeo.push(pobarvaj(plosca, 0xb5507f));
    for (let k = 0; k < 4; k++) { // keratinske niti
      const a = (k / 4) * Math.PI * 2 + rnd(), t = V(0, Math.cos(a), Math.sin(a));
      if (stran === 0) t.set(Math.sin(a), Math.cos(a), 0);
      const z = p.clone().addScaledVector(t, 0.25), k1 = z.clone().addScaledVector(n, 0.9).addScaledVector(t, 0.6), k2 = p.clone().addScaledVector(t, -0.2).addScaledVector(n, 0.35);
      dezGeo.push(pobarvaj(nit([z, k1, k1.clone().addScaledVector(t, -0.6).addScaledVector(n, 0.3), k2], 0.03, 16, 4), 0xe3b0cc));
    }
    dezT.push(p.clone().addScaledVector(n, 0.05));
  }
  const dez = new THREE.Mesh(zdruzi(dezGeo, true), mat(0xffffff, { vertexColors: true, roughness: 0.5, clearcoat: 0.4, sheen: 0.3 }));
  svet.add(dez);

  // ---------- bazalna membrana ----------
  const bm = new THREE.BoxGeometry(16.4, 0.4, 4.4, q(80), 1, q(22));
  bm.translate(0, -0.34, -2.2);
  deformiraj(bm, (v) => { if (v.y > -0.2) v.y += 0.035 * fbm(v.x * 1.5, 0, v.z * 1.5); });
  const bazalna = new THREE.Mesh(bm, mat(0x6f948c, { roughness: 0.85, clearcoat: 0.05, sheen: 0.3, zrnje: ["vlakna", 8, 2, 0.5] }));
  svet.add(bazalna);

  const s = umeri(svet, 0.985);
  const L = (x, y, z) => V(x, y, z).multiplyScalar(s).add(svet.position).toArray();

  del("mikrovili", "Mikrovili (krtačasti obrobek)", "Na tisoče prstastih izrastkov, dolgih okoli 1 µm; kot krtača povečajo površino celice več kot 20-krat, zato celica hitreje vsrka hranila.", "#eaa0b6", [mv], L(-1.6, H + 1.0, -0.15));
  del("membrana", "Celična membrana", "Ovojnica celice iz dvosloja maščob; na vrhu je nagubana v mikrovile, ob straneh pa se dotika sosednjih celic. Debelina membrane je povečana.", "#d88aa2", [mem, memRob], L(-w, 13, -0.05));
  del("citoplazma", "Citoplazma", "Želatinasta notranjost celice z organeli.", "#f1c9b6", [cit], L(1.2, 16, -w + 0.2));
  del("jedro", "Jedro", "Ovalno jedro z dvojno ovojnico in porami leži v spodnjem delu celice; v njem sta DNK in temnejše jedrce.", "#7a68d8", [jedro, jPlo, jOvoj], L(-0.8, 5.4, 0.05));
  del("mitohondrij", "Mitohondriji", "Imajo dvojno membrano; notranja je nagubana v kriste. Pridobivajo energijo (ATP) za črpanje hranil skozi membrano; največ jih je pod vrhom in ob dnu.", "#e8743b", [mit], L(...mitPol.reduce((a, p) => (p.y > 14 && p.z > a.z ? p : a), V(0, 16, -9)).clone().add(V(0, 0, 0.4)).toArray()));
  del("zrnati-er", "Zrnati endoplazemski retikulum", "Sploščeni membranski mešički z ribosomi; v njem nastajajo beljakovine, na primer encimi na mikrovilih.", "#5b8fe0", [zer], L(-2.4, 12.95, -0.6));
  del("ribosomi", "Ribosomi", "Drobna zrnca, ki sestavljajo beljakovine; mnogo jih sedi na zrnatem ER.", "#2b3f8f", [rib], L(2.0, 13.5, -0.55));
  del("golgi", "Golgijev aparat", "Leži nad jedrom; beljakovine in maščobe dodela in zapakira v mešičke.", "#f2c94c", [golgi], L(-1.5, 11.15, -1.4));
  del("tesni-stiki", "Tesni stiki", "Pas beljakovinskih niti tik pod vrhom, ki sosednji celici tesno zlepi; tako snovi iz črevesa ne morejo zdrsniti med celicama.", "#3fcfa8", [tesni], L(w - 0.25, H - KT - 0.6, -1.0));
  del("dezmosomi", "Dezmosomi", "Točkasti stiki kot zakovice; s keratinskimi nitmi povežejo sosednji celici, da se tkivo ne raztrga.", "#b5507f", [dez], L(...dezT[1].toArray()));
  del("bazalna-membrana", "Bazalna membrana", "Tanka plast beljakovinskih vlaken pod epitelijem, na kateri celice stojijo.", "#8fb0a8", [bazalna], L(-1, -0.3, -0.02));
  del("sosednje-celice", "Sosednji celici (prerez)", "Enake celice ob strani, prerezane, da se vidita jedro in mitohondriji; skupaj tvorijo enoslojni valjasti epitelij.", "#cf8199", [sosedi], L(-6.4, 9.5, 0.05));

  return {
    group,
    pogled: [-0.47, 0.34, 0.81], // smer kamere: yaw −30°, pitch 20° (odrezani del proti gledalcu)
    deli,
    korak(t) {
      if (!gib) return;
      group.rotation.y = Math.sin(t * 0.15) * 0.04;
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
      odpadT.forEach((t) => t.dispose());
    },
  };
}
