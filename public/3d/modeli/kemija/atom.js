// Atom od vodika do kriptona: Bohrov model (lupine K–N) ali elektronski oblak.
// Oblak: gostota verjetnosti |ψ|² vsake zasedene podlupine, vodiku podobne orbitale z efektivnim nabojem jedra
// po Slaterjevih pravilih; zunanja lupina je umerjena na izračunani polmer atoma (Clementi in sod., 1967).
// Kemijske osi orbital: x proti gledalcu (three +z), y desno (three +x), z gor (three +y).

export const info = {
  id: "atom",
  naslov: "Atom",
  podrocje: "kemija",
  predmet: "KEM",
  opis: "Zgradba atomov od vodika do kriptona: Bohrov model z lupinami K–N ali elektronski oblak iz izračunanih orbital. Jedro je narisano močno povečano (v resnici je od 10 000- do 100 000-krat manjše od atoma), Bohrove tirnice pa so poenostavljena slika.",
  merilo: { m: 1.41e-10, oznaka: "0,14 nm" },
};

const A0 = 5.29177e-11; // Bohrov polmer v metrih
const PI = Math.PI, SQ = Math.sqrt;

// simbol, ime, masno število najpogostejšega stabilnega izotopa, izračunani polmer atoma v pm (Clementi 1967)
export const ELEMENTI = [
  ["H", "Vodik", 1, 53], ["He", "Helij", 4, 31], ["Li", "Litij", 7, 167], ["Be", "Berilij", 9, 112],
  ["B", "Bor", 11, 87], ["C", "Ogljik", 12, 67], ["N", "Dušik", 14, 56], ["O", "Kisik", 16, 48],
  ["F", "Fluor", 19, 42], ["Ne", "Neon", 20, 38], ["Na", "Natrij", 23, 190], ["Mg", "Magnezij", 24, 145],
  ["Al", "Aluminij", 27, 118], ["Si", "Silicij", 28, 111], ["P", "Fosfor", 31, 98], ["S", "Žveplo", 32, 88],
  ["Cl", "Klor", 35, 79], ["Ar", "Argon", 40, 71], ["K", "Kalij", 39, 243], ["Ca", "Kalcij", 40, 194],
  ["Sc", "Skandij", 45, 184], ["Ti", "Titan", 48, 176], ["V", "Vanadij", 51, 171], ["Cr", "Krom", 52, 166],
  ["Mn", "Mangan", 55, 161], ["Fe", "Železo", 56, 156], ["Co", "Kobalt", 59, 152], ["Ni", "Nikelj", 58, 149],
  ["Cu", "Baker", 63, 145], ["Zn", "Cink", 64, 142], ["Ga", "Galij", 69, 136], ["Ge", "Germanij", 74, 125],
  ["As", "Arzen", 75, 114], ["Se", "Selen", 80, 103], ["Br", "Brom", 79, 94], ["Kr", "Kripton", 84, 88],
];
const CRKE = "spdf", LUPINE = "KLMN";
const KAP = (l) => 2 * (2 * l + 1);
const AUFBAU = [[1, 0], [2, 0], [2, 1], [3, 0], [3, 1], [4, 0], [3, 2], [4, 1]];
const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
const nad = (x) => String(x).split("").map((c) => SUP[c]).join("");

