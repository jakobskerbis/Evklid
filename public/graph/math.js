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
// n·(n−1)·…·(n−k+1) (deljeno s k!, če binom) v celih številih BigInt: nCr(200;2) = 19900 tudi za n > 170,
// kjer n! ni več končen. Rezultat nad ~1,8·10^308 je ∞; to velja že za k > 170 (nPr ≥ k!) in k > 600 (nCr ≥ C(2k;k)).
const fallProd = (n, k, binom) => {
  if (k > (binom ? 600 : 170)) return Infinity;
  const N = BigInt(n);
  let r = 1n;
  for (let i = 1n; i <= BigInt(k); i++) r = binom ? (r * (N - BigInt(k) + i)) / i : r * (N - i + 1n);
  return Number(r);
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
  nCr: (n, k) => (k < 0 || k > n ? 0 : Number.isInteger(n) && Number.isInteger(k) ? fallProd(n, Math.min(k, n - k), true) : Math.round(fact(n) / (fact(k) * fact(n - k)))),
  nPr: (n, k) => (k < 0 || k > n ? 0 : Number.isInteger(n) && Number.isInteger(k) ? fallProd(n, k, false) : Math.round(fact(n) / fact(n - k))),
  root: (x, n) => nthroot(x, n),
  logb: (x, b) => Math.log(x) / Math.log(b),
  // celo število na [a, b] (Casio RanInt#)
  randint: (a, b) => {
    const lo = Math.ceil(Math.min(a, b));
    const hi = Math.floor(Math.max(a, b));
    return hi < lo ? NaN : lo + Math.floor(Math.random() * (hi - lo + 1));
  },
};
// funkcije iz MULTI z natanko dvema vrednostma (min, max, gcd, lcm jih vzamejo poljubno mnogo)
const ARITY = { mod: 2, nCr: 2, nPr: 2, root: 2, logb: 2, randint: 2 };
const ARG_NAMES = { nCr: "n k", nPr: "n k", root: "x n", logb: "x b", Pol: "x y", Rec: "r θ" };
/** Pravilen zapis za napako »arity« ({ f, n }): »nCr(n; k)«, »sin(x)«; sep je ločilo argumentov. */
export const arityExample = ({ f, n } = {}, sep = ",") => `${f}(${(ARG_NAMES[f] || (n === 1 ? "x" : "a b c d").split(" ").slice(0, n).join(" ")).split(" ").join(`${sep}\u00a0`)})`; // nedeljiv presledek: zgled se na ozkem zaslonu ne prelomi
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

/** Funkcija ene same vrednosti (sin, ln, √ …; tudi sopomenke)? Pri njej vejica med števkami ne more ločiti argumentov. */
export const oneArgFn = (f) => !!(TRIG[f] || UNARY[f] || TRIG[ALIASES[f]] || UNARY[ALIASES[f]]);
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

// »1 000«, »12 345«, »2 000 000« (presledek, tudi nedeljiv, med skupinami po 3 števke) je eno število.
// Brez tega razčlenjevalnik presledek med števkami bere kot množenje (»1 000« = 1 · 0).
// Skupine z drugačnim številom števk (»12 34«) ostanejo, kot so: to ni zapis tisočic.
export const joinThousands = (s) =>
  String(s ?? "").replace(/(?<![\d.,_^])\d{1,3}(?:[   ]\d{3})+(?!\d)/g, (m) => m.replace(/[   ]/g, ""));
// Ostane presledek med dvema števkama (»12 34«, »1 0005«)? Zapis ni jasen.
// Število za _ ali ^ (»log_2 8«, »sin^2 30«, »log_10 100«) je indeks ali potenca: ne lepi se z argumentom in ni nejasno.
export const digitGap = (s) => /(?<![\d_^])\d+[ \t  ]+\d/.test(String(s ?? ""));
// »1.234,5« (pika za tisočice, vejica za decimalke) je nedvoumno 1234,5: piki odstrani.
export const joinDotThousands = (s) => String(s ?? "").replace(/(?<![\d.,])\d{1,3}(?:\.\d{3})+(?=,\d)/g, (m) => m.replace(/\./g, ""));
// Dve piki v istem številu (»1.2.3«, »1.234.567«) brez decimalne vejice: zapis ni jasen.
export const twoDots = (s) => /\d\.\d+\.\d/.test(String(s ?? ""));

/**
 * Decimalna vejica in ločilo argumentov, enako v znanstvenem in grafičnem kalkulatorju (AUDIT-005).
 * comma (slovenski zapis): vejica med števkami je decimalna povsod, tudi v oklepaju (sin(0,5) = sin 0,5);
 * »;« vedno loči argumente (max(1,5; 2)), vejica s presledkom (max(1, 5)) prav tako.
 * Brez comma (zapis s piko) ostane, kot je bilo: vejica v oklepaju loči argumente.
 * Vrne besedilo za parse() (decimalna pika, ločilo »,«); »1,2,3« z vejico (dve decimalni vejici) je napaka.
 */
