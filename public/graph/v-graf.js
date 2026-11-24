// »Pokaži na grafu« (j, 24. 11. 2026): rezultat znanstvenega kalkulatorja → vrstice grafičnega kalkulatorja, ki
// narišejo isto stvar. Določeni integral → f z orodjem »Ploščina pod krivuljo«, nedoločeni → f in F (C = 0),
// odvod → f z orodjem f′ (v točki: tangenta), enačba → obe strani in rešitve kot točke, neenačba → senčenje,
// sistem → obe krivulji in presečišča, limita → f okoli a z oznako (a, L), vsota → členi kot točke, funkcija → graf.
// Ne nadomesti modula: grafični kalkulator do zdaj ni znal prebrati rezultata (le besedilo »Nariši graf«,
// scisolve.js plotText, ki pobriše trenutni graf). Brez DOM (testi v test/v-graf.test.js).
//
// Vrstice so v zapisu 3 grafičnega kalkulatorja (model.js ZAPIS) v istem zapisu števil kot znanstveni kalkulator
// (decimalna vejica in »;« ali pika in »;«), zato pomenijo isto. Shranjene spremenljivke, Ans in uporabniške funkcije
// znanstvenega kalkulatorja so vstavljene (graf jih ne pozna), kot v znanstvenem kalkulatorju (DEG, RAD, GRA) pa
// je tudi kot: sin x v stopinjah je v grafu sin(x°), če graf računa v radianih.
import { analyze, limText } from "./scisolve.js";
import { compileLine, HIDDEN_VARS } from "./scicore.js";
import { parseCommand } from "./cas.js";
import { antiderivativeAst } from "./calculus.js";
import { substitute, inlineUfn, walk, freeVars } from "./math.js";
import { intersections } from "./model.js";
import { fitView } from "./okno.js";
import { chemSub } from "./molska.js";

const fin = Number.isFinite;
const MAX_TERMS = 60; // členov vsote kot točk
const TRIG_F = new Set(["sin", "cos", "tan", "cot", "sec", "csc", "tg", "ctg"]);
const TRIG_INV = new Set(["arcsin", "arccos", "arctan", "arccot", "asin", "acos", "atan", "acot", "arctg"]);
export const TRIG_TEXT = /(?:sin|cos|tan|cot|sec|csc|tg|ctg)(?!h)|°/;
const UNIT_RAD = { rad: 1, deg: Math.PI / 180, grad: Math.PI / 200 };
const PREC = { cmp: 0, "+": 1, "-": 1, neg: 1.8, "*": 2, "/": 2, "^": 4, fact: 5, deg: 5, pct: 5 };
const OPS = { "<=": "≤", ">=": "≥", "!=": "≠" };

// ---------- drevo → besedilo vrstice grafa ----------

/** Število v zapisu kalkulatorja (vejica ali pika), brez »e« (2e-7 bi graf bral kot 2·e − 7). */
export function numText(v, comma = true) {
  if (v === Infinity) return "∞";
  if (v === -Infinity) return "-∞";
  if (!fin(v)) return "0/0";
  let s = String(Number(v.toPrecision(15)));
  if (/e/.test(s)) {
    const [m, e] = s.split("e");
    s = `${m}·10^(${Number(e)})`;
  }
  return comma ? s.replace(".", ",") : s;
}

class NoText extends Error {}

/**
 * Drevo math.js → besedilo vrstice grafa (zapis 3). o: { comma, unit (enota kota znanstvenega kalkulatorja),
 * graphDeg (graf računa v stopinjah), used: { trig } }. Vrže NoText, če drevesa ne zna zapisati.
 */
