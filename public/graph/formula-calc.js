// Formula iz zbirke (LaTeX) v zapis znanstvenega kalkulatorja: »v = v_0 + a t« → »v = v₀ + a t«.
// Učenec v kalkulatorju zamenja znane črke s števili in pritisne =; kalkulator reši enačbo za preostalo
// neznanko (public/graph/scisolve.js). Formul, ki jih kalkulator ne zna (integrali, vsote, limite, ±, vektorski
// produkti, enote …), ne pretvorimo: vrne null in gumba »V kalkulator« ni. Preverjeno v test/formula-calc.test.js.
import { fromTex } from "./math.js";
import { evaluate } from "./scicore.js";

const GREEK = {
  alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ε", varepsilon: "ε", zeta: "ζ", eta: "η", theta: "θ", vartheta: "θ",
  iota: "ι", kappa: "κ", lambda: "λ", mu: "μ", nu: "ν", xi: "ξ", pi: "π", rho: "ρ", varrho: "ρ", sigma: "σ", tau: "τ",
  upsilon: "υ", phi: "φ", varphi: "φ", chi: "χ", psi: "ψ", omega: "ω", Gamma: "Γ", Theta: "Θ", Lambda: "Λ", Phi: "Φ", Psi: "Ψ", Omega: "Ω",
};
// Česar kalkulator ne zna ali bi pomenilo kaj drugega (∑ ni vsota, ± ni ena enačba, ⇒ ni zveza …).
const NE = /\\(int|iint|oint|sum|prod|lim|binom|dbinom|tbinom|overline|overrightarrow|bar|hat|tilde|dot|ddot|pm|mp|neq|ne|approx|sim|simeq|cong|equiv|propto|parallel|perp|angle|measuredangle|triangle|square|in|notin|subset|subseteq|cup|cap|setminus|forall|exists|Rightarrow|Leftrightarrow|rightarrow|leftarrow|to|mapsto|ldots|cdots|dots|vdots|begin|end|mathbb|mathcal|underbrace|overbrace|mid|nmid|not|times\s*\\vec|vec\s*\{[^{}]*\}\s*\\times|log_|circ|prime|partial|nabla|infty|det|gcd|max|min|deg|arg|Re|Im|lfloor|rfloor|lceil|rceil|langle|rangle|wedge|vee|oplus|odot|otimes|quad\s*\\text|text\s*\{\s*(za|če|ko|in|ali|pri)\b)/;
const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
const SUB = { 0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄", 5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉" };

// Odstrani odvečne oklepaje, ki jih pusti fromTex: »F = ((G m₁ m₂)/(r²))« → »F = (G m₁ m₂)/r²«.
// Odstranimo oklepaj okoli enega imena, števila ali sqrt(…), dvojni oklepaj, oklepaj okoli ulomka med + in −
// ter oklepaj, ki objame celo stran enačbe. Oklepaj za imenom (sqrt(x), F_(tr)) ali za številom (2(a + b))
// ostane, ker je del funkcije, indeksa ali zmnožka. Da se pomen ne spremeni, preverja test/formula-calc.test.js.
// eno ime (a, v₀, ΔW, F_(tr), r²) ali eno število; »2π« ali »ab« sta zmnožka, ne eno ime
const IME1 = "Δ?[A-Za-zα-ωΑ-Ω](?:_\\([A-Za-z0-9]+\\)|_[A-Za-z0-9]|[₀-₉]+)?";
const ATOM = new RegExp(`^-?(?:${IME1}|\\d+(?:\\.\\d+)?)[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]*$`);
const FUNC = /^(sqrt|cbrt)\((?:[^()]|\([^()]*\))*\)$/;
// del ulomka: ime, število ali oklepaj; ulomek »X/Y« brez drugih operacij na vrhnji ravni
const DEL = `(?:${IME1}[⁰¹²³⁴⁵⁶⁷⁸⁹]*|\\d+(?:\\.\\d+)?|\\((?:[^()]|\\([^()]*\\))*\\))`;
const ULOMEK = new RegExp(`^${DEL}/${DEL}$`);
function cleanParens(s) {
  for (let guard = 0; guard < 80; guard++) {
    const stack = [];
    let cut = null;
    for (let i = 0; i < s.length && !cut; i++) {
      if (s[i] === "(") stack.push(i);
      else if (s[i] === ")") {
        const o = stack.pop();
        if (o === undefined) return s;
        const pre = s.slice(0, o).trimEnd();
        const inner = s.slice(o + 1, i).trim();
        const post = s.slice(i + 1).trimStart();
        if (s[o - 1] === "(" && s[i + 1] === ")") cut = [o, i]; // ((…)) → (…)
        if (cut || /[A-Za-zα-ωΑ-ΩΔ0-9_₀-₉⁰-⁹]$/.test(pre)) continue; // funkcija, indeks ali zmnožek
        const whole = (pre === "" || pre.endsWith("=")) && (post === "" || post.startsWith("="));
        // »-(a)« in »^(-1)«: minus v oklepaju ostane, razen če oklepaj objame celo stran
        const atom = (ATOM.test(inner) || FUNC.test(inner)) && (!inner.startsWith("-") || whole) && !(pre.endsWith("^") && /[⁰-⁹⁻]/.test(inner));
        const ulomek = ULOMEK.test(inner.replace(/\s*\/\s*/, "/")) && /(^|[=+\-(])$/.test(pre) && /^($|[=+\-)])/.test(post);
        if (atom || whole || ulomek) cut = [o, i];
      }
    }
    if (!cut) break;
    s = s.slice(0, cut[0]) + s.slice(cut[0] + 1, cut[1]) + s.slice(cut[1] + 1);
  }
  return s.replace(/\s+/g, " ").trim();
}

// Klikljive formule (formula-data.js annotateTex) ovijejo simbole v \htmlData{fx=…}{v_0}; KaTeX ima v MathML
// tak, označen LaTeX. Ovoj odstranimo, vsebina ostane: »\htmlData{fx=…}{v}_0 t« → »v_0 t«.
function brezOznak(tex) {
  let s = tex;
  const konec = (j) => {
    let d = 0;
    for (let q = j; q < s.length; q++) {
      if (s[q] === "\\") q++;
      else if (s[q] === "{") d++;
      else if (s[q] === "}" && --d === 0) return q + 1;
    }
    return s.length;
  };
  for (let guard = 0; guard < 200; guard++) {
    const i = s.indexOf("\\htmlData{");
    if (i < 0) break;
    const j = konec(i + 9);
    if (s[j] !== "{") {
      s = s.slice(0, i) + s.slice(j);
      continue;
    }
    let e = konec(j);
    let a = i;
    // odvečen oklepaj okoli ovoja »2 \pi {\htmlData{…}{r}}«; oklepaj ukaza (\vec{…}, ^{…}, \frac{…}{…}) ostane
    if (s[i - 1] === "{" && s[e] === "}" && !/(\\(vec|sqrt|d?t?frac|mathrm|text|hat|bar|tilde|dot|overline|operatorname)|[\^_}\]])\s*$/.test(s.slice(0, i - 1))) {
      a = i - 1;
      e += 1;
    }
    const inner = s.slice(j + 1, konec(j) - 1);
    const next = s[e] || "";
    s = s.slice(0, a) + inner + (/[A-Za-z0-9\\]/.test(next) ? " " : "") + s.slice(e);
  }
  return s;
}

