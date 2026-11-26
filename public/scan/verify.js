// Preverjanje rešitev, ki jih napiše AI (strežnik in vmesnik uporabljata isto kodo).
// Polinomske enačbe in neenačbe preverimo točno (public/scan/algebra.js: rešitve oblike u + w·√c brez decimalk,
// Sturmov izrek za popolnost, kritične točke neenačbe); drugo numerično: rešitve vstavimo v enačbo,
// izraze primerjamo v naključnih točkah, odvode z numeričnim odvodom, nedoločene integrale z odvajanjem.
// Vsak izid ima status iz public/scan/status.js; numerična potrditev nikoli ni »Preverjeno« (AUDIT-001).
import { parse, compile, integrate } from "../graph/math.js";
import { prep, splitSystem, satisfies, equalNumerically, bigLiteral, kombinatorika, argumentiKlica } from "./solvecore.js";
import { tryPoly, withLimit, surdOf, polyEquationProof, polyGcd, inequalityCheck, qFromFloat, evalCs, constQ, P, Q } from "./algebra.js";
import { statusOf } from "./status.js";

const fin = Number.isFinite;

function fnOf(text) {
  try {
    return compile(parse(prep(text)));
  } catch {
    return null;
  }
}

// vrednost »2«, »-1/3«, »sqrt(2)«, »π/6 + 2kπ« (k = 0, 1, −1)
// Zapis števila v rešitvi: »1.4e6«, »1e-3« → 1.4*10^(6), 10^(-3) (sicer bi »e« prebrali kot Eulerjevo število),
// »−1.414« (unicode minus) in »- 1.414« (presledek za predznakom) → »-1.414«.
const stevilo = (t) =>
  String(t ?? "")
    .replace(/−/g, "-")
    .replace(/^\s*([+-])\s+/, "$1")
    .replace(/(\d)[eE]([+-]?\d+)(?![\d.])/g, "$1*10^($2)");

function values(expr) {
  const f = fnOf(stevilo(expr));
  if (!f) return [];
  const out = [];
  for (const k of [0, 1, -1]) {
    const v = f({ k });
    if (fin(v)) out.push(v);
  }
  return [...new Set(out)];
}

// Ničle L − D (za rešitve, ki jih AI morda ni našel): gosta mreža na [−50, 50], redkejša (geometrijska) do ±10⁶,
// predznak se zamenja → bisekcija; dotikalne ničle (|L − D| ima lokalni minimum ≈ 0, npr. |x − 1,1| = 0) → zlati rez.
function scanRoots(eqText, v) {
  let ast;
  try {
    ast = parse(prep(eqText));
  } catch {
    return [];
  }
  if (ast.k !== "cmp" || ast.terms.length !== 2 || ast.ops[0] !== "=") return [];
  const L = compile(ast.terms[0]);
  const R = compile(ast.terms[1]);
  const g = (x) => L({ [v]: x }) - R({ [v]: x });
  const tol = (x) => 1e-9 * Math.max(1, Math.abs(L({ [v]: x })), Math.abs(R({ [v]: x })));
  const xs = [];
  for (let i = 0; i <= 4000; i++) xs.push(-50 + i / 40);
  for (let i = 1; i <= 400; i++) {
    const x = 50 * Math.pow(2e4, i / 400);
    xs.push(x, -x);
  }
  // Pol točno na mreži (1/(x − 1) = 1000 pri x = 1): ničla 1,001 leži v istem koraku kot pol in bi ostala skrita.
  // Okoli vsake osamljene nedefinirane točke mreže (ne na robu območja, npr. √(x − 60)) dodamo točke na razdaljah 10⁻² … 10⁻¹⁰.
  xs.sort((a, b) => a - b);
  const fx = xs.map((t) => fin(g(t)));
  const poli = xs.filter((t, i) => !fx[i] && fx[i - 1] !== false && fx[i + 1] !== false);
  for (const x of poli) for (let k = 2; k <= 10; k++) xs.push(x - 10 ** -k * Math.max(1, Math.abs(x)), x + 10 ** -k * Math.max(1, Math.abs(x)));
  xs.sort((a, b) => a - b);
  const ys = xs.map(g);
  const roots = [];
  // Odpravljiva vrzel ((x² − 1)/(x + 1) = −2 pri x = −1): iskanje najde »ničlo« tik ob točki, kjer enačba ni
  // definirana, L − D pa je okoli nje zvezna in majhna (pri polu bi bila ogromna). Taka točka ni rešitev (N-01, luknja-009).
  const hole = (r) =>
    [1, 2, 3, 4, 5, 6, 8, 10, 12].some((k) => {
      const s = Math.round(r * k) / k;
      const h = 1e-6 * Math.max(1, Math.abs(s));
      return Math.abs(r - s) <= 1e-6 * Math.max(1, Math.abs(s)) && !fin(g(s)) && [s - h, s + h].every((t) => fin(g(t)) && Math.abs(g(t)) <= 1e-3);
    });
  const add = (r) => {
    if (hole(r)) return;
    if (fin(g(r)) && Math.abs(g(r)) <= tol(r) && !roots.some((q) => Math.abs(q - r) < 1e-6 * Math.max(1, Math.abs(r)))) roots.push(r);
  };
  for (let i = 1; i < xs.length; i++) {
    const [px, x, py, y] = [xs[i - 1], xs[i], ys[i - 1], ys[i]];
    if (fin(py) !== fin(y)) {
      // rob definicijskega območja (npr. √(x − 60) = 0 ima ničlo v x = 60)
      let lo = px;
      let hi = x;
      for (let k = 0; k < 80; k++) {
        const m = (lo + hi) / 2;
        if (fin(g(m)) === fin(py)) lo = m;
        else hi = m;
      }
      add(fin(py) ? lo : hi);
      continue;
    }
    if (!fin(py) || !fin(y)) continue;
    if (py === 0) add(px);
    if (py * y < 0) {
      let lo = px;
      let hi = x;
      for (let k = 0; k < 80; k++) {
        const m = (lo + hi) / 2;
        if (g(lo) * g(m) <= 0) hi = m;
        else lo = m;
      }
      add((lo + hi) / 2);
    } else if (i + 1 < xs.length && fin(ys[i + 1]) && Math.abs(y) <= Math.abs(py) && Math.abs(y) <= Math.abs(ys[i + 1]) && y * ys[i + 1] > 0) {
      let a = px;
      let b = xs[i + 1];
      const k = (Math.sqrt(5) - 1) / 2;
      for (let n = 0; n < 120 && b - a > 1e-15 * Math.max(1, Math.abs(a)); n++) {
        const c = b - k * (b - a);
        const d = a + k * (b - a);
        if (Math.abs(g(c)) < Math.abs(g(d))) b = d;
        else a = c;
      }
      add((a + b) / 2);
    }
  }
  return roots.sort((a, b) => Math.abs(a) - Math.abs(b));
}

