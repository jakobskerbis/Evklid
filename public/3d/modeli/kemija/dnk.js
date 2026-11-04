// DNA (dvojna vijačnica, oblika B) in RNA (lasnica, oblika A), zgrajeni iz pravih mer. Pogodba: docs/3d.md.
//
// Viri (vsi CC0 ali lastni izračun):
// - Koordinate baz v standardnem koordinatnem sistemu baznega para: W. K. Olson in sod. (2001),
//   »A standard reference frame for the description of nucleic acid base-pair geometry«, J. Mol. Biol. 313, 229–237.
// - Sladkorno-fosfatna hrbtenica v obliki B: PDB 1BNA (H. R. Drew in sod., PNAS 78, 2179, 1981), nukleotid B22.
// - Hrbtenica v obliki A in zanka UUCG: PDB 2KOC (S. Nozinovic in sod., Nucleic Acids Res. 38, 683, 2010), model 1.
//   Podatki PDB so v javni lasti (CC0). Koordinate so v ångströmih (1 Å = 0,1 nm), zaokrožene na 0,01 Å.
// Vijačnica je zgrajena z vijačno simetrijo: oblika B 0,34 nm in 360°/10,5 na bazni par (desnosučna), oblika A
// 0,28 nm in 360°/11 na bazni par, bazni pari 0,45 nm od osi in nagnjeni za 16°.

export const info = {
  id: "dnk",
  naslov: "DNA in RNA",
  podrocje: "kemija",
  predmet: "BIO",
  opis: "Dvojna vijačnica DNA v pravih merah (premer 2 nm, 0,34 nm na bazni par, 10,5 baznega para na zavoj) in lasnica RNA. Vijačnico lahko odpreš kot zadrgo; baze so poenostavljene v ploščice, vodikovi atomi niso prikazani.",
  merilo: { m: 9.5e-9, oznaka: "9,5 nm" },
  poskusi: "Povleci drsnik »Odpiranje« in poglej, kako se vijačnica DNA odpre; nato preklopi na RNA.",
};

// ---------------------------------------------------------------- podatki (Å)
const BAZE = {
  A: { "C1'": [-2.48, 5.35, 0], "N9": [-1.29, 4.5, 0], "C8": [0.02, 4.9, 0], "N7": [0.88, 3.9, 0], "C5": [0.07, 2.77, 0], "C6": [0.37, 1.4, 0], "N6": [1.61, 0.91, 0], "N1": [-0.67, 0.53, 0], "C2": [-1.91, 1.02, 0], "N3": [-2.32, 2.29, 0], "C4": [-1.27, 3.12, 0] },
  G: { "C1'": [-2.48, 5.4, 0], "N9": [-1.29, 4.55, 0], "C8": [0.02, 4.96, 0], "N7": [0.87, 3.97, 0], "C5": [0.07, 2.83, 0], "C6": [0.42, 1.46, 0], "O6": [1.55, 0.95, 0], "N1": [-0.7, 0.64, 0], "C2": [-2, 1.09, 0], "N2": [-2.95, 0.14, 0], "N3": [-2.34, 2.36, 0], "C4": [-1.26, 3.18, 0] },
  C: { "C1'": [-2.48, 5.4, 0], "N1": [-1.28, 4.54, 0], "C2": [-1.47, 3.16, 0], "O2": [-2.63, 2.71, 0], "N3": [-0.39, 2.34, 0], "C4": [0.84, 2.87, 0], "N4": [1.88, 2.03, 0], "C5": [1.06, 4.28, 0], "C6": [-0.02, 5.07, 0] },
  T: { "C1'": [-2.48, 5.35, 0], "N1": [-1.28, 4.5, 0], "C2": [-1.46, 3.13, 0], "O2": [-2.56, 2.61, 0], "N3": [-0.3, 2.41, 0], "C4": [0.99, 2.9, 0], "O4": [1.94, 2.12, 0], "C5": [1.11, 4.34, 0], "C7": [2.47, 4.96, 0], "C6": [-0.02, 5.06, 0] },
  U: { "C1'": [-2.48, 5.35, 0], "N1": [-1.28, 4.5, 0], "C2": [-1.46, 3.13, 0], "O2": [-2.56, 2.61, 0], "N3": [-0.3, 2.4, 0], "C4": [0.99, 2.93, 0], "O4": [1.98, 2.2, 0], "C5": [1.09, 4.31, 0], "C6": [-0.02, 5.06, 0] },
};
const OKOSTJE = {
  B: { "P": [-1.13, 9.12, -2.82], "OP1": [-1.96, 10.3, -3.17], "OP2": [0.17, 9.41, -2.14], "O5'": [-1.97, 8.14, -1.9], "C5'": [-3.31, 7.75, -2.25], "C4'": [-3.79, 6.82, -1.17], "O4'": [-3.02, 5.6, -1.24], "C3'": [-3.61, 7.29, 0.28], "O3'": [-4.63, 6.76, 1.09], "C2'": [-2.25, 6.71, 0.63] },
  A: { "P": [1.01, 9.27, 0.4], "OP1": [0.69, 10.53, 1.11], "OP2": [2.22, 8.5, 0.78], "O5'": [-0.25, 8.31, 0.48], "C5'": [-1.57, 8.79, 0.26], "C4'": [-2.56, 7.65, 0.36], "O4'": [-2.21, 6.6, -0.58], "C3'": [-2.59, 6.95, 1.71], "O3'": [-3.47, 7.62, 2.61], "C2'": [-3.12, 5.56, 1.36], "O2'": [-4.53, 5.56, 1.27] },
};
const ZANKA = [
  { b: "U", R: [0.7178, -0.6617, 0.2169, 0.6638, 0.7443, 0.0738, -0.2103, 0.091, 0.9734], t: [2.35, -0.35, 3.52],
    at: { "P": [0.87, 9.32, 0.32], "OP1": [0.59, 10.66, 0.88], "OP2": [2.16, 8.66, 0.66], "O5'": [-0.33, 8.36, 0.74], "C5'": [-1.68, 8.8, 0.61], "C4'": [-2.62, 7.61, 0.6], "O4'": [-2.18, 6.66, -0.41], "C3'": [-2.66, 6.79, 1.88], "O3'": [-3.55, 7.36, 2.83], "C2'": [-3.18, 5.44, 1.38], "O2'": [-4.58, 5.46, 1.21] } },
  { b: "U", R: [-0.2763, 0.8943, 0.352, 0.7227, 0.4348, -0.5372, -0.6335, 0.106, -0.7665], t: [-11.64, -1.71, 8.09],
    at: { "P": [0.53, 9.13, -0.56], "OP1": [0.75, 8.75, -1.97], "OP2": [0.49, 10.57, -0.19], "O5'": [-0.84, 8.47, -0.08], "C5'": [-2.05, 8.71, -0.79], "C4'": [-3.02, 7.57, -0.58], "O4'": [-2.37, 6.34, -1], "C3'": [-3.46, 7.35, 0.86], "O3'": [-4.87, 7.17, 0.96], "C2'": [-2.71, 6.1, 1.31], "O2'": [-3.49, 5.3, 2.18] } },
  { b: "C", R: [-0.5829, -0.4985, 0.6417, 0.7113, -0.6948, 0.1064, 0.3928, 0.5185, 0.7596], t: [2.3, 2.89, 5.82],
    at: { "P": [0.56, 9.24, 0.95], "OP1": [-0.03, 10.52, 1.37], "OP2": [1.27, 8.41, 1.95], "O5'": [-0.57, 8.34, 0.29], "C5'": [-1.85, 8.87, -0.05], "C4'": [-2.86, 7.75, -0.2], "O4'": [-2.18, 6.59, -0.76], "C3'": [-3.49, 7.26, 1.1], "O3'": [-4.85, 6.88, 0.91], "C2'": [-2.66, 6.03, 1.45], "O2'": [-3.4, 5.11, 2.23] } },
  { b: "G", R: [-0.772, -0.3329, 0.5415, 0.4795, -0.8642, 0.1523, 0.4173, 0.3772, 0.8268], t: [-2.16, -1.72, 5.37],
    at: { "P": [-4.88, 3.86, 4.56], "OP1": [-4.31, 4.57, 5.73], "OP2": [-6.27, 3.35, 4.64], "O5'": [-4.77, 4.82, 3.3], "C5'": [-5.24, 4.42, 2.02], "C4'": [-4.54, 5.2, 0.94], "O4'": [-3.12, 5.27, 1.24], "C3'": [-4.57, 4.6, -0.46], "O3'": [-5.79, 4.9, -1.12], "C2'": [-3.39, 5.28, -1.14], "O2'": [-3.76, 6.54, -1.65] } },
];

