// Gimnazija: drugi tip naloge za teme mat-ss3, ki so imele en sam generator (j, 2026-11-25).
// Prvi tip je v dodatne-mat-ss34.js (dod-mat-ss34-*); tu so modeli iz življenja, obratne naloge,
// pojmovna izbira in večkoračne naloge. Merila: docs/kakovost.md §2. Vsi rezultati so izračunani
// v kodi iz istih (zaokroženih) števil, ki jih vidi dijak. Koti: stopinje (°) ali radiani, kot piše.
import { g } from "../rng.js";
import { roundHalfUp } from "../check.js";
import { tx } from "./mat.js";
import { num, frA, ft, fr, sg, pickAns, name, wrapGens } from "./matura-util.js";

const T = (s) => `MAT-SS-3/${s}`;
const DEG = Math.PI / 180;
const S = (x) => Math.sin(x * DEG);
const Co = (x) => Math.cos(x * DEG);
const asinD = (v) => Math.asin(v) / DEG;
const acosD = (v) => Math.acos(v) / DEG;
const atanD = (v) => Math.atan(v) / DEG;
const sum = (xs) => xs.reduce((a, b) => a + b, 0);
const pt = (x) => (x < 0 ? `(${tx(x)})` : tx(x));
const vt = (v) => `(${v.join(", ")})`;
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const len = (a) => Math.sqrt(dot(a, a));
const deg = (x, d = 1) => `${tx(x, d)}^\\circ`;
// Polinom iz koeficientov (od najvišje potence): [1, -3, 0, 2] → "x^3 - 3x^2 + 2".
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
function mul(p, q) {
  const out = Array(p.length + q.length - 1).fill(0);
  p.forEach((a, i) => q.forEach((b, j) => (out[i + j] += a * b)));
  return out;
}
const fromRoots = (rs) => rs.reduce((p, x) => mul(p, [1, -x]), [1]);
const horner = (cs, a) => {
  const row = [cs[0]];
  for (let i = 1; i < cs.length; i++) row.push(cs[i] + a * row[i - 1]);
  return row;
};
// x - a: xm(3) → "x - 3", xm(-2) → "x + 2".
const xm = (a) => (a === 0 ? "x" : `x ${sg(-a)}`);
// Člen s koeficientom: cf(-1, "\\sin x") → "-\\sin x", cf(3, "x") → "3x".
const cf = (c, t) => (c === 1 ? t : c === -1 ? `-${t}` : `${tx(c)}${t}`);
// Nadaljevanje vsote: cn(-2, "\\cos x") → " - 2\\cos x".
const cn = (c, t) => (c === 0 ? "" : ` ${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 ? "" : tx(Math.abs(c))}${t}`);
// Kot v stopinjah kot večkratnik π: 150 → \frac{5\pi}{6}.
function radTex(d) {
  const [a, b] = fr(d, 180);
  const A = a === 1 ? "" : `${a}`;
  return b === 1 ? `${A}\\pi` : `\\frac{${A}\\pi}{${b}}`;
}
// Rešitve enačbe tan x = v na [0°, 360°).
const tanSols = (v) => {
  const a = atanD(v);
  const b = a < 0 ? a + 180 : a;
  return [b, b + 180];
};
const D360 = "[0^\\circ, 360^\\circ)";

// ================= trigonometrijske enačbe =================
// Enačbe z dvojnim kotom: A = rešitve, ki se izgubijo pri deljenju (oz. koren ±1), B = ostale.
const DBL = [
  { eq: "\\sin 2x = \\sin x", f: (x) => S(2 * x) - S(x), kind: "fac", div: "\\sin x", steps: ["$2\\sin x\\cos x - \\sin x = 0$", "$\\sin x\\,(2\\cos x - 1) = 0$"], A: [0, 180], Aeq: "\\sin x = 0", B: [60, 300], Beq: "\\cos x = \\frac{1}{2}" },
  { eq: "\\sin 2x = \\cos x", f: (x) => S(2 * x) - Co(x), kind: "fac", div: "\\cos x", steps: ["$2\\sin x\\cos x - \\cos x = 0$", "$\\cos x\\,(2\\sin x - 1) = 0$"], A: [90, 270], Aeq: "\\cos x = 0", B: [30, 150], Beq: "\\sin x = \\frac{1}{2}" },
  { eq: "\\sin 2x = -\\sin x", f: (x) => S(2 * x) + S(x), kind: "fac", div: "\\sin x", steps: ["$2\\sin x\\cos x + \\sin x = 0$", "$\\sin x\\,(2\\cos x + 1) = 0$"], A: [0, 180], Aeq: "\\sin x = 0", B: [120, 240], Beq: "\\cos x = -\\frac{1}{2}" },
  { eq: "\\sin 2x = \\sqrt{3}\\cos x", f: (x) => S(2 * x) - Math.sqrt(3) * Co(x), kind: "fac", div: "\\cos x", steps: ["$2\\sin x\\cos x - \\sqrt{3}\\cos x = 0$", "$\\cos x\\,(2\\sin x - \\sqrt{3}) = 0$"], A: [90, 270], Aeq: "\\cos x = 0", B: [60, 120], Beq: "\\sin x = \\frac{\\sqrt{3}}{2}" },
  { eq: "\\sin 2x + \\sqrt{2}\\sin x = 0", f: (x) => S(2 * x) + Math.SQRT2 * S(x), kind: "fac", div: "\\sin x", steps: ["$2\\sin x\\cos x + \\sqrt{2}\\sin x = 0$", "$\\sin x\\,(2\\cos x + \\sqrt{2}) = 0$"], A: [0, 180], Aeq: "\\sin x = 0", B: [135, 225], Beq: "\\cos x = -\\frac{\\sqrt{2}}{2}" },
  { eq: "\\sin 2x + \\cos x = 0", f: (x) => S(2 * x) + Co(x), kind: "fac", div: "\\cos x", steps: ["$2\\sin x\\cos x + \\cos x = 0$", "$\\cos x\\,(2\\sin x + 1) = 0$"], A: [90, 270], Aeq: "\\cos x = 0", B: [210, 330], Beq: "\\sin x = -\\frac{1}{2}" },
  { eq: "\\cos 2x = \\cos x", f: (x) => Co(2 * x) - Co(x), kind: "quad", steps: ["$2\\cos^2 x - 1 - \\cos x = 0$", "$(\\cos x - 1)(2\\cos x + 1) = 0$"], A: [0], Aeq: "\\cos x = 1", B: [120, 240], Beq: "\\cos x = -\\frac{1}{2}" },
  { eq: "\\cos 2x = \\sin x", f: (x) => Co(2 * x) - S(x), kind: "quad", steps: ["$1 - 2\\sin^2 x - \\sin x = 0$", "$2\\sin^2 x + \\sin x - 1 = 0$", "$(\\sin x + 1)(2\\sin x - 1) = 0$"], A: [270], Aeq: "\\sin x = -1", B: [30, 150], Beq: "\\sin x = \\frac{1}{2}" },
  { eq: "\\cos 2x + \\cos x = 0", f: (x) => Co(2 * x) + Co(x), kind: "quad", steps: ["$2\\cos^2 x - 1 + \\cos x = 0$", "$(\\cos x + 1)(2\\cos x - 1) = 0$"], A: [180], Aeq: "\\cos x = -1", B: [60, 300], Beq: "\\cos x = \\frac{1}{2}" },
  { eq: "\\cos 2x + 3\\sin x = 2", f: (x) => Co(2 * x) + 3 * S(x) - 2, kind: "quad", steps: ["$1 - 2\\sin^2 x + 3\\sin x - 2 = 0$", "$2\\sin^2 x - 3\\sin x + 1 = 0$", "$(\\sin x - 1)(2\\sin x - 1) = 0$"], A: [90], Aeq: "\\sin x = 1", B: [30, 150], Beq: "\\sin x = \\frac{1}{2}" },
];
const EXACT_VALS = {
  sin: [[0.5, "\\frac{1}{2}"], [-0.5, "-\\frac{1}{2}"], [Math.SQRT1_2, "\\frac{\\sqrt{2}}{2}"], [-Math.SQRT1_2, "-\\frac{\\sqrt{2}}{2}"], [Math.sqrt(3) / 2, "\\frac{\\sqrt{3}}{2}"], [-Math.sqrt(3) / 2, "-\\frac{\\sqrt{3}}{2}"]],
  tan: [[1, "1"], [-1, "-1"], [Math.sqrt(3), "\\sqrt{3}"], [-Math.sqrt(3), "-\\sqrt{3}"], [Math.sqrt(3) / 3, "\\frac{\\sqrt{3}}{3}"], [-Math.sqrt(3) / 3, "-\\frac{\\sqrt{3}}{3}"]],
};
EXACT_VALS.cos = EXACT_VALS.sin;
const FN = { sin: S, cos: Co, tan: (x) => Math.tan(x * DEG) };
const FN_NAME = { sin: "sinus", cos: "kosinus", tan: "tangens" };
const RULE = { sin: "x_2 = 180^\\circ - x_1", cos: "x_2 = 360^\\circ - x_1", tan: "x_2 = x_1 + 180^\\circ" };
// Rešitve fn x = v na [0°, 360°) za decimalno vrednost v (računalo): [manjša, večja].
function calcSols(fn, v) {
  if (fn === "sin") {
    const a = asinD(v);
    return { raw: a, sols: v >= 0 ? [a, 180 - a] : [180 - a, 360 + a] };
  }
  if (fn === "cos") {
    const a = acosD(v);
    return { raw: a, sols: [a, 360 - a] };
  }
  return { raw: atanD(v), sols: tanSols(v) };
}