// enačba z enim samim »=« (neenačbe in izrazi se ne preverjajo kot enačbe)
function isEquation(text) {
  try {
    const ast = parse(prep(text));
    return ast.k === "cmp" && ast.ops.every((o) => o === "=");
  } catch {
    return false;
  }
}

// Polinom L − D enačbe ali neenačbe z neznanko v (koeficienti a0..an kot Q), sicer null. Večja meja ulomkov:
// (x − 10¹²)(x − 2·10¹²)(x − 3·10¹²) ima koeficiente do 10³⁷.
const POLY_LIMIT = 10n ** 400n;
function sidesPoly(a, b, v) {
  try {
    return withLimit(POLY_LIMIT, () => {
      const pa = tryPoly(a);
      const pb = tryPoly(b);
      if (!pa || !pb || [...pa.vars(), ...pb.vars()].some((x) => x !== v)) return null;
      return pa.sub(pb).coeffs(v);
    });
  } catch {
    return null;
  }
}

// Zaokroženo decimalno število (»1.324718«): toleranca pol zadnjega mesta; drug zapis z decimalno piko: majhna
// toleranca (vrednost je približek); brez decimalk 0 (vrednost je točna).
function decimalTol(text) {
  const t = stevilo(text).trim();
  const m = /^[+-]?\d*\.(\d+)$/.exec(t);
  if (m) return 0.5 * 10 ** -m[1].length * 1.0001;
  return /\d\.\d/.test(t) ? 1e-12 : 0;
}

// Račun brez neznank z zaokroženim decimalnim rezultatom (1/3 → 0.33, √2 → 1.414): dovoljeno odstopanje (pol zadnjega
// mesta) ali 0, kadar zaokrožitve ne smemo sprejeti (pregled N-01 popravka):
//  - vsaj dve veljavni števki (»0.0« za 1/30000 in »0.3« za 1/3 nista preverljiva zaokrožitev);
//  - točna vrednost nima kratkega decimalnega zapisa: 1/2 + 1/4 = 0.75 ni »0.8« (naloga ne pove, da zaokrožimo);
//  - toleranca je velika v primerjavi s 53-bitno natančnostjo (15240740602.07 ni preverljiv s plavajočo vejico).
export function zaokrozenRacun(problemText, value) {
  const t = stevilo(String(value)).trim();
  const m = /^[+-]?(\d*)[.,](\d+)$/.exec(t);
  if (!m || (m[1] + m[2]).replace(/^0+/, "").length < 2) return 0;
  const tol = 0.5 * 10 ** -m[2].length;
  let v;
  try {
    v = compile(parse(prep(problemText)))({});
  } catch {
    return 0;
  }
  if (!fin(v) || tol < 1e-9 * Math.abs(v)) return 0;
  // Racionalna vrednost: točno, imenovalec le s 2 in 5 pomeni končen decimalni zapis (1/2^13 = 0.0001220703125).
  let q = null;
  try {
    q = withLimit(POLY_LIMIT, () => constQ(parse(prep(problemText))));
  } catch {
    q = null;
  }
  if (q) {
    let d = q.d;
    for (const p of [2n, 5n]) while (d % p === 0n) d /= p;
    return d === 1n ? 0 : tol;
  }
  // Sicer (√, π, ln …) številsko: le dokler v · 10ᵏ ostane v natančnosti plavajoče vejice (√6.25 = 2.5).
  for (let k = 0; k <= 12 && Math.abs(v * 10 ** k) <= 1e8; k++) {
    const w = v * 10 ** k;
    if (Math.abs(w - Math.round(w)) <= 1e-7) return 0; // kratek decimalni zapis
  }
  return tol;
}

// »2«, »-1/3«, »(1+sqrt(5))/2« → točno (Surd); sicer null
function exactValue(text) {
  try {
    return surdOf(parse(prep(stevilo(text))));
  } catch {
    return null;
  }
}

