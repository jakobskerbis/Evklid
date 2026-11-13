// Naloge za teme drugih državnih izpitov, ki jih banka še ni imela (angleško in hindijsko).
// Teme: merjenje in napake, gostota in tlak, tekočine in vzgon, prožnost, valovna optika.
// Vsebina je skupna učnim načrtom Indije (NCERT), Pakistana, Bangladeša, Nepala, Šrilanke, Egipta,
// vzhodne in zahodne Afrike, Južne Afrike, Malezije, Indonezije in Vietnama.
// Vse naključne izbire so narejene pred izbiro besedil (L), zato isto seme da v obeh jezikih isto nalogo.
import { en, num, numM as numM0, task as baseTask, choiceWhy, bi, roundToL } from "./exam-util.js";

// numM brez šuma plavajoče vejice (0.30000000000000004 → 0.3).
const tidy = (x) => (typeof x === "number" ? +x.toPrecision(12) : x);
const numM = (v, d, list) => numM0(tidy(v), d, list.map(([x, w]) => [tidy(x), w]));

const T = (slug) => `FIZ-EXB/${slug}`;
const NAMES = [
  ["Aarav", "आरव"],
  ["Priya", "प्रिया"],
  ["Rohan", "रोहन"],
  ["Ananya", "अनन्या"],
  ["Kabir", "कबीर"],
  ["Meera", "मीरा"],
  ["Ishaan", "ईशान"],
  ["Diya", "दीया"],
];
// Količina v LaTeX: q("h", 5, "m") → "h = 5\ \mathrm{m}".
const q = (sym, x, u = "") => `${sym} = ${typeof x === "number" ? en(x) : x}${u ? `\\ \\mathrm{${u}}` : ""}`;
const near = (x, d) => Math.abs(x * 10 ** d - Math.round(x * 10 ** d)) < 1e-7;
// Navodilo za zaokroževanje le, kadar rezultat ni točen na d decimalk.
const RT = (x, d, lang) => (near(x, d) ? "" : roundToL(d, lang));
// "= 484" (točno) ali "\approx 0.55" (zaokroženo).
const ev = (x, d) => (near(x, d) ? `= ${en(x)}` : `\\approx ${en(x, d)}`);
// Število brez odvečnih ničel: točno ali zaokroženo na d decimalk.
const fx = (x, d) => (near(x, d) ? en(x) : en(x, d));
// Izbira z dvojezičnimi možnostmi: ok = [en, hi], wrong = [[[en, hi], [whyEn, whyHi]], …].
const ch = (r, L, ok, wrong) => choiceWhy(r, L(...ok), r.shuffle(wrong).map(([o, w]) => [L(...o), L(...w)]));
// Zadnja vrstica rešitve, ki je samo račun, dobi "Answer:" / "उत्तर:".
const DEV = /[\u0900-\u097F]/;
const task = (o) => {
  const lines = String(o.solution || "").split("\n");
  const last = lines[lines.length - 1];
  if (last.startsWith("$")) lines[lines.length - 1] = (DEV.test(o.text) ? "उत्तर: " : "Answer: ") + last;
  return baseTask({ ...o, solution: lines.join("\n") });
};
// Pojmovna naloga iz zapisa { q, ok, wrong, sol, hint }.
const concept = (r, L, it) =>
  baseTask({ text: L(...it.q), answer: ch(r, L, it.ok, it.wrong), hint: L(...it.hint), solution: L(...it.sol) });

// ---------- 1. Units, measurement and errors ----------
// Število zapisano z decimalno piko ali v znanstvenem zapisu (brez dvoumnih končnih ničel celih števil).
const SIG_PLAIN = ["0.00340", "2.050", "100.0", "0.0605", "3.0800", "45.00", "0.5020", "6.02", "1.200", "0.000708", "20.30", "5.000", "0.0900", "12.040"];
const SIG_SCI = [["4.200", "3"], ["6.0", "-5"], ["3.40", "2"], ["1.0020", "4"], ["2.50", "-3"], ["9.10", "-2"]];
const SIG_QTY = [["length", "लंबाई", "m"], ["mass", "द्रव्यमान", "kg"], ["time", "समय", "s"], ["thickness", "मोटाई", "cm"]];
function sigInfo(s) {
  const d = s.replace(".", "");
  const lead = d.match(/^0*/)[0].length;
  const core = d.slice(lead);
  const trailing = core.match(/0*$/)[0].length;
  const zeros = (core.match(/0/g) || []).length;
  return { sig: core.length, all: d.length, lead, trailing, captive: zeros - trailing, nonzero: core.length - zeros };
}

// Instrumenti: najmanjši razdelek (absolutna napaka) in izmerjene vrednosti, ki dajo končno decimalko.
const INSTR = [
  { i: ["a metre scale", "मीटर पैमाने"], lc: 0.1, u: "cm", dp: 1, xs: [12.5, 20.0, 25.0, 40.0, 50.0, 62.5, 80.0], w: ["the length of a notebook", "एक नोटबुक की लंबाई", "मापी"] },
  { i: ["vernier callipers", "वर्नियर कैलिपर्स"], lc: 0.01, u: "cm", dp: 2, xs: [1.25, 2.50, 3.20, 4.00, 5.00], w: ["the diameter of a cylinder", "एक बेलन का व्यास", "मापा"] },
  { i: ["a screw gauge", "स्क्रू गेज"], lc: 0.01, u: "mm", dp: 2, xs: [0.80, 1.25, 2.50, 4.00, 5.00], w: ["the diameter of a wire", "एक तार का व्यास", "मापा"] },
  { i: ["a stopwatch", "विराम घड़ी"], lc: 0.1, u: "s", dp: 1, xs: [12.5, 20.0, 25.0, 40.0, 50.0], w: ["the time for 10 oscillations of a pendulum", "एक लोलक के 10 दोलनों का समय", "मापा"] },
];

// Razsežnosti [M, L, T] različnih količin (vsaka razsežnost samo enkrat).
const QDIM = [
  { n: ["force", "बल"], d: [1, 1, -2], def: ["force = mass × acceleration", "बल = द्रव्यमान × त्वरण"] },
  { n: ["pressure", "दाब"], d: [1, -1, -2], def: ["pressure = force ÷ area", "दाब = बल ÷ क्षेत्रफल"] },
  { n: ["work", "कार्य"], d: [1, 2, -2], def: ["work = force × distance", "कार्य = बल × दूरी"] },
  { n: ["power", "शक्ति"], d: [1, 2, -3], def: ["power = work ÷ time", "शक्ति = कार्य ÷ समय"] },
  { n: ["momentum", "संवेग"], d: [1, 1, -1], def: ["momentum = mass × velocity", "संवेग = द्रव्यमान × वेग"] },
  { n: ["density", "घनत्व"], d: [1, -3, 0], def: ["density = mass ÷ volume", "घनत्व = द्रव्यमान ÷ आयतन"] },
  { n: ["acceleration", "त्वरण"], d: [0, 1, -2], def: ["acceleration = change in velocity ÷ time", "त्वरण = वेग में परिवर्तन ÷ समय"] },
  { n: ["surface tension", "पृष्ठ तनाव"], d: [1, 0, -2], def: ["surface tension = force ÷ length", "पृष्ठ तनाव = बल ÷ लंबाई"] },
  { n: ["coefficient of viscosity", "श्यानता गुणांक"], d: [1, -1, -1], def: ["coefficient of viscosity = force ÷ (area × velocity gradient)", "श्यानता गुणांक = बल ÷ (क्षेत्रफल × वेग प्रवणता)"] },
  { n: ["frequency", "आवृत्ति"], d: [0, 0, -1], def: ["frequency = 1 ÷ time period", "आवृत्ति = 1 ÷ आवर्तकाल"] },
];
const SUPD = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³" };
const dimStr = (d) => {
  const parts = ["M", "L", "T"].map((s, i) => (d[i] === 0 ? "" : d[i] === 1 ? s : s + [...String(d[i])].map((c) => SUPD[c]).join(""))).filter(Boolean);
  return `[${parts.join(" ") || "M⁰ L⁰ T⁰"}]`;
};

const DIM_SAME = [
  { p: ["torque and work", "बल-आघूर्ण और कार्य"], d: "[M L² T⁻²]" },
  { p: ["impulse and momentum", "आवेग और संवेग"], d: "[M L T⁻¹]" },
  { p: ["pressure and Young's modulus", "दाब और यंग गुणांक"], d: "[M L⁻¹ T⁻²]" },
  { p: ["Planck's constant and angular momentum", "प्लांक नियतांक और कोणीय संवेग"], d: "[M L² T⁻¹]" },
  { p: ["stress and energy per unit volume", "प्रतिबल और प्रति एकांक आयतन ऊर्जा"], d: "[M L⁻¹ T⁻²]" },
];
const DIM_DIFF = [
  [["force and momentum", "बल और संवेग"], ["Force is [M L T⁻²] but momentum is [M L T⁻¹].", "बल [M L T⁻²] है, जबकि संवेग [M L T⁻¹] है।"]],
  [["work and power", "कार्य और शक्ति"], ["Work is [M L² T⁻²] but power is [M L² T⁻³].", "कार्य [M L² T⁻²] है, जबकि शक्ति [M L² T⁻³] है।"]],
  [["pressure and force", "दाब और बल"], ["Pressure is force per area: [M L⁻¹ T⁻²], not [M L T⁻²].", "दाब प्रति एकांक क्षेत्रफल बल है: [M L⁻¹ T⁻²], न कि [M L T⁻²]।"]],
  [["torque and force", "बल-आघूर्ण और बल"], ["Torque is force × distance: [M L² T⁻²], not [M L T⁻²].", "बल-आघूर्ण = बल × दूरी: [M L² T⁻²], न कि [M L T⁻²]।"]],
  [["surface tension and pressure", "पृष्ठ तनाव और दाब"], ["Surface tension is force per length [M T⁻²]; pressure is [M L⁻¹ T⁻²].", "पृष्ठ तनाव प्रति एकांक लंबाई बल है [M T⁻²]; दाब [M L⁻¹ T⁻²] है।"]],
  [["angular momentum and linear momentum", "कोणीय संवेग और रैखिक संवेग"], ["Angular momentum has an extra length: [M L² T⁻¹] against [M L T⁻¹].", "कोणीय संवेग में एक लंबाई अधिक है: [M L² T⁻¹] बनाम [M L T⁻¹]।"]],
];

// Razsežnostna analiza: F = k·x^a·y^b·z^c (vrednosti eksponentov in koraki).
const DIM_EXP = [
  {
    t: [
      "Assume that the time period $T$ of a simple pendulum depends on its length $l$, the mass $m$ of the bob and the acceleration due to gravity $g$ as $T = k\\,l^{a} m^{b} g^{c}$, where $k$ is a dimensionless constant.",
      "मान लीजिए कि सरल लोलक का आवर्तकाल $T$ उसकी लंबाई $l$, गोलक के द्रव्यमान $m$ और गुरुत्वीय त्वरण $g$ पर $T = k\\,l^{a} m^{b} g^{c}$ के रूप में निर्भर करता है, जहाँ $k$ एक विमाहीन नियतांक है।",
    ],
    v: { a: 0.5, b: 0, c: -0.5 },
    eq: ["$[T] = [L]^{a}\\,[M]^{b}\\,[LT^{-2}]^{c}$", "$M^{0} L^{0} T^{1} = M^{b} L^{a + c} T^{-2c}$", "$M:\\ b = 0;\\quad T:\\ -2c = 1;\\quad L:\\ a + c = 0$", "$a = \\tfrac{1}{2},\\ b = 0,\\ c = -\\tfrac{1}{2}$"],
  },
  {
    t: [
      "The speed $v$ of a transverse wave on a stretched string depends on the tension $F$ and the mass per unit length $\\mu$ as $v = k\\,F^{a} \\mu^{b}$, where $k$ is a dimensionless constant.",
      "तनी हुई डोरी पर अनुप्रस्थ तरंग की चाल $v$ तनाव $F$ और प्रति एकांक लंबाई द्रव्यमान $\\mu$ पर $v = k\\,F^{a} \\mu^{b}$ के रूप में निर्भर करती है, जहाँ $k$ एक विमाहीन नियतांक है।",
    ],
    v: { a: 0.5, b: -0.5 },
    eq: ["$[LT^{-1}] = [MLT^{-2}]^{a}\\,[ML^{-1}]^{b}$", "$M^{0} L^{1} T^{-1} = M^{a + b} L^{a - b} T^{-2a}$", "$T:\\ -2a = -1;\\quad M:\\ a + b = 0$", "$a = \\tfrac{1}{2},\\ b = -\\tfrac{1}{2}$"],
  },
  {
    t: [
      "The force $F$ needed to keep a body moving in a circle depends on its mass $m$, its speed $v$ and the radius $r$ as $F = k\\,m^{a} v^{b} r^{c}$, where $k$ is a dimensionless constant.",
      "किसी पिंड को वृत्त में घुमाए रखने के लिए आवश्यक बल $F$ उसके द्रव्यमान $m$, चाल $v$ और त्रिज्या $r$ पर $F = k\\,m^{a} v^{b} r^{c}$ के रूप में निर्भर करता है, जहाँ $k$ एक विमाहीन नियतांक है।",
    ],
    v: { a: 1, b: 2, c: -1 },
    eq: ["$[MLT^{-2}] = [M]^{a}\\,[LT^{-1}]^{b}\\,[L]^{c}$", "$M^{1} L^{1} T^{-2} = M^{a} L^{b + c} T^{-b}$", "$M:\\ a = 1;\\quad T:\\ -b = -2;\\quad L:\\ b + c = 1$", "$a = 1,\\ b = 2,\\ c = -1$"],
  },
  {
    t: [
      "The viscous drag $F$ on a small sphere moving slowly through a fluid depends on the coefficient of viscosity $\\eta$, the radius $r$ and the speed $v$ as $F = k\\,\\eta^{a} r^{b} v^{c}$, where $k$ is a dimensionless constant.",
      "किसी तरल में धीरे-धीरे चलते छोटे गोले पर श्यान बल $F$ श्यानता गुणांक $\\eta$, त्रिज्या $r$ और चाल $v$ पर $F = k\\,\\eta^{a} r^{b} v^{c}$ के रूप में निर्भर करता है, जहाँ $k$ एक विमाहीन नियतांक है।",
    ],
    v: { a: 1, b: 1, c: 1 },
    eq: ["$[MLT^{-2}] = [ML^{-1}T^{-1}]^{a}\\,[L]^{b}\\,[LT^{-1}]^{c}$", "$M^{1} L^{1} T^{-2} = M^{a} L^{-a + b + c} T^{-a - c}$", "$M:\\ a = 1;\\quad T:\\ -a - c = -2;\\quad L:\\ -a + b + c = 1$", "$a = 1,\\ c = 1,\\ b = 1$"],
  },
  {
    t: [
      "The escape speed $v$ from a planet depends on the gravitational constant $G$, the mass $M$ and the radius $R$ of the planet as $v = k\\,G^{a} M^{b} R^{c}$, where $k$ is a dimensionless constant.",
      "किसी ग्रह से पलायन चाल $v$ गुरुत्वाकर्षण नियतांक $G$, ग्रह के द्रव्यमान $M$ और त्रिज्या $R$ पर $v = k\\,G^{a} M^{b} R^{c}$ के रूप में निर्भर करती है, जहाँ $k$ एक विमाहीन नियतांक है।",
    ],
    v: { a: 0.5, b: 0.5, c: -0.5 },
    eq: ["$[LT^{-1}] = [M^{-1}L^{3}T^{-2}]^{a}\\,[M]^{b}\\,[L]^{c}$", "$M^{0} L^{1} T^{-1} = M^{-a + b} L^{3a + c} T^{-2a}$", "$T:\\ -2a = -1;\\quad M:\\ -a + b = 0;\\quad L:\\ 3a + c = 1$", "$a = \\tfrac{1}{2},\\ b = \\tfrac{1}{2},\\ c = -\\tfrac{1}{2}$"],
  },
];

// Odstopanja (v stotinkah sekunde) petih meritev; vsota je 0, zato je povprečje točno.
const DEV_PATTERNS = [[5, -8, 12, -3, -6], [10, -4, -9, 7, -4], [-15, 6, 3, 9, -3], [8, 8, -12, -6, 2], [-7, 11, -2, -10, 8], [14, -5, -5, 3, -7]];
for (const p of DEV_PATTERNS) if (p.reduce((a, b) => a + b, 0) !== 0) throw new Error("DEV_PATTERNS: vsota ni 0");

const PCT_HINT = ["For a product or a quotient, add the percentage errors of the measured quantities.", "गुणनफल या भागफल में मापी गई राशियों की प्रतिशत त्रुटियाँ जोड़ी जाती हैं।"];

