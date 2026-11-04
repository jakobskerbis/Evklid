// Znanstveni kalkulator in pretvornik enot (vmesnik). Računa scicore.js (+ scisolve.js za enačbe,
// neenačbe, sisteme, funkcije, odvode in kompleksna števila), brez API in brez knjižnic.
// Tipkovnica je vedno vidna (kot pri pravem kalkulatorju); na računalniku lahko tipkaš tudi s tipkovnico.
import { evaluate, functionDef, exactTex, formatNumber, mixedTex, primeFactors, factorsTex, dmsOf, CONSTANTS, constantText, QUANTITIES, convert } from "./scicore.js";
import { analyze, previewTex, solutionTex, intervalsTex, systemTex, ANGLE_SUP } from "./scisolve.js";
import { commandName, parseCommand } from "./cas.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const isTouch = () => typeof matchMedia !== "undefined" && matchMedia("(hover: none) and (pointer: coarse)").matches;
const MAX_HISTORY = 60;
const FORMATS = ["auto", "sci", "eng", "fix2", "fix3", "fix4", "sig2", "sig3", "sig4"];
const ANGLES = ["deg", "rad", "grad"]; // stopinje, radiani, gradi (400 v polnem krogu)

const texHtml = (s, display = false) => {
  try {
    return window.katex.renderToString(s, { throwOnError: false, displayMode: display, strict: "ignore" });
  } catch {
    return esc(s);
  }
};
const usesComma = (locale) => {
  try {
    return (1.5).toLocaleString(locale || "sl").includes(",");
  } catch {
    return true;
  }
};
const store = {
  get(k) {
    try {
      return JSON.parse(localStorage.getItem(k) || "null");
    } catch {
      return null;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch {}
  },
};

// Tipke: [napis, vstavi, 2nd napis, 2nd vstavi]. »@« je mesto kazalca po vstavljanju.
const FN_KEYS = [
  ["2nd", "#2nd"], ["x²", "²", "x³", "³"], ["xʸ", "^(", "ⁿ√x", "root(@;)"], ["√", "√(", "∛", "∛("], ["x⁻¹", "⁻¹", "|x|", "abs("], ["◀", "#left"],
  ["sin", "sin(", "sin⁻¹", "arcsin("], ["cos", "cos(", "cos⁻¹", "arccos("], ["tan", "tan(", "tan⁻¹", "arctan("], ["ln", "ln(", "eˣ", "e^("], ["log", "log(", "10ˣ", "10^("], ["▶", "#right"],
  ["(", "(", "M+", "#m+"], [")", ")", "M−", "#m-"], ["π", "π", "e", "e"], ["n!", "!", "nCr", "nCr(@;)"], ["°′″", "#dms", "nPr", "nPr(@;)"], ["%", "%", "logₐ", "logb(@;)"],
  ["x", "x", "y", "y"], ["=", "=", "<", "<"], ["d/dx", "d/dx(@)", "f(x)=", "f(x)="], ["∫", "∫(@;;)", "i", "i"], [";", ";", ">", ">"], ["⋯", "#more"],
];
const NUM_KEYS = [
  ["7", "7"], ["8", "8"], ["9", "9"], ["⌫", "#del"], ["AC", "#ac"],
  ["4", "4"], ["5", "5"], ["6", "6"], ["×", "×"], ["÷", "÷"],
  ["1", "1"], ["2", "2"], ["3", "3"], ["+", "+"], ["−", "−"],
  ["0", "0"], [",", "#dec"], ["×10ˣ", "×10^("], ["Ans", "Ans", "MR", "M"], ["=", "#eq"],
];
const KEY_LABEL = { "#2nd": "sc.second", "#left": "sc.left", "#right": "sc.right", "#del": "sc.del", "#ac": "sc.ac", "#eq": "sc.equals", "#more": "sc.more" };
// spomin M (kot na kalkulatorju): M+ prišteje rezultat, M− ga odšteje, MR vstavi M, MC izbriše
const MEM_LABEL = { "#m+": "sc.mPlus", "#m-": "sc.mMinus", M: "sc.mRecall", "#mc": "sc.mClear" };
// Meni »⋯«: vse funkcije po skupinah. [napis (TeX), vstavi]
const MORE = [
  ["alg", null], // poenostavi, razvij, razstavi, reši za (imena v jeziku vmesnika, glej renderMore)
  ["cmp", [["=", "="], ["<", "<"], [">", ">"], ["\\le", "≤"], ["\\ge", "≥"], [";", ";"]]],
  ["vars", [["x", "x"], ["y", "y"], ["z", "z"], ["a", "a"], ["b", "b"], ["c", "c"], ["n", "n"], ["t", "t"], ["f(x)=", "f(x)="], ["g(x)=", "g(x)="]]],
  ["ana", null], // odvod, integral, vsota, produkt; integriraj, limita, taylor (imena v jeziku vmesnika, glej anaKeys)
  ["trig", [["\\sin", "sin("], ["\\cos", "cos("], ["\\tan", "tan("], ["\\cot", "cot("], ["\\arcsin", "arcsin("], ["\\arccos", "arccos("], ["\\arctan", "arctan("], ["\\sinh", "sinh("], ["\\cosh", "cosh("], ["\\tanh", "tanh("], ["\\text{°}", "°"], ["\\text{′}", "′"], ["\\text{″}", "″"]]],
  ["num", [["\\gcd", "gcd(@;)"], ["\\operatorname{lcm}", "lcm(@;)"], ["\\bmod", "mod(@;)"], ["\\operatorname{round}", "round(@;)"], ["\\lfloor x\\rfloor", "floor("], ["\\lceil x\\rceil", "ceil("], ["\\binom{n}{k}", "nCr(@;)"], ["n!", "!"], ["\\%", "%"], ["\\operatorname{sgn}", "sgn("], ["\\operatorname{Int}", "Int("], ["\\operatorname{frac}", "frac("], ["\\mathrm{Ran\\#}", "rand"], ["\\operatorname{RanInt}", "randint(@;)"], ["\\operatorname{Pol}", "Pol(@;)"], ["\\operatorname{Rec}", "Rec(@;)"]]],
  ["stat", [["\\operatorname{mean}", "mean(@)"], ["\\operatorname{median}", "median(@)"], ["\\sigma", "stdev(@)"], ["\\min", "min(@)"], ["\\max", "max(@)"], ["\\Sigma", "total(@)"]]],
  ["cplx", [["i", "i"], ["|z|", "abs("]]],
  ["mem", [["\\mathrm{M+}", "#m+"], ["\\mathrm{M-}", "#m-"], ["\\mathrm{MR}", "M"], ["\\mathrm{MC}", "#mc"]]],
];

// gnezdeni \frac, \sqrt, ^{…} od znotraj navzven: √(E/m) ostane √((E)/(m)), ne √(E)/(m)
function unnest(x) {
  for (let prev = ""; prev !== x; ) {
    prev = x;
    x = x
      .replace(/_\{([^{}]*)\}/g, "$1")
      .replace(/\^\{([^{}]*)\}/g, (_, a) => (/^[\w.,]+$/.test(a) ? `^${a}` : `^(${a})`))
      .replace(/\\t?frac\{([^{}]*)\}\{([^{}]*)\}/g, "($1)/($2)")
      .replace(/\\sqrt\{([^{}]*)\}/g, (_, a) => (/^[\w.,]+$/.test(a) ? `√${a}` : `√(${a})`));
  }
  return x;
}
/** Rezultat v TeX → besedilo za odložišče, ki ga razume vsak program (izvoženo za teste). */
export function texPlain(tex) {
  return unnest(String(tex).replace(/\{,\}/g, ","))
    .replace(/\\Leftrightarrow/g, "⇔")
    .replace(/\\(left|right)(?![a-z])/g, "")
    .replace(/\\(quad|,|;)/g, " ")
    .replace(/\\approx/g, "≈")
    .replace(/\\le(?![a-z])/g, "≤")
    .replace(/\\ge(?![a-z])/g, "≥")
    .replace(/\\in(?![a-z])/g, "∈")
    // funkcije in grške črke (integral, Taylor): ime ostane, sicer bi »\ln|x|« postal »|x|«
    .replace(/\\(arcsin|arccos|arctan|arccot|sinh|cosh|tanh|sin|cos|tan|cot|ln|log|exp)(?![a-z])/g, (_, f, i, str) => `${/[\w)|]/.test(str[i - 1] || "") ? " " : ""}${f}`)
    .replace(/\\ldots/g, "…")
    .replace(/\\(alpha|beta|gamma|delta|varepsilon|epsilon|vartheta|theta|lambda|mu|nu|xi|rho|sigma|tau|varphi|phi|psi|omega)(?![a-z])/g, (_, g) => ({ alpha: "α", beta: "β", gamma: "γ", delta: "δ", varepsilon: "ε", epsilon: "ε", vartheta: "θ", theta: "θ", lambda: "λ", mu: "μ", nu: "ν", xi: "ξ", rho: "ρ", sigma: "σ", tau: "τ", varphi: "φ", phi: "φ", psi: "ψ", omega: "ω" })[g])
    .replace(/\\cup/g, "∪")
    .replace(/\\infty/g, "∞")
    .replace(/\\mathbb\{R\}/g, "ℝ")
    .replace(/\\varnothing/g, "∅")
    .replace(/\\pm/g, "±")
    .replace(/\\pi/g, "π")
    .replace(/\\cdot/g, "·")
    .replace(/\{,\}/g, ",")
    .replace(/\\\{/g, "\u0001")
    .replace(/\\\}/g, "\u0002")
    .replace(/\\[a-z]+/g, "")
    .replace(/[{}\\]/g, "")
    .replace(/\u0001/g, "{")
    .replace(/\u0002/g, "}")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Znanstveni kalkulator v elementu root.
 * opts: { t, icon, locale(), storageKey(), toast?(msg), openGraph?(exprs), steps?(text, goal), canSteps?() }
 */
export function createScientific(root, opts) {
  const { t, icon } = opts;
  const comma = () => usesComma(opts.locale?.());
  const key = () => opts.storageKey?.() || "evklid.sci.0";
  let st = load();
  let second = false;
  let recall = -1; // ↑/↓ po zgodovini vnosov

  function load() {
    const s = store.get(key()) || {};
    return {
      history: Array.isArray(s.history) ? s.history.slice(-MAX_HISTORY) : [],
      vars: s.vars && typeof s.vars === "object" ? s.vars : {},
      funcs: s.funcs && typeof s.funcs === "object" ? s.funcs : {},
      ans: Number.isFinite(s.ans) ? s.ans : 0,
      angle: ANGLES.includes(s.angle) ? s.angle : s.deg === false ? "rad" : "deg", // »deg« iz starejših različic
      format: FORMATS.includes(s.format) ? s.format : "auto",
    };
  }
  const save = () => store.set(key(), st);

  root.classList.add("sc");
  root.innerHTML = `
    <div class="sc-screen">
      <div class="sc-bar">
        <div class="seg sc-angle" role="group" aria-label="${esc(t("gc.angles"))}">
          <button type="button" data-angle="deg" title="${esc(t("gc.deg"))}">DEG</button><button type="button" data-angle="rad" title="${esc(t("gc.rad"))}">RAD</button><button type="button" data-angle="grad" title="${esc(t("sc.grad"))}">GRA</button>
        </div>
        <label class="sc-format-l"><span class="sr-only">${esc(t("sc.format"))}</span><select class="sc-format" aria-label="${esc(t("sc.format"))}"></select></label>
        <div class="sc-vars" hidden></div>
        <span class="sc-sp"></span>
        <button type="button" class="ghost small sc-const-btn" aria-expanded="false" title="${esc(t("sc.constants"))}">${icon("atom")}<span>${esc(t("sc.constants"))}</span></button>
        <button type="button" class="ghost icon-only sc-clear-h" title="${esc(t("sc.clearHistory"))}" aria-label="${esc(t("sc.clearHistory"))}">${icon("trash-2")}</button>
      </div>
      <div class="sc-history" aria-label="${esc(t("sc.history"))}" role="log"></div>
      <div class="sc-entry">
        <div class="sc-line">
          <div class="sc-preview" aria-hidden="true"></div>
        </div>
        <input class="sc-input" data-kb-own autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" aria-label="${esc(t("sc.title"))}" placeholder="${esc(t("sc.placeholder"))}">
        <div class="sc-live" aria-live="polite"></div>
      </div>
    </div>
    <div class="sc-keys">
      <div class="sc-fn"></div>
      <div class="sc-num"></div>
      <div class="sc-consts sc-panel" hidden></div>
      <div class="sc-more sc-panel" hidden></div>
    </div>`;
  const $ = (s) => root.querySelector(s);
  const input = $(".sc-input");
  const hist = $(".sc-history");
  const consts = $(".sc-consts");
  const more = $(".sc-more");
  const varsBar = $(".sc-vars");

  // --- tipkovnica ---
  const keyHtml = (k, cls) => {
    const label = KEY_LABEL[k[1]] ? ` aria-label="${esc(t(KEY_LABEL[k[1]]))}" title="${esc(t(KEY_LABEL[k[1]]))}"` : "";
    const c = [cls, k[1] === "#eq" ? "eq" : "", k[1] === "#ac" || k[1] === "#del" ? "warn" : "", k[1] === "#2nd" ? "second" : "", k[1] === "#more" ? "more" : "", /^[0-9]$/.test(k[1]) || k[1] === "#dec" ? "digit" : ""].filter(Boolean).join(" ");
    return `<button type="button" class="sc-key ${c}" data-ins="${esc(k[1])}"${k[3] ? ` data-ins2="${esc(k[3])}" data-l1="${esc(k[0])}" data-l2="${esc(k[2])}"` : ""}${label}${k[1] === "#more" ? ' aria-expanded="false"' : ""}>${k[1] === "#dec" ? (comma() ? "," : ".") : esc(k[0])}</button>`;
  };
  $(".sc-fn").innerHTML = FN_KEYS.map((k) => keyHtml(k, "fn")).join("");
  $(".sc-num").innerHTML = NUM_KEYS.map((k) => keyHtml(k, "n")).join("");

  function setSecond(on) {
    second = on;
    root.classList.toggle("sc-2nd", on);
    root.querySelector(".sc-key.second").setAttribute("aria-pressed", String(on));
    root.querySelectorAll(".sc-key[data-ins2]").forEach((b) => (b.textContent = on ? b.dataset.l2 : b.dataset.l1));
  }

  // --- vnos ---
  const OPS = /^[+×÷^²³⁻!%−]/;
  function insert(text) {
    let ins = text;
    // po izračunu: operator nadaljuje z rezultatom (Ans)
    if (!input.value && OPS.test(ins) && st.history.length) ins = `Ans${ins}`;
    const s = input.selectionStart ?? input.value.length;
    const e = input.selectionEnd ?? s;
    const at = ins.indexOf("@");
    const clean = ins.replace("@", "");
    input.value = input.value.slice(0, s) + clean + input.value.slice(e);
    const pos = s + (at >= 0 ? at : clean.length);
    input.setSelectionRange(pos, pos);
    recall = -1;
    update();
  }
  function del() {
    const s = input.selectionStart ?? input.value.length;
    const e = input.selectionEnd ?? s;
    if (s !== e) input.value = input.value.slice(0, s) + input.value.slice(e);
    else if (s > 0) {
      // celo ime funkcije z oklepajem naenkrat (sin( …)
      const m = /(?:arcsin|arccos|arctan|sinh|cosh|tanh|sin|cos|tan|cot|ln|log|logb|abs|root|nCr|nPr|gcd|lcm|mod|round|floor|ceil|sgn|Int|frac|randint|Pol|Rec|mean|median|stdev|min|max|total|d\/dx|√|∛|∫)\($|[a-z]\([a-z]\)=$|Ans$|×10\^\($|.$/u.exec(input.value.slice(0, s));
      const n = m ? m[0].length : 1;
      input.value = input.value.slice(0, s - n) + input.value.slice(s);
      input.setSelectionRange(s - n, s - n);
    }
    update();
  }
  function move(d) {
    const p = Math.max(0, Math.min(input.value.length, (input.selectionStart ?? input.value.length) + d));
    input.setSelectionRange(p, p);
  }

  const env = () => ({ vars: st.vars, funcs: st.funcs, ans: st.ans, deg: st.angle === "deg", grad: st.angle === "grad", comma: comma() });
  const fmt = (v) => formatNumber(v, { mode: st.format, comma: comma() });

  function errorText(e) {
    const names = (e.info?.names || []).join(", ");
    switch (e.code) {
      case "missing":
        return t("gc.errMissing", { names });
      case "char":
        return t("gc.errChar", { ch: e.info.ch });
      case "unknownFn":
        return t("gc.errChar", { ch: e.info.f });
      case "notCalc":
        return t("sc.errEquation");
      case "sumLimit":
        return t("sc.errSumLimit");
      case "polInside":
        return t("sc.errPolInside");
      case "vecMix":
      case "vecOp":
        return t("sc.errVec");
      case "undef":
        return t("sc.errUndefined");
      case "casUnsupported":
      case "casEquation":
      case "casNeedEq":
        return t(`sc.cas.${e.code.slice(3).toLowerCase()}`);
      case "casBig":
        return t("sc.cas.big");
      case "casUnverified":
        return t("sc.cas.unverified");
      case "casDegree":
        return t("sc.cas.degree", { v: e.info.v });
      case "casVar":
        return t("sc.cas.var", { v: e.info.v });
      case "casIrrational":
        return t("sc.cas.irrational");
      case "casEmpty":
        return t("sc.cas.empty");
      case "casIntegral":
        return t("sc.cas.integral");
      case "casLimit":
        return t("sc.cas.limit");
      case "casTaylor":
        return t("sc.cas.taylorFail");
      case "casTaylorN":
        return t("sc.cas.taylorN", { max: e.info.max ?? 10 });
      case "casPoint":
        return t("sc.cas.point");
      case "casVarName":
        return t("sc.cas.varName");
      case "other":
        return t("gc.errOther");
      default:
        return t("gc.errSyntax");
    }
  }

  // rezultat (TeX za vrednost) po trenutni obliki zapisa
  function valueTex(v) {
    const f = fmt(v);
    if (st.format !== "auto") return f.tex;
    const ex = exactTex(v);
    const mix = ex && ex.startsWith(v < 0 ? "-\\frac" : "\\frac") ? mixedTex(v) : null;
    return `${ex ? `${ex} ${mix ? `= ${mix} ` : ""}\\approx ` : ""}${f.tex}`;
  }
  const complexTex = (re, im) => {
    if (!im) return fmt(re).tex;
    const b = Math.abs(im) === 1 ? "" : fmt(Math.abs(im)).tex;
    return `${re ? `${fmt(re).tex} ${im < 0 ? "-" : "+"} ` : im < 0 ? "-" : ""}${b}${/\\cdot/.test(b) ? "\\,\\cdot\\," : ""}i`;
  };

  // Rezultat analize → vnos v zgodovino (vse, kar potrebujemo za prikaz, brez funkcij)
  function entryOf(text, r) {
    const c = comma();
    const e = { text, tex: r.tex, kind: r.kind };
    if (r.plot?.length) e.plot = r.plot;
    switch (r.kind) {
      case "value":
        e.value = r.value;
        if (r.assign) e.assign = r.assign;
        break;
      case "complex":
        e.re = r.re;
        e.im = r.im;
        break;
      case "solve":
        e.res = solutionTex(r, c, st.format);
        e.r = pick(r, ["v", "roots", "complex", "exact", "all", "none", "deg", "grad"]);
        if (r.interval) e.note = { key: "sc.onePeriod", tex: r.interval };
        if (!r.roots.length && r.complex?.length) e.note = { key: "sc.noReal" };
        e.steps = true;
        if (r.roots.length) e.first = r.roots[0];
        break;
      case "ineq":
        e.res = intervalsTex(r, c, st.format);
        e.r = pick(r, ["v", "intervals"]); // ±∞ se v JSON shrani kot null
        if (r.interval) e.note = { key: "sc.onePeriod", tex: r.interval };
        e.steps = true;
        break;
      case "system":
        if (r.values) {
          e.res = systemTex(r, c, st.format);
          e.r = pick(r, ["unknowns", "values"]);
          e.steps = true;
        } else e.note = { key: r.none ? "sc.sysNone" : "sc.sysMany" };
        break;
      case "bool":
        e.value = r.value ? 1 : 0;
        break;
      case "pair":
        // Pol/Rec: dva rezultata, vsak v svojem delu (r = …, θ = …)
        e.res = r.items.map((x) => `${x.name} = ${valueTex(x.v)}${x.angle ? ANGLE_SUP[r.grad ? "grad" : r.deg ? "deg" : "rad"] : ""}`).join(",\\quad ");
        e.first = r.items[0].v;
        break;
      case "deriv":
        e.res = r.resTex;
        e.steps = true;
        break;
      case "func":
        e.name = r.name;
        e.param = r.param;
        e.note = { key: "sc.funcSaved", name: `${r.name}(${r.param})`, fn: r.name };
        break;
      case "plot":
        e.note = { key: r.nonlinear ? "sc.nonlinear" : "sc.twoVars" };
        break;
      case "expr":
        e.note = { key: "sc.exprHint", name: r.v };
        if (r.cas) e.cas = true;
        if (r.v) e.ana = r.v; // nedoločeni integral in Taylorjev polinom
        break;
      case "sym":
        e.cas = true;
        e.note = { key: "sc.cas.symHint" };
        break;
      case "symeq":
        e.note = { key: "sc.cas.eqHint" };
        break;
      case "cas":
        e.op = r.op;
        e.res = r.resTex;
        if (r.approx) e.approx = true;
        if (r.none && r.op === "limit") e.none = true; // limita ne obstaja (pri reši je none prazna množica)
        if (r.cond) e.note = { key: "sc.cas.cond", tex: r.cond };
        else if (r.rad) e.note = { key: "sc.cas.radians" };
        if (r.steps) {
          e.steps = true;
          e.stepsText = r.inner;
        }
        break;
    }
    if (r.solveFor?.length) e.solveFor = r.solveFor.slice(0, 6);
    return e;
  }

  const pick = (o, keys) => Object.fromEntries(keys.filter((k) => o[k] !== undefined).map((k) => [k, o[k]]));
  // Rešitev po trenutni obliki zapisa (po menjavi oblike se osveži tudi starejša zgodovina);
  // vnosi brez »r« (shranjeni pred to različico) obdržijo shranjeni zapis.
  function resTex(e) {
    const r = e.r;
    if (!r) return e.res || "";
    try {
      const c = comma();
      if (e.kind === "solve") return solutionTex({ complex: [], ...r }, c, st.format);
      if (e.kind === "ineq") return intervalsTex({ ...r, intervals: r.intervals.map((i) => ({ ...i, lo: i.lo ?? -Infinity, hi: i.hi ?? Infinity })) }, c, st.format);
      if (e.kind === "system") return systemTex(r, c, st.format);
    } catch {}
    return e.res || "";
  }

  function resultHtml(e) {
    const icon2 = (n) => icon(n);
    switch (e.kind || "value") {
      case "value": {
        const d = e.dms ? dmsOf(e.value, { comma: comma() }) : null;
        return texHtml(`${e.assign ? `${e.assign} ` : ""}= ${d ? `${fmt(e.value).tex} = ${d.tex}` : valueTex(e.value)}`);
      }
      case "complex":
        return texHtml(`= ${complexTex(e.re, e.im)}`);
      case "bool":
        return `<span class="sc-bool ${e.value ? "ok" : "no"}">${icon2(e.value ? "check" : "x")}${esc(t(e.value ? "sc.true" : "sc.false"))}</span>`;
      case "deriv":
        return texHtml(`= ${e.res}`);
      case "cas": {
        if (e.none) return `<span class="sc-none">${esc(t("sc.cas.limitNone"))}</span>`;
        if (e.op !== "solve") return texHtml(`${e.approx ? "\\approx" : "="} ${e.res}`);
        const parts = String(e.res || "").split(",\\quad ").filter(Boolean);
        return `<span class="sc-parts">${parts.map((x) => `<span>${texHtml(x)}</span>`).join("")}</span>`;
      }
      case "solve":
      case "system":
      case "pair": {
        // vsaka rešitev posebej, da se na ozkem zaslonu prelomi med rešitvami, ne sredi njih
        const parts = String(resTex(e)).split(",\\quad ").filter(Boolean);
        return parts.length ? `<span class="sc-parts">${parts.map((x) => `<span>${texHtml(x)}</span>`).join("")}</span>` : "";
      }
      case "ineq":
        return resTex(e) ? texHtml(resTex(e)) : "";
      default:
        return "";
    }
  }
  function noteHtml(e) {
    if (!e.note) return "";
    const txt = esc(t(e.note.key, { name: e.note.name || "", fn: e.note.fn || "" }));
    return `<div class="sc-h-note muted">${txt}${e.note.tex ? ` ${texHtml(e.note.tex)}` : ""}</div>`;
  }

  // sproti: lep zapis izraza in predogled rezultata
  function update() {
    const text = input.value;
    const prev = $(".sc-preview");
    const live = $(".sc-live");
    root.classList.toggle("sc-typing", !!text.trim());
    if (!text.trim()) {
      prev.innerHTML = "";
      live.textContent = "";
      live.className = "sc-live";
      return;
    }
    let r;
    try {
      r = analyzeLive(text);
    } catch {
      r = null;
    }
    if (!r || r.error) {
      prev.innerHTML = "";
      live.textContent = "";
      live.className = "sc-live";
      return;
    }
    prev.innerHTML = texHtml(r.tex);
    live.className = "sc-live muted";
    if (r.kind === "value") live.innerHTML = Number.isFinite(r.value) ? texHtml(`= ${fmt(r.value).tex}`) : "";
    else if (r.kind === "complex") live.innerHTML = texHtml(`= ${complexTex(r.re, r.im)}`);
    else if (r.kind === "deriv") live.innerHTML = texHtml(`= ${r.resTex}`);
    else if (r.kind === "cas") live.innerHTML = r.none && r.op === "limit" ? esc(t("sc.cas.limitNone")) : texHtml(r.op === "solve" ? r.resTex : `${r.approx ? "\\approx" : "="} ${r.resTex}`);
    else live.innerHTML = r.kind === "solve" || r.kind === "ineq" || r.kind === "system" ? `<span class="sc-live-hint">${esc(t("sc.pressSolve"))}</span>` : "";
  }
  // Sproten predogled ne rešuje enačb in neenačb (rešitev pride ob =): samo račun, odvod, kompleksno število.
  function analyzeLive(text) {
    // limita(f; x; a), taylor(f; x; a; n): podpičje loči argumente, predogled kot pri vsakem ukazu
    const cmd = parseCommand(text);
    if (cmd && ["integrate", "limit", "taylor"].includes(cmd.op) && !/[=<>≤≥]/.test(text)) return analyze(text, { ...env(), live: true });
    if (/[=<>≤≥;]/.test(text) && !functionDef(text)) {
      const r = evaluate(text, env());
      if (r && !r.error) return { kind: "value", ...r };
      const tex = previewTex(text, env());
      return tex ? { kind: "solve", tex } : null;
    }
    return analyze(text, { ...env(), live: true });
  }

  function compute() {
    const text = input.value.trim();
    if (!text) return;
    const r = analyze(text, env());
    const live = $(".sc-live");
    if (!r) return;
    const bad = r.error || (r.kind === "value" && !Number.isFinite(r.value));
    if (bad) {
      live.className = "sc-live sc-err";
      live.innerHTML = `${icon("info")}<span>${esc(r.error ? errorText(r.error) : t("sc.errUndefined"))}</span>`;
      return;
    }
    if (r.kind === "value") {
      if (r.assign) st.vars[r.assign] = r.value;
      st.ans = r.value;
    } else if (r.kind === "complex") st.ans = r.im ? st.ans : r.re;
    else if (r.kind === "func") st.funcs[r.name] = { param: r.param, body: r.body };
    const e = entryOf(text, r);
    // vnos v minutah in sekundah (v DEG): tudi rezultat v °′″; f′(2) je odvod, ne minuta
    if (e.kind === "value" && st.angle === "deg" && /\d\s*[′″]/.test(text) && dmsOf(e.value)) e.dms = true;
    if (e.first !== undefined) {
      st.ans = e.first;
      delete e.first;
    }
    st.history.push(e);
    if (st.history.length > MAX_HISTORY) st.history.splice(0, st.history.length - MAX_HISTORY);
    save();
    input.value = "";
    recall = -1;
    update();
    renderVars();
    renderHistory(true);
    return true;
  }

  // spomin M: M+ / M− najprej izračunata vnos (če ga je), nato rezultatu prištejeta ali odštejeta M
  function memory(op) {
    if (op === "M") {
      // MR: prazen spomin je 0 (kot na kalkulatorju), sicer bi bil M neznanka
      if (!Number.isFinite(st.vars.M)) {
        st.vars.M = 0;
        save();
        renderVars();
      }
      return insert("M");
    }
    if (op === "#mc") delete st.vars.M;
    else {
      if (input.value.trim() && !compute()) return;
      const m = (Number.isFinite(st.vars.M) ? st.vars.M : 0) + (op === "#m+" ? st.ans : -st.ans);
      st.vars.M = Number(m.toPrecision(15)); // brez šuma 0,1 + 0,2
    }
    save();
    renderVars();
    const live = $(".sc-live");
    live.className = "sc-live muted";
    live.innerHTML = "M" in st.vars ? texHtml(`\\mathrm{M} = ${fmt(st.vars.M).tex}`) : esc(t("sc.mCleared"));
  }
  // tipka °′″: za številom za ° vstavi ′, za ′ pa ″ (30°15′20″); po izračunu (prazen vnos) pokaže rezultat v °′″
  function dmsKey() {
    const last = st.history[st.history.length - 1];
    if (!input.value && last && (last.kind || "value") === "value" && dmsOf(last.value)) {
      last.dms = !last.dms;
      save();
      return renderHistory(true);
    }
    const before = input.value.slice(0, input.selectionStart ?? input.value.length);
    if (/[°′″]\s*$/.test(before)) return; // brez 30°° (oznaka je že tam)
    const m = /([°′])\s*\d+(?:[.,]\d*)?$/.exec(before);
    insert(m ? (m[1] === "°" ? "′" : "″") : "°");
  }

  function actionsHtml(e, i) {
    const acts = [];
    const btn = (act, ic, label) => `<button type="button" class="sc-act" data-act="${act}" data-i="${i}">${icon(ic)}<span>${esc(t(label))}</span></button>`;
    if (e.plot?.length && opts.openGraph) acts.push(btn("plot", "chart-spline", "sc.plot"));
    if (e.cas) for (const [op, ic] of [["simplify", "sparkles"], ["expand", "maximize-2"], ["factor", "blocks"]]) acts.push(`<button type="button" class="sc-act" data-act="cas" data-op="${op}" data-i="${i}">${icon(ic)}<span>${esc(t(`sc.cas.${op}`))}</span></button>`);
    if (e.ana) {
      // ∫ dx in Taylor: spremenljivko dopišemo le, če ni x
      const v = e.ana === "x" ? "" : ` data-v="${esc(e.ana)}"`;
      acts.push(`<button type="button" class="sc-act" data-act="cas" data-op="integrate"${v} data-i="${i}" title="${esc(t("sc.cas.integrate"))}"><span aria-hidden="true" dir="ltr">∫ d${esc(e.ana)}</span><span class="sr-only">${esc(t("sc.cas.integrate"))}</span></button>`);
      acts.push(`<button type="button" class="sc-act" data-act="cas" data-op="taylor"${v} data-i="${i}" title="${esc(t("sc.cas.taylorPoly"))}">${icon("sigma")}<span>${esc(t("sc.cas.taylor"))}</span></button>`);
    }
    if (e.solveFor) for (const v of e.solveFor) acts.push(`<button type="button" class="sc-act" data-act="cas" data-op="solve" data-v="${esc(v)}" data-i="${i}">${icon("square-function")}<span>${esc(t("sc.cas.solveFor", { v }))}</span></button>`);
    if (e.steps && opts.steps && opts.canSteps?.()) acts.push(btn("steps", "list-ordered", "sc.steps"));
    if ((e.kind || "value") === "value" && primeFactors(e.value)?.some(([, k], j, a) => a.length > 1 || k > 1) && !e.fact) acts.push(btn("fact", "grid-2x2", "sc.factor"));
    // kot v stopinjah → stopinje, minute, sekunde (in nazaj), kot tipka °′″ na kalkulatorju
    if ((e.kind || "value") === "value" && st.angle === "deg" && /°|\d\s*[′″]|arc(?:sin|cos|tan|cot)/.test(e.text) && !Number.isInteger(e.value) && dmsOf(e.value))
      acts.push(`<button type="button" class="sc-act" data-act="dms" data-i="${i}" aria-pressed="${!!e.dms}" title="${esc(t("sc.toDms"))}"><span aria-hidden="true">°′″</span><span class="sr-only">${esc(t("sc.toDms"))}</span></button>`);
    if (["value", "solve", "ineq", "system", "deriv", "complex", "pair", "cas"].includes(e.kind || "value")) acts.push(btn("copy", "copy", "sc.copy"));
    return acts.length ? `<div class="sc-acts">${acts.join("")}</div>` : "";
  }

  function renderHistory(scroll) {
    const h = st.history;
    if (!h.length) {
      hist.innerHTML = `<div class="sc-empty muted"><p>${esc(t("sc.empty"))}</p><p class="sc-try">${esc(t("sc.try"))}</p>
        <div class="sc-examples">${["2x+3=7", "x²−5x+6=0", "x²<4", "x+y=3; x−y=1", "d/dx(x³)", "∫(x²;0;1)", `${commandName("factor", opts.locale?.())}(x³−8)`, "(1+2i)(3−i)"].map((x) => `<button type="button" class="chip sc-ex" data-ex="${esc(x)}">${esc(x)}</button>`).join("")}</div></div>`;
      return;
    }
    hist.innerHTML = h
      .map((e, i) => {
        const last = i === h.length - 1;
        const fact = e.fact && (e.kind || "value") === "value" ? primeFactors(e.value) : null;
        return `<div class="sc-h-row${last ? " last" : ""}">
          <button type="button" class="sc-h-expr" data-i="${i}" title="${esc(t("sc.recall"))}">${texHtml(e.tex)}</button>
          ${resultHtml(e) ? `<button type="button" class="sc-h-res" data-i="${i}" title="${esc(t("sc.useResult"))}">${resultHtml(e)}</button>` : ""}
          ${fact ? `<div class="sc-h-note muted">${texHtml(`${fmt(e.value).tex} = ${factorsTex(e.value, fact)}`)}</div>` : ""}
          ${last || !/^sc\.cas\.(symHint|eqHint)$/.test(e.note?.key || "") ? noteHtml(e) : ""}
          ${last ? actionsHtml(e, i) : ""}
        </div>`;
      })
      .join("");
    if (scroll) hist.scrollTop = hist.scrollHeight;
  }

  function renderVars() {
    const vs = Object.entries(st.vars);
    const fs = Object.entries(st.funcs);
    varsBar.hidden = !vs.length && !fs.length;
    if (varsBar.hidden) return (varsBar.innerHTML = "");
    const c = comma();
    varsBar.innerHTML =
      `<span class="sc-vars-l">${esc(t("sc.memory"))}</span>` +
      vs.map(([n, v]) => `<button type="button" class="chip sc-var" data-ins="${esc(n)}" title="${esc(t("sc.insert"))}">${texHtml(`${n} = ${formatNumber(v, { mode: "auto", comma: c }).tex}`)}</button>`).join("") +
      fs.map(([n, f]) => `<button type="button" class="chip sc-var" data-ins="${esc(n)}(" title="${esc(t("sc.insert"))}">${esc(`${n}(${f.param}) = ${f.body}`)}</button>`).join("");
  }

  function syncBar() {
    root.querySelectorAll(".sc-angle button").forEach((b) => {
      b.classList.toggle("active", b.dataset.angle === st.angle);
      b.setAttribute("aria-pressed", String(b.dataset.angle === st.angle));
    });
    const sel = $(".sc-format");
    const lbl = (f) => (f === "auto" ? t("sc.fmtAuto") : f === "sci" ? t("sc.fmtSci") : f === "eng" ? t("sc.fmtEng") : f.startsWith("fix") ? t("sc.fmtFix", { n: f.slice(3) }) : t("sc.fmtSig", { n: f.slice(3) }));
    sel.innerHTML = FORMATS.map((f) => `<option value="${f}"${f === st.format ? " selected" : ""}>${esc(lbl(f))}</option>`).join("");
  }

  function renderConsts() {
    const c = comma();
    consts.innerHTML = `<div class="sc-consts-h"><b>${esc(t("sc.constants"))}</b><button type="button" class="ghost icon-only sc-consts-x" aria-label="${esc(t("pad.close"))}">${icon("x")}</button></div>
      <div class="sc-consts-list">${CONSTANTS.map((k) => {
        const f = formatNumber(k.value, { mode: "auto", comma: c });
        return `<button type="button" class="sc-const" data-id="${k.id}"><span class="sc-c-sym">${texHtml(k.sym)}</span><span class="sc-c-name">${esc(t(`sc.c.${k.id}`))}</span><span class="sc-c-val">${texHtml(`${f.tex}\\ \\mathrm{${k.unit}}`)}</span></button>`;
      }).join("")}</div>`;
  }
  function renderMore() {
    more.innerHTML = `<div class="sc-consts-h"><b>${esc(t("sc.functions"))}</b><button type="button" class="ghost icon-only sc-more-x" aria-label="${esc(t("pad.close"))}">${icon("x")}</button></div>
      ${MORE.map(([g, keys]) => [g, keys || (g === "alg" ? algKeys() : anaKeys())]).map(([g, keys]) => `<div class="sc-more-g" data-g="${g}"><div class="sc-more-h">${esc(t(`sc.grp.${g}`))}</div><div class="sc-more-keys">${keys.map(([l, ins]) => `<button type="button" class="sc-mk" data-ins="${esc(ins)}"${g === "mem" ? ` title="${esc(t(MEM_LABEL[ins]))}" aria-label="${esc(t(MEM_LABEL[ins]))}"` : ""}>${texHtml(l)}</button>`).join("")}</div></div>`).join("")}`;
  }
  function algKeys() {
    const n = (op) => commandName(op, opts.locale?.());
    const nm = (op) => `\\operatorname{${n(op)}}`;
    return [[nm("simplify"), `${n("simplify")}(@)`], [nm("expand"), `${n("expand")}(@)`], [nm("factor"), `${n("factor")}(@)`], [`${nm("solve")}\\ (\\ldots;x)`, `${n("solve")}(@; x)`]];
  }
  function anaKeys() {
    const n = (op) => commandName(op, opts.locale?.());
    return [["\\tfrac{d}{dx}", "d/dx(@)"], ["\\tfrac{d}{dx}\\big|_{x=a}", "d/dx(@;)"], ["\\int_a^b", "∫(@;;)"], ["\\int\\!\\ldots\\,dx", `${n("integrate")}(@)`], ["\\lim\\limits_{x\\to a}", `${n("limit")}(@; x; )`], ["\\operatorname{taylor}", `${n("taylor")}(@; x; 0; 5)`], ["\\sum", "∑_(n=1)^(@) "], ["\\prod", "∏_(n=1)^(@) "], ["|x|", "abs("]];
  }
  // panel (konstante, funkcije) prekrije tipkovnico, zgodovina ostane vidna; največ en naenkrat
  function showPanel(which) {
    consts.hidden = which !== "consts";
    more.hidden = which !== "more";
    root.classList.toggle("sc-panel-open", !!which);
    $(".sc-const-btn").setAttribute("aria-expanded", String(which === "consts"));
    root.querySelector('.sc-key[data-ins="#more"]')?.setAttribute("aria-expanded", String(which === "more"));
    if (which === "consts") {
      renderConsts();
      consts.querySelector(".sc-const")?.focus({ preventScroll: true });
    } else if (which === "more") {
      renderMore();
      more.scrollTop = 0;
    }
  }

  // --- dogodki ---
  const touch = isTouch();
  if (touch) input.setAttribute("inputmode", "none");
  // tipke ne vzamejo fokusa polju (kazalec ostane na mestu)
  // držanje ◀, ▶ ali ⌫ ponavlja (kazalec se premika ali briše, dokler je prst na tipki)
  const hold = { t: 0, iv: 0, b: null };
  const stopHold = () => {
    clearTimeout(hold.t);
    clearInterval(hold.iv);
    hold.t = hold.iv = 0;
  };
  root.querySelector(".sc-keys").addEventListener("pointerdown", (e) => {
    const b = e.target.closest(".sc-key");
    if (!b) return;
    e.preventDefault();
    stopHold();
    hold.b = null;
    const step = { "#left": () => move(-1), "#right": () => move(1), "#del": () => del() }[b.dataset.ins];
    if (!step || e.button > 0 || (second && b.dataset.ins2)) return;
    // tipka skrita med držanjem (drugo orodje, zaprto okno) → ustavi
    const tick = () => (b.getClientRects().length ? step() : stopHold());
    hold.t = setTimeout(() => {
      hold.b = b; // klik ob dvigu prsta ne doda še enega koraka
      if (second) setSecond(false); // kot pri dotiku
      tick();
      hold.iv = setInterval(tick, 75);
    }, 450);
  });
  for (const ev of ["pointerup", "pointercancel", "pointerleave"]) root.querySelector(".sc-keys").addEventListener(ev, stopHold);
  window.addEventListener("blur", stopHold);
  root.querySelector(".sc-keys").addEventListener("contextmenu", (e) => e.target.closest(".sc-key") && e.preventDefault());
  more.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".sc-mk")) e.preventDefault();
  });
  root.querySelector(".sc-keys").addEventListener("click", (e) => {
    const b = e.target.closest(".sc-key");
    if (!b) return;
    const wasHeld = hold.b === b;
    hold.b = null;
    if (wasHeld && e.detail > 0) return; // tipka Enter (detail 0) ni del držanja

    const ins = second && b.dataset.ins2 ? b.dataset.ins2 : b.dataset.ins;
    if (ins === "#2nd") return setSecond(!second);
    if (ins === "#more") showPanel(more.hidden ? "more" : null);
    else if (ins === "#eq") compute();
    else if (ins === "#ac") {
      input.value = "";
      showPanel(null);
      update();
    } else if (ins === "#del") del();
    else if (ins === "#left") move(-1);
    else if (ins === "#right") move(1);
    else if (ins === "#dec") insert(comma() ? "," : ".");
    else if (ins === "#dms") dmsKey();
    else if (MEM_LABEL[ins]) memory(ins);
    else insert(ins);
    if (second && ins !== "#2nd") setSecond(false);
    if (!touch) input.focus({ preventScroll: true });
  });
  more.addEventListener("click", (e) => {
    if (e.target.closest(".sc-more-x")) return showPanel(null);
    const b = e.target.closest(".sc-mk");
    if (!b) return;
    if (MEM_LABEL[b.dataset.ins]) memory(b.dataset.ins);
    else insert(b.dataset.ins);
    showPanel(null);
    if (!touch) input.focus({ preventScroll: true });
  });
  varsBar.addEventListener("click", (e) => {
    const b = e.target.closest("[data-ins]");
    if (!b) return;
    insert(b.dataset.ins);
    if (!touch) input.focus({ preventScroll: true });
  });
  input.addEventListener("input", () => {
    recall = -1;
    update();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      compute();
    } else if (e.key === "Escape" && (input.value || root.classList.contains("sc-panel-open"))) {
      e.preventDefault();
      e.stopPropagation();
      if (root.classList.contains("sc-panel-open")) showPanel(null);
      else {
        input.value = "";
        update();
      }
    } else if ((e.key === "ArrowUp" || e.key === "ArrowDown") && st.history.length && (!input.value || recall >= 0)) {
      // ↑ prikliče prejšnje vnose (kot na pravem kalkulatorju), ↓ gre nazaj
      e.preventDefault();
      const n = st.history.length;
      recall = e.key === "ArrowUp" ? (recall < 0 ? n - 1 : Math.max(0, recall - 1)) : recall < 0 ? -1 : recall + 1;
      if (recall >= n) recall = -1;
      input.value = recall >= 0 ? st.history[recall].text : "";
      input.setSelectionRange(input.value.length, input.value.length);
      update();
    } else if (!input.value && e.key.length === 1 && "+*/^!%".includes(e.key) && st.history.length) {
      // tipkovnica: operator na začetku nadaljuje z rezultatom
      e.preventDefault();
      insert(e.key === "*" ? "×" : e.key === "/" ? "÷" : e.key);
    }
  });
  hist.addEventListener("click", async (e) => {
    const ex = e.target.closest(".sc-ex");
    if (ex) {
      input.value = ex.dataset.ex;
      input.setSelectionRange(input.value.length, input.value.length);
      update();
      compute();
      return;
    }
    const b = e.target.closest("[data-i]");
    if (!b) return;
    const it = st.history[Number(b.dataset.i)];
    if (!it) return;
    if (b.classList.contains("sc-act")) {
      const act = b.dataset.act;
      if (act === "plot") opts.openGraph?.(it.plot);
      else if (act === "steps") opts.steps?.(it.stepsText || it.text, it.op === "factor" ? "factor" : it.op === "simplify" ? "simplify" : null);
      else if (act === "cas") {
        // ukaz se zapiše v vrstico in izračuna kot vsak drug vnos (v zgodovini ga lahko prikličeš)
        const v = b.dataset.v;
        input.value = `${commandName(b.dataset.op, opts.locale?.())}(${it.text}${v ? `; ${v}` : ""})`;
        compute();
      }
      else if (act === "fact") {
        it.fact = true;
        save();
        renderHistory(false);
      } else if (act === "dms") {
        it.dms = !it.dms;
        save();
        renderHistory(false);
      } else if (act === "copy") {
        const txt = copyText(it);
        try {
          await navigator.clipboard.writeText(txt);
          opts.toast?.(t("sc.copied"));
        } catch {
          opts.toast?.(txt);
        }
      }
      return;
    }
    if (b.classList.contains("sc-h-expr")) {
      input.value = it.text;
      input.setSelectionRange(it.text.length, it.text.length);
      update();
    } else if ((it.kind || "value") === "value") insert(it.dms && dmsOf(it.value) ? dmsOf(it.value, { comma: comma() }).text.replace("−", "-") : formatNumber(it.value, { mode: "auto", comma: comma() }).text.replace(" · 10^", "E").replace("−", "-"));
    else if (it.kind === "complex") insert(`(${complexText(it)})`);
    if (!touch) input.focus({ preventScroll: true });
  });
  const complexText = (it) => {
    const c = comma();
    const n = (v) => formatNumber(v, { mode: "auto", comma: c }).text.replace(" · 10^", "E").replace("−", "-");
    if (!it.im) return n(it.re);
    return `${it.re ? `${n(it.re)}${it.im < 0 ? "-" : "+"}` : it.im < 0 ? "-" : ""}${Math.abs(it.im) === 1 ? "" : n(Math.abs(it.im))}i`;
  };
  // besedilo za odložišče: število ali rešitev v zapisu, ki ga razume vsak program (brez TeX)
  function copyText(it) {
    const c = comma();
    if (it.none) return t("sc.cas.limitNone");
    if ((it.kind || "value") === "value") return it.dms && dmsOf(it.value) ? dmsOf(it.value, { comma: c }).text : formatNumber(it.value, { mode: st.format, comma: c }).text;
    if (it.kind === "complex") return complexText(it);
    return texPlain(String(resTex(it)));
  }
  root.querySelector(".sc-angle").addEventListener("click", (e) => {
    const b = e.target.closest("[data-angle]");
    if (!b) return;
    st.angle = b.dataset.angle;
    save();
    syncBar();
    update();
  });
  $(".sc-format").addEventListener("change", (e) => {
    st.format = e.target.value;
    save();
    renderHistory(false);
    update();
  });
  $(".sc-clear-h").addEventListener("click", () => {
    st.history = [];
    st.vars = {};
    st.funcs = {};
    st.ans = 0;
    save();
    renderVars();
    renderHistory(false);
  });
  $(".sc-const-btn").addEventListener("click", () => showPanel(consts.hidden ? "consts" : null));
  consts.addEventListener("click", (e) => {
    if (e.target.closest(".sc-consts-x")) return showPanel(null);
    const b = e.target.closest(".sc-const");
    if (!b) return;
    const k = CONSTANTS.find((x) => x.id === b.dataset.id);
    showPanel(null);
    insert(`(${constantText(k, comma())})`);
    if (!touch) input.focus({ preventScroll: true });
  });

  function refresh() {
    syncBar();
    renderVars();
    renderHistory(true);
    update();
  }
  refresh();

  return {
    root,
    resize() {
      hist.scrollTop = st.history.length ? hist.scrollHeight : 0;
      if (!touch && root.isConnected) input.focus({ preventScroll: true });
    },
    reload() {
      st = load();
      setSecond(false);
      showPanel(null);
      refresh();
    },
    insert,
    get state() {
      return st;
    },
  };
}

