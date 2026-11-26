// Preverjanje besedilnih nalog s podatki na zaslonu Skeniraj (j 26. 11.: »Da, začni« na kartici »Začnem preverjanje
// besedilnih nalog s podatki v skenerju?«). Pri taki nalogi (besedilo »S=?«, podatki v »given«) koda ne zna sama
// postaviti formule. Zato AI ob rešitvi vrne še »check«: vrednosti vseh količin in formule, ki jih je uporabil. Tu jih
// sami preračunamo in preverimo:
//   1. vsak podatek naloge je uporabljen kot vrednost ali število v formuli, z istim predznakom, v svoji enoti ali
//      pretvorjen v osnovno enoto SI, ki jo določa enota ob podatku (2 kW → 2000, 72 km/h → 20; »4 cm« ne sme biti 40);
//   2. vrednost iskane količine je število v končnem odgovoru (value, solutions in answer_tex, vsa, ista enota);
//   3. z vrednostmi drži vsaka formula: podatki so točni, zaokrožene vrednosti in decimalna števila v formuli imajo
//      pol zadnjega mesta; koti veljajo v stopinjah ali v radianih (obe branji, kot v kalkulatorju);
//   4. formule iz podatkov določijo vse druge količine (rang Jacobijeve matrike) in iskana je odvisna od vsakega
//      podatka (zapis »S=32« ali »S=S« ne velja); formula z iskano količino nima druge rešitve, ki bi prav tako
//      ustrezala (c = −6,40 pri c² = a² + b², t = 3 pri dveh pozitivnih časih).
// Vse drži → »partial« (Delno preverjeno): račun je preverjen; ali so formule prave za nalogo in ali je vsak podatek na
// pravem mestu v pravi enoti, pa ne (to je postavitev naloge, ki je koda ne razume). Formula pri prikazanem odgovoru
// očitno ne drži → »wrong« in strežnik poskusi znova (server/scan.js). Vse drugo (manjka check, nečitljiv zapis,
// neuporabljen podatek, pogoj v podatkih, druga enota v odgovoru, razlika le v okviru zaokrožitve celih števil)
// → »unverified« kot doslej, brez ponovitve. Brez DOM: teče na strežniku in v testih.
import { parse, compile, freeVars, walk } from "../graph/math.js";
import { prep } from "./solvecore.js";
import { statusOf } from "./status.js";

const fin = Number.isFinite;
const MAX_VALUES = 24;
const MAX_EQUATIONS = 12;
const STOPINJA = Math.PI / 180;

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

// Vrednost iz »check.values«: število ali izraz brez spremenljivk (22.62°, 5/12, sqrt(2), 1.5*10^(3)); »5 %« ne
// (razčlenjevalnik bi ga bral kot 0,05, AI pa morda kot 5).
//   n:    število, kot je zapisano (stopinje ostanejo stopinje),
//   deg:  zapisano s °,
//   d:    zaokrožitev zapisa: pol zadnjega mesta pri decimalnem številu, 0 pri celem številu ali izrazu,
//   dc:   ohlapna zaokrožitev za alarm: tudi celo število je morda zaokroženo (172 za 171,8; 1400000 za 1399734).
function vrednost(text) {
  const s = stevilo(text).trim();
  if (!s || s.length > 60 || /[%‰]/.test(s)) return null;
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
  const m = /^[+-]?\d*\.(\d+)(?:\*10\^\(([+-]?\d+)\))?$/.exec(bare);
  const d = m ? 0.5 * 10 ** (Number(m[2] || 0) - m[1].length) * 1.0001 : 0;
  const cel = /^[+-]?\d+$/.test(bare) ? 0.5 * 10 ** /0*$/.exec(bare)[0].length * 1.0001 : 0;
  return { n, deg, d, dc: Math.max(d, cel, 1e-3 * Math.abs(n)) };
}