const exgUnits = {
  id: "exg-fiz-units-measurement",
  topics: [T("units-measurement-and-errors")],
  langs: ["en", "hi"],
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const ni = r.int(0, NAMES.length - 1);
    const who = L(...NAMES[ni]);
    if (level === 1) {
      const v = r.int(0, 2);
      if (v === 0) {
        const sci = r.int(0, 3) === 0;
        const [mant, pow] = sci ? r.pick(SIG_SCI) : [r.pick(SIG_PLAIN), null];
        const [qe, qh, u] = r.pick(SIG_QTY);
        const s = sigInfo(mant);
        const shown = pow === null ? mant : `${mant} \\times 10^{${pow}}`;
        const lines = [];
        if (s.lead) lines.push(L(`The ${s.lead} zero${s.lead > 1 ? "s" : ""} before the first non-zero digit only ${s.lead > 1 ? "fix" : "fixes"} the decimal point: not significant.`, `पहले अशून्य अंक से पहले के ${s.lead} शून्य केवल दशमलव बिंदु का स्थान बताते हैं: ये सार्थक नहीं हैं।`));
        if (s.captive) lines.push(L("Zeros between non-zero digits are significant.", "दो अशून्य अंकों के बीच के शून्य सार्थक होते हैं।"));
        if (s.trailing) lines.push(L(`The ${s.trailing} trailing zero${s.trailing > 1 ? "s" : ""} in a number with a decimal point ${s.trailing > 1 ? "are" : "is"} significant.`, s.trailing > 1 ? `दशमलव बिंदु वाली संख्या के अंत के ${s.trailing} शून्य सार्थक हैं।` : "दशमलव बिंदु वाली संख्या के अंत का 1 शून्य सार्थक है।"));
        if (pow !== null) lines.push(L(`In scientific notation only the digits of ${mant} count; the power of 10 does not.`, `वैज्ञानिक संकेतन में केवल ${mant} के अंक गिने जाते हैं; 10 की घात नहीं।`));
        return task({
          text: L(`How many significant figures are there in $${shown}$ ${u} (a measured ${qe})?`, `$${shown}$ ${u} (${qh} का एक माप) में कितने सार्थक अंक हैं?`),
          answer: numM(s.sig, 0, [
            [s.all, L("Zeros before the first non-zero digit are not significant.", "पहले अशून्य अंक से पहले के शून्य सार्थक नहीं होते।")],
            [s.sig - s.trailing, L("Trailing zeros in a number with a decimal point are significant.", "दशमलव बिंदु वाली संख्या के अंत के शून्य सार्थक होते हैं।")],
            [s.nonzero, L("Zeros between non-zero digits are significant.", "दो अशून्य अंकों के बीच के शून्य सार्थक होते हैं।")],
          ]),
          hint: L("Start counting at the first non-zero digit; decide separately for zeros in the middle and at the end.", "पहले अशून्य अंक से गिनना शुरू कीजिए; बीच के और अंत के शून्यों पर अलग से विचार कीजिए।"),
          solution: [...lines, L(`Significant figures: $${s.sig}$`, `सार्थक अंक: $${s.sig}$`)].join("\n"),
        });
      }
      if (v === 1) {
        const ins = r.pick(INSTR);
        const x = r.pick(ins.xs);
        const xs = x.toFixed(ins.dp);
        const pct = (100 * ins.lc) / x;
        return task({
          text: L(
            `${who} measures ${ins.w[0]} with ${ins.i[0]} (least count ${en(ins.lc)} ${ins.u}) and gets ${xs} ${ins.u}. Taking the least count as the absolute error, find the percentage error of this measurement.${RT(pct, 2, lang)}`,
            `${who} ने ${ins.i[1]} (अल्पतमांक ${en(ins.lc)} ${ins.u}) से ${ins.w[1]} ${xs} ${ins.u} ${ins.w[2]}। अल्पतमांक को निरपेक्ष त्रुटि मानकर इस माप की प्रतिशत त्रुटि ज्ञात कीजिए।${RT(pct, 2, lang)}`
          ),
          answer: numM(pct, 2, [
            [ins.lc / x, L("This is the relative error; multiply by 100 to get a percentage.", "यह आपेक्षिक त्रुटि है; प्रतिशत के लिए 100 से गुणा कीजिए।")],
            [(100 * x) / ins.lc, L("Divide the absolute error by the measured value, not the other way round.", "निरपेक्ष त्रुटि को मापे गए मान से भाग दीजिए, उल्टा नहीं।")],
          ]),
          data: { given: [q("\\Delta x", ins.lc, ins.u), q("x", xs, ins.u)], find: ["\\frac{\\Delta x}{x} \\times 100"] },
          hint: L("Percentage error = (absolute error ÷ measured value) × 100.", "प्रतिशत त्रुटि = (निरपेक्ष त्रुटि ÷ मापा गया मान) × 100।"),
          formula: "\\delta = \\dfrac{\\Delta x}{x} \\times 100\\,\\%",
          solution: `$\\dfrac{\\Delta x}{x} = \\dfrac{${en(ins.lc)}}{${xs}} ${ev(ins.lc / x, 5)}$\n$\\delta ${ev(pct, 2)}\\,\\%$`,
        });
      }
      const target = r.pick(QDIM);
      const others = QDIM.filter((x) => x !== target);
      return task({
        text: L(`What is the dimensional formula of ${target.n[0]}?`, `${target.n[1]} का विमीय सूत्र क्या है?`),
        answer: ch(
          r,
          L,
          [dimStr(target.d), dimStr(target.d)],
          others.map((o) => [[dimStr(o.d), dimStr(o.d)], [`That is the dimensional formula of ${o.n[0]}.`, `यह ${o.n[1]} का विमीय सूत्र है।`]])
        ),
        hint: L("Write the quantity in terms of mass, length and time using its defining equation.", "परिभाषा वाले समीकरण से राशि को द्रव्यमान, लंबाई और समय के रूप में लिखिए।"),
        solution: L(`${target.def[0]}\nDimensional formula: ${dimStr(target.d)}`, `${target.def[1]}\nविमीय सूत्र: ${dimStr(target.d)}`),
      });
    }
    if (level === 2) {
      const v = r.int(0, 3);
      if (v === 0) {
        const c = r.int(0, 2);
        const CASES = [
          { a: ["m", "g", 1, [20.0, 25.0, 40.0, 50.0], 0.1], b: ["V", "cm^3", 1, [5.0, 10.0, 12.5, 20.0, 25.0], 0.1], Q: "\\rho", quot: true },
          { a: ["V", "V", 1, [2.0, 4.0, 5.0, 10.0], 0.1], b: ["I", "A", 2, [0.20, 0.25, 0.40, 0.50], 0.01], Q: "R", quot: true },
          { a: ["l", "cm", 1, [4.0, 5.0, 8.0, 10.0, 12.5], 0.1], b: ["b", "cm", 1, [2.0, 2.5, 4.0, 5.0], 0.1], Q: "A", quot: false },
        ];
        const K = CASES[c];
        const a = r.pick(K.a[3]);
        const b = r.pick(K.b[3]);
        const as = a.toFixed(K.a[2]);
        const bs = b.toFixed(K.b[2]);
        const da = K.a[4];
        const db = K.b[4];
        const pct = 100 * (da / a + db / b);
        const ua = K.a[1].replace("^3", "³");
        const ub = K.b[1].replace("^3", "³");
        const A = `$${K.a[0]} = (${as} \\pm ${en(da)})$ ${ua}`;
        const B = `$${K.b[0]} = (${bs} \\pm ${en(db)})$ ${ub}`;
        const texts = [
          [`For a metal piece, ${A} and ${B}. Find the maximum percentage error in its density $\\rho = m/V$.`, `धातु के एक टुकड़े के लिए ${A} और ${B} मापे गए। इसके घनत्व $\\rho = m/V$ में अधिकतम प्रतिशत त्रुटि ज्ञात कीजिए।`],
          [`${who} measures the potential difference ${A} across a resistor and the current ${B} through it. Find the maximum percentage error in $R = V/I$.`, `${who} किसी प्रतिरोधक के सिरों पर विभवांतर ${A} और उसमें धारा ${B} मापता है। $R = V/I$ में अधिकतम प्रतिशत त्रुटि ज्ञात कीजिए।`],
          [`The length and breadth of a rectangular sheet are ${A} and ${B}. Find the maximum percentage error in its area $A = lb$.`, `एक आयताकार शीट की लंबाई ${A} और चौड़ाई ${B} है। इसके क्षेत्रफल $A = lb$ में अधिकतम प्रतिशत त्रुटि ज्ञात कीजिए।`],
        ];
        if (c === 1) texts[1][1] = texts[1][1].replace("मापता है", ni % 2 ? "मापती है" : "मापता है");
        const wrong = K.quot
          ? [100 * Math.abs(da / a - db / b), L("For a quotient the percentage errors still add; they never subtract.", "भागफल में भी प्रतिशत त्रुटियाँ जुड़ती हैं, घटती नहीं।")]
          : [(100 * da) / a, L("Both measured quantities have errors; add both percentage errors.", "दोनों मापी गई राशियों में त्रुटि है; दोनों प्रतिशत त्रुटियाँ जोड़िए।")];
        return task({
          text: L(...texts[c]) + RT(pct, 2, lang),
          answer: numM(pct, 2, [wrong, [pct / 100, L("Multiply the fractional error by 100 to get a percentage.", "प्रतिशत के लिए भिन्नात्मक त्रुटि को 100 से गुणा कीजिए।")]]),
          data: {
            given: [q(K.a[0], as, K.a[1]), q(`\\Delta ${K.a[0]}`, da, K.a[1]), q(K.b[0], bs, K.b[1]), q(`\\Delta ${K.b[0]}`, db, K.b[1])],
            find: [`\\frac{\\Delta ${K.Q}}{${K.Q}} \\times 100`],
          },
          hint: L(...PCT_HINT),
          formula: `\\dfrac{\\Delta ${K.Q}}{${K.Q}} = \\dfrac{\\Delta ${K.a[0]}}{${K.a[0]}} + \\dfrac{\\Delta ${K.b[0]}}{${K.b[0]}}`,
          solution: `$\\dfrac{\\Delta ${K.Q}}{${K.Q}} = \\dfrac{${en(da)}}{${as}} + \\dfrac{${en(db)}}{${bs}} ${near(da / a, 5) && near(db / b, 5) ? "=" : "\\approx"} ${fx(da / a, 5)} + ${fx(db / b, 5)}$\n$\\dfrac{\\Delta ${K.Q}}{${K.Q}} \\times 100 ${ev(pct, 2)}\\,\\%$`,
        });
      }
      if (v === 1) {
        const c = r.int(0, 3);
        const e1 = r.pick([0.5, 1, 1.5, 2, 2.5, 3]);
        const e2 = r.pick([0.5, 1, 1.5, 2]);
        const CASES = [
          { n: 3, t: [`The radius of a sphere is measured with an error of ${en(e1)}%. Find the percentage error in its volume $V = \\tfrac{4}{3}\\pi r^{3}$.`, `एक गोले की त्रिज्या ${en(e1)}% त्रुटि के साथ मापी गई। उसके आयतन $V = \\tfrac{4}{3}\\pi r^{3}$ में प्रतिशत त्रुटि ज्ञात कीजिए।`], Q: "V", x: "r" },
          { n: 2, t: [`The radius of a circular plate is measured with an error of ${en(e1)}%. Find the percentage error in its area $A = \\pi r^{2}$.`, `एक वृत्ताकार प्लेट की त्रिज्या ${en(e1)}% त्रुटि के साथ मापी गई। उसके क्षेत्रफल $A = \\pi r^{2}$ में प्रतिशत त्रुटि ज्ञात कीजिए।`], Q: "A", x: "r" },
          { n: 3, t: [`The side of a cube is measured with an error of ${en(e1)}%. Find the percentage error in its volume $V = a^{3}$.`, `एक घन की भुजा ${en(e1)}% त्रुटि के साथ मापी गई। उसके आयतन $V = a^{3}$ में प्रतिशत त्रुटि ज्ञात कीजिए।`], Q: "V", x: "a" },
          { n: 2, ke: true, t: [`The mass of a body is measured with an error of ${en(e2)}% and its speed with an error of ${en(e1)}%. Find the maximum percentage error in its kinetic energy $K = \\tfrac{1}{2} m v^{2}$.`, `एक पिंड का द्रव्यमान ${en(e2)}% और उसकी चाल ${en(e1)}% त्रुटि के साथ मापी गई। उसकी गतिज ऊर्जा $K = \\tfrac{1}{2} m v^{2}$ में अधिकतम प्रतिशत त्रुटि ज्ञात कीजिए।`], Q: "K", x: "v" },
        ];
        const K = CASES[c];
        const res = K.n * e1 + (K.ke ? e2 : 0);
        const given = K.ke ? [`\\frac{\\Delta m}{m} = ${en(e2)}\\%`, `\\frac{\\Delta v}{v} = ${en(e1)}\\%`] : [`\\frac{\\Delta ${K.x}}{${K.x}} = ${en(e1)}\\%`];
        const sol = K.ke
          ? `$\\dfrac{\\Delta K}{K} = \\dfrac{\\Delta m}{m} + 2\\,\\dfrac{\\Delta v}{v}$\n$\\dfrac{\\Delta K}{K} = ${en(e2)}\\% + 2 \\cdot ${en(e1)}\\% = ${en(res)}\\%$`
          : `$\\dfrac{\\Delta ${K.Q}}{${K.Q}} = ${K.n}\\,\\dfrac{\\Delta ${K.x}}{${K.x}}$\n$\\dfrac{\\Delta ${K.Q}}{${K.Q}} = ${K.n} \\cdot ${en(e1)}\\% = ${en(res)}\\%$`;
        return task({
          text: L(...K.t),
          answer: numM(res, 1, [
            [K.ke ? e1 + e2 : e1, L("The error is multiplied by the power of the quantity in the formula.", "त्रुटि को सूत्र में राशि की घात से गुणा किया जाता है।")],
            [K.ke ? e1 * e1 + e2 : e1 ** K.n, L("Multiply the percentage error by the power; do not raise it to the power.", "प्रतिशत त्रुटि को घात से गुणा कीजिए; उस पर घात मत लगाइए।")],
          ]),
          data: { given, find: [`\\frac{\\Delta ${K.Q}}{${K.Q}}`] },
          hint: L("If $Q \\propto x^{n}$, the percentage error in $Q$ is $n$ times that in $x$. Constants have no error.", "यदि $Q \\propto x^{n}$, तो $Q$ की प्रतिशत त्रुटि $x$ की प्रतिशत त्रुटि की $n$ गुनी होती है। नियतांकों में त्रुटि नहीं होती।"),
          formula: "\\dfrac{\\Delta Q}{Q} = n\\,\\dfrac{\\Delta x}{x}",
          solution: sol,
        });
      }
      if (v === 2) {
        if (r.int(0, 1) === 0) {
          // Seštevanje: rezultat na najmanjše število decimalk (1).
          const a = r.int(1000, 3000);
          const b = r.int(100, 400);
          let c = r.int(1000, 5000);
          if ((a * 10 + b * 100 + c) % 100 === 50) c += 1;
          const sum = (a * 10 + b * 100 + c) / 1000;
          const res = Math.round(sum * 10) / 10;
          const [as, bs, cs] = [(a / 100).toFixed(2), (b / 10).toFixed(1), (c / 1000).toFixed(3)];
          return task({
            text: L(
              `${who} weighs three samples on different balances: ${as} g, ${bs} g and ${cs} g. Find their total mass in g, written with the correct number of significant figures.`,
              `${who} तीन नमूनों को अलग-अलग तुलाओं पर तौलता है: ${as} g, ${bs} g और ${cs} g। इनका कुल द्रव्यमान g में, सही सार्थक अंकों के साथ लिखिए।`
            ).replace("तौलता है", ni % 2 ? "तौलती है" : "तौलता है"),
            answer: num(res, 1),
            data: { given: [q("m_1", as, "g"), q("m_2", bs, "g"), q("m_3", cs, "g")], find: ["m"] },
            hint: L("In addition, the result keeps as many decimal places as the least precise number.", "जोड़ में परिणाम में उतने ही दशमलव स्थान रखे जाते हैं जितने सबसे कम परिशुद्ध संख्या में हैं।"),
            formula: "m = m_1 + m_2 + m_3",
            solution: L(
              `$m = ${as} + ${bs} + ${cs} = ${en(sum)}$ g\n${bs} g has only 1 decimal place, so round to 1 decimal place.\n$m = ${res.toFixed(1)}$ g`,
              `$m = ${as} + ${bs} + ${cs} = ${en(sum)}$ g\n${bs} g में केवल 1 दशमलव स्थान है, इसलिए 1 दशमलव स्थान तक पूर्णांकित कीजिए।\n$m = ${res.toFixed(1)}$ g`
            ),
          });
        }
        // Množenje: rezultat na najmanjše število veljavnih mest (2).
        let a = r.int(100, 300);
        const b = r.int(11, 30);
        if (Math.abs(((a * b) % 100) - 50) < 1) a += 1;
        const prod = (a * b) / 1000;
        const res = Math.round(prod * 10) / 10;
        const [as, bs] = [(a / 100).toFixed(2), (b / 10).toFixed(1)];
        return task({
          text: L(
            `A rectangular plot on a map measures ${as} cm by ${bs} cm. Find its area in cm², written with the correct number of significant figures.`,
            `एक मानचित्र पर एक आयताकार भूखंड ${as} cm × ${bs} cm का है। इसका क्षेत्रफल cm² में, सही सार्थक अंकों के साथ लिखिए।`
          ),
          answer: num(res, 1),
          data: { given: [q("l", as, "cm"), q("b", bs, "cm")], find: ["A"] },
          hint: L("In multiplication, the result keeps as many significant figures as the factor with the fewest.", "गुणा में परिणाम में उतने ही सार्थक अंक रखे जाते हैं जितने सबसे कम सार्थक अंकों वाले गुणनखंड में हैं।"),
          formula: "A = l\\,b",
          solution: L(
            `$A = ${as} \\cdot ${bs} = ${en(prod)}$ cm²\n${as} has 3 and ${bs} has 2 significant figures, so keep 2.\n$A = ${res.toFixed(1)}$ cm²`,
            `$A = ${as} \\cdot ${bs} = ${en(prod)}$ cm²\n${as} में 3 और ${bs} में 2 सार्थक अंक हैं, इसलिए 2 रखिए।\n$A = ${res.toFixed(1)}$ cm²`
          ),
        });
      }
      // Srednja absolutna napaka petih meritev nihajnega časa.
      const T0 = r.int(150, 280);
      const pat = r.shuffle(r.pick(DEV_PATTERNS));
      const ask = r.int(0, 1);
      const vals = pat.map((d) => ((T0 + d) / 100).toFixed(2));
      const mean = T0 / 100;
      const sumAbs = pat.reduce((s, d) => s + Math.abs(d), 0);
      const mae = sumAbs / 500;
      const pct = (100 * mae) / mean;
      const list = vals.map((x) => `${x} s`).join(", ");
      const solBase = `$\\bar{T} = \\dfrac{${vals.join(" + ")}}{5} = ${mean.toFixed(2)}$ s\n$|\\Delta T_i| = ${pat.map((d) => (Math.abs(d) / 100).toFixed(2)).join(",\\ ")}$ s\n$\\overline{\\Delta T} = \\dfrac{${en(sumAbs / 100)}}{5} = ${en(mae)}$ s`;
      return task({
        text: ask === 0
          ? L(`${who} measures the period of a simple pendulum five times: ${list}. Find the mean absolute error in s.${RT(mae, 3, lang)}`, `${who} एक सरल लोलक का आवर्तकाल पाँच बार मापता है: ${list}। माध्य निरपेक्ष त्रुटि s में ज्ञात कीजिए।${RT(mae, 3, lang)}`).replace("मापता है", ni % 2 ? "मापती है" : "मापता है")
          : L(`${who} measures the period of a simple pendulum five times: ${list}. Find the percentage error of the mean value.${RT(pct, 2, lang)}`, `${who} एक सरल लोलक का आवर्तकाल पाँच बार मापता है: ${list}। माध्य मान की प्रतिशत त्रुटि ज्ञात कीजिए।${RT(pct, 2, lang)}`).replace("मापता है", ni % 2 ? "मापती है" : "मापता है"),
        answer: ask === 0
          ? numM(mae, 3, [[Math.max(...pat.map(Math.abs)) / 100, L("Average all the absolute errors; do not take only the largest one.", "सभी निरपेक्ष त्रुटियों का औसत लीजिए; केवल सबसे बड़ी नहीं।")], [sumAbs / 100, L("Divide the sum of the absolute errors by the number of readings.", "निरपेक्ष त्रुटियों के योग को पाठ्यांकों की संख्या से भाग दीजिए।")]])
          : numM(pct, 2, [[mae / mean, L("Multiply the relative error by 100 to get a percentage.", "प्रतिशत के लिए आपेक्षिक त्रुटि को 100 से गुणा कीजिए।")], [(100 * Math.max(...pat.map(Math.abs))) / 100 / mean, L("Use the mean absolute error, not the largest single error.", "माध्य निरपेक्ष त्रुटि लीजिए, सबसे बड़ी एकल त्रुटि नहीं।")]]),
        data: { given: vals.map((x, i) => q(`T_${i + 1}`, x, "s")), find: [ask === 0 ? "\\overline{\\Delta T}" : "\\frac{\\overline{\\Delta T}}{\\bar{T}} \\times 100"] },
        hint: L("Find the mean first, then the size of each reading's deviation from it (ignore the signs).", "पहले माध्य ज्ञात कीजिए, फिर हर पाठ्यांक का उससे विचलन (चिह्न छोड़कर)।"),
        formula: ask === 0 ? "\\overline{\\Delta T} = \\dfrac{1}{n}\\sum |T_i - \\bar{T}|" : ["\\overline{\\Delta T} = \\dfrac{1}{n}\\sum |T_i - \\bar{T}|", "\\delta = \\dfrac{\\overline{\\Delta T}}{\\bar{T}} \\times 100\\,\\%"],
        solution: ask === 0 ? solBase : `${solBase}\n$\\delta = \\dfrac{${en(mae)}}{${mean.toFixed(2)}} \\times 100 ${ev(pct, 2)}\\,\\%$`,
      });
    }
    // level 3
    const v = r.int(0, 3);
    if (v === 0) {
      const p = r.pick([2, 3]);
      const qq = r.pick([1, 2]);
      const s = r.pick([0.5, 1, 2, 3]);
      const ea = r.pick([0.5, 1, 1.5, 2]);
      const eb = r.pick([1, 2, 3]);
      const ec = r.pick([1, 2, 4]);
      const pw = (x, n) => (n === 1 ? x : `${x}^{${n}}`);
      const den = s === 0.5 ? "\\sqrt{c}" : pw("c", s);
      const res = p * ea + qq * eb + s * ec;
      return task({
        text: L(
          `A physical quantity is calculated as $P = \\dfrac{${pw("a", p)}\\,${pw("b", qq)}}{${den}}$. The percentage errors in $a$, $b$ and $c$ are ${en(ea)}%, ${en(eb)}% and ${en(ec)}%. Find the maximum percentage error in $P$.`,
          `एक भौतिक राशि $P = \\dfrac{${pw("a", p)}\\,${pw("b", qq)}}{${den}}$ से परिकलित की जाती है। $a$, $b$ और $c$ में प्रतिशत त्रुटियाँ क्रमशः ${en(ea)}%, ${en(eb)}% और ${en(ec)}% हैं। $P$ में अधिकतम प्रतिशत त्रुटि ज्ञात कीजिए।`
        ),
        answer: numM(res, 1, [
          [p * ea + qq * eb - s * ec, L("The error of a quantity in the denominator is added too, never subtracted.", "हर में स्थित राशि की त्रुटि भी जोड़ी जाती है, घटाई नहीं जाती।")],
          [ea + eb + ec, L("Multiply each percentage error by the power of its quantity.", "हर प्रतिशत त्रुटि को उसकी राशि की घात से गुणा कीजिए।")],
        ]),
        data: { given: [`\\frac{\\Delta a}{a} = ${en(ea)}\\%`, `\\frac{\\Delta b}{b} = ${en(eb)}\\%`, `\\frac{\\Delta c}{c} = ${en(ec)}\\%`], find: ["\\frac{\\Delta P}{P}"] },
        hint: L("Each power becomes a multiplier of its percentage error; all contributions are added.", "हर घात अपनी प्रतिशत त्रुटि का गुणक बनती है; सभी योगदान जोड़े जाते हैं।"),
        formula: "\\dfrac{\\Delta P}{P} = p\\,\\dfrac{\\Delta a}{a} + q\\,\\dfrac{\\Delta b}{b} + s\\,\\dfrac{\\Delta c}{c}",
        solution: `$\\dfrac{\\Delta P}{P} = ${p} \\cdot ${en(ea)}\\% + ${qq} \\cdot ${en(eb)}\\% + ${en(s)} \\cdot ${en(ec)}\\%$\n$\\dfrac{\\Delta P}{P} = ${en(res)}\\%$`,
      });
    }
    if (v === 1) {
      const Lc = r.pick([50.0, 80.0, 100.0, 120.0]);
      const N = r.pick([20, 25, 40, 50]);
      const t = Math.round(N * 2 * Math.PI * Math.sqrt(Lc / 980));
      const Ls = Lc.toFixed(1);
      const res = (100 * 0.1) / Lc + (200 * 1) / t;
      return task({
        text: L(
          `To find $g$ with a simple pendulum, ${who} measures the length $l = ${Ls}$ cm with a scale of least count 0.1 cm and the time of ${N} oscillations as ${t} s with a watch of resolution 1 s. Using $g = 4\\pi^{2} l / T^{2}$, find the maximum percentage error in $g$.${RT(res, 2, lang)}`,
          `सरल लोलक से $g$ ज्ञात करने के लिए ${who} 0.1 cm अल्पतमांक वाले पैमाने से लंबाई $l = ${Ls}$ cm तथा 1 s विभेदन वाली घड़ी से ${N} दोलनों का समय ${t} s मापता है। $g = 4\\pi^{2} l / T^{2}$ से $g$ में अधिकतम प्रतिशत त्रुटि ज्ञात कीजिए।${RT(res, 2, lang)}`
        ).replace("मापता है", ni % 2 ? "मापती है" : "मापता है"),
        answer: numM(res, 2, [
          [(100 * 0.1) / Lc + (100 * 1) / t, L("$T$ appears squared, so its percentage error counts twice.", "$T$ का वर्ग है, इसलिए उसकी प्रतिशत त्रुटि दो बार गिनी जाती है।")],
          [(100 * 0.1) / Lc + (200 * 1) / N / t, L("$T = t/N$ and $\\Delta T = \\Delta t/N$, so $\\Delta T/T = \\Delta t/t$: divide both by $N$ or neither.", "$T = t/N$ और $\\Delta T = \\Delta t/N$, इसलिए $\\Delta T/T = \\Delta t/t$: दोनों को $N$ से भाग दीजिए या किसी को नहीं।")],
          [(200 * 1) / t - (100 * 0.1) / Lc, L("Percentage errors are added, even for a quantity in the denominator.", "हर में स्थित राशि की प्रतिशत त्रुटि भी जोड़ी जाती है।")],
        ]),
        data: { given: [q("l", Ls, "cm"), q("\\Delta l", 0.1, "cm"), q("N", N), q("t", t, "s"), q("\\Delta t", 1, "s")], find: ["\\frac{\\Delta g}{g} \\times 100"] },
        hint: L("$T = t/N$, so $\\Delta T/T = \\Delta t/t$. Then use the powers of $l$ and $T$ in the formula.", "$T = t/N$, इसलिए $\\Delta T/T = \\Delta t/t$। फिर सूत्र में $l$ और $T$ की घातों का प्रयोग कीजिए।"),
        formula: "\\dfrac{\\Delta g}{g} = \\dfrac{\\Delta l}{l} + 2\\,\\dfrac{\\Delta T}{T}",
        solution: `$\\dfrac{\\Delta l}{l} \\times 100 = \\dfrac{0.1}{${Ls}} \\times 100 ${ev((100 * 0.1) / Lc, 3)}\\,\\%$\n$\\dfrac{\\Delta T}{T} \\times 100 = \\dfrac{1}{${t}} \\times 100 ${ev(100 / t, 3)}\\,\\%$\n$\\dfrac{\\Delta g}{g} \\times 100 = ${fx((100 * 0.1) / Lc, 3)} + 2 \\cdot ${fx(100 / t, 3)} ${ev(res, 2)}\\,\\%$`,
      });
    }
    if (v === 2) {
      const ok = r.pick(DIM_SAME);
      return task({
        text: L("Which pair of physical quantities has the same dimensions?", "भौतिक राशियों के किस युग्म की विमाएँ समान हैं?"),
        answer: ch(r, L, ok.p, DIM_DIFF),
        hint: L("Write each quantity from its definition in terms of M, L and T and compare.", "हर राशि को उसकी परिभाषा से M, L और T के रूप में लिखिए और तुलना कीजिए।"),
        solution: L(`Both quantities in "${ok.p[0]}" have the dimensional formula ${ok.d}.\nThe other pairs differ by at least one power of M, L or T.`, `"${ok.p[1]}" की दोनों राशियों का विमीय सूत्र ${ok.d} है।\nबाकी युग्मों में M, L या T की कम से कम एक घात अलग है।`),
      });
    }
    const c = r.pick(DIM_EXP);
    const keys = Object.keys(c.v);
    const k = r.pick(keys);
    const val = c.v[k];
    return task({
      text: L(`${c.t[0]} Using dimensional analysis, find $${k}$.`, `${c.t[1]} विमीय विश्लेषण से $${k}$ ज्ञात कीजिए।`),
      answer: numM(val, 1, [
        [val === 0 ? 1 : -val, val === 0 ? L("Only this quantity contains M, so its power must make the M-power on the right zero.", "M केवल इसी राशि में है, इसलिए दाईं ओर M की घात शून्य करने के लिए इसकी घात शून्य होनी चाहिए।") : L("Check the sign when you solve the equation for the power of T.", "T की घात वाले समीकरण को हल करते समय चिह्न जाँचिए।")],
        [val * 2, L("Solve for the power itself, not twice it: divide by the coefficient.", "स्वयं घात ज्ञात कीजिए, उसका दोगुना नहीं: गुणांक से भाग दीजिए।")],
      ]),
      hint: L("Write the dimensions of every quantity, then equate the powers of M, L and T on both sides.", "हर राशि की विमाएँ लिखिए, फिर दोनों ओर M, L और T की घातें बराबर कीजिए।"),
      formula: false,
      solution: [L("Equate the powers of M, L and T on both sides:", "दोनों ओर M, L और T की घातें बराबर कीजिए:"), ...c.eq, `$${k} = ${en(val)}$`].join("\n"),
    });
  },
};