const OBROCI = {
  A: [["N9", "C8", "N7", "C5", "C4"], ["C4", "C5", "C6", "N1", "C2", "N3"]],
  G: [["N9", "C8", "N7", "C5", "C4"], ["C4", "C5", "C6", "N1", "C2", "N3"]],
  C: [["N1", "C2", "N3", "C4", "C5", "C6"]],
  T: [["N1", "C2", "N3", "C4", "C5", "C6"]],
  U: [["N1", "C2", "N3", "C4", "C5", "C6"]],
};
// Vezi iz obroča na stranske atome (in glikozidna vez do C1' sladkorja).
const VEJE = {
  A: [["C6", "N6"], ["N9", "C1'"]],
  G: [["C6", "O6"], ["C2", "N2"], ["N9", "C1'"]],
  C: [["C4", "N4"], ["C2", "O2"], ["N1", "C1'"]],
  T: [["C4", "O4"], ["C2", "O2"], ["C5", "C7"], ["N1", "C1'"]],
  U: [["C4", "O4"], ["C2", "O2"], ["N1", "C1'"]],
};
// Vodikove vezi Watson–Crickovega para: [atom purina, atom pirimidina].
const VODIKOVE = { AT: [["N6", "O4"], ["N1", "N3"]], AU: [["N6", "O4"], ["N1", "N3"]], GC: [["O6", "N4"], ["N1", "N3"], ["N2", "O2"]] };
export const KOMPLEMENT = { DNK: { A: "T", T: "A", G: "C", C: "G" }, RNK: { A: "U", U: "A", G: "C", C: "G" } };

const OBLIKA = {
  B: { dvig: 3.4, zasuk: 360 / 10.5, dx: 0, nagib: 0 },
  A: { dvig: 2.8, zasuk: 360 / 11, dx: -4.5, nagib: 16 },
};
const ZAP_DNK = "ATGCCGTATTGCAGCTAAGTC"; // veriga I, 5'→3' od spodaj navzgor
const STEBLO_RNK = "GGACUAGCAC"; // veriga do zanke; zanka UUCG; nato komplement (lasnica cUUCGg iz 2KOC)
const MAX_ODPRTIH = 15;
// Kje na molekuli (delež višine) so točke delov, da se oznake ne prekrivajo.
const CILJI = {
  DNK: { fosfat: 0.33, sladkor: 0.27, hrbtenica: 0.9, hrbtenicaStran: 1, A: 0.69, T: 0.5, G: 0.05, C: 0.86, vez: 4, velikiZleb: 0.64, maliZleb: 0.6 },
  RNK: { fosfat: 0.26, sladkor: 0.08, hrbtenica: 0.91, hrbtenicaStran: 1, A: 0.68, U: 0.6, G: 0.52, C: 0.7, vez: 1, velikiZleb: 0.49, maliZleb: 0.56 },
};
const FI_RAZPRTJA = -60 * Math.PI / 180;

const BARVE = {
  A: "#ef6b62", T: "#f3c34f", G: "#4fc788", C: "#5b9cf2", U: "#b48cf2",
  fosfat: "#f08a3c", sladkor: "#e4e8ef", veriga1: "#8fb0ea", veriga2: "#c6a9ec", rnk: "#86d2c3",
  vez: "#eef3ff", konec: "#f4f6fa", velikiZleb: "#6e9bff", maliZleb: "#e27ff5",
};
const ELEMENTI = { C: ["#a0a7b4", 1.7], N: ["#3050f8", 1.55], O: ["#e8453c", 1.52], P: ["#ff8000", 1.8] };
const SLADKOR_ATOMI = ["C1'", "C2'", "C3'", "C4'", "O4'", "C5'", "O2'"];
const FOSFAT_ATOMI = ["P", "OP1", "OP2", "O5'", "O3'"];
const IME_BAZE = { A: "adenin", T: "timin", G: "gvanin", C: "citozin", U: "uracil" };

const deg = Math.PI / 180;
const el = (ime) => ime[0];
const nm = (x) => x.toFixed(2).replace(".", ",");

// ---------------------------------------------------------------- zgradba molekule
/** Nukleotidi z okvirji (Matrix4, Å, os vijačnice = z) in pari baz. */
export function zgradba(THREE, molekula) {
  const nt = [], pari = [], verige = [];
  const Rx180 = new THREE.Matrix4().makeRotationX(Math.PI);
  const okvirPara = (k, o, fi) => {
    const m = new THREE.Matrix4().makeRotationZ(fi ?? k * o.zasuk * deg);
    m.multiply(new THREE.Matrix4().makeTranslation(o.dx, 0, 0)).multiply(new THREE.Matrix4().makeRotationX(o.nagib * deg));
    m.premultiply(new THREE.Matrix4().makeTranslation(0, 0, k * o.dvig));
    return m;
  };
  const dodaj = (veriga, baza, F, at, k, stran = veriga) => { nt.push({ veriga, baza, F, F0: F.clone(), at, k, stran }); return nt.length - 1; };
  if (molekula === "DNK") {
    const o = OBLIKA.B, n = ZAP_DNK.length, I = [], II = [];
    for (let k = 0; k < n; k++) {
      const F = okvirPara(k, o);
      I.push(dodaj(0, ZAP_DNK[k], F, OKOSTJE.B, k));
    }
    for (let k = n - 1; k >= 0; k--) {
      const F = okvirPara(k, o).multiply(Rx180);
      II.push(dodaj(1, KOMPLEMENT.DNK[ZAP_DNK[k]], F, OKOSTJE.B, k));
    }
    for (let k = 0; k < n; k++) pari.push([I[k], II[n - 1 - k], k]);
    verige.push(I, II);
    return { molekula, oblika: o, nt, pari, verige, nPar: n, zanka: [] };
  }
  const o = OBLIKA.A, n = STEBLO_RNK.length, V = [];
  const I = [];
  for (let k = 0; k < n; k++) I.push(dodaj(0, STEBLO_RNK[k], okvirPara(k, o), OKOSTJE.A, k));
  const vrh = okvirPara(n - 1, o), zanka = [];
  for (const z of ZANKA) {
    const r = z.R, L = new THREE.Matrix4().set(r[0], r[1], r[2], z.t[0], r[3], r[4], r[5], z.t[1], r[6], r[7], r[8], z.t[2], 0, 0, 0, 1);
    zanka.push(dodaj(0, z.b, vrh.clone().multiply(L), z.at, n - 1, 2));
  }
  const II = [];
  for (let k = n - 1; k >= 0; k--) II.push(dodaj(0, KOMPLEMENT.RNK[STEBLO_RNK[k]], okvirPara(k, o).multiply(Rx180), OKOSTJE.A, k, 1));
  for (let k = 0; k < n; k++) pari.push([I[k], II[n - 1 - k], k]);
  V.push(...I, ...zanka, ...II);
  verige.push(V);
  return { molekula, oblika: o, nt, pari, verige, nPar: n, zanka };
}

