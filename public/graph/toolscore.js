// Računska jedra dodatnih orodij: statistika, enačbe, matrike, kompleksna števila, številski sistemi,
// molska masa. Brez DOM (preizkusi v test/tools.test.js).
import { parse, MathError } from "./math.js";

// ---------- branje števil ----------

/** Število iz besedila (decimalna vejica ali pika, ulomek a/b, −). */
export function readNumber(s) {
  let x = String(s ?? "").trim().replace(/[−–]/g, "-").replace(/\s/g, "").replace(",", ".");
  if (!x) return NaN;
  const f = /^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/.exec(x);
  if (f) return Number(f[1]) / Number(f[2]);
  if (!/^-?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(x)) return NaN;
  return Number(x);
}

/** Seznam števil: ločila so presledki, »;«, nove vrstice; vejica je decimalna, če ji sledi števka brez presledka. */
export function readList(text) {
  const s = String(text ?? "").replace(/[−–]/g, "-");
  // »1, 2, 3« → ločila; »1,5« → decimalno
  const parts = s.split(/[;\s\n\t]+|,(?=\s|$)|,(?=-?\d+,\d)/).flatMap((p) => (/^-?\d+(,\d+){2,}$/.test(p) ? p.split(",") : [p]));
  return parts.map((p) => p.trim()).filter(Boolean).map(readNumber);
}

// ---------- statistika ----------

function quantile(sorted, p) {
  // metoda, ki jo uporablja večina šolskih učbenikov (mediana spodnje/zgornje polovice)
  const n = sorted.length;
  const med = (a) => (a.length % 2 ? a[(a.length - 1) / 2] : (a[a.length / 2 - 1] + a[a.length / 2]) / 2);
  if (p === 0.5) return med(sorted);
  const half = Math.floor(n / 2);
  return p < 0.5 ? med(sorted.slice(0, half)) : med(sorted.slice(n - half));
}

/** Opisna statistika. Vrne null, če ni podatkov. Napačni podatki so v »bad«. */
export function stats(values) {
  const bad = values.filter((v) => !Number.isFinite(v)).length;
  const xs = values.filter(Number.isFinite);
  const n = xs.length;
  if (!n) return null;
  const sorted = [...xs].sort((a, b) => a - b);
  const sum = xs.reduce((s, v) => s + v, 0);
  const mean = sum / n;
  const ss = xs.reduce((s, v) => s + (v - mean) ** 2, 0);
  const counts = new Map();
  for (const v of xs) counts.set(v, (counts.get(v) || 0) + 1);
  const top = Math.max(...counts.values());
  const mode = top > 1 ? [...counts].filter(([, c]) => c === top).map(([v]) => v).sort((a, b) => a - b) : [];
  const q1 = n > 1 ? quantile(sorted, 0.25) : sorted[0];
  const q3 = n > 1 ? quantile(sorted, 0.75) : sorted[0];
  return {
    n,
    bad,
    sum,
    sumSq: xs.reduce((s, v) => s + v * v, 0),
    mean,
    median: quantile(sorted, 0.5),
    mode,
    min: sorted[0],
    max: sorted[n - 1],
    range: sorted[n - 1] - sorted[0],
    q1,
    q3,
    iqr: q3 - q1,
    varP: ss / n,
    sdP: Math.sqrt(ss / n),
    varS: n > 1 ? ss / (n - 1) : NaN,
    sdS: n > 1 ? Math.sqrt(ss / (n - 1)) : NaN,
    sorted,
  };
}

/** Podatki s pogostostmi (Casio »Freq«): vsak podatek ponovljen tolikokrat; null, če pogostosti niso cela števila ≥ 0. */
export function expandFreq(values, freqs) {
  if (!freqs?.length) return values;
  if (freqs.length !== values.length || !freqs.every((f) => Number.isInteger(f) && f >= 0)) return null;
  if (freqs.reduce((s, f) => s + f, 0) > 100000) return null;
  return values.flatMap((v, i) => Array(freqs[i]).fill(v));
}

/** Statistika dveh spremenljivk (Casio 2-spremenljivčna, TI 2-Var Stats): vsote, povprečja, odkloni, r. */
export function stats2(xs, ys) {
  const n = xs.length;
  if (n < 2 || ys.length !== n || !xs.every(Number.isFinite) || !ys.every(Number.isFinite)) return null;
  const S = (f) => xs.reduce((s, x, i) => s + f(x, ys[i]), 0);
  const sx = S((x) => x);
  const sy = S((x, y) => y);
  const sxx = S((x) => x * x);
  const syy = S((x, y) => y * y);
  const sxy = S((x, y) => x * y);
  const mx = sx / n;
  const my = sy / n;
  const Sxx = S((x) => (x - mx) ** 2);
  const Syy = S((x, y) => (y - my) ** 2);
  const Sxy = S((x, y) => (x - mx) * (y - my));
  // r iz odklonov, deljenih z največjim odklonom: brez prekoračitve pri zelo velikih številih (Sxx = ∞)
  const kx = Math.max(...xs.map((x) => Math.abs(x - mx)));
  const ky = Math.max(...ys.map((y) => Math.abs(y - my)));
  const u = (f) => xs.reduce((s, x, i) => s + f((x - mx) / kx, (ys[i] - my) / ky), 0);
  const r = kx > 0 && ky > 0 ? Math.max(-1, Math.min(1, u((a, b) => a * b) / Math.sqrt(u((a) => a * a) * u((a, b) => b * b)))) : NaN;
  return { n, sx, sy, sxx, syy, sxy, mx, my, sdPx: Math.sqrt(Sxx / n), sdSx: Math.sqrt(Sxx / (n - 1)), sdPy: Math.sqrt(Syy / n), sdSy: Math.sqrt(Syy / (n - 1)), r };
}

// ---------- kompleksna števila ----------

export const C = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1]],
  sub: (a, b) => [a[0] - b[0], a[1] - b[1]],
  mul: (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]],
  div: (a, b) => {
    const d = b[0] * b[0] + b[1] * b[1];
    return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d];
  },
  abs: (a) => Math.hypot(a[0], a[1]),
  arg: (a) => Math.atan2(a[1], a[0]),
  exp: (a) => [Math.exp(a[0]) * Math.cos(a[1]), Math.exp(a[0]) * Math.sin(a[1])],
  ln: (a) => [Math.log(Math.hypot(a[0], a[1])), Math.atan2(a[1], a[0])],
  pow(a, b) {
    if (a[0] === 0 && a[1] === 0) return b[0] === 0 && b[1] === 0 ? [1, 0] : [0, 0];
    // celi eksponenti točno (brez šuma ln/exp)
    if (b[1] === 0 && Number.isInteger(b[0]) && Math.abs(b[0]) <= 64) {
      let r = [1, 0];
      for (let i = 0; i < Math.abs(b[0]); i++) r = C.mul(r, a);
      return b[0] < 0 ? C.div([1, 0], r) : r;
    }
    return C.exp(C.mul(b, C.ln(a)));
  },
  sqrt(a) {
    const r = Math.hypot(a[0], a[1]);
    const re = Math.sqrt((r + a[0]) / 2);
    const im = Math.sqrt(Math.max(0, (r - a[0]) / 2));
    return [re, a[1] < 0 ? -im : im];
  },
};
const CFN = {
  sqrt: C.sqrt,
  abs: (a) => [C.abs(a), 0],
  arg: (a) => [C.arg(a), 0],
  conj: (a) => [a[0], -a[1]],
  re: (a) => [a[0], 0],
  im: (a) => [a[1], 0],
  exp: C.exp,
  ln: C.ln,
  sin: (a) => [Math.sin(a[0]) * Math.cosh(a[1]), Math.cos(a[0]) * Math.sinh(a[1])],
  cos: (a) => [Math.cos(a[0]) * Math.cosh(a[1]), -Math.sin(a[0]) * Math.sinh(a[1])],
};

