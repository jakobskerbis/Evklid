// Tekmovalne naloge iz kemije (Preglovo priznanje, kemijska olimpijada), OŠ in SŠ.
// Vse količine in odgovori so izračunani v kodi; molske mase so vedno navedene v besedilu.
import { tx, dat, res, num, roundHalfUp, gcd, choiceAns } from "./tek-util.js";

const OS = (slug) => `KEM-TEK-OS/${slug}`;
const SS = (slug) => `KEM-TEK-SS/${slug}`;

// Relativne atomske mase (zaokrožene kot v šolskih periodnih sistemih).
const AR = {
  H: 1.01, He: 4.0, Li: 6.94, B: 10.81, C: 12.01, N: 14.01, O: 16.0, F: 19.0, Na: 22.99, Mg: 24.31, Al: 26.98, Si: 28.09,
  P: 30.97, S: 32.07, Cl: 35.45, K: 39.1, Ca: 40.08, Cr: 52.0, Mn: 54.94, Fe: 55.85, Ni: 58.69, Cu: 63.55, Zn: 65.38,
  Ar: 39.95, Br: 79.9, Ag: 107.87, Sn: 118.71, I: 126.9, Ba: 137.33, Pb: 207.2,
};

// Razčleni formulo: "Al2(SO4)3" → { Al: 2, S: 3, O: 12 }; "CuSO4·5H2O" → { Cu: 1, S: 1, O: 9, H: 10 }.
function parseF(f) {
  const out = {};
  for (const [pi, part0] of f.split("·").entries()) {
    let part = part0, mult = 1;
    if (pi > 0) {
      const m = part.match(/^(\d+)(.*)$/);
      if (m) [mult, part] = [Number(m[1]), m[2]];
    }
    const stack = [{}];
    const toks = part.match(/[A-Z][a-z]?|\(|\)|\d+/g);
    for (let i = 0; i < toks.length; i++) {
      const t = toks[i];
      const nextNum = /^\d+$/.test(toks[i + 1] || "") ? Number(toks[i + 1]) : 1;
      if (t === "(") stack.push({});
      else if (t === ")") {
        const grp = stack.pop();
        for (const [e, n] of Object.entries(grp)) stack.at(-1)[e] = (stack.at(-1)[e] || 0) + n * nextNum;
        if (nextNum !== 1 || /^\d+$/.test(toks[i + 1] || "")) i++;
      } else if (/^[A-Z]/.test(t)) {
        stack.at(-1)[t] = (stack.at(-1)[t] || 0) + nextNum;
        if (/^\d+$/.test(toks[i + 1] || "")) i++;
      }
    }
    for (const [e, n] of Object.entries(stack[0])) out[e] = (out[e] || 0) + n * mult;
  }
  return out;
}
const molar = (f) => roundHalfUp(Object.entries(parseF(f)).reduce((s, [e, n]) => s + AR[e] * n, 0), 2);
// LaTeX zapis formule: "CuSO4·5H2O" → "\mathrm{CuSO_4 \cdot 5H_2O}".
const ft = (f) =>
  `\\mathrm{${f
    .split("·")
    .map((p, i) => (i === 0 ? p : p.replace(/^(\d+)/, "$1\\,")).replace(/([A-Za-z)])(\d+)/g, "$1_{$2}"))
    .join(" \\cdot ")}}`;
const FT = (f) => `$${ft(f)}$`;
// Molska masa kot podatek in v besedilu.
const Md = (f) => `M(${ft(f)}) = ${tx(molar(f), 2)}\\ \\mathrm{g/mol}`;
const Mx = (fs) => fs.map((f) => `$${Md(f)}$`).join(", ");
const Ad = (e) => `A_r(\\mathrm{${e}}) = ${tx(AR[e])}`;
const Ax = (es) => es.map((e) => `$${Ad(e)}$`).join(", ");
// Formula z unicode indeksi za možnosti izbire: "Al2(SO4)3" → "Al₂(SO₄)₃".
const SUB = "₀₁₂₃₄₅₆₇₈₉";
const uf = (f) =>
  f
    .split("·")
    .map((p, i) => {
      const lead = i > 0 ? (p.match(/^\d+/) || [""])[0] : "";
      return lead + p.slice(lead.length).replace(/([A-Za-z)])(\d+)/g, (_, a, d) => a + [...d].map((c) => SUB[c]).join(""));
    })
    .join("·");
const SUPC = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
const ionU = (f, q) => `${uf(f)}${Math.abs(q) === 1 ? "" : SUPC[Math.abs(q)]}${q > 0 ? "⁺" : "⁻"}`;
const ionT = (f, q) => `${ft(f)}^{${Math.abs(q) === 1 ? "" : Math.abs(q)}${q > 0 ? "+" : "-"}}`;
const DW = (d) => (d === 0 ? "na celo število" : d === 1 ? "na eno decimalko" : d === 2 ? "na dve decimalki" : d === 3 ? "na tri decimalke" : "na štiri decimalke");
const RND = (d) => `Zaokroži ${DW(d)}.`;
// Število decimalk za tri veljavna mesta.
const sigDec = (x) => Math.max(0, Math.min(4, 2 - Math.floor(Math.log10(Math.abs(x)))));
const R_GAS = 8.314;
const FARADAY = 96485;

// Enačba z koeficienti v LaTeX: [[2,"H2"],[1,"O2"]] → [[2,"H2O"]].
const coef = (c) => (c === 1 ? "" : `${c === 0.5 ? "\\tfrac{1}{2}" : Number.isInteger(c) ? c : `\\tfrac{${c * 2}}{2}`}\\,`);
const side = (arr) => arr.map(([c, f]) => `${coef(c)}${ft(f)}`).join(" + ");
const eqT = (L, R, arrow = "\\rightarrow") => `${side(L)} ${arrow} ${side(R)}`;

// Formula ionske spojine iz kationa in aniona.
function saltFormula(cat, qc, an, qa) {
  const k = gcd(qc, qa);
  const nc = qa / k, na = qc / k;
  const poly = (f) => /[A-Z].*[A-Z]|\d/.test(f);
  const part = (f, n) => (n === 1 ? f : poly(f) ? `(${f})${n}` : `${f}${n}`);
  return part(cat, nc) + part(an, na);
}
const CATIONS = [["Na", 1], ["K", 1], ["Ag", 1], ["NH4", 1], ["Mg", 2], ["Ca", 2], ["Ba", 2], ["Zn", 2], ["Cu", 2], ["Fe", 2], ["Fe", 3], ["Al", 3]];
const ANIONS = [["Cl", -1], ["NO3", -1], ["OH", -1], ["O", -2], ["S", -2], ["SO4", -2], ["CO3", -2], ["PO4", -3]];

const REACTIONS = [
  { L: [[1, "CaCO3"]], R: [[1, "CaO"], [1, "CO2"]] },
  { L: [[2, "Mg"], [1, "O2"]], R: [[2, "MgO"]] },
  { L: [[1, "Zn"], [2, "HCl"]], R: [[1, "ZnCl2"], [1, "H2"]] },
  { L: [[1, "Fe2O3"], [3, "CO"]], R: [[2, "Fe"], [3, "CO2"]] },
  { L: [[1, "CH4"], [2, "O2"]], R: [[1, "CO2"], [2, "H2O"]] },
  { L: [[1, "Fe"], [1, "S"]], R: [[1, "FeS"]] },
  { L: [[2, "Na"], [1, "Cl2"]], R: [[2, "NaCl"]] },
  { L: [[4, "Al"], [3, "O2"]], R: [[2, "Al2O3"]] },
  { L: [[2, "KClO3"]], R: [[2, "KCl"], [3, "O2"]] },
  { L: [[1, "C3H8"], [5, "O2"]], R: [[3, "CO2"], [4, "H2O"]] },
  { L: [[1, "N2"], [3, "H2"]], R: [[2, "NH3"]] },
  { L: [[1, "CuO"], [1, "H2"]], R: [[1, "Cu"], [1, "H2O"]] },
  { L: [[2, "Al"], [3, "Cl2"]], R: [[2, "AlCl3"]] },
  { L: [[2, "Al"], [3, "S"]], R: [[1, "Al2S3"]] },
];
const TWO = REACTIONS.filter((x) => x.L.length === 2);

// Omejitveni reaktant: masi obeh reaktantov → masa produkta.
function limiting(r, R, ranges = [2, 60]) {
  const [[c1, f1], [c2, f2]] = R.L;
  const [cp, fp] = r.pick(R.R);
  let m1, m2, n1, n2;
  do {
    m1 = r.dec(ranges[0], ranges[1], 1);
    m2 = r.dec(ranges[0], ranges[1], 1);
    n1 = m1 / molar(f1);
    n2 = m2 / molar(f2);
  } while (Math.abs(n1 / c1 - n2 / c2) / Math.max(n1 / c1, n2 / c2) < 0.1);
  const lim = n1 / c1 < n2 / c2 ? 0 : 1;
  const xi = Math.min(n1 / c1, n2 / c2);
  return { c1, f1, c2, f2, cp, fp, m1, m2, n1, n2, lim, xi, mp: xi * cp * molar(fp) };
}

