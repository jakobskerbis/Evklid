// Preverjanje rešitev, ki jih napiše AI (strežnik in vmesnik uporabljata isto kodo).
// AI rešitev pokažemo kot »preverjeno« samo, če jo izračun potrdi: rešitve vstavimo v enačbo,
// izraze primerjamo v naključnih točkah, odvode z numeričnim odvodom, nedoločene integrale z odvajanjem.
import { parse, compile, integrate } from "../graph/math.js";
import { prep, splitSystem, satisfies, equalNumerically } from "./solvecore.js";

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

/**
 * ai: { kind, variable, problem, solutions: [..], value, steps … }
 * Vrne { verified: bool, reason, missing: [x …] }
 */
export function verifyAi(problemText, ai) {
  const r = check(problemText, ai);
  return r.verified ? { ...r, reason: null } : r;
}

function check(problemText, ai) {
  const kind = ai?.kind;
  const v = /^[a-zA-Z]$/.test(ai?.variable || "") ? ai.variable : "x";
  try {
    if (kind === "system") {
      const parts = splitSystem(problemText) || String(problemText).split(/;|\n/).filter((s) => s.includes("="));
      for (const sol of ai.solutions || []) {
        const env = {};
        for (const m of String(sol).matchAll(/([a-zA-Z])\s*=\s*([^;,]+(?:,\d+)?)/g)) {
          const val = values(m[2])[0];
          if (val === undefined) return { verified: false, reason: "parse" };
          env[m[1]] = val;
        }
        if (!parts.length || parts.some((p) => satisfies(p, env) !== true)) return { verified: false, reason: "wrong" };
      }
      return { verified: (ai.solutions || []).length > 0, reason: (ai.solutions || []).length ? null : "empty" };
    }
    if (kind === "equation") {
      if (!isEquation(problemText)) return { verified: false, reason: "kind" };
      // »x = 2« ali »x_1 = 2« → »2«
      const sols = (ai.solutions || []).flatMap((s) => values(String(s).replace(/^\s*[a-zA-Z](?:_\{?\d+\}?)?\s*=(?!=)/, "")));
      if (!(ai.solutions || []).length) {
        // »ni rešitve«: preverimo, da numerično res ni ničle
        const r = scanRoots(problemText, v);
        return { verified: r.length === 0, reason: r.length ? "missing" : null, missing: r };
      }
      if (!sols.length) return { verified: false, reason: "parse" };
      for (const s of sols) if (satisfies(problemText, { [v]: s }) !== true) return { verified: false, reason: "wrong" };
      const periodic = (ai.solutions || []).some((s) => /\bk\b/.test(s));
      if (!periodic) {
        const missing = scanRoots(problemText, v).filter((r) => !sols.some((s) => Math.abs(s - r) < 1e-5 * Math.max(1, Math.abs(r))));
        if (missing.length) return { verified: false, reason: "missing", missing };
      }
      return { verified: true };
    }
    if (kind === "expression" || kind === "arith") {
      const a = parse(prep(problemText));
      const b = parse(prep(ai.value));
      return { verified: equalNumerically(a, b), reason: "wrong" };
    }
    if (kind === "derivative") {
      const f = fnOf(String(problemText).replace(/^\s*(d\/d[a-z]|f\(x\)\s*=)\s*/, ""));
      const g = fnOf(ai.value);
      if (!f || !g) return { verified: false, reason: "parse" };
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
