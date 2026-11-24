// Vnos znanstvenega kalkulatorja kot lep zapis s kazalcem (j, 5. 11.: »nikjer v kalkulatorju naj ne bo viden surov vnos«).
// Zapis se izriše iz pravega besedila po isti poti kot rezultat (ukazi CAS, M(H2O), lastne funkcije, decimalna vejica
// po jeziku: analyzeLive z env). Kazalec NI del besedila: v izrisan TeX se vstavi kot samostojen atom na meji žetona,
// zato ne sodeluje pri množenju, potencah, številih ali imenih funkcij (zapis brez kazalca = zapis besedila).
// Nedokončano besedilo (odprt oklepaj, operator na koncu) se pred izrisom dokonča: oklepaji se zaprejo, manjkajoči
// operand je prazen okvirček □ (v izraz ga vstavimo kot število, ki ga v TeX zamenjamo z □, da se operator vidi).
// Brez DOM; test/sci-vnos.test.js.
import { previewTex, analyze, exactIntegral } from "./scisolve.js";
import { evaluate, functionDef } from "./scicore.js";
import { parseCommand, COMMAND_NAMES } from "./cas.js";
import { BUILTINS } from "./math.js";
import { chemSub } from "./molska.js";

// Barvi kazalca in okvirčka sta v graph.css (.sc-caret, .sc-hole: CSS spremenljivke, tudi temna tema).
// \smash: črta kazalca ne sme dvigniti eksponenta, ko stoji pred ^ ali _ (odmik enak kot brez kazalca)
export const CARET = "{\\htmlClass{sc-caret}{\\smash{\\rule[-0.25em]{0.08em}{1.15em}}}}";
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
  env = { ...env, live: true }; // integrali v predogledu s kratko časovno mejo
  // limita(f; x; a), taylor(f; x; a; n), det([[a; b]; [c; d]]): podpičje loči argumente oziroma elemente
  const cmd = parseCommand(text);
  if (cmd && ["integrate", "limit", "taylor", "det", "inverse"].includes(cmd.op) && !/[=<>≤≥]/.test(text)) return analyze(text, { ...env, live: true });
  if (/[=<>≤≥;]/.test(text) && !functionDef(text)) {
    const r = withChem(text, evaluate, env);
    // ∫(1/√x; 0; 1): v predogledu isto kot ob Izračunaj (»= 2«, ne »≈ 2«)
    if (r && !r.error) return { kind: "value", ...(r.est ? exactIntegral(text, env, r) : r) };
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
    const op = parseCommand(text)?.op;
    // integral in limita z (še) prazno režo: zapis predloge, ne ime ukaza (»integriraj(t²; □)« → ∫ t² d□; AUDIT-004)
    if (inner.every(Boolean) && op === "integrate" && inner.length === 2) return `\\int ${inner[0]}\\,d${inner[1]}`;
    if (inner.every(Boolean) && op === "limit" && inner.length === 3) return `\\lim\\limits_{${inner[1]} \\to ${inner[2]}} ${inner[0]}`;
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
const POSTFIX = "²³⁻¹!%°′″"; // brez operanda pred seboj (√(² , ∫(⁻¹;;)) dobijo okvirček
const OPSX = OPS + "_"; // za indeksom manjka operand kot za operatorjem
const LEFT = "×÷*/^·=<>≤≥,._" + POSTFIX; // potrebujejo levi operand (predznaki + − ne)

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
  let s = src + stack.reverse().join("");
  // ∑_(n=1)^(10) brez telesa: telo je okvirček (predloga tipke ∑ in ∏, AUDIT-020); meje so lahko gnezdene
  const bigOp = (() => {
    const i = Math.max(s.lastIndexOf("∑"), s.lastIndexOf("∏"));
    if (i < 0) return -1;
    let j = i + 1;
    const group = (open) => {
      if (s[j] !== open[0] || s[j + 1] !== "(") return false;
      let d = 0;
      for (j += 1; j < s.length; j++) {
        if (s[j] === "(") d++;
        else if (s[j] === ")" && --d === 0) return ++j;
      }
      return false;
    };
    return group("_") && group("^") && /^[\s)\]]*$/.test(s.slice(j)) ? j : -1; // indeks za mejama ali −1
  })();
  // ∫( z manj kot dvema »;« (ročno natipkan »∫(«, »∫(x«, »∫(x;0«): pred zaklepajem manjkajoči reži (AUDIT-037)
  const intMissing = new Map();
  {
    const st = [];
    for (let i = 0; i < s.length; i++) {
      if (OPENERS.includes(s[i])) st.push({ int: s[i] === "(" && s[i - 1] === "∫", semis: 0 });
      else if (s[i] === ";" && st.length) st[st.length - 1].semis++;
      else if (CLOSERS.includes(s[i]) && st.length) {
        const g = st.pop();
        if (g.int && g.semis < 2) intMissing.set(i, 2 - g.semis);
      }
    }
  }
  let out = "";
  const shift = new Array(s.length + 1).fill(0); // koliko znakov okvirčkov je pred položajem i (brez tistih NA i)
  let added = 0;
  for (let i = 0; i <= s.length; i++) {
    shift[i] = added;
    const c = s[i];
    let k = i - 1;
    while (k >= 0 && /\s/.test(s[k])) k--;
    const p = k >= 0 ? s[k] : "";
    let want = false;
    if (i === s.length || CLOSERS.includes(c) || c === ";") want = !!p && (OPENERS.includes(p) || p === ";" || OPSX.includes(p)) && !(i === s.length && !OPSX.includes(p));
    // operator ali pripona brez levega operanda (izbrisan: »/2«, »²«, »,5«, »2x+=7«, »∑_(=1)«): okvirček pred njim (AUDIT-034)
    else if (LEFT.includes(c) && !(POSTFIX.includes(c) && POSTFIX.includes(s[i - 1] || "\u0000"))) want = !p || OPENERS.includes(p) || p === ";" || OPSX.includes(p);
    // predznak je lahko brez levega operanda, razen za vejico, piko ali indeksom (»2,+1«, »x_+x_2«); za vejico ali piko
    // mora biti števka (»1,E3«)
    else if ("+-−".includes(c)) want = !!p && ",._".includes(p);
    else if (c && p && ",.".includes(p) && !/[\d\s]/.test(c)) want = true;
    if (want) {
      out += hole;
      added += hole.length;
    }
    for (let m = intMissing.get(i) || 0; m > 0; m--) {
      out += `;${hole}`;
      added += 1 + hole.length;
    }
    if (i < s.length) out += c;
  }
  if (bigOp >= 0) out = `${out.slice(0, bigOp + shift[bigOp])} ${hole}${out.slice(bigOp + shift[bigOp])}`;
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
  // ne med mejama ∑_{…}^{…} (ali x_{1}^{2}): zgornja meja bi se prijela kazalca (AUDIT-003)
  if (N && (N.s === "^" || N.s === "_") && (!P || /^(open|close|bigop|limits|sep)$/.test(P.kind))) return false;
  return true;
}

