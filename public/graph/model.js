// Grafični kalkulator – iz seznama vrstic (izrazi, tabele, opombe) zgradi model:
// kaj vsaka vrstica je (funkcija, krivulja, drsnik, točka …), prevedene funkcije za risanje
// in vrednosti spremenljivk. Brez DOM (testi v test/graph.test.js).
import { hasPolRec, vectorTuple } from "./vektor.js";
import { parse, compile, freeVars, toTex, normalize, simplify, diff, inlineUfn, MathError, BUILTINS, walk } from "./math.js";

export const RESERVED = new Set(["x", "y", "r", "θ"]);
const DEF_RE = /^\s*([A-Za-zα-ωΑ-Ω](?:_\w+)?)\s*\(\s*([A-Za-zθ](?:\s*,\s*[A-Za-zθ])*)\s*\)\s*=(?!=)/;

export const MODELS = ["lin", "quad", "cubic", "quart", "exp", "expe", "pow", "log", "inv", "logistic", "sin"];

let idSeq = 0;
export const newId = () => `i${Date.now().toString(36)}${(idSeq++).toString(36)}`;

/** Prazen graf. */
export function emptyState() {
  return {
    v: 1,
    items: [{ id: newId(), type: "expr", text: "", color: 0 }],
    view: { xmin: -10, xmax: 10, ymin: -7, ymax: 7 },
    settings: { grid: true, minor: true, axes: true, numbers: true, arrows: true, deg: false, piX: false, xLabel: "x", yLabel: "y", square: true },
  };
}

// privzeta območja parametrov
export const DEFAULT_DOMAIN = { param: [0, 2 * Math.PI], polar: [0, 2 * Math.PI] };

/** Drsnik: privzeti razpon glede na vrednost. */
export function sliderRange(v) {
  const a = Math.abs(v);
  if (a <= 10) return { min: -10, max: 10, step: 0.1 };
  const p = 10 ** Math.ceil(Math.log10(a));
  return { min: -p, max: p, step: p / 100 };
}

function definitionOf(text) {
  const m = DEF_RE.exec(normalize(text));
  if (!m) return null;
  const name = m[1];
  if (BUILTINS.has(name) || name === "e" || RESERVED.has(name)) return null;
  return { name, params: m[2].split(",").map((p) => p.trim()) };
}

const err = (code, info = {}) => ({ code, info });

/**
 * Zgradi model iz stanja grafa.
 * @returns {{ items: object[], scope: object, ctx: object }}
 */
