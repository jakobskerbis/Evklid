// Generatorji za geometrijske teme 1. letnika gimnazije, ki jih zahteva maturitetna pot (MAT-SS-1):
// enačbe premice in kot med premicama, togi premiki, Heronova formula s polmeroma očrtane in včrtane
// krožnice ter načrtovalne naloge. Merila: docs/kakovost.md §2. Vsi rezultati so izračunani v kodi iz
// istih števil, ki jih vidi dijak. Izvirne naloge, ne prepisane maturitetne.
import { roundHalfUp } from "../check.js";
import { tx } from "./mat.js";
import { fr, num, frA, ft, sg, pickAns, name, wrapGens } from "./matura-util.js";

const P = "mat-ss1-matura-";
const T = (s) => `MAT-SS-1/${s}`;

// ---------- pomožne funkcije ----------
const pt = (x) => (x < 0 ? `(${tx(x)})` : tx(x));
const pnt = (x, y) => `(${tx(x)}, ${tx(y)})`;
const deg = (x, d = null) => `${tx(x, d)}^\\circ`;
const DEG = 180 / Math.PI;
const atanDeg = (x) => Math.atan(x) * DEG;
// Naklonski kot premice s smernim koeficientom k (med 0° in 180°).
const nak = (k) => (k >= 0 ? atanDeg(k) : 180 + atanDeg(k));
const rd = (x, d = 1) => roundHalfUp(x, d);
const cl = (x) => Math.round(x * 1e9) / 1e9;
const ap = (x, d) => (Math.abs(rd(x, d) - x) < 1e-9 ? "=" : "\\approx");
// Kot kot odgovor na desetinko stopinje (napake zaokrožene enako).
const angA = (phi, mistakes) => num(phi, 1, mistakes.map((m) => ({ ...m, value: rd(m.value, 1) })));
// Linearna kombinacija: lc([[2, "x"], [-3, "y"]], 6) → "2x - 3y + 6".
function lc(terms, c = 0) {
  let s = "";
  for (const [k, v] of terms) {
    if (k === 0) continue;
    const ab = Math.abs(k);
    const body = (ab === 1 ? "" : tx(ab)) + v;
    s += s === "" ? (k < 0 ? "-" : "") + body : (k < 0 ? " - " : " + ") + body;
  }
  if (c !== 0) s += s === "" ? tx(c) : ` ${sg(c)}`;
  return s || "0";
}
const gen3 = (a, b, c) => `${lc([[a, "x"], [b, "y"]], c)} = 0`;
// k·x z racionalnim k: kxT(-2, 3) → "-\frac{2}{3}x".
function kxT(kn, kd) {
  const [a, b] = fr(kn, kd);
  if (a === 0) return "";
  if (b === 1) return a === 1 ? "x" : a === -1 ? "-x" : `${a}x`;
  return `${ft(a, b)}x`;
}
// Eksplicitna oblika y = kx + n z racionalnima k in n.
function explT(kn, kd, nn, nd = 1) {
  const kx = kxT(kn, kd);
  const [a, b] = fr(nn, nd);
  if (!kx) return `y = ${ft(a, b)}`;
  if (a === 0) return `y = ${kx}`;
  return `y = ${kx} ${a < 0 ? "-" : "+"} ${ft(Math.abs(a), b)}`;
}
// Splošna oblika z b ≠ 0 in a ≠ 0 (smerni koeficient -a/b ni 0).
function gform(r) {
  const s = r.pick([1, -1]);
  return { a: r.int(1, 6), b: s * r.pick([2, 3, 4, 5]), c: r.nonZero(-9, 9) };
}
// Ulomek z okrajšavo le, če se kaj spremeni: frT(9, 5) → "\\frac{9}{5}", frT(6, -4) → "\\frac{6}{-4} = -\\frac{3}{2}".
const frT = (n, d) => {
  const raw = `\\frac{${n}}{${d}}`;
  const red = ft(n, d);
  return raw === red ? raw : `${raw} = ${red}`;
};
const cm = (v) => `${tx(v)}\\ \\mathrm{cm}`;
const cm2 = (v) => `${tx(v)}\\ \\mathrm{cm^2}`;

// ================= enačbe premice in kot med premicama =================
const K_EXACT = [
  { t: "", v: 1, base: 45, dual: null },
  { t: "\\sqrt{3}", v: Math.sqrt(3), base: 60, dual: 30 },
  { t: "\\frac{\\sqrt{3}}{3}", v: Math.sqrt(3) / 3, base: 30, dual: 60 },
];
// Pari smernih koeficientov [p1, q1, p2, q2] (k = p/q), pri katerih je tan φ = 1 (φ = 45°).
const PAIRS45 = [
  [2, 1, -3, 1],
  [3, 1, -2, 1],
  [0, 1, 1, 1],
  [0, 1, -1, 1],
  [2, 1, 1, 3],
  [3, 1, 1, 2],
  [-2, 1, -1, 3],
  [-3, 1, -1, 2],
  [5, 1, -3, 2],
  [1, 2, 3, 1],
  [4, 1, -5, 3],
  [-4, 1, -3, 5],
];
const KOT_FORMULA = "\\tan\\varphi = \\left|\\frac{k_2 - k_1}{1 + k_1 k_2}\\right|";

function premicaL1(r) {
  const t = r.int(0, 3);
  if (t === 0) {
    const { a, b, c } = gform(r);
    const askK = r.next() < 0.5;
    const eq = gen3(a, b, c);
    const sol = [
      `Izrazimo $y$: $${tx(b)}y = ${lc([[-a, "x"]], -c)}$`,
      `Delimo s koeficientom $${tx(b)}$: $${explT(-a, b, -c, b)}$`,
      askK ? `Smerni koeficient je število ob $x$: $k = -\\frac{a}{b} = ${ft(-a, b)}$` : `Začetna vrednost je prosti člen: $n = -\\frac{c}{b} = ${ft(-c, b)}$`,
    ];
    return {
      text: `Premica ima enačbo $${eq}$. Določi ${askK ? "njen smerni koeficient $k$" : "njeno začetno vrednost $n$ (premica seka os $y$ v točki $(0, n)$)"}. Vpiši ulomek ali celo število.`,
      answer: askK
        ? frA(-a, b, [
            { value: a / b, why: "Ko člen z $x$ preneseš na drugo stran enačbe, mu spremeniš predznak." },
            { value: -b / a, why: "Smerni koeficient je koeficient ob $x$, deljen s koeficientom ob $y$ (z nasprotnim predznakom), ne obratno." },
            { value: -a, why: "Ko izraziš $y$, deliš celo enačbo s koeficientom ob $y$." },
          ])
        : frA(-c, b, [
            { value: c / b, why: "Ko prosti člen preneseš na drugo stran enačbe, mu spremeniš predznak." },
            { value: -c, why: "Ko izraziš $y$, deliš celo enačbo s koeficientom ob $y$, tudi prosti člen." },
            { value: -b / c, why: "Prosti člen deliš s koeficientom ob $y$, ne obratno." },
          ]),
      hint: "Iz splošne oblike izrazi $y$: člena brez $y$ prenesi na desno in deli s koeficientom ob $y$.",
      data: { given: [eq], find: [askK ? "k" : "n"] },
      formula: ["ax + by + c = 0 \\Rightarrow y = -\\frac{a}{b}x - \\frac{c}{b}", "k = -\\frac{a}{b},\\ n = -\\frac{c}{b}"],
      solution: sol.join("\n"),
    };
  }
  if (t === 1) {
    const m = r.pick([-9, -8, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 7, 8, 9]);
    const n = r.pick([-9, -8, -7, -6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 8]);
    const askY = r.next() < 0.5;
    const xT = `${m < 0 ? "-" : ""}\\frac{x}{${Math.abs(m)}}`;
    const yT = `${n < 0 ? " - " : " + "}\\frac{y}{${Math.abs(n)}}`;
    const eq = `${xT}${yT} = 1`;
    const v = askY ? n : m;
    const other = askY ? m : n;
    return {
      text: `Premica je dana v odsekovni obliki $${eq}$. V kateri točki seka os $${askY ? "y" : "x"}$? Vpiši ${askY ? "$y$" : "$x$"}-koordinato presečišča.`,
      answer: num(v, null, [
        { value: other, why: `Pod $x$ je odsek na osi $x$, pod $y$ odsek na osi $y$. Iskal si presečišče z osjo $${askY ? "y" : "x"}$.` },
        {
          value: -v,
          why: v < 0
            ? `Minus pred ulomkom spada k odseku: $-\\frac{${askY ? "y" : "x"}}{${-v}} = \\frac{${askY ? "y" : "x"}}{${v}}$, odsek je negativen.`
            : "Pred tem ulomkom ni minusa, zato je odsek pozitiven.",
        },
        { value: 1 / v, why: "Odsek je imenovalec ulomka, ne njegova obratna vrednost." },
      ]),
      hint: `V odsekovni obliki $\\frac{x}{m} + \\frac{y}{n} = 1$ vstavi $${askY ? "x" : "y"} = 0$.`,
      data: { given: [eq], find: [askY ? "n" : "m"] },
      formula: "\\frac{x}{m} + \\frac{y}{n} = 1:\\ (m, 0) \\text{ in } (0, n)",
      solution: `Na osi $${askY ? "y" : "x"}$ je $${askY ? "x" : "y"} = 0$.\nOdsekovna oblika: $\\frac{x}{${tx(m)}} + \\frac{y}{${tx(n)}} = 1$, odseka sta $m = ${m}$ in $n = ${n}$.\nPresečišče: $${askY ? pnt(0, n) : pnt(m, 0)}$, iskana koordinata je $${v}$.`,
    };
  }
  if (t === 2) {
    const half = r.next() < 0.35;
    const kd = half ? 2 : 1;
    const kn = half ? r.pick([-5, -3, -1, 1, 3, 5]) : r.nonZero(-5, 5);
    const x0 = half ? r.pick([-6, -4, -2, 2, 4, 6]) : r.nonZero(-6, 6);
    const y0 = r.int(-7, 7);
    const k = kn / kd;
    const n = y0 - k * x0;
    return {
      text: `Premica s smernim koeficientom $k = ${ft(kn, kd)}$ gre skozi točko $T${pnt(x0, y0)}$. Kolikšna je njena začetna vrednost $n$?`,
      answer: num(n, null, [
        { value: y0 + k * x0, why: "Pri izražanju $n$ iz $y_0 = kx_0 + n$ člen $kx_0$ odšteješ, ne prišteješ." },
        { value: x0 - k * y0, why: "V enačbo $y = kx + n$ vstavi $x_0$ namesto $x$ in $y_0$ namesto $y$, ne obratno." },
        { value: k * x0 - y0, why: "Pazi na predznak: $n = y_0 - kx_0$." },
      ]),
      hint: "Koordinati točke vstavi v enačbo $y = kx + n$ in izrazi $n$.",
      data: { given: [`k = ${ft(kn, kd)}`, `T = ${pnt(x0, y0)}`], find: ["n"] },
      formula: ["y - y_0 = k(x - x_0)", "n = y_0 - kx_0"],
      solution: `Vstavimo $T$ v $y = kx + n$: $${y0} = ${ft(kn, kd)} \\cdot ${pt(x0)} + n$\n$${y0} = ${tx(k * x0)} + n$\n$n = ${y0} ${sg(-k * x0)} = ${tx(n)}$\nPremica: $${explT(kn, kd, n)}$`,
    };
  }
  const k = r.pick([0.5, 2, 3, 1.5, 0.25, 4, 2.5, 0.8, 1.2, 5, 0.4, 0.75]);
  const n = r.int(-6, 6);
  const phi = atanDeg(k);
  const eq = `y = ${tx(k)}x${n ? ` ${sg(n)}` : ""}`;
  return {
    text: `Izračunaj naklonski kot premice $${eq}$. Vpiši število stopinj, zaokroženo na desetinko.`,
    answer: angA(phi, [
      { value: Math.atan(k), why: "Računalo je bilo nastavljeno na radiane (RAD). Naklonski kot podaj v stopinjah (DEG)." },
      { value: 90 - phi, why: "Naklonski kot merimo od osi $x$, ne od osi $y$." },
    ]),
    hint: "Tangens naklonskega kota je enak smernemu koeficientu. Na računalu uporabi tipko $\\tan^{-1}$ (v stopinjah).",
    data: { given: [eq], find: ["\\alpha"] },
    formula: "\\tan\\alpha = k",
    solution: `Smerni koeficient: $k = ${tx(k)}$\n$\\tan\\alpha = ${tx(k)}$\n$\\alpha = \\tan^{-1}(${tx(k)}) ${ap(phi, 1)} ${deg(rd(phi, 1), 1)}$`,
  };
}