// ---------- ujemanje besedila in TeX ----------

const SUP = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-", "⁺": "+" };
// grške črke kot v zapisu (math.js TEXVAR): kazalec za »α« je za \alpha (prej pred njo; pregled #974)
const TKEY = { "θ": "theta", "α": "alpha", "β": "beta", "γ": "gamma", "δ": "delta", "λ": "lambda", "μ": "mu", "φ": "varphi", "ω": "omega", "σ": "sigma", "ρ": "rho", "ε": "varepsilon", "τ": "tau", "π": "pi", "√": "sqrt", "∛": "sqrt", "∫": "int", "∑": "sum", "∏": "prod", "×": "*", "·": "*", "⋅": "*", "÷": "/", "−": "-", ",": ".", "∞": "∞" };

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

/**
 * Atomi besedila v vrstnem redu zapisa (AUDIT-003). Kjer zapis argumente prestavi, jih prestavimo tudi tu, da
 * ujemanje (align) poveže vsako režo s pravim delom zapisa:
 * ∫(f; a; b) → \int_{a}^{b} f\,dx, limita(f; x; a) → \lim_{x\to a} f, integriraj(f; x) → \int f\,dx.
 * Oklepaji in podpičja teh predlog v zapisu niso vidni, zato nimajo atomov; zaklepaj dobi »d x«, da je kazalec za
 * predlogo za dx (ne pred njim). Atomi obdržijo svoje položaje v besedilu (s, e), spremeni se le vrstni red.
 */