// Množica v zapisu »(-oo, 2) U [3, oo)«, »{1, 2}«, »R«, »{}« → intervali s krajišči { s: Surd|null, x: število };
// null = zapisa ne razumemo.
const INF = /^\s*([+-]?)\s*(oo|inf(inity)?|∞|\\infty)\s*$/i;
export function parseSet(text) {
  const src = normalizeSet(text);
  if (/^(\{\s*\}|∅|\\emptyset|none|ni rešitve|no solution)$/i.test(src)) return [];
  if (/^(R|ℝ|\\mathbb\{R\}|all|reals)$/i.test(src)) return [{ lo: null, hi: null }];
  const end = (e) => {
    const m = INF.exec(e);
    if (m) return m[1] === "-" ? { inf: -1 } : { inf: 1 };
    const x = compileValue(e);
    if (!Number.isFinite(x)) return null;
    return { s: exactValue(e), x, tol: decimalTol(e) };
  };
  const out = [];
  for (const part of src.split(/\s*(?:\bU\b|∪|\\cup)\s*/)) {
    const iv = /^([([])(.*),(.*)([)\]])$/.exec(part.trim());
    if (iv) {
      const lo = end(iv[2]);
      const hi = end(iv[3]);
      if (!lo || !hi || lo.inf === 1 || hi.inf === -1) return null;
      out.push({ lo: lo.inf ? null : lo, hi: hi.inf ? null : hi, loClosed: iv[1] === "[", hiClosed: iv[4] === "]" });
      continue;
    }
    const pt = /^\{(.*)\}$/.exec(part.trim());
    if (pt) {
      for (const e of pt[1].split(",")) {
        const p = end(e);
        if (!p || p.inf) return null;
        out.push({ point: p });
      }
      continue;
    }
    return null;
  }
  return out;
}
// Zapis množice v obliki, ki jo razumeta parseSet in SymPy (op ineq): »x ∈ [-2, 2]« → »[-2, 2]«,
// »]-2, 2[« (slovenski zapis) → »(-2, 2)«, »R \ {0}« → »(-oo, 0) U (0, oo)«.
export function normalizeSet(text) {
  let src = String(text ?? "")
    .replace(/\\left|\\right/g, "")
    .replace(/−/g, "-")
    .trim()
    .replace(/^[a-zA-Z]\s*(?:∈|\\in\b|in\b)\s*/, "")
    .trim();
  const minus = /^(R|ℝ|\\mathbb\{R\})\s*(?:\\|\\setminus|−|-)\s*\{(.*)\}$/.exec(src);
  if (minus) {
    const pts = minus[2]
      .split(/[,;]/)
      .map((t) => ({ t: t.trim(), x: compileValue(t) }))
      .filter((p) => p.t);
    if (!pts.length || pts.some((p) => !Number.isFinite(p.x))) return src;
    pts.sort((a, b) => a.x - b.x);
    const b = ["-oo", ...pts.map((p) => p.t), "oo"];
    return b
      .slice(1)
      .map((hi, i) => `(${b[i]}, ${hi})`)
      .join(" U ");
  }
  return src
    .split(/\s*(?:\bU\b|∪|\\cup)\s*/)
    .map((part) => {
      const m = /^([\]\[(])(.*),(.*)([\]\[)])$/.exec(part.trim());
      if (!m) return part.trim();
      return `${m[1] === "]" ? "(" : m[1]}${m[2].trim()}, ${m[3].trim()}${m[4] === "[" ? ")" : m[4]}`;
    })
    .join(" U ");
}
function compileValue(e) {
  try {
    return compile(parse(prep(e)))({});
  } catch {
    return NaN;
  }
}

/**
 * ai: { kind, variable, problem, solutions: [..], value, steps … }
 * Vrne { verified: bool, reason, missing: [x …], partial?, status }. verified: navedeno drži in nobena rešitev
 * ne manjka (lahko le numerično); partial: true = popolnosti (ni drugih rešitev) nismo preverili (sistem,
 * periodične rešitve). status: public/scan/status.js.
 */