/** Elektronska konfiguracija osnovnega stanja: [{n, l, e}] urejeno po n in l (izjemi Cr in Cu). */
export function konfiguracija(Z) {
  let ost = Z;
  const k = [];
  for (const [n, l] of AUFBAU) { if (ost <= 0) break; const e = Math.min(ost, KAP(l)); k.push({ n, l, e }); ost -= e; }
  if (Z === 24 || Z === 29) { // en elektron 4s preide v 3d: polovično oz. popolnoma zapolnjena 3d
    k.find((x) => x.n === 4 && x.l === 0).e = 1;
    k.find((x) => x.n === 3 && x.l === 2).e += 1;
  }
  return k.sort((a, b) => a.n - b.n || a.l - b.l);
}
export const zapis = (k) => k.map((x) => `${x.n}${CRKE[x.l]}${nad(x.e)}`).join(" ");
/** Skrajšani zapis z jedrom žlahtnega plina, npr. [Ar] 3d⁵ 4s¹. */
export function skrajsano(Z) {
  const zp = [[18, "Ar"], [10, "Ne"], [2, "He"]].find(([z]) => z < Z);
  if (!zp) return zapis(konfiguracija(Z));
  const jedro = new Set(konfiguracija(zp[0]).map((x) => `${x.n}${x.l}`));
  return `[${zp[1]}] ` + zapis(konfiguracija(Z).filter((x) => !jedro.has(`${x.n}${x.l}`)));
}
/** Število elektronov v lupinah K, L, M, N. */
export function lupine(Z) {
  const s = [0, 0, 0, 0];
  for (const x of konfiguracija(Z)) s[x.n - 1] += x.e;
  while (s.length && !s[s.length - 1]) s.pop();
  return s;
}
/** Efektivni naboj jedra po Slaterjevih pravilih za elektron v podlupini (n, l). */
export function zeff(Z, n, l) {
  const RED = ["1sp", "2sp", "3sp", "3d", "4sp", "4d", "4f"];
  const sk = (nn, ll) => (ll <= 1 ? `${nn}sp` : `${nn}${CRKE[ll]}`);
  const moja = sk(n, l), im = RED.indexOf(moja);
  let S = 0;
  for (const x of konfiguracija(Z)) {
    const g = sk(x.n, x.l), ig = RED.indexOf(g);
    const e = g === moja ? x.e - (x.n === n && x.l === l ? 1 : 0) : x.e;
    if (g === moja) S += e * (n === 1 ? 0.3 : 0.35);
    else if (ig > im) continue;
    else if (l >= 2) S += e;
    else if (x.n === n - 1) S += e * 0.85;
    else if (x.n < n - 1) S += e;
  }
  return Z - S;
}
function fakt(n) { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; }
function laguerre(k, a, x) {
  if (k === 0) return 1;
  let L0 = 1, L1 = 1 + a - x;
  for (let i = 1; i < k; i++) { const L2 = ((2 * i + 1 + a - x) * L1 - (i + a) * L0) / (i + 1); L0 = L1; L1 = L2; }
  return L1;
}
/** Vodikov radialni del R_nl(r) za Z = 1 (r v Bohrovih polmerih). */
export function radialna(n, l, r) {
  const rho = (2 * r) / n;
  return SQ(((2 / n) ** 3 * fakt(n - l - 1)) / (2 * n * fakt(n + l))) * Math.exp(-rho / 2) * rho ** l * laguerre(n - l - 1, 2 * l + 1, rho);
}
const TAB = new Map();
/** Kumulativna porazdelitev r²R² za vzorčenje, r pri 95 % in položaj zunanjega vrha. */
function tabela(n, l) {
  const kl = n * 10 + l;
  if (TAB.has(kl)) return TAB.get(kl);
  const rMax = 4 * n * n + 20, K = 4000, dr = rMax / K, cdf = new Float64Array(K + 1), P = new Float64Array(K);
  for (let i = 0; i < K; i++) { const r = (i + 0.5) * dr, R = radialna(n, l, r); P[i] = r * r * R * R; cdf[i + 1] = cdf[i] + P[i] * dr; }
  let i95 = 0;
  while (cdf[i95 + 1] < 0.95 * cdf[K]) i95++;
  let iv = K - 2;
  while (iv > 1 && !(P[iv] >= P[iv - 1] && P[iv] >= P[iv + 1])) iv--;
  const t = { cdf, K, dr, r95: (i95 + 0.5) * dr, rVrh: (iv + 0.5) * dr };
  TAB.set(kl, t);
  return t;
}
/** Položaj zunanjega vrha radialne porazdelitve r²R² vodikove podlupine (a0). */
export const vrh = (n, l) => tabela(n, l).rVrh;
/** Velikostni faktor (v a0 na vodikovo enoto) vsake podlupine: 1/Z_eff, zunanja lupina umerjena na polmer atoma. */
export function velikosti(Z) {
  const k = konfiguracija(Z), nMax = Math.max(...k.map((x) => x.n));
  const lHi = Math.max(...k.filter((x) => x.n === nMax).map((x) => x.l));
  const rModel = tabela(nMax, lHi).rVrh / zeff(Z, nMax, lHi);
  const f = ELEMENTI[Z - 1][3] / (A0 * 1e12) / rModel;
  return k.map((x) => ({ ...x, zeff: zeff(Z, x.n, x.l), a: (x.n === nMax ? f : 1) / zeff(Z, x.n, x.l) }));
}

