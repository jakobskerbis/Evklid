// Skupni podatki in risanje za kemijske simulacije: periodni sistem, formule, molekule.
import { s, label, fmt } from "./kit.js";

const SYM = "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og".split(" ");
const IME = "vodik helij litij berilij bor ogljik dušik kisik fluor neon natrij magnezij aluminij silicij fosfor žveplo klor argon kalij kalcij skandij titan vanadij krom mangan železo kobalt nikelj baker cink galij germanij arzen selen brom kripton rubidij stroncij itrij cirkonij niobij molibden tehnecij rutenij rodij paladij srebro kadmij indij kositer antimon telur jod ksenon cezij barij lantan cerij prazeodim neodim prometij samarij evropij gadolinij terbij disprozij holmij erbij tulij iterbij lutecij hafnij tantal volfram renij osmij iridij platina zlato živo_srebro talij svinec bizmut polonij astat radon francij radij aktinij torij protaktinij uran neptunij plutonij americij kirij berkelij kalifornij einsteinij fermij mendelevij nobelij lavrencij rutherfordij dubnij seaborgij bohrij hassij meitnerij darmstadtij rentgenij kopernicij nihonij flerovij moskovij livermorij tenes oganeson".split(" ").map((x) => x.replace("_", " "));
const MASA = [1.008, 4.003, 6.94, 9.012, 10.81, 12.01, 14.01, 16.0, 19.0, 20.18, 22.99, 24.31, 26.98, 28.09, 30.97, 32.06, 35.45, 39.95, 39.1, 40.08, 44.96, 47.87, 50.94, 52.0, 54.94, 55.85, 58.93, 58.69, 63.55, 65.38, 69.72, 72.63, 74.92, 78.97, 79.9, 83.8, 85.47, 87.62, 88.91, 91.22, 92.91, 95.95, 98, 101.07, 102.91, 106.42, 107.87, 112.41, 114.82, 118.71, 121.76, 127.6, 126.9, 131.29, 132.91, 137.33, 138.91, 140.12, 140.91, 144.24, 145, 150.36, 151.96, 157.25, 158.93, 162.5, 164.93, 167.26, 168.93, 173.05, 174.97, 178.49, 180.95, 183.84, 186.21, 190.23, 192.22, 195.08, 196.97, 200.59, 204.38, 207.2, 208.98, 209, 210, 222, 223, 226, 227, 232.04, 231.04, 238.03, 237, 244, 243, 247, 247, 251, 252, 257, 258, 259, 266, 267, 268, 269, 270, 269, 278, 281, 282, 285, 286, 289, 290, 293, 294, 294];
// Elektronegativnost (Pauling); 0 = ni podatka
const EN = [2.2, 0, 0.98, 1.57, 2.04, 2.55, 3.04, 3.44, 3.98, 0, 0.93, 1.31, 1.61, 1.9, 2.19, 2.58, 3.16, 0, 0.82, 1.0, 1.36, 1.54, 1.63, 1.66, 1.55, 1.83, 1.88, 1.91, 1.9, 1.65, 1.81, 2.01, 2.18, 2.55, 2.96, 3.0, 0.82, 0.95, 1.22, 1.33, 1.6, 2.16, 1.9, 2.2, 2.28, 2.2, 1.93, 1.69, 1.78, 1.96, 2.05, 2.1, 2.66, 2.6, 0.79, 0.89, 1.1, 1.12, 1.13, 1.14, 1.13, 1.17, 1.2, 1.2, 1.1, 1.22, 1.23, 1.24, 1.25, 1.1, 1.27, 1.3, 1.5, 2.36, 1.9, 2.2, 2.2, 2.28, 2.54, 2.0, 1.62, 1.87, 2.02, 2.0, 2.2, 2.2, 0.7, 0.9, 1.1, 1.3, 1.5, 1.38, 1.36, 1.28, 1.13, 1.28, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3];
// Kovalentni polmer v pm
const R = [31, 28, 128, 96, 84, 76, 71, 66, 57, 58, 166, 141, 121, 111, 107, 105, 102, 106, 203, 176, 170, 160, 153, 139, 139, 132, 126, 124, 132, 122, 122, 120, 119, 120, 120, 116, 220, 195, 190, 175, 164, 154, 147, 146, 142, 139, 145, 144, 142, 139, 139, 138, 139, 140, 244, 215, 207, 204, 203, 201, 199, 198, 198, 196, 194, 192, 192, 189, 190, 187, 187, 175, 170, 162, 151, 144, 141, 136, 136, 132, 145, 146, 148, 140, 150, 150, 260, 221, 215, 206, 200, 196, 190, 187, 180, 169];
// Prva ionizacijska energija v kJ/mol
const IE = [1312, 2372, 520, 900, 801, 1086, 1402, 1314, 1681, 2081, 496, 738, 578, 787, 1012, 1000, 1251, 1521, 419, 590, 633, 659, 651, 653, 717, 763, 760, 737, 746, 906, 579, 762, 947, 941, 1140, 1351, 403, 550, 600, 640, 652, 684, 702, 710, 720, 804, 731, 868, 558, 709, 834, 869, 1008, 1170, 376, 503, 538, 534, 527, 533, 540, 545, 547, 593, 566, 573, 581, 589, 597, 603, 524, 659, 761, 770, 760, 840, 880, 870, 890, 1007, 589, 716, 703, 812, 899, 1037, 393, 509, 499, 587, 568, 598, 605, 585, 578, 581, 601, 608, 619, 627, 635, 642, 470];

