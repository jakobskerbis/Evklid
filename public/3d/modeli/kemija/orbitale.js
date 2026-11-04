// Atomske orbitale vodika, izračunane iz valovne funkcije ψ_nlm = R_nl(r) · Y_lm(θ, φ) (realne krogelne funkcije).
// Ploskev: izoploskev |ψ| = c, kjer c izračunamo numerično tako, da ploskev obdaja 90 % verjetnosti.
// Mreža: lastni »marching tetrahedra« (Freudenthalova razdelitev kocke na 6 tetraedrov), gladke normale iz ∇ψ.
// Kemijske osi: x proti gledalcu (three +z), y desno (three +x), z gor (three +y) — desnosučni sistem.

export const info = {
  id: "orbitale",
  naslov: "Atomske orbitale",
  podrocje: "kemija",
  predmet: "KEM",
  opis: "Orbitale s, p, d in f vodikovega atoma, izračunane iz valovne funkcije. Ploskev obdaja 90 % verjetnosti, barva kaže predznak (fazo) valovne funkcije, prerez pa gostoto verjetnosti in vozle.",
  merilo: { m: 1.19e-9, oznaka: "1,2 nm" },
  poskusi: "Izberi 2s, 2p in 3d ter preštej vozle; vklopi vozelne ploskve, da jih vidiš.",
};

const A0 = 5.29177e-11; // Bohrov polmer v metrih
const PI = Math.PI;
const SQ = Math.sqrt;
const OKVIR = 0.82; // polmer, v katerega postavimo orbitalo (enote scene)
const OBLAK_MAX = 0.86; // točke oblaka ne segajo dlje od tega

// ---------- radialni del ----------
function fakt(n) { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; }
function laguerre(k, a, x) {
  if (k === 0) return 1;
  let L0 = 1, L1 = 1 + a - x;
  for (let i = 1; i < k; i++) { const L2 = ((2 * i + 1 + a - x) * L1 - (i + a) * L0) / (i + 1); L0 = L1; L1 = L2; }
  return L1;
}
/** Hitra različica R_nl: koeficienti Laguerrovega polinoma vnaprej (Hornerjev postopek). */
function radialnaF(n, l) {
  const k = n - l - 1, a = 2 * l + 1, N = SQ(((2 / n) ** 3 * fakt(k)) / (2 * n * fakt(n + l)));
  // L_k^a(x) = Σ_i (−1)^i C(k + a, k − i) x^i / i!
  const kf = [];
  for (let i = 0; i <= k; i++) kf.push(((i % 2 ? -1 : 1) * fakt(k + a)) / (fakt(k - i) * fakt(a + i) * fakt(i)));
  return (r) => {
    const rho = (2 * r) / n;
    let L = 0;
    for (let i = k; i >= 0; i--) L = L * rho + kf[i];
    let p = 1;
    for (let i = 0; i < l; i++) p *= rho;
    return N * Math.exp(-rho / 2) * p * L;
  };
}
/** Radialni del vodikove valovne funkcije R_nl(r), r v Bohrovih polmerih (Z = 1); ∫ R² r² dr = 1. */
export function radialna(n, l, r) {
  const rho = (2 * r) / n;
  const N = SQ(((2 / n) ** 3 * fakt(n - l - 1)) / (2 * n * fakt(n + l)));
  return N * Math.exp(-rho / 2) * rho ** l * laguerre(n - l - 1, 2 * l + 1, rho);
}

// ---------- kotni del: realne krogelne funkcije (vhod: enotski vektor) ----------
const C = {
  s: 0.5 / SQ(PI), p: SQ(3 / (4 * PI)),
  d1: 0.5 * SQ(15 / PI), dz2: 0.25 * SQ(5 / PI), dx2: 0.25 * SQ(15 / PI),
  fz3: 0.25 * SQ(7 / PI), fxz2: 0.25 * SQ(21 / (2 * PI)), fxyz: 0.5 * SQ(105 / PI), fzx2: 0.25 * SQ(105 / PI), fx3: 0.25 * SQ(35 / (2 * PI)),
};
const R3 = SQ(3);
// ravnine: normale vozelnih ravnin; stozci: cos²θ vozelnega stožca okoli osi z (en stožec = 2 kotna vozla, zgornji in spodnji)
export const KOTNE = {
  0: [{ id: "", oz: "", m: 0, Y: () => C.s, ravnine: [], stozci: [] }],
  1: [
    { id: "x", oz: "x", m: 1, Y: (x) => C.p * x, ravnine: [[1, 0, 0]], stozci: [] },
    { id: "y", oz: "y", m: -1, Y: (x, y) => C.p * y, ravnine: [[0, 1, 0]], stozci: [] },
    { id: "z", oz: "z", m: 0, Y: (x, y, z) => C.p * z, ravnine: [[0, 0, 1]], stozci: [] },
  ],
  2: [
    { id: "xy", oz: "xy", m: -2, Y: (x, y) => C.d1 * x * y, ravnine: [[1, 0, 0], [0, 1, 0]], stozci: [] },
    { id: "xz", oz: "xz", m: 1, Y: (x, y, z) => C.d1 * x * z, ravnine: [[1, 0, 0], [0, 0, 1]], stozci: [] },
    { id: "yz", oz: "yz", m: -1, Y: (x, y, z) => C.d1 * y * z, ravnine: [[0, 1, 0], [0, 0, 1]], stozci: [] },
    { id: "x2y2", oz: "x²−y²", m: 2, Y: (x, y) => C.dx2 * (x * x - y * y), ravnine: [[1, -1, 0], [1, 1, 0]], stozci: [] },
    { id: "z2", oz: "z²", m: 0, Y: (x, y, z) => C.dz2 * (3 * z * z - 1), ravnine: [], stozci: [1 / 3] },
  ],
  3: [
    { id: "z3", oz: "z³", m: 0, Y: (x, y, z) => C.fz3 * z * (5 * z * z - 3), ravnine: [[0, 0, 1]], stozci: [3 / 5] },
    { id: "xz2", oz: "xz²", m: 1, Y: (x, y, z) => C.fxz2 * x * (5 * z * z - 1), ravnine: [[1, 0, 0]], stozci: [1 / 5] },
    { id: "yz2", oz: "yz²", m: -1, Y: (x, y, z) => C.fxz2 * y * (5 * z * z - 1), ravnine: [[0, 1, 0]], stozci: [1 / 5] },
    { id: "xyz", oz: "xyz", m: -2, Y: (x, y, z) => C.fxyz * x * y * z, ravnine: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], stozci: [] },
    { id: "zx2y2", oz: "z(x²−y²)", m: 2, Y: (x, y, z) => C.fzx2 * z * (x * x - y * y), ravnine: [[0, 0, 1], [1, -1, 0], [1, 1, 0]], stozci: [] },
    { id: "xx23y2", oz: "x(x²−3y²)", m: 3, Y: (x, y) => C.fx3 * x * (x * x - 3 * y * y), ravnine: [[1, 0, 0], [1, -R3, 0], [1, R3, 0]], stozci: [] },
    { id: "y3x2y2", oz: "y(3x²−y²)", m: -3, Y: (x, y) => C.fx3 * y * (3 * x * x - y * y), ravnine: [[0, 1, 0], [-R3, 1, 0], [R3, 1, 0]], stozci: [] },
  ],
};
const CRKE = "spdf";

