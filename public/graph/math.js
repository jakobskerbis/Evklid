// Grafični kalkulator – jedro: branje izrazov, računanje, odvodi in zapis v TeX.
// Brez DOM in brez knjižnic, zato teče tudi v Node (testi v test/graph.test.js).
//
// Kaj razume (kot Desmos/GeoGebra):
//   2x, 3(x+1), (x-1)(x+2), xy, 2πr, sin x, sin 2x, sin^2 x, sin^-1 x, ln x, log_2 x, √x, ∛x, |x|, x², x³, 5!
//   e^x, π, τ, ∞, °, %, mod(7,3), min, max, floor, ceil, round, nCr(5,2) …
//   y = …, x = …, f(x) = …, r = sin(3θ), (cos t, sin t), (2, 3), [1, 2, 3], [1...10]
//   x² + y² = 25, y > x², 1 < x < 3, {x < 0: -x, x}, x² {0 < x < 2}
//   f'(x), d/dx(x³), ∫_0^1 x² dx, ∫ cos x dx, ∑_(n=1)^(10) 1/n²
//   decimalna vejica (2,5) zunaj oklepajev, »:« kot deljenje

// ---------- vgrajene funkcije ----------

const DEG = Math.PI / 180;
const fact = (n) => {
  if (n < 0 || !Number.isFinite(n)) return NaN;
  if (Number.isInteger(n)) {
    if (n > 170) return Infinity;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  }
  return gamma(n + 1);
};
function gamma(z) {
  // Lanczos
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  const g = 7;
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  z -= 1;
  let x = c[0];
  for (let i = 1; i < g + 2; i++) x += c[i] / (z + i);
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * t ** (z + 0.5) * Math.exp(-t) * x;
}
const gcd2 = (a, b) => {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) [a, b] = [b, a % b];
  return a;
};
const sorted = (l) => [...l].filter(Number.isFinite).sort((a, b) => a - b);
const mean = (l) => (l.length ? l.reduce((s, v) => s + v, 0) / l.length : NaN);
const variance = (l, sample = true) => {
  const m = mean(l);
  return l.length > (sample ? 1 : 0) ? l.reduce((s, v) => s + (v - m) ** 2, 0) / (l.length - (sample ? 1 : 0)) : NaN;
};
const median = (l) => {
  const s = sorted(l);
  if (!s.length) return NaN;
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const cbrt = (x) => Math.cbrt(x);
// nth root that works for odd roots of negative numbers
const nthroot = (x, n) => (x < 0 && Math.abs(n % 2) === 1 ? -((-x) ** (1 / n)) : x ** (1 / n));
// potenca z negativno osnovo in ulomljenim eksponentom lihega imenovalca: (-8)^(1/3) = -2
function pow(a, b) {
  const r = a ** b;
  if (Number.isNaN(r) && a < 0 && Number.isFinite(b)) {
    // b ≈ p/q z lihim q
    for (let q = 3; q <= 15; q += 2) {
      const p = Math.round(b * q);
      if (Math.abs(p / q - b) < 1e-12) return (p % 2 ? -1 : 1) * (-a) ** b;
    }
  }
  return r;
}

// trig: u = enota kota v radianih (1 radiani, π/180 stopinje, π/200 gradi).
// Na večkratnikih pravega kota so vrednosti točne (cos 90° = 0, ne 6·10⁻¹⁷; tan 90° ne obstaja), kot na kalkulatorju.
const GRA = Math.PI / 200;
// Stopinje in gradi najprej točno zmanjšamo na en krog (x % 360 je v plavajoči vejici točen), sicer bi bil
// sin(1e20°) šum; radiane pustimo Math.sin (ta jih zmanjša sam), večkratnik π/2 iščemo le pri |q| < 2³¹
// (pri velikih x je vsak x/(π/2) celo število, sin(1e20) pa ni 0).
const reduce = (x, u) => (u === DEG ? x % 360 : u === GRA ? x % 400 : x);
const quarter = (x, u) => {
  const q = x / (u === DEG ? 90 : u === GRA ? 100 : Math.PI / 2);
  return Number.isInteger(q) && Math.abs(q) < 2 ** 31 ? ((q % 4) + 4) % 4 : -1;
};
const SIN_Q = [0, 1, 0, -1];
const COS_Q = [1, 0, -1, 0];
const exactTrig = (f, x, u) => {
  const r = reduce(x, u);
  const q = quarter(r, u);
  if (q < 0) return f(r * u);
  return f === Math.sin ? SIN_Q[q] : COS_Q[q];
};
const tanQ = (x, u, cot) => {
  const r = reduce(x, u);
  const q = quarter(r, u);
  if (q < 0) return cot ? 1 / Math.tan(r * u) : Math.tan(r * u);
  return q % 2 === (cot ? 0 : 1) ? NaN : 0;
};
const inv = (c) => (c === 0 ? NaN : 1 / c);
const TRIG = {
  sin: (x, u) => exactTrig(Math.sin, x, u),
  cos: (x, u) => exactTrig(Math.cos, x, u),
  tan: (x, u) => tanQ(x, u, false),
  cot: (x, u) => tanQ(x, u, true),
  sec: (x, u) => inv(exactTrig(Math.cos, x, u)), // sec 90° ne obstaja (ne ∞)
  csc: (x, u) => inv(exactTrig(Math.sin, x, u)),
  arcsin: (x, u) => Math.asin(x) / u,
  arccos: (x, u) => Math.acos(x) / u,
  arctan: (x, u) => Math.atan(x) / u,
  arccot: (x, u) => (Math.PI / 2 - Math.atan(x)) / u,
};
const UNARY = {
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  arsinh: Math.asinh,
  arcosh: Math.acosh,
  artanh: Math.atanh,
  ln: Math.log,
  log: Math.log10,
  exp: Math.exp,
  sqrt: Math.sqrt,
  cbrt,
  abs: Math.abs,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  sign: Math.sign,
  sgn: Math.sign,
  Int: Math.trunc, // celi del proti 0 (Casio Int)
  frac: (x) => x - Math.trunc(x), // Casio Frac: frac(-2,7) = -0,7
};
// funkcije več števil
const MULTI = {
  min: (...a) => Math.min(...a),
  max: (...a) => Math.max(...a),
  mod: (a, b) => ((a % b) + b) % b,
  gcd: (...a) => a.reduce(gcd2),
  lcm: (...a) => a.reduce((x, y) => Math.abs(Math.round(x) * Math.round(y)) / gcd2(x, y)),
  nCr: (n, k) => (k < 0 || k > n ? 0 : Math.round(fact(n) / (fact(k) * fact(n - k)))),
  nPr: (n, k) => (k < 0 || k > n ? 0 : Math.round(fact(n) / fact(n - k))),
  root: (x, n) => nthroot(x, n),
  logb: (x, b) => Math.log(x) / Math.log(b),
  // celo število na [a, b] (Casio RanInt#)
  randint: (a, b) => {
    const lo = Math.ceil(Math.min(a, b));
    const hi = Math.floor(Math.max(a, b));
    return hi < lo ? NaN : lo + Math.floor(Math.random() * (hi - lo + 1));
  },
};
// funkcije seznamov (vrnejo eno število)
const LISTF = {
  mean,
  median,
  total: (l) => l.reduce((s, v) => s + v, 0),
  stdev: (l) => Math.sqrt(variance(l)),
  stdevp: (l) => Math.sqrt(variance(l, false)),
  var: (l) => variance(l),
  length: (l) => l.length,
  count: (l) => l.length,
};
const ALIASES = { asin: "arcsin", acos: "arccos", atan: "arctan", acot: "arccot", arctg: "arctan", tg: "tan", ctg: "cot", sh: "sinh", ch: "cosh", th: "tanh", lg: "log", sqr: "sqrt", asinh: "arsinh", acosh: "arcosh", atanh: "artanh", avg: "mean", ncr: "nCr", npr: "nPr", binom: "nCr" };
const INVERSE = { sin: "arcsin", cos: "arccos", tan: "arctan", cot: "arccot", sinh: "arsinh", cosh: "arcosh", tanh: "artanh" };

export const BUILTINS = new Set([...Object.keys(TRIG), ...Object.keys(UNARY), ...Object.keys(MULTI), ...Object.keys(LISTF), "sort", "sum", "prod", "rand", "Pol", "Rec", ...Object.keys(ALIASES)]);
const CONSTS = { pi: Math.PI, "π": Math.PI, tau: 2 * Math.PI, "τ": 2 * Math.PI, e: Math.E, inf: Infinity };
const GREEK = { theta: "θ", alpha: "α", beta: "β", gamma: "γ", delta: "δ", lambda: "λ", mu: "μ", phi: "φ", omega: "ω", sigma: "σ", rho: "ρ" };
// imena, ki jih razbijemo iz niza črk (najdaljša najprej): sinx → sin x, pix → pi x
const NAMES = [...BUILTINS, ...Object.keys(CONSTS).filter((c) => c.length > 1), ...Object.keys(GREEK), "int"].sort((a, b) => b.length - a.length);

// ---------- branje (tokenizer) ----------

const SUPS = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-", "⁺": "+", "ⁿ": "n", "ˣ": "x", "ʸ": "y", "ᵗ": "t" };
const SUBS = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9" };

export class MathError extends Error {
  constructor(code, info = {}) {
    super(code);
    this.code = code;
    this.info = info;
  }
}

export function normalize(src) {
  return String(src ?? "")
    .replace(/[−–—]/g, "-")
    .replace(/[·×⋅∗]/g, "*")
    .replace(/÷/g, "/")
    .replace(/≤|=</g, "<=")
    .replace(/≥|=>/g, ">=")
    .replace(/≠/g, "!=")
    .replace(/∞/g, "inf")
    .replace(/[′’]/g, "'")
    .replace(/″/g, "''")
    .replace(/∏/g, "prod")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺ⁿˣʸᵗ]+/g, (m) => `^(${[...m].map((c) => SUPS[c]).join("")})`)
    .replace(/[₀₁₂₃₄₅₆₇₈₉]+/g, (m) => `_${[...m].map((c) => SUBS[c]).join("")}`)
    .replace(/\\(left|right)/g, "")
    .replace(/\\cdot|\\times/g, "*")
    .replace(/\\pi/g, "π")
    .replace(/\\theta/g, "θ")
    .replace(/\\le(q)?/g, "<=")
    .replace(/\\ge(q)?/g, ">=");
}