// Enote ob podatkih → faktor do osnovne enote SI. Neznana enota: le faktor 1 (podatek mora biti zapisan, kot je).
const PREDPONE = { G: 1e9, M: 1e6, k: 1e3, h: 1e2, d: 1e-1, c: 1e-2, m: 1e-3, µ: 1e-6, u: 1e-6, n: 1e-9 };
const OSNOVE = { m: 1, g: 1e-3, s: 1, W: 1, J: 1, V: 1, A: 1, N: 1, Pa: 1, Hz: 1, Wh: 3600, eV: 1.602176634e-19, mol: 1, bar: 1e5, L: 1e-3, l: 1e-3, Ω: 1, C: 1, K: 1, t: 1000 };
const POSEBNE = new Map([["min", 60], ["h", 3600], ["dan", 86400], ["%", 0.01], ["‰", 0.001]]);
function faktorEnote(tok) {
  const m = /^([^^]+)(?:\^p(-?\d))?$/.exec(tok);
  if (!m) return null;
  const pot = Number(m[2] || 1);
  if (POSEBNE.has(m[1])) return POSEBNE.get(m[1]) ** pot;
  const b = /^(G|M|k|h|d|c|m|µ|u|n)?(Pa|Hz|Wh|eV|mol|bar|m|g|s|W|J|V|A|N|L|l|Ω|C|K|t)$/.exec(m[1]);
  return b ? ((b[1] ? PREDPONE[b[1]] : 1) * OSNOVE[b[2]]) ** pot : null;
}
function faktorZapisa(u) {
  const deli = u.replace(/[()]/g, " ").split("/");
  if (deli.length > 2) return null;
  let f = 1;
  for (let i = 0; i < deli.length; i++) {
    const toks = deli[i].split(/[\s·*]+/).filter(Boolean);
    if (!toks.length) return null;
    for (const t of toks) {
      const g = faktorEnote(t);
      if (g === null) return null;
      f = i ? f / g : f * g;
    }
  }
  return f;
}

