// Simbolno računanje, 3. faza: koreni in potence, kotne funkcije, logaritmi in eksponentne funkcije (ukaza poenostavi, razvij).
// Razširi ulomke polinomov iz cas.js z »atomi«: dodatnimi spremenljivkami s posebnimi imeni ⟨k⟩ (rat → ctx.ext, ctx.fix).
// - koren: generator g = ᴸ√b z relacijo g^L = b (b praštevilo, črka ali nerazcepen polinom), |b| z relacijo |b|² = b²,
// - kotne funkcije: s = sin u, c = cos u za osnovni kot u (črka/d ali nelinearen argument) z relacijo s² = 1 − c²,
// - logaritmi: ℓ_f = ln f za praštevila in nerazcepne faktorje (log_B X = ln X / ln B),
// - eksponentne funkcije: e^(m/d) za monom m.
// Vsak polinom sproti zmanjšamo po relacijah, imenovalec racionaliziramo (adjunkta matrike množenja), nato krajšamo.
// Zapis izbere najkrajšo od enakovrednih oblik (sin² ↔ 1 − cos², tan, osnova logaritma, en logaritem), vsak rezultat
// (tudi izbrani zapis) pa preverimo s števili v istem načinu kotov kot kalkulator. Brez DOM; teče tudi v Node (test/cas3.test.js).
import { Q, P, AlgebraError, gcdInt, lcmInt, gcdQ } from "../scan/algebra.js";
import { KIT } from "./cas.js";

const fail = (code) => new AlgebraError(code);
const tick = () => KIT.tick();
const ONE = () => P.num(1);
const mono = (m, c = Q.ONE) => new P([{ m, c: Q.of(c) }]);
const MAX_L = 12; // največji red korena
export const isAtom = (v) => v[0] === "⟨";
class Restart {} // nov red korena ali kota: račun ponovimo z novimi generatorji
const pkey = (p) => p.text();
const lcmN = (a, b) => Number(lcmInt(BigInt(a), BigInt(b)));
const unwrap = (n) => (n?.k === "grp" ? unwrap(n.a) : n);
const hasAtoms = (r) => r.n.vars().some(isAtom) || r.d.vars().some(isAtom);
const mergeM = (a, b) => {
  const o = { ...a };
  for (const [v, e] of Object.entries(b)) o[v] = (o[v] || 0) + e;
  return o;
};
let CUR = null; // atomi za zapis (ATOM_TEX)

// ---------------------------------------------------------------------------
// Kontekst in atomi

export function newCtx(line, env = {}) {
  const ctx = {
    scope: line.scope,
    mode: env.grad ? "grad" : env.deg ? "deg" : "rad",
    unit: env.grad ? Math.PI / 200 : env.deg ? Math.PI / 180 : 1,
    Lmap: new Map(), // osnova korena → red L
    trigD: new Map(), // črka → d (osnovni kot črka/d)
    expD: new Map(),
    nonneg: new Set(),
  };
  ctx.ext = (node, c, e) => ext(node, c, e);
  ctx.fix = (r) => fix(r, ctx);
  reset(ctx);
  return ctx;
}
function reset(ctx) {
  Object.assign(ctx, { atoms: [], byKey: new Map(), byName: new Map(), dens: [], domain: new Map(), dec: false, vars: new Set(), logBases: new Set(), logBaseR: new Map(), absMade: new Set() });
  CUR = ctx;
}
/** Izračun fn() z generatorji; ob novem redu korena (√x · ∛x → ⁶√x) ali kota (sin x, sin(x/2)) ponovi. */
export function attempt(ctx, fn) {
  for (let i = 0; i < 8; i++) {
    reset(ctx);
    try {
      return fn();
    } catch (e) {
      if (!(e instanceof Restart)) throw e;
    }
  }
  throw fail("big");
}
function atom(ctx, key, props) {
  let a = ctx.byKey.get(key);
  if (a) return a;
  a = { name: `⟨${ctx.atoms.length}⟩`, key, ...props };
  ctx.atoms.push(a);
  ctx.byKey.set(key, a);
  ctx.byName.set(a.name, a);
  return a;
}
/** Vrednosti atomov v točki (po vrsti nastanka: kasnejši so lahko odvisni od prejšnjih). */
export function atomEnv(ctx, env) {
  const e = { ...env };
  for (const a of ctx.atoms) e[a.name] = a.val(e);
  return e;
}

// ---------------------------------------------------------------------------
// Relacije: zmanjšanje, racionalizacija imenovalca

