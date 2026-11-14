// Generatorji za teme 2. letnika gimnazije, ki jih zahteva maturitetna pot (MAT-SS-2): iracionalne
// enačbe, presečišča parabol in sistemi kvadratnih neenačb, grafi z absolutno vrednostjo in stopničaste funkcije.
// Merila: docs/kakovost.md §2. Vsi rezultati so izračunani v kodi iz istih števil, ki jih vidi dijak.
// Izvirne naloge, ne prepisane maturitetne.
import { g } from "../rng.js";
import { roundHalfUp } from "../check.js";
import { tx } from "./mat.js";
import { num, frA, ft, sg, pickAns, name, wrapGens } from "./matura-util.js";

const P = "mat-ss2-matura-";
const T = (s) => `MAT-SS-2/${s}`;

// ---------- pomožne funkcije ----------
// Polinom iz koeficientov (od najvišje potence): poly([1, -3, 2]) → "x^2 - 3x + 2".
function poly(cs, v = "x") {
  const n = cs.length - 1;
  let s = "";
  cs.forEach((c, i) => {
    const e = n - i;
    if (c === 0) return;
    const abs = Math.abs(c);
    const coef = abs === 1 && e > 0 ? "" : tx(abs);
    const pw = e === 0 ? "" : e === 1 ? v : `${v}^${e}`;
    if (s === "") s = (c < 0 ? "-" : "") + coef + pw;
    else s += (c < 0 ? " - " : " + ") + coef + pw;
  });
  return s || "0";
}
const ev = (cs, x) => cs.reduce((acc, c) => acc * x + c, 0);
// x - a: xm(3) → "x - 3", xm(-2) → "x + 2", xm(0) → "x"; fac doda oklepaj za produkt.
const xm = (a) => (a === 0 ? "x" : `x ${sg(-a)}`);
const fac = (a) => (a === 0 ? "x" : `(${xm(a)})`);
const facs = (u, w) => (w === 0 ? fac(w) + fac(u) : fac(u) + fac(w));
// Negativno število v oklepaju: pt(-3) → "(-3)".
const pt = (x) => (x < 0 ? `(${tx(x)})` : tx(x));
// Vstavljanje v polinom za rešitev: evT([2, -1, 3], -2) → "2 \cdot (-2)^2 - (-2) + 3".
function evT(cs, x) {
  const n = cs.length - 1;
  const parts = [];
  cs.forEach((c, i) => {
    const e = n - i;
    if (c === 0) return;
    const ab = Math.abs(c);
    // Pri x = 0 koeficient 1 izpišemo, sicer bi dobili »-0^2«.
    parts.push([c < 0, e === 0 ? tx(ab) : `${ab === 1 && x !== 0 ? "" : `${tx(ab)} \\cdot `}${pt(x)}${e > 1 ? `^${e}` : ""}`]);
  });
  return parts.map(([neg, s], i) => (i === 0 ? (neg ? "-" : "") + s : (neg ? " - " : " + ") + s)).join("") || "0";
}
// Točka; pri decimalnih koordinatah podpičje kot v lekciji: (5; 7,5).
const pnt = (x, y) => `(${tx(x)}${Number.isInteger(x) && Number.isInteger(y) ? ", " : "; "}${tx(y)})`;
const ap = (x, d) => (Math.abs(roundHalfUp(x, d) - x) < 1e-9 ? "=" : "\\approx");
const txr = (x, d) => tx(roundHalfUp(x, d));
const r2 = (x) => Math.round(x * 100) / 100;
// Odpravi napake plavajoče vejice (1,4²/4 = 0,48999… → 0,49).
const cl = (x) => Math.round(x * 1e9) / 1e9;
const eur = (value, mistakes = []) => ({ ...num(r2(value), 2, mistakes.map((m) => ({ ...m, value: r2(m.value) })), "€"), unitAlternatives: ["eur", "evrov", "evra"] });
const eT = (x) => `${tx(x, 2)}\\ \\text{€}`;
const rootT = (n, a) => (n === 2 ? `\\sqrt{${a}}` : `\\sqrt[${n}]{${a}}`);
const absT = (a) => `|${xm(a)}|`;
const fl = (s) => `\\lfloor ${s} \\rfloor`;
// Sklanjatev ob številu (zadnji dve števki): sk(2, "uro", "uri", "ure", "ur") → "2 uri".
function sk(n, ena, dve, tri, pet) {
  const h = n % 100;
  return `$${n}$ ${h === 1 ? ena : h === 2 ? dve : h === 3 || h === 4 ? tri : pet}`;
}

// Množica rešitev: kritične točke crit = [{ x, tex, n, d }] in pogoj ok(x). Vrne kose (intervale
// in osamljene točke) in zapis v TeX.
function solveSet(crit, ok) {
  const pts = [...crit].sort((u, v) => u.x - v.x).filter((p, i, a) => i === 0 || Math.abs(p.x - a[i - 1].x) > 1e-9);
  const n = pts.length;
  const items = [];
  for (let i = 0; i <= n; i++) {
    const m = n === 0 ? 0 : i === 0 ? pts[0].x - 1 : i === n ? pts[n - 1].x + 1 : (pts[i - 1].x + pts[i].x) / 2;
    items.push({ seg: true, inn: ok(m), lo: i === 0 ? null : pts[i - 1], hi: i === n ? null : pts[i] });
    if (i < n) items.push({ seg: false, inn: ok(pts[i].x), p: pts[i] });
  }
  const groups = [];
  let cur = null;
  for (const it of items) {
    if (it.inn) {
      if (!cur) cur = { start: it };
      cur.end = it;
    } else if (cur) {
      groups.push(cur);
      cur = null;
    }
  }
  if (cur) groups.push(cur);
  const pieces = groups.map(({ start, end }) => {
    if (!start.seg && start === end) return { single: true, lo: start.p, hi: start.p, loC: true, hiC: true, tex: `\\{${start.p.tex}\\}` };
    const lo = start.seg ? start.lo : start.p;
    const hi = end.seg ? end.hi : end.p;
    const loC = !start.seg;
    const hiC = !end.seg;
    if (!lo && !hi) return { lo, hi, tex: "\\mathbb{R}" };
    const L = lo ? `${loC ? "[" : "("}${lo.tex}` : "(-\\infty";
    const R = hi ? `${hi.tex}${hiC ? "]" : ")"}` : "\\infty)";
    return { lo, hi, loC, hiC, tex: `${L}, ${R}` };
  });
  return { pieces, tex: pieces.length ? pieces.map((p) => p.tex).join(" \\cup ") : "\\emptyset" };
}
const REL = { "<": "<", "<=": "\\le", ">": ">", ">=": "\\ge" };
const RELS = ["<", "<=", ">", ">="];
const FLIP = { "<": "<=", "<=": "<", ">": ">=", ">=": ">" };
const holds = (v, rel) => {
  const z = Math.abs(v) < 1e-9 ? 0 : v;
  return rel === "<" ? z < 0 : rel === "<=" ? z <= 0 : rel === ">" ? z > 0 : z >= 0;
};
const icr = (x) => ({ x, tex: tx(x), n: x, d: 1 });
// Cela števila, ki zadoščajo pogoju; null, če množica ni omejena.
function intsOf(ok) {
  if (ok(-41) || ok(41)) return null;
  const out = [];
  for (let x = -40; x <= 40; x++) if (ok(x)) out.push(x);
  return out;
}
const listInts = (ks) => (ks.length <= 12 ? `$${ks.join(", ")}$` : `od $${ks[0]}$ do $${ks[ks.length - 1]}$`);
const sumOf = (ks) => (ks ? ks.reduce((s, k) => s + k, 0) : NaN);

// Parabola y = ax^2 + bx + c in premica y = kx + n z želenim številom presečišč (0, 1, 2):
// f - g = a(x - x0)^2 + e.
function parLine(r, want) {
  const a = r.pick([1, 1, -1, 2, -2]);
  const x0 = r.int(-3, 3);
  const k = r.int(-3, 3);
  const n = r.int(-5, 5);
  const e = want === 1 ? 0 : (want === 0 ? 1 : -1) * Math.sign(a) * r.int(1, 6);
  const b = k - 2 * a * x0;
  const c = n + a * x0 * x0 + e;
  const D = (b - k) ** 2 - 4 * a * (c - n);
  return { a, b, c, k, n, D };
}
const cntD = (D) => (D > 0 ? 2 : D === 0 ? 1 : 0);
const PL_KIND = { 2: "sekanta (dve presečišči)", 1: "tangenta (eno dotikališče)", 0: "mimobežnica (ni presečišč)" };

// Sistem dveh kvadratnih neenačb s celimi ničlami: f = s1 (x - p1)(x - p2), g = s2 (x - q1)(x - q2).
function quadSys(r) {
  const v = r.shuffle([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]).slice(0, 4);
  const [p1, p2] = [v[0], v[1]].sort((x, y) => x - y);
  const [q1, q2] = [v[2], v[3]].sort((x, y) => x - y);
  const s1 = r.pick([1, 1, -1]);
  const s2 = r.pick([1, -1]);
  const r1 = r.pick(RELS);
  const r2_ = r.pick(RELS);
  const F = [s1, -s1 * (p1 + p2), s1 * p1 * p2];
  const G = [s2, -s2 * (q1 + q2), s2 * q1 * q2];
  const A = (x, rel = r1, s = s1) => holds(s * (x - p1) * (x - p2), rel);
  const B = (x, rel = r2_, s = s2) => holds(s * (x - q1) * (x - q2), rel);
  const ok = (x) => A(x) && B(x);
  const crit = [p1, p2, q1, q2].map(icr);
  const S1 = solveSet([icr(p1), icr(p2)], (x) => A(x)).tex;
  const S2 = solveSet([icr(q1), icr(q2)], (x) => B(x)).tex;
  const S = solveSet(crit, ok);
  // Presek mora biti drugačen od rešitev obeh neenačb, sicer druga neenačba nič ne spremeni.
  const trivial = S.tex === S1 || S.tex === S2;
  return { p1, p2, q1, q2, s1, s2, r1, r2: r2_, F, G, A, B, ok, crit, S, S1, S2, trivial };
}
const facT = (s, u, w) => `${s < 0 ? "-" : ""}${facs(u, w)}`;
function sysSteps(q) {
  return [
    `$${poly(q.F)} = ${facT(q.s1, q.p1, q.p2)} ${REL[q.r1]} 0$: parabola je odprta ${q.s1 > 0 ? "navzgor" : "navzdol"}, ničli $${q.p1}$ in $${q.p2}$, rešitev $${q.S1}$`,
    `$${poly(q.G)} = ${facT(q.s2, q.q1, q.q2)} ${REL[q.r2]} 0$: parabola je odprta ${q.s2 > 0 ? "navzgor" : "navzdol"}, ničli $${q.q1}$ in $${q.q2}$, rešitev $${q.S2}$`,
    `Presek obeh množic: $x \\in ${q.S.tex}$`,
  ];
}
const SYS_FORMULA = ["a > 0:\\ ax^2 + bx + c < 0 \\text{ med ničlama}", "\\text{rešitev sistema} = \\text{presek rešitev}"];
const sysText = (q) => `$${poly(q.F)} ${REL[q.r1]} 0$ in $${poly(q.G)} ${REL[q.r2]} 0$`;
// Tipične napačne množice: unija, zamenjana strogost, parabola z a < 0 brana kot z a > 0.
function sysWrong(q) {
  const out = [{ ok: (x) => q.A(x) || q.B(x), why: "Rešitev sistema je presek, ne unija: veljati morata obe neenačbi hkrati." }];
  out.push({ ok: (x) => q.A(x, FLIP[q.r1]) && q.B(x, FLIP[q.r2]), why: "Pazi na krajišča: ničlo vključiš le pri nestrogi neenačbi ($\\le$, $\\ge$) in le, če jo vključita obe neenačbi." });
  if (q.s1 < 0 || q.s2 < 0) out.push({ ok: (x) => q.A(x, q.r1, 1) && q.B(x, q.r2, 1), why: "Parabola z negativnim vodilnim koeficientom je odprta navzdol: nad osjo $x$ je med ničlama." });
  return out;
}

