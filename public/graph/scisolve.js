// Znanstveni kalkulator razume več kot račun: enačbe, neenačbe, sisteme, funkcije f(x), odvode in
// kompleksna števila. Vse brez DOM in brez API (preizkusi v test/tools.test.js).
// Koraki rešitve niso tukaj: »Po korakih« odpre zaslon Skeniraj (public/scan/), ki ima svoj reševalnik.
import { simplify, diff, toTex, MathError, freeVars } from "./math.js";
import { vectorLine } from "./vektor.js";
import { evaluate, compileLine, unknownsOf, functionDef, lineTex, splitTop, prepare, exactTex, toFraction, formatNumber, exactForm } from "./scicore.js";
import { antiderivativeAst } from "./calculus.js";
import { evalComplex, polyRoots } from "./toolscore.js";
import { parseCommand, runCas, casInfo, commandStart } from "./cas.js";
import { polyRootsMult, polyRootsExact, polyRootsSym } from "./toolscore.js"; // večkratne ničle (AUDIT-009); ločena vrstica, da se ne prekriva z AUDIT-007
import { exactPolyIn, symbolPolyIn, zeroAtExact } from "./cas.js";
import { walk, fromTex } from "./math.js";

const RANGE = 100; // numerično iščemo rešitve na [−RANGE, RANGE] gosto,
const FAR = 1e12; // zunaj pa do ±FAR na logaritemski mreži (AUDIT-015: √x = 20 ima rešitev 400)
const FAR_TEX = "\\left[-10^{12};\\,10^{12}\\right]";
const SAMPLES = 20000;
const TRIG = /(sin|cos|tan|cot|sec|csc)(?![a-z])/; // tudi »sin x« brez oklepaja
// Iskanje rešitev ne sme zamrzniti vmesnika (∑ s 10 000 členi): po 1,5 s odnehamo (»ne znam rešiti«).
const BUDGET_MS = 1500;
let deadline = Infinity;

const gcd = (a, b) => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
};
const near = (a, b, eps = 1e-9) => Math.abs(a - b) <= eps * Math.max(1, Math.abs(a), Math.abs(b));
const clean = (x) => (Math.abs(x - Math.round(x)) < 1e-9 * Math.max(1, Math.abs(x)) ? Math.round(x) : Math.abs(x) < 1e-12 ? 0 : x);

/** Decimalni zapis: v samodejni obliki na 8 mest (rešitve so dolge), sicer po izbrani obliki. */
const decTex = (v, comma, mode = "auto", dec = 6) => {
  const x = dec > 6 ? v : clean(v); // pri bližnjih rešitvah ne zaokrožamo 1,0000000001 na 1
  // samodejno: 6 decimalk (vse rešitve enako dolge), zelo majhna števila na 6 veljavnih mest
  const a = mode === "auto" ? (Math.abs(x) >= 1e-3 || x === 0 ? Number(x.toFixed(dec)) : Number(x.toPrecision(dec))) : x;
  // več mest, kot jih ima samodejni zapis (12 veljavnih), za ločevanje bližnjih rešitev
  if (mode === "auto" && dec > 6 && Math.abs(x) >= 1e-3 && Math.abs(x) < 1e12 && String(a).replace(/[-.]/g, "").replace(/^0+/, "").length > 12) {
    const t = x.toFixed(dec).replace(/0+$/, "").replace(/\.$/, "");
    return comma ? t.replace(".", "{,}") : t;
  }
  return formatNumber(a, { mode, comma }).tex;
};
/** Število v TeX: točna oblika (ulomek, koren, π) ≈ decimalno, sicer decimalni zapis. */
export function numberTex(v, comma = true, mode = "auto", dec = 6) {
  const ex = exactTex(dec > 6 ? v : clean(v));
  return ex ? `${ex} \\approx ${decTex(v, comma, mode, dec)}` : decTex(v, comma, mode, dec);
}
// Toliko decimalk (vsaj 6, največ 15), da se različne rešitve v zapisu razlikujejo (0,1 in 0,1000001)
function decimalsFor(xs) {
  const s = [...xs].sort((a, b) => a - b);
  let d = 6;
  const key = (x) => (Math.abs(x) >= 1e-3 || x === 0 ? x.toFixed(d) : x.toPrecision(d));
  while (d < 15 && s.some((x, i) => i > 0 && x !== s[i - 1] && key(x) === key(s[i - 1]))) d++;
  return d;
}
const plainTex = (v, comma, mode = "auto") => exactTex(clean(v)) || decTex(v, comma, mode);

// ---------- polinomi ----------

/**
 * Če je f polinom stopnje ≤ 8, vrne koeficiente od najvišje potence, sicer null.
 * Deljene razlike v točkah −4 … 4, nato preverimo v točkah med njimi.
 */
export function polyCoeffs(f, maxDeg = 8) {
  const xs = [];
  const ys = [];
  for (let k = 0; k <= maxDeg; k++) {
    const x = k - Math.floor(maxDeg / 2);
    const y = f(x);
    if (typeof y !== "number" || !Number.isFinite(y)) return null;
    xs.push(x);
    ys.push(y);
  }
  // Newtonove deljene razlike
  const c = ys.slice();
  for (let j = 1; j < c.length; j++) for (let i = c.length - 1; i >= j; i--) c[i] = (c[i] - c[i - 1]) / (xs[i] - xs[i - j]);
  // v potence: p(x) = c0 + (x−x0)(c1 + (x−x1)(c2 + …))
  let p = [c[c.length - 1]]; // od najnižje potence
  for (let i = c.length - 2; i >= 0; i--) {
    const q = new Array(p.length + 1).fill(0);
    for (let k = 0; k < p.length; k++) {
      q[k + 1] += p[k];
      q[k] -= xs[i] * p[k];
    }
    q[0] += c[i];
    p = q;
  }
  const scale = Math.max(1, ...p.map(Math.abs));
  p = p.map((a) => (Math.abs(a) < 1e-9 * scale ? 0 : clean(a)));
  const ev = (x) => p.reduceRight((s, a) => s * x + a, 0);
  // tudi daleč od vzorcev: cos(x) v stopinjah je na −10 … 10 skoraj polinom (Taylor), na ±100 ne več
  for (const x of [0.37, -1.73, 2.51, -3.29, 6.7, -9.4, 23.9, -47.3, 97.1]) {
    const y = f(x);
    if (typeof y !== "number" || !Number.isFinite(y) || !near(ev(x), y, 1e-7)) return null;
  }
  while (p.length > 1 && p[p.length - 1] === 0) p.pop();
  return p.reverse();
}

/** Točne rešitve kvadratne enačbe z racionalnimi koeficienti: { tex, roots, complex } ali null. */
function quadraticExact([a, b, c], v, comma, exact = null) {
  // AUDIT-053: ulomki morajo biti točni koeficienti (0,666666666667 ni 2/3): iz točnega polinoma ali točno enaki double
  const fr = exact
    ? exact.map((q) => (q.n >= BigInt(-Number.MAX_SAFE_INTEGER) && q.n <= BigInt(Number.MAX_SAFE_INTEGER) && q.d <= BigInt(Number.MAX_SAFE_INTEGER) ? { p: Number(q.n), q: Number(q.d) } : null))
    : [a, b, c].map((x) => {
        const f = toFraction(x, 1000);
        return f && f.p / f.q === x ? f : null;
      });
  if (fr.some((x) => !x)) return null;
  const L = fr.reduce((l, x) => (l * x.q) / gcd(l, x.q), 1);
  let [A, B, C] = fr.map((x) => (x.p * L) / x.q);
  if (A < 0) [A, B, C] = [-A, -B, -C];
  // vse vmesne vrednosti morajo biti točna cela števila (B² nad 2^53 se v double zaokroži: napačna »točna« oblika);
  // |D| do 10¹² tudi zato, da je razcep √|D| = m√n hiter
  if (![A, B, C, B * B, 4 * A * C].every(Number.isSafeInteger)) return null;
  const D = B * B - 4 * A * C;
  if (!Number.isSafeInteger(D) || Math.abs(D) > 1e12) return null;
  if (D === 0) return null; // ena dvojna rešitev: dovolj je numerična
  const sq = Math.round(Math.sqrt(Math.abs(D)));
  if (D > 0 && sq * sq === D) return null; // racionalni rešitvi: dovolj je exactTex
  // √|D| = m√n
  let n = Math.abs(D);
  let m = 1;
  for (let d = 2; d * d <= n; d++) {
    while (n % (d * d) === 0) {
      n /= d * d;
      m *= d;
    }
  }
  const g = gcd(gcd(B, m), 2 * A);
  const p = -B / g;
  const mm = m / g;
  const q = (2 * A) / g;
  const rad = n === 1 ? `${mm === 1 ? "" : mm}i` : `${mm === 1 ? "" : mm}\\sqrt{${n}}${D < 0 ? "\\,i" : ""}`;
  const num = p === 0 ? `\\pm ${rad}` : `${p} \\pm ${rad}`;
  const tex = q === 1 ? num : `\\frac{${num}}{${q}}`;
  const re = -B / (2 * A);
  const im = Math.sqrt(Math.abs(D)) / (2 * A);
  return D > 0 ? { tex: `${v}_{1,2} = ${tex}`, roots: [re - im, re + im] } : { tex: `${v}_{1,2} = ${tex}`, roots: [], complex: [[re, -im], [re, im]] };
}

