// Izpitne naloge iz kemije (angleško) za JEE, NEET, gaokao in CBSE: mol, stehiometrija,
// raztopine, plini, pH, termokemija, ravnotežje, kinetika, elektrokemija, zgradba atoma.
// Dvojezično (angleško / hindijsko): const L = bi(lang); H(…) = besedilo samo v hindijski nalogi.
import { en, num, numM, dq, bi, roundToL, task } from "./exam-util.js";
import { roundHalfUp } from "../check.js";

const T = (slug) => `KEM-EXB/${slug}`;
// Molske mase (g/mol), zaokrožene kot na izpitih. [formula, ime, M, hindijsko ime]
const COMPOUNDS = [
  ["H_2O", "water", 18, "जल"],
  ["CO_2", "carbon dioxide", 44, "कार्बन डाइऑक्साइड"],
  ["NaCl", "sodium chloride", 58.5, "सोडियम क्लोराइड"],
  ["NaOH", "sodium hydroxide", 40, "सोडियम हाइड्रॉक्साइड"],
  ["CaCO_3", "calcium carbonate", 100, "कैल्सियम कार्बोनेट"],
  ["H_2SO_4", "sulfuric acid", 98, "सल्फ्यूरिक अम्ल"],
  ["C_6H_{12}O_6", "glucose", 180, "ग्लूकोस"],
  ["NH_3", "ammonia", 17, "अमोनिया"],
  ["HCl", "hydrogen chloride", 36.5, "हाइड्रोजन क्लोराइड"],
  ["KMnO_4", "potassium permanganate", 158, "पोटैशियम परमैंगनेट"],
];
const NA = 6.022e23;
// Pogoste opombe v besedilu (angleška oblika je enaka kot prej).
const useNA = (L) => L(" (Use $N_A = 6.022 \\times 10^{23}\\ \\text{mol}^{-1}$.)", " ($N_A = 6.022 \\times 10^{23}\\ \\text{mol}^{-1}$ लीजिए।)");
const useR = (L) => L(" (Use $R = 0.0821\\ \\text{L·atm/(mol·K)}$.)", " ($R = 0.0821\\ \\text{L·atm/(mol·K)}$ लीजिए।)");
const vmSTP = (L) => L(" (Molar volume at STP: 22.4 L/mol.)", " (STP पर मोलर आयतन: 22.4 L/mol)");
const u23 = (L) => L(" Give the answer in units of $10^{23}$.", " उत्तर $10^{23}$ की इकाई में दीजिए।");

