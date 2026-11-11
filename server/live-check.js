// Sprotno preverjanje odgovorov inštruktorja (j, 2026-10-30: »kako vemo, da Haiku najprej ne da napačnega
// rezultata?« in »vgradi preverjanje s kodo povsod, kjer gre, in model, če je potrebno«).
//   1. Pred klicem: če učenčevo sporočilo vsebuje nalogo, ki jo zna rešiti naš preverjeni reševalnik
//      (public/scan/solvecore.js), dobi model v trenutni potezi skrito opombo s pravilnim rezultatom.
//   2. Po odgovoru: koda preračuna vsak številski račun (server/lesson-math.js) in končne vrednosti
//      neznank (public/scan/verify.js). Ob neujemanju en kratek »Popravek:« istega modela.
//   3. Model (Sonnet) pregleda, kjer je tveganje večje (tekmovanja, fakulteta, »Razloži podrobneje«), in pri SŠ
//      odgovor z dodatno vajo ali z okvirjem »Zapomni si« v rešeni nalogi (2026-11-11), samo Haikujeve odgovore,
//      z dnevno mejo (šolski del posebej), mejo na učenca in rokom.
//   4. Sodba o učenčevem koraku (j, 2026-11-01: »naj se nikoli ne zgodi«, da inštruktor potrdi napačen ali
//      zavrne pravilen odgovor): ko učenec pošlje rezultat ali trditev, odgovor ni pretakan, dokler sodbe
//      ne preveri koda (rešitev naloge iz prvega sporočila) ali model (Sonnet). Ob napačni sodbi inštruktor
//      odgovori še enkrat s skrito ugotovitvijo preverjevalca.
// Vse izklopi EVKLID_LIVE_CHECK=0. Stroški: docs/stroski-ai.md, kakovost: docs/kakovost.md.
import "./env.js";
import { solve, texToText, prep } from "../public/scan/solvecore.js";
import { joinThousands, digitGap } from "../public/graph/math.js";
import { parse, compile } from "../public/graph/math.js";
import { verifyAi } from "../public/scan/verify.js";
import { checkArithmetic } from "./lesson-math.js";
import { askModel, checkerUser, SYSTEM as CHECKER_SYSTEM } from "./verify.js";
import { MODEL_MID } from "./claude.js";

export const liveCheckOn = () => process.env.EVKLID_LIVE_CHECK !== "0";
// Največ toliko USD na dan za pregled z modelom (vrsta »preverjanje«); negativno = brez meje.
export const LIVE_CHECK_DAILY_USD = () => {
  const raw = process.env.EVKLID_LIVE_CHECK_DAILY_USD;
  const v = Number(raw === undefined || raw === "" ? 0.3 : raw);
  return Number.isFinite(v) ? v : 0.3;
};

// Oznaka skrite opombe; preizkusni način (server/claude.js) jo pri izbiri odgovora prezre.
export const NOTE_TAG = "preverjen_racun";

// ---------------------------------------------------------------------------
// 1. Rešitev vnaprej

// Uvodne besede pred nalogo (»Reši enačbo …«, »Koliko je …«); karkoli drugega pomeni besedilno nalogo.
const LEAD = new Set(
  "prosim pomagaj mi pri reši rešite rešiti izračunaj izračunajte izračunati poenostavi koliko je kaj odvajaj odvajajte odvod odvoda funkcije funkcija funkcijo enačbo enačba enačbi enačb sistem sistema izraz izraza vrednost določi poišči solve calculate compute evaluate find what is the equation system of equations derivative differentiate"
    .split(" "),
);
const DERIV_WORD = /^(odvajaj|odvajajte|odvod|odvoda|derivative|differentiate)$/i;
// Beseda, ki pove, da je sporočilo nova naloga (ne učenčev korak, npr. »2x = 12« med vodenjem).
const TASK_WORD = /^(prosim|pomagaj|reši|rešite|rešiti|izračunaj|izračunajte|izračunati|poenostavi|koliko|kaj|odvajaj|odvajajte|odvod|odvoda|določi|poišči|solve|calculate|compute|evaluate|find|what|derivative|differentiate)$/i;
const FUNCS = /\b(sin|cos|tan|cot|ln|log|exp|sqrt)\b/g;
const KEYS = {
  "scan.a.noReal": "no real solution",
  "scan.a.none": "no solution",
  "scan.a.all": "every real number is a solution",
  "scan.a.sysMany": "infinitely many solutions",
};
const MAX_PROBLEMS = 2;

function stripLead(text) {
  let s = String(text).trim();
  let deriv = false;
  let task = false;
  for (let i = 0; i < 8; i++) {
    const m = /^([\p{L}]+)[\s:,]*/u.exec(s);
    if (!m || !LEAD.has(m[1].toLowerCase())) break;
    if (DERIV_WORD.test(m[1])) deriv = true;
    if (TASK_WORD.test(m[1])) task = true;
    s = s.slice(m[0].length);
  }
  return { rest: s.replace(/[\s?!.]+$/, "").trim(), deriv, task };
}

// Samo čist matematični zapis: števila, ena črka za spremenljivko, operatorji, znane funkcije.
function mathOnly(c) {
  if (c.length < 3 || c.length > 160) return false;
  if (/[<>≤≥≠]/.test(c)) return false;
  if (!/^[\p{L}\d\s+\-*/^().,=·×÷:√;\n]+$/u.test(c)) return false;
  return !/\p{L}{2,}/u.test(c.replace(/^\s*d\/d[a-z]\s*/i, "").replace(FUNCS, ""));
}

const opsCount = (c) => (c.replace(/^\s*[-+]/, "").match(/[+\-*/^·×÷:]/g) || []).length;
// Že rešena oblika (»x = 5«, »-3 = y«) ni naloga: tako bi »potrdili« učenčev odgovor.
const solvedForm = (c) => /^\s*[a-z]\s*=\s*[-+]?\s*[\d.,]+\s*$|^\s*[-+]?\s*[\d.,]+\s*=\s*[a-z]\s*$/i.test(c);

