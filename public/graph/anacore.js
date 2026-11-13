// Analiza, vektorji, diferencialne enačbe in merske napake. Brez DOM (preizkusi v test/tools.test.js).
import { parse, compile, diff, simplify, toTex, freeVars, integrate, normalize } from "./math.js";

const real = (v) => (typeof v === "number" ? v : Array.isArray(v) ? NaN : v && typeof v.re === "number" ? (Math.abs(v.im) < 1e-12 ? v.re : NaN) : NaN);

/** Prevede izraz v realno funkcijo spremenljivk. ctx: { deg }. Vrne { node, f(vars), vars: Set } ali vrže MathError. */
export function fn(text, ctx = {}) {
  const src = String(text ?? "").replace(/y''/g, "y_{dd}").replace(/y'/g, "y_{d}");
  const node = parse(src);
  const c = compile(node, ctx);
  return {
    node,
    vars: freeVars(node),
    f: (vars) => {
      try {
        return real(c(vars));
      } catch {
        return NaN;
      }
    },
  };
}

/** Odvod po spremenljivki v (poenostavljen). */
export function derivative(node, v = "x", ctx = {}) {
  return simplify(diff(node, v, ctx));
}
export { toTex, integrate, normalize };

/**
 * Realne ničle funkcije na [a, b]: menjave predznaka (bisekcija) in dotikališča (lokalni minimumi |f|).
 * Vrne razvrščen seznam (največ 50).
 */
export function roots(f, a, b, n = 4000) {
  const out = [];
  const h = (b - a) / n;
  let x0 = a;
  let y0 = f(a);
  const add = (x) => {
    if (out.some((r) => Math.abs(r - x) < 1e-7 * Math.max(1, Math.abs(x)))) return;
    out.push(Math.abs(x) < 1e-12 ? 0 : x);
  };
  if (y0 === 0) add(a);
  let ym = NaN;
  for (let i = 1; i <= n; i++) {
    const x1 = a + i * h;
    const y1 = f(x1);
    if (y1 === 0) add(x1);
    else if (Number.isFinite(y0) && Number.isFinite(y1) && y0 * y1 < 0) {
      // bisekcija; skok (npr. 1/x) ni ničla
      let lo = x0;
      let hi = x1;
      let flo = y0;
      for (let k = 0; k < 200 && hi - lo > 1e-15 * Math.max(1, Math.abs(lo)); k++) {
        const m = (lo + hi) / 2;
        const fm = f(m);
        if (!Number.isFinite(fm)) break;
        if (fm === 0) {
          lo = hi = m;
          break;
        }
        if (flo * fm < 0) hi = m;
        else {
          lo = m;
          flo = fm;
        }
      }
      const r = (lo + hi) / 2;
      const scale = Math.max(Math.abs(y0), Math.abs(y1), 1e-300);
      if (Math.abs(f(r)) < 1e-6 * Math.max(1, scale)) add(r);
    } else if (Number.isFinite(ym) && Number.isFinite(y0) && Number.isFinite(y1) && Math.abs(y0) < Math.abs(ym) && Math.abs(y0) <= Math.abs(y1) && Math.sign(ym) === Math.sign(y0) && Math.sign(y0) === Math.sign(y1)) {
      // lokalni minimum |f| ob istem predznaku: morda dotikališče (dvojna ničla)
      let lo = x0 - h;
      let hi = x1;
      const g = (x) => Math.abs(f(x));
      for (let k = 0; k < 200; k++) {
        const m1 = lo + (hi - lo) / 3;
        const m2 = hi - (hi - lo) / 3;
        if (g(m1) < g(m2)) hi = m2;
        else lo = m1;
      }
      const r = (lo + hi) / 2;
      if (g(r) < 1e-10) add(r);
    }
    ym = y0;
    x0 = x1;
    y0 = y1;
    if (out.length >= 50) break;
  }
  // zaokrožimo skoraj cela števila
  return out.map((r) => (Math.abs(r - Math.round(r)) < 1e-9 ? Math.round(r) : r)).sort((p, q) => p - q);
}

/** Limita f v točki c (side: -1 levo, 1 desno) ali v ±∞ (c = ±Infinity). Vrne število, ±Infinity ali NaN (ne obstaja). */
export function limit(f, c, side = 1) {
  const pts = [];
  for (let k = 3; k <= 10; k++) {
    const x = Number.isFinite(c) ? c + side * 10 ** -k * Math.max(1, Math.abs(c)) : Math.sign(c) * 10 ** (k - 3); // do 10^7: dlje zaokrožitvena napaka prevlada
    pts.push(f(x));
  }
  const tail = pts.slice(-5);
  if (tail.some((v) => Number.isNaN(v))) return NaN;
  const last = tail[tail.length - 1];
  const near3 = tail.slice(-3);
  const spread = Math.max(...near3) - Math.min(...near3);
  if (Number.isFinite(spread) && spread <= 1e-4 * Math.max(1, Math.abs(last))) {
    // Richardsonova ekstrapolacija (korak se zmanjša 10-krat, napaka ~ h)
    const prev = tail[tail.length - 2];
    const L = last + (last - prev) / 9;
    return Math.abs(L - Math.round(L)) < 1e-6 ? Math.round(L) : L;
  }
  // razhajanje: monotono in razlike se ne manjšajo (1/x, ln x)
  const d = tail.slice(1).map((v, i) => v - tail[i]);
  const up = d.every((x) => x > 0);
  const down = d.every((x) => x < 0);
  const steady = Math.abs(d[d.length - 1]) >= 0.5 * Math.abs(d[0]);
  if ((up || down) && (steady || Math.abs(last) > 1e8)) return up ? Infinity : -Infinity;
  return NaN; // niha ali ne konvergira
}

/** Taylorjev polinom stopnje n v x0: koeficienti [c0, c1, …] (c_k = f^(k)(x0)/k!). */
export function taylor(node, x0, n, v = "x", ctx = {}) {
  const coef = [];
  let d = node;
  let fact = 1;
  for (let k = 0; k <= n; k++) {
    if (k > 0) {
      d = simplify(diff(d, v, ctx));
      fact *= k;
    }
    coef.push(real(compile(d, ctx)({ [v]: x0 })) / fact);
  }
  return coef;
}

// ---------- vektorji ----------

export const V = {
  read(text) {
    const s = String(text ?? "").replace(/[()[\]⟨⟩]/g, " ").trim();
    if (!s) return null;
    // »1, 2, 3« ali »1; 2; 3« ali »1 2 3«; »1,5« je decimalno, če ni presledka
    const parts = (s.includes(";") ? s.split(";") : /,\s/.test(s) || !/\d,\d/.test(s) ? s.split(/[,\s]+/) : s.split(/\s+/)).map((p) => p.trim()).filter(Boolean);
    const v = parts.map((p) => Number(p.replace(/[−–]/g, "-").replace(",", ".")));
    return v.length >= 2 && v.length <= 3 && v.every(Number.isFinite) ? v : null;
  },
  pad3: (a) => (a.length === 2 ? [...a, 0] : a),
  add: (a, b) => a.map((x, i) => x + b[i]),
  sub: (a, b) => a.map((x, i) => x - b[i]),
  scale: (a, k) => a.map((x) => x * k),
  dot: (a, b) => a.reduce((s, x, i) => s + x * b[i], 0),
  norm: (a) => Math.hypot(...a),
  cross(a, b) {
    const [a1, a2, a3] = V.pad3(a);
    const [b1, b2, b3] = V.pad3(b);
    return [a2 * b3 - a3 * b2, a3 * b1 - a1 * b3, a1 * b2 - a2 * b1];
  },
  angle(a, b) {
    const c = V.dot(a, b) / (V.norm(a) * V.norm(b));
    return Math.acos(Math.max(-1, Math.min(1, c)));
  },
  proj(a, b) {
    const k = V.dot(a, b) / V.dot(b, b);
    return V.scale(b, k);
  },
  triple: (a, b, c) => V.dot(V.pad3(a), V.cross(b, c)),
};

// ---------- diferencialne enačbe ----------

/**
 * Numerično reši y' = f(x, y) ali y'' = f(x, y, y') od x0 do x1 v N korakih.
 * order 1: f({x, y}); order 2: f({x, y, y_d}). method: "rk4" | "euler".
 * Vrne [{ x, y, yd? }, …] (N + 1 točk).
 */
export function odeSolve(f, { order = 1, x0, y0, yd0 = 0, x1, N = 100, method = "rk4" }) {
  const h = (x1 - x0) / N;
  // stanje kot vektor: [y] ali [y, y']
  const F = order === 1 ? (x, s) => [f({ x, y: s[0] })] : (x, s) => [s[1], f({ x, y: s[0], y_d: s[1] })];
  let s = order === 1 ? [y0] : [y0, yd0];
  const out = [{ x: x0, y: s[0], yd: s[1] }];
  const add = (a, b, k) => a.map((v, i) => v + k * b[i]);
  for (let i = 0; i < N; i++) {
    const x = x0 + i * h;
    if (method === "euler") s = add(s, F(x, s), h);
    else {
      const k1 = F(x, s);
      const k2 = F(x + h / 2, add(s, k1, h / 2));
      const k3 = F(x + h / 2, add(s, k2, h / 2));
      const k4 = F(x + h, add(s, k3, h));
      s = s.map((v, j) => v + (h / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]));
    }
    if (!s.every(Number.isFinite)) break;
    out.push({ x: x0 + (i + 1) * h, y: s[0], yd: s[1] });
  }
  return out;
}