const POLKOVINE = new Set(["B", "Si", "Ge", "As", "Sb", "Te", "At"]);
const NEKOVINE = new Set(["H", "C", "N", "O", "P", "S", "Se", "F", "Cl", "Br", "I", "He", "Ne", "Ar", "Kr", "Xe", "Rn"]);

function position(z) {
  if (z === 1) return [1, 1];
  if (z === 2) return [18, 1];
  const starts = [[3, 2], [11, 3], [19, 4], [37, 5], [55, 6], [87, 7]];
  if (z >= 58 && z <= 71) return [z - 58 + 4, 9];
  if (z >= 90 && z <= 103) return [z - 90 + 4, 10];
  let [z0, p] = starts.filter(([a]) => a <= z).pop();
  let i = z - z0; // indeks v periodi
  if (p <= 3) return [i < 2 ? i + 1 : i + 11, p];
  if (p >= 6 && i >= 3) i -= 14; // lantanoidi/aktinoidi so spodaj
  if (p >= 6 && z === z0 + 2) return [3, p]; // La, Ac
  return [i + 1, p];
}

function kind(sym, z, g) {
  if (z >= 57 && z <= 71) return "lantanoid";
  if (z >= 89 && z <= 103) return "aktinoid";
  if (z >= 109) return "neznano";
  if (g === 18) return "zlahtni";
  if (sym === "H") return "nekovina";
  if (g === 1) return "alkalijska";
  if (g === 2) return "zemeljskoalkalijska";
  if (g === 17 && sym !== "At") return "halogen";
  if (NEKOVINE.has(sym)) return "nekovina";
  if (POLKOVINE.has(sym)) return "polkovina";
  if (g >= 3 && g <= 12) return "prehodna";
  return "ostala";
}

export const ELEMENTS = SYM.map((sym, i) => {
  const z = i + 1, [g, p] = position(z);
  const k = kind(sym, z, g);
  const vrsta = k === "polkovina" ? "polkovina" : ["nekovina", "halogen", "zlahtni"].includes(k) ? "nekovina" : k === "neznano" ? "neznano" : "kovina";
  return { z, sym, ime: IME[i], M: MASA[i], en: EN[i] || null, r: R[i] || null, ie: IE[i] || null, g, p, kind: k, vrsta };
});
export const BY_SYM = Object.fromEntries(ELEMENTS.map((e) => [e.sym, e]));
// Skupina, ki jo kaže tabela (lantanoidi in aktinoidi nimajo stolpca).
export const groupOf = (e) => (e.p >= 9 ? null : e.g);
export const periodOf = (e) => (e.p === 9 ? 6 : e.p === 10 ? 7 : e.p);