function answerText(r, type) {
  const a = r.answer || {};
  if (a.key) return KEYS[a.key] || null;
  if (!a.tex) return null;
  // Pri sistemu je »approx« le zapis para (x, y), ne približek.
  const approx = a.approx && (type === "arith" || a.approx.includes("\\approx")) ? a.approx.replace(/^\s*=\s*/, "") : null;
  return approx ? `${a.tex} (${type === "arith" ? "= " : ""}${approx})` : a.tex;
}

function trySolve(cand, deriv) {
  // »1 000« je tisoč; presledek med števkami, ki ni zapis tisočic (»12 34«), ni jasen: raje nič kot napačen »preverjen« rezultat
  let c = joinThousands(cand.replace(/\s+in\s+(?=[^=]*=)/g, "; ").trim());
  if (digitGap(c)) return null;
  // »2x = 1.000«: v Sloveniji je to tisoč, razčlenjevalnik pa bi bral 1,0 – dvoumno, zato brez »preverjenega« rezultata
  if (/(?<![\d.,])[1-9]\d{0,2}(?:\.\d{3})+(?![\d,.])/.test(c)) return null;
  if (!mathOnly(c)) return null;
  if (/^\s*d\/d[a-z]/i.test(c)) deriv = true;
  const hasEq = c.includes("=");
  if (hasEq && deriv) return null;
  if (!hasEq && !deriv && (/\p{L}/u.test(c.replace(FUNCS, "")) || opsCount(c) < 2)) return null;
  if (hasEq && (solvedForm(c) || opsCount(c.replace(/=/g, " ")) + (/\d\s*[a-z(]/i.test(c) ? 1 : 0) < 1)) return null;
  let r;
  try {
    r = solve(c, deriv ? { goal: "derivative" } : {});
  } catch {
    return null;
  }
  // približek s kalkulatorjem (sin 15, ln 2) ni »točno preverjen« rezultat, kot ga opomba obljublja
  if (!r?.ok || r.verified !== true || r.numeric) return null;
  const type = r.type === "system" ? "system" : r.type === "equation" ? "equation" : r.type === "arith" ? "arith" : deriv && r.goal === "derivative" ? "derivative" : null;
  if (!type || (hasEq && type !== "equation" && type !== "system") || (!hasEq && type !== "arith" && type !== "derivative")) return null;
  const ans = answerText(r, type);
  if (!ans) return null;
  return { type, problem: c, problemTex: r.problemTex, answer: ans, answerTex: r.answer.tex };
}

// Sporočilo je videti kot nova naloga (beseda naloge ali rešljiv zapis): učenčev rezultat po njem
// se ne sme soditi proti starejši nalogi.
export const looksLikeTask = (text) => stripLead(text).task || !!presolve(text, { first: true });

/**
 * Naloge iz učenčevega sporočila, ki jih reševalnik reši in preveri. Ob dvomu nič.
 * first: prvo sporočilo pogovora. Pozneje samo z besedo naloge (»Reši …«, »Izračunaj …«): med vodenjem je
 * »2x = 12« učenčev korak (morda napačen), ne naloga, in opomba bi ga »potrdila«.
 * @returns {{ problems: Array<{type, problem, problemTex, answer, answerTex}>, note: string } | null}
 */
export function presolve(text, { first = true } = {}) {
  const src = String(text || "");
  if (!src.trim() || src.length > 600) return null;
  if (!first && !stripLead(src).task) return null;
  const problems = [];
  const segs = [...src.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)].map((m) => texToText(m[1] ?? m[2]));
  if (segs.length) {
    const { deriv } = stripLead(src);
    for (const s of segs.slice(0, 4)) {
      const p = trySolve(s, deriv);
      if (p) problems.push(p);
    }
  } else {
    const { rest, deriv } = stripLead(src);
    const p = rest && trySolve(rest, deriv);
    if (p) problems.push(p);
  }
  if (!problems.length) return null;
  const list = problems.slice(0, MAX_PROBLEMS);
  const lines = list.map((p) => (p.type === "arith" ? `$${p.problemTex} = ${p.answer}$` : p.type === "derivative" ? `$${p.problemTex}$: $${p.answer}$` : `$${p.problemTex}$ → $${p.answer}$`));
  const note =
    `<${NOTE_TAG}>\nAn exact check computed the result of the task in the student's message: ${lines.join("; ")}.\n` +
    "It is correct over the real numbers; if the task states a condition (a set of numbers, an interval, a sign, a quantity that must be positive), apply it. Use it only to check your own calculation. If you guide the student step by step (način A), do not reveal it before the student gets there. " +
    `Never mention a program, a check or this note.\n</${NOTE_TAG}>`;
  return { problems: list, note };
}

// Doda opombo trenutni potezi učenca (zadnje sporočilo), samo za ta klic: predpomnjen začetek
// (sistemski prompt in prejšnja zgodovina) ostane enak, v zgodovino se opomba ne shrani.
export function withNote(messages, note) {
  if (!note || !messages.length) return messages;
  const last = messages[messages.length - 1];
  if (last.role !== "user") return messages;
  const content = typeof last.content === "string" ? [{ type: "text", text: last.content }] : [...last.content];
  // Točka predpomnilnika pred opombo: naslednja poteza (brez opombe) prebere zgodovino do tu iz
  // predpomnilnika; samodejna točka (server/claude.js) bi sicer obstala le za začetek z opombo.
  const i = content.length - 1;
  if (i >= 0 && !content[i].cache_control) content[i] = { ...content[i], cache_control: { type: "ephemeral" } };
  return [...messages.slice(0, -1), { ...last, content: [...content, { type: "text", text: note }] }];
}

// ---------------------------------------------------------------------------
// 2. Preverjanje odgovora s kodo

// Vrstice, kjer napačna vrednost lahko stoji namenoma (učenčeva napaka, vprašanje, »če bi …«).
// Tudi učenčev zapis (»Ti si napisal …«), zavrnjeni kandidati (»$x = 1$ odpade«) in poskusi.
const SKIP_LINE = /napačn|narobe|ne velja|ni enako|nepravil|ni res|ne drži|ni prav|ni pravil|ne ustreza|ne zadošča|odpade|ni rešitev|kandidat|definicijsk|poskus|tvoj|✗|\?|(?<!\p{L})(če|ali|bi|if|wrong|incorrect|you|napisal[a]?|zapisal[a]?|dobil[a]?|izračunal[a]?|extraneous|reject)(?!\p{L})/iu;