const LETTER = /[A-Za-zα-ωΑ-Ωθπτ]/;

export function tokenize(src) {
  const s = normalize(src);
  const out = [];
  let depth = 0;
  let i = 0;
  let sp = false;
  const push = (t, v, extra) => {
    out.push({ t, v, sp, pos: i, ...extra });
    sp = false;
  };
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) {
      sp = true;
      i++;
      continue;
    }
    // d/dx
    const dm = /^d\/d([a-zθt])/.exec(s.slice(i));
    if (dm && !LETTER.test(s[i - 1] || "")) {
      push("deriv", dm[1]);
      i += dm[0].length;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      if (s.startsWith("...", i) || s.startsWith("..", i)) {
        const n = s.startsWith("...", i) ? 3 : 2;
        push("range", "...");
        i += n;
        continue;
      }
      let m = /^(\d+\.?\d*|\.\d+)/.exec(s.slice(i));
      if (!m) throw new MathError("char", { ch: c, pos: i });
      let txt = m[0];
      // decimalna vejica zunaj oklepajev: 2,5 → 2.5
      if (depth === 0 && !txt.includes(".") && s[i + txt.length] === "," && /\d/.test(s[i + txt.length + 1] || "")) {
        const m2 = /^\d+/.exec(s.slice(i + txt.length + 1));
        txt = `${txt}.${m2[0]}`; // enako dolg kot »2,5«
        push("num", Number(txt));
        i += txt.length;
        continue;
      }
      if (txt.endsWith(".") && s[i + txt.length] === ".") txt = txt.slice(0, -1); // 1...5
      push("num", Number(txt));
      i += txt.length;
      continue;
    }
    if (LETTER.test(c)) {
      let j = i;
      while (j < s.length && LETTER.test(s[j])) j++;
      const run = s.slice(i, j);
      const start = i;
      let k = 0;
      let first = true;
      while (k < run.length) {
        const name = NAMES.find((n) => run.startsWith(n, k));
        // Δt, ΔW, Δm: sprememba količine je eno ime (fizikalne formule), ne Δ · t
        const piece = run[k] === "Δ" && k + 1 < run.length && !NAMES.some((n) => run.startsWith(n, k + 1)) ? run.slice(k, k + 2) : name || run[k];
        i = start + k;
        if (!first) sp = false;
        push("id", GREEK[piece] || ALIASES[piece] || piece, { raw: piece });
        first = false;
        k += piece.length;
      }
      i = j;
      continue;
    }
    const two = s.slice(i, i + 2);
    if (two === "<=" || two === ">=" || two === "!=") {
      push("cmp", two);
      i += 2;
      continue;
    }
    if (c === "<" || c === ">" || c === "=") {
      push("cmp", c);
      i++;
      continue;
    }
    if ("([{".includes(c)) depth++;
    if (")]}".includes(c)) depth = Math.max(0, depth - 1);
    if ("+-*/^!'_:,()[]{}|%°".includes(c)) {
      push(c === "'" ? "prime" : ",()[]{}|".includes(c) ? c : "op", c);
      i++;
      continue;
    }
    if (c === "√") {
      push("sqrt", "sqrt");
      i++;
      continue;
    }
    if (c === "∛") {
      push("sqrt", "cbrt");
      i++;
      continue;
    }
    if (c === "∜") {
      push("sqrt", "root4");
      i++;
      continue;
    }
    if (c === "∫") {
      push("int", "int");
      i++;
      continue;
    }
    if (c === "∑" || c === "Σ") {
      push("id", "sum");
      i++;
      continue;
    }
    throw new MathError("char", { ch: c, pos: i });
  }
  return out;
}

// ---------- razčlenjevanje (parser) ----------

const N = (v) => ({ k: "num", v });
const V = (name) => ({ k: "var", name });
const B = (op, a, b, imp) => (imp ? { k: op, a, b, imp: true } : { k: op, a, b });