// Podatki naloge (LaTeX) → [{ n, f: [[faktor, toleranca]], k: [premik] }]. »m = 1{,}5\ \mathrm{kg}« → 1,5 (faktor 1),
// »P = 2\ \mathrm{kW}« → 2 (1 ali 1000), »a_3 = 7« → 7 (indeks ni podatek), »12\,000« → 12000, »20\ ^\circ\mathrm{C}«
// → 20 (ali 293,15 K), »30°« → 30 (ali π/6), »2 \cdot 10^{-3}\,\mathrm{m^2}« → 0,002.
export function podatkiNaloge(given = []) {
  const out = [];
  for (const g of [].concat(given || [])) {
    let s = String(g ?? "")
      .replace(/−/g, "-")
      .replace(/\{,\}/g, ".")
      .replace(/(\d)(?:\\[,;: ]|\s)(\d{3})(?![\d.])/g, "$1$2")
      .replace(/\\(?:text|mathrm|textrm|mbox|operatorname)\s*\{([^{}]*)\}/g, " $1 ")
      .replace(/\\(?:d|t)?frac\s*\{\s*(-?\d+(?:\.\d+)?)\s*\}\s*\{\s*(\d+(?:\.\d+)?)\s*\}/g, (_, a, b) => ` ${Number(a) / Number(b)} `)
      .replace(/(\d)\s*(?:\\cdot|\\times|·|×|\*)\s*10\s*\^\s*\{?\s*([+-]?\d+)\s*\}?/g, "$1e$2")
      .replace(/(?<![\d.])10\s*\^\s*\{?\s*([+-]?\d+)\s*\}?/g, "1e$1")
      .replace(/\^\s*\{?\s*\\circ\s*\}?|\\circ|\\degree/g, "°")
      .replace(/_\s*\{[^{}]*\}|_\s*[A-Za-z0-9]+/g, " ")
      .replace(/\^\s*\{\s*([-+]?\d)\s*\}|\^\s*([-+]?\d)/g, (_, a, b) => `^p${(a ?? b).replace("+", "")}`)
      .replace(/\s+\^p/g, "^p")
      .replace(/\\Omega/g, "Ω")
      .replace(/\\mu\s*/g, "µ")
      .replace(/\\%/g, "%")
      .replace(/\\cdot/g, "·")
      .replace(/\\[,;:! ]|~|\\q?quad/g, " ")
      .replace(/[{}]/g, " ");
    // decimalna vejica 1,5 (brez oklepajev: »T(1,4)« je točka, ne 1,4)
    if (!/[([]/.test(s)) s = s.replace(/(\d),(\d)/g, "$1.$2");
    const ms = [...s.matchAll(/(?<![\w.\-^])-?\d+(?:\.\d+)?(?:e[+-]?\d+)?(?![\d.])/g)];
    ms.forEach((m, i) => {
      const n = Number(m[0]);
      if (!fin(n)) return;
      const u = s.slice(m.index + m[0].length, i + 1 < ms.length ? ms[i + 1].index : s.length).split(/[,;=]/)[0].trim();
      const f = [[1, 1e-9]];
      const k = [];
      if (/^°\s*C\b/.test(u)) k.push(273.15, 273);
      else if (/^°/.test(u)) f.push([STOPINJA, 1e-3]);
      else if (u) {
        const x = faktorZapisa(u);
        if (x !== null && x !== 1) f.push([x, 1e-9]);
      }
      out.push({ n, f, k });
    });
  }
  return out;
}
export const stevilaPodatkov = (given) => podatkiNaloge(given).map((p) => p.n);

// Pogoji v podatkih (x > 0, t ∈ [0, 5], a ≠ 1): koda jih ne preverja, zato naloga s pogojem ostane nepreverjena.
const POGOJ = /[<>≤≥∈≠]|\\(?:le|ge|leq|geq|lt|gt|in|neq|ne)(?![a-z])/;

// Ali je število p (vrednost v rešitvi) podatek, morda pretvorjen v osnovno enoto SI. Predznak mora biti isti.
// tocno: le točne pretvorbe (brez π, kjer je vrednost zapisana zaokroženo): tak podatek nima dovoljene zaokrožitve.
export function istiPodatek(pod, p, { tocno = false } = {}) {
  const { n, f = [[1, 1e-9]], k = [] } = typeof pod === "number" ? { n: pod } : pod;
  if (!fin(n) || !fin(p)) return false;
  if (n === 0) return p === 0;
  if (f.some(([x, tol]) => (!tocno || tol < 1e-6) && Math.abs(p - n * x) <= tol * Math.abs(n * x))) return true;
  return k.some((z) => Math.abs(p - (n + z)) <= 1e-9 * Math.abs(n + z)); // °C → K
}

// Števila v končnem odgovoru: vsak kandidat (value, solutions, answer_tex), ki ima število, da prvo število za zadnjim
// »=« ali »≈« (stopinje ostanejo stopinje, enote odpadejo).
export function stevilaOdgovora(sol) {
  const cands = [sol?.value, ...(Array.isArray(sol?.solutions) ? sol.solutions : []), sol?.answer_tex].filter((x) => typeof x === "string" && x.trim());
  const out = [];
  for (const c of cands) {
    const zadnji = String(c).split(/=|≈|\\approx|\\doteq/).pop();
    const v = vrednost(zadnji.replace(/\s*°\s*$/, ""));
    if (v) out.push(v.n);
    else {
      const n = stevilaPodatkov([zadnji]);
      if (n.length) out.push(n[0]);
    }
  }
  return out;
}
export const steviloOdgovora = (sol) => stevilaOdgovora(sol)[0] ?? null;

// AI »check« → {values: Map(ime → vrednost), equations} ali razlog, zakaj ga ni mogoče prebrati. Vsaka formula je
// prevedena dvakrat: koti v radianih (vrednosti s ° pretvorjene) in v stopinjah (trigonometrija v stopinjah).
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
    values.set(ime, v);
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
    const decs = []; // decimalna števila v formuli (9.81, 3.14): zaokrožitev pol zadnjega mesta kot pri vrednostih
    walk(ast, (n) => {
      if (n.k !== "num") return;
      lits.push(n.v);
      const m = /^\d*\.(\d+)$/.exec(String(n.v));
      if (m) decs.push({ node: n, d: 0.5 * 10 ** -m[1].length * 1.0001 });
    });
    const sides = (ctx) => ({ L: compile(ast.terms[0], ctx), R: compile(ast.terms[1], ctx) });
    equations.push({ text: String(text), ast, rad: sides({}), deg: sides({ deg: true }), vars, lits, decs });
  }
  const used = new Set(equations.flatMap((e) => e.vars));
  if ([...values.keys()].some((x) => !used.has(x))) return { why: "unused value" };
  return { values, equations };
}