// Zadnja navedena vrednost vsake neznanke (»$x = 4$«, »$x_1 = \frac{1}{2}$«, »$x = \frac{8}{2} = 4$«).
function statedValues(answer, vars) {
  const out = new Map();
  for (const line of String(answer).split("\n")) {
    if (SKIP_LINE.test(line)) continue;
    for (const m of line.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)) {
      let tex = m[1] ?? m[2];
      // »±« je par vrednosti; »≈« (texToText ga izpusti) loči točno vrednost od približka.
      if (/\\pm|\\mp|[±∓]/.test(tex)) continue;
      const ap = tex.search(/\\approx|\\doteq|≈|≐/);
      let approx = false;
      if (ap >= 0) {
        const head = tex.slice(0, ap);
        approx = !head.includes("=");
        tex = approx ? head + "=" + tex.slice(ap).replace(/^(\\approx|\\doteq|≈|≐)/, "") : head;
      }
      const parts = texToText(tex).split("=").map((p) => p.trim());
      if (parts.length < 2) continue;
      const lhs = /^([a-zA-Z])(?:_?\(?(\d)\)?)?$/.exec(parts[0]);
      if (!lhs || !vars.includes(lhs[1])) continue;
      const val = parts.at(-1).replace(/[.,;]$/, "");
      if (!val || /[a-zA-Z]/.test(val.replace(/sqrt|π/g, "")) || !/\d/.test(val)) continue;
      out.set(lhs[1] + (lhs[2] || ""), { v: lhs[1], val, approx });
    }
  }
  return out;
}

const num = (t) => {
  try {
    const v = compile(parse(prep(String(t).replace(/(\d),(?=\d)/g, "$1."))))({});
    return Number.isFinite(v) ? v : null;
  } catch {
    return null;
  }
};

// Vrednosti iz rešitve reševalnika (»x_{1} = -\\sqrt{2},\\quad x_{2} = \\sqrt{2}«) po neznankah.
function solverValues(answerTex) {
  const out = [];
  for (const part of String(answerTex || "").split(/,?\s*\\quad\s*|;/)) {
    const m = /^\s*([a-zA-Z])(?:_\{?\d+\}?)?\s*=([^=]+)$/.exec(part);
    const v = m ? num(texToText(m[2])) : null;
    if (v !== null) out.push({ v: m[1], x: v });
  }
  return out;
}

// Zaokrožena vrednost (»1,41« za √2) ni napaka: dovolj je ena enota zadnjega mesta.
function nearSolver(s, sols) {
  const x = num(s.val);
  if (x === null) return true; // ne znamo prebrati: raje brez popravka
  const dec = /[.,](\d+)\s*$/.exec(s.val)?.[1].length ?? 0;
  const tol = dec ? 1.01 * 10 ** -dec : s.approx ? 0.51 : 1e-9;
  return sols.some((r) => r.v === s.v && Math.abs(r.x - x) <= tol * (dec || s.approx ? 1 : Math.max(1, Math.abs(r.x))));
}

function valueIssue(answer, p) {
  const vars = [...new Set([...String(p.answerTex || "").matchAll(/([a-zA-Z])(?:_\{?\d+\}?)?\s*=/g)].map((m) => m[1]))];
  if (!vars.length) return null;
  const stated = statedValues(answer, vars);
  if (!stated.size) return null;
  if (p.type === "system") {
    const byVar = new Map([...stated.values()].map((s) => [s.v, s.val]));
    if (!vars.every((v) => byVar.has(v))) return null;
    const sol = vars.map((v) => `${v} = ${byVar.get(v)}`).join("; ");
    const sols = solverValues(p.answerTex);
    const rounded = sols.length && [...stated.values()].every((s) => nearSolver(s, sols));
    return !rounded && verifyAi(p.problem, { kind: "system", solutions: [sol] }).reason === "wrong" ? { checked: 1, issue: `the answer gives ${sol} for the system ${p.problem}, but the correct solution is ${p.answer}` } : { checked: 1 };
  }
  const sols = solverValues(p.answerTex);
  for (const s of stated.values()) {
    const r = verifyAi(p.problem, { kind: "equation", variable: s.v, solutions: [s.val] });
    if (r.reason === "wrong" && !(sols.length && nearSolver(s, sols))) return { checked: 1, issue: `the answer gives ${s.v} = ${s.val} for the equation ${p.problem}, but the correct solution is ${p.answer}` };
  }
  return { checked: 1 };
}

/**
 * Preveri odgovor (brez vrstice META) s kodo.
 * @returns {{ checked: number, issue: string|null }} checked = koliko računov in vrednosti je koda preverila
 */
export function codeFindings(answer, pre = null, question = "") {
  let checked = 0;
  try {
    const r = checkArithmetic(String(answer || ""));
    checked += r.checked;
    // Vrstice z učenčevim ali namerno napačnim računom (»Ti si napisal $3 + 4 \\cdot 2 = 14$«) niso napaka odgovora.
    const lines = String(answer || "").split("\n");
    const real = r.mismatches.filter((m) => !SKIP_LINE.test(lines[m.line - 1] || ""));
    if (real.length) {
      const m = real[0];
      return { checked, issue: `in the step $${m.tex}$ the calculation does not hold: ${m.left} ≠ ${m.right}` };
    }
  } catch {
    // račun, ki ga ni mogoče prebrati, ni napaka
  }
  const eq = (pre?.problems || []).filter((p) => p.type === "equation" || p.type === "system");
  if (eq.length === 1) {
    const v = valueIssue(answer, eq[0]);
    if (v) {
      checked += v.checked;
      if (v.issue) return { checked, issue: v.issue };
    }
  }
  for (const f of [valenceIssue(answer, question), celsiusIssue(answer, question)]) {
    checked += f.checked;
    if (f.issue) return { checked, issue: f.issue };
  }
  return { checked, issue: null };
}