export function parse(src, { funcs = new Set() } = {}) {
  const toks = tokenize(src);
  let i = 0;
  let absDepth = 0;
  let inPiece = 0;
  let stopD = 0;
  const peek = (o = 0) => toks[i + o];
  const is = (t, v, o = 0) => {
    const k = toks[i + o];
    return !!k && k.t === t && (v === undefined || k.v === v);
  };
  const next = () => toks[i++];
  const expect = (t, v) => {
    if (!is(t, v)) throw new MathError(i >= toks.length ? "end" : "unexpected", { want: v ?? t, got: peek()?.v, pos: peek()?.pos });
    return next();
  };
  const isFunc = (tok) => tok && tok.t === "id" && BUILTINS.has(tok.v);
  const atD = () => stopD && is("id", "d") && peek(1)?.t === "id" && !peek(1).sp && peek(1).v.length === 1;

  function startsFactor(tok) {
    if (!tok) return false;
    if (tok.t === "num" || tok.t === "(" || tok.t === "[" || tok.t === "sqrt" || tok.t === "int" || tok.t === "deriv") return true;
    if (tok.t === "{") return true;
    if (tok.t === "id") return !atD();
    if (tok.t === "|") return absDepth === 0;
    return false;
  }

  function statement() {
    const first = expr();
    if (!is("cmp")) return first;
    const ops = [];
    const terms = [first];
    while (is("cmp")) {
      ops.push(next().v);
      terms.push(expr());
    }
    return { k: "cmp", ops, terms };
  }

  function expr() {
    let a = mul();
    while (is("op", "+") || is("op", "-")) {
      const op = next().v;
      a = B(op, a, mul());
    }
    return a;
  }

  function mul() {
    let a = unary();
    for (;;) {
      if (is("op", "*") || is("op", "/") || (is("op", ":") && !inPiece)) {
        const op = next().v;
        a = B(op === ":" ? "/" : op, a, unary());
      } else if (startsFactor(peek())) {
        a = B("*", a, power(), true);
      } else break;
    }
    return a;
  }

  function unary() {
    if (is("op", "-")) {
      next();
      return { k: "neg", a: unary() };
    }
    if (is("op", "+")) {
      next();
      return unary();
    }
    return power();
  }

  function power() {
    const base = postfix();
    if (is("op", "^")) {
      next();
      return B("^", base, unary());
    }
    return base;
  }

  function postfix() {
    let a = primary();
    for (;;) {
      if (is("op", "!")) a = (next(), { k: "fact", a });
      else if (is("op", "°")) a = (next(), { k: "deg", a });
      else if (is("op", "%")) a = (next(), { k: "pct", a });
      else break;
    }
    return a;
  }

  // argument funkcije brez oklepaja: sin 2x → sin(2x), sin x + 1 → sin(x) + 1
  function bareArg() {
    let a = unary();
    while (startsFactor(peek()) && !isFunc(peek()) && !is("int") && !is("deriv") && !is("{")) a = B("*", a, power(), true);
    return a;
  }

  function parenArgs() {
    expect("(");
    const args = [];
    if (!is(")")) {
      do args.push(statement());
      while (is(",") && next());
    }
    expect(")");
    return args;
  }

  // a_1, a_{12}, a_(n)
  function subscript() {
    if (!is("op", "_")) return "";
    next();
    if (is("num") || is("id")) return String(next().v);
    if (is("{") || is("(")) {
      const close = is("{") ? "}" : ")";
      next();
      let s = "";
      while (!is(close)) {
        if (i >= toks.length) throw new MathError("end");
        s += String(next().v);
      }
      next();
      return s;
    }
    throw new MathError("unexpected", { got: peek()?.v });
  }

  function primary() {
    const tok = peek();
    if (!tok) throw new MathError("end");
    if (tok.t === "num") return N(next().v);
    if (tok.t === "(") {
      next();
      const items = [];
      do items.push(statement());
      while (is(",") && next());
      expect(")");
      return items.length === 1 ? { k: "grp", a: items[0] } : { k: "tuple", items };
    }
    if (tok.t === "[") {
      next();
      const items = [];
      if (!is("]")) {
        do {
          const a = expr();
          if (is("range")) {
            next();
            items.push({ k: "range", a, b: expr() });
          } else items.push(a);
        } while (is(",") && next());
      }
      expect("]");
      return { k: "list", items };
    }
    if (tok.t === "{") {
      next();
      inPiece++;
      const cases = [];
      let other = null;
      do {
        const c = statement();
        if (is("op", ":")) {
          next();
          cases.push([c, expr()]);
        } else if (c.k === "cmp") cases.push([c, N(1)]);
        else other = c;
      } while (is(",") && next());
      inPiece--;
      expect("}");
      return { k: "pw", cases, other };
    }
    if (tok.t === "|") {
      next();
      absDepth++;
      const a = expr();
      absDepth--;
      expect("|");
      return { k: "call", f: "abs", args: [a] };
    }
    if (tok.t === "sqrt") {
      next();
      const a = is("(") ? primary() : postfix();
      if (tok.v === "root4") return { k: "call", f: "root", args: [a, N(4)] };
      return { k: "call", f: tok.v, args: [a] };
    }
    if (tok.t === "deriv") {
      next();
      const a = is("(") ? primary() : bareArg();
      return { k: "der", v: tok.v, a };
    }
    if (tok.t === "int") {
      next();
      let lo = null;
      let hi = null;
      if (is("op", "_")) {
        next();
        lo = is("(") || is("{") ? bracketed() : postfix();
        expect("op", "^");
        hi = is("(") || is("{") ? bracketed() : postfix();
      }
      stopD++;
      const a = expr();
      stopD--;
      if (!atD() && !is("id", "d")) throw new MathError("intD");
      next();
      const v = next().v;
      return lo ? { k: "int", a, v, lo, hi } : { k: "int", a, v };
    }
    if (tok.t === "id") {
      next();
      const name = tok.v;
      if ((name === "sum" || name === "prod") && is("(")) {
        // sum(izraz; n; a; b) – zapis kot na kalkulatorju
        const args = parenArgs();
        if (args.length !== 4 || args[1].k !== "var") throw new MathError("sum");
        return { k: "sum", f: name, v: args[1].name, lo: args[2], hi: args[3], a: args[0] };
      }
      if (name === "rand") {
        if (is("(")) parenArgs();
        return { k: "call", f: "rand", args: [] };
      }
      if (name === "sum" || name === "prod") {
        // ∑_(n=1)^(10) izraz
        if (!is("op", "_")) throw new MathError("sum");
        next();
        const close = is("(") ? ")" : is("{") ? "}" : null;
        if (close) next();
        const v = expect("id").v;
        expect("cmp", "=");
        const lo = expr();
        if (close) expect(close);
        expect("op", "^");
        const hi = is("(") || is("{") ? bracketed() : postfix();
        // telo vsote sega do naslednjega + ali − (kot pri Desmosu)
        const a = mul();
        return { k: "sum", f: name, v, lo, hi, a };
      }
      if (name in CONSTS && name !== "e") return { k: "const", name };
      if (name === "e") {
        return { k: "const", name: "e" };
      }
      if (BUILTINS.has(name)) {
        let f = name;
        let base = null;
        let pw = null;
        if (f === "log" && is("op", "_")) {
          next();
          base = is("(") || is("{") ? bracketed() : primary();
          // symbols.js: log_(2)() – prazen oklepaj za argument
        }
        if (is("op", "^")) {
          next();
          const e = unary();
          if (e.k === "neg" && e.a.k === "num" && e.a.v === 1 && INVERSE[f]) f = INVERSE[f];
          else if (e.k === "grp" && e.a.k === "neg" && e.a.a.k === "num" && e.a.a.v === 1 && INVERSE[f]) f = INVERSE[f];
          else pw = e;
        }
        let args;
        if (is("(")) {
          args = parenArgs();
          if (!args.length) throw new MathError("emptyArgs", { f });
        } else if (startsFactor(peek()) || is("op", "-")) args = [bareArg()];
        else throw new MathError("needArg", { f });
        let node = base ? { k: "call", f: "logb", args: [args[0], base] } : { k: "call", f, args };
        if (pw) node = B("^", node, pw);
        return node;
      }
      // uporabniška funkcija: f(x), f'(x), g''(2)
      if (funcs.has(name)) {
        let d = 0;
        while (is("prime")) next(), d++;
        if (is("(")) return { k: "ufn", f: name, d, args: parenArgs() };
        if (d) throw new MathError("needArg", { f: name });
      }
      const sub = subscript();
      return V(sub ? `${name}_${sub}` : name);
    }
    throw new MathError("unexpected", { got: tok.v, pos: tok.pos });
  }

  function bracketed() {
    const close = is("(") ? ")" : "}";
    next();
    const a = statement();
    expect(close);
    return a;
  }

  if (!toks.length) return null;
  const ast = statement();
  if (i < toks.length) throw new MathError("unexpected", { got: peek().v, pos: peek().pos });
  return ast;
}

// ---------- prosti simboli ----------

