// Podatki v praznem delu zaslona znanstvenega kalkulatorja (j, 27. 11.; načrt z dopolnitvami po pregledu ChatGPT:
// /mnt/project-files/evklid/kalkulator-ipad/nacrt-tipkovnica-podatki.md). Po temi zapisa: analiza, enačbe in polinomi,
// kotne, eksponentne in logaritemske funkcije, števila, kompleksna števila, fizika (enote), kemija (M(formula)).
// Vrstice so po pomembnosti za trenutni vnos: prve tri so vidne, ostale pod »Več«. Vse izračuna kalkulator sam
// (CAS in numerika), brez strežnika. Brez DOM razen SVG-niza (testi v test/sci-info.test.js).
import { analyze, solutionTex, polyCoeffs } from "./scisolve.js";
import { evaluate, compileLine, formatNumber, primeFactors, factorsTex, exactTex, mixedTex, usesAngles } from "./scicore.js";
import { molarMass } from "./toolscore.js";
import { MASSES } from "./pse-data.js";
import { siUnit, unitTexInner, OFFSET_TEMP } from "./enote.js";

const MAX_LEN = 80; // dolgi izrazi: brez podatkov (CAS v predogledu ima kratko mejo)
export const INFO_FIRST = 3; // toliko vrstic je vidnih brez »Več«
const ok = (r) => r && !r.error;
const TRIG = /(?<![A-Za-z])(?:a?sin|a?cos|a?tan|a?cot|arc\w+)\s*\(/;
const EXPLOG = /(?<![A-Za-z])(?:ln|log\w*)\s*\(|\^\s*(?:\([^()]*x|x)|(?<![A-Za-z])exp\s*\(/;

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
/**
 * Imenovalci: zapis za »/«, »÷« ali »:« (oklepaj, število, klic z gnezdenjem: 1/√(sin(x)), ali člen), ki ga potrdi
 * drevo izraza: deljenje veže le naslednji člen (1/2sin x = ½ · sin x, imenovalec je 2, ne 2 sin x; pregled #1227).
 * { list, missing }: missing, ko kakšnega imenovalca z x iz drevesa ne znamo zapisati (takrat ne ugibamo).
 */
function denominators(s, env = {}) {
  const ast = [];
  let L = null;
  try {
    L = compileLine(s, { ...env, vars: { ...(env.vars || {}), x: 0 } });
  } catch {}
  const hasX = (n) => n && typeof n === "object" && (n.k === "var" ? n.name === "x" : Object.values(n).some((v) => (Array.isArray(v) ? v.some(hasX) : hasX(v))));
  const walk = (n) => {
    if (!n || typeof n !== "object") return;
    if (n.k === "/" && hasX(n.b)) {
      ast.push(n.b);
      // deljenje z negativno potenco (1/x⁻¹ = x): osnova 0 tudi izključi točko
      let e = n.b.k === "^" ? n.b.b : null;
      while (e?.k === "grp") e = e.a;
      if (e && (e.k === "neg" || (e.k === "num" && e.v < 0)) && hasX(n.b.a)) ast.push(n.b.a);
    }
    for (const v of Object.values(n)) Array.isArray(v) ? v.forEach(walk) : walk(v);
  };
  if (L?.ast) walk(L.ast);
  if (!ast.length) return { list: [], missing: false };
  // vzorci blizu 0 in daleč (√(x − 20), ln(x − 1000) sta definirana šele daleč od 0)
  const xs = [0.37, 1.29, 2.71, -0.83, 5.3, -3.7, 0.61, -0.29, 3.3, 7.9, -9.1, 12.6];
  for (let k = 4; k <= 30; k += k < 20 ? 1 : 2) xs.push(0.37 * 2 ** k, -0.41 * 2 ** k);
  const runNode = (n) => {
    try {
      const code = L.run(n);
      return (x) => {
        L.scope.x = x;
        try {
          const v = code(L.scope);
          return typeof v === "number" ? v : NaN;
        } catch {
          return NaN;
        }
      };
    } catch {
      return null;
    }
  };
  const nodeFns = ast.map(runNode);
  const same = (g, h) => {
    let n = 0;
    for (const x of xs) {
      const [a, b] = [g(x), h(x)];
      if (Number.isNaN(a) !== Number.isNaN(b)) return false;
      if (Number.isNaN(a) || !Number.isFinite(a) || !Number.isFinite(b)) continue;
      if (Math.abs(a - b) > 1e-9 * Math.max(1, Math.abs(a))) return false;
      n++;
    }
    return n >= 3;
  };
  const found = new Set();
  const list = [];
  for (let i = 0; i < s.length; i++) {
    if (!"/÷:".includes(s[i])) continue;
    let j = i + 1;
    while (s[j] === " ") j++;
    const vars = [];
    // potenca za osnovo, ki se konča pri end: 1/sin(x)^2, 1/(x − 1)^2 (deljenje s potenco)
    // (le številski eksponent, tudi ² ³ s tipkovnice; x^x ali (x − 3)^x ne ugibamo)
    const pow = (end) => /^(?:\^\s*\d+(?:[.,]\d+)?|⁻?[⁰¹²³⁴⁵⁶⁷⁸⁹]+)/u.exec(s.slice(end))?.[0] ?? (/^\^\s*\(\s*-?\d+(?:[.,]\d+)?\s*\)/.exec(s.slice(end))?.[0] || null);
    const withPow = (base, end) => {
      const pw = pow(end);
      if (pw) vars.push(`${base}${pw}`);
      vars.push(base);
    };
    if (s[j] === "(") {
      const g = group(s, j);
      if (g != null) withPow(`(${g})`, j + g.length + 2);
    } else {
      const num = /^\d[\d.,]*/.exec(s.slice(j))?.[0];
      if (num) vars.push(num);
      const w = /^[\p{L}\d.,√^]+/u.exec(s.slice(j))?.[0]?.replace(/\^$/, ""); // x^(−2): potenca posebej
      if (w) {
        const arg = s[j + w.length] === "(" ? group(s, j + w.length) : null;
        if (arg != null) withPow(`${w}(${arg})`, j + w.length + arg.length + 2);
        withPow(w, j + w.length); // 1/x² (² s tipkovnice)
      }
    }
    for (const g of vars) {
      if (!g || !/x/.test(g)) continue;
      const k = nodeFns.findIndex((h, m) => h && !found.has(m) && same(fnOf(g, env), h));
      if (k < 0) continue;
      found.add(k);
      list.push(g); // brez prekinitve: x⁻¹ in njena osnova x sta oba imenovalca
    }
  }
  return { list, missing: found.size < ast.length };
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
    // naboj iona po istem pravilu kot periodni sistem (splitCharge): Fe3+ in Fe³⁺ sta en atom Fe z nabojem 3+
    if (m.charge) add("sc.infoCharge", `${Math.abs(m.charge) > 1 ? Math.abs(m.charge) : ""}${m.charge > 0 ? "+" : "-"}`);
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
    const F = fnOf(fn, env);
    const roots = (r.roots || []).filter((x) => Number.isFinite(x) && (r.poly || realRoot(F, x)));
    const bad = roots.length !== (r.roots || []).filter(Number.isFinite).length;
    if (!roots.length && !r.all) rows.push({ key: "sc.infoSolutions", text: "sc.infoNoRoots" });
    else if (!r.all) add("sc.infoSolutions", P ? periodicTex(roots, P, env, nt, num) : roots.length > 4 || bad ? rootsTex(roots, nt) : safe(() => solutionTex(solved, comma)));
    const p = r.poly || safe(() => polyCoeffs(F));
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
    return rows.length ? { rows, plot: { fn, roots: roots.filter((x) => Math.abs(x) < 1e6), holes: [], period: P } } : null;
  }

  // funkcija f(x)
  if (r.kind === "expr" && r.v === "x" && !/[=<>≤≥;]/.test(s)) {
    const f = fnOf(s, env);
    // odvod in integral sta v radianih (AUDIT-055): pri kotnih funkcijah v DEG/GRA ju ne kažemo
    const trig = TRIG.test(s);
    const calc = !((env.deg || env.grad) && trig);
    const topic = profile === "ana" ? "ana" : trig ? "trig" : EXPLOG.test(s) ? "log" : "poly";
    const P = trig ? periodOf(s, env) : 0;
    const dom = trig ? null : domainOf(s, env, nt, sep);
    const holes = (dom?.excl || []).map((a) => hole(f, a)).filter(Boolean);
    // stopničaste (floor, round …): ničle in ekstremi bi bili le izsek okna, zato jih ne kažemo
    const step = /(?<![A-Za-z])(?:floor|ceil|round|frac|mod|sign|zaokrozi)\s*\(/.test(s);
    const solved = step ? null : safe(() => analyze(`${s}=0`, env));
    let roots = solved?.kind === "solve" ? (solved.roots || []).filter(Number.isFinite) : [];
    roots = roots.filter((x) => !holes.some((h) => Math.abs(h[0] - x) < 1e-9) && realRoot(f, x));
    const R = {};
    if (solved?.kind === "solve" && !solved.all) {
      // brez realnih ničel (1/x, x² + 1, e^x): besedilo, ne »x ∉ [−10¹²; 10¹²]«
      if (!roots.length) R.roots = { key: "sc.infoRoots", text: "sc.infoNoRoots" };
      else R.roots = { key: "sc.infoRoots", tex: (P ? periodicTex(roots, P, env, nt, num) : rootsTex(roots, nt)).replace(/\\frac/g, "\\tfrac") };
    }
    const one = (key, tex) => tex && (R[key] = { key, tex: String(tex).replace(/\\frac/g, "\\tfrac") });
    if (dom?.tex) one("sc.infoDomain", dom.tex);
    const d1 = calc ? safe(() => analyze(`d/dx(${s})`, env)) : null;
    if (ok(d1) && d1.resTex) one("sc.infoDeriv", `f'(x) = ${d1.resTex}`);
    const poly = !trig && safe(() => polyCoeffs(f));
    if (poly && poly.length === 3 && poly[0]) one("sc.infoVertex", `T(${nt(-poly[1] / (2 * poly[0]))}${sep}${nt(poly[2] - (poly[1] * poly[1]) / (4 * poly[0]))})`);
    else if (!trig && !step && topic !== "log") one("sc.infoExtrema", extremaTex(f, roots, dom?.excl || [], nt, sep));
    const y0 = f(0);
    if (Number.isFinite(y0)) one("sc.infoY0", `f(0) = ${nt(y0)}`);
    if (!trig) one("sc.infoAsym", asymptotesTex(f, dom, holes, nt, num));
    if (trig) {
      if (P) one("sc.infoPeriod", angleTex(P, env, nt, num));
      if (!/tan|cot/.test(s) && P) {
        const rg = rangeOf(f, P);
        if (rg) one("sc.infoRange", `[${nt(rg[0])}${sep}${nt(rg[1])}]`);
      }
      // navpične asimptote le pri točkah, kjer gre f res proti ±∞ (revizija 28. 11.: 1/tan x ima x = kπ, ne π/2 + kπ;
      // cos x · tan x nima nobene); odstranljive prekinitve so prazne točke grafa
      const vp = P ? safe(() => polesPeriodic(s, f, P, env)) : null;
      if (vp?.poles.length) {
        // enakomerno razmaknjeni poli v enem zapisu: 1/sin x → x = kπ (ne x₁ = 2kπ, x₂ = π + 2kπ)
        const m = vp.poles.length;
        const even = m > 1 && vp.poles.every((a, i) => Math.abs(a - vp.poles[0] - (i * P) / m) < 1e-9 * Math.max(1, P));
        one("sc.infoAsym", even ? periodicTex([vp.poles[0]], P / m, env, nt, num) : periodicTex(vp.poles, P, env, nt, num));
      }
      if (vp) holes.push(...vp.holes);
      // izključene točke niso ničle (1/sin(x)⁻¹ = sin x, a pri kπ ni definirana)
      const out = (x) => vp?.excl.some((e) => Math.abs((((x - e) % P) + P) % P) < 1e-7 || Math.abs((((x - e) % P) + P) % P - P) < 1e-7);
      if (vp && roots.some(out)) {
        roots = roots.filter((x) => !out(x));
        if (R.roots) R.roots = roots.length ? { key: "sc.infoRoots", tex: periodicTex(roots, P, env, nt, num).replace(/\\frac/g, "\\tfrac") } : { key: "sc.infoRoots", text: "sc.infoNoRoots" };
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
    // definicijsko območje ℝ pri polinomu ali eksponentni funkciji ni novica: le pri ulomkih, korenih, logaritmih
    if ((topic === "poly" || topic === "log") && R["sc.infoDomain"] && !dom?.excl?.length && !dom?.cond) delete R["sc.infoDomain"];
    for (const k of ORDER) if (R[k] || (k === "sc.infoRoots" && R.roots)) rows.push(R[k] || R.roots);
    // premik in raztezek osnovne funkcije (j 28. 11.): takoj za prvo vrstico; na malem grafu osnovna črtkano
    const tr = step ? null : safe(() => transformOf(s, env, f));
    const moved = tr && (tr.p || tr.q || tr.a !== 1 || tr.b !== 1);
    if (moved) {
      // osnovna funkcija in vektor premika v eni vrstici (na telefonu sta vidni le dve vrstici)
      const v = tr.p || tr.q ? `,\\ \\vec{v} = (${tr.angle ? angleTex(tr.p, env, nt) : nt(tr.p)}${sep}${nt(tr.q)})` : "";
      const tx = [{ key: v ? "sc.infoShift" : "sc.infoParent", tex: `y = ${tr.parent}${v}`.replace(/\\frac/g, "\\tfrac") }];
      const st = [tr.a !== 1 && `a = ${nt(tr.a)}`, tr.b !== 1 && `b = ${nt(tr.b)}`].filter(Boolean);
      if (st.length) tx.push({ key: "sc.infoStretch", tex: st.join(",\\ ").replace(/\\frac/g, "\\tfrac") });
      rows.splice(Math.min(1, rows.length), 0, ...tx);
    }
    const plot = { fn: s, roots: roots.filter((x) => Math.abs(x) < 1e6), holes, period: P };
    if (moved) Object.assign(plot, { ghost: tr.ghost, shift: [tr.p, tr.q] });
    return rows.length ? { rows, plot } : null;
  }
  return null;
}

/**
 * f(x) za številne točke (perioda, zaloga vrednosti, ekstremi, graf): zapis prevedemo enkrat, brez natančnega
 * preračuna (natancnost.js) pri vsaki točki; sicer bi premor tipkanja zamrznil zaslon (pregled 27. 11.).
 */
export function fnOf(text, env) {
  try {
    const L = compileLine(text, { ...env, vars: { ...env.vars, x: 0 } });
    if (L && L.ast.k !== "cmp") {
      const code = L.run(L.ast);
      return (x) => {
        L.scope.x = x;
        try {
          const v = code(L.scope);
          return typeof v === "number" ? v : NaN;
        } catch {
          return NaN;
        }
      };
    }
  } catch {}
  return (x) => evalAt(text, x, env);
}
/** Prava ničla: f(x) ≈ 0 in majhna glede na okolico (x·ln x pri 0 ni definirana, x^x pri −20 je le majhna). */
function realRoot(f, x) {
  const y = f(x);
  if (!Number.isFinite(y)) return false;
  if (y === 0) return true;
  const n = Math.max(Math.abs(f(x - 1e-3)), Math.abs(f(x + 1e-3)));
  return Math.abs(y) < 1e-9 && Math.abs(y) < 1e-6 * n;
}
/** Seznam ničel: največ štiri (najbližje 0), sicer »…« (x·sin x ima neskončno ničel). */
function rootsTex(roots, nt) {
  if (roots.length === 1) return `x = ${nt(roots[0])}`;
  const shown = roots.length > 4 ? [...roots].sort((a, b) => Math.abs(a) - Math.abs(b)).slice(0, 4).sort((a, b) => a - b) : roots;
  return shown.map((x, i) => `x_{${i + 1}} = ${nt(x)}`).join(",\\ ") + (roots.length > 4 ? ",\\ \\ldots" : "");
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
  if (!TRIG.test(fn) || /x\s*\^|\^\s*(?:\([^()]*x|x)|\bx\s*\*?\s*(?:sin|cos|tan)|(?<![A-Za-z])(?:sin|cos|tan|cot)\s*\(\s*x\s*\^/.test(fn)) return 0;
  const base = env.grad ? 200 : env.deg ? 180 : Math.PI;
  const cand = [];
  for (let q = 1; q <= 12; q++) for (let p = 1; p <= 24; p++) cand.push((base * p) / q);
  cand.sort((a, b) => a - b);
  const xs = [0.37, 1.29, 2.71, 5.3, 11.7, 0.05, 3.9];
  const f = fnOf(fn, env);
  const fx = xs.map(f);
  if (fx.filter(Number.isFinite).length < 4) return 0;
  if (fx.every((y) => Math.abs(y - fx[0]) < 1e-9)) return 0; // stalna (sin² x + cos² x): brez periode
  for (const P of cand) if (xs.every((x, i) => !Number.isFinite(fx[i]) || Math.abs(f(x + P) - fx[i]) < 1e-9 * Math.max(1, Math.abs(fx[i])))) return P;
  return 0;
}
// Koti v podatkih vedno v radianih z π (j 28. 11.: »ničle itd pri periodičnih funkcijah s pi, ne s stopinjami«):
// v DEG in GRA je x v stopinjah oz. gradih, zapis pa je isti kot v radianih (180° → π, 200g → π).
// Cel kot v stopinjah ali gradih je vedno ulomek π (1° = π/180, pregled 28. 11.: tan(x − 1) → π/180 + kπ, ne 0,01745 …).
const angleTex = (P, env, nt) => {
  const half = env.deg ? 180 : env.grad ? 200 : 0;
  if (!half) return nt(P);
  // kot iz reševanja: 0,99999999999° → 1°; ulomek stopinje (2/3° → π/270) z imenovalcem do 2·180 oz. 2·200
  const r = P / half;
  let f = null;
  for (let q = 1; q <= 2 * half && !f; q++) if (Math.abs(r * q - Math.round(r * q)) < 1e-7) f = { p: Math.round(r * q), q };
  if (!f || !f.p) return nt((P * Math.PI) / half);
  const a = Math.abs(f.p);
  const num = `${a === 1 ? "" : a}\\pi`;
  return `${f.p < 0 ? "-" : ""}${f.q === 1 ? num : `\\frac{${num}}{${f.q}}`}`;
};
/** x = a + kP za vsako rešitev v eni periodi [0, P). */
function periodicTex(roots, P, env, nt, num) {
  const mod = (x) => {
    const m = ((x % P) + P) % P;
    return Math.abs(m - P) < 1e-9 || Math.abs(m) < 1e-12 ? 0 : m;
  };
  const one = [];
  for (const x of roots.map(mod).sort((a, b) => a - b)) if (!one.some((y) => Math.abs(y - x) < 1e-9)) one.push(x);
  // enakomerno razmaknjene rešitve v enem zapisu: sin x → x = kπ (ne x₁ = 2kπ, x₂ = π + 2kπ)
  const m = one.length;
  if (m > 1 && one.every((a, i) => Math.abs(a - one[0] - (i * P) / m) < 1e-9 * Math.max(1, P))) return periodicTex([one[0]], P / m, env, nt, num);
  const pt = angleTex(P, env, nt, num);
  // 2π → 2kπ, 2π/3 → 2kπ/3 (kot v učbeniku), sicer k · P
  const pi = /^(\d*)\\pi$/.exec(pt);
  const fr = /^\\frac\{(\d*)\\pi\}\{(\d+)\}$/.exec(pt);
  const kP = pi ? `${pi[1]}k\\pi` : fr ? `\\frac{${fr[1]}k\\pi}{${fr[2]}}` : `k \\cdot ${pt}`;
  const at = (a) => (Math.abs(a) > 1e-9 * Math.max(1, P) ? `${angleTex(a, env, nt, num)} + ${kP}` : kP);
  return `${one.map((a, i) => `x${one.length > 1 ? `_{${i + 1}}` : ""} = ${at(a)}`).join(",\\ ")},\\ k \\in \\mathbb{Z}`;
}

/** Definicijsko območje: imenovalci ≠ 0, logaritem > 0, koren ≥ 0. { tex, excl, cond } ali null (ne vemo). */
function domainOf(s, env, nt, sep) {
  const excl = [];
  const cond = [];
  const dens = denominators(s, env);
  if (dens.missing) return null;
  for (const d of dens.list) {
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
  for (const arg of argsOf(s, /(?<![A-Za-z])(?:ln|log)/)) if (/x/.test(arg) && !ineq(arg, ">")) return null;
  for (const arg of argsOf(s, /sqrt|√/)) if (/x/.test(arg) && !ineq(arg, ">=")) return null;
  // potenca z ulomkom ali spremenljivko v osnovi in eksponentu (x^(1/2), x^x): ne ugibamo
  if (/\^\s*(?:\([^()]*[/.,]|\d*[.,]\d)|x\s*\^\s*(?:\([^()]*x|x)|logb|(?<![A-Za-z])(?:tan|cot|asin|acos|arc)/.test(s)) return null;
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
  if (!Number.isFinite(l) || !Number.isFinite(r) || Math.abs(l) > 1e6 || Math.abs(l - r) > 1e-4 * Math.max(1, Math.abs(l))) return null;
  // dvojni pol (1/x²): na obeh straneh enako, a raste; prava luknja ima isto vrednost tudi malo dlje
  if (Math.abs(f(a + 1e-4) - l) > 1e-2 * Math.max(1, Math.abs(l)) || Math.abs(f(a - 1e-4) - l) > 1e-2 * Math.max(1, Math.abs(l))) return null;
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
    const x1 = lo + ((hi - lo) * i) / N + 0.00731; // zamik: odvod v mreži ni točno 0 (x⁴ − x² pri 0, |x|)
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

/**
 * Zaloga vrednosti periodične funkcije kot en zaprt interval [min, max] — ali nič (revizija 27. 11.: »pravilno ali nič«).
 * Le, ko je vseh 720 vzorcev periode končnih in brez skoka (1/sin x ima pol in zalogo iz dveh delov); krajišči sta
 * natančna ekstrema (zlati rez okoli najboljšega vzorca), ne največji vzorec (sin(x + 0,1) → 1, ne 0,99999197).
 */
export function rangeOf(f, P) {
  // tri mreže, zamaknjene za 1/2 in 1/3 koraka: višji vrh med vzorci (sin x + 0,01 sin 300x) da drug rezultat → nič
  const runs = [0, 1 / 2, 1 / 3].map((o) => rangeOn(f, P, o));
  if (runs.some((r) => !r)) return null;
  const same = (u, v) => Math.abs(u - v) <= 1e-9 * Math.max(1, Math.abs(u));
  if (!runs.every((r) => same(r[0], runs[0][0]) && same(r[1], runs[0][1]))) return null;
  return runs[0];
}
function rangeOn(f, P, off) {
  const N = 720;
  const ys = [];
  for (let i = 0; i < N; i++) ys.push(f((P * (i + off)) / N));
  if (!ys.every(Number.isFinite)) return null;
  let lo = 0;
  let hi = 0;
  for (let i = 1; i < N; i++) {
    if (ys[i] < ys[lo]) lo = i;
    if (ys[i] > ys[hi]) hi = i;
  }
  const span = ys[hi] - ys[lo];
  if (!(span < 1e12)) return null;
  let step = 0;
  for (let i = 0; i < N; i++) step = Math.max(step, Math.abs(ys[(i + 1) % N] - ys[i]));
  // stalna na vzorcih (ozek vrh med njimi, periodOf stalnih ne vrne) ali skok (pol, nezveznost): en interval ne bi bil pravilen
  if (span <= 1e-12 * Math.max(1, Math.abs(ys[hi])) || step > 0.1 * span) return null;
  const ext = (i, sgn) => {
    const g = (x) => sgn * f(x);
    let a = (P * (i + off - 1)) / N;
    let b = (P * (i + off + 1)) / N;
    const r = (Math.sqrt(5) - 1) / 2;
    let c = b - r * (b - a);
    let d = a + r * (b - a);
    let gc = g(c);
    let gd = g(d);
    for (let k = 0; k < 80 && b - a > 1e-13 * Math.max(1, Math.abs(a)); k++) {
      if (gc < gd) [b, d, gd] = [d, c, gc], (c = b - r * (b - a)), (gc = g(c));
      else [a, c, gc] = [c, d, gd], (d = a + r * (b - a)), (gd = g(d));
    }
    const best = Math.min(sgn * ys[i], gc, gd, g((a + b) / 2));
    return Number.isFinite(best) ? sgn * best : null;
  };
  const m = ext(lo, 1);
  const M = ext(hi, -1);
  if (m == null || M == null) return null;
  const snap = (v) => Number(v.toPrecision(12)); // natančni ekstrem: 12 mest, da exactTex prepozna 1/3, √2 …
  return [snap(m), snap(M)];
}

/** Vrednost blizu kratkega ulomka p/q (q ≤ 100) zapišemo z ulomkom: limita 1/3 + 1/x je 1/3, ne 0,333. */
function snapRational(v, tol) {
  if (Math.abs(v) < tol) return 0;
  for (let q = 1; q <= 100; q++) {
    const p = Math.round(v * q);
    if (Math.abs(v - p / q) < tol) return p / q;
  }
  return null;
}

/**
 * Vodoravna asimptota pri x → s·∞ (s = ±1) — ali null, če ni zanesljiva (revizija 27. 11.: »pravilno ali nič«).
 * f pri 10⁴, 10⁶ in 10⁸ (necela) se mora res približevati (razlike padajo; x/10⁹ raste in asimptote nima), vrednost
 * pa je kratek ulomek ali vsaj šest zanesljivih mest.
 */
export function horizontalAsymptote(f, s) {
  const xs = [10000.37, 1000000.71, 100000000.53].map((x) => s * x);
  const [a, b, c] = xs.map((x) => f(x));
  if (![a, b, c].every(Number.isFinite) || Math.abs(c) > 1e6) return null;
  const d1 = b - a;
  const d2 = c - b;
  const scale = Math.max(1, Math.abs(c));
  if (Math.abs(d2) > 1e-6 * scale || Math.abs(d2) > Math.abs(d1)) return null;
  // ostanek za c ocenimo iz hitrosti približevanja (geometrijsko, z rezervo); na ulomek ali decimalke le znotraj njega
  const r = d1 ? Math.abs(d2 / d1) : 0;
  const err = 10 * (r < 1 ? (Math.abs(d2) * r) / (1 - r) : Infinity) + 1e-12 * scale;
  if (!(err < 1e-6 * scale)) return null;
  const q = snapRational(c, err);
  if (q != null) return { y: q, exact: true };
  // decimalni zapis: brez ponovnega ugibanja ulomka (exactTex bi 123456,789 zapisal kot 109999999/891)
  return { y: Number(c.toFixed(Math.min(12, Math.max(0, Math.floor(-Math.log10(err)))))), exact: false };
}

/**
 * Ali gre f proti +∞ ali −∞ vsaj z ene strani točke a (navpična asimptota)? Na vsaki strani |f| pri razdaljah
 * 10⁻²…10⁻¹⁰ (glede na |a|): strogo narašča in zraste vsaj tisočkrat (pol: 1/x, tan x) ali narašča z nepojemajočimi
 * prirastki (logaritem: ln x pri 0). Končna limita (sin x pri π/2 za cos x · tan x), skok (|x|/x) ali nihanje → false,
 * tudi ko ne vemo (»pravilno ali nič«: navpično asimptoto raje izpustimo kot napačno pokažemo).
 */
export function divergesAt(f, a) {
  const u = Math.max(1, Math.abs(a));
  for (const s of [-1, 1]) {
    const ys = [];
    for (let k = 2; k <= 10; k++) ys.push(Math.abs(f(a + s * u * 10 ** -k)));
    if (ys.some(Number.isNaN)) continue; // na tej strani f ni definirana (ali ne vemo)
    const inf = ys.indexOf(Infinity);
    const fin = inf < 0 ? ys : ys.slice(0, inf);
    let up = true;
    for (let i = 1; i < fin.length; i++) if (!(fin[i] > fin[i - 1])) up = false;
    if (!up) continue;
    if (inf >= 0 && ys.slice(inf).every((y) => y === Infinity)) return true; // e^(1/x) pri 0⁺: prekorači obseg števil
    if (inf >= 0 || fin.length < 3) continue;
    if (fin.at(-1) >= 1e3 * fin[0] && fin.at(-1) > 0) return true;
    const d1 = fin[1] - fin[0];
    const dn = fin.at(-1) - fin.at(-2);
    if (dn >= 0.5 * d1 && fin.at(-1) - fin[0] >= 4 * d1) return true;
  }
  return false;
}

/**
 * Navpične asimptote periodične funkcije na eni periodi [0, P): kandidati so ničle imenovalcev ter točke, kjer
 * tan, cot, sec, csc niso definirani; obdržimo le tiste, kjer f gre proti ±∞ (divergesAt). Ostali kandidati s končno
 * limito so prazne točke grafa (v oknu [−5, 5]). null, če ne vemo (logaritem, negativna potenca, nerešljiv imenovalec
 * ali velika vrednost f daleč od vseh najdenih polov): takrat vrstice ni.
 */
function polesPeriodic(s, f, P, env) {
  if (/(?<![A-Za-z])(?:ln|log\w*)\s*\(|\^\s*\(?\s*[-−]/.test(s)) return null;
  const Q = env.grad ? 400 : env.deg ? 360 : 2 * Math.PI;
  const eqs = [
    ...argsOf(s, /(?<![A-Za-z])(?:tan|tg|sec)/).map((a) => `cos(${a})=0`),
    ...argsOf(s, /(?<![A-Za-z])(?:cot|ctg|csc)/).map((a) => `sin(${a})=0`),
  ];
  const dens = denominators(s, env);
  if (dens.missing) return null;
  eqs.push(...dens.list.map((d) => `(${d})=0`));
  const mod = (x) => {
    const m = ((x % P) + P) % P;
    return Math.abs(m - P) < 1e-9 * Math.max(1, P) ? 0 : m;
  };
  const cand = [];
  for (const e of eqs) {
    const a = analyze(e, env);
    if (a?.kind !== "solve" || a.all) return null;
    for (const r of (a.roots || []).filter(Number.isFinite)) {
      // periodična enačba da rešitve le na [0, Q): ostale v [0, P) so r + jQ
      const shifts = a.periodic ? Math.max(1, Math.ceil(P / Q - 1e-9)) : 1;
      for (let j = 0; j < shifts; j++) {
        const x = mod(r + j * Q);
        if (!cand.some((y) => Math.abs(y - x) < 1e-7 * Math.max(1, P))) cand.push(x);
      }
    }
  }
  // kandidati, ki so si preblizu za preverjanje spodaj (tan(tan x) ima neskončno polov ob π/2): raje nič
  const N = 2000;
  const sorted = [...cand].sort((a, b) => a - b);
  if (sorted.length > 200 || sorted.some((a, i) => (i ? a - sorted[i - 1] : a + P - sorted.at(-1)) < (2 * P) / N && sorted.length > 1)) return null;
  const poles = cand.filter((a) => divergesAt(f, a)).sort((a, b) => a - b);
  // varovalka: vsak visok lokalni vrh |f| na periodi mora biti tik ob najdenem polu (sicer kakšen pol manjka)
  const X = (i) => (P * (i + 0.37)) / N;
  const ys = [];
  for (let i = 0; i < N; i++) ys.push(Math.abs(f(X(i))));
  const fin = ys.filter(Number.isFinite).sort((a, b) => a - b);
  if (fin.length < N / 4) return null;
  const big = 100 * (1 + fin[Math.floor(fin.length / 2)]);
  const at = (i) => (Number.isNaN(ys[(i + N) % N]) ? -1 : ys[(i + N) % N]);
  const near = (x) => poles.some((p) => Math.min(Math.abs(x - p), P - Math.abs(x - p)) < (2 * P) / N);
  for (let i = 0; i < N; i++) if (at(i) > big && at(i) >= at(i - 1) && at(i) >= at(i + 1) && !near(X(i))) return null;
  const holes = [];
  for (const a of cand)
    if (!poles.includes(a))
      for (let x = a - P * Math.ceil((a + 5) / P); x <= 5; x += P) {
        if (x < -5) continue;
        const h = hole(f, x);
        if (h) holes.push(h);
      }
  return { poles, holes, excl: cand };
}

/** Asimptote: navpične pri polih (izključene točke brez prazne točke, rob logaritma), vodoravne pri ±∞. */
function asymptotesTex(f, dom, holes, nt, num = nt) {
  const out = [];
  // izključena točka ali rob območja je navpična asimptota le, če gre f vsaj z ene strani proti ±∞ (revizija 28. 11.:
  // |x|/x pri 0 ima skok, ne asimptote); prazne točke so že izločene, ker je tam limita končna
  for (const a of dom?.excl || []) if (!holes.some((h) => h[0] === a) && divergesAt(f, a)) out.push(`x = ${nt(a)}`);
  for (const c of dom?.cond || [])
    for (const i of c.intervals) for (const e of [i.lo, i.hi]) if (e != null && Number.isFinite(e) && divergesAt(f, e)) out.push(`x = ${nt(e)}`);
  const ys = new Set();
  for (const s of [-1, 1]) {
    const h = horizontalAsymptote(f, s);
    if (h) ys.add(`y = ${h.exact ? nt(h.y) : num(h.y)}`);
  }
  out.push(...ys);
  return out.length ? [...new Set(out)].join(",\\ ") : null;
}

/** Oznaka osi x malega grafa z merskimi enotami kotov (j 28. 11.: »naj bo označeno, kdaj je mali graf v radianih in
 * kdaj v stopinjah«): periodična »x: −360° … 360°« / »x: −2π … 2π« / »x: −400ᵍ … 400ᵍ«, druga s koti »x [°]«, »x [rad]«,
 * »x [ᵍ]«; brez kotov null. angle: "deg" | "rad" | "grad". */
export function axisLabel(plot, angle, funcs = {}, comma = true) {
  if (!plot || !usesAngles(plot.fn, funcs)) return null;
  const unit = angle === "deg" ? "°" : angle === "grad" ? "ᵍ" : "";
  const P = plot.period;
  if (!(Number.isFinite(P) && P > 0)) return `x [${unit || "rad"}]`;
  const dec = (x, d = 4) => String(+x.toFixed(d)).replace(".", comma ? "," : ".");
  let v = unit ? `${dec(P, 1)}${unit}` : null;
  if (!v) {
    const r = P / Math.PI;
    for (let d = 1; d <= 12 && !v; d++) {
      const n = Math.round(r * d);
      if (n > 0 && Math.abs(r * d - n) < 1e-9) v = `${n === 1 ? "" : n}π${d > 1 ? `/${d}` : ""}`;
    }
    v ||= dec(P);
  }
  return `x: −${v} … ${v}`;
}

/** Osnovne funkcije za premike: TeX in zapis za mali graf (ime, kot ga je napisal uporabnik: tg, ctg …). */
const PARENT = { sin: "\\sin x", cos: "\\cos x", tan: "\\tan x", tg: "\\tan x", cot: "\\cot x", ctg: "\\cot x", sqrt: "\\sqrt{x}", abs: "|x|", ln: "\\ln x", log: "\\log x", exp: "e^{x}" };
const ANGLE = new Set(["sin", "cos", "tan", "tg", "cot", "ctg"]);
const near9 = (u, v) => Math.abs(u - v) <= 1e-8 * (1 + Math.abs(v));

/**
 * Premik in raztezek osnovne funkcije (j 28. 11.: »naj mali graf kaže tudi premike … za vse funkcije, ne samo kotne«):
 * f(x) = a · g(b(x − p)) + q za osnovno g (xⁿ, sin, cos, tan, cot, √x, |x|, eˣ, nˣ, ln, log, logₙ, 1/x, 1/xⁿ).
 * { parent (TeX), ghost (zapis g za mali graf), a, b, p, q, angle } ali null. Vsako prepoznavo preverimo na vzorcih
 * (»pravilno ali nič«): f = sin x + cos x ali x · sin x nimata te oblike in vrstic ni.
 */
export function transformOf(text, env, f = fnOf(text, env)) {
  const s = String(text || "");
  const dec = (b) => b.replace(/[.,]/, env.comma === false ? "." : "{,}");
  const clean = (v) => {
    const r = Math.round(v);
    return Math.abs(v - r) < 1e-9 * Math.max(1, Math.abs(v)) ? r : Number(v.toPrecision(12));
  };
  // polinom stopnje n ≥ 2: a(x − p)ⁿ + q (vsaka parabola; kubična le, če je premaknjena x³)
  const poly = safe(() => polyCoeffs(f));
  if (poly) {
    const n = poly.length - 1;
    if (n < 2 || !poly[0]) return null;
    const a = poly[0];
    const p = -poly[1] / (n * a);
    const q = f(p);
    if (!Number.isFinite(q) || ![-3.7, -1.2, 0.4, 1.9, 4.6, 9.3].every((x) => near9(a * (x - p) ** n + q, f(x)))) return null;
    return { parent: `x^{${n}}`, ghost: `x^${n}`, a: clean(a), b: 1, p: clean(p), q: clean(q), angle: false };
  }
  // kandidati: vsak klic osnovne funkcije z notranjim izrazom; prvi, ki se ujema, velja
  const cands = [];
  const named = /(?<![A-Za-z_])(sin|cos|tan|tg|cot|ctg|sqrt|abs|ln|log|exp)\s*(?:(\()|(\d*[.,]?\d*\s*x)(?![\w(^²³]))/g;
  for (const m of s.matchAll(named)) {
    const inner = m[2] ? group(s, m.index + m[0].length - 1) : m[3];
    if (inner != null) cands.push({ name: m[1], inner, G: (u) => `${m[1]}(${u})`, parent: PARENT[m[1]] });
  }
  for (const m of s.matchAll(/(?<![A-Za-z])log_\s*(?:\((\d+(?:[.,]\d+)?)\)|(\d+))\s*\(/g)) {
    const inner = group(s, m.index + m[0].length - 1);
    const b = m[1] || m[2];
    if (inner != null) cands.push({ name: "logb", inner, G: (u) => `log_(${b})(${u})`, parent: `\\log_{${dec(b)}} x` });
  }
  for (const m of s.matchAll(/√\s*(?:(\()|(x)(?![\w(^²³]))/g)) {
    const inner = m[1] ? group(s, m.index + m[0].length - 1) : "x";
    if (inner != null) cands.push({ name: "sqrt", inner, G: (u) => `sqrt(${u})`, parent: PARENT.sqrt });
  }
  const bars = [...s.matchAll(/\|/g)].map((m) => m.index);
  if (bars.length === 2) cands.push({ name: "abs", inner: s.slice(bars[0] + 1, bars[1]), G: (u) => `abs(${u})`, parent: PARENT.abs, fold: 1 });
  for (const m of s.matchAll(/(?<![A-Za-z\d.,)])(e|\d+(?:[.,]\d+)?)\s*\^\s*(?:(\()|(-?\d*[.,]?\d*\s*x)(?![\w(^²³]))/g)) {
    const inner = m[2] ? group(s, m.index + m[0].length - 1) : m[3];
    const b = m[1];
    if (inner != null && b !== "0" && b !== "1") cands.push({ name: "pow", inner, G: (u) => `${b}^(${u})`, parent: b === "e" ? "e^{x}" : `${dec(b)}^{x}` });
  }
  for (const m of s.matchAll(/[/÷]\s*(?:(\()|(x)(?![\w(^²³]))/g)) {
    const at = m.index + m[0].length - 1;
    const inner = m[1] ? group(s, at) : "x";
    if (inner == null) continue;
    const rest = s.slice(m[1] ? at + inner.length + 2 : at + 1);
    const pw = /^\s*(?:\^\s*\(?\s*(\d+)\s*\)?|([²³]))/.exec(rest);
    const n = pw ? Number(pw[1] || (pw[2] === "²" ? 2 : 3)) : 1;
    if (!(n >= 1 && n <= 9)) continue;
    cands.push({ name: "rec", inner, G: (u) => (n > 1 ? `1/(${u})^${n}` : `1/(${u})`), parent: n > 1 ? `\\frac{1}{x^{${n}}}` : "\\frac{1}{x}", fold: n });
  }
  const unit = env.deg ? 180 / Math.PI : env.grad ? 200 / Math.PI : 1;
  for (const c of cands) {
    if (!/x/.test(c.inner)) continue;
    // notranji izraz mora biti linearen: b · x + c
    const U = fnOf(c.inner, env);
    const c0 = U(0);
    const b = U(1) - c0;
    if (!Number.isFinite(c0) || !Number.isFinite(b) || Math.abs(b) < 1e-12) continue;
    if (![2, -1.5, 3.7, -4.2, 11.3].every((t) => near9(c0 + b * t, U(t)))) continue;
    const p = -c0 / b;
    const angle = ANGLE.has(c.name);
    const G = fnOf(c.G(c.inner), env);
    // vzorci okoli p na obeh straneh (koren in logaritem sta definirana le na eni), v stopinjah širše
    const sc = (angle ? unit : 1) / Math.abs(b);
    const pts = [];
    let bad = false;
    for (const t of [-6.1, -2.9, -2.3, -1.7, -1.1, -0.7, -0.45, -0.2, 0.15, 0.35, 0.6, 0.95, 1.4, 1.9, 2.6, 3.3, 4.1, 7.3]) {
      const x = p + t * sc;
      const [y, g] = [f(x), G(x)];
      if (Number.isFinite(y) !== Number.isFinite(g)) bad = true;
      if (Number.isFinite(y) && Number.isFinite(g) && Math.abs(g) < 1e6) pts.push([g, y]);
    }
    if (bad || pts.length < 6) continue;
    const mg = pts.reduce((u, [g]) => u + g, 0) / pts.length;
    const my = pts.reduce((u, [, y]) => u + y, 0) / pts.length;
    const vg = pts.reduce((u, [g]) => u + (g - mg) ** 2, 0);
    if (!(vg > 1e-12)) continue;
    const a = pts.reduce((u, [g, y]) => u + (g - mg) * (y - my), 0) / vg;
    const q = my - a * mg;
    if (!(Math.abs(a) > 1e-12) || !pts.every(([g, y]) => near9(a * g + q, y))) continue;
    // |b(x − p)| = |b| · |x − p|, 1/(b(x − p))ⁿ = b⁻ⁿ/(x − p)ⁿ: raztezek le v smeri y
    const A = c.fold === 1 && c.name === "abs" ? a * Math.abs(b) : c.fold ? a / b ** c.fold : a;
    const B = c.fold ? 1 : b;
    return { parent: c.parent, ghost: c.G("x"), a: clean(A), b: clean(B), p: clean(p), q: clean(q), angle };
  }
  return null;
}

/** Mali graf funkcije (SVG niz): okno okoli ničel, vsaj [−5, 5]; y po vzorcih, brez skokov čez pole; prazne točke. */
export function plotSvg(fn, roots = [], { w = 280, h = 130, env = {}, holes = [], period = 0, ghost = null, shift = null } = {}) {
  // periodična (kotna) funkcija: dve periodi okoli 0 (j, 28. 11.: sin x v DEG je bil na [−5°; 5°] ravna črta)
  const per = Number.isFinite(period) && period > 0;
  // premaknjena funkcija: okno zajame tudi izhodišče osnovne in premik (√(x − 8) ni le rob okna)
  const sx = shift && Number.isFinite(shift[0]) && Math.abs(shift[0]) < 1e4 ? [shift[0] - 3, shift[0] + 3] : [];
  const lo = per ? -period : Math.min(-5, ...roots.map((x) => x - 2), ...holes.map((p) => p[0] - 2), ...sx);
  const hi = per ? period : Math.max(5, ...roots.map((x) => x + 2), ...holes.map((p) => p[0] + 2), ...sx);
  const f = fnOf(fn, env);
  const xs = [];
  const ys = [];
  const N = 160;
  for (let i = 0; i <= N; i++) {
    const x = lo + ((hi - lo) * i) / N;
    const y = f(x);
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
  const line = (vs) => {
    let d = "";
    let pen = false;
    for (let i = 0; i <= N; i++) {
      const y = vs[i];
      const jump = i && Number.isFinite(vs[i - 1]) && Math.abs(y - vs[i - 1]) > (y1 - y0) * 1.5;
      if (!Number.isFinite(y) || jump) {
        pen = false;
        if (!Number.isFinite(y)) continue;
      }
      const py = Math.max(-h, Math.min(2 * h, Y(y)));
      d += `${pen ? "L" : "M"}${X(xs[i]).toFixed(1)} ${py.toFixed(1)}`;
      pen = true;
    }
    return d;
  };
  const d = line(ys);
  // osnovna funkcija črtkano
  let under = "";
  if (ghost) {
    const g = fnOf(ghost, env);
    const gd = line(xs.map((x) => g(x)));
    if (gd) under += `<path class="ghost" d="${gd}"/>`;
    // vektor premika v⃗ = (p, q) iz izhodišča (pri sin x, xⁿ, |x|, √x in 1/x konča v premaknjeni značilni točki)
    if (shift && (shift[0] || shift[1]) && shift.every(Number.isFinite)) {
      const [bx, by] = shift;
      if (bx >= lo && bx <= hi && by >= y0 && by <= y1 && lo <= 0 && hi >= 0) under += `<path class="shift" d="M${X(0).toFixed(1)} ${Y(0).toFixed(1)}L${X(bx).toFixed(1)} ${Y(by).toFixed(1)}"/><path class="shift-end" d="M${X(bx).toFixed(1)} ${Y(by).toFixed(1)}h0"/>`;
    }
  }
  const ax = lo <= 0 && hi >= 0 ? `<line class="ax" x1="${X(0).toFixed(1)}" y1="0" x2="${X(0).toFixed(1)}" y2="${h}"/>` : "";
  const ay = `<line class="ax" x1="0" y1="${Y(0).toFixed(1)}" x2="${w}" y2="${Y(0).toFixed(1)}"/>`;
  // pika kot pot ničelne dolžine z okroglim koncem: ostane okrogla tudi pri raztegnjenem viewBox
  const dot = (x, y, cls) => `<path class="${cls}" d="M${X(x).toFixed(1)} ${Y(y).toFixed(1)}h0"/>`;
  // periodična: ničle in prazne točke se ponovijo na vsaki periodi v oknu
  // (x najprej v [−P/2; P/2], nato −P, 0, P: vse kopije v oknu [−P; P], tudi za ničlo daleč od 0)
  const copies = (x) => (per ? [-1, 0, 1].map((k) => x - period * Math.round(x / period) + k * period) : [x]);
  const inWin = (x) => x >= lo - 1e-9 * (hi - lo) && x <= hi + 1e-9 * (hi - lo);
  const dots = [...new Set(roots.flatMap(copies).filter(inWin).map((x) => dot(x, 0, "dot")))].join("");
  const empty = [...new Set(holes.flatMap(([x, y]) => copies(x).map((c) => [c, y])).filter(([x]) => inWin(x)).map(([x, y]) => dot(x, y, "hole") + dot(x, y, "hole-in")))].join("");
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">${ax}${ay}${under}<path d="${d}"/>${dots}${empty}</svg>`;
}