/** Lokalni položaj atoma nukleotida (baza ali hrbtenica). */
function lokalno(n, ime) {
  return BAZE[n.baza][ime] || n.at[ime] || null;
}

/** Odpiranje dvojne vijačnice (zadrga): okvirji nukleotidov pri deležu u (0–1). */
function odpri(THREE, s, u) {
  const o = s.oblika, n = s.nPar, kf = n - 0.5 - u * MAX_ODPRTIH, w = o.zasuk * deg;
  // Razprti verigi se zavrtita v stalno ravnino (v privzetem pogledu levo–desno), da se razcep vidi.
  let delta = (FI_RAZPRTJA - kf * w) % (2 * Math.PI);
  if (delta > Math.PI) delta -= 2 * Math.PI;
  if (delta < -Math.PI) delta += 2 * Math.PI;
  const T = new THREE.Matrix4(), R = new THREE.Matrix4();
  for (const x of s.nt) {
    const d = x.k - kf, f = d <= -0.5 ? 0 : d >= 0.5 ? d : (d + 0.5) ** 2 / 2;
    if (f === 0) { x.F.copy(x.F0); continue; }
    const b = Math.min(1, f / 4), mehko = b * b * (3 - 2 * b);
    const zasuk = -f * w + mehko * delta, fi = x.k * w + zasuk;
    const sigma = x.veriga === 0 ? 1 : -1, pomik = 1.15 * f * sigma;
    R.makeRotationZ(zasuk);
    T.makeTranslation(-Math.sin(fi) * pomik, Math.cos(fi) * pomik, 0);
    x.F.copy(x.F0).premultiply(R).premultiply(T);
  }
  return kf;
}

// ---------------------------------------------------------------- geometrija
/** Prizma iz (skoraj) ravninskega konveksnega mnogokotnika točk p (Å), debelina h, robovi zaobljeni s posnetjem
 * širine rob (mehke normale, da je ploščica videti kot zglajena tableta); vrne trikotnike in normale. */
function prizma(tocke, h, skrci = 1, rob = 0) {
  const n = tocke.length;
  const c = [0, 0, 0];
  for (const p of tocke) { c[0] += p[0] / n; c[1] += p[1] / n; c[2] += p[2] / n; }
  // Newellova normala
  let nx = 0, ny = 0, nz = 0;
  for (let i = 0; i < n; i++) {
    const a = tocke[i], b = tocke[(i + 1) % n];
    nx += (a[1] - b[1]) * (a[2] + b[2]); ny += (a[2] - b[2]) * (a[0] + b[0]); nz += (a[0] - b[0]) * (a[1] + b[1]);
  }
  const l = Math.hypot(nx, ny, nz); nx /= l; ny /= l; nz /= l;
  const N0 = [nx, ny, nz];
  const q = tocke.map((p) => {
    const d = (p[0] - c[0]) * nx + (p[1] - c[1]) * ny + (p[2] - c[2]) * nz;
    return [c[0] + (p[0] - nx * d - c[0]) * skrci, c[1] + (p[1] - ny * d - c[1]) * skrci, c[2] + (p[2] - nz * d - c[2]) * skrci];
  });
  // normale stranskih ploskev (robov) in zglajene normale oglišč
  const sN = [];
  for (let i = 0; i < n; i++) {
    const a = q[i], b = q[(i + 1) % n];
    const mx = (a[0] + b[0]) / 2 - c[0], my = (a[1] + b[1]) / 2 - c[1], mz = (a[2] + b[2]) / 2 - c[2];
    const d = mx * nx + my * ny + mz * nz;
    let sx = mx - nx * d, sy = my - ny * d, sz = mz - nz * d;
    // pravokotno na rob v ravnini (za podolgovate palčke je to bolje od smeri iz središča)
    const ex = b[0] - a[0], ey = b[1] - a[1], ez = b[2] - a[2];
    let px = ey * nz - ez * ny, py = ez * nx - ex * nz, pz = ex * ny - ey * nx;
    if (px * sx + py * sy + pz * sz < 0) { px = -px; py = -py; pz = -pz; }
    const pl = Math.hypot(px, py, pz) || 1;
    sN.push([px / pl, py / pl, pz / pl]);
  }
  const vN = q.map((_, i) => {
    const a = sN[(i + n - 1) % n], b = sN[i], v = [a[0] + b[0], a[1] + b[1], a[2] + b[2]], vl = Math.hypot(...v) || 1;
    return v.map((x) => x / vl);
  });
  const nrm = (v) => { const vl = Math.hypot(...v) || 1; return v.map((x) => x / vl); };
  const zamik = (p, i, dz, noter) => {
    const v = vN[i];
    return [p[0] + nx * dz - v[0] * noter, p[1] + ny * dz - v[1] * noter, p[2] + nz * dz - v[2] * noter];
  };
  const b = Math.min(rob, h * 0.45);
  const top = q.map((p, i) => zamik(p, i, h / 2, b)), bot = q.map((p, i) => zamik(p, i, -h / 2, b));
  const topR = q.map((p, i) => zamik(p, i, h / 2 - b, 0)), botR = q.map((p, i) => zamik(p, i, -h / 2 + b, 0));
  const P = [], N = [];
  const tri = (a, bb, cc, na, nb, nc) => { P.push(...a, ...bb, ...cc); N.push(...na, ...(nb || na), ...(nc || na)); };
  for (let i = 1; i < n - 1; i++) {
    tri(top[0], top[i], top[i + 1], N0);
    tri(bot[0], bot[i + 1], bot[i], [-nx, -ny, -nz]);
  }
  const kvad = (A, B, nA, nB, i, j) => { // pas med obročema A (zgoraj) in B (spodaj)
    tri(A[i], B[i], B[j], nA[i], nB[i], nB[j]);
    tri(A[i], B[j], A[j], nA[i], nB[j], nA[j]);
  };
  if (b > 0) {
    const nTop = vN.map((v) => nrm([v[0] * 0.55 + nx, v[1] * 0.55 + ny, v[2] * 0.55 + nz]));
    const nBot = vN.map((v) => nrm([v[0] * 0.55 - nx, v[1] * 0.55 - ny, v[2] * 0.55 - nz]));
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      kvad(top, topR, nTop, vN, i, j);
      kvad(topR, botR, vN, vN, i, j);
      kvad(botR, bot, vN, nBot, i, j);
    }
  } else {
    for (let i = 0; i < n; i++) { const j = (i + 1) % n; kvad(top, bot, sN.map(() => sN[i]), sN.map(() => sN[i]), i, j); }
  }
  // Ploskve morajo gledati navzven: če je zgornja ploskev narobe zavita, obrni vrstni red.
  const ax = P[3] - P[0], ay = P[4] - P[1], az = P[5] - P[2], bx = P[6] - P[0], by = P[7] - P[1], bz = P[8] - P[2];
  const cx = ay * bz - az * by, cy = az * bx - ax * bz, cz = ax * by - ay * bx;
  if (cx * nx + cy * ny + cz * nz < 0) {
    for (let i = 0; i < P.length; i += 9) for (let k = 0; k < 3; k++) {
      const t = P[i + 3 + k]; P[i + 3 + k] = P[i + 6 + k]; P[i + 6 + k] = t;
      const u = N[i + 3 + k]; N[i + 3 + k] = N[i + 6 + k]; N[i + 6 + k] = u;
    }
  }
  return { P, N };
}

