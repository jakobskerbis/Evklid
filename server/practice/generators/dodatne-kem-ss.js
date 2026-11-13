// Generatorji za teme, ki prej niso imele nalog (kem-ss). Merila: docs/kakovost.md §2.
// Kemija v gimnaziji, 1.–4. letnik: vezi, medmolekulske sile, plini, energija, hitrost, ravnotežje,
// kisline in baze, titracija, redoks, elektrokemija, organska kemija, ponovitev in kemijsko računanje.
import { NAMES, g } from "../rng.js";
import { roundHalfUp } from "../check.js";
import { tx } from "./mat.js";

// ---------- pomožne funkcije ----------
// Količina z enoto za TeX (brez $): qty("2{,}5", "kg") → "2{,}5\ \mathrm{kg}".
const qty = (val, unit) => (unit === "°C" ? `${val}\\ {}^\\circ\\mathrm{C}` : `${val}\\ ${unit.startsWith("\\") ? unit : `\\mathrm{${unit}}`}`);
const dat = (sym, val, unit) => (unit ? `${sym} = ${qty(val, unit)}` : `${sym} = ${val}`);
const needsRounding = (x, d) => d != null && Math.abs(x - roundHalfUp(x, d)) > 1e-9;
const res = (x, d, unit) => `${needsRounding(x, d) ? "\\approx" : "="} ${unit ? qty(tx(x, d), unit) : tx(x, d)}`;
const T = (s) => `\\text{${s}}`;
const ROUND = ["na celo število", "na eno decimalko", "na dve decimalki", "na tri decimalke", "na štiri decimalke"];
const zaokr = (d) => `Zaokroži ${ROUND[d]}.`;
const R_GAS = 8.314;
const VM = 22.4;
const F_CONST = 96500;
const VM_TXT = "$V_m = 22{,}4\\ \\mathrm{L/mol}$";
const VM_DAT = "V_m = 22{,}4\\ \\mathrm{L/mol}";
const R_TXT = "$R = 8{,}314\\ \\mathrm{J/(mol\\cdot K)}$";
const R_DAT = "R = 8{,}314\\ \\mathrm{J/(mol\\cdot K)}";
const log10 = Math.log10;

const SUP = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻", "+": "⁺" };
const SUB = { "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉" };
const sup = (x) => [...x].map((c) => SUP[c] ?? c).join("");
const sub = (x) => [...x].map((c) => SUB[c] ?? c).join("");
// Zvrst: "SO4^2-" → TeX "\mathrm{SO_{4}^{2-}}" oz. Unicode "SO₄²⁻".
function sp(s) {
  const [body, q] = s.split("^");
  return `\\mathrm{${body.replace(/([A-Za-z)])(\d+)/g, "$1_{$2}")}${q ? `^{${q}}` : ""}}`;
}
function spU(s) {
  const [body, q] = s.split("^");
  return body.replace(/([A-Za-z)])(\d+)/g, (_, a, d) => a + sub(d)) + (q ? sup(q) : "");
}
// Racionalna (strukturna) formula organske spojine: "-" enojna, "=" dvojna, "#" trojna vez.
const org = (s) =>
  `\\mathrm{${s.replace(/([A-Za-z)])(\d+)/g, "$1_{$2}").replace(/-/g, "{-}").replace(/=/g, "{=}").replace(/#/g, "{\\equiv}")}}`;
const orgU = (s) => s.replace(/([A-Za-z)])(\d+)/g, (_, a, d) => a + sub(d)).replace(/-/g, "–").replace(/#/g, "≡");
// Enačba: "2H2(g) + O2(g) -> 2H2O(l)" → TeX.
function eqTex(s) {
  return s
    .split(" ")
    .map((tok) => {
      if (tok === "+") return "+";
      if (tok === "->") return "\\rightarrow";
      if (tok === "<=>") return "\\rightleftharpoons";
      const m = tok.match(/^(\d*)(.+?)(\((?:g|l|s|aq)\))?$/);
      return `${m[1] ? `${m[1]}\\,` : ""}${sp(m[2])}${m[3] ? `\\,\\mathrm{${m[3]}}` : ""}`;
    })
    .join(" ");
}
const eqU = (s) => s.split(" ").map((t) => (t === "->" ? "→" : t === "<=>" ? "⇌" : t === "+" ? "+" : t.replace(/^(\d*)(.+?)(\((?:g|l|s|aq)\))?$/, (_, c, f, st) => c + spU(f) + (st || "")))).join(" ");

// Razlage in izbirne možnosti so navadno besedilo (brez KaTeX).
function plain(s) {
  if (s == null) return s;
  return String(s)
    .replace(/\$/g, "")
    .replace(/\\[ ,]/g, " ")
    .replace(/\\dfrac\{([^{}]*)\}\{([^{}]*)\}/g, "$1/$2")
    .replace(/\{,\}/g, ",")
    .replace(/\\cdot/g, "·")
    .replace(/\\Delta /g, "Δ")
    .replace(/\\rightarrow/g, "→")
    .replace(/\\mathrm\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, (_, x) => x.replace(/_\{(\d+)\}/g, (__, d) => sub(d)).replace(/\^\{([-+0-9]+)\}/g, (__, q) => sup(q)).replace(/\{-\}/g, "–").replace(/\{=\}/g, "=").replace(/\{\\equiv\}/g, "≡"))
    .replace(/\\text\{([^{}]*)\}/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

// Številski odgovor; tipične napake, ki bi se po zaokrožitvi ujemale s pravilnim rezultatom, izpustimo.
function num(value, unit, decimals, mistakes = [], extra = {}) {
  const d = decimals ?? null;
  const same = (a) => (d == null ? Math.abs(a - value) <= 1e-9 * Math.max(1, Math.abs(value)) : Math.abs(roundHalfUp(a, d) - roundHalfUp(value, d)) < 1e-9);
  const seen = new Set();
  const ms = [];
  for (const [mv, why] of mistakes) {
    if (!Number.isFinite(mv) || same(mv)) continue;
    const key = roundHalfUp(mv, 6);
    if (seen.has(key)) continue;
    seen.add(key);
    ms.push({ value: mv, why: plain(why) });
  }
  const a = { type: "number", value, decimals: d };
  if (unit) a.unit = unit;
  if (ms.length) a.mistakes = ms.slice(0, 3);
  return Object.assign(a, extra);
}
const U_CONC = { unitAlternatives: ["mol/l", "M", "mol/dm3", "mol/dm³"] };
const U_GMOL = { unitAlternatives: ["g/mol", "gmol-1"] };

// Izbirni odgovor: pravilna možnost + [besedilo, zakaj je napačno]; po mešanju poravnamo answer.why.
function mc(r, correct, wrongs) {
  const all = r.shuffle([[correct, null], ...wrongs.slice(0, 3)]);
  return { type: "choice", options: all.map((o) => plain(o[0])), index: all.findIndex((o) => o[1] === null), why: all.map((o) => (o[1] == null ? null : plain(o[1]))) };
}
// Sestavi nalogo: besedilo, odgovor, namig, podatki, iskano, formula (lahko null), koraki rešitve.
// given = null: naloga nima pravih podatkov (konceptualno vprašanje) → data: false.
function mk(text, answer, hint, given, find, formula, sol, extra = {}) {
  const t = { text, answer, hint, data: given ? { given, find } : false, solution: [].concat(sol).join("\n"), ...extra };
  if (formula || formula === false) t.formula = formula;
  return t;
}
// Konceptualno vprašanje iz zapisa { q, ok, wrong: [[možnost, zakaj]], hint, given, find, sol }.
const concept = (r, c) => mk(c.q, mc(r, c.ok, c.wrong), c.hint, c.given, c.find, c.formula || null, c.sol);
const nm = (r) => r.pick(NAMES);

// Sestava formule (z oklepaji): parseFormula("Ca(OH)2") → { Ca: 1, O: 2, H: 2 }.
function parseFormula(f) {
  const stack = [{}];
  const re = /([A-Z][a-z]?|\(|\))(\d*)/g;
  let m;
  while ((m = re.exec(f))) {
    const [, tok, dd] = m;
    const k = dd ? Number(dd) : 1;
    if (tok === "(") stack.push({});
    else if (tok === ")") {
      const grp0 = stack.pop();
      const top = stack.at(-1);
      for (const [e, c] of Object.entries(grp0)) top[e] = (top[e] || 0) + c * k;
    } else {
      const top = stack.at(-1);
      top[tok] = (top[tok] || 0) + k;
    }
  }
  return stack[0];
}

// =====================================================================
// KEM-SS-1
// =====================================================================

// ---------- kemijske vezi ----------
const EN = { H: 2.1, Li: 1.0, Be: 1.5, B: 2.0, C: 2.5, N: 3.0, O: 3.5, F: 4.0, Na: 0.9, Mg: 1.2, Al: 1.5, Si: 1.8, P: 2.1, S: 2.5, Cl: 3.0, K: 0.8, Ca: 1.0, Br: 2.8, I: 2.5 };
const EL_GEN = { H: "vodika", Li: "litija", C: "ogljika", N: "dušika", O: "kisika", F: "fluora", Na: "natrija", Mg: "magnezija", Al: "aluminija", P: "fosforja", S: "žvepla", Cl: "klora", K: "kalija", Ca: "kalcija", Br: "broma" };
// [formula, element A, število A, element B, število B]
const BONDS = [
  ["HCl", "H", 1, "Cl", 1], ["H2O", "H", 2, "O", 1], ["NH3", "N", 1, "H", 3], ["NaCl", "Na", 1, "Cl", 1], ["KBr", "K", 1, "Br", 1],
  ["CaO", "Ca", 1, "O", 1], ["MgO", "Mg", 1, "O", 1], ["NaF", "Na", 1, "F", 1], ["KCl", "K", 1, "Cl", 1], ["LiF", "Li", 1, "F", 1],
  ["CaCl2", "Ca", 1, "Cl", 2], ["CO2", "C", 1, "O", 2], ["CS2", "C", 1, "S", 2], ["SO2", "S", 1, "O", 2], ["NCl3", "N", 1, "Cl", 3],
  ["HBr", "H", 1, "Br", 1], ["BrCl", "Br", 1, "Cl", 1], ["CO", "C", 1, "O", 1], ["Li2O", "Li", 2, "O", 1], ["Na2O", "Na", 2, "O", 1],
  ["CaF2", "Ca", 1, "F", 2], ["PH3", "P", 1, "H", 3], ["K2O", "K", 2, "O", 1], ["Cl2", "Cl", 1, "Cl", 1], ["O2", "O", 1, "O", 1], ["N2", "N", 1, "N", 1],
];
const dEN = (b) => roundHalfUp(Math.abs(EN[b[1]] - EN[b[3]]), 1);
const bondKind = (d) => (d < 0.4 ? "nepolarna kovalentna" : d <= 1.7 ? "polarna kovalentna" : "ionska");
const EN_RULE = "\\Delta EN < 0{,}4:\\ \\text{nepolarna};\\ 0{,}4 \\le \\Delta EN \\le 1{,}7:\\ \\text{polarna};\\ \\Delta EN > 1{,}7:\\ \\text{ionska}";
const METALS = [["bakreni žici", "baker"], ["železnem žeblju", "železo"], ["aluminijasti foliji", "aluminij"], ["kosu natrija", "natrij"], ["magnezijevem traku", "magnezij"], ["srebrni verižici", "srebro"], ["cinkovi ploščici", "cink"], ["zlatem prstanu", "zlato"]];
// Lewisove formule: [formula, zgradba, valenčni e⁻, vezni pari, nevezni pari, nevezni na osrednjem atomu (null = ni osrednjega), število črt med atomi]
const LEWIS = [
  ["H2O", "H–O–H", 8, 2, 2, 2, 2], ["NH3", "NH₃ (trije N–H)", 8, 3, 1, 1, 3], ["CH4", "CH₄ (štiri C–H)", 8, 4, 0, 0, 4], ["CO2", "O=C=O", 16, 4, 4, 0, 2],
  ["N2", "N≡N", 10, 3, 2, null, 1], ["O2", "O=O", 12, 2, 4, null, 1], ["HCN", "H–C≡N", 10, 4, 1, 0, 2], ["Cl2", "Cl–Cl", 14, 1, 6, null, 1],
  ["HCl", "H–Cl", 8, 1, 3, null, 1], ["PCl3", "PCl₃ (trije P–Cl)", 26, 3, 10, 1, 3], ["CCl4", "CCl₄ (štiri C–Cl)", 32, 4, 12, 0, 4], ["H2S", "H–S–H", 8, 2, 2, 2, 2],
  ["C2H4", "H₂C=CH₂", 12, 6, 0, 0, 5], ["C2H2", "H–C≡C–H", 10, 5, 0, 0, 3], ["NF3", "NF₃ (trije N–F)", 26, 3, 10, 1, 3], ["OF2", "F–O–F", 20, 2, 8, 2, 2], ["CH2O", "H₂C=O", 12, 4, 2, 0, 3],
];
const VAL = { H: 1, C: 4, N: 5, O: 6, F: 7, P: 5, S: 6, Cl: 7 };
// [formula, oblika (tožilnik), polarne vezi, polarna molekula]
const SHAPES = [
  ["H2O", "kotno", true, true], ["CO2", "linearno", true, false], ["NH3", "piramidalno", true, true], ["BF3", "trikotno ravninsko", true, false],
  ["CCl4", "tetraedrično", true, false], ["CHCl3", "tetraedrično", true, true], ["CH2Cl2", "tetraedrično", true, true], ["SO2", "kotno", true, true],
  ["BeCl2", "linearno", true, false], ["HCN", "linearno", true, true], ["Cl2", "linearno", false, false], ["N2", "linearno", false, false],
];

const genVezi = {
  id: "dod-kem-ss-kemijske-vezi",
  topics: ["KEM-SS-1/kemijske-vezi"],
  gen(level, r) {
    if (level === 1) {
      const b = r.pick(BONDS.filter((x) => x[1] !== x[3]));
      const [F, A, nA, B, nB] = b;
      const a = tx(EN[A], 1), bb = tx(EN[B], 1);
      const d = dEN(b);
      const name = nm(r);
      const text = r.pick([
        `Elektronegativnost ${EL_GEN[A]} je $${a}$, ${EL_GEN[B]} pa $${bb}$. Izračunaj razliko elektronegativnosti $\\Delta EN$ za vez med atomoma v $${sp(F)}$.`,
        `${name} je v periodnem sistemu ${g(name, "poiskal", "poiskala")} elektronegativnosti $EN(\\mathrm{${A}}) = ${a}$ in $EN(\\mathrm{${B}}) = ${bb}$. Kolikšna je razlika elektronegativnosti za vez v spojini $${sp(F)}$?`,
        `Ali je vez v $${sp(F)}$ ionska ali kovalentna, ocenimo z razliko elektronegativnosti. Izračunaj $\\Delta EN$, če je $EN(\\mathrm{${A}}) = ${a}$ in $EN(\\mathrm{${B}}) = ${bb}$.`,
      ]);
      const mis = [[EN[A] + EN[B], "Si elektronegativnosti seštel? Iščemo razliko."]];
      if (nA > 1 || nB > 1) mis.push([Math.abs(EN[A] * nA - EN[B] * nB), "Si elektronegativnost pomnožil z indeksom? ΔEN velja za eno vez med dvema atomoma."]);
      return mk(text, num(d, null, 1, mis), "Od večje elektronegativnosti odštej manjšo; indeksi v formuli pri tem ne igrajo vloge.",
        [`EN(\\mathrm{${A}}) = ${a}`, `EN(\\mathrm{${B}}) = ${bb}`], ["\\Delta EN"], ["\\Delta EN = |EN_1 - EN_2|", EN_RULE],
        [`$\\Delta EN = |EN(\\mathrm{${A}}) - EN(\\mathrm{${B}})| = |${a} - ${bb}| = ${tx(d, 1)}$`, `Pri $\\Delta EN = ${tx(d, 1)}$ je vez ${d === 0.4 || d === 1.7 ? "na meji med vrstama vezi" : bondKind(d)}.`]);
    }
    if (level === 2) {
      const OPTS = ["ionska", "polarna kovalentna", "nepolarna kovalentna", "kovinska"];
      if (r.next() < 0.25) {
        const [where, metal] = r.pick(METALS);
        const why = {
          ionska: `Ionska vez nastane med kovino in nekovino; v ${where} so le atomi ene kovine.`,
          "polarna kovalentna": "Kovalentne vezi tvorijo nekovine; atomi kovine oddajo zunanje elektrone v skupni »elektronski oblak«.",
          "nepolarna kovalentna": "Atomi so sicer enaki, a kovine ne tvorijo skupnih elektronskih parov – elektroni so prosto gibljivi.",
        };
        return concept(r, {
          q: `Kakšna vez povezuje atome v ${where}?`,
          ok: "kovinska",
          wrong: OPTS.filter((o) => o !== "kovinska").map((o) => [o, why[o]]),
          hint: "Pomisli, iz kakšnih atomov je snov: samo kovina, kovina in nekovina ali samo nekovine?",
          given: null,
          sol: [`${metal[0].toUpperCase() + metal.slice(1)} je kovina; kovinski kationi so povezani s skupnim oblakom prosto gibljivih elektronov.`, "To je kovinska vez."],
        });
      }
      const pool = BONDS.filter((b) => { const d = dEN(b); return d <= 0.2 || (d >= 0.6 && d <= 1.4) || d >= 2.0; });
      const b = r.pick(pool);
      const [F, A, , B] = b;
      const a = tx(EN[A], 1), bb = tx(EN[B], 1);
      const d = dEN(b);
      const ok = bondKind(d);
      const dt = tx(d, 1);
      const why = {
        ionska: `ΔEN = ${dt} ni večja od 1,7, zato elektron ne preide v celoti k drugemu atomu – ionov ni.`,
        "polarna kovalentna": ok === "ionska" ? `ΔEN = ${dt} je večja od 1,7: elektron preide k bolj elektronegativnemu atomu, nastanejo ioni.` : `ΔEN = ${dt} je manjša od 0,4: skupni elektronski par je porazdeljen (skoraj) enakomerno.`,
        "nepolarna kovalentna": `Vez je nepolarna le, ko je ΔEN < 0,4; tu je ΔEN = ${dt}.`,
        kovinska: `Kovinska vez povezuje atome v kosu kovine, ne atomov v spojini ${spU(F)}.`,
      };
      const name = nm(r);
      return concept(r, {
        q: r.pick([
          `Elektronegativnosti: $EN(\\mathrm{${A}}) = ${a}$, $EN(\\mathrm{${B}}) = ${bb}$. Kakšna vez je med atomoma v $${sp(F)}$?`,
          `${name} ${g(name, "ugotavlja", "ugotavlja")}, kakšna vez je v $${sp(F)}$. V tabeli ${g(name, "je našel", "je našla")} $EN(\\mathrm{${A}}) = ${a}$ in $EN(\\mathrm{${B}}) = ${bb}$. Kaj je pravilno?`,
        ]),
        ok,
        wrong: OPTS.filter((o) => o !== ok).map((o) => [o, why[o]]),
        hint: "Izračunaj $\\Delta EN$ in jo primerjaj z mejama $0{,}4$ in $1{,}7$.",
        given: [`EN(\\mathrm{${A}}) = ${a}`, `EN(\\mathrm{${B}}) = ${bb}`],
        find: [T("vrsta vezi")],
        formula: ["\\Delta EN = |EN_1 - EN_2|", EN_RULE],
        sol: [`$\\Delta EN = |${a} - ${bb}| = ${dt}$`, `$${dt} ${d < 0.4 ? "< 0{,}4" : d <= 1.7 ? "\\text{ je med } 0{,}4 \\text{ in } 1{,}7" : "> 1{,}7"}$, zato je vez ${ok}.`],
      });
    }
    // Raven 3: Lewisove formule (štetje elektronskih parov) ali polarnost molekule.
    if (r.next() < 0.55) {
      const [F, struct, ve, bp, lp, lpc, lines] = r.pick(LEWIS);
      const askLone = r.next() < 0.7;
      const comp = parseFormula(F);
      const veSum = Object.entries(comp).map(([e, k]) => (k > 1 ? `${k} \\cdot ${VAL[e]}` : `${VAL[e]}`)).join(" + ");
      const mis = askLone
        ? [[lpc ?? -1, "Si štel le nevezne pare na osrednjem atomu? Šteti je treba pare na vseh atomih."], [2 * lp, "Si štel elektrone namesto elektronskih parov?"], [ve / 2 - lp, "To je število veznih parov; vprašanje je o neveznih."]]
        : [[lines, "Dvojna vez pomeni dva vezna para, trojna pa tri."], [ve / 2, "Si štel vse elektronske pare, tudi nevezne?"], [lp, "To je število neveznih parov; vprašanje je o veznih."]];
      const what = askLone ? "neveznih (prostih) elektronskih parov" : "veznih elektronskih parov";
      return mk(
        r.pick([`Nariši Lewisovo formulo molekule $${sp(F)}$. Koliko ${what} ima molekula?`, `Koliko ${what} je v Lewisovi formuli molekule $${sp(F)}$? Upoštevaj vse atome v molekuli.`]),
        num(askLone ? lp : bp, null, null, mis.filter((m) => m[0] >= 0)),
        "Seštej valenčne elektrone vseh atomov. Nato atome poveži tako, da ima vsak oktet (vodik dublet), in preštej pare.",
        [`${T("molekula")} = ${sp(F)}`], [askLone ? "N_\\text{nevezni}" : "N_\\text{vezni}"],
        ["N_{e^-} = \\text{vsota valenčnih elektronov}", "N_\\text{nevezni} = \\dfrac{N_{e^-} - 2N_\\text{vezni}}{2}"],
        [`Valenčni elektroni: $N_{e^-} = ${veSum} = ${ve}$`, `Lewisova formula: ${struct}; veznih parov je ${bp}${lines !== bp ? " (dvojna vez = 2 para, trojna = 3)" : ""}.`, `$N_\\text{nevezni} = \\dfrac{${ve} - 2 \\cdot ${bp}}{2} = ${lp}$`, askLone ? `Neveznih parov: ${lp}.` : `Veznih parov: ${bp}.`]
      );
    }
    const [F, shape, polarBonds, polarMol] = r.pick(SHAPES);
    const O1 = "polarna molekula", O2 = "nepolarna molekula s polarnimi vezmi", O3 = "nepolarna molekula z nepolarnimi vezmi";
    const ok = polarMol ? O1 : polarBonds ? O2 : O3;
    const why = {
      [O1]: polarBonds ? `Vezi so polarne, a se pri ${shape} (simetrični) obliki dipoli vezi izničijo.` : "Vez med enakima atomoma je nepolarna, zato molekula nima dipola.",
      [O2]: polarMol ? `Pri ${shape} obliki se dipoli vezi ne izničijo – molekula ima pozitivni in negativni pol.` : "Vez med enakima atomoma ni polarna (ΔEN = 0).",
      [O3]: `Vezi v ${spU(F)} so polarne, ker ju tvorijo atomi z različno elektronegativnostjo.`,
    };
    return concept(r, {
      q: r.pick([`Molekula $${sp(F)}$ ima ${shape} obliko. Kaj velja zanjo?`, `Kakšna je molekula $${sp(F)}$ glede na polarnost, če ima ${shape} obliko?`]),
      ok,
      wrong: [O1, O2, O3].filter((o) => o !== ok).map((o) => [o, why[o]]),
      hint: "Najprej presodi, ali so vezi polarne. Nato poglej, ali se zaradi oblike dipoli vezi seštejejo ali izničijo.",
      given: [`${T("molekula")} = ${sp(F)}`, `${T("oblika")} = ${T(shape)}`],
      find: [T("polarnost molekule")],
      sol: [polarBonds ? "Vezi so polarne (atomi z različno elektronegativnostjo)." : "Vez je med enakima atomoma, zato je nepolarna.", polarBonds ? (polarMol ? "Oblika ni simetrična, dipoli vezi se ne izničijo – molekula je polarna." : "Oblika je simetrična, dipoli vezi se izničijo – molekula je nepolarna.") : "Molekula je nepolarna."],
    });
  },
};

// ---------- medmolekulske sile ----------
// [formula, rodilnik, vrsta: H = vodikove vezi, D = dipol-dipol, L = londonske; atom, na katerega je vezan H]
const IMF = [
  ["H2O", "vode", "H", "O"], ["HF", "vodikovega fluorida", "H", "F"], ["NH3", "amoniaka", "H", "N"], ["CH3OH", "metanola", "H", "O"], ["C2H5OH", "etanola", "H", "O"], ["CH3COOH", "etanojske kisline", "H", "O"],
  ["HCl", "vodikovega klorida", "D"], ["CH3Cl", "klorometana", "D"], ["SO2", "žveplovega dioksida", "D"], ["CH3COCH3", "propanona", "D"], ["HBr", "vodikovega bromida", "D"], ["CH3CHO", "etanala", "D"],
  ["CH4", "metana", "L"], ["CO2", "ogljikovega dioksida", "L"], ["I2", "joda", "L"], ["N2", "dušika", "L"], ["Cl2", "klora", "L"], ["CCl4", "tetraklorometana", "L"], ["C6H14", "heksana", "L"],
];
const IMF_NAME = { H: "vodikove vezi", D: "dipol-dipol sile", L: "londonske (disperzijske) sile" };
// Primerjava vrelišč: q = najvišje/najnižje, seznam, pravilna, razlaga za napačne, razlaga rešitve
const BP_SETS = [
  { q: "najvišje", tex: ["H2O", "H2S", "H2Se", "H2Te"], ok: 0, why: (x) => `Med molekulami ${x} ni vodikovih vezi; voda jih tvori, zato vre pri najvišji temperaturi kljub najmanjši masi.`, sol: "Le med molekulami vode so vodikove vezi (H je vezan na O)." },
  { q: "najvišje", tex: ["HF", "HCl", "HBr", "HI"], ok: 0, why: (x) => `${x} ne tvori vodikovih vezi; HF jih tvori, zato ima kljub najmanjši masi najvišje vrelišče.`, sol: "Le HF tvori vodikove vezi (H je vezan na F)." },
  { q: "najvišje", tex: ["CH4", "C2H6", "C3H8", "C4H10"], ok: 3, why: (x) => `Vse snovi so nepolarne; londonske sile so močnejše pri večjih molekulah, ${x} pa je manjša od butana.`, sol: "Vse so nepolarne (le londonske sile); te so najmočnejše pri največji molekuli, butanu." },
  { q: "najnižje", tex: ["CH4", "C2H6", "C3H8", "C4H10"], ok: 0, why: (x) => `${x} je večja molekula od metana, zato ima močnejše londonske sile in višje vrelišče.`, sol: "Metan je najmanjša nepolarna molekula – najšibkejše londonske sile." },
  { q: "najvišje", tex: ["F2", "Cl2", "Br2", "I2"], ok: 3, why: (x) => `Halogeni so nepolarni; ${x} ima manj elektronov in šibkejše londonske sile kot jod.`, sol: "Londonske sile rastejo z velikostjo (številom elektronov) molekule – največja je I₂." },
  { q: "najnižje", tex: ["F2", "Cl2", "Br2", "I2"], ok: 0, why: (x) => `${x} je večja molekula od F₂, zato ima močnejše londonske sile.`, sol: "F₂ je najmanjša nepolarna molekula – najšibkejše londonske sile." },
  { q: "najvišje", tex: ["C2H5OH", "CH3OCH3", "C3H8"], ok: 0, why: (x) => (x === "CH₃OCH₃" ? "Dimetil eter je polaren, a H ni vezan na O, zato vodikovih vezi med njegovimi molekulami ni." : "Propan je nepolaren – le šibke londonske sile."), sol: "Molske mase so podobne; le etanol tvori vodikove vezi." },
  { q: "najnižje", tex: ["C2H5OH", "CH3OCH3", "C3H8"], ok: 2, why: (x) => (x === "C₂H₅OH" ? "Etanol tvori vodikove vezi in ima najvišje vrelišče." : "Dimetil eter je polaren (dipol-dipol sile), zato vre pri višji temperaturi kot nepolarni propan."), sol: "Propan je nepolaren in ima le londonske sile; molske mase so podobne." },
  { q: "najvišje", names: ["pentan", "2-metilbutan", "2,2-dimetilpropan"], ok: 0, why: () => "Bolj razvejana molekula je bolj kroglasta, ima manjšo stično površino in šibkejše londonske sile.", sol: "Formula je enaka; nerazvejani pentan ima največjo stično površino in najmočnejše londonske sile." },
  { q: "najvišje", names: ["metanol", "etanol", "propan-1-ol"], ok: 2, why: () => "Vsi trije tvorijo vodikove vezi; pri večji molekuli so dodatno močnejše londonske sile.", sol: "Vsi tvorijo vodikove vezi; najdaljša veriga (propan-1-ol) ima še najmočnejše londonske sile." },
  { q: "najvišje", tex: ["NH3", "PH3", "AsH3"], ok: 0, why: (x) => `${x} ne tvori vodikovih vezi (P in As nista dovolj elektronegativna).`, sol: "Le amoniak tvori vodikove vezi (H je vezan na N)." },
  { q: "najvišje", tex: ["H2O", "NH3", "HF", "CH4"], ok: 0, why: (x) => (x === "CH₄" ? "Metan je nepolaren – le londonske sile." : x === "NH₃" ? "Amoniak tvori vodikove vezi, a šibkejše in manj kot voda (N ima le en nevezni par)." : "HF tvori močne vodikove vezi, a vsaka molekula le po dve; voda do štiri."), sol: "Vse razen metana tvorijo vodikove vezi; voda jih tvori največ (do štiri na molekulo)." },
];
// Za štetje: tvorijo vodikove vezi / pasti (vsebujejo N, O ali F in H, a H ni vezan nanje) / ne
const HB_YES = ["H2O", "NH3", "HF", "CH3OH", "C2H5OH", "CH3COOH", "CH3NH2", "HCOOH", "H2O2"];
const HB_TRAP = ["CH3OCH3", "CH3CHO", "CH3F", "HCHO", "CH3COCH3", "HCOOCH3"];
const HB_NO = ["CH4", "HCl", "H2S", "CO2", "PH3", "C2H6", "N2", "CH3Cl"];
const IMF_WHY = [
  { q: "Zakaj led plava na vodi?", ok: "Vodikove vezi v ledu tvorijo odprto kristalno zgradbo z manjšo gostoto, kot jo ima voda.", wrong: [["V ledu so ujeti zračni mehurčki.", "Tudi led brez mehurčkov plava – razlog je zgradba kristala."], ["Molekule vode v ledu so lažje.", "Molekula H₂O ima v ledu in v vodi enako maso."], ["Med molekulami v ledu so kovalentne vezi.", "Med molekulami so vodikove vezi; kovalentne vezi so znotraj molekule."]], sol: ["V ledu vsaka molekula tvori štiri vodikove vezi v pravilni, odprti mreži.", "Zato ima led manjšo gostoto kot tekoča voda in plava."] },
  { q: "Zakaj se etanol neomejeno meša z vodo, heksan pa ne?", ok: "Etanol tvori z vodo vodikove vezi, heksan pa je nepolaren.", wrong: [["Etanol ima manjšo molsko maso kot heksan.", "Masa ni odločilna; odločajo medmolekulske sile med topilom in topljencem."], ["Heksan ima večjo gostoto od vode.", "Heksan je lažji od vode; ne meša se zaradi nepolarnosti."], ["Etanol z vodo kemijsko reagira.", "Pri raztapljanju etanola ne nastane nova snov."]], sol: ["Skupina OH etanola tvori vodikove vezi z molekulami vode.", "Nepolarni heksan teh vezi ne more tvoriti, zato se z vodo ne meša."] },
  { q: "Zakaj ima voda višje vrelišče kot vodikov sulfid, čeprav je molekula $\\mathrm{H_2S}$ težja?", ok: "Med molekulami vode so vodikove vezi, med molekulami H₂S pa ne.", wrong: [["Vez O–H je močnejša od vezi S–H, pri vrenju pa se vezi v molekuli pretrgajo.", "Pri vrenju molekule ostanejo cele; premagajo se le medmolekulske sile."], ["H₂S je nepolarna molekula.", "H₂S je kotna in rahlo polarna; razlika je v vodikovih vezeh."], ["Voda ima večjo molsko maso.", "M(H₂O) = 18 g/mol je manjša od M(H₂S) = 34 g/mol."]], sol: ["Kisik je zelo elektronegativen, zato med molekulami vode nastanejo vodikove vezi.", "Žveplo ni dovolj elektronegativno; med molekulami H₂S so le šibkejše sile."] },
  { q: "Zakaj se jod dobro raztaplja v heksanu, v vodi pa slabo?", ok: "Jod in heksan sta nepolarna; »podobno se raztaplja v podobnem«.", wrong: [["Jod reagira s heksanom.", "Raztapljanje joda v heksanu je fizikalni proces."], ["Jod je polaren kot heksan.", "Molekula I₂ je iz dveh enakih atomov in je nepolarna; tudi heksan je nepolaren."], ["Voda je pregosta, da bi vanjo prišel jod.", "Gostota ni razlog; voda je polarna in z jodom ne tvori močnih privlakov."]], sol: ["Med nepolarnimi molekulami joda in heksana delujejo londonske sile.", "Voda je polarna in močno povezana z vodikovimi vezmi, ki jih jod ne more nadomestiti."] },
  { q: "Zakaj ima propan-1-ol višje vrelišče kot propanal, čeprav imata skoraj enako molsko maso?", ok: "Propan-1-ol tvori vodikove vezi, propanal pa ne (v njem H ni vezan na O).", wrong: [["Propanal ima dvojno vez, ki je šibkejša.", "Pri vrenju se vezi v molekuli ne trgajo; odločajo medmolekulske sile."], ["Propan-1-ol ima več atomov kisika.", "Obe molekuli imata po en atom kisika."], ["Propanal je nepolaren.", "Skupina C=O je polarna; propanal ima dipol-dipol sile, a ne vodikovih vezi."]], sol: ["V propan-1-olu je H vezan na O (skupina OH) – nastanejo vodikove vezi.", "V propanalu so le dipol-dipol in londonske sile, ki so šibkejše."] },
  { q: "Kaj se pretrga, ko voda zavre?", ok: "Vodikove vezi med molekulami; molekule H₂O ostanejo cele.", wrong: [["Kovalentne vezi O–H; nastaneta vodik in kisik.", "Pri vrenju se voda ne razkroji – para je še vedno H₂O."], ["Ionske vezi med H⁺ in OH⁻.", "Voda je iz molekul, ne iz ionov."], ["Nič, molekule se le hitreje gibljejo.", "Za vrenje je treba premagati privlake med molekulami – zato je potrebna energija."]], sol: ["Pri vrenju se molekule oddaljijo, zato je treba premagati medmolekulske sile.", "Pri vodi so to predvsem vodikove vezi; kovalentne vezi ostanejo."] },
  { q: "Zakaj je glicerol (propan-1,2,3-triol) bolj viskozen kot etanol?", ok: "Glicerol ima tri skupine OH in tvori več vodikovih vezi med molekulami.", wrong: [["Glicerol je ionska spojina.", "Glicerol je iz molekul; ionov ni."], ["Etanol je nepolaren.", "Etanol je polaren in tvori vodikove vezi, a le z eno skupino OH."], ["Glicerol ima večjo gostoto.", "Gostota ne določa viskoznosti; odločajo privlaki med molekulami."]], sol: ["Vsaka molekula glicerola tvori več vodikovih vezi kot molekula etanola.", "Molekule težje drsijo druga ob drugi – večja viskoznost."] },
  { q: "Zakaj ima 2,2-dimetilpropan nižje vrelišče kot pentan, čeprav imata enako molekulsko formulo?", ok: "Kroglasta molekula ima manjšo stično površino in šibkejše londonske sile.", wrong: [["2,2-dimetilpropan ima manjšo molsko maso.", "Imata enako formulo C₅H₁₂ in enako molsko maso."], ["Pentan tvori vodikove vezi.", "V alkanih je H vezan na C – vodikovih vezi ni."], ["Razvejane molekule so polarne.", "Oba alkana sta nepolarna."]], sol: ["Obe snovi sta nepolarni, delujejo le londonske sile.", "Te so močnejše pri podolgovatih molekulah z večjo stično površino (pentan)."] },
];

const genMedmol = {
  id: "dod-kem-ss-medmolekulske-sile",
  topics: ["KEM-SS-1/medmolekulske-sile"],
  gen(level, r) {
    if (level === 1) {
      const [F, gen, kind, atom] = r.pick(IMF);
      const ok = IMF_NAME[kind];
      const why = {
        [IMF_NAME.H]: `Vodikova vez nastane le, ko je H vezan neposredno na N, O ali F; v ${spU(F)} ni tako.`,
        [IMF_NAME.D]: kind === "H" ? `${spU(F)} je polarna, a ker je H vezan na ${atom}, so najmočnejše vodikove vezi.` : `Molekula ${spU(F)} je nepolarna, zato nima stalnega dipola.`,
        [IMF_NAME.L]: `Londonske sile delujejo med vsemi molekulami, a pri ${spU(F)} so močnejše ${kind === "H" ? "vodikove vezi" : "dipol-dipol sile"}.`,
        "kovalentne vezi": "Kovalentne vezi povezujejo atome znotraj molekule, ne molekul med seboj.",
      };
      const opts = [IMF_NAME.H, IMF_NAME.D, IMF_NAME.L, "kovalentne vezi"];
      return concept(r, {
        q: r.pick([`Katere so najmočnejše medmolekulske sile med molekulami ${gen} ($${sp(F)}$)?`, `Kaj najbolj drži skupaj molekule ${gen} ($${sp(F)}$) v tekočini ali trdnini?`]),
        ok,
        wrong: opts.filter((o) => o !== ok).map((o) => [o, why[o]]),
        hint: "Najprej preveri, ali je H vezan na N, O ali F. Če ni, presodi, ali je molekula polarna.",
        given: null,
        sol: [kind === "H" ? `V ${spU(F)} je H vezan na ${atom}.` : kind === "D" ? `Molekula ${spU(F)} je polarna, H pa ni vezan na N, O ali F.` : `Molekula ${spU(F)} je nepolarna.`, `Najmočnejše so ${ok}.`],
      });
    }
    if (level === 2) {
      const s = r.pick(BP_SETS);
      const labels = s.tex ? s.tex.map(spU) : s.names;
      const listTex = s.tex ? s.tex.map((f) => `$${sp(f)}$`).join(", ") : s.names.join(", ");
      const name = nm(r);
      return concept(r, {
        q: r.pick([`Katera od snovi ${listTex} ima ${s.q} vrelišče?`, `${name} ${g(name, "primerja", "primerja")} vrelišča snovi ${listTex}. Katera ima ${s.q} vrelišče?`]),
        ok: labels[s.ok],
        wrong: labels.filter((_, i) => i !== s.ok).map((x) => [x, s.why(x)]),
        hint: "Določi vrsto medmolekulskih sil pri vsaki snovi. Pri enaki vrsti sil odloča velikost in oblika molekule.",
        given: null,
        sol: [s.sol, `${s.q[0].toUpperCase() + s.q.slice(1)} vrelišče ima ${labels[s.ok]}.`],
      });
    }
    if (r.next() < 0.6) {
      const k = r.int(2, 4);
      const t = r.int(1, 2);
      const yes = r.shuffle(HB_YES).slice(0, k);
      const trap = r.shuffle(HB_TRAP).slice(0, t);
      const no = r.shuffle(HB_NO).slice(0, 6 - k - t);
      const list = r.shuffle([...yes, ...trap, ...no]);
      const listTex = list.map((f) => `$${sp(f)}$`).join(", ");
      const polarNoHB = no.filter((f) => ["HCl", "H2S", "PH3", "CH3Cl"].includes(f)).length;
      return mk(
        r.pick([`Koliko od naštetih snovi tvori vodikove vezi med svojimi molekulami? ${listTex}`, `Med snovmi ${listTex} preštej tiste, pri katerih so med molekulami vodikove vezi.`]),
        num(k, null, null, [[k + t, "Si štel tudi molekule, v katerih je H vezan na C? Za vodikovo vez mora biti H vezan neposredno na N, O ali F."], [k + polarNoHB, "Si štel polarne molekule s Cl, S ali P? Ti atomi niso dovolj elektronegativni za vodikovo vez."]]),
        "Za vsako snov preveri: ali je v molekuli atom H, vezan neposredno na N, O ali F?",
        null, null,
        ["\\mathrm{X{-}H \\cdots Y}:\\quad \\mathrm{X, Y} \\in \\{\\mathrm{N, O, F}\\}"],
        [`Vodikove vezi tvorijo: ${yes.map(spU).join(", ")} (H je vezan na N, O ali F).`, `Ne tvorijo: ${[...trap, ...no].map(spU).join(", ")} (H je vezan na C ali ni N, O, F).`, `Skupaj: ${k}.`]
      );
    }
    const c = r.pick(IMF_WHY);
    return concept(r, { ...c, given: null, hint: "Pomisli, katere sile delujejo med molekulami in kako močne so." });
  },
};

// ---------- plini ----------
const GASES = [["H2", "vodika", 2.02], ["O2", "kisika", 32.0], ["N2", "dušika", 28.02], ["CO2", "ogljikovega dioksida", 44.01], ["CH4", "metana", 16.05], ["NH3", "amoniaka", 17.04], ["He", "helija", 4.0], ["Cl2", "klora", 70.9], ["SO2", "žveplovega dioksida", 64.07], ["C3H8", "propana", 44.11]];
const Mtx = (M) => tx(M, 2);

const genPlini = {
  id: "dod-kem-ss-plini",
  topics: ["KEM-SS-1/plini"],
  gen(level, r) {
    const [F, gen, M] = r.pick(GASES);
    const f = sp(F);
    const name = nm(r);
    if (level === 1) {
      if (r.next() < 0.5) {
        const n = r.dec(0.1, 4, 2);
        const V = n * VM;
        return mk(
          r.pick([
            `V jeklenki je $${tx(n)}\\ \\mathrm{mol}$ ${gen} ($${f}$). Kolikšno prostornino bi plin zavzel pri normalnih pogojih? Uporabi ${VM_TXT}. ${zaokr(2)}`,
            `${name} je v balon ${g(name, "napolnil", "napolnila")} $${tx(n)}\\ \\mathrm{mol}$ ${gen}. Kolikšna je prostornina plina pri normalnih pogojih (${VM_TXT})? ${zaokr(2)}`,
          ]),
          num(V, "L", 2, [[n / VM, "Si množino delil z V_m? Prostornina je V = n · V_m."], [VM / n, "Si V_m delil z množino? Prostornina je V = n · V_m."]], { unitAlternatives: ["l", "dm3", "dm³"] }),
          "Pri normalnih pogojih zavzame 1 mol katerega koli plina 22,4 L.",
          [dat("n", tx(n), "mol"), VM_DAT], ["V"], ["V = n \\cdot V_m"],
          [`$V = n \\cdot V_m = ${qty(tx(n), "mol")} \\cdot ${qty("22{,}4", "L/mol")}$`, `$V ${res(V, 2, "L")}$`]
        );
      }
      const V = r.dec(1, 90, 1);
      const n = V / VM;
      return mk(
        r.pick([
          `Pri normalnih pogojih zavzame ${gen === "helija" ? "helij" : "plin"} $${f}$ prostornino $${tx(V)}\\ \\mathrm{L}$. Koliko molov plina je to? Uporabi ${VM_TXT}. ${zaokr(3)}`,
          `${name} je pri normalnih pogojih ${g(name, "zbral", "zbrala")} $${tx(V)}\\ \\mathrm{L}$ ${gen} ($${f}$). Kolikšna je množina plina? (${VM_TXT}) ${zaokr(3)}`,
        ]),
        num(n, "mol", 3, [[V * VM, "Si prostornino pomnožil z V_m? Množina je n = V / V_m."], [VM / V, "Si V_m delil s prostornino? Velja n = V / V_m."]]),
        "Množina plina je prostornina, deljena z molsko prostornino.",
        [dat("V", tx(V), "L"), VM_DAT], ["n"], ["n = \\dfrac{V}{V_m}"],
        [`$n = \\dfrac{V}{V_m} = \\dfrac{${qty(tx(V), "L")}}{${qty("22{,}4", "L/mol")}}$`, `$n ${res(n, 3, "mol")}$`]
      );
    }
    if (level === 2) {
      if (r.next() < 0.5) {
        const m = r.dec(1, 100, 1);
        const n = m / M;
        const V = n * VM;
        return mk(
          r.pick([
            `Kolikšno prostornino zavzame $${tx(m)}\\ \\mathrm{g}$ ${gen} ($${f}$) pri normalnih pogojih? Uporabi $M(${f}) = ${Mtx(M)}\\ \\mathrm{g/mol}$ in ${VM_TXT}. ${zaokr(2)}`,
            `${name} je v laboratoriju ${g(name, "pripravil", "pripravila")} $${tx(m)}\\ \\mathrm{g}$ ${gen}. Koliko litrov je to pri normalnih pogojih? $M(${f}) = ${Mtx(M)}\\ \\mathrm{g/mol}$, ${VM_TXT}. ${zaokr(2)}`,
          ]),
          num(V, "L", 2, [[m * VM, "Si maso pomnožil z V_m, ne da bi jo prej pretvoril v množino?"], [n, "To je množina v molih; izračunaj še prostornino."], [(m / VM) * M, "Si maso delil z V_m? Najprej izračunaj n = m / M."]], { unitAlternatives: ["l", "dm3", "dm³"] }),
          "Najprej maso pretvori v množino, nato množino v prostornino.",
          [dat("m", tx(m), "g"), dat(`M(${f})`, Mtx(M), "g/mol"), VM_DAT], ["V"], ["n = \\dfrac{m}{M}", "V = n \\cdot V_m"],
          [`$n = \\dfrac{m}{M} = \\dfrac{${qty(tx(m), "g")}}{${qty(Mtx(M), "g/mol")}} \\approx ${qty(tx(n, 4), "mol")}$`, `$V = n \\cdot V_m = ${tx(n, 4)} \\cdot 22{,}4\\ \\mathrm{L} ${res(V, 2, "L")}$`]
        );
      }
      const n = r.dec(0.2, 3, 2);
      const t = r.int(10, 80);
      const p = r.int(90, 250);
      const Tk = t + 273;
      const V = (n * R_GAS * Tk) / p;
      return mk(
        r.pick([
          `Kolikšno prostornino zavzame $${tx(n)}\\ \\mathrm{mol}$ ${gen} pri $${t}\\ {}^\\circ\\mathrm{C}$ in $${p}\\ \\mathrm{kPa}$? Uporabi ${R_TXT}. Rezultat zapiši v litrih in ${ROUND[2]}.`,
          `V posodi je $${tx(n)}\\ \\mathrm{mol}$ ${gen} ($${f}$) pri temperaturi $${t}\\ {}^\\circ\\mathrm{C}$ in tlaku $${p}\\ \\mathrm{kPa}$. Kolikšna je prostornina posode v litrih? ${R_TXT}. ${zaokr(2)}`,
        ]),
        num(V, "L", 2, [[(n * R_GAS * t) / p, "Si temperaturo vstavil v °C? V plinski enačbi mora biti v kelvinih."], [n * VM, "Molska prostornina 22,4 L/mol velja le pri normalnih pogojih."], [(n * R_GAS * Tk) / (p * 1000), "Preveri enote: kPa in L se ujemata (J = kPa · L)."]], { unitAlternatives: ["l", "dm3", "dm³"] }),
        "Uporabi splošno plinsko enačbo; temperaturo pretvori v kelvine ($T = t + 273$).",
        [dat("n", tx(n), "mol"), dat("t", t, "°C"), dat("p", p, "kPa"), R_DAT], ["V"], ["pV = nRT", "T = t + 273"],
        [`$T = ${t} + 273 = ${Tk}\\ \\mathrm{K}$`, `$V = \\dfrac{nRT}{p} = \\dfrac{${tx(n)} \\cdot 8{,}314 \\cdot ${Tk}}{${p}}\\ \\mathrm{L}$ (tlak v kPa da prostornino v L)`, `$V ${res(V, 2, "L")}$`]
      );
    }
    const kind = r.int(0, 2);
    const t = r.int(5, 35);
    const Tk = t + 273;
    if (kind === 0) {
      const V = r.int(2, 20);
      const pb = r.int(2, 20);
      const pk = pb * 100;
      const n = (pk * V) / (R_GAS * Tk);
      const m = n * M;
      return mk(
        `Jeklenka s prostornino $${V}\\ \\mathrm{L}$ vsebuje ${gen} ($${f}$) pri tlaku $${pb}\\ \\mathrm{bar}$ in $${t}\\ {}^\\circ\\mathrm{C}$. Kolikšna je masa plina v jeklenki? $M(${f}) = ${Mtx(M)}\\ \\mathrm{g/mol}$, ${R_TXT}, $1\\ \\mathrm{bar} = 100\\ \\mathrm{kPa}$. Rezultat v gramih ${ROUND[1]}.`,
        num(m, "g", 1, [[(pk * V * M) / (R_GAS * t), "Si temperaturo vstavil v °C? Uporabi kelvine."], [(pb * V * M) / (R_GAS * Tk), "Si tlak pretvoril iz bar v kPa?"], [n, "To je množina v molih; pomnoži še z molsko maso."]]),
        "Iz plinske enačbe izračunaj množino, nato maso $m = n \\cdot M$.",
        [dat("V", V, "L"), dat("p", pb, "bar"), dat("t", t, "°C"), dat(`M(${f})`, Mtx(M), "g/mol"), R_DAT], ["m"], ["pV = nRT", "m = n \\cdot M", "T = t + 273"],
        [`$p = ${pb}\\ \\mathrm{bar} = ${pk}\\ \\mathrm{kPa}$, $T = ${Tk}\\ \\mathrm{K}$`, `$n = \\dfrac{pV}{RT} = \\dfrac{${pk} \\cdot ${V}}{8{,}314 \\cdot ${Tk}}\\ \\mathrm{mol} \\approx ${qty(tx(n, 3), "mol")}$`, `$m = n \\cdot M = ${tx(n, 3)} \\cdot ${Mtx(M)}\\ \\mathrm{g} ${res(m, 1, "g")}$`]
      );
    }
    if (kind === 1) {
      const V = r.dec(0.5, 5, 1);
      const p = r.int(95, 110);
      const m = roundHalfUp((p * V * M) / (R_GAS * Tk), 2);
      const Mx = (m * R_GAS * Tk) / (p * V);
      return mk(
        `${name} ${g(name, "je napolnil", "je napolnila")} bučko s prostornino $${tx(V)}\\ \\mathrm{L}$ z neznanim plinom pri $${p}\\ \\mathrm{kPa}$ in $${t}\\ {}^\\circ\\mathrm{C}$. Masa plina je $${tx(m, 2)}\\ \\mathrm{g}$. Kolikšna je molska masa plina? ${R_TXT}. ${zaokr(1)}`,
        num(Mx, "g/mol", 1, [[(m * R_GAS * t) / (p * V), "Si temperaturo vstavil v °C? Uporabi kelvine."], [(m * VM) / V, "Pogoji niso normalni, zato 22,4 L/mol ne velja."], [(p * V) / (m * R_GAS * Tk), "Si zamenjal števec in imenovalec? M = mRT / (pV)."]], U_GMOL),
        "Iz plinske enačbe izrazi $M$: ker je $n = m/M$, velja $M = \\dfrac{mRT}{pV}$.",
        [dat("V", tx(V), "L"), dat("p", p, "kPa"), dat("t", t, "°C"), dat("m", tx(m, 2), "g"), R_DAT], ["M"], ["pV = \\dfrac{m}{M}RT", "M = \\dfrac{mRT}{pV}"],
        [`$T = ${t} + 273 = ${Tk}\\ \\mathrm{K}$`, `$M = \\dfrac{mRT}{pV} = \\dfrac{${tx(m, 2)} \\cdot 8{,}314 \\cdot ${Tk}}{${p} \\cdot ${tx(V)}}\\ \\mathrm{g/mol}$`, `$M ${res(Mx, 1, "g/mol")}$ (plin je verjetno $${f}$, $M = ${Mtx(M)}\\ \\mathrm{g/mol}$)`]
      );
    }
    const p = r.int(90, 300);
    const rho = (p * M) / (R_GAS * Tk);
    return mk(
      `Kolikšna je gostota ${gen} ($${f}$) pri $${p}\\ \\mathrm{kPa}$ in $${t}\\ {}^\\circ\\mathrm{C}$? $M(${f}) = ${Mtx(M)}\\ \\mathrm{g/mol}$, ${R_TXT}. Rezultat v $\\mathrm{g/L}$ ${ROUND[2]}.`,
      num(rho, "g/L", 2, [[(p * M) / (R_GAS * t), "Si temperaturo vstavil v °C? Uporabi kelvine."], [M / VM, "To je gostota pri normalnih pogojih; tu pogoji niso normalni."], [(R_GAS * Tk) / (p * M), "Si obrnil ulomek? ρ = pM / (RT)."]], { unitAlternatives: ["g/l", "g/dm3", "kg/m3", "kg/m³"] }),
      "Gostota je $\\rho = m/V$; v plinsko enačbo vstavi $n = m/M$ in izrazi $m/V$.",
      [dat("p", p, "kPa"), dat("t", t, "°C"), dat(`M(${f})`, Mtx(M), "g/mol"), R_DAT], ["\\rho"], ["pV = \\dfrac{m}{M}RT", "\\rho = \\dfrac{m}{V} = \\dfrac{pM}{RT}"],
      [`$T = ${t} + 273 = ${Tk}\\ \\mathrm{K}$`, `$\\rho = \\dfrac{pM}{RT} = \\dfrac{${p} \\cdot ${Mtx(M)}}{8{,}314 \\cdot ${Tk}}\\ \\mathrm{g/L}$`, `$\\rho ${res(rho, 2, "g/L")}$`]
    );
  },
};

// ---------- energija pri reakcijah ----------
// Termokemijske enačbe: enačba, ΔH (kJ), ključna snov, koeficient, M, rodilnik, dejanje
const THERMO = [
  { eq: "CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)", dH: -890, key: "CH4", c: 1, M: 16.05, gen: "metana", act: "zgori" },
  { eq: "2H2(g) + O2(g) -> 2H2O(l)", dH: -572, key: "H2", c: 2, M: 2.02, gen: "vodika", act: "zgori" },
  { eq: "C(s) + O2(g) -> CO2(g)", dH: -394, key: "C", c: 1, M: 12.01, gen: "ogljika (grafita)", act: "zgori" },
  { eq: "C3H8(g) + 5O2(g) -> 3CO2(g) + 4H2O(l)", dH: -2220, key: "C3H8", c: 1, M: 44.11, gen: "propana", act: "zgori" },
  { eq: "CaCO3(s) -> CaO(s) + CO2(g)", dH: 178, key: "CaCO3", c: 1, M: 100.09, gen: "kalcijevega karbonata", act: "razpade" },
  { eq: "N2(g) + 3H2(g) -> 2NH3(g)", dH: -92, key: "NH3", c: 2, M: 17.04, gen: "amoniaka", act: "nastane" },
  { eq: "C2H5OH(l) + 3O2(g) -> 2CO2(g) + 3H2O(l)", dH: -1367, key: "C2H5OH", c: 1, M: 46.08, gen: "etanola", act: "zgori" },
  { eq: "2H2O(l) -> 2H2(g) + O2(g)", dH: 572, key: "H2O", c: 2, M: 18.02, gen: "vode", act: "razpade" },
  { eq: "N2(g) + O2(g) -> 2NO(g)", dH: 181, key: "NO", c: 2, M: 30.01, gen: "dušikovega oksida", act: "nastane" },
  { eq: "C6H12O6(s) + 6O2(g) -> 6CO2(g) + 6H2O(l)", dH: -2803, key: "C6H12O6", c: 1, M: 180.16, gen: "glukoze", act: "se oksidira" },
  { eq: "2Mg(s) + O2(g) -> 2MgO(s)", dH: -1204, key: "Mg", c: 2, M: 24.31, gen: "magnezija", act: "zgori" },
  { eq: "2Al(s) + Fe2O3(s) -> Al2O3(s) + 2Fe(s)", dH: -852, key: "Al", c: 2, M: 26.98, gen: "aluminija", act: "zreagira" },
];
// Standardne tvorbene entalpije (kJ/mol); elementi imajo 0.
const HF = { CO2: -394, "H2O(l)": -286, "H2O(g)": -242, CH4: -75, C2H5OH: -278, C3H8: -104, NH3: -46, CaCO3: -1207, CaO: -635, NO: 90, CO: -111, Fe2O3: -824, Al2O3: -1676, SO2: -297, SO3: -396, C2H4: 52, C2H6: -85 };
const ELEMENTS = new Set(["O2", "H2", "N2", "Fe", "Al", "C", "Mg", "Cl2"]);
const FORM_RX = [
  "CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)", "C3H8(g) + 5O2(g) -> 3CO2(g) + 4H2O(l)", "C2H5OH(l) + 3O2(g) -> 2CO2(g) + 3H2O(l)", "CaCO3(s) -> CaO(s) + CO2(g)",
  "2CO(g) + O2(g) -> 2CO2(g)", "Fe2O3(s) + 3CO(g) -> 2Fe(s) + 3CO2(g)", "2Al(s) + Fe2O3(s) -> Al2O3(s) + 2Fe(s)", "2SO2(g) + O2(g) -> 2SO3(g)",
  "C2H4(g) + H2(g) -> C2H6(g)", "4NH3(g) + 5O2(g) -> 4NO(g) + 6H2O(g)", "C2H4(g) + 3O2(g) -> 2CO2(g) + 2H2O(l)", "CH4(g) + H2O(g) -> CO(g) + 3H2(g)",
];
// Razčleni stran enačbe: [[koeficient, formula, stanje]]
const sideTerms = (s) => s.split(" + ").map((t) => { const m = t.match(/^(\d*)(.+?)(\((?:g|l|s|aq)\))?$/); return [m[1] ? Number(m[1]) : 1, m[2], m[3] || ""]; });
const hfKey = (f, st) => (f === "H2O" ? `H2O${st}` : f);
const hfTex = (f, st) => `\\Delta H_f(${sp(f)}${f === "H2O" ? `\\mathrm{${st}}` : ""})`;
const EXO_ENDO = [
  ["gorenje lesa v kaminu", true, false], ["taljenje ledu", false, true], ["izparevanje vode", false, true], ["kondenzacija vodne pare na oknu", true, true],
  ["raztapljanje amonijevega nitrata v vodi (hladilni obkladek)", false, true], ["nevtralizacija klorovodikove kisline z natrijevim hidroksidom", true, false],
  ["fotosinteza", false, false], ["celično dihanje (oksidacija glukoze)", true, false], ["termični razkroj apnenca (CaCO₃)", false, false],
  ["zmrzovanje vode", true, true], ["gorenje magnezijevega traku", true, false], ["elektroliza vode", false, false],
];

const genEnergija = {
  id: "dod-kem-ss-energija-pri-reakcijah",
  topics: ["KEM-SS-1/energija-pri-reakcijah"],
  gen(level, r) {
    const name = nm(r);
    if (level === 1 && r.next() < 0.35) {
      const [proc, exo, phys] = r.pick(EXO_ENDO);
      const EXO = "eksotermna (ΔH < 0)", ENDO = "endotermna (ΔH > 0)", ZERO = "energija se ne spremeni (ΔH = 0)";
      const ok = exo ? EXO : ENDO;
      return concept(r, {
        q: r.pick([`Ali je ${proc} eksotermna ali endotermna sprememba?`, `Kako označimo spremembo »${proc}« glede na izmenjavo toplote z okolico?`]),
        ok,
        wrong: [
          [exo ? ENDO : EXO, exo ? "Pri tej spremembi sistem toploto odda okolici (okolica se segreje), zato je ΔH < 0." : "Pri tej spremembi sistem toploto prejme iz okolice, zato je ΔH > 0."],
          [ZERO, phys ? "Tudi pri fizikalnih spremembah (taljenje, izparevanje …) se energija izmenjuje z okolico." : "Pri kemijski reakciji se vezi trgajo in nastajajo, zato se energija vedno spremeni."],
        ],
        hint: "Ali se okolica pri tem segreje (toplota se sprosti) ali ohladi oziroma moramo toploto dovajati?",
        given: null,
        sol: [exo ? "Pri tej spremembi se toplota sprosti v okolico." : "Pri tej spremembi moramo toploto dovajati (sistem jo prejme).", `Sprememba je ${ok}.`],
      });
    }
    if (level === 1) {
      const t = r.pick(THERMO.filter((x) => x.c === 1));
      const n = r.dec(0.5, 5, 1);
      const Q = n * Math.abs(t.dH);
      const verb = t.dH < 0 ? "sprosti" : "porabi";
      return mk(
        r.pick([
          `Termokemijska enačba je\n\n$$${eqTex(t.eq)},\\quad \\Delta H = ${tx(t.dH)}\\ \\mathrm{kJ}$$\n\nKoliko toplote se ${verb}, ko ${t.act} $${tx(n)}\\ \\mathrm{mol}$ ${t.gen}? ${zaokr(0)}`,
          `Ko ${t.act} $1\\ \\mathrm{mol}$ ${t.gen}, je $\\Delta H = ${tx(t.dH)}\\ \\mathrm{kJ}$. ${name} ${g(name, "računa", "računa")}, koliko toplote se ${verb} pri $${tx(n)}\\ \\mathrm{mol}$. Koliko kJ izračuna? ${zaokr(0)}`,
        ]),
        num(Q, "kJ", 0, [[Math.abs(t.dH) / n, "Si delil namesto množil? Toplota je sorazmerna z množino."], [Math.abs(t.dH), "To je toplota za 1 mol; upoštevaj dano množino."]]),
        "$\\Delta H$ velja za 1 mol snovi; toplota je sorazmerna z množino.",
        [dat("n", tx(n), "mol"), dat("\\Delta H", tx(t.dH), "kJ")], ["Q"], ["Q = n \\cdot |\\Delta H|"],
        [`$Q = n \\cdot |\\Delta H| = ${tx(n)} \\cdot ${Math.abs(t.dH)}\\ \\mathrm{kJ}$`, `$Q ${res(Q, 0, "kJ")}$ (toplota se ${verb})`]
      );
    }
    if (level === 2) {
      const t = r.pick(THERMO);
      const m = t.M < 5 ? r.dec(0.5, 20, 1) : r.dec(2, 200, 1);
      const n = m / t.M;
      const Q = (n / t.c) * Math.abs(t.dH);
      const d = Q < 10 ? 1 : 0;
      const verb = t.dH < 0 ? "sprosti" : "porabi";
      const f = sp(t.key);
      return mk(
        `Termokemijska enačba je\n\n$$${eqTex(t.eq)},\\quad \\Delta H = ${tx(t.dH)}\\ \\mathrm{kJ}$$\n\nKoliko toplote se ${verb}, ko ${t.act} $${tx(m)}\\ \\mathrm{g}$ ${t.gen}? $M(${f}) = ${Mtx(t.M)}\\ \\mathrm{g/mol}$. ${zaokr(d)}`,
        num(Q, "kJ", d, [[n * Math.abs(t.dH), `Si upošteval, da ΔH velja za ${t.c} mol ${spU(t.key)} (koeficient v enačbi)?`], [(m * Math.abs(t.dH)) / t.c, "Si maso pretvoril v množino (n = m / M)?"]]),
        "Maso pretvori v množino, nato poglej koeficient snovi v enačbi: $\\Delta H$ velja za toliko molov, kot kaže koeficient.",
        [dat("m", tx(m), "g"), dat(`M(${f})`, Mtx(t.M), "g/mol"), dat("\\Delta H", tx(t.dH), "kJ")], ["Q"], ["n = \\dfrac{m}{M}", `Q = \\dfrac{n}{${t.c}} \\cdot |\\Delta H|`],
        [`$n = \\dfrac{${tx(m)}}{${Mtx(t.M)}}\\ \\mathrm{mol} \\approx ${qty(tx(n, 4), "mol")}$`, `V enačbi je koeficient ${t.c}: $${tx(t.dH)}\\ \\mathrm{kJ}$ velja za ${t.c} mol.`, `$Q = \\dfrac{${tx(n, 4)}}{${t.c}} \\cdot ${Math.abs(t.dH)}\\ \\mathrm{kJ} ${res(Q, d, "kJ")}$ (se ${verb})`]
      );
    }
    if (r.next() < 0.6) {
      const eq = r.pick(FORM_RX);
      const [L, Rr] = eq.split(" -> ").map(sideTerms);
      const all = [...L, ...Rr].filter(([, f]) => !ELEMENTS.has(f));
      const uniq = [...new Map(all.map((x) => [hfKey(x[1], x[2]), x])).values()];
      const sum = (side, coef = true) => side.reduce((s, [c, f, st]) => s + (ELEMENTS.has(f) ? 0 : (coef ? c : 1) * HF[hfKey(f, st)]), 0);
      const dH = sum(Rr) - sum(L);
      const term = (side) => side.filter(([, f]) => !ELEMENTS.has(f)).map(([c, f, st]) => `${c > 1 ? `${c} \\cdot ` : ""}(${tx(HF[hfKey(f, st)])})`).join(" + ") || "0";
      const vals = uniq.map(([, f, st]) => `$${hfTex(f, st)} = ${tx(HF[hfKey(f, st)])}$`).join(", ");
      return mk(
        `Izračunaj reakcijsko entalpijo za reakcijo\n\n$$${eqTex(eq)}$$\n\nStandardne tvorbene entalpije v kJ/mol: ${vals}. Za elemente je $\\Delta H_f = 0$.`,
        num(dH, "kJ", 0, [[-dH, "Si odštel produkte od reaktantov? Velja: produkti − reaktanti."], [sum(Rr, false) - sum(L, false), "Si tvorbene entalpije pomnožil s koeficienti iz enačbe?"]]),
        "Seštej tvorbene entalpije produktov in reaktantov (vsako pomnoži s koeficientom), nato odštej: produkti − reaktanti.",
        uniq.map(([, f, st]) => `${hfTex(f, st)} = ${qty(tx(HF[hfKey(f, st)]), "kJ/mol")}`), ["\\Delta H_r"], ["\\Delta H_r = \\sum n\\,\\Delta H_f(\\text{produkti}) - \\sum n\\,\\Delta H_f(\\text{reaktanti})"],
        [`Produkti: $${term(Rr)} = ${tx(sum(Rr))}\\ \\mathrm{kJ}$`, `Reaktanti: $${term(L)} = ${tx(sum(L))}\\ \\mathrm{kJ}$`, `$\\Delta H_r = ${tx(sum(Rr))} - (${tx(sum(L))}) = ${tx(dH)}\\ \\mathrm{kJ}$ (${dH < 0 ? "eksotermna" : "endotermna"} reakcija)`]
      );
    }
    const t = r.pick(THERMO.filter((x) => x.dH < 0 && x.act === "zgori"));
    const Q = r.int(2, 60) * 50;
    const n = (Q / Math.abs(t.dH)) * t.c;
    const m = n * t.M;
    const f = sp(t.key);
    return mk(
      `${name} ${g(name, "potrebuje", "potrebuje")} $${Q}\\ \\mathrm{kJ}$ toplote. Koliko gramov ${t.gen} mora sežgati? Velja\n\n$$${eqTex(t.eq)},\\quad \\Delta H = ${tx(t.dH)}\\ \\mathrm{kJ}$$\n\n$M(${f}) = ${Mtx(t.M)}\\ \\mathrm{g/mol}$. ${zaokr(1)}`,
      num(m, "g", 1, [[n, "To je množina v molih; pretvori jo še v maso."], [(Q / Math.abs(t.dH)) * t.M, `Si upošteval koeficient ${t.c} pred ${spU(t.key)} v enačbi?`]]),
      "Izračunaj, koliko molov snovi da zahtevano toploto (upoštevaj koeficient), nato množino pretvori v maso.",
      [dat("Q", Q, "kJ"), dat("\\Delta H", tx(t.dH), "kJ"), dat(`M(${f})`, Mtx(t.M), "g/mol")], ["m"], [`n = ${t.c > 1 ? `${t.c} \\cdot ` : ""}\\dfrac{Q}{|\\Delta H|}`, "m = n \\cdot M"],
      [`$n = ${t.c > 1 ? `${t.c} \\cdot ` : ""}\\dfrac{${Q}}{${Math.abs(t.dH)}}\\ \\mathrm{mol} \\approx ${qty(tx(n, 4), "mol")}$`, `$m = n \\cdot M = ${tx(n, 4)} \\cdot ${Mtx(t.M)}\\ \\mathrm{g} ${res(m, 1, "g")}$`]
    );
  },
};

// =====================================================================
// KEM-SS-2
// =====================================================================

// ---------- hitrost reakcij ----------
const U_RATE = { unitAlternatives: ["mol/(l·min)", "mol/(L min)", "mol/(l min)", "mol/Lmin", "mol L-1 min-1", "mol/l/min", "mol/L/min"] };
const U_RATE_S = { unitAlternatives: ["mol/(l·s)", "mol/(L s)", "mol/(l s)", "mol/Ls", "mol L-1 s-1", "mol/l/s", "mol/L/s"] };
// Stehiometrija hitrosti: [enačba, snov A (znana), koeficient A, snov B (iskana), koeficient B]
const RATE_RX = [
  ["2N2O5(g) -> 4NO2(g) + O2(g)", "N2O5", 2, "NO2", 4], ["2N2O5(g) -> 4NO2(g) + O2(g)", "N2O5", 2, "O2", 1], ["2H2O2(aq) -> 2H2O(l) + O2(g)", "H2O2", 2, "O2", 1],
  ["N2(g) + 3H2(g) -> 2NH3(g)", "NH3", 2, "H2", 3], ["N2(g) + 3H2(g) -> 2NH3(g)", "H2", 3, "N2", 1], ["2SO2(g) + O2(g) -> 2SO3(g)", "SO2", 2, "O2", 1],
  ["2HI(g) -> H2(g) + I2(g)", "HI", 2, "H2", 1], ["4NH3(g) + 5O2(g) -> 4NO(g) + 6H2O(g)", "NH3", 4, "H2O", 6], ["2NO(g) + O2(g) -> 2NO2(g)", "O2", 1, "NO2", 2],
];
const RATE_WHY = [
  { q: "Zakaj se cink v prahu v klorovodikovi kislini raztaplja hitreje kot kos cinka?", ok: "Prah ima večjo površino, zato je več trkov med delci cinka in kisline.", wrong: [["Cink v prahu je kemijsko bolj reaktiven element.", "Snov je ista; spremeni se le površina, ki je na voljo za trke."], ["Prah zniža entalpijo reakcije.", "Velikost delcev ne vpliva na ΔH, le na hitrost."], ["Prah deluje kot katalizator.", "Katalizator je druga snov; prah cinka se pri reakciji porablja."]], sol: ["Reakcija poteka na površini trdnine.", "Večja površina pomeni več trkov v sekundi in hitrejšo reakcijo."] },
  { q: "Zakaj hrano hranimo v hladilniku?", ok: "Pri nižji temperaturi je manj trkov z dovolj energijo, zato so reakcije kvarjenja počasnejše.", wrong: [["Mraz uniči vse mikroorganizme.", "Mikroorganizmi pri nizki temperaturi večinoma preživijo, le njihovo delovanje se upočasni."], ["V hladilniku ni kisika.", "V hladilniku je zrak s kisikom; razlika je v temperaturi."], ["Pri nizki temperaturi se zviša aktivacijska energija.", "Aktivacijska energija se s temperaturo ne spremeni; spremeni se delež delcev, ki jo presežejo."]], sol: ["Pri nižji temperaturi ima manjši delež delcev energijo, večjo od aktivacijske.", "Uspešnih trkov je manj, reakcije kvarjenja so počasnejše."] },
  { q: "Kaj katalizator spremeni pri kemijski reakciji?", ok: "Omogoči pot z nižjo aktivacijsko energijo.", wrong: [["Spremeni reakcijsko entalpijo ΔH.", "Začetna in končna energija ostaneta enaki, zato je ΔH enaka."], ["Pri reakciji se porabi kot reaktant.", "Katalizator se na koncu obnovi in se ne porablja."], ["Premakne ravnotežje v smer produktov.", "Katalizator enako pospeši obe smeri, zato ravnotežja ne premakne."]], sol: ["Katalizator reakciji ponudi drugačno pot (mehanizem).", "Ta pot ima nižjo aktivacijsko energijo, zato je več uspešnih trkov."] },
  { q: "Magnezij reagira s klorovodikovo kislino s koncentracijo 2 mol/L hitreje kot s kislino s koncentracijo 0,5 mol/L. Zakaj?", ok: "V večji koncentraciji je več delcev kisline v enoti prostornine, zato so trki pogostejši.", wrong: [["Večja koncentracija zniža aktivacijsko energijo.", "Aktivacijsko energijo zniža le katalizator; koncentracija vpliva na pogostost trkov."], ["Bolj koncentrirana kislina je toplejša.", "Temperatura je lahko enaka; razlika je v številu delcev v prostornini."], ["V redkejši kislini je več vode, ki reagira z magnezijem.", "Voda reagira z magnezijem zelo počasi; odloča koncentracija H₃O⁺."]], sol: ["Hitrost je odvisna od pogostosti trkov reaktantov.", "Več delcev v enoti prostornine pomeni več trkov in hitrejšo reakcijo."] },
  { q: "Kateri ukrep NE pospeši reakcije marmorja (CaCO₃) s klorovodikovo kislino?", ok: "Uporaba večjih kosov marmorja.", wrong: [["Segrevanje kisline.", "Pri višji temperaturi je več uspešnih trkov – reakcija se pospeši."], ["Uporaba zdrobljenega marmorja.", "Večja površina pospeši reakcijo."], ["Uporaba bolj koncentrirane kisline.", "Več delcev kisline pomeni pogostejše trke – reakcija se pospeši."]], sol: ["Večji kosi imajo manjšo skupno površino.", "Trkov je manj, zato reakcija poteka počasneje, ne hitreje."] },
  { q: "Zakaj se raztopina vodikovega peroksida po dodatku manganovega dioksida (MnO₂) burno peni?", ok: "MnO₂ je katalizator razkroja H₂O₂ na vodo in kisik.", wrong: [["MnO₂ reagira s H₂O₂ in se pri tem porabi.", "Masa MnO₂ je po reakciji enaka – ne porablja se."], ["MnO₂ segreje raztopino.", "Raztopina se segreje zaradi eksotermnega razkroja, ne zaradi MnO₂ samega."], ["MnO₂ poveča koncentracijo H₂O₂.", "Dodatek trdnine ne poveča koncentracije H₂O₂."]], sol: ["MnO₂ zniža aktivacijsko energijo razkroja 2 H₂O₂ → 2 H₂O + O₂.", "Kisik hitro nastaja in povzroči penjenje; MnO₂ ostane nespremenjen."] },
  { q: "Kaj so encimi?", ok: "Biološki katalizatorji (beljakovine), ki pospešijo reakcije v organizmih.", wrong: [["Reaktanti, ki se pri presnovi porabijo.", "Encim se po reakciji obnovi in deluje znova."], ["Snovi, ki upočasnijo vse reakcije v celici.", "Encimi reakcije pospešijo; upočasnjujejo jih inhibitorji."], ["Vir energije za celico.", "Energijo daje oksidacija hranil; encimi le pospešijo reakcije."]], sol: ["Encimi so beljakovine, ki znižajo aktivacijsko energijo.", "Pri reakciji se ne porabijo – so katalizatorji."] },
  { q: "Zakaj reakcija pri višji temperaturi poteka hitreje?", ok: "Večji delež delcev ima energijo, ki je enaka aktivacijski energiji ali večja od nje.", wrong: [["Pri višji temperaturi se zniža aktivacijska energija.", "Aktivacijska energija ostane enaka; spremeni se porazdelitev energij delcev."], ["Pri višji temperaturi je v posodi več delcev.", "Število delcev je enako; hitreje se gibljejo."], ["Pri višji temperaturi je ΔH bolj negativna.", "ΔH se s temperaturo skoraj ne spremeni in ne določa hitrosti."]], sol: ["Delci se gibljejo hitreje in pogosteje trkajo.", "Predvsem pa ima več trkov dovolj energije za reakcijo."] },
  { q: "Zakaj premogov prah v rudniku lahko eksplodira, kos premoga pa le počasi gori?", ok: "Prah ima ogromno površino, zato reagira s kisikom skoraj hkrati.", wrong: [["Premogov prah vsebuje eksploziv.", "Prah je isti ogljik; razlika je v površini."], ["Kos premoga ne vsebuje ogljika.", "Oba sta iz ogljika."], ["V prahu je več kisika kot v kosu premoga.", "Kisik je v zraku; prah ima le večjo površino za stik z njim."]], sol: ["Površina drobnih delcev je mnogo večja kot pri kosu.", "Reakcija je zato tako hitra, da pride do eksplozije."] },
];

const isProd = (eq, f) => sideTerms(eq.split(" -> ")[1]).some((t) => t[1] === f);
const genHitrost = {
  id: "dod-kem-ss-hitrost-reakcij",
  topics: ["KEM-SS-2/hitrost-reakcij"],
  gen(level, r) {
    const name = nm(r);
    if (level === 1) {
      if (r.next() < 0.4) return concept(r, { ...r.pick(RATE_WHY), given: null, hint: "Pomisli na trke delcev: kako pogosti so in koliko jih ima dovolj energije?" });
      const [F, gen] = r.pick([["H2O2", "vodikovega peroksida"], ["N2O5", "didušikovega pentoksida"], ["HCl", "klorovodikove kisline"], ["CH3COOC2H5", "etil etanoata"], ["C12H22O11", "saharoze"]]);
      const c1 = r.dec(0.5, 2, 2);
      const c2 = roundHalfUp(c1 * r.dec(0.2, 0.8, 2), 2);
      const dt = r.int(2, 20);
      const v = (c1 - c2) / dt;
      return mk(
        r.pick([
          `Koncentracija ${gen} se v $${dt}\\ \\mathrm{min}$ zmanjša s $${tx(c1)}\\ \\mathrm{mol/L}$ na $${tx(c2)}\\ \\mathrm{mol/L}$. Kolikšna je povprečna hitrost reakcije v $\\mathrm{mol/(L\\cdot min)}$? ${zaokr(3)}`,
          `${name} ${g(name, "meri", "meri")} koncentracijo ${gen} ($${sp(F)}$): na začetku $${tx(c1)}\\ \\mathrm{mol/L}$, po $${dt}\\ \\mathrm{min}$ pa $${tx(c2)}\\ \\mathrm{mol/L}$. Izračunaj povprečno hitrost porabljanja v $\\mathrm{mol/(L\\cdot min)}$. ${zaokr(3)}`,
        ]),
        num(v, "mol/(L·min)", 3, [[c2 / dt, "Si delil končno koncentracijo? Hitrost je sprememba koncentracije na čas."], [c1 / dt, "Si delil začetno koncentracijo? Potrebuješ razliko c₁ − c₂."], [(c1 - c2) * dt, "Si spremembo koncentracije pomnožil s časom? Deliti moraš."]], U_RATE),
        "Povprečna hitrost je sprememba koncentracije, deljena s časom.",
        [dat("c_1", tx(c1), "mol/L"), dat("c_2", tx(c2), "mol/L"), dat("\\Delta t", dt, "min")], ["v"], ["v = \\dfrac{|\\Delta c|}{\\Delta t}"],
        [`$\\Delta c = ${tx(c1)} - ${tx(c2)} = ${qty(tx(c1 - c2, 2), "mol/L")}$`, `$v = \\dfrac{${tx(c1 - c2, 2)}}{${dt}}\\ \\mathrm{mol/(L\\cdot min)} ${res(v, 3, "mol/(L\\cdot min)")}$`]
      );
    }
    if (level === 2) {
      if (r.next() < 0.5) {
        const q = r.pick([2, 3]);
        const t1 = r.int(1, 4) * 5 + 10;
        const steps = r.int(2, 4);
        const t2 = t1 + 10 * steps;
        const factor = q ** steps;
        return mk(
          r.pick([
            `Hitrost reakcije se pri dvigu temperature za $10\\ {}^\\circ\\mathrm{C}$ poveča $${q}$-krat. Kolikokrat hitrejša je reakcija pri $${t2}\\ {}^\\circ\\mathrm{C}$ kot pri $${t1}\\ {}^\\circ\\mathrm{C}$?`,
            `${name} ${g(name, "je ugotovil", "je ugotovila")}, da se hitrost reakcije ob vsakem dvigu temperature za $10\\ {}^\\circ\\mathrm{C}$ poveča za faktor $${q}$. Kolikokrat se hitrost poveča, če reakcijsko zmes segreje z $${t1}\\ {}^\\circ\\mathrm{C}$ na $${t2}\\ {}^\\circ\\mathrm{C}$?`,
          ]),
          num(factor, null, 0, [[q * steps, `Si faktorje seštel? Vsak dvig za 10 °C hitrost pomnoži s ${q}.`], [q ** (steps + 1), "Preveri število korakov po 10 °C."]]),
          "Ugotovi, kolikokrat po $10\\ {}^\\circ\\mathrm{C}$ se temperatura dvigne; faktorji se množijo.",
          [dat("t_1", t1, "°C"), dat("t_2", t2, "°C"), dat("q", q)], ["\\dfrac{v_2}{v_1}"], ["\\dfrac{v_2}{v_1} = q^{\\Delta t / 10\\,^\\circ\\mathrm{C}}"],
          [`$\\Delta t = ${t2} - ${t1} = ${t2 - t1}\\ {}^\\circ\\mathrm{C}$, to je ${steps} koraki po $10\\ {}^\\circ\\mathrm{C}$`, `$\\dfrac{v_2}{v_1} = ${q}^{${steps}} = ${factor}$`]
        );
      }
      const [eq, A, cA, B, cB] = r.pick(RATE_RX);
      const vA = r.dec(0.02, 0.6, 2);
      const vB = (vA * cB) / cA;
      return mk(
        r.pick([
          `Pri reakciji\n\n$$${eqTex(eq)}$$\n\nse ${isProd(eq, A) ? "tvori" : "porablja"} $${sp(A)}$ s hitrostjo $${tx(vA)}\\ \\mathrm{mol/(L\\cdot s)}$. S kolikšno hitrostjo se ${isProd(eq, B) ? "tvori" : "porablja"} $${sp(B)}$? ${zaokr(3)}`,
          `${name} ${g(name, "opazuje", "opazuje")} reakcijo $${eqTex(eq)}$. Snov $${sp(A)}$ se ${isProd(eq, A) ? "tvori" : "porablja"} s hitrostjo $${tx(vA)}\\ \\mathrm{mol/(L\\cdot s)}$. Kolikšna je hitrost ${isProd(eq, B) ? "nastajanja" : "porabljanja"} $${sp(B)}$? ${zaokr(3)}`,
        ]),
        num(vB, "mol/(L·s)", 3, [[vA, "Hitrosti za različne snovi niso enake – upoštevaj koeficiente."], [(vA * cA) / cB, "Si razmerje koeficientov obrnil?"]], U_RATE_S),
        "Hitrosti porabljanja in nastajanja so v enakem razmerju kot koeficienti v enačbi.",
        [dat(`v(${sp(A)})`, tx(vA), "mol/(L\\cdot s)")], [`v(${sp(B)})`], [`\\dfrac{v(${sp(B)})}{v(${sp(A)})} = \\dfrac{${cB}}{${cA}}`],
        [`Razmerje koeficientov: $${sp(B)} : ${sp(A)} = ${cB} : ${cA}$`, `$v(${sp(B)}) = ${tx(vA)} \\cdot \\dfrac{${cB}}{${cA}} ${res(vB, 3, "mol/(L\\cdot s)")}$`]
      );
    }
    if (r.next() < 0.5) {
      const q = r.pick([2, 3]);
      const t1 = r.pick([15, 20, 25]);
      const steps = r.int(1, 3);
      const t2 = t1 + 10 * steps;
      const tm1 = r.int(2, 30) * q ** steps;
      const tm2 = tm1 / q ** steps;
      return mk(
        r.pick([
          `Reakcija pri $${t1}\\ {}^\\circ\\mathrm{C}$ poteče v $${tm1}\\ \\mathrm{min}$. Hitrost se pri dvigu za $10\\ {}^\\circ\\mathrm{C}$ poveča $${q}$-krat. V kolikšnem času poteče pri $${t2}\\ {}^\\circ\\mathrm{C}$?`,
          `${name} pri $${t1}\\ {}^\\circ\\mathrm{C}$ ${g(name, "čaka", "čaka")} $${tm1}\\ \\mathrm{min}$, da se raztopina razbarva. Koliko minut bi čakal${g(name, "", "a")} pri $${t2}\\ {}^\\circ\\mathrm{C}$, če se hitrost ob dvigu za $10\\ {}^\\circ\\mathrm{C}$ poveča za faktor $${q}$?`,
        ]),
        num(tm2, "min", 1, [[tm1 * q ** steps, "Pri višji temperaturi je reakcija hitrejša, zato traja krajši čas."], [tm1 / (q * steps), "Faktorji se množijo, ne seštevajo."]]),
        "Najprej izračunaj, kolikokrat je reakcija hitrejša; čas je obratno sorazmeren s hitrostjo.",
        [dat("t_1", t1, "°C"), dat("t_2", t2, "°C"), dat("\\tau_1", tm1, "min"), dat("q", q)], ["\\tau_2"], ["\\dfrac{v_2}{v_1} = q^{\\Delta t / 10\\,^\\circ\\mathrm{C}}", "\\tau_2 = \\dfrac{\\tau_1}{v_2 / v_1}"],
        [`$\\dfrac{v_2}{v_1} = ${q}^{${steps}} = ${q ** steps}$`, `$\\tau_2 = \\dfrac{${tm1}\\ \\mathrm{min}}{${q ** steps}} ${res(tm2, 1, "min")}$`]
      );
    }
    // Tvorba produkta → poraba reaktanta (dva koraka: povprečna hitrost in razmerje koeficientov)
    const [eq, A, cA, B, cB] = r.pick(RATE_RX);
    const dc = r.dec(0.1, 1.2, 2);
    const dt = r.int(2, 15) * 10;
    const vA = dc / dt;
    const vB = (vA * cB) / cA;
    const verbA = isProd(eq, A) ? "naraste" : "zmanjša";
    const verbB = isProd(eq, B) ? "nastajanja" : "porabljanja";
    return mk(
      `Pri reakciji\n\n$$${eqTex(eq)}$$\n\nse koncentracija $${sp(A)}$ v $${dt}\\ \\mathrm{s}$ ${verbA === "naraste" ? "poveča" : "zmanjša"} za $${tx(dc)}\\ \\mathrm{mol/L}$. Kolikšna je povprečna hitrost ${verbB} $${sp(B)}$ v $\\mathrm{mol/(L\\cdot s)}$? ${zaokr(4)}`,
      num(vB, "mol/(L·s)", 4, [[vA, "To je hitrost za snov z znano spremembo; preračunaj s koeficienti."], [(vA * cA) / cB, "Si razmerje koeficientov obrnil?"], [(dc * cB) / cA, "Si pozabil deliti s časom?"]], U_RATE_S),
      "Najprej izračunaj povprečno hitrost za snov, katere spremembo poznaš, nato jo preračunaj z razmerjem koeficientov.",
      [dat(`\\Delta c(${sp(A)})`, tx(dc), "mol/L"), dat("\\Delta t", dt, "s")], [`v(${sp(B)})`], ["v = \\dfrac{|\\Delta c|}{\\Delta t}", `\\dfrac{v(${sp(B)})}{v(${sp(A)})} = \\dfrac{${cB}}{${cA}}`],
      [`$v(${sp(A)}) = \\dfrac{${tx(dc)}}{${dt}}\\ \\mathrm{mol/(L\\cdot s)} \\approx ${tx(vA, 5)}\\ \\mathrm{mol/(L\\cdot s)}$`, `$v(${sp(B)}) = v(${sp(A)}) \\cdot \\dfrac{${cB}}{${cA}} ${res(vB, 4, "mol/(L\\cdot s)")}$`]
    );
  },
};

// ---------- kemijsko ravnotežje ----------
// Reakcije: [reaktanti [[koef, snov]], produkti, ΔH > 0 ?, opis]
const EQ_RX = [
  { l: [[1, "H2"], [1, "I2"]], p: [[2, "HI"]], dH: -1, s: "g" },
  { l: [[1, "N2O4"]], p: [[2, "NO2"]], dH: 1, s: "g" },
  { l: [[1, "CO"], [1, "H2O"]], p: [[1, "CO2"], [1, "H2"]], dH: -1, s: "g" },
  { l: [[1, "PCl5"]], p: [[1, "PCl3"], [1, "Cl2"]], dH: 1, s: "g" },
  { l: [[1, "N2"], [1, "O2"]], p: [[2, "NO"]], dH: 1, s: "g" },
  { l: [[1, "N2"], [3, "H2"]], p: [[2, "NH3"]], dH: -1, s: "g" },
  { l: [[2, "SO2"], [1, "O2"]], p: [[2, "SO3"]], dH: -1, s: "g" },
  { l: [[1, "CO"], [2, "H2"]], p: [[1, "CH3OH"]], dH: -1, s: "g" },
];
const rxTex = (x, arrow = "\\rightleftharpoons") => `${x.l.map(([c, f]) => `${c > 1 ? c : ""}${sp(f)}`).join(" + ")} ${arrow} ${x.p.map(([c, f]) => `${c > 1 ? c : ""}${sp(f)}`).join(" + ")}`;
const conc = (f) => `[${sp(f)}]`;
const kExpr = (x) => `K_c = \\dfrac{${x.p.map(([c, f]) => `${conc(f)}${c > 1 ? `^${c}` : ""}`).join("")}}{${x.l.map(([c, f]) => `${conc(f)}${c > 1 ? `^${c}` : ""}`).join("")}}`;
const kDec = (K) => (K >= 10 ? 1 : K >= 1 ? 2 : 3);

const genRavnotezje = {
  id: "dod-kem-ss-kemijsko-ravnotezje",
  topics: ["KEM-SS-2/kemijsko-ravnotezje"],
  gen(level, r) {
    const name = nm(r);
    if (level === 1) {
      const x = r.pick(EQ_RX.filter((e) => e.l.every(([c]) => c === 1)));
      let cs, K;
      do {
        cs = {};
        for (const [, f] of [...x.l, ...x.p]) cs[f] = r.dec(0.05, 0.9, 2);
        K = x.p.reduce((s, [c, f]) => s * cs[f] ** c, 1) / x.l.reduce((s, [c, f]) => s * cs[f] ** c, 1);
      } while (K < 0.01 || K > 500);
      const noExp = x.p.reduce((s, [, f]) => s * cs[f], 1) / x.l.reduce((s, [, f]) => s * cs[f], 1);
      const d = kDec(K);
      const list = Object.entries(cs).map(([f, v]) => `$${conc(f)} = ${tx(v)}\\ \\mathrm{mol/L}$`).join(", ");
      return mk(
        r.pick([`Za ravnotežje $${rxTex(x)}$ so ravnotežne koncentracije ${list}. Izračunaj vrednost konstante ravnotežja $K_c$. ${zaokr(d)}`, `${name} ${g(name, "je izmeril", "je izmerila")} ravnotežne koncentracije pri reakciji $${rxTex(x)}$: ${list}. Kolikšna je vrednost $K_c$? ${zaokr(d)}`]),
        num(K, null, d, [[1 / K, "Si obrnil ulomek? V števcu so produkti, v imenovalcu reaktanti."], [noExp, "Si upošteval koeficiente kot eksponente?"]]),
        "Zapiši izraz za $K_c$: produkti v števcu, reaktanti v imenovalcu, koeficienti so eksponenti.",
        Object.entries(cs).map(([f, v]) => dat(conc(f), tx(v), "mol/L")), ["K_c"], [kExpr(x)],
        [`$${kExpr(x)}$`, `$K_c = \\dfrac{${x.p.map(([c, f]) => `${tx(cs[f])}${c > 1 ? `^${c}` : ""}`).join(" \\cdot ")}}{${x.l.map(([c, f]) => `${tx(cs[f])}${c > 1 ? `^${c}` : ""}`).join(" \\cdot ")}} ${res(K, d)}$`]
      );
    }
    if (level === 2) {
      if (r.next() < 0.5) {
        // Le Chatelierjevo načelo
        const x = r.pick(EQ_RX);
        const nl = x.l.reduce((s, [c]) => s + c, 0), np = x.p.reduce((s, [c]) => s + c, 0);
        const changes = [
          ["zvišamo temperaturo", x.dH > 0 ? 1 : -1, `Reakcija v desno je ${x.dH > 0 ? "endotermna" : "eksotermna"}; dovedeno toploto sistem porabi z ${x.dH > 0 ? "endotermno smerjo (v desno)" : "endotermno smerjo (v levo)"}.`],
          ["znižamo temperaturo", x.dH > 0 ? -1 : 1, `Pri ohlajanju se pospeši eksotermna smer, ki je ${x.dH > 0 ? "v levo" : "v desno"}.`],
          ["povečamo tlak (zmanjšamo prostornino)", np < nl ? 1 : np > nl ? -1 : 0, np === nl ? `Na obeh straneh je ${nl} mol plina, zato tlak ne vpliva na lego ravnotežja.` : `Sistem zmanjša tlak s premikom na stran z manj molekulami plina (${Math.min(nl, np)} mol).`],
          ["zmanjšamo tlak (povečamo prostornino)", np < nl ? -1 : np > nl ? 1 : 0, np === nl ? `Na obeh straneh je ${nl} mol plina, zato tlak ne vpliva na lego ravnotežja.` : `Sistem poveča tlak s premikom na stran z več molekulami plina (${Math.max(nl, np)} mol).`],
          [`dodamo ${spU(x.l[0][1])}`, 1, `Dodani reaktant se porablja – ravnotežje se premakne v desno.`],
          [`odvajamo ${spU(x.p[0][1])}`, 1, `Sistem nadomešča odvzeti produkt – ravnotežje se premakne v desno.`],
          [`dodamo ${spU(x.p[x.p.length - 1][1])}`, -1, `Dodani produkt se porablja – ravnotežje se premakne v levo.`],
          ["dodamo katalizator", 0, "Katalizator enako pospeši obe smeri, zato ravnotežja ne premakne (le hitreje se vzpostavi)."],
        ];
        const [ch, dir, expl] = r.pick(changes);
        const OPT = { 1: "v desno (proti produktom)", [-1]: "v levo (proti reaktantom)", 0: "se ne premakne" };
        const ok = OPT[dir];
        const wrongWhy = (d2) => (dir === 0 ? expl : d2 === 0 ? `Ta sprememba vpliva na lego ravnotežja. ${expl}` : `Sistem se spremembi upre, ne pa je okrepi. ${expl}`);
        return concept(r, {
          q: r.pick([`Pri ravnotežju $${rxTex(x)}$ ($\\Delta H ${x.dH > 0 ? ">" : "<"} 0$, vse snovi so plini) ${ch}. Kam se premakne ravnotežje?`, `Sistem $${rxTex(x)}$ ($\\Delta H ${x.dH > 0 ? ">" : "<"} 0$, plini) je v ravnotežju. ${name} ${g(name, "sprašuje", "sprašuje")}, kaj se zgodi, če ${ch}. Kam se premakne ravnotežje?`]),
          ok,
          wrong: [1, -1, 0].filter((d2) => d2 !== dir).map((d2) => [OPT[d2], wrongWhy(d2)]),
          hint: "Le Chatelierjevo načelo: sistem se spremembi delno upre. Pri temperaturi poglej predznak ΔH, pri tlaku število molov plina na obeh straneh.",
          given: null,
          sol: [expl, `Ravnotežje se ${dir === 0 ? "ne premakne" : `premakne ${OPT[dir]}`}.`],
        });
      }
      // Neznana ravnotežna koncentracija
      const cases = [
        { x: EQ_RX[0], find: "HI", calc: (c, K) => Math.sqrt(K * c.H2 * c.I2), sol: (c, K) => `[\\mathrm{HI}] = \\sqrt{K_c \\cdot [\\mathrm{H_2}][\\mathrm{I_2}]} = \\sqrt{${tx(K)} \\cdot ${tx(c.H2)} \\cdot ${tx(c.I2)}}`, f: "[\\mathrm{HI}] = \\sqrt{K_c [\\mathrm{H_2}][\\mathrm{I_2}]}", mis: (c, K) => [[K * c.H2 * c.I2, "Si pozabil koreniti? [HI] je v izrazu na kvadrat."]] },
        { x: EQ_RX[1], find: "NO2", calc: (c, K) => Math.sqrt(K * c.N2O4), sol: (c, K) => `[\\mathrm{NO_2}] = \\sqrt{K_c \\cdot [\\mathrm{N_2O_4}]} = \\sqrt{${tx(K)} \\cdot ${tx(c.N2O4)}}`, f: "[\\mathrm{NO_2}] = \\sqrt{K_c [\\mathrm{N_2O_4}]}", mis: (c, K) => [[K * c.N2O4, "Si pozabil koreniti? [NO₂] je v izrazu na kvadrat."]] },
        { x: EQ_RX[3], find: "PCl5", calc: (c, K) => (c.PCl3 * c.Cl2) / K, sol: (c, K) => `[\\mathrm{PCl_5}] = \\dfrac{[\\mathrm{PCl_3}][\\mathrm{Cl_2}]}{K_c} = \\dfrac{${tx(c.PCl3)} \\cdot ${tx(c.Cl2)}}{${tx(K)}}`, f: "[\\mathrm{PCl_5}] = \\dfrac{[\\mathrm{PCl_3}][\\mathrm{Cl_2}]}{K_c}", mis: (c, K) => [[c.PCl3 * c.Cl2 * K, "Si množil s K namesto delil? Izrazi [PCl₅] iz izraza za K."]] },
        { x: EQ_RX[2], find: "CO2", calc: (c, K) => (K * c.CO * c.H2O) / c.H2, sol: (c, K) => `[\\mathrm{CO_2}] = \\dfrac{K_c [\\mathrm{CO}][\\mathrm{H_2O}]}{[\\mathrm{H_2}]} = \\dfrac{${tx(K)} \\cdot ${tx(c.CO)} \\cdot ${tx(c.H2O)}}{${tx(c.H2)}}`, f: "[\\mathrm{CO_2}] = \\dfrac{K_c [\\mathrm{CO}][\\mathrm{H_2O}]}{[\\mathrm{H_2}]}", mis: (c, K) => [[(c.CO * c.H2O) / (K * c.H2), "Preveri, kako izraziš [CO₂]: K je v števcu."]] },
      ];
      const cs0 = r.pick(cases);
      const c = {};
      for (const [, f] of [...cs0.x.l, ...cs0.x.p]) if (f !== cs0.find) c[f] = r.dec(0.1, 0.9, 2);
      const K = r.pick([0.5, 1.6, 2.5, 4, 5.2, 10, 25, 50, 64]);
      const val = cs0.calc(c, K);
      const list = Object.entries(c).map(([f, v]) => `$${conc(f)} = ${tx(v)}\\ \\mathrm{mol/L}$`).join(", ");
      return mk(
        `Za ravnotežje $${rxTex(cs0.x)}$ je $K_c = ${tx(K)}$. V ravnotežju je ${list}. Kolikšna je ravnotežna koncentracija $${sp(cs0.find)}$? ${zaokr(3)}`,
        num(val, "mol/L", 3, cs0.mis(c, K), U_CONC),
        "Zapiši izraz za $K_c$ in iz njega izrazi neznano koncentracijo.",
        [dat("K_c", tx(K)), ...Object.entries(c).map(([f, v]) => dat(conc(f), tx(v), "mol/L"))], [conc(cs0.find)], [kExpr(cs0.x), cs0.f],
        [`$${kExpr(cs0.x)}$`, `$${cs0.sol(c, K)}$`, `$${conc(cs0.find)} ${res(val, 3, "mol/L")}$`]
      );
    }
    const kind = r.int(0, 2);
    if (kind === 0) {
      const a = r.dec(0.5, 2, 1), b = r.dec(0.5, 2, 1);
      const xHI = roundHalfUp(2 * Math.min(a, b) * r.dec(0.4, 0.85, 2), 2);
      const cH2 = a - xHI / 2, cI2 = b - xHI / 2;
      const K = xHI ** 2 / (cH2 * cI2);
      const d = kDec(K);
      return mk(
        `V posodi s prostornino $1\\ \\mathrm{L}$ zmešamo $${tx(a)}\\ \\mathrm{mol}$ $\\mathrm{H_2}$ in $${tx(b)}\\ \\mathrm{mol}$ $\\mathrm{I_2}$. V ravnotežju $\\mathrm{H_2 + I_2 \\rightleftharpoons 2HI}$ je $${tx(xHI)}\\ \\mathrm{mol}$ $\\mathrm{HI}$. Izračunaj $K_c$. ${zaokr(d)}`,
        num(K, null, d, [[a > xHI && b > xHI ? xHI ** 2 / ((a - xHI) * (b - xHI)) : NaN, "Za 2 mol HI se porabi le 1 mol H₂ in 1 mol I₂."], [xHI ** 2 / (a * b), "V izraz vstavi ravnotežne, ne začetnih koncentracij."], [xHI / (cH2 * cI2), "Si pozabil kvadrirati [HI]?"]]),
        "Sestavi tabelo: začetno – sprememba – ravnotežje. Za $2x$ mol HI se porabi $x$ mol $\\mathrm{H_2}$ in $x$ mol $\\mathrm{I_2}$.",
        [dat("n_0(\\mathrm{H_2})", tx(a), "mol"), dat("n_0(\\mathrm{I_2})", tx(b), "mol"), dat("n(\\mathrm{HI})", tx(xHI), "mol"), dat("V", 1, "L")], ["K_c"], ["K_c = \\dfrac{[\\mathrm{HI}]^2}{[\\mathrm{H_2}][\\mathrm{I_2}]}"],
        [`Porabi se $\\dfrac{${tx(xHI)}}{2} = ${tx(xHI / 2, 3)}\\ \\mathrm{mol}$ $\\mathrm{H_2}$ in enako $\\mathrm{I_2}$.`, `$[\\mathrm{H_2}] = ${tx(a)} - ${tx(xHI / 2, 3)} = ${tx(cH2, 3)}\\ \\mathrm{mol/L}$, $[\\mathrm{I_2}] = ${tx(b)} - ${tx(xHI / 2, 3)} = ${tx(cI2, 3)}\\ \\mathrm{mol/L}$`, `$K_c = \\dfrac{${tx(xHI)}^2}{${tx(cH2, 3)} \\cdot ${tx(cI2, 3)}} ${res(K, d)}$`]
      );
    }
    if (kind === 1) {
      const c0 = r.dec(0.1, 1, 2);
      const al = r.int(10, 60);
      const cNO2 = 2 * c0 * al / 100, cN = c0 * (1 - al / 100);
      const K = cNO2 ** 2 / cN;
      const d = kDec(K);
      return mk(
        `Začetna koncentracija $\\mathrm{N_2O_4}$ je $${tx(c0)}\\ \\mathrm{mol/L}$. Do vzpostavitve ravnotežja $\\mathrm{N_2O_4 \\rightleftharpoons 2NO_2}$ razpade $${al}\\ \\%$ $\\mathrm{N_2O_4}$. Izračunaj $K_c$. ${zaokr(d)}`,
        num(K, null, d, [[(c0 * al / 100) ** 2 / cN, "Iz 1 mol N₂O₄ nastaneta 2 mol NO₂."], [cNO2 ** 2 / c0, "V imenovalec vstavi ravnotežno, ne začetne koncentracije N₂O₄."], [cNO2 / cN, "Si pozabil kvadrirati [NO₂]?"]]),
        "Izračunaj, koliko $\\mathrm{N_2O_4}$ razpade; nastane dvakrat toliko $\\mathrm{NO_2}$.",
        [dat("c_0(\\mathrm{N_2O_4})", tx(c0), "mol/L"), `\\alpha = ${al}\\ \\%`], ["K_c"], ["K_c = \\dfrac{[\\mathrm{NO_2}]^2}{[\\mathrm{N_2O_4}]}"],
        [`Razpade: $${al}\\ \\% \\cdot ${tx(c0)} = ${tx((c0 * al) / 100, 4)}\\ \\mathrm{mol/L}$`, `$[\\mathrm{NO_2}] = 2 \\cdot ${tx((c0 * al) / 100, 4)} = ${tx(cNO2, 4)}\\ \\mathrm{mol/L}$, $[\\mathrm{N_2O_4}] = ${tx(cN, 4)}\\ \\mathrm{mol/L}$`, `$K_c = \\dfrac{${tx(cNO2, 4)}^2}{${tx(cN, 4)}} ${res(K, d)}$`]
      );
    }
    const V = r.int(2, 5);
    const n0 = r.dec(0.5, 3, 1);
    const y = roundHalfUp(n0 * r.dec(0.2, 0.7, 2), 2);
    const cP = (n0 - y) / V, cy = y / V;
    const K = (cy * cy) / cP;
    const d = kDec(K);
    return mk(
      `V posodo s prostornino $${V}\\ \\mathrm{L}$ damo $${tx(n0)}\\ \\mathrm{mol}$ $\\mathrm{PCl_5}$. V ravnotežju $\\mathrm{PCl_5 \\rightleftharpoons PCl_3 + Cl_2}$ je v posodi $${tx(y)}\\ \\mathrm{mol}$ $\\mathrm{Cl_2}$. Izračunaj $K_c$. ${zaokr(d)}`,
      num(K, null, d, [[(y * y) / (n0 - y), "V izraz za K vstavi koncentracije (n / V), ne množin."], [(cy * cy) / (n0 / V), "V imenovalec vstavi ravnotežno koncentracijo PCl₅."]]),
      "Ravnotežne množine izračunaj s tabelo, nato jih deli s prostornino posode.",
      [dat("V", V, "L"), dat("n_0(\\mathrm{PCl_5})", tx(n0), "mol"), dat("n(\\mathrm{Cl_2})", tx(y), "mol")], ["K_c"], ["K_c = \\dfrac{[\\mathrm{PCl_3}][\\mathrm{Cl_2}]}{[\\mathrm{PCl_5}]}", "c = \\dfrac{n}{V}"],
      [`$n(\\mathrm{PCl_3}) = n(\\mathrm{Cl_2}) = ${tx(y)}\\ \\mathrm{mol}$, $n(\\mathrm{PCl_5}) = ${tx(n0)} - ${tx(y)} = ${tx(n0 - y, 2)}\\ \\mathrm{mol}$`, `$[\\mathrm{Cl_2}] = [\\mathrm{PCl_3}] = \\dfrac{${tx(y)}}{${V}} = ${tx(cy, 4)}\\ \\mathrm{mol/L}$, $[\\mathrm{PCl_5}] = \\dfrac{${tx(n0 - y, 2)}}{${V}} = ${tx(cP, 4)}\\ \\mathrm{mol/L}$`, `$K_c = \\dfrac{${tx(cy, 4)}^2}{${tx(cP, 4)}} ${res(K, d)}$`]
    );
  },
};

// ---------- kisline in baze (Brønsted-Lowry) ----------
// [vprašanje, zvrst, pravilni odgovor, [[napačni, oznaka napake]]]
const CONJ = [
  ["baza", "HCl", "Cl^-", [["Cl", "H"], ["OH^-", "OH"], ["H2Cl^+", "UP"]]],
  ["baza", "HNO3", "NO3^-", [["NO3", "H"], ["H2NO3^+", "UP"], ["OH^-", "OH"]]],
  ["baza", "H2SO4", "HSO4^-", [["SO4^2-", "TWO"], ["HSO4", "H"], ["H3SO4^+", "UP"]]],
  ["baza", "HSO4^-", "SO4^2-", [["H2SO4", "UP"], ["SO4^-", "H"], ["OH^-", "OH"]]],
  ["baza", "H3O^+", "H2O", [["OH^-", "TWO"], ["H2O^+", "H"], ["H4O^2+", "UP"]]],
  ["baza", "H2O", "OH^-", [["H3O^+", "UP"], ["O^2-", "TWO"], ["OH", "H"]]],
  ["baza", "NH4^+", "NH3", [["NH2^-", "TWO"], ["NH3^+", "H"], ["OH^-", "OH"]]],
  ["baza", "CH3COOH", "CH3COO^-", [["CH3COO", "H"], ["CH3COOH2^+", "UP"], ["OH^-", "OH"]]],
  ["baza", "H2CO3", "HCO3^-", [["CO3^2-", "TWO"], ["HCO3", "H"], ["H3CO3^+", "UP"]]],
  ["baza", "HCO3^-", "CO3^2-", [["H2CO3", "UP"], ["CO3^-", "H"], ["OH^-", "OH"]]],
  ["baza", "H3PO4", "H2PO4^-", [["HPO4^2-", "TWO"], ["H2PO4", "H"], ["H4PO4^+", "UP"]]],
  ["baza", "HF", "F^-", [["F", "H"], ["OH^-", "OH"], ["H2F^+", "UP"]]],
  ["kislina", "NH3", "NH4^+", [["NH2^-", "DOWN"], ["NH4", "H"], ["H3O^+", "H3O"]]],
  ["kislina", "OH^-", "H2O", [["O^2-", "DOWN"], ["H3O^+", "TWO"], ["H2O^-", "H"]]],
  ["kislina", "CO3^2-", "HCO3^-", [["H2CO3", "TWO"], ["HCO3^2-", "H"], ["H3O^+", "H3O"]]],
  ["kislina", "HCO3^-", "H2CO3", [["CO3^2-", "DOWN"], ["H2CO3^-", "H"], ["H3O^+", "H3O"]]],
  ["kislina", "H2O", "H3O^+", [["OH^-", "DOWN"], ["H3O", "H"], ["H4O^2+", "TWO"]]],
  ["kislina", "CH3COO^-", "CH3COOH", [["CH3COOH^-", "H"], ["CH3COOH2^+", "TWO"], ["H3O^+", "H3O"]]],
  ["kislina", "F^-", "HF", [["HF^-", "H"], ["H2F^+", "TWO"], ["H3O^+", "H3O"]]],
  ["kislina", "SO4^2-", "HSO4^-", [["H2SO4", "TWO"], ["HSO4^2-", "H"], ["H3O^+", "H3O"]]],
];
const CONJ_WHY = (q, tag) =>
  ({
    H: q === "baza" ? "Kislina odda proton H⁺ (ne atoma H), zato se naboj zmanjša za 1." : "Baza sprejme proton H⁺ (ne atoma H), zato se naboj poveča za 1.",
    UP: "Ta zvrst ima en proton več – to bi bila konjugirana kislina, ne baza.",
    DOWN: "Ta zvrst ima en proton manj – to je konjugirana baza, ne kislina.",
    TWO: "Konjugirana kislina in baza se razlikujeta za natanko en proton.",
    OH: "OH⁻ je konjugirana baza vode, ne te kisline.",
    H3O: "H₃O⁺ je konjugirana kislina vode, ne te baze.",
  })[tag];
// Reakcije: zvrsti [r1, r2, p1, p2], indeksi: a = kislina, b = baza, ca = konjugirana kislina, cb = konjugirana baza
const BL_RX = [
  ["HCl + H2O -> H3O^+ + Cl^-", 0, 1, 2, 3], ["NH3 + H2O <=> NH4^+ + OH^-", 1, 0, 2, 3], ["CH3COOH + H2O <=> CH3COO^- + H3O^+", 0, 1, 3, 2],
  ["HCO3^- + H2O <=> H2CO3 + OH^-", 1, 0, 2, 3], ["HCO3^- + H2O <=> CO3^2- + H3O^+", 0, 1, 3, 2], ["NH4^+ + OH^- -> NH3 + H2O", 0, 1, 3, 2],
  ["HSO4^- + H2O <=> SO4^2- + H3O^+", 0, 1, 3, 2], ["CO3^2- + H2O <=> HCO3^- + OH^-", 1, 0, 2, 3], ["H2PO4^- + OH^- -> HPO4^2- + H2O", 0, 1, 3, 2],
  ["HF + NH3 -> F^- + NH4^+", 0, 1, 3, 2], ["HCl + NH3 -> NH4^+ + Cl^-", 0, 1, 2, 3], ["CH3COOH + NH3 -> CH3COO^- + NH4^+", 0, 1, 3, 2],
];
const AMPH = [["H2O", "A"], ["HCO3^-", "A"], ["H2PO4^-", "A"], ["HPO4^2-", "A"], ["HS^-", "A"], ["HSO3^-", "A"], ["Cl^-", "N"], ["NH4^+", "K"], ["CO3^2-", "B"], ["SO4^2-", "N"], ["H3O^+", "K"], ["NO3^-", "N"], ["PO4^3-", "B"], ["Na^+", "N"], ["CH3COO^-", "B"], ["S^2-", "B"]];
const STRONG_BASES = [["NaOH", "natrijevega hidroksida", 1], ["KOH", "kalijevega hidroksida", 1], ["Ca(OH)2", "kalcijevega hidroksida", 2], ["Ba(OH)2", "barijevega hidroksida", 2], ["LiOH", "litijevega hidroksida", 1]];

const genKislineBaze = {
  id: "dod-kem-ss-kisline-in-baze",
  topics: ["KEM-SS-2/kisline-in-baze"],
  gen(level, r) {
    const name = nm(r);
    if (level === 1) {
      const [q, X, ok, wr] = r.pick(CONJ);
      return concept(r, {
        q: r.pick([`Katera je konjugirana ${q} ${q === "baza" ? "kisline" : "baze"} $${sp(X)}$?`, `${name} ${g(name, "išče", "išče")} konjugirano ${q === "baza" ? "bazo kisline" : "kislino baze"} $${sp(X)}$. Katera zvrst je to?`]),
        ok: spU(ok),
        wrong: wr.map(([w, tag]) => [spU(w), CONJ_WHY(q, tag)]),
        hint: q === "baza" ? "Kislina odda en proton $\\mathrm{H^+}$: odvzemi en H in naboj zmanjšaj za 1." : "Baza sprejme en proton $\\mathrm{H^+}$: dodaj en H in naboj povečaj za 1.",
        given: null,
        sol: [q === "baza" ? `${spU(X)} odda proton: ${spU(X)} → ${spU(ok)} + H⁺` : `${spU(X)} sprejme proton: ${spU(X)} + H⁺ → ${spU(ok)}`, `Konjugirani par: ${q === "baza" ? `${spU(X)}/${spU(ok)}` : `${spU(ok)}/${spU(X)}`}.`],
      });
    }
    if (level === 2) {
      const [eq, a, b, ca, cb] = r.pick(BL_RX);
      const S = eq.split(" ").filter((t) => !["+", "->", "<=>"].includes(t));
      const U = S.map(spU);
      const roleOf = { [a]: "Brønstedova kislina (odda proton)", [b]: "Brønstedova baza (sprejme proton)", [ca]: `konjugirana kislina baze ${U[b]}`, [cb]: `konjugirana baza kisline ${U[a]}` };
      const askIdx = r.pick([a, b, ca, cb]);
      const askText = { [a]: "Brønstedova kislina", [b]: "Brønstedova baza", [ca]: `konjugirana kislina baze $${sp(S[b])}$`, [cb]: `konjugirana baza kisline $${sp(S[a])}$` }[askIdx];
      return concept(r, {
        q: `V reakciji\n\n$$${eqTex(eq)}$$\n\nkatera zvrst je ${askText}?`,
        ok: U[askIdx],
        wrong: [0, 1, 2, 3].filter((i) => i !== askIdx).map((i) => [U[i], `${U[i]} je v tej reakciji ${roleOf[i]}.`]),
        hint: "Poišči, katera zvrst med reaktanti izgubi $\\mathrm{H^+}$ in katera ga pridobi; vsaka nato preide v svojo konjugirano zvrst.",
        given: null,
        sol: [`${U[a]} odda proton in preide v ${U[cb]} (par ${U[a]}/${U[cb]}).`, `${U[b]} sprejme proton in preide v ${U[ca]} (par ${U[ca]}/${U[b]}).`, `Iskana zvrst: ${U[askIdx]}.`],
      });
    }
    if (r.next() < 0.5) {
      const [F, gen, z] = r.pick(STRONG_BASES);
      const e = r.int(1, 3);
      const c = roundHalfUp(r.dec(1, 9.9, 1) * 10 ** -e, e + 1);
      const cOH = z * c;
      const pOH = -log10(cOH);
      const pH = 14 - pOH;
      return mk(
        r.pick([
          `Izračunaj pH raztopine ${gen} ($${sp(F)}$) s koncentracijo $${tx(c)}\\ \\mathrm{mol/L}$ pri $25\\ {}^\\circ\\mathrm{C}$. Hidroksid v vodi popolnoma disociira. ${zaokr(2)}`,
          `${name} ${g(name, "je pripravil", "je pripravila")} raztopino ${gen} s koncentracijo $${tx(c)}\\ \\mathrm{mol/L}$. Kolikšen je pH raztopine pri $25\\ {}^\\circ\\mathrm{C}$ (popolna disociacija)? ${zaokr(2)}`,
        ]),
        num(pH, null, 2, [[pOH, "To je pOH; pH izračunaš iz pH + pOH = 14."], [-log10(c), "Si izračunal pH iz koncentracije baze, kot da bi bila kislina?"], ...(z > 1 ? [[14 + log10(c), `Iz ene formulske enote ${spU(F)} nastaneta 2 iona OH⁻.`]] : [])]),
        "Baza da ione $\\mathrm{OH^-}$: izračunaj $c(\\mathrm{OH^-})$, nato pOH in na koncu pH.",
        [dat(`c(${sp(F)})`, tx(c), "mol/L")], ["\\mathrm{pH}"], ["c(\\mathrm{OH^-}) = z \\cdot c(\\text{baza})", "\\mathrm{pOH} = -\\log c(\\mathrm{OH^-})", "\\mathrm{pH} + \\mathrm{pOH} = 14"],
        [z > 1 ? `$c(\\mathrm{OH^-}) = ${z} \\cdot ${tx(c)} = ${qty(tx(cOH), "mol/L")}$ (vsaka formulska enota da ${z} iona OH⁻)` : `$c(\\mathrm{OH^-}) = c(${sp(F)}) = ${qty(tx(cOH), "mol/L")}$`, `$\\mathrm{pOH} = -\\log ${tx(cOH)} \\approx ${tx(pOH, 3)}$`, `$\\mathrm{pH} = 14 - ${tx(pOH, 3)} ${res(pH, 2)}$`]
      );
    }
    const amph = r.pick(AMPH.filter((x) => x[1] === "A"));
    const others = r.shuffle(AMPH.filter((x) => x[1] !== "A")).slice(0, 3);
    const list = r.shuffle([amph, ...others]);
    const why = { N: "ne odda in ne sprejme protona – v vodi je le opazovalni ion.", K: "proton lahko le odda – je kislina.", B: "proton lahko le sprejme – je baza." };
    return concept(r, {
      q: `Katera od zvrsti ${list.map(([f]) => `$${sp(f)}$`).join(", ")} je amfolit (lahko deluje kot kislina ali kot baza)?`,
      ok: spU(amph[0]),
      wrong: others.map(([f, t]) => [spU(f), `${spU(f)} ${why[t]}`]),
      hint: "Amfolit ima proton, ki ga lahko odda, in hkrati lahko proton sprejme.",
      given: null,
      sol: [`${spU(amph[0])} lahko odda H⁺ ali ga sprejme, zato je amfolit.`, others.map(([f, t]) => `${spU(f)} ${why[t]}`).join(" ")],
    });
  },
};

// ---------- šibke kisline in baze ----------
// [formula, ime, mantisa K_a, eksponent]
const WEAK_ACIDS = [["CH3COOH", "etanojske kisline", 1.8, -5], ["HCOOH", "metanojske kisline", 1.8, -4], ["HF", "fluorovodikove kisline", 6.8, -4], ["HCN", "cianovodikove kisline", 6.2, -10], ["HNO2", "dušikove(III) kisline", 4.5, -4], ["HClO", "klorove(I) kisline", 3.0, -8], ["C6H5COOH", "benzojske kisline", 6.3, -5]];
const kTex = (m, e) => `${tx(m, 1)} \\cdot 10^{${e}}`;
const BUFFERS = [["CH3COOH", "CH3COONa", "etanojske kisline", "natrijevega etanoata", 4.74], ["HCOOH", "HCOONa", "metanojske kisline", "natrijevega metanoata", 3.74], ["NH4Cl", "NH3", "amonijevega klorida", "amoniaka", 9.25], ["NaH2PO4", "Na2HPO4", "natrijevega dihidrogenfosfata", "natrijevega hidrogenfosfata", 7.21]];

const genSibke = {
  id: "dod-kem-ss-sibke-kisline-in-baze",
  topics: ["KEM-SS-2/sibke-kisline-in-baze"],
  gen(level, r) {
    const name = nm(r);
    const [F, ime, m, e] = r.pick(WEAK_ACIDS);
    const Ka = m * 10 ** e;
    if (level === 1) {
      if (r.next() < 0.4) {
        const three = r.shuffle(WEAK_ACIDS).slice(0, 3);
        const strongest = r.next() < 0.5;
        const sorted = [...three].sort((x, y) => x[2] * 10 ** x[3] - y[2] * 10 ** y[3]);
        const ok = strongest ? sorted[2] : sorted[0];
        return concept(r, {
          q: `Katera kislina je ${strongest ? "najmočnejša" : "najšibkejša"}: ${three.map(([f, , mm, ee]) => `$${sp(f)}$ ($K_a = ${kTex(mm, ee)}$)`).join(", ")}?`,
          ok: spU(ok[0]),
          wrong: three.filter((x) => x !== ok).map((x) => [spU(x[0]), strongest ? `${spU(x[0])} ima manjšo K_a, zato v vodi manj protolizira – je šibkejša.` : `${spU(x[0])} ima večjo K_a, zato v vodi bolj protolizira – je močnejša.`]),
          hint: "Večja konstanta kislosti $K_a$ pomeni, da kislina v vodi bolj protolizira. Pazi na eksponent potence!",
          given: three.map(([f, , mm, ee]) => `K_a(${sp(f)}) = ${kTex(mm, ee)}`),
          find: [T(strongest ? "najmočnejša kislina" : "najšibkejša kislina")],
          sol: [`Najprej primerjamo eksponente, nato mantise: ${sorted.map((x) => spU(x[0])).join(" < ")} (po K_a).`, `${strongest ? "Najmočnejša" : "Najšibkejša"} je ${spU(ok[0])}.`],
        });
      }
      const pKa = -log10(Ka);
      return mk(
        r.pick([`Konstanta kislosti ${ime} ($${sp(F)}$) je $K_a = ${kTex(m, e)}$. Izračunaj $\\mathrm{p}K_a$. ${zaokr(2)}`, `${name} ${g(name, "je v tabeli prebral", "je v tabeli prebrala")}, da je za $${sp(F)}$ $K_a = ${kTex(m, e)}$. Kolikšna je $\\mathrm{p}K_a$? ${zaokr(2)}`]),
        num(pKa, null, 2, [[log10(Ka), "Si pozabil minus? pK_a = −log K_a."], [-e, "Upoštevaj tudi mantiso, ne le eksponenta."], [-log10(m), "Upoštevaj tudi potenco 10."]]),
        "$\\mathrm{p}K_a$ je negativni desetiški logaritem konstante kislosti.",
        [`K_a = ${kTex(m, e)}`], ["\\mathrm{p}K_a"], ["\\mathrm{p}K_a = -\\log K_a"],
        [`$\\mathrm{p}K_a = -\\log(${kTex(m, e)})$`, `$\\mathrm{p}K_a = ${-e} - \\log ${tx(m, 1)} ${res(pKa, 2)}$`]
      );
    }
    if (level === 2) {
      const c = r.pick([0.01, 0.02, 0.05, 0.1, 0.15, 0.2, 0.25, 0.5]);
      if (r.next() < 0.6) {
        const h = Math.sqrt(Ka * c);
        const pH = -log10(h);
        return mk(
          r.pick([`Izračunaj pH raztopine ${ime} ($${sp(F)}$) s koncentracijo $${tx(c)}\\ \\mathrm{mol/L}$, $K_a = ${kTex(m, e)}$. Uporabi približek za šibke kisline. ${zaokr(2)}`, `${name} ${g(name, "meri", "meri")} pH raztopine $${sp(F)}$ s koncentracijo $${tx(c)}\\ \\mathrm{mol/L}$. Kolikšen pH pričakuje, če je $K_a = ${kTex(m, e)}$? Uporabi približek za šibke kisline. ${zaokr(2)}`]),
          num(pH, null, 2, [[-log10(c), "To bi veljalo za močno kislino; šibka kislina protolizira le delno."], [-log10(Ka * c), "Si pozabil koreniti? c(H₃O⁺) = √(K_a · c)."]]),
          "Za šibko kislino velja $c(\\mathrm{H_3O^+}) \\approx \\sqrt{K_a \\cdot c}$; nato izračunaj pH.",
          [`K_a = ${kTex(m, e)}`, dat("c", tx(c), "mol/L")], ["\\mathrm{pH}"], ["c(\\mathrm{H_3O^+}) = \\sqrt{K_a \\cdot c}", "\\mathrm{pH} = -\\log c(\\mathrm{H_3O^+})"],
          [`$c(\\mathrm{H_3O^+}) = \\sqrt{${kTex(m, e)} \\cdot ${tx(c)}} \\approx ${tx(h, 6)}\\ \\mathrm{mol/L}$`, `$\\mathrm{pH} = -\\log ${tx(h, 6)} ${res(pH, 2)}$`]
        );
      }
      const al = Math.sqrt(Ka / c) * 100;
      const d = al < 1 ? 3 : 2;
      return mk(
        `Kolikšna je stopnja protolize $${sp(F)}$ v raztopini s koncentracijo $${tx(c)}\\ \\mathrm{mol/L}$, če je $K_a = ${kTex(m, e)}$? Rezultat v odstotkih ${ROUND[d]}.`,
        num(al, "%", d, [[(Ka / c) * 100, "Si pozabil koreniti? α = √(K_a / c)."], [Math.sqrt(Ka * c) * 100, "Stopnja protolize je √(K_a / c), ne √(K_a · c)."]]),
        "Stopnja protolize je delež molekul kisline, ki oddajo proton: $\\alpha = \\dfrac{c(\\mathrm{H_3O^+})}{c}$.",
        [`K_a = ${kTex(m, e)}`, dat("c", tx(c), "mol/L")], ["\\alpha"], ["\\alpha = \\sqrt{\\dfrac{K_a}{c}}"],
        [`$\\alpha = \\sqrt{\\dfrac{${kTex(m, e)}}{${tx(c)}}} \\approx ${tx(al / 100, 6)}$`, `$\\alpha ${res(al, d, "\\%")}$`]
      );
    }
    const kind = r.int(0, 2);
    if (kind === 0) {
      const [HA, A, gHA, gA, pKa] = r.pick(BUFFERS);
      const c1 = r.pick([0.1, 0.2, 0.5]), c2 = r.pick([0.1, 0.2, 0.5]);
      const V1 = r.int(2, 10) * 10, V2 = r.int(2, 10) * 10;
      const n1 = (c1 * V1) / 1000, n2 = (c2 * V2) / 1000;
      const pH = pKa + log10(n2 / n1);
      return mk(
        `${name} ${g(name, "zmeša", "zmeša")} $${V1}\\ \\mathrm{mL}$ raztopine ${gHA} ($${tx(c1)}\\ \\mathrm{mol/L}$) in $${V2}\\ \\mathrm{mL}$ raztopine ${gA} ($${tx(c2)}\\ \\mathrm{mol/L}$). Kolikšen je pH nastalega pufra, če je $\\mathrm{p}K_a = ${tx(pKa, 2)}$? ${zaokr(2)}`,
        num(pH, null, 2, [[pKa - log10(n2 / n1), "Si obrnil razmerje? V števcu je konjugirana baza, v imenovalcu kislina."], [pKa + log10(c2 / c1), "Upoštevaj tudi prostornini – razmerje množin, ne le koncentracij."]]),
        "Izračunaj množini kisline in konjugirane baze, nato uporabi Henderson-Hasselbalchovo enačbo.",
        [dat("V_1", V1, "mL"), dat("c_1", tx(c1), "mol/L"), dat("V_2", V2, "mL"), dat("c_2", tx(c2), "mol/L"), `\\mathrm{p}K_a = ${tx(pKa, 2)}`], ["\\mathrm{pH}"], ["n = c \\cdot V", "\\mathrm{pH} = \\mathrm{p}K_a + \\log\\dfrac{n(\\text{baza})}{n(\\text{kislina})}"],
        [`Kislina: $n = ${tx(c1)} \\cdot ${tx(V1 / 1000)} = ${qty(tx(n1), "mol")}$; baza: $n = ${tx(c2)} \\cdot ${tx(V2 / 1000)} = ${qty(tx(n2), "mol")}$`, `$\\mathrm{pH} = ${tx(pKa, 2)} + \\log\\dfrac{${tx(n2)}}{${tx(n1)}} ${res(pH, 2)}$`]
      );
    }
    if (kind === 1) {
      const [B, gB, mb, eb] = r.pick([["NH3", "amoniaka", 1.8, -5], ["CH3NH2", "metilamina", 4.4, -4]]);
      const Kb = mb * 10 ** eb;
      const c = r.pick([0.01, 0.05, 0.1, 0.2, 0.5]);
      const oh = Math.sqrt(Kb * c);
      const pOH = -log10(oh);
      const pH = 14 - pOH;
      return mk(
        `Izračunaj pH raztopine ${gB} ($${sp(B)}$) s koncentracijo $${tx(c)}\\ \\mathrm{mol/L}$ pri $25\\ {}^\\circ\\mathrm{C}$. Konstanta bazičnosti je $K_b = ${kTex(mb, eb)}$. ${zaokr(2)}`,
        num(pH, null, 2, [[pOH, "To je pOH; pH = 14 − pOH."], [14 + log10(c), "To bi veljalo za močno bazo; šibka baza protolizira le delno."], [-log10(oh), "To je pOH; pretvori v pH."]]),
        "Za šibko bazo velja $c(\\mathrm{OH^-}) \\approx \\sqrt{K_b \\cdot c}$; izračunaj pOH in nato pH.",
        [`K_b = ${kTex(mb, eb)}`, dat("c", tx(c), "mol/L")], ["\\mathrm{pH}"], ["c(\\mathrm{OH^-}) = \\sqrt{K_b \\cdot c}", "\\mathrm{pOH} = -\\log c(\\mathrm{OH^-})", "\\mathrm{pH} = 14 - \\mathrm{pOH}"],
        [`$c(\\mathrm{OH^-}) = \\sqrt{${kTex(mb, eb)} \\cdot ${tx(c)}} \\approx ${tx(oh, 6)}\\ \\mathrm{mol/L}$`, `$\\mathrm{pOH} = -\\log ${tx(oh, 6)} \\approx ${tx(pOH, 3)}$`, `$\\mathrm{pH} = 14 - ${tx(pOH, 3)} ${res(pH, 2)}$`]
      );
    }
    const c = r.pick([0.01, 0.05, 0.1, 0.2, 0.5]);
    const pHm = roundHalfUp(-log10(Math.sqrt(Ka * c)), 2);
    const pKa = 2 * pHm + log10(c);
    return mk(
      `${name} ${g(name, "je izmeril", "je izmerila")} pH raztopine šibke kisline $${sp(F)}$ s koncentracijo $${tx(c)}\\ \\mathrm{mol/L}$: $\\mathrm{pH} = ${tx(pHm, 2)}$. Izračunaj $\\mathrm{p}K_a$ kisline. ${zaokr(2)}`,
      num(pKa, null, 2, [[pHm, "pK_a ni enak pH; pH je odvisen tudi od koncentracije."], [2 * pHm, "Upoštevaj še koncentracijo kisline: K_a = c(H₃O⁺)² / c."], [pHm + log10(c), "Koncentracija H₃O⁺ nastopa v izrazu za K_a na kvadrat."]]),
      "Iz pH izračunaj $c(\\mathrm{H_3O^+})$, nato $K_a = \\dfrac{c(\\mathrm{H_3O^+})^2}{c}$ in $\\mathrm{p}K_a$.",
      [dat("c", tx(c), "mol/L"), `\\mathrm{pH} = ${tx(pHm, 2)}`], ["\\mathrm{p}K_a"], ["c(\\mathrm{H_3O^+}) = 10^{-\\mathrm{pH}}", "K_a = \\dfrac{c(\\mathrm{H_3O^+})^2}{c}", "\\mathrm{p}K_a = -\\log K_a"],
      [`$c(\\mathrm{H_3O^+}) = 10^{-${tx(pHm, 2)}} \\approx ${tx(10 ** -pHm, 6)}\\ \\mathrm{mol/L}$`, `$K_a = \\dfrac{(${tx(10 ** -pHm, 6)})^2}{${tx(c)}}$`, `$\\mathrm{p}K_a = 2 \\cdot ${tx(pHm, 2)} + \\log ${tx(c)} ${res(pKa, 2)}$`]
    );
  },
};

// ---------- titracija ----------
const genTitracija = {
  id: "dod-kem-ss-titracija",
  topics: ["KEM-SS-2/titracija"],
  gen(level, r) {
    const name = nm(r);
    if (level === 1) {
      const [A, gA, B, gB] = r.pick([["HCl", "klorovodikove kisline", "NaOH", "natrijevega hidroksida"], ["HNO3", "dušikove(V) kisline", "KOH", "kalijevega hidroksida"], ["HCl", "klorovodikove kisline", "KOH", "kalijevega hidroksida"], ["HNO3", "dušikove(V) kisline", "NaOH", "natrijevega hidroksida"]]);
      const Va = r.pick([10, 20, 25, 50]);
      const Vb = r.dec(5, 40, 1);
      const cb = r.pick([0.1, 0.05, 0.2, 0.15]);
      const unknownAcid = r.next() < 0.6;
      const [Vx, Vt, ct, X, Y, gX, gY] = unknownAcid ? [Va, Vb, cb, A, B, gA, gB] : [Vb, Va, cb, B, A, gB, gA];
      const cx = (ct * Vt) / Vx;
      return mk(
        r.pick([
          `Pri titraciji $${tx(Vx)}\\ \\mathrm{mL}$ raztopine ${gX} neznane koncentracije porabimo $${tx(Vt)}\\ \\mathrm{mL}$ raztopine ${gY} s koncentracijo $${tx(ct)}\\ \\mathrm{mol/L}$. Kolikšna je koncentracija ${gX}? ${zaokr(3)}`,
          `${name} ${g(name, "titrira", "titrira")} $${tx(Vx)}\\ \\mathrm{mL}$ raztopine $${sp(X)}$ z raztopino $${sp(Y)}$ ($c = ${tx(ct)}\\ \\mathrm{mol/L}$). Do ekvivalentne točke porabi $${tx(Vt)}\\ \\mathrm{mL}$. Izračunaj koncentracijo $${sp(X)}$. ${zaokr(3)}`,
        ]),
        num(cx, "mol/L", 3, [[(ct * Vx) / Vt, "Si zamenjal prostornini? Velja c₁V₁ = c₂V₂."], [ct * Vt, "Si pozabil deliti s prostornino vzorca?"]], U_CONC),
        `Razmerje $${sp(A)} : ${sp(B)} = 1 : 1$, zato je v ekvivalentni točki $n(\\text{kislina}) = n(\\text{baza})$.`,
        [dat(`V(${sp(X)})`, tx(Vx), "mL"), dat(`V(${sp(Y)})`, tx(Vt), "mL"), dat(`c(${sp(Y)})`, tx(ct), "mol/L")], [`c(${sp(X)})`], ["c_1 V_1 = c_2 V_2"],
        [`$\\mathrm{${A === "HCl" ? "HCl" : "HNO_3"} + ${B} \\rightarrow ${B === "NaOH" ? "Na" : "K"}${A === "HCl" ? "Cl" : "NO_3"} + H_2O}$ (razmerje 1 : 1)`, `$n(${sp(Y)}) = ${tx(ct)} \\cdot ${tx(Vt / 1000)} = ${qty(tx((ct * Vt) / 1000), "mol")} = n(${sp(X)})$`, `$c(${sp(X)}) = \\dfrac{${tx((ct * Vt) / 1000)}\\ \\mathrm{mol}}{${tx(Vx / 1000)}\\ \\mathrm{L}} ${res(cx, 3, "mol/L")}$`]
      );
    }
    if (level === 2) {
      const cases = [
        { X: "H2SO4", gX: "žveplove(VI) kisline", Y: "NaOH", gY: "natrijevega hidroksida", k: 0.5, eq: "H_2SO_4 + 2NaOH \\rightarrow Na_2SO_4 + 2H_2O", ratio: "1 : 2" },
        { X: "H2C2O4", gX: "oksalne kisline", Y: "NaOH", gY: "natrijevega hidroksida", k: 0.5, eq: "H_2C_2O_4 + 2NaOH \\rightarrow Na_2C_2O_4 + 2H_2O", ratio: "1 : 2" },
        { X: "Ca(OH)2", gX: "kalcijevega hidroksida", Y: "HCl", gY: "klorovodikove kisline", k: 0.5, eq: "Ca(OH)_2 + 2HCl \\rightarrow CaCl_2 + 2H_2O", ratio: "1 : 2" },
        { X: "Ba(OH)2", gX: "barijevega hidroksida", Y: "HNO3", gY: "dušikove(V) kisline", k: 0.5, eq: "Ba(OH)_2 + 2HNO_3 \\rightarrow Ba(NO_3)_2 + 2H_2O", ratio: "1 : 2" },
        { X: "NaOH", gX: "natrijevega hidroksida", Y: "H2SO4", gY: "žveplove(VI) kisline", k: 2, eq: "H_2SO_4 + 2NaOH \\rightarrow Na_2SO_4 + 2H_2O", ratio: "2 : 1" },
        { X: "KOH", gX: "kalijevega hidroksida", Y: "H2SO4", gY: "žveplove(VI) kisline", k: 2, eq: "H_2SO_4 + 2KOH \\rightarrow K_2SO_4 + 2H_2O", ratio: "2 : 1" },
      ];
      const C = r.pick(cases);
      const Vx = r.pick([10, 20, 25]);
      const Vt = r.dec(8, 40, 1);
      const ct = r.pick([0.1, 0.05, 0.2]);
      const nt = (ct * Vt) / 1000;
      const nx = nt * C.k;
      const cx = nx / (Vx / 1000);
      return mk(
        `Za nevtralizacijo $${Vx}\\ \\mathrm{mL}$ raztopine ${C.gX} ($${sp(C.X)}$) porabimo $${tx(Vt)}\\ \\mathrm{mL}$ raztopine ${C.gY} ($${sp(C.Y)}$) s koncentracijo $${tx(ct)}\\ \\mathrm{mol/L}$. Kolikšna je koncentracija ${C.gX}? ${zaokr(3)}`,
        num(cx, "mol/L", 3, [[(ct * Vt) / Vx, "Si upošteval razmerje v enačbi? Ni 1 : 1."], [(nt / C.k) / (Vx / 1000), "Si razmerje obrnil? Poglej koeficienta v enačbi."]], U_CONC),
        "Zapiši urejeno enačbo nevtralizacije in iz koeficientov razberi razmerje množin.",
        [dat(`V(${sp(C.X)})`, Vx, "mL"), dat(`V(${sp(C.Y)})`, tx(Vt), "mL"), dat(`c(${sp(C.Y)})`, tx(ct), "mol/L")], [`c(${sp(C.X)})`], ["n = c \\cdot V", `n(${sp(C.X)}) : n(${sp(C.Y)}) = ${C.ratio}`],
        [`$\\mathrm{${C.eq}}$`, `$n(${sp(C.Y)}) = ${tx(ct)} \\cdot ${tx(Vt / 1000)} = ${qty(tx(nt), "mol")}$`, `$n(${sp(C.X)}) = ${C.k === 2 ? "2 \\cdot" : "\\dfrac{1}{2} \\cdot"} ${tx(nt)} = ${qty(tx(nx), "mol")}$`, `$c(${sp(C.X)}) = \\dfrac{${tx(nx)}}{${tx(Vx / 1000)}} ${res(cx, 3, "mol/L")}$`]
      );
    }
    const kind = r.int(0, 2);
    if (kind === 0) {
      const Vt = r.dec(10, 30, 1);
      const ct = r.pick([0.1, 0.05]);
      const na = (ct * Vt) / 1000;
      const cKis = (na / 0.025) * 10;
      const gam = cKis * 60.05;
      return mk(
        `$10{,}0\\ \\mathrm{mL}$ kisa razredčimo z vodo na $100{,}0\\ \\mathrm{mL}$. Za titracijo $25{,}0\\ \\mathrm{mL}$ razredčene raztopine porabimo $${tx(Vt)}\\ \\mathrm{mL}$ raztopine NaOH ($${tx(ct)}\\ \\mathrm{mol/L}$). Kolikšna je masna koncentracija etanojske kisline v kisu v g/L? $M(\\mathrm{CH_3COOH}) = 60{,}05\\ \\mathrm{g/mol}$. ${zaokr(1)}`,
        num(gam, "g/L", 1, [[gam / 10, "Si upošteval, da smo kis razredčili desetkrat?"], [cKis, "To je množinska koncentracija; pomnoži še z molsko maso."], [((ct * Vt) / 1000 / 0.01) * 60.05, "Titrirali smo 25,0 mL razredčene raztopine, ne 10,0 mL kisa."]], { unitAlternatives: ["g/l", "g/dm3"] }),
        "Izračunaj množino NaOH, ki je enaka množini kisline v 25,0 mL; nato koncentracijo razredčene raztopine, upoštevaj redčenje in pretvori v g/L.",
        [dat("V(\\text{kis})", "10{,}0", "mL"), dat("V(\\text{razredčeno})", "100{,}0", "mL"), dat("V(\\text{titrirano})", "25{,}0", "mL"), dat("V(\\mathrm{NaOH})", tx(Vt), "mL"), dat("c(\\mathrm{NaOH})", tx(ct), "mol/L"), dat("M", "60{,}05", "g/mol")], ["\\gamma"],
        ["n(\\mathrm{CH_3COOH}) = n(\\mathrm{NaOH}) = c \\cdot V", "c_1 V_1 = c_2 V_2", "\\gamma = c \\cdot M"],
        [`$n = ${tx(ct)} \\cdot ${tx(Vt / 1000)} = ${qty(tx(na), "mol")}$ (v $25{,}0\\ \\mathrm{mL}$)`, `$c(\\text{razredčeno}) = \\dfrac{${tx(na)}}{0{,}025} = ${qty(tx(na / 0.025, 4), "mol/L")}$; kis je 10-krat bolj koncentriran: $${qty(tx(cKis, 4), "mol/L")}$`, `$\\gamma = ${tx(cKis, 4)} \\cdot 60{,}05 ${res(gam, 1, "g/L")}$`]
      );
    }
    if (kind === 1) {
      const ms = r.dec(0.8, 2.5, 2);
      const ct = r.pick([0.1, 0.2]);
      const w = r.dec(0.7, 0.98, 2);
      const Vt = roundHalfUp(((ms * w) / 40.0 / 10 / ct) * 1000, 1);
      const nAl = (ct * Vt) / 1000;
      const mNa = nAl * 10 * 40.0;
      const pct = (mNa / ms) * 100;
      return mk(
        `${name} ${g(name, "raztopi", "raztopi")} $${tx(ms)}\\ \\mathrm{g}$ onesnaženega NaOH v vodi in raztopino razredči na $250\\ \\mathrm{mL}$. Za $25\\ \\mathrm{mL}$ te raztopine porabi $${tx(Vt)}\\ \\mathrm{mL}$ HCl ($${tx(ct)}\\ \\mathrm{mol/L}$). Kolikšen je masni delež NaOH v vzorcu v %? $M(\\mathrm{NaOH}) = 40{,}00\\ \\mathrm{g/mol}$. ${zaokr(1)}`,
        num(pct, "%", 1, [[pct / 10, "Titriral si le 25 mL od 250 mL – množino pomnoži z 10."], [mNa, "To je masa NaOH v gramih; izračunaj še delež."]]),
        "Množina HCl je enaka množini NaOH v 25 mL; v celotnih 250 mL je NaOH desetkrat več.",
        [dat("m(\\text{vzorec})", tx(ms), "g"), dat("V", 250, "mL"), dat("V(\\text{alikvot})", 25, "mL"), dat("V(\\mathrm{HCl})", tx(Vt), "mL"), dat("c(\\mathrm{HCl})", tx(ct), "mol/L"), dat("M(\\mathrm{NaOH})", "40{,}00", "g/mol")], ["w(\\mathrm{NaOH})"],
        ["n(\\mathrm{NaOH}) = n(\\mathrm{HCl}) = c \\cdot V", "w = \\dfrac{m(\\mathrm{NaOH})}{m(\\text{vzorec})}"],
        [`V $25\\ \\mathrm{mL}$: $n = ${tx(ct)} \\cdot ${tx(Vt / 1000)} = ${qty(tx(nAl, 6), "mol")}$`, `V $250\\ \\mathrm{mL}$: $n = ${qty(tx(nAl * 10, 5), "mol")}$, $m = ${tx(nAl * 10, 5)} \\cdot 40{,}00 = ${qty(tx(mNa, 4), "g")}$`, `$w = \\dfrac{${tx(mNa, 4)}}{${tx(ms)}} \\cdot 100\\ \\% ${res(pct, 1, "\\%")}$`]
      );
    }
    const m = r.dec(0.1, 0.5, 3);
    const ct = r.pick([0.1, 0.2]);
    const n = m / 126.07;
    const V = ((2 * n) / ct) * 1000;
    return mk(
      `Koliko mL raztopine NaOH s koncentracijo $${tx(ct)}\\ \\mathrm{mol/L}$ potrebujemo za nevtralizacijo $${tx(m)}\\ \\mathrm{g}$ oksalne kisline dihidrata ($\\mathrm{H_2C_2O_4 \\cdot 2H_2O}$, $M = 126{,}07\\ \\mathrm{g/mol}$)? Oksalna kislina je diprotonska. ${zaokr(1)}`,
      num(V, "mL", 1, [[V / 2, "Oksalna kislina odda dva protona: n(NaOH) = 2 · n(kisline)."], [V / 1000, "Prostornino zapiši v mL."], [V * 2, "n(NaOH) = 2 · n(kisline), ne 4 ·."]], { unitAlternatives: ["ml"] }),
      "Maso pretvori v množino kisline, iz enačbe razberi množino NaOH in izračunaj prostornino.",
      [dat("m", tx(m), "g"), dat("M", "126{,}07", "g/mol"), dat("c(\\mathrm{NaOH})", tx(ct), "mol/L")], ["V(\\mathrm{NaOH})"], ["n = \\dfrac{m}{M}", "n(\\mathrm{NaOH}) = 2\\,n(\\mathrm{H_2C_2O_4})", "V = \\dfrac{n}{c}"],
      [`$\\mathrm{H_2C_2O_4 + 2NaOH \\rightarrow Na_2C_2O_4 + 2H_2O}$`, `$n(\\text{kislina}) = \\dfrac{${tx(m)}}{126{,}07} \\approx ${qty(tx(n, 6), "mol")}$, $n(\\mathrm{NaOH}) = ${qty(tx(2 * n, 6), "mol")}$`, `$V = \\dfrac{${tx(2 * n, 6)}}{${tx(ct)}}\\ \\mathrm{L} ${res(V, 1, "mL")}$`]
    );
  },
};

// ---------- oksidacijska števila ----------
// [zvrst, element, oksidacijsko število, število atomov elementa]
const OX1 = [["SO2", "S", 4, 1], ["NH3", "N", -3, 1], ["H2S", "S", -2, 1], ["CO2", "C", 4, 1], ["Fe2O3", "Fe", 3, 2], ["Al2O3", "Al", 3, 2], ["CH4", "C", -4, 1], ["NO2", "N", 4, 1], ["Cl2O7", "Cl", 7, 2], ["P2O5", "P", 5, 2], ["N2O", "N", 1, 2], ["SO3", "S", 6, 1], ["Cu2O", "Cu", 1, 2], ["MnO2", "Mn", 4, 1], ["PCl5", "P", 5, 1], ["N2O5", "N", 5, 2], ["CaH2", "H", -1, 2], ["OF2", "O", 2, 1]];
const OX2 = [["H2SO4", "S", 6, 1], ["HNO3", "N", 5, 1], ["KMnO4", "Mn", 7, 1], ["K2Cr2O7", "Cr", 6, 2], ["MnO4^-", "Mn", 7, 1], ["Cr2O7^2-", "Cr", 6, 2], ["NH4^+", "N", -3, 1], ["SO3^2-", "S", 4, 1], ["NO2^-", "N", 3, 1], ["ClO3^-", "Cl", 5, 1], ["ClO^-", "Cl", 1, 1], ["PO4^3-", "P", 5, 1], ["H2O2", "O", -1, 2], ["S2O3^2-", "S", 2, 2], ["C2O4^2-", "C", 3, 2], ["ClO4^-", "Cl", 7, 1], ["K2MnO4", "Mn", 6, 1], ["CrO4^2-", "Cr", 6, 1], ["H3PO4", "P", 5, 1], ["Na2S2O3", "S", 2, 2]];
const OX_ORG = [["CH3OH", "metanol", -2, 1], ["HCHO", "metanal", 0, 1], ["HCOOH", "metanojska kislina", 2, 1], ["C2H5OH", "etanol", -2, 2], ["CH3CHO", "etanal", -1, 2], ["CH3COOH", "etanojska kislina", 0, 2], ["C2H6", "etan", -3, 2], ["C2H4", "eten", -2, 2], ["C2H2", "etin", -1, 2], ["C6H12O6", "glukoza", 0, 6], ["CH3Cl", "klorometan", -2, 1], ["C3H8", "propan", -8 / 3, 3]].filter((x) => Number.isInteger(x[2]));
// Prehodi: [iz, v, element, ox1, ox2, atomi v zvrsti, besedilo enote, sprejme/odda]
const OX_CHANGE = [
  ["MnO4^-", "Mn^2+", "Mn", 7, 2, 1, "en ion"], ["Cr2O7^2-", "Cr^3+", "Cr", 6, 3, 2, "en ion"], ["NO3^-", "NO", "N", 5, 2, 1, "en ion"], ["SO2", "SO4^2-", "S", 4, 6, 1, "ena molekula"],
  ["Cu", "Cu^2+", "Cu", 0, 2, 1, "en atom"], ["H2O2", "H2O", "O", -1, -2, 2, "ena molekula"], ["Cl2", "Cl^-", "Cl", 0, -1, 2, "ena molekula"], ["MnO4^-", "MnO2", "Mn", 7, 4, 1, "en ion"],
  ["C2O4^2-", "CO2", "C", 3, 4, 2, "en ion"], ["NO3^-", "NO2", "N", 5, 4, 1, "en ion"], ["Fe^2+", "Fe^3+", "Fe", 2, 3, 1, "en ion"], ["ClO3^-", "Cl^-", "Cl", 5, -1, 1, "en ion"], ["Zn", "Zn^2+", "Zn", 0, 2, 1, "en atom"], ["O2", "H2O", "O", 0, -2, 2, "ena molekula"],
];
const charge = (s) => { const q = s.split("^")[1]; if (!q) return 0; const k = parseInt(q, 10); return (q.endsWith("-") ? -1 : 1) * (Number.isNaN(k) ? 1 : k); };
const sgn = (x) => (x > 0 ? `+${x}` : `${x}`);

const genOksStevila = {
  id: "dod-kem-ss-oksidacijska-stevila",
  topics: ["KEM-SS-2/oksidacijska-stevila"],
  gen(level, r) {
    const name = nm(r);
    if (level === 3 && r.next() < 0.5) {
      const [from, to, El, o1, o2, at, unit] = r.pick(OX_CHANGE);
      const e = Math.abs(o2 - o1) * at;
      const dir = o2 < o1 ? "sprejme" : "odda";
      return mk(
        r.pick([`Koliko elektronov ${dir} ${unit} $${sp(from)}$, ko preide v $${sp(to)}$?`, `${name} ${g(name, "ureja", "ureja")} polreakcijo $${sp(from)} \\rightarrow ${sp(to)}$. Koliko elektronov mora zapisati na eno zvrst $${sp(from)}$?`]),
        num(e, null, null, [[Math.abs(o2 - o1), at > 1 ? `V ${spU(from)} sta ${at} atoma ${El}; sprememba velja za vsakega.` : "Preveri oksidacijski števili."], [Math.abs(o2), "To je končno oksidacijsko število, ne sprememba."], [Math.abs(o1) + Math.abs(o2), "Si oksidacijski števili seštel? Iščemo razliko."]]),
        "Določi oksidacijsko število elementa pred in po prehodu; razlika, pomnožena s številom atomov, je število elektronov.",
        null, null, ["N_{e^-} = |\\Delta\\,\\text{OŠ}| \\cdot \\text{število atomov}"],
        [`${El}: $${sgn(o1)} \\rightarrow ${sgn(o2)}$, sprememba za ${Math.abs(o2 - o1)} (${o2 < o1 ? "redukcija" : "oksidacija"})`, at > 1 ? `V zvrsti $${sp(from)}$ sta ${at} atoma ${El}: $${Math.abs(o2 - o1)} \\cdot ${at} = ${e}$` : `En atom ${El}: ${e} e⁻`, `${unit[0].toUpperCase() + unit.slice(1)} ${spU(from)} ${dir} ${e} elektron${e === 1 ? "" : e === 2 ? "a" : e < 5 ? "e" : "ov"}.`]
      );
    }
    const isOrg = level === 3;
    const [S, El, x, n] = isOrg ? (() => { const o = r.pick(OX_ORG); return [o[0], "C", o[2], o[3], o[1]]; })() : r.pick(level === 1 ? OX1 : OX2);
    const q = charge(S);
    const others = q - n * x;
    const orgName = isOrg ? OX_ORG.find((o) => o[0] === S)[1] : "";
    const mis = [[-x, "Preveri predznak: vsota oksidacijskih števil mora biti enaka naboju zvrsti."], [n * x, `V formuli ${n === 2 ? "sta 2 atoma" : n <= 4 ? `so ${n} atomi` : `je ${n} atomov`} ${El}; vsoto deli s številom atomov.`]];
    if (q !== 0) mis.push([(n * x - q) / n, "Si pozabil na naboj iona? Vsota oksidacijskih števil je enaka naboju."]);
    return mk(
      isOrg
        ? `Izračunaj povprečno oksidacijsko število ogljika v molekuli ${orgName} ($${sp(S)}$). Upoštevaj $\\mathrm{H}$: $+1$, $\\mathrm{O}$: $-2$${S.includes("Cl") ? ", $\\mathrm{Cl}$: $-1$" : ""}.`
        : r.pick([`Določi oksidacijsko število ${El === "O" || El === "H" ? "" : "elementa "}$\\mathrm{${El}}$ v ${q === 0 ? "spojini" : "ionu"} $${sp(S)}$.`, `${name} ${g(name, "določa", "določa")} oksidacijska števila. Kolikšno je oksidacijsko število $\\mathrm{${El}}$ v $${sp(S)}$?`]),
      num(x, null, null, mis.filter((m) => m[0] !== x)),
      "Vsota oksidacijskih števil vseh atomov je enaka naboju zvrsti. Znana števila: H +1 (v hidridih kovin −1), O −2 (v peroksidih −1), alkalijske kovine +1.",
      null, null, ["\\sum \\text{OŠ} = \\text{naboj zvrsti}"],
      [`Vsota ostalih atomov: $${sgn(others)}$; naboj zvrsti: $${sgn(q)}$.`, `$${n > 1 ? `${n}x` : "x"} ${others >= 0 ? `+ ${others}` : `- ${-others}`} = ${q}$`, `$x = ${sgn(x)}$`]
    );
  },
};

// ---------- redoks reakcije (urejanje s polreakcijami) ----------
// { l, r: zvrsti, c: koeficienti, ox: oksidant, red: reducent, e: razlaga prenosa elektronov }
const REDOX1 = [
  { l: ["Zn", "Cu^2+"], r: ["Zn^2+", "Cu"], c: [1, 1, 1, 1], ox: "Cu^2+", red: "Zn", e: "Zn odda 2 e⁻, Cu²⁺ sprejme 2 e⁻ → razmerje 1 : 1" },
  { l: ["Al", "Cu^2+"], r: ["Al^3+", "Cu"], c: [2, 3, 2, 3], ox: "Cu^2+", red: "Al", e: "Al odda 3 e⁻, Cu²⁺ sprejme 2 e⁻ → najmanjši skupni večkratnik 6: 2 Al in 3 Cu²⁺" },
  { l: ["Fe^3+", "Sn^2+"], r: ["Fe^2+", "Sn^4+"], c: [2, 1, 2, 1], ox: "Fe^3+", red: "Sn^2+", e: "Fe³⁺ sprejme 1 e⁻, Sn²⁺ odda 2 e⁻ → 2 Fe³⁺ na 1 Sn²⁺" },
  { l: ["Cu", "Ag^+"], r: ["Cu^2+", "Ag"], c: [1, 2, 1, 2], ox: "Ag^+", red: "Cu", e: "Cu odda 2 e⁻, Ag⁺ sprejme 1 e⁻ → 2 Ag⁺ na 1 Cu" },
  { l: ["Cl2", "Br^-"], r: ["Cl^-", "Br2"], c: [1, 2, 2, 1], ox: "Cl2", red: "Br^-", e: "Cl₂ sprejme 2 e⁻ (dva atoma), dva Br⁻ oddata po 1 e⁻" },
  { l: ["Mg", "Fe^3+"], r: ["Mg^2+", "Fe"], c: [3, 2, 3, 2], ox: "Fe^3+", red: "Mg", e: "Mg odda 2 e⁻, Fe³⁺ sprejme 3 e⁻ → skupni večkratnik 6: 3 Mg in 2 Fe³⁺" },
  { l: ["Fe^3+", "I^-"], r: ["Fe^2+", "I2"], c: [2, 2, 2, 1], ox: "Fe^3+", red: "I^-", e: "Fe³⁺ sprejme 1 e⁻, I⁻ odda 1 e⁻; za molekulo I₂ potrebujemo 2 I⁻" },
  { l: ["Zn", "Ag^+"], r: ["Zn^2+", "Ag"], c: [1, 2, 1, 2], ox: "Ag^+", red: "Zn", e: "Zn odda 2 e⁻, Ag⁺ sprejme 1 e⁻ → 2 Ag⁺ na 1 Zn" },
  { l: ["Fe", "Cl2"], r: ["FeCl3"], c: [2, 3, 2], ox: "Cl2", red: "Fe", e: "Fe odda 3 e⁻, Cl₂ sprejme 2 e⁻ → skupni večkratnik 6: 2 Fe in 3 Cl₂" },
  { l: ["Al", "Br2"], r: ["AlBr3"], c: [2, 3, 2], ox: "Br2", red: "Al", e: "Al odda 3 e⁻, Br₂ sprejme 2 e⁻ → 2 Al in 3 Br₂" },
  { l: ["Al", "Fe^2+"], r: ["Al^3+", "Fe"], c: [2, 3, 2, 3], ox: "Fe^2+", red: "Al", e: "Al odda 3 e⁻, Fe²⁺ sprejme 2 e⁻ → 2 Al in 3 Fe²⁺" },
];
const REDOX2 = [
  { l: ["MnO4^-", "H^+", "e^-"], r: ["Mn^2+", "H2O"], c: [1, 8, 5, 1, 4], e: "Mn: +7 → +2, sprejme 5 e⁻; 4 O → 4 H₂O; 8 H⁺" },
  { l: ["Cr2O7^2-", "H^+", "e^-"], r: ["Cr^3+", "H2O"], c: [1, 14, 6, 2, 7], e: "2 Cr: +6 → +3, skupaj 6 e⁻; 7 O → 7 H₂O; 14 H⁺" },
  { l: ["NO3^-", "H^+", "e^-"], r: ["NO", "H2O"], c: [1, 4, 3, 1, 2], e: "N: +5 → +2, sprejme 3 e⁻; 2 O → 2 H₂O; 4 H⁺" },
  { l: ["H2O2", "H^+", "e^-"], r: ["H2O"], c: [1, 2, 2, 2], e: "2 O: −1 → −2, skupaj 2 e⁻; nastaneta 2 H₂O, potrebna 2 H⁺" },
  { l: ["SO4^2-", "H^+", "e^-"], r: ["SO2", "H2O"], c: [1, 4, 2, 1, 2], e: "S: +6 → +4, sprejme 2 e⁻; 2 O → 2 H₂O; 4 H⁺" },
  { l: ["O2", "H^+", "e^-"], r: ["H2O"], c: [1, 4, 4, 2], e: "2 O: 0 → −2, skupaj 4 e⁻; 2 H₂O; 4 H⁺" },
  { l: ["NO3^-", "H^+", "e^-"], r: ["NO2", "H2O"], c: [1, 2, 1, 1, 1], e: "N: +5 → +4, sprejme 1 e⁻; 1 O → H₂O; 2 H⁺" },
  { l: ["MnO2", "H^+", "e^-"], r: ["Mn^2+", "H2O"], c: [1, 4, 2, 1, 2], e: "Mn: +4 → +2, sprejme 2 e⁻; 2 O → 2 H₂O; 4 H⁺" },
  { l: ["SO2", "H2O"], r: ["SO4^2-", "H^+", "e^-"], c: [1, 2, 1, 4, 2], e: "S: +4 → +6, odda 2 e⁻; manjkajoča 2 O iz 2 H₂O, nastane 4 H⁺" },
  { l: ["H2O2"], r: ["O2", "H^+", "e^-"], c: [1, 1, 2, 2], e: "2 O: −1 → 0, odda 2 e⁻; nastaneta 2 H⁺" },
  { l: ["C2O4^2-"], r: ["CO2", "e^-"], c: [1, 2, 2], e: "2 C: +3 → +4, skupaj 2 e⁻" },
  { l: ["NO2^-", "H2O"], r: ["NO3^-", "H^+", "e^-"], c: [1, 1, 1, 2, 2], e: "N: +3 → +5, odda 2 e⁻; O iz H₂O, nastaneta 2 H⁺" },
  { l: ["ClO3^-", "H^+", "e^-"], r: ["Cl^-", "H2O"], c: [1, 6, 6, 1, 3], e: "Cl: +5 → −1, sprejme 6 e⁻; 3 O → 3 H₂O; 6 H⁺" },
];
const REDOX3 = [
  { l: ["MnO4^-", "Fe^2+", "H^+"], r: ["Mn^2+", "Fe^3+", "H2O"], c: [1, 5, 8, 1, 5, 4], ox: "MnO4^-", red: "Fe^2+", e: "Mn: +7 → +2 (5 e⁻), Fe: +2 → +3 (1 e⁻) → 1 MnO₄⁻ : 5 Fe²⁺" },
  { l: ["Cr2O7^2-", "Fe^2+", "H^+"], r: ["Cr^3+", "Fe^3+", "H2O"], c: [1, 6, 14, 2, 6, 7], ox: "Cr2O7^2-", red: "Fe^2+", e: "2 Cr: +6 → +3 (6 e⁻), Fe: +2 → +3 (1 e⁻) → 1 : 6" },
  { l: ["Cr2O7^2-", "I^-", "H^+"], r: ["Cr^3+", "I2", "H2O"], c: [1, 6, 14, 2, 3, 7], ox: "Cr2O7^2-", red: "I^-", e: "2 Cr: +6 → +3 (6 e⁻), I: −1 → 0 (1 e⁻) → 6 I⁻ = 3 I₂" },
  { l: ["MnO4^-", "C2O4^2-", "H^+"], r: ["Mn^2+", "CO2", "H2O"], c: [2, 5, 16, 2, 10, 8], ox: "MnO4^-", red: "C2O4^2-", e: "Mn: 5 e⁻, C₂O₄²⁻: 2 e⁻ → skupni večkratnik 10: 2 MnO₄⁻ in 5 C₂O₄²⁻" },
  { l: ["MnO4^-", "H2O2", "H^+"], r: ["Mn^2+", "O2", "H2O"], c: [2, 5, 6, 2, 5, 8], ox: "MnO4^-", red: "H2O2", e: "Mn: 5 e⁻, H₂O₂ → O₂: 2 e⁻ → 2 MnO₄⁻ in 5 H₂O₂" },
  { l: ["Cu", "NO3^-", "H^+"], r: ["Cu^2+", "NO", "H2O"], c: [3, 2, 8, 3, 2, 4], ox: "NO3^-", red: "Cu", e: "Cu: 0 → +2 (2 e⁻), N: +5 → +2 (3 e⁻) → 3 Cu in 2 NO₃⁻" },
  { l: ["MnO4^-", "SO3^2-", "H^+"], r: ["Mn^2+", "SO4^2-", "H2O"], c: [2, 5, 6, 2, 5, 3], ox: "MnO4^-", red: "SO3^2-", e: "Mn: 5 e⁻, S: +4 → +6 (2 e⁻) → 2 MnO₄⁻ in 5 SO₃²⁻" },
  { l: ["Cu", "NO3^-", "H^+"], r: ["Cu^2+", "NO2", "H2O"], c: [1, 2, 4, 1, 2, 2], ox: "NO3^-", red: "Cu", e: "Cu: 2 e⁻, N: +5 → +4 (1 e⁻) → 1 Cu in 2 NO₃⁻" },
  { l: ["H2O2", "I^-", "H^+"], r: ["I2", "H2O"], c: [1, 2, 2, 1, 2], ox: "H2O2", red: "I^-", e: "H₂O₂: 2 O iz −1 v −2 (2 e⁻), 2 I⁻ → I₂ (2 e⁻) → 1 : 2" },
  { l: ["MnO4^-", "Cl^-", "H^+"], r: ["Mn^2+", "Cl2", "H2O"], c: [2, 10, 16, 2, 5, 8], ox: "MnO4^-", red: "Cl^-", e: "Mn: 5 e⁻, Cl⁻: 1 e⁻ → 2 MnO₄⁻ in 10 Cl⁻ (5 Cl₂)" },
  { l: ["Zn", "NO3^-", "H^+"], r: ["Zn^2+", "NH4^+", "H2O"], c: [4, 1, 10, 4, 1, 3], ox: "NO3^-", red: "Zn", e: "Zn: 2 e⁻, N: +5 → −3 (8 e⁻) → 4 Zn in 1 NO₃⁻" },
  { l: ["Cr2O7^2-", "SO3^2-", "H^+"], r: ["Cr^3+", "SO4^2-", "H2O"], c: [1, 3, 8, 2, 3, 4], ox: "Cr2O7^2-", red: "SO3^2-", e: "2 Cr: 6 e⁻, S: +4 → +6 (2 e⁻) → 1 Cr₂O₇²⁻ in 3 SO₃²⁻" },
  { l: ["Ag", "NO3^-", "H^+"], r: ["Ag^+", "NO", "H2O"], c: [3, 1, 4, 3, 1, 2], ox: "NO3^-", red: "Ag", e: "Ag: 1 e⁻, N: +5 → +2 (3 e⁻) → 3 Ag in 1 NO₃⁻" },
];
const chargeSum = (sps, cs) => sps.reduce((s, x, i) => s + cs[i] * charge(x), 0);

const genRedoks = {
  id: "dod-kem-ss-redoks-reakcije",
  topics: ["KEM-SS-2/redoks-reakcije"],
  gen(level, r) {
    const eq = r.pick(level === 1 ? REDOX1 : level === 2 ? REDOX2 : REDOX3);
    const side = (arr, off) => arr.map((f, i) => `\\square_{${off + i + 1}}\\,${sp(f)}`).join(" + ");
    const fill = (arr, off) => arr.map((f, i) => `${eq.c[off + i] === 1 ? "" : eq.c[off + i]}\\,${sp(f)}`).join(" + ");
    const nl = eq.l.length;
    const qL = chargeSum(eq.l, eq.c), qR = chargeSum(eq.r, eq.c.slice(nl));
    const intro = level === 2 ? `Uredi polreakcijo (v kislem; $\\mathrm{e^-}$ je elektron).` : level === 3 ? `Uredi enačbo redoks reakcije v kisli raztopini.` : `Uredi enačbo redoks reakcije.`;
    return mk(
      `${intro} Vpiši koeficiente v kvadratkih po vrsti, ločene z vejico:\n\n$$${side(eq.l, 0)} \\rightarrow ${side(eq.r, nl)}$$`,
      { type: "coefficients", values: eq.c },
      level === 2
        ? "Najprej uredi atom, ki spreminja oksidacijsko število, in dodaj elektrone; kisik uredi z $\\mathrm{H_2O}$, vodik s $\\mathrm{H^+}$. Na koncu preveri naboj."
        : `Oksidant je $${sp(eq.ox)}$, reducent $${sp(eq.red)}$. Izenači število oddanih in sprejetih elektronov${level === 3 ? ", nato uredi O z $\\mathrm{H_2O}$ in H s $\\mathrm{H^+}$" : ""}.`,
      null, null,
      level === 2 ? ["\\text{število } e^- = |\\Delta\\,\\text{OŠ}| \\cdot \\text{število atomov}", "\\text{O uredimo z } \\mathrm{H_2O},\\ \\text{H s } \\mathrm{H^+}"] : ["\\text{število oddanih } e^- = \\text{število sprejetih } e^-", "\\text{naboj levo} = \\text{naboj desno}"],
      [eq.e, `$$${fill(eq.l, 0)} \\rightarrow ${fill(eq.r, nl)}$$`, `Preverba naboja: levo $${qL}$, desno $${qR}$.`],
      { inputHint: `npr. ${eq.c.map(() => "1").join(", ")}` }
    );
  },
};

// ---------- galvanski členi in elektroliza ----------
// [kovina, ion, E° (V), z, M (g/mol), rodilnik]
const METAL_E = [["Mg", "Mg^2+", -2.37, 2, 24.31, "magnezija"], ["Al", "Al^3+", -1.66, 3, 26.98, "aluminija"], ["Zn", "Zn^2+", -0.76, 2, 65.38, "cinka"], ["Fe", "Fe^2+", -0.44, 2, 55.85, "železa"], ["Ni", "Ni^2+", -0.25, 2, 58.69, "niklja"], ["Sn", "Sn^2+", -0.14, 2, 118.71, "kositra"], ["Cu", "Cu^2+", 0.34, 2, 63.55, "bakra"], ["Ag", "Ag^+", 0.8, 1, 107.87, "srebra"]];
const PLATE = [["Cu", 2, 63.55, "baker", "bakra"], ["Ag", 1, 107.87, "srebro", "srebra"], ["Ni", 2, 58.69, "nikelj", "niklja"], ["Zn", 2, 65.38, "cink", "cinka"], ["Cr", 3, 52.0, "krom", "kroma"], ["Au", 3, 196.97, "zlato", "zlata"]];
const eTex = (m) => `E^\\circ(${sp(m[1])}/\\mathrm{${m[0]}}) = ${tx(m[2], 2)}\\ \\mathrm{V}`;

const genGalvanski = {
  id: "dod-kem-ss-galvanski-cleni-in-elektroliza",
  topics: ["KEM-SS-2/galvanski-cleni-in-elektroliza"],
  gen(level, r) {
    const name = nm(r);
    const pair = () => {
      for (;;) {
        const [a, b] = r.shuffle(METAL_E).slice(0, 2);
        if (Math.abs(a[2] - b[2]) >= 0.2) return a[2] > b[2] ? [a, b] : [b, a]; // [katoda, anoda]
      }
    };
    if (level === 1) {
      const [K, A] = pair();
      const [first, second] = r.next() < 0.5 ? [K, A] : [A, K];
      if (r.next() < 0.35) {
        return concept(r, {
          q: `Galvanski člen sestavljata polčlena $\\mathrm{${first[0]}}|${sp(first[1])}$ in $\\mathrm{${second[0]}}|${sp(second[1])}$. Standardna potenciala: $${eTex(first)}$, $${eTex(second)}$. Katera elektroda je anoda?`,
          ok: `elektroda iz ${A[5]} (${A[0]})`,
          wrong: [[`elektroda iz ${K[5]} (${K[0]})`, `${K[0]} ima višji standardni potencial – na njej poteka redukcija, zato je katoda.`], ["solni most", "Solni most le sklene električni krog in ohranja nevtralnost raztopin; ni elektroda."]],
          hint: "Na anodi poteka oksidacija. Oksidira se kovina z nižjim (bolj negativnim) standardnim potencialom.",
          given: [eTex(first), eTex(second)],
          find: [T("anoda")],
          sol: [`$${tx(A[2], 2)}\\ \\mathrm{V} < ${tx(K[2], 2)}\\ \\mathrm{V}$, zato se oksidira ${A[0]}: $\\mathrm{${A[0]}} \\rightarrow ${sp(A[1])} + ${A[3]}\\mathrm{e^-}$.`, `Anoda je elektroda iz ${A[5]}.`],
        });
      }
      const E = K[2] - A[2];
      const mis = [[K[2] + A[2], "Si potenciala seštel? Napetost je razlika: E(katoda) − E(anoda)."], [A[2] - K[2], "Napetost člena je pozitivna: od višjega potenciala odštej nižjega."]];
      if (K[3] !== A[3]) mis.push([A[3] * K[2] - K[3] * A[2], "Standardnega potenciala ne množimo s koeficienti v enačbi."]);
      return mk(
        r.pick([
          `Izračunaj standardno napetost galvanskega člena iz polčlenov $\\mathrm{${first[0]}}|${sp(first[1])}$ in $\\mathrm{${second[0]}}|${sp(second[1])}$. Podatki: $${eTex(first)}$, $${eTex(second)}$. ${zaokr(2)}`,
          `${name} ${g(name, "sestavi", "sestavi")} galvanski člen iz ploščice ${first[5]} v raztopini njegovih ionov in ploščice ${second[5]} v raztopini njegovih ionov. Kolikšna je standardna napetost člena? $${eTex(first)}$, $${eTex(second)}$. ${zaokr(2)}`,
        ]),
        num(E, "V", 2, mis),
        "Katoda je polčlen z višjim standardnim potencialom; napetost je razlika potencialov.",
        [eTex(first), eTex(second)], ["E^\\circ_\\text{člen}"], ["E^\\circ_\\text{člen} = E^\\circ(\\text{katoda}) - E^\\circ(\\text{anoda})"],
        [`Katoda: ${K[0]} ($${tx(K[2], 2)}\\ \\mathrm{V}$), anoda: ${A[0]} ($${tx(A[2], 2)}\\ \\mathrm{V}$)`, `$E^\\circ = ${tx(K[2], 2)} - (${tx(A[2], 2)}) = ${tx(E, 2)}\\ \\mathrm{V}$`]
      );
    }
    if (level === 2) {
      const [El, z, M, nom, gen] = r.pick(PLATE);
      const I = r.dec(0.5, 5, 1);
      const tm = r.int(5, 90);
      const m = (I * tm * 60 * M) / (z * F_CONST);
      const d = m < 1 ? 3 : 2;
      return mk(
        r.pick([
          `Pri elektrolizi raztopine soli ${gen} teče tok $${tx(I)}\\ \\mathrm{A}$ ${tm} minut. Koliko gramov ${gen} se izloči na katodi? $M(\\mathrm{${El}}) = ${Mtx(M)}\\ \\mathrm{g/mol}$, $F = 96\\,500\\ \\mathrm{C/mol}$, ion ima naboj $${z}+$. ${zaokr(d)}`,
          `${name} z elektrolizo prevleče kovinski predmet: skozi raztopino ionov $${sp(`${El}^${z > 1 ? z : ""}+`)}$ ${tm} minut teče tok $${tx(I)}\\ \\mathrm{A}$. Kolikšna masa ${gen} se izloči na predmetu? $M(\\mathrm{${El}}) = ${Mtx(M)}\\ \\mathrm{g/mol}$, $F = 96\\,500\\ \\mathrm{C/mol}$. ${zaokr(d)}`,
        ]),
        num(m, "g", d, [[(I * tm * M) / (z * F_CONST), "Si čas pretvoril v sekunde?"], [(I * tm * 60 * M) / F_CONST, `Za izločitev enega atoma ${El} so potrebni ${z} elektroni (z = ${z}).`], [(I * tm * 60) / (z * F_CONST), "To je množina v molih; pomnoži še z molsko maso."]]),
        "Izračunaj naboj $Q = I \\cdot t$ (čas v sekundah), nato množino elektronov in kovine.",
        [dat("I", tx(I), "A"), dat("t", tm, "min"), dat(`M(\\mathrm{${El}})`, Mtx(M), "g/mol"), "F = 96\\,500\\ \\mathrm{C/mol}"], ["m"], ["Q = I \\cdot t", "m = \\dfrac{Q \\cdot M}{z \\cdot F}"],
        [`$t = ${tm}\\ \\mathrm{min} = ${tm * 60}\\ \\mathrm{s}$, $Q = ${tx(I)} \\cdot ${tm * 60} = ${qty(tx(I * tm * 60), "C")}$`, `$n(\\mathrm{${El}}) = \\dfrac{Q}{z F} = \\dfrac{${tx(I * tm * 60)}}{${z} \\cdot 96\\,500} \\approx ${qty(tx((I * tm * 60) / (z * F_CONST), 5), "mol")}$`, `$m = n \\cdot M ${res(m, d, "g")}$`]
      );
    }
    const kind = r.int(0, 2);
    if (kind === 0) {
      const [El, z, M, nom, gen] = r.pick(PLATE);
      const m = r.dec(0.2, 5, 2);
      const I = r.dec(0.5, 4, 1);
      const t = (m * z * F_CONST) / (M * I) / 60;
      return mk(
        `Koliko minut mora teči tok $${tx(I)}\\ \\mathrm{A}$, da se na katodi izloči $${tx(m)}\\ \\mathrm{g}$ ${gen} iz raztopine ionov $${sp(`${El}^${z > 1 ? z : ""}+`)}$? $M(\\mathrm{${El}}) = ${Mtx(M)}\\ \\mathrm{g/mol}$, $F = 96\\,500\\ \\mathrm{C/mol}$. ${zaokr(1)}`,
        num(t, "min", 1, [[t * 60, "Čas v sekundah pretvori v minute."], [t / z, `Za en atom ${El} so potrebni ${z} elektroni.`]]),
        "Izračunaj množino kovine, iz nje potrebni naboj $Q = z \\cdot n \\cdot F$ in nato čas $t = Q/I$.",
        [dat("m", tx(m), "g"), dat("I", tx(I), "A"), dat(`M(\\mathrm{${El}})`, Mtx(M), "g/mol"), "F = 96\\,500\\ \\mathrm{C/mol}"], ["t"], ["n = \\dfrac{m}{M}", "Q = z \\cdot n \\cdot F", "t = \\dfrac{Q}{I}"],
        [`$n = \\dfrac{${tx(m)}}{${Mtx(M)}} \\approx ${qty(tx(m / M, 5), "mol")}$`, `$Q = ${z} \\cdot ${tx(m / M, 5)} \\cdot 96\\,500 \\approx ${qty(tx((m * z * F_CONST) / M, 0), "C")}$`, `$t = \\dfrac{Q}{I} \\approx ${qty(tx(t * 60, 0), "s")} ${res(t, 1, "min")}$`]
      );
    }
    if (kind === 1) {
      const K = r.pick(METAL_E.filter((m) => m[2] > 0));
      const A = r.pick(METAL_E.filter((m) => m[2] < K[2] - 0.2));
      const Ec = roundHalfUp(K[2] - A[2], 2);
      const EA = K[2] - Ec;
      return mk(
        `Galvanski člen iz polčlenov $\\mathrm{${K[0]}}|${sp(K[1])}$ in $\\mathrm{${A[0]}}|${sp(A[1])}$ ima standardno napetost $${tx(Ec, 2)}\\ \\mathrm{V}$; ${A[0]} je anoda. Izračunaj standardni potencial polčlena $${sp(A[1])}/\\mathrm{${A[0]}}$, če je $${eTex(K)}$. ${zaokr(2)}`,
        num(EA, "V", 2, [[Ec - K[2], "Preveri predznak: E(anoda) = E(katoda) − E(člen)."], [K[2] + Ec, "Anoda ima nižji potencial od katode."]]),
        "Iz $E^\\circ_\\text{člen} = E^\\circ(\\text{katoda}) - E^\\circ(\\text{anoda})$ izrazi potencial anode.",
        [dat("E^\\circ_\\text{člen}", tx(Ec, 2), "V"), eTex(K)], ["E^\\circ(\\text{anoda})"], ["E^\\circ_\\text{člen} = E^\\circ(\\text{katoda}) - E^\\circ(\\text{anoda})", "E^\\circ(\\text{anoda}) = E^\\circ(\\text{katoda}) - E^\\circ_\\text{člen}"],
        [`$E^\\circ(\\text{anoda}) = ${tx(K[2], 2)} - ${tx(Ec, 2)}$`, `$E^\\circ(${sp(A[1])}/\\mathrm{${A[0]}}) = ${tx(EA, 2)}\\ \\mathrm{V}$`]
      );
    }
    const gas = r.next() < 0.6 ? ["H2", "vodika", 2, "katodi"] : ["O2", "kisika", 4, "anodi"];
    const I = r.dec(0.5, 3, 1);
    const tm = r.int(10, 60);
    const n = (I * tm * 60) / (gas[2] * F_CONST);
    const V = n * VM * 1000;
    return mk(
      `Pri elektrolizi vode (z dodatkom $\\mathrm{Na_2SO_4}$) teče tok $${tx(I)}\\ \\mathrm{A}$ ${tm} minut. Koliko mL ${gas[1]} nastane na ${gas[3]} pri normalnih pogojih? Za nastanek ene molekule $${sp(gas[0])}$ so potrebni ${gas[2]} elektroni; $F = 96\\,500\\ \\mathrm{C/mol}$, ${VM_TXT}. ${zaokr(1)}`,
      num(V, "mL", 1, [[V / 60, "Si čas pretvoril v sekunde?"], [V * gas[2], `Za eno molekulo ${spU(gas[0])} so potrebni ${gas[2]} elektroni.`], [V / 1000, "Prostornino zapiši v mL."]], { unitAlternatives: ["ml", "cm3", "cm³"] }),
      "Naboj $Q = I \\cdot t$ deli z $F$ in dobiš množino elektronov; nato upoštevaj, koliko elektronov potrebuje ena molekula plina.",
      [dat("I", tx(I), "A"), dat("t", tm, "min"), dat("z", gas[2]), "F = 96\\,500\\ \\mathrm{C/mol}", VM_DAT], ["V"], ["Q = I \\cdot t", "n = \\dfrac{Q}{z F}", "V = n \\cdot V_m"],
      [`$Q = ${tx(I)} \\cdot ${tm * 60}\\ \\mathrm{s} = ${qty(tx(I * tm * 60), "C")}$`, `$n(${sp(gas[0])}) = \\dfrac{${tx(I * tm * 60)}}{${gas[2]} \\cdot 96\\,500} \\approx ${qty(tx(n, 6), "mol")}$`, `$V = ${tx(n, 6)} \\cdot 22{,}4\\ \\mathrm{L} ${res(V, 1, "mL")}$`]
    );
  },
};

// =====================================================================
// KEM-SS-3
// =====================================================================

// ---------- ogljikovodiki ----------
const PREF = ["", "met", "et", "prop", "but", "pent", "heks", "hept", "okt", "non", "dek"];
// Nerazvejana veriga z n atomi C in večkratno vezjo reda b med C_p in C_(p+1); vrne zapis z vezmi.
function chain(n, b, p) {
  const atoms = [];
  for (let i = 1; i <= n; i++) {
    const nb = (i > 1) + (i < n);
    const extra = b > 1 && (i === p || i === p + 1) ? b - 1 : 0;
    const h = 4 - nb - extra;
    atoms.push(`C${h ? `H${h > 1 ? h : ""}` : ""}`);
  }
  return atoms;
}
const chainStr = (atoms, b, p, rev) => {
  const bonds = atoms.slice(1).map((_, i) => (i + 1 === p ? (b === 2 ? "=" : "#") : "-"));
  let s = atoms[0];
  for (let i = 1; i < atoms.length; i++) s += bonds[i - 1] + atoms[i];
  if (!rev) return s;
  const a2 = [...atoms].reverse(), b2 = [...bonds].reverse();
  let t = a2[0];
  for (let i = 1; i < a2.length; i++) t += b2[i - 1] + a2[i];
  return t;
};
const hcName = (n, b, p) => (b === 1 ? `${PREF[n]}an` : n <= 3 ? `${PREF[n]}${b === 2 ? "en" : "in"}` : `${PREF[n]}-${p}-${b === 2 ? "en" : "in"}`);
const SUFFIX_WHY = "Samo enojne vezi → končnica -an, dvojna vez → -en, trojna vez → -in.";
const BRANCHED = [
  ["CH3-CH(CH3)-CH3", "2-metilpropan", [["butan", "Spojina je razvejana; najdaljša veriga ima 3 atome C."], ["1,1-dimetiletan", "Glavna veriga mora biti najdaljša (3 C)."], ["2-metilbutan", "Atomov C je skupaj 4; glavna veriga ima 3."]]],
  ["CH3-CH(CH3)-CH2-CH3", "2-metilbutan", [["3-metilbutan", "Verigo številčimo s strani, ki da substituentu najmanjši lokant."], ["pentan", "Spojina je razvejana; pentan je nerazvejan izomer."], ["2-etilpropan", "Glavna veriga mora biti najdaljša – ima 4 C."]]],
  ["CH3-C(CH3)2-CH3", "2,2-dimetilpropan", [["2-dimetilpropan", "Za vsako metilno skupino zapišemo lokant: 2,2-."], ["2,2-metilpropan", "Dve enaki skupini označimo s predpono di-."], ["pentan", "Spojina je razvejana; pentan je nerazvejan izomer."]]],
  ["CH3-CH2-CH(CH3)-CH2-CH3", "3-metilpentan", [["2-etilbutan", "Glavna veriga mora biti najdaljša – ima 5 C."], ["heksan", "Spojina je razvejana; heksan je nerazvejan izomer."], ["3-metilheksan", "Glavna veriga ima 5 atomov C, ne 6."]]],
  ["CH3-CH(CH3)-CH(CH3)-CH3", "2,3-dimetilbutan", [["2,3-metilbutan", "Dve enaki skupini označimo s predpono di-."], ["1,2,3-trimetilpropan", "Glavna veriga mora biti najdaljša – ima 4 C."], ["2-metilpentan", "Najdaljša veriga ima 4 C in nosi dve metilni skupini."]]],
  ["CH3-CH(CH3)-CH2-CH2-CH3", "2-metilpentan", [["4-metilpentan", "Verigo številčimo s strani, ki da substituentu najmanjši lokant."], ["heksan", "Spojina je razvejana; heksan je nerazvejan izomer."], ["2-metilbutan", "Glavna veriga ima 5 atomov C."]]],
  ["CH3-C(CH3)2-CH2-CH3", "2,2-dimetilbutan", [["3,3-dimetilbutan", "Številčimo s strani, ki da substituentoma najmanjša lokanta."], ["2-dimetilbutan", "Za vsako metilno skupino zapišemo lokant: 2,2-."], ["2,2-dimetilpropan", "Glavna veriga ima 4 atome C."]]],
  ["CH3-CH2-CH(CH2-CH3)-CH2-CH3", "3-etilpentan", [["heptan", "Spojina je razvejana; najdaljša veriga ima 5 C."], ["2-etilpentan", "Etilna skupina je na sredini verige – lokant 3."], ["3-etilheksan", "Najdaljša veriga ima 5 atomov C."]]],
  ["CH2=C(CH3)-CH3", "2-metilpropen", [["2-metilprop-2-en", "Dvojna vez dobi najmanjši lokant (1), pri propenu ga izpustimo."], ["but-1-en", "Spojina je razvejana; but-1-en je nerazvejan izomer."], ["2-metilpropan", SUFFIX_WHY]]],
  ["CH3-CH(CH3)-CH=CH2", "3-metilbut-1-en", [["2-metilbut-3-en", "Številčimo tako, da ima dvojna vez najmanjši lokant."], ["3-metilbutan", SUFFIX_WHY], ["pent-1-en", "Spojina je razvejana; pent-1-en je nerazvejan izomer."]]],
  ["CH3-CH2-CH(CH3)-CH2-CH2-CH3", "3-metilheksan", [["4-metilheksan", "Verigo številčimo s strani, ki da substituentu najmanjši lokant."], ["2-etilpentan", "Glavna veriga mora biti najdaljša – ima 6 C."], ["heptan", "Spojina je razvejana; heptan je nerazvejan izomer."]]],
  ["CH3-C#C-CH(CH3)-CH3", "4-metilpent-2-in", [["2-metilpent-3-in", "Številčimo tako, da ima trojna vez najmanjši lokant."], ["4-metilpent-2-en", SUFFIX_WHY], ["2-metilpentan", SUFFIX_WHY]]],
  ["C6H5-CH3", "metilbenzen (toluen)", [["metilcikloheksan", "Benzenov obroč ni cikloalkan – ima delokalizirane elektrone."], ["heptan", "Spojina vsebuje benzenov obroč C₆H₅–."]]],
  ["C6H5-CH2-CH3", "etilbenzen", [["etilcikloheksan", "Benzenov obroč ni cikloalkan."], ["oktan", "Spojina vsebuje benzenov obroč C₆H₅–."], ["dimetilbenzen", "Na obroču je ena etilna skupina, ne dve metilni."]]],
];
const HC_BURN = [["CH4", "metan", 1, 4], ["C2H6", "etan", 2, 6], ["C3H8", "propan", 3, 8], ["C4H10", "butan", 4, 10], ["C5H12", "pentan", 5, 12], ["C6H14", "heksan", 6, 14], ["C8H18", "oktan", 8, 18], ["C2H4", "eten", 2, 4], ["C3H6", "propen", 3, 6], ["C2H2", "etin", 2, 2], ["C6H6", "benzen", 6, 6], ["C7H16", "heptan", 7, 16]];
const SERIES = [["alkan", "alkana", 2], ["alken", "alkena", 0], ["alkin", "alkina", -2]];
const AR_CH = "$A_r(\\mathrm{C}) = 12{,}01$, $A_r(\\mathrm{H}) = 1{,}01$";
const AR_CH_DAT = ["A_r(\\mathrm{C}) = 12{,}01", "A_r(\\mathrm{H}) = 1{,}01"];
const mCH = (x, y) => roundHalfUp(12.01 * x + 1.01 * y, 2);

const genOgljikovodiki = {
  id: "dod-kem-ss-ogljikovodiki",
  topics: ["KEM-SS-3/ogljikovodiki"],
  gen(level, r) {
    const name = nm(r);
    if (level === 1) {
      if (r.next() < 0.55) {
        const b = r.pick([1, 2, 2, 3]);
        const n = r.int(b === 1 ? 3 : 2, b === 1 ? 8 : 7);
        const p = b === 1 || n <= 3 ? 1 : r.int(1, Math.floor(n / 2));
        const atoms = chain(n, b, p);
        const rev = n > 3 && r.next() < 0.5;
        const S = chainStr(atoms, b, b === 1 ? 0 : p, rev);
        const ok = hcName(n, b, p);
        const wrong = [];
        if (b > 1 && n > 3 && n - p !== p) wrong.push([hcName(n, b, n - p), "Verigo številčimo s tiste strani, ki je bližje večkratni vezi."]);
        wrong.push([hcName(n, b === 2 ? 1 : 2, p), SUFFIX_WHY]);
        if (b === 1) wrong.push([`${PREF[n]}in`, SUFFIX_WHY]);
        wrong.push([hcName(n + 1, b, p), "Preštej vse atome ogljika v verigi."]);
        if (wrong.length < 3) wrong.push([n > 2 ? hcName(n - 1, b, 1) : hcName(n + 2, b, 1), "Preštej vse atome ogljika v verigi."]);
        return concept(r, {
          q: r.pick([`Kako se imenuje ogljikovodik $${org(S)}$?`, `${name} ${g(name, "je zapisal", "je zapisala")} formulo $${org(S)}$. Katero je pravilno ime spojine?`]),
          ok,
          wrong,
          hint: "Preštej atome C (koren imena), poglej vrsto vezi (končnica -an, -en, -in) in verigo oštevilči s strani, ki je bližje večkratni vezi.",
          given: null,
          sol: [`Veriga ima ${n} atom${n === 2 ? "a" : n < 5 ? "e" : "ov"} C → koren »${PREF[n]}«.`, b === 1 ? "Samo enojne vezi → končnica -an." : `${b === 2 ? "Dvojna" : "Trojna"} vez${n > 3 ? ` je med C${p} in C${p + 1}` : ""} → ${n > 3 ? `-${p}-` : ""}${b === 2 ? "en" : "in"}.`, `Ime: ${ok}.`],
        });
      }
      const [s, sg, k] = r.pick(SERIES);
      const n = r.int(3, 12);
      const h = 2 * n + k;
      return mk(
        r.pick([`Koliko atomov vodika ima molekula nerazvejanega ${sg} z ${n} atomi ogljika?`, `${name} ${g(name, "piše", "piše")} molekulsko formulo ${sg}, ki ima ${n} atomov ogljika. Koliko atomov H zapiše?`]),
        num(h, null, null, SERIES.filter((x) => x[0] !== s).map((x) => [2 * n + x[2], `To je formula za ${x[0]}e; ${sg} ima formulo C_nH_${k === 2 ? "2n+2" : k === 0 ? "2n" : "2n−2"}.`])),
        "Uporabi splošno formulo homologne vrste: alkani $\\mathrm{C_nH_{2n+2}}$, alkeni $\\mathrm{C_nH_{2n}}$, alkini $\\mathrm{C_nH_{2n-2}}$.",
        [dat("n(\\mathrm{C})", n)], ["n(\\mathrm{H})"], [`\\mathrm{C}_n\\mathrm{H}_{2n${k === 2 ? "+2" : k === 0 ? "" : "-2"}}`],
        [`Splošna formula ${sg}: $\\mathrm{C}_n\\mathrm{H}_{2n${k === 2 ? "+2" : k === 0 ? "" : "-2"}}$`, `$n(\\mathrm{H}) = 2 \\cdot ${n}${k > 0 ? " + 2" : k < 0 ? " - 2" : ""} = ${h}$ (formula $\\mathrm{C_{${n}}H_{${h}}}$)`]
      );
    }
    if (level === 2) {
      if (r.next() < 0.5) {
        const [S, ok, wrong] = r.pick(BRANCHED);
        return concept(r, {
          q: r.pick([`Kako se po IUPAC imenuje spojina $${org(S)}$?`, `Izberi pravilno ime spojine $${org(S)}$.`]),
          ok,
          wrong,
          hint: "Poišči najdaljšo verigo (z večkratno vezjo), oštevilči jo tako, da imajo večkratna vez in substituenti najmanjše lokante, nato poimenuj substituente.",
          given: null,
          sol: [`Najdaljša veriga in lokanti: ${ok}.`, "Substituente naštejemo z lokanti, enake združimo s predponami di-, tri-."],
        });
      }
      const [F, ime, x, y] = r.pick(HC_BURN);
      const n = r.dec(0.5, 4, 1);
      const o2 = n * (x + y / 4);
      return mk(
        r.pick([`Koliko molov kisika potrebujemo za popolno gorenje $${tx(n)}\\ \\mathrm{mol}$ ${ime.replace(/an$/, "ana").replace(/en$/, "ena").replace(/in$/, "ina")} ($${sp(F)}$)? ${zaokr(2)}`, `${name} ${g(name, "sežge", "sežge")} $${tx(n)}\\ \\mathrm{mol}$ $${sp(F)}$ (${ime}). Koliko molov $\\mathrm{O_2}$ se porabi pri popolnem gorenju? ${zaokr(2)}`]),
        num(o2, "mol", 2, [[n * (x + y / 2), "Za 2 atoma H nastane 1 molekula H₂O, za katero potrebujemo ½ O₂."], [n * x, "Kisik se porabi tudi za nastanek vode."], [n * (2 * x + y / 2), "Si štel atome O namesto molekul O₂?"]]),
        "Zapiši in uredi enačbo gorenja: nastaneta $\\mathrm{CO_2}$ in $\\mathrm{H_2O}$.",
        [dat("n", tx(n), "mol")], ["n(\\mathrm{O_2})"], [`\\mathrm{C_xH_y} + \\left(x + \\dfrac{y}{4}\\right)\\mathrm{O_2} \\rightarrow x\\,\\mathrm{CO_2} + \\dfrac{y}{2}\\,\\mathrm{H_2O}`],
        [`Za 1 mol $${sp(F)}$: $${x} + \\dfrac{${y}}{4} = ${tx(x + y / 4)}\\ \\mathrm{mol\\ O_2}$ (nastane ${x} mol $\\mathrm{CO_2}$ in ${y / 2} mol $\\mathrm{H_2O}$)`, `$n(\\mathrm{O_2}) = ${tx(n)} \\cdot ${tx(x + y / 4)} ${res(o2, 2, "mol")}$`]
      );
    }
    if (r.next() < 0.5) {
      const [s, sg, k] = r.pick(SERIES);
      const n = r.int(k < 0 ? 2 : k === 0 ? 2 : 1, 10);
      const M = 12 * n + 2 * n + k;
      return mk(
        r.pick([`Nerazvejan ${s} ima molsko maso $${M}\\ \\mathrm{g/mol}$. Koliko atomov ogljika ima molekula? Uporabi $A_r(\\mathrm{C}) = 12$ in $A_r(\\mathrm{H}) = 1$.`, `${name} ${g(name, "je določil", "je določila")} molsko maso neznanega ${sg}: $${M}\\ \\mathrm{g/mol}$. Koliko atomov C ima molekula? ($A_r(\\mathrm{C}) = 12$, $A_r(\\mathrm{H}) = 1$)`]),
        num(n, null, null, [[roundHalfUp(M / 12, 0), "Pozabil si na atome vodika: M = 12n + (število H)."], [2 * n + k, "To je število atomov vodika."]]),
        `Izrazi molsko maso s splošno formulo: $M = 12n + 1 \\cdot (2n${k > 0 ? "+2" : k < 0 ? "-2" : ""})$ in reši enačbo.`,
        [dat("M", M, "g/mol"), "A_r(\\mathrm{C}) = 12", "A_r(\\mathrm{H}) = 1"], ["n(\\mathrm{C})"], [`M = 12n + (2n${k > 0 ? "+2" : k < 0 ? "-2" : ""}) = 14n${k > 0 ? "+2" : k < 0 ? "-2" : ""}`],
        [`$14n${k > 0 ? " + 2" : k < 0 ? " - 2" : ""} = ${M}$`, `$n = \\dfrac{${M}${k > 0 ? " - 2" : k < 0 ? " + 2" : ""}}{14} = ${n}$ (formula $\\mathrm{C_{${n}}H_{${2 * n + k}}}$)`]
      );
    }
    const [F, ime, x, y] = r.pick(HC_BURN);
    const M = mCH(x, y);
    const m = r.dec(1, 50, 1);
    const V = (m / M) * x * VM;
    return mk(
      `Koliko litrov $\\mathrm{CO_2}$ (pri normalnih pogojih) nastane pri popolnem gorenju $${tx(m)}\\ \\mathrm{g}$ ${ime.replace(/an$/, "ana").replace(/en$/, "ena").replace(/in$/, "ina")} ($${sp(F)}$)? $M(${sp(F)}) = ${Mtx(M)}\\ \\mathrm{g/mol}$, ${VM_TXT}. ${zaokr(2)}`,
      num(V, "L", 2, [[(m / M) * VM, `Iz 1 mol ${spU(F)} nastane ${x} mol CO₂.`], [(m / M) * (y / 2) * VM, "To je prostornina vodne pare; vprašanje je o CO₂."], [m * x * VM, "Najprej maso pretvori v množino."]], { unitAlternatives: ["l", "dm3", "dm³"] }),
      "Maso ogljikovodika pretvori v množino; vsak atom C da eno molekulo $\\mathrm{CO_2}$.",
      [dat("m", tx(m), "g"), dat(`M(${sp(F)})`, Mtx(M), "g/mol"), VM_DAT], ["V(\\mathrm{CO_2})"], ["n = \\dfrac{m}{M}", `n(\\mathrm{CO_2}) = ${x}\\,n(${sp(F)})`, "V = n \\cdot V_m"],
      [`$n(${sp(F)}) = \\dfrac{${tx(m)}}{${Mtx(M)}} \\approx ${qty(tx(m / M, 4), "mol")}$`, `$n(\\mathrm{CO_2}) = ${x} \\cdot ${tx(m / M, 4)} \\approx ${qty(tx((m / M) * x, 4), "mol")}$`, `$V = ${tx((m / M) * x, 4)} \\cdot 22{,}4\\ \\mathrm{L} ${res(V, 2, "L")}$`]
    );
  },
};

// ---------- izomerija ----------
// [formula, dodatek k vprašanju, število izomerov, imena, tipične napake]
const ISO1 = [
  ["C4H10", "", 2, ["butan", "2-metilpropan"], [[1, "Tudi razvejana veriga (2-metilpropan) je izomer."], [3, "Preveri, ali nisi iste molekule narisal dvakrat."]]],
  ["C5H12", "", 3, ["pentan", "2-metilbutan", "2,2-dimetilpropan"], [[2, "Ne pozabi na 2,2-dimetilpropan."], [4, "2-metilbutan in »3-metilbutan« sta ista molekula."]]],
  ["C3H7Cl", "", 2, ["1-kloropropan", "2-kloropropan"], [[3, "»3-kloropropan« je ista molekula kot 1-kloropropan."], [1, "Cl je lahko na koncu ali na sredini verige."]]],
  ["C2H4Cl2", "", 2, ["1,1-dikloroetan", "1,2-dikloroetan"], [[1, "Atoma Cl sta lahko na istem ali na različnih atomih C."], [3, "»2,2-dikloroetan« je isto kot 1,1-dikloroetan."]]],
  ["C2H6O", "", 2, ["etanol", "metoksimetan (dimetil eter)"], [[1, "Ne pozabi na funkcionalni izomer – eter."]]],
  ["C3H8O", "", 3, ["propan-1-ol", "propan-2-ol", "metoksietan"], [[2, "Ne pozabi na funkcionalni izomer – eter."], [1, "OH je lahko na koncu ali na sredini verige."]]],
  ["C4H8", " (samo alkeni, brez stereoizomerov)", 3, ["but-1-en", "but-2-en", "2-metilpropen"], [[2, "Ne pozabi na razvejani 2-metilpropen."], [4, "Cis- in trans-but-2-en sta stereoizomera; tu štejemo le strukturne."]]],
  ["C4H9Cl", "", 4, ["1-klorobutan", "2-klorobutan", "1-kloro-2-metilpropan", "2-kloro-2-metilpropan"], [[2, "Upoštevaj tudi razvejano verigo (2-metilpropan)."], [3, "Na 2-metilpropanu sta dve različni mesti za Cl."]]],
  ["C3H6", "", 2, ["propen", "ciklopropan"], [[1, "Tudi obročasta spojina ciklopropan ima to formulo."]]],
];
const ISO3 = [
  ["C6H14", "", 5, ["heksan", "2-metilpentan", "3-metilpentan", "2,2-dimetilbutan", "2,3-dimetilbutan"], [[4, "Ne pozabi na 3-metilpentan ali 2,2-dimetilbutan."], [6, "Preveri, ali nisi iste molekule narisal dvakrat (npr. 2- in 4-metilpentan)."]]],
  ["C5H10", " (samo alkeni, brez stereoizomerov)", 5, ["pent-1-en", "pent-2-en", "2-metilbut-1-en", "3-metilbut-1-en", "2-metilbut-2-en"], [[2, "Upoštevaj tudi razvejane verige."], [6, "Cis/trans-pent-2-en štejemo kot en strukturni izomer."]]],
  ["C4H10O", "", 7, ["butan-1-ol", "butan-2-ol", "2-metilpropan-1-ol", "2-metilpropan-2-ol", "1-metoksipropan", "2-metoksipropan", "etoksietan"], [[4, "Ne pozabi na funkcionalne izomere – etre."], [3, "Upoštevaj tudi razvejano verigo."]]],
  ["C3H6Cl2", "", 4, ["1,1-dikloropropan", "1,2-dikloropropan", "1,3-dikloropropan", "2,2-dikloropropan"], [[3, "Oba Cl sta lahko tudi na istem atomu C (1,1- in 2,2-)."]]],
  ["C5H11Cl", "", 8, ["1-kloropentan", "2-kloropentan", "3-kloropentan", "1-kloro-2-metilbutan", "2-kloro-2-metilbutan", "2-kloro-3-metilbutan", "1-kloro-3-metilbutan", "1-kloro-2,2-dimetilpropan"], [[3, "Upoštevaj tudi razvejane verige (2-metilbutan, 2,2-dimetilpropan)."]]],
];
const ISO_T = { V: "verižna (skeletna)", P: "položajna", F: "funkcionalna", G: "geometrijska (cis-trans)", O: "optična" };
const ISO_D = { V: "Verižni izomeri se razlikujejo po razvejanosti verige.", P: "Položajni izomeri imajo isto skupino ali vez na drugem mestu.", F: "Funkcionalni izomeri imajo različni funkcionalni skupini.", G: "Geometrijska izomera se razlikujeta po razporeditvi skupin ob dvojni vezi.", O: "Optična izomera sta zrcalni sliki, ki se ne prekrivata." };
const ISO_PAIRS = [
  ["butan", "2-metilpropan", "V", "se razlikujeta po razvejanosti verige"], ["pentan", "2,2-dimetilpropan", "V", "se razlikujeta po razvejanosti verige"], ["heksan", "2-metilpentan", "V", "se razlikujeta po razvejanosti verige"],
  ["but-1-en", "but-2-en", "P", "se razlikujeta po legi dvojne vezi"], ["propan-1-ol", "propan-2-ol", "P", "se razlikujeta po legi skupine OH"], ["1-kloropropan", "2-kloropropan", "P", "se razlikujeta po legi atoma Cl"], ["pentan-2-on", "pentan-3-on", "P", "se razlikujeta po legi karbonilne skupine"],
  ["etanol", "metoksimetan", "F", "imata različni funkcionalni skupini (alkohol, eter)"], ["propanal", "propanon", "F", "imata različni funkcionalni skupini (aldehid, keton)"], ["propanojska kislina", "metil etanoat", "F", "imata različni funkcionalni skupini (karboksilna kislina, ester)"],
  ["cis-but-2-en", "trans-but-2-en", "G", "se razlikujeta le po razporeditvi skupin ob dvojni vezi"], ["cis-1,2-dikloroeten", "trans-1,2-dikloroeten", "G", "se razlikujeta le po razporeditvi atomov Cl ob dvojni vezi"],
  ["(R)-butan-2-ol", "(S)-butan-2-ol", "O", "sta zrcalni sliki (enantiomera)"], ["D-alanin", "L-alanin", "O", "sta zrcalni sliki (enantiomera)"],
];
const CHIRAL = [
  ["CH3-CH(OH)-CH2-CH3", "butan-2-ol", 1, [[0, "C2 ima štiri različne skupine: H, OH, CH₃ in C₂H₅."]]],
  ["CH3-CHCl-CH2-CH3", "2-klorobutan", 1, [[0, "C2 ima štiri različne skupine: H, Cl, CH₃ in C₂H₅."]]],
  ["CH3-CH(OH)-COOH", "mlečna kislina", 1, [[0, "C2 ima H, OH, CH₃ in COOH."], [2, "Atom C v skupini COOH ima dvojno vez – ni asimetričen."]]],
  ["CH3-CH(NH2)-COOH", "alanin", 1, [[0, "C2 ima H, NH₂, CH₃ in COOH."], [2, "Atom C v skupini COOH ni asimetričen."]]],
  ["CH3-CH2-CH2-CH2-OH", "butan-1-ol", 0, [[1, "Noben atom C nima štirih različnih skupin; skupina CH₂ ima dva enaka H."]]],
  ["CH3-CH(OH)-CH3", "propan-2-ol", 0, [[1, "C2 ima dve enaki skupini CH₃, zato ni asimetričen."]]],
  ["CH3-CHBr-CHBr-CH3", "2,3-dibromobutan", 2, [[1, "Tudi drugi atom C z Br ima štiri različne skupine."]]],
  ["CH3-CH2-CH(CH3)-CH2-CH2-CH3", "3-metilheksan", 1, [[0, "C3 ima H, CH₃, C₂H₅ in C₃H₇ – štiri različne skupine."]]],
  ["CH3-CH(CH3)-CH2-CH3", "2-metilbutan", 0, [[1, "C2 ima dve enaki skupini CH₃."]]],
  ["CH2(OH)-CH(OH)-CH2(OH)", "glicerol", 0, [[1, "C2 ima dve enaki skupini CH₂OH."]]],
  ["CH3-CHBr-CHCl-CH3", "2-bromo-3-klorobutan", 2, [[1, "Tudi C3 ima štiri različne skupine."]]],
  ["CH2(OH)-CH(OH)-CHO", "glicerinaldehid", 1, [[0, "C2 ima H, OH, CHO in CH₂OH."], [2, "Atomi C v skupinah CH₂OH in CHO niso asimetrični."]]],
];
const CT_YES = ["but-2-en", "pent-2-en", "1,2-dikloroeten", "heks-3-en", "1-bromopropen"];
const CT_NO = [["but-1-en", "Na C1 sta dva atoma H."], ["2-metilpropen", "Na C2 sta dve skupini CH₃."], ["propen", "Na C1 sta dva atoma H."], ["2-metilbut-2-en", "Na C2 sta dve skupini CH₃."], ["eten", "Na vsakem atomu C sta dva atoma H."], ["1,1-dikloroeten", "Na C1 sta dva atoma Cl, na C2 dva atoma H."]];

const isoCount = (r, E, name) => {
  const [F, extra, k, names, mis] = E;
  return mk(
    r.pick([`Koliko strukturnih izomerov ima formula $${sp(F)}$${extra}?`, `${name} ${g(name, "riše", "riše")} vse strukturne izomere s formulo $${sp(F)}$${extra}. Koliko različnih spojin mora narisati?`]),
    num(k, null, null, mis),
    "Sistematično: začni z najdaljšo verigo, nato jo krajšaj in premikaj skupine. Pomisli tudi na druge funkcionalne skupine (npr. etre) in obroče.",
    null, null, false,
    [`Izomeri: ${names.join(", ")}.`, `Skupaj: ${k}.`]
  );
};

const genIzomerija = {
  id: "dod-kem-ss-izomerija",
  topics: ["KEM-SS-3/izomerija"],
  gen(level, r) {
    const name = nm(r);
    if (level === 1) return isoCount(r, r.pick(ISO1), name);
    if (level === 2) {
      const [A, B, t, diff] = r.pick(ISO_PAIRS);
      const others = r.shuffle(Object.keys(ISO_T).filter((x) => x !== t)).slice(0, 3);
      return concept(r, {
        q: r.pick([`Kakšna izomerija povezuje ${A} in ${B}?`, `${name} ${g(name, "primerja", "primerja")} spojini ${A} in ${B}. Katera vrsta izomerije je to?`]),
        ok: ISO_T[t],
        wrong: others.map((o) => [ISO_T[o], `${ISO_D[o]} Spojini pa ${diff}.`]),
        hint: "Nariši obe spojini. Ali se razlikujeta po verigi, po legi skupine, po vrsti skupine ali le po prostorski razporeditvi?",
        given: null,
        sol: [`Spojini ${diff}.`, `To je ${ISO_T[t]} izomerija.`],
      });
    }
    const k = r.next();
    if (k < 0.4) {
      const [S, ime, c, mis] = r.pick(CHIRAL);
      return mk(
        r.pick([`Koliko asimetričnih (kiralnih) atomov ogljika ima ${ime} ($${org(S)}$)?`, `Za ${ime} ($${org(S)}$) ugotovi, koliko atomov C ima štiri različne skupine.`]),
        num(c, null, null, mis),
        "Asimetrični atom C ima štiri različne skupine. Atomi z dvojno vezjo in skupine CH₃, CH₂ to niso.",
        null, null, ["\\text{asimetrični C: štiri različne skupine na istem atomu C}"],
        [`Preverimo vsak atom C: le ${c === 0 ? "noben nima" : `${c === 1 ? "en ima" : `${c} imata`}`} štiri različne skupine.`, `Število asimetričnih atomov C: ${c}${c > 0 ? " – spojina ima optične izomere" : " – spojina ni optično aktivna"}.`]
      );
    }
    if (k < 0.7) {
      const yes = r.pick(CT_YES);
      const no = r.shuffle(CT_NO).slice(0, 3);
      const list = r.shuffle([yes, ...no.map((x) => x[0])]);
      return concept(r, {
        q: `Katera od spojin ${list.join(", ")} ima cis-trans (geometrijske) izomere?`,
        ok: yes,
        wrong: no.map(([x, w]) => [x, `${w} Cis-trans izomerija zahteva dve različni skupini na vsakem atomu C dvojne vezi.`]),
        hint: "Nariši dvojno vez in preveri, ali ima vsak od obeh atomov C dve različni skupini.",
        given: null,
        sol: [`${yes}: oba atoma C dvojne vezi imata po dve različni skupini.`, "Zato obstajata cis- in trans-izomer."],
      });
    }
    return isoCount(r, r.pick(ISO3), name);
  },
};

// ---------- halogenoalkani in alkoholi ----------
const ALC_CLASS = [
  ["CH3-CH2-OH", "etanol", "P"], ["CH3-CH(OH)-CH3", "propan-2-ol", "S"], ["(CH3)3C-OH", "2-metilpropan-2-ol", "T"], ["CH3-CH2-CH2-CH2-OH", "butan-1-ol", "P"],
  ["CH3-CH(OH)-CH2-CH3", "butan-2-ol", "S"], ["CH3-CH2-C(CH3)(OH)-CH3", "2-metilbutan-2-ol", "T"], ["CH3-CH2-CH(OH)-CH2-CH3", "pentan-3-ol", "S"],
  ["(CH3)2CH-CH2-OH", "2-metilpropan-1-ol", "P"], ["CH3-CH2-CH2-OH", "propan-1-ol", "P"], ["(CH3)2C(OH)-CH(CH3)2", "2,3-dimetilbutan-2-ol", "T"],
];
const ALC_T = { P: "primarni", S: "sekundarni", T: "terciarni" };
const ALC_N = { P: "en atom C (ali nobenega)", S: "dva atoma C", T: "tri atome C" };
const OXID = [
  ["etanol", "etanal", [["etanojska kislina", "Kislina nastane šele pri nadaljnji oksidaciji; aldehid smo sproti oddestilirali."], ["ne reagira", "Primarni alkoholi se oksidirajo."], ["eten", "Alken nastane pri dehidraciji (eliminaciji), ne pri oksidaciji."]]],
  ["propan-1-ol", "propanal", [["propanon", "Keton nastane iz sekundarnega alkohola."], ["propanojska kislina", "Kislina nastane šele pri nadaljnji oksidaciji; aldehid smo sproti oddestilirali."], ["ne reagira", "Primarni alkoholi se oksidirajo."]]],
  ["butan-1-ol", "butanal", [["butanon", "Keton nastane iz sekundarnega alkohola."], ["butanojska kislina", "Kislina nastane šele pri nadaljnji oksidaciji; aldehid smo sproti oddestilirali."], ["but-1-en", "Alken nastane pri dehidraciji, ne pri oksidaciji."]]],
  ["propan-2-ol", "propanon", [["propanal", "Aldehid nastane iz primarnega alkohola; tu je OH na srednjem atomu C."], ["propanojska kislina", "Sekundarni alkohol se oksidira le do ketona."], ["ne reagira", "Sekundarni alkoholi se oksidirajo v ketone."]]],
  ["butan-2-ol", "butanon", [["butanal", "Aldehid nastane iz primarnega alkohola."], ["butanojska kislina", "Sekundarni alkohol se oksidira le do ketona."], ["ne reagira", "Sekundarni alkoholi se oksidirajo v ketone."]]],
  ["pentan-3-ol", "pentan-3-on", [["pentanal", "Aldehid nastane iz primarnega alkohola."], ["pentan-2-on", "Karbonilna skupina nastane na istem atomu C, kjer je bila OH."], ["ne reagira", "Sekundarni alkoholi se oksidirajo v ketone."]]],
  ["cikloheksanol", "cikloheksanon", [["heksanal", "Obroč ostane cel; sekundarni alkohol da keton."], ["cikloheksen", "Alken nastane pri dehidraciji, ne pri oksidaciji."], ["ne reagira", "Sekundarni alkoholi se oksidirajo v ketone."]]],
  ["2-metilpropan-2-ol", "ne reagira (terciarni alkohol)", [["2-metilpropanal", "Atom C z OH nima vodika, zato aldehid ne more nastati."], ["propanon", "Pri blagi oksidaciji se vez C–C ne pretrga."], ["2-metilpropanojska kislina", "Terciarni alkohol se pri blagi oksidaciji ne oksidira."]]],
  ["2-metilbutan-2-ol", "ne reagira (terciarni alkohol)", [["2-metilbutanal", "Atom C z OH nima vodika, zato aldehid ne more nastati."], ["butanon", "Pri blagi oksidaciji se vez C–C ne pretrga."], ["2-metilbutan-2-on", "Atom C z OH je vezan na tri atome C; keton bi zahteval pet vezi."]]],
];
const HALO = [
  ["bromoetan", "z vodno raztopino NaOH", "etanol", "S", [["eten", "Eliminacija poteče z močno bazo v etanolu pri segrevanju."], ["etan", "Pri substituciji Br zamenja skupina OH, ne vodik."]]],
  ["bromoetan", "s KOH v etanolu pri segrevanju", "eten", "E", [["etanol", "V etanolni raztopini KOH pri segrevanju prevlada eliminacija."], ["etin", "Odcepi se ena molekula HBr – nastane dvojna vez."]]],
  ["2-bromopropan", "z vodno raztopino NaOH", "propan-2-ol", "S", [["propen", "Eliminacija poteče z močno bazo v etanolu pri segrevanju."], ["propan-1-ol", "Skupina OH zamenja Br na istem atomu C (C2)."]]],
  ["2-bromopropan", "s KOH v etanolu pri segrevanju", "propen", "E", [["propan-2-ol", "V etanolni raztopini KOH pri segrevanju prevlada eliminacija."], ["propin", "Odcepi se ena molekula HBr – nastane dvojna vez."]]],
  ["1-klorobutan", "z vodno raztopino NaOH", "butan-1-ol", "S", [["but-1-en", "Eliminacija poteče z bazo v etanolu pri segrevanju."], ["butan-2-ol", "Skupina OH zamenja Cl na istem atomu C."]]],
  ["1-klorobutan", "s KOH v etanolu pri segrevanju", "but-1-en", "E", [["butan-1-ol", "V etanolni raztopini KOH pri segrevanju prevlada eliminacija."], ["but-2-en", "Dvojna vez nastane med C1 (kjer je bil Cl) in C2."]]],
  ["klorometan", "z vodno raztopino NaOH", "metanol", "S", [["metan", "Pri substituciji Cl zamenja skupina OH, ne vodik."], ["eten", "Iz enega atoma C alken ne more nastati."]]],
  ["2-kloro-2-metilpropan", "z vodno raztopino NaOH", "2-metilpropan-2-ol", "S", [["2-metilpropen", "Eliminacija poteče z bazo v etanolu pri segrevanju."], ["2-metilpropan-1-ol", "Skupina OH zamenja Cl na istem atomu C."]]],
];

const genHaloAlk = {
  id: "dod-kem-ss-halogenoalkani-in-alkoholi",
  topics: ["KEM-SS-3/halogenoalkani-in-alkoholi"],
  gen(level, r) {
    const name = nm(r);
    if (level === 1) {
      const [S, ime, t] = r.pick(ALC_CLASS);
      return concept(r, {
        q: r.pick([`Ali je ${ime} ($${org(S)}$) primarni, sekundarni ali terciarni alkohol?`, `${name} ${g(name, "razvršča", "razvršča")} alkohole. Kam spada ${ime} ($${org(S)}$)?`]),
        ok: `${ALC_T[t]} alkohol`,
        wrong: Object.keys(ALC_T).filter((x) => x !== t).map((x) => [`${ALC_T[x]} alkohol`, `Atom C, ki nosi skupino OH, je vezan na ${ALC_N[t]}, zato je alkohol ${ALC_T[t]}.`]),
        hint: "Poišči atom C, na katerega je vezana skupina OH, in preštej, na koliko drugih atomov C je vezan.",
        given: null,
        sol: [`Atom C s skupino OH je vezan na ${ALC_N[t]}.`, `${ime[0].toUpperCase() + ime.slice(1)} je ${ALC_T[t]} alkohol.`],
      });
    }
    if (level === 2) {
      const k = r.next();
      if (k < 0.35) {
        const [alc, ok, wrong] = r.pick(OXID);
        return concept(r, {
          q: `Kaj nastane pri blagi oksidaciji ${alc.replace(/ol$/, "ola")} z nakisano raztopino kalijevega dikromata (morebitni aldehid sproti oddestiliramo)?`,
          ok,
          wrong,
          hint: "Ugotovi, ali je alkohol primarni, sekundarni ali terciarni. Primarni → aldehid, sekundarni → keton, terciarni → ne reagira.",
          given: null,
          sol: [`${alc[0].toUpperCase() + alc.slice(1)}: ${ok.startsWith("ne") ? "terciarni alkohol – atom C z OH nima vodika." : ok.endsWith("al") ? "primarni alkohol → aldehid." : "sekundarni alkohol → keton."}`, `Produkt: ${ok}.`],
        });
      }
      if (k < 0.65) {
        const [halo, cond, ok, type, wrong] = r.pick(HALO);
        return concept(r, {
          q: `Kaj nastane, ko ${halo} reagira ${cond}?`,
          ok,
          wrong,
          hint: "Vodna raztopina hidroksida → substitucija (halogen zamenja OH). Močna baza v etanolu pri segrevanju → eliminacija (nastane alken).",
          given: null,
          sol: [type === "S" ? "V vodni raztopini poteče nukleofilna substitucija: halogen zamenja skupina OH." : "V etanolni raztopini KOH pri segrevanju poteče eliminacija HX – nastane dvojna vez.", `Produkt: ${ok}.`],
        });
      }
      const m = r.int(10, 500);
      const mE = (m / 180.16) * 2 * 46.07;
      return mk(
        r.pick([`Pri alkoholnem vrenju glukoze poteče reakcija $\\mathrm{C_6H_{12}O_6 \\rightarrow 2C_2H_5OH + 2CO_2}$. Koliko gramov etanola nastane iz $${m}\\ \\mathrm{g}$ glukoze? $M(\\mathrm{C_6H_{12}O_6}) = 180{,}16\\ \\mathrm{g/mol}$, $M(\\mathrm{C_2H_5OH}) = 46{,}07\\ \\mathrm{g/mol}$. ${zaokr(1)}`, `${name} ${g(name, "pripravlja", "pripravlja")} domači jabolčnik. Sok vsebuje $${m}\\ \\mathrm{g}$ glukoze, ki popolnoma prevre: $\\mathrm{C_6H_{12}O_6 \\rightarrow 2C_2H_5OH + 2CO_2}$. Koliko gramov etanola nastane? $M(\\mathrm{C_6H_{12}O_6}) = 180{,}16\\ \\mathrm{g/mol}$, $M(\\mathrm{C_2H_5OH}) = 46{,}07\\ \\mathrm{g/mol}$. ${zaokr(1)}`]),
        num(mE, "g", 1, [[mE / 2, "Iz 1 mol glukoze nastaneta 2 mol etanola."], [(m / 180.16) * 2, "To je množina etanola; pomnoži še z molsko maso."], [m / 2, "Mase se ne delijo po koeficientih; računaj z množino."]]),
        "Maso glukoze pretvori v množino, z razmerjem iz enačbe izračunaj množino etanola in jo pretvori v maso.",
        [dat("m(\\mathrm{C_6H_{12}O_6})", m, "g"), dat("M(\\mathrm{C_6H_{12}O_6})", "180{,}16", "g/mol"), dat("M(\\mathrm{C_2H_5OH})", "46{,}07", "g/mol")], ["m(\\mathrm{C_2H_5OH})"], ["n = \\dfrac{m}{M}", "n(\\mathrm{C_2H_5OH}) = 2\\,n(\\mathrm{C_6H_{12}O_6})", "m = n \\cdot M"],
        [`$n(\\text{glukoza}) = \\dfrac{${m}}{180{,}16} \\approx ${qty(tx(m / 180.16, 4), "mol")}$`, `$n(\\text{etanol}) = 2 \\cdot ${tx(m / 180.16, 4)} = ${qty(tx((2 * m) / 180.16, 4), "mol")}$`, `$m = ${tx((2 * m) / 180.16, 4)} \\cdot 46{,}07\\ \\mathrm{g} ${res(mE, 1, "g")}$`]
      );
    }
    const k = r.int(0, 2);
    if (k === 0) {
      const V = r.int(50, 900);
      const nH2 = V / 1000 / VM;
      const m = 2 * nH2 * 46.07;
      return mk(
        `Natrij reagira z etanolom: $\\mathrm{2C_2H_5OH + 2Na \\rightarrow 2C_2H_5ONa + H_2}$. Koliko gramov etanola zreagira, če nastane $${V}\\ \\mathrm{mL}$ vodika (normalni pogoji)? $M(\\mathrm{C_2H_5OH}) = 46{,}07\\ \\mathrm{g/mol}$, ${VM_TXT}. ${zaokr(2)}`,
        num(m, "g", 2, [[m / 2, "Iz 2 mol etanola nastane 1 mol H₂ – etanola je dvakrat več."], [m * 1000, "Prostornino v mL pretvori v L."], [2 * nH2, "To je množina etanola; pomnoži še z M."]]),
        "Prostornino vodika pretvori v množino; iz enačbe sledi, da je etanola dvakrat več.",
        [dat("V(\\mathrm{H_2})", V, "mL"), dat("M(\\mathrm{C_2H_5OH})", "46{,}07", "g/mol"), VM_DAT], ["m(\\mathrm{C_2H_5OH})"], ["n = \\dfrac{V}{V_m}", "n(\\mathrm{C_2H_5OH}) = 2\\,n(\\mathrm{H_2})", "m = n \\cdot M"],
        [`$n(\\mathrm{H_2}) = \\dfrac{${tx(V / 1000)}\\ \\mathrm{L}}{22{,}4\\ \\mathrm{L/mol}} \\approx ${qty(tx(nH2, 5), "mol")}$`, `$n(\\text{etanol}) = 2 \\cdot ${tx(nH2, 5)} = ${qty(tx(2 * nH2, 5), "mol")}$`, `$m = ${tx(2 * nH2, 5)} \\cdot 46{,}07\\ \\mathrm{g} ${res(m, 2, "g")}$`]
      );
    }
    if (k === 1) {
      const [alc, Ma, prod, Mp, eqT] = r.pick([["etanola", 46.07, "bromoetana", 108.97, "C_2H_5OH + HBr \\rightarrow C_2H_5Br + H_2O"], ["propan-1-ola", 60.1, "1-bromopropana", 122.99, "C_3H_7OH + HBr \\rightarrow C_3H_7Br + H_2O"], ["metanola", 32.04, "klorometana", 50.49, "CH_3OH + HCl \\rightarrow CH_3Cl + H_2O"], ["butan-1-ola", 74.12, "1-klorobutana", 92.57, "C_4H_9OH + HCl \\rightarrow C_4H_9Cl + H_2O"]]);
      const m1 = r.dec(5, 50, 1);
      const mth = (m1 / Ma) * Mp;
      const m2 = roundHalfUp(mth * r.dec(0.5, 0.92, 2), 1);
      const y = (m2 / mth) * 100;
      return mk(
        `Iz $${tx(m1)}\\ \\mathrm{g}$ ${alc} ${name} ${g(name, "pripravi", "pripravi")} $${tx(m2)}\\ \\mathrm{g}$ ${prod} po reakciji $\\mathrm{${eqT}}$. Kolikšen je izkoristek reakcije v %? $M(\\text{alkohol}) = ${Mtx(Ma)}\\ \\mathrm{g/mol}$, $M(\\text{produkt}) = ${Mtx(Mp)}\\ \\mathrm{g/mol}$. ${zaokr(1)}`,
        num(y, "%", 1, [[(m2 / m1) * 100, "Ne primerjaj mas reaktanta in produkta; izračunaj teoretično maso produkta."], [mth, "To je teoretična masa produkta; izračunaj še izkoristek."]]),
        "Izračunaj teoretično maso produkta (razmerje 1 : 1), nato izkoristek = dejanska / teoretična masa.",
        [dat("m(\\text{alkohol})", tx(m1), "g"), dat("m(\\text{produkt})", tx(m2), "g"), dat("M(\\text{alkohol})", Mtx(Ma), "g/mol"), dat("M(\\text{produkt})", Mtx(Mp), "g/mol")], ["\\eta"], ["n(\\text{produkt}) = n(\\text{alkohol})", "\\eta = \\dfrac{m_\\text{dejanska}}{m_\\text{teoretična}} \\cdot 100\\ \\%"],
        [`$n = \\dfrac{${tx(m1)}}{${Mtx(Ma)}} \\approx ${qty(tx(m1 / Ma, 4), "mol")}$`, `$m_\\text{teor} = ${tx(m1 / Ma, 4)} \\cdot ${Mtx(Mp)} \\approx ${qty(tx(mth, 2), "g")}$`, `$\\eta = \\dfrac{${tx(m2)}}{${tx(mth, 2)}} \\cdot 100\\ \\% ${res(y, 1, "\\%")}$`]
      );
    }
    const [alc, F, x, M] = r.pick([["etanola", "C2H5OH", 2, 46.07], ["metanola", "CH3OH", 1, 32.04], ["propan-1-ola", "C3H7OH", 3, 60.1], ["butan-1-ola", "C4H9OH", 4, 74.12]]);
    const m = r.dec(2, 100, 1);
    const V = (m / M) * x * VM;
    return mk(
      `${name} ${g(name, "sežge", "sežge")} $${tx(m)}\\ \\mathrm{g}$ ${alc} ($${sp(F)}$). Koliko litrov $\\mathrm{CO_2}$ nastane pri normalnih pogojih? $M(${sp(F)}) = ${Mtx(M)}\\ \\mathrm{g/mol}$, ${VM_TXT}. ${zaokr(2)}`,
      num(V, "L", 2, [[(m / M) * VM, `Iz 1 mol ${spU(F)} nastane ${x} mol CO₂.`], [m * x * VM, "Najprej maso pretvori v množino."]], { unitAlternatives: ["l", "dm3", "dm³"] }),
      "Zapiši enačbo gorenja alkohola; vsak atom C da eno molekulo $\\mathrm{CO_2}$.",
      [dat("m", tx(m), "g"), dat(`M(${sp(F)})`, Mtx(M), "g/mol"), VM_DAT], ["V(\\mathrm{CO_2})"], ["n = \\dfrac{m}{M}", `n(\\mathrm{CO_2}) = ${x}\\,n(\\text{alkohol})`, "V = n \\cdot V_m"],
      [`$n = \\dfrac{${tx(m)}}{${Mtx(M)}} \\approx ${qty(tx(m / M, 4), "mol")}$`, `$n(\\mathrm{CO_2}) = ${x} \\cdot ${tx(m / M, 4)} \\approx ${qty(tx((m / M) * x, 4), "mol")}$`, `$V = ${tx((m / M) * x, 4)} \\cdot 22{,}4\\ \\mathrm{L} ${res(V, 2, "L")}$`]
    );
  },
};

// ---------- karbonilne spojine ----------
const CARB_NAMES = [
  ["CH3-CHO", "etanal", [["etanon", "Ketoni imajo vsaj 3 atome C; CHO na koncu verige je aldehidna skupina."], ["etanol", "Končnica -ol je za alkohole; tu je skupina CHO."], ["metanal", "Preštej vse atome C, tudi C v skupini CHO."]]],
  ["HCHO", "metanal", [["metanol", "Končnica -ol je za alkohole."], ["etanal", "Molekula ima le en atom C."], ["metanojska kislina", "Kislina ima skupino COOH."]]],
  ["CH3-CH2-CHO", "propanal", [["propanon", "Skupina CHO je na koncu verige – aldehid, ne keton."], ["propan-1-ol", "Končnica -ol je za alkohole."], ["butanal", "C v skupini CHO štejemo v verigo: 3 atomi C."]]],
  ["CH3-CO-CH3", "propanon", [["propanal", "Karbonilna skupina je na sredini verige – keton."], ["propan-2-ol", "Končnica -ol je za alkohole."], ["propanojska kislina", "Kislina ima skupino COOH."]]],
  ["CH3-CH2-CH2-CHO", "butanal", [["butanon", "Skupina CHO je na koncu verige – aldehid."], ["butan-1-ol", "Končnica -ol je za alkohole."], ["propanal", "C v skupini CHO štejemo v verigo: 4 atomi C."]]],
  ["CH3-CO-CH2-CH3", "butanon", [["butanal", "C=O je na sredini verige – keton."], ["butan-2-ol", "Končnica -ol je za alkohole."], ["propanon", "Preštej vse atome C: 4."]]],
  ["CH3-CO-CH2-CH2-CH3", "pentan-2-on", [["pentan-4-on", "Številčimo tako, da ima karbonilna skupina najmanjši lokant."], ["pentanal", "C=O ni na koncu verige – keton."], ["pentan-3-on", "Preštej, na katerem atomu C je skupina C=O."]]],
  ["CH3-CH2-CO-CH2-CH3", "pentan-3-on", [["pentan-2-on", "Preštej, na katerem atomu C je skupina C=O."], ["pentanal", "C=O ni na koncu verige – keton."], ["pentan-3-ol", "Končnica -ol je za alkohole."]]],
  ["(CH3)2CH-CHO", "2-metilpropanal", [["2-metilpropanon", "Skupina CHO je na koncu verige – aldehid."], ["butanal", "Spojina je razvejana."], ["3-metilpropanal", "C v skupini CHO je C1; metilna skupina je na C2."]]],
  ["CH3-CO-CH(CH3)-CH3", "3-metilbutan-2-on", [["2-metilbutan-3-on", "Karbonilna skupina dobi najmanjši lokant."], ["3-metilbutanal", "C=O ni na koncu verige – keton."], ["pentan-2-on", "Spojina je razvejana – glavna veriga ima 4 C."]]],
];
const TOLLENS_YES = ["etanal", "propanal", "butanal", "metanal", "benzaldehid", "glukoza"];
const TOLLENS_NO = [["propanon", "Ketoni se s Tollensovim reagentom ne oksidirajo."], ["butanon", "Ketoni se s Tollensovim reagentom ne oksidirajo."], ["etanol", "Alkohol ne da srebrnega zrcala."], ["etanojska kislina", "Karboksilna kislina se ne oksidira naprej."], ["pentan-3-on", "Ketoni se s Tollensovim reagentom ne oksidirajo."], ["propan-2-ol", "Alkohol ne da srebrnega zrcala."]];
const REDUCT = [
  ["etanal", "etanol", [["etanojska kislina", "Kislina je produkt oksidacije, ne redukcije."], ["etan", "C=O se reducira v C–OH, ne v CH₂."]]],
  ["propanal", "propan-1-ol", [["propan-2-ol", "Pri aldehidu je C=O na koncu verige → nastane primarni alkohol."], ["propanojska kislina", "Kislina je produkt oksidacije, ne redukcije."], ["propan", "C=O se reducira v C–OH, ne v CH₂."]]],
  ["propanon", "propan-2-ol", [["propan-1-ol", "Pri ketonu je C=O na sredini → nastane sekundarni alkohol."], ["propanal", "Pri redukciji se C=O pretvori v C–OH."], ["propan", "C=O se reducira v C–OH, ne v CH₂."]]],
  ["butanal", "butan-1-ol", [["butan-2-ol", "Pri aldehidu je C=O na koncu verige → primarni alkohol."], ["butanojska kislina", "Kislina je produkt oksidacije."], ["butanon", "Redukcija aldehida ne da ketona."]]],
  ["butanon", "butan-2-ol", [["butan-1-ol", "Pri ketonu je C=O na C2 → nastane butan-2-ol."], ["butanal", "Pri redukciji se C=O pretvori v C–OH."], ["butanojska kislina", "Kislina je produkt oksidacije."]]],
  ["pentan-3-on", "pentan-3-ol", [["pentan-1-ol", "OH nastane na istem atomu C, kjer je bila C=O (C3)."], ["pentanal", "Pri redukciji se C=O pretvori v C–OH."], ["pentan", "C=O se reducira v C–OH, ne v CH₂."]]],
];
const ALDS = [["etanala", "CH3CHO", 44.05, 2], ["propanala", "C2H5CHO", 58.08, 3], ["butanala", "C3H7CHO", 72.11, 4], ["pentanala", "C4H9CHO", 86.13, 5]];

const genKarbonil = {
  id: "dod-kem-ss-karbonilne-spojine",
  topics: ["KEM-SS-3/karbonilne-spojine"],
  gen(level, r) {
    const name = nm(r);
    if (level === 1) {
      const [S, ok, wrong] = r.pick(CARB_NAMES);
      return concept(r, {
        q: r.pick([`Kako se imenuje spojina $${org(S)}$?`, `${name} ${g(name, "je dobil", "je dobila")} spojino $${org(S)}$. Katero ime je pravilno?`]),
        ok,
        wrong,
        hint: "Skupina CHO na koncu verige → aldehid (končnica -al). Skupina C=O sredi verige → keton (končnica -on z lokantom). Atom C karbonilne skupine je del verige.",
        given: null,
        sol: [S.includes("CHO") ? "Skupina CHO je na koncu verige – aldehid, končnica -al." : "Karbonilna skupina je sredi verige – keton, končnica -on.", `Ime: ${ok}.`],
      });
    }
    if (level === 2) {
      const k = r.next();
      if (k < 0.35) {
        const yes = r.pick(TOLLENS_YES);
        const no = r.shuffle(TOLLENS_NO).slice(0, 3);
        return concept(r, {
          q: `Katera od snovi ${r.shuffle([yes, ...no.map((x) => x[0])]).join(", ")} da pozitiven Tollensov preizkus (srebrno zrcalo)?`,
          ok: yes,
          wrong: no,
          hint: "Tollensov reagent oksidira skupino CHO (aldehide), pri tem se izloči srebro.",
          given: null,
          sol: [`${yes} ima skupino CHO, ki se oksidira; ioni Ag⁺ se reducirajo v srebro.`, "Ketoni, alkoholi in kisline preizkusa ne dajo."],
        });
      }
      if (k < 0.65) {
        const [c, ok, wrong] = r.pick(REDUCT);
        return concept(r, {
          q: `Kaj nastane pri redukciji (adiciji vodika na karbonilno skupino) spojine ${c}?`,
          ok,
          wrong,
          hint: "Pri redukciji se C=O pretvori v C–OH: iz aldehida nastane primarni, iz ketona sekundarni alkohol.",
          given: null,
          sol: [`${c}: ${c.endsWith("al") ? "aldehid → primarni alkohol" : "keton → sekundarni alkohol"}.`, `Produkt: ${ok}.`],
        });
      }
      const ket = r.next() < 0.5;
      const n = r.int(ket ? 3 : 2, 8);
      const M = 14 * n + 16;
      return mk(
        `Nasičen ${ket ? "keton" : "aldehid"} ($\\mathrm{C}_n\\mathrm{H}_{2n}\\mathrm{O}$) ima molsko maso $${M}\\ \\mathrm{g/mol}$. Koliko atomov ogljika ima molekula? Uporabi $A_r(\\mathrm{C}) = 12$, $A_r(\\mathrm{H}) = 1$, $A_r(\\mathrm{O}) = 16$.`,
        num(n, null, null, [[roundHalfUp((M - 16) / 12, 0), "Pozabil si na atome vodika: M = 12n + 2n + 16."], [roundHalfUp(M / 14, 0), "Odštej najprej maso atoma kisika (16)."]]),
        "Zapiši molsko maso s splošno formulo: $M = 12n + 2n \\cdot 1 + 16$ in reši enačbo.",
        [dat("M", M, "g/mol"), "A_r(\\mathrm{C}) = 12", "A_r(\\mathrm{H}) = 1", "A_r(\\mathrm{O}) = 16"], ["n(\\mathrm{C})"], ["M = 12n + 2n + 16 = 14n + 16"],
        [`$14n + 16 = ${M}$`, `$n = \\dfrac{${M} - 16}{14} = ${n}$ (formula $\\mathrm{C_{${n}}H_{${2 * n}}O}$)`]
      );
    }
    const k = r.int(0, 2);
    const [ald, F, M] = r.pick(ALDS);
    if (k === 0) {
      const m = r.dec(0.5, 5, 2);
      const mAg = (m / M) * 2 * 107.87;
      return mk(
        `${name} ${g(name, "izvede", "izvede")} Tollensov preizkus s $${tx(m)}\\ \\mathrm{g}$ ${ald}: $\\mathrm{RCHO + 2Ag^+ + \\ldots \\rightarrow RCOO^- + 2Ag + \\ldots}$. Koliko gramov srebra se izloči? $M(${sp(F)}) = ${Mtx(M)}\\ \\mathrm{g/mol}$, $M(\\mathrm{Ag}) = 107{,}87\\ \\mathrm{g/mol}$. ${zaokr(2)}`,
        num(mAg, "g", 2, [[mAg / 2, "Na 1 mol aldehida se izločita 2 mol srebra."], [(m / M) * 2, "To je množina srebra; pomnoži še z M(Ag)."]]),
        "Maso aldehida pretvori v množino; srebra nastane dvakrat več (molsko).",
        [dat("m", tx(m), "g"), dat(`M(${sp(F)})`, Mtx(M), "g/mol"), dat("M(\\mathrm{Ag})", "107{,}87", "g/mol")], ["m(\\mathrm{Ag})"], ["n(\\mathrm{Ag}) = 2\\,n(\\text{aldehid})", "m = n \\cdot M"],
        [`$n(\\text{aldehid}) = \\dfrac{${tx(m)}}{${Mtx(M)}} \\approx ${qty(tx(m / M, 5), "mol")}$`, `$n(\\mathrm{Ag}) = 2 \\cdot ${tx(m / M, 5)} \\approx ${qty(tx((2 * m) / M, 5), "mol")}$`, `$m(\\mathrm{Ag}) = ${tx((2 * m) / M, 5)} \\cdot 107{,}87\\ \\mathrm{g} ${res(mAg, 2, "g")}$`]
      );
    }
    if (k === 1) {
      const m = r.dec(0.5, 3, 2);
      const mAg = roundHalfUp((m / M) * 2 * 107.87, 2);
      const Mx = (2 * 107.87 * m) / mAg;
      return mk(
        `$${tx(m)}\\ \\mathrm{g}$ neznanega nasičenega aldehida (ne metanala) da pri Tollensovem preizkusu $${tx(mAg, 2)}\\ \\mathrm{g}$ srebra ($\\mathrm{RCHO \\rightarrow 2Ag}$). Izračunaj molsko maso aldehida. $M(\\mathrm{Ag}) = 107{,}87\\ \\mathrm{g/mol}$. ${zaokr(1)}`,
        num(Mx, "g/mol", 1, [[Mx / 2, "Na 1 mol aldehida nastaneta 2 mol srebra; aldehida je pol manj."], [(107.87 * mAg) / m, "Preveri, kaj deliš: M = m(aldehid) / n(aldehid)."]], U_GMOL),
        "Iz mase srebra izračunaj množino srebra, iz nje množino aldehida in nato $M = m/n$.",
        [dat("m(\\text{aldehid})", tx(m), "g"), dat("m(\\mathrm{Ag})", tx(mAg, 2), "g"), dat("M(\\mathrm{Ag})", "107{,}87", "g/mol")], ["M(\\text{aldehid})"], ["n(\\text{aldehid}) = \\dfrac{1}{2}\\,n(\\mathrm{Ag})", "M = \\dfrac{m}{n}"],
        [`$n(\\mathrm{Ag}) = \\dfrac{${tx(mAg, 2)}}{107{,}87} \\approx ${qty(tx(mAg / 107.87, 5), "mol")}$`, `$n(\\text{aldehid}) = ${qty(tx(mAg / 107.87 / 2, 5), "mol")}$`, `$M = \\dfrac{${tx(m)}}{${tx(mAg / 107.87 / 2, 5)}} ${res(Mx, 1, "g/mol")}$ (to je ${ald.replace(/a$/, "")}, $${sp(F)}$)`]
      );
    }
    const m = r.dec(0.5, 5, 2);
    const mCu = (m / M) * 143.09;
    return mk(
      `Pri Fehlingovem preizkusu ${ald} nastane rdeča oborina $\\mathrm{Cu_2O}$: $\\mathrm{RCHO + 2Cu^{2+} + \\ldots \\rightarrow RCOO^- + Cu_2O + \\ldots}$. Koliko gramov $\\mathrm{Cu_2O}$ nastane iz $${tx(m)}\\ \\mathrm{g}$ aldehida? $M(${sp(F)}) = ${Mtx(M)}\\ \\mathrm{g/mol}$, $M(\\mathrm{Cu_2O}) = 143{,}09\\ \\mathrm{g/mol}$. ${zaokr(2)}`,
      num(mCu, "g", 2, [[mCu * 2, "Na 1 mol aldehida nastane 1 mol Cu₂O (v njem sta 2 atoma Cu)."], [(m / M) * 63.55 * 2, "Iščemo maso Cu₂O, ne bakra."]]),
      "Množina $\\mathrm{Cu_2O}$ je enaka množini aldehida (razmerje 1 : 1).",
      [dat("m", tx(m), "g"), dat(`M(${sp(F)})`, Mtx(M), "g/mol"), dat("M(\\mathrm{Cu_2O})", "143{,}09", "g/mol")], ["m(\\mathrm{Cu_2O})"], ["n(\\mathrm{Cu_2O}) = n(\\text{aldehid})", "m = n \\cdot M"],
      [`$n = \\dfrac{${tx(m)}}{${Mtx(M)}} \\approx ${qty(tx(m / M, 5), "mol")}$`, `$m(\\mathrm{Cu_2O}) = ${tx(m / M, 5)} \\cdot 143{,}09\\ \\mathrm{g} ${res(mCu, 2, "g")}$`]
    );
  },
};

// ---------- karboksilne kisline in derivati ----------
const ALKYL = ["", "metil", "etil", "propil", "butil", "pentil"];
const OAT = ["", "metanoat", "etanoat", "propanoat", "butanoat", "pentanoat"];
const ALKOXY = ["", "metoksi", "etoksi", "propoksi", "butoksi"];
const ALKANE = ["", "metan", "etan", "propan", "butan"];
const ACID_N = ["", "metanojske kisline", "etanojske kisline", "propanojske kisline", "butanojske kisline"];
const ACID_ACC = ["", "metanojsko kislino", "etanojsko kislino", "propanojsko kislino", "butanojsko kislino"];
const ACID_NOM = ["", "metanojska kislina", "etanojska kislina", "propanojska kislina", "butanojska kislina"];
const ALC_GEN = ["", "metanola", "etanola", "propan-1-ola", "butan-1-ola"];
const ALC_NOM = ["", "metanol", "etanol", "propan-1-ol", "butan-1-ol"];
const M_ACID = [0, 46.03, 60.05, 74.08, 88.11];
const M_ALC = [0, 32.04, 46.07, 60.1, 74.12];
const ACID_F = ["", "HCOOH", "CH3COOH", "C2H5COOH", "C3H7COOH"];

const genKarboksilne = {
  id: "dod-kem-ss-karboksilne-kisline-in-derivati",
  topics: ["KEM-SS-3/karboksilne-kisline-in-derivati"],
  gen(level, r) {
    const name = nm(r);
    const a = r.int(1, 4), b = r.int(1, 4);
    if (level === 1) {
      const ok = `${ALKYL[b]} ${OAT[a]}`;
      const wrong = [];
      if (a !== b) wrong.push([`${ALKYL[a]} ${OAT[b]}`, "Prvi del imena (alkil) izhaja iz alkohola, drugi (-oat) iz kisline."]);
      else wrong.push([`${ALKYL[b]} ${OAT[a + 1]}`, "Kislina ima toliko atomov C, kot jih je v njenem imenu – vključno z atomom C v skupini COOH."]);
      wrong.push([`${ALKOXY[b]}${ALKANE[a]}`, "Eter nastane iz dveh alkoholov; iz kisline in alkohola nastane ester."]);
      wrong.push([`${ALKYL[b]} ${ALKANE[a]}al`, "Pri estrenju ne nastane aldehid; nastane ester z vezjo –COO–."]);
      return concept(r, {
        q: r.pick([`Kako se imenuje ester, ki nastane iz ${ACID_N[a]} in ${ALC_GEN[b]}?`, `${name} ${g(name, "segreva", "segreva")} ${ACID_ACC[a]} ${/^[cčfhkpsšt]/.test(ALC_NOM[b]) ? "s" : "z"} ${ALC_NOM[b]}om ob dodatku žveplove(VI) kisline. Kako se imenuje nastali ester?`]),
        ok,
        wrong,
        hint: "Ime estra: najprej alkil iz alkohola (metil, etil …), nato anion kisline s končnico -oat.",
        given: null,
        sol: [`Kislina + alkohol → ester + voda.`, `Alkohol ${ALC_NOM[b]} da »${ALKYL[b]}«, ${ACID_NOM[a]} da »${OAT[a]}« → ${ok}.`],
      });
    }
    if (level === 2) {
      const k = r.next();
      if (k < 0.35) {
        const m = r.dec(1, 20, 1);
        const mNa = (m / M_ACID[a]) * 40.0;
        return mk(
          r.pick([`Koliko gramov NaOH potrebujemo za nevtralizacijo $${tx(m)}\\ \\mathrm{g}$ ${ACID_N[a]} ($${sp(ACID_F[a])}$)? $M(${sp(ACID_F[a])}) = ${Mtx(M_ACID[a])}\\ \\mathrm{g/mol}$, $M(\\mathrm{NaOH}) = 40{,}00\\ \\mathrm{g/mol}$. ${zaokr(2)}`, `${name} ${g(name, "nevtralizira", "nevtralizira")} $${tx(m)}\\ \\mathrm{g}$ ${ACID_N[a]} z natrijevim hidroksidom. Koliko gramov NaOH porabi? $M(${sp(ACID_F[a])}) = ${Mtx(M_ACID[a])}\\ \\mathrm{g/mol}$, $M(\\mathrm{NaOH}) = 40{,}00\\ \\mathrm{g/mol}$. ${zaokr(2)}`]),
          num(mNa, "g", 2, [[m, "Mase reaktantov niso enake; enake so množine (1 : 1)."], [m / M_ACID[a], "To je množina NaOH; pomnoži še z M(NaOH)."], [2 * mNa, "Monokarboksilna kislina odda en proton: razmerje 1 : 1."]]),
          "Karboksilna kislina z eno skupino COOH reagira z NaOH v razmerju 1 : 1.",
          [dat("m", tx(m), "g"), dat(`M(${sp(ACID_F[a])})`, Mtx(M_ACID[a]), "g/mol"), dat("M(\\mathrm{NaOH})", "40{,}00", "g/mol")], ["m(\\mathrm{NaOH})"], ["\\mathrm{RCOOH + NaOH \\rightarrow RCOONa + H_2O}", "n(\\mathrm{NaOH}) = n(\\mathrm{RCOOH})"],
          [`$n = \\dfrac{${tx(m)}}{${Mtx(M_ACID[a])}} \\approx ${qty(tx(m / M_ACID[a], 4), "mol")}$`, `$m(\\mathrm{NaOH}) = ${tx(m / M_ACID[a], 4)} \\cdot 40{,}00\\ \\mathrm{g} ${res(mNa, 2, "g")}$`]
        );
      }
      if (k < 0.7) {
        const Me = roundHalfUp(M_ACID[a] + M_ALC[b] - 18.02, 2);
        const m = r.dec(2, 30, 1);
        const mE = (m / M_ACID[a]) * Me;
        return mk(
          `Iz $${tx(m)}\\ \\mathrm{g}$ ${ACID_N[a]} in prebitka ${ALC_GEN[b]} nastane ester ${ALKYL[b]} ${OAT[a]}. Koliko gramov estra nastane, če kislina popolnoma zreagira? $M(\\text{kislina}) = ${Mtx(M_ACID[a])}\\ \\mathrm{g/mol}$, $M(\\text{ester}) = ${Mtx(Me)}\\ \\mathrm{g/mol}$. ${zaokr(1)}`,
          num(mE, "g", 1, [[m, "Masa se ne ohrani v razmerju 1 : 1; računaj z množino."], [(m / M_ACID[a]) * (Me + 18.02), "Pri estrenju se odcepi voda – uporabi dano molsko maso estra."]]),
          "Kislina in ester sta v razmerju 1 : 1 (množinsko). Maso kisline pretvori v množino in nato v maso estra.",
          [dat("m(\\text{kislina})", tx(m), "g"), dat("M(\\text{kislina})", Mtx(M_ACID[a]), "g/mol"), dat("M(\\text{ester})", Mtx(Me), "g/mol")], ["m(\\text{ester})"], ["\\mathrm{RCOOH + R'OH \\rightleftharpoons RCOOR' + H_2O}", "n(\\text{ester}) = n(\\text{kislina})"],
          [`$n = \\dfrac{${tx(m)}}{${Mtx(M_ACID[a])}} \\approx ${qty(tx(m / M_ACID[a], 4), "mol")}$`, `$m(\\text{ester}) = ${tx(m / M_ACID[a], 4)} \\cdot ${Mtx(Me)}\\ \\mathrm{g} ${res(mE, 1, "g")}$`]
        );
      }
      const amide = r.next() < 0.3;
      if (amide) {
        const ok = `${ACID_NOM[a]} in amoniak (amonijev ion)`;
        return concept(r, {
          q: `Kaj nastane pri kisli hidrolizi ${ALKANE[a]}amida?`,
          ok,
          wrong: [[`${ALKANE[a]}al in amoniak`, "Pri hidrolizi amida nastane karboksilna kislina, ne aldehid."], [`${ALC_NOM[a]} in dušik`, "Vez C–N se pretrga, nastane kislina in amoniak."], [`${ALKANE[a]}amin in voda`, "Pri hidrolizi se voda porabi, ne nastane."]],
          hint: "Hidroliza pretrga vez C–N v amidni skupini; dodata se H in OH iz vode.",
          given: null,
          sol: ["Amid + voda → karboksilna kislina + amoniak (v kislem kot NH₄⁺).", `Produkta: ${ok}.`],
        });
      }
      const ok = `${ACID_NOM[a]} in ${ALC_NOM[b]}`;
      const wrong = [[`${ALKANE[a]}al in ${ALC_NOM[b]}`, "Pri hidrolizi estra nastane kislina, ne aldehid."], [`${ACID_NOM[a]} in ${ALKANE[b]}`, "Iz alkilnega dela estra nastane alkohol, ne alkan."]];
      if (a !== b) wrong.unshift([`${ACID_NOM[b]} in ${ALC_NOM[a]}`, "Del »-oat« pove kislino, alkil na začetku imena pa alkohol."]);
      return concept(r, {
        q: `Kaj nastane pri hidrolizi estra ${ALKYL[b]} ${OAT[a]}?`,
        ok,
        wrong,
        hint: "Hidroliza je obratna reakcija estrenja: ester + voda → kislina + alkohol.",
        given: null,
        sol: [`»${OAT[a]}« izhaja iz ${ACID_N[a]}, »${ALKYL[b]}« iz ${ALC_GEN[b]}.`, `Produkta: ${ok}.`],
      });
    }
    if (r.next() < 0.55) {
      const na = r.pick([0.5, 1, 1.5, 2, 2.5, 3]), nb = r.pick([0.5, 1, 1.5, 2, 2.5, 3]);
      const s = na + nb;
      const x = (4 * s - Math.sqrt(16 * s * s - 48 * na * nb)) / 6;
      return mk(
        `${name} ${g(name, "zmeša", "zmeša")} $${tx(na)}\\ \\mathrm{mol}$ ${ACID_N[a]} in $${tx(nb)}\\ \\mathrm{mol}$ ${ALC_GEN[b]} ter doda katalizator. Konstanta ravnotežja estrenja je $K_c = 4$. Koliko molov estra je v ravnotežju? ${zaokr(2)}`,
        num(x, "mol", 2, [[Math.min(na, nb), "Estrenje je ravnotežna reakcija – ne poteče do konca."], [(4 * s + Math.sqrt(16 * s * s - 48 * na * nb)) / 6, "Izberi rešitev kvadratne enačbe, ki je manjša od začetnih množin."], [Math.sqrt(4 * na * nb) / 3, "Upoštevaj, da se množini kisline in alkohola zmanjšata za x."]]),
        "Naj nastane $x$ mol estra (in $x$ mol vode). Prostornina se v izrazu za $K_c$ okrajša. Reši kvadratno enačbo.",
        [dat("n_0(\\text{kislina})", tx(na), "mol"), dat("n_0(\\text{alkohol})", tx(nb), "mol"), "K_c = 4"], ["n(\\text{ester})"], [`K_c = \\dfrac{x \\cdot x}{(${tx(na)} - x)(${tx(nb)} - x)}`],
        [`$4 = \\dfrac{x^2}{(${tx(na)} - x)(${tx(nb)} - x)}$ → $3x^2 - ${tx(4 * s)}x + ${tx(4 * na * nb)} = 0$`, `$x = \\dfrac{${tx(4 * s)} - \\sqrt{${tx(16 * s * s)} - ${tx(48 * na * nb)}}}{6}$ (druga rešitev je večja od začetnih množin)`, `$x ${res(x, 2, "mol")}$`]
      );
    }
    const Me = roundHalfUp(M_ACID[a] + M_ALC[b] - 18.02, 2);
    const m1 = r.dec(5, 40, 1);
    const mth = (m1 / M_ACID[a]) * Me;
    const m2 = roundHalfUp(mth * r.dec(0.45, 0.85, 2), 1);
    const y = (m2 / mth) * 100;
    return mk(
      `Pri estrenju $${tx(m1)}\\ \\mathrm{g}$ ${ACID_N[a]} s prebitkom ${ALC_GEN[b]} ${name} ${g(name, "dobi", "dobi")} $${tx(m2)}\\ \\mathrm{g}$ estra ${ALKYL[b]} ${OAT[a]}a. Kolikšen je izkoristek v %? $M(\\text{kislina}) = ${Mtx(M_ACID[a])}\\ \\mathrm{g/mol}$, $M(\\text{ester}) = ${Mtx(Me)}\\ \\mathrm{g/mol}$. ${zaokr(1)}`,
      num(y, "%", 1, [[(m2 / m1) * 100, "Ne primerjaj mas kisline in estra; izračunaj teoretično maso estra."], [mth, "To je teoretična masa estra; izračunaj še izkoristek."]]),
      "Izračunaj teoretično maso estra (razmerje kislina : ester = 1 : 1), nato izkoristek.",
      [dat("m(\\text{kislina})", tx(m1), "g"), dat("m(\\text{ester})", tx(m2), "g"), dat("M(\\text{kislina})", Mtx(M_ACID[a]), "g/mol"), dat("M(\\text{ester})", Mtx(Me), "g/mol")], ["\\eta"], ["n(\\text{ester}) = n(\\text{kislina})", "\\eta = \\dfrac{m_\\text{dejanska}}{m_\\text{teoretična}} \\cdot 100\\ \\%"],
      [`$n = \\dfrac{${tx(m1)}}{${Mtx(M_ACID[a])}} \\approx ${qty(tx(m1 / M_ACID[a], 4), "mol")}$`, `$m_\\text{teor} = ${tx(m1 / M_ACID[a], 4)} \\cdot ${Mtx(Me)} \\approx ${qty(tx(mth, 2), "g")}$`, `$\\eta = \\dfrac{${tx(m2)}}{${tx(mth, 2)}} \\cdot 100\\ \\% ${res(y, 1, "\\%")}$`]
    );
  },
};

// ---------- organske reakcije ----------
const orgS = (s) => (s.includes("^") ? sp(s) : org(s));
// [reaktanti, produkti, pogoj (TeX), vrsta: A adicija, S substitucija, E eliminacija]
const RXTYPE = [
  [["CH4", "Cl2"], ["CH3Cl", "HCl"], "\\text{svetloba}", "S"], [["CH2=CH2", "Br2"], ["CH2Br-CH2Br"], "", "A"], [["CH3-CH2-OH"], ["CH2=CH2", "H2O"], "\\mathrm{H_2SO_4},\\ 170\\,^\\circ\\mathrm{C}", "E"],
  [["CH2=CH2", "H2O"], ["CH3-CH2-OH"], "\\mathrm{H^+}", "A"], [["CH3-CH2-Br", "OH^-"], ["CH3-CH2-OH", "Br^-"], "", "S"], [["CH3-CHBr-CH3", "KOH"], ["CH2=CH-CH3", "KBr", "H2O"], "\\text{etanol, segrevanje}", "E"],
  [["C6H6", "Br2"], ["C6H5Br", "HBr"], "\\mathrm{FeBr_3}", "S"], [["CH#CH", "2H2"], ["CH3-CH3"], "\\mathrm{Ni}", "A"], [["CH2=CH-CH3", "HCl"], ["CH3-CHCl-CH3"], "", "A"],
  [["C2H6", "Cl2"], ["C2H5Cl", "HCl"], "\\text{svetloba}", "S"], [["C6H6", "HNO3"], ["C6H5NO2", "H2O"], "\\mathrm{H_2SO_4}", "S"], [["CH3-CH2-CH2-OH"], ["CH3-CH=CH2", "H2O"], "\\mathrm{H_2SO_4},\\ \\text{segrevanje}", "E"],
];
const RX_T = { A: "adicija", S: "substitucija", E: "eliminacija" };
const RX_D = { A: "Pri adiciji se dve molekuli združita v eno, večkratna vez se porabi.", S: "Pri substituciji se atom ali skupina v molekuli zamenja z drugim.", E: "Pri eliminaciji se iz molekule odcepi manjša molekula in nastane večkratna vez." };
const RX_HERE = { A: "se reaktanta združita v en produkt", S: "se atom ali skupina zamenja z drugim", E: "se odcepi manjša molekula in nastane dvojna vez" };
const MARK = [
  ["propen", "\\mathrm{HBr}", "2-bromopropan", [["1-bromopropan", "Po Markovnikovem pravilu se H veže na atom C z več vodiki, Br pa na srednji C."], ["1,2-dibromopropan", "S HBr se adira le en atom Br."], ["2-bromopropen", "Pri adiciji dvojna vez izgine."]]],
  ["propen", "\\mathrm{HCl}", "2-kloropropan", [["1-kloropropan", "Po Markovnikovem pravilu se Cl veže na srednji atom C."], ["1,2-dikloropropan", "S HCl se adira le en atom Cl."], ["2-kloropropen", "Pri adiciji dvojna vez izgine."]]],
  ["propen", "\\mathrm{H_2O}\\ (\\mathrm{H^+})", "propan-2-ol", [["propan-1-ol", "Po Markovnikovem pravilu se OH veže na srednji atom C."], ["propanal", "Pri adiciji vode nastane alkohol, ne aldehid."], ["propan-1,2-diol", "Adira se ena molekula vode (H in OH)."]]],
  ["but-1-en", "\\mathrm{HBr}", "2-bromobutan", [["1-bromobutan", "Po Markovnikovem pravilu se Br veže na C2."], ["1,2-dibromobutan", "S HBr se adira le en atom Br."], ["2-bromobut-1-en", "Pri adiciji dvojna vez izgine."]]],
  ["2-metilpropen", "\\mathrm{HCl}", "2-kloro-2-metilpropan", [["1-kloro-2-metilpropan", "Po Markovnikovem pravilu se Cl veže na atom C z manj vodiki."], ["2-klorobutan", "Veriga se pri adiciji ne preuredi."], ["1,2-dikloro-2-metilpropan", "S HCl se adira le en atom Cl."]]],
  ["eten", "\\mathrm{HBr}", "bromoetan", [["1,2-dibromoetan", "S HBr se adira le en atom Br; dibromo-spojina nastane z Br₂."], ["bromoeten", "Pri adiciji dvojna vez izgine."], ["etanol", "Za alkohol bi morali adirati vodo."]]],
  ["propen", "\\mathrm{Br_2}", "1,2-dibromopropan", [["2-bromopropan", "Z Br₂ se adirata dva atoma Br."], ["1,3-dibromopropan", "Atoma Br se vežeta na atoma C, povezana z dvojno vezjo."], ["1,1-dibromopropan", "Na vsak atom C dvojne vezi se veže po en Br."]]],
  ["etin", "1\\ \\mathrm{mol\\ H_2}\\ (\\text{katalizator})", "eten", [["etan", "Z 1 mol H₂ se trojna vez spremeni le v dvojno; etan nastane z 2 mol H₂."], ["etanol", "Brez vode alkohol ne nastane."], ["propen", "Število atomov C se ne spremeni."]]],
  ["but-2-en", "\\mathrm{HCl}", "2-klorobutan", [["1-klorobutan", "Cl se veže na atom C, ki je bil del dvojne vezi (C2 ali C3)."], ["2,3-diklorobutan", "S HCl se adira le en atom Cl."], ["2-klorobut-2-en", "Pri adiciji dvojna vez izgine."]]],
];
const UNSAT = [["etena", "C2H4", 28.05, 1], ["propena", "C3H6", 42.08, 1], ["but-1-ena", "C4H8", 56.11, 1], ["cikloheksena", "C6H10", 82.14, 1], ["etina", "C2H2", 26.04, 2], ["propina", "C3H4", 40.06, 2], ["buta-1,3-diena", "C4H6", 54.09, 2]];
const FATTY = [["oleinske kisline", 282.46, 1], ["linolne kisline", 280.45, 2], ["linolenske kisline", 278.43, 3], ["arahidonske kisline", 304.47, 4]];

const genOrgReakcije = {
  id: "dod-kem-ss-organske-reakcije",
  topics: ["KEM-SS-3/organske-reakcije"],
  gen(level, r) {
    const name = nm(r);
    if (level === 1) {
      const [L, P, cond, t] = r.pick(RXTYPE);
      const eq = `${L.map(orgS).join(" + ")} \\xrightarrow{${cond || "\\quad"}} ${P.map(orgS).join(" + ")}`;
      return concept(r, {
        q: r.pick([`Katera vrsta reakcije je\n\n$$${eq}$$`, `${name} ${g(name, "je zapisal", "je zapisala")} reakcijo\n\n$$${eq}$$\n\nKako jo uvrstimo?`]),
        ok: RX_T[t],
        wrong: Object.keys(RX_T).filter((x) => x !== t).map((x) => [RX_T[x], `${RX_D[x]} Tu pa ${RX_HERE[t]}.`]),
        hint: "Primerjaj število reaktantov in produktov ter vezi: se večkratna vez porabi, nastane ali ostane?",
        given: null,
        sol: [`V reakciji ${RX_HERE[t]}.`, `To je ${RX_T[t]}.`],
      });
    }
    if (level === 2) {
      if (r.next() < 0.5) {
        const [alk, reag, ok, wrong] = r.pick(MARK);
        return concept(r, {
          q: `Kateri je glavni produkt adicije $${reag}$ na ${alk}?`,
          ok,
          wrong,
          hint: "Pri adiciji dvojna vez izgine. Pri adiciji HX ali vode velja Markovnikovo pravilo: H se veže na atom C, ki ima že več vodikov.",
          given: null,
          sol: ["Dvojna vez se odpre, na oba atoma C se veže po en del reagenta.", `Glavni produkt: ${ok}.`],
        });
      }
      const [ime, F, M, kk] = r.pick(UNSAT);
      const m = r.dec(0.5, 10, 1);
      const mBr = (m / M) * kk * 159.8;
      return mk(
        `Koliko gramov broma ($\\mathrm{Br_2}$) se lahko adira na $${tx(m)}\\ \\mathrm{g}$ ${ime} ($${sp(F)}$) do popolne nasičenosti? $M(${sp(F)}) = ${Mtx(M)}\\ \\mathrm{g/mol}$, $M(\\mathrm{Br_2}) = 159{,}80\\ \\mathrm{g/mol}$. ${zaokr(1)}`,
        num(mBr, "g", 1, [[kk === 1 ? 2 * mBr : mBr / 2, kk === 1 ? "Na eno dvojno vez se adira ena molekula Br₂." : "Trojna vez (ali dve dvojni) adira dve molekuli Br₂."], [(m / M) * kk * 79.9, "Brom je dvoatomna molekula: M(Br₂) = 159,80 g/mol."]]),
        "Ugotovi, koliko molekul $\\mathrm{Br_2}$ se adira na eno molekulo (ena na vsako dvojno vez, dve na trojno vez).",
        [dat("m", tx(m), "g"), dat(`M(${sp(F)})`, Mtx(M), "g/mol"), dat("M(\\mathrm{Br_2})", "159{,}80", "g/mol")], ["m(\\mathrm{Br_2})"], [`n(\\mathrm{Br_2}) = ${kk > 1 ? `${kk}\\,` : ""}n(${sp(F)})`, "m = n \\cdot M"],
        [`$n(${sp(F)}) = \\dfrac{${tx(m)}}{${Mtx(M)}} \\approx ${qty(tx(m / M, 4), "mol")}$`, `Na molekulo se adira${kk > 1 ? "ta" : ""} ${kk} molekul${kk > 1 ? "i" : "a"} $\\mathrm{Br_2}$: $n(\\mathrm{Br_2}) \\approx ${qty(tx((m / M) * kk, 4), "mol")}$`, `$m(\\mathrm{Br_2}) = ${tx((m / M) * kk, 4)} \\cdot 159{,}80\\ \\mathrm{g} ${res(mBr, 1, "g")}$`]
      );
    }
    if (r.next() < 0.5) {
      const [ime, M, kk] = r.pick(FATTY);
      const m = r.dec(1, 10, 2);
      const mBr = roundHalfUp((m / M) * kk * 159.8, 2);
      const kx = mBr / 159.8 / (m / M);
      return mk(
        `$${tx(m)}\\ \\mathrm{g}$ ${ime} ($M = ${Mtx(M)}\\ \\mathrm{g/mol}$) adira $${tx(mBr, 2)}\\ \\mathrm{g}$ broma. Koliko dvojnih vezi C=C ima molekula kisline? $M(\\mathrm{Br_2}) = 159{,}80\\ \\mathrm{g/mol}$.`,
        num(Math.round(kx), null, null, [[Math.round(2 * kx), "Na eno dvojno vez se adira ena molekula Br₂ (dva atoma Br)."], [Math.round(kx / 2), "Na eno dvojno vez se adira ena molekula Br₂."]]),
        "Izračunaj množino kisline in množino adiranega broma; njuno razmerje je število dvojnih vezi.",
        [dat("m(\\text{kislina})", tx(m), "g"), dat("M(\\text{kislina})", Mtx(M), "g/mol"), dat("m(\\mathrm{Br_2})", tx(mBr, 2), "g"), dat("M(\\mathrm{Br_2})", "159{,}80", "g/mol")], [T("število dvojnih vezi")], ["N(\\mathrm{C{=}C}) = \\dfrac{n(\\mathrm{Br_2})}{n(\\text{kislina})}"],
        [`$n(\\text{kislina}) = \\dfrac{${tx(m)}}{${Mtx(M)}} \\approx ${qty(tx(m / M, 5), "mol")}$`, `$n(\\mathrm{Br_2}) = \\dfrac{${tx(mBr, 2)}}{159{,}80} \\approx ${qty(tx(mBr / 159.8, 5), "mol")}$`, `Razmerje $\\approx ${tx(kx, 2)}$ → ${Math.round(kx)} dvojn${Math.round(kx) === 1 ? "a vez" : Math.round(kx) === 2 ? "i vezi" : "e vezi"}.`]
      );
    }
    const [ime, F, M, kk] = r.pick(UNSAT);
    const m = r.dec(1, 20, 1);
    const V = (m / M) * kk * VM;
    return mk(
      `${name} ${g(name, "hidrogenira", "hidrogenira")} $${tx(m)}\\ \\mathrm{g}$ ${ime} ($${sp(F)}$) do nasičenega ogljikovodika. Koliko litrov vodika (normalni pogoji) se porabi? $M(${sp(F)}) = ${Mtx(M)}\\ \\mathrm{g/mol}$, ${VM_TXT}. ${zaokr(2)}`,
      num(V, "L", 2, [[kk === 1 ? 2 * V : V / 2, kk === 1 ? "Na eno dvojno vez se adira ena molekula H₂." : "Trojna vez (ali dve dvojni) potrebuje dve molekuli H₂."], [m * kk * VM, "Najprej maso pretvori v množino."]], { unitAlternatives: ["l", "dm3", "dm³"] }),
      "Ugotovi, koliko molekul $\\mathrm{H_2}$ se adira na eno molekulo do nasičenja; nato izračunaj množino in prostornino.",
      [dat("m", tx(m), "g"), dat(`M(${sp(F)})`, Mtx(M), "g/mol"), VM_DAT], ["V(\\mathrm{H_2})"], [`n(\\mathrm{H_2}) = ${kk > 1 ? `${kk}\\,` : ""}n(${sp(F)})`, "V = n \\cdot V_m"],
      [`$n(${sp(F)}) = \\dfrac{${tx(m)}}{${Mtx(M)}} \\approx ${qty(tx(m / M, 4), "mol")}$`, `$n(\\mathrm{H_2}) = ${kk} \\cdot ${tx(m / M, 4)} \\approx ${qty(tx((m / M) * kk, 4), "mol")}$`, `$V = ${tx((m / M) * kk, 4)} \\cdot 22{,}4\\ \\mathrm{L} ${res(V, 2, "L")}$`]
    );
  },
};

// ---------- ogljikovi hidrati, lipidi, beljakovine ----------
const SACC = [["glukoza", "M"], ["fruktoza", "M"], ["galaktoza", "M"], ["riboza", "M"], ["saharoza", "D", "glukoza + fruktoza"], ["laktoza", "D", "glukoza + galaktoza"], ["maltoza", "D", "dve glukozi"], ["škrob", "P"], ["celuloza", "P"], ["glikogen", "P"]];
const SACC_T = { M: "monosaharid", D: "disaharid", P: "polisaharid" };
const AA = [["glicin", 75.07], ["alanin", 89.09], ["serin", 105.09], ["valin", 117.15], ["cistein", 121.16], ["levcin", 131.17], ["fenilalanin", 165.19]];
const TRIGLY = [["tristearina", 891.48], ["tripalmitina", 807.32], ["trioleina", 885.43]];

const genBiomolekule = {
  id: "dod-kem-ss-ogljikovi-hidrati-lipidi-beljakovine",
  topics: ["KEM-SS-3/ogljikovi-hidrati-lipidi-beljakovine"],
  gen(level, r) {
    const name = nm(r);
    if (level === 1) {
      if (r.next() < 0.55) {
        const [s, t, comp] = r.pick(SACC);
        const desc = { M: `${s} je enostaven sladkor – s hidrolizo ga ne razgradimo v manjše sladkorje.`, D: `${s} je iz dveh monosaharidnih enot (${comp}).`, P: `${s} je iz zelo veliko glukoznih enot.` }[t];
        return concept(r, {
          q: r.pick([`V katero skupino ogljikovih hidratov spada ${s}?`, `${name} ${g(name, "razvršča", "razvršča")} ogljikove hidrate. Kam spada ${s}?`]),
          ok: SACC_T[t],
          wrong: Object.keys(SACC_T).filter((x) => x !== t).map((x) => [SACC_T[x], desc[0].toUpperCase() + desc.slice(1)]),
          hint: "Pomisli, koliko monosaharidnih enot nastane pri popolni hidrolizi.",
          given: null,
          sol: [desc[0].toUpperCase() + desc.slice(1), `${s[0].toUpperCase() + s.slice(1)} je ${SACC_T[t]}.`],
        });
      }
      const n = r.int(3, 60);
      const askWater = r.next() < 0.5;
      return mk(
        askWater ? `Koliko molekul vode se odcepi, ko se ${n} aminokislin poveže v en (nerazvejan) polipeptid?` : `Koliko peptidnih vezi je v nerazvejanem polipeptidu iz ${n} aminokislin?`,
        num(n - 1, null, null, [[n, "Med n zaporednimi aminokislinami je ena vez manj, kot je aminokislin."], [n + 1, "Med n zaporednimi aminokislinami je ena vez manj, kot je aminokislin."]]),
        "Nariši verigo treh aminokislin in preštej vezi med njimi; nato posploši.",
        [dat("n", n)], [askWater ? "N(\\mathrm{H_2O})" : "N(\\text{vez})"], [askWater ? "N(\\mathrm{H_2O}) = N(\\text{vez}) = n - 1" : "N(\\text{vez}) = n - 1"],
        [`Vsaka peptidna vez nastane s kondenzacijo (odcepi se ena molekula vode).`, `Med ${n} aminokislinami je $${n} - 1 = ${n - 1}$ vezi${askWater ? `, odcepi se ${n - 1} molekul vode` : ""}.`]
      );
    }
    if (level === 2) {
      const k = r.int(0, 2);
      if (k === 0) {
        const m = r.int(10, 500);
        const mg = (m / 342.3) * 180.16;
        return mk(
          `Pri hidrolizi saharoze nastaneta glukoza in fruktoza: $\\mathrm{C_{12}H_{22}O_{11} + H_2O \\rightarrow C_6H_{12}O_6 + C_6H_{12}O_6}$. Koliko gramov glukoze nastane iz $${m}\\ \\mathrm{g}$ saharoze? $M(\\text{saharoza}) = 342{,}30\\ \\mathrm{g/mol}$, $M(\\text{glukoza}) = 180{,}16\\ \\mathrm{g/mol}$. ${zaokr(1)}`,
          num(mg, "g", 1, [[2 * mg, "Iz 1 mol saharoze nastane 1 mol glukoze (in 1 mol fruktoze)."], [m / 2, "Mase se ne razdelijo na pol; računaj z množino."]]),
          "Saharozo pretvori v množino; glukoze nastane enako molov.",
          [dat("m", m, "g"), dat("M(\\text{saharoza})", "342{,}30", "g/mol"), dat("M(\\text{glukoza})", "180{,}16", "g/mol")], ["m(\\text{glukoza})"], ["n(\\text{glukoza}) = n(\\text{saharoza})", "m = n \\cdot M"],
          [`$n = \\dfrac{${m}}{342{,}30} \\approx ${qty(tx(m / 342.3, 4), "mol")}$`, `$m(\\text{glukoza}) = ${tx(m / 342.3, 4)} \\cdot 180{,}16\\ \\mathrm{g} ${res(mg, 1, "g")}$`]
        );
      }
      if (k === 1) {
        const V = r.int(5, 200);
        const mg = (V / VM / 6) * 180.16;
        return mk(
          `Rastlina pri fotosintezi porabi $${V}\\ \\mathrm{L}$ $\\mathrm{CO_2}$ (normalni pogoji): $\\mathrm{6CO_2 + 6H_2O \\rightarrow C_6H_{12}O_6 + 6O_2}$. Koliko gramov glukoze nastane? $M(\\mathrm{C_6H_{12}O_6}) = 180{,}16\\ \\mathrm{g/mol}$, ${VM_TXT}. ${zaokr(1)}`,
          num(mg, "g", 1, [[mg * 6, "Za 1 mol glukoze se porabi 6 mol CO₂."], [V / VM / 6, "To je množina glukoze; pomnoži še z molsko maso."]]),
          "Prostornino $\\mathrm{CO_2}$ pretvori v množino; glukoze je 6-krat manj.",
          [dat("V(\\mathrm{CO_2})", V, "L"), dat("M", "180{,}16", "g/mol"), VM_DAT], ["m(\\text{glukoza})"], ["n = \\dfrac{V}{V_m}", "n(\\text{glukoza}) = \\dfrac{n(\\mathrm{CO_2})}{6}"],
          [`$n(\\mathrm{CO_2}) = \\dfrac{${V}}{22{,}4} \\approx ${qty(tx(V / VM, 4), "mol")}$`, `$n(\\text{glukoza}) = \\dfrac{${tx(V / VM, 4)}}{6} \\approx ${qty(tx(V / VM / 6, 4), "mol")}$`, `$m = ${tx(V / VM / 6, 4)} \\cdot 180{,}16\\ \\mathrm{g} ${res(mg, 1, "g")}$`]
        );
      }
      const [x, y] = r.shuffle(AA).slice(0, 2);
      const M = x[1] + y[1] - 18.02;
      return mk(
        `Kolikšna je molska masa dipeptida, ki nastane iz ${x[0]}a ($M = ${Mtx(x[1])}\\ \\mathrm{g/mol}$) in ${y[0]}a ($M = ${Mtx(y[1])}\\ \\mathrm{g/mol}$)? $M(\\mathrm{H_2O}) = 18{,}02\\ \\mathrm{g/mol}$. ${zaokr(2)}`,
        num(M, "g/mol", 2, [[x[1] + y[1], "Ob nastanku peptidne vezi se odcepi molekula vode."], [x[1] + y[1] - 2 * 18.02, "Pri eni peptidni vezi se odcepi le ena molekula vode."]], U_GMOL),
        "Pri nastanku peptidne vezi se odcepi ena molekula vode.",
        [dat("M_1", Mtx(x[1]), "g/mol"), dat("M_2", Mtx(y[1]), "g/mol"), dat("M(\\mathrm{H_2O})", "18{,}02", "g/mol")], ["M(\\text{dipeptid})"], ["M = M_1 + M_2 - M(\\mathrm{H_2O})"],
        [`Kondenzacija: aminokislina + aminokislina → dipeptid + $\\mathrm{H_2O}$`, `$M = ${Mtx(x[1])} + ${Mtx(y[1])} - 18{,}02 ${res(M, 2, "g/mol")}$`]
      );
    }
    const k = r.int(0, 2);
    if (k === 0) {
      const [tg, M] = r.pick(TRIGLY);
      const m = r.dec(5, 100, 1);
      const mN = (m / M) * 3 * 40.0;
      return mk(
        `${name} ${g(name, "izdeluje", "izdeluje")} milo: umili $${tx(m)}\\ \\mathrm{g}$ ${tg} ($M = ${Mtx(M)}\\ \\mathrm{g/mol}$) z raztopino NaOH. Koliko gramov NaOH se porabi pri popolnem umiljenju? $M(\\mathrm{NaOH}) = 40{,}00\\ \\mathrm{g/mol}$. ${zaokr(2)}`,
        num(mN, "g", 2, [[mN / 3, "Triglicerid ima tri estrske vezi: na 1 mol maščobe se porabijo 3 mol NaOH."], [(m / M) * 3, "To je množina NaOH; pomnoži še z M."]]),
        "Maščoba je triester glicerola; vsaka od treh estrskih vezi porabi en NaOH.",
        [dat("m", tx(m), "g"), dat("M", Mtx(M), "g/mol"), dat("M(\\mathrm{NaOH})", "40{,}00", "g/mol")], ["m(\\mathrm{NaOH})"], ["\\text{triglicerid} + 3\\,\\mathrm{NaOH} \\rightarrow \\text{glicerol} + 3\\,\\text{milo}", "n(\\mathrm{NaOH}) = 3\\,n(\\text{maščoba})"],
        [`$n(\\text{maščoba}) = \\dfrac{${tx(m)}}{${Mtx(M)}} \\approx ${qty(tx(m / M, 5), "mol")}$`, `$n(\\mathrm{NaOH}) = 3 \\cdot ${tx(m / M, 5)} \\approx ${qty(tx((3 * m) / M, 5), "mol")}$`, `$m = ${tx((3 * m) / M, 5)} \\cdot 40{,}00\\ \\mathrm{g} ${res(mN, 2, "g")}$`]
      );
    }
    if (k === 1) {
      const m = r.dec(10, 500, 0);
      const y = r.int(60, 95);
      const mg = (m / 162.14) * 180.16 * (y / 100);
      return mk(
        `Iz $${m}\\ \\mathrm{g}$ škroba ($\\mathrm{(C_6H_{10}O_5)_n}$, $M(\\mathrm{C_6H_{10}O_5}) = 162{,}14\\ \\mathrm{g/mol}$ na enoto) s hidrolizo pridobivamo glukozo ($M = 180{,}16\\ \\mathrm{g/mol}$). Izkoristek je $${y}\\ \\%$. Koliko gramov glukoze dobimo? ${zaokr(1)}`,
        num(mg, "g", 1, [[(m / 162.14) * 180.16, "Upoštevaj še izkoristek."], [(m * y) / 100, "Masa se pri hidrolizi poveča – vsaka enota veže molekulo vode."]]),
        "Vsaka enota $\\mathrm{C_6H_{10}O_5}$ ob hidrolizi veže vodo in da eno molekulo glukoze.",
        [dat("m", m, "g"), dat("M(\\text{enota})", "162{,}14", "g/mol"), dat("M(\\text{glukoza})", "180{,}16", "g/mol"), `\\eta = ${y}\\ \\%`], ["m(\\text{glukoza})"], ["n(\\text{glukoza}) = n(\\text{enota})", "m = n \\cdot M \\cdot \\eta"],
        [`$n(\\text{enota}) = \\dfrac{${m}}{162{,}14} \\approx ${qty(tx(m / 162.14, 4), "mol")}$`, `$m_\\text{teor} = ${tx(m / 162.14, 4)} \\cdot 180{,}16 \\approx ${qty(tx((m / 162.14) * 180.16, 2), "g")}$`, `$m = ${tx((m / 162.14) * 180.16, 2)} \\cdot ${tx(y / 100)} ${res(mg, 1, "g")}$`]
      );
    }
    const three = [r.pick(AA), r.pick(AA), r.pick(AA)];
    const M = three.reduce((s, x) => s + x[1], 0) - 2 * 18.02;
    return mk(
      `Tripeptid je zgrajen iz ${three.map((x) => x[0]).join(", ")} (v tem zaporedju). Molske mase aminokislin so ${three.map((x) => `$${Mtx(x[1])}$`).join(", ")} g/mol, $M(\\mathrm{H_2O}) = 18{,}02\\ \\mathrm{g/mol}$. Kolikšna je molska masa tripeptida? ${zaokr(2)}`,
      num(M, "g/mol", 2, [[M + 18.02, "Med tremi aminokislinami sta dve peptidni vezi – odcepita se dve molekuli vode."], [M + 2 * 18.02, "Ob nastanku peptidnih vezi se odcepi voda."], [M - 18.02, "Med tremi aminokislinami sta le dve peptidni vezi."]], U_GMOL),
      "Seštej molske mase aminokislin in odštej vodo za vsako peptidno vez.",
      [...three.map((x, i) => dat(`M_${i + 1}`, Mtx(x[1]), "g/mol")), dat("M(\\mathrm{H_2O})", "18{,}02", "g/mol")], ["M(\\text{tripeptid})"], ["M = M_1 + M_2 + M_3 - 2 \\cdot M(\\mathrm{H_2O})"],
      [`Peptidni vezi sta 2 → odcepita se 2 molekuli vode.`, `$M = ${three.map((x) => Mtx(x[1])).join(" + ")} - 2 \\cdot 18{,}02 ${res(M, 2, "g/mol")}$`]
    );
  },
};

// ---------- polimeri ----------
const POLY = [["polieten (PE)", "eten", "CH2=CH2", 28.05, "C2H4"], ["polipropen (PP)", "propen", "CH2=CH-CH3", 42.08, "C3H6"], ["polivinilklorid (PVC)", "kloroeten", "CH2=CHCl", 62.5, "C2H3Cl"], ["polistiren (PS)", "stiren (fenileten)", "CH2=CH-C6H5", 104.15, "C8H8"], ["politetrafluoroeten (teflon)", "tetrafluoroeten", "CF2=CF2", 100.02, "C2F4"]];
const MONOMER_Q = [
  ["polietena (PE)", "eten", [["etan", "Za adicijsko polimerizacijo je potrebna dvojna vez; etan je nasičen."], ["propen", "Iz propena nastane polipropen."], ["kloroeten", "Iz kloroetena nastane PVC."]]],
  ["polipropena (PP)", "propen", [["propan", "Za adicijsko polimerizacijo je potrebna dvojna vez; propan je nasičen."], ["eten", "Iz etena nastane polieten."], ["propan-1-ol", "Alkohol se ne polimerizira z adicijo."]]],
  ["polivinilklorida (PVC)", "kloroeten (vinil klorid)", [["kloroetan", "Kloroetan nima dvojne vezi, zato se ne polimerizira."], ["eten", "V PVC je na vsaki enoti atom Cl – monomer ga mora vsebovati."], ["1,2-dikloroeten", "V PVC je na vsaki ponavljajoči enoti le en atom Cl."]]],
  ["polistirena (PS)", "stiren (fenileten)", [["benzen", "Benzen nima dvojne vezi izven obroča, ki bi se odprla."], ["eten", "V polistirenu je na vsaki enoti benzenov obroč."], ["etilbenzen", "Etilbenzen nima dvojne vezi v stranski verigi."]]],
  ["teflona (PTFE)", "tetrafluoroeten", [["tetrafluoroetan", "Nasičena spojina se ne more polimerizirati z adicijo."], ["eten", "V teflonu ni vodika – vsi H so zamenjani s F."], ["fluoroeten", "V teflonu so na vsakem atomu C dva atoma F."]]],
  ["najlona 6,6", "heksan-1,6-diamin in heksandiojska kislina", [["heksan-1,6-diol in heksandiojska kislina", "Iz diola in dikisline nastane poliester, ne poliamid."], ["eten in propen", "Najlon je poliamid; nastane s polikondenzacijo."], ["heksanamid", "Monomera morata imeti po dve funkcionalni skupini, da nastane veriga."]]],
  ["poli(etilen tereftalata) (PET)", "etan-1,2-diol in benzen-1,4-dikarboksilna kislina", [["etanol in benzojska kislina", "Monomera z eno funkcionalno skupino ne tvorita verige – le en ester."], ["eten in benzen", "PET je poliester; nastane s polikondenzacijo diola in dikisline."], ["etan-1,2-diamin in benzen-1,4-dikarboksilna kislina", "Iz diamina in dikisline nastane poliamid, ne poliester."]]],
  ["naravnega kavčuka", "izopren (2-metilbuta-1,3-dien)", [["2-metilbutan", "Nasičena spojina se ne polimerizira."], ["eten", "Kavčuk ima v verigi dvojne vezi in metilne skupine – nastane iz diena."], ["buta-1,3-dien", "Kavčuk ima na vsaki enoti metilno skupino."]]],
];
const POLY_TYPE = [["polieten", "A"], ["polipropen", "A"], ["PVC", "A"], ["polistiren", "A"], ["teflon", "A"], ["naravni kavčuk", "A"], ["najlon 6,6", "K"], ["PET (poliester)", "K"], ["beljakovine (iz aminokislin)", "K"], ["škrob (iz glukoze)", "K"], ["polimlečna kislina (PLA)", "K"]];
const POLY_EL = [["PVC", "C2H3Cl", "Cl", 35.45, 1], ["teflonu", "C2F4", "F", 19.0, 4], ["polietenu", "C2H4", "C", 12.01, 2], ["polistirenu", "C8H8", "C", 12.01, 8], ["poliakrilonitrilu", "C3H3N", "N", 14.01, 1], ["polipropenu", "C3H6", "H", 1.01, 6]];
const AR = { C: 12.01, H: 1.01, Cl: 35.45, F: 19.0, N: 14.01 };

const genPolimeri = {
  id: "dod-kem-ss-polimeri",
  topics: ["KEM-SS-3/polimeri"],
  gen(level, r) {
    const name = nm(r);
    if (level === 1) {
      if (r.next() < 0.5) {
        const [pol, ok, wrong] = r.pick(MONOMER_Q);
        return concept(r, {
          q: r.pick([`Iz katerega monomera (ali monomerov) nastane ${pol.replace(/a \(/, " (").replace(/^polietena/, "polieten").replace(/^polipropena/, "polipropen").replace(/^polistirena/, "polistiren")}?`, `Kateri monomer${ok.includes(" in ") ? "a sta" : " je"} potreben za sintezo ${pol}?`]),
          ok,
          wrong,
          hint: "Adicijski polimeri nastanejo iz monomerov z dvojno vezjo; kondenzacijski iz monomerov z dvema funkcionalnima skupinama.",
          given: null,
          sol: [ok.includes(" in ") ? "Polimer nastane s polikondenzacijo dveh vrst monomerov." : "Polimer nastane z adicijsko polimerizacijo – odpre se dvojna vez monomera.", `Monomer: ${ok}.`],
        });
      }
      const [pol, mono, S, M] = r.pick(POLY);
      const n0 = r.int(500, 5000);
      const Mp = Math.round((n0 * M) / 100) * 100;
      const n = Mp / M;
      return mk(
        `Povprečna molska masa ${pol.replace(/en \(/, "ena (").replace(/id \(/, "ida (").replace(/n \(teflon\)/, "na (teflona)")} je $${Mp}\\ \\mathrm{g/mol}$. Koliko monomernih enot ${mono} ($M = ${Mtx(M)}\\ \\mathrm{g/mol}$) je povprečno v verigi? ${zaokr(0)}`,
        num(n, null, 0, [[M / Mp, "Deli molsko maso polimera z molsko maso monomera, ne obratno."], [Mp / 12.01, "Deli z molsko maso monomera, ne atoma ogljika."]]),
        "Pri adicijski polimerizaciji se ohranijo vsi atomi monomera: $M(\\text{polimer}) = n \\cdot M(\\text{monomer})$.",
        [dat("M(\\text{polimer})", Mp, "g/mol"), dat("M(\\text{monomer})", Mtx(M), "g/mol")], ["n"], ["n = \\dfrac{M(\\text{polimer})}{M(\\text{monomer})}"],
        [`Monomer: $${org(S)}$; ob polimerizaciji se odpre dvojna vez, atomi se ohranijo.`, `$n = \\dfrac{${Mp}}{${Mtx(M)}} ${res(n, 0)}$`]
      );
    }
    if (level === 2) {
      if (r.next() < 0.5) {
        const [pol, t] = r.pick(POLY_TYPE);
        const A = "adicijska polimerizacija (brez stranskega produkta)", K = "polikondenzacija (odcepi se majhna molekula, npr. voda)", E = "eliminacija";
        const ok = t === "A" ? A : K;
        return concept(r, {
          q: r.pick([`S katero reakcijo nastane ${pol}?`, `${name} ${g(name, "razvršča", "razvršča")} polimere po načinu nastanka. Kam spada ${pol}?`]),
          ok,
          wrong: [[t === "A" ? K : A, t === "A" ? "Monomer ima dvojno vez, ki se odpre; stranski produkt ne nastane." : "Monomeri nimajo dvojne vezi C=C; povezujejo se funkcionalne skupine ob odcepu vode."], [E, "Pri eliminaciji iz ene molekule nastane manjša molekula z dvojno vezjo – veriga ne nastane."]],
          hint: "Ali ima monomer dvojno vez C=C (adicija) ali dve funkcionalni skupini, ki se povežeta ob odcepu vode (kondenzacija)?",
          given: null,
          sol: [t === "A" ? "Monomer ima dvojno vez C=C, ki se pri polimerizaciji odpre." : "Monomeri se povezujejo s funkcionalnimi skupinami, pri tem se odcepi voda.", `Nastane z reakcijo: ${ok}.`],
        });
      }
      const [pol, mono, S, , F] = r.pick(POLY);
      const comp = parseFormula(F);
      const M = Object.entries(comp).reduce((s, [e, k]) => s + AR[e] * k, 0);
      const Mk = r.int(20, 400);
      const n = (Mk * 1000) / M;
      const els = Object.keys(comp);
      return mk(
        `Povprečna molska masa ${pol.replace(/en \(/, "ena (").replace(/id \(/, "ida (").replace(/n \(teflon\)/, "na (teflona)")} je $${Mk}\\ \\mathrm{kg/mol}$. Monomer je ${mono} ($${sp(F)}$). Koliko monomernih enot je povprečno v verigi? ${els.map((e) => `$A_r(\\mathrm{${e}}) = ${tx(AR[e], 2)}$`).join(", ")}. ${zaokr(0)}`,
        num(n, null, 0, [[Mk / M, "Molsko maso polimera pretvori iz kg/mol v g/mol."], [(Mk * 1000) / AR.C, "Deli z molsko maso monomera, ne atoma C."]]),
        "Izračunaj molsko maso monomera iz atomskih mas, polimer pretvori v g/mol in deli.",
        [dat("M(\\text{polimer})", Mk, "kg/mol"), ...els.map((e) => `A_r(\\mathrm{${e}}) = ${tx(AR[e], 2)}`)], ["n"], [`M(${sp(F)}) = ${Object.entries(comp).map(([e, k]) => `${k > 1 ? `${k} \\cdot ` : ""}A_r(\\mathrm{${e}})`).join(" + ")}`, "n = \\dfrac{M(\\text{polimer})}{M(\\text{monomer})}"],
        [`$M(${sp(F)}) = ${Object.entries(comp).map(([e, k]) => `${k > 1 ? `${k} \\cdot ` : ""}${tx(AR[e], 2)}`).join(" + ")} = ${qty(tx(M, 2), "g/mol")}$`, `$M(\\text{polimer}) = ${Mk}\\ \\mathrm{kg/mol} = ${Mk * 1000}\\ \\mathrm{g/mol}$`, `$n = \\dfrac{${Mk * 1000}}{${tx(M, 2)}} ${res(n, 0)}$`]
      );
    }
    const k = r.int(0, 2);
    if (k === 0) {
      const N = r.int(5, 50) * 10;
      const M = N * (116.21 + 146.14) - (2 * N - 1) * 18.02;
      return mk(
        `Veriga najlona 6,6 nastane iz ${N} molekul heksan-1,6-diamina ($M = 116{,}21\\ \\mathrm{g/mol}$) in ${N} molekul heksandiojske kisline ($M = 146{,}14\\ \\mathrm{g/mol}$). Kolikšna je molska masa verige? $M(\\mathrm{H_2O}) = 18{,}02\\ \\mathrm{g/mol}$. ${zaokr(0)}`,
        num(M, "g/mol", 0, [[N * (116.21 + 146.14), "Pri vsaki amidni vezi se odcepi molekula vode."], [N * (116.21 + 146.14) - 2 * N * 18.02, `V nerazvejani verigi iz ${2 * N} molekul je ${2 * N - 1} vezi, ne ${2 * N}.`], [N * (116.21 + 146.14) - N * 18.02, `Molekul monomerov je ${2 * N}, vezi med njimi ${2 * N - 1}.`]], U_GMOL),
        "Preštej vse monomere v verigi; vezi (in odcepljenih molekul vode) je ena manj.",
        [dat("N", N), dat("M(\\text{diamin})", "116{,}21", "g/mol"), dat("M(\\text{dikislina})", "146{,}14", "g/mol"), dat("M(\\mathrm{H_2O})", "18{,}02", "g/mol")], ["M(\\text{veriga})"], ["N(\\mathrm{H_2O}) = 2N - 1", "M = N \\cdot (M_1 + M_2) - (2N - 1) \\cdot M(\\mathrm{H_2O})"],
        [`Monomerov je ${2 * N}, amidnih vezi ${2 * N - 1} → odcepi se ${2 * N - 1} molekul vode.`, `$M = ${N} \\cdot (116{,}21 + 146{,}14) - ${2 * N - 1} \\cdot 18{,}02$`, `$M ${res(M, 0, "g/mol")}$`]
      );
    }
    if (k === 1) {
      const [pol, F, El, Ar, cnt] = r.pick(POLY_EL);
      const comp = parseFormula(F);
      const M = Object.entries(comp).reduce((s, [e, kk]) => s + AR[e] * kk, 0);
      const w = ((cnt * Ar) / M) * 100;
      const els = Object.keys(comp);
      return mk(
        `Kolikšen je masni delež ${({ Cl: "klora", F: "fluora", C: "ogljika", N: "dušika", H: "vodika" })[El]} v ${pol}? Ponavljajoča se enota ima formulo $${sp(F)}$. ${els.map((e) => `$A_r(\\mathrm{${e}}) = ${tx(AR[e], 2)}$`).join(", ")}. Rezultat v % ${ROUND[1]}.`,
        num(w, "%", 1, [[(Ar / M) * 100, `V enoti je ${cnt} atomov ${El}.`], [w * 0.5, "Masni delež je enak za celo verigo in za eno ponavljajočo se enoto."]].filter((x) => cnt > 1 || x[1] !== `V enoti je ${cnt} atomov ${El}.`)),
        "Masni delež v polimeru je enak kot v ponavljajoči se enoti – dolžina verige nima vpliva.",
        els.map((e) => `A_r(\\mathrm{${e}}) = ${tx(AR[e], 2)}`), [`w(\\mathrm{${El}})`], [`w(\\mathrm{${El}}) = \\dfrac{${cnt > 1 ? `${cnt} \\cdot ` : ""}A_r(\\mathrm{${El}})}{M(${sp(F)})}`],
        [`$M(${sp(F)}) = ${Object.entries(comp).map(([e, kk]) => `${kk > 1 ? `${kk} \\cdot ` : ""}${tx(AR[e], 2)}`).join(" + ")} = ${qty(tx(M, 2), "g/mol")}$`, `$w = \\dfrac{${cnt > 1 ? `${cnt} \\cdot ` : ""}${tx(Ar, 2)}}{${tx(M, 2)}} \\cdot 100\\ \\% ${res(w, 1, "\\%")}$`]
      );
    }
    const [pol, mono, , M] = r.pick(POLY);
    const mp = r.int(5, 200);
    const y = r.int(70, 98);
    const mm = mp / (y / 100);
    return mk(
      `${name} ${g(name, "želi", "želi")} pripraviti $${mp}\\ \\mathrm{kg}$ ${pol.replace(/en \(/, "ena (").replace(/id \(/, "ida (").replace(/n \(teflon\)/, "na (teflona)")}. Izkoristek polimerizacije je $${y}\\ \\%$. Koliko kg monomera ${mono} potrebuje? ${zaokr(1)}`,
      num(mm, "kg", 1, [[mp * (y / 100), "Zaradi izkoristka pod 100 % potrebujemo več monomera, ne manj."], [mp, "Upoštevaj izkoristek."]]),
      "Pri adicijski polimerizaciji je masa polimera enaka masi zreagiranega monomera; upoštevaj izkoristek.",
      [dat("m(\\text{polimer})", mp, "kg"), `\\eta = ${y}\\ \\%`], ["m(\\text{monomer})"], ["m(\\text{polimer}) = \\eta \\cdot m(\\text{monomer})"],
      [`Pri adiciji se ohranijo vsi atomi: teoretično je masa polimera enaka masi monomera.`, `$m(\\text{monomer}) = \\dfrac{${mp}\\ \\mathrm{kg}}{${tx(y / 100)}} ${res(mm, 1, "kg")}$`]
    );
  },
};

// =====================================================================
// KEM-SS-4: ponovitev in kemijsko računanje
// =====================================================================
const SS12 = [genVezi, genMedmol, genPlini, genEnergija, genHitrost, genRavnotezje, genKislineBaze, genSibke, genTitracija, genOksStevila, genRedoks, genGalvanski];
const SS3 = [genOgljikovodiki, genIzomerija, genHaloAlk, genKarbonil, genKarboksilne, genOrgReakcije, genBiomolekule, genPolimeri];
// Ponovitev: naloga izbrane teme iz 1.–3. letnika na isti ravni.
const genSplosna = { id: "dod-kem-ss-4-splosna-ponovitev", topics: ["KEM-SS-4/splosna-in-anorganska-kemija"], gen: (level, r) => r.pick(SS12).gen(level, r) };
const genOrganska = { id: "dod-kem-ss-4-organska-ponovitev", topics: ["KEM-SS-4/organska-kemija"], gen: (level, r) => r.pick(SS3).gen(level, r) };

const SOLN = [["HCl", "klorovodikove kisline", 36.46], ["NaOH", "natrijevega hidroksida", 40.0], ["H2SO4", "žveplove(VI) kisline", 98.08], ["NaCl", "natrijevega klorida", 58.44], ["CuSO4", "bakrovega(II) sulfata", 159.61], ["KNO3", "kalijevega nitrata", 101.1], ["glukoze", "glukoze", 180.16]];
const CONC = [["NaOH", 40.0, 10, 1.11], ["NaOH", 40.0, 20, 1.22], ["NaOH", 40.0, 30, 1.33], ["NaOH", 40.0, 40, 1.43], ["H2SO4", 98.08, 20, 1.14], ["H2SO4", 98.08, 50, 1.4], ["H2SO4", 98.08, 96, 1.84], ["HCl", 36.46, 10, 1.05], ["HCl", 36.46, 20, 1.1], ["HCl", 36.46, 36, 1.18], ["HNO3", 63.01, 30, 1.18], ["HNO3", 63.01, 65, 1.39], ["KOH", 56.11, 30, 1.29], ["NH3", 17.03, 25, 0.91]];
const CHN = [["glukoza", 40.0, 180.16, 6, 1], ["etanol", 52.14, 46.07, 2, 2], ["benzen", 92.26, 78.11, 6, 1], ["propan", 81.71, 44.1, 3, 3], ["etanojska kislina", 40.0, 60.05, 2, 1], ["butan", 82.66, 58.12, 4, 2], ["propanon", 62.04, 58.08, 3, 3], ["oktan", 84.12, 114.23, 8, 4], ["etin", 92.26, 26.04, 2, 1], ["cikloheksan", 85.63, 84.16, 6, 1]];

const genRacunanje = {
  id: "dod-kem-ss-4-kemijsko-racunanje",
  topics: ["KEM-SS-4/kemijsko-racunanje"],
  gen(level, r) {
    const name = nm(r);
    if (level === 1) {
      const [F, gen, M] = r.pick(SOLN);
      if (r.next() < 0.5) {
        const c1 = r.pick([1, 2, 5, 0.5, 6]);
        const c2 = r.pick([0.1, 0.05, 0.2, 0.25, 0.01].filter((x) => x < c1));
        const V2 = r.pick([100, 250, 500, 1000]);
        const V1 = (c2 * V2) / c1;
        return mk(
          r.pick([`Koliko mL raztopine ${gen} s koncentracijo $${tx(c1)}\\ \\mathrm{mol/L}$ potrebujemo za pripravo $${V2}\\ \\mathrm{mL}$ raztopine s koncentracijo $${tx(c2)}\\ \\mathrm{mol/L}$? ${zaokr(1)}`, `${name} ${g(name, "mora pripraviti", "mora pripraviti")} $${V2}\\ \\mathrm{mL}$ raztopine ${gen} s koncentracijo $${tx(c2)}\\ \\mathrm{mol/L}$ z redčenjem raztopine s koncentracijo $${tx(c1)}\\ \\mathrm{mol/L}$. Koliko mL izhodne raztopine odmeri? ${zaokr(1)}`]),
          num(V1, "mL", 1, [[(c1 * V2) / c2, "Si zamenjal koncentraciji? Pri redčenju potrebujemo manjšo prostornino koncentrirane raztopine."], [V2 - V1, "To je prostornina dodane vode, ne izhodne raztopine."]], { unitAlternatives: ["ml"] }),
          "Pri redčenju se množina topljenca ne spremeni: $c_1V_1 = c_2V_2$.",
          [dat("c_1", tx(c1), "mol/L"), dat("c_2", tx(c2), "mol/L"), dat("V_2", V2, "mL")], ["V_1"], ["c_1 V_1 = c_2 V_2"],
          [`$V_1 = \\dfrac{c_2 V_2}{c_1} = \\dfrac{${tx(c2)} \\cdot ${V2}}{${tx(c1)}}\\ \\mathrm{mL}$`, `$V_1 ${res(V1, 1, "mL")}$ (dopolnimo z vodo do ${V2} mL)`]
        );
      }
      const gam = r.dec(1, 80, 1);
      const c = gam / M;
      return mk(
        `Masna koncentracija ${gen} v raztopini je $${tx(gam)}\\ \\mathrm{g/L}$. Kolikšna je množinska koncentracija? $M = ${Mtx(M)}\\ \\mathrm{g/mol}$. ${zaokr(3)}`,
        num(c, "mol/L", 3, [[gam * M, "Si množil namesto delil? c = γ / M."], [M / gam, "Si obrnil ulomek? c = γ / M."]], U_CONC),
        "V enem litru raztopine je $\\gamma$ gramov topljenca; pretvori jih v mole.",
        [dat("\\gamma", tx(gam), "g/L"), dat("M", Mtx(M), "g/mol")], ["c"], ["c = \\dfrac{\\gamma}{M}"],
        [`$c = \\dfrac{\\gamma}{M} = \\dfrac{${tx(gam)}\\ \\mathrm{g/L}}{${Mtx(M)}\\ \\mathrm{g/mol}}$`, `$c ${res(c, 3, "mol/L")}$`]
      );
    }
    if (level === 2) {
      if (r.next() < 0.5) {
        const [F, gen] = r.pick(SOLN);
        const c1 = r.dec(0.1, 2, 2), c2 = r.dec(0.1, 2, 2);
        const V1 = r.int(2, 30) * 10, V2 = r.int(2, 30) * 10;
        const c = (c1 * V1 + c2 * V2) / (V1 + V2);
        return mk(
          r.pick([`Zmešamo $${V1}\\ \\mathrm{mL}$ raztopine ${gen} s koncentracijo $${tx(c1)}\\ \\mathrm{mol/L}$ in $${V2}\\ \\mathrm{mL}$ raztopine s koncentracijo $${tx(c2)}\\ \\mathrm{mol/L}$. Kolikšna je koncentracija dobljene raztopine? ${zaokr(3)}`, `${name} ${g(name, "zlije", "zlije")} skupaj ostanka raztopin ${gen}: $${V1}\\ \\mathrm{mL}$ ($${tx(c1)}\\ \\mathrm{mol/L}$) in $${V2}\\ \\mathrm{mL}$ ($${tx(c2)}\\ \\mathrm{mol/L}$). Kolikšna je nova koncentracija? ${zaokr(3)}`]),
          num(c, "mol/L", 3, [[(c1 + c2) / 2, "Navadno povprečje velja le pri enakih prostorninah; seštej množini."], [c1 * V1 + c2 * V2, "Skupno množino deli s skupno prostornino."]], U_CONC),
          "Seštej množini topljenca in ju deli s skupno prostornino.",
          [dat("V_1", V1, "mL"), dat("c_1", tx(c1), "mol/L"), dat("V_2", V2, "mL"), dat("c_2", tx(c2), "mol/L")], ["c"], ["c = \\dfrac{c_1V_1 + c_2V_2}{V_1 + V_2}"],
          [`$n = ${tx(c1)} \\cdot ${tx(V1 / 1000)} + ${tx(c2)} \\cdot ${tx(V2 / 1000)} = ${qty(tx((c1 * V1 + c2 * V2) / 1000), "mol")}$`, `$V = ${V1 + V2}\\ \\mathrm{mL} = ${qty(tx((V1 + V2) / 1000), "L")}$`, `$c = \\dfrac{${tx((c1 * V1 + c2 * V2) / 1000)}}{${tx((V1 + V2) / 1000)}} ${res(c, 3, "mol/L")}$`]
        );
      }
      const [F, M, w, rho] = r.pick(CONC);
      const c = (1000 * rho * (w / 100)) / M;
      return mk(
        `Koncentrirana raztopina $${sp(F)}$ ima masni delež $${w}\\ \\%$ in gostoto $${tx(rho, 2)}\\ \\mathrm{g/mL}$. Kolikšna je njena množinska koncentracija? $M(${sp(F)}) = ${Mtx(M)}\\ \\mathrm{g/mol}$. ${zaokr(2)}`,
        num(c, "mol/L", 2, [[(1000 * (w / 100)) / M, "Upoštevaj gostoto: 1 L raztopine nima mase 1000 g."], [(rho * (w / 100)) / M, "Gostota je v g/mL; 1 L = 1000 mL."], [(1000 * rho * w) / M, "Masni delež vstavi kot decimalno število (npr. 0,36)."]], U_CONC),
        "Vzemi 1 L raztopine: izračunaj njeno maso (gostota), maso topljenca (masni delež) in množino.",
        [`w = ${w}\\ \\%`, dat("\\rho", tx(rho, 2), "g/mL"), dat("M", Mtx(M), "g/mol")], ["c"], ["m(\\text{raztopina}) = \\rho \\cdot V", "m(\\text{topljenec}) = w \\cdot m(\\text{raztopina})", "c = \\dfrac{n}{V}"],
        [`$m(1\\ \\mathrm{L}) = ${tx(rho, 2)} \\cdot 1000 = ${qty(tx(1000 * rho), "g")}$`, `$m(${sp(F)}) = ${tx(w / 100)} \\cdot ${tx(1000 * rho)} = ${qty(tx(10 * rho * w, 1), "g")}$`, `$c = \\dfrac{${tx(10 * rho * w, 1)}}{${Mtx(M)}}\\ \\mathrm{mol/L} ${res(c, 2, "mol/L")}$`]
      );
    }
    const k = r.int(0, 2);
    if (k === 0) {
      const mZn = r.dec(0.5, 5, 2);
      const c = r.pick([0.5, 1, 2]);
      const V = r.int(2, 20) * 10;
      const nZn = mZn / 65.38, nHCl = (c * V) / 1000;
      const lim = nHCl / 2 < nZn ? "HCl" : "Zn";
      const nH2 = Math.min(nZn, nHCl / 2);
      const VH = nH2 * VM;
      return mk(
        `${name} ${g(name, "da", "da")} $${tx(mZn)}\\ \\mathrm{g}$ cinka v $${V}\\ \\mathrm{mL}$ klorovodikove kisline s koncentracijo $${tx(c)}\\ \\mathrm{mol/L}$: $\\mathrm{Zn + 2HCl \\rightarrow ZnCl_2 + H_2}$. Koliko litrov vodika nastane pri normalnih pogojih? $M(\\mathrm{Zn}) = 65{,}38\\ \\mathrm{g/mol}$, ${VM_TXT}. ${zaokr(3)}`,
        num(VH, "L", 3, [[lim === "HCl" ? nZn * VM : (nHCl / 2) * VM, "Količino produkta določa reaktant, ki ga zmanjka (omejujoči reaktant)."], [lim === "HCl" ? nHCl * VM : nZn * 2 * VM, "Iz 2 mol HCl nastane 1 mol H₂."]], { unitAlternatives: ["l", "dm3", "dm³"] }),
        "Izračunaj množini obeh reaktantov in ugotovi, katerega zmanjka (upoštevaj razmerje 1 : 2).",
        [dat("m(\\mathrm{Zn})", tx(mZn), "g"), dat("V(\\mathrm{HCl})", V, "mL"), dat("c(\\mathrm{HCl})", tx(c), "mol/L"), dat("M(\\mathrm{Zn})", "65{,}38", "g/mol"), VM_DAT], ["V(\\mathrm{H_2})"], ["n(\\mathrm{Zn}) : n(\\mathrm{HCl}) = 1 : 2", "n(\\mathrm{H_2}) = n(\\mathrm{Zn}) = \\dfrac{n(\\mathrm{HCl})}{2}", "V = n \\cdot V_m"],
        [`$n(\\mathrm{Zn}) = \\dfrac{${tx(mZn)}}{65{,}38} \\approx ${qty(tx(nZn, 5), "mol")}$, $n(\\mathrm{HCl}) = ${tx(c)} \\cdot ${tx(V / 1000)} = ${qty(tx(nHCl, 5), "mol")}$`, `Za ves cink bi potrebovali $${tx(2 * nZn, 5)}\\ \\mathrm{mol}$ HCl → omejujoči reaktant je ${lim === "HCl" ? "HCl" : "cink"}.`, `$n(\\mathrm{H_2}) \\approx ${qty(tx(nH2, 5), "mol")}$, $V = ${tx(nH2, 5)} \\cdot 22{,}4\\ \\mathrm{L} ${res(VH, 3, "L")}$`]
      );
    }
    if (k === 1) {
      const m = r.dec(5, 100, 1);
      const w = r.int(70, 98);
      const nC = (m * (w / 100)) / 100.09;
      const V = nC * VM;
      return mk(
        `Apnenec vsebuje $${w}\\ \\%$ $\\mathrm{CaCO_3}$, ostalo so primesi, ki s kislino ne reagirajo. Koliko litrov $\\mathrm{CO_2}$ (normalni pogoji) nastane, ko $${tx(m)}\\ \\mathrm{g}$ apnenca raztopimo v prebitku klorovodikove kisline? $M(\\mathrm{CaCO_3}) = 100{,}09\\ \\mathrm{g/mol}$, ${VM_TXT}. ${zaokr(2)}`,
        num(V, "L", 2, [[(m / 100.09) * VM, "Upoštevaj, da je CaCO₃ le del vzorca (masni delež)."], [nC * 2 * VM, "Iz 1 mol CaCO₃ nastane 1 mol CO₂."]], { unitAlternatives: ["l", "dm3", "dm³"] }),
        "Izračunaj maso čistega $\\mathrm{CaCO_3}$, nato množino; $\\mathrm{CO_2}$ nastane enako molov.",
        [`w(\\mathrm{CaCO_3}) = ${w}\\ \\%`, dat("m(\\text{apnenec})", tx(m), "g"), dat("M(\\mathrm{CaCO_3})", "100{,}09", "g/mol"), VM_DAT], ["V(\\mathrm{CO_2})"], ["\\mathrm{CaCO_3 + 2HCl \\rightarrow CaCl_2 + H_2O + CO_2}", "m(\\mathrm{CaCO_3}) = w \\cdot m(\\text{vzorec})", "V = n \\cdot V_m"],
        [`$m(\\mathrm{CaCO_3}) = ${tx(w / 100)} \\cdot ${tx(m)} = ${qty(tx((m * w) / 100, 3), "g")}$`, `$n(\\mathrm{CO_2}) = n(\\mathrm{CaCO_3}) = \\dfrac{${tx((m * w) / 100, 3)}}{100{,}09} \\approx ${qty(tx(nC, 5), "mol")}$`, `$V = ${tx(nC, 5)} \\cdot 22{,}4\\ \\mathrm{L} ${res(V, 2, "L")}$`]
      );
    }
    const [ime, w, M, nC, emp] = r.pick(CHN);
    return mk(
      `Spojina vsebuje $${tx(w, 2)}\\ \\%$ ogljika (masni delež), njena molska masa je $${Mtx(M)}\\ \\mathrm{g/mol}$. Koliko atomov ogljika ima molekula? $A_r(\\mathrm{C}) = 12{,}01$.`,
      num(nC, null, null, [[Math.round((w * M) / 100), "To je masa ogljika v 1 mol spojine; deli jo še z A_r(C)."], [emp, "To je število atomov C v empirični formuli; molska masa pove, kolikokrat je večja."]]),
      "Izračunaj maso ogljika v enem molu spojine in jo deli z molsko maso ogljika.",
      [`w(\\mathrm{C}) = ${tx(w, 2)}\\ \\%`, dat("M", Mtx(M), "g/mol"), "A_r(\\mathrm{C}) = 12{,}01"], ["N(\\mathrm{C})"], ["N(\\mathrm{C}) = \\dfrac{w(\\mathrm{C}) \\cdot M}{A_r(\\mathrm{C})}"],
      [`$m(\\mathrm{C}) = ${tx(w / 100, 4)} \\cdot ${Mtx(M)} \\approx ${qty(tx((w * M) / 100, 2), "g")}$ v 1 mol`, `$N(\\mathrm{C}) = \\dfrac{${tx((w * M) / 100, 2)}}{12{,}01} \\approx ${tx((w * M) / 100 / 12.01, 2)} \\approx ${nC}$ (spojina: ${ime})`]
    );
  },
};
export const DODATNE_KEM_SS = [...SS12, ...SS3, genSplosna, genOrganska, genRacunanje];