function premicaL2(r) {
  const t = r.int(0, 3);
  if (t === 0) {
    const { a, b, c } = gform(r);
    const perp = r.next() < 0.5;
    const [kn, kd] = perp ? fr(b, a) : fr(-a, b);
    const x0 = r.nonZero(-5, 5);
    const y0 = r.int(-6, 6);
    // Točka na dani premici: »vzporednica« bi bila ista premica.
    if (!perp && a * x0 + b * y0 + c === 0) return null;
    const nAt = (k) => y0 - k * x0;
    const k = kn / kd;
    const eq = gen3(a, b, c);
    const ms = perp
      ? [
          { value: nAt(-a / b), why: "Pravokotna premica nima enakega smernega koeficienta: $k' = -\\frac{1}{k}$." },
          { value: nAt(-b / a), why: "Pri pravokotnici vzameš obratno vrednost in še spremeniš predznak: $k' = -\\frac{1}{k}$." },
          { value: nAt(a / b), why: "Samo sprememba predznaka ni dovolj: pravokotnica ima $k' = -\\frac{1}{k}$." },
        ]
      : [
          { value: nAt(b / a), why: "Vzporedni premici imata enak smerni koeficient; $-\\frac{1}{k}$ velja za pravokotnico." },
          { value: y0 + k * x0, why: "Iz $y_0 = kx_0 + n$ dobiš $n = y_0 - kx_0$: člen odšteješ." },
          { value: nAt(a / b), why: "Smerni koeficient iz splošne oblike je $-\\frac{a}{b}$: pazi na predznak." },
        ];
    const [nn, nd] = fr(y0 * kd - kn * x0, kd);
    return {
      text: `Premica $q$ gre skozi točko $T${pnt(x0, y0)}$ in je ${perp ? "pravokotna" : "vzporedna"} premici $${eq}$. Kolikšna je začetna vrednost $n$ premice $q$? Vpiši ulomek ali celo število.`,
      answer: frA(nn, nd, ms),
      hint: `Najprej iz splošne oblike določi smerni koeficient dane premice, nato smerni koeficient ${perp ? "pravokotnice" : "vzporednice"}.`,
      data: { given: [eq, `T = ${pnt(x0, y0)}`], find: ["n"] },
      formula: ["k = -\\frac{a}{b}", perp ? "k_1 k_2 = -1" : "k_1 = k_2", "n = y_0 - kx_0"],
      solution: `Dana premica: $k = -\\frac{a}{b} = ${ft(-a, b)}$\n${perp ? `Pravokotnica: $k' = -\\frac{1}{k} = ${ft(kn, kd)}$` : `Vzporednica ima enak smerni koeficient: $k' = ${ft(kn, kd)}$`}\nVstavimo $T$: $${y0} = ${ft(kn, kd)} \\cdot ${pt(x0)} + n$\n$n = ${ft(nn, nd)}$, premica $q$: $${explT(kn, kd, nn, nd)}$`,
    };
  }
  if (t === 1) {
    const a = r.nonZero(-6, 6);
    const b = r.nonZero(-6, 6);
    const c = r.nonZero(-12, 12);
    const askX = r.next() < 0.5;
    const eq = gen3(a, b, c);
    const [d, other] = askX ? [a, b] : [b, a];
    return {
      text: `Zapiši premico $${eq}$ v odsekovni obliki $\\frac{x}{m} + \\frac{y}{n} = 1$. Vpiši odsek $${askX ? "m" : "n"}$ (ulomek ali celo število).`,
      answer: frA(-c, d, [
        { value: c / d, why: "Ko prosti člen preneseš na desno, mu spremeniš predznak." },
        { value: -d / c, why: `Odsek je $-\\frac{c}{${askX ? "a" : "b"}}$: desna stran, deljena s koeficientom, ne obratno.` },
        { value: -c / other, why: `To je odsek na drugi osi. Na osi $${askX ? "x" : "y"}$ deliš s koeficientom ob $${askX ? "x" : "y"}$.` },
      ]),
      hint: "Prosti člen prenesi na desno stran in celo enačbo deli z njim, da je desna stran enaka $1$.",
      data: { given: [eq], find: [askX ? "m" : "n"] },
      formula: ["ax + by = -c", "m = -\\frac{c}{a},\\ n = -\\frac{c}{b}"],
      solution: `Prosti člen prenesemo: $${lc([[a, "x"], [b, "y"]])} = ${-c}$\nDelimo z desno stranjo $${-c}$: $\\frac{${lc([[a, "x"]])}}{${-c}} + \\frac{${lc([[b, "y"]])}}{${-c}} = 1$\n$m = ${frT(-c, a)}$, $n = ${frT(-c, b)}$\nIskani odsek: $${askX ? "m" : "n"} = ${ft(-c, d)}$`,
    };
  }
  if (t === 2) {
    const a = r.int(1, 6);
    let b = r.int(1, 6);
    if (b === a) b = a === 6 ? 5 : a + 1;
    const s = r.pick([1, -1]);
    const c = r.nonZero(-9, 9);
    const k = -a / b;
    const phi = nak(k);
    const eq = gen3(s * a, s * b, c);
    return {
      text: `Izračunaj naklonski kot premice $${eq}$ (kot med $0^\\circ$ in $180^\\circ$). Vpiši število stopinj, zaokroženo na desetinko.`,
      answer: angA(phi, [
        { value: atanDeg(k), why: "Računalo da pri negativnem $k$ negativen kot. Naklonski kot je med $0^\\circ$ in $180^\\circ$: prištej $180^\\circ$." },
        { value: 180 - phi, why: "Pri negativnem smernem koeficientu premica pada, zato je naklonski kot top. Prištej $180^\\circ$ k vrednosti z računala." },
        { value: nak(-b / a), why: "Smerni koeficient je $-\\frac{a}{b}$ (koeficient ob $x$ v števcu), ne $-\\frac{b}{a}$." },
      ]),
      hint: "Najprej določi smerni koeficient $k = -\\frac{a}{b}$. Ker je negativen, je naklonski kot top.",
      data: { given: [eq], find: ["\\alpha"] },
      formula: ["k = -\\frac{a}{b}", "\\tan\\alpha = k,\\ 0^\\circ \\le \\alpha < 180^\\circ"],
      solution: `$k = -\\frac{a}{b} = ${ft(-a, b)}$\nRačunalo: $\\tan^{-1}(${ft(-a, b)}) ${ap(atanDeg(k), 1)} ${deg(rd(atanDeg(k), 1), 1)}$\nKer je $k < 0$, prištejemo $180^\\circ$: $\\alpha ${ap(phi, 1)} ${deg(rd(phi, 1), 1)}$`,
    };
  }
  // brez računala: k = ±1, ±√3, ±√3/3
  const e = r.pick(K_EXACT);
  const s = r.pick([1, -1]);
  const n = r.nonZero(-6, 6);
  const phi = s > 0 ? e.base : 180 - e.base;
  let eq;
  if (!e.t && r.next() < 0.5) eq = gen3(s, -1, n);
  else eq = `y = ${s < 0 ? "-" : ""}${e.t}x ${sg(n)}`;
  const ms = [];
  if (s < 0) {
    ms.push({ value: -e.base, why: "Naklonski kot je med $0^\\circ$ in $180^\\circ$. Pri negativnem $k$ je top." });
    ms.push({ value: e.base, why: "Premica s negativnim smernim koeficientom pada, zato je naklonski kot top." });
  }
  if (e.dual) ms.push({ value: s > 0 ? e.dual : 180 - e.dual, why: "Zamenjal si $30^\\circ$ in $60^\\circ$: $\\tan 60^\\circ = \\sqrt{3}$, $\\tan 30^\\circ = \\frac{\\sqrt{3}}{3}$." });
  else ms.push({ value: s > 0 ? 135 : 45, why: "$\\tan 45^\\circ = 1$; pri $k = -1$ je kot top." });
  return {
    text: `Brez računala določi naklonski kot premice $${eq}$ (v stopinjah, med $0^\\circ$ in $180^\\circ$).`,
    answer: num(phi, null, ms),
    hint: `Najprej zapiši smerni koeficient. Spomni se vrednosti $\\tan 30^\\circ$, $\\tan 45^\\circ$ in $\\tan 60^\\circ$.`,
    data: { given: [eq], find: ["\\alpha"] },
    formula: ["\\tan\\alpha = k", "\\tan 30^\\circ = \\frac{\\sqrt{3}}{3},\\ \\tan 45^\\circ = 1,\\ \\tan 60^\\circ = \\sqrt{3}"],
    solution: `Smerni koeficient: $k = ${s < 0 ? "-" : ""}${e.t || "1"}$\n$\\tan ${e.base}^\\circ = ${e.t || "1"}$\n${s > 0 ? `$\\alpha = ${e.base}^\\circ$` : `Ker je $k < 0$, je kot top: $\\alpha = 180^\\circ - ${e.base}^\\circ = ${phi}^\\circ$`}`,
  };
}