function reduce(p, ctx) {
  for (const a of ctx.atoms) {
    if (!a.rel || p.degree(a.name) < a.rel.L) continue;
    const L = a.rel.L;
    const out = new P();
    const pw = [];
    for (const { m, c } of p.terms()) {
      const e = m[a.name] || 0;
      if (e < L) {
        out.addTerm(m, c);
        continue;
      }
      tick();
      const q = Math.floor(e / L);
      const mm = { ...m, [a.name]: e - q * L };
      const rq = pw[q] || (pw[q] = KIT.powP(a.rel.r, q));
      for (const t of rq.terms()) out.addTerm(mergeM(mm, t.m), c.mul(t.c));
    }
    p = out;
  }
  return p;
}
function fix(r, ctx) {
  if (!ctx.atoms.some((a) => a.rel)) return r;
  let n = reduce(r.n, ctx);
  let d = reduce(r.d, ctx);
  for (const a of ctx.atoms) {
    if (!a.rel) continue;
    for (let guard = 0; d.degree(a.name) > 0; guard++) {
      if (guard > 3) throw fail("big");
      const C = cofactor(d, a, ctx);
      n = reduce(n.mul(C), ctx);
      d = reduce(d.mul(C), ctx);
    }
  }
  if (d.zero) throw fail("div0");
  return KIT.cancel(new KIT.R(n, d));
}
// D·C = N(D) brez g (C iz adjunkte matrike množenja z D v bazi 1, g, …, g^(L−1))
function cofactor(D, a, ctx) {
  const L = a.rel.L;
  const g = a.name;
  const M = Array.from({ length: L }, () => Array(L));
  for (let j = 0; j < L; j++) {
    const col = reduce(D.mul(mono({ [g]: j })), ctx);
    for (let i = 0; i < L; i++) M[i][j] = KIT.coefIn(col, g, i);
  }
  let C = new P();
  for (let i = 0; i < L; i++) {
    const minor = M.slice(1).map((row) => row.filter((_, k) => k !== i));
    C = C.add(detP(minor).mul(mono({ [g]: i })).scale(i % 2 ? -1 : 1));
  }
  return C;
}
/** Determinanta matrike polinomov (Bareiss, deljenje brez ostanka). */
export function detP(M) {
  const n = M.length;
  if (!n) return ONE();
  if (n === 1) return M[0][0];
  if (n === 2) return M[0][0].mul(M[1][1]).sub(M[0][1].mul(M[1][0]));
  const A = M.map((r) => r.slice());
  let sign = 1;
  let prev = ONE();
  for (let k = 0; k < n - 1; k++) {
    let p = k;
    while (p < n && A[p][k].zero) p++;
    if (p === n) return new P();
    if (p !== k) {
      [A[p], A[k]] = [A[k], A[p]];
      sign = -sign;
    }
    for (let i = k + 1; i < n; i++)
      for (let j = k + 1; j < n; j++) {
        tick();
        const q = KIT.divExact(A[i][j].mul(A[k][k]).sub(A[i][k].mul(A[k][j])), prev);
        if (!q) throw fail("internal");
        A[i][j] = q;
      }
    prev = A[k][k];
  }
  return A[n - 1][n - 1].scale(sign);
}

// ---------------------------------------------------------------------------
// Računske operacije z ulomki (z relacijami)

const R = (n, d) => new KIT.R(n, d || ONE());
export const ops = {
  add: (ctx, a, b) => fix(KIT.cancel(R(a.n.mul(b.d).add(b.n.mul(a.d)), a.d.mul(b.d))), ctx),
  sub: (ctx, a, b) => fix(KIT.cancel(R(a.n.mul(b.d).sub(b.n.mul(a.d)), a.d.mul(b.d))), ctx),
  mul: (ctx, a, b) => fix(KIT.cancel(R(a.n.mul(b.n), a.d.mul(b.d))), ctx),
  // dens: delitelj si zapomnimo za pogoj »≠ 0«
  div: (ctx, a, b, dens = true) => {
    if (b.n.zero) throw fail("div0");
    if (dens && !b.n.isConst()) ctx.dens.push(b.n);
    return fix(KIT.cancel(R(a.n.mul(b.d), a.d.mul(b.n))), ctx);
  },
};
function powInt(ctx, r, k) {
  if (Math.abs(k) > KIT.MAX_POW) throw fail("big");
  const p = fix(R(KIT.powP(r.n, Math.abs(k)), KIT.powP(r.d, Math.abs(k))), ctx);
  return k >= 0 ? p : ops.div(ctx, R(ONE()), p, false);
}

// ---------------------------------------------------------------------------
// Razcep na praštevila in nerazcepne faktorje

function primeFactors(n) {
  const out = [];
  if (n <= 1n) return out;
  if (n > 10n ** 12n) throw fail("big");
  let N = Number(n);
  for (let p = 2; p * p <= N; p += p === 2 ? 1 : 2) {
    if (p % 8192 === 1) tick();
    let e = 0;
    while (N % p === 0) {
      N /= p;
      e++;
    }
    if (e) out.push([p, e]);
  }
  if (N > 1) out.push([N, 1]);
  return out;
}
/** r = predznak · Π p^e (p praštevila kot konstantni polinomi in nerazcepni polinomi; e < 0 v imenovalcu). */
function factorList(r) {
  const fn = KIT.factorP(r.n);
  const fd = r.d.isConst() ? { c: r.d.constValue(), fs: [] } : KIT.factorP(r.d);
  const c = fn.c.div(fd.c);
  const fs = [...fn.fs.map((f) => ({ p: f.p, e: f.e })), ...fd.fs.map((f) => ({ p: f.p, e: -f.e }))];
  const a = c.abs();
  for (const [p, e] of primeFactors(a.n)) fs.push({ p: P.num(p), e });
  for (const [p, e] of primeFactors(a.d)) fs.push({ p: P.num(p), e: -e });
  return { sign: c.sign, fs };
}
// predznak minus prenesemo na faktor z lihim eksponentom (√(−x) = √(−x), ne √(−1)·√x)
function foldSign(fs) {
  const f = fs.find((x) => x.e % 2 && !x.p.isConst() && !x.p.vars().some(isAtom));
  if (!f) throw fail("domain");
  f.p = f.p.scale(-1);
}
const isSym = (p) => p.terms().length === 1 && p.terms()[0].c.one && Object.keys(p.terms()[0].m).length === 1 && (p.vars()[0] === "π" || p.vars()[0] === "e");
function isNonneg(ctx, p) {
  if (p.isConst()) return p.constValue().sign >= 0;
  if (isSym(p) || ctx.nonneg.has(pkey(p))) return true;
  // vsota sodih potenc s pozitivnimi koeficienti (x² + 1)
  return p.terms().every((t) => t.c.sign > 0 && Object.values(t.m).every((e) => e % 2 === 0));
}
// pogoj p ≥ 0 (ali p > 0) za koren ali logaritem; x² + 1 ga ne potrebuje
function needNonneg(ctx, p, op) {
  if (p.isConst() || isSym(p)) return;
  const k = pkey(p);
  const even = p.terms().every((t) => t.c.sign > 0 && Object.values(t.m).every((e) => e % 2 === 0));
  if (!(even && (op === "≥" || p.terms().some((t) => !Object.keys(t.m).length)))) {
    const old = ctx.domain.get(k);
    const strict = op !== "≥" || old?.op === ">";
    ctx.domain.set(k, { p, op: strict ? ">" : "≥", log: old?.log || op === "log" });
  }
  if (!ctx.nonneg.has(k)) {
    ctx.nonneg.add(k);
    if (ctx.absMade.has(k)) throw new Restart(); // |p| že uporabljen: zdaj vemo, da je |p| = p
  }
}