/** Izračuna izraz s kompleksnimi števili (i ali j je imaginarna enota). Vrne [re, im] ali vrže MathError. */
export function evalComplex(text, { deg = false } = {}) {
  let s = String(text ?? "").replace(/(\d),(?=\d)/g, "$1.").replace(/∠/g, "@");
  // polarni zapis r∠φ → r·e^(iφ)
  s = s.replace(/([\d.]+)\s*@\s*(-?[\d.]+)\s*(°?)/g, (_, r, f, d) => `(${r}*exp(i*${f}${d || deg ? "*π/180" : ""}))`);
  s = s.replace(/°/g, "*π/180");
  const ast = parse(s, { funcs: new Set(["conj", "re", "im", "arg"]) });
  const ev = (n) => {
    switch (n.k) {
      case "num":
        return [n.v, 0];
      case "const":
        if (n.name === "π" || n.name === "pi") return [Math.PI, 0];
        if (n.name === "e") return [Math.E, 0];
        break;
      case "var":
        if (n.name === "i" || n.name === "j") return [0, 1];
        throw new MathError("missing", { names: [n.name] });
      case "grp":
        return ev(n.a);
      case "neg":
        return C.sub([0, 0], ev(n.a));
      case "+":
        return C.add(ev(n.a), ev(n.b));
      case "-":
        return C.sub(ev(n.a), ev(n.b));
      case "*":
        return C.mul(ev(n.a), ev(n.b));
      case "/":
        return C.div(ev(n.a), ev(n.b));
      case "^":
        return C.pow(ev(n.a), ev(n.b));
      case "call": {
        const f = CFN[n.f] || (n.f === "abs" ? CFN.abs : null);
        if (f && n.args.length === 1) return f(ev(n.args[0]));
        if (n.f === "root" && n.args.length === 2) return C.pow(ev(n.args[0]), C.div([1, 0], ev(n.args[1])));
        break;
      }
    }
    throw new MathError("other");
  };
  const r = ev(ast);
  return r.map((v) => (Math.abs(v) < 1e-13 * Math.max(1, Math.abs(r[0]), Math.abs(r[1])) ? 0 : v));
}

// ---------- polinomske enačbe ----------

// Durand–Kerner in trije Newtonovi koraki, brez zaokroževanja. c: od najvišje potence, c[0] ≠ 0, stopnja ≥ 1.
function dkRoots(c, scaled = false) {
  const n = c.length - 1;
  if (n === 1) return [[-c[1] / c[0], 0]];
  if (n === 2) {
    const [a, b, cc] = c;
    const D = b * b - 4 * a * cc;
    if (Math.abs(D) < 1e-12 * Math.max(1, b * b)) return [[-b / (2 * a), 0], [-b / (2 * a), 0]];
    if (D > 0) {
      // stabilna oblika
      const q = -0.5 * (b + Math.sign(b || 1) * Math.sqrt(D));
      return [[q / a, 0], [cc / q, 0]].sort((x, y) => x[0] - y[0]);
    }
    const re = -b / (2 * a);
    const im = Math.sqrt(-D) / (2 * Math.abs(a));
    return [[re, -im], [re, im]];
  }
  const a = c.map((v) => [v / c[0], 0]);
  let z = Array.from({ length: n }, (_, k) => C.pow([0.4, 0.9], [k, 0]));
  const p = (x) => a.reduce((s, ai) => C.add(C.mul(s, x), ai), [0, 0]);
  for (let it = 0; it < 500; it++) {
    let moved = 0;
    z = z.map((zi, i) => {
      let d = [1, 0];
      z.forEach((zj, j) => {
        if (i !== j) d = C.mul(d, C.sub(zi, zj));
      });
      const step = C.div(p(zi), d);
      moved = Math.max(moved, C.abs(step));
      return C.sub(zi, step);
    });
    if (moved < 1e-15) break;
  }
  const out = z.map((zi) => newton(c, zi, 3));
  // zelo različno velike ničle (4 in 10⁷, koeficienti do 10⁴³): iteracija preplavi; x = s·y, s = 2^k ≈ meja ničel
  if (!scaled && out.some((zi) => !Number.isFinite(zi[0]) || !Number.isFinite(zi[1]))) {
    const n = c.length - 1;
    let bound = 0;
    for (let i = 1; i <= n; i++) bound = Math.max(bound, Math.abs(c[i] / c[0]) ** (1 / i));
    const sc = 2 ** Math.round(Math.log2(2 * bound || 1));
    const cy = c.map((a, i) => a * sc ** -i); // a_i·s^(n−i)/s^n
    if (cy.every(Number.isFinite) && cy[0] !== 0) return dkRoots(cy, true).map(([re, im]) => newton(c, [re * sc, im * sc], 3));
  }
  return out;
}

// p(z) in »velikost« Σ|a_k|·|z|^k (merilo za ostanek), c od najvišje potence
const hornerC = (c, z) => c.reduce((s, ai) => C.add(C.mul(s, z), [ai, 0]), [0, 0]);
const sizeAt = (c, z) => c.reduce((s, ai) => s * C.abs(z) + Math.abs(ai), 0);
const derivF = (c) => c.slice(0, -1).map((ai, k) => ai * (c.length - 1 - k));
// Newtonovi koraki na c; obdržimo samo korake, ki ostanek zmanjšajo
function newton(c, z, steps = 6) {
  if (c.length < 2) return z;
  const dc = derivF(c);
  let best = C.abs(hornerC(c, z));
  for (let k = 0; k < steps && best > 0; k++) {
    const d = hornerC(dc, z);
    if (C.abs(d) < 1e-300) break;
    const z2 = C.sub(z, C.div(hornerC(c, z), d));
    const r = C.abs(hornerC(c, z2));
    if (!(r < best)) break;
    [z, best] = [z2, r];
  }
  return z;
}

// ---- točni polinomi s celimi koeficienti (BigInt, od najnižje potence) ----
const bAbs = (a) => (a < 0n ? -a : a);
const bGcd = (a, b) => {
  a = bAbs(a);
  b = bAbs(b);
  while (b) [a, b] = [b, a % b];
  return a;
};
const trimB = (p) => {
  while (p.length > 1 && p[p.length - 1] === 0n) p.pop();
  return p;
};
const zeroB = (p) => p.every((x) => x === 0n);
const primB = (p) => {
  p = trimB(p.slice());
  if (zeroB(p)) return [0n];
  const g = p.reduce(bGcd, 0n);
  if (g > 1n) p = p.map((x) => x / g);
  return p[p.length - 1] < 0n ? p.map((x) => -x) : p;
};
// ⌊√n⌋ za n ≥ 0 (Newton v BigInt)
const bSqrt = (n) => {
  if (n < 2n) return n;
  let x = BigInt(Math.floor(Math.sqrt(Number(n))));
  while (x * x > n) x = (x + n / x) / 2n;
  while ((x + 1n) * (x + 1n) <= n) x++;
  return x;
};
const derivB = (p) => (p.length < 2 ? [0n] : p.slice(1).map((x, i) => x * BigInt(i + 1)));
// psevdo-deljenje: lc(b)^k · a = q·b + r; vrne [q, r]
function pdivB(a, b) {
  let r = trimB(a.slice());
  const db = b.length - 1;
  const lb = b[db];
  let q = [0n];
  let steps = 0; // število množenj z lc(b) (lahko manj kot δ, če vodilni členi odpadejo)
  while (!zeroB(r) && r.length - 1 >= db) {
    const k = r.length - 1 - db;
    const lr = r[r.length - 1];
    r = r.map((x) => x * lb);
    q = q.map((x) => x * lb);
    steps++;
    while (q.length <= k) q.push(0n);
    q[k] += lr;
    for (let i = 0; i <= db; i++) r[i + k] -= lr * b[i];
    r.pop();
    trimB(r);
  }
  return [q, r, steps];
}
function gcdB(a, b) {
  a = primB(a);
  b = primB(b);
  while (!zeroB(b)) {
    const r = pdivB(a, b)[1];
    a = b;
    b = primB(r);
  }
  return a;
}
const divB = (a, b) => primB(pdivB(a, b)[0]); // a/b do konstante natančno (b deli a)
// p(num/den) = 0 točno? (Horner v homogeni obliki: Σ p_i·num^i·den^(n−i))
function rootB(p, num, den) {
  const n = p.length - 1;
  let s = 0n;
  for (let i = n; i >= 0; i--) s = s * num + p[i] * den ** BigInt(n - i);
  return s === 0n;
}
// število double kot točen ulomek num/2^k
function dyadic(x) {
  let e = 0n;
  while (!Number.isInteger(x) && e < 1100n) {
    x *= 2;
    e++;
  }
  return [BigInt(x), 2n ** e];
}
const bitLen = (a) => (a === 0n ? 0 : bAbs(a).toString(2).length);
// a/b kot število, tudi ko sta a in b prevelika za double
function bigRatio(a, b) {
  const sa = Math.max(0, bitLen(a) - 60);
  const sb = Math.max(0, bitLen(b) - 60);
  return (Number(a >> BigInt(sa)) / Number(b >> BigInt(sb))) * 2 ** (sa - sb);
}
// Newtonovi koraki za realno ničlo enostavnega celoštevilskega polinoma t, s točnim ostankom (z je točen ulomek):
// ničla na ~1 ulp tudi pri bližnjih ničlah (1 in 1,000001), da jo nato prepoznamo kot ulomek
function exactNewton(t, z, steps = 4) {
  const dt = derivB(t);
  const n = t.length - 1;
  for (let k = 0; k < steps; k++) {
    if (!Number.isFinite(z)) return z;
    const [num, den] = dyadic(z);
    let s = 0n;
    for (let i = n; i >= 0; i--) s = s * num + t[i] * den ** BigInt(n - i);
    if (s === 0n) return z;
    let sd = 0n;
    for (let i = n - 1; i >= 0; i--) sd = sd * num + dt[i] * den ** BigInt(n - 1 - i);
    if (sd === 0n) return z;
    const step = bigRatio(s, sd * den);
    const z2 = z - step;
    if (z2 === z || !Number.isFinite(z2)) return z;
    z = z2;
  }
  return z;
}
// racionalni približek s q ≤ maxQ (verižni ulomek) ali null
function ratOf(v, maxQ, tol = 1e-11) {
  if (!Number.isFinite(v)) return null;
  if (v === 0) return { p: 0n, q: 1n };
  const x = Math.abs(v);
  let [h0, h1, k0, k1] = [0, 1, 1, 0];
  let r = x;
  for (let i = 0; i < 40; i++) {
    const a = Math.floor(r);
    [h0, h1] = [h1, a * h1 + h0];
    [k0, k1] = [k1, a * k1 + k0];
    if (k1 > maxQ) return null;
    // relativno: 10⁻¹² ni 0 (x² − 10⁻¹² = 0 ima rešitvi ±10⁻⁶)
    if (Math.abs(h1 / k1 - x) <= tol * x) return { p: BigInt(v < 0 ? -h1 : h1), q: BigInt(k1) };
    const f = r - a;
    if (f < 1e-15) break;
    r = 1 / f;
  }
  return null;
}