// ---------- 2. Density and pressure ----------
const METALS = [
  ["aluminium", "ऐलुमिनियम", 2.7],
  ["copper", "ताँबे", 8.9],
  ["lead", "सीसे", 11.3],
  ["gold", "सोने", 19.3],
  ["silver", "चाँदी", 10.5],
  ["steel", "इस्पात", 7.8],
];
const DEPTH_CTX = [
  ["at the bottom of a swimming pool H m deep", "H m गहरे तरणताल की तली पर"],
  ["on a diver H m below the surface of a lake", "झील की सतह से H m नीचे एक गोताखोर पर"],
  ["at the base of a water tank filled to a height of H m", "H m ऊँचाई तक भरी पानी की टंकी की तली पर"],
];
const PRESSURE_CONCEPTS = [
  {
    q: ["Why does a sharp knife cut more easily than a blunt one?", "धारदार चाकू भोथरे चाकू की तुलना में अधिक आसानी से क्यों काटता है?"],
    ok: ["The same force acts on a smaller area, so the pressure is larger", "समान बल कम क्षेत्रफल पर लगता है, इसलिए दाब अधिक होता है"],
    wrong: [
      [["A sharp knife exerts a larger force for the same push", "धारदार चाकू समान धक्के पर अधिक बल लगाता है"], ["The force depends on the push, which is the same; only the area changes.", "बल धक्के पर निर्भर है, जो समान है; केवल क्षेत्रफल बदलता है।"]],
      [["Pressure does not depend on the area of contact", "दाब संपर्क क्षेत्रफल पर निर्भर नहीं करता"], ["$p = F/A$: a smaller area gives a larger pressure.", "$p = F/A$: कम क्षेत्रफल पर दाब अधिक होता है।"]],
      [["The edge of a sharp knife has a larger area", "धारदार चाकू की धार का क्षेत्रफल अधिक होता है"], ["A sharp edge is thin, so its area of contact is smaller, not larger.", "धारदार किनारा पतला होता है, इसलिए उसका संपर्क क्षेत्रफल कम होता है, अधिक नहीं।"]],
    ],
    hint: ["Compare the area over which the force acts.", "तुलना कीजिए कि बल कितने क्षेत्रफल पर लगता है।"],
    sol: ["$p = F/A$. For the same force, the thin edge (small $A$) gives a large pressure.", "$p = F/A$। समान बल के लिए पतली धार (कम $A$) से दाब अधिक होता है।"],
  },
  {
    q: ["Why is the wall of a dam made thicker at the bottom?", "बाँध की दीवार नीचे की ओर अधिक मोटी क्यों बनाई जाती है?"],
    ok: ["The pressure of water increases with depth", "पानी का दाब गहराई के साथ बढ़ता है"],
    wrong: [
      [["Water is much denser near the bottom", "तली के पास पानी बहुत अधिक घना होता है"], ["Water is almost incompressible; its density hardly changes with depth.", "पानी लगभग असंपीड्य है; गहराई के साथ उसका घनत्व लगभग नहीं बदलता।"]],
      [["The pressure is greatest at the surface of the water", "पानी की सतह पर दाब सबसे अधिक होता है"], ["$p = h\\rho g$ grows with the depth $h$, so it is least at the surface.", "$p = h\\rho g$ गहराई $h$ के साथ बढ़ता है, इसलिए सतह पर सबसे कम होता है।"]],
      [["The pressure depends on the total volume of water in the reservoir", "दाब जलाशय में पानी के कुल आयतन पर निर्भर करता है"], ["Liquid pressure at a point depends on depth, density and $g$, not on the volume.", "किसी बिंदु पर द्रव दाब गहराई, घनत्व और $g$ पर निर्भर है, आयतन पर नहीं।"]],
    ],
    hint: ["How does liquid pressure change as you go deeper?", "गहराई में जाने पर द्रव दाब कैसे बदलता है?"],
    sol: ["$p = h\\rho g$: the deeper the point, the larger the pressure, so the bottom of the wall must be strongest.", "$p = h\\rho g$: बिंदु जितना गहरा, दाब उतना अधिक, इसलिए दीवार का निचला भाग सबसे मजबूत होना चाहिए।"],
  },
  {
    q: ["Three vessels of different shapes stand on a table and are filled with water to the same height. How do the pressures at their bases compare?", "मेज पर रखे अलग-अलग आकार के तीन बर्तनों में समान ऊँचाई तक पानी भरा है। उनकी तलियों पर दाब की तुलना कैसी है?"],
    ok: ["The pressure is the same at all three bases", "तीनों तलियों पर दाब समान है"],
    wrong: [
      [["Greatest in the vessel that holds the most water", "सबसे अधिक पानी वाले बर्तन में सबसे अधिक"], ["Liquid pressure depends on depth, density and $g$, not on the amount of liquid.", "द्रव दाब गहराई, घनत्व और $g$ पर निर्भर है, द्रव की मात्रा पर नहीं।"]],
      [["Greatest in the narrowest vessel", "सबसे सँकरे बर्तन में सबसे अधिक"], ["The width of the vessel does not appear in $p = h\\rho g$.", "बर्तन की चौड़ाई $p = h\\rho g$ में नहीं आती।"]],
      [["Greatest in the vessel with the largest base", "सबसे बड़ी तली वाले बर्तन में सबसे अधिक"], ["A larger base gets a larger force, but the pressure (force per area) is the same.", "बड़ी तली पर बल अधिक होता है, पर दाब (प्रति एकांक क्षेत्रफल बल) समान रहता है।"]],
    ],
    hint: ["Which quantities appear in the formula for liquid pressure?", "द्रव दाब के सूत्र में कौन-सी राशियाँ आती हैं?"],
    sol: ["$p = h\\rho g$: same liquid and same depth give the same pressure, whatever the shape.", "$p = h\\rho g$: समान द्रव और समान गहराई पर दाब समान होता है, आकार कुछ भी हो।"],
  },
  {
    q: ["Why are school bags given wide straps?", "स्कूल बैग की पट्टियाँ चौड़ी क्यों बनाई जाती हैं?"],
    ok: ["The weight is spread over a larger area, so the pressure on the shoulders is less", "भार अधिक क्षेत्रफल पर फैल जाता है, इसलिए कंधों पर दाब कम होता है"],
    wrong: [
      [["Wide straps reduce the force on the shoulders", "चौड़ी पट्टियाँ कंधों पर बल कम कर देती हैं"], ["The force is the weight of the bag, which does not change; only the area changes.", "बल बैग का भार है, जो नहीं बदलता; केवल क्षेत्रफल बदलता है।"]],
      [["Wide straps increase the pressure for a firmer grip", "चौड़ी पट्टियाँ मजबूत पकड़ के लिए दाब बढ़ाती हैं"], ["A larger area gives a smaller pressure, not a larger one.", "अधिक क्षेत्रफल से दाब कम होता है, अधिक नहीं।"]],
      [["Wide straps reduce the mass of the bag", "चौड़ी पट्टियाँ बैग का द्रव्यमान कम कर देती हैं"], ["The straps do not change the mass; they change the area of contact.", "पट्टियाँ द्रव्यमान नहीं बदलतीं; वे संपर्क क्षेत्रफल बदलती हैं।"]],
    ],
    hint: ["The weight stays the same. What changes when the strap is wider?", "भार वही रहता है। पट्टी चौड़ी होने पर क्या बदलता है?"],
    sol: ["$p = F/A$: the same weight on a larger area gives a smaller pressure.", "$p = F/A$: समान भार अधिक क्षेत्रफल पर हो तो दाब कम होता है।"],
  },
  {
    q: ["On which principle do a hydraulic press and hydraulic brakes work?", "द्रवचालित प्रेस और द्रवचालित ब्रेक किस सिद्धांत पर कार्य करते हैं?"],
    ok: ["Pascal's law: pressure applied to an enclosed liquid is transmitted equally in all directions", "पास्कल का नियम: बंद द्रव पर लगाया गया दाब सभी दिशाओं में समान रूप से संचरित होता है"],
    wrong: [
      [["Archimedes' principle", "आर्किमीडीज़ का सिद्धांत"], ["Archimedes' principle gives the buoyant force on an immersed body.", "आर्किमीडीज़ का सिद्धांत डूबे हुए पिंड पर उत्प्लावन बल बताता है।"]],
      [["Bernoulli's principle", "बरनौली का सिद्धांत"], ["Bernoulli's principle links speed and pressure in a flowing fluid.", "बरनौली का सिद्धांत बहते तरल में चाल और दाब का संबंध बताता है।"]],
      [["Hooke's law", "हुक का नियम"], ["Hooke's law is about the stretching of elastic solids.", "हुक का नियम प्रत्यास्थ ठोसों के खिंचाव के बारे में है।"]],
    ],
    hint: ["The liquid is enclosed and a small force is applied on a small piston.", "द्रव बंद है और छोटे पिस्टन पर छोटा बल लगाया जाता है।"],
    sol: ["The pressure $F_1/A_1$ is passed on unchanged, so the large piston gets $F_2 = F_1 A_2/A_1$ (Pascal's law).", "दाब $F_1/A_1$ बिना बदले संचरित होता है, इसलिए बड़े पिस्टन पर $F_2 = F_1 A_2/A_1$ (पास्कल का नियम)।"],
  },
];