export function buildModel(state, { comma = true } = {}) {
  const deg = !!state.settings?.deg;
  const items = state.items || [];
  const funcNames = new Set();
  for (const it of items) {
    if (it.type !== "expr") continue;
    const d = definitionOf(it.text);
    if (d) funcNames.add(d.name);
  }
  const scope = Object.create(null);
  const funcs = {};
  const ctx = { deg, funcs, global: scope };
  const texOpt = { comma };
  const out = items.map((it) => ({ id: it.id, type: it.type, src: it }));

  // 1. razčlenimo
  for (const o of out) {
    const it = o.src;
    if (it.type === "note") {
      o.kind = "note";
      continue;
    }
    if (it.type === "table") {
      o.kind = "table";
      continue;
    }
    const text = String(it.text || "");
    if (!text.trim()) {
      o.kind = "empty";
      continue;
    }
    try {
      o.ast = parse(text, { funcs: funcNames });
      o.tex = toTex(o.ast, texOpt);
    } catch (e) {
      o.kind = "error";
      o.error = e instanceof MathError ? err(e.code, e.info) : err("parse", { msg: e.message });
    }
  }

  // zaporedja (kot način SEQ na TI-84): u(n) = … s parametrom n ali rekurzivna u(n) = u(n − 1) + …;
  // začetni členi so vrstice u(1) = 2
  const seqNames = new Set();
  for (const o of out) {
    if (o.kind || !o.ast) continue;
    const d = definitionOf(o.src.text);
    if (!d || d.params.length !== 1 || o.ast.k !== "cmp" || o.ast.ops.length !== 1 || o.ast.ops[0] !== "=") continue;
    let self = false;
    walk(o.ast.terms[1], (n) => n.k === "ufn" && n.f === d.name && (self = true));
    if (self || d.params[0] === "n") seqNames.add(d.name);
  }

  // 2. definicije: drsniki, spremenljivke, funkcije, tabele
  const defined = new Map(); // ime → vrstica
  const defineName = (name, o) => {
    if (defined.has(name)) {
      o.kind = "error";
      o.error = err("twice", { name });
      return false;
    }
    defined.set(name, o);
    return true;
  };
  for (const o of out) {
    if (o.kind === "table") {
      const cols = o.src.cols || [];
      o.cols = cols.map((c) => ({ name: c.name, values: (c.values || []).map((v) => (v === "" || v == null ? NaN : Number(String(v).replace(",", ".").replace("−", "-")))) }));
      // tabela vrednosti funkcije (ref) stolpcev ne poimenuje: »n« zaporedja ni spremenljivka
      if (!o.src.ref) for (const c of o.cols) if (c.name && /^[A-Za-zα-ω](_\w+)?$/.test(c.name) && !RESERVED.has(c.name)) defineName(c.name, o) && (scope[c.name] = c.values);
      continue;
    }
    if (!o.ast) continue;
    const a = o.ast;
    // začetni člen zaporedja: u(1) = 2
    if (a.k === "cmp" && a.ops.length === 1 && a.ops[0] === "=" && a.terms[0].k === "ufn" && !a.terms[0].d && seqNames.has(a.terms[0].f) && a.terms[0].args.length === 1) {
      const arg = a.terms[0].args[0];
      const k = arg.k === "num" ? arg.v : arg.k === "neg" && arg.a.k === "num" ? -arg.a.v : NaN;
      if (Number.isInteger(k)) {
        o.kind = "seqinit";
        o.fname = a.terms[0].f;
        o.n = k;
        o.rhs = a.terms[1];
        continue;
      }
    }
    // f(x) = …
    const def = definitionOf(o.src.text);
    if (def && a.k === "cmp" && a.ops.length === 1 && a.ops[0] === "=") {
      const body = a.terms[1];
      if (defineName(def.name, o)) {
        o.kind = "func";
        o.fname = def.name;
        o.params = def.params;
        o.body = body;
        funcs[def.name] = { params: def.params, ast: body, body: null };
      }
      continue;
    }
    if (a.k === "cmp" && a.ops.length === 1 && a.ops[0] === "=" && a.terms[0].k === "var" && !RESERVED.has(a.terms[0].name)) {
      const name = a.terms[0].name;
      const rhs = a.terms[1];
      const fv = freeVars(rhs);
      if (fv.has("x") || fv.has("y")) {
        // a = x + 1 → to ni definicija, ampak enačba (npr. implicitna) – obravnavamo spodaj
      } else if (defineName(name, o)) {
        o.name = name;
        o.rhs = rhs;
        const lit = rhs.k === "num" ? rhs.v : rhs.k === "neg" && rhs.a.k === "num" ? -rhs.a.v : null;
        if (lit !== null) {
          o.kind = "slider";
          o.value = lit;
          scope[name] = lit;
        } else o.kind = rhs.k === "list" ? "list" : "define";
        continue;
      } else continue;
    }
  }

  // funkcije prevedemo, ko poznamo vse
  for (const name of Object.keys(funcs)) {
    try {
      funcs[name].body = compile(funcs[name].ast, ctx);
    } catch (e) {
      const o = out.find((x) => x.fname === name);
      o.kind = "error";
      o.error = err(e.code || "parse", e.info);
      delete funcs[name];
    }
  }

  // zaporedja: vrednost samo pri celih n od prvega člena naprej; rekurzivna računamo po vrsti od začetka
  const SEQ_MAX = 10000;
  for (const name of seqNames) {
    const F = funcs[name];
    if (!F?.body) continue;
    const raw = F.body;
    const p = F.params[0];
    const inits = new Map();
    for (const o of out) {
      if (o.kind !== "seqinit" || o.fname !== name) continue;
      if (inits.has(o.n)) {
        o.kind = "error";
        o.error = err("twice", { name: `${name}(${o.n})` });
        continue;
      }
      try {
        inits.set(o.n, compile(o.rhs, ctx));
      } catch (e) {
        o.kind = "error";
        o.error = err(e.code || "parse", e.info);
      }
    }
    let recursive = false;
    walk(F.ast, (n) => n.k === "ufn" && n.f === name && (recursive = true));
    const n0 = inits.size ? Math.min(...inits.keys()) : 1;
    const at = (k) => {
      if (inits.has(k)) return toNum(inits.get(k)(scope));
      const S = Object.create(scope);
      S[p] = k;
      return toNum(raw(S));
    };
    let memo = null; // med enim računom: memo[k − n0] = člen
    const value = (k) => {
      if (typeof k !== "number" || Math.abs(k - Math.round(k)) > 1e-9) return NaN;
      k = Math.round(k);
      if (k < n0 || k > n0 + SEQ_MAX) return NaN;
      if (!recursive) return at(k);
      if (memo && k - n0 < memo.length) return memo[k - n0];
      const outer = !memo;
      if (outer) memo = [];
      try {
        while (memo.length <= k - n0) memo.push(at(n0 + memo.length));
        return memo[k - n0];
      } finally {
        if (outer) memo = null;
      }
    };
    F.body = (S) => value(S[p]);
    F.seq = {
      n0,
      recursive,
      noStart: recursive && !inits.size,
      // členi od a do b (vsak step-ti), v enem računu
      range(a, b, step = 1) {
        const res = [];
        const outer = !memo;
        if (outer) memo = [];
        try {
          for (let k = Math.max(a, n0); k <= Math.min(b, n0 + SEQ_MAX); k += step) res.push([k, value(k)]);
        } finally {
          if (outer) memo = null;
        }
        return res;
      },
    };
  }

  // 3. izračunane spremenljivke (v vrstnem redu odvisnosti)
  const pending = out.filter((o) => o.kind === "define" || o.kind === "list");
  for (const o of pending) {
    try {
      o.fn = compile(o.rhs, ctx);
    } catch (e) {
      o.kind = "error";
      o.error = err(e.code || "parse", e.info);
    }
  }
  const unknownOf = (node, bound = []) => {
    const calls = new Set();
    const fv = freeVars(node, new Set(bound), new Set(), calls);
    return [...fv].filter((v) => !defined.has(v) && !bound.includes(v));
  };
  for (let round = 0; round <= pending.length; round++) {
    let changed = false;
    for (const o of pending) {
      if (o.kind === "error" || o.done) continue;
      const deps = [...freeVars(o.rhs)];
      if (deps.includes(o.name)) {
        o.kind = "error";
        o.error = err("cycle", { name: o.name });
        continue;
      }
      if (deps.every((d) => !defined.has(d) || defined.get(d).kind === "slider" || defined.get(d).kind === "table" || defined.get(d).done || defined.get(d).kind === "func")) {
        try {
          scope[o.name] = o.fn(scope);
        } catch {
          scope[o.name] = NaN;
        }
        o.value = scope[o.name];
        o.done = true;
        changed = true;
      }
    }
    if (!changed) break;
  }
  for (const o of pending) {
    if (o.kind !== "error" && !o.done) {
      const missing = unknownOf(o.rhs);
      o.kind = "error";
      o.error = missing.length ? err("missing", { names: missing }) : err("cycle", { name: o.name });
      o.missing = missing;
    }
  }

  // 4. vse ostalo: kaj narisati
  for (const o of out) {
    if (!o.ast || o.kind) {
      if (o.kind === "func") classifyFunc(o);
      if (o.kind === "seqinit") {
        const miss = bodyMissing(o.rhs, []);
        if (miss.length) fail(o, miss);
      }
      continue;
    }
    try {
      classify(o);
    } catch (e) {
      o.kind = "error";
      o.error = err(e.code || "parse", e.info || { msg: e.message });
    }
  }

  function bodyMissing(node, allowed) {
    const m = unknownOf(node, allowed).filter((v) => !RESERVED.has(v) || !allowed.includes(v));
    return m;
  }

  function fail(o, missing) {
    o.kind = "error";
    o.missing = missing;
    o.error = err("missing", { names: missing });
  }

  function classifyFunc(o) {
    const miss = bodyMissing(o.body, o.params);
    if (miss.length) return fail(o, miss);
    const seq = funcs[o.fname]?.seq;
    if (seq) {
      if (seq.noStart) {
        o.kind = "error";
        o.error = err("seqStart", { name: o.fname });
        return;
      }
      const f = funcs[o.fname].body;
      const p = o.params[0];
      o.plot = "seq";
      o.seq = seq;
      o.varName = p;
      o.fn = (x) => f({ [p]: x });
      return;
    }
    if (o.params.length === 1) {
      const p = o.params[0];
      const f = funcs[o.fname].body;
      const S = Object.create(scope);
      o.plot = "y";
      o.fn = (x) => ((S[p] = x), f(S));
      o.ast2 = o.body;
      o.varName = p;
    } else o.plot = null;
  }

  function mk(node, vars) {
    const f = compile(node, ctx);
    const S = Object.create(scope);
    if (vars.length === 1) {
      const [v] = vars;
      return (a) => ((S[v] = a), f(S));
    }
    const [v1, v2] = vars;
    return (a, b) => ((S[v1] = a), (S[v2] = b), f(S));
  }

  function classify(o) {
    let a = o.ast;
    // Rec(r; θ), tudi Rec(…) + Rec(…): točka (x; y); |Rec(…) − Rec(…)|, Rec·Rec: število (public/graph/vektor.js)
    if (hasPolRec(a)) a = vectorTuple(a) || a;
    const fv = freeVars(a);
    const has = (v) => fv.has(v);
    const check = (node, allowed) => {
      const miss = bodyMissing(node, allowed);
      if (miss.length) {
        fail(o, miss);
        return false;
      }
      return true;
    };
    // točke in parametrične krivulje
    const tupleOf = (n) => (n.k === "tuple" ? n : n.k === "grp" && n.a.k === "tuple" ? n.a : null);
    const tup = tupleOf(a);
    if (tup || (a.k === "list" && a.items.length && a.items.every((x) => tupleOf(x)))) {
      const tuples = tup ? [tup] : a.items.map(tupleOf);
      if (tuples.some((t) => t.items.length !== 2)) throw new MathError("tuple2");
      if (has("t") && tup) {
        if (!check(a, ["t"])) return;
        o.kind = "param";
        o.fx = mk(tup.items[0], ["t"]);
        o.fy = mk(tup.items[1], ["t"]);
        o.domain = o.src.domain || DEFAULT_DOMAIN.param;
        return;
      }
      if (!check(a, [])) return;
      o.kind = "points";
      o.pts = tuples.map((t) => ({ fx: compile(t.items[0], ctx), fy: compile(t.items[1], ctx), ast: t }));
      // vlečljiva točka: (a, b) z drsnikoma ali (2, 3) s števili
      if (tup) {
        const role = (n) => (n.k === "var" && defined.get(n.name)?.kind === "slider" ? { slider: n.name } : n.k === "num" || (n.k === "neg" && n.a.k === "num") ? { lit: true } : null);
        const rx = role(tup.items[0]);
        const ry = role(tup.items[1]);
        if (rx || ry) o.drag = { x: rx, y: ry };
      }
      o.evalPoints = () => {
        const res = [];
        for (const p of o.pts) {
          const x = p.fx(scope);
          const y = p.fy(scope);
          if (Array.isArray(x) || Array.isArray(y)) {
            const n = Math.min(Array.isArray(x) ? x.length : Infinity, Array.isArray(y) ? y.length : Infinity);
            for (let i = 0; i < n; i++) res.push([Array.isArray(x) ? x[i] : x, Array.isArray(y) ? y[i] : y]);
          } else res.push([x, y]);
        }
        return res;
      };
      return;
    }
    if (a.k === "cmp") {
      const [l, r] = a.terms;
      const op = a.ops[0];
      const isV = (n, name) => n.k === "var" && n.name === name;
      if (a.ops.length === 1) {
        const lf = freeVars(l);
        const rf = freeVars(r);
        // y = f(x) / y > f(x)
        for (const [yv, xv, kind] of [
          ["y", "x", "y"],
          ["x", "y", "x"],
        ]) {
          let rhs = null;
          let opn = op;
          if (isV(l, yv) && !rf.has(yv)) rhs = r;
          else if (isV(r, yv) && !lf.has(yv)) {
            rhs = l;
            opn = { "<": ">", ">": "<", "<=": ">=", ">=": "<=", "=": "=" }[op];
          }
          if (rhs) {
            if (!check(rhs, [xv])) return;
            o.fn = mk(rhs, [xv]);
            o.ast2 = rhs;
            o.varName = xv;
            if (opn === "=") o.kind = kind;
            else {
              o.kind = `ineq-${kind}`;
              o.op = opn;
            }
            return;
          }
        }
        // polarna: r = f(θ)
        if (isV(l, "r") && !rf.has("r") && !rf.has("x") && !rf.has("y")) {
          if (!check(r, ["θ"])) return;
          o.fn = mk(r, ["θ"]);
          o.ast2 = r;
          o.varName = "θ";
          o.domain = o.src.domain || DEFAULT_DOMAIN.polar;
          if (op === "=") o.kind = "polar";
          else {
            o.kind = "region";
            o.cond = polarCond(r, op);
          }
          return;
        }
      }
      // implicitna krivulja ali območje
      if (!has("x") && !has("y") && !has("r") && !has("θ")) {
        if (!check(a, [])) return;
        o.kind = "value";
        o.value = compile(a, ctx)(scope);
        return;
      }
      if (!check(a, ["x", "y", "r", "θ"])) return;
      const pol = has("r") || has("θ");
      const wrapPolar = (node) => {
        const f = compile(node, ctx);
        const S = Object.create(scope);
        return pol ? (x, y) => ((S.x = x), (S.y = y), (S.r = Math.hypot(x, y)), (S["θ"] = Math.atan2(y, x)), f(S)) : (x, y) => ((S.x = x), (S.y = y), f(S));
      };
      if (a.ops.length === 1 && op === "=") {
        o.kind = "implicit";
        o.F = wrapPolar({ k: "-", a: l, b: r });
        return;
      }
      o.kind = "region";
      o.cond = wrapPolar(a);
      // meja območja za risanje roba (pri eni neenačbi)
      if (a.ops.length === 1) {
        o.F = wrapPolar({ k: "-", a: l, b: r });
        o.strict = op === "<" || op === ">";
      }
      return;
    }
    // izraz brez enačaja
    if (has("y") && !has("x")) {
      throw new MathError("onlyY");
    }
    if (has("x") || (has("y") && has("x"))) {
      if (has("y")) {
        // npr. x^2 + y^2 – brez enačbe ni jasno, kaj narisati
        throw new MathError("needEq");
      }
      if (!check(a, ["x"])) return;
      o.kind = "y";
      o.fn = mk(a, ["x"]);
      o.ast2 = a;
      o.varName = "x";
      return;
    }
    if (!check(a, [])) return;
    o.kind = "value";
    o.value = compile(a, ctx)(scope);
  }

  function polarCond(r, op) {
    const f = compile(r, ctx);
    const S = Object.create(scope);
    const cmp = { "<": (a, b) => a < b, ">": (a, b) => a > b, "<=": (a, b) => a <= b, ">=": (a, b) => a >= b }[op];
    return (x, y) => {
      const th = Math.atan2(y, x);
      const rr = Math.hypot(x, y);
      // preverimo θ in θ + 2π (več obratov)
      for (const t of [th, th + 2 * Math.PI, th - 2 * Math.PI]) {
        S["θ"] = t;
        if (cmp(rr, f(S))) return true;
      }
      return false;
    };
  }

  // 5. tabele: točke in regresija
  for (const o of out) {
    if (o.kind !== "table") continue;
    const it = o.src;
    const [cx, ...cys] = o.cols;
    if (it.ref) {
      // tabela vrednosti funkcije iz druge vrstice
      const src = out.find((x) => x.id === it.ref);
      if (src?.fn && (src.kind === "y" || src.plot === "y" || src.plot === "seq")) {
        o.refFn = src.fn;
        const ys = cx.values.map((x) => (Number.isFinite(x) ? toNum(src.fn(x)) : NaN));
        if (cys[0]) cys[0].values = ys;
        else cys.push({ name: "y", values: ys });
        o.cols = [cx, ...cys];
      }
    }
    // [x, y, vrstica] – vrstica za vlečenje točke v tabeli
    o.series = cys.map((c) => cx.values.map((x, i) => [x, c.values[i], i]).filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y)));
    if (it.reg && MODELS.includes(it.reg) && o.series[0]?.length) {
      const pts = o.series[0];
      o.fit = regression(
        pts.map((p) => p[0]),
        pts.map((p) => p[1]),
        it.reg,
      );
      if (o.fit) o.fit.tex = fitTex(o.fit, comma);
    }
  }

  return { items: out, scope, ctx };
}