// Elektronska konfiguracija po podlupinah (Madelungovo pravilo z nekaj izjemami).
const ORDER = ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p", "6s", "4f", "5d", "6p", "7s", "5f", "6d", "7p"];
const CAP = { s: 2, p: 6, d: 10, f: 14 };
const EXC = { 24: { "4s": 1, "3d": 5 }, 29: { "4s": 1, "3d": 10 }, 42: { "5s": 1, "4d": 5 }, 46: { "5s": 0, "4d": 10 }, 47: { "5s": 1, "4d": 10 }, 78: { "6s": 1, "5d": 9 }, 79: { "6s": 1, "5d": 10 } };
export function config(z) {
  const c = {};
  let left = z;
  for (const o of ORDER) {
    if (left <= 0) break;
    const n = Math.min(CAP[o[1]], left);
    c[o] = n;
    left -= n;
  }
  Object.assign(c, EXC[z] || {});
  return c;
}
const SUP = (n) => String(n).split("").map((d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]).join("");
export function configText(z, short = true) {
  const c = config(z);
  const noble = [86, 54, 36, 18, 10, 2].find((n) => n < z);
  let base = {}, pre = "";
  if (short && noble && z > 2) {
    base = config(noble);
    pre = `[${SYM[noble - 1]}] `;
  }
  const keys = Object.keys(c).filter((k) => c[k] && c[k] !== base[k]);
  keys.sort((a, b) => a[0] - b[0] || "spdf".indexOf(a[1]) - "spdf".indexOf(b[1]));
  return pre + keys.map((k) => k + SUP(c[k])).join(" ");
}
// Število elektronov po lupinah (K, L, M, N, …).
export function shells(z) {
  const c = config(z), out = [];
  for (const [k, n] of Object.entries(c)) out[k[0] - 1] = (out[k[0] - 1] || 0) + n;
  return Array.from(out, (x) => x || 0);
}
// Lupine za OŠ (pravilo 2, 8, 8, 2 do kalcija).
export function shellsOS(z) {
  const caps = [2, 8, 8, 2], out = [];
  for (const c of caps) {
    if (z <= 0) break;
    out.push(Math.min(c, z));
    z -= c;
  }
  return out;
}

// Razčleni formulo, npr. "Ca(OH)2" → { Ca: 1, O: 2, H: 2 }. Podpira tudi indekse ₀–₉.
export function parseFormula(f) {
  f = f.replace(/[₀-₉]/g, (c) => "0123456789"["₀₁₂₃₄₅₆₇₈₉".indexOf(c)]).replace(/[⁺⁻⁰¹²³⁴⁵⁶⁷⁸⁹+\-]/g, "");
  let i = 0;
  const num = () => {
    let n = "";
    while (i < f.length && /\d/.test(f[i])) n += f[i++];
    return n ? +n : 1;
  };
  const group = () => {
    const out = {};
    while (i < f.length && f[i] !== ")") {
      let part;
      if (f[i] === "(") {
        i++;
        part = group();
        i++;
      } else {
        let sym = f[i++];
        while (i < f.length && /[a-z]/.test(f[i])) sym += f[i++];
        part = { [sym]: 1 };
      }
      const n = num();
      for (const [k, v] of Object.entries(part)) out[k] = (out[k] || 0) + v * n;
    }
    return out;
  };
  return group();
}
export const molarMass = (f) => Object.entries(parseFormula(f)).reduce((a, [k, n]) => a + (BY_SYM[k]?.M || 0) * n, 0);
// Indeksi v formuli: "H2SO4" → "H₂SO₄", naboj "SO4^2-" → "SO₄²⁻".
export function sub(f) {
  const [body, charge] = f.split("^");
  const b = body.replace(/\d/g, (d) => "₀₁₂₃₄₅₆₇₈₉"[d]);
  return charge ? b + charge.replace(/\d/g, (d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]).replace("+", "⁺").replace("-", "⁻") : b;
}
// Formula za KaTeX: "H2SO4" → "\mathrm{H_2SO_4}".
export const texF = (f) => {
  const [body, charge] = f.split("^");
  return `\\mathrm{${body.replace(/(\d+)/g, "_{$1}")}${charge ? `^{${charge}}` : ""}}`;
};
export const NA = 6.022e23;
export const sci = (x, d = 2) => {
  if (x === 0) return "0";
  const e = Math.floor(Math.log10(Math.abs(x)));
  return `${fmt(x / 10 ** e, d)}·10${e < 0 ? "⁻" : ""}${SUP(Math.abs(e))}`;
};
export const sciTex = (x, d = 2) => {
  if (x === 0) return "0";
  const e = Math.floor(Math.log10(Math.abs(x)));
  return `${fmt(x / 10 ** e, d)}\\cdot 10^{${e}}`;
};