function premicaL3(r) {
  const t = r.int(0, 3);
  if (t === 0) {
    if (r.next() < 0.25) {
      // pravokotni premici
      const [p, q] = r.pick([[1, 2], [2, 1], [2, 3], [3, 2], [1, 3], [3, 1], [-1, 2], [-2, 3], [-3, 1], [-1, 4], [4, 1]]);
      const n = r.nonZero(-5, 5);
      const c = r.nonZero(-8, 8);
      const e1 = explT(p, q, n);
      const e2 = gen3(q, p, c);
      return {
        text: `Izračunaj kot med premicama $${e1}$ in $${e2}$ (v stopinjah).`,
        answer: num(90, null, [
          { value: 0, why: "Imenovalec $1 + k_1k_2 = 0$ ne pomeni kota $0^\\circ$: tangens narašča čez vse meje, ko gre kot proti $90^\\circ$." },
          { value: rd(atanDeg(Math.abs(-q / p - p / q)), 1), why: "V formuli je še imenovalec $1 + k_1 k_2$." },
        ]),
        hint: "Določi oba smerna koeficienta in izračunaj $1 + k_1 k_2$.",
        data: { given: [e1, e2], find: ["\\varphi"] },
        formula: [KOT_FORMULA, "k_1 k_2 = -1 \\Leftrightarrow \\text{premici sta pravokotni}"],
        solution: `$k_1 = ${ft(p, q)}$, $k_2 = -\\frac{a}{b} = ${ft(-q, p)}$\n$k_1 k_2 = ${ft(p, q)} \\cdot \\left(${ft(-q, p)}\\right) = -1$\nImenovalec $1 + k_1 k_2 = 0$: premici sta pravokotni, $\\varphi = 90^\\circ$.`,
      };
    }
    let k1;
    let k2;
    do {
      k1 = r.int(-4, 4);
      k2 = r.int(-4, 4);
    } while (k1 === k2 || 1 + k1 * k2 === 0);
    const n1 = r.int(-5, 5);
    const b = r.int(1, 3);
    const c = r.nonZero(-8, 8);
    const e1 = explT(k1, 1, n1);
    const e2 = gen3(-k2 * b, b, c);
    const tv = Math.abs((k2 - k1) / (1 + k1 * k2));
    const phi = atanDeg(tv);
    const den2 = 1 - k1 * k2;
    return {
      text: `Izračunaj kot med premicama $${e1}$ in $${e2}$. Vpiši število stopinj, zaokroženo na desetinko.`,
      answer: angA(phi, [
        { value: atanDeg(Math.abs(k2 - k1)), why: "V formuli je še imenovalec $1 + k_1 k_2$." },
        { value: den2 ? atanDeg(Math.abs((k2 - k1) / den2)) : NaN, why: "V imenovalcu je $1 + k_1 k_2$: pazi na predznak produkta." },
        { value: 180 - phi, why: "Kot med premicama je ostri kot (ali pravi): formula ima absolutno vrednost." },
      ]),
      hint: "Iz obeh enačb določi smerna koeficienta, nato ju vstavi v formulo za tangens kota med premicama.",
      data: { given: [e1, e2], find: ["\\varphi"] },
      formula: ["k = -\\frac{a}{b}", KOT_FORMULA],
      solution: `$k_1 = ${k1}$, $k_2 = -\\frac{a}{b} = ${k2}$\n$\\tan\\varphi = \\left|\\frac{${k2} - ${pt(k1)}}{1 + ${pt(k1)} \\cdot ${pt(k2)}}\\right| = \\left|\\frac{${k2 - k1}}{${1 + k1 * k2}}\\right| ${ap(tv, 4)} ${tx(rd(tv, 4))}$\n$\\varphi ${ap(phi, 1)} ${deg(rd(phi, 1), 1)}$`,
    };
  }
  if (t === 1) {
    let [p1, q1, p2, q2] = r.pick(PAIRS45);
    if (r.next() < 0.5) [p1, q1, p2, q2] = [p2, q2, p1, q1];
    const k1 = p1 / q1;
    const k2 = p2 / q2;
    const tv = Math.abs((k2 - k1) / (1 + k1 * k2));
    if (Math.abs(tv - 1) > 1e-9) return null;
    const c1 = r.nonZero(-7, 7);
    const c2 = r.nonZero(-7, 7);
    const e1 = gen3(p1, -q1, c1);
    const e2 = gen3(p2, -q2, c2);
    const [dn, dd] = fr(p2 * q1 - p1 * q2, q1 * q2);
    const [en, ed] = fr(q1 * q2 + p1 * p2, q1 * q2);
    return {
      text: `Brez računala izračunaj kot med premicama $${e1}$ in $${e2}$ (v stopinjah).`,
      answer: num(45, null, [
        { value: 135, why: "Kot med premicama je ostri kot: zato je v formuli absolutna vrednost." },
        { value: 90, why: "Premici sta pravokotni le, če je $k_1k_2 = -1$. Izračunaj tangens kota." },
      ]),
      hint: "Iz splošnih oblik določi $k_1$ in $k_2$, vstavi v formulo in prepoznaj kot z znanim tangensom.",
      data: { given: [e1, e2], find: ["\\varphi"] },
      formula: [KOT_FORMULA, "\\tan 45^\\circ = 1"],
      solution: `$k_1 = ${ft(p1, q1)}$, $k_2 = ${ft(p2, q2)}$\n$k_2 - k_1 = ${ft(dn, dd)}$, $1 + k_1 k_2 = ${ft(en, ed)}$\n$\\tan\\varphi = \\left|${ft(dn, dd)} : ${en < 0 ? `\\left(${ft(en, ed)}\\right)` : ft(en, ed)}\\right| = 1$\n$\\varphi = 45^\\circ$`,
    };
  }
  if (t === 2) {
    const { a: a1, b: b1, c: c1 } = gform(r);
    const B = r.nonZero(-5, 5);
    const C = r.nonZero(-9, 9);
    const perp = r.next() < 0.5;
    // Pri vzporednosti premici ne smeta sovpadati (C : B = c₁ : b₁).
    if (!perp && C * b1 === c1 * B) return null;
    const e1 = gen3(a1, b1, c1);
    const e2 = `ax ${B < 0 ? "-" : "+"} ${Math.abs(B) === 1 ? "" : Math.abs(B)}y ${sg(C)} = 0`;
    const [an, ad] = perp ? fr(-B * b1, a1) : fr(B * a1, b1);
    // k₂ = -a/B v čistem zapisu: B = 1 → -a, B = -1 → a, B < 0 → a/|B|.
    const k2T = B === 1 ? "-a" : B === -1 ? "a" : B < 0 ? `\\frac{a}{${-B}}` : `-\\frac{a}{${B}}`;
    return {
      text: `Za katero vrednost parametra $a$ je premica $${e2}$ ${perp ? "pravokotna na premico" : "vzporedna premici"} $${e1}$? Vpiši ulomek ali celo število.`,
      answer: frA(an, ad, perp
        ? [
            { value: (B * b1) / a1, why: "Pravokotnica ima smerni koeficient $-\\frac{1}{k}$: pazi na oba predznaka (tudi $k = -\\frac{a}{b}$)." },
            { value: (B * a1) / b1, why: "To je pogoj za vzporednost. Pri pravokotnosti velja $k_1 k_2 = -1$." },
          ]
        : [
            { value: (-B * a1) / b1, why: "Smerni koeficient obeh premic je $-\\frac{a}{b}$: minus je v obeh, zato se pokrajša." },
            { value: (-B * b1) / a1, why: "To je pogoj za pravokotnost. Vzporedni premici imata enak smerni koeficient." },
          ]),
      hint: `Izrazi smerna koeficienta obeh premic (drugi je odvisen od $a$) in zapiši pogoj za ${perp ? "pravokotnost" : "vzporednost"}.`,
      data: { given: [e1, e2], find: ["a"] },
      formula: ["k = -\\frac{a}{b}", perp ? "k_1 k_2 = -1" : "k_1 = k_2"],
      solution: `$k_1 = ${ft(-a1, b1)}$, $k_2 = -\\frac{a}{b} = ${k2T}$\n${perp ? `$${ft(-a1, b1)} \\cdot \\left(${k2T}\\right) = -1$` : `$${k2T} = ${ft(-a1, b1)}$`}\n$a = ${ft(an, ad)}$`,
    };
  }
  // naklonski kot premice skozi dve točki
  const x1 = r.int(-6, 6);
  const y1 = r.int(-6, 6);
  const dx = r.nonZero(-7, 7);
  const dy = r.nonZero(-7, 7);
  const x2 = x1 + dx;
  const y2 = y1 + dy;
  const k = dy / dx;
  const phi = nak(k);
  return {
    text: `Premica gre skozi točki $A${pnt(x1, y1)}$ in $B${pnt(x2, y2)}$. Izračunaj njen naklonski kot (med $0^\\circ$ in $180^\\circ$). Vpiši število stopinj, zaokroženo na desetinko.`,
    answer: angA(phi, [
      { value: nak(dx / dy), why: "Smerni koeficient je sprememba $y$ deljena s spremembo $x$, ne obratno." },
      { value: atanDeg(k), why: "Pri negativnem $k$ računalo vrne negativen kot. Naklonski kot je med $0^\\circ$ in $180^\\circ$." },
      { value: 90 - phi, why: "Naklonski kot merimo od pozitivnega dela osi $x$." },
    ]),
    hint: "Najprej izračunaj smerni koeficient iz koordinat obeh točk.",
    data: { given: [`A = ${pnt(x1, y1)}`, `B = ${pnt(x2, y2)}`], find: ["\\alpha"] },
    formula: ["k = \\frac{y_2 - y_1}{x_2 - x_1}", "\\tan\\alpha = k"],
    solution: `$k = \\frac{${y2} - ${pt(y1)}}{${x2} - ${pt(x1)}} = \\frac{${dy}}{${dx}} = ${ft(dy, dx)}$\n$\\tan^{-1}(${ft(dy, dx)}) ${ap(atanDeg(k), 1)} ${deg(rd(atanDeg(k), 1), 1)}$\n${k < 0 ? `Ker je $k < 0$, prištejemo $180^\\circ$: ` : ""}$\\alpha ${ap(phi, 1)} ${deg(rd(phi, 1), 1)}$`,
  };
}

// ================= togi premiki =================
const REFL = {
  x: { f: ([x, y]) => [x, -y], t: "osjo $x$", rule: "(x, y) \\mapsto (x, -y)", why: "Pri zrcaljenju čez os $x$ ostane koordinata $x$, predznak spremeni $y$." },
  y: { f: ([x, y]) => [-x, y], t: "osjo $y$", rule: "(x, y) \\mapsto (-x, y)", why: "Pri zrcaljenju čez os $y$ ostane koordinata $y$, predznak spremeni $x$." },
  o: { f: ([x, y]) => [-x, -y], t: "izhodiščem", rule: "(x, y) \\mapsto (-x, -y)", why: "Pri zrcaljenju čez izhodišče obe koordinati spremenita predznak." },
  d: { f: ([x, y]) => [y, x], t: "premico $y = x$", rule: "(x, y) \\mapsto (y, x)", why: "Pri zrcaljenju čez premico $y = x$ koordinati zamenjata mesti, predznaka ostaneta." },
  e: { f: ([x, y]) => [-y, -x], t: "premico $y = -x$", rule: "(x, y) \\mapsto (-y, -x)", why: "Pri zrcaljenju čez premico $y = -x$ koordinati zamenjata mesti in obe spremenita predznak." },
};
const ROT = {
  p: { f: ([x, y]) => [-y, x], t: "za $90^\\circ$ v pozitivni smeri (nasproti urinemu kazalcu)", rule: "(x, y) \\mapsto (-y, x)" },
  m: { f: ([x, y]) => [y, -x], t: "za $90^\\circ$ v smeri urinega kazalca", rule: "(x, y) \\mapsto (y, -x)" },
  h: { f: ([x, y]) => [-x, -y], t: "za $180^\\circ$", rule: "(x, y) \\mapsto (-x, -y)" },
};
const coordName = (i) => (i === 0 ? "x" : "y");
const ptr = (p) => pnt(p[0], p[1]);

