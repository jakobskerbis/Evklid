// Še dve igri, v katerih učenec odgovor naredi sam (j 2026-11-01: »naj bodo igre bolj raznovrstne kot samo
// izbiranje pravilnih možnosti«; docs/igre-smernice.md §2.1 »Produce, don't pick«, §3 »Sestavi«):
// - Sestavi enačbo (tiles): rakunka Iva odklepa vrata; ključavnica se odpre le, ko ploščice sestavijo pravilno
//   enačbo (prazna mesta v računu) ali pravilen odgovor (izraz: razstavljen, zmnožen, enačba premice …).
// - Razvrsti po velikosti (order): bober Brin zloži hlode z vrednostmi po vrsti.
// Preverja se vrednost (vsaka pravilna enačba šteje, ne le ena), računa se točno (ulomki z BigInt).
// Pomožne funkcije zgoraj so čiste (brez DOM), da jih preverijo testi; DOM uporabljata samo motorja v create().
import { fmt } from "./topics.js";
import { clamp, INK, chap, circle, pill, face, sky } from "./fun.js";
import { icon } from "../icons.js";
import { decSep, readNumber, isPick, isCode, iso, esc, keyBtn, wireKeys, boardText, fitter, fitList } from "./produce.js";

const MINUS = "−";
const pickR = (a, rnd) => a[Math.floor(rnd() * a.length)];
function shuffleR(a, rnd) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

// ---------- točni ulomki (BigInt) ----------
const babs = (a) => (a < 0n ? -a : a);
function bgcd(a, b) {
  a = babs(a);
  b = babs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}
const LIMIT = 1n << 256n; // prevelika števila niso za igro (in ne smejo zamrzniti telefona)
function Q(n, d = 1n) {
  if (d === 0n) return null;
  if (d < 0n) [n, d] = [-n, -d];
  const g = bgcd(n, d) || 1n;
  n /= g;
  d /= g;
  return babs(n) > LIMIT || d > LIMIT ? null : { n, d };
}
const EX = {
  add: (a, b) => Q(a.n * b.d + b.n * a.d, a.d * b.d),
  sub: (a, b) => Q(a.n * b.d - b.n * a.d, a.d * b.d),
  mul: (a, b) => Q(a.n * b.n, a.d * b.d),
  div: (a, b) => (b.n === 0n ? null : Q(a.n * b.d, a.d * b.n)),
  neg: (a) => ({ n: -a.n, d: a.d }),
  pow(a, k) {
    if (Math.abs(k) > 128) return null;
    if (k < 0) {
      if (a.n === 0n) return null;
      [a, k] = [{ n: a.d, d: a.n }, -k];
    }
    return Q(a.n ** BigInt(k), a.d ** BigInt(k));
  },
  abs: (a) => ({ n: babs(a.n), d: a.d }),
  fact(a) {
    if (a.d !== 1n || a.n < 0n || a.n > 12n) return null;
    let f = 1n;
    for (let k = 2n; k <= a.n; k++) f *= k;
    return { n: f, d: 1n };
  },
  root(a, r) {
    if (a.n < 0n && r % 2 === 0) return null;
    const n = iroot(babs(a.n), r), d = iroot(a.d, r);
    return n == null || d == null ? null : Q(a.n < 0n ? -n : n, d);
  },
};
function iroot(n, r) {
  const x = BigInt(Math.round(Number(n) ** (1 / r)));
  for (const c of [x - 1n, x, x + 1n]) if (c >= 0n && c ** BigInt(r) === n) return c;
  return null;
}
// ista pravila v plavajoči vejici (za vrednosti, ki niso ulomki: √8, 3√2)
const FL = {
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
  mul: (a, b) => a * b,
  div: (a, b) => (b === 0 ? NaN : a / b),
  neg: (a) => -a,
  pow: (a, k) => a ** k,
  root: (a, r) => (a < 0 ? (r % 2 ? -((-a) ** (1 / r)) : NaN) : a ** (1 / r)),
  abs: Math.abs,
  fact: (a) => (Number.isInteger(a) && a >= 0 && a <= 12 ? [...Array(a)].reduce((f, _, k) => f * (k + 1), 1) : NaN),
};
const eqQ = (a, b) => a.n === b.n && a.d === b.d;
const qnum = (q) => Number(q.n) / Number(q.d);

// ---------- branje računa ----------
// Žetoni: n (število ali člen: 7, −3, 0,5, 2/3, 13x, −x², C), op (+ − · : / ^), neg (minus pred oklepajem ali
// korenom), ( ), |( |) (absolutna vrednost), sup (potenca za številom ali oklepajem), root (√ ∛), pct (%), ! , =. Vsak žeton ve, kje v besedilu
// je (at, end), da ga igra zamenja s praznim mestom. inTile: potenca števila je del ploščice (2², 10⁻³).
const SUPS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
const supInt = (s) => +s.replace("⁻", "-").replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (c) => SUPS.indexOf(c));
// spremenljivke (x, y, a, b) in konstanta C pri nedoločenem integralu; druge črke (f, sin, π, enote) niso za ti igri
const VARS = "xyabC";
const OPS = { "+": "add", "−": "sub", "-": "sub", "·": "mul", "×": "mul", "*": "mul", ":": "div", "÷": "div", "/": "div", "^": "pow" };
let termRe = null, termDec = null;
function termAt(s, i) {
  const D = decSep();
  if (D !== termDec) {
    termDec = D;
    termRe = new RegExp(String.raw`(\d+)(?:${D === "," ? "," : "\\."}(\d+))?(?:\/(\d+))?|`, "y");
  }
  termRe.lastIndex = i;
  return termRe.exec(s);
}
export function lex(src, inTile = false) {
  const s = String(src ?? ""), out = [];
  const unary = () => {
    const p = out[out.length - 1];
    return !p || p.k === "(" || p.k === "|(" || p.k === "op" || p.k === "=" || p.k === "neg";
  };
  let i = 0;
  // člen od mesta j (za morebitnim predznakom): koeficient, ulomek ali spremenljivka s potenco
  const term = (at, j, neg) => {
    const m = termAt(s, j);
    const [all, int, dec, den] = m;
    let k = j + all.length;
    if (dec != null && den != null) return null;
    const t = { k: "n", at, neg, int: int ?? null, dec: dec ?? null, den: den ?? null, v: null, p: 1, pw: 1 };
    if (VARS.includes(s[k] || "_") && den == null) {
      t.v = s[k++];
      const ps = /^[⁰¹²³⁴⁵⁶⁷⁸⁹]+/.exec(s.slice(k));
      if (ps) {
        t.p = supInt(ps[0]);
        k += ps[0].length;
      }
    } else if (int == null) return null;
    if (inTile && !t.v) {
      const ps = /^⁻?[⁰¹²³⁴⁵⁶⁷⁸⁹]+/.exec(s.slice(k));
      if (ps) {
        t.pw = supInt(ps[0]);
        k += ps[0].length;
      }
    }
    // za členom ne sme stati črka ali števka (xy, 2x3, sin)
    if (/[\p{L}\d]/u.test(s[k] || "")) return null;
    t.c = int == null ? { n: 1n, d: 1n } : den != null ? Q(BigInt(int), BigInt(den)) : Q(BigInt(int + (dec || "")), 10n ** BigInt((dec || "").length));
    if (!t.c) return null;
    t.end = k;
    t.s = s.slice(at, k);
    return t;
  };
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    const at = i;
    let t = null;
    if (c === "−" || c === "-") {
      const nx = s[i + 1] || "";
      if (!unary()) t = { k: "op", f: "sub", s: MINUS, end: i + 1 };
      else if (/\d/.test(nx) || VARS.includes(nx)) t = term(at, i + 1, true);
      else if (nx === "(" || nx === "√" || nx === "∛" || nx === "|") t = { k: "neg", s: MINUS, end: i + 1 };
    } else if (/\d/.test(c) || VARS.includes(c)) t = term(at, i, false);
    // »8:30« (ura brez presledkov) ni deljenje
    else if (OPS[c] && !unary() && !(c === ":" && /\d/.test(s[i - 1] || ""))) t = { k: "op", f: OPS[c], s: c, end: i + 1 };
    else if (c === "(" || c === ")") t = { k: c, s: c, end: i + 1 };
    else if (c === "√" || c === "∛") t = { k: "root", r: c === "√" ? 2 : 3, s: c, end: i + 1 };
    else if (c === "|") t = { k: unary() ? "|(" : "|)", s: c, end: i + 1 };
    else if (c === "%" || c === "!") t = { k: c === "%" ? "pct" : "!", s: c, end: i + 1 };
    else if (c === "=") t = { k: "=", s: c, end: i + 1 };
    else if (/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]/.test(c)) {
      const ps = /^⁻?[⁰¹²³⁴⁵⁶⁷⁸⁹]+/.exec(s.slice(i));
      if (ps && out.length && (out[out.length - 1].k === "n" || out[out.length - 1].k === ")")) t = { k: "sup", p: supInt(ps[0]), s: ps[0], end: i + ps[0].length };
    }
    if (!t) return null;
    t.at = at;
    out.push(t);
    i = t.end;
  }
  return out;
}
export const varsOf = (toks) => new Set(toks.filter((t) => t.k === "n" && t.v).map((t) => t.v));

