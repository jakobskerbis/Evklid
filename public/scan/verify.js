// Preverjanje rešitev, ki jih napiše AI (strežnik in vmesnik uporabljata isto kodo).
// Polinomske enačbe in neenačbe preverimo točno (public/scan/algebra.js: rešitve oblike u + w·√c brez decimalk,
// Sturmov izrek za popolnost, kritične točke neenačbe); drugo numerično: rešitve vstavimo v enačbo,
// izraze primerjamo v naključnih točkah, odvode z numeričnim odvodom, nedoločene integrale z odvajanjem.
// Vsak izid ima status iz public/scan/status.js; numerična potrditev nikoli ni »Preverjeno« (AUDIT-001).
import { parse, compile, integrate } from "../graph/math.js";
import { prep, splitSystem, satisfies, equalNumerically } from "./solvecore.js";
import { tryPoly, withLimit, surdOf, polyEquationProof, inequalityProof } from "./algebra.js";
import { statusOf } from "./status.js";

const fin = Number.isFinite;

function fnOf(text) {
  try {
    return compile(parse(prep(text)));
  } catch {
    return null;
  }
}

// vrednost »2«, »-1/3«, »sqrt(2)«, »π/6 + 2kπ« (k = 0, 1, −1)
function values(expr) {
  const f = fnOf(String(expr).replace(/\bk\b/g, "k"));
  if (!f) return [];
  const out = [];
  for (const k of [0, 1, -1]) {
    const v = f({ k });
    if (fin(v)) out.push(v);
  }
  return [...new Set(out)];
}

// Ničle L − D (za rešitve, ki jih AI morda ni našel): gosta mreža na [−50, 50], redkejša (geometrijska) do ±10⁶,
// predznak se zamenja → bisekcija; dotikalne ničle (|L − D| ima lokalni minimum ≈ 0, npr. |x − 1,1| = 0) → zlati rez.
function scanRoots(eqText, v) {
  let ast;
  try {
    ast = parse(prep(eqText));
  } catch {
    return [];
  }
  if (ast.k !== "cmp" || ast.terms.length !== 2 || ast.ops[0] !== "=") return [];
  const L = compile(ast.terms[0]);
  const R = compile(ast.terms[1]);
  const g = (x) => L({ [v]: x }) - R({ [v]: x });
  const tol = (x) => 1e-9 * Math.max(1, Math.abs(L({ [v]: x })), Math.abs(R({ [v]: x })));
  const xs = [];
  for (let i = 0; i <= 4000; i++) xs.push(-50 + i / 40);
  for (let i = 1; i <= 400; i++) {
    const x = 50 * Math.pow(2e4, i / 400);
    xs.push(x, -x);
  }
  xs.sort((a, b) => a - b);
  const ys = xs.map(g);
  const roots = [];
  const add = (r) => {
    if (fin(g(r)) && Math.abs(g(r)) <= tol(r) && !roots.some((q) => Math.abs(q - r) < 1e-6 * Math.max(1, Math.abs(r)))) roots.push(r);
  };
  for (let i = 1; i < xs.length; i++) {
    const [px, x, py, y] = [xs[i - 1], xs[i], ys[i - 1], ys[i]];
    if (fin(py) !== fin(y)) {
      // rob definicijskega območja (npr. √(x − 60) = 0 ima ničlo v x = 60)
      let lo = px;
      let hi = x;
      for (let k = 0; k < 80; k++) {
        const m = (lo + hi) / 2;
        if (fin(g(m)) === fin(py)) lo = m;
        else hi = m;
      }
      add(fin(py) ? lo : hi);
      continue;
    }
    if (!fin(py) || !fin(y)) continue;
    if (py === 0) add(px);
    if (py * y < 0) {
      let lo = px;
      let hi = x;
      for (let k = 0; k < 80; k++) {
        const m = (lo + hi) / 2;
        if (g(lo) * g(m) <= 0) hi = m;
        else lo = m;
      }
      add((lo + hi) / 2);
    } else if (i + 1 < xs.length && fin(ys[i + 1]) && Math.abs(y) <= Math.abs(py) && Math.abs(y) <= Math.abs(ys[i + 1]) && y * ys[i + 1] > 0) {
      let a = px;
      let b = xs[i + 1];
      const k = (Math.sqrt(5) - 1) / 2;
      for (let n = 0; n < 120 && b - a > 1e-15 * Math.max(1, Math.abs(a)); n++) {
        const c = b - k * (b - a);
        const d = a + k * (b - a);
        if (Math.abs(g(c)) < Math.abs(g(d))) b = d;
        else a = c;
      }
      add((a + b) / 2);
    }
  }
  return roots.sort((a, b) => Math.abs(a) - Math.abs(b));
}