export const TEK_KEM = [
  // ================================================================ OŠ
  {
    id: "tek-kem-snovi",
    topics: [OS("lastnosti-snovi-in-locevanje-zmesi")],
    gen(level, r) {
      if (level === 1) {
        if (r.next() < 0.5) {
          const MIX = [
            ["sol in pesek", "raztapljanje v vodi, filtracija in izparevanje"],
            ["železove opilke in žveplo v prahu", "ločevanje z magnetom"],
            ["etanol in voda", "destilacija"],
            ["olje in voda", "ločevanje z lijem ločnikom"],
            ["barvila v črnem flomastru", "kromatografija"],
            ["jod in kuhinjska sol", "sublimacija"],
            ["kreda, razmešana v vodi", "filtracija"],
          ];
          const [mix, ok] = r.pick(MIX);
          return {
            text: `S katerim postopkom najlaže ločimo zmes: ${mix}?`,
            answer: choiceAns(r, ok, r.shuffle(MIX.map((x) => x[1]))),
            hint: "Poišči lastnost, v kateri se sestavini razlikujeta: topnost, vrelišče, magnetnost, gostota, sublimacija.",
            data: false,
            formula: false,
            solution: `Pravilno: ${ok}. Postopek izkorišča razliko v lastnostih sestavin zmesi.`,
          };
        }
        const [name, rho] = r.pick([["aluminija", 2.7], ["železa", 7.87], ["bakra", 8.96], ["svinca", 11.34], ["cinka", 7.14]]);
        const m = r.int(30, 400);
        const dV = Math.max(4, roundHalfUp(m / rho, 0));
        const V1 = r.int(20, 60), V2 = V1 + dV;
        const rh = m / dV;
        return {
          text: `Kos kovine z maso ${m} g potopimo v menzuro z ${V1} mL vode. Gladina se dvigne do oznake ${V2} mL. Kolikšna je gostota kovine v $\\mathrm{g/cm^3}$? (Glede na rezultat bi lahko šlo za kos ${name}.) ${RND(2)}`,
          answer: num(rh, "g/cm³", 2, { unitAlternatives: ["g/cm3", "g/ml"] }),
          hint: "Prostornina kovine je razlika gladin; $1\\ \\mathrm{mL} = 1\\ \\mathrm{cm^3}$.",
          data: { given: [dat("m", m, "g"), dat("V_1", V1, "mL"), dat("V_2", V2, "mL")], find: ["\\rho"] },
          formula: ["V = V_2 - V_1", "\\rho = \\dfrac{m}{V}"],
          solution: `$V = ${V2} - ${V1} = ${dV}\\ \\mathrm{cm^3}$.\n$\\rho = \\dfrac{${m}}{${dV}} ${res(rh, 2, "g/cm³")}$.`,
        };
      }
      const SOL = [
        ["kalijevega nitrata", "KNO3", { 20: 32, 40: 64, 60: 110, 80: 169 }],
        ["amonijevega klorida", "NH4Cl", { 20: 37, 40: 46, 60: 55, 80: 66 }],
        ["kalijevega klorida", "KCl", { 20: 34, 40: 40, 60: 46, 80: 51 }],
        ["natrijevega nitrata", "NaNO3", { 20: 88, 40: 105, 60: 124, 80: 148 }],
      ];
      const [sn, sf, tab] = r.pick(SOL);
      const Th = r.pick([60, 80]), Tl = r.pick([20, 40]);
      const Sh = tab[Th], Sl = tab[Tl];
      const tabTxt = `je topnost ${sn} (${FT(sf)}) pri ${Th} °C ${Sh} g, pri ${Tl} °C pa ${Sl} g na 100 g vode`;
      if (level === 2) {
        const mw = r.int(5, 50) * 10;
        const x = (mw * (Sh - Sl)) / 100;
        return {
          text: `Pri ${Th} °C pripravimo nasičeno raztopino iz ${mw} g vode. Nato jo ohladimo na ${Tl} °C. Koliko gramov soli izkristalizira, če ${tabTxt}? ${RND(1)}`,
          answer: num(x, "g", 1),
          hint: "Izračunaj, koliko soli je raztopljene pri obeh temperaturah v isti masi vode; razlika izkristalizira.",
          data: { given: [dat("m_{voda}", mw, "g"), `S(${Th}\\,^\\circ\\mathrm{C}) = ${Sh}\\ \\mathrm{g}/100\\ \\mathrm{g}`, `S(${Tl}\\,^\\circ\\mathrm{C}) = ${Sl}\\ \\mathrm{g}/100\\ \\mathrm{g}`], find: ["m_{kristali}"] },
          formula: "m_{kristali} = m_{voda} \\cdot \\dfrac{S_1 - S_2}{100\\ \\mathrm{g}}",
          solution: `Pri ${Th} °C je raztopljenih $${tx((mw * Sh) / 100)}$ g, pri ${Tl} °C le $${tx((mw * Sl) / 100)}$ g soli.\n$m ${res(x, 1, "g")}$.`,
        };
      }
      const mr = r.int(10, 60) * 10;
      const x = (mr * (Sh - Sl)) / (100 + Sh);
      return {
        text: `Imamo ${mr} g nasičene raztopine pri ${Th} °C in jo ohladimo na ${Tl} °C. Koliko gramov soli izkristalizira, če ${tabTxt}? ${RND(1)}`,
        answer: num(x, "g", 1),
        hint: `V ${100 + Sh} g nasičene raztopine pri ${Th} °C je ${Sh} g soli in 100 g vode. Najprej ugotovi maso vode v naši raztopini.`,
        data: { given: [dat("m_{raztopina}", mr, "g"), `S(${Th}\\,^\\circ\\mathrm{C}) = ${Sh}\\ \\mathrm{g}/100\\ \\mathrm{g}`, `S(${Tl}\\,^\\circ\\mathrm{C}) = ${Sl}\\ \\mathrm{g}/100\\ \\mathrm{g}`], find: ["m_{kristali}"] },
        formula: "m_{kristali} = m_{raztopina} \\cdot \\dfrac{S_1 - S_2}{100 + S_1}",
        solution: `Masa vode: $${mr} \\cdot \\dfrac{100}{${100 + Sh}} = ${tx((mr * 100) / (100 + Sh), 2)}$ g.\n$m_{kristali} = ${mr} \\cdot \\dfrac{${Sh} - ${Sl}}{${100 + Sh}} ${res(x, 1, "g")}$.`,
      };
    },
  },
  {
    id: "tek-kem-atom-os",
    topics: [OS("zgradba-atoma-in-periodni-sistem-v-nalogah")],
    gen(level, r) {
      if (level === 1) {
        const IONS = [["Na", 11, 23, 1], ["Mg", 12, 24, 2], ["Al", 13, 27, 3], ["S", 16, 32, -2], ["Cl", 17, 37, -1], ["K", 19, 39, 1], ["Ca", 20, 40, 2], ["O", 8, 18, -2], ["F", 9, 19, -1], ["N", 7, 15, -3], ["Fe", 26, 56, 3], ["Fe", 26, 54, 2], ["Cu", 29, 65, 2], ["Zn", 30, 66, 2], ["Br", 35, 81, -1]];
        const [s, Z, A, q] = r.pick(IONS);
        const e = Z - q, N = A - Z;
        const iT = `$^{${A}}\\mathrm{${s}}^{${Math.abs(q) === 1 ? "" : Math.abs(q)}${q > 0 ? "+" : "-"}}$`;
        if (r.next() < 0.5) {
          return {
            text: `Ion ${iT} ima vrstno število $Z = ${Z}$. Koliko nevtronov in elektronov ima skupaj?`,
            answer: num(N + e),
            hint: "Nevtronov je $A - Z$, elektronov pa $Z$ minus naboj iona.",
            data: { given: [`A = ${A}`, `Z = ${Z}`], find: ["N + e^-"] },
            formula: ["N = A - Z", "e^- = Z - q"],
            solution: `$N = ${A} - ${Z} = ${N}$, $e^- = ${Z} ${q > 0 ? "-" : "+"} ${Math.abs(q)} = ${e}$.\nSkupaj $${N} + ${e} = ${N + e}$.`,
          };
        }
        return {
          text: `Ion elementa ${FT(s)} ima naboj $${q > 0 ? "+" : "-"}${Math.abs(q)}$, ${e} elektronov in ${N} nevtronov. Kolikšno je masno število tega iona?`,
          answer: num(A),
          hint: "Iz števila elektronov in naboja najprej izračunaj število protonov.",
          data: { given: [`e^- = ${e}`, `N = ${N}`], find: ["A"] },
          formula: ["Z = e^- + q", "A = Z + N"],
          solution: `$Z = ${e} ${q > 0 ? "+" : "-"} ${Math.abs(q)} = ${Z}$, $A = ${Z} + ${N} = ${A}$.`,
        };
      }
      const ISO = [["bor", "B", 10, 11], ["klor", "Cl", 35, 37], ["baker", "Cu", 63, 65], ["galij", "Ga", 69, 71], ["brom", "Br", 79, 81], ["litij", "Li", 6, 7], ["srebro", "Ag", 107, 109], ["rubidij", "Rb", 85, 87]];
      const [name, s, A1, A2] = r.pick(ISO);
      const note = "Masi izotopov vzemi enaki masnima številoma.";
      if (level === 2) {
        const p = r.dec(15, 85, 1);
        const Ar = (A1 * p + A2 * (100 - p)) / 100;
        return {
          text: `Element ${name} ima dva izotopa: $^{${A1}}\\mathrm{${s}}$ z deležem ${tx(p)} % in $^{${A2}}\\mathrm{${s}}$. ${note} Kolikšna je povprečna relativna atomska masa? ${RND(2)}`,
          answer: num(Ar, null, 2),
          hint: "Povprečna masa je tehtano povprečje: vsako masno število pomnoži z deležem izotopa.",
          data: { given: [`A_1 = ${A1}`, `A_2 = ${A2}`, `x_1 = ${tx(p)}\\,\\%`], find: ["A_r"] },
          formula: "A_r = x_1 A_1 + (1 - x_1) A_2",
          solution: `$A_r = ${tx(p / 100)} \\cdot ${A1} + ${tx(1 - p / 100)} \\cdot ${A2} ${res(Ar, 2)}$.`,
        };
      }
      const p0 = r.dec(15, 85, 1);
      const Ar = roundHalfUp((A1 * p0 + A2 * (100 - p0)) / 100, 2);
      const p = ((A2 - Ar) / (A2 - A1)) * 100;
      return {
        text: `Element ${name} ima dva izotopa, $^{${A1}}\\mathrm{${s}}$ in $^{${A2}}\\mathrm{${s}}$. Njegova povprečna relativna atomska masa je ${tx(Ar)}. ${note} Kolikšen je delež lažjega izotopa v odstotkih? ${RND(1)}`,
        answer: num(p, "%", 1),
        hint: "Delež lažjega izotopa označi z $x$, težjega z $1 - x$, in zapiši enačbo za povprečno maso.",
        data: { given: [`A_1 = ${A1}`, `A_2 = ${A2}`, `A_r = ${tx(Ar)}`], find: ["x_1"] },
        formula: ["A_r = x A_1 + (1 - x) A_2", "x = \\dfrac{A_2 - A_r}{A_2 - A_1}"],
        solution: `$x = \\dfrac{${A2} - ${tx(Ar)}}{${A2} - ${A1}} = ${tx(p / 100, 4)}$, torej $${tx(roundHalfUp(p, 1))}\\,\\%$.`,
      };
    },
  },
  {
    id: "tek-kem-formule",
    topics: [OS("kemijske-vezi-in-formule-spojin")],
    gen(level, r) {
      if (level === 1) {
        let cat, an;
        do {
          cat = r.pick(CATIONS);
          an = r.pick(ANIONS);
        } while (cat[0] === "NH4" && (an[0] === "OH" || an[0] === "O" || an[0] === "S"));
        const ok = saltFormula(cat[0], cat[1], an[0], -an[1]);
        const wrong = [saltFormula(cat[0], 1, an[0], 1), saltFormula(cat[0], -an[1] + 1 || 1, an[0], cat[1]), saltFormula(cat[0], -an[1], an[0], cat[1] + 1), saltFormula(cat[0], cat[1], an[0], -an[1] === 1 ? 2 : 1), `${cat[0]}${an[0]}${cat[1] + 1}`];
        return {
          text: `Kakšna je formula spojine, ki jo sestavljata iona ${ionU(cat[0], cat[1])} in ${ionU(an[0], an[1])}?`,
          answer: choiceAns(r, uf(ok), wrong.map(uf)),
          hint: "Spojina je navzven nevtralna: skupni pozitivni naboj mora biti enak skupnemu negativnemu. Večatomni ion z indeksom daj v oklepaj.",
          data: false,
          formula: false,
          solution: `Naboja $${cat[1]}+$ in $${-an[1]}-$ izenačimo z najmanjšim skupnim večkratnikom: formula je $${ft(ok)}$.`,
        };
      }
      if (level === 2) {
        const f = r.pick(["Al2(SO4)3", "Ca3(PO4)2", "Fe2(SO4)3", "Mg(NO3)2", "Na2CO3", "KMnO4", "CuSO4·5H2O", "Ca(OH)2", "Na3PO4", "K2Cr2O7", "(NH4)2SO4"]);
        const comp = parseF(f);
        const e = r.pick(Object.keys(comp));
        const m = r.dec(2, 80, 1);
        const M = molar(f);
        const n = (m / M) * comp[e];
        return {
          text: `Koliko molov atomov elementa ${FT(e)} je v ${tx(m)} g snovi ${FT(f)}? ${Mx([f])}. ${RND(3)}`,
          answer: num(n, "mol", 3),
          hint: "Najprej izračunaj množino snovi, nato upoštevaj, koliko atomov tega elementa je v eni formulski enoti.",
          data: { given: [dat("m", tx(m), "g"), Md(f)], find: [`n(\\mathrm{${e}})`] },
          formula: ["n = \\dfrac{m}{M}", `n(\\mathrm{${e}}) = ${comp[e]} \\cdot n`],
          solution: `$n = \\dfrac{${tx(m)}}{${tx(M, 2)}} = ${tx(m / M, 5)}$ mol; v formulski enoti ${comp[e] === 1 ? "je 1 atom" : comp[e] === 2 ? "sta 2 atoma" : comp[e] <= 4 ? `so ${comp[e]} atomi` : `je ${comp[e]} atomov`} ${e}.\n$n(\\mathrm{${e}}) = ${comp[e]} \\cdot ${tx(m / M, 5)} ${res(n, 3, "mol")}$.`,
        };
      }
      const OX = [["Fe", ["FeO", "Fe2O3", "Fe3O4"]], ["Cu", ["Cu2O", "CuO"]], ["S", ["SO2", "SO3"]], ["N", ["N2O", "NO", "NO2", "N2O3", "N2O5"]], ["P", ["P2O3", "P2O5"]], ["Mn", ["MnO", "MnO2", "Mn2O7"]], ["Cr", ["Cr2O3", "CrO3"]], ["Pb", ["PbO", "PbO2"]]];
      const [X, list] = r.pick(OX);
      const f = r.pick(list);
      const comp = parseF(f);
      const w = (comp[X] * AR[X] * 100) / (comp[X] * AR[X] + (comp.O || 0) * AR.O);
      const wt = roundHalfUp(w, 1);
      const generic = ["XO", "X2O", "XO2", "X2O3", "X3O4", "X2O5", "XO3", "X2O7"].map((p) => p.replace(/X/g, X).replace(/^([A-Z][a-z]?)1/, "$1"));
      return {
        text: `Oksid elementa ${FT(X)} vsebuje ${tx(wt)} % (masni delež) tega elementa, ostalo je kisik. ${Ax([X, "O"])}. Kakšna je empirična formula oksida?`,
        answer: choiceAns(r, uf(f), r.shuffle(generic.filter((g0) => g0 !== f)).map(uf)),
        hint: "Vzemi 100 g oksida: maso vsakega elementa deli z njegovo atomsko maso in poišči najmanjše celoštevilsko razmerje.",
        data: { given: [`w(\\mathrm{${X}}) = ${tx(wt)}\\,\\%`, Ad(X), Ad("O")], find: ["\\text{formula}"] },
        formula: "n(\\mathrm{X}) : n(\\mathrm{O}) = \\dfrac{w(\\mathrm{X})}{A_r(\\mathrm{X})} : \\dfrac{w(\\mathrm{O})}{A_r(\\mathrm{O})}",
        solution: `V 100 g: $n(\\mathrm{${X}}) = \\dfrac{${tx(wt)}}{${tx(AR[X])}} = ${tx(wt / AR[X], 3)}$ mol, $n(\\mathrm{O}) = \\dfrac{${tx(roundHalfUp(100 - wt, 1))}}{16} = ${tx((100 - wt) / 16, 3)}$ mol.\nRazmerje $${tx((100 - wt) / 16 / (wt / AR[X]), 2)}$ atoma O na atom ${X} ustreza formuli $${ft(f)}$.`,
      };
    },
  },
  {
    id: "tek-kem-enacbe-mol",
    topics: [OS("urejanje-enacb-in-mnozina-snovi")],
    gen(level, r) {
      if (level === 2) {
        if (r.next() < 0.5) {
          const els = ["Mg", "Ca", "Fe", "Cu", "Zn", "Al", "Na", "S", "C", "Ag"];
          const [a, b] = r.shuffle(els).slice(0, 2);
          const m = r.dec(2, 50, 1);
          const x = (m / AR[b]) * AR[a];
          return {
            text: `Koliko gramov ${FT(a)} vsebuje enako število atomov kot ${tx(m)} g ${FT(b)}? ${Ax([a, b])}. ${RND(2)}`,
            answer: num(x, "g", 2),
            hint: "Enako število atomov pomeni enako množino snovi (mol).",
            data: { given: [dat(`m(\\mathrm{${b}})`, tx(m), "g"), Ad(a), Ad(b)], find: [`m(\\mathrm{${a}})`] },
            formula: ["n = \\dfrac{m}{M}", `m(\\mathrm{${a}}) = n \\cdot M(\\mathrm{${a}})`],
            solution: `$n = \\dfrac{${tx(m)}}{${tx(AR[b])}} = ${tx(m / AR[b], 4)}$ mol.\n$m(\\mathrm{${a}}) = ${tx(m / AR[b], 4)} \\cdot ${tx(AR[a])} ${res(x, 2, "g")}$.`,
          };
        }
        const pool = ["H2O", "CO2", "NH3", "CH4", "O2", "N2", "SO2", "C2H6", "HCl", "Cl2"];
        const [a, b] = r.shuffle(pool).slice(0, 2);
        const m = r.dec(2, 80, 1);
        const ca = Object.values(parseF(a)).reduce((s, x) => s + x, 0), cb = Object.values(parseF(b)).reduce((s, x) => s + x, 0);
        const x = ((m / molar(b)) * cb * molar(a)) / ca;
        return {
          text: `Koliko gramov ${FT(a)} vsebuje enako skupno število atomov kot ${tx(m)} g ${FT(b)}? ${Mx([a, b])}. ${RND(2)}`,
          answer: num(x, "g", 2),
          hint: `Ena molekula ${uf(b)} ima ${cb} ${cb === 2 ? "atoma" : cb <= 4 ? "atome" : "atomov"}, ena molekula ${uf(a)} pa ${ca}. Primerjaj množine atomov.`,
          data: { given: [dat(`m(${ft(b)})`, tx(m), "g"), Md(a), Md(b)], find: [`m(${ft(a)})`] },
          formula: ["n_{atomov} = n \\cdot \\text{št. atomov v molekuli}", "m = n \\cdot M"],
          solution: `Atomov v ${uf(b)}: $${cb} \\cdot \\dfrac{${tx(m)}}{${tx(molar(b), 2)}} = ${tx((m / molar(b)) * cb, 4)}$ mol.\nMolekul ${uf(a)}: $\\dfrac{${tx((m / molar(b)) * cb, 4)}}{${ca}} = ${tx(((m / molar(b)) * cb) / ca, 4)}$ mol, masa $${res(x, 2, "g").replace(/^= /, "= ")}$.`,
        };
      }
      const EQ = level === 1
        ? [
            { l: ["Fe", "H2O"], r: ["Fe3O4", "H2"], c: [3, 4, 1, 4] },
            { l: ["KClO3"], r: ["KCl", "O2"], c: [2, 2, 3] },
            { l: ["Al", "H2SO4"], r: ["Al2(SO4)3", "H2"], c: [2, 3, 1, 3] },
            { l: ["C2H5OH", "O2"], r: ["CO2", "H2O"], c: [1, 3, 2, 3] },
            { l: ["P4", "O2"], r: ["P4O10"], c: [1, 5, 1] },
            { l: ["NaHCO3"], r: ["Na2CO3", "H2O", "CO2"], c: [2, 1, 1, 1] },
            { l: ["Fe2O3", "C"], r: ["Fe", "CO2"], c: [2, 3, 4, 3] },
            { l: ["Ca(OH)2", "H3PO4"], r: ["Ca3(PO4)2", "H2O"], c: [3, 2, 1, 6] },
          ]
        : [
            { l: ["FeS2", "O2"], r: ["Fe2O3", "SO2"], c: [4, 11, 2, 8] },
            { l: ["Cu", "HNO3"], r: ["Cu(NO3)2", "NO", "H2O"], c: [3, 8, 3, 2, 4] },
            { l: ["KMnO4", "HCl"], r: ["KCl", "MnCl2", "Cl2", "H2O"], c: [2, 16, 2, 2, 5, 8] },
            { l: ["C4H10", "O2"], r: ["CO2", "H2O"], c: [2, 13, 8, 10] },
            { l: ["NH3", "O2"], r: ["NO", "H2O"], c: [4, 5, 4, 6] },
            { l: ["C8H18", "O2"], r: ["CO2", "H2O"], c: [2, 25, 16, 18] },
            { l: ["Ca3(PO4)2", "SiO2", "C"], r: ["CaSiO3", "P4", "CO"], c: [2, 6, 10, 6, 1, 10] },
            { l: ["Zn", "HNO3"], r: ["Zn(NO3)2", "NH4NO3", "H2O"], c: [4, 10, 4, 1, 3] },
          ];
      const eq = r.pick(EQ);
      const sq = (arr, off) => arr.map((f, i) => `\\square_{${off + i + 1}}\\,${ft(f)}`).join(" + ");
      return {
        text: `Uredi enačbo z najmanjšimi celimi koeficienti. Vpiši koeficiente v kvadratkih po vrsti, ločene z vejico:\n\n$$${sq(eq.l, 0)} \\rightarrow ${sq(eq.r, eq.l.length)}$$`,
        answer: { type: "coefficients", values: eq.c },
        hint: level === 3 ? "Pri zahtevnih enačbah pomaga metoda neznanih koeficientov ali urejanje po oksidacijskih številih (koliko elektronov odda in sprejme posamezni atom)." : "Začni z elementom, ki se pojavi v najmanj snoveh; kisik in vodik uredi na koncu.",
        data: false,
        formula: false,
        solution: `$$${side(eq.l.map((f, i) => [eq.c[i], f]))} \\rightarrow ${side(eq.r.map((f, i) => [eq.c[eq.l.length + i], f]))}$$`,
        inputHint: `npr. ${eq.c.map(() => "1").join(", ")}`,
      };
    },
  },
  {
    id: "tek-kem-mase-enacbe",
    topics: [OS("racunanje-mas-iz-enacb")],
    gen(level, r) {
      if (level === 1) {
        const R = r.pick(REACTIONS);
        const [ca, fa] = r.pick(R.L);
        const [cb, fb] = r.pick(R.R);
        const m = r.dec(2, 120, 1);
        const x = ((m / molar(fa)) * cb * molar(fb)) / ca;
        return {
          text: `Poteka reakcija $${eqT(R.L, R.R)}$. Koliko gramov ${FT(fb)} nastane iz ${tx(m)} g ${FT(fa)}? ${Mx([fa, fb])}. ${RND(2)}`,
          answer: num(x, "g", 2),
          hint: "Masa → množina snovi, razmerje koeficientov iz enačbe, množina → masa.",
          data: { given: [dat(`m(${ft(fa)})`, tx(m), "g"), Md(fa), Md(fb)], find: [`m(${ft(fb)})`] },
          formula: ["n = \\dfrac{m}{M}", `n(${ft(fb)}) = \\dfrac{${cb}}{${ca}}\\, n(${ft(fa)})`],
          solution: `$n(${ft(fa)}) = \\dfrac{${tx(m)}}{${tx(molar(fa), 2)}} = ${tx(m / molar(fa), 4)}$ mol, $n(${ft(fb)}) = \\dfrac{${cb}}{${ca}} \\cdot ${tx(m / molar(fa), 4)} = ${tx(((m / molar(fa)) * cb) / ca, 4)}$ mol.\n$m = ${tx(((m / molar(fa)) * cb) / ca, 4)} \\cdot ${tx(molar(fb), 2)} ${res(x, 2, "g")}$.`,
        };
      }
      if (level === 2) {
        const R = r.pick(TWO.filter((x) => x.L.every(([, f]) => f !== "O2" && f !== "H2" && f !== "CO")) .concat(TWO.slice(0, 2)));
        const L = limiting(r, R);
        const limF = L.lim === 0 ? L.f1 : L.f2, exF = L.lim === 0 ? L.f2 : L.f1;
        return {
          text: `Zmešamo ${tx(L.m1)} g ${FT(L.f1)} in ${tx(L.m2)} g ${FT(L.f2)}, ki reagirata po enačbi $${eqT(R.L, R.R)}$. Koliko gramov ${FT(L.fp)} lahko največ nastane? ${Mx([L.f1, L.f2, L.fp])}. ${RND(2)}`,
          answer: num(L.mp, "g", 2),
          hint: "Najprej ugotovi, kateri reaktant porabimo prej (omejitveni reaktant): primerjaj množini, deljeni s koeficientoma.",
          data: { given: [dat(`m(${ft(L.f1)})`, tx(L.m1), "g"), dat(`m(${ft(L.f2)})`, tx(L.m2), "g"), Md(L.f1), Md(L.f2), Md(L.fp)], find: [`m(${ft(L.fp)})`] },
          formula: ["n = \\dfrac{m}{M}", "\\text{omejitveni reaktant: najmanjši } \\dfrac{n}{\\text{koeficient}}"],
          solution: `$\\dfrac{n(${ft(L.f1)})}{${L.c1}} = ${tx(L.n1 / L.c1, 4)}$ mol, $\\dfrac{n(${ft(L.f2)})}{${L.c2}} = ${tx(L.n2 / L.c2, 4)}$ mol, zato je omejitveni reaktant ${uf(limF)}, ${uf(exF)} je v prebitku.\n$m(${ft(L.fp)}) = ${L.cp === 1 ? "" : `${L.cp} \\cdot `}${tx(L.xi, 4)} \\cdot ${tx(molar(L.fp), 2)} ${res(L.mp, 2, "g")}$.`,
        };
      }
      const CARB = [
        { f: "CaCO3", name: "apnenca", main: "CaCO3", loss: ["CO2"], perMol: 1 },
        { f: "MgCO3", name: "magnezita", main: "MgCO3", loss: ["CO2"], perMol: 1 },
        { f: "NaHCO3", name: "sode bikarbone", main: "NaHCO3", loss: ["H2O", "CO2"], perMol: 0.5 },
      ];
      const C = r.pick(CARB);
      const m = r.dec(5, 50, 1);
      const w0 = r.dec(60, 98, 1) / 100;
      const lossM = C.loss.reduce((s, f) => s + molar(f), 0);
      const dm = roundHalfUp(((m * w0) / molar(C.main)) * C.perMol * lossM, 2);
      const w = (((dm / lossM / C.perMol) * molar(C.main)) / m) * 100;
      const eqTxt = C.f === "NaHCO3" ? eqT([[2, "NaHCO3"]], [[1, "Na2CO3"], [1, "H2O"], [1, "CO2"]]) : eqT([[1, C.f]], [[1, C.f.replace("CO3", "O")], [1, "CO2"]]);
      return {
        text: `Vzorec ${C.name} z maso ${tx(m)} g vsebuje primesi, ki pri segrevanju ne razpadejo. Pri žarjenju poteče reakcija $${eqTxt}$ in plinasti produkti uidejo, zato se masa vzorca zmanjša za ${tx(dm)} g. Kolikšen je masni delež ${FT(C.main)} v vzorcu? ${Mx([C.main, ...C.loss])}. ${RND(1)}`,
        answer: num(w, "%", 1),
        hint: "Zmanjšanje mase je masa plinov, ki uidejo. Iz nje izračunaj množino razpadle snovi.",
        data: { given: [dat("m_{vzorec}", tx(m), "g"), dat("\\Delta m", tx(dm), "g"), Md(C.main), ...C.loss.map(Md)], find: [`w(${ft(C.main)})`] },
        formula: ["n = \\dfrac{\\Delta m}{M_{plin}}", "w = \\dfrac{m(\\text{snov})}{m_{vzorec}} \\cdot 100\\,\\%"],
        solution: `${C.perMol === 1 ? `Na mol ${uf(C.main)} uide mol CO₂, to je` : "Na dva mola NaHCO₃ uideta mol vode in mol CO₂, skupaj"} $${tx(lossM, 2)}$ g plinov.\n$n(${ft(C.main)}) = ${C.perMol === 1 ? "" : "2 \\cdot "}\\dfrac{${tx(dm)}}{${tx(lossM, 2)}} = ${tx(dm / lossM / C.perMol, 4)}$ mol, $m = ${tx(((dm / lossM / C.perMol) * molar(C.main)), 2)}$ g.\n$w = \\dfrac{${tx(((dm / lossM / C.perMol) * molar(C.main)), 2)}}{${tx(m)}} \\cdot 100\\,\\% ${res(w, 1, "\\%")}$.`,
      };
    },
  },
  {
    id: "tek-kem-raztopine",
    topics: [OS("raztopine-in-masni-delez")],
    gen(level, r) {
      if (level === 1) {
        const m1 = r.int(5, 50) * 10, w1 = r.int(2, 40), m2 = r.int(5, 50) * 10;
        let w2 = r.int(2, 40);
        if (w2 === w1) w2 += 5;
        const w = (m1 * w1 + m2 * w2) / (m1 + m2);
        return {
          text: `Zmešamo ${m1} g ${w1}-odstotne in ${m2} g ${w2}-odstotne raztopine iste snovi. Kolikšen je masni delež topljenca v nastali raztopini? ${RND(1)}`,
          answer: num(w, "%", 1),
          hint: "Seštej mase topljenca in mase raztopin posebej.",
          data: { given: [dat("m_1", m1, "g"), `w_1 = ${w1}\\,\\%`, dat("m_2", m2, "g"), `w_2 = ${w2}\\,\\%`], find: ["w"] },
          formula: "w = \\dfrac{m_1 w_1 + m_2 w_2}{m_1 + m_2}",
          solution: `$m_{topljenec} = ${m1} \\cdot ${tx(w1 / 100)} + ${m2} \\cdot ${tx(w2 / 100)} = ${tx((m1 * w1 + m2 * w2) / 100)}$ g.\n$w = \\dfrac{${tx((m1 * w1 + m2 * w2) / 100)}}{${m1 + m2}} \\cdot 100\\,\\% ${res(w, 1, "\\%")}$.`,
        };
      }
      if (level === 2) {
        const m = r.int(5, 60) * 10, w1 = r.int(5, 40);
        if (r.next() < 0.5) {
          const w2 = r.int(1, w1 - 2);
          const x = (m * w1) / w2 - m;
          return {
            text: `Koliko gramov vode moramo doliti k ${m} g ${w1}-odstotne raztopine, da dobimo ${w2}-odstotno raztopino? ${RND(1)}`,
            answer: num(x, "g", 1),
            hint: "Masa topljenca se pri redčenju ne spremeni.",
            data: { given: [dat("m_1", m, "g"), `w_1 = ${w1}\\,\\%`, `w_2 = ${w2}\\,\\%`], find: ["m_{voda}"] },
            formula: ["m_1 w_1 = m_2 w_2", "m_{voda} = m_2 - m_1"],
            solution: `$m_{topljenec} = ${tx((m * w1) / 100)}$ g, $m_2 = \\dfrac{${tx((m * w1) / 100)}}{${tx(w2 / 100)}} = ${tx((m * w1) / w2, 2)}$ g.\n$m_{voda} = ${tx((m * w1) / w2, 2)} - ${m} ${res(x, 1, "g")}$.`,
          };
        }
        const w2 = r.int(w1 + 3, Math.min(60, w1 + 30));
        const x = m - (m * w1) / w2;
        return {
          text: `Koliko gramov vode moramo izpariti iz ${m} g ${w1}-odstotne raztopine, da dobimo ${w2}-odstotno raztopino? ${RND(1)}`,
          answer: num(x, "g", 1),
          hint: "Masa topljenca se pri izparevanju ne spremeni; zmanjša se le masa raztopine.",
          data: { given: [dat("m_1", m, "g"), `w_1 = ${w1}\\,\\%`, `w_2 = ${w2}\\,\\%`], find: ["m_{voda}"] },
          formula: ["m_1 w_1 = m_2 w_2", "m_{voda} = m_1 - m_2"],
          solution: `$m_{topljenec} = ${tx((m * w1) / 100)}$ g, $m_2 = \\dfrac{${tx((m * w1) / 100)}}{${tx(w2 / 100)}} = ${tx((m * w1) / w2, 2)}$ g.\n$m_{voda} = ${m} - ${tx((m * w1) / w2, 2)} ${res(x, 1, "g")}$.`,
        };
      }
      const [hyd, anh, name] = r.pick([["CuSO4·5H2O", "CuSO4", "modre galice"], ["Na2CO3·10H2O", "Na2CO3", "kristalne sode"], ["MgSO4·7H2O", "MgSO4", "grenke soli"], ["FeSO4·7H2O", "FeSO4", "zelene galice"]]);
      const m = r.int(5, 50) * 10, w = r.int(2, 15);
      const x = ((m * w) / 100) * (molar(hyd) / molar(anh));
      return {
        text: `Koliko gramov ${name} (${FT(hyd)}) potrebujemo za pripravo ${m} g raztopine z masnim deležem ${FT(anh)} ${w} %? ${Mx([hyd, anh])}. ${RND(2)}`,
        answer: num(x, "g", 2),
        hint: "Kristalohidrat vsebuje tudi vodo. Najprej izračunaj, koliko brezvodne soli potrebuješ, nato preračunaj na hidrat.",
        data: { given: [dat("m_{raztopina}", m, "g"), `w = ${w}\\,\\%`, Md(hyd), Md(anh)], find: [`m(\\text{hidrat})`] },
        formula: ["m(\\text{sol}) = w \\cdot m_{raztopina}", "m(\\text{hidrat}) = m(\\text{sol}) \\cdot \\dfrac{M(\\text{hidrat})}{M(\\text{sol})}"],
        solution: `$m(${ft(anh)}) = ${tx(w / 100)} \\cdot ${m} = ${tx((m * w) / 100)}$ g.\n$m(\\text{hidrat}) = ${tx((m * w) / 100)} \\cdot \\dfrac{${tx(molar(hyd), 2)}}{${tx(molar(anh), 2)}} ${res(x, 2, "g")}$.`,
      };
    },
  },
  {
    id: "tek-kem-kisline-os",
    topics: [OS("kisline-baze-in-soli-v-nalogah")],
    gen(level, r) {
      const ACIDS = [["HCl", "Cl", 1], ["H2SO4", "SO4", 2], ["HNO3", "NO3", 1], ["H3PO4", "PO4", 3]];
      const BASES = [["NaOH", "Na", 1], ["KOH", "K", 1], ["Ca(OH)2", "Ca", 2], ["Ba(OH)2", "Ba", 2], ["Al(OH)3", "Al", 3]];
      if (level === 1) {
        const [af, an, qa] = r.pick(ACIDS);
        const [bf, cat, qb] = r.pick(BASES);
        const ok = saltFormula(cat, qb, an, qa);
        const wrong = [saltFormula(cat, 1, an, 1), saltFormula(cat, qa, an, qb === qa ? qb + 1 : qb), `${cat}${an}${qb > 1 ? qb : 2}`, saltFormula(cat, qb + 1, an, qa)];
        return {
          text: `Pri popolni nevtralizaciji raztopine ${FT(af)} z raztopino ${FT(bf)} nastaneta voda in sol. Kakšna je formula soli?`,
          answer: choiceAns(r, uf(ok), wrong.map(uf)),
          hint: "Sol sestavljata kation iz baze in anion iz kisline. Naboja izenači.",
          data: false,
          formula: false,
          solution: `Kation $${ionT(cat, qb)}$ in anion $${ionT(an, -qa)}$ dasta sol $${ft(ok)}$.`,
        };
      }
      const [af, , qa] = r.pick(ACIDS.slice(0, 3));
      const [bf, , qb] = r.pick(BASES.slice(0, 2));
      const m = r.int(5, 50) * 10, w1 = r.int(2, 20);
      const nA = ((m * w1) / 100) / molar(af);
      const nB = (nA * qa) / qb;
      const eq = eqT([[1, af], [qa, bf]], [[1, saltFormula(bf.replace("OH", ""), 1, af.replace(/^H\d?/, ""), qa)], [qa, "H2O"]]);
      if (level === 2) {
        const x = nB * molar(bf);
        return {
          text: `Koliko gramov ${FT(bf)} potrebujemo za nevtralizacijo ${m} g ${w1}-odstotne raztopine ${FT(af)}? ${Mx([af, bf])}. ${RND(2)}`,
          answer: num(x, "g", 2),
          hint: "Zapiši urejeno enačbo nevtralizacije in iz nje razmerje množin kisline in baze.",
          data: { given: [dat("m_{raztopina}", m, "g"), `w = ${w1}\\,\\%`, Md(af), Md(bf)], find: [`m(${ft(bf)})`] },
          formula: ["n = \\dfrac{w \\cdot m_{raztopina}}{M}", `n(${ft(bf)}) = ${qa}\\, n(${ft(af)})`],
          solution: `$${eq}$\n$n(${ft(af)}) = \\dfrac{${tx((m * w1) / 100)}}{${tx(molar(af), 2)}} = ${tx(nA, 4)}$ mol, $n(${ft(bf)}) = ${tx(nB, 4)}$ mol.\n$m = ${tx(nB, 4)} \\cdot ${tx(molar(bf), 2)} ${res(x, 2, "g")}$.`,
        };
      }
      const w2 = r.int(2, 20);
      const x = (nB * molar(bf)) / (w2 / 100);
      return {
        text: `Koliko gramov ${w2}-odstotne raztopine ${FT(bf)} potrebujemo za nevtralizacijo ${m} g ${w1}-odstotne raztopine ${FT(af)}? ${Mx([af, bf])}. ${RND(1)}`,
        answer: num(x, "g", 1),
        hint: "Izračunaj množino kisline, iz enačbe množino baze, nato maso čiste baze in na koncu maso njene raztopine.",
        data: { given: [dat("m_1", m, "g"), `w_1 = ${w1}\\,\\%`, `w_2 = ${w2}\\,\\%`, Md(af), Md(bf)], find: ["m_2"] },
        formula: ["n = \\dfrac{w \\cdot m}{M}", "m_2 = \\dfrac{n(\\text{baza}) \\cdot M(\\text{baza})}{w_2}"],
        solution: `$${eq}$\n$n(${ft(af)}) = ${tx(nA, 4)}$ mol, $n(${ft(bf)}) = ${tx(nB, 4)}$ mol, $m(${ft(bf)}) = ${tx(nB * molar(bf), 3)}$ g.\n$m_2 = \\dfrac{${tx(nB * molar(bf), 3)}}{${tx(w2 / 100)}} ${res(x, 1, "g")}$.`,
      };
    },
  },
  {
    id: "tek-kem-organske-os",
    topics: [OS("organske-spojine-v-nalogah")],
    gen(level, r) {
      if (level === 1) {
        if (r.next() < 0.5) {
          const n = r.int(4, 7);
          const iso = { 4: 2, 5: 3, 6: 5, 7: 9 }[n];
          return {
            text: `Koliko različnih strukturnih izomerov ima alkan $\\mathrm{C_{${n}}H_{${2 * n + 2}}}$?`,
            answer: num(iso),
            hint: "Sistematično nariši najdaljšo verigo, nato verige, krajše za en ogljikov atom (metilna skupina na različnih mestih), in tako naprej. Pazi na ponovitve.",
            data: false,
            formula: false,
            solution: `Alkan z ${n} ogljikovimi atomi ima ${iso} strukturnih izomerov${n === 4 ? " (butan in 2-metilpropan)" : n === 5 ? " (pentan, 2-metilbutan, 2,2-dimetilpropan)" : ""}.`,
          };
        }
        const n = r.int(3, 12);
        const M = roundHalfUp(n * AR.C + (2 * n + 2) * AR.H, 2);
        return {
          text: `Alkan ima molsko maso ${tx(M)} g/mol. Koliko ogljikovih atomov ima njegova molekula? ${Ax(["C", "H"])}.`,
          answer: num(n),
          hint: "Splošna formula alkanov je $\\mathrm{C_nH_{2n+2}}$.",
          data: { given: [dat("M", tx(M), "g/mol"), Ad("C"), Ad("H")], find: ["n"] },
          formula: ["M = n A_r(\\mathrm{C}) + (2n + 2) A_r(\\mathrm{H})", "n = \\dfrac{M - 2 A_r(\\mathrm{H})}{A_r(\\mathrm{C}) + 2 A_r(\\mathrm{H})}"],
          solution: `$n = \\dfrac{${tx(M)} - 2 \\cdot 1{,}01}{12{,}01 + 2 \\cdot 1{,}01} = ${n}$, alkan je $\\mathrm{C_{${n}}H_{${2 * n + 2}}}$.`,
        };
      }
      const FUELS = [["CH4", 1, 4], ["C2H6", 2, 6], ["C3H8", 3, 8], ["C4H10", 4, 10], ["C2H5OH", 2, 6], ["CH3OH", 1, 4], ["C6H12O6", 6, 12], ["C8H18", 8, 18]];
      if (level === 2) {
        const [f, x] = r.pick(FUELS);
        const m = r.dec(2, 100, 1);
        const out = (m / molar(f)) * x * molar("CO2");
        return {
          text: `Koliko gramov ogljikovega dioksida nastane pri popolnem gorenju ${tx(m)} g ${FT(f)}? ${Mx([f, "CO2"])}. ${RND(1)}`,
          answer: num(out, "g", 1),
          hint: "Vsak ogljikov atom iz goriva se pri popolnem gorenju pretvori v eno molekulo $\\mathrm{CO_2}$.",
          data: { given: [dat("m", tx(m), "g"), Md(f), Md("CO2")], find: ["m(\\mathrm{CO_2})"] },
          formula: ["n(\\mathrm{CO_2}) = x \\cdot n(\\text{gorivo})", "m = n \\cdot M"],
          solution: `$n(${ft(f)}) = \\dfrac{${tx(m)}}{${tx(molar(f), 2)}} = ${tx(m / molar(f), 4)}$ mol, iz ene molekule nastane ${x} ${x === 1 ? "molekula" : x === 2 ? "molekuli" : x <= 4 ? "molekule" : "molekul"} CO₂.\n$m(\\mathrm{CO_2}) = ${x} \\cdot ${tx(m / molar(f), 4)} \\cdot 44{,}01 ${res(out, 1, "g")}$.`,
        };
      }
      const HC = ["CH4", "C2H6", "C2H4", "C2H2", "C3H8", "C3H6", "C3H4", "C4H10", "C4H8", "C5H12", "C6H6", "C6H12", "C6H14", "C7H16", "C7H8"];
      const f = r.pick(HC);
      const { C: x, H: y } = parseF(f);
      const m = r.dec(1, 10, 2);
      const n = m / molar(f);
      const mC = roundHalfUp(n * x * molar("CO2"), 2), mH = roundHalfUp(((n * y) / 2) * molar("H2O"), 2);
      const others = r.shuffle(HC.filter((h) => h !== f && Math.abs(parseF(h).C - x) <= 2));
      return {
        text: `Pri popolnem gorenju ${tx(m)} g ogljikovodika nastane ${tx(mC)} g $\\mathrm{CO_2}$ in ${tx(mH)} g $\\mathrm{H_2O}$. Molska masa ogljikovodika je ${tx(molar(f))} g/mol. Kakšna je njegova molekulska formula? ${Mx(["CO2", "H2O"])}.`,
        answer: choiceAns(r, uf(f), others.map(uf)),
        hint: "Iz mase $\\mathrm{CO_2}$ izračunaj množino C, iz mase vode množino H (vsaka molekula vode ima 2 H). Razmerje primerjaj z množino ogljikovodika.",
        data: { given: [dat("m", tx(m), "g"), dat("m(\\mathrm{CO_2})", tx(mC), "g"), dat("m(\\mathrm{H_2O})", tx(mH), "g"), dat("M", tx(molar(f)), "g/mol")], find: ["\\text{formula}"] },
        formula: ["n(\\mathrm{C}) = n(\\mathrm{CO_2})", "n(\\mathrm{H}) = 2\\, n(\\mathrm{H_2O})"],
        solution: `$n = \\dfrac{${tx(m)}}{${tx(molar(f))}} = ${tx(n, 4)}$ mol, $n(\\mathrm{C}) = \\dfrac{${tx(mC)}}{44{,}01} = ${tx(mC / 44.01, 4)}$ mol, $n(\\mathrm{H}) = 2 \\cdot \\dfrac{${tx(mH)}}{18{,}02} = ${tx((2 * mH) / 18.02, 4)}$ mol.\nNa molekulo: $${tx(mC / 44.01 / n, 2)}$ C in $${tx((2 * mH) / 18.02 / n, 2)}$ H, torej $${ft(f)}$.`,
      };
    },
  },
  {
    id: "tek-kem-poskusi",
    topics: [OS("eksperimentalne-in-opazovalne-naloge")],
    gen(level, r) {
      if (level === 1) {
        const BANK = [
          ["Kateri plin dokažemo s tlečo trsko, ki v njem vzplamti?", "kisik", ["vodik", "ogljikov dioksid", "dušik"]],
          ["Kateri plin ob približanju goreče trske zagori s pokom?", "vodik", ["kisik", "ogljikov dioksid", "dušik"]],
          ["Kateri plin povzroči, da se apnica (raztopina kalcijevega hidroksida) pomoti?", "ogljikov dioksid", ["kisik", "vodik", "amonijak"]],
          ["Kakšne barve je fenolftalein v raztopini natrijevega hidroksida?", "rožnato vijoličen", ["brezbarven", "rumen", "moder"]],
          ["Kakšne barve je univerzalni indikator v raztopini s pH 1?", "rdeč", ["zelen", "moder", "vijoličen"]],
          ["Kaj se zgodi z modrim lakmusovim papirjem v kisu?", "pordeči", ["ostane moder", "pozeleni", "porumeni"]],
          ["Kaj opazimo, ko železen žebelj potopimo v raztopino bakrovega(II) sulfata?", "žebelj se prevleče z rdečkasto rjavo plastjo", ["raztopina postane temno modra", "nastaja brezbarven plin", "žebelj se ne spremeni"]],
          ["Kaj se zgodi, ko na bel brezvodni bakrov(II) sulfat kanemo vodo?", "snov pomodri", ["snov počrni", "snov ostane bela", "nastane rdeča oborina"]],
          ["Kakšno barvo da raztopina joda s škrobom?", "temno modro", ["rdečo", "rumeno", "zeleno"]],
          ["Kaj opazimo, ko v raztopino natrijevega klorida kanemo raztopino srebrovega nitrata?", "nastane bela oborina", ["nastane modra raztopina", "razvija se plin", "ni vidne spremembe"]],
          ["Kako varno redčimo koncentrirano žveplovo(VI) kislino?", "kislino počasi ob mešanju zlivamo v vodo", ["vodo hitro zlijemo v kislino", "vodo in kislino hkrati zlijemo v posodo", "kislino segrejemo in dolijemo vodo"]],
          ["Kaj opazimo, ko marmor polijemo s klorovodikovo kislino?", "nastajajo mehurčki plina", ["nastane modra oborina", "marmor se obarva rdeče", "ni vidne spremembe"]],
        ];
        const [q, ok, wr] = r.pick(BANK);
        return {
          text: q,
          answer: choiceAns(r, ok, wr),
          hint: "Spomni se značilnih dokaznih reakcij in barv indikatorjev.",
          data: false,
          formula: false,
          solution: `Pravilno: ${ok}.`,
        };
      }
      if (level === 2) {
        const m = r.dec(2, 30, 1);
        const dm = (m / molar("CaCO3")) * molar("CO2");
        return {
          text: `Na tehtnici stoji odprta čaša s prebitkom klorovodikove kisline. Vanjo stresemo ${tx(m)} g marmorja (čisti $\\mathrm{CaCO_3}$). Za koliko gramov se zmanjša masa na tehtnici, ko se reakcija konča? ${Mx(["CaCO3", "CO2"])}. ${RND(2)}`,
          answer: num(dm, "g", 2),
          hint: "Masa se zmanjša, ker iz odprte čaše uide plin. Kateri?",
          data: { given: [dat("m(\\mathrm{CaCO_3})", tx(m), "g"), Md("CaCO3"), Md("CO2")], find: ["\\Delta m"] },
          formula: ["\\mathrm{CaCO_3 + 2HCl \\rightarrow CaCl_2 + H_2O + CO_2}", "\\Delta m = m(\\mathrm{CO_2})"],
          solution: `$n(\\mathrm{CaCO_3}) = \\dfrac{${tx(m)}}{100{,}09} = ${tx(m / molar("CaCO3"), 4)}$ mol $= n(\\mathrm{CO_2})$.\n$\\Delta m = ${tx(m / molar("CaCO3"), 4)} \\cdot 44{,}01 ${res(dm, 2, "g")}$.`,
        };
      }
      const [anh, hx, name] = r.pick([["CuSO4", [5], "modre galice"], ["MgSO4", [7], "magnezijevega sulfata"], ["Na2CO3", [10, 7, 1], "natrijevega karbonata"], ["CaSO4", [2], "sadre"], ["BaCl2", [2], "barijevega klorida"]]);
      const x = r.pick(hx);
      const m1 = r.dec(2, 20, 2);
      const m2 = roundHalfUp((m1 * molar(anh)) / (molar(anh) + x * molar("H2O")), 2);
      const xr = ((m1 - m2) / molar("H2O")) / (m2 / molar(anh));
      return {
        text: `Kristalohidrat ${name} ($${ft(anh)} \\cdot x\\,\\mathrm{H_2O}$) z maso ${tx(m1)} g segrevamo do stalne mase. Ostane ${tx(m2)} g brezvodne soli. Koliko je $x$? ${Mx([anh, "H2O"])}.`,
        answer: num(Math.round(xr)),
        hint: "Razlika mas je izparela voda. Primerjaj množino vode z množino brezvodne soli.",
        data: { given: [dat("m_1", tx(m1), "g"), dat("m_2", tx(m2), "g"), Md(anh), Md("H2O")], find: ["x"] },
        formula: "x = \\dfrac{n(\\mathrm{H_2O})}{n(\\text{sol})}",
        solution: `$m(\\mathrm{H_2O}) = ${tx(m1)} - ${tx(m2)} = ${tx(roundHalfUp(m1 - m2, 2))}$ g, $n(\\mathrm{H_2O}) = ${tx((m1 - m2) / molar("H2O"), 4)}$ mol, $n(\\text{sol}) = ${tx(m2 / molar(anh), 4)}$ mol.\n$x = ${tx(xr, 2)} \\approx ${Math.round(xr)}$.`,
      };
    },
  },
  // ================================================================ SŠ
  {
    id: "tek-kem-omejitveni",
    topics: [SS("stehiometrija-z-omejitvenim-reaktantom-in-izkoristkom")],
    gen(level, r) {
      if (level === 1) {
        const [ore, w0] = [r.pick([["hematita", "Fe2O3"], ["magnetita", "Fe3O4"]]), r.int(50, 90)];
        const [oname, of] = ore;
        const m = r.dec(0.5, 20, 1);
        const nFe = parseF(of).Fe;
        const x = ((m * 1000 * (w0 / 100)) / molar(of)) * nFe * AR.Fe / 1000;
        return {
          text: `Ruda vsebuje ${w0} % (masni delež) ${oname} (${FT(of)}), ostalo so primesi brez železa. Koliko kilogramov železa lahko največ pridobimo iz ${tx(m)} t rude? $A_r(\\mathrm{Fe}) = ${tx(AR.Fe)}$, ${Mx([of])}. ${RND(1)}`,
          answer: num(x * 1000, "kg", 1),
          hint: "Iz mase rude izračunaj maso čistega oksida, nato upoštevaj, koliko atomov železa je v formulski enoti.",
          data: { given: [`w = ${w0}\\,\\%`, dat("m", tx(m), "t"), Ad("Fe"), Md(of)], find: ["m(\\mathrm{Fe})"] },
          formula: [`m(\\mathrm{Fe}) = w \\cdot m \\cdot \\dfrac{${nFe} A_r(\\mathrm{Fe})}{M(${ft(of)})}`],
          solution: `$m(${ft(of)}) = ${tx(w0 / 100)} \\cdot ${tx(m)}\\ \\mathrm{t} = ${tx((m * w0) / 100, 3)}$ t.\n$m(\\mathrm{Fe}) = ${tx((m * w0) / 100, 3)}\\ \\mathrm{t} \\cdot \\dfrac{${nFe} \\cdot ${tx(AR.Fe)}}{${tx(molar(of), 2)}} ${res(x * 1000, 1, "kg")}$.`,
        };
      }
      const R = r.pick(TWO);
      const L = limiting(r, R, [5, 100]);
      if (level === 2) {
        const eta = r.int(55, 95);
        const mAct = roundHalfUp((L.mp * eta) / 100, 2);
        const y = (mAct / L.mp) * 100;
        return {
          text: `Zmešamo ${tx(L.m1)} g ${FT(L.f1)} in ${tx(L.m2)} g ${FT(L.f2)}, ki reagirata po enačbi $${eqT(R.L, R.R)}$. Dobimo ${tx(mAct)} g ${FT(L.fp)}. Kolikšen je izkoristek reakcije? ${Mx([L.f1, L.f2, L.fp])}. ${RND(1)}`,
          answer: num(y, "%", 1),
          hint: "Teoretično maso produkta izračunaj iz omejitvenega reaktanta; izkoristek je dejanska masa, deljena s teoretično.",
          data: { given: [dat(`m(${ft(L.f1)})`, tx(L.m1), "g"), dat(`m(${ft(L.f2)})`, tx(L.m2), "g"), dat("m_{dejanska}", tx(mAct), "g"), Md(L.f1), Md(L.f2), Md(L.fp)], find: ["\\eta"] },
          formula: ["\\text{omejitveni reaktant: najmanjši } \\dfrac{n}{\\text{koeficient}}", "\\eta = \\dfrac{m_{dejanska}}{m_{teoretična}} \\cdot 100\\,\\%"],
          solution: `$\\dfrac{n_1}{${L.c1}} = ${tx(L.n1 / L.c1, 4)}$ mol, $\\dfrac{n_2}{${L.c2}} = ${tx(L.n2 / L.c2, 4)}$ mol; omejitveni reaktant je ${uf(L.lim === 0 ? L.f1 : L.f2)}.\n$m_{teoretična} = ${L.cp === 1 ? "" : `${L.cp} \\cdot `}${tx(L.xi, 4)} \\cdot ${tx(molar(L.fp), 2)} = ${tx(L.mp, 2)}$ g, $\\eta = \\dfrac{${tx(mAct)}}{${tx(L.mp, 2)}} \\cdot 100\\,\\% ${res(y, 1, "\\%")}$.`,
        };
      }
      const [ce, fe, ne] = L.lim === 0 ? [L.c2, L.f2, L.n2] : [L.c1, L.f1, L.n1];
      const mEx = (ne - L.xi * ce) * molar(fe);
      return {
        text: `Zmešamo ${tx(L.m1)} g ${FT(L.f1)} in ${tx(L.m2)} g ${FT(L.f2)}, ki reagirata po enačbi $${eqT(R.L, R.R)}$. Koliko gramov reaktanta v prebitku ostane po popolni reakciji? ${Mx([L.f1, L.f2])}. ${RND(2)}`,
        answer: num(mEx, "g", 2),
        hint: "Določi omejitveni reaktant, izračunaj, koliko drugega reaktanta se porabi, in odštej od začetne množine.",
        data: { given: [dat(`m(${ft(L.f1)})`, tx(L.m1), "g"), dat(`m(${ft(L.f2)})`, tx(L.m2), "g"), Md(L.f1), Md(L.f2)], find: ["m_{ostanek}"] },
        formula: ["n_{porabljeno} = \\text{koeficient} \\cdot \\xi", "m_{ostanek} = (n_0 - n_{porabljeno}) M"],
        solution: `$\\dfrac{n_1}{${L.c1}} = ${tx(L.n1 / L.c1, 4)}$ mol, $\\dfrac{n_2}{${L.c2}} = ${tx(L.n2 / L.c2, 4)}$ mol; v prebitku je ${uf(fe)}.\nPorabi se $${ce} \\cdot ${tx(L.xi, 4)} = ${tx(L.xi * ce, 4)}$ mol, ostane $${tx(ne - L.xi * ce, 4)}$ mol, to je $${res(mEx, 2, "g").replace(/^= /, "")}$.`,
      };
    },
  },
  {
    id: "tek-kem-plini",
    topics: [SS("plini-in-plinska-enacba")],
    gen(level, r) {
      const t = r.int(0, 40), p = r.pick([95, 98, 100, 101.3, 102]);
      const T = t + 273.15;
      const cond = `pri ${t} °C in ${tx(p)} kPa`;
      const RT = `$R = 8{,}314\\ \\mathrm{J/(mol\\,K)}$`;
      if (level === 1) {
        const [src, gas, eq, k] = r.pick([
          ["CaCO3", "CO2", eqT([[1, "CaCO3"], [2, "HCl"]], [[1, "CaCl2"], [1, "H2O"], [1, "CO2"]]), 1],
          ["Zn", "H2", eqT([[1, "Zn"], [2, "HCl"]], [[1, "ZnCl2"], [1, "H2"]]), 1],
          ["Al", "H2", eqT([[2, "Al"], [6, "HCl"]], [[2, "AlCl3"], [3, "H2"]]), 1.5],
          ["Mg", "H2", eqT([[1, "Mg"], [2, "HCl"]], [[1, "MgCl2"], [1, "H2"]]), 1],
        ]);
        const m = r.dec(0.5, 20, 2);
        const Msrc = AR[src] ? AR[src] : molar(src);
        const n = (m / Msrc) * k;
        const V = ((n * R_GAS * T) / (p * 1000)) * 1000;
        return {
          text: `${tx(m)} g ${FT(src)} raztopimo v prebitku klorovodikove kisline: $${eq}$. Kolikšna prostornina ${FT(gas)} nastane ${cond}? ${AR[src] ? `$${Ad(src)}$` : Mx([src])}, ${RT}. Izrazi v litrih in ${DW(3)}.`,
          answer: num(V, "L", 3, { unitAlternatives: ["l", "dm3", "dm³"] }),
          hint: "Iz mase izračunaj množino plina, nato uporabi splošno plinsko enačbo $pV = nRT$ (temperatura v kelvinih, tlak v pascalih).",
          data: { given: [dat("m", tx(m), "g"), dat("t", t, "°C"), dat("p", tx(p), "kPa"), AR[src] ? Ad(src) : Md(src), "R = 8{,}314\\ \\mathrm{J/(mol\\,K)}"], find: [`V(${ft(gas)})`] },
          formula: ["pV = nRT", "V = \\dfrac{nRT}{p}"],
          solution: `$n(${ft(gas)}) = ${k === 1 ? "" : "\\tfrac{3}{2} \\cdot "}\\dfrac{${tx(m)}}{${tx(Msrc, 2)}} = ${tx(n, 5)}$ mol, $T = ${tx(T)}$ K.\n$V = \\dfrac{${tx(n, 5)} \\cdot 8{,}314 \\cdot ${tx(T)}}{${tx(p * 1000)}}\\ \\mathrm{m^3} ${res(V, 3, "L")}$.`,
        };
      }
      if (level === 2) {
        const gas = r.pick(["CH4", "C2H6", "C3H8", "CO2", "SO2", "NH3", "Cl2", "C4H10", "N2", "O2", "C2H4", "NO2"]);
        const m = r.dec(0.5, 10, 2);
        const V = roundHalfUp((((m / molar(gas)) * R_GAS * T) / (p * 1000)) * 1000, 3);
        const M = (m * R_GAS * T) / ((p * 1000 * V) / 1000);
        return {
          text: `Plin z maso ${tx(m)} g zavzema ${cond} prostornino ${tx(V)} L. Kolikšna je njegova molska masa? ${RT}. ${RND(1)}`,
          answer: num(M, "g/mol", 1),
          hint: "Iz $pV = nRT$ izrazi $n$, nato $M = m/n$. Pazi na enote ($\\mathrm{L} = 10^{-3}\\ \\mathrm{m^3}$).",
          data: { given: [dat("m", tx(m), "g"), dat("V", tx(V), "L"), dat("t", t, "°C"), dat("p", tx(p), "kPa"), "R = 8{,}314\\ \\mathrm{J/(mol\\,K)}"], find: ["M"] },
          formula: ["pV = \\dfrac{m}{M} R T", "M = \\dfrac{m R T}{p V}"],
          solution: `$M = \\dfrac{${tx(m)} \\cdot 8{,}314 \\cdot ${tx(T)}}{${tx(p * 1000)} \\cdot ${tx(V / 1000)}} ${res(M, 1, "g/mol")}$ (to ustreza plinu ${uf(gas)}).`,
        };
      }
      const [g1, g2] = r.shuffle(["N2", "O2", "CO2", "He", "Ar", "CH4", "H2"]).slice(0, 2);
      const M1 = molar(g1), M2 = molar(g2);
      const m1 = r.dec(1, 20, 1), m2 = r.dec(1, 20, 1), V = r.dec(2, 30, 1);
      const n1 = m1 / M1, n2 = m2 / M2;
      const p1 = (n1 * R_GAS * T) / (V / 1000) / 1000;
            return {
        text: `V posodi s prostornino ${tx(V)} L je pri ${t} °C zmes ${tx(m1)} g ${FT(g1)} in ${tx(m2)} g ${FT(g2)}. Kolikšen je delni (parcialni) tlak ${FT(g1)}? ${Mx([g1, g2])}, ${RT}. Izrazi v kPa in ${DW(1)}.`,
        answer: num(p1, "kPa", 1),
        hint: "Delni tlak plina je tlak, ki bi ga plin imel, če bi bil v posodi sam: $p_i = \\dfrac{n_i R T}{V}$.",
        data: { given: [dat("V", tx(V), "L"), dat("t", t, "°C"), dat("m_1", tx(m1), "g"), dat("m_2", tx(m2), "g"), Md(g1), Md(g2), "R = 8{,}314\\ \\mathrm{J/(mol\\,K)}"], find: ["p_1"] },
        formula: ["p_i = \\dfrac{n_i R T}{V}", "p = p_1 + p_2"],
        solution: `$n_1 = \\dfrac{${tx(m1)}}{${tx(M1, 2)}} = ${tx(n1, 4)}$ mol, $T = ${tx(T)}$ K.\n$p_1 = \\dfrac{${tx(n1, 4)} \\cdot 8{,}314 \\cdot ${tx(T)}}{${tx(V / 1000)}}\\ \\mathrm{Pa} ${res(p1, 1, "kPa")}$ (skupni tlak je $${tx(((n1 + n2) * R_GAS * T) / (V / 1000) / 1000, 1)}$ kPa).`,
      };
    },
  },
  {
    id: "tek-kem-termokemija",
    topics: [SS("termokemija")],
    gen(level, r) {
      if (level === 1) {
        const [f, dH, name] = r.pick([["NaOH", -44.5, "natrijevega hidroksida"], ["KOH", -57.6, "kalijevega hidroksida"], ["NH4NO3", 25.7, "amonijevega nitrata"], ["NH4Cl", 14.8, "amonijevega klorida"], ["CaCl2", -81.3, "kalcijevega klorida"]]);
        const m = r.dec(2, 12, 1), mw = r.int(5, 20) * 10;
        const n = m / molar(f);
        const dT = roundHalfUp((-dH * 1000 * n) / ((m + mw) * 4.18), 1);
        const H = (-(m + mw) * 4.18 * dT) / n / 1000;
        return {
          text: `V kalorimetru raztopimo ${tx(m)} g ${name} (${FT(f)}) v ${mw} g vode. Temperatura raztopine se ${dT > 0 ? "dvigne" : "zniža"} za ${tx(Math.abs(dT))} °C. Specifična toplota raztopine je $4{,}18\\ \\mathrm{J/(g\\,K)}$, toplotna kapaciteta kalorimetra je zanemarljiva. Kolikšna je molska entalpija raztapljanja v kJ/mol? ${Mx([f])}. ${RND(1)}`,
          answer: num(H, "kJ/mol", 1),
          hint: "Toplota $Q = m c \\Delta T$ (masa raztopine je masa vode in soli). Če se raztopina segreje, je proces eksotermen in $\\Delta H < 0$.",
          data: { given: [dat("m", tx(m), "g"), dat("m_{voda}", mw, "g"), `\\Delta T = ${tx(Math.abs(dT))}\\ \\mathrm{K}`, "c = 4{,}18\\ \\mathrm{J/(g\\,K)}", Md(f)], find: ["\\Delta H"] },
          formula: ["Q = m c \\Delta T", "\\Delta H = -\\dfrac{Q}{n}"],
          solution: `$Q = ${tx(m + mw)} \\cdot 4{,}18 \\cdot ${tx(Math.abs(dT))} = ${tx((m + mw) * 4.18 * Math.abs(dT), 1)}$ J (toplota se ${dT > 0 ? "sprosti" : "porabi"}), $n = ${tx(n, 4)}$ mol.\n$\\Delta H ${res(H, 1, "kJ/mol")}$.`,
        };
      }
      const FUEL = [["CH4", -74.8, "metana"], ["C2H6", -84.7, "etana"], ["C3H8", -103.8, "propana"], ["C4H10", -125.6, "butana"], ["C2H4", 52.3, "etena"], ["C2H2", 226.7, "etina"], ["CH3OH", -238.7, "metanola"], ["C2H5OH", -277.7, "etanola"], ["C6H12O6", -1273.3, "glukoze"]];
      const [f, Hf, name] = r.pick(FUEL);
      const { C: x, H: y, O: z = 0 } = parseF(f);
      const o2 = x + y / 4 - z / 2;
      const Hc = x * -393.5 + (y / 2) * -285.8 - Hf;
      const eq = eqT([[1, f], [o2, "O2"]], [[x, "CO2"], [y / 2, "H2O"]]);
      if (level === 2) {
        return {
          text: `Izračunaj standardno entalpijo gorenja ${name} po enačbi $${eq}$ (voda nastane kot tekočina). Standardne tvorbene entalpije: $\\Delta H_f(${ft(f)}) = ${tx(Hf)}\\ \\mathrm{kJ/mol}$, $\\Delta H_f(\\mathrm{CO_2}) = -393{,}5\\ \\mathrm{kJ/mol}$, $\\Delta H_f(\\mathrm{H_2O(l)}) = -285{,}8\\ \\mathrm{kJ/mol}$. ${RND(1)}`,
          answer: num(Hc, "kJ/mol", 1),
          hint: "$\\Delta H_r = \\sum \\Delta H_f(\\text{produkti}) - \\sum \\Delta H_f(\\text{reaktanti})$; tvorbena entalpija elementa ($\\mathrm{O_2}$) je 0.",
          data: { given: [`\\Delta H_f(${ft(f)}) = ${tx(Hf)}\\ \\mathrm{kJ/mol}`, "\\Delta H_f(\\mathrm{CO_2}) = -393{,}5\\ \\mathrm{kJ/mol}", "\\Delta H_f(\\mathrm{H_2O}) = -285{,}8\\ \\mathrm{kJ/mol}"], find: ["\\Delta H_r"] },
          formula: "\\Delta H_r = \\sum \\nu\\, \\Delta H_f(\\text{produkti}) - \\sum \\nu\\, \\Delta H_f(\\text{reaktanti})",
          solution: `$\\Delta H_r = ${x} \\cdot (-393{,}5) + ${tx(y / 2)} \\cdot (-285{,}8) - (${tx(Hf)}) ${res(Hc, 1, "kJ/mol")}$.`,
        };
      }
      const Hcr = roundHalfUp(Hc, 1);
      const L = r.int(1, 10), t1 = r.int(10, 25), t2 = r.int(60, 100), eta = r.int(40, 90);
      const Q = L * 1000 * 4.18 * (t2 - t1);
      const m = ((Q / (eta / 100)) / (-Hcr * 1000)) * molar(f);
      return {
        text: `Koliko gramov ${name} moramo sežgati, da ${L} L vode segrejemo s ${t1} °C na ${t2} °C, če se za segrevanje porabi le ${eta} % sproščene toplote? Entalpija gorenja ${name} je $${tx(Hcr)}\\ \\mathrm{kJ/mol}$, specifična toplota vode $4{,}18\\ \\mathrm{J/(g\\,K)}$, gostota vode $1\\ \\mathrm{kg/L}$. ${Mx([f])}. ${RND(1)}`,
        answer: num(m, "g", 1),
        hint: "Izračunaj toploto za segrevanje vode, jo deli z izkoristkom, nato deli z molsko entalpijo gorenja.",
        data: { given: [dat("V", L, "L"), dat("t_1", t1, "°C"), dat("t_2", t2, "°C"), `\\eta = ${eta}\\,\\%`, `\\Delta H_c = ${tx(Hcr)}\\ \\mathrm{kJ/mol}`, Md(f)], find: ["m"] },
        formula: ["Q = m_{voda} c \\Delta T", "n = \\dfrac{Q}{\\eta\\, |\\Delta H_c|}", "m = n M"],
        solution: `$Q = ${L * 1000} \\cdot 4{,}18 \\cdot ${t2 - t1} = ${tx(Q / 1000, 1)}$ kJ, potrebna toplota gorenja $\\dfrac{${tx(Q / 1000, 1)}}{${tx(eta / 100)}} = ${tx(Q / 1000 / (eta / 100), 1)}$ kJ.\n$n = \\dfrac{${tx(Q / 1000 / (eta / 100), 1)}}{${tx(-Hcr)}} = ${tx(Q / 1000 / (eta / 100) / -Hcr, 4)}$ mol, $m ${res(m, 1, "g")}$.`,
      };
    },
  },
  {
    id: "tek-kem-ravnotezje",
    topics: [SS("kemijsko-ravnotezje")],
    gen(level, r) {
      const C = (f) => `[${ft(f)}]`;
      if (level === 1) {
        const EQS = [
          { L: [[1, "H2"], [1, "I2"]], R: [[2, "HI"]] },
          { L: [[1, "N2"], [3, "H2"]], R: [[2, "NH3"]] },
          { L: [[2, "SO2"], [1, "O2"]], R: [[2, "SO3"]] },
          { L: [[1, "PCl5"]], R: [[1, "PCl3"], [1, "Cl2"]] },
          { L: [[1, "N2O4"]], R: [[2, "NO2"]] },
          { L: [[1, "CO"], [1, "H2O"]], R: [[1, "CO2"], [1, "H2"]] },
        ];
        const E = r.pick(EQS);
        const conc = {};
        for (const [, f] of [...E.L, ...E.R]) conc[f] = r.dec(0.05, 1.5, 2);
        const pw = (arr) => arr.reduce((s, [c, f]) => s * conc[f] ** c, 1);
        const K = pw(E.R) / pw(E.L);
        const d = sigDec(K);
        const term = (arr) => arr.map(([c, f]) => `${C(f)}${c === 1 ? "" : `^{${c}}`}`).join(" ");
        const termN = (arr) => arr.map(([c, f]) => `${tx(conc[f])}${c === 1 ? "" : `^{${c}}`}`).join(" \\cdot ");
        return {
          text: `Za ravnotežje $${eqT(E.L, E.R, "\\rightleftharpoons")}$ (vse snovi so plini) smo v ravnotežju izmerili koncentracije (v mol/L): ${[...E.L, ...E.R].map(([, f]) => `$${C(f)} = ${tx(conc[f])}$`).join(", ")}. Kolikšna je konstanta ravnotežja $K_c$ (brez enote)? ${RND(d)}`,
          answer: num(K, null, d),
          hint: "Konstanta ravnotežja: produkti nad reaktanti, vsaka koncentracija na potenco svojega koeficienta.",
          data: { given: [...E.L, ...E.R].map(([, f]) => `${C(f)} = ${tx(conc[f])}\\ \\mathrm{mol/L}`), find: ["K_c"] },
          formula: `K_c = \\dfrac{${term(E.R)}}{${term(E.L)}}`,
          solution: `$K_c = \\dfrac{${termN(E.R)}}{${termN(E.L)}} ${res(K, d)}$.`,
        };
      }
      if (level === 2) {
        const c0 = r.dec(0.1, 2, 2), K = r.pick([25, 36, 49, 50, 54, 64, 81, 100]);
        const s = Math.sqrt(K);
        const x = (s * c0) / (2 + s);
        return {
          text: `V posodo damo vodik in jod, oba s koncentracijo ${tx(c0)} mol/L. Vzpostavi se ravnotežje $\\mathrm{H_2 + I_2 \\rightleftharpoons 2HI}$ s konstanto $K_c = ${K}$. Kolikšna je ravnotežna koncentracija HI v mol/L? ${RND(3)}`,
          answer: num(2 * x, "mol/L", 3, { unitAlternatives: ["mol/l", "M", "mol/dm3"] }),
          hint: "Tabela začetno–sprememba–ravnotežje: $[\\mathrm{H_2}] = [\\mathrm{I_2}] = c_0 - x$, $[\\mathrm{HI}] = 2x$. Ker sta imenovalca enaka, enačbo koreniš.",
          data: { given: [dat("c_0", tx(c0), "mol/L"), `K_c = ${K}`], find: ["[\\mathrm{HI}]"] },
          formula: ["K_c = \\dfrac{(2x)^2}{(c_0 - x)^2}", "\\sqrt{K_c} = \\dfrac{2x}{c_0 - x}"],
          solution: `$\\sqrt{${K}} = ${tx(s, 3)} = \\dfrac{2x}{${tx(c0)} - x}$, torej $x = \\dfrac{${tx(s, 3)} \\cdot ${tx(c0)}}{2 + ${tx(s, 3)}} = ${tx(x, 4)}$ mol/L.\n$[\\mathrm{HI}] = 2x ${res(2 * x, 3, "mol/L")}$.`,
        };
      }
      if (r.next() < 0.5) {
        const c0 = r.dec(0.1, 2, 2), K = r.dec(0.02, 1.5, 2);
        const x = (-K + Math.sqrt(K * K + 4 * K * c0)) / 2;
        const a = (x / c0) * 100;
        return {
          text: `V posodo damo $\\mathrm{PCl_5}$ z začetno koncentracijo ${tx(c0)} mol/L. Pri dani temperaturi razpada po enačbi $\\mathrm{PCl_5 \\rightleftharpoons PCl_3 + Cl_2}$ s konstanto $K_c = ${tx(K)}$. Kolikšen odstotek $\\mathrm{PCl_5}$ razpade (stopnja disociacije)? ${RND(1)}`,
          answer: num(a, "%", 1),
          hint: "Z $x$ označi koncentracijo razpadlega $\\mathrm{PCl_5}$. Dobiš kvadratno enačbo $x^2 = K_c (c_0 - x)$.",
          data: { given: [dat("c_0", tx(c0), "mol/L"), `K_c = ${tx(K)}`], find: ["\\alpha"] },
          formula: ["K_c = \\dfrac{x^2}{c_0 - x}", "\\alpha = \\dfrac{x}{c_0}"],
          solution: `$x^2 + ${tx(K)}x - ${tx(K * c0, 4)} = 0$, $x = ${tx(x, 4)}$ mol/L.\n$\\alpha = \\dfrac{${tx(x, 4)}}{${tx(c0)}} ${res(a, 1, "\\%")}$.`,
        };
      }
      const a0 = r.dec(0.2, 2, 2), b0 = r.dec(0.2, 2, 2), K = r.pick([20, 30, 45, 50, 60]);
      // (K-4)x² - K(a+b)x + K ab = 0
      const A = K - 4, B = -K * (a0 + b0), Cc = K * a0 * b0;
      const x = (-B - Math.sqrt(B * B - 4 * A * Cc)) / (2 * A);
      return {
        text: `V posodo damo vodik s koncentracijo ${tx(a0)} mol/L in jod s koncentracijo ${tx(b0)} mol/L. Vzpostavi se ravnotežje $\\mathrm{H_2 + I_2 \\rightleftharpoons 2HI}$ s konstanto $K_c = ${K}$. Kolikšna je ravnotežna koncentracija HI v mol/L? ${RND(3)}`,
        answer: num(2 * x, "mol/L", 3, { unitAlternatives: ["mol/l", "M", "mol/dm3"] }),
        hint: "Tabela: $[\\mathrm{H_2}] = a - x$, $[\\mathrm{I_2}] = b - x$, $[\\mathrm{HI}] = 2x$. Dobiš kvadratno enačbo; smiselna rešitev je manjša od $a$ in $b$.",
        data: { given: [dat("[\\mathrm{H_2}]_0", tx(a0), "mol/L"), dat("[\\mathrm{I_2}]_0", tx(b0), "mol/L"), `K_c = ${K}`], find: ["[\\mathrm{HI}]"] },
        formula: "K_c = \\dfrac{(2x)^2}{(a - x)(b - x)}",
        solution: `$${A}x^2 - ${tx(-B, 2)}x + ${tx(Cc, 4)} = 0$, smiselna rešitev $x = ${tx(x, 4)}$ mol/L.\n$[\\mathrm{HI}] = 2x ${res(2 * x, 3, "mol/L")}$.`,
      };
    },
  },
  {
    id: "tek-kem-ph",
    topics: [SS("kisline-baze-ph-in-pufri")],
    gen(level, r) {
      const lg = Math.log10;
      if (level === 1) {
        let V1, c1, V2, c2, nA, nB;
        do {
          V1 = r.int(5, 50); c1 = r.dec(0.01, 0.5, 2); V2 = r.int(5, 50); c2 = r.dec(0.01, 0.5, 2);
          nA = V1 * c1; nB = V2 * c2;
        } while (Math.abs(nA - nB) / Math.max(nA, nB) < 0.05);
        const Vt = V1 + V2;
        const pH = nA > nB ? -lg((nA - nB) / Vt) : 14 + lg((nB - nA) / Vt);
        return {
          text: `Zmešamo ${V1} mL klorovodikove kisline s koncentracijo ${tx(c1)} mol/L in ${V2} mL raztopine NaOH s koncentracijo ${tx(c2)} mol/L. Kolikšen je pH nastale raztopine (25 °C)? ${RND(2)}`,
          answer: num(pH, null, 2),
          hint: "Najprej izračunaj, česa je v prebitku ($\\mathrm{H^+}$ ali $\\mathrm{OH^-}$), nato koncentracijo prebitka v skupni prostornini.",
          data: { given: [dat("V_1", V1, "mL"), dat("c_1", tx(c1), "mol/L"), dat("V_2", V2, "mL"), dat("c_2", tx(c2), "mol/L")], find: ["\\mathrm{pH}"] },
          formula: ["\\mathrm{pH} = -\\log [\\mathrm{H^+}]", "\\mathrm{pH} = 14 + \\log [\\mathrm{OH^-}]"],
          solution: `$n(\\mathrm{H^+}) = ${tx(nA, 3)}$ mmol, $n(\\mathrm{OH^-}) = ${tx(nB, 3)}$ mmol; v prebitku je ${nA > nB ? "kislina" : "baza"}: $${tx(Math.abs(nA - nB), 3)}$ mmol v ${Vt} mL.\n$[\\mathrm{${nA > nB ? "H^+" : "OH^-"}}] = ${tx(Math.abs(nA - nB) / Vt, 5)}$ mol/L, $\\mathrm{pH} ${res(pH, 2)}$.`,
        };
      }
      const ACID = [["ocetna kislina", "CH3COOH", 1.8e-5, "1{,}8 \\cdot 10^{-5}", "ocetne kisline"], ["mravljična kislina", "HCOOH", 1.8e-4, "1{,}8 \\cdot 10^{-4}", "mravljične kisline"], ["fluorovodikova kislina", "HF", 6.8e-4, "6{,}8 \\cdot 10^{-4}", "fluorovodikove kisline"], ["dušikova(III) kislina", "HNO2", 4.5e-4, "4{,}5 \\cdot 10^{-4}", "dušikove(III) kisline"], ["benzojska kislina", "C6H5COOH", 6.3e-5, "6{,}3 \\cdot 10^{-5}", "benzojske kisline"]];
      const [an, af, Ka, KaT, aGen] = r.pick(ACID);
      if (level === 2) {
        const c = r.pick([0.001, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5]);
        const x = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * c)) / 2;
        const pH = -lg(x);
        const approx = -lg(Math.sqrt(Ka * c));
        return {
          text: `Kolikšen je pH raztopine, v kateri je ${an} (${FT(af)}) s koncentracijo ${tx(c)} mol/L? $K_a = ${KaT}$. Računaj natančno (s kvadratno enačbo). ${RND(2)}`,
          answer: num(pH, null, 2, { alsoAccept: Math.abs(pH - approx) < 0.02 ? [approx] : [] }),
          hint: "Za šibko kislino: $K_a = \\dfrac{x^2}{c - x}$, kjer je $x = [\\mathrm{H^+}]$.",
          data: { given: [dat("c", tx(c), "mol/L"), `K_a = ${KaT}`], find: ["\\mathrm{pH}"] },
          formula: ["K_a = \\dfrac{x^2}{c - x}", "\\mathrm{pH} = -\\log x"],
          solution: `$x^2 + K_a x - K_a c = 0$, $x = [\\mathrm{H^+}] = ${tx(x * 1e4, 3)} \\cdot 10^{-4}$ mol/L.\n$\\mathrm{pH} ${res(pH, 2)}$ (približek $\\sqrt{K_a c}$ bi dal ${tx(approx, 2)}).`,
        };
      }
      let V1, c1, V2, c2, nA, nB;
      do {
        V1 = r.int(10, 100); c1 = r.dec(0.05, 0.5, 2); V2 = r.int(5, 60); c2 = r.dec(0.05, 0.5, 2);
        nA = V1 * c1; nB = V2 * c2;
      } while (nB >= nA * 0.9 || nB <= nA * 0.1);
      const pKa = -lg(Ka);
      const pH = pKa + lg(nB / (nA - nB));
      return {
        text: `Zmešamo ${V1} mL raztopine ${aGen} (${FT(af)}) s koncentracijo ${tx(c1)} mol/L in ${V2} mL raztopine NaOH s koncentracijo ${tx(c2)} mol/L. Kolikšen je pH nastalega pufra? $K_a = ${KaT}$. ${RND(2)}`,
        answer: num(pH, null, 2),
        hint: "NaOH pretvori del kisline v njeno konjugirano bazo. Uporabi Henderson–Hasselbalchovo enačbo z množinama.",
        data: { given: [dat("V_1", V1, "mL"), dat("c_1", tx(c1), "mol/L"), dat("V_2", V2, "mL"), dat("c_2", tx(c2), "mol/L"), `K_a = ${KaT}`], find: ["\\mathrm{pH}"] },
        formula: "\\mathrm{pH} = \\mathrm{p}K_a + \\log \\dfrac{n(\\mathrm{A^-})}{n(\\mathrm{HA})}",
        solution: `$n(\\mathrm{HA})_0 = ${tx(nA, 2)}$ mmol, $n(\\mathrm{OH^-}) = ${tx(nB, 2)}$ mmol. Po reakciji: $n(\\mathrm{A^-}) = ${tx(nB, 2)}$ mmol, $n(\\mathrm{HA}) = ${tx(nA - nB, 2)}$ mmol.\n$\\mathrm{p}K_a = ${tx(pKa, 3)}$, $\\mathrm{pH} = ${tx(pKa, 3)} + \\log \\dfrac{${tx(nB, 2)}}{${tx(nA - nB, 2)}} ${res(pH, 2)}$.`,
      };
    },
  },
  {
    id: "tek-kem-redoks",
    topics: [SS("redoks-reakcije-in-elektrokemija")],
    gen(level, r) {
      const POT = [["Mg", 2, -2.37], ["Al", 3, -1.66], ["Zn", 2, -0.76], ["Fe", 2, -0.44], ["Ni", 2, -0.25], ["Sn", 2, -0.14], ["Pb", 2, -0.13], ["Cu", 2, 0.34], ["Ag", 1, 0.8]];
      if (level === 1) {
        if (r.next() < 0.5) {
          const OXN = [["KMnO4", "Mn", 7], ["K2Cr2O7", "Cr", 6], ["Na2S2O3", "S", 2], ["H2SO3", "S", 4], ["HNO3", "N", 5], ["NO2", "N", 4], ["HClO4", "Cl", 7], ["NaClO", "Cl", 1], ["H2O2", "O", -1], ["CH4", "C", -4], ["Na2C2O4", "C", 3], ["H3PO4", "P", 5], ["N2H4", "N", -2], ["NaH", "H", -1], ["OF2", "O", 2], ["K2MnO4", "Mn", 6], ["NH4Cl", "N", -3], ["KClO3", "Cl", 5]];
          const [f, e, v] = r.pick(OXN);
          return {
            text: `Kolikšno je oksidacijsko število ${FT(e)} v spojini ${FT(f)}? (Zapiši kot celo število, npr. 3 ali −2.)`,
            answer: num(v),
            hint: "Vsota oksidacijskih števil v nevtralni spojini je 0. Običajno: H je +1 (v hidridih kovin −1), O je −2 (v peroksidih −1, v $\\mathrm{OF_2}$ +2), alkalijske kovine +1.",
            data: false,
            formula: "\\sum \\text{oksidacijskih števil} = 0",
            solution: `Iz vsote oksidacijskih števil (0) dobimo za ${e} vrednost $${v > 0 ? "+" : ""}${v}$.`,
          };
        }
        const [a, b] = r.shuffle(POT).slice(0, 2);
        const [an, ca] = a[2] < b[2] ? [a, b] : [b, a];
        const E = ca[2] - an[2];
        return {
          text: `Galvanski člen sestavljata polčlena $\\mathrm{${an[0]}|${an[0]}^{${an[1] === 1 ? "" : an[1]}+}}$ in $\\mathrm{${ca[0]}|${ca[0]}^{${ca[1] === 1 ? "" : ca[1]}+}}$ pri standardnih pogojih. Standardna redukcijska potenciala: $E^\\circ(\\mathrm{${an[0]}^{${an[1] === 1 ? "" : an[1]}+}/${an[0]}}) = ${tx(an[2])}\\ \\mathrm{V}$, $E^\\circ(\\mathrm{${ca[0]}^{${ca[1] === 1 ? "" : ca[1]}+}/${ca[0]}}) = ${tx(ca[2])}\\ \\mathrm{V}$. Kolikšna je napetost člena? ${RND(2)}`,
          answer: num(E, "V", 2),
          hint: "Katoda je polčlen z višjim redukcijskim potencialom. Napetost je $E^\\circ_{katoda} - E^\\circ_{anoda}$.",
          data: { given: [`E^\\circ_1 = ${tx(an[2])}\\ \\mathrm{V}`, `E^\\circ_2 = ${tx(ca[2])}\\ \\mathrm{V}`], find: ["E"] },
          formula: "E = E^\\circ_{katoda} - E^\\circ_{anoda}",
          solution: `Katoda je ${ca[0]} (višji potencial), anoda ${an[0]}.\n$E = ${tx(ca[2])} - (${tx(an[2])}) ${res(E, 2, "V")}$.`,
        };
      }
      if (level === 2) {
        const [s, z] = r.pick([["Cu", 2], ["Ag", 1], ["Ni", 2], ["Zn", 2], ["Al", 3], ["Sn", 2]]);
        const I = r.dec(0.2, 5, 1), t = r.int(5, 120);
        const m = (I * t * 60 * AR[s]) / (z * FARADAY);
        return {
          text: `Skozi raztopino soli $\\mathrm{${s}^{${z === 1 ? "" : z}+}}$ teče ${t} minut električni tok ${tx(I)} A. Koliko gramov kovine ${FT(s)} se izloči na katodi? $${Ad(s)}$, $F = 96485\\ \\mathrm{As/mol}$. ${RND(3)}`,
          answer: num(m, "g", 3),
          hint: "Naboj $Q = I t$; za izločitev 1 mol kovine z nabojem iona $z$ potrebujemo $z F$ naboja.",
          data: { given: [dat("I", tx(I), "A"), dat("t", t, "min"), `z = ${z}`, Ad(s), "F = 96485\\ \\mathrm{As/mol}"], find: ["m"] },
          formula: ["Q = I t", "m = \\dfrac{Q M}{z F}"],
          solution: `$Q = ${tx(I)} \\cdot ${t * 60} = ${tx(I * t * 60)}$ As.\n$m = \\dfrac{${tx(I * t * 60)} \\cdot ${tx(AR[s])}}{${z} \\cdot 96485} ${res(m, 3, "g")}$.`,
        };
      }
      const two = POT.filter((x) => x[1] === 2);
      const [a, b] = r.shuffle(two).slice(0, 2);
      const [an, ca] = a[2] < b[2] ? [a, b] : [b, a];
      const [c1, c2] = r.shuffle([0.001, 0.01, 0.05, 0.1, 0.5, 1, 2]).slice(0, 2);
      const E0 = ca[2] - an[2];
      const E = E0 - (0.0592 / 2) * Math.log10(c1 / c2);
      return {
        text: `Galvanski člen: $\\mathrm{${an[0]}|${an[0]}^{2+}}$ (${tx(c1)} mol/L) $\\|$ $\\mathrm{${ca[0]}^{2+}}$ (${tx(c2)} mol/L) $|\\mathrm{${ca[0]}}$ pri 25 °C. $E^\\circ(\\mathrm{${an[0]}^{2+}/${an[0]}}) = ${tx(an[2])}\\ \\mathrm{V}$, $E^\\circ(\\mathrm{${ca[0]}^{2+}/${ca[0]}}) = ${tx(ca[2])}\\ \\mathrm{V}$. Kolikšna je napetost člena? Uporabi Nernstovo enačbo s faktorjem $0{,}0592\\ \\mathrm{V}$. ${RND(3)}`,
        answer: num(E, "V", 3),
        hint: "$E = E^\\circ - \\dfrac{0{,}0592}{z} \\log Q$, kjer je $Q = \\dfrac{[\\text{ion anode}]}{[\\text{ion katode}]}$.",
        data: { given: [dat("c_1", tx(c1), "mol/L"), dat("c_2", tx(c2), "mol/L"), `E^\\circ_1 = ${tx(an[2])}\\ \\mathrm{V}`, `E^\\circ_2 = ${tx(ca[2])}\\ \\mathrm{V}`, "z = 2"], find: ["E"] },
        formula: ["E^\\circ = E^\\circ_{katoda} - E^\\circ_{anoda}", "E = E^\\circ - \\dfrac{0{,}0592}{z} \\log \\dfrac{c_1}{c_2}"],
        solution: `$E^\\circ = ${tx(ca[2])} - (${tx(an[2])}) = ${tx(E0, 2)}$ V.\n$E = ${tx(E0, 2)} - \\dfrac{0{,}0592}{2} \\log \\dfrac{${tx(c1)}}{${tx(c2)}} ${res(E, 3, "V")}$.`,
      };
    },
  },
  {
    id: "tek-kem-atom-ss",
    topics: [SS("zgradba-atoma-in-periodne-lastnosti")],
    gen(level, r) {
      const SYM = ["", "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr"];
      const ORDER = [[1, 0], [2, 0], [2, 1], [3, 0], [3, 1], [4, 0], [3, 2], [4, 1]];
      const config = (Z) => {
        const out = [];
        let left = Z;
        for (const [n, l] of ORDER) {
          if (!left) break;
          const e = Math.min(left, 2 * (2 * l + 1));
          out.push([n, l, e]);
          left -= e;
        }
        if (Z === 24 || Z === 29) {
          const s4 = out.find(([n, l]) => n === 4 && l === 0), d3 = out.find(([n, l]) => n === 3 && l === 2);
          s4[2] -= 1;
          d3[2] += 1;
        }
        return out;
      };
      const L = "spdf";
      const cfgTex = (cfg) => cfg.map(([n, l, e]) => `${n}${L[l]}^{${e}}`).join("\\,");
      if (level === 1) {
        const Z = r.int(5, 36);
        const cfg = config(Z);
        const up = cfg.reduce((s, [, l, e]) => s + (e <= 2 * l + 1 ? e : 2 * (2 * l + 1) - e), 0);
        return {
          text: `Koliko nesparjenih elektronov ima atom $\\mathrm{${SYM[Z]}}$ ($Z = ${Z}$) v osnovnem stanju?`,
          answer: num(up),
          hint: "Zapiši elektronsko konfiguracijo in upoštevaj Hundovo pravilo: orbitale iste podlupine se najprej zasedejo posamično. Pazi na izjemi Cr in Cu.",
          data: { given: [`Z = ${Z}`], find: ["\\text{nesparjeni } e^-"] },
          formula: "\\text{Hundovo pravilo}",
          solution: `Konfiguracija: $${cfgTex(cfg)}$${Z === 24 || Z === 29 ? " (izjema: polovično oz. popolnoma zasedena podlupina d je stabilnejša)" : ""}.\nNesparjenih elektronov je ${up}.`,
        };
      }
      if (level === 2) {
        const Z = r.int(11, 36);
        const cfg = config(Z);
        const kind = r.pick(["l1", "l2", "n3", "l0"]);
        const cnt = cfg.reduce((s, [n, l, e]) => s + ((kind === "l1" && l === 1) || (kind === "l2" && l === 2) || (kind === "l0" && l === 0) || (kind === "n3" && n === 3) ? e : 0), 0);
        if (cnt === 0) return null;
        const what = kind === "n3" ? "glavno kvantno število $n = 3$" : `stransko (orbitalno) kvantno število $l = ${kind[1]}$`;
        return {
          text: `Koliko elektronov v atomu $\\mathrm{${SYM[Z]}}$ ($Z = ${Z}$) v osnovnem stanju ima ${what}?`,
          answer: num(cnt),
          hint: "Zapiši elektronsko konfiguracijo. Orbitale s: $l = 0$, p: $l = 1$, d: $l = 2$.",
          data: { given: [`Z = ${Z}`], find: ["N"] },
          formula: "\\text{zaporedje: } 1s\\,2s\\,2p\\,3s\\,3p\\,4s\\,3d\\,4p",
          solution: `Konfiguracija: $${cfgTex(cfg)}$.\nIskanih elektronov je ${cnt}.`,
        };
      }
      const IE = { Li: 520, Be: 900, B: 801, C: 1086, N: 1402, O: 1314, F: 1681, Ne: 2081, Na: 496, Mg: 738, Al: 578, Si: 787, P: 1012, S: 1000, Cl: 1251, Ar: 1521, K: 419, Ca: 590 };
      const keys = Object.keys(IE);
      let els;
      do els = r.shuffle(keys).slice(0, 4);
      while (new Set(els.map((e) => IE[e])).size < 4);
      const sorted = [...els].sort((a, b) => IE[a] - IE[b]);
      const byZ = [...els].sort((a, b) => keys.indexOf(a) - keys.indexOf(b));
      const opts = [sorted, byZ, [...sorted].reverse(), r.shuffle(els), [sorted[1], sorted[0], sorted[2], sorted[3]], [sorted[0], sorted[2], sorted[1], sorted[3]]].map((a) => a.join(" < "));
      return {
        text: `Katero zaporedje elementov ${els.join(", ")} je pravilno urejeno po naraščajoči prvi ionizacijski energiji?`,
        answer: choiceAns(r, opts[0], opts.slice(1)),
        hint: "Ionizacijska energija v periodi narašča, v skupini pada. Izjemi: elementi 13. skupine imajo nižjo kot 2. skupina, elementi 16. skupine nižjo kot 15. skupina.",
        data: false,
        formula: false,
        solution: `Prve ionizacijske energije (kJ/mol): ${sorted.map((e) => `${e} ${IE[e]}`).join(", ")}.\nPravilno zaporedje: ${opts[0]}.`,
      };
    },
  },
  {
    id: "tek-kem-geometrija",
    topics: [SS("kemijska-vez-in-geometrija-molekul")],
    gen(level, r) {
      const MOL = [
        ["CH₄", "tetraedrična", "sp³", 0, false, 1], ["NH₃", "trigonalno piramidalna", "sp³", 1, true, 1], ["H₂O", "kotna", "sp³", 2, true, 1],
        ["CO₂", "linearna", "sp", 0, false, 1], ["BF₃", "trikotna planarna", "sp²", 0, false, 1], ["HCN", "linearna", "sp", 0, true, 1],
        ["CH₂O", "trikotna planarna", "sp²", 0, true, 1], ["PCl₃", "trigonalno piramidalna", "sp³", 1, true, 1], ["CCl₄", "tetraedrična", "sp³", 0, false, 1],
        ["NH₄⁺", "tetraedrična", "sp³", 0, false, 1], ["SO₂", "kotna", "sp²", 1, true, 2], ["SO₃", "trikotna planarna", "sp²", 0, false, 2],
        ["PCl₅", "trigonalno bipiramidalna", "sp³d", 0, false, 2], ["SF₆", "oktaedrična", "sp³d²", 0, false, 2], ["SF₄", "nihajna (oblika gugalnice)", "sp³d", 1, true, 2],
        ["ClF₃", "T-oblika", "sp³d", 2, true, 2], ["XeF₂", "linearna", "sp³d", 3, false, 2], ["XeF₄", "kvadratno planarna", "sp³d²", 2, false, 2],
        ["BrF₅", "kvadratno piramidalna", "sp³d²", 1, true, 2], ["I₃⁻", "linearna", "sp³d", 3, false, 2], ["NO₂⁻", "kotna", "sp²", 1, true, 2], ["CHCl₃", "tetraedrična", "sp³", 0, true, 1],
      ];
      const SHAPES = [...new Set(MOL.map((m) => m[1]))];
      const PAIRS = (k) => (k === 0 ? "nima nevezanih elektronskih parov" : `ima ${k} ${k === 1 ? "nevezan par" : k === 2 ? "nevezana para" : "nevezane pare"}`);
      if (level <= 2) {
        const pool = MOL.filter((m) => (level === 1 ? m[5] === 1 : m[5] === 2));
        const m = r.pick(pool);
        if (level === 2 && r.next() < 0.4) {
          return {
            text: `Kakšna je hibridizacija osrednjega atoma v delcu ${m[0]}?`,
            answer: choiceAns(r, m[2], r.shuffle(["sp", "sp²", "sp³", "sp³d", "sp³d²"])),
            hint: "Preštej elektronske domene okoli osrednjega atoma (vezi in nevezane pare): 2 → sp, 3 → sp², 4 → sp³, 5 → sp³d, 6 → sp³d².",
            data: false,
            formula: false,
            solution: `Osrednji atom ima ${{ sp: 2, "sp²": 3, "sp³": 4, "sp³d": 5, "sp³d²": 6 }[m[2]]} elektronskih domen (vezi in nevezani pari), zato je hibridizacija ${m[2]}.`,
          };
        }
        return {
          text: `Kakšna je oblika (geometrija) delca ${m[0]} po teoriji VSEPR?`,
          answer: choiceAns(r, m[1], r.shuffle(SHAPES)),
          hint: "Preštej vezne in nevezne elektronske pare okoli osrednjega atoma. Oblika opisuje le položaje atomov, ne nevezanih parov.",
          data: false,
          formula: false,
          solution: `Osrednji atom ${PAIRS(m[3])}; oblika je ${m[1]}.`,
        };
      }
      if (r.next() < 0.5) {
        const m = r.pick(MOL);
        return {
          text: `Koliko nevezanih elektronskih parov ima osrednji atom v delcu ${m[0]}?`,
          answer: num(m[3]),
          hint: "Nariši Lewisovo strukturo: valenčne elektrone osrednjega atoma, ki niso v vezeh, razporedi v pare.",
          data: false,
          formula: "\\text{št. nevezanih parov} = \\dfrac{\\text{valenčni } e^- - \\text{elektroni v vezeh}}{2}",
          solution: `V Lewisovi strukturi osrednji atom ${PAIRS(m[3])} (oblika: ${m[1]}).`,
        };
      }
      const wantPolar = r.next() < 0.6;
      const good = r.pick(MOL.filter((m) => m[4] === wantPolar));
      const bad = r.shuffle(MOL.filter((m) => m[4] !== wantPolar)).slice(0, 3);
      return {
        text: `Katera od naštetih molekul oz. delcev je ${wantPolar ? "polarna" : "nepolarna"}?`,
        answer: choiceAns(r, good[0], bad.map((m) => m[0])),
        hint: "Molekula je nepolarna, če se dipolni momenti vezi zaradi simetrije izničijo.",
        data: false,
        formula: false,
        solution: `Oblika ${good[0]} je ${good[1]}; ${wantPolar ? "dipolni momenti vezi se ne izničijo, zato je polarna" : "dipolni momenti vezi se zaradi simetrije izničijo, zato je nepolarna"}. Ostale ${wantPolar ? "so simetrične in nepolarne" : "so polarne"}.`,
      };
    },
  },
  {
    id: "tek-kem-mehanizmi",
    topics: [SS("organska-kemija-reakcijski-mehanizmi")],
    gen(level, r) {
      if (level === 1) {
        const TYPES = ["radikalska substitucija", "elektrofilna adicija", "nukleofilna substitucija", "eliminacija", "elektrofilna substitucija na aromatskem obroču", "nukleofilna adicija", "kondenzacija (esterifikacija)"];
        const BANK = [
          ["CH₄ + Cl₂ → CH₃Cl + HCl (na svetlobi)", 0], ["CH₂=CH₂ + Br₂ → CH₂Br–CH₂Br", 1], ["CH₃CH₂Br + OH⁻ → CH₃CH₂OH + Br⁻", 2],
          ["CH₃CH₂OH → CH₂=CH₂ + H₂O (konc. H₂SO₄, 170 °C)", 3], ["C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O (konc. H₂SO₄)", 4], ["CH₃CHO + HCN → CH₃CH(OH)CN", 5],
          ["CH₃COOH + CH₃OH → CH₃COOCH₃ + H₂O (kislina kot katalizator)", 6], ["CH₃CH₂Br + KOH (v etanolu, segrevanje) → CH₂=CH₂ + KBr + H₂O", 3],
          ["CH₃CH=CH₂ + HBr → CH₃CHBrCH₃", 1], ["C₆H₆ + Br₂ → C₆H₅Br + HBr (FeBr₃)", 4], ["(CH₃)₃CBr + H₂O → (CH₃)₃COH + HBr", 2], ["C₂H₆ + Br₂ → C₂H₅Br + HBr (UV svetloba)", 0],
        ];
        const [eq, k] = r.pick(BANK);
        return {
          text: `Kateri tip reakcije (mehanizem) je: ${eq}?`,
          answer: choiceAns(r, TYPES[k], r.shuffle(TYPES)),
          hint: "Ali se kaj zamenja (substitucija), doda na dvojno vez (adicija) ali odcepi in nastane dvojna vez (eliminacija)? Kdo napada: radikal, elektrofil ali nukleofil?",
          data: false,
          formula: false,
          solution: `To je ${TYPES[k]}.`,
        };
      }
      if (level === 2) {
        const BANK = [
          ["Kateri je glavni produkt adicije HBr na propen?", "2-bromopropan", ["1-bromopropan", "1,2-dibromopropan", "propan"]],
          ["Kateri je glavni produkt adicije HCl na 2-metilpropen?", "2-kloro-2-metilpropan", ["1-kloro-2-metilpropan", "2-klorobutan", "1,2-dikloro-2-metilpropan"]],
          ["Kateri alken nastane kot glavni produkt eliminacije HBr iz 2-bromobutana (Zajcevo pravilo)?", "but-2-en", ["but-1-en", "butan", "but-2-in"]],
          ["Kaj nastane pri kislinsko katalizirani adiciji vode na propen (glavni produkt)?", "propan-2-ol", ["propan-1-ol", "propanal", "propanon"]],
          ["Kaj nastane pri oksidaciji propan-2-ola?", "propanon", ["propanal", "propanojska kislina", "propen"]],
          ["Kaj nastane pri oksidaciji etanola s prebitkom kalijevega dikromata v kislem?", "etanojska kislina", ["etanal", "eten", "etil etanoat"]],
          ["Kateri reagent pretvori bromoetan v etanol?", "vodna raztopina NaOH", ["KOH v etanolu, segrevanje", "koncentrirana H₂SO₄", "brom"]],
          ["Kaj nastane pri kisli hidrolizi etil etanoata?", "etanojska kislina in etanol", ["etanal in metanol", "eten in voda", "etanol in metanojska kislina"]],
          ["Za katere halogenoalkane je najbolj značilen mehanizem SN1?", "terciarne", ["primarne", "metil halogenide", "vse enako"]],
          ["Kaj nastane pri adiciji dveh molekul Br₂ na etin?", "1,1,2,2-tetrabromoetan", ["1,2-dibromoeten", "bromoetan", "1,1-dibromoetan"]],
          ["Kaj nastane pri reakciji propanala z vodikom (redukcija, katalizator)?", "propan-1-ol", ["propan-2-ol", "propanon", "propanojska kislina"]],
        ];
        const [q, ok, wr] = r.pick(BANK);
        return {
          text: q,
          answer: choiceAns(r, ok, wr),
          hint: "Markovnikovo pravilo: vodik se veže na ogljik, ki že ima več vodikov. Zajcevo pravilo: nastane bolj substituiran alken.",
          data: false,
          formula: false,
          solution: `Pravilno: ${ok}.`,
        };
      }
      const BANK = [
        ["butan-2-ol", 2, "en kiralni ogljik"], ["2-bromobutan", 2, "en kiralni ogljik"], ["2,3-dibromobutan", 3, "dva kiralna ogljika, a ena oblika je mezo spojina"],
        ["2,3-dikloropentan", 4, "dva različna kiralna ogljika"], ["but-2-en", 2, "cis in trans izomer"], ["pent-2-en", 2, "cis in trans izomer"], ["2-metilbut-2-en", 1, "ni kiralnega ogljika in ni cis-trans izomerije"],
        ["2,3-dihidroksibutandiojska (vinska) kislina", 3, "dva kiralna ogljika, ena oblika je mezo"], ["3-metilheksan", 2, "en kiralni ogljik"], ["1,2-dikloroetan", 1, "ni stereoizomerov"],
        ["but-1-en", 1, "ni cis-trans izomerije, ker sta na enem ogljiku dva vodika"], ["3-bromobut-1-en", 2, "en kiralni ogljik"], ["pent-3-en-2-ol", 4, "en kiralni ogljik in cis-trans izomerija"],
        ["2-kloro-3-metilpentan", 4, "dva kiralna ogljika"], ["glukoza (odprta veriga, aldoheksoza)", 16, "štirje kiralni ogljiki"], ["2-aminopropanojska kislina (alanin)", 2, "en kiralni ogljik"],
      ];
      const [name, n, why] = r.pick(BANK);
      return {
        text: `Koliko stereoizomerov (skupaj z optičnimi in cis-trans izomeri) obstaja za spojino ${name}?`,
        answer: num(n),
        hint: "Poišči kiralne ogljike (štirje različni substituenti) in dvojne vezi s cis-trans izomerijo. Največ $2^n$ stereoizomerov; pazi na mezo oblike.",
        data: false,
        formula: "N \\le 2^n",
        solution: `${name}: ${why}, zato je stereoizomerov ${n}.`,
      };
    },
  },
  {
    id: "tek-kem-titracije",
    topics: [SS("analizna-kemija-titracije")],
    gen(level, r) {
      if (level === 1) {
        const [af, k, an] = r.pick([["HCl", 1, "klorovodikove kisline"], ["H2SO4", 2, "žveplove(VI) kisline"], ["H2C2O4", 2, "oksalne kisline"], ["HNO3", 1, "dušikove(V) kisline"]]);
        const Va = r.pick([10, 20, 25, 50]), cb = r.pick([0.05, 0.1, 0.1, 0.2]);
        const Vb = r.dec(5, 40, 2);
        const ca = (cb * Vb) / k / Va;
        return {
          text: `Za titracijo ${Va} mL raztopine ${an} (${FT(af)}) do ekvivalentne točke porabimo ${tx(Vb)} mL raztopine NaOH s koncentracijo ${tx(cb)} mol/L. Kolikšna je koncentracija kisline v mol/L? ${RND(4)}`,
          answer: num(ca, "mol/L", 4, { unitAlternatives: ["mol/l", "M", "mol/dm3"] }),
          hint: k === 2 ? "Kislina je dvoprotonska: en mol kisline nevtralizira dva mola NaOH." : "V ekvivalentni točki je množina NaOH enaka množini kisline.",
          data: { given: [dat("V_k", Va, "mL"), dat("V_b", tx(Vb), "mL"), dat("c_b", tx(cb), "mol/L")], find: ["c_k"] },
          formula: ["n(\\mathrm{NaOH}) = c_b V_b", `c_k = \\dfrac{c_b V_b}{${k === 1 ? "" : `${k}\\,`}V_k}`],
          solution: `$n(\\mathrm{NaOH}) = ${tx(cb)} \\cdot ${tx(Vb)} = ${tx(cb * Vb, 4)}$ mmol${k === 2 ? `, $n(\\text{kislina}) = ${tx((cb * Vb) / 2, 4)}$ mmol` : ""}.\n$c_k = \\dfrac{${tx((cb * Vb) / k, 4)}}{${Va}} ${res(ca, 4, "mol/L")}$.`,
        };
      }
      if (level === 2) {
        const c = r.pick([0.01, 0.02, 0.05]), V = r.dec(10, 45, 2);
        const w0 = r.dec(30, 95, 1);
        const m = roundHalfUp(((V / 1000) * c * 5 * AR.Fe) / (w0 / 100), 3);
        const w = ((V / 1000) * c * 5 * AR.Fe * 100) / m;
        return {
          text: `Vzorec železove rude z maso ${tx(m)} g raztopimo in vse železo pretvorimo v $\\mathrm{Fe^{2+}}$. Za titracijo porabimo ${tx(V)} mL raztopine $\\mathrm{KMnO_4}$ s koncentracijo ${tx(c)} mol/L: $\\mathrm{MnO_4^- + 5Fe^{2+} + 8H^+ \\rightarrow Mn^{2+} + 5Fe^{3+} + 4H_2O}$. Kolikšen je masni delež železa v rudi? $${Ad("Fe")}$. ${RND(1)}`,
          answer: num(w, "%", 1),
          hint: "En ion permanganata oksidira pet ionov $\\mathrm{Fe^{2+}}$.",
          data: { given: [dat("m", tx(m), "g"), dat("V", tx(V), "mL"), dat("c", tx(c), "mol/L"), Ad("Fe")], find: ["w(\\mathrm{Fe})"] },
          formula: ["n(\\mathrm{Fe^{2+}}) = 5\\, c V", "w = \\dfrac{n(\\mathrm{Fe}) A_r(\\mathrm{Fe})}{m} \\cdot 100\\,\\%"],
          solution: `$n(\\mathrm{MnO_4^-}) = ${tx(c)} \\cdot ${tx(V / 1000, 5)} = ${tx((V / 1000) * c, 6)}$ mol, $n(\\mathrm{Fe}) = ${tx((V / 1000) * c * 5, 6)}$ mol.\n$m(\\mathrm{Fe}) = ${tx((V / 1000) * c * 5 * AR.Fe, 4)}$ g, $w ${res(w, 1, "\\%")}$.`,
        };
      }
      const V1 = r.pick([25, 50]), c1 = r.pick([0.5, 1]), c2 = r.pick([0.1, 0.2, 0.5]);
      const nHCl = V1 * c1; // mmol
      const V2 = r.dec(5, Math.min(40, (nHCl * 0.7) / c2), 2);
      const n = (nHCl - V2 * c2) / 2; // mmol CaCO3
      const w0 = r.dec(50, 98, 1);
      const m = roundHalfUp((n * molar("CaCO3")) / 1000 / (w0 / 100), 3);
      const w = ((n * molar("CaCO3")) / 1000 / m) * 100;
      return {
        text: `Vzorec apnenca z maso ${tx(m)} g raztopimo v ${V1} mL klorovodikove kisline s koncentracijo ${tx(c1)} mol/L (kislina je v prebitku). Prebitek kisline titriramo z raztopino NaOH s koncentracijo ${tx(c2)} mol/L in porabimo ${tx(V2)} mL. Kolikšen je masni delež $\\mathrm{CaCO_3}$ v vzorcu? ${Mx(["CaCO3"])}. ${RND(1)}`,
        answer: num(w, "%", 1),
        hint: "Povratna titracija: od vse dodane kisline odštej tisto, ki je ostala (titrirana z NaOH). Razlika je reagirala s $\\mathrm{CaCO_3}$ v razmerju 2 : 1.",
        data: { given: [dat("m", tx(m), "g"), dat("V_1", V1, "mL"), dat("c_1", tx(c1), "mol/L"), dat("V_2", tx(V2), "mL"), dat("c_2", tx(c2), "mol/L"), Md("CaCO3")], find: ["w(\\mathrm{CaCO_3})"] },
        formula: ["\\mathrm{CaCO_3 + 2HCl \\rightarrow CaCl_2 + H_2O + CO_2}", "n(\\mathrm{CaCO_3}) = \\tfrac{1}{2}(c_1 V_1 - c_2 V_2)"],
        solution: `Vsa kislina: $${tx(nHCl)}$ mmol, prebitek: $${tx(c2)} \\cdot ${tx(V2)} = ${tx(V2 * c2, 3)}$ mmol, reagiralo je $${tx(nHCl - V2 * c2, 3)}$ mmol HCl.\n$n(\\mathrm{CaCO_3}) = ${tx(n, 4)}$ mmol, $m = ${tx((n * molar("CaCO3")) / 1000, 4)}$ g, $w ${res(w, 1, "\\%")}$.`,
      };
    },
  },
];
