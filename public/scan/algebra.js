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
let LIMIT = 10n ** 40n;
/** fn z višjo mejo velikosti ulomkov (cas.js exactPolyIn: koeficienti do 10⁴³ v vpisani enačbi; čas omejuje tick). */
export function withLimit(lim, fn) {
  const old = LIMIT;
  LIMIT = lim;
  try {
    return fn();
  } finally {
    LIMIT = old;
  }
}

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

// ---------- točni dokazi (skener P3-2, AUDIT-001) ----------
// Brez SymPy dokažemo s točno algebro: rešitve oblike u + w·√c vstavimo brez decimalk, število vseh realnih ničel
// polinoma prešteje Sturmov izrek (na vsej realni osi, brez meje iskanja), manjkajoče ničle poišče bisekcija znotraj
// Cauchyjeve meje. Neenačbo preverimo na vseh kritičnih točkah in med njimi. Kjer to ne gre, funkcije vrnejo null
// (takrat ostane samo numerično preverjanje in status nikoli ni »Preverjeno«, public/scan/status.js).

const PROOF_LIMIT = 10n ** 3000n; // vmesni ulomki Sturmovega zaporedja so lahko veliki
const MAX_PROOF_DEG = 16;
const proof = (fn) => {
  try {
    return withLimit(PROOF_LIMIT, fn);
  } catch (err) {
    if (err instanceof AlgebraError) return null;
    throw err;
  }
};

// n = k² · r (r brez kvadratov). Shranjeno: Surd ga kliče pri vsaki operaciji, pri velikem n je zanka do 10⁵ draga.
const SQF = new Map();
export function squareFree(n) {
  n = big(n);
  const hit = SQF.get(n);
  if (hit) return hit;
  let k = 1n;
  let r = n;
  for (let p = 2n; p * p <= r && p < 100000n; p++) {
    while (r % (p * p) === 0n) {
      r /= p * p;
      k *= p;
    }
  }
  // preostanek je lahko kvadrat velikega praštevila (nad mejo zanke)
  if (r > 1n) {
    const t = isqrtNewton(r);
    if (t * t === r) {
      k *= t;
      r = 1n;
    }
  }
  if (SQF.size > 2000) SQF.clear();
  const out = { k, r };
  SQF.set(n, out);
  return out;
}

// celi del √n tudi za zelo velika n (Newton; isqrt zgoraj začne pri približku double, ki nad ~10³⁰ ni dovolj blizu)
function isqrtNewton(n) {
  if (n < 2n) return n;
  let x = 1n << (BigInt(n.toString(2).length) / 2n + 1n);
  for (;;) {
    const y = (x + n / x) >> 1n;
    if (y >= x) return x;
    x = y;
  }
}

// Število u + w·√c (c celo, brez kvadratov; c = 1 pomeni racionalno število).
export class Surd {
  constructor(u, w = Q.ZERO, c = 1n) {
    u = Q.of(u);
    w = Q.of(w);
    c = big(c);
    if (c < 0n) throw new AlgebraError("complex");
    if (c > 1n && !w.zero) {
      const { k, r } = squareFree(c);
      w = w.mul(new Q(k));
      c = r;
    }
    if (c <= 1n || w.zero) {
      if (c === 1n) u = u.add(w);
      w = Q.ZERO;
      c = 1n;
    }
    this.u = u;
    this.w = w;
    this.c = c;
  }
  static of(v) {
    return v instanceof Surd ? v : new Surd(v);
  }
  get rational() {
    return this.c === 1n;
  }
  pair(o) {
    o = Surd.of(o);
    if (!this.rational && !o.rational && this.c !== o.c) throw new AlgebraError("surd");
    return [o, this.rational ? o.c : this.c];
  }
  add(o) {
    const [b, c] = this.pair(o);
    return new Surd(this.u.add(b.u), this.w.add(b.w), c);
  }
  sub(o) {
    return this.add(Surd.of(o).neg());
  }
  neg() {
    return new Surd(this.u.neg(), this.w.neg(), this.c);
  }
  mul(o) {
    const [b, c] = this.pair(o);
    const cq = new Q(c);
    return new Surd(this.u.mul(b.u).add(this.w.mul(b.w).mul(cq)), this.u.mul(b.w).add(this.w.mul(b.u)), c);
  }
  div(o) {
    const b = Surd.of(o);
    // (u + w√c)⁻¹ = (u − w√c) / (u² − w²c)
    const n = b.u.mul(b.u).sub(b.w.mul(b.w).mul(new Q(b.c)));
    if (n.zero) throw new AlgebraError("div0");
    return this.mul(new Surd(b.u.div(n), b.w.neg().div(n), b.c));
  }
  get sign() {
    const su = this.u.sign;
    const sw = this.w.sign;
    if (!sw) return su;
    if (!su || su === sw) return sw;
    // različna predznaka: primerjamo u² in w²c
    const d = this.u.mul(this.u).cmp(this.w.mul(this.w).mul(new Q(this.c)));
    return d > 0 ? su : d < 0 ? sw : 0;
  }
  num() {
    return this.u.num() + this.w.num() * Math.sqrt(Number(this.c));
  }
}

