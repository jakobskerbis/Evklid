// Generatorji nalog za kemijo (OŠ in gimnazija).
import { roundHalfUp } from "../check.js";
import { tx, withMistakes, choicesWhy } from "./mat.js";

// Elementi: simbol, ime, Z, relativna atomska masa (zaokrožena, kot v šolskih periodnih sistemih)
const EL = {
  H: ["vodik", 1, 1.01], He: ["helij", 2, 4.0], Li: ["litij", 3, 6.94], C: ["ogljik", 6, 12.01], N: ["dušik", 7, 14.01],
  O: ["kisik", 8, 16.0], F: ["fluor", 9, 19.0], Na: ["natrij", 11, 22.99], Mg: ["magnezij", 12, 24.31],
  Al: ["aluminij", 13, 26.98], S: ["žveplo", 16, 32.07], Cl: ["klor", 17, 35.45], K: ["kalij", 19, 39.1],
  Ca: ["kalcij", 20, 40.08], Fe: ["železo", 26, 55.85], Cu: ["baker", 29, 63.55], Zn: ["cink", 30, 65.38],
};
// Najpogostejši izotop (masno število) za vaje o zgradbi atoma
const MASS_NUMBER = { H: 1, He: 4, Li: 7, C: 12, N: 14, O: 16, F: 19, Na: 23, Mg: 24, Al: 27, S: 32, Cl: 35, K: 39, Ca: 40, Fe: 56, Cu: 63, Zn: 65 };

const COMPOUNDS = [
  ["H2O", "vode", { H: 2, O: 1 }],
  ["CO2", "ogljikovega dioksida", { C: 1, O: 2 }],
  ["NaCl", "natrijevega klorida", { Na: 1, Cl: 1 }],
  ["CaCO3", "kalcijevega karbonata", { Ca: 1, C: 1, O: 3 }],
  ["H2SO4", "žveplove(VI) kisline", { H: 2, S: 1, O: 4 }],
  ["NaOH", "natrijevega hidroksida", { Na: 1, O: 1, H: 1 }],
  ["C6H12O6", "glukoze", { C: 6, H: 12, O: 6 }],
  ["NH3", "amonijaka", { N: 1, H: 3 }],
  ["MgO", "magnezijevega oksida", { Mg: 1, O: 1 }],
  ["CH4", "metana", { C: 1, H: 4 }],
  ["HCl", "klorovodika", { H: 1, Cl: 1 }],
  ["KOH", "kalijevega hidroksida", { K: 1, O: 1, H: 1 }],
  ["CaO", "kalcijevega oksida", { Ca: 1, O: 1 }],
  ["Al2O3", "aluminijevega oksida", { Al: 2, O: 3 }],
  ["Fe2O3", "železovega(III) oksida", { Fe: 2, O: 3 }],
  ["SO2", "žveplovega dioksida", { S: 1, O: 2 }],
  ["CuSO4", "bakrovega(II) sulfata", { Cu: 1, S: 1, O: 4 }],
  ["MgCl2", "magnezijevega klorida", { Mg: 1, Cl: 2 }],
  ["HNO3", "dušikove(V) kisline", { H: 1, N: 1, O: 3 }],
  ["C2H5OH", "etanola", { C: 2, H: 6, O: 1 }],
];
// Rodilnik imen elementov (»masni delež kisika«).
const GEN = { H: "vodika", C: "ogljika", N: "dušika", O: "kisika", Na: "natrija", Mg: "magnezija", Al: "aluminija", S: "žvepla", Cl: "klora", K: "kalija", Ca: "kalcija", Fe: "železa", Cu: "bakra" };
// Tipični napačni molski masi: brez indeksov (vsak element enkrat) in z vrstnimi števili namesto atomskih mas.
const molarNoIdx = (comp) => Object.keys(comp).reduce((s, e) => s + EL[e][2], 0);
const molarZ = (comp) => Object.entries(comp).reduce((s, [e, n]) => s + EL[e][1] * n, 0);
const molar = (comp) => Object.entries(comp).reduce((s, [e, n]) => s + EL[e][2] * n, 0);
const formulaTex = (f) => f.replace(/(\d+)/g, "_{$1}");