// Lokalno ni mogoče izračunati (»Nepreverjeno«, ne »Napačno«; meritev brez SymPy 26. 11.):
// - funkcija, ki je razčlenjevalnik ne pozna (»gamma(5)« bi bil g·a·m·m·a·5); seznam, ker je »ab(a+b)« ali
//   »d/dx(x^2)« veljaven zapis;
// - log z več kot dvema argumentoma, ostanek C(…)/V(…), ki ni kombinatorika s celimi števili;
// - kombinatorika s spremenljivko (n!, nCr(n, 2)): kalkulator jo izračuna tudi za n = −4 ali n = 2,5 (gama).
const NEZNANE = /(?<![A-Za-z_])(?:factorial|gamma|Gamma|digamma|perm|comb|choose|fact|erf|beta|zeta|Sum|summation|product|integrate|diff|limit|Matrix|det|rank|Mod|arg|re|im|conjugate|Abs|Max|Min|Rational)\s*\(/;
const ENOMESTNE = /^(?:a?(?:sin|cos|tan|tg|ctg|cot)h?|arc(?:sin|cos|tan|tg|ctg|cot)|ln|lg|sqrt|exp|abs)$/;
function neizracunljivo(t, { identiteta = false, resitev = false } = {}) {
  if (t === undefined || t === null || t === "") return false;
  const s = prep(String(t));
  if (NEZNANE.test(s) || /(?<![A-Za-z_])[CV]\s*\(/.test(s)) return true;
  // Decimalna vejica v oklepaju (»arcsin(0,5)«, »(2,5+1)·2«, »sin²(0,5)«, »log(0,5)«): ni jasno, ali je to 0,5 ali
  // dva argumenta (točka). Lokalno bi »arcsin(0,5)« = 30° razglasili za napačno (AUDIT-096). Kombinatorika ima vedno
  // cela števila; funkcija z enim argumentom pa dveh ne sprejme, tudi s presledkom (»arcsin(0, 5)«).
  // Gleda prvotni zapis: prep iz »log(0,5)« naredi »logb(0, 5)«.
  const z = String(t);
  for (let i = z.indexOf("("); i >= 0; i = z.indexOf("(", i + 1)) {
    const k = argumentiKlica(z, i + 1);
    if (!k || k.args.length < 2) continue;
    const ime = /([A-Za-z_]\w*)\s*(?:\^\s*\d+|[²³])?\s*$/.exec(z.slice(0, i))?.[1] || "";
    // rešitev neenačbe je interval »(0,1)« (brez imena funkcije)
    if (/^(?:nCr|nPr|C|V|binomial)$/.test(ime) || (resitev && !ime)) continue;
    if (/\d,\d/.test(z.slice(i, k.end)) || ENOMESTNE.test(ime)) return true;
  }
  for (const m of s.matchAll(/(?<![A-Za-z_])(log|nCr|nPr)\s*\(/g)) {
    const k = argumentiKlica(s, m.index + m[0].length);
    if (!k) return true;
    if (m[1] === "log" ? k.args.length > 2 : !identiteta && k.args.some((a) => /[A-Za-z]/.test(a))) return true;
  }
  // Pri istovetnosti izrazov (n!/(n−2)! = n(n−1)) je razširitev z gama pravilna tudi za realne n: primerjava v
  // točkah velja. Pri enačbi bi dala tuje rešitve (nCr(n, 2) = 10 tudi pri n = −4).
  if (identiteta) return false;
  for (let i = s.indexOf("!"); i >= 0; i = s.indexOf("!", i + 1)) {
    if (s[i + 1] === "=") continue;
    if (/[A-Za-z]/.test(s[i - 1] || "")) return true;
    if (s[i - 1] === ")") {
      let d = 0;
      let j = i - 1;
      for (; j >= 0; j--) if ((d += s[j] === ")" ? 1 : s[j] === "(" ? -1 : 0) === 0) break;
      if (/[A-Za-z]/.test(s.slice(j, i))) return true;
    }
  }
  return false;
}

export function verifyAi(problemText0, ai0) {
  const problemText = kombinatorika(problemText0);
  const ai = ai0 && { ...ai0, value: kombinatorika(ai0.value), ...(Array.isArray(ai0.solutions) ? { solutions: ai0.solutions.map(kombinatorika) } : {}) };
  const identiteta = ai?.kind === "expression" || ai?.kind === "arith";
  // rešitev (in vrednost pri neenačbi) je lahko interval »(0,1)«
  const resitve = [...(ai?.kind === "inequality" ? [ai?.value] : []), ...(Array.isArray(ai?.solutions) ? ai.solutions : [])];
  if (neizracunljivo(problemText, { identiteta }) || (ai?.kind !== "inequality" && neizracunljivo(ai?.value, { identiteta })) || resitve.some((t) => neizracunljivo(t, { identiteta, resitev: true }))) return { verified: false, reason: "parse", status: "unverified" };
  // prevelika števila: prebrana vrednost ni vrednost iz naloge, odloči SymPy (status »unverified«)
  if (bigLiteral(problemText) || [...(ai?.solutions || []), ai?.value].some((x) => bigLiteral(x))) return { verified: false, reason: "big", status: "unverified" };
  const r = check(problemText, ai);
  const ev = r.evidence || (r.verified ? { holds: true, how: "numeric", complete: r.partial ? "unknown" : "numeric" } : { holds: r.reason === "wrong" || r.reason === "missing" ? false : null });
  const status = statusOf(ev);
  const out = { ...r, partial: ev.complete === "unknown" || undefined, status };
  // Točen protiprimer (ulomki, Sturm): strežnik ga ne sme preglasiti s SymPy (server/scan.js verifyAiFull). Ne, kadar
  // naloga ali odgovor vsebuje i, I ali E: SymPy ju bere kot imaginarno enoto oz. konstanto, tryPoly kot spremenljivko.
  // Gledamo le rešitve in vrednost, ne besedila korakov (»i« je beseda v hrvaščini in italijanščini).
  if (ev.holds === false && ev.how === "exact" && !/(?<![A-Za-z])[iIE](?![A-Za-z])/.test(`${problemText} ${JSON.stringify([ai?.solutions, ai?.value])}`)) out.exact = true;
  delete out.evidence;
  if (!out.partial) delete out.partial;
  return r.verified ? { ...out, reason: null } : out;
}

// odvod polinoma po spremenljivki v (druge črke so konstante)
const polyDiff = (p, v) => new P(p.terms().filter(({ m }) => m[v]).map(({ m, c }) => ({ m: { ...m, [v]: m[v] - 1 }, c: c.mul(Q.of(m[v])) })));

// Vrsta naloge iz zapisa: integral in limito prepoznamo po zapisu, ne po tem, kako ju je AI poimenoval (meritev 26. 11.:
// integral z odgovorom 0 namesto 6 je ostal nepreverjen, ker AI ni rekel »integral«, in se ni ponovil). Le, ko zapis
// z njima začne: »2∫…«, »d/dx ∫…« in enačbe z integralom ali limito odloči vrsta, ki jo je dal AI (pregled).
export function kindOfText(text) {
  const s = String(text ?? "").replace(/\\int/g, "∫");
  if (/[=<>≤≥]/.test(s.replace(/->/g, "→"))) return null;
  if (parseIntegral(s)) return "integral";
  if (parseLimit(s)) return "limit";
  return null;
}
// meja integrala ali točka limite: {…}, (…) ali eno število ali ime (»10«, »-1«, »pi«, »oo«, »a«)
function bound(s, i) {
  const open = s[i];
  if (open === "{" || open === "(") {
    const close = open === "{" ? "}" : ")";
    let d = 0;
    for (let j = i; j < s.length; j++) {
      if (s[j] === open) d++;
      else if (s[j] === close && --d === 0) return { v: s.slice(i + 1, j).trim(), end: j + 1 };
    }
    return null;
  }
  const m = /^[-−]?(?:\d+(?:[.,]\d+)?|\\infty|[a-zA-Zπ∞]+)/.exec(s.slice(i));
  return m ? { v: m[0], end: i + m[0].length } : null;
}
// ∫_a^b f dx, ∫ f dx (zapis se začne z ∫) → { a, b, f, x } (a, b le pri določenem integralu)
export function parseIntegral(text) {
  const s = String(text ?? "").replace(/\\int/g, "∫").trim();
  if (!s.startsWith("∫")) return null;
  let i = 1;
  let a;
  let b;
  if (s[i] === "_") {
    const lo = bound(s, i + 1);
    if (!lo || s[lo.end] !== "^") return null;
    const hi = bound(s, lo.end + 1);
    if (!hi) return null;
    [a, b, i] = [lo.v, hi.v, hi.end];
  }
  const m = /^\s*(.+?)\s*(?:[*·]\s*)?(?:\\,\s*)?d([a-z])\s*$/.exec(s.slice(i));
  if (!m || /[∫]/.test(m[1])) return null;
  const meja = (v) => v?.replace(/\\pi/g, "pi").replace(/\\infty|∞/g, "oo");
  return { a: meja(a), b: meja(b), f: m[1], x: m[2] };
}
// Nedoločeni integral: »F + C« → »F« (konstanta je poljubna); null, če je C (ali K) še kje drugje (x^2 + C*x ni
// pravilen odgovor, SymPy pa bi C nadomestil z 0).
export function bezKonstante(value) {
  const v = String(value ?? "").replace(/\s*\+\s*[CK]\s*$/, "");
  return /(?<![A-Za-z])[CK](?![A-Za-z])/.test(v) ? null : v;
}
// lim_(x->a) f, lim_{x\to a} f (zapis se začne z lim) → { x, point, f }; točka za SymPy (oo, 0+, 0-)
export function parseLimit(text) {
  const m = /^\s*\\?lim\s*_\s*([({])\s*([a-z])\s*(?:->|→|\\to)\s*/.exec(String(text ?? ""));
  if (!m) return null;
  const s = String(text);
  const close = m[1] === "{" ? "}" : ")";
  let d = 1;
  let j = m[0].length;
  for (; j < s.length && d; j++) d += s[j] === m[1] ? 1 : s[j] === close ? -1 : 0;
  if (d) return null;
  const point = s
    .slice(m[0].length, j - 1)
    .replace(/\\infty|∞/g, "oo")
    .replace(/\^\s*\{?\s*([+-])\s*\}?\s*$/, "$1")
    .replace(/\s+/g, "");
  const f = s.slice(j).trim();
  return point && f ? { x: m[2], point, f } : null;
}

function check(problemText, ai) {
  const kind = kindOfText(problemText) ?? ai?.kind;
  const v = /^[a-zA-Z]$/.test(ai?.variable || "") ? ai.variable : "x";
  try {
    if (kind === "system") {
      const parts = splitSystem(problemText) || String(problemText).split(/;|\n/).filter((s) => s.includes("="));
      for (const sol of ai.solutions || []) {
        const vals = new Map(); // ključ je ena črka; Map namesto pisanja v objekt (CodeQL js/remote-property-injection)
        for (const m of String(sol).matchAll(/([a-zA-Z])\s*=\s*([^;,]+(?:,\d+)?)/g)) {
          const val = values(m[2])[0];
          if (val === undefined) return { verified: false, reason: "parse" };
          vals.set(m[1], val);
        }
        const env = Object.fromEntries(vals);
        if (!parts.length || parts.some((p) => satisfies(p, env) !== true)) return { verified: false, reason: "wrong" };
      }
      // Numerika preveri le, da vsaka dana rešitev zadošča sistemu, ne pa, da ni še drugih (AUDIT-001):
      // »partial« pove strežniku, da »preverjeno« sme reči le SymPy (server/scan.js verifyAiFull).
      return { verified: (ai.solutions || []).length > 0, reason: (ai.solutions || []).length ? null : "empty", partial: true };
    }
    if (kind === "equation") {
      if (!isEquation(problemText)) return { verified: false, reason: "kind" };
      // »x = 2« ali »x_1 = 2« → »2«
      const sols = (ai.solutions || []).flatMap((s) => values(String(s).replace(/^\s*[a-zA-Z](?:_\{?\d+\}?)?\s*=(?!=)/, "")));
      const periodic = (ai.solutions || []).some((s) => /\bk\b/.test(s));
      // Polinomska enačba: točen preizkus in Sturmov izrek (popolnost na vsej realni osi, ne le do ±10⁶; AUDIT-001).
      // Veriga a = b = c: rešitve so skupne ničle vseh parov, torej ničle njihovega največjega skupnega delitelja.
      const ast = parse(prep(problemText));
      const pairs = periodic ? [] : ast.terms.slice(1).map((t, i) => sidesPoly(ast.terms[i], t, v));
      const cs = pairs.length && pairs.every(Boolean) ? (pairs.length === 1 ? pairs[0] : polyGcd(pairs)) : null;
      if (cs && cs.length === 1 && !cs[0].zero && !(ai.solutions || []).length) {
        // skupnih ničel ni (npr. x = x + 1 ali veriga brez skupne ničle): »ni rešitve« je dokazano
        return { verified: true, evidence: { holds: true, how: "exact", complete: "exact" } };
      }
      if (cs && cs.length > 1) {
        const raw = (ai.solutions || []).map((s) => String(s).replace(/^\s*[a-zA-Z](?:_\{?\d+\}?)?\s*=(?!=)/, ""));
        const claims = raw.map((s) => {
          const e = exactValue(s);
          const tol = decimalTol(s);
          const num = values(s)[0];
          return e ? { s: e, ...(tol ? { num, tol } : {}) } : { num, tol };
        });
        if (claims.some((c) => !c.s && !Number.isFinite(c.num))) return { verified: false, reason: "parse" };
        const pe = polyEquationProof(cs, claims);
        if (pe) {
          if (!pe.holds) return { verified: false, reason: "wrong", evidence: { holds: false, how: pe.exact ? "exact" : "numeric" } };
          if (pe.complete === false) return { verified: false, reason: "missing", missing: pe.missing };
          return { verified: true, evidence: { holds: true, how: pe.exact ? "exact" : "numeric", complete: pe.complete === true ? "exact" : "unknown" } };
        }
      }
      if (!(ai.solutions || []).length) {
        // »ni rešitve«: preverimo, da numerično res ni ničle. Iskanje seže le do ±10⁶, zato prazen izid
        // ni dokaz, da rešitve ni (numerično, AUDIT-001).
        const r = scanRoots(problemText, v);
        return r.length ? { verified: false, reason: "missing", missing: r } : { verified: true, reason: null, missing: r, ...(ast.terms.length > 2 ? { partial: true } : {}) };
      }
      if (!sols.length) return { verified: false, reason: "parse" };
      // zaokroženo decimalno število (2^x = 3 → 1.585): drži, če je ničla L − D v oknu pol zadnjega mesta
      const tols = (ai.solutions || []).flatMap((s) => {
        const raw = String(s).replace(/^\s*[a-zA-Z](?:_\{?\d+\}?)?\s*=(?!=)/, "");
        return values(raw).map(() => decimalTol(raw));
      });
      const tolOf = (i) => (tols.length === sols.length ? tols[i] : 0);
      for (let i = 0; i < sols.length; i++) {
        if (satisfies(problemText, { [v]: sols[i] }) === true) continue;
        if (!(tolOf(i) > 1e-12 && rootNear(ast, v, sols[i], tolOf(i)))) return { verified: false, reason: "wrong" };
      }
      if (!periodic) {
        const missing = scanRoots(problemText, v).filter((r) => !sols.some((s, i) => Math.abs(s - r) < Math.max(1e-5 * Math.max(1, Math.abs(r)), tolOf(i) * 1.0001)));
        if (missing.length) return { verified: false, reason: "missing", missing };
      }
      // Pri periodičnih rešitvah (k) popolnosti numerično ne preverimo: manjkajoča družina ali »2+0·k«
      // namesto dveh rešitev bi sicer veljala za preverjeno (AUDIT-001).
      // Brez periodičnih rešitev je popolnost preverjena numerično (iskanje ničel do ±10⁶); verige a = b = c
      // iskanje ne zajame, zato je tam popolnost nepreverjena.
      return periodic || ast.terms.length > 2 ? { verified: true, partial: true } : { verified: true };
    }
    if (kind === "inequality") return checkInequality(problemText, ai, v);
    if (kind === "expression" || kind === "arith") {
      const a = parse(prep(problemText));
      const b = parse(prep(ai.value));
      // polinoma primerjamo točno (ulomki), sicer v naključnih točkah
      const ok = withLimit(POLY_LIMIT, () => {
        const pa = tryPoly(a);
        const pb = tryPoly(b);
        return pa && pb ? pa.eq(pb) : null;
      });
      // Zaokroženo decimalno število kot vrednost števila (1/3 → 0.33, √2 → 1.414; pogoji v zaokrozenRacun): drži numerično,
      // če je razlika največ pol zadnjega mesta. Točna primerjava (ostane, kadar drži: 1.2·0.3 = 0.36) bi ga označila kot
      // napačnega (N-01, skoraj-016/018/022).
      const tol = kind === "arith" && ok !== true ? zaokrozenRacun(problemText, ai.value) : 0;
      if (tol) {
        const d = Math.abs(compile(a)({}) - compile(b)({}));
        const drzi = d <= tol + 1e-12 * Math.abs(compile(a)({}));
        if (fin(d)) return { verified: drzi, reason: "wrong", evidence: { holds: drzi, how: "numeric", complete: "na" } };
      }
      if (ok !== null) return { verified: ok, reason: "wrong", evidence: { holds: ok, how: "exact", complete: "na" } };
      return { verified: equalNumerically(a, b), reason: "wrong" };
    }
    if (kind === "derivative") {
      const izraz = String(problemText).replace(/^\s*(d\/d[a-z]|f\(x\)\s*=)\s*/, "");
      const f = fnOf(izraz);
      const g = fnOf(ai.value);
      if (!f || !g) return { verified: false, reason: "parse" };
      // Naloga brez »d/dx« ali »f(x) =«, ki je konstanta (npr. določeni integral): odvod bi bil 0 in bi potrdil napačno
      // rešitev »0«, ki jo AI označi kot odvod (meritev skenerja 19. 11., naloga s11).
      if (izraz === String(problemText)) {
        const y = [0.3, 1.7, -2.1].map((t) => f({ [v]: t }));
        if (y.every((w) => fin(w) && Math.abs(w - y[0]) < 1e-9)) return { verified: false, reason: "kind" };
      }
      // polinom odvajamo točno (ulomki); numerični odvod v točkah ne loči koeficienta 5999999 od 6000000 (PV-02)
      const ok = withLimit(POLY_LIMIT, () => {
        const pf = tryPoly(parse(prep(izraz)));
        const pg = tryPoly(parse(prep(ai.value)));
        return pf && pg ? polyDiff(pf, v).eq(pg) : null;
      });
      if (ok !== null) return { verified: ok, reason: "wrong", evidence: { holds: ok, how: "exact", complete: "na" } };
      return { verified: compareFns((x) => odvodV((t) => f({ [v]: t }), x), (x) => g({ [v]: x })), reason: "wrong" };
    }
    if (kind === "integral") {
      const m = parseIntegral(problemText);
      const g = fnOf(m?.a !== undefined ? ai.value : (bezKonstante(ai.value) ?? ""));
      if (!m || !g) return { verified: false, reason: "parse" };
      const f = fnOf(m.f);
      const x = m.x;
      if (!f) return { verified: false, reason: "parse" };
      // Map namesto pisanja v objekt z imenom iz besedila (CodeQL js/remote-property-injection), kot pri sistemih
      const env = (t) => Object.fromEntries(new Map([[x, t]]));
      if (m.a !== undefined) {
        const a = values(m.a)[0];
        const b = values(m.b)[0];
        const exact = integrate((t) => f(env(t)), a, b);
        const val = g({});
        return { verified: fin(exact) && fin(val) && Math.abs(exact - val) < 1e-6 * Math.max(1, Math.abs(exact)), reason: "wrong" };
      }
      return { verified: compareFns((t) => f(env(t)), (t) => odvodV((u) => g(env(u)), t)), reason: "wrong" };
    }
  } catch {
    return { verified: false, reason: "error" };
  }
  return { verified: false, reason: "kind" };
}

// Ali ima L − D ničlo na [x − tol, x + tol] (sprememba predznaka ali vrednost ≈ 0 v kateri od točk mreže)
function rootNear(ast, v, x, tol) {
  if (ast.k !== "cmp" || ast.terms.length !== 2) return false;
  const L = compile(ast.terms[0]);
  const R = compile(ast.terms[1]);
  const g = (t) => L({ [v]: t }) - R({ [v]: t });
  let prev = null;
  for (let i = 0; i <= 20; i++) {
    const t = x - tol + (2 * tol * i) / 20;
    const y = g(t);
    if (!fin(y)) return false;
    if (Math.abs(y) <= 1e-12 * Math.max(1, Math.abs(L({ [v]: t })))) return true;
    if (prev !== null && Math.sign(prev) !== Math.sign(y)) return true;
    prev = y;
  }
  return false;
}

// Neenačba (AI navede množico v ai.value, npr. »(-oo, 2) U [3, oo)«). Polinomska: točno (kritične točke; ničle višje
// stopnje kot Sturmovi izolirajoči intervali, algebra.js inequalityCheck). Sicer numerično: v krajiščih (enakost odloči
// strogost znaka, zunaj definicijskega območja ni rešitve) in v mnogo točkah do ±10⁶.
function checkInequality(problemText, ai, v) {
  let ast;
  try {
    ast = parse(prep(problemText));
  } catch {
    return { verified: false, reason: "parse" };
  }
  if (ast.k !== "cmp" || ast.ops.some((o) => o === "=")) return { verified: false, reason: "kind" };
  const ivs = parseSet(ai.value);
  if (!ivs) return { verified: false, reason: "parse" };
  const ends = ivs.flatMap((iv) => [iv.lo, iv.hi, iv.point]).filter(Boolean);
  const rels = ast.ops.map((op, i) => ({ cs: sidesPoly(ast.terms[i], ast.terms[i + 1], v), op }));
  if (rels.every((r) => r.cs)) {
    // krajišče brez točne vrednosti (npr. sqrt(2)+sqrt(3)) je približek z majhno toleranco
    const endOf = (e) => (e ? (e.s ? { s: e.s, tol: e.tol || 0 } : { s: qFromFloatSafe(e.x), tol: 1e-9 * Math.max(1, Math.abs(e.x)) }) : null);
    const ok = ends.every((e) => e.s || qFromFloatSafe(e.x));
    const r = ok ? inequalityCheck(rels, ivs.map((iv) => ({ ...iv, lo: endOf(iv.lo), hi: endOf(iv.hi), point: endOf(iv.point) }))) : null;
    // rounded: numerično samo zaradi zaokroženih krajišč (sicer dokazano), strežnik tu SymPy ne pusti prevladati
    if (r) return r.holds ? { verified: true, ...(r.exact ? {} : { rounded: true }), evidence: { holds: true, how: r.exact ? "exact" : "numeric", complete: r.exact ? "exact" : "numeric" } } : { verified: false, reason: "wrong", evidence: { holds: false } };
  }
  const inSet = (x) =>
    ivs.some((iv) => (iv.point ? x === iv.point.x : (iv.lo == null || x > iv.lo.x || (iv.loClosed && x === iv.lo.x)) && (iv.hi == null || x < iv.hi.x || (iv.hiClosed && x === iv.hi.x))));
  const fs = ast.terms.map((t) => compile(t));
  // resničnost v x: true / false / null (skoraj enako, a ne v krajišču: ne odločamo); undefined = zunaj območja
  const truthAt = (x, atEnd) => {
    const vals = fs.map((f) => f({ [v]: x }));
    if (vals.some((y) => !Number.isFinite(y))) return undefined;
    let truth = true;
    for (let i = 0; i < ast.ops.length; i++) {
      const [a, b] = [vals[i], vals[i + 1]];
      const tol = 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
      const op = ast.ops[i];
      if (Math.abs(a - b) <= tol) {
        if (!atEnd) return null;
        if (op === "<" || op === ">") truth = false; // v krajišču, kjer sta strani enaki, odloči strogost znaka
        continue;
      }
      if ((op === "<" || op === "<=") !== a < b) truth = false;
    }
    return truth;
  };
  // krajišča: samo tista, ki jih double zapiše točno (cela števila, 0,5 …); pri √2 ali 1/49 je imenovalec v
  // zaokroženi točki le skoraj 0 in vrednost »končna«, zato tam ne odločamo (prej lažno »napačno«)
  const exactFloat = (e) => e.s?.rational && !e.tol && (e.s.u.d & (e.s.u.d - 1n)) === 0n && (e.s.u.n < 0n ? -e.s.u.n : e.s.u.n) < 2n ** 53n;
  // polinomske strani: krajišče s točno vrednostjo preverimo točno (ne v plavajoči vejici, kjer zaokrožitev v ničli
  // obrne predznak)
  const polyRels = rels.every((r) => r.cs) ? rels.map((r) => ({ cs: r.cs, op: r.op })) : null;
  for (const e of ends) {
    if (polyRels && e.s && !e.tol) {
      let t = null;
      try {
        t = polyRels.every((r) => relSign(evalCs(r.cs, e.s).sign, r.op));
      } catch {}
      if (t !== null) {
        if (t !== inSet(e.x)) return { verified: false, reason: "wrong" };
        continue;
      }
    }
    if (!exactFloat(e)) continue;
    const t = truthAt(e.x, true);
    const member = inSet(e.x);
    if (t === undefined) {
      if (member) return { verified: false, reason: "wrong" }; // zunaj definicijskega območja ne more biti rešitev
      continue;
    }
    if (t !== null && t !== member) return { verified: false, reason: "wrong" };
  }
  const xs = [];
  for (let i = 0; i <= 4000; i++) xs.push(-50 + i / 40 + 0.0013);
  for (let i = 1; i <= 400; i++) {
    const x = 50 * Math.pow(2e4, i / 400);
    xs.push(x, -x);
  }
  for (const e of ends) for (const d of [1e-4, 1e-2]) xs.push(e.x - d * Math.max(1, Math.abs(e.x)), e.x + d * Math.max(1, Math.abs(e.x)));
  let tested = 0;
  for (const x of xs) {
    if (ends.some((e) => Math.abs(x - e.x) < 1e-5 * Math.max(1, Math.abs(e.x)))) continue;
    const truth = truthAt(x, false);
    if (truth === undefined) {
      // daleč od izhodišča je ±∞ (ne NaN) lahko le prekoračitev (10^x pri x = 400), ne meja definicijskega območja
      const overflow = Math.abs(x) > 100 && fs.some((f) => Math.abs(f({ [v]: x })) === Infinity);
      if (!overflow && inSet(x)) return { verified: false, reason: "wrong" };
      continue;
    }
    if (truth === null) continue;
    tested++;
    if (truth !== inSet(x)) return { verified: false, reason: "wrong" };
  }
  return tested ? { verified: true, evidence: { holds: true, how: "numeric", complete: "numeric" } } : { verified: false, reason: "parse" };
}
const relSign = (s, op) => (op === "<" ? s < 0 : op === ">" ? s > 0 : op === "<=" ? s <= 0 : op === ">=" ? s >= 0 : s === 0);
function qFromFloatSafe(x) {
  try {
    return qFromFloat(x);
  } catch {
    return null;
  }
}

// Odvod v točki s petimi točkami: pri hitro nihajočih funkcijah (cos(x⁵) pri x = 5,3) je simetrična
// razlika s tremi točkami netočna za ~10⁻³ in je sprožila lažni alarm (N-01, odvod2-027/043).
function odvodV(f, x) {
  const d = (h) => (f(x - 2 * h) - 8 * f(x - h) + 8 * f(x + h) - f(x + 2 * h)) / (12 * h);
  // Richardsonova ekstrapolacija (napaka ~h⁶): cos(x⁶) pri x = 5,3 niha prehitro tudi za pet točk s h = 10⁻⁵.
  return (16 * d(5e-6) - d(1e-5)) / 15;
}

function compareFns(f, g) {
  let tested = 0;
  for (const x of [0.37, 1.3, 2.1, -0.8, 3.7, -2.2, 0.9, 5.3]) {
    const a = f(x);
    const b = g(x);
    if (!fin(a) || !fin(b)) continue;
    tested++;
    if (Math.abs(a - b) > 1e-4 * Math.max(1, Math.abs(a))) return false;
  }
  return tested >= 2;
}
