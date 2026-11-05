// Vnos znanstvenega kalkulatorja kot lep zapis s kazalcem (j, 5. 11.: »nikjer v kalkulatorju naj ne bo viden surov vnos«).
// Zapis se izriše iz pravega besedila po isti poti kot rezultat (ukazi CAS, M(H2O), lastne funkcije, decimalna vejica
// po jeziku: analyzeLive z env). Kazalec NI del besedila: v izrisan TeX se vstavi kot samostojen atom na meji žetona,
// zato ne sodeluje pri množenju, potencah, številih ali imenih funkcij (zapis brez kazalca = zapis besedila).
// Nedokončano besedilo (odprt oklepaj, operator na koncu) se pred izrisom dokonča: oklepaji se zaprejo, manjkajoči
// operand je prazen okvirček □ (v izraz ga vstavimo kot število, ki ga v TeX zamenjamo z □, da se operator vidi).
// Brez DOM; test/sci-vnos.test.js.
import { previewTex, analyze } from "./scisolve.js";
import { evaluate, functionDef } from "./scicore.js";
import { parseCommand } from "./cas.js";
import { chemSub } from "./molska.js";

// Barvi kazalca in okvirčka sta v graph.css (.sc-caret, .sc-hole: CSS spremenljivke, tudi temna tema).
export const CARET = "{\\htmlClass{sc-caret}{\\rule[-0.25em]{0.08em}{1.15em}}}";
export const HOLE = "\\htmlClass{sc-hole}{\\square}";
/** KaTeX `trust` za zapis vnosa: samo oznaki kazalca/okvirčka (htmlClass) in merilne točke (htmlData). */
export const TRUST = (c) => c.command === "\\htmlClass" || c.command === "\\htmlData";

// ---------- ista pot kot sproten predogled (prej v sci.js) ----------

/** M(H2SO4) v vnosu je molska masa (molska.js): fn dobi vnos s spremenljivkami namesto M(…). */
export function withChem(text, fn, env = {}, extra) {
  const k = chemSub(text);
  if (!k) return fn(text, { ...env, ...extra });
  const r = k.fix(fn(k.text, { ...env, ...extra, vars: { ...(env.vars || {}), ...k.vars } }));
  // »M(NaCl) = 58,44« je preverjanje, ne shranjevanje v spremenljivko
  if (r?.assign?.startsWith("M_kem")) return { kind: "bool", value: Math.abs(r.value - k.vars[r.assign]) < 1e-9 * Math.max(1, Math.abs(r.value)), tex: r.tex };
  // molska masa je merjena vrednost: rezultat samo decimalno (ne 249677/1000)
  return r && typeof r === "object" ? { ...r, approx: true, exact: undefined } : r;
}

/** Sproten predogled ne rešuje enačb in neenačb (rešitev pride ob =): samo račun, odvod, kompleksno število, ukaz CAS. */
export function analyzeLive(text, env = {}) {
  // limita(f; x; a), taylor(f; x; a; n), det([[a; b]; [c; d]]): podpičje loči argumente oziroma elemente
  const cmd = parseCommand(text);
  if (cmd && ["integrate", "limit", "taylor", "det", "inverse"].includes(cmd.op) && !/[=<>≤≥]/.test(text)) return analyze(text, { ...env, live: true });
  if (/[=<>≤≥;]/.test(text) && !functionDef(text)) {
    const r = withChem(text, evaluate, env);
    if (r && !r.error) return { kind: "value", ...r };
    const tex = withChem(text, previewTex, env);
    return tex ? { kind: "solve", tex } : null;
  }
  return withChem(text, analyze, env, { live: true });
}