/** Palčka (kvader) med točkama a in b v ravnini z normalo n. */
function palcka(a, b, sirina, h, n, rob = 0) {
  const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], l = Math.hypot(...d);
  const t = d.map((x) => x / l);
  const s = [t[1] * n[2] - t[2] * n[1], t[2] * n[0] - t[0] * n[2], t[0] * n[1] - t[1] * n[0]];
  const w = sirina / 2, pod = 0.25;
  const A = a.map((x, i) => x - t[i] * pod), B = b.map((x, i) => x + t[i] * pod);
  const pt = [
    A.map((x, i) => x + s[i] * w), B.map((x, i) => x + s[i] * w),
    B.map((x, i) => x - s[i] * w), A.map((x, i) => x - s[i] * w),
  ];
  return prizma(pt, h, 1, rob);
}

/** Združena geometrija kosov, ki so pripeti na okvirje nukleotidov; posodobi() jih premakne. */
function spoj(THREE, kosi, material) {
  let st = 0;
  for (const k of kosi) st += k.P.length;
  const pos = new Float32Array(st), nor = new Float32Array(st);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
  const mesh = new THREE.Mesh(g, material);
  function posodobi(nt) {
    let o = 0;
    for (const k of kosi) {
      const e = nt[k.n].F.elements;
      for (let i = 0; i < k.P.length; i += 3, o += 3) {
        const x = k.P[i], y = k.P[i + 1], z = k.P[i + 2];
        pos[o] = e[0] * x + e[4] * y + e[8] * z + e[12];
        pos[o + 1] = e[1] * x + e[5] * y + e[9] * z + e[13];
        pos[o + 2] = e[2] * x + e[6] * y + e[10] * z + e[14];
        const a = k.N[i], b = k.N[i + 1], c = k.N[i + 2];
        nor[o] = e[0] * a + e[4] * b + e[8] * c;
        nor[o + 1] = e[1] * a + e[5] * b + e[9] * c;
        nor[o + 2] = e[2] * a + e[6] * b + e[10] * c;
      }
    }
    g.attributes.position.needsUpdate = true; g.attributes.normal.needsUpdate = true;
    g.computeBoundingSphere(); g.computeBoundingBox();
  }
  return { mesh, posodobi };
}

function tocka(THREE, n, lok) {
  return new THREE.Vector3(...lok).applyMatrix4(n.F);
}

function sredina(THREE, n, imena) {
  const s = new THREE.Vector3();
  let k = 0;
  for (const i of imena) { const p = lokalno(n, i); if (p) { s.add(tocka(THREE, n, p)); k++; } }
  return s.multiplyScalar(1 / Math.max(1, k));
}

// ---------------------------------------------------------------- model
// Velikost točke (PointsMaterial, sizeAttenuation) je v enotah višine zaslona/razdalje; za premer w v sceni pri vidnem kotu ~40° je size ≈ w / tan(20°).
const TOCKA_V_SVET = 2.75;