// enačba z enim samim »=« (neenačbe in izrazi se ne preverjajo kot enačbe)
function isEquation(text) {
  try {
    const ast = parse(prep(text));
    return ast.k === "cmp" && ast.ops.every((o) => o === "=");
  } catch {
    return false;
  }
}

// Polinom L − D enačbe ali neenačbe z neznanko v (koeficienti a0..an kot Q), sicer null. Večja meja ulomkov:
// (x − 10¹²)(x − 2·10¹²)(x − 3·10¹²) ima koeficiente do 10³⁷.
const POLY_LIMIT = 10n ** 400n;
function sidesPoly(a, b, v) {
  try {
    return withLimit(POLY_LIMIT, () => {
      const pa = tryPoly(a);
      const pb = tryPoly(b);
      if (!pa || !pb || [...pa.vars(), ...pb.vars()].some((x) => x !== v)) return null;
      return pa.sub(pb).coeffs(v);
    });
  } catch {
    return null;
  }
}

// »2«, »-1/3«, »(1+sqrt(5))/2« → točno (Surd); sicer null
function exactValue(text) {
  try {
    return surdOf(parse(prep(text)));
  } catch {
    return null;
  }
}

// Množica v zapisu »(-oo, 2) U [3, oo)«, »{1, 2}«, »R«, »{}« → intervali s krajišči { s: Surd|null, x: število };
// null = zapisa ne razumemo.
const INF = /^\s*([+-]?)\s*(oo|inf(inity)?|∞|\\infty)\s*$/i;
export function parseSet(text) {
  const src = String(text ?? "").replace(/\\left|\\right/g, "").replace(/−/g, "-").trim();
  if (/^(\{\s*\}|∅|\\emptyset|none|ni rešitve|no solution)$/i.test(src)) return [];
  if (/^(R|ℝ|\\mathbb\{R\}|all|reals)$/i.test(src)) return [{ lo: null, hi: null }];
  const end = (e) => {
    const m = INF.exec(e);
    if (m) return m[1] === "-" ? { inf: -1 } : { inf: 1 };
    const x = compileValue(e);
    if (!Number.isFinite(x)) return null;
    return { s: exactValue(e), x };
  };
  const out = [];
  for (const part of src.split(/\s*(?:\bU\b|∪|\\cup)\s*/)) {
    const iv = /^([([])(.*),(.*)([)\]])$/.exec(part.trim());
    if (iv) {
      const lo = end(iv[2]);
      const hi = end(iv[3]);
      if (!lo || !hi || lo.inf === 1 || hi.inf === -1) return null;
      out.push({ lo: lo.inf ? null : lo, hi: hi.inf ? null : hi, loClosed: iv[1] === "[", hiClosed: iv[4] === "]" });
      continue;
    }
    const pt = /^\{(.*)\}$/.exec(part.trim());
    if (pt) {
      for (const e of pt[1].split(",")) {
        const p = end(e);
        if (!p || p.inf) return null;
        out.push({ point: p });
      }
      continue;
    }
    return null;
  }
  return out;
}
function compileValue(e) {
  try {
    return compile(parse(prep(e)))({});
  } catch {
    return NaN;
  }
}