function togiL1(r) {
  const t = r.int(0, 2);
  const x = r.nonZero(-8, 8);
  const y = r.nonZero(-8, 8);
  const i = r.int(0, 1);
  const c = coordName(i);
  if (t === 0) {
    const p = r.nonZero(-6, 6);
    const q = r.nonZero(-6, 6);
    const img = [x + p, y + q];
    return {
      text: `Točko $T${pnt(x, y)}$ vzporedno premaknemo za vektor $\\vec{v} = (${p}, ${q})$. Kolikšna je koordinata $${c}'$ slike $T'$?`,
      answer: num(img[i], null, [
        { value: i ? y - q : x - p, why: "Pri premiku za vektor koordinate vektorja prištejemo, ne odštejemo." },
        { value: i ? y + p : x + q, why: "Prva koordinata vektorja premakne $x$, druga $y$." },
      ]),
      hint: "Vsaki koordinati točke prištej ustrezno koordinato vektorja.",
      data: { given: [`T = ${pnt(x, y)}`, `\\vec{v} = (${p}, ${q})`], find: [`${c}'`] },
      formula: "(x, y) \\mapsto (x + p, y + q)",
      solution: `$T' = (${x} ${sg(p)}, ${y} ${sg(q)})$\n$T'${ptr(img)}$\n$${c}' = ${img[i]}$`,
    };
  }
  if (t === 1) {
    const key = r.pick(["x", "y", "o"]);
    const m = REFL[key];
    const img = m.f([x, y]);
    const ms = ["x", "y", "o"].filter((k2) => k2 !== key).map((k2) => ({ value: REFL[k2].f([x, y])[i], why: m.why }));
    ms.push({ value: [x, y][i], why: m.why });
    return {
      text: `Točko $T${pnt(x, y)}$ prezrcalimo čez ${m.t}. Kolikšna je koordinata $${c}'$ slike $T'$?`,
      answer: num(img[i], null, ms),
      hint: "Premisli, katera koordinata ostane enaka in kateri se spremeni predznak. Pomagaj si s skico.",
      data: { given: [`T = ${pnt(x, y)}`, `\\text{preslikava} = \\text{zrcaljenje čez ${m.t.replace(/\$/g, "")}}`], find: [`${c}'`] },
      formula: m.rule,
      solution: `Pravilo: $${m.rule}$\n$T'${ptr(img)}$\n$${c}' = ${img[i]}$`,
    };
  }
  // orientacija
  const maps = [
    { t: `vzporednem premiku za vektor $\\vec{v} = (${r.nonZero(-5, 5)}, ${r.nonZero(-5, 5)})$`, keep: true, why: "Premik trikotnik le prestavi, vrstni red oglišč ostane enak." },
    { t: "vrtežu za $90^\\circ$ okoli izhodišča", keep: true, why: "Vrtež trikotnik le zasuka, vrstni red oglišč ostane enak." },
    { t: "zrcaljenju čez izhodišče", keep: true, why: "Zrcaljenje čez točko je vrtež za $180^\\circ$, zato orientacijo ohrani; spremeni jo le zrcaljenje čez premico." },
    { t: "zrcaljenju čez os $x$", keep: false, why: "Zrcaljenje čez premico obrne lik kot ogledalo: oglišča si sledijo v nasprotni smeri." },
    { t: "zrcaljenju čez os $y$", keep: false, why: "Zrcaljenje čez premico obrne lik kot ogledalo: oglišča si sledijo v nasprotni smeri." },
    { t: "zrcaljenju čez premico $y = x$", keep: false, why: "Zrcaljenje čez premico obrne lik kot ogledalo: oglišča si sledijo v nasprotni smeri." },
  ];
  const mp = r.pick(maps);
  let A = [r.int(-5, 0), r.int(-5, 0)];
  let B = [r.int(1, 6), r.int(-5, 1)];
  let C = [r.int(-3, 4), r.int(2, 6)];
  const cross = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0]);
  if (cross === 0) return null;
  if (cross < 0) [B, C] = [C, B];
  const POS = "pozitivno (ohrani se)";
  const NEG = "negativno (spremeni se)";
  const DEP = "odvisno od lege trikotnika";
  const depWhy = "Orientacija slike je odvisna le od vrste preslikave, ne od lege trikotnika.";
  return {
    text: `Trikotnik $A${ptr(A)}$, $B${ptr(B)}$, $C${ptr(C)}$ je pozitivno orientiran. Kako je orientirana njegova slika $A'B'C'$ pri ${mp.t}?`,
    answer: pickAns(r, mp.keep ? POS : NEG, [
      [mp.keep ? NEG : POS, mp.why],
      [DEP, depWhy],
    ]),
    hint: "Orientacijo spremeni le zrcaljenje čez premico. Premik in vrtež (tudi zrcaljenje čez točko) jo ohranita.",
    data: { given: [`A = ${ptr(A)}`, `B = ${ptr(B)}`, `C = ${ptr(C)}`, "\\text{orientacija } ABC = \\text{pozitivna}"], find: ["\\text{orientacija slike}"] },
    formula: ["\\text{premik, vrtež: orientacija se ohrani}", "\\text{zrcaljenje čez premico: orientacija se spremeni}"],
    solution: `${mp.why}\nOrientacija slike je ${mp.keep ? "pozitivna" : "negativna"}.`,
  };
}

function togiL2(r) {
  const t = r.int(0, 2);
  const x = r.nonZero(-8, 8);
  let y = r.nonZero(-8, 8);
  if (Math.abs(y) === Math.abs(x)) y = y > 0 ? y + 1 : y - 1;
  const i = r.int(0, 1);
  const c = coordName(i);
  if (t === 0) {
    const key = r.pick(["d", "e"]);
    const m = REFL[key];
    const img = m.f([x, y]);
    const other = REFL[key === "d" ? "e" : "d"].f([x, y])[i];
    return {
      text: `Točko $T${pnt(x, y)}$ prezrcalimo čez ${m.t}. Kolikšna je koordinata $${c}'$ slike $T'$?`,
      answer: num(img[i], null, [
        { value: [x, y][i], why: "Pri zrcaljenju čez simetralo kvadrantov koordinati zamenjata mesti." },
        { value: other, why: m.why },
        { value: key === "d" ? -[x, y][i] : [-x, -y][i], why: key === "d" ? "Čez premico $y = x$ se predznaka ne spremenita, koordinati le zamenjata mesti." : "Poleg spremembe predznakov koordinati zamenjata še mesti." },
      ]),
      hint: "Premisli, kam se preslikata točki $(1, 0)$ in $(0, 1)$. Pomagaj si s skico.",
      data: { given: [`T = ${pnt(x, y)}`, `\\text{preslikava} = \\text{zrcaljenje čez ${m.t.replace(/\$/g, "")}}`], find: [`${c}'`] },
      formula: m.rule,
      solution: `Pravilo: $${m.rule}$\n$T'${ptr(img)}$\n$${c}' = ${img[i]}$`,
    };
  }
  if (t === 1) {
    const key = r.pick(["p", "m", "h"]);
    const m = ROT[key];
    const img = m.f([x, y]);
    const ms = [];
    if (key !== "h") ms.push({ value: ROT[key === "p" ? "m" : "p"].f([x, y])[i], why: "Pozitivna smer vrteža je nasprotna smeri urinega kazalca: $(x, y) \\mapsto (-y, x)$. Preveri smer." });
    ms.push({ value: [y, x][i], why: "Pri vrtežu ne zamenjaš le koordinat, ena od njiju spremeni še predznak." });
    if (key === "h") ms.push({ value: [x, -y][i], why: "Pri vrtežu za $180^\\circ$ spremenita predznak obe koordinati." });
    const who = name(r);
    return {
      text: `${who} v programu za dinamično geometrijo zavrti točko $T${pnt(x, y)}$ okoli izhodišča ${m.t}. Kolikšna je koordinata $${c}'$ slike $T'$?`,
      answer: num(img[i], null, ms),
      hint: "Nariši točko in daljico od izhodišča do nje ter jo zavrti. Preveri s točko $(1, 0)$.",
      data: { given: [`T = ${pnt(x, y)}`, `\\text{središče vrteža} = O`], find: [`${c}'`] },
      formula: [ROT.p.rule + "\\ (90^\\circ)", ROT.h.rule + "\\ (180^\\circ)"],
      solution: `Pravilo: $${m.rule}$\n$T'${ptr(img)}$\n$${c}' = ${img[i]}$`,
    };
  }
  const vert = r.next() < 0.5;
  const a = r.nonZero(-4, 4);
  const v = vert ? x : y;
  if (v === a) return null;
  const im = 2 * a - v;
  const L = vert ? "x" : "y";
  return {
    text: `Točko $T${pnt(x, y)}$ prezrcalimo čez premico $${L} = ${a}$. Kolikšna je koordinata $${L}'$ slike $T'$?`,
    answer: num(im, null, [
      { value: -v, why: `Premica $${L} = ${a}$ ni koordinatna os: zrcališ čez to premico, ne čez os.` },
      { value: a - v, why: `Od premice moraš iti še enkrat toliko kot točka: $${L}' = ${a} + (${a} - ${L})$.` },
      { value: v + 2 * a, why: `Razdaljo do premice odšteješ od položaja premice: $${L}' = 2 \\cdot ${pt(a)} - ${L}$.` },
    ]),
    hint: `Izračunaj, za koliko je točka oddaljena od premice $${L} = ${a}$, in pojdi enako daleč na drugo stran.`,
    data: { given: [`T = ${pnt(x, y)}`, `${L} = ${a}`], find: [`${L}'`] },
    formula: `${L}' = 2 \\cdot ${pt(a)} - ${L}`,
    solution: `Odmik od premice (s predznakom): $${v} - ${pt(a)} = ${v - a}$\nNa drugi strani: $${L}' = ${a} - ${pt(v - a)} = ${im}$\nDruga koordinata se ne spremeni: $T'${ptr(vert ? [im, y] : [x, im])}$`,
  };
}

