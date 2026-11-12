// Ksilem in floem: vzdolžni prerez koščka žilnega snopa (traheje, traheide, sitaste cevi, celice spremljevalke).
// Pogodba graditelja: docs/3d.md. THREE pride od kompleta; skupni videz celic iz public/3d/celice-videz.js.
import { videzCelic, BARVE as B } from "../../celice-videz.js";

export const info = {
  id: "celica-ksilem-floem",
  naslov: "Ksilem in floem",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Košček žilnega snopa v vzdolžnem prerezu: po mrtvih celicah ksilema se pretakata voda in mineralne snovi navzgor, po živih sitastih ceveh floema pa sladkorji iz listov v druge dele rastline. Pri dvokaličnicah je med njima kambij, plast celic, ki se delijo. Celice so prikazane skrajšane; v resnici so dolge od desetink milimetra do več milimetrov.",
  poskusi: "Preklopi tok med vodo in sladkorji: v katero smer teče vsak?",
  merilo: { m: 300e-6, oznaka: "300 µm" },
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const gib = ctx.gibanje !== false;
  const group = new THREE.Group();
  const deli = [];
  const odpad = [];
  const V = videzCelic(THREE, { hi, odpad });
  const { sum } = V;
  let seme = 41;
  // ---------- orodja ----------
  const rnd = () => ((seme = (seme * 16807) % 2147483647) - 1) / 2147483646;
  const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
  const gladko = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const F = (x) => (Number.isInteger(x) ? x + ".0" : String(+(+x).toPrecision(4)));
  const C3 = (c) => { const b = new THREE.Color(c).convertLinearToSRGB(); return `vec3(${F(b.r)}, ${F(b.g)}, ${F(b.b)})`; };
  function mat(barva, o = {}) {
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: barva, roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.22,
      sheen: 0.35, sheenColor: new THREE.Color(barva).lerp(new THREE.Color(0xffffff), 0.45).multiplyScalar(0.8), sheenRoughness: 0.45,
    }, o));
    odpad.push(m);
    return m;
  }
  // Ploskev prereza z lastnim senčilnikom: koda (GLSL) iz vRez (= aRez) in vRp (položaj v geometriji) nastavi
  // bv (barva sRGB) in zh (višina reliefa v enotah prizora). Material ima userData.rez (poliraj in učbeniške barve ga pustijo).
  function rezMat(koda, kljuc, o = {}) {
    const m = mat(0xffffff, Object.assign({ roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.3, sheen: 0.3, sheenColor: new THREE.Color(0xfff0d8), side: THREE.DoubleSide }, o));
    m.userData.rez = true;
    const dodaj = (m) => {
      m.onBeforeCompile = (sh) => {
        sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute vec2 aRez;\nvarying vec2 vRez;\nvarying vec3 vRp;")
          .replace("#include <begin_vertex>", "#include <begin_vertex>\nvRez = aRez;\nvRp = position;");
        sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec2 vRez;\nvarying vec3 vRp;" + V.GLSL)
          .replace("#include <color_fragment>", `#include <color_fragment>
            vec2 R = vRez; vec3 P = vRp; vec3 bv = vec3(1.0); float zh = 0.0;
            ${koda}
            diffuseColor.rgb = pow(clamp(bv, 0.0, 1.0), vec3(2.2));`)
          .replace("#include <normal_fragment_maps>", "#include <normal_fragment_maps>\nnormal = zvRelief(normal, zh, faceDirection);");
      };
      m.customProgramCacheKey = () => "ksf-rez-" + kljuc;
      m.clone = function () { const c = new this.constructor().copy(this); dodaj(c); return c; };
    };
    dodaj(m);
    return m;
  }
  // Združi geometrije (z indeksom ali brez) v eno; po želji pobarva vsako z barvo oglišč; ohrani aRez, če ga imajo vse.
  function zdruzi(geos, barve) {
    const pos = [], nor = [], col = [], rez = [], idx = [];
    const zCol = !barve && geos.every((g) => g.attributes.color), zRez = geos.length && geos.every((g) => g.attributes.aRez);
    let off = 0;
    geos.forEach((g, i) => {
      if (!g.attributes.normal) g.computeVertexNormals();
      const p = g.attributes.position, n = g.attributes.normal, gc = g.attributes.color, r = g.attributes.aRez;
      const c = barve && barve[i] != null ? new THREE.Color(barve[i]) : null;
      for (let k = 0; k < p.count; k++) {
        pos.push(p.getX(k), p.getY(k), p.getZ(k));
        nor.push(n.getX(k), n.getY(k), n.getZ(k));
        if (c) col.push(c.r, c.g, c.b);
        else if (barve || zCol) { if (gc) col.push(gc.getX(k), gc.getY(k), gc.getZ(k)); else col.push(1, 1, 1); }
        if (zRez) rez.push(r.getX(k), r.getY(k));
      }
      if (g.index) for (let k = 0; k < g.index.count; k++) idx.push(g.index.getX(k) + off);
      else for (let k = 0; k < p.count; k++) idx.push(k + off);
      off += p.count;
      g.dispose();
    });
    const out = new THREE.BufferGeometry();
    out.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    out.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    if (barve || zCol) out.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    if (zRez) out.setAttribute("aRez", new THREE.Float32BufferAttribute(rez, 2));
    out.setIndex(idx);
    return out;
  }
  function del(id, ime, opis, barva, meshes, tocka) {
    meshes.forEach((m) => { m.userData.del = id; });
    deli.push({ id, ime, opis, barva, meshes, tocka: tocka.map((x) => Math.round(x * 1000) / 1000) });
  }
  // Ploskev iz parametrov: P(u, v, izhod) za krpo [u0, u1, nu, v0, v1, nv]; normale numerično iz P.
  function ploskev(P, krpe, obrni = false) {
    const pos = [], nor = [], idx = [];
    const A = v3(0, 0, 0), Bv = v3(0, 0, 0), Cv = v3(0, 0, 0), D = v3(0, 0, 0), N = v3(0, 0, 0), e = 1e-3;
    let off = 0;
    for (const [u0, u1, nu, v0, v1, nv] of krpe) {
      for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) {
        const u = u0 + (u1 - u0) * i / nu, v = v0 + (v1 - v0) * j / nv;
        P(u, v, A); pos.push(A.x, A.y, A.z);
        P(u + e, v, Bv); P(u - e, v, Cv); Bv.sub(Cv);
        P(u, v + e, Cv); P(u, v - e, D); Cv.sub(D);
        N.crossVectors(Bv, Cv);
        if (N.lengthSq() < 1e-16) N.set(0, Math.sign(A.y) || 1, 0); // izrojena točka (konica traheide)
        N.normalize();
        if (obrni) N.negate();
        nor.push(N.x, N.y, N.z);
      }
      for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
        const a = off + i * (nv + 1) + j, b = a + nv + 1, c = b + 1, d = a + 1;
        if (obrni) idx.push(a, d, b, b, d, c); else idx.push(a, b, d, b, c, d);
      }
      off += (nu + 1) * (nv + 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    g.setIndex(idx);
    return g;
  }
  // Trak prereza med nizoma točk A (zunanji rob, t = 0) in B (notranji rob, t = 1); aRez = (y, t).
  function pasR(A, Bt) {
    const pos = [], rez = [], idx = [];
    for (let i = 0; i < A.length; i++) { pos.push(A[i].x, A[i].y, A[i].z, Bt[i].x, Bt[i].y, Bt[i].z); rez.push(A[i].y, 0, Bt[i].y, 1); }
    for (let i = 0; i < A.length - 1; i++) { const a = 2 * i; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("aRez", new THREE.Float32BufferAttribute(rez, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  // Pol obroča prečnega reza na koncu koščka (kot ψ v pol): x = xc + r cos ψ, z = r sin ψ; aRez = (ψ · r1, t).
  function obrocR(xc, r1, r2, y, pol, n = q(24)) {
    const pos = [], rez = [], idx = [];
    for (let i = 0; i <= n; i++) {
      const psi = pol[0] + (pol[1] - pol[0]) * (i / n);
      for (const t of [0, 1]) { const r = r1 + (r2 - r1) * t; pos.push(xc + r * Math.cos(psi), y, r * Math.sin(psi)); rez.push(psi * r1, t); }
    }
    for (let i = 0; i < n; i++) { const a = 2 * i; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("aRez", new THREE.Float32BufferAttribute(rez, 2));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  // Cev s spremenljivim polmerom rF(t) vzdolž krivulje; konca zaprta z ravnim pokrovom.
  function cevK(krivulja, nSeg, rF, nRad) {
    const fr = krivulja.computeFrenetFrames(nSeg, false);
    const pos = [], idx = [], P = v3(0, 0, 0);
    for (let i = 0; i <= nSeg; i++) {
      krivulja.getPointAt(i / nSeg, P);
      const r = rF(i / nSeg), N = fr.normals[i], Bn = fr.binormals[i];
      for (let j = 0; j < nRad; j++) {
        const a = (j / nRad) * Math.PI * 2, c = Math.cos(a) * r, s = Math.sin(a) * r;
        pos.push(P.x + c * N.x + s * Bn.x, P.y + c * N.y + s * Bn.y, P.z + c * N.z + s * Bn.z);
      }
    }
    for (let i = 0; i < nSeg; i++) for (let j = 0; j < nRad; j++) {
      const a = i * nRad + j, b = i * nRad + ((j + 1) % nRad), c = a + nRad, d = b + nRad;
      idx.push(a, b, c, b, d, c);
    }
    for (const [i, sg] of [[0, -1], [nSeg, 1]]) {
      krivulja.getPointAt(i / nSeg, P);
      const c = pos.length / 3;
      pos.push(P.x, P.y, P.z);
      for (let j = 0; j < nRad; j++) {
        const a = i * nRad + j, b = i * nRad + ((j + 1) % nRad);
        if (sg < 0) idx.push(c, b, a); else idx.push(c, a, b);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }
  const cev = (pts, r, seg, rad) => cevK(new THREE.CatmullRomCurve3(pts), seg, () => r, rad);
  // Odstrani trikotnike, katerih težišče izpolni pogoj.
  function odrezi(g, pogoj) {
    const p = g.attributes.position, ix = g.index.array, ost = [], a = v3(0, 0, 0), b = v3(0, 0, 0), c = v3(0, 0, 0);
    for (let i = 0; i < ix.length; i += 3) {
      a.fromBufferAttribute(p, ix[i]); b.fromBufferAttribute(p, ix[i + 1]); c.fromBufferAttribute(p, ix[i + 2]);
      if (!pogoj(a.add(b).add(c).multiplyScalar(1 / 3))) ost.push(ix[i], ix[i + 1], ix[i + 2]);
    }
    g.setIndex(ost);
    return g;
  }
  function preoblikuj(g, f) {
    const p = g.attributes.position, v = v3(0, 0, 0);
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
  // robova reza: navpični črti pri ψ = π in ψ = 2π
  function rob(xc, rf, d, ya = Y0, yb = Y1, n = 60) {
    const P = Pcev(xc, rf, d, ya, yb), a = [], b = [];
    for (let i = 0; i <= n; i++) { a.push(P(i / n, Math.PI, v3(0, 0, 0))); b.push(P(i / n, TAU, v3(0, 0, 0))); }
    return [a, b];
  }
  const pasoviCev = (xc, rf, d1, d2, ya, yb, n) => { const A = rob(xc, rf, d1, ya, yb, n), Bt = rob(xc, rf, d2, ya, yb, n); return [pasR(A[0], Bt[0]), pasR(A[1], Bt[1])]; };

  // Skupni izdelovalec celice: zunanja stena, notranja ploskev, prerez stene (plasti), sprednja pokrova.
  const skupine = {};
  function dodaj(skupina, kljuc, g) { (skupine[skupina] ||= {})[kljuc] ||= []; skupine[skupina][kljuc].push(g); }
  // tm > 0: živa celica z membrano tik pod steno (debelina membrane je povečana)
  function celica(skupina, xc, rf, w, ya = Y0, yb = Y1, nu = q(70), nv = q(20), tm = 0) {
    dodaj(skupina, "zun", ploskev(Pcev(xc, rf, 0, ya, yb), krpa(ZAD, nu, nv)));
    dodaj(skupina, "pokrov", ploskev(Pcev(xc, rf, 0, ya, yb), krpa(SPR, nu, nv)));
    dodaj(skupina, "not", ploskev(Pcev(xc, rf, w + tm, ya, yb), krpa(ZAD, nu, nv)));
    if (tm > 0) for (const g of pasoviCev(xc, rf, w, w + tm, ya, yb, q(90))) dodaj(skupina, "mem", g);
    for (const g of pasoviCev(xc, rf, 0, w, ya, yb, q(90))) dodaj(skupina, "rez", g);
    for (const y of [ya, yb]) if (Math.abs(y) > 0.79) {
      dodaj(skupina, "rez", obrocR(xc, rf(y), rf(y) - w, y, ZAD));
      dodaj(skupina, "pokrovKonec", obrocR(xc, rf(y), rf(y) - w, y, SPR));
    }
  }
  // obokana piknja: obroč sekundarne stene nad tanko piknjino membrano, v sredini odprtina (gleda v smer +z)
  function piknjaGeo(s = 1) {
    const n = hi ? 14 : 6, L = (pts) => new THREE.LatheGeometry(pts.map(([r, h]) => new THREE.Vector2(r * s, h * s)), n).rotateX(Math.PI / 2);
    const kupola = L(hi ? [[0.0098, 0], [0.0088, 0.0013], [0.0068, 0.0022], [0.0044, 0.0025]] : [[0.0098, 0], [0.0075, 0.0019], [0.0044, 0.0025]]);
    const ustje = L(hi ? [[0.0044, 0.0025], [0.0031, 0.002], [0.0027, 0.0009], [0.0027, 0.0001]] : [[0.0044, 0.0025], [0.0027, 0.0015], [0.0027, 0.0001]]);
    const membrana = new THREE.CircleGeometry(0.0029 * s, n).translate(0, 0, 0.0003 * s);
    return zdruzi([kupola, ustje, membrana], [0xffffff, 0x8a6a50, 0x3a2410]);
  }

  // ---------- traheje (mrtve, olesenele stene: ozka z vijačnico, široka s piknjami) ----------
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
  // odebelitve: dvojna vijačnica iz lesovine v ozki trahei (le zadnja polovica; na ravnini prereza odrezana)
  const odeb = [];
  {
    const korak = 0.078, rf = rfV(rV1, jV1);
    for (const faza of [0, 0.5]) {
      for (let k = -1; k < (Y1 - Y0) / korak + 1; k++) {
        let pts = [];
        const konec = () => { if (pts.length > 3) odeb.push(cev(pts, 0.0062, q(16), q(6))); pts = []; };
        for (let i = 0; i <= 18; i++) {
          const psi = Math.PI + (i / 18) * Math.PI, y = Y0 + (k + faza + (psi - Math.PI) / TAU) * korak;
          if (y < Y0 + 0.012 || y > Y1 - 0.012 || Math.abs(y - jV1) < 0.03) { konec(); continue; }
          const r = rf(y) - W_X - 0.0035;
          pts.push(v3(xV1 + r * Math.cos(psi), y, r * Math.sin(psi)));
        }
        konec();
      }
    }
  }
  // piknje: obokane piknje v vrstah na široki trahei (piknjasta traheja) in posamezne v traheidah
  const pikSez = [];
  {
    const rf = rfV(rV2, jV2), dy = hi ? 0.03 : 0.045;
    for (let j = 0, y = Y0 + 0.025; y < Y1 - 0.02; j++, y += dy) {
      if (Math.abs(y - jV2) < 0.035) continue;
      const r = rf(y) - W_X - 0.0006, dpsi = (hi ? 0.03 : 0.045) / r;
      for (let psi = Math.PI + dpsi * (0.5 + (j % 2) * 0.5); psi < TAU - dpsi * 0.4; psi += dpsi) {
        const p = v3(xV2 + r * Math.cos(psi), y, r * Math.sin(psi)), n = v3(-Math.cos(psi), 0, -Math.sin(psi));
        pikSez.push({ p, r: new THREE.Quaternion().setFromUnitVectors(v3(0, 0, 1), n), s: v3(1.25, 0.8, 1) });
      }
    }
  }

  // ---------- traheide (zašiljena konca, obokane piknje) ----------
  const xT1 = -0.13, xT2 = 0.005, rT = 0.06;
  const rfT = (ya, yb) => (y) => rT * Math.sqrt(Math.max(0, gladko(ya, ya + 0.32, y) * (1 - gladko(yb - 0.32, yb, y))));
  const T1 = [Y0, 0.42], T2 = [-0.42, Y1];
  const rfT1 = (y) => (y < -0.79 ? rT : rfT(Y0 - 1, T1[1])(y)), rfT2 = (y) => (y > 0.79 ? rT : rfT(T2[0], Y1 + 1)(y));
  celica("traheide", xT1, rfT1, W_X * 0.9, T1[0], T1[1], q(80));
  celica("traheide", xT2, rfT2, W_X * 0.9, T2[0], T2[1], q(80));
  const pikSezT = [];
  for (const [xc, rf, [ya, yb]] of [[xT1, rfT1, T1], [xT2, rfT2, T2]]) {
    for (let i = 0; i < (hi ? 60 : 30); i++) {
      const y = ya + 0.05 + rnd() * (yb - ya - 0.1), psi = Math.PI * (1.08 + rnd() * 0.84);
      const r = rf(y) - W_X * 0.9 - 0.0006;
      if (r < 0.025) continue;
      const p = v3(xc + r * Math.cos(psi), y, r * Math.sin(psi));
      const n = v3(-Math.cos(psi), 0, -Math.sin(psi));
      pikSezT.push({ p, r: new THREE.Quaternion().setFromUnitVectors(v3(0, 0, 1), n), s: 0.85 + rnd() * 0.35 });
    }
  }

  // ---------- sitaste cevi in celice spremljevalke ----------
  const xS1 = 0.19, xC1 = 0.31, xS2 = 0.43, xC2 = 0.555, rS = 0.09, rC = 0.036, W_S = 0.007, TM_S = 0.0036, TM_C = 0.0026;
  const plS1 = [-0.22, 0.6], plS2 = [0.12];
  const rfS = (plosce) => (y) => rS * (1 - 0.05 * plosce.reduce((a, yp) => a + Math.exp(-Math.pow((y - yp) / 0.03, 2)), 0));
  const rfC = (konci) => (y) => rC * (1 - 0.35 * konci.reduce((a, yp) => a + Math.exp(-Math.pow((y - yp) / 0.03, 2)), 0)) * (1 + 0.04 * Math.sin(y * 9));
  celica("sitaste", xS1, rfS(plS1), W_S, Y0, Y1, q(70), q(20), TM_S);
  celica("sitaste", xS2, rfS(plS2), W_S, Y0, Y1, q(70), q(20), TM_S);
  celica("spremljevalke", xC1, rfC(plS1), W_S, Y0, Y1, q(70), q(14), TM_C);
  celica("spremljevalke", xC2, rfC(plS2), W_S, Y0, Y1, q(70), q(14), TM_C);
  // sitaste ploščice: pol plošče s porami, pore obložene s kalozo
  const plosce = [], kaloza = [];
  for (const [xc, ys] of [[xS1, plS1], [xS2, plS2]]) for (const yp of ys) {
    const R = rfS(ys)(yp) - W_S - TM_S;
    const sh = new THREE.Shape();
    sh.moveTo(R, 0); sh.absarc(0, 0, R, 0, -Math.PI, true); sh.lineTo(R, 0);
    for (let gx = -R; gx <= R; gx += 0.026) for (let gy = -0.016; gy > -R; gy -= 0.024) {
      const x = gx + ((Math.round(gy / 0.024) & 1) ? 0.013 : 0);
      if (x * x + gy * gy > (R - 0.014) * (R - 0.014)) continue;
      const h = new THREE.Path(); h.absarc(x, gy, 0.0085, 0, TAU, false); sh.holes.push(h);
      if (hi) for (const s of [-1, 1]) kaloza.push(new THREE.TorusGeometry(0.0085, 0.0016, 4, 12).rotateX(Math.PI / 2).translate(xc + x, yp + s * 0.006, gy));
    }
    const g = new THREE.ExtrudeGeometry(sh, { depth: 0.012, bevelEnabled: false, curveSegments: 6 });
    g.translate(0, 0, -0.006);
    g.rotateX(Math.PI / 2); // (x, y) → (x, 0, y): spodnja polovica (y < 0) gre na z < 0
    plosce.push(g.translate(xc, yp, 0));
  }

  // ---------- mreže sten: zunaj in na notranji strani (mrtve celice) oz. citoplazma (žive celice), prerez s plastmi ----------
  // Prerez olesenele stene: srednja lamela (temna), primarna stena, sekundarna stena S1, S2 (lamele), S3 – lesovina.
  const KODA_LES = `
    float t = R.y, s = R.x, at = max(fwidth(t), 1e-5);
    float g = zvS(vec3(s * 260.0, t * 9.0, 1.0)) * 0.7 + zvS(vec3(s * 900.0, t * 30.0, 4.0)) * 0.3;
    bv = vec3(0.3, 0.13, 0.05);
    bv = mix(bv, vec3(0.86, 0.6, 0.3), smoothstep(0.07, 0.1, t));
    bv = mix(bv, vec3(0.95, 0.66, 0.26), smoothstep(0.17, 0.2, t));
    bv = mix(bv, vec3(0.78, 0.42, 0.13), smoothstep(0.3, 0.33, t));
    bv = mix(bv, vec3(0.93, 0.6, 0.24), smoothstep(0.86, 0.89, t));
    float wS2 = smoothstep(0.33, 0.36, t) * (1.0 - smoothstep(0.84, 0.86, t)) * clamp(1.6 - at * 50.0, 0.0, 1.0);
    float lam = 0.5 + 0.5 * sin(t * 160.0 + g * 3.0);
    bv *= (1.0 + 0.16 * (lam - 0.5) * wS2) * (0.88 + 0.24 * g);
    bv *= 1.0 - 0.3 * (1.0 - smoothstep(0.0, 0.05, 1.0 - t));
    zh = (lam * wS2 * 0.5 + g * 0.5) * 0.0004;`;
  // Prerez celulozne stene živih celic floema: srednja lamela (pektin) in primarna stena iz plasti celuloznih vlaken.
  const KODA_CEL = `
    float t = R.y, s = R.x, at = max(fwidth(t), 1e-5);
    float g = zvS(vec3(s * 300.0, t * 9.0, 2.0)) * 0.7 + zvS(vec3(s * 1000.0, t * 30.0, 5.0)) * 0.3;
    bv = mix(vec3(0.34, 0.36, 0.08), ${C3(B.stena)} * 1.08, smoothstep(0.14, 0.18, t));
    float lam = 0.5 + 0.5 * sin(t * 70.0 + g * 3.0), wL = smoothstep(0.18, 0.22, t) * clamp(1.6 - at * 25.0, 0.0, 1.0);
    bv = mix(bv, vec3(0.86, 0.96, 0.62), lam * wL * 0.3) * (0.88 + 0.24 * g);
    bv *= 1.0 - 0.28 * (1.0 - smoothstep(0.0, 0.06, 1.0 - t));
    zh = (lam * wL * 0.5 + g * 0.5) * 0.0004;`;
  const rezLes = rezMat(KODA_LES, "les"), rezCel = rezMat(KODA_CEL, "cel");
  const memMat = V.dvoslojMat(TM_S);
  const STENE = {
    trahee: [0xc27a34, 0x9a5524, rezLes, "Traheje", "Dolge cevi iz mrtvih celic brez prečnih sten in brez membrane; po njih se voda z mineralnimi snovmi dviga od korenin do listov. Stene so olesenele.", "#c27a34"],
    traheide: [0xb36c2e, 0x8a4c22, rezLes, "Traheide", "Mrtve, dolge celice z zašiljenimi konci in olesenelo steno; voda prehaja iz ene v drugo skozi piknje v stenah.", "#b36c2e"],
    sitaste: [0x9ccf5c, 0x3b3368, rezCel, "Sitaste cevi", "Žive celice brez jedra, zložene v cev; po njih tečejo sladkorji, raztopljeni v vodi. Stena je iz celuloze, brez lesovine.", "#9ccf5c"],
    spremljevalke: [0x86bd4a, 0x2e2858, rezCel, "Celice spremljevalke", "Ozke žive celice z jedrom in gosto citoplazmo ob sitastih ceveh; skrbijo zanje in vanje nalagajo sladkorje.", "#86bd4a"],
  };
  const mreze = {}, rezMreze = [], pokrovMreze = [], citMreze = [], memMreze = [];
  for (const [ime, [barva, notB, rezM, naslov, opis, hex]] of Object.entries(STENE)) {
    const s = skupine[ime], zivo = !!s.mem;
    const zun = new THREE.Mesh(zdruzi(s.zun), mat(barva, { roughness: zivo ? 0.5 : 0.6, clearcoat: 0.4 }));
    const not = new THREE.Mesh(zdruzi(s.not), mat(notB, zivo
      ? { roughness: 0.62, clearcoat: 0.25, sheen: 0.35, sheenColor: new THREE.Color(0x8d7ee0), side: THREE.BackSide }
      : { roughness: 0.6, clearcoat: 0.35, side: THREE.BackSide }));
    const rez = new THREE.Mesh(zdruzi(s.rez), rezM);
    const pokrov = new THREE.Mesh(zdruzi([...s.pokrov, ...s.pokrovKonec]), mat(barva, { roughness: 0.55, clearcoat: 0.3, side: THREE.DoubleSide }));
    group.add(zun, not, rez, pokrov);
    const mem = zivo ? new THREE.Mesh(zdruzi(s.mem), memMat) : null;
    if (mem) { group.add(mem); rezMreze.push(mem); memMreze.push(mem); }
    if (zivo) citMreze.push(not);
    mreze[ime] = { zun, not, rez, pokrov, naslov, opis, hex, zivo };
    rezMreze.push(rez); pokrovMreze.push(pokrov);
  }
  const perfM = new THREE.Mesh(zdruzi(perf), mat(0x8a4a1c, { roughness: 0.5, clearcoat: 0.4 }));
  const odebM = new THREE.Mesh(zdruzi(odeb), mat(0x9a3c14, { roughness: 0.45, clearcoat: 0.55, sheen: 0.4, sheenColor: new THREE.Color(0xe09a60) }));
  const pikMat = mat(0x8a4a1c, { vertexColors: true, roughness: 0.48, clearcoat: 0.45, side: THREE.DoubleSide });
  const pikG = piknjaGeo();
  const piknje = instance(pikG, pikMat, pikSez.concat(pikSezT));
  const ploscice = new THREE.Mesh(zdruzi(plosce), mat(0xe2c44a, { roughness: 0.42, clearcoat: 0.55, sheen: 0.4 }));
  const kalozaM = kaloza.length ? new THREE.Mesh(zdruzi(kaloza), mat(0xf4f0d8, { roughness: 0.4, clearcoat: 0.6 })) : null;
  group.add(perfM, odebM, piknje, ploscice);
  if (kalozaM) group.add(kalozaM);

  // ---------- celice spremljevalke: jedro (prerezano), veliko mitohondrijev (nekateri prerezani), ribosomi ----------
  const RJ = [0.019, 0.056, 0.019];
  const JEDRA = [[xC1, 0.16], [xC2, -0.33]];
  const jedG = [], jedRG = [];
  for (const [x, y] of JEDRA) {
    const g = new THREE.SphereGeometry(1, q(20), q(14), Math.PI, Math.PI); // polovica z < 0 (phi π … 2π: z = sin θ sin φ ≤ 0)
    preoblikuj(g, (v) => { v.multiplyScalar(1 + 0.05 * sum(v.x * 3 + x * 20, v.y * 3, v.z * 3)); v.set(v.x * RJ[0], v.y * RJ[1], v.z * RJ[2]); });
    jedG.push(g.translate(x, y, 0));
    const n = q(28), pos = [], rez = [], idx = [];
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * TAU;
      pos.push(x, y, 0, x + Math.cos(a) * RJ[0] * 0.998, y + Math.sin(a) * RJ[1] * 0.998, 0);
      rez.push(0, 0, Math.cos(a), Math.sin(a));
    }
    for (let i = 0; i < n; i++) idx.push(2 * i, 2 * i + 1, 2 * i + 3);
    // gostejša mreža za senčilnik ni potrebna: barva se računa na slikovno točko
    const g2 = new THREE.BufferGeometry();
    g2.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g2.setAttribute("aRez", new THREE.Float32BufferAttribute(rez, 2));
    g2.setIndex(idx);
    g2.computeVertexNormals();
    jedRG.push(g2);
  }
  // prerez jedra: dvojna ovojnica s porami, kromatin, jedrce (R = položaj, normiran na polosi jedra)
  const KODA_JEDRO = `
    float d = length(R);
    float g = zvS(P * 520.0) * 0.6 + zvS(P * 1300.0 + 3.0) * 0.4;
    bv = mix(${C3(new THREE.Color(B.nukleoplazma))}, ${C3(new THREE.Color(B.kromatin))} * 1.15, smoothstep(0.52, 0.7, g));
    float jc = length(vec2((R.x - 0.12) / 0.42, (R.y - 0.18) / 0.15));
    bv = mix(bv, ${C3(new THREE.Color(B.jedrce))} * (0.9 + 0.3 * g), smoothstep(1.0, 0.9, jc));
    float ov = smoothstep(0.86, 0.88, d), rz = smoothstep(0.915, 0.925, d) * (1.0 - smoothstep(0.945, 0.955, d));
    float pora = step(0.86, fract(atan(R.y, R.x) * 4.0));
    bv = mix(bv, ${C3(new THREE.Color(B.ovojnica))} * 0.8, ov * (1.0 - pora * 0.7));
    bv = mix(bv, vec3(0.86, 0.78, 1.0), rz * (1.0 - pora));
    zh = (g * 0.5 + (1.0 - smoothstep(1.0, 0.9, jc)) * -0.6) * 0.0006;`;
  const jedri = new THREE.Mesh(zdruzi(jedG), mat(B.jedro, { roughness: 0.32, clearcoat: 0.6 }));
  const jedriR = new THREE.Mesh(zdruzi(jedRG), rezMat(KODA_JEDRO, "jedro"));
  group.add(jedri, jedriR);
  // jedrne pore na površini
  const pore = V.beljakovine(V.posej(jedri, hi ? 70 : 20).map((t) => ({ p: t.p.addScaledVector(t.n, 0.0003), n: t.n })), B.ovojnica, 0.0022, { visina: 0.6, razp: 0.2 });
  group.add(pore);

  const LM = 3.4, mitK = [];
  const vJedru = (p, m) => JEDRA.some(([x, y]) => ((p.x - x) / (RJ[0] + m)) ** 2 + ((p.y - y) / (RJ[1] + m)) ** 2 + (p.z / (RJ[2] + m)) ** 2 < 1);
  for (const [xc, konci] of [[xC1, plS1], [xC2, plS2]]) {
    const rm = 0.0042, L = rm * (LM / 2 + 1);
    for (let i = 0, p = 0; i < (hi ? 46 : 22) && p < 6000; p++) {
      const y = Y0 + 0.04 + rnd() * (Y1 - Y0 - 0.08);
      if (konci.some((k) => Math.abs(y - k) < 0.05)) continue;
      const ri = rfC(konci)(y) - W_S - TM_C - rm * 1.15, a = Math.PI + rnd() * Math.PI, rr = ri * Math.sqrt(rnd());
      let dz = Math.sin(a) * rr, tip = "cel";
      const dx = Math.cos(a) * rr;
      if (dz > -rm) { dz = 0; tip = "pol"; }
      const pos = v3(xc + dx, y, dz);
      if (vJedru(pos, rm + L * 0.3)) continue;
      if (mitK.some((m) => Math.hypot(m.p.x - pos.x, m.p.z - pos.z) < rm * 2.1 && Math.abs(m.p.y - pos.y) < 2 * L)) continue;
      mitK.push({ p: pos, s: rm * (0.9 + 0.2 * rnd()), tip, nag: tip === "cel" ? [(rnd() - 0.5) * 0.4, (rnd() - 0.5) * 0.4] : [0, 0] });
      i++;
    }
  }
  const radM = hi ? 12 : 8;
  const kapsula = new THREE.CapsuleGeometry(1, LM, hi ? 4 : 2, radM);
  const polKaps = odrezi(new THREE.CapsuleGeometry(1, LM, hi ? 4 : 2, radM), (c) => c.x < -1e-4);
  const kapaG = (() => {
    const nu = hi ? 24 : 12, nv = hi ? 6 : 4, pos = [], idx = [];
    for (let i = 0; i <= nu; i++) for (let j = 0; j <= nv; j++) {
      const y = (i / nu - 0.5) * (LM + 2), ay = Math.max(0, Math.abs(y) - LM / 2), w = Math.sqrt(Math.max(0, 1 - ay * ay)) * 0.999;
      pos.push(0, y, ((j / nv) * 2 - 1) * w);
    }
    for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const a = i * (nv + 1) + j, b = a + 1, c = a + nv + 1, d = c + 1; idx.push(a, c, b, b, c, d); }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  })();
  const KODA_MITO = `
    float ay = max(abs(P.y) - ${F(LM / 2)}, 0.0), d = 1.0 - length(vec2(P.z, ay));
    float g = zvS(P * 6.0), aa = max(fwidth(P.y), 1e-4);
    bv = vec3(0.86, 0.5, 0.1) * (0.85 + 0.25 * g);
    bv = mix(bv, vec3(0.5, 0.23, 0.04), 1.0 - smoothstep(0.07, 0.11, d));
    bv = mix(bv, vec3(1.0, 0.88, 0.6), smoothstep(0.11, 0.14, d) * (1.0 - smoothstep(0.19, 0.22, d)));
    float cw = 0.85, ci = floor(P.y / cw), xl = (fract(P.y / cw) - 0.5) * cw;
    float reach = mod(ci, 2.0) < 0.5 ? (P.z + 1.0) * 0.5 : (1.0 - P.z) * 0.5;
    float cr = smoothstep(0.11 + aa, 0.11 - aa, abs(xl)) * step(0.14, d) * (1.0 - smoothstep(0.66, 0.74, reach)) * step(abs(P.y), ${F(LM / 2 + 0.4)});
    bv = mix(bv, vec3(1.0, 0.86, 0.48), cr);
    zh = cr * 0.0002 + g * 0.00005;`;
  const mitMat = mat(B.mitohondrij, { roughness: 0.36, clearcoat: 0.6 });
  const cele = mitK.filter((m) => m.tip === "cel"), pol = mitK.filter((m) => m.tip === "pol");
  const postavi = (m) => { o.position.copy(m.p); o.rotation.set(m.nag[0], m.tip === "pol" ? Math.PI / 2 : 0, m.nag[1]); o.scale.setScalar(m.s); o.updateMatrix(); return o.matrix; };
  const mitohondriji = new THREE.InstancedMesh(kapsula, mitMat, Math.max(1, cele.length));
  const mitPol = new THREE.InstancedMesh(polKaps, mitMat, Math.max(1, pol.length));
  const mitRez = new THREE.InstancedMesh(kapaG, rezMat(KODA_MITO, "mito"), Math.max(1, pol.length));
  mitohondriji.count = cele.length; mitPol.count = mitRez.count = pol.length;
  cele.forEach((m, i) => mitohondriji.setMatrixAt(i, postavi(m)));
  pol.forEach((m, i) => { const M = postavi(m); mitPol.setMatrixAt(i, M); mitRez.setMatrixAt(i, M); });
  group.add(mitohondriji, mitPol, mitRez);
  rezMreze.push(mitRez, jedriR);
  // ribosomi v gosti citoplazmi celic spremljevalk (v sitastih ceveh jih ni)
  const ribT = [];
  for (const [xc, konci] of [[xC1, plS1], [xC2, plS2]]) for (let i = 0; i < (hi ? 650 : 220); i++) {
    const y = Y0 + 0.02 + rnd() * (Y1 - Y0 - 0.04), ri = rfC(konci)(y) - W_S - TM_C - 0.002, a = Math.PI + rnd() * Math.PI, rr = ri * Math.sqrt(rnd());
    const p = v3(xc + Math.cos(a) * rr, y, Math.min(-0.0015, Math.sin(a) * rr));
    if (!vJedru(p, 0.001)) ribT.push(p);
  }
  const ribosomi = V.pike(ribT, B.ribosomi, 0.003, 0.35);
  group.add(ribosomi);

  // ---------- plazmodezme: razvejani kanalčki skozi steno med celico spremljevalko in sitasto cevjo ----------
  const plazG = [];
  for (const [xs, xc, konci, smer] of [[xS1, xC1, plS1, 1], [xS2, xC1, plS1, -1], [xS2, xC2, plS2, 1]]) {
    const xa = xs + smer * (rS - W_S - TM_S), xb = xc - smer * (rC - W_S - TM_C), xm = xa + (xb - xa) * 0.45;
    for (let i = 0; i < (hi ? 8 : 4); i++) {
      const y = -0.7 + (i + 0.3 + rnd() * 0.4) * (1.4 / (hi ? 8 : 4));
      if (konci.some((k) => Math.abs(y - k) < 0.05)) continue;
      const z = -0.0012;
      plazG.push(cev([v3(xa, y, z), v3(xm, y, z)], 0.0011, 3, 5));
      for (const s of [-1, 1]) plazG.push(cev([v3(xm, y, z), v3(xm + (xb - xm) * 0.4, y + s * 0.002, z), v3(xb, y + s * 0.0045, z)], 0.0009, 5, 5));
    }
  }
  const plazmodezme = new THREE.Mesh(zdruzi(plazG), mat("#ff7ad9", { roughness: 0.35, clearcoat: 0.7, emissive: new THREE.Color("#ff7ad9").multiplyScalar(0.25) }));
  group.add(plazmodezme);

  // ---------- sitaste cevi: plastidi s škrobom ob steni in vlakna beljakovine P ----------
  const plastSez = [];
  for (const xc of [xS1, xS2]) for (let i = 0; i < 9; i++) {
    const psi = Math.PI * (1.15 + rnd() * 0.7), r = rS - W_S - TM_S - 0.009;
    plastSez.push({ p: v3(xc + r * Math.cos(psi), Y0 + 0.1 + rnd() * 1.4, r * Math.sin(psi)), s: 0.8 + rnd() * 0.5 });
  }
  const pK = [];
  for (const [xc, plo] of [[xS1, plS1], [xS2, plS2]]) for (let i = 0; i < (hi ? 7 : 4); i++) {
    const psi = Math.PI * (1.2 + rnd() * 0.6), r = (rS - W_S - TM_S) * (0.55 + rnd() * 0.35), pts = [];
    const y0 = Y0 + 0.05 + rnd() * 0.6, y1 = Math.min(Y1 - 0.04, y0 + 0.5 + rnd() * 0.5);
    for (let j = 0; j <= 10; j++) {
      const t = j / 10, y = y0 + (y1 - y0) * t, pp = psi + 0.3 * Math.sin(t * 6 + i);
      if (plo.some((k) => Math.abs(y - k) < 0.015)) continue;
      pts.push(v3(xc + r * Math.cos(pp), y, Math.min(-0.004, r * Math.sin(pp))));
    }
    if (pts.length > 4) pK.push(new THREE.CatmullRomCurve3(pts));
  }
  const pBelj = V.vlakna(pK, 0.0016, "#62e6d8", { sij: 0.5, seg: hi ? 40 : 16, rad: hi ? 5 : 3 });
  const plastidi = instance(preoblikuj(new THREE.SphereGeometry(0.0085, q(10), q(8)), (v) => v.multiplyScalar(1 + 0.08 * sum(v.x * 300, v.y * 300, v.z * 300))), mat(B.skrob, { roughness: 0.45, clearcoat: 0.5 }), plastSez);
  group.add(pBelj, plastidi);

  // ---------- kambij: ozke delujoče se celice med ksilemom in floemom (dvokaličnice) ----------
  const kamZad = [], kamSpr = [], kzB = [], ksB = [], KX = [0.077, 0.091], KW = 0.0125, KD = 0.06;
  const kamStena = new THREE.Color(0xb8d86a), kamCit = new THREE.Color(0x4a3c96), kamJed = new THREE.Color(B.jedro), _kc = new THREE.Color();
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
  group.add(kambij, kambijPokrov);
  pokrovMreze.push(kambijPokrov);

  // ---------- tok: voda navzgor po ksilemu, sladkorji po floemu ----------
  const vodaPoti = [], sladPoti = [];
  for (const [xc, r0, n] of [[xV1, rV1, 12], [xV2, rV2, 16]]) for (let i = 0; i < n; i++) {
    const a = Math.PI * (1.15 + rnd() * 0.7), rr = (r0 - 0.03) * (0.3 + rnd() * 0.65);
    const x = xc + rr * Math.cos(a), z = rr * Math.sin(a);
    vodaPoti.push({ pot: new THREE.LineCurve3(v3(x, Y0 + 0.01, z), v3(x, Y1 - 0.01, z)), f: rnd(), v: 0.16 + rnd() * 0.05 });
  }
  for (let i = 0; i < 10; i++) {
    // po prvi traheidi navzgor, skozi piknje v drugo in naprej navzgor
    const z = -0.025 - rnd() * 0.02, yp = -0.15 + rnd() * 0.4;
    vodaPoti.push({ pot: new THREE.CatmullRomCurve3([v3(xT1, Y0 + 0.01, z), v3(xT1 + 0.01, yp - 0.15, z), v3((xT1 + xT2) / 2, yp, z), v3(xT2 - 0.01, yp + 0.15, z), v3(xT2, Y1 - 0.01, z)]), f: rnd(), v: 0.1 + rnd() * 0.04 });
  }
  for (const [xc, n] of [[xS1, 12], [xS2, 12]]) for (let i = 0; i < n; i++) {
    const a = Math.PI * (1.2 + rnd() * 0.6), rr = (rS - 0.03) * (0.2 + rnd() * 0.7);
    const x = xc + rr * Math.cos(a), z = rr * Math.sin(a);
    sladPoti.push({ pot: new THREE.LineCurve3(v3(x, Y1 - 0.01, z), v3(x, Y0 + 0.01, z)), f: rnd(), v: 0.07 + rnd() * 0.03 });
  }
  for (const [xc, xs] of [[xC1, xS1], [xC2, xS2], [xC1, xS2]]) for (let i = 0; i < 3; i++) {
    // nalaganje sladkorjev iz celice spremljevalke v sitasto cev
    const y = -0.5 + rnd() * 1.1, z = -0.02;
    sladPoti.push({ pot: new THREE.CatmullRomCurve3([v3(xc, y + 0.05, z), v3((xc + xs) / 2, y, z), v3(xs, y - 0.08, z), v3(xs, y - 0.35, z)]), f: rnd(), v: 0.12 });
  }
  const vodaM = new THREE.InstancedMesh(new THREE.SphereGeometry(0.0115, q(10), q(8)), mat(0x3f9cff, { roughness: 0.2, clearcoat: 1, emissive: 0x0a2a66 }), vodaPoti.length);
  const sladM = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.012, 1), mat(0xf0a040, { roughness: 0.3, clearcoat: 0.8, emissive: 0x3a1a00 }), sladPoti.length);
  const _p = v3(0, 0, 0);
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

  // rahle razlike v svetlosti med ponovljenimi deli
  {
    const c = new THREE.Color();
    for (const m of [piknje, mitohondriji, mitPol, plastidi]) {
      if (m.instanceColor) continue;
      for (let i = 0; i < m.instanceMatrix.count; i++) { const k = 0.86 + 0.24 * V.hash(i * 1.37, m.instanceMatrix.count * 0.11, 7); m.setColorAt(i, c.setRGB(k, k, k)); }
    }
  }

  // ---------- deli ----------
  const T = { trahee: [xV2 - rV2 + 0.004, 0.55, 0.001], traheide: [xT1 - rT + 0.003, -0.3, 0.001], sitaste: [xS1 - rS + 0.003, 0.35, 0.001], spremljevalke: [xC1 + rC - 0.004, -0.5, 0.001] };
  for (const [ime, m] of Object.entries(mreze)) {
    const meshes = [m.zun, m.rez, m.pokrov].concat(m.zivo ? [] : [m.not]);
    if (ime === "trahee") meshes.push(perfM);
    del(ime, m.naslov, m.opis, m.hex, meshes, T[ime]);
  }
  del("odebelitve", "Odebelitve z lesovino", "Vijačnica iz lesovine (lignina) utrjuje steno ozke traheje, da se cev pod podtlakom ne sesede; širša traheja ima odebeljeno vso steno, tanke ostanejo le piknje.", "#9a3c14",
    [odebM], [xV1 + 0.02, 0.4, -rV1 + 0.03]);
  del("piknje", "Piknje", "Tanka mesta v olesenelih stenah, obokana z robom sekundarne stene; skozi njih voda prehaja iz celice v celico.", "#8a4a1c", [piknje], pikSezT[5].p.toArray());
  del("sitaste-ploscice", "Sitaste ploščice", "Prečne stene sitastih cevi z luknjicami, obloženimi s kalozo; skozi njih se raztopina sladkorjev pretaka iz celice v celico.", "#e2c44a",
    kalozaM ? [ploscice, kalozaM] : [ploscice], [xS1, plS1[0], -0.03]);
  del("membrana", "Celična membrana", "Žive celice floema imajo tik pod steno celično membrano; v prerezu se vidi lipidni dvosloj (debelina je povečana). Mrtve celice ksilema je nimajo.", B.dvosloj, memMreze, [xS1 - rS + W_S + 0.002, -0.05, 0]);
  del("citoplazma", "Citoplazma", "V sitasti cevi je le tanka plast ob steni, sredina je prosta za tok; celica spremljevalka ima gosto citoplazmo z ribosomi.", "#4a3c96", [...citMreze, ribosomi], [xC1 + 0.012, 0.45, -0.018]);
  del("jedro", "Jedro celice spremljevalke", "Sitaste cevi nimajo jedra; namesto njih delo upravlja jedro sosednje celice spremljevalke. V prerezu se vidijo kromatin, jedrce in dvojna ovojnica.", B.jedro, [jedri, jedriR, pore], [xC1, 0.16, 0.001]);
  const mT = (pol[3] || pol[0] || cele[0]).p;
  del("mitohondrij", "Mitohondriji", "V celicah spremljevalkah jih je veliko, ker nalaganje sladkorjev v sitaste cevi porablja energijo (ATP); v prerezu se vidijo kriste.", B.mitohondrij, [mitohondriji, mitPol, mitRez], mT.toArray());
  del("plazmodezme", "Plazmodezme", "Razvejani kanalčki skozi steno med celico spremljevalko in sitasto cevjo; po njih potujejo sladkorji, beljakovine in signali.", "#ff7ad9", [plazmodezme], [(xS1 + rS + xC1 - rC) / 2, 0.02, 0]);
  del("p-beljakovina", "Beljakovina P", "Vlakna beljakovine v sitasti cevi; ob poškodbi hitro zamašijo sitaste ploščice, da sok ne izteka.", "#62e6d8", [pBelj], pK[0].getPoint(0.5).toArray());
  del("plastidi", "Plastidi", "Redki plastidi s škrobom ob steni sitaste cevi; večina organelov in jedro med razvojem propadejo.", B.skrob, [plastidi], plastSez[2].p.toArray());
  del("kambij", "Kambij", "Plast ozkih celic, ki se delijo, med ksilemom in floemom; navznoter tvori nov ksilem, navzven nov floem, zato se steblo debeli.", "#b8d86a",
    [kambij, kambijPokrov], [KX[0], -0.62, 0.002]);
  del("tok-vode", "Tok vode", "Voda z mineralnimi snovmi potuje po ksilemu navzgor; vleče jo izhlapevanje iz listov.", "#3f9cff", [vodaM], [xV2 + 0.02, 0.1, -0.04]);
  del("tok-sladkorjev", "Tok sladkorjev", "Sladkorji iz listov potujejo po floemu tja, kjer jih rastlina porablja ali shranjuje, na primer v korenine in plodove.", "#f0a040",
    [sladM], [xS2 - 0.01, -0.2, -0.04]);

  // Ves košček rahlo zasukamo proti privzetemu pogledu, da je prerez viden bolj od spredaj in je snop širši.
  const zasuk = new THREE.Matrix4().makeRotationY(-0.3);
  group.children.forEach((m) => m.applyMatrix4(zasuk));
  deli.forEach((d) => { d.tocka = new THREE.Vector3(...d.tocka).applyMatrix4(zasuk).toArray().map((x) => Math.round(x * 1000) / 1000); });

  // ---------- nadzor ----------
  const nastaviTok = (v) => { vodaM.visible = v === "voda"; sladM.visible = v === "sladkorji"; };
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
  if (z.prikaz) nadzor[1].vrednost = z.prikaz;
  nadzor[1].ob(nadzor[1].vrednost);

  V.poliraj(group, deli, {
    trahee: { tex: "vlakna", rf: 60, k: 1.4, b: 0.22, lisa: 0.12, f: 6 },
    traheide: { tex: "vlakna", rf: 60, k: 1.4, b: 0.22, lisa: 0.12, f: 6 },
    sitaste: { tex: "gube", rf: 50, k: 1.4, b: 0.24, lisa: 0.14, f: 6 },
    spremljevalke: { tex: "gube", rf: 50, k: 1.4, b: 0.24, lisa: 0.14, f: 6 },
    odebelitve: { tex: "gube", rf: 260, k: 1.0, b: 0.2 },
    piknje: { tex: "zrna", rf: 400, k: 0.6 },
    "sitaste-ploscice": { tex: "zrna", rf: 300, k: 0.8 },
    citoplazma: { tex: "fino", rf: 170, k: 1.1, b: 0.24, lisa: 0.2, f: 14 },
    jedro: { tex: "zrna", rf: 300, k: 1 },
    mitohondrij: { tex: "gube", rf: 500, k: 0.8 },
    plastidi: { tex: "zrna", rf: 500, k: 0.6 },
    plazmodezme: { tex: null },
    kambij: { tex: "zrna", rf: 200, k: 0.8 },
    "tok-vode": { tex: null },
    "tok-sladkorjev": { tex: null },
  });
  // stikalo »Barve kot v učbeniku« (po poliranju, da shrani končne barve)
  nadzor.push(V.barveUcbenika(deli, {
    trahee: "#c98a4a", traheide: "#b77b3e", sitaste: "#8fc060", spremljevalke: "#79b04e", odebelitve: "#8a2e1a",
    piknje: "#5a3418", "sitaste-ploscice": "#e8d27a", "p-beljakovina": "#e97fb8", plastidi: "#f2ecd6", kambij: "#b8d86a",
    "tok-vode": "#3f9cff", "tok-sladkorjev": "#f0a040",
  }));

  return {
    group,
    oder: "celica",
    pogled: [-0.42, 0.53, 0.73], // smer kamere: yaw −30°, pitch 32° – vidijo se odprtine cevi in prerez
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