// Gruče ničel (numerična pot, ko koeficienti niso racionalni): k ničel blizu skupaj je ena k-kratna ničla, če so
// v njihovem težišču c vrednosti p, p′, …, p^(k−1) praktično 0. Sicer gručo razbijemo z manjšim polmerom.
// Ali je |p^(j)(z)| od 0 neločljivo glede na negotovost koeficientov r_i (krogle) in zaokrožitev računa?
// Realni z: kompenziran Horner (Graillat; kot v dvojni natančnosti), meja ε|p| + γ²·Σ|c_i||z|^i;
// kompleksni z: navaden Horner, meja γ·Σ|c_i||z|^i. Negotovost koeficientov: Σ r_i·e!/(e − j)!·|z|^(e − j).
const U53 = 2 ** -53;
const twoSum = (a, b) => {
  const s = a + b;
  const bb = s - a;
  return [s, a - (s - bb) + (b - bb)];
};
const split = (a) => {
  const t = 134217729 * a;
  const hi = t - (t - a);
  return [hi, a - hi];
};
const twoProd = (a, b) => {
  const p = a * b;
  const [ah, al] = split(a);
  const [bh, bl] = split(b);
  return [p, ah * bh - p + ah * bl + al * bh + al * bl];
};
function compHorner(c, x) {
  let s = c[0];
  let e = 0;
  for (let i = 1; i < c.length; i++) {
    const [p, pe] = twoProd(s, x);
    const [t, se] = twoSum(p, c[i]);
    s = t;
    e = e * x + (pe + se);
  }
  return s + e;
}
function indistinct(c, r, j, z) {
  let d = c;
  for (let t = 0; t < j; t++) d = derivF(d);
  const n = d.length - 1;
  const az = C.abs(z);
  const abs = d.reduce((s, a) => s * az + Math.abs(a), 0);
  // negotovost koeficientov (ena zaokrožitev več za množenje z e·(e − 1)·…)
  let unc = 0;
  for (let i = 0; i < c.length; i++) {
    const e = c.length - 1 - i;
    if (e < j) continue;
    let f = 1;
    for (let t = 0; t < j; t++) f *= e - t;
    unc += (r[i] + (j ? U53 * Math.abs(c[i]) : 0)) * f * az ** (e - j);
  }
  if (Math.abs(z[1]) <= 1e-12 * Math.max(1, Math.abs(z[0]))) {
    const g = 2 * (n + 1) * U53;
    const v = compHorner(d, z[0]);
    return Math.abs(v) <= unc + U53 * Math.abs(v) + g * g * abs;
  }
  return C.abs(hornerC(d, z)) <= unc + 2 * (n + 1) * U53 * abs;
}

// Gruče ničel (numerična pot, ko koeficienti niso točni): k ničel blizu skupaj je ena k-kratna ničla le, če so
// v točki z (Newton na p^(k−1)) vrednosti p, p′, …, p^(k−2) od 0 neločljive (indistinct) – torej jih od 0 ne
// moremo ločiti. Sicer gručo razbijemo z manjšim polmerom; ničla nikoli ne izgine.
function mergeClusters(c, zs, rad = 0.05, r = c.map((x) => 2 ** -53 * Math.abs(x))) {
  const groups = [];
  const used = zs.map(() => false);
  for (let i = 0; i < zs.length; i++) {
    if (used[i]) continue;
    const g = [i];
    used[i] = true;
    for (let k = 0; k < g.length; k++)
      for (let j = 0; j < zs.length; j++)
        if (!used[j] && C.abs(C.sub(zs[g[k]], zs[j])) < rad * Math.max(1, C.abs(zs[g[k]]))) {
          used[j] = true;
          g.push(j);
        }
    groups.push(g.map((j) => zs[j]));
  }
  const out = [];
  for (const g of groups) {
    if (g.length === 1) {
      out.push({ z: g[0], m: 1 });
      continue;
    }
    const cen = [g.reduce((s, z) => s + z[0], 0) / g.length, g.reduce((s, z) => s + z[1], 0) / g.length];
    let dm = c;
    for (let j = 1; j < g.length; j++) dm = derivF(dm);
    const z = newton(dm, cen, 30);
    let ok = C.abs(C.sub(z, cen)) < rad * Math.max(1, C.abs(cen));
    for (let j = 0; j < g.length - 1 && ok; j++) ok = indistinct(c, r, j, z);
    if (ok) out.push({ z, m: g.length });
    else if (rad > 1e-9) out.push(...mergeClusters(c, g, rad / 10, r));
    else out.push(...g.map((w) => ({ z: newton(c, w), m: 1 })));
  }
  return out;
}

// koeficienti (od najvišje potence) kot celoštevilski polinom (BigInt, od najnižje) ali null, če niso racionalni
function intPoly(c) {
  // samo, če je ulomek točno to število (nekaj ulp): −2504,1055115923755 ni −16446965/6568
  const fr = c.map((v) => {
    // vpisana decimalka (1,000001): najkrajši zapis števila ima ≤ 9 decimalk → točen ulomek p/10^k
    const m = /^(-?)(\d+)(?:\.(\d{1,9}))?$/.exec(String(v));
    if (m) return { p: BigInt(m[1] + m[2] + (m[3] || "")), q: 10n ** BigInt((m[3] || "").length) };
    const f = ratOf(v, 10000);
    return f && Math.abs(Number(f.p) / Number(f.q) - v) <= 4e-16 * Math.abs(v) ? f : null;
  });
  if (fr.some((f) => !f)) return null;
  const L = fr.reduce((l, f) => (l * f.q) / bGcd(l, f.q), 1n);
  return primB(fr.map((f) => (f.p * L) / f.q).reverse());
}

// Realne ničle in konjugirani pari. sf: ničla enostavnega (brez kvadratov) faktorja – realna je natanko tedaj, ko
// zraven ni njene konjugirane (1 ± 10⁻¹⁰ i sta par, ne dvakrat 1); cx: zagotovo kompleksna; sicer meja 1e-9.
function pairUp(found) {
  const real = [];
  const upper = [];
  const lower = [];
  for (const r of found) {
    let isReal;
    if (r.exact || r.real) isReal = true;
    else if (r.cx) isReal = false;
    else if (r.sf) isReal = !found.some((w) => w !== r && w.sf && Math.abs(r.z[1]) > 0 && C.abs(C.sub(w.z, [r.z[0], -r.z[1]])) < Math.abs(r.z[1]));
    else isReal = Math.abs(r.z[1]) < 1e-9 * Math.max(1, C.abs(r.z));
    if (isReal) real.push({ ...r, z: [r.z[0], 0] });
    else (r.z[1] > 0 ? upper : lower).push(r);
  }
  const out = real.map((r) => ({ re: r.z[0], im: 0, m: r.m, exact: !!r.exact, ...(r.unc ? { unc: true } : {}) }));
  for (const u of upper) {
    let best = -1;
    lower.forEach((l, i) => {
      if (l && l.m === u.m && (best < 0 || C.abs(C.sub(l.z, [u.z[0], -u.z[1]])) < C.abs(C.sub(lower[best].z, [u.z[0], -u.z[1]])))) best = i;
    });
    if (best < 0) return null;
    const l = lower[best];
    lower[best] = null;
    const re = (u.z[0] + l.z[0]) / 2;
    const im = (u.z[1] - l.z[1]) / 2;
    const err = Math.max(u.err || 0, l.err || 0);
    const extra = { ...(err ? { err } : {}), ...(u.unc || l.unc ? { unc: true } : {}), ...(u.qex && l.qex ? { qex: true } : {}) };
    out.push({ re, im: -im, m: u.m, ...extra }, { re, im, m: u.m, ...extra });
  }
  return lower.some(Boolean) ? null : out;
}

