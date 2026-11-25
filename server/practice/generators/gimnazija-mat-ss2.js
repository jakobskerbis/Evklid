// Gimnazija: drugi tip naloge za teme mat-ss2, ki so imele en sam generator (j, 2026-11-25).
// Obstoječi generatorji (dod-mat-ss12-*) računajo; tukaj so obratna vprašanja, uporaba v
// kontekstu, izbira pojma in večkoračne naloge. Merila: docs/kakovost.md §2. Vsi rezultati so
// izračunani v kodi iz istih (zaokroženih) števil, ki jih vidi dijak.
import { g, verbOf, NAMES } from "../rng.js";
import { roundHalfUp, gcd } from "../check.js";
import { tx } from "./mat.js";
import { num, frA, ft, sg, pickAns, wrapGens } from "./matura-util.js";

const T = (s) => `MAT-SS-2/${s}`;

// ---------- pomožne funkcije ----------
const L = (...xs) => xs.filter(Boolean).join("\n");
const M = (value, why) => ({ value, why });
const ap = (x, d) => (Math.abs(roundHalfUp(x, d) - x) < 1e-9 ? "=" : "\\approx");
// Zaokrožen vmesni rezultat brez končnih ničel.
const txr = (x, d) => tx(roundHalfUp(x, d));
// Negativno število v oklepaju.
const pt = (x) => (x < 0 ? `(${tx(x)})` : tx(x));
const rt = (n, x) => (n === 2 ? `\\sqrt{${x}}` : `\\sqrt[${n}]{${x}}`);
// Naključno neničelno celo število.
function nz(r, lo, hi) {
  for (;;) {
    const v = r.int(lo, hi);
    if (v !== 0) return v;
  }
}
// Polinom s koeficienti od najvišje potence: poly([1, -3, 2]) → "x^2 - 3x + 2".
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
// (x - a) za razcep; pri a = 0 samo x.
const fac = (a, v = "x") => (a === 0 ? v : `(${v} ${sg(-a)})`);
// Kompleksno število a + bi.
function zt(a, b) {
  const im = `${Math.abs(b) === 1 ? "" : tx(Math.abs(b))}i`;
  if (b === 0) return tx(a);
  if (a === 0) return `${b < 0 ? "-" : ""}${im}`;
  return `${tx(a)} ${b < 0 ? "-" : "+"} ${im}`;
}
// Logaritem z osnovo b (desetiški brez indeksa).
const LG = (b, arg) => (b === 10 ? `\\log ${arg}` : `\\log_{${b}} ${arg}`);
const lg = Math.log10;
const isPow = (N, b) => {
  let x = 1;
  while (x < N) x *= b;
  return x === N;
};
const ORD = { 3: "tretja", 4: "četrta", 5: "peta", 6: "šesta" };

// ================= n-ti koreni =================
const KORENI = {
  id: "gim-n-ti-koreni-dop",
  topics: [T("koreni")],
  gen(level, r) {
    if (level === 1) {
      const t = r.int(0, 4);
      if (t === 0) {
        const n = r.pick([3, 3, 4, 5]);
        const a = n === 3 ? r.int(2, 6) : n === 4 ? r.int(2, 4) : r.int(2, 3);
        const s = n % 2 && r.next() < 0.5 ? -1 : 1;
        const x = s * a;
        const N = x ** n;
        const E = rt(n, N);
        const ms = [];
        if (s < 0) ms.push(M(a, "Lih koren negativnega števila je negativen."));
        if (n === 4) ms.push(M(Math.sqrt(N), "To je kvadratni koren; četrti koren je število, katerega četrta potenca je radikand."));
        ms.push(M(N / n, "Korenjenje ni deljenje s korenskim eksponentom."));
        return {
          text: r.pick([`Izračunaj $${E}$.`, `Koliko je $${E}$?`]),
          answer: num(x, null, ms),
          hint: `Poišči število, katerega ${ORD[n]} potenca je $${N}$.`,
          data: { given: [`x = ${E}`], find: ["x"] },
          formula: n % 2 ? "\\sqrt[n]{a^n} = a \\ (n \\text{ lih})" : "x = \\sqrt[n]{N} \\iff x^n = N, \\ x \\ge 0",
          solution: L(`$${pt(x)}^{${n}} = ${N}$`, `$${E} = ${tx(x)}$`),
        };
      }
      if (t === 1) {
        const n = r.pick([3, 4]);
        let p;
        let q;
        do {
          p = r.int(1, 4);
          q = r.int(2, 5);
        } while (gcd(p, q) !== 1 || p === q);
        const s = n === 3 && r.next() < 0.4 ? -1 : 1;
        const A = p ** n;
        const B = q ** n;
        const E = rt(n, `${s < 0 ? "-" : ""}\\dfrac{${A}}{${B}}`);
        const ms = [M((s * p) / B, "Koreniti moraš tudi imenovalec."), M((s * A) / q, "Koreniti moraš tudi števec.")];
        if (n === 4) ms.push(M((p * p) / (q * q), "To je kvadratni koren; potrebuješ četrtega."));
        return {
          text: `Izračunaj $${E}$. Rezultat zapiši kot okrajšan ulomek.`,
          answer: frA(s * p, q, ms),
          hint: "Korenji posebej števec in posebej imenovalec.",
          data: { given: [`x = ${E}`], find: ["x"] },
          formula: "\\sqrt[n]{\\dfrac{a}{b}} = \\dfrac{\\sqrt[n]{a}}{\\sqrt[n]{b}}",
          solution: L(`$${rt(n, A)} = ${p}$, $${rt(n, B)} = ${q}$`, `$${E} = ${s < 0 ? "-" : ""}\\dfrac{${p}}{${q}}$`),
        };
      }
      if (t === 2 || t === 3) {
        const prod = t === 2;
        const [n, a, b] = prod
          ? r.pick([[3, 2, 4], [3, 3, 9], [3, 4, 16], [3, 2, 32], [3, 9, 24], [3, 4, 54], [3, 6, 36], [3, 12, 18], [3, 25, 5], [3, 3, 72], [3, 2, 108], [3, 50, 20], [3, 4, 250], [4, 2, 8], [4, 3, 27], [4, 8, 32], [4, 4, 64]])
          : r.pick([[3, 54, 2], [3, 250, 2], [3, 128, 2], [3, 24, 3], [3, 81, 3], [3, 192, 3], [3, 40, 5], [3, 135, 5], [3, 500, 4], [3, 32, 4], [4, 48, 3], [4, 243, 3], [4, 32, 2], [4, 162, 2]]);
        const R = prod ? a * b : a / b;
        const c = Math.round(R ** (1 / n));
        const E = prod ? `${rt(n, a)} \\cdot ${rt(n, b)}` : `\\dfrac{${rt(n, a)}}{${rt(n, b)}}`;
        return {
          text: r.pick([`Izračunaj $${E}$.`, `Koliko je $${E}$?`]),
          answer: num(c, null, prod ? [M(R, "Zmnožek pod korenom moraš še koreniti."), M(R ** (1 / (2 * n)), "Pri množenju korenov z enakim korenskim eksponentom se ta ne sešteva.")] : [M(R, "Količnik pod korenom moraš še koreniti.")]),
          hint: prod ? "Korena z enakim korenskim eksponentom združi pod en koren." : "Korena z enakim korenskim eksponentom deliš tako, da deliš radikanda.",
          data: { given: [`x = ${E}`], find: ["x"] },
          formula: prod ? "\\sqrt[n]{a} \\cdot \\sqrt[n]{b} = \\sqrt[n]{a \\cdot b}" : "\\dfrac{\\sqrt[n]{a}}{\\sqrt[n]{b}} = \\sqrt[n]{\\dfrac{a}{b}}",
          solution: L(`$${E} = ${rt(n, prod ? `${a} \\cdot ${b}` : `\\dfrac{${a}}{${b}}`)} = ${rt(n, R)}$`, `$${c}^{${n}} = ${R}$, zato je $${rt(n, R)} = ${c}$`),
        };
      }
      const n = r.pick([3, 4, 5, 6, 4]);
      const a = r.int(2, n >= 5 ? 4 : 9);
      const even = n % 2 === 0;
      const x = even ? a : -a;
      const E = rt(n, `(-${a})^{${n}}`);
      const P = (-a) ** n;
      return {
        text: r.pick([`Izračunaj $${E}$.`, `Koliko je $${E}$?`]),
        answer: num(x, null, even ? [M(-a, "Sodi koren je vedno nenegativen: za sod n velja ⁿ√(aⁿ) = |a|."), M(P, "Izračunal si potenco, korena pa ne.")] : [M(a, "Lih koren ohrani predznak: za lih n velja ⁿ√(aⁿ) = a."), M(P, "Izračunal si potenco, korena pa ne.")]),
        hint: `Je korenski eksponent $${n}$ sod ali lih? Od tega je odvisen predznak rezultata.`,
        data: { given: [`x = ${E}`], find: ["x"] },
        formula: "\\sqrt[n]{a^n} = |a| \\ (n \\text{ sod}), \\quad \\sqrt[n]{a^n} = a \\ (n \\text{ lih})",
        solution: L(`$(-${a})^{${n}} = ${P}$`, `$${rt(n, P)} = ${tx(x)}$, ker je $${pt(x)}^{${n}} = ${P}$${even ? " in sodi koren ni negativen" : ""}`),
      };
    }
    if (level === 2) {
      const t = r.int(0, 2);
      if (t === 0) {
        const n = r.pick([3, 3, 4]);
        const bs = n === 3 ? [2, 3, 4, 5, 6, 7, 9, 10] : [2, 3, 5, 6, 7];
        let a;
        let b;
        let N;
        do {
          a = r.int(2, n === 3 ? 5 : 3);
          b = r.pick(bs);
          N = a ** n * b;
        } while (N > 1000);
        const askA = r.next() < 0.6;
        const part = [2, 3].find((d) => d < a && a % d === 0);
        const ms = askA ? [M(a ** n, `Faktor $a^{${n}}$ moraš še koreniti.`), part ? M(part, "Razcep ni dokončan – izpostavi največji faktor, ki je popolna potenca.") : null] : [M(N / a, `Deli z $a^{${n}}$, ne z $a$.`), M(N / (a * a), n === 3 ? "Deli s kubom $a^3$, ne s kvadratom $a^2$." : "Deli z $a^4$, ne z $a^2$.")];
        const v = askA ? a : b;
        return {
          text: `Delno koreni $${rt(n, N)}$ in ga zapiši v obliki $a${rt(n, "b")}$, kjer je $b$ čim manjše naravno število. Koliko je $${askA ? "a" : "b"}$?`,
          answer: num(v, null, ms.filter(Boolean)),
          hint: `Poišči ${n === 3 ? "največji popolni kub" : "največjo četrto potenco naravnega števila"}, ki deli $${N}$.`,
          data: { given: [`${rt(n, N)} = a${rt(n, "b")}`], find: [askA ? "a" : "b"] },
          formula: "\\sqrt[n]{a^n b} = a\\sqrt[n]{b}",
          solution: L(`$${N} = ${a ** n} \\cdot ${b} = ${a}^{${n}} \\cdot ${b}$`, `$${rt(n, N)} = ${rt(n, a ** n)} \\cdot ${rt(n, b)} = ${a}${rt(n, b)}$`, `$${askA ? "a" : "b"} = ${v}$`),
        };
      }
      if (t === 1) {
        const what = r.pick(["Akvarij", "Rezervoar", "Zaboj", "Kontejner za vodo"]);
        const exact = r.next() < 0.45;
        const V = exact ? r.int(2, 9) ** 3 : r.pick([20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 150, 200, 250, 300, 400, 500, 600]);
        const ad = Math.cbrt(V);
        const a = ad * 10;
        return {
          text: `${what} ima obliko kocke s prostornino $${V}\\ \\mathrm{L}$. Koliko centimetrov meri njegov rob? Zaokroži na eno decimalko.`,
          answer: num(a, 1, [M(ad, "Rob si izračunal v dm; pretvori ga še v cm."), M(Math.cbrt(V * 100), "Preveri pretvorbo: 1 L = 1 dm³ = 1000 cm³."), M(Math.sqrt(V) * 10, "Prostornina kocke je a³, zato potrebuješ tretji koren, ne kvadratnega.")], "cm"),
          hint: "Litre pretvori v kubične decimetre, nato izračunaj tretji koren.",
          data: { given: [`V = ${V}\\ \\mathrm{L}`], find: ["a"] },
          formula: ["V = a^3", "a = \\sqrt[3]{V}", "1\\ \\mathrm{L} = 1\\ \\mathrm{dm^3}"],
          solution: L(`$V = ${V}\\ \\mathrm{L} = ${V}\\ \\mathrm{dm^3}$`, `$a = \\sqrt[3]{${V}}\\ \\mathrm{dm} ${ap(ad, 4)} ${txr(ad, 4)}\\ \\mathrm{dm}$`, `$a ${ap(a, 1)} ${tx(a, 1)}\\ \\mathrm{cm}$`),
        };
      }
      const [a, b] = r.pick([[3, 2], [5, 3], [10, 5], [11, 5], [8, 4], [12, 6], [20, 8], [9, 4], [6, 3], [27, 9], [7, 3], [4, 2], [14, 6], [5, 2]]);
      const A = a * a;
      const B = b ** 3;
      const rel = A > B ? ">" : A < B ? "<" : "=";
      const o = (s) => `\\sqrt[3]{${a}} ${s} \\sqrt{${b}}`;
      const naive = "Večji radikand ne pomeni večjega korena, kadar sta korenska eksponenta različna.";
      const pow6 = `Primerjaj šesti potenci obeh števil: $${a}^2$ in $${b}^3$.`;
      const wrongs = ["<", ">", "="].filter((s) => s !== rel).map((s) => [o(s), s === "=" ? "Števili sta enaki le, če sta enaki njuni šesti potenci." : s === ">" && a > b ? naive : pow6]);
      return {
        text: `Primerjaj števili $\\sqrt[3]{${a}}$ in $\\sqrt{${b}}$. Katera trditev drži?`,
        answer: pickAns(r, o(rel), wrongs),
        options_tex: true,
        hint: "Obe števili potenciraj na najmanjši skupni večkratnik korenskih eksponentov.",
        data: { given: [`x = \\sqrt[3]{${a}}`, `y = \\sqrt{${b}}`], find: ["\\text{večje število}"] },
        formula: "\\left(\\sqrt[3]{a}\\right)^6 = a^2, \\quad \\left(\\sqrt{b}\\right)^6 = b^3",
        solution: L(`$\\left(\\sqrt[3]{${a}}\\right)^6 = ${a}^2 = ${A}$`, `$\\left(\\sqrt{${b}}\\right)^6 = ${b}^3 = ${B}$`, `$${A} ${rel} ${B}$, zato je $${o(rel)}$`),
      };
    }
    const t = r.int(0, 3);
    if (t === 0) {
      const b = r.pick([2, 3, 5, 6, 7]);
      const sq = r.next() < 0.5;
      let k;
      do k = r.int(2, 15);
      while (k === b);
      const den = sq ? rt(3, b * b) : rt(3, b);
      const mul = sq ? rt(3, b) : rt(3, b * b);
      const D = `\\dfrac{${k}}{${den}}`;
      return {
        text: `Racionaliziraj imenovalec ulomka $${D}$ in rezultat zapiši v obliki $m${mul}$. Koliko je $m$? (Ulomek okrajšaj.)`,
        answer: frA(k, b, [M(k, `Po razširitvi je v imenovalcu $\\sqrt[3]{${b ** 3}} = ${b}$ – z njim moraš še deliti.`), M(k / (b * b), `Imenovalec po razširitvi je $\\sqrt[3]{${b ** 3}} = ${b}$, ne $${b * b}$.`)]),
        hint: `Ulomek razširi tako, da bo pod korenom v imenovalcu popolni kub.`,
        data: { given: [`x = ${D}`], find: ["m"] },
        formula: "\\sqrt[3]{b} \\cdot \\sqrt[3]{b^2} = \\sqrt[3]{b^3} = b",
        solution: L(`$${D} = \\dfrac{${k} \\cdot ${mul}}{${den} \\cdot ${mul}}$`, `$${D} = \\dfrac{${k}${mul}}{\\sqrt[3]{${b ** 3}}} = \\dfrac{${k}${mul}}{${b}}$`, `$m = ${ft(k, b)}$`),
      };
    }
    if (t === 1) {
      const C = r.pick([
        { s: (n, a, b) => `Občina je imela pred $${n}$ leti $${a}$ prebivalcev, zdaj jih ima $${b}$. Kolikšna je bila povprečna letna rast števila prebivalcev v odstotkih?`, per: "leto", g0: () => r.int(20, 90) * 100, rnd: 1, u: "" },
        { s: (n, a, b) => `Stanovanje je pred $${n}$ leti stalo $${a}\\ \\text{€}$, zdaj stane $${b}\\ \\text{€}$. Kolikšna je bila povprečna letna rast cene v odstotkih?`, per: "leto", g0: () => r.int(80, 250) * 1000, rnd: 100, u: "\\ \\text{€}" },
        { s: (n, a, b) => `Aplikacija je imela pred $${n}$ meseci $${a}$ uporabnikov, zdaj jih ima $${b}$. Kolikšna je bila povprečna mesečna rast števila uporabnikov v odstotkih?`, per: "mesec", g0: () => r.int(10, 60) * 1000, rnd: 1, u: "" },
        { s: (n, a, b) => `Letni prihodek podjetja je bil pred $${n}$ leti $${a}\\ \\text{€}$, letos je $${b}\\ \\text{€}$. Kolikšna je bila povprečna letna rast prihodka v odstotkih?`, per: "leto", g0: () => r.int(20, 95) * 10000, rnd: 1000, u: "\\ \\text{€}" },
      ]);
      const p = r.pick([2, 3, 4, 5, 6, 8, 10, 12]);
      const n = r.int(3, 6);
      const G0 = C.g0();
      const G = Math.round((G0 * (1 + p / 100) ** n) / C.rnd) * C.rnd;
      const k = G / G0;
      const q = k ** (1 / n);
      const pr = (q - 1) * 100;
      return {
        text: `${C.s(n, G0, G)} Zaokroži na eno decimalko.`,
        answer: num(pr, 1, [M(((k - 1) * 100) / n, "Rast je obrestna (vsakič od nove vrednosti), zato skupne spremembe ne smeš le razdeliti na enake dele."), M((k - 1) * 100, "To je skupna sprememba v celem obdobju."), M((Math.sqrt(k) - 1) * 100, "Potrebuješ n-ti koren, ne kvadratnega.")], "%"),
        hint: `Če se vrednost vsak ${C.per} pomnoži z istim faktorjem $q$, je končna vrednost $G_0 \\cdot q^n$.`,
        data: { given: [`G_0 = ${G0}${C.u}`, `G = ${G}${C.u}`, `n = ${n}`], find: ["p"] },
        formula: ["G = G_0 \\cdot q^n", "q = \\sqrt[n]{\\dfrac{G}{G_0}}", "p = (q - 1) \\cdot 100\\ \\%"],
        solution: L(`$\\dfrac{G}{G_0} = \\dfrac{${G}}{${G0}} ${ap(k, 5)} ${txr(k, 5)}$`, `$q = \\sqrt[${n}]{${txr(k, 5)}} ${ap(q, 5)} ${txr(q, 5)}$`, `$p = (q - 1) \\cdot 100\\ \\% ${ap(pr, 1)} ${tx(pr, 1)}\\ \\%$`),
      };
    }
    if (t === 2) {
      const k = r.pick([2, 3, 4, 5, 6, 8, 10, 27, 64]);
      const nm = r.pick(NAMES);
      const fwd = r.next() < 0.55;
      const ck = Math.cbrt(k);
      if (fwd) {
        const r0 = r.pick([0.5, 0.8, 1, 1.2, 1.5, 2, 2.5, 3]);
        const R = r0 * ck;
        return {
          text: `${nm} ${g(nm, "je zgnetel", "je zgnetla")} $${k}$ ${verbOf(k, "enako kroglico", "enaki kroglici", "enake kroglice", "enakih kroglic")} plastelina s polmerom $${tx(r0)}\\ \\mathrm{cm}$ v eno veliko kroglo. Kolikšen je polmer velike krogle? Zaokroži na dve decimalki.`,
          answer: num(R, 2, [M(r0 * k, "Polmer ne narašča sorazmerno s številom kroglic – s številom kroglic narašča prostornina."), M(r0 * Math.sqrt(k), "Prostornina je sorazmerna s kubom polmera, zato potrebuješ tretji koren.")], "cm"),
          hint: "Prostornina velike krogle je vsota prostornin vseh kroglic.",
          data: { given: [`k = ${k}`, `r = ${tx(r0)}\\ \\mathrm{cm}`], find: ["R"] },
          formula: ["V = \\dfrac{4}{3}\\pi r^3", "R^3 = k \\cdot r^3"],
          solution: L(`$\\dfrac{4}{3}\\pi R^3 = ${k} \\cdot \\dfrac{4}{3}\\pi r^3 \\Rightarrow R^3 = ${k} \\cdot ${tx(r0)}^3 = ${txr(k * r0 ** 3, 4)}$`, `$R = \\sqrt[3]{${txr(k * r0 ** 3, 4)}}\\ \\mathrm{cm} ${ap(R, 2)} ${tx(R, 2)}\\ \\mathrm{cm}$`),
        };
      }
      const R = r.pick([2, 3, 4, 5, 6, 8, 10]);
      const r0 = R / ck;
      return {
        text: `Kovinsko kroglo s polmerom $${R}\\ \\mathrm{cm}$ pretalijo in iz kovine ulijejo $${k}$ ${verbOf(k, "enako manjšo kroglico", "enaki manjši kroglici", "enake manjše kroglice", "enakih manjših kroglic")}. Kolikšen je polmer ene kroglice? Zaokroži na dve decimalki.`,
        answer: num(r0, 2, [M(R / k, "Polmer se ne zmanjša sorazmerno s številom kroglic – razdeli se prostornina."), M(R / Math.sqrt(k), "Prostornina je sorazmerna s kubom polmera, zato potrebuješ tretji koren.")], "cm"),
        hint: "Prostornina velike krogle se razdeli na vse kroglice.",
        data: { given: [`R = ${R}\\ \\mathrm{cm}`, `k = ${k}`], find: ["r"] },
        formula: ["V = \\dfrac{4}{3}\\pi r^3", "R^3 = k \\cdot r^3"],
        solution: L(`$${k} \\cdot \\dfrac{4}{3}\\pi r^3 = \\dfrac{4}{3}\\pi R^3 \\Rightarrow r^3 = \\dfrac{${R}^3}{${k}} = ${txr(R ** 3 / k, 4)}$`, `$r = \\sqrt[3]{${txr(R ** 3 / k, 4)}}\\ \\mathrm{cm} ${ap(r0, 2)} ${tx(r0, 2)}\\ \\mathrm{cm}$`),
      };
    }
    const n = r.pick([3, 3, 5]);
    const s = n === 3 ? r.pick([-4, -3, -2, 2, 3, 4]) : r.pick([-2, 2]);
    const a = r.int(2, n === 3 ? 5 : 3);
    const u = nz(r, -3, 3);
    const c = nz(r, -30, 30);
    const d = a * s ** n + c;
    const R = (d - c) / a;
    const E = `${a}${fac(u)}^{${n}} ${sg(c)} = ${d}`;
    const rn = (x) => Math.sign(x) * Math.abs(x) ** (1 / n);
    return {
      text: `Reši enačbo $${E}$ v množici realnih števil.`,
      answer: num(u + s, null, [M(u - s, "Pazi na predznak: lih koren negativnega števila je negativen, korena pozitivnega pa ne smeš obrniti."), M(s, `To je vrednost izraza $x ${sg(-u)}$; določi še $x$.`),M(u + rn((d + c) / a), "Pri prenosu člena na drugo stran mu spremeni predznak.")]),
      hint: `Najprej osami potenco $${fac(u)}^{${n}}$, nato koreni.`,
      data: { given: [E], find: ["x"] },
      formula: "y^n = c \\Rightarrow y = \\sqrt[n]{c} \\ (n \\text{ lih})",
      solution: L(`$${a}${fac(u)}^{${n}} = ${d - c}$`, `$${fac(u)}^{${n}} = ${R}$`, `$x ${sg(-u)} = ${rt(n, R)} = ${s}$`, `$x = ${u + s}$`),
    };
  },
};

