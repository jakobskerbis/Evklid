// Indija: izpitne naloge iz kemije (CBSE, ICSE/ISC, državne šole, JEE, NEET), angleško in hindijsko.
// Vsak generator ima langs: ["en", "hi"] in gen(level, r, topic, lang); besedila z L = bi(lang).
// Vsi pravilni odgovori so izračunani v kodi: izenačenost enačb se preveri ob nalaganju, oblike molekul
// iz VSEPR (H = ½(V + M − C + A)), vezni red iz zaporedja MO, nesparjeni elektroni iz števila d-elektronov,
// vrstni redi iz tabel NCERT. Možnosti in razlage napak so navadno besedilo (Unicode), brez $…$.
import { en, num, numM as numM0, task, choiceWhy, bi, roundToL } from "./exam-util.js";
import { gcd } from "../check.js";

// numM brez šuma plavajoče vejice (22.400000000000002 → 22.4).
const tidy = (x) => (typeof x === "number" ? +x.toPrecision(12) : x);
const numM = (v, d, list) => numM0(tidy(v), d, list.map(([x, w]) => [tidy(x), w]));

const T = (slug) => `KEM-EXB/${slug}`;
const ce = (s) => `$\\mathrm{${s}}$`;
const NAMES = [["Aarav", "आरव"], ["Priya", "प्रिया"], ["Rohan", "रोहन"], ["Ananya", "अनन्या"], ["Kabir", "कबीर"], ["Meera", "मीरा"], ["Ishaan", "ईशान"], ["Diya", "दीया"]];
const gcdAll = (a) => a.reduce((g, x) => gcd(g, x));
const sum = (a) => a.reduce((s, x) => s + x, 0);

// Mini zapis formul (H_2O, Fe^{3+}, sp^3d^2) → Unicode za možnosti in razlage napak.
const SUB = { 0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄", 5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉" };
const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", "+": "⁺", "-": "⁻" };
const remap = (s, t) => [...s].map((c) => t[c] ?? c).join("");
const uc = (s) =>
  String(s)
    .replace(/_\{([^}]*)\}|_(\d+)/g, (_, a, b) => remap(a ?? b, SUB))
    .replace(/\^\{([^}]*)\}|\^([+\-\d])/g, (_, a, b) => remap(a ?? b, SUP))
    .replace(/\\rightarrow/g, "→")
    .replace(/\\equiv ?/g, "≡")
    .replace(/\\cdot ?/g, "·")
    .replace(/[{}]/g, "");

// Opcije za razvrščanje: pravilna, obrnjena, dodatne (npr. »naivni« vrstni red) in zamenjani sosednji pari.
// sorted: oznake v pravilnem vrstnem redu; pairWhy(a, b): zakaj je par (a, b) zamenjan.
function orderChoice(r, sorted, sep, revWhy, pairWhy, extra = []) {
  const s = (a) => a.map(uc).join(` ${sep} `);
  const correct = s(sorted);
  const cand = [...extra.map(([a, w]) => [s(a), w]), [s([...sorted].reverse()), revWhy]];
  for (const i of r.shuffle([...Array(sorted.length - 1).keys()])) {
    const a = [...sorted];
    [a[i], a[i + 1]] = [a[i + 1], a[i]];
    cand.push([s(a), pairWhy(sorted[i], sorted[i + 1])]);
  }
  const seen = new Set([correct]);
  const wrong = cand.filter(([t]) => !seen.has(t) && seen.add(t)).slice(0, 3);
  return choiceWhy(r, correct, wrong);
}

// ---------- Kemijske enačbe: razčlenitev formul in preverjanje izenačenosti ----------
function atoms(f) {
  const s = f.replace(/[_{}]/g, "");
  let i = 0;
  const group = () => {
    const m = {};
    while (i < s.length && s[i] !== ")") {
      let sub;
      if (s[i] === "(") {
        i++;
        sub = group();
        i++;
      } else {
        const e = /^[A-Z][a-z]?/.exec(s.slice(i));
        if (!e) throw new Error(`Neznana formula: ${f}`);
        sub = { [e[0]]: 1 };
        i += e[0].length;
      }
      const d = /^\d*/.exec(s.slice(i))[0];
      i += d.length;
      for (const k in sub) m[k] = (m[k] || 0) + sub[k] * (d ? +d : 1);
    }
    return m;
  };
  return group();
}
function tally(side, coefs) {
  const t = {};
  side.forEach(([f], j) => {
    for (const [e, n] of Object.entries(atoms(f))) t[e] = (t[e] || 0) + n * coefs[j];
  });
  return t;
}
// Prvi neizenačeni element [simbol, levo, desno] ali null.
function unbalancedEl(o, c) {
  const nr = o.re.length;
  const a = tally(o.re, c.slice(0, nr));
  const b = tally(o.pr, c.slice(nr));
  for (const e of Object.keys({ ...a, ...b })) if ((a[e] || 0) !== (b[e] || 0)) return [e, a[e] || 0, b[e] || 0];
  return null;
}
// rx("2H_2 + O_2 -> 2H_2O"): izenačena enačba z najmanjšimi celimi koeficienti (preverjeno).
function rx(s, extra = {}) {
  const side = (t) =>
    t.split(" + ").map((x) => {
      const m = /^(\d*)(.+)$/.exec(x.trim());
      return [m[2], m[1] ? +m[1] : 1];
    });
  const [a, b] = s.split(" -> ");
  const o = { re: side(a), pr: side(b), ...extra };
  o.all = [...o.re, ...o.pr];
  o.coef = o.all.map((x) => x[1]);
  if (unbalancedEl(o, o.coef) || gcdAll(o.coef) !== 1) throw new Error(`Neizenačena enačba: ${s}`);
  return o;
}
const eqTex = (o, c = o.coef) => {
  const nr = o.re.length;
  const side = (arr, off) => arr.map(([f], j) => `${c && c[off + j] > 1 ? c[off + j] : ""}${f}`).join(" + ");
  return `\\mathrm{${side(o.re, 0)} \\rightarrow ${side(o.pr, nr)}}`;
};
const skelTex = (o) => eqTex(o, null);
const isElement = (f) => Object.keys(atoms(f)).length === 1;
// Štetje atomov v izenačeni enačbi (vrstica rešitve).
function atomLine(o) {
  const nr = o.re.length;
  const a = tally(o.re, o.coef.slice(0, nr));
  const b = tally(o.pr, o.coef.slice(nr));
  return Object.keys(a)
    .map((e) => `$\\mathrm{${e}}: ${a[e]} = ${b[e]}$`)
    .join(", ");
}

const RX = {
  h2o: rx("2H_2 + O_2 -> 2H_2O", { t: "comb" }),
  mgo: rx("2Mg + O_2 -> 2MgO", { t: "comb" }),
  caoh: rx("CaO + H_2O -> Ca(OH)_2", { t: "comb" }),
  nh3: rx("N_2 + 3H_2 -> 2NH_3", { t: "comb" }),
  al2o3: rx("4Al + 3O_2 -> 2Al_2O_3", { t: "comb" }),
  nacl: rx("2Na + Cl_2 -> 2NaCl", { t: "comb" }),
  so3: rx("2SO_2 + O_2 -> 2SO_3", { t: "comb" }),
  nh4cl: rx("NH_3 + HCl -> NH_4Cl", { t: "comb" }),
  caco3: rx("CaCO_3 -> CaO + CO_2", { t: "dec", d: "heat" }),
  feso4: rx("2FeSO_4 -> Fe_2O_3 + SO_2 + SO_3", { t: "dec", d: "heat" }),
  pbno3: rx("2Pb(NO_3)_2 -> 2PbO + 4NO_2 + O_2", { t: "dec", d: "heat" }),
  kclo3: rx("2KClO_3 -> 2KCl + 3O_2", { t: "dec", d: "heat" }),
  nahco3: rx("2NaHCO_3 -> Na_2CO_3 + H_2O + CO_2", { t: "dec", d: "heat" }),
  hgo: rx("2HgO -> 2Hg + O_2", { t: "dec", d: "heat" }),
  agcl: rx("2AgCl -> 2Ag + Cl_2", { t: "dec", d: "light" }),
  agbr: rx("2AgBr -> 2Ag + Br_2", { t: "dec", d: "light" }),
  elw: rx("2H_2O -> 2H_2 + O_2", { t: "dec", d: "elec" }),
  elnacl: rx("2NaCl -> 2Na + Cl_2", { t: "dec", d: "elec", molten: "NaCl" }),
  elal: rx("2Al_2O_3 -> 4Al + 3O_2", { t: "dec", d: "elec", molten: "Al_2O_3" }),
  fecu: rx("Fe + CuSO_4 -> FeSO_4 + Cu", { t: "disp" }),
  zncu: rx("Zn + CuSO_4 -> ZnSO_4 + Cu", { t: "disp" }),
  cuag: rx("Cu + 2AgNO_3 -> Cu(NO_3)_2 + 2Ag", { t: "disp" }),
  pbcu: rx("Pb + CuCl_2 -> PbCl_2 + Cu", { t: "disp" }),
  znh: rx("Zn + H_2SO_4 -> ZnSO_4 + H_2", { t: "disp" }),
  alhcl: rx("2Al + 6HCl -> 2AlCl_3 + 3H_2", { t: "disp" }),
  therm: rx("2Al + Fe_2O_3 -> Al_2O_3 + 2Fe", { t: "disp" }),
  baso4: rx("Na_2SO_4 + BaCl_2 -> BaSO_4 + 2NaCl", { t: "dd" }),
  pbi2: rx("Pb(NO_3)_2 + 2KI -> PbI_2 + 2KNO_3", { t: "dd" }),
  agno3: rx("AgNO_3 + NaCl -> AgCl + NaNO_3", { t: "dd" }),
  neut: rx("NaOH + HCl -> NaCl + H_2O", { t: "dd" }),
  cuoh: rx("CuSO_4 + 2NaOH -> Cu(OH)_2 + Na_2SO_4", { t: "dd" }),
  feoh: rx("FeCl_3 + 3NaOH -> Fe(OH)_3 + 3NaCl", { t: "dd" }),
  caco3p: rx("Na_2CO_3 + CaCl_2 -> CaCO_3 + 2NaCl", { t: "dd" }),
  feh2o: rx("3Fe + 4H_2O -> Fe_3O_4 + 4H_2"),
  mno2: rx("MnO_2 + 4HCl -> MnCl_2 + 2H_2O + Cl_2"),
  c3h8: rx("C_3H_8 + 5O_2 -> 3CO_2 + 4H_2O"),
  c2h6: rx("2C_2H_6 + 7O_2 -> 4CO_2 + 6H_2O"),
  fe2o3co: rx("Fe_2O_3 + 3CO -> 2Fe + 3CO_2"),
  zns: rx("2ZnS + 3O_2 -> 2ZnO + 2SO_2"),
  naw: rx("2Na + 2H_2O -> 2NaOH + H_2"),
  rust: rx("4Fe + 3O_2 -> 2Fe_2O_3"),
  ch4: rx("CH_4 + 2O_2 -> CO_2 + 2H_2O"),
  mgco2: rx("2Mg + CO_2 -> 2MgO + C"),
  pbs: rx("2PbS + 3O_2 -> 2PbO + 2SO_2"),
  hgs: rx("2HgS + 3O_2 -> 2HgO + 2SO_2"),
  cu2s: rx("2Cu_2S + 3O_2 -> 2Cu_2O + 2SO_2"),
  znco3: rx("ZnCO_3 -> ZnO + CO_2"),
  feco3: rx("FeCO_3 -> FeO + CO_2"),
  cuo: rx("CuO + H_2 -> Cu + H_2O"),
  zno: rx("ZnO + C -> Zn + CO"),
  pbo: rx("PbO + C -> Pb + CO"),
  h2s: rx("H_2S + Cl_2 -> 2HCl + S"),
};

const RTYPE = {
  comb: ["combination reaction", "संयोजन अभिक्रिया"],
  dec: ["decomposition reaction", "वियोजन अभिक्रिया"],
  disp: ["displacement reaction", "विस्थापन अभिक्रिया"],
  dd: ["double displacement reaction", "द्विविस्थापन अभिक्रिया"],
};
const DECO = {
  heat: ["thermal decomposition", "ऊष्मीय वियोजन", "heat", "ऊष्मा"],
  light: ["photolytic decomposition (by light)", "प्रकाश द्वारा वियोजन", "light (sunlight)", "प्रकाश (सूर्य का प्रकाश)"],
  elec: ["electrolytic decomposition (electrolysis)", "विद्युत अपघटन (विद्युत धारा द्वारा वियोजन)", "electric current", "विद्युत धारा"],
};
// Redoks: [enačba, oksidirana snov, reducirana snov, zakaj oksidirana (en, hi), zakaj reducirana (en, hi)].
const REDOX = [
  [RX.cuo, "H_2", "CuO", ["gains oxygen and becomes H₂O", "ऑक्सीजन ग्रहण करके H₂O बनता है"], ["loses oxygen and becomes Cu", "ऑक्सीजन खोकर Cu बनता है"]],
  [RX.zno, "C", "ZnO", ["gains oxygen and becomes CO", "ऑक्सीजन ग्रहण करके CO बनता है"], ["loses oxygen and becomes Zn", "ऑक्सीजन खोकर Zn बनता है"]],
  [RX.pbo, "C", "PbO", ["gains oxygen and becomes CO", "ऑक्सीजन ग्रहण करके CO बनता है"], ["loses oxygen and becomes Pb", "ऑक्सीजन खोकर Pb बनता है"]],
  [RX.fe2o3co, "CO", "Fe_2O_3", ["gains oxygen and becomes CO₂", "ऑक्सीजन ग्रहण करके CO₂ बनता है"], ["loses oxygen and becomes Fe", "ऑक्सीजन खोकर Fe बनता है"]],
  [RX.mno2, "HCl", "MnO_2", ["loses hydrogen and becomes Cl₂", "हाइड्रोजन खोकर Cl₂ बनता है"], ["loses oxygen and becomes MnCl₂", "ऑक्सीजन खोकर MnCl₂ बनता है"]],
  [RX.therm, "Al", "Fe_2O_3", ["gains oxygen and becomes Al₂O₃", "ऑक्सीजन ग्रहण करके Al₂O₃ बनता है"], ["loses oxygen and becomes Fe", "ऑक्सीजन खोकर Fe बनता है"]],
  [RX.h2s, "H_2S", "Cl_2", ["loses hydrogen and becomes S", "हाइड्रोजन खोकर S बनता है"], ["gains hydrogen and becomes HCl", "हाइड्रोजन ग्रहण करके HCl बनता है"]],
  [RX.mgco2, "Mg", "CO_2", ["gains oxygen and becomes MgO", "ऑक्सीजन ग्रहण करके MgO बनता है"], ["loses oxygen and becomes C", "ऑक्सीजन खोकर C बनता है"]],
  [RX.fecu, "Fe", "CuSO_4", ["loses electrons: Fe → Fe²⁺", "इलेक्ट्रॉन खोता है: Fe → Fe²⁺"], ["its Cu²⁺ ions gain electrons: Cu²⁺ → Cu", "इसके Cu²⁺ आयन इलेक्ट्रॉन ग्रहण करते हैं: Cu²⁺ → Cu"]],
  [RX.zncu, "Zn", "CuSO_4", ["loses electrons: Zn → Zn²⁺", "इलेक्ट्रॉन खोता है: Zn → Zn²⁺"], ["its Cu²⁺ ions gain electrons: Cu²⁺ → Cu", "इसके Cu²⁺ आयन इलेक्ट्रॉन ग्रहण करते हैं: Cu²⁺ → Cu"]],
];
// Gorivo za popolno gorenje: [formula, ime (en), ime (hi), kontekst (en), kontekst (hi)].
const FUELS = [
  ["C_3H_8", "propane", "प्रोपेन", "a fuel in LPG cylinders", "LPG सिलिंडर का एक ईंधन"],
  ["C_4H_{10}", "butane", "ब्यूटेन", "the main gas in LPG used in Indian kitchens", "भारतीय रसोई में प्रयुक्त LPG की मुख्य गैस"],
  ["C_5H_{12}", "pentane", "पेन्टेन", "a component of petrol", "पेट्रोल का एक घटक"],
  ["C_6H_{14}", "hexane", "हेक्सेन", "a component of petrol", "पेट्रोल का एक घटक"],
  ["C_7H_{16}", "heptane", "हेप्टेन", "a component of petrol", "पेट्रोल का एक घटक"],
  ["C_8H_{18}", "octane", "ऑक्टेन", "a component of petrol", "पेट्रोल का एक घटक"],
  ["C_2H_4", "ethene", "एथीन", "a gaseous hydrocarbon", "एक गैसीय हाइड्रोकार्बन"],
  ["C_3H_6", "propene", "प्रोपीन", "a gaseous hydrocarbon", "एक गैसीय हाइड्रोकार्बन"],
  ["C_2H_2", "ethyne", "एथाइन", "the gas used in welding torches", "वेल्डिंग में प्रयुक्त गैस"],
  ["CH_3OH", "methanol", "मेथेनॉल", "a liquid fuel", "एक द्रव ईंधन"],
  ["C_2H_5OH", "ethanol", "एथेनॉल", "the alcohol blended into petrol in India", "भारत में पेट्रोल में मिलाया जाने वाला ऐल्कोहॉल"],
  ["C_6H_6", "benzene", "बेन्ज़ीन", "an aromatic hydrocarbon", "एक ऐरोमैटिक हाइड्रोकार्बन"],
  ["C_6H_{12}O_6", "glucose", "ग्लूकोस", "the fuel of respiration", "श्वसन का ईंधन"],
];
// Popolno gorenje CcHhOo: koeficienti [gorivo, O2, CO2, H2O] z najmanjšimi celimi števili.
function combustion(f) {
  const a = atoms(f);
  const c = a.C || 0,
    h = a.H || 0,
    o = a.O || 0;
  const k = [4, 4 * c + h - 2 * o, 4 * c, 2 * h];
  const g = gcdAll(k);
  return { c, h, o, k: k.map((x) => x / g), one: [1, (4 * c + h - 2 * o) / 4, c, h / 2] };
}

// ---------- Kovine in nekovine ----------
const METAL = {
  Na: ["Sodium", "सोडियम"],
  K: ["Potassium", "पोटैशियम"],
  Ca: ["Calcium", "कैल्सियम"],
  Mg: ["Magnesium", "मैग्नीशियम"],
  Al: ["Aluminium", "ऐलुमिनियम"],
  Zn: ["Zinc", "ज़िंक"],
  Fe: ["Iron", "लोहा"],
  Pb: ["Lead", "सीसा"],
  Cu: ["Copper", "ताँबा"],
  Hg: ["Mercury", "पारा"],
  Ag: ["Silver", "चाँदी"],
  Au: ["Gold", "सोना"],
};
// Izpodrivanje iz raztopin soli (NCERT, vrstni red reaktivnosti).
const DISP_M = ["Mg", "Al", "Zn", "Fe", "Pb", "Cu", "Ag"];
const SALT = { Mg: "MgSO_4", Al: "Al_2(SO_4)_3", Zn: "ZnSO_4", Fe: "FeSO_4", Pb: "Pb(NO_3)_2", Cu: "CuSO_4", Ag: "AgNO_3" };
// Pridobivanje (NCERT 10, sl. 3.10): 0 elektroliza taline, 1 redukcija z ogljikom, 2 samo segrevanje, 3 samorodna.
const EXTR = { Na: 0, K: 0, Ca: 0, Mg: 0, Al: 0, Zn: 1, Fe: 1, Pb: 1, Cu: 2, Hg: 2, Au: 3 };
const EL_NAME = {
  Li: ["lithium", "लीथियम"],
  Na: ["sodium", "सोडियम"],
  Mg: ["magnesium", "मैग्नीशियम"],
  Al: ["aluminium", "ऐलुमिनियम"],
  K: ["potassium", "पोटैशियम"],
  Ca: ["calcium", "कैल्सियम"],
  N: ["nitrogen", "नाइट्रोजन"],
  O: ["oxygen", "ऑक्सीजन"],
  F: ["fluorine", "फ्लुओरीन"],
  S: ["sulphur", "सल्फर"],
  Cl: ["chlorine", "क्लोरीन"],
};
const ZOF = { Li: 3, N: 7, O: 8, F: 9, Na: 11, Mg: 12, Al: 13, S: 16, Cl: 17, K: 19, Ca: 20 };
const ION_EL = Object.keys(EL_NAME).map((s) => [s, ZOF[s]]);
// Ionske spojine: [formula, kation, št. kationov, naboj, anion, št. anionov, naboj].
const IONIC = [
  ["NaCl", "Na", 1, 1, "Cl", 1, 1],
  ["MgCl_2", "Mg", 1, 2, "Cl", 2, 1],
  ["CaCl_2", "Ca", 1, 2, "Cl", 2, 1],
  ["MgO", "Mg", 1, 2, "O", 1, 2],
  ["CaO", "Ca", 1, 2, "O", 1, 2],
  ["Na_2O", "Na", 2, 1, "O", 1, 2],
  ["K_2O", "K", 2, 1, "O", 1, 2],
  ["K_2S", "K", 2, 1, "S", 1, 2],
  ["Li_2O", "Li", 2, 1, "O", 1, 2],
  ["Al_2O_3", "Al", 2, 3, "O", 3, 2],
  ["AlF_3", "Al", 1, 3, "F", 3, 1],
  ["CaF_2", "Ca", 1, 2, "F", 2, 1],
  ["Mg_3N_2", "Mg", 3, 2, "N", 2, 3],
];
for (const [f, c, nc, qc, a, na, qa] of IONIC) {
  const at = atoms(f);
  if (at[c] !== nc || at[a] !== na || nc * qc !== na * qa) throw new Error(`Napačna ionska spojina ${f}`);
}
// Rude: [formula, ime (en), ime (hi), enačba, praženje?].
const ORES = [
  ["ZnCO_3", "Calamine", "कैलामाइन", RX.znco3, false],
  ["ZnS", "Zinc blende", "ज़िंक ब्लेंड", RX.zns, true],
  ["PbS", "Galena", "गैलेना", RX.pbs, true],
  ["FeCO_3", "Siderite", "सिडेराइट", RX.feco3, false],
  ["HgS", "Cinnabar", "सिनेबार", RX.hgs, true],
  ["Cu_2S", "Copper glance", "कॉपर ग्लांस", RX.cu2s, true],
];

// ---------- Periodni sistem ----------
// Lupine (K, L, M, N) za Z ≤ 20.
function shells(Z) {
  const s = [];
  let left = Z;
  for (const cap of [2, 8, 8, 18]) {
    if (left <= 0) break;
    s.push(Math.min(cap, left));
    left -= cap;
  }
  return s;
}
function posOf(Z) {
  const sh = shells(Z);
  const ve = sh[sh.length - 1];
  return { sh, ve, period: sh.length, group: Z === 2 ? 18 : ve <= 2 ? ve : ve + 10, val: ve <= 4 ? ve : 8 - ve };
}
// NCERT (razred 11, pogl. 3): atomski polmer (pm), elektronegativnost (Pauling), 1. ionizacijska entalpija (kJ/mol).
const PT = {
  Li: { r: 152, en: 1.0, ie: 520 },
  Be: { r: 111, en: 1.5, ie: 899 },
  B: { r: 88, en: 2.0, ie: 801 },
  C: { r: 77, en: 2.5, ie: 1086 },
  N: { r: 74, en: 3.0, ie: 1402 },
  O: { r: 66, en: 3.5, ie: 1314 },
  F: { r: 64, en: 4.0, ie: 1681 },
  Na: { r: 186, en: 0.9, ie: 496 },
  Mg: { r: 160, en: 1.2, ie: 737 },
  Al: { r: 143, en: 1.5, ie: 577 },
  Si: { r: 117, en: 1.8, ie: 786 },
  P: { r: 110, en: 2.1, ie: 1012 },
  S: { r: 104, en: 2.5, ie: 999 },
  Cl: { r: 99, en: 3.0, ie: 1256 },
  K: { r: 231 },
  Rb: { r: 244 },
  Cs: { r: 262 },
  Br: { r: 114, en: 2.8 },
  I: { r: 133, en: 2.5 },
};
const SERIES = { P2: ["Li", "Be", "B", "C", "N", "O", "F"], P3: ["Na", "Mg", "Al", "Si", "P", "S", "Cl"], G1: ["Li", "Na", "K", "Rb", "Cs"], G17: ["F", "Cl", "Br", "I"] };
const IE_EX = {
  P2: [
    { pair: ["Be", "B"], why: ["B loses a 2p electron, which is shielded by the filled 2s and easier to remove than the 2s electron of Be, so Be > B.", "B एक 2p इलेक्ट्रॉन खोता है, जो भरे हुए 2s से परिरक्षित है और Be के 2s इलेक्ट्रॉन से आसानी से निकलता है, इसलिए Be > B।"] },
    { pair: ["N", "O"], why: ["N has a stable half-filled 2p³ configuration; in O one 2p orbital holds a pair whose repulsion makes removal easier, so N > O.", "N का 2p³ अर्धपूर्ण विन्यास स्थायी है; O के एक 2p कक्षक में युग्म है जिसका प्रतिकर्षण इलेक्ट्रॉन निकालना आसान करता है, इसलिए N > O।"] },
  ],
  P3: [
    { pair: ["Mg", "Al"], why: ["Al loses a 3p electron, which is shielded by the filled 3s and easier to remove than the 3s electron of Mg, so Mg > Al.", "Al एक 3p इलेक्ट्रॉन खोता है, जो भरे हुए 3s से परिरक्षित है और Mg के 3s इलेक्ट्रॉन से आसानी से निकलता है, इसलिए Mg > Al।"] },
    { pair: ["P", "S"], why: ["P has a stable half-filled 3p³ configuration; in S one 3p orbital holds a pair whose repulsion makes removal easier, so P > S.", "P का 3p³ अर्धपूर्ण विन्यास स्थायी है; S के एक 3p कक्षक में युग्म है जिसका प्रतिकर्षण इलेक्ट्रॉन निकालना आसान करता है, इसलिए P > S।"] },
  ],
};
// Entalpija sprejema elektrona (kJ/mol, NCERT tabela 3.7).
const EG = { F: -328, Cl: -349, Br: -325, I: -295, O: -141, S: -200 };
const EG_SETS = [
  ["F", "Cl", "Br", "I"],
  ["F", "Cl", "Br"],
  ["F", "Cl", "I"],
  ["O", "S", "F", "Cl"],
  ["O", "S", "Cl"],
  ["O", "F", "Cl", "Br"],
  ["S", "Cl", "O"],
];
const ISO = [["N^{3-}", 7], ["O^{2-}", 8], ["F^-", 9], ["Na^+", 11], ["Mg^{2+}", 12], ["Al^{3+}", 13]];

// ---------- Kemijska vez ----------
// VSEPR: [formula, osrednji atom, valenčni e⁻ (V), enovalentni ligandi (M), atomi O (D), naboj q].
// H = ½(V + M − q) (q z znakom), vezni pari = M + D, osamljeni pari = H − (M + D).
const MOLS = [
  ["CH_4", "C", 4, 4, 0, 0],
  ["CCl_4", "C", 4, 4, 0, 0],
  ["NH_3", "N", 5, 3, 0, 0],
  ["NF_3", "N", 5, 3, 0, 0],
  ["PCl_3", "P", 5, 3, 0, 0],
  ["H_2O", "O", 6, 2, 0, 0],
  ["H_2S", "S", 6, 2, 0, 0],
  ["BF_3", "B", 3, 3, 0, 0],
  ["BCl_3", "B", 3, 3, 0, 0],
  ["BeCl_2", "Be", 2, 2, 0, 0],
  ["CO_2", "C", 4, 0, 2, 0],
  ["SO_2", "S", 6, 0, 2, 0],
  ["SO_3", "S", 6, 0, 3, 0],
  ["NH_4^+", "N", 5, 4, 0, 1],
  ["H_3O^+", "O", 6, 3, 0, 1],
  ["BF_4^-", "B", 3, 4, 0, -1],
  ["NO_3^-", "N", 5, 0, 3, -1],
  ["CO_3^{2-}", "C", 4, 0, 3, -2],
  ["NO_2^-", "N", 5, 0, 2, -1],
  ["NO_2^+", "N", 5, 0, 2, 1],
  ["SO_4^{2-}", "S", 6, 0, 4, -2],
  ["ClO_3^-", "Cl", 7, 0, 3, -1],
  ["PCl_5", "P", 5, 5, 0, 0],
  ["SF_6", "S", 6, 6, 0, 0],
  ["SF_4", "S", 6, 4, 0, 0],
  ["ClF_3", "Cl", 7, 3, 0, 0],
  ["XeF_2", "Xe", 8, 2, 0, 0],
  ["XeF_4", "Xe", 8, 4, 0, 0],
  ["BrF_5", "Br", 7, 5, 0, 0],
  ["XeO_3", "Xe", 8, 0, 3, 0],
  ["XeOF_4", "Xe", 8, 4, 1, 0],
  ["I_3^-", "I", 7, 2, 0, -1],
  ["ICl_4^-", "I", 7, 4, 0, -1],
  ["PCl_6^-", "P", 5, 6, 0, -1],
  ["SiF_6^{2-}", "Si", 4, 6, 0, -2],
].map(([f, c, V, M, D, q]) => {
  const H = (V + M - q) / 2;
  return { f, c, V, M, D, q, H, bp: M + D, lp: H - M - D };
});
const MOL = Object.fromEntries(MOLS.map((m) => [m.f, m]));
const SHAPE = {
  "2,0": ["linear", "रैखिक"],
  "3,0": ["trigonal planar", "त्रिकोणीय समतलीय"],
  "2,1": ["bent (V-shaped)", "बंकित (V-आकृति)"],
  "4,0": ["tetrahedral", "चतुष्फलकीय"],
  "3,1": ["trigonal pyramidal", "त्रिकोणीय पिरैमिडी"],
  "2,2": ["bent (V-shaped)", "बंकित (V-आकृति)"],
  "5,0": ["trigonal bipyramidal", "त्रिकोणीय द्विपिरैमिडी"],
  "4,1": ["see-saw", "सी-सॉ आकृति"],
  "3,2": ["T-shaped", "T-आकृति"],
  "2,3": ["linear", "रैखिक"],
  "6,0": ["octahedral", "अष्टफलकीय"],
  "5,1": ["square pyramidal", "वर्ग पिरैमिडी"],
  "4,2": ["square planar", "वर्ग समतलीय"],
};
const HYB = { 2: "sp", 3: "sp^2", 4: "sp^3", 5: "sp^3d", 6: "sp^3d^2" };
for (const m of MOLS) if (!Number.isInteger(m.H) || m.lp < 0 || !SHAPE[`${m.bp},${m.lp}`]) throw new Error(`VSEPR: ${m.f}`);
const SIMPLE = ["CH_4", "CCl_4", "NH_3", "NF_3", "PCl_3", "H_2O", "H_2S", "BF_3", "BCl_3", "BeCl_2", "CO_2", "SO_2", "SO_3", "NH_4^+", "H_3O^+"];
const EXPANDED = ["PCl_5", "SF_6", "SF_4", "ClF_3", "XeF_2", "XeF_4", "BrF_5", "XeO_3", "XeOF_4", "I_3^-", "ICl_4^-", "PCl_6^-", "SiF_6^{2-}", "ClO_3^-", "NO_2^-", "NO_2^+", "NO_3^-", "CO_3^{2-}", "SO_4^{2-}", "BF_4^-"];
// Vezni koti (NCERT): za razvrščanje.
const ANGLE = { BeCl_2: 180, BF_3: 120, CH_4: 109.5, NH_3: 107, H_2O: 104.5 };
// Molekulske orbitale (NCERT 11, pogl. 4): do 14 elektronov π2p pod σ2p, nad 14 σ2p pod π2p.
const MO_LOW = [["\\sigma 1s", 2, 1], ["\\sigma^* 1s", 2, -1], ["\\sigma 2s", 2, 1], ["\\sigma^* 2s", 2, -1], ["\\pi 2p", 4, 1], ["\\sigma 2p", 2, 1], ["\\pi^* 2p", 4, -1], ["\\sigma^* 2p", 2, -1]];
const MO_HIGH = [MO_LOW[0], MO_LOW[1], MO_LOW[2], MO_LOW[3], MO_LOW[5], MO_LOW[4], MO_LOW[6], MO_LOW[7]];
function moFill(ne, high = ne > 14) {
  let left = ne,
    nb = 0,
    na = 0,
    unp = 0;
  const parts = [];
  for (const [name, cap, b] of high ? MO_HIGH : MO_LOW) {
    if (left <= 0) break;
    const e = Math.min(cap, left);
    left -= e;
    if (b > 0) nb += e;
    else na += e;
    unp += cap === 2 ? e % 2 : e <= 2 ? e : 4 - e;
    parts.push(`${name}^{${e}}`);
  }
  return { nb, na, bo: (nb - na) / 2, unp, cfg: parts.join("\\ ") };
}
// Delci: [zapis, število elektronov].
const MO_SP = [
  ["H_2", 2],
  ["H_2^+", 1],
  ["He_2^+", 3],
  ["He_2", 4],
  ["Li_2", 6],
  ["B_2", 10],
  ["C_2", 12],
  ["N_2", 14],
  ["N_2^+", 13],
  ["O_2", 16],
  ["O_2^+", 15],
  ["O_2^-", 17],
  ["O_2^{2-}", 18],
  ["F_2", 18],
];
const DIPOLE_ZERO = ["CO_2", "BF_3", "CH_4", "CCl_4", "BeCl_2", "SF_6", "PCl_5", "XeF_4", "SO_3", "BCl_3", "XeF_2"];
const DIPOLE_POLAR = ["H_2O", "NH_3", "SO_2", "NF_3", "ClF_3", "SF_4", "H_2S", "PCl_3", "BrF_5", "CHCl_3", "CH_3Cl"];

// ---------- Organska kemija: imena in izomerija ----------
const FG = {
  alcohol: ["alcohol", "ऐल्कोहॉल", "the –OH group", "–OH समूह"],
  aldehyde: ["aldehyde", "ऐल्डिहाइड", "the –CHO group at the end of the chain", "शृंखला के सिरे पर –CHO समूह"],
  ketone: ["ketone", "कीटोन", "a >C=O group between two carbon atoms", "दो कार्बन परमाणुओं के बीच >C=O समूह"],
  acid: ["carboxylic acid", "कार्बोक्सिलिक अम्ल", "the –COOH group", "–COOH समूह"],
  halo: ["haloalkane", "हैलोऐल्केन", "a halogen atom (–X)", "हैलोजन परमाणु (–X)"],
  ester: ["ester", "एस्टर", "a –COO– group between two carbon groups", "दो कार्बन समूहों के बीच –COO– समूह"],
  amine: ["amine", "ऐमीन", "the –NH₂ group on an alkyl carbon", "ऐल्किल कार्बन पर –NH₂ समूह"],
  ether: ["ether", "ईथर", "an –O– atom between two carbon atoms", "दो कार्बन परमाणुओं के बीच –O– परमाणु"],
  amide: ["amide", "ऐमाइड", "the –CONH₂ group", "–CONH₂ समूह"],
};
const FG_CONF = {
  alcohol: ["ether", "aldehyde", "acid"],
  aldehyde: ["ketone", "acid", "alcohol"],
  ketone: ["aldehyde", "ester", "ether"],
  acid: ["ester", "aldehyde", "alcohol"],
  halo: ["alcohol", "amine", "ether"],
  ester: ["acid", "ether", "ketone"],
  amine: ["amide", "alcohol", "halo"],
  ether: ["alcohol", "ester", "ketone"],
  amide: ["amine", "acid", "ester"],
};
const FG_COMP = [
  ["CH_3CH_2OH", "alcohol"],
  ["CH_3CH(OH)CH_3", "alcohol"],
  ["CH_3CHO", "aldehyde"],
  ["CH_3CH_2CHO", "aldehyde"],
  ["CH_3COCH_3", "ketone"],
  ["CH_3COCH_2CH_3", "ketone"],
  ["CH_3COOH", "acid"],
  ["CH_3CH_2COOH", "acid"],
  ["CH_3CH_2Cl", "halo"],
  ["CH_3CH_2CH_2Br", "halo"],
  ["CH_3COOCH_2CH_3", "ester"],
  ["HCOOCH_3", "ester"],
  ["CH_3CH_2NH_2", "amine"],
  ["CH_3OCH_3", "ether"],
  ["CH_3CH_2OCH_2CH_3", "ether"],
  ["CH_3CONH_2", "amide"],
];
const ALKANES = {
  4: ["butane", "ब्यूटेन", ["butane", "2-methylpropane"]],
  5: ["pentane", "पेन्टेन", ["pentane", "2-methylbutane", "2,2-dimethylpropane"]],
  6: ["hexane", "हेक्सेन", ["hexane", "2-methylpentane", "3-methylpentane", "2,2-dimethylbutane", "2,3-dimethylbutane"]],
  7: ["heptane", "हेप्टेन", ["heptane", "2-methylhexane", "3-methylhexane", "2,2-dimethylpentane", "2,3-dimethylpentane", "2,4-dimethylpentane", "3,3-dimethylpentane", "3-ethylpentane", "2,2,3-trimethylbutane"]],
};
// Stopnja nenasičenosti: imenovane spojine.
const DOU_NAMED = [
  ["C_6H_6", "benzene", "बेन्ज़ीन"],
  ["C_2H_4", "ethene", "एथीन"],
  ["C_2H_2", "ethyne", "एथाइन"],
  ["C_6H_{12}", "cyclohexane", "साइक्लोहेक्सेन"],
  ["C_6H_{10}", "cyclohexene", "साइक्लोहेक्सीन"],
  ["C_7H_8", "toluene", "टॉलूईन"],
  ["C_{10}H_8", "naphthalene", "नैफ्थलीन"],
  ["C_7H_6O_2", "benzoic acid", "बेन्ज़ोइक अम्ल"],
  ["C_5H_5N", "pyridine", "पिरिडीन"],
  ["C_6H_5Cl", "chlorobenzene", "क्लोरोबेन्ज़ीन"],
  ["C_3H_6O", "propanone", "प्रोपेनोन"],
  ["C_8H_8", "styrene", "स्टाइरीन"],
  ["C_6H_7N", "aniline", "ऐनिलीन"],
  ["C_6H_5NO_2", "nitrobenzene", "नाइट्रोबेन्ज़ीन"],
  ["C_2H_3N", "ethanenitrile", "एथेननाइट्राइल"],
];
const HALO = ["F", "Cl", "Br", "I"];
function dou(f) {
  const a = atoms(f);
  const x = HALO.reduce((s, e) => s + (a[e] || 0), 0);
  return { C: a.C || 0, H: a.H || 0, N: a.N || 0, O: a.O || 0, X: x, d: (a.C || 0) - ((a.H || 0) + x) / 2 + (a.N || 0) / 2 + 1 };
}
// Homologne vrste: [ime en, ime hi, prvi člen (en), prvi člen (hi), C prvega člena, M(k) za k C-atomov, splošna formula].
const HOMO = {
  alkane: ["alkane", "ऐल्केन", "methane", "मेथेन", 1, (k) => 14 * k + 2, "C_nH_{2n+2}"],
  alcohol: ["alcohol", "ऐल्कोहॉल", "methanol", "मेथेनॉल", 1, (k) => 14 * k + 18, "C_nH_{2n+1}OH"],
  aldehyde: ["aldehyde", "ऐल्डिहाइड", "methanal", "मेथेनैल", 1, (k) => 14 * k + 16, "C_nH_{2n}O"],
  acid: ["carboxylic acid", "कार्बोक्सिलिक अम्ल", "methanoic acid", "मेथेनोइक अम्ल", 1, (k) => 14 * k + 32, "C_nH_{2n}O_2"],
  alkene: ["alkene", "ऐल्कीन", "ethene", "एथीन", 2, (k) => 14 * k, "C_nH_{2n}"],
  alkyne: ["alkyne", "ऐल्काइन", "ethyne", "एथाइन", 2, (k) => 14 * k - 2, "C_nH_{2n-2}"],
  ketone: ["ketone", "कीटोन", "propanone", "प्रोपेनोन", 3, (k) => 14 * k + 16, "C_nH_{2n}O"],
};
// IUPAC: [strukturna formula, pravilno ime, [[napačno ime, zakaj (en), zakaj (hi)], …]].
const IUPAC2 = [
  ["CH_3CH_2CH(CH_3)CH_3", "2-methylbutane", [["3-methylbutane", "Number the chain from the end nearer the branch: the methyl group gets locant 2.", "शृंखला को शाखा के निकट वाले सिरे से क्रमांकित कीजिए: मेथिल समूह को स्थान-अंक 2 मिलता है।"], ["pentane", "The chain is branched: the longest chain has 4 carbon atoms.", "शृंखला शाखित है: सबसे लंबी शृंखला में 4 कार्बन हैं।"], ["isopentane", "That is the common name, not the IUPAC name.", "यह साधारण नाम है, IUPAC नाम नहीं।"]]],
  ["CH_3CH(OH)CH_3", "propan-2-ol", [["propan-1-ol", "The –OH group is on the middle carbon (C-2), not on C-1.", "–OH समूह बीच वाले कार्बन (C-2) पर है, C-1 पर नहीं।"], ["propanol", "The position of the –OH group must be given.", "–OH समूह का स्थान बताना आवश्यक है।"], ["propan-2-one", "The suffix -one is for a ketone (C=O); here there is an –OH group.", "-one प्रत्यय कीटोन (C=O) के लिए है; यहाँ –OH समूह है।"]]],
  ["CH_3CH_2CHO", "propanal", [["propanone", "Propanone is a ketone (C=O inside the chain); –CHO at the end is an aldehyde.", "प्रोपेनोन कीटोन है (शृंखला के भीतर C=O); सिरे पर –CHO ऐल्डिहाइड है।"], ["propan-1-ol", "The suffix -ol is for an alcohol (–OH).", "-ol प्रत्यय ऐल्कोहॉल (–OH) के लिए है।"], ["propanoic acid", "Propanoic acid has a –COOH group, not –CHO.", "प्रोपेनोइक अम्ल में –COOH समूह होता है, –CHO नहीं।"]]],
  ["CH_3COCH_2CH_3", "butan-2-one", [["butanal", "Butanal has –CHO at the end of the chain; here C=O is inside the chain.", "ब्यूटेनैल में –CHO शृंखला के सिरे पर है; यहाँ C=O शृंखला के भीतर है।"], ["butan-3-one", "Number from the end nearer the C=O group: locant 2, not 3.", "C=O समूह के निकट वाले सिरे से क्रमांकन कीजिए: स्थान-अंक 2, 3 नहीं।"], ["butan-2-ol", "The suffix -ol is for an alcohol; a C=O group inside the chain needs -one.", "-ol प्रत्यय ऐल्कोहॉल के लिए है; शृंखला के भीतर C=O के लिए -one।"]]],
  ["CH_2=CHCH_2CH_3", "but-1-ene", [["but-3-ene", "The double bond must get the lowest locant: 1, not 3.", "द्विआबंध को सबसे छोटा स्थान-अंक मिलना चाहिए: 1, 3 नहीं।"], ["butane", "There is a C=C double bond, so the suffix is -ene.", "इसमें C=C द्विआबंध है, इसलिए प्रत्यय -ene है।"], ["but-2-ene", "The double bond is between C-1 and C-2.", "द्विआबंध C-1 और C-2 के बीच है।"]]],
  ["CH_3C\\equiv CH", "propyne", [["propene", "There is a C≡C triple bond, so the suffix is -yne.", "इसमें C≡C त्रिआबंध है, इसलिए प्रत्यय -yne है।"], ["prop-2-yne", "The triple bond must get the lowest locant; for propyne no locant is needed.", "त्रिआबंध को सबसे छोटा स्थान-अंक मिलना चाहिए; प्रोपाइन में स्थान-अंक की आवश्यकता नहीं।"], ["propane", "Propane has only single bonds.", "प्रोपेन में केवल एकल आबंध हैं।"]]],
  ["CH_3CH(Cl)CH_2CH_3", "2-chlorobutane", [["3-chlorobutane", "Number from the end nearer Cl: locant 2.", "Cl के निकट वाले सिरे से क्रमांकन कीजिए: स्थान-अंक 2।"], ["1-chlorobutane", "Cl is on C-2, not on the end carbon.", "Cl, C-2 पर है, सिरे वाले कार्बन पर नहीं।"], ["2-chloropropane", "The chain has 4 carbon atoms: butane.", "शृंखला में 4 कार्बन हैं: ब्यूटेन।"]]],
  ["CH_3CH_2COOH", "propanoic acid", [["ethanoic acid", "The carbon of –COOH is part of the chain: 3 carbon atoms in total.", "–COOH का कार्बन भी शृंखला में गिना जाता है: कुल 3 कार्बन।"], ["propanal", "Propanal is an aldehyde (–CHO); this compound has –COOH.", "प्रोपेनैल ऐल्डिहाइड (–CHO) है; इस यौगिक में –COOH है।"], ["butanoic acid", "Count again: there are only 3 carbon atoms.", "फिर से गिनिए: केवल 3 कार्बन परमाणु हैं।"]]],
  ["CH_3COOCH_2CH_3", "ethyl ethanoate", [["methyl propanoate", "The acid part CH₃COO– has 2 carbons (ethanoate) and the alkyl part is ethyl.", "अम्ल भाग CH₃COO– में 2 कार्बन हैं (एथेनोएट) और ऐल्किल भाग एथिल है।"], ["ethyl methanoate", "The acid part CH₃COO– has 2 carbons: ethanoate, not methanoate.", "अम्ल भाग CH₃COO– में 2 कार्बन हैं: एथेनोएट, मेथेनोएट नहीं।"], ["butanoic acid", "Butanoic acid has a –COOH group; here –COO– joins two carbon groups (ester).", "ब्यूटेनोइक अम्ल में –COOH है; यहाँ –COO– दो कार्बन समूहों को जोड़ता है (एस्टर)।"]]],
  ["CH_3CH_2NH_2", "ethanamine", [["methanamine", "There are 2 carbon atoms: ethan-.", "इसमें 2 कार्बन परमाणु हैं: एथेन-।"], ["ethanamide", "An amide has –CONH₂; here –NH₂ is on an alkyl carbon.", "ऐमाइड में –CONH₂ होता है; यहाँ –NH₂ ऐल्किल कार्बन पर है।"], ["ethanenitrile", "A nitrile has –C≡N; here there is –NH₂.", "नाइट्राइल में –C≡N होता है; यहाँ –NH₂ है।"]]],
  ["CH_3CH_2CH_2CH_2OH", "butan-1-ol", [["butan-4-ol", "Number from the end nearer –OH: locant 1.", "–OH के निकट वाले सिरे से क्रमांकन कीजिए: स्थान-अंक 1।"], ["butan-2-ol", "The –OH group is on the end carbon (C-1).", "–OH समूह सिरे वाले कार्बन (C-1) पर है।"], ["butanal", "Butanal is an aldehyde (–CHO); this compound has –OH.", "ब्यूटेनैल ऐल्डिहाइड (–CHO) है; इस यौगिक में –OH है।"]]],
  ["CH_3CH(CH_3)CH_2CH_2CH_3", "2-methylpentane", [["4-methylpentane", "Number from the end nearer the branch: locant 2.", "शाखा के निकट वाले सिरे से क्रमांकन कीजिए: स्थान-अंक 2।"], ["2-methylbutane", "The longest chain has 5 carbon atoms: pentane.", "सबसे लंबी शृंखला में 5 कार्बन हैं: पेन्टेन।"], ["hexane", "The chain is branched; hexane is the straight-chain isomer.", "शृंखला शाखित है; हेक्सेन सीधी शृंखला वाला समावयवी है।"]]],
];
const IUPAC3 = [
  ["(CH_3)_3CCH_2CH_3", "2,2-dimethylbutane", [["3,3-dimethylbutane", "Number from the end nearer the branches: locants 2,2.", "शाखाओं के निकट वाले सिरे से क्रमांकन कीजिए: स्थान-अंक 2,2।"], ["2-ethyl-2-methylpropane", "Choose the longest chain: it has 4 carbons (the ethyl group is part of it).", "सबसे लंबी शृंखला चुनिए: इसमें 4 कार्बन हैं (एथिल समूह उसी का भाग है)।"], ["2,2-methylbutane", "Two identical substituents need the prefix di-: dimethyl.", "दो समान प्रतिस्थापियों के लिए उपसर्ग di- चाहिए: dimethyl।"]]],
  ["CH_3CH(CH_3)CH(CH_3)CH_3", "2,3-dimethylbutane", [["1,2,3-trimethylpropane", "Methyl groups on the end carbons are part of the longest chain (4 carbons).", "सिरे वाले कार्बनों पर मेथिल समूह सबसे लंबी शृंखला (4 कार्बन) का भाग हैं।"], ["2,3-methylbutane", "Two identical substituents need the prefix di-: dimethyl.", "दो समान प्रतिस्थापियों के लिए उपसर्ग di- चाहिए: dimethyl।"], ["2-methylpentane", "2-Methylpentane has a 5-carbon chain; here the longest chain has 4.", "2-मेथिलपेन्टेन में 5 कार्बन की शृंखला है; यहाँ सबसे लंबी शृंखला में 4 हैं।"]]],
  ["CH_3CH_2CH(CH_2CH_3)CH_2CH_3", "3-ethylpentane", [["1,1-diethylpropane", "Choose the longest chain: 5 carbons, with an ethyl group on C-3.", "सबसे लंबी शृंखला चुनिए: 5 कार्बन, C-3 पर एथिल समूह।"], ["3-methylhexane", "Every longest chain here has only 5 carbon atoms.", "यहाँ हर सबसे लंबी शृंखला में केवल 5 कार्बन हैं।"], ["2-ethylpentane", "The ethyl group is on the middle carbon, C-3.", "एथिल समूह बीच वाले कार्बन C-3 पर है।"]]],
  ["CH_3CH(CH_3)CH(OH)CH_3", "3-methylbutan-2-ol", [["2-methylbutan-3-ol", "The –OH group (principal group) must get the lower locant: 2.", "–OH समूह (मुख्य समूह) को छोटा स्थान-अंक मिलना चाहिए: 2।"], ["3-methylbutan-1-ol", "The –OH group is on C-2, not on the end carbon.", "–OH समूह C-2 पर है, सिरे वाले कार्बन पर नहीं।"], ["1,2-dimethylpropan-1-ol", "The longest chain containing C–OH has 4 carbons.", "C–OH वाली सबसे लंबी शृंखला में 4 कार्बन हैं।"]]],
  ["CH_2=CHCH_2OH", "prop-2-en-1-ol", [["prop-1-en-3-ol", "The –OH group is the principal group and gets the lowest locant (1).", "–OH मुख्य समूह है और उसे सबसे छोटा स्थान-अंक (1) मिलता है।"], ["propenal", "Propenal is an aldehyde (–CHO); this compound has –OH.", "प्रोपीनैल ऐल्डिहाइड (–CHO) है; इस यौगिक में –OH है।"], ["propan-1-ol", "There is also a C=C double bond: -en- must appear in the name.", "इसमें C=C द्विआबंध भी है: नाम में -en- आना चाहिए।"]]],
  ["CH_3CH(CH_3)CH_2COOH", "3-methylbutanoic acid", [["2-methylbutanoic acid", "Numbering starts at the –COOH carbon (C-1), so the methyl group is on C-3.", "क्रमांकन –COOH कार्बन (C-1) से शुरू होता है, इसलिए मेथिल C-3 पर है।"], ["3-methylbutanal", "The suffix -al is for –CHO; this compound has –COOH.", "-al प्रत्यय –CHO के लिए है; इस यौगिक में –COOH है।"], ["4-methylbutanoic acid", "A methyl on the last carbon would simply lengthen the chain; the branch is on C-3.", "अंतिम कार्बन पर मेथिल शृंखला को ही लंबा कर देगा; शाखा C-3 पर है।"]]],
  ["CH_3CH_2CH(CH_3)CHO", "2-methylbutanal", [["3-methylbutanal", "The –CHO carbon is C-1, so the methyl group is on C-2.", "–CHO कार्बन C-1 है, इसलिए मेथिल समूह C-2 पर है।"], ["2-ethylpropanal", "The longest chain containing –CHO has 4 carbons.", "–CHO वाली सबसे लंबी शृंखला में 4 कार्बन हैं।"], ["pentanal", "The chain is branched; pentanal is the straight-chain isomer.", "शृंखला शाखित है; पेन्टेनैल सीधी शृंखला वाला समावयवी है।"]]],
  ["CH_3CH(Br)CH(CH_3)CH_3", "2-bromo-3-methylbutane", [["3-bromo-2-methylbutane", "Both numberings give locants {2, 3}; then the substituent first in alphabetical order (bromo) gets the lower number.", "दोनों क्रमांकनों से स्थान-अंक {2, 3} मिलते हैं; तब वर्णक्रम में पहले आने वाले (bromo) को छोटा अंक मिलता है।"], ["2-methyl-3-bromobutane", "Prefixes are written in alphabetical order: bromo before methyl.", "उपसर्ग वर्णक्रम में लिखे जाते हैं: bromo, methyl से पहले।"], ["1-bromo-1,2-dimethylpropane", "The longest chain has 4 carbon atoms: butane.", "सबसे लंबी शृंखला में 4 कार्बन हैं: ब्यूटेन।"]]],
  ["ClCH_2CH_2CH(CH_3)CH_3", "1-chloro-3-methylbutane", [["4-chloro-2-methylbutane", "The locant set {1, 3} is lower than {2, 4}.", "स्थान-अंक समुच्चय {1, 3}, {2, 4} से छोटा है।"], ["1-chloro-2-methylbutane", "The methyl group is on C-3 when Cl is on C-1.", "जब Cl, C-1 पर है तब मेथिल समूह C-3 पर है।"], ["3-methyl-1-chlorobutane", "Prefixes are written in alphabetical order: chloro before methyl.", "उपसर्ग वर्णक्रम में लिखे जाते हैं: chloro, methyl से पहले।"]]],
  ["CH_3CH_2COCH_2CH_3", "pentan-3-one", [["pentan-2-one", "The C=O group is on the middle carbon, C-3.", "C=O समूह बीच वाले कार्बन C-3 पर है।"], ["pentanal", "Pentanal has –CHO at the end of the chain; here C=O is inside the chain.", "पेन्टेनैल में –CHO सिरे पर है; यहाँ C=O शृंखला के भीतर है।"], ["diethyl ketone", "That is the common name, not the IUPAC name.", "यह साधारण नाम है, IUPAC नाम नहीं।"]]],
  ["CH_2=C(CH_3)CH_2CH_3", "2-methylbut-1-ene", [["2-ethylprop-1-ene", "The longest chain containing the double bond has 4 carbons.", "द्विआबंध वाली सबसे लंबी शृंखला में 4 कार्बन हैं।"], ["3-methylbut-3-ene", "The double bond must get the lowest locant (1).", "द्विआबंध को सबसे छोटा स्थान-अंक (1) मिलना चाहिए।"], ["2-methylbut-2-ene", "The double bond is between C-1 and C-2.", "द्विआबंध C-1 और C-2 के बीच है।"]]],
];
const ISOTYPE = {
  chain: ["chain isomerism", "शृंखला समावयवता", "Chain isomers differ in the carbon skeleton (straight or branched) but have the same functional group.", "शृंखला समावयवियों में कार्बन ढाँचा (सीधा या शाखित) अलग होता है, प्रकार्यात्मक समूह वही।"],
  position: ["position isomerism", "स्थिति समावयवता", "Position isomers have the same skeleton and group, but the group sits at a different position.", "स्थिति समावयवियों में ढाँचा और समूह वही होते हैं, पर समूह का स्थान अलग होता है।"],
  functional: ["functional group isomerism", "प्रकार्यात्मक समूह समावयवता", "Functional isomers have different functional groups.", "प्रकार्यात्मक समूह समावयवियों में प्रकार्यात्मक समूह अलग होते हैं।"],
  metamer: ["metamerism", "मध्यावयवता", "Metamers have the same functional group but different alkyl groups on either side of it.", "मध्यावयवियों में प्रकार्यात्मक समूह वही होता है, पर उसके दोनों ओर के ऐल्किल समूह अलग होते हैं।"],
};
const ISOPAIRS = [
  ["butane", "2-methylpropane", "chain"],
  ["pentane", "2,2-dimethylpropane", "chain"],
  ["butan-1-ol", "2-methylpropan-1-ol", "chain"],
  ["propan-1-ol", "propan-2-ol", "position"],
  ["but-1-ene", "but-2-ene", "position"],
  ["1-chlorobutane", "2-chlorobutane", "position"],
  ["propanal", "propanone", "functional"],
  ["ethanol", "methoxymethane", "functional"],
  ["ethanoic acid", "methyl methanoate", "functional"],
  ["ethoxyethane", "1-methoxypropane", "metamer"],
  ["ethoxyethane", "2-methoxypropane", "metamer"],
  ["N-ethylethanamine", "N-methylpropan-1-amine", "metamer"],
];
// Število izomer (s seznamom imen): [formula, razred (en), razred (hi), imena, napaka [vrednost, en, hi]].
const ISOCOUNT = [
  ["C_4H_{10}O", "alcohols", "ऐल्कोहॉल", ["butan-1-ol", "butan-2-ol", "2-methylpropan-1-ol", "2-methylpropan-2-ol"], [7, "The 3 ethers also have this formula, but only alcohols were asked.", "3 ईथरों का भी यही सूत्र है, पर केवल ऐल्कोहॉल पूछे गए हैं।"]],
  ["C_4H_{10}O", "ethers", "ईथर", ["1-methoxypropane", "2-methoxypropane", "ethoxyethane"], [2, "Do not forget the branched ether 2-methoxypropane.", "शाखित ईथर 2-मेथॉक्सीप्रोपेन को मत भूलिए।"]],
  ["C_4H_{10}O", "structural isomers in total (alcohols and ethers)", "कुल संरचनात्मक समावयवी (ऐल्कोहॉल और ईथर)", ["butan-1-ol", "butan-2-ol", "2-methylpropan-1-ol", "2-methylpropan-2-ol", "1-methoxypropane", "2-methoxypropane", "ethoxyethane"], [4, "You counted only the alcohols; 3 ethers have the same formula.", "आपने केवल ऐल्कोहॉल गिने; 3 ईथरों का भी यही सूत्र है।"]],
  ["C_3H_8O", "structural isomers in total", "कुल संरचनात्मक समावयवी", ["propan-1-ol", "propan-2-ol", "methoxyethane"], [2, "Do not forget the ether CH₃OCH₂CH₃.", "ईथर CH₃OCH₂CH₃ को मत भूलिए।"]],
  ["C_5H_{12}O", "alcohols", "ऐल्कोहॉल", ["pentan-1-ol", "pentan-2-ol", "pentan-3-ol", "2-methylbutan-1-ol", "3-methylbutan-1-ol", "2-methylbutan-2-ol", "3-methylbutan-2-ol", "2,2-dimethylpropan-1-ol"], [3, "3 is the number of C₅ skeletons; each skeleton gives several alcohols.", "3 तो C₅ ढाँचों की संख्या है; प्रत्येक ढाँचे से कई ऐल्कोहॉल बनते हैं।"]],
  ["C_4H_9Cl", "structural isomers", "संरचनात्मक समावयवी", ["1-chlorobutane", "2-chlorobutane", "1-chloro-2-methylpropane", "2-chloro-2-methylpropane"], [2, "Each C₄ skeleton gives two isomers: count the different positions of Cl.", "प्रत्येक C₄ ढाँचे से दो समावयवी बनते हैं: Cl के अलग-अलग स्थान गिनिए।"]],
  ["C_5H_{10}O", "aldehydes", "ऐल्डिहाइड", ["pentanal", "2-methylbutanal", "3-methylbutanal", "2,2-dimethylpropanal"], [7, "Ketones also have this formula, but only aldehydes were asked.", "कीटोनों का भी यही सूत्र है, पर केवल ऐल्डिहाइड पूछे गए हैं।"]],
  ["C_5H_{10}O", "ketones", "कीटोन", ["pentan-2-one", "pentan-3-one", "3-methylbutan-2-one"], [2, "Do not forget the branched ketone 3-methylbutan-2-one.", "शाखित कीटोन 3-मेथिलब्यूटेन-2-ओन को मत भूलिए।"]],
  ["C_4H_{11}N", "amines in total (1°, 2° and 3°)", "कुल ऐमीन (1°, 2° और 3°)", ["butan-1-amine", "butan-2-amine", "2-methylpropan-1-amine", "2-methylpropan-2-amine", "N-methylpropan-1-amine", "N-methylpropan-2-amine", "N-ethylethanamine", "N,N-dimethylethanamine"], [4, "You counted only the primary amines; add the secondary and tertiary ones.", "आपने केवल प्राथमिक ऐमीन गिने; द्वितीयक और तृतीयक भी जोड़िए।"]],
  ["C_4H_{11}N", "primary amines", "प्राथमिक ऐमीन", ["butan-1-amine", "butan-2-amine", "2-methylpropan-1-amine", "2-methylpropan-2-amine"], [8, "Only primary amines (–NH₂) were asked, not secondary or tertiary.", "केवल प्राथमिक ऐमीन (–NH₂) पूछे गए हैं, द्वितीयक या तृतीयक नहीं।"]],
  ["C_5H_{10}O_2", "carboxylic acids", "कार्बोक्सिलिक अम्ल", ["pentanoic acid", "2-methylbutanoic acid", "3-methylbutanoic acid", "2,2-dimethylpropanoic acid"], [3, "Count the branched acid 2,2-dimethylpropanoic acid too.", "शाखित अम्ल 2,2-डाइमेथिलप्रोपेनोइक अम्ल भी गिनिए।"]],
];
const ORD = (n) => `${n}${n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th"}`;
// Hindijski vrstilni števniki v odvisniku (»के … सदस्य«).
const ORD_HI = (n) => ({ 1: "पहले", 2: "दूसरे", 3: "तीसरे", 4: "चौथे", 5: "पाँचवें", 6: "छठे", 7: "सातवें", 8: "आठवें", 9: "नौवें", 10: "दसवें" })[n];
const formulaCk = (k, H, rest = "") => `C${k > 1 ? `_{${k}}` : ""}H_{${H}}${rest}`;

// ---------- Organske reakcije (NCERT 12) ----------
// Imenske reakcije: [vprašanje (en), vprašanje (hi), pogoji (TeX), pravilni produkt, [[napačni, zakaj (en), zakaj (hi)], …], razlaga (en), razlaga (hi)].
const NAMED = [
  ["the Reimer–Tiemann reaction of phenol", "फ़ीनॉल की राइमर–टीमन अभिक्रिया", "\\mathrm{C_6H_5OH \\xrightarrow{CHCl_3,\\ aq.\\ NaOH;\\ H^+}}", "salicylaldehyde (2-hydroxybenzaldehyde)",
    [["salicylic acid (2-hydroxybenzoic acid)", "The acid forms in Kolbe's reaction with CO₂; CHCl₃ + NaOH introduces a –CHO group.", "अम्ल कोल्बे अभिक्रिया (CO₂) में बनता है; CHCl₃ + NaOH से –CHO समूह आता है।"], ["benzaldehyde", "The –OH group of phenol stays; –CHO enters the ortho position.", "फ़ीनॉल का –OH समूह बना रहता है; –CHO ऑर्थो स्थिति पर आता है।"], ["chlorobenzene", "CHCl₃ does not replace –OH by Cl; it introduces a –CHO group.", "CHCl₃, –OH को Cl से प्रतिस्थापित नहीं करता; यह –CHO समूह लाता है।"]],
    "CHCl₃ and aqueous NaOH introduce a –CHO group at the ortho position of phenol.", "CHCl₃ और जलीय NaOH फ़ीनॉल की ऑर्थो स्थिति पर –CHO समूह लाते हैं।"],
  ["Kolbe's reaction (sodium phenoxide heated with CO₂ under pressure, then acidified)", "कोल्बे अभिक्रिया (सोडियम फ़ीनॉक्साइड को दाब पर CO₂ के साथ गर्म करके अम्लीकरण)", "\\mathrm{C_6H_5ONa \\xrightarrow{CO_2,\\ 4-7\\ atm,\\ 400\\ K;\\ H^+}}", "salicylic acid (2-hydroxybenzoic acid)",
    [["salicylaldehyde (2-hydroxybenzaldehyde)", "The aldehyde forms in the Reimer–Tiemann reaction with CHCl₃; CO₂ gives a –COOH group.", "ऐल्डिहाइड राइमर–टीमन अभिक्रिया (CHCl₃) में बनता है; CO₂ से –COOH समूह आता है।"], ["benzoic acid", "The –OH group stays on the ring; –COOH enters ortho to it.", "–OH समूह वलय पर बना रहता है; –COOH उसकी ऑर्थो स्थिति पर आता है।"], ["aspirin (acetylsalicylic acid)", "Aspirin needs a further acetylation with acetic anhydride.", "ऐस्पिरिन के लिए आगे ऐसीटिक ऐनहाइड्राइड से ऐसीटिलन चाहिए।"]],
    "CO₂ adds at the ortho position of the phenoxide ion; acidification gives 2-hydroxybenzoic acid.", "CO₂ फ़ीनॉक्साइड आयन की ऑर्थो स्थिति पर जुड़ता है; अम्लीकरण से 2-हाइड्रॉक्सीबेन्ज़ोइक अम्ल बनता है।"],
  ["the Etard reaction of toluene", "टॉलूईन की इटार्ड अभिक्रिया", "\\mathrm{C_6H_5CH_3 \\xrightarrow{CrO_2Cl_2,\\ CS_2;\\ H_3O^+}}", "benzaldehyde (C₆H₅CHO)",
    [["benzoic acid (C₆H₅COOH)", "Strong oxidants such as KMnO₄ give the acid; chromyl chloride stops at the aldehyde.", "KMnO₄ जैसे प्रबल ऑक्सीकारक अम्ल देते हैं; क्रोमिल क्लोराइड ऐल्डिहाइड पर रुक जाता है।"], ["benzyl alcohol (C₆H₅CH₂OH)", "The methyl group is oxidised to –CHO, not just to –CH₂OH.", "मेथिल समूह –CHO तक ऑक्सीकृत होता है, केवल –CH₂OH तक नहीं।"], ["benzyl chloride (C₆H₅CH₂Cl)", "Side-chain chlorination needs Cl₂ in light; CrO₂Cl₂ oxidises the CH₃ group.", "पार्श्व शृंखला क्लोरीनन के लिए प्रकाश में Cl₂ चाहिए; CrO₂Cl₂, CH₃ समूह का ऑक्सीकरण करता है।"]],
    "Chromyl chloride oxidises the –CH₃ group to a chromium complex, which on hydrolysis gives –CHO.", "क्रोमिल क्लोराइड –CH₃ समूह को एक क्रोमियम संकुल में बदलता है, जिसके जल-अपघटन से –CHO बनता है।"],
  ["the Rosenmund reduction of benzoyl chloride", "बेन्ज़ॉयल क्लोराइड का रोज़ेनमुंड अपचयन", "\\mathrm{C_6H_5COCl \\xrightarrow{H_2,\\ Pd-BaSO_4}}", "benzaldehyde (C₆H₅CHO)",
    [["benzyl alcohol (C₆H₅CH₂OH)", "BaSO₄ poisons the Pd catalyst, so reduction stops at the aldehyde.", "BaSO₄ उत्प्रेरक Pd को विषाक्त करता है, इसलिए अपचयन ऐल्डिहाइड पर रुक जाता है।"], ["toluene (C₆H₅CH₃)", "The poisoned catalyst cannot reduce the C=O group further.", "विषाक्त उत्प्रेरक C=O समूह को आगे अपचयित नहीं कर सकता।"], ["benzoic acid (C₆H₅COOH)", "That is the product of hydrolysis, not of hydrogenation.", "यह जल-अपघटन का उत्पाद है, हाइड्रोजनन का नहीं।"]],
    "H₂ over Pd poisoned with BaSO₄ reduces –COCl to –CHO and stops there.", "BaSO₄ से विषाक्त Pd पर H₂, –COCl को –CHO तक अपचयित करके रुक जाता है।"],
  ["the Gattermann–Koch reaction of benzene", "बेन्ज़ीन की गाटरमान–कोख अभिक्रिया", "\\mathrm{C_6H_6 \\xrightarrow{CO,\\ HCl,\\ anhyd.\\ AlCl_3/CuCl}}", "benzaldehyde (C₆H₅CHO)",
    [["benzoyl chloride (C₆H₅COCl)", "CO + HCl act like HCOCl; the group that enters the ring is –CHO.", "CO + HCl, HCOCl की तरह कार्य करते हैं; वलय में –CHO समूह आता है।"], ["chlorobenzene (C₆H₅Cl)", "Chlorination needs Cl₂ with FeCl₃; here CO is introduced.", "क्लोरीनन के लिए FeCl₃ के साथ Cl₂ चाहिए; यहाँ CO जुड़ता है।"], ["benzoic acid (C₆H₅COOH)", "No oxidation takes place; the product is the aldehyde.", "कोई ऑक्सीकरण नहीं होता; उत्पाद ऐल्डिहाइड है।"]],
    "CO and HCl with anhydrous AlCl₃/CuCl put a –CHO group on the benzene ring.", "निर्जल AlCl₃/CuCl के साथ CO और HCl बेन्ज़ीन वलय पर –CHO समूह लगाते हैं।"],
  ["the Clemmensen reduction of propanone", "प्रोपेनोन का क्लीमेन्सन अपचयन", "\\mathrm{CH_3COCH_3 \\xrightarrow{Zn-Hg,\\ conc.\\ HCl}}", "propane (CH₃CH₂CH₃)",
    [["propan-2-ol (CH₃CH(OH)CH₃)", "NaBH₄ or LiAlH₄ give the alcohol; Clemmensen reduces >C=O all the way to >CH₂.", "NaBH₄ या LiAlH₄ ऐल्कोहॉल देते हैं; क्लीमेन्सन >C=O को पूरा >CH₂ तक अपचयित करता है।"], ["propene (CH₃CH=CH₂)", "No double bond forms; >C=O becomes >CH₂.", "कोई द्विआबंध नहीं बनता; >C=O, >CH₂ बन जाता है।"], ["2-chloropropane (CH₃CHClCH₃)", "HCl only provides the acidic medium; Cl is not introduced.", "HCl केवल अम्लीय माध्यम देता है; Cl नहीं जुड़ता।"]],
    "Zinc amalgam and conc. HCl reduce the >C=O group to >CH₂.", "ज़िंक अमलगम और सांद्र HCl, >C=O समूह को >CH₂ में अपचयित करते हैं।"],
  ["the Wolff–Kishner reduction of butanone", "ब्यूटेनोन का वोल्फ–किश्नर अपचयन", "\\mathrm{CH_3COCH_2CH_3 \\xrightarrow{NH_2NH_2;\\ KOH,\\ ethylene\\ glycol,\\ \\Delta}}", "butane (CH₃CH₂CH₂CH₃)",
    [["butan-2-ol (CH₃CH(OH)CH₂CH₃)", "Wolff–Kishner reduces >C=O all the way to >CH₂, not to >CH–OH.", "वोल्फ–किश्नर >C=O को पूरा >CH₂ तक अपचयित करता है, >CH–OH तक नहीं।"], ["butanone hydrazone", "The hydrazone is only an intermediate; KOH and heat remove N₂ from it.", "हाइड्राज़ोन केवल मध्यवर्ती है; KOH और ऊष्मा उससे N₂ निकाल देते हैं।"], ["but-2-ene (CH₃CH=CHCH₃)", "No double bond forms; >C=O becomes >CH₂.", "कोई द्विआबंध नहीं बनता; >C=O, >CH₂ बन जाता है।"]],
    "Hydrazine forms the hydrazone; heating with KOH in ethylene glycol releases N₂ and leaves >CH₂.", "हाइड्राज़ीन से हाइड्राज़ोन बनता है; एथिलीन ग्लाइकॉल में KOH के साथ गर्म करने पर N₂ निकलती है और >CH₂ बचता है।"],
  ["the Wurtz reaction of bromoethane", "ब्रोमोएथेन की वुर्ट्ज़ अभिक्रिया", "\\mathrm{2CH_3CH_2Br \\xrightarrow{Na,\\ dry\\ ether}}", "butane (CH₃CH₂CH₂CH₃)",
    [["ethane (CH₃CH₃)", "Wurtz joins two ethyl groups, so the product has 4 carbon atoms.", "वुर्ट्ज़ दो एथिल समूहों को जोड़ता है, इसलिए उत्पाद में 4 कार्बन हैं।"], ["ethene (CH₂=CH₂)", "Elimination needs alcoholic KOH, not sodium.", "विलोपन के लिए ऐल्कोहॉली KOH चाहिए, सोडियम नहीं।"], ["ethanol (CH₃CH₂OH)", "Substitution by –OH needs aqueous KOH, not sodium in dry ether.", "–OH द्वारा प्रतिस्थापन के लिए जलीय KOH चाहिए, शुष्क ईथर में सोडियम नहीं।"]],
    "Sodium in dry ether joins two alkyl groups: 2R–X + 2Na → R–R + 2NaX.", "शुष्क ईथर में सोडियम दो ऐल्किल समूहों को जोड़ता है: 2R–X + 2Na → R–R + 2NaX।"],
  ["the Sandmeyer reaction of benzenediazonium chloride with CuCN/KCN", "बेन्ज़ीनडाइऐज़ोनियम क्लोराइड की CuCN/KCN के साथ सैन्डमायर अभिक्रिया", "\\mathrm{C_6H_5N_2^+Cl^- \\xrightarrow{CuCN/KCN}}", "benzonitrile (C₆H₅CN)",
    [["phenol (C₆H₅OH)", "Phenol forms when the diazonium salt is warmed with water.", "फ़ीनॉल तब बनता है जब डाइऐज़ोनियम लवण को जल के साथ गर्म करते हैं।"], ["benzene (C₆H₆)", "Benzene forms with H₃PO₂ (hypophosphorous acid).", "बेन्ज़ीन H₃PO₂ (हाइपोफ़ॉस्फ़ोरस अम्ल) से बनता है।"], ["chlorobenzene (C₆H₅Cl)", "Chlorobenzene forms with CuCl/HCl.", "क्लोरोबेन्ज़ीन CuCl/HCl से बनता है।"]],
    "The –N₂⁺ group is replaced by –CN, with N₂ released.", "–N₂⁺ समूह –CN से प्रतिस्थापित होता है और N₂ निकलती है।"],
  ["the Sandmeyer reaction of benzenediazonium chloride with CuBr/HBr", "बेन्ज़ीनडाइऐज़ोनियम क्लोराइड की CuBr/HBr के साथ सैन्डमायर अभिक्रिया", "\\mathrm{C_6H_5N_2^+Cl^- \\xrightarrow{CuBr/HBr}}", "bromobenzene (C₆H₅Br)",
    [["phenol (C₆H₅OH)", "Phenol forms when the diazonium salt is warmed with water.", "फ़ीनॉल तब बनता है जब डाइऐज़ोनियम लवण को जल के साथ गर्म करते हैं।"], ["benzonitrile (C₆H₅CN)", "Benzonitrile forms with CuCN/KCN.", "बेन्ज़ोनाइट्राइल CuCN/KCN से बनता है।"], ["2,4,6-tribromoaniline", "That is the product of aniline with bromine water.", "यह ऐनिलीन और ब्रोमीन जल का उत्पाद है।"]],
    "The –N₂⁺ group is replaced by –Br, with N₂ released.", "–N₂⁺ समूह –Br से प्रतिस्थापित होता है और N₂ निकलती है।"],
  ["the Friedel–Crafts acylation of benzene with ethanoyl chloride", "एथेनॉयल क्लोराइड के साथ बेन्ज़ीन का फ्रीडेल–क्राफ्ट्स ऐसिलन", "\\mathrm{C_6H_6 \\xrightarrow{CH_3COCl,\\ anhyd.\\ AlCl_3}}", "acetophenone (C₆H₅COCH₃)",
    [["toluene (C₆H₅CH₃)", "Toluene forms in alkylation with CH₃Cl; an acyl chloride puts a CH₃CO– group on the ring.", "टॉलूईन CH₃Cl के साथ ऐल्किलन में बनता है; ऐसिल क्लोराइड वलय पर CH₃CO– समूह लगाता है।"], ["benzaldehyde (C₆H₅CHO)", "Benzaldehyde forms in the Gattermann–Koch reaction (CO + HCl).", "बेन्ज़ैल्डिहाइड गाटरमान–कोख अभिक्रिया (CO + HCl) में बनता है।"], ["chlorobenzene (C₆H₅Cl)", "Cl does not enter the ring; the electrophile is CH₃CO⁺.", "Cl वलय में नहीं आता; इलेक्ट्रॉनस्नेही CH₃CO⁺ है।"]],
    "AlCl₃ generates the acylium ion CH₃CO⁺, which substitutes on the ring.", "AlCl₃ ऐसिलियम आयन CH₃CO⁺ बनाता है, जो वलय पर प्रतिस्थापन करता है।"],
  ["the Friedel–Crafts alkylation of benzene with chloromethane", "क्लोरोमेथेन के साथ बेन्ज़ीन का फ्रीडेल–क्राफ्ट्स ऐल्किलन", "\\mathrm{C_6H_6 \\xrightarrow{CH_3Cl,\\ anhyd.\\ AlCl_3}}", "toluene (C₆H₅CH₃)",
    [["chlorobenzene (C₆H₅Cl)", "Chlorination needs Cl₂ with FeCl₃; here the electrophile is CH₃⁺.", "क्लोरीनन के लिए FeCl₃ के साथ Cl₂ चाहिए; यहाँ इलेक्ट्रॉनस्नेही CH₃⁺ है।"], ["acetophenone (C₆H₅COCH₃)", "Acetophenone needs an acyl chloride (CH₃COCl).", "ऐसीटोफ़ीनोन के लिए ऐसिल क्लोराइड (CH₃COCl) चाहिए।"], ["benzyl chloride (C₆H₅CH₂Cl)", "Benzyl chloride forms from toluene with Cl₂ in light.", "बेन्ज़िल क्लोराइड प्रकाश में Cl₂ के साथ टॉलूईन से बनता है।"]],
    "AlCl₃ generates the electrophile CH₃⁺, which substitutes on the ring.", "AlCl₃ इलेक्ट्रॉनस्नेही CH₃⁺ बनाता है, जो वलय पर प्रतिस्थापन करता है।"],
  ["the Cannizzaro reaction of benzaldehyde (conc. NaOH)", "बेन्ज़ैल्डिहाइड की कैनिज़ारो अभिक्रिया (सांद्र NaOH)", "\\mathrm{2C_6H_5CHO \\xrightarrow{conc.\\ NaOH}}", "benzyl alcohol + sodium benzoate",
    [["benzyl alcohol only", "One molecule is reduced to the alcohol and the other is oxidised to the carboxylate salt.", "एक अणु ऐल्कोहॉल में अपचयित और दूसरा कार्बोक्सिलेट लवण में ऑक्सीकृत होता है।"], ["sodium benzoate only", "One molecule is oxidised, but the other is reduced to benzyl alcohol.", "एक अणु ऑक्सीकृत होता है, पर दूसरा बेन्ज़िल ऐल्कोहॉल में अपचयित होता है।"], ["an aldol (β-hydroxy aldehyde)", "Aldol reaction needs an α-hydrogen; benzaldehyde has none.", "ऐल्डोल अभिक्रिया के लिए α-हाइड्रोजन चाहिए; बेन्ज़ैल्डिहाइड में नहीं है।"]],
    "Aldehydes without α-hydrogen undergo self oxidation–reduction (disproportionation) with conc. alkali.", "α-हाइड्रोजन रहित ऐल्डिहाइड सांद्र क्षार के साथ स्वयं ऑक्सीकरण–अपचयन (असमानुपातन) करते हैं।"],
  ["the aldol reaction of ethanal with dilute NaOH (cold, no heating)", "तनु NaOH (ठंडे, बिना गर्म किए) के साथ एथेनैल की ऐल्डोल अभिक्रिया", "\\mathrm{2CH_3CHO \\xrightarrow{dil.\\ NaOH}}", "3-hydroxybutanal (CH₃CH(OH)CH₂CHO)",
    [["ethanol + sodium ethanoate", "That is a Cannizzaro reaction, which needs an aldehyde without α-hydrogen; ethanal has α-hydrogens.", "यह कैनिज़ारो अभिक्रिया है, जिसके लिए α-हाइड्रोजन रहित ऐल्डिहाइड चाहिए; एथेनैल में α-हाइड्रोजन हैं।"], ["but-2-enal (CH₃CH=CHCHO)", "The dehydrated product forms only on heating (aldol condensation).", "निर्जलित उत्पाद केवल गर्म करने पर बनता है (ऐल्डोल संघनन)।"], ["ethanoic acid (CH₃COOH)", "No oxidising agent is present.", "कोई ऑक्सीकारक उपस्थित नहीं है।"]],
    "The carbanion from the α-carbon of one ethanal molecule adds to the C=O of another: a β-hydroxy aldehyde forms.", "एक एथेनैल अणु के α-कार्बन से बना कार्बऋणायन दूसरे के C=O पर जुड़ता है: β-हाइड्रॉक्सी ऐल्डिहाइड बनता है।"],
  ["the Hoffmann bromamide degradation of ethanamide", "एथेनैमाइड का हॉफमान ब्रोमैमाइड निम्नीकरण", "\\mathrm{CH_3CONH_2 \\xrightarrow{Br_2,\\ NaOH}}", "methanamine (CH₃NH₂)",
    [["ethanamine (CH₃CH₂NH₂)", "The C=O carbon is lost (as carbonate), so the amine has one carbon fewer.", "C=O कार्बन (कार्बोनेट के रूप में) निकल जाता है, इसलिए ऐमीन में एक कार्बन कम होता है।"], ["ethanenitrile (CH₃CN)", "The nitrile forms on dehydration with P₂O₅, not with Br₂/NaOH.", "नाइट्राइल P₂O₅ से निर्जलन पर बनता है, Br₂/NaOH से नहीं।"], ["ethanoic acid (CH₃COOH)", "Hydrolysis would give the acid; Br₂/NaOH gives a primary amine.", "जल-अपघटन से अम्ल बनता; Br₂/NaOH से प्राथमिक ऐमीन बनती है।"]],
    "RCONH₂ + Br₂ + 4NaOH → RNH₂ + Na₂CO₃ + 2NaBr + 2H₂O: the amine has one carbon fewer.", "RCONH₂ + Br₂ + 4NaOH → RNH₂ + Na₂CO₃ + 2NaBr + 2H₂O: ऐमीन में एक कार्बन कम होता है।"],
];
// Preskusi: [ime, formula, lastnosti]. io = jodoform, al = aldehid (Tollens), fe = Fehling, cls = alkohol 1/2/3, am = amin 1/2/3.
const TESTC = {
  ethanol: ["CH₃CH₂OH", { io: 1, cls: 1 }],
  "propan-2-ol": ["CH₃CH(OH)CH₃", { io: 1, cls: 2 }],
  "butan-2-ol": ["CH₃CH(OH)CH₂CH₃", { io: 1, cls: 2 }],
  methanol: ["CH₃OH", { io: 0, cls: 1 }],
  "propan-1-ol": ["CH₃CH₂CH₂OH", { io: 0, cls: 1 }],
  "butan-1-ol": ["CH₃CH₂CH₂CH₂OH", { io: 0, cls: 1 }],
  "2-methylpropan-2-ol": ["(CH₃)₃COH", { io: 0, cls: 3 }],
  methanal: ["HCHO", { io: 0, al: 1, fe: 1 }],
  ethanal: ["CH₃CHO", { io: 1, al: 1, fe: 1 }],
  propanal: ["CH₃CH₂CHO", { io: 0, al: 1, fe: 1 }],
  benzaldehyde: ["C₆H₅CHO", { io: 0, al: 1, fe: 0 }],
  propanone: ["CH₃COCH₃", { io: 1, al: 0, fe: 0 }],
  "butan-2-one": ["CH₃COCH₂CH₃", { io: 1, al: 0, fe: 0 }],
  "pentan-3-one": ["CH₃CH₂COCH₂CH₃", { io: 0, al: 0, fe: 0 }],
  acetophenone: ["C₆H₅COCH₃", { io: 1, al: 0, fe: 0 }],
  aniline: ["C₆H₅NH₂", { am: 1 }],
  ethanamine: ["CH₃CH₂NH₂", { am: 1 }],
  benzylamine: ["C₆H₅CH₂NH₂", { am: 1 }],
  "N-methylaniline": ["C₆H₅NHCH₃", { am: 2 }],
  "N-ethylethanamine": ["(C₂H₅)₂NH", { am: 2 }],
  "N,N-dimethylaniline": ["C₆H₅N(CH₃)₂", { am: 3 }],
  "N,N-dimethylmethanamine": ["(CH₃)₃N", { am: 3 }],
};
const tcLabel = (n) => `${n} (${TESTC[n][0]})`;
// Amidi za Hoffmannovo razgradnjo: [ime amida, formula amida, ime amina, formula amina].
const AMIDES = [
  ["ethanamide", "CH_3CONH_2", "methanamine", "CH_3NH_2"],
  ["propanamide", "CH_3CH_2CONH_2", "ethanamine", "CH_3CH_2NH_2"],
  ["butanamide", "CH_3(CH_2)_2CONH_2", "propan-1-amine", "CH_3(CH_2)_2NH_2"],
  ["pentanamide", "CH_3(CH_2)_3CONH_2", "butan-1-amine", "CH_3(CH_2)_3NH_2"],
  ["hexanamide", "CH_3(CH_2)_4CONH_2", "pentan-1-amine", "CH_3(CH_2)_4NH_2"],
  ["benzamide", "C_6H_5CONH_2", "aniline", "C_6H_5NH_2"],
];
// Alkilni bromidi za Wurtzovo reakcijo: [ime, formula, št. C].
const RBR = [
  ["bromomethane", "CH_3Br", 1],
  ["bromoethane", "CH_3CH_2Br", 2],
  ["1-bromopropane", "CH_3CH_2CH_2Br", 3],
  ["1-bromobutane", "CH_3(CH_2)_3Br", 4],
];
const ALKN = ["", "methane", "ethane", "propane", "butane", "pentane", "hexane", "heptane", "octane"];
// pKa (NCERT 12): fenoli in karboksilne kisline; pKb amini (NCERT 12, tabela 13.3).
const PKA_PH = { "4-nitrophenol": 7.1, "3-nitrophenol": 8.3, phenol: 10.0, "4-methylphenol": 10.2, ethanol: 15.9 };
const PKA_AC = { "CCl₃COOH": 0.64, "CHCl₂COOH": 1.26, "FCH₂COOH": 2.66, "ClCH₂COOH": 2.86, HCOOH: 3.75, "C₆H₅COOH": 4.19, "CH₃COOH": 4.76, "CH₃CH₂COOH": 4.88 };
const PKB = {
  methyl: { "(CH₃)₂NH": [3.27, 2], "CH₃NH₂": [3.38, 1], "(CH₃)₃N": [4.22, 3], "NH₃": [4.75, 0], "C₆H₅NH₂": [9.38, -1] },
  ethyl: { "(C₂H₅)₂NH": [3.0, 2], "(C₂H₅)₃N": [3.25, 3], "C₂H₅NH₂": [3.29, 1], "NH₃": [4.75, 0], "C₆H₅NH₂": [9.38, -1] },
};

// ---------- Koordinacijske spojine ----------
// Ligandi: [naboj, število donorskih atomov, prevajalno močno polje?].
const LIG = { NH_3: [0, 1], H_2O: [0, 1], CO: [0, 1], en: [0, 2], Cl: [-1, 1], CN: [-1, 1], F: [-1, 1], C_2O_4: [-2, 2], NO_2: [-1, 1] };
// Kompleksi: [kation(i) pred, [kovina, Z, osnova], ligandi [[l, n]], naboj kompleksnega iona, števec za ionom, geometrija, spin].
// Spin po NCERT: CN⁻, en, CO, NH₃ (pri Co³⁺), C₂O₄²⁻ (pri Co³⁺) nizkospinski; F⁻, H₂O visokospinski.
const CPLX = [
  ["K_3", ["Fe", 26, 18], [["CN", 6]], -3, "", "oct", "low"],
  ["K_4", ["Fe", 26, 18], [["CN", 6]], -4, "", "oct", "low"],
  ["K_3", ["Fe", 26, 18], [["F", 6]], -3, "", "oct", "high"],
  ["", ["Fe", 26, 18], [["H_2O", 6]], 3, "Cl_3", "oct", "high"],
  ["", ["Co", 27, 18], [["NH_3", 6]], 3, "Cl_3", "oct", "low"],
  ["K_3", ["Co", 27, 18], [["F", 6]], -3, "", "oct", "high"],
  ["", ["Co", 27, 18], [["en", 3]], 3, "Cl_3", "oct", "low"],
  ["K_3", ["Co", 27, 18], [["C_2O_4", 3]], -3, "", "oct", "low"],
  ["", ["Co", 27, 18], [["NH_3", 5], ["Cl", 1]], 2, "Cl_2", "oct", "low"],
  ["", ["Co", 27, 18], [["NH_3", 4], ["Cl", 2]], 1, "Cl", "oct", "low"],
  ["", ["Cr", 24, 18], [["NH_3", 6]], 3, "Cl_3", "oct", "low"],
  ["K_3", ["Cr", 24, 18], [["C_2O_4", 3]], -3, "", "oct", "high"],
  ["", ["Cr", 24, 18], [["H_2O", 6]], 3, "Cl_3", "oct", "high"],
  ["K_3", ["Mn", 25, 18], [["CN", 6]], -3, "", "oct", "low"],
  ["K_4", ["Mn", 25, 18], [["CN", 6]], -4, "", "oct", "low"],
  ["", ["Mn", 25, 18], [["H_2O", 6]], 2, "SO_4", "oct", "high"],
  ["K_2", ["Ni", 28, 18], [["Cl", 4]], -2, "", "tet", "high"],
  ["K_2", ["Ni", 28, 18], [["CN", 4]], -2, "", "sq", "low"],
  ["", ["Ni", 28, 18], [["CO", 4]], 0, "", "tet", "low"],
  ["", ["Ni", 28, 18], [["NH_3", 6]], 2, "Cl_2", "oct", "high"],
  ["", ["Cu", 29, 18], [["NH_3", 4]], 2, "SO_4", "sq", "low"],
  ["", ["Ti", 22, 18], [["H_2O", 6]], 3, "Cl_3", "oct", "high"],
  ["", ["Zn", 30, 18], [["NH_3", 4]], 2, "SO_4", "tet", "high"],
  ["", ["Pt", 78, 68], [["NH_3", 2], ["Cl", 2]], 0, "", "sq", "low"],
].map(([pre, [M, Z, base], ligs, q, post, geom, spin]) => {
  const ox = q - sum(ligs.map(([l, n]) => LIG[l][0] * n));
  const cn = sum(ligs.map(([l, n]) => LIG[l][1] * n));
  const d = Z - base - ox;
  const hs = d <= 5 ? d : 10 - d;
  const unp = geom === "sq" ? (d === 9 ? 1 : 0) : geom === "oct" && spin === "low" ? [0, 1, 2, 3, 2, 1, 0, 1, 2, 1, 0][d] : hs;
  const inner = `${M}${ligs.map(([l, n]) => `${l === "F" || l === "Cl" ? l : `(${l})`}${n > 1 ? `_${n}` : ""}`).join("")}`;
  const ion = `[${inner}]${q ? `^{${Math.abs(q) > 1 ? Math.abs(q) : ""}${q > 0 ? "+" : "-"}}` : ""}`;
  const comp = `${pre}[${inner}]${post}`;
  const hyb = geom === "tet" ? "sp^3" : geom === "sq" ? "dsp^2" : spin === "low" || d <= 3 ? "d^2sp^3" : "sp^3d^2";
  return { M, Z, base, ligs, q, ox, cn, d, unp, hs, ion, comp, geom, spin, hyb, pre, post };
});
const GEOM = { oct: ["octahedral", "अष्टफलकीय"], tet: ["tetrahedral", "चतुष्फलकीय"], sq: ["square planar", "वर्ग समतलीय"] };
// Wernerjevi kompleksi: [zapis z »·«, koordinacijska formula, ionizirani Cl⁻, število ionov, M (g/mol)].
const WERNER = [
  ["CoCl_3\\cdot 6NH_3", "[Co(NH_3)_6]Cl_3", 3, 4],
  ["CoCl_3\\cdot 5NH_3", "[Co(NH_3)_5Cl]Cl_2", 2, 3],
  ["CoCl_3\\cdot 4NH_3", "[Co(NH_3)_4Cl_2]Cl", 1, 2],
  ["CoCl_3\\cdot 3NH_3", "[Co(NH_3)_3Cl_3]", 0, 0],
  ["CrCl_3\\cdot 6H_2O\\ (\\text{violet})", "[Cr(H_2O)_6]Cl_3", 3, 4],
  ["CrCl_3\\cdot 6H_2O\\ (\\text{grey-green})", "[Cr(H_2O)_5Cl]Cl_2\\cdot H_2O", 2, 3],
  ["CrCl_3\\cdot 6H_2O\\ (\\text{dark green})", "[Cr(H_2O)_4Cl_2]Cl\\cdot 2H_2O", 1, 2],
];
const WMASS = { Co: 59, Cr: 52, Cl: 35.5, N: 14, H: 1, O: 16 };
const wMolar = (f) => {
  // f kot »CoCl_3\cdot 6NH_3«: deli pred in za piko.
  const [a, b = ""] = f.split("\\cdot ").map((x) => x.replace(/\\ \(\\text\{[^}]*\}\)/, ""));
  const m = /^(\d*)(.*)$/.exec(b);
  const t = (x, k = 1) => sum(Object.entries(atoms(x)).map(([e, n]) => WMASS[e] * n * k));
  return t(a) + (m[2] ? t(m[2], m[1] ? +m[1] : 1) : 0);
};
// Ligandi po zobatosti.
const DENT = {
  NO2: ["NO₂⁻", "amb"],
  SCN: ["SCN⁻", "amb"],
  en: ["en (ethane-1,2-diamine)", "bi"],
  ox: ["C₂O₄²⁻ (oxalate)", "bi"],
  edta: ["EDTA⁴⁻", "hexa"],
  NH3: ["NH₃", "mono"],
  H2O: ["H₂O", "mono"],
  Cl: ["Cl⁻", "mono"],
};
const DENT_WHY = {
  amb: ["can bind through either of two different donor atoms (N or O, S or N), but only one at a time", "दो अलग दाता परमाणुओं (N या O, S या N) में से किसी एक से जुड़ सकता है, पर एक समय में केवल एक से"],
  bi: ["binds through two donor atoms at the same time (bidentate)", "एक साथ दो दाता परमाणुओं से जुड़ता है (द्विदंतुर)"],
  hexa: ["binds through six donor atoms (hexadentate)", "छह दाता परमाणुओं से जुड़ता है (षट्दंतुर)"],
  mono: ["has only one donor atom (monodentate)", "इसमें केवल एक दाता परमाणु है (एकदंतुर)"],
};
// Izomerija: [zapis, geometrijska?, optična?, razlaga (en), razlaga (hi)].
const CISO = [
  ["[Pt(NH_3)_2Cl_2]", 1, 0, "square planar MA₂B₂: cis and trans forms", "वर्ग समतलीय MA₂B₂: समपक्ष और विपक्ष रूप"],
  ["[Co(NH_3)_4Cl_2]^+", 1, 0, "octahedral MA₄B₂: cis and trans forms, each with a mirror plane", "अष्टफलकीय MA₄B₂: समपक्ष और विपक्ष रूप, प्रत्येक में दर्पण तल"],
  ["[Co(NH_3)_3(NO_2)_3]", 1, 0, "octahedral MA₃B₃: fac and mer forms", "अष्टफलकीय MA₃B₃: फलकीय (fac) और याम्योत्तर (mer) रूप"],
  ["[CoCl_2(en)_2]^+", 1, 1, "cis and trans forms; the cis form is chiral (d and l)", "समपक्ष और विपक्ष रूप; समपक्ष रूप किरल है (d और l)"],
  ["[Co(en)_3]^{3+}", 0, 1, "three chelate rings make it chiral (d and l), but there is no cis/trans form", "तीन कीलेट वलय इसे किरल बनाते हैं (d और l), पर समपक्ष/विपक्ष रूप नहीं"],
  ["[Cr(C_2O_4)_3]^{3-}", 0, 1, "three chelate rings make it chiral (d and l), but there is no cis/trans form", "तीन कीलेट वलय इसे किरल बनाते हैं (d और l), पर समपक्ष/विपक्ष रूप नहीं"],
  ["[Co(NH_3)_5Cl]^{2+}", 0, 0, "MA₅B: every position of B is equivalent, so only one form exists", "MA₅B: B की हर स्थिति तुल्य है, इसलिए केवल एक रूप"],
  ["[NiCl_4]^{2-}", 0, 0, "tetrahedral: all positions are equivalent, so no geometrical isomers", "चतुष्फलकीय: सभी स्थितियाँ तुल्य हैं, इसलिए ज्यामितीय समावयवी नहीं"],
  ["[Co(NH_3)_6]^{3+}", 0, 0, "all six ligands are the same, so no isomers", "छहों लिगन्ड समान हैं, इसलिए कोई समावयवी नहीं"],
  ["[Ni(CO)_4]", 0, 0, "tetrahedral with identical ligands: no isomers", "समान लिगन्डों वाला चतुष्फलकीय: कोई समावयवी नहीं"],
];

// ---------- s-, p-, d- in f-blok ----------
const OXFIX = { H: 1, Li: 1, Na: 1, K: 1, Ba: 2, Ca: 2, O: -2 };
// Oksidacijsko število elementa E v spojini (p = število peroksidnih vezi O–O; za E = O brez fiksnega O).
function oxState(f, E, p = 0) {
  const a = atoms(f);
  let s = 0;
  for (const [e, n] of Object.entries(a)) if (e !== E) s += OXFIX[e] * n;
  return (-s - (E === "O" ? 0 : 2 * p)) / a[E];
}
const OX1 = [["KMnO_4", "Mn"], ["K_2Cr_2O_7", "Cr"], ["K_2MnO_4", "Mn"], ["MnO_2", "Mn"], ["H_2SO_4", "S"], ["H_3PO_4", "P"], ["HNO_3", "N"], ["HClO_4", "Cl"], ["K_2CrO_4", "Cr"], ["Na_2SO_3", "S"], ["Cr_2O_3", "Cr"], ["V_2O_5", "V"], ["Fe_2O_3", "Fe"]];
const OX2 = [["H_3PO_2", "P"], ["H_3PO_3", "P"], ["H_4P_2O_7", "P"], ["HClO_2", "Cl"], ["HClO", "Cl"], ["HClO_3", "Cl"], ["H_2S_2O_7", "S"], ["H_2SO_3", "S"], ["HNO_2", "N"], ["H_2SO_4", "S"]];
// Pasti: [formula, element, peroksidne vezi, razlaga (en), razlaga (hi)].
const OX3 = [
  ["H_2S_2O_8", "S", 1, "H₂S₂O₈ (peroxodisulphuric acid) contains one –O–O– link; those two O atoms are −1, so S is +6.", "H₂S₂O₈ (परॉक्सोडाइसल्फ्यूरिक अम्ल) में एक –O–O– बंध है; उन दो O का मान −1 है, इसलिए S, +6 है।"],
  ["H_2SO_5", "S", 1, "H₂SO₅ (peroxomonosulphuric acid) contains one –O–O– link; those two O atoms are −1, so S is +6.", "H₂SO₅ (परॉक्सोमोनोसल्फ्यूरिक अम्ल) में एक –O–O– बंध है; उन दो O का मान −1 है, इसलिए S, +6 है।"],
  ["CrO_5", "Cr", 2, "CrO₅ has one oxide O (−2) and two peroxide –O–O– groups (each O −1), so Cr is +6.", "CrO₅ में एक ऑक्साइड O (−2) और दो परॉक्साइड –O–O– समूह (प्रत्येक O −1) हैं, इसलिए Cr, +6 है।"],
  ["Na_2S_4O_6", "S", 0, "The four S atoms are not equivalent; the value asked is the average.", "चारों S परमाणु समतुल्य नहीं हैं; पूछा गया मान औसत है।"],
  ["Na_2S_2O_3", "S", 0, "The two S atoms are not equivalent; the value asked is the average.", "दोनों S परमाणु समतुल्य नहीं हैं; पूछा गया मान औसत है।"],
  ["Fe_3O_4", "Fe", 0, "Fe₃O₄ contains Fe²⁺ and Fe³⁺ (FeO·Fe₂O₃); the average is 8/3.", "Fe₃O₄ में Fe²⁺ और Fe³⁺ (FeO·Fe₂O₃) हैं; औसत 8/3 है।"],
  ["KO_2", "O", 0, "KO₂ is a superoxide (O₂⁻): each O is −½.", "KO₂ एक सुपरऑक्साइड (O₂⁻) है: प्रत्येक O, −½ है।"],
  ["Na_2O_2", "O", 0, "Na₂O₂ is a peroxide (O₂²⁻): each O is −1.", "Na₂O₂ एक परॉक्साइड (O₂²⁻) है: प्रत्येक O, −1 है।"],
  ["BaO_2", "O", 0, "BaO₂ is a peroxide (O₂²⁻): each O is −1.", "BaO₂ एक परॉक्साइड (O₂²⁻) है: प्रत्येक O, −1 है।"],
];
const TM = { 21: "Sc", 22: "Ti", 23: "V", 24: "Cr", 25: "Mn", 26: "Fe", 27: "Co", 28: "Ni", 29: "Cu", 30: "Zn" };
// Osnovna konfiguracija 3d/4s (Cr in Cu izjemi).
const tmCfg = (Z) => (Z === 24 ? [5, 1] : Z === 29 ? [10, 1] : [Z - 20, 2]);
const TM_IONS = [[22, 3], [23, 2], [23, 3], [24, 2], [24, 3], [25, 2], [25, 3], [26, 2], [26, 3], [27, 2], [28, 2], [29, 2], [29, 1], [21, 3], [30, 2]];
// Plamenske barve in oksidi (NCERT 11, s-blok).
const FLAME = [
  ["Na", ["golden yellow", "सुनहरा पीला"]],
  ["K", ["violet (lilac)", "बैंगनी (लाइलैक)"]],
  ["Li", ["crimson red", "किरमिजी लाल"]],
  ["Ca", ["brick red", "ईंट जैसा लाल"]],
  ["Ba", ["apple green", "सेब जैसा हरा"]],
];
const BURN = {
  Li: ["Li_2O", "normal oxide", "सामान्य ऑक्साइड"],
  Na: ["Na_2O_2", "peroxide", "परॉक्साइड"],
  K: ["KO_2", "superoxide", "सुपरऑक्साइड"],
};
const G2 = ["Be", "Mg", "Ca", "Sr", "Ba"];
// Lantanoidi: [vprašanje en, hi, pravilno [en, hi], napačni [[en, hi, zakaj en, zakaj hi]], razlaga en, hi].
const LANTH = [
  ["The lanthanoid contraction is mainly caused by", "लैन्थेनॉयड आकुंचन का मुख्य कारण है", ["imperfect shielding of one 4f electron by another", "एक 4f इलेक्ट्रॉन द्वारा दूसरे का अपूर्ण परिरक्षण"],
    [["addition of a new electron shell", "एक नए इलेक्ट्रॉन कोश का जुड़ना", "No new shell is added: electrons enter the inner 4f subshell.", "कोई नया कोश नहीं जुड़ता: इलेक्ट्रॉन भीतरी 4f उपकोश में जाते हैं।"], ["a decrease in nuclear charge", "नाभिकीय आवेश में कमी", "The nuclear charge increases by one at each step.", "हर चरण पर नाभिकीय आवेश एक बढ़ता है।"], ["filling of the 5d orbitals", "5d कक्षकों का भरना", "Across the lanthanoids the 4f orbitals, not 5d, are filled.", "लैन्थेनॉयडों में 5d नहीं, 4f कक्षक भरते हैं।"]],
    "Across La → Lu the nuclear charge rises by 1 each time, but the added 4f electron shields poorly, so the size decreases steadily.", "La → Lu तक नाभिकीय आवेश हर बार 1 बढ़ता है, पर जुड़ा हुआ 4f इलेक्ट्रॉन ठीक से परिरक्षण नहीं करता, इसलिए आकार लगातार घटता है।"],
  ["Because of the lanthanoid contraction, which pair of elements has almost identical atomic radii?", "लैन्थेनॉयड आकुंचन के कारण किस तत्व-युग्म की परमाणु त्रिज्याएँ लगभग समान हैं?", ["Zr and Hf", "Zr और Hf"],
    [["Ti and Zr", "Ti और Zr", "From the 3d to the 4d series the radius increases normally (Ti 147 pm, Zr 160 pm).", "3d से 4d श्रेणी तक त्रिज्या सामान्य रूप से बढ़ती है (Ti 147 pm, Zr 160 pm)।"], ["La and Lu", "La और Lu", "Lu is clearly smaller than La: that is the contraction itself.", "Lu, La से स्पष्ट रूप से छोटा है: यही तो आकुंचन है।"], ["Sc and Ti", "Sc और Ti", "These are neighbours in the 3d series; the contraction concerns 4d and 5d elements of the same group.", "ये 3d श्रेणी के पड़ोसी हैं; आकुंचन एक ही वर्ग के 4d और 5d तत्वों से संबंधित है।"]],
    "The 4f contraction cancels the expected increase from 4d to 5d, so Zr (160 pm) and Hf (159 pm) are almost the same size.", "4f आकुंचन 4d से 5d तक अपेक्षित वृद्धि को निरस्त कर देता है, इसलिए Zr (160 pm) और Hf (159 pm) लगभग समान आकार के हैं।"],
  ["How does the basic strength of the hydroxides change from La(OH)₃ to Lu(OH)₃?", "La(OH)₃ से Lu(OH)₃ तक हाइड्रॉक्साइडों का क्षारकीय सामर्थ्य कैसे बदलता है?", ["it decreases", "यह घटता है"],
    [["it increases", "यह बढ़ता है", "Smaller Ln³⁺ ions hold OH⁻ more covalently, so basicity falls.", "छोटे Ln³⁺ आयन OH⁻ को अधिक सहसंयोजी रूप से बाँधते हैं, इसलिए क्षारकता घटती है।"], ["it stays the same", "यह समान रहता है", "The Ln³⁺ size changes steadily, so the basicity changes too.", "Ln³⁺ का आकार लगातार बदलता है, इसलिए क्षारकता भी बदलती है।"], ["it first increases, then decreases", "पहले बढ़ता है, फिर घटता है", "The ionic size decreases steadily, so there is no maximum.", "आयनिक आकार लगातार घटता है, इसलिए कोई अधिकतम नहीं।"]],
    "Ln³⁺ radius decreases from La³⁺ to Lu³⁺, the M–OH bond becomes more covalent, and basicity decreases.", "La³⁺ से Lu³⁺ तक Ln³⁺ की त्रिज्या घटती है, M–OH आबंध अधिक सहसंयोजी होता है, और क्षारकता घटती है।"],
];
const LN_OX = [
  ["+4", "Ce", [["Eu", "Eu shows +2 (4f⁷ is stable), not +4.", "Eu, +2 दर्शाता है (4f⁷ स्थायी है), +4 नहीं।"], ["Yb", "Yb shows +2 (4f¹⁴), not +4.", "Yb, +2 दर्शाता है (4f¹⁴), +4 नहीं।"], ["La", "La shows only +3 (empty 4f).", "La केवल +3 दर्शाता है (रिक्त 4f)।"], ["Gd", "Gd shows +3 (4f⁷ in Gd³⁺).", "Gd, +3 दर्शाता है (Gd³⁺ में 4f⁷)।"]], "Ce⁴⁺ has the noble-gas configuration 4f⁰, so Ce shows +4 (a strong oxidant).", "Ce⁴⁺ का विन्यास 4f⁰ (उत्कृष्ट गैस जैसा) है, इसलिए Ce, +4 दर्शाता है (प्रबल ऑक्सीकारक)।"],
  ["+2", "Eu", [["Ce", "Ce shows +4 (4f⁰), not +2.", "Ce, +4 दर्शाता है (4f⁰), +2 नहीं।"], ["La", "La shows only +3 (empty 4f).", "La केवल +3 दर्शाता है (रिक्त 4f)।"], ["Gd", "Gd shows +3 (half-filled 4f⁷ in Gd³⁺).", "Gd, +3 दर्शाता है (Gd³⁺ में अर्धपूर्ण 4f⁷)।"], ["Lu", "Lu shows only +3 (4f¹⁴ in Lu³⁺).", "Lu केवल +3 दर्शाता है (Lu³⁺ में 4f¹⁴)।"]], "Eu²⁺ has the stable half-filled 4f⁷ configuration, so Eu shows +2 (a reductant).", "Eu²⁺ का विन्यास स्थायी अर्धपूर्ण 4f⁷ है, इसलिए Eu, +2 दर्शाता है (अपचायक)।"],
];

// ---------- Prepoznavanje ionov in plinov (ICSE analitska kemija), elektroliza ----------
// Barve oborin z NaOH/NH4OH in topnost v prebitku po ICSE (razred 10, Analytical Chemistry).
const PCOL = { white: ["white", "सफ़ेद"], dgreen: ["dirty green", "मटमैला हरा"], rbrown: ["reddish brown", "लाल-भूरा"], pblue: ["pale blue", "हल्का नीला"] };
const CATION = [
  { k: "Ca", ion: "Ca^{2+}", z: 2, hyd: "Ca(OH)_2", col: "white", naEx: false, nh: false, nhEx: false, salts: ["CaCl_2", "Ca(NO_3)_2"] },
  { k: "Fe2", ion: "Fe^{2+}", z: 2, hyd: "Fe(OH)_2", col: "dgreen", naEx: false, nh: true, nhEx: false, salts: ["FeSO_4"] },
  { k: "Fe3", ion: "Fe^{3+}", z: 3, hyd: "Fe(OH)_3", col: "rbrown", naEx: false, nh: true, nhEx: false, salts: ["FeCl_3"] },
  { k: "Cu", ion: "Cu^{2+}", z: 2, hyd: "Cu(OH)_2", col: "pblue", naEx: false, nh: true, nhEx: true, salts: ["CuSO_4", "Cu(NO_3)_2"] },
  { k: "Zn", ion: "Zn^{2+}", z: 2, hyd: "Zn(OH)_2", col: "white", naEx: true, nh: true, nhEx: true, salts: ["ZnSO_4", "Zn(NO_3)_2"] },
  { k: "Pb", ion: "Pb^{2+}", z: 2, hyd: "Pb(OH)_2", col: "white", naEx: true, nh: true, nhEx: false, salts: ["Pb(NO_3)_2"] },
];
// Opažanja v vrstnem redu, kot jih učenec izvede: barva z NaOH, prebitek NaOH, NH4OH, prebitek NH4OH.
const OBS = [
  { key: "col", en: (c) => `a ${PCOL[c.col][0]} precipitate with NaOH`, hi: (c) => `NaOH के साथ ${PCOL[c.col][1]} अवक्षेप` },
  { key: "naEx", en: (c) => `the precipitate ${c.naEx ? "dissolves" : "does not dissolve"} in excess NaOH`, hi: (c) => `अवक्षेप NaOH के आधिक्य में ${c.naEx ? "घुल जाता है" : "नहीं घुलता"}` },
  { key: "nh", en: (c) => (c.nh ? "a precipitate with NH₄OH" : "no precipitate with NH₄OH"), hi: (c) => (c.nh ? "NH₄OH के साथ अवक्षेप" : "NH₄OH के साथ कोई अवक्षेप नहीं") },
  {
    key: "nhEx",
    en: (c) => `the precipitate ${c.nhEx ? (c.k === "Cu" ? "dissolves in excess NH₄OH to a deep blue solution" : "dissolves in excess NH₄OH") : "does not dissolve in excess NH₄OH"}`,
    hi: (c) => `अवक्षेप NH₄OH के आधिक्य में ${c.nhEx ? (c.k === "Cu" ? "घुलकर गहरा नीला विलयन देता है" : "घुल जाता है") : "नहीं घुलता"}`,
  },
];
const hydTex = (c) => `\\mathrm{${c.ion} + ${c.z}OH^- \\rightarrow ${c.hyd}}\\downarrow`;

// Plini: preskus (en/hi), razlaga in enačba. Pari s skupnim preskusom (HCl/Cl₂ dajeta bel dim z NH₃,
// SO₂/H₂S oba ozelenita kisli dikromat) se nikoli ne pojavita skupaj.
const GAS = {
  H2: { f: "H_2", name: ["hydrogen", "हाइड्रोजन"], test: ["burns with a 'pop' sound when a burning splinter is brought near", "जलती तीली पास लाने पर 'पॉप' ध्वनि के साथ जलती है"], why: ["hydrogen is combustible", "हाइड्रोजन दहनशील है"], eq: rx("2H_2 + O_2 -> 2H_2O") },
  O2: { f: "O_2", name: ["oxygen", "ऑक्सीजन"], test: ["rekindles a glowing splinter", "सुलगती तीली को फिर से जला देती है"], why: ["oxygen supports combustion", "ऑक्सीजन दहन में सहायक है"], eq: rx("C + O_2 -> CO_2") },
  CO2: { f: "CO_2", name: ["carbon dioxide", "कार्बन डाइऑक्साइड"], test: ["turns lime water milky but does not change acidified potassium dichromate", "चूने के पानी को दूधिया कर देती है पर अम्लीकृत पोटैशियम डाइक्रोमेट का रंग नहीं बदलती"], why: ["insoluble CaCO₃ makes lime water milky; CO₂ is not a reducing agent", "अविलेय CaCO₃ चूने के पानी को दूधिया बनाता है; CO₂ अपचायक नहीं है"], eq: rx("Ca(OH)_2 + CO_2 -> CaCO_3 + H_2O") },
  SO2: { f: "SO_2", name: ["sulphur dioxide", "सल्फर डाइऑक्साइड"], test: ["turns orange acidified potassium dichromate paper green", "नारंगी अम्लीकृत पोटैशियम डाइक्रोमेट पत्र को हरा कर देती है"], why: ["SO₂ reduces orange Cr₂O₇²⁻ to green Cr³⁺", "SO₂ नारंगी Cr₂O₇²⁻ को हरे Cr³⁺ में अपचयित करती है"], eq: rx("K_2Cr_2O_7 + H_2SO_4 + 3SO_2 -> K_2SO_4 + Cr_2(SO_4)_3 + H_2O") },
  NH3: { f: "NH_3", name: ["ammonia", "अमोनिया"], test: ["turns moist red litmus paper blue", "नम लाल लिटमस पत्र को नीला कर देती है"], why: ["ammonia is the only common basic gas", "अमोनिया एकमात्र सामान्य क्षारीय गैस है"], eq: rx("NH_3 + H_2O -> NH_4OH") },
  HCl: { f: "HCl", name: ["hydrogen chloride", "हाइड्रोजन क्लोराइड"], test: ["gives dense white fumes with a glass rod dipped in ammonia solution", "अमोनिया विलयन में डुबोई काँच की छड़ के साथ घने सफ़ेद धूम देती है"], why: ["the white fumes are solid ammonium chloride", "सफ़ेद धूम ठोस अमोनियम क्लोराइड के हैं"], eq: rx("NH_3 + HCl -> NH_4Cl") },
  Cl2: { f: "Cl_2", name: ["chlorine", "क्लोरीन"], test: ["turns moist starch-iodide paper blue-black", "नम स्टार्च-आयोडाइड पत्र को नीला-काला कर देती है"], why: ["chlorine frees iodine, which turns starch blue-black", "क्लोरीन आयोडीन मुक्त करती है, जो स्टार्च को नीला-काला कर देती है"], eq: rx("2KI + Cl_2 -> 2KCl + I_2") },
  H2S: { f: "H_2S", name: ["hydrogen sulphide", "हाइड्रोजन सल्फाइड"], test: ["turns moist lead acetate paper black", "नम लेड ऐसीटेट पत्र को काला कर देती है"], why: ["black lead sulphide forms", "काला लेड सल्फाइड बनता है"], eq: rx("(CH_3COO)_2Pb + H_2S -> PbS + 2CH_3COOH") },
};
// Bel dim z NH₃ lahko dajo tudi drugi kisli plini, zato HCl nikoli ne nastopa skupaj z njimi.
const GAS_CONF = { HCl: ["Cl2", "SO2", "H2S", "CO2"], Cl2: ["HCl"], SO2: ["H2S", "HCl"], H2S: ["SO2", "HCl"], CO2: ["HCl"] };
const cap = (s) => s[0].toUpperCase() + s.slice(1);

// Elektroliza (ICSE): produkti na elektrodah, polreakcije in napačne možnosti s konkretnimi razlogi.
const EPROD = {
  Pb: ["Lead metal is deposited", "लेड धातु जमा होती है"],
  Br2: ["Reddish-brown bromine vapour is given off", "लाल-भूरी ब्रोमीन वाष्प निकलती है"],
  H2: ["Hydrogen gas is evolved", "हाइड्रोजन गैस निकलती है"],
  O2: ["Oxygen gas is evolved", "ऑक्सीजन गैस निकलती है"],
  Cu: ["Copper is deposited", "कॉपर जमा होता है"],
  CuDis: ["The copper electrode dissolves", "कॉपर इलेक्ट्रोड घुलता है"],
  PtDis: ["The platinum electrode dissolves", "प्लैटिनम इलेक्ट्रोड घुलता है"],
  SO2: ["Sulphur dioxide gas is evolved", "सल्फर डाइऑक्साइड गैस निकलती है"],
};
const W_SO4 = ["SO₄²⁻ ions are not discharged; OH⁻ ions are discharged in preference.", "SO₄²⁻ आयन विसर्जित नहीं होते; उनकी जगह OH⁻ आयन विसर्जित होते हैं।"];
const W_PT = ["Platinum is an inert electrode; it does not take part in the reaction.", "प्लैटिनम अक्रिय इलेक्ट्रोड है; यह अभिक्रिया में भाग नहीं लेता।"];
const W_CUH = ["Cu²⁺ ions are discharged in preference to H⁺ ions (copper is below hydrogen in the activity series).", "Cu²⁺ आयन H⁺ आयनों से पहले विसर्जित होते हैं (सक्रियता श्रेणी में कॉपर हाइड्रोजन से नीचे है)।"];
const ELYS = [
  {
    k: "PbBr2",
    name: ["molten lead bromide", "गलित लेड ब्रोमाइड"],
    el: ["graphite", "ग्रेफ़ाइट"],
    cat: { p: "Pb", eq: "Pb^{2+} + 2e^- \\rightarrow Pb", wrong: [["Br2", ["Br⁻ ions are negative; they are discharged at the anode.", "Br⁻ आयन ऋणात्मक हैं; वे ऐनोड पर विसर्जित होते हैं।"]], ["H2", ["The melt contains no water, so there are no H⁺ ions.", "गलित लवण में जल नहीं है, इसलिए H⁺ आयन नहीं हैं।"]], ["O2", ["Oxygen could come only from OH⁻ ions at an anode; the melt has none.", "ऑक्सीजन केवल ऐनोड पर OH⁻ आयनों से बन सकती है; गलित लवण में वे नहीं हैं।"]]] },
    an: { p: "Br2", eq: "2Br^- \\rightarrow Br_2 + 2e^-", wrong: [["Pb", ["Pb²⁺ ions are positive; they are reduced at the cathode.", "Pb²⁺ आयन धनात्मक हैं; वे कैथोड पर अपचयित होते हैं।"]], ["O2", ["The melt has no OH⁻ ions; only Br⁻ ions reach the anode.", "गलित लवण में OH⁻ आयन नहीं हैं; ऐनोड पर केवल Br⁻ आयन पहुँचते हैं।"]], ["H2", ["The melt contains no water, so no hydrogen can form.", "गलित लवण में जल नहीं है, इसलिए हाइड्रोजन नहीं बन सकती।"]]] },
  },
  {
    k: "H2O",
    name: ["acidified water", "अम्लीकृत जल"],
    el: ["platinum", "प्लैटिनम"],
    cat: { p: "H2", eq: "2H^+ + 2e^- \\rightarrow H_2", wrong: [["O2", ["Oxygen comes from OH⁻ ions, which are discharged at the anode.", "ऑक्सीजन OH⁻ आयनों से बनती है, जो ऐनोड पर विसर्जित होते हैं।"]], ["SO2", ["SO₄²⁻ ions are negative; they move to the anode, not the cathode.", "SO₄²⁻ आयन ऋणात्मक हैं; वे कैथोड की ओर नहीं, ऐनोड की ओर जाते हैं।"]], ["PtDis", W_PT]] },
    an: { p: "O2", eq: "4OH^- \\rightarrow 2H_2O + O_2 + 4e^-", wrong: [["H2", ["H⁺ ions are positive; they are discharged at the cathode.", "H⁺ आयन धनात्मक हैं; वे कैथोड पर विसर्जित होते हैं।"]], ["SO2", W_SO4], ["PtDis", W_PT]] },
  },
  {
    k: "CuPt",
    name: ["aqueous copper sulphate", "जलीय कॉपर सल्फेट"],
    el: ["platinum", "प्लैटिनम"],
    cat: { p: "Cu", eq: "Cu^{2+} + 2e^- \\rightarrow Cu", wrong: [["H2", W_CUH], ["O2", ["Oxygen comes from OH⁻ ions, which are discharged at the anode.", "ऑक्सीजन OH⁻ आयनों से बनती है, जो ऐनोड पर विसर्जित होते हैं।"]], ["SO2", ["SO₄²⁻ ions are negative; they move to the anode, not the cathode.", "SO₄²⁻ आयन ऋणात्मक हैं; वे कैथोड की ओर नहीं, ऐनोड की ओर जाते हैं।"]]] },
    an: { p: "O2", eq: "4OH^- \\rightarrow 2H_2O + O_2 + 4e^-", wrong: [["Cu", ["Cu²⁺ ions are positive; they are reduced at the cathode.", "Cu²⁺ आयन धनात्मक हैं; वे कैथोड पर अपचयित होते हैं।"]], ["PtDis", W_PT], ["SO2", W_SO4]] },
  },
  {
    k: "CuCu",
    name: ["aqueous copper sulphate", "जलीय कॉपर सल्फेट"],
    el: ["copper", "कॉपर"],
    cat: { p: "Cu", eq: "Cu^{2+} + 2e^- \\rightarrow Cu", wrong: [["H2", W_CUH], ["CuDis", ["The cathode gains electrons and grows; it is the anode that dissolves.", "कैथोड इलेक्ट्रॉन ग्रहण करता है और मोटा होता है; घुलता ऐनोड है।"]], ["O2", ["Oxygen could form only at the anode, and even there the copper anode reacts first.", "ऑक्सीजन केवल ऐनोड पर बन सकती थी, और वहाँ भी कॉपर ऐनोड पहले अभिक्रिया करता है।"]]] },
    an: { p: "CuDis", eq: "Cu \\rightarrow Cu^{2+} + 2e^-", wrong: [["O2", ["A copper anode is active: the copper itself loses electrons, so OH⁻ ions are not discharged.", "कॉपर ऐनोड सक्रिय है: कॉपर स्वयं इलेक्ट्रॉन त्यागता है, इसलिए OH⁻ आयन विसर्जित नहीं होते।"]], ["Cu", ["Copper is deposited at the cathode, not at the anode.", "कॉपर कैथोड पर जमा होता है, ऐनोड पर नहीं।"]], ["SO2", W_SO4]] },
  },
];
// Trditve o celotni elektrolizi (resnične in napačne z razlogom).
const ESTAT = {
  PbBr2: {
    yes: [["Reddish-brown bromine vapour forms at the anode.", "ऐनोड पर लाल-भूरी ब्रोमीन वाष्प बनती है।"], ["Silvery grey lead forms at the cathode.", "कैथोड पर चाँदी जैसा धूसर लेड बनता है।"], ["Electrolysis starts only after the lead bromide melts.", "वैद्युत अपघटन लेड ब्रोमाइड के पिघलने के बाद ही शुरू होता है।"]],
    no: [
      [["Bromine forms at the cathode.", "कैथोड पर ब्रोमीन बनती है।"], ["Br⁻ ions are negative and are discharged at the anode.", "Br⁻ आयन ऋणात्मक हैं और ऐनोड पर विसर्जित होते हैं।"]],
      [["Solid lead bromide conducts electricity.", "ठोस लेड ब्रोमाइड विद्युत का चालन करता है।"], ["In the solid the ions are held in fixed positions; they can move only in the melt.", "ठोस में आयन अपनी जगह स्थिर रहते हैं; वे केवल गलित अवस्था में गति कर सकते हैं।"]],
      [["Hydrogen is evolved at the cathode.", "कैथोड पर हाइड्रोजन निकलती है।"], ["The melt contains no water and no H⁺ ions.", "गलित लवण में न जल है, न H⁺ आयन।"]],
      [["Lead forms at the anode.", "ऐनोड पर लेड बनता है।"], ["Pb²⁺ ions are positive and are reduced at the cathode.", "Pb²⁺ आयन धनात्मक हैं और कैथोड पर अपचयित होते हैं।"]],
    ],
  },
  H2O: {
    yes: [["Hydrogen and oxygen form in the volume ratio 2 : 1.", "हाइड्रोजन और ऑक्सीजन 2 : 1 के आयतन अनुपात में बनती हैं।"], ["Hydrogen is evolved at the cathode.", "कैथोड पर हाइड्रोजन निकलती है।"], ["The dilute acid makes the water a good conductor.", "तनु अम्ल जल को अच्छा चालक बनाता है।"]],
    no: [
      [["Oxygen is evolved at the cathode.", "कैथोड पर ऑक्सीजन निकलती है।"], ["OH⁻ ions are discharged at the anode, so oxygen forms there.", "OH⁻ आयन ऐनोड पर विसर्जित होते हैं, इसलिए ऑक्सीजन वहीं बनती है।"]],
      [["Hydrogen and oxygen form in the volume ratio 1 : 2.", "हाइड्रोजन और ऑक्सीजन 1 : 2 के आयतन अनुपात में बनती हैं।"], ["The same 4 electrons give 2 H₂ but only 1 O₂.", "उन्हीं 4 इलेक्ट्रॉनों से 2 H₂ पर केवल 1 O₂ बनती है।"]],
      [["The platinum electrodes slowly dissolve.", "प्लैटिनम इलेक्ट्रोड धीरे-धीरे घुलते हैं।"], W_PT],
      [["Sulphur dioxide is evolved at the anode.", "ऐनोड पर सल्फर डाइऑक्साइड निकलती है।"], W_SO4],
    ],
  },
  CuPt: {
    yes: [["The blue colour of the solution gradually fades.", "विलयन का नीला रंग धीरे-धीरे फीका पड़ता है।"], ["Oxygen is evolved at the anode.", "ऐनोड पर ऑक्सीजन निकलती है।"], ["The solution becomes acidic as sulphuric acid forms.", "सल्फ्यूरिक अम्ल बनने से विलयन अम्लीय हो जाता है।"]],
    no: [
      [["The blue colour of the solution stays the same.", "विलयन का नीला रंग वैसा ही रहता है।"], ["Cu²⁺ ions removed at the cathode are not replaced, because platinum does not dissolve.", "कैथोड पर हटे Cu²⁺ आयनों की पूर्ति नहीं होती, क्योंकि प्लैटिनम नहीं घुलता।"]],
      [["The anode becomes thinner.", "ऐनोड पतला होता जाता है।"], W_PT],
      [["Hydrogen is evolved at the cathode.", "कैथोड पर हाइड्रोजन निकलती है।"], W_CUH],
      [["Sulphur dioxide is evolved at the anode.", "ऐनोड पर सल्फर डाइऑक्साइड निकलती है।"], W_SO4],
    ],
  },
  CuCu: {
    yes: [["The blue colour of the solution does not change.", "विलयन का नीला रंग नहीं बदलता।"], ["The anode becomes thinner and the cathode thicker.", "ऐनोड पतला और कैथोड मोटा होता जाता है।"], ["The concentration of Cu²⁺ ions stays the same.", "Cu²⁺ आयनों की सांद्रता वही रहती है।"]],
    no: [
      [["The blue colour of the solution fades.", "विलयन का नीला रंग फीका पड़ता है।"], ["Each Cu²⁺ ion removed at the cathode is replaced by one from the anode.", "कैथोड पर हटे हर Cu²⁺ आयन की पूर्ति ऐनोड से आए आयन से होती है।"]],
      [["Oxygen is evolved at the anode.", "ऐनोड पर ऑक्सीजन निकलती है।"], ["The copper anode itself is oxidised, so OH⁻ ions are not discharged.", "कॉपर ऐनोड स्वयं ऑक्सीकृत होता है, इसलिए OH⁻ आयन विसर्जित नहीं होते।"]],
      [["Hydrogen is evolved at the cathode.", "कैथोड पर हाइड्रोजन निकलती है।"], W_CUH],
      [["Sulphuric acid builds up in the solution.", "विलयन में सल्फ्यूरिक अम्ल बढ़ता जाता है।"], ["That happens with inert electrodes; here the anode dissolves instead of OH⁻ being discharged.", "ऐसा अक्रिय इलेक्ट्रोड के साथ होता है; यहाँ OH⁻ के विसर्जन की जगह ऐनोड घुलता है।"]],
    ],
  },
};
// Pari za razlikovanje: pravilni reagent in tri možnosti, ki para NE ločijo (preverjeno ročno; glej komentar).
const RG = {
  naFew: ["A few drops of NaOH solution", "NaOH विलयन की कुछ बूँदें"],
  naEx: ["Excess NaOH solution", "NaOH विलयन का आधिक्य"],
  nhFew: ["A few drops of NH₄OH solution", "NH₄OH विलयन की कुछ बूँदें"],
  nhEx: ["Excess NH₄OH solution", "NH₄OH विलयन का आधिक्य"],
  lime: ["Lime water", "चूने का पानी"],
  dich: ["Acidified potassium dichromate paper", "अम्लीकृत पोटैशियम डाइक्रोमेट पत्र"],
  redL: ["Moist red litmus paper", "नम लाल लिटमस पत्र"],
  blueL: ["Moist blue litmus paper", "नम नीला लिटमस पत्र"],
  glow: ["A glowing splinter", "सुलगती तीली"],
  burn: ["A burning splinter", "जलती तीली"],
  lead: ["Moist lead acetate paper", "नम लेड ऐसीटेट पत्र"],
  starch: ["Moist starch-iodide paper", "नम स्टार्च-आयोडाइड पत्र"],
};
const RW = {
  bothWhite: ["Both give a white precipitate.", "दोनों सफ़ेद अवक्षेप देते हैं।"],
  neitherLime: ["Neither gas turns lime water milky.", "कोई भी गैस चूने के पानी को दूधिया नहीं करती।"],
  neitherGlow: ["Neither gas rekindles a glowing splinter.", "कोई भी गैस सुलगती तीली को फिर से नहीं जलाती।"],
  neitherLead: ["Only H₂S blackens lead acetate paper; neither of these does.", "केवल H₂S लेड ऐसीटेट पत्र को काला करती है; इनमें से कोई नहीं।"],
  bothAcid: ["Both are acidic gases and turn moist blue litmus red.", "दोनों अम्लीय गैसें हैं और नम नीले लिटमस को लाल कर देती हैं।"],
  neitherNeutral: ["Neither gas changes it: one is neutral and the other is acidic.", "कोई भी गैस इसे नहीं बदलती: एक उदासीन है और दूसरी अम्लीय।"],
};
// Opomba k izboru: HCl in Cl₂ oba dajeta bel dim z NH₃; Cl₂ obeli moker lakmus; H₂S tudi ozeleni kisli dikromat;
// H₂ in O₂ ločita tako goreča kot tleča trska, zato je med možnostmi le ena.
const DPAIR = [
  { a: ["Zn^{2+}", "Zn²⁺"], b: ["Pb^{2+}", "Pb²⁺"], ok: "nhEx", obs: ["the Zn(OH)₂ precipitate dissolves in excess NH₄OH, but Pb(OH)₂ does not", "Zn(OH)₂ अवक्षेप NH₄OH के आधिक्य में घुल जाता है, पर Pb(OH)₂ नहीं"], wrong: [["naFew", RW.bothWhite], ["nhFew", RW.bothWhite], ["naEx", ["Both hydroxides are amphoteric and dissolve in excess NaOH.", "दोनों हाइड्रॉक्साइड उभयधर्मी हैं और NaOH के आधिक्य में घुल जाते हैं।"]]] },
  { a: ["CO_2", "CO₂"], b: ["SO_2", "SO₂"], ok: "dich", obs: ["SO₂ turns it green, CO₂ does not change it", "SO₂ इसे हरा कर देती है, CO₂ इसे नहीं बदलती"], wrong: [["lime", ["Both gases turn lime water milky.", "दोनों गैसें चूने के पानी को दूधिया कर देती हैं।"]], ["blueL", RW.bothAcid], ["burn", ["Neither gas burns; both put out a burning splinter.", "कोई भी गैस नहीं जलती; दोनों जलती तीली बुझा देती हैं।"]]] },
  { a: ["NH_3", "NH₃"], b: ["HCl", "HCl"], ok: "redL", obs: ["NH₃ turns it blue, HCl leaves it red", "NH₃ इसे नीला कर देती है, HCl इसे लाल ही रहने देती है"], wrong: [["lime", RW.neitherLime], ["glow", RW.neitherGlow], ["lead", RW.neitherLead]] },
  { a: ["H_2", "H₂"], b: ["O_2", "O₂"], ok: "burn", obs: ["H₂ burns with a pop, O₂ makes the splinter burn more brightly", "H₂ पॉप ध्वनि के साथ जलती है, O₂ में तीली और तेज़ जलती है"], wrong: [["lime", RW.neitherLime], ["lead", RW.neitherLead], ["redL", ["Both gases are neutral; neither changes litmus.", "दोनों गैसें उदासीन हैं; कोई भी लिटमस नहीं बदलती।"]]] },
  { a: ["Cl_2", "Cl₂"], b: ["HCl", "HCl"], ok: "starch", obs: ["Cl₂ turns it blue-black, HCl does not", "Cl₂ इसे नीला-काला कर देती है, HCl नहीं"], wrong: [["lime", RW.neitherLime], ["glow", RW.neitherGlow], ["lead", RW.neitherLead]] },
  { a: ["SO_2", "SO₂"], b: ["H_2S", "H₂S"], ok: "lead", obs: ["H₂S turns it black, SO₂ does not", "H₂S इसे काला कर देती है, SO₂ नहीं"], wrong: [["dich", ["Both are reducing gases and turn acidified dichromate green.", "दोनों अपचायक गैसें हैं और अम्लीकृत डाइक्रोमेट को हरा कर देती हैं।"]], ["blueL", RW.bothAcid], ["glow", RW.neitherGlow]] },
  { a: ["NH_3", "NH₃"], b: ["H_2", "H₂"], ok: "redL", obs: ["NH₃ turns it blue, H₂ leaves it red", "NH₃ इसे नीला कर देती है, H₂ इसे लाल ही रहने देती है"], wrong: [["lime", RW.neitherLime], ["lead", RW.neitherLead], ["blueL", ["Neither gas is acidic, so neither turns blue litmus red.", "कोई भी गैस अम्लीय नहीं है, इसलिए कोई नीले लिटमस को लाल नहीं करती।"]]] },
  { a: ["CO_2", "CO₂"], b: ["O_2", "O₂"], ok: "lime", obs: ["CO₂ turns it milky, O₂ does not", "CO₂ इसे दूधिया कर देती है, O₂ नहीं"], wrong: [["redL", RW.neitherNeutral], ["lead", RW.neitherLead], ["dich", ["Neither gas is a reducing agent, so neither turns it green.", "कोई भी गैस अपचायक नहीं है, इसलिए कोई इसे हरा नहीं करती।"]]] },
];
// Kovine za elektrolitsko izločanje: M (NCERT/ICSE), naboj iona, vir.
const EMET = [
  { k: "Cu", M: 63.5, z: 2, src: ["aqueous copper sulphate", "जलीय कॉपर सल्फेट"], ion: "Cu^{2+}" },
  { k: "Pb", M: 207, z: 2, src: ["molten lead bromide", "गलित लेड ब्रोमाइड"], ion: "Pb^{2+}" },
  { k: "Ag", M: 108, z: 1, src: ["aqueous silver nitrate", "जलीय सिल्वर नाइट्रेट"], ion: "Ag^{+}" },
  { k: "Al", M: 27, z: 3, src: ["alumina dissolved in molten cryolite", "गलित क्रायोलाइट में घुली ऐलुमिना"], ion: "Al^{3+}" },
];

export const EXAM_IN_KEM = [
  {
    id: "exi-kem-chemical-reactions",
    topics: [T("chemical-reactions-and-equations")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      if (level === 1) {
        if (r.int(0, 1) === 0) {
          // Vrsta reakcije.
          const o = r.pick(Object.values(RX).filter((x) => x.t));
          const nr = o.re.length,
            np = o.pr.length;
          const why = {
            comb: L(`A combination reaction gives a single product; here ${np} products form.`, `संयोजन अभिक्रिया में केवल एक उत्पाद बनता है; यहाँ ${np} उत्पाद बनते हैं।`),
            dec: L(`A decomposition starts from a single reactant; here ${nr} substances react.`, `वियोजन में केवल एक अभिकर्मक टूटता है; यहाँ ${nr} पदार्थ अभिक्रिया करते हैं।`),
            disp: L(
              "In a displacement reaction a free element pushes another element out of its compound; that does not happen here.",
              "विस्थापन अभिक्रिया में एक मुक्त तत्व किसी यौगिक से दूसरे तत्व को हटाता है; यहाँ ऐसा नहीं होता।",
            ),
            dd: L(
              "In double displacement two compounds swap ions and form two new compounds; that does not happen here.",
              "द्विविस्थापन में दो यौगिक आयनों की अदला-बदली करके दो नए यौगिक बनाते हैं; यहाँ ऐसा नहीं होता।",
            ),
          };
          const name = (t) => L(RTYPE[t][0], RTYPE[t][1]);
          const free = o.re.find(([f]) => isElement(f))?.[0];
          const out = o.pr.find(([f]) => isElement(f))?.[0];
          const reason = {
            comb: L(`${nr} reactants combine to form a single product.`, `${nr} अभिकर्मक मिलकर एक ही उत्पाद बनाते हैं।`),
            dec: L(`A single reactant breaks down into ${np} simpler products.`, `एक ही अभिकर्मक टूटकर ${np} सरल उत्पाद बनाता है।`),
            disp: L(
              `The more reactive element $\\mathrm{${free}}$ displaces $\\mathrm{${out}}$ from its compound.`,
              `अधिक सक्रिय तत्व $\\mathrm{${free}}$, $\\mathrm{${out}}$ को उसके यौगिक से विस्थापित करता है।`,
            ),
            dd: L("The two compounds exchange their ions (a precipitate or water forms).", "दोनों यौगिक अपने आयनों का आदान-प्रदान करते हैं (अवक्षेप या जल बनता है)।"),
          }[o.t];
          return task({
            text: L(`Which type of reaction is $${eqTex(o)}$?`, `अभिक्रिया $${eqTex(o)}$ किस प्रकार की है?`),
            answer: choiceWhy(
              r,
              name(o.t),
              Object.keys(RTYPE)
                .filter((t) => t !== o.t)
                .map((t) => [name(t), why[t]]),
            ),
            data: { given: [eqTex(o)], find: [L("\\text{type of reaction}", "\\text{अभिक्रिया का प्रकार}")] },
            hint: L("Count the reactants and products, and check whether a free element replaces another or two compounds swap ions.", "अभिकर्मक और उत्पाद गिनिए, और देखिए कि कोई मुक्त तत्व दूसरे का स्थान लेता है या दो यौगिक आयनों की अदला-बदली करते हैं।"),
            solution: L(
              `Reactants: ${nr}, products: ${np}.\n${reason}\nSo it is a ${RTYPE[o.t][0]}.`,
              `अभिकर्मक: ${nr}, उत्पाद: ${np}।\n${reason}\nअतः यह ${RTYPE[o.t][1]} है।`,
            ),
          });
        }
        // Koeficient v preprosti enačbi.
        const o = r.pick([RX.h2o, RX.mgo, RX.nh3, RX.nacl, RX.kclo3, RX.agcl, RX.hgo, RX.cuag, RX.pbi2, RX.baso4, RX.ch4, RX.so3, RX.elw, RX.mgco2, RX.naw]);
        const idx = r.pick(o.coef.map((c, i) => (c > 1 ? i : -1)).filter((i) => i >= 0));
        const f = o.all[idx][0],
          c = o.coef[idx];
        return task({
          text: L(
            `Balance the equation using the smallest whole-number coefficients: $${skelTex(o)}$. What is the coefficient of $\\mathrm{${f}}$?`,
            `समीकरण $${skelTex(o)}$ को सबसे छोटे पूर्णांक गुणांकों से संतुलित कीजिए। $\\mathrm{${f}}$ का गुणांक क्या है?`,
          ),
          answer: numM(c, 0, [
            [1, L(`With coefficient 1 the atoms in ${uc(f)} are not balanced on both sides.`, `गुणांक 1 रखने पर ${uc(f)} के परमाणु दोनों ओर बराबर नहीं होते।`)],
            [2 * c, L("That equation balances, but the coefficients are not the smallest whole numbers; divide all of them by 2.", "यह संतुलित है, पर गुणांक सबसे छोटे पूर्णांक नहीं हैं; सभी को 2 से भाग दीजिए।")],
          ]),
          data: { given: [skelTex(o)], find: [`a_{\\mathrm{${f}}}`] },
          hint: L("Count each kind of atom on both sides; change only the coefficients, never the formulas.", "दोनों ओर प्रत्येक प्रकार के परमाणु गिनिए; केवल गुणांक बदलिए, सूत्र कभी नहीं।"),
          solution: L(
            `Balanced equation: $${eqTex(o)}$\nAtom count (left = right): ${atomLine(o)}\nCoefficient of $\\mathrm{${f}}$ = ${c}`,
            `संतुलित समीकरण: $${eqTex(o)}$\nपरमाणुओं की गिनती (बायाँ = दायाँ): ${atomLine(o)}\n$\\mathrm{${f}}$ का गुणांक = ${c}`,
          ),
        });
      }
      if (level === 2) {
        const v = r.int(0, 2);
        if (v === 2) {
          // Vrsta razkroja.
          const o = r.pick([RX.caco3, RX.feso4, RX.pbno3, RX.kclo3, RX.nahco3, RX.hgo, RX.agcl, RX.agbr, RX.elw, RX.elnacl, RX.elal]);
          const nm = (k) => L(DECO[k][0], DECO[k][1]);
          const wrong = Object.keys(DECO)
            .filter((k) => k !== o.d)
            .map((k) => [
              nm(k),
              L(`That would need ${DECO[k][2]}; this reaction is brought about by ${DECO[o.d][2]}.`, `इसके लिए ${DECO[k][3]} चाहिए; यह अभिक्रिया ${DECO[o.d][3]} से होती है।`),
            ]);
          wrong.push([L(RTYPE.comb[0], RTYPE.comb[1]), L("In a combination two or more reactants form one product; here one reactant breaks down.", "संयोजन में दो या अधिक अभिकर्मक एक उत्पाद बनाते हैं; यहाँ एक अभिकर्मक टूटता है।")]);
          const molten = o.molten ? L(` ($\\mathrm{${o.molten}}$ in the molten state)`, ` (गलित अवस्था में $\\mathrm{${o.molten}}$)`) : "";
          return task({
            text: L(`Which kind of decomposition reaction is $${eqTex(o)}$${molten}?`, `$${eqTex(o)}$${molten} किस प्रकार की वियोजन अभिक्रिया है?`),
            answer: choiceWhy(r, nm(o.d), wrong),
            data: { given: [eqTex(o)], find: [L("\\text{kind of decomposition}", "\\text{वियोजन का प्रकार}")] },
            hint: L("Decomposition needs energy. Ask which form of energy breaks this compound: heat, light or electricity.", "वियोजन के लिए ऊर्जा चाहिए। सोचिए कि यह यौगिक किस ऊर्जा से टूटता है: ऊष्मा, प्रकाश या विद्युत।"),
            solution: L(
              `One reactant gives ${o.pr.length} products → decomposition.\nThe energy is supplied as ${DECO[o.d][2]}.\nSo it is ${DECO[o.d][0]}.`,
              `एक अभिकर्मक से ${o.pr.length} उत्पाद → वियोजन।\nऊर्जा ${DECO[o.d][3]} के रूप में दी जाती है।\nअतः यह ${DECO[o.d][1]} है।`,
            ),
          });
        }
        const o = r.pick([RX.feh2o, RX.pbno3, RX.feso4, RX.al2o3, RX.mno2, RX.c3h8, RX.c2h6, RX.fe2o3co, RX.zns, RX.therm, RX.feoh, RX.rust, RX.alhcl, RX.nahco3, RX.elal, RX.cuoh, RX.pbs, RX.cu2s]);
        const c = o.coef;
        if (v === 0) {
          // Izbira niza koeficientov.
          const cand = [[c.map((x) => 2 * x), null]];
          for (const i of r.shuffle([...c.keys()])) {
            const d = c[i] === 1 || r.int(0, 1) ? 1 : -1;
            const cc = [...c];
            cc[i] += d;
            cand.push([cc, unbalancedEl(o, cc)]);
          }
          const wrong = cand.slice(0, 3).map(([cc, ub]) => [
            cc.join(", "),
            ub
              ? L(`${ub[0]}: ${ub[1]} atoms on the left but ${ub[2]} on the right.`, `${ub[0]}: बाईं ओर ${ub[1]} परमाणु, दाईं ओर ${ub[2]} परमाणु।`)
              : L("Balanced, but not the smallest whole numbers: all coefficients can be divided by 2.", "संतुलित है, पर सबसे छोटे पूर्णांक नहीं: सभी गुणांकों को 2 से भाग दिया जा सकता है।"),
          ]);
          return task({
            text: L(
              `Which set of smallest whole-number coefficients balances $${skelTex(o)}$? (Coefficients in the order the formulas are written.)`,
              `$${skelTex(o)}$ को संतुलित करने वाले सबसे छोटे पूर्णांक गुणांक कौन-से हैं? (गुणांक उसी क्रम में जिसमें सूत्र लिखे हैं।)`,
            ),
            answer: choiceWhy(r, c.join(", "), wrong),
            data: { given: [skelTex(o)], find: [L("\\text{coefficients}", "\\text{गुणांक}")] },
            hint: L("Start with the formula that has the most atoms; balance O and H last.", "सबसे अधिक परमाणुओं वाले सूत्र से शुरू कीजिए; O और H को अंत में संतुलित कीजिए।"),
            solution: L(
              `Balanced: $${eqTex(o)}$\nAtom count (left = right): ${atomLine(o)}\nCoefficients: ${c.join(", ")}`,
              `संतुलित: $${eqTex(o)}$\nपरमाणुओं की गिनती (बायाँ = दायाँ): ${atomLine(o)}\nगुणांक: ${c.join(", ")}`,
            ),
          });
        }
        const s = sum(c),
          nr = o.re.length;
        return task({
          text: L(
            `Balance $${skelTex(o)}$ with the smallest whole-number coefficients. What is the sum of all the coefficients (reactants and products)?`,
            `$${skelTex(o)}$ को सबसे छोटे पूर्णांक गुणांकों से संतुलित कीजिए। सभी गुणांकों (अभिकर्मक और उत्पाद) का योग क्या है?`,
          ),
          answer: numM(s, 0, [
            [c.length, L("You added the coefficients of the unbalanced equation (all equal to 1).", "आपने असंतुलित समीकरण के गुणांक (सभी 1) जोड़े हैं।")],
            [sum(c.slice(0, nr)), L("Add the coefficients of the products too.", "उत्पादों के गुणांक भी जोड़िए।")],
            [2 * s, L("The coefficients must be the smallest whole numbers.", "गुणांक सबसे छोटे पूर्णांक होने चाहिए।")],
          ]),
          data: { given: [skelTex(o)], find: ["\\Sigma a"] },
          hint: L("First balance the equation completely, then add every coefficient (a missing coefficient means 1).", "पहले समीकरण पूरा संतुलित कीजिए, फिर सभी गुणांक जोड़िए (गुणांक न लिखा हो तो वह 1 है)।"),
          solution: L(
            `Balanced: $${eqTex(o)}$\nAtom count (left = right): ${atomLine(o)}\nSum: $${c.join(" + ")} = ${s}$`,
            `संतुलित: $${eqTex(o)}$\nपरमाणुओं की गिनती (बायाँ = दायाँ): ${atomLine(o)}\nयोग: $${c.join(" + ")} = ${s}$`,
          ),
        });
      }
      // Raven 3.
      if (r.int(0, 1) === 0) {
        // Redoks: oksidirana / reducirana snov, oksidant / reducent.
        const [o, ox, red, oxR, redR] = r.pick(REDOX);
        const role = r.int(0, 3); // 0 oksidirana, 1 reducirana, 2 oksidant, 3 reducent
        const correct = role === 0 || role === 3 ? ox : red;
        const other = correct === ox ? red : ox;
        const roleName = [
          ["is oxidised", "उपचयित होता है"],
          ["is reduced", "अपचयित होता है"],
          ["is the oxidising agent", "उपचायक है"],
          ["is the reducing agent", "अपचायक है"],
        ][role];
        const otherWhy =
          other === red
            ? L(`${uc(red)} is reduced: it ${redR[0]}${role === 3 ? ", so it is the oxidising agent" : ""}.`, `${uc(red)} अपचयित होता है: यह ${redR[1]}${role === 3 ? ", इसलिए यह उपचायक है" : ""}।`)
            : L(`${uc(ox)} is oxidised: it ${oxR[0]}${role === 2 ? ", so it is the reducing agent" : ""}.`, `${uc(ox)} उपचयित होता है: यह ${oxR[1]}${role === 2 ? ", इसलिए यह अपचायक है" : ""}।`);
        const prods = r.shuffle(o.pr.map(([f]) => f)).slice(0, 2);
        const wrong = [
          [uc(other), otherWhy],
          ...prods.map((p) => [
            uc(p),
            L(`${uc(p)} is a product. The substance that is oxidised or reduced (and each agent) is a reactant.`, `${uc(p)} एक उत्पाद है। उपचयित या अपचयित होने वाला पदार्थ (और उपचायक/अपचायक) अभिकर्मक होता है।`),
          ]),
        ];
        return task({
          text: L(`In the reaction $${eqTex(o)}$, which substance ${roleName[0]}?`, `अभिक्रिया $${eqTex(o)}$ में कौन-सा पदार्थ ${roleName[1]}?`),
          answer: choiceWhy(r, uc(correct), wrong),
          data: { given: [eqTex(o)], find: [L(`\\text{substance that ${roleName[0]}}`, `\\text{पदार्थ जो ${roleName[1]}}`)] },
          hint: L(
            "Oxidation: gain of oxygen or loss of hydrogen (loss of electrons). Reduction: the opposite. The oxidising agent is the substance that gets reduced.",
            "उपचयन: ऑक्सीजन का ग्रहण या हाइड्रोजन का ह्रास (इलेक्ट्रॉन का ह्रास)। अपचयन: इसका उलटा। उपचायक वह पदार्थ है जो स्वयं अपचयित होता है।",
          ),
          solution: L(
            `$\\mathrm{${ox}}$ ${oxR[0]} → oxidised (reducing agent).\n$\\mathrm{${red}}$ ${redR[0]} → reduced (oxidising agent).\nAnswer: $\\mathrm{${correct}}$`,
            `$\\mathrm{${ox}}$ ${oxR[1]} → उपचयित (अपचायक)।\n$\\mathrm{${red}}$ ${redR[1]} → अपचयित (उपचायक)।\nउत्तर: $\\mathrm{${correct}}$`,
          ),
        });
      }
      // Gorenje: koeficient pri najmanjših celih koeficientih.
      const [f, nEn, nHi, cEn, cHi] = r.pick(FUELS);
      const cb = combustion(f);
      const ask = r.int(0, 2); // 0 O2, 1 CO2, 2 H2O
      const sp = ["O_2", "CO_2", "H_2O"][ask];
      const val = cb.k[ask + 1],
        one = cb.one[ask + 1];
      const full = rx(`${cb.k[0] > 1 ? cb.k[0] : ""}${f} + ${cb.k[1] > 1 ? cb.k[1] : ""}O_2 -> ${cb.k[2] > 1 ? cb.k[2] : ""}CO_2 + ${cb.k[3] > 1 ? cb.k[3] : ""}H_2O`);
      const sk = `\\mathrm{${f} + O_2 \\rightarrow CO_2 + H_2O}`;
      const frac = cb.k[0] > 1;
      return task({
        text: L(
          `${nEn[0].toUpperCase() + nEn.slice(1)} ($\\mathrm{${f}}$) is ${cEn}. Balance the equation for its complete combustion, $${sk}$, using the smallest whole-number coefficients. What is the coefficient of $\\mathrm{${sp}}$?`,
          `${nHi} ($\\mathrm{${f}}$) ${cHi} है। इसके पूर्ण दहन के समीकरण $${sk}$ को सबसे छोटे पूर्णांक गुणांकों से संतुलित कीजिए। $\\mathrm{${sp}}$ का गुणांक क्या है?`,
        ),
        answer: numM(val, 0, [
          [one, L("With 1 molecule of fuel this coefficient is a fraction; multiply the whole equation so that all coefficients are whole numbers.", "ईंधन के 1 अणु पर यह गुणांक भिन्न आता है; पूरे समीकरण को गुणा करके सभी गुणांक पूर्णांक बनाइए।")],
          ...(ask === 0 && cb.o ? [[(cb.k[0] * (4 * cb.c + cb.h)) / 4, L("The fuel itself contains oxygen; subtract its O atoms before dividing by 2.", "ईंधन में स्वयं ऑक्सीजन है; 2 से भाग देने से पहले उसके O परमाणु घटाइए।")]] : []),
          [2 * val, L("Use the smallest whole-number coefficients.", "सबसे छोटे पूर्णांक गुणांक लीजिए।")],
        ]),
        data: { given: [sk], find: [`a_{\\mathrm{${sp}}}`] },
        hint: L("Balance C with CO₂ and H with H₂O first; then count the O atoms needed on the right and balance O₂ last.", "पहले C को CO₂ से और H को H₂O से संतुलित कीजिए; फिर दाईं ओर के O परमाणु गिनकर अंत में O₂ संतुलित कीजिए।"),
        solution: L(
          `C: ${cb.c} → ${cb.c} CO₂; H: ${cb.h} → ${en(cb.h / 2)} H₂O.\nO needed on the right: $2 \\cdot ${cb.c} + ${en(cb.h / 2)} = ${2 * cb.c + cb.h / 2}$${cb.o ? `, minus ${cb.o} O in the fuel = ${2 * cb.c + cb.h / 2 - cb.o}` : ""} → ${en(cb.one[1])} O₂.\n${frac ? `Multiply by ${cb.k[0]} to clear the fraction: ` : ""}$${eqTex(full)}$\nCoefficient of $\\mathrm{${sp}}$ = ${val}`,
          `C: ${cb.c} → ${cb.c} CO₂; H: ${cb.h} → ${en(cb.h / 2)} H₂O।\nदाईं ओर आवश्यक O: $2 \\cdot ${cb.c} + ${en(cb.h / 2)} = ${2 * cb.c + cb.h / 2}$${cb.o ? `, ईंधन के ${cb.o} O घटाकर = ${2 * cb.c + cb.h / 2 - cb.o}` : ""} → ${en(cb.one[1])} O₂।\n${frac ? `भिन्न हटाने के लिए ${cb.k[0]} से गुणा कीजिए: ` : ""}$${eqTex(full)}$\n$\\mathrm{${sp}}$ का गुणांक = ${val}`,
        ),
      });
    },
  },
  {
    id: "exi-kem-metals-non-metals",
    topics: [T("metals-and-non-metals")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const mn = (m) => L(`${METAL[m][0]} (${m})`, `${METAL[m][1]} (${m})`);
      if (level === 1) {
        const v = r.int(0, 2);
        if (v === 0) {
          // Ali pride do izpodrivanja? (kovina + raztopina soli)
          const noRx = r.int(0, 1) === 1; // vprašanje: kje reakcije NI
          const pairs = [];
          for (let i = 0; i < DISP_M.length; i++) for (let j = 0; j < DISP_M.length; j++) if (i !== j) pairs.push([DISP_M[i], DISP_M[j], i < j]);
          const sh = r.shuffle(pairs);
          const good = sh.find((p) => p[2] !== noRx);
          const bad = sh.filter((p) => p[2] === noRx).slice(0, 3);
          const opt = ([m, s]) => L(`${m} + ${uc(SALT[s])} solution`, `${m} + ${uc(SALT[s])} विलयन`);
          const series = DISP_M.join(" > ");
          return task({
            text: noRx
              ? L("A strip of metal is dipped into a salt solution. In which case will NO displacement reaction take place?", "धातु की एक पट्टी को लवण के विलयन में डुबोया जाता है। किस स्थिति में कोई विस्थापन अभिक्रिया नहीं होगी?")
              : L("A strip of metal is dipped into a salt solution. In which case will a displacement reaction take place?", "धातु की एक पट्टी को लवण के विलयन में डुबोया जाता है। किस स्थिति में विस्थापन अभिक्रिया होगी?"),
            answer: choiceWhy(
              r,
              opt(good),
              bad.map(([m, s]) => [
                opt([m, s]),
                noRx
                  ? L(`${m} is above ${s} in the reactivity series, so it does displace ${s}.`, `सक्रियता श्रेणी में ${m}, ${s} से ऊपर है, इसलिए यह ${s} को विस्थापित करता है।`)
                  : L(`${m} is below ${s} in the reactivity series, so it cannot displace ${s}.`, `सक्रियता श्रेणी में ${m}, ${s} से नीचे है, इसलिए यह ${s} को विस्थापित नहीं कर सकता।`),
              ]),
            ),
            data: { given: [`\\mathrm{${series}}`], find: [L("\\text{pair}", "\\text{युग्म}")] },
            hint: L("A metal displaces another metal from its salt solution only if it is higher in the reactivity series.", "कोई धातु दूसरी धातु को उसके लवण के विलयन से तभी विस्थापित करती है जब वह सक्रियता श्रेणी में ऊपर हो।"),
            solution: L(
              `Reactivity series (part): ${series}\n${good[0]} is ${good[2] ? "above" : "below"} ${good[1]} → ${good[2] ? "displacement occurs" : "no reaction"}.\nAnswer: ${good[0]} + ${uc(SALT[good[1]])} solution`,
              `सक्रियता श्रेणी (अंश): ${series}\n${good[0]}, ${good[1]} से ${good[2] ? "ऊपर" : "नीचे"} है → ${good[2] ? "विस्थापन होता है" : "कोई अभिक्रिया नहीं"}।\nउत्तर: ${good[0]} + ${uc(SALT[good[1]])} विलयन`,
            ),
          });
        }
        if (v === 1) {
          // Kovina + razredčena HCl.
          const gives = r.int(0, 1) === 1;
          const above = r.shuffle(["Mg", "Al", "Zn", "Fe"]);
          const below = r.shuffle(["Cu", "Ag", "Au", "Hg"]);
          const correct = gives ? above[0] : below[0];
          const wrong = (gives ? below : above).slice(0, 3).map((m) => [
            mn(m),
            gives
              ? L(`${m} is below hydrogen in the reactivity series, so it cannot displace hydrogen from the acid.`, `${m} सक्रियता श्रेणी में हाइड्रोजन से नीचे है, इसलिए यह अम्ल से हाइड्रोजन विस्थापित नहीं कर सकता।`)
              : L(`${m} is above hydrogen in the reactivity series, so it does give H₂ with dilute HCl.`, `${m} सक्रियता श्रेणी में हाइड्रोजन से ऊपर है, इसलिए यह तनु HCl के साथ H₂ देता है।`),
          ]);
          return task({
            text: gives
              ? L("Which metal liberates hydrogen gas with dilute hydrochloric acid?", "कौन-सी धातु तनु हाइड्रोक्लोरिक अम्ल के साथ हाइड्रोजन गैस मुक्त करती है?")
              : L("Which metal does NOT liberate hydrogen gas with dilute hydrochloric acid?", "कौन-सी धातु तनु हाइड्रोक्लोरिक अम्ल के साथ हाइड्रोजन गैस मुक्त नहीं करती?"),
            answer: choiceWhy(r, mn(correct), wrong),
            data: { given: ["\\mathrm{metal + 2HCl \\rightarrow metal\\ chloride + H_2}"], find: [L("\\text{metal}", "\\text{धातु}")] },
            hint: L("Only metals placed above hydrogen in the reactivity series can displace hydrogen from dilute acids.", "केवल वे धातुएँ जो सक्रियता श्रेणी में हाइड्रोजन से ऊपर हैं, तनु अम्लों से हाइड्रोजन विस्थापित कर सकती हैं।"),
            solution: L(
              `Series: K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Hg > Ag > Au\n${correct} is ${gives ? "above" : "below"} hydrogen → it ${gives ? "gives" : "does not give"} H₂.\nAnswer: ${METAL[correct][0]}`,
              `श्रेणी: K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Hg > Ag > Au\n${correct} हाइड्रोजन से ${gives ? "ऊपर" : "नीचे"} है → यह H₂ ${gives ? "देता है" : "नहीं देता"}।\nउत्तर: ${METAL[correct][1]}`,
            ),
          });
        }
        // Elektroni, ki jih atom odda / sprejme.
        const [sym, Z] = r.pick(ION_EL);
        const sh = shells(Z),
          ve = sh[sh.length - 1];
        const metal = ve <= 3;
        const ans = metal ? ve : 8 - ve;
        return task({
          text: L(
            `How many electrons does an atom of ${EL_NAME[sym][0]} (Z = ${Z}) lose or gain to reach a noble-gas configuration when it forms an ionic compound?`,
            `आयनिक यौगिक बनाते समय ${EL_NAME[sym][1]} (Z = ${Z}) का एक परमाणु उत्कृष्ट गैस विन्यास पाने के लिए कितने इलेक्ट्रॉन खोता या ग्रहण करता है?`,
          ),
          answer: numM(ans, 0, [
            [metal ? 8 - ve : ve, metal ? L(`Gaining ${8 - ve} electrons is much harder than losing ${ve}; metals lose their valence electrons.`, `${8 - ve} इलेक्ट्रॉन ग्रहण करना ${ve} खोने से बहुत कठिन है; धातुएँ अपने संयोजकता इलेक्ट्रॉन खोती हैं।`) : L(`${ve} is the number of valence electrons; a non-metal gains electrons to complete its octet.`, `${ve} संयोजकता इलेक्ट्रॉनों की संख्या है; अधातु अष्टक पूरा करने के लिए इलेक्ट्रॉन ग्रहण करती है।`)],
            [Z, L("Only the outermost-shell electrons take part.", "केवल सबसे बाहरी कोश के इलेक्ट्रॉन भाग लेते हैं।")],
          ]),
          data: { given: [`Z = ${Z}`], find: ["n_{e^-}"] },
          hint: L("Write the electronic configuration (2, 8, 8, …) and look at the outermost shell.", "इलेक्ट्रॉनिक विन्यास (2, 8, 8, …) लिखिए और सबसे बाहरी कोश को देखिए।"),
          solution: L(
            `Configuration of ${sym}: ${sh.join(", ")} → ${ve} valence electron${ve > 1 ? "s" : ""}.\n${metal ? `It is a metal: it loses ${ve} → $\\mathrm{${sym}^{${ve > 1 ? ve : ""}+}}$` : `It is a non-metal: it gains $8 - ${ve} = ${ans}$ → $\\mathrm{${sym}^{${ans > 1 ? ans : ""}-}}$`}\nAnswer: ${ans}`,
            `${sym} का विन्यास: ${sh.join(", ")} → ${ve} संयोजकता इलेक्ट्रॉन।\n${metal ? `यह धातु है: यह ${ve} खोता है → $\\mathrm{${sym}^{${ve > 1 ? ve : ""}+}}$` : `यह अधातु है: यह $8 - ${ve} = ${ans}$ ग्रहण करता है → $\\mathrm{${sym}^{${ans > 1 ? ans : ""}-}}$`}\nउत्तर: ${ans}`,
          ),
        });
      }
      if (level === 2) {
        const v = r.int(0, 3);
        if (v === 0) {
          // Način pridobivanja kovine.
          const kind = r.int(0, 2); // 0 elektroliza, 1 redukcija z ogljikom, 2 samo segrevanje
          const pool = [["Na", "K", "Ca", "Mg", "Al"], ["Zn", "Fe", "Pb"], ["Hg", "Cu"]][kind];
          const others = r.shuffle(kind === 0 ? ["Zn", "Fe", "Pb", "Cu", "Au"] : kind === 1 ? ["Na", "K", "Ca", "Mg", "Al", "Au"] : ["Na", "Mg", "Al", "Zn", "Fe", "Ca"]);
          const correct = r.pick(pool);
          const whyM = (m) =>
            EXTR[m] === 0
              ? L(`${m} is very reactive: carbon cannot reduce its oxide, so it is obtained by electrolysis of its molten compound.`, `${m} बहुत सक्रिय है: कार्बन इसके ऑक्साइड को अपचयित नहीं कर सकता, इसलिए इसे गलित यौगिक के विद्युत अपघटन से प्राप्त करते हैं।`)
              : EXTR[m] === 1
                ? L(`${m} is in the middle of the series: its ore is first converted into the oxide, which is then reduced with carbon.`, `${m} श्रेणी के मध्य में है: इसके अयस्क को पहले ऑक्साइड में बदलते हैं, फिर कार्बन से अपचयित करते हैं।`)
                : EXTR[m] === 2
                  ? L(`${m} is low in the series: its sulphide ore gives the metal simply on heating in air.`, `${m} श्रेणी में नीचे है: इसका सल्फाइड अयस्क केवल वायु में गर्म करने से धातु दे देता है।`)
                  : L("Gold is so unreactive that it is found free (native) in nature.", "सोना इतना कम सक्रिय है कि यह प्रकृति में मुक्त अवस्था में मिलता है।");
          const q = [
            ["Which metal is extracted by electrolysis of its molten chloride or oxide?", "किस धातु का निष्कर्षण उसके गलित क्लोराइड या ऑक्साइड के विद्युत अपघटन से किया जाता है?"],
            ["Which metal is obtained by reducing its oxide with carbon (coke)?", "कौन-सी धातु उसके ऑक्साइड को कार्बन (कोक) से अपचयित करके प्राप्त की जाती है?"],
            ["Which metal is obtained from its sulphide ore simply by heating it in air?", "कौन-सी धातु उसके सल्फाइड अयस्क को केवल वायु में गर्म करके प्राप्त की जाती है?"],
          ][kind];
          return task({
            text: L(q[0], q[1]),
            answer: choiceWhy(r, mn(correct), others.slice(0, 3).map((m) => [mn(m), whyM(m)])),
            data: { given: ["\\mathrm{K, Na, Ca, Mg, Al \\mid Zn, Fe, Pb \\mid Cu, Hg \\mid Ag, Au}"], find: [L("\\text{metal}", "\\text{धातु}")] },
            hint: L(
              "The method depends on the position in the reactivity series: high → electrolysis, middle → reduction with carbon, low → heating alone.",
              "विधि सक्रियता श्रेणी में स्थान पर निर्भर है: ऊपर → विद्युत अपघटन, मध्य → कार्बन द्वारा अपचयन, नीचे → केवल गर्म करना।",
            ),
            solution: L(`${whyM(correct)}\nAnswer: ${METAL[correct][0]}`, `${whyM(correct)}\nउत्तर: ${METAL[correct][1]}`),
          });
        }
        if (v === 1) {
          // Žganje (kalcinacija) ali praženje.
          const [ore, oEn, oHi, o, roast] = r.pick(ORES);
          const C = L("Calcination", "निस्तापन"),
            R = L("Roasting", "भर्जन");
          const wrong = [
            [
              roast ? C : R,
              roast
                ? L(`Calcination (heating in limited air) is used for carbonate ores; ${uc(ore)} is a sulphide ore.`, `निस्तापन (सीमित वायु में गर्म करना) कार्बोनेट अयस्कों के लिए है; ${uc(ore)} सल्फाइड अयस्क है।`)
                : L(`Roasting (heating in excess air) is used for sulphide ores; ${uc(ore)} is a carbonate ore.`, `भर्जन (वायु के आधिक्य में गर्म करना) सल्फाइड अयस्कों के लिए है; ${uc(ore)} कार्बोनेट अयस्क है।`),
            ],
            [L("Electrolytic refining", "विद्युत अपघटनी परिष्करण"), L("Refining purifies the impure metal after extraction; it does not turn an ore into an oxide.", "परिष्करण निष्कर्षण के बाद अशुद्ध धातु को शुद्ध करता है; यह अयस्क को ऑक्साइड में नहीं बदलता।")],
            [L("Thermite reaction", "थर्मिट अभिक्रिया"), L("The thermite reaction reduces a metal oxide with aluminium; it does not turn an ore into an oxide.", "थर्मिट अभिक्रिया में धातु ऑक्साइड को ऐलुमिनियम से अपचयित करते हैं; यह अयस्क को ऑक्साइड में नहीं बदलता।")],
          ];
          return task({
            text: L(
              `${oEn} ($\\mathrm{${ore}}$) must first be converted into the metal oxide. Which process is used?`,
              `${oHi} ($\\mathrm{${ore}}$) को पहले धातु ऑक्साइड में बदलना होता है। कौन-सा प्रक्रम प्रयुक्त होता है?`,
            ),
            answer: choiceWhy(r, roast ? R : C, wrong),
            data: { given: [`\\mathrm{${ore}}`], find: [L("\\text{process}", "\\text{प्रक्रम}")] },
            hint: L("Is the ore a carbonate or a sulphide?", "अयस्क कार्बोनेट है या सल्फाइड?"),
            solution: L(
              `${uc(ore)} is a ${roast ? "sulphide" : "carbonate"} ore.\n${roast ? "Roasting: heating strongly in excess air" : "Calcination: heating strongly in limited air"}: $${eqTex(o)}$\nAnswer: ${roast ? "roasting" : "calcination"}`,
              `${uc(ore)} एक ${roast ? "सल्फाइड" : "कार्बोनेट"} अयस्क है।\n${roast ? "भर्जन: वायु के आधिक्य में तेज़ गर्म करना" : "निस्तापन: सीमित वायु में तेज़ गर्म करना"}: $${eqTex(o)}$\nउत्तर: ${roast ? "भर्जन" : "निस्तापन"}`,
            ),
          });
        }
        if (v === 2) {
          // Uboj oksidi.
          const amph = r.pick(["Al_2O_3", "ZnO"]);
          const others = r.shuffle(["Na_2O", "MgO", "CaO", "CuO", "CO_2", "SO_2"]).slice(0, 3);
          const acidic = (x) => x === "CO_2" || x === "SO_2";
          return task({
            text: L("Which oxide reacts with both hydrochloric acid and sodium hydroxide solution to give salt and water?", "कौन-सा ऑक्साइड हाइड्रोक्लोरिक अम्ल और सोडियम हाइड्रॉक्साइड विलयन दोनों से अभिक्रिया करके लवण और जल देता है?"),
            answer: choiceWhy(
              r,
              uc(amph),
              others.map((x) => [
                uc(x),
                acidic(x) ? L(`${uc(x)} is an acidic oxide: it reacts only with bases.`, `${uc(x)} अम्लीय ऑक्साइड है: यह केवल क्षारकों से अभिक्रिया करता है।`) : L(`${uc(x)} is a basic oxide: it reacts only with acids.`, `${uc(x)} क्षारकीय ऑक्साइड है: यह केवल अम्लों से अभिक्रिया करता है।`),
              ]),
            ),
            data: { given: ["\\mathrm{HCl,\\ NaOH}"], find: [L("\\text{oxide}", "\\text{ऑक्साइड}")] },
            hint: L("An oxide that shows both acidic and basic behaviour is called amphoteric.", "जो ऑक्साइड अम्लीय और क्षारकीय दोनों व्यवहार दिखाए, उसे उभयधर्मी ऑक्साइड कहते हैं।"),
            solution: L(
              `${uc(amph)} is amphoteric:\n${amph === "ZnO" ? "$\\mathrm{ZnO + 2HCl \\rightarrow ZnCl_2 + H_2O}$ and $\\mathrm{ZnO + 2NaOH \\rightarrow Na_2ZnO_2 + H_2O}$" : "$\\mathrm{Al_2O_3 + 6HCl \\rightarrow 2AlCl_3 + 3H_2O}$ and $\\mathrm{Al_2O_3 + 2NaOH \\rightarrow 2NaAlO_2 + H_2O}$"}\nAnswer: ${uc(amph)}`,
              `${uc(amph)} उभयधर्मी है:\n${amph === "ZnO" ? "$\\mathrm{ZnO + 2HCl \\rightarrow ZnCl_2 + H_2O}$ तथा $\\mathrm{ZnO + 2NaOH \\rightarrow Na_2ZnO_2 + H_2O}$" : "$\\mathrm{Al_2O_3 + 6HCl \\rightarrow 2AlCl_3 + 3H_2O}$ तथा $\\mathrm{Al_2O_3 + 2NaOH \\rightarrow 2NaAlO_2 + H_2O}$"}\nउत्तर: ${uc(amph)}`,
            ),
          });
        }
        // Število prenesenih elektronov v ionski spojini.
        const [f, cat, nc, qc, an, na, qa] = r.pick(IONIC);
        const ans = nc * qc;
        return task({
          text: L(`How many electrons are transferred in total when one formula unit of $\\mathrm{${f}}$ is formed from its atoms? (Atomic numbers: ${cat} = ${ZOF[cat]}, ${an} = ${ZOF[an]})`, `परमाणुओं से $\\mathrm{${f}}$ की एक सूत्र इकाई बनने में कुल कितने इलेक्ट्रॉन स्थानांतरित होते हैं? (परमाणु संख्याएँ: ${cat} = ${ZOF[cat]}, ${an} = ${ZOF[an]})`),
          answer: numM(ans, 0, [
            [2 * ans, L("Electrons lost by the metal are the same electrons gained by the non-metal; count them once.", "धातु द्वारा खोए गए इलेक्ट्रॉन ही अधातु ग्रहण करती है; उन्हें एक ही बार गिनिए।")],
            ...(nc > 1 ? [[qc, L(`There are ${nc} ${cat} atoms in one formula unit, and each loses ${qc}.`, `एक सूत्र इकाई में ${nc} ${cat} परमाणु हैं और प्रत्येक ${qc} इलेक्ट्रॉन खोता है।`)]] : []),
            ...(na > 1 ? [[qa, L(`There are ${na} ${an} atoms in one formula unit, and each gains ${qa}.`, `एक सूत्र इकाई में ${na} ${an} परमाणु हैं और प्रत्येक ${qa} इलेक्ट्रॉन ग्रहण करता है।`)]] : []),
          ]),
          data: { given: [`\\mathrm{${f}}`, `Z(\\mathrm{${cat}}) = ${ZOF[cat]}`, `Z(\\mathrm{${an}}) = ${ZOF[an]}`], find: ["n_{e^-}"] },
          hint: L("Find the charge on each ion from the electronic configuration, then multiply by the number of metal atoms.", "इलेक्ट्रॉनिक विन्यास से प्रत्येक आयन का आवेश ज्ञात कीजिए, फिर धातु परमाणुओं की संख्या से गुणा कीजिए।"),
          solution: L(
            `${cat} (${shells(ZOF[cat]).join(", ")}) → $\\mathrm{${cat}^{${qc > 1 ? qc : ""}+}}$; ${an} (${shells(ZOF[an]).join(", ")}) → $\\mathrm{${an}^{${qa > 1 ? qa : ""}-}}$\nElectrons lost $= ${nc} \\cdot ${qc} = ${ans}$ = electrons gained $= ${na} \\cdot ${qa} = ${na * qa}$\nAnswer: ${ans}`,
            `${cat} (${shells(ZOF[cat]).join(", ")}) → $\\mathrm{${cat}^{${qc > 1 ? qc : ""}+}}$; ${an} (${shells(ZOF[an]).join(", ")}) → $\\mathrm{${an}^{${qa > 1 ? qa : ""}-}}$\nखोए गए इलेक्ट्रॉन $= ${nc} \\cdot ${qc} = ${ans}$ = ग्रहण किए गए इलेक्ट्रॉन $= ${na} \\cdot ${qa} = ${na * qa}$\nउत्तर: ${ans}`,
          ),
        });
      }
      // Raven 3.
      const v = r.int(0, 2);
      if (v === 0) {
        // Termitni postopek.
        const m = r.pick([8, 16, 24, 32, 40, 48, 64, 80]);
        const askAl = r.int(0, 1) === 1;
        const nm = r.pick(NAMES);
        const nOx = m / 160;
        const ans = askAl ? nOx * 2 * 27 : nOx * 2 * 56;
        return task({
          text: L(
            `${nm[0]} watches railway tracks being welded by the thermite reaction: $\\mathrm{2Al + Fe_2O_3 \\rightarrow Al_2O_3 + 2Fe}$. ${askAl ? `What mass of aluminium (in kg) is needed to react completely with ${m} kg of $\\mathrm{Fe_2O_3}$?` : `What mass of iron (in kg) is formed from ${m} kg of $\\mathrm{Fe_2O_3}$?`} (Fe = 56, O = 16, Al = 27)${roundToL(2, lang)}`,
            `${nm[1]} रेल की पटरियों की थर्मिट अभिक्रिया द्वारा वेल्डिंग ${["Priya", "Ananya", "Meera", "Diya"].includes(nm[0]) ? "देखती" : "देखता"} है: $\\mathrm{2Al + Fe_2O_3 \\rightarrow Al_2O_3 + 2Fe}$। ${askAl ? `${m} kg $\\mathrm{Fe_2O_3}$ से पूर्ण अभिक्रिया के लिए कितना ऐलुमिनियम (kg में) चाहिए?` : `${m} kg $\\mathrm{Fe_2O_3}$ से कितना लोहा (kg में) बनता है?`} (Fe = 56, O = 16, Al = 27)${roundToL(2, lang)}`,
          ),
          answer: numM(ans, 2, [
            [ans / 2, L("The equation shows 2 mol of this metal per 1 mol of Fe₂O₃.", "समीकरण में 1 mol Fe₂O₃ पर इस धातु के 2 mol हैं।")],
            [askAl ? (m * 102) / 54 : (m * 160) / 112, L("You inverted the mass ratio.", "आपने द्रव्यमान अनुपात उलट दिया है।")],
          ]),
          data: { given: [`m(\\mathrm{Fe_2O_3}) = ${m}\\ \\mathrm{kg}`, "\\mathrm{Fe} = 56,\\ \\mathrm{O} = 16,\\ \\mathrm{Al} = 27"], find: [askAl ? "m(\\mathrm{Al})" : "m(\\mathrm{Fe})"] },
          hint: L("Find the molar mass of Fe₂O₃, then use the mole ratio from the balanced equation.", "Fe₂O₃ का मोलर द्रव्यमान ज्ञात कीजिए, फिर संतुलित समीकरण का मोल अनुपात लीजिए।"),
          formula: askAl ? "m(\\mathrm{Al}) = m(\\mathrm{Fe_2O_3}) \\cdot \\dfrac{2 \\cdot 27}{160}" : "m(\\mathrm{Fe}) = m(\\mathrm{Fe_2O_3}) \\cdot \\dfrac{2 \\cdot 56}{160}",
          solution: L(
            `$M(\\mathrm{Fe_2O_3}) = 2 \\cdot 56 + 3 \\cdot 16 = 160$\n160 kg Fe₂O₃ ${askAl ? "needs 2 · 27 = 54 kg Al" : "gives 2 · 56 = 112 kg Fe"}\n$m = ${m} \\cdot \\dfrac{${askAl ? 54 : 112}}{160} = ${en(ans, 2)}\\ \\mathrm{kg}$`,
            `$M(\\mathrm{Fe_2O_3}) = 2 \\cdot 56 + 3 \\cdot 16 = 160$\n160 kg Fe₂O₃ ${askAl ? "के लिए 2 · 27 = 54 kg Al चाहिए" : "से 2 · 56 = 112 kg Fe बनता है"}\n$m = ${m} \\cdot \\dfrac{${askAl ? 54 : 112}}{160} = ${en(ans, 2)}\\ \\mathrm{kg}$`,
          ),
        });
      }
      if (v === 1) {
        // Uganka: vrstni red reaktivnosti iz opazovanj.
        const letters = r.pick([["A", "B", "C"], ["P", "Q", "R"], ["X", "Y", "Z"]]);
        const [top, mid, bot] = r.shuffle(letters);
        const nm = r.pick(NAMES);
        const fem = ["Priya", "Ananya", "Meera", "Diya"].includes(nm[0]);
        const sorted = [top, mid, bot];
        const pairWhy = (a, b) =>
          a === top && b === mid
            ? L(`Observation 1: ${top} displaces ${mid}, so ${top} is more reactive than ${mid}.`, `प्रेक्षण 1: ${top}, ${mid} को विस्थापित करता है, इसलिए ${top} अधिक सक्रिय है।`)
            : L(`Observation 2: ${bot} cannot displace ${mid}, so ${bot} is less reactive than ${mid}.`, `प्रेक्षण 2: ${bot}, ${mid} को विस्थापित नहीं कर पाता, इसलिए ${bot} कम सक्रिय है।`);
        return task({
          text: L(
            `${nm[0]} tests three metals ${letters.join(", ")}. (1) ${top} displaces ${mid} from a solution of ${mid}'s sulphate. (2) ${bot} shows no change in a solution of ${mid}'s sulphate. What is the order of reactivity?`,
            `${nm[1]} तीन धातुओं ${letters.join(", ")} का परीक्षण ${fem ? "करती" : "करता"} है। (1) ${top}, ${mid} के सल्फेट विलयन से ${mid} को विस्थापित करता है। (2) ${bot} को ${mid} के सल्फेट विलयन में डालने पर कोई परिवर्तन नहीं होता। सक्रियता का क्रम क्या है?`,
          ),
          answer: orderChoice(r, sorted, ">", L("Reversed: a metal that displaces another is MORE reactive.", "उलटा क्रम: जो धातु दूसरी को विस्थापित करती है, वह अधिक सक्रिय होती है।"), pairWhy),
          data: { given: [`\\mathrm{${top}} + \\mathrm{${mid}SO_4} \\rightarrow \\mathrm{${top}SO_4} + \\mathrm{${mid}}`, `\\mathrm{${bot}} + \\mathrm{${mid}SO_4} \\rightarrow \\text{${L("no reaction", "कोई अभिक्रिया नहीं")}}`], find: [L("\\text{order of reactivity}", "\\text{सक्रियता का क्रम}")] },
          hint: L("A metal displaces another from its salt solution only if it is more reactive. Compare each metal with the one in the sulphate solution.", "कोई धातु दूसरी को उसके लवण-विलयन से तभी विस्थापित करती है जब वह अधिक सक्रिय हो। प्रत्येक धातु की तुलना सल्फेट विलयन वाली धातु से कीजिए।"),
          solution: L(
            `(1) ${top} > ${mid}\n(2) ${mid} > ${bot}\nOrder: ${top} > ${mid} > ${bot}`,
            `(1) ${top} > ${mid}\n(2) ${mid} > ${bot}\nक्रम: ${top} > ${mid} > ${bot}`,
          ),
        });
      }
      // Formula in vrsta vezi spojine iz vrstnih števil.
      const zm = r.pick([3, 11, 12, 13, 19, 20]),
        zn = r.pick([7, 8, 9, 16, 17]);
      const sm = shells(zm),
        sn = shells(zn);
      const qc = sm[sm.length - 1],
        qa = 8 - sn[sn.length - 1];
      const g = gcd(qc, qa);
      const a = qa / g,
        b = qc / g;
      const fm = (x, y) => uc(`X${x > 1 ? `_${x}` : ""}Y${y > 1 ? `_${y}` : ""}`);
      const ION = L("ionic", "आयनिक"),
        COV = L("covalent", "सहसंयोजक");
      const cand = [
        [`${fm(b, a)}, ${ION}`, L(`X has valency ${qc} and Y has valency ${qa}; the subscripts are swapped.`, `X की संयोजकता ${qc} और Y की ${qa} है; पादांक उलट गए हैं।`)],
        [`${fm(a, b)}, ${COV}`, L("X is a metal and Y a non-metal: electrons are transferred, so the bond is ionic.", "X धातु और Y अधातु है: इलेक्ट्रॉन स्थानांतरित होते हैं, इसलिए आबंध आयनिक है।")],
        [`${fm(1, 1)}, ${ION}`, L(`The charges +${qc} and −${qa} must cancel; XY would not be neutral.`, `+${qc} और −${qa} आवेश संतुलित होने चाहिए; XY उदासीन नहीं होगा।`)],
        [`${fm(b, a)}, ${COV}`, L("Wrong formula, and a metal–non-metal compound is ionic.", "सूत्र गलत है, और धातु–अधातु यौगिक आयनिक होता है।")],
        [`${fm(qc, qa)}, ${ION}`, L("Criss-cross the valencies: X takes Y's valency as subscript and Y takes X's.", "संयोजकताओं का आदान-प्रदान कीजिए: X का पादांक Y की संयोजकता और Y का पादांक X की संयोजकता है।")],
      ];
      const correct = `${fm(a, b)}, ${ION}`;
      const seen = new Set([correct]);
      return task({
        text: L(
          `Element X has atomic number ${zm} and element Y has atomic number ${zn}. What is the formula of the compound formed between them, and what type of bond does it have?`,
          `तत्व X की परमाणु संख्या ${zm} और तत्व Y की परमाणु संख्या ${zn} है। इनसे बने यौगिक का सूत्र क्या है और इसमें किस प्रकार का आबंध है?`,
        ),
        answer: choiceWhy(r, correct, cand.filter(([t]) => !seen.has(t) && seen.add(t)).slice(0, 3)),
        data: { given: [`Z(\\mathrm{X}) = ${zm}`, `Z(\\mathrm{Y}) = ${zn}`], find: [L("\\text{formula, bond}", "\\text{सूत्र, आबंध}")] },
        hint: L("Write both configurations: X loses its valence electrons, Y gains electrons to complete 8. Then balance the charges.", "दोनों विन्यास लिखिए: X अपने संयोजकता इलेक्ट्रॉन खोता है, Y अष्टक पूरा करने के लिए इलेक्ट्रॉन ग्रहण करता है। फिर आवेश संतुलित कीजिए।"),
        solution: L(
          `X: ${sm.join(", ")} → $\\mathrm{X^{${qc > 1 ? qc : ""}+}}$ (metal); Y: ${sn.join(", ")} → $\\mathrm{Y^{${qa > 1 ? qa : ""}-}}$ (non-metal)\nCharges cancel: $${a} \\cdot (+${qc}) + ${b} \\cdot (-${qa}) = 0$\nFormula ${fm(a, b)}; electron transfer → ionic bond.`,
          `X: ${sm.join(", ")} → $\\mathrm{X^{${qc > 1 ? qc : ""}+}}$ (धातु); Y: ${sn.join(", ")} → $\\mathrm{Y^{${qa > 1 ? qa : ""}-}}$ (अधातु)\nआवेश संतुलन: $${a} \\cdot (+${qc}) + ${b} \\cdot (-${qa}) = 0$\nसूत्र ${fm(a, b)}; इलेक्ट्रॉन स्थानांतरण → आयनिक आबंध।`,
        ),
      });
    },
  },
  {
    id: "exi-kem-periodic-table",
    topics: [T("periodic-table-and-periodic-properties")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      if (level === 1) {
        const v = r.int(0, 3);
        if (v === 3) {
          // Par v isti skupini.
          const a = r.int(3, 11);
          const ve = (z) => shells(z)[shells(z).length - 1];
          const pr = (x, y) => `${x} ${L("and", "और")} ${y}`;
          const wrong = [
            [a, a + 7],
            [a, a + 9],
            [a + 1, a + 8],
          ].map(([x, y]) => [
            pr(x, y),
            L(`Z = ${x} (${shells(x).join(", ")}) and Z = ${y} (${shells(y).join(", ")}) have different numbers of valence electrons, so they are in different groups.`, `Z = ${x} (${shells(x).join(", ")}) और Z = ${y} (${shells(y).join(", ")}) के संयोजकता इलेक्ट्रॉन अलग हैं, इसलिए ये अलग वर्गों में हैं।`),
          ]);
          return task({
            text: L("Which pair of atomic numbers belongs to elements of the same group of the modern periodic table?", "परमाणु संख्याओं का कौन-सा युग्म आधुनिक आवर्त सारणी के एक ही वर्ग के तत्वों का है?"),
            answer: choiceWhy(r, pr(a, a + 8), wrong),
            data: { given: [`Z_1, Z_2`], find: [L("\\text{same group}", "\\text{एक ही वर्ग}")] },
            hint: L("Elements of the same group have the same number of valence electrons. Write the configurations.", "एक ही वर्ग के तत्वों में संयोजकता इलेक्ट्रॉनों की संख्या समान होती है। विन्यास लिखिए।"),
            solution: L(
              `Z = ${a}: ${shells(a).join(", ")}; Z = ${a + 8}: ${shells(a + 8).join(", ")}\nBoth have ${ve(a)} valence electron${ve(a) > 1 ? "s" : ""} → same group.\nAnswer: ${a} and ${a + 8}`,
              `Z = ${a}: ${shells(a).join(", ")}; Z = ${a + 8}: ${shells(a + 8).join(", ")}\nदोनों में ${ve(a)} संयोजकता इलेक्ट्रॉन → एक ही वर्ग।\nउत्तर: ${a} और ${a + 8}`,
            ),
          });
        }
        const Z = r.int(3, 20);
        const p = posOf(Z);
        const cfg = p.sh.join(", ");
        const q = [
          ["In which group of the modern periodic table is it?", "आधुनिक आवर्त सारणी के किस वर्ग में यह है?"],
          ["In which period of the modern periodic table is it?", "आधुनिक आवर्त सारणी के किस आवर्त में यह है?"],
          ["What is its valency?", "इसकी संयोजकता क्या है?"],
        ][v];
        const ans = [p.group, p.period, p.val][v];
        const mist = [
          [
            [p.ve, L("For groups 13–18 the group number is the number of valence electrons + 10.", "वर्ग 13–18 के लिए वर्ग संख्या = संयोजकता इलेक्ट्रॉन + 10।")],
            [p.period, L("That is the period (number of shells), not the group.", "यह आवर्त (कोशों की संख्या) है, वर्ग नहीं।")],
          ],
          [
            [p.ve, L("The period equals the number of occupied shells, not the number of valence electrons.", "आवर्त = भरे हुए कोशों की संख्या, संयोजकता इलेक्ट्रॉनों की संख्या नहीं।")],
            [p.group, L("That is the group; the period is the number of shells.", "यह वर्ग है; आवर्त कोशों की संख्या है।")],
          ],
          [
            [p.ve, L("With more than 4 valence electrons the valency is 8 minus that number.", "4 से अधिक संयोजकता इलेक्ट्रॉन होने पर संयोजकता = 8 − वह संख्या।")],
            [8 - p.ve, L("With 1–4 valence electrons the valency equals the number of valence electrons.", "1–4 संयोजकता इलेक्ट्रॉन होने पर संयोजकता उन्हीं के बराबर होती है।")],
          ],
        ][v];
        const step = [
          L(p.ve <= 2 ? `Group = ${p.ve}` : `Group = ${p.ve} + 10 = ${p.group}`, p.ve <= 2 ? `वर्ग = ${p.ve}` : `वर्ग = ${p.ve} + 10 = ${p.group}`),
          L(`${p.period} shells → period ${p.period}`, `${p.period} कोश → आवर्त ${p.period}`),
          L(p.ve <= 4 ? `Valency = ${p.ve}` : `Valency = 8 − ${p.ve} = ${p.val}`, p.ve <= 4 ? `संयोजकता = ${p.ve}` : `संयोजकता = 8 − ${p.ve} = ${p.val}`),
        ][v];
        return task({
          text: L(`The atomic number of an element is ${Z}. ${q[0]}`, `एक तत्व की परमाणु संख्या ${Z} है। ${q[1]}`),
          answer: numM(ans, 0, mist[0][0] === ans ? [mist[1]] : mist),
          data: { given: [`Z = ${Z}`], find: [["\\text{group}", "\\text{period}", "\\text{valency}"][v]] },
          hint: L("Write the electronic configuration by shells (2, 8, 8, …).", "कोशों के अनुसार इलेक्ट्रॉनिक विन्यास (2, 8, 8, …) लिखिए।"),
          solution: L(
            `Configuration: ${cfg} → ${p.period} shells, ${p.ve} valence electron${p.ve > 1 ? "s" : ""}\n${step}\nAnswer: ${ans}`,
            `विन्यास: ${cfg} → ${p.period} कोश, ${p.ve} संयोजकता इलेक्ट्रॉन\n${step}\nउत्तर: ${ans}`,
          ),
        });
      }
      if (level === 2) {
        if (r.int(0, 2) === 2) {
          // Vrstno število iz periode in skupine.
          const Z = r.int(3, 20);
          const p = posOf(Z);
          const inner = sum(p.sh.slice(0, -1));
          const naive = p.group >= 13 ? inner + p.group : null;
          return task({
            text: L(
              `An element is placed in period ${p.period} and group ${p.group} of the modern periodic table. What is its atomic number?`,
              `एक तत्व आधुनिक आवर्त सारणी के आवर्त ${p.period} और वर्ग ${p.group} में है। इसकी परमाणु संख्या क्या है?`,
            ),
            answer: numM(Z, 0, [
              ...(naive ? [[naive, L("For groups 13–18 the number of valence electrons is the group number − 10.", "वर्ग 13–18 में संयोजकता इलेक्ट्रॉन = वर्ग संख्या − 10।")]] : []),
              [Z + 8, L("Period n means n shells; you added one shell too many.", "आवर्त n का अर्थ है n कोश; आपने एक कोश अधिक जोड़ा है।")],
              ...(Z - 8 >= 3 ? [[Z - 8, L("Period n means n shells; you left out one inner shell.", "आवर्त n का अर्थ है n कोश; आपने एक भीतरी कोश छोड़ दिया है।")]] : []),
            ]),
            data: { given: [`\\text{${L("period", "आवर्त")}} = ${p.period}`, `\\text{${L("group", "वर्ग")}} = ${p.group}`], find: ["Z"] },
            hint: L("Period = number of shells; the group gives the valence electrons (groups 13–18: group − 10).", "आवर्त = कोशों की संख्या; वर्ग से संयोजकता इलेक्ट्रॉन मिलते हैं (वर्ग 13–18: वर्ग − 10)।"),
            solution: L(
              `Valence electrons: ${p.group >= 13 ? `${p.group} − 10 = ${p.ve}` : p.ve}\nConfiguration: ${p.sh.join(", ")}\n$Z = ${p.sh.join(" + ")} = ${Z}$`,
              `संयोजकता इलेक्ट्रॉन: ${p.group >= 13 ? `${p.group} − 10 = ${p.ve}` : p.ve}\nविन्यास: ${p.sh.join(", ")}\n$Z = ${p.sh.join(" + ")} = ${Z}$`,
            ),
          });
        }
        // Razvrščanje po polmeru ali elektronegativnosti.
        const prop = r.int(0, 1); // 0 polmer, 1 elektronegativnost
        const ser = r.pick(prop === 0 ? ["P2", "P3", "G1", "G17"] : ["P2", "P3", "G17"]);
        const all = SERIES[ser];
        const els = all.length > 4 ? r.shuffle(all).slice(0, 4) : [...all];
        const asc = r.int(0, 1) === 1;
        const key = prop === 0 ? "r" : "en";
        const val = (s) => PT[s][key];
        const sorted = [...els].sort((a, b) => (asc ? val(a) - val(b) : val(b) - val(a)));
        const period = ser[0] === "P";
        const unit = prop === 0 ? " pm" : "";
        const pname = prop === 0 ? L("atomic radius", "परमाणु त्रिज्या") : L("electronegativity", "विद्युतऋणता");
        const trend =
          prop === 0
            ? period
              ? L("Across a period the nuclear charge increases while electrons enter the same shell, so the atomic radius decreases.", "आवर्त में बाएँ से दाएँ नाभिकीय आवेश बढ़ता है पर इलेक्ट्रॉन उसी कोश में जाते हैं, इसलिए परमाणु त्रिज्या घटती है।")
              : L("Down a group a new shell is added each time, so the atomic radius increases.", "वर्ग में नीचे जाने पर हर बार एक नया कोश जुड़ता है, इसलिए परमाणु त्रिज्या बढ़ती है।")
            : period
              ? L("Across a period the atoms get smaller and hold bonding electrons more strongly, so electronegativity increases.", "आवर्त में परमाणु छोटे होते जाते हैं और आबंधी इलेक्ट्रॉनों को अधिक प्रबलता से खींचते हैं, इसलिए विद्युतऋणता बढ़ती है।")
              : L("Down a group the atoms get larger, so electronegativity decreases.", "वर्ग में नीचे परमाणु बड़े होते जाते हैं, इसलिए विद्युतऋणता घटती है।");
        const ordWord = asc ? L("increasing", "बढ़ते") : L("decreasing", "घटते");
        return task({
          text: L(`Arrange ${els.join(", ")} in ${ordWord} order of ${pname}.`, `${els.join(", ")} को ${pname} के ${ordWord} क्रम में व्यवस्थित कीजिए।`),
          answer: orderChoice(r, sorted, asc ? "<" : ">", L(`Reversed. ${trend}`, `उलटा क्रम। ${trend}`), (a, b) =>
            L(`${a} (${en(val(a))}${unit}) and ${b} (${en(val(b))}${unit}) are in the wrong order.`, `${a} (${en(val(a))}${unit}) और ${b} (${en(val(b))}${unit}) का क्रम गलत है।`),
          ),
          data: { given: [`\\mathrm{${els.join(",\\ ")}}`], find: [prop === 0 ? "r" : "\\chi"] },
          hint: L(`Decide whether the elements lie in one period or in one group, then apply the trend of ${pname}.`, `देखिए कि तत्व एक आवर्त में हैं या एक वर्ग में, फिर ${pname} की प्रवृत्ति लगाइए।`),
          solution: L(
            `${trend}\nValues (NCERT${prop === 0 ? ", pm" : ", Pauling"}): ${els.map((s) => `${s} ${en(val(s))}`).join(", ")}\nOrder: ${sorted.join(asc ? " < " : " > ")}`,
            `${trend}\nमान (NCERT${prop === 0 ? ", pm" : ", पॉलिंग"}): ${els.map((s) => `${s} ${en(val(s))}`).join(", ")}\nक्रम: ${sorted.join(asc ? " < " : " > ")}`,
          ),
        });
      }
      // Raven 3: izjeme.
      const v = r.int(0, 2);
      if (v === 0) {
        // Ionizacijska entalpija z izjemami.
        const per = r.pick(["P2", "P3"]);
        const ex = r.pick(IE_EX[per]);
        const rest = r.shuffle(SERIES[per].filter((s) => !ex.pair.includes(s))).slice(0, 2);
        const els = SERIES[per].filter((s) => ex.pair.includes(s) || rest.includes(s));
        const asc = r.int(0, 1) === 1;
        const ie = (s) => PT[s].ie;
        const sorted = [...els].sort((a, b) => (asc ? ie(a) - ie(b) : ie(b) - ie(a)));
        const naive = asc ? [...els] : [...els].reverse();
        const reason = L(ex.why[0], ex.why[1]);
        return task({
          text: L(
            `Arrange ${els.join(", ")} in ${asc ? "increasing" : "decreasing"} order of first ionisation enthalpy.`,
            `${els.join(", ")} को प्रथम आयनन एन्थैल्पी के ${asc ? "बढ़ते" : "घटते"} क्रम में व्यवस्थित कीजिए।`,
          ),
          answer: orderChoice(
            r,
            sorted,
            asc ? "<" : ">",
            L("Reversed: ionisation enthalpy generally increases across a period.", "उलटा क्रम: आवर्त में आयनन एन्थैल्पी सामान्यतः बढ़ती है।"),
            (a, b) => L(`${a} (${ie(a)} kJ/mol) and ${b} (${ie(b)} kJ/mol) are in the wrong order.`, `${a} (${ie(a)} kJ/mol) और ${b} (${ie(b)} kJ/mol) का क्रम गलत है।`),
            [[naive, L(`This follows the general trend only. Exception: ${reason}`, `यह केवल सामान्य प्रवृत्ति है। अपवाद: ${reason}`)]],
          ),
          data: { given: [`\\mathrm{${els.join(",\\ ")}}`], find: ["\\Delta_i H_1"] },
          hint: L("Use the general trend across the period, but check the pairs Be/B, N/O (or Mg/Al, P/S): stable s² and half-filled p³ configurations.", "आवर्त की सामान्य प्रवृत्ति लीजिए, पर युग्म Be/B, N/O (या Mg/Al, P/S) जाँचिए: स्थायी s² और अर्धपूर्ण p³ विन्यास।"),
          solution: L(
            `General trend: increases across the period.\nException: ${reason}\nValues (kJ/mol): ${els.map((s) => `${s} ${ie(s)}`).join(", ")}\nOrder: ${sorted.join(asc ? " < " : " > ")}`,
            `सामान्य प्रवृत्ति: आवर्त में बढ़ती है।\nअपवाद: ${reason}\nमान (kJ/mol): ${els.map((s) => `${s} ${ie(s)}`).join(", ")}\nक्रम: ${sorted.join(asc ? " < " : " > ")}`,
          ),
        });
      }
      if (v === 1) {
        // Entalpija sprejema elektrona.
        const els = r.pick(EG_SETS);
        const asc = r.int(0, 1) === 1;
        const m = (s) => -EG[s];
        const sorted = [...els].sort((a, b) => (asc ? m(a) - m(b) : m(b) - m(a)));
        const naive = [...els].sort((a, b) => (asc ? PT[a].en - PT[b].en : PT[b].en - PT[a].en));
        const why = L(
          "F and O are very small: an added electron is crowded into the compact 2p subshell and repelled strongly, so their values are less negative than those of Cl and S.",
          "F और O बहुत छोटे हैं: जुड़ा हुआ इलेक्ट्रॉन संकुचित 2p उपकोश में प्रबल प्रतिकर्षण झेलता है, इसलिए इनके मान Cl और S से कम ऋणात्मक हैं।",
        );
        return task({
          text: L(
            `Arrange ${els.join(", ")} in ${asc ? "increasing" : "decreasing"} order of the magnitude of their electron gain enthalpy (how negative it is).`,
            `${els.join(", ")} को इनकी इलेक्ट्रॉन लब्धि एन्थैल्पी के परिमाण (कितनी ऋणात्मक है) के ${asc ? "बढ़ते" : "घटते"} क्रम में व्यवस्थित कीजिए।`,
          ),
          answer: orderChoice(
            r,
            sorted,
            asc ? "<" : ">",
            L("Reversed: the order runs the other way.", "उलटा क्रम: क्रम दूसरी दिशा में है।"),
            (a, b) => L(`${a} (${EG[a]} kJ/mol) and ${b} (${EG[b]} kJ/mol) are in the wrong order.`, `${a} (${EG[a]} kJ/mol) और ${b} (${EG[b]} kJ/mol) का क्रम गलत है।`),
            [[naive, L(`This is the electronegativity order. ${why}`, `यह विद्युतऋणता का क्रम है। ${why}`)]],
          ),
          data: { given: [`\\mathrm{${els.join(",\\ ")}}`], find: ["|\\Delta_{eg} H|"] },
          hint: L("Electron gain enthalpy becomes less negative down a group, but compare the 2nd-period element with the 3rd-period one carefully.", "वर्ग में नीचे इलेक्ट्रॉन लब्धि एन्थैल्पी कम ऋणात्मक होती है, पर दूसरे आवर्त के तत्व की तुलना तीसरे आवर्त के तत्व से ध्यान से कीजिए।"),
          solution: L(
            `${why}\nValues (kJ/mol): ${els.map((s) => `${s} ${EG[s]}`).join(", ")}\nOrder of magnitude: ${sorted.join(asc ? " < " : " > ")}`,
            `${why}\nमान (kJ/mol): ${els.map((s) => `${s} ${EG[s]}`).join(", ")}\nपरिमाण का क्रम: ${sorted.join(asc ? " < " : " > ")}`,
          ),
        });
      }
      // Izoelektronski ioni.
      const ions = r.shuffle(ISO).slice(0, 4).sort((a, b) => a[1] - b[1]);
      const asc = r.int(0, 1) === 1;
      const sorted = (asc ? [...ions].reverse() : ions).map((x) => x[0]);
      const lab = ions.map((x) => uc(x[0]));
      return task({
        text: L(`Arrange the ions ${lab.join(", ")} in ${asc ? "increasing" : "decreasing"} order of ionic radius.`, `आयनों ${lab.join(", ")} को आयनिक त्रिज्या के ${asc ? "बढ़ते" : "घटते"} क्रम में व्यवस्थित कीजिए।`),
        answer: orderChoice(
          r,
          sorted,
          asc ? "<" : ">",
          L("Reversed: with the same 10 electrons, a larger nuclear charge pulls the electrons closer, so the radius decreases as Z increases.", "उलटा क्रम: समान 10 इलेक्ट्रॉनों पर अधिक नाभिकीय आवेश इलेक्ट्रॉनों को पास खींचता है, इसलिए Z बढ़ने पर त्रिज्या घटती है।"),
          (a, b) => L(`${uc(a)} and ${uc(b)} are in the wrong order: compare their nuclear charges.`, `${uc(a)} और ${uc(b)} का क्रम गलत है: इनके नाभिकीय आवेश की तुलना कीजिए।`),
        ),
        data: false, // Z ionov sodijo v rešitev (niso v besedilu).
        hint: L("Count the electrons in each ion. If they are equal (isoelectronic), compare the nuclear charges.", "प्रत्येक आयन में इलेक्ट्रॉन गिनिए। यदि वे समान हैं (समइलेक्ट्रॉनिक), तो नाभिकीय आवेशों की तुलना कीजिए।"),
        solution: L(
          `Every ion has 10 electrons (isoelectronic): ${ions.map(([s, z]) => `${uc(s)} Z = ${z}`).join(", ")}\nLarger Z → electrons pulled closer → smaller ion.\nOrder: ${sorted.map(uc).join(asc ? " < " : " > ")}`,
          `सभी आयनों में 10 इलेक्ट्रॉन हैं (समइलेक्ट्रॉनिक): ${ions.map(([s, z]) => `${uc(s)} Z = ${z}`).join(", ")}\nअधिक Z → इलेक्ट्रॉन पास खिंचते हैं → छोटा आयन।\nक्रम: ${sorted.map(uc).join(asc ? " < " : " > ")}`,
        ),
      });
    },
  },
  {
    id: "exi-kem-chemical-bonding",
    topics: [T("chemical-bonding")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const shp = (bp, lp) => L(SHAPE[`${bp},${lp}`][0], SHAPE[`${bp},${lp}`][1]);
      const hyb = (H) => uc(HYB[H]);
      // Koraki VSEPR za rešitev.
      const steps = (m) => {
        const hf = `H = \\tfrac{1}{2}(${m.V} + ${m.M}${m.q > 0 ? ` - ${m.q}` : m.q < 0 ? ` + ${-m.q}` : ""}) = ${m.H}`;
        return L(
          `Central atom ${m.c}: V = ${m.V} valence electrons, M = ${m.M} monovalent atoms${m.q ? `, charge ${m.q > 0 ? "+" : "−"}${Math.abs(m.q)}` : ""}.\n$${hf}$ → ${uc(HYB[m.H])}\nBond pairs = ${m.bp}, lone pairs = ${m.H} − ${m.bp} = ${m.lp} → ${SHAPE[`${m.bp},${m.lp}`][0]}`,
          `केंद्रीय परमाणु ${m.c}: V = ${m.V} संयोजकता इलेक्ट्रॉन, M = ${m.M} एकसंयोजी परमाणु${m.q ? `, आवेश ${m.q > 0 ? "+" : "−"}${Math.abs(m.q)}` : ""}।\n$${hf}$ → ${uc(HYB[m.H])}\nआबंधी युग्म = ${m.bp}, एकाकी युग्म = ${m.H} − ${m.bp} = ${m.lp} → ${SHAPE[`${m.bp},${m.lp}`][1]}`,
        );
      };
      const hintV = L(
        "Find the hybridisation number H = ½(V + M − C + A): V valence electrons of the central atom, M monovalent atoms, C cation charge, A anion charge. Lone pairs = H − number of bonded atoms.",
        "संकरण संख्या H = ½(V + M − C + A) ज्ञात कीजिए: V केंद्रीय परमाणु के संयोजकता इलेक्ट्रॉन, M एकसंयोजी परमाणु, C धनायन आवेश, A ऋणायन आवेश। एकाकी युग्म = H − आबंधित परमाणुओं की संख्या।",
      );
      // Napačne oblike z razlago.
      const shapeWrong = (m) => {
        const out = [];
        const add = (bp, lp, why) => SHAPE[`${bp},${lp}`] && out.push([shp(bp, lp), why]);
        if (m.lp) {
          add(m.H, 0, L(`That is the arrangement of all ${m.H} electron pairs; the shape describes only the positions of the atoms.`, `यह सभी ${m.H} इलेक्ट्रॉन युग्मों की व्यवस्था है; आकृति केवल परमाणुओं की स्थिति बताती है।`));
          add(m.bp, 0, L(`That ignores the ${m.lp} lone pair${m.lp > 1 ? "s" : ""} on the central atom.`, `इसमें केंद्रीय परमाणु के ${m.lp} एकाकी युग्म छूट ${m.lp > 1 ? "गए हैं" : "गया है"}।`));
        }
        for (const k of r.shuffle(Object.keys(SHAPE))) {
          const [bp, lp] = k.split(",").map(Number);
          if (bp === m.bp && lp === m.lp) continue;
          if (Math.abs(bp + lp - m.H) > 1) continue;
          add(bp, lp, L(`That shape needs ${bp} bonded atoms and ${lp} lone pair${lp === 1 ? "" : "s"}; here there are ${m.bp} and ${m.lp}.`, `इस आकृति के लिए ${bp} आबंधित परमाणु और ${lp} एकाकी युग्म चाहिए; यहाँ ${m.bp} और ${m.lp} हैं।`));
        }
        const correct = shp(m.bp, m.lp);
        const seen = new Set([correct]);
        return out.filter(([t]) => !seen.has(t) && seen.add(t)).slice(0, 3);
      };
      const mf = (m) => ce(m.f);
      if (level === 1) {
        const v = r.int(0, 2);
        if (v === 0 || v === 1) {
          const m = MOL[r.pick(SIMPLE)];
          const wrongS = shapeWrong(m);
          const hybWrong = [2, 3, 4, 5]
            .filter((h) => h !== m.H)
            .map((h) => [hyb(h), L(`${uc(HYB[h])} needs ${h} electron domains; ${uc(m.f)} has ${m.H} (${m.bp} bonds + ${m.lp} lone pairs).`, `${uc(HYB[h])} के लिए ${h} इलेक्ट्रॉन क्षेत्र चाहिए; ${uc(m.f)} में ${m.H} हैं (${m.bp} आबंध + ${m.lp} एकाकी युग्म)।`)]);
          return task({
            text: v === 0 ? L(`What is the shape of ${mf(m)} according to VSEPR theory?`, `VSEPR सिद्धांत के अनुसार ${mf(m)} की आकृति क्या है?`) : L(`What is the hybridisation of the central atom in ${mf(m)}?`, `${mf(m)} में केंद्रीय परमाणु का संकरण क्या है?`),
            answer: v === 0 ? choiceWhy(r, shp(m.bp, m.lp), wrongS) : choiceWhy(r, hyb(m.H), hybWrong),
            data: { given: [`\\mathrm{${m.f}}`], find: [v === 0 ? L("\\text{shape}", "\\text{आकृति}") : L("\\text{hybridisation}", "\\text{संकरण}")] },
            hint: hintV,
            solution: steps(m),
          });
        }
        const zero = r.int(0, 1) === 1;
        const pick = r.shuffle(zero ? DIPOLE_ZERO : DIPOLE_POLAR)[0];
        const others = r.shuffle(zero ? DIPOLE_POLAR : DIPOLE_ZERO).slice(0, 3);
        const why = (f) => {
          if (f === "CHCl_3" || f === "CH_3Cl") return L(`In ${uc(f)} the four bonds around C are not identical (C–H and C–Cl), so their dipoles do not cancel.`, `${uc(f)} में C के चारों आबंध समान नहीं हैं (C–H और C–Cl), इसलिए उनके द्विध्रुव निरस्त नहीं होते।`);
          const m = MOL[f];
          const s = SHAPE[`${m.bp},${m.lp}`];
          return DIPOLE_ZERO.includes(f)
            ? L(`${uc(f)} is ${s[0]} and symmetrical: its bond dipoles cancel, μ = 0.`, `${uc(f)} ${s[1]} और सममित है: आबंध द्विध्रुव निरस्त हो जाते हैं, μ = 0।`)
            : L(`${uc(f)} is ${s[0]}${m.lp ? ` with ${m.lp} lone pair${m.lp > 1 ? "s" : ""}` : ""}: its bond dipoles do not cancel, μ ≠ 0.`, `${uc(f)} ${s[1]} है${m.lp ? ` (${m.lp} एकाकी युग्म)` : ""}: आबंध द्विध्रुव निरस्त नहीं होते, μ ≠ 0।`);
        };
        return task({
          text: zero ? L("Which of these molecules has zero dipole moment?", "इनमें से किस अणु का द्विध्रुव आघूर्ण शून्य है?") : L("Which of these molecules has a non-zero dipole moment?", "इनमें से किस अणु का द्विध्रुव आघूर्ण शून्य नहीं है?"),
          answer: choiceWhy(r, uc(pick), others.map((f) => [uc(f), why(f)])),
          data: { given: [[pick, ...others].map((f) => `\\mathrm{${f}}`).join(",\\ ")], find: ["\\mu"] },
          hint: L("Find each shape. A molecule is non-polar only if identical bonds are arranged symmetrically so that the bond dipoles cancel.", "प्रत्येक की आकृति ज्ञात कीजिए। अणु तभी अध्रुवीय है जब समान आबंध सममित रूप से व्यवस्थित हों और आबंध द्विध्रुव निरस्त हो जाएँ।"),
          solution: L(`${why(pick)}\nAnswer: ${uc(pick)}`, `${why(pick)}\nउत्तर: ${uc(pick)}`),
        });
      }
      if (level === 2) {
        const v = r.int(0, 3);
        if (v === 0) {
          const m = MOL[r.pick(EXPANDED)];
          return task({
            text: L(`What is the shape of ${mf(m)} according to VSEPR theory?`, `VSEPR सिद्धांत के अनुसार ${mf(m)} की आकृति क्या है?`),
            answer: choiceWhy(r, shp(m.bp, m.lp), shapeWrong(m)),
            data: { given: [`\\mathrm{${m.f}}`], find: [L("\\text{shape}", "\\text{आकृति}")] },
            hint: hintV,
            solution: steps(m),
          });
        }
        if (v === 1) {
          const m = MOL[r.pick([...SIMPLE, ...EXPANDED])];
          const noQ = (m.V + m.M) / 2 - m.bp;
          const oAsM = (m.V + m.M + m.D - m.q) / 2 - m.bp;
          return task({
            text: L(`How many lone pairs of electrons are there on the central atom of ${mf(m)}?`, `${mf(m)} के केंद्रीय परमाणु पर कितने एकाकी इलेक्ट्रॉन युग्म हैं?`),
            answer: numM(m.lp, 0, [
              ...(m.q ? [[noQ, L("Include the charge of the ion: subtract the cation charge, add the anion charge.", "आयन का आवेश भी लीजिए: धनायन आवेश घटाइए, ऋणायन आवेश जोड़िए।")]] : []),
              ...(m.D ? [[oAsM, L("Oxygen forms a double bond and is not counted among the monovalent atoms M.", "ऑक्सीजन द्विआबंध बनाता है और एकसंयोजी परमाणुओं M में नहीं गिना जाता।")]] : []),
              [m.H, L("That is the total number of electron pairs (steric number); subtract the bond pairs.", "यह कुल इलेक्ट्रॉन युग्म (संकरण संख्या) है; आबंधी युग्म घटाइए।")],
            ]),
            data: false, // V osrednjega atoma ni v besedilu (učenec ga določi sam).
            hint: hintV,
            formula: "H = \\tfrac{1}{2}(V + M - C + A)",
            solution: steps(m),
          });
        }
        if (v === 2) {
          const [s, ne] = r.pick(MO_SP);
          const mo = moFill(ne);
          return task({
            text: L(`Using molecular orbital theory, find the bond order of $\\mathrm{${s}}$.`, `आण्विक कक्षक सिद्धांत से $\\mathrm{${s}}$ की आबंध कोटि ज्ञात कीजिए।`),
            answer: numM(mo.bo, 1, [
              [mo.nb - mo.na, L("Bond order is half the difference: (Nb − Na)/2.", "आबंध कोटि अंतर का आधा है: (Nb − Na)/2।")],
              [mo.nb / 2, L("Subtract the electrons in antibonding orbitals.", "प्रतिआबंधी कक्षकों के इलेक्ट्रॉन घटाइए।")],
            ]),
            data: false, // število elektronov učenec prešteje sam
            hint: L("Count all electrons of the species (adjust for the charge), fill the MO diagram, then use B.O. = ½(Nb − Na).", "स्पीशीज़ के सभी इलेक्ट्रॉन गिनिए (आवेश के अनुसार), MO आरेख भरिए, फिर आबंध कोटि = ½(Nb − Na)।"),
            formula: "\\text{B.O.} = \\tfrac{1}{2}(N_b - N_a)",
            solution: L(
              `Electrons: ${ne}\n$${mo.cfg}$\n$N_b = ${mo.nb},\\ N_a = ${mo.na}$\n$\\text{B.O.} = \\tfrac{1}{2}(${mo.nb} - ${mo.na}) = ${en(mo.bo)}$`,
              `इलेक्ट्रॉन: ${ne}\n$${mo.cfg}$\n$N_b = ${mo.nb},\\ N_a = ${mo.na}$\n$\\text{B.O.} = \\tfrac{1}{2}(${mo.nb} - ${mo.na}) = ${en(mo.bo)}$ (आबंध कोटि)`,
            ),
          });
        }
        // Vezni koti.
        const keys = Object.keys(ANGLE);
        const drop = r.int(0, keys.length - 1);
        const els = keys.filter((_, i) => i !== drop);
        const asc = r.int(0, 1) === 1;
        const sorted = [...els].sort((a, b) => (asc ? ANGLE[a] - ANGLE[b] : ANGLE[b] - ANGLE[a]));
        const lab = els.map((f) => ce(f)).join(", ");
        return task({
          text: L(`Arrange ${lab} in ${asc ? "increasing" : "decreasing"} order of bond angle.`, `${lab} को आबंध कोण के ${asc ? "बढ़ते" : "घटते"} क्रम में व्यवस्थित कीजिए।`),
          answer: orderChoice(
            r,
            sorted,
            asc ? "<" : ">",
            L("Reversed: more lone pairs on the central atom squeeze the bond angle (lp–lp > lp–bp > bp–bp repulsion).", "उलटा क्रम: केंद्रीय परमाणु पर अधिक एकाकी युग्म आबंध कोण को घटाते हैं (lp–lp > lp–bp > bp–bp प्रतिकर्षण)।"),
            (a, b) => L(`${uc(a)} (${ANGLE[a]}°) and ${uc(b)} (${ANGLE[b]}°) are in the wrong order.`, `${uc(a)} (${ANGLE[a]}°) और ${uc(b)} (${ANGLE[b]}°) का क्रम गलत है।`),
          ),
          data: { given: els.map((f) => `\\mathrm{${f}}`), find: ["\\angle"] },
          hint: L("Find the hybridisation and the number of lone pairs of each central atom: sp > sp² > sp³, and among sp³ more lone pairs mean a smaller angle.", "प्रत्येक केंद्रीय परमाणु का संकरण और एकाकी युग्म ज्ञात कीजिए: sp > sp² > sp³, और sp³ में अधिक एकाकी युग्म का अर्थ छोटा कोण।"),
          solution: L(
            `${els.map((f) => `${uc(f)}: ${uc(HYB[MOL[f].H])}, ${MOL[f].lp} lone pair${MOL[f].lp === 1 ? "" : "s"}, ${ANGLE[f]}°`).join("\n")}\nOrder: ${sorted.map(uc).join(asc ? " < " : " > ")}`,
            `${els.map((f) => `${uc(f)}: ${uc(HYB[MOL[f].H])}, ${MOL[f].lp} एकाकी युग्म, ${ANGLE[f]}°`).join("\n")}\nक्रम: ${sorted.map(uc).join(asc ? " < " : " > ")}`,
          ),
        });
      }
      // Raven 3.
      const v = r.int(0, 2);
      if (v === 0) {
        // Hibridizacija in oblika skupaj.
        const m = MOL[r.pick(EXPANDED)];
        const opt = (H, bp, lp) => `${hyb(H)}, ${shp(bp, lp)}`;
        const cand = [];
        if (m.lp) cand.push([opt(m.H, m.H, 0), L("The hybridisation is right, but the shape counts only the atoms, not the lone pairs.", "संकरण सही है, पर आकृति में केवल परमाणु गिने जाते हैं, एकाकी युग्म नहीं।")]);
        if (m.lp && HYB[m.bp] && SHAPE[`${m.bp},0`]) cand.push([opt(m.bp, m.bp, 0), L(`The ${m.lp} lone pair${m.lp > 1 ? "s" : ""} on the central atom also take part in hybridisation.`, `केंद्रीय परमाणु के ${m.lp} एकाकी युग्म भी संकरण में भाग लेते हैं।`)]);
        for (const k of r.shuffle(Object.keys(SHAPE))) {
          const [bp, lp] = k.split(",").map(Number);
          if (bp + lp === m.H && !(bp === m.bp && lp === m.lp)) cand.push([opt(m.H, bp, lp), L(`That shape needs ${lp} lone pair${lp === 1 ? "" : "s"}; ${uc(m.f)} has ${m.lp}.`, `इस आकृति के लिए ${lp} एकाकी युग्म चाहिए; ${uc(m.f)} में ${m.lp} हैं।`)]);
          if (HYB[bp + lp] && bp + lp !== m.H && bp === m.bp) cand.push([opt(bp + lp, bp, lp), L(`That needs H = ${bp + lp}; for ${uc(m.f)} H = ${m.H}.`, `इसके लिए H = ${bp + lp} चाहिए; ${uc(m.f)} के लिए H = ${m.H}।`)]);
        }
        const correct = opt(m.H, m.bp, m.lp);
        const seen = new Set([correct]);
        return task({
          text: L(`Which option gives the hybridisation of the central atom and the shape of ${mf(m)}?`, `कौन-सा विकल्प ${mf(m)} के केंद्रीय परमाणु का संकरण और आकृति सही बताता है?`),
          answer: choiceWhy(r, correct, cand.filter(([t]) => !seen.has(t) && seen.add(t)).slice(0, 3)),
          data: { given: [`\\mathrm{${m.f}}`], find: [L("\\text{hybridisation, shape}", "\\text{संकरण, आकृति}")] },
          hint: hintV,
          solution: steps(m),
        });
      }
      if (v === 1) {
        // Nesparjeni elektroni (MO), past pri B2/C2.
        const [s, ne] = r.pick(MO_SP.filter(([, n]) => n >= 6));
        const mo = moFill(ne);
        const alt = moFill(ne, ne <= 14);
        return task({
          text: L(`How many unpaired electrons does $\\mathrm{${s}}$ have according to molecular orbital theory? Is it paramagnetic?`, `आण्विक कक्षक सिद्धांत के अनुसार $\\mathrm{${s}}$ में कितने अयुग्मित इलेक्ट्रॉन हैं? क्या यह अनुचुंबकीय है?`),
          answer: numM(mo.unp, 0, [
            [alt.unp, ne <= 14 ? L("For species with up to 14 electrons (B₂, C₂, N₂) the π2p orbitals lie below σ2p.", "14 तक इलेक्ट्रॉन वाली स्पीशीज़ (B₂, C₂, N₂) में π2p कक्षक σ2p से नीचे होते हैं।") : L("For O₂ and heavier species σ2p lies below π2p.", "O₂ और भारी स्पीशीज़ में σ2p, π2p से नीचे होता है।")],
            [mo.unp ? 0 : 2, L("Apply Hund's rule to the two degenerate π orbitals.", "दो समऊर्जीय π कक्षकों पर हुंड का नियम लगाइए।")],
          ]),
          data: false,
          hint: L("Write the MO configuration in the correct energy order and fill degenerate π orbitals singly first (Hund's rule).", "सही ऊर्जा क्रम में MO विन्यास लिखिए और समऊर्जीय π कक्षकों को पहले एक-एक करके भरिए (हुंड का नियम)।"),
          solution: L(
            `Electrons: ${ne} → ${ne <= 14 ? "π2p below σ2p" : "σ2p below π2p"}\n$${mo.cfg}$\nUnpaired electrons: ${mo.unp} → ${mo.unp ? "paramagnetic" : "diamagnetic"}`,
            `इलेक्ट्रॉन: ${ne} → ${ne <= 14 ? "π2p, σ2p से नीचे" : "σ2p, π2p से नीचे"}\n$${mo.cfg}$\nअयुग्मित इलेक्ट्रॉन: ${mo.unp} → ${mo.unp ? "अनुचुंबकीय" : "प्रतिचुंबकीय"}`,
          ),
        });
      }
      // Dolžina vezi / stabilnost iz veznega reda.
      const pool = r.shuffle(["N_2", "O_2^+", "O_2", "O_2^-", "O_2^{2-}"]).slice(0, 4);
      const ne = Object.fromEntries(MO_SP);
      const bo = (s) => moFill(ne[s]).bo;
      const kind = r.int(0, 1); // 0 dolžina vezi, 1 disociacijska entalpija
      const asc = r.int(0, 1) === 1;
      const key = (s) => (kind === 0 ? -bo(s) : bo(s));
      const sorted = [...pool].sort((a, b) => (asc ? key(a) - key(b) : key(b) - key(a)));
      const pname = kind === 0 ? L("bond length", "आबंध लंबाई") : L("bond dissociation enthalpy", "आबंध वियोजन एन्थैल्पी");
      return task({
        text: L(`Arrange ${pool.map(ce).join(", ")} in ${asc ? "increasing" : "decreasing"} order of ${pname}.`, `${pool.map(ce).join(", ")} को ${pname} के ${asc ? "बढ़ते" : "घटते"} क्रम में व्यवस्थित कीजिए।`),
        answer: orderChoice(
          r,
          sorted,
          asc ? "<" : ">",
          kind === 0 ? L("Reversed: a higher bond order means a SHORTER bond.", "उलटा क्रम: अधिक आबंध कोटि का अर्थ छोटा आबंध है।") : L("Reversed: a higher bond order means a STRONGER bond.", "उलटा क्रम: अधिक आबंध कोटि का अर्थ प्रबल आबंध है।"),
          (a, b) => L(`${uc(a)} (B.O. ${en(bo(a))}) and ${uc(b)} (B.O. ${en(bo(b))}) are in the wrong order.`, `${uc(a)} (आबंध कोटि ${en(bo(a))}) और ${uc(b)} (आबंध कोटि ${en(bo(b))}) का क्रम गलत है।`),
        ),
        data: false,
        hint: L("Find each bond order from the MO configuration. Higher bond order → shorter and stronger bond.", "MO विन्यास से प्रत्येक की आबंध कोटि ज्ञात कीजिए। अधिक आबंध कोटि → छोटा और प्रबल आबंध।"),
        solution: L(
          `Bond orders: ${pool.map((s) => `${uc(s)} ${en(bo(s))}`).join(", ")}\n${kind === 0 ? "Bond length decreases as bond order increases." : "Bond dissociation enthalpy increases with bond order."}\nOrder: ${sorted.map(uc).join(asc ? " < " : " > ")}`,
          `आबंध कोटि: ${pool.map((s) => `${uc(s)} ${en(bo(s))}`).join(", ")}\n${kind === 0 ? "आबंध कोटि बढ़ने पर आबंध लंबाई घटती है।" : "आबंध कोटि बढ़ने पर आबंध वियोजन एन्थैल्पी बढ़ती है।"}\nक्रम: ${sorted.map(uc).join(asc ? " < " : " > ")}`,
        ),
      });
    },
  },
  {
    id: "exi-kem-organic-nomenclature",
    topics: [T("organic-chemistry-nomenclature-and-isomerism")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const MASS = { C: 12, H: 1, O: 16, N: 14 };
      const molar = (f) => sum(Object.entries(atoms(f)).map(([e, n]) => MASS[e] * n));
      const HF = {
        alkane: (k) => formulaCk(k, 2 * k + 2),
        alcohol: (k) => `${formulaCk(k, 2 * k + 1)}OH`,
        aldehyde: (k) => formulaCk(k, 2 * k, "O"),
        acid: (k) => formulaCk(k, 2 * k, "O_2"),
        alkene: (k) => formulaCk(k, 2 * k),
        alkyne: (k) => formulaCk(k, 2 * k - 2),
        ketone: (k) => formulaCk(k, 2 * k, "O"),
      };
      // IUPAC izbira.
      const iupac = (bank) => {
        const [s, correct, wrong] = r.pick(bank);
        return task({
          text: L(`What is the IUPAC name of $\\mathrm{${s}}$?`, `$\\mathrm{${s}}$ का IUPAC नाम क्या है?`),
          answer: choiceWhy(r, correct, wrong.map(([w, e, h]) => [w, L(e, h)])),
          data: { given: [`\\mathrm{${s}}`], find: [L("\\text{IUPAC name}", "\\text{IUPAC नाम}")] },
          hint: L(
            "Pick the longest chain that contains the functional group or multiple bond, number it so that the principal group (then multiple bonds, then substituents) gets the lowest locants, and write prefixes alphabetically.",
            "प्रकार्यात्मक समूह या बहुआबंध वाली सबसे लंबी शृंखला चुनिए, ऐसे क्रमांकित कीजिए कि मुख्य समूह (फिर बहुआबंध, फिर प्रतिस्थापी) को सबसे छोटे स्थान-अंक मिलें, और उपसर्ग वर्णक्रम में लिखिए।",
          ),
          solution: L(
            `Longest suitable chain and lowest locants give: ${correct}.\n${wrong.map(([w, e]) => `Not ${w}: ${e}`).join("\n")}`,
            `सबसे लंबी उपयुक्त शृंखला और सबसे छोटे स्थान-अंक से: ${correct}।\n${wrong.map(([w, , h]) => `${w} नहीं: ${h}`).join("\n")}`,
          ),
        });
      };
      if (level === 1) {
        const v = r.int(0, 2);
        if (v === 0) {
          const [s, g] = r.pick(FG_COMP);
          const nm = (k) => L(FG[k][0], FG[k][1]);
          return task({
            text: L(`Which functional group is present in $\\mathrm{${s}}$?`, `$\\mathrm{${s}}$ में कौन-सा प्रकार्यात्मक समूह है?`),
            answer: choiceWhy(
              r,
              nm(g),
              FG_CONF[g].map((k) => [nm(k), L(`An ${FG[k][0]} contains ${FG[k][2]}; ${uc(s)} contains ${FG[g][2]}.`.replace(/^An ([^aeiouh])/, "A $1"), `${FG[k][1]} में ${FG[k][3]} होता है; ${uc(s)} में ${FG[g][3]} है।`)]),
            ),
            data: { given: [`\\mathrm{${s}}`], find: [L("\\text{functional group}", "\\text{प्रकार्यात्मक समूह}")] },
            hint: L("Look for the atom or group other than C–H and C–C bonds: –OH, –CHO, >C=O, –COOH, –COO–, –O–, –NH₂, –X.", "C–H और C–C आबंधों के अलावा परमाणु या समूह खोजिए: –OH, –CHO, >C=O, –COOH, –COO–, –O–, –NH₂, –X।"),
            solution: L(`$\\mathrm{${s}}$ contains ${FG[g][2]}.\nAnswer: ${FG[g][0]}`, `$\\mathrm{${s}}$ में ${FG[g][3]} है।\nउत्तर: ${FG[g][1]}`),
          });
        }
        if (v === 1) {
          const n = r.int(4, 7);
          const [nEn, nHi, list] = ALKANES[n];
          return task({
            text: L(`How many structural (chain) isomers does $\\mathrm{C_{${n}}H_{${2 * n + 2}}}$ (${nEn}) have?`, `$\\mathrm{C_{${n}}H_{${2 * n + 2}}}$ (${nHi}) के कितने संरचनात्मक (शृंखला) समावयवी हैं?`),
            answer: numM(list.length, 0, [
              [list.length - 1, L("You missed a branched isomer: try every shorter main chain with all branch positions.", "आपसे एक शाखित समावयवी छूट गया: हर छोटी मुख्य शृंखला पर शाखा के सभी स्थान आज़माइए।")],
              [list.length + 1, L("You counted one structure twice: the same chain drawn bent is not a new isomer; name each one to check.", "आपने एक संरचना दो बार गिनी: मोड़कर बनाई गई वही शृंखला नया समावयवी नहीं है; जाँचने के लिए प्रत्येक का नाम लिखिए।")],
            ]),
            data: { given: [`\\mathrm{C_{${n}}H_{${2 * n + 2}}}`], find: ["n_{\\text{isomers}}"] },
            hint: L("Start with the straight chain, then shorten the main chain by one carbon at a time and place the branches in all different positions. Name each structure to avoid repeats.", "सीधी शृंखला से शुरू कीजिए, फिर मुख्य शृंखला को एक-एक कार्बन छोटा करके शाखाओं को सभी अलग स्थानों पर रखिए। दोहराव से बचने के लिए प्रत्येक संरचना का नाम लिखिए।"),
            solution: L(`Isomers: ${list.join(", ")}\nNumber: ${list.length}`, `समावयवी: ${list.join(", ")}\nसंख्या: ${list.length}`),
          });
        }
        const [f, nEn, nHi] = r.pick(DOU_NAMED);
        const d = dou(f);
        return task({
          text: L(`What is the degree of unsaturation (double-bond equivalent) of ${nEn}, $\\mathrm{${f}}$?`, `${nHi}, $\\mathrm{${f}}$ की असंतृप्तता की कोटि (द्विआबंध तुल्यांक) क्या है?`),
          answer: numM(d.d, 0, [
            ...(d.N ? [[d.C - (d.H + d.X) / 2 + 1, L("Each N atom adds ½ to the degree of unsaturation.", "प्रत्येक N परमाणु असंतृप्तता में ½ जोड़ता है।")]] : []),
            ...(d.X ? [[d.C - d.H / 2 + d.N / 2 + 1, L("Count each halogen atom like a hydrogen atom.", "प्रत्येक हैलोजन परमाणु को हाइड्रोजन की तरह गिनिए।")]] : []),
            [d.C - (d.H + d.X) / 2 + d.N / 2, L("Do not forget the +1 in the formula.", "सूत्र में +1 मत भूलिए।")],
          ]),
          data: { given: [`\\mathrm{${f}}`], find: ["\\text{DoU}"] },
          hint: L("Use DoU = C − (H + X)/2 + N/2 + 1; oxygen does not change it. Each ring or double bond counts 1, a triple bond 2.", "DoU = C − (H + X)/2 + N/2 + 1 लीजिए; ऑक्सीजन इसे नहीं बदलता। प्रत्येक वलय या द्विआबंध 1, त्रिआबंध 2 गिना जाता है।"),
          formula: "\\text{DoU} = C - \\dfrac{H + X}{2} + \\dfrac{N}{2} + 1",
          solution: L(
            `C = ${d.C}, H = ${d.H}, N = ${d.N}, X = ${d.X}\n$\\text{DoU} = ${d.C} - \\dfrac{${d.H} + ${d.X}}{2} + \\dfrac{${d.N}}{2} + 1 = ${en(d.d)}$`,
            `C = ${d.C}, H = ${d.H}, N = ${d.N}, X = ${d.X}\n$\\text{DoU} = ${d.C} - \\dfrac{${d.H} + ${d.X}}{2} + \\dfrac{${d.N}}{2} + 1 = ${en(d.d)}$ (असंतृप्तता की कोटि)`,
          ),
        });
      }
      if (level === 2) {
        const v = r.int(0, 3);
        if (v === 0) return iupac(IUPAC2);
        if (v === 1) {
          // Naključna formula.
          const c = r.int(4, 10),
            n = r.pick([0, 0, 1, 2]),
            x = r.pick([0, 0, 1, 2]),
            o = r.pick([0, 1, 2]);
          const hal = r.pick(["Cl", "Br"]);
          let dd = r.int(1, Math.min(5, Math.floor(c / 2) + 1));
          while (2 * c + 2 + n - x - 2 * dd < 1) dd--;
          const h = 2 * c + 2 + n - x - 2 * dd;
          const f = `C_{${c}}H_{${h}}${x ? `${hal}${x > 1 ? `_${x}` : ""}` : ""}${n ? `N${n > 1 ? `_${n}` : ""}` : ""}${o ? `O${o > 1 ? `_${o}` : ""}` : ""}`;
          const d = dou(f);
          return task({
            text: L(`An organic compound has the molecular formula $\\mathrm{${f}}$. How many rings plus π bonds (degree of unsaturation) does it have?`, `एक कार्बनिक यौगिक का अणुसूत्र $\\mathrm{${f}}$ है। इसमें वलयों और π आबंधों की कुल संख्या (असंतृप्तता की कोटि) कितनी है?`),
            answer: numM(d.d, 0, [
              ...(d.N ? [[d.C - (d.H + d.X) / 2 + 1, L("Each N atom adds ½ to the degree of unsaturation.", "प्रत्येक N परमाणु असंतृप्तता में ½ जोड़ता है।")]] : []),
              ...(d.X ? [[d.C - d.H / 2 + d.N / 2 + 1, L("Count each halogen atom like a hydrogen atom.", "प्रत्येक हैलोजन परमाणु को हाइड्रोजन की तरह गिनिए।")]] : []),
              ...(d.O ? [[d.C - (d.H + d.X + d.O) / 2 + d.N / 2 + 1, L("Oxygen (divalent) does not change the degree of unsaturation.", "ऑक्सीजन (द्विसंयोजी) असंतृप्तता की कोटि नहीं बदलता।")]] : []),
              [d.C - (d.H + d.X) / 2 + d.N / 2, L("Do not forget the +1 in the formula.", "सूत्र में +1 मत भूलिए।")],
            ]),
            data: { given: [`\\mathrm{${f}}`], find: ["\\text{DoU}"] },
            hint: L("Use DoU = C − (H + X)/2 + N/2 + 1; ignore oxygen.", "DoU = C − (H + X)/2 + N/2 + 1 लीजिए; ऑक्सीजन को छोड़ दीजिए।"),
            formula: "\\text{DoU} = C - \\dfrac{H + X}{2} + \\dfrac{N}{2} + 1",
            solution: L(
              `C = ${d.C}, H = ${d.H}, X = ${d.X}, N = ${d.N}${d.O ? ` (O = ${d.O} is ignored)` : ""}\n$\\text{DoU} = ${d.C} - \\dfrac{${d.H} + ${d.X}}{2} + \\dfrac{${d.N}}{2} + 1 = ${en(d.d)}$`,
              `C = ${d.C}, H = ${d.H}, X = ${d.X}, N = ${d.N}${d.O ? ` (O = ${d.O} को छोड़ते हैं)` : ""}\n$\\text{DoU} = ${d.C} - \\dfrac{${d.H} + ${d.X}}{2} + \\dfrac{${d.N}}{2} + 1 = ${en(d.d)}$ (असंतृप्तता की कोटि)`,
            ),
          });
        }
        if (v === 2) {
          const key = r.pick(["alkane", "alcohol", "aldehyde", "acid"]);
          return homologous(key, r.int(3, 8));
        }
        const [a, b, t] = r.pick(ISOPAIRS);
        const nm = (k) => L(ISOTYPE[k][0], ISOTYPE[k][1]);
        return task({
          text: L(`Which type of structural isomerism is shown by ${a} and ${b}?`, `${a} और ${b} किस प्रकार की संरचनात्मक समावयवता दर्शाते हैं?`),
          answer: choiceWhy(
            r,
            nm(t),
            Object.keys(ISOTYPE)
              .filter((k) => k !== t)
              .map((k) => [nm(k), L(ISOTYPE[k][2], ISOTYPE[k][3])]),
          ),
          data: { given: [a, b].map((x) => `\\text{${x}}`), find: [L("\\text{type of isomerism}", "\\text{समावयवता का प्रकार}")] },
          hint: L("Draw both structures. Compare the skeleton, the position of the group, the kind of functional group, and the alkyl groups around it.", "दोनों संरचनाएँ बनाइए। ढाँचे, समूह के स्थान, प्रकार्यात्मक समूह के प्रकार और उसके आसपास के ऐल्किल समूहों की तुलना कीजिए।"),
          solution: L(`${ISOTYPE[t][2]}\n${a} and ${b} fit this description.\nAnswer: ${ISOTYPE[t][0]}`, `${ISOTYPE[t][3]}\n${a} और ${b} इसी प्रकार के हैं।\nउत्तर: ${ISOTYPE[t][1]}`),
        });
      }
      const v = r.int(0, 2);
      if (v === 0) return iupac(IUPAC3);
      if (v === 1) return homologous(r.pick(["alkene", "alkyne", "ketone"]), r.int(2, 7));
      const [f, cEn, cHi, list, mis] = r.pick(ISOCOUNT);
      return task({
        text: L(`How many ${cEn} have the molecular formula $\\mathrm{${f}}$?`, `अणुसूत्र $\\mathrm{${f}}$ वाले ${cHi} कितने हैं?`),
        answer: numM(list.length, 0, [[mis[0], L(mis[1], mis[2])]]),
        data: { given: [`\\mathrm{${f}}`], find: ["n_{\\text{isomers}}"] },
        hint: L("Draw every carbon skeleton first, then place the functional group at every distinct position. Name each structure so none is counted twice.", "पहले सभी कार्बन ढाँचे बनाइए, फिर प्रकार्यात्मक समूह को हर अलग स्थान पर रखिए। हर संरचना का नाम लिखिए ताकि कोई दो बार न गिनी जाए।"),
        solution: L(`${list.join(", ")}\nNumber: ${list.length}`, `${list.join(", ")}\nसंख्या: ${list.length}`),
      });

      function homologous(key, n) {
        const [sEn, sHi, fEn, fHi, k0] = HOMO[key];
        const k = n + k0 - 1;
        const f = HF[key](k),
          fn = HF[key](n);
        const M = molar(f);
        return task({
          text: L(
            `The first member of the ${sEn} homologous series is ${fEn}. What is the molar mass of the ${ORD(n)} member (n = ${n}) of this series, in g/mol? (C = 12, H = 1, O = 16)`,
            `${sHi} समजातीय श्रेणी का पहला सदस्य ${fHi} है। इस श्रेणी के ${ORD_HI(n)} (n = ${n}) सदस्य का मोलर द्रव्यमान (g/mol में) क्या है? (C = 12, H = 1, O = 16)`,
          ),
          answer: numM(M, 0, [
            ...(k0 > 1 ? [[molar(fn), L(`The first member already has ${k0} carbon atoms, so the ${ORD(n)} member has ${n} + ${k0 - 1} = ${k} carbons.`, `पहले सदस्य में ही ${k0} कार्बन हैं, इसलिए ${ORD_HI(n)} सदस्य में ${n} + ${k0 - 1} = ${k} कार्बन हैं।`)]] : []),
            [M - 14, L("Successive members differ by CH₂ (14 u): count the members again.", "क्रमागत सदस्यों में CH₂ (14 u) का अंतर होता है: सदस्य फिर से गिनिए।")],
            [M + 14, L("Successive members differ by CH₂ (14 u): count the members again.", "क्रमागत सदस्यों में CH₂ (14 u) का अंतर होता है: सदस्य फिर से गिनिए।")],
          ]),
          data: { given: [`\\text{${L("first member", "पहला सदस्य")}}: \\mathrm{${HF[key](k0)}}`, `n = ${n}`], find: ["M"] },
          hint: L("Each next member has one more CH₂ group. First find the number of carbon atoms in the required member.", "प्रत्येक अगले सदस्य में एक CH₂ समूह अधिक होता है। पहले आवश्यक सदस्य में कार्बन परमाणुओं की संख्या ज्ञात कीजिए।"),
          formula: `\\mathrm{${HOMO[key][6]}}`,
          solution: L(
            `Carbon atoms: ${k0} + (${n} − 1) = ${k}\nFormula: $\\mathrm{${f}}$\n$M = ${Object.entries(atoms(f)).map(([e, c]) => `${c} \\cdot ${MASS[e]}`).join(" + ")} = ${M}\\ \\mathrm{g/mol}$`,
            `कार्बन परमाणु: ${k0} + (${n} − 1) = ${k}\nसूत्र: $\\mathrm{${f}}$\n$M = ${Object.entries(atoms(f)).map(([e, c]) => `${c} \\cdot ${MASS[e]}`).join(" + ")} = ${M}\\ \\mathrm{g/mol}$`,
          ),
        });
      }
    },
  },
  {
    id: "exi-kem-organic-reactions",
    topics: [T("organic-chemistry-reactions")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const MASS = { C: 12, H: 1, N: 14, O: 16 };
      const molar = (f) => sum(Object.entries(atoms(f)).map(([e, n]) => MASS[e] * n));
      const mline = (f) => `M(\\mathrm{${f}}) = ${Object.entries(atoms(f)).map(([e, n]) => `${n} \\cdot ${MASS[e]}`).join(" + ")} = ${molar(f)}`;
      if (level === 1) {
        const [qEn, qHi, cond, correct, wrong, sEn, sHi] = r.pick(NAMED);
        return task({
          text: L(`What is the main organic product of ${qEn}: $${cond}$?`, `${qHi}, $${cond}$, का मुख्य कार्बनिक उत्पाद क्या है?`),
          answer: choiceWhy(r, correct, wrong.map(([w, e, h]) => [w, L(e, h)])),
          data: { given: [cond], find: [L("\\text{product}", "\\text{उत्पाद}")] },
          hint: L("Recall what the reagent of this name reaction does to the functional group (which group enters, leaves or is reduced).", "याद कीजिए कि इस नाम-अभिक्रिया का अभिकर्मक प्रकार्यात्मक समूह के साथ क्या करता है (कौन-सा समूह आता है, जाता है या अपचयित होता है)।"),
          solution: L(`${sEn}\nProduct: ${correct}`, `${sHi}\nउत्पाद: ${correct}`),
        });
      }
      if (level === 2) {
        const v = r.int(0, 2);
        if (v === 0) {
          // Kemijski preskusi.
          const kind = r.pick(["io", "io-", "al", "fe", "lucas3", "lucas1", "carb"]);
          const names = Object.keys(TESTC);
          const P = (n) => TESTC[n][1];
          let good, bad, q, why, sol;
          if (kind === "io" || kind === "io-") {
            const pos = names.filter((n) => P(n).io === 1),
              neg = names.filter((n) => P(n).io === 0);
            const yes = kind === "io";
            good = r.pick(yes ? pos : neg);
            bad = r.shuffle(yes ? neg : pos).slice(0, 3);
            q = yes ? L("Which compound gives a yellow precipitate in the iodoform test (I₂ and NaOH)?", "कौन-सा यौगिक आयोडोफ़ॉर्म परीक्षण (I₂ और NaOH) में पीला अवक्षेप देता है?") : L("Which compound does NOT give the iodoform test (I₂ and NaOH)?", "कौन-सा यौगिक आयोडोफ़ॉर्म परीक्षण (I₂ और NaOH) नहीं देता?");
            why = (n) => (P(n).io ? L(cap(`${n} contains a CH₃CO– or CH₃CH(OH)– group, so it gives yellow CHI₃.`), `${n} में CH₃CO– या CH₃CH(OH)– समूह है, इसलिए यह पीला CHI₃ देता है।`) : L(cap(`${n} has no CH₃CO– or CH₃CH(OH)– group, so no CHI₃ forms.`), `${n} में CH₃CO– या CH₃CH(OH)– समूह नहीं है, इसलिए CHI₃ नहीं बनता।`));
            sol = L("The iodoform test is given by compounds with CH₃CO– or CH₃CH(OH)– (ethanol, ethanal, methyl ketones, secondary methyl carbinols).", "आयोडोफ़ॉर्म परीक्षण वे यौगिक देते हैं जिनमें CH₃CO– या CH₃CH(OH)– हो (एथेनॉल, एथेनैल, मेथिल कीटोन, द्वितीयक मेथिल कार्बिनॉल)।");
          } else if (kind === "al" || kind === "fe") {
            const tol = kind === "al";
            const carb = names.filter((n) => P(n).al !== undefined);
            const pos = carb.filter((n) => (tol ? P(n).al : P(n).fe));
            const neg = carb.filter((n) => !(tol ? P(n).al : P(n).fe));
            good = r.pick(pos);
            bad = r.shuffle(neg).slice(0, 3);
            q = tol ? L("Which compound gives a silver mirror with Tollens' reagent?", "कौन-सा यौगिक टॉलेन अभिकर्मक के साथ रजत दर्पण देता है?") : L("Which compound gives a red-brown precipitate with Fehling's solution?", "कौन-सा यौगिक फेलिंग विलयन के साथ लाल-भूरा अवक्षेप देता है?");
            why = (n) =>
              n === "benzaldehyde"
                ? L("Aromatic aldehydes such as benzaldehyde do not respond to Fehling's test.", "बेन्ज़ैल्डिहाइड जैसे ऐरोमैटिक ऐल्डिहाइड फेलिंग परीक्षण नहीं देते।")
                : P(n).al
                  ? L(cap(`${n} is an aldehyde and is oxidised by the reagent.`), `${n} एक ऐल्डिहाइड है और अभिकर्मक द्वारा ऑक्सीकृत होता है।`)
                  : L(cap(`${n} is a ketone; ketones are not oxidised by mild oxidising agents.`), `${n} एक कीटोन है; कीटोन मृदु ऑक्सीकारकों से ऑक्सीकृत नहीं होते।`);
            sol = tol
              ? L("Tollens' reagent (ammoniacal AgNO₃) oxidises aldehydes, and silver metal deposits as a mirror; ketones do not react.", "टॉलेन अभिकर्मक (अमोनियामय AgNO₃) ऐल्डिहाइडों का ऑक्सीकरण करता है और चाँदी दर्पण के रूप में जमती है; कीटोन अभिक्रिया नहीं करते।")
              : L("Fehling's solution oxidises aliphatic aldehydes and red-brown Cu₂O precipitates; aromatic aldehydes and ketones do not react.", "फेलिंग विलयन ऐलिफैटिक ऐल्डिहाइडों का ऑक्सीकरण करता है और लाल-भूरा Cu₂O अवक्षेपित होता है; ऐरोमैटिक ऐल्डिहाइड और कीटोन अभिक्रिया नहीं करते।");
          } else if (kind === "lucas3" || kind === "lucas1") {
            const alc = names.filter((n) => P(n).cls);
            const want = kind === "lucas3" ? 3 : 1;
            good = r.pick(alc.filter((n) => P(n).cls === want && n !== "methanol"));
            const others = r.shuffle(alc.filter((n) => P(n).cls !== want));
            bad = [...others.filter((n) => P(n).cls === 2).slice(0, 2), ...others.filter((n) => P(n).cls !== 2).slice(0, 1)];
            q = want === 3 ? L("Which alcohol gives turbidity immediately with the Lucas reagent (conc. HCl + anhydrous ZnCl₂) at room temperature?", "कौन-सा ऐल्कोहॉल ल्यूकास अभिकर्मक (सांद्र HCl + निर्जल ZnCl₂) के साथ कमरे के ताप पर तुरंत आविलता देता है?") : L("Which alcohol gives NO turbidity with the Lucas reagent at room temperature?", "कौन-सा ऐल्कोहॉल कमरे के ताप पर ल्यूकास अभिकर्मक के साथ आविलता नहीं देता?");
            const cname = (c) => [null, L("primary", "प्राथमिक"), L("secondary", "द्वितीयक"), L("tertiary", "तृतीयक")][c];
            const beh = (c) => [null, L("no turbidity at room temperature", "कमरे के ताप पर आविलता नहीं"), L("turbidity in about 5 minutes", "लगभग 5 मिनट में आविलता"), L("turbidity immediately", "तुरंत आविलता")][c];
            why = (n) => L(cap(`${n} is a ${cname(P(n).cls)} alcohol: ${beh(P(n).cls)}.`), `${n} ${cname(P(n).cls)} ऐल्कोहॉल है: ${beh(P(n).cls)}।`);
            sol = L("The Lucas test depends on how easily the carbocation forms: 3° immediately, 2° in about 5 min, 1° no turbidity at room temperature.", "ल्यूकास परीक्षण कार्बधनायन बनने की सरलता पर निर्भर है: 3° तुरंत, 2° लगभग 5 मिनट में, 1° कमरे के ताप पर आविलता नहीं।");
          } else {
            const am = names.filter((n) => P(n).am);
            good = r.pick(am.filter((n) => P(n).am === 1));
            bad = r.shuffle(am.filter((n) => P(n).am !== 1)).slice(0, 3);
            q = L("Which amine gives a foul-smelling isocyanide when warmed with chloroform and alcoholic KOH (carbylamine test)?", "कौन-सी ऐमीन क्लोरोफ़ॉर्म और ऐल्कोहॉली KOH के साथ गर्म करने पर दुर्गंधयुक्त आइसोसायनाइड देती है (कार्बिलऐमीन परीक्षण)?");
            why = (n) => L(`${n} is a ${P(n).am === 2 ? "secondary" : "tertiary"} amine; only primary amines (–NH₂) give the carbylamine test.`, `${n} ${P(n).am === 2 ? "द्वितीयक" : "तृतीयक"} ऐमीन है; केवल प्राथमिक ऐमीन (–NH₂) कार्बिलऐमीन परीक्षण देती हैं।`);
            sol = L("Only primary amines (aliphatic or aromatic) react: R–NH₂ + CHCl₃ + 3KOH → R–NC + 3KCl + 3H₂O.", "केवल प्राथमिक ऐमीन (ऐलिफैटिक या ऐरोमैटिक) अभिक्रिया करती हैं: R–NH₂ + CHCl₃ + 3KOH → R–NC + 3KCl + 3H₂O।");
          }
          return task({
            text: q,
            answer: choiceWhy(r, tcLabel(good), bad.map((n) => [tcLabel(n), why(n)])),
            data: { given: [good, ...bad].sort().map((n) => `\\text{${n}}`), find: [L("\\text{compound}", "\\text{यौगिक}")] },
            hint: L("Identify the class of each compound (aldehyde, ketone, 1°/2°/3° alcohol or amine) and the group the test needs.", "प्रत्येक यौगिक का वर्ग पहचानिए (ऐल्डिहाइड, कीटोन, 1°/2°/3° ऐल्कोहॉल या ऐमीन) और परीक्षण के लिए आवश्यक समूह देखिए।"),
            solution: `${sol}\n${why(good)}\n${L("Answer", "उत्तर")}: ${tcLabel(good)}`,
          });
        }
        if (v === 1) {
          const [amide, fa, amine, fb] = r.pick(AMIDES);
          const M = molar(fb);
          const same = fa.replace("CONH_2", "CH_2NH_2");
          return task({
            text: L(
              `${cap(amide)} ($\\mathrm{${fa}}$) is heated with Br₂ and aqueous NaOH (Hoffmann bromamide degradation). What is the molar mass of the amine formed, in g/mol? (C = 12, H = 1, N = 14)`,
              `${amide} ($\\mathrm{${fa}}$) को Br₂ और जलीय NaOH के साथ गर्म किया जाता है (हॉफमान ब्रोमैमाइड निम्नीकरण)। बनने वाली ऐमीन का मोलर द्रव्यमान (g/mol में) क्या है? (C = 12, H = 1, N = 14)`,
            ),
            answer: numM(M, 0, [
              [molar(same), L("The carbonyl carbon is lost as carbonate: the amine has one carbon atom fewer than the amide.", "कार्बोनिल कार्बन कार्बोनेट के रूप में निकल जाता है: ऐमीन में ऐमाइड से एक कार्बन कम होता है।")],
              [molar(fa), L("That is the molar mass of the amide itself.", "यह स्वयं ऐमाइड का मोलर द्रव्यमान है।")],
            ]),
            data: { given: [`\\mathrm{${fa}}`, "\\mathrm{Br_2,\\ NaOH}"], find: ["M(\\text{amine})"] },
            hint: L("In Hoffmann bromamide degradation RCONH₂ → RNH₂: the –CO– group is removed.", "हॉफमान ब्रोमैमाइड निम्नीकरण में RCONH₂ → RNH₂: –CO– समूह हट जाता है।"),
            formula: "\\mathrm{RCONH_2 + Br_2 + 4NaOH \\rightarrow RNH_2 + Na_2CO_3 + 2NaBr + 2H_2O}",
            solution: L(`Product: ${amine}, $\\mathrm{${fb}}$ (one carbon fewer)\n$${mline(fb)}\\ \\mathrm{g/mol}$`, `उत्पाद: ${amine}, $\\mathrm{${fb}}$ (एक कार्बन कम)\n$${mline(fb)}\\ \\mathrm{g/mol}$`),
          });
        }
        const [nm, f, c] = r.pick(RBR);
        const prod = formulaCk(2 * c, 4 * c + 2);
        const M = molar(prod);
        return task({
          text: L(
            `${cap(nm)} ($\\mathrm{${f}}$) is treated with sodium in dry ether (Wurtz reaction). What is the molar mass of the alkane formed, in g/mol? (C = 12, H = 1)`,
            `${nm} ($\\mathrm{${f}}$) की शुष्क ईथर में सोडियम से अभिक्रिया कराई जाती है (वुर्ट्ज़ अभिक्रिया)। बनने वाले ऐल्केन का मोलर द्रव्यमान (g/mol में) क्या है? (C = 12, H = 1)`,
          ),
          answer: numM(M, 0, [[molar(formulaCk(c, 2 * c + 2)), L("Wurtz joins TWO alkyl groups: the alkane has twice as many carbon atoms.", "वुर्ट्ज़ दो ऐल्किल समूहों को जोड़ता है: ऐल्केन में दोगुने कार्बन होते हैं।")]]),
          data: { given: [`\\mathrm{${f}}`, "\\mathrm{Na,\\ dry\\ ether}"], find: ["M(\\text{alkane})"] },
          hint: L("2R–X + 2Na → R–R + 2NaX: join two alkyl groups.", "2R–X + 2Na → R–R + 2NaX: दो ऐल्किल समूहों को जोड़िए।"),
          formula: "\\mathrm{2R{-}X + 2Na \\rightarrow R{-}R + 2NaX}",
          solution: L(`Product: ${ALKN[2 * c]}, $\\mathrm{${prod}}$\n$${mline(prod)}\\ \\mathrm{g/mol}$`, `उत्पाद: ${ALKN[2 * c]}, $\\mathrm{${prod}}$\n$${mline(prod)}\\ \\mathrm{g/mol}$`),
        });
      }
      // Raven 3.
      const v = r.int(0, 3);
      if (v === 0) {
        // SN1 / SN2.
        const halide = r.int(0, 2) === 2;
        const asc = r.int(0, 1) === 1;
        if (halide) {
          const els = ["CH₃CH₂F", "CH₃CH₂Cl", "CH₃CH₂Br", "CH₃CH₂I"];
          const sorted = asc ? els : [...els].reverse();
          return task({
            text: L(`Arrange ${els.join(", ")} in ${asc ? "increasing" : "decreasing"} order of reactivity towards nucleophilic substitution.`, `${els.join(", ")} को नाभिकस्नेही प्रतिस्थापन के प्रति क्रियाशीलता के ${asc ? "बढ़ते" : "घटते"} क्रम में व्यवस्थित कीजिए।`),
            answer: orderChoice(r, sorted, asc ? "<" : ">", L("Reversed: the C–X bond gets weaker from C–F to C–I, so iodides react fastest.", "उलटा क्रम: C–F से C–I तक C–X आबंध दुर्बल होता है, इसलिए आयोडाइड सबसे तेज़ अभिक्रिया करते हैं।"), (a, b) =>
              L(`${a} and ${b} are in the wrong order: the weaker C–X bond breaks more easily.`, `${a} और ${b} का क्रम गलत है: दुर्बल C–X आबंध आसानी से टूटता है।`),
            ),
            data: { given: els.map((x) => `\\text{${x}}`), find: [L("\\text{reactivity}", "\\text{क्रियाशीलता}")] },
            hint: L("The same alkyl group: compare the C–X bond strength (the leaving group).", "ऐल्किल समूह एक ही है: C–X आबंध की प्रबलता (निर्गामी समूह) की तुलना कीजिए।"),
            solution: L(`Bond enthalpy: C–F > C–Cl > C–Br > C–I, so reactivity R–I > R–Br > R–Cl > R–F.\nOrder: ${sorted.join(asc ? " < " : " > ")}`, `आबंध एन्थैल्पी: C–F > C–Cl > C–Br > C–I, इसलिए क्रियाशीलता R–I > R–Br > R–Cl > R–F।\nक्रम: ${sorted.join(asc ? " < " : " > ")}`),
          });
        }
        const sn1 = r.int(0, 1) === 1;
        const els = r.pick([["CH₃Br", "CH₃CH₂Br", "(CH₃)₂CHBr", "(CH₃)₃CBr"], ["CH₃Cl", "CH₃CH₂Cl", "(CH₃)₂CHCl", "(CH₃)₃CCl"]]);
        const deg = ["methyl", "1°", "2°", "3°"];
        const up = sn1 ? els : [...els].reverse(); // naraščajoča reaktivnost
        const sorted = asc ? up : [...up].reverse();
        return task({
          text: L(`Arrange ${els.join(", ")} in ${asc ? "increasing" : "decreasing"} order of reactivity in an S${sn1 ? "N1" : "N2"} reaction.`, `${els.join(", ")} को S${sn1 ? "N1" : "N2"} अभिक्रिया में क्रियाशीलता के ${asc ? "बढ़ते" : "घटते"} क्रम में व्यवस्थित कीजिए।`),
          answer: orderChoice(
            r,
            sorted,
            asc ? "<" : ">",
            sn1 ? L("That is the SN2 order. SN1 goes through a carbocation, and 3° carbocations are the most stable.", "यह SN2 क्रम है। SN1 कार्बधनायन से होकर जाती है, और 3° कार्बधनायन सबसे स्थायी हैं।") : L("That is the SN1 order. SN2 needs back-side attack, which bulky groups hinder.", "यह SN1 क्रम है। SN2 में पीछे से आक्रमण होता है, जिसे भारी समूह रोकते हैं।"),
            (a, b) => L(`${a} (${deg[els.indexOf(a)]}) and ${b} (${deg[els.indexOf(b)]}) are in the wrong order.`, `${a} (${deg[els.indexOf(a)]}) और ${b} (${deg[els.indexOf(b)]}) का क्रम गलत है।`),
          ),
          data: { given: els.map((x) => `\\text{${x}}`), find: [L("\\text{reactivity}", "\\text{क्रियाशीलता}")] },
          hint: sn1 ? L("SN1 rate depends on the stability of the carbocation formed.", "SN1 की दर बनने वाले कार्बधनायन के स्थायित्व पर निर्भर है।") : L("SN2 rate depends on how crowded the carbon attacked by the nucleophile is.", "SN2 की दर इस पर निर्भर है कि नाभिकस्नेही द्वारा आक्रमित कार्बन कितना भीड़भाड़ वाला है।"),
          solution: L(
            `${sn1 ? "Carbocation stability: 3° > 2° > 1° > methyl, so SN1: 3° > 2° > 1° > CH₃X." : "Steric hindrance: methyl < 1° < 2° < 3°, so SN2: CH₃X > 1° > 2° > 3°."}\nOrder: ${sorted.join(asc ? " < " : " > ")}`,
            `${sn1 ? "कार्बधनायन स्थायित्व: 3° > 2° > 1° > मेथिल, इसलिए SN1: 3° > 2° > 1° > CH₃X।" : "त्रिविम बाधा: मेथिल < 1° < 2° < 3°, इसलिए SN2: CH₃X > 1° > 2° > 3°।"}\nक्रम: ${sorted.join(asc ? " < " : " > ")}`,
          ),
        });
      }
      if (v === 1) {
        // Kislost.
        const phen = r.int(0, 2) === 0;
        const tab = phen ? PKA_PH : PKA_AC;
        const els = r.shuffle(Object.keys(tab)).slice(0, 4);
        const asc = r.int(0, 1) === 1;
        const sorted = [...els].sort((a, b) => (asc ? tab[b] - tab[a] : tab[a] - tab[b]));
        const why = phen
          ? L("Electron-withdrawing –NO₂ (especially at ortho/para) stabilises the phenoxide ion; electron-donating –CH₃ destabilises it; ethanol is much weaker than phenol.", "इलेक्ट्रॉन-आकर्षी –NO₂ (विशेषकर ऑर्थो/पैरा पर) फ़ीनॉक्साइड आयन को स्थायी बनाता है; इलेक्ट्रॉन-दाता –CH₃ उसे अस्थायी करता है; एथेनॉल फ़ीनॉल से बहुत दुर्बल है।")
          : L("Electron-withdrawing groups (more Cl, or F > Cl) stabilise the carboxylate ion and increase acidity; alkyl groups (+I) decrease it.", "इलेक्ट्रॉन-आकर्षी समूह (अधिक Cl, या F > Cl) कार्बोक्सिलेट आयन को स्थायी बनाकर अम्लता बढ़ाते हैं; ऐल्किल समूह (+I) इसे घटाते हैं।");
        return task({
          text: L(`Arrange ${els.join(", ")} in ${asc ? "increasing" : "decreasing"} order of acid strength.`, `${els.join(", ")} को अम्ल-सामर्थ्य के ${asc ? "बढ़ते" : "घटते"} क्रम में व्यवस्थित कीजिए।`),
          answer: orderChoice(r, sorted, asc ? "<" : ">", L("Reversed: a smaller pKa means a stronger acid.", "उलटा क्रम: कम pKa का अर्थ प्रबल अम्ल है।"), (a, b) =>
            L(cap(`${a} (pKa ${en(tab[a])}) and ${b} (pKa ${en(tab[b])}) are in the wrong order.`), `${a} (pKa ${en(tab[a])}) और ${b} (pKa ${en(tab[b])}) का क्रम गलत है।`),
          ),
          data: { given: els.map((x) => `\\text{${x}}`), find: ["\\text{pK}_a"] },
          hint: L("Compare the stability of the anions formed: electron-withdrawing groups stabilise the anion and make the acid stronger.", "बनने वाले ऋणायनों के स्थायित्व की तुलना कीजिए: इलेक्ट्रॉन-आकर्षी समूह ऋणायन को स्थायी करके अम्ल को प्रबल बनाते हैं।"),
          solution: L(`${why}\npKa (NCERT): ${els.map((x) => `${x} ${en(tab[x])}`).join(", ")}\nOrder: ${sorted.join(asc ? " < " : " > ")}`, `${why}\npKa (NCERT): ${els.map((x) => `${x} ${en(tab[x])}`).join(", ")}\nक्रम: ${sorted.join(asc ? " < " : " > ")}`),
        });
      }
      if (v === 2) {
        // Bazičnost aminov v vodi.
        const tab = PKB[r.pick(["methyl", "ethyl"])];
        const keys = Object.keys(tab);
        const drop = r.pick(keys.filter((k) => tab[k][1] <= 0));
        const els = r.shuffle(keys.filter((k) => k !== drop));
        const asc = r.int(0, 1) === 1;
        const pkb = (k) => tab[k][0];
        const sorted = [...els].sort((a, b) => (asc ? pkb(b) - pkb(a) : pkb(a) - pkb(b)));
        const naiveKey = (k) => tab[k][1]; // število alkilnih skupin
        const naive = [...els].sort((a, b) => (asc ? naiveKey(a) - naiveKey(b) : naiveKey(b) - naiveKey(a)));
        return task({
          text: L(`Arrange ${els.join(", ")} in ${asc ? "increasing" : "decreasing"} order of basic strength in aqueous solution.`, `${els.join(", ")} को जलीय विलयन में क्षारकीय सामर्थ्य के ${asc ? "बढ़ते" : "घटते"} क्रम में व्यवस्थित कीजिए।`),
          answer: orderChoice(
            r,
            sorted,
            asc ? "<" : ">",
            L("Reversed: a smaller pKb means a stronger base.", "उलटा क्रम: कम pKb का अर्थ प्रबल क्षारक है।"),
            (a, b) => L(`${a} (pKb ${en(pkb(a))}) and ${b} (pKb ${en(pkb(b))}) are in the wrong order.`, `${a} (pKb ${en(pkb(a))}) और ${b} (pKb ${en(pkb(b))}) का क्रम गलत है।`),
            [[naive, L("That follows the +I effect alone (gas phase). In water, solvation of the ammonium ion and steric hindrance change the order.", "यह केवल +I प्रभाव (गैस प्रावस्था) का क्रम है। जल में अमोनियम आयन का विलायकन और त्रिविम बाधा क्रम बदल देते हैं।")]],
          ),
          data: { given: els.map((x) => `\\text{${x}}`), find: ["\\text{pK}_b"] },
          hint: L("In water three factors act together: +I effect of alkyl groups, solvation (H-bonding) of the protonated amine, and steric hindrance. Aryl amines are much weaker bases.", "जल में तीन कारक साथ कार्य करते हैं: ऐल्किल समूहों का +I प्रभाव, प्रोटॉनित ऐमीन का विलायकन (H-आबंधन), और त्रिविम बाधा। ऐरिल ऐमीन बहुत दुर्बल क्षारक हैं।"),
          solution: L(`pKb (NCERT): ${els.map((x) => `${x} ${en(pkb(x))}`).join(", ")}\nSmaller pKb → stronger base.\nOrder: ${sorted.join(asc ? " < " : " > ")}`, `pKb (NCERT): ${els.map((x) => `${x} ${en(pkb(x))}`).join(", ")}\nकम pKb → प्रबल क्षारक।\nक्रम: ${sorted.join(asc ? " < " : " > ")}`),
        });
      }
      // Wurtz z mešanico dveh halogenidov.
      const [a, b] = r.shuffle(RBR).slice(0, 2).sort((x, y) => x[2] - y[2]);
      const ask = r.int(0, 1); // 0 navzkrižni produkt, 1 najtežji
      const cs = [2 * a[2], a[2] + b[2], 2 * b[2]];
      const Ms = cs.map((c) => 14 * c + 2);
      const ans = ask === 0 ? Ms[1] : Ms[2];
      return task({
        text: L(
          `A mixture of ${a[0]} and ${b[0]} is treated with sodium in dry ether. ${ask === 0 ? "What is the molar mass of the unsymmetrical (cross-coupled) alkane formed" : "What is the molar mass of the heaviest alkane formed"}, in g/mol? (C = 12, H = 1)`,
          `${a[0]} और ${b[0]} के मिश्रण की शुष्क ईथर में सोडियम से अभिक्रिया कराई जाती है। ${ask === 0 ? "बनने वाले असममित (मिश्रित) ऐल्केन" : "बनने वाले सबसे भारी ऐल्केन"} का मोलर द्रव्यमान (g/mol में) क्या है? (C = 12, H = 1)`,
        ),
        answer: numM(ans, 0, [
          ...[0, 1, 2].filter((i) => Ms[i] !== ans).map((i) => [Ms[i], L(`That is ${ALKN[cs[i]]}, another of the three alkanes formed.`, `यह ${ALKN[cs[i]]} है, बनने वाले तीन ऐल्केनों में से दूसरा।`)]),
        ]),
        data: { given: [`\\mathrm{${a[1]}},\\ \\mathrm{${b[1]}}`, "\\mathrm{Na,\\ dry\\ ether}"], find: ["M"] },
        hint: L("With two different alkyl halides, R–R, R–R′ and R′–R′ all form. Write all three.", "दो अलग ऐल्किल हैलाइडों से R–R, R–R′ और R′–R′ तीनों बनते हैं। तीनों लिखिए।"),
        formula: "M(\\mathrm{C_nH_{2n+2}}) = 14n + 2",
        solution: L(
          `Products: ${cs.map((c, i) => `${ALKN[c]} (C${c}, ${Ms[i]} g/mol)`).join(", ")}\n${ask === 0 ? "Cross-coupled product" : "Heaviest product"}: ${ALKN[ask === 0 ? cs[1] : cs[2]]}\n$M = 14 \\cdot ${ask === 0 ? cs[1] : cs[2]} + 2 = ${ans}\\ \\mathrm{g/mol}$`,
          `उत्पाद: ${cs.map((c, i) => `${ALKN[c]} (C${c}, ${Ms[i]} g/mol)`).join(", ")}\n${ask === 0 ? "मिश्रित उत्पाद" : "सबसे भारी उत्पाद"}: ${ALKN[ask === 0 ? cs[1] : cs[2]]}\n$M = 14 \\cdot ${ask === 0 ? cs[1] : cs[2]} + 2 = ${ans}\\ \\mathrm{g/mol}$`,
        ),
      });
    },
  },
  {
    id: "exi-kem-coordination",
    topics: [T("coordination-compounds")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const cx = (c) => `$\\mathrm{${c.comp}}$`;
      const oxLine = (c) => `$x ${c.ligs.map(([l, n]) => `${LIG[l][0] < 0 ? "-" : "+"} ${n} \\cdot ${Math.abs(LIG[l][0])}`).join(" ")} = ${c.q}$ → $x = ${c.ox > 0 ? "+" : ""}${c.ox}$`;
      const ionName = (c) => (c.ox ? uc(`${c.M}^{${c.ox}+}`) : `${c.M}(0)`);
      const LOWN = [0, 1, 2, 3, 2, 1, 0, 1, 2, 1, 0];
      const dLine = (c) =>
        c.geom !== "oct"
          ? L(`${ionName(c)}: ${c.d} d electrons; ${GEOM[c.geom][0]} (${uc(c.hyb)})`, `${ionName(c)}: ${c.d} d इलेक्ट्रॉन; ${GEOM[c.geom][1]} (${uc(c.hyb)})`)
          : c.d <= 3 || c.d >= 8
            ? L(`${ionName(c)}: ${c.d} d electrons; with ${c.d} electrons the t₂g/e_g filling is the same for strong and weak field ligands`, `${ionName(c)}: ${c.d} d इलेक्ट्रॉन; ${c.d} इलेक्ट्रॉनों के लिए प्रबल और दुर्बल क्षेत्र लिगन्ड में t₂g/e_g भराव समान है`)
            : c.spin === "low"
              ? L(`${ionName(c)}: ${c.d} d electrons; strong-field ligand → electrons pair up in t₂g (low spin)`, `${ionName(c)}: ${c.d} d इलेक्ट्रॉन; प्रबल क्षेत्र लिगन्ड → इलेक्ट्रॉन t₂g में युग्मित होते हैं (निम्न चक्रण)`)
              : L(`${ionName(c)}: ${c.d} d electrons; weak-field ligand → electrons occupy e_g before pairing (high spin)`, `${ionName(c)}: ${c.d} d इलेक्ट्रॉन; दुर्बल क्षेत्र लिगन्ड → युग्मन से पहले इलेक्ट्रॉन e_g में जाते हैं (उच्च चक्रण)`);
      const sgn = (q) => `${q > 0 ? "+" : q < 0 ? "−" : ""}${Math.abs(q)}`;
      const unpMist = (c) => [
        ...(c.geom === "oct" && c.spin === "low" ? [[c.hs, L("CN⁻, CO, en and NH₃ (with Co³⁺) are strong-field ligands: the d electrons pair up (low spin).", "CN⁻, CO, en और NH₃ (Co³⁺ के साथ) प्रबल क्षेत्र लिगन्ड हैं: d इलेक्ट्रॉन युग्मित होते हैं (निम्न चक्रण)।")]] : []),
        ...(c.geom === "oct" && c.spin === "high" ? [[LOWN[c.d], L("F⁻ and H₂O are weak-field ligands: the splitting is small, so electrons stay unpaired (high spin).", "F⁻ और H₂O दुर्बल क्षेत्र लिगन्ड हैं: विपाटन कम है, इसलिए इलेक्ट्रॉन अयुग्मित रहते हैं (उच्च चक्रण)।")]] : []),
        ...(c.geom === "sq" ? [[2, L("Square planar d⁸ complexes (dsp²) are diamagnetic: all eight d electrons are paired.", "वर्ग समतलीय d⁸ संकुल (dsp²) प्रतिचुंबकीय होते हैं: आठों d इलेक्ट्रॉन युग्मित हैं।")]] : []),
        ...(c.ox === 0 ? [[2, L("In Ni(CO)₄ the 4s electrons of Ni(0) pair into 3d (d¹⁰), so all electrons are paired.", "Ni(CO)₄ में Ni(0) के 4s इलेक्ट्रॉन 3d में युग्मित हो जाते हैं (d¹⁰), इसलिए सभी इलेक्ट्रॉन युग्मित हैं।")]] : []),
        [c.d, L("Not every d electron is unpaired: fill the orbitals one by one (Hund's rule).", "हर d इलेक्ट्रॉन अयुग्मित नहीं होता: कक्षकों को एक-एक करके भरिए (हुंड का नियम)।")],
      ];
      if (level === 1) {
        const v = r.int(0, 2);
        if (v === 2) {
          const kind = r.pick(["amb", "bi", "hexa"]);
          const good = r.pick(Object.keys(DENT).filter((k) => DENT[k][1] === kind));
          const bad = r.shuffle(Object.keys(DENT).filter((k) => DENT[k][1] !== kind)).slice(0, 3);
          const kn = { amb: ["an ambidentate", "उभयदंती"], bi: ["a bidentate", "द्विदंतुर"], hexa: ["a hexadentate", "षट्दंतुर"] }[kind];
          const why = (k) => L(`${DENT[k][0]} ${DENT_WHY[DENT[k][1]][0]}.`, `${DENT[k][0]} ${DENT_WHY[DENT[k][1]][1]}।`);
          return task({
            text: L(`Which of these is ${kn[0]} ligand?`, `इनमें से कौन-सा ${kn[1]} लिगन्ड है?`),
            answer: choiceWhy(r, DENT[good][0], bad.map((k) => [DENT[k][0], why(k)])),
            data: { given: [[good, ...bad].map((k) => `\\text{${DENT[k][0]}}`).join(",\\ ")], find: [L("\\text{ligand}", "\\text{लिगन्ड}")] },
            hint: L("Count the donor atoms of each ligand and how many of them can bind at the same time.", "प्रत्येक लिगन्ड के दाता परमाणु गिनिए और देखिए कि उनमें से कितने एक साथ जुड़ सकते हैं।"),
            solution: L(`${why(good)}\nAnswer: ${DENT[good][0]}`, `${why(good)}\nउत्तर: ${DENT[good][0]}`),
          });
        }
        const c = r.pick(CPLX);
        if (v === 0) {
          const neutral = sum(c.ligs.filter(([l]) => LIG[l][0] < 0).map(([, n]) => n));
          return task({
            text: L(`What is the oxidation state of ${c.M} in ${cx(c)}?`, `${cx(c)} में ${c.M} की ऑक्सीकरण अवस्था क्या है?`),
            answer: numM(c.ox, 0, [
              ...(neutral ? [[c.q, L("Anionic ligands (Cl⁻, CN⁻, F⁻, C₂O₄²⁻ …) carry charge; include them.", "ऋणायनी लिगन्ड (Cl⁻, CN⁻, F⁻, C₂O₄²⁻ …) आवेशित होते हैं; उन्हें भी गिनिए।")]] : []),
              [-c.ox, L("Check the sign: the metal is positive here.", "चिह्न जाँचिए: यहाँ धातु धनात्मक है।")],
              ...(c.ligs.some(([l]) => l === "C_2O_4") ? [[c.q + 3, L("Each oxalate ion carries charge 2−.", "प्रत्येक ऑक्सैलेट आयन का आवेश 2− है।")]] : []),
            ]),
            data: { given: [`\\mathrm{${c.comp}}`], find: [`x(\\mathrm{${c.M}})`] },
            hint: L(`First find the charge of the complex ion ${uc(c.ion)} from the counter-ions; neutral ligands (NH₃, H₂O, CO, en) count 0.`, `पहले प्रति-आयनों से संकुल आयन ${uc(c.ion)} का आवेश ज्ञात कीजिए; उदासीन लिगन्ड (NH₃, H₂O, CO, en) 0 गिने जाते हैं।`),
            solution: L(`Complex ion: $\\mathrm{${c.ion}}$ (charge ${sgn(c.q)})\n${oxLine(c)}`, `संकुल आयन: $\\mathrm{${c.ion}}$ (आवेश ${sgn(c.q)})\n${oxLine(c)}`),
          });
        }
        const lig = c.ligs.map(([l, n]) => `${n} ${l}`).join(" + ");
        return task({
          text: L(`What is the coordination number of ${c.M} in ${cx(c)}?`, `${cx(c)} में ${c.M} की उपसहसंयोजन संख्या क्या है?`),
          answer: numM(c.cn, 0, [
            [sum(c.ligs.map(([, n]) => n)), L("en and C₂O₄²⁻ are bidentate: each one forms two bonds to the metal.", "en और C₂O₄²⁻ द्विदंतुर हैं: प्रत्येक धातु से दो आबंध बनाता है।")],
            [c.ox, L("That is the oxidation state, not the number of donor atoms.", "यह ऑक्सीकरण अवस्था है, दाता परमाणुओं की संख्या नहीं।")],
          ]),
          data: { given: [`\\mathrm{${c.comp}}`], find: ["\\text{CN}"] },
          hint: L("Count the donor atoms bonded to the metal (inside the square brackets); bidentate ligands count 2.", "धातु से जुड़े दाता परमाणु गिनिए (बड़े कोष्ठक के भीतर); द्विदंतुर लिगन्ड 2 गिने जाते हैं।"),
          solution: L(`Ligands: ${uc(lig)}\nDonor atoms: ${c.ligs.map(([l, n]) => `${n} × ${LIG[l][1]}`).join(" + ")} = ${c.cn}`, `लिगन्ड: ${uc(lig)}\nदाता परमाणु: ${c.ligs.map(([l, n]) => `${n} × ${LIG[l][1]}`).join(" + ")} = ${c.cn}`),
        });
      }
      if (level === 2) {
        const v = r.int(0, 2);
        if (v === 0) {
          const c = r.pick(CPLX);
          return task({
            text: L(`How many unpaired electrons are present in the complex ion $\\mathrm{${c.ion}}$ (${GEOM[c.geom][0]})? (${c.M}: Z = ${c.Z})`, `संकुल आयन $\\mathrm{${c.ion}}$ (${GEOM[c.geom][1]}) में कितने अयुग्मित इलेक्ट्रॉन हैं? (${c.M}: Z = ${c.Z})`),
            answer: numM(c.unp, 0, unpMist(c)),
            data: { given: [`\\mathrm{${c.ion}}`, `Z(\\mathrm{${c.M}}) = ${c.Z}`], find: ["n"] },
            hint: L("Find the oxidation state, then the number of d electrons. Decide whether the ligand is strong-field (pairing) or weak-field.", "ऑक्सीकरण अवस्था, फिर d इलेक्ट्रॉनों की संख्या ज्ञात कीजिए। निर्णय कीजिए कि लिगन्ड प्रबल क्षेत्र (युग्मन) का है या दुर्बल क्षेत्र का।"),
            solution: L(`${oxLine(c)}\n${dLine(c)}\nHybridisation ${uc(c.hyb)}; unpaired electrons = ${c.unp}`, `${oxLine(c)}\n${dLine(c)}\nसंकरण ${uc(c.hyb)}; अयुग्मित इलेक्ट्रॉन = ${c.unp}`),
          });
        }
        const [wf, cf, ncl, nion] = r.pick(WERNER);
        if (v === 1) {
          const n = r.pick([0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.5]);
          const total = 3;
          return task({
            text: L(
              `A solution containing ${en(n)} mol of $\\mathrm{${wf}}$ is treated with excess $\\mathrm{AgNO_3}$. In this complex, $\\mathrm{${cf}}$, how many moles of AgCl precipitate?`,
              `$\\mathrm{${wf}}$ के ${en(n)} mol वाले विलयन में $\\mathrm{AgNO_3}$ का आधिक्य मिलाया जाता है। इस संकुल $\\mathrm{${cf}}$ से AgCl के कितने मोल अवक्षेपित होते हैं?`,
            ),
            answer: numM(Math.round(n * ncl * 1e6) / 1e6, 2, [
              [n * total, L("Cl⁻ inside the square brackets is bonded to the metal and is not precipitated.", "बड़े कोष्ठक के भीतर का Cl⁻ धातु से जुड़ा है और अवक्षेपित नहीं होता।")],
              ...(ncl !== 1 ? [[n, L("Each formula unit releases more than one Cl⁻ ion outside the brackets; count them.", "प्रत्येक सूत्र इकाई कोष्ठक के बाहर एक से अधिक Cl⁻ देती है; उन्हें गिनिए।")]] : []),
            ]),
            data: { given: [`n = ${en(n)}\\ \\mathrm{mol}`, `\\mathrm{${cf}}`], find: ["n(\\mathrm{AgCl})"] },
            hint: L("Only the chloride ions outside the coordination sphere (ionisable Cl⁻) react with Ag⁺.", "केवल उपसहसंयोजन मंडल के बाहर वाले क्लोराइड आयन (आयननीय Cl⁻) Ag⁺ से अभिक्रिया करते हैं।"),
            formula: "n(\\mathrm{AgCl}) = n(\\text{complex}) \\cdot n(\\mathrm{Cl^-}\\ \\text{outside})",
            solution: L(
              `Ionisable Cl⁻ per formula unit: ${ncl}\n$n(\\mathrm{AgCl}) = ${en(n)} \\cdot ${ncl} = ${en(n * ncl)}\\ \\mathrm{mol}$`,
              `प्रति सूत्र इकाई आयननीय Cl⁻: ${ncl}\n$n(\\mathrm{AgCl}) = ${en(n)} \\cdot ${ncl} = ${en(n * ncl)}\\ \\mathrm{mol}$`,
            ),
          });
        }
        return task({
          text: L(`How many ions does one formula unit of $\\mathrm{${cf}}$ give in aqueous solution?`, `जलीय विलयन में $\\mathrm{${cf}}$ की एक सूत्र इकाई कितने आयन देती है?`),
          answer: numM(nion, 0, [
            [1 + 3, L("Only Cl⁻ outside the square brackets ionises; chloride inside the brackets stays bonded.", "केवल बड़े कोष्ठक के बाहर वाला Cl⁻ आयनित होता है; भीतर वाला क्लोराइड जुड़ा रहता है।")],
            ...(nion ? [[nion - 1, L("Count the complex ion as well as the counter-ions.", "प्रति-आयनों के साथ संकुल आयन को भी गिनिए।")]] : [[1, L("With no ions outside the brackets, the complex is a non-electrolyte.", "कोष्ठक के बाहर कोई आयन न होने पर संकुल अविद्युत-अपघट्य है।")]]),
          ]),
          data: { given: [`\\mathrm{${cf}}`], find: ["n_{\\text{ions}}"] },
          hint: L("The complex ion in square brackets stays together; only the counter-ions outside separate.", "बड़े कोष्ठक वाला संकुल आयन एक साथ रहता है; केवल बाहर के प्रति-आयन अलग होते हैं।"),
          solution: nion
            ? L(`$\\mathrm{${cf}}$ → 1 complex ion + ${ncl} Cl⁻\nIons = 1 + ${ncl} = ${nion}`, `$\\mathrm{${cf}}$ → 1 संकुल आयन + ${ncl} Cl⁻\nआयन = 1 + ${ncl} = ${nion}`)
            : L(`$\\mathrm{${cf}}$ has no ions outside the brackets.\nIt is a non-electrolyte: 0 ions.`, `$\\mathrm{${cf}}$ में कोष्ठक के बाहर कोई आयन नहीं है।\nयह अविद्युत-अपघट्य है: 0 आयन।`),
        });
      }
      const v = r.int(0, 3);
      if (v === 0) {
        const c = r.pick(CPLX.filter((x) => x.unp > 0 || x.hs > 0));
        const mu = Math.sqrt(c.unp * (c.unp + 2));
        return task({
          text: L(`Calculate the spin-only magnetic moment of $\\mathrm{${c.ion}}$, in BM. (${c.M}: Z = ${c.Z})${roundToL(2, lang)}`, `$\\mathrm{${c.ion}}$ का केवल-चक्रण चुंबकीय आघूर्ण BM में परिकलित कीजिए। (${c.M}: Z = ${c.Z})${roundToL(2, lang)}`),
          answer: numM(mu, 2, [
            ...(c.geom === "oct" ? [[Math.sqrt((c.spin === "low" ? c.hs : LOWN[c.d]) * ((c.spin === "low" ? c.hs : LOWN[c.d]) + 2)), L("The ligand decides the spin state: strong-field ligands (CN⁻, en, NH₃ with Co³⁺) pair the d electrons, weak-field ligands (F⁻, H₂O) do not.", "चक्रण अवस्था लिगन्ड तय करता है: प्रबल क्षेत्र लिगन्ड (CN⁻, en, Co³⁺ के साथ NH₃) d इलेक्ट्रॉनों को युग्मित करते हैं, दुर्बल क्षेत्र लिगन्ड (F⁻, H₂O) नहीं।")]] : []),
            ...(c.geom === "sq" ? [[Math.sqrt(8), L("Square planar d⁸ complexes are diamagnetic (n = 0).", "वर्ग समतलीय d⁸ संकुल प्रतिचुंबकीय होते हैं (n = 0)।")]] : []),
            [Math.sqrt(c.d * (c.d + 2)), L("Use the number of UNPAIRED electrons, not the total number of d electrons.", "अयुग्मित इलेक्ट्रॉनों की संख्या लीजिए, कुल d इलेक्ट्रॉन नहीं।")],
            [c.unp * (c.unp + 2), L("Take the square root: μ = √(n(n+2)).", "वर्गमूल लीजिए: μ = √(n(n+2))।")],
          ]),
          data: { given: [`\\mathrm{${c.ion}}`, `Z(\\mathrm{${c.M}}) = ${c.Z}`], find: ["\\mu"] },
          hint: L("Find the oxidation state and d-electron count, decide high or low spin from the ligand, count unpaired electrons n.", "ऑक्सीकरण अवस्था और d इलेक्ट्रॉन संख्या ज्ञात कीजिए, लिगन्ड से उच्च या निम्न चक्रण तय कीजिए, अयुग्मित इलेक्ट्रॉन n गिनिए।"),
          formula: "\\mu = \\sqrt{n(n+2)}\\ \\mathrm{BM}",
          solution: L(
            `${oxLine(c)}\n${dLine(c)} → n = ${c.unp}\n$\\mu = \\sqrt{${c.unp}(${c.unp} + 2)} = \\sqrt{${c.unp * (c.unp + 2)}} \\approx ${en(mu, 2)}\\ \\mathrm{BM}$`,
            `${oxLine(c)}\n${dLine(c)} → n = ${c.unp}\n$\\mu = \\sqrt{${c.unp}(${c.unp} + 2)} = \\sqrt{${c.unp * (c.unp + 2)}} \\approx ${en(mu, 2)}\\ \\mathrm{BM}$`,
          ),
        });
      }
      if (v === 1) {
        // Masa AgCl iz mase kompleksa.
        const [wf, cf, ncl] = r.pick(WERNER.filter((w) => w[2] > 0));
        const M = wMolar(wf);
        const m = r.pick([1, 2, 2.5, 5, 10]) * (M > 260 ? 1 : 1);
        const ans = (m / M) * ncl * 143.5;
        return task({
          text: L(
            `${en(m)} g of $\\mathrm{${wf}}$, which is $\\mathrm{${cf}}$, is dissolved in water and treated with excess $\\mathrm{AgNO_3}$. What mass of AgCl (in g) precipitates? (Co = 59, Cr = 52, Cl = 35.5, N = 14, O = 16, H = 1, Ag = 108)${roundToL(2, lang)}`,
            `$\\mathrm{${wf}}$, अर्थात $\\mathrm{${cf}}$, के ${en(m)} g को जल में घोलकर $\\mathrm{AgNO_3}$ का आधिक्य मिलाया जाता है। कितना AgCl (g में) अवक्षेपित होता है? (Co = 59, Cr = 52, Cl = 35.5, N = 14, O = 16, H = 1, Ag = 108)${roundToL(2, lang)}`,
          ),
          answer: numM(ans, 2, [
            [(m / M) * 3 * 143.5, L("Only the Cl⁻ outside the square brackets precipitates.", "केवल बड़े कोष्ठक के बाहर का Cl⁻ अवक्षेपित होता है।")],
            ...(ncl > 1 ? [[(m / M) * 143.5, L(`Each formula unit gives ${ncl} Cl⁻ ions.`, `प्रत्येक सूत्र इकाई ${ncl} Cl⁻ आयन देती है।`)]] : []),
          ]),
          data: { given: [`m = ${en(m)}\\ \\mathrm{g}`, `\\mathrm{${cf}}`, "M(\\mathrm{Ag}) = 108", "M(\\mathrm{Cl}) = 35.5"], find: ["m(\\mathrm{AgCl})"] },
          hint: L("Find the molar mass of the complex, its amount in mol, and multiply by the number of ionisable Cl⁻.", "संकुल का मोलर द्रव्यमान और उसकी मात्रा (mol) ज्ञात कीजिए, फिर आयननीय Cl⁻ की संख्या से गुणा कीजिए।"),
          formula: "m(\\mathrm{AgCl}) = \\dfrac{m}{M} \\cdot n_{\\mathrm{Cl^-}} \\cdot 143.5",
          solution: L(
            `$M = ${en(M)}\\ \\mathrm{g/mol}$, $n = \\dfrac{${en(m)}}{${en(M)}} = ${en(m / M, 5)}\\ \\mathrm{mol}$\nIonisable Cl⁻: ${ncl} → $n(\\mathrm{AgCl}) = ${en((m / M) * ncl, 5)}\\ \\mathrm{mol}$\n$M(\\mathrm{AgCl}) = 108 + 35.5 = 143.5\\ \\mathrm{g/mol}$\n$m(\\mathrm{AgCl}) = ${en((m / M) * ncl, 5)} \\cdot 143.5 \\approx ${en(ans, 2)}\\ \\mathrm{g}$`,
            `$M = ${en(M)}\\ \\mathrm{g/mol}$, $n = \\dfrac{${en(m)}}{${en(M)}} = ${en(m / M, 5)}\\ \\mathrm{mol}$\nआयननीय Cl⁻: ${ncl} → $n(\\mathrm{AgCl}) = ${en((m / M) * ncl, 5)}\\ \\mathrm{mol}$\n$M(\\mathrm{AgCl}) = 108 + 35.5 = 143.5\\ \\mathrm{g/mol}$\n$m(\\mathrm{AgCl}) = ${en((m / M) * ncl, 5)} \\cdot 143.5 \\approx ${en(ans, 2)}\\ \\mathrm{g}$`,
          ),
        });
      }
      if (v === 2) {
        // Wernerjev obrat: iz števila mol AgCl do formule.
        const co = WERNER.slice(0, 4);
        const [, cf, ncl] = r.pick(co.slice(0, 3));
        const n = r.pick([0.01, 0.02, 0.05, 0.1]);
        const x = 6 - (3 - ncl);
        return task({
          text: L(
            `${en(n)} mol of a cobalt(III) complex $\\mathrm{CoCl_3\\cdot ${x}NH_3}$ gives ${en(n * ncl)} mol of AgCl with excess $\\mathrm{AgNO_3}$. What is its coordination formula?`,
            `एक कोबाल्ट(III) संकुल $\\mathrm{CoCl_3\\cdot ${x}NH_3}$ के ${en(n)} mol, $\\mathrm{AgNO_3}$ के आधिक्य के साथ AgCl के ${en(n * ncl)} mol देते हैं। इसका उपसहसंयोजन सूत्र क्या है?`,
          ),
          answer: choiceWhy(
            r,
            uc(cf),
            [
              [uc(`[Co(NH_3)_${x}]Cl_3`), L("Then all 3 Cl⁻ would be outside and 3 mol AgCl would form per mol.", "तब सभी 3 Cl⁻ बाहर होते और प्रति mol 3 mol AgCl बनता।")],
              [uc(`[Co(NH_3)_${x}Cl_3]`), L("Then no Cl⁻ would be outside and no AgCl would form.", "तब कोई Cl⁻ बाहर न होता और AgCl न बनता।")],
              [uc(`[Co(NH_3)_${x}Cl_${3 - ncl === 1 ? 2 : 1}]Cl_${3 - ncl === 1 ? 1 : 2}`.replace("Cl_1]", "Cl]").replace("]Cl_1", "]Cl")), L(`That formula has the wrong number of Cl⁻ outside; ${en(n * ncl)} mol AgCl from ${en(n)} mol means ${ncl} per formula unit.`, `उस सूत्र में बाहर के Cl⁻ की संख्या गलत है; ${en(n)} mol से ${en(n * ncl)} mol AgCl का अर्थ है प्रति सूत्र इकाई ${ncl}।`)],
            ],
          ),
          data: { given: [`n = ${en(n)}\\ \\mathrm{mol}`, `n(\\mathrm{AgCl}) = ${en(n * ncl)}\\ \\mathrm{mol}`], find: [L("\\text{formula}", "\\text{सूत्र}")] },
          hint: L("Moles of AgCl ÷ moles of complex = number of Cl⁻ outside the brackets. Co(III) has coordination number 6.", "AgCl के mol ÷ संकुल के mol = कोष्ठक के बाहर Cl⁻ की संख्या। Co(III) की उपसहसंयोजन संख्या 6 है।"),
          solution: L(
            `Cl⁻ outside: ${en(n * ncl)} ÷ ${en(n)} = ${ncl}; Cl inside: ${3 - ncl}\nCoordination number 6 = ${x} NH₃ + ${3 - ncl} Cl\nFormula: ${uc(cf)}`,
            `बाहर Cl⁻: ${en(n * ncl)} ÷ ${en(n)} = ${ncl}; भीतर Cl: ${3 - ncl}\nउपसहसंयोजन संख्या 6 = ${x} NH₃ + ${3 - ncl} Cl\nसूत्र: ${uc(cf)}`,
          ),
        });
      }
      // Izomerija.
      const opt = r.int(0, 1) === 1;
      const pos = CISO.filter((x) => (opt ? x[2] : x[1]));
      const neg = CISO.filter((x) => !(opt ? x[2] : x[1]));
      const good = r.pick(pos);
      const bad = r.shuffle(neg).slice(0, 3);
      return task({
        text: opt ? L("Which complex shows optical isomerism?", "कौन-सा संकुल ध्रुवण घूर्णक (प्रकाशिक) समावयवता दर्शाता है?") : L("Which complex shows geometrical (cis–trans or fac–mer) isomerism?", "कौन-सा संकुल ज्यामितीय (समपक्ष–विपक्ष या fac–mer) समावयवता दर्शाता है?"),
        answer: choiceWhy(r, uc(good[0]), bad.map((x) => [uc(x[0]), L(`${uc(x[0])}: ${x[3]}.`, `${uc(x[0])}: ${x[4]}।`)])),
        data: { given: [[good, ...bad].map((x) => `\\mathrm{${x[0]}}`).join(",\\ ")], find: [L("\\text{complex}", "\\text{संकुल}")] },
        hint: opt ? L("A complex is optically active if it has no plane of symmetry; look for chelating ligands (en, C₂O₄²⁻) arranged like a propeller.", "संकुल प्रकाशिक सक्रिय होता है यदि उसमें सममिति तल न हो; प्रोपेलर जैसे व्यवस्थित कीलेटी लिगन्ड (en, C₂O₄²⁻) खोजिए।") : L("Geometrical isomers need two different relative arrangements of ligands: MA₂B₂ square planar, MA₄B₂ or MA₃B₃ octahedral, M(AA)₂B₂.", "ज्यामितीय समावयवियों के लिए लिगन्डों की दो अलग सापेक्ष व्यवस्थाएँ चाहिए: वर्ग समतलीय MA₂B₂, अष्टफलकीय MA₄B₂ या MA₃B₃, M(AA)₂B₂।"),
        solution: L(`${uc(good[0])}: ${good[3]}.\nAnswer: ${uc(good[0])}`, `${uc(good[0])}: ${good[4]}।\nउत्तर: ${uc(good[0])}`),
      });
    },
  },
  {
    id: "exi-kem-spdf-block",
    topics: [T("s-p-d-and-f-block-elements")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const sgn = (x) => `${x > 0 ? "+" : x < 0 ? "−" : ""}${en(Math.abs(x))}`;
      const oxLine = (f, E, p = 0) => {
        const a = atoms(f);
        const parts = Object.entries(a)
          .filter(([e]) => e !== E)
          .map(([e, n]) => `${OXFIX[e] < 0 ? "-" : "+"} ${n} \\cdot ${Math.abs(OXFIX[e])}`)
          .join(" ");
        return `${a[E] > 1 ? a[E] : ""}x ${parts} = 0`;
      };
      const oxTask = (f, E, extra = []) => {
        const x = oxState(f, E);
        const n = atoms(f)[E];
        return task({
          text: L(`What is the oxidation state of ${E} in $\\mathrm{${f}}$?`, `$\\mathrm{${f}}$ में ${E} की ऑक्सीकरण अवस्था क्या है?`),
          answer: numM(x, 0, [
            ...(n > 1 ? [[x * n, L(`There are ${n} ${E} atoms: divide the total by ${n}.`, `${E} के ${n} परमाणु हैं: कुल को ${n} से भाग दीजिए।`)]] : []),
            [-x, L("Check the sign: O is −2 and H, Na, K are +1, so the element here is positive.", "चिह्न जाँचिए: O = −2 और H, Na, K = +1, इसलिए यहाँ तत्व धनात्मक है।")],
            ...extra,
          ]),
          data: { given: [`\\mathrm{${f}}`], find: [`x(\\mathrm{${E}})`] },
          hint: L("The sum of all oxidation states in a neutral compound is zero. Use O = −2, H = +1, Na = K = +1.", "उदासीन यौगिक में सभी ऑक्सीकरण अवस्थाओं का योग शून्य होता है। O = −2, H = +1, Na = K = +1 लीजिए।"),
          solution: L(`$${oxLine(f, E)}$\n$x = ${sgn(x)}$`, `$${oxLine(f, E)}$\n$x = ${sgn(x)}$ (ऑक्सीकरण अवस्था)`),
        });
      };
      if (level === 1) {
        const v = r.int(0, 2);
        if (v === 0) {
          const [f, E] = r.pick(OX1);
          return oxTask(f, E);
        }
        if (v === 1) {
          const Z = r.int(21, 25);
          const [d, s] = tmCfg(Z);
          return task({
            text: L(`What is the highest oxidation state shown by ${TM[Z]} (Z = ${Z})?`, `${TM[Z]} (Z = ${Z}) की उच्चतम ऑक्सीकरण अवस्था क्या है?`),
            answer: numM(d + s, 0, [
              [d, L("The 4s electrons are also lost: count 3d + 4s electrons.", "4s इलेक्ट्रॉन भी निकलते हैं: 3d + 4s इलेक्ट्रॉन गिनिए।")],
              [s, L("For Sc to Mn all 3d and 4s electrons can take part in bonding.", "Sc से Mn तक सभी 3d और 4s इलेक्ट्रॉन आबंधन में भाग ले सकते हैं।")],
            ]),
            data: { given: [`Z = ${Z}`], find: ["x_{\\max}"] },
            hint: L("For the first half of the 3d series (Sc to Mn), the highest oxidation state equals the number of 3d + 4s electrons.", "3d श्रेणी के पहले अर्ध (Sc से Mn) के लिए उच्चतम ऑक्सीकरण अवस्था = 3d + 4s इलेक्ट्रॉनों की संख्या।"),
            solution: L(`${TM[Z]}: [Ar] 3d${remap(String(d), SUP)} 4s${remap(String(s), SUP)}\nHighest oxidation state = ${d} + ${s} = +${d + s}`, `${TM[Z]}: [Ar] 3d${remap(String(d), SUP)} 4s${remap(String(s), SUP)}\nउच्चतम ऑक्सीकरण अवस्था = ${d} + ${s} = +${d + s}`),
          });
        }
        if (r.int(0, 1) === 0) {
          const [el, col] = r.pick(FLAME);
          const others = r.shuffle(FLAME.filter(([e]) => e !== el)).slice(0, 3);
          return task({
            text: L(`A salt gives a ${col[0]} colour to a non-luminous flame. Which metal ion is present?`, `एक लवण अदीप्त ज्वाला को ${col[1]} रंग देता है। कौन-सा धातु आयन उपस्थित है?`),
            answer: choiceWhy(r, `${el}⁺`.replace(/^(Ca|Ba)⁺$/, "$1²⁺"), others.map(([e, c]) => [`${e}⁺`.replace(/^(Ca|Ba)⁺$/, "$1²⁺"), L(`${e} gives the flame colour: ${c[0]}.`, `${e} से ज्वाला का रंग: ${c[1]}।`)])),
            data: { given: [L(`\\text{flame: ${col[0]}}`, `\\text{ज्वाला: ${col[1]}}`)], find: [L("\\text{ion}", "\\text{आयन}")] },
            hint: L("Recall the flame colours: Li crimson red, Na golden yellow, K violet, Ca brick red, Ba apple green.", "ज्वाला रंग याद कीजिए: Li किरमिजी लाल, Na सुनहरा पीला, K बैंगनी, Ca ईंट जैसा लाल, Ba सेब जैसा हरा।"),
            solution: L(`The heat excites electrons; light of a characteristic colour is emitted when they return.\n${el}: ${col[0]}`, `ऊष्मा इलेक्ट्रॉनों को उत्तेजित करती है; लौटते समय वे विशिष्ट रंग का प्रकाश उत्सर्जित करते हैं।\n${el}: ${col[1]}`),
          });
        }
        const el = r.pick(Object.keys(BURN));
        const [f, kEn, kHi] = BURN[el];
        const opts = { Li: ["Li_2O", "Li_2O_2", "LiO_2"], Na: ["Na_2O", "Na_2O_2", "NaO_2"], K: ["K_2O", "K_2O_2", "KO_2"] }[el];
        const kind = (x) => (/O_2$/.test(x) && !/_2O_2$/.test(x) ? ["superoxide", "सुपरऑक्साइड", "K, Rb and Cs"] : /_2O_2$/.test(x) ? ["peroxide", "परॉक्साइड", "Na"] : ["normal oxide", "सामान्य ऑक्साइड", "Li"]);
        const hyd = uc(`${el}OH`);
        return task({
          text: L(`Which main product forms when ${METAL[el] ? METAL[el][0].toLowerCase() : "lithium"} (${el}) burns in excess air?`, `${el} धातु को वायु के आधिक्य में जलाने पर मुख्य उत्पाद क्या बनता है?`),
          answer: choiceWhy(r, uc(f), [
            ...opts.filter((x) => x !== f).map((x) => [uc(x), L(`${uc(x)} would be a ${kind(x)[0]}; that is formed mainly by ${kind(x)[2]}.`, `${uc(x)} एक ${kind(x)[1]} होगा; यह मुख्यतः ${kind(x)[2]} बनाते हैं।`)]),
            [hyd, L("A hydroxide needs water; burning in air gives an oxide.", "हाइड्रॉक्साइड के लिए जल चाहिए; वायु में जलने से ऑक्साइड बनता है।")],
          ]),
          data: { given: [`\\mathrm{${el} + O_2\\ (\\text{${L("excess", "आधिक्य")}})}`], find: [L("\\text{product}", "\\text{उत्पाद}")] },
          hint: L("Down group 1 the metal ion gets larger and stabilises larger anions: O²⁻ (Li), O₂²⁻ (Na), O₂⁻ (K, Rb, Cs).", "वर्ग 1 में नीचे धातु आयन बड़ा होता है और बड़े ऋणायनों को स्थायी करता है: O²⁻ (Li), O₂²⁻ (Na), O₂⁻ (K, Rb, Cs)।"),
          solution: L(`${el} forms mainly the ${kEn}: ${uc(f)}.`, `${el} मुख्यतः ${kHi} बनाता है: ${uc(f)}।`),
        });
      }
      if (level === 2) {
        const v = r.int(0, 3);
        if (v === 0) {
          const [Z, q] = r.pick(TM_IONS);
          const d = Z - 18 - q;
          const n = d <= 5 ? d : 10 - d;
          const [d0] = tmCfg(Z);
          const ion = uc(`${TM[Z]}^{${q > 1 ? q : ""}+}`);
          return task({
            text: L(`How many unpaired electrons are there in a free (gaseous) ${ion} ion? (${TM[Z]}: Z = ${Z})`, `एक मुक्त (गैसीय) ${ion} आयन में कितने अयुग्मित इलेक्ट्रॉन हैं? (${TM[Z]}: Z = ${Z})`),
            answer: numM(n, 0, [
              ...(d > 5 ? [[d, L("Above 5 electrons the d orbitals start to pair: unpaired = 10 − d.", "5 से अधिक इलेक्ट्रॉन होने पर d कक्षक युग्मित होने लगते हैं: अयुग्मित = 10 − d।")]] : []),
              [Math.max(0, d0 - q) <= 5 ? Math.max(0, d0 - q) : 10 - Math.max(0, d0 - q), L("Electrons are removed from 4s first, then from 3d.", "इलेक्ट्रॉन पहले 4s से, फिर 3d से निकलते हैं।")],
              [d0 <= 5 ? d0 : 10 - d0, L("That is the neutral atom; remove the electrons for the charge first.", "यह उदासीन परमाणु है; पहले आवेश के अनुसार इलेक्ट्रॉन हटाइए।")],
            ]),
            data: { given: [`Z = ${Z}`, `\\mathrm{${TM[Z]}^{${q > 1 ? q : ""}+}}`], find: ["n"] },
            hint: L("Write the configuration of the atom, remove the 4s electrons first, then fill five d orbitals singly before pairing.", "परमाणु का विन्यास लिखिए, पहले 4s इलेक्ट्रॉन हटाइए, फिर युग्मन से पहले पाँचों d कक्षकों में एक-एक इलेक्ट्रॉन भरिए।"),
            solution: L(
              `${TM[Z]}: [Ar] 3d${remap(String(d0), SUP)} 4s${remap(String(tmCfg(Z)[1]), SUP)}\n${ion}: [Ar] 3d${remap(String(d), SUP)}\nUnpaired electrons: ${d <= 5 ? d : `10 − ${d} = ${n}`}`,
              `${TM[Z]}: [Ar] 3d${remap(String(d0), SUP)} 4s${remap(String(tmCfg(Z)[1]), SUP)}\n${ion}: [Ar] 3d${remap(String(d), SUP)}\nअयुग्मित इलेक्ट्रॉन: ${d <= 5 ? d : `10 − ${d} = ${n}`}`,
            ),
          });
        }
        if (v === 1) {
          const [f, E] = r.pick(OX2);
          return oxTask(f, E);
        }
        if (v === 2) {
          // Trendi v 2. skupini.
          const kind = r.int(0, 2); // 0 termična obstojnost karbonatov, 1 topnost sulfatov, 2 topnost hidroksidov
          const els = r.shuffle(G2).slice(0, 4);
          const ser = G2.filter((e) => els.includes(e)); // po skupini navzdol
          const comp = (e) => uc(kind === 0 ? `${e}CO_3` : kind === 1 ? `${e}SO_4` : `${e}(OH)_2`);
          const down = kind === 1 ? [...ser].reverse() : ser; // naraščajoče
          const asc = r.int(0, 1) === 1;
          const sorted = (asc ? down : [...down].reverse()).map(comp);
          const pn = [
            ["thermal stability", "ऊष्मीय स्थायित्व", "Down the group the cation gets larger and polarises the CO₃²⁻ ion less, so carbonates become more stable.", "वर्ग में नीचे धनायन बड़ा होता है और CO₃²⁻ आयन को कम ध्रुवित करता है, इसलिए कार्बोनेट अधिक स्थायी होते हैं।"],
            ["solubility in water", "जल में विलेयता", "Down the group the hydration enthalpy falls faster than the lattice enthalpy, so sulphates become less soluble (BaSO₄ is insoluble).", "वर्ग में नीचे जलयोजन एन्थैल्पी जालक एन्थैल्पी से तेज़ी से घटती है, इसलिए सल्फेट कम विलेय होते हैं (BaSO₄ अविलेय है)।"],
            ["solubility in water", "जल में विलेयता", "Down the group the lattice enthalpy falls faster than the hydration enthalpy, so hydroxides become more soluble.", "वर्ग में नीचे जालक एन्थैल्पी जलयोजन एन्थैल्पी से तेज़ी से घटती है, इसलिए हाइड्रॉक्साइड अधिक विलेय होते हैं।"],
          ][kind];
          return task({
            text: L(`Arrange ${els.map(comp).join(", ")} in ${asc ? "increasing" : "decreasing"} order of ${pn[0]}.`, `${els.map(comp).join(", ")} को ${pn[1]} के ${asc ? "बढ़ते" : "घटते"} क्रम में व्यवस्थित कीजिए।`),
            answer: orderChoice(r, sorted, asc ? "<" : ">", L(`Reversed. ${pn[2]}`, `उलटा क्रम। ${pn[3]}`), (a, b) => L(`${a} and ${b} are in the wrong order: follow the position in group 2.`, `${a} और ${b} का क्रम गलत है: वर्ग 2 में स्थान देखिए।`)),
            data: { given: els.map((e) => `\\mathrm{${e}}`), find: [L(`\\text{${pn[0]}}`, `\\text{${pn[1]}}`)] },
            hint: L("Place the metals in group 2 order (Be, Mg, Ca, Sr, Ba) and apply the trend for this type of compound.", "धातुओं को वर्ग 2 के क्रम (Be, Mg, Ca, Sr, Ba) में रखिए और इस प्रकार के यौगिक की प्रवृत्ति लगाइए।"),
            solution: L(`${pn[2]}\nOrder: ${sorted.join(asc ? " < " : " > ")}`, `${pn[3]}\nक्रम: ${sorted.join(asc ? " < " : " > ")}`),
          });
        }
        const [qEn, qHi, c, wrong, sEn, sHi] = r.pick(LANTH);
        return task({
          text: L(`${qEn}${qEn.endsWith("?") ? "" : ":"}`, `${qHi}${qHi.endsWith("?") ? "" : ":"}`),
          answer: choiceWhy(r, L(c[0], c[1]), wrong.map(([e, h, we, wh]) => [L(e, h), L(we, wh)])),
          data: { given: ["\\mathrm{La \\rightarrow Lu}\\ (4f^{0} \\rightarrow 4f^{14})"], find: [L("\\text{statement}", "\\text{कथन}")] },
          hint: L("In the lanthanoids electrons enter the 4f subshell, which shields the outer electrons poorly.", "लैन्थेनॉयडों में इलेक्ट्रॉन 4f उपकोश में जाते हैं, जो बाहरी इलेक्ट्रॉनों का ठीक से परिरक्षण नहीं करता।"),
          solution: L(`${sEn}\nAnswer: ${c[0]}`, `${sHi}\nउत्तर: ${c[1]}`),
        });
      }
      const v = r.int(0, 2);
      if (v === 0) {
        const [Z, q] = r.pick(TM_IONS.filter(([z, qq]) => qq >= 2 && z !== 30 && !(z === 21)));
        const d = Z - 18 - q;
        const n = d <= 5 ? d : 10 - d;
        const mu = Math.sqrt(n * (n + 2));
        const [d0] = tmCfg(Z);
        const wrongD = Math.max(0, d0 - q);
        const wrongN = wrongD <= 5 ? wrongD : 10 - wrongD;
        const qn = q === 2 ? ["divalent", "द्विसंयोजी"] : ["trivalent", "त्रिसंयोजी"];
        return task({
          text: L(`Calculate the spin-only magnetic moment of a ${qn[0]} ion of the element with atomic number ${Z} (free ion), in BM.${roundToL(2, lang)}`, `परमाणु संख्या ${Z} वाले तत्व के ${qn[1]} आयन (मुक्त आयन) का केवल-चक्रण चुंबकीय आघूर्ण BM में परिकलित कीजिए।${roundToL(2, lang)}`),
          answer: numM(mu, 2, [
            [Math.sqrt(wrongN * (wrongN + 2)), L("Remove the 4s electrons first, then 3d.", "पहले 4s इलेक्ट्रॉन हटाइए, फिर 3d।")],
            [n * (n + 2), L("Take the square root: μ = √(n(n+2)).", "वर्गमूल लीजिए: μ = √(n(n+2))।")],
            [Math.sqrt(d * (d + 2)), L("Use the number of UNPAIRED electrons, not all d electrons.", "अयुग्मित इलेक्ट्रॉनों की संख्या लीजिए, सभी d इलेक्ट्रॉन नहीं।")],
          ]),
          data: { given: [`Z = ${Z}`], find: ["\\mu"] },
          hint: L("Write the configuration of the ion, count the unpaired d electrons n, then use μ = √(n(n+2)).", "आयन का विन्यास लिखिए, अयुग्मित d इलेक्ट्रॉन n गिनिए, फिर μ = √(n(n+2)) लीजिए।"),
          formula: "\\mu = \\sqrt{n(n+2)}\\ \\mathrm{BM}",
          solution: L(
            `Z = ${Z} is ${TM[Z]}: [Ar] 3d${remap(String(d0), SUP)} 4s${remap(String(tmCfg(Z)[1]), SUP)}\n${uc(`${TM[Z]}^{${q}+}`)}: [Ar] 3d${remap(String(d), SUP)} → n = ${n}\n$\\mu = \\sqrt{${n}(${n} + 2)} = \\sqrt{${n * (n + 2)}} \\approx ${en(mu, 2)}\\ \\mathrm{BM}$`,
            `Z = ${Z} तत्व ${TM[Z]} है: [Ar] 3d${remap(String(d0), SUP)} 4s${remap(String(tmCfg(Z)[1]), SUP)}\n${uc(`${TM[Z]}^{${q}+}`)}: [Ar] 3d${remap(String(d), SUP)} → n = ${n}\n$\\mu = \\sqrt{${n}(${n} + 2)} = \\sqrt{${n * (n + 2)}} \\approx ${en(mu, 2)}\\ \\mathrm{BM}$`,
          ),
        });
      }
      if (v === 1) {
        const [f, E, p, wEn, wHi] = r.pick(OX3);
        const x = oxState(f, E, p);
        const naive = E === "O" ? -2 : oxState(f, E, 0);
        const exact = Number.isInteger(x);
        const avg = !exact || f === "Na_2S_2O_3";
        return task({
          text: L(
            `What is the ${avg ? "average " : ""}oxidation state of ${E} in $\\mathrm{${f}}$?${exact ? "" : roundToL(2, lang)}`,
            `$\\mathrm{${f}}$ में ${E} की ${avg ? "औसत " : ""}ऑक्सीकरण अवस्था क्या है?${exact ? "" : roundToL(2, lang)}`,
          ),
          answer: numM(x, exact ? 0 : 2, [
            [naive, E === "O" ? L("Oxygen is not −2 here: look at how the O atoms are bonded.", "यहाँ ऑक्सीजन −2 नहीं है: देखिए कि O परमाणु कैसे जुड़े हैं।") : L("Not every O atom is −2: check the structure for –O–O– (peroxide) links.", "हर O परमाणु −2 नहीं है: संरचना में –O–O– (परॉक्साइड) बंध जाँचिए।")],
            [-x, L("Check the sign.", "चिह्न जाँचिए।")],
          ]),
          data: { given: [`\\mathrm{${f}}`], find: [`x(\\mathrm{${E}})`] },
          hint: L("Draw or recall the structure first: peroxide oxygen (–O–O–) is −1, superoxide oxygen is −½.", "पहले संरचना बनाइए या याद कीजिए: परॉक्साइड ऑक्सीजन (–O–O–) −1 और सुपरऑक्साइड ऑक्सीजन −½ होता है।"),
          solution: L(`${wEn}\n${E === "O" ? `$${oxLine(f, "O")}$` : `$x = ${sgn(Math.round(x * 100) / 100)}$${p ? ` (simple count with all O = −2 would give ${sgn(naive)})` : ""}`}\nAnswer: ${sgn(Math.round(x * 100) / 100)}`, `${wHi}\n${E === "O" ? `$${oxLine(f, "O")}$` : `$x = ${sgn(Math.round(x * 100) / 100)}$${p ? ` (सभी O = −2 मानने पर ${sgn(naive)} आता)` : ""}`}\nउत्तर: ${sgn(Math.round(x * 100) / 100)}`),
        });
      }
      const [ox, correct, wrong, sEn, sHi] = r.pick(LN_OX);
      const picked = r.shuffle(wrong).slice(0, 3);
      return task({
        text: L(`Which lanthanoid commonly shows the oxidation state ${ox} besides +3?`, `कौन-सा लैन्थेनॉयड +3 के अतिरिक्त सामान्यतः ${ox} ऑक्सीकरण अवस्था दर्शाता है?`),
        answer: choiceWhy(r, correct, picked.map(([e, we, wh]) => [e, L(we, wh)])),
        data: { given: [`\\text{${L("oxidation state", "ऑक्सीकरण अवस्था")}}\\ ${ox}`], find: [L("\\text{lanthanoid}", "\\text{लैन्थेनॉयड}")] },
        hint: L("Extra stability comes with an empty (4f⁰), half-filled (4f⁷) or full (4f¹⁴) 4f subshell.", "रिक्त (4f⁰), अर्धपूर्ण (4f⁷) या पूर्ण (4f¹⁴) 4f उपकोश अतिरिक्त स्थायित्व देता है।"),
        solution: L(`${sEn}\nAnswer: ${correct}`, `${sHi}\nउत्तर: ${correct}`),
      });
    },
  },
  {
    id: "exi-kem-colligative",
    topics: [T("colligative-properties")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const nm = r.pick(NAMES);
      const NE = [["glucose", "ग्लूकोस", "C_6H_{12}O_6", 180], ["urea", "यूरिया", "NH_2CONH_2", 60], ["sucrose", "सुक्रोस", "C_{12}H_{22}O_{11}", 342], ["ethylene glycol", "एथिलीन ग्लाइकॉल", "C_2H_6O_2", 62]];
      const EL = [
        ["NaCl", 2, 1, "Na⁺ + Cl⁻"],
        ["KCl", 2, 1, "K⁺ + Cl⁻"],
        ["MgSO_4", 2, 1, "Mg²⁺ + SO₄²⁻"],
        ["CaCl_2", 3, 2, "Ca²⁺ + 2Cl⁻"],
        ["K_2SO_4", 3, 2, "2K⁺ + SO₄²⁻"],
        ["Na_2SO_4", 3, 2, "2Na⁺ + SO₄²⁻"],
        ["AlCl_3", 4, 2, "Al³⁺ + 3Cl⁻"],
        ["K_4[Fe(CN)_6]", 5, 11, "4K⁺ + [Fe(CN)₆]⁴⁻"],
      ];
      const round = (x, d) => Math.round(x * 10 ** d) / 10 ** d;
      if (level === 1) {
        const v = r.int(0, 3);
        if (v === 0 || v === 1) {
          const fr = v === 0;
          const K = fr ? 1.86 : 0.52;
          const m = r.pick([0.1, 0.2, 0.25, 0.4, 0.5, 0.75, 1, 1.5]);
          const [sEn, sHi] = r.pick(NE);
          const dT = K * m;
          return task({
            text: L(
              `A ${en(m)} m aqueous solution of ${sEn} (a non-electrolyte) is prepared. By how much is the ${fr ? "freezing point lowered" : "boiling point raised"}, in K? ($K_${fr ? "f" : "b"}$ of water = ${en(K)} K kg/mol)${roundToL(2, lang)}`,
              `${sHi} (अविद्युत-अपघट्य) का ${en(m)} m जलीय विलयन बनाया जाता है। ${fr ? "हिमांक में कितना अवनमन" : "क्वथनांक में कितना उन्नयन"} होता है (K में)? (जल का $K_${fr ? "f" : "b"}$ = ${en(K)} K kg/mol)${roundToL(2, lang)}`,
            ),
            answer: numM(dT, 2, [
              [(fr ? 0.52 : 1.86) * m, L(`Use $K_${fr ? "f" : "b"}$, the ${fr ? "cryoscopic" : "ebullioscopic"} constant.`.replace(/\$/g, ""), `${fr ? "हिमांक" : "क्वथनांक"} के लिए सही स्थिरांक लीजिए।`)],
              [m / K, L("Multiply the molality by the constant, do not divide.", "मोललता को स्थिरांक से गुणा कीजिए, भाग नहीं।")],
            ]),
            data: { given: [`m = ${en(m)}\\ \\mathrm{mol/kg}`, `K_${fr ? "f" : "b"} = ${en(K)}\\ \\mathrm{K\\,kg/mol}`], find: [`\\Delta T_${fr ? "f" : "b"}`] },
            hint: L("For a non-electrolyte i = 1, so the change is the constant times the molality.", "अविद्युत-अपघट्य के लिए i = 1, इसलिए परिवर्तन = स्थिरांक × मोललता।"),
            formula: `\\Delta T_${fr ? "f" : "b"} = K_${fr ? "f" : "b"}\\, m`,
            solution: L(`$\\Delta T_${fr ? "f" : "b"} = ${en(K)} \\cdot ${en(m)}$\n$\\Delta T_${fr ? "f" : "b"} = ${en(dT, 3)} \\approx ${en(dT, 2)}\\ \\mathrm{K}$`, `$\\Delta T_${fr ? "f" : "b"} = ${en(K)} \\cdot ${en(m)}$\n$\\Delta T_${fr ? "f" : "b"} = ${en(dT, 3)} \\approx ${en(dT, 2)}\\ \\mathrm{K}$ (${fr ? "हिमांक अवनमन" : "क्वथनांक उन्नयन"})`),
          });
        }
        if (v === 2) {
          const n2 = r.pick([0.1, 0.2, 0.25, 0.3, 0.5]);
          const n1 = r.pick([4.5, 5, 8, 9.5, 10]);
          const x2 = n2 / (n1 + n2);
          return task({
            text: L(
              `${n2} mol of a non-volatile solute is dissolved in ${en(n1)} mol of water. What is the relative lowering of vapour pressure, (p° − p)/p°?${roundToL(4, lang)}`,
              `${n2} mol अवाष्पशील विलेय को ${en(n1)} mol जल में घोला जाता है। वाष्प दाब का आपेक्षिक अवनमन (p° − p)/p° क्या है?${roundToL(4, lang)}`,
            ),
            answer: numM(x2, 4, [
              [n2 / n1, L("Use the mole fraction: divide by the TOTAL amount, n₁ + n₂.", "मोल अंश लीजिए: कुल मात्रा n₁ + n₂ से भाग दीजिए।")],
              [n1 / (n1 + n2), L("That is the mole fraction of the solvent; the lowering equals the mole fraction of the solute.", "यह विलायक का मोल अंश है; अवनमन विलेय के मोल अंश के बराबर है।")],
            ]),
            data: { given: [`n_2 = ${en(n2)}\\ \\mathrm{mol}`, `n_1 = ${en(n1)}\\ \\mathrm{mol}`], find: ["\\dfrac{p^\\circ - p}{p^\\circ}"] },
            hint: L("By Raoult's law the relative lowering of vapour pressure equals the mole fraction of the solute.", "राउल्ट नियम के अनुसार वाष्प दाब का आपेक्षिक अवनमन विलेय के मोल अंश के बराबर है।"),
            formula: "\\dfrac{p^\\circ - p}{p^\\circ} = x_2 = \\dfrac{n_2}{n_1 + n_2}",
            solution: L(`$x_2 = \\dfrac{${en(n2)}}{${en(n1)} + ${en(n2)}}$\n$x_2 \\approx ${en(x2, 4)}$`, `$x_2 = \\dfrac{${en(n2)}}{${en(n1)} + ${en(n2)}}$\n$x_2 \\approx ${en(x2, 4)}$ (आपेक्षिक अवनमन)`),
          });
        }
        const [f, i, wrongI, ions] = r.pick(EL);
        return task({
          text: L(`What is the van 't Hoff factor $i$ of $\\mathrm{${f}}$ in a dilute aqueous solution, assuming complete dissociation?`, `पूर्ण वियोजन मानकर तनु जलीय विलयन में $\\mathrm{${f}}$ का वान्ट हॉफ गुणक $i$ क्या है?`),
          answer: numM(i, 0, [
            [wrongI, f.includes("[") ? L("The complex ion [Fe(CN)₆]⁴⁻ stays together; CN⁻ is not released.", "संकुल आयन [Fe(CN)₆]⁴⁻ एक साथ रहता है; CN⁻ मुक्त नहीं होता।") : L("Count every ion separately: a subscript 2 or 3 means that many ions.", "हर आयन अलग गिनिए: पादांक 2 या 3 का अर्थ उतने ही आयन।")],
            [1, L("Only non-electrolytes have i = 1; this salt dissociates.", "केवल अविद्युत-अपघट्यों के लिए i = 1; यह लवण वियोजित होता है।")],
          ]),
          data: { given: [`\\mathrm{${f}}`], find: ["i"] },
          hint: L("Write the dissociation equation and count the ions from one formula unit.", "वियोजन समीकरण लिखिए और एक सूत्र इकाई से बनने वाले आयन गिनिए।"),
          solution: L(`${uc(f)} → ${ions}\n$i = ${i}$`, `${uc(f)} → ${ions}\n$i = ${i}$ (आयनों की संख्या)`),
        });
      }
      if (level === 2) {
        const v = r.int(0, 3);
        if (v === 0) {
          const [sEn, sHi, sf, M] = r.pick(NE);
          const W = r.pick([100, 200, 250, 500]);
          const w = round(M * r.pick([0.025, 0.05, 0.1, 0.15, 0.2]) * (W / 100), 2);
          const m = w / M / (W / 1000);
          const dT = 1.86 * m;
          return task({
            text: L(
              `${nm[0]} dissolves ${en(w)} g of ${sEn} ($\\mathrm{${sf}}$, M = ${M} g/mol) in ${W} g of water. At what temperature (in °C) does the solution freeze? (Kf of water = 1.86 K kg/mol; pure water freezes at 0 °C)${roundToL(2, lang)}`,
              `${nm[1]} ${en(w)} g ${sHi} ($\\mathrm{${sf}}$, M = ${M} g/mol) को ${W} g जल में घोलते हैं। यह विलयन किस ताप (°C में) पर जमेगा? (जल का Kf = 1.86 K kg/mol; शुद्ध जल 0 °C पर जमता है)${roundToL(2, lang)}`,
            ).replace("घोलते हैं", "घोलता/घोलती है").replace("घोलता/घोलती है", ["Priya", "Ananya", "Meera", "Diya"].includes(nm[0]) ? "घोलती है" : "घोलता है"),
            answer: numM(-dT, 2, [
              [dT, L("ΔTf is the lowering: the freezing point is 0 − ΔTf, a negative Celsius temperature.", "ΔTf अवनमन है: हिमांक 0 − ΔTf है, जो ऋणात्मक सेल्सियस ताप है।")],
              [-dT / 1000, L("Convert the mass of water to kg when finding the molality.", "मोललता ज्ञात करते समय जल का द्रव्यमान kg में बदलिए।")],
            ]),
            data: { given: [`w = ${en(w)}\\ \\mathrm{g}`, `M = ${M}\\ \\mathrm{g/mol}`, `W = ${W}\\ \\mathrm{g}`, "K_f = 1.86\\ \\mathrm{K\\,kg/mol}"], find: ["T_f"] },
            hint: L("Find the molality m = (w/M)/(W in kg), then ΔTf = Kf·m and subtract from 0 °C.", "मोललता m = (w/M)/(W kg में) ज्ञात कीजिए, फिर ΔTf = Kf·m और इसे 0 °C से घटाइए।"),
            formula: "\\Delta T_f = K_f \\cdot \\dfrac{w \\cdot 1000}{M \\cdot W}",
            solution: L(
              `$m = \\dfrac{${en(w)}/${M}}{${en(W / 1000)}} = ${en(m, 4)}\\ \\mathrm{mol/kg}$\n$\\Delta T_f = 1.86 \\cdot ${en(m, 4)} = ${en(dT, 3)}\\ \\mathrm{K}$\n$T_f = 0 - ${en(dT, 3)} \\approx ${en(-dT, 2)}\\ ^\\circ\\mathrm{C}$`,
              `$m = \\dfrac{${en(w)}/${M}}{${en(W / 1000)}} = ${en(m, 4)}\\ \\mathrm{mol/kg}$\n$\\Delta T_f = 1.86 \\cdot ${en(m, 4)} = ${en(dT, 3)}\\ \\mathrm{K}$\n$T_f = 0 - ${en(dT, 3)} \\approx ${en(-dT, 2)}\\ ^\\circ\\mathrm{C}$ (हिमांक)`,
            ),
          });
        }
        if (v === 1) {
          const [f, i] = r.pick(EL);
          const m = r.pick([0.05, 0.1, 0.15, 0.2, 0.25]);
          const fr = r.int(0, 1) === 1;
          const K = fr ? 1.86 : 0.52;
          const dT = i * K * m;
          return task({
            text: L(
              `Find the ${fr ? "depression in freezing point" : "elevation in boiling point"} (in K) of a ${en(m)} m aqueous solution of $\\mathrm{${f}}$, assuming complete dissociation. ($K_${fr ? "f" : "b"}$ = ${en(K)} K kg/mol)${roundToL(3, lang)}`,
              `पूर्ण वियोजन मानकर $\\mathrm{${f}}$ के ${en(m)} m जलीय विलयन का ${fr ? "हिमांक अवनमन" : "क्वथनांक उन्नयन"} (K में) ज्ञात कीजिए। ($K_${fr ? "f" : "b"}$ = ${en(K)} K kg/mol)${roundToL(3, lang)}`,
            ),
            answer: numM(dT, 3, [
              [K * m, L("The salt dissociates: multiply by the van 't Hoff factor i.", "लवण वियोजित होता है: वान्ट हॉफ गुणक i से गुणा कीजिए।")],
              [(i - 1) * K * m, L("i is the total number of ions, not the number of ions minus one.", "i कुल आयनों की संख्या है, आयनों की संख्या में से एक घटाकर नहीं।")],
            ]),
            data: { given: [`m = ${en(m)}\\ \\mathrm{mol/kg}`, `K_${fr ? "f" : "b"} = ${en(K)}\\ \\mathrm{K\\,kg/mol}`, `\\mathrm{${f}}`], find: [`\\Delta T_${fr ? "f" : "b"}`] },
            hint: L("Find i from the number of ions per formula unit, then multiply i·K·m.", "प्रति सूत्र इकाई आयनों की संख्या से i ज्ञात कीजिए, फिर i·K·m गुणा कीजिए।"),
            formula: `\\Delta T_${fr ? "f" : "b"} = i\\, K_${fr ? "f" : "b"}\\, m`,
            solution: L(`$i = ${i}$\n$\\Delta T_${fr ? "f" : "b"} = ${i} \\cdot ${en(K)} \\cdot ${en(m)} \\approx ${en(dT, 3)}\\ \\mathrm{K}$`, `$i = ${i}$ (वान्ट हॉफ गुणक)\n$\\Delta T_${fr ? "f" : "b"} = ${i} \\cdot ${en(K)} \\cdot ${en(m)} \\approx ${en(dT, 3)}\\ \\mathrm{K}$`),
          });
        }
        if (v === 2) {
          const [sEn, sHi, sf, M] = r.pick(NE.slice(0, 3));
          const w = r.pick([1.8, 3.6, 4.5, 9, 18]) * (M / 180);
          const V = r.pick([100, 200, 250, 500]);
          const t = r.pick([17, 25, 27, 37]);
          const Tk = t + 273;
          const C = w / M / (V / 1000);
          const pi = C * 0.083 * Tk;
          return task({
            text: L(
              `${en(round(w, 3))} g of ${sEn} (M = ${M} g/mol) is dissolved in water to make ${V} mL of solution at ${t} °C. Find its osmotic pressure in bar. (R = 0.083 L bar/(mol K), T = t + 273)${roundToL(2, lang)}`,
              `${en(round(w, 3))} g ${sHi} (M = ${M} g/mol) को जल में घोलकर ${t} °C पर ${V} mL विलयन बनाया जाता है। इसका परासरण दाब bar में ज्ञात कीजिए। (R = 0.083 L bar/(mol K), T = t + 273)${roundToL(2, lang)}`,
            ),
            answer: numM(pi, 2, [
              [C * 0.083 * t, L("Use the absolute temperature in kelvin: T = t + 273.", "परम ताप केल्विन में लीजिए: T = t + 273।")],
              [pi / 1000, L("Convert the volume to litres; the concentration must be in mol/L.", "आयतन को लीटर में बदलिए; सांद्रता mol/L में होनी चाहिए।")],
            ]),
            data: { given: [`w = ${en(round(w, 3))}\\ \\mathrm{g}`, `M = ${M}\\ \\mathrm{g/mol}`, `V = ${V}\\ \\mathrm{mL}`, `t = ${t}\\ ^\\circ\\mathrm{C}`, "R = 0.083\\ \\mathrm{L\\,bar/(mol\\,K)}"], find: ["\\pi"] },
            hint: L("π = CRT with C in mol/L and T in kelvin.", "π = CRT, जहाँ C mol/L में और T केल्विन में।"),
            formula: "\\pi = C R T = \\dfrac{w}{M V} R T",
            solution: L(
              `$C = \\dfrac{${en(round(w, 3))}/${M}}{${en(V / 1000)}} = ${en(C, 4)}\\ \\mathrm{mol/L}$, $T = ${Tk}\\ \\mathrm{K}$\n$\\pi = ${en(C, 4)} \\cdot 0.083 \\cdot ${Tk} \\approx ${en(pi, 2)}\\ \\mathrm{bar}$`,
              `$C = \\dfrac{${en(round(w, 3))}/${M}}{${en(V / 1000)}} = ${en(C, 4)}\\ \\mathrm{mol/L}$, $T = ${Tk}\\ \\mathrm{K}$\n$\\pi = ${en(C, 4)} \\cdot 0.083 \\cdot ${Tk} \\approx ${en(pi, 2)}\\ \\mathrm{bar}$ (परासरण दाब)`,
            ),
          });
        }
        const [sEn, sHi, sf, M] = r.pick(NE);
        const W = r.pick([90, 100, 180, 200]);
        const w = round(M * r.pick([0.1, 0.2, 0.25, 0.5]), 2);
        const p0 = r.pick([17.54, 23.76, 31.82]);
        const tC = { 17.54: 20, 23.76: 25, 31.82: 30 }[p0];
        const n1 = W / 18,
          n2 = w / M;
        const p = (p0 * n1) / (n1 + n2);
        return task({
          text: L(
            `${en(w)} g of ${sEn} (M = ${M} g/mol, non-volatile) is dissolved in ${W} g of water at ${tC} °C, where the vapour pressure of pure water is ${en(p0)} mm Hg. Find the vapour pressure of the solution in mm Hg. (H₂O = 18 g/mol)${roundToL(2, lang)}`,
            `${en(w)} g ${sHi} (M = ${M} g/mol, अवाष्पशील) को ${tC} °C पर ${W} g जल में घोला जाता है, जहाँ शुद्ध जल का वाष्प दाब ${en(p0)} mm Hg है। विलयन का वाष्प दाब mm Hg में ज्ञात कीजिए। (H₂O = 18 g/mol)${roundToL(2, lang)}`,
          ),
          answer: numM(p, 2, [
            [p0 - p, L("That is the lowering p° − p; the question asks for p itself.", "यह अवनमन p° − p है; प्रश्न में स्वयं p पूछा गया है।")],
            [p0 * (1 - n2 / n1) === p ? NaN : p0 * (1 - n2 / n1), L("Use the exact mole fraction n₁/(n₁ + n₂), not 1 − n₂/n₁.", "सटीक मोल अंश n₁/(n₁ + n₂) लीजिए, 1 − n₂/n₁ नहीं।")],
          ]),
          data: { given: [`w = ${en(w)}\\ \\mathrm{g}`, `M = ${M}\\ \\mathrm{g/mol}`, `W = ${W}\\ \\mathrm{g}`, `p^\\circ = ${en(p0)}\\ \\mathrm{mm\\,Hg}`], find: ["p"] },
          hint: L("Raoult's law: p = x₁·p°, with x₁ the mole fraction of water.", "राउल्ट नियम: p = x₁·p°, जहाँ x₁ जल का मोल अंश है।"),
          formula: "p = x_1 p^\\circ = \\dfrac{n_1}{n_1 + n_2} p^\\circ",
          solution: L(
            `$n_1 = ${W}/18 = ${en(n1, 4)}\\ \\mathrm{mol}$, $n_2 = ${en(w)}/${M} = ${en(n2, 4)}\\ \\mathrm{mol}$\n$x_1 = \\dfrac{${en(n1, 4)}}{${en(n1 + n2, 4)}} = ${en(n1 / (n1 + n2), 4)}$\n$p = ${en(n1 / (n1 + n2), 4)} \\cdot ${en(p0)} \\approx ${en(p, 2)}\\ \\mathrm{mm\\,Hg}$`,
            `$n_1 = ${W}/18 = ${en(n1, 4)}\\ \\mathrm{mol}$, $n_2 = ${en(w)}/${M} = ${en(n2, 4)}\\ \\mathrm{mol}$\n$x_1 = \\dfrac{${en(n1, 4)}}{${en(n1 + n2, 4)}} = ${en(n1 / (n1 + n2), 4)}$ (जल का मोल अंश)\n$p = ${en(n1 / (n1 + n2), 4)} \\cdot ${en(p0)} \\approx ${en(p, 2)}\\ \\mathrm{mm\\,Hg}$`,
          ),
        });
      }
      // Raven 3.
      const v = r.int(0, 3);
      if (v === 0) {
        // Molska masa iz znižanja zmrzišča.
        const benz = r.int(0, 1) === 1;
        const Kf = benz ? 5.12 : 1.86;
        const Mt = r.pick(benz ? [122, 128, 154, 178, 256] : [60, 92, 180, 342, 62]);
        const W = r.pick([50, 100, 200, 250]);
        const w = r.pick([1, 1.5, 2, 2.5, 3, 5]);
        const dT = round((Kf * w * 1000) / (Mt * W), 3);
        const M = (Kf * w * 1000) / (dT * W);
        return task({
          text: L(
            `${en(w)} g of a non-volatile, non-electrolyte solute is dissolved in ${W} g of ${benz ? "benzene" : "water"}. The freezing point is lowered by ${en(dT)} K. Find the molar mass of the solute in g/mol. ($K_f$ of ${benz ? "benzene" : "water"} = ${en(Kf)} K kg/mol)${roundToL(0, lang)}`,
            `एक अवाष्पशील, अविद्युत-अपघट्य विलेय के ${en(w)} g को ${W} g ${benz ? "बेन्ज़ीन" : "जल"} में घोलने पर हिमांक ${en(dT)} K घट जाता है। विलेय का मोलर द्रव्यमान g/mol में ज्ञात कीजिए। (${benz ? "बेन्ज़ीन" : "जल"} का $K_f$ = ${en(Kf)} K kg/mol)${roundToL(0, lang)}`,
          ),
          answer: numM(M, 0, [
            [M / 1000, L("Use the mass of solvent in kg (multiply by 1000/W in grams).", "विलायक का द्रव्यमान kg में लीजिए (ग्राम में W के लिए 1000/W से गुणा कीजिए)।")],
            [(Kf * W) / (dT * w * 1000) > 0 ? (dT * W) / (Kf * w) : NaN, L("Invert the formula correctly: M = Kf·w·1000/(ΔTf·W).", "सूत्र सही उलटिए: M = Kf·w·1000/(ΔTf·W)।")],
          ]),
          data: { given: [`w = ${en(w)}\\ \\mathrm{g}`, `W = ${W}\\ \\mathrm{g}`, `\\Delta T_f = ${en(dT)}\\ \\mathrm{K}`, `K_f = ${en(Kf)}\\ \\mathrm{K\\,kg/mol}`], find: ["M"] },
          hint: L("Start from ΔTf = Kf·m with m = (w/M)/(W/1000) and solve for M.", "ΔTf = Kf·m से शुरू कीजिए, जहाँ m = (w/M)/(W/1000), और M के लिए हल कीजिए।"),
          formula: "M = \\dfrac{K_f \\cdot w \\cdot 1000}{\\Delta T_f \\cdot W}",
          solution: L(
            `$M = \\dfrac{${en(Kf)} \\cdot ${en(w)} \\cdot 1000}{${en(dT)} \\cdot ${W}}$\n$M \\approx ${en(M, 1)} \\approx ${en(M, 0)}\\ \\mathrm{g/mol}$`,
            `$M = \\dfrac{${en(Kf)} \\cdot ${en(w)} \\cdot 1000}{${en(dT)} \\cdot ${W}}$\n$M \\approx ${en(M, 1)} \\approx ${en(M, 0)}\\ \\mathrm{g/mol}$ (मोलर द्रव्यमान)`,
          ),
        });
      }
      if (v === 1) {
        // Molska masa proteina iz osmoznega tlaka.
        const Mt = r.pick([20000, 35000, 45000, 61000, 68000]);
        const w = r.pick([0.5, 1, 1.26, 2, 2.5]);
        const V = r.pick([100, 200, 250]);
        const T = r.pick([298, 300, 310]);
        const piE = round(((w / Mt / (V / 1000)) * 0.083 * T) * 1000, 2); // v 10⁻³ bar
        const M = (w * 0.083 * T) / ((piE / 1000) * (V / 1000));
        return task({
          text: L(
            `${en(w)} g of a protein is dissolved in water to make ${V} mL of solution. At ${T} K its osmotic pressure is $${en(piE)} \\times 10^{-3}$ bar. Find the molar mass of the protein in g/mol. (R = 0.083 L bar/(mol K))${roundToL(0, lang)}`,
            `एक प्रोटीन के ${en(w)} g को जल में घोलकर ${V} mL विलयन बनाया जाता है। ${T} K पर इसका परासरण दाब $${en(piE)} \\times 10^{-3}$ bar है। प्रोटीन का मोलर द्रव्यमान g/mol में ज्ञात कीजिए। (R = 0.083 L bar/(mol K))${roundToL(0, lang)}`,
          ),
          answer: numM(M, 0, [
            [M / 1000, L("Convert the volume from mL to L.", "आयतन mL से L में बदलिए।")],
            [M * 1000, L("π is given in units of 10⁻³ bar: include the factor 10⁻³.", "π, 10⁻³ bar की इकाई में दिया है: 10⁻³ गुणक शामिल कीजिए।")],
          ]),
          data: { given: [`w = ${en(w)}\\ \\mathrm{g}`, `V = ${V}\\ \\mathrm{mL}`, `T = ${T}\\ \\mathrm{K}`, `\\pi = ${en(piE)} \\times 10^{-3}\\ \\mathrm{bar}`], find: ["M"] },
          hint: L("π = (w/M)RT/V; solve for M. Osmotic pressure is the method of choice for macromolecules.", "π = (w/M)RT/V; M के लिए हल कीजिए। बृहदणुओं के लिए परासरण दाब सबसे उपयुक्त विधि है।"),
          formula: "M = \\dfrac{w R T}{\\pi V}",
          solution: L(
            `$M = \\dfrac{${en(w)} \\cdot 0.083 \\cdot ${T}}{${en(piE)} \\times 10^{-3} \\cdot ${en(V / 1000)}}$\n$M \\approx ${en(M, 0)}\\ \\mathrm{g/mol}$`,
            `$M = \\dfrac{${en(w)} \\cdot 0.083 \\cdot ${T}}{${en(piE)} \\times 10^{-3} \\cdot ${en(V / 1000)}}$\n$M \\approx ${en(M, 0)}\\ \\mathrm{g/mol}$ (मोलर द्रव्यमान)`,
          ),
        });
      }
      if (v === 2) {
        // Primerjava raztopin.
        const SOL = [["glucose", "ग्लूकोस", 1], ["urea", "यूरिया", 1], ["NaCl", "NaCl", 2], ["KCl", "KCl", 2], ["CaCl₂", "CaCl₂", 3], ["K₂SO₄", "K₂SO₄", 3], ["AlCl₃", "AlCl₃", 4], ["K₄[Fe(CN)₆]", "K₄[Fe(CN)₆]", 5]];
        let picks, ms, im;
        do {
          picks = r.shuffle(SOL).slice(0, 4);
          ms = picks.map(() => r.pick([0.01, 0.02, 0.05, 0.1]));
          im = picks.map((p, k) => round(p[2] * ms[k], 4));
        } while (new Set(im).size < 4);
        const kind = r.int(0, 2); // 0 najnižje zmrzišče, 1 najvišje vrelišče, 2 najvišje zmrzišče
        const best = kind === 2 ? im.indexOf(Math.min(...im)) : im.indexOf(Math.max(...im));
        const lab = (k) => L(`${en(ms[k])} m ${picks[k][0]}`, `${en(ms[k])} m ${picks[k][1]}`);
        const q = [
          ["Which aqueous solution has the lowest freezing point?", "किस जलीय विलयन का हिमांक सबसे कम है?"],
          ["Which aqueous solution has the highest boiling point?", "किस जलीय विलयन का क्वथनांक सबसे अधिक है?"],
          ["Which aqueous solution has the highest freezing point?", "किस जलीय विलयन का हिमांक सबसे अधिक है?"],
        ][kind];
        return task({
          text: L(`${q[0]} (Assume complete dissociation of electrolytes.)`, `${q[1]} (विद्युत-अपघट्यों का पूर्ण वियोजन मानिए।)`),
          answer: choiceWhy(
            r,
            lab(best),
            picks.map((_, k) => k).filter((k) => k !== best).map((k) => [lab(k), L(`i·m = ${picks[k][2]} · ${en(ms[k])} = ${en(im[k])}, ${kind === 2 ? "larger" : "smaller"} than ${en(im[best])}.`, `i·m = ${picks[k][2]} · ${en(ms[k])} = ${en(im[k])}, जो ${en(im[best])} से ${kind === 2 ? "अधिक" : "कम"} है।`)]),
          ),
          data: { given: picks.map((p, k) => `${en(ms[k])}\\ \\mathrm{m}\\ \\text{${p[0]}}`), find: [kind === 1 ? "T_b" : "T_f"] },
          hint: L("Colligative effects depend on the number of solute particles: compare i·m for each solution.", "अणुसंख्य प्रभाव विलेय कणों की संख्या पर निर्भर हैं: प्रत्येक विलयन के लिए i·m की तुलना कीजिए।"),
          formula: "\\Delta T = i\\, K\\, m",
          solution: L(
            `${picks.map((p, k) => `${en(ms[k])} m ${p[0]}: i·m = ${p[2]} · ${en(ms[k])} = ${en(im[k])}`).join("\n")}\n${kind === 2 ? "Smallest" : "Largest"} i·m → ${kind === 0 ? "largest ΔTf → lowest freezing point" : kind === 1 ? "largest ΔTb → highest boiling point" : "smallest ΔTf → highest freezing point"}: ${lab(best)}`,
            `${picks.map((p, k) => `${en(ms[k])} m ${p[1]}: i·m = ${p[2]} · ${en(ms[k])} = ${en(im[k])}`).join("\n")}\n${kind === 2 ? "सबसे कम" : "सबसे अधिक"} i·m → ${kind === 0 ? "सबसे अधिक ΔTf → सबसे कम हिमांक" : kind === 1 ? "सबसे अधिक ΔTb → सबसे अधिक क्वथनांक" : "सबसे कम ΔTf → सबसे अधिक हिमांक"}: ${lab(best)}`,
          ),
        });
      }
      // Stopnja disociacije iz izmerjenega znižanja zmrzišča.
      const [f, nu] = r.pick([["HA (→ H⁺ + A⁻)", 2], ["AB (→ A⁺ + B⁻)", 2], ["AB₂ (→ A²⁺ + 2B⁻)", 3], ["A₂B (→ 2A⁺ + B²⁻)", 3]]);
      const alpha = r.pick([0.1, 0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 0.8]);
      const m = r.pick([0.05, 0.1, 0.2]);
      const dT = round((1 + alpha * (nu - 1)) * 1.86 * m, 4);
      const i = dT / (1.86 * m);
      const a = (i - 1) / (nu - 1);
      return task({
        text: L(
          `A ${en(m)} m aqueous solution of the electrolyte ${f} freezes at −${en(dT)} °C. What is the degree of dissociation α? (Kf of water = 1.86 K kg/mol)${roundToL(2, lang)}`,
          `विद्युत-अपघट्य ${f} का ${en(m)} m जलीय विलयन −${en(dT)} °C पर जमता है। वियोजन की मात्रा α क्या है? (जल का Kf = 1.86 K kg/mol)${roundToL(2, lang)}`,
        ),
        answer: numM(a, 2, [
          [i, L("That is the van 't Hoff factor i; then use α = (i − 1)/(ν − 1).", "यह वान्ट हॉफ गुणक i है; फिर α = (i − 1)/(ν − 1) लीजिए।")],
          ...(nu > 2 ? [[i - 1, L(`One formula unit gives ν = ${nu} ions: divide (i − 1) by ν − 1 = ${nu - 1}.`, `एक सूत्र इकाई से ν = ${nu} आयन बनते हैं: (i − 1) को ν − 1 = ${nu - 1} से भाग दीजिए।`)]] : []),
          [(1.86 * m) / dT, L("i is observed ΔTf divided by the calculated ΔTf (= Kf·m), not the other way round.", "i = प्रेक्षित ΔTf ÷ परिकलित ΔTf (= Kf·m), उलटा नहीं।")],
        ]),
        data: { given: [`m = ${en(m)}\\ \\mathrm{mol/kg}`, `\\Delta T_f = ${en(dT)}\\ \\mathrm{K}`, "K_f = 1.86\\ \\mathrm{K\\,kg/mol}"], find: ["\\alpha"] },
        hint: L("First find i = ΔTf(observed)/(Kf·m); then for ν ions per formula unit, i = 1 + α(ν − 1).", "पहले i = ΔTf(प्रेक्षित)/(Kf·m) ज्ञात कीजिए; फिर प्रति सूत्र इकाई ν आयनों के लिए i = 1 + α(ν − 1)।"),
        formula: "i = \\dfrac{\\Delta T_f}{K_f m},\\quad \\alpha = \\dfrac{i - 1}{\\nu - 1}",
        solution: L(
          `$i = \\dfrac{${en(dT)}}{1.86 \\cdot ${en(m)}} = ${en(i, 4)}$\n$\\alpha = \\dfrac{${en(i, 4)} - 1}{${nu} - 1} \\approx ${en(a, 2)}$`,
          `$i = \\dfrac{${en(dT)}}{1.86 \\cdot ${en(m)}} = ${en(i, 4)}$ (वान्ट हॉफ गुणक)\n$\\alpha = \\dfrac{${en(i, 4)} - 1}{${nu} - 1} \\approx ${en(a, 2)}$`,
        ),
      });
    },
  },
  {
    id: "exi-kem-identification",
    topics: [T("identification-of-ions-and-gases")],
    langs: ["en", "hi"],
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const nm = r.pick(NAMES);
      const fem = ["Priya", "Ananya", "Meera", "Diya"].includes(nm[0]);
      const ionU = (c) => uc(c.ion);
      const gas = (k) => uc(GAS[k].f);
      // Postopno izločanje kationov po opažanjih (vrstice rešitve).
      const deduce = (c, upto = OBS.length) => {
        let cand = CATION;
        const lines = [];
        for (const o of OBS.slice(0, upto)) {
          if (o.key === "nhEx" && !c.nh) continue;
          cand = cand.filter((x) => x[o.key] === c[o.key] && (o.key !== "nhEx" || x.nh));
          lines.push(L(`${cap(o.en(c))} → ${cand.map(ionU).join(", ")}`, `${o.hi(c)} → ${cand.map(ionU).join(", ")}`));
          if (cand.length === 1) break;
        }
        return lines;
      };
      // Zakaj napačni kation ne ustreza: prvo opažanje, v katerem se razlikuje.
      const catWhy = (w, c) => {
        if (w.col !== c.col) return L(`${ionU(w)} gives a ${PCOL[w.col][0]} precipitate with NaOH.`, `${ionU(w)} NaOH के साथ ${PCOL[w.col][1]} अवक्षेप देता है।`);
        if (w.naEx !== c.naEx) return L(`The precipitate of ${ionU(w)} ${w.naEx ? "dissolves" : "does not dissolve"} in excess NaOH.`, `${ionU(w)} का अवक्षेप NaOH के आधिक्य में ${w.naEx ? "घुल जाता है" : "नहीं घुलता"}।`);
        if (w.nh !== c.nh) return w.nh ? L(`${ionU(w)} does give a precipitate with NH₄OH.`, `${ionU(w)} NH₄OH के साथ अवक्षेप देता है।`) : L(`${ionU(w)} gives no precipitate with NH₄OH.`, `${ionU(w)} NH₄OH के साथ कोई अवक्षेप नहीं देता।`);
        return L(`The precipitate of ${ionU(w)} ${w.nhEx ? "dissolves" : "does not dissolve"} in excess NH₄OH.`, `${ionU(w)} का अवक्षेप NH₄OH के आधिक्य में ${w.nhEx ? "घुल जाता है" : "नहीं घुलता"}।`);
      };
      const F = 96500;

      if (level === 1) {
        const v = r.int(0, 3);
        if (v === 0) {
          // Barva oborine z NaOH ali NH4OH.
          const nh = r.int(0, 1) === 1;
          const pool = nh ? CATION.filter((c) => c.nh) : CATION;
          const c = r.pick(pool);
          const salt = r.pick(c.salts);
          const reag = nh ? "NH_4OH" : "NaOH";
          const wrong = Object.keys(PCOL)
            .filter((k) => k !== c.col)
            .map((k) => {
              const who = pool.filter((x) => x.col === k).map(ionU).join(", ");
              return [L(PCOL[k][0], PCOL[k][1]), L(`A ${PCOL[k][0]} precipitate comes from ${who} ions.`, `${PCOL[k][1]} अवक्षेप ${who} आयनों से बनता है।`)];
            });
          return task({
            text: L(
              `${nm[0]} adds a few drops of ${ce(reag)} solution to an aqueous solution of ${ce(salt)}. What is the colour of the precipitate formed?`,
              `${nm[1]} ${ce(salt)} के जलीय विलयन में ${ce(reag)} विलयन की कुछ बूँदें ${fem ? "मिलाती" : "मिलाता"} है। बनने वाले अवक्षेप का रंग क्या है?`,
            ),
            answer: choiceWhy(r, L(PCOL[c.col][0], PCOL[c.col][1]), wrong),
            data: { given: [`\\mathrm{${salt}}`, `\\mathrm{${reag}}`], find: [L("\\text{colour of precipitate}", "\\text{अवक्षेप का रंग}")] },
            hint: L(`Find the metal cation in the salt; its hydroxide is the precipitate.`, `लवण में धातु धनायन पहचानिए; उसका हाइड्रॉक्साइड ही अवक्षेप है।`),
            solution: L(
              `The cation is ${ionU(c)}; OH⁻ from the alkali gives the insoluble hydroxide:\n$${hydTex(c)}$\n${uc(c.hyd)} is ${PCOL[c.col][0]}.`,
              `धनायन ${ionU(c)} है; क्षार के OH⁻ से अविलेय हाइड्रॉक्साइड बनता है:\n$${hydTex(c)}$\n${uc(c.hyd)} का रंग ${PCOL[c.col][1]} है।`,
            ),
          });
        }
        if (v === 1 || v === 2) {
          const keys = Object.keys(GAS);
          const g = r.pick(keys);
          const others = r.shuffle(keys.filter((k) => k !== g && !(GAS_CONF[g] ?? []).includes(k))).slice(0, 3);
          const G = GAS[g];
          const sol = L(
            `The gas is ${G.name[0]} (${gas(g)}): ${G.why[0]}.\n$${eqTex(G.eq)}$`,
            `गैस ${G.name[1]} (${gas(g)}) है: ${G.why[1]}।\n$${eqTex(G.eq)}$`,
          );
          if (v === 1) {
            return task({
              text: L(`A gas ${G.test[0]}. Which gas is it?`, `एक गैस ${G.test[1]}। यह कौन-सी गैस है?`),
              answer: choiceWhy(r, gas(g), others.map((k) => [gas(k), L(`${cap(GAS[k].name[0])} ${GAS[k].test[0]}.`, `${GAS[k].name[1]} ${GAS[k].test[1]}।`)])),
              data: { given: [L("\\text{gas test}", "\\text{गैस परीक्षण}")], find: [L("\\text{gas}", "\\text{गैस}")] },
              hint: L("Match the observation with the standard laboratory test of each gas.", "प्रेक्षण को प्रत्येक गैस के मानक प्रयोगशाला परीक्षण से मिलाइए।"),
              solution: sol,
            });
          }
          return task({
            text: L(`Which test confirms that a gas is ${G.name[0]} (${ce(G.f)})?`, `कौन-सा परीक्षण पुष्टि करता है कि गैस ${G.name[1]} (${ce(G.f)}) है?`),
            answer: choiceWhy(r, L(cap(G.test[0]), cap(G.test[1])), others.map((k) => [L(cap(GAS[k].test[0]), cap(GAS[k].test[1])), L(`This test identifies ${GAS[k].name[0]} (${gas(k)}).`, `यह परीक्षण ${GAS[k].name[1]} (${gas(k)}) की पहचान करता है।`)])),
            data: { given: [`\\mathrm{${G.f}}`], find: [L("\\text{test}", "\\text{परीक्षण}")] },
            hint: L("Think of the property that only this gas has: does it burn, support burning, or act as an acid, a base or a reducing agent?", "सोचिए कि कौन-सा गुण केवल इसी गैस में है: क्या यह जलती है, दहन में सहायक है, या अम्ल, क्षार या अपचायक है?"),
            solution: sol,
          });
        }
        // Volumen H2 : O2 pri elektrolizi nakisane vode.
        const toO2 = r.int(0, 1) === 1;
        const V = toO2 ? r.pick([10, 12, 16, 20, 24, 30, 36, 40, 50, 60]) : r.pick([5, 6, 8, 10, 12, 15, 18, 20, 25]);
        const ans = toO2 ? V / 2 : 2 * V;
        const [gi, go] = toO2 ? [["hydrogen", "हाइड्रोजन", "cathode", "कैथोड"], ["oxygen", "ऑक्सीजन", "anode", "ऐनोड"]] : [["oxygen", "ऑक्सीजन", "anode", "ऐनोड"], ["hydrogen", "हाइड्रोजन", "cathode", "कैथोड"]];
        return task({
          text: L(
            `During the electrolysis of acidified water, ${nm[0]} collects ${V} cm³ of ${gi[0]} at the ${gi[2]}. What volume of ${go[0]} (in cm³) collects at the ${go[2]} at the same temperature and pressure?`,
            `अम्लीकृत जल के वैद्युत अपघटन में ${nm[1]} ${gi[3]} पर ${V} cm³ ${gi[1]} एकत्र ${fem ? "करती" : "करता"} है। समान ताप और दाब पर ${go[3]} पर कितनी ${go[1]} (cm³ में) एकत्र होती है?`,
          ),
          answer: numM(ans, 0, [
            [toO2 ? 2 * V : V / 2, L("The ratio is the other way round: hydrogen has twice the volume of oxygen.", "अनुपात उल्टा है: हाइड्रोजन का आयतन ऑक्सीजन का दोगुना है।")],
            [V, L("The gases do not form in equal volumes; water is H₂O, with two H for each O.", "गैसें बराबर आयतन में नहीं बनतीं; जल H₂O है, हर O के लिए दो H।")],
          ]),
          data: { given: [`V(\\mathrm{${toO2 ? "H_2" : "O_2"}}) = ${V}\\ \\mathrm{cm^3}`], find: [`V(\\mathrm{${toO2 ? "O_2" : "H_2"}})`] },
          hint: L("Write the overall equation for the decomposition of water and compare the gas volumes.", "जल के अपघटन का कुल समीकरण लिखिए और गैसों के आयतन की तुलना कीजिए।"),
          formula: "V(\\mathrm{H_2}) : V(\\mathrm{O_2}) = 2 : 1",
          solution: L(
            `$\\mathrm{2H_2O \\rightarrow 2H_2 + O_2}$, so $V(\\mathrm{H_2}) : V(\\mathrm{O_2}) = 2 : 1$\n$V(\\mathrm{${toO2 ? "O_2" : "H_2"}}) = ${toO2 ? `${V} / 2` : `2 \\cdot ${V}`} = ${ans}\\ \\mathrm{cm^3}$`,
            `$\\mathrm{2H_2O \\rightarrow 2H_2 + O_2}$, अतः $V(\\mathrm{H_2}) : V(\\mathrm{O_2}) = 2 : 1$\n$V(\\mathrm{${toO2 ? "O_2" : "H_2"}}) = ${toO2 ? `${V} / 2` : `2 \\cdot ${V}`} = ${ans}\\ \\mathrm{cm^3}$ (${go[1]})`,
          ),
        });
      }

      if (level === 2) {
        const v = r.int(0, 2);
        if (v === 0) {
          // Prepoznaj kation iz opažanj z NaOH in NH4OH.
          const c = r.pick(CATION);
          const sim = (x) => OBS.filter((o) => x[o.key] === c[o.key]).length;
          const others = r.shuffle(CATION.filter((x) => x !== c)).sort((a, b) => sim(b) - sim(a)).slice(0, 3);
          const obsEn = OBS.filter((o) => o.key !== "nhEx" || c.nh).map((o) => o.en(c));
          const obsHi = OBS.filter((o) => o.key !== "nhEx" || c.nh).map((o) => o.hi(c));
          return task({
            text: L(
              `${nm[0]} tests a salt solution. It gives ${obsEn[0]}, and ${obsEn[1]}. It gives ${obsEn[2]}${c.nh ? `, and ${obsEn[3]}` : ""}. Which cation is present?`,
              `${nm[1]} एक लवण विलयन का परीक्षण ${fem ? "करती" : "करता"} है। ${obsHi[0]} बनता है, और ${obsHi[1]}। ${obsHi[2]} ${c.nh ? "बनता है" : "बनता"}${c.nh ? `, और ${obsHi[3]}` : ""}। विलयन में कौन-सा धनायन है?`,
            ),
            answer: choiceWhy(r, ionU(c), others.map((w) => [ionU(w), catWhy(w, c)])),
            data: { given: [L("\\text{observations with NaOH and NH}_4\\text{OH}", "\\text{NaOH और NH}_4\\text{OH के साथ प्रेक्षण}")], find: [L("\\text{cation}", "\\text{धनायन}")] },
            hint: L("Use the colour first, then the behaviour of the precipitate in excess reagent to rule out cations one by one.", "पहले रंग का उपयोग कीजिए, फिर अभिकर्मक के आधिक्य में अवक्षेप के व्यवहार से धनायनों को एक-एक करके हटाइए।"),
            solution: [...deduce(c), L(`$${hydTex(c)}$`, `$${hydTex(c)}$ (अवक्षेप)`)].join("\n"),
          });
        }
        if (v === 1) {
          // Produkt na katodi/anodi.
          const s = r.pick(ELYS);
          const atCat = r.int(0, 1) === 1;
          const e = atCat ? s.cat : s.an;
          const where = atCat ? ["cathode", "कैथोड"] : ["anode", "ऐनोड"];
          return task({
            text: L(
              `${s.name[0][0].toUpperCase() + s.name[0].slice(1)} is electrolysed using ${s.el[0]} electrodes. What happens at the ${where[0]}?`,
              `${s.name[1]} का ${s.el[1]} इलेक्ट्रोडों से वैद्युत अपघटन किया जाता है। ${where[1]} पर क्या होता है?`,
            ),
            answer: choiceWhy(r, L(...EPROD[e.p]), e.wrong.map(([k, w]) => [L(...EPROD[k]), L(...w)])),
            data: { given: [L(`\\text{${s.name[0]}, ${s.el[0]} electrodes}`, `\\text{${s.name[1]}, ${s.el[1]} इलेक्ट्रोड}`)], find: [L(`\\text{product at the ${where[0]}}`, `\\text{${where[1]} पर उत्पाद}`)] },
            hint: L(
              `The ${where[0]} is the ${atCat ? "negative electrode: positive ions gain electrons there" : "positive electrode: negative ions (or an active anode) lose electrons there"}.`,
              `${where[1]} ${atCat ? "ऋणात्मक इलेक्ट्रोड है: वहाँ धनायन इलेक्ट्रॉन ग्रहण करते हैं" : "धनात्मक इलेक्ट्रोड है: वहाँ ऋणायन (या सक्रिय ऐनोड) इलेक्ट्रॉन त्यागते हैं"}।`,
            ),
            solution: L(
              `${atCat ? "Reduction" : "Oxidation"} at the ${where[0]}:\n$\\mathrm{${e.eq}}$\n${EPROD[e.p][0]}.`,
              `${where[1]} पर ${atCat ? "अपचयन" : "ऑक्सीकरण"}:\n$\\mathrm{${e.eq}}$\n${EPROD[e.p][1]}।`,
            ),
          });
        }
        // Moli elektronov za izločitev m g kovine.
        const m0 = r.pick(EMET);
        const n = r.pick([0.05, 0.1, 0.2, 0.25, 0.5]);
        const w = Math.round(m0.M * n * 1000) / 1000;
        const ne = Math.round(m0.z * n * 1000) / 1000;
        const mist = [[n, L(`Each ${uc(m0.ion)} ion needs ${m0.z} electrons; multiply the moles of metal by ${m0.z}.`, `हर ${uc(m0.ion)} आयन को ${m0.z} इलेक्ट्रॉन चाहिए; धातु के मोलों को ${m0.z} से गुणा कीजिए।`)]];
        if (m0.z === 1) mist[0] = [2 * n, L("Ag⁺ carries a single positive charge, so one electron per atom.", "Ag⁺ पर केवल एक धनावेश है, इसलिए प्रति परमाणु एक इलेक्ट्रॉन।")];
        else mist.push([n / m0.z, L("Multiply by the charge of the ion, do not divide.", "आयन के आवेश से गुणा कीजिए, भाग नहीं।")]);
        return task({
          text: L(
            `How many moles of electrons are needed to deposit ${en(w)} g of ${m0.k === "Al" ? "aluminium" : m0.k === "Ag" ? "silver" : m0.k === "Cu" ? "copper" : "lead"} at the cathode during the electrolysis of ${m0.src[0]}? (${m0.k} = ${en(m0.M)} g/mol)${roundToL(2, lang)}`,
            `${m0.src[1]} के वैद्युत अपघटन में कैथोड पर ${en(w)} g ${m0.k === "Al" ? "ऐलुमिनियम" : m0.k === "Ag" ? "सिल्वर" : m0.k === "Cu" ? "कॉपर" : "लेड"} जमा करने के लिए कितने मोल इलेक्ट्रॉन चाहिए? (${m0.k} = ${en(m0.M)} g/mol)${roundToL(2, lang)}`,
          ),
          answer: numM(ne, 2, mist),
          data: { given: [`m = ${en(w)}\\ \\mathrm{g}`, `M = ${en(m0.M)}\\ \\mathrm{g/mol}`, `\\mathrm{${m0.ion}}`], find: ["n(e^-)"] },
          hint: L("Write the cathode half-equation, find the moles of metal, then use the electrons per ion.", "कैथोड का अर्ध-समीकरण लिखिए, धातु के मोल ज्ञात कीजिए, फिर प्रति आयन इलेक्ट्रॉन लीजिए।"),
          formula: "n(e^-) = z \\cdot \\dfrac{m}{M}",
          solution: L(
            `$\\mathrm{${m0.ion} + ${m0.z > 1 ? m0.z : ""}e^- \\rightarrow ${m0.k}}$\n$n(\\mathrm{${m0.k}}) = ${en(w)} / ${en(m0.M)} = ${en(n)}\\ \\mathrm{mol}$\n$n(e^-) = ${m0.z} \\cdot ${en(n)} = ${en(ne)}\\ \\mathrm{mol}$`,
            `$\\mathrm{${m0.ion} + ${m0.z > 1 ? m0.z : ""}e^- \\rightarrow ${m0.k}}$ (कैथोड पर)\n$n(\\mathrm{${m0.k}}) = ${en(w)} / ${en(m0.M)} = ${en(n)}\\ \\mathrm{mol}$\n$n(e^-) = ${m0.z} \\cdot ${en(n)} = ${en(ne)}\\ \\mathrm{mol}$`,
          ),
        });
      }

      // ---------- Level 3 ----------
      const v = r.int(0, 3);
      if (v === 0) {
        // Reagent, ki loči par ionov ali plinov.
        const p = r.pick(DPAIR);
        const swap = r.int(0, 1) === 1;
        const [x, y] = swap ? [p.b, p.a] : [p.a, p.b];
        const isIon = p.ok.startsWith("nh") || p.ok.startsWith("na");
        return task({
          text: L(
            isIon ? `Which reagent can distinguish a solution containing ${ce(x[0])} from one containing ${ce(y[0])}?` : `Which test can distinguish ${ce(x[0])} gas from ${ce(y[0])} gas?`,
            `${isIon ? "किस अभिकर्मक से" : "किस परीक्षण से"} ${ce(x[0])} ${isIon ? "वाले विलयन" : "गैस"} को ${ce(y[0])} ${isIon ? "वाले विलयन" : "गैस"} से अलग पहचाना जा सकता है?`,
          ),
          answer: choiceWhy(r, L(...RG[p.ok]), p.wrong.map(([k, w]) => [L(...RG[k]), L(...w)])),
          data: { given: [`\\mathrm{${x[0]}}`, `\\mathrm{${y[0]}}`], find: [L("\\text{distinguishing test}", "\\text{विभेदक परीक्षण}")] },
          hint: L("A test distinguishes the two only if they give DIFFERENT observations; check each option for both.", "परीक्षण तभी अंतर बताता है जब दोनों के प्रेक्षण अलग हों; हर विकल्प को दोनों के लिए जाँचिए।"),
          solution: L(
            `${RG[p.ok][0]}: ${p.obs[0]}.\nThe other tests give the same result for $\\mathrm{${x[0]}}$ and $\\mathrm{${y[0]}}$.`,
            `${RG[p.ok][1]}: ${p.obs[1]}।\nअन्य परीक्षण $\\mathrm{${x[0]}}$ और $\\mathrm{${y[0]}}$ के लिए एक जैसा परिणाम देते हैं।`,
          ),
        });
      }
      if (v === 1) {
        // Pravilna trditev o celotni elektrolizi.
        const s = r.pick(ELYS);
        const st = ESTAT[s.k];
        const yes = r.pick(st.yes);
        const no = r.shuffle([...st.no]).slice(0, 3);
        return task({
          text: L(
            `${cap(s.name[0])} is electrolysed using ${s.el[0]} electrodes. Which statement is correct?`,
            `${s.name[1]} का ${s.el[1]} इलेक्ट्रोडों से वैद्युत अपघटन किया जाता है। कौन-सा कथन सही है?`,
          ),
          answer: choiceWhy(r, L(...yes), no.map(([t, w]) => [L(...t), L(...w)])),
          data: { given: [L(`\\text{${s.name[0]}, ${s.el[0]} electrodes}`, `\\text{${s.name[1]}, ${s.el[1]} इलेक्ट्रोड}`)], find: [L("\\text{correct statement}", "\\text{सही कथन}")] },
          hint: L("Write both half-equations first; then check what happens to the electrodes and to the ions left in the solution.", "पहले दोनों अर्ध-समीकरण लिखिए; फिर देखिए कि इलेक्ट्रोडों और विलयन में बचे आयनों का क्या होता है।"),
          solution: L(
            `Cathode: $\\mathrm{${s.cat.eq}}$\nAnode: $\\mathrm{${s.an.eq}}$\nSo: ${yes[0]}`,
            `कैथोड: $\\mathrm{${s.cat.eq}}$\nऐनोड: $\\mathrm{${s.an.eq}}$\nअतः: ${yes[1]}`,
          ),
        });
      }
      const I = r.pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]);
      const tm = r.pick([10, 15, 20, 30, 40, 45, 60]);
      const Q = I * tm * 60;
      const neQ = Q / F;
      if (v === 2) {
        // Volumen plina pri STP iz toka in časa.
        const h2 = r.int(0, 1) === 1;
        const per = h2 ? 2 : 4;
        const Vml = (neQ / per) * 22400;
        const g = h2 ? ["hydrogen", "हाइड्रोजन", "H_2", "cathode", "कैथोड"] : ["oxygen", "ऑक्सीजन", "O_2", "anode", "ऐनोड"];
        return task({
          text: L(
            `A current of ${en(I)} A is passed through acidified water for ${tm} minutes. What volume of ${g[0]} (in mL at STP) is collected at the ${g[3]}? (F = 96500 C/mol; 1 mol of gas occupies 22400 mL at STP)${roundToL(1, lang)}`,
            `अम्लीकृत जल में ${en(I)} A की धारा ${tm} मिनट तक प्रवाहित की जाती है। ${g[4]} पर कितनी ${g[1]} (STP पर mL में) एकत्र होती है? (F = 96500 C/mol; STP पर 1 mol गैस का आयतन 22400 mL)${roundToL(1, lang)}`,
          ),
          answer: numM(Vml, 1, [
            [(neQ / (h2 ? 4 : 2)) * 22400, h2 ? L("H₂ needs 2 electrons per molecule, not 4.", "H₂ के प्रति अणु 2 इलेक्ट्रॉन चाहिए, 4 नहीं।") : L("O₂ needs 4 electrons per molecule (4OH⁻ → O₂), not 2.", "O₂ के प्रति अणु 4 इलेक्ट्रॉन चाहिए (4OH⁻ → O₂), 2 नहीं।")],
            [(neQ / 60 / per) * 22400, L("Convert the time to seconds before finding the charge.", "आवेश ज्ञात करने से पहले समय को सेकंड में बदलिए।")],
            [neQ * 22400, L("Moles of electrons are not moles of gas; divide by the electrons per molecule.", "इलेक्ट्रॉनों के मोल गैस के मोल नहीं हैं; प्रति अणु इलेक्ट्रॉनों से भाग दीजिए।")],
          ]),
          data: { given: [`I = ${en(I)}\\ \\mathrm{A}`, `t = ${tm}\\ \\mathrm{min}`, "F = 96500\\ \\mathrm{C/mol}", "V_m = 22400\\ \\mathrm{mL/mol}"], find: [`V(\\mathrm{${g[2]}})`] },
          hint: L("Find the charge Q = I·t (t in s), the moles of electrons Q/F, then use the half-equation.", "आवेश Q = I·t (t सेकंड में), इलेक्ट्रॉनों के मोल Q/F ज्ञात कीजिए, फिर अर्ध-समीकरण का उपयोग कीजिए।"),
          formula: `V = \\dfrac{I t}{${per} F} \\cdot 22400`,
          solution: L(
            `$Q = ${en(I)} \\cdot ${tm * 60} = ${en(Q)}\\ \\mathrm{C}$\n$n(e^-) = ${en(Q)} / 96500 = ${en(neQ, 5)}\\ \\mathrm{mol}$\n$\\mathrm{${h2 ? "2H^+ + 2e^- \\rightarrow H_2" : "4OH^- \\rightarrow 2H_2O + O_2 + 4e^-"}}$, so $n(\\mathrm{${g[2]}}) = n(e^-)/${per}$\n$V = ${en(neQ / per, 6)} \\cdot 22400 \\approx ${en(Vml, 1)}\\ \\mathrm{mL}$`,
            `$Q = ${en(I)} \\cdot ${tm * 60} = ${en(Q)}\\ \\mathrm{C}$ (आवेश)\n$n(e^-) = ${en(Q)} / 96500 = ${en(neQ, 5)}\\ \\mathrm{mol}$\n$\\mathrm{${h2 ? "2H^+ + 2e^- \\rightarrow H_2" : "4OH^- \\rightarrow 2H_2O + O_2 + 4e^-"}}$, अतः $n(\\mathrm{${g[2]}}) = n(e^-)/${per}$\n$V = ${en(neQ / per, 6)} \\cdot 22400 \\approx ${en(Vml, 1)}\\ \\mathrm{mL}$`,
          ),
        });
      }
      // Masa izločenega bakra ali čas za izločitev (obratna naloga).
      const rev = r.int(0, 1) === 1;
      const mCu = (neQ / 2) * 63.5;
      if (!rev) {
        return task({
          text: L(
            `${nm[0]} electroplates a key with copper by passing ${en(I)} A through copper sulphate solution for ${tm} minutes. What mass of copper (in g) is deposited? (Cu = 63.5 g/mol, F = 96500 C/mol)${roundToL(3, lang)}`,
            `${nm[1]} कॉपर सल्फेट विलयन में ${tm} मिनट तक ${en(I)} A की धारा प्रवाहित करके एक चाबी पर कॉपर का विद्युत-लेपन ${fem ? "करती" : "करता"} है। कितना कॉपर (g में) जमा होता है? (Cu = 63.5 g/mol, F = 96500 C/mol)${roundToL(3, lang)}`,
          ),
          answer: numM(mCu, 3, [
            [neQ * 63.5, L("Cu²⁺ needs 2 electrons per atom: divide the moles of electrons by 2.", "Cu²⁺ को प्रति परमाणु 2 इलेक्ट्रॉन चाहिए: इलेक्ट्रॉनों के मोलों को 2 से भाग दीजिए।")],
            [(neQ / 60 / 2) * 63.5, L("Convert the time to seconds before finding the charge.", "आवेश ज्ञात करने से पहले समय को सेकंड में बदलिए।")],
          ]),
          data: { given: [`I = ${en(I)}\\ \\mathrm{A}`, `t = ${tm}\\ \\mathrm{min}`, "M = 63.5\\ \\mathrm{g/mol}", "F = 96500\\ \\mathrm{C/mol}"], find: ["m(\\mathrm{Cu})"] },
          hint: L("Charge Q = I·t with t in seconds; Cu²⁺ + 2e⁻ → Cu.", "आवेश Q = I·t (t सेकंड में); Cu²⁺ + 2e⁻ → Cu।"),
          formula: "m = \\dfrac{I t}{2F} \\cdot M",
          solution: L(
            `$Q = ${en(I)} \\cdot ${tm * 60} = ${en(Q)}\\ \\mathrm{C}$\n$n(\\mathrm{Cu}) = \\dfrac{${en(Q)}}{2 \\cdot 96500} = ${en(neQ / 2, 6)}\\ \\mathrm{mol}$\n$m = ${en(neQ / 2, 6)} \\cdot 63.5 \\approx ${en(mCu, 3)}\\ \\mathrm{g}$`,
            `$Q = ${en(I)} \\cdot ${tm * 60} = ${en(Q)}\\ \\mathrm{C}$ (आवेश)\n$n(\\mathrm{Cu}) = \\dfrac{${en(Q)}}{2 \\cdot 96500} = ${en(neQ / 2, 6)}\\ \\mathrm{mol}$\n$m = ${en(neQ / 2, 6)} \\cdot 63.5 \\approx ${en(mCu, 3)}\\ \\mathrm{g}$`,
          ),
        });
      }
      const mm = r.pick([0.254, 0.381, 0.508, 0.635, 1.27, 1.905, 2.54]);
      const tMin = ((mm / 63.5) * 2 * F) / I / 60;
      return task({
        text: L(
          `For how many minutes must a current of ${en(I)} A flow through copper sulphate solution to deposit ${en(mm)} g of copper on the cathode? (Cu = 63.5 g/mol, F = 96500 C/mol)${roundToL(1, lang)}`,
          `कैथोड पर ${en(mm)} g कॉपर जमा करने के लिए कॉपर सल्फेट विलयन में ${en(I)} A की धारा कितने मिनट तक प्रवाहित करनी होगी? (Cu = 63.5 g/mol, F = 96500 C/mol)${roundToL(1, lang)}`,
        ),
        answer: numM(tMin, 1, [
          [tMin * 60, L("That is the time in seconds; the question asks for minutes.", "यह सेकंड में समय है; प्रश्न मिनट में पूछता है।")],
          [tMin / 2, L("Each Cu²⁺ needs 2 electrons, so the charge is 2·n(Cu)·F.", "हर Cu²⁺ को 2 इलेक्ट्रॉन चाहिए, इसलिए आवेश 2·n(Cu)·F है।")],
        ]),
        data: { given: [`m = ${en(mm)}\\ \\mathrm{g}`, `I = ${en(I)}\\ \\mathrm{A}`, "M = 63.5\\ \\mathrm{g/mol}", "F = 96500\\ \\mathrm{C/mol}"], find: ["t"] },
        hint: L("Work backwards: moles of Cu → moles of electrons → charge → time t = Q/I.", "उल्टा चलिए: Cu के मोल → इलेक्ट्रॉनों के मोल → आवेश → समय t = Q/I।"),
        formula: "t = \\dfrac{2F \\cdot m}{M \\cdot I}",
        solution: L(
          `$n(\\mathrm{Cu}) = ${en(mm)} / 63.5 = ${en(mm / 63.5, 4)}\\ \\mathrm{mol}$\n$Q = 2 \\cdot ${en(mm / 63.5, 4)} \\cdot 96500 = ${en((mm / 63.5) * 2 * F, 1)}\\ \\mathrm{C}$\n$t = ${en((mm / 63.5) * 2 * F, 1)} / ${en(I)} = ${en(tMin * 60, 1)}\\ \\mathrm{s} \\approx ${en(tMin, 1)}\\ \\mathrm{min}$`,
          `$n(\\mathrm{Cu}) = ${en(mm)} / 63.5 = ${en(mm / 63.5, 4)}\\ \\mathrm{mol}$\n$Q = 2 \\cdot ${en(mm / 63.5, 4)} \\cdot 96500 = ${en((mm / 63.5) * 2 * F, 1)}\\ \\mathrm{C}$ (आवेश)\n$t = ${en((mm / 63.5) * 2 * F, 1)} / ${en(I)} = ${en(tMin * 60, 1)}\\ \\mathrm{s} \\approx ${en(tMin, 1)}\\ \\mathrm{min}$`,
        ),
      });
    },
  },
];
