// Skeniranje nalog – algebrsko jedro: točni ulomki (Q), polinomi več spremenljivk (P) in zapis v TeX.
// Brez DOM, teče tudi v Node (test/scan.test.js). Reševalnik po korakih je v solvecore.js.

export class AlgebraError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
  }
}

const big = (v) => (typeof v === "bigint" ? v : BigInt(v));
const babs = (v) => (v < 0n ? -v : v);
function bgcd(a, b) {
  a = babs(a);
  b = babs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}
const LIMIT = 10n ** 40n;

// ---------- ulomek ----------

export class Q {
  constructor(n, d = 1n) {
    n = big(n);
    d = big(d);
    if (d === 0n) throw new AlgebraError("div0");
    if (d < 0n) {
      n = -n;
      d = -d;
    }
    const g = bgcd(n, d) || 1n;
    this.n = n / g;
    this.d = d / g;
    if (babs(this.n) > LIMIT || this.d > LIMIT) throw new AlgebraError("big");
  }
  // Število (tudi decimalno, npr. 2.5) → točen ulomek; iracionalna števila niso dovoljena.
  static of(v) {
    if (v instanceof Q) return v;
    if (typeof v === "bigint") return new Q(v);
    if (!Number.isFinite(v)) throw new AlgebraError("nan");
    if (Number.isInteger(v)) return new Q(BigInt(v));
    const s = String(v);
    if (/e/i.test(s)) throw new AlgebraError("irrational");
    const [i, f = ""] = s.split(".");
    if (f.length > 9) throw new AlgebraError("irrational");
    return new Q(BigInt((i.startsWith("-") ? "-" : "") + i.replace("-", "") + f), 10n ** BigInt(f.length));
  }
  static get ZERO() {
    return new Q(0n);
  }
  static get ONE() {
    return new Q(1n);
  }
  add(o) {
    o = Q.of(o);
    return new Q(this.n * o.d + o.n * this.d, this.d * o.d);
  }
  sub(o) {
    o = Q.of(o);
    return new Q(this.n * o.d - o.n * this.d, this.d * o.d);
  }
  mul(o) {
    o = Q.of(o);
    return new Q(this.n * o.n, this.d * o.d);
  }
  div(o) {
    o = Q.of(o);
    if (o.n === 0n) throw new AlgebraError("div0");
    return new Q(this.n * o.d, this.d * o.n);
  }
  neg() {
    return new Q(-this.n, this.d);
  }
  abs() {
    return new Q(babs(this.n), this.d);
  }
  inv() {
    return Q.ONE.div(this);
  }
  pow(k) {
    if (!Number.isInteger(k) || Math.abs(k) > 64) throw new AlgebraError("pow");
    if (k < 0) return this.inv().pow(-k);
    return new Q(this.n ** BigInt(k), this.d ** BigInt(k));
  }
  cmp(o) {
    o = Q.of(o);
    const l = this.n * o.d;
    const r = o.n * this.d;
    return l < r ? -1 : l > r ? 1 : 0;
  }
  eq(o) {
    return this.cmp(o) === 0;
  }
  get zero() {
    return this.n === 0n;
  }
  get one() {
    return this.n === 1n && this.d === 1n;
  }
  get int() {
    return this.d === 1n;
  }
  get sign() {
    return this.n < 0n ? -1 : this.n > 0n ? 1 : 0;
  }
  num() {
    return Number(this.n) / Number(this.d);
  }
  // Končen decimalni zapis (imenovalec samo z 2 in 5)?
  get finiteDecimal() {
    let d = this.d;
    while (d % 2n === 0n) d /= 2n;
    while (d % 5n === 0n) d /= 5n;
    return d === 1n;
  }
  // Racionalni koren (√(p/q), če sta p in q popolna kvadrata), sicer null.
  sqrt() {
    if (this.n < 0n) return null;
    const a = isqrt(this.n);
    const b = isqrt(this.d);
    return a * a === this.n && b * b === this.d ? new Q(a, b) : null;
  }
  toString() {
    return this.d === 1n ? String(this.n) : `${this.n}/${this.d}`;
  }
  // TeX: ulomek, mešano število ali decimalno število (z vejico).
  tex({ dec = false, mixed = false, comma = true } = {}) {
    if (this.d === 1n) return texInt(this.n);
    if (dec && this.finiteDecimal) return decString(this, comma).replace("-", "-");
    const s = this.n < 0n ? "-" : "";
    const n = babs(this.n);
    if (mixed && n > this.d) return `${s}${n / this.d}\\tfrac{${n % this.d}}{${this.d}}`;
    return `${s}\\frac{${n}}{${this.d}}`;
  }
  // Zapis za razčlenjevalnik (math.js): -3/4 → (-3/4)
  text() {
    return this.d === 1n ? String(this.n) : `(${this.n}/${this.d})`;
  }
}