// Barve atomov (CPK, prilagojene za svetlo in temno temo).
export const ATOM_COL = { H: "#e7ecf3", C: "#4b5563", N: "#3b6fe0", O: "#e5484d", F: "#7fd17f", Cl: "#3fae49", Br: "#a5432a", I: "#7b3fa0", S: "#e2b93b", P: "#e8833a", Na: "#8b5cf6", K: "#a855f7", Mg: "#2f9e8f", Ca: "#14b8a6", Al: "#94a3b8", Fe: "#c2410c", Cu: "#b45309", Zn: "#64748b", Ag: "#cbd5e1", Li: "#c084fc" };
export const atomText = (sym) => (["H", "Ag", "F", "S"].includes(sym) ? "#14213d" : "#fff");

// Nariše kroglico atoma.
export function atomBall(svg, x, y, sym, r = 13, extra = {}) {
  const g = s("g", extra, svg);
  s("circle", { cx: x, cy: y, r, style: `fill:${ATOM_COL[sym] || "#9aa5b8"}`, class: "atom-ball" }, g);
  if (r >= 9) s("text", { x, y: y + 0.5, class: "atom-txt", "text-anchor": "middle", "dominant-baseline": "middle", style: `fill:${atomText(sym)};font-size:${Math.max(9, r * 0.85)}px` }, g, sym);
  return g;
}

// Nariše strukturno formulo: nodes [{x, y, t, cls}], bonds [[i, j, red]].
export function drawMolecule(svg, nodes, bonds, { ox = 0, oy = 0, sc = 1, hl = [], cls = "" } = {}) {
  const g = s("g", { class: "mol " + cls }, svg);
  const P = (n) => [ox + n.x * sc, oy + n.y * sc];
  const gap = (n) => (n.t.length > 2 ? 15 : n.t.length > 1 ? 11 : 8);
  bonds.forEach(([i, j, o = 1, bcls = ""]) => {
    const [x1, y1] = P(nodes[i]), [x2, y2] = P(nodes[j]);
    const L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    const a = Math.min(gap(nodes[i]) * (Math.abs(ux) > 0.5 ? 1 : 0.75), L / 2 - 2), b = Math.min(gap(nodes[j]) * (Math.abs(ux) > 0.5 ? 1 : 0.75), L / 2 - 2);
    const px = -uy * 3.2, py = ux * 3.2;
    const offs = o === 1 ? [0] : o === 2 ? [-1, 1] : [-2, 0, 2];
    offs.forEach((k) =>
      s("line", { x1: x1 + ux * a + px * k * 0.6, y1: y1 + uy * a + py * k * 0.6, x2: x2 - ux * b + px * k * 0.6, y2: y2 - uy * b + py * k * 0.6, class: "bond " + bcls }, g)
    );
  });
  nodes.forEach((n, i) => {
    const [x, y] = P(n);
    if (hl.includes(i)) s("circle", { cx: x, cy: y, r: gap(n) + 4, class: "mol-hl" }, g);
    if (n.t) label(g, x, y, n.t, "lbl atom-lbl " + (n.cls || ""), "middle");
  });
  return g;
}

// Čaša s tekočino. Vrne { inner: {x, y, w, h}, liquid, top }.
export function beaker(svg, x, y, w, hgt, level, color, { opacity = 1 } = {}) {
  const top = y + hgt - level;
  const liquid = s("rect", { x: x + 2, y: top, width: w - 4, height: level - 2, rx: 3, style: `fill:${color};opacity:${opacity}`, class: "liquid" }, svg);
  s("path", { d: `M${x - 4} ${y} L${x} ${y + 4} L${x} ${y + hgt - 6} Q${x} ${y + hgt} ${x + 6} ${y + hgt} L${x + w - 6} ${y + hgt} Q${x + w} ${y + hgt} ${x + w} ${y + hgt - 6} L${x + w} ${y + 4} L${x + w + 4} ${y}`, class: "beaker" }, svg);
  return { liquid, top };
}

// Barvna lestvica (od modre do oranžne) za toplotne zemljevide.
export function heat(t) {
  t = Math.max(0, Math.min(1, t));
  const a = [59, 111, 224], b = [240, 240, 240], c = [232, 131, 58];
  const m = t < 0.5 ? a.map((v, i) => v + (b[i] - v) * t * 2) : b.map((v, i) => v + (c[i] - v) * (t - 0.5) * 2);
  return `rgb(${m.map(Math.round).join(",")})`;
}