// Branje kotov: »rad« (vrednost s ° je v radianih, trigonometrija v radianih) ali »deg« (vrednosti, kot so zapisane,
// trigonometrija v stopinjah: tako drži tudi γ = 180 − α − β in S = π r² α / 360).
const NACINI = {
  rad: { ctx: {}, v: (x) => x.n * (x.deg ? STOPINJA : 1), k: (x) => (x.deg ? STOPINJA : 1) },
  deg: { ctx: { deg: true }, v: (x) => x.n, k: () => 1 },
};

const ostanki = (equations, env, nacin) => equations.map((e) => e[nacin].L(env) - e[nacin].R(env));

// Ali vse formule držijo pri vrednostih env v okviru zaokrožitve d (pol zadnjega mesta vsake vrednosti, preneseno
// skozi formulo z odvodom). → { fail: indeks prve formule, ki ne drži, ali −1, J: ∂(L − D)/∂vrednost } ali null (ni definirano).
function preizkus(equations, names, env, d, nacin, dStevil) {
  const r0 = ostanki(equations, env, nacin);
  if (r0.some((r) => !fin(r))) return null;
  const J = equations.map(() => []);
  for (const x of names) {
    const h = 1e-6 * Math.max(1, Math.abs(env[x]));
    const rp = ostanki(equations, { ...env, [x]: env[x] + h }, nacin);
    const rm = ostanki(equations, { ...env, [x]: env[x] - h }, nacin);
    if ([...rp, ...rm].some((r) => !fin(r))) return null;
    equations.forEach((_, i) => J[i].push((rp[i] - rm[i]) / (2 * h)));
  }
  const fail = equations.findIndex((e, i) => {
    const s = e[nacin];
    const tol = names.reduce((a, x, j) => a + Math.abs(J[i][j]) * d[x], 0) + zaokrozitevStevil(e, env, r0[i], nacin, dStevil) + 1e-9 * Math.max(Math.abs(s.L(env)), Math.abs(s.R(env)), 1e-300);
    return !(Math.abs(r0[i]) <= tol);
  });
  return { fail, J };
}

