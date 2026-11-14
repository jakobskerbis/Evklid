// Generatorji za teme 3. letnika gimnazije, ki jih zahteva maturitetna pot (MAT-SS-3): premice in
// ravnine v prostoru, poševna telesa in vrtenine, vektorji v geometriji, krožne funkcije, stožnice v
// premaknjeni legi in tangente, racionalne neenačbe.
// Merila: docs/kakovost.md §2. Vsi rezultati so izračunani v kodi iz istih števil, ki jih vidi dijak.
// Izvirne naloge, ne prepisane maturitetne.
import { g } from "../rng.js";
import { gcd, roundHalfUp } from "../check.js";
import { tx } from "./mat.js";
import { fr, num, frA, ft, sg, pickAns, name, wrapGens } from "./matura-util.js";

const P = "mat-ss3-matura-";
const T = (s) => `MAT-SS-3/${s}`;
const DEG = Math.PI / 180;
const RAD = 180 / Math.PI;

// ---------- pomožne funkcije ----------
// Večkratnik π v TeX: piT(5, 6) → \frac{5\pi}{6}, piT(-1, 2) → -\frac{\pi}{2}.
function piT(n, d) {
  const [a, b] = fr(n, d);
  if (a === 0) return "0";
  const s = a < 0 ? "-" : "";
  const m = Math.abs(a) === 1 ? "" : Math.abs(a);
  return b === 1 ? `${s}${m}\\pi` : `${s}\\frac{${m}\\pi}{${b}}`;
}
// x - a: xm(3) → "x - 3", xm(-2) → "x + 2", xm(0) → "x".
const xm = (a, v = "x") => (a === 0 ? v : `${v} ${sg(-a)}`);
const sqr = (a, v = "x") => (a === 0 ? `${v}^2` : `(${xm(a, v)})^2`);
// Vsota členov [[koeficient, spremenljivka], ...] brez ničelnih členov: comb([[2, "x"], [-3, ""]]) → "2x - 3".
function comb(terms) {
  let s = "";
  for (const [c, v] of terms) {
    if (!c) continue;
    const a = Math.abs(c);
    const body = v ? (a === 1 ? v : `${tx(a)}${v}`) : tx(a);
    s += s === "" ? (c < 0 ? "-" : "") + body : (c < 0 ? " - " : " + ") + body;
  }
  return s || "0";
}
const le = (a, b, v = "x") => comb([[a, v], [b, ""]]);
const ap = (x, d) => (Math.abs(roundHalfUp(x, d) - x) < 1e-9 ? "=" : "\\approx");
const dg = (x, d = 1) => `${tx(x, d)}^\\circ`;
const cm = (x) => `${tx(x)}\\ \\mathrm{cm}`;
const sub3 = (p, q) => p.map((v, i) => v - q[i]);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
const isZ = (v) => v.every((c) => Math.abs(c) < 1e-9);
const vt = (v) => `(${v.map((c) => (typeof c === "string" ? c : tx(c))).join(", ")})`;
const AX = ["x", "y", "z"];
// Vmesni rezultat, zaokrožen na d decimalk, brez končnih ničel: 4 namesto 4,000.
const txr = (x, d) => tx(roundHalfUp(x, d));
// Kot kot argument funkcije: negativen v oklepaju, sin(-45°) in sin(-π/4).
const aD = (d) => (d < 0 ? `\\left(${d}^\\circ\\right)` : `${d}^\\circ`);
const aP = (d) => (d < 0 ? `\\left(${piT(d, 180)}\\right)` : piT(d, 180));
// Stopinje v razlagi (»45^\circ«) zapiše z π, za naloge z odgovorom v obliki kπ.
const degToPi = (s) => s.replace(/(-?\d+)\^\\circ/g, (_, d) => piT(Number(d), 180));
const mod0 = (v, m) => ((v % m) + m) % m === 0;
const sgn = (x) => (x > 0 ? 1 : x < 0 ? -1 : 0);

// ================= kocka in kvader =================
// Kocka z robom 2 (razpolovišča robov imajo cele koordinate): ABCD spodaj, E, F, G, H po vrsti nad A, B, C, D.
const CUBE = { A: [0, 0, 0], B: [2, 0, 0], C: [2, 2, 0], D: [0, 2, 0], E: [0, 0, 2], F: [2, 0, 2], G: [2, 2, 2], H: [0, 2, 2] };
const VN = Object.keys(CUBE);
const CUBE_TXT = "V kocki $ABCDEFGH$ je $ABCD$ spodnja ploskev, oglišča $E$, $F$, $G$, $H$ pa ležijo po vrsti nad $A$, $B$, $C$, $D$.";
const PAIRS = [];
VN.forEach((p, i) => VN.slice(i + 1).forEach((q) => PAIRS.push([p, q])));
const len2 = (p, q) => dot(sub3(CUBE[q], CUBE[p]), sub3(CUBE[q], CUBE[p]));
const EDGES = PAIRS.filter(([p, q]) => len2(p, q) === 4);
const FACE_LINES = PAIRS.filter(([p, q]) => len2(p, q) <= 8);
const MIDS = EDGES.map(([p, q]) => ({ e: p + q, c: CUBE[p].map((v, i) => (v + CUBE[q][i]) / 2) }));
const PLANES = ["ABCD", "EFGH", "ABFE", "DCGH", "ADHE", "BCGF", "ACGE", "BDHF", "ABGH", "CDEF", "ADGF", "BCHE"];
const mkL = (a, b, pts = CUBE) => ({ n: a + b, a, b, p: pts[a], q: pts[b] });
const nameAt = (S, pts) => Object.keys(pts).find((k) => pts[k].every((c, i) => Math.abs(c - S[i]) < 1e-9)) || null;
function lineRel(l1, l2) {
  const d1 = sub3(l1.q, l1.p);
  const d2 = sub3(l2.q, l2.p);
  const c = cross(d1, d2);
  if (isZ(c)) return isZ(cross(d1, sub3(l2.p, l1.p))) ? "ista" : "vzporedni";
  return Math.abs(dot(sub3(l2.p, l1.p), c)) < 1e-9 ? "sekajoči" : "mimobežni";
}
function meet(l1, l2) {
  const d1 = sub3(l1.q, l1.p);
  const d2 = sub3(l2.q, l2.p);
  const c = cross(d1, d2);
  const t = dot(cross(sub3(l2.p, l1.p), d2), c) / dot(c, c);
  return l1.p.map((v, i) => v + t * d1[i]);
}
// Razlaga lege dveh premic (vrstice rešitve).
function relLines(l1, l2, rel, pts) {
  if (rel === "vzporedni") {
    const same = dot(sub3(l1.q, l1.p), sub3(l2.q, l2.p)) > 0;
    const quad = l1.a + l1.b + (same ? l2.b + l2.a : l2.a + l2.b);
    return [`Premici $${l1.n}$ in $${l2.n}$ imata isto smer.`, `Ležita v isti ravnini (štirikotnik $${quad}$) in nimata skupne točke, zato sta vzporedni.`];
  }
  const out = ["Premici imata različni smeri, zato nista vzporedni."];
  if (rel === "sekajoči") {
    const S = meet(l1, l2);
    const nm = nameAt(S, pts);
    if (nm) out.push(`Obe gresta skozi točko $${nm}$, zato se sekata.`);
    else if (S.every((c) => Math.abs(c - 1) < 1e-9)) out.push("Obe gresta skozi središče kocke, zato se sekata.");
    else out.push(`Točke $${l1.a}$, $${l1.b}$, $${l2.a}$ in $${l2.b}$ ležijo v isti ravnini, zato se premici sekata.`);
    return out;
  }
  out.push(`Ravnina skozi $${l1.a}$, $${l1.b}$ in $${l2.a}$ ne vsebuje točke $${l2.b}$, zato premici ne ležita v isti ravnini.`);
  out.push("Nimata skupne točke in nista vzporedni: sta mimobežni.");
  return out;
}
const REL_WHY = {
  vzporedni: { sekajoči: "Premici imata isto smer, zato se ne moreta sekati.", mimobežni: "Vzporedni premici vedno ležita v isti ravnini, mimobežni pa ne." },
  sekajoči: { vzporedni: "Premici imata različni smeri, zato nista vzporedni.", mimobežni: "Premici imata skupno točko, torej ležita v isti ravnini in nista mimobežni." },
  mimobežni: { vzporedni: "Premici imata različni smeri, zato nista vzporedni.", sekajoči: "Na sliki se premici morda prekrivata, v prostoru pa nimata skupne točke, ker ne ležita v isti ravnini." },
};
// Izbere par premic z želeno lego (mk vrne { l1, l2, pts, intro }).
function linePair(r, mk) {
  const want = r.pick(["sekajoči", "vzporedni", "mimobežni"]);
  for (let i = 0; i < 400; i++) {
    const c = mk(r);
    if (c && lineRel(c.l1, c.l2) === want) return { ...c, rel: want };
  }
  return null;
}
function lineChoice(r, c, hint) {
  const wrongs = ["sekajoči", "vzporedni", "mimobežni"].filter((o) => o !== c.rel).map((o) => [o, REL_WHY[c.rel][o]]);
  return {
    text: `${c.intro} Kakšna je medsebojna lega premic $${c.l1.n}$ in $${c.l2.n}$?`,
    answer: pickAns(r, c.rel, wrongs),
    hint,
    data: { given: [`p_1 = ${c.l1.n}`, `p_2 = ${c.l2.n}`], find: ["\\text{lega premic}"] },
    formula: ["\\text{vzporedni: ista smer, skupna ravnina}", "\\text{sekajoči: ena skupna točka}", "\\text{mimobežni: ni skupne ravnine}"],
    solution: relLines(c.l1, c.l2, c.rel, c.pts).join("\n"),
  };
}
// Premica in ravnina kocke.
function planeOf(pl) {
  const [A0, B0, C0] = [...pl].slice(0, 3).map((k) => CUBE[k]);
  return { A0, n: cross(sub3(B0, A0), sub3(C0, A0)) };
}
const inPlane = (X, pl) => dot(sub3(X, pl.A0), pl.n) === 0;
function planeRel(l, pl) {
  const d = sub3(l.q, l.p);
  if (dot(d, pl.n) === 0) return inPlane(l.p, pl) ? "leži" : "vzporedna";
  return "seka";
}
const PL_OPT = { leži: "premica leži v ravnini", vzporedna: "premica je vzporedna z ravnino (nimata skupne točke)", seka: "premica seka ravnino v eni točki", mimo: "premica in ravnina sta mimobežni" };
const MIMO_WHY = "Mimobežni sta lahko le dve premici. Premica, ki z ravnino nima skupne točke, je z njo vzporedna.";
const ELL = [[5, 3, 4], [5, 4, 3], [10, 6, 8], [10, 8, 6], [13, 5, 12], [13, 12, 5], [15, 9, 12], [15, 12, 9], [17, 8, 15], [17, 15, 8]];
const TRIPLES = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10], [8, 15, 17], [15, 8, 17], [9, 12, 15], [12, 9, 15], [7, 24, 25]];

// ================= racionalne neenačbe =================
const REL = { "<": "<", "<=": "\\le", ">": ">", ">=": "\\ge" };
const RELS = ["<", "<=", ">", ">="];
const strictOf = (rel) => rel === "<" || rel === ">";
// Množica rešitev neenačbe f(x) rel 0. crit: [{ x, tex, pole }]; opts.zeroIn / opts.poleIn spremenita
// vključevanje ničel in polov (za tipične napake). Vrne kose (intervale in osamljene točke) in TeX zapis.
function ratSet(crit, f, rel, opts = {}) {
  const pts = [...crit].sort((u, v) => u.x - v.x);
  const pos = rel === ">" || rel === ">=";
  const okv = (v) => (pos ? v > 0 : v < 0);
  const n = pts.length;
  const seg = [];
  for (let i = 0; i <= n; i++) {
    const m = i === 0 ? pts[0].x - 1 : i === n ? pts[n - 1].x + 1 : (pts[i - 1].x + pts[i].x) / 2;
    seg.push(okv(f(m)));
  }
  const zIn = opts.zeroIn ?? !strictOf(rel);
  const pin = pts.map((p) => (p.pole ? !!opts.poleIn : zIn));
  const pieces = [];
  let cur = null;
  for (let i = 0; i <= n; i++) {
    if (seg[i]) {
      if (!cur) cur = { lo: i === 0 ? null : pts[i - 1], loIn: i > 0 && pin[i - 1] };
      if (i === n) {
        pieces.push({ ...cur, hi: null, hiIn: false });
        cur = null;
      } else if (!(pin[i] && seg[i + 1])) {
        pieces.push({ ...cur, hi: pts[i], hiIn: pin[i] });
        cur = null;
      }
    } else if (i < n && pin[i] && !pts[i].pole && !seg[i + 1]) {
      pieces.push({ lo: pts[i], hi: pts[i], loIn: true, hiIn: true, single: true });
    }
  }
  const ivT = (pc) =>
    pc.single ? `\\{${pc.lo.tex}\\}` : `${pc.lo ? (pc.loIn ? "[" : "(") + pc.lo.tex : "(-\\infty"}, ${pc.hi ? pc.hi.tex + (pc.hiIn ? "]" : ")") : "\\infty)"}`;
  return { pieces, tex: pieces.map(ivT).join(" \\cup ") || "\\emptyset" };
}
// Cela števila v omejenem kosu.
function intsIn(pc) {
  if (!pc || !pc.lo || !pc.hi) return null;
  const out = [];
  for (let k = Math.ceil(pc.lo.x); k <= Math.floor(pc.hi.x); k++) {
    if (k === pc.lo.x && !pc.loIn) continue;
    if (k === pc.hi.x && !pc.hiIn) continue;
    out.push(k);
  }
  return out;
}
const bounded = (s) => s.pieces.find((pc) => pc.lo && pc.hi && !pc.single);
const listInts = (ks) => (ks.length === 0 ? "ni celih števil" : ks.length <= 10 ? `$${ks.join(", ")}$` : `od $${ks[0]}$ do $${ks[ks.length - 1]}$`);
const ZERO_RULE = (rel) => (strictOf(rel) ? "neenačba je stroga, zato ničel ne vključimo" : "neenačba je nestroga, zato ničle vključimo");
const RAT_FORMULA = ["\\text{ničle števca in poli razdelijo os na intervale}", "\\text{na vsakem intervalu je predznak stalen (testno število)}"];

// ================= krožne funkcije =================
const SQ = (k) => `\\frac{\\sqrt{${k}}}{2}`;
const SIN_V = [[0, "0"], [0.5, "\\frac{1}{2}"], [-0.5, "-\\frac{1}{2}"], [Math.SQRT1_2, SQ(2)], [-Math.SQRT1_2, `-${SQ(2)}`], [Math.sqrt(3) / 2, SQ(3)], [-Math.sqrt(3) / 2, `-${SQ(3)}`], [1, "1"], [-1, "-1"]];
const TAN_V = [[0, "0"], [Math.sqrt(3) / 3, "\\frac{\\sqrt{3}}{3}"], [-Math.sqrt(3) / 3, "-\\frac{\\sqrt{3}}{3}"], [1, "1"], [-1, "-1"], [Math.sqrt(3), "\\sqrt{3}"], [-Math.sqrt(3), "-\\sqrt{3}"]];
const ARC = { arcsin: Math.asin, arccos: Math.acos, arctan: Math.atan };
const ARC_RANGE = { arcsin: "[-90^\\circ, 90^\\circ]", arccos: "[0^\\circ, 180^\\circ]", arctan: "(-90^\\circ, 90^\\circ)" };
const ARC_RANGE_PI = { arcsin: "\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]", arccos: "[0, \\pi]", arctan: "\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)" };
const FN_OF = { arcsin: "sin", arccos: "cos", arctan: "tan" };
const FN_WORD = { arcsin: "sinus", arccos: "kosinus", arctan: "tangens" };
// Natančna vrednost krožne funkcije v stopinjah in tipične napake (stopinje).
function arcDeg(fn, v) {
  const th = Math.round(ARC[fn](v) * RAD);
  const ms = [];
  if (fn === "arcsin") {
    if (v < 0) ms.push({ value: 360 + th, why: `Kot $${360 + th}^\\circ$ ima res tak sinus, a zaloga vrednosti arkus sinusa je $[-90^\\circ, 90^\\circ]$.` });
    ms.push({ value: 90 - th, why: "To je arkus kosinus tega števila. Pri arkus sinusu iščeš kot z danim sinusom." });
  } else if (fn === "arccos") {
    if (v < 0) ms.push({ value: -(180 - th), why: "Arkus kosinus ni lih: $\\arccos(-x) = 180^\\circ - \\arccos x$, rezultat je med $0^\\circ$ in $180^\\circ$." });
    ms.push({ value: 90 - th, why: "To je arkus sinus tega števila. Pri arkus kosinusu iščeš kot z danim kosinusom." });
  } else {
    if (v < 0) ms.push({ value: 180 + th, why: `Kot $${180 + th}^\\circ$ ima res tak tangens, a zaloga vrednosti arkus tangensa je $(-90^\\circ, 90^\\circ)$.` });
    if (v !== 0) ms.push({ value: sgn(th) * (90 - Math.abs(th)), why: "Si zamenjal tangens in kotangens? Iščeš kot, katerega tangens je dano število." });
  }
  return { th, ms };
}

// ================= stožnice =================
const shiftTex = (p, x0, v = "x") => `${p}${x0 === 0 ? v : `(${xm(x0, v)})`}`;

