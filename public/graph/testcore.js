// Preizkusi domnev, intervali zaupanja, finance (TVM) in tabela vrednosti. Brez DOM (preizkusi v test/tools.test.js).
// Imena in izidi kot na TI-84 (Z-Test, T-Test, 2-SampTTest, 1-PropZTest, χ²-Test, LinRegTTest, TVM Solver).
import { normal, studentT, chi2 } from "./probcore.js";
import { stats } from "./toolscore.js";
import { fn as parseFn } from "./anacore.js";

const Z = normal(0, 1);
const T = (df) => studentT(df);
const sq = (v) => v * v;
const fin = (...v) => v.every(Number.isFinite);

/** p-vrednost: alt = "ne" (≠), "lt" (<), "gt" (>). */
function pOf(stat, dist, alt) {
  if (alt === "lt") return dist.cdf(stat);
  if (alt === "gt") return dist.cdf(-stat); // simetrična porazdelitev: P(T > t)
  return Math.min(1, 2 * dist.cdf(-Math.abs(stat)));
}
const res = (o) => ({ ...o, reject: o.p < o.alpha });

/** Povzetek vzorca iz seznama: { mean, s, n } ali null. */
export function sample(values) {
  const s = stats(values);
  return s && s.n > 1 ? { mean: s.mean, s: s.sdS, n: s.n } : null;
}

// ---------- preizkusi ----------

/** Z-test za povprečje (σ znan). in: { mean, mu0, sigma, n } */
export function zTest1({ mean, mu0, sigma, n }, alt = "ne", alpha = 0.05) {
  if (!fin(mean, mu0, sigma, n) || sigma <= 0 || n < 1) return null;
  const z = (mean - mu0) / (sigma / Math.sqrt(n));
  return res({ kind: "z", stat: z, p: pOf(z, Z, alt), alt, alpha, est: mean });
}

/** T-test za povprečje. in: { mean, mu0, s, n } */
export function tTest1({ mean, mu0, s, n }, alt = "ne", alpha = 0.05) {
  if (!fin(mean, mu0, s, n) || s <= 0 || n < 2) return null;
  const t = (mean - mu0) / (s / Math.sqrt(n));
  const df = n - 1;
  return res({ kind: "t", stat: t, df, p: pOf(t, T(df), alt), alt, alpha, est: mean });
}

/** Z-test za razliko povprečij. a, b: { mean, sigma, n } */
export function zTest2(a, b, alt = "ne", alpha = 0.05) {
  if (!fin(a.mean, a.sigma, a.n, b.mean, b.sigma, b.n) || a.sigma <= 0 || b.sigma <= 0 || a.n < 1 || b.n < 1) return null;
  const se = Math.sqrt(sq(a.sigma) / a.n + sq(b.sigma) / b.n);
  const z = (a.mean - b.mean) / se;
  return res({ kind: "z", stat: z, p: pOf(z, Z, alt), alt, alpha, est: a.mean - b.mean, se });
}

function tSe(a, b, pooled) {
  if (pooled) {
    const df = a.n + b.n - 2;
    const sp2 = ((a.n - 1) * sq(a.s) + (b.n - 1) * sq(b.s)) / df;
    return { se: Math.sqrt(sp2 * (1 / a.n + 1 / b.n)), df, sp: Math.sqrt(sp2) };
  }
  const va = sq(a.s) / a.n;
  const vb = sq(b.s) / b.n;
  return { se: Math.sqrt(va + vb), df: sq(va + vb) / (sq(va) / (a.n - 1) + sq(vb) / (b.n - 1)) };
}

/** T-test za razliko povprečij (Welch ali pooled). a, b: { mean, s, n } */
export function tTest2(a, b, alt = "ne", alpha = 0.05, pooled = false) {
  if (!fin(a.mean, a.s, a.n, b.mean, b.s, b.n) || a.n < 2 || b.n < 2 || a.s < 0 || b.s < 0) return null;
  const { se, df } = tSe(a, b, pooled);
  if (!(se > 0)) return null;
  const t = (a.mean - b.mean) / se;
  return res({ kind: "t", stat: t, df, p: pOf(t, T(df), alt), alt, alpha, est: a.mean - b.mean, se });
}

