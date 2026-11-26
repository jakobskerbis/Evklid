// Preverjanje besedilnih nalog s podatki na zaslonu Skeniraj (j 26. 11.: »Da, začni« na kartici »Začnem preverjanje
// besedilnih nalog s podatki v skenerju?«). Pri taki nalogi (besedilo »S=?«, podatki v »given«) koda ne zna sama
// postaviti formule. Zato AI ob rešitvi vrne še »check«: vrednosti vseh količin in formule, ki jih je uporabil. Tu jih
// sami preračunamo in preverimo:
//   1. vsak podatek naloge je uporabljen kot vrednost ali število v formuli, z istim predznakom, v svoji enoti ali
//      pretvorjen v osnovno enoto SI, ki jo določa enota ob podatku (2 kW → 2000, 72 km/h → 20; »4 cm« ne sme biti 40),
//      in vsi zapisi skupaj so v enem sistemu enot (ne 36 km z 20 m/s, ne 3 min z 2 m/s);
//   2. vrednost iskane količine je število v končnem odgovoru (value, solutions in answer_tex, vsa, ista enota);
//   3. z vrednostmi drži vsaka formula: podatki so točni, zaokrožene vrednosti in decimalna števila v formuli imajo
//      pol zadnjega mesta; koti v radianih, v stopinjah pa le, ko naloga ali rešitev piše kote s °;
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
// Zaslon in meritev pošljeta nalogo skozi prep(), ki »P=?« skrajša v »P«: tudi golo ime je iskana količina.
export function iskanaKolicina(text) {
  const t = String(text ?? "");
  const m = /^\s*([^=]+?)\s*=\s*\?\s*$/.exec(t);
  return imeKolicine(m ? m[1] : t);
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

// Enote ob podatkih → faktor do osnovne enote SI in dimenzija [L, M, T, I, Θ, N]. Neznana enota: le faktor 1
// (podatek mora biti zapisan, kot je).
const PREDPONE = { G: 1e9, M: 1e6, k: 1e3, h: 1e2, d: 1e-1, c: 1e-2, m: 1e-3, µ: 1e-6, u: 1e-6, n: 1e-9 };
const E = [2, 1, -2, 0, 0, 0];
const OSNOVE = {
  m: [1, [1, 0, 0, 0, 0, 0]],
  g: [1e-3, [0, 1, 0, 0, 0, 0]],
  t: [1000, [0, 1, 0, 0, 0, 0]],
  s: [1, [0, 0, 1, 0, 0, 0]],
  A: [1, [0, 0, 0, 1, 0, 0]],
  K: [1, [0, 0, 0, 0, 1, 0]],
  mol: [1, [0, 0, 0, 0, 0, 1]],
  N: [1, [1, 1, -2, 0, 0, 0]],
  J: [1, E],
  Wh: [3600, E],
  eV: [1.602176634e-19, E],
  W: [1, [2, 1, -3, 0, 0, 0]],
  V: [1, [2, 1, -3, -1, 0, 0]],
  Ω: [1, [2, 1, -3, -2, 0, 0]],
  C: [1, [0, 0, 1, 1, 0, 0]],
  Pa: [1, [-1, 1, -2, 0, 0, 0]],
  bar: [1e5, [-1, 1, -2, 0, 0, 0]],
  Hz: [1, [0, 0, -1, 0, 0, 0]],
  L: [1e-3, [3, 0, 0, 0, 0, 0]],
  l: [1e-3, [3, 0, 0, 0, 0, 0]],
};
const CAS = [0, 0, 1, 0, 0, 0];
const POSEBNE = new Map([["min", [60, CAS]], ["h", [3600, CAS]], ["dan", [86400, CAS]], ["%", [0.01, null]], ["‰", [0.001, null]]]);
function faktorEnote(tok) {
  const m = /^([^^]+)(?:\^p(-?\d))?$/.exec(tok);
  if (!m) return null;
  const pot = Number(m[2] || 1);
  let f;
  let dim;
  if (POSEBNE.has(m[1])) [f, dim] = POSEBNE.get(m[1]);
  else {
    const b = /^(G|M|k|h|d|c|m|µ|u|n)?(Pa|Hz|Wh|eV|mol|bar|m|g|s|W|J|V|A|N|L|l|Ω|C|K|t)$/.exec(m[1]);
    if (!b) return null;
    [f, dim] = OSNOVE[b[2]];
    f *= b[1] ? PREDPONE[b[1]] : 1;
  }
  return { f: f ** pot, dim: dim && dim.map((x) => x * pot) };
}
// Zapis enote (»km/h«, »J/(kg K)«, »m^p2«) → { f, dim, toks } ali null (neznana); dim je null pri odstotkih;
// toks: posamezne enote zapisa (km in h), vsaka s svojim faktorjem in dimenzijo (v imenovalcu z obratnim predznakom).
function faktorZapisa(u) {
  const deli = u.replace(/[()]/g, " ").split("/");
  if (deli.length > 2) return null;
  let f = 1;
  let dim = [0, 0, 0, 0, 0, 0];
  const toks = [];
  for (let i = 0; i < deli.length; i++) {
    const enote = deli[i].split(/[\s·*]+/).filter(Boolean);
    if (!enote.length) return null;
    for (const t of enote) {
      const g = faktorEnote(t);
      if (g === null) return null;
      f = i ? f / g.f : f * g.f;
      dim = dim && g.dim ? dim.map((x, j) => x + (i ? -g.dim[j] : g.dim[j])) : null;
      if (g.dim) toks.push({ f: i ? 1 / g.f : g.f, dim: g.dim.map((x) => (i ? -x : x)) });
    }
  }
  return { f, dim, toks };
}

// Podatki naloge (LaTeX) → [{ n, f: [[faktor, toleranca]], k: [premik] }]. »m = 1{,}5\ \mathrm{kg}« → 1,5 (faktor 1),
// »P = 2\ \mathrm{kW}« → 2 (1 ali 1000), »a_3 = 7« → 7 (indeks ni podatek), »12\,000« → 12000, »20\ ^\circ\mathrm{C}«
// → 20 (ali 293,15 K), »30°« → 30 (ali π/6), »2 \cdot 10^{-3}\,\mathrm{m^2}« → 0,002.
export function podatkiNaloge(given = []) {
  const out = [];
  for (const g of [].concat(given || [])) {
    const s = zapisPodatka(g);
    const ms = [...s.matchAll(/(?<![\w.\-^])-?\d+(?:\.\d+)?(?:e[+-]?\d+)?(?![\d.])/g)];
    ms.forEach((m, i) => {
      const n = Number(m[0]);
      if (!fin(n)) return;
      const u = s.slice(m.index + m[0].length, i + 1 < ms.length ? ms[i + 1].index : s.length).split(/[,;=]/)[0].trim();
      const f = [[1, 1e-9]];
      const k = [];
      let enota = null; // { f: faktor do SI, dim } za preverjanje enotnega sistema enot (glej sistemEnot)
      let kot = false;
      if (/^°\s*C\b/.test(u)) k.push(273.15, 273);
      else if (/^°/.test(u)) {
        kot = true;
        f.push([STOPINJA, 1e-3]);
      } else if (u) {
        enota = faktorZapisa(u);
        if (enota && enota.f !== 1) f.push([enota.f, 1e-9]);
        if (enota && !enota.dim) enota = null; // odstotek: brez dimenzije (20 % je lahko 20 v formuli z /100)
      }
      out.push({ n, f, k, enota, kot });
    });
  }
  return out;
}

// Podatek (LaTeX) v preprost zapis: \mathrm{kg} → kg, 1{,}5 → 1.5, 2\cdot10^{-3} → 2e-3, indeksi odstranjeni.
function zapisPodatka(g) {
  const s = String(g ?? "")
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
  return /[([]/.test(s) ? s : s.replace(/(\d),(\d)/g, "$1.$2");
}

// Podatek, ki je formula ali enačba (f(x) = a·2^x, y = kx + 2, 2x + y = 5, f(1) = 5): koda ne preveri, ali jo AI
// upošteva, zato naloga ostane nepreverjena. Podatek je le »ime = število enota« (AB = 12 cm, T_1 = 20 °C) ali besedilo.
export function jeFormula(g) {
  // več podatkov v enem zapisu: »a = 3 cm, b = 4 cm«
  return zapisPodatka(g).split(/[,;]\s*(?=[A-Za-z\\α-ωΑ-Ω])/).some(jeFormulaDel);
}
function jeFormulaDel(t) {
  const s = t.replace(/\\(?:text|mathrm|textrm|mbox|operatorname)(?![A-Za-z])/g, " "); // \mathrm{s^{-1}} ostane brez oklepajev
  if (!s.includes("=")) return false;
  const deli = s.split("=");
  if (deli.length !== 2 || !/^[\sA-Za-z\\α-ωΑ-ΩµΔ]*[A-Za-zα-ωΑ-Ω]\s*$/.test(deli[0])) return true;
  const m = /^\s*-?\d+(?:\.\d+)?(?:e[+-]?\d+)?\s*(.*?)\s*$/.exec(deli[1]);
  if (!m) return true;
  return !(m[1] === "" || /^(?:°|%|‰)/.test(m[1]) || faktorZapisa(m[1]));
}

export const stevilaPodatkov = (given) => podatkiNaloge(given).map((p) => p.n);

// Enoten sistem enot: vsak podatek z znano enoto je v rešitvi zapisan v svoji enoti (cm, km, min) ali v osnovni enoti SI.
// Mešanica ni dovoljena, če ni sistema enot, v katerem bi bili vsi zapisi hkrati pravi: 36 km in 20 m/s (namesto
// 72 km/h) ali 3 min in 2 m/s dasta napačen rezultat, ki bi se sicer »ujemal«. Vsaka enota v zapisu podatka (km in h
// pri km/h) da vrstico log(faktor) = Σ_j dim_j · log(b_j) za merila osnovnih enot b (dolžina, masa, čas, …): faktor
// enote, če je podatek zapisan v svoji enoti, in 1 (log 0), če je pretvorjen v SI. Sistem obstaja, ko je rang
// dimenzij enak rangu razširjene matrike.
function sistemEnot(rabe) {
  const rows = rabe.map(({ dim, f }) => [...dim, Math.log(f)]);
  if (!rows.length) return true;
  return rang(rows.map((r) => r.slice(0, 6))) === rang(rows);
}

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

// Prvo število v delu odgovora (»32 cm^2«, »22.62°«, »atan(5/12)*180/pi«): stopinje ostanejo stopinje, enote odpadejo.
function steviloDela(del) {
  const v = vrednost(del.replace(/\s*°\s*$/, ""));
  if (v) return v.n;
  const n = stevilaPodatkov([del]);
  return n.length ? n[0] : null;
}
const DELI = /=|≈|\\approx|\\doteq/;

// Števila v končnem odgovoru za value in solutions: število za zadnjim »=« ali »≈« (vsako mora biti preverjena vrednost).
export function stevilaOdgovora(sol) {
  const cands = [sol?.value, ...(Array.isArray(sol?.solutions) ? sol.solutions : [])].filter((x) => typeof x === "string" && x.trim());
  return cands.map((c) => steviloDela(String(c).split(DELI).pop())).filter((x) => x !== null);
}
export const steviloOdgovora = (sol) => stevilaOdgovora(sol)[0] ?? stevilaZapisa(sol?.answer_tex)[0] ?? null;

// Deli zapisa odgovora na zaslonu (answer_tex) za vsakim »=« ali »≈«: »t = 189\,s \approx 3{,}15\,min« → 189, 3,15.
export function stevilaZapisa(tex) {
  if (typeof tex !== "string" || !tex.trim()) return [];
  const deli = tex.split(DELI);
  return (deli.length > 1 ? deli.slice(1) : deli).map(steviloDela).filter((x) => x !== null);
}

// Ali zapis odgovora pokaže preverjeno vrednost q kot končni rezultat: en del je q (enako(x)), vsak del za njim pa je
// le ista količina v drugi enoti (189 s ≈ 3,15 min), v okviru zaokrožitve prikazanih decimalk. »P = 32 ali P = 48«,
// »32 cm² = 0,32 m²« in »32 ≈ 30« ne (pregled: drugače bi prikazan, nepreverjen končni rezultat dobil »partial«).
// Ločilo med dvema odgovoroma (»… ali P = 32«, »P_1 = 5, P_2 = 7«): tak zapis ne pokaže enega rezultata.
const VEC_ODGOVOROV = /\b(?:ali|or|oziroma|in|and)\b|\\(?:lor|vee|quad|qquad)\b|\\\\|;|(?<!\\),\s*\\?[A-Za-z]/;

function zapisPokaze(tex, q, enako) {
  if (VEC_ODGOVOROV.test(tex)) return false;
  const deli = tex.split(DELI);
  const vsi = (deli.length > 1 ? deli.slice(1) : deli).map((d) => ({ x: steviloDela(d), p: podatkiNaloge([d])[0], racun: jeRacun(d) })).filter((d) => d.x !== null);
  const i = vsi.findLastIndex((d) => enako(d.x));
  if (i < 0) return false;
  // faktor do SI le iz enote tega dela (ne golo število: »20 m/s = 20 km/h« ni pretvorba)
  const si = (d) => (d.p && d.p.f.length > 1 ? d.p.f[1][0] : 1);
  const qSI = q * si(vsi[i]);
  const ista = (d) => {
    const dec = (/\.(\d+)/.exec(String(d.x)) || [null, ""])[1].length;
    const tol = 0.5 * 10 ** -dec * 1.0001 * si(d);
    // zaokrožitev največ 5 % (»32 cm² ≈ 0 m²« je zaokroženo prav, a ne pokaže rezultata)
    return Math.abs(d.x * si(d) - qSI) <= Math.min(tol, 0.05 * Math.abs(qSI)) + 1e-9 * Math.abs(qSI);
  };
  // pred njim smejo biti le koraki računa (\frac{(10+6)\cdot 4}{2}) ali ista količina; »P = 48 ali P = 32« ne
  return vsi.slice(0, i).every((d) => d.racun || ista(d)) && vsi.slice(i + 1).every(ista);
}

// Del zapisa je korak računa (ulomek, operacija, oklepaj), ne prikazan rezultat. Enote (\mathrm{cm^2}, m/s) ne štejejo.
function jeRacun(d) {
  const t = d.replace(/\\(?:text|mathrm|textrm|mbox)\s*\{[^{}]*\}/g, " ").replace(/([A-Za-zµΩ])\s*\^\s*\{?-?\d\}?/g, "$1").replace(/[A-Za-zµΩ]+\s*\/\s*[A-Za-zµΩ(]/g, " ");
  return /\\frac|\\cdot|\\times|\\sqrt|[+*/·×(]|\d\s*(?:\\?%)?\s*-\s*\d/.test(t);
}

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
// Druga ničla formul v [−2|q|, 2|q|] (več kot 5 % stran); zrcalna −q pri pozitivnem odgovoru ne šteje (c² = a² + b²).
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
        // zrcalna rešitev kvadrata (c = −5 pri c² = 25, t = −8) ni druga; vsaka druga, tudi negativna, je (x = −4 ob x = 2)
        const zrcalna = q > 0 && Math.abs(r + q) <= 0.05 * Math.abs(q);
        if (drugje && !zrcalna && Math.abs(g(r)) <= 1e-6 * skala) return true;
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
  if ([].concat(given || []).some(jeFormula)) return nic("formula in data");
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
  const rabe = [];
  for (const p of data) {
    if (!p.enota || !p.n) continue;
    const kot = (x) => pool.some((v) => Math.abs(v - p.n * x) <= 1e-9 * Math.abs(p.n * x));
    if (kot(1)) rabe.push(...p.enota.toks);
    if (p.enota.f !== 1 && kot(p.enota.f)) rabe.push(...p.enota.toks.map((t) => ({ dim: t.dim, f: 1 })));
  }
  if (!sistemEnot(rabe)) return nic("mixed units");

  // 2. vrednost iskane količine je vsako število v končnem odgovoru (ista enota). Pred preizkusom formul: »wrong«
  // sme reči le račun, ki pripelje do prikazanega odgovora; neskladen pomožni zapis ne skrije morda pravilne rešitve.
  const odg = stevilaOdgovora(sol);
  const Q = values.get(iskana);
  const enako = (x) => Math.abs(x - Q.n) <= Math.max(Q.d, 1e-9 * Math.abs(Q.n));
  if (!odg.length && !stevilaZapisa(sol?.answer_tex).length) return nic("answer differs");
  if (!odg.every(enako) || (typeof sol?.answer_tex === "string" && sol.answer_tex.trim() && !zapisPokaze(sol.answer_tex, Q.n, enako))) return nic("answer differs");

  // 3. vsaka formula drži. Podatek naloge (in število v formuli, ki je podatek) je točen: zaokrožitve nima, sicer bi
  // napačen rezultat prešel (m = 1,2 kg z ±0,05 kg). Strogo (pol zadnjega mesta) → drži; ohlapno (tudi cela števila
  // so morda zaokrožena) → nepreverjeno; sicer napačno.
  const tocen = (v) => data.some((p) => istiPodatek(p, v, { tocno: true }));
  const jePodatek = (x) => podatek.has(x) && tocen(values.get(x).n);
  let ok = null;
  let ohlapno = false;
  let prvi = null;
  // Branje v stopinjah le, ko naloga ali rešitev kote res piše s ° (sicer bi y = A·sin(ω·t) v stopinjah »držal« za
  // napačen odgovor kalkulatorja v načinu DEG). V radianih kot iz podatka s ° ne sme biti golo število (30 kot 30 rad).
  const stopinje = data.some((p) => p.kot) || names.some((x) => values.get(x).deg) || /°|\\circ/.test([sol?.value, sol?.answer_tex, ...(Array.isArray(sol?.solutions) ? sol.solutions : [])].join(" "));
  const goliKot = names.some((x) => !values.get(x).deg && data.some((p) => p.kot && p.n && Math.abs(values.get(x).n - p.n) <= 1e-9 * Math.abs(p.n)));
  const nacini = [...(goliKot ? [] : ["rad"]), ...(stopinje ? ["deg"] : [])];
  for (const nacin of nacini) {
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
    const brezStopinj = !stopinje && names.some((x) => /^[α-ω](_|$)/.test(x)) ? " (if a value is an angle in degrees, write it with °)" : "";
    return { verified: false, reason: "wrong", status: statusOf({ holds: false }), note: `with your values ${e.text} gives ${fmt(s.L(prvi.env))} on the left and ${fmt(s.R(prvi.env))} on the right${brezStopinj}` };
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
