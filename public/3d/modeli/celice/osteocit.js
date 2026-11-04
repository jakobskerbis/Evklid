// Kostna celica: osteocit v lakuni prerezane kostne medceličnine, z izrastki v kanalikulih do sosednjih osteocitov.
// Pogodba graditelja: docs/3d.md. Brez uvozov; THREE pride od kompleta. Model je zgrajen v µm in nato umerjen v enotsko kroglo.

export const info = {
  id: "celica-osteocit",
  naslov: "Kostna celica (osteocit)",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Osteocit leži v votlinici (lakuni) trde kostne medceličnine, ki je tu prerezana. Skozi tanke kanalčke (kanalikule) pošilja izrastke do sosednjih osteocitov in z njimi izmenjuje snovi. Kanalikuli in izrastki so zaradi preglednosti debelejši in jih je manj kot v resnici.",
  merilo: { m: 55e-6, oznaka: "55 µm" },
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

  const BX = 24, BZ = 12, BY = 10; // kos kosti: 48 × 24 µm, 10 µm globoko pod prerezom
  const svet = new THREE.Group(); group.add(svet);
  svet.rotation.set(0.6, -0.22, 0, "YXZ");

  // ---------- lakune ----------
  const lakune = [
    { c: [0, 0], a: 12.6, b: 5.1, f: 0, D: 2.65 },
    { c: [-23, -6.8], a: 8.8, b: 4.0, f: 0.32, D: 2.3 },
    { c: [22.5, 7.2], a: 8.8, b: 3.9, f: -0.28, D: 2.3 },
  ];
  const lok = (L, x, z) => { const dx = x - L.c[0], dz = z - L.c[1], c = Math.cos(L.f), s = Math.sin(L.f); return [(dx * c + dz * s) / L.a, (-dx * s + dz * c) / L.b]; };
  const vLakuni = (L, x, z, m = 1) => { const [u, v] = lok(L, x, z); return u * u + v * v < m; };
  const robL = (L, th, k = 1) => { const c = Math.cos(L.f), s = Math.sin(L.f), u = L.a * k * Math.cos(th), v = L.b * k * Math.sin(th); return [L.c[0] + u * c - v * s, L.c[1] + u * s + v * c]; };

  // ---------- kanalikuli: vijugave poti v ravnini prereza ----------
  const poti = []; // { t: [[x, z], …], od, do }
  const vBloku = (x, z) => Math.abs(x) < BX - 0.3 && Math.abs(z) < BZ - 0.3;
  function pot(L, th, cilj, dolzina) {
    let [x, z] = robL(L, th, 0.97);
    const t = [[x, z]];
    let smer = Math.atan2(Math.sin(th) * L.a, Math.cos(th) * L.b) + L.f;
    for (let k = 0; k < 60; k++) {
      if (cilj) { const ci = Math.atan2(cilj.c[1] - z, cilj.c[0] - x); let d = ci - smer; d = Math.atan2(Math.sin(d), Math.cos(d)); smer += d * 0.35; }
      smer += (rnd() - 0.5) * 0.55;
      x += Math.cos(smer) * 1.3; z += Math.sin(smer) * 1.3;
      const zunaj = !vBloku(x, z);
      if (zunaj) { t.push([THREE.MathUtils.clamp(x, -BX, BX), THREE.MathUtils.clamp(z, -BZ, BZ)]); break; }
      t.push([x, z]);
      if (cilj && vLakuni(cilj, x, z, 0.9)) break;
      if (lakune.some((M) => M !== L && M !== cilj && vLakuni(M, x, z, 1.4))) break;
      if (!cilj && dolzina && k * 1.3 > dolzina) break;
    }
    return t;
  }
  const nGl = hi ? 30 : 22;
  for (let i = 0; i < nGl; i++) {
    const th = (i / nGl) * Math.PI * 2 + (rnd() - 0.5) * 0.15;
    const [x, z] = robL(lakune[0], th);
    let cilj = null;
    if (x < -4 && z < -1 && i % 2 === 0) cilj = lakune[1];
    if (x > 4 && z > 1 && i % 2 === 0) cilj = lakune[2];
    const t = pot(lakune[0], th, cilj, 9 + rnd() * 20);
    poti.push({ t, od: 0, cilj });
    if (rnd() < 0.4 && t.length > 6) { // razvejitev
      const k = 2 + Math.floor(rnd() * (t.length - 4));
      const kot = Math.atan2(t[k + 1][1] - t[k][1], t[k + 1][0] - t[k][0]) + (rnd() < 0.5 ? 0.7 : -0.7);
      const tv = [t[k]];
      let [bx, bz] = t[k];
      for (let s = 0; s < 4 + rnd() * 5; s++) { bx += Math.cos(kot + (rnd() - 0.5) * 0.6) * 1.3; bz += Math.sin(kot + (rnd() - 0.5) * 0.6) * 1.3; if (!vBloku(bx, bz)) break; tv.push([bx, bz]); }
      if (tv.length > 2) poti.push({ t: tv, od: -1 });
    }
  }
  for (const n of [1, 2]) for (let i = 0; i < (hi ? 9 : 6); i++) { const th = (i / 9) * Math.PI * 2 + rnd() * 0.3; const t = pot(lakune[n], th, null, 5 + rnd() * 9); if (t.length > 2) poti.push({ t, od: n }); }
  // gladke krivulje in daljice za višinsko polje
  const krivulje = poti.map((p) => new THREE.CatmullRomCurve3(p.t.map(([x, z]) => V(x, 0, z))));
  const daljice = [];
  krivulje.forEach((k) => { const t = k.getSpacedPoints(Math.max(4, Math.round(k.getLength() / 0.5))); for (let i = 0; i < t.length - 1; i++) { const a = t[i], b = t[i + 1]; daljice.push([a.x, a.z, b.x, b.z, Math.min(a.x, b.x) - 1, Math.max(a.x, b.x) + 1, Math.min(a.z, b.z) - 1, Math.max(a.z, b.z) + 1]); } });
  const celica = (x0, z0, cs) => { const m = new Map(); daljice.forEach((d, i) => { for (let gx = Math.floor((d[4] - x0) / cs); gx <= Math.floor((d[5] - x0) / cs); gx++) for (let gz = Math.floor((d[6] - z0) / cs); gz <= Math.floor((d[7] - z0) / cs); gz++) { const k = gx * 1000 + gz; if (!m.has(k)) m.set(k, []); m.get(k).push(i); } }); return m; };
  const CS = 2, mreza = celica(-BX, -BZ, CS);
  function razdalja(x, z) {
    const s = mreza.get(Math.floor((x + BX) / CS) * 1000 + Math.floor((z + BZ) / CS));
    if (!s) return 99;
    let m = 99;
    for (const i of s) {
      const [ax, az, bx, bz] = daljice[i], dx = bx - ax, dz = bz - az, l = dx * dx + dz * dz || 1;
      const t = THREE.MathUtils.clamp(((x - ax) * dx + (z - az) * dz) / l, 0, 1), ex = ax + dx * t - x, ez = az + dz * t - z;
      m = Math.min(m, ex * ex + ez * ez);
    }
    return Math.sqrt(m);
  }
  const lamela = (x, z) => Math.hypot(x, z + 40); // lamele so koncentrične okoli osteona zunaj kosa
  const GL = 0.55, GW = 0.34;
  function visina(x, z) {
    let h = 0.05 * Math.sin((lamela(x, z) / 4.6) * Math.PI * 2) + 0.04 * fbm(x * 0.4, 1, z * 0.4);
    let vrsta = 0, lk = 0;
    for (const L of lakune) { const [u, v] = lok(L, x, z), e = u * u + v * v; if (e < 1) { h = Math.min(h, -L.D * Math.pow(1 - e, 0.42)); vrsta = 1; lk = Math.max(lk, Math.min(1, (1 - e) * 6)); } }
    const d = razdalja(x, z);
    const g = GL * Math.exp(-(d * d) / (2 * GW * GW));
    if (g > 0.14 && vrsta === 0) vrsta = 2;
    h = Math.min(h, -g);
    return [h, vrsta, lk, g / GL];
  }

  // ---------- kostna medceličnina: višinsko polje prereza + stene ----------
  const nx = q(230), nz = Math.round(nx / 2);
  const pos = new Float32Array((nx + 1) * (nz + 1) * 3), col = new Float32Array(pos.length), vrste = new Uint8Array((nx + 1) * (nz + 1));
  const kost = new THREE.Color(0xdcc9a2), temna = new THREE.Color(0xb59c72), cc = new THREE.Color(), barvaLak = new THREE.Color(0xa88660), barvaKan = new THREE.Color(0x6a4c30);
  const barvaKosti = (x, y, z, out) => { const l = Math.sin((lamela(x, z) / 4.6) * Math.PI * 2); return out.copy(kost).lerp(temna, 0.28 + 0.22 * l + 0.25 * fbm(x * 0.3 + 5, y * 0.3, z * 0.3)); };
  for (let j = 0, k = 0; j <= nz; j++) for (let i = 0; i <= nx; i++, k++) {
    const x = -BX + (2 * BX * i) / nx, z = -BZ + (2 * BZ * j) / nz, [h, vr, lk, gk] = visina(x, z);
    pos.set([x, h, z], k * 3); vrste[k] = vr;
    barvaKosti(x, h, z, cc);
    cc.lerp(barvaLak, 0.65 * lk);
    if (lk < 0.5) cc.lerp(barvaKan, 0.8 * Math.min(1, gk * 1.6));
    col.set([cc.r, cc.g, cc.b], k * 3);
  }
  const idx = [[], [], []];
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const A = j * (nx + 1) + i, B = A + 1, C = A + nx + 2, D = A + nx + 1;
    const v = Math.max(vrste[A], vrste[B], vrste[C], vrste[D]);
    const sk = vrste[A] === 1 || vrste[B] === 1 || vrste[C] === 1 || vrste[D] === 1 ? 1 : v;
    idx[sk].push(A, D, B, B, D, C);
  }
  const polje = new THREE.BufferGeometry();
  polje.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  polje.setAttribute("color", new THREE.BufferAttribute(col, 3));
  polje.setIndex(idx[0].concat(idx[1], idx[2]));
  polje.computeVertexNormals();
  const del3 = idx.map((ix) => { const g = new THREE.BufferGeometry(); g.setAttribute("position", polje.attributes.position); g.setAttribute("normal", polje.attributes.normal); g.setAttribute("color", polje.attributes.color); g.setIndex(ix); return g; });
  { // uv za normalno mapo: ravninska projekcija (enako gostoto imajo stene: u po dolžini 2·BX)
    const uv = new Float32Array((pos.length / 3) * 2); for (let k = 0; k < pos.length / 3; k++) { uv[k * 2] = (pos[k * 3] + BX) / (2 * BX); uv[k * 2 + 1] = (pos[k * 3 + 2] + BZ) / (2 * BX); }
    const ua = new THREE.BufferAttribute(uv, 2); del3.forEach((g) => g.setAttribute("uv", ua));
  }
  // stene kosa (zgornji rob sledi višinskemu polju), vse z lamelami v barvi oglišč
  const stene = [];
  // stene: lamele kot navpične proge, proti dnu temneje (globina), ob vrhu tanek svetel rob prereza
  const stena = (f) => { const g = ploskev(f, q(160), 12); const p = g.attributes.position, c = new Float32Array(p.count * 3); for (let i = 0; i < p.count; i++) { const y = p.getY(i); barvaKosti(p.getX(i), y, p.getZ(i), cc); cc.multiplyScalar(0.62 + 0.38 * Math.pow(THREE.MathUtils.clamp((y + BY) / BY, 0, 1), 0.8)); c.set([cc.r, cc.g, cc.b], i * 3); } g.setAttribute("color", new THREE.BufferAttribute(c, 3)); return g; };
  stene.push(stena((u, v, p) => { const x = -BX + 2 * BX * u; return p.set(x, -BY + (visina(x, BZ)[0] + BY) * v, BZ); }));
  stene.push(stena((u, v, p) => { const x = BX - 2 * BX * u; return p.set(x, -BY + (visina(x, -BZ)[0] + BY) * v, -BZ); }));
  stene.push(stena((u, v, p) => { const z = BZ - 2 * BZ * u; return p.set(-BX, -BY + (visina(-BX, z)[0] + BY) * v, z); }));
  stene.push(stena((u, v, p) => { const z = -BZ + 2 * BZ * u; return p.set(BX, -BY + (visina(BX, z)[0] + BY) * v, z); }));
  const dno = new THREE.PlaneGeometry(2 * BX, 2 * BZ); dno.rotateX(Math.PI / 2); dno.translate(0, -BY, 0); pobarvaj(dno, 0xa8946c);
  const matKost = mat(0xffffff, { vertexColors: true, roughness: 0.84, clearcoat: 0.08, clearcoatRoughness: 0.5, sheen: 0.2, sheenColor: new THREE.Color(0xa89270), sheenRoughness: 0.8, side: THREE.DoubleSide, zrnje: ["vlakna", 5, 5, 0.55] });
  const medcel = new THREE.Mesh(zdruzi([del3[0], ...stene, dno], true), matKost);
  const lakuna = new THREE.Mesh(del3[1], mat(0xffffff, { vertexColors: true, roughness: 0.62, clearcoat: 0.25, clearcoatRoughness: 0.3, sheen: 0.3, sheenColor: new THREE.Color(0x907050), side: THREE.DoubleSide, zrnje: ["zrnje", 8, 8, 0.4] }));
  const kanal = new THREE.Mesh(del3[2], mat(0xffffff, { vertexColors: true, roughness: 0.75, clearcoat: 0.1, sheen: 0.2, side: THREE.DoubleSide, zrnje: ["zrnje", 8, 8, 0.4] }));
  svet.add(medcel, lakuna, kanal);
  // odprtine kanalikulov, ki iz lakune vodijo navzdol v kost
  const odpr = [];
  for (let i = 0; i < 34; i++) {
    const L = lakune[0], th = rnd() * Math.PI * 2, k = 0.8 + rnd() * 0.15, [x, z] = robL(L, th, k);
    const [h] = visina(x, z);
    const t = new THREE.CircleGeometry(0.28, q(10)); t.rotateX(-Math.PI / 2); t.translate(x, h + 0.04, z);
    odpr.push(t);
  }
  // prerezani kanalikuli na stenah kosa (kanalčki potekajo v vse smeri, tudi navzdol): temna odprtina z izrastkom v sredini
  const presekiIz = [];
  const stenaN = [[V(0, 0, 1), (a) => V(a * BX, 0, BZ)], [V(0, 0, -1), (a) => V(a * BX, 0, -BZ)], [V(-1, 0, 0), (a) => V(-BX, 0, a * BZ)], [V(1, 0, 0), (a) => V(BX, 0, a * BZ)]];
  for (const [n, tocka] of stenaN) {
    const N = n.z ? 26 : 13;
    for (let i = 0; i < N; i++) {
      const p = tocka(-0.96 + 1.92 * ((i + rnd() * 0.8) / N)), y = -BY + 1 + rnd() * (BY - 2.4);
      p.y = y;
      const r0 = 0.2 + rnd() * 0.1, kv = new THREE.Quaternion().setFromUnitVectors(V(0, 0, 1), n);
      const a = new THREE.CircleGeometry(r0 * (1 + 0.6 * rnd()), q(10)).scale(1, 0.7 + rnd() * 0.6, 1).applyQuaternion(kv); a.translate(p.x + n.x * 0.03, p.y, p.z + n.z * 0.03); odpr.push(a);
      const b = new THREE.CircleGeometry(r0 * 0.55, q(8)).applyQuaternion(kv); b.translate(p.x + n.x * 0.06, p.y, p.z + n.z * 0.06); presekiIz.push(b);
    }
  }
  const odprtine = new THREE.Mesh(zdruzi(odpr), mat(0x2e2014, { roughness: 0.9, clearcoat: 0, sheen: 0 }));
  svet.add(odprtine);

  // ---------- osteociti ----------
  // mandljasto telo: elipsoid, ki se proti koncema zoži
  const telo = (a, b, c) => (d) => {
    const r = 1 / Math.sqrt((d.x / a) ** 2 + (d.y / b) ** 2 + (d.z / c) ** 2), p = d.clone().multiplyScalar(r), t = 1 - 0.38 * (p.x / a) ** 2;
    p.y *= t; p.z *= t;
    return p.multiplyScalar(1 + 0.035 * fbm(p.x * 0.5 + 2, p.y * 0.5, p.z * 0.5));
  };
  function lupinaT(T, ws, hs, rez = true) {
    const geos = rez ? [new THREE.SphereGeometry(1, ws, hs / 2, Math.PI / 2, Math.PI * 1.5, 0, Math.PI / 2), new THREE.SphereGeometry(1, ws, hs / 2, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2)] : [new THREE.SphereGeometry(1, ws, hs)];
    const v = V();
    for (const g of geos) { const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const q2 = T(v.fromBufferAttribute(p, i).normalize()); p.setXYZ(i, q2.x, q2.y, q2.z); } g.computeVertexNormals(); }
    return zdruzi(geos);
  }
  function robT(T, deb, seg) {
    const loki = [(t) => V(0, Math.cos(t * Math.PI / 2), Math.sin(t * Math.PI / 2)), (t) => V(-Math.sin(t * Math.PI / 2), Math.cos(t * Math.PI / 2), 0), (t) => V(-Math.cos(t * Math.PI / 2), 0, Math.sin(t * Math.PI / 2))];
    return zdruzi(loki.map((L) => { const pts = []; for (let i = 0; i <= seg; i++) pts.push(T(L(i / seg).normalize()).multiplyScalar(0.99)); return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg, deb, q(8), false); }));
  }
  const TO = telo(11.4, 2.25, 4.5);
  const celMat = mat(0xbb6a8c, { vertexColors: true, roughness: 0.48, clearcoat: 0.45, clearcoatRoughness: 0.16, sheen: 0.45, sheenColor: new THREE.Color(0xd895b4), sheenRoughness: 0.35, zrnje: ["zrnje", 16, 6, 0.3] });
  const tOut = new THREE.Mesh(lise(lupinaT(TO, q(110), q(56)), { j: 0.16, fr: 0.25, odtenek: 0.05 }), celMat);
  // debela membrana (povečana) in dvojna jedrna ovojnica na ploskvah prereza: trak med zunanjo in notranjo ploskvijo
  const navzn = (T, D) => (d) => { const p = T(d); return p.multiplyScalar(Math.max(0.05, 1 - D / p.length())); };
  function prerezT(Tz, Tn, plasti, seg, pora) {
    const ravnine = [[(t) => V(0, Math.cos(t * Math.PI / 2), Math.sin(t * Math.PI / 2)), V(-1, 0, 0)], [(t) => V(-Math.sin(t * Math.PI / 2), Math.cos(t * Math.PI / 2), 0), V(0, 0, 1)], [(t) => V(-Math.cos(t * Math.PI / 2), 0, Math.sin(t * Math.PI / 2)), V(0, 1, 0)]];
    return zdruziPlasti(ravnine.map(([L, n], k) => { const A = [], B = []; for (let i = 0; i <= seg; i++) { const d = L(i / seg).normalize(); A.push(Tn(d).addScaledVector(n, 0.01)); B.push(Tz(d).multiplyScalar(0.999).addScaledVector(n, 0.01)); } return trakPlasti(A, B, n, plasti, pora && ((t) => pora(t, k))); }));
  }
  const TM = 0.3, TJO = 0.24;
  const tRob = new THREE.Mesh(prerezT(TO, navzn(TO, TM), DVOSLOJ(0xd88aa2), q(110)), matPlasti({ roughness: 0.55, clearcoat: 0.25 }));
  const tIn = new THREE.Mesh(lise(lupinaT(navzn(TO, TM), q(80), q(40)), { j: 0.2, fr: 0.3, odtenek: 0.05 }), mat(0xa87868, { vertexColors: true, roughness: 0.72, clearcoat: 0.12, sheen: 0.25, sheenColor: new THREE.Color(0x8a5e50), side: THREE.BackSide, zrnje: ["zrnje", 12, 5, 0.4] }));
  const telesa = new THREE.Group(); telesa.position.set(0, -0.35, 0); telesa.add(tOut, tRob, tIn); svet.add(telesa);
  // jedro
  const JC = V(1.2, 0.0, 0.2);
  const TJ = (d) => telo(4.6, 1.45, 2.6)(d);
  const jedro = new THREE.Mesh(lupinaT(TJ, q(64), q(36)), mat(0x6654c4, { roughness: 0.45, clearcoat: 0.4, sheen: 0.4, sheenColor: new THREE.Color(0xa898f0), zrnje: ["gube", 5, 3, 0.4] }));
  const jRob = new THREE.Mesh(prerezT(TJ, navzn(TJ, TJO), DVOJNA(0x5a48c0, 0xcfc4f7), q(80), porePrereza(6, 0xb9a8ff)), matPlasti({ roughness: 0.58, clearcoat: 0.2 }));
  const jIn = new THREE.Mesh(lupinaT(navzn(TJ, TJO), q(48), q(28)), mat(0x7c6ad0, { roughness: 0.65, clearcoat: 0.2, side: THREE.BackSide, zrnje: ["gube", 6, 3, 0.45] }));
  const jedrce = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, hi ? 3 : 2), mat(0x2a1e78, { roughness: 0.6, clearcoat: 0.3 }));
  jedrce.position.set(-0.9, 0.2, 0.5);
  for (const m of [jedro, jRob, jIn, jedrce]) { m.position.add(JC); telesa.add(m); }
  // sosednja osteocita (deloma zunaj kosa, odrezana ob steni)
  const sosG = [];
  for (const n of [1, 2]) {
    const L = lakune[n], T = telo(L.a * 0.9, L.D * 0.85, L.b * 0.88), g = lupinaT(T, q(64), q(32), false);
    g.rotateY(-L.f); g.translate(L.c[0], -0.3, L.c[1]);
    deformiraj(g, (v) => { v.x = THREE.MathUtils.clamp(v.x, -BX + 0.05, BX - 0.05); v.z = THREE.MathUtils.clamp(v.z, -BZ + 0.05, BZ - 0.05); });
    sosG.push(g);
  }
  const sosedi = new THREE.Mesh(zdruzi(sosG), mat(0xb06486, { roughness: 0.5, clearcoat: 0.42, clearcoatRoughness: 0.16, sheen: 0.45, sheenColor: new THREE.Color(0xd090ac), zrnje: ["zrnje", 16, 6, 0.3] }));
  svet.add(sosedi);
  // izrastki v kanalikulih
  const izG = [];
  krivulje.forEach((k, i) => {
    const t = k.getSpacedPoints(Math.max(6, Math.round(k.getLength() / 0.8))).map((p) => V(p.x, visina(p.x, p.z)[0] + 0.24, p.z));
    const p = poti[i];
    if (p.od === 0) { const z = t[0]; t.unshift(V(z.x * 0.88, -0.6, z.z * 0.88)); }
    else if (p.od > 0) { const z = t[0], L = lakune[p.od]; t.unshift(V(L.c[0] + (z.x - L.c[0]) * 0.85, -0.6, L.c[1] + (z.z - L.c[1]) * 0.85)); }
    if (p.cilj) { const z = t[t.length - 1]; t.push(V(z.x, -0.5, z.z)); }
    izG.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(t), q(Math.max(12, t.length * 3)), 0.24, q(6), false));
  });
  const izrastki = new THREE.Mesh(zdruzi(izG.concat(presekiIz)), mat(0xcc7c9c, { roughness: 0.48, clearcoat: 0.45, clearcoatRoughness: 0.16, sheen: 0.45, sheenColor: new THREE.Color(0xf0b0c8) }));
  svet.add(izrastki);

  const s = umeri(svet, 0.985);
  const L = (x, y, z) => V(x, y, z).applyEuler(svet.rotation).multiplyScalar(s).add(svet.position).toArray();
  const kp = krivulje.map((k, i) => ({ k, p: poti[i] })).filter((x) => x.p.od === 0).reduce((a, b) => { const e = b.k.getPoint(0.55); return e.z - e.x * 0.3 > a.e.z - a.e.x * 0.3 ? { e } : a; }, { e: V(0, 0, -99) }).e;
  const zg = (x, z) => visina(x, z)[0];

  del("medcelicnina", "Kostna medceličnina", "Trda snov okoli celic iz kolagenskih vlaken in kristalov kalcijevega fosfata; razporejena je v tanke plasti (lamele).", "#e9dcc0", [medcel], L(-14, zg(-14, 9) + 0.05, 9));
  del("lakuna", "Lakuna", "Votlinica v kostni medceličnini, v kateri leži telo osteocita; okoli celice je tanka plast tekočine.", "#c9ad84", [lakuna], L(-1, zg(-1, -4.6) + 0.1, -4.6));
  del("kanalikuli", "Kanalikuli", "Drobni kanalčki, ki povezujejo lakune; po tekočini v njih potujejo hranila, kisik in signali.", "#8a6a48", [kanal, odprtine], L(kp.x + 0.6, zg(kp.x + 0.6, kp.z), kp.z));
  del("osteocit", "Osteocit (telo celice)", "Zrela kostna celica, ujeta v medceličnino; zaznava obremenitev kosti in uravnava njeno obnavljanje. Debelina membrane je povečana.", "#d88aa2", [tOut, tRob], L(4, 2.0, 2.6));
  del("citoplazma", "Citoplazma", "Notranjost osteocita z malo organeli, saj celica le še vzdržuje kost.", "#f1c9b6", [tIn], L(-5.5, -0.9, 1.6));
  del("jedro", "Jedro", "Sploščeno jedro z DNK in dvojno ovojnico s porami; zavzema velik del telesa osteocita.", "#7a68d8", [jedro, jRob, jedrce], L(JC.x - 1.6, JC.y + 0.2, JC.z + 1.2));
  del("izrastki", "Izrastki (dendriti)", "Okoli 50 tankih izrastkov iz vsake celice teče po kanalikulih; s sosednjimi se dotikajo v presledkovnih stikih, skozi katere prehajajo snovi.", "#e596b0", [izrastki], (() => { const k = krivulje[poti.findIndex((p) => p.od === 0 && p.t[0][1] > 3)] || krivulje[0]; const e = k.getPoint(0.2); return L(e.x, zg(e.x, e.z) + 0.4, e.z); })());
  del("sosednji-osteociti", "Sosednja osteocita", "Osteocita v sosednjih lakunah; vse celice so povezane v mrežo, ki prepreda celo kost.", "#c77f98", [sosedi], L(-20.5, 1.4, -6));

  const premer = 2 / s; // µm na premer enotske krogle
  return {
    group,
    pogled: [-0.47, 0.34, 0.81], // smer kamere: yaw −30°, pitch 20° (odrezani del proti gledalcu)
    deli,
    merilo: { m: premer * 1e-6, oznaka: oznaka(premer) },
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