// Prispevek zaokroženih decimalnih števil v formuli (F=m*9.81, O=2*3.14*r) k dovoljenemu odstopanju: |∂(L − D)/∂c|·d.
function zaokrozitevStevil(e, env, r0, nacin, dStevil) {
  const ctx = NACINI[nacin].ctx;
  let tol = 0;
  for (const c of e.decs) {
    const d = dStevil(c);
    if (!d) continue;
    const v = c.node.v;
    const h = 1e-6 * Math.max(1, Math.abs(v));
    c.node.v = v + h;
    let r;
    try {
      r = compile(e.ast.terms[0], ctx)(env) - compile(e.ast.terms[1], ctx)(env);
    } finally {
      c.node.v = v;
    }
    if (!fin(r)) return Infinity;
    tol += (Math.abs(r - r0) / h) * d;
  }
  return tol;
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

// Druga rešitev formule z iskano količino (ostale vrednosti ostanejo): na [−2|q|, 2|q|] iščemo ničle L − D.
// Pri pozitivnem odgovoru štejejo le pozitivne druge ničle (negativna dolžina ali čas ni kandidat); pri negativnem vse.
function drugaResitev(equations, env, iskana, nacin) {
  const q = env[iskana];
  if (!q) return false;
  const a = 2 * Math.abs(q);
  for (const e of equations) {
    if (!e.vars.includes(iskana)) continue;
    const s = e[nacin];
    const g = (t) => s.L({ ...env, [iskana]: t }) - s.R({ ...env, [iskana]: t });
    const skala = Math.abs(s.L(env)) + Math.abs(s.R(env)) + 1e-300;
    const N = 800;
    let px = -a;
    let py = g(px);
    for (let i = 1; i <= N; i++) {
      const x = -a + (2 * a * i) / N;
      const y = g(x);
      if (fin(py) && fin(y) && (py === 0 || py * y < 0)) {
        let lo = px;
        let hi = x;
        for (let k = 0; k < 80 && py !== 0; k++) {
          const m = (lo + hi) / 2;
          if (g(lo) * g(m) <= 0) hi = m;
          else lo = m;
        }
        const r = py === 0 ? px : (lo + hi) / 2;
        const drugje = Math.abs(r - q) > 0.05 * Math.abs(q); // ista rešitev v okviru zaokrožitve (29,43 proti 29,4) ni druga
        if (drugje && Math.abs(g(r)) <= 1e-6 * skala && (q < 0 || r > 0)) return true;
      }
      px = x;
      py = y;
    }
  }
  return false;
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
  if ([].concat(given || []).some((g) => POGOJ.test(String(g)))) return nic("condition");
  const c = preberiCheck(sol?.racun);
  if (!c.values) return nic(c.why);
  const { values, equations } = c;
  if (!values.has(iskana)) return nic("asked quantity missing");
  const names = [...values.keys()];

  // 1. vsak podatek je uporabljen (vrednost ali število v formuli; 0 ne šteje)
  const data = podatkiNaloge(given);
  const pool = [...names.filter((x) => x !== iskana).map((x) => values.get(x).n), ...equations.flatMap((e) => e.lits)];
  if (data.some((p) => p.n !== 0 && !pool.some((v) => istiPodatek(p, v)))) return nic("unused datum");
  const podatek = new Set(names.filter((x) => x !== iskana && data.some((p) => istiPodatek(p, values.get(x).n))));

  // 2. vrednost iskane količine je vsako število v končnem odgovoru (ista enota). Pred preizkusom formul: »wrong«
  // sme reči le račun, ki pripelje do prikazanega odgovora; neskladen pomožni zapis ne skrije morda pravilne rešitve.
  const odg = stevilaOdgovora(sol);
  const Q = values.get(iskana);
  if (!odg.length || odg.some((x) => !(Math.abs(x - Q.n) <= Math.max(Q.d, 1e-9 * Math.abs(Q.n))))) return nic("answer differs");

  // 3. vsaka formula drži. Podatek naloge (in število v formuli, ki je podatek) je točen: zaokrožitve nima, sicer bi
  // napačen rezultat prešel (m = 1,2 kg z ±0,05 kg). Strogo (pol zadnjega mesta) → drži; ohlapno (tudi cela števila
  // so morda zaokrožena) → nepreverjeno; sicer napačno.
  const tocen = (v) => data.some((p) => istiPodatek(p, v, { tocno: true }));
  const jePodatek = (x) => podatek.has(x) && tocen(values.get(x).n);
  let ok = null;
  let ohlapno = false;
  let prvi = null;
  for (const nacin of ["rad", "deg"]) {
    const N = NACINI[nacin];
    const env = Object.fromEntries(names.map((x) => [x, N.v(values.get(x))]));
    const strogo = Object.fromEntries(names.map((x) => [x, jePodatek(x) ? 0 : values.get(x).d * N.k(values.get(x))]));
    const p = preizkus(equations, names, env, strogo, nacin, (s) => (tocen(s.node.v) ? 0 : s.d));
    if (!p) continue;
    if (p.fail < 0) {
      ok = { nacin, env, J: p.J };
      break;
    }
    prvi ??= { nacin, env, fail: p.fail };
    const ohl = Object.fromEntries(names.map((x) => [x, jePodatek(x) ? 0 : values.get(x).dc * N.k(values.get(x))]));
    const p2 = preizkus(equations, names, env, ohl, nacin, (s) => (tocen(s.node.v) ? 0 : Math.max(s.d, 1e-3 * Math.abs(s.node.v))));
    if (p2 && p2.fail < 0) ohlapno = true;
  }
  if (!ok) {
    if (!prvi) return nic("not defined");
    if (ohlapno) return nic("rounded");
    const e = equations[prvi.fail];
    const s = e[prvi.nacin];
    return { verified: false, reason: "wrong", status: statusOf({ holds: false }), note: `with your values ${e.text} gives ${fmt(s.L(prvi.env))} on the left and ${fmt(s.R(prvi.env))} on the right` };
  }
  const { env, J, nacin } = ok;

  // 4. formule iz podatkov določijo vse druge količine (polni rang po njih) in iskana je odvisna od vsakega podatka
  const W = names.filter((x) => !podatek.has(x));
  const G = names.filter((x) => podatek.has(x));
  if (!G.length) return nic("no datum");
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
    if (Math.abs(d[u]) <= 1e-4) return nic(`does not depend on ${g}`);
  }
  if (drugaResitev(equations, env, iskana, nacin)) return nic("another solution");

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