function togiL3(r) {
  const t = r.int(0, 3);
  if (t === 0) {
    const vert = r.next() < 0.5;
    const L = vert ? "x" : "y";
    const a = r.int(-5, 5);
    let b = r.int(-5, 5);
    if (b === a) b = a + r.pick([2, 3, -2]);
    const x = r.int(-8, 8);
    const y = r.int(-8, 8);
    const v = vert ? x : y;
    const v1 = 2 * a - v;
    const v2 = 2 * b - v1;
    const askLen = r.next() < 0.35;
    const ln = 2 * Math.abs(b - a);
    return {
      text: `Točko $T${pnt(x, y)}$ najprej prezrcalimo čez premico $${L} = ${a}$, nato sliko še čez premico $${L} = ${b}$. ${askLen ? "Za koliko enot se je točka skupaj premaknila?" : `Kolikšna je koordinata $${L}''$ končne slike $T''$?`}`,
      answer: askLen
        ? num(ln, null, [{ value: Math.abs(b - a), why: "Dve zrcaljenji čez vzporedni premici sta premik za dvojno razdaljo med premicama." }])
        : num(v2, null, [
            { value: v + (b - a), why: "Dve zrcaljenji čez vzporedni premici sta premik za dvojno razdaljo med premicama." },
            { value: v + 2 * (a - b), why: "Vrstni red zrcaljenj je pomemben: premik gre od prve premice proti drugi." },
            { value: 2 * b - v, why: "Pozabil si na prvo zrcaljenje: drugo zrcališ sliko $T'$, ne točke $T$." },
          ]),
      hint: "Zrcali korak za korakom: najprej $T$ čez prvo premico, nato dobljeno sliko čez drugo.",
      data: { given: [`T = ${pnt(x, y)}`, `${L} = ${a}`, `${L} = ${b}`], find: [askLen ? "\\text{dolžina premika}" : `${L}''`] },
      formula: [`${L}' = 2a - ${L}`, "\\text{dve zrcaljenji čez vzporedni premici} = \\text{premik za } 2d"],
      solution: `Prvo zrcaljenje: $${L}' = 2 \\cdot ${pt(a)} - ${pt(v)} = ${v1}$\nDrugo zrcaljenje: $${L}'' = 2 \\cdot ${pt(b)} - ${pt(v1)} = ${v2}$\nSkupaj premik za $2(${b} - ${pt(a)}) = ${2 * (b - a)}$ v smeri osi $${L}$, dolžina $${ln}$.`,
    };
  }
  if (t === 1) {
    const th = r.pick([15, 20, 25, 35, 40, 50, 55, 65, 70, 80, 85]);
    const who = name(r);
    return {
      text: `Premici $p$ in $q$ se sekata v točki $S$ pod kotom $${th}^\\circ$. ${who} lik prezrcali čez $p$, nato sliko še čez $q$. Za kolikšen kot (manjši od $180^\\circ$) je končna slika zasukana okoli $S$?`,
      answer: num(2 * th, null, [{ value: th, why: "Vsako zrcaljenje prispeva kot do premice, zato je zasuk dvakratnik kota med premicama." }]),
      hint: "Zrcali eno točko na kraku $p$: ostane na mestu. Nato jo zrcali čez $q$ in poglej kot.",
      data: { given: [`\\angle(p, q) = ${th}^\\circ`], find: ["\\text{kot vrteža}"] },
      formula: "\\text{dve zrcaljenji čez sekajoči se premici} = \\text{vrtež za } 2\\theta",
      solution: `Kompozitum dveh zrcaljenj čez premici, ki se sekata v $S$, je vrtež okoli $S$.\nKot vrteža je dvakratnik kota med premicama.\n$2 \\cdot ${th}^\\circ = ${2 * th}^\\circ$`,
    };
  }
  if (t === 2) {
    const x = r.nonZero(-7, 7);
    let y = r.nonZero(-7, 7);
    if (Math.abs(y) === Math.abs(x)) y = y > 0 ? y + 1 : y - 1;
    const p = r.nonZero(-4, 4);
    const q = r.nonZero(-4, 4);
    const ops = [
      { f: REFL.x.f, t: "zrcaljenje čez os $x$" },
      { f: REFL.y.f, t: "zrcaljenje čez os $y$" },
      { f: REFL.d.f, t: "zrcaljenje čez premico $y = x$" },
      { f: ROT.p.f, t: "vrtež za $90^\\circ$ okoli izhodišča v pozitivni smeri" },
      { f: ([u, w]) => [u + p, w + q], t: `premik za vektor $(${p}, ${q})$` },
    ];
    const [o1, o2] = r.shuffle(ops).slice(0, 2);
    const i = r.int(0, 1);
    const c = coordName(i);
    const m1 = o1.f([x, y]);
    const img = o2.f(m1);
    return {
      text: `Na točki $T${pnt(x, y)}$ najprej izvedemo ${o1.t}, nato na sliki še ${o2.t}. Kolikšna je koordinata $${c}''$ končne slike?`,
      answer: num(img[i], null, [
        { value: o1.f(o2.f([x, y]))[i], why: "Preslikavi si izvedel v obratnem vrstnem redu; vrstni red je pomemben." },
        { value: o2.f([x, y])[i], why: "Drugo preslikavo izvedeš na sliki po prvi, ne na prvotni točki." },
        { value: m1[i], why: "To je slika po prvi preslikavi. Izvesti moraš še drugo." },
      ]),
      hint: "Preslikavi izvedi eno za drugo: najprej poišči $T'$, nato iz nje $T''$.",
      data: { given: [`T = ${pnt(x, y)}`], find: [`${c}''`] },
      formula: ["(x, y) \\mapsto (x + p, y + q)", REFL.x.rule, ROT.p.rule],
      solution: `Prva preslikava: $T'${ptr(m1)}$\nDruga preslikava: $T''${ptr(img)}$\n$${c}'' = ${img[i]}$`,
    };
  }
  // vrsta kompozituma (izbira)
  const par = r.next() < 0.5;
  const d = r.int(2, 9);
  const th = r.pick([20, 25, 30, 35, 40, 50, 55, 65, 70]);
  const text = par
    ? `Premici $p$ in $q$ sta vzporedni in oddaljeni $${d}\\ \\mathrm{cm}$. Katera preslikava je kompozitum zrcaljenja čez $p$ in zrcaljenja čez $q$?`
    : `Premici $p$ in $q$ se sekata v točki $S$ pod kotom $${th}^\\circ$. Katera preslikava je kompozitum zrcaljenja čez $p$ in zrcaljenja čez $q$?`;
  const correct = par ? `vzporedni premik za $${2 * d}\\ \\mathrm{cm}$` : `vrtež okoli $S$ za $${2 * th}^\\circ$`;
  const wrongs = par
    ? [
        [`vzporedni premik za $${d}\\ \\mathrm{cm}$`, "Vsako zrcaljenje prispeva razdaljo do premice, skupaj je premik dvojna razdalja med premicama."],
        ["zrcaljenje čez premico na sredini med $p$ in $q$", "Dve zrcaljenji ohranita orientacijo, eno zrcaljenje pa jo spremeni, zato kompozitum ni zrcaljenje."],
        ["vrtež za $180^\\circ$", "Pri vrtežu ostane ena točka na mestu, tu pa se vse točke premaknejo v isti smeri."],
      ]
    : [
        [`vrtež okoli $S$ za $${th}^\\circ$`, "Kot vrteža je dvakratnik kota med premicama."],
        ["zrcaljenje čez simetralo kota med $p$ in $q$", "Dve zrcaljenji ohranita orientacijo, eno zrcaljenje pa jo spremeni, zato kompozitum ni zrcaljenje."],
        [`vzporedni premik za $${2 * th}$ enot`, "Pri premiku nobena točka ne ostane na mestu, točka $S$ pa ostane."],
      ];
  return {
    text,
    answer: pickAns(r, correct, wrongs),
    hint: "Ugotovi, ali katera točka ostane na mestu in ali se orientacija ohrani.",
    data: { given: par ? [`d(p, q) = ${d}\\ \\mathrm{cm}`] : [`p \\cap q = S`, `\\angle(p, q) = ${th}^\\circ`], find: ["\\text{kompozitum}"] },
    formula: ["\\text{vzporedni premici: premik za } 2d", "\\text{sekajoči se premici: vrtež za } 2\\theta"],
    solution: par
      ? `Dve zrcaljenji ohranita orientacijo, nobena točka ne ostane na mestu.\nKompozitum je vzporedni premik pravokotno na premici za $2d = 2 \\cdot ${d} = ${2 * d}\\ \\mathrm{cm}$.`
      : `Točka $S$ leži na obeh premicah, zato ostane na mestu; orientacija se ohrani.\nKompozitum je vrtež okoli $S$ za $2 \\cdot ${th}^\\circ = ${2 * th}^\\circ$.`,
  };
}

// ================= Heronova formula, R in r =================
const HERON_BASE = [
  [3, 4, 5], [5, 5, 6], [5, 5, 8], [5, 12, 13], [8, 15, 17], [13, 14, 15], [9, 10, 17], [10, 13, 13],
  [13, 13, 24], [7, 15, 20], [11, 13, 20], [10, 17, 21], [4, 13, 15], [13, 20, 21], [12, 17, 25], [6, 25, 29],
];
const heronS = (a, b, c) => {
  const s = (a + b + c) / 2;
  return Math.sqrt(s * (s - a) * (s - b) * (s - c));
};
function triangle(r, filter = () => true) {
  for (let i = 0; i < 40; i++) {
    const base = r.pick(HERON_BASE);
    const k = r.pick([1, 1, 2, 3]);
    const sides = base.map((x) => x * k);
    if (Math.max(...sides) > 45) continue;
    const S = heronS(...sides);
    if (Math.abs(S - Math.round(S)) > 1e-9) continue;
    const s = (sides[0] + sides[1] + sides[2]) / 2;
    const tr = { sides: r.shuffle(sides), S: Math.round(S), s, o: 2 * s };
    if (filter(tr)) return tr;
  }
  return null;
}
const sidesT = ([a, b, c]) => `$a = ${cm(a)}$, $b = ${cm(b)}$ in $c = ${cm(c)}$`;
const sidesG = ([a, b, c]) => [`a = ${cm(a)}`, `b = ${cm(b)}`, `c = ${cm(c)}`];
function heronSteps(tr) {
  const [a, b, c] = tr.sides;
  const { s } = tr;
  return [
    `$s = \\frac{a + b + c}{2} = \\frac{${tr.o}}{2} = ${cm(s)}$`,
    `$s - a = ${s - a}$, $s - b = ${s - b}$, $s - c = ${s - c}$`,
    `$S = \\sqrt{${s} \\cdot ${s - a} \\cdot ${s - b} \\cdot ${s - c}} = \\sqrt{${s * (s - a) * (s - b) * (s - c)}} = ${cm2(tr.S)}$`,
  ];
}
const HERON = "S = \\sqrt{s(s - a)(s - b)(s - c)}";
const lenA = (v, ms) => num(v, 2, ms.map((m) => ({ ...m, value: rd(m.value, 2) })), "cm");

function heronL1(r) {
  const t = r.int(0, 2);
  if (t === 0) {
    const tr = triangle(r);
    if (!tr) return null;
    const [a, b, c] = tr.sides;
    const { s, o } = tr;
    return {
      text: `Stranice trikotnika merijo ${sidesT(tr.sides)}. Izračunaj njegovo ploščino s Heronovo formulo.`,
      answer: num(tr.S, null, [
        { value: s * (s - a) * (s - b) * (s - c), why: "Pozabil si koreniti: Heronova formula ima pod korenom produkt." },
        { value: Math.sqrt(o * (o - a) * (o - b) * (o - c)), why: "V Heronovi formuli je polobseg $s$, ne obseg." },
      ], "cm²"),
      hint: "Najprej izračunaj polobseg $s$ in razlike $s - a$, $s - b$, $s - c$.",
      data: { given: sidesG(tr.sides), find: ["S"] },
      formula: ["s = \\frac{a + b + c}{2}", HERON],
      solution: heronSteps(tr).join("\n"),
    };
  }
  if (t === 1) {
    const rr = r.pick([1, 2, 3, 4, 5, 1.5, 2.5, 3.5]);
    // Polmer včrtane krožnice je največ s/(3√3); s ≥ 6r, da trikotnik res obstaja.
    const s = r.int(Math.ceil(6 * rr), Math.ceil(6 * rr) + 24);
    const S = rr * s;
    const ctx = r.pick(["trikotnika", "trikotne mize", "trikotne gredice", "trikotnega prta"]);
    return {
      text: `Ploščina ${ctx} je $${cm2(S)}$, polobseg pa $s = ${cm(s)}$. Izračunaj polmer včrtane krožnice. Rezultat zaokroži na dve decimalki.`,
      answer: lenA(rr, [
        { value: S / (2 * s), why: "V formuli $r = \\frac{S}{s}$ je polobseg, ne obseg." },
        { value: s / S, why: "Ploščino deliš s polobsegom, ne obratno." },
        { value: (2 * S) / s, why: "Ploščina je $S = r \\cdot s$ (vsota treh trikotnikov z višino $r$), brez faktorja $\\frac{1}{2}$." },
      ]),
      hint: "Ploščina je vsota treh trikotnikov z višino $r$ in osnovnicami $a$, $b$, $c$.",
      data: { given: [`S = ${cm2(S)}`, `s = ${cm(s)}`], find: ["r"] },
      formula: ["S = r \\cdot s", "r = \\frac{S}{s}"],
      solution: `$r = \\frac{S}{s}$\n$r = \\frac{${tx(S)}}{${s}} = ${cm(rr)}$`,
    };
  }
  const tr = triangle(r);
  if (!tr) return null;
  const [a, b, c] = tr.sides;
  const R = (a * b * c) / (4 * tr.S);
  return {
    text: `Trikotnik s stranicami ${sidesT(tr.sides)} ima ploščino $${cm2(tr.S)}$. Izračunaj polmer očrtane krožnice. Rezultat zaokroži na dve decimalki.`,
    answer: lenA(R, [
      { value: (a * b * c) / (2 * tr.S), why: "V imenovalcu je $4S$, ne $2S$." },
      { value: (a * b * c) / tr.S, why: "V imenovalcu je $4S$: pozabil si na faktor $4$." },
      { value: tr.S / tr.s, why: "To je polmer včrtane krožnice. Za očrtano velja $R = \\frac{abc}{4S}$." },
    ]),
    hint: "Zmnoži vse tri stranice in deli s štirikratnikom ploščine.",
    data: { given: [...sidesG(tr.sides), `S = ${cm2(tr.S)}`], find: ["R"] },
    formula: "R = \\frac{abc}{4S}",
    solution: `$R = \\frac{abc}{4S} = \\frac{${a} \\cdot ${b} \\cdot ${c}}{4 \\cdot ${tr.S}}$\n$R = \\frac{${a * b * c}}{${4 * tr.S}} ${ap(R, 2)} ${cm(rd(R, 2))}$`,
  };
}