const exgDensity = {
  id: "exg-fiz-density-pressure",
  topics: [T("density-and-pressure")],
  langs: ["en", "hi"],
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const ni = r.int(0, NAMES.length - 1);
    const who = L(...NAMES[ni]);
    const g10 = "g = 10\\ \\mathrm{m/s^2}";
    if (level === 1) {
      const v = r.int(0, 3);
      if (v === 0) {
        const [me, mh, rho] = r.pick(METALS);
        const V = r.pick([10, 20, 25, 40, 50]);
        const m = tidy(rho * V);
        if (r.int(0, 1) === 0) {
          return task({
            text: L(`A block of ${me} has a mass of ${en(m)} g and a volume of ${V} cm³. Find its density in g/cm³.`, `${mh} के एक गुटके का द्रव्यमान ${en(m)} g और आयतन ${V} cm³ है। इसका घनत्व g/cm³ में ज्ञात कीजिए।`),
            answer: numM(rho, 2, [[V / m, L("Density is mass divided by volume, not volume divided by mass.", "घनत्व = द्रव्यमान ÷ आयतन, न कि आयतन ÷ द्रव्यमान।")], [m * V, L("Divide the mass by the volume; do not multiply.", "द्रव्यमान को आयतन से भाग दीजिए, गुणा नहीं।")]]),
            data: { given: [q("m", m, "g"), q("V", V, "cm^3")], find: ["\\rho"] },
            hint: L("Density is mass per unit volume.", "घनत्व प्रति एकांक आयतन द्रव्यमान है।"),
            formula: "\\rho = \\dfrac{m}{V}",
            solution: `$\\rho = \\dfrac{${en(m)}}{${V}}$\n$\\rho = ${en(rho)}\\ \\text{g/cm}^3$`,
          });
        }
        return task({
          text: L(`The density of ${me} is ${en(rho)} g/cm³. Find the mass of a ${me} block of volume ${V} cm³, in g.`, `${mh} का घनत्व ${en(rho)} g/cm³ है। ${V} cm³ आयतन वाले ${mh} के गुटके का द्रव्यमान g में ज्ञात कीजिए।`),
          answer: numM(m, 1, [[V / rho, L("Mass = density × volume; you divided.", "द्रव्यमान = घनत्व × आयतन; आपने भाग दे दिया।")], [rho / V, L("Mass = density × volume.", "द्रव्यमान = घनत्व × आयतन।")]]),
          data: { given: [q("\\rho", rho, "g/cm^3"), q("V", V, "cm^3")], find: ["m"] },
          hint: L("Rearrange $\\rho = m/V$ for the mass.", "द्रव्यमान के लिए $\\rho = m/V$ को पुनर्व्यवस्थित कीजिए।"),
          formula: "m = \\rho V",
          solution: `$m = \\rho V = ${en(rho)} \\cdot ${V}$\n$m = ${en(m)}\\ \\text{g}$`,
        });
      }
      if (v === 1) {
        const h = r.pick([2, 3, 5, 8, 10, 12, 15, 20]);
        const [ce, chh] = r.pick(DEPTH_CTX);
        const p = h * 10;
        return task({
          text: L(`Find the pressure due to the water ${ce.replace("H", h)}, in kPa. Take $g = 10$ m/s² and the density of water as 1000 kg/m³.`, `${chh.replace("H", h)} पानी के कारण दाब kPa में ज्ञात कीजिए। $g = 10$ m/s² और पानी का घनत्व 1000 kg/m³ लीजिए।`),
          answer: numM(p, 1, [[h, L("Multiply by $g$ as well: $p = h\\rho g$.", "$g$ से भी गुणा कीजिए: $p = h\\rho g$।")], [p * 1000, L("1 kPa = 1000 Pa; convert pascals to kilopascals.", "1 kPa = 1000 Pa; पास्कल को किलोपास्कल में बदलिए।")]]),
          data: { given: [q("h", h, "m"), q("\\rho", 1000, "kg/m^3"), g10], find: ["p"] },
          hint: L("Liquid pressure depends on depth, density and $g$.", "द्रव दाब गहराई, घनत्व और $g$ पर निर्भर करता है।"),
          formula: "p = h\\rho g",
          solution: `$p = h\\rho g = ${h} \\cdot 1000 \\cdot 10 = ${h * 10000}\\ \\text{Pa}$\n$p = ${p}\\ \\text{kPa}$`,
        });
      }
      if (v === 2) {
        const W = r.pick([400, 450, 500, 600, 750]);
        const A = r.pick([0.025, 0.04, 0.05]);
        const p = W / A / 1000;
        return task({
          text: L(
            `${who} weighs ${W} N and stands on the floor. The total area of contact of both feet with the floor is ${en(A)} m². Find the pressure on the floor in kPa.`,
            `${who} का भार ${W} N है और ${ni % 2 ? "वह फर्श पर खड़ी है" : "वह फर्श पर खड़ा है"}। दोनों पैरों का फर्श से कुल संपर्क क्षेत्रफल ${en(A)} m² है। फर्श पर दाब kPa में ज्ञात कीजिए।`
          ),
          answer: numM(p, 2, [[(W * A) / 1000, L("Pressure is force divided by area.", "दाब = बल ÷ क्षेत्रफल।")], [p * 1000, L("Convert pascals to kilopascals: 1 kPa = 1000 Pa.", "पास्कल को किलोपास्कल में बदलिए: 1 kPa = 1000 Pa।")]]),
          data: { given: [q("F", W, "N"), q("A", A, "m^2")], find: ["p"] },
          hint: L("The force on the floor is the weight.", "फर्श पर बल भार के बराबर है।"),
          formula: "p = \\dfrac{F}{A}",
          solution: `$p = \\dfrac{F}{A} = \\dfrac{${W}}{${en(A)}} = ${en(W / A)}\\ \\text{Pa}$\n$p = ${en(p)}\\ \\text{kPa}$`,
        });
      }
      return concept(r, L, r.pick(PRESSURE_CONCEPTS));
    }
    if (level === 2) {
      const v = r.int(0, 3);
      if (v === 0) {
        if (r.int(0, 1) === 0) {
          const rho = r.pick([2500, 2600, 2700, 3000]);
          const V = r.pick([80, 100, 120, 150, 200]);
          const m = tidy((rho * V) / 1e6);
          return task({
            text: L(`A stone of mass ${en(m)} kg is lowered into a measuring cylinder and the water level rises by ${V} cm³. Find the density of the stone in kg/m³.`, `${en(m)} kg द्रव्यमान का एक पत्थर मापक सिलिंडर में डाला गया और पानी का तल ${V} cm³ ऊपर उठ गया। पत्थर का घनत्व kg/m³ में ज्ञात कीजिए।`),
            answer: numM(rho, 0, [[rho / 1000, L("$1\\ \\text{cm}^3 = 10^{-6}\\ \\text{m}^3$, not $10^{-3}\\ \\text{m}^3$.", "$1\\ \\text{cm}^3 = 10^{-6}\\ \\text{m}^3$ होता है, $10^{-3}\\ \\text{m}^3$ नहीं।")], [m / V, L("Convert the volume to m³ before dividing.", "भाग देने से पहले आयतन को m³ में बदलिए।")]]),
            data: { given: [q("m", m, "kg"), q("V", V, "cm^3")], find: ["\\rho"] },
            hint: L("The rise in water level is the volume of the stone. Convert it to m³.", "पानी के तल में वृद्धि पत्थर का आयतन है। इसे m³ में बदलिए।"),
            formula: "\\rho = \\dfrac{m}{V}",
            solution: `$V = ${V}\\ \\text{cm}^3 = ${V} \\times 10^{-6}\\ \\text{m}^3$\n$\\rho = \\dfrac{${en(m)}}{${V} \\times 10^{-6}}$\n$\\rho = ${rho}\\ \\text{kg/m}^3$`,
          });
        }
        const [le, lh, rho] = r.pick([["milk", "दूध", 1030], ["kerosene", "मिट्टी के तेल", 800], ["mustard oil", "सरसों के तेल", 920], ["sea water", "समुद्री जल", 1025]]);
        const Vl = r.pick([0.5, 1.5, 2, 2.5, 4]);
        const m = tidy((rho * Vl) / 1000);
        return task({
          text: L(`${en(Vl)} L of ${le} has a mass of ${en(m)} kg. Find the density of ${le} in kg/m³.`, `${en(Vl)} L ${lh} का द्रव्यमान ${en(m)} kg है। ${lh} का घनत्व kg/m³ में ज्ञात कीजिए।`),
          answer: numM(rho, 0, [[m / Vl, L("This is in kg/L; convert: 1 L = $10^{-3}$ m³.", "यह kg/L में है; बदलिए: 1 L = $10^{-3}$ m³।")], [Vl / m, L("Density is mass divided by volume.", "घनत्व = द्रव्यमान ÷ आयतन।")]]),
          data: { given: [q("V", Vl, "L"), q("m", m, "kg")], find: ["\\rho"] },
          hint: L("Convert litres to cubic metres first.", "पहले लीटर को घन मीटर में बदलिए।"),
          formula: "\\rho = \\dfrac{m}{V}",
          solution: `$V = ${en(Vl)}\\ \\text{L} = ${en(Vl / 1000)}\\ \\text{m}^3$\n$\\rho = \\dfrac{${en(m)}}{${en(Vl / 1000)}}$\n$\\rho = ${rho}\\ \\text{kg/m}^3$`,
        });
      }
      if (v === 1) {
        const A1 = r.pick([5, 10, 20, 25]);
        const k = r.pick([20, 40, 50, 100]);
        const A2 = A1 * k;
        const F1 = r.pick([50, 100, 150, 200]);
        const rev = r.int(0, 1) === 1;
        const F2 = F1 * k;
        if (!rev) {
          return task({
            text: L(`In a hydraulic press the small piston has an area of ${A1} cm² and the large piston ${A2} cm². A force of ${F1} N is applied on the small piston. Find the force on the large piston in kN.`, `एक द्रवचालित प्रेस में छोटे पिस्टन का क्षेत्रफल ${A1} cm² और बड़े पिस्टन का ${A2} cm² है। छोटे पिस्टन पर ${F1} N बल लगाया जाता है। बड़े पिस्टन पर बल kN में ज्ञात कीजिए।`),
            answer: numM(F2 / 1000, 2, [[F1 / k / 1000, L("The larger piston gets the larger force: multiply by $A_2/A_1$.", "बड़े पिस्टन पर बल अधिक होता है: $A_2/A_1$ से गुणा कीजिए।")], [F2, L("Convert newtons to kilonewtons: 1 kN = 1000 N.", "न्यूटन को किलोन्यूटन में बदलिए: 1 kN = 1000 N।")]]),
            data: { given: [q("A_1", A1, "cm^2"), q("A_2", A2, "cm^2"), q("F_1", F1, "N")], find: ["F_2"] },
            hint: L("The pressure is the same on both pistons (Pascal's law).", "दोनों पिस्टनों पर दाब समान है (पास्कल का नियम)।"),
            formula: "\\dfrac{F_1}{A_1} = \\dfrac{F_2}{A_2}",
            solution: `$F_2 = F_1 \\dfrac{A_2}{A_1} = ${F1} \\cdot \\dfrac{${A2}}{${A1}} = ${F2}\\ \\text{N}$\n$F_2 = ${en(F2 / 1000)}\\ \\text{kN}$`,
          });
        }
        const M = F2 / 10;
        return task({
          text: L(`A hydraulic lift has pistons of area ${A1} cm² and ${A2} cm². What force must be applied on the small piston to lift a load of mass ${M} kg placed on the large piston? Answer in N; take $g = 10$ m/s².`, `एक द्रवचालित उत्थापक के पिस्टनों के क्षेत्रफल ${A1} cm² और ${A2} cm² हैं। बड़े पिस्टन पर रखे ${M} kg द्रव्यमान के भार को उठाने के लिए छोटे पिस्टन पर कितना बल लगाना होगा? उत्तर N में दीजिए; $g = 10$ m/s² लीजिए।`),
          answer: numM(F1, 1, [[F1 / 10, L("Use the weight $mg$, not the mass.", "द्रव्यमान नहीं, भार $mg$ लीजिए।")], [F2 * k, L("The small piston needs the smaller force: multiply by $A_1/A_2$.", "छोटे पिस्टन पर कम बल चाहिए: $A_1/A_2$ से गुणा कीजिए।")]]),
          data: { given: [q("A_1", A1, "cm^2"), q("A_2", A2, "cm^2"), q("m", M, "kg"), g10], find: ["F_1"] },
          hint: L("Find the weight of the load, then use equal pressure on both pistons.", "पहले भार ज्ञात कीजिए, फिर दोनों पिस्टनों पर समान दाब का प्रयोग कीजिए।"),
          formula: "\\dfrac{F_1}{A_1} = \\dfrac{F_2}{A_2}",
          solution: `$F_2 = mg = ${M} \\cdot 10 = ${F2}\\ \\text{N}$\n$F_1 = F_2 \\dfrac{A_1}{A_2} = ${F2} \\cdot \\dfrac{${A1}}{${A2}}$\n$F_1 = ${F1}\\ \\text{N}$`,
        });
      }
      if (v === 2) {
        const h = r.pick([5, 8, 12, 15, 20, 25]);
        const sea = r.int(0, 1) === 1;
        const rho = sea ? 1030 : 1000;
        const p = 1.01e5 + h * rho * 9.8;
        const pk = p / 1000;
        return task({
          text: L(
            `Find the total pressure on a diver ${h} m below the surface of ${sea ? "the sea (density 1030 kg/m³)" : "a lake (density of water 1000 kg/m³)"}, in kPa. Atmospheric pressure is $1.01 \\times 10^{5}$ Pa; take $g = 9.8$ m/s².${RT(pk, 1, lang)}`,
            `${sea ? "समुद्र (घनत्व 1030 kg/m³)" : "झील (पानी का घनत्व 1000 kg/m³)"} की सतह से ${h} m नीचे एक गोताखोर पर कुल दाब kPa में ज्ञात कीजिए। वायुमंडलीय दाब $1.01 \\times 10^{5}$ Pa है; $g = 9.8$ m/s² लीजिए।${RT(pk, 1, lang)}`
          ),
          answer: numM(pk, 1, [[(h * rho * 9.8) / 1000, L("The total pressure also includes atmospheric pressure acting on the surface.", "कुल दाब में सतह पर लगने वाला वायुमंडलीय दाब भी शामिल है।")], [(1.01e5 + h * rho) / 1000, L("Multiply by $g$ in $h\\rho g$.", "$h\\rho g$ में $g$ से भी गुणा कीजिए।")]]),
          data: { given: [q("h", h, "m"), q("\\rho", rho, "kg/m^3"), q("p_0", "1.01 \\times 10^{5}", "Pa"), q("g", 9.8, "m/s^2")], find: ["p"] },
          hint: L("Total pressure = atmospheric pressure + pressure of the liquid column.", "कुल दाब = वायुमंडलीय दाब + द्रव स्तंभ का दाब।"),
          formula: "p = p_0 + h\\rho g",
          solution: `$h\\rho g = ${h} \\cdot ${rho} \\cdot 9.8 = ${en(h * rho * 9.8)}\\ \\text{Pa}$\n$p = 101000 + ${en(h * rho * 9.8)} = ${en(p)}\\ \\text{Pa}$\n$p ${ev(pk, 1)}\\ \\text{kPa}$`,
        });
      }
      const r1 = r.pick([800, 900]);
      const r2 = r.pick([1200, 1500, 1600]);
      const V1 = r.pick([1, 2, 3]);
      const V2 = r.pick([1, 2, 4]);
      const res = (r1 * V1 + r2 * V2) / (V1 + V2);
      return task({
        text: L(`${V1} L of liquid A (density ${r1} kg/m³) is mixed with ${V2} L of liquid B (density ${r2} kg/m³). The liquids mix completely and the volumes simply add. Find the density of the mixture in kg/m³.${RT(res, 1, lang)}`, `${V1} L द्रव A (घनत्व ${r1} kg/m³) को ${V2} L द्रव B (घनत्व ${r2} kg/m³) में मिलाया गया। द्रव पूरी तरह मिल जाते हैं और आयतन सीधे जुड़ते हैं। मिश्रण का घनत्व kg/m³ में ज्ञात कीजिए।${RT(res, 1, lang)}`),
        answer: numM(res, 1, [[(r1 + r2) / 2, L("The volumes are not equal; weight each density by its volume.", "आयतन समान नहीं हैं; हर घनत्व को उसके आयतन से भारित कीजिए।")], [r1 + r2, L("Divide the total mass by the total volume.", "कुल द्रव्यमान को कुल आयतन से भाग दीजिए।")]]),
        data: { given: [q("V_1", V1, "L"), q("\\rho_1", r1, "kg/m^3"), q("V_2", V2, "L"), q("\\rho_2", r2, "kg/m^3")], find: ["\\rho"] },
        hint: L("Find the total mass of the mixture and divide by the total volume.", "मिश्रण का कुल द्रव्यमान ज्ञात करके उसे कुल आयतन से भाग दीजिए।"),
        formula: "\\rho = \\dfrac{\\rho_1 V_1 + \\rho_2 V_2}{V_1 + V_2}",
        solution: `$m = ${r1} \\cdot ${en(V1 / 1000)} + ${r2} \\cdot ${en(V2 / 1000)} = ${en((r1 * V1 + r2 * V2) / 1000)}\\ \\text{kg}$\n$\\rho = \\dfrac{${en((r1 * V1 + r2 * V2) / 1000)}}{${en((V1 + V2) / 1000)}} ${ev(res, 1)}\\ \\text{kg/m}^3$`,
      });
    }
    // level 3
    const v = r.int(0, 3);
    if (v === 0) {
      const M = r.pick([800, 1000, 1200, 1500]);
      const d1 = r.pick([2, 3, 4, 5]);
      const d2 = r.pick([20, 25, 30, 40]);
      const F1 = M * 10 * (d1 / d2) ** 2;
      return task({
        text: L(`A car of mass ${M} kg sits on the large piston (diameter ${d2} cm) of a hydraulic lift. The small piston has a diameter of ${d1} cm. Find the least force on the small piston needed to hold the car up, in N. Take $g = 10$ m/s².${RT(F1, 1, lang)}`, `${M} kg द्रव्यमान की एक कार द्रवचालित उत्थापक के बड़े पिस्टन (व्यास ${d2} cm) पर रखी है। छोटे पिस्टन का व्यास ${d1} cm है। कार को थामे रखने के लिए छोटे पिस्टन पर आवश्यक न्यूनतम बल N में ज्ञात कीजिए। $g = 10$ m/s² लीजिए।${RT(F1, 1, lang)}`),
        answer: numM(F1, 1, [[(M * 10 * d1) / d2, L("Area grows as the square of the diameter: use $(d_1/d_2)^2$.", "क्षेत्रफल व्यास के वर्ग के अनुपात में होता है: $(d_1/d_2)^2$ लीजिए।")], [M * (d1 / d2) ** 2, L("Use the weight $mg$ of the car, not its mass.", "कार का द्रव्यमान नहीं, भार $mg$ लीजिए।")], [M * 10 * (d2 / d1) ** 2, L("The small piston needs the smaller force; the ratio is inverted.", "छोटे पिस्टन पर कम बल चाहिए; अनुपात उल्टा हो गया।")]]),
        data: { given: [q("m", M, "kg"), q("d_2", d2, "cm"), q("d_1", d1, "cm"), g10], find: ["F_1"] },
        hint: L("Equal pressure on both pistons; the area of a piston is proportional to $d^2$.", "दोनों पिस्टनों पर दाब समान है; पिस्टन का क्षेत्रफल $d^2$ के अनुपाती है।"),
        formula: "F_1 = F_2\\,\\dfrac{A_1}{A_2} = mg\\left(\\dfrac{d_1}{d_2}\\right)^2",
        solution: `$F_2 = mg = ${M * 10}\\ \\text{N}$\n$\\dfrac{A_1}{A_2} = \\left(\\dfrac{${d1}}{${d2}}\\right)^2 ${ev((d1 / d2) ** 2, 5)}$\n$F_1 = ${M * 10} \\cdot ${en((d1 / d2) ** 2, 5)} ${ev(F1, 1)}\\ \\text{N}$`,
      });
    }
    if (v === 1) {
      if (r.int(0, 1) === 0) {
        const ho = r.pick([10, 12, 15, 20, 25]);
        const ro = r.pick([750, 800, 850, 900]);
        const hw = tidy((ho * ro) / 1000);
        return task({
          text: L(`Water is poured into a U-tube, then oil is poured into one arm. At equilibrium the oil column is ${ho} cm high and it balances a water column of ${en(hw)} cm, both measured from the oil–water interface. Find the density of the oil in kg/m³ (water: 1000 kg/m³).`, `एक U-नली में पानी डालकर एक भुजा में तेल डाला गया। साम्यावस्था में तेल का स्तंभ ${ho} cm ऊँचा है और ${en(hw)} cm पानी के स्तंभ को संतुलित करता है; दोनों ऊँचाइयाँ तेल-पानी की सीमा से मापी गई हैं। तेल का घनत्व kg/m³ में ज्ञात कीजिए (पानी: 1000 kg/m³)।`),
          answer: numM(ro, 0, [[(1000 * ho) / hw, L("The lighter liquid stands higher: $\\rho_o = \\rho_w h_w / h_o$, not the inverse.", "हल्का द्रव ऊँचा खड़ा होता है: $\\rho_o = \\rho_w h_w / h_o$, उल्टा नहीं।")]]),
          data: { given: [q("h_o", ho, "cm"), q("h_w", hw, "cm"), q("\\rho_w", 1000, "kg/m^3")], find: ["\\rho_o"] },
          hint: L("Pressures at the same level in the same liquid (the interface level) are equal.", "एक ही द्रव में एक ही तल (सीमा का तल) पर दाब समान होते हैं।"),
          formula: "h_o \\rho_o g = h_w \\rho_w g",
          solution: `$h_o \\rho_o = h_w \\rho_w$\n$\\rho_o = \\dfrac{${en(hw)} \\cdot 1000}{${ho}}$\n$\\rho_o = ${ro}\\ \\text{kg/m}^3$`,
        });
      }
      const hw = r.pick([13.6, 20.4, 27.2, 34, 40.8]);
      const dh = (hw * 1000) / 13600;
      return task({
        text: L(`A U-tube contains mercury (density 13600 kg/m³). Water is poured into one arm until the water column is ${en(hw)} cm high. Find the difference between the mercury levels in the two arms, in cm.`, `एक U-नली में पारा (घनत्व 13600 kg/m³) है। एक भुजा में पानी तब तक डाला गया जब तक पानी का स्तंभ ${en(hw)} cm ऊँचा न हो गया। दोनों भुजाओं में पारे के तलों का अंतर cm में ज्ञात कीजिए।`),
        answer: numM(dh, 1, [[(hw * 13600) / 1000, L("Mercury is denser, so its column is shorter: multiply by $\\rho_w/\\rho_{Hg}$.", "पारा अधिक घना है, इसलिए उसका स्तंभ छोटा होता है: $\\rho_w/\\rho_{Hg}$ से गुणा कीजिए।")], [hw, L("Equal pressures, not equal heights: the densities differ.", "दाब समान होते हैं, ऊँचाइयाँ नहीं: घनत्व अलग हैं।")]]),
        data: { given: [q("\\rho_{Hg}", 13600, "kg/m^3"), q("h_w", hw, "cm")], find: ["\\Delta h"] },
        hint: L("Compare pressures at the level of the water–mercury interface.", "पानी-पारा सीमा के तल पर दाबों की तुलना कीजिए।"),
        formula: "h_w \\rho_w g = \\Delta h\\,\\rho_{Hg} g",
        solution: `$\\Delta h = h_w \\dfrac{\\rho_w}{\\rho_{Hg}} = ${en(hw)} \\cdot \\dfrac{1000}{13600}$\n$\\Delta h = ${en(dh)}\\ \\text{cm}$`,
      });
    }
    if (v === 2) {
      if (r.int(0, 1) === 0) {
        const hHg = r.pick([76.0, 75.0, 74.0, 72.5, 70.0]);
        const p = (hHg / 100) * 13600 * 9.8;
        const pk = p / 1000;
        return task({
          text: L(`At a certain place the mercury column of a barometer stands at ${hHg.toFixed(1)} cm. Find the atmospheric pressure there in kPa. Density of mercury 13600 kg/m³, $g = 9.8$ m/s².${RT(pk, 1, lang)}`, `किसी स्थान पर बैरोमीटर में पारे का स्तंभ ${hHg.toFixed(1)} cm है। वहाँ का वायुमंडलीय दाब kPa में ज्ञात कीजिए। पारे का घनत्व 13600 kg/m³, $g = 9.8$ m/s²।${RT(pk, 1, lang)}`),
          answer: numM(pk, 1, [[pk * 100, L("Convert the height from cm to m before using $h\\rho g$.", "$h\\rho g$ में रखने से पहले ऊँचाई को cm से m में बदलिए।")], [(hHg / 100) * 13600 / 1000, L("Multiply by $g$ as well.", "$g$ से भी गुणा कीजिए।")]]),
          data: { given: [q("h", hHg.toFixed(1), "cm"), q("\\rho", 13600, "kg/m^3"), q("g", 9.8, "m/s^2")], find: ["p_0"] },
          hint: L("The atmosphere supports the mercury column: $p_0 = h\\rho g$ with $h$ in metres.", "वायुमंडल पारे के स्तंभ को थामे रखता है: $p_0 = h\\rho g$, जहाँ $h$ मीटर में है।"),
          formula: "p_0 = h\\rho g",
          solution: `$h = ${en(hHg / 100)}\\ \\text{m}$\n$p_0 = ${en(hHg / 100)} \\cdot 13600 \\cdot 9.8 = ${en(p)}\\ \\text{Pa}$\n$p_0 ${ev(pk, 1)}\\ \\text{kPa}$`,
        });
      }
      const [le, lh, rl] = r.pick([["water", "पानी", 1000], ["kerosene", "मिट्टी के तेल", 800], ["sea water", "समुद्री जल", 1030], ["glycerine", "ग्लिसरीन", 1260]]);
      const h = (0.76 * 13600) / rl;
      return task({
        text: L(`Normal atmospheric pressure supports a column of mercury 76 cm high (density of mercury 13600 kg/m³). How tall a column of ${le} (density ${rl} kg/m³) would it support? Answer in m.${RT(h, 2, lang)}`, `सामान्य वायुमंडलीय दाब 76 cm ऊँचे पारे के स्तंभ (पारे का घनत्व 13600 kg/m³) को थामे रखता है। यह ${lh} (घनत्व ${rl} kg/m³) के कितने ऊँचे स्तंभ को थामेगा? उत्तर m में दीजिए।${RT(h, 2, lang)}`),
        answer: numM(h, 2, [[(0.76 * rl) / 13600, L("The less dense liquid needs the taller column: multiply by $\\rho_{Hg}/\\rho$.", "कम घने द्रव का स्तंभ अधिक ऊँचा होता है: $\\rho_{Hg}/\\rho$ से गुणा कीजिए।")], [h * 100, L("The answer is asked in metres.", "उत्तर मीटर में माँगा गया है।")]]),
        data: { given: [q("h_{Hg}", 76, "cm"), q("\\rho_{Hg}", 13600, "kg/m^3"), q("\\rho", rl, "kg/m^3")], find: ["h"] },
        hint: L("Both columns exert the same pressure: $h_{Hg}\\rho_{Hg} = h\\rho$.", "दोनों स्तंभ समान दाब डालते हैं: $h_{Hg}\\rho_{Hg} = h\\rho$।"),
        formula: "h\\rho g = h_{Hg}\\rho_{Hg} g",
        solution: `$h = h_{Hg}\\dfrac{\\rho_{Hg}}{\\rho} = 0.76 \\cdot \\dfrac{13600}{${rl}}$\n$h ${ev(h, 2)}\\ \\text{m}$`,
      });
    }
    const r1 = r.pick([800, 900]);
    const r2 = r.pick([1200, 1500, 1600]);
    const res = (2 * r1 * r2) / (r1 + r2);
    return task({
      text: L(`Equal masses of two liquids of densities ${r1} kg/m³ and ${r2} kg/m³ are mixed. They mix completely and the volumes simply add. Find the density of the mixture in kg/m³.${RT(res, 1, lang)}`, `${r1} kg/m³ और ${r2} kg/m³ घनत्व वाले दो द्रवों के समान द्रव्यमान मिलाए गए। वे पूरी तरह मिल जाते हैं और आयतन सीधे जुड़ते हैं। मिश्रण का घनत्व kg/m³ में ज्ञात कीजिए।${RT(res, 1, lang)}`),
      answer: numM(res, 1, [[(r1 + r2) / 2, L("The simple average holds for equal volumes; here the masses are equal.", "साधारण औसत समान आयतनों के लिए होता है; यहाँ द्रव्यमान समान हैं।")]]),
      data: { given: [q("\\rho_1", r1, "kg/m^3"), q("\\rho_2", r2, "kg/m^3")], find: ["\\rho"] },
      hint: L("Take a mass $m$ of each liquid and find the total volume $m/\\rho_1 + m/\\rho_2$.", "हर द्रव का द्रव्यमान $m$ लीजिए और कुल आयतन $m/\\rho_1 + m/\\rho_2$ ज्ञात कीजिए।"),
      formula: "\\rho = \\dfrac{2m}{m/\\rho_1 + m/\\rho_2} = \\dfrac{2\\rho_1\\rho_2}{\\rho_1 + \\rho_2}",
      solution: `$\\rho = \\dfrac{2 \\cdot ${r1} \\cdot ${r2}}{${r1} + ${r2}}$\n$\\rho ${ev(res, 1)}\\ \\text{kg/m}^3$`,
    });
  },
};

// ---------- 3. Fluids and buoyancy ----------
const FLOAT_CONCEPTS = [
  {
    q: ["A ship sails from a river into the sea. What happens to it?", "एक जहाज नदी से समुद्र में जाता है। उसके साथ क्या होता है?"],
    ok: ["It rises a little, because sea water is denser and less volume must be displaced", "वह थोड़ा ऊपर उठ जाता है, क्योंकि समुद्री जल अधिक घना है और कम आयतन विस्थापित करना पड़ता है"],
    wrong: [
      [["It sinks a little deeper, because sea water is denser", "वह थोड़ा और डूब जाता है, क्योंकि समुद्री जल अधिक घना है"], ["Denser water gives the same buoyant force with less displaced volume, so the ship rises.", "अधिक घना पानी कम विस्थापित आयतन में ही उतना उत्प्लावन बल देता है, इसलिए जहाज ऊपर उठता है।"]],
      [["It floats at exactly the same level", "वह ठीक उसी तल पर तैरता है"], ["The buoyant force stays equal to the weight, but the displaced volume depends on the water's density.", "उत्प्लावन बल भार के बराबर रहता है, पर विस्थापित आयतन पानी के घनत्व पर निर्भर करता है।"]],
      [["The buoyant force on it becomes larger than its weight", "उस पर उत्प्लावन बल उसके भार से अधिक हो जाता है"], ["For a floating ship the buoyant force always equals its weight.", "तैरते जहाज पर उत्प्लावन बल सदैव उसके भार के बराबर होता है।"]],
    ],
    hint: ["For floating, buoyant force = weight. How does the displaced volume depend on the liquid's density?", "तैरने के लिए उत्प्लावन बल = भार। विस्थापित आयतन द्रव के घनत्व पर कैसे निर्भर है?"],
    sol: ["$V\\rho g = W$ stays fixed. Larger $\\rho$ (sea water) → smaller $V$ under water → the ship rises.", "$V\\rho g = W$ स्थिर है। अधिक $\\rho$ (समुद्री जल) → पानी के नीचे कम $V$ → जहाज ऊपर उठता है।"],
  },
  {
    q: ["A wooden block floats at rest on water. Which statement is true?", "लकड़ी का एक गुटका पानी पर स्थिर तैर रहा है। कौन-सा कथन सत्य है?"],
    ok: ["The buoyant force on it equals its weight", "उस पर उत्प्लावन बल उसके भार के बराबर है"],
    wrong: [
      [["The buoyant force is greater than its weight", "उत्प्लावन बल उसके भार से अधिक है"], ["The block is at rest, so the forces on it balance.", "गुटका स्थिर है, इसलिए उस पर बल संतुलित हैं।"]],
      [["The buoyant force equals the weight of water of the block's whole volume", "उत्प्लावन बल गुटके के पूरे आयतन के बराबर पानी के भार के बराबर है"], ["Only the submerged part displaces water.", "केवल डूबा हुआ भाग ही पानी विस्थापित करता है।"]],
      [["No buoyant force acts because it is not fully under water", "कोई उत्प्लावन बल नहीं लगता क्योंकि वह पूरा पानी में नहीं है"], ["Any immersed part displaces water and feels an upward force.", "पानी में डूबा कोई भी भाग पानी विस्थापित करता है और ऊपर की ओर बल अनुभव करता है।"]],
    ],
    hint: ["The block is in equilibrium.", "गुटका साम्यावस्था में है।"],
    sol: ["At rest the net force is zero: buoyant force (weight of displaced water) = weight of the block.", "स्थिर अवस्था में कुल बल शून्य है: उत्प्लावन बल (विस्थापित पानी का भार) = गुटके का भार।"],
  },
  {
    q: ["Why does an iron nail sink in water while an iron ship floats?", "लोहे की कील पानी में क्यों डूब जाती है जबकि लोहे का जहाज तैरता है?"],
    ok: ["The hollow ship displaces water whose weight equals its own weight; the nail cannot", "खोखला जहाज अपने भार के बराबर भार का पानी विस्थापित करता है; कील नहीं कर पाती"],
    wrong: [
      [["The iron used in ships is less dense than water", "जहाज में लगा लोहा पानी से कम घना होता है"], ["Iron is always denser than water; the hollow shape makes the difference.", "लोहा सदैव पानी से अधिक घना है; अंतर खोखले आकार से आता है।"]],
      [["Sea water pushes harder on heavier objects", "समुद्री जल भारी वस्तुओं पर अधिक धक्का देता है"], ["The buoyant force depends on the displaced volume, not on the object's weight.", "उत्प्लावन बल विस्थापित आयतन पर निर्भर है, वस्तु के भार पर नहीं।"]],
      [["No buoyant force acts on the nail", "कील पर कोई उत्प्लावन बल नहीं लगता"], ["A buoyant force acts on the nail too, but it is less than the nail's weight.", "कील पर भी उत्प्लावन बल लगता है, पर वह कील के भार से कम होता है।"]],
    ],
    hint: ["Compare the volume of water each object can displace with its weight.", "हर वस्तु द्वारा विस्थापित किए जा सकने वाले पानी के आयतन की उसके भार से तुलना कीजिए।"],
    sol: ["A ship's hull encloses a large volume, so it displaces enough water to balance its weight. The solid nail's displaced water weighs less than the nail.", "जहाज का ढाँचा बड़ा आयतन घेरता है, इसलिए वह अपने भार के बराबर पानी विस्थापित कर लेता है। ठोस कील द्वारा विस्थापित पानी का भार कील से कम होता है।"],
  },
  {
    q: ["For a body completely immersed in a liquid, the buoyant force depends on:", "द्रव में पूरी तरह डूबे पिंड पर उत्प्लावन बल किस पर निर्भर करता है?"],
    ok: ["The volume of the body and the density of the liquid", "पिंड के आयतन और द्रव के घनत्व पर"],
    wrong: [
      [["The mass of the body", "पिंड के द्रव्यमान पर"], ["Two bodies of equal volume but different mass feel the same buoyant force.", "समान आयतन पर भिन्न द्रव्यमान वाले दो पिंडों पर समान उत्प्लावन बल लगता है।"]],
      [["The depth at which the body is held", "उस गहराई पर जहाँ पिंड रखा है"], ["Once fully immersed, the displaced volume and so the buoyant force do not change with depth.", "पूरी तरह डूबने के बाद विस्थापित आयतन और इसलिए उत्प्लावन बल गहराई के साथ नहीं बदलते।"]],
      [["The shape of the container", "बर्तन के आकार पर"], ["Only the displaced liquid matters, not the container.", "केवल विस्थापित द्रव मायने रखता है, बर्तन नहीं।"]],
    ],
    hint: ["Archimedes: buoyant force = weight of the liquid displaced.", "आर्किमीडीज़: उत्प्लावन बल = विस्थापित द्रव का भार।"],
    sol: ["$F_B = V\\rho_{liquid} g$: only the immersed volume and the liquid's density (and $g$) appear.", "$F_B = V\\rho_{\\text{द्रव}} g$: केवल डूबा आयतन और द्रव का घनत्व (तथा $g$) आते हैं।"],
  },
];