export function toText(node, o) {
  const T = (n) => toText(n, o);
  const prec = (n) => (n.k === "grp" ? prec(n.a) : n.k === "num" ? (n.v < 0 ? 1.8 : 9) : PREC[n.k] ?? 9);
  const W = (n, p) => (prec(n) < p ? `(${T(n)})` : T(n));
  const sep = "; ";
  const n = node;
  if (!n) throw new NoText("empty");
  switch (n.k) {
    case "num":
      return n.raw ? (o.comma ? n.raw.replace(".", ",") : n.raw) : numText(n.v, o.comma);
    case "const":
      return { pi: "π", "π": "π", tau: "τ", "τ": "τ", e: "e", inf: "∞" }[n.name] ?? n.name;
    case "var":
      if (n.name === "G_deg") return "1°";
      if (n.name === "G_min") return "(1/60)°";
      if (n.name === "G_sec") return "(1/3600)°";
      if (HIDDEN_VARS.has(n.name)) throw new NoText("hidden");
      return n.name;
    case "grp": // oklepaje postavi prednost operacij (x^(2) → x^2)
      return T(n.a);
    case "neg":
      return `-${W(n.a, 2)}`;
    case "+": {
      // a + (−b) → a − b (izid CAS: x³ + (−2)x)
      const nb = negPart(n.b);
      if (nb) return `${T(n.a)} - ${W(nb, 1.9)}`;
      const ub = unwrap(n.b);
      const na = ub.k === "*" ? negPart(ub.a) : null;
      if (na) return `${T(n.a)} - ${T(isOne(na) ? ub.b : { ...ub, a: na })}`;
      return `${T(n.a)} + ${W(n.b, 1.5)}`;
    }
    case "-":
      return `${T(n.a)} - ${W(n.b, 1.9)}`;
    case "*": {
      // 30° (G_deg iz priprave znanstvenega kalkulatorja) ostane stopinja: ° pomeni stopinjo v obeh enotah grafa
      const deg = n.b?.k === "var" ? { G_deg: "", G_min: "/60", G_sec: "/3600" }[n.b.name] : undefined;
      if (deg !== undefined) return deg ? `(${T(n.a)}${deg})°` : `${W(n.a, 5)}°`;
      if (isOne(n.a)) return T(n.b); // 1x → x
      const na = negPart(n.a);
      if (na) return isOne(na) ? `-${W(n.b, 2)}` : `-${T({ ...n, a: na })}`;
      const a = W(n.a, 2);
      const b = W(n.b, 2.5);
      const ub = unwrap(n.b);
      const ua = unwrap(n.a);
      const tight = ua.k === "num" && !ua.raw && ua.v >= 0 && (ub.k === "var" || ub.k === "const" || ub.k === "call" || (ub.k === "^" && (ub.a.k === "var" || ub.a.k === "const")));
      return tight && !/^\d/.test(b) ? `${a}${b}` : `${a}·${b}`;
    }
    case "/":
      return `${W(n.a, 2)}/${W(n.b, 2.5)}`;
    case "^": {
      const base = unwrap(n.a).k === "num" && unwrap(n.a).v >= 0 ? T(n.a) : W(n.a, 4.5);
      const b = unwrap(n.b);
      const simple = (b.k === "num" && b.v >= 0 && Number.isInteger(b.v) && b.v < 1e15) || b.k === "var" || b.k === "const";
      return `${base}^${simple ? T(b) : `(${T(b)})`}`;
    }
    case "fact":
      return `${W(n.a, 5.5)}!`;
    case "deg":
      return `${W(n.a, 5.5)}°`;
    case "pct":
      return `${W(n.a, 5.5)} %`;
    case "call": {
      const args = n.args.map(T);
      if (n.f === "sqrt") return `√(${args[0]})`;
      if (n.f === "__ODVOD_V_TOCKI") throw new NoText("der");
      if (TRIG_F.has(n.f)) {
        o.used.trig = true;
        return `${n.f}(${angleIn(args[0], o)})`;
      }
      if (TRIG_INV.has(n.f)) {
        o.used.trig = true;
        return angleOut(`${n.f}(${args.join(sep)})`, o);
      }
      return `${n.f}(${args.join(sep)})`;
    }
    case "cmp":
      return n.terms.map((t, i) => (i ? ` ${OPS[n.ops[i - 1]] || n.ops[i - 1]} ` : "") + T(t)).join("");
    case "tuple":
      return `(${n.items.map(T).join(sep)})`;
    case "list":
      return `[${n.items.map(T).join(sep)}]`;
    case "range":
      return `${T(n.a)}...${T(n.b)}`;
    case "pw": {
      const parts = n.cases.map(([c, v]) => (v.k === "num" && v.v === 1 && !n.other && n.cases.every(([, w]) => w.k === "num" && w.v === 1) ? T(c) : `${T(c)}: ${T(v)}`));
      if (n.other) parts.push(T(n.other));
      return `{${parts.join(sep)}}`;
    }
    case "der":
      if (n.a?.k === "tuple") throw new NoText("der");
      return `d/d${n.v}(${T(n.a)})`;
    case "int":
      if (!n.lo) throw new NoText("int");
      return n.v === "x" ? `∫(${T(n.a)}${sep}${T(n.lo)}${sep}${T(n.hi)})` : `∫_(${T(n.lo)})^(${T(n.hi)}) (${T(n.a)}) d${n.v}`;
    case "sum":
      return `${n.f}(${T(n.a)}${sep}${n.v}${sep}${T(n.lo)}${sep}${T(n.hi)})`;
    default:
      throw new NoText(n.k);
  }
}