/** Ničle polinoma, za katerega vemo, da nima večkratnih ničel (npr. faktor nad ℚ[π]): vse enostavne, brez združevanja. */
export function simpleRoots(coeffs, m = 1) {
  const c = coeffs.map(Number);
  if (c.length < 2 || c.some((v) => !Number.isFinite(v)) || c[0] === 0) return null;
  return pairUp(dkRoots(c).map((z) => ({ z: newton(c, z), m, sf: true })));
}

// Ničle enostavnega celoštevilskega polinoma t (BigInt, od najnižje) s kratnostjo k v found. Racionalne ničle
// najdene numerično potrdimo točno in jih točno izločimo (deljenje), ostanek rešimo znova: pri ničlah od 4 do 10⁷
// (koeficienti do 10⁴³) so male ničle v double sicer netočne.
function solveSquarefree(t, k, found, depth = 0) {
  if (t.length < 2) return;
  if (t.length === 2) {
    const [c0, c1] = t;
    const g = bGcd(c0, c1) || 1n;
    found.push({ z: [Number(-c0 / g) / Number(c1 / g), 0], m: k, exact: true });
    return;
  }
  if (t.length === 3) {
    // enostaven kvadratni faktor: točna diskriminanta (bližnji ničli 1 in 1,000001 ostaneta dve)
    const [c0, b1, a2] = t;
    const D = b1 * b1 - 4n * a2 * c0;
    const sq = bSqrt(bAbs(D));
    const den = 2 * Number(a2);
    if (D >= 0n && sq * sq === D) {
      for (const num of [-b1 - sq, -b1 + sq]) {
        const g = bGcd(num, 2n * a2) || 1n;
        found.push({ z: [Number(num / g) / Number((2n * a2) / g), 0], m: k, exact: true });
      }
    } else {
      const r = Math.sqrt(Number(bAbs(D))) / Math.abs(den);
      const re = -Number(b1) / den;
      if (D > 0n) {
        // stabilno: večja po absolutni vrednosti iz vsote, manjša iz produkta c/a
        const big = re + Math.sign(re || 1) * r;
        found.push({ z: [big, 0], m: k }, { z: [Number(c0) / Number(a2) / big, 0], m: k });
      } else {
        // D < 0 točno: kompleksni; če je |D| popoln kvadrat, sta realni in imaginarni del točna ulomka (1 ± 10⁻¹⁰ i)
        const qex = sq * sq === bAbs(D);
        found.push({ z: [re, -r], m: k, cx: true, qex }, { z: [re, r], m: k, cx: true, qex });
      }
    }
    return;
  }
  const tf = t.map(Number).reverse();
  const rest = [];
  let q = t;
  const got = [];
  for (let z0 of dkRoots(tf)) {
    let z = newton(tf, z0);
    if (Math.abs(z[1]) < 1e-7 * Math.max(1, C.abs(z))) {
      const x = exactNewton(t, z[0]);
      const f = ratOf(x, 10000000, 1e-15) || ratOf(x, 10000000); // po exactNewton je ničla na ~ulp
      // vsako racionalno ničlo le enkrat (Newton iz gruče bližnjih ničel lahko zdrsne k isti realni ničli)
      if (f && rootB(t, f.p, f.q) && !got.some((g) => g.p * f.q === f.p * g.q)) {
        got.push(f);
        found.push({ z: [Number(f.p) / Number(f.q), 0], m: k, exact: true });
        q = divB(q, [-f.p, f.q]);
        continue;
      }
    }
    rest.push(z);
  }
  if (q.length < t.length && q.length > 1 && depth < 8) solveSquarefree(q, k, found, depth + 1);
  else if (q.length > 1 && rest.length) {
    let cert = null;
    try {
      cert = certifiedRoots(q, rest);
    } catch {
      cert = null;
    }
    // brez potrditve: približki (unc) – v zapisu »≈«, nikoli »=«
    for (const r of cert || rest.map((z) => ({ z }))) found.push(cert ? { ...r, m: k } : { z: r.z, m: k, sf: true, unc: true });
  }
}