export const EXAM_KEM = [
  {
    id: "exk-mole",
    topics: [T("mole-concept")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang), H = (s) => L("", s);
      const [f, name, M, hn] = r.pick(COMPOUNDS);
      if (level === 1) {
        const v = r.int(0, 2);
        if (v === 0) {
          const n = r.pick([0.1, 0.2, 0.25, 0.5, 1.5, 2, 3, 4]);
          return task({
            text: L(`What is the mass of ${en(n)} mol of ${name} ($\\mathrm{${f}}$, $M = ${en(M)}$ g/mol), in grams?`, `${hn} ($\\mathrm{${f}}$, $M = ${en(M)}$ g/mol) के ${en(n)} mol का द्रव्यमान ग्राम में कितना है?`),
            answer: numM(Math.round(n * M * 1e6) / 1e6, 2, [[M / n, L("Multiply the amount by the molar mass, do not divide.", "मात्रा को मोलर द्रव्यमान से गुणा कीजिए, भाग नहीं।")], [n / M, L("Mass = amount × molar mass.", "द्रव्यमान = मात्रा × मोलर द्रव्यमान।")]]),
            data: { given: [dq("n", n, "mol"), dq("M", M, "g/mol")], find: ["m"] },
            hint: L("Molar mass tells you the mass of one mole.", "मोलर द्रव्यमान एक मोल का द्रव्यमान बताता है।"),
            formula: "m = n M",
            solution: `${H("द्रव्यमान: ")}$m = n M = ${en(n)} \\cdot ${en(M)}$\n$m = ${en(n * M)}\\ \\text{g}$`,
          });
        }
        if (v === 1) {
          const m = r.pick([1, 2, 5, 10, 20, 50, 100]) * (M > 100 ? 2 : 1);
          return task({
            text: L(`How many moles are there in ${m} g of ${name} ($\\mathrm{${f}}$, $M = ${en(M)}$ g/mol)?`, `${m} g ${hn} ($\\mathrm{${f}}$, $M = ${en(M)}$ g/mol) में कितने मोल हैं?`) + roundToL(3, lang),
            answer: numM(m / M, 3, [[m * M, L("Divide the mass by the molar mass.", "द्रव्यमान को मोलर द्रव्यमान से भाग दीजिए।")], [M / m, L("You inverted the ratio: $n = m/M$.", "आपने अनुपात उलट दिया है: $n = m/M$।")]]),
            data: { given: [dq("m", m, "g"), dq("M", M, "g/mol")], find: ["n"] },
            hint: L("Amount of substance = mass ÷ molar mass.", "पदार्थ की मात्रा = द्रव्यमान ÷ मोलर द्रव्यमान।"),
            formula: "n = \\dfrac{m}{M}",
            solution: `${H("मोलों की संख्या: ")}$n = \\dfrac{${m}}{${en(M)}}$\n$n \\approx ${en(m / M, 3)}\\ \\text{mol}$`,
          });
        }
        const n = r.pick([0.1, 0.25, 0.5, 2, 3, 5]);
        return task({
          text: L(`How many molecules are there in ${en(n)} mol of a substance?`, `किसी पदार्थ के ${en(n)} mol में कितने अणु हैं?`) + u23(L) + roundToL(2, lang) + useNA(L),
          answer: numM(n * 6.022, 2, [[6.022 / n, L("Multiply by Avogadro's number, do not divide.", "आवोगाद्रो संख्या से गुणा कीजिए, भाग नहीं।")], [n * 6.022 * 10, L("Keep the power of ten as $10^{23}$.", "10 की घात $10^{23}$ ही रखिए।")]]),
          data: { given: [dq("n", n, "mol"), "N_A = 6.022 \\times 10^{23}\\ \\mathrm{mol^{-1}}"], find: ["N"] },
          hint: L("One mole contains $N_A$ particles.", "एक मोल में $N_A$ कण होते हैं।"),
          formula: "N = n N_A",
          solution: `${H("अणुओं की संख्या: ")}$N = ${en(n)} \\cdot 6.022 \\times 10^{23}$\n$N \\approx ${en(n * 6.022, 2)} \\times 10^{23}$`,
        });
      }
      if (level === 2) {
        const v = r.int(0, 2);
        if (v === 0) {
          const m = r.pick([9, 18, 36, 4.4, 22, 11.7, 90, 17, 34, 50]);
          const N = (m / M) * NA;
          return task({
            text: L(`How many molecules (formula units) are there in ${en(m)} g of ${name} ($M = ${en(M)}$ g/mol)?`, `${en(m)} g ${hn} ($M = ${en(M)}$ g/mol) में कितने अणु (सूत्र इकाइयाँ) हैं?`) + u23(L) + roundToL(2, lang) + useNA(L),
            answer: numM(N / 1e23, 2, [[(m * M * NA) / 1e23, L("First find moles by dividing the mass by the molar mass.", "पहले द्रव्यमान को मोलर द्रव्यमान से भाग देकर मोल ज्ञात कीजिए।")], [(m * NA) / 1e23, L("Convert grams to moles before multiplying by $N_A$.", "$N_A$ से गुणा करने से पहले ग्राम को मोल में बदलिए।")]]),
            data: { given: [dq("m", m, "g"), dq("M", M, "g/mol"), "N_A = 6.022 \\times 10^{23}\\ \\mathrm{mol^{-1}}"], find: ["N"] },
            hint: L("First find moles, $n = m/M$, then multiply by Avogadro's number.", "पहले मोल ज्ञात कीजिए, $n = m/M$, फिर आवोगाद्रो संख्या से गुणा कीजिए।"),
            formula: ["n = \\dfrac{m}{M}", "N = n N_A"],
            solution: `${H("मोल: ")}$n = ${en(m)}/${en(M)} \\approx ${en(m / M, 4)}\\ \\text{mol}$\n${H("अणु: ")}$N = ${en(m / M, 4)} \\cdot 6.022 \\times 10^{23} \\approx ${en(N / 1e23, 2)} \\times 10^{23}$`,
          });
        }
        if (v === 1) {
          const [g, gn, Mg, at, atn, ghn] = r.pick([["H_2O", "water", 18, 3, "atoms", "जल"], ["CO_2", "carbon dioxide", 44, 3, "atoms", "कार्बन डाइऑक्साइड"], ["NH_3", "ammonia", 17, 4, "atoms", "अमोनिया"], ["CH_4", "methane", 16, 5, "atoms", "मेथेन"], ["C_2H_6", "ethane", 30, 8, "atoms", "एथेन"], ["O_2", "oxygen", 32, 2, "atoms", "ऑक्सीजन"]]);
          const m = r.pick([1.6, 3.2, 4.4, 8, 9, 17, 18, 30, 32, 36]);
          const N = (m / Mg) * at * 6.022;
          return task({
            text: L(`How many atoms in total are there in ${en(m)} g of ${gn} ($\\mathrm{${g}}$, $M = ${Mg}$ g/mol)?`, `${en(m)} g ${ghn} ($\\mathrm{${g}}$, $M = ${Mg}$ g/mol) में कुल कितने परमाणु हैं?`) + u23(L) + roundToL(2, lang) + useNA(L),
            answer: numM(N, 2, [[N / at, L(`That is the number of molecules; each molecule has ${at} atoms.`, `यह अणुओं की संख्या है; प्रत्येक अणु में ${at} परमाणु होते हैं।`)], [m * at * 6.022, L("Convert grams to moles first.", "पहले ग्राम को मोल में बदलिए।")]]),
            data: { given: [dq("m", m, "g"), dq("M", Mg, "g/mol"), "N_A = 6.022 \\times 10^{23}\\ \\mathrm{mol^{-1}}"], find: ["N_{atoms}"] },
            hint: L("Find the number of molecules, then multiply by the number of atoms in one molecule.", "अणुओं की संख्या ज्ञात कीजिए, फिर उसे एक अणु के परमाणुओं की संख्या से गुणा कीजिए।"),
            formula: ["n = \\dfrac{m}{M}", `N = n N_A \\cdot (\\text{${L("atoms per molecule", "प्रति अणु परमाणु")}})`],
            solution: `${H("मोल: ")}$n = ${en(m)}/${Mg} \\approx ${en(m / Mg, 4)}\\ \\text{mol}$\n${L("Molecules", "अणु")}: $${en(m / Mg, 4)} \\cdot 6.022 \\approx ${en((m / Mg) * 6.022, 3)} \\times 10^{23}$\n${L("Atoms", "परमाणु")}: $\\times ${at} \\approx ${en(N, 2)} \\times 10^{23}$`,
          });
        }
        const mm = (M / NA) * 1e23;
        return task({
          text: L(`What is the mass of one molecule (formula unit) of ${name} ($M = ${en(M)}$ g/mol), in units of $10^{-23}$ g?`, `${hn} ($M = ${en(M)}$ g/mol) के एक अणु (सूत्र इकाई) का द्रव्यमान $10^{-23}$ g की इकाई में कितना है?`) + roundToL(2, lang) + useNA(L),
          answer: numM(mm, 2, [[(NA / M) / 1e23, L("You inverted the ratio: mass of one particle = $M/N_A$.", "आपने अनुपात उलट दिया है: एक कण का द्रव्यमान = $M/N_A$।")], [M * 6.022, L("Divide the molar mass by $N_A$, do not multiply.", "मोलर द्रव्यमान को $N_A$ से भाग दीजिए, गुणा नहीं।")]]),
          data: { given: [dq("M", M, "g/mol"), "N_A = 6.022 \\times 10^{23}\\ \\mathrm{mol^{-1}}"], find: ["m_1"] },
          hint: L("One mole has mass $M$ and contains $N_A$ particles.", "एक मोल का द्रव्यमान $M$ है और उसमें $N_A$ कण होते हैं।"),
          formula: "m_1 = \\dfrac{M}{N_A}",
          solution: `${H("एक अणु का द्रव्यमान: ")}$m_1 = \\dfrac{${en(M)}}{6.022 \\times 10^{23}}\\ \\text{g}$\n$m_1 \\approx ${en(mm, 2)} \\times 10^{-23}\\ \\text{g}$`,
        });
      }
      const v = r.int(0, 2);
      const OX = [["Fe", 56, 2, 3], ["Al", 27, 2, 3], ["Cu", 63.5, 1, 1], ["Mg", 24, 1, 1], ["Ca", 40, 1, 1], ["Na", 23, 2, 1], ["Zn", 65, 1, 1], ["Cr", 52, 2, 3], ["Mn", 55, 1, 2]];
      const [el, M1, x, y] = r.pick(OX);
      const sub = (k) => (k > 1 ? `_${k}` : "");
      const Mox = x * M1 + y * 16;
      const Mnote = `($M(\\mathrm{${el}}) = ${en(M1)}$, $M(\\mathrm{O}) = 16$ g/mol${L(".)", ")")}`;
      if (v === 0) {
        const pct = ((x * M1) / Mox) * 100;
        return task({
          text: L(`What is the percentage by mass of ${el} in the oxide $\\mathrm{${el}${sub(x)}O${sub(y)}}$? `, `ऑक्साइड $\\mathrm{${el}${sub(x)}O${sub(y)}}$ में ${el} का द्रव्यमान प्रतिशत कितना है? `) + Mnote + roundToL(1, lang),
          answer: numM(pct, 1, [[(M1 / (M1 + 16)) * 100, L("Use the subscripts: count every atom in the formula.", "पादांकों का ध्यान रखिए: सूत्र के हर परमाणु को गिनिए।")], [100 - pct, L("That is the percentage of oxygen.", "यह ऑक्सीजन का प्रतिशत है।")]]),
          data: { given: [dq("M(\\mathrm{" + el + "})", M1, "g/mol"), dq("M(\\mathrm{O})", 16, "g/mol")], find: ["w(\\mathrm{" + el + "})"] },
          hint: L("Mass of the element in one formula unit divided by the molar mass of the compound.", "एक सूत्र इकाई में तत्व के द्रव्यमान को यौगिक के मोलर द्रव्यमान से भाग दीजिए।"),
          formula: `w = \\dfrac{x M(\\text{${L("element", "तत्व")}})}{M(\\text{${L("compound", "यौगिक")}})} \\cdot 100\\%`,
          solution: `${H("मोलर द्रव्यमान: ")}$M = ${x} \\cdot ${en(M1)} + ${y} \\cdot 16 = ${en(Mox)}\\ \\text{g/mol}$\n$w = \\dfrac{${en(x * M1)}}{${en(Mox)}} \\cdot 100\\%$\n$w \\approx ${en(pct, 1)}\\%$`,
        });
      }
      if (v === 1) {
        const m = r.pick([10, 20, 40, 50, 80, 100]);
        const mEl = (m * x * M1) / Mox;
        return task({
          text: L(`What mass of ${el} can be obtained from ${m} g of pure $\\mathrm{${el}${sub(x)}O${sub(y)}}$? `, `${m} g शुद्ध $\\mathrm{${el}${sub(x)}O${sub(y)}}$ से ${el} का कितना द्रव्यमान प्राप्त किया जा सकता है? `) + Mnote + roundToL(2, lang),
          answer: numM(mEl, 2, [[(m * M1) / Mox, L(`One formula unit contains ${x} metal atoms.`, `एक सूत्र इकाई में धातु के ${x} परमाणु होते हैं।`)], [m - mEl, L("That is the mass of oxygen.", "यह ऑक्सीजन का द्रव्यमान है।")]]),
          data: { given: [dq("m", m, "g"), dq("M(\\mathrm{" + el + "})", M1, "g/mol"), dq("M(\\mathrm{O})", 16, "g/mol")], find: ["m(\\mathrm{" + el + "})"] },
          hint: L("Find the mass fraction of the metal in the oxide, then multiply by the mass of oxide.", "ऑक्साइड में धातु का द्रव्यमान अंश ज्ञात कीजिए, फिर उसे ऑक्साइड के द्रव्यमान से गुणा कीजिए।"),
          formula: L("m(\\text{el}) = m \\cdot \\dfrac{x M(\\text{el})}{M(\\text{oxide})}", "m(\\text{धातु}) = m \\cdot \\dfrac{x M(\\text{धातु})}{M(\\text{ऑक्साइड})}"),
          solution: `${H("मोलर द्रव्यमान: ")}$M = ${en(Mox)}\\ \\text{g/mol}$\n${L("Mass fraction", "द्रव्यमान अंश")}: $\\dfrac{${en(x * M1)}}{${en(Mox)}} \\approx ${en((x * M1) / Mox, 4)}$\n$m = ${m} \\cdot ${en((x * M1) / Mox, 4)} \\approx ${en(mEl, 2)}\\ \\text{g}$`,
        });
      }
      // obratno: iz deleža kovine v oksidu MO določi molsko maso kovine
      const [el2, M2] = r.pick([["Mg", 24], ["Ca", 40], ["Zn", 65], ["Cu", 64], ["Ni", 59], ["Ba", 137]]);
      const pct = roundHalfUp((M2 / (M2 + 16)) * 100, 1);
      const Mx = (16 * pct) / (100 - pct);
      return task({
        text: L(`An unknown metal X forms the oxide XO, which contains ${en(pct)}% X by mass. What is the molar mass of X, in g/mol? ($M(\\mathrm{O}) = 16$ g/mol.)`, `एक अज्ञात धातु X ऑक्साइड XO बनाती है, जिसमें द्रव्यमान के अनुसार ${en(pct)}% X है। X का मोलर द्रव्यमान g/mol में कितना है? ($M(\\mathrm{O}) = 16$ g/mol)`) + roundToL(0, lang),
        answer: numM(Mx, 0, [[(16 * pct) / 100, L("The percentage refers to the whole oxide: $w = M_X/(M_X + 16)$.", "प्रतिशत पूरे ऑक्साइड के लिए है: $w = M_X/(M_X + 16)$।")], [(16 * (100 - pct)) / pct, L("You swapped the metal and oxygen percentages.", "आपने धातु और ऑक्सीजन के प्रतिशत आपस में बदल दिए हैं।")]]),
        data: { given: [`w(\\mathrm{X}) = ${en(pct)}\\%`, dq("M(\\mathrm{O})", 16, "g/mol")], find: ["M(\\mathrm{X})"] },
        hint: L("In 100 g of oxide find the mass of X and of O; their mole amounts are equal (formula XO).", "100 g ऑक्साइड में X और O के द्रव्यमान ज्ञात कीजिए; सूत्र XO है, अतः दोनों के मोल बराबर हैं।"),
        formula: "\\dfrac{m_X}{M_X} = \\dfrac{m_O}{16}",
        solution: `${L("In 100 g", "100 g में")}: $m_X = ${en(pct)}$ g, $m_O = ${en(100 - pct)}$ g\n$n(\\mathrm{O}) = ${en(100 - pct)}/16 \\approx ${en((100 - pct) / 16, 4)}$ mol $= n(\\mathrm{X})$\n$M_X = ${en(pct)}/${en((100 - pct) / 16, 4)} \\approx ${en(Mx, 0)}\\ \\text{g/mol}$ (${el2})`,
      });
    },
  },
  {
    id: "exk-stoich",
    topics: [T("stoichiometry")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang), H = (s) => L("", s);
      // Uravnotežene reakcije: [enačba, [[formula, koeficient, M, ime], …]]
      const RX = [
        ["2H_2 + O_2 \\rightarrow 2H_2O", [["H_2", 2, 2, "hydrogen"], ["O_2", 1, 32, "oxygen"], ["H_2O", 2, 18, "water"]]],
        ["CH_4 + 2O_2 \\rightarrow CO_2 + 2H_2O", [["CH_4", 1, 16, "methane"], ["O_2", 2, 32, "oxygen"], ["CO_2", 1, 44, "carbon dioxide"], ["H_2O", 2, 18, "water"]]],
        ["CaCO_3 \\rightarrow CaO + CO_2", [["CaCO_3", 1, 100, "calcium carbonate"], ["CaO", 1, 56, "calcium oxide"], ["CO_2", 1, 44, "carbon dioxide"]]],
        ["N_2 + 3H_2 \\rightarrow 2NH_3", [["N_2", 1, 28, "nitrogen"], ["H_2", 3, 2, "hydrogen"], ["NH_3", 2, 17, "ammonia"]]],
        ["2Mg + O_2 \\rightarrow 2MgO", [["Mg", 2, 24, "magnesium"], ["O_2", 1, 32, "oxygen"], ["MgO", 2, 40, "magnesium oxide"]]],
        ["Zn + 2HCl \\rightarrow ZnCl_2 + H_2", [["Zn", 1, 65, "zinc"], ["HCl", 2, 36.5, "hydrogen chloride"], ["ZnCl_2", 1, 136, "zinc chloride"], ["H_2", 1, 2, "hydrogen"]]],
        ["C_3H_8 + 5O_2 \\rightarrow 3CO_2 + 4H_2O", [["C_3H_8", 1, 44, "propane"], ["O_2", 5, 32, "oxygen"], ["CO_2", 3, 44, "carbon dioxide"], ["H_2O", 4, 18, "water"]]],
        ["2Na + Cl_2 \\rightarrow 2NaCl", [["Na", 2, 23, "sodium"], ["Cl_2", 1, 71, "chlorine"], ["NaCl", 2, 58.5, "sodium chloride"]]],
        ["Fe_2O_3 + 3CO \\rightarrow 2Fe + 3CO_2", [["Fe_2O_3", 1, 160, "iron(III) oxide"], ["CO", 3, 28, "carbon monoxide"], ["Fe", 2, 56, "iron"], ["CO_2", 3, 44, "carbon dioxide"]]],
        ["2KClO_3 \\rightarrow 2KCl + 3O_2", [["KClO_3", 2, 122.5, "potassium chlorate"], ["KCl", 2, 74.5, "potassium chloride"], ["O_2", 3, 32, "oxygen"]]],
      ];
      const [eq, sp] = r.pick(RX);
      let [A, B] = r.shuffle(sp).slice(0, 2);
      // Na ravni 1 raje par z različnima koeficientoma (sicer je razmerje 1 : 1 trivialno).
      for (let i = 0; level === 1 && i < 6 && A[1] === B[1]; i++) [A, B] = r.shuffle(sp).slice(0, 2);
      const ratio = B[1] / A[1];
      const Ms = `($M$: ${[A, B].map((s) => `$\\mathrm{${s[0]}}$ ${en(s[2])}`).join(", ")} g/mol${L(".)", ")")}`;
      const inv = L("You inverted the mole ratio.", "आपने मोल अनुपात उलट दिया है।");
      if (level === 1) {
        const nA = r.pick([0.5, 1, 1.5, 2, 3, 4, 6]);
        return task({
          text: L(`In the reaction $\\mathrm{${eq}}$, how many moles of $\\mathrm{${B[0]}}$ correspond to ${en(nA)} mol of $\\mathrm{${A[0]}}$?`, `अभिक्रिया $\\mathrm{${eq}}$ में ${en(nA)} mol $\\mathrm{${A[0]}}$ के संगत $\\mathrm{${B[0]}}$ के कितने मोल हैं?`) + roundToL(2, lang),
          answer: numM(nA * ratio, 2, [[nA, L("Use the coefficients of the balanced equation; the mole ratio is not 1 : 1.", "संतुलित समीकरण के गुणांकों का प्रयोग कीजिए; मोल अनुपात 1 : 1 नहीं है।")], [nA / ratio, inv], [(nA * B[2]) / A[2], L("Mole ratios come from the coefficients, not from the molar masses.", "मोल अनुपात गुणांकों से मिलते हैं, मोलर द्रव्यमानों से नहीं।")]]),
          data: { given: [dq(`n(\\mathrm{${A[0]}})`, nA, "mol")], find: [`n(\\mathrm{${B[0]}})`] },
          hint: L("The coefficients give the mole ratio of the substances.", "गुणांक पदार्थों का मोल अनुपात बताते हैं।"),
          formula: `\\dfrac{n(\\mathrm{${B[0]}})}{n(\\mathrm{${A[0]}})} = \\dfrac{${B[1]}}{${A[1]}}`,
          solution: `${L("Mole ratio", "मोल अनुपात")} $\\mathrm{${A[0]}} : \\mathrm{${B[0]}} = ${A[1]} : ${B[1]}$\n$n(\\mathrm{${B[0]}}) = ${en(nA)} \\cdot \\dfrac{${B[1]}}{${A[1]}} = ${en(nA * ratio, 2)}\\ \\text{mol}$`,
        });
      }
      if (level === 2) {
        const mA = r.pick([2, 4, 8, 10, 16, 20, 25, 32, 50, 100]);
        const mB = (mA / A[2]) * ratio * B[2];
        return task({
          text: L(`In the reaction $\\mathrm{${eq}}$, what mass of $\\mathrm{${B[0]}}$ corresponds to ${mA} g of $\\mathrm{${A[0]}}$, in grams? `, `अभिक्रिया $\\mathrm{${eq}}$ में ${mA} g $\\mathrm{${A[0]}}$ के संगत $\\mathrm{${B[0]}}$ का द्रव्यमान ग्राम में कितना है? `) + Ms + roundToL(2, lang),
          answer: numM(mB, 2, [[(mA / A[2]) * B[2], L("Use the mole ratio from the coefficients.", "गुणांकों से प्राप्त मोल अनुपात का प्रयोग कीजिए।")], [mA * ratio, L("Convert grams to moles first; masses do not follow the coefficients.", "पहले ग्राम को मोल में बदलिए; द्रव्यमान गुणांकों के अनुपात में नहीं होते।")], [(mA / A[2]) * (A[1] / B[1]) * B[2], inv]]),
          data: { given: [dq(`m(\\mathrm{${A[0]}})`, mA, "g"), dq(`M(\\mathrm{${A[0]}})`, A[2], "g/mol"), dq(`M(\\mathrm{${B[0]}})`, B[2], "g/mol")], find: [`m(\\mathrm{${B[0]}})`] },
          hint: L("grams of A → moles of A → (mole ratio) → moles of B → grams of B.", "A के ग्राम → A के मोल → (मोल अनुपात) → B के मोल → B के ग्राम।"),
          formula: ["n = \\dfrac{m}{M}", `n(\\mathrm{${B[0]}}) = \\dfrac{${B[1]}}{${A[1]}}\\, n(\\mathrm{${A[0]}})`],
          solution: `${H("मोल: ")}$n(\\mathrm{${A[0]}}) = ${mA}/${en(A[2])} \\approx ${en(mA / A[2], 4)}\\ \\text{mol}$\n${H("मोल अनुपात से: ")}$n(\\mathrm{${B[0]}}) = ${en(mA / A[2], 4)} \\cdot \\tfrac{${B[1]}}{${A[1]}} \\approx ${en((mA / A[2]) * ratio, 4)}\\ \\text{mol}$\n${H("द्रव्यमान: ")}$m = ${en((mA / A[2]) * ratio, 4)} \\cdot ${en(B[2])} \\approx ${en(mB, 2)}\\ \\text{g}$`,
        });
      }
      const v = r.int(0, 2);
      if (v === 0) {
        const nN = r.pick([1, 1.5, 2, 3]), nH = r.pick([2, 3, 4.5, 6, 9]);
        const limitingN = nN <= nH / 3;
        const nNH3 = limitingN ? 2 * nN : (2 * nH) / 3;
        return task({
          text: L(`In the reaction $\\mathrm{N_2 + 3H_2 \\rightarrow 2NH_3}$, ${en(nN)} mol of $\\mathrm{N_2}$ reacts with ${en(nH)} mol of $\\mathrm{H_2}$. What is the maximum amount of $\\mathrm{NH_3}$ formed, in mol?`, `${en(nN)} mol $\\mathrm{N_2}$ और ${en(nH)} mol $\\mathrm{H_2}$ के बीच अभिक्रिया $\\mathrm{N_2 + 3H_2 \\rightarrow 2NH_3}$ होती है। $\\mathrm{NH_3}$ की अधिकतम कितनी मात्रा (mol में) बनती है?`) + roundToL(2, lang),
          answer: numM(nNH3, 2, [[limitingN ? (2 * nH) / 3 : 2 * nN, L("That uses the excess reactant; the limiting reactant decides the yield.", "यह आधिक्य अभिकर्मक से निकला है; उत्पाद की मात्रा सीमांत अभिकर्मक तय करता है।")], [nN + nH, L("Use the mole ratios; amounts do not simply add.", "मोल अनुपात का प्रयोग कीजिए; मात्राएँ सीधे नहीं जुड़तीं।")]]),
          data: { given: [dq("n(\\mathrm{N_2})", nN, "mol"), dq("n(\\mathrm{H_2})", nH, "mol")], find: ["n(\\mathrm{NH_3})"] },
          hint: L("Find the limiting reactant: compare $n(\\mathrm{N_2})$ with $n(\\mathrm{H_2})/3$.", "सीमांत अभिकर्मक ज्ञात कीजिए: $n(\\mathrm{N_2})$ की तुलना $n(\\mathrm{H_2})/3$ से कीजिए।"),
          formula: "n(\\mathrm{NH_3}) = 2\\, n(\\mathrm{N_2}) = \\tfrac23\\, n(\\mathrm{H_2})",
          solution: `$n(\\mathrm{H_2})/3 = ${en(nH / 3, 3)}$ mol, $n(\\mathrm{N_2}) = ${en(nN)}$ mol\n${L(`So ${limitingN ? "N₂" : "H₂"} is limiting.`, `अतः ${limitingN ? "N₂" : "H₂"} सीमांत अभिकर्मक है।`)}\n$n(\\mathrm{NH_3}) = ${limitingN ? `2 \\cdot ${en(nN)}` : `\\tfrac23 \\cdot ${en(nH)}`} = ${en(nNH3, 2)}\\ \\text{mol}$`,
        });
      }
      if (v === 1) {
        // Izkoristek: A mora biti reaktant in B produkt (ne obratno).
        const left = eq.split("\\rightarrow")[0].split("+").map((x) => x.trim().replace(/^\d+/, ""));
        const isR = (x) => left.includes(x[0]);
        if (!isR(A)) A = sp.find(isR);
        if (isR(B)) B = sp.find((x) => !isR(x));
        const ratio = B[1] / A[1];
        const Ms = `($M$: ${[A, B].map((x) => `$\\mathrm{${x[0]}}$ ${en(x[2])}`).join(", ")} g/mol${L(".)", ")")}`;
        const mA = r.pick([10, 20, 25, 40, 50, 100]), y = r.pick([60, 70, 75, 80, 85, 90]);
        const theo = (mA / A[2]) * ratio * B[2], act = roundHalfUp((theo * y) / 100, 1);
        const pc = (act / theo) * 100;
        return task({
          text: L(`In the reaction $\\mathrm{${eq}}$, ${mA} g of $\\mathrm{${A[0]}}$ reacts completely and ${en(act)} g of $\\mathrm{${B[0]}}$ is obtained. What is the percentage yield? `, `अभिक्रिया $\\mathrm{${eq}}$ में ${mA} g $\\mathrm{${A[0]}}$ पूर्णतः अभिक्रिया करता है और ${en(act)} g $\\mathrm{${B[0]}}$ प्राप्त होता है। प्रतिशत लब्धि कितनी है? `) + Ms + roundToL(1, lang),
          answer: numM(pc, 1, [[(act / mA) * 100, L("Compare with the theoretical mass of the product, not with the mass of the reactant.", "उत्पाद के सैद्धांतिक द्रव्यमान से तुलना कीजिए, अभिकर्मक के द्रव्यमान से नहीं।")], [(act / ((mA / A[2]) * B[2])) * 100, L("Use the mole ratio from the equation for the theoretical yield.", "सैद्धांतिक लब्धि के लिए समीकरण से मोल अनुपात लीजिए।")]]),
          data: { given: [dq(`m(\\mathrm{${A[0]}})`, mA, "g"), dq(`m(\\mathrm{${B[0]}})`, act, "g"), dq(`M(\\mathrm{${A[0]}})`, A[2], "g/mol"), dq(`M(\\mathrm{${B[0]}})`, B[2], "g/mol")], find: ["\\eta"] },
          hint: L("Find the theoretical mass of the product, then compare the actual mass with it.", "उत्पाद का सैद्धांतिक द्रव्यमान ज्ञात कीजिए, फिर वास्तविक द्रव्यमान की उससे तुलना कीजिए।"),
          formula: "\\eta = \\dfrac{m_{actual}}{m_{theoretical}} \\cdot 100\\%",
          solution: `${H("मोल: ")}$n(\\mathrm{${A[0]}}) = ${mA}/${en(A[2])} \\approx ${en(mA / A[2], 4)}\\ \\text{mol}$\n${L("Theoretical", "सैद्धांतिक")}: $m(\\mathrm{${B[0]}}) = ${en(mA / A[2], 4)} \\cdot \\tfrac{${B[1]}}{${A[1]}} \\cdot ${en(B[2])} \\approx ${en(theo, 2)}\\ \\text{g}$\n${H("प्रतिशत लब्धि: ")}$\\eta = ${en(act)}/${en(theo, 2)} \\cdot 100\\% \\approx ${en(pc, 1)}\\%$`,
        });
      }
      const m = r.pick([10, 20, 25, 50]), p = r.pick([60, 75, 80, 90, 95]);
      const nC = (m * p) / 100 / 100, V = nC * 22.4;
      return task({
        text: L(`A ${m} g sample of limestone contains ${p}% $\\mathrm{CaCO_3}$ by mass. When heated, $\\mathrm{CaCO_3 \\rightarrow CaO + CO_2}$. What volume of $\\mathrm{CO_2}$ is released at STP, in liters? ($M(\\mathrm{CaCO_3}) = 100$ g/mol, $V_m = 22.4$ L/mol.)`, `चूना पत्थर के ${m} g नमूने में द्रव्यमान के अनुसार ${p}% $\\mathrm{CaCO_3}$ है। गर्म करने पर $\\mathrm{CaCO_3 \\rightarrow CaO + CO_2}$ होता है। STP पर $\\mathrm{CO_2}$ का कितना आयतन (लीटर में) मुक्त होता है? ($M(\\mathrm{CaCO_3}) = 100$ g/mol, $V_m = 22.4$ L/mol)`) + roundToL(2, lang),
        answer: numM(V, 2, [[(m / 100) * 22.4, L("Only part of the sample is $\\mathrm{CaCO_3}$: use the purity.", "नमूने का केवल एक भाग $\\mathrm{CaCO_3}$ है: शुद्धता का प्रयोग कीजिए।")], [nC * 44, L("That is the mass of $\\mathrm{CO_2}$ in grams; use the molar volume.", "यह $\\mathrm{CO_2}$ का द्रव्यमान (ग्राम में) है; मोलर आयतन का प्रयोग कीजिए।")]]),
        data: { given: [dq("m", m, "g"), `w = ${p}\\%`, dq("M", 100, "g/mol"), dq("V_m", 22.4, "L/mol")], find: ["V(\\mathrm{CO_2})"] },
        hint: L("Mass of pure CaCO₃ → moles → moles of CO₂ (1 : 1) → volume at STP.", "शुद्ध CaCO₃ का द्रव्यमान → मोल → CO₂ के मोल (1 : 1) → STP पर आयतन।"),
        formula: ["n = \\dfrac{w\\, m}{M}", "V = n V_m"],
        solution: `${H("शुद्ध भाग: ")}$m(\\mathrm{CaCO_3}) = ${m} \\cdot ${en(p / 100)} = ${en((m * p) / 100)}\\ \\text{g}$\n$n = ${en((m * p) / 100)}/100 = ${en(nC)}\\ \\text{mol} = n(\\mathrm{CO_2})$\n${H("STP पर आयतन: ")}$V = ${en(nC)} \\cdot 22.4 \\approx ${en(V, 2)}\\ \\text{L}$`,
      });
    },
  },
  {
    id: "exk-solutions",
    topics: [T("solutions-and-concentration")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang), H = (s) => L("", s);
      const [f, name, M, hn] = r.pick(COMPOUNDS.filter((c) => ["NaCl", "NaOH", "C_6H_{12}O_6", "KMnO_4"].includes(c[0])));
      if (level === 1) {
        const m = r.pick([4, 10, 20, 29.25, 36, 90]), V = r.pick([0.25, 0.5, 1, 2]);
        const c = m / M / V;
        return task({
          text: L(`${m} g of ${name} ($M = ${M}$ g/mol) is dissolved to make ${V * 1000} mL of solution. What is the molarity, in mol/L?`, `${m} g ${hn} ($M = ${M}$ g/mol) को घोलकर ${V * 1000} mL विलयन बनाया जाता है। विलयन की मोलरता mol/L में कितनी है?`) + roundToL(3, lang),
          answer: num(c, 3),
          hint: L("$c = \\dfrac{n}{V} = \\dfrac{m}{MV}$.", "मोलरता $c = \\dfrac{n}{V} = \\dfrac{m}{MV}$।"),
          formula: "c = \\dfrac{m}{M V}",
          solution: `${H("विलेय के मोल: ")}$n = ${m}/${M} \\approx ${en(m / M, 4)}\\ \\text{mol}$\n${H("मोलरता: ")}$c = ${en(m / M, 4)}/${V} \\approx ${en(c, 3)}\\ \\text{mol/L}$`,
        });
      }
      if (level === 2) {
        const c1 = r.pick([1, 2, 5, 6]), V1 = r.pick([10, 20, 25, 50]), V2 = r.pick([100, 250, 500]);
        return task({
          text: L(`${V1} mL of a ${c1} mol/L solution is diluted with water to ${V2} mL. What is the new concentration, in mol/L?`, `${c1} mol/L विलयन के ${V1} mL को जल मिलाकर ${V2} mL तक तनु किया जाता है। नई सांद्रता mol/L में कितनी है?`) + roundToL(3, lang),
          answer: num((c1 * V1) / V2, 3),
          hint: L("Moles do not change on dilution: $c_1V_1 = c_2V_2$.", "तनुकरण में विलेय के मोल नहीं बदलते: $c_1V_1 = c_2V_2$।"),
          formula: "c_1 V_1 = c_2 V_2",
          solution: `${H("नई सांद्रता: ")}$c_2 = \\dfrac{${c1} \\cdot ${V1}}{${V2}} = ${en((c1 * V1) / V2, 3)}\\ \\text{mol/L}$`,
        });
      }
      const cA = r.pick([0.1, 0.2, 0.5]), VA = r.pick([10, 20, 25]), cB = r.pick([0.1, 0.2, 0.25]);
      const VB = (cA * VA) / cB;
      return task({
        text: L(`What volume of ${cB} mol/L NaOH is needed to neutralise ${VA} mL of ${cA} mol/L HCl, in mL?`, `${cA} mol/L HCl के ${VA} mL को उदासीन करने के लिए ${cB} mol/L NaOH का कितना आयतन (mL में) चाहिए?`) + roundToL(1, lang),
        answer: num(VB, 1),
        hint: L("HCl and NaOH react 1 : 1, so $c_A V_A = c_B V_B$.", "HCl और NaOH 1 : 1 में अभिक्रिया करते हैं, अतः $c_A V_A = c_B V_B$।"),
        formula: "c_A V_A = c_B V_B",
        solution: `${H("NaOH का आयतन: ")}$V_B = \\dfrac{${cA} \\cdot ${VA}}{${cB}} = ${en(VB, 1)}\\ \\text{mL}$`,
      });
    },
  },
  {
    id: "exk-gases",
    topics: [T("gaseous-state")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang), H = (s) => L("", s);
      const R = 0.0821;
      if (level === 1) {
        const v = r.int(0, 2);
        if (v === 0) {
          const n = r.pick([0.1, 0.25, 0.5, 1, 1.5, 2, 3]);
          return task({
            text: L(`What volume does ${en(n)} mol of an ideal gas occupy at STP (0 °C, 1 atm), in liters?`, `STP (0 °C, 1 atm) पर किसी आदर्श गैस के ${en(n)} mol का आयतन लीटर में कितना है?`) + vmSTP(L) + roundToL(2, lang),
            answer: numM(n * 22.4, 2, [[22.4 / n, L("Multiply the amount by the molar volume.", "मात्रा को मोलर आयतन से गुणा कीजिए।")]]),
            data: { given: [dq("n", n, "mol"), dq("V_m", 22.4, "L/mol")], find: ["V"] },
            hint: L("One mole of any ideal gas at STP occupies 22.4 L.", "STP पर किसी भी आदर्श गैस के एक मोल का आयतन 22.4 L होता है।"),
            formula: "V = n V_m",
            solution: `${H("आयतन: ")}$V = n V_m = ${en(n)} \\cdot 22.4$\n$V = ${en(n * 22.4)}\\ \\text{L}$`,
          });
        }
        if (v === 1) {
          const p1 = r.pick([1, 2, 3, 4]), V1 = r.pick([2, 4, 6, 10, 12]), p2 = r.pick([0.5, 1.5, 2.5, 5, 6]);
          if (p1 === p2) return null;
          return task({
            text: L(`A gas occupies ${V1} L at ${en(p1)} atm. At constant temperature the pressure changes to ${en(p2)} atm. What is the new volume, in liters?`, `${en(p1)} atm पर एक गैस का आयतन ${V1} L है। स्थिर ताप पर दाब बदलकर ${en(p2)} atm हो जाता है। नया आयतन लीटर में कितना है?`) + roundToL(2, lang),
            answer: numM((p1 * V1) / p2, 2, [[(p2 * V1) / p1, L("At constant temperature volume is inversely proportional to pressure.", "स्थिर ताप पर आयतन दाब के व्युत्क्रमानुपाती होता है।")], [p1 * V1 * p2, L("Divide $p_1V_1$ by $p_2$.", "$p_1V_1$ को $p_2$ से भाग दीजिए।")]]),
            data: { given: [dq("p_1", p1, "atm"), dq("V_1", V1, "L"), dq("p_2", p2, "atm")], find: ["V_2"] },
            hint: L("Boyle's law: the product $pV$ stays constant.", "बॉयल का नियम: गुणनफल $pV$ स्थिर रहता है।"),
            formula: "p_1 V_1 = p_2 V_2",
            solution: `${H("बॉयल के नियम से: ")}$V_2 = \\dfrac{p_1 V_1}{p_2} = \\dfrac{${en(p1)} \\cdot ${V1}}{${en(p2)}}$\n$V_2 \\approx ${en((p1 * V1) / p2, 2)}\\ \\text{L}$`,
          });
        }
        const V = r.pick([5.6, 11.2, 2.24, 44.8, 67.2, 8.96, 4.48]);
        return task({
          text: L(`How many moles of gas are in ${en(V)} L at STP?`, `STP पर ${en(V)} L गैस में कितने मोल हैं?`) + vmSTP(L) + roundToL(2, lang),
          answer: numM(V / 22.4, 2, [[V * 22.4, L("Divide the volume by the molar volume.", "आयतन को मोलर आयतन से भाग दीजिए।")]]),
          data: { given: [dq("V", V, "L"), dq("V_m", 22.4, "L/mol")], find: ["n"] },
          hint: L("One mole occupies 22.4 L at STP.", "STP पर एक मोल गैस का आयतन 22.4 L होता है।"),
          formula: "n = \\dfrac{V}{V_m}",
          solution: `${H("मोल: ")}$n = \\dfrac{${en(V)}}{22.4}$\n$n = ${en(V / 22.4, 2)}\\ \\text{mol}$`,
        });
      }
      if (level === 2) {
        const v = r.int(0, 2);
        if (v === 0) {
          const n = r.pick([0.5, 1, 2]), tC = r.pick([0, 27, 77, 127, 227]), V = r.pick([10, 20, 24.6, 50]);
          const Tk = tC + 273, p = (n * R * Tk) / V;
          return task({
            text: L(`${en(n)} mol of an ideal gas is kept in a ${en(V)} L vessel at ${tC} °C. What is its pressure, in atm?`, `${en(n)} mol आदर्श गैस को ${tC} °C पर ${en(V)} L के पात्र में रखा गया है। इसका दाब atm में कितना है?`) + useR(L) + roundToL(2, lang),
            answer: numM(p, 2, [[tC ? (n * R * tC) / V : NaN, L("Convert the temperature to kelvin ($T = t + 273$).", "ताप को केल्विन में बदलिए ($T = t + 273$)।")], [(n * R * V) / Tk, L("Rearrange $pV = nRT$ correctly: $p = nRT/V$.", "$pV = nRT$ को सही ढंग से पुनर्व्यवस्थित कीजिए: $p = nRT/V$।")]]),
            data: { given: [dq("n", n, "mol"), dq("V", V, "L"), `t = ${tC}\\ ^\\circ\\mathrm{C}`, dq("R", 0.0821, "L\\,atm/(mol\\,K)")], find: ["p"] },
            hint: L("Convert the temperature to kelvin, then use $pV = nRT$.", "ताप को केल्विन में बदलिए, फिर $pV = nRT$ का प्रयोग कीजिए।"),
            formula: "pV = nRT",
            solution: `${H("परम ताप: ")}$T = ${tC} + 273 = ${Tk}\\ \\text{K}$\n${H("दाब: ")}$p = \\dfrac{${en(n)} \\cdot 0.0821 \\cdot ${Tk}}{${en(V)}} \\approx ${en(p, 2)}\\ \\text{atm}$`,
          });
        }
        if (v === 1) {
          const V1 = r.pick([2, 3, 5, 10]), t1 = r.pick([0, 27, 127]), t2 = r.pick([77, 177, 227, 327]);
          const V2 = (V1 * (t2 + 273)) / (t1 + 273);
          return task({
            text: L(`A gas occupies ${V1} L at ${t1} °C. It is heated at constant pressure to ${t2} °C. What is its new volume, in liters?`, `${t1} °C पर एक गैस का आयतन ${V1} L है। इसे स्थिर दाब पर ${t2} °C तक गर्म किया जाता है। इसका नया आयतन लीटर में कितना है?`) + roundToL(2, lang),
            answer: numM(V2, 2, [[t1 ? (V1 * t2) / t1 : NaN, L("Charles's law uses absolute temperature (kelvin).", "चार्ल्स के नियम में परम ताप (केल्विन) लिया जाता है।")], [(V1 * (t1 + 273)) / (t2 + 273), L("Heating at constant pressure increases the volume.", "स्थिर दाब पर गर्म करने से आयतन बढ़ता है।")]]),
            data: { given: [dq("V_1", V1, "L"), `t_1 = ${t1}\\ ^\\circ\\mathrm{C}`, `t_2 = ${t2}\\ ^\\circ\\mathrm{C}`], find: ["V_2"] },
            hint: L("Convert both temperatures to kelvin; at constant pressure $V/T$ is constant.", "दोनों ताप केल्विन में बदलिए; स्थिर दाब पर $V/T$ स्थिर रहता है।"),
            formula: "\\dfrac{V_1}{T_1} = \\dfrac{V_2}{T_2}",
            solution: `${H("परम ताप: ")}$T_1 = ${t1 + 273}\\ \\text{K}$, $T_2 = ${t2 + 273}\\ \\text{K}$\n${H("चार्ल्स के नियम से: ")}$V_2 = ${V1} \\cdot \\dfrac{${t2 + 273}}{${t1 + 273}} \\approx ${en(V2, 2)}\\ \\text{L}$`,
          });
        }
        const [g, M] = r.pick([["O_2", 32], ["N_2", 28], ["CO_2", 44], ["CH_4", 16], ["SO_2", 64], ["Cl_2", 71], ["NH_3", 17]]);
        const m = r.pick([1, 2, 4, 8, 10]) * (M > 40 ? 2 : 1), V = (m / M) * 22.4;
        return task({
          text: L(`${m} g of a gas occupies ${en(V, 2)} L at STP. What is its molar mass, in g/mol?`, `STP पर किसी गैस के ${m} g का आयतन ${en(V, 2)} L है। इसका मोलर द्रव्यमान g/mol में कितना है?`) + vmSTP(L) + roundToL(0, lang),
          answer: numM((m * 22.4) / roundHalfUp(V, 2), 0, [[(m * roundHalfUp(V, 2)) / 22.4, L("First find moles $n = V/V_m$, then $M = m/n$.", "पहले मोल ज्ञात कीजिए, $n = V/V_m$, फिर $M = m/n$।")], [roundHalfUp(V, 2) / m, L("$M = m/n$, mass divided by moles.", "$M = m/n$, अर्थात द्रव्यमान ÷ मोल।")]]),
          data: { given: [dq("m", m, "g"), dq("V", en(V, 2), "L"), dq("V_m", 22.4, "L/mol")], find: ["M"] },
          hint: L("Find the amount from the volume, then divide the mass by it.", "आयतन से मोलों की संख्या ज्ञात कीजिए, फिर द्रव्यमान को उससे भाग दीजिए।"),
          formula: ["n = \\dfrac{V}{V_m}", "M = \\dfrac{m}{n}"],
          solution: `${H("मोल: ")}$n = ${en(V, 2)}/22.4 \\approx ${en(roundHalfUp(V, 2) / 22.4, 4)}\\ \\text{mol}$\n${H("मोलर द्रव्यमान: ")}$M = ${m}/${en(roundHalfUp(V, 2) / 22.4, 4)} \\approx ${en((m * 22.4) / roundHalfUp(V, 2), 0)}\\ \\text{g/mol}$ ($\\mathrm{${g}}$)`,
        });
      }
      const v = r.int(0, 2);
      if (v === 0) {
        const PAIRS = [["H_2", 2, "O_2", 32], ["He", 4, "CH_4", 16], ["CH_4", 16, "SO_2", 64], ["H_2", 2, "CO_2", 44], ["He", 4, "O_2", 32], ["NH_3", 17, "HCl", 36.5], ["N_2", 28, "Cl_2", 71]];
        const [g1, M1, g2, M2] = r.pick(PAIRS);
        const rev = r.next() < 0.5;
        if (!rev) {
          const ratio = Math.sqrt(M2 / M1);
          return task({
            text: L(`By Graham's law, how many times faster does $\\mathrm{${g1}}$ ($M = ${M1}$ g/mol) effuse than $\\mathrm{${g2}}$ ($M = ${en(M2)}$ g/mol) under the same conditions?`, `ग्राहम के नियम से, समान परिस्थितियों में $\\mathrm{${g1}}$ ($M = ${M1}$ g/mol) का निःसरण $\\mathrm{${g2}}$ ($M = ${en(M2)}$ g/mol) की तुलना में कितने गुना तेज होता है?`) + roundToL(2, lang),
            answer: numM(ratio, 2, [[M2 / M1, L("Rate depends on the square root of molar mass.", "निःसरण वेग मोलर द्रव्यमान के वर्गमूल पर निर्भर करता है।")], [Math.sqrt(M1 / M2), L("Lighter gases effuse faster: the ratio should be greater than 1.", "हल्की गैस का निःसरण तेज होता है: अनुपात 1 से अधिक होना चाहिए।")]]),
            data: { given: [dq("M_1", M1, "g/mol"), dq("M_2", M2, "g/mol")], find: ["r_1/r_2"] },
            hint: L("Rate is inversely proportional to the square root of molar mass.", "निःसरण वेग मोलर द्रव्यमान के वर्गमूल के व्युत्क्रमानुपाती होता है।"),
            formula: "\\dfrac{r_1}{r_2} = \\sqrt{\\dfrac{M_2}{M_1}}",
            solution: `${H("मोलर द्रव्यमानों का अनुपात: ")}$\\dfrac{M_2}{M_1} = ${en(M2 / M1, 4)}$\n${H("वेगों का अनुपात: ")}$\\dfrac{r_1}{r_2} = \\sqrt{${en(M2 / M1, 4)}} \\approx ${en(ratio, 2)}$`,
          });
        }
        const k = r.pick([1.5, 2, 2.5, 3, 4]), Mk = r.pick([4, 16, 28, 32]);
        return task({
          text: L(`An unknown gas effuses ${en(k)} times more slowly than a gas of molar mass ${Mk} g/mol under the same conditions. What is the molar mass of the unknown gas, in g/mol?`, `समान परिस्थितियों में एक अज्ञात गैस का निःसरण ${Mk} g/mol मोलर द्रव्यमान वाली गैस की तुलना में ${en(k)} गुना धीमा होता है। अज्ञात गैस का मोलर द्रव्यमान g/mol में कितना है?`) + roundToL(1, lang),
          answer: numM(Mk * k * k, 1, [[Mk * k, L("Square the rate ratio: $M \\propto 1/r^2$.", "वेगों के अनुपात का वर्ग कीजिए: $M \\propto 1/r^2$।")], [Mk / (k * k), L("A slower gas is heavier: multiply.", "धीमी गैस भारी होती है: गुणा कीजिए।")]]),
          data: { given: [dq("M_1", Mk, "g/mol"), `r_1/r_2 = ${en(k)}`], find: ["M_2"] },
          hint: L("Use Graham's law in reverse: square the rate ratio.", "ग्राहम के नियम को उलटकर लगाइए: वेगों के अनुपात का वर्ग कीजिए।"),
          formula: "\\dfrac{r_1}{r_2} = \\sqrt{\\dfrac{M_2}{M_1}}",
          solution: `${H("ग्राहम के नियम से: ")}$\\dfrac{M_2}{M_1} = \\left(\\dfrac{r_1}{r_2}\\right)^2 = ${en(k)}^2 = ${en(k * k)}$\n${H("अज्ञात गैस: ")}$M_2 = ${Mk} \\cdot ${en(k * k)} = ${en(Mk * k * k, 1)}\\ \\text{g/mol}$`,
        });
      }
      if (v === 1) {
        const [g1, M1, g2, M2] = r.pick([["He", 4, "Ne", 20], ["N_2", 28, "O_2", 32], ["H_2", 2, "N_2", 28], ["CH_4", 16, "O_2", 32]]);
        const m1 = r.pick([2, 4, 8, 16]), m2 = r.pick([8, 16, 32, 40]), P = r.pick([1, 2, 3, 5]);
        const n1 = m1 / M1, n2 = m2 / M2, p1 = (P * n1) / (n1 + n2);
        return task({
          text: L(`A mixture contains ${m1} g of $\\mathrm{${g1}}$ ($M = ${M1}$ g/mol) and ${m2} g of $\\mathrm{${g2}}$ ($M = ${M2}$ g/mol) at a total pressure of ${P} atm. What is the partial pressure of $\\mathrm{${g1}}$, in atm?`, `एक गैस मिश्रण में ${m1} g $\\mathrm{${g1}}$ ($M = ${M1}$ g/mol) और ${m2} g $\\mathrm{${g2}}$ ($M = ${M2}$ g/mol) हैं; कुल दाब ${P} atm है। $\\mathrm{${g1}}$ का आंशिक दाब atm में कितना है?`) + roundToL(2, lang),
          answer: numM(p1, 2, [[(P * m1) / (m1 + m2), L("Partial pressure depends on the mole fraction, not the mass fraction.", "आंशिक दाब मोल अंश पर निर्भर करता है, द्रव्यमान अंश पर नहीं।")], [P - p1, L(`That is the partial pressure of $\\mathrm{${g2}}$.`, `यह $\\mathrm{${g2}}$ का आंशिक दाब है।`)]]),
          data: { given: [dq(`m(\\mathrm{${g1}})`, m1, "g"), dq(`m(\\mathrm{${g2}})`, m2, "g"), dq("p", P, "atm")], find: [`p(\\mathrm{${g1}})`] },
          hint: L("Convert both masses to moles, find the mole fraction, then use Dalton's law.", "दोनों द्रव्यमानों को मोल में बदलिए, मोल अंश ज्ञात कीजिए, फिर डाल्टन के आंशिक दाब नियम का प्रयोग कीजिए।"),
          formula: ["x_1 = \\dfrac{n_1}{n_1 + n_2}", "p_1 = x_1 p"],
          solution: `${H("मोल: ")}$n_1 = ${m1}/${M1} = ${en(n1, 4)}$ mol, $n_2 = ${m2}/${M2} = ${en(n2, 4)}$ mol\n${H("मोल अंश: ")}$x_1 = \\dfrac{${en(n1, 4)}}{${en(n1 + n2, 4)}} \\approx ${en(n1 / (n1 + n2), 4)}$\n${H("आंशिक दाब: ")}$p_1 = ${en(n1 / (n1 + n2), 4)} \\cdot ${P} \\approx ${en(p1, 2)}\\ \\text{atm}$`,
        });
      }
      const [g, M] = r.pick([["O_2", 32], ["N_2", 28], ["CO_2", 44], ["CH_4", 16], ["NH_3", 17]]);
      const m = r.pick([4, 8, 11, 16, 22, 32]), tC = r.pick([25, 27, 37, 100]), p = r.pick([1, 2, 0.5]);
      const V = ((m / M) * R * (tC + 273)) / p;
      return task({
        text: L(`What volume does ${m} g of $\\mathrm{${g}}$ ($M = ${M}$ g/mol) occupy at ${tC} °C and ${en(p)} atm, in liters?`, `${tC} °C और ${en(p)} atm पर ${m} g $\\mathrm{${g}}$ ($M = ${M}$ g/mol) का आयतन लीटर में कितना है?`) + useR(L) + roundToL(2, lang),
        answer: numM(V, 2, [[(m * R * (tC + 273)) / p, L("Convert the mass to moles first.", "पहले द्रव्यमान को मोल में बदलिए।")], [((m / M) * R * tC) / p, L("Use the absolute temperature in kelvin.", "केल्विन में परम ताप लीजिए।")]]),
        data: { given: [dq("m", m, "g"), dq("M", M, "g/mol"), `t = ${tC}\\ ^\\circ\\mathrm{C}`, dq("p", p, "atm"), dq("R", 0.0821, "L\\,atm/(mol\\,K)")], find: ["V"] },
        hint: L("Find moles, convert the temperature to kelvin, then use $pV = nRT$.", "मोल ज्ञात कीजिए, ताप को केल्विन में बदलिए, फिर $pV = nRT$ का प्रयोग कीजिए।"),
        formula: ["n = \\dfrac{m}{M}", "pV = nRT"],
        solution: `${H("मोल: ")}$n = ${m}/${M} \\approx ${en(m / M, 4)}\\ \\text{mol}$\n${H("परम ताप: ")}$T = ${tC + 273}\\ \\text{K}$\n${H("आयतन: ")}$V = \\dfrac{${en(m / M, 4)} \\cdot 0.0821 \\cdot ${tC + 273}}{${en(p)}} \\approx ${en(V, 2)}\\ \\text{L}$`,
      });
    },
  },
  {
    id: "exk-ph",
    topics: [T("acids-bases-and-ph")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang), H = (s) => L("", s);
      const lg = Math.log10;
      if (level === 1) {
        const v = r.int(0, 2);
        if (v === 0) {
          const a = r.pick([1, 2, 3, 5]), k = r.int(1, 5);
          const c = a * 10 ** -k, pH = -lg(c);
          return task({
            text: L(`What is the pH of a ${en(c)} mol/L solution of HCl (a strong acid)?`, `HCl (एक प्रबल अम्ल) के ${en(c)} mol/L विलयन का pH कितना है?`) + roundToL(2, lang),
            answer: numM(pH, 2, [[lg(c), L("pH is the NEGATIVE logarithm of $[\\mathrm{H^+}]$.", "pH, $[\\mathrm{H^+}]$ का ऋणात्मक लघुगणक है।")], [14 + lg(c), L("That is the pH of a base of this concentration; HCl is an acid.", "यह इसी सांद्रता के क्षारक का pH है; HCl एक अम्ल है।")]]),
            data: { given: [`c = ${en(c)}\\ \\mathrm{mol/L}`], find: ["\\mathrm{pH}"] },
            hint: L("A strong acid dissociates completely, so $[\\mathrm{H^+}] = c$.", "प्रबल अम्ल पूर्णतः वियोजित होता है, अतः $[\\mathrm{H^+}] = c$।"),
            formula: "\\mathrm{pH} = -\\log[\\mathrm{H^+}]",
            solution: `${H("पूर्ण वियोजन: ")}$[\\mathrm{H^+}] = ${en(c)}\\ \\text{mol/L}$\n$\\mathrm{pH} = -\\log ${en(c)} \\approx ${en(pH, 2)}$`,
          });
        }
        if (v === 1) {
          const pOH = r.pick([1.5, 2, 2.7, 3.2, 4, 4.8, 5.5, 9, 10.3, 11]);
          return task({
            text: L(`A solution at 25 °C has pOH = ${en(pOH)}. What is its pH?`, `25 °C पर एक विलयन का pOH = ${en(pOH)} है। इसका pH कितना है?`),
            answer: numM(Math.round((14 - pOH) * 100) / 100, null, [[pOH, L("pH and pOH add up to 14.", "pH और pOH का योग 14 होता है।")], [-pOH, L("Use $\\mathrm{pH} = 14 - \\mathrm{pOH}$.", "$\\mathrm{pH} = 14 - \\mathrm{pOH}$ का प्रयोग कीजिए।")]]),
            data: { given: [`\\mathrm{pOH} = ${en(pOH)}`], find: ["\\mathrm{pH}"] },
            hint: L("At 25 °C pH + pOH = 14.", "25 °C पर pH + pOH = 14 होता है।"),
            formula: "\\mathrm{pH} + \\mathrm{pOH} = 14",
            solution: `${H("25 °C पर: ")}$\\mathrm{pH} = 14 - \\mathrm{pOH}$\n$\\mathrm{pH} = 14 - ${en(pOH)} = ${en(14 - pOH)}$`,
          });
        }
        const pH = r.int(1, 6), a = r.pick([0, 0.3, 0.5, 0.7]);
        const p = pH + a, h = 10 ** -p * 10 ** pH;
        const undo = L("Undo the logarithm: $[\\mathrm{H^+}] = 10^{-\\mathrm{pH}}$.", "प्रतिलघुगणक लीजिए: $[\\mathrm{H^+}] = 10^{-\\mathrm{pH}}$।");
        return task({
          text: L(`A solution has pH = ${en(p)}. What is $[\\mathrm{H^+}]$, in units of $10^{-${pH}}$ mol/L?`, `एक विलयन का pH = ${en(p)} है। $[\\mathrm{H^+}]$ का मान $10^{-${pH}}$ mol/L की इकाई में कितना है?`) + roundToL(2, lang),
          answer: numM(h, 2, [[10 ** a, L("$[\\mathrm{H^+}] = 10^{-\\mathrm{pH}}$: the exponent is negative.", "$[\\mathrm{H^+}] = 10^{-\\mathrm{pH}}$: घातांक ऋणात्मक है।")], [p, undo]]),
          data: { given: [`\\mathrm{pH} = ${en(p)}`], find: ["[\\mathrm{H^+}]"] },
          hint: undo,
          formula: "[\\mathrm{H^+}] = 10^{-\\mathrm{pH}}",
          solution: `$[\\mathrm{H^+}] = 10^{-${en(p)}} = 10^{-${en(a)}} \\cdot 10^{-${pH}}$\n$10^{-${en(a)}} \\approx ${en(h, 2)}$${L(", so", ", अतः")} $[\\mathrm{H^+}] \\approx ${en(h, 2)} \\times 10^{-${pH}}\\ \\text{mol/L}$`,
        });
      }
      if (level === 2) {
        const v = r.int(0, 2);
        if (v === 0) {
          const [base, z] = r.pick([["NaOH", 1], ["KOH", 1], ["Ba(OH)_2", 2], ["Ca(OH)_2", 2]]);
          const c = r.pick([0.001, 0.002, 0.005, 0.01, 0.02, 0.05]);
          const pOH = -lg(z * c), pH = 14 - pOH;
          return task({
            text: L(`What is the pH of a ${en(c)} mol/L $\\mathrm{${base}}$ solution at 25 °C (complete dissociation)?`, `25 °C पर ${en(c)} mol/L $\\mathrm{${base}}$ विलयन का pH कितना है (पूर्ण वियोजन मानिए)?`) + roundToL(2, lang),
            answer: numM(pH, 2, [[pOH, L("That is the pOH; pH = 14 − pOH.", "यह pOH है; pH = 14 − pOH।")], [z === 2 ? 14 + lg(c) : NaN, L("Each formula unit releases two $\\mathrm{OH^-}$ ions.", "प्रत्येक सूत्र इकाई दो $\\mathrm{OH^-}$ आयन देती है।")]]),
            data: { given: [`c = ${en(c)}\\ \\mathrm{mol/L}`], find: ["\\mathrm{pH}"] },
            hint: L(`Find $[\\mathrm{OH^-}]$${z === 2 ? " (two OH⁻ per formula unit)" : ""}, then pOH, then $\\mathrm{pH} = 14 - \\mathrm{pOH}$.`, `$[\\mathrm{OH^-}]$ ज्ञात कीजिए${z === 2 ? " (प्रति सूत्र इकाई दो OH⁻)" : ""}, फिर pOH, फिर $\\mathrm{pH} = 14 - \\mathrm{pOH}$।`),
            formula: ["\\mathrm{pOH} = -\\log[\\mathrm{OH^-}]", "\\mathrm{pH} + \\mathrm{pOH} = 14"],
            solution: `${H("पूर्ण वियोजन: ")}$[\\mathrm{OH^-}] = ${z === 2 ? `2 \\cdot ${en(c)} = ` : ""}${en(z * c)}\\ \\text{mol/L}$\n$\\mathrm{pOH} = -\\log ${en(z * c)} \\approx ${en(pOH, 2)}$\n$\\mathrm{pH} = 14 - ${en(pOH, 2)} \\approx ${en(pH, 2)}$`,
          });
        }
        if (v === 1) {
          const c = r.pick([0.001, 0.005, 0.01, 0.02, 0.05]);
          const pH = -lg(2 * c);
          return task({
            text: L(`What is the pH of a ${en(c)} mol/L $\\mathrm{H_2SO_4}$ solution? (Assume both protons dissociate completely.)`, `${en(c)} mol/L $\\mathrm{H_2SO_4}$ विलयन का pH कितना है? (मान लीजिए कि दोनों प्रोटॉन पूर्णतः वियोजित होते हैं।)`) + roundToL(2, lang),
            answer: numM(pH, 2, [[-lg(c), L("Each $\\mathrm{H_2SO_4}$ gives two $\\mathrm{H^+}$ ions.", "प्रत्येक $\\mathrm{H_2SO_4}$ अणु दो $\\mathrm{H^+}$ आयन देता है।")], [-lg(c / 2), L("Multiply the concentration by 2, do not divide.", "सांद्रता को 2 से गुणा कीजिए, भाग नहीं।")]]),
            data: { given: [`c = ${en(c)}\\ \\mathrm{mol/L}`], find: ["\\mathrm{pH}"] },
            hint: L("Find $[\\mathrm{H^+}]$ first: two protons per molecule.", "पहले $[\\mathrm{H^+}]$ ज्ञात कीजिए: प्रति अणु दो प्रोटॉन।"),
            formula: "\\mathrm{pH} = -\\log[\\mathrm{H^+}]",
            solution: `${H("प्रति अणु दो प्रोटॉन: ")}$[\\mathrm{H^+}] = 2 \\cdot ${en(c)} = ${en(2 * c)}\\ \\text{mol/L}$\n$\\mathrm{pH} = -\\log ${en(2 * c)} \\approx ${en(pH, 2)}$`,
          });
        }
        const pH0 = r.int(1, 3), f = r.pick([10, 100, 50, 20]);
        const pH = pH0 + lg(f);
        return task({
          text: L(`100 mL of HCl solution with pH = ${pH0} is diluted with water to ${100 * f} mL. What is the new pH?`, `pH = ${pH0} वाले HCl विलयन के 100 mL को जल मिलाकर ${100 * f} mL तक तनु किया जाता है। नया pH कितना है?`) + roundToL(2, lang),
          answer: numM(pH, 2, [[pH0 * f, L("pH is logarithmic: diluting $f$ times raises pH by $\\log f$.", "pH लघुगणकीय है: $f$ गुना तनु करने पर pH $\\log f$ बढ़ता है।")], [pH0 - lg(f), L("Dilution makes the solution less acidic: pH increases.", "तनुकरण से विलयन कम अम्लीय होता है: pH बढ़ता है।")]]),
          data: { given: [`\\mathrm{pH}_0 = ${pH0}`, dq("V_1", 100, "mL"), dq("V_2", 100 * f, "mL")], find: ["\\mathrm{pH}"] },
          hint: L("Find how many times $[\\mathrm{H^+}]$ decreases, then take the logarithm.", "ज्ञात कीजिए कि $[\\mathrm{H^+}]$ कितने गुना घटता है, फिर लघुगणक लीजिए।"),
          formula: ["c_1 V_1 = c_2 V_2", "\\mathrm{pH} = -\\log[\\mathrm{H^+}]"],
          solution: `$[\\mathrm{H^+}]_0 = 10^{-${pH0}}$ mol/L\n${H("तनुकरण के बाद: ")}$[\\mathrm{H^+}] = 10^{-${pH0}} \\cdot \\dfrac{100}{${100 * f}}$\n$\\mathrm{pH} = ${pH0} + \\log ${f} \\approx ${en(pH, 2)}$`,
        });
      }
      const v = r.int(0, 3);
      if (v === 0) {
        const Ka = r.pick([1.8e-5, 1e-5, 4e-6, 6.3e-5, 7.2e-4, 3.5e-8]), c = r.pick([0.1, 0.01, 0.05, 0.2]);
        const e = Math.floor(lg(Ka)), mant = Number((Ka / 10 ** e).toFixed(2));
        const h = Math.sqrt(Ka * c), pH = -lg(h);
        return task({
          text: L(`A weak acid HA has $K_a = ${en(mant)} \\times 10^{${e}}$. What is the pH of a ${en(c)} mol/L solution? (Assume $[\\mathrm{H^+}] = \\sqrt{K_a c}$.)`, `एक दुर्बल अम्ल HA का $K_a = ${en(mant)} \\times 10^{${e}}$ है। इसके ${en(c)} mol/L विलयन का pH कितना है? ($[\\mathrm{H^+}] = \\sqrt{K_a c}$ मान लीजिए।)`) + roundToL(2, lang),
          answer: numM(pH, 2, [[-lg(c), L("A weak acid is only partly dissociated; $[\\mathrm{H^+}] \\neq c$.", "दुर्बल अम्ल केवल आंशिक रूप से वियोजित होता है; $[\\mathrm{H^+}] \\neq c$।")], [-lg(Ka * c), L("Take the square root of $K_a c$.", "$K_a c$ का वर्गमूल लीजिए।")]]),
          data: { given: [`K_a = ${en(mant)} \\times 10^{${e}}`, `c = ${en(c)}\\ \\mathrm{mol/L}`], find: ["\\mathrm{pH}"] },
          hint: L("Use $[\\mathrm{H^+}] \\approx \\sqrt{K_a c}$, then take $-\\log$.", "$[\\mathrm{H^+}] \\approx \\sqrt{K_a c}$ का प्रयोग कीजिए, फिर $-\\log$ लीजिए।"),
          formula: "[\\mathrm{H^+}] \\approx \\sqrt{K_a c}",
          solution: `$K_a c = ${en(mant)} \\times 10^{${e}} \\cdot ${en(c)}$\n$[\\mathrm{H^+}] = \\sqrt{K_a c} \\approx ${en(h * 10 ** -Math.floor(lg(h)), 3)} \\times 10^{${Math.floor(lg(h))}}$\n${H("अतः ")}$\\mathrm{pH} \\approx ${en(pH, 2)}$`,
        });
      }
      if (v === 1) {
        const c = r.pick([0.1, 0.05, 0.01]), pH = r.pick([2.5, 2.9, 3, 3.4, 3.7]);
        const h = 10 ** -pH;
        if (h >= c / 2) return null;
        const Ka = (h * h) / (c - h);
        const e = Math.floor(lg(Ka));
        return task({
          text: L(`A ${en(c)} mol/L solution of a weak monoprotic acid has pH = ${en(pH)}. What is $K_a$, in units of $10^{${e}}$?`, `किसी दुर्बल एकप्रोटिक अम्ल के ${en(c)} mol/L विलयन का pH = ${en(pH)} है। $K_a$ का मान $10^{${e}}$ की इकाई में कितना है?`) + roundToL(2, lang),
          answer: numM(Ka / 10 ** e, 2, [[h / c / 10 ** e, L("$K_a = [\\mathrm{H^+}][\\mathrm{A^-}]/[\\mathrm{HA}]$: square $[\\mathrm{H^+}]$.", "$K_a = [\\mathrm{H^+}][\\mathrm{A^-}]/[\\mathrm{HA}]$: $[\\mathrm{H^+}]$ का वर्ग कीजिए।")], [h / 10 ** e, L("That is $[\\mathrm{H^+}]$ itself; $K_a = [\\mathrm{H^+}]^2/(c - [\\mathrm{H^+}])$.", "यह स्वयं $[\\mathrm{H^+}]$ है; $K_a = [\\mathrm{H^+}]^2/(c - [\\mathrm{H^+}])$।")]]),
          data: { given: [`c = ${en(c)}\\ \\mathrm{mol/L}`, `\\mathrm{pH} = ${en(pH)}`], find: ["K_a"] },
          hint: L("From pH find $[\\mathrm{H^+}] = [\\mathrm{A^-}]$; the undissociated acid is $c - [\\mathrm{H^+}]$.", "pH से $[\\mathrm{H^+}] = [\\mathrm{A^-}]$ ज्ञात कीजिए; अवियोजित अम्ल $c - [\\mathrm{H^+}]$ है।"),
          formula: "K_a = \\dfrac{[\\mathrm{H^+}]^2}{c - [\\mathrm{H^+}]}",
          solution: `${H("pH से: ")}$[\\mathrm{H^+}] = 10^{-${en(pH)}} \\approx ${en(h * 10 ** -Math.floor(lg(h)), 3)} \\times 10^{${Math.floor(lg(h))}}$\n$K_a = \\dfrac{(${en(h * 10 ** -Math.floor(lg(h)), 3)} \\times 10^{${Math.floor(lg(h))}})^2}{${en(c)} - ${en(h, 6)}}$\n$K_a \\approx ${en(Ka / 10 ** e, 2)} \\times 10^{${e}}$`,
        });
      }
      if (v === 2) {
        const ca = r.pick([0.1, 0.2]), Va = r.pick([20, 25, 50]), cb = r.pick([0.1, 0.2]), Vb = r.pick([10, 15, 20, 30, 40, 60]);
        const na = ca * Va, nb = cb * Vb;
        if (Math.abs(na - nb) < 1e-9) return null;
        const ex = Math.abs(na - nb) / (Va + Vb);
        const pH = na > nb ? -lg(ex) : 14 + lg(ex);
        return task({
          text: L(`${Va} mL of ${en(ca)} mol/L HCl is mixed with ${Vb} mL of ${en(cb)} mol/L NaOH. What is the pH of the mixture at 25 °C?`, `${en(ca)} mol/L HCl के ${Va} mL को ${en(cb)} mol/L NaOH के ${Vb} mL के साथ मिलाया जाता है। 25 °C पर मिश्रण का pH कितना है?`) + roundToL(2, lang),
          answer: numM(pH, 2, [[na > nb ? -lg(Math.abs(na - nb) / Va) : 14 + lg(Math.abs(na - nb) / Vb), L("Divide the excess by the TOTAL volume of the mixture.", "आधिक्य को मिश्रण के कुल आयतन से भाग दीजिए।")], [na > nb ? 14 + lg(ex) : -lg(ex), na > nb ? L("The acid is in excess, so the solution is acidic.", "अम्ल आधिक्य में है, अतः विलयन अम्लीय है।") : L("The base is in excess, so the solution is basic.", "क्षारक आधिक्य में है, अतः विलयन क्षारीय है।")]]),
          data: { given: [dq("V_a", Va, "mL"), `c_a = ${en(ca)}\\ \\mathrm{mol/L}`, dq("V_b", Vb, "mL"), `c_b = ${en(cb)}\\ \\mathrm{mol/L}`], find: ["\\mathrm{pH}"] },
          hint: L("Find the moles of $\\mathrm{H^+}$ and $\\mathrm{OH^-}$; they neutralise each other. Divide the excess by the total volume.", "$\\mathrm{H^+}$ और $\\mathrm{OH^-}$ के मोल ज्ञात कीजिए; ये एक-दूसरे को उदासीन करते हैं। आधिक्य को कुल आयतन से भाग दीजिए।"),
          formula: ["n = cV", "\\mathrm{pH} = -\\log[\\mathrm{H^+}]"],
          solution: `$n(\\mathrm{H^+}) = ${en(ca)} \\cdot ${Va} = ${en(na)}\\ \\text{mmol}$, $n(\\mathrm{OH^-}) = ${en(cb)} \\cdot ${Vb} = ${en(nb)}\\ \\text{mmol}$\n${L("Excess", "आधिक्य")} ${na > nb ? "$\\mathrm{H^+}$" : "$\\mathrm{OH^-}$"}: $${en(Math.abs(na - nb))}$ mmol ${L("in", "कुल")} ${Va + Vb} mL${L("", " में")}, $c = ${en(ex, 5)}$ mol/L\n${na > nb ? `$\\mathrm{pH} = -\\log ${en(ex, 5)} \\approx ${en(pH, 2)}$` : `$\\mathrm{pOH} = -\\log ${en(ex, 5)} \\approx ${en(-lg(ex), 2)}$, $\\mathrm{pH} \\approx ${en(pH, 2)}$`}`,
        });
      }
      const pKa = r.pick([4.76, 3.75, 4.2, 9.25, 7.2]), cA = r.pick([0.1, 0.2, 0.05]), cB = r.pick([0.05, 0.1, 0.2, 0.3]);
      if (cA === cB) return null;
      const pH = pKa + lg(cB / cA);
      return task({
        text: L(`A buffer contains ${en(cA)} mol/L of a weak acid (p$K_a$ = ${en(pKa)}) and ${en(cB)} mol/L of its conjugate base. What is its pH?`, `एक बफर विलयन में ${en(cA)} mol/L दुर्बल अम्ल (p$K_a$ = ${en(pKa)}) और ${en(cB)} mol/L उसका संयुग्मी क्षारक है। इसका pH कितना है?`) + roundToL(2, lang),
        answer: numM(pH, 2, [[pKa + lg(cA / cB), L("The ratio is [base]/[acid], not [acid]/[base].", "अनुपात [क्षारक]/[अम्ल] है, [अम्ल]/[क्षारक] नहीं।")], [pKa, L("pH = pKa only when the acid and base concentrations are equal.", "pH = pKa केवल तब होता है जब अम्ल और क्षारक की सांद्रताएँ बराबर हों।")]]),
        data: { given: [`\\mathrm{p}K_a = ${en(pKa)}`, `[\\mathrm{HA}] = ${en(cA)}\\ \\mathrm{mol/L}`, `[\\mathrm{A^-}] = ${en(cB)}\\ \\mathrm{mol/L}`], find: ["\\mathrm{pH}"] },
        hint: L("Use the Henderson–Hasselbalch equation.", "हेंडरसन–हैसलबाख समीकरण का प्रयोग कीजिए।"),
        formula: "\\mathrm{pH} = \\mathrm{p}K_a + \\log\\dfrac{[\\mathrm{A^-}]}{[\\mathrm{HA}]}",
        solution: `${H("अनुपात: ")}$\\dfrac{[\\mathrm{A^-}]}{[\\mathrm{HA}]} = \\dfrac{${en(cB)}}{${en(cA)}} = ${en(cB / cA, 3)}$\n$\\log ${en(cB / cA, 3)} \\approx ${en(lg(cB / cA), 3)}$\n${H("हेंडरसन–हैसलबाख समीकरण से: ")}$\\mathrm{pH} = ${en(pKa)} + ${en(lg(cB / cA), 3)} \\approx ${en(pH, 2)}$`,
      });
    },
  },
  {
    id: "exk-thermo",
    topics: [T("thermochemistry")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang), H = (s) => L("", s);
      if (level === 1) {
        const dH = -r.pick([286, 394, 890, 572]), n = r.pick([0.5, 2, 3]);
        return task({
          text: L(`A reaction has $\\Delta H = ${dH}$ kJ per mole of fuel. How much heat is released when ${n} mol of fuel burns, in kJ?`, `एक दहन अभिक्रिया में ईंधन के प्रति मोल $\\Delta H = ${dH}$ kJ है। ${n} mol ईंधन के जलने पर कितनी ऊष्मा (kJ में) मुक्त होती है?`),
          answer: num(-dH * n),
          hint: L("Heat released = moles × $|\\Delta H|$.", "मुक्त ऊष्मा = मोल × $|\\Delta H|$।"),
          solution: `${H("मुक्त ऊष्मा: ")}$Q = ${n} \\cdot ${-dH} = ${en(-dH * n)}\\ \\text{kJ}$`,
        });
      }
      if (level === 2) {
        const a = -r.int(100, 400), b = -r.int(50, 300);
        return task({
          text: L(`Given $\\mathrm{A \\rightarrow B}$, $\\Delta H_1 = ${a}$ kJ and $\\mathrm{B \\rightarrow C}$, $\\Delta H_2 = ${b}$ kJ, what is $\\Delta H$ for $\\mathrm{A \\rightarrow C}$, in kJ? (Hess's law.)`, `$\\mathrm{A \\rightarrow B}$ के लिए $\\Delta H_1 = ${a}$ kJ और $\\mathrm{B \\rightarrow C}$ के लिए $\\Delta H_2 = ${b}$ kJ है। $\\mathrm{A \\rightarrow C}$ के लिए $\\Delta H$ का मान kJ में कितना है? (हेस का नियम)`),
          answer: num(a + b),
          hint: L("Add the steps: enthalpy changes add up.", "चरणों को जोड़िए: एन्थैल्पी परिवर्तन आपस में जुड़ते हैं।"),
          formula: "\\Delta H = \\Delta H_1 + \\Delta H_2",
          solution: `${H("हेस के नियम से: ")}$\\Delta H = ${a} + (${b}) = ${a + b}\\ \\text{kJ}$`,
        });
      }
      const dH = r.int(-120, 60), dS = r.int(-200, 250), Tk = r.pick([298, 350, 500, 1000]);
      const dG = dH - (Tk * dS) / 1000;
      return task({
        text: L(`For a reaction, $\\Delta H = ${dH}$ kJ/mol and $\\Delta S = ${dS}$ J/(mol·K). What is $\\Delta G$ at ${Tk} K, in kJ/mol?`, `एक अभिक्रिया के लिए $\\Delta H = ${dH}$ kJ/mol और $\\Delta S = ${dS}$ J/(mol·K) है। ${Tk} K पर $\\Delta G$ का मान kJ/mol में कितना है?`) + roundToL(1, lang),
        answer: num(dG, 1),
        hint: L("$\\Delta G = \\Delta H - T\\Delta S$ (convert $\\Delta S$ to kJ).", "$\\Delta G = \\Delta H - T\\Delta S$ ($\\Delta S$ को kJ में बदलिए)।"),
        formula: "\\Delta G = \\Delta H - T\\Delta S",
        solution: `${H("$\\Delta S$ को kJ में बदलकर: ")}$\\Delta G = ${dH} - ${Tk} \\cdot ${dS < 0 ? `(${en(dS / 1000)})` : en(dS / 1000)} \\approx ${en(dG, 1)}\\ \\text{kJ/mol}$`,
      });
    },
  },
  {
    id: "exk-equilibrium",
    topics: [T("chemical-equilibrium")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang), H = (s) => L("", s);
      const C = (x) => `$[\\mathrm{${x}}]$`;
      if (level === 1) {
        // [enačba, reaktanti [[snov, koef]], produkti]
        const RX = [
          ["A + B \\rightleftharpoons C", [["A", 1], ["B", 1]], [["C", 1]]],
          ["N_2O_4 \\rightleftharpoons 2NO_2", [["N_2O_4", 1]], [["NO_2", 2]]],
          ["H_2 + I_2 \\rightleftharpoons 2HI", [["H_2", 1], ["I_2", 1]], [["HI", 2]]],
          ["PCl_5 \\rightleftharpoons PCl_3 + Cl_2", [["PCl_5", 1]], [["PCl_3", 1], ["Cl_2", 1]]],
          ["2SO_2 + O_2 \\rightleftharpoons 2SO_3", [["SO_2", 2], ["O_2", 1]], [["SO_3", 2]]],
          ["CO + H_2O \\rightleftharpoons CO_2 + H_2", [["CO", 1], ["H_2O", 1]], [["CO_2", 1], ["H_2", 1]]],
        ];
        const [eq, re, pr] = r.pick(RX);
        const conc = {};
        for (const [s] of [...re, ...pr]) conc[s] = r.pick([0.1, 0.2, 0.25, 0.4, 0.5, 0.8, 1, 1.2]);
        const prod = (list, useCoef = true) => list.reduce((p, [s, k]) => p * conc[s] ** (useCoef ? k : 1), 1);
        const K = prod(pr) / prod(re);
        const hasCoef = [...re, ...pr].some(([, k]) => k > 1);
        const term = (list) => list.map(([s, k]) => `[\\mathrm{${s}}]${k > 1 ? `^${k}` : ""}`).join("");
        const list = [...re, ...pr].map(([s]) => `${C(s)} = ${en(conc[s])}`).join(", ");
        return task({
          text: L(`For $\\mathrm{${eq}}$ the equilibrium concentrations are ${list} mol/L. What is $K_c$?`, `$\\mathrm{${eq}}$ के लिए साम्य सांद्रताएँ ${list} mol/L हैं। $K_c$ का मान कितना है?`) + roundToL(2, lang),
          answer: numM(K, 2, [[1 / K, L("Products go in the numerator, reactants in the denominator.", "उत्पाद अंश में और अभिकर्मक हर में आते हैं।")], [hasCoef ? prod(pr, false) / prod(re, false) : NaN, L("Raise each concentration to the power of its coefficient.", "प्रत्येक सांद्रता पर उसके गुणांक के बराबर घात लगाइए।")], [re.length > 1 ? (pr.reduce((p, [s]) => p + conc[s], 0)) / re.reduce((p, [s]) => p + conc[s], 0) : NaN, L("Multiply the concentrations, do not add them.", "सांद्रताओं को गुणा कीजिए, जोड़िए नहीं।")]]),
          data: { given: [...re, ...pr].map(([s]) => `[\\mathrm{${s}}] = ${en(conc[s])}\\ \\mathrm{mol/L}`), find: ["K_c"] },
          hint: L("Write $K_c$ as products over reactants, each raised to the power of its coefficient.", "$K_c$ को उत्पादों और अभिकर्मकों के अनुपात के रूप में लिखिए; प्रत्येक सांद्रता पर उसके गुणांक की घात लगाइए।"),
          formula: `K_c = \\dfrac{${term(pr)}}{${term(re)}}`,
          solution: `${H("साम्य स्थिरांक: ")}$K_c = \\dfrac{${term(pr)}}{${term(re)}}$\n$K_c = \\dfrac{${pr.map(([s, k]) => `${en(conc[s])}${k > 1 ? `^${k}` : ""}`).join(" \\cdot ")}}{${re.map(([s, k]) => `${en(conc[s])}${k > 1 ? `^${k}` : ""}`).join(" \\cdot ")}} \\approx ${en(K, 2)}$`,
        });
      }
      if (level === 2) {
        const v = r.int(0, 2);
        if (v === 0) {
          const c0 = r.pick([0.5, 1, 1.5, 2]), y = r.pick([0.4, 0.6, 0.8, 1, 1.2, 1.6, 2]);
          if (y / 2 >= c0) return null;
          const x = y / 2, K = (y * y) / ((c0 - x) * (c0 - x));
          return task({
            text: L(`${en(c0)} mol/L of $\\mathrm{H_2}$ and ${en(c0)} mol/L of $\\mathrm{I_2}$ are mixed. At equilibrium ($\\mathrm{H_2 + I_2 \\rightleftharpoons 2HI}$) ${C("HI")} = ${en(y)} mol/L. What is $K_c$?`, `${en(c0)} mol/L $\\mathrm{H_2}$ और ${en(c0)} mol/L $\\mathrm{I_2}$ को मिलाया जाता है। साम्य पर ($\\mathrm{H_2 + I_2 \\rightleftharpoons 2HI}$) ${C("HI")} = ${en(y)} mol/L है। $K_c$ का मान कितना है?`) + roundToL(2, lang),
            answer: numM(K, 2, [[(y * y) / (c0 * c0), L("Use equilibrium concentrations of $\\mathrm{H_2}$ and $\\mathrm{I_2}$, not the starting ones.", "$\\mathrm{H_2}$ और $\\mathrm{I_2}$ की साम्य सांद्रताएँ लीजिए, प्रारंभिक नहीं।")], [(y * y) / ((c0 - y) * (c0 - y)), L("Forming 2 mol of HI uses only 1 mol of $\\mathrm{H_2}$: subtract $y/2$.", "2 mol HI बनने में केवल 1 mol $\\mathrm{H_2}$ खर्च होता है: $y/2$ घटाइए।")], [y / ((c0 - x) * (c0 - x)), L("Square $[\\mathrm{HI}]$ (coefficient 2).", "$[\\mathrm{HI}]$ का वर्ग कीजिए (गुणांक 2)।")]]),
            data: { given: [`c_0 = ${en(c0)}\\ \\mathrm{mol/L}`, `[\\mathrm{HI}] = ${en(y)}\\ \\mathrm{mol/L}`], find: ["K_c"] },
            hint: L("Make an ICE table: forming $y$ mol/L of HI uses $y/2$ of each reactant.", "ICE सारणी बनाइए: $y$ mol/L HI बनने में प्रत्येक अभिकर्मक का $y/2$ खर्च होता है।"),
            formula: "K_c = \\dfrac{[\\mathrm{HI}]^2}{[\\mathrm{H_2}][\\mathrm{I_2}]}",
            solution: `${L(`Used: $${en(y)}/2 = ${en(x)}$ mol/L of each reactant`, `खर्च: प्रत्येक अभिकर्मक का $${en(y)}/2 = ${en(x)}$ mol/L`)}\n$[\\mathrm{H_2}] = [\\mathrm{I_2}] = ${en(c0)} - ${en(x)} = ${en(c0 - x)}$ mol/L\n$K_c = \\dfrac{${en(y)}^2}{${en(c0 - x)}^2} \\approx ${en(K, 2)}$`,
          });
        }
        if (v === 1) {
          const c0 = r.pick([0.5, 1, 2]), a = r.pick([20, 25, 40, 50, 60]);
          const x = (c0 * a) / 100, K = (x * x) / (c0 - x);
          return task({
            text: L(`${en(c0)} mol/L of $\\mathrm{PCl_5}$ is placed in a vessel. At equilibrium ($\\mathrm{PCl_5 \\rightleftharpoons PCl_3 + Cl_2}$), ${a}% of it has dissociated. What is $K_c$?`, `एक पात्र में ${en(c0)} mol/L $\\mathrm{PCl_5}$ रखा जाता है। साम्य पर ($\\mathrm{PCl_5 \\rightleftharpoons PCl_3 + Cl_2}$) इसका ${a}% वियोजित हो जाता है। $K_c$ का मान कितना है?`) + roundToL(3, lang),
            answer: numM(K, 3, [[(x * x) / c0, L("Use the equilibrium concentration of $\\mathrm{PCl_5}$: $c_0 - x$.", "$\\mathrm{PCl_5}$ की साम्य सांद्रता लीजिए: $c_0 - x$।")], [x / (c0 - x), L("Both $\\mathrm{PCl_3}$ and $\\mathrm{Cl_2}$ appear in the numerator.", "अंश में $\\mathrm{PCl_3}$ और $\\mathrm{Cl_2}$ दोनों आते हैं।")]]),
            data: { given: [`c_0 = ${en(c0)}\\ \\mathrm{mol/L}`, `\\alpha = ${a}\\%`], find: ["K_c"] },
            hint: L("Find $x$, the concentration that dissociated; it gives $[\\mathrm{PCl_3}] = [\\mathrm{Cl_2}] = x$.", "वियोजित सांद्रता $x$ ज्ञात कीजिए; तब $[\\mathrm{PCl_3}] = [\\mathrm{Cl_2}] = x$।"),
            formula: "K_c = \\dfrac{[\\mathrm{PCl_3}][\\mathrm{Cl_2}]}{[\\mathrm{PCl_5}]}",
            solution: `${H("वियोजित: ")}$x = ${en(a / 100)} \\cdot ${en(c0)} = ${en(x)}$ mol/L\n${H("शेष: ")}$[\\mathrm{PCl_5}] = ${en(c0)} - ${en(x)} = ${en(c0 - x)}$ mol/L\n$K_c = \\dfrac{${en(x)}^2}{${en(c0 - x)}} \\approx ${en(K, 3)}$`,
          });
        }
        const K = r.pick([4, 5, 10, 16, 25, 0.5, 0.25, 50]), mode = r.pick(["rev", "double", "half"]);
        const K2 = mode === "rev" ? 1 / K : mode === "double" ? K * K : Math.sqrt(K);
        const eq2 = mode === "rev" ? "$\\mathrm{2NH_3 \\rightleftharpoons N_2 + 3H_2}$" : mode === "double" ? "$\\mathrm{2N_2 + 6H_2 \\rightleftharpoons 4NH_3}$" : "$\\mathrm{\\tfrac12 N_2 + \\tfrac32 H_2 \\rightleftharpoons NH_3}$";
        const revWhy = L("Reversing the reaction changes $K$ to $1/K$.", "अभिक्रिया उलटने पर $K$ का मान $1/K$ हो जाता है।");
        return task({
          text: L(`For $\\mathrm{N_2 + 3H_2 \\rightleftharpoons 2NH_3}$, $K_c = ${en(K)}$ at a certain temperature. What is $K_c$ for ${eq2} at the same temperature?`, `किसी ताप पर $\\mathrm{N_2 + 3H_2 \\rightleftharpoons 2NH_3}$ के लिए $K_c = ${en(K)}$ है। उसी ताप पर ${eq2} के लिए $K_c$ का मान कितना है?`) + roundToL(3, lang),
          answer: numM(K2, 3, [[mode === "rev" ? -K : 2 * K, mode === "rev" ? L("Reversing a reaction inverts $K$, it does not change its sign.", "अभिक्रिया उलटने पर $K$ का व्युत्क्रम लिया जाता है; उसका चिह्न नहीं बदलता।") : L("Doubling the coefficients squares $K$; it does not double it.", "गुणांक दोगुने करने पर $K$ का वर्ग होता है; $K$ दोगुना नहीं होता।")], [mode === "half" ? K / 2 : mode === "rev" ? K : NaN, mode === "half" ? L("Halving the coefficients takes the square root of $K$.", "गुणांक आधे करने पर $K$ का वर्गमूल लिया जाता है।") : revWhy]]),
          data: { given: [`K_c = ${en(K)}`], find: ["K_c'"] },
          hint: L("Reversing a reaction gives $1/K$; multiplying all coefficients by $n$ gives $K^n$.", "अभिक्रिया उलटने पर $1/K$ मिलता है; सभी गुणांकों को $n$ से गुणा करने पर $K^n$ मिलता है।"),
          formula: ["K_{rev} = \\dfrac{1}{K}", "K_{n\\times} = K^n"],
          solution: `${mode === "rev" ? L("The reaction is reversed", "अभिक्रिया उलट दी गई है") : mode === "double" ? L("All coefficients are multiplied by 2", "सभी गुणांकों को 2 से गुणा किया गया है") : L("All coefficients are multiplied by ½", "सभी गुणांकों को ½ से गुणा किया गया है")}\n$K_c' = ${mode === "rev" ? `1/${en(K)}` : mode === "double" ? `${en(K)}^2` : `\\sqrt{${en(K)}}`}$\n$K_c' \\approx ${en(K2, 3)}$`,
        });
      }
      const v = r.int(0, 2);
      if (v === 0) {
        const K = r.pick([4, 9, 16, 25, 36, 49, 0.25]), c0 = r.pick([0.5, 1, 1.5, 2]);
        const s = Math.sqrt(K), x = (c0 * s) / (1 + s);
        return task({
          text: L(`For $\\mathrm{A + B \\rightleftharpoons C + D}$, $K_c = ${en(K)}$. If ${en(c0)} mol/L of A and ${en(c0)} mol/L of B are mixed (no C or D at the start), what is ${C("C")} at equilibrium, in mol/L?`, `$\\mathrm{A + B \\rightleftharpoons C + D}$ के लिए $K_c = ${en(K)}$ है। यदि ${en(c0)} mol/L A और ${en(c0)} mol/L B मिलाए जाएँ (प्रारंभ में C या D नहीं है), तो साम्य पर ${C("C")} का मान mol/L में कितना होगा?`) + roundToL(3, lang),
          answer: numM(x, 3, [[(c0 * K) / (1 + K), L("Take the square root of both sides: $\\sqrt{K} = x/(c_0 - x)$.", "दोनों पक्षों का वर्गमूल लीजिए: $\\sqrt{K} = x/(c_0 - x)$।")], [c0 * s, L("The reactants are used up as C forms: $[\\mathrm{A}] = c_0 - x$.", "C बनने के साथ अभिकर्मक खर्च होते हैं: $[\\mathrm{A}] = c_0 - x$।")]]),
          data: { given: [`K_c = ${en(K)}`, `c_0 = ${en(c0)}\\ \\mathrm{mol/L}`], find: ["[\\mathrm{C}]"] },
          hint: L("Let $x$ react: $K_c = \\dfrac{x^2}{(c_0 - x)^2}$, so take the square root of both sides.", "मान लीजिए $x$ mol/L अभिक्रिया करता है: $K_c = \\dfrac{x^2}{(c_0 - x)^2}$, अतः दोनों पक्षों का वर्गमूल लीजिए।"),
          formula: "K_c = \\dfrac{[\\mathrm{C}][\\mathrm{D}]}{[\\mathrm{A}][\\mathrm{B}]}",
          solution: `${H("साम्य पर: ")}$\\dfrac{x^2}{(${en(c0)} - x)^2} = ${en(K)}$\n${H("वर्गमूल लेने पर: ")}$\\dfrac{x}{${en(c0)} - x} = ${en(s)}$\n$x = \\dfrac{${en(s * c0)}}{${en(1 + s)}} \\approx ${en(x, 3)}\\ \\text{mol/L}$`,
        });
      }
      if (v === 1) {
        const c0 = r.pick([0.1, 0.2, 0.5, 1]), K = r.pick([0.01, 0.02, 0.05, 0.1, 0.2]);
        // PCl5 ⇌ PCl3 + Cl2: x² + Kx - Kc0 = 0
        const x = (-K + Math.sqrt(K * K + 4 * K * c0)) / 2;
        return task({
          text: L(`For $\\mathrm{PCl_5 \\rightleftharpoons PCl_3 + Cl_2}$, $K_c = ${en(K)}$. Starting with ${en(c0)} mol/L of $\\mathrm{PCl_5}$ only, what is ${C("Cl_2")} at equilibrium, in mol/L?`, `$\\mathrm{PCl_5 \\rightleftharpoons PCl_3 + Cl_2}$ के लिए $K_c = ${en(K)}$ है। केवल ${en(c0)} mol/L $\\mathrm{PCl_5}$ से प्रारंभ करने पर साम्य पर ${C("Cl_2")} का मान mol/L में कितना होगा?`) + roundToL(3, lang),
          answer: numM(x, 3, [[Math.sqrt(K * c0), L("That assumes $x \\ll c_0$; here solve the quadratic exactly.", "यह $x \\ll c_0$ मानकर निकला है; यहाँ द्विघात समीकरण को सटीक हल कीजिए।")], [Math.sqrt(K), L("The denominator is $c_0 - x$, not 1.", "हर $c_0 - x$ है, 1 नहीं।")]]),
          data: { given: [`K_c = ${en(K)}`, `c_0 = ${en(c0)}\\ \\mathrm{mol/L}`], find: ["[\\mathrm{Cl_2}]"] },
          hint: L("With $x$ dissociated: $K_c = \\dfrac{x^2}{c_0 - x}$. Solve the quadratic and keep the positive root.", "यदि $x$ वियोजित हो, तो $K_c = \\dfrac{x^2}{c_0 - x}$। द्विघात समीकरण हल कीजिए और धनात्मक मूल लीजिए।"),
          formula: "K_c = \\dfrac{x^2}{c_0 - x}",
          solution: `${H("द्विघात समीकरण: ")}$x^2 + ${en(K)}x - ${en(K * c0)} = 0$\n${H("धनात्मक मूल: ")}$x = \\dfrac{-${en(K)} + \\sqrt{${en(K * K)} + ${en(4 * K * c0)}}}{2}$\n$x \\approx ${en(x, 3)}\\ \\text{mol/L}$`,
        });
      }
      const Kc = r.pick([0.5, 1.2, 2, 4.5, 10]), T = r.pick([300, 400, 500, 600]), dn = r.pick([1, -1, 2]);
      const eqs = { 1: "PCl_5(g) \\rightleftharpoons PCl_3(g) + Cl_2(g)", "-1": "2SO_2(g) + O_2(g) \\rightleftharpoons 2SO_3(g)", 2: "2NH_3(g) \\rightleftharpoons N_2(g) + 3H_2(g)" };
      const Kp = Kc * (0.0821 * T) ** dn;
      return task({
        text: L(`For $\\mathrm{${eqs[dn]}}$, $K_c = ${en(Kc)}$ at ${T} K. What is $K_p$ (pressures in atm)?`, `${T} K पर $\\mathrm{${eqs[dn]}}$ के लिए $K_c = ${en(Kc)}$ है। $K_p$ (दाब atm में) का मान कितना है?`) + useR(L) + roundToL(dn === -1 ? 5 : 1, lang),
        answer: numM(Kp, dn === -1 ? 5 : 1, [[Kc * (0.0821 * T) ** -dn, L("$\\Delta n$ = moles of gaseous products − moles of gaseous reactants.", "$\\Delta n$ = गैसीय उत्पादों के मोल − गैसीय अभिकर्मकों के मोल।")], [Kc * 0.0821 * T, L(`Raise $RT$ to the power $\\Delta n = ${dn}$.`, `$RT$ पर घात $\\Delta n = ${dn}$ लगाइए।`)], [Kc, L("$K_p = K_c$ only when $\\Delta n = 0$.", "$K_p = K_c$ केवल तब होता है जब $\\Delta n = 0$ हो।")]]),
        data: { given: [`K_c = ${en(Kc)}`, dq("T", T, "K"), dq("R", 0.0821, "L\\,atm/(mol\\,K)")], find: ["K_p"] },
        hint: L("Count $\\Delta n$ of gas molecules, then use $K_p = K_c (RT)^{\\Delta n}$.", "गैस अणुओं के मोलों में परिवर्तन $\\Delta n$ गिनिए, फिर $K_p = K_c (RT)^{\\Delta n}$ का प्रयोग कीजिए।"),
        formula: "K_p = K_c (RT)^{\\Delta n}",
        solution: `${H("गैसीय मोलों में परिवर्तन: ")}$\\Delta n = ${dn}$\n$RT = 0.0821 \\cdot ${T} = ${en(0.0821 * T)}$\n$K_p = ${en(Kc)} \\cdot ${en(0.0821 * T)}^{${dn}} \\approx ${en(Kp, dn === -1 ? 5 : 1)}$`,
      });
    },
  },
  {
    id: "exk-kinetics",
    topics: [T("chemical-kinetics")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang), H = (s) => L("", s);
      const useR8 = L(" (Use $R = 8.314$ J/(mol·K).)", " ($R = 8.314$ J/(mol·K) लीजिए।)");
      if (level === 1) {
        const v = r.int(0, 3);
        if (v === 0) {
          const t = r.pick([5, 10, 15, 20, 30, 45]), k = r.int(2, 5), c0 = r.pick([0.4, 0.8, 1.2, 1.6, 2, 3.2]);
          return task({
            text: L(`A first-order reaction has a half-life of ${t} min. Starting at ${en(c0)} mol/L, what is the concentration after ${t * k} min, in mol/L?`, `एक प्रथम कोटि अभिक्रिया की अर्धायु ${t} min है। प्रारंभिक सांद्रता ${en(c0)} mol/L हो, तो ${t * k} min बाद सांद्रता mol/L में कितनी होगी?`) + roundToL(3, lang),
            answer: numM(c0 / 2 ** k, 3, [[c0 / (2 * k), L("Halve once per half-life: divide by $2^n$, not by $2n$.", "प्रत्येक अर्धायु में सांद्रता एक बार आधी होती है: $2^n$ से भाग दीजिए, $2n$ से नहीं।")], [c0 - c0 / 2 ** k, L("That is how much reacted, not how much is left.", "यह अभिक्रिया कर चुकी मात्रा है, शेष मात्रा नहीं।")]]),
            data: { given: [dq("t_{1/2}", t, "min"), `c_0 = ${en(c0)}\\ \\mathrm{mol/L}`, dq("t", t * k, "min")], find: ["c"] },
            hint: L("Count half-lives; each one halves the concentration.", "अर्धायुओं की संख्या गिनिए; प्रत्येक अर्धायु में सांद्रता आधी हो जाती है।"),
            formula: "c = c_0 \\left(\\tfrac12\\right)^{t/t_{1/2}}",
            solution: `$n = ${t * k}/${t} = ${k}$ ${L("half-lives", "अर्धायु")}\n$c = ${en(c0)}/2^{${k}} = ${en(c0 / 2 ** k, 3)}\\ \\text{mol/L}$`,
          });
        }
        if (v === 1) {
          const k = r.pick([0.01, 0.02, 0.05, 0.1, 0.231, 0.0693, 0.004]);
          const t = Math.LN2 / k;
          return task({
            text: L(`A first-order reaction has rate constant $k = ${en(k)}\\ \\text{s}^{-1}$. What is its half-life, in seconds?`, `एक प्रथम कोटि अभिक्रिया का वेग स्थिरांक $k = ${en(k)}\\ \\text{s}^{-1}$ है। इसकी अर्धायु सेकंड में कितनी है?`) + roundToL(1, lang),
            answer: numM(t, 1, [[k / Math.LN2, L("You inverted the ratio: $t_{1/2} = \\ln 2 / k$.", "आपने अनुपात उलट दिया है: $t_{1/2} = \\ln 2 / k$।")], [1 / k, L("Multiply by $\\ln 2 \\approx 0.693$.", "$\\ln 2 \\approx 0.693$ से गुणा कीजिए।")]]),
            data: { given: [`k = ${en(k)}\\ \\mathrm{s^{-1}}`], find: ["t_{1/2}"] },
            hint: L("For a first-order reaction the half-life does not depend on concentration.", "प्रथम कोटि अभिक्रिया की अर्धायु सांद्रता पर निर्भर नहीं करती।"),
            formula: "t_{1/2} = \\dfrac{\\ln 2}{k} \\approx \\dfrac{0.693}{k}",
            solution: `${H("अर्धायु: ")}$t_{1/2} = \\dfrac{0.693}{${en(k)}}$\n$t_{1/2} \\approx ${en(t, 1)}\\ \\text{s}$`,
          });
        }
        if (v === 2) {
          const n = r.pick([0, 1, 2, 3]), f = r.pick([2, 3, 4, 5]);
          return task({
            text: L(`The rate law of a reaction is rate $= k[\\mathrm{A}]^{${n}}$. By what factor does the rate change when $[\\mathrm{A}]$ is multiplied by ${f}?`, `एक अभिक्रिया का वेग नियम है: वेग $= k[\\mathrm{A}]^{${n}}$। $[\\mathrm{A}]$ को ${f} गुना करने पर वेग कितने गुना हो जाता है?`),
            answer: numM(f ** n, null, [[f * n, L("Raise the factor to the power $n$, do not multiply.", "गुणक पर घात $n$ लगाइए, $n$ से गुणा नहीं कीजिए।")], [n === 0 ? f : f, n === 0 ? L("Zero order: the rate does not depend on $[\\mathrm{A}]$.", "शून्य कोटि: वेग $[\\mathrm{A}]$ पर निर्भर नहीं करता।") : L("The rate is not simply proportional unless $n = 1$.", "जब तक $n = 1$ न हो, वेग सांद्रता के सीधे समानुपाती नहीं होता।")]]),
            data: { given: [`n = ${n}`, `f = ${f}`], find: ["\\text{factor}"] },
            hint: L("Rate is proportional to $[\\mathrm{A}]^n$.", "वेग $[\\mathrm{A}]^n$ के समानुपाती है।"),
            formula: "\\dfrac{r_2}{r_1} = \\left(\\dfrac{[\\mathrm{A}]_2}{[\\mathrm{A}]_1}\\right)^n",
            solution: `$\\dfrac{r_2}{r_1} = ${f}^{${n}}$\n${L("Factor", "गुणक")} $= ${f ** n}$`,
          });
        }
        const c1 = r.pick([0.8, 1, 1.2, 1.5, 2]), c2 = r.pick([0.2, 0.3, 0.5, 0.6]), dt = r.pick([10, 20, 25, 40, 50]);
        const rate = (c1 - c2) / dt;
        return task({
          text: L(`The concentration of a reactant falls from ${en(c1)} mol/L to ${en(c2)} mol/L in ${dt} s. What is the average rate of reaction, in mol/(L·s)?`, `${dt} s में एक अभिकर्मक की सांद्रता ${en(c1)} mol/L से घटकर ${en(c2)} mol/L हो जाती है। अभिक्रिया का औसत वेग mol/(L·s) में कितना है?`) + roundToL(3, lang),
          answer: numM(rate, 3, [[c1 / dt, L("Use the change in concentration, not the starting value.", "सांद्रता में परिवर्तन लीजिए, प्रारंभिक मान नहीं।")], [dt / (c1 - c2), L("You inverted the ratio: rate = Δc/Δt.", "आपने अनुपात उलट दिया है: वेग = Δc/Δt।")]]),
          data: { given: [`c_1 = ${en(c1)}\\ \\mathrm{mol/L}`, `c_2 = ${en(c2)}\\ \\mathrm{mol/L}`, dq("\\Delta t", dt, "s")], find: ["v"] },
          hint: L("Rate = change in concentration ÷ time.", "वेग = सांद्रता में परिवर्तन ÷ समय।"),
          formula: "v = -\\dfrac{\\Delta c}{\\Delta t}",
          solution: `${H("सांद्रता में परिवर्तन: ")}$\\Delta c = ${en(c2)} - ${en(c1)} = ${en(c2 - c1)}$ mol/L\n${H("औसत वेग: ")}$v = \\dfrac{${en(c1 - c2)}}{${dt}} \\approx ${en(rate, 3)}\\ \\text{mol/(L·s)}$`,
        });
      }
      if (level === 2) {
        const v = r.int(0, 2);
        if (v === 0) {
          const k = r.pick([0.01, 0.02, 0.05, 0.1]), t = r.pick([10, 20, 30, 50, 60]), c0 = r.pick([0.5, 1, 2]);
          const c = c0 * Math.exp(-k * t);
          return task({
            text: L(`A first-order reaction has $k = ${en(k)}\\ \\text{s}^{-1}$. Starting at ${en(c0)} mol/L, what is the concentration after ${t} s, in mol/L?`, `एक प्रथम कोटि अभिक्रिया के लिए $k = ${en(k)}\\ \\text{s}^{-1}$ है। प्रारंभिक सांद्रता ${en(c0)} mol/L हो, तो ${t} s बाद सांद्रता mol/L में कितनी होगी?`) + roundToL(3, lang),
            answer: numM(c, 3, [[c0 * (1 - k * t), L("First-order decay is exponential, not linear.", "प्रथम कोटि में सांद्रता चरघातांकी रूप से घटती है, रैखिक रूप से नहीं।")], [c0 * Math.exp(-k / t), L("The exponent is $-kt$.", "घातांक $-kt$ है।")]]),
            data: { given: [`k = ${en(k)}\\ \\mathrm{s^{-1}}`, `c_0 = ${en(c0)}\\ \\mathrm{mol/L}`, dq("t", t, "s")], find: ["c"] },
            hint: L("Use the integrated first-order rate law.", "प्रथम कोटि के समाकलित वेग नियम का प्रयोग कीजिए।"),
            formula: "c = c_0 e^{-kt}",
            solution: `$kt = ${en(k)} \\cdot ${t} = ${en(k * t)}$\n$e^{-${en(k * t)}} \\approx ${en(Math.exp(-k * t), 4)}$\n${H("सांद्रता: ")}$c = ${en(c0)} \\cdot ${en(Math.exp(-k * t), 4)} \\approx ${en(c, 3)}\\ \\text{mol/L}$`,
          });
        }
        if (v === 1) {
          const n = r.pick([0, 1, 2]), f = r.pick([2, 3, 4]), r1 = r.pick([1.2, 2, 2.5, 3, 4]);
          const r2 = r1 * f ** n;
          return task({
            text: L(`When $[\\mathrm{A}]$ is increased from 0.1 mol/L to ${en(0.1 * f)} mol/L, the initial rate changes from ${en(r1)} to ${en(r2)} mmol/(L·s). What is the order of the reaction in A?`, `जब $[\\mathrm{A}]$ को 0.1 mol/L से बढ़ाकर ${en(0.1 * f)} mol/L किया जाता है, तो प्रारंभिक वेग ${en(r1)} से बदलकर ${en(r2)} mmol/(L·s) हो जाता है। A के सापेक्ष अभिक्रिया की कोटि क्या है?`),
            answer: numM(n, null, [[r2 / r1, L("That is the rate ratio; the order is the exponent: $\\text{ratio} = f^n$.", "यह वेगों का अनुपात है; कोटि घातांक है: $\\text{अनुपात} = f^n$।")], [n === 1 ? 2 : 1, L("Compare how many times the rate changed with how many times the concentration changed.", "तुलना कीजिए कि वेग कितने गुना बदला और सांद्रता कितने गुना बदली।")]]),
            data: { given: [`c_1 = 0.1\\ \\mathrm{mol/L}`, `c_2 = ${en(0.1 * f)}\\ \\mathrm{mol/L}`, `v_1 = ${en(r1)}`, `v_2 = ${en(r2)}`], find: ["n"] },
            hint: L("Find the factor by which the concentration and the rate changed; then solve $\\text{rate factor} = (\\text{conc. factor})^n$.", "ज्ञात कीजिए कि सांद्रता और वेग कितने गुना बदले; फिर $\\text{वेग गुणक} = (\\text{सांद्रता गुणक})^n$ हल कीजिए।"),
            formula: "\\dfrac{v_2}{v_1} = \\left(\\dfrac{c_2}{c_1}\\right)^n",
            solution: `${L("Concentration factor", "सांद्रता गुणक")}: $${en(0.1 * f)}/0.1 = ${f}$\n${L("Rate factor", "वेग गुणक")}: $${en(r2)}/${en(r1)} = ${en(r2 / r1)}$\n$${f}^n = ${en(r2 / r1)} \\Rightarrow n = ${n}$`,
          });
        }
        const th = r.pick([10, 20, 30, 40, 60]), pct = r.pick([10, 20, 25, 40, 60, 75, 90]);
        const k = Math.LN2 / th, t = Math.log(100 / pct) / k;
        return task({
          text: L(`A first-order reaction has a half-life of ${th} min. How long does it take until only ${pct}% of the reactant remains, in minutes?`, `एक प्रथम कोटि अभिक्रिया की अर्धायु ${th} min है। अभिकर्मक का केवल ${pct}% शेष रहने में कितने मिनट लगेंगे?`) + roundToL(1, lang),
          answer: numM(t, 1, [[Math.log(100 / (100 - pct)) / k, L(`That is the time until ${pct}% has reacted.`, `यह ${pct}% अभिकर्मक के अभिक्रिया कर लेने तक का समय है।`)], [th * (100 - pct) / 50, L("First-order decay is exponential: use logarithms.", "प्रथम कोटि में क्षय चरघातांकी होता है: लघुगणक का प्रयोग कीजिए।")]]),
          data: { given: [dq("t_{1/2}", th, "min"), `c/c_0 = ${pct}\\%`], find: ["t"] },
          hint: L("Find $k$ from the half-life, then use $\\ln(c_0/c) = kt$.", "अर्धायु से $k$ ज्ञात कीजिए, फिर $\\ln(c_0/c) = kt$ का प्रयोग कीजिए।"),
          formula: ["k = \\dfrac{\\ln 2}{t_{1/2}}", "t = \\dfrac{1}{k}\\ln\\dfrac{c_0}{c}"],
          solution: `${H("वेग स्थिरांक: ")}$k = 0.693/${th} \\approx ${en(k, 5)}\\ \\text{min}^{-1}$\n$\\ln\\dfrac{100}{${pct}} \\approx ${en(Math.log(100 / pct), 4)}$\n${H("समय: ")}$t = ${en(Math.log(100 / pct), 4)} / ${en(k, 5)} \\approx ${en(t, 1)}\\ \\text{min}$`,
        });
      }
      const v = r.int(0, 2);
      if (v === 0) {
        const Ea = r.pick([40, 50, 60, 75, 80, 100]), T1 = r.pick([290, 298, 300, 310]), dT = r.pick([10, 20, 30, 50]);
        const T2 = T1 + dT, ratio = Math.exp(((Ea * 1000) / 8.314) * (1 / T1 - 1 / T2));
        return task({
          text: L(`A reaction has activation energy ${Ea} kJ/mol. By what factor does the rate constant increase when the temperature rises from ${T1} K to ${T2} K?`, `एक अभिक्रिया की सक्रियण ऊर्जा ${Ea} kJ/mol है। ताप ${T1} K से ${T2} K तक बढ़ने पर वेग स्थिरांक कितने गुना हो जाता है?`) + useR8 + roundToL(2, lang),
          answer: numM(ratio, 2, [[Math.exp((Ea / 8.314) * (1 / T1 - 1 / T2)), L("Convert kJ to J before using $R$ in J/(mol·K).", "J/(mol·K) वाले $R$ का प्रयोग करने से पहले kJ को J में बदलिए।")], [((Ea * 1000) / 8.314) * (1 / T1 - 1 / T2), L("That is $\\ln(k_2/k_1)$; take the exponential.", "यह $\\ln(k_2/k_1)$ है; इसका प्रतिलघुगणक ($e^x$) लीजिए।")]]),
          data: { given: [dq("E_a", Ea, "kJ/mol"), dq("T_1", T1, "K"), dq("T_2", T2, "K"), dq("R", 8.314, "J/(mol\\,K)")], find: ["k_2/k_1"] },
          hint: L("Use the two-temperature form of the Arrhenius equation, with $E_a$ in J/mol.", "आरेनियस समीकरण का दो तापों वाला रूप लीजिए; $E_a$ को J/mol में रखिए।"),
          formula: "\\ln\\dfrac{k_2}{k_1} = \\dfrac{E_a}{R}\\left(\\dfrac{1}{T_1} - \\dfrac{1}{T_2}\\right)",
          solution: `$\\dfrac{1}{T_1} - \\dfrac{1}{T_2} = ${en((1 / T1 - 1 / T2) * 1e5, 3)} \\times 10^{-5}\\ \\text{K}^{-1}$\n${H("आरेनियस समीकरण से: ")}$\\ln\\dfrac{k_2}{k_1} = \\dfrac{${Ea * 1000}}{8.314} \\cdot ${en((1 / T1 - 1 / T2) * 1e5, 3)} \\times 10^{-5} \\approx ${en(Math.log(ratio), 3)}$\n$\\dfrac{k_2}{k_1} = e^{${en(Math.log(ratio), 3)}} \\approx ${en(ratio, 2)}$`,
        });
      }
      if (v === 1) {
        const T1 = r.pick([300, 310, 320]), dT = r.pick([10, 20]), f = r.pick([2, 3, 4]);
        const T2 = T1 + dT, Ea = (8.314 * Math.log(f)) / (1 / T1 - 1 / T2) / 1000;
        return task({
          text: L(`The rate constant of a reaction becomes ${f} times larger when the temperature rises from ${T1} K to ${T2} K. What is the activation energy, in kJ/mol?`, `ताप ${T1} K से ${T2} K तक बढ़ने पर एक अभिक्रिया का वेग स्थिरांक ${f} गुना हो जाता है। सक्रियण ऊर्जा kJ/mol में कितनी है?`) + useR8 + roundToL(1, lang),
          answer: numM(Ea, 1, [[Ea * 1000, L("Convert J/mol to kJ/mol.", "J/mol को kJ/mol में बदलिए।")], [(8.314 * f) / (1 / T1 - 1 / T2) / 1000, L("Use $\\ln f$, not $f$.", "$\\ln f$ लीजिए, $f$ नहीं।")]]),
          data: { given: [`k_2/k_1 = ${f}`, dq("T_1", T1, "K"), dq("T_2", T2, "K"), dq("R", 8.314, "J/(mol\\,K)")], find: ["E_a"] },
          hint: L("Solve the two-temperature Arrhenius equation for $E_a$.", "दो तापों वाले आरेनियस समीकरण को $E_a$ के लिए हल कीजिए।"),
          formula: "E_a = \\dfrac{R \\ln(k_2/k_1)}{1/T_1 - 1/T_2}",
          solution: `$\\ln ${f} \\approx ${en(Math.log(f), 4)}$\n$\\dfrac{1}{T_1} - \\dfrac{1}{T_2} = ${en((1 / T1 - 1 / T2) * 1e5, 3)} \\times 10^{-5}\\ \\text{K}^{-1}$\n${H("सक्रियण ऊर्जा: ")}$E_a = \\dfrac{8.314 \\cdot ${en(Math.log(f), 4)}}{${en((1 / T1 - 1 / T2) * 1e5, 3)} \\times 10^{-5}} \\approx ${en(Ea, 1)}\\ \\text{kJ/mol}$`,
        });
      }
      const m = r.pick([1, 2]), n = r.pick([0, 1, 2]), fa = r.pick([2, 3]), fb = r.pick([2, 3, 4]);
      const F = fa ** m * fb ** n;
      return task({
        text: L(`The rate law is rate $= k[\\mathrm{A}]^{${m}}[\\mathrm{B}]^{${n}}$. By what factor does the rate change if $[\\mathrm{A}]$ is multiplied by ${fa} and $[\\mathrm{B}]$ by ${fb} at the same time?`, `वेग नियम है: वेग $= k[\\mathrm{A}]^{${m}}[\\mathrm{B}]^{${n}}$। यदि एक साथ $[\\mathrm{A}]$ को ${fa} गुना और $[\\mathrm{B}]$ को ${fb} गुना कर दिया जाए, तो वेग कितने गुना हो जाता है?`),
        answer: numM(F, null, [[fa * fb, L("Raise each factor to its order before multiplying.", "गुणा करने से पहले प्रत्येक गुणक पर उसकी कोटि की घात लगाइए।")], [fa ** m + fb ** n, L("Multiply the two effects, do not add them.", "दोनों प्रभावों को गुणा कीजिए, जोड़िए नहीं।")]]),
        data: { given: [`m = ${m}`, `n = ${n}`, `f_A = ${fa}`, `f_B = ${fb}`], find: ["\\text{factor}"] },
        hint: L("Each concentration factor is raised to its own order; then multiply.", "प्रत्येक सांद्रता गुणक पर उसकी अपनी कोटि की घात लगाइए; फिर गुणा कीजिए।"),
        formula: "\\dfrac{v_2}{v_1} = f_A^{\\,m} f_B^{\\,n}",
        solution: `A: $${fa}^{${m}} = ${fa ** m}$\nB: $${fb}^{${n}} = ${fb ** n}$\n${L("Factor", "कुल गुणक")} $= ${fa ** m} \\cdot ${fb ** n} = ${F}$`,
      });
    },
  },
  {
    id: "exk-electro",
    topics: [T("electrochemistry")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang), H = (s) => L("", s);
      const E0 = { Mg: -2.37, Al: -1.66, Zn: -0.76, Fe: -0.44, Ni: -0.25, Sn: -0.14, Pb: -0.13, Cu: 0.34, Ag: 0.8 };
      const ion = (m) => (m === "Ag" ? "+" : m === "Al" ? "3+" : "2+");
      const F = 96500;
      const Fnote = `($F = 96500$ C/mol${L(".)", ")")}`;
      const n2 = L("Two electrons are transferred: $n = 2$.", "दो इलेक्ट्रॉनों का स्थानांतरण होता है: $n = 2$।");
      if (level === 1) {
        const v = r.int(0, 1);
        if (v === 0) {
          const [a, c] = r.shuffle(Object.keys(E0)).slice(0, 2).sort((x, y) => E0[x] - E0[y]);
          const emf = Math.round((E0[c] - E0[a]) * 100) / 100;
          const pots = `$E^\\circ(\\mathrm{${a}^{${ion(a)}}/${a}}) = ${en(E0[a])}$ V ${L("and", "और")} $E^\\circ(\\mathrm{${c}^{${ion(c)}}/${c}}) = ${en(E0[c])}$ V`;
          return task({
            text: L(`Standard reduction potentials: ${pots}. What is the standard emf of the cell made from these two electrodes, in volts?`, `मानक अपचयन विभव: ${pots} हैं। इन दोनों इलेक्ट्रोडों से बने सेल का मानक emf वोल्ट में कितना है?`),
            answer: numM(emf, null, [[Math.round((E0[c] + E0[a]) * 100) / 100, L("Subtract: $E_{cell} = E_{cathode} - E_{anode}$.", "घटाइए: $E_{cell} = E_{cathode} - E_{anode}$।")], [-emf, L("The cathode is the electrode with the more positive potential, so the emf is positive.", "अधिक धनात्मक विभव वाला इलेक्ट्रोड कैथोड होता है, अतः emf धनात्मक है।")]]),
            data: { given: [`E^\\circ_1 = ${en(E0[a])}\\ \\mathrm{V}`, `E^\\circ_2 = ${en(E0[c])}\\ \\mathrm{V}`], find: ["E^\\circ_{cell}"] },
            hint: L("The more positive one is the cathode.", "अधिक धनात्मक विभव वाला इलेक्ट्रोड कैथोड है।"),
            formula: L("E^\\circ_{\\text{cell}} = E^\\circ_{\\text{cathode}} - E^\\circ_{\\text{anode}}", "E^\\circ_{\\text{सेल}} = E^\\circ_{\\text{कैथोड}} - E^\\circ_{\\text{ऐनोड}}"),
            solution: `${L("Cathode", "कैथोड")}: ${c}, ${L("anode", "ऐनोड")}: ${a}\n$E^\\circ = ${en(E0[c])} - (${en(E0[a])}) = ${en(emf)}\\ \\text{V}$`,
          });
        }
        const I = r.pick([0.5, 1, 2, 2.5, 5, 10]), t = r.pick([60, 300, 600, 965, 1930, 3600]);
        return task({
          text: L(`A current of ${en(I)} A flows for ${t} s. How many moles of electrons pass through the circuit? `, `${en(I)} A की विद्युत धारा ${t} s तक प्रवाहित होती है। परिपथ से इलेक्ट्रॉनों के कितने मोल गुजरते हैं? `) + Fnote + roundToL(4, lang),
          answer: numM((I * t) / F, 4, [[I * t, L("That is the charge in coulombs; divide by $F$.", "यह कूलॉम में आवेश है; इसे $F$ से भाग दीजिए।")], [F / (I * t), L("You inverted the ratio: $n = Q/F$.", "आपने अनुपात उलट दिया है: $n = Q/F$।")]]),
          data: { given: [dq("I", I, "A"), dq("t", t, "s"), dq("F", F, "C/mol")], find: ["n(e^-)"] },
          hint: L("Find the charge $Q = It$, then divide by the charge of one mole of electrons.", "आवेश $Q = It$ ज्ञात कीजिए, फिर उसे एक मोल इलेक्ट्रॉनों के आवेश से भाग दीजिए।"),
          formula: ["Q = I t", "n = \\dfrac{Q}{F}"],
          solution: `${H("आवेश: ")}$Q = ${en(I)} \\cdot ${t} = ${en(I * t)}\\ \\text{C}$\n${H("इलेक्ट्रॉनों के मोल: ")}$n = \\dfrac{${en(I * t)}}{96500} \\approx ${en((I * t) / F, 4)}\\ \\text{mol}$`,
        });
      }
      const METALS = [["Cu", 63.5, 2, "CuSO_4"], ["Ag", 108, 1, "AgNO_3"], ["Zn", 65, 2, "ZnSO_4"], ["Ni", 58.7, 2, "NiSO_4"], ["Al", 27, 3, "Al_2O_3 \\text{ melt}"]];
      if (level === 2) {
        const [mt, M, z, salt0] = r.pick(METALS);
        const salt = salt0.replace("\\text{ melt}", L("\\text{ melt}", "\\text{ (गलित)}"));
        const rev = r.next() < 0.4;
        const I = r.pick([0.5, 1, 2, 5, 10]);
        if (!rev) {
          const t = r.pick([965, 1930, 3600, 3860, 7200, 9650]);
          const m = (I * t * M) / (z * F);
          const note = `($M(\\mathrm{${mt}}) = ${en(M)}$ g/mol, $F = 96500$ C/mol, $\\mathrm{${mt}^{${ion(mt)}} + ${z > 1 ? z : ""}e^- \\rightarrow ${mt}}$${L(".)", ")")}`;
          return task({
            text: L(`A current of ${en(I)} A is passed through $\\mathrm{${salt}}$ for ${t} s. What mass of ${mt} is deposited at the cathode, in grams? `, `$\\mathrm{${salt}}$ में ${en(I)} A की धारा ${t} s तक प्रवाहित की जाती है। कैथोड पर ${mt} का कितना द्रव्यमान (ग्राम में) निक्षेपित होता है? `) + note + roundToL(3, lang),
            answer: numM(m, 3, [[z > 1 ? (I * t * M) / F : (I * t * M) / (2 * F), z > 1 ? L(`Each ${mt} ion needs ${z} electrons: divide by ${z}.`, `प्रत्येक ${mt} आयन को ${z} इलेक्ट्रॉन चाहिए: ${z} से भाग दीजिए।`) : L("Silver ions need only one electron each.", "प्रत्येक सिल्वर आयन को केवल एक इलेक्ट्रॉन चाहिए।")], [(I * t) / (z * F), L("That is the amount in moles; multiply by the molar mass.", "यह मोल में मात्रा है; इसे मोलर द्रव्यमान से गुणा कीजिए।")]]),
            data: { given: [dq("I", I, "A"), dq("t", t, "s"), dq("M", M, "g/mol"), `z = ${z}`, dq("F", F, "C/mol")], find: ["m"] },
            hint: L(`Charge $Q = It$; moles of electrons $= Q/F$; ${z} electron${z > 1 ? "s" : ""} per ${mt} atom.`, `आवेश $Q = It$; इलेक्ट्रॉनों के मोल $= Q/F$; प्रति ${mt} परमाणु ${z} इलेक्ट्रॉन।`),
            formula: "m = \\dfrac{I t M}{z F}",
            solution: `${H("आवेश: ")}$Q = ${en(I)} \\cdot ${t} = ${en(I * t)}\\ \\text{C}$\n$n(e^-) = ${en(I * t)}/96500 \\approx ${en((I * t) / F, 5)}$ mol, $n(\\mathrm{${mt}}) = ${en((I * t) / F / z, 5)}$ mol\n${H("द्रव्यमान: ")}$m = ${en((I * t) / F / z, 5)} \\cdot ${en(M)} \\approx ${en(m, 3)}\\ \\text{g}$`,
          });
        }
        const m = r.pick([0.5, 1, 2, 5]);
        const t = (m * z * F) / (M * I) / 60;
        const note = `($M(\\mathrm{${mt}}) = ${en(M)}$ g/mol, $F = 96500$ C/mol, ${L(`${z} electron${z > 1 ? "s" : ""} per atom.)`, `प्रति परमाणु ${z} इलेक्ट्रॉन)`)}`;
        return task({
          text: L(`How long must a current of ${en(I)} A flow through $\\mathrm{${salt}}$ to deposit ${en(m)} g of ${mt}, in minutes? `, `${en(m)} g ${mt} निक्षेपित करने के लिए $\\mathrm{${salt}}$ में ${en(I)} A की धारा कितने मिनट तक प्रवाहित करनी होगी? `) + note + roundToL(1, lang),
          answer: numM(t, 1, [[t * 60, L("That is the time in seconds; convert to minutes.", "यह सेकंड में समय है; इसे मिनट में बदलिए।")], [t / z, L(`Each ${mt} atom needs ${z} electrons: multiply by ${z}.`, `प्रत्येक ${mt} परमाणु के लिए ${z} इलेक्ट्रॉन चाहिए: ${z} से गुणा कीजिए।`)]]),
          data: { given: [dq("I", I, "A"), dq("m", m, "g"), dq("M", M, "g/mol"), `z = ${z}`, dq("F", F, "C/mol")], find: ["t"] },
          hint: L("Moles of metal → moles of electrons → charge → time.", "धातु के मोल → इलेक्ट्रॉनों के मोल → आवेश → समय।"),
          formula: "t = \\dfrac{m z F}{M I}",
          solution: `${H("मोल: ")}$n = ${en(m)}/${en(M)} \\approx ${en(m / M, 5)}$ mol, $n(e^-) = ${z} \\cdot ${en(m / M, 5)} \\approx ${en((z * m) / M, 5)}$ mol\n${H("आवेश: ")}$Q = ${en((z * m) / M, 5)} \\cdot 96500 \\approx ${en((z * m * F) / M, 0)}\\ \\text{C}$\n${H("समय: ")}$t = Q/I \\approx ${en(t * 60, 0)}\\ \\text{s} \\approx ${en(t, 1)}\\ \\text{min}$`,
        });
      }
      const v = r.int(0, 2);
      if (v === 0) {
        const [a, c] = r.shuffle(["Zn", "Fe", "Ni", "Cu", "Mg", "Pb"]).slice(0, 2).sort((x, y) => E0[x] - E0[y]);
        const emf = E0[c] - E0[a], dG = (-2 * F * emf) / 1000;
        return task({
          text: L(`A cell is built from $\\mathrm{${a}^{2+}/${a}}$ ($E^\\circ = ${en(E0[a])}$ V) and $\\mathrm{${c}^{2+}/${c}}$ ($E^\\circ = ${en(E0[c])}$ V). Two electrons are transferred. What is $\\Delta G^\\circ$ of the cell reaction, in kJ/mol? `, `एक सेल $\\mathrm{${a}^{2+}/${a}}$ ($E^\\circ = ${en(E0[a])}$ V) और $\\mathrm{${c}^{2+}/${c}}$ ($E^\\circ = ${en(E0[c])}$ V) से बना है। दो इलेक्ट्रॉनों का स्थानांतरण होता है। सेल अभिक्रिया का $\\Delta G^\\circ$ kJ/mol में कितना है? `) + Fnote + roundToL(1, lang),
          answer: numM(dG, 1, [[-dG, L("A spontaneous cell reaction has a negative $\\Delta G^\\circ$.", "स्वतः होने वाली सेल अभिक्रिया का $\\Delta G^\\circ$ ऋणात्मक होता है।")], [(-F * emf) / 1000, n2], [-2 * F * emf, L("Convert J/mol to kJ/mol.", "J/mol को kJ/mol में बदलिए।")]]),
          data: { given: [`E^\\circ_1 = ${en(E0[a])}\\ \\mathrm{V}`, `E^\\circ_2 = ${en(E0[c])}\\ \\mathrm{V}`, `n = 2`, dq("F", F, "C/mol")], find: ["\\Delta G^\\circ"] },
          hint: L("First find the cell emf, then use $\\Delta G^\\circ = -nFE^\\circ$.", "पहले सेल का emf ज्ञात कीजिए, फिर $\\Delta G^\\circ = -nFE^\\circ$ का प्रयोग कीजिए।"),
          formula: ["E^\\circ_{cell} = E^\\circ_{cathode} - E^\\circ_{anode}", "\\Delta G^\\circ = -n F E^\\circ_{cell}"],
          solution: `${H("सेल का emf: ")}$E^\\circ_{cell} = ${en(E0[c])} - (${en(E0[a])}) = ${en(emf)}\\ \\text{V}$\n$\\Delta G^\\circ = -2 \\cdot 96500 \\cdot ${en(emf)} = ${en(-2 * F * emf)}\\ \\text{J/mol}$\n${H("kJ/mol में: ")}$\\Delta G^\\circ \\approx ${en(dG, 1)}\\ \\text{kJ/mol}$`,
        });
      }
      if (v === 1) {
        const n = r.pick([1, 2]), E = r.pick([0.059, 0.118, 0.177, 0.236, 0.295]);
        const lgK = (n * E) / 0.059;
        return task({
          text: L(`A cell reaction at 25 °C transfers ${n} electron${n > 1 ? "s" : ""} and has $E^\\circ_{\\text{cell}} = ${en(E)}$ V. What is $\\log_{10} K$ for the reaction? (Use $E^\\circ = \\dfrac{0.059}{n}\\log K$.)`, `25 °C पर एक सेल अभिक्रिया में ${n} इलेक्ट्रॉन ${n > 1 ? "स्थानांतरित होते हैं" : "स्थानांतरित होता है"} और $E^\\circ_{\\text{cell}} = ${en(E)}$ V है। अभिक्रिया के लिए $\\log_{10} K$ का मान कितना है? ($E^\\circ = \\dfrac{0.059}{n}\\log K$ लीजिए।)`),
          answer: numM(Math.round(lgK * 1000) / 1000, null, [[E / (0.059 * n), L("Multiply by $n$: $\\log K = nE^\\circ/0.059$.", "$n$ से गुणा कीजिए: $\\log K = nE^\\circ/0.059$।")], [10 ** lgK, L("The question asks for $\\log K$, not $K$.", "प्रश्न में $\\log K$ पूछा गया है, $K$ नहीं।")]]),
          data: { given: [`n = ${n}`, `E^\\circ = ${en(E)}\\ \\mathrm{V}`], find: ["\\log K"] },
          hint: L("Rearrange the given equation for $\\log K$.", "दिए गए समीकरण को $\\log K$ के लिए पुनर्व्यवस्थित कीजिए।"),
          formula: "\\log K = \\dfrac{n E^\\circ}{0.059}",
          solution: `${H("पुनर्व्यवस्थित करने पर: ")}$\\log K = \\dfrac{${n} \\cdot ${en(E)}}{0.059}$\n$\\log K = ${en(lgK, 3)}$`,
        });
      }
      const [a, c] = [["Zn", "Cu"], ["Fe", "Cu"], ["Zn", "Ni"], ["Mg", "Zn"]][r.int(0, 3)];
      const ca = r.pick([0.01, 0.1, 1, 2]), cc = r.pick([0.001, 0.01, 0.1, 1]);
      if (ca === cc) return null;
      const E0c = E0[c] - E0[a], E = E0c - (0.059 / 2) * Math.log10(ca / cc);
      return task({
        text: L(`For the cell $\\mathrm{${a} | ${a}^{2+}(${en(ca)}\\ M) || ${c}^{2+}(${en(cc)}\\ M) | ${c}}$, $E^\\circ_{\\text{cell}} = ${en(E0c)}$ V. What is the cell emf at 25 °C, in volts? (Use $E = E^\\circ - \\dfrac{0.059}{n}\\log Q$.)`, `सेल $\\mathrm{${a} | ${a}^{2+}(${en(ca)}\\ M) || ${c}^{2+}(${en(cc)}\\ M) | ${c}}$ के लिए $E^\\circ_{\\text{cell}} = ${en(E0c)}$ V है। 25 °C पर सेल का emf वोल्ट में कितना है? ($E = E^\\circ - \\dfrac{0.059}{n}\\log Q$ लीजिए।)`) + roundToL(3, lang),
        answer: numM(E, 3, [[E0c - (0.059 / 2) * Math.log10(cc / ca), L("$Q = [\\text{product ion}]/[\\text{reactant ion}] = [\\mathrm{" + a + "^{2+}}]/[\\mathrm{" + c + "^{2+}}]$.", "$Q = [\\text{उत्पाद आयन}]/[\\text{अभिकर्मक आयन}] = [\\mathrm{" + a + "^{2+}}]/[\\mathrm{" + c + "^{2+}}]$।")], [E0c - 0.059 * Math.log10(ca / cc), n2]]),
        data: { given: [`E^\\circ = ${en(E0c)}\\ \\mathrm{V}`, `[\\mathrm{${a}^{2+}}] = ${en(ca)}\\ \\mathrm{M}`, `[\\mathrm{${c}^{2+}}] = ${en(cc)}\\ \\mathrm{M}`], find: ["E"] },
        hint: L(`Write $Q$ for $\\mathrm{${a} + ${c}^{2+} \\rightarrow ${a}^{2+} + ${c}}$ and use the Nernst equation with $n = 2$.`, `अभिक्रिया $\\mathrm{${a} + ${c}^{2+} \\rightarrow ${a}^{2+} + ${c}}$ के लिए $Q$ लिखिए और $n = 2$ लेकर नेर्न्स्ट समीकरण का प्रयोग कीजिए।`),
        formula: "E = E^\\circ - \\dfrac{0.059}{n}\\log Q",
        solution: `${H("अभिक्रिया भागफल: ")}$Q = \\dfrac{[\\mathrm{${a}^{2+}}]}{[\\mathrm{${c}^{2+}}]} = \\dfrac{${en(ca)}}{${en(cc)}} = ${en(ca / cc)}$\n$\\log Q = ${en(Math.log10(ca / cc), 3)}$\n${H("नेर्न्स्ट समीकरण से: ")}$E = ${en(E0c)} - 0.0295 \\cdot ${en(Math.log10(ca / cc), 3)} \\approx ${en(E, 3)}\\ \\text{V}$`,
      });
    },
  },
  {
    id: "exk-atom",
    topics: [T("atomic-structure")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang), H = (s) => L("", s);
      const EL = [["C", 6, 12], ["N", 7, 14], ["O", 8, 16], ["F", 9, 19], ["Na", 11, 23], ["Mg", 12, 24], ["Al", 13, 27], ["P", 15, 31], ["S", 16, 32], ["Cl", 17, 35], ["K", 19, 39], ["Ca", 20, 40], ["Fe", 26, 56], ["Cu", 29, 64], ["Zn", 30, 65], ["Br", 35, 80], ["Ag", 47, 108], ["I", 53, 127]];
      const [s, Z, A] = r.pick(EL);
      const En = L(" (Use $E_n = -\\dfrac{13.6}{n^2}$ eV.)", " ($E_n = -\\dfrac{13.6}{n^2}$ eV लीजिए।)");
      if (level === 1) {
        const v = r.int(0, 1);
        if (v === 0) {
          return task({
            text: L(`How many neutrons are there in one atom of $^{${A}}_{${Z}}\\mathrm{${s}}$?`, `$^{${A}}_{${Z}}\\mathrm{${s}}$ के एक परमाणु में कितने न्यूट्रॉन हैं?`),
            answer: numM(A - Z, null, [[A, L("The mass number counts protons and neutrons together.", "द्रव्यमान संख्या में प्रोटॉन और न्यूट्रॉन दोनों गिने जाते हैं।")], [A + Z, L("Subtract the atomic number from the mass number.", "द्रव्यमान संख्या में से परमाणु क्रमांक घटाइए।")]]),
            data: { given: [`A = ${A}`, `Z = ${Z}`], find: ["N"] },
            hint: L("Mass number = protons + neutrons.", "द्रव्यमान संख्या = प्रोटॉन + न्यूट्रॉन।"),
            formula: "N = A - Z",
            solution: `${H("न्यूट्रॉनों की संख्या: ")}$N = A - Z$\n$N = ${A} - ${Z} = ${A - Z}$`,
          });
        }
        return task({
          text: L(`An atom of ${s} has ${Z} protons and ${A - Z} neutrons. What is its mass number?`, `${s} के एक परमाणु में ${Z} प्रोटॉन और ${A - Z} न्यूट्रॉन हैं। इसकी द्रव्यमान संख्या कितनी है?`),
          answer: numM(A, null, [[A - 2 * Z, L("Add the protons and neutrons; do not subtract.", "प्रोटॉन और न्यूट्रॉन जोड़िए; घटाइए नहीं।")], [Z, L("That is the atomic number (protons only).", "यह परमाणु क्रमांक है (केवल प्रोटॉन)।")]]),
          data: { given: [`Z = ${Z}`, `N = ${A - Z}`], find: ["A"] },
          hint: L("Mass number counts all nucleons.", "द्रव्यमान संख्या सभी न्यूक्लिऑनों की संख्या है।"),
          formula: "A = Z + N",
          solution: `${H("द्रव्यमान संख्या: ")}$A = Z + N$\n$A = ${Z} + ${A - Z} = ${A}$`,
        });
      }
      if (level === 2) {
        const v = r.int(0, 2);
        if (v === 0) {
          // Samo ioni, ki jih element res tvori (ne Mg³⁻, Br²⁺ …).
          const [s, Z, charge] = r.pick([["N", 7, -3], ["O", 8, -2], ["F", 9, -1], ["Na", 11, 1], ["Mg", 12, 2], ["Al", 13, 3], ["P", 15, -3], ["S", 16, -2], ["Cl", 17, -1], ["K", 19, 1], ["Ca", 20, 2], ["Fe", 26, 2], ["Fe", 26, 3], ["Cu", 29, 1], ["Cu", 29, 2], ["Zn", 30, 2], ["Br", 35, -1], ["Ag", 47, 1], ["I", 53, -1]]);
          const sym = charge > 0 ? `${charge === 1 ? "" : charge}+` : `${charge === -1 ? "" : -charge}-`;
          return task({
            text: L(`How many electrons does the ion $\\mathrm{${s}^{${sym}}}$ have? (Atomic number of ${s}: ${Z}.)`, `आयन $\\mathrm{${s}^{${sym}}}$ में कितने इलेक्ट्रॉन हैं? (${s} का परमाणु क्रमांक: ${Z})`),
            answer: numM(Z - charge, null, [[Z + charge, L("A positive ion has LOST electrons; a negative ion has GAINED them.", "धनायन इलेक्ट्रॉन खोता है; ऋणायन इलेक्ट्रॉन ग्रहण करता है।")], [Z, L("An ion has a different number of electrons than the neutral atom.", "आयन में उदासीन परमाणु से भिन्न संख्या में इलेक्ट्रॉन होते हैं।")]]),
            data: { given: [`Z = ${Z}`], find: ["n(e^-)"] },
            hint: L("Start from the neutral atom ($Z$ electrons), then remove or add electrons for the charge.", "उदासीन परमाणु ($Z$ इलेक्ट्रॉन) से शुरू कीजिए, फिर आवेश के अनुसार इलेक्ट्रॉन घटाइए या जोड़िए।"),
            formula: "n(e^-) = Z - q",
            solution: L(
              `Neutral ${s}: ${Z} electrons\nCharge ${charge > 0 ? "+" : ""}${charge}: ${charge > 0 ? `lost ${charge}` : `gained ${-charge}`}\n$${Z} ${charge > 0 ? "-" : "+"} ${Math.abs(charge)} = ${Z - charge}$ electrons`,
              `उदासीन ${s}: ${Z} इलेक्ट्रॉन\nआवेश ${charge > 0 ? "+" : ""}${charge}: ${charge > 0 ? `${charge} इलेक्ट्रॉन खोए` : `${-charge} इलेक्ट्रॉन ग्रहण किए`}\n$${Z} ${charge > 0 ? "-" : "+"} ${Math.abs(charge)} = ${Z - charge}$ इलेक्ट्रॉन`,
            ),
          });
        }
        if (v === 1) {
          const [el, m1, m2, p1] = r.pick([["Cl", 35, 37, 75], ["B", 10, 11, 20], ["Cu", 63, 65, 69], ["Li", 6, 7, 7.5], ["Br", 79, 81, 50.7], ["Ga", 69, 71, 60]]);
          const avg = (m1 * p1 + m2 * (100 - p1)) / 100;
          return task({
            text: L(`Element ${el} has two isotopes: ${el}-${m1} (${en(p1)}%) and ${el}-${m2} (${en(100 - p1)}%). Taking each isotope's mass as its mass number, what is the average atomic mass?`, `तत्व ${el} के दो समस्थानिक हैं: ${el}-${m1} (${en(p1)}%) और ${el}-${m2} (${en(100 - p1)}%)। प्रत्येक समस्थानिक का द्रव्यमान उसकी द्रव्यमान संख्या के बराबर मानकर औसत परमाणु द्रव्यमान ज्ञात कीजिए।`) + roundToL(2, lang),
            answer: numM(avg, 2, [[(m1 + m2) / 2, L("Weight each isotope by its abundance; a plain average ignores the percentages.", "प्रत्येक समस्थानिक को उसकी प्रतिशत बाहुल्यता के अनुसार भार दीजिए; साधारण औसत प्रतिशतों को अनदेखा करता है।")], [(m1 * (100 - p1) + m2 * p1) / 100, L("You swapped the abundances of the two isotopes.", "आपने दोनों समस्थानिकों की बाहुल्यता आपस में बदल दी है।")]]),
            data: { given: [`m_1 = ${m1}`, `w_1 = ${en(p1)}\\%`, `m_2 = ${m2}`, `w_2 = ${en(100 - p1)}\\%`], find: ["\\bar A"] },
            hint: L("Multiply each mass by its fraction and add.", "प्रत्येक द्रव्यमान को उसके अंश से गुणा करके जोड़िए।"),
            formula: "\\bar A = w_1 m_1 + w_2 m_2",
            solution: `${H("भारित औसत: ")}$\\bar A = ${en(p1 / 100)} \\cdot ${m1} + ${en((100 - p1) / 100)} \\cdot ${m2}$\n$= ${en((m1 * p1) / 100)} + ${en((m2 * (100 - p1)) / 100)}$\n$\\bar A \\approx ${en(avg, 2)}$`,
          });
        }
        const n = r.int(1, 5), ask = r.pick(["e", "orb"]);
        return task({
          text: L(`What is the maximum number of ${ask === "e" ? "electrons" : "orbitals"} in the shell with principal quantum number $n = ${n}$?`, `मुख्य क्वांटम संख्या $n = ${n}$ वाले कोश में अधिकतम कितने ${ask === "e" ? "इलेक्ट्रॉन" : "कक्षक"} हो सकते हैं?`),
          answer: numM(ask === "e" ? 2 * n * n : n * n, null, ask === "e" ? [[n * n, L("That is the number of orbitals; each holds 2 electrons.", "यह कक्षकों की संख्या है; प्रत्येक कक्षक में 2 इलेक्ट्रॉन होते हैं।")], [2 * n, L("The formula is $2n^2$, not $2n$.", "सूत्र $2n^2$ है, $2n$ नहीं।")]] : [[2 * n * n, L("That is the number of electrons; each orbital holds 2.", "यह इलेक्ट्रॉनों की संख्या है; प्रत्येक कक्षक में 2 इलेक्ट्रॉन होते हैं।")], [2 * n - 1, L("That is the number of orbitals in one subshell ($2l + 1$), not the whole shell.", "यह एक उपकोश के कक्षकों की संख्या ($2l + 1$) है, पूरे कोश की नहीं।")]]),
          data: { given: [`n = ${n}`], find: [ask === "e" ? "N_e" : "N_{orb}"] },
          hint: L("The shell has subshells $l = 0, 1, \\ldots, n-1$, each with $2l + 1$ orbitals.", "कोश में उपकोश $l = 0, 1, \\ldots, n-1$ होते हैं; प्रत्येक उपकोश में $2l + 1$ कक्षक होते हैं।"),
          formula: ask === "e" ? "N_e = 2n^2" : "N_{orb} = n^2",
          solution: `${L("Orbitals", "कक्षक")}: $1 + 3 + \\ldots + (2n - 1) = n^2 = ${n * n}$\n${ask === "e" ? `${L("Two electrons per orbital", "प्रति कक्षक दो इलेक्ट्रॉन")}: $2n^2 = ${2 * n * n}$` : `${L("Answer", "उत्तर")}: $${n * n}$`}`,
        });
      }
      const v = r.int(0, 2);
      if (v === 0) {
        const n1 = r.pick([1, 2, 3]), n2 = n1 + r.int(1, 3);
        const E = 13.6 * (1 / (n1 * n1) - 1 / (n2 * n2)), lam = 1240 / E;
        const askL = r.next() < 0.5;
        return task({
          text: L(`The electron in a hydrogen atom falls from level $n = ${n2}$ to $n = ${n1}$. ${askL ? "What is the wavelength of the emitted photon, in nm? (Use $hc = 1240$ eV·nm.)" : "What energy is emitted, in eV?"}`, `हाइड्रोजन परमाणु का इलेक्ट्रॉन स्तर $n = ${n2}$ से स्तर $n = ${n1}$ पर आता है। ${askL ? "उत्सर्जित फोटॉन की तरंगदैर्ध्य nm में कितनी है? ($hc = 1240$ eV·nm लीजिए।)" : "कितनी ऊर्जा (eV में) उत्सर्जित होती है?"}`) + En + roundToL(askL ? 0 : 2, lang),
          answer: askL
            ? numM(lam, 0, [[1240 / (13.6 / (n1 * n1)), L("Use the difference between the two levels, not one level.", "दोनों स्तरों की ऊर्जाओं का अंतर लीजिए, केवल एक स्तर की ऊर्जा नहीं।")], [1240 / (13.6 * (1 / n1 - 1 / n2)), L("Square the quantum numbers.", "क्वांटम संख्याओं का वर्ग कीजिए।")]])
            : numM(E, 2, [[13.6 / (n1 * n1), L("That is the energy of one level; you need the difference.", "यह एक स्तर की ऊर्जा है; आपको दोनों का अंतर चाहिए।")], [13.6 * (1 / n1 - 1 / n2), L("Square the quantum numbers: $E_n \\propto 1/n^2$.", "क्वांटम संख्याओं का वर्ग कीजिए: $E_n \\propto 1/n^2$।")]]),
          data: { given: [`n_i = ${n2}`, `n_f = ${n1}`, ...(askL ? ["hc = 1240\\ \\mathrm{eV\\,nm}"] : [])], find: [askL ? "\\lambda" : "\\Delta E"] },
          hint: L("$\\Delta E = 13.6\\left(\\dfrac{1}{n_f^2} - \\dfrac{1}{n_i^2}\\right)$ eV" + (askL ? ", then $\\lambda = hc/\\Delta E$." : "."), "ऊर्जा का अंतर $\\Delta E = 13.6\\left(\\dfrac{1}{n_f^2} - \\dfrac{1}{n_i^2}\\right)$ eV" + (askL ? ", फिर $\\lambda = hc/\\Delta E$।" : "।")),
          formula: askL ? ["\\Delta E = 13.6\\left(\\dfrac{1}{n_f^2} - \\dfrac{1}{n_i^2}\\right)", "\\lambda = \\dfrac{hc}{\\Delta E}"] : "E_n = -\\dfrac{13.6\\ \\text{eV}}{n^2}",
          solution: `${H("स्तरों की ऊर्जाएँ: ")}$E_{${n2}} = -13.6/${n2 * n2} \\approx ${en(-13.6 / (n2 * n2), 3)}$ eV, $E_{${n1}} = ${en(-13.6 / (n1 * n1), 3)}$ eV\n${H("ऊर्जा का अंतर: ")}$\\Delta E \\approx ${en(E, 3)}\\ \\text{eV}$${askL ? `\n${H("तरंगदैर्ध्य: ")}$\\lambda = 1240/${en(E, 3)} \\approx ${en(lam, 0)}\\ \\text{nm}$` : ""}`,
        });
      }
      if (v === 1) {
        const n = r.int(2, 5);
        const Ei = 13.6 / (n * n);
        return task({
          text: L(`How much energy, in eV, is needed to ionize a hydrogen atom whose electron is in the level $n = ${n}$?`, `जिस हाइड्रोजन परमाणु का इलेक्ट्रॉन स्तर $n = ${n}$ पर है, उसे आयनित करने के लिए कितनी ऊर्जा (eV में) चाहिए?`) + En + roundToL(2, lang),
          answer: numM(Ei, 2, [[13.6, L("That is the ionization energy from the ground state ($n = 1$).", "यह निम्नतम अवस्था ($n = 1$) से आयनन ऊर्जा है।")], [13.6 / n, L("Square the quantum number.", "क्वांटम संख्या का वर्ग कीजिए।")], [13.6 - Ei, L("Ionization takes the electron from $E_n$ to 0, not to $n = 1$.", "आयनन में इलेक्ट्रॉन $E_n$ से 0 तक जाता है, $n = 1$ तक नहीं।")]]),
          data: { given: [`n = ${n}`], find: ["E_{ion}"] },
          hint: L("Ionization means raising the electron from $E_n$ to $E_\\infty = 0$.", "आयनन का अर्थ है इलेक्ट्रॉन को $E_n$ से $E_\\infty = 0$ तक ले जाना।"),
          formula: "E_{ion} = 0 - E_n = \\dfrac{13.6}{n^2}\\ \\text{eV}",
          solution: `${H("स्तर की ऊर्जा: ")}$E_{${n}} = -\\dfrac{13.6}{${n * n}} \\approx ${en(-Ei, 2)}\\ \\text{eV}$\n${H("आयनन ऊर्जा: ")}$E_{ion} = 0 - E_{${n}} \\approx ${en(Ei, 2)}\\ \\text{eV}$`,
        });
      }
      const [el, m1, m2, avg] = r.pick([["Cl", 35, 37, 35.5], ["Cu", 63, 65, 63.55], ["B", 10, 11, 10.8], ["Br", 79, 81, 79.9], ["Ga", 69, 71, 69.8], ["Rb", 85, 87, 85.5]]);
      const x = ((m2 - avg) / (m2 - m1)) * 100;
      return task({
        text: L(`Element ${el} has two isotopes, ${el}-${m1} and ${el}-${m2}, and an average atomic mass of ${en(avg)}. Taking each isotope's mass as its mass number, what is the percentage abundance of ${el}-${m1}?`, `तत्व ${el} के दो समस्थानिक ${el}-${m1} और ${el}-${m2} हैं, और इसका औसत परमाणु द्रव्यमान ${en(avg)} है। प्रत्येक समस्थानिक का द्रव्यमान उसकी द्रव्यमान संख्या के बराबर मानकर ${el}-${m1} की प्रतिशत बाहुल्यता ज्ञात कीजिए।`) + roundToL(1, lang),
        answer: numM(x, 1, [[100 - x, L(`That is the abundance of ${el}-${m2}.`, `यह ${el}-${m2} की बाहुल्यता है।`)], [50, L("The isotopes are not equally abundant: the average is closer to the more common one.", "दोनों समस्थानिकों की बाहुल्यता बराबर नहीं है: औसत अधिक बहुल समस्थानिक के निकट होता है।")]]),
        data: { given: [`m_1 = ${m1}`, `m_2 = ${m2}`, `\\bar A = ${en(avg)}`], find: ["w_1"] },
        hint: L("Let the fraction of the lighter isotope be $x$; then $x m_1 + (1 - x) m_2 = \\bar A$.", "हल्के समस्थानिक का अंश $x$ मानिए; तब $x m_1 + (1 - x) m_2 = \\bar A$।"),
        formula: "x m_1 + (1 - x) m_2 = \\bar A",
        solution: `${H("भारित औसत से: ")}$${m1}x + ${m2}(1 - x) = ${en(avg)}$\n$x = \\dfrac{${m2} - ${en(avg)}}{${m2} - ${m1}} = ${en((m2 - avg) / (m2 - m1), 4)}$\n${H("प्रतिशत बाहुल्यता: ")}$w_1 \\approx ${en(x, 1)}\\%$`,
      });
    },
  },
];