// Molska masa kot vsota relativnih atomskih mas (upoštevamo indekse):
// molarTerms(comp, f) → "2 \cdot f(H) + f(O)", kjer f(e) vrne simbol ali število.
const molarTerms = (comp, f) => Object.entries(comp).map(([e, k]) => `${k === 1 ? "" : `${k} \\cdot `}${f(e)}`).join(" + ");
// Formula za molsko maso, npr. "M(\mathrm{H_{2}O}) = 2 \cdot A_r(\mathrm{H}) + A_r(\mathrm{O})".
const molarFormula = (f, comp) => `M(\\mathrm{${formulaTex(f)}}) = ${molarTerms(comp, (e) => `A_r(\\mathrm{${e}})`)}`;
// Korak izračuna molske mase s števili (zaokroženo na dve decimalki, kot v odgovoru).
// Vrstice: vstavljene atomske mase, (zmnožki pri indeksih) in vsota.
const molarStep = (f, comp, M) => {
  const MT = `M(\\mathrm{${formulaTex(f)}})`;
  const lines = [`$${MT} = ${molarTerms(comp, (e) => tx(EL[e][2]))}$`];
  if (Object.values(comp).some((k) => k > 1)) lines.push(`$${MT} = ${Object.entries(comp).map(([e, k]) => tx(roundHalfUp(EL[e][2] * k, 2))).join(" + ")}$`);
  lines.push(`$${MT} = ${tx(roundHalfUp(M, 2), 2)}\\ \\mathrm{g/mol}$`);
  return lines.join("\n");
};
// Število atomov v formuli, tudi z oklepaji: atomCount("Al2(SO4)3") → { Al: 2, S: 3, O: 12 }.
function atomCount(f) {
  const stack = [{}];
  let i = 0;
  const add = (o, e, n) => (o[e] = (o[e] || 0) + n);
  while (i < f.length) {
    if (f[i] === "(") {
      stack.push({});
      i++;
    } else if (f[i] === ")") {
      const m = f.slice(i + 1).match(/^\d*/)[0];
      i += 1 + m.length;
      const top = stack.pop();
      for (const [e, n] of Object.entries(top)) add(stack.at(-1), e, n * (m ? Number(m) : 1));
    } else {
      const m = f.slice(i).match(/^([A-Z][a-z]?)(\d*)/);
      i += m[0].length;
      add(stack.at(-1), m[1], m[2] ? Number(m[2]) : 1);
    }
  }
  return stack[0];
}

// Enačbe z znanimi najmanjšimi koeficienti (raven 1: preproste sinteze in razkroji,
// raven 2: več snovi ali liha števila atomov, raven 3: gorenje organskih snovi, oklepaji, redoks)
const EQUATIONS = [
  { l: ["H2", "Cl2"], r: ["HCl"], c: [1, 1, 2], level: 1 },
  { l: ["Ca", "O2"], r: ["CaO"], c: [2, 1, 2], level: 1 },
  { l: ["K", "Cl2"], r: ["KCl"], c: [2, 1, 2], level: 1 },
  { l: ["C", "O2"], r: ["CO"], c: [2, 1, 2], level: 1 },
  { l: ["H2O2"], r: ["H2O", "O2"], c: [2, 2, 1], level: 1 },
  { l: ["HgO"], r: ["Hg", "O2"], c: [2, 2, 1], level: 1 },
  { l: ["Cu", "O2"], r: ["CuO"], c: [2, 1, 2], level: 1 },
  { l: ["Fe", "Cl2"], r: ["FeCl3"], c: [2, 3, 2], level: 2 },
  { l: ["KClO3"], r: ["KCl", "O2"], c: [2, 2, 3], level: 2 },
  { l: ["Na", "H2O"], r: ["NaOH", "H2"], c: [2, 2, 2, 1], level: 2 },
  { l: ["N2", "O2"], r: ["NO2"], c: [1, 2, 2], level: 2 },
  { l: ["SO2", "O2"], r: ["SO3"], c: [2, 1, 2], level: 2 },
  { l: ["Mg", "HCl"], r: ["MgCl2", "H2"], c: [1, 2, 1, 1], level: 2 },
  { l: ["Na", "O2"], r: ["Na2O"], c: [4, 1, 2], level: 2 },
  { l: ["C4H10", "O2"], r: ["CO2", "H2O"], c: [2, 13, 8, 10], level: 3 },
  { l: ["C2H5OH", "O2"], r: ["CO2", "H2O"], c: [1, 3, 2, 3], level: 3 },
  { l: ["NH3", "O2"], r: ["NO", "H2O"], c: [4, 5, 4, 6], level: 3 },
  { l: ["Al", "H2SO4"], r: ["Al2(SO4)3", "H2"], c: [2, 3, 1, 3], level: 3 },
  { l: ["C6H12O6", "O2"], r: ["CO2", "H2O"], c: [1, 6, 6, 6], level: 3 },
  { l: ["FeS2", "O2"], r: ["Fe2O3", "SO2"], c: [4, 11, 2, 8], level: 3 },
  { l: ["P4", "O2"], r: ["P4O10"], c: [1, 5, 1], level: 3 },
  { l: ["Fe2O3", "C"], r: ["Fe", "CO2"], c: [2, 3, 4, 3], level: 3 },
  { l: ["Ca(OH)2", "H3PO4"], r: ["Ca3(PO4)2", "H2O"], c: [3, 2, 1, 6], level: 3 },
  { l: ["H2", "O2"], r: ["H2O"], c: [2, 1, 2], level: 1 },
  { l: ["Na", "Cl2"], r: ["NaCl"], c: [2, 1, 2], level: 1 },
  { l: ["Mg", "O2"], r: ["MgO"], c: [2, 1, 2], level: 1 },
  { l: ["N2", "H2"], r: ["NH3"], c: [1, 3, 2], level: 1 },
  { l: ["CH4", "O2"], r: ["CO2", "H2O"], c: [1, 2, 1, 2], level: 2 },
  { l: ["Al", "O2"], r: ["Al2O3"], c: [4, 3, 2], level: 2 },
  { l: ["Fe", "O2"], r: ["Fe2O3"], c: [4, 3, 2], level: 2 },
  { l: ["HCl", "NaOH"], r: ["NaCl", "H2O"], c: [1, 1, 1, 1], level: 1 },
  { l: ["C3H8", "O2"], r: ["CO2", "H2O"], c: [1, 5, 3, 4], level: 3 },
  { l: ["Zn", "HCl"], r: ["ZnCl2", "H2"], c: [1, 2, 1, 1], level: 2 },
  { l: ["C2H6", "O2"], r: ["CO2", "H2O"], c: [2, 7, 4, 6], level: 3 },
  { l: ["Al", "HCl"], r: ["AlCl3", "H2"], c: [2, 6, 2, 3], level: 3 },
  { l: ["CaCO3", "HCl"], r: ["CaCl2", "H2O", "CO2"], c: [1, 2, 1, 1, 1], level: 2 },
  { l: ["Fe2O3", "CO"], r: ["Fe", "CO2"], c: [1, 3, 2, 3], level: 3 },
];