// kot v enoti znanstvenega kalkulatorja → argument kotne funkcije v enoti grafa
function angleIn(a, o) {
  if (o.unit === "rad") return o.graphDeg ? `(${a})·180/π` : a;
  if (o.unit === "deg") return o.graphDeg ? a : `(${a})°`; // ° je v grafu z radiani π/180
  return o.graphDeg ? `(${a})·0,9`.replace(",", o.comma ? "," : ".") : `(${a})·π/200`;
}
// izid arcsin … v enoti grafa → v enoti znanstvenega kalkulatorja
function angleOut(s, o) {
  if (o.unit === "rad") return o.graphDeg ? `(${s}·π/180)` : s;
  if (o.unit === "deg") return o.graphDeg ? s : `(${s}·180/π)`;
  return o.graphDeg ? `(${s}·10/9)` : `(${s}·200/π)`;
}

// ---------- priprava drevesa ----------

const unwrap = (n) => {
  while (n?.k === "grp") n = n.a;
  return n;
};

// shranjene spremenljivke, Ans in uporabniške funkcije znanstvenega kalkulatorja v drevo (graf jih ne pozna);
// spremenljivka v (t, n …) postane x
function selfContained(line, node, keep = ["x"], rename = null) {
  let ast = inlineUfn(node, line.ctx);
  const map = {};
  for (const k in line.scope) if (!keep.includes(k) && k !== rename && typeof line.scope[k] === "number" && !["G_deg", "G_min", "G_sec"].includes(k)) map[k] = { k: "num", v: line.scope[k] };
  ast = substitute(ast, map);
  if (rename && rename !== "x") {
    ast = substitute(ast, { [rename]: { k: "var", name: "x" } });
    walk(ast, (m) => {
      if (m.k === "der" && m.v === rename) m.v = "x";
    });
  }
  return ast;
}

const runner = (line, node, v = "x") => {
  let f;
  try {
    f = line.run(node);
  } catch {
    return () => NaN;
  }
  return (x) => {
    const s = Object.create(line.scope);
    s[v] = x;
    try {
      const y = f(s);
      return typeof y === "number" ? y : Array.isArray(y) && y.length === 1 ? y[0] : NaN;
    } catch {
      return NaN;
    }
  };
};
// negativno število ali −a: pozitivni del, sicer null
function negPart(n) {
  const u = unwrap(n);
  if (u?.k === "neg") return u.a;
  if (u?.k === "num" && u.v < 0 && !u.raw) return { k: "num", v: -u.v };
  return null;
}
const isOne = (n) => {
  const u = unwrap(n);
  return u?.k === "num" && u.v === 1 && !u.raw;
};
const isConst = (node, v) => ![...freeVars(node)].some((w) => w === v);
const isZero = (n) => {
  n = unwrap(n);
  return n?.k === "num" && n.v === 0;
};

// ---------- sistem: presečišča (Newton v dveh razsežnostih iz mreže začetkov) ----------

function solve2(F, G, box = 12) {
  const out = [];
  const N = 16;
  for (let i = 0; i <= N; i++)
    for (let j = 0; j <= N; j++) {
      let x = -box + (2 * box * i) / N;
      let y = -box + (2 * box * j) / N;
      for (let it = 0; it < 40; it++) {
        const f = F(x, y);
        const g = G(x, y);
        if (!fin(f) || !fin(g)) break;
        const h = 1e-7 * Math.max(1, Math.abs(x) + Math.abs(y));
        const fx = (F(x + h, y) - f) / h;
        const fy = (F(x, y + h) - f) / h;
        const gx = (G(x + h, y) - g) / h;
        const gy = (G(x, y + h) - g) / h;
        const det = fx * gy - fy * gx;
        if (!fin(det) || Math.abs(det) < 1e-14) break;
        const dx = (f * gy - fy * g) / det;
        const dy = (fx * g - f * gx) / det;
        x -= dx;
        y -= dy;
        if (Math.abs(dx) + Math.abs(dy) < 1e-13 * (1 + Math.abs(x) + Math.abs(y))) break;
      }
      const ok = fin(x) && fin(y) && Math.abs(F(x, y)) < 1e-9 * (1 + Math.abs(x) + Math.abs(y)) && Math.abs(G(x, y)) < 1e-9 * (1 + Math.abs(x) + Math.abs(y));
      if (ok && Math.abs(x) < 1e6 && Math.abs(y) < 1e6 && !out.some(([a, b]) => Math.abs(a - x) + Math.abs(b - y) < 1e-6 * (1 + Math.abs(x)))) out.push([Number(x.toPrecision(12)), Number(y.toPrecision(12))]);
    }
  return out.sort((p, q) => p[0] - q[0] || p[1] - q[1]).slice(0, 12);
}