const trig = {
  id: "gim-trig-enacbe-dop",
  topics: [T("trigonometrijske-enacbe")],
  gen(level, r) {
    if (level === 1) {
      const t = r.int(0, 2);
      if (t === 0) {
        // število rešitev osnovne enačbe (tudi brez rešitve)
        const fn = r.pick(["sin", "cos", "tan"]);
        const V = fn === "tan"
          ? [[0, "0"], [1, "1"], [-1, "-1"], [3, "3"], [-5, "-5"], [1.5, "1{,}5"], [-2.4, "-2{,}4"]]
          : [[1, "1"], [-1, "-1"], [0, "0"], [0.5, "\\frac{1}{2}"], [-Math.sqrt(3) / 2, "-\\frac{\\sqrt{3}}{2}"], [1.5, "\\frac{3}{2}"], [-1.2, "-1{,}2"], [0.3, "0{,}3"], [2, "2"]];
        const [v, vt0] = r.pick(V);
        const n = fn === "tan" ? 2 : Math.abs(v) > 1 ? 0 : Math.abs(v) === 1 ? 1 : 2;
        const eq = `\\${fn} x = ${vt0}`;
        const ms = [];
        if (fn !== "tan" && Math.abs(v) > 1) ms.push({ value: 2, why: `Vrednosti ${FN_NAME[fn]}a so le med $-1$ in $1$.` });
        if (fn !== "tan" && Math.abs(v) === 1) ms.push({ value: 2, why: "Pri vrednosti $\\pm 1$ sta »obe« rešitvi isti kot." });
        if (fn === "tan" && Math.abs(v) > 1) ms.push({ value: 0, why: "Tangens ni omejen: zavzame vsako realno vrednost." });
        if (n === 2) ms.push({ value: 1, why: `Poleg kota, ki ga da računalo, je na intervalu še en kot z isto vrednostjo ${FN_NAME[fn]}a.` });
        const sols = fn === "tan" ? tanSols(v) : n === 0 ? [] : fn === "sin" ? (v >= 0 ? [asinD(v), 180 - asinD(v)] : [180 - asinD(v), 360 + asinD(v)]) : [acosD(v), 360 - acosD(v)];
        const uniq = [...new Set(sols.map((x) => roundHalfUp(((x % 360) + 360) % 360, 1)))].sort((p, q) => p - q);
        return {
          zeroOk: true,
          text: `Koliko rešitev ima enačba $${eq}$ na intervalu $${D360}$?`,
          answer: num(n, null, ms),
          hint: fn === "tan" ? "Pomisli, katere vrednosti lahko zavzame tangens in kolikokrat v eni periodi." : `Pomisli, katere vrednosti lahko zavzame ${FN_NAME[fn]}, nato si pomagaj s krožnico ali grafom.`,
          data: { given: [eq], find: ["\\text{število rešitev}"] },
          formula: fn === "tan" ? ["\\tan x \\in \\mathbb{R}", RULE.tan] : [`-1 \\le \\${fn} x \\le 1`, RULE[fn]],
          solution: n === 0
            ? `$|${vt0}| > 1$, ${FN_NAME[fn]} pa zavzame le vrednosti od $-1$ do $1$.\nEnačba nima rešitve: $0$ rešitev.`
            : `${fn === "tan" ? "Tangens zavzame vsako realno vrednost, perioda je $180^\\circ$." : `$|${vt0}| \\le 1$, zato rešitev obstaja.`}\nRešitve na $${D360}$: $${uniq.map((x) => `${tx(x)}^\\circ`).join(",\\ ")}$${uniq.some((x) => !Number.isInteger(x)) ? " (zaokroženo)" : ""}.\nŠtevilo rešitev: $${n}$.`,
        };
      }
      if (t === 1) {
        // računalo: decimalna vrednost
        const fn = r.pick(["sin", "cos", "tan"]);
        const sgn = r.pick([1, -1]);
        const v = fn === "tan" ? (sgn * r.int(3, 40)) / 10 : (sgn * r.int(10, 95)) / 100;
        const { raw, sols } = calcSols(fn, v);
        const big = r.next() < 0.5;
        const ans = big ? sols[1] : sols[0];
        const eq = `\\${fn} x = ${tx(v)}`;
        const inv = { sin: "\\arcsin", cos: "\\arccos", tan: "\\arctan" }[fn];
        return {
          text: `Reši enačbo $${eq}$ na intervalu $${D360}$. Vpiši ${big ? "večjo" : "manjšo"} rešitev v stopinjah, zaokroženo na eno decimalko.`,
          answer: num(ans, 1, [
            { value: raw, why: "To je kot, ki ga vrne računalo. Ali leži na danem intervalu in je res iskana rešitev?" },
            { value: ans * DEG, why: "To je kot v radianih; računalo nastavi na stopinje (DEG)." },
            { value: big ? sols[0] : sols[1], why: `Vpisati moraš ${big ? "večjo" : "manjšo"} rešitev.` },
          ]),
          hint: `Z računalom (v stopinjah) izračunaj $${inv}(${tx(v)})$, nato poišči še drugi kot na intervalu z isto vrednostjo ${FN_NAME[fn]}a.`,
          data: { given: [eq], find: [big ? "x_2" : "x_1"] },
          formula: [`x_1 = ${inv}(${tx(v)})`, RULE[fn]],
          solution: `$${inv}(${tx(v)}) \\approx ${deg(raw, 2)}$\nRešitvi na $${D360}$: $x_1 \\approx ${deg(sols[0], 2)}$, $x_2 \\approx ${deg(sols[1], 2)}$\n${big ? "Večja" : "Manjša"} rešitev: $x \\approx ${deg(ans)}$`,
        };
      }
      // natančna vrednost, rešitev v radianih
      const fn = r.pick(["sin", "cos", "tan"]);
      const [v, vt0] = r.pick(EXACT_VALS[fn]);
      const sols = [];
      for (let th = 0; th < 360; th += 15) if (Math.abs(FN[fn](th) - v) < 1e-9) sols.push(th);
      const big = r.next() < 0.5;
      const d = big ? sols[1] : sols[0];
      const rad = d * DEG;
      const eq = `\\${fn} x = ${vt0}`;
      return {
        text: `Reši enačbo $${eq}$ na intervalu $[0, 2\\pi)$. Vpiši ${big ? "večjo" : "manjšo"} rešitev v radianih, zaokroženo na dve decimalki.`,
        answer: num(rad, 2, [
          { value: d, why: "To je kot v stopinjah; rezultat zapiši v radianih." },
          { value: (big ? sols[0] : sols[1]) * DEG, why: `Vpisati moraš ${big ? "večjo" : "manjšo"} rešitev.` },
        ]),
        hint: "Rešitvi najprej poišči v stopinjah (ostri kot in kvadrant s pravim predznakom), nato ju pretvori v radiane.",
        data: { given: [eq], find: [big ? "x_2" : "x_1"] },
        formula: [RULE[fn], "x\\,[\\mathrm{rad}] = x\\,[^\\circ] \\cdot \\dfrac{\\pi}{180^\\circ}"],
        solution: `Rešitvi v stopinjah: $${sols[0]}^\\circ$ in $${sols[1]}^\\circ$.\n$${d}^\\circ = ${radTex(d)}$\n$x = ${radTex(d)} \\approx ${tx(rad, 2)}$`,
      };
    }
    if (level === 2) {
      const t = r.int(0, 2);
      if (t === 0) {
        // a sin x = b cos x → tan x = b/a
        let a, b;
        do {
          a = r.nonZero(-6, 6);
          b = r.nonZero(-6, 6);
        } while (Math.abs(a) === Math.abs(b));
        const q = b / a;
        const sols = tanSols(q);
        const wrong = tanSols(a / b);
        const big = r.next() < 0.5;
        const ans = big ? sols[1] : sols[0];
        const eq = `${cf(a, "\\sin x")} = ${cf(b, "\\cos x")}`;
        return {
          text: `Reši enačbo $${eq}$ na intervalu $${D360}$. Vpiši ${big ? "večjo" : "manjšo"} rešitev v stopinjah, zaokroženo na eno decimalko.`,
          answer: num(ans, 1, [
            { value: big ? wrong[1] : wrong[0], why: "Si delil v napačni smeri? Velja $\\tan x = \\frac{\\sin x}{\\cos x}$." },
            ...(q < 0 ? [{ value: atanD(q), why: "To je kot, ki ga vrne računalo; leži zunaj danega intervala." }] : []),
            { value: big ? sols[0] : sols[1], why: `Vpisati moraš ${big ? "večjo" : "manjšo"} rešitev; perioda tangensa je $180^\\circ$.` },
          ]),
          hint: "Enačbo deli s $\\cos x$ (preveri, da $\\cos x = 0$ ni rešitev) in dobiš enačbo za $\\tan x$.",
          data: { given: [eq], find: [big ? "x_2" : "x_1"] },
          formula: ["\\tan x = \\dfrac{\\sin x}{\\cos x}", RULE.tan],
          solution: `Pri $\\cos x = 0$ bi bil $\\sin x = \\pm 1$, kar enačbi ne ustreza; zato smemo deliti s $\\cos x$.\n$\\tan x = ${ft(b, a)}$\n$\\arctan\\left(${ft(b, a)}\\right) \\approx ${deg(atanD(q), 2)}$\nRešitvi na $${D360}$: $${deg(sols[0], 2)}$ in $${deg(sols[1], 2)}$\n${big ? "Večja" : "Manjša"} rešitev: $x \\approx ${deg(ans)}$`,
        };
      }
      if (t === 1) {
        // plimovanje: h(t) = A + B sin(πt/6) ali A + B cos(πt/6)
        const fn = r.pick(["sin", "cos"]);
        const A = r.pick([3, 3.5, 4, 4.5, 5]);
        const B = r.pick([1, 1.2, 1.5, 2, 2.5]);
        const s = r.pick([1, -1]);
        const h0 = A + (s * B) / 2;
        const TIMES = { sin: { 1: [1, 5], [-1]: [7, 11] }, cos: { 1: [2, 10], [-1]: [4, 8] } };
        const ts = TIMES[fn][s];
        const second = r.next() < 0.5;
        const ans = second ? ts[1] : ts[0];
        const y = (ans * Math.PI) / 6;
        const Bt = B === 1 ? "" : tx(B);
        const model = `h(t) = ${tx(A)} + ${Bt}\\${fn}\\left(\\dfrac{\\pi t}{6}\\right)`;
        const vT = s > 0 ? "\\frac{1}{2}" : "-\\frac{1}{2}";
        const yDeg = ans * 30;
        return {
          text: `Višino morske gladine v pristanišču opisuje model $${model}$ ($h$ v metrih, $t$ v urah po polnoči, argument v radianih). Ob kateri uri je v prvih 12 urah gladina ${second ? "drugič" : "prvič"} visoka $${tx(h0)}\\ \\mathrm{m}$? Vpiši $t$ v urah.`,
          answer: num(ans, null, [
            { value: y, why: "To je vrednost argumenta $\\frac{\\pi t}{6}$; iz nje moraš še izraziti $t$." },
            { value: yDeg, why: "Argument je v radianih, ne v stopinjah." },
            { value: second ? ts[0] : ts[1], why: `Vprašanje sprašuje, kdaj je gladina ${second ? "drugič" : "prvič"} na tej višini.` },
          ]),
          hint: `Vstavi $h = ${tx(h0)}$ in izrazi $\\${fn}\\left(\\frac{\\pi t}{6}\\right)$. Za $0 \\le t < 12$ je argument med $0$ in $2\\pi$.`,
          data: { given: [model, `h = ${tx(h0)}\\ \\mathrm{m}`], find: ["t"] },
          formula: [`\\${fn} y = ${vT}:\\ y = ${radTex(ts[0] * 30)}, ${radTex(ts[1] * 30)}`, "t = \\dfrac{6y}{\\pi}"],
          solution: `$${tx(A)} + ${Bt}\\${fn}\\left(\\frac{\\pi t}{6}\\right) = ${tx(h0)}$ $\\Rightarrow$ $\\${fn}\\left(\\frac{\\pi t}{6}\\right) = ${vT}$\nNa $[0, 2\\pi)$: $\\frac{\\pi t}{6} = ${radTex(ts[0] * 30)}$ ali $${radTex(ts[1] * 30)}$\n$t = ${ts[0]}\\ \\mathrm{h}$ ali $t = ${ts[1]}\\ \\mathrm{h}$\n${second ? "Drugič" : "Prvič"}: $t = ${ans}\\ \\mathrm{h}$`,
        };
      }
      // panoramsko kolo: h(t) = H − R cos(2πt/T)
      const Tp = r.pick([12, 18, 24, 30, 36]);
      const R = r.pick([10, 15, 20, 25]);
      const H = R + r.int(1, 4);
      const [c, cT, th, thT] = r.pick([[0.5, "\\frac{1}{2}", Math.PI / 3, "\\frac{\\pi}{3}"], [0, "0", Math.PI / 2, "\\frac{\\pi}{2}"], [-0.5, "-\\frac{1}{2}", (2 * Math.PI) / 3, "\\frac{2\\pi}{3}"]]);
      const h0 = H - R * c;
      const t1 = (Tp * th) / (2 * Math.PI);
      const t2 = Tp - t1;
      const second = r.next() < 0.5;
      const ans = second ? t2 : t1;
      const model = `h(t) = ${H} - ${R}\\cos\\left(\\dfrac{2\\pi t}{${Tp}}\\right)`;
      const nm = name(r);
      return {
        text: `${nm} vstopi v kabino panoramskega kolesa. Višina kabine je $${model}$ ($h$ v metrih, $t$ v minutah od vstopa, argument v radianih). Čez koliko minut je kabina ${second ? "drugič" : "prvič"} na višini $${tx(h0)}\\ \\mathrm{m}$?`,
        answer: num(ans, 2, [
          { value: th / DEG, why: "To je kot v stopinjah; argument je v radianih, iz njega moraš izraziti $t$." },
          { value: (Tp * th) / Math.PI, why: `Pri izražanju $t$ iz $\\frac{2\\pi t}{${Tp}}$ deliš z $2\\pi$, ne le s $\\pi$.` },
          { value: second ? t1 : t2, why: `Vprašanje sprašuje, kdaj je kabina ${second ? "drugič" : "prvič"} na tej višini.` },
        ], "min"),
        hint: `Vstavi $h = ${tx(h0)}$ in izrazi $\\cos\\left(\\frac{2\\pi t}{${Tp}}\\right)$. Rešitve argumenta išči na $[0, 2\\pi)$.`,
        data: { given: [model, `h = ${tx(h0)}\\ \\mathrm{m}`], find: ["t"] },
        formula: ["\\cos y = c:\\ y_1 = \\arccos c,\\ y_2 = 2\\pi - y_1", `t = \\dfrac{${Tp}\\,y}{2\\pi}`],
        solution: `$${H} - ${R}\\cos\\left(\\frac{2\\pi t}{${Tp}}\\right) = ${tx(h0)}$ $\\Rightarrow$ $\\cos\\left(\\frac{2\\pi t}{${Tp}}\\right) = ${cT}$\n$\\frac{2\\pi t}{${Tp}} = ${thT}$ ali $2\\pi - ${thT}$\n$t_1 = ${tx(t1)}\\ \\mathrm{min}$, $t_2 = ${Tp} - ${tx(t1)} = ${tx(t2)}\\ \\mathrm{min}$\n${second ? "Drugič" : "Prvič"}: $t = ${tx(ans)}\\ \\mathrm{min}$`,
      };
    }
    // ---------- raven 3 ----------
    const t = r.int(0, 2);
    if (t === 0) {
      const e = r.pick(DBL);
      const all = [...e.A, ...e.B].sort((p, q) => p - q);
      const ask = r.pick(["count", "sum", "max"]);
      const lostWhy = e.kind === "fac" ? `Si enačbo delil s $${e.div}$? Tako izgubiš rešitve enačbe $${e.Aeq}$.` : `Si upošteval obe rešitvi kvadratne enačbe (tudi $${e.Aeq}$)?`;
      const ms = [];
      if (ask === "count") {
        ms.push({ value: e.B.length, why: lostWhy });
        if (e.kind === "quad") ms.push({ value: all.length + 1, why: "Pri vrednosti $\\pm 1$ ima enačba na intervalu le eno rešitev." });
      } else if (ask === "sum") ms.push({ value: sum(e.B), why: lostWhy }, { value: sum(e.A), why: `Si upošteval tudi rešitve enačbe $${e.Beq}$?` });
      else ms.push({ value: Math.max(...e.B), why: lostWhy }, { value: Math.max(...e.A), why: `Si upošteval tudi rešitve enačbe $${e.Beq}$?` });
      const ans = ask === "count" ? all.length : ask === "sum" ? sum(all) : Math.max(...all);
      const usesSin2 = e.eq.includes("\\sin 2x");
      return {
        text: ask === "count" ? `Koliko rešitev ima enačba $${e.eq}$ na intervalu $${D360}$?` : ask === "sum" ? `Reši enačbo $${e.eq}$ na intervalu $${D360}$. Vpiši vsoto vseh rešitev v stopinjah.` : `Reši enačbo $${e.eq}$ na intervalu $${D360}$. Vpiši največjo rešitev v stopinjah.`,
        answer: num(ans, null, ms),
        hint: usesSin2 ? "Uporabi $\\sin 2x = 2\\sin x\\cos x$, vse prenesi na eno stran in izpostavi skupni faktor. Ne deli z izrazom, ki je lahko 0." : "Izrazi $\\cos 2x$ z eno samo kotno funkcijo in reši kvadratno enačbo.",
        data: { given: [e.eq], find: [ask === "count" ? "\\text{število rešitev}" : ask === "sum" ? "\\text{vsota rešitev}" : "x_{\\max}"] },
        formula: usesSin2 ? ["\\sin 2x = 2\\sin x\\cos x", "A \\cdot B = 0 \\iff A = 0 \\lor B = 0"] : ["\\cos 2x = 2\\cos^2 x - 1 = 1 - 2\\sin^2 x"],
        solution: `${e.steps.join("\n")}\n$${e.Aeq}$: $x = ${e.A.map((x) => `${x}^\\circ`).join(",\\ ")}$\n$${e.Beq}$: $x = ${e.B.map((x) => `${x}^\\circ`).join(",\\ ")}$\n${ask === "count" ? `Skupaj $${all.length}$ rešitve.` : ask === "sum" ? `Vsota: $${all.join(" + ")} = ${sum(all)}$` : `Največja rešitev: $${Math.max(...all)}^\\circ$`}`,
      };
    }
    if (t === 1) {
      // panoramsko kolo: koliko časa je kabina nad/pod dano višino
      const Tp = r.pick([10, 12, 15, 20, 24]);
      const R = r.pick([12, 15, 18, 20, 25, 30]);
      const H = R + r.int(2, 5);
      const h0 = r.int(H - R + 3, H + R - 3);
      if (h0 === H) return null;
      const c = (H - h0) / R;
      const th = Math.acos(c);
      const t1 = (Tp * th) / (2 * Math.PI);
      const t2 = Tp - t1;
      const above = r.next() < 0.5;
      const ans = above ? t2 - t1 : Tp - (t2 - t1);
      const model = `h(t) = ${H} - ${R}\\cos\\left(\\dfrac{2\\pi t}{${Tp}}\\right)`;
      return {
        text: `Višina kabine panoramskega kolesa je $${model}$ ($h$ v metrih, $t$ v minutah, argument v radianih). Koliko minut v enem obratu je kabina ${above ? "višje" : "nižje"} od $${h0}\\ \\mathrm{m}$? Zaokroži na eno decimalko.`,
        answer: num(ans, 1, [
          { value: Tp - ans, why: `To je čas, ko je kabina ${above ? "nižje" : "višje"} od dane višine.` },
          { value: t1, why: "To je šele trenutek, ko kabina prvič doseže to višino; iščeš dolžino časovnega intervala." },
          { value: t2, why: "To je trenutek, ko je kabina drugič na tej višini; čas dobiš kot razliko obeh trenutkov." },
        ], "min"),
        hint: `Najprej reši enačbo $h(t) = ${h0}$ na enem obratu ($0 \\le t < ${Tp}$), nato premisli, med katerima trenutkoma je kabina ${above ? "višje" : "nižje"}.`,
        data: { given: [model, `h = ${h0}\\ \\mathrm{m}`], find: ["\\Delta t"] },
        formula: ["\\cos y = c:\\ y_1 = \\arccos c,\\ y_2 = 2\\pi - y_1", `t = \\dfrac{${Tp}\\,y}{2\\pi}`],
        solution: `$\\cos\\left(\\frac{2\\pi t}{${Tp}}\\right) = \\dfrac{${H} - ${h0}}{${R}} ${c === roundHalfUp(c, 4) ? "=" : "\\approx"} ${tx(c, 4)}$\n$y_1 = \\arccos(${tx(c, 4)}) \\approx ${tx(th, 4)}$, $y_2 = 2\\pi - y_1$\n$t_1 \\approx ${tx(t1, 2)}\\ \\mathrm{min}$, $t_2 \\approx ${tx(t2, 2)}\\ \\mathrm{min}$\nMed $t_1$ in $t_2$ je kabina višje od $${h0}\\ \\mathrm{m}$${above ? "" : ", sicer nižje"}.\n$\\Delta t ${above ? "= t_2 - t_1" : `= ${Tp} - (t_2 - t_1)`} \\approx ${tx(ans, 1)}\\ \\mathrm{min}$`,
      };
    }
    // homogena enačba: sin²x + B sin x cos x + C cos²x = 0 → tan²x + B tan x + C = 0
    let t1, t2;
    do {
      t1 = r.pick([-3, -2, -1, 1, 2, 3, 4]);
      t2 = r.pick([-3, -2, -1, 1, 2, 3, 4]);
    } while (t1 >= t2);
    const B = -(t1 + t2);
    const C = t1 * t2;
    const eq = `\\sin^2 x${cn(B, "\\sin x\\cos x")}${cn(C, "\\cos^2 x")} = 0`;
    const s1 = tanSols(t1);
    const s2 = tanSols(t2);
    const all = [...s1, ...s2].sort((p, q) => p - q);
    const big = r.next() < 0.5;
    const ans = big ? all[3] : all[0];
    const w = [...tanSols(-t1), ...tanSols(-t2)].sort((p, q) => p - q);
    const ms = big
      ? [{ value: Math.max(s1[0], s2[0]), why: "Tangens ima periodo $180^\\circ$: vsaki rešitvi prištej še $180^\\circ$." }, { value: w[3], why: "Preveri predznaka rešitev kvadratne enačbe za $\\tan x$ (Vietove formule)." }]
      : [{ value: Math.min(atanD(t1), atanD(t2)), why: "To je kot, ki ga vrne računalo; leži zunaj danega intervala." }, { value: w[0], why: "Preveri predznaka rešitev kvadratne enačbe za $\\tan x$ (Vietove formule)." }];
    const line = (tv, ss) => `$\\tan x = ${tv}$: $x \\approx ${deg(ss[0], 2)}$, $${deg(ss[1], 2)}$`;
    return {
      text: `Reši enačbo $${eq}$ na intervalu $${D360}$. Vpiši ${big ? "največjo" : "najmanjšo"} rešitev v stopinjah, zaokroženo na eno decimalko.`,
      answer: num(ans, 1, ms),
      hint: "Preveri, ali je $\\cos x = 0$ lahko rešitev. Nato enačbo deli s $\\cos^2 x$ in dobiš kvadratno enačbo za $\\tan x$.",
      data: { given: [eq], find: [big ? "x_{\\max}" : "x_{\\min}"] },
      formula: ["\\tan x = \\dfrac{\\sin x}{\\cos x}", RULE.tan],
      solution: `Če je $\\cos x = 0$, je $\\sin^2 x = 1$ in leva stran ni 0, zato smemo deliti s $\\cos^2 x$.\n$\\tan^2 x${cn(B, "\\tan x")} ${sg(C)} = 0$\n$\\tan x = ${t1}$ ali $\\tan x = ${t2}$\n${line(t1, s1)}\n${line(t2, s2)}\n${big ? "Največja" : "Najmanjša"} rešitev: $x \\approx ${deg(ans)}$`,
    };
  },
};