export const KEM_GENERATORS = [
  {
    id: "zgradba-atoma",
    topics: ["KEM-OS-8/zgradba-atoma", "KEM-SS-1/zgradba-atoma"],
    gen(level, r) {
      const sym = r.pick(Object.keys(MASS_NUMBER));
      const [name, Z] = EL[sym];
      const A = MASS_NUMBER[sym];
      const ask = level === 1 ? r.pick(["p", "e"]) : r.pick(["n", "n", "e-ion"]);
      if (ask === "e-ion" && ["Na", "Mg", "Al", "K", "Ca", "F", "Cl", "O", "S"].includes(sym)) {
        const charge = { Na: 1, K: 1, Mg: 2, Ca: 2, Al: 3, F: -1, Cl: -1, O: -2, S: -2 }[sym];
        const ion = `\\mathrm{${sym}}^{${Math.abs(charge) === 1 ? "" : Math.abs(charge)}${charge > 0 ? "+" : "-"}}`;
        return {
          text: `Koliko elektronov ima ion $${ion}$? (Vrstno število elementa ${name} je ${Z}.)`,
          answer: withMistakes({ type: "number", value: Z - charge }, [
            [Z + charge, charge > 0 ? "Pozitiven ion je elektrone oddal, zato jih ima manj kot protonov." : "Negativen ion je elektrone sprejel, zato jih ima več kot protonov."],
            [Z, "Ion ni nevtralen: upoštevaj njegov naboj."],
          ]),
          hint: "Pozitiven ion je oddal elektrone, negativen jih je sprejel. Naboj pove, koliko.",
          data: { given: [`\\text{ion} = ${ion}`, `Z = ${Z}`], find: ["N(e^-)"] },
          formula: ["N(p^+) = Z", "N(e^-) = N(p^+) - \\text{naboj iona}"],
          solution: `$N(p^+) = Z = ${Z}$\n$N(e^-) = N(p^+) - \\text{naboj iona} = ${Z} - (${charge > 0 ? "+" : ""}${charge}) = ${Z - charge}$ elektronov`,
        };
      }
      if (ask === "n" || ask === "e-ion") {
        return {
          text: `Atom elementa ${name} ($\\mathrm{^{${A}}_{${Z}}${sym}}$): koliko nevtronov ima v jedru?`,
          answer: withMistakes({ type: "number", value: A - Z }, [
            [A, "Masno število šteje protone in nevtrone skupaj: odštej protone."],
            [Z, "Vrstno število je število protonov, ne nevtronov."],
            [A + Z, "Nevtrone dobiš z odštevanjem: A − Z."],
          ]),
          hint: "Masno število = protoni + nevtroni. Vrstno število = protoni.",
          data: { given: [`A = ${A}`, `Z = ${Z}`], find: ["N(n^0)"] },
          formula: "N(n^0) = A - Z",
          solution: `Masno število $A = ${A}$ (protoni + nevtroni), vrstno število $Z = ${Z}$ (protoni).\n$N(n^0) = A - Z = ${A} - ${Z} = ${A - Z}$ nevtronov`,
        };
      }
      return {
        text: `Element ${name} ima vrstno število ${Z}. Koliko ${ask === "p" ? "protonov" : "elektronov"} ima nevtralen atom?`,
        answer: withMistakes({ type: "number", value: Z }, [
          [A, "Masno število šteje protone in nevtrone; protonov je toliko, kot pove vrstno število."],
          [A - Z, "To je število nevtronov."],
        ]),
        hint: "Vrstno število pove število protonov. V nevtralnem atomu je elektronov enako kot protonov.",
        data: { given: [`Z = ${Z}`], find: [ask === "p" ? "N(p^+)" : "N(e^-)"] },
        formula: ask === "p" ? "N(p^+) = Z" : ["N(p^+) = Z", "N(e^-) = N(p^+)"],
        solution: ask === "p" ? `Vrstno število pove število protonov v jedru.\n$N(p^+) = Z = ${Z}$ protonov` : `$N(p^+) = Z = ${Z}$\nAtom je nevtralen, zato je elektronov enako kot protonov: $N(e^-) = ${Z}$ elektronov`,
      };
    },
  },
  {
    id: "urejanje-enacb",
    topics: ["KEM-OS-8/urejanje-kemijskih-enacb", "KEM-SS-1/urejanje-enacb", "KEM-OS-8/kemijska-reakcija"],
    gen(level, r) {
      const pool = EQUATIONS.filter((e) => (level === 1 ? e.level === 1 : e.level <= level && e.level >= level - 1));
      const eq = r.pick(pool.length ? pool : EQUATIONS);
      const side = (arr, off) => arr.map((f, i) => `\\square_{${off + i + 1}}\\,\\mathrm{${formulaTex(f)}}`).join(" + ");
      // Preverjanje: za vsak element štejemo atome na levi in desni (koeficient · indeks).
      const coef = (k) => (k === 1 ? "" : k);
      const count = (arr, off, el) => arr.map((f, i) => [eq.c[off + i], atomCount(f)[el] || 0]).filter(([, n]) => n);
      const sumTex = (terms) => {
        const parts = terms.map(([k, n]) => (k === 1 ? `${n}` : n === 1 ? `${k}` : `${k} \\cdot ${n}`));
        const total = terms.reduce((sum, [k, n]) => sum + k * n, 0);
        return parts.length === 1 && parts[0] === String(total) ? parts[0] : `${parts.join(" + ")} = ${total}`;
      };
      const elements = [...new Set([...eq.l, ...eq.r].flatMap((f) => Object.keys(atomCount(f))))];
      const checkLines = elements.map((el) => `$\\mathrm{${el}}$: levo $${sumTex(count(eq.l, 0, el))}$, desno $${sumTex(count(eq.r, eq.l.length, el))}$`);
      const eqTex = `${eq.l.map((f, i) => `${coef(eq.c[i])}\\,\\mathrm{${formulaTex(f)}}`).join(" + ")} \\rightarrow ${eq.r.map((f, i) => `${coef(eq.c[eq.l.length + i])}\\,\\mathrm{${formulaTex(f)}}`).join(" + ")}`;
      return {
        text: `Uredi enačbo. Vpiši koeficiente v kvadratkih po vrsti, ločene z vejico:\n\n$$${side(eq.l, 0)} \\rightarrow ${side(eq.r, eq.l.length)}$$`,
        answer: { type: "coefficients", values: eq.c },
        hint: "Preštej atome vsakega elementa na obeh straneh. Najprej uredi element, ki se pojavi v najmanj snoveh; kisik in vodik pogosto na koncu.",
        // Urejanje enačbe nima številskih podatkov ne formule (velja le ohranitev števila atomov).
        data: false,
        formula: false,
        solution: `$$${eqTex}$$\nPreverimo število atomov (koeficient · indeks):\n${checkLines.join("\n")}\nKoeficienti: ${eq.c.join(", ")}`,
        inputHint: `npr. ${eq.c.map(() => "1").join(", ")}`,
      };
    },
  },
  {
    id: "molska-masa",
    topics: ["KEM-OS-9/mnozina-snovi", "KEM-SS-1/mnozina-snovi", "KEM-OS-9/racunanje-z-mnozino-snovi", "KEM-SS-1/stehiometrija"],
    gen(level, r) {
      const [f, name, comp] = r.pick(COMPOUNDS);
      const Mbad = [
        [molarNoIdx(comp), "Upoštevaj indekse: vsak atom v formuli šteje posebej."],
        [molarZ(comp), "Seštej relativne atomske mase, ne vrstnih števil."],
      ];
      const M = molar(comp);
      const fTex = `\\mathrm{${formulaTex(f)}}`;
      const Mtx = tx(roundHalfUp(M, 2), 2);
      // Isti zapis atomskih mas v besedilu in med podatki.
      const atomData = Object.entries(comp).map(([e]) => `A_r(\\mathrm{${e}}) = ${tx(EL[e][2])}`);
      const atoms = atomData.map((a) => `$${a}$`).join(", ");
      const compound = `\\text{formula} = ${fTex}`;
      if (level === 1) {
        return {
          text: `Izračunaj molsko maso ${name} ($${fTex}$). Podatki: ${atoms}. Zaokroži na dve decimalki.`,
          answer: withMistakes({ type: "number", value: M, unit: "g/mol", decimals: 2, unitAlternatives: ["gmol-1", "g/mol"] }, Mbad),
          hint: "Seštej relativne atomske mase vseh atomov v formuli (upoštevaj indekse).",
          data: { given: [compound, ...atomData], find: [`M(${fTex})`] },
          formula: molarFormula(f, comp),
          solution: `$${molarFormula(f, comp)}$\n${molarStep(f, comp, M)}`,
        };
      }
      if (level === 2) {
        const m = r.dec(1, 200, 1);
        return {
          text: `Koliko molov je $${tx(m)}\\ \\mathrm{g}$ ${name} ($${fTex}$)? Podatki: ${atoms}. Zaokroži na tri decimalke.`,
          answer: withMistakes({ type: "number", value: m / M, unit: "mol", decimals: 3, alsoAccept: [m / roundHalfUp(M, 1), m / roundHalfUp(M, 2)] }, [
            [m * M, "Množina je masa deljeno z molsko maso, ne zmnožek."],
            [m / molarNoIdx(comp), "Pri molski masi upoštevaj indekse v formuli."],
            [M / m, "Maso deliš z molsko maso, ne obratno."],
          ]),
          hint: "Najprej izračunaj molsko maso $M$, nato $n = \\dfrac{m}{M}$.",
          data: { given: [`m = ${tx(m)}\\ \\mathrm{g}`, compound, ...atomData], find: ["n"] },
          formula: [molarFormula(f, comp), "n = \\dfrac{m}{M}"],
          solution: `${molarStep(f, comp, M)}\n$n = \\dfrac{m}{M} = \\dfrac{${tx(m)}\\ \\mathrm{g}}{${Mtx}\\ \\mathrm{g/mol}} \\approx ${tx(roundHalfUp(m / M, 3), 3)}\\ \\mathrm{mol}$`,
        };
      }
      if (r.next() < 0.5) {
        // Masni delež elementa v spojini (prenos: več korakov).
        const [el, k] = r.pick(Object.entries(comp));
        const part = EL[el][2] * k;
        const w = (part / M) * 100;
        const atomsAll = Object.values(comp).reduce((s2, x) => s2 + x, 0);
        return {
          text: `Kolikšen je masni delež ${GEN[el]} v spojini $${fTex}$? Podatki: ${atoms}. Rezultat v odstotkih zaokroži na eno decimalko.`,
          answer: withMistakes({ type: "number", value: w, unit: "%", decimals: 1, alsoAccept: [(roundHalfUp(part, 2) / roundHalfUp(M, 2)) * 100] }, [
            [k > 1 ? (EL[el][2] / M) * 100 : NaN, "Upoštevaj, koliko atomov tega elementa je v formuli."],
            [(k / atomsAll) * 100, "Masni delež računaš z masami atomov, ne s številom atomov."],
            [(part / M), "Delež pomnoži s 100 %, da dobiš odstotke."],
          ]),
          hint: `Izračunaj molsko maso spojine in maso vseh atomov ${GEN[el]} v formuli. Nato deli.`,
          data: { given: [compound, ...atomData], find: [`w(\\mathrm{${el}})`] },
          formula: [molarFormula(f, comp), `w(\\mathrm{${el}}) = \\dfrac{${k === 1 ? "" : `${k} \\cdot `}A_r(\\mathrm{${el}})}{M} \\cdot 100\\ \\%`],
          solution: `${molarStep(f, comp, M)}\nMasa atomov ${GEN[el]}: $${k === 1 ? "" : `${k} \\cdot `}${tx(EL[el][2])} = ${tx(roundHalfUp(part, 2))}\\ \\mathrm{g/mol}$\n$w(\\mathrm{${el}}) = \\dfrac{${tx(roundHalfUp(part, 2))}}{${Mtx}} \\cdot 100\\ \\% \\approx ${tx(roundHalfUp(w, 1), 1)}\\ \\%$`,
        };
      }
      const n = r.dec(0.05, 5, 2);
      return {
        text: `Kolikšna je masa $${tx(n)}\\ \\mathrm{mol}$ ${name} ($${fTex}$)? Podatki: ${atoms}. Zaokroži na dve decimalki.`,
        answer: withMistakes({ type: "number", value: n * M, unit: "g", decimals: 2, alsoAccept: [n * roundHalfUp(M, 1), n * roundHalfUp(M, 2)] }, [
          [n / M, "Maso dobiš tako, da množino pomnožiš z molsko maso, ne deliš."],
          [n * molarNoIdx(comp), "Pri molski masi upoštevaj indekse v formuli."],
          [M / n, "Masa je množina krat molska masa."],
        ]),
        hint: "$m = n \\cdot M$",
        data: { given: [`n = ${tx(n)}\\ \\mathrm{mol}`, compound, ...atomData], find: ["m"] },
        formula: [molarFormula(f, comp), "m = n \\cdot M"],
        solution: `${molarStep(f, comp, M)}\n$m = n \\cdot M = ${tx(n)}\\ \\mathrm{mol} \\cdot ${Mtx}\\ \\mathrm{g/mol} \\approx ${tx(roundHalfUp(n * M, 2), 2)}\\ \\mathrm{g}$`,
      };
    },
  },
  {
    id: "masni-delez",
    topics: ["KEM-OS-9/raztopine", "KEM-SS-1/raztopine"],
    gen(level, r) {
      if (level === 2) {
        // Obratna naloga: koliko topljenca oz. vode potrebujemo za raztopino z danim masnim deležem.
        const w = r.pick([2, 4, 5, 8, 10, 12, 15, 20, 25]);
        const mr = r.pick([50, 80, 100, 150, 200, 250, 300, 400, 500]);
        const [what, whatGen] = r.pick([["sol", "soli"], ["sladkor", "sladkorja"], ["sodo", "sode"]]);
        const ms = (w * mr) / 100;
        const askWater = r.next() < 0.5;
        const msTx = tx(ms);
        return {
          text: `Pripraviti želimo $${mr}\\ \\mathrm{g}$ raztopine, v kateri je masni delež ${whatGen} $${w}\\ \\%$. Koliko gramov ${askWater ? "vode" : whatGen} potrebujemo? Zaokroži na eno decimalko.`,
          answer: withMistakes(
            { type: "number", value: askWater ? mr - ms : ms, unit: "g", decimals: 1 },
            askWater
              ? [
                  [ms, `To je masa ${whatGen}; vode je preostanek do mase raztopine.`],
                  [mr, `Raztopina ni le voda: od njene mase odštej maso ${whatGen}.`],
                  [mr + ms, `Masa raztopine že vsebuje ${what}: maso ${whatGen} odštej, ne prištej.`],
                ]
              : [
                  [w * mr, "Odstotek pretvori v delež: deli s 100."],
                  [mr - ms, "To je masa vode, ne topljenca."],
                  [(100 * mr) / w, "Masa topljenca je delež krat masa raztopine, ne deljeno."],
                ],
          ),
          hint: askWater ? `Najprej izračunaj maso ${whatGen}: $m = w \\cdot m_{raztopine}$. Ostalo je voda.` : "Masa topljenca je masni delež krat masa raztopine.",
          data: { given: [`m_{raztopine} = ${mr}\\ \\mathrm{g}`, `w = ${w}\\ \\%`], find: [askWater ? "m_{vode}" : "m_{topljenca}"] },
          formula: ["m_{topljenca} = w \\cdot m_{raztopine}", "m_{vode} = m_{raztopine} - m_{topljenca}"],
          solution: `$w = ${w}\\ \\% = ${tx(w / 100)}$\n$m_{topljenca} = w \\cdot m_{raztopine} = ${tx(w / 100)} \\cdot ${mr}\\ \\mathrm{g} = ${msTx}\\ \\mathrm{g}$${askWater ? `\n$m_{vode} = m_{raztopine} - m_{topljenca} = ${mr}\\ \\mathrm{g} - ${msTx}\\ \\mathrm{g} = ${tx(mr - ms)}\\ \\mathrm{g}$` : ""}`,
        };
      }
      if (level === 1) {
        const ms = r.int(2, 60);
        const mw = r.int(50, 500);
        const w = (ms / (ms + mw)) * 100;
        return {
          text: `V $${mw}\\ \\mathrm{g}$ vode raztopimo $${ms}\\ \\mathrm{g}$ sladkorja. Kolikšen je masni delež sladkorja v raztopini v odstotkih? Zaokroži na eno decimalko.`,
          answer: withMistakes({ type: "number", value: w, unit: "%", decimals: 1 }, [
            [(ms / mw) * 100, "Masa raztopine je topljenec + voda, ne le voda."],
            [ms / (ms + mw), "Delež pomnoži s 100 %, da dobiš odstotke."],
            [(mw / (ms + mw)) * 100, "To je masni delež vode, ne sladkorja."],
          ]),
          hint: "$w = \\dfrac{m_{topljenca}}{m_{raztopine}}$. Masa raztopine je topljenec + voda!",
          data: { given: [`m_{vode} = ${mw}\\ \\mathrm{g}`, `m_{sladkorja} = ${ms}\\ \\mathrm{g}`], find: ["w_{sladkorja}"] },
          formula: ["m_{raztopine} = m_{topljenca} + m_{topila}", "w = \\dfrac{m_{topljenca}}{m_{raztopine}} \\cdot 100\\ \\%"],
          solution: `$m_{raztopine} = m_{sladkorja} + m_{vode} = ${ms}\\ \\mathrm{g} + ${mw}\\ \\mathrm{g} = ${ms + mw}\\ \\mathrm{g}$\n$w_{sladkorja} = \\dfrac{m_{sladkorja}}{m_{raztopine}} \\cdot 100\\ \\% = \\dfrac{${ms}\\ \\mathrm{g}}{${ms + mw}\\ \\mathrm{g}} \\cdot 100\\ \\% \\approx ${tx(roundHalfUp(w, 1), 1)}\\ \\%$`,
        };
      }
      const n = r.dec(0.01, 0.5, 2);
      const V = r.pick([100, 250, 500, 1000]);
      return {
        text: `V $${V}\\ \\mathrm{mL}$ raztopine je raztopljenih $${tx(n)}\\ \\mathrm{mol}$ NaCl. Kolikšna je množinska koncentracija v $\\mathrm{mol/L}$? Zaokroži na tri decimalke.`,
        answer: withMistakes({ type: "number", value: n / (V / 1000), unit: "mol/L", decimals: 3, unitAlternatives: ["mol/l", "m"] }, [
          [n / V, "Prostornino moraš pretvoriti iz mL v L."],
          [n * (V / 1000), "Koncentracija je množina deljeno s prostornino, ne zmnožek."],
        ]),
        hint: "$c = \\dfrac{n}{V}$. Prostornino pretvori v litre.",
        data: { given: [`V = ${V}\\ \\mathrm{mL}`, `n(\\mathrm{NaCl}) = ${tx(n)}\\ \\mathrm{mol}`], find: ["c"] },
        formula: "c = \\dfrac{n}{V}",
        solution: `$V = ${V}\\ \\mathrm{mL} = ${tx(V / 1000)}\\ \\mathrm{L}$\n$c = \\dfrac{n}{V} = \\dfrac{${tx(n)}\\ \\mathrm{mol}}{${tx(V / 1000)}\\ \\mathrm{L}} = ${tx(roundHalfUp(n / (V / 1000), 3), 3)}\\ \\mathrm{mol/L}$`,
      };
    },
  },
  {
    id: "periodni-sistem",
    topics: ["KEM-OS-8/periodni-sistem", "KEM-SS-1/periodni-sistem", "KEM-OS-8/kovine", "KEM-OS-8/nekovine"],
    gen(level, r) {
      const groups = { Li: 1, Na: 1, K: 1, Mg: 2, Ca: 2, Al: 13, C: 14, N: 15, O: 16, S: 16, F: 17, Cl: 17, He: 18 };
      const sym = r.pick(Object.keys(groups));
      const [name] = EL[sym];
      if (level === 1) {
        const metal = ["Li", "Na", "K", "Mg", "Ca", "Al"].includes(sym);
        return {
          text: `Ali je ${name} ($\\mathrm{${sym}}$) kovina ali nekovina?`,
          answer: {
            type: "choice",
            options: ["kovina", "nekovina"],
            index: metal ? 0 : 1,
            why: metal
              ? [null, "Poglej položaj v periodnem sistemu: kovine so levo in na sredini, nekovine desno zgoraj."]
              : ["Poglej položaj v periodnem sistemu: nekovine so desno zgoraj, kovine levo in na sredini.", null],
          },
          hint: "Kovine so v periodnem sistemu levo in na sredini, nekovine desno zgoraj.",
          // Vprašanje brez računa: ni podatkov ne formule.
          data: false,
          formula: false,
          solution: metal ? "Kovina." : "Nekovina.",
        };
      }
      const g = groups[sym];
      const valence = g <= 2 ? g : g - 10;
      const N = "N(\\text{zunanjih } e^-)";
      const element = `\\text{element} = \\text{${name}}\\ (\\mathrm{${sym}})`;
      // Helij je izjema: oba elektrona sta v prvi (edini) lupini, čeprav je v 18. skupini.
      const he = sym === "He";
      const where = `Element ${name} je v ${g}. skupini${level === 3 ? " (preberemo iz periodnega sistema)" : ""}.\n`;
      return {
        text: `Koliko zunanjih (valenčnih) elektronov ima atom elementa ${name} ($\\mathrm{${sym}}$)?${level === 3 ? "" : ` Element je v ${g}. skupini.`}`,
        answer: withMistakes({ type: "number", value: he ? 2 : valence }, [
          [g >= 13 ? g : NaN, "Pri skupinah od 13 do 18 od številke skupine odšteješ 10."],
          [EL[sym][1], "Vrstno število pove število vseh elektronov, ne le zunanjih."],
          [!he && g >= 15 ? 8 - valence : NaN, "To je število elektronov, ki jih atom sprejme do okteta, ne število zunanjih."],
          [he ? 8 : NaN, "Helij je izjema: ima le 2 elektrona."],
        ]),
        hint: "Pri glavnih skupinah število zunanjih elektronov preberemo iz številke skupine (1, 2 oziroma 13–18 minus 10).",
        data: { given: level === 3 ? [element] : [element, `\\text{skupina} = ${g}`], find: [N] },
        formula: he ? `${N} = N(e^-) = Z` : g <= 2 ? `${N} = \\text{št. skupine}` : `${N} = \\text{št. skupine} - 10`,
        solution: he
          ? `${where}Helij je izjema: ima samo 2 elektrona in oba sta v prvi (edini) lupini.\n$${N} = N(e^-) = Z = 2$`
          : g <= 2
            ? `${where}$${N} = \\text{št. skupine} = ${g}$`
            : `${where}$${N} = \\text{št. skupine} - 10 = ${g} - 10 = ${valence}$`,
      };
    },
  },
  {
    id: "ph",
    topics: ["KEM-OS-8/ph-lestvica", "KEM-OS-8/kisline-in-baze", "KEM-SS-2/ph"],
    gen(level, r) {
      if (level <= 2) {
        const ph = r.int(0, 14);
        const label = ph < 7 ? "kisla" : ph === 7 ? "nevtralna" : "bazična";
        return {
          text: `Raztopina ima pH $${ph}$. Kakšna je?`,
          answer: {
            type: "choice",
            ...choicesWhy(r, label, [
              ["kisla", ph === 7 ? "pH 7 je točno na sredini lestvice." : "Kisle so raztopine s pH pod 7; večji pH pomeni manj kislo."],
              ["nevtralna", "Nevtralna je le raztopina s pH natanko 7."],
              ["bazična", ph === 7 ? "pH 7 je točno na sredini lestvice." : "Bazične so raztopine s pH nad 7; manjši pH pomeni bolj kislo."],
            ]),
          },
          hint: "pH 7 je nevtralno. Manj kot 7 je kislo, več kot 7 bazično.",
          data: { given: [`\\mathrm{pH} = ${ph}`], find: ["\\text{vrsta raztopine}"] },
          formula: ["\\mathrm{pH} < 7: \\text{kisla}", "\\mathrm{pH} = 7: \\text{nevtralna}", "\\mathrm{pH} > 7: \\text{bazična}"],
          solution: `$\\mathrm{pH} = ${ph}${ph < 7 ? " < 7" : ph > 7 ? " > 7" : ""}$, zato je raztopina ${label}.`,
        };
      }
      const exp = r.int(1, 5);
      const mant = r.pick([1, 2, 5]);
      const c = mant * 10 ** -exp;
      const cTex = `${tx(mant)} \\cdot 10^{-${exp}}`;
      return {
        text: `Kolikšen je pH raztopine močne kisline HCl s koncentracijo $${cTex}\\ \\mathrm{mol/L}$? Zaokroži na dve decimalki.`,
        answer: withMistakes({ type: "number", value: -Math.log10(c), decimals: 2 }, [
          [mant === 1 ? NaN : exp, "Upoštevaj tudi število pred potenco: pH = −log c."],
          [exp + Math.log10(mant), "log(a · 10⁻ⁿ) = log a − n: pazi na predznak pri log a."],
          [-Math.log(c), "Uporabi desetiški logaritem (log), ne naravnega (ln)."],
        ]),
        hint: "Močna kislina popolnoma disociira: $[\\mathrm{H_3O^+}] = c$. pH $= -\\log [\\mathrm{H_3O^+}]$.",
        data: { given: [`c(\\mathrm{HCl}) = ${cTex}\\ \\mathrm{mol/L}`], find: ["\\mathrm{pH}"] },
        formula: ["[\\mathrm{H_3O^+}] = c(\\mathrm{HCl})", "\\mathrm{pH} = -\\log [\\mathrm{H_3O^+}]"],
        solution: `$[\\mathrm{H_3O^+}] = c(\\mathrm{HCl}) = ${cTex}\\ \\mathrm{mol/L} = ${tx(c)}\\ \\mathrm{mol/L}$\n$\\mathrm{pH} = -\\log(${tx(c)}) \\approx ${tx(roundHalfUp(-Math.log10(c), 2), 2)}$`,
      };
    },
  },
];
