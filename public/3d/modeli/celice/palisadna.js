// Palisadna celica lista v prerezu: stebričasta celica s steno, tanko plastjo citoplazme ob steni,
// veliko vakuolo in množico kloroplastov; za njo dve sosednji palisadni celici.
// Pogodba graditelja: docs/3d.md. Brez uvozov; THREE pride od kompleta.

export const info = {
  id: "celica-palisadna",
  naslov: "Palisadna celica",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Stebričasta celica pod zgornjo povrhnjico lista, polna kloroplastov, kjer poteka največ fotosinteze. Sprednja polovica celice je odrezana, da se vidita vakuola in kloroplasti ob steni.",
  poskusi: "Tapni kloroplast in poišči, kje v celici so kloroplasti razporejeni.",
  merilo: { m: 100e-6, oznaka: "100 µm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const gib = ctx.gibanje !== false;
  const group = new THREE.Group();
  const deli = [];
  const odpad = [];
  let seme = 11;
  // ---------- orodja (enaka kot v zivalska.js, z dodatki za ploskve in prereze) ----------
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
  const gladko = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
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
      const tu = g.attributes.uv, p = g.attributes.position, n = g.attributes.normal, gc = g.attributes.color;
      const c = barve && barve[i] != null ? new THREE.Color(barve[i]) : null;
      for (let k = 0; k < p.count; k++) {
        pos.push(p.getX(k), p.getY(k), p.getZ(k));
        nor.push(n.getX(k), n.getY(k), n.getZ(k));
        if (tu) uv.push(tu.getX(k), tu.getY(k)); else { const x = p.getX(k), y = p.getY(k), zz = p.getZ(k); uv.push(0.5 + Math.atan2(zz, x) / (2 * Math.PI), 0.5 + Math.asin(Math.max(-1, Math.min(1, y / (Math.hypot(x, y, zz) || 1)))) / Math.PI); }
        if (c) col.push(c.r, c.g, c.b);
        else if (barve) { if (gc) col.push(gc.getX(k), gc.getY(k), gc.getZ(k)); else col.push(1, 1, 1); }
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
    deli.push({ id, ime, opis, barva, meshes, tocka: tocka.map((x) => Math.round(x * 1000) / 1000) });
  }
  // Ploskev iz parametrov: P(u, v, izhod) za več krp [u0, u1, nu, v0, v1, nv] v eni geometriji.
  // Normale računa numerično iz P, zato se krpe zlepijo brez šivov; geo.userData.osvezi(P) premakne oglišča.
  function ploskev(P, krpe, obrni = false) {
    const pos = [], idx = [], uv = [];
    let off = 0;
    for (const [u0, u1, nu, v0, v1, nv] of krpe) {
      for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) uv.push(u0 + (u1 - u0) * i / nu, v0 + (v1 - v0) * j / nv);
      for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
        const a = off + i * (nv + 1) + j, b = a + nv + 1, c = b + 1, d = a + 1;
        if (obrni) idx.push(a, d, b, b, d, c); else idx.push(a, b, d, b, c, d);
      }
      off += (nu + 1) * (nv + 1);
    }
    const n = uv.length / 2;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(new Float32Array(n * 3), 3));
    g.setIndex(idx);
    const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3(), D = new THREE.Vector3(), E = new THREE.Vector3(), N = new THREE.Vector3();
    g.userData.uv = uv;
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.userData.osvezi = (Pf) => {
      const p = g.attributes.position.array, no = g.attributes.normal.array, e = 1e-3;
      for (let k = 0; k < n; k++) {
        const u = uv[2 * k], v = uv[2 * k + 1];
        Pf(u, v, A);
        p[3 * k] = A.x; p[3 * k + 1] = A.y; p[3 * k + 2] = A.z;
        Pf(u + e, v, B); Pf(u - e, v, C); B.sub(C);
        Pf(u, v + e, C); Pf(u, v - e, D); C.sub(D);
        N.crossVectors(B, C);
        for (let t = 0, eu = e; t < 4 && N.lengthSq() < 1e-14; t++) {
          // izrojena točka (pol, konica): smer v vzemi na sosednjih krogih
          eu *= 6;
          Pf(u + eu, v, B); Pf(u - eu, v, C); B.sub(C);
          Pf(u + eu, v + e, C); Pf(u + eu, v - e, D); C.sub(D);
          Pf(u - eu, v + e, D); Pf(u - eu, v - e, E); D.sub(E); C.add(D);
          N.crossVectors(B, C);
        }
        if (N.lengthSq() < 1e-16) N.copy(A).normalize();
        N.normalize();
        if (obrni) N.negate();
        no[3 * k] = N.x; no[3 * k + 1] = N.y; no[3 * k + 2] = N.z;
      }
      g.attributes.position.needsUpdate = true;
      g.attributes.normal.needsUpdate = true;
      g.computeBoundingSphere();
    };
    g.userData.osvezi(P);
    return g;
  }
  // Odstrani trikotnike, katerih središče izpolni pogoj f(Vector3) (npr. odprtina, kjer se ploskvi stikata).
  function izrezi(g, f) {
    const p = g.attributes.position, ix = g.index.array, ost = [], c = new THREE.Vector3(), t = new THREE.Vector3();
    for (let i = 0; i < ix.length; i += 3) {
      c.set(0, 0, 0);
      for (let k = 0; k < 3; k++) c.add(t.fromBufferAttribute(p, ix[i + k]));
      if (!f(c.multiplyScalar(1 / 3))) ost.push(ix[i], ix[i + 1], ix[i + 2]);
    }
    g.setIndex(ost);
    return g;
  }
  // Barve oglišč iz funkcije položaja (x, y, z, u, v) -> THREE.Color.
  function pobarvaj(g, f) {
    const p = g.attributes.position, uv = g.userData.uv || [];
    const col = new Float32Array(p.count * 3), c = new THREE.Color();
    for (let k = 0; k < p.count; k++) {
      f(p.getX(k), p.getY(k), p.getZ(k), uv[2 * k], uv[2 * k + 1], c);
      col[3 * k] = c.r; col[3 * k + 1] = c.g; col[3 * k + 2] = c.b;
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    return g;
  }
  // Trak med dvema nizoma točk (enako dolgima): ploskev prereza med dvema plastema.
  function pas(A, B) {
    const pos = [], idx = [];
    for (let i = 0; i < A.length; i++) pos.push(A[i].x, A[i].y, A[i].z, B[i].x, B[i].y, B[i].z);
    for (let i = 0; i < A.length - 1; i++) { const a = 2 * i; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  // Cev vzdolž točk.
  const cev = (pts, r, seg, rad, zaprta = false) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, zaprta), seg, r, rad, zaprta);
  // Premakni oglišča s funkcijo f(v: Vector3) (spremeni v na mestu) in preračunaj normale.
  function preoblikuj(g, f) {
    const p = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); f(v, i); p.setXYZ(i, v.x, v.y, v.z); }
    g.computeVertexNormals();
    return g;
  }
  const o = new THREE.Object3D();
  // InstancedMesh iz seznama {p, r (Euler ali Quaternion), s (število ali Vector3)}.
  function instance(geo, material, sez) {
    const m = new THREE.InstancedMesh(geo, material, Math.max(1, sez.length));
    m.count = sez.length;
    postaviInstance(m, sez);
    return m;
  }
  function postaviInstance(m, sez) {
    sez.forEach((x, i) => {
      o.position.copy(x.p);
      if (x.r && x.r.isQuaternion) o.quaternion.copy(x.r); else if (x.r) o.rotation.copy(x.r); else o.rotation.set(0, 0, 0);
      if (x.s == null) o.scale.setScalar(1); else if (typeof x.s === "number") o.scale.setScalar(x.s); else o.scale.copy(x.s);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere && m.computeBoundingSphere();
  }
  // Odrezan osmi del: x < 0, y > 0, z > 0 (proti gledalcu levo zgoraj).
  const vIzrezu = (v, c = { x: 0, y: 0, z: 0 }) => v.x < c.x && v.y > c.y && v.z > c.z;

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


  // ---------- oblika: zaobljen steber (vrtenina), plasti z odmikom navznoter ----------
  // 1 enota = 50 µm: celica je visoka 90 µm in široka 22 µm.
  const A = 0.22, H = 0.9, E = 4;
  const TAU = Math.PI * 2, F0 = Math.PI / 3, F1 = F0 + Math.PI; // ostane polovica φ ∈ [π/3, 4π/3], odrezana je polovica proti gledalcu
  function profil(u, izhod) {
    const t = Math.min(1, Math.max(0, u)) * Math.PI, s = Math.sin(t), c = Math.cos(t);
    izhod[0] = A * Math.pow(Math.abs(s), 2 / E);
    izhod[1] = -H * Math.sign(c) * Math.pow(Math.abs(c), 2 / E);
    return izhod;
  }
  const p1 = [0, 0], p2 = [0, 0];
  // Točka plasti: u po profilu, φ okoli osi, d = odmik od zunanje stene navznoter.
  function plast(u, phi, d, out, sosed = 0) {
    profil(u, p1); profil(u + 0.002, p2);
    let tr = p2[0] - p1[0], ty = p2[1] - p1[1];
    if (u >= 0.998) { profil(u - 0.002, p2); tr = p1[0] - p2[0]; ty = p1[1] - p2[1]; }
    const L = Math.hypot(tr, ty) || 1;
    const nr = ty / L, ny = -tr / L;
    const sx = Math.sin(phi), cz = Math.cos(phi);
    const w = 0.011 * fbm(sx * 2.4 + sosed * 7, p1[1] * 2.6 + sosed * 3, cz * 2.4) + 0.006 * Math.cos(6 * phi + sosed) * (p1[0] / A);
    const r = Math.max(0, p1[0] + (w - d) * nr), y = p1[1] + (w - d) * ny;
    return out.set(r * sx, y, r * cz);
  }
  const P = (d, sosed = 0) => (u, v, out) => plast(u, v, d, out, sosed);
  const D_STENA = 0.024, D_MEM = 0.03, D_CIT = 0.032, D_VAK = 0.072;
  const NU = q(110), NV = q(84);
  const krpaOdprta = [0, 1, NU, F0, F1, Math.round(NV * 0.5)];
  const krpaPokrov = [0, 1, NU, F1, F0 + TAU, Math.round(NV * 0.5)];
  const robTocke = (d, phi, n = q(90)) => { const r = []; for (let i = 0; i <= n; i++) r.push(plast(i / n, phi, d, new THREE.Vector3())); return r; };

  // ---------- celična stena ----------
  const stenaMat = mat(0xa39350, { roughness: 0.62, clearcoat: 0.28, clearcoatRoughness: 0.25, sheen: 0.4, sheenColor: new THREE.Color(0xc8d098), zrnje: ["vlakna", 12, 1.5, 0.4] });
  const stena = new THREE.Mesh(ploskev(P(0), [krpaOdprta], true), stenaMat);
  const stenaPokrov = new THREE.Mesh(ploskev(P(0), [krpaPokrov], true), stenaMat);
  stenaPokrov.visible = false;
  // plasti na prerezu: trak med notranjo (A) in zunanjo (B) krivuljo; normala iz same ploskve
  const trakMed = (A, B, plasti) => { const m = Math.floor(A.length / 2); return trakPlasti(A, B, new THREE.Vector3().subVectors(A[m + 1], A[m - 1]).cross(new THREE.Vector3().subVectors(B[m], A[m])).normalize(), plasti); };
  const stenaPrerez = new THREE.Mesh(zdruziPlasti([F0, F1].map((F) => trakMed(robTocke(D_STENA, F), robTocke(0, F), STENA(0xa39350)))), matPlasti({ roughness: 0.62, clearcoat: 0.25 }));
  group.add(stena, stenaPokrov, stenaPrerez);
  const T = (u, phi, d) => plast(u, phi, d, new THREE.Vector3()).toArray();
  del("stena", "Celična stena", "Trdna ovojnica iz celuloze zunaj membrane; celico ščiti in ji daje stalno stebričasto obliko.", "#b8a86a",
    [stena, stenaPokrov, stenaPrerez], T(0.62, F0 + 0.04, 0.002));

  // ---------- celična membrana (vidna na prerezu kot rožnata črta) ----------
  const memMat = mat(0xd88aa2, { roughness: 0.32, clearcoat: 1, side: THREE.DoubleSide });
  const membrana = new THREE.Mesh(zdruziPlasti([F0, F1].map((F) => trakMed(robTocke(D_MEM, F), robTocke(D_STENA, F), DVOSLOJ(0xd88aa2)))), matPlasti({ roughness: 0.55, clearcoat: 0.25 }));
  group.add(membrana);
  del("membrana", "Celična membrana", "Tanka prožna meja tik ob steni iz dvosloja maščob; odloča, katere snovi vstopijo v celico in katere jo zapustijo. Debelina membrane je povečana.", "#d88aa2",
    [membrana], T(0.7, F1, (D_STENA + D_MEM) / 2));

  // ---------- citoplazma: tanka plast ob steni ----------
  const citMat = mat(0x9c9468, { roughness: 0.72, clearcoat: 0.12, sheen: 0.25, sheenColor: new THREE.Color(0x8a8458), side: THREE.BackSide, zrnje: ["zrnje", 14, 2, 0.4] });
  const citoplazma = new THREE.Mesh(ploskev(P(D_CIT), [[0, 1, q(90), F0, F1, q(44)]], true), citMat);
  const citPrerez = new THREE.Mesh(zdruzi([
    pas(robTocke(D_MEM, F0), robTocke(D_VAK, F0)), pas(robTocke(D_MEM, F1), robTocke(D_VAK, F1)),
  ]), mat(0xc4b886, { roughness: 0.75, clearcoat: 0.15, side: THREE.DoubleSide }));
  group.add(citoplazma, citPrerez);
  del("citoplazma", "Citoplazma", "Tanka plast žive snovi ob steni, saj večino celice zavzema vakuola; v njej se počasi pretakajo kloroplasti.", "#e4dcae",
    [citoplazma, citPrerez], T(0.3, 0, (D_MEM + D_VAK) / 2));

  // ---------- velika vakuola ----------
  const vakMat = mat(0x86d8ee, { roughness: 0.15, clearcoat: 1, transparent: true, opacity: 0.34, depthWrite: false, side: THREE.BackSide });
  const vakuola = new THREE.Mesh(ploskev(P(D_VAK), [[0, 1, q(80), F0, F1, q(40)]], true), vakMat);
  vakuola.renderOrder = 2;
  const vakRob = new THREE.Mesh(zdruzi([cev(robTocke(D_VAK, F0, 60), 0.0045, q(80), q(6)), cev(robTocke(D_VAK, F1, 60), 0.0045, q(80), q(6))]),
    mat(0x5cb8d4, { roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.1, sheen: 0.3 }));
  group.add(vakuola, vakRob);
  del("vakuola", "Vakuola", "Velik mehur s celičnim sokom, ki zavzema večino celice; z vodo pritiska na steno in celico napenja.", "#9fe3f0",
    [vakuola, vakRob], T(0.5, Math.PI * 0.9, D_VAK + 0.004));

  // ---------- jedro (ob steni, izboči se v vakuolo) ----------
  const fiJ = Math.PI * 0.78, uJ = 0.6;
  const J = plast(uJ, fiJ, 0.085, new THREE.Vector3());
  const RJ = 0.068;
  const oblJ = (d) => RJ * (1 + 0.05 * sum(d.x * 2.5 + 4, d.y * 2.5, d.z * 2.5));
  const jl = lupina(oblJ, q(56), q(36));
  const jMat = mat(0x6654c4, { roughness: 0.45, clearcoat: 0.4, sheen: 0.4, sheenColor: new THREE.Color(0xa898f0), zrnje: ["gube", 4, 2, 0.4] });
  const jOut = new THREE.Mesh(jl.odprta, jMat);
  const jIn = new THREE.Mesh(jl.odprta.clone().scale(0.88, 0.88, 0.88), mat(0x7c6ad0, { roughness: 0.65, clearcoat: 0.2, side: THREE.BackSide, zrnje: ["gube", 4, 2, 0.45] }));
  const jRob = new THREE.Mesh(prerezLupine((d) => oblJ(d) * 0.999, (d) => oblJ(d) * 0.88, DVOJNA(0x5a48c0, 0xcfc4f7), q(60), { pora: porePrereza(5, 0xb9a8ff), zamik: 0.0005 }), matPlasti({ roughness: 0.58, clearcoat: 0.2 }));
  const jPokrov = new THREE.Mesh(jl.pokrov, jMat);
  jPokrov.visible = false;
  const jedrce = new THREE.Mesh(preoblikuj(new THREE.IcosahedronGeometry(0.024, hi ? 4 : 2), (v) => v.multiplyScalar(1 + 0.12 * fbm(v.x * 60, v.y * 60, v.z * 60))),
    mat(0x2a1e78, { roughness: 0.6, clearcoat: 0.3 }));
  jedrce.position.set(-0.018, 0.012, 0.016);
  const jedro = new THREE.Group();
  jedro.add(jOut, jIn, jRob, jPokrov, jedrce);
  jedro.position.copy(J);
  jedro.scale.set(1, 1.15, 1);
  group.add(jedro);
  del("jedro", "Jedro", "Hrani DNK z navodili za delovanje celice; obdaja ga dvojna ovojnica s porami. V rastlinski celici ga vakuola pogosto potisne ob steno.", "#7a68d8",
    [jOut, jRob, jPokrov], [J.x + 0.01, J.y + 0.07, J.z + 0.04]);
  del("jedrce", "Jedrce", "Gosto območje v jedru, kjer nastajajo deli ribosomov.", "#34268a", [jedrce], [J.x - 0.018, J.y + 0.014, J.z + 0.016]);

  // ---------- kloroplasti: lečasti, z nakazanimi grani ----------
  // grana: temnejše pege (kupčki tilakoid) na obeh ploskvah leče
  const grana = [];
  for (let i = 0; i < 9; i++) for (const zn of [1, -1]) {
    const r = Math.sqrt((i + 0.5) / 9) * 0.78, f = i * 2.39996;
    grana.push(new THREE.Vector3(r * Math.cos(f), zn * Math.sqrt(1 - r * r), r * Math.sin(f)));
  }
  function kloroplastGeo(detail) {
    const g = new THREE.IcosahedronGeometry(1, detail);
    const p = g.attributes.position, col = [], c = new THREE.Color(), v = new THREE.Vector3();
    const svetla = new THREE.Color(0x4fa83a), temna = new THREE.Color(0x1b5a26);
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      const dd = Math.min(...grana.map((G) => G.distanceTo(v)));
      c.copy(svetla).lerp(temna, (1 - gladko(0.13, 0.27, dd)) * 0.8);
      col.push(c.r, c.g, c.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    g.scale(0.037, 0.017, 0.052);
    return g;
  }
  const kloMat = mat(0xffffff, { vertexColors: true, roughness: 0.45, clearcoat: 0.55, clearcoatRoughness: 0.15, sheen: 0.4, sheenColor: new THREE.Color(0x9adf80) });
  const N_KLO = hi ? 200 : 160;
  const klo = [];
  const vT = new THREE.Vector3(), vN = new THREE.Vector3(), vU = new THREE.Vector3(), vA = new THREE.Vector3(), vB = new THREE.Vector3();
  let poskusi = 0;
  while (klo.length < N_KLO && poskusi++ < 20000) {
    // enakomerno po površini: na plašču u ∈ (0,1; 0,9), malo tudi na zaobljenih koncih
    const u = 0.045 + rnd() * 0.91, phi = rnd() * TAU;
    const p = plast(u, phi, 0.047, new THREE.Vector3());
    if (klo.some((k) => k.p0.distanceToSquared(p) < 0.066 * 0.066)) continue;
    klo.push({ u, phi, p0: p, zas: rnd() * TAU, w: 0.1 + rnd() * 0.05, s: 0.85 + rnd() * 0.3 });
  }
  const kloroplasti = new THREE.InstancedMesh(kloroplastGeo(hi ? 2 : 1), kloMat, klo.length);
  let celaPrikaz = false;
  const Q = new THREE.Quaternion(), M4 = new THREE.Matrix4();
  function postaviKlo(t) {
    klo.forEach((k, i) => {
      const phi = (((k.phi + k.w * t) % TAU) + TAU) % TAU;
      plast(k.u, phi, 0.047, vA);
      // lokalni koordinatni sistem: y = normala stene (proti osi), z = po plašču navzgor
      plast(k.u, phi, 0.06, vB); vN.subVectors(vB, vA).normalize();
      plast(Math.min(1, k.u + 0.01), phi, 0.047, vU); vU.sub(vA).normalize();
      vT.crossVectors(vN, vU).normalize(); vU.crossVectors(vT, vN);
      M4.makeBasis(vT, vN, vU); Q.setFromRotationMatrix(M4);
      Q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.sin(k.zas) * 0.6));
      // ob robu izreza se kloroplast skrči in izgine (v resnici ga prereže rez)
      const fr = (((phi - F0) % TAU) + TAU) % TAU;
      const sk = celaPrikaz ? 1 : gladko(0, 0.16, fr) * gladko(0, 0.16, Math.PI - fr) * (fr < Math.PI ? 1 : 0);
      o.position.copy(vA); o.quaternion.copy(Q); o.scale.setScalar(k.s * Math.max(sk, 0.0001)); o.updateMatrix();
      kloroplasti.setMatrixAt(i, o.matrix);
    });
    kloroplasti.instanceMatrix.needsUpdate = true;
  }
  postaviKlo(0);
  kloroplasti.computeBoundingSphere();
  group.add(kloroplasti);
  // kloroplasti, prerezani na ploskvi reza: ploščate elipse z grani v vrsti
  function prerezKloGeo() {
    const g = new THREE.PlaneGeometry(2, 2, 14, 6);
    const p = g.attributes.position, col = [], c = new THREE.Color(), svetla = new THREE.Color(0x6cbf4a), temna = new THREE.Color(0x1f6a2c);
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i);
      p.setXY(i, x * Math.sqrt(1 - (y * y) / 2), y * Math.sqrt(1 - (x * x) / 2));
      const gr = Math.abs(x * 3 - Math.round(x * 3)) < 0.22 && Math.abs(y) < 0.55 && Math.abs(x) < 0.8;
      c.copy(gr ? temna : svetla); col.push(c.r, c.g, c.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    g.scale(0.048, 0.015, 1);
    return g;
  }
  const kloPrerezSez = [];
  for (const [phi, zn] of [[F0, -1], [F1, 1]]) {
    for (let u = 0.07 + rnd() * 0.03; u < 0.93; u += 0.032 + rnd() * 0.03) {
      if (Math.abs(u - uJ) < 0.06 && phi === F1) continue;
      const pA = plast(u, phi, 0.05, new THREE.Vector3()), pB = plast(u + 0.01, phi, 0.05, new THREE.Vector3());
      const nor = new THREE.Vector3(Math.cos(phi) * zn, 0, -Math.sin(phi) * zn); // normala ploskve reza (proti gledalcu)
      const tan = pB.sub(pA).normalize(), b = new THREE.Vector3().crossVectors(nor, tan);
      const r = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(tan, b, nor));
      kloPrerezSez.push({ p: pA.add(nor.clone().multiplyScalar(0.0012)), r, s: new THREE.Vector3(0.85 + rnd() * 0.3, 1, 1) });
    }
  }
  const kloPrerez = instance(prerezKloGeo(), mat(0xffffff, { vertexColors: true, roughness: 0.55, clearcoat: 0.35, side: THREE.DoubleSide }), kloPrerezSez);
  group.add(kloPrerez);

  const kT = klo.reduce((b, k) => (Math.abs(k.phi - Math.PI) + Math.abs(k.u - 0.4) < Math.abs(b.phi - Math.PI) + Math.abs(b.u - 0.4) ? k : b), klo[0]);
  del("kloroplast", "Kloroplast", "Zeleni organel s klorofilom, v katerem poteka fotosinteza; temne pege so grana, kupčki membran, ki lovijo svetlobo.", "#5cbf4a",
    [kloroplasti, kloPrerez], kT.p0.toArray());

  // ---------- mitohondriji (manjši, med kloroplasti) ----------
  const mitGeo = preoblikuj(new THREE.CapsuleGeometry(0.009, 0.022, q(4), q(10)), (v) => { v.x += 9 * v.y * v.y + 0.0012 * Math.sin(v.y * 260); v.z *= 0.85; }); // rahlo upognjen, ne popoln valj
  const mitSez = [];
  for (let i = 0; i < (hi ? 30 : 20); i++) {
    const u = 0.1 + rnd() * 0.8, phi = F0 + 0.15 + rnd() * (Math.PI - 0.3);
    mitSez.push({ p: plast(u, phi, 0.036, new THREE.Vector3()), r: new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3) });
  }
  const mitohondriji = instance(mitGeo, mat(0xd8642c, { roughness: 0.5, clearcoat: 0.45, sheen: 0.4, zrnje: ["gube", 2, 2, 0.5] }), mitSez);
  group.add(mitohondriji);
  del("mitohondrij", "Mitohondrij", "Elektrarna celice: pri celičnem dihanju sprošča energijo iz sladkorja, ki ga izdelajo kloroplasti.", "#e8743b",
    [mitohondriji], mitSez.reduce((b, m) => (m.p.distanceTo(new THREE.Vector3(0.1, -0.25, -0.2)) < b.distanceTo(new THREE.Vector3(0.1, -0.25, -0.2)) ? m.p : b), mitSez[0].p).toArray());

  // ---------- sosednji palisadni celici (za celico) ----------
  const sosedje = [[0.4, -0.19, -0.03], [-0.04, -0.445, 0.035]]; // [x, z, y-zamik]
  const sosGeo = [], sosKlo = [];
  sosedje.forEach(([sx, sz, sy], n) => {
    const g = ploskev(P(0, n + 1), [[0, 1, q(70), 0, TAU, q(48)]], true);
    g.scale(0.97, 0.96, 0.97); g.translate(sx, sy, sz);
    sosGeo.push(g);
    let k = 0, pk = 0;
    while (k < (hi ? 110 : 70) && pk++ < 4000) {
      const u = 0.05 + rnd() * 0.9, phi = rnd() * TAU;
      const p = plast(u, phi, 0.045, new THREE.Vector3(), n + 1).multiply(new THREE.Vector3(0.97, 0.96, 0.97)).add(new THREE.Vector3(sx, sy, sz));
      if (sosKlo.some((s) => s.p.distanceToSquared(p) < 0.07 * 0.07)) continue;
      const nn = p.clone().sub(new THREE.Vector3(sx, p.y, sz)).normalize();
      sosKlo.push({ p, r: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), nn), s: 0.9 + rnd() * 0.2 });
      k++;
    }
  });
  const sosMat = mat(0x8e8a52, { roughness: 0.45, clearcoat: 0.5, clearcoatRoughness: 0.2, transparent: true, opacity: 0.42, depthWrite: false, sheen: 0.5, sheenColor: new THREE.Color(0xc8cc90), zrnje: ["vlakna", 12, 1.5, 0.35], sheenRoughness: 0.4 });
  const sosStena = new THREE.Mesh(zdruzi(sosGeo), sosMat);
  sosStena.renderOrder = 3;
  const sosKloroplasti = instance(kloroplastGeo(1), mat(0xffffff, { vertexColors: true, roughness: 0.45, clearcoat: 0.5, sheen: 0.35, sheenColor: new THREE.Color(0x9adf80) }), sosKlo);
  group.add(sosStena, sosKloroplasti);
  del("sosednje-celice", "Sosednji palisadni celici", "Palisadne celice stojijo tesno ena ob drugi kot kole v ograji; med njimi so ozki medcelični prostori z zrakom.", "#b5b07a",
    [sosStena, sosKloroplasti], [sosedje[0][0] + 0.17, 0.35, sosedje[0][1] + 0.08]);

  // celica naj bo v sredini okvira skupaj s sosedama
  const ZAMIK = new THREE.Vector3(-0.1, 0, 0.1);
  group.children.forEach((c) => c.position.add(ZAMIK));
  deli.forEach((d) => { d.tocka = d.tocka.map((x, i) => Math.round((x + ZAMIK.getComponent(i)) * 1000) / 1000); });

  // ---------- nadzor ----------
  const nadzor = [
    {
      tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cela", "Cela celica"]], vrednost: "prerez",
      ob: (v) => {
        celaPrikaz = v === "cela";
        stenaPokrov.visible = celaPrikaz; jPokrov.visible = celaPrikaz;
        for (const m of [stenaPrerez, membrana, citPrerez, vakRob, jRob, kloPrerez]) m.visible = !celaPrikaz;
        postaviKlo(zadnjiT);
      },
    },
  ];
  let zadnjiT = 0;
  if (ctx.zacetek && ctx.zacetek.prikaz) { nadzor[0].vrednost = ctx.zacetek.prikaz; nadzor[0].ob(ctx.zacetek.prikaz); }

  return {
    group,
    pogled: [-0.5, 0.5, 0.71], // smer kamere: yaw −35°, pitch 30° – viden je tudi vrh stebričaste celice
    // seznam delov kaže le dele, ki so v trenutnem prikazu vidni
    get deli() { return deli.filter((d) => d.meshes.some((m) => { for (let o = m; o; o = o.parent) if (!o.visible) return false; return true; })); },
    nadzor,
    korak(t) {
      if (!gib) return;
      zadnjiT = t;
      postaviKlo(t); // kroženje citoplazme (cikloza) nosi kloroplaste ob steni
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
      odpadT.forEach((t) => t.dispose());
    },
  };
}