// ---------- merske napake ----------

/** Ponovljene meritve: povprečje, standardni odklon, standardna napaka povprečja, največji odmik. */
export function measurement(values) {
  const xs = values.filter(Number.isFinite);
  const n = xs.length;
  if (n < 2) return null;
  const mean = xs.reduce((a, b) => a + b, 0) / n;
  const s = Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1));
  return { n, mean, s, sem: s / Math.sqrt(n), maxDev: Math.max(...xs.map((x) => Math.abs(x - mean))) };
}

/**
 * Prenos napak: f(x1, x2, …) z vrednostmi in absolutnimi napakami.
 * Vrne { value, max (vsota |∂f/∂xi|·Δxi), quad (koren vsote kvadratov), parts: [{ v, d, contrib }] }.
 */
export function propagate(node, values, errors, ctx = {}) {
  const vars = Object.keys(values);
  const f = compile(node, ctx);
  const value = real(f(values));
  const parts = vars.map((v) => {
    const d = real(compile(simplify(diff(node, v, ctx)), ctx)(values));
    return { v, d, contrib: Math.abs(d) * (errors[v] || 0) };
  });
  const max = parts.reduce((a, p) => a + p.contrib, 0);
  const quad = Math.sqrt(parts.reduce((a, p) => a + p.contrib ** 2, 0));
  return { value, max, quad, parts };
}

/** Zaokroži rezultat meritve: napaka na 1 (ali 2, če se začne z 1) veljavno mesto, vrednost na isto decimalno mesto. */
export function roundMeasurement(x, dx) {
  if (!(dx > 0) || !Number.isFinite(x)) return null;
  const e = Math.floor(Math.log10(dx));
  const lead = dx / 10 ** e;
  const digits = lead < 2 ? 2 : 1;
  const p = e - digits + 1;
  const r = (v) => Math.round(v / 10 ** p) * 10 ** p;
  const dec = Math.max(0, -p);
  return { x: Number(r(x).toFixed(dec)), dx: Number(r(dx).toFixed(dec)), dec };
}