// ================= kompleksna števila =================
const Q = (x, y) => (x > 0 ? (y > 0 ? 1 : 4) : y > 0 ? 2 : 3);
const KOMPLEKSNA = {
  id: "gim-kompleksna-dop",
  topics: [T("kompleksna-stevila")],
  gen(level, r) {
    if (level === 1) {
      const t = r.int(0, 2);
      if (t === 0) {
        const a = nz(r, -5, 5);
        const b = nz(r, -5, 5);
        const kind = r.int(0, 3);
        const K = [
          { W: "\\bar{z}", w: [a, -b], f: "\\overline{a + bi} = a - bi", err: [[a, b, "Pozabil si konjugirati: $\\bar{z}$ ima nasproten imaginarni del."], [-a, -b, "Konjugiranje spremeni predznak le imaginarnemu delu, ne obema."], [-a, b, "Konjugiranje spremeni predznak imaginarnemu, ne realnemu delu."]] },
          { W: "-z", w: [-a, -b], f: "-(a + bi) = -a - bi", err: [[a, b, "Število $-z$ ima nasproten predznak obeh delov."], [a, -b, "To je konjugirano število; $-z$ spremeni predznak obema deloma."], [-a, b, "Predznak moraš spremeniti tudi imaginarnemu delu."]] },
          { W: "iz", w: [-b, a], f: "i(a + bi) = -b + ai", err: [[b, a, "$i \\cdot bi = bi^2 = -b$, zato ima realni del nasprotni predznak."], [b, -a, "Množenje z $i$ zasuka točko za $90^\\circ$ v pozitivni smeri (nasproti urinemu kazalcu)."], [-b, -a, "Imaginarni del števila $iz$ je $a$, saj je $i \\cdot a = ai$."]] },
          { W: "-\\bar{z}", w: [-a, b], f: "-\\overline{a + bi} = -a + bi", err: [[a, b, "Število $-\\bar{z} = -a + bi$ ima nasproten realni del."], [a, -b, "To je $\\bar{z}$; spremeniti moraš še predznak celotnemu številu."], [-a, -b, "To je $-z$; pri $-\\bar{z}$ ostane imaginarni del enak."]] },
        ][kind];
        const [wx, wy] = K.w;
        const lab = (x, y) => `${Q(x, y)}. kvadrant`;
        return {
          text: `Dano je število $z = ${zt(a, b)}$. V katerem kvadrantu kompleksne ravnine leži število $w = ${K.W}$?`,
          answer: pickAns(r, lab(wx, wy), K.err.map(([x, y, why]) => [lab(x, y), why])),
          hint: "Najprej izračunaj $w$, nato poglej predznaka njegovega realnega in imaginarnega dela.",
          data: { given: [`z = ${zt(a, b)}`], find: ["\\text{kvadrant števila } w"] },
          formula: K.f,
          solution: L(`$w = ${K.W} = ${zt(wx, wy)}$`, `Realni del je ${wx > 0 ? "pozitiven" : "negativen"}, imaginarni ${wy > 0 ? "pozitiven" : "negativen"}: $w$ leži v ${Q(wx, wy)}. kvadrantu.`),
        };
      }
      if (t === 1) {
        const [dx, dy] = r.pick([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]]);
        let a;
        let b;
        let c;
        let d;
        do {
          a = r.int(-5, 5);
          b = r.int(-5, 5);
          c = a - r.pick([1, -1]) * dx;
          d = b - r.pick([1, -1]) * dy;
        } while ((a === 0 && b === 0) || (c === 0 && d === 0) || Math.abs(c) > 9 || Math.abs(d) > 9);
        const D = Math.hypot(dx, dy);
        const z1 = zt(a, b);
        const z2 = zt(c, d);
        return {
          text: r.pick([`Kolikšna je razdalja med točkama, ki v kompleksni ravnini ponazarjata števili $z_1 = ${z1}$ in $z_2 = ${z2}$?`, `Izračunaj $|z_1 - z_2|$ za $z_1 = ${z1}$ in $z_2 = ${z2}$.`]),
          answer: num(D, null, [M(dx + dy, "Razdalja ni vsota razlik koordinat – uporabi Pitagorov izrek."), M(Math.hypot(a + c, b + d), "Razdalja je $|z_1 - z_2|$, ne $|z_1 + z_2|$."), M(dx * dx + dy * dy, "Pozabil si koreniti.")]),
          hint: "Razdalja med točkama je absolutna vrednost razlike števil.",
          data: { given: [`z_1 = ${z1}`, `z_2 = ${z2}`], find: ["|z_1 - z_2|"] },
          formula: ["|a + bi| = \\sqrt{a^2 + b^2}", "d = |z_1 - z_2|"],
          solution: L(`$z_1 - z_2 = ${zt(a - c, b - d)}$`, `$|z_1 - z_2| = \\sqrt{${pt(a - c)}^2 + ${pt(b - d)}^2} = \\sqrt{${D * D}}$`, `$|z_1 - z_2| = ${D}$`),
        };
      }
      const a = nz(r, -5, 5);
      const b = nz(r, -5, 5);
      const askRe = r.next() < 0.5;
      const re = a * a - b * b;
      const im = 2 * a * b;
      return {
        text: `Izračunaj ${askRe ? "realni" : "imaginarni"} del števila $z^2$ za $z = ${zt(a, b)}$.`,
        answer: num(askRe ? re : im, null, askRe ? [M(a * a + b * b, "$(bi)^2 = b^2 i^2 = -b^2$."), M(a * a, "Kvadrat dvočlenika ima tri člene: $(a + bi)^2 = a^2 + 2abi + (bi)^2$.")] : [M(a * b, "Srednji člen kvadrata dvočlenika je $2ab$."), M(-im, "Pazi na predznak srednjega člena.")]),
        hint: "Kvadriraj kot dvočlenik in upoštevaj $i^2 = -1$.",
        data: { given: [`z = ${zt(a, b)}`], find: [askRe ? "\\mathrm{Re}(z^2)" : "\\mathrm{Im}(z^2)"] },
        formula: ["(a + bi)^2 = a^2 + 2abi + b^2 i^2", "i^2 = -1"],
        solution: L(`$z^2 = ${pt(a)}^2 + 2 \\cdot ${pt(a)} \\cdot ${pt(b)} \\cdot i + ${pt(b)}^2 \\cdot i^2$`, `$z^2 = ${a * a} ${sg(im)}i - ${b * b} = ${zt(re, im)}$`, `$\\mathrm{${askRe ? "Re" : "Im"}}(z^2) = ${askRe ? re : im}$`),
      };
    }
    if (level === 2) {
      const t = r.int(0, 2);
      if (t === 0) {
        const m = r.int(-4, 4);
        const n = r.int(1, 5);
        const p = -2 * m;
        const q = m * m + n * n;
        const E = `${poly([1, p, q])} = 0`;
        const askIm = m === 0 || r.next() < 0.5;
        const D = p * p - 4 * q;
        return {
          text: `Reši enačbo $${E}$ v množici kompleksnih števil. Koliko je ${askIm ? "imaginarni del tiste rešitve, ki ima pozitiven imaginarni del" : "realni del rešitev"}?`,
          answer: num(askIm ? n : m, null, askIm ? [M(n * n, "Iz diskriminante moraš koreniti."), M(2 * n, "Tudi $\\sqrt{D}$ deli z $2a$.")] : [M(-m, "Realni del je $-\\dfrac{b}{2a}$: pazi na predznak."), M(2 * m, "Deliti moraš z $2a$.")]),
          hint: "Izračunaj diskriminanto; koren negativnega števila zapiši z $i$.",
          data: { given: [E], find: [askIm ? "\\mathrm{Im}(x_1)" : "\\mathrm{Re}(x_1)"] },
          formula: ["D = b^2 - 4ac", "x_{1,2} = \\dfrac{-b \\pm \\sqrt{D}}{2a}", "\\sqrt{-k} = i\\sqrt{k}"],
          solution: L(`$D = ${p ? `${pt(p)}^2 - ` : "-"}4 \\cdot ${q} = ${D}$`, `$\\sqrt{D} = \\sqrt{${D}} = ${2 * n}i$`, `$x_{1,2} = \\dfrac{${p ? `${-p} ` : ""}\\pm ${2 * n}i}{2} = ${m === 0 ? "" : `${m} `}\\pm ${n === 1 ? "" : n}i$`, `$${askIm ? "\\mathrm{Im}" : "\\mathrm{Re}"}(x_1) = ${askIm ? n : m}$`),
        };
      }
      if (t === 1) {
        const p = nz(r, -5, 5);
        const c = nz(r, -5, 5);
        const d = nz(r, -5, 5);
        const real = r.next() < 0.5;
        const pz = `${p < 0 ? "-" : "+"} ${Math.abs(p) === 1 ? "" : Math.abs(p)}i`;
        const W = `(t ${pz})(${zt(c, d)})`;
        const reL = poly([c, -p * d], "t");
        const imL = poly([d, p * c], "t");
        return {
          text: `Za katero realno število $t$ je število $w = ${W}$ ${real ? "realno" : "čisto imaginarno"}? Rezultat zapiši kot okrajšan ulomek ali celo število.`,
          answer: real ? frA(-p * c, d, [M((p * d) / c, "Realno število ima imaginarni del enak 0 (ne realnega)."), M((p * c) / d, "Pazi na predznak pri reševanju linearne enačbe.")]) : frA(p * d, c, [M((-p * c) / d, "Čisto imaginarno število ima realni del enak 0 (ne imaginarnega)."), M((-p * d) / c, "Pazi na predznak pri reševanju linearne enačbe.")]),
          hint: `Zmnoži oklepaja in zapiši $w$ v obliki $a + bi$. Nato izenači ${real ? "imaginarni" : "realni"} del z 0.`,
          data: { given: [`w = ${W}`], find: ["t"] },
          formula: ["(a + bi)(c + di) = (ac - bd) + (ad + bc)i", real ? "w \\in \\mathbb{R} \\iff \\mathrm{Im}(w) = 0" : "w \\text{ je čisto imaginarno} \\iff \\mathrm{Re}(w) = 0"],
          solution: L(`$w = (${reL}) + (${imL})i$`, `$${real ? imL : reL} = 0$`, `$t = ${real ? ft(-p * c, d) : ft(p * d, c)}$`),
        };
      }
      const TR = [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]];
      const pk = () => {
        const [x, y] = r.pick(TR);
        return [x * r.pick([1, -1]), y * r.pick([1, -1])];
      };
      const [a, b] = pk();
      const [c, d] = pk();
      const m1 = Math.hypot(a, b);
      const m2 = Math.hypot(c, d);
      const mul = r.next() < 0.55;
      const z1 = zt(a, b);
      const z2 = zt(c, d);
      return {
        text: mul ? `Izračunaj $|z_1 \\cdot z_2|$ za $z_1 = ${z1}$ in $z_2 = ${z2}$.` : `Izračunaj $\\left|\\dfrac{z_1}{z_2}\\right|$ za $z_1 = ${z1}$ in $z_2 = ${z2}$. Rezultat zapiši kot okrajšan ulomek ali celo število.`,
        answer: mul ? num(m1 * m2, null, [M(m1 + m2, "Absolutna vrednost zmnožka je zmnožek absolutnih vrednosti, ne vsota."), M(m1 * m1 * m2 * m2, "Pozabil si koreniti: $|z| = \\sqrt{a^2 + b^2}$.")]) : frA(m1, m2, [M((m1 * m1) / (m2 * m2), "Pozabil si koreniti: $|z| = \\sqrt{a^2 + b^2}$."), M(m1 - m2, "Absolutna vrednost količnika je količnik absolutnih vrednosti.")]),
        hint: "Števil ni treba množiti ali deliti: najprej izračunaj absolutni vrednosti obeh.",
        data: { given: [`z_1 = ${z1}`, `z_2 = ${z2}`], find: [mul ? "|z_1 z_2|" : "\\left|\\dfrac{z_1}{z_2}\\right|"] },
        formula: ["|a + bi| = \\sqrt{a^2 + b^2}", mul ? "|z_1 z_2| = |z_1| \\cdot |z_2|" : "\\left|\\dfrac{z_1}{z_2}\\right| = \\dfrac{|z_1|}{|z_2|}"],
        solution: L(`$|z_1| = \\sqrt{${pt(a)}^2 + ${pt(b)}^2} = ${m1}$`, `$|z_2| = \\sqrt{${pt(c)}^2 + ${pt(d)}^2} = ${m2}$`, mul ? `$|z_1 z_2| = ${m1} \\cdot ${m2} = ${m1 * m2}$` : `$\\left|\\dfrac{z_1}{z_2}\\right| = \\dfrac{${m1}}{${m2}} = ${ft(m1, m2)}$`),
      };
    }
    const t = r.int(0, 2);
    if (t === 0) {
      const m = nz(r, -4, 4);
      const n = r.int(1, 5) * r.pick([1, -1]);
      const askQ = r.next() < 0.5;
      const an = Math.abs(n);
      const x1 = zt(m, n);
      return {
        text: `Kvadratna enačba $x^2 + px + q = 0$ z realnima koeficientoma $p$ in $q$ ima rešitev $x_1 = ${x1}$. Koliko je $${askQ ? "q" : "p"}$?`,
        answer: num(askQ ? m * m + an * an : -2 * m, null, askQ ? [M(m * m - an * an, "$(m + ni)(m - ni) = m^2 - n^2i^2 = m^2 + n^2$."), M(m * m + an, "Kvadrirati moraš tudi imaginarni del.")] : [M(2 * m, "Po Vietu je $x_1 + x_2 = -p$: pazi na predznak."), M(-m, "Vsota obeh rešitev je $2m$, ne $m$.")]),
        hint: "Enačba z realnimi koeficienti ima za drugo rešitev konjugirano število prve. Uporabi Vietovi pravili.",
        data: { given: [`x_1 = ${x1}`], find: [askQ ? "q" : "p"] },
        formula: ["x_2 = \\bar{x}_1", "x_1 + x_2 = -p", "x_1 \\cdot x_2 = q"],
        solution: askQ ? L(`$x_2 = \\bar{x}_1 = ${zt(m, -n)}$`, `$q = x_1 x_2 = ${pt(m)}^2 + ${an}^2$`, `$q = ${m * m + an * an}$`) : L(`$x_2 = \\bar{x}_1 = ${zt(m, -n)}$`, `$x_1 + x_2 = ${2 * m}$`, `$p = -(x_1 + x_2) = ${-2 * m}$`),
      };
    }
    if (t === 1) {
      const x = r.int(1, 5);
      const y = nz(r, -5, 5);
      const u = x * x - y * y;
      const v = 2 * x * y;
      const askX = r.next() < 0.5;
      const w = zt(u, v);
      const S = x * x + y * y;
      return {
        text: `Poišči kompleksno število $z = x + yi$ z realnim delom $x > 0$, za katero velja $z^2 = ${w}$. Koliko je $${askX ? "x" : "y"}$?`,
        answer: num(askX ? x : y, null, askX ? [M(x * x, "To je $x^2$; določi še $x$."), M(Math.abs(y), "Zamenjal si realni in imaginarni del."), M(Math.sqrt(S), "To je $|z|$, ne njegov realni del.")] : [M(-y, `Iz $2xy = ${v}$ in $x > 0$ sledi predznak $y$.`), M(y * y, "To je $y^2$; določi še $y$.")]),
        hint: "Kvadriraj $x + yi$ in izenači realna ter imaginarna dela. Pomagaš si lahko z $|z|^2 = |z^2|$.",
        data: { given: [`z^2 = ${w}`], find: [askX ? "x" : "y"] },
        formula: ["(x + yi)^2 = x^2 - y^2 + 2xyi", "|z|^2 = |z^2|"],
        solution: L(`$x^2 - y^2 = ${u}$ in $2xy = ${v}$`, `$x^2 + y^2 = |z^2| = \\sqrt{${pt(u)}^2 + ${pt(v)}^2} = ${S}$`, `$2x^2 = ${u + S}$, $x^2 = ${x * x}$, $x = ${x}$`, `$y = \\dfrac{${v}}{2 \\cdot ${x}} = ${y}$`),
      };
    }
    const a = nz(r, -5, 5);
    const b = nz(r, -5, 5);
    const kind = r.int(0, 2);
    const ab = Math.abs(a * b);
    const z2 = a * a + b * b;
    const K = [
      { pts: "$0$, $z$ in $iz$", S: z2 / 2, ms: [M(z2, "Ploščina pravokotnega trikotnika je polovica zmnožka katet."), M(Math.sqrt(z2) / 2, "Obe kateti merita $|z|$, zato je ploščina $|z|^2/2$.")], hint: "Množenje z $i$ zasuka točko okoli izhodišča za $90^\\circ$.", f: ["|iz| = |z|", "S = \\dfrac{k_1 \\cdot k_2}{2}"], sol: [`$|z| = \\sqrt{${pt(a)}^2 + ${pt(b)}^2} = \\sqrt{${z2}}$; $iz$ je $z$, zasukan za $90^\\circ$, in $|iz| = |z|$.`, `Trikotnik je pravokoten s katetama $|z|$ in $|iz|$.`, `$S = \\dfrac{|z|^2}{2} = \\dfrac{${z2}}{2} = ${tx(z2 / 2)}$`] },
      { pts: "$0$, $z$ in $\\bar{z}$", S: ab, ms: [M(2 * ab, "Pozabil si deliti z 2."), M(ab / 2, `Osnovnica od $z$ do $\\bar{z}$ meri $2|b|$, ne $|b|$.`)], hint: "Točki $z$ in $\\bar{z}$ ležita simetrično glede na realno os.", f: ["S = \\dfrac{c \\cdot v_c}{2}"], sol: [`$\\bar{z} = ${zt(a, -b)}$; osnovnica od $z$ do $\\bar{z}$ je navpična in meri $2 \\cdot ${Math.abs(b)} = ${2 * Math.abs(b)}$.`, `Višina je razdalja izhodišča do te osnovnice: $${Math.abs(a)}$.`, `$S = \\dfrac{${2 * Math.abs(b)} \\cdot ${Math.abs(a)}}{2} = ${ab}$`] },
      { pts: "$z$, $\\bar{z}$ in $-z$", S: 2 * ab, ms: [M(4 * ab, "Pozabil si deliti z 2."), M(ab, `Stranici, vzporedni osema, merita $2|a|$ in $2|b|$.`)], hint: "Nariši vse tri točke: trikotnik je pravokoten, kateti sta vzporedni koordinatnima osema.", f: ["S = \\dfrac{k_1 \\cdot k_2}{2}"], sol: [`$\\bar{z} = ${zt(a, -b)}$, $-z = ${zt(-a, -b)}$`, `Kateti: od $z$ do $\\bar{z}$ meri $${2 * Math.abs(b)}$, od $\\bar{z}$ do $-z$ meri $${2 * Math.abs(a)}$.`, `$S = \\dfrac{${2 * Math.abs(b)} \\cdot ${2 * Math.abs(a)}}{2} = ${2 * ab}$`] },
    ][kind];
    return {
      text: `Točke, ki v kompleksni ravnini ponazarjajo števila ${K.pts}, so oglišča trikotnika. Kolikšna je njegova ploščina, če je $z = ${zt(a, b)}$?`,
      answer: num(K.S, null, K.ms),
      hint: K.hint,
      data: { given: [`z = ${zt(a, b)}`], find: ["S"] },
      formula: K.f,
      solution: L(...K.sol),
    };
  },
};