// realne kotne funkcije (enotski vektor); zaporedje zapolnjevanja po Hundovem pravilu
const KOTNE = {
  0: [() => 0.5 / SQ(PI)],
  1: [(x) => SQ(3 / (4 * PI)) * x, (x, y) => SQ(3 / (4 * PI)) * y, (x, y, z) => SQ(3 / (4 * PI)) * z],
  2: [(x, y) => 0.5 * SQ(15 / PI) * x * y, (x, y, z) => 0.5 * SQ(15 / PI) * x * z, (x, y, z) => 0.5 * SQ(15 / PI) * y * z,
    (x, y) => 0.25 * SQ(15 / PI) * (x * x - y * y), (x, y, z) => 0.25 * SQ(5 / PI) * (3 * z * z - 1)],
};
const YMAX = { 0: 0.5 / SQ(PI), 1: SQ(3 / (4 * PI)), 2: Math.max(0.5 * SQ(15 / PI) * 0.5, 0.5 * SQ(5 / PI)) };
/** Elektroni po orbitalah podlupine po Hundovem pravilu: najprej po en v vsako, nato v pare. */
export function hund(l, e) {
  const n = 2 * l + 1, o = new Array(n).fill(0);
  for (let i = 0; i < e; i++) o[i % n]++;
  return o;
}