const FN = "arcsin|arccos|arctan|sinh|cosh|tanh|sin|cos|tan|cot|ln|log";
// funkcija brez oklepaja in njen argument do naslednjega operatorja ali funkcije (kot ga bere kalkulator)
const TRIG_ARG = new RegExp(`\\b(${FN})([²³]?) (?!\\()((?:(?!(?:${FN})\\b)[^\\s+\\-=)(·/:])+(?: (?!(?:${FN})\\b)[^\\s+\\-=)(·/:]+)*)`, "g");

/**
 * Ali formula računa s koti v radianih (sin ω t, cos(x + 2kπ)): gumb tedaj kalkulator preklopi v RAD.
 * Koti α, β, γ, φ … (trikotnik, met, lom) ostanejo v stopinjah.
 */
export function vRadianih(text) {
  const s = String(text ?? "").replace(/_\([^)]*\)|_[A-Za-z0-9]|[₀-₉]/g, "");
  const re = /\b(sin|cos|tan|cot)[²³]?(?:\(((?:[^()]|\([^()]*\))*)\)|\s+(\S+))/g;
  for (const m of s.matchAll(re)) if (/[πωνktxi]/.test(m[2] ?? m[3] ?? "")) return true;
  return false;
}

// »a + b = b + a«, »(a − b)² = a² − 2ab + b²«: obe strani sta enaki pri vseh vrednostih črk, zato ni neznanke,
// ki bi jo kalkulator izračunal. Preverimo pri treh naključnih pozitivnih vrednostih (radiani).
function istovetnost(text) {
  const [l, d] = text.split("=");
  const imena = new Set([l, d].flatMap((x) => evaluate(x, { vars: {}, funcs: {} })?.error?.info?.names || []));
  if (!imena.size) return false;
  for (const seme of [0.37, 0.61, 0.83]) {
    const vars = {};
    let k = 0;
    for (const n of imena) vars[n] = 1.1 + ((seme * 97 * ++k) % 1.7);
    const a = evaluate(l, { vars, funcs: {}, deg: false });
    const b = evaluate(d, { vars, funcs: {}, deg: false });
    if (a?.error || b?.error || !Number.isFinite(a?.value) || !Number.isFinite(b?.value)) return false;
    if (Math.abs(a.value - b.value) > 1e-9 * Math.max(1, Math.abs(a.value))) return false;
  }
  return true;
}