// ================= kvadratna funkcija =================
const vf = (a, p, q) => `f(x) = ${a === 1 ? "" : a === -1 ? "-" : a}${fac(p)}^2${q ? ` ${sg(q)}` : ""}`;
const KVFUN = {
  id: "gim-kvadratna-funkcija-dop",
  topics: [T("kvadratna-funkcija")],
  gen(level, r) {
    if (level === 1) {
      const t = r.int(0, 3);
      if (t === 0) {
        const a = nz(r, -3, 3);
        const p = nz(r, -5, 5);
        let q;
        do q = nz(r, -6, 6);
        while (q === p);
        const f = vf(a, p, q);
        const up = (v) => `Z_f = [${v}, \\infty)`;
        const dn = (v) => `Z_f = (-\\infty, ${v}]`;
        const ok = a > 0 ? up(q) : dn(q);
        const dir = a > 0 ? "Pri $a > 0$ je parabola odprta navzgor, zato je $q$ najmanjša vrednost." : "Pri $a < 0$ je parabola odprta navzdol, zato je $q$ največja vrednost.";
        const pw = "$p$ je abscisa temena; zaloga vrednosti je odvisna od ordinate $q$.";
        return {
          text: `Kakšna je zaloga vrednosti funkcije $${f}$?`,
          answer: pickAns(r, ok, [[a > 0 ? dn(q) : up(q), dir], [a > 0 ? up(p) : dn(p), pw], [a > 0 ? dn(p) : up(p), `${pw} ${dir}`]]),
          options_tex: true,
          hint: "Poglej predznak vodilnega koeficienta in ordinato temena.",
          data: { given: [f], find: ["Z_f"] },
          formula: "f(x) = a(x - p)^2 + q, \\ T(p, q)",
          solution: L(`Teme je $T(${p}, ${q})$, $a = ${a} ${a > 0 ? ">" : "<"} 0$: parabola je odprta ${a > 0 ? "navzgor" : "navzdol"}.`, `$${ok}$`),
        };
      }
      if (t === 1) {
        let x1;
        let x2;
        do {
          x1 = r.int(-6, 8);
          x2 = r.int(-6, 8);
        } while (x1 >= x2 || x1 + x2 === 0);
        const y0 = r.int(-9, 9);
        const p = (x1 + x2) / 2;
        return {
          text: `Za kvadratno funkcijo $f$ velja $f(${x1}) = f(${x2}) = ${y0}$. Kolikšna je abscisa temena njenega grafa?`,
          answer: num(p, null, [M(x1 + x2, "Abscisa temena leži na sredini med danima abscisama – vsoto deli z 2."), M((x2 - x1) / 2, "Sredino intervala dobiš iz vsote krajišč, ne iz razlike."), M(y0, "Iščeš absciso temena, ne ordinate.")]),
          hint: "Graf kvadratne funkcije je simetričen glede na navpično premico skozi teme.",
          data: { given: [`f(${x1}) = ${y0}`, `f(${x2}) = ${y0}`], find: ["p"] },
          formula: "p = \\dfrac{x_1 + x_2}{2}",
          solution: L(`Točki z enakima ordinatama ležita simetrično glede na os $x = p$.`, `$p = \\dfrac{${x1} + ${pt(x2)}}{2} = ${tx(p)}$`),
        };
      }
      if (t === 2) {
        const a = nz(r, -3, 3);
        const p = nz(r, -5, 5);
        const q = r.int(-6, 6);
        const f = vf(a, p, q);
        const cnt = q === 0 ? 1 : a * q < 0 ? 2 : 0;
        const why = {
          0: q === 0 ? "Teme leži na osi $x$, zato ima funkcija eno (dvojno) ničlo." : `Parabola je odprta ${a > 0 ? "navzgor" : "navzdol"}, teme pa je ${q < 0 ? "pod" : "nad"} osjo $x$, zato os $x$ seka.`,
          1: "Eno ničlo ima funkcija le, kadar teme leži na osi $x$ ($q = 0$).",
          2: q === 0 ? "Teme leži na osi $x$, zato se je parabola le dotakne." : `Teme je ${q > 0 ? "nad" : "pod"} osjo $x$, parabola pa je odprta ${a > 0 ? "navzgor" : "navzdol"}, zato osi $x$ ne doseže.`,
        };
        return {
          text: r.pick([`Koliko ničel ima funkcija $${f}$?`, `Koliko skupnih točk ima graf funkcije $${f}$ z abscisno osjo?`]),
          answer: pickAns(r, String(cnt), [0, 1, 2].filter((v) => v !== cnt).map((v) => [String(v), why[v]])),
          hint: "Ugotovi, ali je parabola odprta navzgor ali navzdol in ali je teme nad, na ali pod osjo $x$.",
          data: { given: [f], find: ["\\text{število ničel}"] },
          formula: "f(x) = a(x - p)^2 + q, \\ T(p, q)",
          solution: L(`Teme $T(${p}, ${q})$, $a = ${a}$: parabola je odprta ${a > 0 ? "navzgor" : "navzdol"}.`, `Teme je ${q === 0 ? "na osi $x$" : q > 0 ? "nad osjo $x$" : "pod osjo $x$"}, zato ${["funkcija nima ničel", "ima funkcija eno ničlo", "ima funkcija dve ničli"][cnt]}.`),
        };
      }
      const a = nz(r, -3, 3);
      const p = nz(r, -4, 4);
      const q = r.int(-6, 6);
      const f = vf(a, p, q);
      const c = a * p * p + q;
      return {
        text: `V kateri točki graf funkcije $${f}$ seka ordinatno os? Vpiši ordinato presečišča.`,
        answer: num(c, null, [M(q, "To je ordinata temena; za presečišče z ordinatno osjo vstavi $x = 0$."), M((a * p) ** 2 + q, "Na kvadrat je le oklepaj $(x - p)$, ne koeficient $a$."), M(-a * p * p + q, "$(0 - p)^2$ je pozitivno.")]),
        hint: "Graf seka ordinatno os pri $x = 0$.",
        data: { given: [f], find: ["f(0)"] },
        formula: "N(0, f(0))",
        solution: L(`$f(0) = ${a === 1 ? "" : a === -1 ? "-" : a}(0 ${sg(-p)})^2${q ? ` ${sg(q)}` : ""}$`, `$f(0) = ${a === 1 ? "" : a === -1 ? "-" : `${a} \\cdot `}${p * p}${q ? ` ${sg(q)}` : ""} = ${c}$`),
      };
    }
    if (level === 2) {
      const t = r.int(0, 2);
      if (t === 0) {
        let r1;
        let r2;
        do {
          r1 = r.int(-4, 5);
          r2 = r.int(-4, 5);
        } while (r1 >= r2);
        const k = nz(r, -3, 3);
        const n = r.int(-5, 5);
        const b = k - (r1 + r2);
        const c = n + r1 * r2;
        const askY = r.next() < 0.4;
        const y2 = k * r2 + n;
        const par = poly([1, b, c]);
        const line = poly([k, n]);
        return {
          text: `Parabola $y = ${par}$ in premica $y = ${line}$ se sekata v dveh točkah. Kolikšna je ${askY ? "ordinata presečišča z večjo absciso" : "večja abscisa presečišča"}?`,
          answer: num(askY ? y2 : r2, null, askY ? [M(r2, "To je abscisa; izračunaj še ordinato."), M(k * r1 + n, "To je ordinata drugega presečišča.")] : [M(r1, "To je manjša abscisa."), M(-r2, "Pazi na predznak pri razcepu.")]),
          hint: "Izenači desni strani enačb in reši dobljeno kvadratno enačbo.",
          data: { given: [`y = ${par}`, `y = ${line}`], find: [askY ? "y_2" : "x_2"] },
          formula: "x^2 + bx + c = kx + n",
          solution: L(`$${par} = ${line}$`, `$${poly([1, b - k, c - n])} = 0$`, `$${fac(r1)}${fac(r2)} = 0$, $x_1 = ${r1}$, $x_2 = ${r2}$`, askY ? `$y_2 = ${k} \\cdot ${pt(r2)}${n ? ` ${sg(n)}` : ""} = ${y2}$` : null),
        };
      }
      if (t === 1) {
        const a = nz(r, -3, 3);
        const p = nz(r, -4, 4);
        const b = -2 * a * p;
        const c = r.int(-6, 6);
        const f = `f(x) = ${poly([a, b, c])}`;
        const I = (inc, v) => `\\text{narašča na } ${inc ? `[${v}, \\infty)` : `(-\\infty, ${v}]`}`;
        const up = a > 0;
        const dir = `Parabola je odprta ${up ? "navzgor" : "navzdol"}, zato funkcija ${up ? "levo od temena pada" : "levo od temena narašča"}.`;
        const sgn = "Abscisa temena je $p = -\\dfrac{b}{2a}$: pazi na predznak.";
        return {
          text: `Na katerem intervalu funkcija $${f}$ narašča?`,
          answer: pickAns(r, I(up, p), [[I(!up, p), dir], [I(up, -p), sgn], [I(!up, -p), `${sgn} ${dir}`]]),
          options_tex: true,
          hint: "Izračunaj absciso temena in upoštevaj predznak vodilnega koeficienta.",
          data: { given: [f], find: ["\\text{interval naraščanja}"] },
          formula: "p = -\\dfrac{b}{2a}",
          solution: L(`$p = -\\dfrac{${b}}{2 \\cdot ${pt(a)}} = ${p}$`, `$a = ${a} ${up ? ">" : "<"} 0$: parabola je odprta ${up ? "navzgor" : "navzdol"}, funkcija narašča na $${up ? `[${p}, \\infty)` : `(-\\infty, ${p}]`}$.`),
        };
      }
      const kind = r.int(0, 2);
      if (kind === 0) {
        const S = r.int(6, 40);
        const h = S / 2;
        return {
          text: `Vsota dveh realnih števil je $${S}$. Kolikšen je največji možni zmnožek teh dveh števil?`,
          answer: num(h * h, null, [M(S * S, "Zmnožek je $x(S - x)$; poišči teme te parabole."), M(h, "To je vsako od obeh števil; izračunaj še zmnožek."), M((S * S) / 2, "Zmnožek dveh enakih polovic je $\\dfrac{S}{2} \\cdot \\dfrac{S}{2}$.")]),
          hint: "Eno število označi z $x$, drugo izrazi z vsoto. Zmnožek je kvadratna funkcija spremenljivke $x$.",
          data: { given: [`S = ${S}`], find: ["P_{max}"] },
          formula: ["P(x) = x(S - x)", "p = -\\dfrac{b}{2a}"],
          solution: L(`$P(x) = x(${S} - x) = -x^2 + ${S}x$`, `$p = -\\dfrac{${S}}{2 \\cdot (-1)} = ${tx(h)}$`, `$P_{max} = P(${tx(h)}) = ${tx(h)} \\cdot ${tx(h)} = ${tx(h * h)}$`),
        };
      }
      if (kind === 1) {
        const d = r.int(3, 30);
        const h = d / 2;
        return {
          text: `Razlika dveh realnih števil je $${d}$. Kolikšen je najmanjši možni zmnožek teh dveh števil?`,
          answer: num(-h * h, null, [M(h * h, "Pri najmanjšem zmnožku imata števili različna predznaka, zato je zmnožek negativen."), M(h, "To je eno od števil; izračunaj še zmnožek."), M((-d * d) / 2, "Zmnožek je $\\dfrac{d}{2} \\cdot \\left(-\\dfrac{d}{2}\\right)$.")]),
          hint: "Manjše število označi z $x$, večje je $x + d$. Zmnožek je kvadratna funkcija spremenljivke $x$.",
          data: { given: [`d = ${d}`], find: ["P_{min}"] },
          formula: ["P(x) = x(x + d)", "p = -\\dfrac{b}{2a}"],
          solution: L(`$P(x) = x(x + ${d}) = x^2 + ${d}x$`, `$p = -\\dfrac{${d}}{2} = ${tx(-h)}$`, `$P_{min} = P(${tx(-h)}) = ${pt(-h)} \\cdot ${tx(h)} = ${tx(-h * h)}$`),
        };
      }
      const o = r.int(6, 40) * 2;
      const s = o / 4;
      const nm = r.pick(NAMES);
      return {
        text: `${nm} ima $${o}\\ \\mathrm{m}$ ograje za pravokotno gredico. Kolikšna je največja ploščina gredice, ki jo lahko ogradi?`,
        answer: num(s * s, null, [M((o / 2) ** 2 / 2, "Stranici pravokotnika z največjo ploščino sta enaki."), M(o * o, "Zmnožek stranic $x(\\dfrac{o}{2} - x)$ ima največjo vrednost v temenu."), M(s, "To je dolžina stranice; izračunaj še ploščino.")], "m^2"),
        hint: "Eno stranico označi z $x$, drugo izrazi z obsegom. Ploščina je kvadratna funkcija spremenljivke $x$.",
        data: { given: [`o = ${o}\\ \\mathrm{m}`], find: ["S_{max}"] },
        formula: ["S(x) = x\\left(\\dfrac{o}{2} - x\\right)", "p = -\\dfrac{b}{2a}"],
        solution: L(`$S(x) = x(${o / 2} - x) = -x^2 + ${o / 2}x$`, `$p = -\\dfrac{${o / 2}}{2 \\cdot (-1)} = ${tx(s)}\\ \\mathrm{m}$`, `$S_{max} = ${tx(s)} \\cdot ${tx(s)} = ${tx(s * s)}\\ \\mathrm{m^2}$`),
      };
    }
    const t = r.int(0, 2);
    if (t === 0) {
      const a = nz(r, -3, 3);
      const b = r.int(-5, 5);
      const c = r.int(-6, 6);
      const xs = r.shuffle([-3, -2, -1, 1, 2, 3]).slice(0, 3).sort((u, v) => u - v);
      const ys = xs.map((x) => a * x * x + b * x + c);
      const ask = r.pick(["a", "b", "c"]);
      const val = { a, b, c }[ask];
      const [x1, x2, x3] = xs;
      const [y1, y2, y3] = ys;
      const s12 = (y1 - y2) / (x1 - x2);
      const s13 = (y1 - y3) / (x1 - x3);
      const eq = (x, y) => `$${x * x === 1 ? "" : x * x}a ${x < 0 ? "-" : "+"} ${Math.abs(x) === 1 ? "" : Math.abs(x)}b + c = ${y}$`;
      const ka = (k) => (k === 0 ? "" : k === 1 ? "a + " : k === -1 ? "-a + " : `${k}a + `);
      const ms = ask === "c" ? [M(-c, "Preveri predznake pri odštevanju enačb."), M(y1, "$c$ je ordinata presečišča z ordinatno osjo, ne ordinata dane točke.")] : [M(-val, "Preveri predznake pri odštevanju enačb.")];
      return {
        text: `Graf kvadratne funkcije $f(x) = ax^2 + bx + c$ poteka skozi točke $A(${x1}, ${y1})$, $B(${x2}, ${y2})$ in $C(${x3}, ${y3})$. Koliko je $${ask}$?`,
        answer: num(val, null, ms),
        hint: "Koordinate vsake točke vstavi v $f(x) = ax^2 + bx + c$ in reši sistem treh enačb.",
        data: { given: [`A = (${x1}, ${y1})`, `B = (${x2}, ${y2})`, `C = (${x3}, ${y3})`], find: [ask] },
        formula: "f(x) = ax^2 + bx + c",
        solution: L(`${eq(x1, y1)}, ${eq(x2, y2)}, ${eq(x3, y3)}`, `Odštejemo enačbi za $A$ in $B$ ter delimo z $${x1 - x2}$: $${ka(x1 + x2)}b = ${s12}$`, `Odštejemo enačbi za $A$ in $C$ ter delimo z $${x1 - x3}$: $${ka(x1 + x3)}b = ${s13}$`, `$a = ${a}$, $b = ${b}$, $c = ${c}$`),
      };
    }
    if (t === 1) {
      let b;
      let k;
      do {
        b = r.int(-6, 6);
        k = r.int(-4, 4);
      } while (b === k);
      const c = r.int(-6, 6);
      const B = b - k;
      const par = poly([1, b, c]);
      const lk = k === 0 ? "n" : `${poly([k, 0])} + n`;
      const ms = [M(c - B * B, "Diskriminanto izenači z 0 in deli s 4."), M(c + (B * B) / 4, "Pri izražanju $n$ pazi na predznak.")];
      if (k !== 0) ms.push(M(c - (b + k) ** 2 / 4, "Koeficient pri $x$ je $b - k$, ne $b + k$."));
      return {
        text: `Za katero vrednost $n$ je premica $y = ${lk}$ tangenta na parabolo $y = ${par}$? Rezultat zapiši kot okrajšan ulomek ali celo število.`,
        answer: frA(4 * c - B * B, 4, ms),
        hint: "Izenači enačbi. Premica se parabole dotika, če ima dobljena kvadratna enačba eno (dvojno) rešitev.",
        data: { given: [`y = ${par}`, `y = ${lk}`], find: ["n"] },
        formula: ["D = b^2 - 4ac", "D = 0"],
        solution: L(`$${par} = ${lk}$`, `$${poly([1, B, 0])} ${c ? `+ (${c} - n)` : "- n"} = 0$`, `$D = ${pt(B)}^2 ${c ? `- 4(${c} - n)` : "+ 4n"} = ${B * B}${c ? ` ${sg(-4 * c)}` : ""} + 4n = 0$`, `$n = ${ft(4 * c - B * B, 4)}$`),
      };
    }
    const C = r.pick([
      { s: "Lok mostu", w: "Ob tleh je širok", edge: "enega od vznožij loka" },
      { s: "Vhod v predor", w: "Ob tleh je širok", edge: "roba vhoda" },
      { s: "Curek vodnjaka", w: "Iz šobe v tleh pade na tla v razdalji", edge: "šobe" },
    ]);
    const w = r.pick([12, 16, 20, 24, 30, 40, 50, 60]);
    const h = r.pick([4, 5, 6, 8, 10, 12, 15]);
    const d = r.int(1, w / 2 - 1);
    const hw = w / 2;
    const y = (h * (1 - ((d - hw) / hw) ** 2));
    return {
      text: `${C.s} ima obliko parabole. ${C.w} $${w}\\ \\mathrm{m}$, najvišja točka pa je $${h}\\ \\mathrm{m}$ nad tlemi. Kako visoko je na vodoravni razdalji $${d}\\ \\mathrm{m}$ od ${C.edge}? Zaokroži na dve decimalki.`,
      answer: num(y, 2, [M((h * d) / hw, "Lok ni premica: višina se ne spreminja sorazmerno z razdaljo."), M(h * (1 - (d / hw) ** 2), "Razdalja je merjena od roba, ne od sredine.")], "m"),
      hint: "Postavi koordinatni sistem z izhodiščem na robu: ničli parabole sta $0$ in $w$, teme je na sredini.",
      data: { given: [`w = ${w}\\ \\mathrm{m}`, `h = ${h}\\ \\mathrm{m}`, `d = ${d}\\ \\mathrm{m}`], find: ["y"] },
      formula: "y = a(x - p)^2 + q",
      solution: L(`$y = a(x - ${hw})^2 + ${h}$`, `$0 = a(0 - ${hw})^2 + ${h} \\Rightarrow a = ${ft(-h, hw * hw)}$`, `$y(${d}) = ${ft(-h, hw * hw)} \\cdot ${pt(d - hw)}^2 + ${h}$`, `$y ${ap(y, 2)} ${tx(y, 2)}\\ \\mathrm{m}$`),
    };
  },
};