/**
 * Pretvornik enot. opts: { t, icon, locale(), onInsert?(text) }
 */
export function createUnits(root, opts) {
  const { t, icon } = opts;
  const comma = () => usesComma(opts.locale?.());
  const saved = store.get("evklid.units") || {};
  let q = QUANTITIES.find((x) => x.id === saved.q) || QUANTITIES[0];
  let from = q.units.some((u) => u[0] === saved.from) ? saved.from : q.units[1]?.[0] || q.units[0][0];
  let to = q.units.some((u) => u[0] === saved.to) ? saved.to : q.units[0][0];
  let value = typeof saved.value === "string" ? saved.value : "1";

  root.classList.add("un");
  root.innerHTML = `<div class="un-wrap">
      <div class="chip-row un-q" role="tablist" aria-label="${esc(t("sc.quantity"))}"></div>
      <div class="card un-card">
        <label class="un-field"><span>${esc(t("sc.value"))}</span><input class="un-val" inputmode="decimal" autocomplete="off"></label>
        <div class="un-pair">
          <label class="un-field"><span>${esc(t("sc.from"))}</span><select class="un-from"></select></label>
          <button type="button" class="ghost icon-only un-swap" title="${esc(t("sc.swap"))}" aria-label="${esc(t("sc.swap"))}">${icon("arrow-left-right")}</button>
          <label class="un-field"><span>${esc(t("sc.to"))}</span><select class="un-to"></select></label>
        </div>
        <div class="un-result" aria-live="polite"></div>
        ${opts.onInsert ? `<button type="button" class="secondary small un-ins">${icon("calculator")}<span>${esc(t("sc.toCalc"))}</span></button>` : ""}
      </div>
      <div class="un-all-h muted">${esc(t("sc.allUnits"))}</div>
      <div class="un-all"></div>
    </div>`;
  const $ = (s) => root.querySelector(s);
  const num = () => {
    let s = $(".un-val").value.trim().replace(/\s/g, "").replace("−", "-");
    if (comma()) s = s.replace(",", ".");
    return s === "" ? NaN : Number(s);
  };
  const show = (v) => formatNumber(v, { mode: "auto", comma: comma() });

  function renderQ() {
    $(".un-q").innerHTML = QUANTITIES.map((x) => `<button type="button" class="${x === q ? "active" : ""}" role="tab" aria-selected="${x === q}" data-q="${x.id}">${esc(t(`sc.q.${x.id}`))}</button>`).join("");
    const opt = (sel) => q.units.map((u) => `<option value="${esc(u[0])}"${u[0] === sel ? " selected" : ""}>${esc(u[0])}</option>`).join("");
    $(".un-from").innerHTML = opt(from);
    $(".un-to").innerHTML = opt(to);
  }
  function calc() {
    const v = num();
    const r = convert(v, q.id, from, to);
    const out = $(".un-result");
    if (!Number.isFinite(r)) {
      out.innerHTML = `<span class="muted">—</span>`;
      $(".un-all").innerHTML = "";
    } else {
      out.innerHTML = texHtml(`${show(v).tex}\\ \\text{${from}} = \\mathbf{${show(r).tex}}\\ \\text{${to}}`);
      $(".un-all").innerHTML = q.units
        .filter((u) => u[0] !== from)
        .map((u) => `<button type="button" class="un-row" data-u="${esc(u[0])}"><span>${texHtml(show(convert(v, q.id, from, u[0])).tex)}</span><b>${esc(u[0])}</b></button>`)
        .join("");
    }
    store.set("evklid.units", { q: q.id, from, to, value: $(".un-val").value });
    return r;
  }
  $(".un-val").value = value;
  renderQ();
  calc();
  $(".un-q").addEventListener("click", (e) => {
    const b = e.target.closest("[data-q]");
    if (!b) return;
    q = QUANTITIES.find((x) => x.id === b.dataset.q);
    from = q.units[1]?.[0] || q.units[0][0];
    to = q.units[0][0];
    renderQ();
    calc();
  });
  $(".un-val").addEventListener("input", calc);
  $(".un-from").addEventListener("change", (e) => {
    from = e.target.value;
    calc();
  });
  $(".un-to").addEventListener("change", (e) => {
    to = e.target.value;
    calc();
  });
  $(".un-swap").addEventListener("click", () => {
    [from, to] = [to, from];
    renderQ();
    calc();
  });
  $(".un-all").addEventListener("click", (e) => {
    const b = e.target.closest("[data-u]");
    if (!b) return;
    to = b.dataset.u;
    renderQ();
    calc();
  });
  $(".un-ins")?.addEventListener("click", () => {
    const r = calc();
    if (Number.isFinite(r)) opts.onInsert(show(r).text.replace(" · 10^", "E").replace("−", "-"));
  });
  return { root, resize() {}, reload() {} };
}