// ---------------------------------------------------------------------------
// A. Koreni in potence

const realRoot = (x, L) => (L % 2 ? Math.sign(x) * Math.abs(x) ** (1 / L) : x < 0 ? NaN : x ** (1 / L));
const free = (p) => p.vars().some((v) => !isAtom(v) && v !== "π" && v !== "e");
// ⁿ√(b^e) = g^(e·L/n) za generator g = ᴸ√b
function rootPow(ctx, b, n, e) {
  const k0 = pkey(b);
  const L = ctx.Lmap.get(k0) || 1;
  if (L % n) {
    const L2 = lcmN(L, n);
    if (L2 > MAX_L) throw fail("big");
    ctx.Lmap.set(k0, L2);
    throw new Restart();
  }
  const k = (e * L) / n;
  const q = Math.floor(k / L);
  const rem = k - q * L;
  let out = KIT.powP(b, q);
  if (rem) {
    const g = atom(ctx, "rad:" + k0, { kind: "rad", base: b, L, rel: { L, r: b }, free: free(b), val: (env) => realRoot(b.eval(env), L) });
    out = out.mul(mono({ [g.name]: rem }));
  }
  return out;
}
function absP(ctx, f) {
  if (isNonneg(ctx, f)) return f;
  const k = pkey(f);
  ctx.absMade.add(k);
  const a = atom(ctx, "abs:" + k, { kind: "abs", base: f, rel: { L: 2, r: f.mul(f) }, free: true, val: (env) => Math.abs(f.eval(env)) });
  return P.v(a.name);
}
/** ⁿ√r; forced: potenca z ulomkom v eksponentu (x^(1/3) je v kalkulatorju definiran le za x ≥ 0). */
function rootR(ctx, r, n, forced = false, strict = false) {
  if (hasAtoms(r)) throw fail("unsupported");
  if (r.n.zero) return R(new P());
  if (n === 1) return r;
  if (!Number.isInteger(n) || n < 1 || n > MAX_L) throw fail("unsupported");
  const { sign, fs } = factorList(r);
  let s = 1;
  if (sign < 0) {
    if (n % 2 && !forced) s = -1;
    else foldSign(fs);
  }
  for (const f of fs) {
    f.q = Math.floor(f.e / n);
    f.rem = f.e - f.q * n;
    if (f.rem && (n % 2 === 0 || forced)) needNonneg(ctx, f.p, f.e < 0 || strict ? ">" : "≥");
    if (forced && f.q && !f.p.isConst()) needNonneg(ctx, f.p, f.e < 0 || strict ? ">" : "≥");
  }
  let out = R(P.num(s));
  for (const f of fs) {
    if (f.rem) out = ops.mul(ctx, out, R(rootPow(ctx, f.p, n, f.rem)));
    if (f.q) {
      const b = n % 2 === 0 && f.q % 2 && !forced ? absP(ctx, f.p) : f.p;
      out = ops.mul(ctx, out, powInt(ctx, R(b), f.q));
    }
  }
  return out;
}
function absR(ctx, r) {
  if (hasAtoms(r)) throw fail("unsupported");
  if (r.n.zero) return r;
  const { fs } = factorList(r);
  let out = R(ONE());
  for (const f of fs) {
    if (f.e % 2 === 0 || isNonneg(ctx, f.p)) out = ops.mul(ctx, out, powInt(ctx, R(f.p), f.e));
    else out = ops.mul(ctx, out, ops.mul(ctx, R(absP(ctx, f.p)), powInt(ctx, R(f.p), f.e - 1)));
  }
  return out;
}
// b^k za ulomek k = p/q
function powQ(ctx, base, k) {
  if (k.int) return powInt(ctx, base, Number(k.n));
  const p = Number(k.n);
  const q = Number(k.d);
  if (Math.abs(p) > KIT.MAX_POW || q > MAX_L) throw fail("big");
  const rr = rootR(ctx, powInt(ctx, base, Math.abs(p)), q, true, p < 0);
  return p < 0 ? ops.div(ctx, R(ONE()), rr, false) : rr;
}

// ---------------------------------------------------------------------------
// B. Kotne funkcije

