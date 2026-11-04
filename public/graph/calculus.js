// Simbolno računanje, 2. faza: nedoločeni integral, limita in Taylorjev polinom (ukazi integriraj, limita, taylor).
// Dela na drevesih iz math.js (odvod diff, poenostavitev simplify, zapis toTex); ulomke polinomov računa točno
// s cas.js (krajšanje, razcep nad ℚ, delni ulomki). Brez DOM in brez API; teče tudi v Node (test/cas2.test.js).
//
// Vsak rezultat preverimo s števili, česar ne prestane preverjanja, ne pokažemo (casUnverified):
// - integral: odvod rezultata (math.js diff) se mora ujemati s funkcijo v vseh (vsaj 5) točkah, kjer je definirana,
// - limita: vrednosti funkcije blizu točke (h = 10⁻² … 10⁻¹⁴, za ∞ x = 10² … 10¹⁴) se morajo približati rezultatu,
// - Taylorjev polinom (koeficienti iz Taylorjeve aritmetike, glej jet): napaka f − T mora padati kot hⁿ⁺¹.
// Česar ne znamo, ne ugibamo: casIntegral, casLimit, casTaylor.
import { Q, P, AlgebraError } from "../scan/algebra.js";
import { diff, simplify, toTex, freeVars, inlineUfn, substitute } from "./math.js";
import { compileLine, lineTex, toFraction } from "./scicore.js";
import { KIT } from "./cas.js";

export const CALC_OPS = new Set(["integrate", "limit", "taylor"]);
const MAX_TAYLOR = 10;
const MAX_LHOPITAL = 12;
const fail = (code) => new AlgebraError(code);
const tick = () => KIT.tick();
let COMMA = true;

// ---------------------------------------------------------------------------
// Drevesa

const N = (v) => (v < 0 ? { k: "neg", a: { k: "num", v: -v } } : { k: "num", v });
const V = (name) => ({ k: "var", name });
const E = { k: "const", name: "e" };
const PI = { k: "const", name: "π" };
const B = (k, a, b) => ({ k, a, b });
const add = (a, b) => B("+", a, b);
const sub = (a, b) => B("-", a, b);
const mul = (a, b) => B("*", a, b);
const div = (a, b) => B("/", a, b);
const pow = (a, b) => B("^", a, b);
const neg = (a) => ({ k: "neg", a });
const call = (f, ...args) => ({ k: "call", f, args });
const unwrap = (n) => (n?.k === "grp" ? unwrap(n.a) : n);
const strip = (n) => {
  if (!n || typeof n !== "object") return n;
  if (Array.isArray(n)) return n.map(strip);
  if (n.k === "grp") return strip(n.a);
  const o = {};
  for (const [k, v] of Object.entries(n)) if (k !== "imp") o[k] = strip(v);
  return o;
};
const keyOf = (n) => JSON.stringify(strip(n));
const dep = (n, v) => freeVars(n).has(v);
const isNumNode = (n) => unwrap(n).k === "num" || (unwrap(n).k === "neg" && unwrap(unwrap(n).a).k === "num");
const numOf = (n) => (unwrap(n).k === "num" ? unwrap(n).v : -unwrap(unwrap(n).a).v);
const isE = (n) => unwrap(n)?.k === "const" && unwrap(n).name === "e";

function qNode(q) {
  const a = q.abs();
  const t = a.int ? { k: "num", v: Number(a.n) } : div({ k: "num", v: Number(a.n) }, { k: "num", v: Number(a.d) });
  return q.sign < 0 ? neg(t) : t;
}
const prod = (list) => list.reduce((s, x) => (s ? mul(s, x) : x), null);

// ---------------------------------------------------------------------------
// Polinomi ene spremenljivke kot seznami ulomkov [a₀, a₁, …]

const trim = (a) => {
  const o = a.slice();
  while (o.length && o[o.length - 1].zero) o.pop();
  return o;
};
const deg = (a) => trim(a).length - 1;
function aAdd(a, b) {
  const o = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) o.push((a[i] || Q.ZERO).add(b[i] || Q.ZERO));
  return trim(o);
}
const aScale = (a, q) => trim(a.map((c) => c.mul(q)));
function aMul(a, b) {
  if (!a.length || !b.length) return [];
  const o = Array.from({ length: a.length + b.length - 1 }, () => Q.ZERO);
  for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) o[i + j] = o[i + j].add(a[i].mul(b[j]));
  return trim(o);
}
function aDivmod(a, b) {
  b = trim(b);
  let r = trim(a);
  const q = Array.from({ length: Math.max(0, r.length - b.length + 1) }, () => Q.ZERO);
  const lb = b[b.length - 1];
  while (r.length >= b.length && r.length) {
    tick();
    const k = r.length - b.length;
    const c = r[r.length - 1].div(lb);
    q[k] = c;
    r = trim(r.map((x, i) => (i >= k && i - k < b.length ? x.sub(b[i - k].mul(c)) : x)));
  }
  return [trim(q), r];
}
const aDeriv = (a) => trim(a.slice(1).map((c, i) => c.mul(i + 1)));
const aInt = (a) => [Q.ZERO, ...a.map((c, i) => c.div(i + 1))];
const aEval = (a, x) => a.reduceRight((s, c) => s * x + c.num(), 0);
const aPow = (a, k) => {
  let o = [Q.ONE];
  for (let i = 0; i < k; i++) o = aMul(o, a);
  return o;
};

/** Polinom P (iz cas.js) → seznam koeficientov v v, ali null, če ima še druge črke. */
function toArr(p, v) {
  if (p.vars().some((w) => w !== v)) return null;
  return trim(KIT.coeffsIn(p, v).map((c) => c.constValue()));
}
// a·vᵏ + … kot drevo (koeficienti ulomki, prvi člen najvišje stopnje)
function arrAst(a, v) {
  let out = null;
  for (let k = a.length - 1; k >= 0; k--) {
    const c = a[k];
    if (!c || c.zero) continue;
    const m = k === 0 ? null : k === 1 ? V(v) : pow(V(v), N(k));
    const ac = c.abs();
    const t = m ? (ac.one ? m : mul(qNode(ac), m)) : qNode(ac);
    out = !out ? (c.sign < 0 ? neg(t) : t) : c.sign < 0 ? sub(out, t) : add(out, t);
  }
  return out || N(0);
}
// polinom več črk (koeficient naklona, npr. ω v sin(ωt)) kot drevo
function polyAst(p) {
  const terms = p.terms().map(({ m, c }) => {
    const vs = Object.entries(m).map(([w, e]) => (e === 1 ? atom(w) : pow(atom(w), N(e))));
    const ac = c.abs();
    const t = prod([...(ac.one && vs.length ? [] : [qNode(ac)]), ...vs]);
    return { t, neg: c.sign < 0 };
  });
  return terms.reduce((s, x) => (!s ? (x.neg ? neg(x.t) : x.t) : x.neg ? sub(s, x.t) : add(s, x.t)), null) || N(0);
}
const atom = (w) => (w === "π" || w === "e" ? { k: "const", name: w } : V(w));
const monoAst = (v, k) => (k === 1 ? V(v) : pow(V(v), N(k)));

// ---------------------------------------------------------------------------
// Ulomki polinomov (cas.js) in konstante

function tryRat(node, scope) {
  try {
    return KIT.rat(node, { scope, dens: [], dec: false, vars: new Set() });
  } catch (e) {
    if (e?.code === "timeout") throw e;
    return null;
  }
}
/** Točna racionalna vrednost izraza brez spremenljivk (2/3, √ ne) ali null. */
function constQ(node, scope) {
  const r = tryRat(node, scope);
  if (!r || !r.n.isConst() || !r.d.isConst()) return null;
  return r.n.constValue().div(r.d.constValue());
}
/** u = a·v + b? Vrne { a: Q, ak: drevo|null (simbolni naklon) } ali null. */
function linear(u, v, scope) {
  if (!dep(u, v)) return null;
  const r = tryRat(u, scope);
  if (!r || !r.d.isConst() || r.n.degree(v) !== 1) return null;
  const c = KIT.coefIn(r.n, v, 1).scale(r.d.constValue().inv());
  if (c.vars().includes(v)) return null;
  if (c.isConst()) return { a: c.constValue(), ak: null };
  return { a: Q.ONE, ak: polyAst(c) };
}

// ---------------------------------------------------------------------------
// Členi rezultata: c · √r · Π ks / Π kds · x (x je del s spremenljivko)