// Točna vrednost konstantnega izraza (drevo iz public/graph/math.js) v obliki u + w·√c, sicer null.
export function surdOf(node) {
  try {
    return proof(() => surdNode(node));
  } catch {
    return null;
  }
}
function surdNode(node) {
  const n = node;
  switch (n?.k) {
    case "num":
      return new Surd(Q.of(n.v));
    case "q":
      return new Surd(n.q);
    case "grp":
      return surdNode(n.a);
    case "neg":
      return surdNode(n.a).neg();
    case "+":
      return surdNode(n.a).add(surdNode(n.b));
    case "-":
      return surdNode(n.a).sub(surdNode(n.b));
    case "*":
      return surdNode(n.a).mul(surdNode(n.b));
    case "/":
      return surdNode(n.a).div(surdNode(n.b));
    case "^": {
      const e = surdNode(n.b);
      if (!e.rational) throw new AlgebraError("notsurd");
      if (e.u.eq(new Q(1n, 2n))) return sqrtS(surdNode(n.a));
      // cel eksponent od −16 do 16 (10^(-6) = 1/10⁶)
      if (!e.u.int || e.u.n < -16n || e.u.n > 16n) throw new AlgebraError("notsurd");
      let out = new Surd(Q.ONE);
      const b = surdNode(n.a);
      for (let i = 0n; i < babs(e.u.n); i++) out = out.mul(b);
      return e.u.n < 0n ? new Surd(Q.ONE).div(out) : out;
    }
    case "call":
      if (n.f === "sqrt" && n.args?.length === 1) return sqrtS(surdNode(n.args[0]));
      throw new AlgebraError("notsurd");
    default:
      throw new AlgebraError("notsurd");
  }
}
function sqrtS(x) {
  if (!x.rational || x.u.sign < 0) throw new AlgebraError("notsurd");
  // √(n/d) = √(n·d) / d
  const { k, r } = squareFree(x.u.n * x.u.d);
  return new Surd(Q.ZERO, new Q(k, x.u.d), r);
}

// Točen ulomek iz števila s plavajočo vejico (vsako tako število je k / 2ᵉ).
export function qFromFloat(x) {
  if (!Number.isFinite(x)) throw new AlgebraError("nan");
  let m = x;
  let e = 0n;
  while (!Number.isInteger(m) && e < 1100n) {
    m *= 2;
    e++;
  }
  return withLimit(PROOF_LIMIT, () => new Q(BigInt(m), 2n ** e));
}

// Primerjava točnih števil; pri različnih korenih (√2 proti √3) po približku, če sta dovolj narazen, sicer napaka.
export function cmpS(a, b) {
  a = Surd.of(a);
  b = Surd.of(b);
  if (a.rational || b.rational || a.c === b.c) return a.sub(b).sign;
  const x = a.num();
  const y = b.num();
  if (Math.abs(x - y) > 1e-9 * Math.max(1, Math.abs(x), Math.abs(y))) return x < y ? -1 : 1;
  throw new AlgebraError("surd");
}