// ---------- polinom iz drevesa: točno ali po faktorjih ----------
// L − R kot polinom v v. Najprej točno z racionalnimi koeficienti (cas.js exactPolyIn). Sicer po faktorjih zmnožka
// ((x − √7)²(x − 4/3)(x − π) = 0: vsak faktor posebej, kratnosti se seštejejo), vsak faktor točno ali iz drevesa
// s kroglami (sredina ± meja napake), da pri združevanju ničel (toolscore mergeClusters) vemo, kaj je od 0 neločljivo.
// Vrne seznam ničel [{ re, im, m, exact }] z lastnostmi deg, poly, exactAll, ali null (ni polinom).
const EPS = 2 ** -53;
const ZERO_NODE = { k: "num", v: 0 };
const dependsOn = (node, v) => {
  let yes = false;
  walk(node, (n) => {
    if ((n.k === "var" && n.name === v) || n.k === "ufn" || n.k === "int" || n.k === "sum" || n.k === "deriv") yes = true;
  });
  return yes;
};
function ballPoly(node, v, val) {
  const add = (a, b, sg = 1) => {
    const out = [];
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const [x, rx] = a[i] || [0, 0];
      const [y, ry] = b[i] || [0, 0];
      const m = x + sg * y;
      out.push([m, rx + ry + EPS * Math.abs(m)]);
    }
    return out;
  };
  const mul = (a, b) => {
    const out = Array.from({ length: a.length + b.length - 1 }, () => [0, 0]);
    const abs = out.map(() => 0);
    a.forEach(([x, rx], i) =>
      b.forEach(([y, ry], j) => {
        out[i + j][0] += x * y;
        out[i + j][1] += Math.abs(x) * ry + Math.abs(y) * rx + rx * ry;
        abs[i + j] += Math.abs(x * y);
      }),
    );
    return out.map(([m, r], k) => [m, r + EPS * (Math.min(a.length, b.length) + 1) * abs[k]]);
  };
  const P = (n) => {
    if (!dependsOn(n, v)) {
      const y = val(n);
      if (typeof y !== "number" || !Number.isFinite(y)) throw 0;
      // vpisano število: zaokrožitev na double (½ ulp); vgrajene funkcije (√, π, ln): ~1 ulp
      return [[y, (n.k === "num" ? 1 : 4) * EPS * Math.abs(y)]];
    }
    switch (n.k) {
      case "var":
        return [[0, 0], [1, 0]];
      case "grp":
        return P(n.a);
      case "neg":
        return P(n.a).map(([m, r]) => [-m, r]);
      case "+":
      case "-":
        if (n.b?.k === "pct") throw 0;
        return add(P(n.a), P(n.b), n.k === "+" ? 1 : -1);
      case "*":
        return mul(P(n.a), P(n.b));
      case "/": {
        if (dependsOn(n.b, v)) throw 0;
        const y = val(n.b);
        if (!y || !Number.isFinite(y)) throw 0;
        return P(n.a).map(([m, r]) => [m / y, r / Math.abs(y) + (64 * EPS * Math.abs(m)) / Math.abs(y)]);
      }
      case "^": {
        if (dependsOn(n.b, v)) throw 0;
        const k = val(n.b);
        if (!Number.isInteger(k) || k < 0 || k > 60) throw 0;
        const b = P(n.a);
        let r = [[1, 0]];
        for (let i = 0; i < k; i++) r = mul(r, b);
        return r;
      }
      default:
        throw 0;
    }
  };
  try {
    return P(node);
  } catch {
    return null;
  }
}
// faktorji zmnožka: [{ node, m }]; konstantni faktorji (≠ 0) odpadejo; null, če je kateri konstanten 0
function factorList(node, v, val, m = 1, out = []) {
  if (!dependsOn(node, v)) {
    const y = val(node);
    return typeof y === "number" && Number.isFinite(y) && y !== 0 ? out : null;
  }
  if (node.k === "grp" || node.k === "neg") return factorList(node.a, v, val, m, out);
  if (node.k === "*") return factorList(node.a, v, val, m, out) && factorList(node.b, v, val, m, out);
  if (node.k === "/" && !dependsOn(node.b, v)) return factorList(node.a, v, val, m, out) && factorList(node.b, v, val, m, out);
  if (node.k === "^" && !dependsOn(node.b, v)) {
    const k = val(node.b);
    if (Number.isInteger(k) && k >= 1 && k <= 60) return factorList(node.a, v, val, m * k, out);
  }
  out.push({ node, m });
  return out;
}
const sameRoot = (a, b) => {
  const tol = (x, y) => Math.abs(x - y) <= 8 * EPS * Math.max(Math.abs(x), Math.abs(y));
  return tol(a.re, b.re) && tol(a.im, b.im);
};
function polyRootsOf(L, R, v, scope, run, unit = "rad") {
  const val = (n) => {
    try {
      const y = run(n)(scope);
      return Array.isArray(y) ? NaN : y;
    } catch {
      return NaN;
    }
  };
  // AUDIT-053: vsaka prikazana točna oblika (ulomek, celo, ±(k/q)√m, racionalni večkratnik π, a + bi, končna decimalka)
  // mora biti točno preverjena v vpisani enačbi (cas.js zeroAtExact: obliko vstavimo v L − R, račun s polinomi v π in
  // √m). Tudi točne racionalne ničle in ničle linearnih faktorjev: x − 0,666666666667 = 0 ima ničlo 0,666666666667, ne 2/3;
  // (x − π − 10⁻¹⁵)(x − 1) = 0 nima ničle π. Izjema: realni koren iz točnega faktorja (r.form, preverjen z deljenjem).
  const verifyIn = (A, B, list) => {
    // ista točna vrednost le enkrat: druga številska ničla z enako obliko je napačno locirana (gruča
    // (x − 1)((x − 1)² + 10⁻²⁰) = 0: trije »= 1«), zato ostane »≈«
    const taken = new Set();
    const key = (re, im) => `${re}|${im}`;
    for (const r of list) if (r.exact) taken.add(key(r.re, r.im));
    for (const r of [...list].sort((a, b) => !!b.exact - !!a.exact)) {
      if (r.im === 0 && r.form) continue;
      const c = verifiedForm(A, B, scope, v, r.re, r.im, false, unit);
      if (!c) continue;
      if (!r.exact) {
        if (taken.has(key(c[0], c[1]))) continue;
        taken.add(key(c[0], c[1]));
        Object.assign(r, { re: c[0], im: c[1] });
      }
      r.ver = true;
      r.vk = c[2];
    }
    return list;
  };
  const finish = (list, poly, exactAll) => {
    list.sort((a, b) => a.re - b.re || a.im - b.im);
    list.deg = list.reduce((s, r) => s + r.m, 0);
    list.poly = poly;
    list.exactAll = exactAll;
    return list;
  };
  // 1) cel polinom točno
  const ex = exactPolyIn(L, R, scope, v);
  if (ex && ex.length > 1) {
    const e = polyRootsExact(ex);
    if (e) {
      const out = finish(verifyIn(L, R, e.roots.map((r) => ({ ...r }))), e.poly, true);
      out.ex = ex; // točni koeficienti za quadraticExact
      return out;
    }
  }
  if (ex && ex.length <= 1) return null; // konstanta: stara pot (vsa števila / ni rešitev)
  // 2) po faktorjih
  const zeroSide = (n) => !dependsOn(n, v) && val(n) === 0;
  const prod = zeroSide(R) ? L : zeroSide(L) ? R : { k: "-", a: L, b: R };
  const fs = factorList(prod, v, val);
  if (!fs || !fs.length) return null;
  const all = [];
  let exactAll = true;
  for (const { node, m } of fs) {
    let rs = null;
    const fe = exactPolyIn(node, ZERO_NODE, scope, v);
    if (fe && fe.length > 1) rs = polyRootsExact(fe)?.roots || null;
    // koeficienti s π ali e: razcep nad ℚ[π, e] (cas.js), ničle faktorjev pri π na 32 mest (AUDIT-044)
    if (!rs) {
      const sp = symbolPolyIn(node, ZERO_NODE, scope, v);
      if (sp) {
        rs = polyRootsSym(sp);
        if (rs) exactAll = false;
      }
    }
    if (!rs) {
      exactAll = false;
      const bp = ballPoly(node, v, val);
      if (!bp) return null;
      while (bp.length > 1 && bp[bp.length - 1][0] === 0 && bp[bp.length - 1][1] === 0) bp.pop();
      const [lead, lr] = bp[bp.length - 1];
      if (lr >= Math.abs(lead)) return null; // vodilni koeficient je lahko 0
      if (bp.length < 2) continue; // neničelna konstanta
      rs = polyRootsMult(bp.map((b) => b[0]).reverse(), null, bp.map((b) => b[1]).reverse());
      if (!rs) return null;
      // ničla linearnega faktorja (x − π/2) je −b/a: točna oblika sme ostati (AUDIT-053), drugače le približek
      if (bp.length === 2) rs = rs.map((r) => ({ ...r, lin: true }));
    }
    // preverjamo v faktorju (√2 v drugem faktorju točen račun celotne enačbe onemogoči, ničla faktorja pa je ničla zmnožka)
    verifyIn(node, ZERO_NODE, rs);
    for (const r of rs) {
      const same = all.find((q) => sameRoot(q, r));
      if (same) same.m += r.m * m;
      else all.push({ ...r, m: r.m * m, exact: !!r.exact }); // z oznakami unc, err, qex
    }
  }
  return finish(all, null, exactAll);
}
const numNode = (k) => ({ k: "num", v: k, raw: String(k) });
const fracNode = (f) => (f.q === 1 ? numNode(f.p) : { k: "/", a: numNode(f.p), b: numNode(f.q) });
// Kandidati za točno obliko x, kot jo pokaže zapis: najprej scicore exactTex (p/q, ±(k/q)·√m, (p/q)·π), nato končna
// decimalka (najkrajši toFixed, ki je točno x; pri dec6 le do 6 decimalk, kot jih kaže kompleksni zapis).
// Vrne [{ val, node, isq, vk }] (node z ι, ι² = isq, pri korenu).
function formsOf(x, allowPi, dec6 = false, scale = 0) {
  const out = [];
  // pri |x| < 1 brez clean(): 10⁻¹⁰ (imaginarni del 1 ± 10⁻¹⁰ i) ni 0; kandidat mora biti relativno blizu
  const c = Math.abs(x) >= 1 ? clean(x) : x; // clean je pri |x| < 1 absoluten (10⁻¹⁰ → 0)
  // scale: |z| pri realnem delu kompleksne ničle (re ≈ 10⁻¹⁷ pri ±i je 0); imaginarni del le relativno
  const near = (val) => val === x || Math.abs(val - x) <= 1e-9 * Math.max(Math.abs(x), 1e-6 * scale);
  const f = Number.isInteger(c) ? { p: c, q: 1 } : toFraction(c, 1000);
  if (f) {
    if (Number.isSafeInteger(f.p) && near(f.p / f.q)) out.push({ val: f.p / f.q, node: fracNode(f), vk: "tex" });
  } else {
    const sq = toFraction(c * c, 1000);
    let done = false;
    if (sq && sq.p > 0 && sq.p * sq.q <= 1e6) {
      let m = sq.p * sq.q; // |x| = √(p·q)/q = (k/q)·√m
      let k = 1;
      for (let d = 2; d * d <= m; d++) while (m % (d * d) === 0) (m /= d * d), (k *= d);
      const val = (Math.sign(c) * k * Math.sqrt(m)) / sq.q;
      if (m > 1 && near(val)) {
        out.push({ val, isq: m, vk: "tex", node: { k: "*", a: fracNode({ p: Math.sign(c) * k, q: sq.q }), b: { k: "var", name: "ι" } } });
        done = true;
      }
    }
    const pi = !done && allowPi ? toFraction(c / Math.PI, 24) : null;
    if (pi && Math.abs(pi.p) <= 100 && near((pi.p * Math.PI) / pi.q))
      out.push({ val: (pi.p * Math.PI) / pi.q, vk: "tex", node: { k: "/", a: { k: "*", a: numNode(pi.p), b: { k: "const", name: "π" } }, b: numNode(pi.q) } });
  }
  // končna decimalka: x sam (ne zaokrožen), le če je zapis kratek in natanko x
  if (Math.abs(x) < 1e15 && Math.abs(x) >= 1e-15)
    for (let d = 0; d <= (!dec6 ? 15 : Math.abs(x) < 1e-3 ? 30 : 6); d++) {
      const t = x.toFixed(d);
      if (Number(t) !== x) continue;
      // majhna števila kompleksni zapis kaže na 6 veljavnih mest (1·10⁻⁸)
      if (dec6 && Math.abs(x) < 1e-3 && Number(x.toPrecision(6)) !== x) break;
      if (!out.some((o) => o.val === x && o.vk === "tex")) out.push({ val: x, vk: "dec", node: { k: "num", v: x, raw: t } });
      break;
    }
  if (x === 0) out.push({ val: 0, vk: "dec", node: numNode(0) });
  // celo število nad 2⁵³ (x − 2^60 = 0): točno iz double
  else if (Number.isInteger(x) && !Number.isSafeInteger(x) && Math.abs(x) < 1e300) out.push({ val: x, vk: "dec", node: { k: "num", v: x, raw: BigInt(x).toString() } });
  return out;
}
// [re, im, vk] preverjene oblike ali null; s tri = true pri realni: true / false / null (točno ne gre)
function verifiedForm(L, R, scope, v, re, im, tri = false, unit = "rad") {
  if (im === 0) {
    // tri: true, če katera oblika velja; false, če je vsaj ena točno ovržena; null, ko točno ne gre nobena
    let no = false;
    for (const a of formsOf(re, true, false, 1)) {
      const z = zeroAtExact(L, R, scope, v, a.node, a.isq ?? -1, undefined, unit);
      if (z) return tri ? true : [a.val, 0, a.vk];
      if (z === false) no = true;
    }
    return tri ? (no ? false : null) : null;
  }
  // a + b·i: a racionalen ali (k/q)·ι z ι² = m₁; b·i = b·κ z κ² = −1 ali pri b = (k/q)·√m₂ kot (k/q)·κ z κ² = −m₂
  // (x⁶ = 8: −√2/2 ± √6/2 i)
  const toK = (n) => JSON.parse(JSON.stringify(n).replaceAll('"ι"', '"κ"'));
  for (const a of formsOf(re, false, true, Math.hypot(re, im))) {
    for (const b of formsOf(im, false, true)) {
      if (b.val === 0) continue;
      const bi = b.isq ? toK(b.node) : { k: "*", a: b.node, b: { k: "var", name: "κ" } };
      const rep = { k: "+", a: a.node, b: bi };
      if (zeroAtExact(L, R, scope, v, rep, a.isq ?? -1, undefined, unit, b.isq ? -b.isq : -1)) return [a.val, b.val, a.vk === "dec" || b.vk === "dec" ? "dec" : "tex"];
    }
  }
  return null;
}

