// Simbolno računanje (CAS, 1. faza): poenostavi, razvij, razstavi in reši enačbo za izbrano črko.
// Računa točno z ulomki (Q) in polinomi več spremenljivk (P) iz jedra skenerja (public/scan/algebra.js),
// brez DOM in brez API; teče tudi v Node (test/cas.test.js).
//
// Vsak rezultat preverimo s števili: prvotni izraz in rezultat izračunamo v 20 točkah in se morata ujemati
// (rešitve enačbe vstavimo nazaj v enačbo). Česar ne prestane preverjanja, ne pokažemo.
// π in e sta simbola (transcendentni števili), zato x·π − π = π(x − 1); pri preverjanju dobita svojo vrednost.
import { Q, P, AlgebraError, gcdInt, lcmInt } from "../scan/algebra.js";
import { compileLine, lineTex, splitTop, HIDDEN_VARS } from "./scicore.js";

const BUDGET_MS = 1500; // kot reševalnik enačb: potem »preveč zapleteno«
const LIVE_MS = 200; // sprotni predogled med tipkanjem
const MAX_POW = 24;
let deadline = Infinity;
const tick = () => {
  if (Date.now() > deadline) throw new AlgebraError("timeout");
};
const fail = (code) => new AlgebraError(code);

// ---------------------------------------------------------------------------
// Polinomi: pomočniki

const mono = (m, c = Q.ONE) => new P([{ m, c: Q.of(c) }]);
const ONE = () => P.num(1);
// vrstni red črk: po abecedi ne glede na velikost (Gmm₂, pV, nRT), mala pred veliko (r pred R), π in e na koncu
const rank = (v) => (v === "π" || v === "e" ? 2 : 0);
const varCmp = (a, b) => rank(a) - rank(b) || (a.toLowerCase() < b.toLowerCase() ? -1 : a.toLowerCase() > b.toLowerCase() ? 1 : a < b ? 1 : a > b ? -1 : 0);
const order = (...ps) => [...new Set(ps.flatMap((p) => p.vars()))].sort(varCmp);

function lexCmp(a, b, ord) {
  for (const v of ord) {
    const d = (a[v] || 0) - (b[v] || 0);
    if (d) return d;
  }
  return 0;
}
function lead(p, ord) {
  let best = null;
  for (const t of p.terms()) if (!best || lexCmp(t.m, best.m, ord) > 0) best = t;
  return best;
}
function monoDiv(a, b) {
  const o = { ...a };
  for (const [v, e] of Object.entries(b)) {
    const r = (o[v] || 0) - e;
    if (r < 0) return null;
    if (r) o[v] = r;
    else delete o[v];
  }
  return o;
}
/** Koeficient pri v^k (polinom v ostalih spremenljivkah). */
function coefIn(p, v, k) {
  const r = new P();
  for (const { m, c } of p.terms()) {
    if ((m[v] || 0) !== k) continue;
    const mm = { ...m };
    delete mm[v];
    r.addTerm(mm, c);
  }
  return r;
}
const coeffsIn = (p, v) => Array.from({ length: p.degree(v) + 1 }, (_, k) => coefIn(p, v, k));
function derivIn(p, v) {
  const r = new P();
  for (const { m, c } of p.terms()) {
    const e = m[v] || 0;
    if (!e) continue;
    r.addTerm({ ...m, [v]: e - 1 }, c.mul(e));
  }
  return r;
}
function powP(p, k) {
  if (k > MAX_POW) throw fail("big");
  let r = ONE();
  let b = p;
  while (k > 0) {
    tick();
    if (k & 1) r = r.mul(b);
    k >>= 1;
    if (k) b = b.mul(b);
  }
  return r;
}
const homogeneous = (p) => new Set(p.terms().map((t) => Object.values(t.m).reduce((s, e) => s + e, 0))).size === 1;

/** Točno deljenje A/B (leksikografsko); null, če B ne deli A. */
function divExact(A, B) {
  if (B.zero) throw fail("div0");
  const ord = order(A, B);
  const lb = lead(B, ord);
  let R = A;
  const out = new P();
  for (let guard = 0; !R.zero; guard++) {
    tick();
    if (guard > 4000) throw fail("big");
    const lr = lead(R, ord);
    const m = monoDiv(lr.m, lb.m);
    if (!m) return null;
    const t = mono(m, lr.c.div(lb.c));
    out.addTerm(m, lr.c.div(lb.c));
    R = R.sub(B.mul(t));
  }
  return out;
}

/** p = c · q, q s celimi tujimi koeficienti in pozitivnim vodilnim koeficientom. */
function prim(p) {
  if (p.zero) return [Q.ZERO, p];
  let n = 0n;
  let d = 1n;
  for (const { c } of p.terms()) {
    n = gcdInt(n, c.n);
    d = lcmInt(d, c.d);
  }
  let c = new Q(n, d);
  if (lead(p, order(p)).c.sign < 0) c = c.neg();
  return [c, p.scale(c.inv())];
}
const norm = (p) => prim(p)[1];

// Psevdoostanek pri deljenju po spremenljivki v.
function prem(a, b, v) {
  const db = b.degree(v);
  const lb = coefIn(b, v, db);
  let r = a;
  for (let guard = 0; !r.zero && r.degree(v) >= db; guard++) {
    tick();
    if (guard > 200) throw fail("big");
    const dr = r.degree(v);
    r = r.mul(lb).sub(coefIn(r, v, dr).mul(b).mul(mono({ [v]: dr - db })));
  }
  return r;
}