/** Z-test za delež: x uspehov od n, H0: p = p0. */
export function propTest1({ x, n, p0 }, alt = "ne", alpha = 0.05) {
  if (!fin(x, n, p0) || n < 1 || x < 0 || x > n || p0 <= 0 || p0 >= 1) return null;
  const z = (x / n - p0) / Math.sqrt((p0 * (1 - p0)) / n);
  return res({ kind: "z", stat: z, p: pOf(z, Z, alt), alt, alpha, est: x / n });
}

/** Z-test za razliko deležev (združen delež pod H0). */
export function propTest2({ x1, n1, x2, n2 }, alt = "ne", alpha = 0.05) {
  if (!fin(x1, n1, x2, n2) || n1 < 1 || n2 < 1 || x1 < 0 || x1 > n1 || x2 < 0 || x2 > n2) return null;
  const pc = (x1 + x2) / (n1 + n2);
  const se = Math.sqrt(pc * (1 - pc) * (1 / n1 + 1 / n2));
  if (!(se > 0)) return null;
  const z = (x1 / n1 - x2 / n2) / se;
  return res({ kind: "z", stat: z, p: pOf(z, Z, alt), alt, alpha, est: x1 / n1 - x2 / n2, pc });
}

/** χ² prileganje. obs: opažene frekvence; exp: pričakovane (ali null = enake). */
export function chiGof(obs, exp = null, alpha = 0.05) {
  const k = obs.length;
  if (k < 2 || !obs.every((v) => Number.isFinite(v) && v >= 0)) return null;
  const tot = obs.reduce((s, v) => s + v, 0);
  const e = exp && exp.length === k ? exp : obs.map(() => tot / k);
  if (!e.every((v) => Number.isFinite(v) && v > 0)) return null;
  const chi = obs.reduce((s, o, i) => s + sq(o - e[i]) / e[i], 0);
  const df = k - 1;
  return res({ kind: "chi", stat: chi, df, p: 1 - chi2(df).cdf(chi), alpha, expected: e });
}

/** χ² neodvisnost; tab: vrstice × stolpci opaženih frekvenc. */
export function chiIndep(tab, alpha = 0.05) {
  const r = tab.length;
  const c = tab[0]?.length;
  if (r < 2 || !c || c < 2 || tab.some((row) => row.length !== c || !row.every((v) => Number.isFinite(v) && v >= 0))) return null;
  const rs = tab.map((row) => row.reduce((s, v) => s + v, 0));
  const cs = tab[0].map((_, j) => tab.reduce((s, row) => s + row[j], 0));
  const tot = rs.reduce((s, v) => s + v, 0);
  if (rs.some((v) => v === 0) || cs.some((v) => v === 0)) return null;
  const expected = tab.map((_, i) => cs.map((cj) => (rs[i] * cj) / tot));
  let chi = 0;
  for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) chi += sq(tab[i][j] - expected[i][j]) / expected[i][j];
  const df = (r - 1) * (c - 1);
  return res({ kind: "chi", stat: chi, df, p: 1 - chi2(df).cdf(chi), alpha, expected });
}

/** T-test za naklon regresije (H0: β = 0), kot LinRegTTest. */
export function regTest(xs, ys, alt = "ne", alpha = 0.05) {
  const n = xs.length;
  if (n < 3 || ys.length !== n || !xs.every(Number.isFinite) || !ys.every(Number.isFinite)) return null;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  const sxx = xs.reduce((s, x) => s + sq(x - mx), 0);
  const syy = ys.reduce((s, y) => s + sq(y - my), 0);
  const sxy = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
  if (!(sxx > 0)) return null;
  const b = sxy / sxx;
  const a = my - b * mx;
  const sse = Math.max(0, syy - b * sxy);
  const df = n - 2;
  const s = Math.sqrt(sse / df);
  const seb = s / Math.sqrt(sxx);
  const r2 = syy > 0 ? (sxy * sxy) / (sxx * syy) : 1;
  if (!(seb > 0)) return null; // popolna premica: t ni končen
  const t = b / seb;
  return res({ kind: "t", stat: t, df, p: pOf(t, T(df), alt), alt, alpha, a, b, s, seb, r: Math.sign(b) * Math.sqrt(r2), r2 });
}