/** TeX besedila po poti predogleda; null, če ga ni mogoče razčleniti. */
export function liveTex(text, env = {}) {
  let r = null;
  try {
    r = analyzeLive(text, env);
  } catch {}
  if (r && !r.error && typeof r.tex === "string" && r.tex) return r.tex;
  // ukaz, ki ga CAS (še) ne zna: ime ukaza kot ime, ne kot črke r·a·z…
  const cmd = /^\s*([A-Za-zčšž]+)\s*\((.*)\)\s*$/s.exec(text);
  if (cmd && parseCommand(text)) {
    const inner = cmd[2].split(";").map((p) => (p.trim() ? previewTex(p, env) : null));
    if (inner.every(Boolean)) return `\\operatorname{${cmd[1]}}\\left(${inner.join(",\\ ")}\\right)`;
  }
  try {
    return withChem(text, previewTex, env) || null;
  } catch {
    return null;
  }
}

// ---------- dokončanje nedokončanega besedila ----------

const OPENERS = "([";
const CLOSERS = ")]";
const OPS = "+-−×÷*/^·=<>≤≥,.";

/**
 * Dokonča besedilo za izris: zapre oklepaje in na mesto manjkajočega operanda vstavi `hole`.
 * Vrne { text, at } (at(p): položaj v dokončanem besedilu za položaj p v izvirnem; okvirček na p je ZA kazalcem).
 */
export function complete(text, hole) {
  const src = String(text ?? "");
  const stack = [];
  for (const c of src) {
    if (OPENERS.includes(c)) stack.push(c === "(" ? ")" : "]");
    else if (CLOSERS.includes(c) && stack.length) stack.pop();
  }
  const s = src + stack.reverse().join("");
  let out = "";
  const shift = new Array(s.length + 1).fill(0); // koliko znakov okvirčkov je pred položajem i (brez tistih NA i)
  let added = 0;
  for (let i = 0; i <= s.length; i++) {
    shift[i] = added;
    const c = s[i];
    if (i === s.length || CLOSERS.includes(c) || c === ";") {
      let k = i - 1;
      while (k >= 0 && /\s/.test(s[k])) k--;
      const p = k >= 0 ? s[k] : "";
      if (p && (OPENERS.includes(p) || p === ";" || OPS.includes(p)) && !(i === s.length && !OPS.includes(p))) {
        out += hole;
        added += hole.length;
      }
    }
    if (i < s.length) out += c;
  }
  return { text: out, at: (p) => Math.max(0, Math.min(src.length, p)) + shift[Math.max(0, Math.min(src.length, p))] };
}

// ---------- žetoni TeX ----------

const PREFIX = { frac: 2, dfrac: 2, tfrac: 2, binom: 2, dbinom: 2, tbinom: 2, sqrt: 1, mathrm: 1, mathbf: 1, mathit: 1, mathsf: 1, boldsymbol: 1, overline: 1, underline: 1, vec: 1, hat: 1, bar: 1, tilde: 1, dot: 1, ddot: 1, widehat: 1, overrightarrow: 1 };
const OPAQUE = { operatorname: 1, text: 1, textrm: 1, textbf: 1, textit: 1, mbox: 1, color: 1, rule: 2, begin: 1, end: 1, htmlClass: 1, htmlData: 1 };
const BIGOP = new Set(["int", "iint", "iiint", "oint", "sum", "prod", "lim", "limsup", "liminf", "max", "min", "sup", "inf", "bigcup", "bigcap"]);
const NOKEY = new Set(["quad", "qquad", "nobreak", "displaystyle", "textstyle", "scriptstyle", "limits", "nolimits", "cdots", "ldots", "dots", "to", "mapsto"]);
const CW = { cdot: "*", times: "*", ast: "*", div: "/", le: "≤", leq: "≤", ge: "≥", geq: "≥", ne: "≠", neq: "≠", infty: "∞", pm: "±", circ: "°", degree: "°", approx: "≈", lt: "<", gt: ">", mid: "|", vert: "|", lbrack: "[", rbrack: "]" };
const DELIM = /^\\(left|right|bigl|bigr|Bigl|Bigr|biggl|biggr|big|Big|bigg|Bigg|middle)$/;
const DKEY = { "(": "(", ")": ")", "[": "[", "]": "]", "|": "|", "\\|": "|", "\\{": "(", "\\}": ")", "\\lvert": "|", "\\rvert": "|", "\\lfloor": "(", "\\rfloor": ")", "\\lceil": "(", "\\rceil": ")", "\\langle": "(", "\\rangle": ")" };