export function freeVars(node, bound = new Set(), out = new Set(), calls = new Set()) {
  if (!node) return out;
  switch (node.k) {
    case "var":
      if (!bound.has(node.name)) out.add(node.name);
      break;
    case "ufn":
      calls.add(node.f);
      node.args.forEach((a) => freeVars(a, bound, out, calls));
      break;
    case "sum":
    case "int": {
      if (node.lo) freeVars(node.lo, bound, out, calls);
      if (node.hi) freeVars(node.hi, bound, out, calls);
      const b2 = new Set(bound);
      b2.add(node.v);
      freeVars(node.a, b2, out, calls);
      // nedoločeni integral je funkcija spremenljivke
      if (node.k === "int" && !node.lo && !bound.has(node.v)) out.add(node.v);
      break;
    }
    case "der":
      freeVars(node.a, bound, out, calls);
      if (!bound.has(node.v)) out.add(node.v);
      break;
    default:
      for (const kid of children(node)) freeVars(kid, bound, out, calls);
  }
  return out;
}

function children(n) {
  switch (n.k) {
    case "num":
    case "var":
    case "const":
      return [];
    case "call":
    case "ufn":
      return n.args;
    case "cmp":
      return n.terms;
    case "tuple":
    case "list":
      return n.items;
    case "pw":
      return [...n.cases.flat(), ...(n.other ? [n.other] : [])];
    case "range":
      return [n.a, n.b];
    case "sum":
    case "int":
      return [n.a, n.lo, n.hi].filter(Boolean);
    default:
      return [n.a, n.b].filter(Boolean);
  }
}
export const walk = (n, fn) => {
  if (!n) return;
  fn(n);
  children(n).forEach((c) => walk(c, fn));
};

// ---------- računanje ----------

// dvojiška operacija z razširitvijo na sezname: [1,2,3] + 1 = [2,3,4]
const lift2 = (f) => (a, b) => {
  const la = Array.isArray(a);
  const lb = Array.isArray(b);
  if (!la && !lb) return f(a, b);
  if (la && lb) {
    const n = Math.min(a.length, b.length);
    const r = new Array(n);
    for (let i = 0; i < n; i++) r[i] = f(a[i], b[i]);
    return r;
  }
  return la ? a.map((v) => f(v, b)) : b.map((v) => f(a, v));
};
const lift1 = (f) => (a) => (Array.isArray(a) ? a.map(f) : f(a));
const truth = (v) => v === true || (typeof v === "number" && v !== 0 && !Number.isNaN(v));
const CMP = { "<": (a, b) => a < b, ">": (a, b) => a > b, "<=": (a, b) => a <= b, ">=": (a, b) => a >= b, "=": (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)), "!=": (a, b) => !(Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b))) };
const ADD = lift2((a, b) => a + b);
const SUB = lift2((a, b) => a - b);
const MUL = lift2((a, b) => a * b);
const DIV = lift2((a, b) => a / b);
const POW = lift2(pow);
const NEG = lift1((a) => -a);

let depthGuard = 0;

/**
 * Prevede drevo v funkcijo (scope) => vrednost (število ali seznam števil).
 * ctx: { deg: bool, grad: bool (gradi, 400 v krogu; ima prednost pred deg), funcs: { ime: { params, body } }, global }
 */
export function compile(node, ctx = {}) {
  const deg = !!ctx.deg;
  const u = ctx.grad ? GRA : deg ? DEG : 1; // enota kota v radianih
  const c = (n) => compile(n, ctx);
  switch (node.k) {
    case "num": {
      const v = node.v;
      return () => v;
    }
    case "const": {
      const v = CONSTS[node.name];
      return () => v;
    }
    case "var": {
      const name = node.name;
      return (s) => {
        const v = s[name];
        return v === undefined ? NaN : v;
      };
    }
    case "grp":
      return c(node.a);
    case "neg": {
      const a = c(node.a);
      return (s) => NEG(a(s));
    }
    case "+":
    case "-":
    case "*":
    case "/":
    case "^": {
      const a = c(node.a);
      const b = c(node.b);
      const f = { "+": ADD, "-": SUB, "*": MUL, "/": DIV, "^": POW }[node.k];
      // hitra pot za števila
      const raw = { "+": (x, y) => x + y, "-": (x, y) => x - y, "*": (x, y) => x * y, "/": (x, y) => x / y, "^": pow }[node.k];
      return (s) => {
        const x = a(s);
        const y = b(s);
        return typeof x === "number" && typeof y === "number" ? raw(x, y) : f(x, y);
      };
    }
    case "fact": {
      const a = c(node.a);
      return (s) => lift1(fact)(a(s));
    }
    case "deg": {
      const a = c(node.a);
      return (s) => lift1((v) => (v * DEG) / u)(a(s));
    }
    case "pct": {
      const a = c(node.a);
      return (s) => lift1((v) => v / 100)(a(s));
    }
    case "call": {
      const args = node.args.map(c);
      const f = node.f;
      if (f === "rand") return () => Math.random();
      if (f === "Pol" || f === "Rec") {
        // Pol(x; y) → [r, θ], Rec(r; θ) → [x, y]; kot v enoti kota (Casio Pol/Rec)
        if (args.length !== 2) throw new MathError("arity", { f, n: 2 });
        const k = u;
        return (s) => {
          const [p, q] = args.map((a) => a(s));
          return f === "Pol" ? [Math.hypot(p, q), Math.atan2(q, p) / k] : [p * Math.cos(q * k), p * Math.sin(q * k)];
        };
      }
      if (TRIG[f]) {
        const g = TRIG[f];
        const a = args[0];
        return (s) => lift1((v) => g(v, u))(a(s));
      }
      if (UNARY[f]) {
        const g = UNARY[f];
        const a = args[0];
        if (args.length !== 1) throw new MathError("arity", { f, n: 1 });
        return (s) => lift1(g)(a(s));
      }
      if (LISTF[f]) {
        const g = LISTF[f];
        return (s) => {
          const vals = args.map((a) => a(s));
          const l = vals.length === 1 && Array.isArray(vals[0]) ? vals[0] : vals.flat();
          return g(l.filter((v) => !Number.isNaN(v)));
        };
      }
      if (f === "sort") return (s) => sorted([args.map((a) => a(s))].flat(2));
      if (MULTI[f]) {
        const g = MULTI[f];
        const many = f === "min" || f === "max" || f === "gcd" || f === "lcm";
        return (s) => {
          const vals = args.map((a) => a(s));
          if (many && vals.length === 1 && Array.isArray(vals[0])) return vals[0].length ? g(...vals[0]) : NaN;
          if (vals.some(Array.isArray)) {
            const n = Math.min(...vals.filter(Array.isArray).map((l) => l.length));
            return Array.from({ length: n }, (_, i) => g(...vals.map((v) => (Array.isArray(v) ? v[i] : v))));
          }
          return g(...vals);
        };
      }
      throw new MathError("unknownFn", { f });
    }
    case "ufn": {
      const args = node.args.map(c);
      const name = node.f;
      const d = node.d;
      return (s) => {
        const def = ctx.funcs?.[name];
        if (!def) return NaN;
        if (d) {
          const fn = def.derivs?.[d] || (def.derivs ||= {})[d] || null;
          if (!fn) {
            // odvod pripravimo enkrat
            let body = def.ast;
            for (let k = 0; k < d; k++) body = simplify(diff(body, def.params[0], ctx));
            def.derivs[d] = { body: compile(body, ctx), ast: body };
          }
        }
        const body = d ? def.derivs[d].body : def.body;
        if (depthGuard > 64) return NaN;
        const sc = Object.create(ctx.global || null);
        def.params.forEach((p, i) => (sc[p] = args[i] ? args[i](s) : NaN));
        depthGuard++;
        try {
          return body(sc);
        } finally {
          depthGuard--;
        }
      };
    }
    case "cmp": {
      const terms = node.terms.map(c);
      const ops = node.ops.map((o) => CMP[o]);
      return (s) => {
        let a = terms[0](s);
        for (let i = 0; i < ops.length; i++) {
          const b = terms[i + 1](s);
          if (Array.isArray(a) || Array.isArray(b)) return NaN;
          if (!ops[i](a, b)) return false;
          a = b;
        }
        return true;
      };
    }
    case "pw": {
      const cases = node.cases.map(([cond, v]) => [c(cond), c(v)]);
      const other = node.other ? c(node.other) : null;
      return (s) => {
        for (const [cond, v] of cases) if (truth(cond(s))) return v(s);
        return other ? other(s) : NaN;
      };
    }
    case "list": {
      const items = node.items.map((it) => (it.k === "range" ? { r: [c(it.a), c(it.b)] } : { v: c(it) }));
      return (s) => {
        const out = [];
        for (const it of items) {
          if (it.r) {
            const a = it.r[0](s);
            const b = it.r[1](s);
            if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
            const step = b >= a ? 1 : -1;
            const n = Math.min(10000, Math.floor(Math.abs(b - a)) + 1);
            for (let k = 0; k < n; k++) out.push(a + k * step);
          } else {
            const v = it.v(s);
            if (Array.isArray(v)) out.push(...v);
            else out.push(v);
          }
        }
        return out;
      };
    }
    case "tuple":
      throw new MathError("tupleHere");
    case "range":
      throw new MathError("rangeHere");
    case "der": {
      // simbolni odvod, če gre, sicer številski
      let d;
      try {
        d = simplify(diff(node.a, node.v, ctx));
      } catch {
        d = { k: "nder", a: node.a, v: node.v };
      }
      return c(d);
    }
    case "nder": {
      const a = c(node.a);
      const v = node.v;
      return (s) => {
        const x = s[v];
        const h = 1e-5 * Math.max(1, Math.abs(x));
        const sc = Object.create(s);
        sc[v] = x + h;
        const f1 = a(sc);
        sc[v] = x - h;
        const f0 = a(sc);
        return (f1 - f0) / (2 * h);
      };
    }
    case "int": {
      const a = c(node.a);
      const v = node.v;
      const lo = node.lo ? c(node.lo) : () => 0;
      const hi = node.hi ? c(node.hi) : (s) => s[v];
      return (s) => {
        const sc = Object.create(s);
        return integrate((t) => ((sc[v] = t), a(sc)), lo(s), hi(s));
      };
    }
    case "sum": {
      const a = c(node.a);
      const v = node.v;
      const lo = c(node.lo);
      const hi = c(node.hi);
      const isProd = node.f === "prod";
      return (s) => {
        const from = Math.ceil(lo(s));
        let to = Math.floor(hi(s));
        if (!Number.isFinite(from)) return NaN;
        if (to === Infinity) to = from + 99999; // približek za neskončno vrsto
        if (!Number.isFinite(to)) return NaN;
        if (to - from >= 100000) throw new MathError("sumLimit"); // največ 100 000 členov
        const sc = Object.create(s);
        let acc = isProd ? 1 : 0;
        for (let k = from; k <= to; k++) {
          sc[v] = k;
          const t = a(sc);
          acc = isProd ? acc * t : acc + t;
        }
        return acc;
      };
    }
    default:
      throw new MathError("unknown", { k: node.k });
  }
}