// ---- točna izolacija ničel (Sturm) in točen Newton v ℚ(i) ----
// p (BigInt, od najnižje) v točki num/den: predznak vrednosti (homogeno, brez deljenja)
function signAt(p, num, den) {
  const n = p.length - 1;
  let s = 0n;
  let dk = 1n; // den^(n − i), sproti (potenciranje v vsakem členu je bilo prepočasno)
  for (let i = n; i >= 0; i--) {
    s = s * num + p[i] * dk;
    dk *= den;
  }
  return s > 0n ? 1 : s < 0n ? -1 : 0;
}
// Sturmova veriga: p, p′, −rem(p, p′), … (psevdo-ostanek s pravilnim predznakom)
function sturmChain(p) {
  const chain = [p, derivB(p)];
  while (chain[chain.length - 1].length > 1) {
    const a = chain[chain.length - 2];
    const b = chain[chain.length - 1];
    const lb = b[b.length - 1];
    const [, rr, steps] = pdivB(a, b);
    let r = rr;
    if (zeroB(r)) break;
    if (lb < 0n && steps % 2) r = r.map((x) => -x); // lc(b)^steps < 0 obrne predznak
    const g = r.reduce(bGcd, 0n) || 1n;
    chain.push(r.map((x) => -x / g));
  }
  return chain;
}
const changes = (signs) => {
  let c = 0;
  let prev = 0;
  for (const s of signs) {
    if (!s) continue;
    if (prev && s !== prev) c++;
    prev = s;
  }
  return c;
};
const V = (chain, num, den) => changes(chain.map((q) => signAt(q, num, den)));
const Vinf = (chain, sg) => changes(chain.map((q) => Math.sign(Number(q[q.length - 1] > 0n ? 1 : -1)) * (sg < 0 && (q.length - 1) % 2 ? -1 : 1)));
// realne ničle enostavnega p točno izolirane in bisekcijsko zožene do ~1 ulp; null, če ne gre (preveč korakov)
function realRootsExact(p) {
  const chain = sturmChain(p);
  const R = Vinf(chain, -1) - Vinf(chain, 1);
  if (R === 0) return [];
  const n = p.length - 1;
  let bound = 1;
  for (let i = 0; i < n; i++) bound = Math.max(bound, 1 + bigRatio(bAbs(p[i]), bAbs(p[n])));
  const e = BigInt(Math.ceil(Math.log2(bound)) + 1);
  // intervali kot [lo, hi] števcev nad imenovalcem 2^E (E raste)
  const out = [];
  const stack = [[-(1n << e), 1n << e, 0n]]; // lo, hi, E (vrednost = x / 2^E)
  let guard = 0;
  while (stack.length) {
    if (++guard > 20000) return null;
    const [lo, hi, E] = stack.pop();
    const D = 1n << E;
    const cnt = V(chain, lo, D) - V(chain, hi, D) + (signAt(p, lo, D) === 0 ? 0 : 0);
    if (cnt === 0) continue;
    if (signAt(p, hi, D) === 0) {
      out.push(Number(hi) / Number(D));
      // ničla v desnem krajišču: ostanek (lo, hi) brez nje
      if (cnt > 1) stack.push([lo * 2n, hi * 2n - 1n, E + 1n]);
      continue;
    }
    if (cnt === 1) {
      // bisekcija po predznaku p do ~ulp
      let a = lo;
      let b = hi;
      let F = E;
      const sa = signAt(p, a, 1n << F);
      for (let it = 0; it < 1200; it++) {
        const x = Number(a) / 2 ** Number(F);
        const y = Number(b) / 2 ** Number(F);
        if (!(y - x > 2 ** -53 * Math.max(Math.abs(x), Math.abs(y), 1e-300))) break;
        a *= 2n;
        b *= 2n;
        F += 1n;
        const m = a + (b - a) / 2n;
        const sm = signAt(p, m, 1n << F);
        if (sm === 0) {
          a = b = m;
          break;
        }
        if (sm === sa) a = m;
        else b = m;
      }
      out.push(bigRatio(a + b, 2n << F));
      continue;
    }
    const mid = lo + hi; // (lo+hi)/2 pri E+1
    stack.push([lo * 2n, mid, E + 1n], [mid, hi * 2n, E + 1n]);
  }
  return out.length === R ? out.sort((x, y) => x - y) : null;
}
// točen Newton za kompleksno ničlo: z dvojiški ulomek, p(z) in p′(z) v Gaussovih celih številih; vrne [z, r], kjer je
// r = n·|p(z)/p′(z)| polmer kroga okoli z, v katerem je zagotovo ničla
function complexNewtonExact(p, z0, steps = 80, known = []) {
  const n = p.length - 1;
  const dp = derivB(p);
  let z = z0;
  let rad = Infinity;
  for (let it = 0; it < steps; it++) {
    if (!Number.isFinite(z[0]) || !Number.isFinite(z[1])) return [z, Infinity];
    const [ar, dr] = dyadic(z[0]);
    const [ai, di] = dyadic(z[1]);
    const D = dr > di ? dr : di;
    const A = ar * (D / dr);
    const B = ai * (D / di);
    const ev = (q) => {
      const m = q.length - 1;
      let sr = 0n;
      let si = 0n;
      for (let i = m; i >= 0; i--) {
        const pw = D ** BigInt(m - i);
        [sr, si] = [sr * A - si * B + q[i] * pw, sr * B + si * A];
      }
      return [sr, si];
    };
    const [pr, pi] = ev(p);
    const [qr, qi] = ev(dp);
    if (pr === 0n && pi === 0n) return [z, 0];
    // korak = p/p′ = (pr + i·pi)/((qr + i·qi)·D)
    const den = (qr * qr + qi * qi) * D;
    if (den === 0n) return [z, Infinity];
    let re = bigRatio(pr * qr + pi * qi, den);
    let im = bigRatio(pi * qr - pr * qi, den);
    rad = n * Math.hypot(re, im);
    // Maehly: že znane ničle (realne, prejšnji pari) izločimo implicitno: korak = w/(1 − w·Σ 1/(z − r_j)), w = p/p′
    if (known.length) {
      let sr = 0;
      let si = 0;
      for (const r of known) {
        const [a, b] = C.div([1, 0], C.sub(z, r));
        sr += a;
        si += b;
      }
      const [cr, ci] = C.sub([1, 0], C.mul([re, im], [sr, si]));
      [re, im] = C.div([re, im], [cr, ci]);
    }
    const z2 = [z[0] - re, z[1] - im];
    if (z2[0] === z[0] && z2[1] === z[1]) break;
    z = z2;
  }
  return [z, rad];
}
// Ničle enostavnega p: realne točno (Sturm), kompleksne s točnim Newtonom in polmerom napake (err). null, če ne gre.
function certifiedRoots(p, approx) {
  const n = p.length - 1;
  const reals = realRootsExact(p);
  if (!reals) return null;
  const nc = n - reals.length;
  if (nc % 2) return null;
  const out = reals.map((x) => ({ z: [x, 0], real: true }));
  if (!nc) return out;
  // kompleksni pari: izhodišča so približki z največjim |im| (pri gruči jih odmaknemo od realne osi), nato še
  // zasukani okoli središča gruče; Newton z Maehlyjevim izločanjem že najdenih ničel
  const scale = Math.max(...approx.map((z) => C.abs(z)), 1e-300);
  const spread = Math.max(...approx.map((z) => C.abs(C.sub(z, approx[0]))), 1e-12 * scale);
  const cand = [...approx].sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, nc);
  const starts = cand.map((z) => [z[0], Math.max(Math.abs(z[1]), spread / 2)]);
  for (const z of cand)
    for (let t = 1; t <= 6; t++) {
      const ang = (t * Math.PI) / 7;
      starts.push([z[0] + spread * Math.cos(ang), Math.abs(z[1]) + spread * Math.sin(ang)]);
    }
  const ups = [];
  const known = reals.map((x) => [x, 0]);
  for (const st of starts) {
    if (ups.length === nc / 2) break;
    let [z, r] = complexNewtonExact(p, st, 80, known);
    if (!Number.isFinite(r) || !Number.isFinite(z[0]) || !Number.isFinite(z[1])) continue;
    if (z[1] < 0) z = [z[0], -z[1]]; // konjugirana je tudi ničla
    if (!(z[1] > r)) continue; // ni dokazano nerealna (realne so že vse naštete)
    if (ups.some((u) => C.abs(C.sub(u.z, z)) <= u.err + r) || reals.some((x) => C.abs(C.sub([x, 0], z)) <= r)) continue;
    ups.push({ z, err: r });
    known.push(z, [z[0], -z[1]]);
  }
  if (ups.length !== nc / 2) return null;
  for (const u of ups) {
    const err = u.err <= 4e-16 * C.abs(u.z) ? 0 : u.err;
    out.push({ z: [u.z[0], -u.z[1]], cx: true, err }, { z: u.z, cx: true, err });
  }
  return out;
}

/**
 * Ničle polinoma z večkratnostmi: [{ re, im, m }], ali null, če preizkus ostanka ne uspe.
 * Racionalni koeficienti: točen razcep brez kvadratov (f = t₁·t₂²·t₃³…), racionalne ničle točno,
 * ostale numerično na enostavnih faktorjih tₖ (Durand–Kerner + Newton). Drugače numerično z združevanjem gruč.
 * Vsako ničlo na koncu preverimo v prvotnem polinomu: p^(m−1)(z) ≈ 0. Pari konjugiranih ničel so točno konjugirani.
 */
export function polyRootsMult(coeffs, exact = null, radii = null) {
  let c = coeffs.map(Number);
  let r = radii ? radii.slice(radii.length - c.length) : null;
  while (c.length && c[0] === 0) (c.shift(), r?.shift());
  if (!exact && !radii) while (c.length && Math.abs(c[0]) < 1e-14) c.shift();
  if (c.length < 2 || c.some((v) => !Number.isFinite(v))) return c.length < 2 ? [] : null;
  if (r && r[0] >= Math.abs(c[0])) return null; // vodilni koeficient je lahko 0: stopnja ni znana
  const found = []; // { z, m, exact }
  // radii: negotovost koeficientov (iz drevesa z iracionalnimi števili, scisolve ballPoly) – ne ugibamo ulomkov
  const P = exact || (radii ? null : intPoly(c));
  if (P) {
    // f_0 = f, f_k = gcd(f_{k−1}, f′_{k−1}); s_k = f_{k−1}/f_k (ničle s kratnostjo ≥ k); t_k = s_k/s_{k+1}
    const fs = [P];
    while (fs[fs.length - 1].length > 1) fs.push(gcdB(fs[fs.length - 1], derivB(fs[fs.length - 1])));
    const ss = [];
    for (let k = 1; k < fs.length; k++) ss.push(divB(fs[k - 1], fs[k]));
    ss.push([1n]);
    for (let k = 1; k < ss.length; k++) {
      const t = divB(ss[k - 1], ss[k]);
      if (t.length < 2) continue;
      solveSquarefree(t, k, found);
    }
  } else found.push(...mergeClusters(c, dkRoots(c), 0.05, r || undefined));
  const out = pairUp(found);
  if (!out) return null;
  // preizkus ostanka vsake ničle v prvotnem polinomu
  for (const r of out) {
    let d = c;
    for (let j = 1; j < r.m; j++) d = derivF(d);
    const z = [r.re, r.im];
    if (!(C.abs(hornerC(d, z)) <= 1e-8 * sizeAt(d, z))) return null; // tudi NaN (prevelik koeficient) ni ničla
  }
  if (out.reduce((s, r) => s + r.m, 0) !== c.length - 1) return null;
  return out.sort((x, y) => x.re - y.re || x.im - y.im);
}

/**
 * Kot polyRootsMult, a s točnimi racionalnimi koeficienti od najvišje potence [{ n, d }] (BigInt; iz cas.js exactPolyIn).
 * Vrne { roots, poly } (poly: koeficienti kot števila) ali null.
 */