function groupEnd(tex, j, open = "{", close = "}") {
  let d = 0;
  for (; j < tex.length; j++) {
    if (tex[j] === "\\") {
      j++;
      continue;
    }
    if (tex[j] === open) d++;
    else if (tex[j] === close && --d === 0) return j + 1;
  }
  return tex.length;
}

/** Razbije TeX v žetone; vsak ima ključe (kaj predstavlja v besedilu) in vrsto (kje je kazalec dovoljen). */
export function lex(tex, hole = "") {
  const toks = [];
  const push = (s, keys, kind, extra) => toks.push({ s, keys: [...keys].filter(Boolean), kind, ...extra });
  let i = 0;
  while (i < tex.length) {
    const c = tex[i];
    if (tex.startsWith("{,}", i)) {
      push("{,}", ["."], "ord");
      i += 3;
      continue;
    }
    if (hole && tex.startsWith(hole, i) && !/\d/.test(tex[i - 1] || "") && !/\d/.test(tex[i + hole.length] || "")) {
      push(hole, ["□"], "hole");
      i += hole.length;
      continue;
    }
    if (c === "\\") {
      const m = /^\\([A-Za-z]+)/.exec(tex.slice(i, i + 40));
      if (!m) {
        const s = tex.slice(i, i + 2);
        const k = { "\\{": "(", "\\}": ")", "\\|": "|", "\\%": "%" }[s];
        push(s, k ? [k] : [], /^\\[,;:! ]$/.test(s) ? "space" : s === "\\\\" ? "sep" : "ord");
        i += 2;
        continue;
      }
      const name = m[1];
      let j = i + m[0].length;
      if (DELIM.test(`\\${name}`)) {
        let k = j;
        while (tex[k] === " ") k++;
        const d = /^(\\[A-Za-z]+|\\.|.)/s.exec(tex.slice(k))?.[0] || "";
        j = k + d.length;
        push(tex.slice(i, j), DKEY[d] ? [DKEY[d]] : [], "ord");
        i = j;
        continue;
      }
      if (name in OPAQUE) {
        let content = "";
        if (name === "rule" && tex[j] === "[") j = groupEnd(tex, j, "[", "]");
        for (let a = 0; a < OPAQUE[name]; a++) {
          while (tex[j] === " ") j++;
          if (tex[j] !== "{") break;
          const e = groupEnd(tex, j);
          content += tex.slice(j + 1, e - 1);
          j = e;
        }
        const keys = /^(operatorname|text|textrm|textbf|textit|mbox)$/.test(name) ? content.replace(/\\[A-Za-z]+/g, "").replace(/[^\p{L}\p{N}]/gu, "") : "";
        push(tex.slice(i, j), keys, name === "color" ? "space" : name === "begin" || name === "end" ? "sep" : "ord");
        i = j;
        continue;
      }
      const kind = name in PREFIX ? "prefix" : BIGOP.has(name) ? "bigop" : name === "limits" || name === "nolimits" ? "limits" : NOKEY.has(name) ? "space" : "ord";
      const keys = NOKEY.has(name) ? "" : CW[name] ?? name;
      push(m[0], keys, kind, { name, arity: PREFIX[name] || 0 });
      i = j;
      continue;
    }
    if (/\s/.test(c)) push(c, "", "space");
    else if (c === "^" || c === "_") push(c, c, "prefix", { name: c, arity: 1 });
    else if (c === "{") push(c, "", "open");
    else if (c === "}") push(c, "", "close");
    else if (c === "&") push(c, "", "sep");
    else push(c, c === "," ? ";" : c === "−" ? "-" : c, "ord");
    i++;
  }
  // argumenti ukazov: zaviti oklepaji argumentov niso samostojni (kazalec ne sme stati pred njimi)
  const match = (j) => {
    let d = 0;
    for (; j < toks.length; j++) {
      if (toks[j].kind === "open") d++;
      else if (toks[j].kind === "close" && --d === 0) return j;
    }
    return toks.length - 1;
  };
  const skip = (j) => {
    while (j < toks.length && toks[j].kind === "space") j++;
    return j;
  };
  toks.forEach((t, ti) => {
    if (!t.arity) return;
    let j = skip(ti + 1);
    if (t.name === "sqrt" && toks[j]?.s === "[") {
      toks[j].argOpen = true;
      while (j < toks.length && toks[j].s !== "]") j++;
      if (toks[j]) toks[j].optClose = true;
      j = skip(j + 1);
    }
    for (let a = 0; a < t.arity && j < toks.length; a++) {
      j = skip(j);
      if (toks[j].kind === "open") {
        const e = match(j);
        toks[j].argOpen = true;
        toks[j].keys = /frac$/.test(t.name) && a === 1 ? ["/"] : ["("];
        toks[e].keys = [")"];
        j = e + 1;
      } else {
        toks[j].argTok = true;
        j++;
      }
    }
  });
  return toks;
}