// ---------- numerične rešitve ----------

/** Točke na [a, b], kjer f spremeni predznak, ima ničlo ali se začne/konča definicijsko območje. */
function criticalPoints(f, a, b, n = SAMPLES) {
  const pts = [];
  const add = (x) => {
    x = clean(x);
    if (!pts.some((p) => near(p, x, 1e-8))) pts.push(x);
  };
  const h = (b - a) / n;
  const val = (x) => {
    const y = f(x);
    return typeof y === "number" ? y : NaN;
  };
  const cls = (y) => (Number.isNaN(y) ? 2 : Math.sign(y));
  let x0 = a;
  let y0 = val(a);
  let ym = NaN;
  if (Math.abs(y0) < 1e-12) add(a);
  for (let i = 1; i <= n; i++) {
    if (Date.now() > deadline) throw new MathError("notCalc");
    // veliko robov definicijskega območja (x^x pri x < 0) ali ničel (floor) ne sme ustaviti iskanja
    // spremembe predznaka naprej po osi
    const full = pts.length > 400;
    const x1 = a + i * h;
    const y1 = val(x1);
    if (y1 === 0) {
      if (!full || Number.isFinite(y0)) add(x1);
    } else if (cls(y0) !== cls(y1) && y0 !== 0) {
      if (full && (cls(y0) === 2 || cls(y1) === 2)) {
        ym = y0;
        x0 = x1;
        y0 = y1;
        continue;
      }
      // bisekcija na meji (ničla, pol ali rob definicijskega območja)
      let lo = x0;
      let hi = x1;
      const c0 = cls(y0);
      for (let k = 0; k < 80; k++) {
        const m = (lo + hi) / 2;
        const ymid = val(m);
        if (ymid === 0) {
          lo = hi = m;
          break;
        }
        if (cls(ymid) === c0) lo = m;
        else hi = m;
      }
      add((lo + hi) / 2);
    } else if (!full && Number.isFinite(ym) && Number.isFinite(y0) && Number.isFinite(y1) && Math.abs(y0) < Math.abs(ym) && Math.abs(y0) <= Math.abs(y1) && Math.sign(ym) === Math.sign(y0) && Math.sign(y0) === Math.sign(y1)) {
      // morda dotikališče (dvojna ničla)
      let lo = x0 - h;
      let hi = x1;
      const g = (x) => Math.abs(val(x));
      for (let k = 0; k < 120; k++) {
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
    if (pts.length > 1000) break;
  }
  return pts.sort((p, q) => p - q);
}

/**
 * Točke zunaj [−R, R] do ±FAR, kjer f spremeni predznak ali se začne/konča definicijsko območje (AUDIT-015).
 * Logaritemska mreža (200 točk na dekado): najde ln x = 7 (x ≈ 1097), √x = 20 (400), ne pa dotikov daleč od 0.
 */
function farPoints(f, R, perDecade = 200) {
  const pts = [];
  const val = (x) => {
    const y = f(x);
    return typeof y === "number" ? y : NaN;
  };
  const cls = (y) => (Number.isNaN(y) ? 2 : Math.sign(y));
  const n = Math.ceil(Math.log10(FAR / R) * perDecade);
  // podliv (e^x pri x < −745 je točno 0): ni ničla ne rob območja
  const under = (a, b) => (a === 0 && Math.abs(b) < 1e-280) || (b === 0 && Math.abs(a) < 1e-280);
  for (const sgn of [1, -1]) {
    const side = [];
    let x0 = sgn * R;
    let y0 = val(x0);
    let xm = NaN;
    let ym = NaN;
    for (let i = 1; i <= n && side.length <= 20; i++) {
      // čas je potekel: vrnemo, kar smo našli (iskanje blizu 0 je že končano)
      if (Date.now() > deadline) return [...pts, ...side].sort((p, q) => p - q);
      const x1 = sgn * R * 10 ** (i / perDecade);
      const y1 = val(x1);
      if (under(y0, y1)) {
        [xm, ym, x0, y0] = [NaN, NaN, x1, y1];
        continue;
      }
      if (y1 === 0) side.push(x1);
      else if (cls(y0) !== cls(y1) && y0 !== 0) {
        let lo = x0;
        let hi = x1;
        const c0 = cls(y0);
        for (let k = 0; k < 200; k++) {
          const m = (lo + hi) / 2;
          if (m === lo || m === hi) break;
          const yv = val(m);
          if (yv === 0) {
            lo = hi = m;
            break;
          }
          if (cls(yv) === c0) lo = m;
          else hi = m;
        }
        side.push(clean((lo + hi) / 2));
      } else if (Number.isFinite(ym) && Number.isFinite(y0) && Number.isFinite(y1) && Math.sign(ym) === Math.sign(y0) && Math.sign(y0) === Math.sign(y1) && Math.abs(y0) < Math.abs(ym) && Math.abs(y0) <= Math.abs(y1)) {
        // morda dotik (dvojna ničla) daleč od 0: (x − 5000)² = 0
        let lo = Math.min(xm, x1);
        let hi = Math.max(xm, x1);
        const g = (x) => Math.abs(val(x));
        for (let k = 0; k < 200; k++) {
          const m1 = lo + (hi - lo) / 3;
          const m2 = hi - (hi - lo) / 3;
          if (g(m1) < g(m2)) hi = m2;
          else lo = m1;
        }
        const r = clean((lo + hi) / 2);
        if (isRoot(f, r)) side.push(r);
      }
      [xm, ym, x0, y0] = [x0, y0, x1, y1];
    }
    pts.push(...side);
  }
  return pts.sort((a, b) => a - b);
}

const isRoot = (f, x) => {
  const y = f(x);
  if (typeof y !== "number" || !Number.isFinite(y)) return false;
  const s = Math.max(1, Math.abs(f(x + 1e-3)), Math.abs(f(x - 1e-3)));
  return Math.abs(y) < 1e-7 * s;
};

const isPeriodic = (F, P) =>
  [0.31, 1.7, -2.9, 4.4, 11.3].every((x) => {
    const a = F(x);
    const b = F(x + P);
    return Number.isNaN(a) ? Number.isNaN(b) : near(a, b, 1e-7);
  });
// enota kota: radiani, stopinje ali gradi (400 v polnem krogu)
const unitOf = (env) => (env.grad ? "grad" : env.deg ? "deg" : "rad");
const PERIOD = { rad: 2 * Math.PI, deg: 360, grad: 400 };
const UNIT_RAD = { rad: 1, deg: Math.PI / 180, grad: Math.PI / 200 }; // 1 enota v radianih
export const ANGLE_SUP = { rad: "", deg: "^{\\circ}", grad: "^{\\mathrm{g}}" };
const periodTex = (unit, comma) => {
  const sep = `${comma ? ";" : ","}\\,`;
  return unit === "rad" ? `[0${sep}2\\pi)` : `[0${ANGLE_SUP[unit]}${sep}${PERIOD[unit]}${ANGLE_SUP[unit]})`;
};

// ---------- enačba z eno neznanko ----------

// AUDIT-053: številska rešitev sme imeti točno obliko (ulomek, koren, π, celo, kratka decimalka) le, če je ta oblika
// ničla enačbe na ~10⁻¹⁵ (Newtonov korak iz oblike); x^15 + 7x − 1 = 0 → ≈ 0,142857, ne »= 1/7«
function formOk(F, x, vf, strict) {
  // polinomska enačba: točen preizkus oblike (cas.js zeroAtExact); sicer (sin x = 0,5) Newtonov korak
  const ex = vf ? vf(x) : null;
  if (ex !== null) return ex;
  const c0 = clean(x);
  const f = exactForm(c0);
  const c = f ? f.value : Number.isInteger(c0) ? c0 : Number(c0.toFixed(6)) === c0 ? c0 : null;
  if (c === null) return false;
  const y = F(c);
  if (typeof y !== "number" || !Number.isFinite(y)) return false;
  if (y === 0) return true;
  if (strict) return false; // polinom brez točnega preizkusa (x³ + 10⁻³⁰ = 0): le F(x) = 0 brez zaokrožitve
  const h = 1e-7 * Math.max(1, Math.abs(c));
  const d = (F(c + h) - F(c - h)) / (2 * h);
  return Number.isFinite(d) && d !== 0 && Math.abs(y / d) <= 2e-15 * Math.max(1, Math.abs(c));
}
const withGx = (F, r, vf, strict = false) => ({ ...r, gx: r.roots.map((x) => formOk(F, x, vf, strict)) });

function solveOne(F, v, { comma, unit = "rad", src, pr = null, vf = null }) {
  // polinom iz drevesa (polyRootsOf): ničle z večkratnostmi, točno ali po faktorjih z oceno napake
  if (pr && pr.deg >= 1) {
    const poly = pr.poly || polyCoeffs(F); // polyCoeffs pri koeficientih nad ~10¹⁰ ni zanesljiv
    if (pr.deg === 2 && pr.exactAll && poly?.length === 3 && pr.ex?.length === 3) {
      const q = quadraticExact(poly, v, comma, pr.ex);
      if (q) return { kind: "solve", v, roots: q.roots, complex: q.complex || [], exact: q.tex, poly };
    }
    // točne rešitve brez zaokroževanja; približne le na ~ulp (1,0000000001 ni 1)
    const tight = (x) => (Math.abs(x - Math.round(x)) <= 1e-13 * Math.max(1, Math.abs(x)) ? Math.round(x) : Math.abs(x) < 1e-15 ? 0 : x);
    const real = pr.filter((r) => r.im === 0);
    const roots = real.map((r) => (r.exact || r.ver ? r.re : tight(r.re))); // preverjeno ne zaokrožamo (−1 − 10⁻¹⁵)
    // imaginarni del iz točne poti ne zaokrožamo na 0 (x² + 10⁻³⁰ = 0: ±10⁻¹⁵ i)
    const complex = pr.filter((r) => r.im !== 0).map((r) => (r.ver ? [r.re, r.im] : [tight(r.re), pr.exactAll ? r.im : tight(r.im)]));
    // rex: točno racionalna; forms: potrjena oblika ±ᵏ√(p/q) (za zapis z »=« namesto »≈«)
    // unc: ničla ni potrjena (ali ima polmer napake err) – v zapisu »≈« in le zanesljiva mesta
    const runc = real.map((r) => !!(r.unc || r.err));
    const cx = pr.filter((r) => r.im !== 0);
    const cerr = cx.map((r) => (r.unc ? Infinity : r.err || 0));
    // rex: true = preverjen ulomek (exactTex), "dec" = preverjena končna decimalka (x − 0,666666666667 = 0)
    const rex = real.map((r) => (r.ver && r.vk === "dec" ? "dec" : !!(r.exact && r.ver)));
    const forms = real.map((r) => (r.form ? { k: r.form.k, p: String(r.form.p), q: String(r.form.q), neg: r.form.neg } : null));
    const out = { kind: "solve", v, roots, complex, poly, mult: real.map((r) => r.m), rex };
    // vx / cex: prikazana oblika je točno preverjena (verifyAll) ali potrjen koren iz točnega faktorja; sicer le »≈«
    // (AUDIT-053: x^15 + 7x − 1 = 0 ni 1/7)
    out.vx = real.map((r) => !!(r.form || r.ver));
    const cxl = pr.filter((r) => r.im !== 0);
    out.cex = cxl.map((r) => !!r.ver);
    const cm = pr.filter((r) => r.im !== 0).map((r) => r.m);
    if (cm.some((m) => m > 1)) out.cmult = cm;
    // π ni ničla polinoma brez π v koeficientih: 3,14159265358979 iz vnosa ni π
    if (!/π|pi|\\pi/.test(src || "")) out.noPi = true;
    if (forms.some(Boolean)) out.forms = forms;
    if (runc.some(Boolean)) out.runc = runc;
    if (cerr.some((e) => e > 0)) out.cerr = cerr.map((e) => (Number.isFinite(e) ? e : -1));
    return out;
  }
  const poly = polyCoeffs(F);
  if (poly) {
    const d = poly.length - 1;
    if (d === 0) return poly[0] === 0 ? { kind: "solve", v, all: true, roots: [] } : { kind: "solve", v, none: true, roots: [] };
    if (d === 2) {
      const ex = quadraticExact(poly, v, comma);
      if (ex) return { kind: "solve", v, roots: ex.roots, complex: ex.complex || [], exact: ex.tex, poly };
    }
    // večkratne ničle ((x − 5)³ = 0) le enkrat in točno; brez preizkušenih ničel stara numerična pot
    const mult = polyRootsMult(poly);
    const all = mult ? mult.map((r) => [r.re, r.im]) : polyRoots(poly);
    const roots = [];
    const complex = [];
    for (const [re, im] of all) {
      if (Math.abs(im) < 1e-7 * Math.max(1, Math.abs(re))) {
        const r = clean(re);
        if (!roots.some((x) => near(x, r, 1e-7))) roots.push(r);
      } else if (!complex.some(([a, b]) => near(a, re, 1e-7) && near(b, im, 1e-7))) complex.push([clean(re), clean(im)]);
    }
    return withGx(F, { kind: "solve", v, roots: roots.sort((a, b) => a - b), complex, poly }, vf, true);
  }
  const P = PERIOD[unit];
  if (TRIG.test(src) && isPeriodic(F, P)) {
    // periodična enačba: rešitve na eni periodi kota (v stopinjah [0°, 360°), v gradih [0, 400), v radianih [0, 2π))
    const roots = criticalPoints(F, 0, P, 6000).filter((x) => isRoot(F, x) && x >= 0 && x < P - 1e-9);
    return withGx(F, { kind: "solve", v, roots, complex: [], interval: periodTex(unit, comma), periodic: true, ...(unit === "rad" ? {} : { [unit]: true }) }, vf);
  }
  const R = unit === "rad" ? RANGE : 10 * RANGE;
  const near0 = criticalPoints(F, -R, R);
  let roots = near0.filter((x) => isRoot(F, x));
  if (roots.length > 12) roots = roots.filter((x) => Math.abs(x) <= 20).slice(0, 12);
  // zunaj ±R iščemo samo, kjer funkcija blizu 0 ne niha (sin x = x/1000 ima stotine rešitev: ostane, kot je bilo)
  else if (near0.length <= 12) {
    const all = [...roots, ...farPoints(F, R).filter((x) => isRoot(F, x))];
    // največ 12, najbližje 0, nato po vrsti
    roots = all.sort((a, b) => Math.abs(a) - Math.abs(b)).slice(0, 12).sort((a, b) => a - b);
  }
  // brez rešitve na [−10¹², 10¹²] ne trdimo, da je ni nikjer (AUDIT-015): searched = preiskani interval
  return withGx(F, { kind: "solve", v, roots, complex: [], ...(roots.length ? {} : { searched: FAR_TEX }) }, vf);
}

// Ali je število v zapisu točno: celo, kratek decimalni zapis (≤ 6 decimalk) ali točna oblika (ulomek, koren, π)
const shownExact = (x, raw = false) => {
  const c = raw ? x : clean(x); // raw: v gruči (0,9999999999) ne zaokrožamo na 1
  return Number.isInteger(c) || Number(c.toFixed(6)) === c || !!exactTex(c);
};
// »= točna oblika ≈ decimalno«, »= decimalno« ali »≈ decimalno« (x³ = 2: x = ∛2 ≈ 1,259921; 2^x = 5: x ≈ 2,321928)
// ᵏ√(p/q) brez popolnih k-tih potenc pod korenom: ∛16 = 2∛2, ∛54 = 3∛2, ∛(3/2) ostane
function radicalTex(k, p, q, neg) {
  const pull = (n) => {
    let a = 1n;
    let r = n;
    for (let d = 2n; d ** BigInt(k) <= r; d++) while (r % d ** BigInt(k) === 0n) (r /= d ** BigInt(k), (a *= d));
    return [a, r];
  };
  const [a, pr] = pull(BigInt(p.replace(/^-/, "")));
  const [b, qr] = pull(BigInt(q));
  const rad = qr === 1n ? `${pr}` : `\\frac{${pr}}{${qr}}`;
  const root = pr === 1n && qr === 1n ? "" : k === 2 ? `\\sqrt{${rad}}` : `\\sqrt[${k}]{${rad}}`;
  const coef = b === 1n ? (a === 1n && root ? "" : `${a}`) : `\\frac{${a}}{${b}}`;
  return `${neg ? "-" : ""}${coef}${root}`;
}
// »= točna oblika ≈ decimalno«, »= decimalno« ali »≈ decimalno« (x³ = 2: x = ∛2 ≈ 1,259921; 2^x = 5: x ≈ 2,321928)
function rootTex(x, rex, form, comma, mode, dec, noPi = false) {
  if (form) {
    const neg = form.neg !== form.p.startsWith("-");
    // √ ima že lepšo obliko v exactTex (2√2 namesto √8), a le, če je x² v njej točno p/q (x² = 2,000000000001 ni √2)
    const sq = form.k === 2 ? toFraction(clean(x) ** 2, 1000) : null;
    const ex = sq && BigInt(sq.p) * BigInt(form.q) === BigInt(sq.q) * BigInt(form.p.replace("-", "")) ? exactTex(clean(x)) : null;
    const t = ex || radicalTex(form.k, form.p, form.q, neg);
    return `= ${t} \\approx ${decTex(x, comma, mode, dec)}`;
  }
  if (rex === true || rex === "dec") {
    // točno racionalna: nikoli π ali √ iz vpisanega decimalnega števila (3,14159265358979 ni π), le ulomek;
    // pri "dec" je preverjena le decimalka (x − 0,666666666667 = 0: ne 2/3)
    const ex = rex === true ? exactTex(x) : null;
    if (ex && !/\\pi|\\sqrt|e/.test(ex)) return `= ${ex} \\approx ${decTex(x, comma, mode, dec)}`;
    // končen decimalni zapis do 15 mest: z »=« in vsemi mesti (1,0000001)
    for (let d = 0; d <= 15; d++)
      if (Number(x.toFixed(d)) === x) {
        const t = decTex(x, comma, mode, Math.max(dec, d));
        // eksponentni zapis je točen, če prikazana mesta dajo natanko x (−1·10⁻¹⁰)
        if (!/\\cdot 10/.test(t) || Number(t.replace("{,}", ".").replace(/\\cdot 10\^\{(-?\d+)\}/, "e$1")) === x) return `= ${t}`;
        // eksponentni zapis ni točen: celo število z vsemi števkami (2⁶⁰ = 1 152 921 504 606 846 976), sicer ≈
        if (Number.isInteger(x) && Math.abs(x) < 1e40) return `= ${BigInt(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\\,")}`;
        return `\\approx ${t}`;
      }
    return `\\approx ${decTex(x, comma, mode, dec)}`;
  }
  if (noPi && /\\pi/.test(exactTex(clean(x)) || "")) return `\\approx ${decTex(x, comma, mode, dec)}`;
  return shownExact(x, dec > 6) ? `= ${numberTex(x, comma, mode, dec)}` : `\\approx ${decTex(x, comma, mode, dec)}`;
}

/** TeX rešitev enačbe. */
// večkratnost rešitve v besedilu (sci.js poda prevod: sc.mult.2, sc.mult.3, sc.mult.n)
const MULT_SL = (m) => (m === 2 ? "dvojna rešitev" : m === 3 ? "trojna rešitev" : `${m}-kratna rešitev`);
export function solutionTex(r, comma = true, mode = "auto", multText = MULT_SL) {
  const v = r.v;
  if (r.all) return `${v} \\in \\mathbb{R}`;
  // numerično iskanje brez rešitve: na preiskanem intervalu je ni, zunaj ga nismo iskali (AUDIT-015)
  if (r.searched && !r.roots.length && !r.complex?.length) return `${v} \\notin ${r.searched}`;
  if (r.none || (!r.roots.length && !r.complex?.length)) return `${v} \\in \\varnothing`;
  const parts = [];
  if (r.exact) parts.push(r.exact);
  // k-kratna rešitev dobi k zaporednih indeksov (x₁,₂ = 1) in oznako »dvojna rešitev«
  const ms = [...r.roots.map((_, i) => r.mult?.[i] || 1), ...(r.complex || []).map((_, j) => r.cmult?.[j] || 1)];
  const many = ms.reduce((a, b) => a + b, 0) > 1;
  const first = ms.map((_, i) => 1 + ms.slice(0, i).reduce((a, b) => a + b, 0));
  const name = (i) => {
    if (!many) return v;
    const k = first[i];
    const m = r.exact ? 1 : ms[i];
    if (m === 1) return `${v}_{${k}}`;
    return m <= 3 ? `${v}_{${Array.from({ length: m }, (_, t) => k + t).join(",")}}` : `${v}_{${k},\\ldots,${k + m - 1}}`;
  };
  // nepotrjena (številsko združena) ničla: brez oznake kratnosti
  const unsure = (i) => (i < r.roots.length ? r.runc?.[i] : (r.cerr?.[i - r.roots.length] || 0) !== 0);
  const tag = (i) => (!r.exact && ms[i] > 1 && !unsure(i) ? `\\;(\\text{${multText(ms[i]).replace(/[{}\\$&#%_^~]/g, "")}})` : "");
  const dec = decimalsFor(r.roots);
  const decAll = decimalsFor([...r.roots, ...(r.complex || []).map((z) => z[0])]);
  if (r.exact)
    r.roots.forEach((x, i) => parts.push(`${name(i)} \\approx ${decTex(x, comma, mode, dec)}`));
  else if (r.deg || r.grad) r.roots.forEach((x, i) => parts.push(`${name(i)} ${Number(clean(x).toFixed(6)) === clean(x) && !(r.gx && !r.gx[i]) ? "=" : "\\approx"} ${decTex(x, comma, mode)}${ANGLE_SUP[r.grad ? "grad" : "deg"]}`));
  else if (r.approx) r.roots.forEach((x, i) => parts.push(`${name(i)} = ${decTex(x, comma, mode, dec)}`)); // approx: izmerjena vrednost (molska masa), brez ulomka
  else r.roots.forEach((x, i) => parts.push(`${name(i)} ${r.runc?.[i] || (r.vx && !r.vx[i]) || (r.gx && !r.gx[i]) ? `\\approx ${decTex(x, comma, mode, decAll)}` : rootTex(x, r.rex?.[i], r.forms?.[i], comma, mode, decAll, r.noPi)}${tag(i)}`));
  if (!r.exact)
    (r.complex || []).forEach(([re, im], i) => {
      // ce: polmer napake (−1: ni potrjena); realni deli v gruči (1,00000000005) z dovolj mesti, da se ločijo
      const ce = r.cerr?.[i] || 0;
      // mesta: kot pri realnih (decAll), a ne več, kot jih zanesljivo poznamo (napaka ce, absolutno); realni in
      // imaginarni del enako (−1,129900 − 0,255830i, ne −1,12990045984811 − 0,25583i)
      const d = ce > 0 && !r.cex?.[i] ? Math.max(1, Math.min(decAll, Math.floor(-Math.log10(2 * ce)))) : decAll;
      // AUDIT-053: nepreverjena kompleksna ničla brez ugibanih ulomkov in korenov (≈ 0,333333 − 0,942809i, ne ≈ 1/3 − 2√2/3 i)
      const raw = r.cex ? !r.cex[i] : !!r.gx || ce > 0;
      const small = (x) => formatNumber(Number(x.toPrecision(6)), { mode, comma }).tex;
      // preverjena: točna oblika (1/3 ± 10⁻⁷ i, ne 0,3333333 ± 10⁻⁷ i)
      const part = (x) => (Math.abs(x) < 1e-6 ? small(x) : r.cex?.[i] ? plainTex(x, comma, mode) : raw || decAll > 6 ? decTex(x, comma, mode, d) : plainTex(x, comma, mode));
      const a = re === 0 ? "" : part(re);
      // zelo majhen imaginarni del (1 ± 10⁻¹⁰ i) ne sme postati 0
      const b = part(Math.abs(im));
      // »=« le pri točno preverjeni ničli (AUDIT-053); številska pot brez preverjanja po starem pravilu
      const eq = (r.cex ? r.cex[i] : !r.gx && !ce && shownExact(re, decAll > 6) && shownExact(Math.abs(im), decAll > 6 || Math.abs(im) < 1e-6)) ? "=" : "\\approx";
      parts.push(`${name(r.roots.length + i)} ${eq} ${a}${im < 0 ? "-" : a ? "+" : ""}${b === "1" ? "" : b}${/^[\d{}]+$/.test(b) ? "" : "\\,"}i${tag(r.roots.length + i)}`);
    });
  return parts.join(",\\quad ");
}

// ---------- neenačbe ----------

const CMP_OK = { "<": (d) => d < 0, ">": (d) => d > 0, "<=": (d) => d <= 0, ">=": (d) => d >= 0, "=": (d) => d === 0, "!=": (d) => d !== 0 };

/**
 * pairs: [[L, R], …] (strani verige a < b ≤ c …), ops: primerjave med njimi.
 * period: rešujemo samo na [0, period) (trigonometrične neenačbe), sicer na vsej realni osi.
 */
function solveIneq(pairs, ops, v, period = 0, rootLists = []) {
  const Fs = pairs.map(([L, R]) => (x) => L(x) - R(x));
  const LO = period ? 0 : -Infinity;
  const HI = period || Infinity;
  let pts = [];
  // ničle polinomov (polyRootsOf: točno ali po faktorjih): v njih je razlika strani 0, drugih točk ne dodajamo
  const zeros = pairs.map(() => []);
  for (const [i, F] of Fs.entries()) {
    const rl = !period ? rootLists[i] : null;
    if (rl) {
      for (const r of rl) if (r.im === 0) zeros[i].push(clean(r.re));
      pts.push(...zeros[i]);
      continue;
    }
    const poly = period ? null : polyCoeffs(F);
    if (poly && poly.length > 1)
      for (const [re, im] of polyRoots(poly)) {
        if (Math.abs(im) < 1e-7 * Math.max(1, Math.abs(re))) pts.push(clean(re));
      }
    if (period) pts.push(...criticalPoints(F, 0, period, 6000));
    else {
      const near0 = criticalPoints(F, -RANGE, RANGE);
      // nihajoča funkcija (x·sin x > 0): zunaj ±RANGE ne iščemo, ker logaritemska mreža ne ujame vseh menjav predznaka
      pts.push(...near0, ...(near0.length <= 12 ? farPoints(F, RANGE) : []));
    }
  }
  const exactAll = !period && pairs.every((_, i) => rootLists[i]);
  // meja goste mreže (±RANGE) ni kritična točka, če tam ni ničle ne menjave predznaka (e^x > 0 se ne razdeli pri −100)
  const realPoint = (x) =>
    Fs.some((F) => {
      const y = F(x);
      const d = 1e-7 * Math.abs(x);
      const a = F(x - d);
      const b = F(x + d);
      return y === 0 || typeof a !== "number" || typeof b !== "number" || !Number.isFinite(a) || !Number.isFinite(b) || Math.sign(a) !== Math.sign(b);
    });
  pts = pts
    .filter((x) => period || Math.abs(x) !== RANGE || realPoint(x))
    .filter((x) => x > LO && x < HI && !(period && near(x, HI, 1e-9)))
    .sort((a, b) => a - b)
    .filter((x, i, a) => i === 0 || (exactAll ? x !== a[i - 1] : !near(x, a[i - 1], 1e-7)));
  // V točki (ničla, pol, rob definicijskega območja) je razlika strani lahko 1e-16 namesto 0
  // in tan(90°) je 1,6·10^16 namesto pola: ničlo zaokrožimo na 0, pol ni rešitev.
  const test = (x, point) => {
    try {
      return pairs.every(([L, R], i) => {
        const a = L(x);
        const b = R(x);
        if (typeof a !== "number" || typeof b !== "number" || !Number.isFinite(a) || !Number.isFinite(b)) return false;
        let d = a - b;
        if (point && zeros[i].includes(x)) d = 0;
        else if (point) {
          const s = Math.max(1, Math.abs(a), Math.abs(b));
          if (Math.abs(d) <= 1e-9 * s) d = 0;
          else if (Math.abs(d) > 1e9 * Math.max(1, Math.min(Math.abs(a), Math.abs(b)))) return false;
        }
        return CMP_OK[ops[i]]?.(d) === true;
      });
    } catch {
      return false;
    }
  };
  // odseki: [LO], (LO, p0), {p0}, (p0, p1), … , (pk, HI)
  const ends = [LO, ...pts, HI];
  const mid = (a, b) => (a === -Infinity ? (b === Infinity ? 0 : b - Math.max(1, Math.abs(b))) : b === Infinity ? a + Math.max(1, Math.abs(a)) : (a + b) / 2);
  const segs = [];
  if (period) segs.push({ point: LO, ok: test(LO, true) });
  for (let i = 0; i + 1 < ends.length; i++) {
    segs.push({ lo: ends[i], hi: ends[i + 1], ok: test(mid(ends[i], ends[i + 1]), false) });
    if (i + 2 < ends.length) segs.push({ point: ends[i + 1], ok: test(ends[i + 1], true) });
  }
  // združimo v intervale
  let out = [];
  let cur = null;
  for (const s of segs) {
    if (!s.ok) {
      if (cur) out.push(cur);
      cur = null;
      continue;
    }
    if (s.point !== undefined) {
      if (cur) cur.hiIn = true;
      else cur = { lo: s.point, loIn: true, hi: s.point, hiIn: true };
      cur.hi = s.point;
    } else if (cur) {
      cur.hi = s.hi;
      cur.hiIn = false;
    } else cur = { lo: s.lo, loIn: false, hi: s.hi, hiIn: false };
  }
  if (cur) out.push(cur);
  // interval brez širine ((a; a) ali skoraj) ni rešitev; točka {a} je le, če je zaprta
  out = out.filter((r) => (r.loIn && r.hiIn) || !Number.isFinite(r.hi - r.lo) || r.hi - r.lo > 1e-9 * Math.max(1, Math.abs(r.lo)));
  // velja na vsej periodi → velja za vsak x
  if (period && out.length === 1 && out[0].lo === LO && out[0].loIn && out[0].hi === HI) out = [{ lo: -Infinity, loIn: false, hi: Infinity, hiIn: false }];
  return { kind: "ineq", v, intervals: out };
}

export function intervalsTex(r, comma = true, mode = "auto") {
  const v = r.v;
  const I = r.intervals;
  if (!I.length) return `${v} \\in \\varnothing`;
  if (I.length === 1 && I[0].lo === -Infinity && I[0].hi === Infinity) return `${v} \\in \\mathbb{R}`;
  const end = (x) => (x === -Infinity ? "-\\infty" : x === Infinity ? "\\infty" : plainTex(x, comma, mode));
  const one = (i) => (i.lo === i.hi ? `\\{${end(i.lo)}\\}` : `${i.loIn ? "[" : "("}${end(i.lo)}${comma ? ";\\," : ",\\,"}${end(i.hi)}${i.hiIn ? "]" : ")"}`);
  // en sam interval zapišemo tudi kot neenačbo (−2 < x < 2)
  let ineq = "";
  if (I.length === 1 && I[0].lo !== I[0].hi) {
    const i = I[0];
    const l = i.lo === -Infinity ? "" : `${end(i.lo)} ${i.loIn ? "\\le" : "<"} `;
    const h = i.hi === Infinity ? "" : ` ${i.hiIn ? "\\le" : "<"} ${end(i.hi)}`;
    ineq = l || h ? `${l}${v}${h} \\quad\\Leftrightarrow\\quad ` : "";
  }
  return `${ineq}${v} \\in ${I.map(one).join(" \\cup ")}`;
}

// ---------- sistem linearnih enačb ----------

function solveLinear(Gs, unknowns) {
  const n = unknowns.length;
  const at = (vec) => Gs.map((G) => G(vec));
  const zero = new Array(n).fill(0);
  const c0 = at(zero);
  if (c0.some((x) => !Number.isFinite(x))) return null;
  const A = Gs.map(() => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const e = zero.slice();
    e[j] = 1;
    const cj = at(e);
    for (let i = 0; i < Gs.length; i++) A[i][j] = clean(cj[i] - c0[i]);
  }
  // linearnost: preverimo v naključni točki
  const probe = unknowns.map((_, j) => 0.73 + 1.37 * j);
  const want = at(probe);
  for (let i = 0; i < Gs.length; i++) {
    const lin = c0[i] + A[i].reduce((s, a, j) => s + a * probe[j], 0);
    if (!near(lin, want[i], 1e-8)) return null;
  }
  // Gaussova eliminacija z delnim pivotiranjem
  const M = A.map((row, i) => [...row, -c0[i]]);
  let rank = 0;
  const pivCol = [];
  for (let col = 0; col < n && rank < M.length; col++) {
    let best = rank;
    for (let i = rank + 1; i < M.length; i++) if (Math.abs(M[i][col]) > Math.abs(M[best][col])) best = i;
    if (Math.abs(M[best][col]) < 1e-12) continue;
    [M[rank], M[best]] = [M[best], M[rank]];
    for (let i = 0; i < M.length; i++) {
      if (i === rank) continue;
      const f = M[i][col] / M[rank][col];
      for (let k = col; k <= n; k++) M[i][k] -= f * M[rank][k];
    }
    pivCol.push(col);
    rank++;
  }
  const inconsistent = M.slice(rank).some((row) => Math.abs(row[n]) > 1e-9 * Math.max(1, ...row.map(Math.abs)));
  if (inconsistent) return { kind: "system", unknowns, none: true };
  if (rank < n) return { kind: "system", unknowns, many: true };
  const values = new Array(n);
  pivCol.forEach((col, r) => (values[col] = clean(M[r][n] / M[r][col])));
  return { kind: "system", unknowns, values };
}

// ---------- besedilo za grafični kalkulator ----------

// izraz za graf: decimalna pika, »,« med argumenti, brez Ans in °
function plotText(s, env) {
  return prepare(s, { comma: env.comma !== false })
    .replace(/A_\{ans\}/g, `(${env.ans ?? 0})`)
    .replace(/\*G_\{deg\}/g, "*(π/180)")
    .replace(/\*G_\{min\}/g, "*(π/10800)")
    .replace(/\*G_\{sec\}/g, "*(π/648000)")
    .replace(/\s+/g, " ")
    .trim();
}
const CMP = /<=|>=|≤|≥|<|>|=/;
function splitCmp(text) {
  const s = String(text);
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "(") depth++;
    else if (c === ")") depth--;
    else if (depth === 0) {
      const m = CMP.exec(s.slice(i, i + 2));
      if (m && m.index === 0) return [s.slice(0, i), m[0], s.slice(i + m[0].length)];
    }
  }
  return null;
}