// ================= kvadratna enačba =================
const KRAT = { 2: "dvakrat", 3: "trikrat", 4: "štirikrat", 5: "petkrat" };
const KVENA = {
  id: "gim-kvadratna-enacba-dop",
  topics: [T("kvadratna-enacba")],
  gen(level, r) {
    if (level === 1) {
      const t = r.int(0, 3);
      if (t === 0) {
        let x1;
        let x2;
        do {
          x1 = nz(r, -6, 6);
          x2 = nz(r, -6, 6);
        } while (x1 === x2);
        const b = -(x1 + x2);
        const c = x1 * x2;
        const E = `${poly([1, b, c])} = 0`;
        return {
          text: `Ena rešitev enačbe $${E}$ je $x_1 = ${x1}$. Koliko je druga rešitev?`,
          answer: num(x2, null, [M(-x2, "Po Vietu je $x_1 + x_2 = -b$: pazi na predznak."), M(c, "Zmnožek rešitev je $c$; deliti ga moraš še z $x_1$.")]),
          hint: "Uporabi Vietovo pravilo za vsoto ali za zmnožek rešitev.",
          data: { given: [E, `x_1 = ${x1}`], find: ["x_2"] },
          formula: ["x_1 + x_2 = -b", "x_1 \\cdot x_2 = c"],
          solution: L(`$x_1 + x_2 = ${-b}$`, `$x_2 = ${-b} - ${pt(x1)} = ${x2}$`),
        };
      }
      if (t === 1) {
        let x1;
        let x2;
        do {
          x1 = r.int(-6, 6);
          x2 = r.int(-6, 6);
        } while (x1 >= x2);
        const askP = r.next() < 0.5;
        const p = -(x1 + x2);
        const q = x1 * x2;
        return {
          text: `Kvadratna enačba $x^2 + px + q = 0$ ima rešitvi $x_1 = ${x1}$ in $x_2 = ${x2}$. Koliko je $${askP ? "p" : "q"}$?`,
          answer: num(askP ? p : q, null, askP ? [M(x1 + x2, "Po Vietu je $p = -(x_1 + x_2)$."), M(q, "$p$ je povezan z vsoto rešitev, $q$ z zmnožkom.")] : [M(-q, "$q = x_1 \\cdot x_2$, brez minusa."), M(x1 + x2, "$q$ je zmnožek rešitev, ne vsota.")]),
          hint: "Enačbo zapiši v razcepljeni obliki ali uporabi Vietovi pravili.",
          data: { given: [`x_1 = ${x1}`, `x_2 = ${x2}`], find: [askP ? "p" : "q"] },
          formula: "(x - x_1)(x - x_2) = x^2 - (x_1 + x_2)x + x_1 x_2",
          solution: L(`$${fac(x1)}${fac(x2)} = 0$`, `$${poly([1, p, q])} = 0$`, `$${askP ? "p" : "q"} = ${askP ? p : q}$`),
        };
      }
      if (t === 2) {
        const a = nz(r, -6, 6);
        const b = nz(r, -12, 12);
        const E = `${poly([a, b, 0])} = 0`;
        return {
          text: `Reši enačbo $${E}$. Vpiši neničelno rešitev kot okrajšan ulomek ali celo število.`,
          answer: frA(-b, a, [M(b / a, "Pazi na predznak: iz $ax + b = 0$ sledi $x = -\\dfrac{b}{a}$.")]),
          hint: "Izpostavi $x$.",
          data: { given: [E], find: ["x_2"] },
          formula: "x(ax + b) = 0 \\Rightarrow x_1 = 0, \\ x_2 = -\\dfrac{b}{a}",
          solution: L(`$x(${poly([a, b])}) = 0$`, `$x_1 = 0$ ali $${poly([a, b])} = 0$`, `$x_2 = ${ft(-b, a)}$`),
        };
      }
      const a = r.int(1, 5);
      const s = r.int(2, 9);
      const c = a * s * s;
      const E = `${poly([a, 0, -c])} = 0`;
      return {
        text: `Reši enačbo $${E}$. Vpiši pozitivno rešitev.`,
        answer: num(s, null, [M(s * s, "To je $x^2$; koreni."), a > 1 ? M(Math.sqrt(c), `Najprej deli z ${a}, nato koreni.`) : null].filter(Boolean)),
        hint: "Osami $x^2$ in koreni.",
        data: { given: [E], find: ["x_1"] },
        formula: "x^2 = k \\Rightarrow x = \\pm\\sqrt{k}",
        solution: L(a > 1 ? `$${a}x^2 = ${c}$` : null, `$x^2 = ${s * s}$`, `$x = \\pm ${s}$, pozitivna rešitev je $${s}$`),
      };
    }
    if (level === 2) {
      const t = r.int(0, 2);
      if (t === 0) {
        const kind = r.int(0, 2);
        let t1;
        let t2;
        if (kind === 0) {
          t1 = r.int(1, 3) ** 2;
          do t2 = r.int(2, 4) ** 2;
          while (t2 === t1);
        } else if (kind === 1) {
          t1 = r.int(2, 4) ** 2;
          t2 = -r.int(1, 5);
        } else {
          t1 = -r.int(1, 4);
          do t2 = -r.int(1, 5);
          while (t2 === t1);
        }
        const B = -(t1 + t2);
        const C = t1 * t2;
        const E = `${poly([1, 0, B, 0, C])} = 0`;
        const real = [t1, t2].filter((v) => v > 0);
        const cnt = 2 * real.length;
        const askCnt = kind === 2 || r.next() < 0.45;
        const big = Math.sqrt(Math.max(t1, t2));
        const xl = (v) => (v > 0 ? `$x^2 = ${v} \\Rightarrow x = \\pm ${Math.sqrt(v)}$` : `$x^2 = ${v}$ nima realnih rešitev`);
        const task = {
          text: askCnt ? `Koliko realnih rešitev ima enačba $${E}$?` : `Reši enačbo $${E}$ v množici realnih števil. Vpiši ${kind === 0 ? "največjo" : "pozitivno"} rešitev.`,
          answer: askCnt ? num(cnt, null, cnt === 4 ? [M(2, "Vsaka pozitivna vrednost $t = x^2$ da dve rešitvi $\\pm\\sqrt{t}$.")] : [M(cnt + 2, "Negativna vrednost $t = x^2$ ne da realnih rešitev, ker je $x^2 \\ge 0$.")]) : num(big, null, [M(big * big, "To je $t = x^2$; koreni."), kind === 0 ? M(Math.sqrt(Math.min(t1, t2)), "To ni največja rešitev.") : null].filter(Boolean)),
          hint: "Uvedi novo spremenljivko $t = x^2$.",
          data: { given: [E], find: [askCnt ? "\\text{število rešitev}" : "x"] },
          formula: ["t = x^2", "t^2 + bt + c = 0"],
          solution: L(`$${poly([1, B, C], "t")} = 0$`, `$${fac(t1, "t")}${fac(t2, "t")} = 0$, $t_1 = ${t1}$, $t_2 = ${t2}$`, xl(t1), xl(t2), askCnt ? `Število realnih rešitev: $${cnt}$` : `Iskana rešitev: $${big}$`),
        };
        if (cnt === 0) task.zeroOk = true;
        return task;
      }
      if (t === 1) {
        let x1;
        let x2;
        do {
          x1 = nz(r, -6, 6);
          x2 = nz(r, -6, 6);
        } while (x1 === x2);
        if (r.next() < 0.5) {
          const b = -(x1 + x2);
          const m = x1 * x2;
          return {
            text: `Za katero vrednost parametra $m$ je $x_1 = ${x1}$ rešitev enačbe $${poly([1, b, 0])} + m = 0$?`,
            answer: num(m, null, [M(-m, "Ko vstaviš $x_1$, prenesi člene na drugo stran s spremenjenim predznakom."), M(x2, "To je druga rešitev enačbe, iščeš pa parameter $m$.")]),
            hint: "Rešitev enačbe ustreza enačbi: vstavi $x_1$ namesto $x$.",
            data: { given: [`x_1 = ${x1}`], find: ["m"] },
            formula: "x_1^2 + bx_1 + m = 0",
            solution: L(`$${pt(x1)}^2${b ? ` ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : `${Math.abs(b)} \\cdot `}${pt(x1)}` : ""} + m = 0$`, `$${x1 * x1 + b * x1} + m = 0$`, `$m = ${m}$`),
          };
        }
        const m = -(x1 + x2);
        const c = x1 * x2;
        return {
          text: `Za katero vrednost parametra $m$ je $x_1 = ${x1}$ rešitev enačbe $x^2 + mx ${sg(c)} = 0$?`,
          answer: num(m, null, [M(-m, "Pri deljenju z $x_1$ pazi na predznak."), M(x2, "To je druga rešitev enačbe, iščeš pa parameter $m$.")]),
          hint: "Rešitev enačbe ustreza enačbi: vstavi $x_1$ namesto $x$ in reši linearno enačbo za $m$.",
          data: { given: [`x_1 = ${x1}`], find: ["m"] },
          formula: "x_1^2 + mx_1 + c = 0",
          solution: L(`$${pt(x1)}^2 + m \\cdot ${pt(x1)} ${sg(c)} = 0$`, `$${x1}m = ${-(x1 * x1 + c)}$`, `$m = ${m}$`),
        };
      }
      let r1;
      let r2;
      do {
        r1 = nz(r, -6, 6);
        r2 = nz(r, -6, 6);
      } while (r1 >= r2);
      const P = r1 * r2;
      const S = r1 + r2;
      const E = `x ${P < 0 ? "-" : "+"} \\dfrac{${Math.abs(P)}}{x} = ${S}`;
      return {
        text: `Reši enačbo $${E}$. Vpiši večjo rešitev.`,
        answer: num(r2, null, [M(r1, "To je manjša rešitev."), M(-r2, "Pazi na predznake pri razcepu.")]),
        hint: "Enačbo pomnoži z $x$ (velja $x \\neq 0$).",
        data: { given: [E], find: ["x"] },
        formula: "x + \\dfrac{c}{x} = s \\ / \\cdot x",
        solution: L(`$x^2 ${sg(P)} = ${S === 0 ? "0" : poly([S, 0])}$`, `$${poly([1, -S, P])} = 0$`, `$${fac(r1)}${fac(r2)} = 0$, $x_1 = ${r1}$, $x_2 = ${r2}$ (obe sta različni od 0)`, `Večja rešitev je $${r2}$.`),
      };
    }
    const t = r.int(0, 2);
    if (t === 0) {
      let v;
      let k;
      let tm;
      let d;
      for (;;) {
        v = r.pick([12, 15, 16, 18, 20, 24, 30, 36, 40, 45, 48, 50, 60, 72, 80]);
        k = r.pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20]);
        tm = r.pick([10, 12, 15, 20, 24, 30, 36, 40, 45, 60]);
        d = (tm * v * (v + k)) / (60 * k);
        if (Number.isInteger(d) && d >= 10 && d <= Math.min(400, (v <= 24 ? 5 : 6) * v)) break;
      }
      const nm = r.pick(NAMES);
      const veh = v <= 24 ? "s kolesom" : "z avtom";
      const [tp, tq] = [tm / gcd(tm, 60), 60 / gcd(tm, 60)];
      const C = v * (v + k);
      const Dk = k * k + 4 * C;
      const tw = tm;
      const vw = (-tw * k + Math.sqrt((tw * k) ** 2 + 4 * tw * d * k)) / (2 * tw);
      return {
        text: `${nm} je ${veh} ${g(nm, "prevozil", "prevozila")} $${d}\\ \\mathrm{km}$ s stalno hitrostjo. Če bi ${g(nm, "vozil", "vozila")} $${k}\\ \\mathrm{km/h}$ hitreje, bi ${g(nm, "prispel", "prispela")} $${tm}$ minut prej. S kolikšno hitrostjo je ${g(nm, "vozil", "vozila")}?`,
        answer: num(v, null, [M(v + k, "To je hitrost pri hitrejši vožnji."), M(vw, "Si minute pretvoril v ure?")], "km/h"),
        hint: "Zapiši čas vožnje pri obeh hitrostih kot $t = \\dfrac{s}{v}$; razlika časov je dana (v urah).",
        data: { given: [`s = ${d}\\ \\mathrm{km}`, `\\Delta v = ${k}\\ \\mathrm{km/h}`, `\\Delta t = ${tm}\\ \\mathrm{min}`], find: ["v"] },
        formula: ["t = \\dfrac{s}{v}", "\\dfrac{s}{v} - \\dfrac{s}{v + \\Delta v} = \\Delta t"],
        solution: L(`$\\Delta t = ${tm}\\ \\mathrm{min} = ${ft(tp, tq)}\\ \\mathrm{h}$`, `$\\dfrac{${d}}{v} - \\dfrac{${d}}{v + ${k}} = ${ft(tp, tq)}$`, `$v^2 + ${k}v - ${C} = 0$`, `$D = ${k}^2 + 4 \\cdot ${C} = ${Dk}$, $\\sqrt{D} = ${2 * v + k}$`, `$v = \\dfrac{-${k} + ${2 * v + k}}{2} = ${v}\\ \\mathrm{km/h}$ (negativna rešitev ne pride v poštev)`),
      };
    }
    if (t === 1) {
      let x;
      let h;
      for (;;) {
        x = r.int(3, 24);
        h = r.int(1, x - 1);
        if ((x * (x - h) * 60) % (2 * x - h) === 0) break;
      }
      const Tn0 = x * (x - h);
      const Td0 = 2 * x - h;
      const gg = gcd(Tn0, Td0);
      const [Tn, Td] = [Tn0 / gg, Td0 / gg];
      const Tmin = (Tn * 60) / Td;
      const hh = Math.floor(Tmin / 60);
      const mm = Tmin % 60;
      const Tt = `${hh ? `${hh}\\ \\mathrm{h}` : ""}${hh && mm ? "\\ " : ""}${mm ? `${mm}\\ \\mathrm{min}` : ""}`;
      const hw = `$${h}$ ${verbOf(h, "uro", "uri", "ure", "ur")}`;
      const askSlow = r.next() < 0.5;
      const C = r.pick([
        (who) => `Prva cev bi sama napolnila bazen za ${hw} hitreje kot druga. Skupaj ga napolnita v $${Tt}$. V koliko urah bi bazen napolnila sama ${who}a cev?`,
        (who) => `Prvi tiskalnik bi sam natisnil naklado letakov za ${hw} hitreje kot drugi. Skupaj jo natisneta v $${Tt}$. V koliko urah bi jo natisnil sam ${who}i tiskalnik?`,
        (who) => `Prvi kombajn bi sam požel njivo za ${hw} hitreje kot drugi. Skupaj jo požanjeta v $${Tt}$. V koliko urah bi jo požel sam ${who}i kombajn?`,
      ])(askSlow ? "počasnejš" : "hitrejš");
      const ans = askSlow ? x : x - h;
      const Tv = Tn / Td;
      const cs = [Td, -(h * Td + 2 * Tn), h * Tn];
      const cg = gcd(gcd(Math.abs(cs[0]), Math.abs(cs[1])), Math.abs(cs[2]));
      return {
        text: C,
        answer: num(ans, null, [M(2 * Tv, "Če bi delala enako hitro, bi vsak potreboval dvakrat več časa – tu pa sta hitrosti različni."), M(askSlow ? x - h : x, `To je čas ${askSlow ? "hitrejšega" : "počasnejšega"}.`)], "h"),
        hint: "Naj bo $x$ čas počasnejšega. V eni uri hitrejši opravi $\\dfrac{1}{x - \\Delta t}$ dela, počasnejši $\\dfrac{1}{x}$ dela, skupaj $\\dfrac{1}{T}$ dela.",
        data: { given: [`\\Delta t = ${h}\\ \\mathrm{h}`, `T = ${Tt}`], find: [askSlow ? "x" : "x - \\Delta t"] },
        formula: "\\dfrac{1}{x} + \\dfrac{1}{x - \\Delta t} = \\dfrac{1}{T}",
        solution: L(Td > 1 ? `$T = ${Tt} = ${ft(Tn, Td)}\\ \\mathrm{h}$` : null,`$\\dfrac{1}{x} + \\dfrac{1}{x - ${h}} = ${ft(Td, Tn)}$`, `$${poly(cs.map((v) => v / cg))} = 0$`, `$x_1 = ${x}$, $x_2 = ${ft(h * Tn, Td * x)}$ (ne pride v poštev, ker mora biti $x > ${h}$)`, `Posamič: $x = ${x}\\ \\mathrm{h}$ in $x - ${h} = ${x - h}\\ \\mathrm{h}$; iskani čas je $${ans}\\ \\mathrm{h}$.`),
      };
    }
    if (r.next() < 0.5) {
      const x2 = nz(r, -4, 4);
      const kk = r.int(2, 5);
      const b = -(kk + 1) * x2;
      const m = kk * x2 * x2;
      const E = `${poly([1, b, 0])} + m = 0`;
      return {
        text: `Za katero vrednost parametra $m$ je ena rešitev enačbe $${E}$ ${KRAT[kk]} tolikšna kot druga?`,
        answer: num(m, null, [M(-m, "Po Vietu je $x_1 \\cdot x_2 = m$, brez minusa."), M(kk * x2, "To je ena od rešitev; $m$ je zmnožek obeh.")]),
        hint: `Označi rešitvi z $x_2$ in $${kk}x_2$ ter uporabi Vietovo pravilo za vsoto.`,
        data: { given: [E], find: ["m"] },
        formula: ["x_1 + x_2 = -b", "x_1 \\cdot x_2 = m"],
        solution: L(`$x_1 = ${kk}x_2$`, `$x_1 + x_2 = ${kk + 1}x_2 = ${-b} \\Rightarrow x_2 = ${x2}$`, `$x_1 = ${kk * x2}$`, `$m = x_1 x_2 = ${kk * x2} \\cdot ${pt(x2)} = ${m}$`),
      };
    }
    let b;
    let d;
    do {
      b = nz(r, -8, 8);
      d = r.int(1, 9);
    } while ((b - d) % 2 !== 0 || Math.abs(b) === d);
    const x1 = (-b + d) / 2;
    const x2 = (-b - d) / 2;
    const m = x1 * x2;
    const E = `${poly([1, b, 0])} + m = 0`;
    return {
      text: `Za katero vrednost parametra $m$ se rešitvi enačbe $${E}$ razlikujeta za $${d}$?`,
      answer: num(m, null, [M((b * b + d * d) / 4, "Pri računanju zmnožka rešitev pazi na predznak."), M(-m, "Po Vietu je $x_1 \\cdot x_2 = m$, brez minusa.")]),
      hint: "Iz vsote in razlike rešitev izračunaj obe rešitvi, nato uporabi Vietovo pravilo za zmnožek.",
      data: { given: [E, `x_1 - x_2 = ${d}`], find: ["m"] },
      formula: ["x_1 + x_2 = -b", "x_1 \\cdot x_2 = m"],
      solution: L(`$x_1 + x_2 = ${-b}$, $x_1 - x_2 = ${d}$`, `$2x_1 = ${-b + d} \\Rightarrow x_1 = ${x1}$, $x_2 = ${x2}$`, `$m = x_1 x_2 = ${pt(x1)} \\cdot ${pt(x2)} = ${m}$`),
    };
  },
};