const exgFluids = {
  id: "exg-fiz-fluids-buoyancy",
  topics: [T("fluids-and-buoyancy")],
  langs: ["en", "hi"],
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const ni = r.int(0, NAMES.length - 1);
    const who = L(...NAMES[ni]);
    const g10 = "g = 10\\ \\mathrm{m/s^2}";
    if (level === 1) {
      const v = r.int(0, 3);
      if (v === 0) {
        const V = r.pick([0.001, 0.002, 0.0025, 0.004, 0.005, 0.008]);
        const ker = r.int(0, 2) === 0;
        const rho = ker ? 800 : 1000;
        const F = V * rho * 10;
        return task({
          text: L(`A metal piece of volume ${en(V)} m³ is completely immersed in ${ker ? "kerosene (density 800 kg/m³)" : "water (density 1000 kg/m³)"}. Find the buoyant force on it in N. Take $g = 10$ m/s².`, `${en(V)} m³ आयतन का धातु का एक टुकड़ा ${ker ? "मिट्टी के तेल (घनत्व 800 kg/m³)" : "पानी (घनत्व 1000 kg/m³)"} में पूरी तरह डुबोया गया है। उस पर उत्प्लावन बल N में ज्ञात कीजिए। $g = 10$ m/s² लीजिए।`),
          answer: numM(F, 1, [[V * rho, L("That is the mass of liquid displaced; multiply by $g$ for its weight.", "यह विस्थापित द्रव का द्रव्यमान है; भार के लिए $g$ से गुणा कीजिए।")]]),
          data: { given: [q("V", V, "m^3"), q("\\rho", rho, "kg/m^3"), g10], find: ["F_B"] },
          hint: L("Archimedes: buoyant force = weight of the liquid displaced.", "आर्किमीडीज़: उत्प्लावन बल = विस्थापित द्रव का भार।"),
          formula: "F_B = V\\rho g",
          solution: `$F_B = ${en(V)} \\cdot ${rho} \\cdot 10$\n$F_B = ${en(F)}\\ \\text{N}$`,
        });
      }
      if (v === 1) {
        const Wa = r.pick([10, 12, 15, 20, 25, 30]);
        const Fb = r.pick([2, 2.5, 3, 4, 5]);
        const Ww = Wa - Fb;
        return task({
          text: L(`A stone weighs ${Wa} N in air and ${en(Ww)} N when fully immersed in water. Find the buoyant force on the stone in N.`, `एक पत्थर का भार हवा में ${Wa} N और पानी में पूरी तरह डुबोने पर ${en(Ww)} N है। पत्थर पर उत्प्लावन बल N में ज्ञात कीजिए।`),
          answer: numM(Fb, 1, [[Wa + Ww, L("The buoyant force is the loss of weight: subtract.", "उत्प्लावन बल भार में कमी है: घटाइए।")], [Ww, L("This is the apparent weight, not the upthrust.", "यह आभासी भार है, उत्प्लावन बल नहीं।")]]),
          data: { given: [q("W_{air}", Wa, "N"), q("W_{water}", Ww, "N")], find: ["F_B"] },
          hint: L("The upthrust of the water makes the stone seem lighter.", "पानी का उत्प्लावन बल पत्थर को हल्का प्रतीत कराता है।"),
          formula: "F_B = W_{air} - W_{water}",
          solution: `$F_B = ${Wa} - ${en(Ww)}$\n$F_B = ${en(Fb)}\\ \\text{N}$`,
        });
      }
      if (v === 2) {
        const [oe, oh, ro, fem] = r.pick([["A wooden block", "लकड़ी का एक गुटका", 600, 0], ["A wooden block", "लकड़ी का एक गुटका", 750, 0], ["A plastic ball", "प्लास्टिक की एक गेंद", 400, 1], ["A cork", "एक कॉर्क", 250, 0], ["A wax candle", "मोम की एक मोमबत्ती", 900, 1]]);
        const above = r.int(0, 1) === 1;
        const sub = (100 * ro) / 1000;
        const ans = above ? 100 - sub : sub;
        return task({
          text: L(`${oe} of density ${ro} kg/m³ floats in water (density 1000 kg/m³). What percentage of its volume is ${above ? "above" : "below"} the water surface?`, `${ro} kg/m³ घनत्व ${fem ? "की" : "का"} ${oh} पानी (घनत्व 1000 kg/m³) में ${fem ? "तैर रही" : "तैर रहा"} है। उसके आयतन का कितना प्रतिशत भाग पानी की सतह से ${above ? "ऊपर" : "नीचे"} है?`),
          answer: numM(ans, 1, [[above ? sub : 100 - sub, above ? L("$\\rho_b/\\rho_w$ gives the part under water; the question asks for the part above.", "$\\rho_b/\\rho_w$ पानी के नीचे का भाग देता है; प्रश्न ऊपर के भाग का है।") : L("$\\rho_b/\\rho_w$ is the fraction under water, not above it.", "$\\rho_b/\\rho_w$ पानी के नीचे का भाग है, ऊपर का नहीं।")], [(100 * 1000) / ro, L("The fraction under water is $\\rho_b/\\rho_w$, which is less than 1.", "पानी के नीचे का भाग $\\rho_b/\\rho_w$ है, जो 1 से कम है।")]]),
          data: { given: [q("\\rho_b", ro, "kg/m^3"), q("\\rho_w", 1000, "kg/m^3")], find: [above ? "\\frac{V_{above}}{V}" : "\\frac{V_{sub}}{V}"] },
          hint: L("Weight of the body = weight of water displaced by the submerged part.", "पिंड का भार = डूबे भाग द्वारा विस्थापित पानी का भार।"),
          formula: "\\dfrac{V_{sub}}{V} = \\dfrac{\\rho_b}{\\rho_w}",
          solution: above
            ? `$\\dfrac{V_{sub}}{V} = \\dfrac{${ro}}{1000} = ${en(ro / 1000)}$\n$\\dfrac{V_{above}}{V} = 1 - ${en(ro / 1000)} = ${en(1 - ro / 1000)}$\n$${en(ans)}\\,\\%$`
            : `$\\dfrac{V_{sub}}{V} = \\dfrac{${ro}}{1000} = ${en(ro / 1000)}$\n$${en(ans)}\\,\\%$`,
        });
      }
      return concept(r, L, r.pick(FLOAT_CONCEPTS));
    }
    if (level === 2) {
      const v = r.int(0, 3);
      if (v === 0) {
        const RD = r.pick([2, 2.5, 3, 4, 5, 8]);
        const Fb = r.pick([2, 4, 5]);
        const Wa = RD * Fb;
        const Ww = Wa - Fb;
        return task({
          text: L(`A metal sample weighs ${en(Wa)} N in air and ${en(Ww)} N when fully immersed in water. Find the relative density of the metal.`, `धातु का एक नमूना हवा में ${en(Wa)} N और पानी में पूरी तरह डुबोने पर ${en(Ww)} N भार दर्शाता है। धातु का आपेक्षिक घनत्व ज्ञात कीजिए।`),
          answer: numM(RD, 2, [[Wa / Ww, L("Divide by the loss of weight in water, not by the weight in water.", "पानी में भार से नहीं, पानी में भार की कमी से भाग दीजिए।")], [Fb / Wa, L("The ratio is inverted: weight in air ÷ loss of weight.", "अनुपात उल्टा है: हवा में भार ÷ भार में कमी।")]]),
          data: { given: [q("W_{air}", Wa, "N"), q("W_{water}", Ww, "N")], find: ["RD"] },
          hint: L("The loss of weight equals the weight of an equal volume of water.", "भार में कमी समान आयतन वाले पानी के भार के बराबर होती है।"),
          formula: "RD = \\dfrac{W_{air}}{W_{air} - W_{water}}",
          solution: `$W_{air} - W_{water} = ${en(Wa)} - ${en(Ww)} = ${en(Fb)}\\ \\text{N}$\n$RD = \\dfrac{${en(Wa)}}{${en(Fb)}}$\n$RD = ${en(RD)}$`,
        });
      }
      if (v === 1) {
        const H = r.pick([10, 12, 20, 25]);
        const rb = r.pick([600, 750, 800, 900]);
        const [le, lh, rl] = r.pick([["water", "पानी", 1000], ["water", "पानी", 1000], ["glycerine", "ग्लिसरीन", 1260]]);
        const above = r.int(0, 1) === 1;
        const hs = (H * rb) / rl;
        const ans = above ? H - hs : hs;
        return task({
          text: L(`A wooden cube of side ${H} cm and density ${rb} kg/m³ floats upright in ${le} (density ${rl} kg/m³). How many cm of the cube are ${above ? "above" : "below"} the liquid surface?${RT(ans, 2, lang)}`, `${H} cm भुजा और ${rb} kg/m³ घनत्व वाला लकड़ी का एक घन ${lh} (घनत्व ${rl} kg/m³) में सीधा तैर रहा है। घन का कितने cm भाग द्रव की सतह से ${above ? "ऊपर" : "नीचे"} है?${RT(ans, 2, lang)}`),
          answer: numM(ans, 2, [[above ? hs : H - hs, L("Check which part is asked: $h\\rho_l = H\\rho_b$ gives the depth under the surface.", "देखिए कौन-सा भाग पूछा गया है: $h\\rho_l = H\\rho_b$ सतह के नीचे की गहराई देता है।")], [(H * rl) / rb, L("The submerged depth is $H\\rho_b/\\rho_l$; the ratio is inverted.", "डूबी गहराई $H\\rho_b/\\rho_l$ है; अनुपात उल्टा है।")]]),
          data: { given: [q("H", H, "cm"), q("\\rho_b", rb, "kg/m^3"), q("\\rho_l", rl, "kg/m^3")], find: [above ? "H - h" : "h"] },
          hint: L("Weight of the cube = weight of liquid displaced by the submerged part $A h$.", "घन का भार = डूबे भाग $A h$ द्वारा विस्थापित द्रव का भार।"),
          formula: "A H \\rho_b g = A h \\rho_l g",
          solution: above
            ? `$h = H\\dfrac{\\rho_b}{\\rho_l} = ${H} \\cdot \\dfrac{${rb}}{${rl}} ${ev(hs, 2)}\\ \\text{cm}$\n$H - h ${ev(ans, 2)}\\ \\text{cm}$`
            : `$h = H\\dfrac{\\rho_b}{\\rho_l} = ${H} \\cdot \\dfrac{${rb}}{${rl}}$\n$h ${ev(ans, 2)}\\ \\text{cm}$`,
        });
      }
      if (v === 2) {
        const V = r.pick([0.5, 0.6, 0.8, 1.2, 1.5]);
        const rw = r.pick([500, 600, 700]);
        const load = V * (1000 - rw);
        return task({
          text: L(`A raft is made of logs with a total volume of ${en(V)} m³ and density ${rw} kg/m³. What is the largest mass, in kg, that the raft can carry in fresh water (density 1000 kg/m³) without the logs going fully under?`, `एक बेड़ा ${en(V)} m³ कुल आयतन और ${rw} kg/m³ घनत्व वाले लट्ठों से बना है। मीठे पानी (घनत्व 1000 kg/m³) में लट्ठों के पूरी तरह डूबे बिना बेड़ा अधिकतम कितना द्रव्यमान (kg में) ढो सकता है?`),
          answer: numM(load, 0, [[V * 1000, L("The raft's own weight must also be supported; subtract its mass.", "बेड़े का अपना भार भी सँभालना है; उसका द्रव्यमान घटाइए।")], [V * rw, L("That is the mass of the raft itself.", "यह स्वयं बेड़े का द्रव्यमान है।")]]),
          data: { given: [q("V", V, "m^3"), q("\\rho_r", rw, "kg/m^3"), q("\\rho_w", 1000, "kg/m^3")], find: ["m"] },
          hint: L("When fully immersed, the buoyant force supports the raft and the load together.", "पूरी तरह डूबने पर उत्प्लावन बल बेड़े और भार दोनों को सँभालता है।"),
          formula: "V\\rho_w g = (V\\rho_r + m)g",
          solution: `$V\\rho_w = ${en(V)} \\cdot 1000 = ${en(V * 1000)}\\ \\text{kg}$\n$V\\rho_r = ${en(V)} \\cdot ${rw} = ${en(V * rw)}\\ \\text{kg}$\n$m = ${en(V * 1000)} - ${en(V * rw)} = ${en(load)}\\ \\text{kg}$`,
        });
      }
      const Fb = r.pick([0.5, 1, 1.5, 2, 2.5, 3]);
      const rho = r.pick([2500, 2700, 4000, 7800, 8900]);
      const Vcm = Fb * 100;
      const Wa = tidy((rho * Vcm * 1e-6) * 10);
      const Ww = tidy(Wa - Fb);
      const askRho = r.int(0, 1) === 1;
      return task({
        text: askRho
          ? L(`An object weighs ${en(Wa)} N in air and ${en(Ww)} N in water. Find the density of the object in kg/m³. Take $g = 10$ m/s² and the density of water as 1000 kg/m³.`, `एक वस्तु का भार हवा में ${en(Wa)} N और पानी में ${en(Ww)} N है। वस्तु का घनत्व kg/m³ में ज्ञात कीजिए। $g = 10$ m/s² और पानी का घनत्व 1000 kg/m³ लीजिए।`)
          : L(`An object weighs ${en(Wa)} N in air and ${en(Ww)} N in water. Find the volume of the object in cm³. Take $g = 10$ m/s² and the density of water as 1000 kg/m³.`, `एक वस्तु का भार हवा में ${en(Wa)} N और पानी में ${en(Ww)} N है। वस्तु का आयतन cm³ में ज्ञात कीजिए। $g = 10$ m/s² और पानी का घनत्व 1000 kg/m³ लीजिए।`),
        answer: askRho
          ? numM(rho, 0, [[(1000 * Ww) / Fb, L("Use the weight in air for the object's mass, not the weight in water.", "वस्तु के द्रव्यमान के लिए हवा में भार लीजिए, पानी में नहीं।")], [(1000 * Fb) / Wa, L("The ratio is inverted: $\\rho = \\rho_w W_{air}/F_B$.", "अनुपात उल्टा है: $\\rho = \\rho_w W_{air}/F_B$।")]])
          : numM(Vcm, 0, [[(Wa / 10000) * 1e6, L("Use the loss of weight (the buoyant force), not the weight in air.", "हवा में भार नहीं, भार में कमी (उत्प्लावन बल) लीजिए।")], [Vcm / 100, L("Convert m³ to cm³: 1 m³ = $10^{6}$ cm³.", "m³ को cm³ में बदलिए: 1 m³ = $10^{6}$ cm³।")]]),
        data: { given: [q("W_{air}", Wa, "N"), q("W_{water}", Ww, "N"), g10, q("\\rho_w", 1000, "kg/m^3")], find: [askRho ? "\\rho" : "V"] },
        hint: L("The loss of weight equals $V\\rho_w g$; from it find the volume.", "भार में कमी $V\\rho_w g$ के बराबर है; इससे आयतन ज्ञात कीजिए।"),
        formula: askRho ? ["F_B = V\\rho_w g", "\\rho = \\dfrac{W_{air}}{gV}"] : "F_B = V\\rho_w g",
        solution: askRho
          ? `$F_B = ${en(Wa)} - ${en(Ww)} = ${en(Fb)}\\ \\text{N}$\n$V = \\dfrac{${en(Fb)}}{1000 \\cdot 10} = ${en(Fb / 10000)}\\ \\text{m}^3$\n$\\rho = \\dfrac{${en(Wa)}}{10 \\cdot ${en(Fb / 10000)}} = ${rho}\\ \\text{kg/m}^3$`
          : `$F_B = ${en(Wa)} - ${en(Ww)} = ${en(Fb)}\\ \\text{N}$\n$V = \\dfrac{${en(Fb)}}{1000 \\cdot 10} = ${en(Fb / 10000)}\\ \\text{m}^3$\n$V = ${en(Vcm)}\\ \\text{cm}^3$`,
      });
    }
    // level 3
    const v = r.int(0, 3);
    if (v === 0) {
      const [d1, d2] = r.pick([[4, 2], [6, 3], [8, 4], [10, 5], [6, 4], [9, 6]]);
      const k = d1 / d2;
      const v1 = r.pick([0.5, 1, 1.5, 2]);
      const v2 = v1 * k * k;
      const dp = (0.5 * 1000 * (v2 * v2 - v1 * v1)) / 1000;
      return task({
        text: L(`Water flows through a horizontal pipe whose diameter narrows from ${d1} cm to ${en(d2)} cm. The speed in the wide part is ${en(v1)} m/s. Find the pressure difference between the wide and the narrow part, in kPa (water: 1000 kg/m³).${RT(dp, 2, lang)}`, `पानी एक क्षैतिज नली में बहता है जिसका व्यास ${d1} cm से घटकर ${en(d2)} cm हो जाता है। चौड़े भाग में चाल ${en(v1)} m/s है। चौड़े और सँकरे भाग के बीच दाबांतर kPa में ज्ञात कीजिए (पानी: 1000 kg/m³)।${RT(dp, 2, lang)}`),
        answer: numM(dp, 2, [[(0.5 * 1000 * (v1 * v1 * k * k - v1 * v1)) / 1000, L("$Av$ is constant and $A \\propto d^2$, so $v_2 = v_1 (d_1/d_2)^2$.", "$Av$ स्थिर है और $A \\propto d^2$, इसलिए $v_2 = v_1 (d_1/d_2)^2$।")], [2 * dp, L("Bernoulli has $\\tfrac{1}{2}\\rho v^2$; you left out the ½.", "बरनौली समीकरण में $\\tfrac{1}{2}\\rho v^2$ है; आपने ½ छोड़ दिया।")]]),
        data: { given: [q("d_1", d1, "cm"), q("d_2", d2, "cm"), q("v_1", v1, "m/s"), q("\\rho", 1000, "kg/m^3")], find: ["p_1 - p_2"] },
        hint: L("First use the equation of continuity for $v_2$, then Bernoulli's equation for a horizontal pipe.", "पहले सांतत्य समीकरण से $v_2$ ज्ञात कीजिए, फिर क्षैतिज नली के लिए बरनौली समीकरण लगाइए।"),
        formula: ["A_1 v_1 = A_2 v_2", "p_1 - p_2 = \\tfrac{1}{2}\\rho (v_2^2 - v_1^2)"],
        solution: `$v_2 = v_1\\left(\\dfrac{d_1}{d_2}\\right)^2 = ${en(v1)} \\cdot ${en(k * k)} = ${en(v2)}\\ \\text{m/s}$\n$p_1 - p_2 = \\tfrac{1}{2} \\cdot 1000 \\cdot (${en(v2)}^2 - ${en(v1)}^2) = ${en(dp * 1000)}\\ \\text{Pa}$\n$p_1 - p_2 ${ev(dp, 2)}\\ \\text{kPa}$`,
      });
    }
    if (v === 1) {
      const h = r.pick([0.8, 1.25, 1.8, 3.2, 5]);
      const vv = Math.sqrt(2 * 10 * h);
      if (r.int(0, 1) === 0) {
        return task({
          text: L(`A large open water tank has a small hole ${en(h)} m below the water surface. With what speed does water flow out of the hole, in m/s? Take $g = 10$ m/s².`, `पानी की एक बड़ी खुली टंकी में पानी की सतह से ${en(h)} m नीचे एक छोटा छेद है। छेद से पानी किस चाल से (m/s में) निकलता है? $g = 10$ m/s² लीजिए।`),
          answer: numM(vv, 2, [[Math.sqrt(10 * h), L("Torricelli: $v = \\sqrt{2gh}$; the 2 is missing.", "टॉरिसेली: $v = \\sqrt{2gh}$; 2 छूट गया।")], [2 * 10 * h, L("Take the square root of $2gh$.", "$2gh$ का वर्गमूल लीजिए।")]]),
          data: { given: [q("h", h, "m"), g10], find: ["v"] },
          hint: L("Apply Bernoulli's equation between the open surface and the hole (both at atmospheric pressure).", "खुली सतह और छेद (दोनों पर वायुमंडलीय दाब) के बीच बरनौली समीकरण लगाइए।"),
          formula: "v = \\sqrt{2gh}",
          solution: `$v = \\sqrt{2 \\cdot 10 \\cdot ${en(h)}} = \\sqrt{${en(20 * h)}}$\n$v = ${en(vv)}\\ \\text{m/s}$`,
        });
      }
      const A = r.pick([1, 2, 4, 5]);
      const Qls = (A * 1e-4 * vv) * 1000;
      return task({
        text: L(`Water leaks from a hole of area ${A} cm² in the side of an open tank, ${en(h)} m below the water surface. Find the volume of water flowing out per second, in L/s. Take $g = 10$ m/s².`, `एक खुली टंकी की दीवार में पानी की सतह से ${en(h)} m नीचे ${A} cm² क्षेत्रफल का छेद है। प्रति सेकंड बहने वाले पानी का आयतन L/s में ज्ञात कीजिए। $g = 10$ m/s² लीजिए।`),
        answer: numM(Qls, 2, [[A * 1e-4 * Math.sqrt(10 * h) * 1000, L("The efflux speed is $\\sqrt{2gh}$, not $\\sqrt{gh}$.", "बहिःस्राव चाल $\\sqrt{2gh}$ है, $\\sqrt{gh}$ नहीं।")], [Qls * 10, L("1 cm² = $10^{-4}$ m²; check the area conversion.", "1 cm² = $10^{-4}$ m²; क्षेत्रफल का रूपांतरण जाँचिए।")]]),
        data: { given: [q("A", A, "cm^2"), q("h", h, "m"), g10], find: ["Q"] },
        hint: L("Find the efflux speed first, then volume per second $= Av$.", "पहले बहिःस्राव चाल ज्ञात कीजिए, फिर प्रति सेकंड आयतन $= Av$।"),
        formula: ["v = \\sqrt{2gh}", "Q = A v"],
        solution: `$v = \\sqrt{2 \\cdot 10 \\cdot ${en(h)}} = ${en(vv)}\\ \\text{m/s}$\n$Q = ${A} \\times 10^{-4} \\cdot ${en(vv)} = ${en(Qls / 1000)}\\ \\text{m}^3\\text{/s}$\n$Q = ${en(Qls)}\\ \\text{L/s}$`,
      });
    }
    if (v === 2) {
      const rm = r.pick([1.0, 1.5, 2.0, 2.5]);
      const [be, bh, rb] = r.pick([["steel", "इस्पात", 7800], ["copper", "ताँबे", 8900], ["glass", "काँच", 2500]]);
      const [sg, eta] = r.pick([[900, 0.9], [960, 1.2], [1260, 1.5]]);
      const rr = rm / 1000;
      const vt = (2 * rr * rr * (rb - sg) * 9.8) / (9 * eta);
      const vcm = vt * 100;
      return task({
        text: L(`A ${be} ball of radius ${rm.toFixed(1)} mm (density ${rb} kg/m³) falls through a viscous liquid of density ${sg} kg/m³ and viscosity ${en(eta)} Pa s. Find its terminal velocity in cm/s. Take $g = 9.8$ m/s².${RT(vcm, 2, lang)}`, `${rm.toFixed(1)} mm त्रिज्या की ${bh} की एक गोली (घनत्व ${rb} kg/m³) ${sg} kg/m³ घनत्व और ${en(eta)} Pa s श्यानता गुणांक वाले श्यान द्रव में गिरती है। इसका सीमांत वेग cm/s में ज्ञात कीजिए। $g = 9.8$ m/s² लीजिए।${RT(vcm, 2, lang)}`),
        answer: numM(vcm, 2, [[(200 * rr * rr * rb * 9.8) / (9 * eta), L("Include the buoyancy of the liquid: use $(\\rho - \\sigma)$.", "द्रव का उत्प्लावन भी लीजिए: $(\\rho - \\sigma)$ का प्रयोग कीजिए।")], [(200 * rr * (rb - sg) * 9.8) / (9 * eta), L("The radius appears squared in Stokes' result.", "स्टोक्स के परिणाम में त्रिज्या का वर्ग आता है।")], [(900 * rr * rr * (rb - sg) * 9.8) / (2 * eta), L("The factor is $2/9$, not $9/2$.", "गुणांक $2/9$ है, $9/2$ नहीं।")]]),
        data: { given: [q("r", rm.toFixed(1), "mm"), q("\\rho", rb, "kg/m^3"), q("\\sigma", sg, "kg/m^3"), q("\\eta", eta, "Pa\\,s"), q("g", 9.8, "m/s^2")], find: ["v_t"] },
        hint: L("At terminal velocity, weight = buoyant force + viscous force $6\\pi\\eta r v$.", "सीमांत वेग पर भार = उत्प्लावन बल + श्यान बल $6\\pi\\eta r v$।"),
        formula: "v_t = \\dfrac{2 r^2 (\\rho - \\sigma) g}{9\\eta}",
        solution: `$r = ${en(rr)}\\ \\text{m}$\n$v_t = \\dfrac{2 \\cdot (${en(rr)})^2 \\cdot ${rb - sg} \\cdot 9.8}{9 \\cdot ${en(eta)}} ${ev(vt, 5)}\\ \\text{m/s}$\n$v_t ${ev(vcm, 2)}\\ \\text{cm/s}$`,
      });
    }
    const n = r.pick([8, 27, 64, 125]);
    const v0 = r.pick([0.5, 1.2, 1.5, 2, 3]);
    const c = Math.round(Math.cbrt(n));
    const vn = v0 * c * c;
    return task({
      text: L(`${n} identical small rain drops each fall with a terminal velocity of ${en(v0)} cm/s. They merge into one big drop. Find the terminal velocity of the big drop in cm/s.`, `${n} समान छोटी वर्षा-बूँदें प्रत्येक ${en(v0)} cm/s के सीमांत वेग से गिरती हैं। वे मिलकर एक बड़ी बूँद बनाती हैं। बड़ी बूँद का सीमांत वेग cm/s में ज्ञात कीजिए।`),
      answer: numM(vn, 2, [[n * v0, L("The radius grows as $n^{1/3}$ and $v_t \\propto r^2$, not as $n$.", "त्रिज्या $n^{1/3}$ के अनुपात में बढ़ती है और $v_t \\propto r^2$, न कि $n$ के अनुपात में।")], [c * v0, L("$v_t \\propto r^2$: square the radius ratio.", "$v_t \\propto r^2$: त्रिज्याओं के अनुपात का वर्ग लीजिए।")]]),
      data: { given: [q("n", n), q("v_0", v0, "cm/s")], find: ["v"] },
      hint: L("Volume is conserved: $\\tfrac{4}{3}\\pi R^3 = n \\cdot \\tfrac{4}{3}\\pi r^3$. Then use $v_t \\propto r^2$.", "आयतन संरक्षित है: $\\tfrac{4}{3}\\pi R^3 = n \\cdot \\tfrac{4}{3}\\pi r^3$। फिर $v_t \\propto r^2$ का प्रयोग कीजिए।"),
      formula: ["R = n^{1/3} r", "v_t \\propto r^2"],
      solution: `$R = ${n}^{1/3} r = ${c} r$\n$v = v_0 \\left(\\dfrac{R}{r}\\right)^2 = ${en(v0)} \\cdot ${c * c}$\n$v = ${en(vn)}\\ \\text{cm/s}$`,
    });
  },
};