export function polyRootsExact(qs) {
  if (!qs?.length) return null;
  const L = qs.reduce((l, q) => (l * q.d) / bGcd(l, q.d), 1n);
  const P = primB(qs.map((q) => (q.n * L) / q.d).reverse());
  if (P.length < 2) return { roots: [], poly: P.map(Number) };
  // koeficienti kot števila, deljeni z največjim (da ne preplavijo); ničle se s tem ne spremenijo
  const big = P.reduce((m, x) => (bAbs(x) > m ? bAbs(x) : m), 0n);
  const shift = big > 10n ** 300n ? 10n ** BigInt(String(big).length - 300) : 1n;
  const c = P.map((x) => Number(x / shift)).reverse();
  if (c.some((x) => !Number.isFinite(x)) || c[0] === 0) return null;
  const roots = polyRootsMult(c, P);
  if (!roots) return null;
  // iracionalna realna ničla oblike ±ᵏ√(p/q) (x³ = 2 → ∛2): potrdimo točno, da q·x^k − p deli polinom
  for (const r of roots) if (r.im === 0 && !r.exact) r.form = radicalForm(P, r.re);
  return { roots, poly: c };
}
function radicalForm(P, x) {
  for (let k = 2; k <= 6; k++) {
    const y = x ** k;
    const f = ratOf(y, 100000);
    if (!f) continue;
    if (k % 2 === 0 && x < 0) continue; // −√a: pri sodem k sta ±; obravnavamo spodaj z |x|
    const B = Array(k + 1).fill(0n);
    B[0] = -f.p;
    B[k] = f.q;
    if (zeroB(pdivB(P, primB(B))[1])) return { k, p: f.p, q: f.q, neg: false };
  }
  if (x < 0) {
    for (let k = 2; k <= 6; k += 2) {
      const f = ratOf((-x) ** k, 100000);
      if (!f) continue;
      const B = Array(k + 1).fill(0n);
      B[0] = -f.p;
      B[k] = f.q;
      if (zeroB(pdivB(P, primB(B))[1])) return { k, p: f.p, q: f.q, neg: true };
    }
  }
  return null;
}

// vzorec kratnosti celoštevilskega polinoma (BigInt, od najnižje): [[k, število ničel s kratnostjo k], …]
function multPattern(P) {
  const fs = [P];
  while (fs[fs.length - 1].length > 1) fs.push(gcdB(fs[fs.length - 1], derivB(fs[fs.length - 1])));
  const ss = [];
  for (let k = 1; k < fs.length; k++) ss.push(divB(fs[k - 1], fs[k]));
  ss.push([1n]);
  const out = [];
  for (let k = 1; k < ss.length; k++) {
    const d = divB(ss[k - 1], ss[k]).length - 1;
    if (d > 0) out.push([k, d]);
  }
  return out;
}

/**
 * Ničle polinoma s koeficienti v ℚ[π, e] (cas.js symbolPolyIn): terms[k] = [{ n, d, pi, e }], od najvišje potence.
 * Vzorec kratnosti dobimo točno: π in e nadomestimo z naključnimi ulomki (π je transcendentno, zato ima vzorec, ki ga
 * da skoraj vsaka vstavitev; slaba vstavitev lahko le doda sovpadanja, zato vzamemo vzorec z največ različnimi
 * ničlami od treh). Številske ničle pri pravem π nato razdelimo v gruče po tem vzorcu (AUDIT-044).
 * Vrne [{ re, im, m }] ali null.
 */
export function polyRootsSym(terms) {
  const n = terms.length - 1;
  if (n < 1) return null;
  // vstavitev π = a, e = b (ulomka) → celoštevilski polinom
  const special = (a, b) => {
    const coef = terms.map((ts) =>
      ts.reduce(
        (acc, t) => {
          const num = t.n * a[0] ** BigInt(t.pi) * b[0] ** BigInt(t.e);
          const den = t.d * a[1] ** BigInt(t.pi) * b[1] ** BigInt(t.e);
          return [acc[0] * den + num * acc[1], acc[1] * den];
        },
        [0n, 1n],
      ),
    );
    const L = coef.reduce((l, [, d]) => (l * d) / bGcd(l, d), 1n);
    return primB(coef.map(([p, q]) => (p * L) / q).reverse());
  };
  const tries = [
    [[314159n, 100003n], [271829n, 100019n]],
    [[1000003n, 318313n], [999983n, 367883n]],
    [[7919n, 2521n], [104729n, 38527n]],
  ];
  let pattern = null;
  for (const [a, b] of tries) {
    const P = special(a, b);
    if (P.length - 1 !== n) continue; // vodilni koeficient je pri tej vstavitvi 0
    const pt = multPattern(P);
    const distinct = pt.reduce((s, [, d]) => s + d, 0);
    if (!pattern || distinct > pattern.distinct) pattern = { pt, distinct };
  }
  if (!pattern) return null;
  // brez večkratnih ničel ne dodamo ničesar novega: ostane pot s kroglami (ta zaokrožene koeficiente, npr. 15 mest
  // iz SymPy, obravnava kot negotove in njihov par bližnjih ničel ne razglasi za kompleksen)
  if (pattern.pt.every(([k]) => k === 1)) return null;
  // koeficienti pri pravem π in e
  const PI = Math.PI;
  const E = Math.E;
  const c = terms.map((ts) => ts.reduce((s, t) => s + (Number(t.n) / Number(t.d)) * PI ** t.pi * E ** t.e, 0));
  if (!c[0] || c.some((x) => !Number.isFinite(x))) return null;
  let left = dkRoots(c).map((z) => newton(c, z));
  const P32 = special([314159265358979323846264338327950n, 10n ** 32n], [271828182845904523536028747135266n, 10n ** 32n]);
  const found = [];
  // od največje kratnosti navzdol: k ničel z najmanjšim razponom je ena k-kratna ničla
  for (const [k, cnt] of [...pattern.pt].sort((x, y) => y[0] - x[0])) {
    for (let t = 0; t < cnt; t++) {
      if (k === 1) break;
      let best = null;
      left.forEach((z, i) => {
        const near = left.map((w, j) => [C.abs(C.sub(w, z)), j]).sort((x, y) => x[0] - y[0]).slice(0, k);
        if (near.length === k && (!best || near[k - 1][0] < best.rad)) best = { rad: near[k - 1][0], idx: near.map(([, j]) => j) };
      });
      if (!best) return null;
      const g = best.idx.map((j) => left[j]);
      left = left.filter((_, j) => !best.idx.includes(j));
      let dm = c;
      for (let j = 1; j < k; j++) dm = derivF(dm);
      const cen = [g.reduce((s, z) => s + z[0], 0) / k, g.reduce((s, z) => s + z[1], 0) / k];
      found.push({ z: newton(dm, cen, 30), cen, m: k, sf: true });
    }
  }
  // realna večkratna ničla: njene gruče ne spremlja konjugirana gruča. Središče izboljšamo s točnim Newtonom na
  // p^(k−1) pri π, e na 32 mest (BigInt): ~1 ulp, ker so ničle gruče v double lahko netočne za 10⁻⁴
  for (const f of found) {
    const partner = found.some((o) => o !== f && o.m === f.m && C.abs(C.sub(o.cen, [f.cen[0], -f.cen[1]])) < Math.max(Math.abs(f.cen[1]), 1e-300) * 0.5);
    if (partner) continue;
    let D = P32;
    for (let j = 1; j < f.m; j++) D = derivB(D);
    const cands = [f.cen[0], f.z[0]].map((x0) => exactNewton(D, x0, 12));
    f.z = [cands.reduce((b, x) => (Math.abs(x - f.cen[0]) < Math.abs(b - f.cen[0]) ? x : b)), 0];
  }
  found.push(...left.map((z) => ({ z, m: 1, sf: true })));
  const out = pairUp(found);
  if (!out || out.reduce((s, r) => s + r.m, 0) !== n) return null;
  // preizkus: p^(m−1)(z) ≈ 0
  for (const r of out) {
    let d = c;
    for (let j = 1; j < r.m; j++) d = derivF(d);
    if (!(C.abs(hornerC(d, [r.re, r.im])) <= 1e-8 * sizeAt(d, [r.re, r.im]))) return null;
  }
  return out.sort((x, y) => x.re - y.re || x.im - y.im);
}

/** Ničle polinoma s koeficienti od najvišje potence. Vrne [[re, im], …], vsako tolikokrat, kolikor je kratna. */
export function polyRoots(coeffs) {
  let c = coeffs.map(Number);
  while (c.length && Math.abs(c[0]) < 1e-14) c.shift();
  if (c.length < 2) return [];
  if (c.length <= 3) return dkRoots(c); // stopnja 1 in 2: obrazca, kot prej
  const mult = polyRootsMult(c);
  const raw = mult ? mult.flatMap((r) => Array.from({ length: r.m }, () => [r.re, r.im])) : dkRoots(c);
  return raw
    .map((zi) => {
      const tol = 1e-9 * Math.max(1, C.abs(zi));
      const r = [zi[0], Math.abs(zi[1]) < tol ? 0 : zi[1]];
      const ri = Math.round(r[0]);
      if (Math.abs(r[0] - ri) < 1e-9) r[0] = ri;
      return r;
    })
    .sort((x, y) => x[0] - y[0] || x[1] - y[1]);
}

// ---------- matrike ----------

/** Matrika iz besedila: vrstice v novih vrsticah, števila ločena s presledki ali »;«. */
export function readMatrix(text) {
  const rows = String(text ?? "")
    .trim()
    .split(/\n+/)
    .map((r) => r.trim())
    .filter(Boolean)
    .map((r) => r.split(/[\s;]+|,(?=\s)/).filter(Boolean).map(readNumber));
  if (!rows.length) return null;
  const w = rows[0].length;
  if (rows.some((r) => r.length !== w || r.some((v) => !Number.isFinite(v)))) return null;
  return rows;
}