/** Vse orbitale: n = 1–4 z vsemi l < n in vsemi realnimi m, ter 5s in 5p. */
export const ORBITALE = [];
for (let n = 1; n <= 5; n++) {
  for (let l = 0; l < (n < 5 ? n : 2); l++) {
    for (const k of KOTNE[l]) ORBITALE.push({ id: `${n}${CRKE[l]}${k.id}`, oznaka: `${n}${CRKE[l]}${k.oz}`, n, l, k });
  }
}
const PO_ID = Object.fromEntries(ORBITALE.map((o) => [o.id, o]));

/** Skupni predznak ψ je poljuben; izberemo ga tako, da je zunanji radialni del pozitiven (kot v učbenikih). */
const predznak = (o) => ((o.n - o.l - 1) % 2 ? -1 : 1);
/** ψ(x, y, z) v Bohrovih polmerih (kemijske osi). */
export function valovna(id) {
  const o = PO_ID[id], zn = predznak(o), R = radialnaF(o.n, o.l), Y = o.k.Y;
  return (x, y, z) => {
    const r = Math.sqrt(x * x + y * y + z * z);
    if (r < 1e-12) return o.l === 0 ? zn * R(0) * C.s : 0;
    return zn * R(r) * Y(x / r, y / r, z / r);
  };
}

// ---------- tabele in prag 90 % ----------
const TAB = new Map();
function tabela(n, l) {
  const kljuc = n * 10 + l;
  if (TAB.has(kljuc)) return TAB.get(kljuc);
  const rMax = 4 * n * n + 20, K = 6000, dr = rMax / K;
  const r = new Float64Array(K), R = new Float64Array(K), w = new Float64Array(K), cdf = new Float64Array(K + 1);
  for (let i = 0; i < K; i++) {
    const x = (i + 0.5) * dr; r[i] = x; R[i] = radialna(n, l, x); w[i] = x * x * R[i] * R[i] * dr; cdf[i + 1] = cdf[i] + w[i];
  }
  const red = Array.from({ length: K }, (_, i) => i).sort((a, b) => Math.abs(R[b]) - Math.abs(R[a]));
  const aS = new Float64Array(K), cS = new Float64Array(K);
  let acc = 0;
  for (let i = 0; i < K; i++) { aS[i] = Math.abs(R[red[i]]); acc += w[red[i]]; cS[i] = acc; }
  const t = { r, R, cdf, aS, cS, K, dr, rMax };
  TAB.set(kljuc, t);
  return t;
}
/** ∫ r² R² dr po območju, kjer je |R(r)| ≥ t. */
function nadPragom(t, tab) {
  let lo = 0, hi = tab.K;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (tab.aS[mid] >= t) lo = mid + 1; else hi = mid; }
  return lo ? tab.cS[lo - 1] : 0;
}
const KOT = new Map();
function kotnaMreza(k) {
  if (KOT.has(k)) return KOT.get(k);
  const NT = 90, NF = 180, Ya = [], wA = [];
  let ymax = 0;
  for (let i = 0; i < NT; i++) {
    const th = ((i + 0.5) * PI) / NT, st = Math.sin(th), ct = Math.cos(th);
    for (let j = 0; j < NF; j++) {
      const ph = ((j + 0.5) * 2 * PI) / NF;
      const y = Math.abs(k.Y(st * Math.cos(ph), st * Math.sin(ph), ct));
      ymax = Math.max(ymax, y);
      if (y < 1e-9) continue;
      Ya.push(y); wA.push(y * y * st * (PI / NT) * ((2 * PI) / NF));
    }
  }
  const m = { Ya: Float64Array.from(Ya), wA: Float64Array.from(wA), ymax };
  KOT.set(k, m);
  return m;
}
const PRAG = new Map();
/** Vrednost c, pri kateri območje |ψ| ≥ c obdaja `delez` verjetnosti; rExt = največja razdalja ploskve od jedra. */
export function prag(id, delez = 0.9) {
  const kljuc = id + "|" + delez;
  if (PRAG.has(kljuc)) return PRAG.get(kljuc);
  const o = PO_ID[id], tab = tabela(o.n, o.l), ang = kotnaMreza(o.k);
  const P = (c) => { let s = 0; for (let i = 0; i < ang.Ya.length; i++) s += ang.wA[i] * nadPragom(c / ang.Ya[i], tab); return s; };
  const cilj = delez * P(0);
  let lo = 0, hi = tab.aS[0] * ang.ymax;
  for (let it = 0; it < 48; it++) { const mid = (lo + hi) / 2; if (P(mid) > cilj) lo = mid; else hi = mid; }
  const c = (lo + hi) / 2;
  let rExt = 0;
  for (let i = 0; i < tab.K; i++) if (Math.abs(tab.R[i]) * ang.ymax * 1.01 >= c) rExt = tab.r[i];
  const izid = { c, rExt };
  PRAG.set(kljuc, izid);
  return izid;
}
/** Polmeri kroglastih (radialnih) vozlov, v Bohrovih polmerih. */
export function radialniVozli(n, l) {
  const out = [], rMax = 4 * n * n + 20, K = 20000;
  let pr = radialna(n, l, 1e-6);
  for (let i = 1; i <= K; i++) {
    const r = (i * rMax) / K, v = radialna(n, l, r);
    if (pr !== 0 && v !== 0 && Math.sign(v) !== Math.sign(pr)) {
      let a = r - rMax / K, b = r;
      for (let k = 0; k < 50; k++) { const m = (a + b) / 2; if (Math.sign(radialna(n, l, m)) === Math.sign(pr)) a = m; else b = m; }
      out.push((a + b) / 2);
    }
    pr = v;
  }
  return out;
}