// ---------- intervali zaupanja ----------

const zc = (level) => -Z.inv((1 - level) / 2); // pri 95 % 1,95996
const tc = (level, df) => -T(df).inv((1 - level) / 2);
const ci = (est, m, extra = {}) => ({ est, margin: m, lo: est - m, hi: est + m, ...extra });
const okLevel = (l) => Number.isFinite(l) && l > 0 && l < 1;

export function zInt1({ mean, sigma, n }, level = 0.95) {
  if (!fin(mean, sigma, n) || sigma <= 0 || n < 1 || !okLevel(level)) return null;
  const q = zc(level);
  return ci(mean, q * (sigma / Math.sqrt(n)), { crit: q });
}
export function tInt1({ mean, s, n }, level = 0.95) {
  if (!fin(mean, s, n) || s < 0 || n < 2 || !okLevel(level)) return null;
  const q = tc(level, n - 1);
  return ci(mean, q * (s / Math.sqrt(n)), { crit: q, df: n - 1 });
}
export function zInt2(a, b, level = 0.95) {
  if (!fin(a.mean, a.sigma, a.n, b.mean, b.sigma, b.n) || a.sigma <= 0 || b.sigma <= 0 || a.n < 1 || b.n < 1 || !okLevel(level)) return null;
  const q = zc(level);
  return ci(a.mean - b.mean, q * Math.sqrt(sq(a.sigma) / a.n + sq(b.sigma) / b.n), { crit: q });
}
export function tInt2(a, b, level = 0.95, pooled = false) {
  if (!fin(a.mean, a.s, a.n, b.mean, b.s, b.n) || a.n < 2 || b.n < 2 || !okLevel(level)) return null;
  const { se, df } = tSe(a, b, pooled);
  const q = tc(level, df);
  return ci(a.mean - b.mean, q * se, { crit: q, df });
}
export function propInt1({ x, n }, level = 0.95) {
  if (!fin(x, n) || n < 1 || x < 0 || x > n || !okLevel(level)) return null;
  const p = x / n;
  const q = zc(level);
  return ci(p, q * Math.sqrt((p * (1 - p)) / n), { crit: q });
}
export function propInt2({ x1, n1, x2, n2 }, level = 0.95) {
  if (!fin(x1, n1, x2, n2) || n1 < 1 || n2 < 1 || x1 < 0 || x1 > n1 || x2 < 0 || x2 > n2 || !okLevel(level)) return null;
  const p1 = x1 / n1;
  const p2 = x2 / n2;
  const q = zc(level);
  return ci(p1 - p2, q * Math.sqrt((p1 * (1 - p1)) / n1 + (p2 * (1 - p2)) / n2), { crit: q });
}

// ---------- TVM (finančni reševalnik kot TI-84) ----------

export const TVM_FIELDS = ["N", "I", "PV", "PMT", "FV"];

/**
 * v: { N, I (v %), PV, PMT, FV, PY, CY, begin }; solve: ime polja, ki ga iščemo.
 * Znakovni dogovor TI: prejeti denar je +, plačani je −.
 * Vrne { N, I, PV, PMT, FV } z izračunanim poljem ali null.
 */