function mulberry(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const elektronov = (n) => `${n} ${n % 100 === 1 ? "elektron" : n % 100 === 2 ? "elektrona" : n % 100 === 3 || n % 100 === 4 ? "elektroni" : "elektronov"}`;
const nm = (m) => (m * 1e9).toPrecision(2).replace(".", ",") + " nm";
const vT = (x, y, z, s = 1) => [y * s, z * s, x * s];

const BARVA_POD = { "1s": "#cfe0ff", "2s": "#62e0bf", "2p": "#5a8cff", "3s": "#b8ec8c", "3p": "#6cc85a", "3d": "#e6cf55", "4s": "#ffb48a", "4p": "#f27a5c" };
const BARVA_LUP = ["#cfe0ff", "#5fcfd0", "#8fd46a", "#f5996c"];
const R_NUKLEON = 0.034, R_ELEKTRON = 0.03, R_ZUNANJA = 0.95, OBLAK_95 = 0.62, OBLAK_MAX = 0.9;

export function zgradi(THREE, ctx = {}) {
  const visoka = ctx.kakovost !== "nizka";
  const gibanje = ctx.gibanje !== false;
  const zac = ctx.zacetek || {};
  let Z = Math.min(36, Math.max(1, Math.round(Number(zac.Z) || 6)));
  let prikaz = zac.prikaz === "oblak" ? "oblak" : "bohr";

  const group = new THREE.Group();
  group.name = "atom";
  const vsebina = new THREE.Group();
  group.add(vsebina);

  // skupni videz kroglic (kot atomi v modelih molekule, kristali, periodni sistem): sijoč lak in mehak rob
  const fiz = (o) => new THREE.MeshPhysicalMaterial({ roughness: 0.32, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.14, sheen: 0.35, sheenRoughness: 0.45, sheenColor: "#dfe7ff", ...o });
  const matProton = fiz({ color: "#e8574a" });
  const matNevtron = fiz({ color: "#aab4c6" });
  // elektroni rahlo žarijo, da jih ločimo od delcev jedra
  const matElektron = fiz({ color: "#6f9dff", emissive: "#2f5fd8", emissiveIntensity: 0.85, roughness: 0.25, sheen: 0 });
  const matValenca = fiz({ color: "#ffd56e", emissive: "#c08a1a", emissiveIntensity: 0.8, roughness: 0.25, sheen: 0 });
  const matObroc = BARVA_LUP.map((b) => new THREE.MeshBasicMaterial({ color: b, transparent: true, opacity: 0.55, depthWrite: false }));
  const geoNukleon = new THREE.SphereGeometry(R_NUKLEON, visoka ? 24 : 10, visoka ? 16 : 7);
  const geoElektron = new THREE.SphereGeometry(R_ELEKTRON, visoka ? 20 : 10, visoka ? 14 : 7);
  let sprite = null;
  if (typeof document !== "undefined") {
    const cv = document.createElement("canvas"); cv.width = cv.height = 64;
    const g2 = cv.getContext("2d");
    if (g2) {
      const gr = g2.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.3, "rgba(255,255,255,0.7)"); gr.addColorStop(1, "rgba(255,255,255,0)");
      g2.fillStyle = gr; g2.fillRect(0, 0, 64, 64);
      sprite = new THREE.CanvasTexture(cv); sprite.colorSpace = THREE.SRGBColorSpace;
    }
  }
  // mehak sij okoli elektronov in jedra (le v brskalniku, kjer je platno)
  // velikost točk: three jih meri v višini zaslona/2, zato faktor 2,7 (vidni kot 40°) da približno svetovne enote
  const matSijE = sprite && new THREE.PointsMaterial({ color: "#5d8fff", size: 0.15 * 2.7, map: sprite, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
  const matSijV = sprite && new THREE.PointsMaterial({ color: "#ffc24d", size: 0.18 * 2.7, map: sprite, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
  // sij jedra je točka (ne Sprite), da ga senčenje okolice (GTAO) izpusti
  const matSijJ = sprite && new THREE.PointsMaterial({ map: sprite, color: "#ff8a6a", size: 1, transparent: true, opacity: 0.32, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
  const matTocke = new Map();
  const tockeMat = (barva, vel, sij = false) => {
    const kl = barva + vel.toFixed(3) + sij;
    if (!matTocke.has(kl)) matTocke.set(kl, new THREE.PointsMaterial({
      color: barva, size: sprite ? vel : 0.4 * vel, map: sprite, transparent: true, opacity: sij ? 0.07 : sprite ? 0.5 : 0.85,
      depthWrite: false, depthTest: false, sizeAttenuation: true, blending: sij ? THREE.AdditiveBlending : THREE.NormalBlending,
    }));
    return matTocke.get(kl);
  };

  const m = { group, deli: [], nadzor: [], merilo: null, korak, dispose };
  let vrtenje = []; // {el, r, e, w (kotna hitrost), faza}
  const _M = new THREE.Matrix4();

  function pocisti() {
    for (const o of [...vsebina.children]) vsebina.remove(o);
    for (const g of odvrzi) g.dispose();
    odvrzi.length = 0;
    vrtenje = [];
  }
  const odvrzi = [];

  /** Jedro: protoni in nevtroni, gosto zloženi (ploskovno centrirana kubična razporeditev). */
  function jedro(Zp, N) {
    const A = Zp + N, d = R_NUKLEON * SQ(2) * 1.0, kand = [], o = [0.13, 0.07, 0.05];
    const R = Math.ceil(Math.cbrt(A) * 1.5) + 1;
    for (let i = -R; i <= R; i++) for (let j = -R; j <= R; j++) for (let k = -R; k <= R; k++) {
      if ((i + j + k) % 2) continue;
      kand.push([i * d, j * d, k * d, Math.hypot(i * d - o[0] * d, j * d - o[1] * d, k * d - o[2] * d)]);
    }
    kand.sort((a, b) => a[3] - b[3]);
    const izb = kand.slice(0, A);
    const c = [0, 1, 2].map((q) => izb.reduce((s, p) => s + p[q], 0) / A);
    const rnd = mulberry(1000 + Zp * 7 + N);
    for (let i = izb.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [izb[i], izb[j]] = [izb[j], izb[i]]; }
    const g = new THREE.Group();
    const mp = new THREE.InstancedMesh(geoNukleon, matProton, Zp), mn = N ? new THREE.InstancedMesh(geoNukleon, matNevtron, N) : null;
    const M = new THREE.Matrix4();
    let rN = R_NUKLEON, pP = null, pN = null, bp = -1e9, bn = -1e9;
    izb.forEach((p, i) => {
      const x = p[0] - c[0], y = p[1] - c[1], z = p[2] - c[2];
      rN = Math.max(rN, Math.hypot(x, y, z) + R_NUKLEON);
      M.makeTranslation(x, y, z);
      const sc = x * 0.45 + y * 0.3 + z * 0.84; // najbolj proti kameri
      if (i < Zp) { mp.setMatrixAt(i, M); if (sc > bp) { bp = sc; pP = [x, y, z]; } }
      else { mn.setMatrixAt(i - Zp, M); if (sc > bn) { bn = sc; pN = [x, y, z]; } }
    });
    odvrzi.push(mp); if (mn) odvrzi.push(mn);
    mp.instanceMatrix.needsUpdate = true; g.add(mp);
    if (mn) { mn.instanceMatrix.needsUpdate = true; g.add(mn); }
    for (const x of [mp, mn]) if (x) { x.computeBoundingSphere(); x.computeBoundingBox && x.computeBoundingBox(); }
    return { g, mp, mn, rN, pP, pN };
  }

  function zgradiVsebino() {
    pocisti();
    const [sim, ime, A] = ELEMENTI[Z - 1], N = A - Z;
    const konf = konfiguracija(Z), lup = lupine(Z), nL = lup.length, val = lup[nL - 1];
    const deli = [];
    const J = jedro(Z, N);
    vsebina.add(J.g);
    const izotop = `${nad(A)}${sim}`;
    const prehodni = Z >= 21 && Z <= 29; // pri cinku je podlupina 3d polna in se ne veže

    if (prikaz === "bohr") {
      const radiji = lup.map((_, k) => Math.max(J.rN + 0.1 * (k + 1), R_ZUNANJA * ((k + 1) / nL) ** 0.8));
      const tockaLup = [];
      lup.forEach((e, k) => {
        const r = radiji[k], sk = new THREE.Group();
        const tor = new THREE.TorusGeometry(r, 0.0055, 6, visoka ? 160 : 96);
        odvrzi.push(tor);
        const obroc = new THREE.Mesh(tor, matObroc[k]);
        const zunanja = k === nL - 1;
        const el = new THREE.InstancedMesh(geoElektron, zunanja ? matValenca : matElektron, e);
        // elektroni krožijo: v korak() premikamo instance (skupine ne vrtimo, da ostane omejitveni kvader tesen)
        el.boundingBox = new THREE.Box3(new THREE.Vector3(-r - R_ELEKTRON, -r - R_ELEKTRON, -R_ELEKTRON), new THREE.Vector3(r + R_ELEKTRON, r + R_ELEKTRON, R_ELEKTRON));
        el.boundingSphere = new THREE.Sphere(new THREE.Vector3(), r + R_ELEKTRON);
        odvrzi.push(el);
        sk.add(el);
        let sij = null;
        if (sprite) {
          const gs = new THREE.BufferGeometry();
          gs.setAttribute("position", new THREE.BufferAttribute(new Float32Array(e * 3), 3));
          gs.boundingSphere = new THREE.Sphere(new THREE.Vector3(), r + 0.1);
          odvrzi.push(gs);
          sij = new THREE.Points(gs, zunanja ? matSijV : matSijE);
          sij.renderOrder = 5; sij.raycast = () => {}; // sij ni tarča tapa (prag točk bi bil cel model)
          sk.add(sij);
        }
        vrtenje.push({ el, sij, r, e, w: 0.55 / (k + 1), faza: 0.4 * k });
        vsebina.add(obroc, sk);
        const f = (-35 * PI) / 180;
        tockaLup.push([r * Math.cos(f), r * Math.sin(f), 0]);
        const pod = konf.filter((x) => x.n === k + 1).map((x) => `${x.n}${CRKE[x.l]}${nad(x.e)}`).join(" ");
        deli.push({
          id: "lupina-" + LUPINE[k], ime: `Lupina ${LUPINE[k]}`, barva: BARVA_LUP[k], meshes: sij ? [obroc, el, sij] : [obroc, el], tocka: tockaLup[k],
          opis: `V lupini ${LUPINE[k]} (${k + 1}. lupina) ${e === 2 ? "sta" : e === 3 || e === 4 ? "so" : "je"} ${elektronov(e)}: ${pod}.`,
        });
        if (zunanja) {
          // točka na elektronu, ki je ob t = 0 najbližje 140° (brez gibanja tam tudi ostane)
          const f0 = 0.4 * k, ie = Math.round((((140 * PI) / 180 - f0) * e) / (2 * PI));
          const fv = f0 + (2 * PI * ie) / e;
          deli.push({
            id: "valencni", ime: "Valenčni elektroni", barva: "#ffd166", meshes: sij ? [el, sij] : [el], tocka: [r * Math.cos(fv), r * Math.sin(fv), 0],
            opis: opisValence(val, k),
          });
        }
      });
      const rA = ELEMENTI[Z - 1][3] * 1e-12;
      m.merilo = { m: (2 * rA) / R_ZUNANJA, oznaka: nm((2 * rA) / R_ZUNANJA) };
    } else {
      // elektronski oblak
      const vel = velikosti(Z);
      const rMax95 = Math.max(...vel.map((x) => tabela(x.n, x.l).r95 * x.a));
      const sc = OBLAK_95 / rMax95; // enot scene na a0
      J.g.scale.setScalar(0.022 / J.rN);
      const Ne = visoka ? Math.min(4000, 48000 / Z) : Math.min(1600, 18000 / Z);
      const rnd = mulberry(Z * 13 + 5);
      const poLupinah = lup.map(() => []);
      for (const x of vel) {
        const tab = tabela(x.n, x.l), P = [], orb = hund(x.l, x.e), Ymax = YMAX[x.l];
        orb.forEach((eo, io) => {
          const Y = KOTNE[x.l][io], cilj = Math.round(eo * Ne);
          let n = 0, posk = 0;
          while (n < cilj && posk++ < cilj * 40) {
            const u = rnd() * tab.cdf[tab.K];
            let lo = 0, hi = tab.K;
            while (lo < hi) { const mid = (lo + hi) >> 1; if (tab.cdf[mid + 1] < u) lo = mid + 1; else hi = mid; }
            const r = (lo + rnd()) * tab.dr * x.a * sc;
            if (r > OBLAK_MAX) continue;
            let px, py, pz;
            for (;;) {
              pz = 2 * rnd() - 1; const ph = 2 * PI * rnd(), q = SQ(1 - pz * pz); px = q * Math.cos(ph); py = q * Math.sin(ph);
              const y = Y(px, py, pz);
              if (rnd() * Ymax * Ymax <= y * y) break;
            }
            P.push(...vT(px, py, pz, r)); n++;
          }
        });
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(P, 3));
        odvrzi.push(g);
        // razpršene podlupine dobijo večje (mehkejše) pike, zbite manjše: gostota pik ostane sorazmerna |ψ|²
        const raz = Math.min(1, Math.max(0.3, (tab.r95 * x.a * sc) / OBLAK_95)) ** 0.6;
        const pts = new THREE.Points(g, tockeMat(BARVA_POD[`${x.n}${CRKE[x.l]}`], (visoka ? 0.05 : 0.06) * raz));
        pts.renderOrder = 20 - 4 * x.n - x.l; // notranje podlupine nazadnje, da se v sredini vidijo njihove barve
        vsebina.add(pts);
        if (sprite) {
          // mehak sij: vsaka peta pika še enkrat, velika in zelo prosojna, s seštevanjem svetlobe
          const S = [];
          for (let i = 0; i < P.length; i += 15) S.push(P[i], P[i + 1], P[i + 2]);
          const gs = new THREE.BufferGeometry();
          gs.setAttribute("position", new THREE.Float32BufferAttribute(S, 3));
          odvrzi.push(gs);
          const sij = new THREE.Points(gs, tockeMat(BARVA_POD[`${x.n}${CRKE[x.l]}`], (visoka ? 0.05 : 0.06) * raz * 4, true));
          sij.renderOrder = 1;
          pts.add(sij);
        }
        poLupinah[x.n - 1].push({ pts, x });
      }
      const f = (-35 * PI) / 180;
      lup.forEach((e, k) => {
        const rr = Math.min(0.85, Math.max(...poLupinah[k].map(({ x }) => tabela(x.n, x.l).rVrh * x.a * sc)));
        const pod = poLupinah[k].map(({ x }) => `${x.n}${CRKE[x.l]}${nad(x.e)}`).join(" ");
        // oznake ob jedru razmaknemo: K levo gor, L desno, jedro spodaj (notranje lupine so v resnici zelo majhne)
        const fk = nL > 1 && k === 0 ? (120 * PI) / 180 : nL > 2 && k === 1 ? 0 : f;
        const rt = nL > 1 ? Math.max(rr, [0.14, 0.26][k] || 0) : rr; // najmanjši odmik oznake od jedra, da se oznake ne prekrivajo
        const t = [rt * Math.cos(fk), rt * Math.sin(fk), 0.05];
        deli.push({
          id: "lupina-" + LUPINE[k], ime: `Lupina ${LUPINE[k]}`, barva: BARVA_LUP[k], meshes: poLupinah[k].map((p) => p.pts), tocka: t,
          opis: `${elektronov(e)} v lupini ${LUPINE[k]} (${pod}); barve kažejo podlupine, gostota pik verjetnost |ψ|².`.replace(/^./, (c) => c.toUpperCase()),
        });
        if (k === nL - 1) {
          const fv = (140 * PI) / 180;
          deli.push({ id: "valencni", ime: "Valenčni elektroni", barva: "#ffd166", meshes: poLupinah[k].map((p) => p.pts), tocka: [rr * Math.cos(fv), rr * Math.sin(fv), 0.05], opis: opisValence(val, k) });
        }
      });
      m.merilo = { m: (2 / sc) * A0, oznaka: nm((2 / sc) * A0) };
    }

    if (matSijJ) {
      // topel sij za jedrom (v oblaku manjši, da ne prekrije notranje podlupine)
      const gj = new THREE.BufferGeometry();
      gj.setAttribute("position", new THREE.BufferAttribute(new Float32Array(3), 3));
      odvrzi.push(gj);
      matSijJ.size = (prikaz === "bohr" ? J.rN * 4.2 : 0.11) * 2.7;
      const sj = new THREE.Points(gj, matSijJ);
      sj.renderOrder = -1; sj.raycast = () => {};
      vsebina.add(sj);
    }
    const sJ = J.g.scale.x;
    const v3 = (p) => p.map((q) => q * sJ);
    const bohr = prikaz === "bohr"; // v oblaku je jedro le pika: protonov in nevtronov ne ponudimo posebej
    deli.unshift(
      { id: "jedro", ime: "Atomsko jedro", barva: "#e8574a", meshes: [J.mp, J.mn].filter(Boolean), tocka: bohr ? [0, J.rN * sJ, 0] : [-0.09, -0.12, 0], // v oblaku levo spodaj, stran od oznak lupin
        opis: `Jedro iz ${Z} ${Z === 1 ? "protona" : "protonov"} ${N ? "in " : ""}${N ? `${N} ${N === 1 ? "nevtrona" : "nevtronov"}` : "brez nevtronov"} je narisano močno povečano – v resnici je od 10 000- do 100 000-krat manjše od atoma.` },
      ...(bohr ? [{ id: "protoni", ime: "Protoni", barva: "#e8574a", meshes: [J.mp], tocka: v3(J.pP),
        opis: `Pozitivno nabiti delci v jedru; njihovo število je vrstno število Z = ${Z} in določa, kateri element je to.` }] : []),
    );
    if (J.mn && bohr) deli.splice(2, 0, { id: "nevtroni", ime: "Nevtroni", barva: "#aab4c6", meshes: [J.mn], tocka: v3(J.pN),
      opis: `Delci brez naboja; skupaj s protoni dajo masno število A = ${A} (izotop ${izotop}).` });
    m.deli = deli;

    function opisValence(v, k) {
      if (Z === 2 || Z === 10 || Z === 18 || Z === 36) return `${elektronov(v)} v zunanji lupini ${LUPINE[k]}: lupina žlahtnega plina je zapolnjena, zato se atom skoraj ne veže z drugimi.`;
      return `${elektronov(v)} v zunanji lupini ${LUPINE[k]}; ti elektroni sodelujejo pri nastanku kemijskih vezi.` +
        (prehodni ? " Pri prehodnih kovinah pri vezavi sodelujejo tudi elektroni podlupine 3d." : "");
    }
    korak(0, 0);
  }

  function korak(t) {
    for (const { el, sij, r, e, w, faza } of vrtenje) {
      const f0 = faza + (gibanje ? w * (t || 0) : 0), sp = sij && sij.geometry.attributes.position;
      for (let i = 0; i < e; i++) {
        const f = f0 + (2 * PI * i) / e, x = r * Math.cos(f), y = r * Math.sin(f);
        el.setMatrixAt(i, _M.makeTranslation(x, y, 0));
        if (sp) sp.setXYZ(i, x, y, 0);
      }
      el.instanceMatrix.needsUpdate = true;
      if (sp) sp.needsUpdate = true;
    }
  }

  m.nadzor = [
    { tip: "drsnik", id: "Z", oznaka: "Vrstno število Z", min: 1, max: 36, korak: 1, vrednost: Z, ob: (v) => { Z = Math.min(36, Math.max(1, Math.round(Number(v) || 1))); zgradiVsebino(); } },
    { tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["bohr", "Bohrov model"], ["oblak", "Elektronski oblak"]], vrednost: prikaz, ob: (v) => { prikaz = v === "oblak" ? "oblak" : "bohr"; zgradiVsebino(); } },
    { tip: "izpis", id: "element", oznaka: "Element", vrednost: () => `${ELEMENTI[Z - 1][1]} (${ELEMENTI[Z - 1][0]}), Z = ${Z}` },
    { tip: "izpis", id: "razporeditev", oznaka: "Razporeditev elektronov", vrednost: () => zapis(konfiguracija(Z)) },
    { tip: "izpis", id: "delci", oznaka: "Delci", vrednost: () => { const A = ELEMENTI[Z - 1][2]; return `${Z} p⁺ · ${A - Z} n⁰ · ${Z} e⁻ (izotop ${nad(A)}${ELEMENTI[Z - 1][0]}, A = ${A})`; } },
    { tip: "izpis", id: "lupine", oznaka: "Lupine", vrednost: () => { const l = lupine(Z); return l.map((e, k) => `${LUPINE[k]} ${e}`).join(" · ") + ` · valenčni e⁻: ${l[l.length - 1]}`; } },
  ];
  zgradiVsebino();

  function dispose() {
    pocisti();
    for (const x of [matProton, matNevtron, matElektron, matValenca, ...matObroc, ...matTocke.values(), geoNukleon, geoElektron, matSijE, matSijV, matSijJ]) if (x) x.dispose();
    sprite && sprite.dispose();
  }
  return m;
}