// Polinom kot koeficienti [a0, a1, …, an] (Q).
const trimCs = (cs) => {
  const a = cs.map((c) => Q.of(c));
  while (a.length > 1 && a[a.length - 1].zero) a.pop();
  return a;
};
const zeroCs = (cs) => cs.every((c) => c.zero);
export function evalCs(cs, x) {
  x = Surd.of(x);
  let acc = new Surd(Q.ZERO);
  for (let i = cs.length - 1; i >= 0; i--) acc = acc.mul(x).add(cs[i]);
  return acc;
}
const evalQcs = (cs, x) => {
  let acc = Q.ZERO;
  for (let i = cs.length - 1; i >= 0; i--) acc = acc.mul(x).add(cs[i]);
  return acc;
};
const derivCs = (cs) => (cs.length < 2 ? [Q.ZERO] : cs.slice(1).map((c, i) => c.mul(new Q(i + 1))));
function divmodCs(a, b) {
  b = trimCs(b);
  const r = trimCs(a);
  const db = b.length - 1;
  const lb = b[db];
  const q = Array.from({ length: Math.max(1, r.length - db) }, () => Q.ZERO);
  while (r.length - 1 >= db && !zeroCs(r)) {
    const k = r.length - 1 - db;
    const f = r[r.length - 1].div(lb);
    q[k] = f;
    for (let i = 0; i <= db; i++) r[i + k] = r[i + k].sub(f.mul(b[i]));
    r.pop();
    while (r.length > 1 && r[r.length - 1].zero) r.pop();
    if (!r.length) r.push(Q.ZERO);
  }
  return { q, r };
}
// pozitiven faktor ne spremeni predznakov: vsak člen zaporedja delimo z |vodilnim koeficientom|
const normCs = (cs) => {
  const lc = cs[cs.length - 1].abs();
  return cs.map((c) => c.div(lc));
};
function gcdCs(a, b) {
  a = trimCs(a);
  b = trimCs(b);
  while (!zeroCs(b)) [a, b] = [b, divmodCs(a, b).r];
  return normCs(a);
}

// Največji skupni delitelj več polinomov (koeficienti Q) z vodilnim koeficientom ±1; null pri prevelikih številih.
export function polyGcd(list) {
  return proof(() => list.map(trimCs).reduce((a, b) => (zeroCs(a) ? b : zeroCs(b) ? a : gcdCs(a, b))));
}