/**
 * Lastne vrednosti realne kvadratne matrike: Hessenbergova oblika in QR z dvojnim premikom (Numerical Recipes
 * elmhes + hqr). Stabilno tudi pri večkratnih lastnih vrednostih (npr. I), kjer ničle karakterističnega polinoma niso.
 * Vrne [[re, im], …] ali null, če QR ne konvergira.
 */
function hqrEigen(A0) {
  const n = A0.length;
  const a = [null, ...A0.map((r) => [0, ...r.map(Number)])]; // indeksi od 1
  const sign = (x, y) => (y >= 0 ? Math.abs(x) : -Math.abs(x));
  for (let m = 2; m < n; m++) {
    let x = 0;
    let i = m;
    for (let j = m; j <= n; j++)
      if (Math.abs(a[j][m - 1]) > Math.abs(x)) {
        x = a[j][m - 1];
        i = j;
      }
    if (i !== m) {
      for (let j = m - 1; j <= n; j++) [a[i][j], a[m][j]] = [a[m][j], a[i][j]];
      for (let j = 1; j <= n; j++) [a[j][i], a[j][m]] = [a[j][m], a[j][i]];
    }
    if (x)
      for (i = m + 1; i <= n; i++) {
        let y = a[i][m - 1];
        if (y) {
          y /= x;
          a[i][m - 1] = y;
          for (let j = m; j <= n; j++) a[i][j] -= y * a[m][j];
          for (let j = 1; j <= n; j++) a[j][m] += y * a[j][i];
        }
      }
  }
  for (let i = 3; i <= n; i++) for (let j = 1; j < i - 1; j++) a[i][j] = 0;
  const wr = [];
  const wi = [];
  let anorm = 0;
  for (let i = 1; i <= n; i++) for (let j = Math.max(i - 1, 1); j <= n; j++) anorm += Math.abs(a[i][j]);
  let nn = n;
  let t = 0;
  let p, q, r, s, w, x, y, z, l, m;
  while (nn >= 1) {
    let its = 0;
    do {
      for (l = nn; l >= 2; l--) {
        s = Math.abs(a[l - 1][l - 1]) + Math.abs(a[l][l]);
        if (s === 0) s = anorm;
        if (Math.abs(a[l][l - 1]) + s === s) {
          a[l][l - 1] = 0;
          break;
        }
      }
      x = a[nn][nn];
      if (l === nn) {
        wr[nn] = x + t;
        wi[nn--] = 0;
      } else {
        y = a[nn - 1][nn - 1];
        w = a[nn][nn - 1] * a[nn - 1][nn];
        if (l === nn - 1) {
          p = 0.5 * (y - x);
          q = p * p + w;
          z = Math.sqrt(Math.abs(q));
          x += t;
          if (q >= 0) {
            z = p + sign(z, p);
            wr[nn - 1] = wr[nn] = x + z;
            if (z) wr[nn] = x - w / z;
            wi[nn - 1] = wi[nn] = 0;
          } else {
            wr[nn - 1] = wr[nn] = x + p;
            wi[nn - 1] = -(wi[nn] = z);
          }
          nn -= 2;
        } else {
          if (its === 60) return null;
          if (its === 10 || its === 20) {
            t += x;
            for (let i = 1; i <= nn; i++) a[i][i] -= x;
            s = Math.abs(a[nn][nn - 1]) + Math.abs(a[nn - 1][nn - 2]);
            y = x = 0.75 * s;
            w = -0.4375 * s * s;
          }
          ++its;
          for (m = nn - 2; m >= l; m--) {
            z = a[m][m];
            r = x - z;
            s = y - z;
            p = (r * s - w) / a[m + 1][m] + a[m][m + 1];
            q = a[m + 1][m + 1] - z - r - s;
            r = a[m + 2][m + 1];
            s = Math.abs(p) + Math.abs(q) + Math.abs(r);
            p /= s;
            q /= s;
            r /= s;
            if (m === l) break;
            const u = Math.abs(a[m][m - 1]) * (Math.abs(q) + Math.abs(r));
            const v = Math.abs(p) * (Math.abs(a[m - 1][m - 1]) + Math.abs(z) + Math.abs(a[m + 1][m + 1]));
            if (u + v === v) break;
          }
          for (let i = m + 2; i <= nn; i++) {
            a[i][i - 2] = 0;
            if (i !== m + 2) a[i][i - 3] = 0;
          }
          for (let k = m; k <= nn - 1; k++) {
            if (k !== m) {
              p = a[k][k - 1];
              q = a[k + 1][k - 1];
              r = 0;
              if (k !== nn - 1) r = a[k + 2][k - 1];
              if ((x = Math.abs(p) + Math.abs(q) + Math.abs(r)) !== 0) {
                p /= x;
                q /= x;
                r /= x;
              }
            }
            if ((s = sign(Math.sqrt(p * p + q * q + r * r), p)) !== 0) {
              if (k === m) {
                if (l !== m) a[k][k - 1] = -a[k][k - 1];
              } else a[k][k - 1] = -s * x;
              p += s;
              x = p / s;
              y = q / s;
              z = r / s;
              q /= p;
              r /= p;
              for (let j = k; j <= nn; j++) {
                p = a[k][j] + q * a[k + 1][j];
                if (k !== nn - 1) {
                  p += r * a[k + 2][j];
                  a[k + 2][j] -= p * z;
                }
                a[k + 1][j] -= p * y;
                a[k][j] -= p * x;
              }
              const mmin = nn < k + 3 ? nn : k + 3;
              for (let i = l; i <= mmin; i++) {
                p = x * a[i][k] + y * a[i][k + 1];
                if (k !== nn - 1) {
                  p += z * a[i][k + 2];
                  a[i][k + 2] -= p * r;
                }
                a[i][k + 1] -= p * q;
                a[i][k] -= p;
              }
            }
          }
        }
      }
    } while (l < nn - 1);
  }
  const out = wr.slice(1).map((re, i) => [re, wi[i + 1]]);
  return out.every(([u, v]) => Number.isFinite(u) && Number.isFinite(v)) ? out : null;
}

const clean = (v) => (Math.abs(v) < 1e-12 ? 0 : Math.abs(v - Math.round(v)) < 1e-10 ? Math.round(v) : v);
const cleanM = (M) => M.map((r) => r.map(clean));