export function argSeparators(s, comma = true) {
  let out = String(s ?? "");
  if (comma) {
    out = out.replace(/(\d),(?=\d)/g, "$1.");
    if (twoDots(out)) throw new MathError("unexpected", { got: "," });
  }
  return out.replace(/;/g, ",");
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
        const piece = run[k] === "Δ" && k + 1 < run.length && !"πτeiΔ".includes(run[k + 1]) && !NAMES.some((n) => run.startsWith(n, k + 1)) ? run.slice(k, k + 2) : name || run[k];
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
/**
 * Odvod d = f′(a), izračunan simbolno, velja samo, če je f v a definirana in se levi in desni odvod ujemata z njim
 * (AUDIT-017, AUDIT-018). Enostranska odvoda (2. reda) pri vedno manjšem h: blizu pola ali roba šele majhen h
 * zadene pravo vrednost (ln x pri 10⁻⁶), daleč od 0 pa h ne sme biti pod natančnostjo a (sin x pri 10⁹).
 * Vrne d ali vrže MathError noDerivDomain / noDeriv (z levim in desnim odvodom, kadar sta končna in stabilna).
 */
export function derivCheck(fx, a, d) {
  const val = (x) => {
    const y = fx(x);
    return typeof y === "number" ? y : NaN;
  };
  const f0 = val(a);
  if (!Number.isFinite(f0)) throw new MathError("noDerivDomain");
  const tol = (x, y) => Math.abs(x - y) <= 1e-3 * (1 + Math.abs(x) + Math.abs(y));
  const floor = 256 * Number.EPSILON * Math.max(1, Math.abs(a));
  let prev = null;
  let last = null;
  for (let k = 0; k < 9; k++) {
    const h = 1e-3 * Math.sqrt(1 + Math.abs(a)) * 10 ** -k;
    if (h < floor) break;
    const L = (3 * f0 - 4 * val(a - h) + val(a - 2 * h)) / (2 * h);
    const R = (-3 * f0 + 4 * val(a + h) - val(a + 2 * h)) / (2 * h);
    if (Number.isFinite(d) && Number.isFinite(L) && Number.isFinite(R) && tol(L, R) && tol((L + R) / 2, d)) return d;
    prev = last;
    last = [L, R];
  }
  // levi in desni odvod pokažemo le, kadar sta se ustalila (vogal |x|), ne pri navpični tangenti ali skoku
  const stable = prev && last && last.every((x, i) => Number.isFinite(x) && Math.abs(x) < 1e6 && tol(x, prev[i]));
  if (stable && !tol(last[0], last[1])) {
    const nice = (x) => Number(x.toPrecision(4)) || 0; // enostranska odvoda sta numerična: 4 mesta
    throw new MathError("noDeriv", { left: nice(last[0]), right: nice(last[1]) });
  }
  throw new MathError("noDeriv");
}

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
      // Napačno število vrednosti je napaka, nikoli tiho izpuščena vrednost: sin(0,5) z vejico kot ločilom ni sin(0),
      // nCr(171,1) z decimalno vejico ni nCr(171,1; ?). Število za MathError("arity") je v ARITY.
      const want = TRIG[f] ? 1 : ARITY[f];
      if (want && args.length !== want) throw new MathError("arity", { f, n: want });
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
      if (f === "__ODVOD_V_TOCKI") {
        // odvod v točki (scicore.js, d/dx(f; a)): args = [f′(a), a], node.fn = f, node.v = spremenljivka
        const F = c(node.fn);
        const v = node.v;
        return (s) => {
          const [d, a] = args.map((g) => g(s));
          if (Array.isArray(d) || Array.isArray(a)) return d;
          return derivCheck((x) => {
            const sc = Object.create(s || null);
            sc[v] = x;
            return F(sc);
          }, a, d);
        };
      }
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
          const val = body(sc);
          // f′(a) v znanstvenem kalkulatorju: enako preverjanje kot d/dx(f; a) (AUDIT-017, AUDIT-018); graf ga ne rabi
          const p0 = def.params[0];
          if (d === 1 && ctx.derCheck && def.params.length === 1 && typeof sc[p0] === "number" && typeof val === "number") {
            return derivCheck((x) => {
              const s2 = Object.create(ctx.global || null);
              s2[p0] = x;
              return def.body(s2);
            }, sc[p0], val);
          }
          return val;
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
      const jf = node.lo ? jumpFinder(node.a, v, c) : null; // skoki (floor, sign, {…}): računamo po kosih
      return (s) => {
        const sc = Object.create(s);
        return integrate((t) => ((sc[v] = t), a(sc)), lo(s), hi(s), undefined, jf ? (x0, x1) => jf(s, x0, x1) : false);
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

// ---------- integral ----------
// Določeni integral z oceno napake. 1) Prilagodljivo Gauss–Kronrodovo pravilo (G7–K15, globalno: vedno delimo kos
// z največjo oceno napake). 2) Kjer se ne izide (pol, singularnost, nihanje), poiščemo točko c in na vsaki strani
// ocenimo asimptotiko |f(c ± t)| ≈ C·t^(−p)·L^(−q), L = ln(1/t), iz vzorcev do t ≈ 10⁻¹⁴⁰: integral ob c obstaja natanko
// tedaj, ko p < 1 ali p = 1 in q > 1 (1/(x·ln²x) da, 1/(x·ln x) ne). Ko obstaja, ga računamo v spremenljivki L in mu
// prištejemo rep modela; napaka je razlika dveh neodvisnih prilagoditev modela. Česar ne znamo zanesljivo ločiti,
// vrne »unknown« (ne izmišljenega števila ali sodbe). Vsak izid ima err; »=« le, ko err podpira vseh 12 mest.

const GK_X = [0.991455371120812639, 0.949107912342758525, 0.864864423359769073, 0.741531185599394440, 0.586087235467691130, 0.405845151377397167, 0.207784955007898468];
const GK_WK = [0.022935322010529225, 0.063092092629978553, 0.104790010322250184, 0.140653259715525919, 0.169004726639267903, 0.190350578064785410, 0.204432940075298892, 0.209482141084727828];
const GK_WG = [0.129484966168869693, 0.279705391489276668, 0.381830050505118945, 0.417959183673469388];
const EPS = 2.220446049250313e-16;

// časovna meja: vgnezdeni integrali si jo delijo z zunanjim; brez nastavljene meje ima vsak klic svojo
const DEFAULT_MS = 300;
let DEADLINE = 0;
let EVALS = 0;
let NEST = 0;
let TRACE = null;
let CHECK_JUMPS = true;
const BUDGET = { budget: true };
const now = () => (typeof performance !== "undefined" ? performance.now() : Date.now());

/** fn() z mejo ms milisekund za vse integrale v njem; integral, ki se ne izide pravočasno, vrne { timeout: true }. */
export function withIntegralBudget(ms, fn) {
  const prev = DEADLINE;
  DEADLINE = now() + ms;
  try {
    return fn();
  } finally {
    DEADLINE = prev;
  }
}
/** fn() in podatki (integrateInfo) vseh zunanjih določenih integralov, izračunanih med njim: { result, infos }. */
export function integralTrace(fn) {
  const prev = TRACE;
  const infos = [];
  TRACE = infos;
  try {
    return { result: fn(), infos };
  } finally {
    TRACE = prev;
  }
}

function wrap(f) {
  return (x) => {
    if ((++EVALS & 255) === 0 && now() > DEADLINE) throw BUDGET;
    let y = f(x);
    if (typeof y !== "number") y = NaN;
    return y;
  };
}

// G7–K15 na [a, b]; NaN v vozlu (0/0 v eni točki) poskusimo malo zamaknjen
function gk(F, a, b) {
  const c = 0.5 * (a + b);
  const h = 0.5 * (b - a);
  const at = (x) => {
    let y = F(x);
    if (Number.isNaN(y)) y = F(x + h * 1e-9);
    return y;
  };
  const fc = at(c);
  let rk = fc * GK_WK[7];
  let rg = fc * GK_WG[3];
  let rabs = Math.abs(fc) * GK_WK[7];
  const v1 = new Array(7);
  const v2 = new Array(7);
  let fmax = Math.abs(fc);
  let xmax = c;
  for (let j = 0; j < 7; j++) {
    const dx = h * GK_X[j];
    const y1 = at(c - dx);
    const y2 = at(c + dx);
    v1[j] = y1;
    v2[j] = y2;
    rk += GK_WK[j] * (y1 + y2);
    rabs += GK_WK[j] * (Math.abs(y1) + Math.abs(y2));
    if (j & 1) rg += GK_WG[j >> 1] * (y1 + y2);
    const m1 = Math.abs(y1);
    const m2 = Math.abs(y2);
    if (!(m1 <= fmax)) (fmax = m1), (xmax = c - dx);
    if (!(m2 <= fmax)) (fmax = m2), (xmax = c + dx);
  }
  const mean = rk * 0.5;
  let rasc = GK_WK[7] * Math.abs(fc - mean);
  for (let j = 0; j < 7; j++) rasc += GK_WK[j] * (Math.abs(v1[j] - mean) + Math.abs(v2[j] - mean));
  const ah = Math.abs(h);
  const I = rk * h;
  let err = Math.abs((rk - rg) * h);
  rasc *= ah;
  rabs *= ah;
  if (rasc !== 0 && err !== 0) err = rasc * Math.min(1, (200 * err / rasc) ** 1.5);
  if (rabs > 1e-290) err = Math.max(10 * EPS * rabs, err);
  // integrand brez znanih skokov (Analiza, graf): skok med krajiščem in skrajnim vozlom vozli ne vidijo —
  // f v krajišču primerjamo z linearno napovedjo iz dveh skrajnih vozlov
  if (CHECK_JUMPS && Number.isFinite(err)) {
    const k = (1 - GK_X[0]) / (GK_X[0] - GK_X[1]);
    const big = 1e-13 * fmax;
    for (const [xe, y1, y2] of [
      [a, v1[0], v1[1]],
      [b, v2[0], v2[1]],
    ]) {
      const ye = F(xe);
      if (!Number.isFinite(ye)) continue;
      const pred = y1 + (y1 - y2) * k;
      if (Math.abs(ye - pred) > 50 * (Math.abs(y1 - y2) + big)) err = Math.max(err, 2 * ah * (1 - GK_X[0]) * Math.abs(ye - y1) + 1e-300);
    }
  }
  const bad = !Number.isFinite(I) || !Number.isFinite(err);
  return { a, b, I: bad ? 0 : I, err: bad ? Infinity : err, abs: bad ? 0 : rabs, fmax, xmax, bad, nan: Number.isNaN(fc) || v1.some(Number.isNaN) || v2.some(Number.isNaN) };
}

// kopica po err (največja na vrhu)
function hpush(h, x) {
  h.push(x);
  let i = h.length - 1;
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (h[p].err >= x.err) break;
    h[i] = h[p];
    i = p;
  }
  h[i] = x;
}
function hpop(h) {
  const top = h[0];
  const last = h.pop();
  if (h.length) {
    let i = 0;
    const n = h.length;
    for (;;) {
      let m = 2 * i + 1;
      if (m >= n) break;
      if (m + 1 < n && h[m + 1].err > h[m].err) m++;
      if (h[m].err <= last.err) break;
      h[i] = h[m];
      i = m;
    }
    h[i] = last;
  }
  return top;
}

const MAX_IV = 6000;
const tolOf = (I, abs) => Math.max(1e-13 * Math.abs(I), 2e-15 * abs, 1e-300);

// prilagodljivo GK na [a, b] (a < b): { I, E, abs, stuck: kosi najmanjše širine, ki se ne izidejo, worst: najslabši
// odprti kosi, converged }. onStuck(kos) → izid prekine računanje (npr. pol, ob katerem integral divergira).
function adapt(F, a, b, n0 = 16, maxIv = MAX_IV, onStuck = null, tolAbs = 0) {
  const tolOfL = (I, A) => Math.max(tolOf(I, A), tolAbs);
  const H = b - a;
  const minW = Math.max(H * 1e-14, 8 * EPS * Math.max(Math.abs(a), Math.abs(b)), 1e-300);
  const heap = [];
  const done = [];
  for (let k = 0; k < n0; k++) hpush(heap, gk(F, k ? a + (H * k) / n0 : a, k === n0 - 1 ? b : a + (H * (k + 1)) / n0));
  let sI = 0;
  let sE = 0;
  let sA = 0; // vsote zaprtih kosov
  const sums = () => {
    let I = sI;
    let E = 0;
    let A = sA;
    for (const s of heap) (I += s.I), (E += s.err), (A += s.abs);
    return [I, E, A];
  };
  let [I, E, A] = sums();
  let count = n0;
  let it = 0;
  let check = 1000;
  let Echeck = Infinity;
  let nanBad = 0;
  while (heap.length && count < maxIv) {
    if (++it % 64 === 0 || !Number.isFinite(E)) [I, E, A] = sums();
    if (E <= tolOfL(I, A)) break;
    if (count >= check) {
      // napaka se ne zmanjšuje več (šum zaokrožitve, nerazrešeno nihanje): nehamo
      [I, E, A] = sums();
      if (E > 0.8 * Echeck) break;
      Echeck = E;
      check *= 2;
    }
    const w = hpop(heap);
    if (w.bad && w.nan && ++nanBad > 200) return { abort: { nan: true } };
    if (w.b - w.a <= minW) {
      done.push(w);
      sI += w.I;
      sE += w.err;
      sA += w.abs;
      E -= w.err;
      if (onStuck) {
        const r = onStuck(w);
        if (r) return { abort: r };
      }
      continue;
    }
    const m = 0.5 * (w.a + w.b);
    const l = gk(F, w.a, m);
    const r = gk(F, m, w.b);
    I += l.I + r.I - w.I;
    E += l.err + r.err - w.err;
    A += l.abs + r.abs - w.abs;
    hpush(heap, l);
    hpush(heap, r);
    count++;
  }
  [I, E, A] = sums();
  const tol = tolOfL(I, A);
  const stuck = done.filter((s) => s.bad || s.err > (0.01 * tol) / done.length);
  const worst = [];
  if (E > tol) {
    const tmp = heap.slice();
    for (let k = 0; k < 12 && tmp.length; k++) worst.push(hpop(tmp));
  }
  const Et = E + sE;
  let fseen = 0;
  for (const s of heap) if (s.fmax > fseen) fseen = s.fmax;
  for (const s of done) if (s.fmax > fseen) fseen = s.fmax;
  return { I, E: Et, abs: A, stuck, worst, converged: Et <= tol && !done.some((s) => s.bad), fseen, ndone: done.length, ivs: [...heap, ...done] };
}

// ---- asimptotika ob točki ----
// najmanjkratni kvadrati y ≈ A + p·L − q·ln L (fixP: p dan)
function fitModel(pts, fixP) {
  const n = pts.length;
  if (n < 4) return null;
  if (fixP !== undefined) {
    // y − p·L = A − q·lnL
    let sx = 0;
    let sy = 0;
    let sxx = 0;
    let sxy = 0;
    for (const [L, y] of pts) {
      const x = Math.log(L);
      const z = y - fixP * L;
      sx += x;
      sy += z;
      sxx += x * x;
      sxy += x * z;
    }
    const d = n * sxx - sx * sx;
    if (!(Math.abs(d) > 1e-300)) return null;
    const slope = (n * sxy - sx * sy) / d;
    const A = (sy - slope * sx) / n;
    let rr = 0;
    for (const [L, y] of pts) rr = Math.max(rr, Math.abs(A + fixP * L + slope * Math.log(L) - y));
    return { A, p: fixP, q: -slope, res: rr };
  }
  // tri parametri: centriramo
  let mL = 0;
  let mG = 0;
  let mY = 0;
  for (const [L, y] of pts) (mL += L), (mG += Math.log(L)), (mY += y);
  mL /= n;
  mG /= n;
  mY /= n;
  let s11 = 0;
  let s12 = 0;
  let s22 = 0;
  let s1y = 0;
  let s2y = 0;
  for (const [L, y] of pts) {
    const u = L - mL;
    const v = Math.log(L) - mG;
    const w = y - mY;
    s11 += u * u;
    s12 += u * v;
    s22 += v * v;
    s1y += u * w;
    s2y += v * w;
  }
  const det = s11 * s22 - s12 * s12;
  if (!(det > 1e-12 * s11 * s22)) return null;
  const p = (s1y * s22 - s2y * s12) / det;
  const g = (s2y * s11 - s1y * s12) / det; // = −q
  const A = mY - p * mL - g * mG;
  let rr = 0;
  for (const [L, y] of pts) rr = Math.max(rr, Math.abs(A + p * L + g * Math.log(L) - y));
  return { A, p, q: -g, res: rr };
}

const RES_C0 = 1e-140; // najgloblji vzorec ob c = 0 (pod tem x² podteče)
const tresOf = (c) => (c === 0 ? RES_C0 : Math.abs(c) * 1e-11);

/**
 * Obnašanje f ob c na strani s (±1), na razdalji do w. kind: "bounded" (omejena: skok, nihanje, odpravljiva),
 * "conv" (neomejena, integrabilna; model A, p, q in alternativa alt), "div", "unknown", "nan" (ni definirana).
 */
function sideModel(F, c, s, w) {
  const tres = tresOf(c);
  const top = Math.min(0.5 * w, 0.05);
  if (!(top > 100 * tres)) return { kind: "unknown" };
  const N = 56;
  const pts = [];
  const raw = [];
  let nan = 0;
  let inf = 0;
  let cut = 0; // pod to razdaljo f ni računljiva (NaN zaradi ∞·0)
  let signs = 0;
  let prevSign = 0;
  const lt = Math.log(top);
  const lb = Math.log(tres);
  for (let i = 0; i < N; i++) {
    const t0 = Math.exp(lt + ((lb - lt) * i) / (N - 1));
    const x = c + s * t0;
    const t = s * (x - c);
    if (!(t > 0)) continue;
    const y = F(x);
    if (Number.isNaN(y)) {
      nan++;
      raw.push([t, NaN]);
      continue;
    }
    if (!Number.isFinite(y)) {
      inf++;
      raw.push([t, Infinity]);
      continue;
    }
    raw.push([t, y]);
    if (y !== 0) {
      const sg = Math.sign(y);
      if (prevSign && sg !== prevSign) signs++;
      prevSign = sg;
      pts.push([-Math.log(t), Math.log(Math.abs(y)), y]);
    }
  }
  if (nan) {
    // NaN le v najglobljem delu (x^20·e^(−x) pri x ~ 10¹⁶: ∞·0): tam odrežemo, če ostane dovolj vzorcev
    const k = raw.findIndex((r) => Number.isNaN(r[1]));
    const decayed = k >= 3 && raw[k - 1][1] === 0 && raw[k - 2][1] === 0;
    if ((k >= 20 || decayed) && raw.slice(k).every((r) => Number.isNaN(r[1]) || r[1] === 0)) {
      const tk = raw[k][0];
      cut = raw[k - 1][0];
      raw.splice(k);
      while (pts.length && Math.exp(-pts[pts.length - 1][0]) <= tk) pts.pop();
      nan = 0;
    } else return { kind: Number.isNaN(raw[0][1]) && nan > raw.length / 2 ? "nan" : "unknown" }; // »nan« le, ko f ob c res ni definirana
  }
  // nenadne ničle na koncu (1/√(x³) pri x > 10¹⁰³: x³ = ∞): preliv, ne prava vrednost — odrežemo
  {
    let k = raw.length;
    while (k > 0 && raw[k - 1][1] === 0) k--;
    if (k < raw.length && k >= 20 && Math.abs(raw[k - 1][1]) > 1e-250) {
      cut = raw[k - 1][0];
      const tk = raw[k][0];
      raw.splice(k);
      while (pts.length && Math.exp(-pts[pts.length - 1][0]) <= tk) pts.pop();
    }
  }
  if (inf === raw.length) return { kind: "div" };
  if (inf) {
    // preliv: |f| raste prek vsake meje; div le, če so neskončne samo najgloblje vrednosti in pred njimi |f| raste
    const k = raw.findIndex((r) => !Number.isFinite(r[1]));
    const before = raw.slice(0, k).map((r) => Math.abs(r[1]));
    if (raw.slice(k).every((r) => !Number.isFinite(r[1])) && before.length >= 1 && before.every((v, i) => i === 0 || v >= before[i - 1])) return { kind: "div" };
    return { kind: "unknown" };
  }
  const third = Math.floor(raw.length / 3);
  const amax = (arr) => arr.reduce((m, r) => Math.max(m, Math.abs(r[1])), 0);
  const M1 = amax(raw.slice(0, third));
  const M2 = amax(raw.slice(third, 2 * third));
  const M3 = amax(raw.slice(2 * third));
  const M = Math.max(M1, M2, M3);
  const bounded = () => (M3 <= 4 * Math.max(M1, M2) ? { kind: "bounded", M, cut, repair: limitRepair(raw) } : { kind: "unknown" });
  if (pts.length < raw.length * 0.8 || signs) return bounded();
  // model velja le blizu c: plitve vzorce po potrebi izpustimo (izberemo del, kjer se prilagoditve najbolj ujemajo)
  let full = null;
  let half = null;
  let shallow = null;
  let use = pts;
  let best = Infinity;
  for (const frac of [0, 0.2, 0.4, 0.6]) {
    const u = pts.slice(Math.floor(frac * pts.length));
    if (u.length < 12) break;
    const f0 = fitModel(u);
    if (!f0 || f0.res > 2e-3 * Math.max(1, Math.abs(f0.p) * 0.1)) continue;
    const h0 = fitModel(u.slice(Math.floor(u.length / 2)));
    const s0 = fitModel(u.slice(0, Math.ceil(u.length / 2)));
    if (!h0 || !s0) continue;
    const d0 = Math.max(Math.abs(f0.p - h0.p), Math.abs(f0.p - s0.p));
    if (d0 < best) [best, full, half, shallow, use] = [d0, f0, h0, s0, u];
    if (d0 < 1e-9) break;
  }
  if (!full || !half || !shallow) return bounded();
  const { p, q } = full;
  const dp = Math.max(Math.abs(p - half.p), Math.abs(p - shallow.p));
  const dq = Math.max(Math.abs(q - half.q), Math.abs(q - shallow.q));
  const sign = Math.sign(pts[pts.length - 1][2]);
  const tcut = raw[raw.length - 1][0];
  // |f| ne raste: omejena
  if (p < -Math.max(4 * dp, 1e-6) || (Math.abs(p) <= Math.max(4 * dp, 1e-6) && q > -Math.max(4 * dq, 1e-3) && M3 <= 4 * Math.max(M1, M2))) return { kind: "bounded", M, cut, repair: limitRepair(raw) };
  const PE = Math.max(4 * dp, 1e-7);
  // f(c) končna in manjša od najglobljega vzorca: ni pol, le zelo ozek vrh pod 10⁻¹⁴⁰ (1/(1 + 10³⁰⁰x²))
  // (pri polu je f(c) neskončna ali vsaj tolikšna, kot jo da model na razdalji ene zaokrožitve od c, npr. tan(π/2))
  const peakOr = (d) => {
    const yc = Math.abs(F(c));
    if (!Number.isFinite(yc)) return d;
    const Lu = -Math.log(c === 0 ? 1e-300 : Math.abs(c) * EPS);
    const lnModel = full.A + full.p * Lu - full.q * Math.log(Lu);
    return Math.log(Math.max(yc, 1e-300)) < lnModel - 7 ? { kind: "peak", fc: yc } : d;
  };
  if (p < 1 - PE) return { kind: "conv", sign, tcut, m: full, alt: half, alt2: shallow };
  if (p > 1 + PE) return peakOr({ kind: "div", p });
  if (dp > 1e-4) return { kind: "unknown" };
  // p = 1: odloči logaritemski faktor
  const f1 = fitModel(use, 1);
  const h1 = fitModel(use.slice(Math.floor(use.length / 2)), 1);
  const s1 = fitModel(use.slice(0, Math.ceil(use.length / 2)), 1);
  if (!f1 || !h1 || !s1 || f1.res > 2e-3) return { kind: "unknown" };
  const dq1 = Math.max(Math.abs(f1.q - h1.q), Math.abs(f1.q - s1.q));
  const QE = Math.max(4 * dq1, 1e-6);
  if (f1.q > 1 + QE) return { kind: "conv", sign, tcut, m: f1, alt: h1, alt2: s1 };
  if (f1.q < 1 - QE) return peakOr({ kind: "div", p: 1 });
  if (dq1 <= 1e-4) return peakOr({ kind: "div", p: 1 }); // q = 1 (1/(x·ln x)): ∫ ~ ln ln
  return { kind: "unknown" };
}

// ∫₀^∞ e^(−κv)·(1 + v/L)^(−q) dv, κ ≥ 0 (κ = 0: L/(q − 1))
function tailFactor(kappa, q, L) {
  if (kappa <= 0) return q > 1 ? L / (q - 1) : Infinity;
  // v = y/κ, y = z/(1 − z)
  const g = (z) => {
    if (z >= 1) return 0;
    const y = z / (1 - z);
    return (Math.exp(-y) * (1 + y / (kappa * L)) ** -q) / ((1 - z) * (1 - z));
  };
  const r = adapt(g, 0, 1, 8, 400);
  return r.I / kappa;
}
// rep ∫₀^tcut modela (C·t^(−p)·L^(−q)), predznak sign
function modelTail(m, tcut, sign) {
  const L = -Math.log(tcut);
  const fval = Math.exp(m.A + m.p * L - m.q * Math.log(L)); // |f(tcut)| po modelu
  return sign * fval * tcut * tailFactor(1 - m.p, m.q, L);
}

// ∫ po t ∈ (0, w] od f(c + s·t): numerično v L = ln(1/t) do tcut, pod tcut rep modela
function endpointIntegral(F, c, s, w, sm) {
  const L0 = -Math.log(w);
  const L1 = -Math.log(sm.tcut);
  const G = (L) => {
    const t = Math.exp(-L);
    return F(c + s * t) * t;
  };
  const r = L1 > L0 ? adapt(G, L0, L1, Math.max(8, Math.min(64, Math.ceil((L1 - L0) / 4)))) : { I: 0, E: 0, abs: 0 };
  const T = modelTail(sm.m, sm.tcut, sm.sign);
  const T2 = modelTail(sm.alt, sm.tcut, sm.sign);
  const T3 = modelTail(sm.alt2, sm.tcut, sm.sign);
  const yc = Math.exp(sm.m.A + sm.m.p * L1 - sm.m.q * Math.log(L1));
  const noise = c === 0 ? 0 : (EPS * Math.abs(c) * yc) / Math.max(sm.m.p, 0.05);
  const errT = Math.max(Math.abs(T - T2), Math.abs(T - T3)) + 1e-12 * Math.abs(T);
  return { value: r.I + T, err: r.E + errT + noise, abs: r.abs + Math.abs(T), ok: Number.isFinite(r.I + T) && (r.converged !== false || r.E < 1e-6 * Math.abs(r.I + T)) };
}

// mesto pola v [x0, x1]: največja |f| (ternarno), ali vozel z neskončno vrednostjo
function locate(F, x0, x1) {
  let lo = x0;
  let hi = x1;
  for (let k = 0; k < 200 && hi > lo; k++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (!(m1 > lo) || !(m2 < hi)) break;
    const g1 = Math.abs(F(m1));
    const g2 = Math.abs(F(m2));
    if (g1 === Infinity) return m1;
    if (g2 === Infinity) return m2;
    if (!(g1 >= g2)) lo = m1;
    else hi = m2;
  }
  return 0.5 * (lo + hi);
}

// točka c iz kosa [x0, x1]: mesto največje |f| v okolici, privito na a, b in 0
function pointOf(F, a, b, x0, x1, fmax, xmax) {
  const H = b - a;
  const W = Math.max(x1 - x0, H * 1e-13);
  let c = Number.isFinite(fmax) ? locate(F, Math.max(a, x0 - W), Math.min(b, x1 + W)) : xmax;
  if (a <= 0 && b >= 0 && Math.abs(c) <= H * 1e-12) return 0; // ∫(1/x; −1; 10⁻¹²): pol je 0, ne b
  if (c - a <= H * 1e-12) c = a;
  if (b - c <= H * 1e-12) c = b;
  return c;
}

// omejena točka, ob kateri f zaradi zaokrožitve ni več točna ((1 − cos x)/x² pri x < 10⁻⁸ da 0): vrednosti
// bliže od tstar nadomestimo z limito lim (zaporedje f(c ± t) se do tam ustali)
function limitRepair(raw) {
  const ys = raw.map((r) => r[1]);
  const n = ys.length;
  if (n < 8) return null;
  const d = [];
  for (let i = 0; i + 1 < n; i++) d.push(Math.abs(ys[i + 1] - ys[i]));
  const scale = Math.max(...ys.map(Math.abs), 1e-300);
  // začetni padajoči del zaporedja razlik; za njim mora razlika zrasti (šum)
  let k = 0;
  while (k + 1 < d.length && d[k + 1] <= 0.95 * d[k] + 1e-16 * scale) k++;
  if (k < 4 || !(d[0] > 0)) return null;
  const after = Math.max(...d.slice(k));
  if (!(after > 100 * d[k] + 1e-13 * scale) || d[k] > 1e-6 * scale) return null;
  return { tstar: raw[k + 1][0], lim: ys[k + 1], lerr: 4 * d[k] + 1e-15 * scale };
}

// ∫ po t ∈ (0, w] od f(c + s·t) v L = ln(1/t) do najmanjše razdalje (ozek vrh, ki ga vozli ne vidijo); ostanek ≤ |f|·t
function peakIntegral(F, c, s, w) {
  const L0 = -Math.log(w);
  const L1 = -Math.log(c === 0 ? 1e-300 : Math.abs(c) * 4 * EPS);
  if (!(L1 > L0)) return { value: 0, err: Infinity, ok: false };
  const G = (L) => {
    const t = Math.exp(-L);
    return F(c + s * t) * t;
  };
  const r = adapt(G, L0, L1, Math.max(8, Math.min(96, Math.ceil((L1 - L0) / 6))));
  const tmin = Math.exp(-L1);
  const yc = Math.abs(F(c));
  const tail = tmin * (Number.isFinite(yc) ? Math.max(yc, Math.abs(F(c + s * tmin))) : Infinity);
  return { value: r.I, err: r.E + tail, abs: r.abs, ok: Number.isFinite(r.I) && Number.isFinite(tail) && (r.converged || r.E < 1e-6 * Math.abs(r.I)) };
}

// skrit vrh ob 0 ali krajišču: tipanje f(c ± t) za t = w·10^(−k); vrne c ali null
function hiddenPeak(F, a, b, r1) {
  const H = b - a;
  const scale = Math.abs(r1.I) + r1.abs;
  const cs = [a, b];
  if (a < 0 && b > 0) cs.push(0);
  for (const c of cs) {
    for (const s of [-1, 1]) {
      if (s < 0 ? !(c > a) : !(c < b)) continue;
      const w = Math.min(s < 0 ? c - a : b - c, H) * 0.5;
      const tmin = c === 0 ? 1e-300 : Math.abs(c) * 1e-15;
      for (let t = w * 0.1; t > tmin; t *= 0.1) {
        const y = Math.abs(F(c + s * t));
        if (Number.isFinite(y) && y > 2 * r1.fseen && y * t > 1e-14 * scale) return c;
      }
    }
  }
  // vsi vozli so dali 0 (e^(−10⁸(x − 0,3)²)): gosto enakomerno tipanje
  if (r1.abs === 0) {
    const N = 4096;
    for (let i = 0; i < N; i++) {
      const x = a + (H * (i + 0.5 + 0.1234567 * Math.sin(i))) / N;
      const y = F(x);
      if (Number.isFinite(y) && y !== 0) return x;
    }
  }
  return null;
}

// razdeli pri c (skrit vrh): kosi ob c v L, ostalo običajno
function splitAt(F, a, b, c, depth, tolAbs) {
  let value = 0;
  let err = 0;
  let abs = 0;
  const add = (r) => {
    value += r.value;
    err += r.err;
    abs += r.abs || 0;
  };
  for (const [u, v, s] of [
    [a, c, -1],
    [c, b, 1],
  ]) {
    if (!(v > u)) continue;
    const w = 0.5 * (v - u);
    const p = peakIntegral(F, c, s, w);
    if (!p.ok) return UNKNOWN;
    add(p);
    const lo = s < 0 ? u : c + w;
    const hi = s < 0 ? c - w : v;
    if (hi > lo) {
      const r = depth < 2 ? finiteCore(F, lo, hi, depth + 1, tolAbs) : UNKNOWN;
      if (!Number.isFinite(r.value)) return r;
      add(r);
    }
  }
  return { value, err, abs, singular: true };
}

// znani skoki (floor, sign, … iz drevesa izraza): računamo po kosih med njimi
function finiteIntegral(F0, a, b, depth = 0, tolAbs = 0, brk = null) {
  const B = brk && !depth ? brk(a, b) : null;
  if (!B || !B.length) return finiteCore(F0, a, b, depth, tolAbs);
  const xs = [a, ...B.filter((x) => x > a && x < b), b];
  let value = 0;
  let err = 0;
  let abs = 0;
  for (let i = 0; i + 1 < xs.length; i++) {
    if (!(xs[i + 1] > xs[i])) continue;
    const r = finiteCore(F0, xs[i], xs[i + 1], xs.length > 50 ? 1 : 0, tolAbs); // mnogo kosov: brez tipanja vrhov
    if (!Number.isFinite(r.value)) return r;
    value += r.value;
    err += r.err;
    abs += r.abs || 0;
  }
  return { value, err, abs };
}

const DIVERGES = (at, pv) => ({ value: NaN, diverges: true, at, ...(pv !== undefined ? { pv } : {}) });
const UNKNOWN = { value: NaN, unknown: true };

// končni [a, b], a < b, brez znanih skokov
function finiteCore(F0, a, b, depth = 0, tolAbs = 0) {
  const H = b - a;
  const seen = new Map();
  const side = (F, c, s) => {
    const key = `${c}|${s}`;
    if (!seen.has(key)) seen.set(key, (s < 0 ? c > a : c < b) ? sideModel(F, c, s, Math.min(0.25 * (s < 0 ? c - a : b - c), 0.01 * H)) : null);
    return seen.get(key);
  };
  // med računanjem: kos ob polu se ne izide → takoj preverimo, ali integral tam divergira
  let checks = 0;
  const onStuck = (w) => {
    if (!(w.bad || w.err > 1e-9 * Math.max(1e-300, w.abs + Math.abs(w.I)) * 1e6) || checks >= 24) return null;
    checks++;
    const c = pointOf(F0, a, b, w.a, w.b, w.fmax, w.xmax);
    const L = side(F0, c, -1);
    const R = side(F0, c, 1);
    if (L?.kind === "div" || R?.kind === "div") return { c, L, R };
    return null;
  };
  let F = F0;
  let r1 = adapt(F, a, b, 16, MAX_IV, onStuck, tolAbs);
  if (r1.abort?.nan) return { value: NaN };
  if (r1.abort) return withPv(F0, a, b, r1.abort.c, r1.abort.L, r1.abort.R, depth);
  if (r1.converged && Number.isFinite(r1.I)) {
    // skrit ozek vrh (e^(−10¹²x²)): vozli ga niso zadeli
    const hid = depth ? null : hiddenPeak(F0, a, b, r1);
    if (hid !== null) return splitAt(F0, a, b, hid, depth, tolAbs);
    // skoki: neodvisno drugo deljenje (13 kosov); razlika je poštena ocena zgrešenega
    // skoki, ki jih iz drevesa ne poznamo: vsak končni kos še enkrat na dveh polovicah (drugi vozli);
    // razlika je poštena ocena zgrešenega skoka
    if (r1.ndone || CHECK_JUMPS) {
      let I2 = 0;
      let E2 = 0;
      let D = 0;
      for (const w of r1.ivs) {
        if (w.b - w.a <= 1e-14 * H) {
          I2 += w.I;
          E2 += w.err;
          continue;
        }
        const m = 0.5 * (w.a + w.b);
        const l = gk(F0, w.a, m);
        const r = gk(F0, m, w.b);
        I2 += l.I + r.I;
        E2 += l.err + r.err;
        D += Math.abs(l.I + r.I - w.I);
      }
      if (Number.isFinite(I2) && Number.isFinite(E2)) return { value: I2, err: Math.max(E2, D), abs: r1.abs };
    }
    return { value: r1.I, err: r1.E, abs: r1.abs };
  }
  const ivs = [...r1.stuck, ...r1.worst];
  // točke, bližje od 10⁻⁹·H, so ista točka (prednost imajo a, b, 0 in večja |f|)
  const merge = (list) => {
    const tol = 1e-9 * H;
    const out = [];
    for (const p of list.sort((x, y) => x.c - y.c)) {
      if (p.c !== 0 && p.c - a <= tol) p.c = a;
      if (p.c !== 0 && b - p.c <= tol) p.c = b;
      const q = out[out.length - 1];
      const nice2 = (z) => z.c === a || z.c === b || z.c === 0;
      if (q && p.c - q.c <= tol && !(nice2(p) && nice2(q) && p.c !== q.c)) {
        const nice = (z) => z.c === a || z.c === b || z.c === 0;
        if (!nice(q) && (nice(p) || !(p.f <= q.f))) out[out.length - 1] = p;
      } else out.push(p);
    }
    return out.map((p) => p.c);
  };
  const ptsOf = (list) => merge([{ c: a, f: Infinity }, { c: b, f: Infinity }, ...list.map((w) => ({ c: pointOf(F0, a, b, w.a, w.b, w.fmax, w.xmax), f: Number.isFinite(w.fmax) ? w.fmax : Infinity }))]);
  let pts = ptsOf(ivs);
  const many = pts.length > 42;
  if (many) {
    // npr. 1/sin(100x): pregledamo le točke z največjo |f|
    pts = ptsOf(ivs.slice().sort((p, q) => (Number.isFinite(q.fmax) ? q.fmax : 1e308) - (Number.isFinite(p.fmax) ? p.fmax : 1e308)).slice(0, 12));
  }
  const info = [];
  let nanSeen = false;
  for (const c of pts) {
    const L = side(F0, c, -1);
    const R = side(F0, c, 1);
    if (L?.kind === "div" || R?.kind === "div") return withPv(F0, a, b, c, L, R, many ? 1 : depth);
    if (L?.kind === "nan" || R?.kind === "nan") nanSeen = true;
    info.push({ c, L, R });
  }
  if (nanSeen) return { value: NaN };
  if (info.some((p) => p.L?.kind === "unknown" || p.R?.kind === "unknown")) return UNKNOWN;
  // odpravljive točke s šumom zaokrožitve: nadomestimo z limito in računamo znova
  const reps = [];
  for (const p of info)
    for (const [m, s] of [
      [p.L, -1],
      [p.R, 1],
    ])
      if (m?.kind === "bounded" && m.repair && m.repair.tstar >= 1e-9 * H) reps.push({ c: p.c, s, ...m.repair });
  let repErr = 0;
  if (reps.length && !many) {
    F = (x) => {
      for (const r of reps) {
        const t = r.s * (x - r.c);
        if (t >= 0 && t < r.tstar) return r.lim;
      }
      return F0(x);
    };
    repErr = reps.reduce((e, r) => e + r.tstar * r.lerr, 0);
    r1 = adapt(F, a, b, 16, MAX_IV, null, tolAbs);
  }
  const special = (m) => m?.kind === "conv" || m?.kind === "peak";
  const sing = info.filter((p) => special(p.L) || special(p.R));
  if (!sing.length) {
    // le omejene točke (skok, nihanje): GK z oceno napake
    if (!Number.isFinite(r1.I) || !Number.isFinite(r1.E)) return UNKNOWN;
    return { value: r1.I, err: r1.E + repErr, abs: r1.abs };
  }
  if (many) return UNKNOWN;
  // kosi med integrabilnimi singularnostmi
  const cuts = [a, ...sing.map((p) => p.c).filter((c) => c > a && c < b), b];
  const at = (c) => sing.find((p) => p.c === c);
  let value = 0;
  let err = repErr;
  let abs = 0;
  for (let i = 0; i + 1 < cuts.length; i++) {
    const u = cuts[i];
    const v = cuts[i + 1];
    const lm = at(u)?.R;
    const rm = at(v)?.L;
    const wl = special(lm) ? 0.25 * (v - u) : 0;
    const wr = special(rm) ? 0.25 * (v - u) : 0;
    const parts = [];
    if (wl) parts.push(lm.kind === "peak" ? peakIntegral(F, u, 1, wl) : endpointIntegral(F, u, 1, wl, lm));
    if (wr) parts.push(rm.kind === "peak" ? peakIntegral(F, v, -1, wr) : endpointIntegral(F, v, -1, wr, rm));
    const lo = u + wl;
    const hi = v - wr;
    if (hi > lo) {
      const m = adapt(F, lo, hi, 16, MAX_IV, null, tolAbs);
      if (m.converged && Number.isFinite(m.I)) parts.push({ value: m.I, err: m.E, abs: m.abs, ok: true });
      else if (depth < 2) {
        const sub = finiteCore(F, lo, hi, depth + 1, tolAbs);
        if (!Number.isFinite(sub.value)) return sub;
        parts.push({ ...sub, ok: true });
      } else if (Number.isFinite(m.I) && Number.isFinite(m.E)) parts.push({ value: m.I, err: m.E, abs: m.abs, ok: true });
      else return UNKNOWN;
    }
    for (const p of parts) {
      if (!p.ok) return UNKNOWN;
      value += p.value;
      err += p.err;
      abs += p.abs || 0;
    }
  }
  if (!Number.isFinite(value)) return UNKNOWN;
  return { value, err, abs, singular: true };
}

// Cauchyjeva glavna vrednost: en sam notranji pol reda 1 z menjavo predznaka, drugje brez polov
function withPv(F, a, b, c, L, R, depth) {
  if (depth || !(c > a && c < b) || L?.kind !== "div" || R?.kind !== "div") return DIVERGES(c);
  try {
    const r = Math.min(c - a, b - c);
    const g = (t) => {
      const x1 = c + t;
      const x2 = c - (x1 - c);
      return F(x1) + F(x2);
    };
    const t1 = r * 1e-3;
    const t2 = r * 1e-6;
    const g1 = Math.abs(g(t1));
    const g2 = Math.abs(g(t2));
    const noise = (t) => Math.abs(F(c + t)) * ((1e-15 * Math.max(1, Math.abs(c))) / t);
    if (!Number.isFinite(g1) || !Number.isFinite(g2) || g2 > 10 * Math.max(g1, noise(t1), noise(t2))) return DIVERGES(c);
    const cut = r * 1e-7;
    const core = adapt(g, cut, r, 16, 4000);
    let pv = core.I;
    if (c - r > a) {
      const o = finiteIntegral(F, a, c - r, 1);
      if (!Number.isFinite(o.value)) return DIVERGES(c);
      pv += o.value;
    }
    if (c + r < b) {
      const o = finiteIntegral(F, c + r, b, 1);
      if (!Number.isFinite(o.value)) return DIVERGES(c);
      pv += o.value;
    }
    if (!Number.isFinite(pv)) return DIVERGES(c);
    return DIVERGES(c, Math.abs(pv) < 1e-7 * Math.max(1, r) ? 0 : Number(pv.toPrecision(6)));
  } catch (e) {
    if (e === BUDGET) throw e;
    return DIVERGES(c);
  }
}

/**
 * Določeni integral s podatki: { value, err?, abs?, singular?, diverges?, pv?, at?, unknown?, timeout? }.
 * value je NaN, ko integral ne obstaja (diverges; pv: Cauchyjeva glavna vrednost, at: mesto pola), ko ga ne znamo
 * zanesljivo izračunati (unknown) ali ko je zmanjkalo časa (timeout). err: ocena absolutne napake.
 */
export function integrateInfo(f, a, b, eps, depth = 0, brk = null) {
  if (Number.isNaN(a) || Number.isNaN(b)) return { value: NaN };
  if (a === b) return { value: 0, err: 0 };
  if (a > b) {
    const r = integrateInfo(f, b, a, eps, depth, brk);
    return { ...r, value: -r.value, ...(r.pv !== undefined ? { pv: -r.pv } : {}) };
  }
  const outer = NEST === 0;
  const prevDeadline = DEADLINE;
  // brk === false: iz drevesa vemo, da integrand nima skokov; sicer (Analiza, graf) vsak izid preveri drugo deljenje
  const prevCheck = CHECK_JUMPS;
  CHECK_JUMPS = brk !== false;
  if (outer && !DEADLINE) DEADLINE = now() + DEFAULT_MS;
  NEST++;
  try {
    const F = wrap(f);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return infiniteIntegral(F, a, b, brk);
    return finiteIntegral(F, a, b, 0, 0, brk || null);
  } catch (e) {
    if (e === BUDGET && outer) return { value: NaN, timeout: true };
    throw e;
  } finally {
    NEST--;
    CHECK_JUMPS = prevCheck;
    if (outer) DEADLINE = prevDeadline;
  }
}

// neskončnih mej (∫ do ∞) tu še ne računamo
function infiniteIntegral() {
  return { value: NaN };
}

/** Določeni integral (število); NaN, ko ne obstaja, ga ne znamo zanesljivo izračunati ali je zmanjkalo časa. brk(a, b): znani skoki. */
export function integrate(f, a, b, eps = 1e-9, brk = null) {
  if (OVERRIDE && NEST === 0) return OVERRIDE.values[OVERRIDE.i++] ?? NaN;
  const r = integrateInfo(f, a, b, eps, 0, brk);
  if (TRACE && NEST === 0) TRACE.push(r);
  return r.value;
}

// fn() z danimi vrednostmi zunanjih integralov (po vrsti), brez računanja: za oceno napake sestavljenega izraza
let OVERRIDE = null;
export function withIntegralValues(values, fn) {
  const prev = OVERRIDE;
  OVERRIDE = { values, i: 0 };
  try {
    return fn();
  } finally {
    OVERRIDE = prev;
  }
}

/**
 * Skoki integranda iz drevesa izraza: floor, ceil, round, sign, abs (pregib), mod in pogoji {…}. Vrne funkcijo
 * (scope, a, b) → urejena mesta skokov v (a, b) ali null (preveč ali neznano). cf: prevajalnik otrok (compile).
 */
export function jumpFinder(node, v, cf) {
  const gs = [];
  const visit = (n) => {
    if (!n || typeof n !== "object") return;
    if (n.k === "call" && n.args?.length) {
      const f = n.f;
      if (f === "floor" || f === "ceil") gs.push({ g: cf(n.args[0]), off: 0, step: 1 });
      else if (f === "round") gs.push({ g: cf(n.args[0]), off: 0.5, step: 1 });
      else if (f === "sign" || f === "sgn" || f === "abs") gs.push({ g: cf(n.args[0]), off: 0, step: 0 });
      else if (f === "mod" && n.args.length === 2) {
        const p = cf(n.args[0]);
        const q = cf(n.args[1]);
        gs.push({ g: (sc) => p(sc) / q(sc), off: 0, step: 1 });
      }
    }
    if (n.k === "pw")
      for (const [cond] of n.cases || [])
        if (cond?.k === "cmp") for (let i = 0; i + 1 < cond.terms.length; i++) {
          const l = cf(cond.terms[i]);
          const r = cf(cond.terms[i + 1]);
          gs.push({ g: (sc) => l(sc) - r(sc), off: 0, step: 0 });
        }
    for (const k in n) if (k !== "k") {
      const c = n[k];
      if (Array.isArray(c)) c.forEach((x) => (Array.isArray(x) ? x.forEach(visit) : visit(x)));
      else if (c && typeof c === "object") visit(c);
    }
  };
  visit(node);
  if (!gs.length) return null;
  return (scope, a, b) => {
    if (!(b > a) || !Number.isFinite(a) || !Number.isFinite(b)) return null;
    const sc = Object.create(scope);
    const N = 1024;
    const out = [];
    for (const { g, off, step } of gs) {
      const at = (x) => {
        sc[v] = x;
        const y = g(sc);
        return typeof y === "number" ? y : NaN;
      };
      let x0 = a;
      let y0 = at(a);
      for (let i = 1; i <= N; i++) {
        const x1 = i === N ? b : a + ((b - a) * i) / N;
        const y1 = at(x1);
        if (Number.isFinite(y0) && Number.isFinite(y1) && y0 !== y1) {
          // ravni med y0 (izključno) in y1 (vključno)
          const up = y1 > y0;
          const inside = (L) => (up ? L > y0 && L <= y1 : L < y0 && L >= y1);
          const levels = [];
          if (step) for (let k = Math.ceil(Math.min(y0, y1) - off); k + off <= Math.max(y0, y1); k++) inside(k + off) && levels.push(k + off);
          else if (inside(0)) levels.push(0);
          if (levels.length > 2000 || out.length > 5000) return null;
          for (const L of levels) {
            // bisekcija g(x) = L
            let p = x0;
            let q = x1;
            for (let it = 0; it < 1100; it++) {
              const m = 0.5 * (p + q);
              if (!(m > p && m < q)) break;
              if (at(m) >= L === up) q = m;
              else p = m;
            }
            out.push(q);
          }
        }
        x0 = x1;
        y0 = y1;
      }
    }
    // bližnja mesta (in 0, kamor bisekcija le konvergira) združimo
    const tol = 1e-13 * (b - a);
    const res = [];
    for (let x of out.sort((p, q) => p - q)) {
      if (a < 0 && b > 0 && Math.abs(x) <= tol) x = 0;
      if (x - a > tol && b - x > tol && !(res.length && x - res[res.length - 1] <= tol)) res.push(x);
    }
    return res;
  };
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
      // manjkajoča vrednost (nCr(171,1) z decimalno vejico) je prazen okvirček, nikoli »undefined«
      const a = n.args.map(T);
      const want = TRIG[n.f] || UNARY[n.f] ? 1 : ARITY[n.f] || 0;
      while (a.length < want) a.push("\\square");
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
      return `\\left(${n.items.map(T).join(`${sep === ";" ? ";" : ","}\\ `)}\\right)`;
    case "list":
      return `\\left[${n.items.map(T).join(`${sep === ";" ? ";" : ","}\\ `)}\\right]`;
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
    .replace(/;/g, ",") // ločilo argumentov v slovenskem zapisu (toTex s sep »;«)
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
    // tudi ⟺ / ⟹ med dvema zapisoma (»y = \log_{10} x \iff 10^y = x«): vsak del posebej
    for (const part of tex.split(/\\\\|,\s*\\quad|\\quad|;\s|\\qquad|\\iff|\\Leftrightarrow|\\Longleftrightarrow|\\Rightarrow|\\Longrightarrow|\\implies/)) {
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
  // Ob krivulji je samostojen pogoj »x > 0« (definicijsko območje) le opomba: graf naj pokaže funkcijo, ne polravnine.
  const curve = out.some((s) => /(^|[^<>!])=/.test(s) && /y|^\s*[a-hk-wz]\s*\(\s*x\s*\)/.test(s)); // y >= x^2 je območje, ne krivulja
  return curve ? out.filter((s) => !/^\s*x\s*(<=|>=|<|>|≤|≥)[^xy=]*$/.test(s)) : out;
}

/** Ali ima graf izraza iz plottableFromText smisel pod odgovorom inštruktorja: zveza z y (y = 2x + 1, x² + y² = 25,
 *  y > x) ali funkcija f(x) = …; rešitev »x = 4« ali »x > 3« z eno spremenljivko ne (j 16. 11.). */
export const worthGraph = (src) => /\by\b/.test(String(src)) || /^\s*[a-hk-wz]\s*\(\s*x\s*\)\s*=/.test(String(src));

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
