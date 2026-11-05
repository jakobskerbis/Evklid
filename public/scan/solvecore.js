// Skeniranje nalog – reševalnik po korakih (brez AI, brez DOM; teče tudi v Node in v mobilni aplikaciji).
//
// solve(text, { goal, complex }) vrne:
//   { ok, kind, goal, goals, problemTex, answer: { tex, approx }, methods: [{ id, steps }], graph, numberLine, verified }
// Korak: { title: {k, v}, tex, note, why: {k, v}, whyTex }. Besedila so ključi i18n (public/i18n/sl.js, scan.*),
// zato jih vmesnik prevede v jezik učenca; TeX v spremenljivkah se izriše s KaTeX.
//
// Vsak rezultat je preverjen: rešitve enačb vstavimo v prvotno enačbo (točno z ulomki), poenostavljene
// izraze primerjamo s prvotnim v naključnih točkah, odvode z numeričnim odvodom. Kar ne prestane preverjanja,
// se ne pokaže kot rešitev (vrne ok:false in vmesnik ponudi AI rešitev, ki se preveri enako).

import { parse, compile, diff, simplify, toTex as mathTex, normalize, joinThousands } from "../graph/math.js";
import { Q, P, AlgebraError, polyOf, tryPoly, constQ, termsTex, termTex, isqrt, lcmInt, gcdInt, approxTex, monoKey } from "./algebra.js";

export { Q, P };

const T = (k, v = {}) => ({ k, v });
const step = (title, tex, o = {}) => ({ title, tex, ...o });

// ---------------------------------------------------------------------------
// Priprava besedila

// Prepis s fotografije ali tipkovnice → oblika, ki jo razume razčlenjevalnik.
export function prep(text) {
  // »1 000«, »1\,000«, »1~000« je tisoč, ne 1 · 0 (texToText da namesto \, presledek)
  let s = joinThousands(String(text ?? "").replace(/(\d)(?:\\[,;: ]|~|\{\\,\})(?=\d{3}(?!\d))/g, "$1 "))
    .replace(/\\left|\\right/g, "")
    .replace(/\\dfrac|\\tfrac/g, "\\frac")
    .replace(/\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, "(($1)/($2))")
    .replace(/\\sqrt\s*\{([^{}]*)\}/g, "sqrt($1)")
    .replace(/\\(?:operatorname|mathrm)\{([a-z]+)\}/g, "$1")
    .replace(/\\(sin|cos|tan|cot|ln|log|exp)\b/g, "$1")
    .replace(/[{]/g, "(")
    .replace(/[}]/g, ")")
    .replace(/\*\*/g, "^")
    .replace(/[×·⋅]/g, "*")
    .replace(/÷/g, "/")
    .replace(/\s*=\s*\?\s*$/, "")
    .replace(/\s*=\s*$/, "")
    .replace(/^\s*(reši|izračunaj|poenostavi|razstavi|odvajaj|solve|calculate|simplify|factor)\s*[:.]?\s*/i, "")
    .trim();
  // a/b z dvema celima številoma je ulomek: 3/4·2/5 = (3/4)·(2/5), ne ((3/4)·2)/5.
  s = s.replace(/(?<![\^/\d.,])(\d+)\s*\/\s*(\d+)(?![\d.,]*\s*[\^!])/g, "($1/$2)");
  return s;
}

// Sistem: dve (ali več) enačb, ločenih s podpičjem, novo vrstico ali », « (decimalna vejica nima presledka).
export function splitSystem(text) {
  const parts = String(text)
    .split(/;|\n|,\s+(?=[^,]*=)|\\\\/)
    .map((p) => p.replace(/\\begin\{cases\}|\\end\{cases\}|&/g, "").trim())
    .filter(Boolean);
  return parts.length >= 2 && parts.every((p) => /=/.test(p) && !/[<>≤≥]/.test(p)) ? parts : null;
}

// ---------------------------------------------------------------------------
// Zapis drevesa v TeX (lepši od splošnega: ulomki Q, oklepaji pri vstavljanju, decimalna vejica)

const unwrap = (n) => (n && n.k === "grp" ? unwrap(n.a) : n);
const isLeafNum = (n) => n && (n.k === "num" || n.k === "q");
const negLike = (n) => (n.k === "num" && n.v < 0) || (n.k === "q" && n.q.sign < 0) || n.k === "neg";

export function tex(node, opt = {}) {
  const t = (n) => tex(n, opt);
  const n = node;
  switch (n.k) {
    case "num": {
      const q = safeQ(n.v);
      return q ? q.tex({ dec: true }) : approxTex(n.v, 6);
    }
    case "q":
      if (n.raw) return `${n.raw[0] < 0 ? "-" : ""}\\frac{${Math.abs(n.raw[0])}}{${n.raw[1]}}`;
      return n.q.tex({ dec: !!n.dec });
    case "var":
      return n.name;
    case "const":
      return mathTex(n, opt);
    case "grp":
      return `\\left(${t(n.a)}\\right)`;
    case "neg": {
      const a = unwrap(n.a);
      return a.k === "+" || a.k === "-" || negLike(a) ? `-\\left(${t(a)}\\right)` : `-${t(n.a)}`;
    }
    case "+": {
      const b = n.b;
      return negLike(b) && b.k !== "neg" ? `${t(n.a)} + \\left(${t(b)}\\right)` : `${t(n.a)} + ${t(b)}`;
    }
    case "-": {
      const b = n.b.k === "grp" ? n.b : n.b;
      const wrapB = b.k === "+" || b.k === "-" || negLike(b);
      return `${t(n.a)} - ${wrapB ? `\\left(${t(b)}\\right)` : t(b)}`;
    }
    case "*": {
      const a = n.a;
      const b = n.b;
      const wa = a.k === "+" || a.k === "-" ? `\\left(${t(a)}\\right)` : t(a);
      const wb = b.k === "+" || b.k === "-" || negLike(b) ? `\\left(${t(b)}\\right)` : t(b);
      let bLead = unwrap(b);
      while (bLead.k === "*" && !bLead.explicit) bLead = unwrap(bLead.a);
      const implicit =
        !opt.explicit &&
        (b.k === "grp" || bLead.k === "var" || bLead.k === "const" || (bLead.k === "^" && ["var", "const"].includes(unwrap(bLead.a).k)) || bLead.k === "call") &&
        !negLike(b) &&
        !(a.k === "q" && !a.q.int && !a.dec);
      return implicit ? `${wa}${wb}` : `${wa} \\cdot ${wb}`;
    }
    case "/": {
      const isFr = (x) => (x.k === "q" && (!x.q.int || x.raw)) || (x.k === "/" && x.frac);
      if (!n.frac && (isFr(unwrap(n.a)) || isFr(unwrap(n.b)))) {
        const w = (x) => (isFr(unwrap(x)) ? t(unwrap(x)) : x.k === "grp" || ["+", "-"].includes(x.k) || negLike(x) ? `\\left(${t(unwrap(x))}\\right)` : t(x));
        const wb = w(n.b);
        return `${w(n.a)} : ${wb.startsWith("-") ? `\\left(${wb}\\right)` : wb}`;
      }
      return `\\frac{${t(unwrap(n.a))}}{${t(unwrap(n.b))}}`;
    }
    case "^": {
      const a = n.a;
      const ua = unwrap(a);
      const atom = (ua.k === "var" || ua.k === "const" || (ua.k === "num" && ua.v >= 0 && Number.isInteger(ua.v)) || (ua.k === "q" && ua.q.int && ua.q.sign >= 0)) && a.k !== "grp";
      const base = atom || a.k === "grp" ? t(a) : `\\left(${t(a)}\\right)`;
      return `${base}^{${t(unwrap(n.b))}}`;
    }
    case "pct":
      return `${t(n.a)}\\,\\%`;
    case "call":
      if (n.f === "sqrt") return `\\sqrt{${t(unwrap(n.args[0]))}}`;
      if (n.f === "abs") return `\\left|${t(unwrap(n.args[0]))}\\right|`;
      return mathTex(n, opt);
    case "cmp":
      return n.terms.map((x, i) => (i ? ` ${REL[n.ops[i - 1]]} ` : "") + t(x)).join("");
    default:
      return mathTex(n, opt);
  }
}

export const REL = { "=": "=", "<": "<", ">": ">", "<=": "\\le", ">=": "\\ge" };
const FLIP = { "<": ">", ">": "<", "<=": ">=", ">=": "<=", "=": "=" };