// Kemija in enote brez modela (meritev 11. 11., OŠ brez pregleda z modelom): »$v = 8 - 7$« za dušik (vrstno
// število namesto števila zunanjih elektronov) in »$20\,\text{K} - 0\,\text{K}$« za temperaturi v °C.
// Ujemanje je ozko (vzorec v = 8 − z ob imenu elementa), da je lažnih zadetkov čim manj; nejasen primer
// popravek (FIX_SYSTEM) zavrne z »OK«.
const ELEMENTS = [
  ["C", "ogljik", /ogljik|carbon/iu, 4, 6],
  ["N", "dušik", /dušik|nitrogen/iu, 5, 7],
  ["O", "kisik", /kisik|oxygen/iu, 6, 8],
  ["F", "fluor", /fluor(?!esc)/iu, 7, 9],
  ["Cl", "klor", /(?<!\p{L})klor(?!ofil|id)|chlorin/iu, 7, 17],
  ["Br", "brom", /(?<!\p{L})brom(?!id)|bromin/iu, 7, 35],
  ["I", "jod", /(?<!\p{L})jod(?!id)|iodin/iu, 7, 53],
  ["S", "žveplo", /žvepl|sulfur/iu, 6, 16],
  ["P", "fosfor", /fosfor|phosphor/iu, 5, 15],
  ["Si", "silicij", /silicij|silicon/iu, 4, 14],
];
// Omembe elementov v vrstici (ime ali »\mathrm{N}«) s položajem.
function elementMentions(line) {
  const out = [];
  for (const [sym, , re, outer, z] of ELEMENTS) {
    for (const m of line.matchAll(new RegExp(re.source, "giu"))) out.push({ at: m.index, sym, outer, z });
  }
  for (const m of line.matchAll(/\\(?:mathrm|text|ce)\{([A-Z][a-z]?)\}/g)) {
    const e = ELEMENTS.find((x) => x[0] === m[1]);
    if (e) out.push({ at: m.index, sym: e[0], outer: e[3], z: e[4] });
  }
  return out.sort((a, b) => a.at - b.at);
}
const ELEMENT_NAME = Object.fromEntries(ELEMENTS.map((e) => [e[0], e[1]]));