// ---------- glavna funkcija ----------

/**
 * Načrt grafa za vrstico znanstvenega kalkulatorja.
 * @param {string} text vnos (kot v zgodovini)
 * @param {{vars?, funcs?, ans?, angle?:"deg"|"rad"|"grad", comma?:boolean}} env stanje znanstvenega kalkulatorja
 * @param {{texts?:string[], deg?:boolean, W?:number, H?:number, simple?:boolean}} g trenutni graf (besedila vrstic,
 *   enota kota), velikost platna; simple: osnovna šola (brez analize: integral, odvod, limita, vsota)
 * @returns {null | { kind, items: object[], view, deg?: boolean, note?: { key, vars } | null, message?: boolean }}
 *   items: vrstice grafa ({ type: "expr", text, tools?, style?, open?, label? }); deg: nova enota grafa (le, če jo
 *   je treba spremeniti); message: graf naj pokaže sporočilo kalkulatorja (divergenten integral, limita ne obstaja).
 */
export function graphPlan(text, env = {}, g = {}) {
  try {
    return plan(text, env, g);
  } catch (e) {
    if (e instanceof NoText) return null;
    throw e;
  }
}

function plan(text0, env0, g) {
  const comma = env0.comma !== false;
  let text = String(text0 ?? "").trim();
  if (!text) return null;
  // molska masa M(H2O): spremenljivka s številom
  const chem = chemSub(text);
  const vars = { ...(env0.vars || {}), ...(chem?.vars || {}) };
  if (chem) text = chem.text;
  const angle = ["deg", "rad", "grad"].includes(env0.angle) ? env0.angle : "rad";
  const env = { vars, funcs: env0.funcs || {}, ans: Number.isFinite(env0.ans) ? env0.ans : 0, deg: angle === "deg", grad: angle === "grad", comma };
  const raw = limText(text);
  // odvodi, integrali in ukazi CAS so vedno v radianih (scisolve.js analyze)
  const cmd = parseCommand(raw);
  const calculus = !!cmd || /d\/d|∫|'|′/.test(raw);
  const unit = calculus ? "rad" : angle;
  const texts = g.texts || [];
  const graphHasTrig = texts.some((s) => TRIG_TEXT.test(String(s)));
  // graf brez kotnih funkcij dobi enoto kalkulatorja (manj pretvorb v zapisu), drugače ostane njegova
  const graphDeg = graphHasTrig || unit === "grad" ? !!g.deg : unit === "deg";
  const o = { comma, unit, graphDeg, used: { trig: false } };
  const T = (n) => toText(n, o);
  const lineEnv = calculus ? { ...env, deg: false, grad: false } : env;
  const defined = new Set(texts.map((s) => /^\s*([A-Za-zα-ωΑ-Ω](?:_\w+)?)\s*\(/.exec(String(s))?.[1]).filter(Boolean));
  const free = (list) => list.find((n) => !defined.has(n)) || null;
  const r = analyze(text, env);
  const items = [];
  const fns = []; // za okno
  const points = [];
  let fixed = {};
  let note = null;
  let message = false;
  let kind = null;
  const fnItem = (body, extra = {}, names = ["f", "g", "h", "p", "q"]) => {
    const name = free(names);
    const t = T(body);
    return { type: "expr", text: name ? `${name}(x) = ${t}` : `y = ${t}`, ...extra };
  };
  const yItem = (body, extra = {}) => ({ type: "expr", text: `y = ${T(body)}`, ...extra });
  const ptsItem = (pts, extra = {}) => ({ type: "expr", text: pts.length === 1 ? `(${numText(pts[0][0], comma)}; ${numText(pts[0][1], comma)})` : `[${pts.map(([x, y]) => `(${numText(x, comma)}; ${numText(y, comma)})`).join("; ")}]`, ...extra });
  const finish = () => {
    if (!items.length) return null;
    let keepSquare = true;
    const view = g.W && g.H ? fitView(fns, { W: g.W, H: g.H, points, fixed }) : null;
    // kotne funkcije v stopinjah: os x v stotinah stopinj, os y po vrednostih (fitView bi os y raztegnil na 1 : 5)
    if (view && o.used.trig && graphDeg && !fin(fixed.ymin)) {
      const ys = [];
      for (const f of fns) for (let i = 0; i <= 400; i++) ys.push(f(view.xmin + ((view.xmax - view.xmin) * i) / 400));
      for (const [, y] of points) ys.push(y);
      const ok = ys.filter((y) => fin(y)).sort((p, q) => p - q);
      if (ok.length) {
        const lo = Math.min(0, ok[Math.floor(ok.length * 0.03)]);
        const hi = Math.max(0, ok[Math.ceil(ok.length * 0.97) - 1]);
        const pad = Math.max((hi - lo) * 0.15, 0.5);
        view.ymin = lo - pad;
        view.ymax = hi + pad;
        keepSquare = false;
      }
    }
    // prostor za plavajoče gumbe grafa (povečava, nastavitve) nad najvišjo točko
    if (view) view.ymax += (view.ymax - view.ymin) * 0.1;
    const out = { kind, items, view, note, message, square: keepSquare };
    if (o.used.trig && graphDeg !== !!g.deg) out.deg = graphDeg;
    return out;
  };
  const simpleBlock = () => g.simple && calculus;

  // ---- ukazi CAS: integriraj, limita, poenostavi … ----
  if (cmd) {
    if (simpleBlock()) return null;
    if (cmd.op === "solve") return graphPlan(cmd.inner, env0, g);
    let line;
    try {
      line = compileLine(cmd.inner, lineEnv);
    } catch {
      return null;
    }
    if (!line || line.ast.k === "cmp") return null;
    const limOne = cmd.op === "limit" && cmd.args.length === 1; // limita(f; a): spremenljivka x
    const vv = limOne ? "x" : ["integrate", "limit", "taylor"].includes(cmd.op) ? String(cmd.args?.[0] ?? "").trim() || "x" : null;
    const U = [...freeVars(line.rw(line.ast))].filter((w) => !HIDDEN_VARS.has(w) && !(w in vars));
    const fv = vv || (U.length === 1 ? U[0] : U.length === 0 ? "x" : null);
    if (!fv || U.some((w) => w !== fv)) return null;
    const f = selfContained(line, line.ast, [fv], fv);
    const ff = runner(line, line.ast, fv);
    if (cmd.op === "integrate") {
      kind = "antiderivative";
      const F = antiderivativeAst(line, line.ast, fv, 400);
      items.push(fnItem(f, {}, ["f", "g", "h", "p", "q"]));
      fns.push(ff);
      if (F) {
        const Fs = selfContained(line, F, [fv], fv);
        items.push(fnItem(Fs, {}, ["F", "G", "H", "P", "Q"]));
        fns.push(runner(line, F, fv));
      }
      return finish();
    }
    if (cmd.op === "limit") {
      kind = "limit";
      const pt = cmd.args.length === 1 ? cmd.args[0] : cmd.args[1];
      let a;
      try {
        const pl = compileLine(String(pt ?? ""), lineEnv);
        a = pl.run(pl.ast)(pl.scope);
      } catch {
        return null;
      }
      if (typeof a !== "number" || Number.isNaN(a)) return null;
      items.push(fnItem(f));
      fns.push(ff);
      const L = r && !r.error && r.kind === "cas" && fin(r.value) ? r.value : null;
      if (!fin(a)) {
        // x → ±∞: končno okno v smeri a, vodoravna črtkana premica y = L
        const s = a > 0 ? 1 : -1;
        fixed = s > 0 ? { xmin: -2, xmax: 30 } : { xmin: -30, xmax: 2 };
        if (L !== null) {
          items.push({ type: "expr", text: `y = ${numText(L, comma)}`, style: "dash" });
          fns.push(() => L);
          note = { key: s > 0 ? "gc.fromSci.limInf" : "gc.fromSci.limNegInf", vars: { L } };
        } else message = true;
        return finish();
      }
      const span = Math.max(2, Math.abs(a) * 0.5);
      fixed = { xmin: a - span * 2, xmax: a + span * 2 };
      if (L !== null) {
        const fa = ff(a);
        const hole = !fin(fa) || Math.abs(fa - L) > 1e-9 * Math.max(1, Math.abs(L));
        items.push({ ...ptsItem([[a, L]]), open: hole });
        points.push([a, L]);
        if (hole) note = { key: "gc.fromSci.limHole", vars: { a, L } };
      } else message = true; // limita ne obstaja ali je ni bilo mogoče izračunati: sporočilo kalkulatorja
      return finish();
    }
    // poenostavi, razvij, razstavi, taylor: ista funkcija kot vnos (luknje definicijskega območja ostanejo)
    if (fv !== "x" && U.length === 0) return null;
    kind = "function";
    items.push(yItem(f));
    fns.push(ff);
    return finish();
  }

  // ---- funkcija f(x) = … ----
  if (r?.kind === "func") {
    if (r.param !== "x" && r.param !== "t" && r.param !== "n") return null;
    const line = compileLine(r.body, lineEnv);
    kind = "function";
    const name = defined.has(r.name) ? null : r.name;
    const body = selfContained(line, line.ast, [r.param], r.param);
    items.push({ type: "expr", text: name ? `${name}(x) = ${T(body)}` : `y = ${T(body)}` });
    fns.push(runner(line, line.ast, r.param));
    return finish();
  }

  // ---- sistem enačb ----
  const parts = raw.split(/[;\n]/).length > 1 && r && (r.kind === "system" || (r.kind === "plot" && r.nonlinear)) ? splitParts(raw) : null;
  if (parts) {
    const lines = parts.map((p) => compileLine(p, env));
    const U = [...new Set(lines.flatMap((l) => [...freeVars(l.rw(l.ast))].filter((w) => !HIDDEN_VARS.has(w) && !(w in vars))))].sort();
    if (U.length !== 2 || U[0] !== "x" || U[1] !== "y" || lines.length !== 2) return null;
    kind = "system";
    for (const l of lines) items.push({ type: "expr", text: T(selfContained(l, l.ast, ["x", "y"])) });
    const fxy = lines.map((l) => {
      const fl = l.run({ k: "-", a: l.ast.terms[0], b: l.ast.terms[1] });
      return (x, y) => {
        const s = Object.create(l.scope);
        s.x = x;
        s.y = y;
        try {
          const v = fl(s);
          return typeof v === "number" ? v : NaN;
        } catch {
          return NaN;
        }
      };
    });
    let pts = [];
    if (r.kind === "system" && r.values) pts = [[r.values[0], r.values[1]]];
    else pts = solve2(fxy[0], fxy[1]);
    if (pts.length) {
      items.push(ptsItem(pts));
      points.push(...pts);
    } else note = { key: r.kind === "system" && r.many ? "sc.sysMany" : "sc.sysNone" };
    if (!points.length) fixed = { xmin: -10, xmax: 10, ymin: -7, ymax: 7 };
    else {
      const xs = points.map((p) => p[0]);
      const ys = points.map((p) => p[1]);
      const pad = Math.max(3, (Math.max(...xs) - Math.min(...xs)) * 0.4, (Math.max(...ys) - Math.min(...ys)) * 0.4);
      fixed = { xmin: Math.min(...xs) - pad, xmax: Math.max(...xs) + pad, ymin: Math.min(...ys) - pad, ymax: Math.max(...ys) + pad };
    }
    return finish();
  }

  // ---- drevo vrstice ----
  let line;
  try {
    line = compileLine(raw, lineEnv);
  } catch {
    return null;
  }
  if (!line) return null;
  const ast = unwrap(line.ast);
  const U = [...freeVars(line.rw(line.ast))].filter((w) => !HIDDEN_VARS.has(w) && !(w in vars));

  // enačba in neenačba z eno neznanko
  if (ast.k === "cmp" && U.length === 1 && r && ["solve", "ineq"].includes(r.kind)) {
    const v = U[0];
    const terms = ast.terms.map((t) => selfContained(line, t, [v], v));
    const tfns = ast.terms.map((t) => runner(line, t, v));
    const shown = terms.map((t, i) => ({ t, f: tfns[i], c: isConst(ast.terms[i], v) }));
    if (ast.terms.length === 2 && isZero(ast.terms[1])) shown[1].skip = true; // L = 0: le y = L (ničle)
    for (const s of shown) {
      if (s.skip) continue;
      items.push(yItem(s.t, s.c ? { style: "dash" } : {}));
      fns.push(s.f);
    }
    if (r.kind === "solve") {
      kind = "equation";
      const L = tfns[0];
      const pts = (r.roots || []).filter(fin).map((x) => [x, L(x)]).filter(([, y]) => fin(y));
      if (pts.length) {
        items.push(ptsItem(pts.slice(0, 12)));
        points.push(...pts.slice(0, 12));
        if (r.periodic) note = { key: "gc.fromSci.period" };
      } else if (r.all) note = { key: "gc.fromSci.all" };
      else note = { key: r.complex?.length ? "sc.noReal" : "gc.fromSci.noSol" };
    } else {
      kind = "inequality";
      // senčenje: neenačba sama (v grafu le x, zato navpični pasovi); »x < 3« le s senčenjem
      items.push({ type: "expr", text: T(selfContained(line, ast, [v], v)) });
      const ends = (r.intervals || []).flatMap((i) => [i.lo, i.hi]).filter(fin);
      for (const x of ends) points.push([x, tfns[0](x)].map((z) => (fin(z) ? z : 0)));
      if (!r.intervals?.length) note = { key: "gc.fromSci.noSolIneq" };
      if (r.periodic) note = { key: "gc.fromSci.period" };
    }
    return finish();
  }
  // enačba z x in y: krivulja
  if (ast.k === "cmp" && r?.kind === "plot") {
    if (U.length !== 2 || !U.includes("x") || !U.includes("y")) return null;
    kind = "curve";
    items.push({ type: "expr", text: T(selfContained(line, ast, ["x", "y"])) });
    fixed = { xmin: -10, xmax: 10, ymin: -7, ymax: 7 };
    return finish();
  }

  // odvod: d/dx(f) in d/dx(f; a)
  if (ast.k === "der") {
    if (simpleBlock()) return null;
    const v = ast.v;
    const atPoint = ast.a?.k === "tuple" && ast.a.items.length === 2;
    const fnode = atPoint ? ast.a.items[0] : ast.a;
    const others = [...freeVars(line.rw(fnode))].filter((w) => w !== v && !HIDDEN_VARS.has(w) && !(w in vars));
    if (others.length) return null;
    kind = atPoint ? "tangent" : "derivative";
    const f = selfContained(line, fnode, [v], v);
    const ff = runner(line, fnode, v);
    fns.push(ff);
    if (atPoint) {
      const pl = line.run(ast.a.items[1]);
      const a = pl(line.scope);
      if (!fin(a)) return null;
      items.push(fnItem(f, { tools: { tangent: a } }));
      points.push([a, ff(a)].map((z) => (fin(z) ? z : 0)));
      const span = Math.max(3, Math.abs(a) * 0.5);
      fixed = { xmin: a - span, xmax: a + span };
      if (!(r && !r.error && fin(r.value))) message = true; // odvod v točki ne obstaja (|x| pri 0)
    } else {
      items.push(fnItem(f, { tools: { deriv: true } }));
    }
    return finish();
  }

  // določeni integral
  if (ast.k === "int" && ast.lo) {
    if (simpleBlock()) return null;
    const v = ast.v;
    const others = [...freeVars(line.rw(ast.a))].filter((w) => w !== v && !HIDDEN_VARS.has(w) && !(w in vars));
    if (others.length) return null;
    kind = "integral";
    const a = line.run(ast.lo)(line.scope);
    const b = line.run(ast.hi)(line.scope);
    if (typeof a !== "number" || typeof b !== "number" || Number.isNaN(a) || Number.isNaN(b)) return null;
    const f = selfContained(line, ast.a, [v], v);
    const ff = runner(line, ast.a, v);
    fns.push(ff);
    const ok = r && !r.error && r.kind === "value" && fin(r.value);
    const tools = {};
    if (fin(a) && fin(b)) {
      if (ok) tools.area = [a, b];
      const span = Math.abs(b - a) || 1;
      fixed = { xmin: Math.min(a, b) - span * 0.3, xmax: Math.max(a, b) + span * 0.3 };
    } else {
      // neskončna meja: končno okno, osenčen le viden del; v opombi celoten integral iz kalkulatorja
      const lo = fin(a) ? a : fin(b) ? Math.min(b, 0) - cutLen(ff, b, -1) : -cutLen(ff, 0, -1);
      const hi = fin(b) ? b : fin(a) ? Math.max(a, 0) + cutLen(ff, a, 1) : cutLen(ff, 0, 1);
      if (ok) tools.area = [lo, hi];
      const span = hi - lo;
      fixed = { xmin: lo - span * 0.1, xmax: hi + span * 0.1 };
      if (ok) note = { key: "gc.fromSci.partArea", vars: { a: lo, b: hi, v: r.value, from: a, to: b } };
    }
    if (!ok) message = true; // divergira, ni definiran, ni izračunljiv: brez osenčene »vrednosti«
    items.push(fnItem(f, Object.keys(tools).length ? { tools } : {}));
    return finish();
  }

  // vsota ali produkt: členi kot točke (n; a_n)
  if (ast.k === "sum" && U.length === 0) {
    if (simpleBlock()) return null;
    const lo = line.run(ast.lo)(line.scope);
    const hi = line.run(ast.hi)(line.scope);
    if (!fin(lo) || Number.isNaN(hi) || hi < lo) return null;
    kind = "sum";
    const term = runner(line, ast.a, ast.v);
    const last = Math.min(fin(hi) ? hi : Infinity, lo + MAX_TERMS - 1);
    const pts = [];
    for (let k = Math.ceil(lo); k <= last; k++) {
      const y = term(k);
      if (fin(y)) pts.push([k, Number(y.toPrecision(12))]);
    }
    if (!pts.length) return null;
    items.push({ ...ptsItem(pts), label: pts.length <= 12 });
    points.push(...pts);
    const total = r && !r.error && fin(r.value) ? r.value : null;
    if (last < hi) note = { key: "gc.fromSci.sumFirst", vars: { k: pts.length } };
    else if (total !== null) note = { key: ast.f === "prod" ? "gc.fromSci.prod" : "gc.fromSci.sum", vars: { v: total } };
    return finish();
  }

  // izraz z x (ali eno drugo črko): funkcija
  if (U.length === 1 && r && ["expr", "deriv", "cas", "sym"].includes(r.kind) && ast.k !== "cmp") {
    if (g.simple && calculus) return null;
    const v = U[0];
    kind = "function";
    items.push(yItem(selfContained(line, line.ast, [v], v)));
    fns.push(runner(line, line.ast, v));
    return finish();
  }
  return null;
}

// dolžina dela [s, s ± L], kjer je f še opazna (|f| pod 1 % največje na začetku), za neskončno mejo
function cutLen(f, s, dir) {
  const vals = [];
  for (let L = 1; L <= 1024; L *= 2) vals.push([L, Math.abs(f(s + dir * L))]);
  const top = Math.max(...vals.map(([, y]) => (fin(y) ? y : 0)), Math.abs(f(s + dir * 0.01)) || 0);
  for (const [L, y] of vals) if (L >= 4 && fin(y) && y < top * 0.01) return L;
  return 10;
}

// sistem: deli na vrhnji ravni
function splitParts(raw) {
  const out = [];
  let depth = 0;
  let cur = "";
  for (const c of raw) {
    if ("([{".includes(c)) depth++;
    else if (")]}".includes(c)) depth = Math.max(0, depth - 1);
    if (depth === 0 && (c === ";" || c === "\n")) {
      if (cur.trim()) out.push(cur.trim());
      cur = "";
    } else cur += c;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** Ali ima vrstica zgodovine (vnos iz sci.js entryOf) smiseln graf? Hitro, brez računanja (za prikaz gumba). */
export function graphable(e, { simple = false } = {}) {
  const k = e?.kind || "value";
  const txt = String(e?.text ?? "");
  const calc = /∫|d\/d|lim|limit|integr|\bsum\b|\bprod\b|∑|∏|'/i.test(txt);
  if (simple && calc) return false;
  if (k === "value") return /∫|d\/d|\bsum\s*\(|\bprod\s*\(|∑|∏/.test(txt);
  if (k === "solve" || k === "ineq") return true;
  if (k === "system") return /x/.test(txt) && /y/.test(txt);
  if (k === "plot" || k === "deriv" || k === "func") return k !== "func" || ["x", "t", "n"].includes(e.param);
  if (k === "expr") return true;
  if (k === "cas") return ["integrate", "limit", "simplify", "expand", "factor"].includes(e.op) && !/^\s*\w+\s*\(\s*\[/.test(txt);
  return false;
}

export { intersections };
