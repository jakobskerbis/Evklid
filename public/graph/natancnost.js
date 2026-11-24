// Račun z večjo natančnostjo (AUDIT-049). Plavajoča vejica ima ~16 mest: √(10¹⁶ + 1) − 10⁸ je v njej 0
// (pravilno ≈ 5·10⁻⁹), 1 − cos(10⁻⁸) je 0 (≈ 5·10⁻¹⁷), ln(e¹⁰⁰⁰) je ∞ (1000). Tu isto drevo izračunamo z ulomki
// BigInt: +, −, ·, : in cele potence točno, koreni, ln, exp, sin, cos … na P bitov z oceno napake. Rezultat velja,
// če se ujema pri dveh natančnostih; drevo z delom, ki ga tu ni (arcsin, vsote, integrali, lastne funkcije …),
// vrne null in ostane navadni izračun. Brez DOM; uporablja ga scicore.evaluate.

class Unsupported extends Error {}
const no = () => {
  throw new Unsupported();
};

// ---------- števila ----------
// x = { n, d, ex, E }: vrednost n/d (d > 0); ex = točna; E = log2 zgornje meje absolutne napake (−∞ pri točni).
// Približna vrednost, ki ni večja od svoje napake, je v resnici morda 0 (sin π, √2² − 2): isZero.
const abs = (a) => (a < 0n ? -a : a);
const bits = (a) => (a === 0n ? 0 : abs(a).toString(2).length);
const gcd = (a, b) => {
  a = abs(a);
  b = abs(b);
  // velika števila ((1/3)^40000 + (1/7)^40000): Evklid je počasen, zato časovna meja
  for (let i = 1; b; i++) {
    [a, b] = [b, a % b];
    if ((i & 255) === 0) tick();
  }
  return a;
};
const lg = (x) => (x.n === 0n ? -Infinity : bits(x.n) - bits(x.d)); // log2 |x| na ±1
let P = 256;
let deadline = 0;
const tick = () => {
  if (Date.now() > deadline) no();
};
const MAXBITS = 200000; // ~10^60000: večjih števil ne računamo

function mk(n, d, ex, E = -Infinity) {
  if (d < 0n) [n, d] = [-n, -d];
  if (d === 0n) no();
  if (ex) {
    const g = gcd(n, d);
    if (g > 1n) [n, d] = [n / g, d / g];
  }
  if (bits(n) > MAXBITS || bits(d) > MAXBITS) no();
  return ex ? { n, d, ex: true, E: -Infinity } : round({ n, d, ex: false, E });
}
// na P bitov; napaka zaokrožitve 2^(lg − P)
function round(x) {
  if (x.n === 0n) return { n: 0n, d: 1n, ex: false, E: x.E };
  const k = P - lg(x) + 2;
  let n;
  let d = 1n;
  if (k >= 0) {
    n = (x.n << BigInt(k)) / x.d;
    d = 1n << BigInt(k);
  } else n = (x.n / (x.d << BigInt(-k))) << BigInt(-k);
  return { n, d, ex: false, E: Math.max(x.E, lg(x) - P) };
}
const int = (v) => ({ n: BigInt(v), d: 1n, ex: true, E: -Infinity });
const ONE = () => int(1);
const ex2 = (a, b) => a.ex && b.ex;
const add = (a, b) => mk(a.n * b.d + b.n * a.d, a.d * b.d, ex2(a, b), Math.max(a.E, b.E) + 1);
const neg = (a) => ({ ...a, n: -a.n });
const sub = (a, b) => add(a, neg(b));
const mul = (a, b) => mk(a.n * b.n, a.d * b.d, ex2(a, b), Math.max(a.E + lg(b), b.E + lg(a), a.E + b.E) + 1);
function div(a, b) {
  if (isZero(b)) no(); // deljenje z 0 ali s številom v šumu okoli 0 (tan 90°): navadni izračun pove »ni definirano«
  return mk(a.n * b.d, a.d * b.n, ex2(a, b), Math.max(a.E - lg(b), b.E + lg(a) - 2 * lg(b)) + 2);
}
const isZero = (x) => x.n === 0n || (!x.ex && lg(x) < x.E + 8);
const sign = (x) => (isZero(x) ? 0 : x.n < 0n ? -1 : 1);
const isInt = (x) => x.ex && x.d === 1n;
const scaled = (x, k) => (k >= 0 ? mk(x.n << BigInt(k), x.d, x.ex, x.E + k) : mk(x.n, x.d << BigInt(-k), x.ex, x.E + k));
const withE = (x, E) => (x.ex ? x : { ...x, E: Math.max(x.E, E) });