// ---------- integral (prilagodljivo Simpsonovo pravilo) ----------

export function integrate(f, a, b, eps = 1e-9) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;
  if (a === b) return 0;
  if (a > b) return -integrate(f, b, a, eps);
  // razdelimo na 64 kosov (robustno pri nezveznostih), vsak prilagodljivo
  const n = 64;
  const h = (b - a) / n;
  let total = 0;
  const simpson = (fa, fm, fb, w) => (w / 6) * (fa + 4 * fm + fb);
  const rec = (x0, x1, f0, fm, f1, whole, e, depth) => {
    const m = (x0 + x1) / 2;
    const lm = (x0 + m) / 2;
    const rm = (m + x1) / 2;
    const flm = f(lm);
    const frm = f(rm);
    const left = simpson(f0, flm, fm, m - x0);
    const right = simpson(fm, frm, f1, x1 - m);
    const delta = left + right - whole;
    if (depth <= 0 || Math.abs(delta) <= 15 * e || !Number.isFinite(delta)) return left + right + delta / 15;
    return rec(x0, m, f0, flm, fm, left, e / 2, depth - 1) + rec(m, x1, fm, frm, f1, right, e / 2, depth - 1);
  };
  for (let k = 0; k < n; k++) {
    let x0 = a + k * h;
    let x1 = x0 + h;
    let f0 = f(x0);
    let f1 = f(x1);
    // na robu definicijskega območja (npr. √x pri 0) se malo umaknemo
    if (!Number.isFinite(f0)) f0 = f((x0 = x0 + h * 1e-9));
    if (!Number.isFinite(f1)) f1 = f((x1 = x1 - h * 1e-9));
    const fm = f((x0 + x1) / 2);
    total += rec(x0, x1, f0, fm, f1, simpson(f0, fm, f1, x1 - x0), eps / n, 18);
  }
  return total;
}

// ---------- simbolni odvod ----------

const isNum = (n, v) => n.k === "num" && (v === undefined || n.v === v);
const unwrap = (n) => (n.k === "grp" ? unwrap(n.a) : n);
const call = (f, ...args) => ({ k: "call", f, args });
const add = (a, b) => B("+", a, b);
const sub = (a, b) => B("-", a, b);
const mulN = (a, b) => B("*", a, b);
const div = (a, b) => B("/", a, b);
const powN = (a, b) => B("^", a, b);
const neg = (a) => ({ k: "neg", a });

function depends(n, v) {
  return freeVars(n).has(v) || containsUfn(n);
}
function containsUfn(n) {
  let yes = false;
  walk(n, (x) => {
    if (x.k === "ufn") yes = true;
  });
  return yes;
}

// zamenja spremenljivke v drevesu (za odvajanje uporabniških funkcij)
export function substitute(n, map) {
  if (!n) return n;
  if (n.k === "var" && map[n.name]) return { k: "grp", a: map[n.name] };
  if (n.k === "sum" || n.k === "int") {
    const m2 = { ...map };
    delete m2[n.v];
    return { ...n, a: substitute(n.a, m2), lo: n.lo && substitute(n.lo, map), hi: n.hi && substitute(n.hi, map) };
  }
  const out = { ...n };
  if (n.a) out.a = substitute(n.a, map);
  if (n.b) out.b = substitute(n.b, map);
  if (n.args) out.args = n.args.map((x) => substitute(x, map));
  if (n.terms) out.terms = n.terms.map((x) => substitute(x, map));
  if (n.items) out.items = n.items.map((x) => substitute(x, map));
  if (n.cases) out.cases = n.cases.map(([c, v]) => [substitute(c, map), substitute(v, map)]);
  if (n.other) out.other = substitute(n.other, map);
  return out;
}

export function inlineUfn(n, ctx, depth = 0) {
  if (!n || depth > 20) return n;
  if (n.k === "ufn") {
    const def = ctx.funcs?.[n.f];
    if (!def) throw new MathError("unknownFn", { f: n.f });
    let body = def.ast;
    for (let k = 0; k < n.d; k++) body = simplify(diff(body, def.params[0], ctx));
    const map = {};
    def.params.forEach((p, i) => (map[p] = inlineUfn(n.args[i], ctx, depth)));
    return inlineUfn(substitute(body, map), ctx, depth + 1);
  }
  const out = { ...n };
  if (n.a) out.a = inlineUfn(n.a, ctx, depth);
  if (n.b) out.b = inlineUfn(n.b, ctx, depth);
  if (n.args) out.args = n.args.map((x) => inlineUfn(x, ctx, depth));
  if (n.terms) out.terms = n.terms.map((x) => inlineUfn(x, ctx, depth));
  if (n.items) out.items = n.items.map((x) => inlineUfn(x, ctx, depth));
  if (n.cases) out.cases = n.cases.map(([c, v]) => [inlineUfn(c, ctx, depth), inlineUfn(v, ctx, depth)]);
  if (n.other) out.other = inlineUfn(n.other, ctx, depth);
  return out;
}