/** Ali je med žetonoma i−1 in i lahko samostojen atom (kazalec), ne da bi spremenil zapis? */
export function canInsert(toks, i) {
  let a = i - 1;
  while (a >= 0 && toks[a].kind === "space") a--;
  let b = i;
  while (b < toks.length && toks[b].kind === "space") b++;
  const P = toks[a];
  const N = toks[b];
  if (P && (P.kind === "prefix" || P.optClose)) return false;
  if (N && (N.argOpen || N.argTok || N.kind === "limits")) return false;
  // pred ^ in _ le za navadnim znakom (potenca se nato drži kazalca, osnova ostane ista); nikoli za ∫, lim
  if (N && (N.s === "^" || N.s === "_") && (!P || /^(open|bigop|limits|sep)$/.test(P.kind))) return false;
  return true;
}

// ---------- ujemanje besedila in TeX ----------

const SUP = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-", "⁺": "+" };
const TKEY = { "π": "pi", "√": "sqrt", "∛": "sqrt", "∫": "int", "×": "*", "·": "*", "⋅": "*", "÷": "/", "−": "-", ",": ".", "∞": "∞" };

function textAtoms(s, hole) {
  const out = [];
  for (let i = 0; i < s.length; i++) {
    if (hole && s.startsWith(hole, i) && !/\d/.test(s[i - 1] || "") && !/\d/.test(s[i + hole.length] || "")) {
      out.push({ k: "□", s: i, e: i + hole.length });
      i += hole.length - 1;
      continue;
    }
    const c = s[i];
    if (/\s/.test(c)) continue;
    // x³ ali x⁻¹: potenca kot ^(…), da se kazalec za njo postavi ZA eksponent
    const keys = c in SUP ? (s[i - 1] in SUP ? "" : "^(") + SUP[c] + (s[i + 1] in SUP ? "" : ")") : TKEY[c] ?? c;
    for (const k of keys) out.push({ k, s: i, e: i + 1 });
  }
  return out;
}

function texAtoms(toks) {
  const out = [];
  toks.forEach((t, ti) => t.keys.forEach((k, n) => out.push({ k, t: ti, first: n === 0, last: n === t.keys.length - 1 })));
  return out;
}

/** Najdaljše skupno podzaporedje ključev: za vsak atom besedila indeks atoma TeX ali −1. */
function align(A, B) {
  const n = A.length;
  const m = B.length;
  const W = m + 1;
  const dp = new Uint16Array((n + 1) * W);
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--) dp[i * W + j] = A[i].k === B[j].k ? dp[(i + 1) * W + j + 1] + 1 : Math.max(dp[(i + 1) * W + j], dp[i * W + j + 1]);
  const to = new Array(n).fill(-1);
  for (let i = 0, j = 0; i < n && j < m; ) {
    if (A[i].k === B[j].k && dp[i * W + j] === dp[(i + 1) * W + j + 1] + 1) to[i++] = j++;
    else if (dp[(i + 1) * W + j] >= dp[i * W + j + 1]) i++;
    else j++;
  }
  return to;
}