export function isqrt(n) {
  n = big(n);
  if (n < 0n) throw new AlgebraError("sqrt");
  if (n < 2n) return n;
  let x = BigInt(Math.floor(Math.sqrt(Number(n))));
  while (x * x > n) x--;
  while ((x + 1n) * (x + 1n) <= n) x++;
  return x;
}

export const gcdQ = (a, b) => new Q(bgcd(a.n * b.d, b.n * a.d), a.d * b.d); // gcd ulomkov
export const lcmInt = (a, b) => (a === 0n || b === 0n ? 0n : babs(a * b) / bgcd(a, b));
export const gcdInt = bgcd;

const texInt = (n) => {
  const s = String(n);
  const neg = s.startsWith("-");
  const d = neg ? s.slice(1) : s;
  // tisočice ločimo s tankim presledkom (10 000), kot v slovenskih učbenikih
  const g = d.length > 4 ? d.replace(/\B(?=(\d{3})+(?!\d))/g, "\\,") : d;
  return (neg ? "-" : "") + g;
};

function decString(q, comma = true) {
  // točen končen decimalni zapis
  const neg = q.n < 0n;
  let n = babs(q.n);
  const d = q.d;
  let k = 0n;
  let scale = 1n;
  while ((scale * n) % d !== 0n) {
    scale *= 10n;
    k++;
  }
  const v = (scale * n) / d;
  let s = v.toString().padStart(Number(k) + 1, "0");
  if (k > 0n) s = s.slice(0, s.length - Number(k)) + (comma ? "{,}" : ".") + s.slice(s.length - Number(k));
  return (neg ? "-" : "") + s;
}

// Približek za prikaz (2 decimalki, vejica).
export function approxTex(v, digits = 2, comma = true) {
  if (!Number.isFinite(v)) return "?";
  let s = (Math.round(v * 10 ** digits) / 10 ** digits).toFixed(digits).replace(/\.?0+$/, "");
  if (s === "-0") s = "0";
  return comma ? s.replace(".", "{,}") : s;
}

// ---------- monomi in polinomi ----------

// monom: { x: 2, y: 1 } ; ključ "x^2y"
export const monoKey = (m) =>
  Object.keys(m)
    .filter((v) => m[v])
    .sort()
    .map((v) => (m[v] === 1 ? v : `${v}^${m[v]}`))
    .join("");
const monoDeg = (m) => Object.values(m).reduce((s, e) => s + e, 0);
const monoMul = (a, b) => {
  const o = { ...a };
  for (const [v, e] of Object.entries(b)) o[v] = (o[v] || 0) + e;
  return o;
};

export class P {
  constructor(terms = []) {
    this.t = new Map(); // ključ → { m, c }
    for (const { m, c } of terms) this.addTerm(m, c);
  }
  static num(q) {
    return new P([{ m: {}, c: Q.of(q) }]);
  }
  static v(name) {
    return new P([{ m: { [name]: 1 }, c: Q.ONE }]);
  }
  addTerm(m, c) {
    c = Q.of(c);
    if (c.zero) return this;
    const k = monoKey(m);
    const cur = this.t.get(k);
    const nc = cur ? cur.c.add(c) : c;
    if (nc.zero) this.t.delete(k);
    else this.t.set(k, { m: cur?.m || Object.fromEntries(Object.entries(m).filter(([, e]) => e)), c: nc });
    return this;
  }
  terms() {
    return [...this.t.values()];
  }
  clone() {
    return new P(this.terms());
  }
  add(o) {
    const r = this.clone();
    for (const { m, c } of o.terms()) r.addTerm(m, c);
    return r;
  }
  sub(o) {
    return this.add(o.scale(Q.ONE.neg()));
  }
  scale(q) {
    q = Q.of(q);
    return new P(this.terms().map(({ m, c }) => ({ m, c: c.mul(q) })));
  }
  mul(o) {
    const r = new P();
    for (const a of this.terms()) for (const b of o.terms()) r.addTerm(monoMul(a.m, b.m), a.c.mul(b.c));
    return r;
  }
  pow(k) {
    if (!Number.isInteger(k) || k < 0 || k > 12) throw new AlgebraError("pow");
    let r = P.num(1);
    for (let i = 0; i < k; i++) r = r.mul(this);
    return r;
  }
  get zero() {
    return this.t.size === 0;
  }
  isConst() {
    return this.terms().every((x) => monoDeg(x.m) === 0);
  }
  constValue() {
    return this.t.get("")?.c || Q.ZERO;
  }
  vars() {
    const s = new Set();
    for (const { m } of this.terms()) for (const v of Object.keys(m)) s.add(v);
    return [...s].sort();
  }
  degree(v) {
    let d = 0;
    for (const { m } of this.terms()) d = Math.max(d, v ? m[v] || 0 : monoDeg(m));
    return d;
  }
  // koeficient pri v^k (samo za polinome ene spremenljivke)
  coef(v, k) {
    return this.t.get(k === 0 ? "" : monoKey({ [v]: k }))?.c || Q.ZERO;
  }
  // koeficienti [a0, a1, …, an] polinoma ene spremenljivke
  coeffs(v) {
    const n = this.degree(v);
    return Array.from({ length: n + 1 }, (_, k) => this.coef(v, k));
  }
  eq(o) {
    return this.sub(o).zero;
  }
  // urejeni členi: po stopnji navzdol, nato po abecedi
  sorted(main) {
    return this.terms().sort((a, b) => {
      if (main) {
        const d = (b.m[main] || 0) - (a.m[main] || 0);
        if (d) return d;
      }
      const d = monoDeg(b.m) - monoDeg(a.m);
      if (d) return d;
      return monoKey(a.m) < monoKey(b.m) ? -1 : 1;
    });
  }
  // skupni imenovalec koeficientov
  denLcm() {
    let l = 1n;
    for (const { c } of this.terms()) l = lcmInt(l, c.d);
    return l;
  }
  // gcd celih koeficientov
  numGcd() {
    let g = 0n;
    for (const { c } of this.terms()) g = bgcd(g, c.n);
    return g;
  }
  eval(env) {
    let s = 0;
    for (const { m, c } of this.terms()) {
      let p = c.num();
      for (const [v, e] of Object.entries(m)) p *= env[v] ** e;
      s += p;
    }
    return s;
  }
  evalQ(env) {
    let s = Q.ZERO;
    for (const { m, c } of this.terms()) {
      let p = c;
      for (const [v, e] of Object.entries(m)) p = p.mul(Q.of(env[v]).pow(e));
      s = s.add(p);
    }
    return s;
  }
  tex(opt = {}) {
    return termsTex(this.sorted(opt.main), opt);
  }
  text() {
    return termsText(this.sorted());
  }
}

