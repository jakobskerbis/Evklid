// Generatorji za teme, ki prej niso imele nalog (mat-ss34). Merila: docs/kakovost.md §2.
// Gimnazija, 3. in 4. letnik (vključno z maturo). Odgovori, ki bi bili izrazi, so
// preoblikovani v število (vrednost v točki, koeficient, ulomek a/b) ali v izbiro (options_tex).
import { NAMES, choices, g } from "../rng.js";
import { roundHalfUp } from "../check.js";
import { tx } from "./mat.js";

const P = "dod-mat-ss34-";
const T = (y, s) => `MAT-SS-${y}/${s}`;

// ---------- pomožne funkcije ----------
function gcd2(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}
// Okrajšan ulomek s pozitivnim imenovalcem.
function fr(n, d) {
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const k = gcd2(n, d);
  return [n / k, d / k];
}
const frAns = (n, d) => {
  const [a, b] = fr(n, d);
  return { type: "fraction", num: a, den: b };
};
// Ulomek v TeX (okrajšan): 3/4 → \frac{3}{4}, -6/3 → -2.
function ft(n, d) {
  const [a, b] = fr(n, d);
  if (b === 1) return `${a}`;
  return `${a < 0 ? "-" : ""}\\frac{${Math.abs(a)}}{${b}}`;
}
// Ulomek kot vrstica v podatkih, v besedilu pa kot a/b, ko je potreben v običajnem zapisu.
const sameAt = (a, b, d) => Math.abs(roundHalfUp(a, d ?? 6) - roundHalfUp(b, d ?? 6)) < 1e-9;
// Številski odgovor; napake, ki bi se ujemale s pravilnim odgovorom ali med seboj, izpustimo.
function num(value, decimals = null, mistakes = [], unit = null) {
  const ms = [];
  for (const m of mistakes) {
    if (!m || !Number.isFinite(m.value)) continue;
    if (sameAt(m.value, value, decimals)) continue;
    if (ms.some((x) => sameAt(x.value, m.value, decimals))) continue;
    ms.push(m);
  }
  const a = { type: "number", value, decimals, mistakes: ms.slice(0, 3) };
  if (unit) a.unit = unit;
  return a;
}
const eur = (value, mistakes = []) => ({ ...num(value, 2, mistakes, "€"), unitAlternatives: ["eur", "evrov", "evra"] });
// Predznak in absolutna vrednost za nadaljevanje izraza: sg(-3) → "- 3", sg(2) → "+ 2".
const sg = (c) => (c < 0 ? `- ${tx(-c)}` : `+ ${tx(c)}`);
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
// Člen s koeficientom: tm(-1, "x") → "- x", tm(3, "x", true) → "3x", tm(0, "x") → "+ 0x".
const tm = (c, v, first = false) => `${c < 0 ? (first ? "-" : "- ") : first ? "" : "+ "}${Math.abs(c) === 1 ? "" : tx(Math.abs(c))}${v}`;
// Linearni izraz a·v + b: le(2, -3, "n") → "2n - 3".
const le = (a, b, v = "x") => `${tm(a, v, true)}${b ? ` ${sg(b)}` : ""}`;
const ev = (cs, x) => cs.reduce((acc, c) => acc * x + c, 0);
const der = (cs) => cs.slice(0, -1).map((c, i) => c * (cs.length - 1 - i));
// Produkt polinomov (koeficienti od najvišje potence).
function mul(p, q) {
  const out = Array(p.length + q.length - 1).fill(0);
  p.forEach((a, i) => q.forEach((b, j) => (out[i + j] += a * b)));
  return out;
}
const fromRoots = (roots, lead = 1) => roots.reduce((acc, x) => mul(acc, [1, -x]), [lead]);
// Razlika z oklepajem pri negativnem odštevancu: dif(5, -2) → "5 - (-2)".
const dif = (a, b) => `${a} - ${b < 0 ? `(${b})` : b}`;
const vt = (v) => `(${v.join(", ")})`;
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const norm = (a) => Math.sqrt(dot(a, a));
// Linearni faktor (x - a): lin(3) → "(x - 3)", lin(-2) → "(x + 2)", lin(0) → "x".
const lin = (a, v = "x") => (a === 0 ? v : `(${v} ${sg(-a)})`);
// Kot nπ/d v TeX.
function radTex(n, d) {
  const [a, b] = fr(n, d);
  const s = a < 0 ? "-" : "";
  const A = Math.abs(a);
  if (b === 1) return `${s}${A === 1 ? "" : A}\\pi`;
  return `${s}\\frac{${A === 1 ? "" : A}\\pi}{${b}}`;
}
// Izbira z razlago za vsak napačen odgovor: wrongs = [[možnost, zakaj], …].
function pickAns(r, correct, wrongs) {
  const map = new Map();
  for (const [o, w] of wrongs) if (o !== correct && !map.has(o)) map.set(o, w);
  const c = choices(r, correct, [...map.keys()]);
  return { type: "choice", ...c, why: c.options.map((o) => (o === correct ? null : map.get(o))) };
}
const name = (r) => r.pick(NAMES);
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const C = (n, k) => (k < 0 || k > n ? 0 : Math.round(fact(n) / (fact(k) * fact(n - k))));
const V = (n, k) => Math.round(fact(n) / fact(n - k));
const DEG = Math.PI / 180;

// Natančne vrednosti kotnih funkcij za 30°, 45°, 60°.
const EXACT = {
  sin: { 30: "\\frac{1}{2}", 45: "\\frac{\\sqrt{2}}{2}", 60: "\\frac{\\sqrt{3}}{2}" },
  cos: { 30: "\\frac{\\sqrt{3}}{2}", 45: "\\frac{\\sqrt{2}}{2}", 60: "\\frac{1}{2}" },
  tan: { 30: "\\frac{\\sqrt{3}}{3}", 45: "1", 60: "\\sqrt{3}" },
};
// Predznak kotne funkcije po kvadrantih 1–4.
const SIGN = { sin: [1, 1, -1, -1], cos: [1, -1, -1, 1], tan: [1, -1, 1, -1] };
const FN_NAME = { sin: "sinus", cos: "kosinus", tan: "tangens" };
const neg = (t) => (t.startsWith("-") ? t.slice(1) : `-${t}`);
// Pitagorejske trojice (a, b, c) z a² + b² = c².
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
// Interval kvadranta v TeX (stopinje ali radiani).
const QUAD_DEG = ["", "0^\\circ < \\alpha < 90^\\circ", "90^\\circ < \\alpha < 180^\\circ", "180^\\circ < \\alpha < 270^\\circ", "270^\\circ < \\alpha < 360^\\circ"];
const QUAD_RAD = ["", "0 < \\alpha < \\frac{\\pi}{2}", "\\frac{\\pi}{2} < \\alpha < \\pi", "\\pi < \\alpha < \\frac{3\\pi}{2}", "\\frac{3\\pi}{2} < \\alpha < 2\\pi"];

const GENS = [
  // ---------------- 3. letnik ----------------
  {
    id: P + "kotne-funkcije-poljubnega-kota",
    topics: [T(3, "kotne-funkcije-poljubnega-kota")],
    gen(level, r) {
      if (level === 1) {
        const t = r.int(0, 3);
        if (t === 0) {
          const a = r.pick([15, 20, 36, 40, 72, 75, 105, 135, 150, 210, 225, 240, 252, 300, 315, 330]);
          return {
            text: `Kot $${a}^\\circ$ zapiši v radianih v obliki $k\\pi$. Koliko je $k$? Vpiši okrajšan ulomek.`,
            answer: frAns(a, 180),
            hint: "Iztegnjeni kot $180^\\circ$ meri $\\pi$ radianov. Kolikšen del iztegnjenega kota je dani kot?",
            data: { given: [`\\alpha = ${a}^\\circ`], find: ["k"] },
            formula: "\\alpha_{\\mathrm{rad}} = \\dfrac{\\alpha^\\circ}{180^\\circ} \\cdot \\pi",
            solution: `$\\alpha = \\dfrac{${a}^\\circ}{180^\\circ} \\cdot \\pi = ${radTex(a, 180)}$\nKer je $\\alpha = k\\pi$, je $k = ${ft(a, 180)}$.`,
          };
        }
        if (t === 1) {
          const [n, d] = r.pick([[2, 3], [3, 4], [5, 6], [7, 6], [5, 4], [4, 3], [5, 3], [7, 4], [11, 6], [3, 5], [7, 12], [5, 12], [2, 9], [7, 10], [3, 8], [5, 18]]);
          const a = (180 * n) / d;
          return {
            text: `Koliko stopinj meri kot $${radTex(n, d)}$ (v radianih)?`,
            answer: num(a, null, [{ value: 2 * a, why: "Si $\\pi$ zamenjal s $360^\\circ$? Velja $\\pi\\ \\mathrm{rad} = 180^\\circ$." }]),
            hint: "Namesto $\\pi$ vstavi $180^\\circ$ in izračunaj.",
            data: { given: [`\\alpha = ${radTex(n, d)}`], find: ["\\alpha \\text{ v stopinjah}"] },
            formula: "\\alpha^\\circ = \\dfrac{\\alpha_{\\mathrm{rad}}}{\\pi} \\cdot 180^\\circ",
            solution: `$\\alpha = ${radTex(n, d)} = \\dfrac{${n} \\cdot 180^\\circ}{${d}}$\n$\\alpha = ${tx(a)}^\\circ$`,
          };
        }
        if (t === 2) {
          const x = r.dec(0.4, 5.9, 2);
          const a = (x * 180) / Math.PI;
          return {
            text: `Kolo zavrti za kot $${tx(x)}\\ \\mathrm{rad}$. Koliko stopinj je to? Zaokroži na eno decimalko.`,
            answer: num(a, 1, [{ value: (x * Math.PI) / 180, why: "Si množil s $\\frac{\\pi}{180}$? Ta faktor pretvarja stopinje v radiane, ne obratno." }]),
            hint: "En radian je $\\dfrac{180^\\circ}{\\pi} \\approx 57{,}3^\\circ$.",
            data: { given: [`\\alpha = ${tx(x)}\\ \\mathrm{rad}`], find: ["\\alpha \\text{ v stopinjah}"] },
            formula: "\\alpha^\\circ = \\alpha_{\\mathrm{rad}} \\cdot \\dfrac{180^\\circ}{\\pi}",
            solution: `$\\alpha = ${tx(x)} \\cdot \\dfrac{180^\\circ}{\\pi}$\n$\\alpha \\approx ${tx(a, 1)}^\\circ$`,
          };
        }
        const a = r.pick([10, 25, 35, 40, 50, 65, 80, 100, 110, 125, 140, 160, 200, 250, 280, 310]);
        const x = a * DEG;
        return {
          text: `Kot $${a}^\\circ$ izrazi v radianih. Zaokroži na tri decimalke.`,
          answer: num(x, 3, [{ value: (a * 180) / Math.PI, why: "Si množil s $\\frac{180}{\\pi}$? Iz stopinj v radiane množiš s $\\frac{\\pi}{180^\\circ}$." }]),
          hint: "Stopinje pretvoriš v radiane tako, da jih pomnožiš s $\\dfrac{\\pi}{180^\\circ}$.",
          data: { given: [`\\alpha = ${a}^\\circ`], find: ["\\alpha \\text{ v radianih}"] },
          formula: "\\alpha_{\\mathrm{rad}} = \\alpha^\\circ \\cdot \\dfrac{\\pi}{180^\\circ}",
          solution: `$\\alpha = ${a}^\\circ \\cdot \\dfrac{\\pi}{180^\\circ} = ${radTex(a, 180)}$\n$\\alpha \\approx ${tx(x, 3)}$`,
        };
      }
      if (level === 2) {
        // natančna vrednost v poljubnem kvadrantu
        const ref = r.pick([30, 45, 60]);
        const q = r.int(2, 4);
        const ang = q === 2 ? 180 - ref : q === 3 ? 180 + ref : 360 - ref;
        const fn = r.pick(["sin", "cos", "tan"]);
        const s = SIGN[fn][q - 1];
        const val = EXACT[fn][ref];
        const correct = s < 0 ? `-${val}` : val;
        const co = fn === "sin" ? EXACT.cos[ref] : fn === "cos" ? EXACT.sin[ref] : EXACT.tan[90 - ref];
        const coS = s < 0 ? `-${co}` : co;
        const other = ref === 45 ? (fn === "tan" ? "\\frac{\\sqrt{2}}{2}" : "\\frac{1}{2}") : null;
        const wrongs = [
          [neg(correct), `Absolutna vrednost je prava, predznak pa ne. Kakšen predznak ima ${FN_NAME[fn]} v ${q}. kvadrantu?`],
          [coS, fn === "tan" ? "Si izračunal kotangens? Tangens je količnik $\\frac{\\sin}{\\cos}$." : "Si zamenjal sinus in kosinus? Na enotski krožnici je kosinus abscisa, sinus pa ordinata točke."],
          [neg(coS), "Preveri referenčni kot (ostri kot do osi $x$) in predznak v kvadrantu."],
        ];
        if (other) wrongs.splice(1, 0, [s < 0 ? `-${other}` : other, fn === "tan" ? "To je vrednost sinusa oz. kosinusa kota $45^\\circ$, tangens je njun količnik." : "Si uporabil vrednost za kot $30^\\circ$? Referenčni kot je $45^\\circ$."]);
        const rad = r.next() < 0.5;
        const angTex = rad ? radTex(ang, 180) : `${ang}^\\circ`;
        const base = q === 4 ? 360 : 180;
        const op = q === 2 ? "-" : q === 3 ? "+" : "-";
        return {
          text: `Izračunaj natančno vrednost $\\${fn} ${angTex}$.`,
          answer: pickAns(r, correct, wrongs),
          options_tex: true,
          hint: `Določi kvadrant, v katerem leži kot, in referenčni kot. Nato premisli, kakšen predznak ima ${FN_NAME[fn]} v tem kvadrantu.`,
          data: { given: [`\\alpha = ${angTex}`], find: [`\\${fn}\\alpha`] },
          formula: `\\${fn}(${base}^\\circ ${op} \\varphi) = ${s < 0 ? "-" : ""}\\${fn}\\varphi`,
          solution: `Kot $${angTex}${rad ? ` = ${ang}^\\circ` : ""}$ leži v ${q}. kvadrantu, referenčni kot je $\\varphi = ${ref}^\\circ$.\nV ${q}. kvadrantu je ${FN_NAME[fn]} ${s < 0 ? "negativen" : "pozitiven"}.\n$\\${fn} ${angTex} = ${s < 0 ? "-" : ""}\\${fn} ${ref}^\\circ = ${correct}$`,
        };
      }
      // raven 3: iz ene kotne funkcije in kvadranta izračunaj drugo
      const [a, b, c] = r.pick(TRIPLES);
      const swap = r.next() < 0.5;
      const [p, k] = swap ? [b, a] : [a, b]; // |sin| = p/c, |cos| = k/c
      const q = r.int(2, 4);
      const sS = SIGN.sin[q - 1];
      const sC = SIGN.cos[q - 1];
      const givenFn = r.pick(["sin", "cos"]);
      const target = givenFn === "sin" ? r.pick(["cos", "tan"]) : r.pick(["sin", "tan"]);
      const sinV = [sS * p, c];
      const cosV = [sC * k, c];
      const tanV = [sS * p, sC * k];
      const gv = givenFn === "sin" ? sinV : cosV;
      const res = target === "sin" ? sinV : target === "cos" ? cosV : tanV;
      const rad = r.next() < 0.5;
      const other = givenFn === "sin" ? "cos" : "sin";
      const ov = givenFn === "sin" ? cosV : sinV;
      const om = givenFn === "sin" ? k : p;
      return {
        text: `Za kot $\\alpha$ velja $\\${givenFn}\\alpha = ${ft(...gv)}$ in $${rad ? QUAD_RAD[q] : QUAD_DEG[q]}$. Izračunaj natančno vrednost $\\${target}\\alpha$ in jo vpiši kot ulomek.`,
        answer: frAns(...res),
        hint: `Najprej iz zveze $\\sin^2\\alpha + \\cos^2\\alpha = 1$ izračunaj $\\${other}\\alpha$ in mu določi predznak glede na kvadrant.`,
        data: { given: [`\\${givenFn}\\alpha = ${ft(...gv)}`], find: [`\\${target}\\alpha`] },
        formula: ["\\sin^2\\alpha + \\cos^2\\alpha = 1", "\\tan\\alpha = \\dfrac{\\sin\\alpha}{\\cos\\alpha}"],
        solution: `$\\${other}^2\\alpha = 1 - \\left(${ft(...gv)}\\right)^2 = ${ft(om * om, c * c)}$, torej $|\\${other}\\alpha| = ${ft(om, c)}$.\nKot leži v ${q}. kvadrantu, kjer je ${FN_NAME[other]} ${(other === "sin" ? sS : sC) < 0 ? "negativen" : "pozitiven"}: $\\${other}\\alpha = ${ft(...ov)}$.\n${target === "tan" ? `$\\tan\\alpha = \\dfrac{\\sin\\alpha}{\\cos\\alpha} = \\dfrac{${ft(...sinV)}}{${ft(...cosV)}} = ${ft(...tanV)}$` : `$\\${target}\\alpha = ${ft(...res)}$`}`,
      };
    },
  },
  {
    id: P + "grafi-kotnih-funkcij",
    topics: [T(3, "grafi-kotnih-funkcij")],
    gen(level, r) {
      // bx v TeX za b = bn/bd
      const bx = (bn, bd) => (bd === 1 ? `${bn === 1 ? "" : bn}x` : `\\frac{${bn === 1 ? "" : bn}x}{${bd}}`);
      if (level === 1) {
        const fn = r.pick(["sin", "cos", "tan"]);
        const [bn, bd] = r.pick([[2, 1], [3, 1], [4, 1], [1, 2], [1, 3], [2, 3], [3, 2], [1, 4], [5, 1]]);
        const A = r.pick([2, 3, 4, 5, -2, -3, -4, 1.5, -0.5]);
        const askAmp = fn !== "tan" && r.next() < 0.45;
        const f = `${A === 1 ? "" : tx(A)}\\${fn}\\left(${bx(bn, bd)}\\right)`;
        if (askAmp) {
          return {
            text: `Kolikšna je amplituda funkcije $f(x) = ${f}$?`,
            answer: num(Math.abs(A), null, [{ value: A, why: "Amplituda je razdalja od srednje črte do vrha, zato je vedno pozitivna." }, { value: 2 * Math.abs(A), why: "To je razlika med največjo in najmanjšo vrednostjo; amplituda je njena polovica." }]),
            hint: "Amplituda funkcije $a\\sin(bx)$ ali $a\\cos(bx)$ je $|a|$.",
            data: { given: [`f(x) = ${f}`], find: ["\\text{amplituda}"] },
            formula: "A = |a|",
            solution: `Funkcija ima obliko $a\\${fn}(bx)$ z $a = ${tx(A)}$.\nAmplituda je $|a| = ${tx(Math.abs(A))}$.`,
          };
        }
        const per = fn === "tan" ? [bd, bn] : [2 * bd, bn]; // perioda = per·π
        return {
          text: `Perioda funkcije $f(x) = ${f}$ je $k\\pi$. Koliko je $k$? Vpiši ulomek ali celo število.`,
          answer: frAns(...per),
          hint: `Osnovna perioda funkcije $\\${fn} x$ je $${fn === "tan" ? "\\pi" : "2\\pi"}$. Pri $\\${fn}(bx)$ jo deliš z $b$.`,
          data: { given: [`f(x) = ${f}`], find: ["k"] },
          formula: fn === "tan" ? "T = \\dfrac{\\pi}{b}" : "T = \\dfrac{2\\pi}{b}",
          solution: `$b = ${ft(bn, bd)}$\n$T = \\dfrac{${fn === "tan" ? "\\pi" : "2\\pi"}}{${ft(bn, bd)}} = ${radTex(...per)}$, torej $k = ${ft(...per)}$.`,
        };
      }
      if (level === 2) {
        if (r.next() < 0.6) {
          const fn = r.pick(["sin", "cos"]);
          const A = r.pick([2, 3, 4, 5, -2, -3, -5, 1.5, -2.5]);
          const d = r.nonZero(-6, 6);
          const b = r.int(2, 4);
          const askMax = r.next() < 0.5;
          const res = askMax ? Math.abs(A) + d : d - Math.abs(A);
          const f = `${tx(A)}\\${fn}(${b}x) ${sg(d)}`;
          const ctx = r.pick([
            `Odmik nihala opisuje funkcija $f(x) = ${f}$.`,
            `Dana je funkcija $f(x) = ${f}$.`,
            `Višino vode ob plimi in oseki (v metrih) opisuje model $f(x) = ${f}$.`,
          ]);
          return {
            text: `${ctx} Kolikšna je ${askMax ? "največja" : "najmanjša"} vrednost funkcije?`,
            answer: num(res, null, [
              { value: askMax ? A + d : d - A, why: "Si upošteval, da je amplituda $|a|$? Pri negativnem $a$ se graf le prezrcali." },
              { value: askMax ? Math.abs(A) : -Math.abs(A), why: "Si pozabil na premik grafa v smeri osi $y$?" },
            ]),
            hint: `Vrednost $\\${fn}(${b}x)$ je med $-1$ in $1$. Kam se to razteza po množenju z amplitudo in premiku?`,
            data: { given: [`f(x) = ${f}`], find: [askMax ? "f_{\\max}" : "f_{\\min}"] },
            formula: ["f_{\\max} = |a| + d", "f_{\\min} = d - |a|"],
            solution: `$-1 \\le \\${fn}(${b}x) \\le 1$, amplituda je $|${tx(A)}| = ${tx(Math.abs(A))}$, srednja črta je $y = ${d}$.\n$f_{${askMax ? "\\max" : "\\min"}} = ${d} ${askMax ? "+" : "-"} ${tx(Math.abs(A))} = ${tx(res)}$`,
          };
        }
        // premik grafa vzdolž osi x
        const b = r.pick([1, 2, 3]);
        const [cn, cd] = r.pick([[1, 3], [1, 4], [1, 6], [2, 3], [1, 2]]);
        const sign = r.pick([-1, 1]);
        const fn = r.pick(["sin", "cos"]);
        const inner = `${b === 1 ? "" : b}x ${sign < 0 ? "-" : "+"} ${radTex(cn, cd)}`;
        const sh = [cn, cd * b];
        const dir = sign < 0 ? "desno" : "levo";
        const odir = sign < 0 ? "levo" : "desno";
        const opt = (n, d, w) => `\\text{za } ${radTex(n, d)} \\text{ v ${w}}`;
        const correct = opt(...sh, dir);
        const wrongs = [[opt(...sh, odir), "Pri $x - c$ se graf premakne v desno, pri $x + c$ v levo (nasprotno od predznaka)."]];
        if (b !== 1) {
          wrongs.push([opt(cn, cd, dir), `Si pozabil izpostaviti ${b}? Premik vidiš šele v obliki $b(x - c)$.`]);
          wrongs.push([opt(cn, cd, odir), "Izpostavi $b$ in pazi na smer premika."]);
        } else {
          wrongs.push([opt(cn, cd, sign < 0 ? "navzdol" : "navzgor").replace("v navz", "navz"), "Število v argumentu premakne graf vzdolž osi $x$; premik vzdolž osi $y$ bi bil prištet zunaj funkcije."]);
        }
        const f = `\\${fn}\\left(${inner}\\right)`;
        return {
          text: `Za koliko in v katero smer je graf funkcije $f(x) = ${f}$ premaknjen vzdolž osi $x$ glede na graf funkcije $y = \\${fn}(${b === 1 ? "" : b}x)$?`,
          answer: pickAns(r, correct, wrongs),
          options_tex: true,
          hint: b === 1 ? "Graf $y = f(x - c)$ je graf $y = f(x)$, premaknjen za $c$ v desno." : `Argument zapiši v obliki $${b}(x - c)$: izpostavi ${b}.`,
          data: false,
          formula: "y = f(x - c):\\ \\text{premik za } c \\text{ v desno}",
          solution: `${b === 1 ? `Argument je oblike $x ${sign < 0 ? "-" : "+"} c$ s $c = ${radTex(...sh)}$.` : `$${inner} = ${b}\\left(x ${sign < 0 ? "-" : "+"} ${radTex(...sh)}\\right)$`}\nGraf je premaknjen za $${radTex(...sh)}$ v ${dir}.`,
        };
      }
      // raven 3: iz največje, najmanjše vrednosti in periode določi a, b, c, nato f(x0)
      const a = r.int(1, 5);
      const c = r.nonZero(-3, 4);
      const M = c + a;
      const m = c - a;
      const [bn, bd] = r.pick([[2, 1], [3, 1], [4, 1], [1, 2], [2, 3]]);
      const per = [2 * bd, bn];
      const th = r.pick([[1, 6, 0.5], [1, 2, 1], [5, 6, 0.5], [7, 6, -0.5], [3, 2, -1], [11, 6, -0.5]]);
      const x0 = [th[0] * bd, th[1] * bn]; // x0 = θ/b
      const s = th[2];
      const res = a * s + c;
      return {
        text: `Graf funkcije $f(x) = a\\sin(bx) + c$ z $a, b > 0$ ima največjo vrednost $${M}$, najmanjšo vrednost $${m}$ in osnovno periodo $${radTex(...per)}$. Izračunaj $f\\left(${radTex(...x0)}\\right)$.`,
        answer: num(res, null, [
          { value: (M - m) * s + c, why: "Amplituda je polovica razlike med največjo in najmanjšo vrednostjo." },
          { value: a * s, why: "Si pozabil na premik $c$ (srednjo črto)?" },
          { value: a * s + (M - m) / 2, why: "Srednja črta je povprečje največje in najmanjše vrednosti: $c = \\frac{M + m}{2}$." },
        ]),
        hint: "Amplituda je polovica razlike med največjo in najmanjšo vrednostjo, srednja črta pa njuno povprečje. Iz periode izračunaj $b$.",
        data: { given: [`f_{\\max} = ${M}`, `f_{\\min} = ${m}`, `T = ${radTex(...per)}`], find: [`f\\left(${radTex(...x0)}\\right)`] },
        formula: ["a = \\dfrac{f_{\\max} - f_{\\min}}{2}", "c = \\dfrac{f_{\\max} + f_{\\min}}{2}", "b = \\dfrac{2\\pi}{T}"],
        solution: `$a = \\dfrac{${M} - (${m})}{2} = ${a}$, $c = \\dfrac{${M} + (${m})}{2} = ${c}$\n$b = \\dfrac{2\\pi}{${radTex(...per)}} = ${ft(bn, bd)}$\n$f\\left(${radTex(...x0)}\\right) = ${a === 1 ? "" : a}\\sin\\left(${radTex(th[0], th[1])}\\right) ${sg(c)} = ${a} \\cdot (${tx(s)}) ${sg(c)} = ${tx(res)}$`,
      };
    },
  },
  {
    id: P + "adicijski-izreki",
    topics: [T(3, "adicijski-izreki")],
    gen(level, r) {
      if (level === 1) {
        const [a, b, c] = r.pick(TRIPLES);
        const [s, k] = r.next() < 0.5 ? [b, a] : [a, b];
        const ask = r.pick(["sin", "cos", "tan"]);
        if (ask === "tan") {
          return {
            text: `Za ostri kot $\\alpha$ velja $\\tan\\alpha = ${ft(s, k)}$. Izračunaj $\\tan 2\\alpha$ in ga vpiši kot ulomek.`,
            answer: frAns(2 * s * k, k * k - s * s),
            hint: "Uporabi formulo za tangens dvojnega kota in uredi dvojni ulomek.",
            data: { given: [`\\tan\\alpha = ${ft(s, k)}`], find: ["\\tan 2\\alpha"] },
            formula: "\\tan 2\\alpha = \\dfrac{2\\tan\\alpha}{1 - \\tan^2\\alpha}",
            solution: `$\\tan 2\\alpha = \\dfrac{2 \\cdot ${ft(s, k)}}{1 - \\left(${ft(s, k)}\\right)^2}$\n$= \\dfrac{${ft(2 * s, k)}}{${ft(k * k - s * s, k * k)}} = ${ft(2 * s * k, k * k - s * s)}$`,
          };
        }
        const res = ask === "sin" ? [2 * s * k, c * c] : [k * k - s * s, c * c];
        return {
          text: `Za ostri kot $\\alpha$ velja $\\sin\\alpha = ${ft(s, c)}$ in $\\cos\\alpha = ${ft(k, c)}$. Izračunaj $\\${ask} 2\\alpha$ in ga vpiši kot ulomek.`,
          answer: frAns(...res),
          hint: `Uporabi formulo za ${ask === "sin" ? "sinus" : "kosinus"} dvojnega kota.`,
          data: { given: [`\\sin\\alpha = ${ft(s, c)}`, `\\cos\\alpha = ${ft(k, c)}`], find: [`\\${ask} 2\\alpha`] },
          formula: ask === "sin" ? "\\sin 2\\alpha = 2\\sin\\alpha\\cos\\alpha" : "\\cos 2\\alpha = \\cos^2\\alpha - \\sin^2\\alpha",
          solution:
            ask === "sin"
              ? `$\\sin 2\\alpha = 2 \\cdot ${ft(s, c)} \\cdot ${ft(k, c)}$\n$\\sin 2\\alpha = ${ft(...res)}$`
              : `$\\cos 2\\alpha = \\left(${ft(k, c)}\\right)^2 - \\left(${ft(s, c)}\\right)^2 = ${ft(k * k, c * c)} - ${ft(s * s, c * c)}$\n$\\cos 2\\alpha = ${ft(...res)}$`,
        };
      }
      if (level === 2) {
        const [a, b, c] = r.pick(TRIPLES);
        const [p, k] = r.next() < 0.5 ? [b, a] : [a, b];
        const q = r.int(2, 4);
        const sS = SIGN.sin[q - 1];
        const sC = SIGN.cos[q - 1];
        const givenSin = r.next() < 0.5;
        const ask = r.pick(["sin", "tan", "sin"]);
        const sinV = [sS * p, c];
        const cosV = [sC * k, c];
        const res = ask === "sin" ? [2 * sS * p * sC * k, c * c] : [2 * sS * p * sC * k, k * k - p * p];
        const gv = givenSin ? sinV : cosV;
        const ov = givenSin ? cosV : sinV;
        const oth = givenSin ? "cos" : "sin";
        const rad = r.next() < 0.5;
        return {
          text: `Za kot $\\alpha$ velja $\\${givenSin ? "sin" : "cos"}\\alpha = ${ft(...gv)}$ in $${rad ? QUAD_RAD[q] : QUAD_DEG[q]}$. Izračunaj natančno vrednost $\\${ask} 2\\alpha$ (ulomek).`,
          answer: frAns(...res),
          hint: `Najprej izračunaj $\\${oth}\\alpha$; predznak določi kvadrant. Nato uporabi formulo za dvojni kot.`,
          data: { given: [`\\${givenSin ? "sin" : "cos"}\\alpha = ${ft(...gv)}`], find: [`\\${ask} 2\\alpha`] },
          formula: ["\\sin^2\\alpha + \\cos^2\\alpha = 1", ask === "sin" ? "\\sin 2\\alpha = 2\\sin\\alpha\\cos\\alpha" : "\\tan 2\\alpha = \\dfrac{\\sin 2\\alpha}{\\cos 2\\alpha} = \\dfrac{2\\sin\\alpha\\cos\\alpha}{\\cos^2\\alpha - \\sin^2\\alpha}"],
          solution: `$\\${oth}^2\\alpha = 1 - \\left(${ft(...gv)}\\right)^2 = ${ft((givenSin ? k : p) ** 2, c * c)}$; v ${q}. kvadrantu je $\\${oth}\\alpha = ${ft(...ov)}$.\n$\\sin 2\\alpha = 2 \\cdot \\left(${ft(...sinV)}\\right) \\cdot \\left(${ft(...cosV)}\\right) = ${ft(2 * sS * p * sC * k, c * c)}$${ask === "tan" ? `\n$\\cos 2\\alpha = \\cos^2\\alpha - \\sin^2\\alpha = ${ft(k * k - p * p, c * c)}$\n$\\tan 2\\alpha = \\dfrac{${ft(2 * sS * p * sC * k, c * c)}}{${ft(k * k - p * p, c * c)}} = ${ft(...res)}$` : ""}`,
        };
      }
      // raven 3: sin/cos vsote ali razlike dveh kotov
      if (r.next() < 0.25) {
        let n1, d1, n2, d2;
        do {
          [n1, d1] = [r.int(1, 5), r.int(1, 5)];
          [n2, d2] = [r.nonZero(-4, 5), r.int(1, 5)];
        } while (d1 * d2 === n1 * n2 || gcd2(n1, d1) !== 1 || gcd2(n2, d2) !== 1 || n1 * d2 === n2 * d1);
        const minus = r.next() < 0.5;
        const num2 = minus ? n1 * d2 - n2 * d1 : n1 * d2 + n2 * d1;
        const den2 = minus ? d1 * d2 + n1 * n2 : d1 * d2 - n1 * n2;
        if (den2 === 0) return null;
        return {
          text: `Velja $\\tan\\alpha = ${ft(n1, d1)}$ in $\\tan\\beta = ${ft(n2, d2)}$. Izračunaj $\\tan(\\alpha ${minus ? "-" : "+"} \\beta)$ in ga vpiši kot okrajšan ulomek.`,
          answer: frAns(num2, den2),
          hint: "Uporabi adicijski izrek za tangens; števec in imenovalec dvojnega ulomka pomnoži s skupnim imenovalcem.",
          data: { given: [`\\tan\\alpha = ${ft(n1, d1)}`, `\\tan\\beta = ${ft(n2, d2)}`], find: [`\\tan(\\alpha ${minus ? "-" : "+"} \\beta)`] },
          formula: `\\tan(\\alpha ${minus ? "-" : "+"} \\beta) = \\dfrac{\\tan\\alpha ${minus ? "-" : "+"} \\tan\\beta}{1 ${minus ? "+" : "-"} \\tan\\alpha\\tan\\beta}`,
          solution: `Števec: $${ft(n1, d1)} ${minus ? "-" : "+"} \\left(${ft(n2, d2)}\\right) = ${ft(num2, d1 * d2)}$\nImenovalec: $1 ${minus ? "+" : "-"} ${ft(n1, d1)} \\cdot \\left(${ft(n2, d2)}\\right) = ${ft(den2, d1 * d2)}$\n$\\tan(\\alpha ${minus ? "-" : "+"} \\beta) = ${ft(num2, den2)}$`,
        };
      }
      const [a1, b1, c1] = r.pick(TRIPLES);
      const [a2, b2, c2] = r.pick(TRIPLES);
      const qa = r.pick([1, 2]);
      const qb = r.pick([1, 3, 4]);
      const sa = [SIGN.sin[qa - 1] * a1, c1];
      const ca = [SIGN.cos[qa - 1] * b1, c1];
      const sb = [SIGN.sin[qb - 1] * a2, c2];
      const cb = [SIGN.cos[qb - 1] * b2, c2];
      const fn = r.pick(["sin", "cos"]);
      const minus = r.next() < 0.5;
      const op = minus ? "-" : "+";
      let n;
      if (fn === "sin") n = sa[0] * cb[0] + (minus ? -1 : 1) * ca[0] * sb[0];
      else n = ca[0] * cb[0] + (minus ? 1 : -1) * sa[0] * sb[0];
      const den = c1 * c2;
      const exp =
        fn === "sin"
          ? `\\sin\\alpha\\cos\\beta ${op} \\cos\\alpha\\sin\\beta`
          : `\\cos\\alpha\\cos\\beta ${minus ? "+" : "-"} \\sin\\alpha\\sin\\beta`;
      const fill =
        fn === "sin"
          ? `${ft(...sa)} \\cdot \\left(${ft(...cb)}\\right) ${op} \\left(${ft(...ca)}\\right) \\cdot \\left(${ft(...sb)}\\right)`
          : `\\left(${ft(...ca)}\\right) \\cdot \\left(${ft(...cb)}\\right) ${minus ? "+" : "-"} ${ft(...sa)} \\cdot \\left(${ft(...sb)}\\right)`;
      return {
        text: `Velja $\\sin\\alpha = ${ft(...sa)}$, $${QUAD_DEG[qa].replace(/alpha/g, "alpha")}$, in $\\cos\\beta = ${ft(...cb)}$, $${QUAD_DEG[qb].replace(/alpha/g, "beta")}$. Izračunaj natančno vrednost $\\${fn}(\\alpha ${op} \\beta)$ (ulomek).`,
        answer: frAns(n, den),
        hint: "Najprej izračunaj $\\cos\\alpha$ in $\\sin\\beta$ (predznak glede na kvadrant), nato uporabi adicijski izrek.",
        data: { given: [`\\sin\\alpha = ${ft(...sa)}`, `\\cos\\beta = ${ft(...cb)}`], find: [`\\${fn}(\\alpha ${op} \\beta)`] },
        formula: ["\\sin^2 x + \\cos^2 x = 1", `\\${fn}(\\alpha ${op} \\beta) = ${exp}`],
        solution: `$\\cos\\alpha = ${ft(...ca)}$ (${qa}. kvadrant), $\\sin\\beta = ${ft(...sb)}$ (${qb}. kvadrant)\n$\\${fn}(\\alpha ${op} \\beta) = ${fill}$\n$\\${fn}(\\alpha ${op} \\beta) = ${ft(n, den)}$`,
      };
    },
  },
  {
    id: P + "adicijski-preoblikovanje",
    topics: [T(3, "adicijski-izreki")],
    gen(level, r) {
      if (level === 1) {
        const items = [
          ["\\dfrac{\\sin 2x}{2\\sin x}", "\\cos x", [["\\sin x", "Razpiši $\\sin 2x = 2\\sin x\\cos x$ in preveri, kaj se pokrajša."], ["1", "$\\sin 2x$ ni $2\\sin x$; razpiši ga z adicijskim izrekom."], ["\\dfrac{\\cos x}{2}", "Faktor 2 v $\\sin 2x = 2\\sin x\\cos x$ se pokrajša z 2 v imenovalcu."]], "\\sin 2x = 2\\sin x\\cos x"],
          ["\\cos^2 x - \\sin^2 x", "\\cos 2x", [["1", "$\\sin^2 x + \\cos^2 x = 1$ velja za vsoto, tu je razlika."], ["\\sin 2x", "$\\sin 2x = 2\\sin x\\cos x$ je produkt, ne razlika kvadratov."], ["-\\cos 2x", "Preveri vrstni red: $\\cos 2x = \\cos^2 x - \\sin^2 x$."]], "\\cos 2x = \\cos^2 x - \\sin^2 x"],
          ["(\\sin x + \\cos x)^2", "1 + \\sin 2x", [["1", "Si pozabil dvojni produkt pri kvadriranju dvočlenika?"], ["1 + 2\\sin 2x", "$2\\sin x\\cos x$ je že $\\sin 2x$."], ["1 + \\cos 2x", "Dvojni produkt $2\\sin x\\cos x$ je $\\sin 2x$, ne $\\cos 2x$."]], "\\sin 2x = 2\\sin x\\cos x"],
          ["1 - 2\\sin^2 x", "\\cos 2x", [["\\cos^2 x", "$1 - \\sin^2 x = \\cos^2 x$, tu pa je $2\\sin^2 x$."], ["\\sin 2x", "To je formula za kosinus dvojnega kota."], ["-\\cos 2x", "Preveri predznak: $\\cos 2x = 1 - 2\\sin^2 x$."]], "\\cos 2x = 1 - 2\\sin^2 x"],
          ["\\sin(x + \\pi)", "-\\sin x", [["\\sin x", "Prištevanje $\\pi$ prezrcali točko na enotski krožnici čez izhodišče; predznak se spremeni."], ["\\cos x", "Sinus se v kosinus spremeni pri premiku za $\\frac{\\pi}{2}$, ne za $\\pi$."], ["-\\cos x", "Pri premiku za $\\pi$ ostane funkcija enaka, spremeni se le predznak."]], "\\sin(x + y) = \\sin x\\cos y + \\cos x\\sin y"],
          ["\\cos\\left(\\frac{\\pi}{2} - x\\right)", "\\sin x", [["\\cos x", "Pri $\\frac{\\pi}{2} - x$ se kosinus spremeni v sinus (komplementarna kota)."], ["-\\sin x", "Razpiši z adicijskim izrekom: $\\cos\\frac{\\pi}{2} = 0$, $\\sin\\frac{\\pi}{2} = 1$."], ["-\\cos x", "Razpiši z adicijskim izrekom za kosinus razlike."]], "\\cos(x - y) = \\cos x\\cos y + \\sin x\\sin y"],
          ["\\dfrac{2\\tan x}{1 - \\tan^2 x}", "\\tan 2x", [["2\\tan x", "Imenovalca ne moreš kar izpustiti."], ["\\sin 2x", "To je formula za tangens dvojnega kota."], ["\\tan^2 x", "Ulomka ne smeš krajšati po členih."]], "\\tan 2x = \\dfrac{2\\tan x}{1 - \\tan^2 x}"],
          ["\\sin x\\cos x", "\\frac{1}{2}\\sin 2x", [["\\sin 2x", "$\\sin 2x = 2\\sin x\\cos x$, torej manjka faktor $\\frac{1}{2}$."], ["2\\sin 2x", "Faktor 2 je na napačni strani: $\\sin x\\cos x = \\frac{1}{2}\\sin 2x$."], ["\\frac{1}{2}\\cos 2x", "Produkt sinusa in kosinusa je povezan s sinusom dvojnega kota."]], "\\sin 2x = 2\\sin x\\cos x"],
          ["\\cos^4 x - \\sin^4 x", "\\cos 2x", [["1", "Razstavi kot razliko kvadratov: $(\\cos^2 x - \\sin^2 x)(\\cos^2 x + \\sin^2 x)$."], ["\\cos^2 2x", "Drugi faktor razcepa je $\\cos^2 x + \\sin^2 x = 1$."], ["\\cos 4x", "Potenca 4 ne pomeni kota $4x$."]], "\\cos 2x = \\cos^2 x - \\sin^2 x"],
          ["\\sin(x + y) + \\sin(x - y)", "2\\sin x\\cos y", [["2\\sin x", "Razpiši oba sinusa z adicijskim izrekom; $\\sin(x + y) \\ne \\sin x + \\sin y$."], ["2\\cos x\\sin y", "Pri seštevanju se člena $\\cos x\\sin y$ odštejeta."], ["\\sin 2x", "Seštevaš sinusa, ne argumentov."]], "\\sin(x \\pm y) = \\sin x\\cos y \\pm \\cos x\\sin y"],
        ];
        const [e, right, wrongs, f] = r.pick(items);
        return {
          text: `Poenostavi izraz $${e}$.`,
          answer: pickAns(r, right, wrongs),
          options_tex: true,
          hint: "Prepoznaj, kateri adicijski izrek ali formula za dvojni kot se skriva v izrazu.",
          data: false,
          formula: f,
          solution: `Uporabimo $${f}$.\n$${e} = ${right}$`,
        };
      }
      if (level === 2) {
        const form = r.int(0, 3); // 0: sin(a+b) 1: sin(a-b) 2: cos(a+b) 3: cos(a-b)
        const isSin = form < 2;
        const plus = form % 2 === 0;
        const vals = isSin ? { 30: [1, 2], 90: [1, 1], 150: [1, 2], 210: [-1, 2], 270: [-1, 1], 330: [-1, 2] } : { 60: [1, 2], 120: [-1, 2], 180: [-1, 1], 240: [-1, 2], 300: [1, 2], 90: [0, 1] };
        const Tt = Number(r.pick(Object.keys(vals)));
        let a, b;
        for (let i = 0; i < 50; i++) {
          b = r.int(7, 80);
          a = plus ? Tt - b : Tt + b;
          if (b % 15 && a > 0 && a < 360 && a % 15 && a !== b) break;
          a = null;
        }
        if (a == null) return null;
        const exp = isSin
          ? `\\sin ${a}^\\circ\\cos ${b}^\\circ ${plus ? "+" : "-"} \\cos ${a}^\\circ\\sin ${b}^\\circ`
          : `\\cos ${a}^\\circ\\cos ${b}^\\circ ${plus ? "-" : "+"} \\sin ${a}^\\circ\\sin ${b}^\\circ`;
        const fnm = isSin ? "sin" : "cos";
        const v = vals[Tt];
        const who = name(r);
        return {
          zeroOk: true,
          text: r.pick([
            `Brez računala izračunaj natančno vrednost izraza $${exp}$.`,
            `${who} trdi, da lahko izraz $${exp}$ izračuna na pamet. Koliko je vreden?`,
          ]),
          answer: frAns(...v),
          hint: `Primerjaj izraz z desno stranjo adicijskega izreka za ${isSin ? "sinus" : "kosinus"} ${plus ? "vsote" : "razlike"}.`,
          data: { given: [`\\alpha = ${a}^\\circ`, `\\beta = ${b}^\\circ`], find: ["\\text{vrednost izraza}"] },
          formula: isSin ? `\\sin(\\alpha ${plus ? "+" : "-"} \\beta) = \\sin\\alpha\\cos\\beta ${plus ? "+" : "-"} \\cos\\alpha\\sin\\beta` : `\\cos(\\alpha ${plus ? "+" : "-"} \\beta) = \\cos\\alpha\\cos\\beta ${plus ? "-" : "+"} \\sin\\alpha\\sin\\beta`,
          solution: `Izraz je desna stran adicijskega izreka: $${exp} = \\${fnm}(${a}^\\circ ${plus ? "+" : "-"} ${b}^\\circ)$.\n$\\${fnm} ${Tt}^\\circ = ${ft(...v)}$`,
        };
      }
      const t = r.int(0, 3);
      if (t <= 1) {
        const [p, q] = r.pick([[1, 2], [2, 3], [3, 4], [4, 3], [5, 4], [6, 5], [7, 5], [1, 3], [5, 6], [4, 5], [7, 6], [3, 5]]);
        const plus = t === 0;
        const res = plus ? [p * p - q * q, q * q] : [q * q - p * p, q * q];
        return {
          text: `Za kot $x$ velja $\\sin x ${plus ? "+" : "-"} \\cos x = ${ft(p, q)}$. Izračunaj $\\sin 2x$ (ulomek).`,
          answer: frAns(...res),
          hint: "Kvadriraj obe strani enakosti in uporabi $\\sin^2 x + \\cos^2 x = 1$.",
          data: { given: [`\\sin x ${plus ? "+" : "-"} \\cos x = ${ft(p, q)}`], find: ["\\sin 2x"] },
          formula: ["\\sin^2 x + \\cos^2 x = 1", "\\sin 2x = 2\\sin x\\cos x"],
          solution: `$(\\sin x ${plus ? "+" : "-"} \\cos x)^2 = \\sin^2 x + \\cos^2 x ${plus ? "+" : "-"} 2\\sin x\\cos x = 1 ${plus ? "+" : "-"} \\sin 2x$\n$1 ${plus ? "+" : "-"} \\sin 2x = \\left(${ft(p, q)}\\right)^2 = ${ft(p * p, q * q)}$\n$\\sin 2x = ${ft(...res)}$`,
        };
      }
      const [n, d] = r.pick([[1, 2], [2, 3], [3, 4], [1, 3], [-2, 3], [3, 2], [-1, 4], [5, 2], [2, 5], [-3, 5], [4, 3], [-1, 2]]);
      const askSin = t === 2;
      const res = askSin ? [2 * n * d, d * d + n * n] : [d * d - n * n, d * d + n * n];
      return {
        text: `Za kot $x$ velja $\\tan x = ${ft(n, d)}$. Izračunaj $\\${askSin ? "sin" : "cos"} 2x$ (ulomek), ne da bi računal kot $x$.`,
        answer: frAns(...res),
        hint: `Zapiši $\\${askSin ? "sin 2x = \\dfrac{2\\sin x\\cos x}{\\sin^2 x + \\cos^2 x}" : "cos 2x = \\dfrac{\\cos^2 x - \\sin^2 x}{\\sin^2 x + \\cos^2 x}"}$ in deli števec in imenovalec s $\\cos^2 x$.`,
        data: { given: [`\\tan x = ${ft(n, d)}`], find: [`\\${askSin ? "sin" : "cos"} 2x`] },
        formula: askSin ? "\\sin 2x = \\dfrac{2\\tan x}{1 + \\tan^2 x}" : "\\cos 2x = \\dfrac{1 - \\tan^2 x}{1 + \\tan^2 x}",
        solution: `Števec in imenovalec delimo s $\\cos^2 x$: $\\${askSin ? "sin 2x = \\dfrac{2\\tan x}{1 + \\tan^2 x}" : "cos 2x = \\dfrac{1 - \\tan^2 x}{1 + \\tan^2 x}"}$\n$\\tan^2 x = ${ft(n * n, d * d)}$\n$\\${askSin ? "sin" : "cos"} 2x = \\dfrac{${askSin ? ft(2 * n, d) : ft(d * d - n * n, d * d)}}{${ft(d * d + n * n, d * d)}} = ${ft(...res)}$`,
      };
    },
  },
  {
    id: P + "trigonometrijske-enacbe",
    topics: [T(3, "trigonometrijske-enacbe")],
    gen(level, r) {
      const F = { sin: (x) => Math.sin(x * DEG), cos: (x) => Math.cos(x * DEG), tan: (x) => Math.tan(x * DEG) };
      const VALS = {
        sin: [[0.5, "\\frac{1}{2}"], [-0.5, "-\\frac{1}{2}"], [Math.SQRT1_2, "\\frac{\\sqrt{2}}{2}"], [-Math.SQRT1_2, "-\\frac{\\sqrt{2}}{2}"], [Math.sqrt(3) / 2, "\\frac{\\sqrt{3}}{2}"], [-Math.sqrt(3) / 2, "-\\frac{\\sqrt{3}}{2}"]],
        tan: [[1, "1"], [-1, "-1"], [Math.sqrt(3), "\\sqrt{3}"], [-Math.sqrt(3), "-\\sqrt{3}"], [Math.sqrt(3) / 3, "\\frac{\\sqrt{3}}{3}"], [-Math.sqrt(3) / 3, "-\\frac{\\sqrt{3}}{3}"]],
      };
      VALS.cos = VALS.sin;
      // rešitve enačbe fn(k·x + s) = v na [0°, 360°)
      const solve = (fn, v, k = 1, s = 0) => {
        const out = [];
        for (let th = -720; th <= 1500; th += 15) {
          if (Math.abs(F[fn](th) - v) > 1e-9) continue;
          const x = (th - s) / k;
          if (x >= -1e-9 && x < 360 - 1e-9 && !out.some((y) => Math.abs(y - x) < 1e-9)) out.push(Math.round(x * 1000) / 1000);
        }
        return out.sort((p, q) => p - q);
      };
      const D = "[0^\\circ, 360^\\circ)";
      const RULE = { sin: "x_2 = 180^\\circ - x_1", cos: "x_2 = 360^\\circ - x_1", tan: "x_2 = x_1 + 180^\\circ" };
      if (level === 1) {
        const fn = r.pick(["sin", "cos", "tan"]);
        const [v, vt] = r.pick(VALS[fn]);
        const sol = solve(fn, v);
        const big = r.next() < 0.5;
        const ans = big ? sol[sol.length - 1] : sol[0];
        const ref = Math.round(Math.abs(fn === "tan" ? Math.atan(v) : fn === "sin" ? Math.asin(v) : Math.acos(Math.abs(v))) / DEG);
        const wrong = [ref, 180 - ref, 180 + ref, 360 - ref].filter((x) => !sol.includes(x));
        const eq = `\\${fn} x = ${vt}`;
        return {
          text: `Reši enačbo $${eq}$ na intervalu $${D}$. Vpiši ${big ? "večjo" : "manjšo"} rešitev v stopinjah.`,
          answer: num(ans, null, wrong.slice(0, 2).map((w) => ({ value: w, why: `Preveri predznak: v katerih kvadrantih je ${FN_NAME[fn]} ${v > 0 ? "pozitiven" : "negativen"}?` }))),
          hint: `Najprej poišči ostri kot, za katerega je $|\\${fn} x| = ${vt.replace("-", "")}$, nato ga prenesi v kvadrante s pravim predznakom.`,
          data: { given: [eq], find: ["x"] },
          formula: RULE[fn],
          solution: `Referenčni kot je $${ref}^\\circ$.\n${FN_NAME[fn][0].toUpperCase() + FN_NAME[fn].slice(1)} je ${v > 0 ? "pozitiven" : "negativen"}, zato sta rešitvi na $${D}$: $x_1 = ${sol[0]}^\\circ$, $x_2 = ${sol[1]}^\\circ$.\n${big ? "Večja" : "Manjša"} rešitev je $${ans}^\\circ$.`,
        };
      }
      if (level === 2) {
        if (r.next() < 0.35) {
          // splošna rešitev (izbira)
          const fn = r.pick(["sin", "cos", "tan"]);
          const [v, vt] = r.pick(VALS[fn]);
          const R = (deg) => radTex(Math.round(deg), 180).replace(/^0\\pi$/, "0");
          let right, wrongs;
          if (fn === "sin") {
            const [x1, x2] = solve("sin", v);
            right = `x_1 = ${R(x1)} + 2k\\pi,\\ x_2 = ${R(x2)} + 2k\\pi`;
            wrongs = [
              [`x = ${R(x1)} + 2k\\pi`, "Sinus ima v eni periodi dve rešitvi; ena družina rešitev manjka."],
              [`x_1 = ${R(x1)} + k\\pi,\\ x_2 = ${R(x2)} + k\\pi`, "Perioda sinusa je $2\\pi$, ne $\\pi$."],
              [`x = \\pm ${R(x1)} + 2k\\pi`, "Zapis $\\pm x_1$ velja za kosinus (simetrija čez os $x$), pri sinusu je druga rešitev $\\pi - x_1$."],
            ];
          } else if (fn === "cos") {
            const a = Math.round(Math.acos(v) / DEG);
            right = `x = \\pm ${R(a)} + 2k\\pi`;
            wrongs = [
              [`x = ${R(a)} + 2k\\pi`, "Kosinus ima v eni periodi dve rešitvi: $x$ in $-x$."],
              [`x = \\pm ${R(a)} + k\\pi`, "Perioda kosinusa je $2\\pi$, ne $\\pi$."],
              [`x_1 = ${R(a)} + 2k\\pi,\\ x_2 = ${R(180 - a)} + 2k\\pi`, "Rešitvi $x$ in $\\pi - x$ veljata za sinus; kosinus je soda funkcija."],
            ];
          } else {
            const a = Math.round(Math.atan(v) / DEG);
            right = `x = ${R(a)} + k\\pi`;
            wrongs = [
              [`x = ${R(a)} + 2k\\pi`, "Perioda tangensa je $\\pi$, zato bi tako izgubil polovico rešitev."],
              [`x = \\pm ${R(a)} + k\\pi`, "Tangens je lih in ni soda funkcija; $-x$ ni rešitev."],
              [`x = ${R(-a)} + k\\pi`, "Preveri predznak: v katerih kvadrantih je tangens tega predznaka?"],
            ];
          }
          return {
            text: `Katera je splošna rešitev enačbe $\\${fn} x = ${vt}$ ($k \\in \\mathbb{Z}$)?`,
            answer: pickAns(r, right, wrongs),
            options_tex: true,
            hint: `Poišči rešitve v eni periodi, nato prištej večkratnike periode funkcije $\\${fn}$.`,
            data: false,
            formula: fn === "tan" ? "x = x_0 + k\\pi" : fn === "cos" ? "x = \\pm x_0 + 2k\\pi" : "x_1 = x_0 + 2k\\pi,\\ x_2 = \\pi - x_0 + 2k\\pi",
            solution: `Rešitve v eni periodi: ${solve(fn, v).filter((x) => fn !== "tan" || x < 180).map((x) => `$${R(x)}$`).join(", ")}.\nSplošna rešitev: $${right}$`,
          };
        }
        const fn = r.pick(["sin", "cos", "tan"]);
        const [v, vt] = r.pick(VALS[fn]);
        const k = r.pick([2, 3, 2]);
        const s = r.pick([0, 0, 30, -30, 60, -60]);
        const sol = solve(fn, v, k, s);
        const arg = `${k}x${s ? ` ${s < 0 ? "-" : "+"} ${Math.abs(s)}^\\circ` : ""}`;
        const eq = `\\${fn}(${arg}) = ${vt}`;
        const base = solve(fn, v);
        const askCount = r.next() < 0.5;
        const ans = askCount ? sol.length : sol[sol.length - 1];
        const mist = askCount
          ? [{ value: base.length, why: `Si upošteval, da ima $\\${fn}(${k}x)$ ${k}-krat krajšo periodo, torej več rešitev na istem intervalu?` }]
          : [{ value: Math.max(...base.map((th) => (th - s) / k).filter((x) => x >= 0 && x < 360)), why: "Si rešitvam prištel večkratnike periode, preden si delil s koeficientom pred $x$?" }];
        return {
          text: askCount ? `Koliko rešitev ima enačba $${eq}$ na intervalu $${D}$?` : `Reši enačbo $${eq}$ na intervalu $${D}$. Vpiši največjo rešitev v stopinjah.`,
          answer: num(ans, null, mist),
          hint: `Uvedi novo spremenljivko $t = ${arg}$. Zapiši vse rešitve za $t$ s periodo, nato izrazi $x$.`,
          data: { given: [eq], find: [askCount ? "\\text{število rešitev}" : "x_{\\max}"] },
          formula: [fn === "tan" ? "t = t_0 + k \\cdot 180^\\circ" : `${RULE[fn].replace(/x/g, "t")},\\ \\text{perioda } 360^\\circ`],
          solution: `Rešitve za $t = ${arg}$: $t = ${base.join("^\\circ, ")}^\\circ$ (+ večkratniki $${fn === "tan" ? 180 : 360}^\\circ$).\n$x = \\dfrac{t ${s ? (s < 0 ? `+ ${-s}` : `- ${s}`) + "^\\circ" : ""}}{${k}}$; na $${D}$ dobimo: $${sol.map((x) => tx(x)).join("^\\circ, ")}^\\circ$.\n${askCount ? `Rešitev je ${sol.length}.` : `Največja rešitev je $${tx(ans)}^\\circ$.`}`,
        };
      }
      // raven 3: kvadratna enačba v sin ali cos
      const ROOTS = [[1, 1], [-1, 1], [0, 1], [1, 2], [-1, 2], [2, 1], [-2, 1], [3, 2], [-3, 2]];
      let r1, r2;
      do {
        r1 = r.pick(ROOTS);
        r2 = r.pick(ROOTS);
      } while (r1 === r2 || (Math.abs(r1[0] / r1[1]) > 1 && Math.abs(r2[0] / r2[1]) > 1));
      const fn = r.pick(["sin", "cos"]);
      const other = fn === "sin" ? "cos" : "sin";
      const A = r1[1] * r2[1];
      const B = -(r1[0] * r2[1] + r2[0] * r1[1]);
      const Cc = r1[0] * r2[0];
      const solsFor = (rt) => {
        const v = rt[0] / rt[1];
        if (Math.abs(v) > 1) return [];
        const out = [];
        for (let th = 0; th < 360; th += 30) if (Math.abs(F[fn](th) - v) < 1e-9) out.push(th);
        return out;
      };
      const s1 = solsFor(r1);
      const s2 = solsFor(r2);
      const all = [...s1, ...s2].sort((p, q) => p - q);
      const transfer = r.next() < 0.4;
      const term = (c, t, first) => (c === 0 ? "" : `${first ? (c < 0 ? "-" : "") : c < 0 ? " - " : " + "}${Math.abs(c) === 1 ? "" : Math.abs(c)}${t}`);
      let eq;
      if (transfer) {
        // A·f² + B·f + C = 0, f² = 1 − g²  →  A·g² − B·f − (A + C) = 0
        eq = `${term(A, `\\${other}^2 x`, true)}${term(-B, `\\${fn} x`, false)}${-(A + Cc) ? ` ${-(A + Cc) < 0 ? "-" : "+"} ${Math.abs(A + Cc)}` : ""} = 0`;
      } else {
        eq = `${term(A, `\\${fn}^2 x`, true)}${term(B, `\\${fn} x`, false)}${Cc ? ` ${Cc < 0 ? "-" : "+"} ${Math.abs(Cc)}` : ""} = 0`;
      }
      const askCount = r.next() < 0.5;
      const sum = all.reduce((p, q) => p + q, 0);
      const ans = askCount ? all.length : sum;
      const mist = [];
      if (askCount) mist.push({ value: 2 * [r1, r2].filter((x) => Math.abs(x[0] / x[1]) <= 1).length, why: "Pri vrednostih $\\pm 1$ ima enačba na intervalu le eno rešitev, ne dveh." }, { value: 4, why: "Rešitev, ki je po absolutni vrednosti večja od 1, ne da nobenega kota." });
      else if (s1.length && s2.length) mist.push({ value: s1.reduce((p, q) => p + q, 0), why: "Si upošteval obe rešitvi kvadratne enačbe?" }, { value: s2.reduce((p, q) => p + q, 0), why: "Si upošteval obe rešitvi kvadratne enačbe?" });
      const tv = (rt) => ft(rt[0], rt[1]);
      return {
        text: askCount ? `Koliko rešitev ima enačba $${eq}$ na intervalu $${D}$?` : `Reši enačbo $${eq}$ na intervalu $${D}$. Vpiši vsoto vseh rešitev v stopinjah.`,
        answer: num(ans, null, mist),
        hint: transfer ? `Najprej $\\${other}^2 x$ izrazi s $\\${fn} x$, nato uvedi $t = \\${fn} x$ in reši kvadratno enačbo.` : `Uvedi $t = \\${fn} x$ in reši kvadratno enačbo. Preveri, ali je $|t| \\le 1$.`,
        data: { given: [eq], find: [askCount ? "\\text{število rešitev}" : "\\text{vsota rešitev}"] },
        formula: ["\\sin^2 x + \\cos^2 x = 1", "t_{1,2} = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"],
        solution: `${transfer ? `$\\${other}^2 x = 1 - \\${fn}^2 x$ $\\Rightarrow$ $${term(A, `\\${fn}^2 x`, true)}${term(B, `\\${fn} x`, false)}${Cc ? ` ${Cc < 0 ? "-" : "+"} ${Math.abs(Cc)}` : ""} = 0$\n` : ""}Z $t = \\${fn} x$: $t_1 = ${tv(r1)}$, $t_2 = ${tv(r2)}$.\n$\\${fn} x = ${tv(r1)}$: ${s1.length ? `$x = ${s1.join("^\\circ, ")}^\\circ$` : "ni rešitve, ker je $|t| > 1$"}\n$\\${fn} x = ${tv(r2)}$: ${s2.length ? `$x = ${s2.join("^\\circ, ")}^\\circ$` : "ni rešitve, ker je $|t| > 1$"}\n${askCount ? `Skupaj ${all.length} ${all.length === 1 ? "rešitev" : all.length === 2 ? "rešitvi" : all.length < 5 ? "rešitve" : "rešitev"}.` : `Vsota: $${all.join(" + ")} = ${sum}$`}`,
      };
    },
  },
  {
    id: P + "sinusni-in-kosinusni-izrek",
    topics: [T(3, "sinusni-in-kosinusni-izrek")],
    gen(level, r) {
      const S = (x) => Math.sin(x * DEG);
      const Co = (x) => Math.cos(x * DEG);
      if (level === 1) {
        if (r.next() < 0.5) {
          const a = r.dec(3, 15, 1);
          let al, be;
          do {
            al = r.int(25, 110);
            be = r.int(20, 100);
          } while (al + be > 165 || al === be);
          const b = (a * S(be)) / S(al);
          return {
            text: `V trikotniku $ABC$ je $a = ${tx(a)}\\ \\mathrm{cm}$, $\\alpha = ${al}^\\circ$ in $\\beta = ${be}^\\circ$. Izračunaj stranico $b$. Zaokroži na dve decimalki.`,
            answer: num(b, 2, [
              { value: (a * S(al)) / S(be), why: "Si zamenjal kota? Stranica $b$ leži nasproti kota $\\beta$." },
              { value: (a * Math.sin(be)) / Math.sin(al), why: "Je računalo nastavljeno na radiane? Kote vnesi v stopinjah (DEG)." },
            ], "cm"),
            hint: "Stranica $b$ leži nasproti kota $\\beta$, stranica $a$ nasproti $\\alpha$. Uporabi sinusni izrek.",
            data: { given: [`a = ${tx(a)}\\ \\mathrm{cm}`, `\\alpha = ${al}^\\circ`, `\\beta = ${be}^\\circ`], find: ["b"] },
            formula: "\\dfrac{a}{\\sin\\alpha} = \\dfrac{b}{\\sin\\beta}",
            solution: `$b = \\dfrac{a \\sin\\beta}{\\sin\\alpha} = \\dfrac{${tx(a)} \\cdot \\sin ${be}^\\circ}{\\sin ${al}^\\circ}$\n$b \\approx ${tx(b, 2)}\\ \\mathrm{cm}$`,
          };
        }
        const b = r.dec(3, 12, 1);
        const c = r.dec(3, 12, 1);
        const al = r.pick([35, 40, 50, 55, 65, 70, 75, 80, 100, 110, 115, 125, 130]);
        const a2 = b * b + c * c - 2 * b * c * Co(al);
        const a = Math.sqrt(a2);
        return {
          text: `V trikotniku $ABC$ merita stranici $b = ${tx(b)}\\ \\mathrm{cm}$ in $c = ${tx(c)}\\ \\mathrm{cm}$, kot med njima pa $\\alpha = ${al}^\\circ$. Izračunaj stranico $a$. Zaokroži na dve decimalki.`,
          answer: num(a, 2, [
            { value: Math.sqrt(b * b + c * c), why: "Si pozabil člen $-2bc\\cos\\alpha$? Kot ni pravi." },
            { value: a2, why: "Si na koncu pozabil koreniti?" },
            { value: Math.sqrt(Math.abs(b * b + c * c - 2 * b * c * Math.cos(al))), why: "Je računalo nastavljeno na radiane? Kote vnesi v stopinjah (DEG)." },
          ], "cm"),
          hint: "Znani sta dve stranici in kot med njima: uporabi kosinusni izrek.",
          data: { given: [`b = ${tx(b)}\\ \\mathrm{cm}`, `c = ${tx(c)}\\ \\mathrm{cm}`, `\\alpha = ${al}^\\circ`], find: ["a"] },
          formula: "a^2 = b^2 + c^2 - 2bc\\cos\\alpha",
          solution: `$a^2 = ${tx(b)}^2 + ${tx(c)}^2 - 2 \\cdot ${tx(b)} \\cdot ${tx(c)} \\cdot \\cos ${al}^\\circ \\approx ${tx(a2, 3)}\\ \\mathrm{cm^2}$\n$a = \\sqrt{${tx(a2, 3)}}\\ \\mathrm{cm} \\approx ${tx(a, 2)}\\ \\mathrm{cm}$`,
        };
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const n1 = name(r);
          let n2 = name(r);
          while (n2 === n1) n2 = name(r);
          const v1 = r.pick([3, 3.5, 4, 4.5, 5, 6, 12, 15]);
          const v2 = r.pick([3, 4, 5, 5.5, 6, 10, 14, 16]);
          const t = r.pick([1.5, 2, 2.5, 3, 0.5]);
          const phi = r.pick([35, 48, 55, 62, 75, 105, 120, 130, 140]);
          const s1 = v1 * t;
          const s2 = v2 * t;
          const d = Math.sqrt(s1 * s1 + s2 * s2 - 2 * s1 * s2 * Co(phi));
          return {
            text: `${n1} in ${n2} hkrati odideta z istega razpotja po ravnih poteh, ki oklepata kot $${phi}^\\circ$. ${n1} se giblje s hitrostjo $${tx(v1)}\\ \\mathrm{km/h}$, ${n2} pa s $${tx(v2)}\\ \\mathrm{km/h}$. Kako daleč narazen sta po $${tx(t)}\\ \\mathrm{h}$? Zaokroži na dve decimalki.`,
            answer: num(d, 2, [
              { value: Math.sqrt(s1 * s1 + s2 * s2), why: "Poti nista pravokotni; pri kosinusnem izreku manjka člen $-2s_1s_2\\cos\\varphi$." },
              { value: Math.sqrt(v1 * v1 + v2 * v2 - 2 * v1 * v2 * Co(phi)), why: "Si najprej izračunal prevoženi razdalji $s = v \\cdot t$?" },
            ], "km"),
            hint: "Najprej izračunaj, koliko je prehodil vsak, nato uporabi kosinusni izrek v trikotniku z vrhom na razpotju.",
            data: { given: [`v_1 = ${tx(v1)}\\ \\mathrm{km/h}`, `v_2 = ${tx(v2)}\\ \\mathrm{km/h}`, `t = ${tx(t)}\\ \\mathrm{h}`, `\\varphi = ${phi}^\\circ`], find: ["d"] },
            formula: ["s = v \\cdot t", "d^2 = s_1^2 + s_2^2 - 2s_1s_2\\cos\\varphi"],
            solution: `$s_1 = ${tx(v1)} \\cdot ${tx(t)} = ${tx(s1)}\\ \\mathrm{km}$, $s_2 = ${tx(v2)} \\cdot ${tx(t)} = ${tx(s2)}\\ \\mathrm{km}$\n$d^2 = ${tx(s1)}^2 + ${tx(s2)}^2 - 2 \\cdot ${tx(s1)} \\cdot ${tx(s2)} \\cdot \\cos ${phi}^\\circ \\approx ${tx(d * d, 3)}\\ \\mathrm{km^2}$\n$d \\approx ${tx(d, 2)}\\ \\mathrm{km}$`,
          };
        }
        const dd = r.int(40, 250);
        let al, be;
        do {
          al = r.int(35, 85);
          be = r.int(35, 85);
        } while (al === be);
        const ga = 180 - al - be;
        const AT = (dd * S(be)) / S(ga);
        const obj = r.pick(["drevo", "skalo", "svetilnik", "cerkev", "bojo"]);
        return {
          text: `Točki $A$ in $B$ na bregu jezera sta $${dd}\\ \\mathrm{m}$ narazen. ${obj[0].toUpperCase() + obj.slice(1)} $T$ na drugem bregu vidimo pod kotoma $\\angle TAB = ${al}^\\circ$ in $\\angle ABT = ${be}^\\circ$. Kolikšna je razdalja $|AT|$? Zaokroži na eno decimalko.`,
          answer: num(AT, 1, [
            { value: (dd * S(al)) / S(ga), why: "Stranica $AT$ leži nasproti kota pri $B$, ne pri $A$." },
            { value: (dd * S(be)) / S(al), why: "Nasproti znane stranice $AB$ leži kot pri $T$; najprej ga izračunaj." },
          ], "m"),
          hint: "Najprej izračunaj kot pri $T$ (vsota kotov v trikotniku), nato uporabi sinusni izrek.",
          data: { given: [`|AB| = ${dd}\\ \\mathrm{m}`, `\\alpha = ${al}^\\circ`, `\\beta = ${be}^\\circ`], find: ["|AT|"] },
          formula: ["\\gamma = 180^\\circ - \\alpha - \\beta", "\\dfrac{|AT|}{\\sin\\beta} = \\dfrac{|AB|}{\\sin\\gamma}"],
          solution: `$\\gamma = 180^\\circ - ${al}^\\circ - ${be}^\\circ = ${ga}^\\circ$\n$|AT| = \\dfrac{|AB| \\sin\\beta}{\\sin\\gamma} = \\dfrac{${dd} \\cdot \\sin ${be}^\\circ}{\\sin ${ga}^\\circ}$\n$|AT| \\approx ${tx(AT, 1)}\\ \\mathrm{m}$`,
        };
      }
      const t = r.int(0, 2);
      if (t === 0) {
        let a, b, c;
        do {
          a = r.int(4, 15);
          b = r.int(4, 15);
          c = r.int(4, 18);
        } while (a + b <= c || a + c <= b || b + c <= a || a === b || b === c || a === c);
        const big = Math.max(a, b, c);
        const [p, q] = [a, b, c].filter((x) => x !== big);
        const cosG = (p * p + q * q - big * big) / (2 * p * q);
        const G = Math.acos(cosG) / DEG;
        const small = Math.min(a, b, c);
        const [u, w] = [a, b, c].filter((x) => x !== small);
        const Gs = Math.acos((u * u + w * w - small * small) / (2 * u * w)) / DEG;
        const ctx = r.pick(["Trikotna gredica ima stranice", "Stranice trikotnega jadra merijo", "Trikotnik ima stranice", "Trikotno zemljišče ima stranice"]);
        const unit = ctx.includes("gredica") || ctx.includes("jadra") ? "m" : ctx.includes("zemljišče") ? "dam" : "cm";
        return {
          text: `${ctx} $${a}\\ \\mathrm{${unit}}$, $${b}\\ \\mathrm{${unit}}$ in $${c}\\ \\mathrm{${unit}}$. Kolikšen je največji notranji kot? Rezultat v stopinjah zaokroži na eno decimalko.`,
          answer: num(G, 1, [
            { value: Gs, why: "Največji kot leži nasproti najdaljše stranice." },
            { value: Math.acos(cosG), why: "To je kot v radianih; zapiši ga v stopinjah." },
            { value: 180 - G, why: "Preveri predznak v kosinusnem izreku: $\\cos\\gamma = \\frac{a^2 + b^2 - c^2}{2ab}$." },
          ]),
          hint: "Največji kot leži nasproti najdaljše stranice. Iz kosinusnega izreka izrazi njegov kosinus.",
          data: { given: [`a = ${a}\\ \\mathrm{${unit}}`, `b = ${b}\\ \\mathrm{${unit}}`, `c = ${c}\\ \\mathrm{${unit}}`], find: ["\\text{največji kot}"] },
          formula: "\\cos\\gamma = \\dfrac{a^2 + b^2 - c^2}{2ab}",
          solution: `Najdaljša stranica je $${big}\\ \\mathrm{${unit}}$, nasproti nje leži največji kot $\\varphi$.\n$\\cos\\varphi = \\dfrac{${p}^2 + ${q}^2 - ${big}^2}{2 \\cdot ${p} \\cdot ${q}} = ${ft(p * p + q * q - big * big, 2 * p * q)} \\approx ${tx(cosG, 4)}$\n$\\varphi \\approx ${tx(G, 1)}^\\circ$`,
        };
      }
      if (t === 1) {
        const al = r.int(15, 35);
        const be = al + r.int(10, 30);
        const dd = r.int(20, 120);
        const h = (dd * S(al) * S(be)) / S(be - al);
        const obj = r.pick(["stolpa", "zvonika", "dimnika", "smreke", "nebotičnika"]);
        const who = name(r);
        return {
          text: `${who} vidi vrh ${obj} pod višinskim kotom $${al}^\\circ$. Ko se mu po vodoravnih tleh približa za $${dd}\\ \\mathrm{m}$, ga vidi pod kotom $${be}^\\circ$. Kolikšna je višina ${obj}? Višino oči zanemari. Zaokroži na eno decimalko.`,
          answer: num(h, 1, [
            { value: dd * Math.tan(al * DEG), why: "Razdalja $d$ ni oddaljenost od vznožja; uporabi trikotnik med obema stojiščema in vrhom." },
            { value: (dd * S(al)) / S(be - al), why: "To je razdalja od drugega stojišča do vrha; višina je še pomnožena s $\\sin\\beta$." },
          ], "m"),
          hint: "V trikotniku med obema stojiščema in vrhom je kot pri vrhu enak $\\beta - \\alpha$. S sinusnim izrekom izračunaj razdaljo do vrha.",
          data: { given: [`\\alpha = ${al}^\\circ`, `\\beta = ${be}^\\circ`, `d = ${dd}\\ \\mathrm{m}`], find: ["h"] },
          formula: ["\\dfrac{x}{\\sin\\alpha} = \\dfrac{d}{\\sin(\\beta - \\alpha)}", "h = x\\sin\\beta"],
          solution: `Kot pri vrhu: $\\beta - \\alpha = ${be - al}^\\circ$.\n$x = \\dfrac{d\\sin\\alpha}{\\sin(\\beta - \\alpha)} = \\dfrac{${dd} \\cdot \\sin ${al}^\\circ}{\\sin ${be - al}^\\circ} \\approx ${tx((dd * S(al)) / S(be - al), 2)}\\ \\mathrm{m}$\n$h = x\\sin\\beta \\approx ${tx((dd * S(al)) / S(be - al), 2)} \\cdot \\sin ${be}^\\circ \\approx ${tx(h, 1)}\\ \\mathrm{m}$`,
        };
      }
      const dd = r.int(50, 300);
      let al, be;
      do {
        al = r.int(40, 80);
        be = r.int(40, 80);
      } while (al === be);
      const ga = 180 - al - be;
      const AT = (dd * S(be)) / S(ga);
      const w = AT * S(al);
      return {
        text: `Za merjenje širine reke izberemo na bregu točki $A$ in $B$, ki sta $${dd}\\ \\mathrm{m}$ narazen. Drevo $T$ na nasprotnem bregu vidimo pod kotoma $\\angle TAB = ${al}^\\circ$ in $\\angle ABT = ${be}^\\circ$. Kolikšna je širina reke (razdalja od $T$ do premice $AB$)? Zaokroži na eno decimalko.`,
        answer: num(w, 1, [
          { value: AT, why: "To je razdalja $|AT|$; širina je pravokotna razdalja do brega." },
          { value: (dd * S(be)) / S(ga) * Co(al), why: "Višino dobiš s sinusom kota pri $A$, ne s kosinusom." },
        ], "m"),
        hint: "Najprej s sinusnim izrekom izračunaj $|AT|$, nato v pravokotnem trikotniku še višino na stranico $AB$.",
        data: { given: [`|AB| = ${dd}\\ \\mathrm{m}`, `\\alpha = ${al}^\\circ`, `\\beta = ${be}^\\circ`], find: ["v"] },
        formula: ["\\gamma = 180^\\circ - \\alpha - \\beta", "|AT| = \\dfrac{|AB|\\sin\\beta}{\\sin\\gamma}", "v = |AT|\\sin\\alpha"],
        solution: `$\\gamma = 180^\\circ - ${al}^\\circ - ${be}^\\circ = ${ga}^\\circ$\n$|AT| = \\dfrac{${dd} \\cdot \\sin ${be}^\\circ}{\\sin ${ga}^\\circ} \\approx ${tx(AT, 2)}\\ \\mathrm{m}$\n$v = |AT| \\sin ${al}^\\circ \\approx ${tx(w, 1)}\\ \\mathrm{m}$`,
      };
    },
  },
  {
    id: P + "vektorji",
    topics: [T(3, "vektorji-v-ravnini-in-prostoru")],
    gen(level, r) {
      const ORD = ["prva", "druga", "tretja"];
      const cv = (m, sym, first) => `${m < 0 ? (first ? "-" : " - ") : first ? "" : " + "}${Math.abs(m) === 1 ? "" : Math.abs(m)}\\vec ${sym}`;
      const rv = (dim, lo = -6, hi = 6) => Array.from({ length: dim }, () => r.int(lo, hi));
      if (level === 1) {
        const dim = r.pick([2, 3, 3]);
        const i = r.int(0, dim - 1);
        if (r.next() < 0.65) {
          const a = rv(dim);
          const b = rv(dim);
          const m = r.pick([2, 3, -2, 4, -3]);
          const n = r.pick([-1, 2, -2, 3, -3, 1, 4]);
          if (a[i] === 0 || b[i] === 0) return null;
          const c = a.map((x, j) => m * x + n * b[j]);
          return {
            text: `Dana sta vektorja $\\vec a = ${vt(a)}$ in $\\vec b = ${vt(b)}$. Koliko je ${ORD[i]} komponenta vektorja $\\vec c = ${cv(m, "a", true)}${cv(n, "b", false)}$?`,
            answer: num(c[i], null, [
              { value: m * a[i] - n * b[i], why: "Pazi na predznak pred vektorjem $\\vec b$." },
              { value: m * a[i] + b[i], why: "Si s skalarjem pomnožil tudi vektor $\\vec b$?" },
            ]),
            hint: "Vektorje množimo s skalarjem in seštevamo po komponentah.",
            data: { given: [`\\vec a = ${vt(a)}`, `\\vec b = ${vt(b)}`], find: [`c_${i + 1}`] },
            formula: "k\\vec a + l\\vec b = (k a_1 + l b_1,\\ k a_2 + l b_2,\\ \\ldots)",
            solution: `$c_${i + 1} = ${m} \\cdot (${a[i]}) ${n < 0 ? "-" : "+"} ${Math.abs(n)} \\cdot (${b[i]})$\n$c_${i + 1} = ${c[i]}$`,
          };
        }
        const A = rv(dim);
        const v = rv(dim, -8, 8);
        if (v[i] === 0) return null;
        const B = A.map((x, j) => x + v[j]);
        return {
          text: `Vektor $\\vec{AB} = ${vt(v)}$ ima začetno točko $A${vt(A)}$. Koliko je ${ORD[i]} koordinata končne točke $B$?`,
          answer: num(B[i], null, [{ value: A[i] - v[i], why: "Velja $\\vec{AB} = B - A$, zato je $B = A + \\vec{AB}$." }, { value: v[i] - A[i], why: "Koordinate točke $B$ dobiš tako, da koordinatam $A$ prišteješ komponente vektorja." }]),
          hint: "Iz $\\vec{AB} = B - A$ izrazi $B$.",
          data: { given: [`\\vec{AB} = ${vt(v)}`, `A = ${vt(A)}`], find: [`b_${i + 1}`] },
          formula: "\\vec{AB} = B - A",
          solution: `$B = A + \\vec{AB}$\n$b_${i + 1} = ${A[i]} ${sg(v[i])} = ${B[i]}$`,
        };
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const A = rv(3, -5, 7);
          const B = rv(3, -5, 7);
          const d2 = A.reduce((s, x, j) => s + (B[j] - x) ** 2, 0);
          if (d2 === 0) return null;
          const d = Math.sqrt(d2);
          const drone = r.next() < 0.5;
          const who = name(r);
          return {
            text: drone
              ? `${who} krmili dron, ki poleti od točke $A${vt(A)}$ do točke $B${vt(B)}$ (enota je meter). Kolikšna je razdalja med točkama? Zaokroži na dve decimalki.`
              : `Izračunaj dolžino vektorja $\\vec{AB}$, če je $A${vt(A)}$ in $B${vt(B)}$. Zaokroži na dve decimalki.`,
            answer: num(d, 2, [
              { value: d2, why: "Si pozabil koreniti vsoto kvadratov?" },
              { value: Math.sqrt(A.reduce((s, x, j) => s + (B[j] + x) ** 2, 0)), why: "Komponente vektorja $\\vec{AB}$ so razlike koordinat, ne vsote." },
            ], drone ? "m" : null),
            hint: "Najprej izračunaj komponente vektorja $\\vec{AB} = B - A$, nato njegovo dolžino.",
            data: { given: [`A = ${vt(A)}`, `B = ${vt(B)}`], find: ["|\\vec{AB}|"] },
            formula: "|\\vec{AB}| = \\sqrt{(b_1 - a_1)^2 + (b_2 - a_2)^2 + (b_3 - a_3)^2}",
            solution: `$\\vec{AB} = ${vt(B.map((x, j) => x - A[j]))}$\n$|\\vec{AB}| = \\sqrt{${B.map((x, j) => `${x - A[j] < 0 ? `(${x - A[j]})` : x - A[j]}^2`).join(" + ")}} = \\sqrt{${d2}} \\approx ${tx(d, 2)}${drone ? "\\ \\mathrm{m}" : ""}$`,
          };
        }
        const dim = r.pick([2, 3]);
        const i = r.int(0, dim - 1);
        const A = rv(dim, -5, 5);
        const B = rv(dim, -5, 5);
        const Cc = rv(dim, -5, 5);
        const D = A.map((x, j) => x + Cc[j] - B[j]);
        if (A.every((x, j) => x === B[j])) return null;
        return {
          text: `Točke $A${vt(A)}$, $B${vt(B)}$ in $C${vt(Cc)}$ so zaporedna oglišča paralelograma $ABCD$. Koliko je ${ORD[i]} koordinata oglišča $D$?`,
          answer: num(D[i], null, [
            { value: B[i] + Cc[i] - A[i], why: "Pazi na vrstni red oglišč: v paralelogramu $ABCD$ velja $\\vec{AD} = \\vec{BC}$." },
            { value: A[i] + B[i] - Cc[i], why: "Oglišče $D$ leži nasproti $B$; uporabi $\\vec{AD} = \\vec{BC}$." },
          ]),
          hint: "V paralelogramu $ABCD$ velja $\\vec{AD} = \\vec{BC}$.",
          data: { given: [`A = ${vt(A)}`, `B = ${vt(B)}`, `C = ${vt(Cc)}`], find: [`d_${i + 1}`] },
          formula: ["\\vec{AD} = \\vec{BC}", "D = A + C - B"],
          solution: `$\\vec{BC} = C - B = ${vt(Cc.map((x, j) => x - B[j]))}$\n$D = A + \\vec{BC} = ${vt(D)}$\n$d_${i + 1} = ${D[i]}$`,
        };
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const a = rv(2, -4, 5);
        const b = rv(2, -4, 5);
        const det = a[0] * b[1] - a[1] * b[0];
        if (det === 0) return null;
        const m = r.nonZero(-4, 4);
        const n = r.nonZero(-4, 4);
        if (m === n) return null;
        const c = [m * a[0] + n * b[0], m * a[1] + n * b[1]];
        const askM = r.next() < 0.5;
        return {
          text: `Vektor $\\vec c = ${vt(c)}$ zapiši kot linearno kombinacijo $\\vec c = m\\vec a + n\\vec b$ vektorjev $\\vec a = ${vt(a)}$ in $\\vec b = ${vt(b)}$. Koliko je $${askM ? "m" : "n"}$?`,
          answer: num(askM ? m : n, null, [{ value: askM ? n : m, why: `To je koeficient pri $\\vec ${askM ? "b" : "a"}$.` }]),
          hint: "Zapiši enakost po komponentah: dobiš sistem dveh linearnih enačb za $m$ in $n$.",
          data: { given: [`\\vec a = ${vt(a)}`, `\\vec b = ${vt(b)}`, `\\vec c = ${vt(c)}`], find: [askM ? "m" : "n"] },
          formula: "\\vec c = m\\vec a + n\\vec b",
          solution: `$${tm(a[0], "m", true)} ${tm(b[0], "n")} = ${c[0]}$\n$${tm(a[1], "m", true)} ${tm(b[1], "n")} = ${c[1]}$\nRešimo sistem (npr. z nasprotnimi koeficienti): $m = ${m}$, $n = ${n}$.`,
        };
      }
      if (t === 1) {
        const lam = r.pick([2, 3, -2, -3, 4]);
        const a1 = r.nonZero(-4, 4);
        const k = r.nonZero(-5, 5);
        const a3 = r.nonZero(-4, 4);
        const b = [lam * a1, lam * k];
        const l = lam * a3;
        return {
          text: `Vektorja $\\vec a = (${a1}, k, ${a3})$ in $\\vec b = (${b[0]}, ${b[1]}, l)$ sta kolinearna. Izračunaj $k$ in $l$ ter vpiši vsoto $k + l$.`,
          answer: num(k + l, null, [
            { value: b[1] * lam + a3 / lam, why: "Preveri, kateri vektor je večkratnik katerega: $\\vec b = \\lambda\\vec a$." },
            { value: k, why: "Vpisati moraš vsoto $k + l$." },
          ]),
          hint: "Kolinearna vektorja: $\\vec b = \\lambda\\vec a$. Iz prvih komponent izračunaj $\\lambda$.",
          data: { given: [`\\vec a = (${a1}, k, ${a3})`, `\\vec b = (${b[0]}, ${b[1]}, l)`], find: ["k + l"] },
          formula: "\\vec b = \\lambda\\vec a",
          solution: `$\\lambda = \\dfrac{${b[0]}}{${a1}} = ${lam}$\n$${b[1]} = ${lam}k \\Rightarrow k = ${k}$, $l = ${lam} \\cdot (${a3}) = ${l}$\n$k + l = ${k + l}$`,
        };
      }
      const [m, n] = r.pick([[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2]]);
      const A = rv(3, -5, 5);
      const w = rv(3, -3, 3);
      const i = r.int(0, 2);
      if (w[i] === 0) return null;
      const B = A.map((x, j) => x + (m + n) * w[j]);
      const Tp = A.map((x, j) => x + m * w[j]);
      return {
        text: `Točka $T$ leži na daljici $AB$, kjer je $A${vt(A)}$ in $B${vt(B)}$, in jo deli v razmerju $|AT| : |TB| = ${m} : ${n}$. Koliko je ${ORD[i]} koordinata točke $T$?`,
        answer: num(Tp[i], null, [
          { value: A[i] + n * w[i], why: "Razmerje si obrnil: $T$ je bližje točki, ki ima v razmerju manjši del." },
          { value: (A[i] + B[i]) / 2, why: "To je razpolovišče; razmerje ni $1 : 1$." },
        ]),
        hint: `Velja $\\vec{AT} = \\dfrac{${m}}{${m + n}}\\vec{AB}$.`,
        data: { given: [`A = ${vt(A)}`, `B = ${vt(B)}`, `|AT| : |TB| = ${m} : ${n}`], find: [`t_${i + 1}`] },
        formula: "\\vec{r}_T = \\vec{r}_A + \\dfrac{m}{m + n}\\vec{AB}",
        solution: `$\\vec{AB} = ${vt(B.map((x, j) => x - A[j]))}$\n$\\vec{AT} = \\dfrac{${m}}{${m + n}}\\vec{AB} = ${vt(w.map((x) => m * x))}$\n$T = ${vt(Tp)}$, ${ORD[i]} koordinata je $${Tp[i]}$.`,
      };
    },
  },
  {
    id: P + "skalarni-produkt",
    topics: [T(3, "skalarni-produkt")],
    gen(level, r) {
      const rv = (dim, lo = -5, hi = 6) => Array.from({ length: dim }, () => r.int(lo, hi));
      const ang = (a, b) => Math.acos(dot(a, b) / (norm(a) * norm(b))) / DEG;
      if (level === 1) {
        if (r.next() < 0.55) {
          const a = rv(3);
          const b = rv(3);
          const d = dot(a, b);
          return {
            text: `Izračunaj skalarni produkt vektorjev $\\vec a = ${vt(a)}$ in $\\vec b = ${vt(b)}$.`,
            answer: num(d, null, [
              { value: a[0] * b[0] + a[1] * b[1], why: "Si izpustil tretjo komponento?" },
              { value: a.reduce((s, x, j) => s + Math.abs(x * b[j]), 0), why: "Pazi na predznake produktov negativnih komponent." },
            ]),
            hint: "Zmnoži istoležne komponente in produkte seštej.",
            data: { given: [`\\vec a = ${vt(a)}`, `\\vec b = ${vt(b)}`], find: ["\\vec a \\cdot \\vec b"] },
            formula: "\\vec a \\cdot \\vec b = a_1b_1 + a_2b_2 + a_3b_3",
            solution: `$\\vec a \\cdot \\vec b = ${a.map((x, j) => `${x < 0 ? `(${x})` : x} \\cdot ${b[j] < 0 ? `(${b[j]})` : b[j]}`).join(" + ")}$\n$\\vec a \\cdot \\vec b = ${d}$`,
          };
        }
        const p = r.int(2, 9);
        const q = r.int(2, 9);
        const phi = r.pick([60, 120, 180, 60, 120]);
        const cs = phi === 60 ? 0.5 : phi === 120 ? -0.5 : -1;
        const d = p * q * cs;
        return {
          text: `Vektorja $\\vec a$ in $\\vec b$ imata dolžini $|\\vec a| = ${p}$ in $|\\vec b| = ${q}$ ter oklepata kot $${phi}^\\circ$. Koliko je $\\vec a \\cdot \\vec b$?`,
          answer: num(d, null, [{ value: p * q, why: "Si pozabil pomnožiti s kosinusom kota med vektorjema?" }, { value: -d, why: `Preveri predznak $\\cos ${phi}^\\circ$.` }]),
          hint: "Skalarni produkt je produkt dolžin in kosinusa kota med vektorjema.",
          data: { given: [`|\\vec a| = ${p}`, `|\\vec b| = ${q}`, `\\varphi = ${phi}^\\circ`], find: ["\\vec a \\cdot \\vec b"] },
          formula: "\\vec a \\cdot \\vec b = |\\vec a||\\vec b|\\cos\\varphi",
          solution: `$\\vec a \\cdot \\vec b = ${p} \\cdot ${q} \\cdot \\cos ${phi}^\\circ = ${p * q} \\cdot (${tx(cs)})$\n$\\vec a \\cdot \\vec b = ${tx(d)}$`,
        };
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const a = rv(3, -4, 5);
          const b = rv(3, -4, 5);
          const d = dot(a, b);
          if (d === 0 || norm(a) === 0 || norm(b) === 0 || Math.abs(Math.abs(d) - norm(a) * norm(b)) < 1e-9) return null;
          const phi = ang(a, b);
          return {
            text: `Izračunaj kot med vektorjema $\\vec a = ${vt(a)}$ in $\\vec b = ${vt(b)}$. Rezultat v stopinjah zaokroži na eno decimalko.`,
            answer: num(phi, 1, [{ value: 180 - phi, why: "Preveri predznak skalarnega produkta." }, { value: phi * DEG, why: "To je kot v radianih; zapiši ga v stopinjah." }]),
            hint: "Kosinus kota je skalarni produkt, deljen s produktom dolžin.",
            data: { given: [`\\vec a = ${vt(a)}`, `\\vec b = ${vt(b)}`], find: ["\\varphi"] },
            formula: "\\cos\\varphi = \\dfrac{\\vec a \\cdot \\vec b}{|\\vec a||\\vec b|}",
            solution: `$\\vec a \\cdot \\vec b = ${d}$, $|\\vec a| = \\sqrt{${dot(a, a)}}$, $|\\vec b| = \\sqrt{${dot(b, b)}}$\n$\\cos\\varphi = \\dfrac{${d}}{\\sqrt{${dot(a, a)}} \\cdot \\sqrt{${dot(b, b)}}} \\approx ${tx(d / (norm(a) * norm(b)), 4)}$\n$\\varphi \\approx ${tx(phi, 1)}^\\circ$`,
          };
        }
        const A = rv(2, -4, 4);
        const B = rv(2, -4, 6);
        const Cc = rv(2, -4, 6);
        const u = [B[0] - A[0], B[1] - A[1]];
        const v = [Cc[0] - A[0], Cc[1] - A[1]];
        const d = dot(u, v);
        if (norm(u) === 0 || norm(v) === 0 || d === 0 || Math.abs(u[0] * v[1] - u[1] * v[0]) < 1e-9) return null;
        const phi = ang(u, v);
        const ctx = r.pick(["Trikotnik ima oglišča", "Na načrtu parka so tri klopi v točkah", "Zemljišče ima obliko trikotnika z oglišči"]);
        return {
          text: `${ctx} $A${vt(A)}$, $B${vt(B)}$ in $C${vt(Cc)}$. Kolikšen je kot pri oglišču $A$ (kot $\\angle BAC$)? Zaokroži na eno decimalko.`,
          answer: num(phi, 1, [{ value: 180 - phi, why: "Oba vektorja morata izhajati iz oglišča $A$: $\\vec{AB}$ in $\\vec{AC}$." }, { value: phi * DEG, why: "To je kot v radianih; zapiši ga v stopinjah." }]),
          hint: "Kot pri $A$ je kot med vektorjema $\\vec{AB}$ in $\\vec{AC}$.",
          data: { given: [`A = ${vt(A)}`, `B = ${vt(B)}`, `C = ${vt(Cc)}`], find: ["\\angle BAC"] },
          formula: "\\cos\\alpha = \\dfrac{\\vec{AB} \\cdot \\vec{AC}}{|\\vec{AB}||\\vec{AC}|}",
          solution: `$\\vec{AB} = ${vt(u)}$, $\\vec{AC} = ${vt(v)}$\n$\\cos\\alpha = \\dfrac{${d}}{\\sqrt{${dot(u, u)}} \\cdot \\sqrt{${dot(v, v)}}} \\approx ${tx(d / (norm(u) * norm(v)), 4)}$\n$\\alpha \\approx ${tx(phi, 1)}^\\circ$`,
        };
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const p = r.nonZero(-5, 5);
        const s = r.nonZero(-5, 5);
        const q = r.nonZero(-5, 5);
        const tt = r.nonZero(-5, 5);
        if (p + s === 0) return null;
        const [kn, kd] = fr(-q * tt, p + s);
        return {
          text: `Za katero vrednost parametra $k$ sta vektorja $\\vec a = (${p}, k, ${q})$ in $\\vec b = (k, ${s}, ${tt})$ pravokotna? Vpiši ulomek ali celo število.`,
          answer: frAns(kn, kd),
          hint: "Vektorja sta pravokotna natanko tedaj, ko je njun skalarni produkt enak 0.",
          data: { given: [`\\vec a = (${p}, k, ${q})`, `\\vec b = (k, ${s}, ${tt})`], find: ["k"] },
          formula: "\\vec a \\perp \\vec b \\iff \\vec a \\cdot \\vec b = 0",
          solution: `$\\vec a \\cdot \\vec b = ${p}k ${sg(s)}k ${sg(q * tt)} = ${p + s}k ${sg(q * tt)}$\n$${p + s}k ${sg(q * tt)} = 0$\n$k = ${ft(kn, kd)}$`,
        };
      }
      if (t === 1) {
        const p = r.int(2, 9);
        const q = r.int(2, 9);
        const phi = r.pick([30, 45, 60, 120, 135, 150, 75, 100]);
        const minus = r.next() < 0.4;
        const v2 = p * p + q * q + (minus ? -2 : 2) * p * q * Math.cos(phi * DEG);
        const v = Math.sqrt(v2);
        return {
          text: `Vektorja $\\vec a$ in $\\vec b$ imata dolžini $|\\vec a| = ${p}$ in $|\\vec b| = ${q}$ ter oklepata kot $${phi}^\\circ$. Izračunaj $|\\vec a ${minus ? "-" : "+"} \\vec b|$. Zaokroži na dve decimalki.`,
          answer: num(v, 2, [
            { value: minus ? Math.abs(p - q) : p + q, why: `Dolžini se ${minus ? "odštejeta" : "seštejeta"} le pri vzporednih vektorjih.` },
            { value: Math.sqrt(p * p + q * q), why: "Si pozabil člen $2\\vec a \\cdot \\vec b$?" },
            { value: Math.sqrt(p * p + q * q + (minus ? 2 : -2) * p * q * Math.cos(phi * DEG)), why: "Preveri predznak člena $2\\vec a \\cdot \\vec b$." },
          ]),
          hint: `Izračunaj $|\\vec a ${minus ? "-" : "+"} \\vec b|^2 = (\\vec a ${minus ? "-" : "+"} \\vec b) \\cdot (\\vec a ${minus ? "-" : "+"} \\vec b)$.`,
          data: { given: [`|\\vec a| = ${p}`, `|\\vec b| = ${q}`, `\\varphi = ${phi}^\\circ`], find: [`|\\vec a ${minus ? "-" : "+"} \\vec b|`] },
          formula: `|\\vec a ${minus ? "-" : "+"} \\vec b|^2 = |\\vec a|^2 ${minus ? "-" : "+"} 2|\\vec a||\\vec b|\\cos\\varphi + |\\vec b|^2`,
          solution: `$|\\vec a ${minus ? "-" : "+"} \\vec b|^2 = ${p}^2 ${minus ? "-" : "+"} 2 \\cdot ${p} \\cdot ${q} \\cdot \\cos ${phi}^\\circ + ${q}^2 \\approx ${tx(v2, 3)}$\n$|\\vec a ${minus ? "-" : "+"} \\vec b| \\approx ${tx(v, 2)}$`,
        };
      }
      const a = rv(3, -4, 5);
      const b = rv(3, -4, 6);
      const d = dot(a, b);
      if (d === 0 || norm(a) === 0) return null;
      const pr = Math.abs(d) / norm(a);
      return {
        text: `Izračunaj dolžino pravokotne projekcije vektorja $\\vec b = ${vt(b)}$ na vektor $\\vec a = ${vt(a)}$. Zaokroži na dve decimalki.`,
        answer: num(pr, 2, [
          { value: Math.abs(d) / norm(b), why: "Deliš z dolžino vektorja, na katerega projiciraš ($\\vec a$)." },
          { value: Math.abs(d) / dot(a, a), why: "Za dolžino projekcije deliš z $|\\vec a|$, ne z $|\\vec a|^2$." },
        ]),
        hint: "Dolžina projekcije $\\vec b$ na $\\vec a$ je $|\\vec b||\\cos\\varphi|$; izrazi jo s skalarnim produktom.",
        data: { given: [`\\vec a = ${vt(a)}`, `\\vec b = ${vt(b)}`], find: ["|\\vec b_a|"] },
        formula: "|\\vec b_a| = \\dfrac{|\\vec a \\cdot \\vec b|}{|\\vec a|}",
        solution: `$\\vec a \\cdot \\vec b = ${d}$, $|\\vec a| = \\sqrt{${dot(a, a)}}$\n$|\\vec b_a| = \\dfrac{${Math.abs(d)}}{\\sqrt{${dot(a, a)}}} \\approx ${tx(pr, 2)}$`,
      };
    },
  },
  {
    id: P + "polinomi",
    topics: [T(3, "polinomi")],
    gen(level, r) {
      const coefs = (deg) => {
        const cs = [r.nonZero(-3, 4)];
        for (let i = 0; i < deg; i++) cs.push(r.int(-6, 6));
        return cs;
      };
      // Hornerjeva shema: vmesni rezultati (zadnji je ostanek)
      const horner = (cs, a) => {
        const row = [cs[0]];
        for (let i = 1; i < cs.length; i++) row.push(cs[i] + a * row[i - 1]);
        return row;
      };
      if (level === 1) {
        const deg = r.pick([3, 4]);
        const cs = coefs(deg);
        if (r.next() < 0.5) cs[r.int(1, deg - 1)] = 0;
        const a = r.pick([-3, -2, 2, 3, -1]);
        const val = ev(cs, a);
        const noZero = cs.filter((c, i) => i === 0 || c !== 0);
        const mist = [{ value: ev(cs, -a), why: a < 0 ? "Pri deljenju z $x + c$ v shemo vstaviš $-c$." : "Pri deljenju z $x - c$ v shemo vstaviš $c$, ne $-c$." }];
        if (noZero.length < cs.length) mist.push({ value: ev(noZero, a), why: "Si v Hornerjevi shemi izpustil koeficient 0?" });
        const remainder = r.next() < 0.5;
        const row = horner(cs, a);
        return {
          text: remainder
            ? `Kolikšen je ostanek pri deljenju polinoma $p(x) = ${poly(cs)}$ s polinomom $q(x) = ${lin(a).slice(1, -1)}$?`
            : `S Hornerjevim algoritmom izračunaj $p(${a})$ za $p(x) = ${poly(cs)}$.`,
          answer: num(val, null, mist),
          hint: remainder ? `Po izreku o ostanku je ostanek pri deljenju z $x - c$ enak $p(c)$. Kaj je tu $c$?` : "V prvo vrstico zapiši vse koeficiente (tudi ničle), nato množi in seštevaj.",
          data: { given: [`p(x) = ${poly(cs)}`, remainder ? `q(x) = ${lin(a).slice(1, -1)}` : `c = ${a}`], find: [remainder ? "\\text{ostanek}" : `p(${a})`] },
          formula: remainder ? "p(x) = (x - c)\\,k(x) + p(c)" : "b_i = a_i + c \\cdot b_{i-1}",
          solution: `Koeficienti: $${cs.join(",\\ ")}$, $c = ${a}$\nHornerjeva shema: $${row.join(",\\ ")}$\n${remainder ? "Ostanek" : `$p(${a})$`} je zadnje število: $${val}$.`,
        };
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const a = r.pick([-3, -2, -1, 1, 2, 3]);
          const m = r.nonZero(-6, 6);
          const b = r.int(-9, 9);
          const c = -(a ** 3 + m * a * a + b * a);
          const mWrong = -((-a) ** 3 + b * -a + c) / (a * a);
          const pm = `x^3 + mx^2${b ? ` ${tm(b, "x")}` : ""}${c ? ` ${sg(c)}` : ""}`;
          return {
            text: `Določi parameter $m$ tako, da bo polinom $p(x) = ${pm}$ deljiv s polinomom $q(x) = ${lin(a).slice(1, -1)}$.`,
            answer: num(m, null, [{ value: mWrong, why: "Polinom je deljiv z $x - c$, ko je $p(c) = 0$; preveri, kaj je $c$." }]),
            hint: "Polinom je deljiv z $x - c$ natanko tedaj, ko je $c$ njegova ničla.",
            data: { given: [`p(x) = ${pm}`, `q(x) = ${lin(a).slice(1, -1)}`], find: ["m"] },
            formula: "p(c) = 0",
            solution: `$p(${a}) = ${a ** 3} ${sg(a * a)}m${b ? ` ${sg(b * a)}` : ""}${c ? ` ${sg(c)}` : ""} = 0$\n$${a * a}m = ${-(a ** 3 + b * a + c)}$\n$m = ${m}$`,
          };
        }
        const cs = coefs(3);
        const a = r.pick([-3, -2, -1, 2, 3]);
        const row = horner(cs, a);
        const askConst = r.next() < 0.5;
        const ans = askConst ? row[2] : row[1];
        return {
          text: `Polinom $p(x) = ${poly(cs)}$ deliš s polinomom $q(x) = ${lin(a).slice(1, -1)}$. Koliko je ${askConst ? "prosti člen" : "koeficient pri $x$"} v količniku?`,
          answer: num(ans, null, [
            { value: row[3], why: "To je ostanek, ne člen količnika." },
            { value: horner(cs, -a)[askConst ? 2 : 1], why: "Pri deljenju z $x - c$ v shemo vstaviš $c$; pazi na predznak." },
          ]),
          hint: "Uporabi Hornerjev algoritem: števila v spodnji vrstici (razen zadnjega) so koeficienti količnika.",
          data: { given: [`p(x) = ${poly(cs)}`, `q(x) = ${lin(a).slice(1, -1)}`], find: [askConst ? "\\text{prosti člen količnika}" : "\\text{koeficient pri } x"] },
          formula: "p(x) = (x - c)\\,k(x) + o",
          solution: `Hornerjeva shema s $c = ${a}$: $${row.join(",\\ ")}$\nKoličnik: $k(x) = ${poly(row.slice(0, 3))}$, ostanek $${row[3]}$\n${askConst ? "Prosti člen" : "Koeficient pri $x$"} je $${ans}$.`,
        };
      }
      if (r.next() < 0.55) {
        const roots = [];
        while (roots.length < 3) {
          const x = r.nonZero(-5, 5);
          if (!roots.includes(x)) roots.push(x);
        }
        const cs = fromRoots(roots);
        const askMax = r.next() < 0.5;
        const sorted = [...roots].sort((p, q) => p - q);
        const ans = askMax ? sorted[2] : sorted[0];
        const ctx = r.pick(["", "Prostornino škatle opisuje polinom. "]);
        return {
          text: `${ctx}Poišči vse ničle polinoma $p(x) = ${poly(cs)}$. Vpiši ${askMax ? "največjo" : "najmanjšo"}.`,
          answer: num(ans, null, [{ value: askMax ? sorted[0] : sorted[2], why: `Vpisati moraš ${askMax ? "največjo" : "najmanjšo"} ničlo.` }, { value: -ans, why: "Ničla faktorja $x - c$ je $c$, ne $-c$." }]),
          hint: "Celoštevilske ničle so delitelji prostega člena. Eno poišči s Hornerjevim algoritmom, nato reši kvadratno enačbo.",
          data: { given: [`p(x) = ${poly(cs)}`], find: [askMax ? "x_{\\max}" : "x_{\\min}"] },
          formula: ["p(x) = (x - x_1)\\,k(x)", "x_{1,2} = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"],
          solution: `Kandidati so delitelji števila $${cs[3]}$. Preizkus: $p(${roots[0]}) = 0$.\nHorner: $p(x) = ${lin(roots[0])}(${poly(fromRoots(roots.slice(1)))})$\nNičle: $${sorted.join(",\\ ")}$; ${askMax ? "največja" : "najmanjša"} je $${ans}$.`,
        };
      }
      const nOdd = r.pick([1, -1, 3, -3, 5]);
      const roots = [];
      while (roots.length < 2) {
        const x = r.nonZero(-4, 4);
        if (!roots.includes(x)) roots.push(x);
      }
      const cs = mul([2, -nOdd], fromRoots(roots));
      const all = [...roots, nOdd / 2].sort((p, q) => p - q);
      const askMax = r.next() < 0.5;
      const ans = askMax ? all[2] : all[0];
      return {
        text: `Poišči vse ničle polinoma $p(x) = ${poly(cs)}$. Vpiši ${askMax ? "največjo" : "najmanjšo"} (decimalno število).`,
        answer: num(ans, null, [{ value: askMax ? all[0] : all[2], why: `Vpisati moraš ${askMax ? "največjo" : "najmanjšo"} ničlo.` }, { value: -ans, why: "Pazi na predznak ničle." }]),
        hint: "Racionalne ničle imajo obliko $\\frac{p}{q}$, kjer $p$ deli prosti člen, $q$ pa vodilni koeficient. Začni s celimi kandidati.",
        data: { given: [`p(x) = ${poly(cs)}`], find: [askMax ? "x_{\\max}" : "x_{\\min}"] },
        formula: ["x = \\dfrac{p}{q},\\ p \\mid a_0,\\ q \\mid a_n", "p(x) = (x - x_1)\\,k(x)"],
        solution: `Preizkus: $p(${roots[0]}) = 0$, Horner da $p(x) = ${lin(roots[0])}(${poly(mul([2, -nOdd], [1, -roots[1]]))})$.\nNičli kvadratnega faktorja: $${roots[1]}$ in $${ft(nOdd, 2)}$.\nNičle: $${all.map((x) => tx(x)).join(",\\ ")}$; ${askMax ? "največja" : "najmanjša"} je $${tx(ans)}$.`,
      };
    },
  },
  {
    id: P + "graf-polinoma",
    topics: [T(3, "graf-polinoma")],
    gen(level, r) {
      const distinct = (k, lo, hi) => {
        const out = [];
        while (out.length < k) {
          const x = r.int(lo, hi);
          if (!out.includes(x)) out.push(x);
        }
        return out.sort((p, q) => p - q);
      };
      const fac = (x, m) => `${lin(x)}${m > 1 ? `^${m}` : ""}`;
      const factored = (a, roots, ms) => `${a === 1 ? "" : a === -1 ? "-" : a}${roots.map((x, i) => fac(x, ms[i])).join("")}`;
      const valAt = (a, roots, ms, x) => roots.reduce((p, rt, i) => p * (x - rt) ** ms[i], a);
      if (level === 1) {
        const k = r.pick([2, 3, 3]);
        const roots = distinct(k, -5, 5);
        const ms = roots.map(() => r.int(1, 3));
        const a = r.pick([1, -1, 2, -2, 3, -3]);
        const f = factored(a, roots, ms);
        const deg = ms.reduce((p, q) => p + q, 0);
        const t = r.int(0, 2);
        if (t === 0) {
          const dir = r.pick(["+", "-"]);
          const sgn = Math.sign(a) * (dir === "-" && deg % 2 ? -1 : 1);
          const opt = (s) => `p(x) \\to ${s}\\infty`;
          const right = opt(sgn > 0 ? "+" : "-");
          return {
            text: `Kaj velja za vrednosti polinoma $p(x) = ${f}$, ko gre $x \\to ${dir}\\infty$?`,
            answer: pickAns(r, right, [
              [opt(sgn > 0 ? "-" : "+"), `Odločata stopnja polinoma (soda ali liha) in predznak vodilnega koeficienta.`],
              ["p(x) \\to 0", "Polinom stopnje vsaj 1 ne gre proti 0, ko $x$ raste čez vse meje."],
              [`p(x) \\to ${a}`, "Vodilni koeficient določa le predznak, vrednosti pa rastejo čez vse meje."],
            ]),
            options_tex: true,
            hint: "Za velike $|x|$ se polinom obnaša kot njegov vodilni člen $a_n x^n$. Določi stopnjo in vodilni koeficient.",
            data: false,
            formula: "p(x) \\approx a_n x^n \\text{ za velike } |x|",
            solution: `Stopnja: $n = ${ms.join(" + ")} = ${deg}$ (${deg % 2 ? "liha" : "soda"}), vodilni koeficient $a_n = ${a}$.\nZa velike $|x|$ je $p(x) \\approx ${a === 1 ? "" : a === -1 ? "-" : a}x^{${deg}}$.\nKo gre $x \\to ${dir}\\infty$, velja $${right}$.`,
          };
        }
        if (t === 1) {
          return {
            text: `Kolikšna je stopnja polinoma $p(x) = ${f}$?`,
            answer: num(deg, null, [
              { value: roots.length, why: "Ne štej le faktorjev; upoštevaj tudi njihove potence (stopnje ničel)." },
              { value: Math.max(...ms), why: "Stopnja je vsota stopenj vseh faktorjev." },
            ]),
            hint: "Stopnja produkta je vsota stopenj faktorjev.",
            data: { given: [`p(x) = ${f}`], find: ["\\text{st}(p)"] },
            formula: "\\text{st}(p \\cdot q) = \\text{st}(p) + \\text{st}(q)",
            solution: `Stopnje faktorjev: $${ms.join(", ")}$.\nStopnja polinoma: $${ms.join(" + ")} = ${deg}$`,
          };
        }
        const y0 = valAt(a, roots, ms, 0);
        if (y0 === 0) return null;
        return {
          text: `V kateri točki graf polinoma $p(x) = ${f}$ seka os $y$? Vpiši ordinato $p(0)$.`,
          answer: num(y0, null, [
            { value: roots.reduce((p, rt, i) => p * rt ** ms[i], a), why: "Pri $x = 0$ je faktor $(0 - c)$ enak $-c$; pazi na predznak." },
            { value: valAt(1, roots, ms, 0), why: "Si pozabil pomnožiti z vodilnim koeficientom?" },
          ]),
          hint: "Presečišče z osjo $y$ je pri $x = 0$: vstavi 0 v vsak faktor.",
          data: { given: [`p(x) = ${f}`], find: ["p(0)"] },
          formula: "N(0, p(0))",
          solution: `$p(0) = ${a === 1 ? "" : `${a} \\cdot `}${roots.map((x, i) => (-x < 0 || ms[i] > 1 ? `(${-x})` : `${-x}`) + (ms[i] > 1 ? `^${ms[i]}` : "")).join(" \\cdot ")}$\n$p(0) = ${y0}$`,
        };
      }
      if (level === 2) {
        if (r.next() < 0.55) {
          const k = r.pick([3, 4]);
          const roots = distinct(k, -5, 6);
          const ms = roots.map(() => r.int(1, 4));
          const a = r.pick([1, -1, 2, -3]);
          const f = factored(a, roots, ms);
          const cross = ms.filter((m) => m % 2).length;
          const touch = k - cross;
          const askCross = r.next() < 0.5;
          const ans = askCross ? cross : touch;
          return {
            zeroOk: true,
            text: askCross
              ? `V koliko točkah graf polinoma $p(x) = ${f}$ seka os $x$ (tam spremeni predznak)?`
              : `V koliko točkah se graf polinoma $p(x) = ${f}$ osi $x$ le dotakne (ne spremeni predznaka)?`,
            answer: num(ans, null, [
              { value: k, why: "Ne spremeni se predznak pri vsaki ničli; odloča stopnja ničle (soda ali liha)." },
              { value: askCross ? touch : cross, why: "Pri ničli lihe stopnje graf seka os, pri ničli sode stopnje se je le dotakne." },
            ]),
            hint: "Za vsako ničlo določi njeno stopnjo (potenco faktorja). Je soda ali liha?",
            data: { given: [`p(x) = ${f}`], find: [askCross ? "\\text{število presečišč}" : "\\text{število dotikališč}"] },
            formula: ["\\text{liha stopnja ničle: graf seka os } x", "\\text{soda stopnja ničle: graf se osi } x \\text{ dotakne}"],
            solution: `Ničle in stopnje: ${roots.map((x, i) => `$${x}$ (${ms[i]})`).join(", ")}.\nLihe stopnje: ${cross}, sode stopnje: ${touch}.\n${askCross ? "Graf seka os $x$" : "Graf se osi $x$ dotakne"} v ${ans} ${ans === 1 ? "točki" : "točkah"}.`,
          };
        }
        // število realnih ničel produkta faktorjev
        const used = new Set();
        const pool = [];
        const s = r.int(1, 5);
        pool.push({ tex: `(x^2 - ${s * s})`, zeros: [s, -s], deg: 2, mult: 2 });
        pool.push({ tex: `(x^2 + ${r.int(1, 9)})`, zeros: [], deg: 2, mult: 0 });
        const b = r.pick([2, 4, -2, -4]);
        pool.push({ tex: `(x^2 ${sg(b)}x + ${(b * b) / 4 + r.int(1, 5)})`, zeros: [], deg: 2, mult: 0 });
        let tt;
        do tt = r.int(-4, 4);
        while (tt === s || tt === -s);
        pool.push({ tex: `(x^2 ${tt ? `${sg(-2 * tt)}x ${sg(tt * tt)}` : ""})`.replace("( ", "("), zeros: [tt], deg: 2, mult: 2 });
        let u;
        do u = r.nonZero(-5, 5);
        while (u === s || u === -s || u === tt);
        const mu = r.int(1, 3);
        pool.push({ tex: `${lin(u)}${mu > 1 ? `^${mu}` : ""}`, zeros: [u], deg: mu, mult: mu });
        const pick = r.shuffle(pool).slice(0, 3);
        pick.forEach((p) => p.zeros.forEach((z) => used.add(z)));
        const f = pick.map((p) => p.tex).join("");
        const ans = used.size;
        const deg = pick.reduce((p, q) => p + q.deg, 0);
        return {
          text: `Koliko različnih realnih ničel ima polinom $p(x) = ${f}$?`,
          answer: num(ans, null, [
            { value: deg, why: "Stopnja je le zgornja meja za število ničel; nekateri kvadratni faktorji nimajo realnih ničel." },
            { value: pick.reduce((p, q) => p + q.mult, 0), why: "Ničle štej brez večkratnosti: dvojna ničla je ena sama ničla." },
          ]),
          hint: "Vsak faktor obravnavaj posebej: koliko realnih ničel ima? Pri kvadratnem faktorju pomaga diskriminanta ali razcep.",
          data: { given: [`p(x) = ${f}`], find: ["\\text{število ničel}"] },
          formula: "D = b^2 - 4ac",
          solution: `${pick.map((p) => `$${p.tex}$: ${p.zeros.length ? `ničl${p.zeros.length === 1 ? "a" : "i"} $${p.zeros.join(",\\ ")}$${p.mult > p.zeros.length && p.deg === 2 ? " (dvojna)" : ""}` : "ni realnih ničel ($D < 0$ oz. vsota kvadrata in pozitivnega števila)"}`).join("\n")}\nRazličnih realnih ničel je ${ans}.`,
        };
      }
      if (r.next() < 0.55) {
        const k = r.pick([2, 3]);
        const roots = distinct(k, -4, 5);
        let ms = k === 2 ? r.pick([[1, 1], [1, 3], [3, 1]]) : r.shuffle([2, 1, r.pick([1, 3])]);
        const a = r.pick([1, -1, 2, -2]);
        const strict = r.next() < 0.5;
        const op = a > 0 ? (strict ? "<" : "\\le") : strict ? ">" : "\\ge";
        const test = (x, st) => {
          const v = valAt(a, roots, ms, x);
          return a > 0 ? (st ? v < 0 : v <= 0) : st ? v > 0 : v >= 0;
        };
        const sol = [];
        const solOther = [];
        for (let x = -30; x <= 30; x++) {
          if (test(x, strict)) sol.push(x);
          if (test(x, !strict)) solOther.push(x);
        }
        if (!sol.length) return null;
        const f = factored(a, roots, ms);
        return {
          text: `Dan je polinom $p(x) = ${f}$. Koliko celih števil reši neenačbo $p(x) ${op} 0$?`,
          answer: num(sol.length, null, [
            { value: solOther.length, why: strict ? "Neenačba je stroga: ničle niso rešitve." : "Neenačba ni stroga: ničle so tudi rešitve." },
            { value: Math.max(...roots) - Math.min(...roots) + (strict ? -1 : 1), why: "Pri ničli sode stopnje se predznak ne spremeni." },
          ]),
          hint: "Nariši skico grafa: začni pri vodilnem členu (obnašanje v neskončnosti), nato pri vsaki ničli preveri, ali graf seka os ali se je le dotakne.",
          data: { given: [`p(x) = ${f}`], find: ["\\text{število celih rešitev}"] },
          formula: ["\\text{liha stopnja ničle: predznak se spremeni}", "\\text{soda stopnja ničle: predznak ostane}"],
          solution: `Ničle in stopnje: ${roots.map((x, i) => `$${x}$ (${ms[i]})`).join(", ")}; stopnja ${ms.reduce((p, q) => p + q, 0)}, vodilni koeficient $${a}$.\nIz skice predznakov dobimo cele rešitve: $${sol.join(",\\ ")}$.\nCelih rešitev je ${sol.length}.`,
        };
      }
      const roots = distinct(3, -4, 4);
      const [an, ad] = r.pick([[2, 1], [-1, 1], [3, 1], [-2, 1], [1, 2], [-1, 2], [3, 2], [-1, 3], [1, 1]]);
      let x0 = 0;
      for (const c of r.shuffle([0, 0, 1, -1, 2, -2, 3, 5, -5])) {
        const prod = roots.reduce((p, rt) => p * (c - rt), 1);
        if (!roots.includes(c) && prod % ad === 0) {
          x0 = c;
          break;
        }
        x0 = null;
      }
      if (x0 == null) return null;
      const prod = roots.reduce((p, rt) => p * (x0 - rt), 1);
      const y0 = (an * prod) / ad;
      return {
        text: `Polinom tretje stopnje ima ničle $${roots[0]}$, $${roots[1]}$ in $${roots[2]}$, njegov graf pa poteka skozi točko $T(${x0}, ${y0})$. Kolikšen je vodilni koeficient? Vpiši ulomek ali celo število.`,
        answer: frAns(an, ad),
        hint: "Zapiši polinom v obliki $p(x) = a(x - x_1)(x - x_2)(x - x_3)$ in vstavi koordinati točke $T$.",
        data: { given: [`x_1 = ${roots[0]}`, `x_2 = ${roots[1]}`, `x_3 = ${roots[2]}`, `T = (${x0}, ${y0})`], find: ["a"] },
        formula: "p(x) = a(x - x_1)(x - x_2)(x - x_3)",
        solution: `$p(x) = a${roots.map((x) => lin(x)).join("")}$\n$${y0} = a \\cdot ${roots.map((x) => `(${x0 - x})`).join(" \\cdot ")} = ${prod}a$\n$a = ${ft(an, ad)}$`,
      };
    },
  },
  {
    id: P + "racionalne-funkcije",
    topics: [T(3, "racionalne-funkcije")],
    gen(level, r) {
      if (level === 1) {
        const c = r.pick([1, 1, 2, 3]);
        const p = r.nonZero(-5, 5);
        const d = -c * p;
        const a = r.nonZero(-4, 4);
        let z;
        do z = r.int(-5, 5);
        while (z === p);
        const b = -a * z;
        const f = `\\dfrac{${le(a, b)}}{${le(c, d)}}`;
        const ask = r.pick(["pol", "nicla", "asim", "y0"]);
        const base = { data: { given: [`f(x) = ${f}`], find: [] } };
        if (ask === "pol") {
          return {
            ...base,
            text: `Dana je funkcija $f(x) = ${f}$. Kje ima pol?`,
            answer: num(p, null, [{ value: -p, why: "Pol je ničla imenovalca: reši $" + le(c, d) + " = 0$." }, { value: z, why: "To je ničla števca, torej ničla funkcije, ne pol." }]),
            hint: "Pol je tam, kjer je imenovalec enak 0 (števec pa ne).",
            data: { given: [`f(x) = ${f}`], find: ["x_{\\mathrm{pol}}"] },
            formula: "q(x) = 0",
            solution: `$${le(c, d)} = 0$\n$x = ${p}$; števec tam ni 0, zato je to pol.`,
          };
        }
        if (ask === "nicla") {
          return {
            text: `Dana je funkcija $f(x) = ${f}$. Kje ima ničlo?`,
            answer: num(z, null, [{ value: -z, why: "Ničla je rešitev enačbe $" + le(a, b) + " = 0$; pazi na predznak." }, { value: p, why: "To je ničla imenovalca, torej pol." }]),
            hint: "Ulomek je enak 0, ko je števec 0 (imenovalec pa ne).",
            data: { given: [`f(x) = ${f}`], find: ["x_0"] },
            formula: "p(x) = 0",
            solution: `$${le(a, b)} = 0$\n$x = ${z}$; imenovalec tam ni 0, zato je to ničla.`,
          };
        }
        if (ask === "asim") {
          return {
            text: `Dana je funkcija $f(x) = ${f}$. Vodoravna asimptota ima enačbo $y = k$. Koliko je $k$? Vpiši ulomek ali celo število.`,
            answer: frAns(a, c),
            hint: "Števec in imenovalec imata enako stopnjo: asimptota je količnik vodilnih koeficientov.",
            data: { given: [`f(x) = ${f}`], find: ["k"] },
            formula: "y = \\dfrac{a_n}{b_n}",
            solution: `Stopnji števca in imenovalca sta enaki (1).\n$k = \\dfrac{${a}}{${c}} = ${ft(a, c)}$`,
          };
        }
        return {
          text: `Dana je funkcija $f(x) = ${f}$. V kateri točki graf seka os $y$? Vpiši $f(0)$ kot ulomek ali celo število.`,
          answer: frAns(b, d),
          hint: "Vstavi $x = 0$.",
          data: { given: [`f(x) = ${f}`], find: ["f(0)"] },
          formula: "N(0, f(0))",
          solution: `$f(0) = \\dfrac{${b}}{${d}}$\n$f(0) = ${ft(b, d)}$`,
        };
      }
      if (level === 2) {
        if (r.next() < 0.6) {
          const [z, h, p] = r.shuffle([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]).slice(0, 3);
          const nu = fromRoots([z, h]);
          const de = fromRoots([p, h]);
          const f = `\\dfrac{${poly(nu)}}{${poly(de)}}`;
          const askPol = r.next() < 0.5;
          return {
            text: `Dana je funkcija $f(x) = ${f}$. ${askPol ? "Kje ima funkcija pol?" : "Kje ima funkcija ničlo?"}`,
            answer: num(askPol ? p : z, null, [
              { value: h, why: `V $x = ${h}$ sta števec in imenovalec oba enaka 0: faktor se pokrajša in tam je le luknja v grafu (funkcija ni definirana).` },
              { value: askPol ? -p : -z, why: "Pazi na predznak: ničla faktorja $x - c$ je $c$." },
            ]),
            hint: "Razstavi števec in imenovalec. Skupni faktor se pokrajša – tam funkcija ni definirana, a to ni pol ne ničla.",
            data: { given: [`f(x) = ${f}`], find: [askPol ? "x_{\\mathrm{pol}}" : "x_0"] },
            formula: "f(x) = \\dfrac{p(x)}{q(x)}",
            solution: `$f(x) = \\dfrac{${lin(z)}${lin(h)}}{${lin(p)}${lin(h)}} = \\dfrac{${lin(z).replace(/^\(|\)$/g, "")}}{${lin(p).replace(/^\(|\)$/g, "")}},\\ x \\ne ${h}$\nV $x = ${h}$ je luknja, ${askPol ? `pol je pri $x = ${p}$` : `ničla je pri $x = ${z}$`}.`,
          };
        }
        const lower = r.next() < 0.3;
        const a = r.nonZero(-6, 6);
        const dlead = r.pick([1, 2, 3, 4, -2]);
        const nu = lower ? [r.nonZero(-5, 5), r.int(-9, 9)] : [a, r.int(-9, 9), r.int(-9, 9)];
        const de = [dlead, r.int(-9, 9), r.nonZero(-9, 9)];
        const f = `\\dfrac{${poly(nu)}}{${poly(de)}}`;
        return {
          zeroOk: lower,
          text: `Vodoravna asimptota grafa funkcije $f(x) = ${f}$ ima enačbo $y = k$. Koliko je $k$? Vpiši ulomek ali celo število.`,
          answer: lower ? frAns(0, 1) : frAns(a, dlead),
          hint: "Primerjaj stopnji števca in imenovalca.",
          data: { given: [`f(x) = ${f}`], find: ["k"] },
          formula: ["\\text{st}(p) < \\text{st}(q):\\ y = 0", "\\text{st}(p) = \\text{st}(q):\\ y = \\dfrac{a_n}{b_n}"],
          solution: lower
            ? `Stopnja števca (1) je manjša od stopnje imenovalca (2).\nZa velike $|x|$ gre $f(x) \\to 0$, zato je $k = 0$.`
            : `Stopnji števca in imenovalca sta enaki (2).\n$k = \\dfrac{${a}}{${dlead}} = ${ft(a, dlead)}$`,
        };
      }
      if (r.next() < 0.55) {
        const k = r.pick([1, 1, 2, -1, 3]);
        const p = r.nonZero(-4, 4);
        const b = r.int(-6, 6);
        const n0 = b + k * p;
        const c = r.int(-9, 9);
        const rem = c + p * n0;
        if (rem === 0) return null;
        const f = `\\dfrac{${poly([k, b, c])}}{${lin(p).replace(/^\(|\)$/g, "")}}`;
        return {
          text: `Graf funkcije $f(x) = ${f}$ ima poševno asimptoto $y = ${k === 1 ? "" : k === -1 ? "-" : k}x + n$. Koliko je $n$?`,
          answer: num(n0, null, [
            { value: b - k * p, why: "Pri deljenju z $x - c$ pazi na predznak; preveri s Hornerjevim algoritmom." },
            { value: b, why: "Števec moraš deliti z imenovalcem; asimptota je količnik brez ostanka." },
          ]),
          hint: "Števec deli z imenovalcem (npr. s Hornerjevim algoritmom). Količnik je enačba poševne asimptote.",
          data: { given: [`f(x) = ${f}`], find: ["n"] },
          formula: "f(x) = k(x) + \\dfrac{o}{q(x)}\\ \\Rightarrow\\ y = k(x)",
          solution: `$${poly([k, b, c])} = ${lin(p)}(${poly([k, n0])}) ${sg(rem)}$\nAsimptota: $y = ${poly([k, n0])}$\n$n = ${n0}$`,
        };
      }
      const a = r.pick([1, 2, -1, 3]);
      const b = r.int(-6, 6);
      const c = r.int(-8, 8);
      const d = r.int(-5, 5);
      const e = r.nonZero(-8, 8);
      if (a * d === b || c - a * e === 0) return null;
      const [xn, xd] = fr(c - a * e, a * d - b);
      const xv = xn / xd;
      if (Math.abs(xv * xv + d * xv + e) < 1e-9) return null;
      const f = `\\dfrac{${poly([a, b, c])}}{${poly([1, d, e])}}`;
      return {
        text: `V kateri točki graf funkcije $f(x) = ${f}$ seka svojo vodoravno asimptoto? Vpiši abscliso kot ulomek ali celo število.`.replace("abscliso", "absciso"),
        answer: frAns(xn, xd),
        hint: "Najprej določi vodoravno asimptoto $y = k$, nato reši enačbo $f(x) = k$.",
        data: { given: [`f(x) = ${f}`], find: ["x"] },
        formula: ["y = \\dfrac{a_n}{b_n}", "f(x) = k"],
        solution: `Asimptota: $y = ${a}$.\n$${poly([a, b, c])} = ${a}(${poly([1, d, e])})$\n$${tm(b - a * d, "x", true)} = ${a * e - c}$\n$x = ${ft(xn, xd)}$`,
      };
    },
  },
  {
    id: P + "kroznica",
    topics: [T(3, "kroznica")],
    gen(level, r) {
      const circ = (p, q, R2) => `${p === 0 ? "x^2" : `${lin(p)}^2`} + ${q === 0 ? "y^2" : `${lin(q, "y")}^2`} = ${R2}`;
      const LINES = [[0, 1, 1], [1, 0, 1], [3, 4, 5], [4, -3, 5], [3, -4, 5], [4, 3, 5], [5, 12, 13]];
      const lineTex = (A, B, Cl) => {
        const parts = [];
        if (A) parts.push(tm(A, "x", true));
        if (B) parts.push(parts.length ? tm(B, "y") : tm(B, "y", true));
        if (Cl) parts.push(sg(Cl));
        return `${parts.join(" ")} = 0`;
      };
      const gen0 = (p, q, R) => {
        const D = -2 * p;
        const E = -2 * q;
        const F = p * p + q * q - R * R;
        return { D, E, F, tex: `x^2 + y^2${D ? ` ${tm(D, "x")}` : ""}${E ? ` ${tm(E, "y")}` : ""}${F ? ` ${sg(F)}` : ""} = 0` };
      };
      if (level === 1) {
        if (r.next() < 0.5) {
          const p = r.int(-5, 5);
          const q = r.int(-5, 5);
          const Tp = [p + r.nonZero(-6, 6), q + r.nonZero(-6, 6)];
          const R2 = (Tp[0] - p) ** 2 + (Tp[1] - q) ** 2;
          return {
            text: `Krožnica s središčem $S(${p}, ${q})$ poteka skozi točko $T(${Tp[0]}, ${Tp[1]})$. Njena enačba je $(x - p)^2 + (y - q)^2 = r^2$. Koliko je $r^2$?`,
            answer: num(R2, null, [
              { value: Math.sqrt(R2), why: "Vprašanje je po $r^2$, ne po polmeru $r$." },
              { value: (Tp[0] + p) ** 2 + (Tp[1] + q) ** 2, why: "Razdalja se računa iz razlik koordinat, ne vsot." },
            ]),
            hint: "Polmer je razdalja od središča do točke na krožnici.",
            data: { given: [`S = (${p}, ${q})`, `T = (${Tp[0]}, ${Tp[1]})`], find: ["r^2"] },
            formula: "r^2 = (x_T - p)^2 + (y_T - q)^2",
            solution: `$r^2 = (${dif(Tp[0], p)})^2 + (${dif(Tp[1], q)})^2$\n$r^2 = ${(Tp[0] - p) ** 2} + ${(Tp[1] - q) ** 2} = ${R2}$`,
          };
        }
        const p = r.nonZero(-6, 6);
        const q = r.nonZero(-6, 6);
        const R = r.int(1, 8);
        const G = gen0(p, q, R);
        const askP = r.next() < 0.5;
        const ans = askP ? p : q;
        return {
          text: `Krožnica ima enačbo $${G.tex}$. Koliko je ${askP ? "abscisa" : "ordinata"} njenega središča?`,
          answer: num(ans, null, [{ value: -ans, why: "Iz $x^2 - 2px$ dobiš $(x - p)^2$: pazi na predznak." }, { value: askP ? G.D : G.E, why: "Koeficient pri linearnem členu je $-2p$; deli ga z $-2$." }]),
          hint: "Dopolni do popolnega kvadrata: $x^2 + Dx = \\left(x + \\frac{D}{2}\\right)^2 - \\frac{D^2}{4}$.",
          data: { given: [`${G.tex}`], find: [askP ? "p" : "q"] },
          formula: ["(x - p)^2 + (y - q)^2 = r^2", "x^2 + y^2 - 2px - 2qy + \\ldots = 0"],
          solution: `${askP ? `$x^2 ${tm(G.D, "x")} = ${lin(p)}^2 - ${p * p}$` : `$y^2 ${tm(G.E, "y")} = ${lin(q, "y")}^2 - ${q * q}$`}\nSredišče je $S(${p}, ${q})$, ${askP ? "abscisa" : "ordinata"} je $${ans}$.`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const p = r.int(-6, 6);
          const q = r.int(-6, 6);
          const R = r.int(2, 9);
          const G = gen0(p, q, R);
          if (!G.D && !G.E) return null;
          return {
            text: `Kolikšen je polmer krožnice $${G.tex}$?`,
            answer: num(R, null, [
              { value: R * R, why: "Na desni strani urejene enačbe je $r^2$; koreni." },
              { value: Math.sqrt(Math.abs(G.F)), why: "Prosti člen ni $r^2$; enačbo najprej uredi s popolnima kvadratoma." },
            ]),
            hint: "Dopolni člene z $x$ in z $y$ do popolnih kvadratov in enačbo zapiši v obliki $(x - p)^2 + (y - q)^2 = r^2$.",
            data: { given: [`${G.tex}`], find: ["r"] },
            formula: "(x - p)^2 + (y - q)^2 = r^2",
            solution: `$${p === 0 ? "x^2" : `${lin(p)}^2 - ${p * p}`} + ${q === 0 ? "y^2" : `${lin(q, "y")}^2 - ${q * q}`}${G.F ? ` ${sg(G.F)}` : ""} = 0$\n$${circ(p, q, R * R)}$\n$r = \\sqrt{${R * R}} = ${R}$`,
          };
        }
        if (t === 1) {
          const A = [r.int(-6, 6), r.int(-6, 6)];
          const B = [A[0] + 2 * r.nonZero(-4, 4), A[1] + 2 * r.int(-4, 4)];
          const S = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
          const R2 = (B[0] - S[0]) ** 2 + (B[1] - S[1]) ** 2;
          return {
            text: `Daljica z robnima točkama $A(${A[0]}, ${A[1]})$ in $B(${B[0]}, ${B[1]})$ je premer krožnice. Enačba krožnice je $(x - p)^2 + (y - q)^2 = r^2$. Koliko je $r^2$?`,
            answer: num(R2, null, [{ value: 4 * R2, why: "$|AB|$ je premer; polmer je njegova polovica." }, { value: Math.sqrt(R2), why: "Vprašanje je po $r^2$." }]),
            hint: "Središče je razpolovišče daljice $AB$, polmer pa razdalja od središča do točke $A$.",
            data: { given: [`A = (${A[0]}, ${A[1]})`, `B = (${B[0]}, ${B[1]})`], find: ["r^2"] },
            formula: ["S = \\left(\\dfrac{x_A + x_B}{2}, \\dfrac{y_A + y_B}{2}\\right)", "r = \\dfrac{|AB|}{2}"],
            solution: `$S = (${S[0]}, ${S[1]})$\n$r^2 = (${dif(B[0], S[0])})^2 + (${dif(B[1], S[1])})^2 = ${R2}$`,
          };
        }
        const p = r.int(-4, 4);
        const q = r.int(-4, 4);
        const R = r.int(2, 6);
        const [A, B, n] = r.pick(LINES);
        const cat = r.int(0, 2);
        const tt = cat === 1 ? R * n : cat === 2 ? r.int(0, R * n - 1) : r.int(R * n + 1, R * n + 2 * n);
        const Cl = r.pick([-1, 1]) * tt - (A * p + B * q);
        const ans = cat === 0 ? 0 : cat === 1 ? 1 : 2;
        const ln = lineTex(A, B, Cl);
        return {
          zeroOk: true,
          text: `Koliko skupnih točk imata krožnica $${circ(p, q, R * R)}$ in premica $${ln}$?`,
          answer: num(ans, null, [{ value: ans === 2 ? 1 : 2, why: "Primerjaj razdaljo središča od premice s polmerom: manjša – 2 točki, enaka – 1, večja – nobena." }]),
          hint: "Izračunaj razdaljo središča krožnice od premice in jo primerjaj s polmerom.",
          data: { given: [circ(p, q, R * R), ln], find: ["\\text{število skupnih točk}"] },
          formula: "d(S, p) = \\dfrac{|ap_0 + bq_0 + c|}{\\sqrt{a^2 + b^2}}",
          solution: `$S(${p}, ${q})$, $r = ${R}$\n$d = \\dfrac{|${A} \\cdot ${p < 0 ? `(${p})` : p} + ${B < 0 ? `(${B})` : B} \\cdot ${q < 0 ? `(${q})` : q} ${sg(Cl)}|}{${n}} = ${ft(tt, n)}$\n$d ${ans === 2 ? "<" : ans === 1 ? "=" : ">"} r$, zato ${ans === 2 ? "premica seka krožnico v dveh točkah" : ans === 1 ? "je premica tangenta (ena skupna točka)" : "premica in krožnica nimata skupnih točk"}.`,
        };
      }
      const p = r.int(-4, 4);
      const q = r.int(-4, 4);
      const [A, B, n] = r.pick(LINES.slice(0, 6));
      if (r.next() < 0.5) {
        const [R, dd] = r.pick([[5, 3], [5, 4], [13, 5], [13, 12], [10, 6], [10, 8], [15, 9], [17, 8], [25, 7], [5, 0], [15, 12]]);
        const Cl = r.pick([-1, 1]) * dd * n - (A * p + B * q);
        const ch = 2 * Math.sqrt(R * R - dd * dd);
        const ln = lineTex(A, B, Cl);
        return {
          text: `Premica $${ln}$ seka krožnico $${circ(p, q, R * R)}$. Kolikšna je dolžina tetive, ki jo krožnica odreže na premici?`,
          answer: num(ch, null, [
            { value: ch / 2, why: "To je polovica tetive; razdalja od središča razpolovi tetivo." },
            { value: 2 * Math.sqrt(R * R + dd * dd), why: "V pravokotnem trikotniku je polmer hipotenuza: $\\left(\\frac{t}{2}\\right)^2 = r^2 - d^2$." },
          ]),
          hint: "Izračunaj razdaljo $d$ središča od premice. Polovica tetive, $d$ in polmer tvorijo pravokotni trikotnik.",
          data: { given: [ln, circ(p, q, R * R)], find: ["t"] },
          formula: ["d = \\dfrac{|ap_0 + bq_0 + c|}{\\sqrt{a^2 + b^2}}", "\\left(\\dfrac{t}{2}\\right)^2 = r^2 - d^2"],
          solution: `$S(${p}, ${q})$, $r = ${R}$\n$d = \\dfrac{|${A * p + B * q} ${sg(Cl)}|}{${n}} = ${dd}$\n$\\dfrac{t}{2} = \\sqrt{${R * R} - ${dd * dd}} = ${ch / 2}$, $t = ${ch}$`,
        };
      }
      const R = r.int(1, 5);
      const base = A * p + B * q;
      const c1 = R * n - base;
      const c2 = -R * n - base;
      const ln = lineTex(A, B, 0).replace(" = 0", " + c = 0");
      return {
        text: `Za katero vrednost $c$ je premica $${ln}$ tangenta na krožnico $${circ(p, q, R * R)}$? Rešitvi sta dve; vpiši večjo.`,
        answer: num(Math.max(c1, c2), null, [
          { value: Math.min(c1, c2), why: "To je manjša od obeh rešitev." },
          { value: R * n + base, why: "Pazi na predznak: $|ap_0 + bq_0 + c| = rn$, torej $c = \\pm rn - (ap_0 + bq_0)$." },
          { value: R - base, why: "Razdalja vsebuje deljenje s $\\sqrt{a^2 + b^2}$; tega ne smeš izpustiti." },
        ]),
        hint: "Premica je tangenta, ko je razdalja središča od premice enaka polmeru.",
        data: { given: [circ(p, q, R * R)], find: ["c"] },
        formula: "\\dfrac{|ap_0 + bq_0 + c|}{\\sqrt{a^2 + b^2}} = r",
        solution: `$S(${p}, ${q})$, $r = ${R}$, $\\sqrt{a^2 + b^2} = ${n}$\n$|${base} + c| = ${R * n}$\n$c = ${c1}$ ali $c = ${c2}$; večja je $${Math.max(c1, c2)}$.`,
      };
    },
  },
  {
    id: P + "elipsa-hiperbola-parabola",
    topics: [T(3, "elipsa-hiperbola-parabola")],
    gen(level, r) {
      const conic = (A2, B2, minus = false) => `\\dfrac{x^2}{${A2}} ${minus ? "-" : "+"} \\dfrac{y^2}{${B2}} = 1`;
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const [x, y, z] = r.pick(TRIPLES.slice(0, 5).concat([[6, 8, 10], [9, 12, 15]]));
          const [b, e] = r.next() < 0.5 ? [x, y] : [y, x];
          const a = z;
          return {
            text: `Gorišči elipse $${conic(a * a, b * b)}$ sta $F_{1,2}(\\pm e, 0)$. Koliko je $e$?`,
            answer: num(e, null, [
              { value: Math.sqrt(a * a + b * b), why: "Pri elipsi je $e^2 = a^2 - b^2$; vsota velja za hiperbolo." },
              { value: a * a - b * b, why: "Si pozabil koreniti?" },
            ]),
            hint: "Iz enačbe razberi $a^2$ in $b^2$. Pri elipsi velja $e^2 = a^2 - b^2$.",
            data: { given: [conic(a * a, b * b)], find: ["e"] },
            formula: "e^2 = a^2 - b^2",
            solution: `$a^2 = ${a * a}$, $b^2 = ${b * b}$\n$e^2 = ${a * a} - ${b * b} = ${e * e}$, $e = ${e}$`,
          };
        }
        if (t === 1) {
          const [x, y, z] = r.pick(TRIPLES.slice(0, 5).concat([[6, 8, 10]]));
          const [a, b] = r.next() < 0.5 ? [x, y] : [y, x];
          return {
            text: `Gorišči hiperbole $${conic(a * a, b * b, true)}$ sta $F_{1,2}(\\pm e, 0)$. Koliko je $e$?`,
            answer: num(z, null, [
              { value: Math.sqrt(Math.abs(a * a - b * b)), why: "Pri hiperboli je $e^2 = a^2 + b^2$; razlika velja za elipso." },
              { value: a * a + b * b, why: "Si pozabil koreniti?" },
            ]),
            hint: "Iz enačbe razberi $a^2$ in $b^2$. Pri hiperboli velja $e^2 = a^2 + b^2$.",
            data: { given: [conic(a * a, b * b, true)], find: ["e"] },
            formula: "e^2 = a^2 + b^2",
            solution: `$a^2 = ${a * a}$, $b^2 = ${b * b}$\n$e^2 = ${a * a} + ${b * b} = ${z * z}$, $e = ${z}$`,
          };
        }
        const K = r.pick([4, 8, 12, 6, 10, 16, 20, 2, 24, 14]);
        const askF = r.next() < 0.6;
        const ans = askF ? K / 4 : -K / 4;
        return {
          text: askF
            ? `Parabola ima enačbo $y^2 = ${K}x$. Koliko je abscisa njenega gorišča?`
            : `Parabola ima enačbo $y^2 = ${K}x$. Njena vodnica ima enačbo $x = m$. Koliko je $m$?`,
          answer: num(ans, null, [
            { value: askF ? K / 2 : -K / 2, why: "Iz $y^2 = 2px$ sledi $p = \\frac{" + K + "}{2}$; gorišče je pri $\\frac{p}{2}$." },
            { value: askF ? K : -K, why: "Koeficient pri $x$ je $2p$, gorišče pa je pri $\\frac{p}{2}$." },
            { value: -ans, why: "Gorišče in vodnica ležita na nasprotnih straneh temena." },
          ]),
          hint: "Primerjaj z obliko $y^2 = 2px$ in izračunaj $p$.",
          data: { given: [`y^2 = ${K}x`], find: [askF ? "x_F" : "m"] },
          formula: ["y^2 = 2px", "F\\left(\\dfrac{p}{2}, 0\\right),\\ x = -\\dfrac{p}{2}"],
          solution: `$2p = ${K}$, $p = ${tx(K / 2)}$\n${askF ? `$F\\left(${tx(K / 4)}, 0\\right)$, abscisa gorišča je $${tx(K / 4)}$.` : `Vodnica: $x = -\\dfrac{p}{2} = ${tx(-K / 4)}$`}`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const [x, y, z] = r.pick(TRIPLES.slice(0, 4).concat([[6, 8, 10]]));
          const [b, e] = r.next() < 0.5 ? [x, y] : [y, x];
          const a = z;
          const eq = `${b * b}x^2 + ${a * a}y^2 = ${a * a * b * b}`;
          const askE = r.next() < 0.5;
          return {
            text: askE ? `Elipsa ima enačbo $${eq}$. Gorišči sta $F_{1,2}(\\pm e, 0)$. Koliko je $e$?` : `Elipsa ima enačbo $${eq}$. Kolikšna je dolžina njene velike osi?`,
            answer: num(askE ? e : 2 * a, null, askE ? [{ value: Math.sqrt(a * a + b * b), why: "Pri elipsi je $e^2 = a^2 - b^2$." }, { value: a * a - b * b, why: "Koreni $e^2$." }] : [{ value: a, why: "Velika os meri $2a$; $a$ je velika polos." }, { value: 2 * b, why: "Velika os leži v smeri večjega imenovalca." }]),
            hint: "Enačbo deli z desno stranjo, da dobiš obliko $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$.",
            data: { given: [eq], find: [askE ? "e" : "2a"] },
            formula: askE ? ["\\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1", "e^2 = a^2 - b^2"] : ["\\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1", "\\text{velika os} = 2a"],
            solution: `Delimo s $${a * a * b * b}$: $${conic(a * a, b * b)}$\n$a = ${a}$, $b = ${b}$\n${askE ? `$e = \\sqrt{${a * a} - ${b * b}} = ${e}$` : `Velika os: $2a = ${2 * a}$`}`,
          };
        }
        if (t === 1) {
          const a = r.int(1, 7);
          let b;
          do b = r.int(1, 7);
          while (b === a);
          const eq = `${b * b}x^2 - ${a * a}y^2 = ${a * a * b * b}`.replace(/^1x/, "x").replace("- 1y", "- y");
          return {
            text: `Asimptoti hiperbole $${eq}$ imata enačbi $y = \\pm kx$. Koliko je $k$? Vpiši ulomek ali celo število.`,
            answer: frAns(b, a),
            hint: "Zapiši hiperbolo v obliki $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$. Asimptoti sta $y = \\pm\\frac{b}{a}x$.",
            data: { given: [eq], find: ["k"] },
            formula: ["\\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 1", "y = \\pm\\dfrac{b}{a}x"],
            solution: `Delimo s $${a * a * b * b}$: $${conic(a * a, b * b, true)}$\n$a = ${a}$, $b = ${b}$\n$k = \\dfrac{b}{a} = ${ft(b, a)}$`,
          };
        }
        const kind = r.pick(["elipsa", "hiperbola", "parabola", "krožnica"]);
        const p = r.int(2, 9);
        let q;
        do q = r.int(2, 9);
        while (q === p);
        const eq =
          kind === "elipsa" ? `${p}x^2 + ${q}y^2 = ${p * q * r.int(1, 4)}` : kind === "hiperbola" ? r.pick([`${p}x^2 - ${q}y^2 = ${p * q}`, `${q}y^2 - ${p}x^2 = ${p * q * 2}`]) : kind === "parabola" ? r.pick([`y^2 = ${2 * p}x`, `x^2 = -${2 * q}y`, `${p}y^2 - ${q}x = 0`]) : `${p}x^2 + ${p}y^2 = ${p * q * q}`;
        const W = {
          elipsa: "Elipsa ima kvadrata obeh spremenljivk z enakim predznakom in različnima koeficientoma.",
          hiperbola: "Hiperbola ima kvadrata spremenljivk z nasprotnima predznakoma.",
          parabola: "Parabola ima le eno spremenljivko v kvadratu.",
          krožnica: "Krožnica ima kvadrata spremenljivk z enakima koeficientoma.",
        };
        return {
          text: `Katero krivuljo določa enačba $${eq}$?`,
          answer: pickAns(r, kind, ["elipsa", "hiperbola", "parabola", "krožnica"].map((k) => [k, `${W[k]} Preveri, ali to drži za dano enačbo.`])),
          hint: "Poglej, katere spremenljivke so v kvadratu ter kakšna sta predznaka in koeficienta pri kvadratih.",
          data: false,
          formula: ["\\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1", "\\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 1", "y^2 = 2px"],
          solution: `${W[kind]}\nEnačba $${eq}$ določa: ${kind}.`,
        };
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const [x, y, z] = r.pick(TRIPLES.slice(0, 4).concat([[6, 8, 10]]));
        const [b, e] = r.next() < 0.5 ? [x, y] : [y, x];
        const a = z;
        const d1 = r.dec(a - e + 0.2, a + e - 0.2, 1);
        const d2 = 2 * a - d1;
        return {
          text: `Točka $T$ leži na elipsi $${conic(a * a, b * b)}$. Od gorišča $F_1$ je oddaljena $${tx(d1)}$ enot. Kolikšna je njena razdalja do drugega gorišča $F_2$?`,
          answer: num(d2, 1, [
            { value: a - d1, why: "Vsota razdalj do gorišč je $2a$, ne $a$." },
            { value: 2 * b - d1, why: "Vsota razdalj do gorišč je enaka dolžini velike osi $2a$." },
            { value: 2 * e - d1, why: "$2e$ je razdalja med goriščema; vsota razdalj točke do gorišč je $2a$." },
          ]),
          hint: "Elipsa je množica točk, ki imajo stalno vsoto razdalj do gorišč. Koliko je ta vsota?",
          data: { given: [conic(a * a, b * b), `|TF_1| = ${tx(d1)}`], find: ["|TF_2|"] },
          formula: "|TF_1| + |TF_2| = 2a",
          solution: `$a^2 = ${a * a}$, torej $a = ${a}$ in $2a = ${2 * a}$.\n$|TF_2| = 2a - |TF_1| = ${2 * a} - ${tx(d1)} = ${tx(d2)}$`,
        };
      }
      if (t === 1) {
        const a = r.int(3, 8);
        const x0 = r.nonZero(-(a - 1), a - 1);
        const y0 = r.nonZero(-6, 6);
        const [bn, bd] = fr(y0 * y0 * a * a, a * a - x0 * x0);
        return {
          text: `Elipsa $\\dfrac{x^2}{${a * a}} + \\dfrac{y^2}{b^2} = 1$ poteka skozi točko $T(${x0}, ${y0})$. Koliko je $b^2$? Vpiši ulomek ali celo število.`,
          answer: frAns(bn, bd),
          hint: "Vstavi koordinati točke $T$ v enačbo elipse in izrazi $b^2$.",
          data: { given: [`a^2 = ${a * a}`, `T = (${x0}, ${y0})`], find: ["b^2"] },
          formula: "\\dfrac{x_0^2}{a^2} + \\dfrac{y_0^2}{b^2} = 1",
          solution: `$\\dfrac{${x0 * x0}}{${a * a}} + \\dfrac{${y0 * y0}}{b^2} = 1$\n$\\dfrac{${y0 * y0}}{b^2} = ${ft(a * a - x0 * x0, a * a)}$\n$b^2 = ${ft(bn, bd)}$`,
        };
      }
      const x0 = r.int(1, 6);
      const y0 = r.nonZero(-8, 8);
      const [pn, pd] = fr(y0 * y0, 2 * x0);
      return {
        text: `Parabola $y^2 = 2px$ poteka skozi točko $T(${x0}, ${y0})$. Kolikšna je abscisa njenega gorišča? Vpiši ulomek ali celo število.`,
        answer: frAns(y0 * y0, 4 * x0),
        hint: "Vstavi točko $T$ v enačbo parabole, izračunaj $p$, nato gorišče $F\\left(\\frac{p}{2}, 0\\right)$.",
        data: { given: [`T = (${x0}, ${y0})`], find: ["x_F"] },
        formula: ["y^2 = 2px", "F\\left(\\dfrac{p}{2}, 0\\right)"],
        solution: `$${y0 * y0} = 2p \\cdot ${x0}$, $p = ${ft(pn, pd)}$\n$x_F = \\dfrac{p}{2} = ${ft(y0 * y0, 4 * x0)}$`,
      };
    },
  },
  // ---------------- 4. letnik ----------------
  {
    id: P + "zaporedja",
    topics: [T(4, "zaporedja")],
    gen(level, r) {
      // a_n = (a n + b) / (c n + d), imenovalec pozitiven za n ≥ 1
      const seq = () => {
        const a = r.nonZero(-5, 6);
        const c = r.int(1, 4);
        const b = r.int(-7, 9);
        const d = r.int(-c + 1, 8);
        if (a * d - b * c === 0) return null;
        return { a, b, c, d, tex: `\\dfrac{${le(a, b, "n")}}{${le(c, d, "n")}}` };
      };
      if (level === 1) {
        if (r.next() < 0.5) {
          const S = seq();
          if (!S) return null;
          const k = r.int(3, 15);
          return {
            text: `Zaporedje je podano s splošnim členom $a_n = ${S.tex}$. Izračunaj člen $a_{${k}}$ (okrajšan ulomek).`,
            answer: frAns(S.a * k + S.b, S.c * k + S.d),
            hint: `Namesto $n$ vstavi $${k}$.`,
            data: { given: [`a_n = ${S.tex}`], find: [`a_{${k}}`] },
            formula: `a_n = ${S.tex}`,
            solution: `$a_{${k}} = \\dfrac{${S.a} \\cdot ${k} ${sg(S.b)}}{${S.c} \\cdot ${k} ${sg(S.d)}} = \\dfrac{${S.a * k + S.b}}{${S.c * k + S.d}}$\n$a_{${k}} = ${ft(S.a * k + S.b, S.c * k + S.d)}$`,
          };
        }
        const deg2 = r.next() < 0.6;
        const p = r.nonZero(-6, 7);
        const u = r.int(1, 5);
        const numP = deg2 ? [p, r.int(-6, 6), r.int(-9, 9)] : [p, r.int(-9, 9)];
        const denP = deg2 ? [u, r.int(-5, 5), r.int(1, 9)] : [u, r.int(1, 9)];
        const tex = `\\dfrac{${poly(numP, "n")}}{${poly(denP, "n")}}`;
        return {
          text: `Izračunaj limito zaporedja $a_n = ${tex}$ (okrajšan ulomek ali celo število).`,
          answer: frAns(p, u),
          hint: `Števec in imenovalec deli z najvišjo potenco $n${deg2 ? "^2" : ""}$.`,
          data: { given: [`a_n = ${tex}`], find: ["\\lim_{n \\to \\infty} a_n"] },
          formula: "\\lim_{n \\to \\infty} \\dfrac{1}{n} = 0",
          solution: `Delimo z $n${deg2 ? "^2" : ""}$: členi z $\\frac{1}{n}${deg2 ? " in \\frac{1}{n^2}" : ""}$ gredo proti 0.\n$\\lim_{n \\to \\infty} a_n = ${gcd2(p, u) > 1 || u === 1 ? `\\dfrac{${p}}{${u}} = ` : ""}${ft(p, u)}$`,
        };
      }
      if (level === 2) {
        const S = seq();
        if (!S) return null;
        if (r.next() < 0.5) {
          const N = r.int(4, 40);
          const [vn, vd] = fr(S.a * N + S.b, S.c * N + S.d);
          return {
            text: `Kateri člen zaporedja $a_n = ${S.tex}$ je enak $${ft(vn, vd)}$?`,
            answer: num(N, null, []),
            hint: "Zapiši enačbo $a_n = $ dana vrednost, odpravi ulomke in reši linearno enačbo za $n$.",
            data: { given: [`a_n = ${S.tex}`, `a_n = ${ft(vn, vd)}`], find: ["n"] },
            formula: `${S.tex} = ${ft(vn, vd)}`,
            solution: `$${vd}(${le(S.a, S.b, "n")}) = ${vn}(${le(S.c, S.d, "n")})$\n$${tm(vd * S.a - vn * S.c, "n", true)} = ${vn * S.d - vd * S.b}$\n$n = ${N}$`,
          };
        }
        const D = S.a * S.d - S.b * S.c;
        const right = D > 0 ? "naraščajoče" : "padajoče";
        return {
          text: `Ali je zaporedje $a_n = ${S.tex}$ monotono? Izberi pravilno trditev.`,
          answer: pickAns(r, right, [
            [D > 0 ? "padajoče" : "naraščajoče", "Izračunaj razliko $a_{n+1} - a_n$ in preveri njen predznak."],
            ["ni monotono", "Pri zaporedju te oblike ima razlika $a_{n+1} - a_n$ za vse $n$ isti predznak."],
            ["konstantno", "Zaporedje je konstantno le, ko je $a_{n+1} - a_n = 0$ za vse $n$."],
          ]),
          hint: "Izračunaj $a_{n+1} - a_n$ in ga zapiši kot en ulomek. Imenovalec je pozitiven – kaj pa števec?",
          data: { given: [`a_n = ${S.tex}`], find: ["\\text{monotonost}"] },
          formula: "a_{n+1} - a_n > 0 \\Rightarrow \\text{naraščajoče}",
          solution: `$a_{n+1} - a_n = \\dfrac{${D}}{(${le(S.c, S.c + S.d, "n")})(${le(S.c, S.d, "n")})}$\nImenovalec je za $n \\ge 1$ pozitiven, števec je $${D}$.\nZaporedje je ${right}.`,
        };
      }
      if (r.next() < 0.6) {
        let S;
        do S = seq();
        while (!S || S.a * S.d - S.b * S.c === 0);
        const E = r.pick([100, 50, 20, 10, 5]); // ε = E/1000
        const Dabs = Math.abs(S.b * S.c - S.a * S.d);
        let N = 1;
        while (Dabs * 1000 >= S.c * (S.c * N + S.d) * E) N++;
        if (N > 3000 || N < 3) return null;
        const eps = E / 1000;
        return {
          text: `Zaporedje $a_n = ${S.tex}$ ima limito $L$. Koliko členov zaporedja leži zunaj okolice limite s polmerom $\\varepsilon = ${tx(eps)}$?`,
          answer: num(N - 1, null, [{ value: N, why: "To je indeks prvega člena znotraj okolice; zunaj so le členi pred njim." }]),
          hint: "Izračunaj $L$, nato reši neenačbo $|a_n - L| < \\varepsilon$ za $n$.",
          data: { given: [`a_n = ${S.tex}`, `\\varepsilon = ${tx(eps)}`], find: ["\\text{število členov zunaj okolice}"] },
          formula: "|a_n - L| < \\varepsilon",
          solution: `$L = ${ft(S.a, S.c)}$\n$|a_n - L| = \\dfrac{${Dabs}}{${S.c}(${le(S.c, S.d, "n")})} < ${tx(eps)}$\n$${le(S.c, S.d, "n")} > ${tx(roundHalfUp(Dabs / (S.c * eps), 3))}$, torej $n \\ge ${N}$.\nZunaj okolice so členi $a_1, \\ldots, a_{${N - 1}}$: ${N - 1}.`,
        };
      }
      const a = r.nonZero(-9, 9);
      const k = r.pick([1, 4, 9]);
      const sq = Math.sqrt(k);
      const inner = `${k === 1 ? "" : k}n^2 ${sg(a)}n`.replace("+ 1n", "+ n").replace("- 1n", "- n");
      return {
        text: `Izračunaj $\\lim\\limits_{n \\to \\infty} \\left(\\sqrt{${inner}} - ${sq === 1 ? "" : sq}n\\right)$. Vpiši ulomek ali celo število.`,
        answer: frAns(a, 2 * sq),
        hint: "Pomnoži in deli z izrazom $\\sqrt{\\ldots} + " + (sq === 1 ? "" : sq) + "n$ (racionalizacija).",
        data: { given: [`a_n = \\sqrt{${inner}} - ${sq === 1 ? "" : sq}n`], find: ["\\lim_{n \\to \\infty} a_n"] },
        formula: "(\\sqrt{A} - B)(\\sqrt{A} + B) = A - B^2",
        solution: `$\\sqrt{${inner}} - ${sq === 1 ? "" : sq}n = \\dfrac{${a}n}{\\sqrt{${inner}} + ${sq === 1 ? "" : sq}n}$\nDelimo z $n$: $\\dfrac{${a}}{\\sqrt{${k}${sg(a)}/n} + ${sq}} \\to \\dfrac{${a}}{${2 * sq}}$\n$\\lim = ${ft(a, 2 * sq)}$`,
      };
    },
  },
  {
    id: P + "aritmeticno-in-geometrijsko-zaporedje",
    topics: [T(4, "aritmeticno-in-geometrijsko-zaporedje")],
    gen(level, r) {
      const three = (a1, step, geo) => [a1, geo ? a1 * step : a1 + step, geo ? a1 * step * step : a1 + 2 * step];
      const first3 = (a1, step, geo) => three(a1, step, geo).join(", ");
      const giv3 = (a1, step, geo) => three(a1, step, geo).map((v, i) => `a_${i + 1} = ${v}`);
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const a1 = r.int(-10, 20);
          const d = r.nonZero(-5, 7);
          const n = r.int(10, 40);
          const an = a1 + (n - 1) * d;
          return {
            text: `Aritmetično zaporedje se začne s členi $${first3(a1, d)}, \\ldots$ Izračunaj $a_{${n}}$.`,
            answer: num(an, null, [{ value: a1 + n * d, why: "Do $n$-tega člena prišteješ razliko $(n - 1)$-krat." }]),
            hint: "Določi diferenco $d$ in uporabi formulo za splošni člen.",
            data: { given: giv3(a1, d), find: [`a_{${n}}`] },
            formula: "a_n = a_1 + (n - 1)d",
            solution: `$d = ${a1 + d} - ${a1 < 0 ? `(${a1})` : a1} = ${d}$\n$a_{${n}} = ${a1} + ${n - 1} \\cdot ${d < 0 ? `(${d})` : d} = ${an}$`,
          };
        }
        if (t === 1) {
          const a1 = r.pick([1, 2, 3, 5, -2, 4]);
          const q = r.pick([2, 3, -2, -3]);
          const n = r.int(5, 8);
          const an = a1 * q ** (n - 1);
          return {
            text: `Geometrijsko zaporedje se začne s členi $${first3(a1, q, true)}, \\ldots$ Izračunaj $a_{${n}}$.`,
            answer: num(an, null, [{ value: a1 * q ** n, why: "Do $n$-tega člena množiš s kvocientom $(n - 1)$-krat." }, { value: a1 + (n - 1) * q, why: "To je geometrijsko zaporedje: člene množiš s $q$, ne prištevaš." }]),
            hint: "Določi kvocient $q$ in uporabi formulo za splošni člen.",
            data: { given: giv3(a1, q, true), find: [`a_{${n}}`] },
            formula: "a_n = a_1 q^{n-1}",
            solution: `$q = \\dfrac{${a1 * q}}{${a1}} = ${q}$\n$a_{${n}} = ${a1} \\cdot (${q})^{${n - 1}} = ${an}$`,
          };
        }
        const a1 = r.int(-5, 15);
        const d = r.nonZero(-3, 6);
        const n = r.int(10, 30);
        const an = a1 + (n - 1) * d;
        const Sn = (n * (a1 + an)) / 2;
        return {
          text: `Izračunaj vsoto prvih $${n}$ členov aritmetičnega zaporedja $${first3(a1, d)}, \\ldots$`,
          answer: num(Sn, null, [{ value: n * (a1 + an), why: "V formuli za vsoto deliš z 2." }, { value: an, why: "To je zadnji člen, ne vsota." }]),
          hint: "Najprej izračunaj $a_n$, nato vsoto.",
          data: { given: [...giv3(a1, d), `n = ${n}`], find: [`s_{${n}}`] },
          formula: ["a_n = a_1 + (n - 1)d", "s_n = \\dfrac{n}{2}(a_1 + a_n)"],
          solution: `$a_{${n}} = ${a1} + ${n - 1} \\cdot ${d < 0 ? `(${d})` : d} = ${an}$\n$s_{${n}} = \\dfrac{${n}}{2}(${a1} + ${an < 0 ? `(${an})` : an}) = ${Sn}$`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 3);
        if (t === 0) {
          const a1 = r.int(-10, 15);
          const d = r.nonZero(-4, 6);
          const [k, m] = [r.int(2, 6), r.int(8, 14)];
          const n = r.int(20, 50);
          const ak = a1 + (k - 1) * d;
          const am = a1 + (m - 1) * d;
          return {
            text: `V aritmetičnem zaporedju je $a_{${k}} = ${ak}$ in $a_{${m}} = ${am}$. Izračunaj $a_{${n}}$.`,
            answer: num(a1 + (n - 1) * d, null, [{ value: ak + (n - 1) * d, why: `$a_{${k}}$ ni prvi člen; najprej izračunaj $a_1$.` }, { value: a1 + (n - 1) * ((am - ak) / (m - k + 1)), why: `Med $a_{${k}}$ in $a_{${m}}$ je ${m - k} korakov diference.` }]),
            hint: "Zapiši oba podana člena s formulo $a_n = a_1 + (n - 1)d$ in reši sistem za $a_1$ in $d$.",
            data: { given: [`a_{${k}} = ${ak}`, `a_{${m}} = ${am}`], find: [`a_{${n}}`] },
            formula: "a_n = a_1 + (n - 1)d",
            solution: `$d = \\dfrac{${am} - ${ak < 0 ? `(${ak})` : ak}}{${m} - ${k}} = ${d}$\n$a_1 = ${ak} - ${k - 1} \\cdot ${d < 0 ? `(${d})` : d} = ${a1}$\n$a_{${n}} = ${a1} + ${n - 1} \\cdot ${d < 0 ? `(${d})` : d} = ${a1 + (n - 1) * d}$`,
          };
        }
        if (t === 1) {
          const a1 = r.pick([1, 2, 3, -1, 4]);
          const q = r.pick([2, 3, -2]);
          const a2 = a1 * q;
          const a5 = a1 * q ** 4;
          const S6 = (a1 * (q ** 6 - 1)) / (q - 1);
          return {
            text: `V geometrijskem zaporedju je $a_2 = ${a2}$ in $a_5 = ${a5}$. Izračunaj vsoto prvih šestih členov.`,
            answer: num(S6, null, [{ value: a1 * q ** 5, why: "To je šesti člen, ne vsota." }, { value: (a2 * (q ** 6 - 1)) / (q - 1), why: "$a_2$ ni prvi člen; najprej izračunaj $a_1$." }]),
            hint: "Iz $\\dfrac{a_5}{a_2} = q^3$ izračunaj $q$, nato $a_1$.",
            data: { given: [`a_2 = ${a2}`, `a_5 = ${a5}`], find: ["s_6"] },
            formula: ["a_n = a_1 q^{n-1}", "s_n = a_1\\dfrac{q^n - 1}{q - 1}"],
            solution: `$q^3 = \\dfrac{${a5}}{${a2}} = ${q ** 3}$, $q = ${q}$\n$a_1 = \\dfrac{${a2}}{${q}} = ${a1}$\n$s_6 = ${a1} \\cdot \\dfrac{(${q})^6 - 1}{${q} - 1} = ${S6}$`,
          };
        }
        if (t === 2) {
          const s1 = r.int(10, 24);
          const k = r.int(1, 3);
          const R = r.int(12, 30);
          const tot = (R * (2 * s1 + (R - 1) * k)) / 2;
          const place = r.pick(["V gledališču", "Na tribuni stadiona", "V predavalnici", "V amfiteatru"]);
          return {
            text: `${place} je v prvi vrsti $${s1}$ sedežev, v vsaki naslednji pa $${k}$ ${k === 1 ? "sedež" : k === 2 ? "sedeža" : "sedeži"} več. Vrst je $${R}$. Koliko je vseh sedežev?`,
            answer: num(tot, null, [{ value: s1 + (R - 1) * k, why: "To je število sedežev v zadnji vrsti, ne vseh skupaj." }, { value: R * s1, why: "Si upošteval, da ima vsaka naslednja vrsta več sedežev?" }]),
            hint: "Števila sedežev po vrstah tvorijo aritmetično zaporedje. Iščeš vsoto njegovih členov.",
            data: { given: [`a_1 = ${s1}`, `d = ${k}`, `n = ${R}`], find: [`s_{${R}}`] },
            formula: "s_n = \\dfrac{n}{2}\\big(2a_1 + (n - 1)d\\big)",
            solution: `$a_1 = ${s1}$, $d = ${k}$, $n = ${R}$\n$s_{${R}} = \\dfrac{${R}}{2}(2 \\cdot ${s1} + ${R - 1} \\cdot ${k}) = ${tot}$`,
          };
        }
        const N0 = r.pick([200, 300, 500, 150, 800]);
        const q = r.pick([2, 3]);
        const h = r.int(4, 8);
        const unitT = r.pick([["uro", "urah"], ["dan", "dneh"]]);
        return {
          text: `Število bakterij v kulturi se vsak${unitT[0] === "uro" ? "o uro" : " dan"} ${q === 2 ? "podvoji" : "potroji"}. Na začetku jih je $${N0}$. Koliko bakterij je po $${h}$ ${unitT[1]}?`,
          answer: num(N0 * q ** h, null, [{ value: N0 * q ** (h - 1), why: "Začetno stanje je pred prvo rastjo; po $h$ obdobjih množiš s $q$ natanko $h$-krat." }, { value: N0 * q * h, why: "Rast je geometrijska (množenje), ne linearna." }]),
          hint: "Števila bakterij tvorijo geometrijsko zaporedje. Kolikokrat se število pomnoži?",
          data: { given: [`N_0 = ${N0}`, `t = ${h}`], find: [`N_{${h}}`] },
          formula: "N_t = N_0 \\cdot q^t",
          solution: `$q = ${q}$, množimo ${h}-krat.\n$N_{${h}} = ${N0} \\cdot ${q}^{${h}} = ${N0 * q ** h}$`,
        };
      }
      if (r.next() < 0.5) {
        const act = r.pick([["teče", "km"], ["prepešači", "km"], ["prebere", "strani"]]);
        const pages = act[1] === "strani";
        const a1 = pages ? r.int(5, 20) : r.int(2, 8);
        const d = pages ? r.int(2, 5) : r.pick([0.5, 1, 1.5, 2]);
        const X = pages ? r.int(300, 1200) : r.int(80, 400);
        let n = 1;
        let S = a1;
        while (S <= X) {
          n++;
          S += a1 + (n - 1) * d;
        }
        const who = name(r);
        const unit = act[1] === "km" ? "\\mathrm{km}" : "\\text{ strani}";
        return {
          text: `${who} prvi dan ${act[0]} $${tx(a1)}${act[1] === "km" ? "\\ " : ""}${unit}$, vsak naslednji dan pa $${tx(d)}${act[1] === "km" ? "\\ " : ""}${unit}$ več. Po koliko dneh skupna količina prvič preseže $${X}${act[1] === "km" ? "\\ " : ""}${unit}$?`,
          answer: num(n, null, [{ value: n - 1, why: `Po ${n - 1} dneh vsota še ne preseže meje; preveri neenačbo.` }]),
          hint: "Reši neenačbo $s_n > X$ (kvadratna neenačba za $n$) in vzemi najmanjše naravno število.",
          data: { given: [`a_1 = ${tx(a1)}`, `d = ${tx(d)}`, `X = ${X}`], find: ["n"] },
          formula: "s_n = \\dfrac{n}{2}\\big(2a_1 + (n - 1)d\\big) > X",
          solution: `$\\dfrac{n}{2}(2 \\cdot ${tx(a1)} + (n - 1) \\cdot ${tx(d)}) > ${X}$\n$s_{${n - 1}} = ${tx(S - (a1 + (n - 1) * d))}$, $s_{${n}} = ${tx(S)}$\nNajmanjši $n$ je $${n}$.`,
        };
      }
      const A0 = r.pick([100, 200, 400, 500, 800]);
      const p = r.pick([10, 15, 20, 25, 30]);
      const X = r.pick([10, 20, 25, 50, 5]);
      if (X >= A0) return null;
      const q = 1 - p / 100;
      let n = 0;
      while (A0 * q ** n >= X) n++;
      let nLin = 0;
      while (A0 * (1 - (nLin * p) / 100) >= X && nLin < 100) nLin++;
      const thing = r.pick([["V krvi je", "mg zdravila", "mg"], ["V posodi je", "g radioaktivne snovi", "g"], ["Na disku je", "MB začasnih datotek", "MB"]]);
      return {
        text: `${thing[0]} $${A0}$ ${thing[1].replace(thing[2], `$\\mathrm{${thing[2]}}$`).replace("$$", "")}. Vsako uro se količina zmanjša za $${p}\\ \\%$. Po koliko celih urah bo prvič manjša od $${X}\\ \\mathrm{${thing[2]}}$?`.replace(`$${A0}$ $\\mathrm{${thing[2]}}$`, `$${A0}\\ \\mathrm{${thing[2]}}$`),
        answer: num(n, null, [{ value: n - 1, why: "Po tem času je količina še večja od meje; vzemi naslednje celo število." }, { value: nLin, why: "Zmanjšanje za odstotek pomeni množenje s $q$ vsako uro, ne odštevanje enake količine." }]),
        hint: `Količine tvorijo geometrijsko zaporedje s kvocientom $q = ${tx(q)}$. Reši neenačbo z logaritmom.`,
        data: { given: [`A_0 = ${A0}\\ \\mathrm{${thing[2]}}`, `p = ${p}\\ \\%`, `X = ${X}\\ \\mathrm{${thing[2]}}`], find: ["n"] },
        formula: ["A_n = A_0 q^n", "n > \\dfrac{\\log(X / A_0)}{\\log q}"],
        solution: `$q = 1 - ${tx(p / 100)} = ${tx(q)}$\n$${A0} \\cdot ${tx(q)}^n < ${X}$ $\\Rightarrow$ $n > \\dfrac{\\log(${X}/${A0})}{\\log ${tx(q)}} \\approx ${tx(Math.log(X / A0) / Math.log(q), 2)}$\nNajmanjše celo število: $n = ${n}$.`,
      };
    },
  },
  {
    id: P + "geometrijska-vrsta",
    topics: [T(4, "geometrijska-vrsta")],
    gen(level, r) {
      const QS = [[1, 2], [1, 3], [2, 3], [-1, 2], [1, 4], [3, 4], [-1, 3], [2, 5], [-2, 3], [3, 5]];
      if (level === 1) {
        const [qn, qd] = r.pick(QS);
        const a1 = r.pick([1, 2, 3, 4, -2, 5]) * qd * qd;
        const terms = [a1, (a1 * qn) / qd, (a1 * qn * qn) / (qd * qd)];
        const series = `${terms[0]} ${sg(terms[1])} ${sg(terms[2])} ${a1 * qn ** 3 < 0 ? "-" : "+"} \\ldots`;
        return {
          text: `Izračunaj vsoto neskončne geometrijske vrste $${series}$ (okrajšan ulomek ali celo število).`,
          answer: frAns(a1 * qd, qd - qn),
          hint: "Določi prvi člen in kvocient. Vrsta je konvergentna, ker je $|q| < 1$.",
          data: { given: [`a_1 = ${a1}`, `\\text{vrsta: } ${series.replace(" \\ldots", "").replace(/ [+-]$/, "")} = s`], find: ["s"] },
          formula: "s = \\dfrac{a_1}{1 - q},\\ |q| < 1",
          solution: `$a_1 = ${a1}$, $q = \\dfrac{${terms[1]}}{${a1}} = ${ft(qn, qd)}$\n$s = \\dfrac{${a1}}{1 - \\left(${ft(qn, qd)}\\right)} = \\dfrac{${a1}}{${ft(qd - qn, qd)}} = ${ft(a1 * qd, qd - qn)}$`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const mixed = r.next() < 0.5;
          let tex, n, d, steps;
          if (mixed) {
            const a = r.int(1, 9);
            let b;
            do b = r.int(1, 9);
            while (b === a);
            tex = `0{,}${a}\\overline{${b}}`;
            [n, d] = [9 * a + b, 90];
            steps = `$${tex} = \\dfrac{${a}}{10} + \\dfrac{${b}}{100} + \\dfrac{${b}}{1000} + \\ldots$\nVrsta od drugega člena: $a_1 = \\dfrac{${b}}{100}$, $q = \\dfrac{1}{10}$, vsota $\\dfrac{${b}}{90}$.\n$${tex} = \\dfrac{${a}}{10} + \\dfrac{${b}}{90} = ${ft(n, d)}$`;
          } else {
            let d1, d2;
            do {
              d1 = r.int(0, 9);
              d2 = r.int(1, 9);
            } while (d1 === d2);
            tex = `0{,}\\overline{${d1}${d2}}`;
            [n, d] = [10 * d1 + d2, 99];
            steps = `$${tex} = \\dfrac{${10 * d1 + d2}}{100} + \\dfrac{${10 * d1 + d2}}{10000} + \\ldots$\n$a_1 = \\dfrac{${10 * d1 + d2}}{100}$, $q = \\dfrac{1}{100}$\n$s = \\dfrac{${10 * d1 + d2}/100}{1 - 1/100} = \\dfrac{${10 * d1 + d2}}{99} = ${ft(n, d)}$`;
          }
          return {
            text: `Periodično decimalno število $${tex}$ zapiši kot vsoto geometrijske vrste in ga pretvori v okrajšan ulomek.`,
            answer: frAns(n, d),
            hint: "Razpiši število kot vsoto: vsaka ponovitev periode je naslednji člen geometrijske vrste.",
            data: { given: [`x = ${tex}`], find: ["x \\text{ kot ulomek}"] },
            formula: "s = \\dfrac{a_1}{1 - q}",
            solution: steps,
          };
        }
        const [qn, qd] = r.pick(QS.filter((q) => q[0] > 0));
        const m = r.int(1, 6);
        const a1 = (qd - qn) * m;
        const S = qd * m;
        if (t === 1) {
          return {
            text: `Vsota neskončne geometrijske vrste je $${S}$, njen prvi člen pa $${a1}$. Kolikšen je kvocient? Vpiši ulomek.`,
            answer: frAns(qn, qd),
            hint: "V formulo za vsoto vstavi znani količini in izrazi $q$.",
            data: { given: [`s = ${S}`, `a_1 = ${a1}`], find: ["q"] },
            formula: "s = \\dfrac{a_1}{1 - q}",
            solution: `$${S} = \\dfrac{${a1}}{1 - q}$\n$1 - q = ${ft(a1, S)}$\n$q = ${ft(qn, qd)}$`,
          };
        }
        return {
          text: `Neskončna geometrijska vrsta ima kvocient $${ft(qn, qd)}$ in vsoto $${S}$. Kolikšen je njen prvi člen?`,
          answer: num(a1, null, [{ value: S * (1 + qn / qd), why: "Iz $s = \\frac{a_1}{1 - q}$ sledi $a_1 = s(1 - q)$." }, { value: S / (1 - qn / qd), why: "Izraziti moraš $a_1$: pomnoži, ne deli." }]),
          hint: "Iz formule za vsoto izrazi $a_1$.",
          data: { given: [`q = ${ft(qn, qd)}`, `s = ${S}`], find: ["a_1"] },
          formula: "s = \\dfrac{a_1}{1 - q}",
          solution: `$a_1 = s(1 - q) = ${S} \\cdot \\left(1 - ${ft(qn, qd)}\\right)$\n$a_1 = ${S} \\cdot ${ft(qd - qn, qd)} = ${a1}$`,
        };
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const h = r.pick([1, 1.2, 1.5, 2, 2.5, 3, 4, 0.8]);
        const q = r.pick([0.5, 0.6, 0.75, 0.8, 0.4, 0.7]);
        const tot = (h * (1 + q)) / (1 - q);
        const obj = r.pick(["Žoga", "Teniška žogica", "Gumijasta kroglica"]);
        return {
          text: `${obj} pade z višine $${tx(h)}\\ \\mathrm{m}$. Po vsakem odboju se dvigne do $${tx(q * 100)}\\ \\%$ prejšnje višine. Kolikšno pot opravi, dokler se ne umiri? Zaokroži na dve decimalki.`,
          answer: num(tot, 2, [
            { value: h / (1 - q), why: "Po vsakem odboju gre žoga gor in nato spet dol: te poti štej dvakrat." },
            { value: (2 * h) / (1 - q), why: "Prvi padec je le enkrat (samo navzdol)." },
          ], "m"),
          hint: "Pot = prvi padec + 2-krat (vsota vseh višin po odbojih). Višine po odbojih tvorijo geometrijsko vrsto.",
          data: { given: [`h = ${tx(h)}\\ \\mathrm{m}`, `q = ${tx(q * 100)}\\ \\%`], find: ["s"] },
          formula: ["s = h + 2 \\cdot \\dfrac{hq}{1 - q}", "\\text{vsota} = \\dfrac{a_1}{1 - q}"],
          solution: `Višine po odbojih: $${tx(h * q)}, ${tx(h * q * q)}, \\ldots$ z vsoto $\\dfrac{${tx(h * q)}}{1 - ${tx(q)}} = ${tx((h * q) / (1 - q), 3)}\\ \\mathrm{m}$\n$s = ${tx(h)} + 2 \\cdot ${tx((h * q) / (1 - q), 3)}$\n$s ${Math.abs(tot - roundHalfUp(tot, 2)) < 1e-9 ? "=" : "\\approx"} ${tx(tot, 2)}\\ \\mathrm{m}$`,
        };
      }
      if (t === 1) {
        const a = r.int(2, 12);
        const kind = r.pick(["pl", "ob", "tri"]);
        if (kind === "pl") {
          return {
            text: `Kvadratu s stranico $${a}\\ \\mathrm{cm}$ včrtamo kvadrat tako, da povežemo razpolovišča stranic, temu spet in tako naprej v neskončnost. Kolikšna je vsota ploščin vseh kvadratov?`,
            answer: num(2 * a * a, null, [{ value: (a * a) / (1 - Math.SQRT1_2), why: "Stranice se zmanjšujejo s faktorjem $\\frac{\\sqrt{2}}{2}$, ploščine pa s kvadratom tega faktorja." }, { value: (4 / 3) * a * a, why: "Nova ploščina je polovica prejšnje, ne četrtina." }], "cm^2"),
            hint: "Kolikšna je ploščina drugega kvadrata v primerjavi s prvim? To je kvocient vrste.",
            data: { given: [`a = ${a}\\ \\mathrm{cm}`], find: ["S"] },
            formula: ["q = \\dfrac{S_2}{S_1}", "S = \\dfrac{S_1}{1 - q}"],
            solution: `Stranica včrtanega kvadrata je $\\dfrac{a\\sqrt{2}}{2}$, ploščina $\\dfrac{a^2}{2}$, torej $q = \\dfrac{1}{2}$.\n$S = \\dfrac{${a * a}}{1 - \\frac{1}{2}} = ${2 * a * a}\\ \\mathrm{cm^2}$`,
          };
        }
        if (kind === "ob") {
          const v = (4 * a) / (1 - Math.SQRT1_2);
          return {
            text: `Kvadratu s stranico $${a}\\ \\mathrm{cm}$ včrtamo kvadrat tako, da povežemo razpolovišča stranic, temu spet in tako naprej v neskončnost. Kolikšna je vsota obsegov vseh kvadratov? Zaokroži na dve decimalki.`,
            answer: num(v, 2, [{ value: 8 * a, why: "Obsegi se zmanjšujejo s faktorjem $\\frac{\\sqrt{2}}{2}$, ne $\\frac{1}{2}$ (to velja za ploščine)." }, { value: 4 * a / (1 - 0.5) / 2, why: "Preveri kvocient: razmerje stranic dveh zaporednih kvadratov." }], "cm"),
            hint: "Kolikšna je stranica drugega kvadrata? Razmerje stranic je kvocient vrste.",
            data: { given: [`a = ${a}\\ \\mathrm{cm}`], find: ["o"] },
            formula: ["q = \\dfrac{\\sqrt{2}}{2}", "o = \\dfrac{o_1}{1 - q}"],
            solution: `Stranica včrtanega kvadrata je $\\dfrac{a\\sqrt{2}}{2}$, zato je $q = \\dfrac{\\sqrt{2}}{2}$.\n$o = \\dfrac{${4 * a}}{1 - \\frac{\\sqrt{2}}{2}}$\n$o \\approx ${tx(v, 2)}\\ \\mathrm{cm}$`,
          };
        }
        const S1 = (Math.sqrt(3) / 4) * a * a;
        const v = S1 / (1 - 0.25);
        return {
          text: `Enakostraničnemu trikotniku s stranico $${a}\\ \\mathrm{cm}$ včrtamo trikotnik z oglišči v razpoloviščih stranic, temu spet in tako naprej v neskončnost. Kolikšna je vsota ploščin vseh trikotnikov? Zaokroži na dve decimalki.`,
          answer: num(v, 2, [{ value: S1 / 0.5, why: "Stranica se razpolovi, ploščina pa se zmanjša na četrtino." }, { value: (a * a) / 0.75, why: "Ploščina enakostraničnega trikotnika je $\\frac{a^2\\sqrt{3}}{4}$." }], "cm^2"),
          hint: "Srednjice razdelijo trikotnik na 4 skladne trikotnike. Kolikšen je torej kvocient ploščin?",
          data: { given: [`a = ${a}\\ \\mathrm{cm}`], find: ["S"] },
          formula: ["S_1 = \\dfrac{a^2\\sqrt{3}}{4}", "S = \\dfrac{S_1}{1 - q}"],
          solution: `$S_1 = \\dfrac{${a * a}\\sqrt{3}}{4} \\approx ${tx(S1, 3)}\\ \\mathrm{cm^2}$, $q = \\dfrac{1}{4}$\n$S = \\dfrac{S_1}{1 - \\frac{1}{4}} = \\dfrac{4}{3}S_1$\n$S \\approx ${tx(v, 2)}\\ \\mathrm{cm^2}$`,
        };
      }
      const k = r.int(2, 5);
      const [sn, sd] = r.pick([[2, 1], [3, 1], [3, 2], [4, 3], [5, 2], [2, 3], [4, 5], [5, 4], [6, 5]]);
      // 1/(1 - x/k) = S  →  x = k(S - 1)/S
      const [xn, xd] = fr(k * (sn - sd), sn);
      return {
        text: `Za katero število $x$ je vsota vrste $1 + \\dfrac{x}{${k}} + \\dfrac{x^2}{${k * k}} + \\dfrac{x^3}{${k ** 3}} + \\ldots$ enaka $${ft(sn, sd)}$? Vpiši ulomek ali celo število.`,
        answer: frAns(xn, xd),
        hint: "Kvocient vrste je $\\frac{x}{" + k + "}$. Zapiši vsoto in reši enačbo; preveri še pogoj $|q| < 1$.",
        data: { given: [`a_1 = 1`, `q = \\dfrac{x}{${k}}`, `s = ${ft(sn, sd)}`], find: ["x"] },
        formula: "s = \\dfrac{a_1}{1 - q},\\ |q| < 1",
        solution: `$\\dfrac{1}{1 - \\frac{x}{${k}}} = ${ft(sn, sd)}$\n$1 - \\dfrac{x}{${k}} = ${ft(sd, sn)}$, torej $x = ${k} \\cdot ${ft(sn - sd, sn)} = ${ft(xn, xd)}$\nPreverimo: $|q| = \\left|${ft(xn, xd * k)}\\right| < 1$.`,
      };
    },
  },
  {
    id: P + "obrestni-racun",
    topics: [T(4, "obrestni-racun")],
    gen(level, r) {
      const G = r.int(5, 200) * 100;
      const p = r.pick([1.5, 2, 2.5, 3, 3.5, 4, 1.8, 2.2, 4.5]);
      const who = name(r);
      const E = "\\ \\text{€}";
      const vl = g(who, "vložil", "vložila");
      const pTex = `${tx(p)}\\ \\%`;
      const ap = (x) => (Math.abs(x - roundHalfUp(x, 2)) < 1e-9 ? "=" : "\\approx");
      if (level === 1) {
        if (r.next() < 0.5) {
          const months = r.next() < 0.4;
          const t = months ? r.pick([3, 4, 6, 8, 9, 10]) : r.int(2, 6);
          const tl = months ? t / 12 : t;
          const o = (G * p * tl) / 100;
          return {
            text: `${who} je ${vl} $${G}$ € pri navadnem obrestovanju z letno obrestno mero $${pTex}$. Koliko obresti dobi v ${t} ${months ? "mesecih" : "letih"}? Zaokroži na cente.`,
            answer: eur(o, [months ? { value: (G * p * t) / 100, why: "Čas moraš izraziti v letih: mesece deli z 12." } : null, { value: G * ((1 + p / 100) ** tl - 1), why: "To bi bile obresti pri obrestnem obrestovanju; tu je navadno." }]),
            hint: "Pri navadnem obrestovanju so obresti vsako leto enake: $o = \\frac{G \\cdot p \\cdot t}{100}$ (čas v letih).",
            data: { given: [`G = ${G}${E}`, `p = ${pTex}`, `t = ${t}\\ \\text{${months ? "mesecev" : "let"}}`], find: ["o"] },
            formula: "o = \\dfrac{G \\cdot p \\cdot t}{100}",
            solution: `${months ? `$t = \\dfrac{${t}}{12}\\ \\text{leta}$\n` : ""}$o = \\dfrac{${G} \\cdot ${tx(p)} \\cdot ${months ? `\\frac{${t}}{12}` : t}}{100} ${ap(o)} ${tx(o, 2)}${E}$`,
          };
        }
        const n = r.int(2, 10);
        const Gn = G * (1 + p / 100) ** n;
        return {
          text: `${who} je ${vl} $${G}$ € za $${n}$ let pri letnem obrestnem obrestovanju z obrestno mero $${pTex}$. Koliko denarja bo ${g(who, "imel", "imela")} na koncu? Zaokroži na cente.`,
          answer: eur(Gn, [{ value: G * (1 + (p * n) / 100), why: "To je rezultat navadnega obrestovanja; pri obrestnem se obresti obrestujejo naprej." }, { value: Gn - G, why: "To so le obresti; vprašanje je po končnem stanju." }]),
          hint: "Pri obrestnem obrestovanju vsako leto glavnico pomnožiš z obrestovalnim faktorjem $r = 1 + \\frac{p}{100}$.",
          data: { given: [`G_0 = ${G}${E}`, `p = ${pTex}`, `n = ${n}`], find: ["G_n"] },
          formula: "G_n = G_0 \\left(1 + \\dfrac{p}{100}\\right)^n",
          solution: `$r = 1 + \\dfrac{${tx(p)}}{100} = ${tx(1 + p / 100)}$\n$G_{${n}} = ${G} \\cdot ${tx(1 + p / 100)}^{${n}} ${ap(Gn)} ${tx(Gn, 2)}${E}$`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        const n = r.int(2, 8);
        if (t === 0) {
          const m = r.pick([12, 4]);
          const Gn = G * (1 + p / (100 * m)) ** (m * n);
          return {
            text: `Banka obrestuje vlogo ${m === 12 ? "mesečno" : "četrtletno"} ($${m}$-krat na leto) z relativno obrestno mero, letna obrestna mera je $${pTex}$. Koliko bo na računu čez $${n}$ let, če danes vložimo $${G}$ €? Zaokroži na cente.`,
            answer: eur(Gn, [{ value: G * (1 + p / 100) ** n, why: `Obrestuje se ${m === 12 ? "vsak mesec" : "vsako četrtletje"}, ne enkrat na leto.` }, { value: G * (1 + p / 100) ** (m * n), why: `Relativna obrestna mera za eno obdobje je $\\frac{p}{${m}}$.` }]),
            hint: `V enem letu je ${m} obrestovalnih obdobij; obrestna mera za eno obdobje je $\\frac{p}{${m}}$.`,
            data: { given: [`G_0 = ${G}${E}`, `p = ${pTex}`, `n = ${n}`, `m = ${m}`], find: ["G_n"] },
            formula: "G_n = G_0 \\left(1 + \\dfrac{p}{100m}\\right)^{mn}",
            solution: `$r = 1 + \\dfrac{${tx(p)}}{100 \\cdot ${m}} ${ap(1 + p / (100 * m))} ${tx(roundHalfUp(1 + p / (100 * m), 6))}$\nŠtevilo obdobij: $${m} \\cdot ${n} = ${m * n}$\n$G_{${n}} = ${G} \\cdot r^{${m * n}} ${ap(Gn)} ${tx(Gn, 2)}${E}$`,
          };
        }
        if (t === 1) {
          const X = r.int(50, 300) * 100;
          const G0 = X / (1 + p / 100) ** n;
          return {
            text: `Koliko denarja mora ${who} danes vložiti pri letnem obrestnem obrestovanju z obrestno mero $${pTex}$, da bo čez $${n}$ let ${g(who, "imel", "imela")} $${X}$ €? Zaokroži na cente.`,
            answer: eur(G0, [{ value: X * (1 - p / 100) ** n, why: "Za vrnitev v preteklost deliš z $r^n$; množenje z $(1 - \\frac{p}{100})^n$ ni enako." }, { value: X * (1 - (p * n) / 100), why: "Pri obrestnem obrestovanju se obresti obrestujejo; deli z $r^n$." }]),
            hint: "Iz formule za obrestno obrestovanje izrazi začetno glavnico $G_0$.",
            data: { given: [`G_n = ${X}${E}`, `p = ${pTex}`, `n = ${n}`], find: ["G_0"] },
            formula: "G_0 = \\dfrac{G_n}{\\left(1 + \\frac{p}{100}\\right)^n}",
            solution: `$r = ${tx(1 + p / 100)}$\n$G_0 = \\dfrac{${X}}{${tx(1 + p / 100)}^{${n}}} ${ap(G0)} ${tx(G0, 2)}${E}$`,
          };
        }
        const comp = G * (1 + p / 100) ** n;
        const simp = G * (1 + (p * n) / 100);
        return {
          text: `${who} primerja ponudbi za $${G}$ € za $${n}$ let pri letni obrestni meri $${pTex}$: navadno ali obrestno obrestovanje. Za koliko evrov je končno stanje pri obrestnem obrestovanju večje? Zaokroži na cente.`,
          answer: eur(comp - simp, [{ value: comp - G, why: "To so vse obresti pri obrestnem obrestovanju; izračunaj še navadno in odštej." }, { value: simp - G, why: "To so obresti pri navadnem obrestovanju; iščeš razliko." }]),
          hint: "Izračunaj končno stanje pri obeh vrstah obrestovanja in ju odštej.",
          data: { given: [`G = ${G}${E}`, `p = ${pTex}`, `n = ${n}`], find: ["\\Delta G"] },
          formula: ["G_n = G\\left(1 + \\dfrac{p}{100}\\right)^n", "G_n' = G\\left(1 + \\dfrac{p \\cdot n}{100}\\right)"],
          solution: `Obrestno: $G_{${n}} = ${G} \\cdot ${tx(1 + p / 100)}^{${n}} ${ap(comp)} ${tx(comp, 2)}${E}$\nNavadno: $G_{${n}}' = ${G} \\cdot ${tx(1 + (p * n) / 100)} = ${tx(simp, 2)}${E}$\nRazlika: $${ap(comp - simp)} ${tx(comp - simp, 2)}${E}$`,
        };
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const f = r.pick([1.2, 1.25, 1.5, 2, 1.4, 1.3]);
        const X = roundHalfUp(G * f, 0);
        let n = 0;
        while (G * (1 + p / 100) ** n <= X) n++;
        const nSimple = Math.floor(((X / G - 1) * 100) / p) + 1;
        return {
          text: `${who} vloži $${G}$ € pri letnem obrestnem obrestovanju z obrestno mero $${pTex}$. Po koliko celih letih bo stanje prvič večje od $${X}$ €?`,
          answer: num(n, null, [{ value: n - 1, why: "Po tem številu let stanje še ni večje od cilja; vzemi naslednje celo število." }, { value: nSimple, why: "To bi veljalo za navadno obrestovanje; tu se obresti obrestujejo." }]),
          hint: "Reši neenačbo $G_0 r^n > G_n$ z logaritmiranjem, nato zaokroži navzgor.",
          data: { given: [`G_0 = ${G}${E}`, `p = ${pTex}`, `G_n = ${X}${E}`], find: ["n"] },
          formula: ["G_0 r^n > G_n", "n > \\dfrac{\\log(G_n/G_0)}{\\log r}"],
          solution: `$${tx(1 + p / 100)}^n > \\dfrac{${X}}{${G}}$\n$n > \\dfrac{\\log(${X}/${G})}{\\log ${tx(1 + p / 100)}} \\approx ${tx(Math.log(X / G) / Math.log(1 + p / 100), 2)}$\nNajmanjše celo število let: $n = ${n}$.`,
        };
      }
      if (t === 1) {
        const n = r.int(3, 10);
        const pt = r.pick([1.2, 1.7, 2.3, 2.8, 3.1, 3.6, 4.2]);
        const Gn = roundHalfUp(G * (1 + pt / 100) ** n, 2);
        const pp = 100 * ((Gn / G) ** (1 / n) - 1);
        return {
          text: `Glavnica $${G}$ € je v $${n}$ letih pri letnem obrestnem obrestovanju narasla na $${tx(Gn, 2)}$ €. Kolikšna je bila letna obrestna mera v odstotkih? Zaokroži na dve decimalki.`,
          answer: num(pp, 2, [{ value: ((Gn / G - 1) / n) * 100, why: "Deljenje skupne rasti s številom let velja za navadno obrestovanje; tu koreniš." }, { value: 100 * (Gn / G) ** (1 / n), why: "Od obrestovalnega faktorja $r$ odštej 1, preden ga pretvoriš v odstotke." }], "%"),
          hint: "Iz $G_n = G_0 r^n$ izrazi $r$ (n-ti koren), nato $p = 100(r - 1)$.",
          data: { given: [`G_0 = ${G}${E}`, `G_n = ${tx(Gn, 2)}${E}`, `n = ${n}`], find: ["p"] },
          formula: ["r = \\sqrt[n]{\\dfrac{G_n}{G_0}}", "p = 100(r - 1)"],
          solution: `$r = \\sqrt[${n}]{\\dfrac{${tx(Gn, 2)}}{${G}}} \\approx ${tx(roundHalfUp(1 + pp / 100, 6))}$\n$p = 100(r - 1) \\approx ${tx(pp, 2)}\\ \\%$`,
        };
      }
      const Vd = r.int(5, 40) * 50;
      const n = r.int(3, 10);
      const rr = 1 + p / 100;
      const S = (Vd * rr * (rr ** n - 1)) / (rr - 1);
      return {
        text: `${who} na začetku vsakega leta vloži $${Vd}$ € pri letnem obrestnem obrestovanju z obrestno mero $${pTex}$. Koliko bo na računu ob koncu ${n}. leta? Zaokroži na cente.`,
        answer: eur(S, [{ value: (Vd * (rr ** n - 1)) / (rr - 1), why: "Vloge so na začetku leta, zato se tudi zadnja obrestuje eno leto." }, { value: Vd * n, why: "Upoštevaj obresti: vsaka vloga se obrestuje različno dolgo." }]),
        hint: "Prva vloga se obrestuje $n$ let, zadnja eno leto. Stanja tvorijo geometrijsko zaporedje – seštej ga.",
        data: { given: [`V = ${Vd}${E}`, `p = ${pTex}`, `n = ${n}`], find: ["G_n"] },
        formula: "G_n = V r \\dfrac{r^n - 1}{r - 1}",
        solution: `$r = ${tx(rr)}$\n$G_{${n}} = ${Vd} \\cdot ${tx(rr)} + ${Vd} \\cdot ${tx(rr)}^2 + \\ldots + ${Vd} \\cdot ${tx(rr)}^{${n}}$\n$G_{${n}} = ${Vd} \\cdot ${tx(rr)} \\cdot \\dfrac{${tx(rr)}^{${n}} - 1}{${tx(rr)} - 1} ${ap(S)} ${tx(S, 2)}${E}$`,
      };
    },
  },
  {
    id: P + "limita-in-zveznost-funkcije",
    topics: [T(4, "limita-in-zveznost-funkcije")],
    gen(level, r) {
      const twoRoots = () => {
        const a = r.nonZero(-5, 5);
        let s;
        do s = r.int(-5, 5);
        while (s === a);
        return [a, s];
      };
      if (level === 1) {
        if (r.next() < 0.55) {
          const [a, s] = twoRoots();
          const nu = fromRoots([a, s]);
          return {
            text: `Izračunaj $\\lim\\limits_{x \\to ${a}} \\dfrac{${poly(nu)}}{${lin(a).replace(/^\(|\)$/g, "")}}$.`,
            answer: num(a - s, null, [{ value: 0, why: "Izraz $\\frac{0}{0}$ je nedoločen; najprej razstavi števec in okrajšaj." }, { value: a + s, why: "Pazi na predznak drugega faktorja števca." }]),
            hint: "Vstavljanje da $\\frac{0}{0}$. Razstavi števec: eden od faktorjev je enak imenovalcu.",
            data: { given: [`f(x) = \\dfrac{${poly(nu)}}{${lin(a).replace(/^\(|\)$/g, "")}}`], find: [`\\lim_{x \\to ${a}} f(x)`] },
            formula: "x^2 + bx + c = (x - x_1)(x - x_2)",
            solution: `$${poly(nu)} = ${lin(a)}${lin(s)}$\n$\\lim\\limits_{x \\to ${a}} ${lin(s).replace(/^\(|\)$/g, "")} = ${a} ${sg(-s)} = ${a - s}$`,
          };
        }
        const p = r.nonZero(-6, 6);
        const u = r.int(1, 5);
        const nu = [p, r.int(-8, 8), r.int(-8, 8)];
        const de = [u, r.int(-8, 8), r.nonZero(-8, 8)];
        return {
          text: `Izračunaj $\\lim\\limits_{x \\to \\infty} \\dfrac{${poly(nu)}}{${poly(de)}}$ (ulomek ali celo število).`,
          answer: frAns(p, u),
          hint: "Števec in imenovalec deli z najvišjo potenco $x^2$.",
          data: { given: [`f(x) = \\dfrac{${poly(nu)}}{${poly(de)}}`], find: ["\\lim_{x \\to \\infty} f(x)"] },
          formula: "\\lim_{x \\to \\infty} \\dfrac{1}{x^k} = 0",
          solution: `Delimo z $x^2$; členi z $\\frac{1}{x}$ in $\\frac{1}{x^2}$ gredo proti 0.\n$\\lim = ${gcd2(p, u) > 1 || u === 1 ? `\\dfrac{${p}}{${u}} = ` : ""}${ft(p, u)}$`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const a = r.nonZero(-4, 4);
          let s, u;
          do {
            s = r.int(-5, 5);
            u = r.int(-5, 5);
          } while (s === a || u === a || s === u);
          const nu = fromRoots([a, s]);
          const de = fromRoots([a, u]);
          return {
            text: `Izračunaj $\\lim\\limits_{x \\to ${a}} \\dfrac{${poly(nu)}}{${poly(de)}}$ (ulomek ali celo število).`,
            answer: frAns(a - s, a - u),
            hint: "Vstavljanje da $\\frac{0}{0}$: števec in imenovalec imata skupni faktor. Razstavi oba.",
            data: { given: [`f(x) = \\dfrac{${poly(nu)}}{${poly(de)}}`], find: [`\\lim_{x \\to ${a}} f(x)`] },
            formula: "x^2 + bx + c = (x - x_1)(x - x_2)",
            solution: `$\\dfrac{${lin(a)}${lin(s)}}{${lin(a)}${lin(u)}} = \\dfrac{${lin(s).replace(/^\(|\)$/g, "")}}{${lin(u).replace(/^\(|\)$/g, "")}}$\n$\\lim = \\dfrac{${a} ${sg(-s)}}{${a} ${sg(-u)}} = ${ft(a - s, a - u)}$`,
          };
        }
        if (t === 1) {
          const k = r.int(1, 9);
          let m;
          do m = r.int(1, 9);
          while (m === k);
          const form = r.pick([`\\dfrac{\\sin ${k}x}{${m}x}`, `\\dfrac{\\sin ${k}x}{\\sin ${m}x}`, `\\dfrac{\\tan ${k}x}{${m}x}`, `\\dfrac{${m}x}{\\sin ${k}x}`]).replace(/\b1x/g, "x");
          const inv = form.startsWith(`\\dfrac{${m === 1 ? "" : m}x}`);
          const res = inv ? [m, k] : [k, m];
          return {
            text: `Izračunaj $\\lim\\limits_{x \\to 0} ${form}$ (ulomek ali celo število).`,
            answer: frAns(...res),
            hint: `Uporabi znano limito $\\lim\\limits_{x \\to 0} \\frac{\\sin x}{x} = 1$: ulomek razširi tako, da bo pod $\\sin ${k}x$ stal ravno $${k}x$.`.replace(/\b1x/g, "x"),
            data: { given: [`f(x) = ${form}`], find: ["\\lim_{x \\to 0} f(x)"] },
            formula: "\\lim_{x \\to 0} \\dfrac{\\sin x}{x} = 1",
            solution: `Izraz razširimo z $${k}x$${form.includes(`\\sin ${m}x`) ? ` in $${m}x$` : ""}, tako da nastopa $\\frac{\\sin ${k}x}{${k}x} \\to 1$.\n$\\lim = ${ft(...res)}$`.replace(/\b1x/g, "x"),
          };
        }
        const k = r.int(1, 6);
        return {
          text: `Izračunaj $\\lim\\limits_{x \\to 0} \\dfrac{\\sqrt{x + ${k * k}} - ${k}}{x}$ (ulomek).`,
          answer: frAns(1, 2 * k),
          hint: "Pomnoži števec in imenovalec z $\\sqrt{x + " + k * k + "} + " + k + "$.",
          data: { given: [`f(x) = \\dfrac{\\sqrt{x + ${k * k}} - ${k}}{x}`], find: ["\\lim_{x \\to 0} f(x)"] },
          formula: "(\\sqrt{A} - B)(\\sqrt{A} + B) = A - B^2",
          solution: `$\\dfrac{\\sqrt{x + ${k * k}} - ${k}}{x} \\cdot \\dfrac{\\sqrt{x + ${k * k}} + ${k}}{\\sqrt{x + ${k * k}} + ${k}} = \\dfrac{1}{\\sqrt{x + ${k * k}} + ${k}}$\n$\\lim = \\dfrac{1}{${k} + ${k}} = ${ft(1, 2 * k)}$`,
        };
      }
      if (r.next() < 0.5) {
        const c = r.nonZero(-3, 4);
        const b = r.int(-6, 6);
        const d = r.int(-6, 6);
        const [an, ad] = fr(c * c + d - b, c);
        const fx = `\\begin{cases} ax${b ? ` ${sg(b)}` : ""}, & x < ${c} \\\\ x^2${d ? ` ${sg(d)}` : ""}, & x \\ge ${c} \\end{cases}`;
        return {
          text: `Za katero vrednost parametra $a$ je funkcija $f(x) = ${fx}$ zvezna? Vpiši ulomek ali celo število.`,
          answer: frAns(an, ad),
          hint: `V točki $x = ${c}$ se morata leva in desna limita ujemati z vrednostjo $f(${c})$.`,
          data: { given: [`f(x) = x^2${d ? ` ${sg(d)}` : ""}`, `x_0 = ${c}`], find: ["a"] },
          formula: "\\lim_{x \\to c^-} f(x) = \\lim_{x \\to c^+} f(x) = f(c)",
          solution: `Desna limita in vrednost: $${c < 0 ? `(${c})` : c}^2${d ? ` ${sg(d)}` : ""} = ${c * c + d}$\nLeva limita: $${tm(c, "a", true)}${b ? ` ${sg(b)}` : ""}$\n$${tm(c, "a", true)}${b ? ` ${sg(b)}` : ""} = ${c * c + d}$ $\\Rightarrow$ $a = ${ft(an, ad)}$`,
        };
      }
      const [a, s] = twoRoots();
      const nu = fromRoots([a, s]);
      return {
        text: `Funkcija $f(x) = \\dfrac{${poly(nu)}}{${lin(a).replace(/^\(|\)$/g, "")}}$ ni definirana v $x = ${a}$. Kolikšno vrednost moramo predpisati $f(${a})$, da bo funkcija zvezna na $\\mathbb{R}$?`,
        answer: num(a - s, null, [{ value: 0, why: "Vrednost $\\frac{0}{0}$ ni 0; izračunaj limito." }, { value: s - a, why: "Pazi na predznak pri razcepu števca." }, { value: a, why: "Iščeš vrednost funkcije (limito), ne točke." }]),
        hint: "Funkcijo zvezno razširimo z vrednostjo limite v tej točki.",
        data: { given: [`f(x) = \\dfrac{${poly(nu)}}{${lin(a).replace(/^\(|\)$/g, "")}}`], find: [`f(${a})`] },
        formula: "f(c) = \\lim_{x \\to c} f(x)",
        solution: `$\\dfrac{${poly(nu)}}{${lin(a).replace(/^\(|\)$/g, "")}} = ${lin(s).replace(/^\(|\)$/g, "")}$ za $x \\ne ${a}$\n$\\lim\\limits_{x \\to ${a}} f(x) = ${a} ${sg(-s)} = ${a - s}$\nPredpišemo $f(${a}) = ${a - s}$.`,
      };
    },
  },
  {
    id: P + "odvod",
    topics: [T(4, "odvod")],
    gen(level, r) {
      if (level === 1) {
        if (r.next() < 0.55) {
          const cs = [r.nonZero(-4, 4), r.int(-6, 6), r.int(-9, 9), r.int(-9, 9)];
          const x0 = r.pick([-2, -1, 1, 2, 3]);
          const d = der(cs);
          const v = ev(d, x0);
          const noExp = cs.slice(0, 3).reduce((acc, c, i) => acc + c * x0 ** (2 - i), 0);
          return {
            text: `Izračunaj $f'(${x0})$ za $f(x) = ${poly(cs)}$.`,
            answer: num(v, null, [{ value: ev(cs, x0), why: "To je vrednost funkcije $f(" + x0 + ")$, ne odvoda." }, { value: noExp, why: "Pri odvajanju $x^n$ eksponent prepišeš kot faktor: $(x^n)' = nx^{n-1}$." }]),
            hint: "Odvajaj člen za členom: $(x^n)' = nx^{n-1}$, odvod konstante je 0.",
            data: { given: [`f(x) = ${poly(cs)}`, `x_0 = ${x0}`], find: [`f'(${x0})`] },
            formula: ["(x^n)' = nx^{n-1}", "(c)' = 0"],
            solution: `$f'(x) = ${poly(d)}$\n$f'(${x0}) = ${v}$`,
          };
        }
        const a = r.nonZero(-3, 4);
        const n = r.pick([2, 3, 4]);
        const kind = r.pick(["inv", "sqrt"]);
        const x0 = kind === "inv" ? r.pick([1, 2, -1, -2]) : r.pick([1, 4]);
        const b = kind === "sqrt" ? 2 * r.nonZero(-4, 4) : r.nonZero(-8, 8);
        const tB = kind === "inv" ? `\\dfrac{${b}}{x}` : `${b}\\sqrt{x}`;
        const dB = kind === "inv" ? -b / (x0 * x0) : b / (2 * Math.sqrt(x0));
        const v = n * a * x0 ** (n - 1) + dB;
        const f = `${a === 1 ? "" : a === -1 ? "-" : a}x^${n} ${b < 0 ? "-" : "+"} ${tB.replace(`${b}`, `${Math.abs(b)}`)}`;
        return {
          text: `Izračunaj $f'(${x0})$ za $f(x) = ${f}$.`,
          answer: num(v, null, [kind === "inv" ? { value: n * a * x0 ** (n - 1) + b / (x0 * x0), why: "$\\left(\\frac{1}{x}\\right)' = -\\frac{1}{x^2}$: pazi na predznak." } : { value: n * a * x0 ** (n - 1) + b / Math.sqrt(x0), why: "$(\\sqrt{x})' = \\frac{1}{2\\sqrt{x}}$: ne pozabi na faktor $\\frac{1}{2}$." }]),
          hint: kind === "inv" ? "Zapiši $\\frac{1}{x} = x^{-1}$ in odvajaj kot potenco." : "Zapiši $\\sqrt{x} = x^{1/2}$ in odvajaj kot potenco.",
          data: { given: [`f(x) = ${f}`, `x_0 = ${x0}`], find: [`f'(${x0})`] },
          formula: kind === "inv" ? ["(x^n)' = nx^{n-1}", "\\left(\\dfrac{1}{x}\\right)' = -\\dfrac{1}{x^2}"] : ["(x^n)' = nx^{n-1}", "(\\sqrt{x})' = \\dfrac{1}{2\\sqrt{x}}"],
          solution: `$f'(x) = ${tm(n * a, n - 1 === 1 ? "x" : `x^${n - 1}`, true)}${kind === "inv" ? ` ${-b < 0 ? "-" : "+"} \\dfrac{${Math.abs(b)}}{x^2}` : ` ${b < 0 ? "-" : "+"} \\dfrac{${Math.abs(b)}}{2\\sqrt{x}}`}$`+ `\n$f'(${x0}) = ${tx(v)}$`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 3);
        const x0 = r.pick([-1, 1, 2, 0, -2]);
        if (t === 0) {
          const a = r.nonZero(-3, 3);
          const b = r.nonZero(-5, 5);
          const c = r.nonZero(-3, 4);
          const d = r.int(-5, 5);
          const v = 2 * a * x0 * (c * x0 + d) + c * (a * x0 * x0 + b);
          const f = `(${poly([a, 0, b])})(${le(c, d)})`;
          return {
            text: `Izračunaj $f'(${x0})$ za $f(x) = ${f}$.`,
            answer: num(v, null, [{ value: 2 * a * x0 * c, why: "Odvod produkta ni produkt odvodov: $(uv)' = u'v + uv'$." }, { value: 2 * a * x0 * (c * x0 + d), why: "Upoštevaj oba člena pravila za produkt." }]),
            hint: "Uporabi pravilo za odvod produkta.",
            data: { given: [`f(x) = ${f}`, `x_0 = ${x0}`], find: [`f'(${x0})`] },
            formula: "(uv)' = u'v + uv'",
            solution: `$u = ${poly([a, 0, b])}$, $u' = ${tm(2 * a, "x", true)}$; $v = ${le(c, d)}$, $v' = ${c}$\n$f'(x) = ${tm(2 * a, "x", true)}(${le(c, d)}) ${c < 0 ? "-" : "+"} ${Math.abs(c)}(${poly([a, 0, b])})$\n$f'(${x0}) = ${v}$`,
          };
        }
        if (t === 1) {
          const a = r.nonZero(-4, 5);
          const b = r.int(-6, 6);
          const c = r.int(1, 3);
          const d = r.nonZero(-5, 5);
          if (a * d - b * c === 0 || c * x0 + d === 0) return null;
          const f = `\\dfrac{${le(a, b)}}{${le(c, d)}}`;
          return {
            text: `Izračunaj $f'(${x0})$ za $f(x) = ${f}$ (ulomek ali celo število).`,
            answer: frAns(a * d - b * c, (c * x0 + d) ** 2),
            hint: "Uporabi pravilo za odvod količnika.",
            data: { given: [`f(x) = ${f}`, `x_0 = ${x0}`], find: [`f'(${x0})`] },
            formula: "\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^2}",
            solution: `$f'(x) = \\dfrac{${a}(${le(c, d)}) - ${c}(${le(a, b)})}{(${le(c, d)})^2} = \\dfrac{${a * d - b * c}}{(${le(c, d)})^2}$\n$f'(${x0}) = \\dfrac{${a * d - b * c}}{${(c * x0 + d) ** 2}} = ${ft(a * d - b * c, (c * x0 + d) ** 2)}$`,
          };
        }
        if (t === 2) {
          const a = r.nonZero(-3, 3);
          const b = r.int(-3, 3);
          const n = r.int(2, 5);
          const v = n * a * (a * x0 + b) ** (n - 1);
          const f = `(${le(a, b)})^${n}`;
          return {
            text: `Izračunaj $f'(${x0})$ za $f(x) = ${f}$.`,
            answer: num(v, null, [{ value: n * (a * x0 + b) ** (n - 1), why: "Pri posredni funkciji pomnoži še z odvodom notranje funkcije." }, { value: (a * x0 + b) ** n, why: "To je vrednost funkcije, ne odvoda." }]),
            hint: "Uporabi pravilo za odvod posredne (sestavljene) funkcije.",
            data: { given: [`f(x) = ${f}`, `x_0 = ${x0}`], find: [`f'(${x0})`] },
            formula: "\\big(g(h(x))\\big)' = g'(h(x)) \\cdot h'(x)",
            solution: `$f'(x) = ${n}(${le(a, b)})^${n - 1 === 1 ? "" : n - 1} \\cdot ${a < 0 ? `(${a})` : a}$`.replace("^ \\cdot", " \\cdot") + `\n$f'(${x0}) = ${n} \\cdot (${a * x0 + b})^{${n - 1}} \\cdot ${a < 0 ? `(${a})` : a} = ${v}$`,
          };
        }
        const a = r.nonZero(-4, 4);
        const b = r.nonZero(-5, 5);
        const k = r.nonZero(-3, 3);
        const f = `(${le(a, b)})e^{${k === 1 ? "" : k === -1 ? "-" : k}x}`;
        const v = a + b * k;
        return {
          text: `Izračunaj $f'(0)$ za $f(x) = ${f}$.`,
          answer: num(v, null, [{ value: a, why: "Upoštevaj pravilo za produkt: odvajati moraš tudi eksponentni faktor." }, { value: a * k, why: "Odvod produkta ni produkt odvodov." }, { value: a + b, why: "Odvod $e^{kx}$ je $ke^{kx}$ (posredna funkcija)." }]),
          hint: "Uporabi pravilo za produkt in odvod posredne funkcije $e^{kx}$.",
          data: { given: [`f(x) = ${f}`], find: ["f'(0)"] },
          formula: ["(uv)' = u'v + uv'", "(e^{kx})' = ke^{kx}"],
          solution: `$f'(x) = ${a}e^{${k === 1 ? "" : k === -1 ? "-" : k}x} + (${le(a, b)}) \\cdot ${k < 0 ? `(${k})` : k}e^{${k === 1 ? "" : k === -1 ? "-" : k}x}$\n$f'(0) = ${a} ${sg(b * k)} = ${v}$`,
        };
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const a = r.nonZero(-4, 4);
        const b = r.int(-5, 5);
        const c = r.int(-6, 6);
        const x0 = r.pick([1, 2, -1, -2]);
        const K = 3 * a * x0 * x0 + 2 * b * x0 + c;
        const f = `ax^3 ${b ? `${tm(b, "x^2")} ` : ""}${c ? tm(c, "x") : ""}`.trim();
        return {
          text: `Za funkcijo $f(x) = ${f}$ velja $f'(${x0}) = ${K}$. Koliko je $a$?`,
          answer: num(a, null, [{ value: (K - b * x0 * x0 - c * x0) / x0 ** 3, why: "Pogoj velja za odvod: najprej odvajaj, nato vstavi." }, { value: (K - 2 * b * x0 - c) / x0 ** 2, why: "Odvod $ax^3$ je $3ax^2$: ne pozabi na faktor 3." }]),
          hint: "Odvajaj (z $a$ kot konstanto), vstavi $x_0$ in reši linearno enačbo za $a$.",
          data: { given: [`f(x) = ${f}`, `f'(${x0}) = ${K}`], find: ["a"] },
          formula: "(x^n)' = nx^{n-1}",
          solution: `$f'(x) = 3ax^2 ${b ? `${tm(2 * b, "x")} ` : ""}${c ? sg(c) : ""}$\n$f'(${x0}) = ${3 * x0 * x0}a ${b || c ? sg(2 * b * x0 + c) : ""} = ${K}$\n$a = ${a}$`,
        };
      }
      if (t === 1) {
        if (r.next() < 0.5) {
          const c = r.int(1, 9);
          const x0 = r.nonZero(-3, 3);
          return {
            text: `Izračunaj $f'(${x0})$ za $f(x) = \\ln(x^2 + ${c})$ (ulomek).`,
            answer: frAns(2 * x0, x0 * x0 + c),
            hint: "Odvod $\\ln u$ je $\\frac{u'}{u}$.",
            data: { given: [`f(x) = \\ln(x^2 + ${c})`, `x_0 = ${x0}`], find: [`f'(${x0})`] },
            formula: "(\\ln u)' = \\dfrac{u'}{u}",
            solution: `$f'(x) = \\dfrac{2x}{x^2 + ${c}}$\n$f'(${x0}) = \\dfrac{${2 * x0}}{${x0 * x0 + c}} = ${ft(2 * x0, x0 * x0 + c)}$`,
          };
        }
        const a = r.int(1, 5);
        const sq = r.int(1, 5);
        const x0 = r.int(0, 6);
        const b = sq * sq - a * x0;
        const inner = le(a, b);
        return {
          text: `Izračunaj $f'(${x0})$ za $f(x) = \\sqrt{${inner}}$ (ulomek ali celo število).`,
          answer: frAns(a, 2 * sq),
          hint: "$\\sqrt{u} = u^{1/2}$; uporabi pravilo za posredno funkcijo.",
          data: { given: [`f(x) = \\sqrt{${inner}}`, `x_0 = ${x0}`], find: [`f'(${x0})`] },
          formula: "(\\sqrt{u})' = \\dfrac{u'}{2\\sqrt{u}}",
          solution: `$f'(x) = \\dfrac{${a}}{2\\sqrt{${inner}}}$\n$f'(${x0}) = \\dfrac{${a}}{2\\sqrt{${sq * sq}}} = ${ft(a, 2 * sq)}$`,
        };
      }
      const n = r.int(2, 4);
      const x0 = r.pick([1, 2, 3, -1, -2]);
      const f0 = x0 ** n;
      const v = n * x0 ** (n - 1);
      const x0t = x0 < 0 ? `(${x0} + h)` : `(${x0} + h)`;
      return {
        text: `Izračunaj $\\lim\\limits_{h \\to 0} \\dfrac{${x0t}^${n} - ${f0 < 0 ? `(${f0})` : f0}}{h}$. Namig: prepoznaj definicijo odvoda.`,
        answer: num(v, null, [{ value: f0, why: "To je vrednost funkcije v točki, ne odvod." }, { value: 0, why: "Števec in imenovalec gresta oba proti 0; limita ni nujno 0." }, { value: n * x0 ** n, why: "$(x^n)' = nx^{n-1}$: eksponent se zmanjša za 1." }]),
        hint: `Limita je $f'(${x0})$ za funkcijo $f(x) = x^${n}$.`,
        data: { given: [`f(x) = x^${n}`, `x_0 = ${x0}`], find: [`f'(${x0})`] },
        formula: "f'(x_0) = \\lim_{h \\to 0} \\dfrac{f(x_0 + h) - f(x_0)}{h}",
        solution: `To je definicija odvoda za $f(x) = x^${n}$ v točki $x_0 = ${x0}$.\n$f'(x) = ${n}x^${n - 1 === 1 ? "{}" : n - 1}$`.replace("x^{}", "x") + `\n$f'(${x0}) = ${n} \\cdot ${x0 < 0 ? `(${x0})` : x0}${n - 1 > 1 ? `^${n - 1}` : ""} = ${v}$`,
      };
    },
  },
  {
    id: P + "uporaba-odvoda-tangenta-ekstremi",
    topics: [T(4, "uporaba-odvoda")],
    gen(level, r) {
      if (level === 1) {
        if (r.next() < 0.55) {
          const cs = r.next() < 0.5 ? [r.nonZero(-3, 3), r.int(-5, 5), r.int(-6, 6), r.int(-9, 9)] : [r.nonZero(-4, 4), r.int(-8, 8), r.int(-9, 9)];
          const x0 = r.pick([-2, -1, 1, 2, 3]);
          const k = ev(der(cs), x0);
          return {
            text: `Kolikšen je smerni koeficient tangente na graf funkcije $f(x) = ${poly(cs)}$ v točki z absciso $x_0 = ${x0}$?`,
            answer: num(k, null, [{ value: ev(cs, x0), why: "To je ordinata točke $f(x_0)$; smerni koeficient tangente je $f'(x_0)$." }]),
            hint: "Smerni koeficient tangente je vrednost odvoda v dotikališču.",
            data: { given: [`f(x) = ${poly(cs)}`, `x_0 = ${x0}`], find: ["k"] },
            formula: "k = f'(x_0)",
            solution: `$f'(x) = ${poly(der(cs))}$\n$k = f'(${x0}) = ${k}$`,
          };
        }
        const a = r.nonZero(-3, 3);
        const xs = r.nonZero(-5, 5);
        const b = -2 * a * xs;
        const c = r.int(-9, 9);
        const cs = [a, b, c];
        return {
          text: `V kateri točki ima funkcija $f(x) = ${poly(cs)}$ stacionarno točko? Vpiši njeno absciso.`,
          answer: num(xs, null, [{ value: -xs, why: "Reši $f'(x) = 0$ in pazi na predznak." }, { value: ev(cs, xs), why: "To je ordinata stacionarne točke; vprašanje je po abscisi." }]),
          hint: "V stacionarni točki je odvod enak 0.",
          data: { given: [`f(x) = ${poly(cs)}`], find: ["x_s"] },
          formula: "f'(x_s) = 0",
          solution: `$f'(x) = ${poly(der(cs))}$\n$${poly(der(cs))} = 0$ $\\Rightarrow$ $x_s = ${xs}$`,
        };
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const cs = r.next() < 0.5 ? [r.nonZero(-2, 2), r.int(-4, 4), r.int(-5, 5), r.int(-6, 6)] : [r.nonZero(-3, 3), r.int(-6, 6), r.int(-6, 6)];
          const x0 = r.pick([-2, -1, 1, 2]);
          const k = ev(der(cs), x0);
          const y0 = ev(cs, x0);
          const n = y0 - k * x0;
          return {
            text: `Zapiši enačbo tangente $y = kx + n$ na graf funkcije $f(x) = ${poly(cs)}$ v točki z absciso $x_0 = ${x0}$. Koliko je $n$?`,
            answer: num(n, null, [{ value: y0 + k * x0, why: "Iz $y - y_0 = k(x - x_0)$ sledi $n = y_0 - kx_0$; pazi na predznak." }, { value: y0, why: "$f(x_0)$ je ordinata dotikališča, ne odsek na osi $y$." }]),
            hint: "Izračunaj dotikališče $T(x_0, f(x_0))$ in smerni koeficient $k = f'(x_0)$, nato uporabi enačbo premice skozi točko.",
            data: { given: [`f(x) = ${poly(cs)}`, `x_0 = ${x0}`], find: ["n"] },
            formula: ["k = f'(x_0)", "y - y_0 = k(x - x_0)"],
            solution: `$y_0 = f(${x0}) = ${y0}$, $k = f'(${x0}) = ${k}$\n$y - ${y0 < 0 ? `(${y0})` : y0} = ${k}(x - ${x0 < 0 ? `(${x0})` : x0})$\n$y = ${poly([k, n])}$, torej $n = ${n}$`,
          };
        }
        const [s1, s2] = [r.int(-4, 2), r.int(-2, 5)].sort((p, q) => p - q);
        if (s1 === s2) return null;
        const lead = r.pick([1, -1]);
        const cs = [2 * lead, -3 * lead * (s1 + s2), 6 * lead * s1 * s2, r.int(-9, 9)];
        const maxX = lead > 0 ? s1 : s2;
        const minX = lead > 0 ? s2 : s1;
        const ask = r.pick(["xmax", "xmin", "ymin", "ymax"]);
        const ans = ask === "xmax" ? maxX : ask === "xmin" ? minX : ask === "ymin" ? ev(cs, minX) : ev(cs, maxX);
        const other = ask === "xmax" ? minX : ask === "xmin" ? maxX : ask === "ymin" ? ev(cs, maxX) : ev(cs, minX);
        return {
          text: `Funkcija $f(x) = ${poly(cs)}$ ima dva lokalna ekstrema. ${ask === "xmax" ? "Kje ima lokalni maksimum? Vpiši absciso." : ask === "xmin" ? "Kje ima lokalni minimum? Vpiši absciso." : ask === "ymin" ? "Kolikšna je vrednost lokalnega minimuma?" : "Kolikšna je vrednost lokalnega maksimuma?"}`,
          answer: num(ans, null, [{ value: other, why: "Zamenjal si maksimum in minimum. Preveri predznak odvoda levo in desno od stacionarne točke." }]),
          hint: "Reši $f'(x) = 0$, nato s predznakom odvoda (ali drugim odvodom) določi vrsto ekstrema.",
          data: { given: [`f(x) = ${poly(cs)}`], find: [ask.startsWith("x") ? "x" : "f(x)"] },
          formula: ["f'(x) = 0", "f''(x) < 0 \\Rightarrow \\max,\\ f''(x) > 0 \\Rightarrow \\min"],
          solution: `$f'(x) = ${poly(der(cs))} = ${6 * lead}${lin(s1)}${lin(s2)}$\nStacionarni točki: $x_1 = ${s1}$, $x_2 = ${s2}$; $f''(x) = ${poly(der(der(cs)))}$.\nMaksimum pri $x = ${maxX}$ ($f = ${ev(cs, maxX)}$), minimum pri $x = ${minX}$ ($f = ${ev(cs, minX)}$).`,
        };
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const cs = [r.nonZero(-2, 2) / 2, r.int(-3, 3), r.int(-4, 4)].map((x) => x);
        const x0 = r.pick([-2, -1, 1, 2, 3]);
        const k = ev(der(cs), x0);
        if (k === 0) return null;
        const phi = k > 0 ? Math.atan(k) / DEG : 180 + Math.atan(k) / DEG;
        return {
          text: `Pod kolikšnim kotom (merjenim od pozitivne smeri osi $x$) seka tangenta na graf funkcije $f(x) = ${poly(cs)}$ v točki z absciso $${x0}$ os $x$? Rezultat v stopinjah zaokroži na eno decimalko.`,
          answer: num(phi, 1, [{ value: Math.atan(k) / DEG, why: "Kot tangente meri med $0^\\circ$ in $180^\\circ$; pri negativnem naklonu prištej $180^\\circ$." }, { value: Math.atan(ev(cs, x0)) / DEG, why: "Naklon tangente je $f'(x_0)$, ne $f(x_0)$." }]),
          hint: "Naklonski kot tangente $\\varphi$ zadošča $\\tan\\varphi = f'(x_0)$.",
          data: { given: [`f(x) = ${poly(cs)}`, `x_0 = ${x0}`], find: ["\\varphi"] },
          formula: "\\tan\\varphi = f'(x_0)",
          solution: `$f'(x) = ${poly(der(cs))}$, $k = f'(${x0}) = ${tx(k)}$\n$\\tan\\varphi = ${tx(k)}$${k < 0 ? ", naklon je negativen, zato je kot top" : ""}\n$\\varphi \\approx ${tx(phi, 1)}^\\circ$`,
        };
      }
      if (t === 1) {
        const a = r.nonZero(-2, 2);
        const b = r.int(-6, 6);
        const c = r.int(-6, 6);
        const x0 = r.nonZero(-3, 3);
        const k = 2 * a * x0 + b;
        const m = r.int(-5, 5);
        const y0 = a * x0 * x0 + b * x0 + c;
        const n = y0 - k * x0;
        if (n === m) return null;
        const cs = [a, b, c];
        return {
          text: `Tangenta na graf funkcije $f(x) = ${poly(cs)}$ je vzporedna premici $y = ${poly([k, m])}$. Zapiši jo v obliki $y = kx + n$. Koliko je $n$?`,
          answer: num(n, null, [{ value: m, why: "Vzporedni premici imata enak naklon, odsek $n$ pa je drugačen." }, { value: y0, why: "To je ordinata dotikališča; izračunaj še $n = y_0 - kx_0$." }]),
          hint: "Vzporedna tangenta ima enak smerni koeficient. Reši $f'(x_0) = k$, da dobiš dotikališče.",
          data: { given: [`f(x) = ${poly(cs)}`, `y = ${poly([k, m])}`], find: ["n"] },
          formula: ["f'(x_0) = k", "y - y_0 = k(x - x_0)"],
          solution: `$f'(x) = ${poly(der(cs))} = ${k}$ $\\Rightarrow$ $x_0 = ${x0}$\n$y_0 = f(${x0}) = ${y0}$\n$y = ${k}(x ${sg(-x0)}) ${sg(y0)}$ $\\Rightarrow$ $n = ${n}$`.replace("1(x", "(x"),
        };
      }
      const x0 = r.nonZero(-3, 3);
      const b = r.nonZero(-9, 9);
      const [an, ad] = fr(-(3 * x0 * x0 + b), 2 * x0);
      return {
        text: `Za katero vrednost parametra $a$ ima funkcija $f(x) = x^3 + ax^2 ${tm(b, "x")}$ stacionarno točko pri $x = ${x0}$? Vpiši ulomek ali celo število.`,
        answer: frAns(an, ad),
        hint: "V stacionarni točki je odvod enak 0. Odvajaj in vstavi $x = " + x0 + "$.",
        data: { given: [`f(x) = x^3 + ax^2 ${tm(b, "x")}`, `x_0 = ${x0}`], find: ["a"] },
        formula: "f'(x_0) = 0",
        solution: `$f'(x) = 3x^2 + 2ax ${sg(b)}$\n$f'(${x0}) = ${3 * x0 * x0} ${sg(2 * x0)}a ${sg(b)} = 0$\n$a = ${ft(an, ad)}$`,
      };
    },
  },
  {
    id: P + "uporaba-odvoda-ekstremalni-problemi",
    topics: [T(4, "uporaba-odvoda")],
    gen(level, r) {
      const who = name(r);
      if (level === 1) {
        if (r.next() < 0.5) {
          const S = 2 * r.int(5, 40);
          return {
            text: `Število $${S}$ razdeli na dva pozitivna seštevanca tako, da bo njun produkt največji. Kolikšen je ta produkt?`,
            answer: num((S * S) / 4, null, [{ value: S / 2, why: "To je posamezni seštevanec; vprašanje je po produktu." }, { value: (S / 2 - 1) * (S / 2 + 1), why: "Preveri z odvodom: maksimum je pri enakih seštevancih." }]),
            hint: `Seštevanca označi z $x$ in $${S} - x$. Poišči maksimum funkcije $P(x) = x(${S} - x)$.`,
            data: { given: [`x + y = ${S}`], find: ["P_{\\max}"] },
            formula: ["P(x) = x(S - x)", "P'(x) = 0"],
            solution: `$P(x) = x(${S} - x) = ${S}x - x^2$\n$P'(x) = ${S} - 2x = 0$ $\\Rightarrow$ $x = ${S / 2}$\n$P_{\\max} = ${S / 2} \\cdot ${S / 2} = ${(S * S) / 4}$`,
          };
        }
        const O = 4 * r.int(5, 40);
        const obj = r.pick(["vrtno gredico", "ograjen pašnik", "pravokotno igrišče", "okvir za sliko"]);
        const u = obj === "okvir za sliko" ? "cm" : "m";
        return {
          text: `${who} ${g(who, "želi", "želi")} narediti ${obj} pravokotne oblike z obsegom $${O}\\ \\mathrm{${u}}$. Kolikšna je največja možna ploščina?`,
          answer: num((O / 4) ** 2, null, [{ value: O / 4, why: "To je dolžina stranice; vprašanje je po ploščini." }, { value: (O / 2) ** 2, why: "Vsota dveh sosednjih stranic je polovica obsega." }], `${u}^2`),
          hint: "Izrazi ploščino z eno stranico $x$ (druga je $\\frac{o}{2} - x$) in poišči maksimum.",
          data: { given: [`o = ${O}\\ \\mathrm{${u}}`], find: ["S_{\\max}"] },
          formula: ["S(x) = x\\left(\\dfrac{o}{2} - x\\right)", "S'(x) = 0"],
          solution: `$S(x) = x(${O / 2} - x)$, $S'(x) = ${O / 2} - 2x = 0$ $\\Rightarrow$ $x = ${O / 4}\\ \\mathrm{${u}}$\nPravokotnik je kvadrat s stranico $${O / 4}\\ \\mathrm{${u}}$.\n$S_{\\max} = ${O / 4}^2 = ${(O / 4) ** 2}\\ \\mathrm{${u}^2}$`,
        };
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const L = 4 * r.int(5, 50);
          return {
            text: `Ob ravnem zidu želi ${who} z $${L}\\ \\mathrm{m}$ mreže ograditi pravokoten vrt (ob zidu mreže ne potrebuje). Kolikšna je največja ploščina vrta?`,
            answer: num((L * L) / 8, null, [{ value: (L / 4) ** 2, why: "Mreža je le na treh stranicah, zato vrt ni kvadrat." }, { value: (L / 3) ** 2, why: "Stranici ob zidu pravokotni nista enaki tretji stranici; uporabi odvod." }], "m^2"),
            hint: "Stranici, pravokotni na zid, označi z $x$; stranica, vzporedna zidu, je $L - 2x$.",
            data: { given: [`L = ${L}\\ \\mathrm{m}`], find: ["S_{\\max}"] },
            formula: ["S(x) = x(L - 2x)", "S'(x) = 0"],
            solution: `$S(x) = x(${L} - 2x) = ${L}x - 2x^2$\n$S'(x) = ${L} - 4x = 0$ $\\Rightarrow$ $x = ${L / 4}\\ \\mathrm{m}$, druga stranica $${L / 2}\\ \\mathrm{m}$\n$S_{\\max} = ${L / 4} \\cdot ${L / 2} = ${(L * L) / 8}\\ \\mathrm{m^2}$`,
          };
        }
        const k = r.int(2, 10);
        const a = 6 * k;
        const askV = r.next() < 0.6;
        const x = a / 6;
        const Vm = x * (a - 2 * x) ** 2;
        return {
          text: `Iz kvadratnega kosa kartona s stranico $${a}\\ \\mathrm{cm}$ naredimo škatlo brez pokrova tako, da v vogalih izrežemo enake kvadratke in zapognemo robove. ${askV ? "Kolikšna je največja možna prostornina škatle?" : "Kolikšna mora biti stranica izrezanega kvadratka, da bo prostornina največja?"}`,
          answer: askV
            ? num(Vm, null, [{ value: (a / 4) * (a / 2) ** 2, why: "Preveri stacionarno točko z odvodom $V'(x) = 0$." }, { value: a ** 3, why: "Višina škatle je $x$, osnovna ploskev pa ima stranico $a - 2x$." }], "cm^3")
            : num(x, null, [{ value: a / 2, why: "Pri $x = \\frac{a}{2}$ je prostornina 0 – to je druga ničla odvoda." }, { value: a / 4, why: "Reši enačbo $V'(x) = 0$ natančno." }], "cm"),
          hint: "Prostornina je $V(x) = x(a - 2x)^2$. Poišči ničle odvoda in izberi smiselno.",
          data: { given: [`a = ${a}\\ \\mathrm{cm}`], find: [askV ? "V_{\\max}" : "x"] },
          formula: ["V(x) = x(a - 2x)^2", "V'(x) = (a - 2x)(a - 6x)"],
          solution: `$V(x) = x(${a} - 2x)^2$\n$V'(x) = (${a} - 2x)(${a} - 6x) = 0$ $\\Rightarrow$ $x = ${a / 2}$ (ni smiselno) ali $x = ${x}\\ \\mathrm{cm}$\n${askV ? `$V_{\\max} = ${x} \\cdot ${a - 2 * x}^2 = ${Vm}\\ \\mathrm{cm^3}$` : `Stranica kvadratka: $x = ${x}\\ \\mathrm{cm}$`}`,
        };
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const V = r.pick([250, 330, 500, 750, 1000, 400, 600]);
        const rr = Math.cbrt(V / (2 * Math.PI));
        const askR = r.next() < 0.5;
        const Smin = 2 * Math.PI * rr * rr + (2 * V) / rr;
        return {
          text: `Pločevinka valjaste oblike mora imeti prostornino $${V}\\ \\mathrm{cm^3}$. ${askR ? "Kolikšen naj bo polmer osnovne ploskve, da porabimo najmanj pločevine?" : "Kolikšna je najmanjša možna površina pločevinke?"} Zaokroži na dve decimalki.`,
          answer: askR
            ? num(rr, 2, [{ value: Math.cbrt(V / Math.PI), why: "Površina ima dve osnovni ploskvi: $P = 2\\pi r^2 + 2\\pi rv$." }, { value: Math.sqrt(V / (2 * Math.PI)), why: "Iz $P'(r) = 0$ dobiš $r^3$, ne $r^2$." }], "cm")
            : num(Smin, 2, [{ value: Math.PI * rr * rr + (2 * V) / rr, why: "Pločevinka ima dno in pokrov: $2\\pi r^2$." }], "cm^2"),
          hint: "Iz prostornine izrazi višino $v = \\frac{V}{\\pi r^2}$, vstavi v površino in poišči minimum funkcije $P(r)$.",
          data: { given: [`V = ${V}\\ \\mathrm{cm^3}`], find: [askR ? "r" : "P_{\\min}"] },
          formula: ["P = 2\\pi r^2 + 2\\pi r v", "V = \\pi r^2 v"],
          solution: `$P(r) = 2\\pi r^2 + \\dfrac{2V}{r} = 2\\pi r^2 + \\dfrac{${2 * V}}{r}$\n$P'(r) = 4\\pi r - \\dfrac{${2 * V}}{r^2} = 0$ $\\Rightarrow$ $r = \\sqrt[3]{\\dfrac{${V}}{2\\pi}} \\approx ${tx(rr, 2)}\\ \\mathrm{cm}$${askR ? "" : `\n$P_{\\min} = 2\\pi r^2 + \\dfrac{${2 * V}}{r} \\approx ${tx(Smin, 2)}\\ \\mathrm{cm^2}$`}`,
        };
      }
      if (t === 1) {
        const k = r.int(1, 4);
        const c = 3 * k * k;
        const A = 4 * k ** 3;
        return {
          text: `Pravokotnik ima dve oglišči na osi $x$, drugi dve pa na paraboli $y = ${c} - x^2$ nad osjo $x$ (simetrično glede na os $y$). Kolikšna je največja možna ploščina pravokotnika?`,
          answer: num(A, null, [{ value: k * (c - k * k), why: "Širina pravokotnika je $2x$, ne $x$." }]),
          hint: "Za oglišče $(x, " + c + " - x^2)$ je ploščina $S(x) = 2x(" + c + " - x^2)$.",
          data: { given: [`y = ${c} - x^2`], find: ["S_{\\max}"] },
          formula: ["S(x) = 2x \\cdot y(x)", "S'(x) = 0"],
          solution: `$S(x) = 2x(${c} - x^2) = ${2 * c}x - 2x^3$\n$S'(x) = ${2 * c} - 6x^2 = 0$ $\\Rightarrow$ $x = ${k}$\n$S_{\\max} = 2 \\cdot ${k} \\cdot (${c} - ${k * k}) = ${A}$`,
        };
      }
      const tt = r.int(1, 9);
      const d = Math.sqrt(tt - 0.25);
      return {
        text: `Na paraboli $y = x^2$ poišči točko, ki je najbližja točki $A(0, ${tt})$. Kolikšna je najmanjša razdalja? Zaokroži na dve decimalki.`,
        answer: num(d, 2, [{ value: tt, why: "Teme parabole ni najbližja točka; uporabi odvod kvadrata razdalje." }, { value: tt - 0.25, why: "To je kvadrat razdalje; koreni." }]),
        hint: "Kvadrat razdalje od $T(x, x^2)$ do $A$ je $d^2(x) = x^2 + (x^2 - " + tt + ")^2$. Poišči minimum (namesto $x$ lahko uvedeš $u = x^2$).",
        data: { given: [`A = (0, ${tt})`], find: ["d_{\\min}"] },
        formula: ["d^2 = (x - x_A)^2 + (y - y_A)^2", "\\big(d^2\\big)' = 0"],
        solution: `$d^2(x) = x^2 + (x^2 - ${tt})^2$\n$\\big(d^2\\big)' = 2x + 4x(x^2 - ${tt}) = 2x(2x^2 - ${2 * tt - 1}) = 0$ $\\Rightarrow$ $x^2 = ${tx(tt - 0.5)}$\n$d^2 = ${tx(tt - 0.5)} + ${tx(0.25)} = ${tx(tt - 0.25)}$, $d_{\\min} \\approx ${tx(d, 2)}$`,
      };
    },
  },
  {
    id: P + "nedoloceni-integral",
    topics: [T(4, "nedoloceni-integral")],
    gen(level, r) {
      if (level === 1) {
        if (r.next() < 0.5) {
          const n = r.int(1, 6);
          const a = r.nonZero(-12, 12);
          return {
            text: `Velja $\\displaystyle\\int ${a === 1 ? "" : a === -1 ? "-" : a}x^${n === 1 ? "{}" : n}\\,dx = kx^{${n + 1}} + C$. Koliko je $k$? Vpiši ulomek ali celo število.`.replace("x^{}", "x"),
            answer: frAns(a, n + 1),
            hint: "Pri integriranju potence eksponent povečaš za 1 in z novim eksponentom deliš.",
            data: { given: [`f(x) = ${a === 1 ? "" : a === -1 ? "-" : a}x^${n === 1 ? "{}" : n}`.replace("x^{}", "x")], find: ["k"] },
            formula: "\\int x^n\\,dx = \\dfrac{x^{n+1}}{n + 1} + C",
            solution: `$\\displaystyle\\int ${a === 1 ? "" : a === -1 ? "-" : a}x^{${n}}\\,dx = ${a === 1 ? "" : `${a < 0 ? `(${a})` : a} \\cdot `}\\dfrac{x^{${n + 1}}}{${n + 1}} + C$\n$k = ${ft(a, n + 1)}$`,
          };
        }
        const items = [
          ["\\sin x", "-\\cos x + C", [["\\cos x + C", "Odvod $\\cos x$ je $-\\sin x$; preveri predznak."], ["-\\sin x + C", "Integral sinusa je povezan s kosinusom."], ["\\dfrac{\\sin^2 x}{2} + C", "Pravilo za potence ne velja za kotne funkcije."]], "\\int \\sin x\\,dx = -\\cos x + C"],
          ["\\dfrac{1}{x}", "\\ln|x| + C", [["-\\dfrac{1}{x^2} + C", "To je odvod $\\frac{1}{x}$, ne integral."], ["\\dfrac{x^0}{0} + C", "Pravilo za potence ne velja pri $n = -1$."], ["\\dfrac{1}{x^2} + C", "Preveri z odvajanjem: odvod rezultata mora biti $\\frac{1}{x}$."]], "\\int \\dfrac{1}{x}\\,dx = \\ln|x| + C"],
          ["e^{2x}", "\\frac{1}{2}e^{2x} + C", [["e^{2x} + C", "Odvod $e^{2x}$ je $2e^{2x}$; popravi s faktorjem."], ["2e^{2x} + C", "To je odvod, ne integral."], ["\\dfrac{e^{2x+1}}{2x + 1} + C", "Pravilo za potence velja za $x^n$, ne za eksponentno funkcijo."]], "\\int e^{kx}\\,dx = \\dfrac{1}{k}e^{kx} + C"],
          ["\\cos 3x", "\\frac{1}{3}\\sin 3x + C", [["\\sin 3x + C", "Odvod $\\sin 3x$ je $3\\cos 3x$; popravi s faktorjem."], ["3\\sin 3x + C", "Faktor 3 je na napačni strani: deliš, ne množiš."], ["-\\frac{1}{3}\\sin 3x + C", "Integral kosinusa je sinus brez minusa."]], "\\int \\cos kx\\,dx = \\dfrac{1}{k}\\sin kx + C"],
          ["\\dfrac{1}{x^2}", "-\\dfrac{1}{x} + C", [["\\dfrac{1}{x} + C", "Preveri predznak z odvajanjem rezultata."], ["\\ln x^2 + C", "Logaritem dobimo le pri $\\frac{1}{x}$."], ["-\\dfrac{2}{x^3} + C", "To je odvod, ne integral."]], "\\int x^{-2}\\,dx = \\dfrac{x^{-1}}{-1} + C"],
          ["\\sqrt{x}", "\\frac{2}{3}x\\sqrt{x} + C", [["\\dfrac{1}{2\\sqrt{x}} + C", "To je odvod korena, ne integral."], ["\\frac{3}{2}x\\sqrt{x} + C", "Z novim eksponentom $\\frac{3}{2}$ deliš, ne množiš."], ["x\\sqrt{x} + C", "Manjka faktor: deli z novim eksponentom."]], "\\int x^{1/2}\\,dx = \\dfrac{x^{3/2}}{3/2} + C"],
          ["\\dfrac{1}{x + 2}", "\\ln|x + 2| + C", [["-\\dfrac{1}{(x + 2)^2} + C", "To je odvod, ne integral."], ["\\ln|x| + 2 + C", "Argument logaritma je ves imenovalec $x + 2$."], ["\\dfrac{1}{2}\\ln|x + 2| + C", "Notranji odvod $x + 2$ je 1, zato faktorja ni."]], "\\int \\dfrac{dx}{x + a} = \\ln|x + a| + C"],
          ["3x^2 - 4x", "x^3 - 2x^2 + C", [["6x - 4 + C", "To je odvod, ne integral."], ["3x^3 - 4x^2 + C", "Deli z novim eksponentom."], ["x^3 - 4x^2 + C", "Tudi drugi člen deli z novim eksponentom 2."]], "\\int x^n\\,dx = \\dfrac{x^{n+1}}{n + 1} + C"],
        ];
        const [f, right, wrongs, rule] = r.pick(items);
        return {
          text: `Izračunaj nedoločeni integral $\\displaystyle\\int ${f}\\,dx$.`,
          answer: pickAns(r, right, wrongs),
          options_tex: true,
          hint: "Preveri vsako možnost z odvajanjem: odvod pravega rezultata je integrand.",
          data: false,
          formula: rule,
          solution: `Uporabimo $${rule}$.\nPreizkus: odvod $${right.replace(" + C", "")}$ je $${f}$.`,
        };
      }
      if (level === 2) {
        if (r.next() < 0.6) {
          const a = r.nonZero(-2, 3);
          const b = r.int(-4, 4);
          const c = r.int(-6, 6);
          const fcs = [3 * a, 2 * b, c];
          const Fcs = [a, b, c, 0];
          const x0 = r.pick([0, 1, -1, 2]);
          const y0 = r.int(-10, 10);
          const C0 = y0 - ev(Fcs, x0);
          let x1;
          do x1 = r.pick([-2, -1, 1, 2, 3]);
          while (x1 === x0);
          const ans = ev(Fcs, x1) + C0;
          return {
            text: r.next() < 0.5
              ? `Funkcija $F$ je tisti nedoločeni integral funkcije $f(x) = ${poly(fcs)}$, za katerega je $F(${x0}) = ${y0}$. Izračunaj $F(${x1})$.`
              : `Za funkcijo $F$ velja $F'(x) = ${poly(fcs)}$ in $F(${x0}) = ${y0}$. Izračunaj $F(${x1})$.`,
            answer: num(ans, null, [{ value: ev(Fcs, x1), why: "Konstanto $C$ moraš določiti iz pogoja $F(" + x0 + ") = " + y0 + "$." }, { value: ev(fcs, x1), why: "Izračunal si $f(" + x1 + ")$; najprej integriraj." }]),
            hint: "Integriraj člen za členom, nato iz pogoja izračunaj konstanto $C$.",
            data: { given: [`f(x) = ${poly(fcs)}`, `F(${x0}) = ${y0}`], find: [`F(${x1})`] },
            formula: ["\\int x^n\\,dx = \\dfrac{x^{n+1}}{n + 1} + C", "F(x_0) = y_0"],
            solution: `$F(x) = ${poly(Fcs)} + C$\n$F(${x0}) = ${ev(Fcs, x0)} + C = ${y0}$ $\\Rightarrow$ $C = ${C0}$\n$F(${x1}) = ${ev(Fcs, x1)} ${sg(C0)} = ${ans}$`,
          };
        }
        const k = r.nonZero(-3, 3);
        const b = r.int(-5, 5);
        const y0 = r.int(-8, 8);
        const x1 = r.pick([4, 9]);
        const F = (x) => 2 * k * x ** 1.5 + b * x;
        const C0 = y0 - F(1);
        const ans = F(x1) + C0;
        const f = `${3 * k === 1 ? "" : 3 * k === -1 ? "-" : 3 * k}\\sqrt{x}${b ? ` ${sg(b)}` : ""}`;
        return {
          text: `Funkcija $F$ je nedoločeni integral funkcije $f(x) = ${f}$ in velja $F(1) = ${y0}$. Izračunaj $F(${x1})$.`,
          answer: num(ans, null, [{ value: F(x1), why: "Konstanto $C$ določi iz pogoja $F(1) = " + y0 + "$." }, { value: 4.5 * k * x1 ** 1.5 + b * x1 + y0 - 4.5 * k - b, why: "$\\int \\sqrt{x}\\,dx = \\frac{2}{3}x^{3/2}$: deli z $\\frac{3}{2}$, ne množi." }]),
          hint: "Zapiši $\\sqrt{x} = x^{1/2}$ in integriraj kot potenco.",
          data: { given: [`f(x) = ${f}`, `F(1) = ${y0}`], find: [`F(${x1})`] },
          formula: "\\int x^{1/2}\\,dx = \\dfrac{2}{3}x^{3/2} + C",
          solution: `$F(x) = ${tm(2 * k, "x\\sqrt{x}", true)}${b ? ` ${tm(b, "x")}` : ""} + C$\n$F(1) = ${F(1)} + C = ${y0}$ $\\Rightarrow$ $C = ${C0}$\n$F(${x1}) = ${F(x1)} ${sg(C0)} = ${ans}$`,
        };
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const a = r.nonZero(-5, 5);
        const b = r.nonZero(-6, 6);
        const n = r.int(2, 7);
        const inner = le(a, b);
        return {
          text: `Velja $\\displaystyle\\int (${inner})^${n}\\,dx = k(${inner})^{${n + 1}} + C$. Koliko je $k$? Vpiši ulomek.`,
          answer: frAns(1, a * (n + 1)),
          hint: `Uvedi novo spremenljivko $t = ${inner}$; potem je $dx = \\frac{dt}{${a}}$.`,
          data: { given: [`f(x) = (${inner})^${n}`], find: ["k"] },
          formula: ["t = ax + b,\\ dt = a\\,dx", "\\int t^n\\,dt = \\dfrac{t^{n+1}}{n + 1} + C"],
          solution: `$t = ${inner}$, $dt = ${a}\\,dx$\n$\\displaystyle\\int t^${n}\\,\\dfrac{dt}{${a}} = \\dfrac{t^{${n + 1}}}{${a} \\cdot ${n + 1}} + C$\n$k = ${ft(1, a * (n + 1))}$`,
        };
      }
      const c = r.int(1, 4);
      const n = r.int(1, 4);
      if (t === 1) {
        const m = r.pick([1, 2, 3, 4, 6]);
        return {
          text: `Velja $\\displaystyle\\int ${m === 1 ? "" : m}x(x^2 + ${c})^${n === 1 ? "{}" : n}\\,dx = k(x^2 + ${c})^{${n + 1}} + C$. Koliko je $k$? Vpiši ulomek ali celo število.`.replace("^{}", ""),
          answer: frAns(m, 2 * (n + 1)),
          hint: `Uvedi $t = x^2 + ${c}$; potem je $dt = 2x\\,dx$.`,
          data: { given: [`f(x) = ${m === 1 ? "" : m}x(x^2 + ${c})^${n === 1 ? "{}" : n}`.replace("^{}", "")], find: ["k"] },
          formula: ["t = x^2 + c,\\ dt = 2x\\,dx", "\\int t^n\\,dt = \\dfrac{t^{n+1}}{n + 1} + C"],
          solution: `$t = x^2 + ${c}$, $x\\,dx = \\dfrac{dt}{2}$\n$\\displaystyle\\int ${m === 1 ? "" : m}t^${n === 1 ? "{}" : n}\\dfrac{dt}{2} = \\dfrac{${m}}{2} \\cdot \\dfrac{t^{${n + 1}}}{${n + 1}} + C$`.replace("^{}", "") + `\n$k = ${ft(m, 2 * (n + 1))}$`,
        };
      }
      const num1 = (1 + c) ** (n + 1) - c ** (n + 1);
      return {
        text: `Funkcija $F$ je nedoločeni integral funkcije $f(x) = x(x^2 + ${c})^${n === 1 ? "{}" : n}$ in velja $F(0) = 0$. Izračunaj $F(1)$ (ulomek ali celo število).`.replace("^{}", ""),
        answer: frAns(num1, 2 * (n + 1)),
        hint: `Z uvedbo $t = x^2 + ${c}$ najprej poišči $F(x)$, nato določi konstanto iz pogoja $F(0) = 0$.`,
        data: { given: [`f(x) = x(x^2 + ${c})^${n === 1 ? "{}" : n}`.replace("^{}", ""), "F(0) = 0"], find: ["F(1)"] },
        formula: ["t = x^2 + c,\\ dt = 2x\\,dx", "\\int t^n\\,dt = \\dfrac{t^{n+1}}{n + 1} + C"],
        solution: `$F(x) = \\dfrac{(x^2 + ${c})^{${n + 1}}}{${2 * (n + 1)}} + C$\n$F(0) = \\dfrac{${c ** (n + 1)}}{${2 * (n + 1)}} + C = 0$ $\\Rightarrow$ $C = -\\dfrac{${c ** (n + 1)}}{${2 * (n + 1)}}$\n$F(1) = \\dfrac{${(1 + c) ** (n + 1)} - ${c ** (n + 1)}}{${2 * (n + 1)}} = ${ft(num1, 2 * (n + 1))}$`,
      };
    },
  },
  {
    id: P + "doloceni-integral",
    topics: [T(4, "doloceni-integral")],
    gen(level, r) {
      const ap = (x, d) => (Math.abs(x - roundHalfUp(x, d)) < 1e-9 ? "=" : "\\approx");
      if (level === 1) {
        const a = r.int(-2, 2);
        const b = r.int(-3, 3);
        const c = r.int(-6, 6);
        const fcs = [3 * a, 2 * b, c];
        if (fcs.every((x) => x === 0)) return null;
        const Fcs = [a, b, c, 0];
        const p = r.int(-2, 1);
        const q = p + r.int(1, 3);
        const v = ev(Fcs, q) - ev(Fcs, p);
        if (v === 0) return null;
        const f = poly(fcs.slice(fcs.findIndex((x) => x !== 0)));
        return {
          text: `Izračunaj $\\displaystyle\\int_{${p}}^{${q}} (${f})\\,dx$.`,
          answer: num(v, null, [{ value: -v, why: "Odštej v pravem vrstnem redu: $F(b) - F(a)$." }, { value: ev(fcs, q) - ev(fcs, p), why: "Vstaviti moraš v nedoločeni integral $F$, ne v $f$." }, { value: ev(Fcs, q), why: "Odšteti moraš še $F(" + p + ")$." }]),
          hint: "Poišči nedoločeni integral $F$ in uporabi Newton-Leibnizovo formulo.",
          data: { given: [`f(x) = ${f}`, `a = ${p}`, `b = ${q}`], find: ["I"] },
          formula: "\\int_a^b f(x)\\,dx = F(b) - F(a)",
          solution: `$F(x) = ${poly(Fcs.slice(Fcs.findIndex((x) => x !== 0)))}$\n$F(${q}) = ${ev(Fcs, q)}$, $F(${p}) = ${ev(Fcs, p)}$\n$I = ${ev(Fcs, q)} - ${ev(Fcs, p) < 0 ? `(${ev(Fcs, p)})` : ev(Fcs, p)} = ${v}$`,
        };
      }
      if (level === 2) {
        const x1 = r.int(-4, 2);
        const x2 = x1 + r.int(2, 6);
        if (r.next() < 0.5) {
          const k = r.pick([1, -1, 2, -2, 3]);
          const cs = mul([k], fromRoots([x1, x2]));
          const A = (Math.abs(k) * (x2 - x1) ** 3) / 6;
          return {
            text: `Izračunaj ploščino lika, ki ga graf funkcije $f(x) = ${poly(cs)}$ omejuje z osjo $x$. Zaokroži na dve decimalki.`,
            answer: num(A, 2, [{ value: -A, why: "Ploščina je vedno pozitivna; vzemi absolutno vrednost integrala." }, { value: (x2 - x1) ** 3 / 6, why: "Ne pozabi na vodilni koeficient." }]),
            hint: "Najprej poišči ničli (meji integrala), nato integriraj med njima in vzemi absolutno vrednost.",
            data: { given: [`f(x) = ${poly(cs)}`], find: ["S"] },
            formula: "S = \\left|\\int_{x_1}^{x_2} f(x)\\,dx\\right|",
            solution: `Ničli: $x_1 = ${x1}$, $x_2 = ${x2}$\n$\\displaystyle\\int_{${x1}}^{${x2}} (${poly(cs)})\\,dx = ${tx(roundHalfUp(k < 0 ? A : -A, 4))}$\n$S ${ap(A, 2)} ${tx(A, 2)}$`,
          };
        }
        const a = r.pick([1, -1]);
        const m = r.int(-3, 3);
        const n = r.int(-4, 4);
        const pcs = [a, m - a * (x1 + x2), n + a * x1 * x2];
        const A = (x2 - x1) ** 3 / 6;
        const P = (x) => (pcs[0] * x ** 3) / 3 + (pcs[1] * x * x) / 2 + pcs[2] * x;
        const Lin = (x) => (m * x * x) / 2 + n * x;
        return {
          text: `Izračunaj ploščino lika med parabolo $y = ${poly(pcs)}$ in premico $y = ${poly([m, n])}$. Zaokroži na dve decimalki.`,
          answer: num(A, 2, [{ value: P(x2) - P(x1), why: "Integrirati moraš razliko obeh funkcij, ne le parabole." }, { value: Lin(x2) - Lin(x1), why: "Integrirati moraš razliko obeh funkcij, ne le premice." }]),
          hint: "Poišči presečišči (reši enačbo parabola = premica), nato integriraj razliko zgornje in spodnje funkcije.",
          data: { given: [`y = ${poly(pcs)}`, `y = ${poly([m, n])}`], find: ["S"] },
          formula: "S = \\int_{x_1}^{x_2} \\big(g(x) - f(x)\\big)\\,dx",
          solution: `Presečišči: $${poly(pcs)} = ${poly([m, n])}$ $\\Rightarrow$ $${poly(mul([a], fromRoots([x1, x2])))} = 0$, $x_1 = ${x1}$, $x_2 = ${x2}$\nZgornja je ${a > 0 ? "premica" : "parabola"}: $S = \\displaystyle\\int_{${x1}}^{${x2}} ${a > 0 ? "-" : ""}(${poly(mul([a], fromRoots([x1, x2])))})\\,dx$\n$S = \\dfrac{${(x2 - x1) ** 3}}{6} ${ap(A, 2)} ${tx(A, 2)}$`,
        };
      }
      const t = r.int(0, 1);
      if (t === 0) {
        const kind = r.pick(["sqrt", "lin", "sq", "inv"]);
        let f, f2, V, Vnp, Vnosq, lim, steps;
        if (kind === "sqrt") {
          const k = r.int(1, 4);
          const a = r.int(1, 6);
          f = `\\sqrt{${k === 1 ? "" : k}x}`;
          f2 = `${k === 1 ? "" : k}x`;
          lim = [0, a];
          V = (Math.PI * k * a * a) / 2;
          Vnosq = Math.PI * ((2 / 3) * Math.sqrt(k) * a ** 1.5);
          steps = `$V = \\pi\\displaystyle\\int_0^{${a}} ${k === 1 ? "" : k}x\\,dx = \\pi \\cdot \\dfrac{${k === 1 ? "" : k}x^2}{2}\\Big|_0^{${a}} = \\dfrac{${k * a * a}\\pi}{2}$`;
        } else if (kind === "lin") {
          const k = r.pick([0.5, 1, 2, 3]);
          const h = r.int(1, 5);
          f = `${k === 1 ? "" : tx(k)}x`;
          f2 = `${k === 1 ? "" : tx(k * k)}x^2`;
          lim = [0, h];
          V = (Math.PI * k * k * h ** 3) / 3;
          Vnosq = (Math.PI * k * h * h) / 2;
          steps = `$V = \\pi\\displaystyle\\int_0^{${h}} ${k === 1 ? "" : `${tx(k * k)}`}x^2\\,dx = \\pi \\cdot ${k === 1 ? "" : tx(k * k)}\\dfrac{x^3}{3}\\Big|_0^{${h}} = \\dfrac{${tx(k * k * h ** 3)}\\pi}{3}$`;
        } else if (kind === "sq") {
          const a = r.int(1, 3);
          f = "x^2";
          f2 = "x^4";
          lim = [0, a];
          V = (Math.PI * a ** 5) / 5;
          Vnosq = (Math.PI * a ** 3) / 3;
          steps = `$V = \\pi\\displaystyle\\int_0^{${a}} x^4\\,dx = \\pi \\cdot \\dfrac{x^5}{5}\\Big|_0^{${a}} = \\dfrac{${a ** 5}\\pi}{5}$`;
        } else {
          const b = r.int(2, 6);
          f = "\\dfrac{1}{x}";
          f2 = "\\dfrac{1}{x^2}";
          lim = [1, b];
          V = Math.PI * (1 - 1 / b);
          Vnosq = Math.PI * Math.log(b);
          steps = `$V = \\pi\\displaystyle\\int_1^{${b}} \\dfrac{1}{x^2}\\,dx = \\pi\\left(-\\dfrac{1}{x}\\right)\\Big|_1^{${b}} = \\pi\\left(1 - \\dfrac{1}{${b}}\\right)$`;
        }
        Vnp = V / Math.PI;
        return {
          text: `Lik pod grafom funkcije $f(x) = ${f}$ na intervalu $[${lim[0]}, ${lim[1]}]$ zavrtimo okoli osi $x$. Izračunaj prostornino nastale vrtenine. Zaokroži na dve decimalki.`,
          answer: num(V, 2, [{ value: Vnp, why: "Ne pozabi na faktor $\\pi$ pred integralom." }, { value: Vnosq, why: "Pod integralom je kvadrat funkcije: $V = \\pi\\int f^2(x)\\,dx$." }]),
          hint: "Prostornina vrtenine okoli osi $x$: integriraj kvadrat funkcije in pomnoži s $\\pi$.",
          data: { given: [`f(x) = ${f}`, `a = ${lim[0]}`, `b = ${lim[1]}`], find: ["V"] },
          formula: "V = \\pi \\int_a^b f^2(x)\\,dx",
          solution: `$f^2(x) = ${f2}$\n${steps}\n$V ${ap(V, 2)} ${tx(V, 2)}$`,
        };
      }
      const cc = r.int(1, 3);
      const b = cc + r.int(1, 3);
      const F = (x) => x ** 3 / 3 - cc * cc * x;
      const net = F(b) - F(0);
      const A = Math.abs(F(cc) - F(0)) + Math.abs(F(b) - F(cc));
      return {
        text: `Izračunaj ploščino lika, ki ga omejujejo graf funkcije $f(x) = x^2 - ${cc * cc}$, os $x$ ter premici $x = 0$ in $x = ${b}$. Zaokroži na dve decimalki.`,
        answer: num(A, 2, [{ value: net, why: "Del lika leži pod osjo $x$; tam je integral negativen. Interval razdeli pri ničli." }, { value: Math.abs(net), why: "Absolutna vrednost celotnega integrala ni ploščina, ker funkcija spremeni predznak." }]),
        hint: "Funkcija na intervalu spremeni predznak. Poišči ničlo in integriraj po delih.",
        data: { given: [`f(x) = x^2 - ${cc * cc}`, `x = ${b}`], find: ["S"] },
        formula: "S = \\left|\\int_0^{x_0} f\\,dx\\right| + \\left|\\int_{x_0}^{b} f\\,dx\\right|",
        solution: `Ničla: $x_0 = ${cc}$; $F(x) = \\dfrac{x^3}{3} ${tm(-cc * cc, "x")}$\n$\\displaystyle\\int_0^{${cc}} f\\,dx ${ap(F(cc), 4)} ${tx(roundHalfUp(F(cc), 4))}$, $\\displaystyle\\int_{${cc}}^{${b}} f\\,dx ${ap(F(b) - F(cc), 4)} ${tx(roundHalfUp(F(b) - F(cc), 4))}$\n$S ${ap(A, 2)} ${tx(A, 2)}$`,
      };
    },
  },
  {
    id: P + "kombinatorika",
    topics: [T(4, "kombinatorika")],
    gen(level, r) {
      const who = name(r);
      if (level === 1) {
        const t = r.int(0, 3);
        if (t === 0) {
          const n = r.int(4, 8);
          const what = r.pick([["različnih knjig na polico", "knjig"], ["tekmovalcev v vrsto za fotografijo", "tekmovalcev"], ["različnih pesmi v seznam predvajanja", "pesmi"], ["gostov za okroglo… za ravno mizo", "gostov"]]);
          const obj = what[0].includes("gostov") ? "gostov na sedeže ob ravni mizi" : what[0];
          return {
            text: `Na koliko načinov lahko razvrstimo $${n}$ ${obj}?`,
            answer: num(fact(n), null, [{ value: n * n, why: "Za prvo mesto je $n$ možnosti, za drugo le še $n - 1$ …" }, { value: fact(n - 1), why: "Razvrščamo vseh $" + n + "$, ne $" + (n - 1) + "$." }]),
            hint: "Gre za permutacije: za prvo mesto imaš $n$ možnosti, za drugo $n - 1$, …",
            data: { given: [`n = ${n}`], find: ["P_n"] },
            formula: "P_n = n!",
            solution: `$P_{${n}} = ${n}! = ${Array.from({ length: n }, (_, i) => n - i).join(" \\cdot ")}$\n$P_{${n}} = ${fact(n)}$`,
          };
        }
        if (t === 1) {
          const n = r.int(5, 12);
          const ctx = r.pick([`Na teku nastopa $${n}$ tekačev. Na koliko načinov se lahko razdelijo zlata, srebrna in bronasta medalja?`, `Razred s $${n}$ dijaki izbira predsednika, podpredsednika in blagajnika. Na koliko načinov lahko izbere?`]);
          return {
            text: ctx,
            answer: num(V(n, 3), null, [{ value: C(n, 3), why: "Vrstni red je pomemben (različne vloge), zato gre za variacije, ne kombinacije." }, { value: n ** 3, why: "Ista oseba ne more dobiti dveh vlog: ponavljanje ni dovoljeno." }]),
            hint: "Vrstni red je pomemben, ponavljanja ni: variacije brez ponavljanja.",
            data: { given: [`n = ${n}`], find: ["V_n^3"] },
            formula: "V_n^r = \\dfrac{n!}{(n - r)!}",
            solution: `$V_{${n}}^3 = ${n} \\cdot ${n - 1} \\cdot ${n - 2}$\n$V_{${n}}^3 = ${V(n, 3)}$`,
          };
        }
        if (t === 2) {
          const n = r.int(6, 15);
          const k = r.int(2, 4);
          const ctx = r.pick([`Iz skupine $${n}$ dijakov izberemo $${k}$, ki gredo na tekmovanje. Na koliko načinov lahko izberemo?`, `${who} ima $${n}$ različnih majic in jih bo $${k}$ vzel${g(who, "", "a")} na izlet. Na koliko načinov lahko izbere?`]);
          return {
            text: ctx,
            answer: num(C(n, k), null, [{ value: V(n, k), why: "Vrstni red izbranih ni pomemben, zato deli s $" + k + "!$ (kombinacije)." }, { value: n * k, why: "Uporabi formulo za kombinacije." }]),
            hint: "Vrstni red ni pomemben: kombinacije.",
            data: { given: [`n = ${n}`, `r = ${k}`], find: ["C_n^r"] },
            formula: "C_n^r = \\dbinom{n}{r} = \\dfrac{n!}{r!(n - r)!}",
            solution: `$C_{${n}}^{${k}} = \\dbinom{${n}}{${k}} = \\dfrac{${Array.from({ length: k }, (_, i) => n - i).join(" \\cdot ")}}{${k}!}$\n$C_{${n}}^{${k}} = ${C(n, k)}$`,
          };
        }
        const m = r.pick([2, 4, 5, 6, 10]);
        const k = r.int(3, 5);
        const ctx = m === 10 ? `Koliko različnih ${k}-mestnih kod PIN (števke od 0 do 9, lahko se ponavljajo) obstaja?` : `Ključavnica ima $${k}$ ${k < 5 ? "kolesa" : "koles"}, na vsakem ${m === 2 ? "sta" : m < 5 ? "so" : "je"} $${m}$ ${m === 2 ? "simbola" : m < 5 ? "simboli" : "simbolov"}. Koliko različnih kombinacij lahko nastavimo?`;
        return {
          text: ctx,
          answer: num(m ** k, null, [{ value: V(m, k) || NaN, why: "Simboli se lahko ponavljajo." }, { value: k ** m, why: "Za vsako od $" + k + "$ mest je $" + m + "$ možnosti: $" + m + "^" + k + "$." }]),
          hint: "Za vsako mesto izbiraš neodvisno: variacije s ponavljanjem.",
          data: { given: m === 10 ? [`r = ${k}`] : [`n = ${m}`, `r = ${k}`], find: ["\\overline{V}_n^r"] },
          formula: "\\overline{V}_n^r = n^r",
          solution: `Za vsako od $${k}$ mest je $${m}$ možnosti.\n$${m}^${k} = ${m ** k}$`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 3);
        if (t === 0) {
          const gN = r.int(4, 10);
          const bN = r.int(4, 10);
          const x = r.int(1, 3);
          const y = r.int(1, 3);
          return {
            text: `V razredu je $${gN}$ deklet in $${bN}$ fantov. Za šolski parlament izberejo $${x}$ ${x === 1 ? "dekle" : "dekleti"} in $${y}$ ${y === 1 ? "fanta" : y === 2 ? "fanta" : "fante"}. Na koliko načinov lahko izberejo?`.replace("$3$ dekleti", "$3$ dekleta"),
            answer: num(C(gN, x) * C(bN, y), null, [{ value: C(gN, x) + C(bN, y), why: "Izbiri dekleta in fantov sta neodvisni: možnosti zmnoži (pravilo produkta)." }, { value: C(gN + bN, x + y), why: "Tako ne zagotoviš, da bo izbranih natanko $" + x + "$ deklet." }]),
            hint: "Posebej izberi dekleta in posebej fante, nato uporabi pravilo produkta.",
            data: { given: [`n_d = ${gN}`, `n_f = ${bN}`], find: ["N"] },
            formula: ["N = \\dbinom{n_d}{x} \\cdot \\dbinom{n_f}{y}"],
            solution: `Dekleta: $\\dbinom{${gN}}{${x}} = ${C(gN, x)}$, fantje: $\\dbinom{${bN}}{${y}} = ${C(bN, y)}$\n$N = ${C(gN, x)} \\cdot ${C(bN, y)} = ${C(gN, x) * C(bN, y)}$`,
          };
        }
        if (t === 1) {
          const w = r.pick(["ANANAS", "BANANA", "KOKOS", "MAMICA", "LOKOMOTIVA", "MATEMATIKA", "KAKAV", "ALPAKA", "BARABA", "PAPAGAJ", "TOBOGAN", "KOKOŠ"]);
          const cnt = {};
          for (const ch of w) cnt[ch] = (cnt[ch] || 0) + 1;
          const reps = Object.entries(cnt).filter(([, v]) => v > 1);
          const val = fact(w.length) / reps.reduce((p, [, v]) => p * fact(v), 1);
          return {
            text: `Koliko različnih »besed« (zaporedij črk, ne nujno smiselnih) lahko sestavimo iz vseh črk besede ${w}?`,
            answer: num(val, null, [{ value: fact(w.length), why: "Enake črke med seboj zamenjane ne dajo nove besede: deli s permutacijami ponovljenih črk." }]),
            hint: "Permutacije s ponavljanjem: $n!$ deli s faktorielami števila ponovitev posameznih črk.",
            data: { given: [`\\text{beseda} = \\text{${w}}`], find: ["P"] },
            formula: "P_n^{k_1, k_2, \\ldots} = \\dfrac{n!}{k_1!\\,k_2!\\cdots}",
            solution: `Črk je ${w.length}; ponovijo se: ${reps.map(([c, v]) => `${c} (${v}-krat)`).join(", ")}.\n$P = \\dfrac{${w.length}!}{${reps.map(([, v]) => `${v}!`).join(" \\cdot ")}} = ${val}$`,
          };
        }
        if (t === 2) {
          const n = r.int(5, 20);
          return {
            text: `Koliko diagonal ima konveksni ${n}-kotnik?`,
            answer: num((n * (n - 3)) / 2, null, [{ value: C(n, 2), why: "Med daljicami med oglišči so tudi stranice; te odštej." }, { value: n * (n - 3), why: "Vsako diagonalo si štel dvakrat (iz obeh krajišč)." }]),
            hint: "Vsak par oglišč določa daljico; nekatere od teh daljic so stranice.",
            data: { given: [`n = ${n}`], find: ["d"] },
            formula: "d = \\dbinom{n}{2} - n",
            solution: `Daljic med oglišči: $\\dbinom{${n}}{2} = ${C(n, 2)}$\n$d = ${C(n, 2)} - ${n} = ${(n * (n - 3)) / 2}$`,
          };
        }
        const n = r.int(6, 30);
        const ctx = r.pick([`Na srečanju se vsak od $${n}$ udeležencev rokuje z vsakim drugim natanko enkrat. Koliko je vseh rokovanj?`, `V šahovskem turnirju igra vsak od $${n}$ igralcev z vsakim drugim natanko eno partijo. Koliko partij odigrajo?`]);
        return {
          text: ctx,
          answer: num(C(n, 2), null, [{ value: n * (n - 1), why: "Vsak par si štel dvakrat; vrstni red v paru ni pomemben." }, { value: n * n, why: "Nihče ne igra (se ne rokuje) sam s seboj, pare pa štej enkrat." }]),
          hint: "Vsako srečanje določa neurejen par oseb.",
          data: { given: [`n = ${n}`], find: ["N"] },
          formula: "N = \\dbinom{n}{2} = \\dfrac{n(n - 1)}{2}",
          solution: `$N = \\dbinom{${n}}{2} = \\dfrac{${n} \\cdot ${n - 1}}{2}$\n$N = ${C(n, 2)}$`,
        };
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const k = r.int(3, 4);
        const gN = r.int(3, 8);
        const bN = r.int(k, 8);
        const n = gN + bN;
        const ans = C(n, k) - C(bN, k);
        return {
          text: `V skupini je $${gN}$ deklet in $${bN}$ fantov. Na koliko načinov lahko izberemo $${k}$-člansko ekipo, v kateri je vsaj eno dekle?`,
          answer: num(ans, null, [{ value: gN * C(n - 1, k - 1), why: "Tako nekatere ekipe štejemo večkrat. Uporabi nasprotni dogodek." }, { value: C(n, k), why: "Odšteti moraš ekipe brez deklet." }]),
          hint: "Uporabi nasprotni dogodek: od vseh ekip odštej tiste, v katerih so sami fantje.",
          data: { given: [`n_d = ${gN}`, `n_f = ${bN}`, `k = ${k}`], find: ["N"] },
          formula: "N = \\dbinom{n}{k} - \\dbinom{n_f}{k}",
          solution: `Vseh ekip: $\\dbinom{${n}}{${k}} = ${C(n, k)}$\nEkip samih fantov: $\\dbinom{${bN}}{${k}} = ${C(bN, k)}$\n$N = ${C(n, k)} - ${C(bN, k)} = ${ans}$`,
        };
      }
      if (t === 1) {
        const n = r.int(5, 8);
        const n1 = name(r);
        let n2 = name(r);
        while (n2 === n1) n2 = name(r);
        const together = r.next() < 0.5;
        const ans = together ? 2 * fact(n - 1) : fact(n) - 2 * fact(n - 1);
        return {
          text: `$${n}$ prijateljev, med njimi ${n1} in ${n2}, se posede v vrsto v kinu. Na koliko načinov se lahko posedejo, če ${together ? "želita" : "nočeta"} ${n1} in ${n2} sedeti skupaj?`,
          answer: num(ans, null, together ? [{ value: fact(n - 1), why: "Znotraj para lahko sedita v dveh vrstnih redih." }, { value: fact(n), why: "To je število vseh razporeditev brez pogoja." }] : [{ value: fact(n) - fact(n - 1), why: "Par ima dva vrstna reda: razporeditev skupaj je $2 \\cdot (n - 1)!$." }, { value: fact(n), why: "Odšteti moraš razporeditve, kjer sedita skupaj." }]),
          hint: together ? "Par obravnavaj kot eno osebo, nato upoštevaj še vrstni red znotraj para." : "Od vseh razporeditev odštej tiste, v katerih sedita skupaj.",
          data: { given: [`n = ${n}`], find: ["N"] },
          formula: together ? "N = 2 \\cdot (n - 1)!" : "N = n! - 2 \\cdot (n - 1)!",
          solution: `Skupaj: par je en »blok«, torej $(${n} - 1)! \\cdot 2 = ${2 * fact(n - 1)}$.${together ? "" : `\nVseh razporeditev: $${n}! = ${fact(n)}$.`}\n$N = ${together ? `${2 * fact(n - 1)}` : `${fact(n)} - ${2 * fact(n - 1)} = ${ans}`}$`,
        };
      }
      const m = r.int(4, 7); // števke 0..m
      const k = r.int(3, 4);
      const ans = m * V(m, k - 1);
      return {
        text: `Koliko ${k}-mestnih števil z različnimi števkami lahko sestavimo iz števk $${Array.from({ length: m + 1 }, (_, i) => i).join(", ")}$?`,
        answer: num(ans, null, [{ value: V(m + 1, k), why: "Število se ne sme začeti z 0." }, { value: m * (m + 1) ** (k - 1), why: "Števke morajo biti različne." }]),
        hint: "Najprej izberi prvo števko (ne sme biti 0), nato ostale izmed preostalih števk.",
        data: { given: [`\\text{števke} = ${Array.from({ length: m + 1 }, (_, i) => i).join(", ")}`, `k = ${k}`], find: ["N"] },
        formula: "N = (n - 1) \\cdot V_{n-1}^{k-1}",
        solution: `Prva števka: $${m}$ možnosti (vse razen 0).\nOstalih $${k - 1}$ mest: $V_{${m}}^{${k - 1}} = ${V(m, k - 1)}$\n$N = ${m} \\cdot ${V(m, k - 1)} = ${ans}$`,
      };
    },
  },
  {
    id: P + "statistika",
    topics: [T(4, "statistika")],
    gen(level, r) {
      const who = name(r);
      const ap = (x, d) => (Math.abs(x - roundHalfUp(x, d)) < 1e-9 ? "=" : "\\approx");
      const CTX = [
        [`${who} je pri testih dosegel${g(who, "", "a")} točke`, "", 8, 30],
        ["Najnižje jutranje temperature zadnjih dni (v $^\\circ\\mathrm{C}$) so bile", "", -6, 9],
        ["Višine sadik paradižnika (v cm) so", "", 12, 40],
        ["Število obiskovalcev knjižnice po dnevih je bilo", "", 20, 70],
        ["Čas teka na 60 m (v sekundah, zaokroženo) je bil", "", 7, 12],
      ];
      const dataset = (n) => {
        const [lead, , lo, hi] = r.pick(CTX);
        const xs = Array.from({ length: n }, () => r.int(lo, hi));
        return { lead, xs };
      };
      const mean = (xs) => xs.reduce((p, q) => p + q, 0) / xs.length;
      const median = (xs) => {
        const s = [...xs].sort((p, q) => p - q);
        const m = s.length >> 1;
        return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
      };
      const listTex = (xs) => xs.join(";\\ ");
      if (level === 1) {
        const n = r.int(6, 9);
        const { lead, xs } = dataset(n);
        const m = mean(xs);
        const med = median(xs);
        if (Math.abs(m - med) < 1e-9) return null;
        if (r.next() < 0.5) {
          return {
            text: `${lead}: $${listTex(xs)}$. Izračunaj aritmetično sredino. Zaokroži na dve decimalki.`,
            answer: num(m, 2, [{ value: med, why: "To je mediana (srednja vrednost urejenih podatkov), ne aritmetična sredina." }, { value: xs.reduce((p, q) => p + q, 0) / (n - 1), why: "Vsoto deliš s številom podatkov (" + n + ")." }]),
            hint: "Seštej vse podatke in vsoto deli s številom podatkov.",
            data: { given: [`x_i = ${listTex(xs)}`], find: ["\\bar{x}"] },
            formula: "\\bar{x} = \\dfrac{x_1 + x_2 + \\ldots + x_n}{n}",
            solution: `Vsota: $${xs.reduce((p, q) => p + q, 0)}$, $n = ${n}$\n$\\bar{x} = \\dfrac{${xs.reduce((p, q) => p + q, 0)}}{${n}} ${ap(m, 2)} ${tx(m, 2)}$`,
          };
        }
        const unsortedMid = n % 2 ? xs[n >> 1] : (xs[n / 2 - 1] + xs[n / 2]) / 2;
        const sorted = [...xs].sort((p, q) => p - q);
        return {
          text: `${lead}: $${listTex(xs)}$. Določi mediano.`,
          answer: num(med, null, [{ value: unsortedMid, why: "Podatke moraš najprej urediti po velikosti." }, { value: m, why: "To je aritmetična sredina, ne mediana." }]),
          hint: n % 2 ? "Podatke uredi po velikosti; mediana je srednji podatek." : "Podatke uredi po velikosti; pri sodem številu podatkov je mediana povprečje srednjih dveh.",
          data: { given: [`x_i = ${listTex(xs)}`], find: ["Me"] },
          formula: n % 2 ? "Me = x_{(n+1)/2}" : "Me = \\dfrac{x_{n/2} + x_{n/2 + 1}}{2}",
          solution: `Urejeni podatki: $${listTex(sorted)}$\n$Me = ${n % 2 ? tx(med) : `\\dfrac{${sorted[n / 2 - 1]} + ${sorted[n / 2]}}{2} = ${tx(med)}`}$`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 3);
        if (t === 0) {
          const n = r.int(4, 6);
          const { lead, xs } = dataset(n);
          const m = mean(xs);
          const v = xs.reduce((p, q) => p + (q - m) ** 2, 0) / n;
          if (v === 0) return null;
          return {
            text: `${lead}: $${listTex(xs)}$. Izračunaj standardni odklon $\\sigma$. Zaokroži na dve decimalki.`,
            answer: num(Math.sqrt(v), 2, [{ value: v, why: "To je varianca; standardni odklon je njen koren." }, { value: Math.sqrt((v * n) / (n - 1)), why: "Pri $\\sigma$ deliš s številom podatkov $n$, ne z $n - 1$." }]),
            hint: "Izračunaj aritmetično sredino, nato povprečje kvadratov odklonov od nje, na koncu koreni.",
            data: { given: [`x_i = ${listTex(xs)}`], find: ["\\sigma"] },
            formula: ["\\bar{x} = \\dfrac{1}{n}\\sum x_i", "\\sigma = \\sqrt{\\dfrac{1}{n}\\sum (x_i - \\bar{x})^2}"],
            solution: `$\\bar{x} ${ap(m, 4)} ${tx(roundHalfUp(m, 4))}$\n$\\sigma^2 = \\dfrac{1}{${n}}\\sum (x_i - \\bar{x})^2 ${ap(v, 4)} ${tx(roundHalfUp(v, 4))}$\n$\\sigma ${ap(Math.sqrt(v), 2)} ${tx(Math.sqrt(v), 2)}$`,
          };
        }
        if (t === 1) {
          const n1 = r.int(12, 30);
          let n2;
          do n2 = r.int(10, 32);
          while (n2 === n1);
          const m1 = r.dec(2.5, 4.6, 1);
          let m2;
          do m2 = r.dec(2.5, 4.6, 1);
          while (Math.abs(m2 - m1) < 0.2);
          const M = (n1 * m1 + n2 * m2) / (n1 + n2);
          return {
            text: `V razredu 4.a je $${n1}$ dijakov s povprečno oceno $${tx(m1)}$, v razredu 4.b pa $${n2}$ dijakov s povprečno oceno $${tx(m2)}$. Kolikšna je povprečna ocena vseh dijakov obeh razredov? Zaokroži na dve decimalki.`,
            answer: num(M, 2, [{ value: (m1 + m2) / 2, why: "Razreda nista enako velika: povprečji moraš utežiti s številom dijakov." }]),
            hint: "Izračunaj vsoto vseh ocen v vsakem razredu (povprečje · število), nato deli s skupnim številom dijakov.",
            data: { given: [`n_1 = ${n1}`, `\\bar{x}_1 = ${tx(m1)}`, `n_2 = ${n2}`, `\\bar{x}_2 = ${tx(m2)}`], find: ["\\bar{x}"] },
            formula: "\\bar{x} = \\dfrac{n_1\\bar{x}_1 + n_2\\bar{x}_2}{n_1 + n_2}",
            solution: `Vsota ocen: $${n1} \\cdot ${tx(m1)} + ${n2} \\cdot ${tx(m2)} = ${tx(roundHalfUp(n1 * m1 + n2 * m2, 2))}$\n$\\bar{x} = \\dfrac{${tx(roundHalfUp(n1 * m1 + n2 * m2, 2))}}{${n1 + n2}} ${ap(M, 2)} ${tx(M, 2)}$`,
          };
        }
        if (t === 2) {
          const n = r.int(5, 8);
          const xs = Array.from({ length: n - 1 }, () => r.int(40, 95));
          const target = r.int(55, 85);
          const missing = target * n - xs.reduce((p, q) => p + q, 0);
          if (missing < 0 || missing > 100) return null;
          return {
            text: `${who} je ${g(who, "pisal", "pisala")} ${n} testov. Pri prvih ${n - 1} je ${g(who, "dosegel", "dosegla")} $${listTex(xs)}$ točk. Koliko točk mora doseči pri zadnjem testu, da bo povprečje natanko $${target}$?`,
            answer: num(missing, null, [{ value: target * (n - 1) - xs.reduce((p, q) => p + q, 0), why: "Skupna vsota mora biti povprečje krat število vseh testov (" + n + ")." }, { value: target, why: "Zadnji rezultat mora nadomestiti tudi primanjkljaj (ali presežek) prejšnjih testov." }]),
            hint: "Iz povprečja izračunaj potrebno skupno vsoto točk vseh testov.",
            data: { given: [`x_i = ${listTex(xs)}`, `\\bar{x} = ${target}`], find: [`x_{${n}}`] },
            formula: "x_1 + \\ldots + x_n = n \\cdot \\bar{x}",
            solution: `Potrebna vsota: $${n} \\cdot ${target} = ${n * target}$\nDosedanja vsota: $${xs.reduce((p, q) => p + q, 0)}$\n$x_{${n}} = ${n * target} - ${xs.reduce((p, q) => p + q, 0)} = ${missing}$`,
          };
        }
        const mu = r.pick([[170, 8, "cm"], [100, 15, ""], [500, 4, "ml"], [60, 12, "točk"], [150, 20, "g"]]);
        const z = r.nonZero(-25, 25) / 10;
        const x = mu[0] + z * mu[1];
        return {
          text: `Količina je normalno porazdeljena s pričakovano vrednostjo $\\mu = ${mu[0]}$ in standardnim odklonom $\\sigma = ${mu[1]}$. Kolikšna je standardizirana vrednost $z$ za $x = ${tx(x)}$?`,
          answer: num(z, 2, [{ value: (x - mu[0]) / (mu[1] * mu[1]), why: "Deliš s standardnim odklonom, ne z varianco." }, { value: x / mu[1], why: "Najprej odštej pričakovano vrednost." }]),
          hint: "Standardizirana vrednost pove, za koliko standardnih odklonov je $x$ oddaljen od $\\mu$.",
          data: { given: [`\\mu = ${mu[0]}`, `\\sigma = ${mu[1]}`, `x = ${tx(x)}`], find: ["z"] },
          formula: "z = \\dfrac{x - \\mu}{\\sigma}",
          solution: `$z = \\dfrac{${tx(x)} - ${mu[0]}}{${mu[1]}} = \\dfrac{${tx(roundHalfUp(x - mu[0], 2))}}{${mu[1]}}$\n$z = ${tx(z)}$`,
        };
      }
      // normalna porazdelitev s tabelo Φ(z) = P(0 ≤ Z ≤ z)
      const erf = (x) => {
        const s = Math.sign(x);
        const a = Math.abs(x);
        const tt = 1 / (1 + 0.3275911 * a);
        const y = 1 - ((((1.061405429 * tt - 1.453152027) * tt + 1.421413741) * tt - 0.284496736) * tt + 0.254829592) * tt * Math.exp(-a * a);
        return s * y;
      };
      const Phi = (z) => roundHalfUp(0.5 * erf(z / Math.SQRT2), 4);
      const ctx = r.pick([
        ["Višina dijakov je normalno porazdeljena", 170, 8, "cm"],
        ["Masa jabolk v zaboju je normalno porazdeljena", 150, 20, "g"],
        ["Količina soka v plastenkah je normalno porazdeljena", 500, 4, "ml"],
        ["Število točk na maturitetnem preizkusu je normalno porazdeljeno", 60, 12, "točk"],
        ["Čas vožnje do šole je normalno porazdeljen", 25, 5, "min"],
      ]);
      const [lead, mu, sd, u] = ctx;
      const uT = u === "točk" ? "\\text{ točk}" : `\\ \\mathrm{${u}}`;
      const t = r.int(0, 2);
      const PH = "\\Phi(z) = P(0 \\le Z \\le z)";
      if (t === 0) {
        const z = r.int(3, 25) / 10;
        const x = mu + z * sd;
        const ph = Phi(z);
        const above = r.next() < 0.5;
        const p = above ? 0.5 - ph : 0.5 + ph;
        return {
          text: `${lead} s $\\mu = ${mu}${uT}$ in $\\sigma = ${sd}${uT}$. Kolikšen odstotek vrednosti je ${above ? "večjih" : "manjših"} od $${tx(x)}${uT}$? Uporabi $\\Phi(${tx(z)}) = ${tx(ph)}$, kjer je $${PH}$. Zaokroži na dve decimalki.`,
          answer: num(p * 100, 2, [{ value: ph * 100, why: "$\\Phi(z)$ je verjetnost le med 0 in $z$; prištej ali odštej polovico (0,5)." }, { value: (above ? 0.5 + ph : 0.5 - ph) * 100, why: "Preveri, ali iščeš del nad ali pod vrednostjo $x$." }], "%"),
          hint: "Izračunaj $z = \\frac{x - \\mu}{\\sigma}$. Polovica vseh vrednosti je pod $\\mu$, polovica nad njo.",
          data: { given: [`\\mu = ${mu}${uT}`, `\\sigma = ${sd}${uT}`, `x = ${tx(x)}${uT}`, `\\Phi(${tx(z)}) = ${tx(ph)}`], find: ["P"] },
          formula: ["z = \\dfrac{x - \\mu}{\\sigma}", above ? "P(X > x) = 0{,}5 - \\Phi(z)" : "P(X < x) = 0{,}5 + \\Phi(z)"],
          solution: `$z = \\dfrac{${tx(x)} - ${mu}}{${sd}} = ${tx(z)}$\n$P = 0{,}5 ${above ? "-" : "+"} ${tx(ph)} = ${tx(p)}$\nTo je $${tx(p * 100, 2)}\\ \\%$.`,
        };
      }
      if (t === 1) {
        const z1 = r.int(3, 20) / 10;
        let z2;
        do z2 = r.int(3, 25) / 10;
        while (z2 === z1);
        const x1 = mu - z1 * sd;
        const x2 = mu + z2 * sd;
        const p1 = Phi(z1);
        const p2 = Phi(z2);
        const p = p1 + p2;
        return {
          text: `${lead} s $\\mu = ${mu}${uT}$ in $\\sigma = ${sd}${uT}$. Kolikšen odstotek vrednosti leži med $${tx(x1)}$ in $${tx(x2)}${uT}$? Uporabi $\\Phi(${tx(z1)}) = ${tx(p1)}$ in $\\Phi(${tx(z2)}) = ${tx(p2)}$ ($${PH}$). Zaokroži na dve decimalki.`,
          answer: num(p * 100, 2, [{ value: Math.abs(p2 - p1) * 100, why: "Meji ležita na različnih straneh $\\mu$: verjetnosti seštej." }, { value: (1 - p) * 100, why: "Iščeš del med mejama, ne zunaj njiju." }], "%"),
          hint: "Izračunaj $z_1$ in $z_2$. Ker ležita na nasprotnih straneh $\\mu$, uporabi simetrijo: $\\Phi(-z) = -\\Phi(z)$.",
          data: { given: [`\\mu = ${mu}${uT}`, `\\sigma = ${sd}${uT}`, `x_1 = ${tx(x1)}`, `x_2 = ${tx(x2)}${uT}`, `\\Phi(${tx(z1)}) = ${tx(p1)}`, `\\Phi(${tx(z2)}) = ${tx(p2)}`], find: ["P"] },
          formula: ["z = \\dfrac{x - \\mu}{\\sigma}", "P(x_1 < X < x_2) = \\Phi(z_2) - \\Phi(z_1)"],
          solution: `$z_1 = \\dfrac{${tx(x1)} - ${mu}}{${sd}} = ${tx(-z1)}$, $z_2 = \\dfrac{${tx(x2)} - ${mu}}{${sd}} = ${tx(z2)}$\n$P = \\Phi(${tx(z2)}) - \\Phi(${tx(-z1)}) = ${tx(p2)} + ${tx(p1)} = ${tx(p)}$\nTo je $${tx(p * 100, 2)}\\ \\%$.`,
        };
      }
      const z = r.int(5, 25) / 10;
      const N = r.pick([200, 500, 800, 1000, 1200, 2000]);
      const x = mu - z * sd;
      const ph = Phi(z);
      const cnt = N * (0.5 - ph);
      return {
        text: `${lead} s $\\mu = ${mu}${uT}$ in $\\sigma = ${sd}${uT}$. Pri koliko od $${N}$ primerov pričakujemo vrednost, manjšo od $${tx(x)}${uT}$? Uporabi $\\Phi(${tx(z)}) = ${tx(ph)}$ ($${PH}$). Zaokroži na celo število.`,
        answer: num(cnt, 0, [{ value: N * (0.5 + ph), why: "Vrednost je pod $\\mu$, zato je $P(X < x) = 0{,}5 - \\Phi(|z|)$." }, { value: N * ph, why: "$\\Phi(z)$ je verjetnost med $\\mu$ in $x$; iščeš del pod $x$." }]),
        hint: "Izračunaj $z$ (negativen je), nato verjetnost $P(X < x)$ in jo pomnoži s številom primerov.",
        data: { given: [`\\mu = ${mu}${uT}`, `\\sigma = ${sd}${uT}`, `x = ${tx(x)}${uT}`, `N = ${N}`, `\\Phi(${tx(z)}) = ${tx(ph)}`], find: ["n"] },
        formula: ["z = \\dfrac{x - \\mu}{\\sigma}", "P(X < x) = 0{,}5 - \\Phi(|z|)", "n = N \\cdot P"],
        solution: `$z = \\dfrac{${tx(x)} - ${mu}}{${sd}} = ${tx(-z)}$\n$P(X < ${tx(x)}) = 0{,}5 - ${tx(ph)} = ${tx(roundHalfUp(0.5 - ph, 4))}$\n$n = ${N} \\cdot ${tx(roundHalfUp(0.5 - ph, 4))} ${ap(cnt, 0)} ${tx(cnt, 0)}$`,
      };
    },
  },
  {
    id: P + "mesane-maturitetne-naloge",
    topics: [T(4, "mesane-maturitetne-naloge")],
    gen(level, r) {
      const who = name(r);
      const ap = (x, d) => (Math.abs(x - roundHalfUp(x, d)) < 1e-9 ? "=" : "\\approx");
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const P0 = r.int(20, 300);
          const p = r.pick([10, 15, 20, 25, 30]);
          let q;
          do q = r.pick([10, 15, 20, 25, 30]);
          while (q === p);
          const end = P0 * (1 + p / 100) * (1 - q / 100);
          const item = r.pick(["kolesa", "slušalk", "telefona", "smuči", "nahrbtnika"]);
          return {
            text: `Cena ${item} je bila $${P0}$ €. Najprej so jo zvišali za $${p}\\ \\%$, nato znižali za $${q}\\ \\%$. Kolikšna je končna cena? Zaokroži na cente.`,
            answer: eur(end, [{ value: P0 * (1 + (p - q) / 100), why: "Drugi odstotek se računa od nove (zvišane) cene, ne od prvotne." }]),
            hint: "Vsako spremembo zapiši kot množenje s faktorjem: zvišanje za $p\\ \\%$ je množenje z $1 + \\frac{p}{100}$.",
            data: { given: [`c_0 = ${P0}\\ \\text{€}`, `p_1 = ${p}\\ \\%`, `p_2 = ${q}\\ \\%`], find: ["c"] },
            formula: "c = c_0\\left(1 + \\dfrac{p_1}{100}\\right)\\left(1 - \\dfrac{p_2}{100}\\right)",
            solution: `$c = ${P0} \\cdot ${tx(1 + p / 100)} \\cdot ${tx(1 - q / 100)}$\n$c ${ap(end, 2)} ${tx(end, 2)}\\ \\text{€}$`,
          };
        }
        if (t === 1) {
          const a = r.pick([2, 3]);
          const k = r.int(1, 3);
          const x = r.int(1, 4);
          const M = a ** x * (a ** k + 1);
          return {
            text: `Reši enačbo $${a}^{x + ${k}} + ${a}^x = ${M}$.`,
            answer: num(x, null, [{ value: x + k, why: "Izpostavi $" + a + "^x$: $" + a + "^{x + " + k + "} = " + a ** k + " \\cdot " + a + "^x$." }]),
            hint: `Zapiši $${a}^{x + ${k}} = ${a}^${k} \\cdot ${a}^x$ in izpostavi $${a}^x$.`,
            data: { given: [`${a}^{x + ${k}} + ${a}^x = ${M}`], find: ["x"] },
            formula: "a^{x + k} = a^k \\cdot a^x",
            solution: `$${a}^x(${a ** k} + 1) = ${M}$\n$${a}^x = ${a ** x}$\n$x = ${x}$`,
          };
        }
        const [b1, e1] = r.pick([[2, 5], [2, 6], [3, 4], [5, 3], [2, 3], [3, 3], [4, 3], [10, 3]]);
        let b2, e2;
        do [b2, e2] = r.pick([[2, 2], [3, 2], [5, 2], [2, 3], [10, 2], [4, 2]]);
        while (b2 === b1);
        const v = e1 - e2;
        return {
          text: `Izračunaj $\\log_{${b1}} ${b1 ** e1} + \\log_{${b2}} \\dfrac{1}{${b2 ** e2}}$.`,
          answer: num(v, null, [{ value: e1 + e2, why: "$\\log_b \\frac{1}{x} = -\\log_b x$: drugi člen je negativen." }]),
          hint: "Vsako število zapiši kot potenco osnove logaritma.",
          data: { given: [`A = \\log_{${b1}} ${b1 ** e1}`, `B = \\log_{${b2}} \\dfrac{1}{${b2 ** e2}}`], find: ["A + B"] },
          formula: ["\\log_b b^k = k", "\\log_b \\dfrac{1}{x} = -\\log_b x"],
          solution: `$\\log_{${b1}} ${b1 ** e1} = \\log_{${b1}} ${b1}^${e1} = ${e1}$\n$\\log_{${b2}} \\dfrac{1}{${b2 ** e2}} = \\log_{${b2}} ${b2}^{-${e2}} = -${e2}$\n$${e1} - ${e2} = ${v}$`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 3);
        if (t === 0) {
          const [b, n] = r.pick([[2, 3], [2, 4], [3, 2], [2, 5], [3, 3], [5, 2]]);
          const B = b ** n;
          const divs = [];
          for (let d = 1; d <= B; d++) if (B % d === 0) divs.push(d);
          const u = r.pick(divs);
          const v = B / u;
          if (u === v) return null;
          const x0 = r.int(1, 6);
          const p = u - x0;
          const q = v - x0;
          const xBad = -(p + q) - x0;
          const arg = (c) => `x${c ? ` ${sg(c)}` : ""}`;
          return {
            text: `Reši enačbo $\\log_{${b}}(${arg(p)}) + \\log_{${b}}(${arg(q)}) = ${n}$.`,
            answer: num(x0, null, [{ value: xBad, why: "Ta rešitev kvadratne enačbe ni rešitev: argument logaritma mora biti pozitiven." }]),
            hint: "Vsoto logaritmov zapiši kot logaritem produkta, nato enačbo antilogaritmiraj. Preveri definicijsko območje.",
            data: { given: [`\\log_{${b}}(${arg(p)}) + \\log_{${b}}(${arg(q)}) = ${n}`], find: ["x"] },
            formula: ["\\log_b u + \\log_b v = \\log_b(uv)", "\\log_b y = n \\iff y = b^n"],
            solution: `$(${arg(p)})(${arg(q)}) = ${b}^${n} = ${B}$\n$${poly([1, p + q, p * q - B])} = 0$ $\\Rightarrow$ $x_1 = ${x0}$, $x_2 = ${xBad}$\nPri $x_2 = ${xBad}$ je argument negativen, zato je rešitev le $x = ${x0}$.`,
          };
        }
        if (t === 1) {
          const a = r.nonZero(-3, 3);
          const pv = r.int(-5, 5);
          const c = r.int(-9, 9);
          const cs = [a, -2 * a * pv, c];
          const qv = ev(cs, pv);
          return {
            text: `Kolikšna je ${a < 0 ? "največja" : "najmanjša"} vrednost funkcije $f(x) = ${poly(cs)}$?`,
            answer: num(qv, null, [{ value: pv, why: "To je abscisa temena; iščeš vrednost funkcije (ordinato)." }, { value: c, why: "To je presečišče z osjo $y$, ne teme." }]),
            hint: "Ekstremna vrednost je v temenu: $p = -\\frac{b}{2a}$, $q = f(p)$.",
            data: { given: [`f(x) = ${poly(cs)}`], find: ["q"] },
            formula: ["p = -\\dfrac{b}{2a}", "q = f(p)"],
            solution: `$p = -\\dfrac{${-2 * a * pv}}{2 \\cdot ${a < 0 ? `(${a})` : a}} = ${pv}$\n$q = f(${pv}) = ${qv}$`,
          };
        }
        if (t === 2) {
          const A = r.pick([8, 10, 12, 15]);
          const B = r.pick([4, 5, 6, 7]);
          const kids = r.int(5, 40);
          const adults = r.int(5, 40);
          const Nn = kids + adults;
          const M = A * adults + B * kids;
          const place = r.pick(["muzej", "živalski vrt", "kino", "akvarij"]);
          return {
            text: `V ${place} je v enem dnevu vstopilo $${Nn}$ obiskovalcev. Vstopnica za odrasle stane $${A}$ €, za otroke $${B}$ €. Skupaj so plačali $${M}$ €. Koliko je bilo otrok?`,
            answer: num(kids, null, [{ value: adults, why: "To je število odraslih." }]),
            hint: "Število odraslih označi z $x$, otrok z $y$. Zapiši enačbi za število oseb in za denar.",
            data: { given: [`x + y = ${Nn}`, `${A}x + ${B}y = ${M}`], find: ["y"] },
            formula: ["x + y = N", "c_1 x + c_2 y = M"],
            solution: `$x = ${Nn} - y$\n$${A}(${Nn} - y) + ${B}y = ${M}$ $\\Rightarrow$ $${A - B}y = ${A * Nn - M}$\n$y = ${kids}$`,
          };
        }
        const [rr, h, s] = r.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [9, 12, 15], [4, 3, 5], [12, 5, 13]]);
        const Vv = (Math.PI * rr * rr * h) / 3;
        return {
          text: `Pokončni stožec ima polmer osnovne ploskve $${rr}\\ \\mathrm{cm}$ in stranico (izvodnico) $${s}\\ \\mathrm{cm}$. Izračunaj njegovo prostornino. Zaokroži na dve decimalki.`,
          answer: num(Vv, 2, [{ value: (Math.PI * rr * rr * s) / 3, why: "Višina stožca ni enaka stranici; izračunaj jo s Pitagorovim izrekom." }, { value: Math.PI * rr * rr * h, why: "Prostornina stožca je tretjina prostornine valja." }], "cm^3"),
          hint: "Najprej s Pitagorovim izrekom izračunaj višino.",
          data: { given: [`r = ${rr}\\ \\mathrm{cm}`, `s = ${s}\\ \\mathrm{cm}`], find: ["V"] },
          formula: ["v = \\sqrt{s^2 - r^2}", "V = \\dfrac{\\pi r^2 v}{3}"],
          solution: `$v = \\sqrt{${s}^2 - ${rr}^2} = ${h}\\ \\mathrm{cm}$\n$V = \\dfrac{\\pi \\cdot ${rr}^2 \\cdot ${h}}{3} = ${(rr * rr * h) / 3}\\pi\\ \\mathrm{cm^3}$\n$V \\approx ${tx(Vv, 2)}\\ \\mathrm{cm^3}$`,
        };
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const R = r.int(3, 8);
        const B = r.int(2, 7);
        const Nn = R + B;
        const ask = r.pick(["rr", "same", "diff"]);
        const tot = C(Nn, 2);
        const fav = ask === "rr" ? C(R, 2) : ask === "same" ? C(R, 2) + C(B, 2) : R * B;
        return {
          text: `V posodi je $${R}$ rdečih in $${B}$ modrih kroglic. Na slepo izvlečemo dve hkrati. Kolikšna je verjetnost, da sta ${ask === "rr" ? "obe rdeči" : ask === "same" ? "enake barve" : "različnih barv"}? Vpiši okrajšan ulomek.`,
          answer: frAns(fav, tot),
          hint: "Vse izide in ugodne izide preštej s kombinacijami (vrstni red ni pomemben).",
          data: { given: [`r = ${R}`, `m = ${B}`], find: ["P"] },
          formula: ["P = \\dfrac{\\text{ugodni izidi}}{\\text{vsi izidi}}", "\\dbinom{n}{2} = \\dfrac{n(n - 1)}{2}"],
          solution: `Vseh izidov: $\\dbinom{${Nn}}{2} = ${tot}$\nUgodnih: $${ask === "rr" ? `\\dbinom{${R}}{2} = ${fav}` : ask === "same" ? `\\dbinom{${R}}{2} + \\dbinom{${B}}{2} = ${fav}` : `${R} \\cdot ${B} = ${fav}`}$\n$P = \\dfrac{${fav}}{${tot}} = ${ft(fav, tot)}$`,
        };
      }
      if (t === 1) {
        const b = r.int(4, 12);
        const c = r.int(4, 12);
        const al = r.pick([40, 50, 65, 70, 80, 100, 110, 125]);
        const S = 0.5 * b * c * Math.sin(al * DEG);
        const a = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(al * DEG));
        const ha = (2 * S) / a;
        return {
          text: `V trikotniku $ABC$ je $b = ${b}\\ \\mathrm{cm}$, $c = ${c}\\ \\mathrm{cm}$ in $\\alpha = ${al}^\\circ$. Izračunaj višino $v_a$ na stranico $a$. Zaokroži na dve decimalki.`,
          answer: num(ha, 2, [{ value: S / a, why: "Iz $S = \\frac{a v_a}{2}$ sledi $v_a = \\frac{2S}{a}$." }, { value: (2 * S) / b, why: "To je višina na stranico $b$." }], "cm"),
          hint: "Najprej izračunaj ploščino ($S = \\frac{1}{2}bc\\sin\\alpha$) in stranico $a$ (kosinusni izrek), nato $v_a$.",
          data: { given: [`b = ${b}\\ \\mathrm{cm}`, `c = ${c}\\ \\mathrm{cm}`, `\\alpha = ${al}^\\circ`], find: ["v_a"] },
          formula: ["S = \\dfrac{1}{2}bc\\sin\\alpha", "a^2 = b^2 + c^2 - 2bc\\cos\\alpha", "v_a = \\dfrac{2S}{a}"],
          solution: `$S = \\dfrac{1}{2} \\cdot ${b} \\cdot ${c} \\cdot \\sin ${al}^\\circ \\approx ${tx(S, 3)}\\ \\mathrm{cm^2}$\n$a = \\sqrt{${b}^2 + ${c}^2 - 2 \\cdot ${b} \\cdot ${c} \\cos ${al}^\\circ} \\approx ${tx(a, 3)}\\ \\mathrm{cm}$\n$v_a = \\dfrac{2S}{a} \\approx ${tx(ha, 2)}\\ \\mathrm{cm}$`,
        };
      }
      const Th = r.pick([5, 8, 12, 30, 6, 14]);
      const pct = r.pick([10, 20, 25, 30, 40, 5, 15]);
      const tt = (Th * Math.log(100 / pct)) / Math.LN2;
      const sub = r.pick([["radioaktivnega izotopa", "dni"], ["radioaktivnega izotopa", "let"], ["zdravila v krvi", "ur"]]);
      return {
        text: `Razpolovni čas ${sub[0]} je $${Th}$ ${sub[1]}. Po kolikšnem času ostane le še $${pct}\\ \\%$ začetne količine? Rezultat zaokroži na eno decimalko (v ${sub[1] === "dni" ? "dneh" : sub[1] === "let" ? "letih" : "urah"}).`,
        answer: num(tt, 1, [{ value: (Th * (100 - pct)) / 50, why: "Količina ne pada linearno: vsak razpolovni čas se razpolovi." }, { value: Th * Math.log10(100 / pct), why: "Preveri logaritmiranje: $\\frac{t}{T} = \\frac{\\log(N_0/N)}{\\log 2}$ – ne pozabi deliti z $\\log 2$." }]),
        hint: "Uporabi zakon razpada $N = N_0 \\left(\\frac{1}{2}\\right)^{t/T}$ in logaritmiraj.",
        data: { given: [`T = ${Th}`, `\\dfrac{N}{N_0} = ${pct}\\ \\%`], find: ["t"] },
        formula: ["N = N_0 \\left(\\dfrac{1}{2}\\right)^{t/T}", "t = T \\cdot \\dfrac{\\log(N_0/N)}{\\log 2}"],
        solution: `$${tx(pct / 100)} = \\left(\\dfrac{1}{2}\\right)^{t/${Th}}$\n$\\dfrac{t}{${Th}} = \\dfrac{\\log ${tx(100 / pct)}}{\\log 2} ${ap(Math.log(100 / pct) / Math.LN2, 4)} ${tx(roundHalfUp(Math.log(100 / pct) / Math.LN2, 4))}$\n$t ${ap(tt, 1)} ${tx(tt, 1)}$ ${sub[1] === "dni" ? "dni" : sub[1] === "let" ? "let" : "ur"}`,
      };
    },
  },
];

// Odgovor 0 je pogosto trivialen (npr. naključno pravokotna vektorja); tak primer
// zavržemo, razen kjer je 0 namenoma možen odgovor (zeroOk). Tudi null (neprimerna
// kombinacija števil) ponovimo tukaj, da generateTask ne obupa po petih poskusih.
const isZero = (a) => (a.type === "number" && Math.abs(a.value) < 1e-12) || (a.type === "fraction" && a.num === 0);
export const DODATNE_MAT_SS34 = GENS.map((g) => ({
  ...g,
  gen(level, r, topic) {
    let t = null;
    for (let i = 0; i < 60; i++) {
      t = g.gen(level, r, topic);
      if (t && (t.zeroOk || !isZero(t.answer))) break;
    }
    if (!t) return null;
    const { zeroOk, ...task } = t;
    return task;
  },
}));