// Drevo računa (rekurzivni spust): +− < ·:/ in množenje brez znaka (7(x − 6), 2√2) < minus spredaj < potenca, %.
function parser(toks) {
  let i = 0;
  const peek = () => toks[i];
  const isOp = (t, fs) => t && t.k === "op" && fs.includes(t.f);
  function expr() {
    let a = term();
    while (isOp(peek(), ["add", "sub"])) {
      const o = toks[i++];
      a = { t: "bin", f: o.f, a, b: term() };
    }
    return a;
  }
  function term() {
    let a = factor();
    for (;;) {
      const p = peek();
      if (isOp(p, ["mul", "div"])) {
        i++;
        a = { t: "bin", f: p.f, a, b: factor() };
      } else if (p && (p.k === "(" || p.k === "root")) a = { t: "bin", f: "mul", a, b: factor() };
      else return a;
    }
  }
  function factor() {
    if (peek()?.k === "neg") {
      i++;
      return { t: "neg", a: factor() };
    }
    return postfix();
  }
  function post(a) {
    for (;;) {
      const s = peek();
      if (s && (s.k === "sup" || s.k === "pct" || s.k === "!")) {
        i++;
        a = s.k === "sup" ? { t: "pow", a, p: s.p } : { t: s.k === "!" ? "fact" : "pct", a };
      } else if (isOp(s, ["pow"])) {
        // 10^−5, 2^(x + 1): eksponent je število ali oklepaj
        i++;
        a = { t: "powe", a, b: postfix() };
      } else return a;
    }
  }
  function postfix() {
    const p = peek();
    if (!p) throw new Error("konec");
    if (p.k === "n") {
      i++;
      // −3² = −(3²): potenca velja za število, minus za rezultat (tako se tudi bere)
      if (p.neg && peek()?.k === "sup") return { t: "neg", a: post({ t: "n", tok: p, abs: true }) };
      return post({ t: "n", tok: p });
    }
    if (p.k === "(") {
      i++;
      const a = expr();
      if (peek()?.k !== ")") throw new Error(")");
      i++;
      return post(a);
    }
    if (p.k === "root") {
      i++;
      return { t: "root", r: p.r, a: postfix() };
    }
    if (p.k === "|(") {
      i++;
      const a = expr();
      if (peek()?.k !== "|)") throw new Error("|");
      i++;
      return post({ t: "abs", a });
    }
    throw new Error(p.s);
  }
  return {
    expr,
    at: () => i,
    eat(k) {
      if (peek()?.k !== k) throw new Error(k);
      i++;
    },
  };
}
export function parseExpr(toks) {
  try {
    const P = parser(toks);
    const a = P.expr();
    return P.at() === toks.length ? a : null;
  } catch {
    return null;
  }
}
// trditev »levo = desno« → [levo, desno]
export function parseStatement(toks) {
  try {
    const P = parser(toks);
    const a = P.expr();
    P.eat("=");
    const b = P.expr();
    return P.at() === toks.length ? [a, b] : null;
  } catch {
    return null;
  }
}
// Vrednost drevesa; A = EX (točno, null ob deljenju z 0 ali nerazrešljivem korenu) ali FL (plavajoča vejica).
export function evalTree(a, env = {}, A = EX) {
  const ok = (v) => (A === EX ? v != null : Number.isFinite(v));
  const go = (a) => {
    let v;
    switch (a.t) {
      case "n": {
        const k = a.tok;
        v = A === EX ? k.c : qnum(k.c);
        if (k.pw !== 1) v = A.pow(v, k.pw);
        if (k.v) {
          const x = env[k.v] == null ? null : A.pow(env[k.v], k.p);
          if (!ok(v) || x == null || !ok(x)) return null;
          v = A.mul(v, x);
        }
        if (ok(v) && k.neg && !a.abs) v = A.neg(v);
        return ok(v) ? v : null;
      }
      case "bin": {
        const x = go(a.a), y = go(a.b);
        if (x == null || y == null) return null;
        v = A[a.f](x, y);
        break;
      }
      case "neg":
        v = go(a.a);
        return v == null ? null : A.neg(v);
      case "pow":
        v = go(a.a);
        if (v == null) return null;
        v = A.pow(v, a.p);
        break;
      case "root":
        v = go(a.a);
        if (v == null) return null;
        v = A.root(v, a.r);
        break;
      case "abs":
      case "fact":
        v = go(a.a);
        if (v == null) return null;
        v = A[a.t](v);
        break;
      case "powe": {
        const x = go(a.a), y = go(a.b);
        if (x == null || y == null) return null;
        const k = A === EX ? (y.d === 1n ? Number(y.n) : NaN) : y;
        if (!Number.isInteger(k)) return null;
        v = A.pow(x, k);
        break;
      }
      case "pct":
        v = go(a.a);
        if (v == null) return null;
        v = A.div(v, A === EX ? { n: 100n, d: 1n } : 100);
        break;
    }
    return ok(v) ? v : null;
  };
  return go(a);
}
// Ali sta izraza enaka: brez spremenljivk točno, s spremenljivkami v 12 različnih točkah (polinom ali ulomek
// polinomov nizke stopnje, ki se ujema v toliko točkah, je isti izraz). Točke, kjer kateri ni določen, preskoči.
const PTS = [[2n, 1n], [3n, 1n], [-1n, 1n], [5n, 1n], [1n, 2n], [-4n, 1n], [7n, 3n], [11n, 1n], [-5n, 2n], [6n, 1n], [13n, 1n], [-7n, 1n]];
export function same(a, b, vars) {
  if (!vars.size) {
    const x = evalTree(a), y = evalTree(b);
    return !!x && !!y && eqQ(x, y);
  }
  let ok = 0;
  for (let i = 0; i < PTS.length; i++) {
    const env = {};
    [...vars].forEach((v, j) => (env[v] = Q(...PTS[(i + 5 * j) % PTS.length])));
    const x = evalTree(a, env), y = evalTree(b, env);
    if (!x || !y) continue;
    if (!eqQ(x, y)) return false;
    ok++;
  }
  return ok >= 9;
}

