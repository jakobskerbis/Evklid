// Kemijska računala: urejanje enačb reakcij, stehiometrija, pH, koncentracije, redčenje,
// tabela topnosti. Brez DOM (preizkusi v test/tools.test.js).
import { molarMass } from "./toolscore.js";

// ---------- zapis zvrsti (molekula ali ion) ----------

const SUP = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁺": "+", "⁻": "-" };

/**
 * Razčleni zvrst: »H2SO4«, »Fe^3+«, »Fe3+«, »SO4^2-«, »NH4+«, »e-«, »CuSO4·5H2O«, »H2O(l)«.
 * Naboj brez »^« je enoatomnim ionom števka pred znakom (Fe3+), večatomnim pa samo + ali − (NH4+).
 * Vrne { formula, charge, counts: Map, M } ali { error, sym? }.
 */
export function parseSpecies(text, masses) {
  let s = String(text ?? "").trim().replace(/[−–]/g, "-");
  s = s.replace(/\((aq|s|l|g)\)$/i, "").trim();
  // nadpisani naboj
  const sup = /[⁰¹²³⁴⁵⁶⁷⁸⁹]*[⁺⁻]$/.exec(s);
  let charge = 0;
  if (sup) {
    const t = [...sup[0]].map((c) => SUP[c]).join("");
    charge = (t.endsWith("-") ? -1 : 1) * (Number(t.slice(0, -1)) || 1);
    s = s.slice(0, -sup[0].length);
  } else {
    const hat = /\^\{?(\d*)([+-])\}?$|\^\{?([+-])(\d*)\}?$/.exec(s);
    if (hat) {
      const n = Number(hat[1] || hat[4]) || 1;
      charge = (hat[2] || hat[3]) === "-" ? -n : n;
      s = s.slice(0, hat.index);
    } else {
      const tail = /(\d*)([+-])$/.exec(s);
      if (tail) {
        const body = s.slice(0, tail.index);
        // enoatomni ion: Fe3+, S2-, Al3+
        if (/^[A-Z][a-z]?$/.test(body) && tail[1]) {
          charge = (tail[2] === "-" ? -1 : 1) * Number(tail[1]);
          s = body;
        } else {
          charge = tail[2] === "-" ? -1 : 1;
          s = s.slice(0, -1);
        }
      }
    }
  }
  s = s.replace(/^\d+(?=[A-Z([])/, ""); // koeficient, ki ga je kdo vpisal
  if (s === "e") return { formula: "e", charge: -1, counts: new Map(), M: 0, electron: true };
  if (!s) return { error: "syntax" };
  const r = molarMass(s, masses);
  if (!r) return { error: "syntax" };
  if (r.error) return r;
  return { formula: s, charge, counts: r.counts, M: r.M };
}

/** TeX zapis zvrsti: H_2SO_4, Fe^{3+}, CuSO_4·5H_2O. */
export function speciesTex(sp) {
  if (sp.electron) return "e^-";
  const body = sp.formula
    .replace(/(\d+)/g, (m, d, i, s) => (i === 0 || /[·*•.]/.test(s[i - 1]) ? m : `_{${m}}`))
    .replace(/[·*•.]/g, "\\cdot ");
  const q = sp.charge ? `^{${Math.abs(sp.charge) > 1 ? Math.abs(sp.charge) : ""}${sp.charge > 0 ? "+" : "-"}}` : "";
  return `\\mathrm{${body}}${q}`;
}

// ---------- ulomki z BigInt ----------

const babs = (a) => (a < 0n ? -a : a);
const bgcd = (a, b) => {
  a = babs(a);
  b = babs(b);
  while (b) [a, b] = [b, a % b];
  return a;
};
const frac = (n, d = 1n) => {
  if (d < 0n) [n, d] = [-n, -d];
  const g = bgcd(n, d) || 1n;
  return [n / g, d / g];
};
const fsub = (a, b) => frac(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const fmul = (a, b) => frac(a[0] * b[0], a[1] * b[1]);
const fdiv = (a, b) => frac(a[0] * b[1], a[1] * b[0]);

/**
 * Uredi enačbo reakcije. Vhod: »Fe + O2 -> Fe2O3«, »MnO4^- + Fe^2+ + H^+ = Mn^2+ + Fe^3+ + H2O«.
 * Vrne { left: [sp], right: [sp], coef: [n…] } ali { error: "arrow"|"syntax"|"element"|"none"|"many"|"same", … }.
 */
export function balance(text, masses) {
  const s = String(text ?? "").replace(/[−–]/g, "-").replace(/⇌|<=>|<->|⟶|→|->|=>|=/, "\u0001");
  const sides = s.split("\u0001");
  if (sides.length !== 2 || !sides[0].trim() || !sides[1].trim()) return { error: "arrow" };
  const split = (side) =>
    side
      // »+« loči zvrsti, kadar mu (po presledkih) sledi začetek nove zvrsti; sicer je naboj
      .split(/\+(?=\s*(?:\d*\s*)?[A-Z([e])/)
      .map((x) => x.trim())
      .filter(Boolean);
  const L = split(sides[0]).map((x) => parseSpecies(x, masses));
  const R = split(sides[1]).map((x) => parseSpecies(x, masses));
  const bad = [...L, ...R].find((x) => x.error);
  if (bad) return bad;
  const all = [...L, ...R];
  const els = [...new Set(all.flatMap((sp) => [...sp.counts.keys()]))];
  const rows = els.map((e) => all.map((sp, j) => BigInt((sp.counts.get(e) || 0) * (j < L.length ? 1 : -1))));
  if (all.some((sp) => sp.charge)) rows.push(all.map((sp, j) => BigInt(sp.charge * (j < L.length ? 1 : -1))));
  // ničelni prostor z eksaktno Gaussovo eliminacijo
  const n = all.length;
  const A = rows.map((r) => r.map((v) => frac(v)));
  const piv = [];
  let r = 0;
  for (let c = 0; c < n && r < A.length; c++) {
    const p = A.findIndex((row, i) => i >= r && row[c][0] !== 0n);
    if (p < 0) continue;
    [A[r], A[p]] = [A[p], A[r]];
    const pv = A[r][c];
    A[r] = A[r].map((v) => fdiv(v, pv));
    for (let i = 0; i < A.length; i++) {
      if (i === r || A[i][c][0] === 0n) continue;
      const f = A[i][c];
      A[i] = A[i].map((v, j) => fsub(v, fmul(f, A[r][j])));
    }
    piv.push(c);
    r++;
  }
  const free = [...Array(n).keys()].filter((c) => !piv.includes(c));
  if (free.length === 0) return { error: "none", left: L, right: R };
  if (free.length > 1) return { error: "many", left: L, right: R };
  const f = free[0];
  const x = Array(n).fill(null);
  x[f] = [1n, 1n];
  piv.forEach((c, i) => (x[c] = frac(-A[i][f][0], A[i][f][1])));
  const lcm = x.reduce((m, v) => (m * v[1]) / bgcd(m, v[1]), 1n);
  let ints = x.map((v) => (v[0] * lcm) / v[1]);
  const g = ints.reduce((a, b) => bgcd(a, b), 0n) || 1n;
  ints = ints.map((v) => v / g);
  if (ints.every((v) => v <= 0n)) ints = ints.map((v) => -v);
  if (ints.some((v) => v <= 0n)) return { error: "none", left: L, right: R };
  return { left: L, right: R, coef: ints.map(Number) };
}

/**
 * Stehiometrija urejene reakcije. known: { [indeks]: n v mol } (lahko več reaktantov).
 * Vrne { xi, limiting, n: [...] } – n so množine po reakciji (porabljene ali nastale).
 */
export function stoich(coef, nLeft, known) {
  const entries = Object.entries(known).filter(([, v]) => Number.isFinite(v) && v > 0).map(([i, v]) => [Number(i), v]);
  if (!entries.length) return null;
  const reac = entries.filter(([i]) => i < nLeft);
  let xi;
  let limiting = null;
  if (reac.length) {
    for (const [i, v] of reac) {
      const x = v / coef[i];
      if (xi === undefined || x < xi) {
        xi = x;
        limiting = i;
      }
    }
    if (reac.length < 2) limiting = null;
  } else xi = entries[0][1] / coef[entries[0][0]];
  return { xi, limiting, n: coef.map((c) => c * xi) };
}

// ---------- pH ----------

export const KW = 1e-14;

/** Iz enega znanega podatka (pH, pOH, h = [H3O+], oh = [OH−]) izračuna vse štiri (25 °C). */
export function phAll(kind, v) {
  if (!Number.isFinite(v)) return null;
  let ph;
  if (kind === "ph") ph = v;
  else if (kind === "poh") ph = 14 - v;
  else if (kind === "h") ph = v > 0 ? -Math.log10(v) : NaN;
  else if (kind === "oh") ph = v > 0 ? 14 + Math.log10(v) : NaN;
  if (!Number.isFinite(ph)) return null;
  return { ph, poh: 14 - ph, h: 10 ** -ph, oh: 10 ** (ph - 14) };
}

/**
 * pH raztopine kisline ali baze s koncentracijo c (mol/L).
 * type: "sa" močna kislina, "sb" močna baza (z = število H⁺ oz. OH⁻), "wa"/"wb" šibka (K = Ka oz. Kb).
 */
export function phOf(type, c, { z = 1, K } = {}) {
  if (!(c > 0)) return null;
  let h;
  if (type === "sa" || type === "sb") {
    const cc = c * z;
    // vključuje avtoprotolizo vode, da je tudi zelo razredčena raztopina pravilna
    const x = cc / 2 + Math.sqrt((cc * cc) / 4 + KW);
    h = type === "sa" ? x : KW / x;
  } else {
    if (!(K > 0)) return null;
    const x = (-K + Math.sqrt(K * K + 4 * K * c)) / 2;
    h = type === "wa" ? x : KW / x;
    return { ...phAll("h", h), alpha: x / c };
  }
  return phAll("h", h);
}

// ---------- koncentracije ----------

/**
 * Dopolni zveze n = m/M, c = n/V, γ = m/V (V v L). Vhod: objekt z znanimi vrednostmi (number ali undefined).
 * Vrne objekt z vsemi, ki jih je mogoče izračunati, in »from« = množica vpisanih.
 */
export function solveConc(known) {
  const v = { ...known };
  const has = (k) => Number.isFinite(v[k]);
  for (let pass = 0; pass < 4; pass++) {
    if (!has("n") && has("m") && has("M") && v.M) v.n = v.m / v.M;
    if (!has("m") && has("n") && has("M")) v.m = v.n * v.M;
    if (!has("M") && has("m") && has("n") && v.n) v.M = v.m / v.n;
    if (!has("c") && has("n") && has("V") && v.V) v.c = v.n / v.V;
    if (!has("n") && has("c") && has("V")) v.n = v.c * v.V;
    if (!has("V") && has("n") && has("c") && v.c) v.V = v.n / v.c;
    if (!has("g") && has("m") && has("V") && v.V) v.g = v.m / v.V;
    if (!has("m") && has("g") && has("V")) v.m = v.g * v.V;
    if (!has("V") && has("m") && has("g") && v.g) v.V = v.m / v.g;
    if (!has("c") && has("g") && has("M") && v.M) v.c = v.g / v.M;
    if (!has("g") && has("c") && has("M")) v.g = v.c * v.M;
  }
  return v;
}

/** c1·V1 = c2·V2: manjkajočo (undefined) izračuna iz ostalih treh. */
export function dilution({ c1, V1, c2, V2 }) {
  const k = [c1, V1, c2, V2].filter(Number.isFinite).length;
  if (k !== 3) return null;
  if (!Number.isFinite(c1)) return { c1: (c2 * V2) / V1, V1, c2, V2 };
  if (!Number.isFinite(V1)) return { c1, V1: (c2 * V2) / c1, c2, V2 };
  if (!Number.isFinite(c2)) return { c1, V1, c2: (c1 * V1) / V2, V2 };
  return { c1, V1, c2, V2: (c1 * V1) / c2 };
}

/** Masni delež: w = mt / mr, mr = mt + mv (mv = masa topila). Vpisani sta dve količini. */
export function massFraction({ mt, mv, mr, w }) {
  const v = { mt, mv, mr, w };
  const has = (k) => Number.isFinite(v[k]);
  for (let pass = 0; pass < 3; pass++) {
    if (!has("mr") && has("mt") && has("mv")) v.mr = v.mt + v.mv;
    if (!has("mv") && has("mr") && has("mt")) v.mv = v.mr - v.mt;
    if (!has("mt") && has("mr") && has("mv")) v.mt = v.mr - v.mv;
    if (!has("w") && has("mt") && has("mr") && v.mr) v.w = v.mt / v.mr;
    if (!has("mt") && has("w") && has("mr")) v.mt = v.w * v.mr;
    if (!has("mr") && has("w") && has("mt") && v.w) v.mr = v.mt / v.w;
    if (!has("mr") && has("w") && has("mv") && v.w < 1) v.mr = v.mv / (1 - v.w);
  }
  return v;
}

// ---------- tabela topnosti ----------

// Kategorije pri sobni temperaturi: T topna, M slabo topna, N netopna, – ne obstaja ali v vodi razpade.
// Preverjeno s podatki o topnosti (Wikipedia: Solubility table, g/100 mL vode pri ~20 °C) in s šolskimi tabelami.
export const SOL_CATIONS = [
  ["Na", 1], ["K", 1], ["NH4", 1], ["Mg", 2], ["Ca", 2], ["Ba", 2], ["Al", 3], ["Mn", 2],
  ["Fe", 2], ["Fe", 3], ["Cu", 2], ["Zn", 2], ["Ag", 1], ["Pb", 2],
];
export const SOL_ANIONS = [["OH", 1], ["Cl", 1], ["Br", 1], ["I", 1], ["S", 2], ["SO4", 2], ["NO3", 1], ["CO3", 2], ["PO4", 3]];
const SOL = [
  "TTTTTTTTT", // Na
  "TTTTTTTTT", // K
  "TTTTTTTTT", // NH4
  "NTTT-TTMN", // Mg
  "MTTT-MTNN", // Ca
  "TTTTTNTNN", // Ba
  "NTTT-TT-N", // Al
  "NTTTNTTNN", // Mn
  "NTTTNTTNN", // Fe2+
  "NTT--TT-N", // Fe3+
  "NTT-NTTNN", // Cu
  "NTTTNTTNN", // Zn
  "-NNNNMTNN", // Ag
  "NMMMNNTNN", // Pb
];
export const solubility = (i, j) => SOL[i][j];

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
/** Formula soli iz kationa in aniona: Fe³⁺ + SO₄²⁻ → Fe2(SO4)3. */
export function saltFormula([c, cz], [a, az]) {
  const g = gcd(cz, az);
  const nc = az / g;
  const na = cz / g;
  const poly = (s) => (s.match(/[A-Z]/g) || []).length > 1 || /\d/.test(s);
  const part = (s, k) => (k > 1 ? (poly(s) ? `(${s})${k}` : `${s}${k}`) : s);
  return part(c, nc) + part(a, na);
}