export function diff(node, v, ctx = {}) {
  const n = unwrap(node);
  const d = (x) => diff(x, v, ctx);
  const degF = ctx.grad ? N(GRA) : ctx.deg ? N(DEG) : null; // v stopinjah: (sin x)' = π/180 · cos x (v gradih π/200)
  const chain = (outer, inner) => (isNum(simplify(d(inner)), 1) ? outer : mulN(outer, d(inner)));
  switch (n.k) {
    case "num":
    case "const":
      return N(0);
    case "var":
      return N(n.name === v ? 1 : 0);
    case "neg":
      return neg(d(n.a));
    case "+":
      return add(d(n.a), d(n.b));
    case "-":
      return sub(d(n.a), d(n.b));
    case "*": {
      if (!depends(n.a, v)) return mulN(n.a, d(n.b));
      if (!depends(n.b, v)) return mulN(d(n.a), n.b);
      return add(mulN(d(n.a), n.b), mulN(n.a, d(n.b)));
    }
    case "/": {
      if (!depends(n.b, v)) return div(d(n.a), n.b);
      if (!depends(n.a, v)) return neg(div(mulN(n.a, d(n.b)), powN(n.b, N(2))));
      return div(sub(mulN(d(n.a), n.b), mulN(n.a, d(n.b))), powN(n.b, N(2)));
    }
    case "^": {
      const a = n.a;
      const b = n.b;
      if (!depends(b, v)) {
        // (u^c)' = c u^(c-1) u'
        const e = simplify(sub(b, N(1)));
        return chain(mulN(b, powN(a, e)), a);
      }
      if (!depends(a, v)) {
        // (c^u)' = c^u ln c u'
        const lnA = unwrap(a).k === "const" && unwrap(a).name === "e" ? null : call("ln", a);
        const base = lnA ? mulN(powN(a, b), lnA) : powN(a, b);
        return chain(base, b);
      }
      // u^w = e^(w ln u)
      return mulN(powN(a, b), d(mulN(b, call("ln", a))));
    }
    case "call": {
      const [u] = n.args;
      const k = (expr) => (degF ? mulN(degF, expr) : expr);
      const ik = (expr) => (degF ? div(expr, degF) : expr);
      switch (n.f) {
        case "sin":
          return chain(k(call("cos", u)), u);
        case "cos":
          return chain(neg(k(call("sin", u))), u);
        case "tan":
          return chain(k(div(N(1), powN(call("cos", u), N(2)))), u);
        case "cot":
          return chain(neg(k(div(N(1), powN(call("sin", u), N(2))))), u);
        case "sec":
          return chain(k(mulN(call("sec", u), call("tan", u))), u);
        case "csc":
          return chain(neg(k(mulN(call("csc", u), call("cot", u)))), u);
        case "arcsin":
          return chain(ik(div(N(1), call("sqrt", sub(N(1), powN(u, N(2)))))), u);
        case "arccos":
          return chain(ik(neg(div(N(1), call("sqrt", sub(N(1), powN(u, N(2))))))), u);
        case "arctan":
          return chain(ik(div(N(1), add(N(1), powN(u, N(2))))), u);
        case "arccot":
          return chain(ik(neg(div(N(1), add(N(1), powN(u, N(2)))))), u);
        case "sinh":
          return chain(call("cosh", u), u);
        case "cosh":
          return chain(call("sinh", u), u);
        case "tanh":
          return chain(div(N(1), powN(call("cosh", u), N(2))), u);
        case "ln":
          return chain(div(N(1), u), u);
        case "log":
          return chain(div(N(1), mulN(u, call("ln", N(10)))), u);
        case "logb":
          return chain(div(N(1), mulN(u, call("ln", n.args[1]))), u);
        case "exp":
          return chain(call("exp", u), u);
        case "sqrt":
          return chain(div(N(1), mulN(N(2), call("sqrt", u))), u);
        case "cbrt":
          return chain(div(N(1), mulN(N(3), powN(call("cbrt", u), N(2)))), u);
        case "abs":
          return chain(call("sign", u), u);
        case "sign":
        case "floor":
        case "ceil":
        case "round":
          return N(0);
        default:
          throw new MathError("noDiff", { f: n.f });
      }
    }
    case "ufn":
      return d(inlineUfn(n, ctx));
    case "pw":
      return { k: "pw", cases: n.cases.map(([c, x]) => [c, d(x)]), other: n.other ? d(n.other) : null };
    case "der":
      return d(simplify(diff(n.a, n.v, ctx)));
    case "int":
      if (!n.lo && n.v === v) return n.a; // osnovni izrek analize
      throw new MathError("noDiff", { f: "∫" });
    default:
      throw new MathError("noDiff", { f: n.k });
  }
}

// ---------- poenostavljanje ----------

export function simplify(node) {
  const n = node.k === "grp" ? node.a : node;
  const S = simplify;
  switch (n.k) {
    case "neg": {
      const a = S(n.a);
      if (isNum(a)) return N(-a.v);
      if (a.k === "neg") return a.a;
      return neg(a);
    }
    case "+": {
      const a = S(n.a);
      const b = S(n.b);
      if (isNum(a) && isNum(b)) return N(a.v + b.v);
      if (isNum(a, 0)) return b;
      if (isNum(b, 0)) return a;
      if (b.k === "neg") return S(sub(a, b.a));
      if (isNum(b) && b.v < 0) return sub(a, N(-b.v));
      return add(a, b);
    }
    case "-": {
      const a = S(n.a);
      const b = S(n.b);
      if (isNum(a) && isNum(b)) return N(a.v - b.v);
      if (isNum(b, 0)) return a;
      if (isNum(a, 0)) return S(neg(b));
      if (b.k === "neg") return add(a, b.a);
      if (same(a, b)) return N(0);
      return sub(a, b);
    }
    case "*": {
      let a = S(n.a);
      let b = S(n.b);
      if (isNum(a) && isNum(b)) return N(a.v * b.v);
      if (isNum(a, 0) || isNum(b, 0)) return N(0);
      if (isNum(a, 1)) return b;
      if (isNum(b, 1)) return a;
      if (isNum(a, -1)) return S(neg(b));
      if (isNum(b, -1)) return S(neg(a));
      if (a.k === "neg") return S(neg(mulN(a.a, b)));
      if (b.k === "neg") return S(neg(mulN(a, b.a)));
      // število naprej: x·3 → 3x, e^x·(2x) → 2x·e^x
      if (isNum(b) && !isNum(a)) [a, b] = [b, a];
      if (b.k === "*" && isNum(b.a) && !isNum(a)) return S(mulN(b.a, a.k === "var" || a.k === "const" ? mulN(a, b.b) : mulN(b.b, a)));
      if (isNum(a) && b.k === "/") return S(div(mulN(a, b.a), b.b));
      // 2·(3·x) → 6x
      if (isNum(a) && b.k === "*" && isNum(b.a)) return S(mulN(N(a.v * b.a.v), b.b));
      if (same(a, b)) return powN(a, N(2));
      // x·x^n → x^(n+1)
      if (b.k === "^" && same(a, b.a) && isNum(b.b)) return powN(a, N(b.b.v + 1));
      // 1/u · w → w/u
      if (a.k === "/" && isNum(a.a, 1)) return S(div(b, a.b));
      if (b.k === "/" && isNum(b.a, 1)) return S(div(a, b.b));
      return mulN(a, b);
    }
    case "/": {
      const a = S(n.a);
      const b = S(n.b);
      if (isNum(a, 0)) return N(0);
      if (isNum(b, 1)) return a;
      if (isNum(a) && isNum(b) && Number.isInteger(a.v) && Number.isInteger(b.v) && b.v !== 0) {
        const g = gcd2(a.v, b.v) * Math.sign(b.v);
        if (g && b.v / g === 1) return N(a.v / g);
        if (g && g !== 1) return div(N(a.v / g), N(b.v / g));
      }
      if (same(a, b)) return N(1);
      if (a.k === "neg") return S(neg(div(a.a, b)));
      // (2x)/(2√u) → x/√u
      const lead = (t) => (isNum(t) ? t.v : t.k === "*" && isNum(t.a) ? t.a.v : null);
      const la = lead(a);
      const lb = lead(b);
      if (la !== null && lb !== null && Number.isInteger(la) && Number.isInteger(lb) && !(isNum(a) && isNum(b))) {
        const g = gcd2(la, lb);
        if (g > 1) {
          const scale = (t, k) => (isNum(t) ? N(t.v / k) : mulN(N(t.a.v / k), t.b));
          return S(div(scale(a, g), scale(b, g)));
        }
      }
      return div(a, b);
    }
    case "^": {
      const a = S(n.a);
      const b = S(n.b);
      if (isNum(b, 0)) return N(1);
      if (isNum(b, 1)) return a;
      if (isNum(a) && isNum(b) && Number.isInteger(b.v) && Math.abs(b.v) < 10 && Number.isInteger(a.v)) return b.v >= 0 ? N(a.v ** b.v) : div(N(1), N(a.v ** -b.v));
      if (a.k === "^" && isNum(a.b) && isNum(b)) return powN(a.a, N(a.b.v * b.v));
      return powN(a, b);
    }
    case "call":
      return { ...n, args: n.args.map(S) };
    case "pw":
      return { ...n, cases: n.cases.map(([c, v]) => [c, S(v)]), other: n.other ? S(n.other) : null };
    default:
      return n;
  }
}