// cos(k·15°) za k z imenovalcem 1, 2, 3, 4, 6 (k sod ali deljiv s 3)
function cosK(ctx, k) {
  k = ((k % 24) + 24) % 24;
  if (k > 12) k = 24 - k;
  if (k > 6) return cosK(ctx, 12 - k).scale(-1);
  if (k === 0) return ONE();
  if (k === 6) return new P();
  if (k === 4) return P.num(new Q(1n, 2n));
  return rootPow(ctx, P.num(k === 2 ? 3 : 2), 2, 1).scale(new Q(1n, 2n));
}
function trigAtoms(ctx, key, info) {
  const S = ctx.byKey.get("sin:" + key);
  if (S) return { S: S.name, C: ctx.byKey.get("cos:" + key).name };
  const ang = info.v ? (env) => env[info.v] / info.d : (env) => KIT.evalR(info.arg, env);
  const cName = `⟨${ctx.atoms.length + 1}⟩`;
  const fr = info.v ? true : free(info.arg.n) || free(info.arg.d);
  const s = atom(ctx, "sin:" + key, { kind: "sin", info, ang, free: fr, rel: { L: 2, r: ONE().sub(P.v(cName).mul(P.v(cName))) }, val: (env) => Math.sin(ang(env) * ctx.unit) });
  atom(ctx, "cos:" + key, { kind: "cos", info, ang, free: fr, val: (env) => Math.cos(ang(env) * ctx.unit) });
  return { S: s.name, C: cName };
}
function cmul(ctx, a, b) {
  return { re: reduce(a.re.mul(b.re).sub(a.im.mul(b.im)), ctx), im: reduce(a.re.mul(b.im).add(a.im.mul(b.re)), ctx) };
}
// e^(i·arg) = cos arg + i sin arg
function angle(ctx, arg) {
  const lin = linearArg(ctx, arg);
  if (lin) return lin;
  // nelinearen argument: svoj osnovni kot; −x² → x² (sin je lih)
  let a = arg;
  let sg = 1;
  if (KIT.prim(a.n)[0].sign < 0) {
    a = R(a.n.scale(-1), a.d);
    sg = -1;
  }
  const { S, C } = trigAtoms(ctx, "o:" + pkey(a.n) + "/" + pkey(a.d), { arg: a });
  return { re: P.v(C), im: P.v(S).scale(sg) };
}
function linearArg(ctx, arg) {
  if (hasAtoms(arg) || !arg.d.isConst()) return null;
  const n = arg.n.scale(arg.d.constValue().inv());
  if (n.degree() > 1) return null;
  let q0 = Q.ZERO;
  let qpi = Q.ZERO;
  const lets = [];
  for (const { m, c } of n.terms()) {
    const ks = Object.keys(m);
    if (!ks.length) q0 = c;
    else if (ks[0] === "π") qpi = c;
    else if (ks[0] === "e") return null;
    else lets.push([ks[0], c]);
  }
  let t; // zamik v enotah π
  if (ctx.mode === "rad") {
    if (!q0.zero) return null;
    t = qpi;
  } else {
    if (!qpi.zero) return null;
    t = q0.div(ctx.mode === "deg" ? 180 : 200);
  }
  const k12 = t.mul(12);
  if (!k12.int || (k12.n % 2n && k12.n % 3n)) return null;
  const k = Number(k12.n % 24n);
  let z = { re: cosK(ctx, k), im: cosK(ctx, 6 - k) };
  for (const [v, c] of lets) {
    const d = ctx.trigD.get(v) || 1;
    const nq = c.mul(d);
    if (!nq.int) {
      ctx.trigD.set(v, lcmN(d, Number(c.d)));
      throw new Restart();
    }
    const kk = Number(nq.n);
    if (Math.abs(kk) > 12) return null; // sin(30x): svoj osnovni kot, ne polinom 30. stopnje
    const { S, C } = trigAtoms(ctx, "v:" + v, { v, d });
    const w = { re: P.v(C), im: P.v(S).scale(kk < 0 ? -1 : 1) };
    for (let i = 0; i < Math.abs(kk); i++) z = cmul(ctx, z, w);
  }
  return z;
}
function trigR(ctx, f, arg) {
  const z = () => angle(ctx, arg);
  switch (f) {
    case "sin":
      return R(z().im);
    case "cos":
      return R(z().re);
    case "tan":
    case "cot":
    case "sec":
    case "csc": {
      const w = z();
      const num = { tan: w.im, cot: w.re, sec: ONE(), csc: ONE() }[f];
      const den = { tan: w.re, cot: w.im, sec: w.re, csc: w.im }[f];
      return ops.div(ctx, R(num), R(den));
    }
  }
  throw fail("unsupported");
}

// ---------------------------------------------------------------------------
// C. Logaritmi in eksponentne funkcije