// Sturmovo zaporedje dela brez večkratnih ničel (p / gcd(p, p')); null, če ga ne znamo sestaviti.
export function sturmChain(cs) {
  return proof(() => {
    let p = trimCs(cs);
    if (p.length < 2 || p.length - 1 > MAX_PROOF_DEG) return null;
    const g = gcdCs(p, derivCs(p));
    if (g.length > 1) p = divmodCs(p, g).q;
    const chain = [normCs(p)];
    if (p.length > 1) chain.push(normCs(derivCs(p)));
    while (chain.length < 2 * MAX_PROOF_DEG && chain[chain.length - 1].length > 1) {
      const r = divmodCs(chain[chain.length - 2], chain[chain.length - 1]).r;
      if (zeroCs(r)) break;
      chain.push(normCs(r.map((c) => c.neg())));
    }
    return chain;
  });
}
const variations = (signs) => {
  let v = 0;
  let prev = 0;
  for (const s of signs) {
    if (!s) continue;
    if (prev && s !== prev) v++;
    prev = s;
  }
  return v;
};
// predznaki zaporedja v x (Q) ali v ±∞ (x = -Infinity / Infinity)
function chainSigns(chain, x) {
  if (x === Infinity || x === -Infinity)
    return chain.map((c) => {
      const s = c[c.length - 1].sign;
      return x > 0 || (c.length - 1) % 2 === 0 ? s : -s;
    });
  return chain.map((c) => evalQcs(c, x).sign);
}
// število različnih realnih ničel na (lo, hi]; lo/hi sta Q ali ±Infinity
const countIn = (chain, lo = -Infinity, hi = Infinity) => variations(chainSigns(chain, lo)) - variations(chainSigns(chain, hi));
export function sturmCount(chain, lo = -Infinity, hi = Infinity) {
  return proof(() => countIn(chain, lo, hi));
}
// Cauchyjeva meja: vse realne ničle so v (−B, B)
export function cauchyBound(cs) {
  const p = trimCs(cs);
  const n = p.length - 1;
  let m = Q.ZERO;
  for (let i = 0; i < n; i++) {
    const r = p[i].div(p[n]).abs();
    if (r.cmp(m) > 0) m = r;
  }
  return m.add(Q.ONE);
}
// Ločeni intervali (lo, hi], v vsakem natanko ena ničla, širine pod relativno 1e−10 (ali do 200 razpolovitev).
export function isolateRoots(cs, maxSteps = 4000) {
  return proof(() => {
    const chain = sturmChain(cs);
    if (!chain) return null;
    const B = cauchyBound(chain[0]);
    const todo = [[B.neg(), B]];
    const out = [];
    let steps = 0;
    while (todo.length) {
      if (++steps > maxSteps) return null;
      const [lo, hi] = todo.pop();
      const n = countIn(chain, lo, hi);
      if (n === 0) continue;
      if (n === 1) {
        out.push(refine(chain, lo, hi));
        continue;
      }
      const m = lo.add(hi).div(new Q(2n));
      todo.push([lo, m], [m, hi]);
    }
    return out.sort((a, b) => a.lo.cmp(b.lo));
  });
}
// Ena ničla brez večkratnosti na (lo, hi]. V lo je lahko sosednja ničla (p(lo) = 0), zato odloča predznak v hi:
// če je p(hi) = 0, je ničla hi; sicer je ničla v (lo, hi) in jo razpolavljamo glede na predznak p(hi).
function refine(chain, lo, hi) {
  const p = chain[0];
  const sHi = evalQcs(p, hi).sign;
  if (sHi === 0) return { lo: hi, hi, x: hi.num() };
  for (let i = 0; i < 200; i++) {
    const w = hi.sub(lo).num();
    const mag = Math.max(1e-300, Math.abs(lo.num()), Math.abs(hi.num()));
    if (w <= 1e-10 * mag) break;
    const m = lo.add(hi).div(new Q(2n));
    const sm = evalQcs(p, m).sign;
    if (sm === 0) return { lo: m, hi: m, x: m.num() };
    if (sm === sHi) hi = m;
    else lo = m;
  }
  return { lo, hi, x: (lo.num() + hi.num()) / 2 };
}

/**
 * Enačba p(x) = 0 (cs: koeficienti) in trditev rešitev sols: [{ s: Surd, num?, tol? }] točno ali [{ num, tol? }] približno.
 * Točna trditev, ki ni ničla, a ima num in tol (zaokroženo decimalno število, npr. 1,324718), se preveri kot približek.
 * Vrne { holds, exact, complete, missing } ali null (stopnja < 1 ali prevelika števila):
 * holds: vsaka trditev je ničla (točna vrednost točno, približek: ničla na ±max(10⁻⁶·|x|, tol)), exact: vse trditve točne,
 * complete: true = različnih trditev je toliko kot vseh realnih ničel (Sturm), false = katera manjka,
 * null = ne vemo (dva približka sta tako blizu, da ju nismo ločili).
 */