const SUP_CH = /[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]/;
function visualOrder(s, A) {
  const alias = new Map();
  const at = new Map();
  for (const a of A) at.has(a.s) ? at.get(a.s).push(a) : at.set(a.s, [a]);
  const closeOf = (o) => {
    let d = 0;
    for (let j = o; j < s.length; j++) {
      if (OPENERS.includes(s[j])) d++;
      else if (CLOSERS.includes(s[j]) && --d === 0) return j;
    }
    return -1;
  };
  // reže med oklepajem o in zaklepajem c: [[od, do), …]
  const slots = (o, c) => {
    const cut = [o];
    let d = 0;
    for (let j = o + 1; j < c; j++) {
      if (OPENERS.includes(s[j])) d++;
      else if (CLOSERS.includes(s[j])) d--;
      else if (s[j] === ";" && d === 0) cut.push(j);
    }
    cut.push(c);
    const g = cut.slice(0, -1).map((b, k) => [b + 1, cut[k + 1]]);
    // presledki na robu reže: kazalec je na začetku oziroma koncu njene vsebine (»limita(□; x; )«)
    for (const [b, e] of g) {
      let x = b;
      while (x < e && /\s/.test(s[x])) x++;
      for (let q = b; q < x && x < e; q++) alias.set(q, x);
      let y = e;
      while (y > x && /\s/.test(s[y - 1])) y--;
      for (let q = y + 1; q <= e && y > x; q++) alias.set(q, y);
    }
    return g;
  };
  const cm = /^\s*([A-Za-zčšž]+)\s*\(/.exec(s);
  let cmd = null;
  try {
    cmd = cm && parseCommand(s);
  } catch {}
  const out = [];
  let moved = false;
  const walk = (lo, hi) => {
    for (let i = lo; i < hi; ) {
      if (s[i] === "∫" && s[i + 1] === "(") {
        const c = closeOf(i + 1);
        const g = c > 0 && c < hi ? slots(i + 1, c) : null;
        if (g?.length === 3) {
          out.push(...(at.get(i) || []));
          alias.set(i + 1, i + 2); // med ∫ in oklepajem = začetek integranda
          walk(...g[1]);
          walk(...g[2]);
          walk(...g[0]);
          out.push({ k: "d", s: c, e: c + 1 }, { k: "x", s: c, e: c + 1 });
          moved = true;
          i = c + 1;
          continue;
        }
      }
      // sin(x)² in sin(x)^(2): zapis je \sin^{2}\left(x\right) – potenca pred oklepajem; kazalec za ² je za oklepajem
      const fn = /^(?:arcsin|arccos|arctan|sinh|cosh|tanh|sin|cos|tan|cot|ln|log)\(/.exec(s.slice(i));
      if (fn && !/[A-Za-z]/.test(s[i - 1] || "")) {
        const o = i + fn[0].length - 1;
        const c = closeOf(o);
        let e = -1;
        if (c > 0 && c < hi) {
          if (SUP_CH.test(s[c + 1] || "")) {
            e = c + 1;
            while (SUP_CH.test(s[e] || "")) e++;
          } else if (s[c + 1] === "^" && s[c + 2] === "(") {
            const cc = closeOf(c + 2);
            if (cc > 0 && cc < hi) e = cc + 1;
          }
        }
        if (e > 0) {
          for (let k = i; k < o; k++) out.push(...(at.get(k) || []));
          walk(c + 1, e);
          walk(o, c);
          // zaklepaj »konča« tudi potenco: kazalec na koncu (za ²) je za oklepajem, kjer je v zapisu konec
          out.push(...(at.get(c) || []).map((x) => ({ ...x, e })));
          moved = true;
          i = e;
          continue;
        }
      }
      if (i === cm?.index + cm?.[0].search(/\S/) && cmd && (cmd.op === "limit" || cmd.op === "integrate")) {
        const o = cm.index + cm[0].length - 1;
        const c = closeOf(o);
        const g = c > 0 && c < hi ? slots(o, c) : null;
        const ne = i + cm[1].length;
        // v imenu ukaza ali tik pred oklepajem = začetek prve reže (ime se ne razbije)
        const inName = () => { for (let q = i + 1; q <= o; q++) alias.set(q, o + 1); };
        if (g && cmd.op === "limit" && g.length === 3) {
          inName();
          out.push(...[..."lim"].map((k) => ({ k, s: i, e: ne })));
          walk(...g[1]);
          walk(...g[2]);
          walk(...g[0]);
          // za zaklepajem je kazalec za telesom limite (zadnja stvar v zapisu)
          alias.set(c + 1, g[0][1]);
          moved = true;
          i = c + 1;
          continue;
        }
        if (g && cmd.op === "integrate" && g.length <= 2) {
          inName();
          out.push(...[..."int"].map((k) => ({ k, s: i, e: ne })));
          walk(...g[0]);
          if (g[1] && s.slice(...g[1]).trim()) {
            out.push({ k: "d", s: g[1][0] - 1, e: g[1][0] });
            walk(...g[1]);
          } else out.push({ k: "d", s: c, e: c + 1 }, { k: "x", s: c, e: c + 1 });
          moved = true;
          i = c + 1;
          continue;
        }
      }
      out.push(...(at.get(i) || []));
      i++;
    }
  };
  walk(0, s.length);
  return { A: moved ? out : A, alias };
}

/**
 * abs(…) je v zapisu |…|: oklepaj in zaklepaj dobita ključ »|«, da se ujameta s \left| in \right|. Sicer kazalec na
 * koncu »abs(x−1)« stoji v zapisu znotraj črt (|x−1‸|), vnos pa gre zunaj (AUDIT-048).
 */
function absBars(s, A) {
  const bar = new Set();
  for (const m of s.matchAll(/(?<![A-Za-z])abs\s*\(/g)) {
    const o = m.index + m[0].length - 1;
    bar.add(o);
    const c = closeAt(s, o);
    if (c >= 0) bar.add(c);
  }
  return bar.size ? A.map((a) => (bar.has(a.s) && (a.k === "(" || a.k === ")") ? { ...a, k: "|" } : a)) : A;
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

/** Globina zavitih oklepajev {} pred žetonom i. */
function depthAt(toks, i) {
  let d = 0;
  for (let k = 0; k < i; k++) d += toks[k].kind === "open" ? 1 : toks[k].kind === "close" ? -1 : 0;
  return d;
}

/** TeX z vstavljenimi \left( in \right. za učenčeve odprte oklepaje, ki jih je previewTex odstranil; null, če ni kaj vstaviti. */
function openParens(end, A, to, toks) {
  const stack = [];
  const ins = []; // [indeks žetona, vrstni red (zaklepaj pred oklepajem), niz]
  A.forEach((a, i) => {
    if (a.k === "(" || a.k === "[") stack.push(i);
    else if ((a.k === ")" || a.k === "]") && stack.length) {
      const o = stack.pop();
      // učenčev zaklepaj ali oklepaj, ki je v zapisu že viden; end = konec učenčevega besedila v dokončanem
      // (okvirčki pred njim premaknejo položaje: det([[; ]; [; ]]) je bil zaprt, a je dobil \left( v matriki, AUDIT-020)
      if (a.s < end || to[o] >= 0) return;
      let first = -1;
      for (let j = o + 1; j < i; j++) if (to[j] >= 0) { first = j; break; }
      let last = -1;
      for (let j = i - 1; j > o; j--) if (to[j] >= 0) { last = j; break; }
      if (first < 0 || last < 0) return;
      const open = texAtoms(toks)[to[first]].t;
      const close = texAtoms(toks)[to[last]].t + 1;
      if (open >= close || depthAt(toks, open) !== depthAt(toks, close) || !canInsert(toks, open) || !canInsert(toks, close)) return;
      ins.push([open, 1, `\\left${A[o].k} `], [close, 0, "\\right."]);
    }
  });
  if (!ins.length) return null;
  ins.sort((x, y) => y[0] - x[0] || y[1] - x[1]);
  const parts = toks.map((t) => t.s);
  for (const [at, , str] of ins) parts.splice(at, 0, str);
  return parts.join("");
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
  let toks = lex(tex, hole);
  const { A, alias } = visualOrder(done.text, absBars(done.text, textAtoms(done.text, hole)));
  let B = texAtoms(toks);
  let to = align(A, B);
  // oklepaj, ki ga je učenec odprl, previewTex pa ga je kot nepotrebnega odstranil, mora ostati viden:
  // \left( … \right. (zaklepaj, ki ga je dodal complete, ni izrisan, da se vidi, da je oklepaj odprt)
  const fix = openParens(done.at(raw.length), A, to, toks);
  if (fix) {
    tex = fix;
    toks = lex(tex, hole);
    B = texAtoms(toks);
    to = align(A, B);
  }
  // položaj kazalca → mesto v žetonih (najbližji ujeti atom levo ali desno, kjer je atom lahko samostojen)
  const place = (p) => {
    const q0 = done.at(p);
    const q = alias.get(q0) ?? q0;
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
    for (const [dist, , , at] of c) {
      // preslikan položaj (v imenu ukaza, za zaklepajem limite) ni nikoli glavni položaj mesta
      if (canInsert(toks, at)) return { at, rank, dist: dist + (q !== q0 ? 1e3 : 0) };
      rank++;
    }
    return { at: q === 0 ? 0 : toks.length, rank: 99, dist: 99 };
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
    const { at, rank, dist = 0 } = base.place(p);
    const b = best.get(at);
    // mesto dobi položaj, ki se z njim ujema najbolje (najmanjši rang, nato najmanjša razdalja do atoma):
    // dotik na spodnjo mejo ∫ da položaj v spodnji meji, ne v integrandu (AUDIT-003)
    if (!b || rank < b.rank || (rank === b.rank && dist < b.dist)) best.set(at, { p, at, rank, dist });
  }
  // mesto, ki ga doseže le preslikan položaj (za praznim telesom limite), ni merilna točka: tam bi vnos šel za ukaz
  return [...best.values()].filter((s) => s.dist < 1e3).sort((x, y) => x.p - y.p);
}

/**
 * TeX z merilno točko (htmlData evk-p) na vsakem mestu kazalca: dotik na lep zapis → položaj v besedilu.
 * Točka je 0,4 em visoka (nižja od x in števk): ne spremeni višine zapisa (gnezdeni ulomki), točke števca in imenovalca
 * pa se navpično ne prekrivajo (z \smash so se in dotik na števec, ki ga Chromium premakne ~8 px, je padel v imenovalec).
 */
export function stopsTex(base) {
  // dotik nikoli ne postavi kazalca sredi imena ali odpirala (»d|/dx(«, »sin|(«): tam bi vnos ime pokvaril (AUDIT-004)
  // mesto v odpiralu, ki je v zapisu isto kot začetek odpirala (pred |x| iz »abs(«), dobi začetek, ne izgine (AUDIT-048)
  const stops = caretStops(base)
    .map((s) => {
      const o = openerAround(base.raw, s.p)?.[0];
      if (!(o < s.p)) return s;
      // za »×10« (pred ^): dotik na 0 postavi kazalec pred eksponent, ne za celo predlogo (AUDIT-048)
      if (s.p === o + 3 && base.raw.startsWith("×10^(", o)) return { ...s, p: o + 5 };
      return base.place(o).at === s.at ? { ...s, p: o } : null;
    })
    .filter(Boolean);
  return join(base, new Map(stops.map((s) => [s.at, `{\\htmlData{evk-p=${s.p}}{\\rule{0em}{0.4em}}}`])));
}

/** Zapis vnosa s kazalcem: { ok, tex } ali null za prazen vnos. */
export function entryTex(text, caret = String(text ?? "").length, env = {}, render) {
  const base = entryBase(text, env, render);
  return base && { ok: base.ok, tex: caretTex(base, caret) };
}

/** Zapis brez kazalca in brez okvirčkov (za preverjanje): odstrani vstavljeni kazalec. */
export const stripCaret = (tex) => tex.split(CARET).join("");

// ---------- brisanje in premik kazalca (AUDIT-004) ----------
// Ena pot za zaslonsko ⌫ in strojni Backspace/Delete: ime funkcije ali ukaza se nikoli ne razpolovi, predloga
// (∫(f;a;b), d/dx(…), limita(…), ∑_(…)^(…), det([[…]])) ne pusti ostankov (»integriraj)«, »;;)«, »)«).

const esc = (x) => x.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
const WORDS = [...new Set([...BUILTINS, ...COMMAND_NAMES, "Ans"])].filter((w) => w.length > 1).sort((a, b) => b.length - a.length);
// odpiralo predloge ali funkcije, ki se konča z oklepajem
const OPENER = new RegExp(`(?:×10\\^\\(|[∑∏]_\\(|d\\/dx\\(|[√∛∫]\\(|\\^\\(|_\\(|(?:${WORDS.map(esc).join("|")})\\s*\\()$`, "u");
const OPENER_AT = new RegExp(`^(?:×10\\^\\(|[∑∏]_\\(|d\\/dx\\(|[√∛∫]\\(|(?:${WORDS.map(esc).join("|")})\\s*\\()`, "u");
const WORD_CHAR = /[A-Za-zčšž]/;
// mesta, kjer kazalec ne sme stati (sredi imena ali odpirala). »×10^(« iz tipke ×10ˣ je enota kot ime: kazalec v »10« bi
// tiho spremenil število (2×1|0^(5) + ⌫ → 2×0^(5) = 0; AUDIT-048)
const OPENERS_ALL = new RegExp(`×10\\^\\(|[∑∏]_\\(|d\\/dx\\(|[√∛∫]\\(|(?:${WORDS.map(esc).join("|")})\\s*\\(`, "gu");

/** Zaklepaj za oklepajem na o (ali -1, če ni zaprt). */
function closeAt(s, o) {
  let d = 0;
  for (let j = o; j < s.length; j++) {
    if (OPENERS.includes(s[j])) d++;
    else if (CLOSERS.includes(s[j]) && --d === 0) return j;
  }
  return -1;
}
/** Reže med oklepajem o in zaklepajem c (c = -1: do konca). */
function slotsOf(s, o, c) {
  const end = c < 0 ? s.length : c;
  const out = [];
  let d = 0;
  let b = o + 1;
  for (let j = o + 1; j < end; j++) {
    if (OPENERS.includes(s[j])) d++;
    else if (CLOSERS.includes(s[j])) d--;
    else if (s[j] === ";" && d === 0) {
      out.push([b, j]);
      b = j + 1;
    }
  }
  out.push([b, end]);
  return out;
}
/** Najbližji odprt oklepaj levo od p (indeks) in odpiralo pred njim. */
function enclosing(s, p) {
  let d = 0;
  for (let j = p - 1; j >= 0; j--) {
    if (CLOSERS.includes(s[j])) d++;
    else if (OPENERS.includes(s[j])) {
      if (d === 0) {
        const m = OPENER.exec(s.slice(0, j + 1));
        return { o: j, start: m ? j + 1 - m[0].length : j, name: m ? m[0].replace(/\s*\($/, "") : s[j] };
      }
      d--;
    }
  }
  return null;
}
// predloge s stalnim številom rež: ločila se ne briše (∫(x;0) ni več integral), ⌫ gre v prejšnjo režo
const FIXED = (name) => name === "∫" || name === "[" || /^(limita|limit|lim|taylor)$/i.test(name);
const blank = (s, [a, b]) => !s.slice(a, b).replace(/[[\];\s]/g, "");
// privzete vrednosti predlog (sci.js anaKeys) štejejo kot prazne: prazno »limita(□; x; □)« se izbriše kot celota
const DEFAULTS = { limita: [, "x"], limit: [, "x"], lim: [, "x"], taylor: [, "x", "0", "5"] };
const emptySlot = (s, name, x, k) => blank(s, x) || s.slice(...x).trim() === DEFAULTS[name.toLowerCase()]?.[k];
const done = (text, pos) => ({ text, pos });

/** Ime (ali »Ans«), v katerem je položaj p (strogo znotraj), ali null: { start, end }. */
function wordAround(s, p) {
  if (!WORD_CHAR.test(s[p - 1] || "") || !WORD_CHAR.test(s[p] || "")) return null;
  let b = p;
  while (b < s.length && WORD_CHAR.test(s[b])) b++;
  let a = p;
  while (a > 0 && WORD_CHAR.test(s[a - 1])) a--;
  const run = s.slice(a, b);
  const x = WORDS.find((w) => run.endsWith(w) && b - w.length < p);
  return x ? { start: b - x.length, end: b } : null;
}

/** Odpiralo (ime z oklepajem, ∫(, d/dx( …), ki vsebuje položaj p ali se na njem začne: [začetek, konec) ali null. */
function openerAround(s, p) {
  for (const m of s.matchAll(OPENERS_ALL)) if (m.index <= p && p < m.index + m[0].length) return [m.index, m.index + m[0].length];
  return null;
}

/** Odstrani predlogo z odpiralom [start, o] in zaklepajem c; ohrani vsebino prve reže. */
function unwrap(s, start, o, c, keep) {
  const end = c < 0 ? s.length : c + 1;
  const inner = keep ? s.slice(o + 1, keep[1]) : "";
  return done(s.slice(0, start) + inner + s.slice(end), start);
}

/**
 * Izbira [s, e) razširjena tako, da ne zajame le dela imenovane predloge (∫(, sin(, limita(, d/dx(, √( …; AUDIT-039):
 * izbira je v eni reži, zajame celo predlogo ali je zunaj nje; sicer se razširi na celo predlogo z imenom. Navadni
 * oklepaji se ne razširijo (j, 24. 11.): pri njih deleteSpan obdrži oklepaj, ki bi ostal brez para. Vrne [s, e].
 */
export function selectionSpan(text, s, e) {
  const t = String(text ?? "");
  let a = Math.max(0, Math.min(s, e));
  let b = Math.min(t.length, Math.max(s, e));
  if (a === b) return [a, b];
  for (let changed = true, guard = 0; changed && guard < 50; guard++) {
    changed = false;
    for (let o = 0; o < t.length; o++) {
      if (!OPENERS.includes(t[o])) continue;
      const m = OPENER.exec(t.slice(0, o + 1));
      if (!m) continue; // navaden oklepaj ali [ matrike: brez razširitve
      const start = o + 1 - m[0].length;
      const c = closeAt(t, o);
      const end = c < 0 ? t.length : c + 1;
      if (b <= start || a >= end || (a <= start && b >= end)) continue; // zunaj ali cela
      if (slotsOf(t, o, c).some(([x, y]) => a >= x && b <= y)) continue; // v eni reži
      a = Math.min(a, start);
      b = Math.max(b, end);
      changed = true;
    }
  }
  return [a, b];
}

/**
 * Izbriše izbiro [s, e) (razširjeno s selectionSpan); oklepaj ali zaklepaj, katerega par je zunaj izbire, ostane
 * (»(1+2)·3«, izbrano »(1« → »(+2)·3«). pos: mesto prvega izbrisanega znaka (tja gre vnos čez izbiro).
 */
export function deleteSpan(text, s, e) {
  const t = String(text ?? "");
  const [a, b] = selectionSpan(t, s, e);
  const keep = new Set();
  for (let i = a; i < b; i++) {
    if (OPENERS.includes(t[i])) {
      const c = closeAt(t, i);
      if (c >= b) keep.add(i);
    } else if (CLOSERS.includes(t[i])) {
      let d = 0;
      let o = -1;
      for (let j = i; j >= 0; j--) {
        if (CLOSERS.includes(t[j])) d++;
        else if (OPENERS.includes(t[j]) && --d === 0) {
          o = j;
          break;
        }
      }
      if (o >= 0 && o < a) keep.add(i);
    }
  }
  let out = t.slice(0, a);
  let pos = -1;
  let afterOpen = -1; // za ohranjenim oklepajem: vnos gre v oklepaj (»2+(3« izbrano, 4 → »(4+4)«)
  for (let i = a; i < b; i++) {
    if (keep.has(i)) {
      out += t[i];
      if (OPENERS.includes(t[i])) afterOpen = out.length;
    } else if (pos < 0) pos = out.length;
  }
  return done(out + t.slice(b), afterOpen >= 0 ? afterOpen : pos < 0 ? out.length : pos);
}

/** ⌫: { text, pos } po brisanju levo od kazalca (s, e: izbira). */
function backspaceRaw(text, s, e = s) {
  const t = String(text ?? "");
  if (s !== e) return deleteSpan(t, s, e);
  if (s <= 0) return done(t, 0);
  // kazalec sredi odpirala (»integr|iraj(«, »sin|(«, »d/d|x(«, »∫|(«): kot da je za njegovim oklepajem
  const inOp = openerAround(t, s);
  if (inOp && inOp[0] < s) s = inOp[1];
  // sredi imena brez oklepaja (»An|s«): ime gre celo
  const w = wordAround(t, s);
  if (w && !/^\s*\(/.test(t.slice(w.end))) return done(t.slice(0, w.start) + t.slice(w.end), w.start);
  const before = t.slice(0, s);
  const op = OPENER.exec(before);
  if (op) {
    const start = s - op[0].length;
    const o = s - 1;
    const c = closeAt(t, o);
    // ^( v ∑_(…)^(…): na začetku zgornje meje gre ⌫ na konec spodnje
    if (op[0] === "^(" && /[∑∏]_\([^()]*\)$/.test(t.slice(0, start))) return done(t, start - 1);
    if (/^[∑∏]_\($/.test(op[0])) {
      const up = /^\^\(/.test(t.slice(c + 1)) ? closeAt(t, c + 2) : -2;
      const body = up >= 0 ? t.slice(up + 1) : "";
      if (c >= 0 && up >= 0 && blank(t, [c + 3, up]) && !body.trim()) return done(t.slice(0, start), start);
      if (c < 0 || up === -2) return done(t.slice(0, start) + t.slice(c < 0 ? t.length : c + 1), start);
      return done(t, start); // izpolnjena vsota: kazalec pred ∑, nič se ne izbriše
    }
    // ×10^(…) je enota: gre cela z eksponentom (vsebina »5« brez ×10 bi spremenila število: 2×10^(5) → 25; AUDIT-048)
    if (op[0] === "×10^(") return done(t.slice(0, start) + t.slice(c < 0 ? t.length : c + 1), start);
    const slots = slotsOf(t, o, c);
    const name = op[0].replace(/\s*\($/, "");
    if (slots.slice(1).every((x, k) => emptySlot(t, name, x, k + 1))) return unwrap(t, start, o, c, blank(t, slots[0]) ? null : slots[0]);
    return done(t, start); // druge reže niso prazne: kazalec gre pred predlogo, nič se ne izbriše
  }
  // [ matrike: prazna matrika (tudi v det(…), inverz(…)) gre kot celota, izpolnjena ostane, kazalec gre pred njo
  if (t[s - 1] === "[") {
    // začetek druge vrstice: na konec prejšnje vrstice
    let j = s - 2;
    while (j >= 0 && /\s/.test(t[j])) j--;
    if (t[j] === ";") {
      let k = j - 1;
      while (k >= 0 && /\s/.test(t[k])) k--;
      if (t[k] === "]") return done(t, k);
    }
    let o = s - 1;
    for (let enc = enclosing(t, o); enc && enc.name === "["; enc = enclosing(t, o)) o = enc.o;
    const enc = enclosing(t, o);
    const c = closeAt(t, o);
    if (enc && enc.start < o && enc.o === o - 1 && closeAt(t, enc.o) === (c < 0 ? -1 : c + 1)) {
      if (blank(t, [o, c < 0 ? t.length : c + 1])) return backspaceRaw(t, enc.o + 1);
      return done(t, enc.start);
    }
    if (blank(t, [o, c < 0 ? t.length : c + 1])) return done(t.slice(0, o) + t.slice(c < 0 ? t.length : c + 1), o);
    return done(t, o);
  }
  // zaklepaj se ne briše posamič (predloga ali oklepaj bi razpadla): kazalec gre v oklepaj
  if (CLOSERS.includes(t[s - 1])) return done(t, s - 1);
  // navaden oklepaj: prazen gre s parom, sicer gresta oba oklepaja, vsebina ostane
  if (t[s - 1] === "(") return unwrap(t, s - 1, s - 1, closeAt(t, s - 1), [s, closeAt(t, s - 1) < 0 ? t.length : closeAt(t, s - 1)]);
  if (/Ans$/.test(before)) return done(t.slice(0, s - 3) + t.slice(s), s - 3);
  // »f(x)=« kot celota, ne »n(x)=« iz »sin(x)=« (prej »sin(x)=|0,5« → »si0,5«)
  const fx = /(?<![A-Za-zčšž])[a-z]\([a-z]\)=$/.exec(before);
  if (fx) return done(t.slice(0, s - fx[0].length) + t.slice(s), s - fx[0].length);
  if (t[s - 1] === ";") {
    const enc = enclosing(t, s - 1);
    if (enc) {
      const c = closeAt(t, enc.o);
      const slot = slotsOf(t, enc.o, c).find(([a]) => a === s);
      if (FIXED(enc.name) || (slot && !blank(t, slot))) return done(t, s - 1);
    }
  }
  // en znak (tudi znak zunaj BMP)
  const n = /[\uDC00-\uDFFF]/.test(t[s - 1]) && s > 1 ? 2 : 1;
  return done(t.slice(0, s - n) + t.slice(s), s - n);
}

/** Delete: { text, pos } po brisanju desno od kazalca. */
function deleteForwardRaw(text, s, e = s) {
  const t = String(text ?? "");
  if (s !== e) return backspaceRaw(t, s, e);
  if (s >= t.length) return done(t, t.length);
  const inOp = openerAround(t, s);
  if (inOp) s = inOp[0];
  const w = wordAround(t, s);
  if (w) s = w.start;
  const after = t.slice(s);
  const op = OPENER_AT.exec(after);
  if (op) {
    const o = s + op[0].length - 1;
    const c = closeAt(t, o);
    if (/^[∑∏]_\($/.test(op[0])) return done(t, o + 1);
    if (op[0] === "×10^(") return done(t.slice(0, s) + t.slice(c < 0 ? t.length : c + 1), s); // enota (AUDIT-048)
    const slots = slotsOf(t, o, c);
    const name = op[0].replace(/\s*\($/, "");
    if (slots.slice(1).every((x, k) => emptySlot(t, name, x, k + 1))) return unwrap(t, s, o, c, blank(t, slots[0]) ? null : slots[0]);
    return done(t, o + 1); // v prvo režo
  }
  if (/^Ans/.test(after)) return done(t.slice(0, s) + t.slice(s + 3), s);
  if (CLOSERS.includes(t[s])) return done(t, s + 1); // zaklepaja ne brišemo naprej: kazalec gre čez
  if (t[s] === "(") {
    const c = closeAt(t, s);
    return unwrap(t, s, s, c, [s + 1, c < 0 ? t.length : c]);
  }
  if (t[s] === "[") return done(t, s + 1);
  if (t[s] === ";") {
    const enc = enclosing(t, s);
    if (enc) {
      const c = closeAt(t, enc.o);
      const slot = slotsOf(t, enc.o, c).find(([, b]) => b === s);
      if (FIXED(enc.name) || (slot && !blank(t, slot))) return done(t, s + 1);
    }
  }
  if (t[s] === "^" && t[s + 1] === "(") {
    const c = closeAt(t, s + 1);
    if (c > 0 && !t.slice(s + 2, c).trim()) return done(t.slice(0, s) + t.slice(c + 1), s);
    return done(t, s + 2);
  }
  const n = /[\uD800-\uDBFF]/.test(t[s]) ? 2 : 1;
  return done(t.slice(0, s) + t.slice(s + n), s);
}

// Varovalo (AUDIT-034): brisanje nikoli ne pokvari izrisa. ok(besedilo) pove, ali se zapis izriše (sci.js: entryBase z
// okoljem kalkulatorja); če se je prej in se po brisanju ne bi (»0,1+0,2« brez + → »0,10,2«, »∑_(n=1)« brez n), se nič ne
// izbriše in kazalec gre en korak v smer brisanja.
function guarded(raw, step) {
  return (text, s, e = s, { ok } = {}) => {
    const t = String(text ?? "");
    const r = raw(t, s, e);
    if (!ok || r.text === t || !r.text.trim() || ok(r.text) || !ok(t)) return r;
    // ⌫ se ne sme zatakniti (pregled #986: ∑_(n=)^() s kazalcem le hodi levo): najbližji znak vsebine levo, ki ga lahko
    // izbrišemo, sicer najmanjša predloga okoli kazalca, sicer vse levo od kazalca
    if (step < 0 && s === e && s > 0) return progress(t, s, ok);
    return { text: t, pos: Math.max(0, Math.min(t.length, (s === e ? s : step < 0 ? Math.min(s, e) : Math.max(s, e)) + (s === e ? step : 0))) };
  };
}
function progress(t, s, ok) {
  const cut = (a, b) => ({ text: t.slice(0, a) + t.slice(b), pos: a });
  const content = (k) => {
    if (!/[\d.,+\-−×÷·*/=<>≤≥!%π∞²³°A-Za-zα-ω]/u.test(t[k])) return false;
    if (!/[A-Za-zčšž]/.test(t[k])) return true;
    let b = k;
    while (/[A-Za-zčšž]/.test(t[b] || "")) b++;
    return t[b] !== "("; // črka imena funkcije ni vsebina
  };
  for (let k = s - 1; k >= Math.max(0, s - 12); k--) if (content(k) && ok(cut(k, k + 1).text)) return cut(k, k + 1);
  for (let o = s - 1, d = 0; o >= 0; o--) {
    if (CLOSERS.includes(t[o])) d++;
    else if (OPENERS.includes(t[o])) {
      if (d > 0) {
        d--;
        continue;
      }
      const m = OPENER.exec(t.slice(0, o + 1));
      const start = m ? o + 1 - m[0].length : o;
      const c = closeAt(t, o);
      let end = c < 0 ? t.length : c + 1;
      if (m && /^[∑∏]_\($/.test(m[0]) && t[end] === "^" && t[end + 1] === "(") end = closeAt(t, end + 1) < 0 ? t.length : closeAt(t, end + 1) + 1;
      const r = cut(start, end);
      if (!r.text.trim() || ok(r.text)) return { text: r.text.trim() ? r.text : "", pos: r.text.trim() ? start : 0 };
    }
  }
  return ok(t.slice(s)) ? cut(0, s) : { text: "", pos: 0 };
}
/** ⌫: { text, pos }; opts.ok(besedilo) → ali se izriše (varovalo). */
export const backspace = guarded(backspaceRaw, -1);
/** Delete: { text, pos }; opts.ok kot pri backspace. */
export const deleteForward = guarded(deleteForwardRaw, 1);

/** ◀ ▶: naslednje mesto kazalca v zapisu (merilne točke), ne naslednji znak besedila (ime ostane celo). */
export function stepCaret(base, text, p, d) {
  const t = String(text ?? "");
  // začetek in konec sta vedno mesti; mesto sredi imena ali odpirala (»integr|iraj(«, »d/d|x(«, »∫|(«) je začetek
  // prve reže, sredi imena brez oklepaja (»An|s«) ga ni
  const openers = [...t.matchAll(OPENERS_ALL)].map((m) => [m.index, m.index + m[0].length]);
  const fix = (x) => openers.find(([a, b]) => a < x && x < b)?.[1] ?? x;
  const stops = base?.ok ? [...new Set([0, ...caretStops(base).map((x) => fix(x.p)), t.length])].filter((x) => !wordAround(t, x)).sort((x, y) => x - y) : [];
  if (stops.length) {
    const next = d > 0 ? stops.find((x) => x > p) : [...stops].reverse().find((x) => x < p);
    return next ?? (d > 0 ? Math.max(p, stops.at(-1)) : Math.min(p, stops[0]));
  }
  let q = Math.max(0, Math.min(t.length, p + d));
  const w = wordAround(t, q);
  if (w) q = d > 0 ? w.end : w.start;
  return q;
}

// ---------- zapis za bralnik zaslona (AUDIT-040) ----------
// Polje vnosa je prosojno besedilo (»∫(x;0;1)«); bralnik zaslona dobi opis matematike iz izrisanega zapisa (drevo KaTeX),
// z besedami v jeziku vmesnika (sc.say.* v i18n), npr. »integral od 0 do 1 x d x«. Kazalec in okvirček sta besedi.

/** Imena besed v ključu sc.say.words (ločene z »|«, v tem vrstnem redu). */
export const SAY_WORDS = ["plus", "minus", "times", "div", "eq", "ne", "lt", "gt", "le", "ge", "approx", "to", "infty", "pi", "comma", "hole", "caret", "int", "sum", "prod", "lim", "det", "sin", "cos", "tan", "cot", "ln", "log", "fact", "percent", "deg", "pm"];
const SAY_SYM = { "+": "plus", "-": "minus", "−": "minus", "\\cdot": "times", "\\times": "times", "*": "times", "\\div": "div", "/": "div", ":": "div", "=": "eq", "\\ne": "ne", "\\neq": "ne", "<": "lt", ">": "gt", "\\lt": "lt", "\\gt": "gt", "\\le": "le", "\\leq": "le", "\\ge": "ge", "\\geq": "ge", "\\approx": "approx", "\\to": "to", "\\rightarrow": "to", "\\infty": "infty", "\\pi": "pi", ",": "comma", "!": "fact", "\\%": "percent", "%": "percent", "\\circ": "deg", "^\\circ": "deg", "\\degree": "deg", "\\pm": "pm" };
const SAY_OP = { "\\int": "int", "\\sum": "sum", "\\prod": "prod", "\\lim": "lim", "\\det": "det", "\\sin": "sin", "\\cos": "cos", "\\tan": "tan", "\\cot": "cot", "\\ln": "ln", "\\log": "log" };
/** Imena grških črk v ključu sc.say.greek (ločena z »|«, v tem vrstnem redu), v jeziku vmesnika. */
export const SAY_GREEK = ["alpha", "beta", "gamma", "delta", "epsilon", "theta", "lambda", "mu", "sigma", "tau", "phi", "omega", "rho"];
const GREEK_TEX = { varepsilon: "epsilon", varphi: "phi" };

/**
 * TeX zapisa vnosa → besedilo za bralnik zaslona.
 * say(key, vars): prevod sc.say.<key> (range, frac, fracLong, pow, powLong, sub, at, sqrt, sqrtLong, root, rootLong, abs, absLong, binom,
 * paren, matrix, deriv); greek: { ime: beseda } za SAY_GREEK;
 * words: { ime: beseda } za SAY_WORDS; parse: katex.__parse.
 */
export function texSpeech(tex, { say, words, greek = {}, parse }) {
  let tree;
  try {
    tree = parse(String(tex ?? ""), { trust: TRUST, strict: "ignore", throwOnError: true });
  } catch {
    return "";
  }
  const w = (k) => words[k] ?? k;
  // en člen (brez presledka; beseda »kazalec« ne šteje)
  const one = (x) => !/ /.test(x.replace(w("caret"), "").trim());
  // več členov: na vrhnji ravni skupine je + ali − (√(x²+1), ne √(x²))
  const terms = (g) => list(g?.type === "ordgroup" ? g.body : g).some((x) => x?.type === "atom" && x.family === "bin" && /^(\+|-|−|\\pm)$/.test(x.text));
  const list = (body) => (Array.isArray(body) ? body : body ? [body] : []);
  const sp = (nodes) => {
    const out = [];
    for (const n of list(nodes)) {
      const s = node(n);
      if (s) out.push(s);
    }
    // števke in decimalna vejica skupaj (»2 cela 5«, ne »2 5«)
    return out.join(" ").replace(/(\d) (?=\d)/g, "$1");
  };
  const node = (n) => {
    if (!n) return "";
    switch (n.type) {
      case "ordgroup":
      case "styling":
      case "sizing":
      case "font":
      case "text":
      case "smash":
      case "mclass":
        return sp(n.body);
      case "mathord":
      case "textord": {
        if (n.text in SAY_SYM) return w(SAY_SYM[n.text]);
        const g = /^\\([a-zA-Z]+)$/.exec(n.text);
        if (g) return g[1] === "square" ? w("hole") : greek[GREEK_TEX[g[1]] ?? g[1]] ?? g[1];
        return n.text;
      }
      case "atom":
      case "spacing":
        if (n.type === "spacing") return "";
        return n.text in SAY_SYM ? w(SAY_SYM[n.text]) : /^[,;]$/.test(n.text) ? "," : "";
      case "kern":
      case "rule":
      case "phantom":
        return "";
      case "html": {
        const cls = n.attributes?.class || "";
        if (/sc-caret/.test(cls)) return w("caret");
        if (/sc-hole/.test(cls)) return w("hole");
        return sp(n.body);
      }
      case "htmlmathml":
        return sp(n.mathml ?? n.html);
      case "op":
        return SAY_OP[n.name] ? w(SAY_OP[n.name]) : n.name ? n.name.replace(/^\\/, "") : sp(n.body);
      case "operatorname":
        return sp(n.body).replace(/ /g, "");
      case "supsub": {
        const base = node(n.base);
        if (n.base?.type === "op" && n.sub && n.sup) return say("range", { op: base, a: node(n.sub), b: node(n.sup) });
        let s = base;
        // odvod v točki: \left. … \right|_{x=2}
        if (n.sub && n.base?.type === "leftright" && n.base.right === "|") s = say("at", { a: s, b: node(n.sub) });
        else if (n.sub) s = n.base?.type === "op" ? `${s} ${node(n.sub)}` : say("sub", { a: s, b: node(n.sub) });
        if (n.sup) {
          const sup = node(n.sup);
          // eksponent iz več členov: povemo, kje se konča (»2 na x plus 1, konec potence« ≠ »2 na x, plus 1«)
          s = sup.startsWith(w("deg")) ? `${s} ${sup}` : say(terms(n.sup) ? "powLong" : "pow", { a: s, b: sup });
        }
        return s;
      }
      case "genfrac": {
        const a = node(n.numer);
        const b = node(n.denom);
        if (!n.hasBarLine) return say("binom", { a, b });
        const dx = /^d ?(\S+)$/.exec(b);
        if (a === "d" && dx) return say("deriv", { x: dx[1] });
        // sestavljen števec ali imenovalec: povemo, kje se začne in konča (»1 plus 2 skozi 3 plus 4« je dvoumno)
        return say(one(a) && one(b) ? "frac" : "fracLong", { a, b });
      }
      case "sqrt": {
        // korenjenec iz več členov: »koren iz x na 2 plus 1, konec korena« ≠ »koren iz x na 2, plus 1«
        const a = node(n.body);
        const long = terms(n.body) ? "Long" : "";
        return n.index ? say(`root${long}`, { k: node(n.index), a }) : say(`sqrt${long}`, { a });
      }
      case "leftright": {
        const a = sp(n.body);
        // več členov: »absolutna vrednost x minus 1, konec absolutne vrednosti« ≠ »… minus 1 plus 2« (AUDIT-048)
        if (n.left === "|" || n.left === "\\vert" || n.left === "\\lvert") return say(terms({ type: "ordgroup", body: list(n.body) }) ? "absLong" : "abs", { a });
        if (n.left === ".") return a;
        if (list(n.body).length === 1 && list(n.body)[0].type === "array") return a; // matrika: oklepaj je del matrike
        return say("paren", { a });
      }
      case "array":
        return say("matrix", { a: n.body.map((row) => row.map(node).join(", ")).join("; ") });
      case "accent":
        return node(n.base);
      default:
        return n.body ? sp(n.body) : "";
    }
  };
  return sp(tree).replace(/\s+/g, " ").trim();
}

/**
 * Vstavi besedilo tipke na mesto s (»@« = mesto kazalca po vstavljanju). Odprt oklepaj tipke (»^(«, »√(«, »sin(«) se
 * zapre pred prvim »;«, »)« ali »]« zunanje predloge za kazalcem: sicer bi požrl njene reže (∫(|;0;1) + xʸ je dalo
 * ∫(^(;0;1), torej ∫ brez mej in eksponent »(□; 0; 1)«; AUDIT-059). Brez zunanje reže za kazalcem (konec vnosa,
 * »sin(|x« na vrhu) ostane odprt kot prej: zajame, kar sledi, in complete ga zapre za prikaz.
 * Vrne { text, pos }.
 */
export function insertKey(text, s, ins) {
  const t = String(text ?? "");
  s = Math.max(0, Math.min(t.length, s));
  const at = ins.indexOf("@");
  let clean = ins.replace("@", "");
  let open = 0;
  for (const c of clean) {
    if (OPENERS.includes(c)) open++;
    else if (CLOSERS.includes(c) && open > 0) open--;
  }
  let rest = t.slice(s);
  if (open > 0) {
    // prvo ločilo ali zaklepaj na globini 0 (glede na kazalec): tam se konča reža, v kateri je kazalec
    let d = 0;
    let end = -1;
    for (let j = 0; j < rest.length; j++) {
      const c = rest[j];
      if (OPENERS.includes(c)) d++;
      else if (CLOSERS.includes(c)) {
        if (d === 0) {
          end = j;
          break;
        }
        d--;
      } else if (c === ";" && d === 0) {
        end = j;
        break;
      }
    }
    // vsebina do konca reže (brez presledkov na koncu) gre v novi oklepaj, zaklepaji pred ločilom
    if (end >= 0) {
      let k = end;
      while (k > 0 && /\s/.test(rest[k - 1])) k--;
      rest = rest.slice(0, k) + ")".repeat(open) + rest.slice(k);
    }
  }
  return { text: t.slice(0, s) + clean + rest, pos: s + (at >= 0 ? at : clean.length) };
}

// tipke predlog in operatorjev, ki potrebujejo režo ali levi operand (številke in črke niso tu)
const TEMPLATE_KEY = (ins) => /\(/.test(ins) || ["²", "³", "⁻¹", ";", "!", "%", "°", "′", "″"].includes(ins);
// odprte skupine okoli mesta p: začetek, število »;« v njej, zaprta
function groupsAt(t, p) {
  const st = [];
  for (let i = 0; i < p; i++) {
    if (OPENERS.includes(t[i])) st.push(i);
    else if (CLOSERS.includes(t[i])) st.pop();
  }
  return st
    .map((o) => {
      let d = 0;
      let sep = 0;
      let cl = -1;
      for (let j = o; j < t.length && cl < 0; j++) {
        const c = t[j];
        if (OPENERS.includes(c)) d++;
        else if (CLOSERS.includes(c)) {
          if (--d === 0) cl = j;
        } else if (c === ";" && d === 1) sep++;
      }
      return `${o}:${sep}:${cl >= 0}`;
    })
    .join(",");
}
const topSemis = (t) => {
  let d = 0;
  let n = 0;
  for (const c of t) {
    if (OPENERS.includes(c)) d++;
    else if (CLOSERS.includes(c)) d--;
    else if (c === ";" && d === 0) n++;
  }
  return n;
};
// »;« v zapisu (zunaj \text) je surovo ločilo: predloga ni prepoznana (»(□; 0; 1)« v eksponentu)
const texSemis = (tex) => (String(tex ?? "").replace(/\\text\{[^}]*\}/g, "").match(/;/g) || []).length;

// največ »;« v predlogi (reže − 1); brez imena (navaden oklepaj, točka, matrika) in seznami niso omejeni
const SEMIS_MAX = { "∫": 2, "d/dx": 1, integriraj: 1, limita: 2, taylor: 3, reši: 1, resi: 1, nCr: 1, nPr: 1, gcd: Infinity, lcm: Infinity, mod: 1, round: 1, randint: 1, Pol: 1, Rec: 1, root: 1, logb: 1, mean: Infinity, median: Infinity, stdev: Infinity, stdevp: Infinity, min: Infinity, max: Infinity, total: Infinity };
// ali sme »;« na mestu s: v najbolj notranji skupini, ki jo predloga dovoli (∫ ima 3 reže, sin, √ in xʸ eno)
function semiAllowed(t, s) {
  const st = [];
  for (let i = 0; i < s; i++) {
    if (OPENERS.includes(t[i])) st.push(i);
    else if (CLOSERS.includes(t[i])) st.pop();
  }
  if (!st.length) return true;
  const o = st.at(-1);
  if (t[o] === "[") return true;
  const name = /(∫|d\/dx|[∑∏]_|\^|[√∛]|[A-Za-zčšžČŠŽ]+)\s*$/u.exec(t.slice(0, o))?.[1];
  if (!name) return true;
  const max = SEMIS_MAX[name] ?? 0;
  const now = Number(groupsAt(t, o + 1).split(",").at(-1).split(":")[1]);
  return now + 1 <= max;
}

/**
 * Tipka na mestu s: insertKey in varovalo (kot pri ⌫, AUDIT-034). Tipka predloge (xʸ, √, sin, ∫, ;, x², !, …), po
 * kateri se zapis ne bi izrisal, bi pokazal surovo ločilo ali bi zunanji predlogi spremenil reže (∫ bi izgubil meje),
 * se ne zgodi: vrne null (AUDIT-059). Če zapis že prej ni bil čist, varovala ni (ne zaklene vnosa).
 */
export function pressKey(text, s, ins, env = {}, { render, check } = {}) {
  const t = String(text ?? "");
  const r = insertKey(t, s, ins);
  if (!TEMPLATE_KEY(ins)) return r;
  if (ins === ";" && !semiAllowed(t, s)) return null;
  let b0 = null;
  let b = null;
  try {
    b0 = t.trim() ? entryBase(t, env, render) : null;
    b = entryBase(r.text, env, render);
  } catch {}
  if (t.trim() && !(b0?.ok && !/;;\)|undefined/.test(b0.tex))) return r;
  if (!b?.ok || /;;\)|undefined/.test(b.tex) || texSemis(b.tex) > texSemis(b0?.tex)) return null;
  // izris v pravem KaTeX (kalkulator poda check): »(x+1)°^(2)« je dvojni eksponent
  if (check && !check(caretTex(b, r.pos))) return null;
  if (ins !== ";" && (groupsAt(t, s) !== groupsAt(r.text, s) || topSemis(t) !== topSemis(r.text))) return null;
  return r;
}
