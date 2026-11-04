// Ksilem in floem: vzdolžni prerez koščka žilnega snopa (traheje, traheide, sitaste cevi, celice spremljevalke).
// Pogodba graditelja: docs/3d.md. Brez uvozov; THREE pride od kompleta.

export const info = {
  id: "celica-ksilem-floem",
  naslov: "Ksilem in floem",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Košček žilnega snopa v vzdolžnem prerezu: po mrtvih celicah ksilema se pretakata voda in mineralne snovi navzgor, po živih sitastih ceveh floema pa sladkorji iz listov v druge dele rastline. Pri dvokaličnicah je med njima kambij, plast celic, ki se delijo. Celice so prikazane skrajšane; v resnici so dolge od desetink milimetra do več milimetrov.",
  merilo: { m: 300e-6, oznaka: "300 µm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const gib = ctx.gibanje !== false;
  const group = new THREE.Group();
  const deli = [];
  const odpad = [];
  let seme = 41;
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
  function mat(barva, o = {}) {
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: barva, roughness: 0.4, clearcoat: 0.8, clearcoatRoughness: 0.3,
      sheen: 0.5, sheenColor: new THREE.Color(0xffffff), sheenRoughness: 0.5,
    }, o));
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
    const pos = [], nor = [], col = [], idx = [];
    let off = 0;
    geos.forEach((g, i) => {
      const p = g.attributes.position, n = g.attributes.normal, gc = g.attributes.color;
      const c = barve && barve[i] != null ? new THREE.Color(barve[i]) : null;
      for (let k = 0; k < p.count; k++) {
        pos.push(p.getX(k), p.getY(k), p.getZ(k));
        nor.push(n.getX(k), n.getY(k), n.getZ(k));
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
    if (barve) out.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    out.setIndex(idx);
    return out;
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

  // 1 enota = 150 µm. Celice stojijo v vrsti vzdolž osi x; prerez z = 0 odreže sprednjo polovico (z > 0).
  const Y0 = -0.8, Y1 = 0.8, TAU = Math.PI * 2;
  const ZAD = [Math.PI, TAU], SPR = [0, Math.PI];
  // r(y) = polmer celice na višini y; d = odmik navznoter (debelina stene)
  const Pcev = (xc, rf, d, ya = Y0, yb = Y1) => (u, psi, out) => {
    const y = ya + (yb - ya) * Math.min(1, Math.max(0, u));
    const r = Math.max(0, rf(y) - d) * (1 + 0.012 * sum(y * 7 + xc * 9, Math.cos(psi) * 2, Math.sin(psi) * 2));
    return out.set(xc + r * Math.cos(psi), y, r * Math.sin(psi));
  };
  const krpa = (pol, nu, nv) => [[0, 1, nu, pol[0], pol[1], nv]];
  // robovi reza: navpični črti pri ψ = π in ψ = 2π
  function rob(xc, rf, d, ya = Y0, yb = Y1, n = 60) {
    const P = Pcev(xc, rf, d, ya, yb), a = [], b = [];
    for (let i = 0; i <= n; i++) { a.push(P(i / n, Math.PI, new THREE.Vector3())); b.push(P(i / n, TAU, new THREE.Vector3())); }
    return [a, b];
  }
  const pasoviCev = (xc, rf, d1, d2, ya, yb) => { const A = rob(xc, rf, d1, ya, yb), B = rob(xc, rf, d2, ya, yb); return [pas(A[0], B[0]), pas(A[1], B[1])]; };
  // obroček na prečnem koncu koščka (pol obroča v prerezu)
  function konecObroc(xc, r1, r2, y, pol) {
    const g = new THREE.RingGeometry(r2, r1, q(24), 1, pol[0], pol[1] - pol[0]);
    g.rotateX(Math.PI / 2); // (x, y, 0) → (x, 0, y): kot θ ∈ [π, 2π] da z < 0
    return g.translate(xc, y, 0);
  }

  // Skupni izdelovalec celice: zunanja stena, notranja ploskev, pasova reza, sprednja pokrova.
  const skupine = {};
  function dodaj(skupina, kljuc, g) { (skupine[skupina] ||= {})[kljuc] ||= []; skupine[skupina][kljuc].push(g); }
  // tm > 0: živa celica z membrano tik pod steno (debelina membrane je povečana)
  function celica(skupina, xc, rf, w, ya = Y0, yb = Y1, nu = q(70), nv = q(20), tm = 0) {
    dodaj(skupina, "zun", ploskev(Pcev(xc, rf, 0, ya, yb), krpa(ZAD, nu, nv)));
    dodaj(skupina, "pokrov", ploskev(Pcev(xc, rf, 0, ya, yb), krpa(SPR, nu, nv)));
    dodaj(skupina, "not", ploskev(Pcev(xc, rf, w + tm, ya, yb), krpa(ZAD, nu, nv)));
    if (tm > 0) {
      const A = rob(xc, rf, w + tm, ya, yb, q(90)), B = rob(xc, rf, w, ya, yb, q(90));
      for (const k of [0, 1]) dodaj(skupina, "mem", trakPlasti(A[k].map((p) => p.clone().setZ(0.0012)), B[k].map((p) => p.clone().setZ(0.0012)), new THREE.Vector3(0, 0, 1), DVOSLOJ(0xd88aa2)));
    }
    for (const g of pasoviCev(xc, rf, 0, w, ya, yb)) dodaj(skupina, "rez", g);
    for (const k of rob(xc, rf, 0.002, ya, yb, 40)) dodaj(skupina, "rez", cev(k, 0.004, q(50), q(6)));
    for (const y of [ya, yb]) if (Math.abs(y) > 0.79) {
      dodaj(skupina, "rez", konecObroc(xc, rf(y), rf(y) - w, y, ZAD));
      dodaj(skupina, "pokrovKonec", konecObroc(xc, rf(y), rf(y) - w, y, SPR));
    }
  }

  // ---------- traheje (mrtve, odebeljene stene z lesovino) ----------
  const xV1 = -0.53, rV1 = 0.09, xV2 = -0.315, rV2 = 0.12, W_X = 0.014;
  const jV1 = -0.28, jV2 = 0.3; // stika členov (perforirani prečni steni)
  const rfV = (r0, yj) => (y) => r0 * (1 + 0.035 * Math.cos(((y - yj) / 0.9) * TAU) - 0.07 * Math.exp(-Math.pow((y - yj) / 0.035, 2)));
  celica("trahee", xV1, rfV(rV1, jV1), W_X);
  celica("trahee", xV2, rfV(rV2, jV2), W_X);
  // perforacijska plošča: rob ostanka prečne stene; pri tanjši trahei še prečke (lestvičasta)
  const perf = [];
  for (const [xc, r0, yj, precke] of [[xV1, rV1, jV1, true], [xV2, rV2, jV2, false]]) {
    const t = new THREE.TorusGeometry(r0 * 0.93 - W_X - 0.008, 0.011, q(8), q(28), Math.PI);
    t.rotateX(-Math.PI / 2); t.scale(1, 0.55, 1); t.translate(xc, yj, 0);
    perf.push(t);
    if (precke) for (const z of [-0.022, -0.046, -0.068]) {
      const dl = 2 * Math.sqrt(Math.max(0, Math.pow(r0 * 0.9 - W_X, 2) - z * z));
      perf.push(new THREE.CylinderGeometry(0.005, 0.005, dl, q(6)).rotateZ(Math.PI / 2).translate(xc, yj, z));
    }
  }
  // odebelitve: obročki pri tanjši, vijačnica pri širši trahei (le zadnja polovica)
  const odeb = [];
  for (let y = Y0 + 0.03; y < Y1 - 0.02; y += 0.062) {
    if (Math.abs(y - jV1) < 0.03) continue;
    const r = rfV(rV1, jV1)(y) - W_X;
    odeb.push(new THREE.TorusGeometry(r - 0.004, 0.0075, q(6), q(22), Math.PI).rotateX(-Math.PI / 2).translate(xV1, y, 0));
  }
  {
    const korak = 0.07, n = Math.round((Y1 - Y0) / korak);
    for (let k = 0; k < n; k++) {
      const pts = [];
      for (let i = 0; i <= 16; i++) {
        const psi = Math.PI + (i / 16) * Math.PI, y = Y0 + 0.02 + (k + i / 32) * korak;
        if (y > Y1 - 0.01) break;
        const r = rfV(rV2, jV2)(y) - W_X - 0.004;
        pts.push(new THREE.Vector3(xV2 + r * Math.cos(psi), y, r * Math.sin(psi)));
      }
      if (pts.length > 3) odeb.push(cev(pts, 0.0075, q(18), q(6)));
    }
  }

  // ---------- traheide (zašiljena konca, obokane piknje) ----------
  const xT1 = -0.13, xT2 = 0.005, rT = 0.06;
  const rfT = (ya, yb) => (y) => rT * Math.sqrt(Math.max(0, gladko(ya, ya + 0.32, y) * (1 - gladko(yb - 0.32, yb, y))));
  const T1 = [Y0, 0.42], T2 = [-0.42, Y1];
  const rfT1 = (y) => (y < -0.79 ? rT : rfT(Y0 - 1, T1[1])(y)), rfT2 = (y) => (y > 0.79 ? rT : rfT(T2[0], Y1 + 1)(y));
  celica("traheide", xT1, rfT1, W_X * 0.9, T1[0], T1[1], q(80));
  celica("traheide", xT2, rfT2, W_X * 0.9, T2[0], T2[1], q(80));
  const pikSez = [];
  for (const [xc, rf, [ya, yb]] of [[xT1, rfT1, T1], [xT2, rfT2, T2]]) {
    for (let i = 0; i < (hi ? 46 : 30); i++) {
      const y = ya + 0.05 + rnd() * (yb - ya - 0.1), psi = Math.PI * (1.08 + rnd() * 0.84);
      const r = rf(y) - W_X * 0.9 - 0.001;
      if (r < 0.02) continue;
      const p = new THREE.Vector3(xc + r * Math.cos(psi), y, r * Math.sin(psi));
      const n = new THREE.Vector3(-Math.cos(psi), 0, -Math.sin(psi));
      pikSez.push({ p, r: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n), s: 0.8 + rnd() * 0.4 });
    }
  }

  // ---------- sitaste cevi in celice spremljevalke ----------
  const xS1 = 0.19, xC1 = 0.31, xS2 = 0.43, xC2 = 0.555, rS = 0.09, rC = 0.036, W_S = 0.007;
  const plS1 = [-0.22, 0.6], plS2 = [0.12];
  const rfS = (plosce) => (y) => rS * (1 - 0.05 * plosce.reduce((a, yp) => a + Math.exp(-Math.pow((y - yp) / 0.03, 2)), 0));
  const rfC = (konci) => (y) => rC * (1 - 0.35 * konci.reduce((a, yp) => a + Math.exp(-Math.pow((y - yp) / 0.03, 2)), 0)) * (1 + 0.04 * Math.sin(y * 9));
  celica("sitaste", xS1, rfS(plS1), W_S, Y0, Y1, q(70), q(20), 0.0036);
  celica("sitaste", xS2, rfS(plS2), W_S, Y0, Y1, q(70), q(20), 0.0036);
  celica("spremljevalke", xC1, rfC(plS1), W_S, Y0, Y1, q(70), q(14), 0.0026);
  celica("spremljevalke", xC2, rfC(plS2), W_S, Y0, Y1, q(70), q(14), 0.0026);
  // sitaste ploščice: pol plošče s porami
  const plosce = [];
  for (const [xc, ys] of [[xS1, plS1], [xS2, plS2]]) for (const yp of ys) {
    const R = rfS(ys)(yp) - W_S;
    const sh = new THREE.Shape();
    sh.moveTo(R, 0); sh.absarc(0, 0, R, 0, -Math.PI, true); sh.lineTo(R, 0);
    for (let gx = -R; gx <= R; gx += 0.026) for (let gy = -0.016; gy > -R; gy -= 0.024) {
      const x = gx + ((Math.round(gy / 0.024) & 1) ? 0.013 : 0);
      if (x * x + gy * gy > (R - 0.014) * (R - 0.014)) continue;
      const h = new THREE.Path(); h.absarc(x, gy, 0.0085, 0, TAU, false); sh.holes.push(h);
    }
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.012, bevelEnabled: false, curveSegments: 6 });
    g.translate(0, 0, -0.006);
    g.rotateX(Math.PI / 2); // (x, y) → (x, 0, y): spodnja polovica (y < 0) gre na z < 0
    plosce.push(g.translate(xc, yp, 0));
    plosce.push(new THREE.TorusGeometry(R, 0.005, q(6), q(24), Math.PI).rotateX(-Math.PI / 2).scale(1, 1, 1).translate(xc, yp, 0)); // kaloza ob robu
  }
  // jedri in mitohondriji v celicah spremljevalkah
  const jedSez = [[xC1, 0.18], [xC2, -0.35]].map(([x, y]) => ({ p: new THREE.Vector3(x, y, -0.012), s: new THREE.Vector3(1, 1, 1) }));
  const mitSez = [];
  for (const xc of [xC1, xC2]) for (let i = 0; i < (hi ? 12 : 8); i++) {
    const y = Y0 + 0.08 + rnd() * (Y1 - Y0 - 0.16), psi = Math.PI * (1.2 + rnd() * 0.6);
    mitSez.push({ p: new THREE.Vector3(xc + rC * 0.45 * Math.cos(psi), y, rC * 0.5 * Math.sin(psi)), r: new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3) });
  }
  // nekaj plastidov v sitastih ceveh
  const plastSez = [];
  for (const xc of [xS1, xS2]) for (let i = 0; i < 7; i++) {
    const psi = Math.PI * (1.15 + rnd() * 0.7);
    plastSez.push({ p: new THREE.Vector3(xc + (rS - 0.018) * Math.cos(psi), Y0 + 0.1 + rnd() * 1.4, (rS - 0.018) * Math.sin(psi)) });
  }

  // ---------- mreže ----------
  const BARVE = {
    trahee: [0xb89660, "Traheje", "Dolge cevi iz mrtvih celic brez prečnih sten in brez membrane; po njih se voda z mineralnimi snovmi dviga od korenin do listov.", "#b89660"],
    traheide: [0xa98a5a, "Traheide", "Mrtve, dolge celice z zašiljenimi konci; voda prehaja iz ene v drugo skozi piknje v stenah.", "#a98a5a"],
    sitaste: [0xcfc597, "Sitaste cevi", "Žive celice brez jedra, zložene v cev; po njih tečejo sladkorji, raztopljeni v vodi. Pod steno imajo celično membrano (njena debelina je povečana).", "#cfc597"],
    spremljevalke: [0xc2b27c, "Celice spremljevalke", "Ozke žive celice z jedrom ob sitastih ceveh; skrbijo zanje in vanje nalagajo sladkorje. Pod steno imajo celično membrano (debelina je povečana).", "#c2b27c"],
  };
  const NOTRANJE = { trahee: 0x9f7c4c, traheide: 0x947446, sitaste: 0xece2c0, spremljevalke: 0xe2c98e };
  const mreze = {}, rezMreze = [], pokrovMreze = [];
  for (const [ime, [barva, naslov, opis, hex]] of Object.entries(BARVE)) {
    const s = skupine[ime];
    const zun = new THREE.Mesh(zdruzi(s.zun), mat(barva, { roughness: ime === "trahee" || ime === "traheide" ? 0.6 : 0.4, clearcoat: 0.5 }));
    const not = new THREE.Mesh(zdruzi(s.not), mat(NOTRANJE[ime], { roughness: 0.7, clearcoat: 0.2, sheen: 0.3, side: THREE.BackSide }));
    const rez = new THREE.Mesh(zdruzi(s.rez), mat(barva, { roughness: 0.6, clearcoat: 0.3, side: THREE.DoubleSide }));
    const pokrov = new THREE.Mesh(zdruzi([...s.pokrov, ...s.pokrovKonec]), mat(barva, { roughness: 0.5, clearcoat: 0.5, side: THREE.DoubleSide }));
    pokrov.visible = false;
    group.add(zun, not, rez, pokrov);
    const mem = s.mem ? new THREE.Mesh(zdruziPlasti(s.mem), matPlasti({ roughness: 0.45 })) : null;
    if (mem) { group.add(mem); rezMreze.push(mem); }
    mreze[ime] = { zun, not, rez, pokrov, mem, naslov, opis, hex };
    rezMreze.push(rez); pokrovMreze.push(pokrov);
  }
  const perfM = new THREE.Mesh(zdruzi(perf), mat(0x8e5a34, { roughness: 0.55, clearcoat: 0.4 }));
  const odebM = new THREE.Mesh(zdruzi(odeb), mat(0x8e5a34, { roughness: 0.5, clearcoat: 0.5 }));
  const piknje = instance(new THREE.TorusGeometry(0.0085, 0.0034, q(5), q(12)), mat(0x6e4626, { roughness: 0.5, clearcoat: 0.4 }), pikSez);
  const ploscice = new THREE.Mesh(zdruzi(plosce), mat(0xe0b24a, { roughness: 0.45, clearcoat: 0.6 }));
  const jedri = instance(preoblikuj(new THREE.SphereGeometry(1, q(18), q(12)), (v) => v.multiplyScalar(1 + 0.05 * sum(v.x * 3, v.y * 3, v.z * 3))).scale(0.02, 0.06, 0.018),
    mat(0x7a68d8, { roughness: 0.34 }), jedSez);
  const mitohondriji = instance(new THREE.CapsuleGeometry(0.0055, 0.014, q(3), q(8)), mat(0xe8743b, { roughness: 0.38 }), mitSez);
  const plastidi = instance(new THREE.SphereGeometry(0.008, q(8), q(6)), mat(0xd8d0a0, { roughness: 0.5 }), plastSez);
  group.add(perfM, odebM, piknje, ploscice, jedri, mitohondriji, plastidi);

  // ---------- kambij: ozke delujoče se celice med ksilemom in floemom (dvokaličnice) ----------
  const kamZad = [], kamSpr = [], kzB = [], ksB = [], KX = [0.077, 0.091], KW = 0.0125, KD = 0.06;
  const kamStena = new THREE.Color(0x9fb86a), kamCit = new THREE.Color(0xdbe9b4), kamJed = new THREE.Color(0x7a68d8), _kc = new THREE.Color();
  KX.forEach((kx, st) => {
    let y = Y0, prva = true;
    while (y < Y1 - 0.02) {
      const h = Math.min(Y1 - y, prva && st ? 0.035 : 0.06 + rnd() * 0.03), yc = y + h / 2;
      prva = false;
      _kc.copy(kamStena).multiplyScalar(0.9 + rnd() * 0.18);
      kamZad.push(new THREE.BoxGeometry(KW, h - 0.003, KD).translate(kx, yc, -KD / 2)); kzB.push(_kc.getHex());
      kamSpr.push(new THREE.BoxGeometry(KW, h - 0.003, KD).translate(kx, yc, KD / 2)); ksB.push(_kc.getHex());
      kamZad.push(new THREE.PlaneGeometry(KW - 0.004, h - 0.008).translate(kx, yc, 0.0006)); kzB.push(kamCit.getHex());
      kamZad.push(new THREE.CircleGeometry(0.0042, q(12)).scale(1, 1.5, 1).translate(kx, yc + (rnd() - 0.5) * h * 0.3, 0.0012)); kzB.push(kamJed.getHex());
      y += h;
    }
  });
  const kamMat = mat(0xffffff, { vertexColors: true, roughness: 0.55, clearcoat: 0.3, sheen: 0.3 });
  const kambij = new THREE.Mesh(zdruzi(kamZad, kzB), kamMat);
  const kambijPokrov = new THREE.Mesh(zdruzi(kamSpr, ksB), kamMat);
  kambijPokrov.visible = false;
  group.add(kambij, kambijPokrov);
  pokrovMreze.push(kambijPokrov);

  // ---------- tok: voda navzgor po ksilemu, sladkorji po floemu ----------
  const vodaPoti = [], sladPoti = [];
  for (const [xc, r0, n] of [[xV1, rV1, 12], [xV2, rV2, 16]]) for (let i = 0; i < n; i++) {
    const a = Math.PI * (1.15 + rnd() * 0.7), rr = (r0 - 0.03) * (0.3 + rnd() * 0.65);
    const x = xc + rr * Math.cos(a), z = rr * Math.sin(a);
    vodaPoti.push({ pot: new THREE.LineCurve3(new THREE.Vector3(x, Y0 + 0.01, z), new THREE.Vector3(x, Y1 - 0.01, z)), f: rnd(), v: 0.16 + rnd() * 0.05 });
  }
  for (let i = 0; i < 10; i++) {
    // po prvi traheidi navzgor, skozi piknje v drugo in naprej navzgor
    const z = -0.025 - rnd() * 0.02, yp = -0.15 + rnd() * 0.4;
    vodaPoti.push({ pot: new THREE.CatmullRomCurve3([new THREE.Vector3(xT1, Y0 + 0.01, z), new THREE.Vector3(xT1 + 0.01, yp - 0.15, z), new THREE.Vector3((xT1 + xT2) / 2, yp, z), new THREE.Vector3(xT2 - 0.01, yp + 0.15, z), new THREE.Vector3(xT2, Y1 - 0.01, z)]), f: rnd(), v: 0.1 + rnd() * 0.04 });
  }
  for (const [xc, n] of [[xS1, 12], [xS2, 12]]) for (let i = 0; i < n; i++) {
    const a = Math.PI * (1.2 + rnd() * 0.6), rr = (rS - 0.03) * (0.2 + rnd() * 0.7);
    const x = xc + rr * Math.cos(a), z = rr * Math.sin(a);
    sladPoti.push({ pot: new THREE.LineCurve3(new THREE.Vector3(x, Y1 - 0.01, z), new THREE.Vector3(x, Y0 + 0.01, z)), f: rnd(), v: 0.07 + rnd() * 0.03 });
  }
  for (const [xc, xs] of [[xC1, xS1], [xC2, xS2], [xC1, xS2]]) for (let i = 0; i < 3; i++) {
    // nalaganje sladkorjev iz celice spremljevalke v sitasto cev
    const y = -0.5 + rnd() * 1.1, z = -0.02;
    sladPoti.push({ pot: new THREE.CatmullRomCurve3([new THREE.Vector3(xc, y + 0.05, z), new THREE.Vector3((xc + xs) / 2, y, z), new THREE.Vector3(xs, y - 0.08, z), new THREE.Vector3(xs, y - 0.35, z)]), f: rnd(), v: 0.12 });
  }
  const vodaM = new THREE.InstancedMesh(new THREE.SphereGeometry(0.0115, q(10), q(8)), mat(0x3f9cff, { roughness: 0.2, clearcoat: 1, emissive: 0x0a2a66 }), vodaPoti.length);
  const sladM = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.012, 1), mat(0xf0a040, { roughness: 0.3, clearcoat: 0.8, emissive: 0x3a1a00 }), sladPoti.length);
  const _p = new THREE.Vector3();
  function postaviTok(m, poti, t) {
    poti.forEach((p, i) => {
      const u = (p.f + t * p.v) % 1;
      p.pot.getPointAt(u, _p);
      o.position.copy(_p); o.rotation.set(t + i, i, 0); o.scale.setScalar(Math.max(0.0001, gladko(0, 0.05, u) * (1 - gladko(0.95, 1, u)))); o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
  }
  postaviTok(vodaM, vodaPoti, 0); postaviTok(sladM, sladPoti, 0);
  group.add(vodaM, sladM);

  // ---------- deli ----------
  const T = { trahee: [xV2 - rV2 + 0.004, 0.55, 0.001], traheide: [xT1 - rT + 0.003, -0.3, 0.001], sitaste: [xS1 - rS + 0.003, 0.35, 0.001], spremljevalke: [xC1 + rC - 0.004, -0.5, 0.001] };
  for (const [ime, m] of Object.entries(mreze)) {
    const meshes = [m.zun, m.not, m.rez, m.pokrov].concat(m.mem ? [m.mem] : []);
    if (ime === "trahee") meshes.push(perfM);
    del(ime, m.naslov, m.opis, m.hex, meshes, T[ime]);
  }
  del("odebelitve", "Odebelitve z lesovino", "Obročki in vijačnice iz lesovine (lignina) utrjujejo steno trahej, da se cev pod podtlakom ne sesede.", "#8e5a34",
    [odebM], [xV1 + 0.02, 0.4, -rV1 + 0.03]);
  del("piknje", "Piknje", "Tanka mesta v steni traheid, skozi katera voda prehaja iz ene celice v sosednjo.", "#6e4626", [piknje], pikSez[5].p.toArray());
  del("sitaste-ploscice", "Sitaste ploščice", "Prečne stene sitastih cevi z luknjicami; skozi njih se raztopina sladkorjev pretaka iz celice v celico.", "#d9b85a",
    [ploscice], [xS1, plS1[0], -0.03]);
  del("jedro", "Jedro celice spremljevalke", "Sitaste cevi nimajo jedra; namesto njih delo upravlja jedro sosednje celice spremljevalke.", "#7a68d8", [jedri], [xC1, 0.18, -0.005]);
  del("mitohondrij", "Mitohondriji", "V celicah spremljevalkah jih je veliko, ker nalaganje sladkorjev v sitaste cevi porablja energijo.", "#e8743b", [mitohondriji], mitSez[3].p.toArray());
  del("plastidi", "Plastidi", "Redki ostanki organelov ob steni sitaste cevi; večina organelov in jedro med razvojem propadejo.", "#d8d0a0", [plastidi], plastSez[2].p.toArray());
  del("kambij", "Kambij", "Plast ozkih celic, ki se delijo, med ksilemom in floemom; navznoter tvori nov ksilem, navzven nov floem, zato se steblo debeli.", "#9fb86a",
    [kambij, kambijPokrov], [KX[0], -0.62, 0.002]);
  del("tok-vode", "Tok vode", "Voda z mineralnimi snovmi potuje po ksilemu navzgor; vleče jo izhlapevanje iz listov.", "#3f9cff", [vodaM], [xV2 + 0.02, 0.1, -0.04]);
  del("tok-sladkorjev", "Tok sladkorjev", "Sladkorji iz listov potujejo po floemu tja, kjer jih rastlina porablja ali shranjuje, na primer v korenine in plodove.", "#f0a040",
    [sladM], [xS2 - 0.01, -0.2, -0.04]);

  // Ves košček rahlo zasukamo proti privzetemu pogledu, da je prerez viden bolj od spredaj in je snop širši.
  const zasuk = new THREE.Matrix4().makeRotationY(-0.3);
  group.children.forEach((m) => m.applyMatrix4(zasuk));
  deli.forEach((d) => { d.tocka = new THREE.Vector3(...d.tocka).applyMatrix4(zasuk).toArray().map((x) => Math.round(x * 1000) / 1000); });

  // ---------- nadzor ----------
  let tok = "voda", zadnjiT = 0;
  const nastaviTok = (v) => { tok = v; vodaM.visible = v === "voda"; sladM.visible = v === "sladkorji"; };
  const nadzor = [
    { tip: "izbira", id: "tok", oznaka: "Tok", moznosti: [["voda", "Voda (ksilem)"], ["sladkorji", "Sladkorji (floem)"]], vrednost: "voda", ob: nastaviTok },
    {
      tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cela", "Cele celice"]], vrednost: "prerez",
      ob: (v) => { const cela = v === "cela"; pokrovMreze.forEach((m) => { m.visible = cela; }); rezMreze.forEach((m) => { m.visible = !cela; }); },
    },
  ];
  const z = ctx.zacetek || {};
  if (z.tok === "voda" || z.tok === "sladkorji") nadzor[0].vrednost = z.tok;
  nastaviTok(nadzor[0].vrednost);
  if (z.prikaz) { nadzor[1].vrednost = z.prikaz; nadzor[1].ob(z.prikaz); }
  void tok; void zadnjiT;

  return {
    group,
    // seznam delov kaže le dele, ki so v trenutnem prikazu vidni
    get deli() { return deli.filter((d) => d.meshes.some((m) => { for (let o = m; o; o = o.parent) if (!o.visible) return false; return true; })); },
    nadzor,
    korak(t) {
      if (!gib) return;
      postaviTok(vodaM, vodaPoti, t); postaviTok(sladM, sladPoti, t);
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