function heronL2(r) {
  const t = r.int(0, 2);
  if (t === 0 || t === 1) {
    const tr = triangle(r);
    if (!tr) return null;
    const [a, b, c] = tr.sides;
    const { S, s } = tr;
    const askR = t === 1;
    const R = (a * b * c) / (4 * S);
    const rr = S / s;
    return {
      text: `Stranice trikotnika merijo ${sidesT(tr.sides)}. Izračunaj polmer ${askR ? "očrtane" : "včrtane"} krožnice. Rezultat zaokroži na dve decimalki.`,
      answer: askR
        ? lenA(R, [
            { value: (a * b * c) / (2 * S), why: "V imenovalcu je $4S$, ne $2S$." },
            { value: rr, why: "To je polmer včrtane krožnice. Za očrtano velja $R = \\frac{abc}{4S}$." },
            { value: (a * b * c) / (4 * s * (s - a) * (s - b) * (s - c)), why: "Ploščino iz Heronove formule moraš še koreniti." },
          ])
        : lenA(rr, [
            { value: S / tr.o, why: "V formuli $r = \\frac{S}{s}$ je polobseg, ne obseg." },
            { value: R, why: "To je polmer očrtane krožnice. Za včrtano velja $r = \\frac{S}{s}$." },
            { value: (s * (s - a) * (s - b) * (s - c)) / s, why: "Ploščino iz Heronove formule moraš še koreniti." },
          ]),
      hint: "Najprej s Heronovo formulo izračunaj ploščino trikotnika.",
      data: { given: sidesG(tr.sides), find: [askR ? "R" : "r"] },
      formula: [HERON, askR ? "R = \\frac{abc}{4S}" : "r = \\frac{S}{s}"],
      solution: [
        ...heronSteps(tr),
        askR ? `$R = \\frac{abc}{4S} = \\frac{${a * b * c}}{${4 * S}} ${ap(R, 2)} ${cm(rd(R, 2))}$` : `$r = \\frac{S}{s} = \\frac{${S}}{${s}} ${ap(rr, 2)} ${cm(rd(rr, 2))}$`,
      ].join("\n"),
    };
  }
  // gredica: obseg v m, ploščina v m², polmer v cm
  const rc = r.pick([20, 25, 30, 35, 40, 45, 50, 60]);
  const s = r.int(3, 9);
  const o = 2 * s;
  // Polmer včrtane krožnice je največ s/(3√3) (enakostranični trikotnik); z rezervo, da gredica obstaja.
  if (rc / 100 > (0.9 * s) / (3 * Math.sqrt(3))) return null;
  const S = cl((rc / 100) * s);
  const who = name(r);
  return {
    text: `${who} ima trikotno gredico z obsegom $${tx(o)}\\ \\mathrm{m}$ in ploščino $${tx(S)}\\ \\mathrm{m^2}$. Na sredino želi okroglo korito, ki se dotika vseh treh robov. Kolikšen je polmer korita v cm?`,
    answer: num(rc, null, [
      { value: cl((S / o) * 100), why: "V formuli $r = \\frac{S}{s}$ je polobseg: obseg najprej razpolovi." },
      { value: cl(S / s), why: "Rezultat je v metrih, vprašanje pa sprašuje po centimetrih." },
      { value: cl((s / S) * 100), why: "Ploščino deliš s polobsegom, ne obratno." },
    ], "cm"),
    hint: "Korito je krog, včrtan trikotniku. Obseg razpolovi, uporabi $r = \\frac{S}{s}$ in rezultat pretvori v cm.",
    data: { given: [`o = ${tx(o)}\\ \\mathrm{m}`, `S = ${tx(S)}\\ \\mathrm{m^2}`], find: ["r\\ [\\mathrm{cm}]"] },
    formula: ["s = \\frac{o}{2}", "r = \\frac{S}{s}"],
    solution: `$s = \\frac{o}{2} = ${tx(s)}\\ \\mathrm{m}$\n$r = \\frac{S}{s} = \\frac{${tx(S)}}{${s}} = ${tx(rc / 100)}\\ \\mathrm{m}$\n$r = ${cm(rc)}$`,
  };
}

function heronL3(r) {
  const t = r.int(0, 3);
  if (t === 0) {
    const tr = triangle(r);
    if (!tr) return null;
    const { S, s } = tr;
    const rr = S / s;
    const rest = S - Math.PI * rr * rr;
    return {
      text: `Iz trikotne plošče s stranicami ${sidesT(tr.sides)} izrežemo največji možni krog. Koliko $\\mathrm{cm^2}$ plošče ostane? Zaokroži na dve decimalki.`,
      answer: num(rest, 2, [
        { value: Math.PI * rr * rr, why: "To je ploščina kroga. Vprašanje je, koliko plošče ostane." },
        { value: S - 2 * Math.PI * rr, why: "Ploščina kroga je $\\pi r^2$, ne $2\\pi r$ (to je obseg)." },
        { value: S - Math.PI * (S / tr.o) ** 2, why: "Polmer včrtane krožnice je $\\frac{S}{s}$ s polobsegom, ne z obsegom." },
      ].map((m) => ({ ...m, value: rd(m.value, 2) })), "cm²"),
      hint: "Največji krog je včrtani krog. Potrebuješ ploščino trikotnika in polmer $r = \\frac{S}{s}$.",
      data: { given: sidesG(tr.sides), find: ["S - \\pi r^2"] },
      formula: [HERON, "r = \\frac{S}{s}", "S_{\\text{krog}} = \\pi r^2"],
      solution: [...heronSteps(tr), `$r = \\frac{S}{s} = \\frac{${S}}{${s}} ${ap(rr, 4)} ${cm(rd(rr, 4))}$`, `$S - \\pi r^2 ${ap(rest, 2)} ${cm2(rd(rest, 2))}$`].join("\n"),
    };
  }
  if (t === 1) {
    const tr = triangle(r, (x) => Number.isInteger((2 * x.S) / x.s));
    if (!tr) return null;
    const [a, b, c] = tr.sides;
    const rr = tr.S / tr.s;
    return {
      text: `Trikotnik ima ploščino $${cm2(tr.S)}$, polmer včrtane krožnice $r = ${cm(rr)}$ ter stranici $a = ${cm(a)}$ in $b = ${cm(b)}$. Kolikšna je stranica $c$?`,
      answer: num(c, null, [
        { value: tr.s - a - b, why: "Iz $r = \\frac{S}{s}$ dobiš polobseg $s$; obseg je $2s$." },
        { value: tr.S / rr, why: "To je polobseg $s$. Stranica je $c = 2s - a - b$." },
        { value: (tr.S / rr) * 2, why: "To je obseg. Odšteti moraš še znani stranici." },
      ], "cm"),
      hint: "Iz $r = \\frac{S}{s}$ izrazi polobseg $s$, nato iz obsega izračunaj $c$.",
      data: { given: [`S = ${cm2(tr.S)}`, `r = ${cm(rr)}`, `a = ${cm(a)}`, `b = ${cm(b)}`], find: ["c"] },
      formula: ["s = \\frac{S}{r}", "a + b + c = 2s"],
      solution: `$s = \\frac{S}{r} = \\frac{${tr.S}}{${tx(rr)}} = ${cm(tr.s)}$\n$a + b + c = 2s = ${cm(tr.o)}$\n$c = ${tr.o} - ${a} - ${b} = ${cm(c)}$`,
    };
  }
  if (t === 2) {
    const tr = triangle(r);
    if (!tr) return null;
    const [a, b, c] = tr.sides;
    const { S, s } = tr;
    const R = (a * b * c) / (4 * S);
    const rr = S / s;
    const diff = R - rr;
    return {
      text: `Stranice trikotnika merijo ${sidesT(tr.sides)}. Za koliko je polmer očrtane krožnice večji od polmera včrtane? Zaokroži na dve decimalki.`,
      answer: lenA(diff, [
        { value: (a * b * c) / (2 * S) - rr, why: "Za očrtano krožnico je v imenovalcu $4S$, ne $2S$." },
        { value: R - S / tr.o, why: "Pri včrtani krožnici deliš s polobsegom, ne z obsegom." },
        { value: R + rr, why: "Iščeš razliko polmerov, ne vsote." },
      ]),
      hint: "Najprej izračunaj ploščino s Heronovo formulo, nato oba polmera.",
      data: { given: sidesG(tr.sides), find: ["R - r"] },
      formula: [HERON, "R = \\frac{abc}{4S}", "r = \\frac{S}{s}"],
      solution: [
        ...heronSteps(tr),
        `$R = \\frac{${a * b * c}}{${4 * S}} ${ap(R, 4)} ${cm(rd(R, 4))}$, $r = \\frac{${S}}{${s}} ${ap(rr, 4)} ${cm(rd(rr, 4))}$`,
        `$R - r ${ap(diff, 2)} ${cm(rd(diff, 2))}$`,
      ].join("\n"),
    };
  }
  const tr = triangle(r);
  if (!tr) return null;
  const sorted = [...tr.sides].sort((u, w) => u - w);
  const L = sorted[2];
  const h = (2 * tr.S) / L;
  return {
    text: `Stranice trikotnika merijo ${sidesT(tr.sides)}. Izračunaj višino na najdaljšo stranico. Zaokroži na dve decimalki.`,
    answer: lenA(h, [
      { value: tr.S / L, why: "Iz $S = \\frac{c \\cdot v_c}{2}$ dobiš $v_c = \\frac{2S}{c}$: pozabil si na faktor $2$." },
      { value: (2 * tr.S) / sorted[0], why: "Višina na najdaljšo stranico: deli z najdaljšo stranico, ne z najkrajšo." },
    ]),
    hint: "Ploščino izračunaj s Heronovo formulo, nato jo izrazi še z najdaljšo stranico in višino nanjo.",
    data: { given: sidesG(tr.sides), find: ["v"] },
    formula: [HERON, "S = \\frac{c \\cdot v_c}{2}"],
    solution: [...heronSteps(tr), `Najdaljša stranica je $${cm(L)}$.`, `$v = \\frac{2S}{${L}} = \\frac{${2 * tr.S}}{${L}} ${ap(h, 2)} ${cm(rd(h, 2))}$`].join("\n"),
  };
}