/** Največji skupni delitelj dveh polinomov (primitivno zaporedje ostankov, rekurzivno po spremenljivkah). */
export function gcd(A, B) {
  tick();
  if (A.zero) return B.zero ? B : norm(B);
  if (B.zero) return norm(A);
  if (A.isConst() || B.isConst()) return ONE();
  const v = order(A, B)[0];
  if (A.degree(v) === 0) return gcd(A, contentIn(B, v));
  if (B.degree(v) === 0) return gcd(contentIn(A, v), B);
  const cA = contentIn(A, v);
  const cB = contentIn(B, v);
  const c = gcd(cA, cB);
  // numerični del vsebine odstranimo vsak korak (prim), sicer koeficienti psevdoostankov eksplodirajo
  let a = norm(divExact(A, cA));
  let b = norm(divExact(B, cB));
  if (a.degree(v) < b.degree(v)) [a, b] = [b, a];
  for (let guard = 0; guard < 100; guard++) {
    const r = prem(a, b, v);
    if (r.zero) return norm(c.mul(ppIn(b, v)));
    if (r.degree(v) === 0) return norm(c);
    a = b;
    b = norm(ppIn(r, v));
  }
  throw fail("big");
}
function contentIn(p, v) {
  let g = new P();
  for (const c of coeffsIn(p, v)) {
    if (c.zero) continue;
    g = gcd(g, c);
    if (g.isConst()) return ONE();
  }
  return g.zero ? ONE() : g;
}
const ppIn = (p, v) => divExact(p, contentIn(p, v));

