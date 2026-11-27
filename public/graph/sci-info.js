// Podatki v praznem delu zaslona znanstvenega kalkulatorja (j, 27. 11.; načrt z dopolnitvami po pregledu ChatGPT:
// /mnt/project-files/evklid/kalkulator-ipad/nacrt-tipkovnica-podatki.md). Po temi zapisa: analiza, enačbe in polinomi,
// kotne, eksponentne in logaritemske funkcije, števila, kompleksna števila, fizika (enote), kemija (M(formula)).
// Vrstice so po pomembnosti za trenutni vnos: prve tri so vidne, ostale pod »Več«. Vse izračuna kalkulator sam
// (CAS in numerika), brez strežnika. Brez DOM razen SVG-niza (testi v test/sci-info.test.js).
import { analyze, solutionTex, polyCoeffs } from "./scisolve.js";
import { evaluate, formatNumber, primeFactors, factorsTex, exactTex, mixedTex } from "./scicore.js";
import { molarMass } from "./toolscore.js";
import { MASSES } from "./pse-data.js";
import { siUnit, unitTexInner, OFFSET_TEMP } from "./enote.js";

const MAX_LEN = 80; // dolgi izrazi: brez podatkov (CAS v predogledu ima kratko mejo)
export const INFO_FIRST = 3; // toliko vrstic je vidnih brez »Več«
const ok = (r) => r && !r.error;
const TRIG = /\b(?:a?sin|a?cos|a?tan|a?cot|arc\w+)\s*\(/;
const EXPLOG = /\b(?:ln|log\w*)\s*\(|\^\s*(?:\([^()]*x|x)|\bexp\s*\(/;

function safe(fn) {
  try {
    return fn();
  } catch {
    return null;
  }
}

/** Vsebina oklepaja, ki se začne pri s[i] === "(" (z gnezdenjem), ali null. */
function group(s, i) {
  if (s[i] !== "(") return null;
  let d = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === "(") d++;
    else if (s[j] === ")" && --d === 0) return s.slice(i + 1, j);
  }
  return null;
}
/** Argumenti vseh klicev funkcije (re z imenom brez oklepaja): ln(x+1) → ["x+1"]. */
function argsOf(s, re) {
  const out = [];
  for (const m of s.matchAll(new RegExp(`(?:${re.source})\\s*\\(`, "g"))) {
    const g = group(s, m.index + m[0].length - 1);
    if (g != null) out.push(g);
  }
  return out;
}
/** Imenovalci: vse za »/« (oklepaj ali en člen). */
function denominators(s) {
  const out = [];
  for (let i = s.indexOf("/"); i >= 0; i = s.indexOf("/", i + 1)) {
    let j = i + 1;
    while (s[j] === " ") j++;
    const g = s[j] === "(" ? group(s, j) : /^[\p{L}\d.,√^]+(?:\([^()]*\))?/u.exec(s.slice(j))?.[0];
    if (g && /x/.test(g)) out.push(g);
  }
  return out;
}

/**
 * Vrstice podatkov [{ key, tex } | { key, text }] in graf { fn, roots, holes } za zapis text z rezultatom predogleda r.
 * profile: profil poglavja (tipke-poglavja.js: "ana", "eq", "trig", "log", "num", "cplx" …) ali null.
 */
export function infoFor(text, r, { profile = null, comma = true, env: base = null } = {}) {
  const s = String(text || "").trim();
  if (!s || s.length > MAX_LEN) return null;
  // spremenljivke, Ans in način kotov kot v kalkulatorju (sin x v DEG: ničle v stopinjah)
  const env = { vars: {}, funcs: {}, ans: 0, deg: false, ...(base || {}), comma, live: true };
  const rows = [];
  // \tfrac: ulomek v vrstici ostane nizek (stalna višina prikaza)
  const add = (key, tex) => tex && rows.push({ key, tex: String(tex).replace(/\\frac/g, "\\tfrac") });
  const num = (v) => formatNumber(Math.abs(v) < 1e-12 ? 0 : v, { comma }).tex;
  const nt = (v) => exactTex(v) || num(v);
  const sep = comma ? ";\\," : ",\\,";

  // kemija: M(H2SO4) → molska masa, atomi po elementih, masni deleži, naboj (le, če ga zapis določa)
  const chem = /^M\s*\((.+)\)$/.exec(s);
  if (chem) {
    const f = chem[1].trim();
    const m = safe(() => molarMass(f, MASSES));
    if (!m || m.error || !m.M) return null;
    add("sc.infoMolar", `M = ${num(Number(m.M.toPrecision(6)))}\\,\\mathrm{g/mol}`);
    const els = [...m.counts];
    add("sc.infoAtoms", els.map(([e, c]) => `\\mathrm{${e}}\\!:\\,${c}`).join(",\\ "));
    if (els.length > 1) add("sc.infoMassFrac", els.map(([e, c]) => `w(\\mathrm{${e}}) = ${num(Number(((100 * c * MASSES[e]) / m.M).toFixed(2)))}\\,\\%`).join(",\\ "));
    const q = /(?:\^\s*(\d*)\s*([+-])|([⁰¹²³⁴⁵⁶⁷⁸⁹]*)([⁺⁻]))$/.exec(f);
    if (q) {
      const sup = "⁰¹²³⁴⁵⁶⁷⁸⁹";
      const n = q[1] ?? [...(q[3] || "")].map((c) => sup.indexOf(c)).join("");
      const sign = (q[2] || q[4]) === "+" || q[4] === "⁺" ? "+" : "-";
      add("sc.infoCharge", `${n || ""}${sign}`);
    }
    return rows.length ? { rows, plot: null } : null;
  }
  if (!r || r.error) return null;

  // kompleksno število: a + bi, |z|, argument (pri z = 0 ni določen), konjugirano, polarni zapis
  if (r.kind === "complex" && Number.isFinite(r.re) && Number.isFinite(r.im)) {
    const { re, im } = r;
    const cTex = (a, b) => {
      if (!b) return nt(a);
      const bi = `${Math.abs(b) === 1 ? "" : nt(Math.abs(b))}i`;
      return a ? `${nt(a)} ${b < 0 ? "-" : "+"} ${bi}` : `${b < 0 ? "-" : ""}${bi}`;
    };
    add("sc.infoAlg", `z = ${cTex(re, im)}`);
    const abs = Math.hypot(re, im);
    add("sc.infoAbs", `|z| = ${nt(abs)}`);
    const deg = env.deg;
    const phi = Math.atan2(im, re);
    const ang = (p) => (deg ? `${num(Number(((p * 180) / Math.PI).toFixed(4)))}^{\\circ}` : exactTex(p) || num(Number(p.toFixed(4))));
    if (!abs) rows.push({ key: "sc.infoArg", text: "sc.infoArgNone" });
    else add("sc.infoArg", `\\arg z = ${ang(phi)}`);
    add("sc.infoConj", `\\bar{z} = ${cTex(re, -im)}`);
    if (abs) add("sc.infoPolar", `z = ${nt(abs)}\\,(\\cos ${ang(phi)} + i \\sin ${ang(phi)})`);
    return { rows, plot: null };
  }

  // vrednost z enoto: najprej v enotah SI (72 km/h → 20 m/s), nato s predpono, pogosta enota, znanstveni zapis
  if (r.kind === "value" && r.unit && Number.isFinite(r.value)) {
    const u = r.unit;
    if (!u.d || !Number.isFinite(u.f) || u.sym in OFFSET_TEMP) return null;
    const si = siUnit(u.d);
    const v = r.value * u.f;
    const uTex = (sym) => (sym ? `\\,\\mathrm{${unitTexInner(sym)}}` : "");
    if (si != null && si !== u.sym) add("sc.infoSI", `${num(Number(v.toPrecision(10)))}${uTex(si)}`);
    const speed = u.d.join() === "1,0,-1,0,0,0";
    if (speed && u.sym !== "km/h") add("sc.infoCommon", `${num(Number((v * 3.6).toPrecision(10)))}${uTex("km/h")}`);
    // predpona (k, M, m, µ …) le za enoto brez ulomka in brez kg
    if (si && !/[/·²³]|kg/.test(si) && v) {
      const P = [[1e9, "G"], [1e6, "M"], [1e3, "k"], [1, ""], [1e-3, "m"], [1e-6, "µ"], [1e-9, "n"]];
      const [f, p] = P.find(([f]) => Math.abs(v) >= f) || P[P.length - 1];
      if (p && `${p}${si}` !== u.sym) add("sc.infoPrefix", `${num(Number((v / f).toPrecision(10)))}${uTex(p + si)}`);
    }
    const a = Math.abs(v);
    if (a && (a >= 1e4 || a < 1e-2)) {
      const [m, e] = v.toExponential(4).split("e");
      add("sc.infoSci", `${num(Number(m))} \\cdot 10^{${Number(e)}}${uTex(si ?? u.sym)}`);
    }
    return rows.length ? { rows, plot: null } : null;
  }

  // število: točna oblika in decimalno (tisto, česar vnos še ne kaže, najprej), mešano število, prafaktorji, znanstveni zapis
  if (r.kind === "value" && Number.isFinite(r.value)) {
    const v = r.value;
    const ex = exactTex(v);
    const decIn = /\d[.,]\d/.test(s);
    if (ex && decIn) add("sc.infoExact", ex);
    if (ex) add("sc.infoDec", `${r.est || !Number.isInteger(v * 1e6) ? "\\approx" : "="} ${num(v)}`);
    if (ex && !decIn && !rows.some((x) => x.key === "sc.infoExact") && String(r.tex || "").replace(/\\[td]?frac/g, "\\frac") !== ex) add("sc.infoExact", ex);
    add("sc.infoMixed", mixedTex(v));
    if (Number.isInteger(v) && Math.abs(v) >= 4 && Math.abs(v) < 1e12) {
      const f = safe(() => primeFactors(Math.abs(v)));
      if (f && !(f.length === 1 && f[0][1] === 1)) add("sc.infoPrimes", factorsTex(v, f));
    }
    const a = Math.abs(v);
    if (a && (a >= 1e4 || a < 1e-2)) {
      const [m, e] = v.toExponential(6).split("e");
      add("sc.infoSci", `${num(Number(m))} \\cdot 10^{${Number(e)}}`);
    }
    return rows.length ? { rows, plot: null } : null;
  }

  // enačba z eno neznanko x: rešitve, diskriminanta (kvadratna), Vieta, razstavljeno, teme
  // (predogled enačbo le zapiše, rešitve izračuna šele »=«; tukaj jo rešimo po premoru tipkanja)
  const eq = /=/.test(s) && !/[<>≤≥;]/.test(s) ? (r.kind === "solve" && r.roots ? r : safe(() => analyze(s, env))) : null;
  if (eq?.kind === "solve" && eq.v === "x") {
    r = eq;
    const sides = s.split(/=/);
    if (sides.length !== 2) return null;
    const fn = `(${sides[0]})-(${sides[1]})`;
    const solved = { ...r, complex: [] };
    const P = periodOf(fn, env);
    const roots = (r.roots || []).filter(Number.isFinite);
    if (!roots.length && !r.all) rows.push({ key: "sc.infoSolutions", text: "sc.infoNoRoots" });
    else if (!r.all) add("sc.infoSolutions", P ? periodicTex(roots, P, env, nt, num) : safe(() => solutionTex(solved, comma)));
    const p = r.poly || safe(() => polyCoeffs((x) => evalAt(fn, x, env)));
    if (p && p.length === 3 && p[0]) {
      const [a, b, c] = p;
      add("sc.infoDisc", `D = ${nt(b * b - 4 * a * c)}`);
      add("sc.infoVieta", `x_1 + x_2 = ${nt(-b / a)},\\ x_1 x_2 = ${nt(c / a)}`);
    }
    if (p && p.length >= 3) {
      const fac = safe(() => analyze(`razstavi(${fn})`, env));
      if (ok(fac) && fac.resTex && /\\left\(|\)\s*\^|\)\(/.test(fac.resTex)) add("sc.infoFactor", fac.resTex);
    }
    if (p && p.length === 3 && p[0]) add("sc.infoVertex", `T(${nt(-p[1] / (2 * p[0]))}${sep}${nt(p[2] - (p[1] * p[1]) / (4 * p[0]))})`);
    if (P) add("sc.infoPeriod", angleTex(P, env, nt, num));
    return rows.length ? { rows, plot: { fn, roots: roots.filter((x) => Math.abs(x) < 1e6), holes: [] } } : null;
  }

  // funkcija f(x)
  if (r.kind === "expr" && r.v === "x" && !/[=<>≤≥;]/.test(s)) {
    const f = (x) => evalAt(s, x, env);
    // odvod in integral sta v radianih (AUDIT-055): pri kotnih funkcijah v DEG/GRA ju ne kažemo
    const trig = TRIG.test(s);
    const calc = !((env.deg || env.grad) && trig);
    const topic = profile === "ana" ? "ana" : trig ? "trig" : EXPLOG.test(s) ? "log" : "poly";
    const P = trig ? periodOf(s, env) : 0;
    const dom = trig ? null : domainOf(s, env, nt, sep);
    const holes = (dom?.excl || []).map((a) => hole(f, a)).filter(Boolean);
    const solved = safe(() => analyze(`${s}=0`, env));
    let roots = solved?.kind === "solve" ? (solved.roots || []).filter(Number.isFinite) : [];
    if (holes.length) roots = roots.filter((x) => !holes.some((h) => Math.abs(h[0] - x) < 1e-9));
    const R = {};
    if (solved?.kind === "solve" && !solved.all) {
      // brez realnih ničel (1/x, x² + 1, e^x): besedilo, ne »x ∉ [−10¹²; 10¹²]«
      if (!roots.length) R.roots = { key: "sc.infoRoots", text: "sc.infoNoRoots" };
      else R.roots = { key: "sc.infoRoots", tex: P ? periodicTex(roots, P, env, nt, num) : roots.map((x, i) => `x_{${i + 1}} = ${nt(x)}`).join(",\\ ").replace(/x_\{1\} = (.*)$/, (m, a) => (roots.length === 1 ? `x = ${a}` : m)) };
    }
    const one = (key, tex) => tex && (R[key] = { key, tex: String(tex).replace(/\\frac/g, "\\tfrac") });
    if (dom?.tex) one("sc.infoDomain", dom.tex);
    const d1 = calc ? safe(() => analyze(`d/dx(${s})`, env)) : null;
    if (ok(d1) && d1.resTex) one("sc.infoDeriv", `f'(x) = ${d1.resTex}`);
    const poly = !trig && safe(() => polyCoeffs(f));
    if (poly && poly.length === 3 && poly[0]) one("sc.infoVertex", `T(${nt(-poly[1] / (2 * poly[0]))}${sep}${nt(poly[2] - (poly[1] * poly[1]) / (4 * poly[0]))})`);
    else if (!trig && topic !== "log") one("sc.infoExtrema", extremaTex(f, roots, dom?.excl || [], nt, sep));
    const y0 = f(0);
    if (Number.isFinite(y0)) one("sc.infoY0", `f(0) = ${nt(y0)}`);
    if (!trig) one("sc.infoAsym", asymptotesTex(f, dom, holes, nt));
    if (trig) {
      if (P) one("sc.infoPeriod", angleTex(P, env, nt, num));
      if (!/tan|cot/.test(s) && P) {
        const ys = [];
        for (let i = 0; i < 720; i++) ys.push(f((P * i) / 720));
        const fin = ys.filter(Number.isFinite);
        if (fin.length > 600) one("sc.infoRange", `[${nt(Number(Math.min(...fin).toFixed(9)))}${sep}${nt(Number(Math.max(...fin).toFixed(9)))}]`);
      }
      const tan = argsOf(s, /\btan/);
      const cot = argsOf(s, /\bcot/);
      if (P && tan.length + cot.length === 1) {
        const a = safe(() => analyze(tan.length ? `cos(${tan[0]})=0` : `sin(${cot[0]})=0`, env));
        if (a?.kind === "solve" && a.roots?.length) one("sc.infoAsym", periodicTex(a.roots.filter(Number.isFinite), P, env, nt, num));
      }
    }
    if (topic === "ana" && calc) {
      const d2 = safe(() => analyze(`d/dx(d/dx(${s}))`, env));
      if (ok(d2) && d2.resTex) one("sc.infoDeriv2", `f''(x) = ${d2.resTex}`);
      const F = safe(() => analyze(`integriraj(${s})`, env));
      if (ok(F) && F.resTex) one("sc.infoIntegral", `\\int f(x)\\,dx = ${F.resTex}`);
    }
    if (topic === "poly" && poly && poly.length >= 3) {
      const fac = safe(() => analyze(`razstavi(${s})`, env));
      // le, če je razstavljeno drugačno od zapisa (x² + 1 ostane x² + 1)
      if (ok(fac) && fac.resTex && fac.resTex.replace(/\s/g, "") !== String(r.tex || "").replace(/\s/g, "") && /\\left\(|\)\s*\^|\)\(/.test(fac.resTex)) one("sc.infoFactor", fac.resTex);
    }
    // vrstni red po temi (prve tri vidne): pri izrazu najprej razstavljeno, pri analizi definicijsko območje, ničle, odvod …
    const ORDER = {
      ana: ["sc.infoDomain", "sc.infoRoots", "sc.infoDeriv", "sc.infoExtrema", "sc.infoVertex", "sc.infoDeriv2", "sc.infoIntegral", "sc.infoAsym", "sc.infoY0"],
      trig: ["sc.infoRoots", "sc.infoPeriod", "sc.infoRange", "sc.infoAsym", "sc.infoY0", "sc.infoDeriv"],
      log: ["sc.infoDomain", "sc.infoRoots", "sc.infoAsym", "sc.infoY0", "sc.infoDeriv"],
      poly: ["sc.infoFactor", "sc.infoDomain", "sc.infoRoots", "sc.infoVertex", "sc.infoExtrema", "sc.infoY0", "sc.infoAsym", "sc.infoDeriv"],
    }[topic];
    // definicijsko območje ℝ pri polinomu ni novica: le pri ulomkih, korenih, logaritmih
    if (topic === "poly" && R["sc.infoDomain"] && !dom?.excl?.length && !dom?.cond) delete R["sc.infoDomain"];
    for (const k of ORDER) if (R[k] || (k === "sc.infoRoots" && R.roots)) rows.push(R[k] || R.roots);
    return rows.length ? { rows, plot: { fn: s, roots: roots.filter((x) => Math.abs(x) < 1e6), holes } } : null;
  }
  return null;
}

function evalAt(fn, x, env) {
  try {
    const v = evaluate(fn, { ...env, vars: { ...env.vars, x }, live: true }).value;
    return typeof v === "number" ? v : NaN;
  } catch {
    return NaN;
  }
}

/** Perioda kotne funkcije: najmanjši P = osnova·p/q (osnova π, 180° ali 200g), za katero f(x + P) = f(x), ali 0. */
export function periodOf(fn, env) {
  if (!TRIG.test(fn) || /x\s*\^|\^\s*(?:\([^()]*x|x)|\bx\s*\*?\s*(?:sin|cos|tan)|\b(?:sin|cos|tan|cot)\s*\(\s*x\s*\^/.test(fn)) return 0;
  const base = env.grad ? 200 : env.deg ? 180 : Math.PI;
  const cand = [];
  for (let q = 1; q <= 12; q++) for (let p = 1; p <= 24; p++) cand.push((base * p) / q);
  cand.sort((a, b) => a - b);
  const xs = [0.37, 1.29, 2.71, 5.3, 11.7, 0.05, 3.9];
  const f = (x) => evalAt(fn, x, env);
  const fx = xs.map(f);
  if (fx.filter(Number.isFinite).length < 4) return 0;
  for (const P of cand) if (xs.every((x, i) => !Number.isFinite(fx[i]) || Math.abs(f(x + P) - fx[i]) < 1e-9 * Math.max(1, Math.abs(fx[i])))) return P;
  return 0;
}
const angleTex = (P, env, nt, num) => (env.deg ? `${num(P)}^{\\circ}` : env.grad ? `${num(P)}^{\\mathrm{g}}` : nt(P));
/** x = a + kP za vsako rešitev v eni periodi [0, P). */
function periodicTex(roots, P, env, nt, num) {
  const mod = (x) => {
    const m = ((x % P) + P) % P;
    return Math.abs(m - P) < 1e-9 || Math.abs(m) < 1e-12 ? 0 : m;
  };
  const one = [];
  for (const x of roots.map(mod).sort((a, b) => a - b)) if (!one.some((y) => Math.abs(y - x) < 1e-9)) one.push(x);
  const pt = angleTex(P, env, nt, num);
  const kP = /^\d|^\\pi/.test(pt) && pt !== "1" ? `k${/^\d/.test(pt) ? " \\cdot " : ""}${pt}` : `k \\cdot ${pt}`;
  const at = (a) => (a ? `${angleTex(a, env, nt, num)} + ${kP}` : kP);
  return `${one.map((a, i) => `x${one.length > 1 ? `_{${i + 1}}` : ""} = ${at(a)}`).join(",\\ ")},\\ k \\in \\mathbb{Z}`;
}

/** Definicijsko območje: imenovalci ≠ 0, logaritem > 0, koren ≥ 0. { tex, excl, cond } ali null (ne vemo). */
function domainOf(s, env, nt, sep) {
  const excl = [];
  const cond = [];
  for (const d of denominators(s)) {
    const a = safe(() => analyze(`(${d})=0`, env));
    if (!a || a.periodic || (a.kind !== "solve" && a.kind !== "bool")) return null;
    if (a.kind === "solve") excl.push(...(a.roots || []).filter(Number.isFinite));
  }
  const ineq = (arg, op) => {
    const a = safe(() => analyze(`${arg}${op}0`, env));
    if (a?.kind !== "ineq") return false;
    cond.push(a);
    return true;
  };
  for (const arg of argsOf(s, /\b(?:ln|log)/)) if (/x/.test(arg) && !ineq(arg, ">")) return null;
  for (const arg of argsOf(s, /sqrt|√/)) if (/x/.test(arg) && !ineq(arg, ">=")) return null;
  // potenca z ulomkom ali spremenljivko v osnovi in eksponentu (x^(1/2), x^x): ne ugibamo
  if (/\^\s*(?:\([^()]*[/.,]|\d*[.,]\d)|x\s*\^\s*(?:\([^()]*x|x)|logb|\b(?:tan|cot|asin|acos|arc)/.test(s)) return null;
  const end = (x) => (x === -Infinity ? "-\\infty" : x === Infinity ? "\\infty" : nt(x));
  const parts = cond.map((a) => {
    const I = a.intervals;
    if (I.length === 1 && (I[0].hi == null || I[0].hi === Infinity) && Number.isFinite(I[0].lo)) return `x ${I[0].loIn ? "\\ge" : ">"} ${end(I[0].lo)}`;
    return `x \\in ${I.map((i) => `${i.loIn ? "[" : "("}${end(i.lo ?? -Infinity)}${sep}${end(i.hi ?? Infinity)}${i.hiIn ? "]" : ")"}`).join(" \\cup ")}`;
  });
  const ex = [...new Set(excl.map((x) => Number(x.toFixed(9))))].sort((a, b) => a - b);
  if (ex.length) parts.push(`x \\neq ${ex.map(nt).join(",\\ ")}`);
  return { tex: parts.length ? parts.join(",\\ ") : "x \\in \\mathbb{R}", excl: ex, cond: cond.length ? cond : null };
}

/** Prazna točka grafa pri izključeni točki a, kjer ima f končno limito ((x² − 1)/(x − 1) pri 1 → (1, 2)). */
function hole(f, a) {
  const l = f(a - 1e-7);
  const r = f(a + 1e-7);
  if (!Number.isFinite(l) || !Number.isFinite(r) || Math.abs(l - r) > 1e-4 * Math.max(1, Math.abs(l))) return null;
  return [a, Number(((l + r) / 2).toFixed(6))];
}

/** Ekstremi na [−10, 10] (in okoli ničel): menjava predznaka odvoda, razpolavljanje. */
function extremaTex(f, roots, excl, nt, sep) {
  const lo = Math.min(-10, ...roots.map((x) => x - 2));
  const hi = Math.max(10, ...roots.map((x) => x + 2));
  const N = 800;
  const h = 1e-6;
  const d = (x) => (f(x + h) - f(x - h)) / (2 * h);
  const out = [];
  let x0 = lo;
  let d0 = d(lo);
  for (let i = 1; i <= N; i++) {
    const x1 = lo + ((hi - lo) * i) / N;
    const d1 = d(x1);
    if (Number.isFinite(d0) && Number.isFinite(d1) && d0 * d1 < 0 && !excl.some((e) => e >= x0 - 1e-9 && e <= x1 + 1e-9)) {
      let [a, b, da] = [x0, x1, d0];
      for (let k = 0; k < 50; k++) {
        const m = (a + b) / 2;
        const dm = d(m);
        if (dm * da > 0) [a, da] = [m, dm];
        else b = m;
      }
      const x = Number(((a + b) / 2).toFixed(6));
      const y = f(x);
      if (Number.isFinite(y)) out.push(`${d0 > 0 ? "\\max" : "\\min"}\\,(${nt(x)}${sep}${nt(Number(y.toFixed(6)))})`);
    }
    if (out.length > 3) return null; // valovita funkcija: brez dolgega seznama
    [x0, d0] = [x1, d1];
  }
  return out.length ? out.join(",\\ ") : null;
}

/** Asimptote: navpične pri polih (izključene točke brez prazne točke, rob logaritma), vodoravne pri ±∞. */
function asymptotesTex(f, dom, holes, nt) {
  const out = [];
  for (const a of dom?.excl || []) if (!holes.some((h) => h[0] === a)) out.push(`x = ${nt(a)}`);
  for (const c of dom?.cond || [])
    for (const i of c.intervals) for (const e of [i.lo, i.hi]) {
        if (e == null || !Number.isFinite(e)) continue;
        // rob logaritma: f proti ±∞ (ln x pri 0), ne končna vrednost (√(x − 2) pri 2)
        const g = (d) => (Number.isFinite(f(e + 1e-9)) ? f(e + d) : f(e - d));
        if (Math.abs(g(1e-9)) > Math.abs(g(1e-3)) + 5) out.push(`x = ${nt(e)}`);
      }
  const ys = new Set();
  for (const s of [-1, 1]) {
    const a = f(s * 1e4);
    const b = f(s * 1e5);
    if (Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 1e-3 * Math.max(1, Math.abs(b)) && Math.abs(b) < 1e6) ys.add(Number(b.toFixed(3)));
  }
  for (const y of ys) out.push(`y = ${nt(Math.abs(y) < 1e-3 ? 0 : y)}`);
  return out.length ? [...new Set(out)].join(",\\ ") : null;
}

/** Mali graf funkcije (SVG niz): okno okoli ničel, vsaj [−5, 5]; y po vzorcih, brez skokov čez pole; prazne točke. */
export function plotSvg(fn, roots = [], { w = 280, h = 130, env = {}, holes = [] } = {}) {
  const lo = Math.min(-5, ...roots.map((x) => x - 2), ...holes.map((p) => p[0] - 2));
  const hi = Math.max(5, ...roots.map((x) => x + 2), ...holes.map((p) => p[0] + 2));
  const xs = [];
  const ys = [];
  const N = 160;
  for (let i = 0; i <= N; i++) {
    const x = lo + ((hi - lo) * i) / N;
    const y = evalAt(fn, x, env);
    xs.push(x);
    ys.push(Number.isFinite(y) ? y : NaN);
  }
  const fin = ys.filter(Number.isFinite).sort((a, b) => a - b);
  if (fin.length < 4) return "";
  // 5.–95. percentil: pol (1/x) ne splošči grafa
  let y0 = fin[Math.floor(fin.length * 0.05)];
  let y1 = fin[Math.ceil(fin.length * 0.95) - 1];
  if (y1 - y0 < 1e-9) [y0, y1] = [y0 - 1, y1 + 1];
  const pad = (y1 - y0) * 0.12;
  y0 = Math.min(y0 - pad, 0 - pad);
  y1 = Math.max(y1 + pad, 0 + pad);
  const X = (x) => ((x - lo) / (hi - lo)) * w;
  const Y = (y) => h - ((y - y0) / (y1 - y0)) * h;
  let d = "";
  let pen = false;
  for (let i = 0; i <= N; i++) {
    const y = ys[i];
    const jump = i && Number.isFinite(ys[i - 1]) && Math.abs(y - ys[i - 1]) > (y1 - y0) * 1.5;
    if (!Number.isFinite(y) || jump) {
      pen = false;
      if (!Number.isFinite(y)) continue;
    }
    const py = Math.max(-h, Math.min(2 * h, Y(y)));
    d += `${pen ? "L" : "M"}${X(xs[i]).toFixed(1)} ${py.toFixed(1)}`;
    pen = true;
  }
  const ax = lo <= 0 && hi >= 0 ? `<line class="ax" x1="${X(0).toFixed(1)}" y1="0" x2="${X(0).toFixed(1)}" y2="${h}"/>` : "";
  const ay = `<line class="ax" x1="0" y1="${Y(0).toFixed(1)}" x2="${w}" y2="${Y(0).toFixed(1)}"/>`;
  // pika kot pot ničelne dolžine z okroglim koncem: ostane okrogla tudi pri raztegnjenem viewBox
  const dot = (x, y, cls) => `<path class="${cls}" d="M${X(x).toFixed(1)} ${Y(y).toFixed(1)}h0"/>`;
  const dots = roots.filter((x) => x >= lo && x <= hi).map((x) => dot(x, 0, "dot")).join("");
  const empty = holes.map(([x, y]) => dot(x, y, "hole") + dot(x, y, "hole-in")).join("");
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">${ax}${ay}<path d="${d}"/>${dots}${empty}</svg>`;
}
