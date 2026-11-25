// Gimnazija: drugi tip naloge za teme mat-ss4, ki so imele en sam generator (j, 2026-11-25).
// Prvi generatorji teh tem (dod-mat-ss34-*) računajo »naprej«; tukaj so obratna vprašanja,
// besedilne naloge v realnem kontekstu, pojmovne izbire in večkoračne maturitetne naloge.
// Merila: docs/kakovost.md §2. Vsi odgovori so izračunani iz istih števil, ki jih vidi dijak.
import { g, nOf, verbOf } from "../rng.js";
import { roundHalfUp } from "../check.js";
import { tx } from "./mat.js";
import { fr, num, frA, ft, sg, pickAns, name, wrapGens } from "./matura-util.js";

const T = (s) => `MAT-SS-4/${s}`;

// ---------- pomožne funkcije ----------
// Negativno število v oklepaju: pt(-3) → "(-3)".
const pt = (x) => (x < 0 ? `(${tx(x)})` : tx(x));
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
// Člen s koeficientom: tm(-1, "x") → "- x", tm(3, "x", true) → "3x".
const tm = (c, v, first = false) => `${c < 0 ? (first ? "-" : "- ") : first ? "" : "+ "}${Math.abs(c) === 1 ? "" : tx(Math.abs(c))}${v}`;
// Linearni izraz a·v + b.
const le = (a, b, v = "x") => (a === 0 ? `${b}` : `${tm(a, v, true)}${b ? ` ${sg(b)}` : ""}`);
const ev = (cs, x) => cs.reduce((acc, c) => acc * x + c, 0);
const der = (cs) => cs.slice(0, -1).map((c, i) => c * (cs.length - 1 - i));
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const C = (n, k) => (k < 0 || k > n ? 0 : Math.round(fact(n) / (fact(k) * fact(n - k))));
const V = (n, k) => (k < 0 || k > n ? 0 : Math.round(fact(n) / fact(n - k)));
const ap = (x, d) => (Math.abs(roundHalfUp(x, d) - x) < 1e-9 ? "=" : "\\approx");
const txr = (x, d) => tx(roundHalfUp(x, d));
// Koeficient pred izrazom: 1 → "", -1 → "-", sicer število.
const cf = (c) => (c === 1 ? "" : c === -1 ? "-" : tx(c));
// Ulomek kot koeficient: cfr(2, 2) → "", cfr(3, 2) → "\frac{3}{2}".
const cfr = (n, d) => {
  const [a, b] = fr(n, d);
  return a === b ? "" : a === -b ? "-" : ft(a, b);
};
// Število z besedo v $…$: nw(3, "juha", "juhi", "juhe", "juh") → "$3$ juhe".
function nw(n, a, b, c, d) {
  const s = nOf(n, a, b, c, d);
  const i = s.indexOf(" ");
  return `$${s.slice(0, i)}$${s.slice(i)}`;
}
const ek = (k) => `e^{${k === 1 ? "" : k === -1 ? "-" : k}x}`;
// Ulomki kot pari [števec, imenovalec].
const fsub = ([a, b], [c, d]) => fr(a * d - c * b, b * d);
const fdiv = ([a, b], [c, d]) => fr(a * d, b * c);
const ftp = (p) => ft(p[0], p[1]);
const eurA = (value, mistakes) => ({ ...num(value, 0, mistakes, "€"), unitAlternatives: ["eur", "evrov", "evra"] });

// ---------- zaporedja: vrsta zaporedja po splošnem členu ----------
const SEQ_OPTS = ["aritmetično", "geometrijsko", "aritmetično in geometrijsko", "ni ne aritmetično ne geometrijsko"];
function seqItem(r) {
  const k = r.int(0, 9);
  if (k === 0) {
    const p = r.nonZero(-5, 6);
    let b;
    do b = r.int(-9, 9);
    while ([1, 2, 3].some((n) => p * n + b === 0));
    return { tex: le(p, b, "n"), f: (n) => [p * n + b, 1], cls: 0, proof: `a_{n+1} - a_n = ${p}` };
  }
  if (k === 1) {
    const d = r.int(2, 4);
    const b = r.int(1, 5);
    return { tex: `\\dfrac{n ${sg(b)}}{${d}}`, f: (n) => [n + b, d], cls: 0, proof: `a_{n+1} - a_n = \\frac{1}{${d}}` };
  }
  if (k === 2) {
    const c = r.pick([1, 2, 3, 4, 5, -2, -3]);
    const q = r.pick([2, 3, -2, 5]);
    return { tex: `${c === 1 ? "" : `${c} \\cdot `}${pt(q)}^n`, f: (n) => [c * q ** n, 1], cls: 1, proof: `a_{n+1} : a_n = ${q}` };
  }
  if (k === 3) {
    const c = r.int(1, 9);
    const d = r.int(2, 3);
    return { tex: `\\dfrac{${c}}{${d}^n}`, f: (n) => [c, d ** n], cls: 1, proof: `a_{n+1} : a_n = \\frac{1}{${d}}` };
  }
  if (k === 4) {
    const b = r.int(2, 5);
    const e = r.int(1, 2);
    return { tex: `${b}^{n + ${e}}`, f: (n) => [b ** (n + e), 1], cls: 1, proof: `a_{n+1} : a_n = ${b}` };
  }
  if (k === 5) {
    const b = r.int(0, 5);
    return { tex: `n^2${b ? ` + ${b}` : ""}`, f: (n) => [n * n + b, 1], cls: 3 };
  }
  if (k === 6) {
    const b = r.int(2, 3);
    const c = r.int(1, 4);
    return { tex: `${b}^n + ${c}`, f: (n) => [b ** n + c, 1], cls: 3 };
  }
  if (k === 7) {
    const c = r.int(1, 6);
    return { tex: `\\dfrac{${c}}{n}`, f: (n) => [c, n], cls: 3 };
  }
  if (k === 8) {
    const c = r.int(1, 4);
    return { tex: `(-1)^n \\cdot ${c === 1 ? "" : c}n`, f: (n) => [(-1) ** n * c * n, 1], cls: 3 };
  }
  const c = r.nonZero(-9, 9);
  return { tex: `${c}`, f: () => [c, 1], cls: 2, proof: "a_{n+1} - a_n = 0,\\ a_{n+1} : a_n = 1" };
}

// ---------- geometrijska vrsta ----------
const QL = [[1, 2], [1, 3], [1, 4], [2, 3], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [-1, 2], [-1, 3], [-1, 4], [-2, 3], [-1, 5], [-3, 4]];
const DIV = [[3, 2], [-1, 1], [1, 1], [-4, 3], [2, 1], [5, 4], [-3, 2]];
// Prvi trije členi vrste in nadaljevanje: 4 + 2 + 1 + …
function serTex(a1, qn, qd) {
  const ts = [0, 1, 2, 3].map((k) => fr(a1 * qn ** k, qd ** k));
  let s = ft(ts[0][0], ts[0][1]);
  for (const [n, d] of ts.slice(1, 3)) s += ` ${n < 0 ? "-" : "+"} ${ft(Math.abs(n), d)}`;
  return `${s} ${ts[3][0] < 0 ? "-" : "+"} \\ldots`;
}
// Pari (s, vsota kvadratov) s celimi vrednostmi za obratno nalogo.
const ST = [];
for (const [qn, qd] of QL) {
  for (let a1 = 1; a1 <= 15; a1++) {
    const [sn, sd] = fr(a1 * qd, qd - qn);
    const [tn, td] = fr(a1 * a1 * qd * qd, qd * qd - qn * qn);
    if (sd === 1 && td === 1 && tn <= 400) ST.push([a1, qn, qd, sn, tn]);
  }
}

// ---------- odvod: prepoznaj odvod ----------
const DER_ITEMS = [
  ["xe^x", "(x + 1)e^x", [["e^x", "Odvod produkta ni produkt odvodov: $(uv)' = u'v + uv'$."], ["xe^x", "Odvajati moraš tudi faktor $x$."], ["xe^{x - 1}", "Pravilo za potenco velja za $x^n$, ne za $e^x$."]], "(uv)' = u'v + uv'"],
  ["\\sin 2x", "2\\cos 2x", [["\\cos 2x", "Pomnoži še z odvodom notranje funkcije $2x$."], ["-2\\cos 2x", "Odvod sinusa je kosinus brez minusa."], ["2\\cos x", "Argument kosinusa ostane $2x$."]], "(\\sin u)' = u'\\cos u"],
  ["\\ln(3x),\\ x > 0", "\\dfrac{1}{x}", [["\\dfrac{3}{x}", "Notranji odvod 3 se pokrajša s 3 v imenovalcu."], ["\\dfrac{1}{3x}", "Pomnoži še z notranjim odvodom."], ["\\dfrac{1}{3}", "Pri logaritmu je $(\\ln u)' = \\frac{u'}{u}$; odvod ni konstanta."]], "(\\ln u)' = \\dfrac{u'}{u}"],
  ["e^{x^2}", "2xe^{x^2}", [["e^{x^2}", "Pomnoži še z odvodom eksponenta $x^2$."], ["x^2e^{x^2 - 1}", "Pravilo za potenco tu ne velja: spremenljivka je v eksponentu."], ["2xe^{2x}", "Eksponent ostane $x^2$; z njegovim odvodom le pomnožiš."]], "(e^u)' = u'e^u"],
  ["x^2\\sin x", "2x\\sin x + x^2\\cos x", [["2x\\cos x", "Odvod produkta ni produkt odvodov."], ["2x\\sin x - x^2\\cos x", "Odvod sinusa je $+\\cos x$."], ["2x\\sin x", "Odvajati moraš tudi drugi faktor."]], "(uv)' = u'v + uv'"],
  ["\\dfrac{1}{x^3}", "-\\dfrac{3}{x^4}", [["\\dfrac{1}{3x^2}", "Odvod ulomka ni ulomek z odvodom v imenovalcu; zapiši $x^{-3}$."], ["-\\dfrac{3}{x^2}", "Eksponent $-3$ se zmanjša za 1, ne poveča."], ["\\dfrac{3}{x^4}", "Eksponent $-3$ prepišeš kot faktor, skupaj z minusom."]], "(x^n)' = nx^{n-1}"],
  ["\\sqrt{x}", "\\dfrac{1}{2\\sqrt{x}}", [["\\dfrac{1}{\\sqrt{x}}", "Manjka faktor $\\frac{1}{2}$ iz eksponenta."], ["\\dfrac{2}{3}x\\sqrt{x}", "To je nedoločeni integral, ne odvod."], ["\\dfrac{\\sqrt{x}}{2}", "Eksponent $\\frac{1}{2}$ se zmanjša za 1."]], "(x^n)' = nx^{n-1}"],
  ["\\cos^2 x", "-2\\sin x\\cos x", [["2\\cos x", "Pomnoži še z odvodom notranje funkcije $\\cos x$."], ["-\\sin^2 x", "Najprej odvajaš kvadrat, nato pomnožiš z notranjim odvodom."], ["2\\sin x\\cos x", "Odvod kosinusa je $-\\sin x$."]], "(u^2)' = 2uu'"],
  ["\\dfrac{x}{x + 1}", "\\dfrac{1}{(x + 1)^2}", [["1", "Odvod količnika ni količnik odvodov."], ["-\\dfrac{1}{(x + 1)^2}", "V števcu je $u'v - uv'$: vrstni red je pomemben."], ["\\dfrac{2x + 1}{(x + 1)^2}", "V števcu je razlika $u'v - uv'$, ne vsota."]], "\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^2}"],
  ["\\tan x", "\\dfrac{1}{\\cos^2 x}", [["\\dfrac{1}{\\sin^2 x}", "Zamenjal si z odvodom kotangensa (ta ima še minus)."], ["-\\dfrac{1}{\\cos^2 x}", "Tangens je naraščajoča funkcija, zato je odvod pozitiven."], ["\\dfrac{1}{\\cos x}", "Po pravilu za količnik je v imenovalcu $\\cos^2 x$."]], "(\\tan x)' = \\dfrac{1}{\\cos^2 x}"],
];

// ---------- nedoločeni integral: kaj ni primitivna funkcija ----------
const NOT_F = [
  { f: "2x", ok: ["x^2 + 3", "x^2 - 7", "x^2 + \\pi", "x^2"], bad: [["(x + 1)^2", "2x + 2"], ["2x^2", "4x"], ["x^2 + x", "2x + 1"]] },
  { f: "\\cos x", ok: ["\\sin x + 2", "\\sin x - 1", "\\sin x + \\sqrt{2}", "\\sin x"], bad: [["\\sin x + x", "\\cos x + 1"], ["-\\sin x", "-\\cos x"], ["\\sin(x + 1)", "\\cos(x + 1)"]] },
  { f: "e^x", ok: ["e^x + 1", "e^x - 4", "e^x + e", "e^x"], bad: [["e^{x + 1}", "e^{x + 1}"], ["2e^x", "2e^x"], ["e^x + x", "e^x + 1"]] },
  { f: "\\dfrac{1}{x}", cond: " za $x > 0$", ok: ["\\ln x + 2", "\\ln(5x)", "\\ln x - 3", "\\ln(e^2x)"], bad: [["\\ln(x + 5)", "\\dfrac{1}{x + 5}"], ["\\ln(x^2)", "\\dfrac{2}{x}"], ["-\\dfrac{1}{x^2}", "\\dfrac{2}{x^3}"]] },
  { f: "2\\sin x\\cos x", ok: ["\\sin^2 x", "-\\cos^2 x", "\\sin^2 x + 4", "1 - \\cos^2 x"], bad: [["\\cos^2 x", "-2\\sin x\\cos x"], ["2\\sin x", "2\\cos x"], ["\\sin x\\cos x", "\\cos^2 x - \\sin^2 x"]] },
  { f: "3x^2", ok: ["x^3 + 1", "x^3 - 2", "x^3 + \\dfrac{1}{2}", "x^3"], bad: [["(x + 1)^3", "3(x + 1)^2"], ["x^3 + x", "3x^2 + 1"], ["3x^3", "9x^2"]] },
];

// ---------- kombinatorika: katero pravilo ----------
const KOMB_OPTS = ["permutacije", "variacije brez ponavljanja", "variacije s ponavljanjem", "kombinacije"];
const KOMB_WHY = [
  [null, "Razporejamo vse elemente, ne le nekaterih.", "Vsak element nastopi natanko enkrat, ponavljanja ni.", "Vrstni red (mesto) je tu pomemben."],
  ["Ne razporejamo vseh elementov, izberemo le nekatere.", null, "Isti element ne more biti izbran dvakrat.", "Vrstni red (vloga, mesto) je pomemben."],
  ["Elementi se lahko ponavljajo; ne razporejamo danih elementov.", "Elementi se lahko ponavljajo.", null, "Vrstni red je pomemben in ponavljanje je dovoljeno."],
  ["Ne razporejamo vseh, le izberemo podmnožico.", "Vrstni red izbranih ni pomemben: zamenjava ne da novega izbora.", "Isti element ne more biti izbran dvakrat, vrstni red ni pomemben.", null],
];
const KOMB_REASON = [
  "Razporedimo vse elemente; vrstni red je pomemben, ponavljanja ni.",
  "Izberemo le nekatere elemente; vrstni red (vloga, mesto) je pomemben, ponavljanja ni.",
  "Na vsakem mestu izbiramo znova med vsemi možnostmi: vrstni red je pomemben, ponavljanje je dovoljeno.",
  "Izberemo nekaj elementov; vrstni red ni pomemben, ponavljanja ni.",
];
function kombSituation(r) {
  const cls = r.int(0, 3);
  const v = r.int(0, 2);
  if (cls === 0) {
    const n = r.int(5, 9);
    if (v === 0) return [cls, `Na koliko načinov lahko $${n}$ tekačev pride v cilj (vsi pritečejo do cilja, ni mrtvih tekov)?`, n];
    if (v === 1) return [cls, `Na koliko načinov lahko na polico postavimo $${n}$ različnih knjig?`, n];
    return [cls, `Na koliko načinov se $${n}$ prijateljev lahko posede na $${n}$ stolov v vrsti?`, n];
  }
  if (cls === 1) {
    const n = r.int(12, 30);
    if (v === 0) return [cls, `Razred, v katerem je $${n}$ dijakov, izbira predsednika, tajnika in blagajnika. Na koliko načinov lahko izbere?`, n];
    if (v === 1) return [cls, `Na tekmi nastopa $${n}$ tekmovalcev. Na koliko načinov lahko podelijo zlato, srebrno in bronasto medaljo?`, n];
    return [cls, `Na seznamu je $${n}$ filmov. Na koliko načinov lahko izberemo tri in jih gledamo enega za drugim?`, n];
  }
  if (cls === 2) {
    const n = r.int(5, 8);
    if (v === 0) return [cls, `Koliko je $${n}$-mestnih kod PIN iz števk od 0 do 9 (števke se lahko ponavljajo)?`, n];
    if (v === 1) return [cls, `Test ima $${n}$ vprašanj, na vsako odgovorimo z DA ali NE. Na koliko načinov lahko izpolnimo test?`, n];
    return [cls, `Kocko vržemo $${n}$-krat in zapišemo zaporedje padlih pik. Koliko je možnih zaporedij?`, n];
  }
  const n = r.int(7, 25);
  if (v === 0) return [cls, `Iz skupine $${n}$ dijakov izberemo tri za dežurstvo. Na koliko načinov lahko izberemo?`, n];
  if (v === 1) return [cls, `Na zabavi se vsak od $${n}$ gostov rokuje z vsakim drugim. Koliko je rokovanj?`, n];
  return [cls, `Iz $${n}$ različnih vrst sadja izberemo štiri za sadno solato. Na koliko načinov lahko izberemo?`, n];
}