function safeQ(v) {
  try {
    return Q.of(v);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Razčlenitev strani enačbe na člene

// vsota → [{ sign, node }]
function sideTerms(node, sign = 1, out = []) {
  const n = node.k === "grp" && (unwrap(node).k === "+" || unwrap(node).k === "-") && sign === 1 ? unwrap(node) : node;
  if (n.k === "+") {
    sideTerms(n.a, sign, out);
    sideTerms(n.b, sign, out);
  } else if (n.k === "-") {
    sideTerms(n.a, sign, out);
    sideTerms(n.b, -sign, out);
  } else if (n.k === "neg" && unwrap(n.a).k !== "+" && unwrap(n.a).k !== "-") {
    sideTerms(n.a, -sign, out);
  } else out.push({ sign, node: n });
  return out;
}

// člen → koeficient (Q) × faktorji (drevesa, ki niso števila)
function decompose(node) {
  const n = node;
  if (n.k === "grp") {
    const c = constQ(n);
    if (c) return { c, f: [] };
    const inner = unwrap(n);
    if (inner.k === "*" || inner.k === "/" || inner.k === "neg") return decompose(inner);
    return { c: Q.ONE, f: [n] };
  }
  const c = constQ(n);
  if (c) return { c, f: [] };
  if (n.k === "*") {
    const a = decompose(n.a);
    const b = decompose(n.b);
    return { c: a.c.mul(b.c), f: [...a.f, ...b.f] };
  }
  if (n.k === "/") {
    const d = constQ(n.b);
    if (!d || d.zero) throw new AlgebraError("rational");
    const a = decompose(n.a);
    if (unwrap(n.a).k === "+" || unwrap(n.a).k === "-") return { c: d.inv(), f: [grp(unwrap(n.a))] };
    return { c: a.c.div(d), f: a.f };
  }
  if (n.k === "neg") {
    const a = decompose(n.a);
    return { c: a.c.neg(), f: a.f };
  }
  return { c: Q.ONE, f: [n] };
}

const grp = (a) => ({ k: "grp", a });
const lines = (rows) => (rows.length > 1 ? `\\begin{gathered} ${rows.join(" \\\\ ")} \\end{gathered}` : rows[0]);
const qn = (q, dec = false) => ({ k: "q", q: Q.of(q), dec });
const mulN = (a, b) => ({ k: "*", a, b });

// izpis člena {sign, c, f}
function termNodeTex({ c, f }, first) {
  const sgn = c.sign < 0 ? "-" : "+";
  const a = c.abs();
  let body;
  if (!f.length) body = a.tex({ dec: true });
  else {
    const fs = f.map((x) => {
      const u = unwrap(x);
      return u.k === "+" || u.k === "-" ? `\\left(${tex(u)}\\right)` : tex(x);
    });
    const coef = a.one ? "" : a.int || a.finiteDecimal ? a.tex({ dec: true }) : a.tex();
    const joined = fs.reduce((s, x, i) => (i && /^\d/.test(x) ? `${s} \\cdot ${x}` : s + x), "");
    body = coef && /^\d/.test(joined) ? `${coef} \\cdot ${joined}` : coef + joined;
  }
  return first ? (sgn === "-" ? "-" : "") + body : ` ${sgn} ${body}`;
}
const termsNodeTex = (list) => (list.length ? list.map((t, i) => termNodeTex(t, i === 0)).join("") : "0");

// ---------------------------------------------------------------------------
// Razširjanje (odprava oklepajev) z razlago


// člen {c, f} → seznam monomov brez združevanja (kot v zvezku) + oznaka uporabljenega pravila
function rawExpand({ c, f }) {
  let list = [{ m: {}, c }];
  const rules = new Set();
  for (const x of f) {
    const u = unwrap(x);
    let fl;
    if (u.k === "^" && constQ(u.b)?.eq(2) && tryPoly(u.a)?.terms().length === 2) {
      // (a ± b)² = a² ± 2ab + b²
      const [p, q] = tryPoly(u.a).sorted();
      fl = [mulMono(p, p), { m: mergeM(p.m, q.m), c: p.c.mul(q.c).mul(2) }, mulMono(q, q)];
      rules.add(p.c.sign * q.c.sign < 0 ? "sqMinus" : "sqPlus");
    } else {
      const p = polyOf(x);
      fl = p.sorted();
      if (u.k === "^" && p.terms().length > 1) rules.add("power");
    }
    if (fl.length > 1 && list.length > 1) {
      rules.add(isDiffSquares(list, fl) ? "diffSq" : "foil");
    } else if (fl.length > 1 || list.length > 1) rules.add(c.sign < 0 || list.some((t) => t.c.sign < 0) ? "distNeg" : "dist");
    const out = [];
    for (const a of list) for (const b of fl) out.push(mulMono(a, b));
    list = out;
  }
  return { list, rules };
}
const mergeM = (a, b) => {
  const o = { ...a };
  for (const [v, e] of Object.entries(b)) o[v] = (o[v] || 0) + e;
  return o;
};
const mulMono = (a, b) => ({ m: mergeM(a.m, b.m), c: a.c.mul(b.c) });
function isDiffSquares(a, b) {
  if (a.length !== 2 || b.length !== 2) return false;
  return monoKey(a[0].m) === monoKey(b[0].m) && monoKey(a[1].m) === monoKey(b[1].m) && a[0].c.eq(b[0].c) && a[1].c.eq(b[1].c.neg());
}

const RULE_WHY = { dist: "scan.w.dist", distNeg: "scan.w.distNeg", foil: "scan.w.foil", sqPlus: "scan.w.sqPlus", sqMinus: "scan.w.sqMinus", diffSq: "scan.w.diffSq", power: "scan.w.power" };

// Strani enačbe: drevo → odprava ulomkov → oklepajev → združevanje. Vrne korake in polinoma strani.
function normalizeSides(sides, ops, { lcdAllowed = true } = {}) {
  const steps = [];
  const fmt = (lists) => lists.map((l, i) => (i ? ` ${REL[ops[i - 1]]} ` : "") + l).join("");
  let terms = sides.map((s) => sideTerms(s).map(({ sign, node }) => {
    const d = decompose(node);
    return { c: sign < 0 ? d.c.neg() : d.c, f: d.f };
  }));
  // 1. ulomki in decimalna števila
  if (lcdAllowed) {
    let l = 1n;
    let dec = false;
    for (const side of terms) for (const t of side) {
      l = lcmInt(l, t.c.d);
      for (const f of t.f) {
        const p = tryPoly(f);
        if (p) l = lcmInt(l, p.denLcm());
      }
    }
    const hasDec = (n) => {
      let found = false;
      walkTree(n, (x) => {
        if (x.k === "num" && !Number.isInteger(x.v)) found = true;
      });
      return found;
    };
    dec = sides.some(hasDec) && !sides.some((s) => hasFracNode(s));
    if (l > 1n) {
      const L = new Q(l);
      terms = terms.map((side) => side.map((t) => {
        const c = t.c.mul(L);
        // faktor z ulomki v notranjosti (npr. (x/2 + 1)) pomnožimo, da v oklepaju ni ulomkov
        if (!c.int && t.f.length === 1) return { c: Q.ONE, f: [grp(polyNode(polyOf(t.f[0]).scale(c)))] };
        return { c, f: t.f };
      }));
      const ltex = String(l);
      steps.push(
        step(T(dec ? "scan.s.clearDec" : "scan.s.clearFrac", { n: ltex }), fmt(terms.map(termsNodeTex)), {
          note: `/ \\cdot ${ltex}`,
          why: T(dec ? "scan.w.clearDec" : "scan.w.clearFrac", { n: ltex }),
        }),
      );
    }
  }
  // 2. oklepaji
  const rules = new Set();
  let raw = terms.map((side) => side.flatMap((t) => {
    const r = rawExpand(t);
    r.rules.forEach((x) => rules.add(x));
    return r.list.filter((x) => !x.c.zero);
  }));
  const changed = terms.some((side) => side.some((t) => t.f.some((f) => tryPoly(f)?.terms().length > 1 || unwrap(f).k === "^" && tryPoly(unwrap(f).a)?.terms().length > 1)));
  if (changed) {
    const why = [...rules].map((r) => RULE_WHY[r]).filter(Boolean);
    steps.push(step(T("scan.s.expand"), fmt(raw.map((l) => termsTex(l))), { why: T(why[0] || "scan.w.dist"), why2: why.slice(1).map((k) => T(k)) }));
  }
  // 3. podobni členi
  const polys = raw.map((l) => new P(l));
  const needCollect = raw.some((l, i) => l.length !== polys[i].terms().length || !sameOrder(l, polys[i]));
  if (needCollect) steps.push(step(T("scan.s.collect"), fmt(polys.map((p) => p.tex())), { why: T("scan.w.collect") }));
  return { steps, polys };
}

function sameOrder(list, p) {
  const s = p.sorted();
  return list.length === s.length && list.every((t, i) => monoKey(t.m) === monoKey(s[i].m) && t.c.eq(s[i].c));
}

function hasFracNode(n) {
  let f = false;
  walkTree(n, (x) => {
    if (x.k === "/") f = true;
  });
  return f;
}

export function walkTree(n, fn) {
  if (!n || typeof n !== "object") return;
  fn(n);
  for (const k of ["a", "b"]) if (n[k]) walkTree(n[k], fn);
  if (n.args) n.args.forEach((x) => walkTree(x, fn));
  if (n.terms) n.terms.forEach((x) => walkTree(x, fn));
}

// polinom → drevo (za izpis v oklepaju)
function polyNode(p) {
  return parse(p.text().replace(/\((-?\d+)\/(\d+)\)/g, "($1/$2)"));
}

// ---------------------------------------------------------------------------
// Preizkus (vstavljanje rešitve v prvotno enačbo)

function substitute(node, env) {
  if (!node || typeof node !== "object") return node;
  if (node.k === "var" && env[node.name] !== undefined) return { k: "q", q: env[node.name], wrap: true };
  const o = { ...node };
  for (const k of ["a", "b"]) if (node[k]) o[k] = substitute(node[k], env);
  if (node.args) o.args = node.args.map((x) => substitute(x, env));
  if (node.terms) o.terms = node.terms.map((x) => substitute(x, env));
  return o;
}

// vrednost drevesa pri danih (racionalnih) vrednostih spremenljivk – točno, če je mogoče
function valueQ(node, env) {
  const p = tryPoly(substitute(node, env));
  if (p && p.isConst()) return p.constValue();
  return null;
}
function valueNum(node, env) {
  try {
    const f = compile(node);
    return f(env);
  } catch {
    return NaN;
  }
}

function checkStep(sides, ops, v, sols, envOther = {}) {
  const rows = [];
  let ok = true;
  for (const s of sols.slice(0, 4)) {
    const env = { ...envOther, [v]: s.q };
    if (s.q) {
      const vals = sides.map((x) => valueQ(x, env));
      if (vals.some((x) => !x)) {
        ok = false;
        continue;
      }
      const holds = relHolds(vals, ops);
      ok &&= holds;
      const parts = sides.map((x, i) => {
        const sub = tex(substitute(x, env));
        const val = vals[i].tex();
        return `${i === 0 ? "\\sideL" : "\\sideR"} = ${sub === val ? val : `${sub} = ${val}`}`;
      });
      rows.push(`${v} = ${s.q.tex()}:\\quad ${parts.join(",\\quad ")}${holds ? "\\;\\checkmark" : ""}`);
    } else {
      const numEnv = { ...Object.fromEntries(Object.entries(envOther).map(([k, q]) => [k, q.num()])), [v]: s.num };
      const vals = sides.map((x) => valueNum(x, numEnv));
      const holds = Math.abs(vals[0] - vals[1]) < 1e-7 * Math.max(1, Math.abs(vals[0]));
      ok &&= holds;
      rows.push(`${v} \\approx ${approxTex(s.num, 4)}:\\quad \\sideL \\approx ${approxTex(vals[0], 4)},\\quad \\sideR \\approx ${approxTex(vals[1], 4)}${holds ? "\\;\\checkmark" : ""}`);
    }
  }
  return { ok, step: rows.length ? step(T("scan.s.check"), lines(rows), { why: T("scan.w.check", { l: "\\sideL", r: "\\sideR" }) }) : null };
}

function relHolds(vals, ops) {
  for (let i = 0; i < ops.length; i++) {
    const c = vals[i].cmp(vals[i + 1]);
    const op = ops[i];
    if (op === "=" && c !== 0) return false;
    if (op === "<" && !(c < 0)) return false;
    if (op === ">" && !(c > 0)) return false;
    if (op === "<=" && !(c <= 0)) return false;
    if (op === ">=" && !(c >= 0)) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Linearna enačba / neenačba z eno neznanko

function linearSteps(pl, pr, v, op = "=") {
  // pl, pr: polinoma stopnje ≤ 1 v v
  const steps = [];
  const a1 = pl.coef(v, 1);
  const b1 = pl.coef(v, 0);
  const a2 = pr.coef(v, 1);
  const b2 = pr.coef(v, 0);
  const R = REL[op];
  // Pri enačbi, kjer bi bil koeficient pri v na levi negativen, v zberemo na desni (3 = 2x − 2 → 5 = 2x).
  if (op === "=" && a1.sub(a2).sign < 0) {
    const right = [{ m: { [v]: 1 }, c: a2 }, { m: { [v]: 1 }, c: a1.neg() }].filter((t) => !t.c.zero);
    const left = [{ m: {}, c: b1 }, { m: {}, c: b2.neg() }].filter((t) => !t.c.zero);
    const notes = [];
    if (!a1.zero) notes.push(termTex({ m: { [v]: 1 }, c: a1.neg() }, false));
    if (!b2.zero) notes.push(termTex({ m: {}, c: b2.neg() }, false));
    if (notes.length) steps.push(step(T("scan.s.moveRight", { v }), `${termsTex(left) || "0"} = ${termsTex(right)}`, { note: `/ ${notes.join("").trim().replace(/^([+-]) /, "$1")}`, why: T("scan.w.move") }));
    const a = a2.sub(a1);
    const b = b1.sub(b2);
    if (left.length > 1 || right.length > 1) steps.push(step(T("scan.s.collect"), `${b.tex()} = ${termsTex([{ m: { [v]: 1 }, c: a }])}`, { why: T("scan.w.collect") }));
    const sol = b.div(a);
    if (!a.one) steps.push(step(T("scan.s.divide", { a: a.tex(), v }), `${sol.tex()} = ${v}`, { note: `/ : ${a.tex()}`, why: T("scan.w.divide", { v }) }));
    return { steps, value: sol, op };
  }
  // prenos
  if (!a2.zero || !b1.zero) {
    const left = [{ m: { [v]: 1 }, c: a1 }, { m: { [v]: 1 }, c: a2.neg() }].filter((t) => !t.c.zero);
    const right = [{ m: {}, c: b2 }, { m: {}, c: b1.neg() }].filter((t) => !t.c.zero);
    const notes = [];
    if (!a2.zero) notes.push(termTex({ m: { [v]: 1 }, c: a2.neg() }, false));
    if (!b1.zero) notes.push(termTex({ m: {}, c: b1.neg() }, false));
    steps.push(step(T("scan.s.move", { v }), `${termsTex(left)} ${R} ${termsTex(right)}`, { note: `/ ${notes.join("").trim().replace(/^([+-]) /, "$1")}`, why: T("scan.w.move") }));
    if (left.length > 1 || right.length > 1) steps.push(step(T("scan.s.collect"), `${termsTex([{ m: { [v]: 1 }, c: a1.sub(a2) }])} ${R} ${b2.sub(b1).tex()}`, { why: T("scan.w.collect") }));
  }
  const a = a1.sub(a2);
  const b = b2.sub(b1);
  if (a.zero) {
    const holds = relHolds([Q.ZERO, b], [op]);
    steps.push(step(T(`scan.s.${holds ? "allX" : "noX"}${op === "=" ? "" : "Ineq"}`, { v }), `0 ${R} ${b.tex()}`, { why: T(holds ? "scan.w.allX" : "scan.w.noX", { v }) }));
    return { steps, all: holds, none: !holds };
  }
  let rop = op;
  if (!a.one) {
    const flip = a.sign < 0 && op !== "=";
    if (flip) rop = FLIP[op];
    const sol = b.div(a);
    steps.push(
      step(T(flip ? "scan.s.divideFlip" : "scan.s.divide", { a: a.tex(), v }), `${v} ${REL[rop]} ${sol.tex()}`, {
        note: `/ : ${a.sign < 0 ? `\\left(${a.tex()}\\right)` : a.tex()}`,
        why: T(flip ? "scan.w.flip" : "scan.w.divide", { v }),
      }),
    );
    return { steps, value: sol, op: rop };
  }
  return { steps, value: b, op: rop };
}

// ---------------------------------------------------------------------------
// Kvadratna enačba

function sqfree(n) {
  // n = k² · r
  n = BigInt(n);
  let k = 1n;
  let r = n;
  for (let p = 2n; p * p <= r; p++) {
    while (r % (p * p) === 0n) {
      r /= p * p;
      k *= p;
    }
  }
  return { k, r };
}

// rešitev (−b ± k√r)/den v najkrajši obliki
function surdSolutions(a, b, D) {
  // a, b, D: BigInt (cela števila), D > 0 ni popoln kvadrat
  const { k, r } = sqfree(D);
  let num = -b;
  let kk = k;
  let den = 2n * a;
  const g = gcdInt(gcdInt(num, kk), den) || 1n;
  num /= g;
  kk /= g;
  den /= g;
  if (den < 0n) {
    num = -num;
    den = -den;
  }
  const rad = `${kk === 1n ? "" : kk}\\sqrt{${r}}`;
  const part = (sgn) => {
    const top = num === 0n ? (sgn < 0 ? `-${rad}` : rad) : `${num} ${sgn < 0 ? "-" : "+"} ${rad}`;
    return den === 1n ? top : `\\frac{${top}}{${den}}`;
  };
  const pm = num === 0n ? `\\pm ${rad}` : `${num} \\pm ${rad}`;
  const val = (sgn) => (Number(num) + sgn * Number(kk) * Math.sqrt(Number(r))) / Number(den);
  return {
    pmTex: den === 1n ? pm : `\\frac{${pm}}{${den}}`,
    sols: [
      { tex: part(-1), num: val(-1) },
      { tex: part(1), num: val(1) },
    ].sort((x, y) => x.num - y.num),
  };
}

// a, b, c: Q (cela, okrajšana, a > 0)
function quadraticMethods(a, b, c, v, opt = {}) {
  const A = a.n;
  const B = b.n;
  const C = c.n;
  const D = B * B - 4n * A * C;
  const methods = [];
  const sols = []; // { q } ali { num, tex }
  const sqrtD = D >= 0n ? isqrt(D) : null;
  const rational = sqrtD !== null && sqrtD * sqrtD === D;
  if (D >= 0n) {
    if (rational) {
      const r1 = new Q(-B - sqrtD, 2n * A);
      const r2 = new Q(-B + sqrtD, 2n * A);
      sols.push({ q: r1 });
      if (!r1.eq(r2)) sols.push({ q: r2 });
    } else {
      surdSolutions(A, B, D).sols.forEach((s) => sols.push(s));
    }
  }
  const std = `${new P([{ m: { [v]: 2 }, c: a }, { m: { [v]: 1 }, c: b }, { m: {}, c }]).tex()} = 0`;
  const solTex = (s, i, n) => `${v}${n > 1 ? `_{${i + 1}}` : ""} = ${s.q ? s.q.tex() : s.tex}`;
  const solsTex = sols.map((s, i) => solTex(s, i, sols.length)).join(",\\quad ");

  // a) nepopolna enačba (b = 0 ali c = 0)
  if (C === 0n) {
    const lin = new P([{ m: { [v]: 1 }, c: a }, { m: {}, c: b }]);
    methods.push({
      id: "incomplete",
      steps: [
        step(T("scan.s.factorOut", { v }), `${v}\\left(${lin.tex()}\\right) = 0`, { why: T("scan.w.factorOut") }),
        step(T("scan.s.zeroProduct"), `${v} = 0 \\quad \\text{${"\u2228"}} \\quad ${lin.tex()} = 0`.replace("\\text{∨}", "\\lor"), { why: T("scan.w.zeroProduct") }),
        step(T("scan.s.solutions"), solsTex),
      ],
    });
  } else if (B === 0n) {
    const rhs = c.neg().div(a);
    const st = [];
    if (!a.one) st.push(step(T("scan.s.isolateSq", { v }), `${v}^{2} = ${rhs.tex()}`, { note: `/ ${c.neg().sign < 0 ? "" : "+"}${c.neg().tex()},\\; : ${a.tex()}`, why: T("scan.w.isolateSq") }));
    else st.push(step(T("scan.s.isolateSq", { v }), `${v}^{2} = ${rhs.tex()}`, { note: `/ ${c.neg().sign < 0 ? "" : "+"}${c.neg().tex()}`, why: T("scan.w.isolateSq") }));
    if (rhs.sign < 0) st.push(step(T("scan.s.noRealSq"), `${v}^{2} \\ge 0 > ${rhs.tex()}`, { why: T("scan.w.noRealSq") }));
    else {
      const r = rhs.sqrt();
      st.push(step(T("scan.s.root"), `${v} = \\pm\\sqrt{${rhs.tex()}}${r ? ` = \\pm ${r.tex()}` : ""}`, { why: T("scan.w.root") }));
      st.push(step(T("scan.s.solutions"), solsTex));
    }
    methods.push({ id: "incomplete", steps: st });
  }

  // b) razcep (Vieta), kadar so rešitve racionalne
  if (rational && C !== 0n && B !== 0n) {
    const st = [];
    if (A === 1n) {
      const p = -sols[0].q.n;
      const q = sols.length > 1 ? -sols[1].q.n : p;
      st.push(step(T("scan.s.vieta", { p: String(C), s: String(B), m: String(p), n: String(q) }), `${p} \\cdot ${q < 0n ? `(${q})` : q} = ${C},\\quad ${p} + ${q < 0n ? `(${q})` : q} = ${B}`, { why: T("scan.w.vieta") }));
      const f1 = `\\left(${termsTex([{ m: { [v]: 1 }, c: Q.ONE }, { m: {}, c: new Q(p) }].filter((x) => !x.c.zero))}\\right)`;
      const f2 = `\\left(${termsTex([{ m: { [v]: 1 }, c: Q.ONE }, { m: {}, c: new Q(q) }].filter((x) => !x.c.zero))}\\right)`;
      st.push(step(T("scan.s.factored"), p === q ? `${f1}^{2} = 0` : `${f1}${f2} = 0`, { why: T("scan.w.factored") }));
    } else {
      // a(x − r1)(x − r2) → (d1 x − n1)(d2 x − n2)
      const fs = sols.length > 1 ? sols : [sols[0], sols[0]];
      const lin = fs.map((s) => new P([{ m: { [v]: 1 }, c: new Q(s.q.d) }, { m: {}, c: new Q(-s.q.n) }]));
      const lead = a.div(new Q(fs[0].q.d * fs[1].q.d));
      const pre = lead.one ? "" : lead.tex();
      st.push(step(T("scan.s.acMethod", { ac: String(A * C), b: String(B) }), lines([`${v}_{1} + ${v}_{2} = -\\frac{b}{a} = ${b.neg().div(a).tex()},\\quad ${v}_{1} \\cdot ${v}_{2} = \\frac{c}{a} = ${c.div(a).tex()}`, `\\Rightarrow\\; ${solsTex}`]), { why: T("scan.w.vietaA") }));
      st.push(step(T("scan.s.factored"), sols.length > 1 ? `${pre}\\left(${lin[0].tex()}\\right)\\left(${lin[1].tex()}\\right) = 0` : `${pre}\\left(${lin[0].tex()}\\right)^{2} = 0`, { why: T("scan.w.factored") }));
    }
    st.push(step(T("scan.s.zeroProduct"), solsTex, { why: T("scan.w.zeroProduct") }));
    methods.push({ id: "factor", steps: st });
  }

  // c) formula (vedno)
  {
    const st = [];
    st.push(step(T("scan.s.coeffs"), `a = ${a.tex()},\\quad b = ${b.tex()},\\quad c = ${c.tex()}`, { why: T("scan.w.coeffs") }));
    const bW = B < 0n ? `(${B})` : `${B}`;
    const cW = C < 0n ? `(${C})` : `${C}`;
    st.push(step(T("scan.s.disc"), `D = b^{2} - 4ac = ${bW}^{2} - 4 \\cdot ${A} \\cdot ${cW} = ${D}`, { why: T("scan.w.disc") }));
    if (D < 0n) {
      st.push(step(T("scan.s.noReal"), `D = ${D} < 0`, { why: T("scan.w.noReal") }));
      if (opt.complex) {
        const { k, r } = sqfree(-D);
        const re = new Q(-B, 2n * A);
        const im = new Q(k, 2n * A);
        const imT = im.one ? (r === 1n ? "" : `\\sqrt{${r}}`) : `${im.tex()}${r === 1n ? "" : `\\sqrt{${r}}`}`;
        const reT = re.zero ? "" : re.tex();
        st.push(step(T("scan.s.complex"), `${v}_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a} = ${reT} \\pm ${imT ? `${imT}\\, ` : ""}i`, { why: T("scan.w.complex") }));
      }
    } else {
      const pm = rational ? null : surdSolutions(A, B, D);
      const negB = B === 0n ? "" : `${-B}`;
      st.push(
        step(T(D === 0n ? "scan.s.formulaOne" : "scan.s.formula"), `${v}_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a} = \\frac{${negB} \\pm \\sqrt{${D}}}{${2n * A}}${rational ? ` = \\frac{${negB} \\pm ${sqrtD}}{${2n * A}}` : ` = ${pm.pmTex}`}`, {
          why: T(D === 0n ? "scan.w.formulaOne" : "scan.w.formula"),
        }),
      );
      st.push(step(T("scan.s.solutions"), solsTex));
    }
    methods.push({ id: "formula", steps: st });
  }

  // d) dopolnitev do popolnega kvadrata
  if (B !== 0n) {
    const st = [];
    const p = b.div(a);
    const q = c.div(a);
    if (!a.one) st.push(step(T("scan.s.divideA", { a: a.tex() }), `${new P([{ m: { [v]: 2 }, c: Q.ONE }, { m: { [v]: 1 }, c: p }, { m: {}, c: q }]).tex()} = 0`, { note: `/ : ${a.tex()}`, why: T("scan.w.divideA") }));
    const h = p.div(2);
    const rhs = h.mul(h).sub(q);
    const inner = termsTex([{ m: { [v]: 1 }, c: Q.ONE }, { m: {}, c: h }]);
    st.push(step(T("scan.s.complete", { h: h.abs().tex() }), `\\left(${inner}\\right)^{2} - ${h.mul(h).tex()} ${q.sign < 0 ? "-" : "+"} ${q.abs().tex()} = 0`, { why: T("scan.w.complete", { h: h.abs().tex() }), whyTex: `\\left(${inner}\\right)^{2} = ${v}^{2} ${p.sign < 0 ? "-" : "+"} ${termTex({ m: { [v]: 1 }, c: p.abs() }, true)} + ${h.mul(h).tex()}` }));
    st.push(step(T("scan.s.isolateSquare"), `\\left(${inner}\\right)^{2} = ${rhs.tex()}`, { why: T("scan.w.isolateSquare") }));
    if (rhs.sign < 0) st.push(step(T("scan.s.noRealSq"), `\\left(${inner}\\right)^{2} \\ge 0 > ${rhs.tex()}`, { why: T("scan.w.noRealSq") }));
    else {
      const r = rhs.sqrt();
      st.push(step(T("scan.s.root"), `${inner} = \\pm ${r ? r.tex() : `\\sqrt{${rhs.tex()}}`}`, { why: T("scan.w.root") }));
      st.push(step(T("scan.s.solutions"), solsTex, { note: `/ ${h.sign < 0 ? "+" : "-"}${h.abs().tex()}` }));
    }
    methods.push({ id: "square", steps: st });
  }
  return { methods, sols, D };
}

// ---------------------------------------------------------------------------
// Polinomska enačba višje stopnje: racionalne ničle + Hornerjev algoritem

function rationalRoots(coeffs) {
  // coeffs: [a0..an] Q, celi; vrne racionalne ničle
  const an = coeffs[coeffs.length - 1].n;
  const a0 = coeffs[0].n;
  if (a0 === 0n) return [Q.ZERO];
  const divs = (n) => {
    n = n < 0n ? -n : n;
    const out = [];
    for (let i = 1n; i * i <= n && i < 100000n; i++) if (n % i === 0n) out.push(i, n / i);
    return [...new Set(out)];
  };
  const out = [];
  for (const p of divs(a0)) for (const q of divs(an)) for (const s of [1n, -1n]) {
    const r = new Q(s * p, q);
    if (out.some((x) => x.eq(r))) continue;
    if (hornerValue(coeffs, r).zero) out.push(r);
  }
  return out.sort((x, y) => x.cmp(y));
}
function hornerValue(coeffs, r) {
  let acc = Q.ZERO;
  for (let i = coeffs.length - 1; i >= 0; i--) acc = acc.mul(r).add(coeffs[i]);
  return acc;
}
function hornerDivide(coeffs, r) {
  // vrne koeficiente količnika (a0..a_{n-1})
  const n = coeffs.length - 1;
  const out = new Array(n);
  let acc = Q.ZERO;
  for (let i = n; i >= 1; i--) {
    acc = acc.mul(r).add(coeffs[i]);
    out[i - 1] = acc;
  }
  return out;
}
const polyFromCoeffs = (cs, v) => new P(cs.map((c, k) => ({ m: k ? { [v]: k } : {}, c })));

// ---------------------------------------------------------------------------
// Enačbe in neenačbe z eno neznanko

// opt.pre: koraki pred tem (npr. odprava imenovalcev), opt.orig: prvotna naloga (za preizkus in izpis),
// opt.exclude: vrednosti, ki niso v definicijskem območju (imenovalec 0).
function solveOneVar(ast, v, opt = {}) {
  const orig = opt.orig || { ast, sides: ast.terms, ops: ast.ops };
  const ops = orig.ops;
  const sides = orig.sides;
  const norm = normalizeSides(ast.terms, ast.ops);
  const steps = [...(opt.pre || []), ...norm.steps];
  let [pl, pr] = norm.polys;
  const deg = Math.max(pl.degree(v), pr.degree(v));
  const op = ast.ops[0];
  const isEq = op === "=";
  const problemTex = tex(orig.ast);
  const graph = graphFor(sides, v);
  // izločimo rešitve zunaj definicijskega območja
  const exclude = (sols, into) => {
    const ex = opt.exclude || [];
    const keep = sols.filter((s) => !(s.q && ex.some((e) => e.eq(s.q))));
    for (const s of sols) if (!keep.includes(s)) into.push(step(T("scan.s.reject", { v, r: s.q.tex() }), `${v} = ${s.q.tex()}\\;\\Rightarrow\\; \\text{✗}`, { why: T("scan.w.reject") }));
    return keep;
  };

  if (deg <= 1) {
    const lin = linearSteps(pl, pr, v, op);
    steps.push(...lin.steps);
    if (lin.all && isEq && (opt.exclude?.length || opt.domainOpen)) {
      // racionalna enačba, ki velja »za vsak x«: vrednosti, pri katerih je imenovalec 0, niso rešitve
      if (opt.domainOpen) return null; // imenovalec z ničlami, ki jih ne znamo zapisati (npr. x² − 2): reši AI
      exclude(opt.exclude.map((q) => ({ q })), steps);
      return result({
        kind: "linear",
        problemTex,
        answer: { tex: `${v} \\in \\mathbb{R} \\setminus \\left\\{${opt.exclude.map((e) => e.tex()).join(", ")}\\right\\}` },
        methods: [{ id: "balance", steps }],
        graph,
        verified: true,
      });
    }
    if (lin.all || lin.none) {
      return result({
        kind: isEq ? "linear" : "lin-ineq",
        problemTex,
        answer: { tex: lin.all ? (isEq ? `${v} \\in \\mathbb{R}` : `${v} \\in \\mathbb{R}`) : `${v} \\in \\emptyset`, key: lin.all ? "scan.a.all" : "scan.a.none" },
        methods: [{ id: "balance", steps }],
        graph,
        numberLine: !isEq ? { v, intervals: lin.all ? [{ lo: null, hi: null }] : [] } : null,
        verified: true,
      });
    }
    if (isEq) {
      const kept = exclude([{ q: lin.value }], steps);
      if (!kept.length) return result({ kind: "linear", problemTex, answer: { tex: `${v} \\in \\emptyset`, key: "scan.a.none" }, methods: [{ id: "balance", steps }], graph, verified: true });
      const chk = checkStep(sides, ops, v, [{ q: lin.value }]);
      if (chk.step) steps.push(chk.step);
      return result({
        kind: "linear",
        problemTex,
        answer: { tex: `${v} = ${lin.value.tex()}`, approx: !lin.value.int ? `${v} \\approx ${approxTex(lin.value.num())}` : null },
        methods: [{ id: "balance", steps }],
        graph,
        verified: chk.ok,
      });
    }
    // neenačba
    const iv = intervalFor(lin.op, lin.value);
    steps.push(step(T("scan.s.interval"), `${v} \\in ${intervalsTex([iv])}`, { why: T("scan.w.interval") }));
    const ok = verifyIneq(sides, ops, v, [iv]);
    return result({
      kind: "lin-ineq",
      problemTex,
      answer: { tex: `${v} ${REL[lin.op]} ${lin.value.tex()}`, approx: `${v} \\in ${intervalsTex([iv])}` },
      methods: [{ id: "balance", steps }],
      graph,
      numberLine: { v, intervals: [iv] },
      verified: ok,
    });
  }

  // stopnja ≥ 2: vse na levo
  let poly = pl.sub(pr);
  let rop = op;
  if (isEq && !pl.zero && poly.coef(v, deg).sign < 0 && pl.degree(v) < deg) {
    // 1 = 4x² → 4x² − 1 = 0: člene prenesemo na desno, kjer je vodilni koeficient pozitiven
    poly = poly.scale(-1);
    steps.push(step(T("scan.s.standardRight"), `${poly.tex({ main: v })} = 0`, { note: `/ ${termsTex(pl.sorted(v).map((t) => ({ ...t, c: t.c.neg() })))}`, why: T(deg === 2 ? "scan.w.standard" : "scan.w.standardN") }));
  } else if (!pr.zero) steps.push(step(T("scan.s.standard"), `${poly.tex({ main: v })} ${REL[rop]} 0`, { note: `/ ${termsTex(pr.sorted(v).map((t) => ({ ...t, c: t.c.neg() })))}`, why: T(deg === 2 ? "scan.w.standard" : "scan.w.standardN") }));
  // ulomki so odpravljeni; okrajšamo in poskrbimo za pozitiven vodilni koeficient
  const lead = poly.coef(v, deg);
  if (lead.sign < 0) {
    poly = poly.scale(-1);
    rop = FLIP[rop];
    steps.push(step(T(isEq ? "scan.s.negate" : "scan.s.negateFlip"), `${poly.tex({ main: v })} ${REL[rop]} 0`, { note: "/ \\cdot (-1)", why: T(isEq ? "scan.w.negate" : "scan.w.flip") }));
  }
  const den = poly.denLcm();
  if (den > 1n) {
    poly = poly.scale(new Q(den));
    steps.push(step(T("scan.s.clearFrac", { n: String(den) }), `${poly.tex({ main: v })} ${REL[rop]} 0`, { note: `/ \\cdot ${den}`, why: T("scan.w.clearFrac", { n: String(den) }) }));
  }
  const g = poly.numGcd();
  if (g > 1n) {
    poly = poly.scale(new Q(1n, g));
    steps.push(step(T("scan.s.reduce", { n: String(g) }), `${poly.tex({ main: v })} ${REL[rop]} 0`, { note: `/ : ${g}`, why: T("scan.w.reduce") }));
  }
  const d = poly.degree(v);
  if (d <= 1) return solveOneVar({ k: "cmp", ops: [rop], terms: [polyNode(poly), { k: "num", v: 0 }] }, v, { ...opt, pre: steps, orig });

  if (d === 2) {
    const [c, b, a] = poly.coeffs(v);
    const qm = quadraticMethods(a, b, c, v, opt);
    const methods = qm.methods.map((m) => ({ id: m.id, steps: [...steps, ...m.steps] }));
    if (isEq) {
      if (opt.exclude?.length) {
        const rej = [];
        qm.sols = exclude(qm.sols, rej);
        methods.forEach((m) => m.steps.push(...rej));
      }
      const chk = checkStep(sides, ops, v, qm.sols);
      if (chk.step) methods.forEach((m) => m.steps.push(chk.step));
      const ans = qm.sols.length ? qm.sols.map((s, i) => `${v}${qm.sols.length > 1 ? `_{${i + 1}}` : ""} = ${s.q ? s.q.tex() : s.tex}`).join(",\\quad ") : null;
      return result({
        kind: "quadratic",
        problemTex,
        answer: ans ? { tex: ans, approx: qm.sols.some((s) => !s.q || !s.q.int) ? qm.sols.map((s, i) => `${v}${qm.sols.length > 1 ? `_{${i + 1}}` : ""} \\approx ${approxTex(s.q ? s.q.num() : s.num)}`).join(",\\quad ") : null } : qm.D < 0n ? { tex: `D < 0`, key: "scan.a.noReal" } : { tex: `${v} \\in \\emptyset`, key: "scan.a.none" },
        methods,
        graph: graphFor([polyNode(poly), { k: "num", v: 0 }], v, qm.sols),
        verified: chk.ok || !qm.sols.length,
      });
    }
    // kvadratna neenačba: ničle + parabola
    const roots = qm.sols.map((s) => (s.q ? { q: s.q, num: s.q.num(), tex: s.q.tex() } : s));
    const ivs = quadIneqIntervals(rop, roots);
    const sign = rop === "<" || rop === "<=" ? "below" : "above";
    const st = [...steps];
    const fm = qm.methods.find((m) => m.id === "factor") || qm.methods.find((m) => m.id === "formula");
    st.push(...fm.steps.filter((s) => s.title.k !== "scan.s.solutions" && s.title.k !== "scan.s.zeroProduct"));
    if (roots.length) st.push(step(T("scan.s.zeros"), roots.map((r, i) => `${v}${roots.length > 1 ? `_{${i + 1}}` : ""} = ${r.tex}`).join(",\\quad "), { why: T("scan.w.zeros") }));
    st.push(step(T(sign === "below" ? "scan.s.parabolaBelow" : "scan.s.parabolaAbove"), `${v} \\in ${intervalsTex(ivs)}`, { why: T(roots.length ? "scan.w.parabola" : "scan.w.parabolaNoZero") }));
    const ok = verifyIneq(sides, ops, v, ivs);
    return result({
      kind: "quad-ineq",
      problemTex,
      answer: { tex: `${v} \\in ${intervalsTex(ivs)}` },
      methods: [{ id: "signs", steps: st }],
      graph: graphFor([polyNode(poly), { k: "num", v: 0 }], v, []),
      numberLine: { v, intervals: ivs },
      verified: ok,
    });
  }

  // stopnja ≥ 3 (samo enačbe): uganemo racionalne ničle in delimo s Hornerjem
  if (!isEq) return null;
  let cs = poly.coeffs(v);
  const roots = [];
  const st = [...steps];
  // izpostavimo x^k
  let k = 0;
  while (cs[0].zero && cs.length > 1) {
    cs = cs.slice(1);
    k++;
  }
  if (k) {
    roots.push(Q.ZERO);
    st.push(step(T("scan.s.factorOut", { v }), `${v}${k > 1 ? `^{${k}}` : ""}\\left(${polyFromCoeffs(cs, v).tex()}\\right) = 0`, { why: T("scan.w.factorOut") }));
  }
  let guard = 0;
  while (cs.length - 1 > 2 && guard++ < 6) {
    const rr = rationalRoots(cs);
    if (!rr.length) break;
    const r = rr[0];
    const qcs = hornerDivide(cs, r);
    st.push(
      step(T("scan.s.horner", { r: r.tex() }), `p(${r.tex()}) = 0 \\;\\Rightarrow\\; ${polyFromCoeffs(cs, v).tex()} = \\left(${termsTex([{ m: { [v]: 1 }, c: Q.ONE }, { m: {}, c: r.neg() }].filter((t) => !t.c.zero))}\\right)\\left(${polyFromCoeffs(qcs, v).tex()}\\right)`, {
        why: T("scan.w.horner", { r: r.tex() }),
        whyTex: hornerTable(cs, r),
      }),
    );
    roots.push(r);
    cs = qcs;
  }
  const rest = polyFromCoeffs(cs, v);
  const sols = roots.map((q) => ({ q }));
  if (cs.length - 1 > 2) {
    // brez racionalnih ničel: realne ničle poiščemo numerično (bisekcija), preizkus jih potrdi
    const num = numericRoots(cs.map((c) => c.num()));
    st.push(step(T("scan.s.numeric"), num.length ? num.map((x, i) => `${v}${num.length + roots.length > 1 ? `_{${roots.length + i + 1}}` : ""} \\approx ${approxTex(x, 4)}`).join(",\\quad ") : `${rest.tex()} = 0`, { why: T("scan.w.numeric") }));
    for (const x of num) sols.push({ num: x, tex: `\\approx ${approxTex(x, 4)}`, approx: true });
    cs = [];
  }
  if (cs.length - 1 === 2) {
    const den2 = rest.denLcm();
    const restI = rest.scale(new Q(den2));
    const g2 = restI.numGcd();
    const r2 = restI.scale(new Q(1n, g2));
    const [c, b, a] = r2.coeffs(v);
    const qm = quadraticMethods(a.sign < 0 ? a.neg() : a, a.sign < 0 ? b.neg() : b, a.sign < 0 ? c.neg() : c, v, opt);
    const fm = qm.methods.find((m) => m.id === "factor") || qm.methods.find((m) => m.id === "formula");
    st.push(step(T("scan.s.solveQuadratic"), `${r2.tex()} = 0`, { why: T("scan.w.solveQuadratic") }));
    st.push(...fm.steps.filter((s) => s.title.k !== "scan.s.solutions"));
    for (const s of qm.sols) sols.push(s);
  } else if (cs.length - 1 === 1) {
    sols.push({ q: cs[0].neg().div(cs[1]) });
  }
  let uniq = [];
  for (const s of sols) if (!uniq.some((u) => (u.q && s.q ? u.q.eq(s.q) : Math.abs((u.num ?? u.q?.num()) - (s.num ?? s.q?.num())) < 1e-12))) uniq.push(s);
  uniq = exclude(uniq, st);
  uniq.sort((x, y) => (x.num ?? x.q.num()) - (y.num ?? y.q.num()));
  const sub = (i) => (uniq.length > 1 ? `_{${i + 1}}` : "");
  const ans = uniq.map((s, i) => `${v}${sub(i)} ${s.approx ? s.tex : `= ${s.q ? s.q.tex() : s.tex}`}`).join(",\\quad ");
  if (!uniq.every((s) => s.approx)) st.push(step(T("scan.s.solutions"), ans || `${v} \\in \\emptyset`));
  const chk = checkStep(sides, ops, v, uniq);
  if (chk.step) st.push(chk.step);
  return result({
    kind: "poly-eq",
    problemTex,
    answer: { tex: ans || `${v} \\in \\emptyset`, approx: uniq.some((s) => (!s.q || !s.q.int) && !s.approx) ? uniq.map((s, i) => `${v}${sub(i)} \\approx ${approxTex(s.q ? s.q.num() : s.num)}`).join(",\\quad ") : null },
    methods: [{ id: "horner", steps: st }],
    graph: graphFor([polyNode(poly), { k: "num", v: 0 }], v, uniq),
    verified: chk.ok,
  });
}

// realne ničle polinoma (koeficienti a0..an kot števila)
function numericRoots(a) {
  const n = a.length - 1;
  if (n < 1) return [];
  const f = (x) => a.reduceRight((acc, c) => acc * x + c, 0);
  const R = 1 + Math.max(...a.slice(0, n).map((c) => Math.abs(c / a[n])));
  const out = [];
  const N = 6000;
  let px = -R;
  let py = f(px);
  for (let i = 1; i <= N; i++) {
    const x = -R + (2 * R * i) / N;
    const y = f(x);
    if (py === 0) out.push(px);
    else if (py * y < 0) {
      let lo = px;
      let hi = x;
      for (let k = 0; k < 80; k++) {
        const m = (lo + hi) / 2;
        if (f(lo) * f(m) <= 0) hi = m;
        else lo = m;
      }
      out.push((lo + hi) / 2);
    }
    px = x;
    py = y;
  }
  return out.filter((x, i) => i === 0 || Math.abs(x - out[i - 1]) > 1e-9);
}

// ---------------------------------------------------------------------------
// Racionalne enačbe (neznanka v imenovalcu): pogoji, množenje s skupnim imenovalcem, izločanje

// polinom → { c: Q, fs: [P …] } (linearni faktorji z racionalnimi ničlami + ostanek)
function factorDen(p, v) {
  let cs = p.coeffs(v);
  const fs = [];
  let guard = 0;
  while (cs.length - 1 >= 1 && guard++ < 6) {
    const den = cs.reduce((l, c) => lcmInt(l, c.d), 1n);
    const rr = rationalRoots(cs.map((c) => c.mul(new Q(den))));
    if (!rr.length) break;
    const r = rr[0];
    cs = hornerDivide(cs, r).map((c) => c.div(new Q(r.d)));
    fs.push(new P([{ m: { [v]: 1 }, c: new Q(r.d) }, { m: {}, c: new Q(-r.n) }]));
  }
  const rest = polyFromCoeffs(cs, v);
  if (rest.degree(v) >= 1) {
    const lc = rest.coef(v, rest.degree(v));
    fs.push(rest.scale(lc.inv()));
    return { c: lc, fs };
  }
  return { c: rest.constValue(), fs };
}

function solveRational(ast, v, opt) {
  if (ast.terms.length !== 2) return null;
  // člen → { N: P, D: P }
  const parts = ast.terms.map((side, si) =>
    sideTerms(side).map(({ sign, node }) => {
      const u = unwrap(node);
      if (u.k === "/") {
        const N = tryPoly(u.a);
        const Dn = tryPoly(u.b);
        if (!N || !Dn || Dn.vars().some((x) => x !== v) || N.vars().some((x) => x !== v)) throw new AlgebraError("rational");
        return { N: N.scale(sign), D: Dn, node: u, sign };
      }
      const N = tryPoly(u);
      if (!N) throw new AlgebraError("rational");
      return { N: N.scale(sign), D: P.num(1), node: u, sign };
    }),
  );
  const all = parts.flat();
  if (!all.some((t) => !t.D.isConst())) return null;
  // skupni imenovalec: vsak različen faktor z največjo večkratnostjo
  const lcd = new Map(); // ključ → { f, k }
  let lcdC = 1n;
  const facts = all.map((t) => {
    const fd = factorDen(t.D, v);
    const cnt = new Map();
    for (const f of fd.fs) {
      const key = f.text();
      cnt.set(key, { f, k: (cnt.get(key)?.k || 0) + 1 });
    }
    for (const [key, x] of cnt) if ((lcd.get(key)?.k || 0) < x.k) lcd.set(key, x);
    if (fd.c.int) lcdC = lcmInt(lcdC, fd.c.n < 0n ? -fd.c.n : fd.c.n);
    return { ...fd, cnt };
  });
  // pogoji: ničle faktorjev
  const excluded = [];
  for (const { f } of lcd.values()) if (f.degree(v) === 1) excluded.push(f.coef(v, 0).neg().div(f.coef(v, 1)));
  excluded.sort((a, b) => a.cmp(b));
  const pre = [];
  const fTex = (f) => (f.terms().length > 1 ? `\\left(${f.tex({ main: v })}\\right)` : f.tex({ main: v }));
  const lcdTex = `${lcdC === 1n ? "" : lcdC}${[...lcd.values()].sort((p1, p2) => p1.f.terms().length - p2.f.terms().length).map(({ f, k }) => fTex(f) + (k > 1 ? `^{${k}}` : "")).join("")}`;
  if (excluded.length) pre.push(step(T("scan.s.domain", { v }), excluded.map((e) => `${v} \\ne ${e.tex()}`).join(",\\quad "), { why: T("scan.w.domain") }));
  // vsak člen pomnožimo: N · (skupni / D)
  const mulTerms = parts.map((side, si) =>
    side.map((t, ti) => {
      const fd = facts[parts.slice(0, si).reduce((n, s) => n + s.length, 0) + ti];
      let factor = new P([{ m: {}, c: new Q(lcdC).div(fd.c) }]);
      const extra = [];
      for (const [key, { f, k }] of lcd) {
        const have = fd.cnt.get(key)?.k || 0;
        for (let i = have; i < k; i++) {
          factor = factor.mul(f);
          extra.push(f);
        }
      }
      const coef = new Q(lcdC).div(fd.c);
      const Nraw = t.N.scale(t.sign); // brez predznaka
      return { N: Nraw, coef, extra, sign: t.sign, poly: t.N.mul(factor) };
    }),
  );
  const termText = ({ N, coef, extra }) => {
    // enočlene faktorje (števila, x, 2x) združimo v en člen, veččlenske pustimo v oklepajih: x·x → x², 2·3 → 6
    let mono = P.num(1).scale(coef.abs());
    const multi = [];
    for (const f of [N, ...extra]) {
      if (f.terms().length > 1) multi.push(f);
      else mono = mono.mul(f);
    }
    const ms = mono.terms().length ? mono.text() : "0";
    const neg = ms.startsWith("-");
    const head = neg ? ms.slice(1) : ms;
    const body = [multi.length && head === "1" ? "" : head, ...multi.map((f) => `(${f.text()})`)].filter(Boolean).join("*");
    const bare = multi.length === 1 && head === "1" ? multi[0].text() : null; // »+ (x + 2)« zapišemo brez oklepaja
    return { s: (coef.sign < 0 ? -1 : 1) * (neg ? -1 : 1), txt: body, bare };
  };
  const sideText = (side) =>
    side
      .map((t, i) => {
        const { s, txt, bare } = termText(t);
        const sg = s * t.sign;
        return (i ? (sg < 0 ? " - " : " + ") : sg < 0 ? "-" : "") + (sg > 0 && bare ? bare : txt);
      })
      .join("") || "0";
  const newAst = parse(`${sideText(mulTerms[0])} = ${sideText(mulTerms[1])}`);
  pre.push(step(T("scan.s.mulLcd", { d: lcdTex }), tex(newAst), { note: `/ \\cdot ${lcdTex}`, why: T("scan.w.mulLcd") }));
  const domainOpen = [...lcd.values()].some(({ f }) => f.degree(v) >= 2);
  return solveOneVar(newAst, v, { ...opt, pre, orig: { ast, sides: ast.terms, ops: ast.ops }, exclude: excluded, domainOpen });
}

function hornerTable(cs, r) {
  const n = cs.length - 1;
  const top = [];
  const mid = [""];
  const bot = [];
  let acc = Q.ZERO;
  for (let i = n; i >= 0; i--) {
    top.push(cs[i].tex());
    const prod = acc.mul(r);
    if (i < n) mid.push(prod.tex());
    acc = (i === n ? Q.ZERO : prod).add(cs[i]);
    bot.push(acc.tex());
  }
  const cols = "r|" + "c".repeat(n + 1);
  return `\\begin{array}{${cols}} & ${top.join(" & ")} \\\\ ${r.tex()} & ${mid.join(" & ")} \\\\ \\hline & ${bot.join(" & ")} \\end{array}`;
}

// ---------------------------------------------------------------------------
// Intervali

function intervalFor(op, val) {
  if (op === "<") return { lo: null, hi: val, hiClosed: false };
  if (op === "<=") return { lo: null, hi: val, hiClosed: true };
  if (op === ">") return { lo: val, loClosed: false, hi: null };
  return { lo: val, loClosed: true, hi: null };
}
const endTex = (e) => (e == null ? null : e instanceof Q ? e.tex() : e.tex);
const endNum = (e) => (e == null ? null : e instanceof Q ? e.num() : e.num);
export function intervalsTex(ivs) {
  if (!ivs.length) return "\\emptyset";
  return ivs
    .map((iv) => {
      if (iv.point) return `\\{${endTex(iv.point)}\\}`;
      const lo = iv.lo == null ? "-\\infty" : endTex(iv.lo);
      const hi = iv.hi == null ? "\\infty" : endTex(iv.hi);
      if (iv.lo == null && iv.hi == null) return "\\mathbb{R}";
      return `${iv.lo != null && iv.loClosed ? "\\left[" : "\\left("}${lo}, ${hi}${iv.hi != null && iv.hiClosed ? "\\right]" : "\\right)"}`;
    })
    .join(" \\cup ");
}

function quadIneqIntervals(op, roots) {
  // vodilni koeficient > 0
  const closed = op === "<=" || op === ">=";
  const below = op === "<" || op === "<=";
  if (roots.length === 0) return below ? [] : [{ lo: null, hi: null }];
  if (roots.length === 1) {
    const r = roots[0];
    if (below) return closed ? [{ point: r }] : [];
    return closed ? [{ lo: null, hi: null }] : [{ lo: null, hi: r, hiClosed: false }, { lo: r, loClosed: false, hi: null }];
  }
  const [r1, r2] = roots;
  if (below) return [{ lo: r1, loClosed: closed, hi: r2, hiClosed: closed }];
  return [{ lo: null, hi: r1, hiClosed: closed }, { lo: r2, loClosed: closed, hi: null }];
}

function inIntervals(x, ivs) {
  return ivs.some((iv) => {
    if (iv.point) return Math.abs(x - endNum(iv.point)) < 1e-9;
    const lo = endNum(iv.lo);
    const hi = endNum(iv.hi);
    return (lo == null || x > lo || (iv.loClosed && Math.abs(x - lo) < 1e-9)) && (hi == null || x < hi || (iv.hiClosed && Math.abs(x - hi) < 1e-9));
  });
}

// neenačbo preverimo v mnogo točkah (in v krajiščih)
function verifyIneq(sides, ops, v, ivs) {
  const fs = sides.map((s) => compile(s));
  const pts = [];
  for (let x = -60; x <= 60; x += 0.37) pts.push(x);
  for (const iv of ivs) for (const e of [iv.lo, iv.hi, iv.point]) if (e != null) pts.push(endNum(e), endNum(e) + 1e-4, endNum(e) - 1e-4);
  for (const x of pts) {
    const vals = fs.map((f) => f({ [v]: x }));
    if (vals.some((y) => !Number.isFinite(y))) continue;
    let holds = true;
    for (let i = 0; i < ops.length; i++) {
      const a = vals[i];
      const b = vals[i + 1];
      const tol = 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
      const op = ops[i];
      if (op === "<" && !(a < b - tol)) holds = false;
      if (op === ">" && !(a > b + tol)) holds = false;
      if (op === "<=" && !(a <= b + tol)) holds = false;
      if (op === ">=" && !(a >= b - tol)) holds = false;
    }
    const near = ivs.some((iv) => [iv.lo, iv.hi, iv.point].some((e) => e != null && Math.abs(x - endNum(e)) < 1e-3));
    if (!near && holds !== inIntervals(x, ivs)) return false;
  }
  return true;
}

// dvojna neenačba a < izraz < b, neznanka samo v sredini
function solveDouble(ast, v) {
  const [L, M, R] = ast.terms;
  const lq = constQ(L);
  const rq = constQ(R);
  const pm = tryPoly(M);
  if (!lq || !rq || !pm || pm.degree(v) !== 1 || pm.vars().length !== 1) return null;
  const steps = [];
  let ops = [...ast.ops];
  let lo = lq;
  let hi = rq;
  const a = pm.coef(v, 1);
  const b = pm.coef(v, 0);
  const show = (l, mid, r) => `${l.tex()} ${REL[ops[0]]} ${mid} ${REL[ops[1]]} ${r.tex()}`;
  if (tex(M) !== pm.tex()) steps.push(step(T("scan.s.collect"), show(lo, pm.tex(), hi), { why: T("scan.w.collect") }));
  if (!b.zero) {
    lo = lo.sub(b);
    hi = hi.sub(b);
    steps.push(step(T("scan.s.subAll", { b: b.neg().tex() }), show(lo, termTex({ m: { [v]: 1 }, c: a }, true), hi), { note: `/ ${b.sign < 0 ? "+" : "-"}${b.abs().tex()}`, why: T("scan.w.subAll") }));
  }
  if (!a.one) {
    lo = lo.div(a);
    hi = hi.div(a);
    if (a.sign < 0) {
      [lo, hi] = [hi, lo];
      ops = [FLIP[ops[1]], FLIP[ops[0]]];
    }
    steps.push(step(T(a.sign < 0 ? "scan.s.divideFlip" : "scan.s.divide", { a: a.tex(), v }), show(lo, v, hi), { note: `/ : ${a.sign < 0 ? `\\left(${a.tex()}\\right)` : a.tex()}`, why: T(a.sign < 0 ? "scan.w.flip" : "scan.w.divide", { v }) }));
  }
  const ok0 = ops.every((o) => o === "<" || o === "<=");
  if (!ok0) return null;
  const iv = lo.cmp(hi) < 0 || (lo.eq(hi) && ops.every((o) => o === "<=")) ? (lo.eq(hi) ? { point: lo } : { lo, loClosed: ops[0] === "<=", hi, hiClosed: ops[1] === "<=" }) : null;
  const ivs = iv ? [iv] : [];
  steps.push(step(T("scan.s.interval"), `${v} \\in ${intervalsTex(ivs)}`, { why: T("scan.w.interval") }));
  return result({
    kind: "lin-ineq",
    problemTex: tex(ast),
    answer: { tex: `${v} \\in ${intervalsTex(ivs)}` },
    methods: [{ id: "balance", steps }],
    numberLine: { v, intervals: ivs },
    graph: null,
    verified: verifyIneq(ast.terms, ast.ops, v, ivs),
  });
}

// ---------------------------------------------------------------------------
// Sistem dveh linearnih enačb

function linearForm(eqAst, vars) {
  const norm = normalizeSides(eqAst.terms, ["="]);
  const [pl, pr] = norm.polys;
  const p = pl.sub(pr);
  if (p.degree() > 1) return null;
  const [x, y] = vars;
  return { a: p.coef(x, 1), b: p.coef(y, 1), c: p.constValue().neg(), steps: norm.steps };
}

const lfTex = ({ a, b, c }, [x, y]) => `${termsTex([{ m: { [x]: 1 }, c: a }, { m: { [y]: 1 }, c: b }].filter((t) => !t.c.zero))} = ${c.tex()}`;
const cases = (rows) => `\\begin{cases} ${rows.join(" \\\\ ")} \\end{cases}`;

function solveSystem(parts) {
  const asts = parts.map((p) => parse(prep(p)));
  if (asts.length !== 2 || asts.some((a) => a.k !== "cmp" || a.ops.length !== 1 || a.ops[0] !== "=")) return null;
  const vs = new Set();
  for (const a of asts) for (const x of varsOf(a)) vs.add(x);
  const vars = [...vs].sort();
  if (vars.length !== 2) return null;
  const forms = asts.map((a) => linearForm(a, vars));
  if (forms.some((f) => !f)) return null;
  // ulomke odpravimo
  forms.forEach((f) => {
    const l = lcmInt(lcmInt(f.a.d, f.b.d), f.c.d);
    if (l > 1n) {
      f.a = f.a.mul(new Q(l));
      f.b = f.b.mul(new Q(l));
      f.c = f.c.mul(new Q(l));
    }
  });
  const [x, y] = vars;
  const [e1, e2] = forms;
  const problemTex = cases(asts.map((a) => tex(a)));
  const pre = [];
  const changed = asts.some((a, i) => tex(a).replace(/\s/g, "") !== lfTex(forms[i], vars).replace(/\s/g, ""));
  if (changed) pre.push(step(T("scan.s.sysNormal", { x, y }), cases(forms.map((f) => lfTex(f, vars))), { why: T("scan.w.sysNormal") }));
  const D = e1.a.mul(e2.b).sub(e2.a.mul(e1.b));
  const graph = { exprs: forms.map((f) => lfTex(f, vars).replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "($1)/($2)").replace(/\{,\}/g, ".")).map(texToPlain), vars };
  if (D.zero) {
    // ni rešitve ali neskončno rešitev
    const dep = e1.a.mul(e2.c).sub(e2.a.mul(e1.c)).zero && e1.b.mul(e2.c).sub(e2.b.mul(e1.c)).zero;
    const st = [...pre, step(T(dep ? "scan.s.sysDependent" : "scan.s.sysNone"), cases(forms.map((f) => lfTex(f, vars))), { why: T(dep ? "scan.w.sysDependent" : "scan.w.sysNone") })];
    return result({ kind: "system", problemTex, answer: { tex: dep ? "\\infty" : "\\emptyset", key: dep ? "scan.a.sysMany" : "scan.a.none" }, methods: [{ id: "elim", steps: st }], graph, verified: true });
  }
  const X = e1.c.mul(e2.b).sub(e2.c.mul(e1.b)).div(D);
  const Y = e1.a.mul(e2.c).sub(e2.a.mul(e1.c)).div(D);
  const methods = [];
  methods.push({ id: "subst", steps: [...pre, ...substSteps(forms, vars, X, Y)] });
  methods.push({ id: "elim", steps: [...pre, ...elimSteps(forms, vars, X, Y)] });
  const Dx = e1.c.mul(e2.b).sub(e2.c.mul(e1.b));
  const Dy = e1.a.mul(e2.c).sub(e2.a.mul(e1.c));
  const det = (p, q, r, s) => `\\begin{vmatrix} ${p.tex()} & ${q.tex()} \\\\ ${r.tex()} & ${s.tex()} \\end{vmatrix}`;
  methods.push({
    id: "cramer",
    steps: [
      ...pre,
      step(T("scan.s.det"), `D = ${det(e1.a, e1.b, e2.a, e2.b)} = ${e1.a.tex()} \\cdot ${wrapQ(e2.b)} - ${wrapQ(e2.a)} \\cdot ${wrapQ(e1.b)} = ${D.tex()}`, { why: T("scan.w.det") }),
      step(T("scan.s.detXY", { x, y }), `D_{${x}} = ${det(e1.c, e1.b, e2.c, e2.b)} = ${Dx.tex()},\\quad D_{${y}} = ${det(e1.a, e1.c, e2.a, e2.c)} = ${Dy.tex()}`, { why: T("scan.w.detXY", { x, y }) }),
      step(T("scan.s.cramer"), `${x} = \\frac{D_{${x}}}{D} = ${X.tex()},\\quad ${y} = \\frac{D_{${y}}}{D} = ${Y.tex()}`, { why: T("scan.w.cramer") }),
    ],
  });
  // preizkus
  const env = { [x]: X, [y]: Y };
  const rows = [];
  let ok = true;
  asts.forEach((a, i) => {
    const L = valueQ(a.terms[0], env);
    const R = valueQ(a.terms[1], env);
    const holds = !!L && !!R && L.eq(R);
    ok &&= holds;
    rows.push(`${i + 1}.\\; ${tex(substitute(a.terms[0], env))} = ${L ? L.tex() : "?"},\\quad ${tex(substitute(a.terms[1], env))} = ${R ? R.tex() : "?"}${holds ? "\\;\\checkmark" : ""}`);
  });
  const chk = step(T("scan.s.check"), lines(rows), { why: T("scan.w.checkSys") });
  methods.forEach((m) => m.steps.push(chk));
  return result({
    kind: "system",
    problemTex,
    answer: { tex: `${x} = ${X.tex()},\\quad ${y} = ${Y.tex()}`, approx: `(${x}, ${y}) = \\left(${X.tex()}, ${Y.tex()}\\right)` },
    methods,
    graph: { ...graph, points: [[X.num(), Y.num()]] },
    verified: ok,
  });
}

const wrapQ = (q) => (q.sign < 0 ? `\\left(${q.tex()}\\right)` : q.tex());
function texToPlain(s) {
  return s.replace(/\\cdot/g, "*").replace(/\s+/g, "");
}

function substSteps([e1, e2], [x, y], X, Y) {
  // izberemo enačbo in neznanko z najmanjšim koeficientom (najraje ±1)
  const cands = [];
  [e1, e2].forEach((e, i) => {
    if (!e.b.zero) cands.push({ i, v: y, o: x, coef: e.b, oc: e.a, c: e.c, score: e.b.abs().one ? 0 : 1 + Number(e.b.abs().num()) });
    if (!e.a.zero) cands.push({ i, v: x, o: y, coef: e.a, oc: e.b, c: e.c, score: (e.a.abs().one ? 0 : 1 + Number(e.a.abs().num())) + 0.5 });
  });
  cands.sort((p, q) => p.score - q.score);
  const k = cands[0];
  const other = k.i === 0 ? e2 : e1;
  const steps = [];
  // v = (c − oc·o)/coef
  const expr = new P([{ m: {}, c: k.c.div(k.coef) }, { m: { [k.o]: 1 }, c: k.oc.neg().div(k.coef) }]);
  steps.push(step(T("scan.s.express", { v: k.v, n: String(k.i + 1) }), `${k.v} = ${expr.tex({ main: k.o })}`, { why: T("scan.w.express", { v: k.v }) }));
  // vstavimo v drugo enačbo
  const ocv = k.v === x ? other.a : other.b; // koeficient pri v v drugi enačbi
  const occ = k.v === x ? other.b : other.a; // koeficient pri o
  const insTex = `${termsTex([{ m: { [k.o]: 1 }, c: occ }].filter((t) => !t.c.zero))}${occ.zero ? "" : " "}${ocv.sign < 0 ? "-" : occ.zero ? "" : "+"} ${ocv.abs().one ? "" : ocv.abs().tex()}\\left(${expr.tex({ main: k.o })}\\right) = ${other.c.tex()}`;
  steps.push(step(T("scan.s.substitute", { v: k.v, n: String(k.i === 0 ? 2 : 1) }), insTex, { why: T("scan.w.substitute", { v: k.v }) }));
  // linearna enačba v o
  const lhs = new P([{ m: { [k.o]: 1 }, c: occ }]).add(expr.scale(ocv));
  const raw = [{ m: { [k.o]: 1 }, c: occ }, ...expr.sorted(k.o).map((t) => ({ m: t.m, c: t.c.mul(ocv) }))].filter((t) => !t.c.zero);
  steps.push(step(T("scan.s.expand"), `${termsTex(raw)} = ${other.c.tex()}`, { why: T("scan.w.dist") }));
  const lin = linearSteps(lhs, P.num(other.c), k.o);
  steps.push(...lin.steps);
  const ov = k.o === x ? X : Y;
  const vv = k.v === x ? X : Y;
  steps.push(step(T("scan.s.backSub", { v: k.v }), `${k.v} = ${tex(substitute(polyNode(expr), { [k.o]: ov }))} = ${vv.tex()}`, { why: T("scan.w.backSub") }));
  return steps;
}

function elimSteps([e1, e2], [x, y], X, Y) {
  // izločimo neznanko z manjšim skupnim večkratnikom koeficientov
  const opt = [
    { v: y, k: x, a1: e1.b, a2: e2.b },
    { v: x, k: y, a1: e1.a, a2: e2.a },
  ]
    .filter((o) => !o.a1.zero && !o.a2.zero)
    .map((o) => ({ ...o, l: lcmInt(o.a1.n < 0n ? -o.a1.n : o.a1.n, o.a2.n < 0n ? -o.a2.n : o.a2.n) }))
    .sort((p, q) => (p.l < q.l ? -1 : p.l > q.l ? 1 : 0));
  const steps = [];
  if (!opt.length) {
    // ena enačba že vsebuje samo eno neznanko
    return substSteps([e1, e2], [x, y], X, Y);
  }
  const o = opt[0];
  const L = new Q(o.l);
  let k1 = L.div(o.a1.abs());
  let k2 = L.div(o.a2.abs());
  if (o.a1.sign === o.a2.sign) k2 = k2.neg();
  const m1 = { a: e1.a.mul(k1), b: e1.b.mul(k1), c: e1.c.mul(k1) };
  const m2 = { a: e2.a.mul(k2), b: e2.b.mul(k2), c: e2.c.mul(k2) };
  if (!k1.one || !k2.one) {
    steps.push(
      step(T("scan.s.elimMul", { v: o.v }), cases([`${lfTex(m1, [x, y])} & ${k1.one ? "" : `/ \\cdot ${wrapQ(k1)}`}`, `${lfTex(m2, [x, y])} & ${k2.one ? "" : `/ \\cdot ${wrapQ(k2)}`}`]).replace("\\begin{cases}", "\\begin{cases}"), {
        why: T("scan.w.elimMul", { v: o.v }),
      }),
    );
  }
  const sum = { a: m1.a.add(m2.a), b: m1.b.add(m2.b), c: m1.c.add(m2.c) };
  const kept = o.k;
  const kc = kept === x ? sum.a : sum.b;
  steps.push(step(T("scan.s.elimAdd", { v: o.v }), `${termsTex([{ m: { [kept]: 1 }, c: kc }])} = ${sum.c.tex()}`, { why: T("scan.w.elimAdd", { v: o.v }) }));
  const kv = kept === x ? X : Y;
  if (!kc.one) steps.push(step(T("scan.s.divide", { a: kc.tex(), v: kept }), `${kept} = ${kv.tex()}`, { note: `/ : ${wrapQ(kc)}`, why: T("scan.w.divide", { v: kept }) }));
  // vrnemo v prvo enačbo (tisto z manjšimi koeficienti)
  const src = [e1, e2].sort((p, q) => p.a.abs().add(p.b.abs()).cmp(q.a.abs().add(q.b.abs())))[0];
  const cK = kept === x ? src.a : src.b;
  const cV = kept === x ? src.b : src.a;
  const vv = kept === x ? Y : X;
  const rest = src.c.sub(cK.mul(kv));
  steps.push(
    step(T("scan.s.backSub", { v: o.v }), `${cK.one ? "" : cK.tex() + " \\cdot "}${wrapQ(kv)} ${cV.sign < 0 ? "-" : "+"} ${termsTex([{ m: { [o.v]: 1 }, c: cV.abs() }])} = ${src.c.tex()} \\;\\Rightarrow\\; ${termsTex([{ m: { [o.v]: 1 }, c: cV }])} = ${rest.tex()} \\;\\Rightarrow\\; ${o.v} = ${vv.tex()}`, {
      why: T("scan.w.backSub"),
    }),
  );
  return steps;
}

function varsOf(node) {
  const s = new Set();
  walkTree(node, (n) => {
    if (n.k === "var") s.add(n.name);
  });
  return [...s];
}

// ---------------------------------------------------------------------------
// Računanje s števili (vrstni red operacij, točni ulomki)

function toQTree(n) {
  switch (n.k) {
    case "num": {
      const q = safeQ(n.v);
      if (!q) throw new AlgebraError("irrational");
      return { k: "q", q, dec: !Number.isInteger(n.v) };
    }
    case "grp":
      return { k: "grp", a: toQTree(n.a) };
    case "neg":
      return { k: "neg", a: toQTree(n.a) };
    case "/":
      if (n.frac) return { k: "q", q: new Q(BigInt(n.a.v), BigInt(n.b.v)), dec: false, raw: [n.a.v, n.b.v] };
      return { k: n.k, a: toQTree(n.a), b: toQTree(n.b) };
    case "+":
    case "-":
    case "*":
    case "^":
      return { k: n.k, a: toQTree(n.a), b: toQTree(n.b) };
    case "pct":
      return { k: "pct", a: toQTree(n.a) };
    case "call":
      if (n.f === "sqrt" && n.args.length === 1) return { k: "call", f: "sqrt", args: [toQTree(n.args[0])] };
      if (n.f === "abs" && n.args.length === 1) return { k: "call", f: "abs", args: [toQTree(n.args[0])] };
      throw new AlgebraError("func");
    default:
      throw new AlgebraError("func");
  }
}

const isQ = (n) => n.k === "q" || (n.k === "grp" && isQ(n.a));
const qOf = (n) => (n.k === "grp" ? qOf(n.a) : n);

function opCategory(n, parentGrp) {
  if (parentGrp) return 0;
  if (n.k === "^" || n.k === "call") return 1;
  if (n.k === "*" || n.k === "/" || n.k === "pct") return 2;
  return 3;
}

function reducible(n) {
  if (n.k === "grp" || n.k === "q") return false;
  if (n.k === "neg") return isQ(n.a);
  if (n.k === "pct") return isQ(n.a);
  if (n.k === "call") return isQ(n.args[0]);
  return isQ(n.a) && isQ(n.b);
}

function reduceNode(n, notes) {
  const A = n.a ? qOf(n.a) : n.args ? qOf(n.args[0]) : null;
  const B = n.b ? qOf(n.b) : null;
  const dec = !!(A?.dec || B?.dec);
  switch (n.k) {
    case "neg":
      return { k: "q", q: A.q.neg(), dec: A.dec };
    case "pct":
      return { k: "q", q: A.q.div(100), dec: true };
    case "+":
    case "-": {
      if (!A.q.int && !B.q.int && A.q.d !== B.q.d && !dec) {
        const l = lcmInt(A.q.d, B.q.d);
        notes.push({ k: "scan.w.common", v: { d: String(l) }, tex: `\\frac{${A.q.n * (l / A.q.d)}}{${l}} ${n.k} \\frac{${B.q.n * (l / B.q.d)}}{${l}}`.replace(/\{-/g, "{-") });
      } else if ((!A.q.int || !B.q.int) && !dec && A.q.d !== B.q.d) {
        const l = lcmInt(A.q.d, B.q.d);
        notes.push({ k: "scan.w.common", v: { d: String(l) } });
      }
      return { k: "q", q: n.k === "+" ? A.q.add(B.q) : A.q.sub(B.q), dec };
    }
    case "*":
      if ((!A.q.int || !B.q.int) && !dec) notes.push({ k: "scan.w.mulFrac" });
      return { k: "q", q: A.q.mul(B.q), dec };
    case "/":
      if (B.q.zero) throw new AlgebraError("div0");
      if (!B.q.int && !dec) notes.push({ k: "scan.w.divFrac", tex: `${tex(A)} \\cdot ${B.q.inv().tex()}` });
      else if (!dec && !A.q.div(B.q).int) notes.push({ k: "scan.w.divToFrac" });
      return { k: "q", q: A.q.div(B.q), dec: dec && A.q.div(B.q).finiteDecimal };
    case "^": {
      if (!B.q.int || Math.abs(Number(B.q.n)) > 64) throw new AlgebraError("irrational");
      if (B.q.sign < 0) notes.push({ k: "scan.w.negPow" });
      return { k: "q", q: A.q.pow(Number(B.q.n)), dec };
    }
    case "call": {
      if (n.f === "abs") return { k: "q", q: A.q.abs(), dec };
      const r = A.q.sqrt();
      if (!r) throw new AlgebraError("irrational");
      return { k: "q", q: r, dec };
    }
  }
  throw new AlgebraError("op");
}

function arithSteps(ast) {
  let tree = toQTree(ast);
  const steps = [];
  const TITLES = ["scan.s.paren", "scan.s.pow", "scan.s.muldiv", "scan.s.addsub"];
  for (let guard = 0; guard < 40 && !(tree.k === "q"); guard++) {
    // poišči reducibilna vozlišča in kategorijo
    const found = [];
    (function scan(n, parentGrp) {
      if (reducible(n)) found.push({ n, cat: opCategory(n, parentGrp) });
      else {
        if (n.a) scan(n.a, n.k === "grp");
        if (n.b) scan(n.b, false);
        if (n.args) n.args.forEach((x) => scan(x, true));
      }
    })(tree, false);
    if (!found.length) {
      if (tree.k === "grp") {
        tree = tree.a;
        continue;
      }
      break;
    }
    // »neg« števila zložimo brez svojega koraka
    const negs = found.filter((f) => f.n.k === "neg");
    const minCat = Math.min(...found.filter((f) => f.n.k !== "neg").map((f) => f.cat), 9);
    const pick = negs.length && minCat === 9 ? negs : found.filter((f) => f.n.k === "neg" || f.cat === minCat);
    // pri + in − računamo od leve proti desni po en člen, pri · in : vse neodvisne hkrati
    const notes = [];
    const map = new Map();
    for (const f of pick) map.set(f.n, reduceNode(f.n, notes));
    tree = replaceNodes(tree, map);
    tree = dropQGroups(tree);
    if (negs.length && minCat === 9 && pick.every((f) => f.n.k === "neg")) continue;
    const cat = pick.find((f) => f.n.k !== "neg")?.cat ?? 3;
    const kinds = new Set(pick.map((f) => f.n.k));
    let title = TITLES[cat];
    if (cat === 0) title = "scan.s.paren";
    else if (kinds.has("call")) title = "scan.s.root";
    else if (cat === 2 && kinds.size === 1 && kinds.has("/")) title = "scan.s.div";
    else if (cat === 2 && kinds.size === 1 && kinds.has("*")) title = "scan.s.mul";
    else if (kinds.has("pct")) title = "scan.s.pct";
    const n0 = notes[0];
    steps.push(step(T(title), tex(tree), n0 ? { why: T(n0.k, n0.v || {}), whyTex: n0.tex || null } : { why: T(title.replace("scan.s.", "scan.w.")) }));
  }
  if (tree.k !== "q") throw new AlgebraError("unfinished");
  return { steps, value: tree.q, dec: tree.dec };
}

function replaceNodes(n, map) {
  if (map.has(n)) return map.get(n);
  const o = { ...n };
  if (n.a) o.a = replaceNodes(n.a, map);
  if (n.b) o.b = replaceNodes(n.b, map);
  if (n.args) o.args = n.args.map((x) => replaceNodes(x, map));
  return o;
}
function dropQGroups(n) {
  if (n.k === "grp") {
    const a = dropQGroups(n.a);
    return a.k === "q" ? a : { k: "grp", a };
  }
  const o = { ...n };
  if (n.a) o.a = dropQGroups(n.a);
  if (n.b) o.b = dropQGroups(n.b);
  if (n.args) o.args = n.args.map(dropQGroups);
  return o;
}

function solveArith(ast) {
  const { steps, value, dec } = arithSteps(ast);
  const extra = [];
  if (!value.int) {
    if (value.abs().cmp(Q.ONE) > 0 && !dec) extra.push(value.tex({ mixed: true }));
    extra.push(value.finiteDecimal ? value.tex({ dec: true }) : `\\approx ${approxTex(value.num(), 4)}`);
  }
  const ok = Math.abs(compile(ast)({}) - value.num()) <= 1e-9 * Math.max(1, Math.abs(value.num()));
  const main = dec && value.finiteDecimal ? value.tex({ dec: true }) : value.tex();
  return result({
    kind: "arith",
    problemTex: tex(ast),
    answer: { tex: main, approx: extra.filter((e) => e !== main).map((e) => (e.startsWith("\\approx") ? e : `= ${e}`)).join("\\quad ") || null },
    methods: [{ id: "order", steps: steps.length ? steps : [step(T("scan.s.value"), main)] }],
    verified: ok,
  });
}

// Funkcije (sin, log …), π in e: točne vrednosti kot ulomka ni, zato računamo kot kalkulator (približek).
// Kot brez enote (sin 15) je dvoumen: v šoli je navadno v stopinjah (kalkulator v načinu DEG), zato je
// glavni rezultat v stopinjah, rezultat v radianih pa je pokazan zraven, da je razlika jasna.
const DIRECT_TRIG = new Set(["sin", "cos", "tan", "cot", "sec", "csc"]);
const INV_TRIG = new Set(["arcsin", "arccos", "arctan", "arccot"]);
const hasUnit = (n) => {
  let u = false;
  walkTree(n, (m) => {
    if (m.k === "deg" || (m.k === "const" && m.name === "pi")) u = true;
  });
  return u;
};
// kopija drevesa, v kateri ima kot brez enote zapisano enoto (° ali rad) – samo za izpis
function withUnit(n, unit) {
  if (!n || typeof n !== "object") return n;
  if (n.k === "call" && DIRECT_TRIG.has(n.f) && n.args.length === 1 && !hasUnit(n.args[0])) {
    const a = n.args[0];
    return { ...n, args: [unit === "deg" ? { k: "deg", a } : { k: "var", name: `${tex(a)}\\,\\text{rad}` }] };
  }
  const o = { ...n };
  for (const k of ["a", "b"]) if (n[k]) o[k] = withUnit(n[k], unit);
  if (n.args) o.args = n.args.map((x) => withUnit(x, unit));
  return o;
}
// vrednost → [znak, TeX]; »=« le, kadar je vrednost točna na 4 decimalke (sin 30° = 0,5)
function numValue(v) {
  if (!Number.isFinite(v) || Math.abs(v) > 1e12) return null; // npr. tan 90°, log(−1)
  const w = Math.round(v * 1e4) / 1e4;
  if (Math.abs(v - w) <= 1e-10 * Math.max(1, Math.abs(v))) return ["=", approxTex(w, 4)];
  if (Math.abs(v) >= 1e-3) return ["\\approx", approxTex(v, 4)];
  const [m, e] = v.toExponential(3).split("e");
  return ["\\approx", `${m.replace(".", "{,}")} \\cdot 10^{${Number(e)}}`];
}

function solveNumeric(ast) {
  let ambiguous = false;
  let manyArgs = false;
  walkTree(ast, (n) => {
    // sin(0,5): vejica je lahko decimalna ali ločilo argumentov – ne ugibamo (reši AI)
    if (n.k === "call" && n.args.length !== 1) manyArgs = true;
    if (n.k === "call" && (INV_TRIG.has(n.f) || (DIRECT_TRIG.has(n.f) && !hasUnit(n.args[0] || {})))) ambiguous = true;
  });
  // arcsin znotraj večjega izraza (2·arcsin 1): stopinje kot navadno število bi dale napačen rezultat
  let innerArc = false;
  walkTree(unwrap(ast), (n) => {
    if (n !== unwrap(ast) && n.k === "call" && INV_TRIG.has(n.f)) innerArc = true;
  });
  if (manyArgs || innerArc) return null;
  // samo arkus funkcija (arcsin 0,5): rezultat je kot, zato ima enoto
  const top = unwrap(ast);
  const angleOut = top.k === "call" && INV_TRIG.has(top.f);
  const line = (node, deg) => {
    const v = numValue(compile(ast, { deg })({}));
    if (!v) return null;
    const unit = angleOut ? (deg ? "^{\\circ}" : "\\,\\text{rad}") : "";
    return { tex: `${tex(node)} ${v[0]} ${v[1]}${unit}`, value: `${v[0]} ${v[1]}${unit}` };
  };
  if (!ambiguous) {
    const one = line(ast, false);
    if (!one) return null;
    return result({ kind: "arith", numeric: true, problemTex: tex(ast), answer: { tex: one.value.replace(/^= /, ""), approx: null }, methods: [{ id: "calc", steps: [step(T("scan.s.calc"), one.tex, { why: T("scan.w.calc") })] }], verified: true });
  }
  const deg = line(withUnit(ast, "deg"), true);
  const rad = line(withUnit(ast, "rad"), false);
  if (!deg) return null; // tan 90 ne obstaja v stopinjah: radiani niso pravi glavni rezultat
  const steps = [];
  if (deg) steps.push(step(T("scan.s.angleDeg"), deg.tex, { why: T("scan.w.angleDeg") }));
  if (rad) steps.push(step(T("scan.s.angleRad"), rad.tex, { why: T("scan.w.angleRad") }));
  return result({ kind: "arith", numeric: true, problemTex: tex(ast), answer: { tex: deg.tex, approx: rad ? rad.tex : null }, methods: [{ id: "calc", steps }], verified: true });
}

// ---------------------------------------------------------------------------
// Izrazi: poenostavljanje in razcep

function solveSimplify(ast) {
  const norm = normalizeSides([ast], [], { lcdAllowed: false });
  const p = norm.polys[0];
  const steps = norm.steps.length ? norm.steps : [step(T("scan.s.alreadySimple"), p.tex())];
  return result({
    kind: "simplify",
    problemTex: tex(ast),
    answer: { tex: p.tex() },
    methods: [{ id: "simplify", steps }],
    graph: p.vars().length === 1 ? { exprs: [`y=${p.text().replaceAll(p.vars()[0], "x")}`] } : null,
    verified: equalNumerically(ast, polyNode(p)),
  });
}

function solveFactor(ast) {
  const p0 = polyOf(ast);
  const steps = [];
  const norm = normalizeSides([ast], [], { lcdAllowed: false });
  if (norm.steps.length) steps.push(...norm.steps);
  const out = factorPoly(p0, steps);
  if (!out) return null;
  return result({
    kind: "factor",
    problemTex: tex(ast),
    answer: { tex: out },
    methods: [{ id: "factor", steps }],
    verified: equalNumerically(ast, parse(prep(texToText(out)))),
  });
}

// skupni faktor, razlika kvadratov/kubov, popolni kvadrat, tročlen (Vieta), racionalne ničle
function factorPoly(p, steps) {
  if (p.zero || p.terms().length < 2) {
    steps.push(step(T("scan.s.cantFactor"), p.tex()));
    return p.tex();
  }
  const terms = p.sorted();
  // 1. skupni faktor
  let g = terms.reduce((acc, t) => (acc ? gcdQPos(acc, t.c) : t.c.abs()), null);
  if (terms[0].c.sign < 0) g = g.neg();
  const vars = p.vars();
  const mono = {};
  for (const v of vars) {
    const e = Math.min(...terms.map((t) => t.m[v] || 0));
    if (e > 0) mono[v] = e; // brez x^0 v zapisu skupnega faktorja
  }
  const monoNonEmpty = Object.values(mono).some((e) => e > 0);
  let rest = p;
  let pre = "";
  if (!g.one || monoNonEmpty) {
    const div = new P([{ m: Object.fromEntries(Object.entries(mono).map(([v, e]) => [v, -e])), c: g.inv() }]);
    rest = new P(p.terms().map((t) => ({ m: Object.fromEntries(Object.entries(t.m).map(([v, e]) => [v, e - (mono[v] || 0)])), c: t.c.div(g) })));
    void div;
    pre = termTex({ m: mono, c: g }, true);
    if (pre === "-1") pre = "-";
    if (pre === "1") pre = "";
    steps.push(step(T("scan.s.commonFactor", { f: pre === "-" ? "-1" : pre || "1" }), `${pre}\\left(${rest.tex()}\\right)`, { why: T("scan.w.commonFactor") }));
  }
  const inner = factorRest(rest, steps);
  if (!inner) {
    if (!pre) {
      steps.push(step(T("scan.s.cantFactor"), p.tex(), { why: T("scan.w.cantFactor") }));
      return p.tex();
    }
    return `${pre}\\left(${rest.tex()}\\right)`;
  }
  const res = `${pre}${inner}`;
  if (pre) steps.push(step(T("scan.s.factorResult"), res));
  return res;
}

function gcdQPos(a, b) {
  return new Q(gcdInt(a.n * b.d, b.n * a.d), a.d * b.d).abs();
}

const sqMono = (t) => {
  // je člen popoln kvadrat? vrne koren
  if (t.c.sign <= 0) return null;
  const r = t.c.sqrt();
  if (!r) return null;
  const m = {};
  for (const [v, e] of Object.entries(t.m)) {
    if (e % 2) return null;
    m[v] = e / 2;
  }
  return { m, c: r };
};
const cubeMono = (t) => {
  const s = t.c.sign;
  const a = t.c.abs();
  const cr = (n) => {
    const r = BigInt(Math.round(Math.cbrt(Number(n))));
    return r * r * r === n ? r : null;
  };
  const rn = cr(a.n);
  const rd = cr(a.d);
  if (rn === null || rd === null) return null;
  const m = {};
  for (const [v, e] of Object.entries(t.m)) {
    if (e % 3) return null;
    m[v] = e / 3;
  }
  return { m, c: new Q(rn, rd).mul(s) };
};
const monoT = (t) => termTex(t, true);

function factorRest(p, steps) {
  const ts = p.sorted();
  // razlika kvadratov
  if (ts.length === 2) {
    const [a, b] = ts;
    const neg = b.c.sign < 0 ? b : a.c.sign < 0 ? a : null;
    const pos = neg === b ? a : b;
    if (neg && sqMono(pos) && sqMono({ ...neg, c: neg.c.neg() })) {
      const A = monoT(sqMono(pos));
      const B = monoT(sqMono({ ...neg, c: neg.c.neg() }));
      const res = `\\left(${A} - ${B}\\right)\\left(${A} + ${B}\\right)`;
      steps.push(step(T("scan.s.diffSquares"), res, { why: T("scan.w.diffSquares"), whyTex: `A^{2} - B^{2} = (A - B)(A + B),\\quad A = ${A},\\; B = ${B}` }));
      // A − B razstavimo naprej, kadar gre (x⁴ − 1 = (x² − 1)(x² + 1) = (x − 1)(x + 1)(x² + 1))
      const sa = sqMono(pos);
      const sb = sqMono({ ...neg, c: neg.c.neg() });
      const sub = [];
      const more = factorRest(new P([sa, { ...sb, c: sb.c.neg() }]), sub);
      if (!more) return res;
      steps.push(...sub);
      const all = `${more}\\left(${A} + ${B}\\right)`;
      steps.push(step(T("scan.s.factorResult"), all));
      return all;
    }
    const ca = cubeMono(a);
    const cb = cubeMono(b);
    if (ca && cb) {
      const A = monoT(ca);
      const Bs = cb.c.sign < 0;
      const B = monoT({ ...cb, c: cb.c.abs() });
      const sq = (x) => termTex(mulMono(x, x), true);
      const ab = termTex({ m: mergeM(ca.m, cb.m), c: ca.c.mul(cb.c.abs()) }, true);
      const res = Bs ? `\\left(${A} - ${B}\\right)\\left(${sq(ca)} + ${ab} + ${sq({ ...cb, c: cb.c.abs() })}\\right)` : `\\left(${A} + ${B}\\right)\\left(${sq(ca)} - ${ab} + ${sq(cb)}\\right)`;
      steps.push(step(T(Bs ? "scan.s.diffCubes" : "scan.s.sumCubes"), res, { why: T(Bs ? "scan.w.diffCubes" : "scan.w.sumCubes") }));
      return res;
    }
  }
  // popolni kvadrat a² ± 2ab + b²
  if (ts.length === 3) {
    const [a, mid, c] = ts;
    const ra = sqMono(a);
    const rc = sqMono(c);
    if (ra && rc) {
      const two = mulMono(ra, rc);
      two.c = two.c.mul(2);
      if (monoKey(two.m) === monoKey(mid.m) && two.c.abs().eq(mid.c.abs())) {
        const res = `\\left(${monoT(ra)} ${mid.c.sign < 0 ? "-" : "+"} ${monoT(rc)}\\right)^{2}`;
        steps.push(step(T("scan.s.perfectSquare"), res, { why: T(mid.c.sign < 0 ? "scan.w.sqMinus" : "scan.w.sqPlus") }));
        return res;
      }
    }
  }
  // ena spremenljivka: ničle
  const vars = p.vars();
  if (vars.length === 1) {
    const v = vars[0];
    const d = p.degree(v);
    if (d === 2) {
      const [c, b, a] = p.coeffs(v);
      const D = b.mul(b).sub(a.mul(c).mul(4));
      const r = D.sqrt();
      if (!r) return null;
      const x1 = b.neg().sub(r).div(a.mul(2));
      const x2 = b.neg().add(r).div(a.mul(2));
      const lin = (x) => new P([{ m: { [v]: 1 }, c: new Q(x.d) }, { m: {}, c: new Q(-x.n) }]);
      const lead = a.div(new Q(x1.d * x2.d));
      const pre = lead.one ? "" : lead.eq(-1) ? "-" : lead.tex();
      const res = x1.eq(x2) ? `${pre}\\left(${lin(x1).tex()}\\right)^{2}` : `${pre}\\left(${lin(x1).tex()}\\right)\\left(${lin(x2).tex()}\\right)`;
      if (a.one && b.int && c.int) {
        const p1 = x1.neg();
        const p2 = x2.neg();
        steps.push(step(T("scan.s.vieta", { p: c.tex(), s: b.tex(), m: p1.tex(), n: p2.tex() }), res, { why: T("scan.w.vietaTrinomial") }));
      } else steps.push(step(T("scan.s.trinomial"), res, { why: T("scan.w.trinomial"), whyTex: `${v}_{1} = ${x1.tex()},\\; ${v}_{2} = ${x2.tex()}` }));
      return res;
    }
    if (d >= 3) {
      let cs = p.coeffs(v);
      const factors = [];
      let guard = 0;
      while (cs.length - 1 > 2 && guard++ < 6) {
        const den = cs.reduce((l, c) => lcmInt(l, c.d), 1n);
        const ci = cs.map((c) => c.mul(new Q(den)));
        const rr = rationalRoots(ci);
        if (!rr.length) break;
        const r = rr[0];
        cs = hornerDivide(cs, r);
        factors.push(new P([{ m: { [v]: 1 }, c: new Q(r.d) }, { m: {}, c: new Q(-r.n) }]));
        cs = cs.map((c) => c.div(new Q(r.d)));
        steps.push(step(T("scan.s.horner", { r: r.tex() }), `${factors.map((f) => `\\left(${f.tex()}\\right)`).join("")}\\left(${polyFromCoeffs(cs, v).tex()}\\right)`, { why: T("scan.w.horner", { r: r.tex() }) }));
      }
      if (!factors.length) return null;
      const restP = polyFromCoeffs(cs, v);
      const sub = [];
      const inner = restP.degree(v) === 2 ? factorRest(restP, sub) : null;
      steps.push(...sub);
      return factors.map((f) => `\\left(${f.tex()}\\right)`).join("") + (inner || `\\left(${restP.tex()}\\right)`);
    }
  }
  return null;
}

// TeX razcepa → besedilo za preverjanje
export function texToText(s) {
  let out = String(s)
    .replace(/\\left|\\right/g, "")
    .replace(/\\big|\\Big/g, "")
    .replace(/\\cdot/g, "*")
    .replace(/\\pi/g, "π")
    .replace(/\{,\}/g, ".")
    .replace(/\\[,;:! ]|\\quad|~/g, " ")
    .replace(/\\tfrac|\\dfrac/g, "\\frac");
  // od znotraj navzven: ^{…}, \sqrt{…}, \frac{…}{…}
  for (let i = 0; i < 12; i++) {
    const before = out;
    out = out
      .replace(/\^\{([^{}]*)\}/g, "^($1)")
      .replace(/\\sqrt\{([^{}]*)\}/g, "sqrt($1)")
      .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, "(($1)/($2))")
      .replace(/_\{([^{}]*)\}/g, "_$1");
    if (out === before) break;
  }
  return out
    .replace(/\\(sin|cos|tan|cot|ln|log|exp)\^\(([^()]*)\)\(([^()]*)\)/g, "$1($3)^($2)")
    .replace(/\\(sin|cos|tan|cot|ln|log|exp)/g, "$1")
    .replace(/[{}]/g, "")
    .replace(/\\[a-zA-Z]+/g, "");
}

// ---------------------------------------------------------------------------
// Odvodi (pravila po korakih)

const OUTER = {
  sin: (g) => `\\cos\\left(${g}\\right)`,
  cos: (g) => `-\\sin\\left(${g}\\right)`,
  tan: (g) => `\\frac{1}{\\cos^{2}\\left(${g}\\right)}`,
  ln: (g) => `\\frac{1}{${g}}`,
  exp: (g) => `e^{${g}}`,
  sqrt: (g) => `\\frac{1}{2\\sqrt{${g}}}`,
};
const dTexP = (n) => `\\left(${tex(unwrap(n))}\\right)'`;
const wrapT = (n) => {
  const u = unwrap(n);
  return u.k === "+" || u.k === "-" ? `\\left(${tex(u)}\\right)` : tex(u);
};
// oklepaj okoli zapisa, ki ima + ali − na najvišji ravni (vsebino {…} in \left(…\right) preskočimo)
const topLevel = (s) => {
  let out = s.replace(/^-/, "");
  for (let prev = null; prev !== out; ) {
    prev = out;
    out = out.replace(/\{[^{}]*\}/g, "").replace(/\\left\((?:(?!\\left\(|\\right\)).)*\\right\)/g, "");
  }
  return out;
};
const wrapS = (s) => (/[+-]/.test(topLevel(s)) ? `\\left(${s}\\right)` : s);
function cleanD(n) {
  const s = simplify(n);
  const p = tryPoly(s);
  return p ? polyNode(p) : s;
}
function tableTex(f) {
  return (
    {
      sin: "(\\sin x)' = \\cos x",
      cos: "(\\cos x)' = -\\sin x",
      tan: "(\\tan x)' = \\frac{1}{\\cos^{2} x}",
      ln: "(\\ln x)' = \\frac{1}{x}",
      exp: "(e^{x})' = e^{x}",
      sqrt: "(\\sqrt{x})' = \\frac{1}{2\\sqrt{x}}",
    }[f] || null
  );
}

// odvod enega člena: pravilo, vmesni zapis in rezultat (TeX)
function dTerm(node, v) {
  const u = unwrap(node);
  const d = cleanD(diff(u, v));
  const out = { res: tex(d), k: "scan.s.dGeneric" };
  if (constQ(u)) return { ...out, k: "scan.s.dConst", formula: "(c)' = 0" };
  const p = tryPoly(u);
  if (p && p.vars().length <= 1 && p.terms().length === 1) {
    const t = p.terms()[0];
    return { ...out, res: p.tex() && polyOf(diff(u, v)).tex(), k: t.c.one ? "scan.s.dPower" : "scan.s.dConstPower", v: { n: String(t.m[v] || 0) }, formula: "(x^{n})' = n\\,x^{n-1}" };
  }
  if (u.k === "neg") {
    const r = dTerm(u.a, v);
    return { ...r, res: r.res.startsWith("-") ? r.res.slice(1) : `-${wrapS(r.res)}`, mid: null };
  }
  if (u.k === "^") {
    const e = constQ(u.b);
    const base = unwrap(u.a);
    if (e && base.k === "var") return { ...out, k: "scan.s.dPower", v: { n: e.tex() }, formula: "(x^{n})' = n\\,x^{n-1}" };
    if (e) {
      const gp = cleanD(diff(base, v));
      const gq = constQ(gp);
      const n1 = e.sub(1);
      const pw = n1.one ? "" : `^{${n1.tex()}}`;
      const mid = `${e.tex()}\\left(${tex(base)}\\right)${pw} \\cdot ${dTexP(base)}`;
      const res = gq ? `${e.mul(gq).tex()}\\left(${tex(base)}\\right)${pw}` : `${e.tex()}\\left(${tex(base)}\\right)${pw}\\left(${tex(gp)}\\right)`;
      return { ...out, res, mid, k: "scan.s.dChain", formula: "\\big(g(x)^{n}\\big)' = n\\,g(x)^{n-1} \\cdot g'(x)" };
    }
    if (constQ(base) || base.k === "const") return { ...out, k: "scan.s.dExp", formula: "(a^{x})' = a^{x} \\ln a,\\quad (e^{x})' = e^{x}" };
  }
  if (u.k === "call" && u.args.length === 1 && OUTER[u.f]) {
    const g = unwrap(u.args[0]);
    if (g.k === "var") return { ...out, k: "scan.s.dTable", v: { f: u.f }, formula: tableTex(u.f) };
    const gp = cleanD(diff(g, v));
    const gT = tex(g);
    const gpT = tex(gp);
    const mid = `${OUTER[u.f](gT)} \\cdot ${dTexP(g)}`;
    let res;
    if (u.f === "ln") res = `\\frac{${gpT}}{${gT}}`;
    else if (u.f === "sqrt") {
      const half = tryPoly(gp)?.scale(new Q(1n, 2n));
      res = half && half.terms().every((t) => t.c.int) ? `\\frac{${half.tex({ main: v })}}{\\sqrt{${gT}}}` : `\\frac{${gpT}}{2\\sqrt{${gT}}}`;
    }
    else if (u.f === "tan") res = `\\frac{${gpT}}{\\cos^{2}\\left(${gT}\\right)}`;
    else if (constQ(gp)) res = `${OUTER[u.f](gT).startsWith("-") ? "-" : ""}${constQ(gp).abs().one ? "" : constQ(gp).abs().tex()}${OUTER[u.f](gT).replace(/^-/, "")}`.replace(/^--/, "");
    else {
      // 6x · (−sin(3x²)) zapišemo kot −6x · sin(3x²)
      const o = OUTER[u.f](gT);
      let a = wrapS(gpT);
      let neg = o.startsWith("-");
      if (gpT.startsWith("-") && wrapS(gpT.slice(1)) === gpT.slice(1)) {
        a = gpT.slice(1);
        neg = !neg;
      }
      res = `${neg ? "-" : ""}${a} \\cdot ${o.replace(/^-/, "")}`;
    }
    if (u.f !== "ln" && u.f !== "sqrt" && u.f !== "tan" && constQ(gp)?.sign < 0) res = res.startsWith("-") ? res.slice(1) : `-${res}`;
    return { ...out, res, mid, k: "scan.s.dChain", formula: "\\big(f(g(x))\\big)' = f'(g(x)) \\cdot g'(x)" };
  }
  if (u.k === "*") {
    const ca = constQ(u.a);
    if (ca) {
      const r = dTerm(u.b, v);
      const neg = r.res.startsWith("-") !== (ca.sign < 0);
      const body = r.res.replace(/^-/, "");
      const cT = ca.abs().one ? "" : ca.abs().tex();
      return { ...out, res: `${neg ? "-" : ""}${cT}${cT && (!ca.int || /^\d/.test(body)) ? " \\cdot " : ""}${wrapS(body)}`, mid: `${ca.tex()} \\cdot ${dTexP(u.b)}`, k: "scan.s.dConstMul", formula: "(c \\cdot f)' = c \\cdot f'" };
    }
    const mid = `${dTexP(u.a)} \\cdot ${wrapT(u.b)} + ${wrapT(u.a)} \\cdot ${dTexP(u.b)}`;
    const pp = tryPoly(d);
    return { ...out, res: pp ? pp.tex({ main: v }) : out.res, mid, k: "scan.s.dProduct", formula: "(u \\cdot v)' = u' v + u v'" };
  }
  if (u.k === "/") {
    const cb = constQ(u.b);
    if (cb) return { ...out, k: "scan.s.dConstMul", formula: "\\left(\\frac{f}{c}\\right)' = \\frac{f'}{c}" };
    const mid = `\\frac{${dTexP(u.a)} \\cdot ${wrapT(u.b)} - ${wrapT(u.a)} \\cdot ${dTexP(u.b)}}{${wrapT(u.b)}^{2}}`;
    const pu = tryPoly(u.a);
    const pv = tryPoly(u.b);
    let res = out.res;
    if (pu && pv) {
      const N = polyOf(diff(u.a, v)).mul(pv).sub(pu.mul(polyOf(diff(u.b, v))));
      const pvT = pv.tex({ main: v });
      res = `\\frac{${N.tex({ main: v })}}{${/^[a-zA-Z]$/.test(pvT) ? pvT : `\\left(${pvT}\\right)`}^{2}}`;
    }
    return { ...out, res, mid, k: "scan.s.dQuotient", formula: "\\left(\\frac{u}{v}\\right)' = \\frac{u' v - u v'}{v^{2}}" };
  }
  return out;
}

function solveDerivative(ast, v = "x") {
  ast = unwrap(ast);
  const steps = [];
  const terms = sideTerms(ast);
  const dTex = (n) => `\\left(${tex(n)}\\right)'`;
  if (terms.length > 1) steps.push(step(T("scan.s.dSum"), terms.map((t, i) => `${i ? (t.sign < 0 ? " - " : " + ") : t.sign < 0 ? "-" : ""}${dTex(t.node)}`).join(""), { why: T("scan.w.dSum") }));
  const parts = terms.map((t) => ({ sign: t.sign, r: dTerm(t.node, v), node: t.node }));
  for (const { r, node } of parts) {
    steps.push(step(T(r.k, r.v || {}), `${dTex(node)} = ${r.mid ? `${r.mid} = ` : ""}${r.res}`, { why: T(r.k.replace("scan.s.", "scan.w.")), whyTex: r.formula || null }));
  }
  const total = cleanD(diff(ast, v));
  const tp = tryPoly(total);
  let ansTex;
  if (parts.length === 1) {
    const r0 = parts[0].r.res;
    // −(−2x · sin x²) = 2x · sin x², −(−x + 1) = −(−x + 1) z oklepajem, nikoli »−−«
    if (parts[0].sign > 0) ansTex = r0;
    else if (r0.startsWith("-") && wrapS(r0.slice(1)) === r0.slice(1)) ansTex = r0.slice(1);
    else ansTex = `-${r0.startsWith("-") ? `\\left(${r0}\\right)` : wrapS(r0)}`;
  }
  else if (tp) ansTex = tp.tex({ main: v });
  else
    ansTex =
      parts
        .filter((p) => p.r.res !== "0")
        .map((p, i) => {
          const sg = p.sign * (p.r.res.startsWith("-") ? -1 : 1);
          const body = wrapS(p.r.res.replace(/^-/, ""));
          return i ? `${sg < 0 ? " - " : " + "}${body}` : `${sg < 0 ? "-" : ""}${body}`;
        })
        .join("") || "0";
  if (parts.length > 1) steps.push(step(T("scan.s.dCombine"), `f'(${v}) = ${ansTex}`, { why: T("scan.w.dCombine") }));
  // preverimo prikazani odvod z numeričnim odvodom
  const check = (texStr) => {
    try {
      const f = compile(ast);
      const g = compile(parse(prep(texToText(texStr))));
      let tested = 0;
      for (const x of [0.37, 1.3, 2.1, -0.8, 3.7, -2.2, 0.9]) {
        const h = 1e-5;
        const num = (f({ [v]: x + h }) - f({ [v]: x - h })) / (2 * h);
        const val = g({ [v]: x });
        if (!Number.isFinite(num) || !Number.isFinite(val)) continue;
        tested++;
        if (Math.abs(num - val) > 1e-4 * Math.max(1, Math.abs(num))) return false;
      }
      return tested > 0;
    } catch {
      return false;
    }
  };
  let ok = check(ansTex);
  if (!ok && check(tex(total))) {
    ansTex = tex(total);
    ok = true;
  }
  return result({
    kind: "derivative",
    problemTex: `f(${v}) = ${tex(ast)}`,
    answer: { tex: `f'(${v}) = ${ansTex}` },
    methods: [{ id: "rules", steps }],
    graph: { exprs: [`f(x)=${toPlainExpr(ast, v)}`, `y=${texToText(ansTex).replaceAll(v, "x")}`] },
    verified: ok,
  });
}

function toPlainExpr(n, v) {
  return texToText(tex(n)).replaceAll(v, "x");
}

// ---------------------------------------------------------------------------
// Preverjanje enakosti izrazov v naključnih točkah

export function equalNumerically(a, b, vars = null) {
  try {
    const fa = compile(a);
    const fb = compile(b);
    const vs = vars || [...new Set([...varsOf(a), ...varsOf(b)])];
    let tested = 0;
    // točke v [−1,7; 2,4] in še v [4,3; 12] (izrazi, definirani le za večje x, npr. √(x − 3))
    for (let i = 0; i < 18; i++) {
      const env = Object.fromEntries(vs.map((v, j) => [v, i < 12 ? 0.3 + ((i * 7 + j * 3) % 11) * 0.41 - 2 : 4.3 + ((i * 5 + j * 3) % 11) * 0.77]));
      const x = fa(env);
      const y = fb(env);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      tested++;
      if (Math.abs(x - y) > 1e-8 * Math.max(1, Math.abs(x))) return false;
    }
    return tested >= (vs.length ? 3 : 1);
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Graf

function graphFor(sides, v, sols = []) {
  try {
    const [l, r] = sides.map((s) => toPlainExpr(s, v));
    const rc = constQ(sides[1]);
    const exprs = rc && rc.zero ? [`y=${l}`] : [`y=${l}`, `y=${r}`];
    const pts = sols.filter((s) => s.q || Number.isFinite(s.num)).map((s) => s.q ? s.q.num() : s.num);
    return { exprs, xs: pts };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Vstop

// (3/4) iz prep() je ulomek, ne oklepaj: pri izpisu brez oklepajev, pri računanju eno število.
function liftFracs(n) {
  if (!n || typeof n !== "object") return n;
  if (n.k === "grp" && n.a.k === "/" && n.a.a.k === "num" && n.a.b.k === "num" && Number.isInteger(n.a.a.v) && Number.isInteger(n.a.b.v) && n.a.b.v !== 0) return { ...n.a, frac: true };
  const o = { ...n };
  for (const k of ["a", "b"]) if (n[k]) o[k] = liftFracs(n[k]);
  if (n.args) o.args = n.args.map(liftFracs);
  if (n.terms) o.terms = n.terms.map(liftFracs);
  return o;
}

function result(r) {
  return { ok: true, ...r };
}

export const GOALS = { arith: ["evaluate"], eq: ["solve"], expr1: ["simplify", "factor", "zeros", "derivative"], exprN: ["simplify", "factor"], func: ["derivative"] };

// Kaj je naloga in katere cilje ponudimo.
export function analyze(text) {
  const sys = splitSystem(text);
  if (sys) return { type: "system", parts: sys, goals: ["solve"] };
  const src = prep(text);
  if (!src) return { type: "empty", goals: [] };
  let ast;
  try {
    ast = parse(src);
  } catch (err) {
    return { type: "error", error: err.code || "parse", goals: [] };
  }
  ast = liftFracs(ast);
  if (ast.k === "der") return { type: "derivative", ast: unwrap(ast.a), v: ast.v, goals: ["derivative"] };
  const vars = varsOf(ast).filter((v) => v !== "e");
  if (ast.k === "cmp") {
    if (vars.length === 1) return { type: "equation", ast, v: vars[0], goals: ["solve"] };
    return { type: "equation-multi", ast, vars, goals: ["solve"] };
  }
  if (!vars.length) return { type: "arith", ast, goals: ["evaluate"] };
  const poly = tryPoly(ast);
  if (poly && vars.length === 1) return { type: "expr", ast, v: vars[0], goals: ["simplify", "factor", "zeros", "derivative"] };
  if (poly) return { type: "expr", ast, goals: ["simplify", "factor"] };
  // ulomek s spremenljivko v imenovalcu (npr. (x² − 1)/(x − 1)) v šoli največkrat okrajšamo; to naredi AI
  if (vars.length === 1) return { type: "func", ast, v: vars[0], goals: rationalExpr(ast) ? ["simplify", "derivative"] : ["derivative"] };
  return { type: "other", ast, goals: [] };
}

function rationalExpr(ast) {
  let calls = false;
  let den = false;
  walkTree(ast, (n) => {
    if (n.k === "call" || n.k === "const" || (n.k === "^" && varsOf(n.b).length)) calls = true;
    if (n.k === "/" && varsOf(n.b).length) den = true;
  });
  return den && !calls;
}

// Besedilo naloge → drevo za izpis (ulomki brez odvečnih oklepajev).
export function parseTask(text) {
  return liftFracs(parse(prep(text)));
}

// Glavni vstop. Vrne { ok:false, reason } kadar naloge ne znamo rešiti po korakih (takrat pomaga AI).
export function solve(text, { goal = null, complex = false } = {}) {
  const info = analyze(text);
  const g = goal && info.goals.includes(goal) ? goal : info.goals[0];
  const base = { goals: info.goals, goal: g ?? null };
  try {
    let r = null;
    switch (info.type) {
      case "system":
        r = solveSystem(info.parts);
        break;
      case "equation":
        if (info.ast.terms.length === 3) r = solveDouble(info.ast, info.v);
        else if (info.ast.terms.length === 2) {
          const rational = info.ast.ops[0] === "=" && info.ast.terms.some((t) => !tryPoly(t)) && info.ast.terms.every((t) => sideTerms(t).every(({ node }) => tryPoly(node) || (unwrap(node).k === "/" && tryPoly(unwrap(node).a) && tryPoly(unwrap(node).b))));
          r = rational ? solveRational(info.ast, info.v, { complex }) : solveOneVar(info.ast, info.v, { complex });
        }
        break;
      case "arith":
        try {
          r = solveArith(info.ast);
        } catch (err) {
          // funkcije in konstante (sin 15, log 2, π): približek kot na kalkulatorju, brez AI
          if (!(err instanceof AlgebraError) || err.message !== "func") throw err;
          // 2e3 razčlenjevalnik bere kot 2·e·3 – znanstvenega zapisa ne ugibamo
          if (/\d\s*e\s*[-+]?\d/i.test(prep(text))) throw err;
          r = solveNumeric(info.ast);
        }
        break;
      case "expr":
        if (g === "factor") r = solveFactor(info.ast);
        else if (g === "zeros") r = solveOneVar({ k: "cmp", ops: ["="], terms: [info.ast, { k: "num", v: 0 }] }, info.v, { complex });
        else if (g === "derivative") r = solveDerivative(info.ast, info.v);
        else r = solveSimplify(info.ast);
        break;
      case "derivative":
        r = solveDerivative(info.ast, info.v);
        break;
      case "func":
        r = g === "derivative" ? solveDerivative(info.ast, info.v) : null;
        break;
    }
    if (!r) return { ok: false, reason: info.type === "error" ? "parse" : "unsupported", ...base, type: info.type };
    if (!r.verified) return { ok: false, reason: "unverified", ...base, type: info.type };
    return { ...r, ...base, goal: g, type: info.type };
  } catch (err) {
    return { ok: false, reason: err instanceof AlgebraError ? "unsupported" : "error", detail: String(err?.message || err), ...base, type: info.type };
  }
}

// Za preverjanje AI rešitev (server in vmesnik): ali vrednost reši enačbo?
export function satisfies(eqText, env) {
  try {
    const ast = parse(prep(eqText));
    if (ast.k !== "cmp") return null;
    const vals = ast.terms.map((t) => compile(t)(env));
    if (vals.some((x) => !Number.isFinite(x))) return false;
    return ast.ops.every((op, i) => {
      const a = vals[i];
      const b = vals[i + 1];
      const tol = 1e-6 * Math.max(1, Math.abs(a), Math.abs(b));
      return op === "=" ? Math.abs(a - b) <= tol : op === "<" ? a < b + tol : op === ">" ? a > b - tol : op === "<=" ? a <= b + tol : a >= b - tol;
    });
  } catch {
    return null;
  }
}

export { normalize, parse };
