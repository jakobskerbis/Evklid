// Varovalo za enačbe z neznankami (j, 1. 11. 2026: napaka kot »z·z̄ = a² − b²« se ne sme ponoviti;
// koda naj preveri vse, kar si učenci zapomnijo). Dopolnilo k lesson-math.js, ki preračuna le čisto
// številske korake. Vsako formulo $…$ razbije ob »=« in sosednja dela z neznankami primerja tako, da
// vanju večkrat vstavi naključna števila (tudi kompleksna enota i). Ne ujemata se:
//   - če je to enačba (2x + 3 = x + 5), velja, kadar jo izpolnijo rešitve iz istega primera (x = 2);
//   - če sta na straneh različni neznanki (z · z̄ = a² + b²), vstavi definicije iz lekcije (z = a + bi).
// Preskoči dele, ki jih ne zna prebrati (vsote, limite, vektorji, funkcije f(x), neenačbe …), golo
// oznako (F = m a), čisto številske dele in razdelke »Pogoste napake« / »Preveri se« ter vrstice o
// napačnem računu (namerno napačni zapisi).
// Uporaba: checkIdentities(markdown, { complex }) → { checked, mismatches: [{ line, tex, left, right }] }

const SKIP_LINE = /napačn|napaka|narobe|ne velja|ni enako|nepravil|ni res|neresnič|protislov|nemogoč|nima rešit|nesmisel|ne drži|✗|ni identitet|ne smeš|ne moreš|ne gre|\bbi (?:bil|moral)|nima pomena/i;
const SKIP_TEX = /\\(pm|mp|le|ge|leq|geq|neq|ne|lt|gt|in|notin|to|rightarrow|Rightarrow|longrightarrow|mapsto|iff|implies|infty|ldots|cdots|dots|equiv|sim|approx|propto|sum|prod|int|oint|lim|vec|overrightarrow|hat|dot|ddot|binom|choose|cup|cap|subset|subseteq|setminus|emptyset|mid|perp|parallel|angle|triangle|circ|begin|matrix|cases|boxed|underbrace|overbrace|partial|nabla|forall|exists|land|lor|neg|max|min|gcd|operatorname|mathbb|mathcal|det|deg|arg|Re|Im|xrightarrow|stackrel|overset|underset|tag|leftarrow|leftrightarrow|rightleftharpoons|text\{\s*(?:in|ali|če|za|kjer|torej)\b)(?![a-zA-Z])|[<>≤≥≠→!'∪∩∈≈]|\\log_|\\(?:sin|cos|tan|cot)\^(?!\{?2\}?)/;
const SEP = /=/;
// Vrstica o enačbi ali pogoju (|x| = −x, če je x < 0): tam ni identitet.
const EQUATION_LINE = /enačb|\breši|rešitev|izenač|matri|če je|kadar|ko je|velja le|samo za|pogoj|mešan|dogod|množic|\bza \$/i;

// Več formul v enem $…$: »a(b + c) = ab + ac \qquad a(b − c) = ab − ac«, »a = 1, b = 2«.
export function splitFormulas(tex) {
  const out = [];
  let depth = 0, cur = "";
  const t = String(tex);
  for (let k = 0; k < t.length; k++) {
    const ch = t[k];
    if (ch === "{" || ch === "(" || ch === "[") depth++;
    else if (ch === "}" || ch === ")" || ch === "]") depth--;
    if (depth === 0 && t[k - 1] !== "\\") {
      const rest = t.slice(k);
      const sep = rest.match(/^(?:\\qquad|\\quad|;\s|,\s|\\text\s*\{\s*(?:in|ali|oziroma|tj\.)\s*\})/);
      if (sep) {
        out.push(cur);
        cur = "";
        k += sep[0].length - 1;
        continue;
      }
    }
    cur += ch;
  }
  out.push(cur);
  return out.map((x) => x.trim()).filter(Boolean);
}
const GREEK = "alpha|beta|gamma|delta|epsilon|varepsilon|zeta|eta|theta|vartheta|iota|kappa|lambda|mu|nu|xi|rho|sigma|tau|upsilon|phi|varphi|chi|psi|omega|Gamma|Delta|Theta|Lambda|Xi|Sigma|Phi|Psi|Omega";
const FUNCS = ["sqrt", "root", "abs", "conj", "sin", "cos", "tan", "cot", "sinsq", "cossq", "tansq", "cotsq", "ln", "log", "exp"];

// LaTeX → izraz z oznakami (x, x_1, Δx, ρ …). Vrne null, kadar dela ne zna prebrati.
export function parseTex(tex, { complex = false } = {}) {
  tex = String(tex ?? "");
  if (tex.length > 300 || SKIP_TEX.test(tex)) return null;
  let s = tex.replace(/\\,|\\;|\\!|\\:|\\quad|\\qquad|\\ |~|\\(?:left|right|[bB]igg?[lrm]?|displaystyle)(?![a-zA-Z])/g, " ");
  if (/\\text\s*\{[^{}]*\}\s*\(|\^\s*\{\s*\(|\^\s*\{?\s*(?:\\,)?\s*T\s*\}?|(?:^|[^a-zA-Z\\])d\s*(?:[a-z]|\\(?:theta|varphi|phi))\b(?!\w)/.test(tex)) return null; // A^T, dx
  s = s.replace(/\\mu\s*(?=\\(?:mathrm|text))/g, " ");
  s = s.replace(/\\(?:mathrm|text|textrm|mathit|mathbf)\s*\{[^{}]*\}(\s*\^\s*(?:\{[^{}]*\}|\d))?/g, " "); // enote
  s = s.replace(/\\(?:Omega)\b(?=\s*$)/, " ").replace(/\^\s*\{?\\circ\}?|°|\\%/g, " ");
  s = s.replace(/\{,\}/g, ".").replace(/(\d),(\d)/g, "$1.$2").replace(/[.,;]\s*$/, "");
  if ((s.match(/:/g) || []).length > 1) return null; // a : b : c je razmerje, ne deljenje
  s = s.replace(/\\cdot|\\times|\\ast/g, "*").replace(/\\div|:/g, "/").replace(/\\pi\b/g, " pi ");
  s = s.replace(/\\lvert|\\rvert|\\vert|\\mid/g, "|");
  s = s.replace(/\\(?:bar|overline)\s*\{([^{}]*)\}|\\(?:bar|overline)\s*([A-Za-z])/g, (_, a, b) => (complex ? ` conj(${a ?? b}) ` : ` ${(a ?? b).replace(/\W/g, "")}_bar `));
  s = s.replace(new RegExp(`\\\\(${GREEK})\\b`, "g"), " $1 ");
  s = s.replace(/\\(sin|cos|tan|cot)\^\{?2\}?/g, " $1sq ").replace(/\\(sin|cos|tan|cot|ln|log|exp)\b/g, " $1 ");
  // Ulomki, koreni, potence od znotraj navzven
  let prev;
  do {
    prev = s;
    s = s.replace(/\^\s*\{([^{}]*)\}/g, "^($1)");
    s = s.replace(/_\s*\{([^{}]*)\}/g, (_, x) => (/^[\w ]+$/.test(x) ? `_${x.replace(/\s/g, "")}` : "_?"));
    s = s.replace(/\\[dt]?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, "(($1)/($2))");
    s = s.replace(/\\[dt]?frac\s*(\d)\s*(\d)/g, "(($1)/($2))");
    s = s.replace(/\\sqrt\s*\[([^\]{}]*)\]\s*\{([^{}]*)\}/g, "root($1,$2)");
    s = s.replace(/\\sqrt\s*\{([^{}]*)\}/g, "sqrt($1)");
    s = s.replace(/\\sqrt\s*(\w)/g, "sqrt($1)");
  } while (s !== prev);
  if (s.includes("_?") || s.includes("\\")) return null;
  if (/\|\s*[A-Z][A-Z\s+*\-]*\|/.test(s)) return null; // |A + B|: moč množice, |AB|: dolžina daljice
  s = s.replace(/\|([^|]*)\|/g, "abs($1)");
  if (s.includes("|")) return null;
  s = s.replace(/[{[]/g, "(").replace(/[}\]]/g, ")");
  return tokenize(s, complex);
}

const NAMES = new RegExp(`^(?:${FUNCS.join("|")}|pi|${GREEK})$`);
function tokenize(s, complex) {
  const toks = [];
  const re = /\s*(\d+\.?\d*|\.\d+|[A-Za-z]+(?:_[A-Za-z0-9]+)?|\*\*|[\^+\-*/(),])/y;
  let pos = 0;
  while (pos < s.length) {
    re.lastIndex = pos;
    const m = re.exec(s);
    if (!m) {
      if (/^\s*$/.test(s.slice(pos))) break;
      return null;
    }
    pos = re.lastIndex;
    let t = m[1] === "**" ? "^" : m[1];
    // Več črk zapored (ab, xy) so ločene oznake; imena funkcij in grških črk ostanejo cela.
    if (/^[A-Za-z]+(_\w+)?$/.test(t) && !NAMES.test(t)) {
      const [word, sub] = t.split("_");
      const letters = NAMES.test(word) ? [word] : word.split("");
      letters.forEach((l, k) => toks.push({ v: k === letters.length - 1 && sub ? `${l}_${sub}` : l }));
      continue;
    }
    toks.push(/^[\d.]/.test(t) ? { n: Number(t) } : NAMES.test(t) && !FUNCS.includes(t) ? { v: t } : FUNCS.includes(t) ? { f: t } : { o: t });
  }
  // Δx je ena oznaka; e^… je Eulerjevo število; i je imaginarna enota pri kompleksnih številih.
  const out = [];
  for (let k = 0; k < toks.length; k++) {
    const t = toks[k];
    if (t.v === "Delta" && toks[k + 1]?.v) out.push({ v: `Δ${toks[++k].v}` });
    else if (t.v === "e" && toks[k + 1]?.o === "^") out.push({ c: "e" });
    else if ((t.v === "i" && complex) || (t.v === "j" && complex === "j")) out.push({ c: "i" });
    else if (t.v === "pi") out.push({ c: "pi" });
    else out.push(t);
  }
  // Funkcija f(x), g(x), P(A) ni produkt: takega dela ne beremo.
  // Tudi c(t), S(r), T(n+1), Φ(2): oznaka tik pred oklepajem z eno samo (drugo) oznako ali številom v njem.
  for (let k = 0; k < out.length - 1; k++) {
    if (!out[k].v || out[k + 1].o !== "(") continue;
    if (/^[fghFGHPQ]$/.test(out[k].v)) return null;
    let d = 0, j = k + 1;
    const inner = [];
    for (; j < out.length; j++) {
      if (out[j].o === "(") d++;
      else if (out[j].o === ")" && --d === 0) break;
      else if (out[j].v) inner.push(out[j].v);
    }
    const iv = [...new Set(inner)];
    if (iv.length === 0 || (iv.length === 1 && iv[0] !== out[k].v)) return null;
  }
  const vars = [...new Set(out.filter((t) => t.v).map((t) => t.v))];
  return { toks: out, vars };
}

// ---------- kompleksna aritmetika [re, im] ----------
const C = (re, im = 0) => [re, im];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const div = (a, b) => {
  const d = b[0] * b[0] + b[1] * b[1];
  return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d];
};
const mod = (a) => Math.hypot(a[0], a[1]);
const real = (f) => (a) => (Math.abs(a[1]) > 1e-12 ? [NaN, NaN] : C(f(a[0])));
function pow(a, b) {
  if (b[1] === 0 && Number.isInteger(b[0]) && Math.abs(b[0]) <= 64) {
    let r = C(1);
    for (let k = 0; k < Math.abs(b[0]); k++) r = mul(r, a);
    return b[0] < 0 ? div(C(1), r) : r;
  }
  if (a[1] === 0 && b[1] === 0 && a[0] >= 0) return C(a[0] ** b[0]);
  if (a[1] === 0 && b[1] === 0) return [NaN, NaN];
  const r = mod(a), th = Math.atan2(a[1], a[0]);
  const lr = Math.log(r);
  const re = b[0] * lr - b[1] * th, im = b[1] * lr + b[0] * th;
  return [Math.exp(re) * Math.cos(im), Math.exp(re) * Math.sin(im)];
}
const F = {
  sqrt: (a) => (a[1] === 0 && a[0] >= 0 ? C(Math.sqrt(a[0])) : a[1] === 0 ? [NaN, NaN] : pow(a, C(0.5))),
  abs: (a) => C(mod(a)),
  conj: (a) => [a[0], -a[1]],
  sin: real(Math.sin), cos: real(Math.cos), tan: real(Math.tan), cot: real((x) => 1 / Math.tan(x)),
  sinsq: real((x) => Math.sin(x) ** 2), cossq: real((x) => Math.cos(x) ** 2), tansq: real((x) => Math.tan(x) ** 2), cotsq: real((x) => 1 / Math.tan(x) ** 2),
  ln: real(Math.log), log: real(Math.log10), exp: real(Math.exp),
};

export function evalToks(toks, env) {
  let i = 0;
  const peek = () => toks[i];
  const isStart = (t) => t && (t.n !== undefined || t.v || t.c || t.f || t.o === "(");
  function atom() {
    const t = toks[i++];
    if (!t) throw 0;
    if (t.n !== undefined) return C(t.n);
    if (t.c === "pi") return C(Math.PI);
    if (t.c === "e") return C(Math.E);
    if (t.c === "i") return C(0, 1);
    if (t.v) {
      if (!(t.v in env)) throw 0;
      return env[t.v];
    }
    if (t.o === "(") {
      const v = sum();
      if (toks[i++]?.o !== ")") throw 0;
      return v;
    }
    if (t.f) {
      if (t.f === "root") {
        if (toks[i++]?.o !== "(") throw 0;
        const n = sum();
        if (toks[i++]?.o !== ",") throw 0;
        const a = sum();
        if (toks[i++]?.o !== ")") throw 0;
        return a[1] === 0 && n[1] === 0 && a[0] < 0 && n[0] % 2 === 1 ? C(-((-a[0]) ** (1 / n[0]))) : pow(a, C(1 / n[0]));
      }
      // \sin x, \sin(2x), \sin 2x: argument je naslednji faktor brez potence
      const arg = peek()?.o === "(" ? atom() : implicitProduct(true);
      return F[t.f](arg);
    }
    throw 0;
  }
  function power() {
    const b = atom();
    if (peek()?.o === "^") {
      i++;
      return pow(b, unary());
    }
    return b;
  }
  function unary() {
    if (peek()?.o === "-") return (i++, mul(C(-1), unary()));
    if (peek()?.o === "+") return (i++, unary());
    return power();
  }
  // Zapored brez znaka: 2ab, 3(x+1), x y
  function implicitProduct(fnArg = false) {
    let v = unary();
    while (isStart(peek()) && !(fnArg && peek().f)) v = mul(v, power());
    return v;
  }
  function product() {
    let v = implicitProduct();
    while (peek()?.o === "*" || peek()?.o === "/") v = toks[i++].o === "*" ? mul(v, implicitProduct()) : div(v, implicitProduct());
    return v;
  }
  function sum() {
    let v = product();
    while (peek()?.o === "+" || peek()?.o === "-") v = toks[i++].o === "+" ? add(v, product()) : sub(v, product());
    return v;
  }
  try {
    const v = sum();
    if (i !== toks.length || !v.every(Number.isFinite)) return null;
    return v;
  } catch {
    return null;
  }
}

// Psevdonaključna števila (ponovljiv izid preverjanja).
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}
const close = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]) <= 1e-7 * Math.max(1, mod(a), mod(b));