// ---------- 4. Elasticity ----------
// Nedoločni člen: a steel wire, an aluminium wire.
const an = (w) => (/^[aeiou]/i.test(w) ? "an" : "a");
const An = (w) => (/^[aeiou]/i.test(w) ? "An" : "A");
const WIRES = [
  ["steel", "इस्पात", 2.0],
  ["copper", "ताँबे", 1.2],
  ["brass", "पीतल", 0.9],
  ["aluminium", "ऐलुमिनियम", 0.7],
];
const ELAST_CONCEPTS = [
  {
    q: ["What is the SI unit of longitudinal strain?", "अनुदैर्ध्य विकृति का SI मात्रक क्या है?"],
    ok: ["It has no unit (it is a ratio of two lengths)", "इसका कोई मात्रक नहीं है (यह दो लंबाइयों का अनुपात है)"],
    wrong: [
      [["metre (m)", "मीटर (m)"], ["Strain is change in length divided by original length, so the units cancel.", "विकृति = लंबाई में परिवर्तन ÷ मूल लंबाई, इसलिए मात्रक कट जाते हैं।"]],
      [["N/m² (pascal)", "N/m² (पास्कल)"], ["Pascal is the unit of stress, not strain.", "पास्कल प्रतिबल का मात्रक है, विकृति का नहीं।"]],
      [["N/m", "N/m"], ["N/m is the unit of a spring constant.", "N/m स्प्रिंग नियतांक का मात्रक है।"]],
    ],
    hint: ["Write the definition of strain.", "विकृति की परिभाषा लिखिए।"],
    sol: ["Strain $= \\Delta L / L$: metre ÷ metre, so it is dimensionless.", "विकृति $= \\Delta L / L$: मीटर ÷ मीटर, इसलिए यह विमाहीन है।"],
  },
  {
    q: ["Which is more elastic, steel or rubber?", "इस्पात और रबर में कौन अधिक प्रत्यास्थ है?"],
    ok: ["Steel, because its Young's modulus is much larger", "इस्पात, क्योंकि उसका यंग गुणांक बहुत अधिक है"],
    wrong: [
      [["Rubber, because it stretches more easily", "रबर, क्योंकि वह आसानी से खिंच जाता है"], ["In physics, more elastic means a larger stress is needed for the same strain; that is steel.", "भौतिकी में अधिक प्रत्यास्थ का अर्थ है समान विकृति के लिए अधिक प्रतिबल चाहिए; यह इस्पात है।"]],
      [["Both are equally elastic", "दोनों समान रूप से प्रत्यास्थ हैं"], ["Their Young's moduli differ by a huge factor.", "उनके यंग गुणांकों में बहुत बड़ा अंतर है।"]],
      [["Rubber, because its Young's modulus is larger", "रबर, क्योंकि उसका यंग गुणांक अधिक है"], ["Rubber's Young's modulus is far smaller than steel's.", "रबर का यंग गुणांक इस्पात से बहुत कम है।"]],
    ],
    hint: ["Compare the stress needed to produce the same strain.", "समान विकृति उत्पन्न करने के लिए आवश्यक प्रतिबल की तुलना कीजिए।"],
    sol: ["Elasticity is measured by Young's modulus $Y = $ stress/strain. Steel has a much larger $Y$, so it is more elastic.", "प्रत्यास्थता यंग गुणांक $Y = $ प्रतिबल/विकृति से मापी जाती है। इस्पात का $Y$ बहुत अधिक है, इसलिए वह अधिक प्रत्यास्थ है।"],
  },
  {
    q: ["The Young's modulus of a wire depends on:", "किसी तार का यंग गुणांक किस पर निर्भर करता है?"],
    ok: ["Only the material of the wire (at a given temperature)", "केवल तार के पदार्थ पर (दिए गए ताप पर)"],
    wrong: [
      [["The length of the wire", "तार की लंबाई पर"], ["A longer wire stretches more, but the ratio stress/strain stays the same.", "लंबा तार अधिक खिंचता है, पर प्रतिबल/विकृति का अनुपात वही रहता है।"]],
      [["The area of cross-section of the wire", "तार के अनुप्रस्थ काट के क्षेत्रफल पर"], ["Area changes the stress for a given load, not the modulus.", "क्षेत्रफल किसी भार के लिए प्रतिबल बदलता है, गुणांक नहीं।"]],
      [["The load hung on the wire", "तार पर लटकाए गए भार पर"], ["Within the elastic limit, stress and strain change in the same ratio.", "प्रत्यास्थता सीमा के भीतर प्रतिबल और विकृति एक ही अनुपात में बदलते हैं।"]],
    ],
    hint: ["$Y$ is a property like density.", "$Y$ घनत्व की तरह एक गुण है।"],
    sol: ["$Y = FL/(A\\,\\Delta L)$ is the same for any piece of the same material: it is a material property.", "$Y = FL/(A\\,\\Delta L)$ एक ही पदार्थ के हर टुकड़े के लिए समान है: यह पदार्थ का गुण है।"],
  },
  {
    q: ["A wire is loaded beyond its elastic limit and the load is then removed. What happens?", "एक तार पर उसकी प्रत्यास्थता सीमा से अधिक भार लगाकर फिर भार हटा दिया जाता है। क्या होता है?"],
    ok: ["It does not return to its original length (it keeps a permanent set)", "वह अपनी मूल लंबाई पर वापस नहीं आता (उसमें स्थायी विरूपण रह जाता है)"],
    wrong: [
      [["It returns exactly to its original length", "वह ठीक अपनी मूल लंबाई पर लौट आता है"], ["That happens only within the elastic limit.", "ऐसा केवल प्रत्यास्थता सीमा के भीतर होता है।"]],
      [["Hooke's law still holds, so the extension disappears", "हुक का नियम फिर भी लागू है, इसलिए खिंचाव समाप्त हो जाता है"], ["Hooke's law holds only up to the proportional limit.", "हुक का नियम केवल आनुपातिक सीमा तक लागू होता है।"]],
      [["It becomes shorter than its original length", "वह अपनी मूल लंबाई से छोटा हो जाता है"], ["A stretched wire keeps some extra length; it does not shrink below its original length.", "खींचा गया तार कुछ अतिरिक्त लंबाई बनाए रखता है; वह मूल लंबाई से छोटा नहीं होता।"]],
    ],
    hint: ["What does 'elastic limit' mean?", "'प्रत्यास्थता सीमा' का क्या अर्थ है?"],
    sol: ["Beyond the elastic limit the deformation is partly plastic, so a permanent extension remains.", "प्रत्यास्थता सीमा से आगे विरूपण आंशिक रूप से सुघट्य होता है, इसलिए स्थायी खिंचाव बना रहता है।"],
  },
];