const T = (c, x, ks = [], kds = [], r = 1) => ({ c: Q.of(c), x, ks, kds, r });
const scaleT = (ts, q, ks = [], kds = []) => ts.map((t) => ({ ...t, c: t.c.mul(q), ks: [...t.ks, ...ks], kds: [...t.kds, ...kds] }));
function slopeT(ts, lin) {
  // naklon −λ: −1/λ (ne 1/(−λ))
  const ak = lin.ak && unwrap(lin.ak).k === "neg" ? unwrap(lin.ak).a : lin.ak;
  return scaleT(ts, ak !== lin.ak ? lin.a.inv().neg() : lin.a.inv(), [], ak ? [ak] : []);
}
function combine(ts) {
  const out = [];
  const idx = new Map();
  for (let t of ts) {
    if (t.c.zero) continue;
    // a·sin(ax)/a = sin(ax): enake konstante v števcu in imenovalcu se pokrajšajo
    const kds = [...t.kds];
    const ks = t.ks.filter((k) => {
      const j = kds.findIndex((d) => keyOf(d) === keyOf(k));
      if (j < 0) return true;
      kds.splice(j, 1);
      return false;
    });
    t = { ...t, ks, kds };
    const k = `${t.x ? keyOf(t.x) : ""}|${t.r}|${t.ks.map(keyOf).join(",")}|${t.kds.map(keyOf).join(",")}`;
    if (idx.has(k)) out[idx.get(k)].c = out[idx.get(k)].c.add(t.c);
    else {
      idx.set(k, out.length);
      out.push({ ...t });
    }
  }
  return out.filter((t) => !t.c.zero);
}
function termAst(t) {
  const top = prod([qNode(t.c), ...(t.r > 1 ? [call("sqrt", N(t.r))] : []), ...t.ks, ...(t.x ? [t.x] : [])]);
  return t.kds.length ? div(top, prod(t.kds)) : top;
}
const sumAst = (ts) => ts.reduce((s, t) => (s ? add(s, termAst(t)) : termAst(t)), null) || N(0);