// ---------- marching tetrahedra ----------
const TETS = [[0, 1, 3, 7], [0, 1, 5, 7], [0, 2, 3, 7], [0, 2, 6, 7], [0, 4, 5, 7], [0, 4, 6, 7]];
/** Izoploskev vals = 0 na mreži N³ (notranjost: vals > 0). Vrne položaje in indekse; trikotniki so obrnjeni navzven. */
export function tetraedri(vals, N, x0, h) {
  const NN = N * N;
  const off = [0, 1, N, N + 1, NN, NN + 1, NN + N, NN + N + 1];
  const pos = [], idx = [];
  // vsak rob Freudenthalove mreže povezuje oglišče z »višjim« sosedom v eni od 7 smeri: ključ = oglišče · 7 + smer
  const robovi = new Int32Array(N * NN * 7).fill(-1);
  const kx = (g) => x0 + h * (g % N), ky = (g) => x0 + h * (Math.floor(g / N) % N), kz = (g) => x0 + h * Math.floor(g / NN);
  let base = 0;
  function tocka(ca, cb) {
    if ((ca & cb) !== ca) { const t = ca; ca = cb; cb = t; }
    const a = base + off[ca], b = base + off[cb], kljuc = a * 7 + (ca ^ cb) - 1;
    let id = robovi[kljuc];
    if (id >= 0) return id;
    const fa = vals[a], fb = vals[b], t = fa / (fa - fb);
    id = pos.length / 3;
    pos.push(kx(a) + (kx(b) - kx(a)) * t, ky(a) + (ky(b) - ky(a)) * t, kz(a) + (kz(b) - kz(a)) * t);
    robovi[kljuc] = id;
    return id;
  }
  function tri(a, b, c, rx, ry, rz) {
    if (a === b || b === c || a === c) return;
    const ax = pos[3 * a], ay = pos[3 * a + 1], az = pos[3 * a + 2];
    const ux = pos[3 * b] - ax, uy = pos[3 * b + 1] - ay, uz = pos[3 * b + 2] - az;
    const vx = pos[3 * c] - ax, vy = pos[3 * c + 1] - ay, vz = pos[3 * c + 2] - az;
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    if (nx * nx + ny * ny + nz * nz < 1e-24) return;
    const dx = (ax + pos[3 * b] + pos[3 * c]) / 3 - rx, dy = (ay + pos[3 * b + 1] + pos[3 * c + 1]) / 3 - ry, dz = (az + pos[3 * b + 2] + pos[3 * c + 2]) / 3 - rz;
    if (nx * dx + ny * dy + nz * dz < 0) idx.push(a, c, b); else idx.push(a, b, c);
  }
  const notri = [], zunaj = [];
  for (let k = 0; k < N - 1; k++) for (let j = 0; j < N - 1; j++) for (let i = 0; i < N - 1; i++) {
    base = i + N * j + NN * k;
    let maska = 0;
    for (let c = 0; c < 8; c++) if (vals[base + off[c]] > 0) maska |= 1 << c;
    if (maska === 0 || maska === 255) continue;
    for (const t of TETS) {
      notri.length = 0; zunaj.length = 0;
      for (let q = 0; q < 4; q++) ((maska >> t[q]) & 1 ? notri : zunaj).push(t[q]);
      if (notri.length === 0 || notri.length === 4) continue;
      let rx = 0, ry = 0, rz = 0;
      for (const c of notri) { rx += c & 1; ry += (c >> 1) & 1; rz += (c >> 2) & 1; }
      rx = kx(base) + (h * rx) / notri.length; ry = ky(base) + (h * ry) / notri.length; rz = kz(base) + (h * rz) / notri.length;
      if (notri.length === 1) {
        const a = notri[0];
        tri(tocka(a, zunaj[0]), tocka(a, zunaj[1]), tocka(a, zunaj[2]), rx, ry, rz);
      } else if (notri.length === 3) {
        const o = zunaj[0];
        tri(tocka(notri[0], o), tocka(notri[1], o), tocka(notri[2], o), rx, ry, rz);
      } else {
        const [a, b] = notri, [c, d] = zunaj;
        const ac = tocka(a, c), ad = tocka(a, d), bd = tocka(b, d), bc = tocka(b, c);
        tri(ac, ad, bd, rx, ry, rz); tri(ac, bd, bc, rx, ry, rz);
      }
    }
  }
  return { pos, idx };
}

