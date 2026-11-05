// Simboli za plast Σ Evklidove tipkovnice (public/tipkovnica.js): koreni, potence, integrali,
// grške črke in kemijske enačbe brez iskanja po sistemski tipkovnici.
// Skupine so razvrščene po ravni: osnovnošolec najprej vidi osnovne znake,
// študent najprej analizo.

// [prikaz, vstavi, opis]; @ v vstavljenem je mesto kazalca (in označenega besedila).
const k = (label, ins = label, title = "") => ({ label, ins, title });

export const GROUPS = {
  osnovno: {
    name: "Osnovno",
    keys: [
      k("+"), k("−"), k("·", "·", "krat"), k(":", ":", "deljeno"), k("="), k("≠"), k("≈"),
      k("<"), k(">"), k("≤"), k("≥"), k("±"), k("( )", "(@)", "oklepaj"),
      k("x²", "²", "na kvadrat"), k("x³", "³", "na kub"), k("xⁿ", "^(@)", "potenca"),
      k("√", "√(@)", "kvadratni koren"), k("∛", "∛(@)", "kubični koren"), k("a/b", "(@)/()", "ulomek"),
      k("π"), k("°", "°", "stopinj"), k("%"), k("∞"), k("|x|", "|@|", "absolutna vrednost"),
    ],
  },
  funkcije: {
    name: "Funkcije",
    keys: [
      k("sin", "sin(@)"), k("cos", "cos(@)"), k("tan", "tan(@)"), k("cot", "cot(@)"),
      k("log", "log(@)"), k("ln", "ln(@)"), k("logₐ", "log_(@)()", "logaritem z osnovo"), k("eˣ", "e^(@)"),
      k("f(x)", "f(x)"), k("f⁻¹", "f⁻¹(x)"), k("x₁", "₁", "indeks 1"), k("x₂", "₂", "indeks 2"),
      k("∠", "∠", "kot"), k("⊥", "⊥", "pravokotno"), k("∥", "∥", "vzporedno"), k("△", "△", "trikotnik"),
      k("→"), k("Δ", "Δ", "sprememba"), k("ℕ"), k("ℤ"), k("ℚ"), k("ℝ"), k("ℂ"), k("∈"), k("∅"),
    ],
  },
  analiza: {
    name: "Analiza",
    keys: [
      k("∫", "∫ (@) dx", "nedoločeni integral"), k("∫ₐᵇ", "∫_(@)^() () dx", "določeni integral"),
      k("d/dx", "d/dx(@)", "odvod"), k("f′", "′", "odvod (črtica)"), k("∂", "∂", "parcialni odvod"),
      k("lim", "lim_(x→@)()", "limita"), k("∑", "∑_(n=1)^∞ ", "vsota"), k("∏", "∏", "produkt"),
      k("→"), k("∞"), k("∇", "∇", "nabla"), k("×", "×", "vektorski produkt"),
      k("vec", "vec(@)", "vektor"), k("‖v‖", "‖@‖", "dolžina vektorja"),
      k("∀"), k("∃"), k("⇒"), k("⇔"), k("∪"), k("∩"), k("⊂"), k("∉"), k("ℂ"), k("ε"),
    ],
  },
  grske: {
    name: "Grške črke",
    keys: ["α", "β", "γ", "δ", "ε", "θ", "λ", "μ", "ν", "π", "ρ", "σ", "τ", "φ", "ω", "Δ", "Σ", "Φ", "Ω"].map((c) => k(c)),
  },
  kemija: {
    name: "Kemija",
    keys: [
      k("→", "→", "reakcija"), k("⇌", "⇌", "ravnotežje"), k("↑", "↑", "plin"), k("↓", "↓", "oborina"),
      ..."₀₁₂₃₄₅₆₇₈₉".split("").map((c) => k(c, c, "indeks")),
      k("⁺", "⁺", "naboj"), k("⁻", "⁻", "naboj"), k("²⁺", "²⁺", "naboj"), k("³⁺", "³⁺", "naboj"), k("²⁻", "²⁻", "naboj"), k("³⁻", "³⁻", "naboj"), k("·", "·", "kristalna voda"),
      k("(s)", "(s)", "trdno"), k("(l)", "(l)", "tekoče"), k("(g)", "(g)", "plinasto"), k("(aq)", "(aq)", "raztopljeno v vodi"), k("ΔH", "ΔH", "reakcijska entalpija"), k("°C"),
    ],
  },
};