/** Število (double) → točen ulomek po zapisu, ki ga vidi učenec (0,1 = 1/10, ne binarni približek). */
export function fromNumber(v) {
  if (!Number.isFinite(v)) no();
  if (Number.isInteger(v) && Math.abs(v) <= Number.MAX_SAFE_INTEGER) return int(v);
  const m = /^(-?)(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/.exec(String(v));
  if (!m) no();
  const digits = BigInt(m[2] + (m[3] || ""));
  const e = Number(m[4] || 0) - (m[3] || "").length;
  if (Math.abs(e) > 400) no();
  const n = e >= 0 ? digits * 10n ** BigInt(e) : digits;
  const d = e >= 0 ? 1n : 10n ** BigInt(-e);
  return mk(m[1] ? -n : n, d, true);
}

/** Ulomek → double (do ~1 ulp). */
function toNumber(x) {
  if (x.n === 0n) return 0;
  const sh = 64 - lg(x);
  const q = sh >= 0 ? (x.n << BigInt(sh)) / x.d : x.n / (x.d << BigInt(-sh));
  let r = Number(q);
  let e = -sh;
  for (; e > 1000; e -= 1000) r *= 2 ** 1000;
  for (; e < -1000; e += 1000) r *= 2 ** -1000;
  return r * 2 ** e;
}

// ---------- koreni ----------
function iroot(n, q) {
  if (n < 2n) return n;
  const Q = BigInt(q);
  let x = 1n << BigInt(Math.ceil(bits(n) / q) + 1);
  for (;;) {
    const y = ((Q - 1n) * x + n / x ** (Q - 1n)) / Q;
    if (y >= x) return x;
    x = y;
  }
}
// q-ti koren (q celo ≥ 2) pozitivnega x: točen, če sta n in d popolni potenci
function rootPos(x, q) {
  if (x.ex) {
    const a = iroot(x.n, q);
    const b = iroot(x.d, q);
    if (a ** BigInt(q) === x.n && b ** BigInt(q) === x.d) return mk(a, b, true);
  }
  const k = Math.max(0, Math.ceil(P + 8 - lg(x) / q));
  const r = iroot((x.n << BigInt(q * k)) / x.d, q);
  const out = mk(r, 1n << BigInt(k), false, -Infinity);
  // napaka: (x^(1/q))′ = x^(1/q) / (q x)
  return withE(out, x.E + lg(out) - lg(x) + 1);
}
function root(x, q) {
  if (x.n === 0n) return x;
  if (isZero(x)) no(); // koren šuma okoli 0 ni zanesljiv
  if (x.n < 0n) {
    if (q % 2 === 1) return neg(rootPos(neg(x), q));
    no(); // sodi koren negativnega: navadni izračun pove »ni definirano«
  }
  return rootPos(x, q);
}

// ---------- konstante in vrste (cela števila v fiksni vejici z W biti; deljenje / se zaokroža proti 0) ----------
const cache = new Map();
const cached = (name, f) => {
  const key = `${name}:${P}`;
  if (!cache.has(key)) cache.set(key, f());
  return cache.get(key);
};
const fixed = (s, W, terms) => mk(s, 1n << W, false, -Number(W) + Math.log2(terms + 2));
// arctg(1/m) ali artanh(1/m) = Σ (±1)^k / ((2k+1) m^(2k+1))
function atanInv(m, hyper) {
  const W = BigInt(P + 20);
  const M = BigInt(m);
  const M2 = M * M;
  let t = (1n << W) / M;
  let s = t;
  let k = 1n;
  for (; t; k++) {
    tick();
    t /= M2;
    s += (!hyper && k % 2n ? -1n : 1n) * (t / (2n * k + 1n));
  }
  return fixed(s, W, Number(k));
}
const PI = () => cached("pi", () => sub(mul(int(16), atanInv(5)), mul(int(4), atanInv(239))));
const LN2 = () => cached("ln2", () => mul(int(2), atanInv(3, true)));
const LN10 = () => cached("ln10", () => ln(int(10)));

// Σ členov: člen_0 = first, člen_k = next(člen_{k−1}, k); x je v fiksni vejici xf (|x| < 1)
function series(x, first, next) {
  // fiksna vejica z P + 30 biti za majhnim x: sicer je sin(10⁻²⁰⁰) pri 256 in 512 bitih 0 (»zanesljiva« 0)
  const W = BigInt(P + 30 + (x.n === 0n ? 0 : Math.max(0, -lg(x))));
  const one = 1n << W;
  const xf = (x.n << W) / x.d;
  const mw = (a, b) => (a * b) / one;
  let t = first(one, xf);
  let s = t;
  let k = 1;
  for (; t; k++) {
    tick();
    t = next(t, xf, k, mw);
    s += t;
  }
  return fixed(s, W, k);
}

function exp(x) {
  if (x.n === 0n) return ONE();
  if (lg(x) > 40) no();
  // x = k·ln 2 + r, |r| ≤ ln 2 / 2; e^r = (e^(r/2^h))^(2^h)
  const k = Math.round(toNumber(x) / Math.LN2);
  if (Math.abs(k) > MAXBITS) no(); // e^(10⁸): sicer premik za 10⁸ bitov, preden mk zavrne prevelik rezultat
  const r = sub(x, mul(int(k), LN2()));
  const h = 12;
  let y = series(scaled(r, -h), (one) => one, (t, xf, i, mw) => mw(t, xf) / BigInt(i));
  for (let i = 0; i < h; i++) y = mul(y, y);
  const out = scaled({ ...y, E: -Infinity }, k);
  // napaka: e^x · (napaka x + napaka računa)
  return withE(out, Math.max(x.E, r.E, y.E - lg(y)) + lg(out) + 3);
}

function ln(x) {
  if (sign(x) <= 0) no();
  if (x.ex && x.n === x.d) return int(0);
  // x = m·2^k, m ∈ [0,75; 1,5): ln x = k ln 2 + 2 artanh((m − 1)/(m + 1))
  let kk = lg(x);
  let m = scaled({ ...x, E: -Infinity }, -kk);
  while (toNumber(m) >= 1.5) {
    m = scaled(m, -1);
    kk++;
  }
  while (toNumber(m) < 0.75) {
    m = scaled(m, 1);
    kk--;
  }
  const z = div(sub(m, ONE()), add(m, ONE()));
  const W = BigInt(P + 30 + (z.n === 0n ? 0 : Math.max(0, -lg(z)))); // ln(1 + 10⁻²⁰⁰) ni 0 (kot pri series)
  const one = 1n << W;
  const zf = (z.n << W) / z.d;
  const z2 = (zf * zf) / one;
  let p = zf;
  let s = zf;
  let j = 1n;
  for (; p; j++) {
    tick();
    p = (p * z2) / one;
    s += p / (2n * j + 1n);
  }
  const out = add(mul(int(kk), LN2()), fixed(2n * s, W, Number(j)));
  // napaka: (ln x)′ = 1/x
  return withE(out, Math.max(x.E - lg(x), z.E) + 2);
}

// sin in cos: r = x − q·2π (π z dodatnimi biti za velike x: sin(10²⁰) ni šum), r/8 v vrsto, trikrat dvojni kot
function sinCos(x) {
  if (lg(x) > 1000) no();
  const extra = Math.max(0, lg(x)) + 8;
  const P0 = P;
  let r;
  P = P0 + extra;
  try {
    const pi2 = mul(int(2), PI());
    const q = Math.round(toNumber(x) / (2 * Math.PI));
    r = sub({ ...x, E: -Infinity }, mul(int(q), pi2));
  } finally {
    P = P0;
  }
  r = round(r);
  const h = 3;
  const a = scaled(r, -h);
  let s = series(a, (one, xf) => xf, (t, xf, k, mw) => -mw(mw(t, xf), xf) / BigInt(2 * k * (2 * k + 1)));
  let c = series(a, (one) => one, (t, xf, k, mw) => -mw(mw(t, xf), xf) / BigInt((2 * k - 1) * 2 * k));
  for (let i = 0; i < h; i++) [s, c] = [mul(int(2), mul(s, c)), sub(ONE(), mul(int(2), mul(s, s)))];
  // napaka: |sin′|, |cos′| ≤ 1; napaka cos (≈ 2^−P) ne velja za sin (sin(10⁻²⁰⁰) ni šum okoli 0)
  const E = Math.max(x.E, r.E) + 2;
  return [withE(s, Math.max(E, s.E + 2)), withE(c, Math.max(E, c.E + 2))];
}

// ---------- drevo ----------
const ALIAS = { asin: "arcsin", tg: "tan", lg: "log", sqr: "sqrt" };
// kot v enoti »rad« | »deg« | »grad«; večkratnik 90° (100 gon) je točen (cos 90° = 0, tan 90° ne obstaja)
function trig(f, x, unit) {
  if (unit !== "rad" && x.ex) {
    const q = div(x, int(unit === "deg" ? 90 : 100));
    if (isInt(q)) {
      const i = Number(((q.n % 4n) + 4n) % 4n);
      const S = [0, 1, 0, -1][i];
      const C = [1, 0, -1, 0][i];
      if (f === "sin") return int(S);
      if (f === "cos") return int(C);
      if (C === 0) no();
      return int(S / C);
    }
  }
  if (x.n === 0n && x.ex) return f === "cos" ? ONE() : int(0);
  const rad = unit === "rad" ? x : mul(x, div(PI(), int(unit === "deg" ? 180 : 200)));
  const [s, c] = sinCos(rad);
  if (f === "sin") return s;
  if (f === "cos") return c;
  return div(s, c);
}

function powHP(a, b) {
  if (isInt(b)) {
    const e = b.n;
    if (e === 0n) return ONE();
    // točna osnova: velikost števca in imenovalca ((1 + 10⁻²⁰)^(10⁵) ima imenovalec 10^(2·10⁶))
    const size = a.ex ? Math.max(bits(a.n), bits(a.d)) : Math.max(1, Math.abs(lg(a)));
    if (abs(e) > 100000n || size * Number(abs(e)) > MAXBITS) no();
    if (a.n === 0n) {
      if (e < 0n) no();
      return a;
    }
    let r = ONE();
    let base = a;
    let k = abs(e);
    while (k) {
      tick();
      if (k & 1n) r = mul(r, base);
      k >>= 1n;
      if (k) base = mul(base, base);
    }
    return e < 0n ? div(ONE(), r) : r;
  }
  // racionalni eksponent p/q: koren (lihi koren negativnega je realen kot v math.js: (−8)^(1/3) = −2)
  // negativna osnova le z lihim imenovalcem do 15 kot pow v math.js: (−2)^(1/17) tam ni definirano
  if (b.ex && b.d <= 64n && (a.n >= 0n || b.d <= 15n)) return powHP(root(a, Number(b.d)), int(b.n));
  if (sign(a) <= 0) no();
  return exp(mul(b, ln(a)));
}

function fact(a) {
  if (!isInt(a) || a.n < 0n || a.n > 3000n) no();
  let r = 1n;
  for (let i = 2n; i <= a.n; i++) r *= i;
  return mk(r, 1n, true);
}
function comb(n, k, binom) {
  if (!isInt(n) || !isInt(k) || n.n < 0n || n.n > 100000n) no();
  if (k.n < 0n || k.n > n.n) return int(0);
  const kk = binom && k.n > n.n - k.n ? n.n - k.n : k.n;
  let r = 1n;
  for (let i = 1n; i <= kk; i++) {
    if ((i & 1023n) === 0n) tick();
    r = binom ? (r * (n.n - kk + i)) / i : r * (n.n - i + 1n);
  }
  return mk(r, 1n, true);
}

function ev(node, scope, ctx) {
  const c = (n) => ev(n, scope, ctx);
  switch (node.k) {
    case "num":
      return fromNumber(node.v);
    case "const":
      if (node.name === "pi" || node.name === "π") return PI();
      if (node.name === "tau" || node.name === "τ") return mul(int(2), PI());
      if (node.name === "e") return exp(ONE());
      return no();
    case "var": {
      // ° ′ ″ (scicore: G_deg, G_min, G_sec): v radianih π/180, π/10800, π/648000, v stopinjah 1, 1/60, 1/3600
      const per = { G_deg: 1, G_min: 60, G_sec: 3600 }[node.name];
      if (per && ctx.unit === "rad") return div(PI(), int(180 * per));
      if (per) return mk(ctx.unit === "grad" ? 200n : 180n, BigInt(180 * per), true);
      const v = scope?.[node.name];
      if (typeof v !== "number") no();
      // Ans in spremenljivke so double (Ans = 1 : 3 = 0,3333333333333333): necelo število ima napako ~2^−53,
      // sicer bi bil Ans·3 − 1 »natančno« −10⁻¹⁶ namesto 0
      const x = fromNumber(v);
      return x.d === 1n ? x : mk(x.n, x.d, false, lg(x) - 52);
    }
    case "grp":
      return c(node.a);
    case "neg":
      return neg(c(node.a));
    case "+":
      return add(c(node.a), c(node.b));
    case "-":
      return sub(c(node.a), c(node.b));
    case "*":
      return mul(c(node.a), c(node.b));
    case "/":
      return div(c(node.a), c(node.b));
    case "^":
      return powHP(c(node.a), c(node.b));
    case "fact":
      return fact(c(node.a));
    case "pct":
      return div(c(node.a), int(100));
    case "call": {
      const f = ALIAS[node.f] || node.f;
      const a = node.args.map(c);
      const one = (g) => (a.length === 1 ? g(a[0]) : no());
      switch (f) {
        case "sqrt":
          return one((x) => root(x, 2));
        case "cbrt":
          return one((x) => root(x, 3));
        case "root":
          if (a.length !== 2 || !isInt(a[1]) || a[1].n < 2n || a[1].n > 64n) no();
          return root(a[0], Number(a[1].n));
        case "ln":
          return one(ln);
        case "log":
          return one((x) => div(ln(x), LN10()));
        case "logb":
          if (a.length !== 2) no();
          return div(ln(a[0]), ln(a[1]));
        case "exp":
          return one(exp);
        case "abs":
          return one((x) => (x.n < 0n ? neg(x) : x));
        case "sin":
        case "cos":
        case "tan":
          return one((x) => trig(f, x, ctx.unit));
        case "nCr":
        case "nPr":
          if (a.length !== 2) no();
          return comb(a[0], a[1], f === "nCr");
        default:
          return no();
      }
    }
    default:
      return no();
  }
}

/**
 * Vrednost drevesa (po rewrite v scicore) z večjo natančnostjo. unit: enota kota v sin, cos, tan.
 * @returns {{ value:number, exact:boolean, zero:boolean, int?:bigint } | null}
 *   exact: točen racionalen rezultat (int: celo število v BigInt); zero: rezultat je 0 (točno ali v šumu napake);
 *   null: drevo ima del, ki ga tu ne znamo, ni definirano ali se natančnosti ne ujemata (ostane navadni izračun).
 */
export function precise(node, scope, { unit = "rad", ms = 40 } = {}) {
  deadline = Date.now() + ms;
  const P0 = P;
  try {
    let prev = null;
    for (const p of [256, 512, 1024]) {
      P = p;
      const x = ev(node, scope, { unit });
      if (x.ex) return { value: toNumber(x), exact: true, zero: x.n === 0n, ...(x.d === 1n ? { int: x.n } : {}) };
      const z = isZero(x);
      // 0 le, če je napaka res majhna (sin π: 2^−250); sicer je vrednost šum (sin(10⁻²⁰⁰) brez dovolj bitov)
      if (z && !(x.E < -P / 2)) {
        prev = null;
        continue;
      }
      const v = z ? 0 : toNumber(x);
      // zanesljivih vsaj 20 mest (napaka ≤ 2^−66 vrednosti) in enako pri dvojni natančnosti
      if (prev && z === prev.z && (z || (lg(x) - x.E > 66 && Math.abs(v - prev.v) <= 1e-15 * Math.abs(v)))) return { value: v, exact: false, zero: z };
      prev = { z, v };
    }
    return null;
  } catch (e) {
    if (e instanceof Unsupported || e instanceof RangeError) return null;
    throw e;
  } finally {
    P = P0;
  }
}