// ln r = Σ e·ℓ_f (+ eksponenti atomov e^…); domain: zapišemo pogoj f > 0
function lnOf(ctx, r, domain = true) {
  if (r.n.zero) throw fail("domain");
  const { sign, fs } = factorList(r);
  if (sign < 0) foldSign(fs);
  let out = R(new P());
  for (const { p, e } of fs) {
    const ts = p.terms();
    const v = ts.length === 1 && ts[0].c.one && Object.keys(ts[0].m).length === 1 ? Object.keys(ts[0].m)[0] : null;
    if (v === "e" && ts[0].m.e === 1) {
      out = ops.add(ctx, out, R(P.num(e)));
      continue;
    }
    const ea = v && ts[0].m[v] === 1 && ctx.byName.get(v);
    if (ea?.kind === "exp") {
      out = ops.add(ctx, out, R(ea.expoR.n.scale(e), ea.expoR.d));
      continue;
    }
    // ln ᴸ√b = (1/L)·ln b
    if (ea?.kind === "rad") {
      const lb = lnOf(ctx, R(ea.base), domain);
      out = ops.add(ctx, out, R(lb.n.scale(new Q(BigInt(e), BigInt(ea.L))), lb.d));
      continue;
    }
    if (domain && !p.isConst()) needNonneg(ctx, p, "log");
    const a = atom(ctx, "log:" + pkey(p), { kind: "log", base: p, free: free(p), val: (env) => Math.log(p.eval(env)) });
    out = ops.add(ctx, out, R(P.v(a.name).scale(e)));
  }
  return out;
}
function logR(ctx, arg, base) {
  const num = lnOf(ctx, arg);
  if (base === "e") {
    ctx.logBases.add("e");
    return num;
  }
  const den = lnOf(ctx, base);
  if (den.n.zero) throw fail("domain");
  ctx.logBases.add(base.n.isConst() && base.d.isConst() ? base.n.constValue().div(base.d.constValue()).toString() : "p:" + pkey(base.n) + "/" + pkey(base.d));
  ctx.logBaseR.set([...ctx.logBases].pop(), base);
  return ops.div(ctx, num, den, false);
}
// e^f
function expR(ctx, f) {
  if (!f.d.isConst()) {
    const a = atom(ctx, "eo:" + pkey(f.n) + "/" + pkey(f.d), { kind: "exp", m: null, d: 1, arg: f, expoR: f, free: true, val: (env) => Math.exp(KIT.evalR(f, env)) });
    return R(P.v(a.name));
  }
  const n = f.n.scale(f.d.constValue().inv());
  let out = R(ONE());
  for (const { m, c } of n.terms()) {
    const ks = Object.keys(m);
    if (!ks.length) {
      out = ops.mul(ctx, out, powQ(ctx, R(P.v("e")), c));
      continue;
    }
    const la = ks.length === 1 && m[ks[0]] === 1 && ctx.byName.get(ks[0]);
    if (la?.kind === "log") {
      // e^(c·ln p) = p^c
      out = ops.mul(ctx, out, powQ(ctx, R(la.base), c));
      continue;
    }
    const key = "exp:" + pkey(mono(m));
    const d = ctx.expD.get(key) || 1;
    const nq = c.mul(d);
    if (!nq.int) {
      ctx.expD.set(key, lcmN(d, Number(c.d)));
      throw new Restart();
    }
    const k = Number(nq.n);
    if (Math.abs(k) > KIT.MAX_POW) throw fail("big");
    const expo = mono(m, new Q(1n, BigInt(d)));
    const a = atom(ctx, key, { kind: "exp", m, d, expoR: R(expo), free: free(mono(m)), val: (env) => Math.exp(expo.eval(env)) });
    const pk = R(mono({ [a.name]: Math.abs(k) }));
    out = k > 0 ? ops.mul(ctx, out, pk) : ops.div(ctx, out, pk, false);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Vozlišča, ki jih cas.js ne pozna

function constInt(r) {
  if (!r.n.isConst() || !r.d.isConst()) return null;
  const q = r.n.constValue().div(r.d.constValue());
  return q.int ? Number(q.n) : null;
}
function ext(node, ctx, eR) {
  const r = (x) => KIT.rat(x, ctx);
  if (node.k === "^") {
    const b = unwrap(node.a);
    if (b.k === "const" && b.name === "e") return expR(ctx, eR);
    if (eR.n.isConst() && eR.d.isConst()) return powQ(ctx, r(node.a), eR.n.constValue().div(eR.d.constValue()));
    // a^x = e^(x·ln a) za a > 0
    const base = r(node.a);
    if (hasAtoms(base)) throw fail("unsupported");
    return expR(ctx, ops.mul(ctx, eR, lnOf(ctx, base)));
  }
  if (node.k !== "call") throw fail("unsupported");
  const a = node.args;
  const one = () => {
    if (a.length !== 1) throw fail("unsupported");
    return r(a[0]);
  };
  switch (node.f) {
    case "sqrt":
      return rootR(ctx, one(), 2);
    case "cbrt":
      return rootR(ctx, one(), 3);
    case "root": {
      if (a.length !== 2) throw fail("unsupported");
      const n = constInt(r(a[1]));
      if (!n || n < 1) throw fail("unsupported");
      return rootR(ctx, r(a[0]), n);
    }
    case "abs":
      return absR(ctx, one());
    case "sin":
    case "cos":
    case "tan":
    case "cot":
    case "sec":
    case "csc":
      return trigR(ctx, node.f, one());
    case "ln":
      return logR(ctx, one(), "e");
    case "log":
      return logR(ctx, one(), R(P.num(10)));
    case "logb": {
      if (a.length !== 2) throw fail("unsupported");
      const base = r(a[1]);
      if (hasAtoms(base)) throw fail("unsupported");
      return logR(ctx, r(a[0]), base);
    }
    case "exp":
      return expR(ctx, one());
  }
  throw fail("unsupported");
}

// ---------------------------------------------------------------------------
// Zapis atomov v TeX (cas.js monoTex pokliče ATOM_TEX za del monoma z atomi)

const bare = (t) => /^(?:[A-Za-zπ]|\d+)$/.test(t);
const argTex = (t) => (bare(t) ? ` ${t}` : `\\left(${t}\\right)`);
function radTex(list) {
  // list: [{ base, ex, idx }] z enakim korenskim eksponentom
  let N = 1n;
  const fs = [];
  let sign = 1;
  for (const { base, ex } of list) {
    if (base.isConst()) N *= base.constValue().n ** BigInt(ex);
    else {
      let b = base;
      if (KIT.prim(b)[0].sign < 0 && b.terms().length > 1) fs.push({ p: b, e: ex });
      else {
        if (KIT.prim(b)[0].sign < 0) {
          b = b.scale(-1);
          if (ex % 2) sign = -sign;
        }
        fs.push({ p: b, e: ex });
      }
    }
  }
  let body;
  if (fs.length === 1 && fs[0].e === 1 && N === 1n && sign > 0) body = KIT.polyTex(fs[0].p);
  else {
    const [, t] = KIT.productTex(new Q(N), fs);
    body = (sign < 0 ? "-" : "") + t;
  }
  const idx = list[0].idx;
  return idx === 2 ? `\\sqrt{${body}}` : `\\sqrt[${idx}]{${body}}`;
}
function angTex(info) {
  if (info.v) return info.d === 1 ? ` ${KIT.varTex(info.v)}` : `\\frac{${KIT.varTex(info.v)}}{${info.d}}`;
  return argTex(KIT.simplifiedTex(info.arg, false));
}
const LOG_PRE = (B) => (B === "10" ? "\\log" : B === "e" ? "\\ln" : `\\log_{${B}}`);
const powTex = (f, k) => (k === 1 ? f : `${f}^{${k}}`);
export function ATOM_TEX(m) {
  const ctx = CUR;
  const list = Object.keys(m).map((v) => ({ a: ctx?.byName.get(v), k: m[v], v }));
  const order = { abs: 0, rad: 1, exp: 2, log: 3, dlog: 3, logc: 3, sin: 4, cos: 4, tan: 4, cot: 4 };
  list.sort((x, y) => (order[x.a?.kind] ?? 9) - (order[y.a?.kind] ?? 9) || Number(x.v.slice(1, -1)) - Number(y.v.slice(1, -1)));
  const part = { abs: "", exp: "", fn: "" };
  const rads = new Map();
  for (const { a, k, v } of list) {
    let out = "";
    if (!a) {
      part.fn += v;
      continue;
    }
    switch (a.kind) {
      case "abs":
        out += powTex(`\\left|${KIT.polyTex(a.base)}\\right|`, k);
        break;
      case "rad": {
        const g = Number(gcdInt(BigInt(k), BigInt(a.L)));
        const idx = a.L / g;
        if (!rads.has(idx)) rads.set(idx, []);
        rads.get(idx).push({ base: a.base, ex: k / g, idx });
        break;
      }
      case "exp": {
        if (!a.m) {
          out += `e^{${KIT.simplifiedTex(new KIT.R(a.arg.n.scale(k), a.arg.d), false)}}`;
          break;
        }
        // e^(x·ln 2) = 2^x
        const ls = Object.keys(a.m).filter((w) => ctx.byName.get(w)?.kind === "log" && a.m[w] === 1);
        if (ls.length === 1 && Object.keys(a.m).length > 1) {
          const rest = { ...a.m };
          delete rest[ls[0]];
          const bt = KIT.polyTex(ctx.byName.get(ls[0]).base);
          out += `${bare(bt) ? bt : `\\left(${bt}\\right)`}^{${KIT.polyTex(mono(rest, new Q(BigInt(k), BigInt(a.d))))}}`;
        } else out += `e^{${KIT.polyTex(mono(a.m, new Q(BigInt(k), BigInt(a.d))))}}`;
        break;
      }
      case "log":
        out += `${powTex("\\ln", k)}${argTex(KIT.polyTex(a.base))}`;
        break;
      case "dlog":
        out += `${powTex(LOG_PRE(a.B), k)}${argTex(KIT.polyTex(a.base))}`;
        break;
      case "logc":
        out += powTex(a.tex, k);
        break;
      case "sin":
      case "cos":
      case "tan":
      case "cot":
        out += `${powTex(`\\${a.kind}`, k)}${angTex(a.info)}`;
        break;
      default:
        out += v;
    }
    part[a.kind === "abs" ? "abs" : a.kind === "exp" ? "exp" : "fn"] += out;
  }
  // |x|, koreni, e^…, nato funkcije: 2x√3, √2·sin x
  const rt = [...rads.keys()].sort((x, y) => x - y).map((i) => radTex(rads.get(i))).join("");
  return part.abs + rt + part.exp + part.fn;
}

// ---------------------------------------------------------------------------
// Zapis: enakovredne oblike, izberemo najkrajšo

const texLen = (t) => t.replace(/\\(left|right)/g, "").length;
function subst(p, v, q) {
  if (!p.vars().includes(v)) return p;
  let out = new P();
  const pw = [];
  for (const { m, c } of p.terms()) {
    const e = m[v] || 0;
    const mm = { ...m };
    delete mm[v];
    const qe = pw[e] || (pw[e] = KIT.powP(q, e));
    out = out.add(qe.mul(mono(mm, c)));
  }
  return out;
}
const minExp = (p, v) => Math.min(...p.terms().map((t) => t.m[v] || 0));
const divMono = (p, v, k) => new P(p.terms().map(({ m, c }) => ({ m: { ...m, [v]: (m[v] || 0) - k }, c })));
function trigForms(ctx, r) {
  const pairs = ctx.atoms.filter((a) => a.kind === "sin").map((s) => [s, ctx.byKey.get("cos:" + s.key.slice(4))]);
  if (!pairs.length) return [r];
  const sForm = (p) => {
    for (const [s, c] of pairs) {
      const out = new P();
      for (const { m, c: k } of p.terms()) {
        const e = m[c.name] || 0;
        const q = Math.floor(e / 2);
        const t = KIT.powP(ONE().sub(P.v(s.name).mul(P.v(s.name))), q).mul(mono({ ...m, [c.name]: e - 2 * q }, k));
        for (const x of t.terms()) out.addTerm(x.m, x.c);
      }
      p = out;
    }
    return p;
  };
  const out = [];
  const ns = [r.n, sForm(r.n)];
  const ds = [r.d, sForm(r.d)];
  for (const n of ns)
    for (const d of ds) {
      tick();
      let x = KIT.cancel(new KIT.R(n, d));
      out.push(x);
      // sin/cos → tan, cos/sin → cot
      let changed = false;
      for (const [s, c] of pairs) {
        if (x.d.isConst()) break;
        for (const [up, down, kind] of [
          [s, c, "tan"],
          [c, s, "cot"],
        ]) {
          const j = Math.min(minExp(x.n, up.name), minExp(x.d, down.name));
          if (j <= 0 || x.n.zero) continue;
          const t = atom(ctx, kind + ":" + s.key.slice(4), { kind, info: s.info, free: s.free, val: (env) => (kind === "tan" ? Math.tan(s.ang(env) * ctx.unit) : 1 / Math.tan(s.ang(env) * ctx.unit)) });
          x = new KIT.R(divMono(x.n, up.name, j).mul(mono({ [t.name]: j })), divMono(x.d, down.name, j));
          changed = true;
        }
      }
      if (changed) out.push(KIT.cancel(x));
    }
  return out;
}
// logaritmi v osnovi vnosa (log, ln, log₂) in »en sam logaritem« pri poenostavi
function logForms(ctx, r, op) {
  const ls = ctx.atoms.filter((a) => a.kind === "log");
  if (!ls.length) return [r];
  // osnova vnosa (log → 10, ln → e, log₂); ln x / ln 10 = log x
  const Bs = new Set([...ctx.logBases, "e"]);
  if (ctx.byKey.has("log:2") && ctx.byKey.has("log:5")) Bs.add("10");
  // oblike v osnovi, ki je ni v vnosu, imajo kazen (log₂ x / 2, ne ln x / (2 ln 2))
  return [...Bs].flatMap((B) => logFormsB(ctx, r, op, B).map((c) => Object.assign(c, { pen: ctx.logBases.has(B) ? 0 : 8 })));
}
function logFormsB(ctx, r, op, B) {
  const ls = ctx.atoms.filter((a) => a.kind === "log");
  let Bp = null; // prafaktorji osnove [[atom, e]]
  let Bt = B;
  if (B !== "e") {
    const base = ctx.logBaseR.get(B) || new KIT.R(P.num(Q.of(Number(B))));
    try {
      const { sign, fs } = factorList(base);
      if (sign < 0) throw 0;
      Bp = fs.map(({ p, e }) => [ctx.byKey.get("log:" + pkey(p)), e]);
      if (Bp.some(([a]) => !a)) throw 0;
      Bt = base.d.isConst() && base.n.isConst() ? base.n.constValue().div(base.d.constValue()).tex() : KIT.simplifiedTex(base, false);
      if (!bare(Bt)) throw 0;
    } catch {
      return [];
    }
  }
  const lam = new Map();
  for (const a of ls) lam.set(a.name, atom(ctx, `dlog:${Bt}:${a.key}`, { kind: "dlog", B: Bt, base: a.base, free: a.free, val: (env) => env[a.name] / (Bp ? Bp.reduce((s, [x, e]) => s + e * env[x.name], 0) : 1) }));
  const LAM = "⟨Λ⟩";
  const sub1 = (p) => {
    for (const [nm, d] of lam) p = subst(p, nm, Bp ? P.v(d.name).mul(P.v(LAM)) : P.v(d.name));
    return p;
  };
  let x = KIT.cancel(new KIT.R(sub1(r.n), sub1(r.d)));
  if (x.n.vars().includes(LAM) || x.d.vars().includes(LAM)) return [r];
  const outs = [x];
  if (Bp) {
    // Σ e_p·log_B p = 1: izločimo po en prafaktor
    for (let i = 0; i < Bp.length; i++) {
      const [ai, ei] = Bp[i];
      let q = ONE();
      for (let j = 0; j < Bp.length; j++) if (j !== i) q = q.sub(P.v(lam.get(Bp[j][0].name).name).scale(Bp[j][1]));
      q = q.scale(new Q(1n, BigInt(ei)));
      const nm = lam.get(ai.name).name;
      outs.push(KIT.cancel(new KIT.R(subst(x.n, nm, q), subst(x.d, nm, q))));
    }
  }
  if (op !== "simplify") return outs;
  return [...outs, ...outs.map((y) => combineLogs(ctx, y, Bt)).filter(Boolean)];
}
function combineLogs(ctx, r, Bt) {
  const isL = (v) => ctx.byName.get(v)?.kind === "dlog";
  if (r.d.vars().some(isL)) return null;
  const rest = new P();
  const list = [];
  for (const t of r.n.terms()) {
    const ks = Object.keys(t.m);
    if (!ks.some(isL)) rest.addTerm(t.m, t.c);
    else if (ks.length === 1 && t.m[ks[0]] === 1) list.push([ctx.byName.get(ks[0]), t.c]);
    else return null;
  }
  if (list.length < 2) return null;
  let g = list.reduce((s, [, c]) => gcdQ(s, c), Q.ZERO).abs();
  if (list.filter(([, c]) => c.sign < 0).length > list.length / 2) g = g.neg();
  let num = ONE();
  let den = ONE();
  for (const [a, c] of list) {
    const k = Number(c.div(g).n);
    if (k > 0) num = num.mul(KIT.powP(a.base, k));
    else den = den.mul(KIT.powP(a.base, -k));
  }
  const inner = KIT.factoredTex(KIT.cancel(new KIT.R(num, den)), false);
  const t = `${LOG_PRE(Bt)}${inner.startsWith("\\frac") ? inner : argTex(inner)}`;
  const lc = atom(ctx, "logc:" + t, { kind: "logc", tex: t, free: true, val: (env) => list.reduce((s, [a, c]) => s + Number(c.div(g).n) * env[a.name], 0) });
  return new KIT.R(rest.add(mono({ [lc.name]: 1 }, g)), r.d);
}

// ---------------------------------------------------------------------------
// Pogoji

function geTex(p, op, dec) {
  const sym = { ">": [">", "<"], "≥": ["\\ge", "\\le"] }[op];
  const vs = p.vars();
  if (vs.length === 1 && !isAtom(vs[0]) && p.degree(vs[0]) === 1) {
    const a = KIT.coefIn(p, vs[0], 1).constValue();
    const rest = KIT.coefIn(p, vs[0], 0).scale(a.inv().neg());
    return `${KIT.varTex(vs[0])} ${sym[a.sign < 0 ? 1 : 0]} ${KIT.polyTex(rest, dec)}`;
  }
  return `${KIT.polyTex(p, dec)} ${sym[0]} 0`;
}
function condList(ctx, shown, dec) {
  // imenovalci s koreni: pogoj za normo (√x − 1 ≠ 0 → x ≠ 1)
  const dens = ctx.dens
    .map((d) => {
      for (const a of ctx.atoms) if ((a.kind === "rad" || a.kind === "abs") && d.degree(a.name) > 0) d = reduce(d.mul(cofactor(d, a, ctx)), ctx);
      return d;
    })
    .filter((d) => d.vars().some((v) => !isAtom(v) || ctx.byName.get(v)?.free))
    // e^x ≠ 0 vedno
    .filter((d) => !(d.terms().length === 1 && d.vars().every((v) => ctx.byName.get(v)?.kind === "exp" || v === "π" || v === "e")));
  const strict = [...ctx.domain.values()].filter((x) => x.op === ">").map((x) => x.p);
  const implied = new Set(strict.length ? KIT.conditions(strict, ONE(), dec) : []);
  const ne = (dens.length ? KIT.conditions(dens, shown.d, dec) : []).filter((c) => !implied.has(c));
  const has = new Set([...shown.n.vars(), ...shown.d.vars()]);
  const ge = [];
  for (const { p, op, log } of ctx.domain.values()) {
    // √x v rezultatu že pove x ≥ 0
    if (!log && op === "≥" && ctx.atoms.some((a) => a.kind === "rad" && a.L % 2 === 0 && has.has(a.name) && pkey(a.base) === pkey(p))) continue;
    ge.push(geTex(p, op, dec));
  }
  // a > 0, b > 0 → a, b > 0
  const simple = new Map();
  const rest = [];
  for (const g of ge) {
    const m = /^([A-Za-z](?:_\{\w+\})?) (>|\\ge) 0$/.exec(g);
    if (m) {
      if (!simple.has(m[2])) simple.set(m[2], []);
      simple.get(m[2]).push(m[1]);
    } else rest.push(g);
  }
  const grouped = [...simple].map(([op, vs]) => `${vs.sort(KIT.varCmp).join(", ")} ${op} 0`);
  return [...grouped, ...rest, ...ne];
}

// ---------------------------------------------------------------------------
// Preverjanje s števili

// Σ|c|·Π|x|^e: velikost členov (razvit (√x + 1)²⁴ izgubi natančnost pri seštevanju)
function absEval(p, env) {
  let s = 0;
  for (const { m, c } of p.terms()) {
    let t = Math.abs(c.num());
    for (const [v, e] of Object.entries(m)) t *= Math.abs(env[v]) ** e;
    s += t;
  }
  return s;
}
export const scaleOf = (r) => (env) => absEval(r.n, env) / Math.abs(r.d.eval(env));
export function verifyAt(ctx, vs, f, check, need, scale) {
  const pts = KIT.points(vs, 24);
  // za pogoje x > 0 dodamo še točke z |x|
  const all = [...pts, ...pts.map((p) => Object.fromEntries(Object.entries(p).map(([k, v]) => [k, Math.abs(v)])))];
  let ok = 0;
  for (const pt of all) {
    const a = f(pt);
    const env2 = atomEnv(ctx, { ...pt, ...KIT.SYMBOLS });
    const b = check(env2);
    if (a === null) continue;
    if (typeof a !== "number" || !Number.isFinite(a) || !Number.isFinite(b) || Math.abs(a) > 1e12) continue;
    if (!KIT.close(a, b) && !(Math.abs(a - b) <= 1e-9 * (1 + Math.abs(a))) && !(scale && Math.abs(a - b) <= 1e-11 * scale(env2))) return false;
    ok++;
  }
  return ok >= (need ?? (vs.length ? 5 : 1));
}
const origFn = (line, node) => {
  const f = line.run(node);
  return (pt) => {
    const s = Object.create(line.scope);
    Object.assign(s, pt);
    const v = f(s);
    return typeof v === "number" ? v : NaN;
  };
};
export const lineFn = origFn;

// ---------------------------------------------------------------------------
// Vstop (iz cas.js runCas, ko 1. faza izraza ne zna)

export function runAtoms(cmd, line, env, name, innerTex) {
  const ctx = newCtx(line, env);
  try {
    const r = attempt(ctx, () => KIT.rat(line.ast, ctx));
    const vs = [...ctx.vars].filter((v) => !(v in KIT.SYMBOLS)).sort(KIT.varCmp);
    const allVs = [...ctx.vars].sort(KIT.varCmp);
    const f = origFn(line, line.ast);
    if (!verifyAt(ctx, allVs, f, (e) => KIT.evalR(r, e), undefined, scaleOf(r))) return { error: { code: "casUnverified", info: {} } };
    const dec = ctx.dec;
    const texFn = cmd.op === "factor" ? (x) => KIT.factoredTex(x, dec) : cmd.op === "expand" ? (x) => KIT.expandedTex(x, dec) : (x) => KIT.simplifiedTex(x, dec);
    let best = null;
    for (const c of trigForms(ctx, r).flatMap((x) => logForms(ctx, x, cmd.op))) {
      let t;
      try {
        t = texFn(c);
      } catch (e) {
        if (e?.code === "timeout") throw e;
        continue;
      }
      const len = texLen(t) + (c.pen || 0);
      if (!best || len < best.len) best = { c, t, len };
    }
    if (!best) throw fail("unsupported");
    if (best.t.length > 12000) throw fail("big");
    if (!verifyAt(ctx, allVs, f, (e) => KIT.evalR(best.c, e), undefined, scaleOf(r))) return { error: { code: "casUnverified", info: {} } };
    const cond = condList(ctx, best.c, dec);
    const out = { kind: "cas", op: cmd.op, tex: `${name}\\left(${innerTex}\\right)`, resTex: best.t, inner: cmd.inner };
    if (cond.length) out.cond = cond.join(",\\; ");
    if (vs.length === 1 && vs[0] === "x") out.plot = [`y = ${cmd.inner}`];
    return out;
  } catch (e) {
    return { error: { code: KIT.casCode(e), info: {} } };
  } finally {
    CUR = null;
  }
}

/** Ali izraz s koreni, kotnimi funkcijami ali logaritmi znamo obdelati (gumbi Poenostavi/Razvij)? Vrne črke ali null. */
export function atomInfo(ast, scope) {
  const ctx = newCtx({ scope }, {});
  try {
    attempt(ctx, () => KIT.rat(ast, ctx));
    if (!ctx.atoms.length) return null;
    return [...ctx.vars].filter((v) => !(v in KIT.SYMBOLS)).sort(KIT.varCmp);
  } catch {
    return null;
  } finally {
    CUR = null;
  }
}