/**
 * ai: { kind, variable, problem, solutions: [..], value, steps … }
 * Vrne { verified: bool, reason, missing: [x …], partial?, status }. verified: navedeno drži in nobena rešitev
 * ne manjka (lahko le numerično); partial: true = popolnosti (ni drugih rešitev) nismo preverili (sistem,
 * periodične rešitve). status: public/scan/status.js.
 */
export function verifyAi(problemText, ai) {
  const r = check(problemText, ai);
  const ev = r.evidence || (r.verified ? { holds: true, how: "numeric", complete: r.partial ? "unknown" : "numeric" } : { holds: r.reason === "wrong" || r.reason === "missing" ? false : null });
  const status = statusOf(ev);
  const out = { ...r, partial: ev.complete === "unknown" || undefined, status };
  delete out.evidence;
  if (!out.partial) delete out.partial;
  return r.verified ? { ...out, reason: null } : out;
}

function check(problemText, ai) {
  const kind = ai?.kind;
  const v = /^[a-zA-Z]$/.test(ai?.variable || "") ? ai.variable : "x";
  try {
    if (kind === "system") {
      const parts = splitSystem(problemText) || String(problemText).split(/;|\n/).filter((s) => s.includes("="));
      for (const sol of ai.solutions || []) {
        const vals = new Map(); // ključ je ena črka; Map namesto pisanja v objekt (CodeQL js/remote-property-injection)
        for (const m of String(sol).matchAll(/([a-zA-Z])\s*=\s*([^;,]+(?:,\d+)?)/g)) {
          const val = values(m[2])[0];
          if (val === undefined) return { verified: false, reason: "parse" };
          vals.set(m[1], val);
        }
        const env = Object.fromEntries(vals);
        if (!parts.length || parts.some((p) => satisfies(p, env) !== true)) return { verified: false, reason: "wrong" };
      }
      // Numerika preveri le, da vsaka dana rešitev zadošča sistemu, ne pa, da ni še drugih (AUDIT-001):
      // »partial« pove strežniku, da »preverjeno« sme reči le SymPy (server/scan.js verifyAiFull).
      return { verified: (ai.solutions || []).length > 0, reason: (ai.solutions || []).length ? null : "empty", partial: true };
    }
    if (kind === "equation") {
      if (!isEquation(problemText)) return { verified: false, reason: "kind" };
      // »x = 2« ali »x_1 = 2« → »2«
      const sols = (ai.solutions || []).flatMap((s) => values(String(s).replace(/^\s*[a-zA-Z](?:_\{?\d+\}?)?\s*=(?!=)/, "")));
      const periodic = (ai.solutions || []).some((s) => /\bk\b/.test(s));
      // Polinomska enačba: točen preizkus in Sturmov izrek (popolnost na vsej realni osi, ne le do ±10⁶; AUDIT-001)
      const ast = parse(prep(problemText));
      const cs = periodic ? null : sidesPoly(ast.terms[0], ast.terms[1], v);
      if (cs && cs.length > 1) {
        const raw = (ai.solutions || []).map((s) => String(s).replace(/^\s*[a-zA-Z](?:_\{?\d+\}?)?\s*=(?!=)/, ""));
        const claims = raw.map((s) => {
          const e = exactValue(s);
          return e ? { s: e } : { num: values(s)[0] };
        });
        if (claims.some((c) => !c.s && !Number.isFinite(c.num))) return { verified: false, reason: "parse" };
        const pe = polyEquationProof(cs, claims);
        if (pe) {
          if (!pe.holds) return { verified: false, reason: "wrong" };
          if (pe.complete === false) return { verified: false, reason: "missing", missing: pe.missing };
          return { verified: true, evidence: { holds: true, how: pe.exact ? "exact" : "numeric", complete: pe.complete === true ? "exact" : "numeric" } };
        }
      }
      if (!(ai.solutions || []).length) {
        // »ni rešitve«: preverimo, da numerično res ni ničle. Iskanje seže le do ±10⁶, zato prazen izid
        // ni dokaz, da rešitve ni (numerično, AUDIT-001).
        const r = scanRoots(problemText, v);
        return r.length ? { verified: false, reason: "missing", missing: r } : { verified: true, reason: null, missing: r };
      }
      if (!sols.length) return { verified: false, reason: "parse" };
      for (const s of sols) if (satisfies(problemText, { [v]: s }) !== true) return { verified: false, reason: "wrong" };
      if (!periodic) {
        const missing = scanRoots(problemText, v).filter((r) => !sols.some((s) => Math.abs(s - r) < 1e-5 * Math.max(1, Math.abs(r))));
        if (missing.length) return { verified: false, reason: "missing", missing };
      }
      // Pri periodičnih rešitvah (k) popolnosti numerično ne preverimo: manjkajoča družina ali »2+0·k«
      // namesto dveh rešitev bi sicer veljala za preverjeno (AUDIT-001).
      // Brez periodičnih rešitev je popolnost preverjena numerično (iskanje ničel do ±10⁶).
      return periodic ? { verified: true, partial: true } : { verified: true };
    }
    if (kind === "inequality") return checkInequality(problemText, ai, v);
    if (kind === "expression" || kind === "arith") {
      const a = parse(prep(problemText));
      const b = parse(prep(ai.value));
      // polinoma primerjamo točno (ulomki), sicer v naključnih točkah
      const ok = withLimit(POLY_LIMIT, () => {
        const pa = tryPoly(a);
        const pb = tryPoly(b);
        return pa && pb ? pa.eq(pb) : null;
      });
      if (ok !== null) return { verified: ok, reason: "wrong", evidence: { holds: ok, how: "exact", complete: "na" } };
      return { verified: equalNumerically(a, b), reason: "wrong" };
    }
    if (kind === "derivative") {
      const izraz = String(problemText).replace(/^\s*(d\/d[a-z]|f\(x\)\s*=)\s*/, "");
      const f = fnOf(izraz);
      const g = fnOf(ai.value);
      if (!f || !g) return { verified: false, reason: "parse" };
      // Naloga brez »d/dx« ali »f(x) =«, ki je konstanta (npr. določeni integral): odvod bi bil 0 in bi potrdil napačno
      // rešitev »0«, ki jo AI označi kot odvod (meritev skenerja 19. 11., naloga s11).
      if (izraz === String(problemText)) {
        const y = [0.3, 1.7, -2.1].map((t) => f({ [v]: t }));
        if (y.every((w) => fin(w) && Math.abs(w - y[0]) < 1e-9)) return { verified: false, reason: "kind" };
      }
      return { verified: compareFns((x) => (f({ [v]: x + 1e-5 }) - f({ [v]: x - 1e-5 })) / 2e-5, (x) => g({ [v]: x })), reason: "wrong" };
    }
    if (kind === "integral") {
      const m = /∫\s*(?:_\(?([^\s^]+?)\)?\^\(?([^\s]+?)\)?)?\s*(.+?)\s*d([a-z])\s*$/.exec(String(problemText).replace(/\\int/g, "∫"));
      const g = fnOf(ai.value);
      if (!m || !g) return { verified: false, reason: "parse" };
      const f = fnOf(m[3]);
      const x = m[4];
      if (!f) return { verified: false, reason: "parse" };
      if (m[1] !== undefined) {
        const a = values(m[1])[0];
        const b = values(m[2])[0];
        const exact = integrate((t) => f({ [x]: t }), a, b);
        const val = g({});
        return { verified: fin(exact) && fin(val) && Math.abs(exact - val) < 1e-6 * Math.max(1, Math.abs(exact)), reason: "wrong" };
      }
      return { verified: compareFns((t) => f({ [x]: t }), (t) => (g({ [x]: t + 1e-5 }) - g({ [x]: t - 1e-5 })) / 2e-5), reason: "wrong" };
    }
  } catch {
    return { verified: false, reason: "error" };
  }
  return { verified: false, reason: "kind" };
}

