// Preverjanje besedilnih nalog s podatki na zaslonu Skeniraj (j 26. 11.: »Da, začni« na kartici »Začnem preverjanje
// besedilnih nalog s podatki v skenerju?«). Pri taki nalogi (besedilo »S=?«, podatki v »given«) koda ne zna sama
// postaviti formule. Zato AI ob rešitvi vrne še »check«: vrednosti vseh količin in formule, ki jih je uporabil. Tu jih
// sami preračunamo in preverimo:
//   1. vsak podatek naloge je uporabljen (kot vrednost ali število v formuli, tudi pretvorjen v drugo enoto: 2 kW → 2000);
//   2. z vrednostmi drži vsaka formula (v okviru zaokrožitve zapisanih decimalk);
//   3. formule iz podatkov res določijo iskano količino in ta je odvisna od vsakega podatka (rang Jacobijeve matrike),
//      zato zapis »S=32« ali »S=S« ne velja;
//   4. vrednost iskane količine se ujema s končnim odgovorom.
// Vse drži → »partial« (Delno preverjeno): račun je preverjen, ali so formule prave za nalogo, pa ne (to je postavitev
// naloge, ki je koda ne razume). Formula ne drži → »wrong« in strežnik poskusi znova (server/scan.js). Vse drugo
// (manjka check, nečitljiv zapis, neuporabljen podatek, druga enota v odgovoru) → »unverified« kot doslej, brez ponovitve.
// Brez DOM: teče na strežniku in v testih.
import { parse, compile, freeVars, walk } from "../graph/math.js";
import { prep } from "./solvecore.js";
import { statusOf } from "./status.js";

const fin = Number.isFinite;
const MAX_VALUES = 24;
const MAX_EQUATIONS = 12;

// Iskana količina iz besedila naloge »S=?«, »alpha=?«, »S_10=?« → ime spremenljivke (α, S_10), sicer null (f(x)=? ni število).
export function iskanaKolicina(text) {
  const m = /^\s*([^=]+?)\s*=\s*\?\s*$/.exec(String(text ?? ""));
  return m ? imeKolicine(m[1]) : null;
}

function imeKolicine(name) {
  if (typeof name !== "string" || !name.trim() || name.length > 16) return null;
  try {
    const a = parse(prep(name.trim()));
    return a.k === "var" ? a.name : null;
  } catch {
    return null;
  }
}

// Število z decimalno piko ali vejico in zapisom ×10^k: »1.4e6«, »1,5«, »−3« → zapis za razčlenjevalnik.
const stevilo = (t) =>
  String(t ?? "")
    .replace(/−/g, "-")
    .replace(/(\d),(\d)/g, "$1.$2")
    .replace(/^\s*([+-])\s+/, "$1")
    .replace(/(\d)[eE]([+-]?\d+)(?![\d.])/g, "$1*10^($2)");

// Vrednost iz »check.values«: število ali izraz brez spremenljivk (22.62°, 5/12, sqrt(2), 1.5*10^(3)).
//   v:  vrednost za formule (stopinje so pretvorjene v radiane, kot jih računa kalkulator),
//   n:  število, kot je zapisano (stopinje ostanejo stopinje): za primerjavo s podatki in odgovorom,
//   d:  zaokrožitev zapisa (pol zadnjega mesta pri decimalnem številu, 0 pri celem številu ali izrazu), v enotah v.
function vrednost(text) {
  const s = stevilo(text).trim();
  if (!s || s.length > 60) return null;
  const deg = /°\s*$/.test(s);
  const bare = s.replace(/°\s*$/, "");
  let n;
  try {
    const a = parse(prep(bare));
    if (freeVars(a).size) return null;
    n = compile(a)({});
  } catch {
    return null;
  }
  if (!fin(n)) return null;
  const k = deg ? Math.PI / 180 : 1;
  const m = /^[+-]?\d*\.(\d+)(?:\*10\^\(([+-]?\d+)\))?$/.exec(bare);
  const d = m ? 0.5 * 10 ** (Number(m[2] || 0) - m[1].length) * 1.0001 : 0;
  return { v: n * k, n, d: d * k, deg };
}

// Pretvorbe enot, ki jih dovolimo med podatkom in vrednostjo: desetiške predpone, minute/ure/dnevi, km/h ↔ m/s,
// stopinje ↔ radiani (in °C → K spodaj). Faktorji so točni, razen π-pretvorb (tam je vrednost zapisana zaokroženo).
const OSNOVNI = [
  [1, 1e-9],
  [60, 1e-9],
  [1 / 60, 1e-9],
  [3600, 1e-9],
  [1 / 3600, 1e-9],
  [86400, 1e-9],
  [1 / 86400, 1e-9],
  [3.6, 1e-9],
  [1 / 3.6, 1e-9],
  [Math.PI / 180, 1e-3],
  [180 / Math.PI, 1e-3],
];
const FAKTORJI = OSNOVNI.flatMap(([f, tol]) => Array.from({ length: 25 }, (_, i) => [f * 10 ** (i - 12), tol]));