const exgElasticity = {
  id: "exg-fiz-elasticity",
  topics: [T("elasticity")],
  langs: ["en", "hi"],
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const ni = r.int(0, NAMES.length - 1);
    const who = L(...NAMES[ni]);
    const g10 = "g = 10\\ \\mathrm{m/s^2}";
    if (level === 1) {
      const v = r.int(0, 3);
      if (v === 0) {
        const F = r.pick([500, 1000, 2000, 4000, 5000]);
        const A = r.pick([2, 4, 5, 10, 20, 25]);
        const s = F / A;
        return task({
          text: L(`A rod of cross-sectional area ${A} mm² is pulled by a force of ${F} N. Find the tensile stress in MPa ($1\\ \\text{MPa} = 10^{6}$ Pa).`, `${A} mm² अनुप्रस्थ काट क्षेत्रफल वाली एक छड़ को ${F} N बल से खींचा जाता है। तनन प्रतिबल MPa में ज्ञात कीजिए ($1\\ \\text{MPa} = 10^{6}$ Pa)।`),
          answer: numM(s, 1, [[F * A, L("Stress is force divided by area.", "प्रतिबल = बल ÷ क्षेत्रफल।")], [s / 1000, L("1 mm² = $10^{-6}$ m², not $10^{-3}$ m².", "1 mm² = $10^{-6}$ m² होता है, $10^{-3}$ m² नहीं।")]]),
          data: { given: [q("F", F, "N"), q("A", A, "mm^2")], find: ["\\sigma"] },
          hint: L("Convert the area to m², then divide the force by it.", "क्षेत्रफल को m² में बदलिए, फिर बल को उससे भाग दीजिए।"),
          formula: "\\sigma = \\dfrac{F}{A}",
          solution: `$A = ${A} \\times 10^{-6}\\ \\text{m}^2$\n$\\sigma = \\dfrac{${F}}{${A} \\times 10^{-6}} = ${en(s)} \\times 10^{6}\\ \\text{Pa}$\n$\\sigma = ${en(s)}\\ \\text{MPa}$`,
        });
      }
      if (v === 1) {
        const L0 = r.pick([20, 25, 40, 50]);
        const x = r.pick([1, 2, 5, 10]);
        const L1 = L0 + x;
        const s = x / L0;
        return task({
          text: L(`${who} stretches a rubber cord of length ${L0} cm to a length of ${L1} cm. Find the longitudinal strain.`, `${who} ${L0} cm लंबी रबर की डोरी को खींचकर ${L1} cm लंबी कर ${ni % 2 ? "देती" : "देता"} है। अनुदैर्ध्य विकृति ज्ञात कीजिए।`),
          answer: numM(s, 3, [[L1 / L0, L("Strain uses the change in length, not the new length.", "विकृति में नई लंबाई नहीं, लंबाई में परिवर्तन लिया जाता है।")], [x / L1, L("Divide by the original length, not the stretched length.", "मूल लंबाई से भाग दीजिए, खिंची हुई लंबाई से नहीं।")]]),
          data: { given: [q("L", L0, "cm"), q("L'", L1, "cm")], find: ["\\varepsilon"] },
          hint: L("Strain = change in length ÷ original length.", "विकृति = लंबाई में परिवर्तन ÷ मूल लंबाई।"),
          formula: "\\varepsilon = \\dfrac{\\Delta L}{L}",
          solution: `$\\Delta L = ${L1} - ${L0} = ${x}\\ \\text{cm}$\n$\\varepsilon = \\dfrac{${x}}{${L0}} = ${en(s)}$`,
        });
      }
      if (v === 2) {
        const k = r.pick([50, 100, 200, 250, 400]);
        const xc = r.pick([2, 4, 5, 8, 10]);
        const F = (k * xc) / 100;
        return task({
          text: L(`A spring of spring constant ${k} N/m is stretched by ${xc} cm within its elastic limit. Find the restoring force in N.`, `${k} N/m स्प्रिंग नियतांक वाली एक स्प्रिंग को प्रत्यास्थता सीमा के भीतर ${xc} cm खींचा जाता है। प्रत्यानयन बल N में ज्ञात कीजिए।`),
          answer: numM(F, 1, [[k * xc, L("Convert the extension to metres before using $F = kx$.", "$F = kx$ लगाने से पहले खिंचाव को मीटर में बदलिए।")], [k / xc, L("Hooke's law: multiply $k$ by $x$.", "हुक का नियम: $k$ को $x$ से गुणा कीजिए।")]]),
          data: { given: [q("k", k, "N/m"), q("x", xc, "cm")], find: ["F"] },
          hint: L("Hooke's law: the restoring force is proportional to the extension.", "हुक का नियम: प्रत्यानयन बल खिंचाव के अनुक्रमानुपाती है।"),
          formula: "F = kx",
          solution: `$x = ${xc}\\ \\text{cm} = ${en(xc / 100)}\\ \\text{m}$\n$F = ${k} \\cdot ${en(xc / 100)}$\n$F = ${en(F)}\\ \\text{N}$`,
        });
      }
      return concept(r, L, r.pick(ELAST_CONCEPTS));
    }
    if (level === 2) {
      const v = r.int(0, 2);
      const [we, wh, Y11] = r.pick(WIRES);
      const m = r.pick([2, 4, 5, 8, 10]);
      const Lm = r.pick([1, 1.5, 2, 2.5, 3]);
      const A = r.pick([0.5, 1, 2]);
      const F = m * 10;
      const dLmm = (F * Lm) / (A * 1e-6 * Y11 * 1e11) * 1000;
      if (v === 0) {
        const dShow = +dLmm.toPrecision(3);
        const Yc = (F * Lm) / (A * 1e-6 * (dShow / 1000)) / 1e11;
        return task({
          text: L(`A load of ${m} kg hangs from a wire ${en(Lm)} m long with cross-sectional area ${en(A)} mm². The wire stretches by ${en(dShow)} mm. Find Young's modulus of the wire in units of $10^{11}$ N/m². Take $g = 10$ m/s².${RT(Yc, 2, lang)}`, `${en(Lm)} m लंबे और ${en(A)} mm² अनुप्रस्थ काट क्षेत्रफल वाले तार से ${m} kg का भार लटका है। तार ${en(dShow)} mm खिंच जाता है। तार का यंग गुणांक $10^{11}$ N/m² की इकाई में ज्ञात कीजिए। $g = 10$ m/s² लीजिए।${RT(Yc, 2, lang)}`),
          answer: numM(Yc, 2, [[Yc / 10, L("Use the weight $mg$, not the mass.", "द्रव्यमान नहीं, भार $mg$ लीजिए।")], [Yc / 1000, L("Convert the extension from mm to m.", "खिंचाव को mm से m में बदलिए।")]]),
          data: { given: [q("m", m, "kg"), q("L", Lm, "m"), q("A", A, "mm^2"), q("\\Delta L", dShow, "mm"), g10], find: ["Y"] },
          hint: L("Convert mm² to m² and mm to m, then $Y$ = stress ÷ strain.", "mm² को m² में और mm को m में बदलिए, फिर $Y$ = प्रतिबल ÷ विकृति।"),
          formula: "Y = \\dfrac{F L}{A\\,\\Delta L}",
          solution: `$F = mg = ${F}\\ \\text{N}$\n$Y = \\dfrac{${F} \\cdot ${en(Lm)}}{${en(A)} \\times 10^{-6} \\cdot ${en(dShow / 1000)}}$\n$Y ${ev(Yc, 2)} \\times 10^{11}\\ \\text{N/m}^2$`,
        });
      }
      if (v === 1) {
        return task({
          text: L(`${An(we)} ${we} wire (Young's modulus $${en(Y11)} \\times 10^{11}$ N/m²) is ${en(Lm)} m long and has a cross-sectional area of ${en(A)} mm². Find its extension in mm when a ${m} kg mass hangs from it. Take $g = 10$ m/s².${RT(dLmm, 2, lang)}`, `${wh} का एक तार (यंग गुणांक $${en(Y11)} \\times 10^{11}$ N/m²) ${en(Lm)} m लंबा है और उसका अनुप्रस्थ काट क्षेत्रफल ${en(A)} mm² है। इससे ${m} kg द्रव्यमान लटकाने पर खिंचाव mm में ज्ञात कीजिए। $g = 10$ m/s² लीजिए।${RT(dLmm, 2, lang)}`),
          answer: numM(dLmm, 2, [[dLmm / 10, L("Use the weight $mg$, not the mass.", "द्रव्यमान नहीं, भार $mg$ लीजिए।")], [dLmm * 1000, L("The answer is asked in mm; convert from m correctly (×1000).", "उत्तर mm में माँगा गया है; m से सही रूपांतरण (×1000) कीजिए।")]]),
          data: { given: [q("Y", `${en(Y11)} \\times 10^{11}`, "N/m^2"), q("L", Lm, "m"), q("A", A, "mm^2"), q("m", m, "kg"), g10], find: ["\\Delta L"] },
          hint: L("Rearrange $Y = FL/(A\\,\\Delta L)$ for $\\Delta L$; use SI units.", "$Y = FL/(A\\,\\Delta L)$ को $\\Delta L$ के लिए पुनर्व्यवस्थित कीजिए; SI मात्रक लीजिए।"),
          formula: "\\Delta L = \\dfrac{F L}{A Y}",
          solution: `$F = mg = ${F}\\ \\text{N}$\n$\\Delta L = \\dfrac{${F} \\cdot ${en(Lm)}}{${en(A)} \\times 10^{-6} \\cdot ${en(Y11)} \\times 10^{11}} ${ev(dLmm / 1000, 6)}\\ \\text{m}$\n$\\Delta L ${ev(dLmm, 2)}\\ \\text{mm}$`,
        });
      }
      const strain = r.pick([0.0005, 0.001, 0.0015, 0.002]);
      const Fn = Y11 * 1e11 * A * 1e-6 * strain;
      return task({
        text: L(`What force, in N, produces a strain of ${en(strain)} in ${an(we)} ${we} wire of cross-sectional area ${en(A)} mm²? Young's modulus of ${we} is $${en(Y11)} \\times 10^{11}$ N/m².`, `${en(A)} mm² अनुप्रस्थ काट क्षेत्रफल वाले ${wh} के तार में ${en(strain)} विकृति उत्पन्न करने के लिए कितना बल (N में) चाहिए? ${wh} का यंग गुणांक $${en(Y11)} \\times 10^{11}$ N/m² है।`),
        answer: numM(Fn, 1, [[Fn * 1000, L("1 mm² = $10^{-6}$ m², not $10^{-3}$ m².", "1 mm² = $10^{-6}$ m² होता है, $10^{-3}$ m² नहीं।")], [Y11 * 1e11 * A * 1e-6, L("Multiply by the strain too: stress = $Y \\times$ strain.", "विकृति से भी गुणा कीजिए: प्रतिबल = $Y \\times$ विकृति।")]]),
        data: { given: [q("\\varepsilon", strain), q("A", A, "mm^2"), q("Y", `${en(Y11)} \\times 10^{11}`, "N/m^2")], find: ["F"] },
        hint: L("First find the stress from $Y$ and the strain.", "पहले $Y$ और विकृति से प्रतिबल ज्ञात कीजिए।"),
        formula: "F = Y A \\varepsilon",
        solution: `$\\sigma = Y\\varepsilon = ${en(Y11)} \\times 10^{11} \\cdot ${en(strain)} = ${en(Y11 * 1e5 * strain)} \\times 10^{6}\\ \\text{Pa}$\n$F = \\sigma A = ${en(Y11 * 1e5 * strain)} \\times 10^{6} \\cdot ${en(A)} \\times 10^{-6}$\n$F = ${en(Fn)}\\ \\text{N}$`,
      });
    }
    // level 3
    const v = r.int(0, 2);
    if (v === 0) {
      const [we, wh, Y11] = r.pick(WIRES);
      const d = r.pick([0.5, 0.8, 1.0, 1.2, 2.0]);
      const m = r.pick([5, 8, 10, 15, 20]);
      const Lm = r.pick([1, 2, 2.5, 3]);
      const F = m * 9.8;
      const A = (Math.PI * (d / 1000) ** 2) / 4;
      const dL = ((F * Lm) / (A * Y11 * 1e11)) * 1000;
      return task({
        text: L(`${An(we)} ${we} wire of length ${en(Lm)} m and diameter ${d.toFixed(1)} mm supports a ${m} kg mass. Young's modulus of ${we} is $${en(Y11)} \\times 10^{11}$ N/m². Find the extension in mm. Take $g = 9.8$ m/s².${RT(dL, 2, lang)}`, `${en(Lm)} m लंबा और ${d.toFixed(1)} mm व्यास वाला ${wh} का एक तार ${m} kg द्रव्यमान को थामे हुए है। ${wh} का यंग गुणांक $${en(Y11)} \\times 10^{11}$ N/m² है। खिंचाव mm में ज्ञात कीजिए। $g = 9.8$ m/s² लीजिए।${RT(dL, 2, lang)}`),
        answer: numM(dL, 2, [[dL / 4, L("$A = \\pi r^2 = \\pi d^2/4$: the diameter was used as the radius.", "$A = \\pi r^2 = \\pi d^2/4$: व्यास को त्रिज्या मान लिया गया।")], [dL / 9.8, L("Use the weight $mg$, not the mass.", "द्रव्यमान नहीं, भार $mg$ लीजिए।")]]),
        data: { given: [q("L", Lm, "m"), q("d", d.toFixed(1), "mm"), q("m", m, "kg"), q("Y", `${en(Y11)} \\times 10^{11}`, "N/m^2"), q("g", 9.8, "m/s^2")], find: ["\\Delta L"] },
        hint: L("Find the cross-sectional area from the diameter: $A = \\pi d^2/4$.", "व्यास से अनुप्रस्थ काट क्षेत्रफल ज्ञात कीजिए: $A = \\pi d^2/4$।"),
        formula: ["A = \\dfrac{\\pi d^2}{4}", "\\Delta L = \\dfrac{F L}{A Y}"],
        solution: `$A = \\dfrac{\\pi (${en(d / 1000)})^2}{4} ${ev(A * 1e7, 3)} \\times 10^{-7}\\ \\text{m}^2$\n$F = ${m} \\cdot 9.8 = ${en(F)}\\ \\text{N}$\n$\\Delta L = \\dfrac{${en(F)} \\cdot ${en(Lm)}}{${en(A * 1e7, 3)} \\times 10^{-7} \\cdot ${en(Y11)} \\times 10^{11}} ${ev(dL, 2)}\\ \\text{mm}$`,
      });
    }
    if (v === 1) {
      if (r.int(0, 2) > 0) {
        const a = r.pick([2, 3, 0.5]);
        const b = r.pick([2, 3, 0.5].filter((x) => x !== a));
        const ratio = (b * b) / a;
        return task({
          text: L(`Two wires A and B are made of the same material and carry the same load. Wire B is ${en(a)} times as long as A and its diameter is ${en(b)} times that of A. Find the ratio of extensions $\\Delta L_A : \\Delta L_B$ as a single number.${RT(ratio, 2, lang)}`, `दो तार A और B एक ही पदार्थ के बने हैं और उन पर समान भार है। तार B की लंबाई A की ${en(a)} गुनी और उसका व्यास A के व्यास का ${en(b)} गुना है। खिंचावों का अनुपात $\\Delta L_A : \\Delta L_B$ एक संख्या के रूप में ज्ञात कीजिए।${RT(ratio, 2, lang)}`),
          answer: numM(ratio, 2, [[b / a, L("The area depends on the square of the diameter.", "क्षेत्रफल व्यास के वर्ग पर निर्भर करता है।")], [a / (b * b), L("This is $\\Delta L_B : \\Delta L_A$; the ratio is inverted.", "यह $\\Delta L_B : \\Delta L_A$ है; अनुपात उल्टा है।")]]),
          data: { given: [q("\\frac{L_B}{L_A}", a), q("\\frac{d_B}{d_A}", b)], find: ["\\frac{\\Delta L_A}{\\Delta L_B}"] },
          hint: L("With the same $F$ and $Y$, $\\Delta L \\propto L/d^2$.", "समान $F$ और $Y$ पर $\\Delta L \\propto L/d^2$।"),
          formula: "\\Delta L = \\dfrac{4FL}{\\pi d^2 Y}",
          solution: `$\\dfrac{\\Delta L_A}{\\Delta L_B} = \\dfrac{L_A}{L_B} \\cdot \\left(\\dfrac{d_B}{d_A}\\right)^2 = \\dfrac{1}{${en(a)}} \\cdot ${en(b)}^2$\n$\\dfrac{\\Delta L_A}{\\Delta L_B} ${ev(ratio, 2)}$`,
        });
      }
      const [A1, B1] = r.shuffle(WIRES).slice(0, 2);
      const ratio = B1[2] / A1[2];
      return task({
        text: L(`${An(A1[0])} ${A1[0]} wire and ${an(B1[0])} ${B1[0]} wire have the same length and diameter and carry the same load. Young's moduli are $${en(A1[2])} \\times 10^{11}$ N/m² and $${en(B1[2])} \\times 10^{11}$ N/m². Find the ratio of their extensions (${A1[0]} : ${B1[0]}) as a single number.${RT(ratio, 2, lang)}`, `${A1[1]} का एक तार और ${B1[1]} का एक तार समान लंबाई और व्यास के हैं और उन पर समान भार है। यंग गुणांक क्रमशः $${en(A1[2])} \\times 10^{11}$ N/m² और $${en(B1[2])} \\times 10^{11}$ N/m² हैं। उनके खिंचावों का अनुपात (${A1[1]} : ${B1[1]}) एक संख्या के रूप में ज्ञात कीजिए।${RT(ratio, 2, lang)}`),
        answer: numM(ratio, 2, [[A1[2] / B1[2], L("Extension is inversely proportional to $Y$: the stiffer wire stretches less.", "खिंचाव $Y$ के व्युत्क्रमानुपाती है: अधिक दृढ़ तार कम खिंचता है।")]]),
        data: { given: [q("Y_1", `${en(A1[2])} \\times 10^{11}`, "N/m^2"), q("Y_2", `${en(B1[2])} \\times 10^{11}`, "N/m^2")], find: ["\\frac{\\Delta L_1}{\\Delta L_2}"] },
        hint: L("With the same $F$, $L$ and $A$, $\\Delta L \\propto 1/Y$.", "समान $F$, $L$ और $A$ पर $\\Delta L \\propto 1/Y$।"),
        formula: "\\Delta L = \\dfrac{FL}{AY}",
        solution: `$\\dfrac{\\Delta L_1}{\\Delta L_2} = \\dfrac{Y_2}{Y_1} = \\dfrac{${en(B1[2])}}{${en(A1[2])}}$\n$\\dfrac{\\Delta L_1}{\\Delta L_2} ${ev(ratio, 2)}$`,
      });
    }
    const [we, wh, Y11] = r.pick(WIRES.slice(0, 2));
    const m = r.pick([10, 20, 25, 40, 50]);
    const Lm = r.pick([1, 2, 3, 4]);
    const A = r.pick([1, 2, 4]);
    const F = m * 10;
    const dL = (F * Lm) / (A * 1e-6 * Y11 * 1e11);
    const U = 0.5 * F * dL * 1000;
    return task({
      text: L(`${An(we)} ${we} wire (Young's modulus $${en(Y11)} \\times 10^{11}$ N/m²) of length ${Lm} m and cross-sectional area ${A} mm² is stretched by hanging a ${m} kg mass from it. Find the elastic potential energy stored in the wire, in mJ. Take $g = 10$ m/s².${RT(U, 2, lang)}`, `${Lm} m लंबे और ${A} mm² अनुप्रस्थ काट क्षेत्रफल वाले ${wh} के तार (यंग गुणांक $${en(Y11)} \\times 10^{11}$ N/m²) से ${m} kg द्रव्यमान लटकाकर उसे खींचा गया। तार में संचित प्रत्यास्थ स्थितिज ऊर्जा mJ में ज्ञात कीजिए। $g = 10$ m/s² लीजिए।${RT(U, 2, lang)}`),
      answer: numM(U, 2, [[2 * U, L("The energy stored is $\\tfrac{1}{2}F\\,\\Delta L$, because the force grows from 0 to $F$.", "संचित ऊर्जा $\\tfrac{1}{2}F\\,\\Delta L$ है, क्योंकि बल 0 से $F$ तक बढ़ता है।")], [U / 10, L("Use the weight $mg$, not the mass.", "द्रव्यमान नहीं, भार $mg$ लीजिए।")]]),
      data: { given: [q("Y", `${en(Y11)} \\times 10^{11}`, "N/m^2"), q("L", Lm, "m"), q("A", A, "mm^2"), q("m", m, "kg"), g10], find: ["U"] },
      hint: L("First find the extension, then the work done by a force that grows steadily from zero.", "पहले खिंचाव ज्ञात कीजिए, फिर शून्य से समान रूप से बढ़ते बल द्वारा किया गया कार्य।"),
      formula: ["\\Delta L = \\dfrac{FL}{AY}", "U = \\tfrac{1}{2}F\\,\\Delta L"],
      solution: `$F = ${F}\\ \\text{N}$\n$\\Delta L = \\dfrac{${F} \\cdot ${Lm}}{${A} \\times 10^{-6} \\cdot ${en(Y11)} \\times 10^{11}} ${ev(dL * 1000, 4)}\\ \\text{mm}$\n$U = \\tfrac{1}{2} \\cdot ${F} \\cdot ${fx(dL * 1000, 4)} \\times 10^{-3}\\ \\text{J}$\n$U ${ev(U, 2)}\\ \\text{mJ}$`,
    });
  },
};

// ---------- 5. Wave optics ----------
const OPT_CONCEPTS = [
  {
    q: ["Which phenomenon shows that light waves are transverse?", "कौन-सी परिघटना दर्शाती है कि प्रकाश तरंगें अनुप्रस्थ हैं?"],
    ok: ["Polarisation", "ध्रुवण"],
    wrong: [
      [["Interference", "व्यतिकरण"], ["Sound, a longitudinal wave, also shows interference.", "ध्वनि, जो अनुदैर्ध्य तरंग है, भी व्यतिकरण दर्शाती है।"]],
      [["Diffraction", "विवर्तन"], ["Longitudinal waves such as sound also diffract.", "ध्वनि जैसी अनुदैर्ध्य तरंगों का भी विवर्तन होता है।"]],
      [["Reflection", "परावर्तन"], ["All waves reflect, transverse or longitudinal.", "सभी तरंगें परावर्तित होती हैं, अनुप्रस्थ हों या अनुदैर्ध्य।"]],
    ],
    hint: ["Which effect is possible only when the vibration is perpendicular to the direction of travel?", "कौन-सा प्रभाव केवल तभी संभव है जब कंपन गति की दिशा के लंबवत हो?"],
    sol: ["Only transverse waves can be polarised, so polarisation of light proves light is transverse.", "केवल अनुप्रस्थ तरंगें ध्रुवित हो सकती हैं, इसलिए प्रकाश का ध्रुवण सिद्ध करता है कि प्रकाश अनुप्रस्थ है।"],
  },
  {
    q: ["For a steady interference pattern, the two light sources must be:", "स्थायी व्यतिकरण प्रतिरूप के लिए दोनों प्रकाश स्रोत कैसे होने चाहिए?"],
    ok: ["Coherent: same frequency and a constant phase difference", "कला-संबद्ध: समान आवृत्ति और नियत कलांतर"],
    wrong: [
      [["Two separate bulbs placed close together", "पास-पास रखे दो अलग बल्ब"], ["Two independent bulbs change phase randomly, so they are not coherent.", "दो स्वतंत्र बल्बों की कला यादृच्छिक रूप से बदलती है, इसलिए वे कला-संबद्ध नहीं होते।"]],
      [["Of different wavelengths", "भिन्न तरंगदैर्घ्य वाले"], ["Different wavelengths cannot keep a constant phase difference.", "भिन्न तरंगदैर्घ्य नियत कलांतर बनाए नहीं रख सकते।"]],
      [["Of equal intensity; coherence does not matter", "समान तीव्रता वाले; कला-संबद्धता आवश्यक नहीं"], ["Unequal intensities only reduce contrast; without coherence there is no steady pattern at all.", "असमान तीव्रता केवल स्पष्टता घटाती है; कला-संबद्धता के बिना स्थायी प्रतिरूप बनता ही नहीं।"]],
    ],
    hint: ["What must stay constant between the two waves at every point?", "हर बिंदु पर दोनों तरंगों के बीच क्या स्थिर रहना चाहिए?"],
    sol: ["Bright and dark fringes stay fixed only if the phase difference between the sources is constant: the sources must be coherent.", "दीप्त और अदीप्त फ्रिंज तभी स्थिर रहते हैं जब स्रोतों के बीच कलांतर नियत हो: स्रोत कला-संबद्ध होने चाहिए।"],
  },
  {
    q: ["In Young's double-slit experiment with white light, the central fringe is:", "सफेद प्रकाश से यंग के द्वि-झिरी प्रयोग में केंद्रीय फ्रिंज कैसा होता है?"],
    ok: ["White", "सफेद"],
    wrong: [
      [["Dark", "अदीप्त (काला)"], ["At the centre the path difference is zero for every colour, so all colours are bright there.", "केंद्र पर हर रंग के लिए पथांतर शून्य है, इसलिए वहाँ सभी रंग दीप्त होते हैं।"]],
      [["Red", "लाल"], ["Colour fringes appear only on the sides; at the centre all colours overlap.", "रंगीन फ्रिंज केवल किनारों पर दिखते हैं; केंद्र पर सभी रंग मिल जाते हैं।"]],
      [["Violet", "बैंगनी"], ["Zero path difference makes every wavelength bright at the centre.", "शून्य पथांतर पर केंद्र में हर तरंगदैर्घ्य दीप्त होता है।"]],
    ],
    hint: ["What is the path difference at the centre of the screen?", "पर्दे के केंद्र पर पथांतर कितना है?"],
    sol: ["Path difference = 0 at the centre for all wavelengths, so all colours add to give a white central fringe.", "केंद्र पर सभी तरंगदैर्घ्यों के लिए पथांतर = 0, इसलिए सभी रंग मिलकर सफेद केंद्रीय फ्रिंज बनाते हैं।"],
  },
  {
    q: ["In Young's double-slit experiment, the separation between the slits is increased. What happens to the fringe width?", "यंग के द्वि-झिरी प्रयोग में झिरियों के बीच की दूरी बढ़ा दी जाती है। फ्रिंज चौड़ाई का क्या होता है?"],
    ok: ["It decreases", "यह घटती है"],
    wrong: [
      [["It increases", "यह बढ़ती है"], ["$\\beta = \\lambda D/d$: a larger $d$ gives a smaller $\\beta$.", "$\\beta = \\lambda D/d$: अधिक $d$ से $\\beta$ कम होता है।"]],
      [["It stays the same", "यह वही रहती है"], ["$d$ appears in the formula $\\beta = \\lambda D/d$.", "$d$ सूत्र $\\beta = \\lambda D/d$ में आता है।"]],
      [["The fringes disappear", "फ्रिंज गायब हो जाते हैं"], ["The fringes only get closer together; they do not vanish.", "फ्रिंज केवल पास-पास आ जाते हैं; गायब नहीं होते।"]],
    ],
    hint: ["Write the formula for fringe width.", "फ्रिंज चौड़ाई का सूत्र लिखिए।"],
    sol: ["$\\beta = \\lambda D/d$, so $\\beta \\propto 1/d$: the fringes come closer.", "$\\beta = \\lambda D/d$, इसलिए $\\beta \\propto 1/d$: फ्रिंज पास आ जाते हैं।"],
  },
];
const COINC = [[650, 520, 4], [600, 400, 2], [600, 480, 4], [750, 500, 2], [560, 420, 3], [500, 400, 4]];
// Hindijski vrstilni števnik v odvisnem sklonu: 1 → पहले, 5 → 5वें.
const ordHi = (n) => ["", "पहले", "दूसरे", "तीसरे", "चौथे"][n] || `${n}वें`;
const cos2 = (deg) => Math.cos((deg * Math.PI) / 180) ** 2;

