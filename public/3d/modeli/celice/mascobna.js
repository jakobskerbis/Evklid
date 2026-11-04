// Maščobna celica (adipocit bele maščobe) v prerezu: ena velika maščobna kapljica, tanek pas citoplazme in jedro kot pečatni prstan.
// Pogodba graditelja: docs/3d.md. Brez uvozov; THREE pride od kompleta. Model je zgrajen v µm (1 enota = 62 µm).

export const info = {
  id: "celica-mascobna",
  naslov: "Maščobna celica (adipocit)",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Celica bele maščobe s premerom okoli 100 µm. Skoraj vso celico zapolni ena maščobna kapljica, zato sta citoplazma in sploščeno jedro potisnjena ob membrano kot pečatni prstan. Z drsnikom spremeniš količino shranjene maščobe: kapljica in celica se povečata ali skrčita.",
  poskusi: "Premikaj drsnik »Shranjena maščoba« in opazuj, kako se celica poveča.",
  merilo: { m: 124e-6, oznaka: "124 µm" },
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

  const S = 1 / 62; // enot na µm (premer enotske krogle = 124 µm)
  const RDM = 56, VC = 58 ** 3 - 56 ** 3; // največja kapljica in stalna prostornina citoplazme (v R³)
  let f = 0.8, Rd = 0, Rc = 0, T0 = 0;
  const N = V(-0.62, 0.785, 0).normalize(), E1 = V(0.785, 0.62, 0).normalize(), E2 = V(0, 0, 1); // jedro leži na ravnini prereza z = 0
  const B1 = 8.5, B2 = 5; // polovični dolžini jedra v µm
  const TM = 0.9, TJO = 0.42; // debelina membrane in jedrne ovojnice v µm (povečani, da sta vidni)
  const svet = new THREE.Group(); svet.scale.setScalar(S); group.add(svet);

  const izbo = (d) => { // izboklina membrane nad jedrom
    const a = d.dot(E1) * Rc / B1, b = d.dot(E2) * Rc / B2, n = d.dot(N);
    if (n < 0.8) return 0;
    return Math.max(0, 1 - a * a - b * b) ** 0.8 * Math.max(0, T0 + TM + 0.5 - (Rc - Rd));
  };
  const oblika = (d) => Rc * (1 + 0.004 * fbm(d.x * 3 + 2, d.y * 3, d.z * 3)) + izbo(d);

  // ---------- materiali in mreže ----------
  const memMat = mat(0xcf7f98, { vertexColors: true, roughness: 0.5, clearcoat: 0.45, clearcoatRoughness: 0.16, sheen: 0.4, sheenColor: new THREE.Color(0xd890a8), sheenRoughness: 0.35, zrnje: ["zrnje", 30, 15, 0.24] });
  const mem = new THREE.Mesh(new THREE.BufferGeometry(), memMat);
  const memRob = new THREE.Mesh(new THREE.BufferGeometry(), matPlasti({ roughness: 0.55, clearcoat: 0.25 }));
  const kapMat = mat(0xffffff, { vertexColors: true, roughness: 0.2, metalness: 0, clearcoat: 0.8, clearcoatRoughness: 0.06, specularIntensity: 0.8, specularColor: new THREE.Color(0xfff6d8), ior: 1.47, sheen: 0.25, sheenColor: new THREE.Color(0xc89a40), sheenRoughness: 0.3, side: THREE.DoubleSide, zrnje: ["gube", 3, 3, 0.08] });
  const kapljica = new THREE.Mesh(new THREE.BufferGeometry(), kapMat);
  const citMat = mat(0xffffff, { vertexColors: true, roughness: 0.62, clearcoat: 0.3, clearcoatRoughness: 0.3, sheen: 0.3, sheenColor: new THREE.Color(0xb88070), side: THREE.DoubleSide, zrnje: ["zrnje", 8, 2, 0.35] });
  const cit = new THREE.Mesh(new THREE.BufferGeometry(), citMat);
  const jMat = mat(0x6654c4, { roughness: 0.45, clearcoat: 0.4, sheen: 0.4, side: THREE.DoubleSide, zrnje: ["gube", 3, 2, 0.35] });
  const jedro = new THREE.Mesh(new THREE.BufferGeometry(), jMat);
  const jPlo = new THREE.Mesh(new THREE.BufferGeometry(), mat(0xffffff, { vertexColors: true, roughness: 0.6, clearcoat: 0.25, sheen: 0.2, side: THREE.DoubleSide, zrnje: ["zrnje", 6, 2, 0.3] }));
  const kapilara = new THREE.Mesh(new THREE.BufferGeometry(), mat(0xffffff, { vertexColors: true, color: 0xa83a44, roughness: 0.48, clearcoat: 0.45, clearcoatRoughness: 0.2, sheen: 0.45, sheenColor: new THREE.Color(0xe07a80), zrnje: ["gube", 18, 2, 0.4] }));
  svet.add(mem, memRob, kapljica, cit, jedro, jPlo, kapilara);
  // mitohondriji: majhni, v pasu citoplazme ob ravninah prereza in ob jedru
  const mitG = (() => { const L = 0.9, r = 0.35, pr = []; for (let i = 0; i <= 12; i++) { const a = -Math.PI / 2 + (i / 12) * Math.PI; pr.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r + (a < 0 ? -L / 2 : L / 2))); } return new THREE.LatheGeometry(pr, q(14)); })();
  const mitPod = [];
  for (let i = 0; i < 14; i++) mitPod.push({ ravnina: i % 3, kot: 0.08 + rnd() * (Math.PI / 2 - 0.16), del: 0.35 + rnd() * 0.3, vrt: rnd() * 3 });
  const mit = new THREE.InstancedMesh(mitG, mat(0xd8642c, { roughness: 0.5, clearcoat: 0.45, sheen: 0.4, zrnje: ["gube", 2, 2, 0.5] }), mitPod.length);
  svet.add(mit);

  // točka na ravnini prereza: ravnina 0: x = 0 (y, z > 0), 1: y = 0 (x < 0, z > 0), 2: z = 0 (x < 0, y > 0)
  const naRavnini = (rv, kot, r, p = V()) => { const c = Math.cos(kot) * r, s = Math.sin(kot) * r; return rv === 0 ? p.set(0, c, s) : rv === 1 ? p.set(-c, 0, s) : p.set(-c, s, 0); };
  const normalaRavnine = (rv) => (rv === 0 ? V(-1, 0, 0) : rv === 1 ? V(0, 1, 0) : V(0, 0, 1));
  const robR = (rv, kot) => oblika(naRavnini(rv, kot, 1).normalize());

  // Barve oglišč: kapljica je v sredini svetlejša, proti robu temneje jantarna z rahlimi progami; tik ob citoplazmi senca.
  const kS = new THREE.Color(0xf7d57e), kR = new THREE.Color(0xd2901f), kT = new THREE.Color(0x7a4510), _c = new THREE.Color();
  function barvajKapljico(g, rv) {
    const p = g.attributes.position, a = new Float32Array(p.count * 3), v = V();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i); const r = v.length() / Rd;
      const proga = fbm(v.x * 0.05 + rv * 3, v.y * 0.05 + fbm(v.z * 0.04, v.x * 0.04, 1) * 1.5, v.z * 0.05 + 9);
      _c.copy(kS).lerp(kR, THREE.MathUtils.clamp(r ** 2 * 0.8 + proga * 0.32, 0, 1));
      if (r > 0.9) _c.lerp(kT, ((r - 0.9) / 0.1) ** 1.5 * 0.55);
      const os = Math.min(...[v.x, v.y, v.z].map((x, k) => (k === rv ? 1e9 : Math.abs(x)))); // razdalja do roba, kjer se ploskvi stikata
      _c.lerp(kT, Math.max(0, 1 - os / 10) ** 2 * 0.55 * Math.min(1, r * 4));
      _c.multiplyScalar(0.72 + 0.28 * THREE.MathUtils.smoothstep(r, 0.05, 0.6)); // navidezna senca v notranjem kotu prereza
      a.set([_c.r, _c.g, _c.b], i * 3);
    }
    g.setAttribute("color", new THREE.BufferAttribute(a, 3));
    return g;
  }
  const cS = new THREE.Color(0xe9b39e), cT = new THREE.Color(0x96584a), cZ = new THREE.Color(0xd99a72);
  function barvajCit(g) {
    const p = g.attributes.position, a = new Float32Array(p.count * 3), v = V();
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i); const r = v.length(), t = THREE.MathUtils.clamp((r - Rd) / Math.max(0.5, Rc - Rd), 0, 1);
      const zrn = sum(v.x * 0.9, v.y * 0.9, v.z * 0.9);
      _c.copy(cS).lerp(cZ, THREE.MathUtils.clamp(zrn * 0.6 + 0.2, 0, 1)).lerp(cT, (1 - Math.sin(Math.PI * t)) * 0.45);
      a.set([_c.r, _c.g, _c.b], i * 3);
    }
    g.setAttribute("color", new THREE.BufferAttribute(a, 3));
    return g;
  }

  function postavi() {
    Rd = RDM * Math.cbrt(f);
    Rc = Math.cbrt(Rd ** 3 + VC);
    T0 = Math.min(3.2, (Rc - Rd) * 1.6 + 1.4); // debelina jedra: sploščeno, a debelejše od pasu citoplazme
    // membrana
    const l = lupina(oblika, q(150), q(90));
    mem.geometry.dispose(); mem.geometry = lise(l.odprta, { j: 0.16, fr: 0.06, odtenek: 0.05 }); l.pokrov.dispose();
    memRob.geometry.dispose(); memRob.geometry = prerezLupine((d) => oblika(d) * 0.999, (d) => oblika(d) - TM, DVOSLOJ(0xd88aa2), q(120), { zamik: 0.03 });
    // ploskve prereza: kapljica (do Rd) in pas citoplazme (od Rd do membrane)
    const kg = [], cg = [];
    const H = Math.min(3.5, Rd * 0.065); // rahla izboklina ploskve kapljice (kot gladka gladina olja), ujame odsev luči
    for (let rv = 0; rv < 3; rv++) {
      const nr = normalaRavnine(rv);
      kg.push(barvajKapljico(ploskev((u, v, p) => naRavnini(rv, u * Math.PI / 2, v * (Rd - 0.03), p).addScaledVector(nr, H * Math.sin(Math.PI * u) * 4 * v * (1 - v)), q(64), q(28)), rv));
      cg.push(barvajCit(ploskev((u, v, p) => { const k = u * Math.PI / 2, r1 = robR(rv, k) - TM; return naRavnini(rv, k, Rd + (r1 - Rd) * v, p); }, q(120), 6)));
    }
    kapljica.geometry.dispose(); kapljica.geometry = zdruzi(kg, true);
    cit.geometry.dispose(); cit.geometry = zdruzi(cg, true);
    // jedro: sploščena leča med kapljico in membrano, prerezana na z = 0
    const Rin = Rd + 0.12;
    const debel = (a, b) => T0 * Math.max(0, 1 - a * a - b * b) ** 0.55;
    const smerJ = (a, b) => N.clone().addScaledVector(E1, (a * B1) / Rc).addScaledVector(E2, (b * B2) / Rc).normalize();
    const zun = (u, v, p) => { const a = -1 + 2 * u, wv = Math.sqrt(Math.max(0, 1 - a * a)), b = -wv * v; return p.copy(smerJ(a, b)).multiplyScalar(Rin + debel(a, b)); };
    const not = (u, v, p) => { const a = -1 + 2 * u, wv = Math.sqrt(Math.max(0, 1 - a * a)), b = -wv * v; return p.copy(smerJ(a, b)).multiplyScalar(Rin); };
    jedro.geometry.dispose(); jedro.geometry = zdruzi([ploskev(zun, q(48), q(14)), ploskev(not, q(48), q(10), true)]);
    const pre = ploskev((u, v, p) => { const a = -1 + 2 * u; return p.copy(smerJ(a, 0)).multiplyScalar(Rin + debel(a, 0) * v).setZ(0.09); }, q(96), q(24));
    { const p = pre.attributes.position, c = new Float32Array(p.count * 3), A = new THREE.Color(0xb9a8ff), Bc = new THREE.Color(0x4b3aa6), t = new THREE.Color();
      const ovoj = DVOJNA(0x5a48c0, 0xc9bdf5), nu = q(96) + 1;
      for (let i = 0; i < p.count; i++) {
        t.copy(A).lerp(Bc, THREE.MathUtils.clamp(sum(p.getX(i) * 1.2, p.getY(i) * 1.2, 3) * 0.9 + 0.35, 0, 0.9));
        // jedrna ovojnica: dve membrani ob robu prereza, vmes pore
        const iu = i % nu, iv = Math.floor(i / nu), uu = iu / (nu - 1), vv = iv / q(24), a = -1 + 2 * uu, D = debel(a, 0);
        const rob = Math.min(vv * D, (1 - vv) * D, Math.abs(a) > 0.97 ? 0 : 99);
        const pora = Math.abs(((uu * 9) % 1) - 0.5) < 0.05;
        if (rob < TJO && !pora) barvaPlasti(ovoj, 1 - rob / TJO, t);
        c.set([t.r, t.g, t.b], i * 3);
      }
      pre.setAttribute("color", new THREE.BufferAttribute(c, 3)); }
    jPlo.geometry.dispose(); jPlo.geometry = pre;
    // mitohondriji v pasu citoplazme na ravninah prereza (polovica gleda iz ravnine)
    mitPod.forEach((m, i) => {
      let kot = m.kot;
      if (m.ravnina === 2 && Math.abs(kot - Math.atan2(N.y, -N.x)) < 0.22) kot = Math.atan2(N.y, -N.x) + (kot > 0.9 ? 0.26 : -0.26);
      const r1 = robR(m.ravnina, kot), r = Rd + (r1 - Rd) * m.del;
      const p = naRavnini(m.ravnina, kot, r), tang = naRavnini(m.ravnina, kot + Math.PI / 2, 1);
      o.position.copy(p); o.quaternion.setFromUnitVectors(V(0, 1, 0), tang); o.rotateY(m.vrt);
      o.scale.setScalar(Math.min(1, (r1 - Rd) / 1.1)); o.updateMatrix(); mit.setMatrixAt(i, o.matrix);
    });
    mit.instanceMatrix.needsUpdate = true; mit.computeBoundingSphere(); mit.computeBoundingBox();
    // kapilara, ki se vije ob celici (zadaj desno)
    const pts = [];
    for (let i = 0; i <= 24; i++) { const t = i / 24, a = -1.5 + 2.2 * t, d = V(Math.cos(a) * 0.9, Math.sin(a) * 0.9, 0.42 + 0.06 * Math.sin(t * 7)).normalize(); pts.push(d.multiplyScalar(Rc + 3.0)); }
    kapilara.geometry.dispose(); kapilara.geometry = lise(nit(pts, 2.8, 90, 14), { j: 0.2, fr: 0.12, odtenek: 0.06 });
  }
  postavi();

  const W = (p) => p.clone().multiplyScalar(S).toArray();
  function postaviDele() {
    deli.length = 0;
    const sm = V(0.45, 0.25, 0.86).normalize();
    del("membrana", "Celična membrana", "Tanka ovojnica celice iz dveh plasti maščob (dvosloj); ob jedru je navzven nekoliko izbočena. Debelina membrane je povečana.", "#d88aa2", [mem, memRob], W(sm.multiplyScalar(oblika(sm) * 1.005)));
    del("kapljica", "Maščobna kapljica", "Ena velika kapljica maščob (trigliceridov), ki zapolni skoraj vso celico; je zaloga energije in toplotna izolacija telesa.", "#f3d36b", [kapljica], W(naRavnini(1, 0.75, Rd * 0.55)));
    del("citoplazma", "Citoplazma", "Le tanek pas citoplazme ob membrani, ker kapljica zavzame skoraj ves prostor.", "#f1c9b6", [cit], W(naRavnini(0, 0.55, (Rd + robR(0, 0.55)) / 2)));
    del("jedro", "Jedro", "Sploščeno jedro z dvojno ovojnico in porami, ki ga kapljica potisne ob rob celice; v prerezu je celica videti kot pečatni prstan.", "#7a68d8", [jedro, jPlo], W(N.clone().multiplyScalar(Rd + T0 * 0.5).setZ(0.2)));
    del("mitohondrij", "Mitohondriji", "Maloštevilni mitohondriji v tankem pasu citoplazme; pri razgradnji maščob dajejo energijo.", "#e8743b", [mit], W(naRavnini(1, mitPod[1].kot, Rd + (robR(1, mitPod[1].kot) - Rd) * mitPod[1].del)));
    del("kapilara", "Kapilara", "Maščobno tkivo je dobro prekrvljeno; po krvi pridejo maščobe v celico in odidejo iz nje, ko telo potrebuje energijo.", "#d96a6a", [kapilara], W(V(Math.cos(-0.6) * 0.9, Math.sin(-0.6) * 0.9, 0.42 + 0.06 * Math.sin((0.9 / 2.2) * 7)).normalize().multiplyScalar(Rc + 5.6)));
  }
  postaviDele();
  const fmt = (x) => String(Math.round(x));
  const nadzor = [
    { tip: "drsnik", id: "mascoba", oznaka: "Shranjena maščoba", min: 10, max: 100, korak: 1, vrednost: 80,
      ob: (v) => { f = THREE.MathUtils.clamp(v, 10, 100) / 100; postavi(); postaviDele(); } },
    { tip: "izpis", id: "mere", oznaka: "Velikost", vrednost: () => `celica ${fmt(2 * Rc)} µm · kapljica ${fmt(2 * Rd)} µm (${fmt((Rd ** 3 / Rc ** 3) * 100)} % prostornine)` },
  ];
  const zac = ctx.zacetek && Number(ctx.zacetek.mascoba);
  if (zac >= 10 && zac <= 100) { nadzor[0].vrednost = zac; nadzor[0].ob(zac); }

  return {
    group,
    pogled: [-0.47, 0.34, 0.81], // smer kamere: yaw −30°, pitch 20° (odrezani del proti gledalcu)
    deli,
    nadzor,
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