export const M = {
  /** Sled (vsota diagonale). */
  trace: (A) => (A.length === A[0].length ? A.reduce((s, r, i) => s + r[i], 0) : null),
  /** Karakteristični polinom det(λI − A) po Faddejev–LeVerrierju: koeficienti od λⁿ navzdol. */
  charPoly(A) {
    const n = A.length;
    if (n !== A[0].length || n > 10) return null;
    let Mk = A.map((r) => r.map(() => 0)); // M0 = 0
    const c = [1];
    for (let k = 1; k <= n; k++) {
      // Mk = A·M(k−1) + c(k−1)·I, c(k) = −tr(A·Mk)/k
      const AM = A.map((r) => Mk[0].map((_, j) => r.reduce((s, v, m) => s + v * Mk[m][j], 0)));
      Mk = AM.map((r, i) => r.map((v, j) => v + (i === j ? c[k - 1] : 0)));
      const AMk = A.map((r) => Mk[0].map((_, j) => r.reduce((s, v, m) => s + v * Mk[m][j], 0)));
      c.push(-AMk.reduce((s, r, i) => s + r[i], 0) / k);
    }
    return c.map(clean);
  },
  /** Lastne vrednosti (ničle karakterističnega polinoma, računane s QR), [re, im] urejene po realnem delu. */
  eigen(A) {
    if (A.length !== A[0].length || A.length > 10) return null;
    const ev = hqrEigen(A) ?? polyRoots(M.charPoly(A));
    return ev
      .map(([re, im]) => [clean(re), Math.abs(im) < 1e-9 * Math.max(1, Math.abs(re)) ? 0 : clean(im)])
      .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  },
  add: (A, B) => (A.length === B.length && A[0].length === B[0].length ? A.map((r, i) => r.map((v, j) => v + B[i][j])) : null),
  sub: (A, B) => (A.length === B.length && A[0].length === B[0].length ? A.map((r, i) => r.map((v, j) => v - B[i][j])) : null),
  mul: (A, B) => (A[0].length === B.length ? cleanM(A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)))) : null),
  scale: (A, k) => A.map((r) => r.map((v) => v * k)),
  /** Enotska matrika I_n (enice na diagonali). */
  identity: (n) => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))),
  /** A^n za celo n (A^0 = I, negativni n prek inverza); null, če A ni kvadratna ali nima inverza. */
  pow(A, n) {
    if (A.length !== A[0].length || !Number.isInteger(n) || Math.abs(n) > 1e6) return null;
    let B = n < 0 ? M.inverse(A) : A;
    if (!B) return null;
    let k = Math.abs(n);
    let R = M.identity(A.length);
    while (k > 0) {
      if (k & 1) R = M.mul(R, B);
      B = M.mul(B, B);
      k >>= 1;
    }
    return R;
  },
  transpose: (A) => A[0].map((_, j) => A.map((r) => r[j])),
  det(A) {
    const n = A.length;
    if (n !== A[0].length) return null;
    const a = A.map((r) => [...r]);
    let d = 1;
    for (let i = 0; i < n; i++) {
      let p = i;
      for (let r = i + 1; r < n; r++) if (Math.abs(a[r][i]) > Math.abs(a[p][i])) p = r;
      if (Math.abs(a[p][i]) < 1e-14) return 0;
      if (p !== i) {
        [a[p], a[i]] = [a[i], a[p]];
        d = -d;
      }
      d *= a[i][i];
      for (let r = i + 1; r < n; r++) {
        const f = a[r][i] / a[i][i];
        for (let c = i; c < n; c++) a[r][c] -= f * a[i][c];
      }
    }
    return clean(d);
  },
  /** Reducirana stopničasta oblika (Gauss–Jordan) in rang. */
  rref(A) {
    const a = A.map((r) => [...r]);
    const rows = a.length;
    const cols = a[0].length;
    let lead = 0;
    let rank = 0;
    for (let r = 0; r < rows && lead < cols; r++, lead++) {
      let p = r;
      for (let i = r + 1; i < rows; i++) if (Math.abs(a[i][lead]) > Math.abs(a[p][lead])) p = i;
      if (Math.abs(a[p][lead]) < 1e-12) {
        r--;
        continue;
      }
      [a[p], a[r]] = [a[r], a[p]];
      const lv = a[r][lead];
      a[r] = a[r].map((v) => v / lv);
      for (let i = 0; i < rows; i++) {
        if (i === r) continue;
        const f = a[i][lead];
        a[i] = a[i].map((v, j) => v - f * a[r][j]);
      }
      rank++;
    }
    return { R: cleanM(a), rank };
  },
  inverse(A) {
    const n = A.length;
    if (n !== A[0].length) return null;
    const aug = A.map((r, i) => [...r, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
    const { R, rank } = M.rref(aug);
    if (rank < n || R.slice(0, n).some((r, i) => Math.abs(r[i] - 1) > 1e-9)) return null;
    return cleanM(R.map((r) => r.slice(n)));
  },
  /** Reši A·x = b (b je stolpec ali seznam). Vrne { x } ali { none } ali { many }. */
  solve(A, b) {
    const n = A[0].length;
    const aug = A.map((r, i) => [...r, Array.isArray(b[i]) ? b[i][0] : b[i]]);
    const { R, rank } = M.rref(aug);
    const rankA = M.rref(A).rank;
    if (rankA < rank) return { none: true };
    if (rankA < n) return { many: true, R };
    return { x: R.slice(0, n).map((r) => clean(r[n])) };
  },
};

// ---------- razmerje ----------

/**
 * Razmerje a : b = c : d z eno neznanko (Casio »Razmerje«): vals so štiri števila, neznanka je NaN.
 * Vrne { i, value } (i = mesto neznanke 0–3) ali { error: "count" | "zero" }.
 * Velja a·d = b·c; za neznanko delimo s številom na nasprotnem mestu.
 */
export function solveRatio(vals) {
  const miss = vals.map((v, i) => (Number.isFinite(v) ? -1 : i)).filter((i) => i >= 0);
  if (miss.length !== 1) return { error: "count" };
  const i = miss[0];
  const [a, b, c, d] = vals;
  const [num, den] = [
    [b * c, d],
    [a * d, c],
    [a * d, b],
    [b * c, a],
  ][i];
  if (den === 0) return { error: "zero" };
  const v = num / den;
  return { i, value: Math.abs(v) < 1e-6 ? v : clean(v) }; // clean bi 2 : 3 = 10⁻¹³ : x zaokrožil na 0
}

// ---------- številski sistemi ----------

const DIG = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
/** Celo število v osnovi from → objekt z zapisi v 2, 8, 10, 16 (in v osnovi »to«, če je podana). */
export function convertBase(text, from, to) {
  const s = String(text ?? "").trim().toUpperCase().replace(/\s|_/g, "");
  if (!s || from < 2 || from > 36) return null;
  const neg = s.startsWith("-");
  const body = neg ? s.slice(1) : s;
  if (!body || [...body].some((ch) => DIG.indexOf(ch) < 0 || DIG.indexOf(ch) >= from)) return null;
  let v = 0n;
  for (const ch of body) v = v * BigInt(from) + BigInt(DIG.indexOf(ch));
  if (neg) v = -v;
  const out = (b) => (v < 0n ? "-" : "") + (v < 0n ? -v : v).toString(b).toUpperCase();
  const res = { 2: out(2), 8: out(8), 10: out(10), 16: out(16), value: v };
  if (to) res[to] = out(to);
  return res;
}

export const LOGIC_OPS = ["and", "or", "xor", "xnor", "not", "neg"];
/**
 * Logične operacije po bitih kot Casio (32-bitna cela števila, dvojiški komplement): a, b sta BigInt.
 * Vrne { 2, 8, 10, 16 } (BIN/OCT/HEX kot 32-bitni vzorec, DEC s predznakom) ali null zunaj obsega.
 */
export function logic32(a, b, op) {
  const lim = 2n ** 31n;
  const inR = (x) => typeof x === "bigint" && x >= -lim && x < lim;
  const unary = op === "not" || op === "neg";
  if (!inR(a) || (!unary && !inR(b)) || !LOGIC_OPS.includes(op)) return null;
  const r = BigInt.asIntN(32, { and: () => a & b, or: () => a | b, xor: () => a ^ b, xnor: () => ~(a ^ b), not: () => ~a, neg: () => -a }[op]());
  const u = BigInt.asUintN(32, r);
  return { 2: u.toString(2), 8: u.toString(8), 10: r.toString(), 16: u.toString(16).toUpperCase() };
}

// ---------- molska masa ----------

/**
 * Razčleni kemijsko formulo (H2SO4, Ca(OH)2, CuSO4·5H2O, [Fe(CN)6]3-) v število atomov po elementih.
 * masses: { simbol: Ar }. Vrne { counts: Map, M } ali { error, at }.
 */
export function molarMass(formula, masses) {
  const s = String(formula ?? "")
    .replace(/[₀-₉]/g, (c) => String(c.charCodeAt(0) - 0x2080))
    .replace(/\s+/g, "")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+$/, "") // naboj iona na koncu
    .replace(/\^\d*[+-]$|[+-]$/, ""); // naboj: SO4^2- ali NH4+
  if (!s) return null;
  const parts = s.split(/[·*•.]/);
  const total = new Map();
  for (let part of parts) {
    let k = 1;
    const lead = /^(\d+)(?=[A-Z([])/.exec(part);
    if (lead) {
      k = Number(lead[1]);
      part = part.slice(lead[1].length);
    }
    let i = 0;
    const group = () => {
      const m = new Map();
      while (i < part.length) {
        const ch = part[i];
        if (ch === "(" || ch === "[") {
          i++;
          const inner = group();
          if (part[i] !== ")" && part[i] !== "]") throw { at: i };
          i++;
          const n = num();
          for (const [e, c] of inner) m.set(e, (m.get(e) || 0) + c * n);
        } else if (ch === ")" || ch === "]") return m;
        else {
          const el = /^[A-Z][a-z]?/.exec(part.slice(i));
          if (!el || !(el[0] in masses)) {
            // npr. »Co« proti »C« + »O«: daljši simbol ima prednost, če obstaja
            throw { at: i, sym: el?.[0] || ch };
          }
          i += el[0].length;
          const n = num();
          m.set(el[0], (m.get(el[0]) || 0) + n);
        }
      }
      return m;
    };
    const num = () => {
      const d = /^\d+/.exec(part.slice(i));
      if (!d) return 1;
      i += d[0].length;
      return Number(d[0]);
    };
    try {
      const g = group();
      if (i < part.length) return { error: "syntax", at: i };
      for (const [e, c] of g) total.set(e, (total.get(e) || 0) + c * k);
    } catch (e) {
      return { error: e.sym ? "element" : "syntax", sym: e.sym, at: e.at };
    }
  }
  if (!total.size) return null;
  let Mm = 0;
  for (const [e, c] of total) Mm += c * masses[e];
  return { counts: total, M: Mm };
}