export const toNum = (v) => (Array.isArray(v) ? v[0] : typeof v === "boolean" ? (v ? 1 : NaN) : v);

/** Odvod vrstice (za prikaz f′ in tangento). Vrne { fn, tex } ali null. */
export function derivativeOf(o, model, { comma = true } = {}) {
  if (!o.ast2) return null;
  const v = o.varName || "x";
  const ctx = model.ctx;
  try {
    const body = simplify(diff(inlineUfn(o.ast2, ctx), v, ctx));
    const f = compile(body, ctx);
    const S = Object.create(model.scope);
    return { fn: (x) => ((S[v] = x), f(S)), tex: toTex(body, { comma }), ast: body };
  } catch {
    const fn = o.fn;
    return { fn: (x) => numDeriv(fn, x), tex: null };
  }
}

export function numDeriv(fn, x) {
  const h = 1e-5 * Math.max(1, Math.abs(x));
  return (toNum(fn(x + h)) - toNum(fn(x - h))) / (2 * h);
}

// ---------- ničle, ekstremi, presečišča ----------

function bisect(f, a, b, fa, iters = 60) {
  for (let i = 0; i < iters; i++) {
    const m = (a + b) / 2;
    const fm = f(m);
    if (!Number.isFinite(fm)) return null;
    if (fm === 0) return m;
    if (fa < 0 === fm < 0) {
      a = m;
      fa = fm;
    } else b = m;
  }
  return (a + b) / 2;
}