// ================= eksponentne enačbe =================
const LOGRULE = "a^x = c \\Rightarrow x = \\log_a c = \\dfrac{\\log c}{\\log a}";
const EKSP = {
  id: "gim-eksponentne-enacbe-dop",
  topics: [T("eksponentne-enacbe")],
  gen(level, r) {
    if (level === 1) {
      const t = r.int(0, 3);
      if (t === 0) {
        const b = r.pick([2, 3, 5, 7]);
        let N;
        do N = r.int(3, 100);
        while (isPow(N, b));
        const x = lg(N) / lg(b);
        const E = `${b}^x = ${N}`;
        return {
          text: `Reši enačbo $${E}$. Rezultat zaokroži na dve decimalki.`,
          answer: num(x, 2, [M(N / b, "Eksponentne enačbe ne rešiš z deljenjem – logaritmiraj."), M(lg(N / b), "$\\dfrac{\\log N}{\\log b}$ ni enako $\\log N - \\log b$."), M(lg(N), "Deliti moraš še z $\\log b$.")]),
          hint: "Logaritmiraj obe strani enačbe.",
          data: { given: [E], find: ["x"] },
          formula: LOGRULE,
          solution: L(`$x = \\log_{${b}} ${N} = \\dfrac{\\log ${N}}{\\log ${b}}$`, `$x ${ap(x, 2)} \\dfrac{${tx(lg(N), 4)}}{${tx(lg(b), 4)}} ${ap(x, 2)} ${tx(x, 2)}$`),
        };
      }
      if (t === 1) {
        const b = r.pick([2, 3, 5, 10]);
        const c = r.pick([-9, -4, -2, -1, 0, 1, 1, 3, 5, 7, 12, 20]);
        const sh = r.next() < 0.5;
        const k = nz(r, -5, 5);
        const E = sh ? `${b}^x ${sg(k)} = ${c + k}` : `${b}^x = ${c}`;
        const cnt = c > 0 ? 1 : 0;
        const why = {
          0: c === 1 ? `Tudi $${b}^0 = 1$, zato ima enačba rešitev $x = 0$.` : "Za vsako pozitivno število $c$ ima enačba $b^x = c$ rešitev $x = \\log_b c$.",
          1: `Potenca $${b}^x$ je pozitivna za vsak $x$, zato ne more biti enaka $${c}$.`,
          2: "Eksponentna funkcija je strogo monotona, zato vsako vrednost doseže največ enkrat.",
        };
        return {
          text: `Koliko realnih rešitev ima enačba $${E}$?`,
          answer: pickAns(r, String(cnt), [0, 1, 2].filter((v) => v !== cnt).map((v) => [String(v), why[v]])),
          hint: "Zaloga vrednosti eksponentne funkcije so pozitivna števila.",
          data: { given: [E], find: ["\\text{število rešitev}"] },
          formula: "a^x > 0 \\ \\text{za vsak } x",
          solution: L(sh ? `$${b}^x = ${c}$` : null, c > 0 ? `$${c} > 0$: enačba ima natanko eno rešitev ($x = ${c === 1 ? "0" : `\\log_{${b}} ${c}`}$).` : `$${b}^x > 0$ za vsak $x$, $${c}$ pa ni pozitivno: enačba nima rešitve.`, `Število rešitev: $${cnt}$`),
        };
      }
      if (t === 2) {
        const [a, b] = r.pick([[2, 3], [2, 5], [3, 4], [3, 5], [2, 7], [4, 5]]);
        const ab = a * b;
        const kmax = ab <= 10 ? 3 : 2;
        const k = r.pick([...Array(kmax).keys()].map((i) => i + 1).concat([-1, -2]));
        const R = k > 0 ? `${ab ** k}` : `\\dfrac{1}{${ab ** -k}}`;
        const E = `${a}^x \\cdot ${b}^x = ${R}`;
        return {
          text: r.pick([`Reši enačbo $${E}$.`, `Za kateri $x$ velja $${E}$?`]),
          answer: num(k, null, [k > 0 ? M(ab ** k / ab, "Eksponentne enačbe ne rešiš z deljenjem; $a^x \\cdot b^x = (ab)^x$.") : M(-k, "$\\dfrac{1}{c^k} = c^{-k}$: pazi na predznak eksponenta."), M(Math.log(ab ** k) / Math.log(a + b), "$a^x \\cdot b^x = (a \\cdot b)^x$, ne $(a + b)^x$.")]),
          hint: "Potenci z enakim eksponentom združi v eno potenco.",
          data: { given: [E], find: ["x"] },
          formula: ["a^x \\cdot b^x = (a \\cdot b)^x", "a^m = a^n \\iff m = n"],
          solution: L(`$${a}^x \\cdot ${b}^x = ${ab}^x$`, `$${ab}^x = ${R} = ${ab}^{${k}}$`, `$x = ${k}$`),
        };
      }
      const b = r.pick([2, 3, 5, 7, 10]);
      const p = nz(r, -4, 4);
      const q = nz(r, -9, 9);
      const lin = poly([p, q]);
      const E = `${b}^{${lin}} = 1`;
      return {
        text: `Reši enačbo $${E}$. Rezultat zapiši kot okrajšan ulomek ali celo število.`,
        answer: frA(-q, p, [M((1 - q) / p, "$1 = b^0$, ne $b^1$: eksponent izenači z 0."), M(q / p, "Pri prenosu člena na drugo stran spremeni predznak.")]),
        hint: "Število 1 zapiši kot potenco z osnovo $" + b + "$.",
        data: { given: [E], find: ["x"] },
        formula: ["a^0 = 1", "a^m = a^n \\iff m = n"],
        solution: L(`$${b}^{${lin}} = ${b}^0$`, `$${lin} = 0$`, `$x = ${ft(-q, p)}$`),
      };
    }
    if (level === 2) {
      const t = r.int(0, 2);
      if (t === 0) {
        const A = r.int(2, 6);
        const b = r.pick([2, 3, 5]);
        const Mv = r.int(3, 40);
        const C = nz(r, -20, 20);
        const D = A * Mv + C;
        const x = lg(Mv) / lg(b);
        const E = `${A} \\cdot ${b}^x ${sg(C)} = ${D}`;
        const lb = (v) => (v > 0 ? lg(v) / lg(b) : NaN);
        return {
          text: `Reši enačbo $${E}$. Rezultat zaokroži na dve decimalki.`,
          answer: num(x, 2, [M(lb(D - C), `Najprej deli z ${A}.`), M(lb((D + C) / A), "Pri prenosu člena na drugo stran spremeni predznak."), M(lg(D - C) / lg(A * b), "$A \\cdot b^x$ ni $(A \\cdot b)^x$.")]),
          hint: `Najprej osami potenco $${b}^x$, nato logaritmiraj.`,
          data: { given: [E], find: ["x"] },
          formula: LOGRULE,
          solution: L(`$${A} \\cdot ${b}^x = ${D - C}$`, `$${b}^x = ${Mv}$`, `$x = \\dfrac{\\log ${Mv}}{\\log ${b}} ${ap(x, 2)} ${tx(x, 2)}$`),
        };
      }
      if (t === 1) {
        const b = r.pick([2, 3, 5]);
        let r1;
        let r2;
        let k;
        do {
          r1 = r.int(-4, 5);
          r2 = r.int(-4, 5);
          k = -r1 * r2;
        } while (r1 >= r2 || b ** Math.abs(k) > 625 || r1 + r2 === 0);
        const p = -(r1 + r2);
        const R = k >= 0 ? `${b ** k}` : `\\dfrac{1}{${b ** -k}}`;
        const ex = poly([1, p, 0]);
        const E = `${b}^{${ex}} = ${R}`;
        return {
          text: `Reši enačbo $${E}$. Vpiši večjo rešitev.`,
          answer: num(r2, null, [M(r1, "To je manjša rešitev."), M(-r2, "Pazi na predznake pri razcepu.")]),
          hint: `Desno stran zapiši kot potenco z osnovo $${b}$ in izenači eksponenta.`,
          data: { given: [E], find: ["x"] },
          formula: ["a^m = a^n \\iff m = n", "\\dfrac{1}{a^n} = a^{-n}"],
          solution: L(`$${R} = ${b}^{${k}}$`, `$${ex} = ${k}$`, k ? `$${poly([1, p, -k])} = 0$` : null, `$${fac(r1)}${fac(r2)} = 0$, $x_1 = ${r1}$, $x_2 = ${r2}$`),
        };
      }
      const D = r.pick([100, 200, 250, 400, 500, 800]);
      const p = r.pick([10, 12, 15, 20, 25, 30]);
      const f = r.pick([0.5, 0.4, 0.3, 0.25, 0.2, 0.1]);
      const X = D * f;
      const q = 1 - p / 100;
      const tt = lg(X / D) / lg(q);
      return {
        text: `V telesu se vsako uro razgradi $${p}\\ \\%$ zdravila, ki je še v krvi. Bolnik prejme $${D}\\ \\mathrm{mg}$ zdravila. Po kolikšnem času ga bo v krvi le še $${tx(X)}\\ \\mathrm{mg}$? Zaokroži na desetinko ure.`,
        answer: num(tt, 1, [M(lg(X / D) / lg(1 + p / 100), "Količina se zmanjšuje, zato je $q = 1 - \\dfrac{p}{100}$."), M((D - X) / ((D * p) / 100), "Razgradnja ni enakomerna: vsako uro se razgradi isti odstotek trenutne količine."), M(lg(X / D) / lg(p / 100), "$q$ je delež, ki ostane, torej $1 - \\dfrac{p}{100}$.")], "h"),
        hint: "Količina se vsako uro pomnoži z istim faktorjem $q$. Zapiši eksponentno enačbo in jo logaritmiraj.",
        data: { given: [`m_0 = ${D}\\ \\mathrm{mg}`, `p = ${p}\\ \\%`, `m = ${tx(X)}\\ \\mathrm{mg}`], find: ["t"] },
        formula: ["m = m_0 \\cdot q^t", "q = 1 - \\dfrac{p}{100}"],
        solution: L(`$q = 1 - \\dfrac{${p}}{100} = ${tx(q)}$`, `$${tx(X)} = ${D} \\cdot ${tx(q)}^t \\Rightarrow ${tx(q)}^t = ${tx(f)}$`, `$t = \\dfrac{\\log ${tx(f)}}{\\log ${tx(q)}} ${ap(tt, 1)} ${tx(tt, 1)}\\ \\mathrm{h}$`),
      };
    }
    const t = r.int(0, 3);
    if (t === 0) {
      let b1;
      let b2;
      do {
        b1 = r.pick([2, 3, 5, 7]);
        b2 = r.pick([2, 3, 5, 7]);
      } while (b1 === b2);
      const u = r.pick([1, 2, 3, -1, -2]);
      const x = (u * lg(b1)) / (lg(b2) - lg(b1));
      const E = `${b1}^{x ${sg(u)}} = ${b2}^x`;
      const ms = [M(-x, "Pri prenosu člena na drugo stran spremeni predznak."), M(u / (lg(b2) - lg(b1)), `Člen $${u}$ v eksponentu pomnoži z $\\log ${b1}$.`)];
      if (b2 - b1 > 1) ms.push(M((u * lg(b1)) / lg(b2 - b1), "$\\log a - \\log b = \\log \\dfrac{a}{b}$, ne $\\log(a - b)$."));
      return {
        text: `Reši enačbo $${E}$. Rezultat zaokroži na dve decimalki.`,
        answer: num(x, 2, ms),
        hint: "Logaritmiraj obe strani in uporabi $\\log a^n = n \\log a$.",
        data: { given: [E], find: ["x"] },
        formula: ["\\log a^n = n \\log a"],
        solution: L(`$(x ${sg(u)}) \\log ${b1} = x \\log ${b2}$`, `$x(\\log ${b2} - \\log ${b1}) = ${u === 1 ? "" : u === -1 ? "-" : u}\\log ${b1}$`, `$x = \\dfrac{${u === 1 ? "" : u === -1 ? "-" : `${u} \\cdot `}\\log ${b1}}{\\log ${b2} - \\log ${b1}}$`, `$x ${ap(x, 2)} ${tx(x, 2)}$`),
      };
    }
    if (t === 1) {
      const city = r.next() < 0.55;
      const A1 = city ? r.int(8, 30) * 1000 : r.int(2, 9) * 100;
      const A2 = A1 + (city ? r.int(2, 15) * 1000 : r.int(1, 8) * 100);
      const p1 = city ? r.pick([2, 2.5, 3, 3.5, 4, 5]) : r.pick([20, 25, 30, 40]);
      const p2 = city ? r.pick([0.5, 1, 1.5].filter((v) => v < p1 - 0.5)) : r.pick([5, 10, 15]);
      const q1 = 1 + p1 / 100;
      const q2 = 1 + p2 / 100;
      const tt = Math.log(A2 / A1) / Math.log(q1 / q2);
      const lin = A1 * q1 - A1 - (A2 * q2 - A2);
      const ms = [M(Math.log(A2 / A1) / Math.log(q1), "Upoštevati moraš tudi rast druge populacije.")];
      if (lin > 0) ms.push(M((A2 - A1) / lin, "Rast ni linearna – prirastek je vsako leto večji."));
      const per = city ? "leto" : "uro";
      return {
        text: city
          ? `Mesto A ima $${A1}$ prebivalcev in vsako leto zraste za $${tx(p1)}\\ \\%$. Mesto B ima $${A2}$ prebivalcev in vsako leto zraste za $${tx(p2)}\\ \\%$. Čez koliko let bosta mesti imeli enako število prebivalcev? Zaokroži na eno decimalko.`
          : `Kolonija bakterij A šteje $${A1}$ bakterij in vsako uro zraste za $${p1}\\ \\%$. Kolonija B šteje $${A2}$ bakterij in vsako uro zraste za $${p2}\\ \\%$. Čez koliko ur bosta koloniji enako veliki? Zaokroži na eno decimalko.`,
        answer: num(tt, 1, ms),
        hint: `Za vsako populacijo zapiši $N = N_0 \\cdot q^t$ (en korak je eno ${per}) in izraza izenači.`,
        data: { given: [`N_A = ${A1}`, `p_A = ${tx(p1)}\\ \\%`, `N_B = ${A2}`, `p_B = ${tx(p2)}\\ \\%`], find: ["t"] },
        formula: ["N = N_0 \\cdot q^t", "q = 1 + \\dfrac{p}{100}"],
        solution: L(`$${A1} \\cdot ${tx(q1)}^t = ${A2} \\cdot ${tx(q2)}^t$`, `$\\left(\\dfrac{${tx(q1)}}{${tx(q2)}}\\right)^t = \\dfrac{${A2}}{${A1}}$`, `$t = \\dfrac{\\log ${A2} - \\log ${A1}}{\\log ${tx(q1)} - \\log ${tx(q2)}}$`, `$t ${ap(tt, 1)} ${tx(tt, 1)}$`),
      };
    }
    if (t === 2) {
      const [acc, gen, verb] = r.pick([["Čaj", "čaja", "bo imel"], ["Kavo", "kave", "bo imela"], ["Juho", "juhe", "bo imela"], ["Kakav", "kakava", "bo imel"]]);
      const Tz = r.pick([18, 20, 22, 24]);
      const T0 = r.pick([80, 85, 90, 95]);
      const p = r.pick([4, 5, 6, 8, 10]);
      let Tc;
      do Tc = r.int(6, 14) * 5;
      while (Tc <= Tz + 4 || Tc >= T0 - 9);
      const q = 1 - p / 100;
      const tt = lg((Tc - Tz) / (T0 - Tz)) / lg(q);
      const C = "\\ ^\\circ\\mathrm{C}";
      return {
        text: `${acc} s temperaturo $${T0}${C}$ postavimo v sobo s temperaturo $${Tz}${C}$. Razlika med temperaturo ${gen} in sobe se vsako minuto zmanjša za $${p}\\ \\%$. Po koliko minutah ${verb} $${Tc}${C}$? Zaokroži na eno decimalko.`,
        answer: num(tt, 1, [M(lg(Tc / T0) / lg(q), "Zmanjšuje se razlika do sobne temperature – najprej odštej temperaturo sobe."), M((T0 - Tc) / (((T0 - Tz) * p) / 100), "Ohlajanje ni enakomerno: vsako minuto se razlika zmanjša za isti odstotek trenutne razlike."), M(lg((Tc - Tz) / (T0 - Tz)) / lg(p / 100), "$q$ je delež, ki ostane, torej $1 - \\dfrac{p}{100}$.")], "min"),
        hint: "Za razliko temperatur zapiši $\\Delta T = \\Delta T_0 \\cdot q^t$ in logaritmiraj.",
        data: { given: [`T_0 = ${T0}${C}`, `T_s = ${Tz}${C}`, `p = ${p}\\ \\%`, `T = ${Tc}${C}`], find: ["t"] },
        formula: ["T - T_s = (T_0 - T_s) \\cdot q^t", "q = 1 - \\dfrac{p}{100}"],
        solution: L(`$${Tc} - ${Tz} = (${T0} - ${Tz}) \\cdot ${tx(q)}^t$`, `$${tx(q)}^t = \\dfrac{${Tc - Tz}}{${T0 - Tz}}$`, `$t = \\dfrac{\\log ${Tc - Tz} - \\log ${T0 - Tz}}{\\log ${tx(q)}} ${ap(tt, 1)} ${tx(tt, 1)}\\ \\mathrm{min}$`),
      };
    }
    const b = r.pick([2, 3]);
    let Mv;
    let N;
    do {
      Mv = r.int(3, 15);
      N = r.int(1, 6);
    } while (isPow(Mv, b) || Mv === N);
    const S = Mv - N;
    const P = Mv * N;
    const mid = `${S > 0 ? "-" : "+"} ${Math.abs(S) === 1 ? "" : `${Math.abs(S)} \\cdot `}${b}^x`;
    const E = `${b * b}^x ${mid} - ${P} = 0`;
    const x = lg(Mv) / lg(b);
    return {
      text: `Reši enačbo $${E}$. Rezultat zaokroži na dve decimalki.`,
      answer: num(x, 2, [M(Mv, "To je vrednost $t = b^x$; določi še $x$."), M(lg(Mv) / lg(b * b), `Uvedel si $t = ${b}^x$, zato $x$ dobiš iz $${b}^x = t$.`)]),
      hint: `Uvedi novo spremenljivko $t = ${b}^x$; tedaj je $${b * b}^x = t^2$.`,
      data: { given: [E], find: ["x"] },
      formula: [`t = ${b}^x, \\ ${b * b}^x = t^2`, LOGRULE],
      solution: L(`$${poly([1, -S, -P], "t")} = 0$`, `$(t - ${Mv})(t + ${N}) = 0$`, `$t = -${N}$ ne pride v poštev, ker je $${b}^x > 0$`, `$${b}^x = ${Mv} \\Rightarrow x = \\dfrac{\\log ${Mv}}{\\log ${b}} ${ap(x, 2)} ${tx(x, 2)}$`),
    };
  },
};