// ================= načrtovalne naloge =================
const STEPS = [
  { k: "analiza", d: "narišemo skico, kot da je lik že narisan, in v njej poiščemo zveze med podatki" },
  { k: "opis", d: "zapišemo zaporedje korakov, po katerih bomo lik narisali" },
  { k: "načrtovanje", d: "lik z ravnilom in šestilom natančno narišemo" },
  { k: "diskusija", d: "ugotovimo, koliko rešitev ima naloga in pri katerih podatkih rešitve ni" },
];
const STEP_WHY = {
  analiza: "Analiza je prvi korak: skica in iskanje zvez med podatki.",
  opis: "Opis je zapis korakov načrtovanja, preden začnemo risati.",
  načrtovanje: "Načrtovanje je samo risanje z ravnilom in šestilom po opisu.",
  diskusija: "Diskusija je zadnji korak: število rešitev in pogoji za obstoj.",
};
const ORDERS = [
  ["analiza", "opis", "načrtovanje", "diskusija"],
  ["načrtovanje", "analiza", "opis", "diskusija"],
  ["analiza", "načrtovanje", "opis", "diskusija"],
  ["opis", "analiza", "načrtovanje", "diskusija"],
  ["analiza", "opis", "diskusija", "načrtovanje"],
  ["diskusija", "analiza", "opis", "načrtovanje"],
];
const ORDER_WHY = [
  null,
  "Brez analize ne vemo, kako risati: skica in zveze med podatki so pred risanjem.",
  "Opis (zaporedje korakov) zapišemo pred risanjem, ne po njem.",
  "Opis korakov sestavimo iz ugotovitev analize, zato je analiza prva.",
  "O številu rešitev razpravljamo, ko vemo, kako lik nastane: diskusija je zadnja.",
  "Diskusija o številu rešitev potrebuje analizo in načrtovanje, zato je zadnja.",
];
// Konstruktibilni koti (večkratniki 7,5°) in koti, ki jih z ravnilom in šestilom ne moremo načrtati.
const NOT_CONSTR = [10, 20, 25, 35, 40, 50, 55, 65, 70, 80, 85, 100, 110, 115, 125, 130, 140, 145, 155, 160, 170];

function sskCount(a, b, al) {
  if (al >= 90) return a > b ? 1 : 0;
  if (a >= b) return 1;
  if (al !== 30) return null;
  const h = b / 2;
  return a < h ? 0 : a === h ? 1 : 2;
}

function nacrtL1(r) {
  const t = r.int(0, 2);
  if (t === 0) {
    const x = r.int(2, 9);
    const y = r.int(2, 9);
    const z = r.int(Math.abs(x - y) + 1, x + y - 1);
    const u = r.int(2, 8);
    const w = r.int(2, 8);
    const d = r.int(1, 4);
    const p = r.int(2, 7);
    const q = r.int(3, 8);
    const e = r.int(1, 3);
    const tri = (arr) => arr.map((v) => `$${v}$`).join(", ") + " cm";
    const good = tri(r.shuffle([x, y, z]));
    const wrongs = [
      [tri([u, w, u + w]), `$${u} + ${w} = ${u + w}$: palici se le položita na tretjo, trikotnik je izrojen. Vsota mora biti večja.`],
      [tri([p, q, p + q + e]), `$${p} + ${q} < ${p + q + e}$: krajši palici ne sežeta od enega do drugega konca najdaljše.`],
      [tri([p + q + e + 1, p, q + 1]), `Ni dovolj preveriti le prvih dveh: $${p} + ${q + 1} < ${p + q + e + 1}$, krajši palici skupaj sta prekratki.`],
    ];
    return {
      text: `${name(r)} sestavlja trikotnik iz palic. Iz katere trojice palic lahko sestavi trikotnik?`,
      answer: pickAns(r, good, wrongs),
      hint: "Seštej dolžini krajših palic in primerjaj z najdaljšo.",
      data: { given: ["\\text{pogoj} = \\text{trikotniška neenakost}"], find: ["\\text{trojica, ki da trikotnik}"] },
      formula: "|a - b| < c < a + b",
      solution: `Trikotnik obstaja, če je vsota krajših stranic večja od najdaljše.\nTo velja le za ${good}.`,
    };
  }
  if (t === 1) {
    const a = r.int(3, 15);
    let b = r.int(2, 14);
    if (b === a) b = a + 3;
    const small = r.next() < 0.5;
    const lo = Math.abs(a - b) + 1;
    const hi = a + b - 1;
    return {
      text: `Stranici trikotnika merita $${cm(a)}$ in $${cm(b)}$. Tretja stranica meri celo število centimetrov. Kolikšna je ${small ? "najmanjša" : "največja"} možna dolžina tretje stranice (v cm)?`,
      answer: num(small ? lo : hi, null, small
        ? [{ value: lo - 1, why: `Pri $c = ${lo - 1}$ je $c + ${Math.min(a, b)} = ${Math.max(a, b)}$: trikotnik je izrojen. Neenakost je stroga.` }]
        : [
            { value: hi + 1, why: `Pri $c = ${hi + 1}$ je $${a} + ${b} = c$: trikotnik je izrojen. Neenakost je stroga.` },
            { value: Math.max(a, b), why: "Tretja stranica je lahko tudi najdaljša, le krajša od vsote drugih dveh." },
          ]),
      hint: "Uporabi trikotniško neenakost: tretja stranica je večja od razlike in manjša od vsote danih stranic.",
      data: { given: [`a = ${cm(a)}`, `b = ${cm(b)}`], find: [small ? "c_{\\min}" : "c_{\\max}"] },
      formula: "|a - b| < c < a + b",
      solution: `$|${a} - ${b}| < c < ${a} + ${b}$\n$${Math.abs(a - b)} < c < ${a + b}$\n${small ? `Najmanjše celo število: $c = ${lo}$` : `Največje celo število: $c = ${hi}$`}`,
    };
  }
  // koraki načrtovalne naloge
  if (r.next() < 0.4) {
    const correct = ORDERS[0].join(" → ");
    const pool = r.shuffle([1, 2, 3, 4, 5]).slice(0, 3);
    return {
      text: "V kakšnem vrstnem redu rešujemo načrtovalno nalogo?",
      answer: pickAns(r, correct, pool.map((j) => [ORDERS[j].join(" → "), ORDER_WHY[j]])),
      hint: "Najprej moramo vedeti, kako lik nastane, šele nato ga narišemo; na koncu presodimo število rešitev.",
      data: { given: ["\\text{koraki} = \\text{analiza, opis, načrtovanje, diskusija}"], find: ["\\text{vrstni red}"] },
      formula: "\\text{analiza} \\to \\text{opis} \\to \\text{načrtovanje} \\to \\text{diskusija}",
      solution: `Analiza: skica in zveze med podatki.\nOpis: zaporedje korakov.\nNačrtovanje: risanje z ravnilom in šestilom.\nDiskusija: število rešitev.`,
    };
  }
  const st = r.pick(STEPS);
  const fig = r.pick(["trikotnik", "paralelogram", "trapez", "deltoid", "romb"]);
  return {
    text: `Pri načrtovalni nalogi, v kateri iščemo ${fig}, ${st.d}. Kateri korak načrtovalne naloge je to?`,
    answer: pickAns(r, st.k, STEPS.filter((x) => x.k !== st.k).map((x) => [x.k, STEP_WHY[x.k]])),
    hint: "Spomni se vrstnega reda: analiza, opis, načrtovanje, diskusija.",
    data: { given: [`\\text{korak} = \\text{${st.d}}`], find: ["\\text{korak}"] },
    formula: "\\text{analiza} \\to \\text{opis} \\to \\text{načrtovanje} \\to \\text{diskusija}",
    solution: `${STEP_WHY[st.k]}\nTo je ${st.k}.`,
  };
}

function nacrtL2(r) {
  const t = r.int(0, 2);
  if (t === 0) {
    const a = r.int(3, 15);
    let b = r.int(2, 14);
    if (b === a) b = a + 2;
    const m = Math.min(a, b);
    const cnt = 2 * m - 1;
    return {
      text: `Dve stranici trikotnika merita $${cm(a)}$ in $${cm(b)}$. Koliko različnih trikotnikov dobiš, če tretja stranica meri celo število centimetrov?`,
      answer: num(cnt, null, [
        { value: cnt + 2, why: "Krajišči $|a - b|$ in $a + b$ ne štejeta: tam je trikotnik izrojen." },
        { value: cnt + 1, why: "Šteješ cela števila strogo med $|a - b|$ in $a + b$: obe krajišči izpustiš." },
        { value: 2 * m, why: "Število celih števil strogo med $p$ in $q$ je $q - p - 1$." },
      ]),
      hint: "Poišči interval za tretjo stranico iz trikotniške neenakosti in preštej cela števila v njem.",
      data: { given: [`a = ${cm(a)}`, `b = ${cm(b)}`], find: ["\\text{število možnosti}"] },
      formula: ["|a - b| < c < a + b", "\\text{celih števil strogo med } p \\text{ in } q:\\ q - p - 1"],
      solution: `$${Math.abs(a - b)} < c < ${a + b}$\nCela števila od $${Math.abs(a - b) + 1}$ do $${a + b - 1}$.\nNjihovo število: $${a + b - 1} - ${Math.abs(a - b) + 1} + 1 = ${cnt}$`,
    };
  }
  if (t === 1) {
    const half = r.next() < 0.5;
    const good = half ? r.pick([22.5, 37.5, 52.5, 67.5, 82.5, 97.5, 112.5, 127.5]) : r.pick([15, 45, 75, 105, 135, 165, 30, 150]);
    const bad = r.shuffle(NOT_CONSTR).slice(0, 3);
    const opt = (v) => `$${deg(v)}$`;
    return {
      text: "Kateri kot lahko načrtamo samo z ravnilom in šestilom (brez kotomera)?",
      answer: pickAns(r, opt(good), bad.map((v) => [opt(v), `$${deg(v)}$ ni vsota ali razlika kotov $60^\\circ$, $90^\\circ$ in njunih (večkratnih) polovic, zato ga ne moremo načrtati.`])),
      hint: "Z ravnilom in šestilom dobimo $60^\\circ$ (enakostranični trikotnik) in $90^\\circ$ (pravokotnica), kot pa lahko razpolovimo. Iz teh sestavi kot.",
      data: { given: ["\\text{orodje} = \\text{ravnilo in šestilo}"], find: ["\\text{kot, ki ga lahko načrtamo}"] },
      formula: ["60^\\circ,\\ 90^\\circ", "\\text{razpolavljanje, seštevanje, odštevanje}"],
      solution: half
        ? `$${deg(good)} = ${deg(good - 7.5)} + 7{,}5^\\circ$, pri tem je $7{,}5^\\circ$ osmina kota $60^\\circ$ (trikrat razpolovimo).\n$${deg(good)}$ je večkratnik $7{,}5^\\circ$, zato ga lahko načrtamo.`
        : `$${deg(good)}$ je večkratnik $15^\\circ$ (četrtina kota $60^\\circ$).\nNastane s seštevanjem kotov $60^\\circ$, $90^\\circ$ in njunih polovic, zato ga lahko načrtamo.`,
    };
  }
  const B = r.pick([60, 90, 120, 180]);
  const n = r.int(1, 3);
  const tg = B / 2 ** n;
  return {
    text: `Kolikokrat moramo zapored razpoloviti kot $${deg(B)}$, da dobimo kot $${deg(tg)}$?`,
    answer: num(n, null, [
      { value: 2 ** n, why: `Kot je $${2 ** n}$-krat manjši, vsaka razpolovitev pa ga zmanjša za polovico: šteješ razpolovitve, ne razmerje.` },
      { value: n + 1, why: "Po prvi razpolovitvi imaš že polovico kota: preštej korake še enkrat." },
    ]),
    hint: "Vsaka razpolovitev kot zmanjša na polovico. Zapiši zaporedje kotov.",
    data: { given: [`\\alpha = ${deg(B)}`, `\\beta = ${deg(tg)}`], find: ["\\text{število razpolovitev}"] },
    formula: "\\text{po } n \\text{ razpolovitvah: } \\frac{\\alpha}{2^n}",
    solution: `${Array.from({ length: n }, (_, j) => `$${deg(B / 2 ** j)} \\to ${deg(B / 2 ** (j + 1))}$`).join("\n")}\nŠtevilo razpolovitev: $${n}$`,
  };
}