/**
 * LaTeX ene formule → besedilo za vnosno polje kalkulatorja ali null, če je kalkulator ne zna.
 * Verigo »v = 2πr/t₀ = ωr« skrajša na prvo zvezo (v = 2πr/t₀). Pri fiziki in kemiji formul s črko e
 * (osnovni naboj) ali τ ne pretvorimo, ker sta v kalkulatorju konstanti e = 2,718… in τ = 2π.
 * surovo: vrne zapis pred lepšanjem (brez odvečnih oklepajev, ², ₀ in √), da test primerja pomen.
 */
export function formulaToCalc(tex, subject = "MAT", { surovo = false } = {}) {
  let s = brezOznak(String(tex ?? ""))
    .replace(/^(\s|\\[,;:! ]|\\q?quad)+|(\s|\\[,;:! ]|\\q?quad|[,.;])+$/g, "")
    .replace(/\\limits|\\displaystyle|\\nolimits/g, "");
  // indeks z besedilom ali več znaki: h_{\max} → h_(max), F_{\mathrm{tr}} → F_(tr), m_{1} → m_1
  s = s.replace(/_\{\s*(?:\\(?:mathrm|text|textrm|rm|mathit)\s*)?\{?\s*\\?([A-Za-z0-9]+)\s*\}?\s*\}/g, (m, x) => (x.length === 1 ? `_${x}` : `_(${x})`));
  if (!s.includes("=") || NE.test(s) || /[<>]|\\[lg]e|\\leq|\\geq/.test(s)) return null;
  if (/_\{|\\mathrm|\\text|\\operatorname/.test(s)) return null; // enote, besedilo ali indeks z več deli
  // C_n^r, V_n^r: oznaka kombinacij, ne potenca; dV, dr, dφ: diferencial; A·x⃗ = b⃗ v matematiki: matrike
  if (/_[A-Za-z0-9]\^[A-Za-z{]/.test(s) || /(^|[^A-Za-z\\])d(?:[A-Za-z]|\\(?:varphi|phi|theta|vartheta|rho|alpha|omega|lambda|mu|nu)\b)/.test(s)) return null;
  if (subject === "MAT" && /\\vec|\^\{?T\b/.test(s)) return null; // vektorji in transponirane matrike
  // »d x = Δx« (diferencial) in »(A B)⁻¹ = B⁻¹ A⁻¹« (inverz matrik) v matematiki
  if (subject === "MAT" && (/(^|[^A-Za-z\\])d\s+[A-Za-z]\b/.test(s) || /\)\s*\^\{?-1/.test(s))) return null;
  s = s
    .replace(/\\vec\s*\{([^{}]*)\}/g, "$1")
    .replace(/\\vec\s*([A-Za-z])/g, "$1")
    .replace(/\\Delta\s*/g, "Δ")
    .replace(/\\([A-Za-z]+)/g, (m, w) => (GREEK[w] ? `${GREEK[w]} ` : m))
    .replace(/ +(?=[_^])/g, "");
  // ukaz, ki ga ne poznamo (\hbar, \ell …), bi fromTex razbil v črke h·b·a·r
  const ZNANI = /^(d?t?frac|sqrt|sin|cos|tan|cot|arcsin|arccos|arctan|sinh|cosh|tanh|ln|log|exp|cdot|times|div|left|right|big|Big|bigg|Bigg|pi)$/;
  if ([...s.matchAll(/\\([A-Za-z]+)/g)].some((m) => !ZNANI.test(m[1]))) return null;
  let out = fromTex(s);
  if (/[\\'\[\]{}|,;]/.test(out) || !/[A-Za-zα-ωΑ-ΩΔ]/.test(out)) return null;
  // P(A), m(A), f(x), n(e⁻): zapis funkcije, ne zmnožek (kalkulator bi bral P·A)
  if (/(^|[^A-Za-z])[A-Za-zα-ωΑ-Ω](_\w|_\(\w+\))?\s*\(/.test(out)) return null;
  // samo ena zveza: »a = b = c« → »a = b«
  const parts = out.split("=");
  if (parts.length > 2) {
    // »E = D = λ«, »I = I₁ = I₂«: prva zveza samih imen ni formula za račun
    if (ATOM.test(parts[0].trim()) && ATOM.test(parts[1].trim())) return null;
    out = `${parts[0]}=${parts[1]}`;
  }
  if (surovo) return out; // za test: zapis pred lepšanjem mora pomeniti isto kot končni
  out = out
    .replace(/\^(?:\((\d)\)|(\d))(?![\d.(])/g, (m, a, b) => SUP[a ?? b])
    .replace(/\^\((-)(\d)\)/g, (m, _, d) => `⁻${SUP[d]}`)
    .replace(/([A-Za-zα-ωΑ-ΩΔ])_(\d)(?![\d(])/g, (m, a, d) => `${a}${SUB[d]}`)
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")");
  out = cleanParens(out)
    .replace(/\s*\*\s*/g, " · ")
    .replace(/\s*\/\s*/g, "/")
    .replace(/([^\s(/])(?=(sqrt|cbrt)\()/g, "$1 ")
    .replace(/\b(arcsin|arccos|arctan|sinh|cosh|tanh|sin|cos|tan|cot|ln|log|exp) \(/g, "$1(")
    .replace(/\bsqrt\(/g, "√(")
    .replace(/\bcbrt\(/g, "∛(")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/\s+(?=[⁰¹²³⁴⁵⁶⁷⁸⁹⁻])/g, "")
    .replace(/(^|[=(]\s*)-\s+/g, "$1-")
    .replace(/\s*=\s*/, " = ")
    .replace(/\s+/g, " ")
    .trim();
  // argument funkcije z več faktorji v oklepaj: »sin 2α« → »sin(2α)«, »sin ω t« → »sin(ω t)«; ko učenec vpiše
  // števila (sin 2·30), bi kalkulator sicer bral sin(2)·30
  out = out.replace(TRIG_ARG, (m, f, sup, arg) => (/\s/.test(arg) || /^\d+(\.\d+)?[^\d.]/.test(arg) ? `${f}${sup}(${arg})` : m));
  const crke = out.replace(/_\([^)]*\)|_[A-Za-z0-9]/g, "").replace(/\b(root|arcsin|arccos|arctan|sinh|cosh|tanh|sin|cos|tan|cot|ln|log|exp)\b/g, "");
  if (subject !== "MAT" && /[eτ]/.test(crke)) return null;
  // v matematiki je e Eulerjevo število; formule z e kot črko (diagonali e, f; gorišče e) ne gredo v kalkulator
  if (subject === "MAT" && /(^|[^A-Za-z])e(?![\^A-Za-z])/.test(crke)) return null;
  // vsaj dve različni črki, sicer je to istovetnost ali pogoj (a⁰ = 1, i² = −1, D = 0), ne formula za račun
  const imena = new Set(crke.match(/Δ?[A-Za-zα-ωΑ-Ω]/g)?.filter((c) => c !== "π" && !(subject === "MAT" && (c === "e" || c === "i"))) || []);
  if (imena.size < 2) return null;
  if (istovetnost(out)) return null;
  return out;
}