export function zgradi(THREE, ctx = {}) {
  const visoka = ctx.kakovost !== "nizka";
  const zac = ctx.zacetek || {};
  const stanje = {
    molekula: zac.molekula === "RNK" ? "RNK" : "DNK",
    prikaz: zac.prikaz === "atomski" ? "atomski" : "shematski",
    odpiranje: Number.isFinite(+zac.odpiranje) ? Math.min(1, Math.max(0, +zac.odpiranje)) : 0,
    zlebovi: zac.zlebovi === true || zac.zlebovi === "1",
  };

  const group = new THREE.Group();
  group.name = "dnk";
  const drzalo = new THREE.Group(); // os vijačnice (z) → navpično (y)
  drzalo.rotation.x = -Math.PI / 2;
  group.add(drzalo);
  const vsebina = new THREE.Group();
  drzalo.add(vsebina);

  const fiz = (barva, o = {}) => new THREE.MeshPhysicalMaterial({ color: barva, roughness: 0.34, metalness: 0, clearcoat: 0.5, clearcoatRoughness: 0.3, ...o });
  // sijaj »molekularnega modela«: lak + rahel sheen, da se oblike pod šibko lučjo ločijo od ozadja
  const sijaj = (o = {}) => ({ roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.14, sheen: 0.35, sheenRoughness: 0.45, sheenColor: new THREE.Color("#ffffff"), ...o });
  const krogla = (r, w, h) => new THREE.SphereGeometry(r, w, h);
  function napis(tekst) {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas"); c.width = 128; c.height = 128;
    const x = c.getContext("2d");
    if (!x) return null;
    x.font = "600 76px 'Instrument Sans', system-ui, sans-serif"; x.textAlign = "center"; x.textBaseline = "middle";
    x.lineWidth = 10; x.strokeStyle = "rgba(11,15,22,0.9)"; x.strokeText(tekst, 64, 68);
    x.fillStyle = "#f4f6fa"; x.fillText(tekst, 64, 68);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    // točka (Points) namesto sprite: GTAO točk ne upošteva (sprite bi dal temen kvadrat); velikost se nastavi ob merilu
    const m = new THREE.PointsMaterial({ map: t, size: 4.2, sizeAttenuation: true, depthWrite: false, transparent: true });
    const s = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0], 3)), m);
    s.renderOrder = 3; s.raycast = () => {}; // napis ni tarča tapa
    return s;
  }

  let model = null; // trenutna sestava
  const obj = { group, deli: [], nadzor: [], merilo: info.merilo, dispose };

  function pocisti() {
    if (!model) return;
    vsebina.remove(model.koren);
    const g = new Set(), m = new Set(model.mats);
    model.koren.traverse((o) => {
      if (o.geometry) g.add(o.geometry);
      if (o.material) m.add(o.material);
    });
    for (const x of g) x.dispose();
    for (const x of m) { if (x.map) x.map.dispose(); x.dispose(); }
    model = null;
  }

  function sestavi() {
    pocisti();
    const s = zgradba(THREE, stanje.molekula);
    const dnk = s.molekula === "DNK";
    const koren = new THREE.Group();
    const mats = [];
    const m2 = (b, o) => { const m = fiz(b, o); mats.push(m); return m; };
    const M = { s, koren, mats, dnk };

    // --- shematski prikaz
    const shema = new THREE.Group(); koren.add(shema);
    const fosfatGeo = krogla(1.55, visoka ? 26 : 12, visoka ? 18 : 8);
    const fosfati = new THREE.InstancedMesh(fosfatGeo, m2(BARVE.fosfat, sijaj({ roughness: 0.26, clearcoat: 0.95, clearcoatRoughness: 0.08, emissive: new THREE.Color("#ff6a10"), emissiveIntensity: 0.12, sheenColor: new THREE.Color("#ffd9b0") })), s.nt.length);
    fosfati.name = "fosfati";
    fosfati.userData.nukleotidi = s.nt.map((_, i) => i);
    shema.add(fosfati);

    const sladkorKosi = [], bazaKosi = {};
    s.nt.forEach((n, i) => {
      const obroc = ["C1'", "C2'", "C3'", "C4'", "O4'"].map((a) => lokalno(n, a));
      const p = prizma(obroc, 1.5, 0.98, 0.5);
      sladkorKosi.push({ n: i, ...p });
      const b = BAZE[n.baza], kosi = (bazaKosi[n.baza] ||= []);
      for (const r of OBROCI[n.baza]) kosi.push({ n: i, ...prizma(r.map((a) => b[a]), 1.8, 0.97, 0.6) });
      for (const [a, c] of VEJE[n.baza]) {
        const sr = (OBROCI[n.baza].find((r) => r.includes(a)) || OBROCI[n.baza][0]).map((x) => b[x]);
        const cen = [0, 1, 2].map((k) => sr.reduce((t, q) => t + q[k], 0) / sr.length);
        const A = b[a].map((x, k) => x + (cen[k] - x) * 0.2);
        kosi.push({ n: i, ...palcka(A, b[c], 0.95, 1.3, [0, 0, 1], 0.4) });
      }
    });
    const sladkorji = spoj(THREE, sladkorKosi, m2(BARVE.sladkor, sijaj({ roughness: 0.36, sheen: 0.25 })));
    sladkorji.mesh.name = "sladkorji";
    shema.add(sladkorji.mesh);
    const baze = {};
    for (const b of Object.keys(bazaKosi)) {
      baze[b] = spoj(THREE, bazaKosi[b], m2(BARVE[b], sijaj({ roughness: 0.32, emissive: new THREE.Color(BARVE[b]), emissiveIntensity: 0.06 })));
      baze[b].mesh.name = "baza-" + b;
      shema.add(baze[b].mesh);
    }
    // vodikove vezi: pike med donorjem in akceptorjem
    const vezi = [];
    for (const [i, j, k] of s.pari) {
      const a = s.nt[i].baza, b = s.nt[j].baza;
      const pur = a === "A" || a === "G" ? [i, j] : [j, i];
      const kljuc = s.nt[pur[0]].baza + s.nt[pur[1]].baza;
      for (const [x, y] of VODIKOVE[kljuc]) for (const t of [0.22, 0.5, 0.78]) vezi.push({ i: pur[0], j: pur[1], x, y, t, k });
    }
    const pike = new THREE.InstancedMesh(krogla(0.32, visoka ? 12 : 6, visoka ? 8 : 4), m2(BARVE.vez, { roughness: 0.25, clearcoat: 0.6, emissive: new THREE.Color("#b8ccff"), emissiveIntensity: 0.75 }), vezi.length);
    pike.name = "vodikove-vezi";
    pike.userData.vezi = vezi.map((v) => [v.i, v.j, v.x, v.y]);
    shema.add(pike);

    // hrbtenica: cev skozi P in sladkor
    const cevMat = s.verige.map((_, v) => m2(dnk ? (v === 0 ? BARVE.veriga1 : BARVE.veriga2) : BARVE.rnk, sijaj({ roughness: 0.28, clearcoat: 0.9, clearcoatRoughness: 0.1, sheen: 0.45 })));
    const cevi = s.verige.map((V, v) => {
      return { V, kosi: (dnk ? [0] : [0, 1, 2]).map(() => { const m = new THREE.Mesh(new THREE.BufferGeometry(), cevMat[v]); m.name = "hrbtenica"; shema.add(m); return m; }) };
    });

    // --- atomski prikaz (kalota)
    const atomi = new THREE.Group(); koren.add(atomi);
    const skupine = new Map(); // "fosfat|O" → seznam
    s.nt.forEach((n, i) => {
      const imena = [...Object.keys(BAZE[n.baza]).filter((a) => a !== "C1'"), ...Object.keys(n.at), "C1'"];
      for (const a of imena) {
        const sk = FOSFAT_ATOMI.includes(a) ? "fosfat" : SLADKOR_ATOMI.includes(a) ? "sladkor" : "baza-" + n.baza;
        const kl = sk + "|" + el(a);
        if (!skupine.has(kl)) skupine.set(kl, []);
        skupine.get(kl).push({ n: i, p: lokalno(n, a) });
      }
    });
    let stAtomov = 0;
    for (const v of skupine.values()) stAtomov += v.length;
    const segm = (visoka ? [[16, 12], [14, 10], [12, 9], [10, 8]] : [[10, 7], [8, 6], [7, 5]]).find(([w, h]) => stAtomov * (w * h * 2 - 2 * w) <= (visoka ? 126000 : 50000)) || [7, 5];
    const atomGeo = krogla(1, segm[0], segm[1]);
    const atomMeshes = {};
    const elMat = {};
    for (const [kl, sez] of skupine) {
      const [sk, e] = kl.split("|");
      elMat[e] ||= m2(ELEMENTI[e][0], { roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.18 });
      const im = new THREE.InstancedMesh(atomGeo, elMat[e], sez.length);
      im.name = "atomi-" + kl; im.userData.atomi = sez;
      atomi.add(im);
      (atomMeshes[sk] ||= []).push(im);
    }

    // --- žlebovi
    const o = s.oblika;
    const P1 = tocka(THREE, s.nt[s.verige[0][0]], s.nt[s.verige[0][0]].at.P);
    const zadnji = dnk ? s.verige[1][s.verige[1].length - 1] : s.verige[0][s.verige[0].length - 1];
    const P2 = tocka(THREE, { F: s.nt[zadnji].F0 }, s.nt[zadnji].at.P);
    // zadnji nukleotid verige II je pri k = 0 (spodaj), njegov P je v višini baznega para 0
    const fi1 = Math.atan2(P1.y, P1.x), fi2 = Math.atan2(P2.y, P2.x);
    const kot1 = (z) => fi1 + (o.zasuk * deg) * (z - P1.z) / o.dvig;
    const kot2 = (z) => fi2 + (o.zasuk * deg) * (z - P2.z) / o.dvig;
    const razlika = ((kot1(0) - kot2(0)) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    // mali žleb: krajši lok med verigama
    const lokMali = razlika < Math.PI ? { od: kot2, sir: razlika } : { od: kot1, sir: 2 * Math.PI - razlika };
    const lokVeliki = razlika < Math.PI ? { od: kot1, sir: 2 * Math.PI - razlika } : { od: kot2, sir: razlika };
    const zMin = Math.max(P1.z, P2.z), zMax = Math.min(P1.z, P2.z) + (s.nPar - 1) * o.dvig;
    const vrst = Math.round((zMax - zMin) / o.dvig * (visoka ? 4 : 2)), stolp = visoka ? 22 : 12;
    function trak(lok, barva) {
      const R = 7.9;
      const pos = [], nor = [], idx = [];
      for (let i = 0; i <= vrst; i++) {
        const z = zMin + (zMax - zMin) * i / vrst, w = lok.sir * 0.42, a0 = lok.od(z) + (lok.sir - w) / 2;
        for (let j = 0; j <= stolp; j++) {
          const a = a0 + w * j / stolp;
          pos.push(R * Math.cos(a), R * Math.sin(a), z); nor.push(Math.cos(a), Math.sin(a), 0);
        }
      }
      for (let i = 0; i < vrst; i++) for (let j = 0; j < stolp; j++) {
        const a = i * (stolp + 1) + j, b = a + stolp + 1;
        idx.push(a, b, a + 1, a + 1, b, b + 1);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
      g.setIndex(idx);
      const m = new THREE.Mesh(g, m2(barva, { transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide, roughness: 0.5, clearcoat: 0, emissive: new THREE.Color(barva), emissiveIntensity: 0.25 }));
      m.renderOrder = 2;
      m.userData.vrstice = { vrst, stolp, zMin, zMax };
      koren.add(m);
      return m;
    }
    const velikiZleb = trak(lokVeliki, BARVE.velikiZleb), maliZleb = trak(lokMali, BARVE.maliZleb);
    velikiZleb.name = "veliki-zleb"; maliZleb.name = "mali-zleb";
    M.zleb = { lokVeliki, lokMali, zMin, zMax, R: 7.9 };

    // --- konca verig
    const konci5 = [], konci3 = [];
    const obrocGeo = new THREE.TorusGeometry(1.9, 0.38, visoka ? 14 : 6, visoka ? 40 : 16);
    const stozecGeo = new THREE.ConeGeometry(1.6, 3.2, visoka ? 28 : 10);
    const konecMat = m2(BARVE.konec, sijaj({ roughness: 0.25, emissive: new THREE.Color("#cdd9f2"), emissiveIntensity: 0.22 }));
    for (let v = 0; v < s.verige.length; v++) {
      const a = new THREE.Mesh(obrocGeo, konecMat); a.name = "5-konec"; koren.add(a); konci5.push(a);
      const b = new THREE.Mesh(stozecGeo, konecMat); b.name = "3-konec"; koren.add(b); konci3.push(b);
    }
    const napisi = [];
    for (let v = 0; v < s.verige.length; v++) {
      const a = napis("5′"), b = napis("3′");
      if (a) koren.add(a);
      if (b) koren.add(b);
      napisi.push([a, b]);
    }

    Object.assign(M, { shema, fosfati, sladkorji, baze, pike, vezi, cevi, atomi, atomMeshes, velikiZleb, maliZleb, konci5, konci3, napisi, obrocGeo, stozecGeo });
    model = M;
    vsebina.add(koren);

    // središče in merilo (iz zaprte oblike)
    const box = new THREE.Box3();
    for (const n of s.nt) for (const a of [...Object.keys(BAZE[n.baza]), ...Object.keys(n.at)]) box.expandByPoint(tocka(THREE, n, lokalno(n, a)));
    const c = box.getCenter(new THREE.Vector3());
    let rmax = 0;
    const meri = (rob) => { for (const n of s.nt) for (const a of [...Object.keys(BAZE[n.baza]), ...Object.keys(n.at)]) rmax = Math.max(rmax, tocka(THREE, n, lokalno(n, a)).distanceTo(c) + rob); };
    meri(3); // rob: konca verig (obroček, stožec) segata čez zadnji atom
    // tudi povsem odprta DNA mora ostati v enotski krogli
    if (dnk) { odpri(THREE, s, 1); meri(2); odpri(THREE, s, 0); }
    const D = [3, 3.5, 4, 4.5, 5, 5.5, 6, 7, 8, 9, 9.5, 10].find((d) => d * 5 * 1.02 >= rmax) || 10; // premer enotske krogle v nm
    vsebina.position.copy(c).multiplyScalar(-1);
    drzalo.scale.setScalar(1 / (D * 5));
    for (const [a, b] of napisi) for (const x of [a, b]) if (x) x.material.size = (4.2 / (D * 5)) * TOCKA_V_SVET;
    obj.merilo = { m: D * 1e-9, oznaka: `${String(D).replace(".", ",")} nm` };
    group.userData.dnk = { molekula: s.molekula, nmNaEnoto: D / 2, oblika: { dvig: o.dvig / 10, zasuk: o.zasuk, bpNaZavoj: 360 / o.zasuk }, polmerFosfata: 0.155, struktura: s };
    posodobi();
  }

  function posodobi() {
    const M = model, s = M.s;
    const u = s.molekula === "DNK" ? stanje.odpiranje : 0;
    const kf = s.molekula === "DNK" ? odpri(THREE, s, u) : s.nPar;
    M.kf = kf;
    const atomski = stanje.prikaz === "atomski";
    M.shema.visible = !atomski;
    M.atomi.visible = atomski;

    const mx = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), v = new THREE.Vector3();
    {
      s.nt.forEach((n, i) => {
        v.set(...n.at.P).applyMatrix4(n.F);
        mx.compose(v, q.identity(), sc.set(1, 1, 1));
        M.fosfati.setMatrixAt(i, mx);
      });
      M.fosfati.instanceMatrix.needsUpdate = true; M.fosfati.computeBoundingSphere();
      M.sladkorji.posodobi(s.nt);
      for (const b of Object.values(M.baze)) b.posodobi(s.nt);
      let vidne = 0;
      M.vezi.forEach((x, i) => {
        const a = tocka(THREE, s.nt[x.i], BAZE[s.nt[x.i].baza][x.x]), b = tocka(THREE, s.nt[x.j], BAZE[s.nt[x.j].baza][x.y]);
        const odprt = x.k > kf - 0.35;
        mx.compose(a.lerp(b, x.t), q.identity(), sc.setScalar(odprt ? 0 : 1));
        if (!odprt) vidne++;
        M.pike.setMatrixAt(i, mx);
      });
      M.pike.instanceMatrix.needsUpdate = true; M.pike.computeBoundingSphere();
      M.vidneVezi = vidne;
      // cevi
      M.cevi.forEach(({ V, kosi }) => {
        const pts = [];
        for (const i of V) {
          const n = s.nt[i];
          pts.push(tocka(THREE, n, n.at.P));
          pts.push(tocka(THREE, n, lokalno(n, "C4'")).add(tocka(THREE, n, lokalno(n, "C3'"))).multiplyScalar(0.5));
        }
        const zad = s.nt[V[V.length - 1]];
        pts.push(tocka(THREE, zad, lokalno(zad, "O3'")));
        const krivulja = new THREE.CatmullRomCurve3(pts, false, "centripetal");
        let meje;
        if (kosi.length === 1) meje = [[0, 1]];
        else {
          const nZ = s.zanka.length, a = (2 * s.nPar - 1) / (pts.length - 1), b = (2 * (s.nPar + nZ)) / (pts.length - 1);
          meje = [[0, a], [a, b], [b, 1]];
        }
        kosi.forEach((m, j) => {
          const [a, b] = meje[j];
          const del = new THREE.Curve();
          del.getPoint = (t, o = new THREE.Vector3()) => krivulja.getPoint(a + (b - a) * t, o);
          const segs = Math.max(8, Math.round((b - a) * (pts.length - 1) * (visoka ? 8 : 3)));
          m.geometry.dispose();
          m.geometry = new THREE.TubeGeometry(del, segs, 1.0, visoka ? 16 : 8, false);
        });
      });
    }
    {
      for (const ms of Object.values(M.atomMeshes)) for (const im of ms) {
        im.userData.atomi.forEach((x, i) => {
          v.set(...x.p).applyMatrix4(s.nt[x.n].F);
          // polmer: element je zadnji del imena skupine
          const r = ELEMENTI[im.name.split("|")[1]][1];
          mx.compose(v, q.identity(), sc.setScalar(r));
          im.setMatrixAt(i, mx);
        });
        im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere();
      }
    }
    // konca verig
    s.verige.forEach((V, k) => {
      const prvi = s.nt[V[0]], zadnji = s.nt[V[V.length - 1]];
      const p5 = tocka(THREE, prvi, prvi.at.P), p5b = tocka(THREE, prvi, lokalno(prvi, "C4'"));
      const smer5 = p5b.clone().sub(p5).normalize();
      M.konci5[k].position.copy(p5);
      M.konci5[k].quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), smer5);
      const p3 = tocka(THREE, zadnji, lokalno(zadnji, "O3'")), p3a = tocka(THREE, zadnji, lokalno(zadnji, "C3'"));
      const smer3 = p3.clone().sub(p3a).normalize();
      M.konci3[k].position.copy(p3).addScaledVector(smer3, 1.2);
      M.konci3[k].quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), smer3);
      const [a, b] = M.napisi[k];
      const ven = (p) => new THREE.Vector3(p.x, p.y, 0).normalize();
      if (a) a.position.copy(p5).addScaledVector(ven(p5), 3.2).addScaledVector(smer5, -1.2);
      if (b) b.position.copy(p3).addScaledVector(ven(p3), 3.2).addScaledVector(smer3, 1.6);
    });
    // žlebovi: le zaprti del
    for (const z of [M.velikiZleb, M.maliZleb]) {
      z.visible = stanje.zlebovi;
      const { vrst, stolp, zMin, zMax } = z.userData.vrstice;
      const zVrh = Math.min(zMax, (kf - 0.5) * s.oblika.dvig + 1);
      const vr = Math.max(0, Math.min(vrst, Math.floor((zVrh - zMin) / (zMax - zMin) * vrst)));
      z.geometry.setDrawRange(0, vr * stolp * 6);
    }
    obj.deli = deli();
  }

  // pretvorba točke iz okvirja vijačnice (Å) v koordinate skupine
  function vSkupino(p) {
    drzalo.updateMatrix(); vsebina.updateMatrix();
    return p.clone().applyMatrix4(vsebina.matrix).applyMatrix4(drzalo.matrix);
  }
  const arr = (p) => vSkupino(p).toArray().map((x) => +x.toFixed(3));

  function deli() {
    const M = model, s = M.s, dnk = s.molekula === "DNK", atomski = stanje.prikaz === "atomski";
    const d = [];
    // izberi nukleotid za točko: najbližji ciljni višini, na sprednji strani
    const najdi = (pogoj, ciljK) => {
      let best = -1, bd = 1e9;
      s.nt.forEach((n, i) => { if (pogoj(n)) { const dd = Math.abs(n.k - ciljK) + (n.stran ? 0.3 : 0); if (dd < bd) { bd = dd; best = i; } } });
      return best >= 0 ? s.nt[best] : s.nt[0];
    };
    const h = s.nPar, C = dnk ? CILJI.DNK : CILJI.RNK;
    const fos = najdi((n) => n.stran === 0, h * C.fosfat);
    d.push({ id: "fosfat", ime: "Fosfatna skupina", barva: BARVE.fosfat,
      opis: "Fosfat povezuje sladkorja sosednjih nukleotidov v verigo; je negativno nabit, zato je DNA kisla molekula.",
      meshes: atomski ? M.atomMeshes.fosfat : [M.fosfati], tocka: arr(tocka(THREE, fos, fos.at.P)) });
    const sl = najdi((n) => n.stran === 1, h * C.sladkor);
    d.push(dnk
      ? { id: "sladkor", ime: "Deoksiriboza", barva: BARVE.sladkor, opis: "Sladkor s petimi ogljikovimi atomi, na katerega je vezana baza; ima en kisikov atom manj kot riboza.", meshes: atomski ? M.atomMeshes.sladkor : [M.sladkorji.mesh], tocka: arr(sredina(THREE, sl, ["C1'", "C2'", "C3'", "C4'", "O4'"])) }
      : { id: "sladkor", ime: "Riboza", barva: BARVE.sladkor, opis: "Sladkor RNA; na drugem ogljikovem atomu ima skupino OH, ki je deoksiriboza nima.", meshes: atomski ? M.atomMeshes.sladkor : [M.sladkorji.mesh], tocka: arr(sredina(THREE, sl, ["C1'", "C2'", "C3'", "C4'", "O4'"])) });
    if (!atomski) {
      const hr = najdi((n) => n.stran === C.hrbtenicaStran, h * C.hrbtenica);
      d.push({ id: "hrbtenica", ime: dnk ? "Sladkorno-fosfatna veriga" : "Veriga RNA", barva: dnk ? BARVE.veriga1 : BARVE.rnk,
        opis: dnk ? "Ogrodje verige iz nukleotidov: sladkorji in fosfati se izmenjujejo, na vsak sladkor pa je vezana dušikova baza, ki gleda navznoter k drugi verigi." : "RNA je ena sama veriga, ki se zvije sama vase, kjer se njene baze lahko parijo.",
        meshes: M.cevi.flatMap((c) => c.kosi), tocka: arr(tocka(THREE, hr, lokalno(hr, "C4'"))) });
    }
    const opisi = {
      A: dnk ? "Purinska baza z dvema obročema (rdeča); v DNA se vedno poveže s timinom z dvema vodikovima vezema." : "Purinska baza z dvema obročema (rdeča); v RNA se poveže z uracilom z dvema vodikovima vezema.",
      T: "Pirimidinska baza z enim obročem (rumena); z adeninom jo povezujeta dve vodikovi vezi.",
      U: "Pirimidinska baza z enim obročem (vijolična), ki v RNA nadomesti timin; z adeninom tvori dve vodikovi vezi.",
      G: "Purinska baza z dvema obročema (zelena); s citozinom jo povezujejo tri vodikove vezi.",
      C: "Pirimidinska baza z enim obročem (modra); z gvaninom jo povezujejo tri vodikove vezi.",
    };
    for (const b of dnk ? ["A", "T", "G", "C"] : ["A", "U", "G", "C"]) {
      const n = najdi((x) => x.baza === b && x.stran < 2, h * C[b]);
      const ime = IME_BAZE[b];
      d.push({ id: ime, ime: `${ime[0].toUpperCase()}${ime.slice(1)} (${b})`, barva: BARVE[b], opis: opisi[b],
        meshes: atomski ? M.atomMeshes["baza-" + b] : [M.baze[b].mesh], tocka: arr(sredina(THREE, n, OBROCI[b].flat())) });
    }
    if (!atomski && M.vidneVezi > 0) {
      const par = s.pari.find((p) => p[2] < M.kf - 1 && p[2] >= Math.min(C.vez, Math.floor(M.kf) - 2)) || s.pari[0];
      const a = s.nt[par[0]], b = s.nt[par[1]];
      d.push({ id: "vodikove-vezi", ime: "Vodikove vezi", barva: BARVE.vez,
        opis: "Šibke vezi (pikčaste črte) med komplementarnima bazama: A–" + (dnk ? "T" : "U") + " ima dve, G–C tri, zato je par G–C trdnejši.",
        meshes: [M.pike], tocka: arr(sredina(THREE, a, OBROCI[a.baza].flat()).lerp(sredina(THREE, b, OBROCI[b.baza].flat()), 0.5)) });
    }
    if (stanje.zlebovi) {
      const z = M.zleb, zT = Math.min(z.zMax, (M.kf - 0.5) * s.oblika.dvig);
      const tockaZleba = (lok, zz) => { const a = lok.od(zz) + lok.sir / 2; return new THREE.Vector3(z.R * Math.cos(a), z.R * Math.sin(a), zz); };
      const zV = z.zMin + (zT - z.zMin) * C.velikiZleb, zM = z.zMin + (zT - z.zMin) * C.maliZleb;
      d.push({ id: "veliki-zleb", ime: "Veliki žleb", barva: BARVE.velikiZleb,
        opis: dnk ? "Širša vdolbina med verigama, kjer beljakovine lahko »preberejo« zaporedje baz." : "V obliki A je veliki žleb globok in ozek, zato beljakovine težko sežejo do baz.",
        meshes: [M.velikiZleb], tocka: arr(tockaZleba(z.lokVeliki, zV)) });
      d.push({ id: "mali-zleb", ime: "Mali žleb", barva: BARVE.maliZleb,
        opis: dnk ? "Ožja vdolbina med verigama na strani, kjer sta sladkorja baznega para bližje skupaj." : "V obliki A je mali žleb plitev in širok.",
        meshes: [M.maliZleb], tocka: arr(tockaZleba(z.lokMali, zM)) });
    }
    if (!dnk && !atomski) {
      const n = s.nt[s.zanka[1]];
      d.push({ id: "zanka", ime: "Zanka (UUCG)", barva: BARVE.rnk,
        opis: "Neparjeni nukleotidi, kjer se veriga RNA obrne nazaj in nastane lasnica.",
        meshes: [M.cevi[0].kosi[1]], tocka: arr(tocka(THREE, n, n.at.P)) });
    }
    d.push({ id: "konec-5", ime: "5′-konec", barva: BARVE.konec,
      opis: "Začetek verige: prosta fosfatna skupina na 5. ogljikovem atomu sladkorja (obroček).",
      meshes: M.konci5, tocka: arr(M.konci5[0].position) });
    d.push({ id: "konec-3", ime: "3′-konec", barva: BARVE.konec,
      opis: dnk ? "Konec verige s skupino OH na 3. ogljikovem atomu; puščica kaže smer 5′→3′, verigi tečeta v nasprotnih smereh." : "Konec verige s skupino OH na 3. ogljikovem atomu; puščica kaže smer 5′→3′.",
      meshes: M.konci3, tocka: arr(M.konci3[0].position) });
    return d;
  }

  const nadzor = [
    { tip: "izbira", id: "molekula", oznaka: "Molekula", moznosti: [["DNK", "DNA (dvojna vijačnica)"], ["RNK", "RNA (lasnica)"]], vrednost: stanje.molekula,
      ob: (v) => { stanje.molekula = v === "RNK" ? "RNK" : "DNK"; sestavi(); } },
    { tip: "izbira", id: "prikaz", oznaka: "Prikaz", moznosti: [["shematski", "Shematski"], ["atomski", "Atomi (kalota)"]], vrednost: stanje.prikaz,
      ob: (v) => { stanje.prikaz = v === "atomski" ? "atomski" : "shematski"; posodobi(); } },
    { tip: "drsnik", id: "odpiranje", oznaka: "Odpiranje vijačnice (le DNA)", min: 0, max: 1, korak: 0.01, vrednost: stanje.odpiranje, vidno: () => stanje.molekula === "DNK",
      ob: (v) => { stanje.odpiranje = Math.min(1, Math.max(0, +v || 0)); posodobi(); } },
    { tip: "stikalo", id: "zlebovi", oznaka: "Pokaži žlebova", vrednost: stanje.zlebovi,
      ob: (v) => { stanje.zlebovi = !!v; posodobi(); } },
    { tip: "izpis", id: "podatki", oznaka: "Mere", vrednost: () => {
      const s = model.s, o = s.oblika;
      const bp = +(360 / o.zasuk).toFixed(1);
      const osn = `${nm(o.dvig / 10)} nm na bazni par · ${String(bp).replace(".", ",")} ${Number.isInteger(bp) ? "baznih parov" : "baznega para"} na zavoj`;
      if (s.molekula === "RNK") return `Oblika A · ${osn} · steblo iz 10 baznih parov + zanka UUCG`;
      const odp = Math.max(0, Math.min(s.nPar, Math.round(s.nPar - 0.5 - model.kf)));
      return `Oblika B · ${osn} · premer 2,0 nm` + (odp > 0 ? ` · ${odp === 1 ? "odprt" : odp === 2 ? "odprta" : odp <= 4 ? "odprti" : "odprtih"} ${odp} od ${s.nPar} parov` : "");
    } },
    { tip: "izpis", id: "zaporedje", oznaka: "Zaporedje", vrednost: () => {
      const s = model.s;
      const z = s.verige.map((V) => V.map((i) => s.nt[i].baza).join(""));
      return s.molekula === "DNK" ? `5′-${z[0]}-3′ / 3′-${[...z[1]].reverse().join("")}-5′` : `5′-${z[0]}-3′`;
    } },
  ];
  obj.nadzor = nadzor;

  function dispose() {
    pocisti();
  }

  sestavi();
  return obj;
}