// ============ SESTAVI ENAČBO: logika ============
// Trditev naloge z mestom odgovora: »7 · 8« → »7 · 8 = 56«, »? + 1 = 5« → »4 + 1 = 5«.
function stated(q) {
  const p = q.q.indexOf("?");
  if (p >= 0) return { s: q.q.slice(0, p) + q.a + q.q.slice(p + 1), at: p, end: p + q.a.length };
  if (/^[a-zA-Z(]{0,3}\s?[=<>≤≥]/.test(q.a)) return null; // odgovor »x = 2«, »x ≤ 3«
  const s = `${q.q} = ${q.a}`;
  return { s, at: q.q.length + 3, end: s.length };
}
// Naloga za Sestavi enačbo ali null. Dve obliki:
// - expr: odgovor je izraz z vsaj dvema členoma (x² − 13x + 40, (x − 9)(x + 9), y = −4x − 7, 2 · 3 · 5): učenec
//   ga sestavi; oklepaji, »·«, »:« in »y =« so že napisani, prazna mesta so členi ter + in −.
// - blank: odgovor je eno število in naloga je račun (7 · 8, √49, 3/4 + 1/8, ? + 1 = 5): nekaj števil (na 3.
//   stopnji tudi računski znak) v pravilni enačbi je praznih; vsaka pravilna enačba iz ploščic šteje.
export function tilesModel(q) {
  if (!q || !q.q || !q.a || isCode(q)) return null;
  const ex = exprModel(q);
  if (ex) return ex;
  const st = stated(q);
  if (!st || (st.s.match(/=/g) || []).length !== 1) return null;
  // potenca je del ploščice le, če je del odgovora (2⁹ · 2² = 2¹¹), sicer prazno mesto pod njo (__² = 225)
  for (const inTile of [false, true]) {
    const toks = lex(st.s, inTile);
    if (!toks) return null;
    const ans = toks.findIndex((t) => t.at === st.at);
    if (ans < 0 || toks[ans].k !== "n" || toks[ans].end !== st.end) continue;
    const tree = parseStatement(toks);
    const vars = varsOf(toks);
    if (!tree || !same(tree[0], tree[1], vars)) return null; // generator misli drugače (npr. 180 + 20 %)
    const nums = toks.map((t, i) => (t.k === "n" ? i : -1)).filter((i) => i >= 0);
    // nekaj mora biti za izračunati (4/8 = 1/2 je le drug zapis)
    if (nums.length < 2 || !toks.some((t) => ["op", "sup", "root", "pct", "neg", "|(", "!"].includes(t.k))) return null;
    return { mode: "blank", s: st.s, toks, ans, nums, vars, inTile };
  }
  return null;
}
function exprModel(q) {
  const m = /^y\s?=\s?/.exec(q.a);
  const pre = m ? m[0] : "";
  const body = q.a.slice(pre.length);
  const toks = lex(body, true);
  if (!toks || toks.some((t) => t.k === "=")) return null;
  const slots = toks.map((t, i) => (t.k === "n" || (t.k === "op" && (t.f === "add" || t.f === "sub")) ? i : -1)).filter((i) => i >= 0);
  const terms = slots.filter((i) => toks[i].k === "n").length;
  if (terms < 2 || slots.length > 9) return null;
  const tree = parseExpr(toks);
  const vars = varsOf(toks);
  if (!tree || (!vars.size && !evalTree(tree))) return null;
  if (vars.size && !same(tree, tree, vars)) return null; // vsaj 9 točk, kjer je izraz določen
  // »1(x + 8)« ni naloga (odgovor je že napisan); »−1(x + 4)« igra pokaže kot »−(x + 4)« (leadText)
  if (/(^|[^\d,.\/−])1\(/.test(q.q)) return null;
  return { mode: "expr", pre, s: body, toks, slots, vars, tree, factored: factored(tree) };
}
// Razstavljen odgovor (vsota v produktu, količniku ali potenci: 6(x + 3), (x − 6)(x + 6)): enakovreden izraz
// iz drugih členov ni nujno razstavljen do konca (3(2x + 6)), zato mora uporabiti iste člene (predznak je lahko drug).
function factored(a, inside = false) {
  if (!a || typeof a !== "object") return false;
  if (a.t === "bin") {
    if ((a.f === "add" || a.f === "sub") && inside) return true;
    const deeper = inside || a.f === "mul" || a.f === "div";
    return factored(a.a, deeper) || factored(a.b, deeper);
  }
  return factored(a.a, inside || a.t === "pow" || a.t === "powe");
}
const leadText = (s) => s.replace(/(^|[^\d,.\/])−1\(/g, `$1${MINUS}(`);

// Bližnje napačne vrednosti za ploščico (tipične napake: ±1, ±10, ×10, obrnjen ulomek, drug predznak).
function nearTiles(t, negOk) {
  const out = [];
  const sgn = (neg, s) => (neg ? MINUS : "") + s;
  const D = decSep();
  const sup = (k) => String(k).replace("-", "⁻").replace(/\d/g, (d) => SUPS[d]);
  if (t.v) {
    const c = t.int == null ? 1 : +t.int;
    const vp = t.v + (t.p !== 1 ? sup(t.p) : "");
    const co = (k) => (k === 1 ? "" : String(k));
    out.push(sgn(t.neg, `${co(c + 1)}${vp}`));
    if (c > 1) out.push(sgn(t.neg, `${co(c - 1)}${vp}`));
    out.push(sgn(!t.neg, `${co(c)}${vp}`));
    if (t.p > 1) out.push(sgn(t.neg, `${co(c)}${t.v}${t.p - 1 > 1 ? sup(t.p - 1) : ""}`));
    return out;
  }
  if (t.pw !== 1) {
    // potenca na ploščici (2⁹): drug eksponent ali druga osnova
    const b = `${t.int}${t.dec != null ? D + t.dec : ""}`;
    out.push(sgn(t.neg, `${b}${sup(t.pw + 1)}`), sgn(t.neg, `${b}${sup(t.pw * 2)}`));
    if (t.pw - 1 > 1) out.push(sgn(t.neg, `${b}${sup(t.pw - 1)}`));
    if (t.dec == null) out.push(sgn(t.neg, `${+t.int + 1}${sup(t.pw)}`));
    return out;
  }
  if (t.den != null) {
    const n = +t.int, d = +t.den;
    out.push(sgn(t.neg, `${n + 1}/${d}`), sgn(t.neg, `${d}/${n}`), sgn(t.neg, `${n}/${d + 1}`));
    if (n > 1) out.push(sgn(t.neg, `${n - 1}/${d}`));
    return out;
  }
  const p = (t.dec || "").length, m = BigInt(t.int + (t.dec || ""));
  // vrednost s predznakom kot celo število v enotah zadnjega mesta
  const v = t.neg ? -m : m;
  const mk = (vv, pp) => {
    const neg = vv < 0n;
    let s = String(babs(vv)).padStart(pp + 1, "0");
    if (pp > 0) s = `${s.slice(0, -pp)}${D}${s.slice(-pp)}`.replace(/0+$/, "").replace(/[,.]$/, "");
    return (neg ? MINUS : "") + s;
  };
  out.push(mk(v + 1n, p), mk(v - 1n, p));
  if (p === 0) {
    out.push(mk(v + 10n, 0), mk(v - 10n, 0));
    if (babs(v) < 1000n) out.push(mk(v * 10n, 0));
  } else {
    out.push(mk(v, p - 1 || 0).replace(/^(−?)0+(?=\d)/, "$1"), mk(v, p + 1));
  }
  if (negOk && v !== 0n) out.push(mk(-v, p));
  // števila brez smisla (−0, 05) ven; negativna samo, če jih naloga že ima
  return out.filter((s) => (negOk || !s.startsWith(MINUS)) && !/^−?0\d/.test(s) && s !== `${MINUS}0`);
}
const tileVal = (s, inTile) => {
  const t = lex(s, inTile);
  if (!t || t.length !== 1 || t[0].k !== "n") return null;
  const a = { t: "n", tok: t[0] };
  return [2n, 3n].map((x) => evalTree(a, Object.fromEntries([...VARS].map((v, j) => [v, Q(x + 5n * BigInt(j))])))).map((v) => (v ? `${v.n}/${v.d}` : "?")).join("|");
};
// Ploščice za nalogo: prazna mesta (slots), ploščice v pladnju (tiles) in računski znaki, ki se ne porabijo
// (stamps). Sestavljen odgovor preveri check(fill), fill = besedilo na vsakem mestu.
export function tilesTask(q, tier = 1, rnd = Math.random) {
  const M = tilesModel(q);
  if (!M) return null;
  const inTile = M.mode === "expr" || M.inTile;
  let slotIdx, extra = [];
  if (M.mode === "expr") slotIdx = M.slots;
  else {
    const others = M.nums.filter((i) => i !== M.ans);
    let blank = tier === 1 || others.length < 2 ? [M.ans, pickR(others, rnd)] : shuffleR(others, rnd).slice(0, 2);
    if (tier === 3) {
      const ops = M.toks.map((t, i) => (t.k === "op" && "+−·:".includes(t.s) ? i : -1)).filter((i) => i >= 0);
      if (ops.length) blank.push(pickR(ops, rnd));
      else if (!blank.includes(M.ans)) blank.push(M.ans);
    }
    slotIdx = blank.sort((a, b) => a - b);
    // napačni odgovori iz generatorja so tipične napake: ploščice na mestu odgovora
    if (blank.includes(M.ans)) for (const w of q.w || []) if (tileVal(w, false)) extra.push(w);
  }
  const slots = slotIdx.map((i) => ({ i, kind: M.toks[i].k === "op" ? "o" : "t", s: M.toks[i].s }));
  const canon = slots.filter((s) => s.kind === "t").map((s) => s.s);
  // drugi napačni odgovori (expr): členi, ki jih pravilni odgovor nima
  if (M.mode === "expr") {
    for (const w of q.w || []) {
      const wt = lex(w.slice(M.pre && w.startsWith(M.pre) ? M.pre.length : 0), true);
      if (wt) for (const t of wt) if (t.k === "n") extra.push(t.s);
    }
  }
  const negOk = M.toks.some((t) => t.neg) || (q.w || []).some((w) => w.includes(MINUS));
  const near = shuffleR(slots.filter((s) => s.kind === "t").flatMap((s) => nearTiles(M.toks[s.i], negOk)), rnd);
  const vals = new Set(canon.map((s) => tileVal(s, inTile)));
  const picked = [];
  for (const s of [...shuffleR(extra, rnd), ...near]) {
    if (picked.length >= [2, 3, 3][tier - 1]) break;
    const v = tileVal(s, inTile);
    if (!v || canon.includes(s) || picked.includes(s) || vals.has(v)) continue;
    picked.push(s);
    vals.add(v);
  }
  const tiles = shuffleR([...canon, ...picked], rnd).map((s) => ({ s, used: false }));
  const opSlot = slots.find((s) => s.kind === "o");
  const stamps = !opSlot ? [] : M.mode === "expr" ? ["+", MINUS] : ["+", MINUS, "·", ":"];
  // besedilo med praznimi mesti
  const src = M.s;
  const items = [];
  let at = 0;
  for (const [k, s] of slots.entries()) {
    const tk = M.toks[s.i];
    if (tk.at > at) items.push({ fixed: src.slice(at, tk.at) });
    items.push({ slot: k });
    at = tk.end;
  }
  if (at < src.length) items.push({ fixed: src.slice(at) });
  // ploščica je celota: negativno število ali ulomek pred potenco dobi oklepaj ((−5)², (1/2)⁻¹), negativen člen
  // za računskim znakom tudi (6 + (−5x), 9 : (−9), ne »6 + −5x«)
  const unit = (k, x) => {
    if (x == null || slots[k].kind !== "t") return x;
    const nx = M.toks[slots[k].i + 1], pv = M.toks[slots[k].i - 1];
    const pow = (x.startsWith(MINUS) || x.includes("/")) && nx && (nx.k === "sup" || (nx.k === "op" && nx.f === "pow"));
    return pow || (x.startsWith(MINUS) && pv?.k === "op") ? `(${x})` : x;
  };
  const fill = (f) => {
    let out = "", a = 0;
    slots.forEach((s, k) => {
      const tk = M.toks[s.i];
      out += src.slice(a, tk.at) + (unit(k, f[k]) ?? "…");
      a = tk.end;
    });
    return out + src.slice(a);
  };
  // naloga v besedilu (expr): »30 = ?« dobi odgovor na mesto »?«, sicer naloga nad odgovorom
  const embed = M.mode === "expr" && /=\s*\?/.test(q.q);
  const lead = M.mode === "expr" && !embed ? leadText(q.q) : "";
  const head = M.mode === "expr" ? (embed ? q.q.slice(0, q.q.indexOf("?")) : M.pre || "= ") : "";
  const tail = embed ? q.q.slice(q.q.indexOf("?") + 1) : "";
  if (head.trim()) items.unshift({ fixed: head });
  if (tail.trim()) items.push({ fixed: tail });
  const whole = (f) => (M.mode === "expr" ? (embed ? `${head}${M.pre}${fill(f)}${tail}` : `${lead} ${M.pre ? "⇒" : "="} ${M.pre}${fill(f)}`) : fill(f));
  const check = (f) => {
    if (f.length !== slots.length || f.some((x) => x == null)) return { ok: false, full: false };
    const built = fill(f);
    const toks = lex(built, inTile);
    if (M.mode === "expr") {
      const tree = toks && parseExpr(toks);
      const used = f.filter((_, k) => slots[k].kind === "t");
      const key = (a, abs) => a.map((s) => (abs ? s.replace(/^−/, "") : s)).sort().join("|");
      const ok = !!tree && same(tree, M.tree, M.vars) && (M.vars.size > 0 && !M.factored ? true : key(used, M.vars.size > 0) === key(canon, M.vars.size > 0));
      return { ok, full: true, text: whole(f) };
    }
    const tree = toks && parseStatement(toks);
    const ok = !!tree && same(tree[0], tree[1], M.vars);
    // brez spremenljivk: vrednosti obeh strani (napaka ima velikost)
    const sides = tree && !M.vars.size ? tree.map((x) => evalTree(x)) : null;
    return { ok, full: true, text: built, sides: sides && sides.every(Boolean) ? sides : null };
  };
  return { mode: M.mode, slots, tiles, stamps, items, lead, canon: slots.map((s) => s.s), right: whole(slots.map((s) => s.s)), fill, whole, check };
}
// Vrednost ulomka kot besedilo (za »leva stran je 54, desna 56«).
export const qText = (v) => {
  if (!v) return "?";
  if (v.d === 1n) return fmt(Number(v.n));
  const x = qnum(v);
  if (10n ** 6n % v.d === 0n || (2n ** 20n * 5n ** 20n) % v.d === 0n) return fmt(x);
  return `${v.n < 0n ? MINUS : ""}${babs(v.n)}/${v.d}`;
};

// ============ RAZVRSTI PO VELIKOSTI: logika ============
const close = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
// Vrednost ponujene možnosti: 3/4, 0,75, 45 %, 4,05 €, √8, 3√2, −√5, 2⁵.
export function cardValue(s) {
  const r = readNumber(s);
  if (r) return { v: r.v, unit: `${r.pre}|${r.unit.trim()}`, plain: r.kind !== "frac" };
  const t = lex(s);
  if (!t || varsOf(t).size) return null;
  const tree = parseExpr(t);
  const v = tree && evalTree(tree, {}, FL);
  return v == null ? null : { v, unit: "|", plain: false };
}
const SIZE_W = /največ|najmanj|largest|smallest|greatest|least|biggest|highest|lowest/i;
// Kartice iz ene naloge: naloga z izbiro (»Največje?«) da vse ponujene vrednosti; kratek račun (7 · 8, √49,
// 3/4 + 1/8) da eno kartico z vrednostjo odgovora. Sicer null (besedilne naloge, enote, več števil v odgovoru).
export function orderItems(q) {
  if (!q || !q.q || !q.a || isCode(q)) return null;
  if (isPick(q)) {
    // le vprašanja o velikosti (največje, najmanjše), ne o deljivosti ali sodih številih
    if (!SIZE_W.test(q.q)) return null;
    const items = [q.a, ...(q.w || [])].map((s) => ({ s, ...cardValue(s) }));
    if (items.length < 3 || items.some((x) => x.v == null) || new Set(items.map((x) => x.unit)).size !== 1) return null;
    for (let i = 0; i < items.length; i++) for (let j = 0; j < i; j++) if (close(items[i].v, items[j].v)) return null;
    return { kind: "pick", unit: items[0].unit, items };
  }
  const s = q.q.replace(/\s*=\s*\?\s*$/, "").trim();
  if (s.length > 18 || /[?=]/.test(s)) return null;
  const r = readNumber(q.a);
  if (!r || r.pre || r.unit.trim()) return null;
  const t = lex(s);
  if (!t || varsOf(t).size || !t.some((x) => x.k !== "n" || x.den != null)) return null;
  const tree = parseExpr(t);
  if (!tree) return null;
  // vrednost računa na kartici mora biti odgovor naloge (varnost: generator in igra bereta enako)
  const ex = evalTree(tree);
  const want = Q(BigInt(r.n), BigInt(r.d));
  if (ex ? !eqQ(ex, want) : !close(evalTree(tree, {}, FL) ?? NaN, r.v)) return null;
  return { kind: "expr", unit: "|", items: [{ s, v: r.v, a: q.a, frac: r.kind === "frac" }] };
}
export const ORDER_N = [4, 5, 6];
// Krog igre: 4–6 kartic z različnimi vrednostmi, smer (1 naraščajoče, −1 padajoče), pravilni vrstni red (right:
// indeksi kartic) in razkrite vrednosti (val). Na 3. stopnji so vrednosti čim bližje (najožje okno).
export function orderRound(q, ask, tier = 1, rnd = Math.random) {
  const first = orderItems(q);
  if (!first) return null;
  const n = ORDER_N[tier - 1] || 4;
  const pool = [];
  const add = (o) => {
    if (!o || o.kind !== first.kind || o.unit !== first.unit) return;
    for (const it of o.items) if (!pool.some((p) => p.s === it.s || close(p.v, it.v))) pool.push(it);
  };
  add(first);
  const want = tier === 3 ? n + 4 : n;
  for (let i = 0; i < 30 && pool.length < want; i++) add(orderItems(ask()));
  if (pool.length < 4) return null;
  let cards;
  if (pool.length <= n) cards = pool;
  else if (tier === 3) {
    const s = [...pool].sort((a, b) => a.v - b.v);
    const spread = (i) => (s[i + n - 1].v - s[i].v) / (Math.abs(s[i + n - 1].v) + Math.abs(s[i].v) + 1e-9);
    const wins = s.slice(0, s.length - n + 1).map((_, i) => i).sort((a, b) => spread(a) - spread(b));
    const w = wins[Math.floor(rnd() * Math.min(2, wins.length))];
    cards = s.slice(w, w + n);
  } else cards = shuffleR(pool, rnd).slice(0, n);
  const dir = tier === 1 ? 1 : rnd() < 0.5 ? 1 : -1;
  for (let k = 0; k < 12; k++) {
    cards = shuffleR(cards, rnd);
    if (!orderOk(cards, cards.map((_, i) => i), dir)) break; // ne že urejeno
  }
  const right = cards.map((_, i) => i).sort((a, b) => dir * (cards[a].v - cards[b].v));
  // razkrita vrednost: odgovor računa (in decimalno, če je ulomek) ali decimalni zapis ulomka, korena
  let places = 2;
  while (places < 4 && new Set(cards.map((c) => Math.round(c.v * 10 ** places))).size < cards.length) places++;
  const dec = (v) => {
    // točno, če ima največ 3 decimalna mesta (1/8 = 0,125), sicer zaokroženo
    for (let k = places; k <= 3; k++) if (Math.abs(Math.round(v * 10 ** k) / 10 ** k - v) < 1e-12) return `= ${fmt(Math.round(v * 10 ** k) / 10 ** k)}`;
    return `≈ ${fmt(Math.round(v * 10 ** places) / 10 ** places)}`;
  };
  for (const c of cards) c.val = c.a != null ? `= ${c.a}${c.frac ? ` ${dec(c.v)}` : ""}` : c.plain ? "" : dec(c.v);
  return { dir, cards, right };
}
// Ali je zaporedje kartic (indeksi) urejeno v smeri dir.
export function orderOk(cards, seq, dir) {
  for (let i = 1; i < seq.length; i++) if (dir * (cards[seq[i]].v - cards[seq[i - 1]].v) <= 0) return false;
  return true;
}
// Pojem ustreza igri, če se na vsaki stopnji iz njegovih nalog sestavi cel krog.
const roundFits = (c, tier) => {
  const ask = () => {
    for (let i = 0; i < 40; i++) {
      let q = null;
      try {
        q = c.gen(tier);
      } catch {}
      if (orderItems(q)) return q;
    }
    return null;
  };
  const q = ask();
  return !!q && !!orderRound(q, ask, tier);
};

export const fitNow2 = {
  tiles: fitter((q) => !!tilesModel(q), ":tiles", (c, tier) => {
    // na vsaki stopnji se da sestaviti nalogo s praznimi mesti
    for (let i = 0; i < 4; i++) {
      let q = null;
      try {
        q = c.gen(tier);
      } catch {}
      if (tilesModel(q)) return !!tilesTask(q, tier);
    }
    return false;
  }),
  order: fitter((q) => !!orderItems(q), ":order", roundFits),
};

// ---------- skupno: prazna mesta in ploščice (vleci ali tapni) ----------
// Ploščica v pladnju ali na mestu: pobrana z dotikom; kratek dotik = tap (na naslednje prazno mesto ali nazaj),
// vlečenje = na mesto pod prstom (zamenja ploščico, ki je bila tam). Kliče eng.tap/eng.drop.
const near = (p, r, m = 0) => p.x >= r.x - m && p.x <= r.x + r.w + m && p.y >= r.y - m && p.y <= r.y + r.h + m;
function dragger(eng) {
  let d = null;
  return {
    get: () => d,
    pointer(type, p) {
      if (type === "down") {
        const hit = eng.hit(p);
        d = hit ? { ...hit, x: p.x, y: p.y, sx: p.x, sy: p.y, moved: false } : null;
      } else if (type === "move" && d) {
        d.x = p.x;
        d.y = p.y;
        if (Math.hypot(p.x - d.sx, p.y - d.sy) > 9) d.moved = true;
      } else if (type === "up" && d) {
        const was = d;
        d = null;
        if (!was.moved) eng.tap(was);
        else eng.drop(was, p);
      }
    },
    clear: () => (d = null),
  };
}
// Ploščica: kremasta kocka s temnim robom (ali modra za računski znak); ghost: le obris praznega mesta.
function tileBox(G, g, r, text, size, { fill = "#fef3c7", ghost = false, ring = null, lift = 0 } = {}) {
  if (ghost) {
    G.rr(r.x + 2, r.y + 2, r.w - 4, r.h - 4, 10);
    g.setLineDash([5, 5]);
    g.lineWidth = 2;
    g.strokeStyle = "rgba(255,255,255,0.45)";
    g.stroke();
    g.setLineDash([]);
    return;
  }
  const y = r.y - lift;
  G.rr(r.x, y + 4, r.w, r.h, 12);
  g.fillStyle = "rgba(27,27,47,0.35)";
  g.fill();
  G.rr(r.x, y, r.w, r.h, 12);
  const grd = g.createLinearGradient(0, y, 0, y + r.h);
  grd.addColorStop(0, "#fff");
  grd.addColorStop(1, fill);
  g.fillStyle = grd;
  g.fill();
  g.lineWidth = 3;
  g.strokeStyle = INK;
  g.stroke();
  G.fit(text, r.x + r.w / 2, y + r.h / 2 + 1, r.w - 10, size, { color: INK, weight: 900, min: 11 });
  if (ring) {
    G.rr(r.x - 4, y - 4, r.w + 8, r.h + 8, 15);
    g.lineWidth = 3;
    g.strokeStyle = ring;
    g.stroke();
  }
}
// Vrstice ploščic (sredinsko, z razmikom); vrne pravokotnike in spodnji rob.
function flow(widths, x0, w, y, h, gap) {
  const rects = [];
  let row = [], rw = 0;
  const flush = () => {
    let x = x0 + (w - rw) / 2;
    for (const [i, ww] of row) {
      rects[i] = { x, y, w: ww, h };
      x += ww + gap;
    }
    y += h + gap;
    row = [];
    rw = 0;
  };
  widths.forEach((ww, i) => {
    if (row.length && rw + gap + ww > w) flush();
    rw += (row.length ? gap : 0) + ww;
    row.push([i, ww]);
  });
  if (row.length) flush();
  return { rects, bottom: y - gap };
}
// Rakunka Iva (izvirni lik): siva glava s temno masko, ušesa, ključ v roki.
function iva(g, x, y, r, mood, key = true) {
  g.lineWidth = 3;
  g.strokeStyle = INK;
  for (const s of [-1, 1]) {
    g.beginPath();
    g.moveTo(x + s * r * 0.85, y - r * 0.55);
    g.lineTo(x + s * r * 0.55, y - r * 1.15);
    g.lineTo(x + s * r * 0.2, y - r * 0.8);
    g.closePath();
    g.fillStyle = "#64748b";
    g.fill();
    g.stroke();
  }
  // telo
  g.beginPath();
  g.ellipse(x, y + r * 1.2, r * 0.75, r * 0.65, 0, 0, Math.PI * 2);
  g.fillStyle = "#94a3b8";
  g.fill();
  g.stroke();
  circle(g, x, y, r, "#94a3b8", 3);
  // maska
  g.beginPath();
  g.ellipse(x, y - r * 0.12, r * 0.82, r * 0.3, 0, 0, Math.PI * 2);
  g.fillStyle = "#334155";
  g.fill();
  circle(g, x, y + r * 0.35, r * 0.3, "#e2e8f0", 0);
  face(g, x, y, r * 0.95, mood);
  if (key) {
    // ključ
    const kx = x + r * 1.1, ky = y + r * 1.05;
    g.lineWidth = 4;
    g.strokeStyle = "#a16207";
    g.beginPath();
    g.arc(kx, ky - r * 0.35, r * 0.25, 0, Math.PI * 2);
    g.moveTo(kx, ky - r * 0.1);
    g.lineTo(kx, ky + r * 0.6);
    g.moveTo(kx, ky + r * 0.45);
    g.lineTo(kx + r * 0.22, ky + r * 0.45);
    g.stroke();
  }
}
// Ključavnica nad tablo: zaprta ali odprta (stremen dvignjen).
function padlock(G, g, x, y, s, open, bad) {
  g.lineWidth = s * 0.22;
  g.strokeStyle = INK;
  g.beginPath();
  const lift = open ? s * 0.45 : 0;
  g.arc(x, y - s * 0.35 - lift, s * 0.42, Math.PI, 0);
  g.lineTo(x + s * 0.42, y - lift * 0.2);
  g.moveTo(x - s * 0.42, y - s * 0.35 - lift);
  g.lineTo(x - s * 0.42, y - (open ? lift + s * 0.05 : 0));
  g.stroke();
  G.rr(x - s * 0.65, y - s * 0.1, s * 1.3, s * 0.95, s * 0.18);
  g.fillStyle = open ? "#22c55e" : bad ? "#ef4444" : "#f59e0b";
  g.fill();
  g.lineWidth = 3;
  g.stroke();
  circle(g, x, y + s * 0.3, s * 0.12, INK, 0);
}

// ============ SESTAVI ENAČBO: Iva odklepa vrata ============
// tipka na tipkovnici → ključ ploščice (x² = x2, − = -, 0,5 = 0.5)
const keyOf = (s) => String(s).replace(/−|⁻/g, "-").replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (c) => SUPS.indexOf(c)).replace(/,/g, ".").replace(/·/g, "*").toLowerCase();
const STAMP_KEY = { "+": "+", "-": MINUS, "*": "·", x: null, ":": ":", "/": ":" };
export const tiles = {
  id: "tiles",
  added: "2026-11-04", // oznaka »Novo« 7 dni (docs/igre-tedensko.md)
  story: {
    sl: [["Stara vrata", "Rakunka Iva je ključarka. Vrata se odprejo le, ko je enačba na ključavnici pravilna."], ["Skrivni hodnik", "Med ploščicami so zdaj tudi napačne. Iva izbere prave."], ["Stolp z zobniki", "Ključavnice so vse bolj zapletene. Iva preveri vsak člen."], ["Zakladnica", "Še zadnja ključavnica in Iva odpre zakladnico!"]],
    en: [["The old door", "Iva the raccoon is a locksmith. A door only opens when the equation on its lock is true."], ["Secret corridor", "Now some of the tiles are wrong. Iva picks the right ones."], ["The gear tower", "The locks get trickier. Iva checks every term."], ["The treasury", "One last lock and Iva opens the treasury!"]],
  },
  icon: "key-round",
  colors: ["#3f3f46", "#a1a1aa"],
  options: 4,
  ui: true,
  // čas za razmislek (mirna igra); izraz z več členi ima več časa
  timer: (G) => [50, 60, 75][G.tier - 1] || 60,
  fits: fitList("tiles"),
  accept: (q) => !!tilesModel(q),
  create(G) {
    const t = G.t;
    let T = null, fill = [], own = [], hist = [], phase = "play", res = null, cur = 0, kbd = false, buf = "", shake = 0, glow = 0, L = null, dirty = true;
    G.ui.innerHTML = `<div class="gm-tl">${keyBtn("Backspace", icon("delete"), t("games.undo"), "gm-key-del")}${keyBtn("Confirm", `${icon("check")}<span>${esc(t("games.confirm"))}</span>`, "", "gm-key-ok")}</div><span class="sr-only" aria-live="polite"></span>`;
    const said = G.ui.querySelector("[aria-live]");
    const items = () => (T ? [...T.tiles.map((x, i) => ({ type: "t", i, s: x.s })), ...T.stamps.map((s, i) => ({ type: "o", i, s }))] : []);
    const free = (it) => it.type === "o" || !T.tiles[it.i].used;
    const say = (extra = "") => T && (said.textContent = `${extra ? `${extra}. ` : ""}${t("games.yourAnswer")}: ${T.whole(fill)}`);
    const live = () => T && phase === "play" && !G.waiting;
    // naslednje prazno mesto te vrste (po vrsti branja)
    const nextSlot = (kind) => T.slots.findIndex((s, k) => s.kind === kind && fill[k] == null);
    // ploščica, ki jo je mogoče postaviti (ostalo je prazno mesto njene vrste)
    const usable = (it) => free(it) && nextSlot(it.type) >= 0;
    function moveCur(step, keep) {
      const all = items(), n = all.length;
      if (!n) return;
      for (const ok of [usable, free]) {
        for (let s = keep ? 0 : 1; s <= n; s++) {
          const j = (cur + step * s + n * 2) % n;
          if (ok(all[j])) return void (cur = j);
        }
      }
    }
    function put(it, k = nextSlot(it.type)) {
      if (!live() || k < 0 || T.slots[k].kind !== it.type || !free(it)) return false;
      if (fill[k] != null) take(k);
      fill[k] = it.s;
      own[k] = it;
      if (it.type === "t") T.tiles[it.i].used = true;
      hist = hist.filter((x) => x !== k).concat(k);
      G.sound("pop");
      say();
      // kazalec na naslednjo ploščico, ki jo je še kam postaviti
      moveCur(1, true);
      return true;
    }
    function take(k) {
      if (fill[k] == null) return;
      if (own[k]?.type === "t") T.tiles[own[k].i].used = false;
      fill[k] = null;
      own[k] = null;
      hist = hist.filter((x) => x !== k);
      say();
    }
    const undo = () => live() && hist.length && take(hist[hist.length - 1]);
    function confirm() {
      if (!live()) return;
      if (fill.some((x) => x == null)) {
        G.hint?.(t("games.fillAll"));
        G.sound("pop");
        return;
      }
      res = T.check(fill);
      phase = "done";
      G.stopTimer();
      if (res.ok) {
        glow = 1;
        G.answer(true, G.W / 2, L ? L.by + L.bh / 2 : G.H / 3, { note: res.text, delay: 1.3 });
      } else {
        shake = 0.5;
        // ločilo »—«, ne »·«: za računom bi se »·« bral kot množenje
        const sides = res.sides && !eqQ(res.sides[0], res.sides[1]) ? ` — ${t("games.e.tiles.sides", { l: iso(qText(res.sides[0])), r: iso(qText(res.sides[1])) })}` : "";
        G.answer(false, G.W / 2, L ? L.by + L.bh / 2 : G.H / 3, { note: `${t("games.correctWas", { a: iso(T.right) })}${sides}`, delay: 3 });
      }
    }
    // tipkanje: števke in črke iščejo ploščico (13x = 1, 3, x), znak gre na prazno mesto za znak
    function type(c) {
      if (!live()) return false;
      const all = items().filter((it) => it.type === "t" && free(it));
      const keys = all.map((it) => keyOf(it.s));
      const cand = buf + c;
      const op = STAMP_KEY[c];
      const firstEmpty = fill.findIndex((x) => x == null);
      if (!buf && op && T.stamps.includes(op) && firstEmpty >= 0 && T.slots[firstEmpty].kind === "o") return put({ type: "o", s: op, i: T.stamps.indexOf(op) }), true;
      if (keys.some((k) => k.startsWith(cand))) {
        buf = cand;
        const exact = keys.indexOf(cand);
        if (exact >= 0 && !keys.some((k) => k !== cand && k.startsWith(cand))) {
          buf = "";
          put(all[exact]);
        }
        return true;
      }
      if (buf && keys.includes(buf)) {
        put(all[keys.indexOf(buf)]);
        buf = "";
        return type(c);
      }
      buf = "";
      if (op && T.stamps.includes(op) && nextSlot("o") >= 0) return put({ type: "o", s: op, i: T.stamps.indexOf(op) }), true;
      return keys.some((k) => k.startsWith(c)) ? type(c) : false;
    }
    // razporeditev: tabla z nalogo in praznimi mesti, pod njo pladenj s ploščicami
    function layout() {
      const tall = G.H > G.W * 1.25;
      const pad = 12, bw = Math.min(G.W - 2 * pad, 620), bx = (G.W - bw) / 2, by = 30;
      // računalnik: večje ploščice (prizor je visok dovolj), telefon ležeče ostane pri 52
      for (let th = tall ? 58 : G.H > 480 ? 64 : 52; ; th -= 4) {
        const fs = Math.round(th * 0.44);
        const tw = (s, f) => G.tw(s, f, 900);
        let tpl = null;
        for (let f = fs; f >= 14 && !tpl; f -= 2) {
          const termW = Math.max(th * 0.95, ...T.tiles.map((x) => tw(x.s, f) + 22));
          const opW = th * 0.8;
          const els = T.items.map((it) => (it.fixed != null ? { fixed: it.fixed.trim(), w: tw(it.fixed.trim(), f) } : { slot: it.slot, w: T.slots[it.slot].kind === "o" ? opW : termW })).filter((e) => e.slot != null || e.fixed);
          const lines = [[]];
          let lw = 0;
          for (const e of els) {
            if (lines[lines.length - 1].length && lw + 6 + e.w > bw - 24) {
              lines.push([]);
              lw = 0;
            }
            lw += (lw ? 6 : 0) + e.w;
            lines[lines.length - 1].push(e);
          }
          if (lines.length <= (tall ? 3 : 2) || f <= 14) tpl = { f, lines, termW, opW };
        }
        const lf = clamp(Math.round(th * 0.4), 15, 24);
        const leadH = !T.lead ? 0 : /\p{L}{3}/u.test(T.lead) ? lf * 2.6 : lf * 1.5;
        const bh = 16 + leadH + tpl.lines.length * (th + 10) + 6;
        // pladenj: ploščice in znaki
        const its = items();
        const ws = its.map((it) => Math.max(it.type === "o" ? th : th * 0.95, tw(it.s, fs) + 24));
        const ty = by + bh + 18;
        const terms = flow(ws.slice(0, T.tiles.length), pad, G.W - 2 * pad, ty, th, 10);
        const stamps = T.stamps.length ? flow(ws.slice(T.tiles.length), pad, G.W - 2 * pad, terms.bottom + 12, th, 10) : { rects: [], bottom: terms.bottom };
        if (stamps.bottom + 10 <= G.H || th <= 40) {
          // mesta na tabli
          const slots = [];
          let y = by + 12 + leadH;
          const fixed = [];
          for (const line of tpl.lines) {
            const w = line.reduce((a, e, i) => a + e.w + (i ? 6 : 0), 0);
            let x = G.W / 2 - w / 2;
            for (const e of line) {
              if (e.slot != null) slots[e.slot] = { x, y: y + 2, w: e.w, h: th };
              else fixed.push({ s: e.fixed, x: x + e.w / 2, y: y + 2 + th / 2 });
              x += e.w + 6;
            }
            y += th + 10;
          }
          // visok zaslon: tablo in pladenj spusti proti sredini (spodaj ostane prostor za Ivo in vrstico za tipkanje)
          const dy = tall ? Math.round(clamp((G.H - stamps.bottom - 150) * 0.4, 0, 140)) : 0;
          const down = (r) => ({ ...r, y: r.y + dy });
          return { tall, th, fs, f: tpl.f, lf, bx, by: by + dy, bw, bh, leadH, slots: slots.map(down), fixed: fixed.map(down), tray: [...terms.rects, ...stamps.rects].map(down), trayTop: ty - 8 + dy, trayBottom: stamps.bottom + 8 + dy };
        }
      }
    }
    const drag = dragger({
      hit(p) {
        if (!live() || !L) return null;
        const its = items();
        for (let i = 0; i < its.length; i++) if (free(its[i]) && near(p, L.tray[i], 4)) return { from: "tray", it: its[i] };
        for (let k = 0; k < fill.length; k++) if (fill[k] != null && near(p, L.slots[k], 4)) return { from: "slot", k, it: own[k] };
        return null;
      },
      tap(d) {
        if (d.from === "tray") put(d.it);
        else take(d.k);
      },
      drop(d, p) {
        if (!live()) return;
        const k = L.slots.findIndex((r, k2) => T.slots[k2].kind === d.it.type && near(p, r, 10));
        if (d.from === "tray") {
          if (k >= 0) put(d.it, k);
        } else if (k < 0) take(d.k);
        else if (k !== d.k) {
          // zamenjava med mestoma
          const other = own[k];
          take(d.k);
          if (other) take(k);
          put(d.it, k);
          if (other) put(other, d.k);
        }
      },
    });
    const eng = {
      peek: () => ({ T, fill, phase, res }), // za teste
      headline: () => T && t(T.mode === "expr" ? "games.e.tiles.build" : "games.e.tiles.ask"),
      resize() {
        dirty = true;
      },
      reset() {
        T = null;
        phase = "play";
        said.textContent = "";
      },
      question(q) {
        T = tilesTask(q, G.tier);
        fill = T ? T.slots.map(() => null) : [];
        own = fill.map(() => null);
        hist = [];
        phase = "play";
        res = null;
        cur = 0;
        buf = "";
        glow = 0;
        dirty = true;
        drag.clear();
        if (!T) return "";
        say();
        return `${T.whole(fill)}. ${t("games.e.tiles.pieces")}: ${items().map((x) => x.s).join(", ")}.`;
      },
      timeout() {
        phase = "done";
        res = null;
        return { note: t("games.correctWas", { a: iso(T ? T.right : G.q.a) }), delay: 2.6 };
      },
      update(dt) {
        tick(dt);
        shake = Math.max(0, shake - dt);
        glow = Math.max(0, glow - dt * 0.6);
      },
      pointer(type, p) {
        if (type === "down") kbd = false;
        drag.pointer(type, p);
      },
      key(k, down) {
        const mine = ["ArrowLeft", "ArrowRight", "Enter", " ", "Backspace", "Confirm"].includes(k) || /^[0-9a-zA-Z+\-*/:.,^]$/.test(k);
        if (!down) return mine;
        if (!T) return false;
        if (k === "Confirm") return confirm(), true;
        if (k === "Backspace") {
          if (buf) buf = buf.slice(0, -1);
          else undo();
          return true;
        }
        const all = items();
        if (k === "ArrowLeft" || k === "ArrowRight") {
          kbd = true;
          moveCur(k === "ArrowRight" ? 1 : -1, false);
          said.textContent = all[cur]?.s || "";
          return true;
        }
        if (k === " ") {
          kbd = true;
          if (all[cur] && free(all[cur])) put(all[cur]);
          return true;
        }
        if (k === "Enter") {
          const keys = all.filter((it) => it.type === "t" && free(it));
          const hit = buf && keys.find((it) => keyOf(it.s) === buf);
          buf = "";
          if (hit) put(hit);
          else confirm();
          return true;
        }
        if (mine && k.length === 1) return type(k === "," ? "." : k.toLowerCase()), true;
        return false;
      },
      draw(g) {
        const [top, bot, wall, floor] = chap(G, [["#a8a29e", "#e7e5e4", "#78716c", "#57534e"], ["#475569", "#94a3b8", "#334155", "#1e293b"], ["#92400e", "#fcd34d", "#78350f", "#451a03"], ["#312e81", "#a78bfa", "#4c1d95", "#1e1b4b"]]);
        sky(G, g, top, bot);
        // kamnit zid (mirno ozadje)
        g.strokeStyle = "rgba(255,255,255,0.12)";
        g.lineWidth = 2;
        for (let y = 0, r = 0; y < G.H; y += 34, r++) {
          g.beginPath();
          g.moveTo(0, y);
          g.lineTo(G.W, y);
          for (let x = (r % 2) * 40; x < G.W; x += 80) {
            g.moveTo(x, y);
            g.lineTo(x, y + 34);
          }
          g.stroke();
        }
        if (!T) return;
        if (dirty || !L) {
          L = layout();
          dirty = false;
        }
        const d = drag.get();
        // tabla (vrata s ključavnico)
        const sx = shake > 0 && !G.reduced ? Math.sin(shake * 60) * 4 : 0;
        G.rr(L.bx + sx, L.by, L.bw, L.bh, 16);
        g.fillStyle = "#1e293b";
        g.fill();
        g.lineWidth = 4;
        g.strokeStyle = phase === "done" ? (res?.ok ? "#22c55e" : "#ef4444") : INK;
        g.stroke();
        for (const [ax, ay] of [[0, 0], [1, 0], [0, 1], [1, 1]]) circle(g, L.bx + sx + 10 + ax * (L.bw - 20), L.by + 10 + ay * (L.bh - 20), 3, "#94a3b8", 0);
        if (T.lead) boardText(G, T.lead, G.W / 2 + sx, L.by + 10 + L.leadH / 2, L.bw - 28, L.leadH, L.lf, { color: "#e2e8f0", weight: 800 });
        for (const f of L.fixed) G.fit(f.s, f.x + sx, f.y, L.bw, L.f, { color: "#f8fafc", weight: 900, min: 11 });
        const want = phase === "play" && !d ? fill.findIndex((x) => x == null) : -1;
        L.slots.forEach((r, k) => {
          const rr = { ...r, x: r.x + sx };
          const dragged = d && d.from === "slot" && d.k === k && d.moved;
          if (fill[k] != null && !dragged) {
            const bad = phase === "done" && res && !res.ok;
            tileBox(G, g, rr, fill[k], L.f, { fill: own[k]?.type === "o" ? "#bae6fd" : bad ? "#fecaca" : res?.ok ? "#bbf7d0" : "#fde68a" });
          } else {
            G.rr(rr.x, rr.y, rr.w, rr.h, 10);
            g.fillStyle = "rgba(255,255,255,0.08)";
            g.fill();
            g.setLineDash([6, 5]);
            g.lineWidth = 2.5;
            g.strokeStyle = k === want ? "#fde047" : "#94a3b8";
            g.stroke();
            g.setLineDash([]);
          }
        });
        padlock(G, g, G.W / 2 + sx, L.by - 2, 22, phase === "done" && !!res?.ok, phase === "done" && !res?.ok);
        // pladenj (lesena polica)
        // po odgovoru mora polica objeti obe vrstici (pravilno in tvoje)
        const trayH = Math.max(L.trayBottom - L.trayTop, phase === "play" ? 0 : res && !res.ok ? 112 : 64);
        G.rr(6, L.trayTop, G.W - 12, trayH, 14);
        g.fillStyle = "rgba(120,53,15,0.55)";
        g.fill();
        if (phase === "play") {
          const its = items();
          its.forEach((it, i) => {
            const r = L.tray[i];
            const lifted = d && d.from === "tray" && d.it.type === it.type && d.it.i === it.i && d.moved;
            if (!free(it) || lifted) return tileBox(G, g, r, "", L.fs, { ghost: true });
            tileBox(G, g, r, it.s, L.fs, { fill: it.type === "o" ? "#bae6fd" : "#fde68a", ring: kbd && i === cur ? "#fde047" : null });
          });
          if (buf) pill(G, g, `${buf}…`, G.W / 2, L.trayBottom + 22, G.W * 0.5, 30, "#fff", 18);
        } else {
          // po odgovoru: pravilna enačba (in tvoja, če je bila napačna)
          const y = L.trayTop + 26;
          pill(G, g, `✓ ${T.right}`, G.W / 2, y, G.W - 24, 40, "#bbf7d0", 22);
          if (res && !res.ok) pill(G, g, `✗ ${res.text}`, G.W / 2, y + 50, G.W - 24, 36, "#fecaca", 19);
        }
        // vlečena ploščica pod prstom
        if (d && d.moved) {
          const it = d.it, w = Math.max(L.th * 0.95, G.tw(it.s, L.fs, 900) + 24);
          tileBox(G, g, { x: d.x - w / 2, y: d.y - L.th * 0.75, w, h: L.th }, it.s, L.fs, { fill: it.type === "o" ? "#bae6fd" : "#fde68a", lift: 4 });
        }
        // Iva v kotu, če je prostor
        const room = G.H - L.trayBottom - (buf || phase !== "play" ? 70 : 10);
        if (room > 70) {
          const r = clamp(room * 0.28, 18, 34);
          iva(g, G.W * 0.16, G.H - r * 2.2, r, phase === "done" ? (res?.ok ? 1 : -1) : 0);
        }
        if (glow > 0 && !G.reduced) {
          g.globalAlpha = glow * 0.35;
          g.fillStyle = "#fde047";
          g.fillRect(0, 0, G.W, G.H);
          g.globalAlpha = 1;
        }
      },
    };
    const tick = wireKeys(G, eng);
    return eng;
  },
};

// ============ RAZVRSTI PO VELIKOSTI: bober Brin zlaga hlode ============
// Bober Brin (izvirni lik): rjava glava, zobka, ploščat rep.
function brin(g, x, y, r, mood) {
  g.lineWidth = 3;
  g.strokeStyle = INK;
  g.beginPath();
  g.ellipse(x + r * 1.1, y + r * 1.25, r * 0.9, r * 0.38, -0.3, 0, Math.PI * 2);
  g.fillStyle = "#57534e";
  g.fill();
  g.stroke();
  g.beginPath();
  g.ellipse(x, y + r * 1.1, r * 0.8, r * 0.7, 0, 0, Math.PI * 2);
  g.fillStyle = "#a16207";
  g.fill();
  g.stroke();
  for (const s of [-1, 1]) circle(g, x + s * r * 0.7, y - r * 0.7, r * 0.25, "#854d0e", 3);
  circle(g, x, y, r, "#a16207", 3);
  circle(g, x, y + r * 0.3, r * 0.42, "#fde68a", 0);
  face(g, x, y - r * 0.05, r * 0.9, mood);
  g.fillStyle = "#fff";
  g.fillRect(x - r * 0.14, y + r * 0.52, r * 0.13, r * 0.2);
  g.fillRect(x + r * 0.01, y + r * 0.52, r * 0.13, r * 0.2);
  g.lineWidth = 1.5;
  g.strokeRect(x - r * 0.14, y + r * 0.52, r * 0.13, r * 0.2);
  g.strokeRect(x + r * 0.01, y + r * 0.52, r * 0.13, r * 0.2);
}
// Hlod s številom: lesen pravokotnik s prerezom na levi; druga vrstica je razkrita vrednost.
function log(G, g, r, text, val, { ghost = false, ring = null, mark = 0, lift = 0 } = {}) {
  if (ghost) return tileBox(G, g, r, "", 16, { ghost: true });
  const y = r.y - lift, end = Math.min(r.h * 0.42, 22);
  G.rr(r.x, y + 4, r.w, r.h, r.h / 2.4);
  g.fillStyle = "rgba(27,27,47,0.3)";
  g.fill();
  G.rr(r.x, y, r.w, r.h, r.h / 2.4);
  g.fillStyle = mark > 0 ? "#bbf7d0" : mark < 0 ? "#fecaca" : "#fcd9a8";
  g.fill();
  g.lineWidth = 3;
  g.strokeStyle = INK;
  g.stroke();
  g.beginPath();
  g.ellipse(r.x + end, y + r.h / 2, end * 0.62, r.h / 2 - 4, 0, 0, Math.PI * 2);
  g.fillStyle = "#e7b679";
  g.fill();
  g.lineWidth = 2;
  g.stroke();
  g.beginPath();
  g.ellipse(r.x + end, y + r.h / 2, end * 0.28, r.h / 4 - 2, 0, 0, Math.PI * 2);
  g.stroke();
  const tx = r.x + end * 1.7, tw = r.w - end * 1.7 - (mark ? 26 : 8);
  if (val) {
    const s = Math.min(22, r.h * 0.36);
    G.fit(text, tx + tw / 2, y + r.h * 0.33, tw, s, { color: INK, weight: 900, min: 10 });
    G.fit(val, tx + tw / 2, y + r.h * 0.72, tw, s * 0.78, { color: "#7c2d12", weight: 800, min: 9 });
  } else G.fit(text, tx + tw / 2, y + r.h / 2 + 1, tw, Math.min(26, r.h * 0.44), { color: INK, weight: 900, min: 10 });
  if (mark) G.fit(mark > 0 ? "✓" : "✗", r.x + r.w - 15, y + r.h / 2 + 1, 22, 22, { color: mark > 0 ? "#15803d" : "#b91c1c", weight: 900 });
  if (ring) {
    G.rr(r.x - 4, y - 4, r.w + 8, r.h + 8, r.h / 2);
    g.lineWidth = 3;
    g.strokeStyle = ring;
    g.stroke();
  }
}
export const order = {
  id: "order",
  added: "2026-11-04", // oznaka »Novo« 7 dni (docs/igre-tedensko.md)
  story: {
    sl: [["Potok", "Bober Brin gradi jez. Hlode s števili mora zložiti po vrsti, kot piše na tabli."], ["Mešani hlodi", "Na hlodih so zdaj ulomki, decimalna števila in računi."], ["Deroča reka", "Števila so si vse bližje. Brin jih primerja natančno."], ["Veliki jez", "Še nekaj vrst hlodov in jez bo zdržal!"]],
    en: [["The stream", "Brin the beaver is building a dam. He must stack the numbered logs in order, as the sign says."], ["Mixed logs", "Now the logs carry fractions, decimals and sums."], ["Rushing river", "The numbers get closer and closer. Brin compares them carefully."], ["The great dam", "A few more rows of logs and the dam will hold!"]],
  },
  icon: "arrow-up-narrow-wide",
  colors: ["#713f12", "#d97706"],
  options: 4,
  ui: true,
  timer: (G) => [45, 55, 70][G.tier - 1] || 55,
  fits: fitList("order"),
  accept: (q) => !!orderItems(q),
  create(G) {
    const t = G.t;
    let R = null, slot = [], hist = [], phase = "play", ok = false, cur = 0, kbd = false, L = null, dirty = true, glow = 0;
    G.ui.innerHTML = `<div class="gm-tl">${keyBtn("Backspace", icon("undo-2"), t("games.undo"), "gm-key-del")}${keyBtn("Confirm", `${icon("check")}<span>${esc(t("games.confirm"))}</span>`, "", "gm-key-ok")}</div><span class="sr-only" aria-live="polite"></span>`;
    const said = G.ui.querySelector("[aria-live]");
    const placed = (i) => slot.includes(i);
    const live = () => R && phase === "play" && !G.waiting;
    const say = () => R && (said.textContent = `${t("games.yourAnswer")}: ${slot.map((i) => (i == null ? "…" : R.cards[i].s)).join(R.dir > 0 ? " < " : " > ")}`);
    function put(i, k = slot.indexOf(null)) {
      if (!live() || k < 0 || placed(i)) return;
      if (slot[k] != null) take(k);
      slot[k] = i;
      hist = hist.filter((x) => x !== k).concat(k);
      G.sound("pop");
      say();
      if (placed(cur)) cur = Math.max(0, R.cards.findIndex((_, j) => !placed(j)));
    }
    function take(k) {
      if (slot[k] == null) return;
      slot[k] = null;
      hist = hist.filter((x) => x !== k);
      say();
    }
    function confirm() {
      if (!live()) return;
      if (slot.includes(null)) {
        G.hint?.(t("games.fillAll"));
        G.sound("pop");
        return;
      }
      ok = orderOk(R.cards, slot, R.dir);
      phase = "done";
      G.stopTimer();
      // kartica se v vrstici ne prelomi (presledki v njej so nedeljivi), vrstni red pa ostane od leve proti desni tudi v RTL
      const right = iso(R.right.map((i) => R.cards[i].s.replace(/ /g, "\u00a0")).join(R.dir > 0 ? " < " : " > "));
      if (ok) glow = 1;
      G.answer(ok, L ? L.rx + L.colW / 2 : G.W * 0.75, L ? L.y0 + L.ch : G.H / 3, ok ? { note: right, delay: 1.8 } : { note: t("games.correctWas", { a: right }), delay: 3.6 });
    }
    function layout() {
      const tall = G.H > G.W * 1.25, n = R.cards.length, pad = 10, gap = tall ? 10 : 7;
      const colW = (Math.min(G.W, 760) - 3 * pad) / 2, x0 = (G.W - 2 * colW - pad) / 2;
      const y0 = 34, foot = 34, room = G.H - y0 - foot - (tall ? 70 : 6);
      // telefon ležeče: 6 hlodov mora pasti v prizor (nižji hlodi, a še vedno široki za dotik)
      const ch = clamp((room - (n - 1) * gap) / n, tall ? 40 : 28, tall ? 76 : 62);
      const badge = 26;
      const rows = R.cards.map((_, i) => y0 + i * (ch + gap));
      // RTL (arabščina, perzijščina): kup desno, vrsta z mesti levo, številke mest med njima; števila ostanejo LTR
      const rtl = typeof document !== "undefined" && document.documentElement.dir === "rtl";
      const px = rtl ? x0 + colW + pad : x0, rx = rtl ? x0 : x0 + colW + pad;
      return { tall, n, ch, gap, y0, colW, badge, pool: rows.map((y) => ({ x: px, y, w: colW, h: ch })), slots: rows.map((y) => ({ x: rtl ? rx : rx + badge, y, w: colW - badge, h: ch })), bottom: rows[n - 1] + ch, rx, bx: rtl ? rx + colW - badge / 2 + 1 : rx + badge / 2 - 1 };
    }
    const drag = dragger({
      hit(p) {
        if (!live() || !L) return null;
        for (let i = 0; i < R.cards.length; i++) if (!placed(i) && near(p, L.pool[i], 3)) return { from: "pool", i };
        for (let k = 0; k < slot.length; k++) if (slot[k] != null && near(p, L.slots[k], 3)) return { from: "slot", k, i: slot[k] };
        return null;
      },
      tap(d) {
        if (d.from === "pool") put(d.i);
        else take(d.k);
      },
      drop(d, p) {
        const k = L.slots.findIndex((r) => near(p, r, 8));
        if (d.from === "pool") {
          if (k >= 0) put(d.i, k);
        } else if (k < 0) take(d.k);
        else if (k !== d.k) {
          const other = slot[k];
          slot[k] = d.i;
          slot[d.k] = other ?? null;
          hist = hist.filter((x) => x !== k && x !== d.k).concat(other != null ? [d.k, k] : [k]);
          G.sound("pop");
          say();
        }
      },
    });
    const eng = {
      peek: () => ({ R, slot, phase, ok, cur }), // za teste
      headline: () => R && t(R.dir > 0 ? "games.e.order.up" : "games.e.order.down"),
      resize() {
        dirty = true;
      },
      reset() {
        R = null;
        phase = "play";
        said.textContent = "";
      },
      question(q) {
        R = orderRound(q, G.ask, G.tier);
        for (let k = 0; k < 4 && !R; k++) R = orderRound(G.ask(), G.ask, G.tier);
        slot = R ? R.cards.map(() => null) : [];
        hist = [];
        phase = "play";
        ok = false;
        cur = 0;
        glow = 0;
        dirty = true;
        drag.clear();
        if (!R) return "";
        // naloga za seznam »Ponovi«: kartice in pravilni vrstni red
        G.q = { q: R.cards.map((c) => c.s).join("; "), a: R.right.map((i) => R.cards[i].s).join(R.dir > 0 ? " < " : " > "), w: [] };
        say();
        return `${R.cards.map((c) => c.s).join("; ")}.`;
      },
      timeout() {
        phase = "done";
        ok = false;
        slot = slot.map(() => null);
        return { note: t("games.correctWas", { a: iso(G.q.a) }), delay: 3 };
      },
      update(dt) {
        tick(dt);
        glow = Math.max(0, glow - dt * 0.6);
      },
      pointer(type, p) {
        if (type === "down") kbd = false;
        drag.pointer(type, p);
      },
      key(k, down) {
        const mine = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter", " ", "Backspace", "Confirm"].includes(k);
        if (!down || !R) return mine;
        if (k === "Confirm") confirm();
        else if (k === "Backspace") live() && hist.length && take(hist[hist.length - 1]);
        else if (k.startsWith("Arrow")) {
          kbd = true;
          const step = k === "ArrowDown" || k === "ArrowRight" ? 1 : -1, n = R.cards.length;
          for (let s = 1; s <= n; s++) {
            const j = (cur + step * s + n * 2) % n;
            if (!placed(j)) {
              cur = j;
              break;
            }
          }
          said.textContent = R.cards[cur].s;
        } else if (k === " " || k === "Enter") {
          kbd = true;
          if (slot.includes(null) && !placed(cur)) put(cur);
          else if (k === "Enter") confirm();
        } else return false;
        return true;
      },
      draw(g) {
        const [top, bot, bank, water] = chap(G, [["#bae6fd", "#ecfccb", "#65a30d", "#38bdf8"], ["#fde68a", "#fef9c3", "#4d7c0f", "#0ea5e9"], ["#94a3b8", "#cbd5e1", "#3f6212", "#0369a1"], ["#fb923c", "#fde68a", "#854d0e", "#1d4ed8"]]);
        sky(G, g, top, bot);
        if (!R) return;
        if (dirty || !L) {
          L = layout();
          dirty = false;
        }
        // breg in reka spodaj
        const wy = G.H - (L.tall ? 46 : 16);
        g.fillStyle = bank;
        g.fillRect(0, wy - 14, G.W, 14);
        g.fillStyle = water;
        g.fillRect(0, wy, G.W, G.H - wy);
        const d = drag.get();
        const done = phase === "done";
        // oznaki smeri ob vrsti: prvo in zadnje mesto
        const small = t("games.e.order.small"), big = t("games.e.order.big");
        pill(G, g, `▲ ${R.dir > 0 ? small : big}`, L.rx + L.colW / 2, L.y0 - 17, L.colW, 26, "#fff", 15);
        pill(G, g, `▼ ${R.dir > 0 ? big : small}`, L.rx + L.colW / 2, L.bottom + 17, L.colW, 26, "#fff", 15);
        // levo: kup (med igro) ali pravilni vrstni red (po napaki)
        if (done && !ok) {
          pill(G, g, t("games.e.order.right"), L.pool[0].x + L.colW / 2, L.y0 - 17, L.colW, 26, "#bbf7d0", 15);
          R.right.forEach((i, k) => log(G, g, L.pool[k], R.cards[i].s, R.cards[i].val));
        } else if (!done) {
          R.cards.forEach((c, i) => {
            const lifted = d && d.from === "pool" && d.i === i && d.moved;
            if (placed(i) || lifted) return log(G, g, L.pool[i], "", "", { ghost: true });
            log(G, g, L.pool[i], c.s, "", { ring: kbd && i === cur ? "#f59e0b" : null });
          });
        }
        // desno: vrsta z mesti 1 … n
        const next = slot.indexOf(null);
        L.slots.forEach((r, k) => {
          circle(g, L.bx, r.y + r.h / 2, 11, "#fff", 2.5);
          G.fit(String(k + 1), L.bx, r.y + r.h / 2 + 1, 18, 14, { color: INK, weight: 900 });
          const i = slot[k];
          const dragged = d && d.from === "slot" && d.k === k && d.moved;
          if (i != null && !dragged) {
            const mark = done ? (R.cards[i].v === R.cards[R.right[k]].v ? 1 : -1) : 0;
            return log(G, g, r, R.cards[i].s, done ? R.cards[i].val : "", { mark });
          }
          G.rr(r.x, r.y, r.w, r.h, r.h / 2.4);
          g.fillStyle = "rgba(255,255,255,0.35)";
          g.fill();
          g.setLineDash([6, 5]);
          g.lineWidth = 2.5;
          g.strokeStyle = k === next && !done ? "#b45309" : "rgba(27,27,47,0.45)";
          g.stroke();
          g.setLineDash([]);
        });
        if (d && d.moved) {
          const c = R.cards[d.i];
          log(G, g, { x: d.x - L.colW / 2, y: d.y - L.ch * 0.6, w: L.colW, h: L.ch }, c.s, "", { lift: 4 });
        }
        // Brin na bregu, če je prostor
        const room = wy - 14 - (L.bottom + 34);
        if (room > 46) {
          const r = clamp(room * 0.3, 16, 30);
          brin(g, G.W * 0.18, wy - 14 - r * 1.85, r, done ? (ok ? 1 : -1) : 0);
        }
        if (glow > 0 && !G.reduced) {
          g.globalAlpha = glow * 0.3;
          g.fillStyle = "#fde047";
          g.fillRect(0, 0, G.W, G.H);
          g.globalAlpha = 1;
        }
      },
    };
    const tick = wireKeys(G, eng);
    return eng;
  },
};

export const PRODUCE2_GAMES = [tiles, order];