/** Samo zapis vrstice v TeX (brez reševanja), za sproten predogled enačb in sistemov. */
export function previewTex(text, env = {}) {
  const comma = env.comma !== false;
  try {
    const parts = splitTop(String(text ?? "").trim(), ";\n").map((x) => x.trim()).filter(Boolean);
    if (!parts.length) return null;
    const texs = parts.map((p) => lineTex(compileLine(p, { ...env, funcs: env.funcs || {} }).ast, comma));
    return texs.length > 1 ? `\\begin{cases} ${texs.join(" \\\\ ")} \\end{cases}` : texs[0];
  } catch {
    return null;
  }
}

// ---------- glavna funkcija ----------

/**
 * Pol(x; y) → r, θ in Rec(r; θ) → x, y (Casio Pol/Rec); kot je v trenutni enoti (stopinje, radiani ali gradi).
 * Tudi sredi izraza (public/graph/vektor.js): Rec(5; 30) + Rec(3; 120), 2·Rec(…), Pol(Rec(…) + Rec(…)),
 * Rec(…)·Rec(…) (skalarni produkt), |Rec(…) − Rec(…)|.
 * @returns {{ kind:"pair", tex, deg, grad, items:[{name, v, angle?}] } | { kind:"value", value, tex } | { error } | null}
 *   null, če v vrstici ni Pol/Rec.
 */
