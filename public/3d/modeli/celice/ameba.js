// Ameba (Amoeba proteus): enocelični praživali spreminja obliko s panožicami; odrezan osmi del pokaže notranjost.
// Pogodba graditelja: docs/3d.md. THREE pride od kompleta; skupni videz celic iz public/3d/celice-videz.js.
import { videzCelic, BARVE as B } from "../../celice-videz.js";

export const info = {
  id: "celica-ameba",
  naslov: "Ameba",
  podrocje: "celice",
  predmet: "BIO",
  opis: "Ameba je enocelični organizem iz sladkih voda, ki se premika in hrani s panožicami. Gumb »Pogoltni hrano« pokaže, kako obda in pogoltne drobno algo. Zrnc in mehurčkov je manj kot v resnici.",
  poskusi: "Pritisni »Pogoltni hrano« in opazuj, kako panožice obdajo delček hrane.",
  merilo: { m: 444e-6, oznaka: "444 µm" }, // premer enotske krogle = 2 · 275 µm / 1,24
};

export function zgradi(THREE, ctx = {}) {
  const hi = ctx.kakovost !== "nizka";
  const q = (n) => Math.max(3, Math.round(n * (hi ? 1 : 0.55)));
  const gib = ctx.gibanje !== false;
  const group = new THREE.Group();
  const deli = [];
  const odpad = [];
  const V = videzCelic(THREE, { hi, odpad });
  let seme = 53;
  // ---------- orodja (enaka kot v zivalska.js, z dodatki za ploskve in prereze) ----------
  const rnd = () => ((seme = (seme * 16807) % 2147483647) - 1) / 2147483646;
  const { sum, fbm } = V;
  const gladko = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  // mat(barva, {…}): mokra organska površina (relief in vlažen videz doda V.poliraj na koncu).
  function mat(barva, o = {}) {
    const m = new THREE.MeshPhysicalMaterial(Object.assign({
      color: barva, roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.22,
      sheen: 0.35, sheenColor: new THREE.Color(barva).lerp(new THREE.Color(0xffffff), 0.45).multiplyScalar(0.8), sheenRoughness: 0.45,
    }, o));
    odpad.push(m);
    return m;
  }
  // ---------- debele membrane (debelina je povečana, da je vidna) ----------
  // Plasti na prerezu od notranje (s = 0) do zunanje strani (s = 1): [s0, s1, barva].
  const _bela = new THREE.Color(0xffffff);
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
  function del(id, ime, opis, barva, meshes, tocka) {
    meshes.forEach((m) => { m.userData.del = id; });
    deli.push({ id, ime, opis, barva, meshes, tocka: tocka.map((x) => Math.round(x * 1000) / 1000) });
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
  // Celica leži na podlagi; skupino »tel« nagnemo proti gledalcu, da je vidna kot pod mikroskopom.
  const tel = new THREE.Group();
  tel.rotation.x = 0.5;
  tel.scale.setScalar(1.24); // 1 enota v »tel« = 275 µm, v skupini 275 / 1,24 ≈ 222 µm
  group.add(tel);
  tel.updateMatrix();

  // ---------- spremenljiva oblika: sploščeno telo + panožice ----------
  // 1 enota (v »tel«) = 275 µm. Smer d → polmer f(d) = osnova(d) + Σ L·exp((d·p − 1)/w²).
  const AX = 0.34, AY = 0.23, AZ = 0.3;
  const osnova = (x, y, z) => 1 / Math.sqrt((x / AX) ** 2 + (y / AY) ** 2 + (z / AZ) ** 2);
  const smerH = (kot, dvig = 0) => new THREE.Vector3(Math.cos(kot), dvig, Math.sin(kot)).normalize();
  const HRANA_SMER = smerH(0.95); // proti gledalcu desno (zunaj izreza)
  // panožica = kapsula od središča do razdalje L (konica), polširina W
  const panozice = [
    { p: smerH(Math.PI * 1.06, 0.12), L0: 0.8, W: 0.13, f: 0.0, h: 0.31 },
    { p: smerH(Math.PI * 0.66, -0.08), L0: 0.74, W: 0.11, f: 2.1, h: 0.27 },
    { p: smerH(-0.28, 0.1), L0: 0.78, W: 0.125, f: 4.0, h: 0.23 },
    { p: smerH(-Math.PI * 0.58, -0.05), L0: 0.72, W: 0.115, f: 1.3, h: 0.35 },
    { p: smerH(-Math.PI * 0.84, 0.2), L0: 0.6, W: 0.1, f: 3.3, h: 0.29 },
    { p: smerH(Math.PI * 0.36, -0.15), L0: 0.58, W: 0.1, f: 5.1, h: 0.33 },
    // trije za požiranje (prehranjevalna čaša), sprva skriti v telesu
    { p: smerH(0.95 + 0.36, 0.02), L0: 0, W: 0.075, f: 0, h: 0, cas: true },
    { p: smerH(0.95 - 0.36, -0.02), L0: 0, W: 0.075, f: 0, h: 0, cas: true },
    { p: HRANA_SMER.clone(), L0: 0, W: 0.1, f: 0, h: 0, cas: true },
  ];
  panozice.forEach((x) => { x.L = x.L0; x.p0 = x.p.clone(); });
  function nastaviPanozice(t) {
    for (const x of panozice) {
      if (x.cas) continue;
      x.L = x.L0 * (0.8 + 0.2 * Math.sin(t * x.h + x.f));
      x.p.copy(x.p0).applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.07 * Math.sin(t * 0.21 + x.f)).normalize();
    }
  }
  // razdalja od središča do roba kapsule v smeri (x, y, z)
  function kapsula(x, y, z, p, W, L) {
    const c = x * p.x + y * p.y + z * p.z, rc = L - W;
    if (c <= 0 || rc <= 0) return 0;
    const s = Math.sqrt(Math.max(0, 1 - c * c));
    if (s > 1e-6) { const rs = W / s; if (rs * c <= rc) return rs; }
    return rc * c + Math.sqrt(Math.max(0, W * W - rc * rc * s * s));
  }
  const K = 26; // mehki maksimum: zaobljen prehod panožice v telo
  function oblika(x, y, z, dW, dL, b) {
    let e = Math.exp(K * b);
    for (const p of panozice) { const r = kapsula(x, y, z, p.p, p.W - dW, p.L - dL); if (r > 0) e += Math.exp(K * r); }
    return Math.log(e) / K;
  }
  const fZun = (x, y, z, n) => oblika(x, y, z, 0, 0, osnova(x, y, z)) * (1 + 0.03 * n);
  const fNot = (x, y, z, n) => oblika(x, y, z, 0.034, 0.085, osnova(x, y, z) * 0.84 - 0.02) * (1 + 0.04 * n) - 0.012;

  // Lupina z odrezanim osmim delom (x < 0, y > 0, z > 0), ki si zapomni smeri oglišč za sprotno preoblikovanje.
  function dinLupina(ws, hs) {
    const zg = new THREE.SphereGeometry(1, ws, hs / 2, Math.PI / 2, Math.PI * 1.5, 0, Math.PI / 2);
    const sp = new THREE.SphereGeometry(1, ws, hs / 2, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const pokr = new THREE.SphereGeometry(1, Math.round(ws / 4), hs / 2, 0, Math.PI / 2, 0, Math.PI / 2);
    return [zdruzi([zg, sp]), zdruzi([pokr])].map((g) => {
      const p = g.attributes.position, n = p.count, smeri = new Float32Array(p.array), sum_ = new Float32Array(n);
      const kljuci = new Map(), vari = [];
      for (let k = 0; k < n; k++) {
        const x = smeri[3 * k], y = smeri[3 * k + 1], z = smeri[3 * k + 2];
        sum_[k] = fbm(x * 2.2 + 5, y * 2.2, z * 2.2);
        const kl = Math.round(x * 2e4) + "," + Math.round(y * 2e4) + "," + Math.round(z * 2e4);
        if (kljuci.has(kl)) kljuci.get(kl).push(k); else kljuci.set(kl, [k]);
      }
      for (const v of kljuci.values()) if (v.length > 1) vari.push(v);
      g.userData = { smeri, sum: sum_, vari };
      return g;
    });
  }
  function oblikuj(g, f) {
    const { smeri, sum: s, vari } = g.userData, p = g.attributes.position.array;
    for (let k = 0; k < s.length; k++) {
      const x = smeri[3 * k], y = smeri[3 * k + 1], z = smeri[3 * k + 2], r = f(x, y, z, s[k]);
      p[3 * k] = x * r; p[3 * k + 1] = y * r; p[3 * k + 2] = z * r;
    }
    g.attributes.position.needsUpdate = true;
    g.computeVertexNormals();
    const nr = g.attributes.normal.array;
    for (const v of vari) { // zvari normale na šivih krp
      let a = 0, b = 0, c = 0;
      for (const k of v) { a += nr[3 * k]; b += nr[3 * k + 1]; c += nr[3 * k + 2]; }
      const l = Math.hypot(a, b, c) || 1;
      for (const k of v) { nr[3 * k] = a / l; nr[3 * k + 1] = b / l; nr[3 * k + 2] = c / l; }
    }
    g.computeBoundingSphere();
  }
  // trakovi na treh ravninah reza med dvema plastema
  const LOKI = [
    (t) => [0, Math.cos(t * Math.PI / 2), Math.sin(t * Math.PI / 2)],
    (t) => [-Math.sin(t * Math.PI / 2), Math.cos(t * Math.PI / 2), 0],
    (t) => [-Math.cos(t * Math.PI / 2), 0, Math.sin(t * Math.PI / 2)],
  ];
  const NL = q(56);
  const lokSmeri = LOKI.map((L) => { const a = []; for (let i = 0; i <= NL; i++) a.push(new THREE.Vector3(...L(i / NL)).normalize()); return a; });
  const lokSum = lokSmeri.map((a) => a.map((d) => fbm(d.x * 2.2 + 5, d.y * 2.2, d.z * 2.2)));
  function trak() {
    const g = zdruzi(lokSmeri.map((a) => pas(a.map((d) => d.clone()), a.map((d) => d.clone().multiplyScalar(0.5)))));
    return g;
  }
  function oblikujTrak(g, f1, f2, zamik = 0) {
    const p = g.attributes.position.array;
    let k = 0;
    lokSmeri.forEach((a, j) => a.forEach((d, i) => {
      const s = lokSum[j][i], r1 = f1(d.x, d.y, d.z, s), r2 = f2(d.x, d.y, d.z, s);
      // trak rahlo odmaknemo od ravnine reza proti gledalcu, da se ne prekriva s plastmi
      const ox = j === 0 ? -zamik : 0, oy = j === 2 ? zamik : 0, oz = j === 1 ? zamik : 0;
      p[k++] = d.x * r1 + ox; p[k++] = d.y * r1 + oy; p[k++] = d.z * r1 + oz;
      p[k++] = d.x * r2 + ox; p[k++] = d.y * r2 + oy; p[k++] = d.z * r2 + oz;
    }));
    g.attributes.position.needsUpdate = true;
    g.computeBoundingSphere();
  }

  // ---------- celična membrana (prozorna), ektoplazma, endoplazma ----------
  const [memG, memPG] = dinLupina(q(168), q(84));
  const memMat = V.steklo(mat(B.membrana, { side: THREE.FrontSide }), { a: 0.13, rf: 40, k: 0.9, rob: "#8c9cff", rk: 1.35 });
  const membrana = new THREE.Mesh(memG, memMat);
  const memPokrov = new THREE.Mesh(memPG, memMat);
  membrana.renderOrder = memPokrov.renderOrder = 5;
  memPokrov.visible = false;
  // membrana na ploskvah reza kot dvosloj (debelina povečana); položaji se osvežijo ob vsaki spremembi oblike
  const PLM = [[0, 0.2, new THREE.Color(0x6b3fc8)], [0.34, 0.66, new THREE.Color(0xf6d9e6)], [0.8, 1, new THREE.Color(0x6b3fc8)]], SLM = vrsticePlasti(PLM);
  const NLOK = [new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0)];
  const memTrak = new THREE.Mesh(zdruziPlasti(lokSmeri.map((a, j) => trakPlasti(a.map((d) => d.clone().multiplyScalar(0.5)), a.map((d) => d.clone()), NLOK[j], PLM))), matPlasti({ roughness: 0.5, clearcoat: 0.35 }));
  function oblikujPlasti(g, f1, f2, zamik) {
    const p = g.attributes.position.array;
    let k = 0;
    lokSmeri.forEach((a, j) => {
      const ox = j === 0 ? -zamik : 0, oy = j === 2 ? zamik : 0, oz = j === 1 ? zamik : 0;
      const r1 = a.map((d, i) => f1(d.x, d.y, d.z, lokSum[j][i])), r2 = a.map((d, i) => f2(d.x, d.y, d.z, lokSum[j][i]));
      for (const sv of SLM) a.forEach((d, i) => { const r = r2[i] + (r1[i] - r2[i]) * sv; p[k++] = d.x * r + ox; p[k++] = d.y * r + oy; p[k++] = d.z * r + oz; });
    });
    g.attributes.position.needsUpdate = true;
    g.computeBoundingSphere();
  }
  const ektoTrak = new THREE.Mesh(trak(), mat(0x8fd0e0, { roughness: 0.2, clearcoat: 0.9, transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide }));
  ektoTrak.renderOrder = 3;
  const [endG, endPG] = dinLupina(q(144), q(72));
  for (const g of [endG, endPG]) {
    const { smeri, sum: s } = g.userData, col = new Float32Array(s.length * 3), c = new THREE.Color();
    for (let k = 0; k < s.length; k++) {
      const t = 0.5 + 0.5 * sum(smeri[3 * k] * 38, smeri[3 * k + 1] * 38, smeri[3 * k + 2] * 38);
      c.setScalar(1 - 0.64 * gladko(0.55, 0.8, t) * 0.8); col[3 * k] = c.r; col[3 * k + 1] = c.g; col[3 * k + 2] = c.b;
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  }
  // odtenek je v barvi materiala, barve oglišč le senčijo (tako stikalo učbeniških barv doseže tudi svetlo barvo)
  const endMat = mat(0x4b3d9a, { vertexColors: true, roughness: 0.6, clearcoat: 0.3, clearcoatRoughness: 0.2, sheen: 0.3, sheenColor: new THREE.Color(0x8d7ee0), side: THREE.DoubleSide });
  const endoplazma = new THREE.Mesh(endG, endMat);
  const endPokrov = new THREE.Mesh(endPG, endMat);
  endPokrov.visible = false;
  tel.add(membrana, memPokrov, memTrak, ektoTrak, endoplazma, endPokrov);
  const fMem2 = (x, y, z, n) => fZun(x, y, z, n) - 0.008;
  function oblikujVse() {
    oblikuj(memG, fZun); oblikuj(endG, fNot);
    if (memPokrov.visible) { oblikuj(memPG, fZun); oblikuj(endPG, fNot); }
    oblikujPlasti(memTrak.geometry, fZun, fMem2, 0.0015);
    oblikujTrak(ektoTrak.geometry, fMem2, fNot, 0.001);
    postaviBeljakovine();
  }

  // ---------- jedro ----------
  const J = new THREE.Vector3(-0.04, -0.035, 0.05);
  const jGeo = preoblikuj(new THREE.SphereGeometry(1, q(40), q(28)), (v) => {
    const r = Math.hypot(v.x, v.z);
    v.y *= 0.42 * (1 - 0.35 * Math.exp(-r * r * 6)); // ploščato, na sredi vbočeno
    v.multiplyScalar(1 + 0.03 * sum(v.x * 4, v.y * 4, v.z * 4));
  }).scale(0.075, 0.075, 0.075);
  {
    const p = jGeo.attributes.position, col = [], c = new THREE.Color();
    for (let k = 0; k < p.count; k++) { const t = 0.5 + 0.5 * sum(p.getX(k) * 160, p.getY(k) * 160, p.getZ(k) * 160); c.set(B.jedro).lerp(new THREE.Color(B.kromatin), gladko(0.55, 0.75, t)); col.push(c.r, c.g, c.b); }
    jGeo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  }
  const jedro = new THREE.Mesh(jGeo, mat(0xffffff, { vertexColors: true, roughness: 0.48, clearcoat: 0.4, sheen: 0.4, sheenColor: new THREE.Color(B.nukleoplazma) }));
  jedro.position.copy(J); jedro.rotation.set(0.25, 0.4, -0.15);
  tel.add(jedro);
  // jedrne pore na površini dvojne ovojnice
  const pore = (() => {
    const p = jGeo.attributes.position, n = jGeo.attributes.normal, N = hi ? 110 : 60, nn = new THREE.Vector3();
    const m = new THREE.InstancedMesh(new THREE.TorusGeometry(0.0028, 0.0011, 3, q(10)), mat(B.ovojnica, { roughness: 0.4, clearcoat: 0.7 }), N);
    for (let k = 0; k < N; k++) {
      const i = Math.floor(rnd() * p.count);
      nn.fromBufferAttribute(n, i);
      o.position.fromBufferAttribute(p, i).addScaledVector(nn, 0.0004); o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), nn); o.scale.setScalar(0.85 + rnd() * 0.3); o.updateMatrix();
      m.setMatrixAt(k, o.matrix);
    }
    return m;
  })();
  jedro.add(pore);

  // ---------- krčljivi mehurček (utripa) ----------
  const KM = new THREE.Vector3(-0.24, -0.02, 0.1);
  const krcljivi = new THREE.Mesh(new THREE.SphereGeometry(1, q(32), q(22)), V.steklo(mat(B.vakuola), { a: 0.42, rf: 3, k: 0.3, rob: "#9ff0ff", rk: 1.3, difuzno: 0.6, iri: 0.3 }));
  krcljivi.renderOrder = 4;
  krcljivi.position.copy(KM);
  tel.add(krcljivi);
  function utrip(t) {
    const f = (t / 7) % 1; // počasi se polni, nato se hitro izprazni
    const r = f < 0.86 ? 0.022 + 0.05 * Math.pow(f / 0.86, 0.7) : 0.072 * (1 - (f - 0.86) / 0.14) + 0.012;
    krcljivi.scale.setScalar(r);
  }
  utrip(4);

  // ---------- prebavni mehurčki s hrano ----------
  const prebSez = [[-0.12, -0.06, 0.2, 0.048], [0.12, -0.05, 0.1, 0.04], [-0.34, -0.05, -0.02, 0.036], [0.15, -0.05, -0.2, 0.038], [0.0, -0.06, -0.1, 0.03]]
    .map(([x, y, z, r]) => ({ p: new THREE.Vector3(x, y, z), s: r }));
  const hranaGeo = preoblikuj(new THREE.SphereGeometry(1, q(14), q(10)), (v) => v.multiplyScalar(1 + 0.25 * sum(v.x * 2 + 3, v.y * 2, v.z * 2)));
  const hranaSez = [];
  prebSez.forEach((m, i) => { for (let k = 0; k < 2 + (i % 2); k++) hranaSez.push({ p: m.p.clone().add(new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(m.s * 0.7)), r: new THREE.Euler(rnd() * 3, rnd() * 3, 0), s: m.s * (0.32 + rnd() * 0.15), b: i }); });
  const N_PREB = prebSez.length + 1, N_HRANA = hranaSez.length + 1;
  const prebMat = V.steklo(mat(0xe8e2a0), { a: 0.22, rf: 3, k: 0.4, rob: "#fff0a8", rk: 1.1, difuzno: 0.5, iri: 0.3 });
  const prebavni = new THREE.InstancedMesh(new THREE.SphereGeometry(1, q(24), q(16)), prebMat, N_PREB);
  prebavni.renderOrder = 4;
  const hrana = new THREE.InstancedMesh(hranaGeo, mat(0x4e7a2e, { roughness: 0.55, clearcoat: 0.3, sheen: 0.3 }), N_HRANA);
  tel.add(prebavni, hrana);

  // ---------- zrnca in kristali v endoplazmi ----------
  const zrnSez = [], krisSez = [];
  let pk = 0;
  while (zrnSez.length < (hi ? 360 : 220) && pk++ < 20000) {
    const v = new THREE.Vector3(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1);
    const l = v.length(); if (l > 1 || l < 0.05) continue;
    const d = v.clone().divideScalar(l);
    const p = d.clone().multiplyScalar(osnova(d.x, d.y, d.z) * 0.7 * Math.cbrt(l));
    if (p.distanceTo(J) < 0.09 || p.distanceTo(KM) < 0.08) continue;
    if (zrnSez.length < 70) krisSez.push({ p, r: new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3), s: 0.7 + rnd() * 0.6 });
    zrnSez.push({ p, s: 0.6 + rnd() * 0.8 });
  }
  const zrnca = instance(new THREE.IcosahedronGeometry(0.0055, 0), mat(B.glikogen, { roughness: 0.35, clearcoat: 0.7 }), zrnSez);
  const kristali = instance(new THREE.OctahedronGeometry(0.008, 0).scale(1, 1.8, 1), mat(0xf4f0e0, { roughness: 0.1, clearcoat: 1, metalness: 0.1 }), krisSez);
  tel.add(zrnca, kristali);


  // ---------- mešički ob krčljivem mehurčku (zbirajo vodo iz citoplazme) ----------
  const satSez = [];
  for (let i = 0; i < (hi ? 22 : 12); i++) { const d = new THREE.Vector3(rnd() - 0.5, (rnd() - 0.5) * 0.6, rnd() - 0.5).normalize(); satSez.push({ p: KM.clone().addScaledVector(d, 0.085 + rnd() * 0.03), s: 0.006 + rnd() * 0.006 }); }
  const sateliti = instance(new THREE.SphereGeometry(1, q(12), q(9)), mat(B.mesicki, { roughness: 0.15, clearcoat: 1 }), satSez);
  tel.add(sateliti);

  // ---------- lizosomi ob prebavnih mehurčkih (z encimi se zlijejo z njimi) ----------
  const lizSez = [];
  prebSez.forEach((m) => { for (let k = 0; k < (hi ? 3 : 2); k++) { const d = new THREE.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(); lizSez.push({ p: m.p.clone().addScaledVector(d, m.s + 0.008), s: 0.009 + rnd() * 0.005 }); } });
  const lizosomi = instance(preoblikuj(new THREE.SphereGeometry(1, q(14), q(10)), (v) => v.multiplyScalar(1 + 0.08 * sum(v.x * 3, v.y * 3, v.z * 3))), mat(B.lizosom, { roughness: 0.2, clearcoat: 1 }), lizSez);
  tel.add(lizosomi);

  // ---------- mitohondriji: drobne paličice po vsej endoplazmi ----------
  const vNotr = (p, k = 0.66) => { const l = p.length() || 1; return l < osnova(p.x / l, p.y / l, p.z / l) * k; };
  const odrezan = (p) => p.x < 0.01 && p.y > -0.01 && p.z > -0.01;
  const mitSez = [];
  for (let t = 0; mitSez.length < (hi ? 420 : 160) && t < 40000; t++) {
    const p = new THREE.Vector3(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).multiply(new THREE.Vector3(AX, AY, AZ));
    if (!vNotr(p, 0.8) || odrezan(p) || p.distanceTo(J) < 0.09 || p.distanceTo(KM) < 0.1 || prebSez.some((m) => m.p.distanceTo(p) < m.s + 0.012)) continue;
    mitSez.push({ p, r: new THREE.Euler(rnd() * 3, rnd() * 3, rnd() * 3), s: 0.8 + rnd() * 0.5 });
  }
  const mitohondriji = instance(new THREE.CapsuleGeometry(0.0042, 0.011, 2, hi ? 7 : 5), mat(B.mitohondrij, { roughness: 0.3, clearcoat: 0.85 }), mitSez);
  tel.add(mitohondriji);

  // drobna zrnca v endoplazmi (majhna in temna)
  const prahT = [];
  for (let t = 0; prahT.length < (hi ? 4000 : 1600) && t < 80000; t++) {
    const p = new THREE.Vector3(rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1).multiply(new THREE.Vector3(AX, AY, AZ));
    if (vNotr(p, 0.8) && !odrezan(p)) prahT.push(p);
  }
  tel.add(V.pike(prahT, 0x7a68d0, 0.0042, 0.5));

  // ---------- beljakovine na membrani (sledijo obliki celice) ----------
  const nBel = hi ? 1300 : 380, belK = [], belS = [], belR = [];
  { // oglišča trikotnikov, izbranih po ploščini oblikovane membrane (enakomerno po površini, tudi po panožicah)
    nastaviPanozice(2); oblikuj(memG, fZun);
    const P = memG.attributes.position, ix = memG.index.array, nT = ix.length / 3, kum = new Float64Array(nT), a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    let vs = 0;
    for (let t = 0; t < nT; t++) { a.fromBufferAttribute(P, ix[3 * t]); b.fromBufferAttribute(P, ix[3 * t + 1]).sub(a); c.fromBufferAttribute(P, ix[3 * t + 2]).sub(a); vs += b.cross(c).length(); kum[t] = vs; }
    for (let i = 0; i < nBel; i++) {
      const x = rnd() * vs; let lo = 0, hi2 = nT - 1;
      while (lo < hi2) { const m = (lo + hi2) >> 1; if (kum[m] < x) lo = m + 1; else hi2 = m; }
      belK.push(ix[3 * lo + Math.floor(rnd() * 3)]); belS.push(0.7 + 0.6 * rnd()); belR.push(rnd() * 6.28);
    }
  }
  const belj = V.beljakovine(belK.map(() => ({ p: new THREE.Vector3(), n: new THREE.Vector3(0, 1, 0) })), B.beljakovine, 0.0042, { visina: 1.5 });
  tel.add(belj);
  const gor = new THREE.Vector3(0, 1, 0), bp = new THREE.Vector3(), bn = new THREE.Vector3();
  function postaviBeljakovine() {
    const P = memG.attributes.position, N = memG.attributes.normal;
    belK.forEach((k, i) => {
      bn.fromBufferAttribute(N, k); bp.fromBufferAttribute(P, k).addScaledVector(bn, 0.0015);
      o.position.copy(bp); o.quaternion.setFromUnitVectors(gor, bn); o.rotateY(belR[i]); o.scale.setScalar(belS[i]); o.updateMatrix();
      belj.setMatrixAt(i, o.matrix);
    });
    belj.instanceMatrix.needsUpdate = true;
    belj.computeBoundingSphere();
  }

  // ---------- plen: drobna alga, ki jo ameba pogoltne ----------
  const algaGeo = new THREE.SphereGeometry(0.038, q(20), q(14));
  {
    const p = algaGeo.attributes.position, col = [], c = new THREE.Color();
    for (let k = 0; k < p.count; k++) { const y = p.getY(k) / 0.038; c.set(y < 0.35 ? B.kloroplast : 0xb8e6a0); col.push(c.r, c.g, c.b); } // čašast kloroplast
    algaGeo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  }
  const alga = new THREE.Mesh(algaGeo, mat(0xffffff, { vertexColors: true, roughness: 0.42, clearcoat: 0.6, sheen: 0.4, sheenColor: new THREE.Color(0xb0e8a0) }));
  tel.add(alga);
  const ALGA_ZUNAJ = HRANA_SMER.clone().multiplyScalar(0.56).setY(0.0), ALGA_NOTRI = HRANA_SMER.clone().multiplyScalar(0.2).setY(-0.03);
  let faza = -1, fazaZac = 0, zadnjiT = 0, prikazanaNova = 1;
  const zadnjiPreb = { p: ALGA_NOTRI.clone(), s: 0 };
  function postaviHrano() {
    // stalni prebavni mehurčki + zadnji (pogoltnjena alga)
    prebSez.forEach((m, i) => { o.position.copy(m.p); o.rotation.set(0, 0, 0); o.scale.setScalar(m.s); o.updateMatrix(); prebavni.setMatrixAt(i, o.matrix); });
    o.position.copy(zadnjiPreb.p); o.scale.setScalar(Math.max(0.0001, zadnjiPreb.s)); o.updateMatrix(); prebavni.setMatrixAt(prebSez.length, o.matrix);
    hranaSez.forEach((h, i) => { o.position.copy(h.p); o.rotation.copy(h.r); o.scale.setScalar(h.s); o.updateMatrix(); hrana.setMatrixAt(i, o.matrix); });
    o.position.set(0, 0, 0); o.scale.setScalar(0.0001); o.updateMatrix(); hrana.setMatrixAt(hranaSez.length, o.matrix);
    prebavni.instanceMatrix.needsUpdate = hrana.instanceMatrix.needsUpdate = true;
    prebavni.computeBoundingSphere(); hrana.computeBoundingSphere();
  }
  postaviHrano();
  alga.position.copy(ALGA_ZUNAJ);
  const [pcA, pcB, pcC] = panozice.filter((x) => x.cas);
  // potek požiranja: f ∈ [0, 1] v 7 s
  function pozri(f) {
    const vrh = (a, b) => gladko(a, b, f);
    pcA.L = pcB.L = 0.25 + 0.47 * vrh(0, 0.4) * (1 - vrh(0.62, 0.95));
    pcC.L = Math.max(0, 0.25 + 0.26 * vrh(0.05, 0.35) + 0.2 * vrh(0.4, 0.58) - 0.5 * vrh(0.62, 0.95));
    const notri = vrh(0.6, 1);
    alga.position.copy(ALGA_ZUNAJ).lerp(ALGA_NOTRI, notri);
    zadnjiPreb.p.copy(alga.position);
    zadnjiPreb.s = 0.058 * vrh(0.48, 0.62);
    alga.rotation.y = f * 3;
  }

  // ---------- deli ----------
  const tZ = (d, k = 1) => { const v = d.clone().normalize(); return v.multiplyScalar(fZun(v.x, v.y, v.z, 0) * k).toArray(); };
  del("membrana", "Celična membrana", "Tanka prožna ovojnica celice iz dvosloja maščob z beljakovinami; ameba nima stene, zato lahko poljubno spreminja obliko. Debelina membrane je povečana.", "#9fb4ff",
    [membrana, memPokrov, memTrak, belj], tZ(new THREE.Vector3(0.35, 0.5, 0.75)));
  del("panozice", "Panožice", "Izrastki celice, s katerimi se ameba plazi in obdaja hrano; nastanejo, ko zrnata endoplazma steče v novo smer.", "#6a5ac8",
    [endoplazma], panozice[2].p.clone().multiplyScalar(panozice[2].L0 * 0.72).add(new THREE.Vector3(0, 0.03, 0)).toArray());
  const dE = new THREE.Vector3(-0.37, 0, 0.93).normalize();
  del("ektoplazma", "Ektoplazma", "Bistra, bolj čvrsta zunanja plast citoplazme tik pod membrano (gosta mreža aktinskih vlaken); na konicah panožic je najdebelejša.", "#bfe3ee",
    [ektoTrak], dE.clone().multiplyScalar((fMem2(dE.x, 0, dE.z, 0) + fNot(dE.x, 0, dE.z, 0)) / 2).add(new THREE.Vector3(0, 0.002, 0)).toArray());
  del("endoplazma", "Endoplazma", "Tekoča notranjost celice z zrnci hrane za zalogo in kristalčki odpadnih snovi; v njej plavajo jedro in mehurčki.", "#5b4bb0",
    [zrnca, kristali, endPokrov], krisSez.find((k) => k.p.y < 0 && k.p.x < -0.1 && k.p.z > 0.05)?.p.toArray() || krisSez[0].p.toArray());
  del("jedro", "Jedro", "Ploščato jedro z DNK in dvojno ovojnico s porami upravlja celico; ameba se razmnožuje tako, da se jedro in nato celica razdelita na dvoje.", B.jedro,
    [jedro, pore], [J.x, J.y + 0.03, J.z + 0.02]);
  del("krcljivi-mehurcek", "Krčljivi mehurček", "Zbira odvečno vodo, ki z osmozo vdira v celico, in jo izčrpa ven; tako ameba ne poči. Drobni mešički okoli njega mu vodo dovajajo.", B.vakuola,
    [krcljivi, sateliti], [KM.x, KM.y + 0.05, KM.z]);
  del("prebavni-mehurcki", "Prebavni mehurčki", "Mehurčki s pogoltnjeno hrano; encimi jo v njih prebavijo, ostanke pa ameba izloči.", "#e8e2a0",
    [prebavni, hrana], [prebSez[0].p.x, prebSez[0].p.y + 0.04, prebSez[0].p.z]);
  del("alga", "Alga (plen)", "Drobna zelena alga; ameba jo obda s panožicama, zapre v prebavni mehurček in prebavi.", B.kloroplast, [alga], ALGA_ZUNAJ.toArray());
  del("mitohondriji", "Mitohondriji", "Številne drobne paličice po vsej endoplazmi; s celičnim dihanjem pridobivajo energijo za gibanje in požiranje. Narisani so povečani.", B.mitohondrij,
    [mitohondriji], mitSez.find((m) => m.p.y < 0 && m.p.x < -0.05 && m.p.z > 0.05)?.p.toArray() || mitSez[0].p.toArray());
  del("lizosomi", "Lizosomi", "Mehurčki z encimi, ki se zlijejo s prebavnim mehurčkom in v njem razgradijo hrano.", B.lizosom, [lizosomi], lizSez[0].p.toArray());

  deli.forEach((d) => { d.tocka = new THREE.Vector3(...d.tocka).applyMatrix4(tel.matrix).toArray().map((x) => Math.round(x * 1000) / 1000); });

  // ---------- nadzor ----------
  let cela = false;
  const nadzor = [
    {
      tip: "gumb", id: "pozri", oznaka: "Pogoltni hrano",
      ob: () => {
        if (faza >= 0) return;
        if (!gib) { pozri(1); postaviHrano(); oblikujVse(); prikazanaNova = 0; alga.visible = true; return; }
        faza = 0; fazaZac = zadnjiT; prikazanaNova = 0; alga.visible = true;
      },
    },
    {
      tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["prerez", "Prerez"], ["cela", "Cela celica"]], vrednost: "prerez",
      ob: (v) => { cela = v === "cela"; memPokrov.visible = endPokrov.visible = cela; memTrak.visible = ektoTrak.visible = !cela; oblikujVse(); },
    },
  ];
  nastaviPanozice(2);
  oblikujVse();
  oblikuj(memPG, fZun); oblikuj(endPG, fNot);
  if (ctx.zacetek && ctx.zacetek.prikaz) { nadzor[1].vrednost = ctx.zacetek.prikaz; nadzor[1].ob(ctx.zacetek.prikaz); }
  void prikazanaNova; void cela;

  V.poliraj(group, deli, {
    membrana: { tex: null, ton: 0.5 },
    ektoplazma: { tex: null },
    panozice: { tex: "fino", rf: 70, k: 1.1, b: 0.24, lisa: 0.2, f: 9 },
    endoplazma: { tex: "zrna", rf: 300, k: 0.8 },
    jedro: { tex: "gube", rf: 90, k: 1.3, b: 0.25, lisa: 0.1, f: 30 },
    "krcljivi-mehurcek": { tex: null },
    "prebavni-mehurcki": { tex: "zrna", rf: 160, k: 1 },
    alga: { tex: "zrna", rf: 200, k: 0.8 },
    mitohondriji: { tex: null },
    lizosomi: { tex: "zrna", rf: 300, k: 0.9 },
  });
  // stikalo »Barve kot v učbeniku« (po poliranju, da shrani končne barve)
  nadzor.push(V.barveUcbenika(deli, { panozice: "#e9c9a6", ektoplazma: "#f3ead8", endoplazma: "#e3c29a", "krcljivi-mehurcek": "#7ccdf0", "prebavni-mehurcki": "#e2b36c", alga: "#35a83a" }));

  return {
    group,
    oder: "celica",
    pogled: [-0.47, 0.34, 0.81], // smer kamere: yaw −30°, pitch 20° (odrezani del proti gledalcu)
    // seznam delov kaže le dele, ki so v trenutnem prikazu vidni
    get deli() { return deli.filter((d) => d.meshes.some((m) => { for (let o = m; o; o = o.parent) if (!o.visible) return false; return true; })); },
    nadzor,
    korak(t) {
      zadnjiT = t;
      if (!gib) return;
      nastaviPanozice(t);
      utrip(t);
      if (faza >= 0) {
        faza = Math.min(1, (t - fazaZac) / 7);
        pozri(faza);
        postaviHrano();
        if (faza >= 1) {
          // alga je zdaj v prebavnem mehurčku; čez čas priplava nova
          faza = -1; fazaZac = t;
          prikazanaNova = 0;
        }
      } else if (zadnjiPreb.s > 0 && t - fazaZac > 3) {
        // mehurček se počasi prebavlja (manjša), nato se pojavi nova alga zunaj
        const k = Math.min(1, (t - fazaZac - 3) / 4);
        zadnjiPreb.s = 0.058 * (1 - k);
        alga.scale.setScalar(Math.max(0.0001, 1 - k * 1.5));
        if (k >= 1) { zadnjiPreb.s = 0; alga.position.copy(ALGA_ZUNAJ); alga.scale.setScalar(1); }
        postaviHrano();
      }
      oblikujVse();
    },
    dispose() {
      group.traverse((x) => x.geometry && x.geometry.dispose());
      odpad.forEach((m) => m.dispose());
    },
  };
}