/** Kvadratni koren polinoma (če je popoln kvadrat), sicer null. */
function psqrt(D) {
  if (D.zero) return new P();
  const ord = order(D);
  const L = lead(D, ord);
  const r = L.c.sqrt();
  if (!r) return null;
  const m = {};
  for (const [v, e] of Object.entries(L.m)) {
    if (e % 2) return null;
    m[v] = e / 2;
  }
  let S = mono(m, r);
  let last = m;
  for (let guard = 0; guard < 60; guard++) {
    tick();
    const R = D.sub(S.mul(S));
    if (R.zero) return S;
    const LR = lead(R, ord);
    const LS = lead(S, ord);
    const mm = monoDiv(LR.m, LS.m);
    if (!mm || lexCmp(mm, last, ord) >= 0) return null;
    S = S.add(mono(mm, LR.c.div(LS.c.mul(2))));
    last = mm;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Razcep nad racionalnimi števili

const divisors = (n) => {
  n = n < 0n ? -n : n;
  if (n === 0n || n > 10n ** 12n) return null;
  const out = [];
  const N = Number(n);
  for (let i = 1; i * i <= N; i++) {
    if (i % 4096 === 0) tick();
    if (N % i === 0) {
      out.push(BigInt(i));
      if (i * i !== N) out.push(BigInt(N / i));
    }
  }
  return out;
};

// p (ena spremenljivka, celi koeficienti, brez kvadratnih faktorjev) → nerazcepni faktorji
function splitUni(q, v) {
  if (q.degree(v) >= 4) {
    const sub = substSplit(q, v);
    if (sub) return sub;
  }
  const out = [];
  let rest = q;
  // racionalne ničle n/d: d deli vodilni, n prosti koeficient
  for (let guard = 0; rest.degree(v) >= 2 && guard < 40; guard++) {
    const cs = coeffsIn(rest, v).map((c) => c.constValue());
    const ns = divisors(cs[0].n);
    const ds = divisors(cs[cs.length - 1].n);
    if (!ns || !ds) break;
    let found = null;
    outer: for (const d of ds)
      for (const n of ns)
        for (const s of [1n, -1n]) {
          tick();
          const lin = new P([{ m: { [v]: 1 }, c: new Q(d) }, { m: {}, c: new Q(-s * n) }]);
          if (gcdInt(n, d) !== 1n) continue;
          const val = rest.evalQ({ [v]: new Q(s * n, d) });
          if (!val.zero) continue;
          found = lin;
          break outer;
        }
    if (!found) break;
    out.push(norm(found));
    rest = norm(divExact(rest, found));
  }
  if (rest.degree(v) >= 4) {
    const quad = kroneckerQuadratic(rest, v);
    if (quad) return [...out, ...splitUni(quad, v), ...splitUni(norm(divExact(rest, quad)), v)];
    const sub = substSplit(rest, v);
    if (sub) return [...out, ...sub];
  }
  if (rest.degree(v) >= 1) out.push(rest);
  return out;
}
// Samo potence x^k (x⁶ + 5x³ + 6, x¹⁰ − 1, x¹² + 1): uvedemo t = x^k, razstavimo v t in vrnemo x^k nazaj.
// Največji k najprej (x¹⁰ − 1 = (x⁵ − 1)(x⁵ + 1), sicer z k = 2 ostane nerazstavljen x⁸ + x⁶ + x⁴ + x² + 1).
function substSplit(q, v) {
  const G = q.terms().reduce((g, t) => Number(gcdInt(BigInt(g), BigInt(t.m[v] || 0))), 0);
  for (let k = G; k >= 2; k--) {
    if (G % k) continue;
    const parts = splitUni(norm(powMap(q, v, (e) => e / k)), v);
    if (parts.length > 1) return parts.flatMap((f) => splitUni(norm(powMap(f, v, (e) => e * k)), v));
  }
  return null;
}
// polinom z eksponenti črke v, preslikanimi s fn (x³ → t pri fn = e/3)
const powMap = (p, v, fn) => new P(p.terms().map(({ m, c }) => ({ m: m[v] ? { ...m, [v]: fn(m[v]) } : m, c })));

// Vsi členi so potence enega monoma μ (x⁶y⁶ − 1, μ = xy)? Vrne μ (eksponenti brez skupnega delitelja) ali null.
function monoBase(q) {
  const ts = q.terms().filter((t) => Object.keys(t.m).length);
  if (!ts.length) return null;
  const m0 = ts[0].m;
  const g0 = Object.values(m0).reduce((g, e) => Number(gcdInt(BigInt(g), BigInt(e))), 0);
  const mu = Object.fromEntries(Object.entries(m0).map(([k, e]) => [k, e / g0]));
  const ks = Object.keys(mu);
  for (const t of ts) {
    if (Object.keys(t.m).length !== ks.length) return null;
    const j = (t.m[ks[0]] || 0) / mu[ks[0]];
    if (!Number.isInteger(j) || ks.some((k) => t.m[k] !== j * mu[k])) return null;
  }
  return mu;
}

// Kvadratni faktor αv² + βv + γ polinoma brez racionalnih ničel (Kronecker: vrednosti v 0, 1, −1 delijo vrednosti q).
function kroneckerQuadratic(q, v) {
  const val = (x) => q.evalQ({ [v]: new Q(x) });
  const [f0, f1, fm] = [val(0), val(1), val(-1)];
  const D0 = divisors(f0.n);
  const D1 = divisors(f1.n);
  const Dm = divisors(fm.n);
  const lc = coefIn(q, v, q.degree(v)).constValue().n;
  if (!D0 || !D1 || !Dm || D0.length * D1.length * Dm.length > 40000) return null;
  const f2 = val(2);
  for (const g0 of D0)
    for (const s1 of [1n, -1n])
      for (const a1 of D1)
        for (const s2 of [1n, -1n])
          for (const a2 of Dm) {
            tick();
            const g1 = s1 * a1;
            const gm = s2 * a2;
            if ((g1 + gm) % 2n) continue;
            const al = (g1 + gm) / 2n - g0;
            const be = (g1 - gm) / 2n;
            if (al === 0n || lc % al) continue;
            const g2 = 4n * al + 2n * be + g0;
            if (g2 === 0n || f2.n % g2) continue;
            const g = new P([{ m: { [v]: 2 }, c: new Q(al) }, { m: { [v]: 1 }, c: new Q(be) }, { m: {}, c: new Q(g0) }]);
            if (divExact(q, g)) return norm(g);
          }
  return null;
}

// Primitiven polinom brez kvadratnih faktorjev → nerazcepni (kolikor jih najdemo) faktorji.
function split(q) {
  tick();
  q = norm(q);
  const vs = q.vars();
  if (!vs.length) return [];
  for (const v of vs) {
    const c = contentIn(q, v);
    if (!c.isConst()) return [...split(c), ...split(divExact(q, c))];
  }
  if (vs.some((v) => q.degree(v) === 1)) return [q]; // linearen v neki črki in primitiven → nerazcepen
  if (vs.length === 1) return splitUni(q, vs[0]);
  const mu = monoBase(q);
  if (mu) {
    // q = u(μ): razstavimo u(t) (t zapišemo kot prvo črko) in vstavimo μ nazaj
    const [w] = Object.keys(mu);
    const u = new P(q.terms().map(({ m, c }) => ({ m: Object.keys(m).length ? { [w]: m[w] / mu[w] } : {}, c })));
    const parts = splitUni(norm(u), w);
    if (parts.length > 1)
      return parts.map((f) => norm(new P(f.terms().map(({ m, c }) => ({ m: Object.fromEntries(Object.entries(mu).map(([k, e]) => [k, e * (m[w] || 0)]).filter(([, e]) => e)), c })))));
  }
  if (homogeneous(q)) {
    // x² − 5xy + 6y²: postavimo y = 1, razstavimo in vrnemo y nazaj
    const z = vs[vs.length - 1];
    const f1 = new P(q.terms().map(({ m, c }) => ({ m: Object.fromEntries(Object.entries(m).filter(([k]) => k !== z)), c })));
    const parts = split(f1);
    if (parts.length > 1)
      return parts.map((g) => {
        const dg = g.degree();
        return norm(new P(g.terms().map(({ m, c }) => ({ m: { ...m, [z]: dg - Object.values(m).reduce((s, e) => s + e, 0) }, c }))));
      });
  }
  // kvadraten v neki črki z diskriminanto, ki je popoln kvadrat: x² + 2x + 1 − y² = (x + 1 − y)(x + 1 + y)
  for (const v of vs) {
    if (q.degree(v) !== 2) continue;
    const [c, b, a] = coeffsIn(q, v);
    const S = psqrt(b.mul(b).sub(a.mul(c).scale(4)));
    if (!S) continue;
    let F = a.scale(2).mul(P.v(v)).add(b).sub(S);
    F = norm(divExact(F, contentIn(F, v)));
    const g = divExact(q, F);
    if (g && !g.isConst()) return [...split(F), ...split(g)];
  }
  return [q];
}

/** Razcep: p = c · Π f^e. Faktorji so normirani (celi tuji koeficienti, pozitiven vodilni koeficient). */
export function factorP(p) {
  if (p.zero) return { c: Q.ZERO, fs: [] };
  const fs = [];
  const add = (f, e) => {
    f = norm(f);
    if (f.isConst()) return;
    const old = fs.find((x) => x.p.eq(f));
    if (old) old.e += e;
    else fs.push({ p: f, e });
  };
  let q = norm(p);
  // skupni faktor črk (x³y − xy = xy(x² − 1))
  const m = {};
  for (const v of q.vars()) {
    const e = Math.min(...q.terms().map((t) => t.m[v] || 0));
    if (e) m[v] = e;
  }
  for (const [v, e] of Object.entries(m)) add(P.v(v), e);
  if (Object.keys(m).length) q = divExact(q, mono(m));
  const rec = (q, mult) => {
    tick();
    if (q.isConst()) return;
    const v = q.vars()[0];
    const c = contentIn(q, v);
    if (!c.isConst()) {
      rec(c, mult);
      q = divExact(q, c);
    }
    // Yun: razstavitev na faktorje brez kvadratov (večkratnosti)
    const d = derivIn(q, v);
    const b = gcd(q, d);
    let cc = divExact(q, b);
    let dd = divExact(d, b).sub(derivIn(cc, v));
    for (let i = 1; cc.degree(v) > 0; i++) {
      tick();
      if (i > MAX_POW) throw fail("big");
      const a = gcd(cc, dd);
      if (!a.isConst()) for (const f of split(a)) add(f, i * mult);
      cc = divExact(cc, a);
      dd = divExact(dd, a).sub(derivIn(cc, v));
    }
  };
  rec(q, 1);
  let prod = ONE();
  for (const f of fs) prod = prod.mul(powP(f.p, f.e));
  const k = divExact(p, prod);
  if (!k || !k.isConst()) throw fail("internal");
  fs.sort((a, b) => a.p.degree() - b.p.degree() || a.p.terms().length - b.p.terms().length || (a.p.text() < b.p.text() ? -1 : 1));
  return { c: k.constValue(), fs };
}

// ---------------------------------------------------------------------------
// Izraz → ulomek dveh polinomov

const SYMBOLS = { π: Math.PI, e: Math.E };

class R {
  constructor(n, d = ONE()) {
    this.n = n;
    this.d = d;
  }
}
function cancel(r) {
  if (r.d.zero) throw fail("div0");
  if (r.n.zero) return new R(new P(), ONE());
  if (r.d.isConst()) return new R(r.n.scale(r.d.constValue().inv()), ONE());
  const g = gcd(r.n, r.d);
  let n = g.isConst() ? r.n : divExact(r.n, g);
  let d = g.isConst() ? r.d : divExact(r.d, g);
  const [cd, dp] = prim(d);
  return new R(n.scale(cd.inv()), dp);
}

// ctx: { scope (znane vrednosti), dens: [P] (delitelji za pogoje), dec: bool (vnos z decimalkami) }
function rat(node, ctx) {
  tick();
  const r = (x) => rat(x, ctx);
  switch (node.k) {
    case "num": {
      if (!Number.isInteger(node.v)) ctx.dec = true;
      try {
        return new R(P.num(Q.of(node.v)));
      } catch {
        throw fail("unsupported");
      }
    }
    case "var": {
      // shranjene spremenljivke (a = 5), Ans in ° so števila
      const name = node.name;
      if (ctx.scope && name in ctx.scope) {
        if (!Number.isInteger(ctx.scope[name])) ctx.dec = true; // a = 0,1 → 0,2x + 0,01, ne x/5 + 1/100
        return new R(P.num(qOfNumber(ctx.scope[name])));
      }
      if (HIDDEN_VARS.has(name)) throw fail("unsupported");
      ctx.vars?.add(name); // tudi črke, ki se pokrajšajo (x/x), potrebujemo za preverjanje
      return new R(P.v(name));
    }
    case "const":
      if (node.name in SYMBOLS) return new R(P.v(node.name));
      throw fail("unsupported");
    case "grp":
      return r(node.a);
    case "neg": {
      const a = r(node.a);
      return new R(a.n.scale(-1), a.d);
    }
    case "+":
    case "-": {
      if (node.b?.k === "pct") throw fail("unsupported");
      const a = r(node.a);
      const b = r(node.b);
      const sign = node.k === "+" ? 1 : -1;
      if (a.d.eq(b.d)) return cancel(new R(a.n.add(b.n.scale(sign)), a.d));
      return cancel(new R(a.n.mul(b.d).add(b.n.mul(a.d).scale(sign)), a.d.mul(b.d)));
    }
    case "*": {
      const a = r(node.a);
      const b = r(node.b);
      return cancel(new R(a.n.mul(b.n), a.d.mul(b.d)));
    }
    case "/": {
      const a = r(node.a);
      const b = r(node.b);
      if (b.n.zero) throw fail("div0");
      if (!b.n.isConst()) ctx.dens.push(b.n);
      return cancel(new R(a.n.mul(b.d), a.d.mul(b.n)));
    }
    case "^": {
      const e = r(node.b);
      if (!e.n.isConst() || !e.d.isConst()) throw fail("unsupported");
      const k = e.n.constValue().div(e.d.constValue());
      if (!k.int) throw fail("unsupported");
      if (k.abs().cmp(MAX_POW) > 0) throw fail("big");
      const a = r(node.a);
      const n = Number(k.n);
      if (n >= 0) return new R(powP(a.n, n), powP(a.d, n));
      if (a.n.zero) throw fail("div0");
      if (!a.n.isConst()) ctx.dens.push(a.n);
      return cancel(new R(powP(a.d, -n), powP(a.n, -n)));
    }
    case "pct": {
      const a = r(node.a);
      return new R(a.n.scale(new Q(1n, 100n)), a.d);
    }
    default:
      throw fail("unsupported"); // funkcije (sin, √, |x|), odvodi … pridejo v 2. in 3. fazi
  }
}
function qOfNumber(v) {
  try {
    return Q.of(v);
  } catch {
    throw fail("irrational");
  }
}

// ---------------------------------------------------------------------------
// Zapis v TeX

const varTex = (v) => {
  const m = /^([^_]+)_(.+)$/.exec(v);
  return m ? `${m[1]}_{${m[2]}}` : v;
};
const MAIN = (vs) => (vs.includes("x") ? "x" : [...vs].sort(varCmp)[0]);
function monoTex(m) {
  return Object.keys(m)
    .filter((v) => m[v])
    .sort((a, b) => (rank(a) === 2) - (rank(b) === 2) ? (rank(a) === 2 ? -1 : 1) : varCmp(a, b))
    .map((v) => (m[v] === 1 ? varTex(v) : `${varTex(v)}^{${m[v]}}`))
    .join(/_/.test(Object.keys(m).join("")) ? "\\," : "");
}
const coefTex = (q, dec) => (dec && q.finiteDecimal ? q.tex({ dec: true }) : q.tex());
function termTex({ m, c }, first, dec) {
  const mt = monoTex(m);
  const neg = c.sign < 0;
  const a = c.abs();
  let body;
  if (!mt) body = coefTex(a, dec);
  else if (a.one) body = mt;
  else if (a.int || (dec && a.finiteDecimal)) body = coefTex(a, dec) + mt;
  else body = `\\frac{${a.n === 1n ? "" : a.n}${mt}}{${a.d}}`;
  if (first) return (neg ? "-" : "") + body;
  return (neg ? " - " : " + ") + body;
}
/** Polinom v TeX (urejen po glavni črki, nato po stopnji). */
export function polyTex(p, dec = false, pos = false) {
  // glavna črka padajoče, nato stopnja, nato po abecedi (y³ + 3y²z + 3yz² + z³)
  const main = MAIN(p.vars());
  const ord = order(p);
  const deg = (m) => Object.values(m).reduce((s, e) => s + e, 0);
  const list = p.terms().sort((a, b) => (b.m[main] || 0) - (a.m[main] || 0) || deg(b.m) - deg(a.m) || lexCmp(b.m, a.m, ord));
  if (!list.length) return "0";
  // več črk ali števec ulomka: začnemo s pozitivnim členom (b² − 4ac, (5 − a)/2)
  if ((pos || p.vars().length > 1) && list[0].c.sign < 0) {
    const i = list.findIndex((t) => t.c.sign > 0);
    if (i > 0) list.unshift(...list.splice(i, 1));
  }
  return list.map((t, i) => termTex(t, i === 0, dec)).join("");
}
const isMonoVar = (p) => p.terms().length === 1;
const factorTex = (f, dec) => {
  const body = isMonoVar(f.p) && f.p.terms()[0].c.one ? polyTex(f.p, dec) : `\\left(${polyTex(f.p, dec)}\\right)`;
  return f.e === 1 ? body : `${body}^{${f.e}}`;
};
// c · Π f^e; vrne [predznak, TeX brez predznaka]
function productTex(c, fs, dec) {
  const neg = c.sign < 0;
  const a = c.abs();
  // črke skupaj spredaj (2πr(h + r)), nato oklepaji
  const m = {};
  for (const f of fs) if (isMonoVar(f.p)) for (const [v, e] of Object.entries(f.p.terms()[0].m)) m[v] = (m[v] || 0) + e * f.e;
  const body = monoTex(m) + fs.filter((f) => !isMonoVar(f.p)).map((f) => factorTex(f, dec)).join("");
  if (!fs.length) return [neg, coefTex(a, dec)];
  if (a.one) return [neg, body];
  return [neg, `${coefTex(a, dec)}${/^\d/.test(body) ? "\\cdot " : ""}${body}`];
}
function fracTex(numTex, denTex, neg) {
  return `${neg ? "-" : ""}\\frac{${numTex}}{${denTex}}`;
}
// Ulomek: števec razvit, imenovalec razstavljen (kot pri poenostavljanju na roko)
function simplifiedTex(r, dec) {
  if (r.d.isConst()) {
    // (x + 1)/2 ostane ulomek, ne x/2 + 1/2
    const L = r.n.denLcm();
    const n = r.n.scale(new Q(L));
    if (L === 1n || n.terms().length < 2 || (dec && r.n.terms().every((t) => t.c.finiteDecimal))) return polyTex(r.n, dec);
    const [cn, np] = prim(n);
    const neg = cn.sign < 0 && np.terms().every((t) => t.c.sign > 0);
    return fracTex(polyTex(neg ? n.scale(-1) : n, dec, true), String(L), neg);
  }
  const fd = factorP(r.d);
  const [cn, n] = prim(r.n);
  const c = cn.div(fd.c);
  const ca = c.abs();
  // −(x − 1)/(x + 2) → (1 − x)/(x + 2); en člen: −1/(x + 2)
  const neg = c.sign < 0 && n.terms().length < 2;
  const numTex = polyTex(n.scale(new Q(c.sign < 0 && !neg ? -ca.n : ca.n)), dec, true);
  const [, denBody] = productTex(new Q(ca.d), fd.fs, dec);
  return fracTex(numTex, ca.d === 1n ? unwrapOne(fd.fs, denBody) : denBody, neg);
}
const unwrapOne = (fs, tex) => (fs.length === 1 && fs[0].e === 1 && tex.startsWith("\\left(") && tex.endsWith("\\right)") ? tex.slice(6, -7) : tex);
function expandedTex(r, dec) {
  if (r.d.isConst()) return polyTex(r.n, dec);
  let [cn, n] = prim(r.n);
  let [cd, d] = prim(r.d);
  const c = cn.div(cd);
  const neg = c.sign < 0;
  const ca = c.abs();
  return fracTex(polyTex(n.scale(new Q(ca.n)), dec), polyTex(d.scale(new Q(ca.d)), dec), neg);
}
function factoredTex(r, dec) {
  const fn = factorP(r.n);
  if (r.d.isConst()) {
    const c = fn.c.div(r.d.constValue());
    const [neg, body] = productTex(c, fn.fs, dec);
    // en sam faktor brez konstante: brez oklepajev (x² + 1)
    if (fn.fs.length === 1 && fn.fs[0].e === 1 && c.abs().one) return (neg ? "-" : "") + polyTex(fn.fs[0].p, dec);
    return (neg ? "-" : "") + body;
  }
  const fd = factorP(r.d);
  const c = fn.c.div(fd.c);
  const neg = c.sign < 0;
  const ca = c.abs();
  const [, top] = productTex(new Q(ca.n), fn.fs, dec);
  const [, bot] = productTex(new Q(ca.d), fd.fs, dec);
  return fracTex(ca.n === 1n ? unwrapOne(fn.fs, top) : top, ca.d === 1n ? unwrapOne(fd.fs, bot) : bot, neg);
}
// vrednosti za preverjanje
const evalR = (r, env) => r.n.eval(env) / r.d.eval(env);
const evalFactored = (f, env) => f.fs.reduce((s, x) => s * x.p.eval(env) ** x.e, f.c.num());

// Pogoji: delitelji, ki so med računanjem izginili iz imenovalca (x ≠ 1 pri (x² − 1)/(x − 1)).
function conditions(dens, finalDen, dec) {
  const fs = [];
  for (const d of dens)
    for (const f of factorP(d).fs) if (!fs.some((x) => x.eq(f.p))) fs.push(f.p);
  const out = fs.filter((f) => !neverZero(f) && (finalDen.isConst() || !divExact(finalDen, f)));
  return out.map((f) => neTex(f, dec));
}
// Faktor, ki za realne vrednosti ni nikoli 0 (x² + 1, x² + x + 1): pogoja »≠ 0« ne pišemo.
function neverZero(f) {
  const ts = f.terms();
  const sgn = ts[0].c.sign;
  if (ts.some((t) => !Object.keys(t.m).length) && ts.every((t) => t.c.sign === sgn && Object.values(t.m).every((e) => e % 2 === 0))) return true;
  const vs = f.vars();
  if (vs.length !== 1 || f.degree(vs[0]) !== 2) return false;
  const [c, b, a] = coeffsIn(f, vs[0]).map((x) => x.constValue());
  return b.mul(b).sub(a.mul(c).mul(4)).sign < 0;
}
function neTex(f, dec) {
  const vs = f.vars();
  const order2 = [...vs].sort((a, b) => (a === "x" ? -1 : b === "x" ? 1 : a < b ? -1 : 1));
  for (const w of order2) {
    if (f.degree(w) !== 1) continue;
    const a = coefIn(f, w, 1);
    if (!a.isConst()) continue;
    const rest = coefIn(f, w, 0).scale(a.constValue().inv().neg());
    return `${varTex(w)} \\ne ${polyTex(rest, dec)}`;
  }
  return `${polyTex(f, dec)} \\ne 0`;
}

// ---------------------------------------------------------------------------
// Preverjanje s števili

function points(vs, n = 20) {
  // določene »naključne« točke (vsakič enake): vrednosti v [−3,1; 3,4], brez celih števil
  const out = [];
  let s = 12345;
  const rnd = () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
  for (let i = 0; i < n; i++) out.push(Object.fromEntries(vs.map((v) => [v, Math.round((rnd() * 6.5 - 3.1) * 1000) / 1000 + 0.0137])));
  return out;
}
const close = (a, b) => Math.abs(a - b) <= 1e-7 * Math.max(1, Math.abs(a), Math.abs(b));

// ---------------------------------------------------------------------------
// Vstop

const CMDS = {
  simplify: "simplify",
  poenostavi: "simplify",
  expand: "expand",
  razvij: "expand",
  factor: "factor",
  razstavi: "factor",
  solve: "solve",
  reši: "solve",
  resi: "solve",
};
/** Imena ukazov v jeziku vmesnika (slovenski zapis za sl, sicer angleški, kot na kalkulatorjih CAS). */
export function commandName(op, locale = "sl") {
  const sl = /^sl/i.test(locale || "");
  return sl ? { simplify: "poenostavi", expand: "razvij", factor: "razstavi", solve: "reši" }[op] : op;
}

/** Se besedilo začne z imenom ukaza CAS in oklepajem (tudi če za zaklepajem sledi še kaj)? */
export function commandStart(text) {
  const m = /^\s*([A-Za-zčšž]+)\s*\(/.exec(String(text ?? ""));
  return !!m && m[1].toLowerCase() in CMDS;
}

/** Je besedilo ukaz CAS? Vrne { op, name, inner, v } ali null. */
export function parseCommand(text) {
  const m = /^\s*([A-Za-zčšž]+)\s*\(/.exec(String(text ?? ""));
  if (!m || !(m[1].toLowerCase() in CMDS)) return null;
  const s = String(text);
  let depth = 0;
  let end = -1;
  for (let i = m[0].length - 1; i < s.length; i++) {
    if (s[i] === "(") depth++;
    else if (s[i] === ")" && --depth === 0) {
      end = i;
      break;
    }
  }
  if (end >= 0 && s.slice(end + 1).trim()) return null; // factor(x) + 1: ni ukaz
  const body = s.slice(m[0].length, end >= 0 ? end : s.length);
  const op = CMDS[m[1].toLowerCase()];
  const parts = splitTop(body, ";").map((x) => x.trim());
  if (op === "solve") return { op, name: m[1], inner: parts[0] || "", v: (parts[1] || "").trim() || null };
  if (parts.length !== 1) return null;
  return { op, name: m[1], inner: parts[0] };
}

/**
 * Izvede ukaz CAS. env kot pri scisolve.analyze (vars, ans, deg, comma) + live (krajša časovna meja).
 * @returns {{ kind:"cas", op, tex, resTex, cond?, plot?, steps? } | { error:{code, info} }}
 */
export function runCas(cmd, env = {}) {
  const comma = env.comma !== false;
  deadline = Date.now() + (env.live ? LIVE_MS : BUDGET_MS);
  let line;
  try {
    line = compileLine(cmd.inner, env);
    if (!line) return { error: { code: "casEmpty", info: {} } };
  } catch (e) {
    return { error: { code: e.code || "other", info: e.info || {} } };
  }
  const innerTex = lineTex(line.ast, comma);
  const name = `\\operatorname{${cmd.name}}`;
  try {
    if (cmd.op === "solve") return solveCmd(cmd, line, name, innerTex);
    if (line.ast.k === "cmp") return { error: { code: "casEquation", info: {} } };
    const ctx = { scope: line.scope, dens: [], dec: false, vars: new Set() };
    const r = rat(line.ast, ctx);
    const vs = [...new Set([...order(r.n, r.d), ...ctx.vars])].sort(varCmp);
    let resTex;
    let check;
    if (cmd.op === "factor") {
      const fn = factorP(r.n);
      const fd = r.d.isConst() ? { c: r.d.constValue(), fs: [] } : factorP(r.d);
      resTex = factoredTex(r, ctx.dec);
      check = (env2) => evalFactored(fn, env2) / evalFactored(fd, env2);
    } else {
      resTex = cmd.op === "expand" ? expandedTex(r, ctx.dec) : simplifiedTex(r, ctx.dec);
      check = (env2) => evalR(r, env2);
    }
    // predolg rezultat KaTeX ne izriše (»Too many expansions«: vsak \, so 3 razširitve od 1000): raje »preveč zapleteno«
    if (resTex.length > 12000 || (resTex.match(/\\,/g) || []).length > 250) throw fail("big");
    if (!verifyExpr(line, vs, check, (env2) => absEval(r.n, env2) / Math.abs(r.d.eval(env2)))) return { error: { code: "casUnverified", info: {} } };
    const cond = conditions(ctx.dens, r.d, ctx.dec);
    const out = { kind: "cas", op: cmd.op, tex: `${name}\\left(${innerTex}\\right)`, resTex, inner: cmd.inner };
    if (cond.length) out.cond = cond.join(",\\; ");
    const free = vs.filter((v) => !(v in SYMBOLS));
    if (free.length === 1 && free[0] === "x") out.plot = [`y = ${cmd.inner}`];
    // »Po korakih« (zaslon Skeniraj) zna poenostaviti in razstaviti polinome
    if (r.d.isConst() && cmd.op !== "expand" && !free.some((v) => v.length > 1)) out.steps = true;
    return out;
  } catch (e) {
    return { error: { code: casCode(e), info: {} } };
  }
}
const casCode = (e) => (e instanceof AlgebraError ? (e.code === "timeout" || e.code === "big" ? "casBig" : e.code === "div0" ? "undef" : e.code === "irrational" ? "casIrrational" : e.code === "unverified" ? "casUnverified" : "casUnsupported") : e?.code || "other");

// Σ|c|·Π|x|^e: velikost členov, ki jih seštejemo (razvit (x + 1)²⁴ izgubi pri x ≈ −1,5 zaradi odštevanja do 1e−8)
function absEval(p, env) {
  let s = 0;
  for (const { m, c } of p.terms()) {
    let t = Math.abs(c.num());
    for (const [v, e] of Object.entries(m)) t *= Math.abs(env[v]) ** e;
    s += t;
  }
  return s;
}

function verifyExpr(line, vs, check, scale) {
  const f = line.run(line.ast);
  let ok = 0;
  for (const pt of points(vs)) {
    const s = Object.create(line.scope);
    Object.assign(s, pt);
    const env2 = { ...pt, ...SYMBOLS };
    const a = f(s);
    const b = check(env2);
    if (typeof a !== "number" || !Number.isFinite(a) || !Number.isFinite(b) || Math.abs(a) > 1e12) continue;
    if (!close(a, b) && !(Math.abs(a - b) <= 1e-11 * scale(env2))) return false;
    ok++;
  }
  return ok >= Math.min(5, vs.length ? 5 : 1);
}

// ---------- reši za črko ----------

function solveCmd(cmd, line, name, innerTex) {
  const ast = line.ast;
  if (ast.k !== "cmp" || ast.ops.length !== 1 || ast.ops[0] !== "=") return { error: { code: "casNeedEq", info: {} } };
  const ctx = { scope: line.scope, dens: [], dec: false };
  const L = rat(ast.terms[0], ctx);
  const Rr = rat(ast.terms[1], ctx);
  const E = cancel(new R(L.n.mul(Rr.d).sub(Rr.n.mul(L.d)), L.d.mul(Rr.d)));
  if (!L.d.isConst()) ctx.dens.push(L.d);
  if (!Rr.d.isConst()) ctx.dens.push(Rr.d);
  const N = E.n;
  const all = order(L.n, L.d, Rr.n, Rr.d).filter((v) => !(v in SYMBOLS));
  const v = cmd.v || MAIN(all);
  if (!v || !/^[\p{L}][\p{L}\d_]*$/u.test(v)) return { error: { code: "casVar", info: { v: v || "" } } };
  const vT = varTex(v);
  const tex = `${name}\\left(${innerTex};\\ ${vT}\\right)`;
  const base = { kind: "cas", op: "solve", tex, v };
  // pogoj ≠ 0 le za faktorje s pravimi črkami (ne »π ≠ 0«)
  const param = (p) => p.vars().some((w) => !(w in SYMBOLS)) && !neverZero(p);
  if (!N.vars().includes(v)) {
    if (N.zero) {
      // x/x = 1: vsa realna števila razen ničel imenovalcev
      const cond = conditions(ctx.dens, ONE(), ctx.dec);
      return { ...base, resTex: `${vT} \\in \\mathbb{R}`, all: true, ...(cond.length ? { cond: cond.join(",\\; ") } : {}) };
    }
    if (!all.includes(v)) return { error: { code: "casVar", info: { v } } };
    return { ...base, resTex: `${vT} \\in \\varnothing`, none: true };
  }
  const { fs } = factorP(N);
  const sols = []; // { tex, n (število vrednosti), fn(env) → [vrednosti] }
  const notes = [];
  for (const f of fs) {
    const d = f.p.degree(v);
    if (!d) {
      // faktor brez iskane črke: (a − 1)x = a² − 1 → (a − 1)(x − a − 1) = 0 velja za a ≠ 1 (pri a = 1 vsak x)
      if (param(f.p)) notes.push(neTex(f.p, ctx.dec));
      continue;
    }
    if (d > 2) return { error: { code: "casDegree", info: { v } } };
    const [c, b, a] = d === 1 ? [coefIn(f.p, v, 0), coefIn(f.p, v, 1), null] : coeffsIn(f.p, v);
    const lc = d === 1 ? b : a;
    if (!lc.isConst()) for (const g of factorP(lc).fs) if (param(g.p)) notes.push(neTex(g.p, ctx.dec));
    if (d === 1) {
      const r = cancel(new R(c.scale(-1), b));
      sols.push({ tex: simplifiedTex(r, ctx.dec), n: 1, fn: (e) => [evalR(r, e)], r });
      continue;
    }
    const q = quadSolution(a, b, c, ctx.dec);
    if (q) sols.push(q);
  }
  if (!sols.length) return { ...base, resTex: `${vT} \\in \\varnothing`, none: true };
  // enake rešitve le enkrat (x² − 2ax + a² = 0)
  const uniq = sols.filter((s, i) => sols.findIndex((o) => o.tex === s.tex) === i);
  // preverjanje: rešitve vstavimo v prvotno enačbo pri naključnih vrednostih ostalih črk
  const others = all.filter((x) => x !== v);
  const Lf = line.run(ast.terms[0]);
  const Rf = line.run(ast.terms[1]);
  const good = uniq.map(() => 0);
  const bad = uniq.map(() => 0);
  for (const pt of points(others)) {
    const env2 = { ...pt, ...SYMBOLS };
    uniq.forEach((s, j) => {
      for (const val of s.fn(env2)) {
        if (!Number.isFinite(val) || Math.abs(val) > 1e9) continue;
        const sc = Object.create(line.scope);
        Object.assign(sc, pt, { [v]: val });
        const l = Lf(sc);
        const r = Rf(sc);
        if (!Number.isFinite(l) || !Number.isFinite(r)) bad[j]++;
        else if (!close(l, r)) throw fail("unverified");
        else good[j]++;
      }
    });
  }
  // rešitev, pri kateri je imenovalec vedno 0 (x = a pri x²/(x − a) = a²/(x − a)), ni rešitev
  // rešitev brez realne vrednosti pri vseh preizkusih (x² + ax + a² = 0) izpustimo
  const kept = uniq.filter((s, j) => good[j] > 0);
  if (!kept.length) return { ...base, resTex: `${vT} \\in \\varnothing`, none: true };
  if (good.reduce((x, y) => x + y, 0) < 3) return { error: { code: "casUnverified", info: {} } };
  uniq.splice(0, uniq.length, ...kept);
  // imenovalci z iskano črko: rešitev vstavimo vanje (a/x = 1 → x = a velja za a ≠ 0)
  const vDens = ctx.dens.flatMap((d) => factorP(d).fs.map((f) => f.p)).filter((f) => f.vars().includes(v));
  for (const s of uniq)
    if (s.r)
      for (const f of vDens) {
        const n = substR(f, v, s.r).n;
        if (!n.isConst()) for (const g of factorP(n).fs) if (param(g.p)) notes.push(neTex(g.p, ctx.dec));
      }
  const total = uniq.reduce((s, x) => s + x.n, 0);
  let k = 1;
  const resTex = uniq
    .map((s) => {
      const sub = total === 1 ? "" : s.n === 2 ? `_{${k},${k + 1}}` : `_{${k}}`;
      k += s.n;
      return `${vT}${sub} = ${s.tex}`;
    })
    .join(",\\quad ");
  // pogoji imenovalcev brez iskane črke (tisti z njo so preverjeni pri vsaki rešitvi)
  const cond = [...new Set([...notes, ...conditions(ctx.dens.flatMap((d) => factorP(d).fs.map((f) => f.p)).filter((f) => !f.vars().includes(v)), ONE(), ctx.dec)])];
  const out = { ...base, resTex };
  if (cond.length) out.cond = cond.join(",\\; ");
  return out;
}

// p(v) pri v = r (r ulomek polinomov), Hornerjev postopek
function substR(p, v, r) {
  const cs = coeffsIn(p, v);
  let acc = new R(cs[cs.length - 1]);
  for (let k = cs.length - 2; k >= 0; k--) acc = cancel(new R(acc.n.mul(r.n).add(cs[k].mul(acc.d).mul(r.d)), acc.d.mul(r.d)));
  return acc;
}

// a·v² + b·v + c = 0 (a, b, c polinomi v ostalih črkah) → { tex, n: 2, fn } ali null (ni realnih rešitev)
function quadSolution(a, b, c, dec) {
  if (prim(a)[0].sign < 0) [a, b, c] = [a.scale(-1), b.scale(-1), c.scale(-1)];
  if (b.zero) {
    // a·v² + c = 0 → v = ±√(−c/a)
    const r = cancel(new R(c.scale(-1), a));
    // ni realnih rešitev le, če je −c/a vedno negativen (x² + 1 = 0); ax² + 1 = 0 ima rešitve za a < 0
    if (r.n.isConst() && r.n.constValue().sign < 0 && (r.d.isConst() || neverZero(r.d))) return null;
    if (r.d.isConst() && r.n.isConst()) {
      const sq = sqrtConst(r.n.constValue());
      return { tex: `\\pm ${sq.tex}`, n: 2, fn: () => [sq.value, -sq.value] };
    }
    const rt = simplifiedTex(r, dec);
    return { tex: `\\pm\\sqrt{${rt}}`, n: 2, fn: (e) => [Math.sqrt(evalR(r, e)), -Math.sqrt(evalR(r, e))] };
  }
  const D = b.mul(b).sub(a.mul(c).scale(4));
  if (D.isConst() && D.constValue().sign < 0) return null;
  // √D = S·√M (kvadratne faktorje D postavimo pred koren), nato krajšamo skupni faktor −b, S in 2a
  const fd = factorP(D);
  let S = ONE();
  let M = ONE();
  for (const f of fd.fs) {
    S = S.mul(powP(f.p, Math.floor(f.e / 2)));
    if (f.e % 2) M = M.mul(f.p);
  }
  const cs = sqrtConstParts(fd.c);
  S = S.scale(cs.out);
  M = M.scale(cs.in.mul(fd.c.sign));
  let mb = b.scale(-1);
  let den = a.scale(2);
  const G = gcd(gcd(mb, S), den);
  const [k1] = prim(mb);
  const [k2] = prim(S);
  const [k3] = prim(den);
  const kq = gcdPos(gcdPos(k1, k2), k3);
  for (const g of [G, P.num(kq)]) {
    if (g.isConst() && g.constValue().one) continue;
    mb = divExact(mb, g);
    S = divExact(S, g);
    den = divExact(den, g);
  }
  if (!mb || !S || !den) return null;
  if (prim(den)[0].sign < 0) [mb, den] = [mb.scale(-1), den.scale(-1)];
  if (prim(S)[0].sign < 0) S = S.scale(-1);
  const sTex = S.isConst() && S.constValue().one ? "" : S.terms().length > 1 ? `\\left(${polyTex(S, dec)}\\right)` : polyTex(S, dec);
  const top = `${polyTex(mb, dec)} \\pm ${sTex}\\sqrt{${polyTex(M, dec)}}`;
  const one = den.isConst() && den.constValue().one;
  return {
    tex: one ? top : `\\frac{${top}}{${polyTex(den, dec)}}`,
    n: 2,
    fn: (e) => {
      const s = S.eval(e) * Math.sqrt(M.eval(e));
      return [(mb.eval(e) + s) / den.eval(e), (mb.eval(e) - s) / den.eval(e)];
    },
  };
}
const gcdPos = (a, b) => new Q(gcdInt(a.n * b.d, b.n * a.d), a.d * b.d).abs();
// q = out² · in, in celo število brez kvadratnih faktorjev (8 = 2²·2, 1/3 = (1/3)²·3)
function sqrtConstParts(q) {
  q = q.abs();
  let n = q.n * q.d; // √(p/q) = √(pq)/q
  let out = 1n;
  for (let p = 2n; p * p <= n && p < 100000n; p++) {
    while (n % (p * p) === 0n) {
      n /= p * p;
      out *= p;
    }
  }
  return { out: new Q(out, q.d), in: new Q(n) };
}
function sqrtConst(q) {
  const { out, in: inn } = sqrtConstParts(q);
  const value = Math.sqrt(q.num());
  if (inn.one) return { tex: out.tex(), value };
  return { tex: `${out.one ? "" : out.tex()}\\sqrt{${inn.tex()}}`, value };
}

/**
 * Ali lahko izraz (brez ukaza) obdelamo simbolno? Za gumbe Poenostavi / Razvij / Razstavi in Reši za … pod vrstico.
 * Vrne seznam črk (za »Reši za«) ali null.
 */
export function casInfo(ast, scope) {
  deadline = Date.now() + LIVE_MS;
  try {
    const ctx = { scope, dens: [], dec: false };
    if (ast.k === "cmp") {
      if (ast.ops.length !== 1 || ast.ops[0] !== "=") return null;
      const a = rat(ast.terms[0], ctx);
      const b = rat(ast.terms[1], ctx);
      return order(a.n, a.d, b.n, b.d).filter((v) => !(v in SYMBOLS));
    }
    const r = rat(ast, ctx);
    return order(r.n, r.d).filter((v) => !(v in SYMBOLS));
  } catch {
    return null;
  }
}