// ================= sinusni in kosinusni izrek =================
const sinkos = {
  id: "gim-sin-kos-izrek-dop",
  topics: [T("sinusni-in-kosinusni-izrek")],
  gen(level, r) {
    if (level === 1) {
      const t = r.int(0, 2);
      if (t === 0) {
        // pojmovna izbira: kateri izrek
        const kind = r.pick(["sas", "sss", "aas"]);
        const PIT = ["Pitagorov izrek", "Pitagorov izrek velja le v pravokotnem trikotniku, ta pa ni pravokoten."];
        if (kind === "sas") {
          const b = r.int(4, 15);
          const c = r.int(4, 15);
          const al = r.pick([35, 48, 52, 65, 72, 105, 118, 130]);
          return {
            text: `V trikotniku $ABC$ poznamo $b = ${b}\\ \\mathrm{cm}$, $c = ${c}\\ \\mathrm{cm}$ in kot med njima $\\alpha = ${al}^\\circ$. S katerim izrekom neposredno izračunaš stranico $a$?`,
            answer: pickAns(r, "kosinusni izrek", [
              ["sinusni izrek", "Za sinusni izrek potrebuješ znano stranico in njej nasprotni kot; tu takega para ni."],
              PIT,
              ["obrazec za ploščino trikotnika", "Obrazec $S = \\frac{1}{2}bc\\sin\\alpha$ da ploščino, ne stranice."],
            ]),
            hint: "Poglej, ali poznaš kakšno stranico skupaj z nasproti ležečim kotom.",
            data: { given: [`b = ${b}\\ \\mathrm{cm}`, `c = ${c}\\ \\mathrm{cm}`, `\\alpha = ${al}^\\circ`], find: ["\\text{izrek za } a"] },
            formula: ["a^2 = b^2 + c^2 - 2bc\\cos\\alpha", "\\dfrac{a}{\\sin\\alpha} = \\dfrac{b}{\\sin\\beta}"],
            solution: `Znani sta dve stranici in kot med njima, nobena stranica pa nima znanega nasprotnega kota.\nZato uporabimo kosinusni izrek: $a^2 = b^2 + c^2 - 2bc\\cos\\alpha$.`,
          };
        }
        if (kind === "sss") {
          let a, b, c;
          do {
            a = r.int(4, 15);
            b = r.int(4, 15);
            c = r.int(4, 18);
          } while (a + b <= c || a + c <= b || b + c <= a || a * a + b * b === c * c || a * a + c * c === b * b || b * b + c * c === a * a);
          return {
            text: `V trikotniku $ABC$ poznamo vse tri stranice: $a = ${a}\\ \\mathrm{m}$, $b = ${b}\\ \\mathrm{m}$ in $c = ${c}\\ \\mathrm{m}$. S katerim izrekom neposredno izračunaš kot $\\gamma$?`,
            answer: pickAns(r, "kosinusni izrek", [
              ["sinusni izrek", "Ne poznaš še nobenega kota, zato sinusni izrek še ne pomaga."],
              PIT,
              ["obrazec za ploščino trikotnika", "Za ploščino s sinusom kota bi kot že moral poznati."],
            ]),
            hint: "Kateri izrek povezuje tri stranice in en kot?",
            data: { given: [`a = ${a}\\ \\mathrm{m}`, `b = ${b}\\ \\mathrm{m}`, `c = ${c}\\ \\mathrm{m}`], find: ["\\text{izrek za } \\gamma"] },
            formula: ["c^2 = a^2 + b^2 - 2ab\\cos\\gamma"],
            solution: `Znane so tri stranice, nobenega kota še ne poznamo.\nKosinusni izrek: $\\cos\\gamma = \\dfrac{a^2 + b^2 - c^2}{2ab}$.`,
          };
        }
        const a = r.int(4, 15);
        let al, be;
        do {
          al = r.int(30, 100);
          be = r.int(25, 90);
        } while (al + be > 160 || al + be === 90 || al === be || al === 90 || be === 90);
        return {
          text: `V trikotniku $ABC$ poznamo $a = ${a}\\ \\mathrm{cm}$, $\\alpha = ${al}^\\circ$ in $\\beta = ${be}^\\circ$. S katerim izrekom neposredno izračunaš stranico $b$?`,
          answer: pickAns(r, "sinusni izrek", [
            ["kosinusni izrek", "Kosinusni izrek potrebuje vsaj dve znani stranici; tu poznaš le eno."],
            PIT,
            ["izrek o vsoti notranjih kotov", "Vsota kotov da tretji kot, ne pa dolžine stranice."],
          ]),
          hint: "Ali poznaš stranico skupaj z nasproti ležečim kotom?",
          data: { given: [`a = ${a}\\ \\mathrm{cm}`, `\\alpha = ${al}^\\circ`, `\\beta = ${be}^\\circ`], find: ["\\text{izrek za } b"] },
          formula: ["\\dfrac{a}{\\sin\\alpha} = \\dfrac{b}{\\sin\\beta}"],
          solution: `Poznamo par $a$, $\\alpha$ (stranica in nasprotni kot) ter kot $\\beta$ nasproti iskane stranice $b$.\nSinusni izrek: $b = \\dfrac{a\\sin\\beta}{\\sin\\alpha}$.`,
        };
      }
      if (t === 1) {
        // ploščina iz dveh stranic in kota
        const b = r.dec(3, 15, 1);
        const c = r.dec(3, 15, 1);
        const al = r.int(25, 150);
        if (al === 90) return null;
        const Sv = 0.5 * b * c * S(al);
        const [ctx, u] = r.pick([["Trikotnik $ABC$ ima", "cm"], ["Trikotna gredica ima", "m"], ["Trikotna jadrovina ima", "m"]]);
        return {
          text: `${ctx} stranici $b = ${tx(b)}\\ \\mathrm{${u}}$ in $c = ${tx(c)}\\ \\mathrm{${u}}$, ki oklepata kot $\\alpha = ${al}^\\circ$. Izračunaj ploščino. Zaokroži na dve decimalki.`,
          answer: num(Sv, 2, [
            { value: 2 * Sv, why: "Si pozabil na faktor $\\frac{1}{2}$?" },
            { value: 0.5 * b * c * Co(al), why: "V obrazcu za ploščino je sinus kota, ne kosinus." },
            { value: 0.5 * b * c * Math.sin(al), why: "Je računalo nastavljeno na radiane? Kot je v stopinjah (DEG)." },
          ], `${u}²`),
          hint: "Ploščino trikotnika izračunaš iz dveh stranic in sinusa kota med njima.",
          data: { given: [`b = ${tx(b)}\\ \\mathrm{${u}}`, `c = ${tx(c)}\\ \\mathrm{${u}}`, `\\alpha = ${al}^\\circ`], find: ["S"] },
          formula: "S = \\dfrac{1}{2}bc\\sin\\alpha",
          solution: `$S = \\dfrac{1}{2} \\cdot ${tx(b)} \\cdot ${tx(c)} \\cdot \\sin ${al}^\\circ$\n$S \\approx ${tx(Sv, 2)}\\ \\mathrm{${u}^2}$`,
        };
      }
      // polmer očrtane krožnice
      const a = r.dec(3, 15, 1);
      const al = r.int(20, 160);
      if (al === 90) return null;
      const R = a / (2 * S(al));
      return {
        text: `V trikotniku $ABC$ je $a = ${tx(a)}\\ \\mathrm{cm}$ in $\\alpha = ${al}^\\circ$. Izračunaj polmer trikotniku očrtane krožnice. Zaokroži na dve decimalki.`,
        answer: num(R, 2, [
          { value: a / S(al), why: "Kvocient $\\frac{a}{\\sin\\alpha}$ je premer očrtane krožnice, ne polmer." },
          ...(al < 90 ? [{ value: a / (2 * Co(al)), why: "V razširjenem sinusnem izreku nastopa sinus, ne kosinus." }] : []),
          { value: a / (2 * Math.sin(al)), why: "Je računalo nastavljeno na radiane? Kot je v stopinjah (DEG)." },
        ], "cm"),
        hint: "Razširjeni sinusni izrek: razmerje stranice in sinusa nasprotnega kota je enako premeru očrtane krožnice.",
        data: { given: [`a = ${tx(a)}\\ \\mathrm{cm}`, `\\alpha = ${al}^\\circ`], find: ["R"] },
        formula: "\\dfrac{a}{\\sin\\alpha} = 2R",
        solution: `$2R = \\dfrac{${tx(a)}}{\\sin ${al}^\\circ} \\approx ${tx(2 * R, 3)}\\ \\mathrm{cm}$\n$R \\approx ${tx(R, 2)}\\ \\mathrm{cm}$`,
      };
    }
    if (level === 2) {
      const t = r.int(0, 2);
      if (t === 0) {
        // SSA z enolično rešitvijo (a > b): β, nato γ (in c)
        const b = r.dec(3, 10, 1);
        const a = roundHalfUp(b + r.dec(0.5, 6, 1), 1);
        const al = r.int(25, 115);
        if (al === 90) return null;
        const sb = (b * S(al)) / a;
        const be = asinD(sb);
        const ga = 180 - al - be;
        const c = (a * S(ga)) / S(al);
        const askC = r.next() < 0.5;
        return {
          text: `V trikotniku $ABC$ je $a = ${tx(a)}\\ \\mathrm{cm}$, $b = ${tx(b)}\\ \\mathrm{cm}$ in $\\alpha = ${al}^\\circ$. ${askC ? "Izračunaj stranico $c$. Zaokroži na dve decimalki." : "Izračunaj kot $\\gamma$ v stopinjah. Zaokroži na eno decimalko."}`,
          answer: askC
            ? num(c, 2, [
                { value: (a * S(be)) / S(al), why: "To je stranica $b$ nasproti kota $\\beta$; za $c$ potrebuješ kot $\\gamma$." },
                { value: Math.sqrt(a * a + b * b), why: "Trikotnik ni pravokoten; Pitagorov izrek tu ne velja." },
              ], "cm")
            : num(ga, 1, [
                { value: be, why: "To je kot $\\beta$; kot $\\gamma$ dobiš iz vsote kotov v trikotniku." },
                { value: ga * DEG, why: "To je kot v radianih; zapiši ga v stopinjah." },
              ]),
          hint: "Iz sinusnega izreka najprej izračunaj kot $\\beta$ nasproti stranice $b$, nato $\\gamma$ iz vsote kotov.",
          data: { given: [`a = ${tx(a)}\\ \\mathrm{cm}`, `b = ${tx(b)}\\ \\mathrm{cm}`, `\\alpha = ${al}^\\circ`], find: [askC ? "c" : "\\gamma"] },
          formula: ["\\sin\\beta = \\dfrac{b\\sin\\alpha}{a}", "\\gamma = 180^\\circ - \\alpha - \\beta", ...(askC ? ["c = \\dfrac{a\\sin\\gamma}{\\sin\\alpha}"] : [])],
          solution: `$\\sin\\beta = \\dfrac{${tx(b)} \\cdot \\sin ${al}^\\circ}{${tx(a)}} \\approx ${tx(sb, 4)}$\nKer je $b < a$, je $\\beta$ oster: $\\beta \\approx ${deg(be, 2)}$\n$\\gamma = 180^\\circ - ${al}^\\circ - ${deg(be, 2)} \\approx ${deg(ga, 2)}$${askC ? `\n$c = \\dfrac{${tx(a)} \\cdot \\sin\\gamma}{\\sin ${al}^\\circ} \\approx ${tx(c, 2)}\\ \\mathrm{cm}$` : `\n$\\gamma \\approx ${deg(ga)}$`}`,
        };
      }
      if (t === 1) {
        // diagonali paralelograma
        const a = r.dec(3, 12, 1);
        const b = r.dec(3, 12, 1);
        const al = r.int(35, 85);
        const e = Math.sqrt(a * a + b * b + 2 * a * b * Co(al));
        const f = Math.sqrt(a * a + b * b - 2 * a * b * Co(al));
        const longer = r.next() < 0.5;
        const ctx = r.pick(["Paralelogram ima", "Okvir v obliki paralelograma ima", "Gredica v obliki paralelograma ima"]);
        const u = ctx.startsWith("Gredica") ? "m" : "cm";
        return {
          text: `${ctx} stranici $a = ${tx(a)}\\ \\mathrm{${u}}$ in $b = ${tx(b)}\\ \\mathrm{${u}}$, ostri kot med njima meri $${al}^\\circ$. Izračunaj ${longer ? "daljšo" : "krajšo"} diagonalo. Zaokroži na dve decimalki.`,
          answer: num(longer ? e : f, 2, [
            { value: longer ? f : e, why: `To je ${longer ? "krajša" : "daljša"} diagonala; ${longer ? "daljša leži nasproti topega kota" : "krajša leži nasproti ostrega kota"}.` },
            { value: Math.sqrt(a * a + b * b), why: "Paralelogram ni pravokotnik; pri kosinusnem izreku manjka člen s kosinusom." },
          ], u),
          hint: `Diagonala razdeli paralelogram na dva trikotnika. ${longer ? "Daljša diagonala leži nasproti topega kota $180^\\circ - \\alpha$." : "Krajša diagonala leži nasproti ostrega kota $\\alpha$."}`,
          data: { given: [`a = ${tx(a)}\\ \\mathrm{${u}}`, `b = ${tx(b)}\\ \\mathrm{${u}}`, `\\alpha = ${al}^\\circ`], find: [longer ? "e" : "f"] },
          formula: longer ? ["e^2 = a^2 + b^2 - 2ab\\cos(180^\\circ - \\alpha)", "\\cos(180^\\circ - \\alpha) = -\\cos\\alpha"] : "f^2 = a^2 + b^2 - 2ab\\cos\\alpha",
          solution: longer
            ? `Daljša diagonala leži nasproti kota $180^\\circ - ${al}^\\circ = ${180 - al}^\\circ$.\n$e^2 = ${tx(a)}^2 + ${tx(b)}^2 - 2 \\cdot ${tx(a)} \\cdot ${tx(b)} \\cdot \\cos ${180 - al}^\\circ \\approx ${tx(e * e, 3)}\\ \\mathrm{${u}^2}$\n$e \\approx ${tx(e, 2)}\\ \\mathrm{${u}}$`
            : `Krajša diagonala leži nasproti ostrega kota $${al}^\\circ$.\n$f^2 = ${tx(a)}^2 + ${tx(b)}^2 - 2 \\cdot ${tx(a)} \\cdot ${tx(b)} \\cdot \\cos ${al}^\\circ \\approx ${tx(f * f, 3)}\\ \\mathrm{${u}^2}$\n$f \\approx ${tx(f, 2)}\\ \\mathrm{${u}}$`,
        };
      }
      // obratna: iz ploščine kot
      const b = r.int(5, 30);
      const c = r.int(5, 30);
      const al0 = r.int(20, 80);
      const Sv = roundHalfUp(0.5 * b * c * S(al0), 1);
      const sa = (2 * Sv) / (b * c);
      if (sa >= 1) return null;
      const al = asinD(sa);
      const ctx = r.pick(["Trikotna njiva", "Trikotno parkirišče", "Trikotna trata"]);
      return {
        text: `${ctx} ima ploščino $${tx(Sv)}\\ \\mathrm{m^2}$. Stranici ob oglišču $A$ merita $b = ${b}\\ \\mathrm{m}$ in $c = ${c}\\ \\mathrm{m}$, kot $\\alpha$ med njima je oster. Kolikšen je $\\alpha$ v stopinjah? Zaokroži na eno decimalko.`,
        answer: num(al, 1, [
          { value: asinD(Sv / (b * c)), why: "Si pozabil na faktor $\\frac{1}{2}$ v obrazcu za ploščino?" },
          { value: 180 - al, why: "Kot je oster, zato vzemi rešitev pod $90^\\circ$." },
          { value: al * DEG, why: "To je kot v radianih; zapiši ga v stopinjah." },
        ]),
        hint: "V obrazec za ploščino vstavi znane količine in izrazi $\\sin\\alpha$.",
        data: { given: [`S = ${tx(Sv)}\\ \\mathrm{m^2}`, `b = ${b}\\ \\mathrm{m}`, `c = ${c}\\ \\mathrm{m}`], find: ["\\alpha"] },
        formula: ["S = \\dfrac{1}{2}bc\\sin\\alpha", "\\sin\\alpha = \\dfrac{2S}{bc}"],
        solution: `$\\sin\\alpha = \\dfrac{2 \\cdot ${tx(Sv)}}{${b} \\cdot ${c}} \\approx ${tx(sa, 4)}$\nKot je oster: $\\alpha = \\arcsin(${tx(sa, 4)})$\n$\\alpha \\approx ${deg(al)}$`,
      };
    }
    // ---------- raven 3 ----------
    const t = r.int(0, 2);
    // koliko trikotnikov ustreza podatkom a, b, α (dvoumni primer)
    const ssa = (a, b, al) => {
      const sb = (b * S(al)) / a;
      if (sb > 1 + 1e-12) return { n: 0, sb };
      const b1 = asinD(Math.min(1, sb));
      const out = [];
      if (al + b1 < 180 - 1e-9) out.push(b1);
      if (Math.abs(180 - b1 - b1) > 1e-9 && al + 180 - b1 < 180 - 1e-9) out.push(180 - b1);
      return { n: out.length, sb, b1, bs: out };
    };
    if (t === 0) {
      const type = r.pick(["0", "1", "2", "2", "obt"]);
      let al = r.int(25, 70);
      const b = r.int(6, 15);
      let a;
      if (type === "obt") {
        al = r.int(100, 140);
        a = r.next() < 0.5 ? roundHalfUp(b + r.dec(0.5, 5, 1), 1) : roundHalfUp(b - r.dec(0.5, 3, 1), 1);
      } else {
        const h = b * S(al);
        if (type === "0") a = roundHalfUp(h * r.dec(0.5, 0.9, 2), 1);
        else if (type === "2") a = roundHalfUp(h + (b - h) * r.dec(0.2, 0.8, 2), 1);
        else a = roundHalfUp(b + r.dec(0.5, 5, 1), 1);
        if (Math.abs(a - h) < 0.05 || Math.abs(a - b) < 0.05) return null;
      }
      if (a <= 0.5) return null;
      const res = ssa(a, b, al);
      const n = res.n;
      const ms = n === 2
        ? [{ value: 1, why: "Si preveril tudi topi kot $\\beta_2 = 180^\\circ - \\beta_1$?" }]
        : n === 1
          ? [{ value: 2, why: "Preveri, ali je pri drugem kotu $\\beta_2 = 180^\\circ - \\beta_1$ vsota $\\alpha + \\beta_2$ še manjša od $180^\\circ$." }]
          : [{ value: 1, why: "Preveri, ali kot $\\beta$ sploh obstaja ($\\sin\\beta \\le 1$) in ali je vsota kotov manjša od $180^\\circ$." }, { value: 2, why: "Kot $\\beta$ mora obstajati in vsota $\\alpha + \\beta$ mora biti manjša od $180^\\circ$." }];
      const lines = [`$\\sin\\beta = \\dfrac{b\\sin\\alpha}{a} = \\dfrac{${b} \\cdot \\sin ${al}^\\circ}{${tx(a)}} \\approx ${tx(res.sb, 4)}$`];
      if (res.sb > 1) lines.push("$\\sin\\beta > 1$: takega kota ni, trikotnik ne obstaja.");
      else {
        const b1 = res.b1;
        lines.push(`$\\beta_1 \\approx ${deg(b1, 2)}$: $\\alpha + \\beta_1 ${al + b1 < 180 ? "<" : "\\ge"} 180^\\circ$ ${al + b1 < 180 ? "(trikotnik obstaja)" : "(ni trikotnika)"}`);
        lines.push(`$\\beta_2 = 180^\\circ - \\beta_1 \\approx ${deg(180 - b1, 2)}$: $\\alpha + \\beta_2 ${al + 180 - b1 < 180 ? "<" : "\\ge"} 180^\\circ$ ${al + 180 - b1 < 180 ? "(trikotnik obstaja)" : "(ni trikotnika)"}`);
      }
      lines.push(`Število trikotnikov: $${n}$`);
      return {
        zeroOk: true,
        text: `Za trikotnik $ABC$ poznamo $a = ${tx(a)}\\ \\mathrm{cm}$, $b = ${b}\\ \\mathrm{cm}$ in $\\alpha = ${al}^\\circ$. Koliko različnih trikotnikov ustreza tem podatkom?`,
        answer: num(n, null, ms),
        hint: "S sinusnim izrekom izračunaj $\\sin\\beta$. Nato preveri oba kota z isto vrednostjo sinusa (ostri in topi).",
        data: { given: [`a = ${tx(a)}\\ \\mathrm{cm}`, `b = ${b}\\ \\mathrm{cm}`, `\\alpha = ${al}^\\circ`], find: ["\\text{število trikotnikov}"] },
        formula: ["\\sin\\beta = \\dfrac{b\\sin\\alpha}{a}", "\\beta_2 = 180^\\circ - \\beta_1"],
        solution: lines.join("\n"),
      };
    }
    if (t === 1) {
      // dvoumni primer: topi β in pripadajoča stranica c
      const al = r.int(25, 65);
      const b = r.int(6, 15);
      const h = b * S(al);
      const a = roundHalfUp(h + (b - h) * r.dec(0.25, 0.75, 2), 1);
      const res = ssa(a, b, al);
      if (res.n !== 2) return null;
      const [b1, b2] = res.bs;
      const g1 = 180 - al - b1;
      const g2 = 180 - al - b2;
      const c1 = (a * S(g1)) / S(al);
      const c2 = (a * S(g2)) / S(al);
      const askC = r.next() < 0.5;
      return {
        text: `Podatkom $a = ${tx(a)}\\ \\mathrm{cm}$, $b = ${b}\\ \\mathrm{cm}$ in $\\alpha = ${al}^\\circ$ ustrezata dva trikotnika. V enem je kot $\\beta$ top. ${askC ? "Kolikšna je v tem trikotniku stranica $c$? Zaokroži na dve decimalki." : "Koliko meri ta topi kot $\\beta$ v stopinjah? Zaokroži na eno decimalko."}`,
        answer: askC
          ? num(c2, 2, [
              { value: c1, why: "To je stranica $c$ v trikotniku z ostrim kotom $\\beta$." },
              { value: (a * S(b2)) / S(al), why: "Za stranico $c$ potrebuješ nasprotni kot $\\gamma$, ne $\\beta$." },
            ], "cm")
          : num(b2, 1, [
              { value: b1, why: "To je ostri kot z enako vrednostjo sinusa; iščeš topega." },
              { value: 180 - al - b1, why: "To je kot $\\gamma$ v trikotniku z ostrim $\\beta$." },
              { value: b2 * DEG, why: "To je kot v radianih; zapiši ga v stopinjah." },
            ]),
        hint: "S sinusnim izrekom izračunaj $\\sin\\beta$. Topi kot z istim sinusom je $180^\\circ - \\beta_1$.",
        data: { given: [`a = ${tx(a)}\\ \\mathrm{cm}`, `b = ${b}\\ \\mathrm{cm}`, `\\alpha = ${al}^\\circ`], find: [askC ? "c" : "\\beta_2"] },
        formula: ["\\sin\\beta = \\dfrac{b\\sin\\alpha}{a}", "\\beta_2 = 180^\\circ - \\beta_1", ...(askC ? ["c = \\dfrac{a\\sin\\gamma}{\\sin\\alpha}"] : [])],
        solution: `$\\sin\\beta = \\dfrac{${b} \\cdot \\sin ${al}^\\circ}{${tx(a)}} \\approx ${tx(res.sb, 4)}$\n$\\beta_1 \\approx ${deg(b1, 2)}$, $\\beta_2 = 180^\\circ - \\beta_1 \\approx ${deg(b2, 2)}$${askC ? `\n$\\gamma_2 = 180^\\circ - ${al}^\\circ - \\beta_2 \\approx ${deg(g2, 2)}$\n$c = \\dfrac{${tx(a)} \\cdot \\sin\\gamma_2}{\\sin ${al}^\\circ} \\approx ${tx(c2, 2)}\\ \\mathrm{cm}$` : `\nTopi kot: $\\beta \\approx ${deg(b2)}$`}`,
      };
    }
    // ploščina zemljišča iz treh stranic
    let a, b, c;
    do {
      a = r.int(12, 60);
      b = r.int(12, 60);
      c = r.int(12, 70);
    } while (a + b <= c + 3 || a + c <= b + 3 || b + c <= a + 3);
    const cg = (a * a + b * b - c * c) / (2 * a * b);
    const ga = acosD(cg);
    const Sv = 0.5 * a * b * S(ga);
    const nm = name(r);
    return {
      text: `${nm} ${g(nm, "je kupil", "je kupila")} trikotno zemljišče s stranicami $a = ${a}\\ \\mathrm{m}$, $b = ${b}\\ \\mathrm{m}$ in $c = ${c}\\ \\mathrm{m}$. Kolikšna je njegova ploščina? Zaokroži na eno decimalko.`,
      answer: num(Sv, 1, [
        { value: a * b * S(ga), why: "Si pozabil na faktor $\\frac{1}{2}$ v obrazcu za ploščino?" },
        { value: Math.abs(0.5 * a * b * cg), why: "V obrazcu za ploščino je sinus kota, ne kosinus." },
        { value: 0.5 * a * b, why: "Trikotnik ni pravokoten; najprej izračunaj kot med stranicama." },
      ], "m²"),
      hint: "S kosinusnim izrekom izračunaj en kot, nato ploščino iz dveh stranic in sinusa kota med njima.",
      data: { given: [`a = ${a}\\ \\mathrm{m}`, `b = ${b}\\ \\mathrm{m}`, `c = ${c}\\ \\mathrm{m}`], find: ["S"] },
      formula: ["\\cos\\gamma = \\dfrac{a^2 + b^2 - c^2}{2ab}", "S = \\dfrac{1}{2}ab\\sin\\gamma"],
      solution: `$\\cos\\gamma = \\dfrac{${a}^2 + ${b}^2 - ${c}^2}{2 \\cdot ${a} \\cdot ${b}} = ${ft(a * a + b * b - c * c, 2 * a * b)} \\approx ${tx(cg, 4)}$\n$\\gamma \\approx ${deg(ga, 2)}$\n$S = \\dfrac{1}{2} \\cdot ${a} \\cdot ${b} \\cdot \\sin\\gamma \\approx ${tx(Sv, 1)}\\ \\mathrm{m^2}$`,
    };
  },
};