// TeX: x^{3/2} → √(x³), ln(|u|) → ln|u|
function fixTex(n) {
  if (!n || typeof n !== "object") return n;
  if (Array.isArray(n)) return n.map(fixTex);
  if (n.k === "^") {
    const e = unwrap(n.b);
    if (e.k === "/" && isNumNode(e.a) && isNumNode(e.b) && numOf(e.b) === 2 && numOf(e.a) > 0) {
      const p = numOf(e.a);
      return call("sqrt", p === 1 ? fixTex(n.a) : pow(fixTex(n.a), N(p)));
    }
  }
  const o = {};
  for (const [k, v] of Object.entries(n)) o[k] = typeof v === "object" ? fixTex(v) : v;
  return o;
}
function texOf(n) {
  return toTex(fixTex(n), { comma: COMMA, sep: COMMA ? ";" : "," })
    .replace(/\\ln\\left\(\\left\|/g, "\\ln\\left|")
    .replace(/\\right\|\\right\)/g, "\\right|")
    .replace(/\\ln\\left\((\d+)\\right\)/g, "\\ln $1")
    // vnos »−2x« je (−2)·x: na začetku oklepaja ali eksponenta brez oklepaja okoli −2
    .replace(/(^|\\left\(|\\left\||\{)\\left\(-(\d+(?:\{,\}\d+)?|[a-zA-Z]|\\[a-zA-Z]+)\\right\)(?=[a-zA-Z\\])/g, (m, pre, a, i, str) => `${pre}-${a}${/^\\/.test(a) && /[a-zA-Z]/.test(str[i + m.length]) ? " " : ""}`);
}
const isSum = (n) => ["+", "-", "neg"].includes(unwrap(n).k);
const fTex = (n) => (isSum(n) ? `\\left(${texOf(n)}\\right)` : texOf(n));
const powLike = (n) => {
  n = unwrap(n);
  if (n.k === "var") return true;
  return n.k === "^" && isNumNode(n.b) && numOf(n.b) > 0 && (unwrap(n.a).k === "var" || isSum(n.a));
};
const recip = (n) => {
  n = unwrap(n);
  return n.k === "^" && isNumNode(n.b) && numOf(n.b) < 0 ? n : null;
};
function joinP(parts) {
  let s = "";
  for (const p of parts) s += !s ? p : /^\d/.test(p) ? `\\cdot ${p}` : /[a-zA-Z]$/.test(s) && /^[a-zA-Zα-ωπ]/.test(p) ? ` ${p}` : p;
  return s;
}
function lnLast(parts) {
  const rest = [];
  const ln = new Map();
  for (const p of parts) {
    const m = /^\\ln (\d+)$/.exec(p);
    if (m) ln.set(m[1], (ln.get(m[1]) || 0) + 1);
    else rest.push(p);
  }
  const lns = [...ln].map(([a, k]) => (k === 1 ? `\\ln ${a}` : `\\ln^{${k}} ${a}`));
  return [rest, lns.length ? [lns.join("\\cdot ")] : []];
}
function termTex(t, first) {
  const neg = t.c.sign < 0;
  const c = t.c.abs();
  let mono = t.xTex ? t.xTex : null;
  let fn = null;
  let rec = null;
  const x = t.xTex ? null : t.x && unwrap(t.x);
  if (x) {
    if (recip(x)) rec = x;
    else if (powLike(x)) mono = fTexPow(x);
    else if (x.k === "*" && powLike(x.a) && !powLike(x.b)) {
      mono = fTexPow(unwrap(x.a));
      fn = x.b;
    } else fn = x;
  }
  // ln 2 na konec produkta (x ln 2, ne »ln 2x«, kar bi se bralo kot ln(2x)); ln 2 · ln 2 = ln² 2
  const [kn, lnN] = lnLast(t.ks.map(fTex));
  const [kd, lnD] = lnLast(t.kds.map(fTex));
  const num = [...(c.n !== 1n ? [String(c.n)] : []), ...(t.r > 1 ? [`\\sqrt{${t.r}}`] : []), ...kn, ...(mono ? [mono] : [])];
  const den = [...(c.d !== 1n ? [String(c.d)] : []), ...kd, ...(rec ? [numOf(rec.b) === -1 ? texOf(rec.a) : fTexPow(pow(rec.a, N(-numOf(rec.b))))] : []), ...lnD];
  let fnT = fn ? fTex(fn) : "";
  // 2ˣ/ln 2, −cos(ωt)/ω: funkcija v števec, če je v imenovalcu kaj več kot število
  if (fnT && (t.kds.length || rec)) {
    num.push(fnT);
    fnT = "";
  }
  let body;
  // (x − 2)/2 brez oklepaja, če je v števcu sam
  if (den.length && num.length === 1 && t.xTex && !/\^\{/.test(t.xTex)) num[0] = num[0].replace(/^\\left\((.*)\\right\)$/, "$1");
  if (!den.length) body = joinP([...num, ...(fnT ? [fnT] : []), ...lnN]) || "1";
  else body = `\\frac{${joinP([...num, ...lnN]) || "1"}}{${joinP(den)}}${fnT}`;
  return (first ? (neg ? "-" : "") : neg ? " - " : " + ") + body;
}
const fTexPow = (n) => (unwrap(n).k === "^" && numOf(unwrap(n).b) === 1 ? fTex(unwrap(n).a) : texOf(n));
const termsTex = (ts) => ts.map((t, i) => termTex(t, i === 0)).join("");

// ---------------------------------------------------------------------------
// Nedoločeni integral

const lnAbs = (u) => call("ln", call("abs", u));

// produkt → { q (ulomek), ks / kds (konstante brez v v števcu / imenovalcu), fs: [{ b, e: Q }] }
function factorize(n, v, scope, out = { q: Q.ONE, ks: [], kds: [], fs: [] }, sign = 1) {
  tick();
  n = unwrap(n);
  if (!dep(n, v)) {
    const c = constQ(n, scope);
    if (c) out.q = c.zero ? Q.ZERO : sign > 0 ? out.q.mul(c) : out.q.div(c);
    else (sign > 0 ? out.ks : out.kds).push(n);
    return out;
  }
  const push = (b, e) => {
    b = unwrap(b);
    const k = keyOf(b);
    const old = out.fs.find((f) => keyOf(f.b) === k);
    if (old) old.e = old.e.add(e);
    else out.fs.push({ b, e });
    out.fs = out.fs.filter((f) => !f.e.zero);
    return out;
  };
  switch (n.k) {
    case "neg":
      out.q = out.q.neg();
      return factorize(n.a, v, scope, out, sign);
    case "*":
      factorize(n.a, v, scope, out, sign);
      return factorize(n.b, v, scope, out, sign);
    case "/":
      factorize(n.a, v, scope, out, sign);
      return factorize(n.b, v, scope, out, -sign);
    case "^": {
      if (dep(n.b, v)) break;
      const e = constQ(n.b, scope);
      if (!e) break;
      const b = unwrap(n.a);
      if (b.k === "^" && isE(b.a)) return push(pow(E, mul(qNode(e), b.b)), Q.of(sign)); // (eᵘ)ᵏ = eᵏᵘ
      if (b.k === "*" || b.k === "/") {
        // (x·eˣ)² ni pogost; potenco produkta razstavimo, če je eksponent celo število
        if (e.int) {
          const inner = factorize(b, v, scope);
          if (inner.ks.length || inner.kds.length) break;
          out.q = sign > 0 ? out.q.mul(inner.q.pow(Number(e.n))) : out.q.div(inner.q.pow(Number(e.n)));
          for (const f of inner.fs) push(f.b, f.e.mul(e).mul(sign));
          return out;
        }
      }
      return push(b, e.mul(sign));
    }
    case "call":
      if (n.f === "sqrt") return push(n.args[0], new Q(BigInt(sign), 2n));
      if (n.f === "cbrt") return push(n.args[0], new Q(BigInt(sign), 3n));
      if (n.f === "exp") return push(pow(E, n.args[0]), Q.of(sign));
      break;
  }
  return push(n, Q.of(sign));
}
function rebuild(fs) {
  return prod(
    fs.map(({ b, e }) => {
      if (e.one) return b;
      if (e.int) return pow(b, N(Number(e.n)));
      if (e.d === 2n && e.n === 1n) return call("sqrt", b);
      return pow(b, qNode(e));
    }),
  );
}

function integ(n, v, S, depth = 0) {
  tick();
  if (depth > 10) return null;
  n = unwrap(n);
  if (!dep(n, v)) {
    const c = constQ(n, S.scope);
    if (c) return c.zero ? [] : [T(c, V(v))];
    return [T(1, V(v), [n])];
  }
  if (n.k === "+" || n.k === "-") {
    const a = integ(n.a, v, S, depth);
    const b = a && integ(n.b, v, S, depth);
    if (!a || !b) return null;
    return [...a, ...(n.k === "-" ? scaleT(b, Q.of(-1)) : b)];
  }
  if (n.k === "neg") {
    const a = integ(n.a, v, S, depth);
    return a && scaleT(a, Q.of(-1));
  }
  const F = factorize(n, v, S.scope);
  if (F.q.zero) return [];
  const r = F.fs.length ? integFactors(F.fs, v, S, depth) : [T(1, V(v))];
  return r && scaleT(r, F.q, F.ks, F.kds);
}

function integFactors(fs, v, S, depth) {
  const g = rebuild(fs);
  // ulomek polinomov (tudi polinom): deljenje in delni ulomki
  const r = tryRat(g, S.scope);
  if (r && r.n.vars().every((w) => w === v) && r.d.vars().every((w) => w === v)) return integRational(toArr(r.n, v), toArr(r.d, v), v);
  if (fs.length === 1) {
    const one = single(fs[0], v, S);
    if (one) return one;
  }
  return expTrig(fs, v, S) || polyTimes(fs, v, S) || usub(fs, v, S, depth) || distribute(fs, v, S, depth);
}

// osnovni integrali f(av + b), potenca linearnega izraza, eᵘ, aᵘ
function single({ b, e }, v, S) {
  const lb = linear(b, v, S.scope);
  if (lb) {
    if (e.eq(Q.of(-1))) return slopeT([T(1, lnAbs(b))], lb);
    const e1 = e.add(Q.ONE);
    return slopeT([T(e1.inv(), pow(b, qNode(e1)))], lb);
  }
  if (b.k === "^" && !dep(b.a, v) && e.one) {
    const lu = linear(b.b, v, S.scope);
    if (!lu) return null;
    if (isE(b.a)) return slopeT([T(1, b)], lu);
    const c = constQ(b.a, S.scope);
    if (c && (c.sign <= 0 || c.one)) return null;
    return slopeT([T(1, b, [], [call("ln", b.a)])], lu);
  }
  // 1/√(c − k·x²) → arcsin, 1/√(x² + c) → ln|x + √(x² + c)|
  if (e.eq(new Q(-1n, 2n))) {
    const r = tryRat(b, S.scope);
    const a = r && r.d.isConst() && toArr(r.n.scale(r.d.constValue().inv()), v);
    if (a && a.length === 3 && a[1].zero && !a[0].zero) {
      const [c0, , c2] = a;
      if (c2.sign < 0 && c0.sign > 0) {
        const k = c2.neg().sqrt();
        const s = c2.neg().div(c0).sqrt();
        if (k && s) return [T(k.inv(), call("arcsin", s.one ? V(v) : div(V(v), qNode(s.inv()))))];
      }
      if (c2.sign > 0 && c2.one) return [T(1, lnAbs(add(V(v), call("sqrt", arrAst([c0, Q.ZERO, Q.ONE], v)))))];
    }
    return null;
  }
  if (b.k !== "call" || b.args.length !== 1) return null;
  const u = b.args[0];
  const lu = linear(u, v, S.scope);
  if (!lu) return null;
  const x = V(v);
  let ts = null;
  const E1 = e.one;
  const k = e.int ? Number(e.n) : null;
  switch (b.f) {
    case "sin":
      if (E1) ts = [T(-1, call("cos", u))];
      else if (k === 2) return [T(new Q(1n, 2n), x), ...slopeT([T(new Q(-1n, 4n), call("sin", mul(N(2), u)))], lu)];
      else if (k === -2) ts = [T(-1, call("cot", u))];
      break;
    case "cos":
      if (E1) ts = [T(1, call("sin", u))];
      else if (k === 2) return [T(new Q(1n, 2n), x), ...slopeT([T(new Q(1n, 4n), call("sin", mul(N(2), u)))], lu)];
      else if (k === -2) ts = [T(1, call("tan", u))];
      break;
    case "tan":
      if (E1) ts = [T(-1, lnAbs(call("cos", u)))];
      else if (k === 2) return [...slopeT([T(1, call("tan", u))], lu), T(-1, x)];
      break;
    case "cot":
      if (E1) ts = [T(1, lnAbs(call("sin", u)))];
      break;
    case "sinh":
      if (E1) ts = [T(1, call("cosh", u))];
      break;
    case "cosh":
      if (E1) ts = [T(1, call("sinh", u))];
      else if (k === -2) ts = [T(1, call("tanh", u))];
      break;
    case "tanh":
      if (E1) ts = [T(1, call("ln", call("cosh", u)))];
      break;
    case "ln":
    case "log":
      if (E1) {
        const kd = b.f === "log" ? [call("ln", N(10))] : [];
        // ln(k·x): x ln(kx) − x (ne ½·2x ln(2x))
        const ur = tryRat(div(u, x), S.scope);
        if (ur && !ur.n.vars().includes(v) && !ur.d.vars().includes(v)) return [T(1, mul(x, call("ln", u)), [], kd), T(-1, x, [], kd)];
        return [...scaleT(slopeT([T(1, mul(u, call("ln", u)))], lu), Q.ONE, [], kd), T(-1, x, [], kd)];
      }
      break;
    case "arctan":
      if (E1) ts = [T(1, mul(u, call("arctan", u))), T(new Q(-1n, 2n), call("ln", add(pow(u, N(2)), N(1))))];
      break;
    case "arcsin":
      if (E1) ts = [T(1, mul(u, call("arcsin", u))), T(1, call("sqrt", sub(N(1), pow(u, N(2)))))];
      break;
    case "arccos":
      if (E1) ts = [T(1, mul(u, call("arccos", u))), T(-1, call("sqrt", sub(N(1), pow(u, N(2)))))];
      break;
    case "abs":
      if (E1) ts = [T(new Q(1n, 2n), mul(u, call("abs", u)))];
      break;
  }
  return ts && slopeT(ts, lu);
}

// e^(av + b) · sin/cos(cv + d)
function expTrig(fs, v, S) {
  if (fs.length !== 2 || !fs.every((f) => f.e.one)) return null;
  const ex = fs.find((f) => f.b.k === "^" && isE(f.b.a));
  const tr = fs.find((f) => f.b.k === "call" && (f.b.f === "sin" || f.b.f === "cos"));
  if (!ex || !tr) return null;
  const la = linear(ex.b.b, v, S.scope);
  const lc = linear(tr.b.args[0], v, S.scope);
  if (!la || !lc || la.ak || lc.ak) return null;
  const { a } = la;
  const { a: c } = lc;
  const den = a.mul(a).add(c.mul(c));
  const sn = mul(ex.b, call("sin", tr.b.args[0]));
  const cs = mul(ex.b, call("cos", tr.b.args[0]));
  return tr.b.f === "sin" ? [T(a.div(den), sn), T(c.neg().div(den), cs)] : [T(a.div(den), cs), T(c.div(den), sn)];
}

// polinom · {sin, cos, sinh, cosh, eᵘ, aᵘ} (zaporedna integracija po delih) in polinom · {ln, arctan}
function polyTimes(fs, v, S) {
  const polys = [];
  const others = [];
  for (const f of fs) {
    const r = f.e.int && f.e.sign > 0 ? tryRat(f.b, S.scope) : null;
    if (r && r.d.isConst() && r.n.vars().every((w) => w === v)) polys.push(f);
    else others.push(f);
  }
  if (!polys.length || others.length !== 1 || !others[0].e.one) return null;
  const pr = tryRat(rebuild(polys), S.scope);
  const p = toArr(pr.n.scale(pr.d.constValue().inv()), v);
  const o = others[0].b;
  const isExp = o.k === "^" && !dep(o.a, v);
  const isCyc = o.k === "call" && ["sin", "cos", "sinh", "cosh"].includes(o.f);
  if (isExp || isCyc) {
    const lu = linear(isExp ? o.b : o.args[0], v, S.scope);
    if (!lu || lu.ak) return null;
    let G = single({ b: o, e: Q.ONE }, v, S);
    if (!G) return null;
    const out = [];
    let pk = p;
    let sign = Q.ONE;
    for (let k = 0; pk.length; k++) {
      tick();
      out.push(...scaleT(mulPoly(G, pk, v), sign));
      pk = aDeriv(pk);
      sign = sign.neg();
      if (!pk.length) break;
      const next = [];
      for (const t of G) {
        const gi = single({ b: unwrap(t.x), e: Q.ONE }, v, S);
        if (!gi) return null;
        next.push(...scaleT(gi, t.c, t.ks, t.kds));
      }
      G = next;
    }
    return out;
  }
  if (o.k === "call" && ["ln", "log", "arctan"].includes(o.f)) {
    const u = o.args[0];
    const lu = linear(u, v, S.scope);
    if (!lu || lu.ak) return null;
    const ur = tryRat(u, S.scope);
    const U = toArr(ur.n.scale(ur.d.constValue().inv()), v);
    const Pi = aInt(p);
    const kd = o.f === "log" ? [call("ln", N(10))] : [];
    const first = mulPoly([T(1, o)], Pi, v);
    // ∫ P·u′/u ali ∫ P·u′/(1 + u²)
    const den = o.f === "arctan" ? aAdd(aMul(U, U), [Q.ONE]) : U;
    const rest = integRational(aScale(Pi, lu.a), den, v);
    if (!rest) return null;
    return scaleT([...first, ...scaleT(rest, Q.of(-1))], Q.ONE, [], kd);
  }
  return null;
}
function mulPoly(ts, p, v) {
  const out = [];
  for (let k = p.length - 1; k >= 0; k--) {
    if (p[k].zero) continue;
    for (const t of ts) out.push({ ...t, c: t.c.mul(p[k]), x: k === 0 ? t.x : mul(monoAst(v, k), t.x) });
  }
  return out;
}

// u-substitucija: integrand = c · G(u) · u′ (razmerje preverimo s števili v več točkah)
const TV = "u_s";
function usub(fs, v, S, depth) {
  const g = rebuild(fs);
  const gf = S.fn(g);
  const cands = [];
  fs.forEach((f, i) => {
    const b = f.b;
    const lin = linear(b, v, S.scope);
    if (!lin && b.k !== "var") cands.push({ u: b, i, G: pow(V(TV), qNode(f.e)) });
    if (b.k === "call" && b.args.length === 1 && dep(b.args[0], v) && !linear(b.args[0], v, S.scope)) cands.push({ u: b.args[0], i, G: pow(call(b.f, V(TV)), qNode(f.e)) });
    if (b.k === "^" && !dep(b.a, v) && !linear(b.b, v, S.scope)) cands.push({ u: b.b, i, G: pow(pow(b.a, V(TV)), qNode(f.e)) });
  });
  for (const { u, i, G } of cands) {
    tick();
    let du;
    try {
      du = simplify(diff(u, v, S.ctx));
    } catch {
      continue;
    }
    const H = rebuild([fs[i]]);
    const hf = S.fn(mul(H, du));
    let c = null;
    let ok = 0;
    let bad = false;
    for (const pt of S.pts) {
      const a = gf(pt);
      const b = hf(pt);
      if (!Number.isFinite(a) || !Number.isFinite(b) || Math.abs(b) < 1e-9) continue;
      const q = a / b;
      if (c === null) c = q;
      else if (Math.abs(q - c) > 1e-9 * Math.max(1, Math.abs(c))) {
        bad = true;
        break;
      }
      ok++;
    }
    if (bad || ok < 5) continue;
    const fr = toFraction(c, 1000);
    if (!fr || fr.p === 0) continue;
    const inner = integ(simplify(G), TV, S, depth + 1);
    if (!inner) continue;
    return scaleT(
      inner.map((t) => ({ ...t, x: t.x && substitute(t.x, { [TV]: u }) })),
      new Q(BigInt(fr.p), BigInt(fr.q)),
    );
  }
  return null;
}

// (a + b)·g = a·g + b·g
function distribute(fs, v, S, depth) {
  const i = fs.findIndex((f) => f.e.one && (f.b.k === "+" || f.b.k === "-"));
  if (i < 0) return null;
  const rest = fs.filter((_, j) => j !== i);
  const s = fs[i].b;
  const withR = (x) => (rest.length ? mul(x, rebuild(rest)) : x);
  const a = integ(withR(s.a), v, S, depth + 1);
  const b = a && integ(withR(s.b), v, S, depth + 1);
  if (!a || !b) return null;
  return [...a, ...(s.k === "-" ? scaleT(b, Q.of(-1)) : b)];
}

// ulomek polinomov n/d (seznama koeficientov): deljenje, razcep imenovalca, delni ulomki
function integRational(n, d, v) {
  if (!n || !d) return null;
  if (!n.length) return [];
  if (deg(d) === 0) n = aScale(n, d[0].inv());
  const out = [];
  let rem = n;
  if (deg(d) > 0) {
    const [q, r] = aDivmod(n, d);
    n = q;
    rem = r;
  } else rem = [];
  const Pi = aInt(n);
  for (let k = Pi.length - 1; k >= 1; k--) if (!Pi[k].zero) out.push(T(Pi[k], monoAst(v, k)));
  if (!rem.length) return out;
  if (deg(d) > 12) throw fail("big");
  const pieces = out.length;
  const fd = KIT.factorP(new P(d.map((c, k) => ({ m: k ? { [v]: k } : {}, c })).filter((t) => !t.c.zero)));
  const fsA = fd.fs.map((f) => ({ a: toArr(f.p, v), e: f.e }));
  if (fsA.some((f) => deg(f.a) > 2)) return null;
  rem = aScale(rem, fd.c.inv());
  let full = [Q.ONE];
  for (const f of fsA) full = aMul(full, aPow(f.a, f.e));
  const basis = [];
  for (const f of fsA)
    for (let j = 1; j <= f.e; j++) {
      const co = aDivmod(full, aPow(f.a, j))[0];
      basis.push({ f, j, lin: false, p: co });
      if (deg(f.a) === 2) basis.push({ f, j, lin: true, p: aMul(co, [Q.ZERO, Q.ONE]) });
    }
  const D = deg(full);
  const sol = solveQ(
    Array.from({ length: D }, (_, k) => basis.map((b) => b.p[k] || Q.ZERO)),
    Array.from({ length: D }, (_, k) => rem[k] || Q.ZERO),
  );
  if (!sol) throw fail("internal");
  for (const f of fsA)
    for (let j = 1; j <= f.e; j++) {
      const A = sol[basis.findIndex((b) => b.f === f && b.j === j && !b.lin)];
      const Bi = basis.findIndex((b) => b.f === f && b.j === j && b.lin);
      const fAst = arrAst(f.a, v);
      if (deg(f.a) === 1) {
        if (A.zero) continue;
        const al = f.a[1];
        if (j === 1) out.push(T(A.div(al), lnAbs(fAst)));
        else out.push(T(A.div(al.mul(1 - j)), pow(fAst, N(1 - j))));
        continue;
      }
      const Bq = sol[Bi];
      if (Bq.zero && A.zero) continue;
      if (j > 1) return null; // ponovljeni nerazcepni kvadratni faktor: še ne
      const [c0, c1, c2] = f.a;
      const disc = c1.mul(c1).sub(c2.mul(c0).mul(4)); // β² − 4αγ
      if (!Bq.zero) out.push(T(Bq.div(c2.mul(2)), disc.sign < 0 ? call("ln", fAst) : lnAbs(fAst)));
      const K = A.sub(Bq.mul(c1).div(c2.mul(2)));
      if (K.zero) continue;
      const L = [c1, c2.mul(2)]; // 2αx + β
      const { s, m } = sqrtParts(disc.abs());
      if (disc.sign < 0) {
        // K · 2/√Δ · arctan((2αx + β)/√Δ), Δ = 4αγ − β² = s²m
        const Ls = aScale(L, s.inv());
        const lcm = Ls.reduce((x, c) => lcmB(x, c.d), 1n);
        const top = arrAst(aScale(Ls, new Q(lcm)), v);
        const bot = m > 1 ? (lcm === 1n ? call("sqrt", N(m)) : mul(N(Number(lcm)), call("sqrt", N(m)))) : lcm === 1n ? null : N(Number(lcm));
        out.push(T(K.mul(2).div(s.mul(m)), call("arctan", bot ? div(top, bot) : top), [], [], m));
      } else {
        // K/√D · ln|(2αx + β − √D)/(2αx + β + √D)|
        // skupni faktor (2x − 2√2)/(2x + 2√2) = (x − √2)/(x + √2)
        const g = new Q(gcdB(gcdB(L[0].n, L[1].n), s.n), lcmB(lcmB(L[0].d, L[1].d), s.d));
        const Lt = arrAst(aScale(L, g.inv()), v);
        const sg = s.div(g);
        const sq = m > 1 ? (sg.one ? call("sqrt", N(m)) : mul(qNode(sg), call("sqrt", N(m)))) : qNode(sg);
        out.push(T(K.div(s.mul(m)), lnAbs(div(sub(Lt, sq), add(Lt, sq))), [], [], m));
      }
    }
  // ½ln|x − 1| − ½ln|x + 1|: pozitiven člen najprej
  const tail = out.splice(pieces);
  return [...out, ...tail.filter((t) => t.c.sign > 0), ...tail.filter((t) => t.c.sign < 0)];
}
const lcmB = (a, b) => {
  const g = gcdB(a, b);
  return (a / g) * b;
};
const gcdB = (a, b) => {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) [a, b] = [b, a % b];
  return a;
};
// q (pozitiven ulomek) = s² · m, m celo število brez kvadratov
function sqrtParts(q) {
  let n = q.n * q.d;
  let out = 1n;
  for (let p = 2n; p * p <= n && p < 100000n; p++)
    while (n % (p * p) === 0n) {
      n /= p * p;
      out *= p;
    }
  return { s: new Q(out, q.d), m: Number(n) };
}
// Gaussova eliminacija nad ℚ
function solveQ(M, b) {
  const n = M.length;
  const A = M.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < n; c++) {
    tick();
    const p = A.findIndex((row, i) => i >= c && !row[c].zero);
    if (p < 0) return null;
    [A[c], A[p]] = [A[p], A[c]];
    const inv = A[c][c].inv();
    A[c] = A[c].map((x) => x.mul(inv));
    for (let i = 0; i < n; i++) {
      if (i === c || A[i][c].zero) continue;
      const f = A[i][c];
      A[i] = A[i].map((x, j) => x.sub(A[c][j].mul(f)));
    }
  }
  return A.map((row) => row[n]);
}

function verifyIntegral(F, f, v, S) {
  let dF;
  try {
    dF = S.fn(diff(F, v, S.ctx));
  } catch {
    return false;
  }
  const ff = S.fn(f);
  let ok = 0;
  for (const pt of S.pts) {
    const a = ff(pt);
    const b = dF(pt);
    if (!Number.isFinite(a) || !Number.isFinite(b) || Math.abs(a) > 1e8) continue;
    if (Math.abs(a - b) > 1e-6 * Math.max(1, Math.abs(a), Math.abs(b))) return false;
    ok++;
  }
  return ok >= 5;
}

// ---------------------------------------------------------------------------
// Limita

const isZero = (x) => Math.abs(x) < 1e-12;
const R = (v, q) => ({ v: isZero(v) ? 0 : v, ...(q ? { q } : {}) });
const NAN = { v: NaN };
const fin = (x) => Number.isFinite(x.v);

function limRational(r, L) {
  const n = toArr(r.n, L.v);
  const d = toArr(r.d, L.v);
  if (!n || !d) return null;
  if (!n.length) return R(0, Q.ZERO);
  if (!Number.isFinite(L.a)) {
    const dn = deg(n);
    const dd = deg(d);
    if (dn < dd) return R(0, Q.ZERO);
    const lq = n[dn].div(d[dd]);
    if (dn === dd) return R(lq.num(), lq);
    return R(lq.sign * (L.a < 0 && (dn - dd) % 2 ? -1 : 1) * Infinity);
  }
  if (L.aq) {
    const nq = n.reduceRight((s, c) => s.mul(L.aq).add(c), Q.ZERO);
    const dq = d.reduceRight((s, c) => s.mul(L.aq).add(c), Q.ZERO);
    if (!dq.zero) return R(nq.div(dq).num(), nq.div(dq));
  } else {
    const dv = aEval(d, L.a);
    if (!isZero(dv)) return R(aEval(n, L.a) / dv);
  }
  return infSign((x) => aEval(n, x) / aEval(d, x), L);
}
// predznak neskončne limite iz vrednosti blizu točke (na obeh straneh enak, sicer limita ne obstaja)
function infSign(f, L) {
  if (!Number.isFinite(L.a)) {
    const y = f(L.a > 0 ? 1e7 : -1e7);
    return Number.isFinite(y) || Math.abs(y) === Infinity ? R(Math.sign(y) * Infinity) : NAN;
  }
  const sg = L.sides.map((s) => Math.sign(f(L.a + s * 1e-7)));
  if (sg.some((x) => !x || Number.isNaN(x)) || new Set(sg).size !== 1) return NAN;
  return R(sg[0] * Infinity);
}

function lim(n, L, depth = 0) {
  tick();
  if (depth > 60) return NAN;
  n = unwrap(n);
  const r = tryRat(n, L.scope);
  if (r && r.n.vars().every((w) => w === L.v) && r.d.vars().every((w) => w === L.v)) return limRational(r, L) || NAN;
  if (!dep(n, L.v)) return R(L.at(n, 0));
  if (Number.isFinite(L.a)) {
    const y = L.at(n, L.a);
    if (Number.isFinite(y) && continuous(n, y, L)) return R(y);
  }
  const l = (x) => lim(x, L, depth + 1);
  switch (n.k) {
    case "neg": {
      const a = l(n.a);
      return R(-a.v, a.q?.neg());
    }
    case "+":
    case "-": {
      const a = l(n.a);
      const b = l(n.b);
      const s = n.k === "+" ? 1 : -1;
      const sum = a.v + s * b.v;
      if (!Number.isNaN(sum)) return R(sum, a.q && b.q ? (s > 0 ? a.q.add(b.q) : a.q.sub(b.q)) : null);
      // ∞ − ∞: na skupni imenovalec
      const fr = (x) => (unwrap(x).k === "/" ? [unwrap(x).a, unwrap(x).b] : [x, N(1)]);
      const [an, ad] = fr(n.a);
      const [bn, bd] = fr(n.b);
      if (unwrap(ad).k === "num" && unwrap(bd).k === "num") return NAN;
      return quotient(B(n.k, mul(an, bd), mul(bn, ad)), mul(ad, bd), L, depth + 1, 0);
    }
    case "*": {
      // A·(B/C) = (A·B)/C: (1/x)·ln(1 + x) = ln(1 + x)/x
      for (const [p, q] of [
        [n.a, n.b],
        [n.b, n.a],
      ])
        if (unwrap(q).k === "/") return quotient(mul(p, unwrap(q).a), unwrap(q).b, L, depth + 1, 0);
      const a = l(n.a);
      const b = l(n.b);
      if (Number.isNaN(a.v) || Number.isNaN(b.v)) return NAN;
      const p = a.v * b.v;
      if (!Number.isNaN(p)) return R(p, a.q && b.q ? a.q.mul(b.q) : null);
      // 0 · ∞ → ulomek: logaritem v števec (x·ln x = ln x/(1/x)), sicer neskončni faktor (x²·e⁻ˣ = x²/eˣ)
      const [z, w] = fin(a) ? [n.a, n.b] : [n.b, n.a];
      const hasLn = (x) => /"f":"(ln|log)"/.test(keyOf(x));
      const order = hasLn(z) && !hasLn(w) ? [z, w] : [w, z];
      const q1 = quotient(order[0], reciprocal(order[1]), L, depth + 1, 0);
      return Number.isNaN(q1.v) ? quotient(order[1], reciprocal(order[0]), L, depth + 1, 0) : q1;
    }
    case "/":
      return quotient(n.a, n.b, L, depth + 1, 0);
    case "^": {
      if (!dep(n.b, L.v)) {
        const a = l(n.a);
        const k = L.at(n.b, 0);
        if (Number.isNaN(a.v) || !Number.isFinite(k)) return NAN;
        if (a.v === 0 && k < 0) return infSign((x) => L.at(n, x), L);
        if (a.v === -Infinity && !Number.isInteger(k)) return NAN;
        const y = a.v ** k;
        return Number.isNaN(y) ? NAN : R(y, a.q && Number.isInteger(k) && Math.abs(k) <= 24 && !(a.q.zero && k < 0) ? a.q.pow(k) : null);
      }
      if (!dep(n.a, L.v)) {
        const c = L.at(n.a, 0);
        const b = l(n.b);
        const y = c ** b.v;
        return Number.isNaN(y) || c <= 0 ? NAN : R(y);
      }
      // uᵂ = e^(w·ln u) (tudi 1^∞)
      const ex = l(mul(n.b, call("ln", n.a)));
      return Number.isNaN(ex.v) ? NAN : R(Math.exp(ex.v));
    }
    case "call": {
      if (n.args.length !== 1) return NAN;
      const u = l(n.args[0]);
      if (Number.isNaN(u.v)) return NAN;
      if (Number.isFinite(u.v)) {
        const f = (x) => L.at(call(n.f, N(x)), 0);
        const y = f(u.v);
        if (Number.isFinite(y)) {
          const e = 1e-10 * Math.max(1, Math.abs(u.v));
          const near = [f(u.v - e), f(u.v + e)].filter(Number.isFinite);
          if (near.length && near.every((z) => Math.abs(z - y) <= 1e-3 * Math.max(1, Math.abs(y)))) return R(y);
          return NAN;
        }
        // ln u, u → 0⁺
        if (u.v === 0 && (n.f === "ln" || n.f === "log")) {
          const s = infSign((x) => L.at(n.args[0], x) * 1e30, L);
          return s.v === Infinity ? R(-Infinity) : NAN;
        }
        return NAN;
      }
      const pos = u.v > 0;
      const tab = { exp: pos ? Infinity : 0, ln: pos ? Infinity : NaN, log: pos ? Infinity : NaN, sqrt: pos ? Infinity : NaN, cbrt: u.v, arctan: pos ? Math.PI / 2 : -Math.PI / 2, tanh: pos ? 1 : -1, sinh: u.v, cosh: Infinity, abs: Infinity, arccot: pos ? 0 : Math.PI };
      return n.f in tab ? R(tab[n.f]) : NAN;
    }
  }
  return NAN;
}
// 1/eᵘ = e⁻ᵘ, 1/(a/b) = b/a (x²·e⁻ˣ = x²/eˣ, ne x²/(1/e⁻ˣ))
function reciprocal(n) {
  n = unwrap(n);
  if (n.k === "^") return pow(n.a, neg(n.b));
  if (n.k === "/") return isNumNode(n.a) && numOf(n.a) === 1 ? n.b : div(n.b, n.a);
  return div(N(1), n);
}
// korak h okoli točke a: relativno (pri a = 10⁻⁹ ne sme preskočiti 0), pri a = 0 absolutno
const hScale = (a) => (a === 0 ? 1 : Math.abs(a));
function continuous(n, y, L) {
  const h = 1e-10 * hScale(L.a);
  const near = L.sides.map((s) => L.at(n, L.a + s * h));
  return near.every((z) => Number.isFinite(z) && Math.abs(z - y) <= 1e-3 * Math.max(1, Math.abs(y)));
}
function quotient(Nn, Dn, L, depth, lh) {
  tick();
  if (depth > 60) return NAN;
  const a = lim(Nn, L, depth + 1);
  const b = lim(Dn, L, depth + 1);
  if (Number.isNaN(a.v) || Number.isNaN(b.v)) return NAN;
  const inf = (x) => !Number.isFinite(x.v);
  const exq = a.q && b.q && !b.q.zero ? a.q.div(b.q) : null;
  if (!inf(b) && b.v !== 0) return inf(a) ? R(a.v * Math.sign(b.v)) : R(a.v / b.v, exq);
  if (inf(b) && !inf(a)) return R(0, Q.ZERO);
  if (b.v === 0 && a.v !== 0 && !inf(a)) return infSign((x) => L.at(Nn, x) / L.at(Dn, x), L);
  // 0/0 ali ∞/∞: L'Hôpitalovo pravilo
  if (lh >= MAX_LHOPITAL || ++L.lh > 40) return NAN;
  let n2;
  let d2;
  try {
    n2 = simplify(diff(Nn, L.v, L.ctx));
    d2 = simplify(diff(Dn, L.v, L.ctx));
  } catch {
    return NAN;
  }
  if (keyOf(n2).length + keyOf(d2).length > 6000) return NAN; // odvodi se le še daljšajo
  const r = tryRat(div(n2, d2), L.scope);
  if (r && r.n.vars().every((w) => w === L.v) && r.d.vars().every((w) => w === L.v)) return limRational(r, L) || NAN;
  return quotient(n2, d2, L, depth + 1, lh + 1);
}

// vrednosti blizu točke: h = 10⁻² … 10⁻⁷ (z ene strani) ali x = 10² … 10⁸
function approach(f, L, s, far) {
  const ks = far ? [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] : [2, 3, 4, 5, 6, 7];
  if (!Number.isFinite(L.a)) return ks.map((k) => f(Math.sign(L.a) * 10 ** k));
  return ks.map((k) => f(L.a + s * 10 ** -k * hScale(L.a)));
}
function verifyLimit(val, f, L) {
  const sides = Number.isFinite(L.a) ? L.sides : [1];
  for (const s of sides) {
    const ys = approach(f, L, s, Number.isFinite(val)).filter((y) => !Number.isNaN(y));
    if (ys.length < 3) return false;
    if (Number.isFinite(val)) {
      const tol = 1e-4 * Math.max(1, Math.abs(val));
      if (ys.filter((y) => Math.abs(y - val) <= tol).length < 2) return false;
    } else {
      const sg = Math.sign(val);
      if (!ys.every((y) => Math.sign(y) === sg)) return false;
      for (let i = 1; i < ys.length; i++) if (Math.abs(ys[i]) < Math.abs(ys[i - 1])) return false;
      if (Math.abs(ys[ys.length - 1]) < 10) return false;
    }
  }
  return true;
}
// leva in desna vrednost se ne približujeta (1/x, |x|/x pri 0)
function sidesDiffer(f, L) {
  if (!Number.isFinite(L.a) || L.sides.length < 2) return false;
  // razlika se ne zmanjša v petih dekadah (⁵√x pri 0: razlika pada kot h^(1/5), limita obstaja)
  const d = [3, 4, 5, 6, 7, 8].map((k) => {
    const h = 10 ** -k * hScale(L.a);
    const l = f(L.a - h);
    const r = f(L.a + h);
    if (Number.isNaN(l) || Number.isNaN(r)) return NaN;
    if (!Number.isFinite(l) || !Number.isFinite(r)) return l === r ? 0 : Infinity; // e^(1/x): 0 in ∞
    return Math.abs(r - l) / Math.max(1, Math.min(Math.abs(l), Math.abs(r)));
  });
  return d.every((x) => x > 1e-3) && (d[5] === Infinity || d[5] >= 0.9 * d[0]);
}

// ---------------------------------------------------------------------------
// Prepoznavanje točnih števil: ulomki, a√b/c, večkratniki π in e, potence e

function recog(v) {
  if (!Number.isFinite(v)) return null;
  if (isZero(v)) return { q: Q.ZERO, r: 1, ks: [], kds: [] };
  // majhni imenovalci: pri velikih imenovalcih bi »našli« ulomek tudi za naključno število
  const maxQ = (x) => Math.max(1, Math.min(1000, Math.floor(1e4 / Math.max(1, Math.abs(x)))));
  const fr = toFraction(v, maxQ(v));
  if (fr && Math.abs(fr.p) <= 1e7) return { q: new Q(BigInt(fr.p), BigInt(fr.q)), r: 1, ks: [], kds: [] };
  const s2 = toFraction(v * v, maxQ(v * v));
  if (s2 && s2.p > 0 && s2.p * s2.q < 1e8) {
    const { s, m } = sqrtParts(new Q(BigInt(s2.p), BigInt(s2.q)));
    if (m > 1) return { q: v < 0 ? s.neg() : s, r: m, ks: [], kds: [] };
  }
  for (const [node, c] of [
    [PI, Math.PI],
    [E, Math.E],
    [call("ln", N(2)), Math.LN2],
    [call("ln", N(3)), Math.log(3)],
    [call("ln", N(10)), Math.LN10],
  ]) {
    const f = toFraction(v / c, 1000);
    if (f && Math.abs(f.p) <= 1000) return { q: new Q(BigInt(f.p), BigInt(f.q)), r: 1, ks: [node], kds: [] };
  }
  const lf = toFraction(Math.log(Math.abs(v)), 4);
  if (lf && Math.abs(lf.p) <= 12 && lf.p !== 0) {
    const e = new Q(BigInt(Math.abs(lf.p)), BigInt(lf.q));
    const node = e.one ? E : pow(E, qNode(e));
    return { q: Q.of(Math.sign(v)), r: 1, ks: lf.p > 0 ? [node] : [], kds: lf.p < 0 ? [node] : [] };
  }
  return null;
}
function valueTex(v, exact) {
  if (v === Infinity) return { tex: "\\infty" };
  if (v === -Infinity) return { tex: "-\\infty" };
  const rc = exact ? { q: exact, r: 1, ks: [], kds: [] } : recog(v);
  if (!rc) return { tex: decTex(v), approx: true };
  if (rc.q.zero) return { tex: "0" };
  return { tex: termTex(T(rc.q, null, rc.ks, rc.kds, rc.r), true) };
}
function decTex(v) {
  const s = String(Number(v.toPrecision(10)));
  return COMMA ? s.replace(".", "{,}") : s;
}

// ---------------------------------------------------------------------------
// Vstop

const err = (code, info = {}) => ({ error: { code, info } });
const errCode = (e) => (e instanceof AlgebraError ? (e.code === "timeout" || e.code === "big" ? "casBig" : /^cas/.test(e.code) ? e.code : "casUnsupported") : e?.code || "other");

function parsePoint(text, env) {
  const t = String(text ?? "").replace(/\s+/g, "");
  if (!t) return null;
  const inf = /^(\+?)(∞|inf|oo|infty|infinity)$/i.exec(t);
  if (inf) return { val: Infinity, tex: "\\infty" };
  if (/^[-−](∞|inf|oo|infty|infinity)$/i.test(t)) return { val: -Infinity, tex: "-\\infty" };
  try {
    const line = compileLine(t, { ...env, deg: false, grad: false });
    const val = line.run(line.ast)(line.scope);
    if (typeof val !== "number" || !Number.isFinite(val)) return null;
    const fr = toFraction(val, 10000);
    return { val, tex: lineTex(line.ast, COMMA), q: fr ? new Q(BigInt(fr.p), BigInt(fr.q)) : null };
  } catch {
    return null;
  }
}

/**
 * Izvede integriraj / limita / taylor (cmd iz parseCommand: { op, name, inner, args }).
 * @returns {{ kind:"cas", op, tex, resTex, approx?, none?, inner } | { error:{code, info} }}
 */
export function runCalc(cmd, env = {}) {
  COMMA = env.comma !== false;
  let line;
  try {
    line = compileLine(cmd.inner, { ...env, deg: false, grad: false });
    if (!line) return err("casEmpty");
  } catch (e) {
    return err(e.code || "other", e.info || {});
  }
  // limita(f; a): spremenljivka x
  if (cmd.op === "limit" && cmd.args.length === 1 && !/^\p{L}$/u.test(cmd.args[0].trim())) cmd = { ...cmd, args: ["x", cmd.args[0]] };
  const v = String(cmd.args[0] ?? "").trim() || "x";
  if (!/^\p{L}(_[\p{L}\d]+)?$/u.test(v) || v === "e" || v === "π" || v === "i") return err("casVarName");
  const innerTex = lineTex(line.ast, COMMA);
  const name = `\\operatorname{${cmd.name}}`;
  const wrapT = isSum(line.ast) ? `\\left(${innerTex}\\right)` : innerTex;
  try {
    if (line.ast.k === "cmp") return err(cmd.op === "integrate" ? "casIntegral" : cmd.op === "limit" ? "casLimit" : "casTaylor");
    // shranjene spremenljivke (a = 5, Ans) so števila; uporabniške funkcije f(x) = … vstavimo
    const scope = Object.create(null);
    const map = {};
    for (const k in line.scope) if (k !== v && typeof line.scope[k] === "number") map[k] = N(line.scope[k]);
    const ast = substitute(inlineUfn(line.rw(line.ast), line.ctx), map);
    const params = [...freeVars(ast)].filter((w) => w !== v);
    const run = (node) => {
      const f = line.run(node);
      return (pt) => {
        const s = Object.create(line.scope);
        Object.assign(s, pt);
        try {
          const y = f(s);
          return typeof y === "number" ? y : NaN;
        } catch {
          return NaN;
        }
      };
    };
    const S = { scope, ctx: line.ctx, fn: run };
    if (cmd.op === "integrate") {
      const base = KIT.points([v, ...params]);
      S.pts = [...base, ...base.map((p) => Object.fromEntries(Object.entries(p).map(([k, x]) => [k, k === v ? x * 0.27 : x])))];
      const ts0 = integ(ast, v, S);
      if (!ts0) return err("casIntegral");
      const ts = combine(ts0);
      if (!verifyIntegral(sumAst(ts), ast, v, S)) return err("casUnverified");
      const resTex = `${ts.length ? `${termsTex(ts)} + ` : ""}C`;
      if (resTex.length > 6000) throw fail("big");
      return { kind: "cas", op: "integrate", tex: `\\int ${wrapT}\\,d${KIT.varTex(v)}`, resTex, inner: cmd.inner };
    }
    if (params.length) return err(cmd.op === "limit" ? "casLimit" : "casTaylor");
    if (cmd.op === "limit") return limitCmd(ast, v, cmd, env, S, wrapT);
    return taylorCmd(ast, v, cmd, env, S, name, innerTex);
  } catch (e) {
    return err(errCode(e));
  }
}

function limitCmd(ast, v, cmd, env, S, wrapT) {
  const pt = parsePoint(cmd.args[1], env);
  if (!pt) return err("casPoint");
  const fv = S.fn(ast);
  const f = (x) => fv({ [v]: x });
  const L = { lh: 0, v, a: pt.val, aq: pt.q && Math.abs(pt.q.num() - pt.val) < 1e-15 * Math.max(1, Math.abs(pt.val)) ? pt.q : null, scope: S.scope, ctx: S.ctx };
  const cache = new Map();
  L.at = (node, x) => {
    const k = keyOf(node);
    if (!cache.has(k)) cache.set(k, S.fn(node));
    return cache.get(k)({ [v]: x });
  };
  // strani, kjer je funkcija definirana (√x, ln x pri 0: samo desno)
  L.sides = Number.isFinite(pt.val) ? [-1, 1].filter((s) => [3, 4, 5].some((k) => !Number.isNaN(f(pt.val + s * 10 ** -k * hScale(pt.val))))) : [1];
  if (!L.sides.length) return err("casLimit");
  const tex = `\\lim\\limits_{${KIT.varTex(v)} \\to ${pt.tex}} ${wrapT}`;
  const base = { kind: "cas", op: "limit", tex, inner: cmd.inner };
  if (sidesDiffer(f, L)) return { ...base, none: true, resTex: "" };
  const r = lim(ast, L);
  if (Number.isNaN(r.v)) return err("casLimit");
  if (!verifyLimit(r.v, f, L)) return err("casUnverified");
  const vt = valueTex(r.v, r.q);
  return { ...base, resTex: vt.tex, ...(vt.approx ? { approx: true } : {}) };
}

function taylorCmd(ast, v, cmd, env, S, name, innerTex) {
  const pt = cmd.args[1]?.trim() ? parsePoint(cmd.args[1], env) : { val: 0, tex: "0", q: Q.ZERO };
  if (!pt || !Number.isFinite(pt.val)) return err("casPoint");
  let n = 5;
  if (cmd.args[2]?.trim()) {
    const p = parsePoint(cmd.args[2], env);
    if (!p || !Number.isInteger(p.val) || p.val < 0 || p.val > MAX_TAYLOR) return err("casTaylorN", { max: MAX_TAYLOR });
    n = p.val;
  }
  const a = pt.val;
  const at = (node, x) => S.fn(node)({ [v]: x });
  // (x − a): a točno (ulomek, √, π) ali decimalno
  const ra = recog(a);
  const aAst = ra ? termAst(T(ra.q, null, ra.ks, ra.kds, ra.r)) : N(a);
  const aTexAbs = a === 0 ? "" : ra ? termTex(T(ra.q.abs(), null, ra.ks, ra.kds, ra.r), true) : decTex(Math.abs(a));
  const xm = a === 0 ? V(v) : sub(V(v), aAst);
  const xmTex = a === 0 ? KIT.varTex(v) : `\\left(${KIT.varTex(v)} ${a < 0 ? "+" : "-"} ${aTexAbs}\\right)`;
  // koeficienti cₖ = f⁽ᵏ⁾(a)/k! iz Taylorjeve aritmetike (vrsta vsakega vozlišča), točno prepoznani
  const cs = jet(ast, v, a, n, S);
  if (!cs || !cs.every(Number.isFinite)) return err("casTaylor");
  const pr = tryRat(ast, S.scope);
  const poly = pr && pr.d.isConst() && pr.n.vars().every((w) => w === v) && pr.n.degree(v) <= n;
  const terms = [];
  let approx = false;
  let fact = Q.ONE;
  for (let k = 0; k <= n; k++) {
    tick();
    if (k > 0) fact = fact.mul(k);
    const y = cs[k] * Number(fact.n);
    const xT = k === 0 ? null : k === 1 ? xm : pow(xm, N(k));
    const xTex = k === 0 ? null : k === 1 ? xmTex : `${xmTex}^{${k}}`;
    let rc = recog(y);
    if (rc) rc = { ...rc, q: rc.q.div(fact) };
    else {
      rc = recog(cs[k]);
      if (rc && rc.r === 1 && !rc.ks.length && !rc.kds.length && rc.q.d > 1000n) rc = null;
    }
    if (rc) {
      if (rc.q.zero) continue;
      terms.push({ ...T(rc.q, xT, rc.ks, rc.kds, rc.r), xTex });
    } else {
      approx = true;
      if (isZero(cs[k])) continue;
      terms.push({ ...T(Q.of(Number(cs[k].toPrecision(8))), xT), xTex, dec: true });
    }
  }
  // preverjanje: napaka f − T pada kot hⁿ⁺¹ (ali je na ravni zaokrožitve)
  const Tf = S.fn(sumAst(terms.map((t) => ({ ...t, xTex: undefined }))));
  const f = S.fn(ast);
  let checked = 0;
  for (const s of [1, -1]) {
    const e = [0.05, 0.025].map((h) => Math.abs(f({ [v]: a + s * h }) - Tf({ [v]: a + s * h })));
    if (!e.every(Number.isFinite)) continue;
    const scale = Math.max(1, Math.abs(f({ [v]: a })));
    const tol = approx ? 1e-6 : 1e-11;
    if (!(e[1] <= tol * scale || e[0] / e[1] >= 0.6 * 2 ** (n + 1))) return err("casUnverified");
    checked++;
  }
  if (!checked) return err("casUnverified");
  let resTex = terms.length ? terms.map((t, i) => (t.dec ? decTerm(t, i === 0) : termTex(t, i === 0))).join("") : "0";
  const nT = (cmd.args[2]?.trim() ? `;\\ ${n}` : "");
  const aT = cmd.args[1]?.trim() || nT ? `;\\ ${pt.tex}` : "";
  return { kind: "cas", op: "taylor", tex: `${name}\\left(${innerTex};\\ ${KIT.varTex(v)}${aT}${nT}\\right)`, resTex, inner: cmd.inner, ...(approx ? { approx: true } : {}) };
}
function decTerm(t, first) {
  const neg = t.c.sign < 0;
  const body = `${decTex(Math.abs(t.c.num()))}${t.xTex ? t.xTex : ""}`;
  return (first ? (neg ? "-" : "") : neg ? " - " : " + ") + body;
}

// Taylorjeva aritmetika: vrsta [c₀, c₁, …, cₙ] izraza okoli v = a (cₖ = f⁽ᵏ⁾(a)/k!), v plavajoči vejici
function jet(node, v, a, n, S) {
  const z = () => new Array(n + 1).fill(0);
  const cst = (x) => {
    const o = z();
    o[0] = x;
    return o;
  };
  const mulJ = (p, q) => {
    const o = z();
    for (let i = 0; i <= n; i++) for (let j = 0; i + j <= n; j++) o[i + j] += p[i] * q[j];
    return o;
  };
  const divJ = (p, q) => {
    if (q[0] === 0) return null;
    const o = z();
    for (let k = 0; k <= n; k++) {
      let s = p[k];
      for (let j = 1; j <= k; j++) s -= q[j] * o[k - j];
      o[k] = s / q[0];
    }
    return o;
  };
  const expJ = (u) => {
    const o = z();
    o[0] = Math.exp(u[0]);
    for (let k = 1; k <= n; k++) {
      let s = 0;
      for (let j = 1; j <= k; j++) s += j * u[j] * o[k - j];
      o[k] = s / k;
    }
    return o;
  };
  const lnJ = (u) => {
    if (!(u[0] > 0)) return null;
    const o = z();
    o[0] = Math.log(u[0]);
    for (let k = 1; k <= n; k++) {
      let s = u[k];
      for (let j = 1; j < k; j++) s -= (j / k) * o[j] * u[k - j];
      o[k] = s / u[0];
    }
    return o;
  };
  const powJ = (u, p) => {
    if (Number.isInteger(p) && p >= 0 && p <= 64) {
      let o = cst(1);
      for (let i = 0; i < p; i++) o = mulJ(o, u);
      return o;
    }
    if (u[0] === 0 || (u[0] < 0 && !Number.isInteger(p))) return null;
    const o = z();
    o[0] = u[0] ** p;
    for (let k = 1; k <= n; k++) {
      let s = 0;
      for (let j = 1; j <= k; j++) s += (p * j - (k - j)) * u[j] * o[k - j];
      o[k] = s / (k * u[0]);
    }
    return o;
  };
  // sin in cos (sinh in cosh pri hyp) skupaj
  const trig = (u, hyp) => {
    const sn = z();
    const cs = z();
    sn[0] = hyp ? Math.sinh(u[0]) : Math.sin(u[0]);
    cs[0] = hyp ? Math.cosh(u[0]) : Math.cos(u[0]);
    for (let k = 1; k <= n; k++) {
      let a1 = 0;
      let a2 = 0;
      for (let j = 1; j <= k; j++) {
        a1 += j * u[j] * cs[k - j];
        a2 += j * u[j] * sn[k - j];
      }
      sn[k] = a1 / k;
      cs[k] = (hyp ? a2 : -a2) / k;
    }
    return [sn, cs];
  };
  // f(u) iz f′(u)·u′: integral vrste
  const integJ = (c0, d) => {
    const o = z();
    o[0] = c0;
    for (let k = 1; k <= n; k++) o[k] = d[k - 1] / k;
    return o;
  };
  const dJ = (u) => {
    const o = z();
    for (let k = 0; k < n; k++) o[k] = (k + 1) * u[k + 1];
    return o;
  };
  const sq = (u) => mulJ(u, u);
  const one = cst(1);
  const subJ = (p, q) => p.map((x, i) => x - q[i]);
  const addJ = (p, q) => p.map((x, i) => x + q[i]);
  const J = (m) => {
    tick();
    m = unwrap(m);
    if (!dep(m, v)) {
      const y = S.fn(m)({});
      return Number.isFinite(y) ? cst(y) : null;
    }
    const r = (x) => J(x);
    switch (m.k) {
      case "var": {
        const o = cst(a);
        if (n >= 1) o[1] = 1;
        return o;
      }
      case "neg": {
        const p = r(m.a);
        return p && p.map((x) => -x);
      }
      case "+":
      case "-": {
        const p = r(m.a);
        const q = p && r(m.b);
        return q && (m.k === "+" ? addJ(p, q) : subJ(p, q));
      }
      case "*": {
        const p = r(m.a);
        const q = p && r(m.b);
        return q && mulJ(p, q);
      }
      case "/": {
        const p = r(m.a);
        const q = p && r(m.b);
        return q && divJ(p, q);
      }
      case "^": {
        if (!dep(m.b, v)) {
          const u = r(m.a);
          const pv = S.fn(m.b)({});
          return u && Number.isFinite(pv) ? powJ(u, pv) : null;
        }
        const w = r(m.b);
        if (!w) return null;
        if (!dep(m.a, v)) {
          const c = S.fn(m.a)({});
          return c > 0 ? expJ(w.map((x) => x * Math.log(c))) : null;
        }
        const u = r(m.a);
        const lu = u && lnJ(u);
        return lu && expJ(mulJ(w, lu));
      }
      case "call": {
        if (m.args.length !== 1) return null;
        const u = r(m.args[0]);
        if (!u) return null;
        switch (m.f) {
          case "exp":
            return expJ(u);
          case "ln":
            return lnJ(u);
          case "log": {
            const l = lnJ(u);
            return l && l.map((x) => x / Math.LN10);
          }
          case "sqrt":
            return powJ(u, 0.5);
          case "cbrt":
            return u[0] > 0 ? powJ(u, 1 / 3) : null;
          case "sin":
            return trig(u)[0];
          case "cos":
            return trig(u)[1];
          case "tan": {
            const [sn, c] = trig(u);
            return divJ(sn, c);
          }
          case "cot": {
            const [sn, c] = trig(u);
            return divJ(c, sn);
          }
          case "sinh":
            return trig(u, true)[0];
          case "cosh":
            return trig(u, true)[1];
          case "tanh": {
            const [sn, c] = trig(u, true);
            return divJ(sn, c);
          }
          case "arctan": {
            const d = divJ(dJ(u), addJ(one, sq(u)));
            return d && integJ(Math.atan(u[0]), d);
          }
          case "arcsin":
          case "arccos": {
            if (!(Math.abs(u[0]) < 1)) return null;
            const rt = powJ(subJ(one, sq(u)), -0.5);
            const d = rt && mulJ(dJ(u), rt);
            if (!d) return null;
            return m.f === "arcsin" ? integJ(Math.asin(u[0]), d) : integJ(Math.acos(u[0]), d.map((x) => -x));
          }
          case "abs":
            return u[0] > 0 ? u : u[0] < 0 ? u.map((x) => -x) : null;
        }
        return null;
      }
    }
    return null;
  };
  return J(node);
}