const GENS = [
  // ================= aritmetično in geometrijsko zaporedje =================
  {
    id: "gim-ar-geo-zaporedje-dop",
    topics: [T("aritmeticno-in-geometrijsko-zaporedje")],
    gen(level, r) {
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const a1 = r.int(-8, 15);
          const d = r.nonZero(-4, 6);
          const n = r.int(8, 40);
          const X = a1 + (n - 1) * d;
          const [a2, a3] = [a1 + d, a1 + 2 * d];
          const ms = [{ value: n - 1, why: "Količnik $\\frac{a_n - a_1}{d}$ šteje korake med členi; členov je en več." }];
          if (X % d === 0 && X / d > 0) ms.push({ value: X / d, why: "Od zadnjega člena najprej odštej prvi člen." });
          return {
            text: `Koliko členov ima končno aritmetično zaporedje $${a1}, ${a2}, ${a3}, \\ldots, ${X}$?`,
            answer: num(n, null, ms),
            hint: "Iz prvih dveh členov določi diferenco, nato zadnji člen vstavi v formulo za splošni člen in izrazi $n$.",
            data: { given: [`a_1 = ${a1}`, `a_2 = ${a2}`, `a_n = ${X}`], find: ["n"] },
            formula: "a_n = a_1 + (n - 1)d",
            solution: `$d = ${a2} - ${pt(a1)} = ${d}$\n$${X} = ${a1} + (n - 1) \\cdot ${pt(d)}$\n$n - 1 = \\dfrac{${X} - ${pt(a1)}}{${d}} = ${n - 1}$\n$n = ${n}$`,
          };
        }
        if (t === 1) {
          if (r.next() < 0.5) {
            const p = r.int(-10, 20);
            const d = r.nonZero(-9, 12);
            const q = p + 2 * d;
            const x = p + d;
            return {
              text: `Števila $${p}$, $x$ in $${q}$ so trije zaporedni členi aritmetičnega zaporedja. Izračunaj $x$.`,
              answer: num(x, null, [{ value: (q - p) / 2, why: "To je diferenca $d$, ne srednji člen." }, { value: p + q, why: "Vsoto sosednjih členov moraš še deliti z 2." }]),
              hint: "Razlika med $x$ in prvim številom je enaka razliki med tretjim številom in $x$.",
              data: { given: [`a_1 = ${p}`, `a_3 = ${q}`], find: ["x"] },
              formula: "a_2 = \\dfrac{a_1 + a_3}{2}",
              solution: `$x - ${pt(p)} = ${q} - x$\n$2x = ${p} + ${pt(q)} = ${p + q}$\n$x = ${x}$`,
            };
          }
          const a = r.int(1, 6);
          const s = r.int(2, 5);
          const [p, q, x] = [a, a * s * s, a * s];
          return {
            text: `Pozitivna števila $${p}$, $x$ in $${q}$ so trije zaporedni členi geometrijskega zaporedja. Izračunaj $x$.`,
            answer: num(x, null, [{ value: (p + q) / 2, why: "To je aritmetična sredina; pri geometrijskem zaporedju je srednji člen geometrijska sredina." }, { value: p * q, why: "Iz $x^2 = a_1 a_3$ moraš še koreniti." }]),
            hint: "V geometrijskem zaporedju sta količnika $\\frac{x}{a_1}$ in $\\frac{a_3}{x}$ enaka.",
            data: { given: [`a_1 = ${p}`, `a_3 = ${q}`], find: ["x"] },
            formula: "a_2 = \\sqrt{a_1 a_3}",
            solution: `$\\dfrac{x}{${p}} = \\dfrac{${q}}{x}$\n$x^2 = ${p} \\cdot ${q} = ${p * q}$\n$x = \\sqrt{${p * q}} = ${x}$ (pozitivna rešitev)`,
          };
        }
        const it = seqItem(r);
        const v = [1, 2, 3].map((n) => fr(...it.f(n)));
        const [D1, D2] = [fsub(v[1], v[0]), fsub(v[2], v[1])];
        const [Q1, Q2] = [fdiv(v[1], v[0]), fdiv(v[2], v[1])];
        const dS = `$a_2 - a_1 = ${ftp(D1)}$, $a_3 - a_2 = ${ftp(D2)}$`;
        const qS = `$a_2 : a_1 = ${ftp(Q1)}$, $a_3 : a_2 = ${ftp(Q2)}$`;
        const WHY = [
          [null, `Količnika nista enaka: ${qS}.`, `Razlika je stalna, količnik pa ne: ${qS}.`, `Razlika zaporednih členov je stalna: $${it.proof}$.`],
          [`Razliki nista enaki: ${dS}.`, null, `Količnik je stalen, razlika pa ne: ${dS}.`, `Količnik zaporednih členov je stalen: $${it.proof}$.`],
          ["Res je aritmetično ($d = 0$), a hkrati je količnik stalen ($q = 1$).", "Res je geometrijsko ($q = 1$), a hkrati je razlika stalna ($d = 0$).", null, "Konstantno zaporedje ima stalno razliko $d = 0$ in stalen količnik $q = 1$."],
          [`Razliki nista enaki: ${dS}.`, `Količnika nista enaka: ${qS}.`, "Ni stalna ne razlika ne količnik zaporednih členov.", null],
        ][it.cls];
        const end = [
          `V splošnem je $${it.proof}$, zato je zaporedje aritmetično.`,
          `V splošnem je $${it.proof}$, zato je zaporedje geometrijsko.`,
          `Velja $${it.proof}$: zaporedje je hkrati aritmetično in geometrijsko.`,
          "Že prvi trije členi nimajo ne stalne razlike ne stalnega količnika: zaporedje ni ne aritmetično ne geometrijsko.",
        ][it.cls];
        return {
          text: `Zaporedje ima splošni člen $a_n = ${it.tex}$. Kakšno je to zaporedje?`,
          answer: pickAns(r, SEQ_OPTS[it.cls], SEQ_OPTS.map((o, i) => [o, WHY[i]]).filter((_, i) => i !== it.cls)),
          hint: "Izračunaj prve tri člene ter primerjaj razliki in količnika zaporednih členov.",
          data: { given: [`a_n = ${it.tex}`], find: ["\\text{vrsta zaporedja}"] },
          formula: ["a_{n+1} - a_n = d", "a_{n+1} : a_n = q"],
          solution: `$a_1 = ${ftp(v[0])}$, $a_2 = ${ftp(v[1])}$, $a_3 = ${ftp(v[2])}$\n${dS}\n${qS}\n${end}`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 3);
        if (t === 0) {
          const k = r.int(3, 9);
          let A = r.int(10, 60);
          while (A % k === 0) A++;
          let B = A + r.int(60, 200);
          while (B % k === 0) B++;
          const first = Math.ceil(A / k) * k;
          const last = Math.floor(B / k) * k;
          const n = (last - first) / k + 1;
          const S = (n * (first + last)) / 2;
          return {
            text: `Izračunaj vsoto vseh naravnih števil med $${A}$ in $${B}$, ki so deljiva ${k >= 8 ? "z" : "s"} $${k}$.`,
            answer: num(S, null, [{ value: ((n - 1) * (first + last)) / 2, why: "Število členov je $\\frac{a_n - a_1}{d} + 1$: ne pozabi prišteti 1." }, { value: n * (first + last), why: "V formuli za vsoto deliš z 2." }]),
            hint: "Poišči najmanjši in največji večkratnik na intervalu. Večkratniki tvorijo aritmetično zaporedje.",
            data: { given: [`\\text{spodnja meja} = ${A}`, `\\text{zgornja meja} = ${B}`, `d = ${k}`], find: ["s_n"] },
            formula: ["a_n = a_1 + (n - 1)d", "s_n = \\dfrac{n}{2}(a_1 + a_n)"],
            solution: `Prvi večkratnik: $a_1 = ${first}$, zadnji: $a_n = ${last}$, $d = ${k}$\n$n = \\dfrac{${last} - ${first}}{${k}} + 1 = ${n}$\n$s_{${n}} = \\dfrac{${n}}{2}(${first} + ${last}) = ${S}$`,
          };
        }
        if (t === 1) {
          if (r.next() < 0.5) {
            const p = r.int(-10, 20);
            const m = r.int(2, 7);
            const D = r.nonZero(-40, 60);
            const q = p + D;
            return {
              text: `Med števili $${p}$ in $${q}$ vstavi ${nw(m, "število", "števili", "števila", "števil")} tako, da skupaj z njima tvorijo aritmetično zaporedje. Kolikšna je diferenca? Vpiši ulomek ali celo število.`,
              answer: frA(D, m + 1, [{ value: D / m, why: "Med prvim in zadnjim členom je en korak diference več, kot je vstavljenih števil." }, { value: D / (m + 2), why: "Šteješ korake med členi, ne členov." }]),
              hint: "Koliko členov ima zaporedje skupaj? Zadnji člen zapiši s formulo za splošni člen.",
              data: { given: [`a_1 = ${p}`, `a_n = ${q}`, `\\text{vstavljenih} = ${m}`], find: ["d"] },
              formula: "a_n = a_1 + (n - 1)d",
              solution: `Členov je $${m} + 2 = ${m + 2}$, torej $a_{${m + 2}} = ${q}$.\n$${q} = ${p} + ${m + 1}d$\n$d = \\dfrac{${q} - ${pt(p)}}{${m + 1}} = ${ft(D, m + 1)}$`,
            };
          }
          const p = r.int(1, 5);
          const s = r.int(2, 3);
          const m = r.int(1, 3);
          const last = p * s ** (m + 1);
          const ratio = last / p;
          const rt = m + 1 === 2 ? `\\sqrt{${ratio}}` : `\\sqrt[${m + 1}]{${ratio}}`;
          return {
            text: `Med števili $${p}$ in $${last}$ vstavi $${m}$ ${m === 1 ? "pozitivno število" : m === 2 ? "pozitivni števili" : "pozitivna števila"} tako, da skupaj z njima tvorijo geometrijsko zaporedje. Kolikšen je kvocient?`,
            answer: num(s, null, [{ value: ratio / (m + 1), why: "Iz $q^{n-1} = \\frac{a_n}{a_1}$ moraš koreniti, ne deliti z eksponentom." }, { value: m === 1 ? ratio : Math.pow(ratio, 1 / m), why: "Korakov (množenj s $q$) je za ena več, kot je vstavljenih števil." }]),
            hint: "Koliko členov ima zaporedje skupaj? Zadnji člen zapiši s formulo $a_n = a_1q^{n-1}$.",
            data: { given: [`a_1 = ${p}`, `a_n = ${last}`, `\\text{vstavljenih} = ${m}`], find: ["q"] },
            formula: "a_n = a_1 q^{n-1}",
            solution: `Členov je $${m + 2}$: $a_{${m + 2}} = a_1 q^{${m + 1}}$\n$q^{${m + 1}} = \\dfrac{${last}}{${p}} = ${ratio}$\n$q = ${rt} = ${s}$`,
          };
        }
        if (t === 2) {
          if (r.next() < 0.5) {
            const who = name(r);
            const a1 = r.int(3, 10);
            const d = r.pick([0.5, 1, 1.5, 2]);
            const X = r.int(a1 + 6, 45);
            const steps = (X - a1) / d;
            const n = Math.floor((2 * (X - a1)) / (2 * d)) + 2;
            const stT = Number.isInteger(steps) ? `= ${steps}` : `\\approx ${tx(steps, 2)}`;
            return {
              text: `${who} prvi teden na treningu preteče $${a1}\\ \\mathrm{km}$, vsak naslednji teden pa $${tx(d)}\\ \\mathrm{km}$ več. V katerem tednu bo prvič ${g(who, "pretekel", "pretekla")} več kot $${X}\\ \\mathrm{km}$?`,
              answer: num(n, null, [{ value: n - 1, why: `V tem tednu razdalja še ne preseže meje; preveri neenačbo $a_n > ${X}$.` }]),
              hint: "Tedenske razdalje tvorijo aritmetično zaporedje. Reši neenačbo $a_n > X$ za naravno število $n$.",
              data: { given: [`a_1 = ${a1}\\ \\mathrm{km}`, `d = ${tx(d)}\\ \\mathrm{km}`, `X = ${X}\\ \\mathrm{km}`], find: ["n"] },
              formula: "a_n = a_1 + (n - 1)d > X",
              solution: `$${a1} + (n - 1) \\cdot ${tx(d)} > ${X}$\n$n - 1 > \\dfrac{${X} - ${a1}}{${tx(d)}} ${stT}$, torej je najmanjši $n - 1 = ${n - 1}$\nTo je ${n}. teden: $a_{${n}} = ${tx(a1 + (n - 1) * d)}\\ \\mathrm{km}$.`,
            };
          }
          const th = r.pick([0.1, 0.08, 0.05, 0.12]);
          const n = r.int(6, 10);
          const mm = th * 2 ** n;
          const cm = mm / 10;
          return {
            text: `List papirja je debel $${tx(th)}\\ \\mathrm{mm}$. Prepognemo ga na pol, nato še enkrat na pol in tako skupaj $${n}$-krat. Kako debel je zloženi papir v centimetrih? Zaokroži na dve decimalki.`,
            answer: num(cm, 2, [{ value: mm, why: "Rezultat pretvori iz milimetrov v centimetre." }, { value: (th * 2 * n) / 10, why: "Vsak pregib debelino podvoji (množenje), ne prišteje enake debeline." }, { value: (th * 2 ** (n - 1)) / 10, why: "Po vsakem od pregibov se debelina pomnoži z 2: preštej množenja." }], "cm"),
            hint: "Debeline po zaporednih pregibih tvorijo geometrijsko zaporedje s kvocientom 2.",
            data: { given: [`d_0 = ${tx(th)}\\ \\mathrm{mm}`, `n = ${n}`], find: ["d_n"] },
            formula: ["d_n = d_0 \\cdot 2^n", "1\\ \\mathrm{cm} = 10\\ \\mathrm{mm}"],
            solution: `Debeline tvorijo geometrijsko zaporedje s $q = 2$.\n$d_{${n}} = ${tx(th)} \\cdot 2^{${n}} = ${tx(mm)}\\ \\mathrm{mm}$\n$d_{${n}} ${ap(cm, 2)} ${txr(cm, 2)}\\ \\mathrm{cm}$`,
          };
        }
        const a1 = r.int(-6, 12);
        const d = r.nonZero(-4, 6);
        const n = r.int(8, 25);
        const S = (n * (2 * a1 + (n - 1) * d)) / 2;
        return {
          text: `Vsota prvih $${n}$ členov aritmetičnega zaporedja s prvim členom $${a1}$ je $${S}$. Izračunaj diferenco.`,
          answer: num(d, null, [{ value: (S - a1) / (n - 1), why: "$s_n$ je vsota, ne $n$-ti člen; uporabi formulo za vsoto." }, { value: (S / n - 2 * a1) / (n - 1), why: "V formuli za vsoto ne pozabi deliti z 2." }]),
          hint: "Znane količine vstavi v formulo za vsoto prvih $n$ členov in izrazi $d$.",
          data: { given: [`n = ${n}`, `a_1 = ${a1}`, `s_n = ${S}`], find: ["d"] },
          formula: "s_n = \\dfrac{n}{2}\\big(2a_1 + (n - 1)d\\big)",
          solution: `$${S} = \\dfrac{${n}}{2}(2 \\cdot ${pt(a1)} + ${n - 1}d)$\n$${(2 * S) / n} = ${2 * a1} + ${n - 1}d$\n$${n - 1}d = ${(2 * S) / n - 2 * a1}$, $d = ${d}$`,
        };
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const m = r.int(2, 9);
        const d = r.int(1, 7);
        if (d === m) return null;
        const S = 3 * m;
        const P = m * (m - d) * (m + d);
        return {
          text: `Tri števila tvorijo naraščajoče aritmetično zaporedje. Njihova vsota je $${S}$, produkt pa $${P}$. Katero je največje izmed njih?`,
          answer: num(m + d, null, [{ value: m, why: "To je srednje število; največje je za $d$ večje." }, { value: m - d, why: "Zaporedje je naraščajoče: največje je zadnje število." }]),
          hint: "Števila zapiši kot $a - d$, $a$ in $a + d$. Iz vsote takoj dobiš $a$.",
          data: { given: [`s = ${S}`, `P = ${P}`], find: ["a_3"] },
          formula: ["(a - d) + a + (a + d) = 3a", "(a - d)\\,a\\,(a + d) = a(a^2 - d^2)"],
          solution: `$3a = ${S}$, $a = ${m}$\n$${m}(${m * m} - d^2) = ${P}$, torej $${m * m} - d^2 = ${P / m}$\n$d^2 = ${d * d}$, $d = ${d}$ (zaporedje narašča)\nŠtevila so $${m - d}, ${m}, ${m + d}$; največje je $${m + d}$.`,
        };
      }
      if (t === 1) {
        const g1 = r.int(1, 6);
        const q = r.pick([2, 3, -2]);
        const x = r.nonZero(-5, 8);
        const [a, b, c] = [g1 - x, g1 * q - x, g1 * q * q - x];
        const term = (v) => (v === 0 ? "x" : `x ${sg(v)}`);
        const P = (v) => (v === 0 ? "x" : `(${term(v)})`);
        const cst = (v) => (v ? ` ${sg(v)}` : "");
        const askX = r.next() < 0.5;
        const k = 2 * b - a - c;
        const ms = askX
          ? [{ value: -x, why: "Pri prenašanju členov čez enačaj preveri predznake." }, { value: a + c !== 0 ? (a * c - b * b) / -(a + c) : NaN, why: "Kvadrat dvočlenika ima tudi srednji člen." }]
          : [{ value: 1 / q, why: "Kvocient je naslednji člen deljeno s prejšnjim, ne obratno." }, { value: g1 * q - g1, why: "To je razlika členov; pri geometrijskem zaporedju je stalen količnik." }];
        return {
          text: `Števila $${term(a)}$, $${term(b)}$ in $${term(c)}$ so v tem vrstnem redu zaporedni členi geometrijskega zaporedja. ${askX ? "Izračunaj $x$." : "Izračunaj kvocient tega zaporedja."}`,
          answer: num(askX ? x : q, null, ms),
          hint: "Za tri zaporedne člene geometrijskega zaporedja velja, da je kvadrat srednjega enak produktu sosednjih.",
          data: { given: [`a_1 = ${term(a)}`, `a_2 = ${term(b)}`, `a_3 = ${term(c)}`], find: [askX ? "x" : "q"] },
          formula: "a_2^2 = a_1 a_3",
          solution: `$${P(b)}^2 = ${P(a)}${P(c)}$\n$x^2${b ? ` ${tm(2 * b, "x")}` : ""}${cst(b * b)} = x^2${a + c ? ` ${tm(a + c, "x")}` : ""}${cst(a * c)}$\n$${tm(k, "x", true)} = ${a * c - b * b}$, $x = ${x}$${askX ? "" : `\nČleni so $${g1}, ${g1 * q}, ${g1 * q * q}$, kvocient $q = \\dfrac{${g1 * q}}{${g1}} = ${q}$.`}`,
        };
      }
      const who = name(r);
      const sA = r.int(20, 30) * 1000;
      const kA = r.int(6, 15) * 100;
      const sB = sA - r.int(1, 4) * 1000;
      const p = r.pick([3, 4, 5, 6]);
      const n = r.int(5, 15);
      const q = 1 + p / 100;
      const SA = (n * (2 * sA + (n - 1) * kA)) / 2;
      const SB = (sB * (q ** n - 1)) / (q - 1);
      const diff = Math.abs(SA - SB);
      if (diff < 50) return null;
      const SBlin = (n * (2 * sB + ((n - 1) * sB * p) / 100)) / 2;
      return {
        text: `${who} izbira med službama. A: začetna letna plača $${sA}\\ \\text{€}$, vsako leto višja za $${kA}\\ \\text{€}$. B: začetna letna plača $${sB}\\ \\text{€}$, vsako leto višja za $${p}\\ \\%$. Za koliko evrov je skupni zaslužek v prvih $${n}$ letih večji pri ugodnejši ponudbi? Zaokroži na cele evre.`,
        answer: eurA(diff, [{ value: Math.abs(sA + (n - 1) * kA - sB * q ** (n - 1)), why: "To je razlika plač v zadnjem letu, ne skupnih zaslužkov." }, { value: Math.abs(SA - SBlin), why: "Povišica za odstotek pomeni vsako leto množenje s $q$ (geometrijsko zaporedje), ne enakega prirastka." }]),
        hint: "Plače pri A tvorijo aritmetično, pri B geometrijsko zaporedje. Izračunaj obe vsoti in ju odštej.",
        data: { given: [`a_1 = ${sA}\\ \\text{€}`, `d = ${kA}\\ \\text{€}`, `b_1 = ${sB}\\ \\text{€}`, `p = ${p}\\ \\%`, `n = ${n}`], find: ["|s_A - s_B|"] },
        formula: ["s_n = \\dfrac{n}{2}\\big(2a_1 + (n - 1)d\\big)", "s_n = b_1\\dfrac{q^n - 1}{q - 1}"],
        solution: `A: $s_A = \\dfrac{${n}}{2}(2 \\cdot ${sA} + ${n - 1} \\cdot ${kA}) = ${SA}\\ \\text{€}$\nB: $q = ${tx(q)}$, $s_B = ${sB} \\cdot \\dfrac{${tx(q)}^{${n}} - 1}{${tx(q)} - 1} \\approx ${tx(SB, 2)}\\ \\text{€}$\nUgodnejša je ponudba ${SA > SB ? "A" : "B"}, razlika $${ap(diff, 0)} ${txr(diff, 0)}\\ \\text{€}$.`,
      };
    },
  },

  // ================= geometrijska vrsta =================
  {
    id: "gim-geometrijska-vrsta-dop",
    topics: [T("geometrijska-vrsta")],
    gen(level, r) {
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const [qn, qd] = r.pick(QL);
          const a1 = r.int(2, 20) * (r.next() < 0.2 ? -1 : 1);
          const dec = [2, 4, 5].includes(qd) && r.next() < 0.5;
          const qT = dec ? tx(qn / qd) : ft(qn, qd);
          const q = qn / qd;
          return {
            text: `Neskončna geometrijska vrsta ima prvi člen $${a1}$ in kvocient $${qT}$. Izračunaj njeno vsoto. Vpiši ulomek ali celo število.`,
            answer: frA(a1 * qd, qd - qn, [{ value: a1 / (1 + q), why: "V imenovalcu formule je $1 - q$; pazi na predznak kvocienta." }, { value: a1 * (1 - q), why: "Prvi člen deliš z $1 - q$, ne množiš." }, { value: (a1 * q) / (1 - q), why: "V števcu formule je prvi člen $a_1$, ne drugi." }]),
            hint: "Preveri, ali je $|q| < 1$, in uporabi formulo za vsoto neskončne geometrijske vrste.",
            data: { given: [`a_1 = ${a1}`, `q = ${qT}`], find: ["s"] },
            formula: "s = \\dfrac{a_1}{1 - q},\\ |q| < 1",
            solution: `$|q| < 1$, zato je vrsta konvergentna.\n$s = \\dfrac{${a1}}{1 - ${qn < 0 ? `\\left(${qT}\\right)` : qT}} = \\dfrac{${a1}}{${ft(qd - qn, qd)}}$\n$s = ${ft(a1 * qd, qd - qn)}$`,
          };
        }
        if (t === 1) {
          const [qn, qd] = r.pick(QL.filter(([n]) => Math.abs(n) <= 3));
          const [start, exp, E] = r.pick([[1, "n - 1", 0], [1, "n", 1], [0, "n", 0], [1, "n + 1", 2]]);
          const c = r.int(1, 12);
          const base = `${c === 1 ? "" : `${c} \\cdot `}\\left(${ft(qn, qd)}\\right)^{${exp}}`;
          const [an, ad] = fr(c * qn ** E, qd ** E);
          const q = qn / qd;
          return {
            text: `Izračunaj vsoto vrste $\\displaystyle\\sum_{n=${start}}^{\\infty} ${base}$. Vpiši ulomek ali celo število.`,
            answer: frA(an * qd, ad * (qd - qn), [
              E === 0 ? { value: (c * q) / (1 - q), why: `Prvi člen dobiš, ko vstaviš spodnjo mejo $n = ${start}$.` } : { value: c / (1 - q), why: `Prvi člen ni $${c}$: vstavi spodnjo mejo $n = ${start}$.` },
              { value: an / ad / (1 + q), why: "V imenovalcu formule je $1 - q$; pazi na predznak." },
            ]),
            hint: "Prvi člen dobiš z vstavitvijo spodnje meje, kvocient je osnova potence.",
            data: { given: [`a_n = ${base}`, `n_0 = ${start}`], find: ["s"] },
            formula: "s = \\dfrac{a_1}{1 - q},\\ |q| < 1",
            solution: `Prvi člen ($n = ${start}$): $a_1 = ${c === 1 ? "" : `${c} \\cdot `}\\left(${ft(qn, qd)}\\right)^{${E}} = ${ft(an, ad)}$, kvocient $q = ${ft(qn, qd)}$\n$s = \\dfrac{${ft(an, ad)}}{1 - ${qn < 0 ? `\\left(${ft(qn, qd)}\\right)` : ft(qn, qd)}} = \\dfrac{${ft(an, ad)}}{${ft(qd - qn, qd)}}$\n$s = ${ft(an * qd, ad * (qd - qn))}$`,
          };
        }
        const conv = r.next() < 0.5;
        const convs = r.shuffle(QL).slice(0, 3).map(([n, d]) => [n, d, r.int(1, 6) * d * d]);
        const divs = r.shuffle(DIV).slice(0, 3).map(([n, d]) => [n, d, r.int(1, 4) * d * d]);
        if (!conv) convs[0][2] = convs[0][1] * convs[0][1] * r.pick([100, 200, 500]);
        const whyDiv = ([n, d]) => (n === d ? "Pri $q = 1$ so vsi členi enaki; delne vsote rastejo čez vse meje." : n === -d ? "Pri $q = -1$ delne vsote izmenično skačejo in nimajo limite." : n < 0 ? `$|q| = ${ft(-n, d)} > 1$: negativen kvocient ne pomaga, absolutne vrednosti členov rastejo.` : `Kvocient je $${ft(n, d)}$, $|q| > 1$: členi rastejo, vrsta divergira.`);
        const whyConv = ([n, d, a]) => `$|q| = ${ft(Math.abs(n), d)} < 1$, zato je vrsta konvergentna${n < 0 ? " (tudi pri negativnem kvocientu)" : ""}${a >= 100 ? "; velikost prvega člena na konvergenco ne vpliva" : ""}.`;
        const right = conv ? convs[0] : divs[0];
        const wrongs = conv ? divs.map((s) => [serTex(s[2], s[0], s[1]), whyDiv(s)]) : convs.map((s) => [serTex(s[2], s[0], s[1]), whyConv(s)]);
        const all = conv ? [convs[0], ...divs] : [divs[0], ...convs];
        return {
          text: `Katera od naslednjih neskončnih geometrijskih vrst ${conv ? "je" : "ni"} konvergentna?`,
          answer: pickAns(r, serTex(right[2], right[0], right[1]), wrongs),
          options_tex: true,
          hint: "Pri vsaki vrsti izračunaj kvocient $q = a_2 : a_1$ in preveri, ali je $|q| < 1$.",
          data: { given: ["q = \\text{količnik zaporednih členov}"], find: [conv ? "\\text{konvergentna vrsta}" : "\\text{divergentna vrsta}"] },
          formula: "\\text{vrsta je konvergentna} \\iff |q| < 1",
          solution: `${all.map(([n, d, a]) => `$${serTex(a, n, d)}$: $q = ${ft(n, d)}$`).join("\n")}\n${conv ? "Le" : "Edino"} pri vrsti $${serTex(right[2], right[0], right[1])}$ je $|q| ${conv ? "<" : "\\ge"} 1$.`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const [qn, qd] = r.pick(QL.filter(([n]) => n > 0));
          const c = r.int(1, 5);
          const [A1, A2, A3] = [c * qd * qd, c * qn * qd, c * qn * qn];
          const q = qn / qd;
          if (r.next() < 0.5) {
            return {
              text: `V neskončni geometrijski vrsti s pozitivnim kvocientom je $a_1 = ${A1}$ in $a_3 = ${A3}$. Izračunaj vsoto vrste. Vpiši ulomek ali celo število.`,
              answer: frA(A1 * qd, qd - qn, [{ value: A1 / (1 - q * q), why: "Iz $\\frac{a_3}{a_1} = q^2$ moraš kvocient še koreniti." }, { value: A1 / (1 + q), why: "V imenovalcu formule je $1 - q$." }]),
              hint: "Člena $a_1$ in $a_3$ se razlikujeta za faktor $q^2$.",
              data: { given: [`a_1 = ${A1}`, `a_3 = ${A3}`], find: ["s"] },
              formula: ["a_3 = a_1 q^2", "s = \\dfrac{a_1}{1 - q}"],
              solution: `$q^2 = \\dfrac{${A3}}{${A1}} = ${ft(A3, A1)}$, $q = ${ft(qn, qd)}$ (pozitiven)\n$s = \\dfrac{${A1}}{1 - ${ft(qn, qd)}} = \\dfrac{${A1}}{${ft(qd - qn, qd)}}$\n$s = ${ft(A1 * qd, qd - qn)}$`,
            };
          }
          return {
            text: `V neskončni geometrijski vrsti je $a_2 = ${A2}$ in $a_3 = ${A3}$. Izračunaj vsoto vrste. Vpiši ulomek ali celo število.`,
            answer: frA(A1 * qd, qd - qn, [{ value: A2 / (1 - q), why: "Vrsta se začne s prvim členom $a_1$, ne z $a_2$." }, { value: A1 / (1 + q), why: "V imenovalcu formule je $1 - q$." }]),
            hint: "Iz zaporednih členov dobiš kvocient, nato izračunaj prvi člen.",
            data: { given: [`a_2 = ${A2}`, `a_3 = ${A3}`], find: ["s"] },
            formula: ["q = \\dfrac{a_3}{a_2}", "s = \\dfrac{a_1}{1 - q}"],
            solution: `$q = \\dfrac{${A3}}{${A2}} = ${ft(qn, qd)}$\n$a_1 = \\dfrac{a_2}{q} = ${A2} : ${ft(qn, qd)} = ${A1}$\n$s = \\dfrac{${A1}}{1 - ${ft(qn, qd)}} = ${ft(A1 * qd, qd - qn)}$`,
          };
        }
        if (t === 1) {
          const c = r.nonZero(-5, 6);
          const k = r.int(2, 6);
          const qT = `\\dfrac{x ${sg(-c)}}{${k}}`;
          const ser = `1 + ${qT} + \\left(${qT}\\right)^2 + \\ldots`;
          const sol = `$q = ${qT}$; pogoj $|q| < 1$\n$-${k} < x ${sg(-c)} < ${k}$\n$${c - k} < x < ${c + k}$`;
          const mode = r.int(0, 2);
          if (mode === 0) {
            return {
              text: `Za katere realne $x$ je vrsta $${ser}$ konvergentna?`,
              answer: pickAns(r, `(${c - k}, ${c + k})`, [
                [`[${c - k}, ${c + k}]`, "Na robu je $|q| = 1$; tam vrsta ni konvergentna."],
                [`(${-k}, ${k})`, `Iz $|x ${sg(-c)}| < ${k}$ sledi interval s središčem v $${c}$, ne v 0.`],
                [`(${c - 1}, ${c + 1})`, `Neenačbo $|q| < 1$ moraš pomnožiti s $${k}$.`],
                [`(${-c - k}, ${-c + k})`, "Pazi na predznak pri premiku: kje je $q = 0$?"],
              ]),
              options_tex: true,
              hint: "Določi kvocient vrste in reši neenačbo $|q| < 1$.",
              data: { given: [`q = ${qT}`], find: ["x"] },
              formula: "|q| < 1",
              solution: sol,
            };
          }
          if (mode === 1) {
            return {
              text: `Katero je največje celo število $x$, za katero je vrsta $${ser}$ konvergentna?`,
              answer: num(c + k - 1, null, [{ value: c + k, why: "Na robu je $|q| = 1$; tam vrsta ni konvergentna." }, { value: k - 1, why: `Interval konvergence ima središče v $${c}$, ne v 0.` }]),
              hint: "Določi kvocient vrste in reši neenačbo $|q| < 1$.",
              data: { given: [`q = ${qT}`], find: ["x"] },
              formula: "|q| < 1",
              solution: `${sol}\nNajvečje celo število je $${c + k - 1}$.`,
            };
          }
          let x0;
          do x0 = r.int(c - k + 1, c + k - 1);
          while (x0 === c);
          return {
            text: `Izračunaj vsoto vrste $${ser}$ za $x = ${x0}$. Vpiši ulomek ali celo število.`,
            answer: frA(k, k - x0 + c, [{ value: k / (k + x0 - c), why: "V imenovalcu formule je $1 - q$; pazi na predznak." }, { value: (x0 - c) / (k - x0 + c), why: "Prvi člen vrste je 1, ne $q$." }]),
            hint: "Najprej izračunaj kvocient pri danem $x$ in preveri $|q| < 1$.",
            data: { given: [`q = ${qT}`, `x = ${x0}`], find: ["s"] },
            formula: "s = \\dfrac{a_1}{1 - q}",
            solution: `$q = \\dfrac{${x0} ${sg(-c)}}{${k}} = ${ft(x0 - c, k)}$, $|q| < 1$\n$s = \\dfrac{1}{1 - ${x0 - c < 0 ? `\\left(${ft(x0 - c, k)}\\right)` : ft(x0 - c, k)}} = \\dfrac{1}{${ft(k - x0 + c, k)}}$\n$s = ${ft(k, k - x0 + c)}$`,
          };
        }
        if (r.next() < 0.5) {
          const L = r.pick([20, 30, 40, 50, 60, 80]);
          const p = r.pick([5, 10, 20, 25, 40]);
          const q = 1 - p / 100;
          const scm = (L * 100) / p;
          return {
            text: `Utež na nihalu pri prvem nihaju opiše lok dolžine $${L}\\ \\mathrm{cm}$, vsak naslednji lok pa je za $${p}\\ \\%$ krajši od prejšnjega. Kolikšno pot v metrih opravi utež, preden se ustavi? Zaokroži na dve decimalki.`,
            answer: num(scm / 100, 2, [{ value: L / (1 - p / 100) / 100, why: "Kvocient je delež, ki ostane: $q = 1 - \\frac{p}{100}$." }, { value: scm, why: "Rezultat pretvori v metre." }], "m"),
            hint: "Dolžine lokov tvorijo geometrijsko vrsto. Kolikšen delež prejšnjega loka ostane?",
            data: { given: [`a_1 = ${L}\\ \\mathrm{cm}`, `p = ${p}\\ \\%`], find: ["s"] },
            formula: ["q = 1 - \\dfrac{p}{100}", "s = \\dfrac{a_1}{1 - q}"],
            solution: `$q = 1 - ${tx(p / 100)} = ${tx(q)}$\n$s = \\dfrac{${L}}{1 - ${tx(q)}} = \\dfrac{${L}}{${tx(p / 100)}} = ${tx(scm)}\\ \\mathrm{cm}$\n$s ${ap(scm / 100, 2)} ${txr(scm / 100, 2)}\\ \\mathrm{m}$`,
          };
        }
        const h0 = r.int(10, 60);
        const a = r.pick([12, 15, 20, 24, 30, 36]);
        const [qn, qd] = r.pick([[1, 2], [2, 3], [3, 4], [1, 3], [3, 5], [4, 5]]);
        const H = h0 + (a * qd) / (qd - qn);
        return {
          text: `Sadika je ob sajenju visoka $${h0}\\ \\mathrm{cm}$. V prvem letu zraste za $${a}\\ \\mathrm{cm}$, vsako naslednje leto pa je prirastek enak $${ft(qn, qd)}$ prejšnjega. Katere višine sadika nikoli ne preseže? Zaokroži na eno decimalko.`,
          answer: num(H, 1, [{ value: (a * qd) / (qd - qn), why: "Prišteti moraš še začetno višino sadike." }, { value: h0 + (a * qd) / qn, why: "V imenovalcu je $1 - q$, kjer je $q$ delež prejšnjega prirastka." }], "cm"),
          hint: "Prirastki tvorijo geometrijsko vrsto; njeno vsoto prištej začetni višini.",
          data: { given: [`h_0 = ${h0}\\ \\mathrm{cm}`, `a_1 = ${a}\\ \\mathrm{cm}`, `q = ${ft(qn, qd)}`], find: ["h"] },
          formula: "h = h_0 + \\dfrac{a_1}{1 - q}",
          solution: `Vsota prirastkov: $\\dfrac{${a}}{1 - ${ft(qn, qd)}} = \\dfrac{${a}}{${ft(qd - qn, qd)}} = ${tx((a * qd) / (qd - qn))}\\ \\mathrm{cm}$\n$h = ${h0} + ${tx((a * qd) / (qd - qn))}$\n$h ${ap(H, 1)} ${txr(H, 1)}\\ \\mathrm{cm}$`,
        };
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const [a1, qn, qd, S, Tq] = r.pick(ST);
        const askQ = r.next() < 0.5;
        const qT = ft(qn, qd);
        const qWrong = 1 - Tq / (S * S);
        return {
          text: `Vsota neskončne geometrijske vrste je $${S}$, vsota kvadratov njenih členov pa $${Tq}$. ${askQ ? "Izračunaj kvocient vrste. Vpiši ulomek." : "Izračunaj prvi člen vrste."}`,
          answer: askQ
            ? frA(qn, qd, [{ value: (Tq - S * S) / (S * S + Tq), why: "Pri reševanju enačbe preveri predznake." }, { value: qWrong, why: "Kvadrati členov tvorijo vrsto s kvocientom $q^2$, ne $q$." }])
            : num(a1, null, [{ value: S, why: "To je vsota vrste, ne njen prvi člen." }, { value: S * (1 - qWrong), why: "Kvadrati členov tvorijo vrsto s kvocientom $q^2$, ne $q$." }]),
          hint: "Kvadrati členov tvorijo geometrijsko vrsto s prvim členom $a_1^2$ in kvocientom $q^2$. Zapiši obe vsoti in enačbi deli.",
          data: { given: [`s = ${S}`, `s_2 = ${Tq}`], find: [askQ ? "q" : "a_1"] },
          formula: ["s = \\dfrac{a_1}{1 - q}", "s_2 = \\dfrac{a_1^2}{1 - q^2}"],
          solution: `$\\dfrac{a_1}{1 - q} = ${S}$, $\\dfrac{a_1^2}{1 - q^2} = ${Tq}$\nPrvo enačbo kvadriramo in delimo z drugo: $\\dfrac{1 - q^2}{(1 - q)^2} = \\dfrac{1 + q}{1 - q} = \\dfrac{${S * S}}{${Tq}}$\n$${Tq}(1 + q) = ${S * S}(1 - q)$, $q = \\dfrac{${S * S} - ${Tq}}{${S * S} + ${Tq}} = ${qT}$${askQ ? "" : `\n$a_1 = ${S}\\left(1 - ${qn < 0 ? `\\left(${qT}\\right)` : qT}\\right) = ${a1}$`}`,
        };
      }
      if (t === 1) {
        const D = r.pick([100, 200, 250, 400, 500]);
        const p = r.pick([20, 25, 40, 50, 60, 75, 80]);
        const h = r.pick([6, 8, 12, 24]);
        const q = 1 - p / 100;
        const after = D / (1 - q);
        const before = after * q;
        const po = r.next() < 0.5;
        const val = po ? after : before;
        return {
          text: `Bolnik vsakih $${h}$ ur vzame $${D}\\ \\mathrm{mg}$ zdravila. V $${h}$ urah telo izloči $${p}\\ \\%$ zdravila, ki ga ima. Koliko zdravila ima na dolgi rok v telesu tik ${po ? "po zaužitju" : "pred zaužitjem"} odmerka? Zaokroži na eno decimalko.`,
          answer: num(val, 1, [{ value: (D / (1 - p / 100)) * (po ? 1 : p / 100), why: "Kvocient je delež, ki v telesu ostane: $q = 1 - \\frac{p}{100}$." }, { value: po ? before : after, why: po ? "To je količina tik pred odmerkom; po zaužitju je v telesu še cel nov odmerek." : "To je količina tik po odmerku; do naslednjega odmerka se del izloči." }, { value: po ? D : D * q, why: "Ostanki prejšnjih odmerkov se seštevajo." }], "mg"),
          hint: "Tik po $n$-tem odmerku je v telesu $D + Dq + Dq^2 + \\ldots + Dq^{n-1}$. Kaj se zgodi, ko gre $n$ proti neskončnosti?",
          data: { given: [`D = ${D}\\ \\mathrm{mg}`, `p = ${p}\\ \\%`], find: ["m"] },
          formula: ["q = 1 - \\dfrac{p}{100}", "D + Dq + Dq^2 + \\ldots = \\dfrac{D}{1 - q}"],
          solution: `$q = 1 - ${tx(p / 100)} = ${tx(q)}$\nTik po odmerku na dolgi rok: $\\dfrac{${D}}{1 - ${tx(q)}} ${ap(after, 1)} ${txr(after, 1)}\\ \\mathrm{mg}$${po ? "" : `\nTik pred odmerkom ostane delež $q$: $${txr(after, 1)} \\cdot ${tx(q)} ${ap(before, 1)} ${txr(before, 1)}\\ \\mathrm{mg}$`}`,
        };
      }
      const R = r.int(2, 9);
      const kind = r.pick(["krogi", "kvadrati", "obsegi"]);
      const S2 = Math.SQRT1_2;
      const val = kind === "krogi" ? 2 * Math.PI * R * R : kind === "kvadrati" ? 4 * R * R : (2 * Math.PI * R) / (1 - S2);
      const ms = kind === "krogi"
        ? [{ value: (Math.PI * R * R) / (1 - S2), why: "Polmeri se zmanjšujejo s faktorjem $\\frac{\\sqrt{2}}{2}$, ploščine pa s kvadratom tega faktorja." }, { value: Math.PI * R * R, why: "Sešteti moraš ploščine vseh krogov, ne le prvega." }]
        : kind === "kvadrati"
          ? [{ value: (2 * R * R) / (1 - S2), why: "Stranice se zmanjšujejo s faktorjem $\\frac{\\sqrt{2}}{2}$, ploščine pa s kvadratom tega faktorja." }, { value: 2 * R * R, why: "Diagonala prvega kvadrata je premer kroga $2R$, ne polmer." }]
          : [{ value: 4 * Math.PI * R, why: "Polmer se zmanjša s faktorjem $\\frac{\\sqrt{2}}{2}$, ne $\\frac{1}{2}$ (to velja za ploščine)." }, { value: 2 * Math.PI * R, why: "Sešteti moraš obsege vseh krogov." }];
      const last = kind === "krogi"
        ? `$S = \\dfrac{\\pi \\cdot ${R}^2}{1 - \\frac{1}{2}} = ${2 * R * R}\\pi ${ap(val, 2)} ${txr(val, 2)}\\ \\mathrm{cm^2}$`
        : kind === "kvadrati"
          ? `Prvi kvadrat: $(${R}\\sqrt{2})^2 = ${2 * R * R}\\ \\mathrm{cm^2}$\n$S = \\dfrac{${2 * R * R}}{1 - \\frac{1}{2}} = ${4 * R * R}\\ \\mathrm{cm^2}$`
          : `$o = \\dfrac{2\\pi \\cdot ${R}}{1 - \\frac{\\sqrt{2}}{2}} \\approx ${txr(val, 2)}\\ \\mathrm{cm}$`;
      return {
        text: `V krog s polmerom $${R}\\ \\mathrm{cm}$ včrtamo kvadrat, v kvadrat krog, v ta krog spet kvadrat in tako naprej v neskončnost. Izračunaj vsoto ${kind === "krogi" ? "ploščin vseh krogov" : kind === "kvadrati" ? "ploščin vseh kvadratov" : "obsegov vseh krogov"}. Zaokroži na dve decimalki.`,
        answer: num(val, 2, ms, kind === "obsegi" ? "cm" : "cm^2"),
        hint: "Kolikšen je polmer drugega kroga? Diagonala včrtanega kvadrata je premer kroga.",
        data: { given: [`R = ${R}\\ \\mathrm{cm}`], find: [kind === "obsegi" ? "o" : "S"] },
        formula: ["r_2 = \\dfrac{\\sqrt{2}}{2}R", "s = \\dfrac{a_1}{1 - q}"],
        solution: `Kvadrat, včrtan v krog s polmerom $R$, ima diagonalo $2R$ in stranico $R\\sqrt{2}$; krog v njem ima polmer $\\dfrac{\\sqrt{2}}{2}R$.\nKvocient dolžin je $\\dfrac{\\sqrt{2}}{2}$, kvocient ploščin $\\dfrac{1}{2}$.\n${last}`,
      };
    },
  },

  // ================= odvod =================
  {
    id: "gim-odvod-dop",
    topics: [T("odvod")],
    gen(level, r) {
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          if (r.next() < 0.6) {
            const a = r.nonZero(-6, 6);
            const b = r.nonZero(-6, 6);
            const [xT, cs, sn] = r.pick([["0", 1, 0], ["\\frac{\\pi}{2}", 0, 1], ["\\pi", -1, 0], ["\\frac{3\\pi}{2}", 0, -1]]);
            const v = a * cs - b * sn;
            const f = `${tm(a, "\\sin x", true)} ${tm(b, "\\cos x")}`;
            return {
              text: `Izračunaj $f'(${xT})$ za $f(x) = ${f}$.`,
              answer: num(v, null, [{ value: a * cs + b * sn, why: "Odvod kosinusa je $-\\sin x$." }, { value: a * sn + b * cs, why: "To je vrednost funkcije, ne odvoda." }]),
              hint: "Odvajaj člen za členom, nato vstavi točko in uporabi vrednosti sinusa in kosinusa.",
              data: { given: [`f(x) = ${f}`, `x_0 = ${xT}`], find: [`f'(${xT})`] },
              formula: ["(\\sin x)' = \\cos x", "(\\cos x)' = -\\sin x"],
              solution: `$f'(x) = ${tm(a, "\\cos x", true)} ${tm(-b, "\\sin x")}$\n$\\sin ${xT} = ${sn}$, $\\cos ${xT} = ${cs}$\n$f'(${xT}) = ${v}$`,
            };
          }
          const a = r.nonZero(-8, 8);
          const b = r.nonZero(-3, 3);
          const x0 = r.int(1, 4);
          const f = `${tm(a, "\\ln x", true)} ${tm(b, "x^2")}`;
          return {
            text: `Izračunaj $f'(${x0})$ za $f(x) = ${f}$. Vpiši ulomek ali celo število.`,
            answer: frA(a + 2 * b * x0 * x0, x0, [{ value: a * x0 + 2 * b * x0, why: "$(\\ln x)' = \\frac{1}{x}$, ne $x$." }, { value: a / x0 + b * x0, why: "$(x^2)' = 2x$: ne pozabi faktorja 2." }]),
            hint: "Odvajaj člen za členom in vstavi točko.",
            data: { given: [`f(x) = ${f}`, `x_0 = ${x0}`], find: [`f'(${x0})`] },
            formula: ["(\\ln x)' = \\dfrac{1}{x}", "(x^n)' = nx^{n-1}"],
            solution: `$f'(x) = \\dfrac{${a}}{x} ${tm(2 * b, "x")}$\n$f'(${x0}) = \\dfrac{${a}}{${x0}} ${sg(2 * b * x0)} = ${ft(a + 2 * b * x0 * x0, x0)}$`,
          };
        }
        if (t === 1) {
          const a = r.pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]);
          const b = r.int(0, 8);
          const c = r.int(0, 20);
          const t0 = r.int(2, 10);
          const s = `${cf(a)}t^2${b ? ` + ${b}t` : ""}${c ? ` + ${c}` : ""}`;
          const v = 2 * a * t0 + b;
          return {
            text: `Telo se giblje premo, njegova lega je $s(t) = ${s}$ ($s$ v metrih, $t$ v sekundah). Kolikšna je hitrost telesa ob času $t = ${t0}\\ \\mathrm{s}$?`,
            answer: num(v, null, [{ value: a * t0 * t0 + b * t0 + c, why: "To je lega telesa, ne hitrost." }, { value: a * t0 + b, why: "To je povprečna hitrost od začetka; trenutna hitrost je odvod lege." }], "m/s"),
            hint: "Trenutna hitrost je odvod lege po času.",
            data: { given: [`s(t) = ${s}`, `t = ${t0}\\ \\mathrm{s}`], find: ["v"] },
            formula: "v(t) = s'(t)",
            solution: `$v(t) = s'(t) = ${tm(2 * a, "t", true)}${b ? ` + ${b}` : ""}$\n$v(${t0}) = ${tx(2 * a)} \\cdot ${t0}${b ? ` + ${b}` : ""} = ${tx(v)}\\ \\mathrm{m/s}$`,
          };
        }
        const [f, right, wrongs, rule] = r.pick(DER_ITEMS);
        return {
          text: `Kateri izraz je odvod funkcije $f(x) = ${f}$?`,
          answer: pickAns(r, right, wrongs),
          options_tex: true,
          hint: "Najprej ugotovi, katero pravilo velja: produkt, količnik ali sestavljena (posredna) funkcija.",
          data: { given: [`f(x) = ${f}`], find: ["f'(x)"] },
          formula: rule,
          solution: `Uporabimo pravilo $${rule}$.\n$f'(x) = ${right}$`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const p = r.pick([0.5, 1, 2, -0.5, -1]);
          const q = r.int(-4, 6);
          const w = r.int(0, 10);
          const t0 = r.int(1, 6);
          const sT = `${tm(p, "t^3", true)}${q ? ` ${tm(q, "t^2")}` : ""}${w ? ` ${tm(w, "t")}` : ""}`;
          const acc = 6 * p * t0 + 2 * q;
          return {
            text: `Lega telesa pri premem gibanju je $s(t) = ${sT}$ ($s$ v metrih, $t$ v sekundah). Kolikšen je pospešek telesa ob času $t = ${t0}\\ \\mathrm{s}$?`,
            answer: num(acc, null, [{ value: 3 * p * t0 * t0 + 2 * q * t0 + w, why: "To je hitrost (prvi odvod); pospešek je odvod hitrosti." }, { value: p * t0 ** 3 + q * t0 * t0 + w * t0, why: "To je lega telesa, ne pospešek." }], "m/s^2"),
            hint: "Hitrost je odvod lege, pospešek je odvod hitrosti.",
            data: { given: [`s(t) = ${sT}`, `t = ${t0}\\ \\mathrm{s}`], find: ["a"] },
            formula: ["v(t) = s'(t)", "a(t) = v'(t) = s''(t)"],
            solution: `$v(t) = ${tm(3 * p, "t^2", true)}${q ? ` ${tm(2 * q, "t")}` : ""}${w ? ` ${sg(w)}` : ""}$\n$a(t) = ${tm(6 * p, "t", true)}${q ? ` ${sg(2 * q)}` : ""}$\n$a(${t0}) = ${tx(acc)}\\ \\mathrm{m/s^2}$`,
          };
        }
        if (t === 1) {
          const [T0, obj] = r.pick([[180, "pekača, vzetega iz pečice,"], [200, "pekača, vzetega iz pečice,"], [220, "pice, vzete iz krušne peči,"], [90, "čaja v skodelici"], [85, "kave v lončku"], [160, "lonca, odstavljenega s štedilnika,"]]);
          const Ts = r.int(18, 24);
          const k = r.pick([0.05, 0.1, 0.08, 0.04, 0.12]);
          const t0 = r.pick([5, 10, 15, 20]);
          const A = T0 - Ts;
          const rate = -k * A * Math.exp(-k * t0);
          return {
            text: `Temperatura ${obj} je $T(t) = ${Ts} + ${A}e^{-${tx(k)}t}$ ($T$ v °C, $t$ v minutah). Kako hitro se spreminja temperatura ob času $t = ${t0}\\ \\mathrm{min}$? Odgovor vpiši v stopinjah Celzija na minuto, zaokroži na dve decimalki.`,
            answer: num(rate, 2, [{ value: -A * Math.exp(-k * t0), why: "Pomnoži še z odvodom eksponenta." }, { value: -rate, why: "Temperatura pada, zato je odvod negativen; preveri predznak notranjega odvoda." }, { value: Ts + A * Math.exp(-k * t0), why: "To je temperatura, ne hitrost njenega spreminjanja." }]),
            hint: "Hitrost spreminjanja je odvod $T'(t)$. Uporabi pravilo za odvod posredne funkcije.",
            data: { given: [`T(t) = ${Ts} + ${A}e^{-${tx(k)}t}`, `t = ${t0}\\ \\mathrm{min}`], find: [`T'(${t0})`] },
            formula: "(e^{u})' = u'e^{u}",
            solution: `$T'(t) = ${A} \\cdot (-${tx(k)})e^{-${tx(k)}t} = -${tx(k * A)}e^{-${tx(k)}t}$\n$T'(${t0}) = -${tx(k * A)}e^{-${tx(k * t0)}} ${ap(rate, 2)} ${txr(rate, 2)}$\nTemperatura pada s hitrostjo približno $${txr(-rate, 2)}$ °C na minuto.`,
          };
        }
        const a = r.nonZero(-3, 3);
        const b = r.nonZero(-6, 6);
        const roots = b % a === 0 ? [0, -b / a] : [0];
        const x0 = r.pick(roots);
        const m = r.pick([1, 2, 3, -1, 5]);
        const ex = poly([a, b, 0]);
        const v = m * (2 * a * x0 + b);
        return {
          text: `Izračunaj $f'(${x0})$ za $f(x) = ${cf(m)}e^{${ex}}$.`,
          answer: num(v, null, [{ value: m, why: "Pomnoži še z odvodom eksponenta." }, { value: m * (a * x0 + b), why: "Pri odvajanju eksponenta: $(x^2)' = 2x$." }, { value: 0, why: "$e^0 = 1$, ne 0." }]),
          hint: "Odvajaj kot posredno funkcijo; preveri, koliko je eksponent v dani točki.",
          data: { given: [`f(x) = ${cf(m)}e^{${ex}}`, `x_0 = ${x0}`], find: [`f'(${x0})`] },
          formula: "(e^{u})' = u'e^{u}",
          solution: `$f'(x) = ${cf(m)}e^{${ex}} \\cdot (${poly([2 * a, b])})$\nPri $x = ${x0}$ je eksponent $0$, $e^0 = 1$.\n$f'(${x0}) = ${m} \\cdot 1 \\cdot ${pt(2 * a * x0 + b)} = ${v}$`,
        };
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const c = r.nonZero(-3, 4);
        const a = r.int(-6, 8);
        const x0 = r.pick([0, 1, 2, -1, 3]);
        if (x0 + c === 0) return null;
        const top = x0 * x0 + 2 * c * x0;
        const Kn = top - a;
        const Kd = (x0 + c) ** 2;
        const K = Kn / Kd;
        return {
          text: `Za funkcijo $f(x) = \\dfrac{x^2 + a}{x ${sg(c)}}$ velja $f'(${x0}) = ${ft(Kn, Kd)}$. Izračunaj parameter $a$.`,
          answer: num(a, null, [{ value: K * Kd - 2 * x0 * (x0 + c) - x0 * x0, why: "V števcu pravila za količnik je razlika $u'v - uv'$." }, { value: top - K * (x0 + c), why: "Imenovalec v pravilu za količnik je kvadriran." }]),
          hint: "Odvajaj po pravilu za količnik, pri čemer je $a$ konstanta. Vstavi točko in reši linearno enačbo.",
          data: { given: [`f(x) = \\dfrac{x^2 + a}{x ${sg(c)}}`, `f'(${x0}) = ${ft(Kn, Kd)}`], find: ["a"] },
          formula: "\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^2}",
          solution: `$f'(x) = \\dfrac{2x(x ${sg(c)}) - (x^2 + a)}{(x ${sg(c)})^2} = \\dfrac{x^2 ${tm(2 * c, "x")} - a}{(x ${sg(c)})^2}$\n$f'(${x0}) = \\dfrac{${top} - a}{${Kd}} = ${ft(Kn, Kd)}$\n$${top} - a = ${Kn}$, $a = ${a}$`,
        };
      }
      if (t === 1) {
        const kind = r.int(0, 2);
        if (kind === 0) {
          const m = r.int(1, 2);
          const n = r.int(2, 3);
          const a = r.nonZero(-3, 3);
          const b = r.int(-3, 3);
          const x0 = r.pick([1, -1, 2]);
          const u = a * x0 + b;
          const A = m * x0 ** (m - 1) * u ** n;
          const B = x0 ** m * n * a * u ** (n - 1);
          const L = le(a, b);
          const uT = m === 1 ? "x" : "x^2";
          const duT = m === 1 ? "1" : "2x";
          return {
            text: `Izračunaj $f'(${x0})$ za $f(x) = ${uT}(${L})^${n}$.`,
            answer: num(A + B, null, [{ value: A + B / a, why: "Pri odvodu potence $(ax + b)^n$ pomnoži še z notranjim odvodom." }, { value: m * x0 ** (m - 1) * n * a * u ** (n - 1), why: "Odvod produkta ni produkt odvodov." }]),
            hint: "Uporabi pravilo za produkt; drugi faktor odvajaj kot posredno funkcijo.",
            data: { given: [`f(x) = ${uT}(${L})^${n}`, `x_0 = ${x0}`], find: [`f'(${x0})`] },
            formula: ["(uv)' = u'v + uv'", "\\big((ax + b)^n\\big)' = n(ax + b)^{n-1} \\cdot a"],
            solution: `$f'(x) = ${duT} \\cdot (${L})^${n} + ${uT} \\cdot ${n}(${L})${n - 1 === 1 ? "" : `^{${n - 1}}`} \\cdot ${pt(a)}$\n$f'(${x0}) = ${A} ${sg(B)} = ${A + B}$`,
          };
        }
        if (kind === 1) {
          const a = r.int(1, 5);
          const s = r.int(1, 4);
          const x0 = r.int(1, 5);
          const b = s * s - a * x0;
          const L = le(a, b);
          return {
            text: `Izračunaj $f'(${x0})$ za $f(x) = x\\sqrt{${L}}$. Vpiši ulomek ali celo število.`,
            answer: frA(2 * s * s + a * x0, 2 * s, [{ value: s, why: "Uporabi pravilo za produkt: odvajati moraš tudi koren." }, { value: (2 * s * s + x0) / (2 * s), why: "Pri odvodu korena pomnoži še z notranjim odvodom." }]),
            hint: "Uporabi pravilo za produkt; koren odvajaj kot posredno funkcijo.",
            data: { given: [`f(x) = x\\sqrt{${L}}`, `x_0 = ${x0}`], find: [`f'(${x0})`] },
            formula: ["(uv)' = u'v + uv'", "(\\sqrt{u})' = \\dfrac{u'}{2\\sqrt{u}}"],
            solution: `$f'(x) = \\sqrt{${L}} + x \\cdot \\dfrac{${a}}{2\\sqrt{${L}}}$\nPri $x = ${x0}$: $\\sqrt{${s * s}} = ${s}$\n$f'(${x0}) = ${s} + \\dfrac{${a * x0}}{${2 * s}} = ${ft(2 * s * s + a * x0, 2 * s)}$`,
          };
        }
        const k = r.nonZero(-3, 3);
        const c = r.nonZero(-4, 4);
        return {
          text: `Izračunaj $f'(0)$ za $f(x) = \\dfrac{${ek(k)}}{x ${sg(c)}}$. Vpiši ulomek ali celo število.`,
          answer: frA(k * c - 1, c * c, [{ value: (k * c + 1) / (c * c), why: "V števcu pravila za količnik je razlika $u'v - uv'$." }, { value: (k * c - 1) / c, why: "Imenovalec v pravilu za količnik je kvadriran." }, { value: k / c, why: "Odvajati moraš tudi imenovalec." }]),
          hint: "Uporabi pravilo za količnik; števec odvajaj kot posredno funkcijo.",
          data: { given: [`f(x) = \\dfrac{${ek(k)}}{x ${sg(c)}}`], find: ["f'(0)"] },
          formula: ["\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^2}", "(e^{kx})' = ke^{kx}"],
          solution: `$f'(x) = \\dfrac{${k}${ek(k)}(x ${sg(c)}) - ${ek(k)}}{(x ${sg(c)})^2}$\n$f'(0) = \\dfrac{${k} \\cdot ${pt(c)} - 1}{${c * c}}$\n$f'(0) = ${ft(k * c - 1, c * c)}$`,
        };
      }
      if (r.next() < 0.5) {
        const a = r.int(-5, 5);
        const b = r.int(1, 9);
        const x0 = r.pick([1, 2, -1, 3]);
        const D = x0 * x0 + a * x0 + b;
        if (D <= 0) return null;
        const [Kn, Kd] = fr(2 * x0 + a, D);
        if (Kd - Kn * x0 === 0) return null;
        const K = Kn / Kd;
        const den = `${x0 * x0 + b} ${x0 < 0 ? "-" : "+"} ${Math.abs(x0) === 1 ? "" : Math.abs(x0)}a`;
        return {
          text: `Za funkcijo $f(x) = \\ln(x^2 + ax ${sg(b)})$ velja $f'(${x0}) = ${ft(Kn, Kd)}$. Izračunaj $a$.`,
          answer: num(a, null, [{ value: K !== 0 ? (1 / K - x0 * x0 - b) / x0 : NaN, why: "$(\\ln u)' = \\frac{u'}{u}$: pomnoži še z odvodom notranje funkcije." }, { value: K - 2 * x0, why: "Odvod logaritma ima v imenovalcu notranjo funkcijo." }]),
          hint: "Odvajaj kot posredno funkcijo ($a$ je konstanta), vstavi točko in reši enačbo za $a$.",
          data: { given: [`f(x) = \\ln(x^2 + ax ${sg(b)})`, `f'(${x0}) = ${ft(Kn, Kd)}`], find: ["a"] },
          formula: "(\\ln u)' = \\dfrac{u'}{u}",
          solution: `$f'(x) = \\dfrac{2x + a}{x^2 + ax ${sg(b)}}$\n$\\dfrac{${2 * x0} + a}{${den}} = ${ft(Kn, Kd)}$\n${Kn === 0 ? `$${2 * x0} + a = 0$` : `$${Kd}(${2 * x0} + a) = ${Kn}(${den})$`}\n$a = ${a}$`,
        };
      }
      const a = r.nonZero(-3, 3);
      const b = r.int(-4, 4);
      const c = r.int(-5, 5);
      const k = r.nonZero(-2, 3);
      const v = k * k * c + 2 * k * b + 2 * a;
      return {
        text: `Izračunaj $f''(0)$ za $f(x) = (${poly([a, b, c])})${ek(k)}$.`,
        answer: num(v, null, [{ value: 2 * a, why: "Pri drugem odvajanju znova uporabi pravilo za produkt: tudi $e^{kx}$ se odvaja." }, { value: k * c + b, why: "To je prvi odvod $f'(0)$." }, { value: k * k * c, why: "Odvajati moraš tudi polinomski faktor." }]),
        hint: "Najprej s pravilom za produkt izračunaj $f'(x)$ in izpostavi $e^{kx}$, nato odvajaj še enkrat.",
        data: { given: [`f(x) = (${poly([a, b, c])})${ek(k)}`], find: ["f''(0)"] },
        formula: ["(uv)' = u'v + uv'", "(e^{kx})' = ke^{kx}"],
        solution: `$f'(x) = ${ek(k)}\\big(${poly([k * a, k * b + 2 * a, k * c + b])}\\big)$\n$f''(x) = ${ek(k)}\\big(${poly([k * k * a, k * (k * b + 2 * a) + 2 * k * a, k * (k * c + b) + k * b + 2 * a])}\\big)$\n$f''(0) = ${v}$`,
      };
    },
  },

  // ================= nedoločeni integral =================
  {
    id: "gim-nedoloceni-integral-dop",
    topics: [T("nedoloceni-integral")],
    gen(level, r) {
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const x0 = r.pick([-2, -1, 1, 2, 3]);
          const cs = r.next() < 0.5 ? [r.nonZero(-3, 4), r.int(-5, 5), r.int(-8, 8), r.int(-9, 9)] : [r.nonZero(-2, 3), 0, r.nonZero(-5, 5), 0, r.int(-9, 9)];
          const F = poly(cs);
          const d = der(cs);
          const v = ev(d, x0);
          const n = cs.length - 1;
          const integ = cs.reduce((acc, c, i) => acc + (c * x0 ** (n - i + 1)) / (n - i + 1), 0);
          return {
            text: `Funkcija $F(x) = ${F}$ je nedoločeni integral funkcije $f$. Izračunaj $f(${x0})$.`,
            answer: num(v, null, [{ value: ev(cs, x0), why: "To je vrednost $F$; funkcija $f$ je odvod funkcije $F$." }, { value: integ, why: "Funkcija $f$ je odvod funkcije $F$, ne njen integral." }]),
            hint: "Če je $F$ nedoločeni integral funkcije $f$, potem je $F' = f$.",
            data: { given: [`F(x) = ${F}`, `x_0 = ${x0}`], find: [`f(${x0})`] },
            formula: "F'(x) = f(x)",
            solution: `$f(x) = F'(x) = ${poly(d)}$\n$f(${x0}) = ${v}$`,
          };
        }
        if (t === 1) {
          const a = r.nonZero(-8, 9);
          const kind = r.int(0, 3);
          const sgn = a < 0 ? "-" : "";
          const A = Math.abs(a);
          let integrand, rhs, k, ms, sol;
          if (kind === 0) {
            const n = r.int(2, 4);
            integrand = `${sgn}\\dfrac{${A}}{x^${n}}`;
            rhs = n === 2 ? "\\dfrac{k}{x}" : `\\dfrac{k}{x^${n - 1}}`;
            k = [-a, n - 1];
            ms = [{ value: a / (n - 1), why: "Nov eksponent je negativen; deljenje z njim spremeni predznak." }, { value: -a / n, why: "Deli z novim eksponentom, ne s starim." }, { value: a * (1 - n), why: "Z novim eksponentom deliš, ne množiš." }];
            sol = `$${integrand} = ${a}x^{-${n}}$\n$\\displaystyle\\int ${a}x^{-${n}}\\,dx = ${a} \\cdot \\dfrac{x^{${1 - n}}}{${1 - n}} + C = ${ft(-a, n - 1)} \\cdot \\dfrac{1}{x^{${n - 1}}} + C$`;
          } else if (kind === 1) {
            integrand = `${sgn}\\dfrac{${A}}{\\sqrt{x}}`;
            rhs = "k\\sqrt{x}";
            k = [2 * a, 1];
            ms = [{ value: a / 2, why: "Deljenje z $\\frac{1}{2}$ je množenje z 2." }, { value: -2 * a, why: "Nov eksponent $-\\frac{1}{2} + 1$ je pozitiven." }];
            sol = `$${integrand} = ${a}x^{-\\frac{1}{2}}$\n$\\displaystyle\\int ${a}x^{-\\frac{1}{2}}\\,dx = ${a} \\cdot \\dfrac{x^{\\frac{1}{2}}}{\\frac{1}{2}} + C = ${2 * a}\\sqrt{x} + C$`;
          } else if (kind === 2) {
            integrand = `${cf(a)}x\\sqrt{x}`;
            rhs = "kx^2\\sqrt{x}";
            k = [2 * a, 5];
            ms = [{ value: (5 * a) / 2, why: "Z novim eksponentom deliš, ne množiš." }, { value: (2 * a) / 3, why: "$x\\sqrt{x} = x^{3/2}$; eksponent povečaj za 1." }];
            sol = `$x\\sqrt{x} = x^{\\frac{3}{2}}$\n$\\displaystyle\\int ${a}x^{\\frac{3}{2}}\\,dx = ${a} \\cdot \\dfrac{x^{\\frac{5}{2}}}{\\frac{5}{2}} + C = ${ft(2 * a, 5)}x^2\\sqrt{x} + C$`;
          } else {
            integrand = `${cf(a)}\\sqrt[3]{x}`;
            rhs = "kx\\sqrt[3]{x}";
            k = [3 * a, 4];
            ms = [{ value: (4 * a) / 3, why: "Z novim eksponentom deliš, ne množiš." }, { value: 3 * a, why: "Deli z novim eksponentom, ne s starim." }];
            sol = `$\\sqrt[3]{x} = x^{\\frac{1}{3}}$\n$\\displaystyle\\int ${a}x^{\\frac{1}{3}}\\,dx = ${a} \\cdot \\dfrac{x^{\\frac{4}{3}}}{\\frac{4}{3}} + C = ${ft(3 * a, 4)}x\\sqrt[3]{x} + C$`;
          }
          return {
            text: `Velja $\\displaystyle\\int ${integrand}\\,dx = ${rhs} + C$. Koliko je $k$? Vpiši ulomek ali celo število.`,
            answer: frA(k[0], k[1], ms),
            hint: "Zapiši integrand kot potenco $x^n$ (negativen ali ulomljen eksponent) in integriraj kot potenco.",
            data: { given: [`f(x) = ${integrand}`], find: ["k"] },
            formula: "\\int x^n\\,dx = \\dfrac{x^{n+1}}{n + 1} + C,\\ n \\ne -1",
            solution: `${sol}\n$k = ${ft(k[0], k[1])}$`,
          };
        }
        const it = r.pick(NOT_F);
        const bad = r.pick(it.bad);
        const oks = r.shuffle(it.ok).slice(0, 3);
        return {
          text: `Katera od naslednjih funkcij ni nedoločeni integral funkcije $f(x) = ${it.f}$${it.cond || ""}?`,
          answer: pickAns(r, bad[0], oks.map((o) => [o, `Odvod te funkcije je $${it.f}$; od drugih primitivnih funkcij se razlikuje le za konstanto.`])),
          options_tex: true,
          hint: "Vsako možnost odvajaj in primerjaj s $f(x)$.",
          data: { given: [`f(x) = ${it.f}`], find: ["F(x)"] },
          formula: "F'(x) = f(x)",
          solution: `Nedoločeni integral funkcije $f$ je vsaka funkcija $F$ z odvodom $F' = f$.\nOdvod funkcije $${bad[0]}$ je $${bad[1]}$, ne $${it.f}$.\nOstale možnosti se med seboj razlikujejo le za konstanto.`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const a = r.nonZero(-6, 6);
          const b = r.nonZero(-6, 6);
          const c = r.int(-8, 8);
          const [xT, sn, cs] = r.pick([["\\frac{\\pi}{2}", 1, 0], ["\\pi", 0, -1], ["\\frac{3\\pi}{2}", -1, 0]]);
          const C0 = c + b;
          const v = a * sn - b * cs + C0;
          const f = `${tm(a, "\\cos x", true)} ${tm(b, "\\sin x")}`;
          return {
            text: `Funkcija $F$ je nedoločeni integral funkcije $f(x) = ${f}$ in velja $F(0) = ${c}$. Izračunaj $F(${xT})$.`,
            answer: num(v, null, [{ value: a * sn - b * cs, why: "Konstanto $C$ določi iz pogoja $F(0)$." }, { value: a * sn + b * cs + c - b, why: "$\\int \\sin x\\,dx = -\\cos x + C$; preveri predznak." }]),
            hint: "Integriraj člen za členom, iz pogoja $F(0)$ določi konstanto, nato vstavi drugo točko.",
            data: { given: [`f(x) = ${f}`, `F(0) = ${c}`], find: [`F(${xT})`] },
            formula: ["\\int \\cos x\\,dx = \\sin x + C", "\\int \\sin x\\,dx = -\\cos x + C"],
            solution: `$F(x) = ${tm(a, "\\sin x", true)} ${tm(-b, "\\cos x")} + C$\n$F(0) = ${-b} + C = ${c}$ $\\Rightarrow$ $C = ${C0}$\n$F(${xT}) = ${a * sn - b * cs} ${sg(C0)} = ${v}$`,
          };
        }
        if (t === 1) {
          const p = 3 * r.int(0, 2);
          const q = p === 0 ? 2 * r.int(1, 4) : 2 * r.int(0, 4);
          const w = r.int(1, 10);
          const s0 = r.int(0, 30);
          const Tt = r.int(2, 6);
          const vT = poly([p, q, w], "t");
          const sNoC = (p / 3) * Tt ** 3 + (q / 2) * Tt ** 2 + w * Tt;
          const ans = sNoC + s0;
          return {
            text: `Hitrost telesa, ki se giblje premo, je $v(t) = ${vT}$ ($v$ v $\\mathrm{m/s}$, $t$ v sekundah). Ob času $t = 0$ je telo na legi $${s0}\\ \\mathrm{m}$. Na kateri legi je ob času $t = ${Tt}\\ \\mathrm{s}$?`,
            answer: num(ans, null, [{ value: sNoC, why: "Prišteti moraš začetno lego (konstanta $C$)." }, { value: ev([p, q, w], Tt) * Tt + s0, why: "Hitrost ni stalna; lego dobiš z integriranjem hitrosti." }], "m"),
            hint: "Lega je nedoločeni integral hitrosti; konstanto določi iz začetne lege.",
            data: { given: [`v(t) = ${vT}`, `s(0) = ${s0}\\ \\mathrm{m}`, `t = ${Tt}\\ \\mathrm{s}`], find: [`s(${Tt})`] },
            formula: ["s(t) = \\int v(t)\\,dt", "s(0) = s_0"],
            solution: `$s(t) = ${poly([p / 3, q / 2, w, 0], "t")} + C$\n$s(0) = C = ${s0}$\n$s(${Tt}) = ${sNoC} + ${s0} = ${ans}\\ \\mathrm{m}$`,
          };
        }
        const a = r.nonZero(-5, 6);
        const b = r.nonZero(-8, 8);
        const c = r.int(-6, 6);
        if (r.next() < 0.5) {
          const f = `\\dfrac{${poly([a, 0, b])}}{x^2}`;
          return {
            text: `Funkcija $F$ je nedoločeni integral funkcije $f(x) = ${f}$ in velja $F(1) = ${c}$. Izračunaj $F(2)$. Vpiši ulomek ali celo število.`,
            answer: frA(2 * a + b + 2 * c, 2, [{ value: 2 * a - b / 2, why: "Konstanto $C$ določi iz pogoja $F(1)$." }, { value: a - b / 2 + c, why: "$\\int x^{-2}\\,dx = -x^{-1}$; pazi na predznak." }]),
            hint: "Ulomek razbij na dva člena (deli vsak člen števca z $x^2$), nato integriraj kot potence.",
            data: { given: [`f(x) = ${f}`, `F(1) = ${c}`], find: ["F(2)"] },
            formula: ["\\int x^n\\,dx = \\dfrac{x^{n+1}}{n + 1} + C", "\\int x^{-2}\\,dx = -\\dfrac{1}{x} + C"],
            solution: `$f(x) = ${a} ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}x^{-2}$\n$F(x) = ${tm(a, "x", true)} ${b < 0 ? "+" : "-"} \\dfrac{${Math.abs(b)}}{x} + C$\n$F(1) = ${a - b} + C = ${c}$ $\\Rightarrow$ $C = ${c - a + b}$\n$F(2) = ${ft(4 * a - b, 2)} ${sg(c - a + b)} = ${ft(2 * a + b + 2 * c, 2)}$`,
          };
        }
        const v = a * Math.E + b + c - a;
        const f = `\\dfrac{${le(a, b)}}{x}`;
        return {
          text: `Funkcija $F$ je nedoločeni integral funkcije $f(x) = ${f}$ za $x > 0$ in velja $F(1) = ${c}$. Izračunaj $F(e)$. Zaokroži na dve decimalki.`,
          answer: num(v, 2, [{ value: a * Math.E + b, why: "Konstanto $C$ določi iz pogoja $F(1)$." }, { value: a * Math.E + b * Math.E + c - a, why: "$\\ln e = 1$." }]),
          hint: "Ulomek razbij na dva člena, nato integriraj: $\\int \\frac{1}{x}\\,dx = \\ln x$.",
          data: { given: [`f(x) = ${f}`, `F(1) = ${c}`], find: ["F(e)"] },
          formula: ["\\int \\dfrac{1}{x}\\,dx = \\ln|x| + C", "\\ln 1 = 0,\\ \\ln e = 1"],
          solution: `$f(x) = ${a} + \\dfrac{${b}}{x}$\n$F(x) = ${tm(a, "x", true)} ${tm(b, "\\ln x")} + C$\n$F(1) = ${a} + C = ${c}$ $\\Rightarrow$ $C = ${c - a}$\n$F(e) = ${tm(a, "e", true)} ${sg(b)} ${sg(c - a)} ${ap(v, 2)} ${txr(v, 2)}$`,
        };
      }
      const t = r.int(0, 2);
      if (t === 0) {
        if (r.next() < 0.5) {
          const a = r.nonZero(-2, 2);
          const b = r.int(-3, 3);
          const C1 = r.int(-5, 5);
          const q = r.int(-6, 6);
          const x0 = r.pick([1, -1, 2]);
          const x2 = r.pick([1, 2, 3, -1]);
          const p = 3 * a * x0 * x0 + 2 * b * x0 + C1;
          const v = a * x2 ** 3 + b * x2 ** 2 + C1 * x2 + q;
          return {
            text: `Za funkcijo $f$ velja $f''(x) = ${poly([6 * a, 2 * b])}$, $f'(${x0}) = ${p}$ in $f(0) = ${q}$. Izračunaj $f(${x2})$.`,
            answer: num(v, null, [{ value: a * x2 ** 3 + b * x2 ** 2 + q, why: "Pri prvem integriranju dobiš konstanto, ki jo določiš iz vrednosti odvoda." }, { value: v - q, why: "Tudi pri drugem integriranju dobiš konstanto." }]),
            hint: "Integriraj dvakrat. Po vsakem integriranju določi konstanto iz danega pogoja.",
            data: { given: [`f''(x) = ${poly([6 * a, 2 * b])}`, `f'(${x0}) = ${p}`, `f(0) = ${q}`], find: [`f(${x2})`] },
            formula: ["f'(x) = \\int f''(x)\\,dx", "f(x) = \\int f'(x)\\,dx"],
            solution: `$f'(x) = ${poly([3 * a, 2 * b, 0])} + C_1$\n$f'(${x0}) = ${3 * a * x0 * x0 + 2 * b * x0} + C_1 = ${p}$ $\\Rightarrow$ $C_1 = ${C1}$\n$f(x) = ${poly([a, b, C1, 0])} + C_2$, $f(0) = C_2 = ${q}$\n$f(${x2}) = ${v}$`,
          };
        }
        const p = r.pick([0, 6, 12]);
        const w = r.pick([2, 4, 6, 8, 10]);
        const v0 = r.int(0, 15);
        const Tt = r.int(2, 6);
        const sT = v0 * Tt + (w * Tt * Tt) / 2 + (p * Tt ** 3) / 6;
        const aT = poly([p, w], "t");
        return {
          text: `Ob času $t = 0$ je telo v izhodišču in ima hitrost $${v0}\\ \\mathrm{m/s}$. Giblje se premo s pospeškom $a(t) = ${aT}$ ($a$ v $\\mathrm{m/s^2}$, $t$ v sekundah). Koliko poti opravi v prvih $${Tt}\\ \\mathrm{s}$?`,
          answer: num(sT, null, [{ value: sT - v0 * Tt, why: "Začetna hitrost je konstanta pri prvem integriranju." }, { value: v0 + w * Tt + (p * Tt * Tt) / 2, why: "To je hitrost ob tem času; pot dobiš z drugim integriranjem." }], "m"),
          hint: "Hitrost je integral pospeška, pot integral hitrosti. Konstanti določi iz začetnih pogojev.",
          data: { given: [`v_0 = ${v0}\\ \\mathrm{m/s}`, `a(t) = ${aT}`, `t = ${Tt}\\ \\mathrm{s}`], find: ["s"] },
          formula: ["v(t) = \\int a(t)\\,dt", "s(t) = \\int v(t)\\,dt"],
          solution: `$v(t) = ${poly([p / 2, w, 0], "t")} + C_1$, $v(0) = ${v0}$ $\\Rightarrow$ $C_1 = ${v0}$\n$s(t) = ${poly([p / 6, w / 2, v0, 0], "t")} + C_2$, $s(0) = 0$ $\\Rightarrow$ $C_2 = 0$\n$s(${Tt}) = ${sT}\\ \\mathrm{m}$`,
        };
      }
      if (t === 1) {
        const m = r.pick([1, 2, 3, 4, 6]);
        const kind = r.int(0, 4);
        if (kind === 4) {
          const cc = r.int(2, 9);
          const x1 = r.int(1, 4);
          const v = (m / 2) * Math.log((x1 * x1 + cc) / cc);
          return {
            text: `Funkcija $F$ je nedoločeni integral funkcije $f(x) = \\dfrac{${cf(m)}x}{x^2 + ${cc}}$ in velja $F(0) = 0$. Izračunaj $F(${x1})$. Zaokroži na dve decimalki.`,
            answer: num(v, 2, [{ value: m * Math.log((x1 * x1 + cc) / cc), why: "Iz $dt = 2x\\,dx$ sledi $x\\,dx = \\frac{dt}{2}$." }, { value: (m / 2) * Math.log(x1 * x1 + cc), why: `Določi konstanto iz pogoja $F(0) = 0$; $\\ln ${cc} \\ne 0$.` }]),
            hint: `Uvedi novo spremenljivko $t = x^2 + ${cc}$.`,
            data: { given: [`f(x) = \\dfrac{${cf(m)}x}{x^2 + ${cc}}`, "F(0) = 0"], find: [`F(${x1})`] },
            formula: ["t = x^2 + c,\\ dt = 2x\\,dx", "\\int \\dfrac{dt}{t} = \\ln|t| + C"],
            solution: `$t = x^2 + ${cc}$, $x\\,dx = \\dfrac{dt}{2}$\n$F(x) = ${cfr(m, 2)}\\ln(x^2 + ${cc}) + C$, $F(0) = 0$ $\\Rightarrow$ $C = -${cfr(m, 2)}\\ln ${cc}$\n$F(${x1}) = ${cfr(m, 2)}\\ln\\dfrac{${x1 * x1 + cc}}{${cc}} ${ap(v, 2)} ${txr(v, 2)}$`,
          };
        }
        let integrand, rhs, sub, dsub, k, ms, mid;
        if (kind === 0) {
          const c = r.nonZero(-3, 4);
          integrand = `${cf(m)}xe^{${cf(c)}x^2}`;
          rhs = `ke^{${cf(c)}x^2}`;
          sub = `${cf(c)}x^2`;
          dsub = `${2 * c}x`;
          k = [m, 2 * c];
          ms = [{ value: m, why: "Ne pozabi deliti z odvodom notranje funkcije (brez $x$)." }, { value: 2 * c * m, why: "Z notranjim odvodom deliš, ne množiš." }, { value: m / c, why: "Odvod $x^2$ je $2x$: ne pozabi faktorja 2." }];
          mid = `x\\,dx = \\dfrac{dt}{${2 * c}}$, $\\displaystyle\\int ${cf(m)}e^t\\dfrac{dt}{${2 * c}} = ${ft(m, 2 * c)}e^t + C`;
        } else if (kind === 1) {
          const cc = r.int(1, 9);
          integrand = `\\dfrac{${cf(m)}x}{x^2 + ${cc}}`;
          rhs = `k\\ln(x^2 + ${cc})`;
          sub = `x^2 + ${cc}`;
          dsub = "2x";
          k = [m, 2];
          ms = [{ value: m, why: "Iz $dt = 2x\\,dx$ sledi $x\\,dx = \\frac{dt}{2}$." }, { value: 2 * m, why: "Z 2 deliš, ne množiš." }];
          mid = `x\\,dx = \\dfrac{dt}{2}$, $\\displaystyle\\int \\dfrac{${m}}{t}\\cdot\\dfrac{dt}{2} = ${ft(m, 2)}\\ln t + C`;
        } else if (kind === 2) {
          const n = r.int(2, 4);
          integrand = `${cf(m)}\\sin^${n} x\\cos x`;
          rhs = `k\\sin^{${n + 1}} x`;
          sub = "\\sin x";
          dsub = "\\cos x";
          k = [m, n + 1];
          ms = [{ value: m / n, why: "Deli z novim eksponentom, ne s starim." }, { value: -m / (n + 1), why: "Pri $t = \\sin x$ je $dt = \\cos x\\,dx$, brez minusa." }, { value: m * (n + 1), why: "Z novim eksponentom deliš, ne množiš." }];
          mid = `\\displaystyle\\int ${cf(m)}t^${n}\\,dt = ${ft(m, n + 1)}t^{${n + 1}} + C`;
        } else {
          const n = r.int(1, 4);
          integrand = `\\dfrac{${cf(m)}\\ln${n === 1 ? "" : `^${n}`} x}{x}`;
          rhs = `k\\ln^{${n + 1}} x`;
          sub = "\\ln x";
          dsub = "\\dfrac{1}{x}";
          k = [m, n + 1];
          ms = [...(n === 1 ? [] : [{ value: m / n, why: "Deli z novim eksponentom, ne s starim." }]), { value: m, why: "Pri integriranju potence $t^n$ deliš z novim eksponentom." }, { value: m * (n + 1), why: "Z novim eksponentom deliš, ne množiš." }];
          mid = `\\displaystyle\\int ${cf(m)}t${n === 1 ? "" : `^${n}`}\\,dt = ${ft(m, n + 1)}t^{${n + 1}} + C`;
        }
        return {
          text: `Velja $\\displaystyle\\int ${integrand}\\,dx = ${rhs} + C$. Koliko je $k$? Vpiši ulomek ali celo število.`,
          answer: frA(k[0], k[1], ms),
          hint: `Uvedi novo spremenljivko $t = ${sub}$ in izrazi $dt$.`,
          data: { given: [`f(x) = ${integrand}`], find: ["k"] },
          formula: [`t = ${sub},\\ dt = ${dsub}\\,dx`],
          solution: `$t = ${sub}$, $dt = ${dsub}\\,dx$\n$${mid}$\n$k = ${ft(k[0], k[1])}$`,
        };
      }
      const c = r.int(-6, 6);
      const x1 = r.pick([1, 2, 3, -1, -2]);
      if (r.next() < 0.5) {
        const a = 2 * r.nonZero(-4, 4);
        const y1 = x1 ** 3 + (a / 2) * x1 * x1 + c;
        return {
          text: `Graf nedoločenega integrala $F$ funkcije $f(x) = 3x^2 + ax$ poteka skozi točki $A(0, ${c})$ in $B(${x1}, ${y1})$. Izračunaj $a$.`,
          answer: num(a, null, [{ value: (y1 - c - x1 ** 3) / (x1 * x1), why: "$\\int ax\\,dx = \\frac{a}{2}x^2$." }, { value: (2 * (y1 - x1 ** 3)) / (x1 * x1), why: "Konstanto $C$ določi iz prve točke." }]),
          hint: "Integriraj ($a$ je konstanta), iz točke $A$ določi $C$, nato vstavi točko $B$.",
          data: { given: [`F(0) = ${c}`, `F(${x1}) = ${y1}`], find: ["a"] },
          formula: "\\int x^n\\,dx = \\dfrac{x^{n+1}}{n + 1} + C",
          solution: `$F(x) = x^3 + \\dfrac{a}{2}x^2 + C$\n$F(0) = C = ${c}$\n$${x1 ** 3} + ${ft(x1 * x1, 2)}a ${sg(c)} = ${y1}$\n$a = ${a}$`,
        };
      }
      const k = r.nonZero(-3, 3);
      const b = r.nonZero(-5, 5);
      const a = 3 * k;
      const y1 = k * x1 ** 3 + b * x1 + c;
      return {
        text: `Graf nedoločenega integrala $F$ funkcije $f(x) = ax^2 ${sg(b)}$ poteka skozi točki $A(0, ${c})$ in $B(${x1}, ${y1})$. Izračunaj $a$.`,
        answer: num(a, null, [{ value: k, why: "$\\int ax^2\\,dx = \\frac{a}{3}x^3$: dobljeno število pomnoži s 3." }, { value: (3 * (y1 - b * x1)) / x1 ** 3, why: "Konstanto $C$ določi iz prve točke." }]),
        hint: "Integriraj ($a$ je konstanta), iz točke $A$ določi $C$, nato vstavi točko $B$.",
        data: { given: [`F(0) = ${c}`, `F(${x1}) = ${y1}`], find: ["a"] },
        formula: "\\int x^n\\,dx = \\dfrac{x^{n+1}}{n + 1} + C",
        solution: `$F(x) = \\dfrac{a}{3}x^3 ${tm(b, "x")} + C$\n$F(0) = C = ${c}$\n$\\dfrac{a}{3} \\cdot ${pt(x1)}^3 ${sg(b * x1)} ${sg(c)} = ${y1}$\n$${ft(x1 ** 3, 3)}a = ${y1 - b * x1 - c}$, $a = ${a}$`,
      };
    },
  },

  // ================= določeni integral =================
  {
    id: "gim-doloceni-integral-dop",
    topics: [T("doloceni-integral")],
    gen(level, r) {
      if (level === 1) {
        if (r.next() < 0.5) {
          const a = r.int(-2, 2);
          const b = a + r.int(1, 3);
          const c = b + r.int(1, 3);
          const A = r.nonZero(-9, 12);
          const B = r.nonZero(-9, 12);
          const ask = r.int(0, 3);
          const I = (lo, hi, f = "f(x)") => `\\displaystyle\\int_{${lo}}^{${hi}} ${f}\\,dx`;
          let Q, val, ms, formula, sol;
          if (ask === 0) {
            Q = I(a, c);
            val = A + B;
            ms = [{ value: B - A, why: "Integrala na sosednjih intervalih seštejemo." }, { value: A - B, why: "Integrala na sosednjih intervalih seštejemo." }];
            formula = "\\int_a^b f\\,dx + \\int_b^c f\\,dx = \\int_a^c f\\,dx";
            sol = `$${I(a, c)} = ${I(a, b)} + ${I(b, c)}$\n$= ${A} + ${pt(B)} = ${val}$`;
          } else if (ask === 1) {
            Q = I(c, a);
            val = -(A + B);
            ms = [{ value: A + B, why: "Pri zamenjavi mej se predznak integrala spremeni." }, { value: B - A, why: "Integrala na sosednjih intervalih seštejemo, nato zamenjamo predznak." }];
            formula = ["\\int_b^a f\\,dx = -\\int_a^b f\\,dx", "\\int_a^b f\\,dx + \\int_b^c f\\,dx = \\int_a^c f\\,dx"];
            sol = `$${I(a, c)} = ${A} + ${pt(B)} = ${A + B}$\n$${I(c, a)} = -${I(a, c)} = ${val}$`;
          } else if (ask === 2) {
            const k = r.nonZero(-3, 4);
            const m = r.nonZero(-5, 5);
            Q = I(a, b, `\\big(${cf(k)}f(x) ${sg(m)}\\big)`);
            val = k * A + m * (b - a);
            ms = [{ value: k * A + m, why: "Integral konstante na intervalu je konstanta krat dolžina intervala." }, { value: k * A, why: "Integrirati moraš tudi konstanto." }];
            formula = "\\int_a^b \\big(kf(x) + m\\big)\\,dx = k\\int_a^b f(x)\\,dx + m(b - a)";
            sol = `$${Q} = ${k} \\cdot ${pt(A)} + ${pt(m)} \\cdot (${b} - ${pt(a)})$\n$= ${k * A} ${sg(m * (b - a))} = ${val}$`;
          } else {
            const n = 2 * r.nonZero(-2, 2);
            Q = I(b, c, `\\big(f(x) ${tm(n, "x")}\\big)`);
            val = B + (n / 2) * (c * c - b * b);
            ms = [{ value: B + n * (c - b), why: "$\\int x\\,dx = \\frac{x^2}{2}$, ne $x$." }, { value: B, why: "Integrirati moraš tudi drugi člen." }];
            formula = ["\\int_a^b \\big(f + g\\big)\\,dx = \\int_a^b f\\,dx + \\int_a^b g\\,dx", "\\int x\\,dx = \\dfrac{x^2}{2} + C"];
            sol = `$${Q} = ${B} ${n < 0 ? "-" : "+"} ${Math.abs(n)}\\left[\\dfrac{x^2}{2}\\right]_{${b}}^{${c}}$\n$= ${B} ${n < 0 ? "-" : "+"} ${Math.abs(n) === 2 ? "" : `${Math.abs(n / 2)} \\cdot `}(${c * c} - ${b * b}) = ${val}$`;
          }
          return {
            text: `Za zvezno funkcijo $f$ velja $${I(a, b)} = ${A}$ in $${I(b, c)} = ${B}$. Izračunaj $${Q}$.`,
            answer: num(val, null, ms),
            hint: "Uporabi lastnosti določenega integrala (aditivnost glede na meje, linearnost, zamenjava mej).",
            data: { given: [`\\int_{${a}}^{${b}} f\\,dx = ${A}`, `\\int_{${b}}^{${c}} f\\,dx = ${B}`], find: ["I"] },
            formula,
            solution: sol,
          };
        }
        const a = r.nonZero(-6, 6);
        const kind = r.int(0, 4);
        let fT, lo, hi, Ft, val, ms, rule, calc;
        if (kind === 0) {
          [fT, lo, hi, val] = [`${cf(a)}\\sin x`, "0", "\\pi", 2 * a];
          Ft = `${tm(-a, "\\cos x", true)}`;
          rule = "\\int \\sin x\\,dx = -\\cos x + C";
          ms = [{ value: -2 * a, why: "$\\int \\sin x\\,dx = -\\cos x$; preveri predznak." }, { value: 0, why: "$\\cos \\pi = -1$." }];
          calc = `${-a} \\cdot (\\cos \\pi - \\cos 0) = ${-a} \\cdot (-1 - 1)`;
        } else if (kind === 1) {
          [fT, lo, hi, val] = [`${cf(a)}\\cos x`, "0", "\\frac{\\pi}{2}", a];
          Ft = `${tm(a, "\\sin x", true)}`;
          rule = "\\int \\cos x\\,dx = \\sin x + C";
          ms = [{ value: -a, why: "$\\int \\cos x\\,dx = \\sin x$, brez minusa." }];
          calc = `${a} \\cdot \\left(\\sin \\frac{\\pi}{2} - \\sin 0\\right) = ${a} \\cdot (1 - 0)`;
        } else if (kind === 2) {
          [fT, lo, hi, val] = [`${cf(a)}\\cos x`, "-\\frac{\\pi}{2}", "\\frac{\\pi}{2}", 2 * a];
          Ft = `${tm(a, "\\sin x", true)}`;
          rule = "\\int \\cos x\\,dx = \\sin x + C";
          ms = [{ value: 0, why: "$\\sin\\left(-\\frac{\\pi}{2}\\right) = -1$: odšteješ negativno število." }, { value: -2 * a, why: "$\\int \\cos x\\,dx = \\sin x$, brez minusa." }];
          calc = `${a} \\cdot \\left(\\sin \\frac{\\pi}{2} - \\sin\\left(-\\frac{\\pi}{2}\\right)\\right) = ${a} \\cdot (1 + 1)`;
        } else if (kind === 3) {
          const k = r.int(1, 3);
          [fT, lo, hi, val] = [`\\dfrac{${a}}{x}`, "1", k === 1 ? "e" : `e^${k}`, a * k];
          Ft = `${tm(a, "\\ln x", true)}`;
          rule = "\\int \\dfrac{1}{x}\\,dx = \\ln|x| + C";
          ms = [{ value: -a * k, why: "Newton-Leibnizova formula: $F(b) - F(a)$, ne obratno." }, { value: a * (1 - Math.exp(-k)), why: "$\\int \\frac{1}{x}\\,dx = \\ln|x|$." }];
          calc = `${a} \\cdot (\\ln ${hi} - \\ln 1) = ${a} \\cdot (${k} - 0)`;
        } else {
          const k = r.int(2, 6);
          [fT, lo, hi, val] = [`${cf(a)}e^x`, "0", `\\ln ${k}`, a * (k - 1)];
          Ft = `${cf(a)}e^x`;
          rule = "\\int e^x\\,dx = e^x + C";
          ms = [{ value: a * k, why: "$e^0 = 1$: odšteti moraš $F(0)$." }];
          calc = `${a} \\cdot (e^{\\ln ${k}} - e^0) = ${a} \\cdot (${k} - 1)`;
        }
        return {
          text: `Izračunaj $\\displaystyle\\int_{${lo}}^{${hi}} ${fT}\\,dx$.`,
          answer: num(val, null, ms),
          hint: "Poišči nedoločeni integral in uporabi Newton-Leibnizovo formulo.",
          data: { given: [`f(x) = ${fT}`, `a = ${lo}`, `b = ${hi}`], find: ["I"] },
          formula: [rule, "\\int_a^b f(x)\\,dx = F(b) - F(a)"],
          solution: `$F(x) = ${Ft}$\n$I = ${calc} = ${val}$`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          if (r.next() < 0.5) {
            const v0k = r.pick([36, 54, 72, 90, 108]);
            const v0 = v0k / 3.6;
            const a = r.pick([2.5, 5]);
            const Tt = v0 / a;
            const s = (v0 * v0) / (2 * a);
            return {
              text: `Avto vozi s hitrostjo $${v0k}\\ \\mathrm{km/h}$ in začne enakomerno zavirati. Njegova hitrost je $v(t) = v_0 - ${tx(a)}t$ ($v$ v $\\mathrm{m/s}$, $t$ v sekundah). Kolikšna je zavorna pot do ustavitve? Zaokroži na eno decimalko.`,
              answer: num(s, 1, [{ value: v0 * Tt, why: "Hitrost se med zaviranjem zmanjšuje; pot je integral hitrosti." }, { value: (v0k * v0k) / (2 * a), why: "Hitrost najprej pretvori v $\\mathrm{m/s}$." }], "m"),
              hint: "Pretvori hitrost v m/s, poišči čas ustavitve ($v = 0$) in integriraj hitrost od 0 do tega časa.",
              data: { given: [`v_0 = ${v0k}\\ \\mathrm{km/h}`, `a = ${tx(a)}\\ \\mathrm{m/s^2}`], find: ["s"] },
              formula: ["v(t_1) = 0", "s = \\int_0^{t_1} v(t)\\,dt"],
              solution: `$v_0 = ${v0k} : 3{,}6 = ${v0}\\ \\mathrm{m/s}$\n$v(t_1) = 0$: $t_1 = \\dfrac{${v0}}{${tx(a)}} = ${tx(Tt)}\\ \\mathrm{s}$\n$s = \\displaystyle\\int_0^{${tx(Tt)}} (${v0} - ${tx(a)}t)\\,dt = ${v0} \\cdot ${tx(Tt)} - \\dfrac{${tx(a)} \\cdot ${tx(Tt)}^2}{2} = ${tx(s)}\\ \\mathrm{m}$`,
            };
          }
          const a = r.int(10, 60);
          const b = 2 * r.int(1, 5);
          const Tt = r.int(5, 30);
          const V = a * Tt + (b * Tt * Tt) / 2;
          return {
            text: `V bazen priteka voda s pretokom $\\Phi(t) = ${a} + ${b}t$ (v litrih na minuto, $t$ v minutah). Koliko litrov vode priteče v prvih $${Tt}$ minutah?`,
            answer: num(V, null, [{ value: (a + b * Tt) * Tt, why: "Pretok se s časom spreminja; količina je integral pretoka." }, { value: a * Tt, why: "Pretok narašča; integrirati moraš tudi člen s $t$." }], "l"),
            hint: "Količina vode je določeni integral pretoka po času.",
            data: { given: [`\\Phi(t) = ${a} + ${b}t`, `t = ${Tt}`], find: ["V"] },
            formula: "V = \\int_0^{t} \\Phi(t)\\,dt",
            solution: `$V = \\displaystyle\\int_0^{${Tt}} (${a} + ${b}t)\\,dt = \\left(${a}t + ${b / 2 === 1 ? "" : b / 2}t^2\\right)\\Big|_0^{${Tt}}$\n$V = ${a * Tt} + ${(b / 2) * Tt * Tt} = ${V}\\ \\mathrm{l}$`,
          };
        }
        if (t === 1) {
          if (r.next() < 0.5) {
            const b = r.int(2, 8);
            const c = r.int(0, 6);
            const K = b * b + c * b;
            const fT = c ? `2x + ${c}` : "2x";
            return {
              text: `Za katero pozitivno število $b$ velja $\\displaystyle\\int_0^{b} (${fT})\\,dx = ${K}$?`,
              answer: num(b, null, [{ value: (-c + Math.sqrt(c * c + 8 * K)) / 4, why: "$\\int 2x\\,dx = x^2$, ne $2x^2$." }, { value: c ? Math.sqrt(K) : NaN, why: "Integrirati moraš tudi konstantni člen." }]),
              hint: "Izračunaj integral z mejo $b$ in reši nastalo kvadratno enačbo.",
              data: { given: [`f(x) = ${fT}`, `I = ${K}`], find: ["b"] },
              formula: "\\int_0^b f(x)\\,dx = F(b) - F(0)",
              solution: `$\\displaystyle\\int_0^{b} (${fT})\\,dx = b^2${c ? ` ${tm(c, "b")}` : ""}$\n$b^2${c ? ` ${tm(c, "b")}` : ""} - ${K} = 0$\n${c ? `$b_1 = ${b}$, $b_2 = ${-c - b}$; pozitivna rešitev je $b = ${b}$.` : `$b = \\sqrt{${K}} = ${b}$ (pozitivna rešitev)`}`,
            };
          }
          const m = r.int(1, 3);
          const a = m === 3 ? r.nonZero(-5, 6) : 3 * r.nonZero(-3, 3);
          const w = r.int(-4, 6);
          const K = (a * m ** 3) / 3 + w * m;
          const fT = `ax^2${w ? ` ${sg(w)}` : ""}`;
          return {
            text: `Za katero število $a$ velja $\\displaystyle\\int_0^{${m}} (${fT})\\,dx = ${K}$?`,
            answer: num(a, null, [{ value: (K - w * m) / m ** 3, why: "$\\int x^2\\,dx = \\frac{x^3}{3}$." }, { value: (3 * K) / m ** 3, why: "Integral konstante na intervalu ni 0." }]),
            hint: "Izračunaj integral, pri čemer je $a$ konstanta, in reši linearno enačbo.",
            data: { given: [`f(x) = ${fT}`, `I = ${K}`], find: ["a"] },
            formula: "\\int x^n\\,dx = \\dfrac{x^{n+1}}{n + 1} + C",
            solution: `$\\displaystyle\\int_0^{${m}} (${fT})\\,dx = \\left(\\dfrac{a}{3}x^3${w ? ` ${tm(w, "x")}` : ""}\\right)\\Big|_0^{${m}} = ${ft(m ** 3, 3)}a${w ? ` ${sg(w * m)}` : ""}$\n$${ft(m ** 3, 3)}a = ${K - w * m}$\n$a = ${a}$`,
          };
        }
        const a = r.int(1, 6);
        const kind = r.int(0, 3);
        let fT, lo, hi, val, ms, calc, rule;
        if (kind === 0) {
          const k = r.int(2, 8);
          [fT, lo, hi, val] = [`\\dfrac{${a}}{x}`, "1", `${k}`, a * Math.log(k)];
          ms = [{ value: a * (1 - 1 / k), why: "$\\int \\frac{1}{x}\\,dx = \\ln|x|$." }];
          rule = "\\int \\dfrac{1}{x}\\,dx = \\ln|x| + C";
          calc = `${cf(a)}(\\ln ${k} - \\ln 1) = ${cf(a)}\\ln ${k}`;
        } else if (kind === 1) {
          const k = r.int(1, 3);
          [fT, lo, hi, val] = [`${cf(a)}e^x`, "0", `${k}`, a * (Math.exp(k) - 1)];
          ms = [{ value: a * Math.exp(k), why: "$e^0 = 1$: odšteti moraš $F(0)$." }];
          rule = "\\int e^x\\,dx = e^x + C";
          const eK = k === 1 ? "e" : `e^{${k}}`;
          calc = `${cf(a)}(${eK} - e^0) = ${cf(a)}(${eK} - 1)`;
        } else if (kind === 2) {
          const k = r.int(2, 4);
          [fT, lo, hi, val] = [`${cf(a)}\\sqrt{x}`, "0", `${k * k}`, (2 / 3) * a * k ** 3];
          ms = [{ value: (3 / 2) * a * k ** 3, why: "Z novim eksponentom $\\frac{3}{2}$ deliš, ne množiš." }];
          rule = "\\int \\sqrt{x}\\,dx = \\dfrac{2}{3}x\\sqrt{x} + C";
          calc = `\\dfrac{${2 * a}}{3} \\cdot ${k * k}\\sqrt{${k * k}} = \\dfrac{${2 * a * k ** 3}}{3}`;
        } else {
          [fT, lo, hi, val] = [`${cf(a)}\\sin x`, "0", "\\pi", 2 * a];
          ms = [{ value: 0, why: "$\\cos \\pi = -1$." }];
          rule = "\\int \\sin x\\,dx = -\\cos x + C";
          calc = `-${a}(\\cos \\pi - \\cos 0) = -${a}(-1 - 1) = ${2 * a}`;
        }
        return {
          text: `Izračunaj ploščino lika, ki ga omejujejo graf funkcije $f(x) = ${fT}$, os $x$ ter premici $x = ${lo}$ in $x = ${hi}$. Zaokroži na dve decimalki.`,
          answer: num(val, 2, ms),
          hint: "Funkcija je na intervalu pozitivna, zato je ploščina kar določeni integral.",
          data: { given: [`f(x) = ${fT}`, `a = ${lo}`, `b = ${hi}`], find: ["S"] },
          formula: ["S = \\int_a^b f(x)\\,dx", rule],
          solution: `Na intervalu je $f(x) > 0$.\n$S = ${calc}$\n$S ${ap(val, 2)} ${txr(val, 2)}$`,
        };
      }
      const t = r.int(0, 3);
      if (t === 0) {
        const c = r.int(1, 4);
        const m = r.int(1, Math.min(3, c));
        const fT = `${cf(c)}\\sqrt{x}`;
        const gT = `${cf(m)}x`;
        const X = ft(c * c, m * m);
        return {
          text: `Izračunaj ploščino lika, ki ga omejujeta graf funkcije $f(x) = ${fT}$ in premica $y = ${gT}$. Vpiši ulomek ali celo število.`,
          answer: frA(c ** 4, 6 * m ** 3, [{ value: (2 * c ** 4) / (3 * m ** 3), why: "Integrirati moraš razliko obeh funkcij, ne le korena." }, { value: c ** 4 / (2 * m ** 3), why: "Integrirati moraš razliko obeh funkcij, ne le premice." }, { value: -(c ** 4) / (6 * m ** 3), why: "Odštej spodnjo funkcijo od zgornje; ploščina je pozitivna." }]),
          hint: "Poišči presečišči grafov, nato integriraj razliko zgornje in spodnje funkcije.",
          data: { given: [`f(x) = ${fT}`, `y = ${gT}`], find: ["S"] },
          formula: ["S = \\int_{x_1}^{x_2} \\big(f(x) - g(x)\\big)\\,dx", "\\int \\sqrt{x}\\,dx = \\dfrac{2}{3}x\\sqrt{x} + C"],
          solution: `Presečišči: $${fT} = ${gT}$ $\\Rightarrow$ $x = 0$ ali $\\sqrt{x} = ${ft(c, m)}$, $x = ${X}$\nNa vmesnem intervalu je koren nad premico.\n$S = \\displaystyle\\int_0^{${X}} (${fT} - ${gT})\\,dx = \\left(${ft(2 * c, 3)}x\\sqrt{x} - ${ft(m, 2)}x^2\\right)\\Big|_0^{${X}}$\n$S = ${ft(2 * c ** 4, 3 * m ** 3)} - ${ft(c ** 4, 2 * m ** 3)} = ${ft(c ** 4, 6 * m ** 3)}$`,
        };
      }
      if (t === 1) {
        if (r.next() < 0.5) {
          const c = r.int(1, 6);
          const A = ft(4 * c ** 3, 3);
          return {
            text: `Parabola $y = k - x^2$ (kjer je $k > 0$) in os $x$ omejujeta lik s ploščino $${A}$. Izračunaj $k$.`,
            answer: num(c * c, null, [{ value: c, why: "To je ničla $\\sqrt{k}$, iskali pa smo $k$." }, { value: (2 * c ** 3) ** (2 / 3), why: "Lik leži med obema ničlama, na $[-\\sqrt{k}, \\sqrt{k}]$, ne le na $[0, \\sqrt{k}]$." }]),
            hint: "Ničli parabole sta $\\pm\\sqrt{k}$. Zapiši ploščino kot integral in jo izenači z dano vrednostjo.",
            data: { given: [`S = ${A}`], find: ["k"] },
            formula: "S = \\int_{x_1}^{x_2} f(x)\\,dx",
            solution: `Ničli: $x = \\pm\\sqrt{k}$; označimo $c = \\sqrt{k}$.\n$S = \\displaystyle\\int_{-c}^{c} (c^2 - x^2)\\,dx = 2\\left(c^3 - \\dfrac{c^3}{3}\\right) = \\dfrac{4c^3}{3}$\n$\\dfrac{4c^3}{3} = ${A}$ $\\Rightarrow$ $c^3 = ${c ** 3}$, $c = ${c}$\n$k = c^2 = ${c * c}$`,
          };
        }
        const k = r.int(1, 6);
        const A = ft(k ** 3, 6);
        return {
          text: `Parabola $y = kx - x^2$ (kjer je $k > 0$) in os $x$ omejujeta lik s ploščino $${A}$. Izračunaj $k$.`,
          answer: num(k, null, [{ value: k / Math.cbrt(3), why: "Integrirati moraš celo funkcijo $kx - x^2$, ne le $kx$." }, { value: k * Math.cbrt(2), why: "Parabola seka os $x$ v $0$ in $k$; integriraj med ničlama." }]),
          hint: "Poišči ničli parabole, zapiši ploščino kot integral med njima in reši enačbo za $k$.",
          data: { given: [`S = ${A}`], find: ["k"] },
          formula: "S = \\int_{x_1}^{x_2} f(x)\\,dx",
          solution: `Ničli: $x(k - x) = 0$, $x = 0$ in $x = k$\n$S = \\displaystyle\\int_0^{k} (kx - x^2)\\,dx = \\dfrac{k^3}{2} - \\dfrac{k^3}{3} = \\dfrac{k^3}{6}$\n$\\dfrac{k^3}{6} = ${A}$ $\\Rightarrow$ $k^3 = ${k ** 3}$, $k = ${k}$`,
        };
      }
      if (t === 2) {
        const m = r.int(1, 5);
        const a = m >= 3 ? r.int(1, 2) : 1;
        const Vv = (2 * Math.PI * m ** 5) / (15 * a ** 3);
        const X = ft(m, a);
        const mT = `${cf(m)}x`;
        const pT = `${cf(a)}x^2`;
        return {
          text: `Lik, ki ga omejujeta premica $y = ${mT}$ in parabola $y = ${pT}$, zavrtimo okoli osi $x$. Izračunaj prostornino nastale vrtenine. Zaokroži na dve decimalki.`,
          answer: num(Vv, 2, [{ value: (Math.PI * m ** 5) / (30 * a ** 3), why: "Prostornina je $\\pi\\int (g^2 - f^2)\\,dx$, ne $\\pi\\int (g - f)^2\\,dx$." }, { value: Vv / Math.PI, why: "Ne pozabi faktorja $\\pi$." }]),
          hint: "Poišči presečišči. Vrtenina je votla: od prostornine zunanjega telesa odštej notranje.",
          data: { given: [`y = ${mT}`, `y = ${pT}`], find: ["V"] },
          formula: "V = \\pi\\int_{x_1}^{x_2} \\big(g^2(x) - f^2(x)\\big)\\,dx",
          solution: `Presečišči: $${pT} = ${mT}$ $\\Rightarrow$ $x = 0$, $x = ${X}$; vmes je premica nad parabolo.\n$V = \\pi\\displaystyle\\int_0^{${X}} \\big(${m * m === 1 ? "" : m * m}x^2 - ${a * a === 1 ? "" : a * a}x^4\\big)\\,dx = \\pi\\left(\\dfrac{${m * m === 1 ? "" : m * m}x^3}{3} - \\dfrac{${a * a === 1 ? "" : a * a}x^5}{5}\\right)\\Big|_0^{${X}}$\n$V = ${ft(2 * m ** 5, 15 * a ** 3)}\\pi ${ap(Vv, 2)} ${txr(Vv, 2)}$`,
        };
      }
      const c = r.int(1, 5);
      const fT = `x^3 ${tm(-c * c, "x")}`;
      return {
        text: `Izračunaj ploščino lika, ki ga graf funkcije $f(x) = ${fT}$ omejuje z osjo $x$. Vpiši ulomek ali celo število.`,
        answer: frA(c ** 4, 2, [{ value: 0, why: "Integral čez cel interval je 0, ker se dela izničita; ploščina je vsota absolutnih vrednosti." }, { value: c ** 4 / 4, why: "Lik ima dva dela, nad in pod osjo $x$." }]),
        hint: "Poišči ničle. Lik ima dva dela; na vsakem posebej izračunaj integral in seštej absolutni vrednosti.",
        data: { given: [`f(x) = ${fT}`], find: ["S"] },
        formula: "S = \\left|\\int_{x_1}^{x_2} f\\,dx\\right| + \\left|\\int_{x_2}^{x_3} f\\,dx\\right|",
        solution: `Ničle: $x(x^2 - ${c * c}) = 0$, $x \\in \\{${-c}, 0, ${c}\\}$\n$\\displaystyle\\int_0^{${c}} (${fT})\\,dx = \\dfrac{${c ** 4}}{4} - \\dfrac{${c ** 4}}{2} = -${ft(c ** 4, 4)}$; funkcija je liha, zato je integral na $[${-c}, 0]$ enak $${ft(c ** 4, 4)}$.\n$S = 2 \\cdot ${ft(c ** 4, 4)} = ${ft(c ** 4, 2)}$`,
      };
    },
  },

  // ================= kombinatorika =================
  {
    id: "gim-kombinatorika-dop",
    topics: [T("kombinatorika")],
    gen(level, r) {
      const who = name(r);
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const ctx = r.int(0, 2);
          let a, b, c, text;
          if (ctx === 0) {
            [a, b, c] = [r.int(3, 9), r.int(2, 5), r.int(2, 4)];
            text = `${who} ima ${nw(a, "majico", "majici", "majice", "majic")}, ${nw(b, "par hlač", "para hlač", "pare hlač", "parov hlač")} in ${nw(c, "par čevljev", "para čevljev", "pare čevljev", "parov čevljev")}. Na koliko načinov se lahko obleče (majica, hlače, čevlji)?`;
          } else if (ctx === 1) {
            [a, b, c] = [r.int(2, 4), r.int(3, 6), r.int(2, 5)];
            text = `Kosilo je sestavljeno iz juhe, glavne jedi in sladice. Na izbiro so ${nw(a, "juha", "juhi", "juhe", "juh")}, ${nw(b, "glavna jed", "glavni jedi", "glavne jedi", "glavnih jedi")} in ${nw(c, "sladica", "sladici", "sladice", "sladic")}. Koliko različnih kosil lahko sestavimo?`;
          } else {
            [a, b, c] = [r.int(2, 5), r.int(2, 6), r.int(2, 4)];
            text = `Iz kraja A v kraj B ${verbOf(a, "vodi", "vodita", "vodijo", "vodi")} ${nw(a, "pot", "poti", "poti", "poti")}, iz B v C ${nw(b, "pot", "poti", "poti", "poti")}, iz C v D pa ${nw(c, "pot", "poti", "poti", "poti")}. Na koliko načinov lahko pridemo iz A v D skozi B in C?`;
          }
          return {
            text,
            answer: num(a * b * c, null, [{ value: a + b + c, why: "Izbire so neodvisne: možnosti zmnožiš, ne sešteješ." }, { value: a * b, why: "Upoštevati moraš vse tri izbire." }]),
            hint: "Izbire so neodvisne; uporabi osnovni izrek kombinatorike (pravilo produkta).",
            data: { given: [`n_1 = ${a}`, `n_2 = ${b}`, `n_3 = ${c}`], find: ["N"] },
            formula: "N = n_1 \\cdot n_2 \\cdot n_3",
            solution: `Za vsako od $${a}$ prvih izbir je $${b}$ drugih, za vsak tak par pa $${c}$ tretjih.\n$N = ${a} \\cdot ${b} \\cdot ${c} = ${a * b * c}$`,
          };
        }
        if (t === 1) {
          const [cls, sit, n] = kombSituation(r);
          return {
            text: `${sit} Katero pravilo uporabimo?`,
            answer: pickAns(r, KOMB_OPTS[cls], KOMB_OPTS.map((o, i) => [o, KOMB_WHY[cls][i]]).filter((_, i) => i !== cls)),
            hint: "Vprašaj se: ali izbiramo vse elemente ali le nekatere, ali je vrstni red pomemben in ali se elementi lahko ponavljajo?",
            data: { given: [`n = ${n}`], find: ["\\text{pravilo}"] },
            formula: ["P_n = n!", "V_n^r = \\dfrac{n!}{(n - r)!}", "\\overline{V}_n^r = n^r", "C_n^r = \\dbinom{n}{r}"],
            solution: `${KOMB_REASON[cls]}\nTo so ${KOMB_OPTS[cls]}.`,
          };
        }
        const kind = r.int(0, 2);
        if (kind === 0) {
          const n = r.int(20, 60);
          return {
            text: `Izračunaj $\\dbinom{${n}}{${n - 2}}$.`,
            answer: num(C(n, 2), null, [{ value: n * (n - 1), why: "Deli še z $2!$." }]),
            hint: "Uporabi simetrijo binomskega simbola.",
            data: { given: [`n = ${n}`], find: [`C_{${n}}^{${n - 2}}`] },
            formula: ["\\dbinom{n}{k} = \\dbinom{n}{n - k}", "\\dbinom{n}{2} = \\dfrac{n(n - 1)}{2}"],
            solution: `$\\dbinom{${n}}{${n - 2}} = \\dbinom{${n}}{2}$\n$\\dbinom{${n}}{2} = \\dfrac{${n} \\cdot ${n - 1}}{2} = ${C(n, 2)}$`,
          };
        }
        if (kind === 1) {
          const n = r.int(8, 25);
          return {
            text: `Izračunaj $\\dfrac{${n}!}{${n - 2}!}$.`,
            answer: num(n * (n - 1), null, [{ value: 2, why: "Fakultet ne moreš krajšati kot števil." }, { value: n * (n - 1) * (n - 2), why: `Faktor $${n - 2}$ je že del $${n - 2}!$ in se pokrajša.` }]),
            hint: `Zapiši $${n}! = ${n} \\cdot ${n - 1} \\cdot ${n - 2}!$ in krajšaj.`,
            data: { given: [`n = ${n}`], find: ["x"] },
            formula: "n! = n \\cdot (n - 1)!",
            solution: `$${n}! = ${n} \\cdot ${n - 1} \\cdot ${n - 2}!$\n$\\dfrac{${n}!}{${n - 2}!} = ${n} \\cdot ${n - 1} = ${n * (n - 1)}$`,
          };
        }
        const n = r.int(10, 18);
        return {
          text: `Izračunaj $\\dbinom{${n}}{${n - 3}}$.`,
          answer: num(C(n, 3), null, [{ value: V(n, 3), why: "Deli še s $3!$." }, { value: C(n, 3) * 2, why: "$3! = 6$, ne 3." }]),
          hint: "Uporabi simetrijo binomskega simbola.",
          data: { given: [`n = ${n}`], find: [`C_{${n}}^{${n - 3}}`] },
          formula: ["\\dbinom{n}{k} = \\dbinom{n}{n - k}", "\\dbinom{n}{3} = \\dfrac{n(n - 1)(n - 2)}{3!}"],
          solution: `$\\dbinom{${n}}{${n - 3}} = \\dbinom{${n}}{3}$\n$\\dbinom{${n}}{3} = \\dfrac{${n} \\cdot ${n - 1} \\cdot ${n - 2}}{6} = ${C(n, 3)}$`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 3);
        if (t === 0) {
          const n = r.int(5, 25);
          if (r.next() < 0.75) {
            const N = C(n, 2);
            const text = r.pick([
              `Na srečanju se je vsak udeleženec z vsakim drugim rokoval natanko enkrat. Bilo je $${N}$ rokovanj. Koliko je bilo udeležencev?`,
              `Na šahovskem turnirju je vsak igralec z vsakim drugim odigral natanko eno partijo, skupaj $${N}$ partij. Koliko je bilo igralcev?`,
              `Skozi vsaki dve od danih točk v ravnini (nobene tri niso na isti premici) narišemo premico. Dobimo $${N}$ premic. Koliko je točk?`,
            ]);
            return {
              text,
              answer: num(n, null, [{ value: (1 + Math.sqrt(1 + 4 * N)) / 2, why: "Vsak par štejemo enkrat: število parov je $\\frac{n(n - 1)}{2}$." }]),
              hint: "Vsak par oseb (točk) šteje enkrat. Zapiši enačbo za $n$ in jo reši.",
              data: { given: [`N = ${N}`], find: ["n"] },
              formula: "\\dbinom{n}{2} = \\dfrac{n(n - 1)}{2}",
              solution: `$\\dfrac{n(n - 1)}{2} = ${N}$\n$n^2 - n - ${2 * N} = 0$\n$n = \\dfrac{1 + \\sqrt{1 + ${8 * N}}}{2} = \\dfrac{1 + ${2 * n - 1}}{2} = ${n}$ (negativna rešitev ni smiselna)`,
            };
          }
          const M = n * (n - 1);
          return {
            text: `Na tekmovanju lahko zlato in srebrno medaljo podelijo na $${M}$ načinov. Koliko je tekmovalcev?`,
            answer: num(n, null, [{ value: (1 + Math.sqrt(1 + 8 * M)) / 2, why: "Vrstni red (zlato, srebro) je pomemben: to so variacije, ne kombinacije." }]),
            hint: "Število razdelitev dveh različnih medalj je $V_n^2 = n(n - 1)$. Reši enačbo za $n$.",
            data: { given: [`V = ${M}`], find: ["n"] },
            formula: "V_n^2 = n(n - 1)",
            solution: `$n(n - 1) = ${M}$\n$n^2 - n - ${M} = 0$\n$n = \\dfrac{1 + \\sqrt{1 + ${4 * M}}}{2} = \\dfrac{1 + ${2 * n - 1}}{2} = ${n}$ (negativna rešitev ni smiselna)`,
          };
        }
        if (t === 1) {
          const n = r.int(8, 20);
          const k = r.int(3, 5);
          const text = r.next() < 0.5
            ? `Društvo ima $${n}$ članov. Izberejo $${k}$-člansko komisijo, nato pa izmed članov komisije še njenega predsednika. Na koliko načinov lahko to storijo?`
            : `Trener izmed $${n}$ igralcev izbere $${k}$ za začetno postavo in med njimi še kapetana. Na koliko načinov lahko izbere?`;
          return {
            text,
            answer: num(C(n, k) * k, null, [{ value: C(n, k), why: "Upoštevaj še izbiro predsednika (kapetana)." }, { value: V(n, k), why: "Vrstni red ostalih izbranih ni pomemben." }, { value: C(n, k) + k, why: "Izbiri sledita druga drugi: možnosti zmnožiš." }]),
            hint: "Najprej izberi skupino (vrstni red ni pomemben), nato v njej eno osebo s posebno vlogo.",
            data: { given: [`n = ${n}`, `k = ${k}`], find: ["N"] },
            formula: "N = \\dbinom{n}{k} \\cdot k",
            solution: `Skupina: $\\dbinom{${n}}{${k}} = ${C(n, k)}$\nPosebna vloga: $${k}$ možnosti\n$N = ${C(n, k)} \\cdot ${k} = ${C(n, k) * k}$`,
          };
        }
        if (t === 2) {
          const m = r.int(5, 9);
          const k = r.int(3, 4);
          const even = r.next() < 0.6;
          const e = even ? Math.floor(m / 2) : 1;
          const ends = even ? Array.from({ length: e }, (_, i) => 2 * (i + 1)).join(", ") : "5";
          const digits = Array.from({ length: m }, (_, i) => i + 1).join(", ");
          const ans = e * V(m - 1, k - 1);
          return {
            text: `Koliko $${k}$-mestnih ${even ? "sodih števil" : "števil, deljivih s 5,"} z različnimi števkami lahko sestavimo iz števk $${digits}$?`,
            answer: num(ans, null, [{ value: V(m, k) / 2, why: "Zadnja števka ima omejeno izbiro; to ni nujno polovica vseh števil." }, { value: V(m, k), why: "Upoštevaj pogoj za zadnjo števko." }, { value: e * m ** (k - 1), why: "Števke se ne smejo ponavljati." }]),
            hint: "Začni pri zadnji števki, ki ima pogoj, nato zapolni ostala mesta.",
            data: { given: [`\\text{števke} = 1, \\ldots, ${m}`, `k = ${k}`], find: ["N"] },
            formula: "V_n^r = \\dfrac{n!}{(n - r)!}",
            solution: `Zadnja števka: $${e}$ ${e === 1 ? "možnost" : e === 2 ? "možnosti" : "možnosti"} (${ends})\nOstalih $${k - 1}$ mest zapolnimo z različnimi izmed preostalih $${m - 1}$ števk: $V_{${m - 1}}^{${k - 1}} = ${V(m - 1, k - 1)}$\n$N = ${e} \\cdot ${V(m - 1, k - 1)} = ${ans}$`,
          };
        }
        const n = r.int(5, 9);
        const n1 = who;
        let n2 = name(r);
        while (n2 === n1) n2 = name(r);
        const kind = r.int(0, 2);
        const cond = [
          `${n1} stoji na enem od obeh krajev vrste`,
          `${n1} stoji ${g(n1, "prvi", "prva")} in ${n2} ${g(n2, "zadnji", "zadnja")}`,
          `${n1} in ${n2} stojita na obeh krajih vrste`,
        ][kind];
        const ans = [2 * fact(n - 1), fact(n - 2), 2 * fact(n - 2)][kind];
        const ms = [
          [{ value: fact(n - 1), why: "Kraja vrste sta dva." }, { value: fact(n), why: "Upoštevaj pogoj." }],
          [{ value: 2 * fact(n - 2), why: "Mesti sta točno določeni; zamenjave ni." }, { value: fact(n - 1), why: "Določeni sta dve mesti, ne eno." }],
          [{ value: fact(n - 2), why: "Na krajih se lahko zamenjata." }, { value: 2 * fact(n - 1), why: "Oba kraja sta zasedena; ostali razporedijo le sredino." }],
        ][kind];
        const sol = [
          `${n1}: $2$ možnosti (levi ali desni kraj)\nOstali: $(${n} - 1)! = ${fact(n - 1)}$\n$N = 2 \\cdot ${fact(n - 1)} = ${ans}$`,
          `Prvo in zadnje mesto sta že določeni.\nOstali: $(${n} - 2)! = ${fact(n - 2)}$\n$N = ${ans}$`,
          `Kraja: $2$ možnosti (kdo je levo)\nOstali: $(${n} - 2)! = ${fact(n - 2)}$\n$N = 2 \\cdot ${fact(n - 2)} = ${ans}$`,
        ][kind];
        return {
          text: `$${n}$ prijateljev, med njimi ${n1} in ${n2}, se postavi v vrsto za fotografijo. Na koliko načinov se lahko postavijo, če ${cond}?`,
          answer: num(ans, null, ms),
          hint: "Najprej postavi osebe s pogojem, nato razporedi ostale.",
          data: { given: [`n = ${n}`], find: ["N"] },
          formula: "P_n = n!",
          solution: sol,
        };
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const m = r.int(5, 9);
        const k = r.int(3, 4);
        const even = r.next() < 0.6;
        const e = even ? Math.floor(m / 2) : 1;
        const zero = V(m, k - 1);
        const other = e * (m - 1) * V(m - 1, k - 2);
        const ans = zero + other;
        const digits = Array.from({ length: m + 1 }, (_, i) => i).join(", ");
        return {
          text: `Koliko $${k}$-mestnih ${even ? "sodih števil" : "števil, deljivih s 5,"} z različnimi števkami lahko sestavimo iz števk $${digits}$?`,
          answer: num(ans, null, [{ value: (e + 1) * V(m, k - 1), why: "Ločiti moraš primer, ko je na koncu 0: le tedaj prva števka nima dodatne omejitve." }, { value: other, why: "Ne pozabi števil, ki se končajo z 0." }, { value: (m * V(m, k - 1)) / 2, why: "Možnosti za zadnjo števko je manj kot polovica, zato to ni polovica vseh števil." }]),
          hint: "Loči dva primera: zadnja števka je 0 ali pa je druga ustrezna števka. Pazi, da se število ne začne z 0.",
          data: { given: [`\\text{števke} = 0, \\ldots, ${m}`, `k = ${k}`], find: ["N"] },
          formula: ["V_n^r = \\dfrac{n!}{(n - r)!}", "N = N_1 + N_2"],
          solution: `Zadnja 0: ostala mesta zapolnimo iz $${m}$ števk: $V_{${m}}^{${k - 1}} = ${zero}$\nZadnja ${even ? `ena od $${e}$ sodih neničelnih števk` : "5"}: prva števka $${m - 1}$ možnosti (ne 0), vmesne $V_{${m - 1}}^{${k - 2}} = ${V(m - 1, k - 2)}$, skupaj $${e} \\cdot ${m - 1} \\cdot ${V(m - 1, k - 2)} = ${other}$\n$N = ${zero} + ${other} = ${ans}$`,
        };
      }
      if (t === 1) {
        const a = r.int(3, 7);
        const b = r.int(2, 5);
        const tot = C(a + b, a);
        const p = r.int(1, a - 1);
        const q = r.int(1, b - 1);
        const through = C(p + q, p) * C(a - p + b - q, a - p);
        const intro = `Mreža ulic je pravokotna. Križišče B leži ${nw(a, "odsek", "odseka", "odseke", "odsekov")} vzhodno in ${nw(b, "odsek", "odseka", "odseke", "odsekov")} severno od križišča A. Hodimo le proti vzhodu ali severu.`;
        const mode = r.int(0, 2);
        if (mode === 0) {
          return {
            text: `${intro} Koliko je najkrajših poti od A do B?`,
            answer: num(tot, null, [{ value: fact(a + b), why: "Koraki v isto smer so med seboj enaki: deli z $a!\\,b!$." }, { value: 2 ** (a + b), why: "Število korakov v vsako smer je določeno; ne izbiraš poljubno na vsakem koraku." }, { value: a * b, why: "Pot je zaporedje korakov; izberi, kateri koraki gredo proti severu." }]),
            hint: "Vsaka najkrajša pot je zaporedje korakov V in S. Izbrati moraš, kateri od korakov gredo proti severu.",
            data: { given: [`a = ${a}`, `b = ${b}`], find: ["N"] },
            formula: "N = \\dbinom{a + b}{b}",
            solution: `Pot ima $${a} + ${b} = ${a + b}$ korakov, od tega $${b}$ proti severu.\n$N = \\dbinom{${a + b}}{${b}} = ${tot}$`,
          };
        }
        const cTxt = `Križišče C leži ${nw(p, "odsek", "odseka", "odseke", "odsekov")} vzhodno in ${nw(q, "odsek", "odseka", "odseke", "odsekov")} severno od A.`;
        const steps = `Od A do C: $\\dbinom{${p + q}}{${q}} = ${C(p + q, p)}$, od C do B: $\\dbinom{${a - p + b - q}}{${b - q}} = ${C(a - p + b - q, a - p)}$\nSkozi C: $${C(p + q, p)} \\cdot ${C(a - p + b - q, a - p)} = ${through}$`;
        if (mode === 1) {
          return {
            text: `${intro} ${cTxt} Koliko najkrajših poti od A do B gre skozi C?`,
            answer: num(through, null, [{ value: C(p + q, p) + C(a - p + b - q, a - p), why: "Vsako pot do C lahko nadaljuješ s katero koli potjo od C: možnosti zmnožiš." }, { value: tot, why: "To so vse poti; šteti moraš le tiste skozi C." }]),
            hint: "Pot razdeli na dva dela: od A do C in od C do B.",
            data: { given: [`a = ${a}`, `b = ${b}`, `p = ${p}`, `q = ${q}`], find: ["N"] },
            formula: "N = \\dbinom{p + q}{q} \\cdot \\dbinom{(a - p) + (b - q)}{b - q}",
            solution: steps,
          };
        }
        return {
          text: `${intro} ${cTxt} Koliko najkrajših poti od A do B se križišču C izogne?`,
          answer: num(tot - through, null, [{ value: through, why: "To so poti skozi C; odšteti jih moraš od vseh." }, { value: tot, why: "Odšteti moraš poti skozi C." }]),
          hint: "Od vseh najkrajših poti odštej tiste, ki gredo skozi C.",
          data: { given: [`a = ${a}`, `b = ${b}`, `p = ${p}`, `q = ${q}`], find: ["N"] },
          formula: ["N = \\dbinom{a + b}{b} - N_C"],
          solution: `Vseh poti: $\\dbinom{${a + b}}{${b}} = ${tot}$\n${steps}\n$N = ${tot} - ${through} = ${tot - through}$`,
        };
      }
      if (r.next() < 0.5) {
        const gN = r.int(4, 8);
        const bN = r.int(3, 7);
        const k = r.int(3, 4);
        const ans = C(gN, k) + bN * C(gN, k - 1);
        return {
          text: `V skupini je $${gN}$ deklet in $${bN}$ fantov. Na koliko načinov lahko izberemo $${k}$-člansko ekipo, v kateri je največ en fant?`,
          answer: num(ans, null, [{ value: bN * C(gN, k - 1), why: "»Največ en« vključuje tudi ekipe brez fantov." }, { value: C(gN, k), why: "»Največ en« vključuje tudi ekipe z enim fantom." }]),
          hint: "Loči dva primera: ekipa brez fantov in ekipa z natanko enim fantom.",
          data: { given: [`n_d = ${gN}`, `n_f = ${bN}`, `k = ${k}`], find: ["N"] },
          formula: "N = \\dbinom{n_d}{k} + n_f \\cdot \\dbinom{n_d}{k - 1}",
          solution: `Brez fantov: $\\dbinom{${gN}}{${k}} = ${C(gN, k)}$\nZ enim fantom: $${bN} \\cdot \\dbinom{${gN}}{${k - 1}} = ${bN * C(gN, k - 1)}$\n$N = ${C(gN, k)} + ${bN * C(gN, k - 1)} = ${ans}$`,
        };
      }
      const n = r.int(7, 12);
      const k = r.int(3, 5);
      let n2 = name(r);
      while (n2 === who) n2 = name(r);
      const ans = C(n, k) - C(n - 2, k - 2);
      return {
        text: `Iz $${n}$ dijakov, med katerimi sta ${who} in ${n2}, izbiramo $${k}$-člansko ekipo. ${who} in ${n2} nočeta biti skupaj v ekipi. Na koliko načinov lahko izberemo ekipo?`,
        answer: num(ans, null, [{ value: C(n - 2, k), why: "Ekipa sme vsebovati enega od njiju, le obeh ne." }, { value: C(n - 2, k) + C(n - 2, k - 1), why: "V ekipi je lahko eden ali drugi: to sta dve različni možnosti." }]),
        hint: "Od vseh ekip odštej tiste, v katerih sta oba.",
        data: { given: [`n = ${n}`, `k = ${k}`], find: ["N"] },
        formula: "N = \\dbinom{n}{k} - \\dbinom{n - 2}{k - 2}",
        solution: `Vseh ekip: $\\dbinom{${n}}{${k}} = ${C(n, k)}$\nEkip z obema: $\\dbinom{${n - 2}}{${k - 2}} = ${C(n - 2, k - 2)}$\n$N = ${C(n, k)} - ${C(n - 2, k - 2)} = ${ans}$`,
      };
    },
  },
];

export const GIMNAZIJA_MAT_SS4 = wrapGens(GENS);