function same(a, b) {
  return JSON.stringify(unwrapDeep(a)) === JSON.stringify(unwrapDeep(b));
}
function unwrapDeep(n) {
  if (!n || typeof n !== "object") return n;
  if (Array.isArray(n)) return n.map(unwrapDeep);
  if (n.k === "grp") return unwrapDeep(n.a);
  const out = {};
  for (const [k, v] of Object.entries(n)) if (k !== "imp") out[k] = unwrapDeep(v);
  return out;
}

// ---------- zapis v TeX ----------

const PREC = { cmp: 0, "+": 1, "-": 1, "*": 2, "/": 2, neg: 1.8, "^": 4, fact: 5, deg: 5, pct: 5 };
const prec = (n) => PREC[unwrap(n).k] ?? 9;
const TEXF = { sin: "\\sin", cos: "\\cos", tan: "\\tan", cot: "\\cot", sec: "\\sec", csc: "\\csc", arcsin: "\\arcsin", arccos: "\\arccos", arctan: "\\arctan", arccot: "\\operatorname{arccot}", sinh: "\\sinh", cosh: "\\cosh", tanh: "\\tanh", ln: "\\ln", log: "\\log", exp: "\\exp", min: "\\min", max: "\\max", gcd: "\\gcd", sign: "\\operatorname{sign}", sgn: "\\operatorname{sgn}" };
const TEXVAR = { "θ": "\\theta", "α": "\\alpha", "β": "\\beta", "γ": "\\gamma", "δ": "\\delta", "λ": "\\lambda", "μ": "\\mu", "φ": "\\varphi", "ω": "\\omega", "σ": "\\sigma", "ρ": "\\rho", "ε": "\\varepsilon", "τ": "\\tau" };
const CMPTEX = { "<": "<", ">": ">", "<=": "\\le", ">=": "\\ge", "=": "=", "!=": "\\ne" };

export function numTex(v, comma = true) {
  if (!Number.isFinite(v)) return v > 0 ? "\\infty" : v < 0 ? "-\\infty" : "\\text{?}";
  let s = Math.abs(v) >= 1e15 || (Math.abs(v) < 1e-6 && v !== 0) ? v.toExponential(4).replace(/\.?0+e/, "e") : String(Number(v.toPrecision(12)));
  const m = /^(-?[\d.]+)e([+-]\d+)$/.exec(s);
  if (m) s = `${m[1]}\\cdot 10^{${Number(m[2])}}`;
  return comma ? s.replace(".", "{,}") : s;
}

export function toTex(node, opt = {}) {
  const comma = opt.comma !== false;
  const sep = opt.sep || ","; // ločilo argumentov (znanstveni kalkulator: »;«, ker je vejica decimalna)
  const T = (n) => toTex(n, opt);
  const wrap = (n, p) => (prec(n) < p || (p >= 4 && isNegLike(n)) ? `\\left(${T(n)}\\right)` : T(n));
  if (!node) return "";
  const n = node;
  switch (n.k) {
    case "num":
      return numTex(n.v, comma);
    case "const":
      return { pi: "\\pi", "π": "\\pi", tau: "\\tau", "τ": "\\tau", e: "e", inf: "\\infty" }[n.name];
    case "var": {
      const [base, sub] = n.name.split("_");
      const b = TEXVAR[base] || base;
      return sub ? `${b}_{${sub}}` : b;
    }
    case "grp":
      return T(n.a);
    case "neg":
      return unwrap(n.a).k === "/" ? `-${T(n.a)}` : `-${wrap(n.a, 2.5)}`;
    case "+":
      return `${T(n.a)}+${wrap(n.b, 1.9)}`;
    case "-":
      return `${T(n.a)}-${wrap(n.b, 1.5)}`;
    case "*": {
      const a = wrap(n.a, 2);
      const ua = unwrap(n.a);
      const b = wrap(n.b, unwrap(n.b).k === "*" ? 2 : 2.5);
      const ub = unwrap(n.b);
      const numNext = ub.k === "num" || (ub.k === "^" && unwrap(ub.a).k === "num") || ub.k === "neg" || (ub.k === "*" && unwrap(ub.a).k === "num");
      const piece = ub.k === "pw" && ub.cases.every(([, v]) => isNum(v, 1)) && !ub.other;
      if (piece) return `${a}\\left\\{${ub.cases.map(([c]) => T(c)).join(",\\ ")}\\right\\}`;
      const dot = numNext || (ua.k === "num" && ub.k === "num") || ub.k === "/";
      return dot ? `${a}\\cdot ${b}` : `${a}${/^[a-zA-Z0-9]/.test(b) && /[a-zA-Z]$/.test(a) ? " " : ""}${b}`;
    }
    case "/":
      return `\\frac{${T(n.a)}}{${T(n.b)}}`;
    case "^": {
      const ua = unwrap(n.a);
      if (ua.k === "call" && TEXF[ua.f] && ua.args.length === 1) return `${TEXF[ua.f]}^{${T(n.b)}}\\left(${T(ua.args[0])}\\right)`;
      const base = ua.k === "call" || ua.k === "ufn" || ua.k === "fact" ? `\\left(${T(n.a)}\\right)` : wrap(n.a, 5);
      return `${base}^{${T(n.b)}}`;
    }
    case "fact":
      return `${wrap(n.a, 6)}!`;
    case "deg":
      return `${wrap(n.a, 6)}^{\\circ}`;
    case "pct":
      return `${wrap(n.a, 6)}\\%`;
    case "call": {
      const a = n.args.map(T);
      switch (n.f) {
        case "sqrt":
          return `\\sqrt{${a[0]}}`;
        case "cbrt":
          return `\\sqrt[3]{${a[0]}}`;
        case "root":
          return `\\sqrt[${a[1]}]{${a[0]}}`;
        case "abs":
          return `\\left|${a[0]}\\right|`;
        case "floor":
          return `\\left\\lfloor ${a[0]}\\right\\rfloor`;
        case "ceil":
          return `\\left\\lceil ${a[0]}\\right\\rceil`;
        case "logb":
          return `\\log_{${a[1]}}\\left(${a[0]}\\right)`;
        case "exp":
          return `e^{${a[0]}}`;
        case "rand":
          return "\\mathrm{Ran\\#}";
        case "randint":
          return `\\mathrm{RanInt}\\left(${a.join(sep)}\\right)`;
        case "nCr":
          return `\\binom{${a[0]}}{${a[1]}}`;
        default: {
          const f = TEXF[n.f] || `\\operatorname{${n.f}}`;
          return `${f}\\left(${a.join(sep)}\\right)`;
        }
      }
    }
    case "ufn":
      return `${n.f}${"'".repeat(n.d)}\\left(${n.args.map(T).join(sep)}\\right)`;
    case "cmp":
      return n.terms.map((t, i) => (i ? `${CMPTEX[n.ops[i - 1]]} ` : "") + T(t)).join(" ");
    case "tuple":
      return `\\left(${n.items.map(T).join(",\\ ")}\\right)`;
    case "list":
      return `\\left[${n.items.map(T).join(",\\ ")}\\right]`;
    case "range":
      return `${T(n.a)},\\ldots,${T(n.b)}`;
    case "pw": {
      if (n.cases.every(([, v]) => isNum(v, 1)) && !n.other) return `\\left\\{${n.cases.map(([c]) => T(c)).join(",\\ ")}\\right\\}`;
      const rows = n.cases.map(([c, v]) => `${T(v)} & ${T(c)}`);
      if (n.other) rows.push(`${T(n.other)} & \\text{sicer}`);
      return `\\begin{cases}${rows.join("\\\\")}\\end{cases}`;
    }
    case "der":
      return `\\frac{d}{d${TEXVAR[n.v] || n.v}}\\left(${T(n.a)}\\right)`;
    case "nder":
      return `\\frac{d}{d${n.v}}\\left(${T(n.a)}\\right)`;
    case "int":
      return `\\int${n.lo ? `_{${T(n.lo)}}^{${T(n.hi)}}` : ""}${T(n.a)}\\,d${TEXVAR[n.v] || n.v}`;
    case "sum":
      return `${n.f === "prod" ? "\\prod" : "\\sum"}_{${n.v}=${T(n.lo)}}^{${T(n.hi)}}${wrap(n.a, 2)}`;
    default:
      return "";
  }
}
function isNegLike(n) {
  const u = unwrap(n);
  return u.k === "neg" || (u.k === "num" && u.v < 0);
}