// ================= logaritemska funkcija in enačbe =================
const DB = "$L = 10 \\log \\dfrac{I}{I_0}\\ \\mathrm{dB}$";
const LOGA = {
  id: "gim-logaritemska-dop",
  topics: [T("logaritemska-funkcija-in-enacbe")],
  gen(level, r) {
    if (level === 1) {
      const t = r.int(0, 2);
      if (t === 0) {
        const kind = r.int(0, 2);
        if (kind === 0) {
          let x;
          let k;
          do {
            x = r.int(2, 6);
            k = r.int(2, 4);
          } while (x ** k > 1300 || (x === 2 && k === 2));
          const N = x ** k;
          const E = `\\log_x ${N} = ${k}`;
          const ms = [M(N / k, "$\\log_x N = k$ pomeni $x^k = N$, ne $x \\cdot k = N$.")];
          if (k !== 2) ms.push(M(Math.sqrt(N), `Eksponent je $${k}$, zato potrebuješ ${k === 3 ? "tretji" : "četrti"} koren.`));
          return {
            text: r.pick([`Reši enačbo $${E}$.`, `Za katero osnovo $x$ velja $${E}$?`]),
            answer: num(x, null, ms),
            hint: "Zapiši enačbo v eksponentni obliki.",
            data: { given: [E], find: ["x"] },
            formula: "\\log_x N = k \\iff x^k = N",
            solution: L(`$x^{${k}} = ${N}$`, `$x = ${rt(k, N)} = ${x}$`),
          };
        }
        if (kind === 1) {
          const s = r.int(2, 5);
          const x = s * s;
          const N = s ** 3;
          const E = `\\log_x ${N} = \\dfrac{3}{2}`;
          return {
            text: r.pick([`Reši enačbo $${E}$.`, `Za katero osnovo $x$ velja $${E}$?`]),
            answer: num(x, null, [M(s, "Iz $x^{3/2} = N$ sledi $x = N^{2/3}$, ne $N^{1/3}$."), M((N * 2) / 3, "$\\log_x N = k$ pomeni $x^k = N$; potenciraj, ne množi.")]),
            hint: "Zapiši enačbo v eksponentni obliki, nato obe strani potenciraj z $\\dfrac{2}{3}$.",
            data: { given: [E], find: ["x"] },
            formula: ["\\log_x N = k \\iff x^k = N", "(x^{m})^{n} = x^{mn}"],
            solution: L(`$x^{3/2} = ${N}$`, `$x = ${N}^{2/3} = \\left(\\sqrt[3]{${N}}\\right)^2 = ${s}^2$`, `$x = ${x}$`),
          };
        }
        const x = r.int(2, 9);
        const k = x <= 5 ? r.pick([-1, -2]) : -1;
        const N = x ** -k;
        const E = `\\log_x \\dfrac{1}{${N}} = ${k}`;
        return {
          text: r.pick([`Reši enačbo $${E}$.`, `Za katero osnovo $x$ velja $${E}$?`]),
          answer: num(x, null, [M(-x, "Osnova logaritma je vedno pozitivna."), M(N, k === -2 ? "$x^{-2} = \\dfrac{1}{x^2}$: koreniti moraš še." : "Iz $x^{-1} = \\dfrac{1}{x}$ preberi $x$.")]),
          hint: "Zapiši enačbo v eksponentni obliki in uporabi $x^{-n} = \\dfrac{1}{x^n}$.",
          data: { given: [E], find: ["x"] },
          formula: ["\\log_x N = k \\iff x^k = N", "x^{-n} = \\dfrac{1}{x^n}"],
          solution: L(`$x^{${k}} = \\dfrac{1}{${N}}$`, k === -1 ? null : `$\\dfrac{1}{x^{${-k}}} = \\dfrac{1}{${N}} \\Rightarrow x^{${-k}} = ${N}$`, `$x = ${x}$`),
        };
      }
      if (t === 1) {
        const b = r.pick([2, 3, 5, 10]);
        let a;
        let c;
        do {
          a = nz(r, -5, 5);
          c = nz(r, -5, 5);
        } while (a === c);
        const f = `f(x) = ${LG(b, `(x ${sg(-a)})`)} ${sg(c)}`;
        return {
          text: `Katera premica je navpična asimptota grafa funkcije $${f}$?`,
          answer: pickAns(r, `x = ${a}`, [[`x = ${-a}`, "Argument $x - a$ je enak 0 pri $x = a$: pazi na predznak."], [`y = ${c}`, "Logaritemska funkcija nima vodoravne asimptote; člen $c$ premakne graf navzgor ali navzdol."], ["x = 0", "Vodoravni premik grafa premakne tudi asimptoto."]]),
          options_tex: true,
          hint: "Logaritem je definiran le za pozitiven argument. Kje je argument enak 0?",
          data: { given: [f], find: ["\\text{navpična asimptota}"] },
          formula: "\\log_b u \\text{ je definiran za } u > 0",
          solution: L(`Argument mora biti pozitiven: $x ${sg(-a)} > 0$, torej $x > ${a}$.`, `Navpična asimptota je premica $x = ${a}$.`),
        };
      }
      const b = r.pick([2, 3, 5, 10]);
      const k = r.int(0, 3);
      const a = nz(r, -5, 5);
      const x0 = b ** k - a;
      const c = nz(r, -4, 4);
      const f = `f(x) = ${LG(b, `(x ${sg(a)})`)} ${sg(c)}`;
      const ms = [M(k, "Ne pozabi na člen $c$ za logaritmom.")];
      if (x0 > 0) ms.push(M(lg(x0) / lg(b) + c, `Najprej izračunaj argument $x ${sg(a)}$.`));
      return {
        text: `Dana je funkcija $${f}$. Izračunaj $f(${x0})$.`,
        answer: num(k + c, null, ms),
        hint: "Vstavi $x$ in izračunaj argument logaritma; zapiši ga kot potenco osnove.",
        data: { given: [f], find: [`f(${x0})`] },
        formula: "\\log_b b^k = k",
        solution: L(`$f(${x0}) = ${LG(b, `(${x0} ${sg(a)})`)} ${sg(c)} = ${LG(b, b ** k)} ${sg(c)}$`, `$f(${x0}) = ${k} ${sg(c)} = ${k + c}$`),
      };
    }
    if (level === 2) {
      const t = r.int(0, 2);
      if (t === 0) {
        const b = r.pick([2, 3, 5, 10]);
        let m;
        let n;
        do {
          m = r.int(-2, 3);
          n = r.int(-2, 3);
        } while (m >= n || b ** Math.abs(m + n) > 1000 || b ** Math.abs(n) > 1000 || b ** Math.abs(m) > 1000);
        const S = m + n;
        const P = m * n;
        const lx = LG(b, "x");
        const E = `(${lx})^2${S ? ` ${S > 0 ? "-" : "+"} ${Math.abs(S) === 1 ? "" : Math.abs(S)}${lx}` : ""}${P ? ` ${sg(P)}` : ""} = 0`;
        const askP = r.next() < 0.5;
        const pw = (e) => (e >= 0 ? [b ** e, 1] : [1, b ** -e]);
        const [pn, pd] = askP ? pw(S) : pw(n);
        const val = (e) => ft(...pw(e));
        return {
          text: `Reši enačbo $${E}$. ${askP ? "Vpiši zmnožek obeh rešitev" : "Vpiši večjo rešitev"} (kot okrajšan ulomek ali celo število).`,
          answer: frA(pn, pd, askP ? [M(S, "To je vsota vrednosti $t = \\log_b x$; zmnožek rešitev je $b^{t_1 + t_2}$."), M(P, "To je zmnožek vrednosti $t$, ne rešitev $x$.")] : [M(n, "To je vrednost $t = \\log_b x$; rešitev je $x = b^t$.")]),
          hint: `Uvedi novo spremenljivko $t = ${lx}$.`,
          data: { given: [E], find: [askP ? "x_1 \\cdot x_2" : "x"] },
          formula: ["t = \\log_b x", "x = b^t"],
          solution: L(`$${poly([1, -S, P], "t")} = 0$`, `$${fac(m, "t")}${fac(n, "t")} = 0$, $t_1 = ${m}$, $t_2 = ${n}$`, `$x_1 = ${b}^{${m}} = ${val(m)}$, $x_2 = ${b}^{${n}} = ${val(n)}$`, askP ? `$x_1 \\cdot x_2 = ${b}^{${S}} = ${val(S)}$` : `Večja rešitev je $${val(n)}$.`),
        };
      }
      if (t === 1) {
        let b;
        let j;
        let s;
        do {
          b = r.pick([2, 3, 5]);
          j = r.pick([2, 3]);
          s = r.pick([1, 2]);
        } while (b ** (j * s) > 1000);
        const plus = r.next() < 0.6;
        const tv = j * s;
        const k = plus ? s * (j + 1) : s * (j - 1);
        const B = b ** j;
        const x = b ** tv;
        const E = `\\log_{${b}} x ${plus ? "+" : "-"} \\log_{${B}} x = ${k}`;
        const ms = [M(b ** k, `$\\log_{${B}} x$ ni enak $\\log_{${b}} x$.`), M(b ** (plus ? k / (1 + j) : k / (1 - j)), `$\\log_{${B}} x = \\dfrac{1}{${j}}\\log_{${b}} x$, ne $${j}\\log_{${b}} x$.`)];
        if (plus) ms.push(M(b ** (k / 2), "Logaritmov z različnima osnovama ne smeš kar sešteti."));
        return {
          text: `Reši enačbo $${E}$.`,
          answer: num(x, null, ms),
          hint: `Logaritem z osnovo $${B}$ zapiši z logaritmom z osnovo $${b}$.`,
          data: { given: [E], find: ["x"] },
          formula: ["\\log_a x = \\dfrac{\\log_b x}{\\log_b a}", "\\log_{b^j} x = \\dfrac{1}{j}\\log_b x"],
          solution: L(`$\\log_{${B}} x = \\dfrac{\\log_{${b}} x}{\\log_{${b}} ${B}} = \\dfrac{1}{${j}}\\log_{${b}} x$`, `$\\left(1 ${plus ? "+" : "-"} \\dfrac{1}{${j}}\\right)\\log_{${b}} x = ${k}$`, `$\\log_{${b}} x = ${tv}$`, `$x = ${b}^{${tv}} = ${x}$`),
        };
      }
      if (r.next() < 0.5) {
        const k = r.pick([2, 3, 4, 5, 8, 10, 20, 50, 100, 1000]);
        const dL = 10 * lg(k);
        return {
          text: `Raven zvoka je ${DB}. Za koliko decibelov se raven poveča, če se jakost zvoka $I$ poveča $${k}$-krat? Zaokroži na eno decimalko.`,
          answer: num(dL, 1, [M(lg(k), "Logaritem moraš še pomnožiti z 10."), M(10 * k, "Raven ni sorazmerna z jakostjo – je logaritem jakosti.")], "dB"),
          hint: "Zapiši razliko ravni in uporabi $\\log a - \\log b = \\log \\dfrac{a}{b}$.",
          data: { given: [`\\dfrac{I_2}{I_1} = ${k}`], find: ["\\Delta L"] },
          formula: ["L = 10 \\log \\dfrac{I}{I_0}", "\\log a - \\log b = \\log \\dfrac{a}{b}"],
          solution: L(`$\\Delta L = 10 \\log \\dfrac{I_2}{I_0} - 10 \\log \\dfrac{I_1}{I_0} = 10 \\log \\dfrac{I_2}{I_1}$`, `$\\Delta L = 10 \\log ${k} ${ap(dL, 1)} ${tx(dL, 1)}\\ \\mathrm{dB}$`),
        };
      }
      const dL = r.pick([3, 4, 5, 6, 7, 13, 15, 17, 25]);
      const fct = 10 ** (dL / 10);
      return {
        text: `Raven zvoka je ${DB}. Kolikokrat se poveča jakost zvoka $I$, če se raven poveča za $${dL}\\ \\mathrm{dB}$? Zaokroži na eno decimalko.`,
        answer: num(fct, 1, [M(dL / 10, "Iz logaritma preidi na potenco: $\\dfrac{I_2}{I_1} = 10^{\\Delta L/10}$."), M(dL, "Raven in jakost nista sorazmerni."), M(Math.E ** (dL / 10), "Logaritem v formuli je desetiški, ne naravni.")]),
        hint: "Zapiši razliko ravni z logaritmom razmerja jakosti, nato logaritem odpravi.",
        data: { given: [`\\Delta L = ${dL}\\ \\mathrm{dB}`], find: ["\\dfrac{I_2}{I_1}"] },
        formula: ["\\Delta L = 10 \\log \\dfrac{I_2}{I_1}", "\\log y = a \\iff y = 10^a"],
        solution: L(`$${dL} = 10 \\log \\dfrac{I_2}{I_1}$`, `$\\log \\dfrac{I_2}{I_1} = ${tx(dL / 10)}$`, `$\\dfrac{I_2}{I_1} = 10^{${tx(dL / 10)}} ${ap(fct, 1)} ${tx(fct, 1)}$`),
      };
    }
    const t = r.int(0, 3);
    if (t === 0) {
      let b;
      let m;
      do {
        b = r.pick([2, 3, 4, 5, 6, 7]);
        m = r.pick([2, 3]);
      } while (b ** m > 350);
      const R = ft(m * m + 1, m);
      const E = `\\log_{${b}} x + \\log_x ${b} = ${R}`;
      return {
        text: `Reši enačbo $${E}$. Vpiši večjo rešitev.`,
        answer: num(b ** m, null, [M(m, "To je vrednost $t = \\log_b x$; rešitev je $x = b^t$."), M(b ** (1 / m), "To je manjša rešitev."), M(b ** ((m * m + 1) / (2 * m)), "$\\log_x b$ ni enak $\\log_b x$, temveč njegovi obratni vrednosti.")]),
        hint: `Uvedi $t = \\log_{${b}} x$ in izrazi $\\log_x ${b}$ s $t$.`,
        data: { given: [E], find: ["x"] },
        formula: ["\\log_x b = \\dfrac{1}{\\log_b x}"],
        solution: L(`$t = \\log_{${b}} x$, $\\log_x ${b} = \\dfrac{1}{t}$`, `$t + \\dfrac{1}{t} = ${R} \\ / \\cdot ${m}t$`, `$${m}t^2 - ${m * m + 1}t + ${m} = 0$`, `$t_1 = ${m}$, $t_2 = \\dfrac{1}{${m}}$`, `$x_1 = ${b}^{${m}} = ${b ** m}$, $x_2 = ${rt(m, b)}${Math.round(b ** (1 / m)) ** m === b ? ` = ${Math.round(b ** (1 / m))}` : ""}$; večja je $${b ** m}$`),
      };
    }
    if (t === 1) {
      const b = r.pick([2, 3]);
      let k;
      let j;
      do {
        k = r.int(1, b === 2 ? 4 : 3);
        j = r.int(1, k);
      } while (2 * j <= k);
      const A = b ** j - b ** (k - j);
      const E = `\\log_{${b}}(${b}^x - ${A}) = ${k} - x`;
      return {
        text: `Reši enačbo $${E}$.`,
        answer: num(j, null, [M(b ** j, "To je vrednost $t = b^x$; določi še $x$."), M(k - j, "To je eksponent desne strani; iščeš pa $x$.")]),
        hint: `Zapiši enačbo v eksponentni obliki in uvedi $t = ${b}^x$.`,
        data: { given: [E], find: ["x"] },
        formula: ["\\log_b u = v \\iff u = b^v", "b^{k - x} = \\dfrac{b^k}{b^x}"],
        solution: L(`$${b}^x - ${A} = ${b}^{${k} - x} = \\dfrac{${b ** k}}{${b}^x}$`, `$t = ${b}^x$: $${poly([1, -A, -(b ** k)], "t")} = 0$`, `$(t - ${b ** j})(t + ${b ** (k - j)}) = 0$; $t = -${b ** (k - j)}$ ne pride v poštev`, `$${b}^x = ${b ** j} \\Rightarrow x = ${j}$ (argument $${b ** j} - ${A} = ${b ** (k - j)} > 0$)`),
      };
    }
    if (t === 2) {
      const L1 = r.int(55, 80);
      const n = r.pick([5, 6, 8, 10, 12, 15, 20]);
      const Ln = L1 + 10 * lg(n);
      if (r.next() < 0.5) {
        return {
          text: `Raven zvoka je ${DB}. En zvočnik ustvari raven $${L1}\\ \\mathrm{dB}$. Kolikšna je raven, če hkrati igra $${n}$ enakih zvočnikov (jakosti se seštejejo)? Zaokroži na eno decimalko.`,
          answer: num(Ln, 1, [M(n * L1, "Ravni v decibelih se ne seštevajo – seštevajo se jakosti."), M(L1 + lg(n), "$10 \\log(nI) = 10 \\log n + 10 \\log I$: tudi $\\log n$ pomnoži z 10.")], "dB"),
          hint: `Skupna jakost je $${n}$-kratnik jakosti enega zvočnika. Uporabi $\\log(ab) = \\log a + \\log b$.`,
          data: { given: [`L_1 = ${L1}\\ \\mathrm{dB}`, `n = ${n}`], find: ["L"] },
          formula: ["L = 10 \\log \\dfrac{I}{I_0}", "\\log(ab) = \\log a + \\log b"],
          solution: L(`$L = 10 \\log \\dfrac{${n} I_1}{I_0} = 10 \\log ${n} + 10 \\log \\dfrac{I_1}{I_0}$`, `$L = 10 \\log ${n} + ${L1} ${ap(Ln, 1)} ${tx(Ln, 1)}\\ \\mathrm{dB}$`),
        };
      }
      const Lr = roundHalfUp(Ln, 1);
      const nn = 10 ** ((Lr - L1) / 10);
      return {
        text: `Raven zvoka je ${DB}. En zvočnik ustvari raven $${L1}\\ \\mathrm{dB}$. Več enakih zvočnikov hkrati ustvari raven $${tx(Lr)}\\ \\mathrm{dB}$ (jakosti se seštejejo). Koliko zvočnikov igra? Rezultat zaokroži na celo število.`,
        answer: num(nn, 0, [M(Lr - L1, "To je razlika ravni; razmerje jakosti je $10^{\\Delta L/10}$."), M(Lr / L1, "Ravni v decibelih se ne delijo – iz razlike ravni izračunaj razmerje jakosti.")]),
        hint: "Razlika ravni je $10 \\log n$, kjer je $n$ razmerje jakosti.",
        data: { given: [`L_1 = ${L1}\\ \\mathrm{dB}`, `L = ${tx(Lr)}\\ \\mathrm{dB}`], find: ["n"] },
        formula: ["L - L_1 = 10 \\log n", "\\log n = a \\iff n = 10^a"],
        solution: L(`$${tx(Lr)} - ${L1} = 10 \\log n$`, `$\\log n = ${tx((Lr - L1) / 10)}$`, `$n = 10^{${tx((Lr - L1) / 10)}} \\approx ${tx(nn, 2)}$, torej $${Math.round(nn)}$ zvočnikov`),
      };
    }
    const p1 = r.int(20, 60) / 10;
    const dlt = r.pick([0.3, 0.5, 0.7, 1, 1.2, 1.5, 2, 2.5, 3]);
    const p2 = roundHalfUp(p1 + dlt, 1);
    const dd = roundHalfUp(p2 - p1, 1);
    const ratio = 10 ** dd;
    return {
      text: `Raztopina A ima $\\mathrm{pH} = ${tx(p1)}$, raztopina B pa $\\mathrm{pH} = ${tx(p2)}$. Kolikokrat večja je koncentracija oksonijevih ionov v raztopini A kot v B? Velja $\\mathrm{pH} = -\\log [\\mathrm{H_3O^+}]$. Zaokroži na eno decimalko.`,
      answer: num(ratio, 1, [M(dd, "Razlika pH je logaritem razmerja koncentracij; razmerje je $10^{\\Delta \\mathrm{pH}}$."), M(p2 / p1, "pH je logaritemska lestvica, zato razmerje koncentracij ni razmerje vrednosti pH."), M(10 ** -dd, "Raztopina z manjšim pH ima večjo koncentracijo.")]),
      hint: "Izrazi obe koncentraciji kot potenci števila 10 in ju deli.",
      data: { given: [`\\mathrm{pH}_A = ${tx(p1)}`, `\\mathrm{pH}_B = ${tx(p2)}`], find: ["\\dfrac{c_A}{c_B}"] },
      formula: ["[\\mathrm{H_3O^+}] = 10^{-\\mathrm{pH}}", "\\dfrac{c_A}{c_B} = 10^{\\mathrm{pH}_B - \\mathrm{pH}_A}"],
      solution: L(`$c_A = 10^{-${tx(p1)}}$, $c_B = 10^{-${tx(p2)}}$`, `$\\dfrac{c_A}{c_B} = 10^{${tx(p2)} - ${tx(p1)}} = 10^{${tx(dd)}}$`, `$\\dfrac{c_A}{c_B} ${ap(ratio, 1)} ${tx(ratio, 1)}$`),
    };
  },
};

export const GIMNAZIJA_MAT_SS2 = wrapGens([KORENI, KOMPLEKSNA, KVFUN, KVENA, EKSP, LOGA]);