export function tvm(v, solve) {
  const { PY, CY } = v;
  if (!fin(PY, CY) || PY <= 0 || CY <= 0 || !TVM_FIELDS.includes(solve)) return null;
  if (!TVM_FIELDS.filter((f) => f !== solve).every((f) => Number.isFinite(v[f]))) return null;
  const k = v.begin ? 1 : 0;
  const out = { N: v.N, I: v.I, PV: v.PV, PMT: v.PMT, FV: v.FV };
  const i = solve === "I" ? NaN : (1 + v.I / 100 / CY) ** (CY / PY) - 1; // mera na obdobje plačil
  // PV + PMT·(1 + i·k)·(1 − (1+i)^−N)/i + FV·(1+i)^−N = 0
  const ann = (N, r) => (r === 0 ? N : ((1 + r * k) * (1 - (1 + r) ** -N)) / r);
  if (solve === "PMT") {
    const d = ann(v.N, i);
    if (d === 0) return null;
    out.PMT = -(v.PV + v.FV * (1 + i) ** -v.N) / d;
  } else if (solve === "PV") {
    out.PV = -(v.PMT * ann(v.N, i) + v.FV * (1 + i) ** -v.N);
  } else if (solve === "FV") {
    out.FV = -(v.PV + v.PMT * ann(v.N, i)) * (1 + i) ** v.N;
  } else if (solve === "N") {
    if (i === 0) {
      if (v.PMT === 0) return null;
      out.N = -(v.PV + v.FV) / v.PMT;
    } else {
      const c = (v.PMT * (1 + i * k)) / i;
      const q = (v.PV + c) / (c - v.FV);
      if (!(q > 0) || i <= -1) return null;
      out.N = -Math.log(q) / Math.log(1 + i);
    }
  } else {
    if (!(v.N > 0)) return null;
    const f = (r) => v.PV + v.PMT * ann(v.N, r) + v.FV * (1 + r) ** -v.N;
    // najbližja ničla pri 0: pregled mreže na obe strani, nato bisekcija
    let br = null;
    for (const dir of [1, -1]) {
      let prev = 0;
      let fp = f(0);
      for (let j = 1; j <= 600 && !(dir < 0 && prev <= -0.99); j++) {
        const x = dir * (j < 200 ? j * 0.0005 : j < 400 ? 0.1 + (j - 200) * 0.005 : 1.1 + (j - 400) * 0.1);
        const fx = f(Math.max(x, -0.99));
        if (fp * fx <= 0 && Number.isFinite(fp) && Number.isFinite(fx)) {
          if (!br || Math.min(Math.abs(prev), Math.abs(x)) < Math.min(Math.abs(br[0]), Math.abs(br[1]))) br = [prev, x];
          break;
        }
        prev = x;
        fp = fx;
      }
    }
    if (!br) return null;
    let [lo, hi] = br;
    let flo = f(lo);
    for (let it = 0; it < 200; it++) {
      const mid = (lo + hi) / 2;
      const fm = f(mid);
      if (flo * fm <= 0) hi = mid;
      else {
        lo = mid;
        flo = fm;
      }
    }
    const r = (lo + hi) / 2;
    out.I = 100 * CY * ((1 + r) ** (PY / CY) - 1);
  }
  return TVM_FIELDS.every((f) => Number.isFinite(out[f])) ? out : null;
}

// ---------- tabela vrednosti ----------

/** Tabela f(x) (in g(x)) od začetka s korakom; vrstic največ 200. Vrne { xs, f, g } ali { error }. */
export function valueTable({ f, g = "", start, step, rows }) {
  const n = Math.floor(rows);
  if (!fin(start, step, n) || n < 1 || n > 200 || step === 0) return { error: "range" };
  let F;
  let G = null;
  try {
    F = parseFn(f);
    if (g.trim()) G = parseFn(g);
  } catch (e) {
    return { error: "syntax", e };
  }
  const bad = [...F.vars, ...(G ? G.vars : [])].find((v) => v !== "x");
  if (bad) return { error: "var", name: bad };
  const xs = Array.from({ length: n }, (_, i) => Number((start + i * step).toPrecision(12)));
  return { xs, f: xs.map((x) => F.f({ x })), g: G ? xs.map((x) => G.f({ x })) : null };
}