// Ali sta dela enaka za vse vrednosti neznank? true / false / null (ne zna izračunati).
function identical(L, R, extraEnv = {}) {
  const vars = [...new Set([...L.vars, ...R.vars])];
  const rand = rng(vars.join().length * 7919 + 17);
  let tried = 0;
  for (let k = 0; k < 6 && tried < 3; k++) {
    const env = { ...extraEnv };
    for (const v of vars) if (!(v in env)) env[v] = C(0.6 + 2.4 * rand());
    const a = evalToks(L.toks, env), b = evalToks(R.toks, env);
    if (!a || !b) continue;
    tried++;
    if (!close(a, b)) return false;
  }
  return tried ? true : null;
}

// Vrednost dela, ki je enak za vse vrednosti neznank (sin²x + cos²x → 1), sicer null.
function constantValue(P) {
  const rand = rng(P.vars.join().length * 104729 + 3);
  let first = null, tried = 0;
  for (let k = 0; k < 8 && tried < 4; k++) {
    const env = {};
    for (const v of P.vars) env[v] = C(0.6 + 2.4 * rand());
    const a = evalToks(P.toks, env);
    if (!a) continue;
    tried++;
    if (!first) first = a;
    else if (!close(first, a)) return null;
  }
  return tried >= 3 ? first : null;
}