// ================= skalarni produkt =================
const skalar = {
  id: "gim-skalarni-produkt-dop",
  topics: [T("skalarni-produkt")],
  gen(level, r) {
    const rv = (dim, lo, hi) => Array.from({ length: dim }, () => r.int(lo, hi));
    const parallel = (a, b) => (a.length === 2 ? a[0] * b[1] - a[1] * b[0] === 0 : a[1] * b[2] - a[2] * b[1] === 0 && a[2] * b[0] - a[0] * b[2] === 0 && a[0] * b[1] - a[1] * b[0] === 0);
    const prodLine = (a, b) => a.map((x, j) => `${pt(x)} \\cdot ${pt(b[j])}`).join(" + ");
    if (level === 1) {
      const t = r.int(0, 2);
      if (t === 0) {
        // vrsta kota iz predznaka skalarnega produkta
        const want = r.pick(["ostri kot", "pravi kot", "topi kot"]);
        const dim = r.pick([2, 3]);
        let a, b, d;
        let k = 0;
        do {
          a = rv(dim, -5, 5);
          b = rv(dim, -5, 5);
          d = dot(a, b);
          k++;
        } while (k < 400 && (len(a) === 0 || len(b) === 0 || parallel(a, b) || (want === "ostri kot" ? d <= 0 : want === "pravi kot" ? d !== 0 : d >= 0)));
        if (k >= 400) return null;
        const cls = d > 0 ? "ostri kot" : d === 0 ? "pravi kot" : "topi kot";
        const WHY = {
          "ostri kot": "Kot je oster le, kadar je skalarni produkt pozitiven.",
          "pravi kot": "Kot je pravi natanko tedaj, ko je skalarni produkt enak 0.",
          "topi kot": "Kot je top le, kadar je skalarni produkt negativen; negativne komponente same po sebi ne pomenijo topega kota.",
        };
        return {
          text: `Kakšen kot oklepata vektorja $\\vec a = ${vt(a)}$ in $\\vec b = ${vt(b)}$?`,
          answer: pickAns(r, cls, ["ostri kot", "pravi kot", "topi kot"].filter((x) => x !== cls).map((x) => [x, WHY[x]])),
          hint: "Izračunaj skalarni produkt in poglej njegov predznak.",
          data: { given: [`\\vec a = ${vt(a)}`, `\\vec b = ${vt(b)}`], find: ["\\text{vrsta kota}"] },
          formula: ["\\cos\\varphi = \\dfrac{\\vec a \\cdot \\vec b}{|\\vec a||\\vec b|}"],
          solution: `$\\vec a \\cdot \\vec b = ${prodLine(a, b)} = ${d}$\n${d > 0 ? "Produkt je pozitiven, zato je $\\cos\\varphi > 0$: kot je oster." : d === 0 ? "Produkt je 0, zato je $\\cos\\varphi = 0$: kot je pravi." : "Produkt je negativen, zato je $\\cos\\varphi < 0$: kot je top."}`,
        };
      }
      if (t === 1) {
        // delo konstantne sile: W = F · s
        const F = rv(2, -9, 9);
        const s = rv(2, -9, 9);
        const W = dot(F, s);
        if (len(F) === 0 || len(s) === 0) return null;
        const ctx = r.pick(["Sila", "Veter deluje na jadrnico s silo", "Robot potiska škatlo s silo"]);
        return {
          text: `${ctx} $\\vec F = ${vt(F)}\\ \\mathrm{N}$ ${ctx === "Sila" ? "premakne telo" : "in jo premakne"} za $\\vec s = ${vt(s)}\\ \\mathrm{m}$. Koliko dela opravi sila? Vpiši rezultat v joulih.`,
          answer: num(W, null, [
            { value: len(F) * len(s), why: "Produkt dolžin velja le, ko imata sila in premik isto smer." },
            { value: F[0] * s[0], why: "Upoštevaj obe komponenti." },
            { value: Math.abs(F[0] * s[0]) + Math.abs(F[1] * s[1]), why: "Pazi na predznake produktov komponent." },
          ], "J"),
          hint: "Delo je skalarni produkt sile in premika.",
          data: { given: [`\\vec F = ${vt(F)}\\ \\mathrm{N}`, `\\vec s = ${vt(s)}\\ \\mathrm{m}`], find: ["W"] },
          formula: "W = \\vec F \\cdot \\vec s = F_x s_x + F_y s_y",
          solution: `$W = ${prodLine(F, s)}$\n$W = ${W}\\ \\mathrm{J}$`,
        };
      }
      // delo pod kotom: W = F s cos φ
      const F = r.int(4, 40) * 5;
      const s = r.int(5, 60);
      const phi = r.pick([15, 20, 25, 30, 35, 40, 45, 50, 60]);
      const W = F * s * Co(phi);
      const nm = name(r);
      const [what, him] = r.pick([["sani", "jih"], ["voziček", "ga"], ["kovček na kolesih", "ga"]]);
      return {
        text: `${nm} vleče ${what} s silo $${F}\\ \\mathrm{N}$ pod kotom $${phi}^\\circ$ glede na vodoravna tla in ${him} premakne za $${s}\\ \\mathrm{m}$ po vodoravnih tleh. Koliko dela opravi sila? Zaokroži na cele joule.`,
        answer: num(W, 0, [
          { value: F * s, why: "Sila in premik nista vzporedna; upoštevaj kosinus kota med njima." },
          { value: F * s * S(phi), why: "Pri delu nastopa kosinus kota med silo in premikom, ne sinus." },
          { value: F * s * Math.cos(phi), why: "Je računalo nastavljeno na radiane? Kot je v stopinjah (DEG)." },
        ], "J"),
        hint: "Delo je skalarni produkt sile in premika: produkt velikosti in kosinusa kota med njima.",
        data: { given: [`F = ${F}\\ \\mathrm{N}`, `s = ${s}\\ \\mathrm{m}`, `\\varphi = ${phi}^\\circ`], find: ["W"] },
        formula: "W = \\vec F \\cdot \\vec s = F s \\cos\\varphi",
        solution: `$W = ${F} \\cdot ${s} \\cdot \\cos ${phi}^\\circ$\n$W \\approx ${tx(W, 0)}\\ \\mathrm{J}$`,
      };
    }
    if (level === 2) {
      const t = r.int(0, 2);
      if (t === 0) {
        // (m a + n b)·(p a + q b) iz dolžin in kota
        const A = r.int(1, 6);
        const B = r.int(1, 6);
        const [phi, cs, csT] = r.pick([[60, 0.5, "\\frac{1}{2}"], [120, -0.5, "\\left(-\\frac{1}{2}\\right)"], [90, 0, "0"], [60, 0.5, "\\frac{1}{2}"], [120, -0.5, "\\left(-\\frac{1}{2}\\right)"]]);
        const m = r.pick([1, 2, 3, -1, -2]);
        const n = r.pick([1, 2, 3, -1, -2, -3]);
        const p = r.pick([1, 2, 3, -1, 2]);
        const q = r.pick([1, 2, 3, -1, -2, -3]);
        if (m * q === n * p) return null;
        const ab = A * B * cs;
        const val = m * p * A * A + (m * q + n * p) * ab + n * q * B * B;
        const lv = (x, y) => `${cf(x, "\\vec a")}${cn(y, "\\vec b")}`;
        const expr = `(${lv(m, n)}) \\cdot (${lv(p, q)})`;
        return {
          text: `Vektorja $\\vec a$ in $\\vec b$ imata dolžini $|\\vec a| = ${A}$ in $|\\vec b| = ${B}$ ter oklepata kot $${phi}^\\circ$. Izračunaj $${expr}$.`,
          answer: num(val, null, [
            { value: m * p * A * A + n * q * B * B, why: "Pri množenju moraš upoštevati tudi mešana člena z $\\vec a \\cdot \\vec b$." },
            { value: m * p * A + (m * q + n * p) * ab + n * q * B, why: "Velja $\\vec a \\cdot \\vec a = |\\vec a|^2$, ne $|\\vec a|$." },
            { value: m * p * A * A + (m * q + n * p) * A * B + n * q * B * B, why: "Velja $\\vec a \\cdot \\vec b = |\\vec a||\\vec b|\\cos\\varphi$; pozabil si na kosinus." },
          ]),
          hint: "Zmnoži oklepaja kot pri številih (distributivnost), nato uporabi $\\vec a \\cdot \\vec a = |\\vec a|^2$ in $\\vec a \\cdot \\vec b = |\\vec a||\\vec b|\\cos\\varphi$.",
          data: { given: [`|\\vec a| = ${A}`, `|\\vec b| = ${B}`, `\\varphi = ${phi}^\\circ`], find: [expr] },
          formula: ["\\vec a \\cdot \\vec a = |\\vec a|^2", "\\vec a \\cdot \\vec b = |\\vec a||\\vec b|\\cos\\varphi"],
          solution: `$${expr} = ${cf(m * p, "\\,\\vec a \\cdot \\vec a")}${cn(m * q + n * p, "\\,\\vec a \\cdot \\vec b")}${cn(n * q, "\\,\\vec b \\cdot \\vec b")}$\n$\\vec a \\cdot \\vec a = ${A * A}$, $\\vec b \\cdot \\vec b = ${B * B}$, $\\vec a \\cdot \\vec b = ${A} \\cdot ${B} \\cdot ${csT} = ${tx(ab)}$\n$${expr} = ${tx(m * p * A * A)} ${sg((m * q + n * p) * ab)} ${sg(n * q * B * B)} = ${tx(val)}$`,
        };
      }
      if (t === 1) {
        // delo sile pri premiku iz A v B
        const A = rv(3, -5, 5);
        const Bp = rv(3, -5, 6);
        const F = rv(3, -6, 6);
        const s = Bp.map((x, i) => x - A[i]);
        const W = dot(F, s);
        if (len(s) === 0 || len(F) === 0) return null;
        return {
          text: `Telo se pod vplivom stalne sile $\\vec F = ${vt(F)}\\ \\mathrm{N}$ premakne iz točke $A${vt(A)}$ v točko $B${vt(Bp)}$ (koordinate v metrih). Koliko dela opravi sila? Vpiši rezultat v joulih.`,
          answer: num(W, null, [
            { value: dot(F, Bp), why: "Premik je vektor $\\vec{AB} = B - A$, ne krajevni vektor točke $B$." },
            { value: -W, why: "Vektor premika je $\\vec{AB} = B - A$, ne $A - B$." },
          ], "J"),
          hint: "Najprej izračunaj vektor premika $\\vec{AB}$, nato skalarni produkt s silo.",
          data: { given: [`\\vec F = ${vt(F)}\\ \\mathrm{N}`, `A = ${vt(A)}`, `B = ${vt(Bp)}`], find: ["W"] },
          formula: ["\\vec{AB} = (b_1 - a_1, b_2 - a_2, b_3 - a_3)", "W = \\vec F \\cdot \\vec{AB}"],
          solution: `$\\vec{AB} = ${vt(s)}\\ \\mathrm{m}$\n$W = ${prodLine(F, s)}$\n$W = ${W}\\ \\mathrm{J}$`,
        };
      }
      // iz |a|, |b| in |a ± b| izračunaj a · b
      const p = r.int(2, 7);
      const q = r.int(2, 7);
      const d = r.nonZero(-(p * q - 1), p * q - 1);
      const plus = r.next() < 0.5;
      const N = p * p + q * q + (plus ? 2 : -2) * d;
      const sq = Math.sqrt(N);
      const NT = Number.isInteger(sq) ? `${sq}` : `\\sqrt{${N}}`;
      const op = plus ? "+" : "-";
      return {
        text: `Za vektorja velja $|\\vec a| = ${p}$, $|\\vec b| = ${q}$ in $|\\vec a ${op} \\vec b| = ${NT}$. Izračunaj $\\vec a \\cdot \\vec b$.`,
        answer: num(d, null, [
          { value: 2 * d, why: `V razvoju $|\\vec a ${op} \\vec b|^2$ nastopa člen $2\\,\\vec a \\cdot \\vec b$; deli z 2.` },
          { value: -d, why: `Pazi na predznak: $|\\vec a ${op} \\vec b|^2 = |\\vec a|^2 ${op} 2\\,\\vec a \\cdot \\vec b + |\\vec b|^2$.` },
          ...(Number.isInteger(sq) ? [] : [{ value: (plus ? sq - p * p - q * q : p * p + q * q - sq) / 2, why: "Dolžino vektorja moraš kvadrirati." }]),
        ]),
        hint: `Kvadriraj: $|\\vec a ${op} \\vec b|^2 = (\\vec a ${op} \\vec b) \\cdot (\\vec a ${op} \\vec b)$ in izrazi $\\vec a \\cdot \\vec b$.`,
        data: { given: [`|\\vec a| = ${p}`, `|\\vec b| = ${q}`, `|\\vec a ${op} \\vec b| = ${NT}`], find: ["\\vec a \\cdot \\vec b"] },
        formula: `|\\vec a ${op} \\vec b|^2 = |\\vec a|^2 ${op} 2\\,\\vec a \\cdot \\vec b + |\\vec b|^2`,
        solution: `$${N} = ${p * p} ${op} 2\\,\\vec a \\cdot \\vec b + ${q * q}$\n$${op === "+" ? "" : "-"}2\\,\\vec a \\cdot \\vec b = ${N} - ${p * p + q * q} = ${N - p * p - q * q}$\n$\\vec a \\cdot \\vec b = ${d}$`,
      };
    }
    // ---------- raven 3 ----------
    const t = r.int(0, 2);
    if (t === 0) {
      // točka C na osi x, da je kot ACB pravi
      let A, B, x1, x2, k = 0;
      do {
        A = [r.int(-5, 6), r.nonZero(-6, 6)];
        B = [r.int(-5, 8), r.nonZero(-6, 6)];
        const D = (A[0] - B[0]) ** 2 - 4 * A[1] * B[1];
        const sD = Math.sqrt(Math.max(D, 0));
        x1 = (A[0] + B[0] - sD) / 2;
        x2 = (A[0] + B[0] + sD) / 2;
        k++;
        if (D > 0 && Number.isInteger(sD) && Number.isInteger(x1) && Number.isInteger(x2)) break;
      } while (k < 500);
      if (k >= 500) return null;
      const big = r.next() < 0.5;
      const ans = big ? x2 : x1;
      const bSum = A[0] + B[0];
      const cC = A[0] * B[0] + A[1] * B[1];
      const D2 = (A[0] - B[0]) ** 2 + 4 * A[1] * B[1];
      const wr = D2 >= 0 ? (A[0] + B[0] + (big ? 1 : -1) * Math.sqrt(D2)) / 2 : NaN;
      return {
        text: `Dani sta točki $A${vt(A)}$ in $B${vt(B)}$. Na osi $x$ leži točka $C$, za katero je kot $\\angle ACB$ pravi. Takšni točki sta dve; vpiši absciso tiste, ki leži bolj ${big ? "desno" : "levo"}.`,
        answer: num(ans, null, [
          { value: big ? x1 : x2, why: `Iskana je točka, ki leži bolj ${big ? "desno" : "levo"}.` },
          { value: wr, why: "Preveri predznak produkta $y$-komponent vektorjev $\\vec{CA}$ in $\\vec{CB}$." },
        ]),
        hint: "Zapiši $C(x, 0)$. Kot pri $C$ je pravi, ko je $\\vec{CA} \\cdot \\vec{CB} = 0$; dobiš kvadratno enačbo za $x$.",
        data: { given: [`A = ${vt(A)}`, `B = ${vt(B)}`], find: ["x_C"] },
        formula: ["\\vec{CA} \\cdot \\vec{CB} = 0", "x_{1,2} = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"],
        solution: `$\\vec{CA} = (${A[0]} - x, ${A[1]})$, $\\vec{CB} = (${B[0]} - x, ${B[1]})$\n$(${A[0]} - x)(${B[0]} - x) ${sg(A[1] * B[1])} = 0$\n$${poly([1, -bSum, cC])} = 0$\n$x_1 = ${x1}$, $x_2 = ${x2}$\nIskana absciska: $${ans}$`,
      };
    }
    if (t === 1) {
      // obratna: dolžina |a| iz |b|, kota in |a ± b|
      const sgn = r.pick([1, -1]); // efektivni predznak člena 2|a||b|cos
      const plus = r.next() < 0.5;
      const phi = (plus ? sgn : -sgn) > 0 ? 60 : 120;
      const q = r.int(1, 7);
      const p = sgn > 0 ? r.int(1, 8) : q + r.int(1, 6);
      const N = p * p + q * q + sgn * p * q;
      const sq = Math.sqrt(N);
      const NT = Number.isInteger(sq) ? `${sq}` : `\\sqrt{${N}}`;
      const op = plus ? "+" : "-";
      // napačen predznak mešanega člena: x² − sgn·q·x + q² − N = 0
      const wrong = (sgn * q + Math.sqrt(q * q - 4 * (q * q - N))) / 2;
      return {
        text: `Vektorja $\\vec a$ in $\\vec b$ oklepata kot $${phi}^\\circ$. Velja $|\\vec b| = ${q}$ in $|\\vec a ${op} \\vec b| = ${NT}$. Kolikšna je dolžina $|\\vec a|$?`,
        answer: num(p, null, [
          { value: Math.sqrt(N - q * q), why: "Vektorja nista pravokotna; upoštevati moraš mešani člen $2\\,\\vec a \\cdot \\vec b$." },
          { value: wrong, why: `Preveri predznak mešanega člena: $\\cos ${phi}^\\circ = ${phi === 60 ? "\\frac{1}{2}" : "-\\frac{1}{2}"}$ in računska operacija $${op}$.` },
        ]),
        hint: `Označi $x = |\\vec a|$ in razvij $|\\vec a ${op} \\vec b|^2$. Dobiš kvadratno enačbo za $x$; dolžina je pozitivna.`,
        data: { given: [`\\varphi = ${phi}^\\circ`, `|\\vec b| = ${q}`, `|\\vec a ${op} \\vec b| = ${NT}`], find: ["|\\vec a|"] },
        formula: [`|\\vec a ${op} \\vec b|^2 = |\\vec a|^2 ${op} 2|\\vec a||\\vec b|\\cos\\varphi + |\\vec b|^2`],
        solution: `$${N} = x^2 ${op} 2 \\cdot x \\cdot ${q} \\cdot \\cos ${phi}^\\circ + ${q * q}$\n$${poly([1, sgn * q, q * q - N])} = 0$\n$x_{1,2} = \\dfrac{${-sgn * q} \\pm \\sqrt{${q * q - 4 * (q * q - N)}}}{2}$: $x_1 = ${p}$, $x_2 = ${-sgn * q - p}$\nDolžina je pozitivna: $|\\vec a| = ${p}$`,
      };
    }
    // komponenta pravokotne projekcije b na a
    const a = rv(3, -3, 4);
    const b = rv(3, -4, 5);
    const d = dot(a, b);
    const a2 = dot(a, a);
    if (d === 0 || a2 === 0 || parallel(a, b)) return null;
    const i = r.int(0, 2);
    if (a[i] === 0) return null;
    const comp = ["x", "y", "z"][i];
    return {
      text: `Dana sta vektorja $\\vec a = ${vt(a)}$ in $\\vec b = ${vt(b)}$. Izračunaj ${["prvo", "drugo", "tretjo"][i]} ($${comp}$) komponento pravokotne projekcije vektorja $\\vec b$ na vektor $\\vec a$. Vpiši ulomek ali celo število.`,
      answer: frA(d * a[i], a2, [
        { value: (d * a[i]) / Math.sqrt(a2), why: "Pri projekciji vektorja deliš z $|\\vec a|^2$, ne z $|\\vec a|$." },
        { value: (d * b[i]) / dot(b, b), why: "To je projekcija $\\vec a$ na $\\vec b$; projicirati moraš $\\vec b$ na $\\vec a$." },
      ]),
      hint: "Projekcija $\\vec b$ na $\\vec a$ je vzporedna z $\\vec a$: $\\vec b_a = k\\,\\vec a$, kjer je $k = \\frac{\\vec a \\cdot \\vec b}{|\\vec a|^2}$.",
      data: { given: [`\\vec a = ${vt(a)}`, `\\vec b = ${vt(b)}`], find: [`(\\vec b_a)_${comp}`] },
      formula: "\\vec b_a = \\dfrac{\\vec a \\cdot \\vec b}{|\\vec a|^2}\\,\\vec a",
      solution: `$\\vec a \\cdot \\vec b = ${prodLine(a, b)} = ${d}$\n$|\\vec a|^2 = ${a2}$, $k = ${ft(d, a2)}$\n$(\\vec b_a)_${comp} = ${ft(d, a2)} \\cdot ${pt(a[i])} = ${ft(d * a[i], a2)}$`,
    };
  },
};