export function polRec(text, env = {}) {
  const src = String(text ?? "").replace(/(^|[^A-Za-z_])(pol|rec)(?=\s*\()/gi, (m, p, f) => p + (f.toLowerCase() === "pol" ? "Pol" : "Rec"));
  if (!/(Pol|Rec)\s*\(/.test(src)) return null;
  let line, vl;
  try {
    line = compileLine(src, env);
    vl = line && vectorLine(line.ast);
    if (!vl) return null;
    const miss = unknownsOf(line.rw(line.ast), env.vars || {});
    if (miss.length) return { error: { code: "missing", info: { names: miss } } };
    const ev = (n) => {
      const v = line.run(n)(line.scope);
      return Array.isArray(v) ? NaN : Number(v);
    };
    const tex = lineTex(line.ast, env.comma !== false);
    if (vl.kind === "num") {
      const value = ev(vl.s);
      return Number.isFinite(value) ? { kind: "value", value: clean(value), tex } : { error: { code: "undef", info: {} } };
    }
    const a = ev(vl.x);
    const b = ev(vl.y);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return { error: { code: "undef", info: {} } };
    const k = UNIT_RAD[unitOf(env)]; // enota kota → radiani
    const items =
      vl.kind === "pol"
        ? [{ name: "r", v: clean(Math.hypot(a, b)) }, { name: "\\theta", v: clean(Math.atan2(b, a) / k), angle: true }]
        : [{ name: "x", v: clean(a) }, { name: "y", v: clean(b) }];
    return { kind: "pair", tex, deg: unitOf(env) === "deg", grad: unitOf(env) === "grad", items };
  } catch (e) {
    return { error: { code: e.code || "other", info: e.info || {} } };
  }
}

/**
 * Analizira vrstico znanstvenega kalkulatorja.
 * env: { vars, funcs, ans, deg, grad, comma } (grad: gradi, ima prednost pred deg)
 * Vrne { kind, tex, … } ali { error }:
 * - value: { value, assign? } (navaden račun)
 * - complex: { re, im }
 * - func: { name, param, body } (definicija f(x) = …)
 * - solve: { v, roots, complex, exact?, interval?, all?, none? }
 * - ineq: { v, intervals }
 * - system: { unknowns, values | none | many }
 * - pair: { items: [{ name, v, angle? }], deg, grad } (Pol/Rec: dva rezultata)
 * - bool: { value } (enačba brez neznank: drži / ne drži)
 * - deriv: { resTex } (simbolni odvod)
 * - expr: izraz z eno spremenljivko (narišemo ga)
 * - plot: enačba z dvema neznankama (narišemo jo)
 * Vsi razen value/complex/bool/func imajo plot: [izrazi za grafični kalkulator].
 */
// Številski integral je približek (»≈«). Če znamo nedoločeni integral F (preverjen z odvodom, public/graph/calculus.js)
// in se F(b) − F(a) ujema s številskim izidom v njegovi oceni napake (tako F na intervalu nima skoka), je to točna
// vrednost (»=«): ∫(1/√x; 0; 1) = 2. live: predogled med tipkanjem, s kratko mejo za računanje F.
export function exactIntegral(raw, env, r) {
  const info = r?.int;
  if (!info || !Number.isFinite(info.value) || !(info.err >= 0)) return r;
  try {
    const line = compileLine(raw, env);
    let n = line.ast;
    while (n.k === "grp") n = n.a;
    if (n.k !== "int" || !n.lo || !n.hi) return r;
    // brez dovolj natančnega številskega izida ne moremo preveriti, da F na intervalu nima skoka
    if (!(info.err <= 1e-6 * Math.max(1, Math.abs(info.value)))) return r;
    const F = antiderivativeAst(line, n.a, n.v, env.live ? 25 : undefined);
    if (!F) return r;
    const Ff = line.run(F);
    const at = (x) => {
      const sc = Object.create(line.scope);
      sc[n.v] = x;
      const y = Ff(sc);
      return typeof y === "number" ? y : NaN;
    };
    const a = line.run(n.lo)(line.scope);
    const b = line.run(n.hi)(line.scope);
    // F v krajišču ni definirana (x·ln x − x pri 0): enostranska limita, če se vrednosti ob krajišču ustalijo
    let lim = false;
    const end = (x, s) => {
      const y = at(x);
      if (Number.isFinite(y)) return y;
      lim = true;
      // neskončna meja (−e^(−x)(x + 1) pri ∞): vrednosti pri ±10¹², ±10¹⁵
      const inf = !Number.isFinite(x);
      const h = Math.abs(b - a);
      const y1 = inf ? at(Math.sign(x) * 1e12) : at(x + s * h * 1e-13);
      const y2 = inf ? at(Math.sign(x) * 1e15) : at(x + s * h * 1e-16);
      return Math.abs(y1 - y2) <= 1e-9 * Math.max(1, Math.abs(y2)) ? y2 : NaN;
    };
    const s = b > a ? 1 : -1;
    let exact = end(b, -s) - end(a, s);
    if (lim) exact = Number(exact.toPrecision(12)); // limita iz F(a + 10⁻¹⁶): šum v zadnjih mestih
    if (!Number.isFinite(exact) || Math.abs(exact - info.value) > Math.max(4 * info.err, 1e-13 * Math.abs(exact))) return r;
    const { approx, est, ...rest } = r;
    return { ...rest, value: exact };
  } catch {
    return r;
  }
}

// Funkcije, ki so zvezne povsod, kjer so definirane; nevarna mesta (pol, veja ln) so le ničle argumentov spodaj.
const SAFE_FNS = new Set(["sin", "cos", "exp", "atan", "arctan", "sinh", "cosh", "tanh", "asinh", "arsinh", "erf", "abs", "sqrt", "cbrt", "ln", "log", "logb", "tan", "sec", "cot", "csc"]);
/**
 * Izrazi, katerih ničla na intervalu pomeni pol ali skok f oziroma F: imenovalci, osnove potenc z necelim ali
 * negativnim eksponentom, argumenti ln/log, cos(u) pri tan/sec, sin(u) pri cot/csc, argumenti korenov.
 * null: drevo ima funkcijo, ki je ne poznamo (lahko ima skok) — točne poti takrat ne uporabimo.
 */
function dangerNodes(node, v) {
  const out = [];
  let unknown = false;
  const has = (n) => freeVars(n).has(v);
  const visit = (n) => {
    if (!n || typeof n !== "object" || unknown) return;
    if (n.k === "/" && has(n.b)) out.push(n.b);
    if (n.k === "^" && has(n.a)) {
      let e = n.b;
      while (e?.k === "grp") e = e.a;
      if (!(e?.k === "num" && Number.isInteger(e.v) && e.v >= 0)) out.push(n.a);
    }
    if (n.k === "call") {
      if (!SAFE_FNS.has(n.f)) unknown = true;
      else if ((n.f === "ln" || n.f === "log" || n.f === "logb" || n.f === "sqrt" || n.f === "cbrt") && has(n.args[0])) out.push(n.args[0]);
      else if ((n.f === "logb") && n.args[1] && has(n.args[1])) out.push(n.args[1]);
      else if ((n.f === "tan" || n.f === "sec") && has(n.args[0])) out.push({ k: "call", f: "cos", args: [n.args[0]] });
      else if ((n.f === "cot" || n.f === "csc") && has(n.args[0])) out.push({ k: "call", f: "sin", args: [n.args[0]] });
    }
    if (n.k === "pw" || n.k === "int" || n.k === "sum" || n.k === "deriv") unknown = true;
    for (const k in n) if (k !== "k") {
      const c = n[k];
      if (Array.isArray(c)) c.forEach((x) => (Array.isArray(x) ? x.forEach(visit) : visit(x)));
      else if (c && typeof c === "object") visit(c);
    }
  };
  visit(node);
  return unknown ? null : out;
}
// Ali ima g (x ↦ število) ničlo v notranjosti [lo, hi]: menjava predznaka na gosti mreži ali lokalni minimum |g|,
// ki ga ternarno iskanje spravi na ~0. NaN (zunaj definicije) šteje kot ničla.
function hasInnerZero(g, lo, hi) {
  const N = 16384;
  const h = (hi - lo) / N;
  const xs = [];
  const ys = [];
  let big = 0;
  for (let i = 0; i <= N; i++) {
    const x = i === N ? hi : lo + i * h;
    const y = g(x);
    if (Number.isNaN(y) || !Number.isFinite(y)) {
      if (i > 0 && i < N) return true;
      continue;
    }
    xs.push(x);
    ys.push(y);
    big = Math.max(big, Math.abs(y));
  }
  const edge = 1e-12 * (hi - lo);
  for (let i = 0; i + 1 < ys.length; i++) {
    if (ys[i] === 0 && xs[i] - lo > edge && hi - xs[i] > edge) return true;
    if (Math.sign(ys[i]) * Math.sign(ys[i + 1]) < 0) return true;
  }
  for (let i = 1; i + 1 < ys.length; i++) {
    const m = Math.abs(ys[i]);
    if (!(m <= Math.abs(ys[i - 1]) && m <= Math.abs(ys[i + 1]) && m < 1e-3 * big)) continue;
    let p = xs[i - 1];
    let q = xs[i + 1];
    for (let k = 0; k < 120; k++) {
      const m1 = p + (q - p) / 3;
      const m2 = q - (q - p) / 3;
      if (Math.abs(g(m1)) < Math.abs(g(m2))) q = m2;
      else p = m1;
    }
    const c = 0.5 * (p + q);
    if (Math.abs(g(c)) <= 1e-9 * Math.max(big, 1e-300) && c - lo > edge && hi - c > edge) return true;
  }
  return false;
}

// Številski izračun je obupal (∫(sin x; 0; 10⁴): tisoči nihajev, »ni mogoče zanesljivo«). Če znamo nedoločeni
// integral F (preverjen z odvodom) in je F na [a, b] zvezna, je vrednost F(b) − F(a) (»=«). Zveznost preverimo v 4096
// točkah: F in f sta končni, prirastek F pa ne presega 2·max|f|·h (skok veje atan ali ln bi to mejo prekoračil).
function exactFallback(raw, env) {
  try {
    const line = compileLine(raw, env);
    let n = line.ast;
    while (n.k === "grp") n = n.a;
    if (n.k !== "int" || !n.lo || !n.hi) return null;
    const a = line.run(n.lo)(line.scope);
    const b = line.run(n.hi)(line.scope);
    if (!Number.isFinite(a) || !Number.isFinite(b) || a === b) return null;
    const F = antiderivativeAst(line, n.a, n.v);
    if (!F) return null;
    const mkr = (node) => {
      const g = line.run(node);
      return (x) => {
        const sc = Object.create(line.scope);
        sc[n.v] = x;
        const y = g(sc);
        return typeof y === "number" ? y : NaN;
      };
    };
    // pol ali veja (1/(x − 1) + sin x: ln|x − 1| v F) kjerkoli v notranjosti [a, b] → točne poti ne uporabimo
    {
      const dn = [...(dangerNodes(line.rw(n.a), n.v) ?? [null]), ...(dangerNodes(F, n.v) ?? [null])];
      if (dn.includes(null)) return null;
      const lo0 = Math.min(a, b);
      const hi0 = Math.max(a, b);
      for (const d of dn) if (hasInnerZero(mkr(d), lo0, hi0)) return null;
    }
    const mk = (node) => {
      const g = line.run(node);
      return (x) => {
        const sc = Object.create(line.scope);
        sc[n.v] = x;
        const y = g(sc);
        return typeof y === "number" ? y : NaN;
      };
    };
    const Fx = mk(F);
    const fx = mk(n.a);
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    const N = 4096;
    const h = (hi - lo) / N;
    let x0 = lo + 0.5 * h;
    let F0 = Fx(x0);
    let f0 = fx(x0);
    if (!Number.isFinite(F0) || !Number.isFinite(f0)) return null;
    for (let i = 1; i < N; i++) {
      const x1 = lo + (i + 0.5) * h;
      const F1 = Fx(x1);
      const f1 = fx(x1);
      const fm = fx(0.5 * (x0 + x1));
      if (!Number.isFinite(F1) || !Number.isFinite(f1) || !Number.isFinite(fm)) return null;
      const bound = 2 * Math.max(Math.abs(f0), Math.abs(f1), Math.abs(fm)) * h + 1e-12 * (Math.abs(F0) + Math.abs(F1) + 1);
      if (Math.abs(F1 - F0) > bound) return null;
      [x0, F0, f0] = [x1, F1, f1];
    }
    // krajišči: vrednost F, sicer enostranska limita, ki se ustali
    let lim = false;
    const end = (x, sd) => {
      const y = Fx(x);
      if (Number.isFinite(y)) return y;
      lim = true;
      const y1 = Fx(x + sd * (hi - lo) * 1e-13);
      const y2 = Fx(x + sd * (hi - lo) * 1e-16);
      return Math.abs(y1 - y2) <= 1e-9 * Math.max(1, Math.abs(y2)) ? y2 : NaN;
    };
    const sd = b > a ? 1 : -1;
    let value = end(b, -sd) - end(a, sd);
    if (lim) value = Number(value.toPrecision(12));
    if (!Number.isFinite(value)) return null;
    return { kind: "value", value, tex: lineTex(line.ast, env.comma !== false) };
  } catch {
    return null;
  }
}

/**
 * Sporočilo za napako določenega integrala (kalkulator in orodje Analiza govorita isto): [ključ prevoda, parametri]
 * ali null, če napaka ni od integrala.
 */
export function integralErrorKey(e) {
  switch (e?.code) {
    case "intDiverge":
      return e.info?.pv !== undefined ? ["sc.errIntPv", { pv: e.info.pv }] : [e.info?.inf ? "sc.errIntDivergeInf" : "sc.errIntDiverge", {}];
    case "intUndefined":
      return ["sc.errIntUndefined", {}];
    case "intUnknown":
    case "intTimeout":
      return ["sc.errIntUnknown", {}];
    default:
      return null;
  }
}

/** ∫ f(x) od a do b za orodje Analiza: isti izračun (točno ali »≈«) in iste napake kot znanstveni kalkulator. */
export function integralOf(fText, a, b, { live = false } = {}) {
  const num = (v) => (v === Infinity ? "∞" : v === -Infinity ? "−∞" : String(v));
  // comma: true bere decimalno vejico (x^0,5) in piko (x^0.5) kot v orodju; meji v zapisu s piko
  return analyze(`∫(${fText};${num(a)};${num(b)})`, { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true, live });
}

/**
 * Odvodi in integrali so vedno v radianih (d/dx sin x = cos x, ∫ sin x od 0 do π = 2), tudi v načinu DEG in GRA
 * (dogovor kalkulatorja, docs/oblikovanje.md »Enota kota«). Isto okolje uporabljata izračun (analyze) in sproten predogled
 * (sci-vnos.js analyzeLive), da predogled in rezultat nikoli ne pokažeta različnih števil (AUDIT-055).
 */
export function calculusEnv(text, env = {}) {
  if (!(env.deg || env.grad)) return env;
  const src = String(text ?? "");
  const rad = { ...env, deg: false, grad: false };
  if (!/d\/d|∫|'|′/.test(src)) return env;
  // Cela vrstica je ∫ ali d/dx: v radianih (tudi točna vrednost iz nedoločenega integrala, simbolni odvod). Sicer
  // (sin(30) + ∫(x; 0; 1)) le notranjost ∫ in d/dx (math.js compile, calcRad); ostanek ostane v izbrani enoti.
  try {
    let n = compileLine(src, env)?.ast;
    while (n?.k === "grp") n = n.a;
    if (n?.k === "int" || n?.k === "der" || (n?.k === "ufn" && n.d)) return rad;
  } catch {}
  return env;
}

export function analyze(text, env = {}) {
  const comma = env.comma !== false;
  const vars = env.vars || {};
  let raw = String(text ?? "").trim();
  if (!raw) return null;
  deadline = Date.now() + BUDGET_MS;

  // sistem: več enačb, ločenih s »;« na vrhnji ravni
  const parts = splitTop(raw, ";\n").map((x) => x.trim()).filter(Boolean);
  if (parts.length >= 2 && parts.every((p) => /[=<>≤≥]/.test(p))) return system(parts, env);
  if (parts.length === 1) raw = parts[0]; // »x² = 4;« (odvečno ločilo na koncu)
  else if (!parts.length) return null;

  // lim_(x→a)(f) – zapis s tipkovnice klepeta (symbols.js) – je limita(f; x; a) (AUDIT-051)
  raw = limText(raw);
  // simbolno računanje: poenostavi(…), razvij(…), razstavi(…), reši(…; x) (public/graph/cas.js)
  const cmd = parseCommand(raw);
  if (cmd) {
    const r = runCas(cmd, env);
    // reši(x³ = 2; x) brez drugih črk: rešitve poišče številski reševalnik
    if (r.error?.code === "casDegree" && cmd.op === "solve" && /[=]/.test(cmd.inner)) {
      const num = analyze(cmd.inner, env);
      if (num?.kind === "solve" && num.v === r.error.info.v) return { ...num, tex: r.tex || num.tex };
    }
    return r;
  }
  // razstavi(x² − 1)/(x + 1): ukaz, ki mu sledi še kaj, ni zmnožek črk r·a·z·s·t·a·v·i
  if (commandStart(raw)) return { error: { code: "casTrailing", info: {} } };

  // definicija funkcije
  const def = functionDef(raw);
  if (def) {
    try {
      const funcs = { ...(env.funcs || {}), [def.name]: { param: def.param, body: def.body } };
      const line = compileLine(raw.replace(/^[^=]*=/, `${def.name}(${def.param}) =`), { ...env, funcs });
      const body = compileLine(def.body, { ...env, funcs, vars: { ...vars } });
      const bad = unknownsOf(body.ast, vars).filter((x) => x !== def.param);
      if (bad.length) return { error: { code: "missing", info: { names: bad } } };
      return { kind: "func", name: def.name, param: def.param, body: def.body, tex: lineTex(line.ast, comma), plot: def.param === "x" ? [`y = ${plotText(def.body, env)}`] : [] };
    } catch (e) {
      return { error: { code: e.code || "other", info: e.info || {} } };
    }
  }

  env = calculusEnv(raw, env);
  const pr = polRec(raw, env);
  if (pr) return pr;
  const r = evaluate(raw, env);
  // √(−1), ln(−1): v realnih številih ni vrednosti; povemo kompleksno (prej »npr. deljenje z 0«, AUDIT-051)
  // i in j kot shranjeni spremenljivki: kompleksni račun bi ju vzel za imaginarno enoto (√(−1) + i pri i = 2 ni 2i)
  if (r && !r.error && Number.isNaN(r.value) && !env.live && !("i" in vars) && !("j" in vars)) {
    const z = complexOf(raw, env);
    if (z && z[1] !== 0) return { error: { code: "notReal", info: { re: z[0], im: z[1] } } };
  }
  if (r && !r.error) return { kind: "value", ...(r.est ? exactIntegral(raw, env, r) : r) };
  if (!r) return null;
  const code = r.error.code;
  if ((code === "intUnknown" || code === "intTimeout") && !env.live) return exactFallback(raw, env) || r;
  if (code !== "missing" && code !== "notCalc") return r;

  // kompleksno število (i je imaginarna enota, če ni spremenljivka)
  if (code === "missing" && r.error.info.names.every((n) => n === "i") && !("i" in vars)) {
    try {
      const [re, im] = complexValue(raw, env);
      const line = compileLine(raw, env);
      return { kind: "complex", re: clean(re), im: clean(im), tex: lineTex(line.ast, comma) };
    } catch (e) {
      return { error: { code: e.code || "other", info: e.info || {} } };
    }
  }

  let line;
  try {
    line = compileLine(raw, env);
  } catch (e) {
    return { error: { code: e.code || "other", info: e.info || {} } };
  }
  const { ast, scope, run } = line;
  const tex = lineTex(ast, comma);
  const U = unknownsOf(line.rw(ast), vars).sort((a, b) => (a === "x" ? -1 : b === "x" ? 1 : a.localeCompare(b)));
  const fnOf = (node, v) => {
    const f = run(node);
    return (x) => {
      const s = Object.create(scope);
      s[v] = x;
      const y = f(s);
      return Array.isArray(y) ? (y.length === 1 ? y[0] : NaN) : y;
    };
  };

  try {
    if (ast.k === "cmp") {
      const cmp = splitCmp(raw);
      if (U.length === 0) {
        const ok = run(ast)(scope);
        return { kind: "bool", value: ok === true || ok === 1, tex };
      }
      if (U.length === 1) {
        const v = U[0];
        const plot = v === "x" && cmp && ast.ops.length === 1 ? plotPair(cmp, env) : [];
        // istovetnost (AUDIT-048): 1/(x − 2) = 1/(x − 2), x/x = 1, √x = √x veljajo za vsak x, kjer sta strani definirani
        // L − R je konstanta c: x = x + 10⁻¹² in x/x = 2 nimata rešitve (prej »x ∈ ℝ« oziroma »x = −100«)
        const id = ast.ops.length === 1 && cmp ? identityOf(cmp, env, v, fnOf(ast.terms[0], v), fnOf(ast.terms[1], v)) : null;
        const holds = id && CMP_OK[ast.ops[0]](id.c);
        // pogoj iz CAS mora opisati, kje sta strani res definirani (√(x² − 1): ne le x ≥ 1; ∛x tudi za x < 0)
        if (id && (!holds || condMatches(id.cond, env, v, fnOf(ast.terms[0], v), fnOf(ast.terms[1], v)))) {
          const op = ast.ops[0];
          const cond = holds && id.cond ? { cond: id.cond } : {};
          if (op === "=") return holds ? { kind: "solve", v, all: true, roots: [], complex: [], ...cond, tex, plot } : { kind: "solve", v, none: true, roots: [], complex: [], tex, plot };
          // a ≤ a velja povsod v definicijskem območju, a < a nikjer
          return { kind: "ineq", v, intervals: holds ? [{ lo: -Infinity, loIn: false, hi: Infinity, hiIn: false }] : [], ...cond, tex, plot };
        }
        if (ast.ops.length === 1 && ast.ops[0] === "=") {
          const L = fnOf(ast.terms[0], v);
          const R = fnOf(ast.terms[1], v);
          const F = (x) => L(x) - R(x);
          const pr = polyRootsOf(ast.terms[0], ast.terms[1], v, scope, run, unitOf(env));
          // AUDIT-053: točen preizkus številske rešitve, kadar je enačba v racionalnih številih in π
          const vf = (x) => verifiedForm(ast.terms[0], ast.terms[1], scope, v, x, 0, true, unitOf(env));
          const res = solveOne(F, v, { comma, unit: unitOf(env), src: raw, pr, vf });
          return { ...res, tex, plot };
        }
        const pairs = [];
        for (let i = 0; i + 1 < ast.terms.length; i++) pairs.push([fnOf(ast.terms[i], v), fnOf(ast.terms[i + 1], v)]);
        // periodična neenačba (sin x > 0): rešitve na eni periodi kota, kot pri enačbah
        const P = PERIOD[unitOf(env)];
        const periodic = TRIG.test(raw) && pairs.every(([L, R]) => isPeriodic((x) => L(x) - R(x), P));
        const lists = periodic ? [] : ast.terms.slice(0, -1).map((t, i) => polyRootsOf(t, ast.terms[i + 1], v, scope, run));
        const res = solveIneq(pairs, ast.ops, v, periodic ? P : 0, lists);
        const full = res.intervals.length === 1 && res.intervals[0].lo === -Infinity && res.intervals[0].hi === Infinity;
        return { ...res, ...(periodic && res.intervals.length && !full ? { interval: periodTex(unitOf(env), comma), periodic: true } : {}), tex, plot };
      }
      // enačba s črkami: ponudimo »Reši za …« (in graf, če sta neznanki x in y)
      const solveFor = ast.ops.length === 1 && ast.ops[0] === "=" && casInfo(ast, scope) ? U : null;
      if (U.length === 2 && U.includes("x") && U.includes("y")) return { kind: "plot", tex, plot: [plotText(raw, env)], ...(solveFor ? { solveFor } : {}) };
      if (solveFor) return { kind: "symeq", tex, solveFor };
      return { error: { code: "missing", info: { names: U.slice(1) } } };
    }
    if (U.length === 1) {
      const v = U[0];
      if (ast.k === "der" || (ast.k === "grp" && ast.a.k === "der")) {
        const d = ast.k === "der" ? ast : ast.a;
        const res = simplify(diff(d.a, d.v, line.ctx));
        const resTex = toTex(res, { comma, sep: comma ? ";" : "," });
        return { kind: "deriv", tex, resTex, plot: v === "x" ? [`y = ${plotText(raw, env)}`] : [] };
      }
      return { kind: "expr", v, tex, plot: v === "x" ? [`y = ${plotText(raw, env)}`] : [], ...(casInfo(ast, scope) ? { cas: true } : {}) };
    }
    // izraz z več črkami: poenostavi, razvij, razstavi
    if (U.length > 1 && casInfo(ast, scope)) return { kind: "sym", tex, cas: true };
  } catch (e) {
    return { error: { code: e.code || "other", info: e.info || {} } };
  }
  return r;
}

// Je L − R simbolno konstanta (poenostavi, preverjeno s števili)? Vrne { c, cond } – c = 0 za istovetnost, cond je
// definicijsko območje (»x ≠ 2«, »x ≥ 0«) – ali null. Številska pot tega ne zna: L − R je 0 ali šum zaokrožitve povsod,
// zato je vrnila naključne točke ali »rešitve ni« (AUDIT-048).
function identityOf([l, , rr], env, v, L, R) {
  let r;
  try {
    r = runCas({ op: "simplify", name: "simplify", inner: `(${l})-(${rr})` }, { ...env, live: true });
  } catch {
    return null;
  }
  if (r?.kind !== "cas" || typeof r.resTex !== "string") return null;
  if (r.resTex === "0") return { c: 0, cond: r.cond || "" };
  // rezultat brez neznanke: predznak konstante iz vrednosti strani v točki, kjer sta definirani
  if (new RegExp(`(?<![A-Za-z])${v}(?![A-Za-z])`).test(r.resTex.replace(/\\[A-Za-z]+/g, " "))) return null;
  for (const x of [0.37, 1.3, -0.7, 2.9, 5.1, -3.3, 17.3, 0.013]) {
    const d = L(x) - R(x);
    if (typeof d === "number" && Number.isFinite(d) && d !== 0) return { c: d, cond: r.cond || "" };
  }
  return null;
}

// Ali pogoj (TeX »x \ge 1,\; x \ne 2«) velja natanko tam, kjer sta L in R končni? Preverjeno na mreži točk.
function condMatches(cond, env, v, L, R) {
  let tests;
  try {
    tests = (cond ? cond.split(",\\;") : []).map((part) => {
      const line = compileLine(fromTex(part.trim()).replace(/\bne\b/g, "!="), { ...env, comma: false });
      if (line.ast.k !== "cmp") throw new Error("cond");
      const f = line.run(line.ast);
      return (x) => {
        const s = Object.create(line.scope);
        s[v] = x;
        const y = f(s);
        return y === true || y === 1;
      };
    });
  } catch {
    return false;
  }
  const fin = (y) => typeof y === "number" && Number.isFinite(y);
  for (let x = -12.0071; x < 12; x += 0.0937) {
    const def = fin(L(x)) && fin(R(x));
    if (def !== tests.every((t) => t(x))) return false;
  }
  return true;
}

// Vrednost izraza v kompleksnih številih [re, im] (vrže MathError)
function complexValue(raw, env) {
  const s = prepare(raw, { comma: env.comma !== false })
    .replace(/A_\{ans\}/g, `(${env.ans ?? 0})`)
    .replace(/G_\{deg\}/g, env.deg && !env.grad ? "1" : "(π/180)")
    .replace(/G_\{min\}/g, env.deg && !env.grad ? "(1/60)" : "(π/10800)")
    .replace(/G_\{sec\}/g, env.deg && !env.grad ? "(1/3600)" : "(π/648000)");
  if (/[A-Za-z]_\{/.test(s)) throw new MathError("other");
  return evalComplex(s, { deg: !!env.deg && !env.grad });
}
const complexOf = (raw, env) => {
  try {
    const [re, im] = complexValue(raw, env);
    return Number.isFinite(re) && Number.isFinite(im) ? [clean(re), clean(im)] : null;
  } catch {
    return null;
  }
};

// lim_(x→a)(f), lim_{x→a} f, lim_(x->a) f → limita(f; x; a); drugo besedilo ostane
// točka sme imeti en nivo oklepajev: x→(π/2), x→sqrt(2)
const LIM = /^\s*lim\s*_\s*[({]\s*([A-Za-zα-ω])\s*(?:→|->|\\to)\s*((?:[^(){}]|\([^(){}]*\))+?)\s*[)}]\s*/;
export function limText(raw) {
  const m = LIM.exec(raw);
  if (!m) return raw;
  let body = raw.slice(m[0].length).trim();
  if (!body) return raw;
  // en oklepaj okoli celega telesa odstranimo: lim_(x→0)(sin(x)/x)
  if (body[0] === "(") {
    let depth = 0;
    let end = -1;
    for (let i = 0; i < body.length; i++) {
      if (body[i] === "(") depth++;
      else if (body[i] === ")" && --depth === 0) {
        end = i;
        break;
      }
    }
    if (end === body.length - 1) body = body.slice(1, -1);
  }
  return `limita(${body}; ${m[1]}; ${m[2].replace(/\s+/g, "")})`;
}

function plotPair([l, , rr], env) {
  const rhs = rr.trim();
  if (/^0([.,]0*)?$/.test(rhs)) return [`y = ${plotText(l, env)}`];
  return [`y = ${plotText(l, env)}`, `y = ${plotText(rhs, env)}`];
}

function system(parts, env) {
  const comma = env.comma !== false;
  const vars = env.vars || {};
  try {
    const lines = parts.map((p) => compileLine(p, env));
    if (lines.some((l) => l.ast.k !== "cmp" || l.ast.ops.length !== 1 || l.ast.ops[0] !== "=")) return { error: { code: "notCalc", info: {} } };
    const U = [...new Set(lines.flatMap((l) => unknownsOf(l.rw(l.ast), vars)))].sort((a, b) => {
      const order = "xyzw";
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      return (ia < 0 ? 9 : ia) - (ib < 0 ? 9 : ib) || a.localeCompare(b);
    });
    const tex = `\\begin{cases} ${lines.map((l) => lineTex(l.ast, comma)).join(" \\\\ ")} \\end{cases}`;
    const plot = U.length === 2 && U[0] === "x" && U[1] === "y" ? parts.map((p) => plotText(p, env)) : [];
    if (U.length < 1 || U.length > 6) return { error: { code: "missing", info: { names: U } } };
    const Gs = lines.map((l) => {
      const L = l.run(l.ast.terms[0]);
      const R = l.run(l.ast.terms[1]);
      return (vec) => {
        const s = Object.create(l.scope);
        U.forEach((u, j) => (s[u] = vec[j]));
        return L(s) - R(s);
      };
    });
    const res = solveLinear(Gs, U);
    if (res) return { ...res, tex, plot };
    // nelinearen sistem z x in y: pokažemo grafa (presečišča so rešitve)
    if (plot.length) return { kind: "plot", tex, plot, nonlinear: true };
    return { error: { code: "notCalc", info: {} } }; // »Te enačbe ne znam rešiti«
  } catch (e) {
    return { error: { code: e.code || "other", info: e.info || {} } };
  }
}

/** TeX rezultata sistema. */
export function systemTex(r, comma = true, mode = "auto") {
  return r.unknowns.map((u, j) => `${u} = ${plainTex(r.values[j], comma, mode)}`).join(",\\quad ");
}