// Vrednost pri danih številih (rešitve iz primera): true / false / null.
function holdsAt(L, R, env) {
  if (![...L.vars, ...R.vars].every((v) => v in env)) return null;
  const a = evalToks(L.toks, env), b = evalToks(R.toks, env);
  if (!a || !b) return null;
  return Math.hypot(a[0] - b[0], a[1] - b[1]) <= 0.02 * Math.max(1, mod(a), mod(b));
}

// Vstavi definicije (z = a + bi) v oznake, ki jih ena stran ima, druga pa ne.
function expand(P, defs, keep) {
  const toks = [];
  for (const t of P.toks) {
    if (t.v && defs[t.v] && !keep.has(t.v)) toks.push({ o: "(" }, ...defs[t.v].toks, { o: ")" });
    else toks.push(t);
  }
  return { toks, vars: [...new Set(toks.filter((t) => t.v).map((t) => t.v))] };
}

const sameVars = (A, B) => A.vars.length === B.vars.length && A.vars.every((v) => B.vars.includes(v));
const bareSymbol = (P) => P.toks.length === 1 && !!P.toks[0].v;
const numeric = (P) => P.vars.length === 0;

export function checkIdentities(body, { complex } = {}) {
  // Vrstice :::simboli (oznaka | ime | zveza | enota | opomba): zveza je formula brez $…$.
  let inSym = false;
  const text = String(body ?? "")
    .split("\n")
    .map((l) => {
      if (/^:::simboli\s*$/.test(l)) return ((inSym = true), "");
      if (inSym && /^:::\s*$/.test(l)) return ((inSym = false), "");
      if (!inSym) return l;
      const rel = l.split("|")[2]?.trim();
      return rel && rel !== "–" && rel !== "-" ? `$${rel}$` : "";
    })
    .join("\n");
  // Kompleksna enota: i (matematika) ali j (elektrotehnika, jωL).
  const cx = complex ?? (/j\s*\\omega/.test(text) ? "j" : /kompleksn|i\^2\s*=\s*-\s*1/i.test(text));
  const lines = text.split("\n");
  const matrices = /matrik|matrič/i.test(text);
  const skip = [];
  let skipSection = false;
  // V rešenih primerih so enačbe (5t = 20 + 1,5t): tam preverimo le rešitve, ne identitet.
  const example = [];
  let inExample = false;
  let sectionTitle = "";
  lines.forEach((l, i) => {
    const h = l.match(/^## +(.*)/);
    if (h) {
      sectionTitle = h[1].trim();
      skipSection = /^(pogoste|preveri)/i.test(h[1].trim());
      inExample = /^rešen/i.test(h[1].trim());
    }
    // V »Preveri se« preverimo pravilni odgovor (+) in razlago (>), ne napačnih možnosti in vprašanj.
    const quizKey = /^preveri/i.test(sectionTitle) && /^[+>] /.test(l);
    skip[i] = (skipSection && !quizKey) || SKIP_LINE.test(l);
    example[i] = inExample || (quizKey && l.startsWith(">")) || EQUATION_LINE.test(l);
  });
  // Formule z vrstico in »primerom« (blok med naslovi ###/## ali pragom 12 vrstic)
  const formulas = [];
  const lineStart = [];
  let acc = 0;
  for (const l of lines) (lineStart.push(acc), (acc += l.length + 1));
  const lineOf = (idx) => {
    let lo = 0, hi = lineStart.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lineStart[mid] <= idx) lo = mid;
      else hi = mid - 1;
    }
    return lo;
  };
  const re = /\$\$([\s\S]+?)\$\$|(^|[^\\$])\$([^$\n]+?)\$/g;
  let m;
  while ((m = re.exec(text))) {
    const line = lineOf(m.index + (m[2] ? m[2].length : 0));
    for (const tex of splitFormulas(m[1] ?? m[3])) formulas.push({ tex, line });
  }
  const block = (line) => {
    let b = 0;
    for (let k = 0; k <= line; k++) if (/^#{2,4} /.test(lines[k])) b = k;
    return b;
  };
  // Definicije (z = a + bi) in rešitve (x = 2, x_1 = -3) po blokih
  const defList = [];
  const sols = {};
  for (const f of formulas) {
    const parts = f.tex.split(/=/);
    if (parts.length < 2) continue;
    const L = parseTex(parts[0], { complex: cx });
    if (!L || !bareSymbol(L)) continue;
    const name = L.toks[0].v;
    const R = parseTex(parts[parts.length - 1], { complex: cx });
    if (!R) continue;
    if (numeric(R)) {
      const v = evalToks(R.toks, {});
      if (v) ((sols[block(f.line)] ||= {})[name] ||= []).push(v);
    } else if (!R.vars.includes(name) && !skip[f.line]) {
      const R1 = parseTex(parts[1], { complex: cx });
      // Definicije vstavljamo le za kompleksna števila (z = a + bi) in zaporedja (a_n = …): v fiziki je
      // ista oznaka v različnih primerih različna količina (R zaporedno ali vzporedno).
      if (R1 && !numeric(R1) && !R1.vars.includes(name) && (R1.toks.some((t) => t.c === "i") || /^[a-z]_n$/.test(name))) defList.push({ line: f.line, name, P: R1 });
    }
  }
  // Zadnja definicija vsake oznake pred vrstico (zaporedja imajo a_n v vsakem primeru drugačen).
  const defsAt = (line) => {
    const d = {};
    for (const x of defList) if (x.line <= line) d[x.name] = x.P;
    return d;
  };
  const solEnvs = (b) => {
    const s = sols[b];
    if (!s) return [];
    // x_1, x_2 so tudi rešitve za x
    const base = {};
    for (const [k, vs] of Object.entries(s)) {
      const root = k.replace(/_\w+$/, "");
      (base[k] ||= []).push(...vs);
      if (root !== k) (base[root] ||= []).push(...vs);
    }
    const keys = Object.keys(base);
    const envs = [];
    const n = Math.max(...keys.map((k) => base[k].length));
    for (let j = 0; j < n; j++) envs.push(Object.fromEntries(keys.map((k) => [k, base[k][Math.min(j, base[k].length - 1)]])));
    return envs;
  };

  let checked = 0;
  const mismatches = [];
  for (const f of formulas) {
    if (skip[f.line] || !SEP.test(f.tex) || SKIP_TEX.test(f.tex)) continue;
    const parts = f.tex.split(SEP).map((p) => parseTex(p, { complex: cx }));
    for (let k = 0; k + 1 < parts.length; k++) {
      const L = parts[k], R = parts[k + 1];
      if (!L || !R || bareSymbol(L) || bareSymbol(R)) continue;
      const hasI = (P) => P.toks.some((t) => t.c === "i");
      // Čisto številske dele preračuna lesson-math.js; tu le tiste s kompleksno enoto i.
      if (numeric(L) && numeric(R) && !(hasI(L) || hasI(R))) continue;
      // Zakon ali zveza med različnimi količinami (P = F s / t = F v) ni identiteta: primerjamo le dela z
      // enakimi oznakami (po vstavljenih definicijah iz lekcije, z · z̄ → (a + bi)(a − bi)).
      if (example[f.line] && !(numeric(L) && numeric(R))) continue;
      // Matrike ne komutirajo (A^3 = 5A^2 − 6A): v lekcijah o matrikah ne preverjamo velikih črk.
      if (matrices && [...L.vars, ...R.vars].some((v) => /^[A-Z]/.test(v))) continue;
      // Enačba ali vstavljanje (3x = 6) ni identiteta; rešitve v primerih preverjajo pregledovalci. Stran, ki je
      // za vse vrednosti enaka (sin²x + cos²x), pa mora biti enaka številu na drugi strani.
      if (numeric(L) !== numeric(R)) {
        const V = numeric(L) ? R : L;
        const c = constantValue(V);
        if (!c) continue;
        checked++;
        const n = evalToks((numeric(L) ? L : R).toks, {});
        if (!n || close(c, n)) continue;
        const raw = f.tex.split(SEP);
        mismatches.push({ line: f.line + 1, tex: f.tex.trim().slice(0, 90), left: raw[k].trim().slice(0, 40), right: raw[k + 1].trim().slice(0, 40) });
        continue;
      }
      const defs = defsAt(f.line);
      let A = L, B = R;
      if (!sameVars(A, B)) {
        A = expand(L, defs, new Set(R.vars));
        B = expand(R, defs, new Set(L.vars));
        if (!sameVars(A, B)) continue;
      }
      let ok = identical(A, B);
      if (ok === null) continue;
      checked++;
      if (ok) continue;
      // Enačba v primeru: drži pri rešitvah istega bloka?
      if (solEnvs(block(f.line)).some((env) => holdsAt(L, R, env))) continue;
      const raw = f.tex.split(SEP);
      mismatches.push({ line: f.line + 1, tex: f.tex.trim().slice(0, 90), left: raw[k].trim().slice(0, 40), right: raw[k + 1].trim().slice(0, 40) });
    }
  }
  return { checked, mismatches };
}