function golden(f, a, b, sign) {
  // sign = 1 → maksimum, −1 → minimum
  const g = (Math.sqrt(5) - 1) / 2;
  let c = b - g * (b - a);
  let d = a + g * (b - a);
  let fc = sign * f(c);
  let fd = sign * f(d);
  for (let i = 0; i < 80; i++) {
    if (fc > fd) {
      b = d;
      d = c;
      fd = fc;
      c = b - g * (b - a);
      fc = sign * f(c);
    } else {
      a = c;
      c = d;
      fc = fd;
      d = a + g * (b - a);
      fd = sign * f(d);
    }
  }
  return (a + b) / 2;
}

/**
 * Posebne točke funkcije y = f(x) na [a, b]: ničle, ekstremi in začetna vrednost.
 * @returns {{x:number,y:number,type:"root"|"max"|"min"|"yint"}[]}
 */
export function specialPoints(fn, a, b, n = 600) {
  const f = (x) => toNum(fn(x));
  const out = [];
  const h = (b - a) / n;
  const xs = [];
  const ys = [];
  for (let i = 0; i <= n; i++) {
    const x = a + i * h;
    xs.push(x);
    ys.push(f(x));
  }
  const span = (() => {
    const fin = ys.filter(Number.isFinite);
    if (!fin.length) return 1;
    return Math.max(1e-9, Math.max(...fin) - Math.min(...fin));
  })();
  const tol = (b - a) * 1e-9;
  const snap = (v) => (Math.abs(v) < (b - a) * 1e-7 ? 0 : v);
  const add = (p) => {
    if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) return;
    p.x = snap(p.x);
    if (Math.abs(p.y) < span * 1e-9) p.y = 0;
    if (out.some((q) => Math.abs(q.x - p.x) < Math.max(tol, h * 0.25) && q.type === p.type)) return;
    out.push(p);
  };
  for (let i = 0; i < n; i++) {
    const y0 = ys[i];
    const y1 = ys[i + 1];
    if (!Number.isFinite(y0) || !Number.isFinite(y1)) continue;
    if (y0 === 0) add({ x: xs[i], y: 0, type: "root" });
    else if (y0 < 0 !== y1 < 0 && y1 !== 0) {
      // skok čez asimptoto (npr. 1/x) ni ničla
      const r = bisect(f, xs[i], xs[i + 1], y0);
      // pri polu (npr. tan x) bisekcija konča pri velikih vrednostih
      if (r !== null && Math.abs(f(r)) < 1e-6 * (1 + Math.min(Math.abs(y0), Math.abs(y1)))) add({ x: r, y: 0, type: "root" });
    }
  }
  if (Number.isFinite(ys[n]) && ys[n] === 0) add({ x: xs[n], y: 0, type: "root" });
  for (let i = 1; i < n; i++) {
    const [y0, y1, y2] = [ys[i - 1], ys[i], ys[i + 1]];
    if (![y0, y1, y2].every(Number.isFinite)) continue;
    const isMax = y1 >= y0 && y1 >= y2 && (y1 > y0 || y1 > y2);
    const isMin = y1 <= y0 && y1 <= y2 && (y1 < y0 || y1 < y2);
    if (!isMax && !isMin) continue;
    // ostri ekstremi in skoki: preverimo, da je funkcija tu zvezna
    if (Math.abs(y2 - y0) > span * 0.5) continue;
    const x = golden(f, xs[i - 1], xs[i + 1], isMax ? 1 : -1);
    const y = f(x);
    if (!Number.isFinite(y)) continue;
    // pol (npr. tan x): iskanje zbeži proti neskončnosti
    if (Math.abs(y - y1) > 2 * Math.max(Math.abs(y1 - y0), Math.abs(y1 - y2)) + span * 1e-9) continue;
    // konstantna funkcija nima ekstremov
    if (Math.abs(y - y0) < span * 1e-12 && Math.abs(y - y2) < span * 1e-12) continue;
    add({ x, y, type: isMax ? "max" : "min" });
    // dotik osi x (npr. x² pri 0): je tudi ničla
    if (Math.abs(y) < span * 1e-7) add({ x, y: 0, type: "root" });
  }
  if (a <= 0 && b >= 0) {
    const y = f(0);
    if (Number.isFinite(y)) add({ x: 0, y, type: "yint" });
  }
  return out.sort((p, q) => p.x - q.x);
}