const GENS = [
  // ================= premice in ravnine v prostoru =================
  {
    id: P + "premice-ravnine",
    topics: [T("premice-in-ravnine-v-prostoru")],
    gen(level, r) {
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const c = linePair(r, (rr) => {
            const [a1, b1] = rr.pick(FACE_LINES);
            const [a2, b2] = rr.pick(FACE_LINES);
            return { l1: mkL(a1, b1), l2: mkL(a2, b2), pts: CUBE, intro: CUBE_TXT };
          });
          if (!c) return null;
          return lineChoice(r, c, "Poišči ploskev ali diagonalni prerez, v katerem leži prva premica, in preveri, ali leži v njem tudi druga.");
        }
        if (t === 1) {
          const a = r.int(3, 12);
          const b = r.int(3, 12);
          const c = r.int(3, 12);
          const [face, diag, top, bot, projN, pv] = r.pick([
            ["ABFE", "AF", "F", "B", "AB", a],
            ["BCGF", "BG", "G", "C", "BC", b],
            ["ADHE", "AH", "H", "D", "AD", b],
          ]);
          const phi = Math.atan(c / pv) * RAD;
          return {
            text: `Kvader $ABCDEFGH$ (oglišča $E$, $F$, $G$, $H$ ležijo po vrsti nad $A$, $B$, $C$, $D$) ima osnovno ploskev $ABCD$ z robovoma $|AB| = ${cm(a)}$ in $|BC| = ${cm(b)}$ ter višino $|AE| = ${cm(c)}$. Izračunaj kot med diagonalo $${diag}$ stranske ploskve $${face}$ in osnovno ploskvijo $ABCD$. Rezultat v stopinjah zaokroži na desetinko.`,
            answer: num(phi, 1, [
              { value: 90 - phi, why: "Si izračunal kot med diagonalo in navpičnim robom? Kot med premico in ravnino meriš od projekcije v ravnini." },
              { value: c < pv ? Math.asin(c / pv) * RAD : NaN, why: "Rob v osnovni ploskvi je kateta, ne hipotenuza: uporabi tangens." },
              { value: phi * DEG, why: "To je kot v radianih. Nastavi kalkulator na stopinje." },
            ]),
            hint: `Poišči pravokotno projekcijo točke $${top}$ na osnovno ploskev in nariši pravokotni trikotnik.`,
            data: { given: [`|AB| = ${cm(a)}`, `|BC| = ${cm(b)}`, `|AE| = ${cm(c)}`], find: ["\\varphi"] },
            formula: "\\tan\\varphi = \\dfrac{v}{p}",
            solution: `Pravokotna projekcija točke $${top}$ na $ABCD$ je $${bot}$, zato je projekcija diagonale $${diag}$ rob $${projN}$ dolžine $${cm(pv)}$.\nRazdalja krajišča $${top}$ od osnovne ploskve je višina $${cm(c)}$.\n$\\tan\\varphi = \\dfrac{${c}}{${pv}} ${ap(c / pv, 4)} ${txr(c / pv, 4)}$\n$\\varphi ${ap(phi, 1)} ${dg(phi)}$`,
          };
        }
        const ctx = r.pick([
          { t: (l, f) => `Lestev dolžine $${tx(l)}\\ \\mathrm{m}$ je prislonjena na steno in s tlemi oklepa kot $${f}^\\circ$. Kako dolga je pravokotna projekcija lestve na tla?`, u: "m", ls: [3, 3.5, 4, 4.5, 5, 6], fs: [60, 80], d: 2, rnd: "Rezultat v metrih zaokroži na centimeter" },
          { t: (l, f) => `Klančina za invalidske vozičke je dolga $${tx(l)}\\ \\mathrm{m}$ in z vodoravnimi tlemi oklepa kot $${f}^\\circ$. Kako dolga je njena pravokotna projekcija na tla?`, u: "m", ls: [4, 5, 6, 8, 10, 12], fs: [3, 8], d: 2, rnd: "Rezultat v metrih zaokroži na centimeter" },
          { t: (l, f) => `Smučarska palica dolžine $${tx(l)}\\ \\mathrm{cm}$ je zapičena v ravno snežno površino in z njo oklepa kot $${f}^\\circ$. Kako dolga je pravokotna projekcija palice na sneg?`, u: "cm", ls: [110, 115, 120, 125, 130, 135], fs: [50, 80], d: 1, rnd: "Rezultat v centimetrih zaokroži na desetinko" },
          { t: (l, f) => `Vrvica zmaja je dolga $${tx(l)}\\ \\mathrm{m}$ in je napeta naravnost. Z vodoravnimi tlemi oklepa kot $${f}^\\circ$. Kako dolga je pravokotna projekcija vrvice na tla?`, u: "m", ls: [20, 25, 30, 40, 50], fs: [25, 65], d: 2, rnd: "Rezultat v metrih zaokroži na centimeter" },
        ]);
        const l = r.pick(ctx.ls);
        const f = r.int(ctx.fs[0], ctx.fs[1]);
        const p = l * Math.cos(f * DEG);
        return {
          text: `${ctx.t(l, f)} ${ctx.rnd}.`,
          answer: num(p, ctx.d, [
            { value: l * Math.sin(f * DEG), why: "To je višina krajišča nad tlemi. Projekcija leži ob kotu, zato potrebuješ kosinus." },
            { value: l / Math.cos(f * DEG), why: "Projekcija ni nikoli daljša od daljice: množi s kosinusom, ne deli z njim." },
            { value: l * Math.tan(f * DEG), why: "Daljica je hipotenuza pravokotnega trikotnika: projekcija je $l\\cos\\varphi$." },
          ], ctx.u),
          hint: "Daljica, njena projekcija in navpična razdalja krajišča tvorijo pravokotni trikotnik. Kateri stranici je kot priležen?",
          data: { given: [`l = ${tx(l)}\\ \\mathrm{${ctx.u}}`, `\\varphi = ${f}^\\circ`], find: ["p"] },
          formula: "p = l\\cos\\varphi",
          solution: `Projekcija je kateta ob kotu $\\varphi$, daljica je hipotenuza.\n$p = ${tx(l)} \\cdot \\cos ${f}^\\circ ${ap(p, ctx.d)} ${tx(p, ctx.d)}\\ \\mathrm{${ctx.u}}$`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const [obj, u, rng] = r.pick([
            ["Akvarij", "cm", [20, 80]],
            ["Škatla za čevlje", "cm", [10, 40]],
            ["Zabojnik za les", "dm", [5, 20]],
            ["Kartonska škatla za selitev", "cm", [30, 70]],
          ]);
          const a = r.int(rng[0], rng[1]);
          const b = r.int(rng[0], rng[1]);
          const c = r.int(rng[0], rng[1]);
          const d = Math.hypot(a, b);
          const phi = Math.atan(c / d) * RAD;
          const U = `\\ \\mathrm{${u}}`;
          return {
            text: `${obj} ima obliko kvadra z dolžino $${a}${U}$, širino $${b}${U}$ in višino $${c}${U}$. Pod kakšnim kotom je telesna diagonala nagnjena proti dnu? Rezultat v stopinjah zaokroži na desetinko.`,
            answer: num(phi, 1, [
              { value: Math.atan(c / Math.max(a, b)) * RAD, why: "Projekcija telesne diagonale na dno ni rob, ampak diagonala dna." },
              { value: 90 - phi, why: "To je kot z navpičnim robom. Kot z ravnino dna meriš od projekcije v dnu." },
              { value: c < d ? Math.asin(c / d) * RAD : NaN, why: "Diagonala dna je kateta, ne hipotenuza: $\\tan\\varphi = \\dfrac{c}{d}$." },
            ]),
            hint: "Kam pade pravokotna projekcija zgornjega krajišča telesne diagonale? Poveži jo s spodnjim krajiščem.",
            data: { given: [`a = ${a}${U}`, `b = ${b}${U}`, `c = ${c}${U}`], find: ["\\varphi"] },
            formula: ["d = \\sqrt{a^2 + b^2}", "\\tan\\varphi = \\dfrac{c}{d}"],
            solution: `Projekcija telesne diagonale na dno je diagonala dna.\n$d = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a + b * b}} ${ap(d, 3)} ${txr(d, 3)}${U}$\n$\\tan\\varphi = \\dfrac{${c}}{${txr(d, 3)}} \\approx ${txr(c / d, 4)}$\n$\\varphi \\approx ${dg(phi)}$`,
          };
        }
        if (t === 1) {
          const want = r.pick(["leži", "vzporedna", "seka"]);
          let l = null;
          let plN = null;
          for (let i = 0; i < 400; i++) {
            const [a, b] = r.pick(PAIRS);
            const pN = r.pick(PLANES);
            const cand = mkL(a, b);
            if (planeRel(cand, planeOf(pN)) === want) {
              l = cand;
              plN = pN;
              break;
            }
          }
          if (!l) return null;
          const pl = planeOf(plN);
          const out = [l.a, l.b].find((k) => !inPlane(CUBE[k], pl));
          const lines = [];
          const why = {};
          if (want === "leži") {
            lines.push(`Točki $${l.a}$ in $${l.b}$ sta obe oglišči ravnine $${plN}$.`, "Če v ravnini ležita dve točki premice, leži v njej vsa premica.");
            why.vzporedna = `Točki $${l.a}$ in $${l.b}$ ležita v ravnini, zato premica z njo ni brez skupnih točk.`;
            why.seka = `Premica ima z ravnino dve skupni točki, $${l.a}$ in $${l.b}$, zato v njej leži vsa.`;
          } else if (want === "vzporedna") {
            const pv = PAIRS.find(([u, w]) => plN.includes(u) && plN.includes(w) && isZ(cross(sub3(CUBE[w], CUBE[u]), sub3(l.q, l.p))));
            lines.push(`Točki $${l.a}$ in $${l.b}$ ne ležita v ravnini $${plN}$.`);
            lines.push(pv ? `Premica $${l.n}$ je vzporedna s premico $${pv[0]}${pv[1]}$, ki leži v ravnini, zato z ravnino nima skupne točke.` : "Obe krajišči sta enako oddaljeni od ravnine, zato premica z ravnino nima skupne točke.");
            why.leži = `Točka $${out}$ ne leži v ravnini $${plN}$.`;
            why.seka = pv ? `Premica je vzporedna s premico $${pv[0]}${pv[1]}$ v ravnini, zato ravnine ne seka.` : "Premica z ravnino nima nobene skupne točke.";
          } else {
            const d = sub3(l.q, l.p);
            const tt = dot(sub3(pl.A0, l.p), pl.n) / dot(d, pl.n);
            const S = l.p.map((v, i) => v + tt * d[i]);
            const sN = nameAt(S, CUBE);
            const sa = dot(sub3(l.p, pl.A0), pl.n);
            const sb = dot(sub3(l.q, pl.A0), pl.n);
            if (sN) lines.push(`Premica in ravnina imata skupno točko $${sN}$.`, `Točka $${out}$ ne leži v ravnini, zato premica ne leži v njej, ampak jo seka.`);
            else if (sa * sb < 0) lines.push(`Točki $${l.a}$ in $${l.b}$ ležita na različnih straneh ravnine $${plN}$.`, "Daljica zato prebode ravnino: premica jo seka v eni točki.");
            else lines.push(`Nobena od točk $${l.a}$, $${l.b}$ ne leži v ravnini $${plN}$, a sta od nje različno oddaljeni.`, `Premica zato ni vzporedna z ravnino in jo seka na podaljšku daljice $${l.n}$.`);
            why.leži = `Točka $${out}$ ne leži v ravnini $${plN}$.`;
            why.vzporedna = sN ? `Premica ima z ravnino skupno točko $${sN}$, zato ni vzporedna z njo.` : "Krajišči sta od ravnine različno oddaljeni, zato premica ni vzporedna z ravnino.";
          }
          why.mimo = MIMO_WHY;
          const wrongs = ["leži", "vzporedna", "seka", "mimo"].filter((k) => k !== want).map((k) => [PL_OPT[k], why[k]]);
          return {
            text: `${CUBE_TXT} Kakšna je lega premice $${l.n}$ glede na ravnino $${plN}$?`,
            answer: pickAns(r, PL_OPT[want], wrongs),
            hint: "Preveri, ali krajišči premice ležita v ravnini. Če ne, primerjaj njuni oddaljenosti od ravnine.",
            data: { given: [`p = ${l.n}`, `\\Pi = ${plN}`], find: ["\\text{lega premice in ravnine}"] },
            formula: ["\\text{dve točki v ravnini} \\Rightarrow \\text{premica leži v ravnini}", "\\text{vzporedna s premico v ravnini} \\Rightarrow \\text{vzporedna z ravnino}"],
            solution: lines.join("\n"),
          };
        }
        const h1 = r.int(2, 8);
        const dh = r.int(1, 6);
        const h2 = h1 + dh;
        const p0 = r.int(4, 20);
        const l = roundHalfUp(Math.hypot(p0, dh), 1);
        const p = Math.sqrt(l * l - dh * dh);
        const [what, poles] = r.pick([
          ["jeklenica", "dveh navpičnih drogov"],
          ["žica za razsvetljavo", "dveh navpičnih stebrov"],
          ["vrv za zastavice", "dveh navpičnih jamborov"],
        ]);
        return {
          text: `Med vrhovoma ${poles}, visokih $${h1}\\ \\mathrm{m}$ in $${h2}\\ \\mathrm{m}$, je napeta ravna ${what} dolžine $${tx(l)}\\ \\mathrm{m}$. Kolikšna je njena pravokotna projekcija na vodoravna tla, torej razdalja med podnožjema? Rezultat v metrih zaokroži na centimeter.`,
          answer: num(p, 2, [
            { value: Math.sqrt(l * l - h2 * h2), why: "Navpična kateta je razlika višin $h_2 - h_1$, ne višina višjega droga." },
            { value: l - dh, why: "Dolžin ne smeš kar odšteti: daljica, projekcija in višinska razlika tvorijo pravokotni trikotnik." },
            { value: Math.hypot(l, dh), why: "Daljica je hipotenuza, zato je projekcija krajša od nje: kvadrata odštej." },
          ], "m"),
          hint: "Skozi nižje krajišče potegni vodoravno daljico do višjega droga. Kateri pravokotni trikotnik dobiš?",
          data: { given: [`h_1 = ${h1}\\ \\mathrm{m}`, `h_2 = ${h2}\\ \\mathrm{m}`, `l = ${tx(l)}\\ \\mathrm{m}`], find: ["p"] },
          formula: "l^2 = p^2 + v^2",
          solution: `Višinska razlika krajišč: $v = ${h2} - ${h1} = ${dh}\\ \\mathrm{m}$\nDaljica je hipotenuza, projekcija in višinska razlika sta kateti.\n$p = \\sqrt{${tx(l)}^2 - ${dh}^2} = \\sqrt{${tx(roundHalfUp(l * l - dh * dh, 4))}} ${ap(p, 2)} ${tx(p, 2)}\\ \\mathrm{m}$`,
        };
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        const a = r.int(3, 12);
        const b = r.int(3, 12);
        const f = r.int(25, 65);
        const d = Math.hypot(a, b);
        const c = d * Math.tan(f * DEG);
        const V = a * b * c;
        return {
          text: `Osnovna ploskev kvadra je pravokotnik s stranicama $${cm(a)}$ in $${cm(b)}$. Telesna diagonala kvadra oklepa z osnovno ploskvijo kot $${f}^\\circ$. Izračunaj prostornino kvadra. Zaokroži na desetinko.`,
          answer: num(V, 1, [
            { value: a * b * Math.max(a, b) * Math.tan(f * DEG), why: "Projekcija telesne diagonale na osnovno ploskev je diagonala pravokotnika, ne njegova stranica." },
            { value: a * b * d * Math.sin(f * DEG), why: "Diagonala osnovne ploskve je kateta, ne hipotenuza: višina je $d\\tan\\varphi$." },
            { value: (a * b * d) / Math.tan(f * DEG), why: "Si zamenjal kateti? Višina leži nasproti kota $\\varphi$." },
          ], "cm³"),
          hint: "Najprej poišči projekcijo telesne diagonale na osnovno ploskev, nato iz pravokotnega trikotnika višino.",
          data: { given: [`a = ${cm(a)}`, `b = ${cm(b)}`, `\\varphi = ${f}^\\circ`], find: ["V"] },
          formula: ["d = \\sqrt{a^2 + b^2}", "c = d\\tan\\varphi", "V = a\\,b\\,c"],
          solution: `Projekcija telesne diagonale je diagonala osnovne ploskve: $d = \\sqrt{${a}^2 + ${b}^2} ${ap(d, 3)} ${txr(d, 3)}\\ \\mathrm{cm}$\nVišina leži nasproti kota: $c = d\\tan ${f}^\\circ \\approx ${txr(c, 3)}\\ \\mathrm{cm}$\n$V = ${a} \\cdot ${b} \\cdot ${txr(c, 3)} ${ap(V, 1)} ${tx(V, 1)}\\ \\mathrm{cm^3}$`,
        };
      }
      if (t === 1) {
        const a = r.int(3, 12);
        const b = r.int(3, 12);
        const c = r.int(3, 12);
        const [face, foot, footN, opp, oppN, adj] = r.pick([
          ["ABFE", "F", "GF", b, "|FG| = |BC|", Math.hypot(a, c)],
          ["ADHE", "H", "GH", a, "|HG| = |AB|", Math.hypot(b, c)],
        ]);
        const projN = `A${foot}`;
        const phi = Math.atan(opp / adj) * RAD;
        const edgeLen = face === "ABFE" ? a : b;
        return {
          text: `Kvader $ABCDEFGH$ (osnovna ploskev $ABCD$, oglišča $E$, $F$, $G$, $H$ po vrsti nad $A$, $B$, $C$, $D$) ima robove $|AB| = ${cm(a)}$, $|BC| = ${cm(b)}$ in $|AE| = ${cm(c)}$. Izračunaj kot med telesno diagonalo $AG$ in stransko ploskvijo $${face}$. Rezultat v stopinjah zaokroži na desetinko.`,
          answer: num(phi, 1, [
            { value: Math.atan(c / Math.hypot(a, b)) * RAD, why: "To je kot z osnovno ploskvijo $ABCD$. Tu iščeš projekcijo na stransko ploskev." },
            { value: 90 - phi, why: "Kot med premico in ravnino meriš med premico in njeno projekcijo, ne med premico in pravokotnico." },
            { value: Math.atan(opp / edgeLen) * RAD, why: `Projekcija diagonale ni rob: točka $G$ se projicira v $${foot}$, zato je projekcija $${projN}$.` },
          ]),
          hint: `Kateri rob kvadra je pravokoten na ploskev $${face}$ in gre skozi $G$? Tako najdeš projekcijo točke $G$.`,
          data: { given: [`|AB| = ${cm(a)}`, `|BC| = ${cm(b)}`, `|AE| = ${cm(c)}`], find: ["\\varphi"] },
          formula: ["\\tan\\varphi = \\dfrac{v}{p}"],
          solution: `Rob $${footN}$ je pravokoten na ploskev $${face}$, zato je pravokotna projekcija točke $G$ točka $${foot}$.\nProjekcija diagonale $AG$ je ploskovna diagonala $${projN} ${ap(adj, 3)} ${txr(adj, 3)}\\ \\mathrm{cm}$.\nRazdalja $G$ od ploskve: $${oppN} = ${cm(opp)}$\n$\\tan\\varphi = \\dfrac{${opp}}{${txr(adj, 3)}} \\approx ${txr(opp / adj, 4)}$, $\\varphi \\approx ${dg(phi)}$`,
        };
      }
      // premice skozi razpolovišča robov
      const c = linePair(r, (rr) => {
        const m1 = rr.pick(MIDS);
        const pat = rr.int(0, 2);
        const pts = { ...CUBE, M: m1.c };
        const offM = VN.filter((k) => !m1.e.includes(k));
        let l1;
        let l2;
        let intro = `${CUBE_TXT} Točka $M$ je razpolovišče roba $${m1.e}$`;
        if (pat === 2) {
          const m2 = rr.pick(MIDS.filter((m) => m.e !== m1.e));
          pts.N = m2.c;
          l1 = mkL("M", "N", pts);
          const [y, z] = rr.pick(PAIRS);
          l2 = mkL(y, z, pts);
          intro += `, točka $N$ pa razpolovišče roba $${m2.e}$.`;
        } else {
          l1 = mkL("M", rr.pick(offM), pts);
          if (pat === 1) {
            const m2 = rr.pick(MIDS.filter((m) => m.e !== m1.e));
            pts.N = m2.c;
            l2 = mkL("N", rr.pick(VN.filter((k) => !m2.e.includes(k))), pts);
            intro += `, točka $N$ pa razpolovišče roba $${m2.e}$.`;
          } else {
            const [y, z] = rr.pick(PAIRS);
            l2 = mkL(y, z, pts);
            intro += ".";
          }
        }
        return { l1, l2, pts, intro };
      });
      if (!c) return null;
      return lineChoice(r, c, "Razpolovišča in oglišča opiši s položajem v kocki. Ali obstaja ravnina, ki vsebuje obe premici?");
    },
  },

  // ================= poševna telesa in vrtenine =================
  {
    id: P + "posevna-telesa-vrtenine",
    topics: [T("posevna-telesa-in-vrtenine")],
    gen(level, r) {
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const O = r.int(12, 80);
          const s = r.int(6, 20);
          const al = r.pick([30, 35, 40, 45, 50, 55, 60, 65, 70, 75]);
          const v = s * Math.sin(al * DEG);
          const V = O * v;
          const intro = r.pick([
            "Poševna prizma ima osnovno ploskev s ploščino",
            "Sklad enakih ploščic, ki ga porinemo vstran, ima obliko poševne prizme. Osnovna ploskev ima ploščino",
            "Steklena vaza ima obliko poševne prizme z osnovno ploskvijo s ploščino",
          ]);
          return {
            text: `${intro} $${O}\\ \\mathrm{cm^2}$. Stranski rob je dolg $${cm(s)}$ in z ravnino osnovne ploskve oklepa kot $${al}^\\circ$. Izračunaj prostornino. Zaokroži na desetinko.`,
            answer: num(V, 1, [
              { value: O * s, why: "Stranski rob ni višina: višina je razdalja med osnovnima ploskvama, $v = s\\sin\\alpha$." },
              { value: O * s * Math.cos(al * DEG), why: "Višina leži nasproti kota $\\alpha$, zato potrebuješ sinus, ne kosinus." },
              { value: V / 3, why: "Prizma ni piramida: tretjina tu ne sodi." },
            ], "cm³"),
            hint: "Najprej izračunaj višino iz pravokotnega trikotnika, ki ga tvorijo stranski rob, višina in projekcija roba.",
            data: { given: [`O = ${O}\\ \\mathrm{cm^2}`, `s = ${cm(s)}`, `\\alpha = ${al}^\\circ`], find: ["V"] },
            formula: ["v = s\\sin\\alpha", "V = O\\,v"],
            solution: `Višina: $v = ${s} \\cdot \\sin ${al}^\\circ ${ap(v, 3)} ${txr(v, 3)}\\ \\mathrm{cm}$\n$V = O\\,v = ${O} \\cdot ${txr(v, 3)} ${ap(V, 1)} ${tx(V, 1)}\\ \\mathrm{cm^3}$`,
          };
        }
        if (t === 1) {
          const rr = r.int(2, 9);
          const s = r.int(5, 25);
          const al = r.pick([30, 40, 45, 50, 60, 65, 70, 75, 80]);
          const v = s * Math.sin(al * DEG);
          const V = Math.PI * rr * rr * v;
          const intro = r.pick(["Poševni valj ima polmer osnovne ploskve", "Nagnjen stolpič kovancev ima obliko poševnega valja s polmerom osnovne ploskve", "Nagnjen sklad okroglih podstavkov za kozarce ima obliko poševnega valja s polmerom osnovne ploskve"]);
          return {
            text: `${intro} $${cm(rr)}$. Tvorilka je dolga $${cm(s)}$ in z osnovno ploskvijo oklepa kot $${al}^\\circ$. Izračunaj prostornino. Zaokroži na desetinko.`,
            answer: num(V, 1, [
              { value: Math.PI * rr * rr * s, why: "Tvorilka ni višina, ker je valj poševen: $v = s\\sin\\alpha$." },
              { value: Math.PI * rr * rr * s * Math.cos(al * DEG), why: "Višina leži nasproti kota $\\alpha$, zato potrebuješ sinus." },
              { value: 2 * Math.PI * rr * v, why: "Ploščina osnovne ploskve je $\\pi r^2$, ne obseg $2\\pi r$." },
            ], "cm³"),
            hint: "Po Cavalierijevem načelu ima poševni valj enako prostornino kot pokončni valj z enako osnovno ploskvijo in višino.",
            data: { given: [`r = ${cm(rr)}`, `s = ${cm(s)}`, `\\alpha = ${al}^\\circ`], find: ["V"] },
            formula: ["v = s\\sin\\alpha", "V = \\pi r^2 v"],
            solution: `Višina: $v = ${s} \\cdot \\sin ${al}^\\circ ${ap(v, 3)} ${txr(v, 3)}\\ \\mathrm{cm}$\n$V = \\pi \\cdot ${rr}^2 \\cdot ${txr(v, 3)} ${ap(V, 1)} ${tx(V, 1)}\\ \\mathrm{cm^3}$`,
          };
        }
        const a = r.int(2, 12);
        let b = r.int(2, 12);
        if (b === a) b = a + 1;
        const V = Math.PI * b * b * a;
        return {
          text: `Pravokotnik s stranicama $${cm(a)}$ in $${cm(b)}$ zavrtimo okoli stranice dolžine $${cm(a)}$. Izračunaj prostornino nastale vrtenine. Zaokroži na desetinko.`,
          answer: num(V, 1, [
            { value: Math.PI * a * a * b, why: "Stranica na osi je višina valja; polmer je druga stranica, ki je pravokotna na os." },
            { value: V / 3, why: "Vrtenina pravokotnika je valj, ne stožec: tretjina ne sodi." },
            { value: 2 * Math.PI * b * a, why: "To je ploščina plašča. Prostornina valja je $\\pi r^2 v$." },
          ], "cm³"),
          hint: "Katera stranica leži na osi in katera opiše krog? Tako dobiš višino in polmer valja.",
          data: { given: [`a = ${cm(a)} \\text{ (os)}`, `b = ${cm(b)}`], find: ["V"] },
          formula: "V = \\pi r^2 v",
          solution: `Nastane valj: višina je stranica na osi, $v = ${cm(a)}$, polmer je druga stranica, $r = ${cm(b)}$.\n$V = \\pi \\cdot ${b}^2 \\cdot ${a} = ${b * b * a}\\pi ${ap(V, 1)} ${tx(V, 1)}\\ \\mathrm{cm^3}$`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const kind = r.int(0, 2);
          const a = r.int(3, 10);
          const b = r.int(3, 10);
          const s = r.int(6, 20);
          const al = r.int(30, 75);
          if (kind === 1 && a === b) return null; // pravokotnik z enakima stranicama je kvadrat
          const O = kind === 0 ? a * a : kind === 1 ? a * b : (a * a * Math.sqrt(3)) / 4;
          const shape = kind === 0 ? `kvadrat s stranico $${cm(a)}$` : kind === 1 ? `pravokotnik s stranicama $${cm(a)}$ in $${cm(b)}$` : `enakostranični trikotnik s stranico $${cm(a)}$`;
          const v = s * Math.sin(al * DEG);
          const V = O * v;
          const Otex = kind === 0 ? `O = ${a}^2 = ${a * a}\\ \\mathrm{cm^2}` : kind === 1 ? `O = ${a} \\cdot ${b} = ${a * b}\\ \\mathrm{cm^2}` : `O = \\dfrac{${a}^2\\sqrt{3}}{4} \\approx ${txr(O, 3)}\\ \\mathrm{cm^2}`;
          return {
            text: `Osnovna ploskev poševne prizme je ${shape}. Stranski rob je dolg $${cm(s)}$ in z ravnino osnovne ploskve oklepa kot $${al}^\\circ$. Izračunaj prostornino prizme. Zaokroži na desetinko.`,
            answer: num(V, 1, [
              { value: O * s, why: "Stranski rob ni višina: pri poševni prizmi je $v = s\\sin\\alpha$." },
              { value: O * s * Math.cos(al * DEG), why: "Višina leži nasproti kota $\\alpha$, zato potrebuješ sinus." },
              kind === 2 ? { value: (a * a * v) / 2, why: "Ploščina enakostraničnega trikotnika je $\\dfrac{a^2\\sqrt{3}}{4}$." } : { value: V / 3, why: "Prizma ni piramida: tretjina tu ne sodi." },
            ], "cm³"),
            hint: "Izračunaj posebej ploščino osnovne ploskve in višino prizme.",
            data: { given: [kind === 1 ? `a = ${cm(a)},\\ b = ${cm(b)}` : `a = ${cm(a)}`, `s = ${cm(s)}`, `\\alpha = ${al}^\\circ`], find: ["V"] },
            formula: ["v = s\\sin\\alpha", "V = O\\,v"],
            solution: `$${Otex}$\n$v = ${s} \\cdot \\sin ${al}^\\circ \\approx ${txr(v, 3)}\\ \\mathrm{cm}$\n$V = O\\,v \\approx ${txr(O, 3)} \\cdot ${txr(v, 3)} ${ap(V, 1)} ${tx(V, 1)}\\ \\mathrm{cm^3}$`,
          };
        }
        if (t === 1) {
          const [p, q, h] = r.pick(TRIPLES);
          const k = r.int(1, 3);
          const a = p * k;
          const b = q * k;
          const c = h * k;
          const askV = r.next() < 0.4;
          if (askV) {
            const V = (Math.PI * b * b * a) / 3;
            return {
              text: `Pravokotni trikotnik s katetama $a = ${cm(a)}$ in $b = ${cm(b)}$ zavrtimo okoli katete $a$. Izračunaj prostornino nastalega stožca. Zaokroži na desetinko.`,
              answer: num(V, 1, [
                { value: (Math.PI * a * a * b) / 3, why: "Kateta na osi je višina; polmer je druga kateta." },
                { value: Math.PI * b * b * a, why: "Prostornina stožca je tretjina prostornine valja: $V = \\dfrac{\\pi r^2 v}{3}$." },
                { value: (Math.PI * b * b * c) / 3, why: "Hipotenuza je stranica stožca, ne višina." },
              ], "cm³"),
              hint: "Kateta na osi postane višina stožca. Kaj postane druga kateta?",
              data: { given: [`a = ${cm(a)} \\text{ (os)}`, `b = ${cm(b)}`], find: ["V"] },
              formula: "V = \\dfrac{\\pi r^2 v}{3}",
              solution: `Nastane stožec z višino $v = a = ${cm(a)}$ in polmerom $r = b = ${cm(b)}$.\n$V = \\dfrac{\\pi \\cdot ${b}^2 \\cdot ${a}}{3} = ${tx((b * b * a) / 3)}\\pi ${ap(V, 1)} ${tx(V, 1)}\\ \\mathrm{cm^3}$`,
            };
          }
          const Pv = Math.PI * b * (b + c);
          return {
            text: `Pravokotni trikotnik s katetama $a = ${cm(a)}$ in $b = ${cm(b)}$ zavrtimo okoli katete $a$. Izračunaj površino nastalega stožca. Zaokroži na desetinko.`,
            answer: num(Pv, 1, [
              { value: Math.PI * b * c, why: "To je le plašč. Površini prištej še osnovno ploskev $\\pi r^2$." },
              { value: Math.PI * b * (b + a), why: "Stranica stožca je hipotenuza, ne kateta na osi." },
              { value: Math.PI * a * (a + c), why: "Polmer je kateta, ki ni na osi: tu je to $b$." },
            ], "cm²"),
            hint: "Določi polmer, višino in stranico stožca. Stranica je hipotenuza trikotnika.",
            data: { given: [`a = ${cm(a)} \\text{ (os)}`, `b = ${cm(b)}`], find: ["P"] },
            formula: ["s = \\sqrt{a^2 + b^2}", "P = \\pi r^2 + \\pi r s"],
            solution: `Nastane stožec: $r = b = ${cm(b)}$, $v = a = ${cm(a)}$.\nStranica stožca je hipotenuza: $s = \\sqrt{${a}^2 + ${b}^2} = ${cm(c)}$\n$P = \\pi \\cdot ${b}^2 + \\pi \\cdot ${b} \\cdot ${c} = ${b * b + b * c}\\pi ${ap(Pv, 1)} ${tx(Pv, 1)}\\ \\mathrm{cm^2}$`,
          };
        }
        const a = r.int(2, 12);
        let b = r.int(2, 12);
        if (b === a) b = a + 2;
        const Pv = 2 * Math.PI * b * (b + a);
        return {
          text: `Pravokotnik s stranicama $${cm(a)}$ in $${cm(b)}$ se vrti okoli stranice dolžine $${cm(a)}$. Izračunaj površino nastale vrtenine. Zaokroži na desetinko.`,
          answer: num(Pv, 1, [
            { value: 2 * Math.PI * b * a, why: "To je le plašč. Valj ima še dve osnovni ploskvi." },
            { value: 2 * Math.PI * a * (a + b), why: "Polmer je stranica, pravokotna na os, ne stranica na osi." },
            { value: Math.PI * b * b + 2 * Math.PI * b * a, why: "Valj ima dve osnovni ploskvi: obe stranici, pravokotni na os, opišeta krog." },
          ], "cm²"),
          hint: "Vsaka stranica pravokotnika opiše svoj del površine. Kateri del opiše stranica, vzporedna z osjo?",
          data: { given: [`a = ${cm(a)} \\text{ (os)}`, `b = ${cm(b)}`], find: ["P"] },
          formula: "P = 2\\pi r^2 + 2\\pi r v",
          solution: `Nastane valj z višino $v = ${cm(a)}$ in polmerom $r = ${cm(b)}$.\nStranici, pravokotni na os, dasta osnovni ploskvi, nasprotna stranica pa plašč.\n$P = 2\\pi \\cdot ${b}^2 + 2\\pi \\cdot ${b} \\cdot ${a} = ${2 * b * b + 2 * a * b}\\pi ${ap(Pv, 1)} ${tx(Pv, 1)}\\ \\mathrm{cm^2}$`,
        };
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        const [p, q, h] = r.pick(TRIPLES);
        const k = r.int(1, 2);
        const a = p * k;
        const b = q * k;
        const c = h * k;
        const rr = (a * b) / c;
        if (r.next() < 0.5) {
          const V = (Math.PI * rr * rr * c) / 3;
          return {
            text: `Pravokotni trikotnik s katetama $${cm(a)}$ in $${cm(b)}$ zavrtimo okoli hipotenuze. Izračunaj prostornino nastalega dvojnega stožca. Zaokroži na desetinko.`,
            answer: num(V, 1, [
              { value: (Math.PI * Math.min(a, b) ** 2 * c) / 3, why: "Polmer ni kateta: je višina trikotnika na hipotenuzo, $r = \\dfrac{ab}{c}$." },
              { value: Math.PI * rr * rr * c, why: "Vsak del je stožec: prostornina stožca ima faktor $\\dfrac{1}{3}$." },
              { value: (Math.PI * (c / 2) ** 2 * c) / 3, why: "Polmer ni polovica hipotenuze, ampak višina na hipotenuzo." },
            ], "cm³"),
            hint: "Nastaneta dva stožca s skupno osnovno ploskvijo. Njen polmer je višina trikotnika na hipotenuzo.",
            data: { given: [`a = ${cm(a)}`, `b = ${cm(b)}`], find: ["V"] },
            formula: ["c = \\sqrt{a^2 + b^2}", "r = \\dfrac{a\\,b}{c}", "V = \\dfrac{\\pi r^2 v_1}{3} + \\dfrac{\\pi r^2 v_2}{3} = \\dfrac{\\pi r^2 c}{3}"],
            solution: `Hipotenuza: $c = \\sqrt{${a}^2 + ${b}^2} = ${cm(c)}$\nSkupni polmer je višina na hipotenuzo: $r = \\dfrac{${a} \\cdot ${b}}{${c}} ${ap(rr, 4)} ${txr(rr, 4)}\\ \\mathrm{cm}$\nVišini stožcev se seštejeta v $c$: $V = \\dfrac{\\pi r^2 c}{3} = \\dfrac{\\pi \\cdot ${txr(rr, 4)}^2 \\cdot ${c}}{3} ${ap(V, 1)} ${tx(V, 1)}\\ \\mathrm{cm^3}$`,
          };
        }
        const Pv = Math.PI * rr * (a + b);
        return {
          text: `Pravokotni trikotnik s katetama $${cm(a)}$ in $${cm(b)}$ zavrtimo okoli hipotenuze. Izračunaj površino nastalega dvojnega stožca. Zaokroži na desetinko.`,
          answer: num(Pv, 1, [
            { value: Pv + 2 * Math.PI * rr * rr, why: "Skupna osnovna ploskev je v notranjosti telesa: notranjih ploskev ne štej." },
            { value: Math.PI * rr * c, why: "Stranici stožcev sta kateti trikotnika, ne hipotenuza." },
            { value: Math.PI * Math.min(a, b) * (a + b), why: "Polmer je višina na hipotenuzo, $r = \\dfrac{ab}{c}$, ne kateta." },
          ], "cm²"),
          hint: "Površino sestavljata le plašča obeh stožcev. Stranici plaščev sta kateti, polmer je višina na hipotenuzo.",
          data: { given: [`a = ${cm(a)}`, `b = ${cm(b)}`], find: ["P"] },
          formula: ["r = \\dfrac{a\\,b}{c}", "P = \\pi r a + \\pi r b"],
          solution: `Hipotenuza: $c = \\sqrt{${a}^2 + ${b}^2} = ${cm(c)}$\nPolmer: $r = \\dfrac{${a} \\cdot ${b}}{${c}} ${ap(rr, 4)} ${txr(rr, 4)}\\ \\mathrm{cm}$\nDva plašča s stranicama $${a}$ in $${b}$: $P = \\pi r (${a} + ${b}) ${ap(Pv, 1)} ${tx(Pv, 1)}\\ \\mathrm{cm^2}$`,
        };
      }
      if (t === 1) {
        const [p, q, h] = r.pick(TRIPLES.filter((x) => x[2] <= 17));
        const v = p;
        const dd = q;
        const s = h;
        const c = r.int(2, 10);
        const a = c + dd;
        const vol = r.next() < 0.5;
        if (vol) {
          const V = Math.PI * v * v * c + (Math.PI * v * v * dd) / 3;
          return {
            text: `Pravokotni trapez ima osnovnici $a = ${cm(a)}$ in $c = ${cm(c)}$ ter krak $d = ${cm(v)}$, ki je pravokoten na osnovnici. Trapez zavrtimo okoli daljše osnovnice. Izračunaj prostornino vrtenine. Zaokroži na desetinko.`,
            answer: num(V, 1, [
              { value: Math.PI * v * v * a, why: "Poševni krak opiše plašč stožca, ne valja: del vrtenine je stožec." },
              { value: (Math.PI * v * v * (a + c)) / 2, why: "Formule za ploščino trapeza ne moreš prenesti na vrtenino. Razdeli jo na valj in stožec." },
              { value: Math.PI * v * v * c, why: "Pozabil si stožec, ki ga opiše poševni krak." },
            ], "cm³"),
            hint: "Razdeli trapez z višino na pravokotnik in pravokotni trikotnik. Kaj nastane iz vsakega pri vrtenju?",
            data: { given: [`a = ${cm(a)}`, `c = ${cm(c)}`, `d = ${cm(v)}`], find: ["V"] },
            formula: ["V = \\pi r^2 v_1 + \\dfrac{\\pi r^2 v_2}{3}"],
            solution: `Pravokotnik $${c} \\times ${v}$ da valj z $r = ${cm(v)}$ in višino $${cm(c)}$.\nTrikotnik da stožec z $r = ${cm(v)}$ in višino $${a} - ${c} = ${cm(dd)}$.\n$V = \\pi \\cdot ${v}^2 \\cdot ${c} + \\dfrac{\\pi \\cdot ${v}^2 \\cdot ${dd}}{3} ${ap(V, 1)} ${tx(V, 1)}\\ \\mathrm{cm^3}$`,
          };
        }
        const Pv = Math.PI * v * v + 2 * Math.PI * v * c + Math.PI * v * s;
        return {
          text: `Pravokotni trapez ima osnovnici $a = ${cm(a)}$ in $c = ${cm(c)}$ ter krak $d = ${cm(v)}$, ki je pravokoten na osnovnici. Trapez zavrtimo okoli daljše osnovnice. Izračunaj površino vrtenine. Zaokroži na desetinko.`,
          answer: num(Pv, 1, [
            { value: Pv - Math.PI * v * v, why: "Pravokotni krak opiše krog: to je osnovna ploskev valja in spada v površino." },
            { value: Pv + Math.PI * v * v, why: "Krog med valjem in stožcem je v notranjosti telesa: notranjih ploskev ne štej." },
            { value: Math.PI * v * v + 2 * Math.PI * v * c + Math.PI * v * dd, why: "Stranica stožca je poševni krak, ne razlika osnovnic." },
          ], "cm²"),
          hint: "Vsaka stranica, ki ni na osi, opiše en del površine: krog, plašč valja ali plašč stožca.",
          data: { given: [`a = ${cm(a)}`, `c = ${cm(c)}`, `d = ${cm(v)}`], find: ["P"] },
          formula: ["P = \\pi r^2 + 2\\pi r v + \\pi r s"],
          solution: `Poševni krak: $s = \\sqrt{${v}^2 + (${a} - ${c})^2} = ${cm(s)}$\nKrog iz pravokotnega kraka: $\\pi \\cdot ${v}^2$, plašč valja: $2\\pi \\cdot ${v} \\cdot ${c}$, plašč stožca: $\\pi \\cdot ${v} \\cdot ${s}$\n$P = ${v * v + 2 * v * c + v * s}\\pi ${ap(Pv, 1)} ${tx(Pv, 1)}\\ \\mathrm{cm^2}$`,
        };
      }
      const rr = r.int(3, 8);
      const s = r.int(10, 25);
      const al0 = r.int(25, 75);
      const V = roundHalfUp(Math.PI * rr * rr * s * Math.sin(al0 * DEG), 1);
      const sn = V / (Math.PI * rr * rr * s);
      const al = Math.asin(sn) * RAD;
      const nm = name(r);
      return {
        text: `${nm} je ${g(nm, "izmeril", "izmerila")} poševni valj s polmerom osnovne ploskve $${cm(rr)}$ in tvorilko $${cm(s)}$. Prostornina valja je $${tx(V)}\\ \\mathrm{cm^3}$. Pod kakšnim kotom je tvorilka nagnjena proti osnovni ploskvi? Rezultat v stopinjah zaokroži na desetinko.`,
        answer: num(al, 1, [
          { value: 90 - al, why: "Višina leži nasproti kota med tvorilko in osnovno ploskvijo: $v = s\\sin\\alpha$, ne $s\\cos\\alpha$." },
          { value: al * DEG, why: "To je kot v radianih. Nastavi kalkulator na stopinje." },
          { value: V / (rr * rr * s) < 1 ? Math.asin(V / (rr * rr * s)) * RAD : NaN, why: "Ploščina osnovne ploskve je $\\pi r^2$: pozabil si $\\pi$." },
        ]),
        hint: "Iz prostornine najprej izračunaj višino, nato kot iz pravokotnega trikotnika s tvorilko.",
        data: { given: [`r = ${cm(rr)}`, `s = ${cm(s)}`, `V = ${tx(V)}\\ \\mathrm{cm^3}`], find: ["\\alpha"] },
        formula: ["V = \\pi r^2 v", "\\sin\\alpha = \\dfrac{v}{s}"],
        solution: `Višina: $v = \\dfrac{V}{\\pi r^2} = \\dfrac{${tx(V)}}{\\pi \\cdot ${rr}^2} \\approx ${txr(sn * s, 3)}\\ \\mathrm{cm}$\n$\\sin\\alpha = \\dfrac{v}{s} \\approx \\dfrac{${txr(sn * s, 3)}}{${s}} \\approx ${txr(sn, 4)}$\n$\\alpha \\approx ${dg(al)}$`,
      };
    },
  },

  // ================= vektorji v geometriji =================
  {
    id: P + "vektorji-geometrija",
    topics: [T("vektorji-v-geometriji")],
    gen(level, r) {
      if (level === 1) {
        if (r.next() < 0.5) {
          const dim = r.pick([2, 3]);
          const pt = () => Array.from({ length: dim }, () => r.int(-6, 9));
          const A = pt();
          const B = pt();
          const C = pt();
          const j = r.int(0, dim - 1);
          const rem = (((A[j] + B[j] + C[j]) % 3) + 3) % 3;
          C[j] -= rem;
          const sum = A[j] + B[j] + C[j];
          const x = sum / 3;
          const ax = AX[j];
          const ctx = dim === 2 && r.next() < 0.5 ? `Tri postaje za merjenje onesnaženosti zraka stojijo v točkah $A${vt(A)}$, $B${vt(B)}$ in $C${vt(C)}$ (enota km). Servis bodo postavili v težišče trikotnika $ABC$.` : `Trikotnik ima oglišča $A${vt(A)}$, $B${vt(B)}$ in $C${vt(C)}$.`;
          return {
            text: `${ctx} Vpiši $${ax}$-koordinato težišča $T$.`,
            answer: num(x, null, [
              { value: sum, why: "Vsoto koordinat moraš deliti s številom oglišč, s $3$." },
              { value: sum / 2, why: "Težišče ni razpolovišče: povprečje treh oglišč dobiš z deljenjem s $3$." },
              { value: (A[j] + B[j]) / 2, why: "To je razpolovišče stranice $AB$; težišče upošteva vsa tri oglišča." },
            ]),
            hint: "Krajevni vektor težišča je povprečje krajevnih vektorjev oglišč.",
            data: { given: [`A = ${vt(A)}`, `B = ${vt(B)}`, `C = ${vt(C)}`], find: [`${ax}_T`] },
            formula: "\\vec r_T = \\dfrac{\\vec r_A + \\vec r_B + \\vec r_C}{3}",
            solution: `$${ax}_T = \\dfrac{${tx(A[j])} + ${B[j] < 0 ? `(${B[j]})` : B[j]} + ${C[j] < 0 ? `(${C[j]})` : C[j]}}{3}$\n$${ax}_T = \\dfrac{${sum}}{3} = ${tx(x)}$`,
          };
        }
        const k = r.pick([-3, -2, 2, 3, -1]);
        const a = [r.int(-5, 5), r.int(-5, 5), r.int(-5, 5)];
        const j = r.int(0, 2);
        const i = [0, 1, 2].find((q) => q !== j && a[q] !== 0);
        if (i === undefined || a[j] === 0) return null;
        const b = a.map((v) => v * k);
        const inA = r.next() < 0.4;
        const show = (v, hide) => vt(v.map((c, q) => (q === j && hide ? "x" : c)));
        const x = inA ? a[j] : b[j];
        const known = inA ? b[j] : a[j];
        return {
          text: `Vektorja $\\vec a = ${show(a, inA)}$ in $\\vec b = ${show(b, !inA)}$ sta kolinearna. Določi $x$.`,
          answer: num(x, null, [
            { value: -x, why: "Preveri predznak količnika: istoležne komponente imajo enako razmerje, tudi po predznaku." },
            inA ? { value: known * k, why: "Komponente vektorja $\\vec a$ dobiš tako, da komponente $\\vec b$ deliš s $k$, ne množiš." } : { value: known / k, why: "Komponente vektorja $\\vec b$ dobiš tako, da komponente $\\vec a$ pomnožiš s $k$, ne deliš." },
            { value: k, why: "To je faktor $k$. Z njim izračunaj še manjkajočo komponento." },
          ]),
          hint: "Iz komponent, ki jih poznaš v obeh vektorjih, izračunaj faktor $k$ v $\\vec b = k\\vec a$.",
          data: { given: [`\\vec a = ${show(a, inA)}`, `\\vec b = ${show(b, !inA)}`], find: ["x"] },
          formula: "\\vec b = k\\,\\vec a",
          solution: `Kolinearna vektorja: $\\vec b = k\\vec a$.\nIz ${i + 1}. komponente: $k = \\dfrac{${b[i]}}{${a[i]}} = ${k}$\n${inA ? `$x = \\dfrac{${b[j]}}{${k}} = ${a[j]}$` : `$x = ${k} \\cdot ${a[j] < 0 ? `(${a[j]})` : a[j]} = ${b[j]}$`}`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const [m, n] = r.pick([[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2], [1, 4], [3, 4], [4, 1], [2, 5]]);
          const A = [r.int(-6, 6), r.int(-6, 6), r.int(-6, 6)];
          const w = [r.int(-3, 3), r.int(-3, 3), r.int(-3, 3)];
          const j = r.int(0, 2);
          if (w[j] === 0) w[j] = r.pick([-2, -1, 1, 2]);
          const B = A.map((v, i) => v + (m + n) * w[i]);
          const D = A.map((v, i) => v + m * w[i]);
          const ax = AX[j];
          return {
            text: `Točka $D$ leži na daljici $AB$ z $A${vt(A)}$ in $B${vt(B)}$ tako, da je $AD : DB = ${m} : ${n}$. Vpiši $${ax}$-koordinato točke $D$.`,
            answer: num(D[j], null, [
              { value: A[j] + n * w[j], why: `Točka $D$ je od $A$ oddaljena $\\frac{${m}}{${m + n}}$ daljice: pri $AD : DB = m : n$ ima $\\vec r_B$ utež $m$.` },
              { value: A[j] + ((B[j] - A[j]) * m) / n, why: `Del poti od $A$ do $D$ je $\\frac{m}{m + n}$, ne $\\frac{m}{n}$.` },
              { value: (A[j] + B[j]) / 2, why: "To je razpolovišče; $D$ deli daljico v drugem razmerju." },
            ]),
            hint: `Delilno razmerje $AD : DB = ${m} : ${n}$ pomeni, da je $\\overrightarrow{AD}$ enak $\\frac{${m}}{${m + n}}$ vektorja $\\overrightarrow{AB}$.`,
            data: { given: [`A = ${vt(A)}`, `B = ${vt(B)}`, `AD : DB = ${m} : ${n}`], find: [`${ax}_D`] },
            formula: "\\vec r_D = \\dfrac{n\\,\\vec r_A + m\\,\\vec r_B}{m + n}",
            solution: `$${ax}_B - ${ax}_A = ${B[j] - A[j]}$\n$${ax}_D = ${A[j]} + \\dfrac{${m}}{${m + n}} \\cdot ${B[j] - A[j] < 0 ? `(${B[j] - A[j]})` : B[j] - A[j]} = ${A[j]} ${sg(m * w[j])}$\n$${ax}_D = ${D[j]}$`,
            zeroOk: true,
          };
        }
        if (t === 1) {
          const a = [r.int(-4, 5), r.int(-4, 5)];
          const b = [r.int(-4, 5), r.int(-4, 5)];
          const det = a[0] * b[1] - a[1] * b[0];
          if (det === 0) return null;
          const al = r.nonZero(-3, 3);
          const be = r.nonZero(-3, 3);
          const c = [al * a[0] + be * b[0], al * a[1] + be * b[1]];
          const askA = r.next() < 0.5;
          const ans = askA ? al : be;
          const sym = askA ? "\\alpha" : "\\beta";
          return {
            text: `Vektor $\\vec c = ${vt(c)}$ zapiši kot linearno kombinacijo $\\vec c = \\alpha\\vec a + \\beta\\vec b$ vektorjev $\\vec a = ${vt(a)}$ in $\\vec b = ${vt(b)}$. Vpiši $${sym}$.`,
            answer: num(ans, null, [
              { value: askA ? be : al, why: `To je koeficient pri $\\vec ${askA ? "b" : "a"}$. Preveri, kateri koeficient iščeš.` },
              { value: -ans, why: "Preveri predznak pri reševanju sistema." },
            ]),
            hint: "Enakost zapiši po komponentah: dobiš sistem dveh enačb za $\\alpha$ in $\\beta$.",
            data: { given: [`\\vec a = ${vt(a)}`, `\\vec b = ${vt(b)}`, `\\vec c = ${vt(c)}`], find: [sym] },
            formula: "\\vec c = \\alpha\\vec a + \\beta\\vec b",
            solution: `Po komponentah: $${comb([[a[0], "\\alpha"], [b[0], "\\beta"]])} = ${c[0]}$ in $${comb([[a[1], "\\alpha"], [b[1], "\\beta"]])} = ${c[1]}$\nRešitev sistema: $\\alpha = ${al}$, $\\beta = ${be}$\nPreizkus: $${al} \\cdot ${vt(a)} ${be < 0 ? "-" : "+"} ${Math.abs(be)} \\cdot ${vt(b)} = ${vt(c)}$`,
          };
        }
        const a = [r.int(-4, 4), r.int(-4, 4), r.int(-4, 4)];
        const b = [r.int(-4, 4), r.int(-4, 4), r.int(-4, 4)];
        if (a[0] * b[1] - a[1] * b[0] === 0) return null;
        const al = r.nonZero(-3, 3);
        const be = r.nonZero(-3, 3);
        const c = [0, 1, 2].map((i) => al * a[i] + be * b[i]);
        const kop = r.next() < 0.5;
        const c3 = c[2];
        if (!kop) c[2] += r.pick([-2, -1, 1, 2]);
        const K = "koplanarni so: $\\vec c$ je linearna kombinacija $\\vec a$ in $\\vec b$";
        const N = "niso koplanarni: $\\vec c$ ni linearna kombinacija $\\vec a$ in $\\vec b$";
        const wrongs = kop
          ? [[N, "Preveri vse tri komponente: $\\vec c = \\alpha\\vec a + \\beta\\vec b$ ima rešitev."], ["niso koplanarni, ker nobena dva vektorja nista vzporedna", "Za koplanarnost ni treba, da sta dva vektorja vzporedna. Dovolj je, da je tretji kombinacija prvih dveh."]]
          : [[K, "Koeficienta iz prvih dveh komponent ne ustrezata tretji komponenti, zato sistem nima rešitve."], ["koplanarni so, saj trije vektorji vedno ležijo v isti ravnini", "To velja le v ravnini. V prostoru trije vektorji lahko kažejo v tri neodvisne smeri."]];
        return {
          text: `Ali so vektorji $\\vec a = ${vt(a)}$, $\\vec b = ${vt(b)}$ in $\\vec c = ${vt(c)}$ koplanarni?`,
          answer: pickAns(r, kop ? K : N, wrongs),
          hint: "Iz prvih dveh komponent enačbe $\\vec c = \\alpha\\vec a + \\beta\\vec b$ izračunaj $\\alpha$ in $\\beta$, nato preveri tretjo komponento.",
          data: { given: [`\\vec a = ${vt(a)}`, `\\vec b = ${vt(b)}`, `\\vec c = ${vt(c)}`], find: ["\\text{ali so koplanarni}"] },
          formula: "\\vec c = \\alpha\\vec a + \\beta\\vec b",
          solution: `Prvi dve komponenti: $${comb([[a[0], "\\alpha"], [b[0], "\\beta"]])} = ${c[0]}$, $${comb([[a[1], "\\alpha"], [b[1], "\\beta"]])} = ${c[1]}$\nRešitev: $\\alpha = ${al}$, $\\beta = ${be}$\nTretja komponenta: $${al} \\cdot ${a[2] < 0 ? `(${a[2]})` : a[2]} ${be < 0 ? "-" : "+"} ${Math.abs(be)} \\cdot ${b[2] < 0 ? `(${b[2]})` : b[2]} = ${c3}$${kop ? ", kar se ujema." : `, $\\vec c$ pa ima $${c[2]}$.`}\n${kop ? "Vektorji so koplanarni." : "Sistem nima rešitve, vektorji niso koplanarni."}`,
        };
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        const a = [r.int(-4, 4), r.int(-4, 4), r.int(-4, 4)];
        const b = [r.int(-4, 4), r.int(-4, 4), r.int(-4, 4)];
        const j = r.int(0, 2);
        const [i1, i2] = [0, 1, 2].filter((q) => q !== j);
        // a[j], b[j] ≠ 0: m je odvisen od obeh koeficientov, napaka s predznakom β se vedno razlikuje od m.
        if (a[i1] * b[i2] - a[i2] * b[i1] === 0 || a[j] === 0 || b[j] === 0) return null;
        const al = r.nonZero(-3, 3);
        const be = r.nonZero(-3, 3);
        const c = [0, 1, 2].map((i) => al * a[i] + be * b[i]);
        const m = c[j];
        const cShow = vt(c.map((v, q) => (q === j ? "m" : v)));
        return {
          text: `Določi število $m$, pri katerem so vektorji $\\vec a = ${vt(a)}$, $\\vec b = ${vt(b)}$ in $\\vec c = ${cShow}$ koplanarni.`,
          answer: num(m, null, [
            { value: be * a[j] + al * b[j], why: "Si zamenjal koeficienta? $\\alpha$ sodi k $\\vec a$, $\\beta$ k $\\vec b$." },
            { value: al * a[j] - be * b[j], why: "Preveri predznak koeficienta $\\beta$." },
            { value: a[j] + b[j], why: "Vektor $\\vec c$ ni nujno vsota $\\vec a + \\vec b$: koeficienta najprej izračunaj iz znanih komponent." },
          ]),
          hint: "Koplanarni pomeni $\\vec c = \\alpha\\vec a + \\beta\\vec b$. Iz komponent brez $m$ izračunaj $\\alpha$ in $\\beta$.",
          data: { given: [`\\vec a = ${vt(a)}`, `\\vec b = ${vt(b)}`, `\\vec c = ${cShow}`], find: ["m"] },
          formula: "\\vec c = \\alpha\\vec a + \\beta\\vec b",
          solution: `${i1 + 1}. in ${i2 + 1}. komponenta: $${comb([[a[i1], "\\alpha"], [b[i1], "\\beta"]])} = ${c[i1]}$, $${comb([[a[i2], "\\alpha"], [b[i2], "\\beta"]])} = ${c[i2]}$\nRešitev sistema: $\\alpha = ${al}$, $\\beta = ${be}$\n${j + 1}. komponenta: $m = ${al} \\cdot ${a[j] < 0 ? `(${a[j]})` : a[j]} ${be < 0 ? "-" : "+"} ${Math.abs(be)} \\cdot ${b[j] < 0 ? `(${b[j]})` : b[j]} = ${m}$`,
        };
      }
      if (t === 1) {
        const [m, n] = r.pick([[1, 1], [1, 3], [3, 1], [2, 1], [1, 4], [2, 3], [3, 2], [3, 4], [4, 3], [2, 5]]);
        const askBD = r.next() < 0.5;
        const tau = ft(m, m + n);
        return {
          text: `V paralelogramu $ABCD$ leži točka $E$ na stranici $BC$ tako, da je $BE : EC = ${m} : ${n}$. Daljica $AE$ seka diagonalo $BD$ v točki $P$. V kakšnem razmerju $P$ deli ${askBD ? "diagonalo $BD$" : "daljico $AE$"}? Vpiši $${askBD ? "BP : PD" : "AP : PE"}$ (npr. 2 : 5).`,
          answer: askBD
            ? frA(m, m + n, [
                { value: m / n, why: "To je razmerje, v katerem $E$ deli stranico $BC$. Točka $P$ deli diagonalo drugače." },
                { value: 1, why: "Diagonali paralelograma se razpolavljata, $AE$ pa ni diagonala." },
              ])
            : frA(m + n, m, [
                { value: n / m, why: "To je obratno razmerje, v katerem $E$ deli $BC$. Razmerje na $AE$ izračunaj s koeficienti." },
                { value: 2, why: "Razmerje $2 : 1$ velja za težišče trikotnika, tu pa $E$ ni nujno razpolovišče." },
                { value: 1, why: "Daljica $AE$ ni diagonala, zato je $P$ ne razpolavlja." },
              ]),
          hint: "Izberi $\\vec a = \\overrightarrow{AB}$, $\\vec b = \\overrightarrow{AD}$ in vektor $\\overrightarrow{AP}$ zapiši na dva načina: po $AE$ in prek $B$ po $BD$.",
          data: { given: [`BE : EC = ${m} : ${n}`], find: [askBD ? "BP : PD" : "AP : PE"] },
          formula: ["\\overrightarrow{AP} = s\\,\\overrightarrow{AE} = \\vec a + t\\,\\overrightarrow{BD}", "\\text{primerjaj koeficiente pri } \\vec a, \\vec b"],
          solution: `$\\overrightarrow{AE} = \\vec a + ${tau}\\vec b$, $\\overrightarrow{BD} = \\vec b - \\vec a$\n$s\\vec a + ${tau}s\\,\\vec b = (1 - t)\\vec a + t\\,\\vec b$\nPrimerjamo koeficiente: $s = 1 - t$ in $${tau}s = t$, zato $s = ${ft(m + n, 2 * m + n)}$, $t = ${ft(m, 2 * m + n)}$\n${askBD ? `$BP : PD = t : (1 - t) = ${m} : ${m + n}$` : `$AP : PE = s : (1 - s) = ${m + n} : ${m}$`}`,
        };
      }
      const [m, n] = r.pick([[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2], [1, 4], [3, 4], [4, 3]]);
      const askC = r.next() < 0.5;
      const [p1, q1] = fr(m + n, m);
      const [p2, q2] = fr(2 * m, n);
      return {
        text: `V trikotniku $ABC$ leži točka $D$ na stranici $AB$ tako, da je $AD : DB = ${m} : ${n}$. Točka $S$ je razpolovišče stranice $BC$. Daljici $CD$ in $AS$ se sekata v točki $P$. Vpiši razmerje $${askC ? "CP : PD" : "AP : PS"}$ (npr. 2 : 5).`,
        answer: askC
          ? frA(m + n, m, [
              { value: 2, why: "Razmerje $2 : 1$ velja za težiščnice. $CD$ je težiščnica le, če je $D$ razpolovišče $AB$." },
              { value: m / n, why: "To je razmerje na stranici $AB$, ne na daljici $CD$." },
              { value: (m + n) / n, why: "Preveri, kateri koeficient pripada $\\overrightarrow{AD}$: $\\overrightarrow{AD} = \\frac{m}{m + n}\\vec a$." },
            ])
          : frA(2 * m, n, [
              { value: 2, why: "Razmerje $2 : 1$ velja za težišče, $P$ pa je težišče le, če je $D$ razpolovišče $AB$." },
              { value: m / n, why: "To je razmerje na stranici $AB$, ne na težiščnici $AS$." },
              { value: 1, why: "Točka $P$ ne razpolavlja daljice $AS$: primerjaj koeficiente." },
            ]),
        hint: "Izberi $\\vec a = \\overrightarrow{AB}$, $\\vec b = \\overrightarrow{AC}$ in vektor $\\overrightarrow{AP}$ zapiši na dva načina.",
        data: { given: [`AD : DB = ${m} : ${n}`], find: [askC ? "CP : PD" : "AP : PS"] },
        formula: ["\\overrightarrow{AP} = s\\,\\overrightarrow{AS} = \\vec b + t\\,\\overrightarrow{CD}", "\\text{primerjaj koeficiente pri } \\vec a, \\vec b"],
        solution: `$\\overrightarrow{AS} = \\frac{1}{2}(\\vec a + \\vec b)$, $\\overrightarrow{AD} = ${ft(m, m + n)}\\vec a$, $\\overrightarrow{CD} = ${ft(m, m + n)}\\vec a - \\vec b$\n$\\frac{s}{2}\\vec a + \\frac{s}{2}\\vec b = ${ft(m, m + n)}t\\,\\vec a + (1 - t)\\vec b$\nPrimerjamo koeficiente: $\\frac{s}{2} = ${ft(m, m + n)}t$ in $\\frac{s}{2} = 1 - t$, zato $t = ${ft(m + n, 2 * m + n)}$, $s = ${ft(2 * m, 2 * m + n)}$\n${askC ? `$CP : PD = t : (1 - t) = ${p1} : ${q1}$` : `$AP : PS = s : (1 - s) = ${p2} : ${q2}$`}`,
      };
    },
  },

  // ================= krožne funkcije =================
  {
    id: P + "krozne-funkcije",
    topics: [T("krozne-funkcije")],
    gen(level, r) {
      if (level === 1) {
        const fn = r.pick(["arcsin", "arccos", "arctan"]);
        const [v, vtx] = r.pick(fn === "arctan" ? TAN_V : SIN_V);
        const { th, ms } = arcDeg(fn, v);
        const call = `\\${fn}\\left(${vtx}\\right)`;
        const why1 = `$\\${FN_OF[fn]} ${aD(th)} = ${vtx}$ in kot $${th}^\\circ$ leži v zalogi vrednosti $${ARC_RANGE[fn]}$.`;
        if (r.next() < 0.5) {
          return {
            text: `Brez računala izračunaj $${call}$. Rezultat zapiši v stopinjah (vpiši samo število).`,
            answer: num(th, null, [...ms, { value: th * DEG, why: "To je vrednost v radianih. Naloga zahteva stopinje." }]),
            hint: `Poišči kot iz zaloge vrednosti $${ARC_RANGE[fn]}$, katerega ${FN_WORD[fn]} je $${vtx}$.`,
            data: { given: [`y = ${call}`], find: ["\\text{kot v stopinjah}"] },
            formula: `y = \\${fn} x \\iff \\${FN_OF[fn]} y = x,\\ y \\in ${ARC_RANGE[fn]}`,
            solution: `Iščemo kot $y \\in ${ARC_RANGE[fn]}$ z $\\${FN_OF[fn]} y = ${vtx}$.\n${why1}\n$${call} = ${th}^\\circ$`,
          };
        }
        return {
          text: `Brez računala izračunaj $${call}$ in rezultat zapiši v obliki $k\\pi$. Vpiši $k$ (ulomek ali celo število).`,
          answer: frA(th, 180, [...ms.map((m) => ({ value: m.value / 180, why: degToPi(m.why) })), { value: th, why: "To je kot v stopinjah. Število $k$ je koeficient pred $\\pi$, kjer je $180^\\circ = \\pi$." }]),
          hint: `Poišči kot iz zaloge vrednosti $${ARC_RANGE_PI[fn]}$, katerega ${FN_WORD[fn]} je $${vtx}$, in ga pretvori v radiane.`,
          data: { given: [`y = ${call}`], find: ["k"] },
          formula: [`y = \\${fn} x \\iff \\${FN_OF[fn]} y = x,\\ y \\in ${ARC_RANGE_PI[fn]}`, "180^\\circ = \\pi"],
          solution: `${why1}\nV radianih: $${th}^\\circ = ${piT(th, 180)}$\n$k = ${ft(th, 180)}$`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0 || t === 2) {
          const fn = r.pick(["arcsin", "arccos", "arctan"]);
          const f = FN_OF[fn];
          const step = t === 2 ? r.pick([30, 45]) : 10;
          const cand = [];
          for (let x = -360; x <= 540; x += step) {
            if (fn === "arcsin" && x >= -90 && x <= 90) continue;
            if (fn === "arccos" && x >= 0 && x <= 180) continue;
            if (fn === "arctan" && ((x > -90 && x < 90) || mod0(x - 90, 180))) continue;
            cand.push(x);
          }
          const x = r.pick(cand);
          const val = fn === "arcsin" ? Math.sin(x * DEG) : fn === "arccos" ? Math.cos(x * DEG) : Math.tan(x * DEG);
          const ans = Math.round(ARC[fn](val) * RAD);
          const rule =
            fn === "arcsin"
              ? mod0(x - ans, 360)
                ? `se kota razlikujeta za večkratnik periode $360^\\circ$`
                : `velja $\\sin(180^\\circ - \\alpha) = \\sin\\alpha$, perioda pa je $360^\\circ$`
              : fn === "arccos"
                ? mod0(x - ans, 360)
                  ? `se kota razlikujeta za večkratnik periode $360^\\circ$`
                  : `je kosinus sod, $\\cos(-\\alpha) = \\cos\\alpha$, perioda pa je $360^\\circ$`
                : `je perioda tangensa $180^\\circ$`;
          const ms = [
            { value: x, why: `Enakost $\\${fn}(\\${f} x) = x$ velja le za $x$ iz zaloge vrednosti $${ARC_RANGE[fn]}$.` },
            { value: -ans, why: fn === "arccos" ? "Arkus kosinus nikoli ni negativen: vrednosti so med $0^\\circ$ in $180^\\circ$." : `Preveri predznak: $\\${f} ${aD(x)}$ je ${val > 0 ? "pozitiven" : "negativen"}.` },
            { value: fn === "arctan" ? 180 - x : 180 - ans, why: `Kot mora imeti isti ${FN_WORD[fn]} kot $${aD(x)}$ in ležati v $${ARC_RANGE[fn]}$.` },
          ];
          const call = `\\${fn}(\\${f} ${t === 2 ? aP(x) : aD(x)})`;
          if (t === 2) {
            return {
              text: `Izračunaj $${call}$. Rezultat zapiši v obliki $k\\pi$ in vpiši $k$ (ulomek ali celo število).`,
              answer: frA(ans, 180, ms.map((m) => ({ value: m.value / 180, why: degToPi(m.why) }))),
              hint: `Poišči kot iz $${ARC_RANGE_PI[fn]}$, ki ima isti ${FN_WORD[fn]} kot $${piT(x, 180)}$.`,
              data: { given: [`y = ${call}`], find: ["k"] },
              formula: [`\\${fn}(\\${f} x) = x \\text{ le za } x \\in ${ARC_RANGE_PI[fn]}`],
              solution: `$${piT(x, 180)}$ ni v $${ARC_RANGE_PI[fn]}$, zato rezultat ni $${piT(x, 180)}$.\n$\\${f} ${aP(x)} = \\${f} ${aP(ans)}$, ker ${degToPi(rule)}.\n$${piT(ans, 180)}$ leži v $${ARC_RANGE_PI[fn]}$, zato je $k = ${ft(ans, 180)}$.`,
            };
          }
          return {
            text: `Izračunaj $${call}$. Rezultat zapiši v stopinjah (vpiši samo število).`,
            answer: num(ans, null, ms),
            hint: `Poišči kot iz $${ARC_RANGE[fn]}$, ki ima isti ${FN_WORD[fn]} kot $${x}^\\circ$.`,
            data: { given: [`y = ${call}`], find: ["\\text{kot v stopinjah}"] },
            formula: `\\${fn}(\\${f} x) = x \\text{ le za } x \\in ${ARC_RANGE[fn]}`,
            solution: `$${x}^\\circ$ ni v $${ARC_RANGE[fn]}$, zato rezultat ni $${x}^\\circ$.\n$\\${f} ${aD(x)} = \\${f} ${aD(ans)}$, ker ${rule}.\n$${ans}^\\circ$ leži v $${ARC_RANGE[fn]}$, zato je rezultat $${ans}^\\circ$.`,
          };
        }
        const fn = r.pick(["arcsin", "arccos"]);
        const a = r.nonZero(-5, 5);
        const b = r.int(-6, 6);
        const left = r.next() < 0.5;
        const lo = a > 0 ? [-1 - b, a] : [1 - b, a];
        const hi = a > 0 ? [1 - b, a] : [-1 - b, a];
        const [n0, d0] = left ? lo : hi;
        const [n1, d1] = left ? hi : lo;
        const inner = le(a, b);
        return {
          text: `Določi definicijsko območje funkcije $f(x) = \\${fn}(${inner})$. Vpiši ${left ? "levo" : "desno"} krajišče intervala (ulomek ali celo število).`,
          answer: frA(n0, d0, [
            { value: n1 / d1, why: a < 0 ? "Pri deljenju z negativnim številom se neenačaja obrneta, zato krajišči zamenjata vlogi." : "To je drugo krajišče intervala." },
            { value: (n0 + 2 * b) / d0, why: `Pri prenašanju $${b}$ na drugo stran spremeni predznak.` },
            { value: -b / a, why: "To je ničla izraza pod arkusom, ne krajišče definicijskega območja." },
          ]),
          hint: `Argument funkcije $\\${fn}$ mora biti med $-1$ in $1$. Zapiši dvojno neenačbo.`,
          data: { given: [`f(x) = \\${fn}(${inner})`], find: ["D_f"] },
          formula: `D_{\\${fn}} = [-1, 1]`,
          solution: `$-1 \\le ${inner} \\le 1$\n$${-1 - b} \\le ${le(a, 0)} \\le ${1 - b}$\n${a < 0 ? `Delimo z $${a}$ in obrnemo neenačaja: ` : a !== 1 ? `Delimo z $${a}$: ` : ""}${a !== 1 ? `$${ft(...lo)} \\le x \\le ${ft(...hi)}$\n` : ""}$D_f = \\left[${ft(...lo)}, ${ft(...hi)}\\right]$`,
        };
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        const [p, q, h] = r.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17], [7, 24, 25]]);
        const inner = r.pick(["arcsin", "arccos", "arctan"]);
        const outer = r.pick(["sin", "cos", "tan"].filter((o) => o !== FN_OF[inner] || o === "tan"));
        if (outer === "tan" && inner === "arctan") return null;
        const sv = r.pick([1, -1]);
        let v;
        let S;
        let Cc;
        let step2;
        if (inner === "arcsin") {
          v = [sv * p, h];
          S = v;
          Cc = [q, h];
          step2 = `Na tem intervalu je $\\cos\\alpha \\ge 0$: $\\cos\\alpha = \\sqrt{1 - \\left(${ft(...v)}\\right)^2} = ${ft(q, h)}$`;
        } else if (inner === "arccos") {
          v = [sv * p, h];
          Cc = v;
          S = [q, h];
          step2 = `Na tem intervalu je $\\sin\\alpha \\ge 0$: $\\sin\\alpha = \\sqrt{1 - \\left(${ft(...v)}\\right)^2} = ${ft(q, h)}$`;
        } else {
          v = [sv * p, q];
          Cc = [q, h];
          S = [sv * p, h];
          step2 = `Na tem intervalu je $\\cos\\alpha > 0$: $\\cos\\alpha = \\dfrac{1}{\\sqrt{1 + \\tan^2\\alpha}} = ${ft(q, h)}$, $\\sin\\alpha = \\tan\\alpha\\cos\\alpha = ${ft(sv * p, h)}$`;
        }
        const res = outer === "sin" ? S : outer === "cos" ? Cc : [S[0] * Cc[1], S[1] * Cc[0]];
        const val = res[0] / res[1];
        const other = outer === "sin" ? Cc[0] / Cc[1] : outer === "cos" ? S[0] / S[1] : (Cc[0] * S[1]) / (Cc[1] * S[0]);
        const expr = `\\${outer}\\left(\\${inner}\\left(${ft(...v)}\\right)\\right)`;
        const rangeT = { arcsin: "\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]", arccos: "[0, \\pi]", arctan: "\\left(-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right)" }[inner];
        return {
          text: `Izračunaj natančno vrednost $${expr}$. Vpiši ulomek.`,
          answer: frA(res[0], res[1], [
            { value: -val, why: `Preveri predznak: kot $\\alpha = \\${inner}\\left(${ft(...v)}\\right)$ leži v $${rangeT}$.` },
            { value: other, why: outer === "tan" ? "Tangens je $\\dfrac{\\sin\\alpha}{\\cos\\alpha}$, ne obratno." : `To je ${outer === "sin" ? "kosinus" : "sinus"} kota $\\alpha$, ne ${outer === "sin" ? "sinus" : "kosinus"}.` },
            { value: v[0] / v[1], why: `$\\${outer}$ in $\\${inner}$ se ne izničita, ker nista obratni funkciji druga drugi.` },
          ]),
          hint: `Označi $\\alpha = \\${inner}\\left(${ft(...v)}\\right)$. Kaj veš o $\\${FN_OF[inner]}\\alpha$ in v katerem intervalu leži $\\alpha$?`,
          data: { given: [`y = ${expr}`], find: ["\\text{natančna vrednost}"] },
          formula: ["\\sin^2\\alpha + \\cos^2\\alpha = 1", "\\tan\\alpha = \\dfrac{\\sin\\alpha}{\\cos\\alpha}"],
          solution: `Naj bo $\\alpha = \\${inner}\\left(${ft(...v)}\\right)$: $\\${FN_OF[inner]}\\alpha = ${ft(...v)}$ in $\\alpha \\in ${rangeT}$.\n${step2}\n${outer === "tan" ? `$\\tan\\alpha = \\dfrac{\\sin\\alpha}{\\cos\\alpha} = \\dfrac{${ft(...S)}}{${ft(...Cc)}}$\n` : ""}$${expr} = ${ft(...res)}$`,
        };
      }
      if (t === 1) {
        const fn = r.pick(["arcsin", "arccos", "arctan"]);
        const TH = {
          arcsin: [[-1, 2, [-1, 1]], [-1, 6, [-1, 2]], [1, 6, [1, 2]], [1, 2, [1, 1]]],
          arccos: [[0, 1, [1, 1]], [1, 3, [1, 2]], [1, 2, [0, 1]], [2, 3, [-1, 2]], [1, 1, [-1, 1]]],
          arctan: [[-1, 4, [-1, 1]], [1, 4, [1, 1]]],
        }[fn];
        const [tn, td, [vn, vd]] = r.pick(TH);
        const a = r.nonZero(-4, 4);
        const b = r.int(-5, 5);
        const inner = le(a, b);
        const xn = vn - b * vd;
        const xd = a * vd;
        const thVal = (tn / td) * Math.PI;
        const other = fn === "arcsin" ? Math.cos(thVal) : fn === "arccos" ? Math.sin(thVal) : Math.abs(Math.tan(thVal)) > 1e6 ? NaN : 1 / Math.tan(thVal);
        return {
          text: `Reši enačbo $\\${fn}(${inner}) = ${piT(tn, td)}$. Vpiši $x$ (ulomek ali celo število).`,
          answer: frA(xn, xd, [
            { value: (thVal - b) / a, why: `Vrednost kota $${piT(tn, td)}$ ni argument: na obeh straneh uporabi $\\${FN_OF[fn]}$, dobiš $${inner} = \\${FN_OF[fn]} ${aP((tn * 180) / td)}$.` },
            { value: (other - b) / a, why: fn === "arctan" ? "Uporabi tangens, ne kotangens." : `Uporabi ${FN_WORD[fn]}, ne ${fn === "arcsin" ? "kosinusa" : "sinusa"}.` },
            { value: (-vn / vd - b) / a, why: `Preveri predznak vrednosti $\\${FN_OF[fn]} ${aP((tn * 180) / td)}$.` },
          ]),
          hint: `Kot $${piT(tn, td)}$ leži v zalogi vrednosti funkcije $\\${fn}$, zato na obeh straneh uporabi $\\${FN_OF[fn]}$.`,
          data: { given: [`\\${fn}(${inner}) = ${piT(tn, td)}`], find: ["x"] },
          formula: `\\${fn} u = y \\iff u = \\${FN_OF[fn]} y,\\ y \\in ${ARC_RANGE_PI[fn]}`,
          solution: `$${piT(tn, td)} \\in ${ARC_RANGE_PI[fn]}$, zato velja $${inner} = \\${FN_OF[fn]} ${aP((tn * 180) / td)} = ${ft(vn, vd)}$\n$${le(a, 0)} = ${b === 0 ? "" : `${ft(vn, vd)} ${sg(-b)} = `}${ft(vn - b * vd, vd)}$\n$x = ${ft(xn, xd)}$`,
        };
      }
      const fn = r.pick(["arcsin", "arccos"]);
      const A = r.pick([-3, -2, -1, 2, 3]);
      const [Bn, Bd] = r.pick([[0, 1], [1, 2], [-1, 2], [1, 1], [-1, 1], [1, 4], [3, 2]]);
      const a = r.pick([2, 3, -2, 4, -1]);
      const b = r.int(-3, 3);
      const askMax = r.next() < 0.5;
      // zaloga vrednosti v enotah π (ulomki z imenovalcem 4)
      const R0 = fn === "arcsin" ? [-2, 2] : [0, 4];
      const ends = [A * R0[0], A * R0[1]].sort((u, w) => u - w).map((e) => e + (4 * Bn) / Bd);
      const ansN = askMax ? ends[1] : ends[0];
      const wrongNoSign = (askMax ? A * R0[1] : A * R0[0]) + (4 * Bn) / Bd;
      const other = fn === "arcsin" ? [0, 4] : [-2, 2];
      const wrongRange = [A * other[0], A * other[1]].sort((u, w) => u - w)[askMax ? 1 : 0] + (4 * Bn) / Bd;
      const Btex = Bn === 0 ? "" : ` ${Bn < 0 ? "-" : "+"} ${piT(Math.abs(Bn), Bd)}`;
      const Atex = A === 1 ? "" : A === -1 ? "-" : `${A}`;
      const f = `${Atex}\\${fn}(${le(a, b)})${Btex}`;
      return {
        text: `Določi zalogo vrednosti funkcije $f(x) = ${f}$. Vpiši ${askMax ? "največjo" : "najmanjšo"} vrednost funkcije v obliki $k\\pi$: vpiši $k$.`,
        answer: frA(ansN, 4, [
          { value: wrongNoSign / 4, why: "Pri množenju z negativnim številom se krajišči zamenjata: največja vrednost postane najmanjša." },
          { value: (askMax ? ends[1] : ends[0]) / 4 - Bn / Bd, why: "Ne pozabi na prišteto konstanto: premakne celotno zalogo vrednosti." },
          { value: wrongRange / 4, why: fn === "arcsin" ? "Zaloga vrednosti arkus sinusa je $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$, ne $[0, \\pi]$." : "Zaloga vrednosti arkus kosinusa je $[0, \\pi]$, ne $\\left[-\\frac{\\pi}{2}, \\frac{\\pi}{2}\\right]$." },
        ]),
        hint: `Notranji izraz $${le(a, b)}$ spremeni le definicijsko območje. Začni z zalogo vrednosti $\\${fn}$ in jo pomnoži ter premakni.`,
        data: { given: [`f(x) = ${f}`], find: [askMax ? "\\max f" : "\\min f"] },
        formula: `Z_{\\${fn}} = ${ARC_RANGE_PI[fn]}`,
        solution: `Ko $x$ preteče definicijsko območje, $\\${fn}(${le(a, b)})$ zavzame vse vrednosti iz $${ARC_RANGE_PI[fn]}$.\nPo množenju z $${A}$: $\\left[${piT(Math.min(A * R0[0], A * R0[1]), 4)}, ${piT(Math.max(A * R0[0], A * R0[1]), 4)}\\right]$${A < 0 ? " (krajišči sta zamenjali vlogi)" : ""}\n${Bn === 0 ? "" : `Po prištetju $${piT(Bn, Bd)}$: `}$Z_f = \\left[${piT(ends[0], 4)}, ${piT(ends[1], 4)}\\right]$\n$k = ${ft(ansN, 4)}$`,
      };
    },
  },

  // ================= stožnice v premaknjeni legi in tangente =================
  {
    id: P + "stoznice-premaknjene",
    topics: [T("stoznice-v-premaknjeni-legi-in-tangente")],
    gen(level, r) {
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const p = r.int(-6, 6);
          const q = r.int(-6, 6);
          if (p === 0 && q === 0) return null;
          const rr = r.int(2, 7);
          const D = -2 * p;
          const E = -2 * q;
          const F = p * p + q * q - rr * rr;
          const eq = `${comb([[1, "x^2"], [1, "y^2"], [D, "x"], [E, "y"], [F, ""]])} = 0`;
          const ask = r.int(0, 2);
          const sol = `$${comb([[1, "x^2"], [D, "x"]])} + ${comb([[1, "y^2"], [E, "y"]])} = ${-F}$\nDopolnimo do kvadratov: $${sqr(p)} + ${sqr(q, "y")} = ${-F} + ${p * p} + ${q * q} = ${rr * rr}$\n$S(${p}, ${q})$, $r = \\sqrt{${rr * rr}} = ${rr}$`;
          const common = { hint: "Člene z $x$ in člene z $y$ dopolni do popolnih kvadratov in dodani števili prištej tudi na desni.", formula: "(x - p)^2 + (y - q)^2 = r^2", solution: sol };
          if (ask === 2) {
            return {
              ...common,
              text: `Krožnica ima enačbo $${eq}$. Vpiši njen polmer.`,
              answer: num(rr, null, [
                { value: rr * rr, why: "To je $r^2$; polmer je njegov koren." },
                { value: Math.sqrt(Math.abs(F)), why: "Konstanta v enačbi ni $-r^2$: najprej dopolni oba kvadrata." },
                { value: Math.sqrt(p * p + q * q + F), why: "Konstanto prenesi na desno z obratnim predznakom." },
              ]),
              data: { given: [eq], find: ["r"] },
            };
          }
          const c = ask === 0 ? p : q;
          const co = ask === 0 ? D : E;
          if (c === 0) return null;
          return {
            ...common,
            text: `Krožnica ima enačbo $${eq}$. Vpiši ${ask === 0 ? "$x$" : "$y$"}-koordinato njenega središča.`,
            answer: num(c, null, [
              { value: -c, why: `Preveri predznak: $${sqr(c, ask === 0 ? "x" : "y")}$ ima središče pri $${c}$.` },
              { value: co, why: "Koeficient pri linearnem členu je $-2p$: deli ga z $-2$." },
            ]),
            data: { given: [eq], find: [ask === 0 ? "p" : "q"] },
          };
        }
        if (t === 1) {
          const [a, b, e] = r.pick(ELL);
          const x0 = r.int(-6, 6);
          const y0 = r.int(-6, 6);
          const right = r.next() < 0.5;
          const s = right ? 1 : -1;
          const fx = x0 + s * e;
          const eq = `\\dfrac{${sqr(x0)}}{${a * a}} + \\dfrac{${sqr(y0, "y")}}{${b * b}} = 1`;
          return {
            text: `Elipsa ima enačbo $${eq}$. Vpiši $x$-koordinato njenega ${right ? "desnega" : "levega"} gorišča.`,
            answer: num(fx, null, [
              { value: x0 + s * (a * a - b * b), why: "Ekscentričnost je koren: $e = \\sqrt{a^2 - b^2}$." },
              { value: x0 + s * Math.sqrt(a * a + b * b), why: "Pri elipsi je $e^2 = a^2 - b^2$; vsota velja za hiperbolo." },
              { value: s * e, why: "Gorišči ležita ob središču $S$, ne ob izhodišču: prištej $x_0$." },
            ]),
            hint: "Najprej preberi središče in polosi, nato izračunaj ekscentričnost $e$.",
            data: { given: [eq], find: [right ? "x_{F_2}" : "x_{F_1}"] },
            formula: ["e = \\sqrt{a^2 - b^2}", "F_{1,2}(x_0 \\mp e, y_0)"],
            solution: `Središče $S(${x0}, ${y0})$, $a = ${a}$, $b = ${b}$\n$e = \\sqrt{${a * a} - ${b * b}} = ${e}$\n${right ? "Desno" : "Levo"} gorišče: $x = ${x0} ${right ? "+" : "-"} ${e} = ${fx}$`,
            zeroOk: true,
          };
        }
        const p2 = r.pick([2, 4, 6, 8, 10, 12, 16]);
        const pp = p2 / 2;
        const x0 = r.int(-6, 6);
        const y0 = r.int(-6, 6);
        const up = r.next() < 0.4;
        const dir = r.next() < 0.6;
        const [u, w, uc, wc] = up ? ["x", "y", x0, y0] : ["y", "x", y0, x0];
        const eq = `${sqr(uc, u)} = ${shiftTex(p2, wc, w)}`;
        const val = dir ? wc + pp / 2 : wc - pp / 2;
        return {
          text: `Parabola ima enačbo $${eq}$. ${dir ? `Vpiši $${w}$-koordinato njenega gorišča.` : `Vpiši število $c$ v enačbi vodnice $${w} = c$.`}`,
          answer: num(val, null, dir
            ? [
                { value: wc + pp, why: "V enačbi stoji $2p$, gorišče pa je za $\\frac{p}{2}$ od temena." },
                { value: wc + p2, why: "Koeficient je $2p$: najprej izračunaj $p$, nato $\\frac{p}{2}$." },
                { value: pp / 2, why: "Gorišče je premaknjeno skupaj s temenom: prištej koordinato temena." },
              ]
            : [
                { value: wc + pp / 2, why: "To je koordinata gorišča. Vodnica leži na drugi strani temena." },
                { value: wc - pp, why: "Vodnica je od temena oddaljena $\\frac{p}{2}$, ne $p$." },
                { value: -pp / 2, why: "Vodnica je premaknjena skupaj s temenom: upoštevaj teme." },
              ]),
          hint: `Preberi teme in iz koeficienta $2p$ izračunaj $p$.`,
          data: { given: [eq], find: [dir ? `${w}_F` : "c"] },
          formula: up ? ["(x - x_0)^2 = 2p(y - y_0)", "F\\left(x_0, y_0 + \\frac{p}{2}\\right),\\ y = y_0 - \\frac{p}{2}"] : ["(y - y_0)^2 = 2p(x - x_0)", "F\\left(x_0 + \\frac{p}{2}, y_0\\right),\\ x = x_0 - \\frac{p}{2}"],
          solution: `Teme $T(${x0}, ${y0})$, $2p = ${p2}$, torej $p = ${pp}$ in $\\frac{p}{2} = ${tx(pp / 2)}$.\n${dir ? `Gorišče: $${w} = ${wc} + ${tx(pp / 2)} = ${tx(val)}$` : `Vodnica: $${w} = ${wc} - ${tx(pp / 2)} = ${tx(val)}$`}`,
          zeroOk: true,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const a = r.int(2, 5);
          let b = r.int(2, 5);
          if (b === a) b = a === 5 ? 3 : a + 1;
          const x0 = r.int(-4, 4);
          const y0 = r.int(-4, 4);
          if (x0 === 0 && y0 === 0) return null;
          const A2 = b * b;
          const B2 = a * a;
          const D = -2 * A2 * x0;
          const E = -2 * B2 * y0;
          const F = A2 * x0 * x0 + B2 * y0 * y0 - a * a * b * b;
          const eq = `${comb([[A2, "x^2"], [B2, "y^2"], [D, "x"], [E, "y"], [F, ""]])} = 0`;
          const ask = r.int(0, 3);
          const rhsW = -F + x0 * x0 + y0 * y0;
          // Izpostavljeni koeficient: 9(y^2 - 2y), pri središču 0 le 9y^2.
          const grp = (k, v, z) => (z === 0 ? `${k}${v}^2` : `${k}(${comb([[1, `${v}^2`], [-2 * z, v]])})`);
          const rhs = [-F, A2 * x0 * x0, B2 * y0 * y0].filter((v, i) => i === 0 || v !== 0).join(" + ");
          const sol = `$${grp(A2, "x", x0)} + ${grp(B2, "y", y0)} = ${-F}$\n$${A2}${sqr(x0)} + ${B2}${sqr(y0, "y")} = ${rhs} = ${a * a * b * b}$\nDelimo z $${a * a * b * b}$: $\\dfrac{${sqr(x0)}}{${a * a}} + \\dfrac{${sqr(y0, "y")}}{${b * b}} = 1$\n$S(${x0}, ${y0})$, polos v smeri $x$: $${a}$, v smeri $y$: $${b}$`;
          const common = { hint: "Izpostavi koeficient pri $x^2$ oziroma $y^2$, dopolni do kvadratov in dodano pomnoženo s koeficientom prištej tudi na desni. Na koncu deli, da je desno $1$.", formula: "\\dfrac{(x - x_0)^2}{a^2} + \\dfrac{(y - y_0)^2}{b^2} = 1", solution: sol };
          if (ask <= 1) {
            const isA = ask === 0;
            const ans = isA ? a : b;
            const coef = isA ? A2 : B2;
            return {
              ...common,
              text: `Krivulja $${eq}$ je elipsa. Z dopolnjevanjem do popolnih kvadratov določi dolžino polosi v smeri osi $${isA ? "x" : "y"}$.`,
              answer: num(ans, null, [
                { value: ans * ans, why: "To je kvadrat polosi; polos je njegov koren." },
                { value: Math.sqrt(coef), why: `Koeficient pri $${isA ? "x^2" : "y^2"}$ ni polos v tej smeri: najprej deli z desno stranjo, da dobiš $\\dfrac{(\\dots)^2}{${isA ? "a" : "b"}^2}$.` },
                { value: Math.sqrt(rhsW / coef), why: "Dodana kvadrata pomnoži s koeficientom pred oklepajem, preden ju prišteješ na desni." },
              ]),
              data: { given: [eq], find: [isA ? "a" : "b"] },
            };
          }
          const isX = ask === 2;
          const c = isX ? x0 : y0;
          if (c === 0) return null;
          return {
            ...common,
            text: `Krivulja $${eq}$ je elipsa. Z dopolnjevanjem do popolnih kvadratov določi ${isX ? "$x$" : "$y$"}-koordinato njenega središča.`,
            answer: num(c, null, [
              { value: -c, why: "Preveri predznak: $(x - x_0)^2$ ima središče pri $x_0$." },
              { value: isX ? -D / 2 : -E / 2, why: "Pred dopolnjevanjem izpostavi koeficient pri kvadratnem členu." },
            ]),
            data: { given: [eq], find: [isX ? "x_0" : "y_0"] },
          };
        }
        if (t === 1) {
          const p2 = r.pick([2, 4, 6, 8, 12]);
          const pp = p2 / 2;
          const x0 = r.int(-5, 5);
          const y0 = r.int(-5, 5);
          const up = r.next() < 0.4;
          const [u, w, uc, wc] = up ? ["x", "y", x0, y0] : ["y", "x", y0, x0];
          const eq = `${comb([[1, `${u}^2`], [-2 * uc, u], [-p2, w], [uc * uc + p2 * wc, ""]])} = 0`;
          const ask = r.int(0, 1);
          const fo = wc + pp / 2;
          const sol = `$${comb([[1, `${u}^2`], [-2 * uc, u]])} = ${comb([[p2, w], [-(uc * uc + p2 * wc), ""]])}$\nDopolnimo: $${sqr(uc, u)} = ${comb([[p2, w], [-(uc * uc + p2 * wc) + uc * uc, ""]])} = ${shiftTex(p2, wc, w)}$\nTeme $T(${x0}, ${y0})$, $p = ${pp}$, gorišče: $${w} = ${wc} + ${tx(pp / 2)} = ${tx(fo)}$`;
          if (ask === 0) {
            return {
              text: `Parabola ima enačbo $${eq}$. Vpiši $${w}$-koordinato njenega temena.`,
              answer: num(wc, null, [
                { value: wc + (uc * uc) / p2, why: `Pri dopolnjevanju $${u}^2 ${sg(-2 * uc)}${u}$ do kvadrata dodaš $${uc * uc}$; to število upoštevaj tudi na drugi strani.` },
                { value: -wc, why: `Preveri predznak: iz $${shiftTex(p2, wc, w)}$ preberi $${w}_0 = ${wc}$.` },
                { value: fo, why: "To je koordinata gorišča, ne temena." },
              ]),
              hint: `Člena z $${u}$ dopolni do popolnega kvadrata, ostalo prenesi na drugo stran in izpostavi $${p2}$.`,
              data: { given: [eq], find: [`${w}_T`] },
              formula: up ? "(x - x_0)^2 = 2p(y - y_0)" : "(y - y_0)^2 = 2p(x - x_0)",
              solution: sol,
              zeroOk: true,
            };
          }
          return {
            text: `Parabola ima enačbo $${eq}$. Vpiši $${w}$-koordinato njenega gorišča.`,
            answer: num(fo, null, [
              { value: wc + pp, why: "Koeficient je $2p$; gorišče je od temena oddaljeno $\\frac{p}{2}$." },
              { value: wc, why: "To je koordinata temena. Gorišče je za $\\frac{p}{2}$ dlje." },
              { value: wc - pp / 2, why: "Gorišče leži v smeri odpiranja parabole, vodnica na drugi strani." },
            ]),
            hint: "Zapiši enačbo v temenski obliki, preberi teme in $p$.",
            data: { given: [eq], find: [`${w}_F`] },
            formula: up ? ["(x - x_0)^2 = 2p(y - y_0)", "F\\left(x_0, y_0 + \\frac{p}{2}\\right)"] : ["(y - y_0)^2 = 2p(x - x_0)", "F\\left(x_0 + \\frac{p}{2}, y_0\\right)"],
            solution: sol,
            zeroOk: true,
          };
        }
        const [ox, oy, h] = r.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10]]);
        const dx = ox * r.pick([1, -1]);
        const dy = oy * r.pick([1, -1]);
        const p = r.int(-5, 5);
        const q = r.int(-5, 5);
        const x1 = p + dx;
        const y1 = q + dy;
        const eq = `${sqr(p)} + ${sqr(q, "y")} = ${h * h}`;
        return {
          text: `Točka $T(${x1}, ${y1})$ leži na krožnici $${eq}$. Vpiši smerni koeficient tangente na krožnico v točki $T$.`,
          answer: frA(-dx, dy, [
            { value: dy / dx, why: "To je smerni koeficient polmera $ST$. Tangenta je pravokotna nanj." },
            { value: dx / dy, why: "Pri pravokotni premici je smerni koeficient $-\\frac{1}{k}$: ne pozabi na minus." },
          ]),
          hint: "Tangenta je pravokotna na polmer v dotikališču. Izračunaj smerni koeficient polmera $ST$.",
          data: { given: [eq, `T = (${x1}, ${y1})`], find: ["k"] },
          formula: ["k_{ST} = \\dfrac{y_1 - q}{x_1 - p}", "k = -\\dfrac{1}{k_{ST}}"],
          solution: `Središče $S(${p}, ${q})$.\n$k_{ST} = \\dfrac{${y1} - ${q < 0 ? `(${q})` : q}}{${x1} - ${p < 0 ? `(${p})` : p}} = ${ft(dy, dx)}$\nTangenta je pravokotna na $ST$: $k = -\\dfrac{1}{k_{ST}} = ${ft(-dx, dy)}$`,
        };
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        const [a, b] = r.pick([[5, 10], [10, 5], [5, 15], [15, 5], [10, 15], [15, 10]]);
        const [u, w] = r.pick([[3, 4], [4, 3]]);
        const dx = (a * u * r.pick([1, -1])) / 5;
        const dy = (b * w * r.pick([1, -1])) / 5;
        const x0 = r.int(-5, 5);
        const y0 = r.int(-5, 5);
        const x1 = x0 + dx;
        const y1 = y0 + dy;
        const [kn, kd] = fr(-dx * b * b, dy * a * a);
        const nN = y1 * kd - kn * x1;
        const askK = r.next() < 0.5;
        if (!askK && x1 === 0) return null;
        const eq = `\\dfrac{${sqr(x0)}}{${a * a}} + \\dfrac{${sqr(y0, "y")}}{${b * b}} = 1`;
        const tang = `\\dfrac{${dx}${x0 === 0 ? "x" : `(${xm(x0)})`}}{${a * a}} + \\dfrac{${dy}${y0 === 0 ? "y" : `(${xm(y0, "y")})`}}{${b * b}} = 1`;
        const kSwap = (-dx * a * a) / (dy * b * b);
        const kCirc = -dx / dy;
        return {
          text: `Točka $T_1(${x1}, ${y1})$ leži na elipsi $${eq}$. Tangenta v $T_1$ ima enačbo $y = kx + n$. Vpiši ${askK ? "$k$" : "$n$"}.`,
          answer: askK
            ? frA(kn, kd, [
                { value: kSwap, why: "Si zamenjal $a^2$ in $b^2$? Pod $(x - x_0)$ je $a^2$, pod $(y - y_0)$ je $b^2$." },
                { value: kCirc, why: "To bi veljalo za krožnico. Pri elipsi upoštevaj še različna imenovalca $a^2$ in $b^2$." },
                { value: (dy * a * a) / (dx * b * b), why: "To je smerni koeficient normale. Tangenta ima koeficient $-\\frac{1}{k}$ normale." },
              ])
            : frA(nN, kd, [
                { value: y1 - kSwap * x1, why: "Si zamenjal $a^2$ in $b^2$? Pod $(x - x_0)$ je $a^2$, pod $(y - y_0)$ je $b^2$." },
                { value: y1 - kCirc * x1, why: "To bi veljalo za krožnico. Pri elipsi upoštevaj različna imenovalca $a^2$ in $b^2$." },
                { value: y1 + (kn / kd) * x1, why: "Iz $y_1 = k x_1 + n$ sledi $n = y_1 - k x_1$: preveri predznak." },
              ]),
          hint: "V vsakem kvadratu enačbe elipse en faktor zamenjaj s koordinato točke $T_1$, nato izrazi $y$.",
          data: { given: [eq, `T_1 = (${x1}, ${y1})`], find: [askK ? "k" : "n"] },
          formula: "\\dfrac{(x_1 - x_0)(x - x_0)}{a^2} + \\dfrac{(y_1 - y_0)(y - y_0)}{b^2} = 1",
          solution: `Tangenta: $${tang}$\nIzrazimo $y$: smerni koeficient je $k = -\\dfrac{${dx} \\cdot ${b * b}}{${dy} \\cdot ${a * a}} = ${ft(kn, kd)}$\n$n = y_1 - k x_1 = ${y1} - ${ft(kn, kd).startsWith("-") ? `\\left(${ft(kn, kd)}\\right)` : ft(kn, kd)} \\cdot ${x1 < 0 ? `(${x1})` : x1} = ${ft(nN, kd)}$\nTangenta: $y = ${lineT(kn, kd, nN, kd)}$`,
        };
      }
      if (t === 1) {
        const [kn, kd] = r.pick([[3, 4], [-3, 4], [4, 3], [-4, 3]]);
        const rt = 5;
        const rr = r.int(1, 6);
        const p = r.int(-5, 5);
        const q = r.int(-5, 5);
        const big = r.next() < 0.5;
        const s = big ? 1 : -1;
        const base = q * kd - kn * p;
        const nN = base + s * rt * rr;
        const eq = `${sqr(p)} + ${sqr(q, "y")} = ${rr * rr}`;
        return {
          text: `Premica $y = ${ft(kn, kd)}x + n$ je tangenta krožnice $${eq}$. Vpiši ${big ? "večjo" : "manjšo"} od obeh možnih vrednosti $n$.`,
          answer: frA(nN, kd, [
            { value: (base - s * rt * rr) / kd, why: `To je druga tangenta. Vprašanje je po ${big ? "večji" : "manjši"} vrednosti $n$.` },
            { value: (s * rt * rr) / kd, why: "Središče ni v izhodišču: v pogoju je izraz $k p - q + n$, ne le $n$." },
            { value: base / kd + s * rr, why: "Razdalja središča od premice je $\\dfrac{|kp - q + n|}{\\sqrt{k^2 + 1}}$: pozabil si imenovalec." },
          ]),
          hint: "Vstavi $y = kx + n$ v enačbo krožnice in zahtevaj $D = 0$, ali pa izenači razdaljo središča od premice s polmerom.",
          data: { given: [eq, `k = ${ft(kn, kd)}`], find: ["n"] },
          formula: "(kp - q + n)^2 = r^2(k^2 + 1)",
          solution: `$S(${p}, ${q})$, $r = ${rr}$, $\\sqrt{k^2 + 1} = \\sqrt{${ft(kn * kn, kd * kd)} + 1} = ${ft(rt, kd)}$\n$${ft(kn, kd)} \\cdot ${p < 0 ? `(${p})` : p} - ${q < 0 ? `(${q})` : q} + n = \\pm ${rr} \\cdot ${ft(rt, kd)}$\n$n = ${ft(base, kd)} \\pm ${ft(rt * rr, kd)}$\n$n_{1} = ${ft(base + rt * rr, kd)}$, $n_{2} = ${ft(base - rt * rr, kd)}$; ${big ? "večja" : "manjša"} je $${ft(nN, kd)}$.`,
        };
      }
      const pp = r.pick([1, 2, 3, 4, 6]);
      const ds = [];
      for (let d = -12; d <= 12; d++) if (d !== 0 && (d * d) % (2 * pp) === 0) ds.push(d);
      const d = r.pick(ds);
      const x0 = r.int(-5, 5);
      const y0 = r.int(-5, 5);
      const y1 = y0 + d;
      const x1 = x0 + (d * d) / (2 * pp);
      const [kn, kd] = fr(pp, d);
      const nN = y1 * kd - kn * x1;
      const askK = r.next() < 0.35;
      const eq = `${sqr(y0, "y")} = ${shiftTex(2 * pp, x0)}`;
      return {
        text: `Točka $T_1$ z ordinato $${y1}$ leži na paraboli $${eq}$. Tangenta v $T_1$ ima enačbo $y = kx + n$. Vpiši ${askK ? "$k$" : "$n$"}.`,
        answer: askK
          ? frA(kn, kd, [
              { value: (2 * pp) / d, why: "Člen $2p(x - x_0)$ razdeli na polovici: $p(x - x_0) + p(x_1 - x_0)$. Smerni koeficient je $\\frac{p}{y_1 - y_0}$." },
              { value: d / pp, why: "Si izrazil $x$ namesto $y$? Smerni koeficient je $\\frac{p}{y_1 - y_0}$." },
            ])
          : frA(nN, kd, [
              { value: y1 - ((2 * pp) / d) * x1, why: "Člen $2p(x - x_0)$ razdeli na polovici: $p(x - x_0) + p(x_1 - x_0)$." },
              { value: y0 - (kn / kd) * x0, why: "Pravilo zahteva oba člena: $p\\big((x - x_0) + (x_1 - x_0)\\big)$. Brez drugega dobiš premico skozi teme." },
              { value: y1 + (kn / kd) * x1, why: "Iz $y_1 = k x_1 + n$ sledi $n = y_1 - k x_1$: preveri predznak." },
            ]),
        hint: "Najprej izračunaj absciso točke $T_1$ iz enačbe parabole, nato uporabi enačbo tangente v točki parabole.",
        data: { given: [eq, `y_1 = ${y1}`], find: [askK ? "k" : "n"] },
        formula: "(y_1 - y_0)(y - y_0) = p\\big((x - x_0) + (x_1 - x_0)\\big)",
        solution: `Teme $T(${x0}, ${y0})$, $2p = ${2 * pp}$, $p = ${pp}$.\n$(${y1} - ${y0 < 0 ? `(${y0})` : y0})^2 = ${2 * pp}(x_1 - ${x0 < 0 ? `(${x0})` : x0})$, torej $x_1 = ${x1}$.\nTangenta: $${d}${y0 === 0 ? "y" : `(${xm(y0, "y")})`} = ${pp}\\big(${xm(x0)} ${sg(x1 - x0)}\\big)$\n$k = ${ft(kn, kd)}$, $n = y_1 - k x_1 = ${ft(nN, kd)}$`,
      };
    },
  },

  // ================= racionalne neenačbe =================
  {
    id: P + "racionalne-neenacbe",
    topics: [T("racionalne-neenacbe")],
    gen(level, r) {
      if (level === 1) {
        const m = r.pick([1, 1, 2, 3, -1, -2]);
        const a = r.int(-6, 7);
        const b = r.int(-6, 7);
        if (Math.abs(a - b) < 2 || Math.abs(a - b) > 7) return null;
        const crit = [{ x: a, tex: tx(a), pole: false }, { x: b, tex: tx(b), pole: true }];
        const f = (x) => (m * x - m * a) / (x - b);
        const ineqL = `\\dfrac{${le(m, -m * a)}}{${xm(b)}}`;
        const lo = Math.min(a, b);
        const test = lo + 1;
        if (r.next() < 0.55) {
          const rel = m > 0 ? r.pick(["<", "<="]) : r.pick([">", ">="]);
          const ineq = `${ineqL} ${REL[rel]} 0`;
          const S = ratSet(crit, f, rel);
          const ks = intsIn(S.pieces[0]);
          const cnt = (o) => intsIn(ratSet(crit, f, rel, o).pieces[0])?.length;
          return {
            text: `Koliko celih števil reši neenačbo $${ineq}$?`,
            answer: num(ks.length, null, [
              { value: cnt({ poleIn: true }), why: `Pol $x = ${b}$ ne spada v rešitev: tam imenovalec postane $0$.` },
              { value: cnt({ zeroIn: strictOf(rel) }), why: strictOf(rel) ? `Neenačba je stroga: pri $x = ${a}$ je ulomek $0$, kar ne zadošča.` : `Neenačba je nestroga: pri $x = ${a}$ je ulomek $0$, kar zadošča.` },
              { value: cnt({ poleIn: true, zeroIn: true }), why: "Krajišči obravnavaj posebej: ničlo vključiš le pri nestrogi neenačbi, pola nikoli." },
            ]),
            hint: "Poišči ničlo števca in pol. Predznak ulomka določi s testnim številom na vsakem intervalu.",
            data: { given: [`f(x) = ${ineqL}`], find: [`\\text{število celih } x \\text{ z } f(x) ${REL[rel]} 0`] },
            formula: RAT_FORMULA,
            solution: `Ničla: $x = ${a}$, pol: $x = ${b}$.\nTestno število $x = ${test}$: $\\dfrac{${tx(m * test - m * a)}}{${tx(test - b)}} ${f(test) < 0 ? "< 0" : "> 0"}$, zato rešitve ležijo med ničlo in polom.\nPol izključimo, ${ZERO_RULE(rel)}: $x \\in ${S.tex}$\nCela števila: ${listInts(ks)}; teh je $${ks.length}$.`,
          };
        }
        const rel = r.pick(RELS);
        const ineq = `${ineqL} ${REL[rel]} 0`;
        const opts = [
          [false, !strictOf(rel)],
          [true, !strictOf(rel)],
          [false, strictOf(rel)],
          [true, strictOf(rel)],
        ].map(([pIn, zIn]) => ({ pIn, zIn, tex: ratSet(crit, f, rel, { poleIn: pIn, zeroIn: zIn }).tex }));
        const why = (o) => [o.pIn ? `Pol $x = ${b}$ ne spada v rešitev: tam ulomek ni definiran.` : "", o.zIn !== !strictOf(rel) ? (strictOf(rel) ? `Neenačba je stroga: ničle $x = ${a}$, kjer je ulomek $0$, ne vključimo.` : `Neenačba je nestroga: pri $x = ${a}$ je ulomek $0$, kar zadošča.`) : ""].filter(Boolean).join(" ");
        return {
          text: `Katera množica je rešitev neenačbe $${ineq}$?`,
          answer: pickAns(r, opts[0].tex, opts.slice(1).map((o) => [o.tex, why(o)])),
          options_tex: true,
          hint: "Določi predznak ulomka na intervalih, ki jih določata ničla in pol. Nato premisli, katero krajišče vključiš.",
          data: { given: [`f(x) = ${ineqL}`], find: [`\\text{množica rešitev } f(x) ${REL[rel]} 0`] },
          formula: ["\\le, \\ge: \\text{ničle vključimo}", "\\text{polov nikoli ne vključimo}"],
          solution: `Ničla: $x = ${a}$, pol: $x = ${b}$.\nTestno število $x = ${test}$ med njima da ${f(test) < 0 ? "negativen" : "pozitiven"} ulomek, zunaj je predznak nasproten.\nPol izključimo, ${ZERO_RULE(rel)}: $x \\in ${opts[0].tex}$`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const m = r.pick([1, 2, 3, -1, -2]);
          const c = r.pick([-3, -2, -1, 1, 2, 3]);
          const z = r.int(-5, 7);
          const q = r.int(-5, 7);
          if (Math.abs(z - q) < 2 || Math.abs(z - q) > 7) return null;
          const a = m + c;
          const b = -m * z - c * q;
          if (a === 0) return null;
          const rel = m > 0 ? r.pick(["<", "<="]) : r.pick([">", ">="]);
          const ineq = `\\dfrac{${le(a, b)}}{${xm(q)}} ${REL[rel]} ${c}`;
          const crit = [{ x: z, tex: tx(z), pole: false }, { x: q, tex: tx(q), pole: true }];
          const f = (x) => (m * x - m * z) / (x - q);
          const S = ratSet(crit, f, rel);
          const ks = intsIn(S.pieces[0]);
          const cnt = (o) => intsIn(ratSet(crit, f, rel, o).pieces[0])?.length;
          const zr = -b / a;
          const naive = Number.isFinite(zr) && Math.abs(zr - q) > 1e-9 ? ratSet([{ x: zr, tex: "", pole: false }, { x: q, tex: "", pole: true }], (x) => (a * x + b) / (x - q), rel) : null;
          const naiveB = naive && bounded(naive);
          return {
            text: `Koliko celih števil reši neenačbo $${ineq}$?`,
            answer: num(ks.length, null, [
              { value: cnt({ poleIn: true }), why: `Pol $x = ${q}$ ne spada v rešitev: tam ulomek ni definiran.` },
              { value: cnt({ zeroIn: strictOf(rel) }), why: strictOf(rel) ? `Neenačba je stroga: pri $x = ${z}$ velja enakost, kar ne zadošča.` : `Neenačba je nestroga: pri $x = ${z}$ velja enakost, kar zadošča.` },
              { value: naiveB ? intsIn(naiveB).length : NaN, why: `Število $${c}$ moraš najprej prenesti na levo in vse zapisati kot en ulomek; primerjava z $0$ velja šele potem.` },
            ]),
            hint: `Število $${c}$ prenesi na levo stran in levo stran zapiši kot en ulomek. Ne množi z imenovalcem, ker ne poznaš njegovega predznaka.`,
            data: { given: [`f(x) = \\dfrac{${le(a, b)}}{${xm(q)}}`], find: [`\\text{število celih } x \\text{ z } f(x) ${REL[rel]} ${c}`] },
            formula: RAT_FORMULA,
            solution: `$\\dfrac{${le(a, b)}}{${xm(q)}} ${sg(-c)} ${REL[rel]} 0$\n$\\dfrac{${le(a, b)} ${c > 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}${q === 0 ? "x" : `(${xm(q)})`}}{${xm(q)}} = \\dfrac{${le(m, -m * z)}}{${xm(q)}} ${REL[rel]} 0$\nNičla $x = ${z}$, pol $x = ${q}$; pol izključimo, ${ZERO_RULE(rel)}: $x \\in ${S.tex}$\nCela števila: ${listInts(ks)}; teh je $${ks.length}$.`,
          };
        }
        if (t === 1) {
          const vals = r.shuffle([-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6]).slice(0, 3);
          const [r1, r2, pc] = vals;
          const s = r.pick([1, -1]);
          const rel = r.pick(RELS);
          const crit = [{ x: r1, tex: tx(r1), pole: false }, { x: r2, tex: tx(r2), pole: false }, { x: pc, tex: tx(pc), pole: true }];
          const f = (x) => (s * (x - r1) * (x - r2)) / (x - pc);
          const fac = (v) => (v === 0 ? "x" : `(${xm(v)})`);
          const first = s > 0 ? fac(r1) : r1 === 0 ? "(-x)" : `(${r1} - x)`;
          const ineq = `\\dfrac{${first}${fac(r2)}}{${xm(pc)}} ${REL[rel]} 0`;
          const S = ratSet(crit, f, rel);
          const B = bounded(S);
          if (!B) return null;
          const ks = intsIn(B);
          const opp = { "<": ">", "<=": ">=", ">": "<", ">=": "<=" }[rel];
          const cnt = (o, rl = rel) => {
            const bb = bounded(ratSet(crit, f, rl, o));
            return bb ? intsIn(bb).length : NaN;
          };
          const sorted = [...crit].sort((u, v) => u.x - v.x);
          return {
            text: `Množica rešitev neenačbe $${ineq}$ je unija omejenega in neomejenega intervala. Koliko celih števil leži v omejenem intervalu?`,
            answer: num(ks.length, null, [
              { value: cnt({}, opp), why: "To je omejeni interval, kjer ima ulomek nasprotni predznak. Preveri predznake s testnimi števili." },
              { value: cnt({ poleIn: true }), why: `Pol $x = ${pc}$ ne spada v rešitev: tam imenovalec postane $0$.` },
              { value: cnt({ zeroIn: strictOf(rel) }), why: strictOf(rel) ? "Neenačba je stroga: v ničlah števca je ulomek $0$, kar ne zadošča." : "Neenačba je nestroga: ničle števca, kjer je ulomek $0$, vključimo." },
            ]),
            hint: "Ničle in pol razdelijo os na štiri intervale. Na vsakem določi predznak s testnim številom.",
            data: { given: [`f(x) = \\dfrac{${first}${fac(r2)}}{${xm(pc)}}`], find: [`\\text{cela števila v omejenem intervalu } f(x) ${REL[rel]} 0`] },
            formula: RAT_FORMULA,
            solution: `Ničli: $x = ${r1}$, $x = ${r2}$; pol: $x = ${pc}$.\nPredznaki od leve proti desni na intervalih med $${sorted.map((c) => c.x).join("$, $")}$: ${[sorted[0].x - 1, (sorted[0].x + sorted[1].x) / 2, (sorted[1].x + sorted[2].x) / 2, sorted[2].x + 1].map((x) => (f(x) > 0 ? "$+$" : "$-$")).join(", ")}\n${ZERO_RULE(rel)[0].toUpperCase() + ZERO_RULE(rel).slice(1)}, pola ne: $x \\in ${S.tex}$\nV omejenem intervalu: ${listInts(ks)}; teh je $${ks.length}$.`,
          };
        }
        const a = r.nonZero(-4, 4);
        const b = r.int(-6, 6);
        const c = r.pick([-3, -2, -1, 1, 2, 3]);
        const q = r.int(-5, 5);
        if (a === c) return null;
        const zn = -(b + c * q);
        const zd = a - c;
        if (Math.abs(zn / zd - q) < 1e-9) return null;
        const rel = r.pick(RELS);
        const ineq = `\\dfrac{${le(a, b)}}{${xm(q)}} ${REL[rel]} ${c}`;
        const crit = [{ x: zn / zd, tex: ft(zn, zd), pole: false }, { x: q, tex: tx(q), pole: true }];
        const f = (x) => ((a - c) * x + b + c * q) / (x - q);
        const S = ratSet(crit, f, rel);
        return {
          text: `Reši neenačbo $${ineq}$. Krajišči intervalov v rešitvi sta pol in še eno število. Vpiši to drugo krajišče (ulomek ali celo število).`,
          answer: frA(zn, zd, [
            { value: q, why: "To je pol, krajišče, ki ga rešitev nikoli ne vsebuje. Iščeš ničlo števca." },
            { value: -b / a, why: `Desna stran ni $0$: najprej prenesi $${c}$ na levo in vse zapiši kot en ulomek.` },
            { value: (c * q - b) / (a + c), why: `Pri prenašanju $${c}${q === 0 ? "x" : `(${xm(q)})`}$ na levo spremeni predznak vsem členom.` },
          ]),
          hint: `Prenesi $${c}$ na levo stran, zapiši en ulomek in poišči ničlo njegovega števca.`,
          data: { given: [`f(x) = \\dfrac{${le(a, b)}}{${xm(q)}}`], find: [`\\text{krajišče rešitve } f(x) ${REL[rel]} ${c} \\text{, ki ni pol}`] },
          formula: ["\\dfrac{p(x)}{q(x)} - c = \\dfrac{p(x) - c\\,q(x)}{q(x)}", "\\text{krajišča: ničle števca in poli}"],
          solution: `$\\dfrac{${le(a, b)} ${c > 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}${q === 0 ? "x" : `(${xm(q)})`}}{${xm(q)}} ${REL[rel]} 0$\n$\\dfrac{${le(a - c, b + c * q)}}{${xm(q)}} ${REL[rel]} 0$\nNičla števca: $x = ${ft(zn, zd)}$, pol: $x = ${q}$\nRešitev: $x \\in ${S.tex}$`,
        };
      }
      // raven 3
      const t = r.int(0, 2);
      if (t === 0) {
        const vals = r.shuffle([-4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6]).slice(0, 3);
        const [p, q, z] = vals;
        const K = r.pick([1, -1, 2]);
        let a = K * (z - p);
        let b = K * (z - q);
        const gg = gcd(Math.abs(a), Math.abs(b));
        a /= gg;
        b /= gg;
        const rel = r.pick(RELS);
        const ineq = `\\dfrac{${a}}{${xm(p)}} ${REL[rel]} \\dfrac{${b}}{${xm(q)}}`;
        const crit = [{ x: z, tex: tx(z), pole: false }, { x: p, tex: tx(p), pole: true }, { x: q, tex: tx(q), pole: true }];
        const f = (x) => a / (x - p) - b / (x - q);
        const S = ratSet(crit, f, rel);
        const B = bounded(S);
        if (!B) return null;
        const ks = intsIn(B);
        const opp = { "<": ">", "<=": ">=", ">": "<", ">=": "<=" }[rel];
        const cnt = (o, rl = rel) => {
          const bb = bounded(ratSet(crit, f, rl, o));
          return bb ? intsIn(bb).length : NaN;
        };
        const numT = comb([[a - b, "x"], [-a * q + b * p, ""]]);
        return {
          text: `Množica rešitev neenačbe $${ineq}$ je unija omejenega in neomejenega intervala. Koliko celih števil leži v omejenem intervalu?`,
          answer: num(ks.length, null, [
            { value: cnt({}, opp), why: "To je omejeni interval z nasprotnim predznakom. Neenačbe ne smeš množiti z imenovalcema, ker ne poznaš njunega predznaka." },
            { value: cnt({ poleIn: true }), why: "Pola ne spadata v rešitev: tam ulomka nista definirana." },
            { value: cnt({ zeroIn: strictOf(rel) }), why: strictOf(rel) ? `Neenačba je stroga: pri $x = ${z}$ sta ulomka enaka, kar ne zadošča.` : `Neenačba je nestroga: pri $x = ${z}$ sta ulomka enaka, kar zadošča.` },
          ]),
          hint: "Desni ulomek prenesi na levo in oba zapiši na skupni imenovalec. Ne množi neenačbe z imenovalcema.",
          data: { given: [`f(x) = \\dfrac{${a}}{${xm(p)}}`, `g(x) = \\dfrac{${b}}{${xm(q)}}`], find: [`\\text{cela števila v omejenem intervalu } f(x) ${REL[rel]} g(x)`] },
          formula: RAT_FORMULA,
          solution: `$\\dfrac{${a}}{${xm(p)}} - \\dfrac{${b}}{${xm(q)}} ${REL[rel]} 0$\n$\\dfrac{${numT}}{${p === 0 ? "x" : `(${xm(p)})`}${q === 0 ? "x" : `(${xm(q)})`}} ${REL[rel]} 0$: ničla $x = ${z}$, pola $x = ${p}$ in $x = ${q}$\nPredznak s testnimi števili, pola izključimo, ${ZERO_RULE(rel)}: $x \\in ${S.tex}$\nV omejenem intervalu: ${listInts(ks)}; teh je $${ks.length}$.`,
        };
      }
      if (t === 1) {
        const rel = r.pick(RELS);
        const b = r.int(-4, 4);
        const aBig = rel === ">" || rel === "<=";
        const a = aBig ? b + r.int(1, 4) : b - r.int(1, 4);
        const expanded = r.next() < 0.5;
        const numT = expanded ? comb([[1, "x^2"], [-2 * a, "x"], [a * a, ""]]) : sqr(a);
        const ineq = `\\dfrac{${numT}}{${xm(b)}} ${REL[rel]} 0`;
        const crit = [{ x: a, tex: tx(a), pole: false }, { x: b, tex: tx(b), pole: true }];
        const f = (x) => (x - a) ** 2 / (x - b);
        const alt = (x) => (x - a) / (x - b);
        const cor = ratSet(crit, f, rel).tex;
        const wrongs = [
          [ratSet(crit, f, rel, { zeroIn: strictOf(rel) }).tex, strictOf(rel) ? `Pri $x = ${a}$ je ulomek $0$, stroga neenačba pa to točko izključi.` : `Pri $x = ${a}$ je ulomek enak $0$, kar zadošča nestrogi neenačbi: ta točka spada v rešitev.`],
          [ratSet(crit, alt, rel).tex, `Faktor $${sqr(a)}$ ima sodo stopnjo, zato pri $x = ${a}$ predznak ulomka ostane enak.`],
          [ratSet(crit, f, rel, { poleIn: true }).tex, `Pol $x = ${b}$ nikoli ne spada v rešitev: tam ulomek ni definiran.`],
        ];
        const ans = pickAns(r, cor, wrongs);
        if (ans.options.length < 3) return null;
        return {
          text: `Katera množica je rešitev neenačbe $${ineq}$?`,
          answer: ans,
          options_tex: true,
          hint: `${expanded ? "Števec razstavi. " : ""}Premisli, ali faktor v števcu kdaj zamenja predznak, in posebej obravnavaj točko, kjer je števec $0$.`,
          data: { given: [`f(x) = \\dfrac{${numT}}{${xm(b)}}`], find: [`\\text{množica rešitev } f(x) ${REL[rel]} 0`] },
          formula: ["\\text{soda stopnja: predznak se ne zamenja}", "\\text{polov nikoli ne vključimo}"],
          solution: `${expanded ? `Števec: $${numT} = ${sqr(a)}$.\n` : ""}Števec je $\\ge 0$ za vsak $x$ in je $0$ le pri $x = ${a}$, zato je predznak ulomka enak predznaku $${xm(b)}$.\nUlomek je pozitiven za $x > ${b}$ in negativen za $x < ${b}$; pol $x = ${b}$ izključimo.\nTočka $x = ${a}$: ulomek je $0$, ${strictOf(rel) ? "stroga neenačba jo izključi" : "nestroga neenačba jo vključi"}.\nRešitev: $x \\in ${cor}$`,
        };
      }
      const ctx = r.pick([
        { intro: (F, c) => `Tiskarna za tisk brošure zaračuna $${F}$ € za pripravo in $${tx(c)}$ € za vsak izvod.`, ask: (Pm) => `Najmanj koliko izvodov je treba naročiti, da povprečna cena enega izvoda ne bo večja od $${tx(Pm)}$ €?`, F: [80, 400], c: [0.5, 1, 1.5, 2, 2.5, 3], dP: [1, 2, 3] },
        { intro: (F, c) => `Planinsko društvo najame avtobus za $${F}$ €, vsak udeleženec plača še $${tx(c)}$ € za vstopnino.`, ask: (Pm) => `Najmanj koliko udeležencev mora iti na izlet, da strošek na osebo ne bo večji od $${tx(Pm)}$ €?`, F: [250, 600], c: [3, 4, 5, 6, 8], dP: [6, 8, 10, 12] },
        { intro: (F, c) => `Nakup 3D tiskalnika stane $${F}$ €, material za en izdelek pa $${tx(c)}$ €.`, ask: (Pm) => `Najmanj koliko izdelkov je treba natisniti, da povprečni strošek izdelka ne bo večji od $${tx(Pm)}$ €?`, F: [200, 900], c: [1, 1.5, 2, 3], dP: [2, 3, 4, 5] },
      ]);
      const F = r.int(ctx.F[0] / 10, ctx.F[1] / 10) * 10;
      const c = r.pick(ctx.c);
      const Pm = c + r.pick(ctx.dP);
      const x0 = F / (Pm - c);
      const n = Math.ceil(x0 - 1e-9);
      return {
        text: `${ctx.intro(F, c)} ${ctx.ask(Pm)}`,
        answer: num(n, null, [
          { value: Math.floor(x0), why: "Pri tem številu je povprečni strošek še nad mejo: rešitev je $x \\ge x_0$, zato zaokroži navzgor." },
          { value: Math.ceil(F / Pm), why: "V povprečni ceni je tudi strošek na kos: števec je $F + c\\,x$, ne le $F$." },
          { value: Math.ceil(F / (Pm + c)), why: "Pri prenosu $P$ na levo dobiš $\\dfrac{F + (c - P)x}{x}$: preveri predznak." },
        ]),
        hint: "Zapiši povprečni strošek kot ulomek $\\dfrac{F + c\\,x}{x}$, postavi neenačbo in vse prenesi na eno stran.",
        data: { given: [`F = ${F}\\ \\text{€}`, `c = ${tx(c)}\\ \\text{€}`, `P = ${tx(Pm)}\\ \\text{€}`], find: ["x_{\\min}"] },
        formula: "\\dfrac{F + c\\,x}{x} \\le P",
        solution: `$\\dfrac{${F} + ${tx(c)}x}{x} \\le ${tx(Pm)}$\n$\\dfrac{${comb([[F, ""], [-(Pm - c), "x"]])}}{x} \\le 0$; ker je $x > 0$, mora biti števec $\\le 0$.\n$x \\ge \\dfrac{${F}}{${tx(Pm - c)}} ${ap(x0, 2)} ${txr(x0, 2)}$\nNajmanjše celo število: $${n}$`,
      };
    },
  },
];

// Premica y = kx + n v TeX iz ulomkov k = kn/kd, n = nn/nd.
function lineT(kn, kd, nn, nd) {
  const k = ft(kn, kd);
  const kx = k === "1" ? "x" : k === "-1" ? "-x" : `${k}x`;
  const [a] = fr(nn, nd);
  return a === 0 ? kx : `${kx} ${a < 0 ? "-" : "+"} ${ft(Math.abs(nn), nd)}`;
}

export const MATURA_MAT_SS3 = wrapGens(GENS);
