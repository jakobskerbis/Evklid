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

/** Ničle polinoma s koeficienti od najvišje potence. Vrne [[re, im], …] (Durand–Kerner, nato zaokrožitev). */
export function polyRoots(coeffs) {
  let c = coeffs.map(Number);
  while (c.length && Math.abs(c[0]) < 1e-14) c.shift();
  const n = c.length - 1;
  if (n < 1) return [];
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
  // Newtonov popravek in čiščenje skoraj realnih ničel
  const da = a.slice(0, -1).map((ai, k) => [ai[0] * (n - k), 0]);
  const dp = (x) => da.reduce((s, ai) => C.add(C.mul(s, x), ai), [0, 0]);
  z = z.map((zi) => {
    for (let k = 0; k < 3; k++) {
      const d = dp(zi);
      if (C.abs(d) > 1e-300) zi = C.sub(zi, C.div(p(zi), d));
    }
    const tol = 1e-9 * Math.max(1, C.abs(zi));
    const r = [zi[0], Math.abs(zi[1]) < tol ? 0 : zi[1]];
    const ri = Math.round(r[0]);
    if (Math.abs(r[0] - ri) < 1e-9) r[0] = ri;
    return r;
  });
  return z.sort((x, y) => x[0] - y[0] || x[1] - y[1]);
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