// Pregledi 2 in 3 (PR #574): ime elementa največ ~60 znakov pred »v = 8 − k«; k, ki je število zunanjih elektronov
// katerega koli elementa v vrstici, ni napaka, razen če je vrstno število elementa ob ujemanju; vrstica s hitrostjo
// (»hitrost«, m/s, km/h) ni kemija; »8 − k« iz učenčevega sporočila je njegov račun.
const VALENCE_RE = /(?<![\p{L}\d])v\s*=\s*(?:8\s*(?:-|−|–|\\minus)\s*z\s*=\s*)?8\s*(?:-|−|–|\\minus)\s*(\d+)(?![\d.,\p{L}]|\{,\}|\s*(?:\\cdot|\\times|[·*×/^]|[a-z]\b))/gu;
const SPEED_RE = /hitrost|\b(?:k?m|cm)\s*\/\s*(?:s|h)\b|\\(?:text|mathrm)\{\s*(?:k?m|cm)\s*\/\s*(?:s|h)\s*\}|\\frac\{\s*(?:\\(?:text|mathrm)\{)?\s*k?m\s*\}?\s*\}\{\s*(?:\\(?:text|mathrm)\{)?\s*(?:s|h)\b/iu;
const eightMinus = (t) => new Set([...String(t || "").matchAll(/8\s*(?:-|−|–|\\minus)\s*(\d+)(?!\d)/g)].map((m) => Number(m[1])));
export function valenceIssue(answer, question = "") {
  let checked = 0;
  const pupil = eightMinus(question);
  for (const line of String(answer || "").split("\n")) {
    // »vzel/uporabil« samo tukaj: v skupnem SKIP_LINE bi skrili napake v računih popravkov (pregled krog 2).
    if (SKIP_LINE.test(line) || /(?<!\p{L})(vzel|uporabil)a?(?!\p{L})/iu.test(line) || SPEED_RE.test(line)) continue;
    const outerOnLine = new Set(elementMentions(line).map((e) => e.outer));
    for (const m of line.matchAll(VALENCE_RE)) {
      const el = elementMentions(line.slice(Math.max(0, m.index - 60), m.index)).at(-1);
      if (!el) continue;
      checked++;
      const k = Number(m[1]);
      if (pupil.has(k)) continue;
      if (k === el.z || (k !== el.outer && !outerOnLine.has(k)))
        return {
          checked,
          issue: `in $v = 8 - ${k}$ for ${ELEMENT_NAME[el.sym]} (${el.sym}) the answer uses ${k}${k === el.z ? ", its atomic number," : ""} but ${el.sym} has ${el.outer} outer (valence) electrons, so $v = 8 - ${el.outer} = ${8 - el.outer}$`,
        };
    }
  }
  return { checked, issue: null };
}

// Temperaturi iz naloge v °C, v odgovoru zapisani kot kelvini v razliki (»$20\,\text{K} - 0\,\text{K}$«).
const plainTex = (t) =>
  String(t)
    .replace(/\{,\}/g, ",")
    .replace(/\\(?:text|mathrm)\{\s*([KC])\s*\}/g, "$1")
    .replace(/\^\s*\{?\s*\\circ\s*\}?|\\degree/g, "°")
    .replace(/\\[,;:! ]|~/g, " ")
    .replace(/−|–|\\minus/g, "-");
export function celsiusIssue(answer, question = "") {
  const q = plainTex(question);
  const celsius = new Set([...q.matchAll(/(-?\d+(?:[.,]\d+)?)\s*°\s*C/g)].map((m) => m[1].replace(".", ",")));
  if (!celsius.size) return { checked: 0, issue: null };
  const kelvinInTask = new Set([...q.matchAll(/(-?\d+(?:[.,]\d+)?)\s*K(?![a-zA-Z])/g)].map((m) => m[1].replace(".", ",")));
  let checked = 0;
  for (const seg of String(answer || "").matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)) {
    const tex = plainTex(seg[1] ?? seg[2]);
    for (const m of tex.matchAll(/(?<![\d.,])(\d+(?:,\d+)?)\s*K\s*-\s*\(?\s*(-?\d+(?:,\d+)?)\s*K(?![a-zA-Z])/g)) {
      const [a, b] = [m[1], m[2]];
      if (!celsius.has(a) || !celsius.has(b) || kelvinInTask.has(a) || kelvinInTask.has(b)) continue;
      checked++;
      const d = Number(a.replace(",", ".")) - Number(b.replace(",", "."));
      return {
        checked,
        issue: `the task gives ${a} °C and ${b} °C, but the answer writes them as ${a} K and ${b} K; the difference is $${a}\\,°\\text{C} - ${b.startsWith("-") ? `(${b}\\,°\\text{C})` : `${b}\\,°\\text{C}`} = ${String(d).replace(".", ",")}\\,\\text{K}$, while ${a} K itself would be ${String(Number(a.replace(",", ".")) - 273).replace(".", ",")} °C`,
      };
    }
  }
  return { checked, issue: null };
}

// ---------------------------------------------------------------------------
// 3. Pregled z modelom, »če je potrebno«

const val = (x) => (typeof x === "function" ? x() : x);

// Pri SŠ (po izbiri OŠ) model pregleda odgovor z dodatno vajo ali z okvirjem »Zapomni si« v rešeni nalogi
// (j, 2026-11-11, meritev 10. 11.: 11 od 13 napak je bilo v trditvah in dodatnih vajah, ki jih koda ne preveri).
// Vaja: oznaka z dvopičjem v svoji vrstici (»**Vaja:**«, ki jo zahteva prompt, »Dodatna vaja:«, »Za vajo:«,
// »Practice:«). Sam okvir »Zapomni si« je v večini razlag, zato šteje le ob oznaki rešene naloge (Podatki,
// Iščemo ali Preverba iz vzorca za računske naloge).
const EXERCISE_RE = /(?:^|\n)[ \t>*_]*(?:dodatna vaja|vaja|za vajo|practice(?: exercise)?)[*_ \t]*[:：]/iu;
const BOX_RE = /📌|zapomni si/iu;
const SOLVED_RE = /(?:^|\n)[ \t>*_\d.]*(?:podatki|iščemo|preverba)[*_ \t]*[:：]/iu;
export const hasExercise = (answer) => EXERCISE_RE.test(String(answer || ""));
export const hasClaims = (answer) => {
  const a = String(answer || "");
  return EXERCISE_RE.test(a) || (BOX_RE.test(a) && SOLVED_RE.test(a));
};

// Stopnje, kjer model pregleda odgovor z vajo ali okvirjem tudi brez tveganja (privzeto SŠ; OŠ z EVKLID_LIVE_REVIEW_OS=1).
export const claimReviewFor = (stopnja) =>
  stopnja === "SS" ? process.env.EVKLID_LIVE_REVIEW_SS !== "0" : stopnja === "OS" ? process.env.EVKLID_LIVE_REVIEW_OS === "1" : false;

const envNum = (name, def) => {
  const raw = process.env[name];
  const v = Number(raw === undefined || raw === "" ? def : raw);
  return Number.isFinite(v) ? v : def;
};
// Del dnevne meje za pregled pri SŠ/OŠ (vrsta »preverjanje-sola«; šteje tudi v skupno mejo), da šolski pregledi ne
// porabijo vsega za tekmovanja in fakulteto. Privzeto pol skupne meje; negativno = brez posebne meje.
export const LIVE_REVIEW_SS_DAILY_USD = () => {
  const total = LIVE_CHECK_DAILY_USD();
  return envNum("EVKLID_LIVE_REVIEW_SS_DAILY_USD", total < 0 ? -1 : total / 2);
};
// Največ toliko pregledov na učenca na dan (vse stopnje); negativno = brez meje.
export const LIVE_REVIEW_PER_PUPIL = () => envNum("EVKLID_LIVE_REVIEW_PER_PUPIL", 6);
// Rok za en pregled (ms); po njem odgovor ostane brez pregleda.
export const LIVE_REVIEW_TIMEOUT_MS = () => envNum("EVKLID_LIVE_REVIEW_TIMEOUT_MS", 25_000);
// Rezerva enega pregleda v dnevnem bazenu aplikacije (USD): pričakovani strošek, ne najslabši primer (~0,10 $ pri
// 8000 izhodnih žetonih), sicer bi meja 0,30 $ (šolski del 0,15 $) ustavila pregled že pri ~0,05–0,20 $ porabe.
// Klici v teku se štejejo, zato vzporedni pregledi mejo presežejo največ za razliko do dejanskega stroška.
// Meja učenca (marža ≥ 75 %) ostane rezervirana po najslabšem primeru (checkReserveUsd v server/app.js).
export const LIVE_REVIEW_POOL_RESERVE_USD = () => envNum("EVKLID_LIVE_REVIEW_RESERVE_USD", 0.02);
// Vrsti porabe pregleda: »preverjanje« (tekmovanja, fakulteta, podrobna razlaga) in »preverjanje-sola« (SŠ/OŠ).
export const REVIEW_KINDS = ["preverjanje", "preverjanje-sola"];
export const reviewKindFor = (risky) => (risky ? "preverjanje" : "preverjanje-sola");

/**
 * Meje za rezervacijo pregleda (usage.hold(null, caps)): skupna dnevna meja za obe vrsti in pri SŠ/OŠ še šolski
 * del. Rezervacija šteje klice v teku, zato vzporedni pregledi meje ne prekoračijo.
 * spent(kinds) → USD danes za te vrste.
 */
export function reviewPoolCaps({ school, spent }) {
  return () => {
    const caps = [];
    const total = LIVE_CHECK_DAILY_USD();
    if (total >= 0) caps.push({ key: "app:preverjanje", usd: total, spent: spent(REVIEW_KINDS) });
    const ss = LIVE_REVIEW_SS_DAILY_USD();
    if (school && ss >= 0) caps.push({ key: "app:preverjanje-sola", usd: ss, spent: spent(["preverjanje-sola"]) });
    return caps;
  };
}

/**
 * Ali odgovor pregleda še model. level (raven proračuna, server/proracun.js) je lahko funkcija.
 * risky (tekmovanja, fakulteta, »Razloži podrobneje«): vedno, tudi če je koda preverila račune (koda preveri
 * števila, ne trditev; prejšnji argument »checked« je zato odstranjen). claimLevel (SŠ, po izbiri OŠ): samo
 * odgovor z vajo ali okvirjem v rešeni nalogi (claims). Dnevne meje in meja na učenca: reviewBlock in rezervacija.
 */
export function needsReview({ model, lite, premium, level, risky, claims = false, claimLevel = false, answerLength }) {
  if (!liveCheckOn() || lite || !premium) return false;
  if (!risky && !(claimLevel && claims)) return false;
  if (!/haiku/i.test(String(model || ""))) return false;
  if (answerLength < 120) return false; // kratka vprašanja učencu (»Kaj bi naredil zdaj?«) nimajo kaj preveriti
  return val(level) > 0; // varčni način ali ustavljen proračun
}

/**
 * Meja, ki ustavi sicer upravičen pregled: "ucenec" (pregledov učenca danes), "sola" (šolski del), "dan" (skupna
 * meja) ali null. Rezervacija (reviewPoolCaps) je dokončna; to je hiter pregled za razlog v dnevniku.
 */
export function reviewBlock({ school, pupilToday, spent, needUsd = 0 }) {
  const per = LIVE_REVIEW_PER_PUPIL();
  if (per >= 0 && val(pupilToday) >= per) return "ucenec";
  const ss = LIVE_REVIEW_SS_DAILY_USD();
  const over = (used, cap) => used >= cap || used + needUsd > cap;
  if (school && ss >= 0 && over(spent(["preverjanje-sola"]), ss)) return "sola";
  const total = LIVE_CHECK_DAILY_USD();
  if (total >= 0 && over(spent(REVIEW_KINDS), total)) return "dan";
  return null;
}

// Števec preskočenih pregledov (kv »pregledi_preskoceni«): { "2026-11-11": { "SS": { "dan": 3, "rok": 1 } } },
// zadnjih 60 dni. Iz njega se po pilotu nastavi meja (docs/stroski-ai.md). Napaka pri zapisu ne ustavi odgovora.
export const SKIP_KV = "pregledi_preskoceni";
export function noteReviewSkip(db, stopnja, reason) {
  try {
    const day = new Date().toISOString().slice(0, 10);
    const cur = JSON.parse(db.prepare("SELECT value FROM kv WHERE key = ?").get(SKIP_KV)?.value || "{}");
    const lvl = ((cur[day] ||= {})[stopnja] ||= {});
    lvl[reason] = (lvl[reason] || 0) + 1;
    for (const d of Object.keys(cur).sort().slice(0, -60)) delete cur[d];
    db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)").run(SKIP_KV, JSON.stringify(cur));
  } catch {
    // brez tabele kv (stara baza v testu)
  }
}

// ---------------------------------------------------------------------------
// 4. Sodba o učenčevem koraku

// Učenčevo sporočilo je rezultat ali trditev, o kateri bo inštruktor sodil: število, enačba, zapis
// z »=«, ali odgovor (ne vprašanje) na inštruktorjevo vprašanje.
export function isClaim(text, prevTutor = "") {
  const t = String(text || "").trim();
  if (!t || t.length > 1500) return false;
  if (/\?\s*$/.test(t)) return false; // vprašanje, ne trditev
  if (/\d|=/.test(t)) return true;
  return /\?\s*$/.test(String(prevTutor || "").trim()) && /\p{L}{2,}/u.test(t);
}

// Inštruktorjev odgovor izreče sodbo o učenčevem koraku (potrdi ali zavrne).
const VERDICT_RE =
  /(?<!\p{L})(?:točno|tako je|pravilno|pravilen|pravilna|pravilni|prav imaš|prav si|drži|res je|bravo|odlično|super|izvrstno|krasno|ni (?:čisto |povsem |še |ravno )?(?:prav|pravilno|res|tako|to)|narobe|napačn\p{L}*|napak\p{L}*|ne drži|ne velja|zmotil\p{L}*|skoraj|correct|incorrect|exactly|right|wrong|not quite|almost)(?!\p{L})/iu;
export const givesVerdict = (answer) => VERDICT_RE.test(String(answer || "").slice(0, 600));

// Učenčeva vrednost neznanke ali rezultata (»x = 3«, »x1 = 2, x2 = -2«, golo število »11/12«).
function claimValues(text, vars) {
  // »1 247«, »1\,247« je eno število (tisočice), ne 1 in 247
  // »1.234,5« (pika za tisočice, vejica za decimalke) je nedvoumen: 1234,5
  const t = joinThousands(String(text).replace(/\$/g, "").replace(/(\d)(?:\\[,;: ]|~|\{\\,\})(?=\d{3}(?!\d))/g, "$1 "))
    .replace(/(?<![\d.,])\d{1,3}(?:\.\d{3})+(?=,\d)/g, (m) => m.replace(/\./g, ""))
    .replace(/\s*=\s*/g, "=");
  // Vrednost, ki ji sledi operator ali črka (»x = 6 - 3«, »x = 2x - 1«, »x = 12 : 4«), je vmesni korak, ne rezultat:
  // o njem sodi model. Pri večkratni navedbi iste neznanke šteje zadnja (»x = 6 … torej x = 3«).
  const byKey = new Map();
  for (const m of t.matchAll(/(?<![\p{L}\d])([a-zA-Z])(?:_?\{?(\d)\}?)?=([-+]?\s*(?:\d{1,3}(?:\.\d{3})+(?!\d)|\d+(?:[.,]\d+)?(?:\/\d+)?|[.,]\d+))(?![\d\/\p{L}]|[.,]\d)(?![ \t]*[-+*/:·×÷^=(\\])/gu)) {
    if (vars.includes(m[1])) byKey.set(m[1] + (m[2] || ""), { v: m[1], val: m[3].replace(/\s+/g, "") });
  }
  const out = [...byKey.values()];
  if (out.length) return out;
  // Golo število kot celotno sporočilo (»mislim da 58«): samo pri računu brez neznank. Pri enačbi je
  // lahko vmesni korak (»8« za 2x = 8), zato tam brez sodbe kode.
  const bare = /^(?:[\p{L}\s,]{0,30}?)([-+]?(?:\d{1,3}(?:\.\d{3})+|\d+(?:[.,]\d+)?(?:\/\d+)?))\s*[.!]?$/u.exec(t);
  if (bare && vars.length === 1 && vars[0] === "r") return [{ v: "r", val: bare[1] }];
  return out;
}

// Možna branja učenčeve vrednosti: »1.250« → 1.250 ali 1250, »1.250.000« → samo 1250000,
// »0.250« → samo 0,250 (tisočice se ne začnejo z 0), drugo ostane, kot je.
export function claimReadings(val) {
  const v = String(val).replace(/\s+/g, "");
  if (/^[-+]?[1-9]\d{0,2}(?:\.\d{3}){2,}$/.test(v)) return [v.replace(/\./g, "")];
  if (/^[-+]?[1-9]\d{0,2}\.\d{3}$/.test(v)) return [v, v.replace(/\./g, "")];
  return [v];
}

/**
 * Sodba kode o učenčevem rezultatu, če je naloga iz prvega sporočila znana (presolve) in učenec navede
 * vrednost. Vrne opombo za model (pravilno ali napačno z rešitvijo) ali null, če koda ne more soditi.
 */
export function claimNote(text, pre) {
  const problems = (pre?.problems || []).filter((p) => p.type === "equation" || p.type === "arith");
  if (problems.length !== 1) return null;
  const p = problems[0];
  const vars = p.type === "arith" ? ["r"] : [...new Set([...String(p.answerTex || "").matchAll(/([a-zA-Z])(?:_\{?\d+\}?)?\s*=/g)].map((m) => m[1]))];
  if (!vars.length) return null;
  const claims = claimValues(text, vars);
  if (!claims.length) return null;
  let wrong = null;
  for (const c of claims) {
    // »1.250« je lahko 1250 (pika za tisočice) ali 1,25 (decimalna pika): pravilno, če je pravilno katero koli
    // branje; če ni nobeno, koda ne sodi (raje brez sodbe kot napačna sodba).
    const vals = claimReadings(c.val);
    if (p.type === "arith") {
      const y = num(texToText(String(p.answerTex)));
      if (y === null) return null;
      const hit = vals.some((val) => {
        const x = num(val);
        const dec = /[.,](\d+)$/.exec(val)?.[1].length ?? 0;
        return x !== null && Math.abs(x - y) <= (dec ? 1.01 * 10 ** -dec : 1e-9) * Math.max(1, Math.abs(y));
      });
      // Drugačno število je lahko vmesni rezultat (»56« za 7 · 8 pri 7 · 8 + 2): o napaki sodi model, ne koda.
      if (!hit) return null;
    } else {
      const sols = solverValues(p.answerTex);
      let right = false;
      for (const val of vals) {
        const r = verifyAi(p.problem, { kind: "equation", variable: c.v, solutions: [val] });
        if (r.reason === "parse") return null;
        if (r.reason !== "wrong" || (sols.length && nearSolver({ v: c.v, val, approx: false }, sols))) right = true;
      }
      if (!right) {
        if (vals.length > 1) return null;
        wrong = `${c.v} = ${c.val}`;
      }
    }
  }
  const task = p.type === "arith" ? `$${p.problemTex} = ${p.answer}$` : `$${p.problemTex}$ → $${p.answer}$`;
  const finding = wrong ? `the student's result ${wrong} is WRONG; the exact result of the task is ${task}` : `the student's result is CORRECT (exact result of the task: ${task})`;
  return (
    `<${NOTE_TAG}>\nAn exact check compared the student's last message with the task: ${finding}.\n` +
    "Your reply must agree with this check: never confirm a wrong result and never reject a correct one. For a wrong result: if the student sent no working, ask for it; otherwise show the step where it fails. In način A never state the final result or the full solution. Never mention a program, a check or this note.\n" +
    `</${NOTE_TAG}>`
  );
}

const VERDICT_SYSTEM = `You check one thing in an AI tutor's reply to a school or university student: whether the tutor judged the student's last message correctly.
You get the tutor's previous message (context), the student's message and the tutor's reply, in any language.
First work out yourself, independently and carefully, whether the student's statement, result or step is right (recompute every number, check every fact and unit). Then compare with the tutor's judgement.
It is an error if the tutor confirms something wrong, rejects or "corrects" something right, or states a wrong value or fact in its reply. Teaching style, hints, questions, asking for the student's working and leaving steps to the student are fine. A partially right answer that the tutor treats as partially right is fine. If you cannot decide with certainty, reply OK.
Reply with exactly one line: OK, or NAPAKA: <at most two sentences: whether the student's statement is right or wrong and why, with the correct value, and what the tutor got wrong>.`;

// Dnevna meja za pregled sodb z modelom (USD, vrsta »sodba«, ločen števec od vrste »preverjanje«); negativno = brez meje.
export const VERDICT_DAILY_USD = () => {
  const raw = process.env.EVKLID_VERDICT_DAILY_USD;
  const v = Number(raw === undefined || raw === "" ? 2 : raw);
  return Number.isFinite(v) ? v : 2;
};

export function needsVerdictReview({ answer, lite, spentToday }) {
  if (!liveCheckOn() || lite || !givesVerdict(answer)) return false;
  const cap = VERDICT_DAILY_USD();
  return !(cap >= 0 && val(spentToday) >= cap);
}

/** Pregled sodbe s Sonnetom. Vrne { reason: ugotovitev preverjevalca ali null, cost }. */
export async function reviewVerdict({ context, student, answer, createFn = null, usage = null, studentId = null }) {
  const user = `TUTOR'S PREVIOUS MESSAGE:\n${String(context || "(none)").slice(0, 3000)}\n\nSTUDENT'S MESSAGE:\n${String(student || "").slice(0, 2000)}\n\nTUTOR'S REPLY:\n${String(answer || "").slice(0, 6000)}`;
  const r = await askModel(MODEL_MID, user, createFn, VERDICT_SYSTEM);
  const cost = usage ? usage.log(studentId, r.model, r.usage, "sodba") : 0;
  return { reason: !r.verdict.ok && /^[\s*`_]*NAPAKA/i.test(r.text || "") ? r.verdict.reason : null, cost };
}

// Opomba za ponovni odgovor po napačni sodbi.
export const verdictNote = (reason) =>
  `<${NOTE_TAG}>\nAn independent check of the student's last message found: ${String(reason).slice(0, 600)}\n` +
  "Your previous reply judged the student's message wrongly, so answer again from scratch, in agreement with this check: confirm what is right; for what is wrong, ask for the working if the student sent none, otherwise show the step where it fails. In način A never state the final result or the full solution. Never mention a program, a check, a reviewer or this note.\n" +
  `</${NOTE_TAG}>`;

// Navodila preverjevalca iz server/verify.js in dodatek za vaje in trditve (meritev 10. 11.: bakterija 300 μm,
// »raztopljen« MgO, razvrščanje brez enolične rešitve, napačna trditev ob pravilnem rezultatu).
export const LIVE_REVIEW_SYSTEM =
  CHECKER_SYSTEM +
  `
Also check, as strictly as the calculations:
- every practice exercise the tutor sets for the student: the quantities must be realistic (sizes, masses, speeds, concentrations that really occur), the substances and objects must behave as the exercise assumes (solubility, state, reactions, biology), the data must be consistent, and it must have exactly one correct answer (in a classification every item fits exactly one group and every offered group is used);
- every side remark, »remember« box and check step, also when the final result is right: definitions, structures, charges, formulas and rules must be correct, and nothing may contradict the tutor's own calculation or the task.
Reply with exactly one line: OK, or NAPAKA: <short reason>.`;

/** Pregled s Sonnetom (navodila preverjevalca iz server/verify.js in LIVE_REVIEW_SYSTEM). Vrne { reason: razlog napake ali null, cost }. */
// kind: »preverjanje« ali »preverjanje-sola« (reviewKindFor). signal: prekinitev zahteve; po LIVE_REVIEW_TIMEOUT_MS
// askModel vrže napako z name »TimeoutError« (klicatelj odgovor pusti brez pregleda).
export async function reviewAnswer({ question, answer, createFn = null, usage = null, studentId = null, kind = "preverjanje", signal = null, timeoutMs = LIVE_REVIEW_TIMEOUT_MS() }) {
  const r = await askModel(MODEL_MID, checkerUser({ question, answer }), createFn, LIVE_REVIEW_SYSTEM, { signal, timeoutMs });
  const cost = usage ? usage.log(studentId, r.model, r.usage, kind) : 0;
  // Samo izrecna NAPAKA; odrezan ali nejasen odgovor preverjevalca ni dovolj za popravek.
  return { reason: !r.verdict.ok && /^[\s*`_]*NAPAKA/i.test(r.text || "") ? r.verdict.reason : null, cost };
}

// ---------------------------------------------------------------------------
// Popravek: en kratek klic istega modela

const FIX_SYSTEM = `You fix one mistake in an AI tutor's answer to a student. You get the answer and a problem that an exact check or a reviewer found in it.
If the problem is real (the answer states something wrong as true), write a correction of 1 to 3 short sentences addressed to the student, in the language of the answer, that starts with the word for "Correction" in that language followed by a colon (Slovenian: "Popravek:"). Give the correct value or fact. If the answer leaves later steps to the student, correct only the wrong part and do not solve the rest. Write maths as $…$. Do not mention a program, a check or a reviewer, and do not repeat the answer.
If the problem is in a practice exercise, give corrected data or a replacement exercise; never give the exercise's solution.
If the answer does not really claim the wrong thing (for example it shows the student's mistake, a hypothetical case, or the check misread it), reply exactly OK.`;

// Odgovor modela → blok za prikaz (»> **Popravek:** …«) ali null.
export function fixBlock(text) {
  const t = String(text || "").trim();
  // »OK« z razlago (»OK – odgovor kaže učenčevo napako.«) ali besedilo brez naslova »Popravek:« ni popravek.
  if (!t || /^[*`_\s]*OK(?![\p{L}])/iu.test(t) || t.length > 1200) return null;
  // Naslov v vseh pisavah (hindijščina in tajščina imata znake \p{M}, kitajščina »更正：«, vietnamščina »Sửa lỗi:«).
  const m = /^[*_\s]*([\p{L}\p{M}]{2,20}(?: [\p{L}\p{M}]{2,20})?)[*_\s]*[:：][*_\s]*/u.exec(t);
  if (!m) return null;
  const body = `**${m[1]}:** ${t.slice(m[0].length)}`;
  return "\n\n" + body.split("\n").map((l) => `> ${l}`.trimEnd()).join("\n");
}

/**
 * En klic popravka (streamFn kot pri odgovoru, majhen prompt). Haiku → »think«, Sonnet/Opus → isti način.
 * @returns {Promise<{block: string|null, usage, model}>}
 */
// Način popravka: isti model pri podrobni razlagi, sicer hitri model z več razmisleka (think).
export const fixModeFor = (mode) => (mode === "deep" || mode === "mid" ? mode : "think");
export async function correction({ streamFn, mode, answer, issue, language = "sl", signal }) {
  const fixMode = fixModeFor(mode);
  const user = `Student's language code: ${language}\n\nANSWER:\n${String(answer).slice(0, 8000)}\n\nPROBLEM FOUND:\n${String(issue).slice(0, 600)}`;
  const r = await streamFn({ system: FIX_SYSTEM, messages: [{ role: "user", content: [{ type: "text", text: user }] }], mode: fixMode, deep: fixMode === "deep" || fixMode === "mid", onText: () => {}, signal });
  return { block: r?.stopReason === "refusal" ? null : fixBlock(r?.text), usage: r?.usage, model: r?.model, mode: fixMode };
}

// Popravek vstavi pred vrstico META (in kartice), da ostane zgodovina v pričakovani obliki.
export function insertFix(text, block) {
  const s = String(text || "");
  const i = s.search(/\n?<<(?:META|KARTICA|IZBIRE)\b/);
  return i < 0 ? s + block : s.slice(0, i) + block + s.slice(i);
}