/** Presečišča dveh funkcij y = f(x), y = g(x) na [a, b]. */
export function intersections(f, g, a, b, n = 600) {
  const d = (x) => toNum(f(x)) - toNum(g(x));
  const out = [];
  const h = (b - a) / n;
  let x0 = a;
  let d0 = d(a);
  for (let i = 1; i <= n; i++) {
    const x1 = a + i * h;
    const d1 = d(x1);
    if (Number.isFinite(d0) && Number.isFinite(d1)) {
      if (d0 === 0) out.push(x0);
      else if (d0 < 0 !== d1 < 0 && d1 !== 0) {
        const r = bisect(d, x0, x1, d0);
        if (r !== null && Math.abs(d(r)) < 1e-6 * (1 + Math.abs(toNum(f(r))))) out.push(r);
      }
    }
    x0 = x1;
    d0 = d1;
  }
  return out.filter((x, i) => i === 0 || x - out[i - 1] > h / 4).map((x) => ({ x, y: toNum(f(x)), type: "int" }));
}

// ---------- regresija ----------

function solve(A, b) {
  const n = b.length;
  const M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) < 1e-12) return null;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r][c] / M[c][c];
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  return M.map((r, i) => r[n] / r[i]);
}

function polyfit(xs, ys, deg) {
  if (xs.length <= deg) return null;
  const A = [];
  const b = [];
  for (let i = 0; i <= deg; i++) {
    A.push([]);
    for (let j = 0; j <= deg; j++) A[i].push(xs.reduce((s, x) => s + x ** (i + j), 0));
    b.push(xs.reduce((s, x, k) => s + ys[k] * x ** i, 0));
  }
  return solve(A, b); // [c0, c1, …]
}