export function polyEquationProof(cs, sols) {
  return proof(() => {
    const p = trimCs(cs);
    if (p.length < 2 || p.length - 1 > MAX_PROOF_DEG) return null;
    const chain = sturmChain(p);
    if (!chain) return null;
    const pts = [];
    for (const sol of sols) {
      if (sol.s && evalCs(p, sol.s).sign === 0) {
        pts.push({ s: sol.s, x: sol.s.num() });
        continue;
      }
      if (sol.s && !(sol.tol > 0 && Number.isFinite(sol.num))) return { holds: false, exact: true, complete: null, missing: [] };
      const x = sol.num;
      // okno relativno na |x| (ločeni morata ostati tudi ničli 10⁻⁶ in 2·10⁻⁶), pri zaokroženem zapisu vsaj pol zadnjega mesta
      const eps = Math.max(1e-6 * Math.abs(x), 1e-12, sol.tol || 0);
      if (countIn(chain, qFromFloat(x - eps), qFromFloat(x + eps)) < 1) return { holds: false, exact: false, complete: null, missing: [] };
      pts.push({ x, eps });
    }
    // različne trditve (točne primerjamo točno, približke po oknu ±eps: ločeni okni vsebujeta različni ničli)
    const distinct = [];
    let merged = false;
    for (const a of pts) {
      const same = distinct.find((b) => {
        if (a.s && b.s) {
          try {
            return cmpS(a.s, b.s) === 0;
          } catch {
            return Math.abs(a.x - b.x) < 1e-12 * Math.max(1, Math.abs(a.x));
          }
        }
        return Math.abs(a.x - b.x) <= (a.eps || 0) + (b.eps || 0);
      });
      if (!same) distinct.push(a);
      else if ((a.eps || same.eps) && a.x !== same.x) merged = true;
    }
    const exact = pts.every((a) => a.s);
    const total = countIn(chain);
    if (distinct.length === total) return { holds: true, exact, complete: true, missing: [] };
    // dva približka v istem oknu sta lahko dve različni ničli: popolnosti ne vemo
    if (distinct.length > total || merged) return { holds: true, exact, complete: null, missing: [] };
    // manjka vsaj ena ničla: poiščemo jih za povratno informacijo (ponovni poskus AI). Najprej odstranimo
    // točne racionalne trditve (deljenje z x − q), da iščemo samo v preostanku (hitro tudi pri ničlah do 10¹²).
    // Pri visoki stopnji seznam izpustimo (le za sporočilo AI; strežnika ne sme zadrževati).
    let rest = chain[0];
    for (const a of distinct) if (a.s?.rational && rest.length > 2) rest = divmodCs(rest, [a.s.u.neg(), Q.ONE]).q;
    const ex = rest.length <= 3 ? exactRoots(rest) : null;
    const roots = ex ? ex.map((r) => r.num()) : rest.length - 1 <= 8 ? (isolateRoots(rest, 400) || []).map((r) => r.x) : [];
    const missing = roots.filter((x) => !distinct.some((a) => Math.abs(a.x - x) <= (a.eps || 0) + 1e-9 * Math.max(1, Math.abs(x))));
    return { holds: true, exact, complete: false, missing };
  });
}

// Realne ničle polinoma stopnje ≤ 2 (po izpostavitvi xᵏ) točno, kot Surd; null, če jih tako ne znamo zapisati.
export function exactRoots(cs) {
  return proof(() => {
    let p = trimCs(cs);
    if (zeroCs(p)) return null;
    const out = [];
    if (p.length > 1 && p[0].zero) {
      out.push(new Surd(Q.ZERO));
      while (p.length > 1 && p[0].zero) p = p.slice(1);
    }
    const d = p.length - 1;
    if (d === 1) out.push(new Surd(p[0].neg().div(p[1])));
    else if (d === 2) {
      const [c, b, a] = p;
      const D = b.mul(b).sub(a.mul(c).mul(new Q(4n)));
      if (D.sign === 0) out.push(new Surd(b.neg().div(a.mul(new Q(2n)))));
      else if (D.sign > 0) {
        const r = sqrtS(new Surd(D));
        const two = new Surd(a.mul(new Q(2n)));
        out.push(r.neg().sub(b).div(two), r.sub(b).div(two));
      }
    } else if (d > 2) return null;
    const uniq = [];
    for (const r of out) if (!uniq.some((u) => cmpS(u, r) === 0)) uniq.push(r);
    return uniq.sort((x, y) => cmpS(x, y));
  });
}