// ================= polinomi =================
const poli = {
  id: "gim-polinomi-dop",
  topics: [T("polinomi")],
  gen(level, r) {
    if (level === 1) {
      if (r.next() < 0.5) {
        // koeficient produkta
        const p = [r.nonZero(-4, 4), r.int(-5, 5), r.nonZero(-5, 5)];
        const q = [r.nonZero(-4, 4), r.int(-5, 5), r.nonZero(-5, 5)];
        const pr = mul(p, q);
        const k = r.int(1, 3);
        if (k === 3 && (p[1] === 0 || q[1] === 0)) return null;
        const ans = pr[4 - k];
        // p = [p2, p1, p0]: koeficient pri x^j je p[2 - j]
        const P = (j) => (j >= 0 && j <= 2 ? p[2 - j] : 0);
        const Q = (j) => (j >= 0 && j <= 2 ? q[2 - j] : 0);
        const pairs = [];
        for (let j = 0; j <= 2; j++) if (k - j >= 0 && k - j <= 2) pairs.push([j, k - j]);
        const ms = [];
        if (k <= 2) ms.push({ value: P(k) + Q(k), why: "Koeficientov ne seštevaš: pri množenju polinomov pomnožiš vsak člen z vsakim." });
        if (pairs.length > 1) ms.push({ value: P(pairs[0][0]) * Q(pairs[0][1]), why: `Do $x^${k}$ pride več produktov členov; seštej vse.` });
        ms.push({ value: sum(pairs.map(([i, j]) => Math.abs(P(i) * Q(j)))), why: "Pazi na predznake produktov členov." });
        const pw = (j) => (j === 0 ? "" : j === 1 ? "x" : `x^${j}`);
        return {
          text: `Dana sta polinoma $p(x) = ${poly(p)}$ in $q(x) = ${poly(q)}$. Koliko je koeficient pri $${pw(k)}$ v produktu $p(x) \\cdot q(x)$?`,
          answer: num(ans, null, ms),
          hint: `Poišči vse pare členov, katerih produkt da $${pw(k)}$ (vsota potenc je ${k}).`,
          data: { given: [`p(x) = ${poly(p)}`, `q(x) = ${poly(q)}`], find: [`\\text{koeficient pri } ${pw(k)}`] },
          formula: "a x^m \\cdot b x^n = ab\\,x^{m + n}",
          solution: `Produkti, ki dajo $${pw(k)}$: ${pairs.map(([i, j]) => `$${pt(P(i))} \\cdot ${pt(Q(j))}$`).join(", ")}\nKoeficient: $${pairs.map(([i, j]) => pt(P(i) * Q(j))).join(" + ")} = ${ans}$`,
        };
      }
      // stopnja, vodilni koeficient, prosti člen produkta faktorjev
      const nf = r.int(2, 3);
      const fs = [];
      for (let i = 0; i < nf; i++) {
        const kind = r.pick(["lin", "lin", "kv", "sq"]);
        const a = r.pick([1, 2, 3, -1, -2]);
        const b = r.nonZero(-5, 5);
        if (kind === "lin") fs.push({ cs: [a, b], tex: `(${poly([a, b])})`, deg: 1 });
        else if (kind === "kv") fs.push({ cs: [a, 0, b], tex: `(${poly([a, 0, b])})`, deg: 2 });
        else fs.push({ cs: mul([a, b], [a, b]), tex: `(${poly([a, b])})^2`, deg: 2, base: [a, b] });
      }
      if (new Set(fs.map((f) => f.tex.replace(/\^2$/, ""))).size < fs.length) return null;
      const pr = fs.reduce((acc, f) => mul(acc, f.cs), [1]);
      const ask = r.pick(["deg", "lead", "free"]);
      const pTex = fs.map((f) => f.tex).join("");
      const ans = ask === "deg" ? pr.length - 1 : ask === "lead" ? pr[0] : pr[pr.length - 1];
      const ms = ask === "deg"
        ? [{ value: fs.reduce((a, f) => a * f.deg, 1), why: "Pri množenju polinomov se stopnje seštejejo, ne zmnožijo." }, { value: nf, why: "Faktor s kvadratom ali $x^2$ prispeva stopnjo 2." }]
        : ask === "lead"
          ? [{ value: pr[pr.length - 1], why: "To je prosti člen; vodilni koeficient je koeficient pri najvišji potenci." }, { value: sum(fs.map((f) => (f.base ? f.base[0] : f.cs[0]))), why: "Vodilne koeficiente faktorjev zmnožiš, ne seštevaš." }, ...fs.filter((f) => f.base).map((f) => ({ value: pr[0] / f.base[0], why: "Pri kvadriranem faktorju vodilni koeficient nastopa dvakrat." }))]
          : [{ value: sum(fs.map((f) => (f.base ? f.base[1] : f.cs[f.cs.length - 1]))), why: "Proste člene faktorjev zmnožiš, ne seštevaš." }, ...fs.filter((f) => f.base).map((f) => ({ value: pr[pr.length - 1] / f.base[1], why: "Pri kvadriranem faktorju prosti člen nastopa dvakrat." }))];
      const askT = { deg: "stopnja", lead: "vodilni koeficient", free: "prosti člen" }[ask];
      return {
        text: `Koliko je ${askT} polinoma $p(x) = ${pTex}$? Polinoma ni treba zmnožiti do konca.`,
        answer: num(ans, null, ms),
        hint: ask === "deg" ? "Stopnja produkta je vsota stopenj faktorjev." : ask === "lead" ? "Vodilni člen produkta je produkt vodilnih členov faktorjev." : "Prosti člen je vrednost polinoma pri $x = 0$: zmnoži proste člene faktorjev.",
        data: { given: [`p(x) = ${pTex}`], find: [`\\text{${askT}}`] },
        formula: ask === "deg" ? "\\text{st}(p \\cdot q) = \\text{st}(p) + \\text{st}(q)" : ask === "lead" ? "a_n(p \\cdot q) = a_n(p) \\cdot a_n(q)" : "a_0 = p(0)",
        solution: ask === "deg"
          ? `Stopnje faktorjev: $${fs.map((f) => f.deg).join(",\\ ")}$\nStopnja: $${fs.map((f) => f.deg).join(" + ")} = ${ans}$`
          : ask === "lead"
            ? `Vodilni koeficienti faktorjev: ${fs.map((f) => (f.base ? `$${pt(f.base[0])}^2$` : `$${f.cs[0]}$`)).join(", ")}\nVodilni koeficient: $${fs.map((f) => (f.base ? `${pt(f.base[0])}^2` : pt(f.cs[0]))).join(" \\cdot ")} = ${ans}$`
            : `$p(0)$ je produkt prostih členov: ${fs.map((f) => (f.base ? `$${pt(f.base[1])}^2$` : `$${f.cs[f.cs.length - 1]}$`)).join(", ")}\nProsti člen: $${fs.map((f) => (f.base ? `${pt(f.base[1])}^2` : pt(f.cs[f.cs.length - 1]))).join(" \\cdot ")} = ${ans}$`,
      };
    }
    if (level === 2) {
      const t = r.int(0, 2);
      if (t === 0) {
        // polinom 3. stopnje iz ničel in točke
        const roots = [];
        while (roots.length < 3) {
          const x = r.int(-4, 4);
          if (!roots.includes(x)) roots.push(x);
        }
        roots.sort((p, q) => p - q);
        const a = r.pick([1, 2, 3, -1, -2, 4, -3]);
        let x0;
        do x0 = r.int(-3, 4);
        while (roots.includes(x0));
        const prod = roots.reduce((p, x) => p * (x0 - x), 1);
        const y0 = a * prod;
        const cs = fromRoots(roots).map((c) => a * c);
        const ask = r.pick(x0 === 0 ? ["a", "x2"] : ["a", "x2", "free"]);
        const ans = ask === "a" ? a : ask === "x2" ? cs[1] : cs[3];
        const prodPlus = roots.reduce((p, x) => p * (x0 + x), 1);
        const ms = ask === "a"
          ? [...(prodPlus !== 0 ? [{ value: y0 / prodPlus, why: "Ničla $x_i$ da faktor $(x - x_i)$; pazi na predznak." }] : []), { value: prod / y0, why: "Iz $y_0 = a \\cdot (\\ldots)$ izraziš $a$ z deljenjem $y_0$ s produktom, ne obratno." }, { value: -a, why: "Pazi na predznake pri računanju produkta $(x_0 - x_1)(x_0 - x_2)(x_0 - x_3)$." }]
          : ask === "x2"
            ? [{ value: -cs[1], why: "Pri $(x - x_1)(x - x_2)(x - x_3)$ je koeficient pri $x^2$ enak $-a(x_1 + x_2 + x_3)$; pazi na predznak." }, { value: (-cs[1]) / a, why: "Ne pozabi pomnožiti z vodilnim koeficientom $a$." }]
            : [{ value: -cs[3], why: "Prosti člen je $-a\\,x_1x_2x_3$; pazi na predznak." }, { value: -cs[3] / a, why: "Ne pozabi pomnožiti z vodilnim koeficientom $a$." }];
        const askT = { a: "vodilni koeficient", x2: "koeficient pri $x^2$", free: "prosti člen" }[ask];
        const fTex = roots.map((x) => (x === 0 ? "x" : `(${xm(x)})`)).join("");
        return {
          text: `Polinom $p$ tretje stopnje ima ničle $${roots[0]}$, $${roots[1]}$ in $${roots[2]}$, njegov graf pa poteka skozi točko $T(${x0}, ${y0})$. Koliko je ${askT} polinoma $p$?`,
          answer: num(ans, null, ms),
          hint: "Zapiši polinom v ničelni obliki $p(x) = a(x - x_1)(x - x_2)(x - x_3)$ in z $T$ določi $a$.",
          data: { given: [`x_1 = ${roots[0]}`, `x_2 = ${roots[1]}`, `x_3 = ${roots[2]}`, `T = (${x0}, ${y0})`], find: [ask === "a" ? "a" : ask === "x2" ? "\\text{koeficient pri } x^2" : "\\text{prosti člen}"] },
          formula: "p(x) = a(x - x_1)(x - x_2)(x - x_3)",
          solution: `$p(x) = a${fTex}$\n$p(${x0}) = a \\cdot ${roots.map((x) => pt(x0 - x)).join(" \\cdot ")} = ${prod}a = ${y0}$, torej $a = ${a}$\n${ask === "a" ? `Vodilni koeficient: $${a}$` : `$p(x) = ${poly(cs)}$\n${ask === "x2" ? "Koeficient pri $x^2$" : "Prosti člen"}: $${ans}$`}`,
        };
      }
      if (t === 1) {
        // večkratnost ničle s Hornerjem
        const c = r.pick([-2, -1, 1, 2]);
        const k = r.int(1, 3);
        let q;
        do q = [1, r.int(-3, 3), r.int(-4, 4)];
        while (ev(q, c) === 0);
        let cs = q;
        for (let i = 0; i < k; i++) cs = mul(cs, [1, -c]);
        const rows = [];
        let cur = cs;
        for (let i = 0; i <= k; i++) {
          const row = horner(cur, c);
          rows.push(row);
          cur = row.slice(0, -1);
        }
        return {
          text: `Število $${c}$ je ničla polinoma $p(x) = ${poly(cs)}$. Kolikšna je njena stopnja (večkratnost)?`,
          answer: num(k, null, [
            ...(k > 1 ? [{ value: 1, why: "Hornerjev algoritem ponovi na količniku: ničla je lahko večkratna." }] : []),
            { value: k + 1, why: "Ko je ostanek različen od 0, se štetje ustavi; ta korak ne šteje." },
            ...(k < 3 ? [{ value: cs.length - 1, why: "To je stopnja polinoma, ne večkratnost ničle." }] : []),
          ]),
          hint: `Polinom deli z $${xm(c)}$ (Horner). Če je ostanek 0, deli še količnik, dokler ostanek ni različen od 0.`,
          data: { given: [`p(x) = ${poly(cs)}`, `x_0 = ${c}`], find: ["\\text{večkratnost}"] },
          formula: "p(x) = (x - x_0)^k\\,q(x),\\ q(x_0) \\ne 0",
          solution: `${rows.map((row, i) => `${i + 1}. deljenje: $${row.join(",\\ ")}$, ostanek $${row[row.length - 1]}$`).join("\n")}\nOstanek je bil ${k}-krat enak 0, zato je ničla $${c}$ ${k === 1 ? "enkratna" : k === 2 ? "dvojna" : "trojna"}: večkratnost $${k}$.`,
        };
      }
      // vsota koeficientov: p(1)
      let a, b, c;
      do {
        a = r.nonZero(-3, 3);
        b = r.int(-4, 4);
        c = r.int(-4, 4);
      } while (Math.abs(a + b + c) > 3 || a + b + c === 0);
      const n = r.int(2, 3);
      const d = r.nonZero(-4, 4);
      const e = r.int(-5, 5);
      if (d + e === 0) return null;
      const ans = (a + b + c) ** n * (d + e);
      const pTex = `(${poly([a, b, c])})^${n}(${poly([d, e])})`;
      return {
        text: `Polinom $p(x) = ${pTex}$ zapišemo v razviti obliki. Koliko je vsota vseh njegovih koeficientov?`,
        answer: num(ans, null, [
          { value: c ** n * e, why: "To je $p(0)$, torej le prosti člen." },
          { value: (a + b + c) * (d + e), why: "Ne pozabi na potenco prvega faktorja." },
          { value: n * (a + b + c) * (d + e), why: "Potenca ni množenje z eksponentom." },
        ]),
        hint: "Vsota koeficientov polinoma je njegova vrednost pri $x = 1$. Razvijanje ni potrebno.",
        data: { given: [`p(x) = ${pTex}`], find: ["\\text{vsota koeficientov}"] },
        formula: "a_n + a_{n-1} + \\ldots + a_0 = p(1)",
        solution: `Vsota koeficientov je $p(1)$.\n$p(1) = (${pt(a)} ${sg(b)} ${sg(c)})^${n} \\cdot (${pt(d)} ${sg(e)}) = ${pt(a + b + c)}^${n} \\cdot ${pt(d + e)}$\n$p(1) = ${ans}$`,
      };
    }
    // ---------- raven 3 ----------
    const t = r.int(0, 2);
    if (t === 0) {
      // x³ + ax² + bx + c deljiv z danim kvadratnim polinomom
      let r1, r2, r3;
      do {
        r1 = r.nonZero(-4, 4);
        r2 = r.nonZero(-4, 4);
        r3 = r.int(-5, 5);
      } while (r1 >= r2);
      const cs = fromRoots([r1, r2, r3]);
      const c0 = cs[3];
      const q = [1, -(r1 + r2), r1 * r2];
      const m = c0 / (r1 * r2);
      const askA = r.next() < 0.5;
      const ans = askA ? cs[1] : cs[2];
      return {
        zeroOk: true,
        text: `Polinom $p(x) = x^3 + ax^2 + bx ${sg(c0)}$ je deljiv s polinomom $q(x) = ${poly(q)}$. Koliko je ${askA ? "$a$" : "$b$"}?`.replace(" + 0$", "$"),
        answer: num(ans, null, askA
          ? [{ value: -ans, why: "Pazi na predznak: ničle $q$ so rešitve enačbe $q(x) = 0$." }, { value: m + (r1 + r2), why: "Preveri predznak pri koeficientu $q$ pri $x$." }]
          : [{ value: -ans, why: "Pazi na predznak: ničle $q$ so rešitve enačbe $q(x) = 0$." }, { value: r1 * r2 + (r1 + r2) * m, why: "Preveri predznak pri koeficientu $q$ pri $x$." }]),
        hint: "Ničli polinoma $q$ sta tudi ničli polinoma $p$. Lahko pa zapišeš $p(x) = q(x)(x + m)$ in primerjaš koeficiente.",
        data: { given: [`p(x) = x^3 + ax^2 + bx ${sg(c0)}`.replace(" + 0", ""), `q(x) = ${poly(q)}`], find: [askA ? "a" : "b"] },
        formula: ["p(x) = q(x)\\,(x + m)", "p(x_1) = 0,\\ p(x_2) = 0"],
        solution: `$q(x) = (${xm(r1)})(${xm(r2)})$\n$p(x) = (${poly(q)})(x + m)$; prosti člen: $${cf(r1 * r2, "m")} = ${c0}$, $m = ${tx(m)}$\n$p(x) = ${poly(cs)}$\n$${askA ? "a" : "b"} = ${ans}$`,
      };
    }
    if (t === 1) {
      // ostanek pri deljenju s (x − r1)(x − r2) iz dveh ostankov
      let r1, r2;
      do {
        r1 = r.int(-4, 4);
        r2 = r.int(-4, 4);
      } while (r1 === r2);
      const R1 = r.int(-9, 9);
      const R2 = r.int(-9, 9);
      if (R1 === R2) return null;
      const askM = r.next() < 0.5;
      const mN = R1 - R2;
      const mD = r1 - r2;
      const nN = R2 * r1 - R1 * r2;
      const qT = poly(mul([1, -r1], [1, -r2]));
      const eqm = (x) => (x === 0 ? "n" : `${cf(x, "m")} + n`);
      return {
        zeroOk: true,
        text: `Pri deljenju polinoma $p$ s polinomom $${xm(r1)}$ je ostanek $${R1}$, pri deljenju s polinomom $${xm(r2)}$ pa $${R2}$. Ostanek pri deljenju polinoma $p$ s $${qT}$ je $o(x) = mx + n$. Koliko je ${askM ? "$m$" : "$n$"}? Vpiši ulomek ali celo število.`,
        answer: askM
          ? frA(mN, mD, [{ value: -mN / mD, why: "Pazi na vrstni red pri odštevanju enačb." }, { value: R1 + R2, why: "Ostanka ne seštevaš; zapiši sistem $o(x_1) = p(x_1)$, $o(x_2) = p(x_2)$." }])
          : frA(nN, mD, [{ value: -nN / mD, why: "Pazi na predznake pri reševanju sistema." }, { value: R1 + R2, why: "Ostanka ne seštevaš; zapiši sistem $o(x_1) = p(x_1)$, $o(x_2) = p(x_2)$." }]),
        hint: `Zapiši $p(x) = (${qT})\\,k(x) + mx + n$ in vstavi ničli delitelja. Po izreku o ostanku poznaš $p(${r1})$ in $p(${r2})$.`,
        data: { given: [`p(${r1}) = ${R1}`, `p(${r2}) = ${R2}`], find: [askM ? "m" : "n"] },
        formula: ["p(x) = (x - x_1)(x - x_2)\\,k(x) + mx + n", "p(c) = \\text{ostanek pri deljenju z } x - c"],
        solution: `Po izreku o ostanku: $p(${r1}) = ${R1}$, $p(${r2}) = ${R2}$.\nOstanek ima v ničlah delitelja enake vrednosti: $${eqm(r1)} = ${R1}$, $${eqm(r2)} = ${R2}$\nOdštejemo: $${cf(mD, "m")} = ${mN}$, $m = ${ft(mN, mD)}$\n$n = ${R1} - ${pt(r1)} \\cdot ${ft(mN, mD).startsWith("-") ? `\\left(${ft(mN, mD)}\\right)` : ft(mN, mD)} = ${ft(nN, mD)}$\n${askM ? `$m = ${ft(mN, mD)}$` : `$n = ${ft(nN, mD)}$`}`,
      };
    }
    // škatla iz pločevine: V(x) = x(a − 2x)(b − 2x), ena rešitev je dana, iščemo drugo
    const a = r.int(10, 30);
    const b = r.int(a, a + 16);
    const x0 = r.int(1, Math.floor((a - 1) / 2));
    const V = x0 * (a - 2 * x0) * (b - 2 * x0);
    const cs = [4, -2 * (a + b), a * b, -V];
    const row = horner(cs, x0);
    const [qa, qb, qc] = row.slice(0, 3);
    const Dd = qb * qb - 4 * qa * qc;
    if (Dd < 0) return null;
    const roots = [(-qb - Math.sqrt(Dd)) / (2 * qa), (-qb + Math.sqrt(Dd)) / (2 * qa)];
    const ok = roots.filter((x) => x > 0 && x < a / 2);
    const bad = roots.filter((x) => !(x > 0 && x < a / 2));
    if (ok.length !== 1 || Math.abs(ok[0] - x0) < 0.05 || Math.abs(ok[0] - roundHalfUp(ok[0], 0)) < 1e-9) return null;
    const ans = ok[0];
    return {
      text: `Iz pravokotne pločevine z merama $${a}\\ \\mathrm{cm}$ in $${b}\\ \\mathrm{cm}$ v vogalih izrežemo enake kvadrate s stranico $x$ in zapognemo odprto škatlo s prostornino $${V}\\ \\mathrm{cm^3}$. Ena možnost je $x = ${x0}\\ \\mathrm{cm}$. Poišči drugo možno stranico $x$. Zaokroži na dve decimalki.`,
      answer: num(ans, 2, [
        ...bad.map((x) => ({ value: x, why: "Ta rešitev enačbe ne pride v poštev: stranica dna škatle bi bila negativna ali $x \\le 0$." })),
        { value: x0, why: "To je že dana rešitev; iščeš drugo." },
      ], "cm"),
      hint: "Zapiši $V(x) = x(a - 2x)(b - 2x)$, enačbo $V(x) = V$ deli z $x - x_0$ (Horner) in reši kvadratno enačbo. Preveri, katere rešitve so smiselne.",
      data: { given: [`a = ${a}\\ \\mathrm{cm}`, `b = ${b}\\ \\mathrm{cm}`, `V = ${V}\\ \\mathrm{cm^3}`, `x_0 = ${x0}\\ \\mathrm{cm}`], find: ["x"] },
      formula: ["V(x) = x(a - 2x)(b - 2x)", `0 < x < \\dfrac{${a}}{2}`],
      solution: `$x(${a} - 2x)(${b} - 2x) = ${V}$ $\\Rightarrow$ $${poly(cs)} = 0$\nHorner z $x_0 = ${x0}$: $${row.join(",\\ ")}$ $\\Rightarrow$ $${poly([qa, qb, qc])} = 0$\n$x = \\dfrac{${-qb} \\pm \\sqrt{${Dd}}}{${2 * qa}}$: $x \\approx ${tx(roots[0], 2)}$ ali $x \\approx ${tx(roots[1], 2)}$\nSmiselna je le rešitev z $0 < x < ${tx(a / 2)}$: $x \\approx ${tx(ans, 2)}\\ \\mathrm{cm}$`,
    };
  },
};