// ================= generatorji =================
const GENS = [
  // ---------------- iracionalne enačbe ----------------
  {
    id: P + "iracionalne-enacbe",
    topics: [T("iracionalne-enacbe")],
    gen(level, r) {
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const a = r.pick([1, 2, 3, 4, 5]);
          const c = r.int(2, 7);
          const x = r.int(-6, 9);
          const b = c * c - a * x;
          if (b === 0) return null;
          const A = poly([a, b]);
          return {
            text: `Reši enačbo $\\sqrt{${A}} = ${c}$.`,
            answer: num(x, null, [
              { value: (c - b) / a, why: "Koren odpraviš s kvadriranjem obeh strani: kvadrirati moraš tudi desno stran." },
              { value: (c * c + b) / a, why: "Pri prenosu člena na drugo stran mu spremeni predznak." },
              { value: c * c - b, why: `Na koncu še deli s koeficientom pred $x$.` },
            ]),
            hint: "Desna stran je pozitivna, zato obe strani kvadriraš. Dobiš linearno enačbo.",
            data: { given: [`\\sqrt{${A}} = ${c}`], find: ["x"] },
            formula: "\\sqrt{A} = c,\\ c \\ge 0 \\Rightarrow A = c^2",
            solution: `Desna stran $${c} \\ge 0$, zato kvadriramo: $${A} = ${c * c}$\n$${poly([a, 0])} = ${c * c} ${sg(-b)} = ${a * x}$\n${a === 1 ? "" : `$x = ${x}$\n`}Preizkus: $\\sqrt{${a * x + b}} = ${c}$, rešitev ustreza.`,
          };
        }
        if (t === 1) {
          const n = r.pick([2, 3, 4, 5, 6]);
          const k = r.int(2, n === 2 ? 9 : n === 3 ? 5 : n === 4 ? 3 : 2);
          const a = r.pick([1, -1]) * k ** n;
          const even = n % 2 === 0;
          const cnt = even ? (a > 0 ? 2 : 0) : 1;
          const ms = even
            ? a > 0
              ? [{ value: 1, why: "Pri sodem eksponentu imata število in njegovo nasprotno število isto potenco." }]
              : [
                  { value: 2, why: "Soda potenca realnega števila ni nikoli negativna." },
                  { value: 1, why: "Soda potenca realnega števila ni nikoli negativna, zato ne obstaja niti ena rešitev." },
                ]
            : a < 0
              ? [
                  { value: 0, why: "Liha potenca negativnega števila je negativna, zato rešitev obstaja." },
                  { value: 2, why: "Pri lihem eksponentu ima vsako realno število natanko en realni koren." },
                ]
              : [{ value: 2, why: "Pri lihem eksponentu ima nasprotno število nasprotno potenco, zato je rešitev ena sama." }];
          const eq = r.next() < 0.5 ? `x^{${n}} = ${a}` : `x^{${n}} ${sg(-a)} = 0`;
          const iso = /= 0$/.test(eq) ? `Osamimo potenco: $x^{${n}} = ${a}$\n` : "";
          const sol = iso + (even
            ? a > 0
              ? `Eksponent $${n}$ je sod in desna stran $${a}$ je pozitivna.\nRešitvi sta $x = \\pm${rootT(n, a)} = \\pm ${k}$.\nŠtevilo realnih rešitev: $2$.`
              : `Eksponent $${n}$ je sod, zato je $x^{${n}} \\ge 0$ za vsak realni $x$.\nDesna stran $${a}$ je negativna, zato realnih rešitev ni.\nŠtevilo realnih rešitev: $0$.`
            : `Eksponent $${n}$ je lih, zato ima enačba natanko eno realno rešitev.\n$x = ${rootT(n, a)} = ${Math.sign(a) * k}$\nŠtevilo realnih rešitev: $1$.`);
          return {
            text: `Koliko realnih rešitev ima enačba $${eq}$?`,
            answer: num(cnt, null, ms),
            zeroOk: true,
            hint: "Najprej osami potenco. Premisli, ali je eksponent sod ali lih in kakšen je predznak desne strani.",
            data: { given: [eq], find: ["\\text{število realnih rešitev}"] },
            formula: ["n \\text{ lih: } x = \\sqrt[n]{a}", "n \\text{ sod},\\ a > 0: x = \\pm\\sqrt[n]{a}", "n \\text{ sod},\\ a < 0: \\text{ni rešitev}"],
            solution: sol,
          };
        }
        const sub = r.int(0, 2);
        if (sub === 0) {
          const n = r.pick([3, 5]);
          const s = r.pick([1, -1]);
          const k = r.int(2, n === 3 ? 6 : 3);
          const a = (s * k) ** n;
          return {
            text: `Reši enačbo $x^{${n}} = ${a}$.`,
            answer: num(s * k, null, [
              { value: -s * k, why: "Liha potenca ohrani predznak osnove: preveri predznak z vstavljanjem." },
              { value: a / n, why: "Koren ni deljenje z eksponentom: iščeš število, katerega potenca je desna stran." },
            ]),
            hint: "Pri lihem eksponentu obstaja natanko ena realna rešitev: koren desne strani.",
            data: { given: [`x^{${n}} = ${a}`], find: ["x"] },
            formula: "n \\text{ lih: } x^n = a \\Rightarrow x = \\sqrt[n]{a}",
            solution: `Eksponent $${n}$ je lih, rešitev je ena sama.\n$x = ${rootT(n, a)} = ${s * k}$, saj je $${pt(s * k)}^{${n}} = ${a}$.`,
          };
        }
        if (sub === 1) {
          const n = r.pick([2, 4, 6]);
          const k = r.int(2, n === 2 ? 12 : n === 4 ? 4 : 2);
          const a = k ** n;
          const q = r.pick([0, 0, r.nonZero(-9, 9)]);
          const eq = q === 0 ? `x^{${n}} = ${a}` : `x^{${n}} ${sg(q)} = ${a + q}`;
          return {
            text: `Enačba $${eq}$ ima dve realni rešitvi. Vpiši negativno.`,
            answer: num(-k, null, [
              { value: k, why: "To je pozitivna rešitev. Pri sodem eksponentu ima enako potenco tudi nasprotno število." },
              { value: -a / n, why: "Koren ni deljenje z eksponentom: iščeš število, katerega potenca je desna stran." },
              { value: q ? -(Math.abs(a + 2 * q) ** (1 / n)) : NaN, why: "Pri prenosu člena na drugo stran mu spremeni predznak." },
            ]),
            hint: q ? "Najprej osami potenco $x^n$, nato koreni." : "Pri sodem eksponentu sta rešitvi nasprotni števili.",
            data: { given: [eq], find: ["x < 0"] },
            formula: "n \\text{ sod},\\ a > 0: x^n = a \\Rightarrow x = \\pm\\sqrt[n]{a}",
            solution: `${q ? `$x^{${n}} = ${a + q} ${sg(-q)} = ${a}$\n` : ""}Eksponent $${n}$ je sod, desna stran pozitivna: $x = \\pm${rootT(n, a)} = \\pm ${k}$\nNegativna rešitev: $x = -${k}$`,
          };
        }
        const b = r.int(-9, 9);
        const c = r.nonZero(-4, 4);
        const x = c ** 3 - b;
        return {
          text: `Reši enačbo $\\sqrt[3]{${xm(-b)}} = ${c}$.`,
          answer: num(x, null, [
            { value: c * c - b, why: "Kubni koren odpraviš s potenciranjem na tretjo potenco, ne s kvadriranjem." },
            { value: c ** 3 + b, why: "Pri prenosu člena na drugo stran mu spremeni predznak." },
            { value: c < 0 ? -(c ** 3) - b : NaN, why: "Liha potenca negativnega števila je negativna." },
          ]),
          hint: c < 0 ? "Kubni koren negativnega števila obstaja. Obe strani dvigni na tretjo potenco." : "Obe strani dvigni na tretjo potenco.",
          data: { given: [`\\sqrt[3]{${xm(-b)}} = ${c}`], find: ["x"] },
          formula: "\\sqrt[3]{A} = c \\Rightarrow A = c^3",
          solution: `Kubiranje je ekvivalentno preoblikovanje, navideznih rešitev ne prinese.\n$${xm(-b)} = ${pt(c)}^3 = ${c ** 3}$\n$x = ${x}$`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          // √(ax + b) = x + c z eno navidezno rešitvijo
          const c = r.int(-3, 3);
          const x1 = r.int(-c, -c + 7);
          const x2 = r.int(-c - 6, -c - 1);
          const a = x1 + x2 + 2 * c;
          const b = c * c - x1 * x2;
          if (a <= 0 || a > 12 || b === 0) return null;
          const A = poly([a, b]);
          const R = xm(-c);
          const form = r.int(0, 2);
          const eq = form === 0 ? `\\sqrt{${A}} = ${R}` : form === 1 ? `\\sqrt{${A}} - x = ${c}` : `x - \\sqrt{${A}} = ${-c}`;
          const sq = c === 0 ? "x^2" : `(${R})^2 = ${poly([1, 2 * c, c * c])}`;
          return {
            text: `Reši enačbo $${eq}$.`,
            answer: num(x1, null, [
              { value: x2, why: "To je navidezna rešitev: desna stran je pri tem številu negativna, koren pa ne more biti negativen. Naredi preizkus." },
              { value: -x1, why: "Iz razstavljene oblike $(x - m) = 0$ sledi $x = m$: pazi na predznak." },
            ]),
            hint: `${form ? "Najprej osami koren. " : ""}Zapiši pogoj za desno stran, nato kvadriraj in vsakega kandidata preveri.`,
            data: { given: [eq], find: ["x"] },
            formula: ["\\sqrt{A} = B \\Rightarrow A = B^2", "B \\ge 0 \\text{ (preizkus)}"],
            solution: `${form ? `Osamimo koren: $\\sqrt{${A}} = ${R}$\n` : ""}Pogoj: $${R} \\ge 0$, torej $x \\ge ${-c}$.\nKvadriramo: $${A} = ${sq}$\n$${poly([1, 2 * c - a, c * c - b])} = 0$, $${facs(x1, x2)} = 0$\nKandidata: $${x1}$ in $${x2}$.\n$${x2}$ ne izpolni pogoja: $${c === 0 ? x2 : `${x2} ${sg(c)} = ${x2 + c}`} < 0$ (navidezna rešitev). Preizkus za $${x1}$: $\\sqrt{${(x1 + c) ** 2}} = ${x1 + c}$, ustreza.\nRešitev: $x = ${x1}$`,
          };
        }
        if (t === 1) {
          // Pogoja A ≥ 0 in B ≥ 0 za enačbo √(ax + b) = px + q
          const a = r.nonZero(-4, 4);
          const b = r.int(-8, 8);
          const p = r.nonZero(-3, 3);
          const q = r.int(-6, 6);
          const v1 = -b / a;
          const v2 = -q / p;
          if (Math.abs(v1 - v2) < 1e-9) return null;
          const A = poly([a, b]);
          const B = poly([p, q]);
          const ge1 = a > 0;
          const ge2 = p > 0;
          const cond = (ge, nn, dd) => `x ${ge ? "\\ge" : "\\le"} ${ft(nn, dd)}`;
          const steps = `Koren: $${A} \\ge 0$, torej $${cond(ge1, -b, a)}$${a < 0 ? " (delili smo z negativnim številom, znak se obrne)" : ""}.\nDesna stran: $${B} \\ge 0$, torej $${cond(ge2, -q, p)}$${p < 0 ? " (znak se obrne)" : ""}.`;
          const signErr = (nn, dd) => [
            { value: -nn / dd, why: "Pri prenosu prostega člena na drugo stran mu spremeni predznak." },
            { value: nn === 0 || Math.abs(dd) === 1 ? NaN : nn, why: "Ko izraziš $x$, deli s koeficientom pred $x$." },
          ];
          let ask;
          let ansN;
          let ansD;
          let other;
          let otherWhy;
          let res;
          if (ge1 === ge2) {
            const pickFirst = ge1 ? v1 > v2 : v1 < v2;
            [ansN, ansD] = pickFirst ? [-b, a] : [-q, p];
            other = pickFirst ? v2 : v1;
            otherWhy = "To je le šibkejši od obeh pogojev. Veljati morata oba hkrati, zato vzemi strožjega.";
            ask = `Skupni pogoj je oblike $x ${ge1 ? "\\ge" : "\\le"} m$. Koliko je $m$?`;
            res = `Oba pogoja hkrati: $x ${ge1 ? "\\ge" : "\\le"} ${ft(ansN, ansD)}$`;
          } else {
            const lo = ge1 ? [-b, a] : [-q, p];
            const hi = ge1 ? [-q, p] : [-b, a];
            if (lo[0] / lo[1] >= hi[0] / hi[1]) return null;
            const left = r.next() < 0.5;
            [ansN, ansD] = left ? lo : hi;
            other = left ? hi[0] / hi[1] : lo[0] / lo[1];
            otherWhy = "Pri deljenju neenačbe z negativnim številom se znak obrne. Preveri, kateri pogoj je oblike $x \\ge$ in kateri $x \\le$.";
            ask = `Skupni pogoj je interval $[m_1, m_2]$. Koliko je $m_${left ? 1 : 2}$?`;
            res = `Oba pogoja hkrati: $x \\in [${ft(...lo)}, ${ft(...hi)}]$`;
          }
          return {
            text: `Za enačbo $\\sqrt{${A}} = ${B}$ zapiši pogoja: izraz pod korenom ne sme biti negativen, desna stran pa tudi ne (koren je nenegativen). ${ask} Vpiši ulomek ali celo število.`,
            answer: frA(ansN, ansD, [{ value: other, why: otherWhy }, ...signErr(ansN, ansD)]),
            zeroOk: true,
            hint: "Reši vsako linearno neenačbo posebej. Pri deljenju z negativnim številom obrni znak. Nato vzemi presek obeh pogojev.",
            data: { given: [`A = ${A}`, `B = ${B}`], find: ["\\text{krajišče skupnega pogoja}"] },
            formula: ["\\sqrt{A} = B:\\ A \\ge 0,\\ B \\ge 0"],
            solution: `${steps}\n${res}`,
          };
        }
        // formula z besedilom: iz √ izrazi količino
        const nm = name(r);
        const ctx = r.int(0, 2);
        if (ctx === 0) {
          const Tn = r.pick([1.2, 1.4, 1.5, 1.6, 1.8, 2.2, 2.4, 2.5, 2.8, 3, 3.4]);
          const h = Tn / 2;
          const l = cl(h * h);
          return {
            text: `Nihajni čas nihala z dolžino $l$ (v metrih) je približno $T = 2\\sqrt{l}$ sekund. ${nm} želi narediti nihalo z nihajnim časom $${tx(Tn)}\\ \\mathrm{s}$. Kako dolgo mora biti nihalo? Rezultat v metrih zaokroži na dve decimalki.`,
            answer: num(l, 2, [
              { value: h, why: "Po deljenju z $2$ moraš obe strani še kvadrirati, da se znebiš korena." },
              { value: (Tn * Tn) / 2, why: "Ko kvadriraš $2\\sqrt{l}$, dobiš $4l$: kvadriraj tudi faktor $2$." },
              { value: Tn * Tn, why: "Najprej deli z $2$ (ali kvadriraj tudi faktor $2$)." },
            ], "m"),
            hint: "Osami koren (deli z $2$), nato obe strani kvadriraj.",
            data: { given: [`T = ${tx(Tn)}\\ \\mathrm{s}`], find: ["l"] },
            formula: "T = 2\\sqrt{l}",
            solution: `$2\\sqrt{l} = ${tx(Tn)}$\n$\\sqrt{l} = ${tx(h)}$\n$l = ${tx(h)}^2 ${ap(l, 2)} ${txr(l, 2)}\\ \\mathrm{m}$`,
          };
        }
        if (ctx === 1) {
          const v = r.pick([40, 45, 50, 55, 60, 65, 70, 75, 80, 90, 100, 110]);
          const s = cl((v * v) / 200);
          return {
            text: `Policija iz dolžine zavorne sledi $s$ (v metrih) na suhem asfaltu oceni hitrost avtomobila po formuli $v = \\sqrt{200\\,s}$ (v km/h). Kako dolga je sled, če je avto pred zaviranjem vozil s hitrostjo $${v}\\ \\mathrm{km/h}$? Zaokroži na desetinko metra.`,
            answer: num(s, 1, [
              { value: v / 200, why: "Najprej kvadriraj obe strani, da se znebiš korena." },
              { value: v * v * 200, why: "Iz $v^2 = 200\\,s$ izraziš $s$ z deljenjem z $200$, ne z množenjem." },
              { value: Math.sqrt(v) / 200, why: "Koren odpraviš s kvadriranjem obeh strani, ne s korenjenjem." },
            ], "m"),
            hint: "Vstavi hitrost, obe strani kvadriraj in izrazi $s$.",
            data: { given: [`v = ${v}\\ \\mathrm{km/h}`], find: ["s"] },
            formula: "v = \\sqrt{200\\,s}",
            solution: `$${v} = \\sqrt{200\\,s}$\n$${v * v} = 200\\,s$\n$s = \\dfrac{${v * v}}{200} ${ap(s, 1)} ${txr(s, 1)}\\ \\mathrm{m}$`,
          };
        }
        const v = r.pick([2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 12]);
        const hh = cl((v * v) / 10);
        return {
          text: `Hitrost valov na plitvi vodi je približno $v = \\sqrt{10\\,h}$, kjer je $h$ globina vode v metrih in $v$ hitrost v m/s. Kako globoka je voda, kjer se valovi širijo s hitrostjo $${tx(v)}\\ \\mathrm{m/s}$? Rezultat v metrih zaokroži na dve decimalki.`,
          answer: num(hh, 2, [
            { value: v / 10, why: "Najprej kvadriraj obe strani, da se znebiš korena." },
            { value: v * v * 10, why: "Iz $v^2 = 10\\,h$ izraziš $h$ z deljenjem z $10$, ne z množenjem." },
            { value: (v / 10) ** 2, why: "Kvadriraj obe strani: $v^2 = 10\\,h$. Faktor $10$ je pod korenom, zato ga ne kvadriraš." },
          ], "m"),
          hint: "Vstavi hitrost, obe strani kvadriraj in izrazi $h$.",
          data: { given: [`v = ${tx(v)}\\ \\mathrm{m/s}`], find: ["h"] },
          formula: "v = \\sqrt{10\\,h}",
          solution: `$${tx(v)} = \\sqrt{10\\,h}$\n$${tx(v * v)} = 10\\,h$\n$h = \\dfrac{${tx(v * v)}}{10} ${ap(hh, 2)} ${txr(hh, 2)}\\ \\mathrm{m}$`,
        };
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        // dva korena
        const diff = r.next() < 0.45;
        let p = r.int(0, 6);
        let q = r.int(0, 6);
        if (p === q) return null;
        if (diff && p < q) [p, q] = [q, p];
        const x0 = r.int(-4, 8);
        const a = p * p - x0;
        const b = q * q - x0;
        const c = diff ? p - q : p + q;
        const SA = `\\sqrt{${xm(-a)}}`;
        const SB = `\\sqrt{${xm(-b)}}`;
        const eq = `${SA} ${diff ? "-" : "+"} ${SB} = ${c}`;
        const rhs = diff ? a - b - c * c : c * c + b - a;
        const mistakes = diff
          ? [
              { value: ((a - b + c * c) / (2 * c)) ** 2 - b, why: "Pri urejanju po kvadriranju preveri predznake: na drugo stran prenašaš tudi $c^2$." },
              { value: ((a - b - c * c) / c) ** 2 - b, why: "Dvojni zmnožek pri $(c + \\sqrt{B})^2$ je $2c\\sqrt{B}$: deli z $2c$." },
            ]
          : [
              { value: (c * c - a - b) / 2, why: "$(\\sqrt{A} + \\sqrt{B})^2 \\ne A + B$: pozabil si dvojni zmnožek. Najprej osami en koren." },
              { value: ((c * c + b - a) / c) ** 2 - b, why: "Dvojni zmnožek pri $(c - \\sqrt{B})^2$ je $2c\\sqrt{B}$: deli z $2c$." },
            ];
        return {
          text: `Reši enačbo $${eq}$.`,
          answer: num(x0, null, mistakes),
          zeroOk: true,
          hint: "Osami en koren in kvadriraj. Nato osami drugi koren in kvadriraj še enkrat. Na koncu naredi preizkus.",
          data: { given: [eq], find: ["x"] },
          formula: ["(u \\pm v)^2 = u^2 \\pm 2uv + v^2", "\\text{preizkus v prvotni enačbi}"],
          solution: `Pogoja: $x \\ge ${-a}$ in $x \\ge ${-b}$.\nOsamimo prvi koren: $${SA} = ${c} ${diff ? "+" : "-"} ${SB}$\nKvadriramo: $${xm(-a)} = ${c * c} ${diff ? "+" : "-"} ${2 * c}${SB} + ${xm(-b)}$\nUredimo: $${2 * c}${SB} = ${rhs}$, torej $${SB} = ${q}$\nKvadriramo: $${xm(-b)} = ${q * q}$, $x = ${x0}$\nPreizkus: $\\sqrt{${x0 + a}} ${diff ? "-" : "+"} \\sqrt{${x0 + b}} = ${p} ${diff ? "-" : "+"} ${q} = ${c}$, rešitev ustreza.`,
        };
      }
      if (t === 1) {
        // koliko rešitev ima √(ax + b) = x + c
        const want = r.pick([0, 1, 1, 2, 2]);
        let pick = null;
        for (let i = 0; i < 60 && !pick; i++) {
          const c = r.int(-3, 3);
          const x1 = r.int(-8, 8);
          const x2 = r.int(-8, 8);
          const a = x1 + x2 + 2 * c;
          const b = c * c - x1 * x2;
          if (x1 >= x2 || a === 0 || Math.abs(a) > 12 || b === 0) continue;
          const cnt = (x1 + c >= 0) + (x2 + c >= 0);
          if (cnt === want) pick = { c, x1, x2, a, b, cnt };
        }
        if (!pick) return null;
        const { c, x1, x2, a, b, cnt } = pick;
        const A = poly([a, b]);
        const R = xm(-c);
        const lhs = (x) => (c === 0 ? `${x}` : `${x} ${sg(c)} = ${x + c}`);
        const ok = (x) => (x + c >= 0 ? `$${lhs(x)} \\ge 0$, ustreza` : `$${lhs(x)} < 0$, navidezna rešitev`);
        return {
          text: `Koliko realnih rešitev ima enačba $\\sqrt{${A}} = ${R}$?`,
          answer: num(cnt, null, [
            cnt < 2
              ? { value: 2, why: "Kvadriranje lahko doda navidezne rešitve: vsakega kandidata preveri v prvotni enačbi." }
              : { value: 1, why: "Kvadriranje lahko doda navidezno rešitev, ni pa nujno: preizkus naredi za vsakega kandidata posebej." },
            { value: cnt === 1 ? 0 : 1, why: "Koren je nenegativen, zato rešitev ustreza natanko tedaj, ko je desna stran $\\ge 0$. Preveri vsakega kandidata." },
          ]),
          zeroOk: true,
          hint: "Kvadriraj, reši kvadratno enačbo in za vsakega kandidata preveri, ali je desna stran nenegativna.",
          data: { given: [`\\sqrt{${A}} = ${R}`], find: ["\\text{število rešitev}"] },
          formula: ["\\sqrt{A} = B \\Leftrightarrow A = B^2 \\text{ in } B \\ge 0"],
          solution: `Kvadriramo: $${A} = ${c === 0 ? "x^2" : `(${R})^2`}$\n$${poly([1, 2 * c - a, c * c - b])} = 0$, $${facs(x1, x2)} = 0$: kandidata $${x1}$ in $${x2}$\nPogoj $${R} \\ge 0$: za $${x1}$ je ${ok(x1)}; za $${x2}$ je ${ok(x2)}.\nŠtevilo rešitev: $${cnt}$`,
        };
      }
      // obrestno obrestovanje / rast: (1 + p)^n = q
      const nm = name(r);
      const n = r.pick([2, 3, 4, 5, 6]);
      const pop = r.next() < 0.45;
      const p = pop ? r.pick([0.5, 1, 1.5, 2, 2.5, 3]) : r.pick([1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]);
      const K0 = pop ? r.int(8, 40) * 500 : r.pick([1000, 1500, 2000, 2500, 3000, 4000, 5000]);
      const Kn = pop ? Math.round(K0 * (1 + p / 100) ** n) : r2(K0 * (1 + p / 100) ** n);
      const q = Kn / K0;
      const root = q ** (1 / n);
      const pp = (root - 1) * 100;
      const text = pop
        ? `Mesto je imelo $${K0}$ prebivalcev, po $${n}$ letih pa $${Kn}$. Za koliko odstotkov se je število prebivalcev v povprečju povečalo vsako leto, če je bila letna rast ves čas enaka? Zaokroži na desetinko odstotka.`
        : `${nm} je ${g(nm, "vložil", "vložila")} $${K0}$ € na varčevalni račun z obrestnim obrestovanjem (obresti se pripišejo enkrat letno). Po $${n}$ letih je na računu $${tx(Kn, 2)}$ €. Kolikšna je letna obrestna mera? Zaokroži na desetinko odstotka.`;
      return {
        text,
        answer: { ...num(pp, 1, [
          { value: ((q - 1) / n) * 100, why: "Rast ni enakomerna (linearna): vsako leto se poveča že povečana vrednost, zato rešiš enačbo $(1 + p)^n = q$." },
          { value: (q - 1) * 100, why: "To je skupna rast v vseh letih skupaj, ne letna." },
          { value: root * 100, why: "To je faktor rasti $1 + p$ v odstotkih: odštej še $100\\ \\%$." },
        ], "%"), unitAlternatives: ["odstotkov", "odstotka"] },
        hint: "Zapiši enačbo $K_0(1 + p)^n = K_n$, osami potenco in koreni.",
        data: { given: [`K_0 = ${K0}`, `K_${n} = ${tx(Kn)}`, `n = ${n}`], find: ["p\\ (\\%)"] },
        formula: "K_n = K_0 (1 + p)^n",
        solution: `$${K0}\\,(1 + p)^{${n}} = ${tx(Kn)}$\n$(1 + p)^{${n}} = \\dfrac{${tx(Kn)}}{${K0}} \\approx ${txr(q, 5)}$\n$1 + p = ${rootT(n, txr(q, 5))} \\approx ${txr(root, 5)}$\n$p \\approx ${txr(root - 1, 5)} \\approx ${txr(pp, 1)}\\ \\%$`,
      };
    },
  },

  // ---------------- presečišča parabol, sistemi kvadratnih neenačb ----------------
  {
    id: P + "presecisca-sistemi",
    topics: [T("presecisca-parabol-in-sistemi-kvadratnih-neenacb")],
    gen(level, r) {
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0 || t === 1) {
          const want = r.pick([0, 1, 2, 2]);
          const L = parLine(r, want);
          const { a, b, c, k, n, D } = L;
          const pf = poly([a, b, c]);
          const lf = poly([k, n]);
          const own = cntD(b * b - 4 * a * c);
          const signErr = cntD((b + k) ** 2 - 4 * a * (c + n));
          const eqT = poly([a, b - k, c - n]);
          const sol = `$${pf} = ${lf}$\n$${eqT} = 0$\n$D = ${pt(b - k)}^2 - 4 \\cdot ${pt(a)} \\cdot ${pt(c - n)} = ${D}$\n${D > 0 ? "$D > 0$: dve presečišči, premica je sekanta." : D === 0 ? "$D = 0$: eno dotikališče, premica je tangenta." : "$D < 0$: ni presečišč, premica je mimobežnica."}`;
          const base = {
            hint: "Izenači desni strani, vse prenesi na levo in izračunaj diskriminanto dobljene kvadratne enačbe.",
            data: { given: [`y = ${pf}`, `y = ${lf}`], find: [t === 0 ? "\\text{število presečišč}" : "\\text{lega premice}"] },
            formula: ["ax^2 + bx + c = kx + n", "D = (b - k)^2 - 4a(c - n)"],
            solution: sol,
          };
          if (t === 0) {
            return {
              text: `Koliko skupnih točk imata parabola $y = ${pf}$ in premica $y = ${lf}$?`,
              answer: num(cntD(D), null, [
                { value: own, why: "To je število ničel parabole (presečišč z osjo $x$). Parabolo izenači s premico." },
                { value: signErr, why: "Ko premico preneseš na levo, spremeni predznak obema členoma." },
                { value: D === 0 ? 2 : NaN, why: "Pri $D = 0$ ima kvadratna enačba eno (dvojno) rešitev." },
              ]),
              zeroOk: true,
              ...base,
            };
          }
          const cnt = cntD(D);
          const why = (o) =>
            ({
              2: "Sekanta ima dve presečišči, takrat je $D > 0$. Izračunaj diskriminanto enačbe $f(x) = g(x)$.",
              1: "Tangenta se parabole dotakne, takrat je $D = 0$. Izračunaj diskriminanto enačbe $f(x) = g(x)$.",
              0: own > 0 || signErr > 0 ? "Mimobežnica nima presečišč, takrat je $D < 0$. Pazi: ničle parabole tu niso pomembne." : "Mimobežnica nima presečišč, takrat je $D < 0$. Izračunaj diskriminanto enačbe $f(x) = g(x)$.",
            })[o];
          return {
            text: `Kakšna je premica $y = ${lf}$ glede na parabolo $y = ${pf}$?`,
            answer: pickAns(r, PL_KIND[cnt], [2, 1, 0].filter((o) => o !== cnt).map((o) => [PL_KIND[o], why(o)])),
            ...base,
          };
        }
        // abscisa presečišča (a = 1)
        const v = r.shuffle([-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7]).slice(0, 2);
        const [x1, x2] = v.sort((p, q) => p - q);
        const k = r.int(-4, 4);
        const n = r.int(-6, 6);
        const b = k - (x1 + x2);
        const c = n + x1 * x2;
        const right = r.next() < 0.5;
        const ans = right ? x2 : x1;
        const pf = poly([1, b, c]);
        const lf = poly([k, n]);
        return {
          text: `Parabola $y = ${pf}$ in premica $y = ${lf}$ se sekata v dveh točkah. Vpiši absciso presečišča, ki leži bolj ${right ? "desno" : "levo"}.`,
          answer: num(ans, null, [
            { value: right ? x1 : x2, why: `To je abscisa drugega presečišča. Bolj ${right ? "desno" : "levo"} leži točka z ${right ? "večjo" : "manjšo"} absciso.` },
            { value: -ans, why: "Iz faktorja $(x - m) = 0$ sledi $x = m$: pazi na predznak." },
            { value: k * ans + n, why: "To je ordinata presečišča. Iščeš absciso ($x$)." },
          ]),
          zeroOk: true,
          hint: "Izenači desni strani, vse prenesi na levo in kvadratno enačbo razstavi.",
          data: { given: [`y = ${pf}`, `y = ${lf}`], find: [`x_{${right ? "\\text{desno}" : "\\text{levo}"}}`] },
          formula: "f(x) = g(x)",
          solution: `$${pf} = ${lf}$\n$${poly([1, b - k, c - n])} = 0$\n$${facs(x1, x2)} = 0$: $x_1 = ${x1}$, $x_2 = ${x2}$\nBolj ${right ? "desno" : "levo"} je presečišče z absciso $${ans}$.`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          // ordinata presečišča parabole in premice
          const a = r.pick([-2, -1, 2, 3]);
          const v = r.shuffle([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6]).slice(0, 2);
          const [x1, x2] = v.sort((p, q) => p - q);
          const k = r.nonZero(-4, 4);
          const n = r.int(-6, 6);
          const b = k - a * (x1 + x2);
          const c = n + a * x1 * x2;
          const right = r.next() < 0.5;
          const xi = right ? x2 : x1;
          const xo = right ? x1 : x2;
          const y = k * xi + n;
          const pf = poly([a, b, c]);
          const lf = poly([k, n]);
          return {
            text: `Izračunaj presečišči parabole $y = ${pf}$ in premice $y = ${lf}$. Vpiši ordinato presečišča z ${right ? "večjo" : "manjšo"} absciso.`,
            answer: num(y, null, [
              { value: xi, why: "To je abscisa presečišča. Ordinato dobiš, ko abscisi vstaviš v enačbo premice." },
              { value: k * xo + n, why: `To je ordinata drugega presečišča. Izberi točko z ${right ? "večjo" : "manjšo"} absciso.` },
              { value: -k * xi + n, why: "Iz faktorja $(x - m) = 0$ sledi $x = m$: pazi na predznak abscise." },
            ]),
            zeroOk: true,
            hint: "Izenači desni strani in reši kvadratno enačbo. Ordinato izračunaj iz preprostejše funkcije, premice.",
            data: { given: [`y = ${pf}`, `y = ${lf}`], find: ["y"] },
            formula: ["f(x) = g(x)", "y = g(x_i)"],
            solution: `$${pf} = ${lf}$\n$${poly([a, b - k, c - n])} = 0$\n$${a < 0 ? "-" : ""}${Math.abs(a) === 1 ? "" : Math.abs(a)}${facs(x1, x2)} = 0$: $x_1 = ${x1}$, $x_2 = ${x2}$\nPresečišči: $${pnt(x1, k * x1 + n)}$ in $${pnt(x2, k * x2 + n)}$\nOrdinata pri $x = ${xi}$: $y = ${evT([k, n], xi)} = ${y}$`,
          };
        }
        if (t === 1) {
          // dve paraboli
          const a2 = r.pick([-1, 1, 2, -2]);
          const b2 = r.int(-4, 4);
          const c2 = r.int(-5, 5);
          if (r.next() < 0.35) {
            // enaka vodilna koeficienta → linearna enačba
            const b1 = r.int(-6, 6);
            const c1 = r.int(-8, 8);
            if (b1 === b2 || c1 === c2) return null;
            const fP = poly([a2, b1, c1]);
            const gP = poly([a2, b2, c2]);
            return {
              text: `Paraboli $y = ${fP}$ in $y = ${gP}$ imata natanko eno presečišče. Izračunaj njegovo absciso (ulomek ali celo število).`,
              answer: frA(c2 - c1, b1 - b2, [
                { value: (c1 - c2) / (b1 - b2), why: "Ko člen preneseš na drugo stran, mu spremeni predznak." },
                { value: (c2 - c1) / (b1 + b2), why: `Člen $${poly([b2, 0])}$ na levi dobi nasprotni predznak.` },
              ]),
              hint: "Izenači desni strani. Kvadratna člena se odštejeta, ostane linearna enačba.",
              data: { given: [`y = ${fP}`, `y = ${gP}`], find: ["x"] },
              formula: "f(x) = g(x)",
              solution: `$${fP} = ${gP}$\nKvadratna člena se odštejeta: $${poly([b1 - b2, c1 - c2])} = 0$\n$x = ${ft(c2 - c1, b1 - b2)}$`,
            };
          }
          let a1 = r.pick([-2, -1, 1, 2, 3]);
          if (a1 === a2) a1 = -a2;
          const d = a1 - a2;
          const v = r.shuffle([-4, -3, -2, -1, 0, 1, 2, 3, 4, 5]).slice(0, 2);
          const [x1, x2] = v.sort((p, q) => p - q);
          const b1 = b2 - d * (x1 + x2);
          const c1 = c2 + d * x1 * x2;
          const fP = poly([a1, b1, c1]);
          const gP = poly([a2, b2, c2]);
          const right = r.next() < 0.5;
          const xi = right ? x2 : x1;
          const xo = right ? x1 : x2;
          const yv = ev([a2, b2, c2], xi);
          return {
            text: `Poišči presečišči parabol $y = ${fP}$ in $y = ${gP}$. Vpiši ordinato presečišča z ${right ? "večjo" : "manjšo"} absciso.`,
            answer: num(yv, null, [
              { value: xi, why: "To je abscisa presečišča. Ordinato dobiš, ko absciso vstaviš v eno od enačb." },
              { value: ev([a2, b2, c2], xo), why: `To je ordinata drugega presečišča. Izberi točko z ${right ? "večjo" : "manjšo"} absciso.` },
              { value: ev([a2, b2, c2], -xi), why: "Iz faktorja $(x - m) = 0$ sledi $x = m$: pazi na predznak abscise." },
            ]),
            zeroOk: true,
            hint: "Izenači desni strani in vse prenesi na levo. Dobiš kvadratno enačbo.",
            data: { given: [`y = ${fP}`, `y = ${gP}`], find: ["y"] },
            formula: "f(x) = g(x)",
            solution: `$${fP} = ${gP}$\n$${poly([d, b1 - b2, c1 - c2])} = 0$\n$${d < 0 ? "-" : ""}${Math.abs(d) === 1 ? "" : Math.abs(d)}${facs(x1, x2)} = 0$: $x_1 = ${x1}$, $x_2 = ${x2}$\n$y = ${evT([a2, b2, c2], xi)} = ${yv}$`,
          };
        }
        // besedilna naloga: parabolični let in pobočje
        const nm = name(r);
        const a = r.pick([0.1, 0.2, 0.25, 0.5]);
        const b = r.pick([1, 1.2, 1.5, 2, 2.5]);
        const k = r.pick([0.2, 0.25, 0.3, 0.4, 0.5]);
        const x = cl((b - k) / a);
        const y = cl(k * x);
        const ctx = r.pick([
          { intro: `${nm} brcne žogo z vznožja travnatega nasipa. Žoga leti po paraboli`, slope: "pobočje nasipa", hit: "žoga pade na nasip", flat: "bi žoga padla na vodoravna tla" },
          { intro: `${nm} drži vrtno cev pri tleh ob vznožju klančine. Curek vode teče po paraboli`, slope: "klančina", hit: "curek zadene klančino", flat: "bi curek zadel vodoravna tla" },
          { intro: `${nm} z vznožja hriba izstreli raketo za ognjemet. Leti po paraboli`, slope: "pobočje", hit: "raketa pade na pobočje", flat: "bi raketa padla na vodoravna tla" },
        ]);
        const askY = r.next() < 0.4;
        const pP = poly([-a, b, 0]);
        const lP = poly([k, 0]);
        return {
          text: `${ctx.intro} $y = ${pP}$, ${ctx.slope} pa se dviga po premici $y = ${lP}$. Pri tem je $x$ vodoravna razdalja od začetne točke, $y$ višina, oboje v metrih. ${askY ? `Na kolikšni višini ${ctx.hit}?` : `Na kolikšni vodoravni razdalji ${ctx.hit}?`} Rezultat v metrih zaokroži na dve decimalki.`,
          answer: askY
            ? num(y, 2, [
                { value: x, why: "To je vodoravna razdalja. Višino dobiš, ko jo vstaviš v enačbo premice." },
                { value: (k * b) / a, why: `Vstavil si ničlo parabole, kjer ${ctx.flat}. Parabolo izenači s premico.` },
                { value: (b * b) / (4 * a), why: "To je najvišja točka poti, ne mesto zadetka." },
              ], "m")
            : num(x, 2, [
                { value: b / a, why: `To je ničla parabole: tam ${ctx.flat}. Parabolo izenači s premico.` },
                { value: (b + k) / a, why: "Ko premico preneseš na levo, spremeni predznak." },
              ], "m"),
          hint: "Izenači enačbo parabole in premice. Izpostavi $x$.",
          data: { given: [`y = ${pP}`, `y = ${lP}`], find: [askY ? "y" : "x"] },
          formula: "f(x) = g(x)",
          solution: `$${pP} = ${lP}$\n$${poly([-a, b - k, 0])} = 0$, $x\\,(${poly([-a, b - k])}) = 0$\n$x = 0$ (začetna točka) ali $x = \\dfrac{${tx(b - k)}}{${tx(a)}} ${ap(x, 2)} ${txr(x, 2)}\\ \\mathrm{m}$${askY ? `\nVišina: $y = ${tx(k)} \\cdot ${txr(x, 2)} ${ap(y, 2)} ${txr(y, 2)}\\ \\mathrm{m}$` : ""}`,
        };
      }
      // raven 3
      const t = r.int(0, 3);
      if (t === 0) {
        // sistem: vsota ali število celih rešitev
        const q = quadSys(r);
        const ks = intsOf(q.ok);
        if (q.trivial || !ks || ks.length === 0 || ks.length > 12) return null;
        const askSum = r.next() < 0.5;
        const val = (ok) => {
          const xs = intsOf(ok);
          if (!xs) return NaN;
          return askSum ? sumOf(xs) : xs.length;
        };
        return {
          text: `Reši sistem neenačb ${sysText(q)}. ${askSum ? "Koliko je vsota vseh celih rešitev sistema?" : "Koliko celih števil reši sistem?"}`,
          answer: num(askSum ? sumOf(ks) : ks.length, null, sysWrong(q).map((w) => ({ value: val(w.ok), why: w.why }))),
          hint: "Reši vsako neenačbo posebej (razstavi in skiciraj parabolo). Obe rešitvi nariši na isto številsko premico in vzemi presek.",
          data: { given: [`f(x) = ${poly(q.F)}`, `g(x) = ${poly(q.G)}`], find: [askSum ? "\\text{vsota celih rešitev}" : "\\text{število celih rešitev}"] },
          formula: SYS_FORMULA,
          solution: [...sysSteps(q), `Cela števila: ${listInts(ks)}${askSum ? `; vsota je $${sumOf(ks)}$` : `; teh je $${ks.length}$`}.`].join("\n"),
        };
      }
      if (t === 1) {
        // sistem: krajišče z racionalno ničlo
        // Iščemo sistem, katerega rešitev je en omejen interval, ki se razlikuje od rešitev obeh
        // neenačb, z racionalno ničlo u/m kot enim od krajišč.
        let C = null;
        for (let i = 0; i < 300 && !C; i++) {
          const m = r.pick([2, 3]);
          const u = r.int(-7, 9);
          const v = r.int(-4, 5);
          const qv = r.shuffle([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6]).slice(0, 2).sort((p, w) => p - w);
          if (u % m === 0 || qv.includes(v)) continue;
          const s1 = r.pick([1, -1]);
          const s2 = r.pick([1, -1]);
          const r1 = r.pick(RELS);
          const r2_ = r.pick(RELS);
          const F = [s1 * m, -s1 * (u + m * v), s1 * u * v];
          const G = [s2, -s2 * (qv[0] + qv[1]), s2 * qv[0] * qv[1]];
          const A = (x) => holds(ev(F, x), r1);
          const B = (x) => holds(ev(G, x), r2_);
          const cu = { x: u / m, tex: ft(u, m), n: u, d: m };
          const crit = [cu, icr(v), icr(qv[0]), icr(qv[1])];
          const S = solveSet(crit, (x) => A(x) && B(x));
          const S1 = solveSet([cu, icr(v)], A).tex;
          const S2 = solveSet([icr(qv[0]), icr(qv[1])], B).tex;
          const pc = S.pieces[0];
          if (S.pieces.length !== 1 || !pc.lo || !pc.hi || pc.single || S.tex === S1 || S.tex === S2) continue;
          if (pc.lo !== cu && pc.hi !== cu) continue;
          C = { m, u, v, qv, s1, s2, r1, r2_, F, G, cu, crit, S, S1, S2, pc };
        }
        if (!C) return null;
        const { m, u, v, qv, s1, s2, r1, r2_, F, G, cu, crit, S, S1, S2, pc } = C;
        const left = r.next() < 0.75 ? pc.lo === cu : pc.lo !== cu;
        const e = left ? pc.lo : pc.hi;
        const ms = [];
        if (e === cu) ms.push({ value: -u / m, why: `Ničla faktorja $${poly([m, -u])}$ je rešitev enačbe $${poly([m, -u])} = 0$: pazi na predznak.` });
        for (const z of crit) if (z !== pc.lo && z !== pc.hi) ms.push({ value: z.x, why: "To je ničla ene od parabol, a ni krajišče preseka. Obe množici nariši na isto številsko premico." });
        const fT = `${s1 < 0 ? "-" : ""}(${poly([m, -u])})${fac(v)}`;
        return {
          text: `Množica rešitev sistema $${poly(F)} ${REL[r1]} 0$ in $${poly(G)} ${REL[r2_]} 0$ je interval. Vpiši njegovo ${left ? "levo" : "desno"} krajišče (ulomek ali celo število).`,
          answer: frA(e.n, e.d, ms),
          zeroOk: true,
          hint: "Prvo kvadratno funkcijo razstavi (ena ničla ni celo število). Reši vsako neenačbo posebej in vzemi presek.",
          data: { given: [`f(x) = ${poly(F)}`, `g(x) = ${poly(G)}`], find: [`\\text{${left ? "levo" : "desno"} krajišče}`] },
          formula: SYS_FORMULA,
          solution: `$${poly(F)} = ${fT}$: ničli $${ft(u, m)}$ in $${v}$, rešitev $${S1}$\n$${poly(G)} = ${facT(s2, qv[0], qv[1])}$: ničli $${qv[0]}$ in $${qv[1]}$, rešitev $${S2}$\nPresek: $x \\in ${S.tex}$\n${left ? "Levo" : "Desno"} krajišče: $${e.tex}$`,
        };
      }
      if (t === 2) {
        // izbira množice rešitev sistema
        const q = quadSys(r);
        const S = q.S;
        if (q.trivial || !S.pieces.length) return null;
        const wrongs = sysWrong(q).map((w) => [solveSet(q.crit, w.ok).tex, w.why]);
        const ans = pickAns(r, S.tex, wrongs);
        if (ans.options.length < 3) return null;
        return {
          text: `Katera množica je rešitev sistema neenačb ${sysText(q)}?`,
          answer: ans,
          options_tex: true,
          hint: "Reši vsako neenačbo posebej s skico parabole. Nato poišči števila, ki zadoščajo obema.",
          data: { given: [`f(x) = ${poly(q.F)}`, `g(x) = ${poly(q.G)}`], find: ["\\text{množica rešitev sistema}"] },
          formula: SYS_FORMULA,
          solution: sysSteps(q).join("\n"),
        };
      }
      // tangenta: parameter n ali dotikališče
      const a = r.pick([1, -1, 2, -2]);
      const x0 = r.int(-3, 3);
      const k = r.int(-3, 3);
      const n = r.int(-6, 6);
      const b = k - 2 * a * x0;
      const c = n + a * x0 * x0;
      const pf = poly([a, b, c]);
      const eqT = (nn) => poly([a, b - k, c - nn]);
      if (r.next() < 0.6) {
        return {
          text: `Za katero število $n$ je premica $y = ${poly([k, 0]).replace(/^0$/, "")}${k === 0 ? "n" : " + n"}$ tangenta parabole $y = ${pf}$?`,
          answer: num(n, null, [
            { value: c + (b - k) ** 2 / (4 * a), why: "Za tangento velja $D = 0$. Pri izražanju $n$ iz te enačbe preveri predznak." },
            { value: c - (b + k) ** 2 / (4 * a), why: "Ko premico preneseš na levo, dobi člen $kx$ nasprotni predznak: koeficient je $b - k$." },
            { value: c, why: "Premica skozi presečišče parabole z osjo $y$ ni nujno tangenta: postavi $D = 0$." },
          ]),
          zeroOk: true,
          hint: "Izenači parabolo in premico. Premica je tangenta, ko ima dobljena kvadratna enačba diskriminanto $0$.",
          data: { given: [`y = ${pf}`, `y = ${poly([k, 0]).replace(/^0$/, "")}${k === 0 ? "n" : " + n"}`], find: ["n"] },
          formula: ["D = (b - k)^2 - 4a(c - n)", "\\text{tangenta: } D = 0"],
          solution: `$${pf} = ${poly([k, 0]).replace(/^0$/, "")}${k === 0 ? "n" : " + n"}$\n$${poly([a, b - k, 0])} + (${c} - n) = 0$\n$D = ${pt(b - k)}^2 - 4 \\cdot ${pt(a)} \\cdot (${c} - n) = 0$\n$${c} - n = ${ft((b - k) ** 2, 4 * a)}$, $n = ${n}$`,
        };
      }
      const lf = poly([k, n]);
      const y0 = k * x0 + n;
      const vy = c - (b * b) / (4 * a);
      return {
        text: `Premica $y = ${lf}$ je tangenta parabole $y = ${pf}$. Izračunaj ordinato dotikališča.`,
        answer: num(y0, null, [
          { value: x0, why: "To je abscisa dotikališča. Ordinato dobiš iz enačbe premice." },
          { value: vy, why: "To je ordinata temena parabole. Dotikališče s tangento je drugje: izenači parabolo in premico." },
          { value: k * -x0 + n, why: "Pazi na predznak: dvojna ničla $a(x - x_0)^2 = 0$ je $x = x_0$." },
        ]),
        zeroOk: true,
        hint: "Izenači parabolo in premico. Dobiš kvadratno enačbo z dvojno rešitvijo: to je abscisa dotikališča.",
        data: { given: [`y = ${pf}`, `y = ${lf}`], find: ["y_0"] },
        formula: ["f(x) = g(x)", "D = 0:\\ x_0 = -\\dfrac{b - k}{2a}"],
        solution: `$${eqT(n)} = 0$\n$${a < 0 ? "-" : ""}${Math.abs(a) === 1 ? "" : Math.abs(a)}${x0 === 0 ? "x^2" : `(${xm(x0)})^2`} = 0$: dvojna rešitev $x_0 = ${x0}$\n$y_0 = ${evT([k, n], x0)} = ${y0}$\nDotikališče: $${pnt(x0, y0)}$`,
      };
    },
  },

  // ---------------- absolutna vrednost, stopničaste funkcije ----------------
  {
    id: P + "absolutna-stopnicaste",
    topics: [T("grafi-z-absolutno-vrednostjo-in-stopnicaste-funkcije")],
    gen(level, r) {
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          // celi del
          const dec = () => r.int(0, 7) + r.pick([1, 2, 3, 4, 6, 7, 8, 9]) / 10;
          const u = dec();
          let v;
          let vT;
          if (r.next() < 0.4) {
            const d = r.pick([3, 4, 6, 7]);
            const nn = r.int(d + 1, 4 * d);
            if (nn % d === 0) return null;
            v = -nn / d;
            vT = ft(-nn, d);
          } else {
            v = -dec();
            vT = tx(v);
          }
          const [x1, x2, t1, t2] = r.next() < 0.5 ? [u, v, tx(u), vT] : [v, u, vT, tx(u)];
          const op = r.pick([1, -1]);
          const f1 = Math.floor(x1);
          const f2 = Math.floor(x2);
          const E = f1 + op * f2;
          const opT = op > 0 ? "+" : "-";
          return {
            text: `Izračunaj $${fl(t1)} ${opT} ${fl(t2)}$.`,
            answer: num(E, null, [
              { value: Math.trunc(x1) + op * Math.trunc(x2), why: "Celi del negativnega števila ni del pred decimalno vejico: $\\lfloor x \\rfloor$ je največje celo število, ki ni večje od $x$ (pri negativnem gremo navzdol)." },
              { value: Math.round(x1) + op * Math.round(x2), why: "Celi del ni zaokroževanje: vzameš največje celo število, ki ni večje od $x$." },
              { value: Math.ceil(x1) + op * Math.ceil(x2), why: "Celi del vedno vodi navzdol (v levo na številski premici), ne navzgor." },
            ]),
            hint: "Vsako število postavi na številsko premico in poišči najbližje celo število levo od njega (ali njega samega).",
            data: { given: [`x_1 = ${t1}`, `x_2 = ${t2}`], find: ["\\text{vrednost}"] },
            formula: "\\lfloor x \\rfloor = \\max\\{k \\in \\mathbb{Z} : k \\le x\\}",
            solution: `$${fl(t1)} = ${f1}$${x1 < 0 ? " (pri negativnem številu gremo navzdol)" : ""}\n$${fl(t2)} = ${f2}$${x2 < 0 ? " (pri negativnem številu gremo navzdol)" : ""}\n$${f1} ${opT} ${pt(f2)} = ${E}$`,
          };
        }
        if (t === 1) {
          // parkirnina
          const p1 = r.pick([0.5, 0.8, 1, 1.2, 1.5, 2]);
          const p2 = r.pick([0.6, 0.8, 1, 1.2, 1.5, 2]);
          if (p1 === p2) return null;
          const h = r.int(1, 5);
          const mins = r.pick([0, 0, 10, 15, 20, 30, 40, 45, 50]);
          const Tm = 60 * h + mins;
          if (Tm <= 60) return null;
          const H = Math.ceil(Tm / 60);
          const price = p1 + p2 * (H - 1);
          const inMin = r.next() < 0.3;
          const tGiven = inMin || !mins ? `t = ${inMin ? Tm : h}\\ \\mathrm{${inMin ? "min" : "h"}}` : `t = ${h}\\ \\mathrm{h}\\ ${mins}\\ \\mathrm{min}`;
          const dur = inMin ? `$${Tm}$ minut` : mins ? `${sk(h, "uro", "uri", "ure", "ur")} in $${mins}$ minut` : sk(h, "uro", "uri", "ure", "ur");
          const nm = name(r);
          return {
            text: `Na parkirišču stane prva ura $${eT(p1)}$, vsaka nadaljnja začeta ura pa $${eT(p2)}$ (ob natanko polni uri se naslednja ura še ne začne). ${nm} parkira ${dur}. Koliko plača?`,
            answer: eur(price, [
              { value: mins === 0 ? p1 + p2 * H : NaN, why: "Pri natanko celem številu ur se nova ura še ni začela: polna pika je na desnem koncu stopnice." },
              { value: p1 + p2 * (Tm / 60 - 1), why: "Plača se vsaka začeta ura v celoti, ne le del ure." },
              { value: p1 + p2 * (Math.floor(Tm / 60) - 1), why: "Začeta ura se plača v celoti: število ur zaokroži navzgor." },
            ]),
            hint: "Ugotovi, koliko ur se je začelo. Prva ura ima svojo ceno, vsaka naslednja začeta ura pa drugo.",
            data: { given: [tGiven, `p_1 = ${eT(p1)}`, `p_2 = ${eT(p2)}`], find: ["C"] },
            formula: "C = p_1 + p_2 \\cdot (\\text{začete ure} - 1)",
            solution: `Čas: $${Tm}$ minut, začetih ur je $${H}$${mins === 0 ? " (pri natanko celi uri se nova ura še ne začne)" : ""}.\n$C = ${tx(p1, 2)} + ${tx(p2, 2)} \\cdot ${H - 1} = ${eT(price)}$`,
          };
        }
        // poštnina / dostava
        const parcel = r.next() < 0.4;
        const lims = parcel ? r.pick([[2, 5, 10, 20], [1, 3, 5, 10], [5, 10, 15, 30]]) : r.pick([[20, 50, 100, 250], [50, 100, 250, 500], [100, 250, 500, 1000]]);
        const prices = [];
        let pr = parcel ? r.pick([3.5, 4, 4.5, 5]) : r.pick([0.55, 0.65, 0.75, 0.85, 0.95]);
        for (let i = 0; i < 4; i++) {
          prices.push(r2(pr));
          pr += parcel ? r.pick([1, 1.5, 2, 2.5]) : r.pick([0.2, 0.3, 0.4, 0.5]);
        }
        const onB = r.next() < 0.5;
        const i = onB ? r.int(0, 2) : r.int(1, 3);
        let m;
        if (onB) m = lims[i];
        else if (parcel) m = r2(lims[i - 1] + 0.1 * r.int(1, Math.round((lims[i] - lims[i - 1]) * 10) - 1));
        else m = r.int(lims[i - 1] + 1, lims[i] - 1);
        const u = parcel ? "kg" : "g";
        const tbl = lims.map((l, j) => `do $${l}\\ \\mathrm{${u}}$: $${eT(prices[j])}$`).join(", ");
        return {
          text: `${parcel ? "Dostava paketa" : "Poštnina za pismo"} stane: ${tbl} (meja »do« je vključena). Koliko stane ${parcel ? "dostava paketa" : "poštnina za pismo"} z maso $${tx(m)}\\ \\mathrm{${u}}$?`,
          answer: eur(prices[i], [
            onB
              ? { value: prices[i + 1], why: `»Do $${lims[i]}\\ \\mathrm{${u}}$« vključuje tudi natanko $${lims[i]}\\ \\mathrm{${u}}$: polna pika je na desnem koncu stopnice.` }
              : { value: prices[i - 1], why: `${parcel ? "Paket je težji" : "Pismo je težje"} od $${lims[i - 1]}\\ \\mathrm{${u}}$, zato ne spada več v ta razred.` },
            { value: onB ? (i > 0 ? prices[i - 1] : NaN) : prices[i + 1] ?? NaN, why: "Poišči prvi razred »do …«, v katerega masa še spada." },
          ]),
          hint: "Poišči najmanjšo mejo »do …«, ki ni manjša od dane mase.",
          data: { given: [`m = ${tx(m)}\\ \\mathrm{${u}}`], find: ["C"] },
          formula: "\\text{»do } m_i\\text{«: } m \\le m_i",
          solution: `${onB ? `Masa je natanko na meji $${lims[i]}\\ \\mathrm{${u}}$; »do« mejo vključuje (polna pika desno).` : `$${lims[i - 1]} < ${tx(m)} \\le ${lims[i]}$`}\nRazred »do $${lims[i]}\\ \\mathrm{${u}}$«: cena $${eT(prices[i])}$`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          // vrednost m|x - a| ± |x - b|
          const a = r.int(-6, 6);
          const b = r.int(-6, 6);
          if (a === b) return null;
          const m = r.pick([1, 1, 2, 3]);
          const s = r.pick([1, 1, -1]);
          const x0 = r.int(-7, 7) + (r.next() < 0.3 ? 0.5 : 0);
          const fT = `${m === 1 ? "" : m}${absT(a)} ${s > 0 ? "+" : "-"} ${absT(b)}`;
          const val = m * Math.abs(x0 - a) + s * Math.abs(x0 - b);
          const inn = (c) => (c === 0 ? tx(x0) : `${tx(x0)} ${sg(-c)}`);
          return {
            text: `Dana je funkcija $f(x) = ${fT}$. Izračunaj $f(${tx(x0)})$.`,
            answer: num(val, null, [
              { value: m * (x0 - a) + s * (x0 - b), why: "Absolutna vrednost negativnega števila je pozitivna: izraza v $|\\ldots|$ izračunaj in vzemi njuni absolutni vrednosti." },
              { value: m === 1 && s > 0 ? Math.abs(2 * x0 - a - b) : NaN, why: "$|u| + |v|$ ni isto kot $|u + v|$: vsako absolutno vrednost izračunaj posebej." },
              { value: m === 1 && s > 0 ? Math.abs(a - b) : NaN, why: `Vsota je enaka $|a - b|$ le za $x$ med $${Math.min(a, b)}$ in $${Math.max(a, b)}$. Vstavi $x$.` },
            ]),
            zeroOk: true,
            hint: "Vstavi število in najprej izračunaj vsak izraz v absolutni vrednosti posebej.",
            data: { given: [`f(x) = ${fT}`, `x = ${tx(x0)}`], find: [`f(${tx(x0)})`] },
            formula: "|u| = u \\text{ za } u \\ge 0,\\ |u| = -u \\text{ za } u < 0",
            solution: `$f(${tx(x0)}) = ${m === 1 ? "" : m}|${inn(a)}| ${s > 0 ? "+" : "-"} |${inn(b)}|$\n$= ${m === 1 ? "" : `${m} \\cdot `}|${tx(x0 - a)}| ${s > 0 ? "+" : "-"} |${tx(x0 - b)}| = ${m === 1 ? "" : `${m} \\cdot `}${tx(Math.abs(x0 - a))} ${s > 0 ? "+" : "-"} ${tx(Math.abs(x0 - b))}$\n$= ${tx(val)}$`,
          };
        }
        if (t === 1) {
          // obratna naloga: največ koliko časa za dani znesek
          const bike = r.next() < 0.45;
          const nm = name(r);
          const p1 = bike ? r.pick([200, 250, 300, 400]) : r.pick([100, 120, 150, 200]);
          const p2 = bike ? r.pick([100, 150, 200]) : r.pick([80, 100, 120, 150, 200]);
          const H = r.int(2, 7);
          if (p1 === p2) return null;
          const extra = 10 * r.int(0, p2 / 10 - 1);
          const X = p1 + p2 * (H - 1) + extra;
          const unit = bike ? 30 : 1;
          const ms = [
            { value: unit * (H - 1), why: bike ? "Tudi prvih $30$ minut šteje: znesek zanje je že odštet, prištej jih." : "Prva ura šteje: znesek zanjo je že odštet, prištej jo." },
            { value: unit * Math.floor(X / p2), why: bike ? "Prvih $30$ minut ima drugačno ceno kot naslednji bloki." : "Prva ura ima drugačno ceno kot nadaljnje ure." },
            { value: unit * (H + 1), why: "Za naslednjo začeto enoto bi moral plačati še en blok, denarja pa ni dovolj." },
          ];
          return {
            text: bike
              ? `Izposoja kolesa stane $${eT(p1 / 100)}$ za prvih $30$ minut in $${eT(p2 / 100)}$ za vsakih nadaljnjih začetih $30$ minut (ob natanko $30$, $60$, … minutah se naslednji blok še ne začne). ${nm} ima $${eT(X / 100)}$. Največ koliko minut lahko vozi? Odgovor zapiši v minutah.`
              : `Na parkirišču stane prva ura $${eT(p1 / 100)}$, vsaka nadaljnja začeta ura pa $${eT(p2 / 100)}$ (ob natanko polni uri se naslednja ura še ne začne). ${nm} ima $${eT(X / 100)}$. Največ koliko ur lahko parkira?`,
            answer: num(unit * H, null, ms),
            hint: "Od zneska odštej ceno prve enote. Nato ugotovi, koliko celih nadaljnjih enot še lahko plačaš.",
            data: { given: [`p_1 = ${eT(p1 / 100)}`, `p_2 = ${eT(p2 / 100)}`, `X = ${eT(X / 100)}`], find: [bike ? "t_{\\max}\\ (\\text{min})" : "t_{\\max}\\ (\\text{h})"] },
            formula: "p_1 + p_2 \\cdot k \\le X",
            solution: `Po prvi enoti ostane $${tx(X / 100, 2)} - ${tx(p1 / 100, 2)} = ${eT((X - p1) / 100)}$.\nNadaljnjih enot: $\\left\\lfloor \\dfrac{${tx((X - p1) / 100, 2)}}{${tx(p2 / 100, 2)}} \\right\\rfloor = ${H - 1}$\nSkupaj ${bike ? `${sk(H, "blok", "bloka", "bloki", "blokov")} po $30$ minut, to je $${30 * H}$ minut` : sk(H, "ura", "uri", "ure", "ur")}. Ob začetku naslednje enote bi bilo treba plačati še $${eT(p2 / 100)}$.`,
          };
        }
        // najmanjša vrednost |x - a| + |x - b|
        const v = r.shuffle([-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 2);
        const [a, b] = v.sort((p, q) => p - q);
        if (b - a < 2) return null;
        const fT = `${absT(a)} + ${absT(b)}`;
        const askCount = r.next() < 0.4;
        const road = r.next() < 0.35 && !askCount;
        if (askCount) {
          return {
            text: `Za koliko celih števil $x$ doseže funkcija $f(x) = ${fT}$ svojo najmanjšo vrednost?`,
            answer: num(b - a + 1, null, [
              { value: b - a, why: "Najmanjšo vrednost funkcija doseže na zaprtem intervalu: šteješ tudi obe krajišči." },
              { value: 1, why: "Graf ni oblike V z eno konico: ima ravno dno med obema ničlama." },
              { value: b - a - 1, why: "Krajišči intervala dna pripadata dnu: tam je vrednost enaka." },
            ]),
            hint: "Nariši graf po primerih: ničli izrazov v absolutnih vrednostih razdelita os na tri dele.",
            data: { given: [`f(x) = ${fT}`], find: ["\\text{število celih } x \\text{ z najmanjšo vrednostjo } f(x)"] },
            formula: "a \\le x \\le b:\\ |x - a| + |x - b| = b - a",
            solution: `Za $x < ${a}$ je $f(x) = ${poly([-2, a + b])}$ (pada), za $x > ${b}$ je $f(x) = ${poly([2, -a - b])}$ (narašča).\nZa $${a} \\le x \\le ${b}$ je $f(x) = (${xm(a)}) - (${xm(b)}) = ${b - a}$: ravno dno.\nCela števila od $${a}$ do $${b}$: $${b} - ${pt(a)} + 1 = ${b - a + 1}$`,
          };
        }
        return {
          text: road
            ? `Ob ravni cesti stojita šola pri kilometru $${a + 10}$ in trgovina pri kilometru $${b + 10}$. Kolikšna je najmanjša možna vsota razdalj od hiše ob tej cesti do šole in do trgovine (v km)?`
            : `Kolikšna je najmanjša vrednost funkcije $f(x) = ${fT}$?`,
          answer: num(b - a, null, [
            { value: road ? NaN : Math.abs(a) + Math.abs(b), why: "To je vrednost pri $x = 0$, najmanjša vrednost pa ni nujno tam." },
            { value: (b - a) / 2, why: "Tudi na sredini intervala je vsota obeh razdalj enaka razdalji med točkama, ne njeni polovici." },
            { value: 2 * (b - a), why: "Na intervalu med točkama se razdalji seštejeta v razdaljo med njima." },
          ], road ? "km" : null),
          hint: road ? "Zapiši vsoto razdalj z absolutnima vrednostma. Premisli, kaj se zgodi, ko je hiša med obema stavbama." : "Odstrani absolutni vrednosti na intervalih, ki jih določata ničli izrazov.",
          data: { given: road ? [`a = ${a + 10}\\ \\mathrm{km}`, `b = ${b + 10}\\ \\mathrm{km}`] : [`f(x) = ${fT}`], find: ["f_{\\min}"] },
          formula: "a \\le x \\le b:\\ |x - a| + |x - b| = b - a",
          solution: road
            ? `Vsota razdalj: $f(x) = |x - ${a + 10}| + |x - ${b + 10}|$\nZunaj intervala $[${a + 10}, ${b + 10}]$ je vsota večja, saj greš do druge stavbe mimo prve.\nZa $${a + 10} \\le x \\le ${b + 10}$: $f(x) = ${b + 10} - ${a + 10} = ${b - a}\\ \\mathrm{km}$`
            : `Za $x < ${a}$: $f(x) = ${poly([-2, a + b])}$, pada.\nZa $${a} \\le x \\le ${b}$: $f(x) = ${b - a}$.\nZa $x > ${b}$: $f(x) = ${poly([2, -a - b])}$, narašča.\nNajmanjša vrednost: $${b - a}$`,
        };
      }
      // raven 3
      const t = r.int(0, 3);
      if (t === 0) {
        // |x^2 - c| = d
        const c = r.pick([1, 2, 3, 4, 5, 6, 8, 9, 12, 16]);
        if (r.next() < 0.3 && c >= 3) {
          return {
            text: `Za koliko celih števil $d$ ima enačba $|x^2 - ${c}| = d$ natanko štiri realne rešitve?`,
            answer: num(c - 1, null, [
              { value: c + 1, why: `Pri $d = 0$ in $d = ${c}$ rešitve niso štiri: preveri obe krajišči.` },
              { value: c, why: `Preveri krajišči: pri $d = ${c}$ se vodoravna premica dotakne vrha grafa v $x = 0$.` },
            ]),
            hint: `Nariši graf $y = |x^2 - ${c}|$: del parabole pod osjo $x$ prezrcali navzgor. Opazuj, koliko presečišč ima vodoravna premica $y = d$.`,
            data: { given: [`|x^2 - ${c}| = d`], find: ["\\text{število celih } d"] },
            formula: "y = |f(x)|: \\text{ del pod osjo } x \\text{ prezrcališ navzgor}",
            solution: `Graf $y = |x^2 - ${c}|$ ima ničli $\\pm\\sqrt{${c}}$ in lokalni vrh $(0, ${c})$.\nPremica $y = d$ ga seka v štirih točkah natanko za $0 < d < ${c}$.\nPri $d = 0$ sta rešitvi $2$, pri $d = ${c}$ pa $3$.\nCela števila $d$: od $1$ do $${c - 1}$, teh je $${c - 1}$.`,
          };
        }
        const kind = r.pick(["neg", "zero", "in", "in", "top", "top", "above"]);
        const d = kind === "neg" ? -r.int(1, 5) : kind === "zero" ? 0 : kind === "in" ? r.int(1, c - 1) : kind === "top" ? c : c + r.int(1, 6);
        if (kind === "in" && c < 2) return null;
        const cnt = { neg: 0, zero: 2, in: 4, top: 3, above: 2 }[kind];
        const plusCnt = c + d > 0 ? 2 : c + d === 0 ? 1 : 0;
        const ms = kind === "neg" ? [] : [{ value: plusCnt, why: "$|A| = d$ pomeni $A = d$ ali $A = -d$. Upoštevaj obe možnosti." }];
        if (kind === "top") ms.push({ value: 4, why: `Pri $x^2 = ${c} - d = 0$ je rešitev ena sama, $x = 0$.` });
        if (kind === "above") ms.push({ value: 4, why: `Enačba $x^2 = ${c} - d$ nima realne rešitve, ker je desna stran negativna.` });
        if (kind === "neg") ms.push({ value: 2, why: "Absolutna vrednost ni nikoli negativna." });
        if (kind === "zero") ms.push({ value: 4, why: "Pri $d = 0$ sta enačbi $A = d$ in $A = -d$ isti." });
        const sq = (w) => (w > 0 ? `dve rešitvi $x = \\pm\\sqrt{${w}}$` : w === 0 ? "ena rešitev $x = 0$" : "ni rešitev");
        return {
          text: `Koliko realnih rešitev ima enačba $|x^2 - ${c}| = ${d}$?`,
          answer: num(cnt, null, ms),
          zeroOk: true,
          hint: `Nariši graf $y = |x^2 - ${c}|$ in vodoravno premico $y = ${d}$. Ali reši enačbi $x^2 - ${c} = ${d}$ in $x^2 - ${c} = ${-d}$.`,
          data: { given: [`|x^2 - ${c}| = ${d}`], find: ["\\text{število rešitev}"] },
          formula: ["|A| = d,\\ d \\ge 0 \\Leftrightarrow A = d \\text{ ali } A = -d", "|A| = d,\\ d < 0: \\text{ ni rešitev}"],
          solution:
            d < 0
              ? `Absolutna vrednost je vedno $\\ge 0$, desna stran $${d}$ pa je negativna.\nŠtevilo rešitev: $0$`
              : `$x^2 - ${c} = ${d}$: $x^2 = ${c + d}$, ${sq(c + d)}\n${d === 0 ? "Pri $d = 0$ je druga enačba ista." : `$x^2 - ${c} = ${-d}$: $x^2 = ${c - d}$, ${sq(c - d)}`}\nŠtevilo rešitev: $${cnt}$ (graf ima vrh $(0, ${c})$, premica $y = ${d}$ ga seka v $${cnt}$ točkah).`,
        };
      }
      if (t === 1) {
        // |x - a| + |x - b| = d
        const v = r.shuffle([-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6]).slice(0, 2);
        const [a, b] = v.sort((p, q) => p - q);
        const d = b - a + r.int(1, 7);
        const big = r.next() < 0.5;
        const xs = (a + b + d) / 2;
        const xm_ = (a + b - d) / 2;
        const ans = big ? xs : xm_;
        const fT = `${absT(a)} + ${absT(b)}`;
        return {
          text: `Enačba $${fT} = ${d}$ ima dve rešitvi. Vpiši ${big ? "večjo" : "manjšo"}.`,
          answer: num(ans, null, [
            { value: big ? xm_ : xs, why: `To je druga rešitev. Iščeš ${big ? "večjo" : "manjšo"}.` },
            { value: big ? -(a + b + d) / 2 : -(a + b - d) / 2, why: "Ko odstraniš absolutno vrednost negativnega izraza, spremeni predznak obema členoma." },
            { value: big ? b + d : a - d, why: "Na tem intervalu sta oba izraza v absolutnih vrednostih istega predznaka: upoštevaj oba." },
          ]),
          zeroOk: true,
          hint: `Ničli $${a}$ in $${b}$ razdelita os na tri intervale. Na vsakem odstrani absolutni vrednosti in reši linearno enačbo.`,
          data: { given: [`${fT} = ${d}`], find: [big ? "x_{\\text{večja}}" : "x_{\\text{manjša}}"] },
          formula: "|u| = u \\text{ za } u \\ge 0,\\ |u| = -u \\text{ za } u < 0",
          solution: `Za $${a} \\le x \\le ${b}$ je vsota enaka $${b - a} \\ne ${d}$: tam ni rešitev.\nZa $x > ${b}$: $${poly([2, -a - b])} = ${d}$, $x = ${tx(xs)}$\nZa $x < ${a}$: $${poly([-2, a + b])} = ${d}$, $x = ${tx(xm_)}$\n${big ? "Večja" : "Manjša"} rešitev: $${tx(ans)}$`,
        };
      }
      if (t === 2) {
        // najmanjša vrednost vsote treh razdalj ali uteženih razdalj
        if (r.next() < 0.35) {
          const v = r.shuffle([-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6]).slice(0, 2);
          const [a, b] = v;
          const fT = `2${absT(a)} + ${absT(b)}`;
          const f = (x) => 2 * Math.abs(x - a) + Math.abs(x - b);
          return {
            text: `Kolikšna je najmanjša vrednost funkcije $f(x) = ${fT}$?`,
            answer: num(Math.abs(a - b), null, [
              { value: 2 * Math.abs(a - b), why: `To je vrednost pri $x = ${b}$. Izračunaj vrednost tudi v drugi točki preloma in ju primerjaj.` },
              { value: f((a + b) / 2), why: "Najmanjša vrednost ni na sredini med ničlama: graf ni simetričen, ker imata člena različni uteži." },
              { value: 0, why: "Obeh absolutnih vrednosti hkrati ne moreš izničiti." },
            ]),
            hint: "Funkcija je odsekoma linearna; najmanjša vrednost je v eni od ničel izrazov v absolutnih vrednostih. Izračunaj vrednost v obeh.",
            data: { given: [`f(x) = ${fT}`], find: ["f_{\\min}"] },
            formula: "\\text{odsekoma linearna funkcija: ekstrem v točki preloma}",
            solution: `Graf je sestavljen iz daljic in poltrakov, prelomi se v $x = ${a}$ in $x = ${b}$.\n$f(${a}) = 2 \\cdot 0 + |${tx(a - b)}| = ${Math.abs(a - b)}$\n$f(${b}) = 2 \\cdot |${tx(b - a)}| + 0 = ${2 * Math.abs(a - b)}$\nMed tema točkama je graf daljica, zunaj njiju pa vrednost z oddaljenostjo narašča, zato je najmanjša vrednost $${Math.abs(a - b)}$.`,
          };
        }
        const v = r.shuffle([-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 3);
        const [a, b, c] = v.sort((p, q) => p - q);
        const f = (x) => Math.abs(x - a) + Math.abs(x - b) + Math.abs(x - c);
        const mean = (a + b + c) / 3;
        const askWhere = r.next() < 0.45;
        const road = r.next() < 0.5;
        const nm = name(r);
        const text = road
          ? `Ob ravni cesti so trije zaselki, pri kilometrih $${a + 10}$, $${b + 10}$ in $${c + 10}$. ${nm} načrtuje skupno zbirno mesto za mleko, tako da bo vsota razdalj do vseh treh zaselkov najmanjša. ${askWhere ? "Pri katerem kilometru naj bo?" : "Kolikšna je ta najmanjša vsota (v km)?"}`
          : askWhere
            ? `Pri katerem $x$ doseže funkcija $f(x) = ${absT(a)} + ${absT(b)} + ${absT(c)}$ najmanjšo vrednost?`
            : `Kolikšna je najmanjša vrednost funkcije $f(x) = ${absT(a)} + ${absT(b)} + ${absT(c)}$?`;
        const sh = road ? 10 : 0;
        return {
          text,
          answer: askWhere
            ? num(b + sh, null, [
                { value: mean + sh, why: "Vsota razdalj je najmanjša v srednji točki (mediani), ne v povprečju." },
                { value: (a + c) / 2 + sh, why: "Sredina med skrajnima točkama ni najboljša: tam je razdalja do srednje točke odveč." },
              ])
            : num(c - a, null, [
                { value: f(mean), why: "Vsota razdalj je najmanjša v srednji točki (mediani), ne v povprečju." },
                { value: f(a), why: "V skrajni točki vsota ni najmanjša: premik proti sredini skrajša dve razdalji in podaljša le eno." },
                { value: c - b + (b - a) / 2, why: "Izračunaj vse tri razdalje v srednji točki in jih seštej." },
              ], road ? "km" : null),
          hint: "Premisli, kako se vsota spremeni, ko se premakneš za malo v levo ali desno: koliko razdalj se skrajša in koliko podaljša?",
          data: { given: road ? [`x_1 = ${a + 10}`, `x_2 = ${b + 10}`, `x_3 = ${c + 10}`] : [`f(x) = ${absT(a)} + ${absT(b)} + ${absT(c)}`], find: [askWhere ? "x_{\\min}" : "f_{\\min}"] },
          formula: "f(x) = |x - x_1| + |x - x_2| + |x - x_3|",
          solution: `Levo od $${b + sh}$ se pri premiku v desno dve razdalji skrajšata in ena podaljša, zato vsota pada; desno od $${b + sh}$ narašča.\nNajmanjša vrednost je v srednji točki $x = ${b + sh}$.\n$f(${b + sh}) = ${b - a} + 0 + ${c - b} = ${c - a}${road ? "\\ \\mathrm{km}" : ""}$`,
        };
      }
      // ⌊ax + b⌋ = k
      const a = r.pick([2, 3, 4]);
      const b = r.int(-5, 5);
      const k = r.int(-6, 8);
      const right = r.next() < 0.5;
      const inner = poly([a, b]);
      const [nL, nR] = [k - b, k + 1 - b];
      return {
        text: `Množica rešitev enačbe $${fl(inner)} = ${k}$ je interval $[\\alpha, \\beta)$. Vpiši ${right ? "$\\beta$" : "$\\alpha$"} (ulomek ali celo število).`,
        answer: frA(right ? nR : nL, a, [
          { value: (right ? nL : nR) / a, why: `Celi del je enak $${k}$ za vrednosti od $${k}$ (vključno) do $${k + 1}$ (izključno). Preveri, katero krajišče iščeš.` },
          { value: (right ? k + 1 + b : k + b) / a, why: "Ko prenašaš prosti člen na drugo stran neenačbe, mu spremeni predznak." },
          { value: right ? nR : nL, why: `Na koncu deli s koeficientom $${a}$.` },
        ]),
        zeroOk: true,
        hint: `$${fl("u")} = ${k}$ pomeni $${k} \\le u < ${k + 1}$. Zapiši dvojno neenačbo in izrazi $x$.`,
        data: { given: [`${fl(inner)} = ${k}`], find: [right ? "\\beta" : "\\alpha"] },
        formula: "\\lfloor u \\rfloor = k \\Leftrightarrow k \\le u < k + 1",
        solution: `$${k} \\le ${inner} < ${k + 1}$\n$${k - b} \\le ${a}x < ${k + 1 - b}$\n$${ft(nL, a)} \\le x < ${ft(nR, a)}$\n${right ? "$\\beta" : "$\\alpha"} = ${ft(right ? nR : nL, a)}$`,
      };
    },
  },
];

export const MATURA_MAT_SS2 = wrapGens(GENS);