// ---------- pomožno ----------
function mulberry(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function stevilo(n, ed, dv, mn, ve) { return `${n} ${n === 1 ? ed : n === 2 ? dv : n < 5 ? mn : ve}`; }
function nm(m) { return (m * 1e9).toPrecision(2).replace(".", ",") + " nm"; }
// kemijske osi → three: (x, y, z)_kem → (y, z, x)_three
const vT = (x, y, z, s = 1) => [y * s, z * s, x * s];

const BARVA_PLUS = "#4f7cf0", BARVA_MINUS = "#f07a36";

export function zgradi(THREE, ctx = {}) {
  const visoka = ctx.kakovost !== "nizka";
  const zac = ctx.zacetek || {};
  let orbId = PO_ID[zac.orbitala] ? zac.orbitala : "2pz";
  let prikaz = ["ploskev", "oblak", "prerez"].includes(zac.prikaz) ? zac.prikaz : "ploskev";
  let osiVidne = zac.osi === undefined ? true : !!zac.osi;
  let vozliVidni = zac.vozli === undefined ? true : !!zac.vozli;

  const group = new THREE.Group();
  group.name = "orbitale";
  const vsebina = new THREE.Group();
  group.add(vsebina);

  // materiali (skupni)
  // ploskvi faz: gladek lak in svetel rob (sheen), da se oblika bere tudi pri šibki svetlobi
  const fazaMat = (barva, rob) => new THREE.MeshPhysicalMaterial({ color: barva, roughness: 0.34, metalness: 0, clearcoat: 0.6, clearcoatRoughness: 0.2, sheen: 0.4, sheenRoughness: 0.28, sheenColor: rob });
  const matPlus = fazaMat(BARVA_PLUS, "#c4d5ff"), matMinus = fazaMat(BARVA_MINUS, "#ffd6b8");
  const matPlusT = new THREE.MeshPhysicalMaterial({ color: BARVA_PLUS, roughness: 0.4, transparent: true, opacity: 0.16, depthWrite: false });
  const matMinusT = new THREE.MeshPhysicalMaterial({ color: BARVA_MINUS, roughness: 0.4, transparent: true, opacity: 0.16, depthWrite: false });
  const matVozel = new THREE.MeshBasicMaterial({ color: "#e4ebf7", vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide, forceSinglePass: true });
  const matJedro = new THREE.MeshPhysicalMaterial({ color: "#f4f1ea", emissive: "#8a8070", roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.14 });
  const matPrerez = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide, forceSinglePass: true });
  const matObroba = new THREE.LineBasicMaterial({ color: "#5a6680", transparent: true, opacity: 0.6 });
  let sprite = null;
  if (typeof document !== "undefined") {
    const cv = document.createElement("canvas"); cv.width = cv.height = 64;
    const g2 = cv.getContext("2d");
    if (g2) {
      const gr = g2.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.3, "rgba(255,255,255,0.75)"); gr.addColorStop(1, "rgba(255,255,255,0)");
      g2.fillStyle = gr; g2.fillRect(0, 0, 64, 64);
      sprite = new THREE.CanvasTexture(cv); sprite.colorSpace = THREE.SRGBColorSpace;
    }
  }
  const tockeMat = (barva) => new THREE.PointsMaterial({
    color: barva, size: sprite ? (visoka ? 0.042 : 0.05) : 0.016, map: sprite, transparent: true, opacity: sprite ? 0.42 : 0.8,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
  });
  const matTPlus = tockeMat(BARVA_PLUS), matTMinus = tockeMat(BARVA_MINUS);

  // jedro
  const jedroGeo = new THREE.SphereGeometry(0.02, visoka ? 24 : 12, visoka ? 16 : 8);
  const jedro = new THREE.Mesh(jedroGeo, matJedro);
  group.add(jedro);

  // osi
  const osi = new THREE.Group();
  {
    const L = 0.86, pos = [], col = [];
    const barve = [["#e8695a", [1, 0, 0]], ["#6fd08c", [0, 1, 0]], ["#8fb0ff", [0, 0, 1]]];
    for (const [b, d] of barve) {
      const c = new THREE.Color(b), a = vT(...d, -L), e = vT(...d, L);
      pos.push(...a, ...e); col.push(c.r * 0.5, c.g * 0.5, c.b * 0.5, c.r, c.g, c.b);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    osi.add(new THREE.LineSegments(g, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85 })));
    if (typeof document !== "undefined") {
      for (const [b, d, t] of [[barve[0][0], [1, 0, 0], "x"], [barve[1][0], [0, 1, 0], "y"], [barve[2][0], [0, 0, 1], "z"]]) {
        const cv = document.createElement("canvas"); cv.width = cv.height = 64;
        const g2 = cv.getContext("2d");
        if (!g2) continue;
        g2.font = "italic 600 44px 'Instrument Sans', system-ui, sans-serif"; g2.textAlign = "center"; g2.textBaseline = "middle";
        g2.fillStyle = b; g2.fillText(t, 32, 30);
        const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
        // točka namesto Sprite: senčenje okolice (GTAO) točke izpusti, Sprite pa bi dobil temen kvadrat
        const gs = new THREE.BufferGeometry();
        gs.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vT(...d, 0.9)), 3));
        const sp = new THREE.Points(gs, new THREE.PointsMaterial({ map: tex, size: 0.07 * 2.7, sizeAttenuation: true, transparent: true, depthWrite: false }));
        sp.raycast = () => {}; // oznaka osi ni tarča tapa
        osi.add(sp);
      }
    }
  }
  group.add(osi);

  const m = { group, deli: [], nadzor: [], merilo: null, dispose };
  let nodeMesh = null, vsiDeli = [];
  const vidniDeli = () => (vozliVidni ? vsiDeli : vsiDeli.filter((d) => d.id !== "vozli")); // skrite vozelne ploskve nimajo oznake

  function pocisti() {
    for (const o of [...vsebina.children]) { vsebina.remove(o); o.geometry && o.geometry.dispose(); }
    nodeMesh = null;
  }

  /** Oglišče, ki je najbolj proti privzeti kameri (in v smeri `smer`), za oznako dela. */
  function najdlje(g, smer = [0.45, 0.3, 0.84], meja = 9) {
    const p = g.attributes.position.array; let best = -1e9, bi = 0;
    for (let i = 0; i < p.length; i += 3) {
      const d = p[i] * smer[0] + p[i + 1] * smer[1] + p[i + 2] * smer[2];
      if (d > best && p[i] ** 2 + p[i + 1] ** 2 + p[i + 2] ** 2 < meja) { best = d; bi = i; }
    }
    return [p[bi], p[bi + 1], p[bi + 2]];
  }

  /** Izoploskvi + in − faze; rez = izrez četrtine, da se vidi notranjost. */
  function izoploskvi(o, c, rExt, s, N, rez, matP, matM, meja) {
    // mreža N³; če je trikotnikov preveč za proračun, jo zredčimo
    for (;;) {
      const izid = izoploskviN(o, c, rExt, s, N, rez, matP, matM);
      const tri = izid.reduce((a, x) => a + (x ? x.geometry.index.count / 3 : 0), 0);
      if (tri <= meja || N <= 24) return izid;
      for (const x of izid) if (x) { vsebina.remove(x); x.geometry.dispose(); }
      N -= 6;
    }
  }
  function izoploskviN(o, c, rExt, s, N, rez, matP, matM) {
    const psi = valovna(o.id);
    const L = rExt * 1.06, h = (2 * L) / (N - 1), NN = N * N;
    const vals = new Float32Array(N * NN);
    for (let k = 0; k < N; k++) for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) vals[i + N * j + NN * k] = psi(-L + h * i, -L + h * j, -L + h * k);
    // klin (90°), ki ga izrežemo: njegovi robni polravnini naj gresta skozi režnje; ob enakem izidu tisti proti kameri
    let fa = (-15 * PI) / 180, najS = -1;
    if (rez) for (const st of [-15, -45, -30, 0, 15, 30, 45]) {
      let sk = 0;
      for (const f of [st, st + 90]) {
        const cf = Math.cos(((f + 0.7) * PI) / 180), sf = Math.sin(((f + 0.7) * PI) / 180);
        for (let i = 0; i < 24; i++) for (let j = 0; j < 48; j++) {
          const r = ((i + 0.5) / 24) * rExt, z = ((j + 0.5) / 48 * 2 - 1) * rExt, p = psi(r * cf, r * sf, z);
          sk += p * p * r;
        }
      }
      if (sk > najS * 1.05) { najS = sk; fa = ((st + 0.7) * PI) / 180; }
    }
    const fb = fa + PI / 2;
    const na = [-Math.sin(fa), Math.cos(fa)], nb = [Math.sin(fb), -Math.cos(fb)];
    const kRez = (3 * c) / rExt; // približno |∇ψ| ob ploskvi, da sta oba člena min() v istih enotah
    const wKlin = (x, y) => Math.max(-(x * na[0] + y * na[1]), -(x * nb[0] + y * nb[1]));
    const eps = rExt * 1e-3;
    const grad = (x, y, z) => [
      (psi(x + eps, y, z) - psi(x - eps, y, z)) / (2 * eps),
      (psi(x, y + eps, z) - psi(x, y - eps, z)) / (2 * eps),
      (psi(x, y, z + eps) - psi(x, y, z - eps)) / (2 * eps),
    ];
    const izid = [];
    for (const zn of [1, -1]) {
      const f = new Float32Array(vals.length);
      for (let k = 0; k < N; k++) for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
        const q = i + N * j + NN * k, a = zn * vals[q] - c;
        f[q] = rez ? Math.min(a, kRez * wKlin(-L + h * i, -L + h * j)) : a;
      }
      const { pos, idx } = tetraedri(f, N, -L, h);
      if (idx.length === 0) { izid.push(null); continue; }
      // Oglišča natančno postavimo na ploskev (Newton po ∇ψ) ali na ravnino reza; ob robu reza na njuno presečišče.
      const vrsta = new Uint8Array(pos.length / 3); // 0 = izoploskev, 1 = rez A, 2 = rez B
      for (let v = 0; rez && v < pos.length / 3; v++) {
        let x = pos[3 * v], y = pos[3 * v + 1], z = pos[3 * v + 2];
        if (wKlin(x, y) > 2.5 * h) continue; // daleč od reza: linearna interpolacija zadošča
        for (let it = 0; it < 4; it++) {
          const a = zn * psi(x, y, z) - c, G = grad(x, y, z).map((q) => q * zn), g2 = G[0] ** 2 + G[1] ** 2 + G[2] ** 2 || 1e-30;
          const da = a / Math.sqrt(g2);
          const kor = Math.min(1, h / (Math.abs(da) || 1e-30)); // korak največ ena celica
          if (!rez) { x -= (kor * a * G[0]) / g2; y -= (kor * a * G[1]) / g2; z -= (kor * a * G[2]) / g2; vrsta[v] = 0; continue; }
          const wa = -(x * na[0] + y * na[1]), wb = -(x * nb[0] + y * nb[1]);
          const n2 = wa > wb ? na : nb, w = Math.max(wa, wb);
          if (Math.abs(da) < 1.2 * h && Math.abs(w) < 1.2 * h) {
            // presečišče: na ravnino, nato Newton po ∇ψ, projiciranem v ravnino
            x += w * n2[0]; y += w * n2[1];
            const a2 = zn * psi(x, y, z) - c, H = grad(x, y, z).map((q) => q * zn), d = H[0] * n2[0] + H[1] * n2[1];
            const P = [H[0] - d * n2[0], H[1] - d * n2[1], H[2]], p2 = P[0] ** 2 + P[1] ** 2 + P[2] ** 2 || 1e-30;
            const k2 = Math.min(1, h / (Math.abs(a2) / Math.sqrt(p2) || 1e-30));
            x -= (k2 * a2 * P[0]) / p2; y -= (k2 * a2 * P[1]) / p2; z -= (k2 * a2 * P[2]) / p2;
            vrsta[v] = 3;
          } else if (da < w) { x -= (kor * a * G[0]) / g2; y -= (kor * a * G[1]) / g2; z -= (kor * a * G[2]) / g2; vrsta[v] = 0; }
          else { x += w * n2[0]; y += w * n2[1]; vrsta[v] = n2 === na ? 1 : 2; }
        }
        pos[3 * v] = x; pos[3 * v + 1] = y; pos[3 * v + 2] = z;
      }
      // Normale: ploskve reza dobijo normalo ravnine, izoploskev gradient; oglišča na robu podvojimo, da je rob oster.
      const nV = pos.length / 3, P = [], Nr = [], I = [], kopija = new Map();
      const Gn = new Float32Array(pos.length);
      for (let v = 0; v < nV; v++) { const G = grad(pos[3 * v], pos[3 * v + 1], pos[3 * v + 2]); Gn[3 * v] = -zn * G[0]; Gn[3 * v + 1] = -zn * G[1]; Gn[3 * v + 2] = -zn * G[2]; }
      const naRezu = (v) => rez && vrsta[v] > 0;
      const oglisce = (v, vr) => {
        const kl = v * 3 + vr;
        let id = kopija.get(kl);
        if (id !== undefined) return id;
        id = P.length / 3;
        const t = vT(pos[3 * v], pos[3 * v + 1], pos[3 * v + 2], s);
        P.push(t[0], t[1], t[2]);
        const q = vr === 1 ? [na[0], na[1], 0] : vr === 2 ? [nb[0], nb[1], 0] : [Gn[3 * v], Gn[3 * v + 1], Gn[3 * v + 2]];
        const u = vT(q[0], q[1], q[2]), l = Math.hypot(u[0], u[1], u[2]) || 1;
        Nr.push(u[0] / l, u[1] / l, u[2] / l);
        kopija.set(kl, id);
        return id;
      };
      for (let t = 0; t < idx.length; t += 3) {
        const a = idx[t], b = idx[t + 1], cc = idx[t + 2];
        let vr = 0;
        if (naRezu(a) && naRezu(b) && naRezu(cc)) {
          const cx = (pos[3 * a] + pos[3 * b] + pos[3 * cc]) / 3, cy = (pos[3 * a + 1] + pos[3 * b + 1] + pos[3 * cc + 1]) / 3;
          vr = -(cx * na[0] + cy * na[1]) > -(cx * nb[0] + cy * nb[1]) ? 1 : 2;
        }
        I.push(oglisce(a, vr), oglisce(b, vr), oglisce(cc, vr));
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(P, 3));
      geo.setAttribute("normal", new THREE.Float32BufferAttribute(Nr, 3));
      geo.setIndex(new THREE.BufferAttribute(P.length / 3 > 65535 ? Uint32Array.from(I) : Uint16Array.from(I), 1));
      const mesh = new THREE.Mesh(geo, zn > 0 ? matP : matM);
      vsebina.add(mesh);
      izid.push(mesh);
    }
    return izid;
  }

  /** Vozelne ploskve: kroglaste (radialni vozli), ravnine in stožci (kotni vozli). */
  function vozelnePloskve(o, s, rExt) {
    const pos = [], col = [], idx = [], A = 0.15;
    const R = OKVIR;
    function ploskev(na, nb, f, alfa) {
      const z = pos.length / 3;
      for (let i = 0; i <= na; i++) for (let j = 0; j <= nb; j++) {
        const p = f(i / na, j / nb); pos.push(...vT(p[0], p[1], p[2])); col.push(1, 1, 1, alfa(i / na, j / nb));
      }
      for (let i = 0; i < na; i++) for (let j = 0; j < nb; j++) {
        const a = z + i * (nb + 1) + j, b = a + nb + 1;
        idx.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
    const fade = (a) => A * (1 - Math.min(1, Math.max(0, (a - 0.72) / 0.28)) ** 2);
    const seg = visoka ? 64 : 36;
    for (const rv of radialniVozli(o.n, o.l)) {
      const r = rv * s;
      ploskev(visoka ? 24 : 14, seg, (a, b) => { const th = a * PI, ph = b * 2 * PI; return [r * Math.sin(th) * Math.cos(ph), r * Math.sin(th) * Math.sin(ph), r * Math.cos(th)]; }, () => A * 0.75);
    }
    for (const nr of o.k.ravnine) {
      const l = Math.hypot(...nr), n = nr.map((x) => x / l);
      const t = Math.abs(n[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
      let u = [n[1] * t[2] - n[2] * t[1], n[2] * t[0] - n[0] * t[2], n[0] * t[1] - n[1] * t[0]];
      const lu = Math.hypot(...u); u = u.map((x) => x / lu);
      const v = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
      ploskev(8, seg, (a, b) => { const rr = a * R, ph = b * 2 * PI, c = Math.cos(ph) * rr, d = Math.sin(ph) * rr; return [u[0] * c + v[0] * d, u[1] * c + v[1] * d, u[2] * c + v[2] * d]; }, (a) => fade(a));
    }
    for (const c2 of o.k.stozci) {
      const ct = SQ(c2), st = SQ(1 - c2);
      for (const zn of [1, -1]) ploskev(8, seg, (a, b) => { const rr = a * R, ph = b * 2 * PI; return [rr * st * Math.cos(ph), rr * st * Math.sin(ph), zn * rr * ct]; }, (a) => fade(a));
    }
    if (!idx.length) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 4));
    g.setIndex(idx);
    const mesh = new THREE.Mesh(g, matVozel);
    mesh.renderOrder = 2;
    mesh.visible = vozliVidni;
    vsebina.add(mesh);
    return mesh;
  }

  function opisVozlov(o, rad) {
    const kosi = [];
    if (rad) kosi.push(stevilo(rad, "kroglasta vozelna ploskev", "kroglasti vozelni ploskvi", "kroglaste vozelne ploskve", "kroglastih vozelnih ploskev"));
    const nr = o.k.ravnine.length, ns = o.k.stozci.length;
    if (nr) kosi.push(stevilo(nr, "vozelna ravnina", "vozelni ravnini", "vozelne ravnine", "vozelnih ravnin"));
    if (ns) kosi.push("vozelni stožec z dvema deloma");
    return kosi.join(" in ");
  }

  function zgradiVsebino() {
    pocisti();
    const o = PO_ID[orbId];
    const { c, rExt } = prag(o.id);
    const s = OKVIR / rExt;
    const rad = o.n - o.l - 1;
    const psi = valovna(o.id);
    const deli = [];
    let plus = null, minus = null, extra = null;

    if (prikaz === "ploskev") {
      [plus, minus] = izoploskvi(o, c, rExt, s, (visoka ? 60 : 38) - (o.n === 5 ? 6 : 0), rad > 0, matPlus, matMinus, visoka ? 132000 : 52000);
    } else if (prikaz === "oblak") {
      const tab = tabela(o.n, o.l), ang = kotnaMreza(o.k), rnd = mulberry(7 + o.n * 31 + o.l * 7 + o.k.m);
      const Ntock = visoka ? 42000 : 16000, rMejaA0 = OBLAK_MAX / s;
      const P = [[], []];
      let poskusi = 0;
      while (P[0].length + P[1].length < 3 * Ntock && poskusi++ < Ntock * 60) {
        // r iz kumulativne porazdelitve r²R²
        const u = rnd() * tab.cdf[tab.K];
        let lo = 0, hi = tab.K;
        while (lo < hi) { const mid = (lo + hi) >> 1; if (tab.cdf[mid + 1] < u) lo = mid + 1; else hi = mid; }
        const r = (lo + rnd()) * tab.dr;
        if (r > rMejaA0) continue;
        // smer: zavrnitveno vzorčenje |Y|²
        let x, y, z, Y;
        for (;;) {
          z = 2 * rnd() - 1; const ph = 2 * PI * rnd(), q = SQ(1 - z * z); x = q * Math.cos(ph); y = q * Math.sin(ph);
          Y = o.k.Y(x, y, z);
          if (rnd() * ang.ymax * ang.ymax <= Y * Y) break;
        }
        const zn = Math.sign(predznak(o) * radialna(o.n, o.l, r) * Y) >= 0 ? 0 : 1;
        P[zn].push(...vT(x, y, z, r * s));
      }
      const obj = [];
      for (const zn of [0, 1]) {
        if (!P[zn].length) { obj.push(null); continue; }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(P[zn], 3));
        const pts = new THREE.Points(g, zn ? matTMinus : matTPlus);
        vsebina.add(pts); obj.push(pts);
      }
      [plus, minus] = obj;
    } else {
      [plus, minus] = izoploskvi(o, c, rExt, s, visoka ? 40 : 28, false, matPlusT, matMinusT, visoka ? 60000 : 24000);
      // ravnina prereza skozi jedro, kjer je verjetnost največja
      const kand = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, -1, 0], [1, 1, 0]];
      let best = null, bestV = -1;
      for (const k of kand) {
        const l = Math.hypot(...k), n = k.map((x) => x / l);
        const t = Math.abs(n[2]) < 0.9 ? [0, 0, 1] : [0, 1, 0];
        let u = [t[1] * n[2] - t[2] * n[1], t[2] * n[0] - t[0] * n[2], t[0] * n[1] - t[1] * n[0]];
        const lu = Math.hypot(...u); u = u.map((x) => x / lu);
        const v = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
        let sum = 0;
        for (let i = 0; i < 40; i++) for (let j = 0; j < 40; j++) {
          const a = ((i + 0.5) / 40 * 2 - 1) * rExt, b = ((j + 0.5) / 40 * 2 - 1) * rExt;
          const p = psi(u[0] * a + v[0] * b, u[1] * a + v[1] * b, u[2] * a + v[2] * b); sum += p * p;
        }
        if (sum > bestV * 1.03) { bestV = sum; best = { u, v }; }
      }
      const { u, v } = best, S = OKVIR * 1.05, Np = visoka ? 180 : 96;
      const pos = [], val = [], idx = [];
      let vmax = 0;
      for (let i = 0; i <= Np; i++) for (let j = 0; j <= Np; j++) {
        const a = (i / Np * 2 - 1) * S, b = (j / Np * 2 - 1) * S;
        const p = [u[0] * a + v[0] * b, u[1] * a + v[1] * b, u[2] * a + v[2] * b];
        pos.push(...vT(...p));
        const w = psi(p[0] / s, p[1] / s, p[2] / s);
        val.push(w); vmax = Math.max(vmax, w * w);
      }
      for (let i = 0; i < Np; i++) for (let j = 0; j < Np; j++) { if (Math.hypot((2 * i + 1) / Np - 1, (2 * j + 1) / Np - 1) > 1 + 2 / Np) continue; const a = i * (Np + 1) + j, b = a + Np + 1; idx.push(a, b, a + 1, a + 1, b, b + 1); }
      const cP = [new THREE.Color("#0d1830"), new THREE.Color("#3d6cf0"), new THREE.Color("#a9c4ff"), new THREE.Color("#f2f6ff")];
      const cM = [new THREE.Color("#2a1408"), new THREE.Color("#d8642a"), new THREE.Color("#ffbf8a"), new THREE.Color("#fff3e6")];
      const lest = (cs, t) => { const x = Math.min(0.9999, t) * (cs.length - 1), i = Math.floor(x), f = x - i; return [cs[i].r + (cs[i + 1].r - cs[i].r) * f, cs[i].g + (cs[i + 1].g - cs[i].g) * f, cs[i].b + (cs[i + 1].b - cs[i].b) * f]; };
      const col = [];
      for (let q = 0; q < val.length; q++) {
        const t = Math.pow((val[q] * val[q]) / vmax, 0.42);
        const rgb = lest(val[q] >= 0 ? cP : cM, t);
        const ix = Math.floor(q / (Np + 1)) / Np * 2 - 1, jx = (q % (Np + 1)) / Np * 2 - 1;
        const rob = Math.max(0, 1 - Math.max(0, (Math.hypot(ix, jx) - 0.88) / 0.12)); // okrogel rob: vogali kvadrata (zunaj r ≈ 1) so prozorni
        col.push(...rgb, Math.min(1, 0.18 + 1.6 * t) * rob);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute("color", new THREE.Float32BufferAttribute(col, 4));
      g.setIndex(idx);
      const ravnina = new THREE.Mesh(g, matPrerez);
      ravnina.renderOrder = 1;
      vsebina.add(ravnina);
      const ob = [];
      for (let q = 0; q < 96; q++) { const a = Math.cos((q / 96) * 2 * PI), b = Math.sin((q / 96) * 2 * PI); ob.push(...vT(u[0] * a * S + v[0] * b * S, u[1] * a * S + v[1] * b * S, u[2] * a * S + v[2] * b * S)); }
      const og = new THREE.BufferGeometry(); og.setAttribute("position", new THREE.Float32BufferAttribute(ob, 3));
      const obroba = new THREE.LineLoop(og, matObroba);
      vsebina.add(obroba);
      extra = { ravnina, obroba, tocka: vT(...[0, 1, 2].map((q) => (u[q] * 0.55 + v[q] * 0.55) * S)) };
    }
    nodeMesh = vozelnePloskve(o, s, rExt);
    matVozel.opacity = prikaz === "ploskev" ? 1 : 0.5;

    const ime = o.oznaka;
    // pri oblaku točk smer proti kameri pade na sredino zaslona (na jedro): + faza označena višje, − nižje
    const tockaZ = (mesh, gor) => najdlje(mesh.geometry, mesh.isPoints ? [0.45, 0.3 + 0.9 * gor, 0.84] : undefined, mesh.isPoints ? 0.3 : 9);
    const vsi = [plus, minus].filter(Boolean);
    deli.push({
      id: "orbitala", ime: `Orbitala ${ime}`, barva: "#6e9bff", meshes: vsi, tocka: najdlje(vsi[0].geometry, [-0.6, 0.75, 0.25], vsi[0].isPoints ? 0.3 : 9),
      opis: prikaz === "oblak"
        ? `Vsaka pika je eno možno mesto elektrona v orbitali ${ime}; kjer je pik več, je elektron pogosteje.`
        : `Območje, v katerem je elektron v orbitali ${ime} z 90-odstotno verjetnostjo; ploskev seže do ${nm(rExt * A0)} od jedra.`,
    });
    if (plus) deli.push({ id: "plus", ime: "Pozitivna faza", barva: "#6e9bff", meshes: [plus], tocka: tockaZ(plus, 1), opis: "Del orbitale, kjer je valovna funkcija ψ pozitivna (modro)." });
    if (minus) deli.push({ id: "minus", ime: "Negativna faza", barva: "#ff9a52", meshes: [minus], tocka: tockaZ(minus, -1), opis: "Del orbitale, kjer je valovna funkcija ψ negativna (oranžno); verjetnost |ψ|² je tudi tu pozitivna." });
    if (extra) deli.push({ id: "prerez", ime: "Ravnina prereza", barva: "#a9c4ff", meshes: [extra.ravnina, extra.obroba], tocka: extra.tocka, opis: "Svetlejša barva pomeni večjo gostoto verjetnosti |ψ|²; temne črte so vozli, kjer elektrona ni." });
    deli.push({ id: "jedro", ime: "Jedro", barva: "#f4f1ea", meshes: [jedro], tocka: [0, 0, 0], opis: "Proton v središču atoma vodika, okoli katerega je orbitala; narisan je močno povečan." });
    if (nodeMesh) {
      const p = nodeMesh.geometry.attributes.position.array;
      const sam = rad === 0 && o.k.ravnine.length === 1 && !o.k.stozci.length;
      // točka na vozlu: na krogli (radialni vozel) ali na ravnini/stožcu na pol poti
      let t;
      if (rad) { const r = radialniVozli(o.n, o.l)[rad - 1] * s; t = vT(r * 0.5, -r * 0.5, r * 0.7071); }
      else { const i = 3 * Math.floor((p.length / 3) * 0.45); t = [p[i], p[i + 1], p[i + 2]]; }
      deli.push({ id: "vozli", ime: sam ? "Vozelna ravnina" : "Vozelne ploskve", barva: "#e4ebf7", meshes: [nodeMesh], tocka: t, opis: `Tu je ψ = 0, zato elektrona tam ne najdemo: ${opisVozlov(o, rad)}.` });
    }
    vsiDeli = deli;
    m.deli = vidniDeli();
    m.merilo = { m: (2 * rExt * A0) / OKVIR, oznaka: nm((2 * rExt * A0) / OKVIR) };
  }

  m.nadzor = [
    { tip: "izbira", id: "orbitala", oznaka: "Orbitala", moznosti: ORBITALE.map((o) => [o.id, o.oznaka]), vrednost: orbId, ob: (v) => { if (PO_ID[v]) { orbId = v; zgradiVsebino(); } } },
    { tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["ploskev", "Ploskev 90 %"], ["oblak", "Oblak točk"], ["prerez", "Prerez"]], vrednost: prikaz, ob: (v) => { prikaz = v; zgradiVsebino(); } },
    { tip: "stikalo", id: "osi", oznaka: "Osi x, y, z", vrednost: osiVidne, ob: (v) => { osiVidne = !!v; osi.visible = osiVidne; } },
    { tip: "stikalo", id: "vozli", oznaka: "Vozelne ploskve", vrednost: vozliVidni, ob: (v) => { vozliVidni = !!v; if (nodeMesh) nodeMesh.visible = vozliVidni; m.deli = vidniDeli(); } },
    { tip: "izpis", id: "kvantna", oznaka: "Kvantna števila", vrednost: () => { const o = PO_ID[orbId]; return `n = ${o.n}, l = ${o.l}, ${o.k.m ? `|m| = ${Math.abs(o.k.m)} (mešanica m = +${Math.abs(o.k.m)} in −${Math.abs(o.k.m)})` : "m = 0"} · radialni vozli: ${o.n - o.l - 1} · kotni vozli: ${o.l}`; } },
  ];
  osi.visible = osiVidne;
  zgradiVsebino();

  function dispose() {
    pocisti();
    group.traverse((x) => { if (x.geometry) x.geometry.dispose(); if (x.material) { x.material.map && x.material.map.dispose(); x.material.dispose(); } });
    for (const mt of [matPlus, matMinus, matPlusT, matMinusT, matVozel, matJedro, matPrerez, matObroba, matTPlus, matTMinus]) mt.dispose();
    sprite && sprite.dispose();
  }
  return m;
}