/** Levenberg–Marquardt: najboljši parametri za y ≈ f(p, x), začetek p0. */
function levMar(f, p0, xs, ys) {
  let p = p0.slice();
  const sse = (q) => xs.reduce((s, x, i) => s + (ys[i] - f(q, x)) ** 2, 0);
  let cur = sse(p);
  let lam = 1e-3;
  for (let it = 0; it < 200; it++) {
    const n = p.length;
    const J = xs.map((x) =>
      p.map((v, k) => {
        const h = 1e-7 * Math.max(1, Math.abs(v));
        const q = p.slice();
        q[k] += h;
        return (f(q, x) - f(p, x)) / h;
      }),
    );
    const res = xs.map((x, i) => ys[i] - f(p, x));
    const A = Array.from({ length: n }, (_, a) => Array.from({ length: n }, (_, b) => J.reduce((s, r) => s + r[a] * r[b], 0)));
    const g = Array.from({ length: n }, (_, a) => J.reduce((s, r, i) => s + r[a] * res[i], 0));
    let moved = false;
    for (let tries = 0; tries < 12; tries++) {
      const d = solve(A.map((r, a) => r.map((v, b) => (a === b ? v * (1 + lam) + 1e-12 : v))), g);
      if (d) {
        const q = p.map((v, k) => v + d[k]);
        const e = sse(q);
        if (Number.isFinite(e) && e <= cur) {
          const done = cur - e <= 1e-16 * (1 + cur);
          p = q;
          cur = e;
          lam = Math.max(lam / 5, 1e-12);
          moved = !done;
          break;
        }
      }
      lam *= 5;
    }
    if (!moved) break;
  }
  return p;
}

/**
 * Regresija po metodi najmanjših kvadratov.
 * model: lin (y = ax + b), quad, cubic, quart, exp (y = a·bˣ), expe (y = a·e^(bx)), pow (y = a·xᵇ), log (y = a + b ln x),
 * inv (y = a + b/x),
 * logistic (y = c/(1 + a·e^(−bx)), p = [a, b, c]), sin (y = a·sin(bx + c) + d, p = [a, b, c, d]) – kot TI-84
 * @returns {{ model, p: number[], fn: (x)=>number, r2: number } | null}
 */