function nacrtL3(r) {
  const t = r.int(0, 2);
  if (t === 0) {
    const al = r.pick([30, 30, 30, 30, 90, 120, 135, 150, 45, 60]);
    const b = 2 * r.int(2, 8);
    let a;
    if (al === 30) {
      const kind = r.int(0, 3);
      a = kind === 0 ? r.int(1, b / 2 - 1) : kind === 1 ? b / 2 : kind === 2 ? r.int(b / 2 + 1, b - 1) : r.int(b, b + 5);
    } else if (al >= 90) a = r.next() < 0.5 ? r.int(b + 1, b + 6) : r.int(Math.max(1, b - 5), b);
    else a = r.int(b, b + 6);
    const cnt = sskCount(a, b, al);
    if (cnt === null || a < 1) return null;
    const h = b / 2;
    const ms = [];
    if (cnt === 2) ms.push({ value: 1, why: `Krožnica s polmerom $a$ okoli $C$ seka drugi krak kota dvakrat, ker je $a$ med razdaljo $C$ od kraka in $b$.` });
    if (cnt === 0) ms.push({ value: 1, why: al >= 90 ? "Nasproti topega ali pravega kota mora ležati najdaljša stranica; tu $a$ ni daljša od $b$." : "Krožnica s polmerom $a$ ne doseže drugega kraka, ker je $a$ manjša od razdalje $C$ od kraka." });
    if (cnt === 1 && al < 90 && a >= b) ms.push({ value: 2, why: "Ko je $a \\ge b$, je drugo presečišče krožnice točka $A$ ali leži na podaljšku kraka čez $A$, zato trikotnika ne da." });
    if (cnt === 1 && al === 30 && a === h) ms.push({ value: 2, why: "Krožnica se kraka le dotakne, zato je presečišče eno samo (pravokotni trikotnik)." });
    if (cnt === 1 && al >= 90) ms.push({ value: 2, why: "Pri topem ali pravem kotu leži drugo presečišče na podaljšku kraka čez $A$." });
    ms.push({ value: cnt === 0 ? 2 : 0, why: "Nariši kot, nanesi $b$ in okoli $C$ zariši krožnico s polmerom $a$: preštej presečišča z drugim krakom." });
    const data = [`a = ${cm(a)}`, `b = ${cm(b)}`, `\\alpha = ${al}^\\circ`];
    const caseLine =
      al >= 90
        ? `Kot $\\alpha$ ni oster, zato mora biti $a$ najdaljša stranica: $a ${a > b ? ">" : "\\le"} b$.`
        : a >= b
          ? `$a \\ge b$: krožnica seka drugi krak le enkrat (drugo presečišče je točka $A$ ali leži na podaljšku kraka čez $A$).`
          : `Razdalja $C$ od drugega kraka: $h = \\frac{b}{2} = ${h}$ (kateta nasproti $30^\\circ$ je polovica hipotenuze). $a ${a < h ? "<" : a === h ? "=" : ">"} h$${a > h ? " in $a < b$" : ""}.`;
    return {
      text: `Načrtaj trikotnik z $a = ${cm(a)}$, $b = ${cm(b)}$ in $\\alpha = ${al}^\\circ$ ($\\alpha$ leži nasproti stranice $a$). Koliko neskladnih trikotnikov dobiš?`,
      answer: num(cnt, null, ms),
      zeroOk: true,
      hint: "Nariši kot $\\alpha$, na en krak nanesi $b = AC$ in okoli $C$ nariši krožnico s polmerom $a$. Koliko presečišč ima z drugim krakom?",
      data: { given: data, find: ["\\text{število rešitev}"] },
      formula: ["\\alpha < 90^\\circ:\\ a < h \\to 0,\\ a = h \\to 1,\\ h < a < b \\to 2,\\ a \\ge b \\to 1", "\\alpha \\ge 90^\\circ:\\ a > b \\to 1,\\ a \\le b \\to 0"],
      solution: `Na krak kota $\\alpha$ nanesemo $AC = b = ${b}$, okoli $C$ narišemo krožnico s polmerom $a = ${a}$.\n${caseLine}\nŠtevilo rešitev: $${cnt}$.`,
    };
  }
  if (t === 1) {
    const b = r.int(5, 18);
    const v = r.int(0, 2);
    const h = b / 2;
    const lo = Math.floor(h) + 1;
    const hi = b - 1;
    const q = v === 0 ? "Za katero dolžino $a < b$ ima naloga natanko eno rešitev?" : v === 1 ? "Kolikšna je najmanjša cela dolžina $a$ (v cm), pri kateri ima naloga dve rešitvi?" : "Za koliko celih dolžin $a$ (v cm) ima naloga dve rešitvi?";
    const ans = v === 0 ? h : v === 1 ? lo : hi - lo + 1;
    const ms =
      v === 0
        ? [
            { value: b, why: "Pri $a = b$ je trikotnik enakokrak, a iščeš $a < b$: krožnica se mora kraka dotakniti." },
            { value: 2 * b, why: "Kateta nasproti kota $30^\\circ$ je polovica hipotenuze, ne dvakratnik." },
          ]
        : v === 1
          ? [
              { value: h, why: "Pri $a = \\frac{b}{2}$ se krožnica kraka le dotakne: rešitev je ena." },
              { value: Number.isInteger(h) ? NaN : Math.floor(h), why: "Pri $a < \\frac{b}{2}$ krožnica kraka ne doseže." },
              { value: b + 1, why: "Pri $a \\ge b$ je rešitev le ena." },
            ]
          : [
              { value: hi - lo + 2, why: "Pri $a = b$ je rešitev le ena: drugo presečišče je na podaljšku kraka." },
              { value: b - 1, why: "Pri $a \\le \\frac{b}{2}$ rešitev ni dve: krožnica kraka ne seka dvakrat." },
            ];
    return {
      text: `Načrtujemo trikotnik z $b = ${cm(b)}$, $\\alpha = 30^\\circ$ in stranico $a$ nasproti $\\alpha$. ${q}`,
      answer: num(ans, null, ms, v === 0 ? "cm" : null),
      hint: "Razdalja $C$ od drugega kraka kota $30^\\circ$ je polovica $b$ (polovica enakostraničnega trikotnika). Primerjaj $a$ s to razdaljo in z $b$.",
      data: { given: [`b = ${cm(b)}`, "\\alpha = 30^\\circ"], find: [v === 2 ? "\\text{število vrednosti } a" : "a"] },
      formula: ["h = \\frac{b}{2}", "h < a < b \\to 2 \\text{ rešitvi},\\ a = h \\to 1"],
      solution: `Razdalja $C$ od drugega kraka: $h = \\frac{b}{2} = ${tx(h)}$.\nEna rešitev pri $a = h$ (dotik), dve rešitvi pri $${tx(h)} < a < ${b}$.\n${v === 0 ? `$a = ${cm(h)}$` : v === 1 ? `Najmanjše celo število nad $${tx(h)}$: $a = ${lo}$` : `Cela števila od $${lo}$ do $${hi}$: $${ans}$`}`,
    };
  }
  // katera trojica podatkov da dve rešitvi
  const b = 2 * r.int(3, 9);
  const h = b / 2;
  const two = r.int(h + 1, b - 1);
  const one = h;
  const zero = r.int(1, h - 1);
  const big = r.int(b, b + 4);
  const opt = (a) => `$a = ${cm(a)}$`;
  return {
    text: `Načrtujemo trikotnik z $b = ${cm(b)}$ in $\\alpha = 30^\\circ$, stranica $a$ leži nasproti $\\alpha$. Pri kateri dolžini $a$ dobimo dva neskladna trikotnika?`,
    answer: pickAns(r, opt(two), [
      [opt(one), `$a = \\frac{b}{2}$: krožnica se kraka le dotakne, trikotnik je en sam (pravokoten).`],
      [opt(zero), `$a < \\frac{b}{2}$: krožnica okoli $C$ ne doseže drugega kraka, rešitve ni.`],
      [opt(big), "$a \\ge b$: drugo presečišče je točka $A$ ali leži na podaljšku kraka čez $A$, rešitev je ena sama."],
    ]),
    hint: "Razdalja $C$ od drugega kraka kota $30^\\circ$ je $\\frac{b}{2}$. Dve rešitvi sta, ko je $a$ med to razdaljo in $b$.",
    data: { given: [`b = ${cm(b)}`, "\\alpha = 30^\\circ"], find: ["a"] },
    formula: "\\frac{b}{2} < a < b \\to 2 \\text{ rešitvi}",
    solution: `$h = \\frac{b}{2} = ${h}$\nDve rešitvi pri $${h} < a < ${b}$.\nTo velja za $a = ${two}$.`,
  };
}

// ================= generatorji =================
const byLevel = (f1, f2, f3) => (level, r) => (level === 1 ? f1(r) : level === 2 ? f2(r) : f3(r));
const GENS = [
  { id: P + "enacbe-premice-in-kot-med-premicama", topics: [T("enacbe-premice-in-kot-med-premicama")], gen: byLevel(premicaL1, premicaL2, premicaL3) },
  { id: P + "togi-premiki", topics: [T("togi-premiki")], gen: byLevel(togiL1, togiL2, togiL3) },
  { id: P + "heronova-formula", topics: [T("heronova-formula-ter-polmera-ocrtanega-in-vcrtanega-kroga")], gen: byLevel(heronL1, heronL2, heronL3) },
  { id: P + "nacrtovalne-naloge", topics: [T("nacrtovalne-naloge")], gen: byLevel(nacrtL1, nacrtL2, nacrtL3) },
];

export const MATURA_MAT_SS1_GEO = wrapGens(GENS);