/** Vrstni red skupin glede na stopnjo (OS, SS, FAKS iz public/stopnja.js) in predmet. */
export function groupOrder(level, subject) {
  const chem = subject === "KEM";
  if (level === "FAKS") return chem ? ["kemija", "analiza", "osnovno", "funkcije", "grske"] : ["analiza", "osnovno", "funkcije", "grske", "kemija"];
  if (level === "SS") return chem ? ["kemija", "osnovno", "funkcije", "grske", "analiza"] : ["osnovno", "funkcije", "grske", "analiza", "kemija"];
  return chem ? ["kemija", "osnovno", "grske"] : ["osnovno", "grske", "kemija"];
}

/** Skupine v Σ po vrsti. Kjer je zavihek »Kem« (hasKem), čipa »Kemija« ni: kemija je že v zavihku, ne dvakrat. */
export function symGroups(level, subject, hasKem = false) {
  const order = groupOrder(level, subject);
  return [...order, ...Object.keys(GROUPS).filter((g) => !order.includes(g))].filter((g) => !(hasKem && g === "kemija"));
}

// Kemijske formule: števke za simbolom elementa ali zaklepajem → indeksi (2H2O → 2H₂O, Ca(OH)2 → Ca(OH)₂).
// Naboj na koncu (Fe3+, Na+, SO4 2-) → nadpisano (Fe³⁺, Na⁺, SO₄²⁻). Ostalo besedilo ostane.
const ELEMENTS = new Set(
  "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr".split(" "),
);
const SUB = "₀₁₂₃₄₅₆₇₈₉";
const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", "+": "⁺", "-": "⁻", "−": "⁻" };
const sub = (n) => [...n].map((d) => SUB[d]).join("");
const sup = (n) => [...n].map((c) => SUP[c]).join("");

// En del formule (brez koeficienta): samo pravi simboli elementov, oklepaji in števke.
function formulaPart(f) {
  if (!/^(?:[A-Z][a-z]?|[()\[\]]|\d)+$/.test(f) || /^\d/.test(f)) return null;
  const syms = f.match(/[A-Z][a-z]?/g) || [];
  if (!syms.length || !syms.every((x) => ELEMENTS.has(x))) return null;
  return f.replace(/([A-Za-z)\]])(\d+)/g, (_, a, n) => a + sub(n));
}

function chemWord(word) {
  const m = /^(.*?)([?!.,;:]*)$/.exec(word);
  let [, core, tail] = m;
  // naboj: Fe3+, Na+, Cl-
  let charge = "";
  const c = /^(.*?[A-Za-z)\]])(\d?[+\-−])$/.exec(core);
  if (c) [, core, charge] = c;
  const parts = core.split("·").map((p) => {
    const coef = /^\d*/.exec(p)[0];
    const f = formulaPart(p.slice(coef.length));
    return f === null ? null : coef + f;
  });
  if (parts.some((p) => p === null)) return null;
  const out = parts.join("·");
  if (out === core && !charge) return null; // nič za pretvoriti
  return out + sup(charge) + tail;
}

export function chemFormat(text) {
  const words = String(text || "").split(/(\s+)/);
  return words
    .map((w, i) => {
      // samostojen naboj za formulo: »SO4 2-«
      if (/^\d?[+\-−]$/.test(w) && /^\d/.test(w) && i >= 2 && chemWord(words[i - 2]) !== null) return sup(w);
      return chemWord(w) ?? w;
    })
    .join("")
    .replace(/(\S)\s+([²³]?[⁺⁻])(?=\s|$)/g, "$1$2");
}