// ---------- zapis členov ----------

export function monoTex(m) {
  return Object.keys(m)
    .sort()
    .map((v) => (m[v] === 1 ? v : `${v}^{${m[v]}}`))
    .join("");
}

// En člen s predznakom: first = prvi v vsoti (brez »+«)
export function termTex({ m, c }, first = false, opt = {}) {
  const mt = monoTex(m);
  const neg = c.sign < 0;
  const a = c.abs();
  let body;
  if (!mt) body = a.tex(opt);
  else if (a.one) body = mt;
  else if (a.int || (opt.dec && a.finiteDecimal)) body = a.tex(opt) + mt;
  else body = `\\frac{${a.n === 1n ? "" : a.n}${mt}}{${a.d}}`;
  if (first) return (neg ? "-" : "") + body;
  return (neg ? " - " : " + ") + body;
}

export function termsTex(list, opt = {}) {
  if (!list.length) return "0";
  return list.map((t, i) => termTex(t, i === 0, opt)).join("");
}

export function termsText(list) {
  if (!list.length) return "0";
  return list
    .map(({ m, c }, i) => {
      const mt = Object.keys(m)
        .sort()
        .map((v) => (m[v] === 1 ? v : `${v}^${m[v]}`))
        .join("*");
      const a = c.abs();
      const coef = a.one && mt ? "" : a.text();
      const body = coef && mt ? `${coef}*${mt}` : coef || mt;
      return (c.sign < 0 ? (i ? " - " : "-") : i ? " + " : "") + body;
    })
    .join("");
}

// ---------- drevo izraza (iz public/graph/math.js) → polinom ----------

const unwrap = (n) => (n && n.k === "grp" ? unwrap(n.a) : n);

export function polyOf(node) {
  const n = unwrap(node);
  switch (n.k) {
    case "num":
      return P.num(Q.of(n.v));
    case "q":
      return P.num(n.q);
    case "var":
      if (!/^[a-zA-Z]$/.test(n.name)) throw new AlgebraError("notpoly");
      return P.v(n.name);
    case "neg":
      return polyOf(n.a).scale(-1);
    case "+":
      return polyOf(n.a).add(polyOf(n.b));
    case "-":
      return polyOf(n.a).sub(polyOf(n.b));
    case "*":
      return polyOf(n.a).mul(polyOf(n.b));
    case "/": {
      const d = polyOf(n.b);
      if (!d.isConst() || d.zero) throw new AlgebraError("notpoly");
      return polyOf(n.a).scale(d.constValue().inv());
    }
    case "^": {
      const e = polyOf(n.b);
      if (!e.isConst()) throw new AlgebraError("notpoly");
      const k = e.constValue();
      if (!k.int || k.sign < 0) throw new AlgebraError("notpoly");
      return polyOf(n.a).pow(Number(k.n));
    }
    case "pct":
      return polyOf(n.a).scale(new Q(1n, 100n));
    default:
      throw new AlgebraError("notpoly");
  }
}

export function tryPoly(node) {
  try {
    return polyOf(node);
  } catch {
    return null;
  }
}

// Vrednost konstantnega izraza kot točen ulomek (ali null).
export function constQ(node) {
  const p = tryPoly(node);
  return p && p.isConst() ? p.constValue() : null;
}