const relHoldsSign = (s, op) => (op === "<" ? s < 0 : op === ">" ? s > 0 : op === "<=" ? s <= 0 : op === ">=" ? s >= 0 : s === 0);
// interval { lo, hi, loClosed, hiClosed } ali { point } s krajišči Surd (null = neskončno)
function inSet(ivs, x) {
  return ivs.some((iv) => {
    if (iv.point) return cmpS(x, iv.point) === 0;
    const a = iv.lo == null ? 1 : cmpS(x, iv.lo);
    const b = iv.hi == null ? -1 : cmpS(x, iv.hi);
    return (a > 0 || (a === 0 && iv.loClosed)) && (b < 0 || (b === 0 && iv.hiClosed));
  });
}

/**
 * Ali je množica ivs natanko množica rešitev sistema neenačb rels: [{ cs, op }] (pomeni p(x) op 0)?
 * true / false (dokazano), null (ne znamo odločiti točno). Glej inequalityCheck.
 */
export function inequalityProof(rels, ivs) {
  const r = inequalityCheck(rels, ivs);
  return r === null ? null : r.holds ? (r.exact ? true : null) : false;
}

/**
 * Kot inequalityProof, krajišče je lahko tudi { s: Surd, tol } (zaokroženo decimalno število: pol zadnjega mesta).
 * Kritične točke: ničle vsake relacije (stopnja ≤ 2 točno, višja kot Sturmovi izolirajoči intervali) in krajišča.
 * Preverimo resničnost in pripadnost v vsaki kritični točki in v racionalni točki med vsakima sosednjima.
 * Vrne { holds, exact } (exact: false = krajišče je le približek ničle) ali null (ne znamo).
 */