// Ali je število p (vrednost v rešitvi) podatek n, morda v drugi enoti. Predznak ne šteje (smer, »izguba«).
export function istiPodatek(n, p) {
  if (!fin(n) || !fin(p)) return false;
  if (n === 0) return p === 0;
  const a = Math.abs(n);
  const b = Math.abs(p);
  if (FAKTORJI.some(([f, tol]) => Math.abs(b - a * f) <= tol * a * f)) return true;
  return [273.15, 273].some((k) => Math.abs(p - (n + k)) <= 1e-9 * Math.abs(n + k)); // °C → K
}

// Števila v podatkih naloge (LaTeX): »m = 1{,}5\ \mathrm{kg}« → 1.5, »a_3 = 7« → 7 (indeks ni podatek),
// »2 \cdot 10^{-3}\,\mathrm{m^2}« → 0.002 (eksponent enote ni podatek), »\frac{1}{2}« → 0.5.
export function stevilaPodatkov(given = []) {
  const out = [];
  for (const g of [].concat(given || [])) {
    let s = String(g ?? "")
      .replace(/−/g, "-")
      .replace(/\{,\}/g, ".")
      .replace(/\\(?:text|mathrm|textrm|mbox|operatorname)\s*\{([^{}]*)\}/g, " $1 ")
      .replace(/\\[,;:! ]|~|\\q?quad/g, " ")
      .replace(/\\(?:d|t)?frac\s*\{\s*(-?\d+(?:\.\d+)?)\s*\}\s*\{\s*(\d+(?:\.\d+)?)\s*\}/g, (_, a, b) => ` ${Number(a) / Number(b)} `)
      .replace(/(\d)\s*(?:\\cdot|\\times|·|×|\*)\s*10\s*\^\s*\{?\s*([+-]?\d+)\s*\}?/g, "$1e$2")
      .replace(/(?<![\d.])10\s*\^\s*\{?\s*([+-]?\d+)\s*\}?/g, "1e$1")
      .replace(/_\s*\{[^{}]*\}|_\s*[A-Za-z0-9]+/g, " ")
      .replace(/\^\s*\{[^{}]*\}|\^\s*[-+]?\d+/g, " ")
      .replace(/\\circ/g, " ");
    // decimalna vejica 1,5 (brez oklepajev: »T(1,4)« je točka, ne 1,4)
    if (!/[([{]/.test(s)) s = s.replace(/(\d),(\d)/g, "$1.$2");
    for (const m of s.matchAll(/(?<![\w.])-?\d+(?:\.\d+)?(?:e[+-]?\d+)?(?![\d.])/g)) {
      const n = Number(m[0]);
      if (fin(n)) out.push(n);
    }
  }
  return out;
}

// Število v končnem odgovoru: »32«, »S = 32 cm^2«, »22.62°«, LaTeX »t \approx 189\,\mathrm{s}«. Brez enot, stopinje ostanejo stopinje.
export function steviloOdgovora(sol) {
  const cands = [sol?.value, ...(Array.isArray(sol?.solutions) ? sol.solutions : []), sol?.answer_tex].filter((x) => typeof x === "string" && x.trim());
  for (const c of cands) {
    const zadnji = String(c).split(/=|≈|\\approx|\\doteq/).pop();
    const v = vrednost(zadnji.replace(/\s*°\s*$/, ""));
    if (v) return v.n;
    const n = stevilaPodatkov([zadnji]);
    if (n.length) return n[0];
  }
  return null;
}

// AI »check« → {values: Map(ime → vrednost), equations: [{text, L, R, vars}]} ali razlog, zakaj ga ni mogoče prebrati.
function preberiCheck(check) {
  const pairs = Array.isArray(check?.values) ? check.values : [];
  const eqs = Array.isArray(check?.equations) ? check.equations : [];
  if (!pairs.length || !eqs.length) return { why: "no check" };
  if (pairs.length > MAX_VALUES || eqs.length > MAX_EQUATIONS) return { why: "too long" };
  const values = new Map();
  for (const [name, text] of pairs) {
    const ime = imeKolicine(name);
    const v = vrednost(text);
    if (!ime || !v || values.has(ime)) return { why: `value ${name}` };
    values.set(ime, { ...v, text: String(text) });
  }
  const equations = [];
  for (const text of eqs) {
    let ast;
    try {
      ast = parse(prep(String(text)));
    } catch {
      return { why: `equation ${text}` };
    }
    if (ast.k !== "cmp" || ast.terms.length !== 2 || ast.ops[0] !== "=") return { why: `equation ${text}` };
    const vars = [...freeVars(ast)];
    if (!vars.length || vars.some((x) => !values.has(x))) return { why: `equation ${text}` };
    const lits = [];
    walk(ast, (n) => {
      if (n.k === "num") lits.push(n.v);
    });
    equations.push({ text: String(text), L: compile(ast.terms[0]), R: compile(ast.terms[1]), vars, lits });
  }
  const used = new Set(equations.flatMap((e) => e.vars));
  if ([...values.keys()].some((x) => !used.has(x))) return { why: "unused value" };
  return { values, equations };
}

// Ostanek L − D vseh formul pri vrednostih env (navaden objekt z imeni, ki jih je prebral razčlenjevalnik).
const ostanki = (equations, env) => equations.map((e) => e.L(env) - e.R(env));

// Imena kotov (alpha → α): pri njih zapis brez ° morda pomeni stopinje.
const GRSKE = /^[α-ω](_|$)/;

// Ali vse formule držijo pri vrednostih env v okviru zaokrožitve d (pol zadnjega mesta vsake vrednosti, preneseno
// skozi formulo z odvodom). → { fail: indeks prve formule, ki ne drži, ali −1, J: ∂(L − D)/∂vrednost } ali null (ni definirano).
function preizkus(equations, names, env, d) {
  const r0 = ostanki(equations, env);
  if (r0.some((r) => !fin(r))) return null;
  const J = equations.map(() => []);
  for (const x of names) {
    const h = 1e-6 * Math.max(1, Math.abs(env[x]));
    const rp = ostanki(equations, { ...env, [x]: env[x] + h });
    const rm = ostanki(equations, { ...env, [x]: env[x] - h });
    if ([...rp, ...rm].some((r) => !fin(r))) return null;
    equations.forEach((_, i) => J[i].push((rp[i] - rm[i]) / (2 * h)));
  }
  const fail = equations.findIndex((e, i) => {
    const tol = names.reduce((s, x, j) => s + Math.abs(J[i][j]) * d[x], 0) + 1e-9 * Math.max(Math.abs(e.L(env)), Math.abs(e.R(env)), 1e-300);
    return !(Math.abs(r0[i]) <= tol);
  });
  return { fail, J };
}

// Rang matrike (Gaussova eliminacija z delnim pivotiranjem, relativni prag).
function rang(M) {
  const A = M.map((r) => r.slice());
  const rows = A.length;
  const cols = rows ? A[0].length : 0;
  const max = Math.max(0, ...A.flat().map(Math.abs));
  if (!max) return 0;
  let r = 0;
  for (let c = 0; c < cols && r < rows; c++) {
    let p = r;
    for (let i = r + 1; i < rows; i++) if (Math.abs(A[i][c]) > Math.abs(A[p][c])) p = i;
    if (Math.abs(A[p][c]) <= 1e-8 * max) continue;
    [A[r], A[p]] = [A[p], A[r]];
    for (let i = r + 1; i < rows; i++) {
      const f = A[i][c] / A[r][c];
      for (let j = c; j < cols; j++) A[i][j] -= f * A[r][j];
    }
    r++;
  }
  return r;
}

// Rešitev sistema A x = b (kvadratna, Gauss z delnim pivotiranjem); null, če je singularna.
function resi(A0, b0) {
  const n = A0.length;
  const A = A0.map((r, i) => [...r, b0[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let i = c + 1; i < n; i++) if (Math.abs(A[i][c]) > Math.abs(A[p][c])) p = i;
    if (!A[p][c]) return null;
    [A[c], A[p]] = [A[p], A[c]];
    for (let i = 0; i < n; i++) {
      if (i === c) continue;
      const f = A[i][c] / A[c][c];
      for (let j = c; j <= n; j++) A[i][j] -= f * A[c][j];
    }
  }
  return A.map((r, i) => r[n] / r[i]);
}

const fmt = (x) => (fin(x) ? String(Number(x.toPrecision(6))) : String(x));

/**
 * Preveri rešitev naloge s podatki. text: »S=?«, given: podatki (LaTeX), sol: očiščena rešitev AI s sol.racun
 * ({values: [[ime, vrednost]], equations: [...]}).
 * → { verified: false, reason: "given", status: "partial" | "unverified", why? } ali { verified: false, reason: "wrong", status: "wrong", note }.
 */
export function preveriPodatke(text, given, sol) {
  const nic = (why) => ({ verified: false, reason: "given", status: "unverified", why });
  const iskana = iskanaKolicina(text);
  if (!iskana) return nic("not a quantity");
  const c = preberiCheck(sol?.racun);
  if (!c.values) return nic(c.why);
  const { values, equations } = c;
  if (!values.has(iskana)) return nic("asked quantity missing");
  const names = [...values.keys()];
  const env = Object.fromEntries(names.map((x) => [x, values.get(x).v]));

  // 1. vsak podatek je uporabljen (vrednost ali število v formuli, morda v drugi enoti; 0 ne šteje)
  const data = stevilaPodatkov(given);
  const pool = [...names.filter((x) => x !== iskana).map((x) => values.get(x).n), ...equations.flatMap((e) => e.lits)];
  if (data.some((n) => n !== 0 && !pool.some((p) => istiPodatek(n, p)))) return nic("unused datum");
  const podatek = new Set(names.filter((x) => x !== iskana && data.some((n) => istiPodatek(n, values.get(x).n))));

  // 2. vsaka formula drži v okviru zaokrožitve zapisanih vrednosti
  const d0 = Object.fromEntries(names.map((x) => [x, values.get(x).d]));
  const p = preizkus(equations, names, env, d0);
  if (!p) return nic("not defined");
  if (p.fail >= 0) {
    // Kot brez ° (alpha: "22.62"), ki ga AI misli v stopinjah: formula bi držala v stopinjah. To je zapis, ne napačen
    // račun, zato ne »wrong« (učenec bi izgubil morda pravilno rešitev), ampak nepreverjeno.
    const kot = names.filter((x) => GRSKE.test(x) && !values.get(x).deg);
    const q = kot.length && preizkus(equations, names, { ...env, ...Object.fromEntries(kot.map((x) => [x, (env[x] * Math.PI) / 180])) }, { ...d0, ...Object.fromEntries(kot.map((x) => [x, (d0[x] * Math.PI) / 180])) });
    if (q && q.fail < 0) return nic("angle without °");
    const e = equations[p.fail];
    return { verified: false, reason: "wrong", status: statusOf({ holds: false }), note: `with your values ${e.text} gives ${fmt(e.L(env))} on the left and ${fmt(e.R(env))} on the right` };
  }
  const J = p.J;

  // 3. formule iz podatkov določijo vse druge količine (polni rang po njih) in iskana je odvisna od vsakega podatka
  const W = names.filter((x) => !podatek.has(x));
  const G = names.filter((x) => podatek.has(x));
  const col = (x) => names.indexOf(x);
  const sc = (x) => Math.abs(env[x]) || 1; // stolpci v relativnih enotah (4200 J/(kg K) in 1,5 kg)
  const JW = J.map((row) => W.map((x) => row[col(x)] * sc(x)));
  if (rang(JW) < W.length) return nic("not determined");
  const JtJ = W.map((_, a) => W.map((_, b) => JW.reduce((s, row) => s + row[a] * row[b], 0)));
  const u = W.indexOf(iskana);
  for (const g of G) {
    if (env[g] === 0) continue;
    const rhs = W.map((_, a) => -JW.reduce((s, row, i) => s + row[a] * J[i][col(g)] * sc(g), 0));
    const d = resi(JtJ, rhs);
    if (!d || !fin(d[u])) return nic("not determined");
    if (Math.abs(d[u]) <= 1e-7) return nic(`does not depend on ${g}`);
  }
  if (!G.length) return nic("no datum");

  // 4. vrednost iskane količine je končni odgovor (morda v drugi enoti)
  const odg = steviloOdgovora(sol);
  const q = values.get(iskana).n;
  const odgTol = Math.max(values.get(iskana).d / (values.get(iskana).deg ? Math.PI / 180 : 1), 1e-9 * Math.abs(q));
  if (odg === null || !(Math.abs(odg - q) <= odgTol || istiPodatek(q, odg))) return nic("answer differs");

  return { verified: false, reason: "given", status: statusOf({ holds: true, how: "numeric", complete: "unknown" }) };
}

// Očiščen »check« iz odgovora AI: seznam parov [ime, vrednost] (ne objekt: imena pridejo od AI) in formule.
export function cleanRacun(check) {
  if (!check || typeof check !== "object") return null;
  const raw = check.values;
  const pairs = (Array.isArray(raw) ? raw : raw && typeof raw === "object" ? Object.entries(raw) : [])
    .filter((p) => Array.isArray(p) && p.length === 2 && typeof p[0] === "string" && (typeof p[1] === "string" || fin(p[1])))
    .slice(0, MAX_VALUES)
    .map(([k, v]) => [k.slice(0, 16), String(v).slice(0, 60)]);
  const equations = (Array.isArray(check.equations) ? check.equations : [])
    .filter((x) => typeof x === "string")
    .slice(0, MAX_EQUATIONS)
    .map((x) => x.slice(0, 200));
  return pairs.length && equations.length ? { values: pairs, equations } : null;
}