/**
 * Pripravi zapis vnosa (brez kazalca). `render(text)` vrne TeX dokončanega besedila (privzeto liveTex z env).
 * Vrne { ok, tex, ... } za caretTex in caretStops.
 */
export function entryBase(text, env = {}, render = (s) => liveTex(s, env)) {
  const raw = String(text ?? "");
  if (!raw.trim()) return null;
  const hole = ["7777", "8888", "9999", "6666", "5555", "4444"].find((h) => !raw.includes(h)) || "";
  const done = complete(raw, hole);
  let tex = null;
  try {
    tex = render(done.text);
  } catch {}
  if (!tex) return { ok: false, raw };
  const toks = lex(tex, hole);
  const A = textAtoms(done.text, hole);
  const B = texAtoms(toks);
  const to = align(A, B);
  // položaj kazalca → mesto v žetonih (najbližji ujeti atom levo ali desno, kjer je atom lahko samostojen)
  const place = (p) => {
    const q = done.at(p);
    const c = [];
    A.forEach((a, i) => {
      if (to[i] < 0) return;
      const b = B[to[i]];
      if (a.e <= q && b.last) c.push([q - a.e, 0, -i, b.t + 1]);
      if (a.s >= q && b.first) c.push([a.s - q, 1, i, b.t]);
    });
    // najbližji atom; pri enaki razdalji levi, med levimi zadnji (x³| je za eksponentom, ne v njem)
    c.sort((x, y) => x[0] - y[0] || x[1] - y[1] || x[2] - y[2]);
    let rank = 0;
    for (const [, , , at] of c) {
      if (canInsert(toks, at)) return { at, rank };
      rank++;
    }
    return { at: q === 0 ? 0 : toks.length, rank: 99 };
  };
  return { ok: true, raw, tex, toks, place, hole };
}

const join = (base, ins) => {
  let s = "";
  base.toks.forEach((t, i) => {
    if (ins.has(i)) s += ins.get(i);
    s += t.kind === "hole" ? HOLE : t.s;
  });
  if (ins.has(base.toks.length)) s += ins.get(base.toks.length);
  return s;
};

/** TeX zapisa s kazalcem na položaju p (v izvirnem besedilu). */
export function caretTex(base, p) {
  if (!base) return null;
  if (!base.ok) {
    // nerazčlenljivo: besedilo v matematični pisavi, kazalec na mestu
    const esc = (x) => x.replace(/[\\{}$&#^_%~]/g, (c) => `\\${c === "\\" ? "textbackslash " : c}`);
    const at = Math.max(0, Math.min(base.raw.length, p));
    return `\\text{${esc(base.raw.slice(0, at))}}${CARET}\\text{${esc(base.raw.slice(at))}}`;
  }
  return join(base, new Map([[base.place(p).at, CARET]]));
}

/** Vsa različna mesta kazalca: [{ p, at }] (za vsako mesto najbolj naraven položaj v besedilu). */
export function caretStops(base) {
  if (!base?.ok) return [];
  const best = new Map();
  for (let p = 0; p <= base.raw.length; p++) {
    const { at, rank } = base.place(p);
    const b = best.get(at);
    if (!b || rank < b.rank) best.set(at, { p, at, rank });
  }
  return [...best.values()].sort((x, y) => x.p - y.p);
}

/** TeX z merilno točko (htmlData evk-p) na vsakem mestu kazalca: dotik na lep zapis → položaj v besedilu. */
export function stopsTex(base) {
  const stops = caretStops(base);
  return join(base, new Map(stops.map((s) => [s.at, `{\\htmlData{evk-p=${s.p}}{\\rule{0em}{0.8em}}}`])));
}

/** Zapis vnosa s kazalcem: { ok, tex } ali null za prazen vnos. */
export function entryTex(text, caret = String(text ?? "").length, env = {}, render) {
  const base = entryBase(text, env, render);
  return base && { ok: base.ok, tex: caretTex(base, caret) };
}

/** Zapis brez kazalca in brez okvirčkov (za preverjanje): odstrani vstavljeni kazalec. */
export const stripCaret = (tex) => tex.split(CARET).join("");