// Neenačba (AI navede množico v ai.value, npr. »(-oo, 2) U [3, oo)«): polinomska s točnimi krajišči točno
// (kritične točke), sicer v mnogo točkah do ±10⁶ (numerično, brez krajišč, kjer odloča zaokroževanje).
function checkInequality(problemText, ai, v) {
  let ast;
  try {
    ast = parse(prep(problemText));
  } catch {
    return { verified: false, reason: "parse" };
  }
  if (ast.k !== "cmp" || ast.ops.some((o) => o === "=")) return { verified: false, reason: "kind" };
  const ivs = parseSet(ai.value);
  if (!ivs) return { verified: false, reason: "parse" };
  const ends = ivs.flatMap((iv) => [iv.lo, iv.hi, iv.point]).filter(Boolean);
  const rels = ast.ops.map((op, i) => ({ cs: sidesPoly(ast.terms[i], ast.terms[i + 1], v), op }));
  if (rels.every((r) => r.cs) && ends.every((e) => e.s)) {
    const toS = (e) => (e ? e.s : null);
    const proved = inequalityProof(
      rels,
      ivs.map((iv) => ({ ...iv, lo: toS(iv.lo), hi: toS(iv.hi), point: toS(iv.point) })),
    );
    if (proved !== null) return { verified: proved, reason: "wrong", evidence: proved ? { holds: true, how: "exact", complete: "exact" } : { holds: false } };
  }
  const inSet = (x) =>
    ivs.some((iv) => (iv.point ? x === iv.point.x : (iv.lo == null || x > iv.lo.x || (iv.loClosed && x === iv.lo.x)) && (iv.hi == null || x < iv.hi.x || (iv.hiClosed && x === iv.hi.x))));
  const xs = [];
  for (let i = 0; i <= 4000; i++) xs.push(-50 + i / 40 + 0.0013);
  for (let i = 1; i <= 400; i++) {
    const x = 50 * Math.pow(2e4, i / 400);
    xs.push(x, -x);
  }
  for (const e of ends) for (const d of [1e-4, 1e-2]) xs.push(e.x - d * Math.max(1, Math.abs(e.x)), e.x + d * Math.max(1, Math.abs(e.x)));
  const fs = ast.terms.map((t) => compile(t));
  let tested = 0;
  for (const x of xs) {
    if (ends.some((e) => Math.abs(x - e.x) < 1e-5 * Math.max(1, Math.abs(e.x)))) continue;
    const vals = fs.map((f) => f({ [v]: x }));
    if (vals.some((y) => !Number.isFinite(y))) {
      if (inSet(x)) return { verified: false, reason: "wrong" }; // zunaj definicijskega območja ne more biti rešitev
      continue;
    }
    let truth = true;
    for (let i = 0; i < ast.ops.length; i++) {
      const [a, b] = [vals[i], vals[i + 1]];
      const tol = 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
      if (Math.abs(a - b) <= tol) {
        truth = null; // skoraj enako: o tej točki ne odločamo
        break;
      }
      const op = ast.ops[i];
      if ((op === "<" || op === "<=") !== a < b) truth = false;
    }
    if (truth === null) continue;
    tested++;
    if (truth !== inSet(x)) return { verified: false, reason: "wrong" };
  }
  return tested ? { verified: true, evidence: { holds: true, how: "numeric", complete: "numeric" } } : { verified: false, reason: "parse" };
}

function compareFns(f, g) {
  let tested = 0;
  for (const x of [0.37, 1.3, 2.1, -0.8, 3.7, -2.2, 0.9, 5.3]) {
    const a = f(x);
    const b = g(x);
    if (!fin(a) || !fin(b)) continue;
    tested++;
    if (Math.abs(a - b) > 1e-4 * Math.max(1, Math.abs(a))) return false;
  }
  return tested >= 2;
}