const exgWaveOptics = {
  id: "exg-fiz-wave-optics",
  topics: [T("wave-optics")],
  langs: ["en", "hi"],
  gen(level, r, _t, lang) {
    const L = bi(lang);
    const lam = r.pick([450, 500, 550, 600, 650, 700]);
    const D = r.pick([1, 1.2, 1.5, 2]);
    const d = r.pick([0.2, 0.25, 0.4, 0.5, 1]);
    const beta = (lam * D) / (d * 1000);
    const yd = [q("\\lambda", lam, "nm"), q("D", D, "m"), q("d", d, "mm")];
    const YDSE = (t) => L(`In Young's double-slit experiment, light of wavelength ${lam} nm is used, the slits are ${en(d)} mm apart and the screen is ${en(D)} m away. ${t[0]}`, `यंग के द्वि-झिरी प्रयोग में ${lam} nm तरंगदैर्घ्य का प्रकाश प्रयुक्त है, झिरियों के बीच दूरी ${en(d)} mm है और पर्दा ${en(D)} m दूर है। ${t[1]}`);
    if (level === 1) {
      const v = r.int(0, 3);
      if (v === 0) {
        return task({
          text: YDSE([`Find the fringe width in mm.${RT(beta, 3, lang)}`, `फ्रिंज चौड़ाई mm में ज्ञात कीजिए।${RT(beta, 3, lang)}`]),
          answer: numM(beta, 3, [[(lam * d) / (D * 1000), L("$\\beta = \\lambda D/d$: $D$ is in the numerator, $d$ in the denominator.", "$\\beta = \\lambda D/d$: $D$ अंश में और $d$ हर में है।")], [beta * 1000, L("Check the units: nm → m and mm → m.", "मात्रक जाँचिए: nm → m और mm → m।")]]),
          data: { given: yd, find: ["\\beta"] },
          hint: L("Convert all lengths to metres first.", "पहले सभी लंबाइयाँ मीटर में बदलिए।"),
          formula: "\\beta = \\dfrac{\\lambda D}{d}",
          solution: `$\\beta = \\dfrac{${lam} \\times 10^{-9} \\cdot ${en(D)}}{${en(d)} \\times 10^{-3}} ${ev(beta / 1000, 7)}\\ \\text{m}$\n$\\beta ${ev(beta, 3)}\\ \\text{mm}$`,
        });
      }
      if (v === 1) {
        const n = r.int(1, 5);
        const dark = r.int(0, 1) === 1;
        const pd = dark ? (n - 0.5) * lam : n * lam;
        const ord = L(...[["first", "पहले"], ["second", "दूसरे"], ["third", "तीसरे"], ["fourth", "चौथे"], ["fifth", "पाँचवें"]][n - 1]);
        return task({
          text: L(`In a double-slit experiment with light of wavelength ${lam} nm, what is the path difference (in nm) between the waves reaching the ${ord} ${dark ? "dark" : "bright"} fringe on one side of the central maximum?`, `${lam} nm तरंगदैर्घ्य के प्रकाश से द्वि-झिरी प्रयोग में केंद्रीय उच्चिष्ठ के एक ओर ${ord} ${dark ? "अदीप्त" : "दीप्त"} फ्रिंज पर पहुँचने वाली तरंगों के बीच पथांतर (nm में) कितना है?`),
          answer: numM(pd, 0, dark ? [[n * lam, L("$n\\lambda$ gives a bright fringe; a dark fringe needs an odd number of half-wavelengths.", "$n\\lambda$ से दीप्त फ्रिंज बनता है; अदीप्त फ्रिंज के लिए अर्ध-तरंगदैर्घ्य की विषम संख्या चाहिए।")], [(n + 0.5) * lam, L("The first dark fringe has path difference $\\lambda/2$, so the $n$th has $(n - \\tfrac{1}{2})\\lambda$.", "पहले अदीप्त फ्रिंज का पथांतर $\\lambda/2$ है, इसलिए $n$वें का $(n - \\tfrac{1}{2})\\lambda$।")]] : [[(n - 0.5) * lam, L("Half-wavelength path differences give dark fringes; bright ones need $n\\lambda$.", "अर्ध-तरंगदैर्घ्य पथांतर से अदीप्त फ्रिंज बनते हैं; दीप्त के लिए $n\\lambda$ चाहिए।")]]),
          data: { given: [q("\\lambda", lam, "nm")], find: ["\\Delta x"] },
          hint: L("Bright: whole number of wavelengths. Dark: odd number of half-wavelengths.", "दीप्त: तरंगदैर्घ्य की पूर्ण संख्या। अदीप्त: अर्ध-तरंगदैर्घ्य की विषम संख्या।"),
          formula: dark ? "\\Delta x = (2n - 1)\\dfrac{\\lambda}{2}" : "\\Delta x = n\\lambda",
          solution: dark ? `$\\Delta x = (2 \\cdot ${n} - 1) \\cdot \\dfrac{${lam}}{2}$\n$\\Delta x = ${en(pd)}\\ \\text{nm}$` : `$\\Delta x = ${n} \\cdot ${lam}$\n$\\Delta x = ${en(pd)}\\ \\text{nm}$`,
        });
      }
      if (v === 2) {
        const I0 = r.pick([16, 20, 32, 40, 60, 80]);
        const th = r.pick([30, 45, 60]);
        const I = I0 * cos2(th);
        return task({
          text: L(`Plane-polarised light of intensity ${I0} W/m² falls on a polaroid whose transmission axis makes an angle of ${th}° with the plane of polarisation. Find the transmitted intensity in W/m².`, `${I0} W/m² तीव्रता का समतल-ध्रुवित प्रकाश एक पोलेरॉइड पर पड़ता है, जिसका संचरण अक्ष ध्रुवण तल से ${th}° का कोण बनाता है। पारगत तीव्रता W/m² में ज्ञात कीजिए।`),
          answer: numM(I, 2, [[I0 * Math.cos((th * Math.PI) / 180), L("Malus' law has $\\cos^2\\theta$, not $\\cos\\theta$.", "मैलस के नियम में $\\cos^2\\theta$ है, $\\cos\\theta$ नहीं।")], [I0 * (1 - cos2(th)), L("Use $\\cos^2\\theta$, where $\\theta$ is the angle with the transmission axis.", "$\\cos^2\\theta$ लीजिए, जहाँ $\\theta$ संचरण अक्ष से कोण है।")], [I0 / 2, L("The light is already polarised, so the factor ½ does not apply.", "प्रकाश पहले से ध्रुवित है, इसलिए ½ का गुणांक नहीं लगता।")]]),
          data: { given: [q("I_0", I0, "W/m^2"), q("\\theta", `${th}^\\circ`)], find: ["I"] },
          hint: L("Use Malus' law.", "मैलस के नियम का प्रयोग कीजिए।"),
          formula: "I = I_0 \\cos^2\\theta",
          solution: `$\\cos^2 ${th}^\\circ = ${fx(cos2(th), 4)}$\n$I = ${I0} \\cdot ${fx(cos2(th), 4)} = ${en(I)}\\ \\text{W/m}^2$`,
        });
      }
      return concept(r, L, r.pick(OPT_CONCEPTS));
    }
    if (level === 2) {
      const v = r.int(0, 3);
      if (v === 0) {
        const n = r.int(2, 6);
        const y = n * beta;
        return task({
          text: YDSE([`How far from the central maximum is the bright fringe of order ${n}, in mm?${RT(y, 2, lang)}`, `${n} कोटि का दीप्त फ्रिंज केंद्रीय उच्चिष्ठ से कितनी दूरी (mm में) पर है?${RT(y, 2, lang)}`]),
          answer: numM(y, 2, [[beta, L("This is one fringe width; multiply by the order $n$.", "यह एक फ्रिंज चौड़ाई है; कोटि $n$ से गुणा कीजिए।")], [(n - 0.5) * beta, L("$(n - \\tfrac{1}{2})\\beta$ gives a dark fringe, not a bright one.", "$(n - \\tfrac{1}{2})\\beta$ से अदीप्त फ्रिंज मिलता है, दीप्त नहीं।")]]),
          data: { given: [...yd, q("n", n)], find: ["y_n"] },
          hint: L("Bright fringes are at whole multiples of the fringe width from the centre.", "दीप्त फ्रिंज केंद्र से फ्रिंज चौड़ाई के पूर्ण गुणजों पर होते हैं।"),
          formula: "y_n = \\dfrac{n\\lambda D}{d}",
          solution: `$\\beta = \\dfrac{\\lambda D}{d} ${ev(beta, 4)}\\ \\text{mm}$\n$y_${n} = ${n} \\cdot ${fx(beta, 4)} ${ev(y, 2)}\\ \\text{mm}$`,
        });
      }
      if (v === 1) {
        const b0 = r.pick([0.6, 0.8, 1.2, 1.5, 2.4]);
        const c = r.int(0, 3);
        const CH = [
          { f: 2, t: ["the distance between the slits is halved", "झिरियों के बीच की दूरी आधी कर दी जाती है"], s: "\\beta' = \\beta \\cdot \\dfrac{d}{d/2} = 2\\beta" },
          { f: 1.5, t: ["the screen is moved so that $D$ becomes 1.5 times as large", "पर्दा खिसकाकर $D$ को 1.5 गुना कर दिया जाता है"], s: "\\beta' = \\beta \\cdot 1.5" },
          { f: 0.75, t: ["the whole apparatus is immersed in water (refractive index $\\tfrac{4}{3}$)", "पूरा उपकरण पानी (अपवर्तनांक $\\tfrac{4}{3}$) में डुबो दिया जाता है"], s: "\\lambda' = \\dfrac{\\lambda}{n},\\ \\beta' = \\dfrac{\\beta}{4/3} = \\tfrac{3}{4}\\beta" },
          { f: 0.75, t: ["light of 600 nm is replaced by light of 450 nm", "600 nm का प्रकाश 450 nm के प्रकाश से बदल दिया जाता है"], s: "\\beta' = \\beta \\cdot \\dfrac{450}{600} = \\tfrac{3}{4}\\beta" },
        ];
        const K = CH[c];
        const nb = b0 * K.f;
        return task({
          text: L(`In a double-slit experiment the fringe width is ${en(b0)} mm. Find the new fringe width in mm if ${K.t[0]}.`, `एक द्वि-झिरी प्रयोग में फ्रिंज चौड़ाई ${en(b0)} mm है। यदि ${K.t[1]}, तो नई फ्रिंज चौड़ाई mm में ज्ञात कीजिए।`),
          answer: numM(nb, 3, [[b0 / K.f, L("Check whether the change sits in the numerator or the denominator of $\\lambda D/d$.", "जाँचिए कि परिवर्तन $\\lambda D/d$ के अंश में है या हर में।")], [b0, L("This change does alter $\\beta = \\lambda D/d$.", "यह परिवर्तन $\\beta = \\lambda D/d$ को बदलता है।")]]),
          data: { given: [q("\\beta", b0, "mm")], find: ["\\beta'"] },
          hint: L("Use $\\beta = \\lambda D/d$ and see which factor changes.", "$\\beta = \\lambda D/d$ लीजिए और देखिए कौन-सा गुणक बदलता है।"),
          formula: "\\beta = \\dfrac{\\lambda D}{d}",
          solution: `$${K.s}$\n$\\beta' = ${en(b0)} \\cdot ${en(K.f)} = ${en(nb)}\\ \\text{mm}$`,
        });
      }
      if (v === 2) {
        const a = r.pick([0.1, 0.2, 0.25, 0.5]);
        const width = r.int(0, 1) === 1;
        const y1 = (lam * D) / (a * 1000);
        const ans = width ? 2 * y1 : y1;
        return task({
          text: L(`Light of wavelength ${lam} nm falls on a single slit of width ${en(a)} mm. The diffraction pattern is seen on a screen ${en(D)} m away. ${width ? "Find the width of the central maximum in mm." : "Find the distance of the first minimum from the centre of the pattern, in mm."}${RT(ans, 2, lang)}`, `${lam} nm तरंगदैर्घ्य का प्रकाश ${en(a)} mm चौड़ी एकल झिरी पर पड़ता है। विवर्तन प्रतिरूप ${en(D)} m दूर पर्दे पर देखा जाता है। ${width ? "केंद्रीय उच्चिष्ठ की चौड़ाई mm में ज्ञात कीजिए।" : "प्रतिरूप के केंद्र से प्रथम निम्निष्ठ की दूरी mm में ज्ञात कीजिए।"}${RT(ans, 2, lang)}`),
          answer: numM(ans, 2, width ? [[y1, L("The central maximum spans from the first minimum on one side to the first minimum on the other: $2\\lambda D/a$.", "केंद्रीय उच्चिष्ठ एक ओर के प्रथम निम्निष्ठ से दूसरी ओर के प्रथम निम्निष्ठ तक फैला है: $2\\lambda D/a$।")]] : [[2 * y1, L("$2\\lambda D/a$ is the full width of the central maximum; the first minimum is at half of it.", "$2\\lambda D/a$ केंद्रीय उच्चिष्ठ की पूरी चौड़ाई है; प्रथम निम्निष्ठ उसके आधे पर है।")]]),
          data: { given: [q("\\lambda", lam, "nm"), q("a", a, "mm"), q("D", D, "m")], find: [width ? "w" : "y_1"] },
          hint: L("First minimum of a single slit: $a\\sin\\theta = \\lambda$; for small angles $y = D\\theta$.", "एकल झिरी का प्रथम निम्निष्ठ: $a\\sin\\theta = \\lambda$; छोटे कोणों के लिए $y = D\\theta$।"),
          formula: width ? "w = \\dfrac{2\\lambda D}{a}" : "y_1 = \\dfrac{\\lambda D}{a}",
          solution: width
            ? `$y_1 = \\dfrac{${lam} \\times 10^{-9} \\cdot ${en(D)}}{${en(a)} \\times 10^{-3}} ${ev(y1, 4)}\\ \\text{mm}$\n$w = 2y_1 ${ev(ans, 2)}\\ \\text{mm}$`
            : `$y_1 = \\dfrac{${lam} \\times 10^{-9} \\cdot ${en(D)}}{${en(a)} \\times 10^{-3}}$\n$y_1 ${ev(ans, 2)}\\ \\text{mm}$`,
        });
      }
      const I0 = r.pick([16, 20, 32, 40, 60, 80]);
      const th = r.pick([30, 45, 60]);
      const I = (I0 / 2) * cos2(th);
      return task({
        text: L(`Unpolarised light of intensity ${I0} W/m² passes through two polaroids whose transmission axes are at ${th}° to each other. Find the intensity of the light that comes out, in W/m².`, `${I0} W/m² तीव्रता का अध्रुवित प्रकाश दो पोलेरॉइडों से गुजरता है जिनके संचरण अक्ष परस्पर ${th}° पर हैं। निर्गत प्रकाश की तीव्रता W/m² में ज्ञात कीजिए।`),
        answer: numM(I, 2, [[I0 * cos2(th), L("The first polaroid already halves unpolarised light.", "पहला पोलेरॉइड अध्रुवित प्रकाश की तीव्रता आधी कर देता है।")], [(I0 / 2) * Math.cos((th * Math.PI) / 180), L("Malus' law has $\\cos^2\\theta$.", "मैलस के नियम में $\\cos^2\\theta$ है।")]]),
        data: { given: [q("I_0", I0, "W/m^2"), q("\\theta", `${th}^\\circ`)], find: ["I"] },
        hint: L("The first polaroid passes half of unpolarised light; then apply Malus' law at the second.", "पहला पोलेरॉइड अध्रुवित प्रकाश का आधा भाग गुजारता है; फिर दूसरे पर मैलस का नियम लगाइए।"),
        formula: "I = \\dfrac{I_0}{2}\\cos^2\\theta",
        solution: `$I_1 = \\dfrac{${I0}}{2} = ${en(I0 / 2)}\\ \\text{W/m}^2$\n$I = ${en(I0 / 2)} \\cdot \\cos^2 ${th}^\\circ = ${en(I0 / 2)} \\cdot ${fx(cos2(th), 4)}$\n$I = ${en(I)}\\ \\text{W/m}^2$`,
      });
    }
    // level 3
    const v = r.int(0, 3);
    if (v === 0) {
      const m1 = r.pick([1, 2, 3]);
      const span = r.pick([5, 8, 10, 12]);
      const m2 = m1 + span;
      const x = tidy(span * beta);
      const lamC = (x * 1e-3 * d * 1e-3) / (span * D) * 1e9;
      return task({
        text: L(`In a double-slit experiment the slits are ${en(d)} mm apart and the screen is ${en(D)} m away. The distance between bright fringe number ${m1} and bright fringe number ${m2} (on the same side of the centre) is ${en(x)} mm. Find the wavelength in nm.`, `एक द्वि-झिरी प्रयोग में झिरियों के बीच दूरी ${en(d)} mm है और पर्दा ${en(D)} m दूर है। केंद्र के एक ही ओर ${ordHi(m1)} और ${ordHi(m2)} दीप्त फ्रिंज के बीच दूरी ${en(x)} mm है। तरंगदैर्घ्य nm में ज्ञात कीजिए।`),
        answer: numM(lamC, 0, [[(lamC * span) / m2, L(`Between fringes ${m1} and ${m2} there are ${m2} − ${m1} fringe widths.`, `${ordHi(m1)} और ${ordHi(m2)} फ्रिंज के बीच ${m2} − ${m1} फ्रिंज चौड़ाइयाँ हैं।`)], [(lamC * span) / (span + 1), L("Count the gaps between fringes, not the fringes themselves.", "फ्रिंजों के बीच के अंतराल गिनिए, फ्रिंज नहीं।")]]),
        data: { given: [q("d", d, "mm"), q("D", D, "m"), q("x", x, "mm")], find: ["\\lambda"] },
        hint: L("First find the fringe width from the given distance.", "पहले दी गई दूरी से फ्रिंज चौड़ाई ज्ञात कीजिए।"),
        formula: ["\\beta = \\dfrac{x}{n_2 - n_1}", "\\lambda = \\dfrac{\\beta d}{D}"],
        solution: `$\\beta = \\dfrac{${en(x)}}{${m2} - ${m1}} = ${en(x / span)}\\ \\text{mm}$\n$\\lambda = \\dfrac{${en(x / span)} \\times 10^{-3} \\cdot ${en(d)} \\times 10^{-3}}{${en(D)}} = ${en(lamC)} \\times 10^{-9}\\ \\text{m}$\n$\\lambda = ${en(lamC)}\\ \\text{nm}$`,
      });
    }
    if (v === 1) {
      const [l1, l2, k] = r.pick(COINC);
      const y = (k * l1 * D) / (d * 1000);
      const k2 = (k * l1) / l2;
      return task({
        text: L(`A beam containing two wavelengths, ${l1} nm and ${l2} nm, is used in a double-slit experiment with slit separation ${en(d)} mm and screen distance ${en(D)} m. Find the least distance from the central maximum at which bright fringes of both wavelengths coincide, in mm.${RT(y, 2, lang)}`, `${l1} nm और ${l2} nm, दो तरंगदैर्घ्यों वाला प्रकाश-पुंज एक द्वि-झिरी प्रयोग में प्रयुक्त है; झिरियों के बीच दूरी ${en(d)} mm और पर्दे की दूरी ${en(D)} m है। केंद्रीय उच्चिष्ठ से वह न्यूनतम दूरी mm में ज्ञात कीजिए जहाँ दोनों तरंगदैर्घ्यों के दीप्त फ्रिंज संपाती होते हैं।${RT(y, 2, lang)}`),
        answer: numM(y, 2, [[(l1 * D) / (d * 1000), L("Fringes of the two colours do not coincide at the first order; find $n_1\\lambda_1 = n_2\\lambda_2$.", "दोनों रंगों के फ्रिंज पहली कोटि पर संपाती नहीं होते; $n_1\\lambda_1 = n_2\\lambda_2$ ज्ञात कीजिए।")], [(k2 * l1 * D) / (d * 1000), L("Pair each order with its own wavelength: $n_1\\lambda_1 = n_2\\lambda_2$.", "हर कोटि को उसकी अपनी तरंगदैर्घ्य के साथ लीजिए: $n_1\\lambda_1 = n_2\\lambda_2$।")]]),
        data: { given: [q("\\lambda_1", l1, "nm"), q("\\lambda_2", l2, "nm"), q("d", d, "mm"), q("D", D, "m")], find: ["y"] },
        hint: L("Coincidence needs $n_1\\lambda_1 = n_2\\lambda_2$ with the smallest whole numbers.", "संपाती होने के लिए सबसे छोटी पूर्ण संख्याओं के साथ $n_1\\lambda_1 = n_2\\lambda_2$।"),
        formula: ["n_1\\lambda_1 = n_2\\lambda_2", "y = \\dfrac{n_1\\lambda_1 D}{d}"],
        solution: `$${k} \\cdot ${l1} = ${k2} \\cdot ${l2} = ${k * l1}\\ \\text{nm}$\n$y = \\dfrac{${k * l1} \\times 10^{-9} \\cdot ${en(D)}}{${en(d)} \\times 10^{-3}}$\n$y ${ev(y, 2)}\\ \\text{mm}$`,
      });
    }
    if (v === 2) {
      const I0 = r.pick([32, 40, 64, 80, 100]);
      const th = r.pick([30, 45, 60, 15]);
      const I = (I0 / 2) * cos2(th) * cos2(90 - th);
      return task({
        text: L(`Two polaroids P₁ and P₃ are crossed (axes at 90°). A third polaroid P₂ is placed between them with its axis at ${th}° to that of P₁. Unpolarised light of intensity ${I0} W/m² falls on P₁. Find the intensity coming out of P₃, in W/m².${RT(I, 2, lang)}`, `दो पोलेरॉइड P₁ और P₃ परस्पर लंबवत (अक्ष 90° पर) हैं। उनके बीच तीसरा पोलेरॉइड P₂ इस प्रकार रखा है कि उसका अक्ष P₁ के अक्ष से ${th}° पर है। ${I0} W/m² तीव्रता का अध्रुवित प्रकाश P₁ पर पड़ता है। P₃ से निर्गत तीव्रता W/m² में ज्ञात कीजिए।${RT(I, 2, lang)}`),
        answer: numM(I, 2, [[2 * I, L("Unpolarised light loses half its intensity at the first polaroid.", "अध्रुवित प्रकाश पहले पोलेरॉइड पर अपनी आधी तीव्रता खो देता है।")], [(I0 / 2) * cos2(th), L("Apply Malus' law again at P₃: the angle between P₂ and P₃ is $90^\\circ - \\theta$.", "P₃ पर फिर मैलस का नियम लगाइए: P₂ और P₃ के बीच कोण $90^\\circ - \\theta$ है।")]]),
        data: { given: [q("I_0", I0, "W/m^2"), q("\\theta", `${th}^\\circ`)], find: ["I_3"] },
        hint: L("Go step by step: after P₁, after P₂, after P₃.", "क्रम से चलिए: P₁ के बाद, P₂ के बाद, P₃ के बाद।"),
        formula: "I_3 = \\dfrac{I_0}{2}\\cos^2\\theta\\,\\cos^2(90^\\circ - \\theta)",
        solution: `$I_1 = \\dfrac{${I0}}{2} = ${en(I0 / 2)}$\n$I_2 = ${en(I0 / 2)} \\cdot \\cos^2 ${th}^\\circ ${ev((I0 / 2) * cos2(th), 4)}$\n$I_3 = I_2 \\cos^2 ${90 - th}^\\circ ${ev(I, 2)}\\ \\text{W/m}^2$`,
      });
    }
    const th = r.pick([30, 45, 60]);
    const s = Math.sin((th * Math.PI) / 180);
    const a = lam / s / 1000;
    return task({
      text: L(`In single-slit diffraction with light of wavelength ${lam} nm, the first minimum is observed at an angle of ${th}° from the central direction. Find the slit width in μm.${RT(a, 3, lang)}`, `${lam} nm तरंगदैर्घ्य के प्रकाश से एकल झिरी विवर्तन में प्रथम निम्निष्ठ केंद्रीय दिशा से ${th}° के कोण पर दिखता है। झिरी की चौड़ाई μm में ज्ञात कीजिए।${RT(a, 3, lang)}`),
      answer: numM(a, 3, [[(lam * s) / 1000, L("From $a\\sin\\theta = \\lambda$, divide by $\\sin\\theta$.", "$a\\sin\\theta = \\lambda$ से $\\sin\\theta$ से भाग दीजिए।")], [lam / Math.cos((th * Math.PI) / 180) / 1000, L("The condition uses $\\sin\\theta$, not $\\cos\\theta$.", "प्रतिबंध में $\\sin\\theta$ आता है, $\\cos\\theta$ नहीं।")], [(2 * lam) / s / 1000, L("The first minimum is at $a\\sin\\theta = \\lambda$, not $2\\lambda$.", "प्रथम निम्निष्ठ $a\\sin\\theta = \\lambda$ पर है, $2\\lambda$ पर नहीं।")]]),
      data: { given: [q("\\lambda", lam, "nm"), q("\\theta", `${th}^\\circ`)], find: ["a"] },
      hint: L("The angle is large, so use the exact condition with $\\sin\\theta$.", "कोण बड़ा है, इसलिए $\\sin\\theta$ वाला यथार्थ प्रतिबंध लीजिए।"),
      formula: "a\\sin\\theta = \\lambda",
      solution: `$a = \\dfrac{\\lambda}{\\sin ${th}^\\circ} = \\dfrac{${lam}}{${en(s, 4)}} ${ev(lam / s, 1)}\\ \\text{nm}$\n$a ${ev(a, 3)}\\ \\mu\\text{m}$`,
    });
  },
};

export const EXAM_GAP_FIZ = [exgUnits, exgDensity, exgFluids, exgElasticity, exgWaveOptics];