// ================= racionalne funkcije =================
const racio = {
  id: "gim-racionalne-funkcije-dop",
  topics: [T("racionalne-funkcije")],
  gen(level, r) {
    if (level === 1) {
      if (r.next() < 0.5) {
        // enačba (ax + b)/(x + c) = k
        const a = r.pick([1, 2, 3, 4, -1, -2]);
        const b = r.int(-9, 9);
        const c = r.nonZero(-6, 6);
        const k = r.pick([1, 2, 3, 4, 5, -1, -2, -3]);
        if (a === k || b === a * c) return null;
        const [xn, xd] = fr(k * c - b, a - k);
        if (xn / xd === -c) return null;
        const f = `\\dfrac{${poly([a, b])}}{x ${sg(c)}}`;
        return {
          zeroOk: true,
          text: `Reši enačbo $${f} = ${k}$. Vpiši rešitev kot ulomek ali celo število.`,
          answer: frA(xn, xd, [
            { value: (c - b) / (a - k), why: `Pri množenju z imenovalcem pomnoži z $${k}$ ves izraz $x ${sg(c)}$.` },
            { value: -(xn / xd), why: "Pazi na predznake pri prenašanju členov." },
          ]),
          hint: `Pomnoži z imenovalcem ($x \\ne ${-c}$) in reši linearno enačbo.`,
          data: { given: [`f(x) = ${f}`, `f(x) = ${k}`], find: ["x"] },
          formula: "\\dfrac{p(x)}{q(x)} = k \\iff p(x) = k\\,q(x),\\ q(x) \\ne 0",
          solution: `$${poly([a, b])} = ${k === 1 ? "" : k === -1 ? "-" : k}(x ${sg(c)})$, $x \\ne ${-c}$\n$${poly([a, b])} = ${poly([k, k * c])}$\n$${cf(a - k, "x")} = ${k * c - b}$\n$x = ${ft(xn, xd)}$ (ni enako $${-c}$, zato je rešitev)`,
        };
      }
      // obnašanje ob polu (pojmovna izbira)
      const c = r.nonZero(-6, 6);
      const p = r.nonZero(-5, 5);
      const m = r.pick([1, 2]);
      const f = `\\dfrac{${c}}{${m === 1 ? xm(p) : `(${xm(p)})^2`}}`;
      const LR = "Levo od pola gre $f(x)$ proti $-\\infty$, desno proti $+\\infty$.";
      const RL = "Levo od pola gre $f(x)$ proti $+\\infty$, desno proti $-\\infty$.";
      const PP = "Na obeh straneh pola gre $f(x)$ proti $+\\infty$.";
      const NN = "Na obeh straneh pola gre $f(x)$ proti $-\\infty$.";
      const right = m === 1 ? (c > 0 ? LR : RL) : c > 0 ? PP : NN;
      const W = m === 1
        ? [[c > 0 ? RL : LR, `Preveri predznak: levo od $x = ${p}$ je $${xm(p)} < 0$, desno $> 0$, števec pa je ${c > 0 ? "pozitiven" : "negativen"}.`], [PP, "Pol je enkraten (liha stopnja), zato funkcija ob njem spremeni predznak."], [NN, "Pol je enkraten (liha stopnja), zato funkcija ob njem spremeni predznak."]]
        : [[LR, "Imenovalec je kvadrat, ki je na obeh straneh pozitiven, zato funkcija ob polu ne spremeni predznaka."], [RL, "Imenovalec je kvadrat, ki je na obeh straneh pozitiven, zato funkcija ob polu ne spremeni predznaka."], [c > 0 ? NN : PP, `Ker je $(${xm(p)})^2 > 0$, je predznak funkcije enak predznaku števca.`]];
      return {
        text: `Kako se obnaša funkcija $f(x) = ${f}$ v bližini pola $x = ${p}$?`,
        answer: pickAns(r, right, W),
        hint: "Določi predznak števca in predznak imenovalca levo in desno od pola.",
        data: { given: [`f(x) = ${f}`], find: ["\\text{obnašanje ob polu}"] },
        formula: m === 1 ? "\\text{pol lihe stopnje: } f \\text{ spremeni predznak}" : "\\text{pol sode stopnje: } f \\text{ ne spremeni predznaka}",
        solution: m === 1
          ? `Imenovalec $${xm(p)}$ je levo od $${p}$ negativen, desno pozitiven; števec je ${c > 0 ? "pozitiven" : "negativen"}.\n${right}`
          : `Imenovalec $(${xm(p)})^2$ je na obeh straneh pozitiven; števec je ${c > 0 ? "pozitiven" : "negativen"}.\n${right}`,
      };
    }
    if (level === 2) {
      const t = r.int(0, 2);
      if (t === 0) {
        // povprečni strošek c(x) = (F + vx)/x
        let F, x, k = 0;
        do {
          F = r.pick([600, 800, 900, 1000, 1200, 1500, 1800, 2000, 2400, 3000]);
          x = r.pick([40, 50, 60, 75, 80, 100, 120, 125, 150, 200, 250, 300, 400]);
          k++;
        } while (!Number.isInteger((F * 100) / x) && k < 50);
        if (!Number.isInteger((F * 100) / x)) return null;
        const v = r.pick([1.5, 2, 2.4, 3, 3.5, 4.2, 5, 6.5]);
        const c0 = roundHalfUp(v + F / x, 2);
        const xx = F / (c0 - v);
        const strict = r.next() < 0.5;
        const ans = strict ? Math.floor(xx + 1e-9) + 1 : Math.round(xx);
        const nm = name(r);
        const item = r.pick(["šolske majice", "keramične lončke", "lesene obeske", "torbe iz blaga", "3D-tiskane figurice"]);
        return {
          text: `${nm} izdeluje ${item}. Stalni stroški so $${F}$ €, vsak izdelek pa stane še $${tx(v, 2)}$ €. Povprečni strošek na izdelek je $c(x) = \\dfrac{${F} + ${tx(v, 2)}x}{x}$. Koliko izdelkov mora ${nm} izdelati, da bo povprečni strošek ${strict ? "manjši od" : "enak"} $${tx(c0, 2)}$ €?`,
          answer: num(ans, null, [
            { value: Math.round(F / c0), why: "Upoštevaj tudi strošek vsakega izdelka: $c(x) = \\frac{F}{x} + v$." },
            ...(strict ? [{ value: Math.round(xx), why: "Pri tem številu je strošek natanko enak meji; iščeš manjšega." }] : []),
            { value: Math.round(F / (c0 + v)), why: "Pri prenašanju člena $v$ na drugo stran pazi na predznak." },
          ]),
          hint: `Reši ${strict ? "neenačbo" : "enačbo"} $c(x) ${strict ? "<" : "="} ${tx(c0, 2)}$; pomnoži z $x > 0$.`,
          data: { given: [`F = ${F}\\ \\text{€}`, `v = ${tx(v, 2)}\\ \\text{€}`, `c = ${tx(c0, 2)}\\ \\text{€}`], find: ["x"] },
          formula: ["c(x) = \\dfrac{F + vx}{x} = \\dfrac{F}{x} + v", "x = \\dfrac{F}{c - v}"],
          solution: `$${F} + ${tx(v, 2)}x ${strict ? "<" : "="} ${tx(c0, 2)}x$\n$${F} ${strict ? "<" : "="} ${tx(c0 - v, 2)}x$\n$x ${strict ? ">" : "="} \\dfrac{${F}}{${tx(c0 - v, 2)}} = ${tx(xx)}$\n${strict ? `Najmanjše celo število, večje od $${tx(xx)}$: $${ans}$` : `$x = ${ans}$ izdelkov`}`,
        };
      }
      if (t === 1) {
        // (x − a)/(x − b) ≤ 0 ali < 0: število celih rešitev
        let a, b;
        do {
          a = r.int(-6, 7);
          b = r.int(-6, 7);
        } while (Math.abs(a - b) < 2);
        const strict = r.next() < 0.5;
        const flip = r.next() < 0.4; // (a − x)/(x − b) ≥ 0
        const num0 = flip ? `${a === 0 ? "" : tx(a)} - x`.replace(/^ - x$/, "-x") : xm(a);
        const rel = flip ? (strict ? ">" : "\\ge") : strict ? "<" : "\\le";
        const f = `\\dfrac{${num0}}{${xm(b)}} ${rel} 0`;
        const d = Math.abs(a - b);
        const ans = strict ? d - 1 : d;
        const lo = Math.min(a, b);
        const hi = Math.max(a, b);
        const set = strict ? `(${lo}, ${hi})` : a < b ? `[${a}, ${b})` : `(${b}, ${a}]`;
        return {
          text: `Koliko celih števil reši neenačbo $${f}$?`,
          answer: num(ans, null, strict
            ? [{ value: d, why: "Pri strogi neenačbi ničla števca ni rešitev." }, { value: d + 1, why: "Krajišči nista rešitvi: v ničli števca je ulomek 0, v polu ni definiran." }]
            : [{ value: d + 1, why: `Pol $x = ${b}$ ni rešitev, ker tam ulomek ni definiran.` }, { value: d - 1, why: `Ničla števca $x = ${a}$ reši neenačbo, saj je ulomek tam 0.` }]),
          hint: "Poišči ničlo števca in pol, nariši predznake na številski premici in pazi na krajišči.",
          data: { given: [`f(x) = \\dfrac{${num0}}{${xm(b)}}`], find: ["\\text{število celih rešitev}"] },
          formula: "\\dfrac{p(x)}{q(x)} \\le 0:\\ \\text{ničle } p \\text{ vključene, ničle } q \\text{ izključene}",
          solution: `Ničla števca: $x = ${a}$, pol: $x = ${b}$.\n${flip ? `Neenačba je enakovredna $\\dfrac{${xm(a)}}{${xm(b)}} ${strict ? "<" : "\\le"} 0$.\n` : ""}Ulomek je negativen med $${lo}$ in $${hi}$: rešitev je $${set}$.\nCela števila: $${Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).filter((x) => x !== b && (!strict || x !== a)).join(",\\ ")}$, skupaj $${ans}$.`,
        };
      }
      // enačba z navidezno rešitvijo
      let p, s;
      do {
        p = r.nonZero(-5, 6);
        s = r.nonZero(-5, 6);
      } while (p === s);
      const bb = -(p + s);
      const cc = -p * s;
      const nm0 = poly([1, bb, 0]);
      const eq = `\\dfrac{${nm0}}{${xm(p)}} = \\dfrac{${cc}}{${xm(p)}}`;
      return {
        text: `Reši enačbo $${eq}$.`,
        answer: num(s, null, [
          { value: p, why: `Pri $x = ${p}$ je imenovalec 0, zato to ni rešitev enačbe.` },
          { value: p + s, why: "Vpiši rešitev, ne vsote rešitev kvadratne enačbe." },
          { value: -s, why: "Pazi na predznak pri razcepu kvadratnega trinoma." },
        ]),
        hint: `Pomnoži z imenovalcem, a si zapomni pogoj $x \\ne ${p}$. Na koncu preveri rešitve.`,
        data: { given: [eq], find: ["x"] },
        formula: ["\\dfrac{p(x)}{q(x)} = \\dfrac{r(x)}{q(x)} \\iff p(x) = r(x),\\ q(x) \\ne 0"],
        solution: `Pogoj: $x \\ne ${p}$.\n$${nm0} = ${cc}$ $\\Rightarrow$ $${poly([1, bb, -cc])} = 0$\n$(${xm(p)})(${xm(s)}) = 0$: $x_1 = ${p}$, $x_2 = ${s}$\n$x_1 = ${p}$ ne ustreza pogoju, rešitev je $x = ${s}$.`,
      };
    }
    // ---------- raven 3 ----------
    const t = r.int(0, 2);
    if (t === 0) {
      // obratna naloga: f(x) = (ax + b)/(x + c) iz pola, asimptote in točke
      const p = r.nonZero(-5, 5);
      const k = r.nonZero(-4, 4);
      let x0, y0;
      do {
        x0 = r.int(-5, 6);
        y0 = r.int(-6, 6);
      } while (x0 === p || y0 === k);
      const b = y0 * (x0 - p) - k * x0;
      const askB = r.next() < 0.55;
      let x1;
      do x1 = r.int(-6, 6);
      while (x1 === p || x1 === x0);
      const [fn1, fd1] = fr(k * x1 + b, x1 - p);
      const f = `\\dfrac{ax + b}{x + c}`;
      const sol = `$c = ${-p}$ (pol pri $x = ${p}$), $a = ${k}$ (asimptota $y = ${k}$)\n$${y0} = \\dfrac{${pt(k)} \\cdot ${pt(x0)} + b}{${pt(x0)} ${sg(-p)}}$ $\\Rightarrow$ $b = ${y0} \\cdot ${pt(x0 - p)} - ${pt(k * x0)} = ${b}$`;
      return {
        zeroOk: askB,
        text: `Funkcija $f(x) = ${f}$ ima pol pri $x = ${p}$ in vodoravno asimptoto $y = ${k}$, njen graf pa poteka skozi točko $T(${x0}, ${y0})$. ${askB ? "Koliko je $b$?" : `Koliko je $f(${x1})$? Vpiši ulomek ali celo število.`}`,
        answer: askB
          ? num(b, null, [
              { value: y0 * (x0 + p) - k * x0, why: `Pol pri $x = ${p}$ pomeni $x + c = 0$, torej $c = ${-p}$; pazi na predznak.` },
              ...(k !== 1 ? [{ value: y0 * (x0 - p) - x0, why: "Vodoravna asimptota $y = a$ določa tudi koeficient $a$ v števcu." }] : []),
              { value: -b, why: "Pazi na predznak, ko iz enačbe izraziš $b$." },
            ])
          : frA(fn1, fd1, [
              { value: (k * x1 + y0 * (x0 + p) - k * x0) / (x1 + p), why: `Pol pri $x = ${p}$ pomeni $c = ${-p}$; pazi na predznak.` },
              ...(k !== 1 ? [{ value: (x1 + y0 * (x0 - p) - x0) / (x1 - p), why: "Vodoravna asimptota $y = a$ določa tudi koeficient $a$ v števcu." }] : []),
              { value: (k * x1 - b) / (x1 - p), why: "Pazi na predznak, ko iz enačbe izraziš $b$." },
            ]),
        hint: "Pol je ničla imenovalca (določa $c$), vodoravna asimptota je $y = a$, točka $T$ pa da enačbo za $b$.",
        data: { given: [`x_{\\mathrm{pol}} = ${p}`, `y = ${k}`, `T = (${x0}, ${y0})`], find: [askB ? "b" : `f(${x1})`] },
        formula: ["x + c = 0 \\text{ pri polu}", "y = a \\text{ (vodoravna asimptota)}", "f(x_0) = y_0"],
        solution: askB ? `${sol}\n$b = ${b}$` : `${sol}\n$f(x) = \\dfrac{${poly([k, b])}}{${xm(p)}}$\n$f(${x1}) = \\dfrac{${k * x1 + b}}{${x1 - p}}${fn1 === k * x1 + b && fd1 === x1 - p ? "" : ` = ${ft(fn1, fd1)}`}$`,
      };
    }
    if (t === 1) {
      // koncentracija zdravila c(t) = At/(t² + B)
      const t1 = r.int(1, 4);
      const t2 = t1 + r.int(2, 8);
      const c0 = r.pick([0.5, 1, 1.5, 2, 2.5, 3]);
      const A = c0 * (t1 + t2);
      const B = t1 * t2;
      const ask = r.pick(["first", "second", "dur"]);
      const ans = ask === "first" ? t1 : ask === "second" ? t2 : t2 - t1;
      const model = `c(t) = \\dfrac{${tx(A)}t}{t^2 + ${B}}`;
      const q = ask === "first" ? "Čez koliko ur po zaužitju koncentracija prvič doseže" : ask === "second" ? "Čez koliko ur po zaužitju koncentracija spet pade na" : "Koliko ur je koncentracija vsaj";
      return {
        text: `Koncentracijo zdravila v krvi opisuje $${model}$ ($c$ v $\\mathrm{mg/L}$, $t$ v urah po zaužitju). ${q} $${tx(c0)}\\ \\mathrm{mg/L}$?`,
        answer: num(ans, null, ask === "dur"
          ? [{ value: t2, why: "To je trenutek, ko koncentracija pade pod mejo; čas dobiš kot razliko obeh trenutkov." }, { value: t1 + t2, why: "Rešitvi kvadratne enačbe odštej, ne seštej." }]
          : [{ value: ask === "first" ? t2 : t1, why: `Enačba ima dve rešitvi; iščeš ${ask === "first" ? "prvo (manjšo)" : "drugo (večjo)"}.` }, { value: t1 + t2, why: "To je vsota rešitev; enačbo moraš rešiti." }]),
        hint: `Reši enačbo $c(t) = ${tx(c0)}$: pomnoži z $t^2 + ${B}$ in reši kvadratno enačbo za $t$.`,
        data: { given: [model, `c = ${tx(c0)}\\ \\mathrm{mg/L}`], find: [ask === "dur" ? "\\Delta t" : "t"] },
        formula: ["c(t) = c_0 \\iff c_0 t^2 - At + c_0 B = 0", "t_{1,2} = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"],
        solution: `$${tx(A)}t = ${c0 === 1 ? "" : tx(c0)}(t^2 + ${B})$\n$${cf(c0, "t^2")} - ${tx(A)}t + ${tx(c0 * B)} = 0$ $\\Rightarrow$ $t^2 - ${t1 + t2}t + ${B} = 0$\n$t_1 = ${t1}\\ \\mathrm{h}$, $t_2 = ${t2}\\ \\mathrm{h}$\n${ask === "dur" ? `Med $t_1$ in $t_2$ je $c(t) \\ge ${tx(c0)}$: $\\Delta t = ${t2} - ${t1} = ${ans}\\ \\mathrm{h}$` : `${ask === "first" ? "Prvič" : "Spet"}: $t = ${ans}\\ \\mathrm{h}$`}`,
      };
    }
    // neenačba z dvojnim polom
    let r1, r2, q;
    do {
      r1 = r.int(-6, 3);
      r2 = r1 + r.int(3, 7);
      q = r.int(r1 + 1, r2 - 1);
    } while (r2 > 8);
    const strict = r.next() < 0.4;
    const neg = r.next() < 0.4;
    const nume = neg ? poly([-1, r1 + r2, -r1 * r2]) : poly([1, -(r1 + r2), r1 * r2]);
    const rel = neg ? (strict ? ">" : "\\ge") : strict ? "<" : "\\le";
    const f = `\\dfrac{${nume}}{(${xm(q)})^2}`;
    const ans = strict ? r2 - r1 - 2 : r2 - r1;
    const ints = Array.from({ length: r2 - r1 + 1 }, (_, i) => r1 + i).filter((x) => x !== q && (!strict || (x !== r1 && x !== r2)));
    return {
      text: `Koliko celih števil reši neenačbo $${f} ${rel} 0$?`,
      answer: num(ans, null, [
        { value: ans + 1, why: `Pri $x = ${q}$ je imenovalec 0: to ni rešitev.` },
        { value: strict ? q - r1 - 1 : q - r1, why: "Pol sode stopnje ne spremeni predznaka; rešitve so na obeh straneh pola." },
        { value: strict ? ans + 2 : ans - 2, why: strict ? "Pri strogi neenačbi ničle števca niso rešitve." : "Ničle števca so rešitve, saj je ulomek tam 0." },
      ]),
      hint: "Razstavi števec. Imenovalec je kvadrat, torej povsod (razen v polu) pozitiven: predznak ulomka določa števec.",
      data: { given: [`f(x) = ${f}`], find: ["\\text{število celih rešitev}"] },
      formula: ["(x - q)^2 > 0 \\text{ za } x \\ne q", "x_{1,2} = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"],
      solution: `Števec: $${nume} = ${neg ? "-" : ""}(${xm(r1)})(${xm(r2)})$, ničli $${r1}$ in $${r2}$.\n${neg ? `Neenačba je enakovredna $\\dfrac{(${xm(r1)})(${xm(r2)})}{(${xm(q)})^2} ${strict ? "<" : "\\le"} 0$.\n` : ""}Imenovalec je pozitiven za $x \\ne ${q}$, zato je rešitev $${strict ? `(${r1}, ${r2})` : `[${r1}, ${r2}]`}$ brez $x = ${q}$.\nCela števila: $${ints.join(",\\ ")}$, skupaj $${ans}$.`,
    };
  },
};

export const GIMNAZIJA_MAT_SS3 = wrapGens([trig, sinkos, skalar, poli, racio]);