export function inequalityCheck(rels, ivs) {
  return proof(() => {
    const ends = [];
    const norm = ivs.map((iv) => {
      const o = { ...iv };
      for (const k of ["lo", "hi", "point"]) {
        if (iv[k] == null) continue;
        const e = iv[k] instanceof Surd ? { s: iv[k], tol: 0 } : { s: Surd.of(iv[k].s), tol: iv[k].tol || 0 };
        o[k] = e.s;
        ends.push(e);
      }
      return o;
    });
    const ps = rels.map((r) => trimCs(r.cs));
    const truthAt = (x) => rels.every((r, i) => relHoldsSign(evalCs(ps[i], x).sign, r.op));
    // kritični elementi: { a, b } (zaprt razpon a ≤ … ≤ b, Surd); kind: point (točka), root (izolirana ničla), fuzzy (približno krajišče)
    const items = [];
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      if (p.length === 1) continue; // konstanta: brez kritičnih točk
      if (p.length - 1 > MAX_PROOF_DEG) return null;
      const ex = exactRoots(p);
      if (ex) {
        for (const r of ex) items.push({ kind: "point", a: r, b: r });
        continue;
      }
      const chain = sturmChain(p);
      const iso = isolateRoots(p, 2000);
      if (!chain || !iso) return null;
      for (const r of iso) {
        let { lo, hi } = r;
        if (evalQcs(p, hi).sign === 0) {
          items.push({ kind: "point", a: new Surd(hi), b: new Surd(hi) });
          continue;
        }
        // ničla je v odprtem (lo, hi). Krajišče, ki je točno ta ničla, postane točka; drugo racionalno krajišče
        // v intervalu ga razdeli (ničla je na eni strani).
        let hit = null;
        for (const e of ends) {
          if (!e.s.rational) continue;
          const q = e.s.u;
          if (q.cmp(lo) <= 0 || q.cmp(hi) >= 0) continue;
          if (evalQcs(p, q).sign === 0) {
            hit = q;
            break;
          }
          if (countIn(chain, lo, q) === 1) hi = q;
          else lo = q;
        }
        if (hit) {
          items.push({ kind: "point", a: new Surd(hit), b: new Surd(hit) });
          continue;
        }
        // interval skrčimo strogo v notranjost (lo, hi): ne dotika se krajišč ne sosednjih intervalov
        const [lo0, hi0] = [lo, hi];
        for (let k = 0; k < 400 && (lo.cmp(lo0) <= 0 || hi.cmp(hi0) >= 0); k++) {
          const m = lo.add(hi).div(new Q(2n));
          if (evalQcs(p, m).sign === 0) {
            hit = m;
            break;
          }
          if (countIn(chain, lo, m) === 1) hi = m;
          else lo = m;
        }
        if (hit) items.push({ kind: "point", a: new Surd(hit), b: new Surd(hit) });
        else if (lo.cmp(lo0) > 0 && hi.cmp(hi0) < 0) items.push({ kind: "root", rel: i, a: new Surd(lo), b: new Surd(hi) });
        else return null;
      }
    }
    // krajišča: točna ničla (že zgoraj) ali približek ničle (zaokroženo) ali samostojna točka
    let exact = true;
    for (const e of ends) {
      if (items.some((it) => it.kind === "point" && cmpS(it.a, e.s) === 0)) continue;
      if (e.tol > 0) {
        const lo = e.s.sub(new Surd(qFromFloat(e.tol)));
        const hi = e.s.add(new Surd(qFromFloat(e.tol)));
        const near = items.filter((it) => cmpS(it.b, lo) >= 0 && cmpS(it.a, hi) <= 0);
        if (near.length === 1) {
          const it = near[0];
          if (cmpS(e.s, it.a) < 0) it.a = e.s;
          if (cmpS(e.s, it.b) > 0) it.b = e.s;
          it.kind = "fuzzy";
          exact = false;
          continue;
        }
        if (near.length > 1) return null;
      }
      items.push({ kind: "point", a: e.s, b: e.s });
    }
    items.sort((x, y) => cmpS(x.a, y.a));
    const uniq = [];
    for (const it of items) {
      const last = uniq[uniq.length - 1];
      if (last && it.kind === "point" && last.kind === "point" && cmpS(last.a, it.a) === 0) continue;
      if (last && cmpS(last.b, it.a) >= 0) return null; // prekrivanje (npr. skupna ničla dveh relacij): ne odločamo
      uniq.push(it);
    }
    const inSetAt = (x) => inSet(norm, x);
    const tests = [];
    for (const it of uniq) {
      if (it.kind === "point") tests.push([truthAt(it.a), it.a]);
      else if (it.kind === "root") {
        // v ničli je relacija »= 0«, druge relacije in pripadnost so na [a, b] stalne (drugih kritičnih točk tam ni)
        const truth = rels.every((r, i) => relHoldsSign(i === it.rel ? 0 : evalCs(ps[i], it.b).sign, r.op));
        tests.push([truth, it.b]);
      }
    }
    if (!uniq.length) tests.push([truthAt(new Surd(Q.ZERO)), new Surd(Q.ZERO)]);
    else {
      const first = uniq[0].a.sub(new Surd(Q.ONE));
      const last = uniq[uniq.length - 1].b.add(new Surd(Q.ONE));
      tests.push([truthAt(first), first], [truthAt(last), last]);
      for (let i = 1; i < uniq.length; i++) {
        const [a, b] = [uniq[i - 1].b, uniq[i].a];
        const t = a.rational && b.rational ? new Surd(a.u.add(b.u).div(new Q(2n))) : new Surd(qFromFloat((a.num() + b.num()) / 2));
        if (!(cmpS(a, t) < 0 && cmpS(t, b) < 0)) return null;
        tests.push([truthAt(t), t]);
      }
    }
    for (const [truth, x] of tests) if (truth !== inSetAt(x)) return { holds: false, exact: true };
    return { holds: true, exact };
  });
}