// ---------- iz TeX (naloge, inštruktor) v naš zapis ----------

/** Pretvori preprost LaTeX (\frac, \sqrt, ^{}, \sin …) v besedilo, ki ga razume parse(). */
export function fromTex(tex) {
  let s = String(tex);
  // \frac{a}{b} → ((a)/(b)) – ponavljamo za gnezdene
  const group = (str, at) => {
    // vrne [vsebina, konec] za {…} na mestu at
    if (str[at] !== "{") return [str[at], at + 1];
    let d = 0;
    for (let j = at; j < str.length; j++) {
      if (str[j] === "{") d++;
      else if (str[j] === "}" && --d === 0) return [str.slice(at + 1, j), j + 1];
    }
    return [str.slice(at + 1), str.length];
  };
  for (let guard = 0; guard < 50; guard++) {
    const m = /\\[dt]?frac/.exec(s);
    if (!m) break;
    let p = m.index + m[0].length;
    while (s[p] === " ") p++;
    const [a, e1] = group(s, p);
    let q = e1;
    while (s[q] === " ") q++;
    const [b, e2] = group(s, q);
    s = `${s.slice(0, m.index)}((${a})/(${b}))${s.slice(e2)}`;
  }
  for (let guard = 0; guard < 50; guard++) {
    const m = /\\sqrt(\[([^\]]*)\])?/.exec(s);
    if (!m) break;
    let p = m.index + m[0].length;
    while (s[p] === " ") p++;
    const [a, e] = group(s, p);
    const rep = m[2] ? (m[2].trim() === "3" ? `cbrt(${a})` : `root(${a},${m[2]})`) : `sqrt(${a})`;
    s = s.slice(0, m.index) + rep + s.slice(e);
  }
  s = s
    .replace(/\\operatorname\{(\w+)\}/g, "$1")
    .replace(/\\(mathrm|text|textrm|mathit)\{([^}]*)\}/g, "$2")
    .replace(/\\(left|right|big|Big|bigg|Bigg)\s*/g, "")
    .replace(/\\[,;:! ]/g, " ")
    .replace(/\\(cdot|times)/g, "*")
    .replace(/\\div/g, "/")
    .replace(/\\pi/g, "π")
    .replace(/\\theta/g, "θ")
    .replace(/\\varphi|\\phi/g, "φ")
    .replace(/\\alpha/g, "α")
    .replace(/\\infty/g, "∞")
    .replace(/\\le(q|qslant)?\b/g, "<=")
    .replace(/\\ge(q|qslant)?\b/g, ">=")
    .replace(/\\(sin|cos|tan|cot|ln|log|exp|arcsin|arccos|arctan|sinh|cosh|tanh)\b/g, " $1 ")
    .replace(/\\lvert|\\rvert|\\vert|\\mid/g, "|")
    .replace(/\\\{/g, "{")
    .replace(/\\\}/g, "}")
    .replace(/\{,\}/g, ".")
    .replace(/\^\{([^{}]*)\}/g, "^($1)")
    .replace(/_\{([^{}]*)\}/g, "_($1)")
    .replace(/[{}]/g, (c) => (c === "{" ? "(" : ")"))
    .replace(/\\/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return s;
}

/**
 * Poišče enačbe za risanje v besedilu z LaTeXom ($…$): y = …, f(x) = …, x² + y² = r², …
 * Vrne seznam izrazov v našem zapisu (največ 6).
 */
export function plottableFromText(text) {
  const out = [];
  const seen = new Set();
  const re = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|\$([^$\n]+?)\$/g;
  let m;
  while ((m = re.exec(String(text || ""))) && out.length < 6) {
    const tex = m[1] || m[2] || m[3] || m[4];
    for (const part of tex.split(/\\\\|,\s*\\quad|\\quad|;\s|\\qquad/)) {
      const src = fromTex(part).replace(/\s*\\?[,.]\s*$/, "");
      if (!/=|<|>/.test(src) || !/[xy]/.test(src)) continue;
      if (!/^(\s*[yf-hx]\s*(\(\s*x\s*\))?\s*(=|<|>|<=|>=)|.*\by\b.*=)/.test(src) && !/^[^=]*x[^=]*=.*y|^[^=]*y[^=]*=/.test(src)) continue;
      try {
        const funcs = new Set();
        const def = /^\s*([a-hk-wz])\s*\(\s*x\s*\)\s*=/.exec(src);
        if (def) funcs.add(def[1]);
        const ast = parse(src, { funcs });
        if (!ast || ast.k !== "cmp") continue;
        const fv = freeVars(ast);
        if (!fv.has("x") && !fv.has("y")) continue;
        if ([...fv].some((v) => !["x", "y"].includes(v) && !(def && v === def[1]))) continue;
        const key = src.replace(/\s+/g, "");
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(src);
      } catch {
        /* ni za risanje */
      }
    }
  }
  return out;
}

// ---------- oblikovanje števil ----------

/** Lepo zapisano število (do 10 mest, brez repov 0,30000000004). */
export function niceNumber(v, { digits = 10, comma = true } = {}) {
  if (typeof v === "boolean") return v ? "✓" : "✗";
  if (Array.isArray(v)) return `[${v.slice(0, 20).map((x) => niceNumber(x, { digits, comma })).join(comma ? "; " : ", ")}${v.length > 20 ? " …" : ""}]`;
  if (Number.isNaN(v)) return "nedefinirano";
  if (!Number.isFinite(v)) return v > 0 ? "∞" : "−∞";
  let s;
  const a = Math.abs(v);
  if (a !== 0 && (a >= 1e12 || a < 1e-6)) {
    const [m, e] = v.toExponential(Math.min(digits, 8) - 1).split("e");
    s = `${String(Number(m))} · 10^${Number(e)}`;
  } else s = String(Number(v.toPrecision(digits)));
  if (Object.is(Number(s), -0)) s = "0";
  return (comma ? s.replace(".", ",") : s).replace(/^-/, "−");
}