export function regression(xs, ys, model) {
  let fn;
  let p;
  let xm; // logistična: x prevoja
  if (model === "lin" || model === "quad" || model === "cubic" || model === "quart") {
    const deg = { lin: 1, quad: 2, cubic: 3, quart: 4 }[model];
    const c = polyfit(xs, ys, deg);
    if (!c) return null;
    p = c.slice().reverse(); // od najvišje potence
    fn = (x) => c.reduce((s, ci, i) => s + ci * x ** i, 0);
  } else if (model === "exp") {
    const ok = xs.map((x, i) => [x, ys[i]]).filter(([, y]) => y > 0);
    const c = polyfit(
      ok.map((q) => q[0]),
      ok.map((q) => Math.log(q[1])),
      1,
    );
    if (!c) return null;
    p = [Math.exp(c[0]), Math.exp(c[1])];
    fn = (x) => p[0] * p[1] ** x;
  } else if (model === "expe") {
    // y = a·e^(bx) (Casio »e-exponentna«), prek ln y
    const ok = xs.map((x, i) => [x, ys[i]]).filter(([, y]) => y > 0);
    const c = polyfit(
      ok.map((q) => q[0]),
      ok.map((q) => Math.log(q[1])),
      1,
    );
    if (!c) return null;
    p = [Math.exp(c[0]), c[1]];
    fn = (x) => p[0] * Math.exp(p[1] * x);
  } else if (model === "inv") {
    // y = a + b/x (Casio »obratna«)
    const ok = xs.map((x, i) => [x, ys[i]]).filter(([x]) => x !== 0);
    const c = polyfit(
      ok.map((q) => 1 / q[0]),
      ok.map((q) => q[1]),
      1,
    );
    if (!c) return null;
    p = [c[0], c[1]];
    fn = (x) => p[0] + p[1] / x;
  } else if (model === "pow") {
    const ok = xs.map((x, i) => [x, ys[i]]).filter(([x, y]) => x > 0 && y > 0);
    const c = polyfit(
      ok.map((q) => Math.log(q[0])),
      ok.map((q) => Math.log(q[1])),
      1,
    );
    if (!c) return null;
    p = [Math.exp(c[0]), c[1]];
    fn = (x) => p[0] * x ** p[1];
  } else if (model === "log") {
    const ok = xs.map((x, i) => [x, ys[i]]).filter(([x]) => x > 0);
    const c = polyfit(
      ok.map((q) => Math.log(q[0])),
      ok.map((q) => q[1]),
      1,
    );
    if (!c) return null;
    p = [c[0], c[1]];
    fn = (x) => p[0] + p[1] * Math.log(x);
  } else if (model === "logistic") {
    const ok = xs.every(Number.isFinite) && ys.every(Number.isFinite) && xs.length >= 4;
    if (!ok) return null;
    // x premaknemo v sredino podatkov (npr. leta 2000–2014): sicer e^(−b·x) prekorači obseg števil
    const x0 = xs.reduce((s, x) => s + x, 0) / xs.length;
    const ts = xs.map((x) => x - x0);
    const top = Math.max(...ys);
    const span = Math.max(1e-9, top - Math.min(...ys));
    let best = null;
    for (const k of [0.02, 0.1, 0.3, 0.6, 1, 2, 4, 8]) {
      const c = top + k * span;
      const pts = ts.map((x, i) => [x, ys[i]]).filter(([, y]) => y > 0 && y < c);
      const l = pts.length >= 2 ? polyfit(pts.map((q) => q[0]), pts.map((q) => Math.log(c / q[1] - 1)), 1) : null;
      if (!l) continue;
      const q = [Math.exp(l[0]), -l[1], c];
      const sse = ts.reduce((a, x, i) => a + (ys[i] - q[2] / (1 + q[0] * Math.exp(-q[1] * x))) ** 2, 0);
      if (Number.isFinite(sse) && (!best || sse < best.sse)) best = { q, sse };
    }
    if (!best) return null;
    const f = (q, x) => q[2] / (1 + q[0] * Math.exp(-q[1] * x));
    const q = levMar(f, best.q, ts, ys);
    p = [q[0] * Math.exp(q[1] * x0), q[1], q[2]]; // a v izvirnem x (lahko zelo velik ali majhen)
    fn = (x) => f(q, x - x0);
    xm = x0 + Math.log(q[0]) / q[1]; // prevoj: y = c/2
  } else if (model === "sin") {
    if (xs.length < 4 || !xs.every(Number.isFinite) || !ys.every(Number.isFinite)) return null;
    const lo = Math.min(...xs);
    const hi = Math.max(...xs);
    if (!(hi > lo)) return null;
    const sorted = [...xs].sort((a, b) => a - b);
    let dmin = Infinity;
    for (let i = 1; i < sorted.length; i++) if (sorted[i] > sorted[i - 1]) dmin = Math.min(dmin, sorted[i] - sorted[i - 1]);
    // za vsako frekvenco linearna prilagoditev (sin, cos, 1); izberemo najboljšo
    let best = null;
    const bMax = Math.PI / dmin;
    for (let j = 1; j <= 600; j++) {
      const b = (bMax * j) / 600;
      const cs = [(x) => Math.sin(b * x), (x) => Math.cos(b * x), () => 1];
      const A = cs.map((u) => cs.map((v) => xs.reduce((s, x) => s + u(x) * v(x), 0)));
      const r = cs.map((u) => xs.reduce((s, x, i) => s + u(x) * ys[i], 0));
      const c = solve(A, r);
      if (!c) continue;
      const sse = xs.reduce((s, x, i) => s + (ys[i] - c[0] * Math.sin(b * x) - c[1] * Math.cos(b * x) - c[2]) ** 2, 0);
      if (!best || sse < best.sse) best = { b, c, sse };
    }
    if (!best) return null;
    const f = (q, x) => q[0] * Math.sin(q[1] * x + q[2]) + q[3];
    const q0 = [Math.hypot(best.c[0], best.c[1]), best.b, Math.atan2(best.c[1], best.c[0]), best.c[2]];
    p = levMar(f, q0, xs, ys);
    if (p[0] < 0) p = [-p[0], p[1], p[2] + Math.PI, p[3]];
    p[2] = ((((p[2] + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
    fn = (x) => f(p, x);
  } else return null;
  const m = ys.reduce((s, y) => s + y, 0) / ys.length;
  const ssTot = ys.reduce((s, y) => s + (y - m) ** 2, 0);
  const ssRes = xs.reduce((s, x, i) => s + (ys[i] - fn(x)) ** 2, 0);
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 1;
  return xm === undefined ? { model, p, fn, r2 } : { model, p, fn, r2, xm };
}

/**
 * Obratna napoved (Casio x̂): vrednosti x, pri katerih je model enak y. Seznam (prazen, če rešitve ni);
 * null za modele brez ene same zaprte rešitve (kubična, kvartična, sinusna).
 */
export function regressionX(fit, y) {
  const p = fit.p;
  const ok = (v) => (Number.isFinite(v) ? [v] : []);
  switch (fit.model) {
    case "lin":
      return p[0] === 0 ? [] : [(y - p[1]) / p[0]];
    case "quad": {
      const [a, b, c] = p;
      if (a === 0) return b === 0 ? [] : [(y - c) / b];
      const D = b * b - 4 * a * (c - y);
      if (D < 0) return [];
      const r = [(-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)].sort((u, v) => u - v);
      return D === 0 ? [r[0]] : r;
    }
    case "exp":
      return ok(Math.log(y / p[0]) / Math.log(p[1]));
    case "expe":
      return ok(Math.log(y / p[0]) / p[1]);
    case "pow":
      return ok((y / p[0]) ** (1 / p[1]));
    case "log":
      return ok(Math.exp((y - p[0]) / p[1]));
    case "inv":
      return ok(p[1] / (y - p[0]));
    case "logistic":
      return Number.isFinite(fit.xm) ? ok(fit.xm - Math.log(p[2] / y - 1) / p[1]) : ok(-Math.log((p[2] / y - 1) / p[0]) / p[1]);
    default: // tudi sinusna: rešitev je neskončno (ena na periodo), zato je ne ponujamo
      return null;
  }
}

/** Zapis modela v TeX (enako kot v načinu graf). */
export const regressionTex = (fit, comma = true) => fitTex(fit, comma);

const r4 = (v) => Number(v.toPrecision(4));
function fitTex(fit, comma) {
  const n = (v) => {
    // 7.282e-287 → 7,282·10^{−287} (ne »e-287«, kar bi se bralo kot e na potenco)
    const [m, e] = String(r4(v)).split("e");
    const s = e === undefined ? m : `${m}\\cdot 10^{${Number(e)}}`;
    return comma ? s.replace(".", "{,}") : s;
  };
  const term = (c, pow, first) => {
    if (r4(c) === 0) return "";
    const sign = c < 0 ? "-" : first ? "" : "+";
    const abs = Math.abs(c);
    const coef = pow && r4(abs) === 1 ? "" : n(abs);
    const x = pow === 0 ? "" : pow === 1 ? "x" : `x^{${pow}}`;
    return `${sign}${coef}${x}`;
  };
  const { p } = fit;
  switch (fit.model) {
    case "lin":
    case "quad":
    case "cubic":
    case "quart": {
      const deg = p.length - 1;
      const s = p.map((c, i) => term(c, deg - i, i === 0 || p.slice(0, i).every((q) => r4(q) === 0))).join("");
      return `y = ${s || "0"}`;
    }
    case "exp":
      return `y = ${n(p[0])}\\cdot ${n(p[1])}^{x}`;
    case "expe":
      return `y = ${n(p[0])}e^{${n(p[1])}x}`;
    case "inv":
      return `y = ${n(p[0])}${p[1] < 0 ? "-" : "+"}\\dfrac{${n(Math.abs(p[1]))}}{x}`;
    case "pow":
      return `y = ${n(p[0])}x^{${n(p[1])}}`;
    case "log":
      return `y = ${n(p[0])}${p[1] < 0 ? "-" : "+"}${n(Math.abs(p[1]))}\\ln x`;
    case "logistic":
      // pri velikih x (leta) je a zunaj obsega: zapis s prevojem y = c/(1 + e^(−b(x − x₀)))
      if (!(Math.abs(Math.log10(p[0])) < 12) && Number.isFinite(fit.xm))
        return `y = \\dfrac{${n(p[2])}}{1+e^{${n(-p[1])}(x${fit.xm < 0 ? "+" : "-"}${n(Math.abs(fit.xm))})}}`;
      return `y = \\dfrac{${n(p[2])}}{1+${n(p[0])}e^{${n(-p[1])}x}}`;
    case "sin":
      return `y = ${n(p[0])}\\sin(${n(p[1])}x${p[2] < 0 ? "-" : "+"}${n(Math.abs(p[2]))})${p[3] < 0 ? "-" : "+"}${n(Math.abs(p[3]))}`;
  }
  return "";
}

/** Imena spremenljivk, ki jih uporablja vrstica (za zaznavo, kdaj je treba risati znova). */
export function usesAnimatedVar(o, names) {
  if (!o.ast) return false;
  let yes = false;
  walk(o.ast, (n) => {
    if (n.k === "var" && names.has(n.name)) yes = true;
  });
  return yes;
}
