// Naloge za teme drugih državnih izpitov, ki jih banka še ni imela (angleško in hindijsko):
// Pakistan, Bangladeš, Nepal, Šrilanka, Egipt, Malezija, Vietnam, Koreja, Japonska, Vzhodna Afrika, IB, A-level.
// Vsak generator ima langs: ["en", "hi"] in gen(level, r, topic, lang); besedila z L = bi(lang).
// Vse naključne izbire so pred izbiro besedil (isto seme → ista naloga v obeh jezikih).
import { en, numM, task, choiceWhy, bi, roundToL, fracTex, fractionM, nCr, poly } from "./exam-util.js";
import { gcd } from "../check.js";

const T = (slug) => `MAT-EXB/${slug}`;
const R = String.raw;
// Rešitev: vrstice, združene z novo vrstico (prazne izpustimo).
const S = (...lines) => lines.filter((x) => x !== "" && x != null && x !== false).join("\n");
const r2 = (v) => Math.round(v * 100) / 100;
const isEx = (v) => Math.abs(v * 100 - Math.round(v * 100)) < 1e-6;
// Številski odgovor: točen, če ima največ 2 decimalki, sicer zaokrožen na 2.
const ansN = (v, list = []) => (isEx(v) ? numM(r2(v), null, list) : numM(v, 2, list));
const rnd = (v, lang) => (isEx(v) ? "" : roundToL(2, lang));
const f2 = (v) => (isEx(v) ? en(r2(v)) : en(v, 2));
const eqs = (v) => (isEx(v) ? "=" : R`\approx`);
// Vmesni rezultat na 4 decimalke: točen zapis ali »≈«.
const ex4 = (v) => Math.abs(v * 1e4 - Math.round(v * 1e4)) < 1e-6;
const f4 = (v) => (ex4(v) ? en(Math.round(v * 1e4) / 1e4) : en(v, 4));
const eq4 = (v) => (ex4(v) ? "=" : R`\approx`);
const lcm = (a, b) => (a / gcd(a, b)) * b;
const pm = (v) => (v < 0 ? `(${en(v)})` : en(v));
// Hindijska rešitev mora imeti vsaj eno vrstico besedila (ne samo formule).
const taskL = (lang, o) => {
  if (lang === "hi" && !/[ऀ-ॿ]/.test(String(o.solution).replace(/\$[^$]*\$/g, ""))) o.solution = "हल:\n" + o.solution;
  return task(o);
};
const CITIES = [
  ["Lahore", "लाहौर"], ["Dhaka", "ढाका"], ["Kathmandu", "काठमांडू"], ["Colombo", "कोलंबो"], ["Cairo", "काहिरा"], ["Kuala Lumpur", "कुआलालंपुर"],
  ["Hanoi", "हनोई"], ["Seoul", "सियोल"], ["Osaka", "ओसाका"], ["Nairobi", "नैरोबी"], ["Kampala", "कंपाला"], ["Delhi", "दिल्ली"],
];
const COUNTRIES = [
  ["Kenya", "केन्या"], ["Uganda", "युगांडा"], ["Tanzania", "तंज़ानिया"], ["Nepal", "नेपाल"], ["Bangladesh", "बांग्लादेश"],
  ["Sri Lanka", "श्रीलंका"], ["Pakistan", "पाकिस्तान"], ["Vietnam", "वियतनाम"], ["Egypt", "मिस्र"], ["Malaysia", "मलेशिया"],
];

// ───────────────────────── Sets ─────────────────────────
const LIKES = [["cricket", "क्रिकेट"], ["football", "फ़ुटबॉल"], ["badminton", "बैडमिंटन"], ["chess", "शतरंज"], ["music", "संगीत"], ["dance", "नृत्य"], ["tea", "चाय"], ["coffee", "कॉफ़ी"]];
const TRIPLES = [
  { s: ["P", "C", "M"], en: ["Physics", "Chemistry", "Mathematics"], hi: ["भौतिकी", "रसायन विज्ञान", "गणित"], ven: "study", vhi: "पढ़ने वाले" },
  { s: ["C", "F", "H"], en: ["cricket", "football", "hockey"], hi: ["क्रिकेट", "फ़ुटबॉल", "हॉकी"], ven: "play", vhi: "खेलने वाले" },
  { s: ["E", "F", "A"], en: ["English", "French", "Arabic"], hi: ["अंग्रेज़ी", "फ़्रांसीसी", "अरबी"], ven: "speak", vhi: "बोलने वाले" },
];
const OWN = [["a radio", "रेडियो"], ["a mobile phone", "मोबाइल फ़ोन"], ["a bicycle", "साइकिल"], ["a television", "टेलीविज़न"], ["a motorcycle", "मोटरसाइकिल"]];
const FPAIRS = [[12, 18], [16, 24], [20, 30], [18, 27], [24, 36], [28, 42], [30, 45], [15, 20], [36, 48], [12, 20], [18, 30]];
const factors = (n) => {
  const o = [];
  for (let i = 1; i <= n; i++) if (n % i === 0) o.push(i);
  return o;
};
const setTex = (a) => R`\{${a.join(", ")}\}`;
const MULT = [[2, 3], [3, 5], [4, 6], [6, 8], [4, 10], [6, 9], [5, 7], [3, 7], [10, 15], [4, 5], [6, 10]];
const FU = R`n(A \cup B) = n(A) + n(B) - n(A \cap B)`;
const FU3 = R`n(A \cup B \cup C) = \sum n(A) - \sum n(A \cap B) + n(A \cap B \cap C)`;

// ───────────────────────── Logic ─────────────────────────
const TT = R`\text{T}`, FF = R`\text{F}`;
const tv = (b) => (b ? TT : FF);
// Sestavljeni izjavi s p in q: [LaTeX(p, q), vrednost(p, q)].
const ST2 = [
  [(p, q) => R`${p} \land ${q}`, (p, q) => p && q],
  [(p, q) => R`${p} \lor ${q}`, (p, q) => p || q],
  [(p, q) => R`${p} \Rightarrow ${q}`, (p, q) => !p || q],
  [(p, q) => R`${p} \Leftrightarrow ${q}`, (p, q) => p === q],
  [(p, q) => R`\sim ${p} \land ${q}`, (p, q) => !p && q],
  [(p, q) => R`${p} \land \sim ${q}`, (p, q) => p && !q],
  [(p, q) => R`\sim ${p} \lor ${q}`, (p, q) => !p || q],
  [(p, q) => R`\sim (${p} \lor ${q})`, (p, q) => !(p || q)],
  [(p, q) => R`\sim (${p} \land ${q})`, (p, q) => !(p && q)],
  [(p, q) => R`${q} \Rightarrow ${p}`, (p, q) => !q || p],
  [(p, q) => R`\sim ${p} \Rightarrow ${q}`, (p, q) => p || q],
  [(p, q) => R`${p} \lor \sim ${q}`, (p, q) => p || !q],
];
// Trditve z znano resničnostjo (za p in q v besedilu).
const STMT = [
  ["7 is a prime number", "7 एक अभाज्य संख्या है", true],
  [R`the sum of the angles of a triangle is $180^\circ$`, R`त्रिभुज के कोणों का योग $180^\circ$ होता है`, true],
  ["every rectangle is a parallelogram", "प्रत्येक आयत एक समांतर चतुर्भुज है", true],
  ["64 is a perfect cube", "64 एक पूर्ण घन है", true],
  [R`$3^2 + 4^2 = 5^2$`, R`$3^2 + 4^2 = 5^2$`, true],
  [R`$\sqrt{2}$ is a rational number`, R`$\sqrt{2}$ एक परिमेय संख्या है`, false],
  ["9 is a prime number", "9 एक अभाज्य संख्या है", false],
  ["every prime number is odd", "प्रत्येक अभाज्य संख्या विषम होती है", false],
  ["15 is divisible by 4", "15, 4 से विभाज्य है", false],
  [R`$2^5 = 25$`, R`$2^5 = 25$`, false],
];
// Negacije in kontrapozicija: [vprašanje EN, HI, pravilno, [[napačno, zakaj EN, zakaj HI], …]].
// Izvirna izjava in pravilni odgovor kot funkciji (za rešitev s tabelo resničnosti); zadnja je kontrapozicija.
const NEG_F = [
  [(P, Q) => P && Q, (P, Q) => !P || !Q],
  [(P, Q) => P || Q, (P, Q) => !P && !Q],
  [(P, Q) => !P || Q, (P, Q) => P && !Q],
  [(P, Q) => P === Q, (P, Q) => P !== Q],
  [(P, Q) => !P || Q, (P, Q) => Q || !P],
];
const NEG_S = [R`p \land q`, R`p \lor q`, R`p \Rightarrow q`, R`p \Leftrightarrow q`, R`p \Rightarrow q`];
const NEG = [
  [R`the negation of $p \land q$`, R`$p \land q$ का निषेधन`, R`\sim p \lor \sim q`, [
    [R`\sim p \land \sim q`, "De Morgan's law: negating ∧ turns it into ∨.", "दे मॉर्गन नियम: ∧ का निषेधन करने पर वह ∨ बन जाता है।"],
    [R`p \lor q`, "Each simple statement must be negated as well.", "प्रत्येक सरल कथन का भी निषेधन करना होता है।"],
    [R`\sim p \land q`, "Only one part is negated and ∧ is unchanged.", "यहाँ केवल एक घटक का निषेधन हुआ है और ∧ नहीं बदला।"],
  ]],
  [R`the negation of $p \lor q$`, R`$p \lor q$ का निषेधन`, R`\sim p \land \sim q`, [
    [R`\sim p \lor \sim q`, "De Morgan's law: negating ∨ turns it into ∧.", "दे मॉर्गन नियम: ∨ का निषेधन करने पर वह ∧ बन जाता है।"],
    [R`p \land q`, "Each simple statement must be negated as well.", "प्रत्येक सरल कथन का भी निषेधन करना होता है।"],
    [R`\sim p \lor q`, "Only one part is negated and ∨ is unchanged.", "यहाँ केवल एक घटक का निषेधन हुआ है और ∨ नहीं बदला।"],
  ]],
  [R`the negation of $p \Rightarrow q$`, R`$p \Rightarrow q$ का निषेधन`, R`p \land \sim q`, [
    [R`\sim p \Rightarrow \sim q`, "This is the inverse. An implication is false only when p is true and q is false.", "यह प्रतिलोम है। सप्रतिबंध कथन तभी असत्य होता है जब p सत्य और q असत्य हो।"],
    [R`q \Rightarrow p`, "This is the converse, not the negation.", "यह विलोम है, निषेधन नहीं।"],
    [R`\sim p \land q`, "An implication fails when p is true and q is false, not the other way round.", "सप्रतिबंध कथन तब असत्य होता है जब p सत्य और q असत्य हो, उलटा नहीं।"],
  ]],
  [R`the negation of $p \Leftrightarrow q$`, R`$p \Leftrightarrow q$ का निषेधन`, R`(p \land \sim q) \lor (\sim p \land q)`, [
    [R`\sim p \Leftrightarrow \sim q`, "This has the same truth value as p ⇔ q in every row.", "प्रत्येक पंक्ति में इसका सत्यता मान p ⇔ q के समान ही है।"],
    [R`(p \land q) \lor (\sim p \land \sim q)`, "This is true exactly when p and q agree, so it equals p ⇔ q itself.", "यह ठीक तब सत्य है जब p और q समान हों, अतः यह स्वयं p ⇔ q है।"],
    [R`p \Rightarrow \sim q`, "Check p and q both false: this is true but p ⇔ q is also true.", "p और q दोनों असत्य लेकर देखिए: यह सत्य है और p ⇔ q भी सत्य है।"],
  ]],
  [R`the contrapositive of $p \Rightarrow q$`, R`$p \Rightarrow q$ का प्रतिधनात्मक कथन`, R`\sim q \Rightarrow \sim p`, [
    [R`q \Rightarrow p`, "This is the converse: the parts are swapped but not negated.", "यह विलोम है: घटक बदले गए हैं पर उनका निषेधन नहीं हुआ।"],
    [R`\sim p \Rightarrow \sim q`, "This is the inverse: the parts are negated but not swapped.", "यह प्रतिलोम है: घटकों का निषेधन हुआ है पर वे बदले नहीं गए।"],
    [R`p \land \sim q`, "This is the negation of the implication.", "यह सप्रतिबंध कथन का निषेधन है।"],
  ]],
];
const TAUT = [
  [R`(p \land q) \Rightarrow p`, (p, q) => !(p && q) || p],
  [R`p \Rightarrow (p \lor q)`, (p, q) => !p || p || q],
  [R`(p \Rightarrow q) \Leftrightarrow (\sim q \Rightarrow \sim p)`, (p, q) => (!p || q) === (q || !p)],
  [R`\sim (p \land q) \Leftrightarrow (\sim p \lor \sim q)`, (p, q) => !(p && q) === (!p || !q)],
  [R`(p \land (p \Rightarrow q)) \Rightarrow q`, (p, q) => !(p && (!p || q)) || q],
];
const NONTAUT = [
  [R`p \Rightarrow (p \land q)`, (p, q) => !p || (p && q)],
  [R`(p \lor q) \Rightarrow p`, (p, q) => !(p || q) || p],
  [R`(p \Rightarrow q) \Leftrightarrow (q \Rightarrow p)`, (p, q) => (!p || q) === (!q || p)],
  [R`\sim (p \land q) \Leftrightarrow (\sim p \land \sim q)`, (p, q) => !(p && q) === (!p && !q)],
  [R`(p \Rightarrow q) \Rightarrow q`, (p, q) => !(!p || q) || q],
  [R`p \land \sim p`, (p) => p && !p],
  [R`(p \lor q) \Rightarrow (p \land q)`, (p, q) => !(p || q) || (p && q)],
];
const ST3 = [
  [R`(p \Rightarrow q) \land (q \Rightarrow r)`, (p, q, r) => (!p || q) && (!q || r)],
  [R`(p \lor q) \Rightarrow r`, (p, q, r) => !(p || q) || r],
  [R`(p \land q) \lor \sim r`, (p, q, r) => (p && q) || !r],
  [R`p \Rightarrow (q \lor r)`, (p, q, r) => !p || q || r],
  [R`(p \Leftrightarrow q) \lor r`, (p, q, r) => p === q || r],
  [R`\sim p \lor (q \land r)`, (p, q, r) => !p || (q && r)],
  [R`(p \land \sim q) \Rightarrow r`, (p, q, r) => !(p && !q) || r],
  [R`(p \lor q) \land \sim r`, (p, q, r) => (p || q) && !r],
  [R`(p \Rightarrow r) \land (q \Rightarrow r)`, (p, q, r) => (!p || r) && (!q || r)],
  [R`p \land (q \lor r)`, (p, q, r) => p && (q || r)],
];
const ROWS2 = [[true, true], [true, false], [false, true], [false, false]];

// ───────────────────────── Dispersion ─────────────────────────
const DCTX = [
  { en: (n) => `the masses (in g) of ${n} mangoes from Multan`, hi: (n) => `मुलतान के ${n} आमों के द्रव्यमान (g में)`, lo: 180, hi_: 320 },
  { en: (n) => `the daily rainfall (in mm) in Colombo on ${n} days`, hi: (n) => `कोलंबो में ${n} दिनों की दैनिक वर्षा (mm में)`, lo: 2, hi_: 40 },
  { en: (n) => `the marks of ${n} students in Dhaka in a test`, hi: (n) => `ढाका के ${n} विद्यार्थियों के एक परीक्षा में प्राप्तांक`, lo: 20, hi_: 95 },
  { en: (n) => `the times (in minutes) taken by ${n} runners in Nairobi to finish a race`, hi: (n) => `नैरोबी में ${n} धावकों द्वारा एक दौड़ पूरी करने में लिया गया समय (मिनट में)`, lo: 25, hi_: 48 },
  { en: (n) => `the numbers of passengers on ${n} buses in Hanoi`, hi: (n) => `हनोई में ${n} बसों में यात्रियों की संख्या`, lo: 12, hi_: 60 },
  { en: (n) => `the heights (in cm) of ${n} seedlings in a school garden in Kathmandu`, hi: (n) => `काठमांडू के एक विद्यालय-उद्यान में ${n} पौधों की ऊँचाइयाँ (cm में)`, lo: 8, hi_: 30 },
];
const FCTX = [
  ["the number of children in each of", "families in a village in Bangladesh", "बांग्लादेश के एक गाँव के", "परिवारों में बच्चों की संख्या"],
  ["the number of goals scored in each of", "football matches in Cairo", "काहिरा में खेले गए", "फ़ुटबॉल मैचों में किए गए गोलों की संख्या"],
  ["the number of books read last month by each of", "students in Seoul", "सियोल के", "विद्यार्थियों द्वारा पिछले महीने पढ़ी गई पुस्तकों की संख्या"],
  ["the number of eggs laid in a week by each of", "hens on a farm in Uganda", "युगांडा के एक फ़ार्म की", "मुर्गियों द्वारा एक सप्ताह में दिए गए अंडों की संख्या"],
];
const sum = (a) => a.reduce((s, x) => s + x, 0);
const sortN = (a) => [...a].sort((x, y) => x - y);
const IQR_NOTE = (L) => L(" (Take $Q_1$ and $Q_3$ as the medians of the lower and upper halves; the median itself is in neither half.)", " ($Q_1$ और $Q_3$ को क्रमशः निचले और ऊपरी आधे आँकड़ों की माध्यिका लीजिए; माध्यिका स्वयं किसी भी आधे में शामिल नहीं है।)");
const FVAR = R`\sigma^2 = \frac{\sum (x - \bar{x})^2}{n}`;
const FVAR2 = R`\sigma^2 = \frac{\sum x^2}{n} - \bar{x}^2`;

// ───────────────────────── Normal ─────────────────────────
const Phi = (z) => {
  const x = z / Math.SQRT2;
  let t = x, s = x;
  for (let n = 1; n < 150; n++) {
    t *= (-x * x) / n;
    s += t / (2 * n + 1);
  }
  return 0.5 * (1 + (2 / Math.sqrt(Math.PI)) * s);
};
const P4 = (z) => Math.round(Phi(z) * 1e4) / 1e4;
const r4 = (v) => Math.round(v * 1e4) / 1e4;
const ZS = [0.4, 0.5, 0.6, 0.75, 0.8, 1, 1.2, 1.25, 1.4, 1.5, 1.6, 1.75, 1.8, 2, 2.2, 2.25, 2.4, 2.5];
// Repne verjetnosti: [p, z z Φ(z) = 1 − p] (z na 4 decimalke).
const INV = [[0.1, 1.2816], [0.05, 1.6449], [0.2, 0.8416], [0.15, 1.0364], [0.3, 0.5244], [0.025, 1.96], [0.01, 2.3263], [0.25, 0.6745]];
const NCTX = [
  { en: "The heights of adult men in a city in Vietnam", hi: "वियतनाम के एक शहर के वयस्क पुरुषों की ऊँचाइयाँ", u: "cm", mu: [160, 172, 1], sig: [5, 6, 8, 10] },
  { en: "The masses of mangoes from an orchard in Multan", hi: "मुलतान के एक बाग़ के आमों के द्रव्यमान", u: "g", mu: [220, 300, 10], sig: [20, 25, 30, 40] },
  { en: "The lifetimes of LED bulbs made in a factory in Malaysia", hi: "मलेशिया के एक कारख़ाने में बने LED बल्बों के जीवनकाल", u: "h", mu: [800, 1200, 50], sig: [40, 50, 60, 80, 100] },
  { en: "The times taken by students in Seoul to travel to school", hi: "सियोल में विद्यार्थियों द्वारा विद्यालय पहुँचने में लगे समय", u: "min", mu: [25, 40, 1], sig: [4, 5, 6, 8] },
  { en: "The marks in a national examination in Egypt", hi: "मिस्र की एक राष्ट्रीय परीक्षा के प्राप्तांक", u: "", mu: [50, 65, 1], sig: [8, 10, 12, 15] },
  { en: "The daily milk yields of cows on a farm in Kenya", hi: "केन्या के एक फ़ार्म की गायों के दैनिक दूध उत्पादन", u: "L", mu: [15, 22, 1], sig: [2, 3, 4] },
];
const pickMu = (r, [a, b, s]) => a + s * r.int(0, Math.round((b - a) / s));
const PhiTex = (z) => R`\Phi(${en(z)}) = ${en(P4(z), 4)}`;
const FZ = R`z = \frac{x - \mu}{\sigma}`;

// ───────────────────────── Conics ─────────────────────────
// Elipsa: [a, b, c], a² = b² + c²; hiperbola: [a, b, c], c² = a² + b².
const ELL = [[5, 3, 4], [5, 4, 3], [10, 6, 8], [10, 8, 6], [13, 12, 5], [13, 5, 12], [17, 15, 8], [17, 8, 15], [25, 7, 24], [25, 24, 7]];
const ELL25 = [[5, 3, 4], [5, 4, 3], [10, 6, 8], [10, 8, 6], [20, 12, 16], [20, 16, 12], [25, 7, 24], [25, 24, 7], [25, 15, 20], [25, 20, 15]];
const HYP = [[4, 3, 5], [3, 4, 5], [12, 5, 13], [5, 12, 13], [8, 6, 10], [6, 8, 10], [15, 8, 17], [8, 15, 17], [24, 7, 25], [7, 24, 25]];
const fx = (n, d) => fracTex(n, d);
const decOrFrac = (n, d) => {
  const [a, b] = [n / gcd(n, d), d / gcd(n, d)];
  let k = b;
  while (k % 2 === 0) k /= 2;
  while (k % 5 === 0) k /= 5;
  return k === 1 ? en(a / b) : fx(a, b);
};

// ───────────────────────── Binomial ─────────────────────────
const pw = (b, e) => (e === 1 ? b : `${b}^{${e}}`);

// ───────────────────────── Correlation ─────────────────────────
// Konteksti s predznakom povezave (+1 / −1), da se smer ujema s stvarnostjo.
const CCTX = [
  ["hours of study (x)", "test mark (y)", "अध्ययन के घंटे (x)", "परीक्षा के अंक (y)", 1],
  ["daily maximum temperature in °C (x)", "ice creams sold (y)", "दैनिक अधिकतम तापमान °C में (x)", "बिकी आइसक्रीम (y)", 1],
  ["rainfall in cm (x)", "rice yield in quintals (y)", "वर्षा cm में (x)", "धान की उपज क्विंटल में (y)", 1],
  ["advertising spend in thousands of rupees (x)", "sales in lakhs of rupees (y)", "विज्ञापन व्यय हज़ार रुपयों में (x)", "बिक्री लाख रुपयों में (y)", 1],
  ["age of a car in years (x)", "price in thousands of ringgit (y)", "कार की आयु वर्षों में (x)", "मूल्य हज़ार रिंगिट में (y)", -1],
  ["altitude in hundreds of metres (x)", "temperature in °C (y)", "ऊँचाई सौ मीटर में (x)", "तापमान °C में (y)", -1],
];
const FR = R`r = \frac{S_{xy}}{\sqrt{S_{xx} S_{yy}}}`;
const FS = R`S_{xy} = \sum xy - \frac{\sum x \sum y}{n},\ S_{xx} = \sum x^2 - \frac{(\sum x)^2}{n}`;
const r3 = (v) => Math.round(v * 1000) / 1000;
// Pari naklonov regresijskih premic [b_yx, b_xy] kot ulomki (r² = b_yx b_xy).
const SLOPES = [[[4, 5], [4, 5]], [[2, 3], [3, 8]], [[1, 2], [1, 2]], [[3, 2], [3, 8]], [[6, 5], [3, 10]], [[2, 5], [8, 5]], [[9, 10], [9, 10]], [[3, 4], [1, 3]], [[1, 4], [1, 4]], [[8, 5], [2, 5]]];

// ───────────────────────── Circles ─────────────────────────
const dg = (x) => `${x}^\\circ`;
const ang = (n, x) => R`\angle ${n} = ${x}^\circ`;

export const EXAM_GAP_MAT = [
  // ───────────────────────── Sets: Venn diagrams and counting ─────────────────────────
  {
    id: "exg-mat-sets",
    topics: [T("sets-and-logic")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const cityP = r.pick(CITIES);
      const C = L(cityP[0], cityP[1]);
      if (level === 1) {
        const v = r.int(0, 2);
        if (v <= 1) {
          const [i, j] = r.shuffle([0, 1, 2, 3, 4, 5, 6, 7]).slice(0, 2);
          const X = L(...LIKES[i]), Y = L(...LIKES[j]);
          const c = r.int(4, 18), a = c + r.int(6, 30), b = c + r.int(6, 30), h = r.int(3, 15);
          if (v === 0) {
            const N = a + b - c + h, u = a + b - c;
            return taskL(lang, {
              text: L(
                `In a survey of ${N} students in ${C}, ${a} like ${X}, ${b} like ${Y} and ${c} like both. How many students like neither?`,
                `${C} में ${N} विद्यार्थियों के एक सर्वेक्षण में ${a} को ${X} पसंद है, ${b} को ${Y} पसंद है और ${c} को दोनों पसंद हैं। कितने विद्यार्थियों को इनमें से कोई भी पसंद नहीं है?`,
              ),
              answer: numM(h, null, [
                [N - a - b, L(R`The students who like both were subtracted twice; add $n(A \cap B)$ back.`, R`दोनों पसंद करने वाले विद्यार्थी दो बार घटाए गए हैं; $n(A \cap B)$ वापस जोड़िए।`)],
                [u, L(R`This is $n(A \cup B)$, those who like at least one; subtract it from the total.`, R`यह $n(A \cup B)$ है, यानी कम से कम एक पसंद करने वाले; इसे कुल संख्या से घटाइए।`)],
              ]),
              data: { given: [`n(U) = ${N}`, `n(A) = ${a}`, `n(B) = ${b}`, R`n(A \cap B) = ${c}`], find: [R`n((A \cup B)')`] },
              hint: L("First find how many like at least one of the two (the union).", "पहले ज्ञात कीजिए कि कितनों को दोनों में से कम से कम एक पसंद है (सम्मिलन)।"),
              formula: FU,
              solution: S(
                L(`Let A = students who like ${X}, B = students who like ${Y}.`, `मान लीजिए A = ${X} पसंद करने वाले, B = ${Y} पसंद करने वाले विद्यार्थी।`),
                R`$n(A \cup B) = ${a} + ${b} - ${c} = ${u}$`,
                R`$n((A \cup B)') = ${N} - ${u} = ${h}$`,
                L(`${h} students like neither.`, `${h} विद्यार्थियों को इनमें से कोई भी पसंद नहीं है।`),
              ),
            });
          }
          const N = a + b - c;
          return taskL(lang, {
            text: L(
              `Each of the ${N} members of a club in ${C} likes ${X} or ${Y} (or both). If ${a} like ${X} and ${b} like ${Y}, how many members like both?`,
              `${C} के एक क्लब के सभी ${N} सदस्यों को ${X} या ${Y} (या दोनों) पसंद हैं। यदि ${a} को ${X} और ${b} को ${Y} पसंद है, तो कितने सदस्यों को दोनों पसंद हैं?`,
            ),
            answer: numM(c, null, [
              [N - a, L(`$N - n(A)$ counts only those who like ${Y} but not ${X}.`, `$N - n(A)$ केवल उन्हें गिनता है जिन्हें ${Y} पसंद है पर ${X} नहीं।`)],
              [N - b, L(`$N - n(B)$ counts only those who like ${X} but not ${Y}.`, `$N - n(B)$ केवल उन्हें गिनता है जिन्हें ${X} पसंद है पर ${Y} नहीं।`)],
            ]),
            data: { given: [R`n(A \cup B) = ${N}`, `n(A) = ${a}`, `n(B) = ${b}`], find: [R`n(A \cap B)`] },
            hint: L("Everybody is in the union. Use the addition formula for two sets and solve for the intersection.", "सभी सदस्य सम्मिलन में हैं। दो समुच्चयों का सूत्र लगाकर सर्वनिष्ठ के लिए हल कीजिए।"),
            formula: FU,
            solution: S(
              L(`A = likes ${X}, B = likes ${Y}; everybody is in $A \\cup B$.`, `A = ${X} पसंद, B = ${Y} पसंद; सभी $A \\cup B$ में हैं।`),
              R`$n(A \cap B) = n(A) + n(B) - n(A \cup B)$`,
              R`$n(A \cap B) = ${a} + ${b} - ${N} = ${c}$`,
              L(`${c} members like both.`, `${c} सदस्यों को दोनों पसंद हैं।`),
            ),
          });
        }
        const [m, n] = r.pick(FPAIRS);
        const A = factors(m), B = factors(n), I = A.filter((x) => B.includes(x));
        const u = A.length + B.length - I.length;
        return taskL(lang, {
          text: L(
            `A is the set of factors of ${m} and B is the set of factors of ${n}. Find $n(A \\cup B)$.`,
            `A, ${m} के गुणनखंडों का समुच्चय है और B, ${n} के गुणनखंडों का समुच्चय है। $n(A \\cup B)$ ज्ञात कीजिए।`,
          ),
          answer: numM(u, null, [
            [A.length + B.length, L("The common factors were counted twice; subtract $n(A \\cap B)$.", "उभयनिष्ठ गुणनखंड दो बार गिने गए हैं; $n(A \\cap B)$ घटाइए।")],
            [I.length, L("That is $n(A \\cap B)$, the common factors only.", "यह $n(A \\cap B)$ है, केवल उभयनिष्ठ गुणनखंड।")],
          ]),
          hint: L("List both sets, then count each element of the union only once.", "दोनों समुच्चयों को सूचीबद्ध कीजिए और सम्मिलन के प्रत्येक अवयव को केवल एक बार गिनिए।"),
          formula: FU,
          solution: S(
            `$A = ${setTex(A)}$, $n(A) = ${A.length}$`,
            `$B = ${setTex(B)}$, $n(B) = ${B.length}$`,
            R`$A \cap B = ${setTex(I)}$, $n(A \cap B) = ${I.length}$`,
            R`$n(A \cup B) = ${A.length} + ${B.length} - ${I.length} = ${u}$`,
            L(`The union has ${u} elements.`, `सम्मिलन में ${u} अवयव हैं।`),
          ),
        });
      }
      if (level === 2) {
        const v = r.int(0, 2);
        if (v === 0) {
          const [i, j] = r.shuffle([0, 1, 2, 3, 4, 5, 6, 7]).slice(0, 2);
          const X = L(...LIKES[i]), Y = L(...LIKES[j]);
          let x, y, z, both;
          do {
            x = r.int(8, 16) * 5;
            y = r.int(6, 14) * 5;
            z = r.int(1, 4) * 5;
            both = x + y - (100 - z);
          } while (both <= 0 || both >= Math.min(x, y));
          return taskL(lang, {
            text: L(
              `In a survey in ${C}, ${x}% of people like ${X}, ${y}% like ${Y} and ${z}% like neither. What percentage of people like both?`,
              `${C} में एक सर्वेक्षण में ${x}% लोगों को ${X} पसंद है, ${y}% को ${Y} पसंद है और ${z}% को इनमें से कोई भी पसंद नहीं है। कितने प्रतिशत लोगों को दोनों पसंद हैं?`,
            ),
            answer: numM(both, null, [
              [x + y - 100, L("You forgot the people who like neither: the union is not 100%.", "आप उन लोगों को भूल गए जिन्हें कोई भी पसंद नहीं है: सम्मिलन 100% नहीं है।")],
              [100 - z, L("That is the percentage who like at least one, $n(A \\cup B)$.", "यह कम से कम एक पसंद करने वालों का प्रतिशत $n(A \\cup B)$ है।")],
            ]),
            data: { given: [`n(A) = ${x}\\%`, `n(B) = ${y}\\%`, `n((A \\cup B)') = ${z}\\%`], find: [R`n(A \cap B)`] },
            hint: L("Work in percentages of 100. Find the union first from the 'neither' group.", "100 में प्रतिशत लेकर चलिए। पहले 'कोई भी नहीं' वाले समूह से सम्मिलन ज्ञात कीजिए।"),
            formula: FU,
            solution: S(
              R`$n(A \cup B) = 100\% - ${z}\% = ${100 - z}\%$`,
              R`$n(A \cap B) = n(A) + n(B) - n(A \cup B)$`,
              R`$n(A \cap B) = ${x} + ${y} - ${100 - z} = ${both}\%$`,
              L(`${both}% of people like both.`, `${both}% लोगों को दोनों पसंद हैं।`),
            ),
          });
        }
        if (v === 1) {
          const [a, b] = r.pick(MULT);
          const N = r.int(10, 40) * 5;
          const l = lcm(a, b), na = Math.floor(N / a), nb = Math.floor(N / b), nl = Math.floor(N / l);
          const u = na + nb - nl, ans = N - u;
          return taskL(lang, {
            text: L(
              `How many integers from 1 to ${N} are divisible by neither ${a} nor ${b}?`,
              `1 से ${N} तक के कितने पूर्णांक न तो ${a} से और न ही ${b} से विभाज्य हैं?`,
            ),
            answer: numM(ans, null, [
              [N - na - nb, L(`Numbers divisible by both were subtracted twice; add back the multiples of ${l}.`, `दोनों से विभाज्य संख्याएँ दो बार घटाई गई हैं; ${l} के गुणज वापस जोड़िए।`)],
              [N - (na + nb - Math.floor(N / (a * b))), L(`Divisible by both ${a} and ${b} means divisible by their LCM, not by their product.`, `${a} और ${b} दोनों से विभाज्य का अर्थ है उनके LCM से विभाज्य, गुणनफल से नहीं।`)],
              [u, L("That counts the numbers divisible by at least one; subtract it from the total.", "यह कम से कम एक से विभाज्य संख्याएँ हैं; इसे कुल से घटाइए।")],
            ]),
            data: { given: [`n(U) = ${N}`], find: [R`n((A \cup B)')`] },
            hint: L(`Let A = multiples of ${a} and B = multiples of ${b}. Numbers in both are the multiples of the LCM.`, `मान लीजिए A = ${a} के गुणज और B = ${b} के गुणज। दोनों में आने वाली संख्याएँ LCM के गुणज हैं।`),
            formula: FU,
            solution: S(
              L(`A = multiples of ${a}, B = multiples of ${b}, $A \\cap B$ = multiples of LCM$(${a}, ${b}) = ${l}$.`, `A = ${a} के गुणज, B = ${b} के गुणज, $A \\cap B$ = LCM$(${a}, ${b}) = ${l}$ के गुणज।`),
              R`$n(A) = \left\lfloor \frac{${N}}{${a}} \right\rfloor = ${na}$, $n(B) = \left\lfloor \frac{${N}}{${b}} \right\rfloor = ${nb}$, $n(A \cap B) = \left\lfloor \frac{${N}}{${l}} \right\rfloor = ${nl}$`,
              R`$n(A \cup B) = ${na} + ${nb} - ${nl} = ${u}$`,
              R`$n((A \cup B)') = ${N} - ${u} = ${ans}$`,
              L(`${ans} integers are divisible by neither.`, `${ans} पूर्णांक किसी से भी विभाज्य नहीं हैं।`),
            ),
          });
        }
        const c = r.int(5, 20), a = c + r.int(10, 40), b = c + r.int(10, 40), h = r.int(4, 20);
        const N = a + b - c + h;
        return taskL(lang, {
          text: L(
            `Of ${N} tourists visiting ${C}, ${a} visited the museum, ${b} visited the zoo and ${h} visited neither. How many tourists visited only the museum?`,
            `${C} आए ${N} पर्यटकों में से ${a} संग्रहालय गए, ${b} चिड़ियाघर गए और ${h} इनमें से कहीं नहीं गए। कितने पर्यटक केवल संग्रहालय गए?`,
          ),
          answer: numM(a - c, null, [
            [c, L("That is the number who visited both places.", "यह दोनों जगह जाने वालों की संख्या है।")],
            [a, L("Those who visited both are inside the museum group; remove them.", "दोनों जगह जाने वाले संग्रहालय वाले समूह में शामिल हैं; उन्हें हटाइए।")],
            [N - h - b, L("Check your subtraction: only museum = n(M) − n(M ∩ Z).", "घटाव जाँचिए: केवल संग्रहालय = n(M) − n(M ∩ Z)।")],
          ]),
          data: { given: [`n(U) = ${N}`, `n(M) = ${a}`, `n(Z) = ${b}`, R`n((M \cup Z)') = ${h}`], find: [R`n(M \cap Z')`] },
          hint: L("Find the union, then the intersection; 'only the museum' is the museum set minus the intersection.", "पहले सम्मिलन, फिर सर्वनिष्ठ ज्ञात कीजिए; 'केवल संग्रहालय' = संग्रहालय समुच्चय − सर्वनिष्ठ।"),
          formula: FU,
          solution: S(
            L("M = museum, Z = zoo.", "M = संग्रहालय, Z = चिड़ियाघर।"),
            R`$n(M \cup Z) = ${N} - ${h} = ${N - h}$`,
            R`$n(M \cap Z) = ${a} + ${b} - ${N - h} = ${c}$`,
            R`$n(M \cap Z') = ${a} - ${c} = ${a - c}$`,
            L(`${a - c} tourists visited only the museum.`, `${a - c} पर्यटक केवल संग्रहालय गए।`),
          ),
        });
      }
      // level 3
      const v = r.int(0, 3);
      if (v <= 2) {
        const tr = r.pick(TRIPLES);
        let o1, o2, o3, d, e, f, g, h;
        do {
          g = r.int(2, 9);
          d = r.int(3, 14);
          e = r.int(3, 14);
          f = r.int(3, 14);
          o1 = r.int(5, 30);
          o2 = r.int(5, 30);
          o3 = r.int(5, 30);
          h = r.int(2, 20);
        } while (new Set([d, e, f]).size < 3);
        const nA = o1 + d + e + g, nB = o2 + d + f + g, nC = o3 + e + f + g;
        const AB = d + g, AC = e + g, BC = f + g, U3 = nA + nB + nC - AB - AC - BC + g, N = U3 + h;
        const [X, Y, Z] = tr.s;
        const names = L(tr.en.join(", ").replace(/, ([^,]*)$/, " and $1"), tr.hi.join(", ").replace(/, ([^,]*)$/, " और $1"));
        const defn = L(`where ${X}, ${Y}, ${Z} are the sets of students who ${tr.ven} ${names} respectively`, `जहाँ ${X}, ${Y}, ${Z} क्रमशः ${names} ${tr.vhi} विद्यार्थियों के समुच्चय हैं`);
        const all = R`$n(${X}) = ${nA}$, $n(${Y}) = ${nB}$, $n(${Z}) = ${nC}$, $n(${X} \cap ${Y}) = ${AB}$, $n(${X} \cap ${Z}) = ${AC}$, $n(${Y} \cap ${Z}) = ${BC}$`;
        const giv = [`n(${X}) = ${nA}`, `n(${Y}) = ${nB}`, `n(${Z}) = ${nC}`, R`n(${X} \cap ${Y}) = ${AB}`, R`n(${X} \cap ${Z}) = ${AC}`, R`n(${Y} \cap ${Z}) = ${BC}`];
        const regions = S(
          L("Regions of the Venn diagram:", "वेन आरेख के क्षेत्र:"),
          R`$n(${X} \cap ${Y} \text{ only}) = ${AB} - ${g} = ${d}$, $n(${X} \cap ${Z} \text{ only}) = ${AC} - ${g} = ${e}$, $n(${Y} \cap ${Z} \text{ only}) = ${BC} - ${g} = ${f}$`,
          R`$n(${X} \text{ only}) = ${nA} - ${d} - ${e} - ${g} = ${o1}$, $n(${Y} \text{ only}) = ${nB} - ${d} - ${f} - ${g} = ${o2}$, $n(${Z} \text{ only}) = ${nC} - ${e} - ${f} - ${g} = ${o3}$`,
        );
        const unionLine = R`$n(${X} \cup ${Y} \cup ${Z}) = ${nA} + ${nB} + ${nC} - ${AB} - ${AC} - ${BC} + ${g} = ${U3}$`;
        if (v === 0) {
          return taskL(lang, {
            text: L(
              `In a school in ${C}, ${N} students were surveyed: ${all} and $n(${X} \\cap ${Y} \\cap ${Z}) = ${g}$, ${defn}. How many students are in none of the three sets?`,
              `${C} के एक विद्यालय में ${N} विद्यार्थियों का सर्वेक्षण हुआ: ${all} तथा $n(${X} \\cap ${Y} \\cap ${Z}) = ${g}$, ${defn}। कितने विद्यार्थी तीनों में से किसी भी समुच्चय में नहीं हैं?`,
            ),
            answer: numM(h, null, [
              [N - (nA + nB + nC - AB - AC - BC), L("You forgot to add back the students in all three sets.", "आप तीनों समुच्चयों में आने वाले विद्यार्थियों को वापस जोड़ना भूल गए।")],
              [N - (nA + nB + nC), L("The overlaps were counted more than once; use inclusion–exclusion.", "उभयनिष्ठ भाग एक से अधिक बार गिने गए हैं; समावेशन–अपवर्जन सिद्धांत लगाइए।")],
              [U3, L("That is the number in at least one set; subtract it from the total.", "यह कम से कम एक समुच्चय में आने वालों की संख्या है; इसे कुल से घटाइए।")],
            ]),
            data: { given: [`n(U) = ${N}`, ...giv, R`n(${X} \cap ${Y} \cap ${Z}) = ${g}`], find: [R`n((${X} \cup ${Y} \cup ${Z})')`] },
            hint: L("Use the inclusion–exclusion formula for three sets, then subtract from the total.", "तीन समुच्चयों का समावेशन–अपवर्जन सूत्र लगाइए, फिर कुल से घटाइए।"),
            formula: FU3,
            solution: S(unionLine, R`$n(\text{none}) = ${N} - ${U3} = ${h}$`, L(`${h} students are in none of the sets.`, `${h} विद्यार्थी किसी भी समुच्चय में नहीं हैं।`)),
          });
        }
        if (v === 1) {
          const one = o1 + o2 + o3;
          return taskL(lang, {
            text: L(
              `In a school in ${C}, ${all} and $n(${X} \\cap ${Y} \\cap ${Z}) = ${g}$, ${defn}. How many students are in exactly one of the three sets?`,
              `${C} के एक विद्यालय में ${all} तथा $n(${X} \\cap ${Y} \\cap ${Z}) = ${g}$, ${defn}। कितने विद्यार्थी तीनों में से ठीक एक समुच्चय में हैं?`,
            ),
            answer: numM(one, null, [
              [nA + nB + nC - 2 * (AB + AC + BC) + g, L("The centre region was subtracted too often; find each 'only' region separately.", "केंद्रीय क्षेत्र बहुत बार घटाया गया है; प्रत्येक 'केवल' क्षेत्र अलग से ज्ञात कीजिए।")],
              [nA + nB + nC - AB - AC - BC + g, L("That is the number in at least one set, not exactly one.", "यह कम से कम एक समुच्चय वालों की संख्या है, ठीक एक वालों की नहीं।")],
              [nA + nB + nC - 2 * (AB + AC + BC), L("Each pairwise overlap contains the triple overlap; subtract it first to get the 'two only' regions.", "प्रत्येक दो-समुच्चय वाले भाग में तीनों वाला भाग भी है; 'केवल दो' क्षेत्र के लिए पहले उसे घटाइए।")],
            ]),
            data: { given: [...giv, R`n(${X} \cap ${Y} \cap ${Z}) = ${g}`], find: [R`n(\text{exactly one})`] },
            hint: L("Fill the Venn diagram from the centre outwards: all three, then each 'two only' region, then each 'one only' region.", "वेन आरेख को केंद्र से बाहर की ओर भरिए: पहले तीनों, फिर 'केवल दो', फिर 'केवल एक' वाले क्षेत्र।"),
            formula: FU3,
            solution: S(regions, R`$${o1} + ${o2} + ${o3} = ${one}$`, L(`${one} students are in exactly one set.`, `${one} विद्यार्थी ठीक एक समुच्चय में हैं।`)),
          });
        }
        return taskL(lang, {
          text: L(
            `Each of the ${U3} students in a club in ${C} is in at least one of the sets ${X}, ${Y}, ${Z}, ${defn}. Given ${all}, find $n(${X} \\cap ${Y} \\cap ${Z})$.`,
            `${C} के एक क्लब का प्रत्येक विद्यार्थी (कुल ${U3}) ${X}, ${Y}, ${Z} में से कम से कम एक समुच्चय में है, ${defn}। यदि ${all}, तो $n(${X} \\cap ${Y} \\cap ${Z})$ ज्ञात कीजिए।`,
          ),
          answer: numM(g, null, [
            [-g, L("Sign error: solve the inclusion–exclusion equation for the triple overlap carefully.", "चिह्न की त्रुटि: समावेशन–अपवर्जन समीकरण को ध्यान से हल कीजिए।")],
            [nA + nB + nC - AB - AC - BC, L("That is the sum without the triple overlap, not the triple overlap itself.", "यह तीनों वाले भाग के बिना योग है, स्वयं तीनों वाला भाग नहीं।")],
          ]),
          data: { given: [R`n(${X} \cup ${Y} \cup ${Z}) = ${U3}`, ...giv], find: [R`n(${X} \cap ${Y} \cap ${Z})`] },
          hint: L("Write the inclusion–exclusion formula with the triple overlap as the unknown.", "समावेशन–अपवर्जन सूत्र लिखिए जिसमें तीनों का सर्वनिष्ठ अज्ञात हो।"),
          formula: FU3,
          solution: S(
            R`$${U3} = ${nA} + ${nB} + ${nC} - ${AB} - ${AC} - ${BC} + n(${X} \cap ${Y} \cap ${Z})$`,
            R`$${U3} = ${nA + nB + nC - AB - AC - BC} + n(${X} \cap ${Y} \cap ${Z})$`,
            R`$n(${X} \cap ${Y} \cap ${Z}) = ${g}$`,
            L(`${g} students are in all three sets.`, `${g} विद्यार्थी तीनों समुच्चयों में हैं।`),
          ),
        });
      }
      const ctry = r.pick(COUNTRIES);
      const [i, j] = r.shuffle([0, 1, 2, 3, 4]).slice(0, 2);
      const a = r.int(11, 18) * 5, b = r.int(8, 17) * 5;
      const askLeast = r.int(0, 1) === 0 && a + b > 100;
      const X = L(...OWN[i]), Y = L(...OWN[j]), K = L(...ctry);
      const lo = Math.max(0, a + b - 100), hiV = Math.min(a, b);
      const ans = askLeast ? lo : hiV;
      return taskL(lang, {
        text: L(
          `In a district of ${K}, ${a}% of households own ${X} and ${b}% own ${Y}. What is the ${askLeast ? "least" : "greatest"} possible percentage of households that own both?`,
          `${K} के एक ज़िले में ${a}% परिवारों के पास ${X} है और ${b}% के पास ${Y} है। दोनों वस्तुएँ रखने वाले परिवारों का ${askLeast ? "न्यूनतम" : "अधिकतम"} संभव प्रतिशत कितना है?`,
        ),
        answer: numM(ans, null, askLeast
          ? [[hiV, L("That is the greatest possible overlap, when one set lies inside the other.", "यह अधिकतम संभव सर्वनिष्ठ है, जब एक समुच्चय दूसरे के अंदर हो।")], [a + b, L("A percentage of households cannot exceed 100; use $n(A \\cup B) \\le 100\\%$.", "परिवारों का प्रतिशत 100 से अधिक नहीं हो सकता; $n(A \\cup B) \\le 100\\%$ का उपयोग कीजिए।")]]
          : [[lo, L("That is the least possible overlap, when the union is as large as possible.", "यह न्यूनतम संभव सर्वनिष्ठ है, जब सम्मिलन अधिकतम हो।")], [Math.max(a, b), L("The intersection cannot be larger than the smaller set.", "सर्वनिष्ठ छोटे समुच्चय से बड़ा नहीं हो सकता।")]]),
        data: { given: [`n(A) = ${a}\\%`, `n(B) = ${b}\\%`], find: [askLeast ? R`n(A \cap B)_{\min}` : R`n(A \cap B)_{\max}`] },
        hint: askLeast
          ? L("The overlap is smallest when the union is as large as possible, i.e. 100%.", "सर्वनिष्ठ तब न्यूनतम होता है जब सम्मिलन अधिकतम, यानी 100%, हो।")
          : L("The overlap is largest when the smaller set lies completely inside the larger one.", "सर्वनिष्ठ तब अधिकतम होता है जब छोटा समुच्चय पूरी तरह बड़े समुच्चय के अंदर हो।"),
        formula: FU,
        solution: askLeast
          ? S(R`$n(A \cap B) = n(A) + n(B) - n(A \cup B)$`, R`$n(A \cup B) \le 100\%$, ${L("so", "अतः")} $n(A \cap B) \ge ${a} + ${b} - 100 = ${lo}\%$`, L(`The least possible percentage is ${lo}%.`, `न्यूनतम संभव प्रतिशत ${lo}% है।`))
          : S(R`$A \cap B \subseteq A$ ${L("and", "और")} $A \cap B \subseteq B$`, R`$n(A \cap B) \le \min(${a}, ${b}) = ${hiV}\%$`, L(`The greatest possible percentage is ${hiV}% (all of the smaller group own both).`, `अधिकतम संभव प्रतिशत ${hiV}% है (छोटे समूह के सभी परिवारों के पास दोनों हैं)।`)),
      });
    },
  },

  // ───────────────────────── Logic: truth values ─────────────────────────
  {
    id: "exg-mat-logic",
    topics: [T("sets-and-logic")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const opt = (k) => `$${ST2[k][0]("p", "q")}$`;
      const subst = (k, P, Q) => R`${ST2[k][0](tv(P), tv(Q))} = ${tv(ST2[k][1](P, Q))}`;
      const whyF = (k, P, Q) => L(`With these values: $${subst(k, P, Q)}$.`, `इन मानों से: $${subst(k, P, Q)}$।`);
      const truthChoice = (P, Q, wantTrue, intro) => {
        const idx = ST2.map((_, k) => k);
        const good = idx.filter((k) => ST2[k][1](P, Q) === wantTrue), bad = idx.filter((k) => ST2[k][1](P, Q) !== wantTrue);
        const c = r.pick(good);
        const w = r.shuffle(bad).slice(0, 3);
        const answer = choiceWhy(r, opt(c), w.map((k) => [opt(k), whyF(k, P, Q)]));
        const word = wantTrue ? L("true", "सत्य") : L("false", "असत्य");
        return taskL(lang, {
          text: S(intro, L(`Which of the following compound statements is ${word}?`, `निम्नलिखित में से कौन-सा संयुक्त कथन ${word} है?`)).replace("\n", " "),
          answer,
          hint: L("Substitute T or F for p and q in each statement; remember that $p \\Rightarrow q$ is false only when p is true and q is false.", "प्रत्येक कथन में p और q के स्थान पर T या F रखिए; याद रखिए कि $p \\Rightarrow q$ तभी असत्य है जब p सत्य और q असत्य हो।"),
          solution: S(
            L(`p is ${P ? "true" : "false"} (${P ? "T" : "F"}), q is ${Q ? "true" : "false"} (${Q ? "T" : "F"}).`, `p ${P ? "सत्य" : "असत्य"} (${P ? "T" : "F"}) है, q ${Q ? "सत्य" : "असत्य"} (${Q ? "T" : "F"}) है।`),
            ...[c, ...w].map((k) => `$${subst(k, P, Q)}$`),
            L(`Only ${opt(c)} is ${word}.`, `केवल ${opt(c)} ${word} है।`),
          ),
        });
      };
      if (level === 1) {
        const [P, Q] = r.pick(ROWS2);
        const wantTrue = r.int(0, 2) > 0;
        const intro = L(`The statement p is ${P ? "true" : "false"} and the statement q is ${Q ? "true" : "false"}.`, `कथन p ${P ? "सत्य" : "असत्य"} है और कथन q ${Q ? "सत्य" : "असत्य"} है।`);
        return truthChoice(P, Q, wantTrue, intro);
      }
      if (level === 2) {
        const v = r.int(0, 1);
        if (v === 0) {
          const [i, j] = r.shuffle(STMT.map((_, k) => k)).slice(0, 2);
          const [pe, ph, P] = STMT[i], [qe, qh, Q] = STMT[j];
          const wantTrue = r.int(0, 2) > 0;
          const intro = L(`Let p: "${pe}" and q: "${qe}".`, `मान लीजिए p: "${ph}" और q: "${qh}"।`);
          return truthChoice(P, Q, wantTrue, intro);
        }
        const ni = r.int(0, NEG.length - 1);
        const [qen, qhi, ok, wrong] = NEG[ni];
        const contra = ni === 4;
        return taskL(lang, {
          text: L(`Which statement is ${qen}?`, `${qhi} कौन-सा कथन है?`),
          answer: choiceWhy(r, `$${ok}$`, wrong.map(([o, we, wh]) => [`$${o}$`, L(we, wh)])),
          hint: contra
            ? L("The contrapositive negates both parts and swaps them; it is equivalent to the original statement.", "प्रतिधनात्मक कथन में दोनों घटकों का निषेधन करके उन्हें आपस में बदला जाता है; यह मूल कथन के तुल्य होता है।")
            : L("Use De Morgan's laws, and remember that $p \\Rightarrow q$ is false only when p is true and q is false.", "दे मॉर्गन नियम लगाइए और याद रखिए कि $p \\Rightarrow q$ तभी असत्य है जब p सत्य और q असत्य हो।"),
          solution: S(
            contra
              ? L(`Check with a truth table: the contrapositive has the same truth value as $${NEG_S[ni]}$ in every row.`, `सत्यता सारणी से जाँचिए: प्रतिधनात्मक कथन का सत्यता मान प्रत्येक पंक्ति में $${NEG_S[ni]}$ के समान होता है।`)
              : L(`Check with a truth table: the negation has the opposite truth value to $${NEG_S[ni]}$ in every row.`, `सत्यता सारणी से जाँचिए: निषेधन का सत्यता मान प्रत्येक पंक्ति में $${NEG_S[ni]}$ के विपरीत होता है।`),
            ...ROWS2.map(([P, Q]) => `$p = ${tv(P)},\\ q = ${tv(Q)}:\\ ${NEG_S[ni]} = ${tv(NEG_F[ni][0](P, Q))},\\ ${ok} = ${tv(NEG_F[ni][1](P, Q))}$`),
            L(`Answer: $${ok}$.`, `उत्तर: $${ok}$।`),
          ),
        });
      }
      const v = r.int(0, 1);
      if (v === 0) {
        const [tex, f] = r.pick(ST3);
        const rows = [];
        for (const P of [true, false]) for (const Q of [true, false]) for (const Rr of [true, false]) rows.push([P, Q, Rr, f(P, Q, Rr)]);
        const k = rows.filter((x) => x[3]).length;
        const fRows = rows.filter((x) => !x[3]).map(([P, Q, Rr]) => `(${P ? "T" : "F"}, ${Q ? "T" : "F"}, ${Rr ? "T" : "F"})`);
        return taskL(lang, {
          text: L(
            `A truth table is drawn for the statement $${tex}$, with all 8 combinations of truth values of p, q and r. In how many rows is the statement true?`,
            `कथन $${tex}$ के लिए p, q और r के सत्यता मानों के सभी 8 संयोजनों वाली सत्यता सारणी बनाई गई है। कितनी पंक्तियों में यह कथन सत्य है?`,
          ),
          answer: numM(k, null, [[8 - k, L("You counted the rows where the statement is false.", "आपने वे पंक्तियाँ गिनी हैं जिनमें कथन असत्य है।")]]),
          hint: L("It is often quicker to find the rows in which the statement is false and subtract from 8.", "प्रायः उन पंक्तियों को ढूँढना आसान होता है जिनमें कथन असत्य है, फिर 8 में से घटाइए।"),
          solution: S(
            L(`Rows (p, q, r) where the statement is false: ${fRows.join(", ") || "none"}.`, `पंक्तियाँ (p, q, r) जिनमें कथन असत्य है: ${fRows.join(", ") || "कोई नहीं"}।`),
            `$8 - ${8 - k} = ${k}$`,
            L(`The statement is true in ${k} rows.`, `कथन ${k} पंक्तियों में सत्य है।`),
          ),
        });
      }
      const [ct] = r.pick(TAUT);
      const w = r.shuffle(NONTAUT).slice(0, 3);
      const why = ([, f]) => {
        const [P, Q] = ROWS2.find(([P, Q]) => !f(P, Q));
        return L(`It is false when p is ${P ? "T" : "F"} and q is ${Q ? "T" : "F"}.`, `जब p = ${P ? "T" : "F"} और q = ${Q ? "T" : "F"} हो, तब यह असत्य है।`);
      };
      const ctF = TAUT.find((x) => x[0] === ct)[1];
      return taskL(lang, {
        text: L("Which of the following statements is a tautology (true for all truth values of p and q)?", "निम्नलिखित में से कौन-सा कथन पुनरुक्ति है (p और q के सभी सत्यता मानों के लिए सत्य)?"),
        answer: choiceWhy(r, `$${ct}$`, w.map((x) => [`$${x[0]}$`, why(x)])),
        hint: L("A single row in which a statement is false is enough to show that it is not a tautology.", "यह दिखाने के लिए कि कोई कथन पुनरुक्ति नहीं है, एक ऐसी पंक्ति काफ़ी है जिसमें वह असत्य हो।"),
        solution: S(
          L(`Check $${ct}$ in all four rows:`, `$${ct}$ को चारों पंक्तियों में जाँचिए:`),
          ...ROWS2.map(([P, Q]) => `$p = ${tv(P)},\\ q = ${tv(Q)}:\\ ${tv(ctF(P, Q))}$`),
          L("It is true in every row, so it is a tautology; each of the other statements is false in at least one row.", "यह प्रत्येक पंक्ति में सत्य है, अतः पुनरुक्ति है; अन्य प्रत्येक कथन कम से कम एक पंक्ति में असत्य है।"),
        ),
      });
    },
  },

  // ───────────────────────── Indices and surds ─────────────────────────
  {
    id: "exg-mat-indices",
    topics: [T("indices-and-surds")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      if (level === 1) {
        const v = r.int(0, 3);
        if (v === 0) {
          const [k, m, n] = r.pick([[2, 2, 3], [3, 2, 3], [2, 3, 4], [2, 3, 5], [3, 3, 4], [5, 2, 3], [2, 5, 6], [3, 3, 2], [5, 3, 2], [2, 5, 2], [3, 2, 5], [10, 2, 3], [7, 3, 2], [6, 3, 2]]);
          const base = k ** n, val = k ** m;
          return taskL(lang, {
            text: L(`Evaluate $${base}^{\\frac{${m}}{${n}}}$.`, `$${base}^{\\frac{${m}}{${n}}}$ का मान ज्ञात कीजिए।`),
            answer: numM(val, null, [
              [(base * m) / n, L("A fractional index is not multiplied by the base: the denominator is a root, the numerator a power.", "भिन्नात्मक घातांक को आधार से गुणा नहीं करते: हर मूल है और अंश घात।")],
              [k * m, L("Raise the root to the power, do not multiply it by the numerator.", "मूल को घात तक उठाइए, उसे अंश से गुणा मत कीजिए।")],
            ]),
            hint: L(`Take the ${n === 2 ? "square" : n === 3 ? "cube" : n + "th"} root first, then raise to the power ${m}.`, `पहले ${n === 2 ? "वर्गमूल" : n === 3 ? "घनमूल" : n + "वाँ मूल"} लीजिए, फिर घात ${m} लीजिए।`),
            data: { given: [`a = ${base}`, R`\frac{m}{n} = \frac{${m}}{${n}}`], find: [R`a^{\frac{m}{n}}`] },
            formula: R`a^{\frac{m}{n}} = \left(\sqrt[n]{a}\right)^m`,
            solution: S(
              R`$\sqrt[${n}]{${base}} = ${k}$`,
              R`$${base}^{\frac{${m}}{${n}}} = ${k}^{${m}} = ${val}$`,
              L(`The value is ${val}.`, `मान ${val} है।`),
            ),
          });
        }
        if (v === 1) {
          const a = r.pick(["2", "3", "5", "7", "x", "a"]);
          const m = r.int(2, 9), n = r.pick([-4, -3, -2, 2, 3, 4, 5, 6]), p = r.pick([-3, -2, 2, 3, 4, 5, 7]);
          const k = m + n - p;
          return taskL(lang, {
            text: L(`Simplify $${a}^{${m}} \\times ${a}^{${n}} \\div ${a}^{${p}}$ and write it as $${a}^{k}$. Find k.`, `$${a}^{${m}} \\times ${a}^{${n}} \\div ${a}^{${p}}$ को सरल करके $${a}^{k}$ के रूप में लिखिए। k ज्ञात कीजिए।`),
            answer: numM(k, null, [
              [m * n - p, L("When powers of the same base are multiplied, add the indices; do not multiply them.", "समान आधार की घातों को गुणा करने पर घातांक जोड़े जाते हैं, गुणा नहीं किए जाते।")],
              [m + n + p, L("Dividing by a power subtracts its index.", "किसी घात से भाग देने पर उसका घातांक घटाया जाता है।")],
            ]),
            hint: L("Multiply → add the indices; divide → subtract the index.", "गुणा → घातांक जोड़िए; भाग → घातांक घटाइए।"),
            formula: R`a^m \times a^n = a^{m+n},\ a^m \div a^n = a^{m-n}`,
            solution: S(R`$k = ${m} + ${pm(n)} - ${pm(p)}$`, R`$k = ${k}$`, L(`So the expression equals $${a}^{${k}}$.`, `अतः व्यंजक $${a}^{${k}}$ के बराबर है।`)),
          });
        }
        if (v === 2) {
          const b = r.pick([2, 3, 5, 6, 7]), a = r.int(2, 9);
          const N = a * a * b;
          let s = 0;
          for (let t = 2; t < a; t++) if (a % t === 0) { s = t; break; }
          const list = [[a * a, L("Take the square root of the square factor.", "वर्ग गुणनखंड का वर्गमूल लीजिए।")]];
          if (s) list.unshift([s, L("Use the largest square factor, otherwise the surd is not fully simplified.", "सबसे बड़ा वर्ग गुणनखंड लीजिए, अन्यथा करणी पूरी तरह सरल नहीं होती।")]);
          return taskL(lang, {
            text: L(`Write $\\sqrt{${N}}$ in the form $a\\sqrt{${b}}$, where a is an integer. Find a.`, `$\\sqrt{${N}}$ को $a\\sqrt{${b}}$ के रूप में लिखिए, जहाँ a एक पूर्णांक है। a ज्ञात कीजिए।`),
            answer: numM(a, null, list),
            data: { given: [`N = ${N}`], find: ["a"] },
            hint: L(`Find the largest perfect square that divides ${N}.`, `${N} को विभाजित करने वाला सबसे बड़ा पूर्ण वर्ग ज्ञात कीजिए।`),
            formula: R`\sqrt{ab} = \sqrt{a}\,\sqrt{b}`,
            solution: S(R`$${N} = ${a * a} \times ${b}$`, R`$\sqrt{${N}} = \sqrt{${a * a}}\,\sqrt{${b}} = ${a}\sqrt{${b}}$`, L(`So a = ${a}.`, `अतः a = ${a}।`)),
          });
        }
        const b = r.pick([2, 3, 5]);
        let x, p, q, m;
        do {
          x = r.int(1, 5);
          p = r.int(1, 3);
          q = r.int(-3, 3);
          m = p * x + q;
        } while (m < 1 || b ** m > 3200 || (p === 1 && q === 0));
        const N = b ** m, ex = poly([[p, "x"], [q, ""]]);
        return taskL(lang, {
          text: L(`Solve $${b}^{${ex}} = ${N}$.`, `$${b}^{${ex}} = ${N}$ को हल कीजिए।`),
          answer: numM(x, null, [
            [m, L("That is the power of the base; now solve the linear equation for x.", "यह आधार की घात है; अब x के लिए रैखिक समीकरण हल कीजिए।")],
            [(m + q) / p, L("Sign error when moving the constant to the other side.", "अचर पद को दूसरी ओर ले जाते समय चिह्न की त्रुटि।")],
          ]),
          hint: L(`Write ${N} as a power of ${b}, then equate the indices.`, `${N} को ${b} की घात के रूप में लिखिए, फिर घातांकों की तुलना कीजिए।`),
          formula: R`a^m = a^n \Rightarrow m = n`,
          solution: S(R`$${N} = ${b}^{${m}}$`, R`$${ex} = ${m}$`, R`$x = ${x}$`, L(`So x = ${x}.`, `अतः x = ${x}।`)),
        });
      }
      if (level === 2) {
        const v = r.int(0, 3);
        if (v === 0) {
          const [s, t] = r.pick([[2, 3], [3, 2], [2, 5], [5, 2], [3, 4], [4, 3], [1, 2], [1, 3], [2, 1], [4, 5]]);
          const [m, n] = r.pick([[1, 2], [3, 2], [1, 3], [2, 3]]);
          if (s ** n > 125 || t ** n > 125) return null;
          const a = s ** n, b = t ** n;
          const A = t ** m, B = s ** m;
          const base = b === 1 ? `${a}` : R`\frac{${a}}{${b}}`;
          const bT = b === 1 ? base : R`\left(${base}\right)`;
          return taskL(lang, {
            text: L(`Evaluate $${bT}^{-\\frac{${m}}{${n}}}$. Give the answer as a fraction in lowest terms if it is not a whole number.`, `$${bT}^{-\\frac{${m}}{${n}}}$ का मान ज्ञात कीजिए। यदि उत्तर पूर्णांक नहीं है, तो उसे न्यूनतम पदों में भिन्न के रूप में लिखिए।`),
            answer: fractionM(A, B, [
              [B / A, L("A negative index means taking the reciprocal; you ignored the minus sign.", "ऋणात्मक घातांक का अर्थ व्युत्क्रम लेना है; आपने ऋण चिह्न छोड़ दिया।")],
              [-A / B, L("A negative index does not make the value negative; it gives the reciprocal.", "ऋणात्मक घातांक मान को ऋणात्मक नहीं बनाता; वह व्युत्क्रम देता है।")],
            ]),
            hint: L("First take the reciprocal to make the index positive, then take the root and the power.", "पहले व्युत्क्रम लेकर घातांक को धनात्मक बनाइए, फिर मूल और घात लीजिए।"),
            formula: R`a^{-\frac{m}{n}} = \frac{1}{\left(\sqrt[n]{a}\right)^m}`,
            solution: S(
              R`$${bT}^{-\frac{${m}}{${n}}} = \left(\frac{${b}}{${a}}\right)^{\frac{${m}}{${n}}}$`,
              R`$\sqrt[${n}]{\frac{${b}}{${a}}} = \frac{${t}}{${s}}$`,
              R`$\left(\frac{${t}}{${s}}\right)^{${m}} = ${fracTex(A, B)}$`,
              L(`The value is $${fracTex(A, B)}$.`, `मान $${fracTex(A, B)}$ है।`),
            ),
          });
        }
        if (v === 1) {
          const [a, b] = r.pick([[5, 2], [7, 3], [6, 2], [7, 2], [11, 5], [10, 3], [5, 3], [11, 3], [13, 5], [6, 5], [7, 5]]);
          const p = r.int(1, 4), c = p * (a - b);
          const minus = r.int(0, 1) === 0;
          const den = minus ? R`\sqrt{${a}} - \sqrt{${b}}` : R`\sqrt{${a}} + \sqrt{${b}}`;
          const conj = minus ? R`\sqrt{${a}} + \sqrt{${b}}` : R`\sqrt{${a}} - \sqrt{${b}}`;
          return taskL(lang, {
            text: L(`Rationalise the denominator: write $\\frac{${c}}{${den}}$ in the form $p\\left(${conj}\\right)$. Find p.`, `हर का परिमेयकरण कीजिए: $\\frac{${c}}{${den}}$ को $p\\left(${conj}\\right)$ के रूप में लिखिए। p ज्ञात कीजिए।`),
            answer: numM(p, null, [
              [c / (a + b), L(`$(${den})(${conj})$ is a difference of squares: $${a} - ${b}$, not $${a} + ${b}$.`, `$(${den})(${conj})$ वर्गों का अंतर है: $${a} - ${b}$, न कि $${a} + ${b}$।`)],
              [c, L("After multiplying by the conjugate you must also divide by the new denominator.", "संयुग्मी से गुणा करने के बाद नए हर से भाग देना भी आवश्यक है।")],
            ]),
            data: { given: [`c = ${c}`, `a = ${a}`, `b = ${b}`], find: ["p"] },
            hint: L("Multiply the numerator and the denominator by the conjugate of the denominator.", "अंश और हर दोनों को हर के संयुग्मी से गुणा कीजिए।"),
            formula: R`(\sqrt{a} - \sqrt{b})(\sqrt{a} + \sqrt{b}) = a - b`,
            solution: S(
              R`$\frac{${c}}{${den}} \cdot \frac{${conj}}{${conj}} = \frac{${c}(${conj})}{${a} - ${b}}$`,
              R`$= \frac{${c}}{${a - b}}\left(${conj}\right) = ${p}\left(${conj}\right)$`,
              L(`So p = ${p}.`, `अतः p = ${p}।`),
            ),
          });
        }
        if (v === 2) {
          const m = r.pick([2, 3, 5, 6, 7]);
          // Najmanjši koeficient odštejemo, da je k > 0.
          const ks = r.shuffle([2, 3, 4, 5, 6]).slice(0, 3);
          const k3 = Math.min(...ks), [k1, k2] = ks.filter((k) => k !== k3);
          const K = k1 + k2 - k3;
          return taskL(lang, {
            text: L(`Simplify $\\sqrt{${k1 * k1 * m}} + \\sqrt{${k2 * k2 * m}} - \\sqrt{${k3 * k3 * m}}$ and write it as $k\\sqrt{${m}}$. Find k.`, `$\\sqrt{${k1 * k1 * m}} + \\sqrt{${k2 * k2 * m}} - \\sqrt{${k3 * k3 * m}}$ को सरल करके $k\\sqrt{${m}}$ के रूप में लिखिए। k ज्ञात कीजिए।`),
            answer: numM(K, null, [
              [k1 + k2 + k3, L("The last surd is subtracted, not added.", "अंतिम करणी घटाई जाती है, जोड़ी नहीं जाती।")],
              [k1 * k1 + k2 * k2 - k3 * k3, L("Take the square root of each square factor.", "प्रत्येक वर्ग गुणनखंड का वर्गमूल लीजिए।")],
            ]),
            hint: L(`Write each surd as a multiple of $\\sqrt{${m}}$, then add like surds.`, `प्रत्येक करणी को $\\sqrt{${m}}$ के गुणज के रूप में लिखिए, फिर समान करणियाँ जोड़िए।`),
            formula: R`\sqrt{k^2 m} = k\sqrt{m}`,
            solution: S(
              R`$\sqrt{${k1 * k1 * m}} = ${k1}\sqrt{${m}}$, $\sqrt{${k2 * k2 * m}} = ${k2}\sqrt{${m}}$, $\sqrt{${k3 * k3 * m}} = ${k3}\sqrt{${m}}$`,
              R`$${k1}\sqrt{${m}} + ${k2}\sqrt{${m}} - ${k3}\sqrt{${m}} = ${K}\sqrt{${m}}$`,
              L(`So k = ${K}.`, `अतः k = ${K}।`),
            ),
          });
        }
        // (b^s)^(x+u) = (b^t)^(x+w)
        const [b, s, t] = r.pick([[2, 2, 3], [2, 3, 2], [2, 2, 5], [2, 4, 3], [2, 3, 4], [3, 2, 3], [3, 3, 2], [3, 4, 2], [5, 2, 3], [5, 3, 2], [2, 5, 2], [3, 3, 4]]);
        let x, u, w;
        let guard = 0;
        do {
          x = r.int(-4, 8);
          u = r.int(-3, 4);
          w = (s * (x + u)) / t - x;
          guard++;
        } while ((!Number.isInteger(w) || w === u || Math.abs(w) > 6 || x === 0) && guard < 400);
        if (!Number.isInteger(w)) return null;
        const B1 = b ** s, B2 = b ** t;
        const e1 = poly([[1, "x"], [u, ""]]), e2 = poly([[1, "x"], [w, ""]]);
        return taskL(lang, {
          text: L(`Solve $${B1}^{${e1}} = ${B2}^{${e2}}$.`, `$${B1}^{${e1}} = ${B2}^{${e2}}$ को हल कीजिए।`),
          answer: numM(x, null, [
            [-x, L("Sign error when collecting the x terms on one side.", "x वाले पदों को एक ओर लाते समय चिह्न की त्रुटि।")],
            [(w - u) / (s - t), L("Multiply every term in the bracket by the outer index, including the constant.", "कोष्ठक के प्रत्येक पद को, अचर पद सहित, बाहरी घातांक से गुणा कीजिए।")],
          ]),
          hint: L(`Write both sides as powers of ${b}.`, `दोनों पक्षों को ${b} की घात के रूप में लिखिए।`),
          formula: R`(a^m)^n = a^{mn}`,
          solution: S(
            R`$${B1} = ${b}^{${s}}$, $${B2} = ${b}^{${t}}$`,
            R`$${b}^{${s}(${e1})} = ${b}^{${t}(${e2})}$`,
            R`$${s}(${e1}) = ${t}(${e2})$`,
            R`$${poly([[s, "x"], [s * u, ""]])} = ${poly([[t, "x"], [t * w, ""]])}$`,
            R`$${poly([[s - t, "x"]])} = ${t * w - s * u}$, $x = ${x}$`,
            L(`So x = ${x}.`, `अतः x = ${x}।`),
          ),
        });
      }
      const v = r.int(0, 3);
      if (v === 0) {
        const b = r.pick([2, 3, 5]), k = r.int(1, b === 2 ? 4 : 2), x = r.int(1, b === 5 ? 3 : 5);
        const N = b ** x * (b ** k - 1);
        const plus = r.int(0, 1) === 0 && b === 2;
        const Np = b ** x * (b ** k + 1);
        const val = plus ? Np : N;
        const op = plus ? "+" : "-";
        const fac = plus ? b ** k + 1 : b ** k - 1;
        return taskL(lang, {
          text: L(`Solve $${b}^{x + ${k}} ${op} ${b}^{x} = ${val}$.`, `$${b}^{x + ${k}} ${op} ${b}^{x} = ${val}$ को हल कीजिए।`),
          answer: numM(x, null, [
            [x + k, L(`That is the index of $${b}^{x + ${k}}$; the question asks for x.`, `यह $${b}^{x + ${k}}$ का घातांक है; प्रश्न x पूछता है।`)],
          ]),
          data: { given: [`N = ${val}`], find: ["x"] },
          hint: L(`Write $${b}^{x + ${k}} = ${b}^{${k}} \\cdot ${b}^x$ and take $${b}^x$ out as a common factor.`, `$${b}^{x + ${k}} = ${b}^{${k}} \\cdot ${b}^x$ लिखिए और $${b}^x$ को उभयनिष्ठ गुणनखंड के रूप में बाहर निकालिए।`),
          formula: R`a^{x+k} = a^k \cdot a^x`,
          solution: S(
            R`$${b}^x(${b}^{${k}} ${op} 1) = ${val}$`,
            R`$${b}^x \cdot ${fac} = ${val}$, $${b}^x = ${val / fac}$`,
            R`$${val / fac} = ${b}^{${x}}$, $x = ${x}$`,
            L(`So x = ${x}.`, `अतः x = ${x}।`),
          ),
        });
      }
      if (v === 1) {
        const b = r.pick([2, 3]);
        let i, j;
        do {
          i = r.int(0, b === 2 ? 4 : 3);
          j = r.int(0, b === 2 ? 4 : 3);
        } while (i >= j);
        const P = b ** i, Q = b ** j;
        const B2 = b * b;
        return taskL(lang, {
          text: L(`Find the sum of all real solutions of $${B2}^{x} - ${P + Q} \\cdot ${b}^{x} + ${P * Q} = 0$.`, `$${B2}^{x} - ${P + Q} \\cdot ${b}^{x} + ${P * Q} = 0$ के सभी वास्तविक हलों का योग ज्ञात कीजिए।`),
          answer: numM(i + j, null, [
            [P + Q, L(`That is the sum of the values of $${b}^x$; convert each value back to x.`, `यह $${b}^x$ के मानों का योग है; प्रत्येक मान को वापस x में बदलिए।`)],
            [j, L("The equation has two solutions; add both.", "समीकरण के दो हल हैं; दोनों को जोड़िए।")],
          ]),
          hint: L(`Put $y = ${b}^x$; then $${B2}^x = y^2$ and you get a quadratic in y.`, `$y = ${b}^x$ रखिए; तब $${B2}^x = y^2$ और y में एक द्विघात समीकरण मिलता है।`),
          formula: R`${B2}^x = \left(${b}^x\right)^2`,
          solution: S(
            R`$y = ${b}^x$: $y^2 - ${P + Q}y + ${P * Q} = 0$`,
            R`$(y - ${P})(y - ${Q}) = 0$, $y = ${P}$ ${L("or", "या")} $y = ${Q}$`,
            R`$${b}^x = ${P} \Rightarrow x = ${i}$, $${b}^x = ${Q} \Rightarrow x = ${j}$`,
            R`$${i} + ${j} = ${i + j}$`,
            L(`The sum of the solutions is ${i + j}.`, `हलों का योग ${i + j} है।`),
          ),
        });
      }
      if (v === 2) {
        const [a, b] = r.pick([[3, 2], [5, 3], [7, 5], [6, 5], [7, 6], [13, 11], [11, 10], [5, 4]]);
        const d = a - b, ab = a * b;
        const p = (a + b) / d, q = 2 / d;
        const pTex = en(p), qTex = q === 1 ? "" : en(q);
        return taskL(lang, {
          text: L(`Write $\\frac{\\sqrt{${a}} + \\sqrt{${b}}}{\\sqrt{${a}} - \\sqrt{${b}}}$ in the form $p + q\\sqrt{${ab}}$, where p and q are rational. Find p.`, `$\\frac{\\sqrt{${a}} + \\sqrt{${b}}}{\\sqrt{${a}} - \\sqrt{${b}}}$ को $p + q\\sqrt{${ab}}$ के रूप में लिखिए, जहाँ p और q परिमेय हैं। p ज्ञात कीजिए।`),
          answer: numM(p, null, [
            [a + b, L(`Divide by the denominator $${a} - ${b}$ after expanding.`, `विस्तार के बाद हर $${a} - ${b}$ से भाग दीजिए।`)],
            [(a + b) / (a + b), L(`The new denominator is $${a} - ${b}$, a difference of squares.`, `नया हर $${a} - ${b}$ है, यानी वर्गों का अंतर।`)],
            [(a + b + 2) / d, L(`$\\sqrt{${a}}\\sqrt{${b}} = \\sqrt{${ab}}$ is irrational, so it belongs to the surd part, not to p.`, `$\\sqrt{${a}}\\sqrt{${b}} = \\sqrt{${ab}}$ अपरिमेय है, अतः यह करणी वाले भाग में जाता है, p में नहीं।`)],
          ]),
          hint: L("Multiply the numerator and the denominator by $\\sqrt{" + a + "} + \\sqrt{" + b + "}$.", "अंश और हर को $\\sqrt{" + a + "} + \\sqrt{" + b + "}$ से गुणा कीजिए।"),
          formula: R`(\sqrt{a} + \sqrt{b})^2 = a + b + 2\sqrt{ab}`,
          solution: S(
            R`$\frac{(\sqrt{${a}} + \sqrt{${b}})^2}{${a} - ${b}} = \frac{${a + b} + 2\sqrt{${ab}}}{${d}}$`,
            R`$= ${pTex} + ${qTex}\sqrt{${ab}}$`,
            L(`So p = ${pTex}.`, `अतः p = ${pTex}।`),
          ),
        });
      }
      const [m, n] = r.pick([[2, 3], [2, 5], [3, 5], [2, 7], [3, 7], [5, 7]]);
      const mn = m * n;
      const ok = R`$\frac{1}{c} = \frac{1}{a} + \frac{1}{b}$`;
      return taskL(lang, {
        text: L(`If $${m}^a = ${n}^b = ${mn}^c$ (with a, b, c non-zero), which relation is correct?`, `यदि $${m}^a = ${n}^b = ${mn}^c$ (a, b, c शून्येतर), तो कौन-सा संबंध सही है?`),
        answer: choiceWhy(r, ok, [
          [R`$c = a + b$`, L(`Indices add when powers are multiplied, but here the bases are written as roots of a common value.`, `घातों के गुणन में घातांक जुड़ते हैं, पर यहाँ आधारों को एक उभयनिष्ठ मान के मूलों के रूप में लिखना है।`)],
          [R`$c = ab$`, L(`Try $${m} = k^{1/a}$ and $${n} = k^{1/b}$; their product is $k^{1/a + 1/b}$.`, `$${m} = k^{1/a}$ और $${n} = k^{1/b}$ लीजिए; इनका गुणनफल $k^{1/a + 1/b}$ है।`)],
          [R`$c = \frac{a + b}{ab}$`, L("This is the reciprocal of the correct expression for c.", "यह c के सही व्यंजक का व्युत्क्रम है।")],
        ]),
        hint: L("Let all three powers equal k and express each base as a power of k.", "तीनों घातों को k के बराबर मानिए और प्रत्येक आधार को k की घात के रूप में लिखिए।"),
        solution: S(
          R`${L("Let", "मान लीजिए")} $${m}^a = ${n}^b = ${mn}^c = k$`,
          R`$${m} = k^{\frac{1}{a}}$, $${n} = k^{\frac{1}{b}}$, $${mn} = k^{\frac{1}{c}}$`,
          R`$${mn} = ${m} \cdot ${n} \Rightarrow k^{\frac{1}{c}} = k^{\frac{1}{a} + \frac{1}{b}}$`,
          R`$\frac{1}{c} = \frac{1}{a} + \frac{1}{b}$`,
          L("So 1/c = 1/a + 1/b, i.e. c = ab/(a + b).", "अतः 1/c = 1/a + 1/b, अर्थात् c = ab/(a + b)।"),
        ),
      });
    },
  },

  // ───────────────────────── Measures of dispersion ─────────────────────────
  {
    id: "exg-mat-dispersion",
    topics: [T("measures-of-dispersion")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const ctx = r.pick(DCTX);
      const draw = (n) => Array.from({ length: n }, () => r.int(ctx.lo, ctx.hi_));
      const intro = (xs) => L(`The data below are ${ctx.en(xs.length)}: $${xs.join(", ")}$.`, `नीचे ${ctx.hi(xs.length)} दिए गए हैं: $${xs.join(", ")}$।`);
      // n vrednosti s celim povprečjem
      const drawMean = (n) => {
        let xs;
        do xs = draw(n);
        while (sum(xs) % n !== 0 || new Set(xs).size < n - 1);
        return xs;
      };
      if (level === 1) {
        const v = r.int(0, 3);
        if (v === 0) {
          let xs;
          do xs = draw(7);
          while (new Set(xs).size < 6);
          const mx = Math.max(...xs), mn = Math.min(...xs);
          return taskL(lang, {
            text: S(intro(xs), L("Find the range.", "परिसर ज्ञात कीजिए।")).replace("\n", " "),
            answer: numM(mx - mn, null, [
              [Math.abs(xs[6] - xs[0]), L("The range uses the largest and the smallest value, not the last and the first in the list.", "परिसर में सबसे बड़ा और सबसे छोटा मान लिया जाता है, सूची का अंतिम और पहला नहीं।")],
              [mx, L("Subtract the smallest value from the largest.", "सबसे बड़े मान में से सबसे छोटा मान घटाइए।")],
            ]),
            data: { given: [`x_i = ${xs.join(", ")}`], find: [R`\text{range}`] },
            hint: L("Find the largest and the smallest value.", "सबसे बड़ा और सबसे छोटा मान ज्ञात कीजिए।"),
            formula: R`\text{range} = x_{\max} - x_{\min}`,
            solution: S(R`$x_{\max} = ${mx}$, $x_{\min} = ${mn}$`, R`$${mx} - ${mn} = ${mx - mn}$`, L(`The range is ${mx - mn}.`, `परिसर ${mx - mn} है।`)),
          });
        }
        if (v === 1) {
          let xs;
          do xs = draw(7);
          while (new Set(xs).size < 7);
          const s = sortN(xs), q1 = s[1], q3 = s[5];
          return taskL(lang, {
            text: S(intro(xs), L("Find the interquartile range.", "अंतरचतुर्थक परिसर ज्ञात कीजिए।") + IQR_NOTE(L)).replace("\n", " "),
            answer: numM(q3 - q1, null, [
              [Math.abs(xs[5] - xs[1]), L("Arrange the data in order before finding the quartiles.", "चतुर्थक ज्ञात करने से पहले आँकड़ों को क्रम में लगाइए।")],
              [s[6] - s[0], L("That is the range; the interquartile range is $Q_3 - Q_1$.", "यह परिसर है; अंतरचतुर्थक परिसर $Q_3 - Q_1$ है।")],
              [q3 - s[3], L("Subtract the lower quartile, not the median.", "माध्यिका नहीं, निम्न चतुर्थक घटाइए।")],
            ]),
            data: { given: [`x_i = ${xs.join(", ")}`], find: [R`Q_3 - Q_1`] },
            hint: L("Order the values; the median is the 4th value, Q₁ is the median of the three below it, Q₃ of the three above it.", "मानों को क्रम में लगाइए; माध्यिका चौथा मान है, Q₁ उसके नीचे के तीन मानों की और Q₃ ऊपर के तीन मानों की माध्यिका है।"),
            formula: R`\text{IQR} = Q_3 - Q_1`,
            solution: S(
              L(`In order: $${s.join(", ")}$`, `क्रम में: $${s.join(", ")}$`),
              R`$Q_2 = ${s[3]}$, $Q_1 = ${q1}$, $Q_3 = ${q3}$`,
              R`$\text{IQR} = ${q3} - ${q1} = ${q3 - q1}$`,
              L(`The interquartile range is ${q3 - q1}.`, `अंतरचतुर्थक परिसर ${q3 - q1} है।`),
            ),
          });
        }
        const xs = drawMean(5);
        const m = sum(xs) / 5, ss = sum(xs.map((x) => (x - m) ** 2)), V = ss / 5, sd = Math.sqrt(V);
        const devs = xs.map((x) => `(${x} - ${m})^2`).join(" + ");
        const askSD = v === 3;
        return taskL(lang, {
          text: S(intro(xs), askSD
            ? L(R`Find the standard deviation, using $\sigma^2 = \frac{\sum (x - \bar{x})^2}{n}$.`, R`$\sigma^2 = \frac{\sum (x - \bar{x})^2}{n}$ का उपयोग करके मानक विचलन ज्ञात कीजिए।`) + rnd(sd, lang)
            : L(R`Find the variance $\sigma^2 = \frac{\sum (x - \bar{x})^2}{n}$.`, R`प्रसरण $\sigma^2 = \frac{\sum (x - \bar{x})^2}{n}$ ज्ञात कीजिए।`)).replace("\n", " "),
          answer: askSD
            ? ansN(sd, [[V, L("That is the variance; take its square root.", "यह प्रसरण है; इसका वर्गमूल लीजिए।")], [Math.sqrt(ss / 4), L("The formula given divides by n, not by n − 1.", "दिए गए सूत्र में n से भाग दिया जाता है, n − 1 से नहीं।")]])
            : ansN(V, [[ss / 4, L("The formula given divides by n, not by n − 1.", "दिए गए सूत्र में n से भाग दिया जाता है, n − 1 से नहीं।")], [sd, L("That is the standard deviation; the variance is its square.", "यह मानक विचलन है; प्रसरण इसका वर्ग है।")], [ss, L("Divide the sum of squared deviations by n.", "विचलनों के वर्गों के योग को n से भाग दीजिए।")]]),
          data: { given: [`x_i = ${xs.join(", ")}`, "n = 5"], find: [askSD ? R`\sigma` : R`\sigma^2`] },
          hint: L("Find the mean first, then square each deviation from the mean.", "पहले माध्य ज्ञात कीजिए, फिर माध्य से प्रत्येक विचलन का वर्ग कीजिए।"),
          formula: FVAR,
          solution: S(
            R`$\bar{x} = \frac{${sum(xs)}}{5} = ${m}$`,
            R`$\sum (x - \bar{x})^2 = ${devs} = ${ss}$`,
            R`$\sigma^2 = \frac{${ss}}{5} = ${en(V)}$`,
            askSD ? R`$\sigma = \sqrt{${en(V)}} ${eqs(sd)} ${f2(sd)}$` : "",
            askSD ? L(`The standard deviation is ${f2(sd)}.`, `मानक विचलन ${f2(sd)} है।`) : L(`The variance is ${en(V)}.`, `प्रसरण ${en(V)} है।`),
          ),
        });
      }
      if (level === 2) {
        const v = r.int(0, 3);
        if (v === 0) {
          const c = r.pick(FCTX);
          const x0 = c[0].includes("eggs") ? r.int(2, 4) : r.int(0, 2);
          const xs = [0, 1, 2, 3, 4].map((k) => x0 + k);
          let fs;
          do fs = xs.map(() => r.int(1, 12));
          while (sum(fs) < 15);
          const N = sum(fs), Sfx = sum(xs.map((x, i) => x * fs[i])), Sfx2 = sum(xs.map((x, i) => x * x * fs[i]));
          const m = Sfx / N, V = Sfx2 / N - m * m, sd = Math.sqrt(V);
          const tab = R`$\begin{array}{c|c} x & f \\ \hline ${xs.map((x, i) => `${x} & ${fs[i]}`).join(R` \\ `)} \end{array}$`;
          return taskL(lang, {
            text: L(
              `The table shows ${c[0]} ${N} ${c[1]} (x = number, f = frequency). Find the standard deviation of x.${roundToL(2, lang)}\n${tab}`,
              `सारणी में ${c[2]} ${N} ${c[3]} (x) और बारंबारता (f) दी गई है। x का मानक विचलन ज्ञात कीजिए।${roundToL(2, lang)}\n${tab}`,
            ),
            answer: numM(sd, 2, [
              [V, L("That is the variance; take its square root.", "यह प्रसरण है; इसका वर्गमूल लीजिए।")],
              [Math.sqrt(Sfx2 / N), L("Subtract the square of the mean: $\\sigma^2 = \\frac{\\sum fx^2}{\\sum f} - \\bar{x}^2$.", "माध्य का वर्ग घटाइए: $\\sigma^2 = \\frac{\\sum fx^2}{\\sum f} - \\bar{x}^2$।")],
            ]),
            data: { given: [`x = ${xs.join(", ")}`, `f = ${fs.join(", ")}`], find: [R`\sigma`] },
            hint: L("Make columns fx and fx²; then use the computational formula for the variance.", "fx और fx² के स्तंभ बनाइए; फिर प्रसरण का गणना-सूत्र लगाइए।"),
            formula: R`\sigma^2 = \frac{\sum f x^2}{\sum f} - \bar{x}^2`,
            solution: S(
              R`$\sum f = ${N}$, $\sum fx = ${Sfx}$, $\sum fx^2 = ${Sfx2}$`,
              R`$\bar{x} = \frac{${Sfx}}{${N}} ${eqs(m)} ${f2(m)}$`,
              R`$\sigma^2 = \frac{${Sfx2}}{${N}} - \left(\frac{${Sfx}}{${N}}\right)^2 ${eq4(V)} ${f4(V)}$`,
              R`$\sigma \approx ${en(sd, 2)}$`,
              L(`The standard deviation is about ${en(sd, 2)}.`, `मानक विचलन लगभग ${en(sd, 2)} है।`),
            ),
          });
        }
        if (v === 1) {
          const temp = r.int(0, 1) === 0;
          const askVar = r.int(0, 2) === 0;
          const m = temp ? r.int(5, 28) : r.int(40, 65), s = temp ? r.pick([1.5, 2, 2.5, 3, 4, 5]) : r.pick([4, 5, 6, 8, 10]);
          const k = temp ? 1.8 : r.pick([1.5, 2, 1.2, 0.5]), b = temp ? 32 : r.pick([5, 10, 15, 20]);
          const city = r.pick(CITIES);
          const C = L(...city);
          const sd2 = k * s, V2 = k * k * s * s;
          const ans = askVar ? V2 : sd2;
          const what = askVar ? L("variance", "प्रसरण") : L("standard deviation", "मानक विचलन");
          const text = temp
            ? L(`The daily temperatures in ${C} in one month have mean ${m} °C and standard deviation ${en(s)} °C. Using $F = 1.8C + 32$, find the ${what} of the temperatures in °F.`, `${C} में एक महीने के दैनिक तापमानों का माध्य ${m} °C और मानक विचलन ${en(s)} °C है। $F = 1.8C + 32$ का उपयोग करके °F में तापमानों का ${what} ज्ञात कीजिए।`)
            : L(`In a test in ${C} the marks have mean ${m} and standard deviation ${en(s)}. Every mark is multiplied by ${en(k)} and then ${b} is added. Find the ${what} of the new marks.`, `${C} की एक परीक्षा में अंकों का माध्य ${m} और मानक विचलन ${en(s)} है। प्रत्येक अंक को ${en(k)} से गुणा करके उसमें ${b} जोड़ा जाता है। नए अंकों का ${what} ज्ञात कीजिए।`);
          return taskL(lang, {
            text,
            answer: askVar
              ? ansN(V2, [[k * s * s, L("The variance is multiplied by the square of the factor.", "प्रसरण गुणक के वर्ग से गुणा होता है।")], [V2 + b, L("Adding a constant does not change the spread.", "अचर जोड़ने से फैलाव नहीं बदलता।")], [sd2, L("That is the new standard deviation; square it.", "यह नया मानक विचलन है; इसका वर्ग कीजिए।")]])
              : ansN(sd2, [[sd2 + b, L("Adding a constant shifts all values equally, so it does not change the standard deviation.", "अचर जोड़ने से सभी मान बराबर खिसकते हैं, अतः मानक विचलन नहीं बदलता।")], [k * k * s, L("The standard deviation is multiplied by the factor itself, not by its square.", "मानक विचलन स्वयं गुणक से गुणा होता है, उसके वर्ग से नहीं।")], [s, L("Multiplying by a factor does change the spread.", "किसी गुणक से गुणा करने पर फैलाव बदलता है।")]]),
            data: { given: [R`\bar{x} = ${m}`, R`\sigma = ${en(s)}`, `a = ${en(k)}`, `b = ${b}`], find: [askVar ? R`\sigma_y^2` : R`\sigma_y`] },
            hint: L("For y = ax + b, the constant b shifts the data but does not spread it.", "y = ax + b के लिए अचर b आँकड़ों को खिसकाता है, उनका फैलाव नहीं बदलता।"),
            formula: R`y = ax + b:\ \sigma_y = |a|\sigma_x,\ \sigma_y^2 = a^2\sigma_x^2`,
            solution: S(
              R`$\sigma_y = ${en(k)} \cdot ${en(s)} = ${en(sd2)}$`,
              askVar ? R`$\sigma_y^2 = ${en(sd2)}^2 = ${en(V2)}$` : "",
              L(`The new ${what} is ${en(ans)}.`, `नया ${what} ${en(ans)} है।`),
            ),
          });
        }
        if (v === 2) {
          const n = r.pick([6, 8, 10]);
          const xs = draw(n);
          const Sx = sum(xs), Sx2 = sum(xs.map((x) => x * x));
          const m = Sx / n, V = Sx2 / n - m * m, sd = Math.sqrt(V);
          if (V <= 0) return null;
          return taskL(lang, {
            text: L(
              `For ${ctx.en(n)}, $\\sum x = ${Sx}$ and $\\sum x^2 = ${Sx2}$. Find the standard deviation.${roundToL(2, lang)}`,
              `${ctx.hi(n)} के लिए $\\sum x = ${Sx}$ और $\\sum x^2 = ${Sx2}$ है। मानक विचलन ज्ञात कीजिए।${roundToL(2, lang)}`,
            ),
            answer: numM(sd, 2, [
              [V, L("That is the variance; take its square root.", "यह प्रसरण है; इसका वर्गमूल लीजिए।")],
              [Math.sqrt(Sx2 / n), L("Subtract the square of the mean.", "माध्य का वर्ग घटाइए।")],
              [Math.sqrt(Sx2 / n - m), L("Subtract the square of the mean, not the mean itself.", "माध्य का वर्ग घटाइए, स्वयं माध्य नहीं।")],
            ]),
            data: { given: [`n = ${n}`, R`\sum x = ${Sx}`, R`\sum x^2 = ${Sx2}`], find: [R`\sigma`] },
            hint: L("Variance = mean of the squares minus the square of the mean.", "प्रसरण = वर्गों का माध्य − माध्य का वर्ग।"),
            formula: FVAR2,
            solution: S(
              R`$\bar{x} = \frac{${Sx}}{${n}} ${eq4(m)} ${f4(m)}$`,
              R`$\sigma^2 = \frac{${Sx2}}{${n}} - \bar{x}^2 ${eq4(V)} ${f4(V)}$`,
              R`$\sigma ${eqs(sd)} ${f2(sd)}$`,
              L(`The standard deviation is ${f2(sd)}.`, `मानक विचलन ${f2(sd)} है।`),
            ),
          });
        }
        let xs;
        do xs = draw(11);
        while (new Set(xs).size < 10);
        const s = sortN(xs), q1 = s[2], q3 = s[8];
        return taskL(lang, {
          text: S(intro(xs), L("Find the interquartile range.", "अंतरचतुर्थक परिसर ज्ञात कीजिए।") + IQR_NOTE(L)).replace("\n", " "),
          answer: numM(q3 - q1, null, [
            [Math.abs(xs[8] - xs[2]), L("Arrange the data in order before finding the quartiles.", "चतुर्थक ज्ञात करने से पहले आँकड़ों को क्रम में लगाइए।")],
            [s[10] - s[0], L("That is the range; the interquartile range is $Q_3 - Q_1$.", "यह परिसर है; अंतरचतुर्थक परिसर $Q_3 - Q_1$ है।")],
            [s[7] - s[3], L("With 11 values each half has 5 values, so the quartiles are the 3rd and 9th ordered values.", "11 मानों में प्रत्येक आधे में 5 मान हैं, अतः चतुर्थक क्रम में तीसरा और नौवाँ मान हैं।")],
          ]),
          data: { given: [`x_i = ${xs.join(", ")}`], find: [R`Q_3 - Q_1`] },
          hint: L("Order the 11 values; the median is the 6th value. Each half then has 5 values.", "11 मानों को क्रम में लगाइए; माध्यिका छठा मान है। तब प्रत्येक आधे में 5 मान हैं।"),
          formula: R`\text{IQR} = Q_3 - Q_1`,
          solution: S(
            L(`In order: $${s.join(", ")}$`, `क्रम में: $${s.join(", ")}$`),
            R`$Q_2 = ${s[5]}$, $Q_1 = ${q1}$, $Q_3 = ${q3}$`,
            R`$\text{IQR} = ${q3} - ${q1} = ${q3 - q1}$`,
            L(`The interquartile range is ${q3 - q1}.`, `अंतरचतुर्थक परिसर ${q3 - q1} है।`),
          ),
        });
      }
      const v = r.int(0, 3);
      if (v === 0) {
        const n = r.pick([10, 15, 20, 25]), m = r.int(20, 60), s = r.pick([2, 3, 4, 5, 6]);
        const p = m + r.int(-6, 6); // |p − m| ≤ s√(n − 1), sicer podatki niso mogoči
        let q;
        do q = p + r.int(-10, 10);
        while (q === p);
        const Sx = n * m, Sx2 = n * (s * s + m * m);
        const Sx1 = Sx - p + q, Sx21 = Sx2 - p * p + q * q;
        const m1 = Sx1 / n, V1 = Sx21 / n - m1 * m1, sd1 = Math.sqrt(V1);
        return taskL(lang, {
          text: L(
            `The mean and standard deviation of ${n} observations are ${m} and ${s}. It was later found that one observation was recorded as ${p} instead of ${q}. Find the correct standard deviation.${rnd(sd1, lang)}`,
            `${n} प्रेक्षणों का माध्य और मानक विचलन क्रमशः ${m} और ${s} हैं। बाद में पता चला कि एक प्रेक्षण ${q} के स्थान पर ${p} लिख लिया गया था। सही मानक विचलन ज्ञात कीजिए।${rnd(sd1, lang)}`,
          ),
          answer: ansN(sd1, [
            [Math.sqrt(Sx21 / n - m * m), L("The mean also changes after the correction; use the corrected mean.", "सुधार के बाद माध्य भी बदलता है; सही माध्य का उपयोग कीजिए।")],
            [s, L("Changing one observation changes $\\sum x$ and $\\sum x^2$, so the standard deviation changes.", "एक प्रेक्षण बदलने से $\\sum x$ और $\\sum x^2$ बदलते हैं, अतः मानक विचलन भी बदलता है।")],
            [V1, L("That is the corrected variance; take its square root.", "यह सही प्रसरण है; इसका वर्गमूल लीजिए।")],
          ]),
          data: { given: [`n = ${n}`, R`\bar{x} = ${m}`, R`\sigma = ${s}`, R`x_{\text{wrong}} = ${p}`, R`x_{\text{right}} = ${q}`], find: [R`\sigma'`] },
          hint: L("Recover $\\sum x$ and $\\sum x^2$ from the mean and the standard deviation, then correct both sums.", "माध्य और मानक विचलन से $\\sum x$ और $\\sum x^2$ पुनः प्राप्त कीजिए, फिर दोनों योगों को सुधारिए।"),
          formula: R`\sum x = n\bar{x},\ \sum x^2 = n(\sigma^2 + \bar{x}^2)`,
          solution: S(
            R`$\sum x = ${n} \cdot ${m} = ${Sx}$, $\sum x^2 = ${n}(${s}^2 + ${m}^2) = ${Sx2}$`,
            L("Corrected sums:", "सही योग:"),
            R`$\sum x = ${Sx} - ${p} + ${q} = ${Sx1}$, $\sum x^2 = ${Sx2} - ${p}^2 + ${q}^2 = ${Sx21}$`,
            R`$\bar{x}' = \frac{${Sx1}}{${n}} ${eq4(m1)} ${f4(m1)}$`,
            R`$\sigma'^2 = \frac{${Sx21}}{${n}} - \bar{x}'^2 ${eq4(V1)} ${f4(V1)}$`,
            R`$\sigma' ${eqs(sd1)} ${f2(sd1)}$`,
            L(`The correct standard deviation is ${f2(sd1)}.`, `सही मानक विचलन ${f2(sd1)} है।`),
          ),
        });
      }
      if (v === 1) {
        const city = r.pick(CITIES);
        const n1 = r.int(4, 8) * 5, n2 = r.int(4, 8) * 5;
        const m1 = r.int(45, 70);
        let m2;
        do m2 = r.int(45, 70);
        while (m2 === m1);
        const s1 = r.int(4, 12), s2 = r.int(4, 12);
        const N = n1 + n2, Q = n1 * (s1 * s1 + m1 * m1) + n2 * (s2 * s2 + m2 * m2), M = (n1 * m1 + n2 * m2) / N;
        const V = Q / N - M * M, sd = Math.sqrt(V);
        return taskL(lang, {
          text: L(
            `In a school in ${city[0]}, class A has ${n1} students with mean mark ${m1} and standard deviation ${s1}; class B has ${n2} students with mean mark ${m2} and standard deviation ${s2}. Find the standard deviation of the marks of all ${N} students.${rnd(sd, lang)}`,
            `${city[1]} के एक विद्यालय में कक्षा A के ${n1} विद्यार्थियों के अंकों का माध्य ${m1} और मानक विचलन ${s1} है; कक्षा B के ${n2} विद्यार्थियों के अंकों का माध्य ${m2} और मानक विचलन ${s2} है। सभी ${N} विद्यार्थियों के अंकों का मानक विचलन ज्ञात कीजिए।${rnd(sd, lang)}`,
          ),
          answer: ansN(sd, [
            [(n1 * s1 + n2 * s2) / N, L("Standard deviations cannot be averaged; combine $\\sum x^2$ of both classes.", "मानक विचलनों का औसत नहीं लिया जा सकता; दोनों कक्षाओं के $\\sum x^2$ को जोड़िए।")],
            [Math.sqrt((n1 * s1 * s1 + n2 * s2 * s2) / N), L("The difference between the two class means also adds to the spread.", "दोनों कक्षाओं के माध्यों का अंतर भी फैलाव बढ़ाता है।")],
          ]),
          data: { given: [`n_1 = ${n1}`, R`\bar{x}_1 = ${m1}`, R`\sigma_1 = ${s1}`, `n_2 = ${n2}`, R`\bar{x}_2 = ${m2}`, R`\sigma_2 = ${s2}`], find: [R`\sigma`] },
          hint: L("Find $\\sum x$ and $\\sum x^2$ for each class, add them, then use the formula for the variance.", "प्रत्येक कक्षा के लिए $\\sum x$ और $\\sum x^2$ ज्ञात कीजिए, उन्हें जोड़िए, फिर प्रसरण का सूत्र लगाइए।"),
          formula: R`\sum x^2 = n(\sigma^2 + \bar{x}^2),\ \sigma^2 = \frac{\sum x^2}{n} - \bar{x}^2`,
          solution: S(
            R`$\sum x = ${n1} \cdot ${m1} + ${n2} \cdot ${m2} = ${n1 * m1 + n2 * m2}$, $\bar{x} = \frac{${n1 * m1 + n2 * m2}}{${N}} ${eq4(M)} ${f4(M)}$`,
            R`$\sum x^2 = ${n1}(${s1}^2 + ${m1}^2) + ${n2}(${s2}^2 + ${m2}^2) = ${Q}$`,
            R`$\sigma^2 = \frac{${Q}}{${N}} - \bar{x}^2 ${eq4(V)} ${f4(V)}$`,
            R`$\sigma ${eqs(sd)} ${f2(sd)}$`,
            L(`The combined standard deviation is ${f2(sd)}.`, `संयुक्त मानक विचलन ${f2(sd)} है।`),
          ),
        });
      }
      if (v === 2) {
        let known, a, b, S1, Q1, guard = 0;
        do {
          known = Array.from({ length: 5 }, () => r.int(2, 20));
          a = r.int(2, 20);
          b = r.int(2, 20);
          S1 = sum(known) + a + b;
          Q1 = sum(known.map((x) => x * x)) + a * a + b * b;
          guard++;
        } while ((S1 % 7 !== 0 || Q1 % 7 !== 0 || a === b) && guard < 5000);
        if (S1 % 7 !== 0 || Q1 % 7 !== 0 || a === b) return null;
        const M = S1 / 7, V = Q1 / 7 - M * M;
        const sk = sum(known), qk = sum(known.map((x) => x * x));
        const big = Math.max(a, b), small = Math.min(a, b);
        const s2 = a + b, q2 = a * a + b * b, d = big - small;
        return taskL(lang, {
          text: L(
            `The mean and variance of 7 observations are ${M} and ${V}. Five of the observations are $${known.join(", ")}$. Find the larger of the remaining two observations.`,
            `7 प्रेक्षणों का माध्य और प्रसरण क्रमशः ${M} और ${V} हैं। इनमें से पाँच प्रेक्षण $${known.join(", ")}$ हैं। शेष दो प्रेक्षणों में से बड़ा प्रेक्षण ज्ञात कीजिए।`,
          ),
          answer: numM(big, null, [
            [small, L("That is the smaller of the two observations.", "यह दोनों में से छोटा प्रेक्षण है।")],
            [s2 / 2, L("The two observations are not equal; use $\\sum x^2$ to find their difference.", "दोनों प्रेक्षण बराबर नहीं हैं; उनका अंतर ज्ञात करने के लिए $\\sum x^2$ का उपयोग कीजिए।")],
          ]),
          data: { given: ["n = 7", R`\bar{x} = ${M}`, R`\sigma^2 = ${V}`, `x_i = ${known.join(", ")}`], find: [R`\max(a, b)`] },
          hint: L("Call the unknown values a and b. The mean gives a + b, the variance gives a² + b².", "अज्ञात मानों को a और b मानिए। माध्य से a + b और प्रसरण से a² + b² मिलता है।"),
          formula: FVAR2,
          solution: S(
            R`$\sum x = 7 \cdot ${M} = ${S1} \Rightarrow a + b = ${S1} - ${sk} = ${s2}$`,
            R`$\sum x^2 = 7(${V} + ${M}^2) = ${Q1} \Rightarrow a^2 + b^2 = ${Q1} - ${qk} = ${q2}$`,
            R`$(a - b)^2 = 2(a^2 + b^2) - (a + b)^2 = ${2 * q2} - ${s2 * s2} = ${d * d}$, $a - b = ${d}$`,
            R`$a = \frac{${s2} + ${d}}{2} = ${big}$, $b = ${small}$`,
            L(`The larger observation is ${big}.`, `बड़ा प्रेक्षण ${big} है।`),
          ),
        });
      }
      const k = r.pick([-4, -3, -2, 2, 3, 4, 5]), b = r.pick([-7, -5, 3, 4, 6, 10]);
      const askVar = r.int(0, 1) === 1;
      const ak = Math.abs(k);
      const bS = b < 0 ? `- ${-b}` : `+ ${b}`;
      const answer = askVar
        ? choiceWhy(r, R`$${k * k}\sigma^2$`, [
          [R`$${ak}\sigma^2$`, L("Variance is in squared units, so it is multiplied by $k^2$.", "प्रसरण वर्ग इकाइयों में होता है, अतः यह $k^2$ से गुणा होता है।")],
          [R`$${k * k}\sigma^2 ${bS}$`, L("Adding a constant does not change the variance.", "अचर जोड़ने से प्रसरण नहीं बदलता।")],
          [R`$\sigma^2$`, L("Multiplying every value by a constant does change the spread.", "प्रत्येक मान को किसी अचर से गुणा करने पर फैलाव बदलता है।")],
        ])
        : choiceWhy(r, R`$${ak}\sigma$`, [
          [R`$${k}\sigma ${bS}$`, L("Adding a constant shifts every value equally, so it does not change the spread.", "अचर जोड़ने से सभी मान बराबर खिसकते हैं, अतः फैलाव नहीं बदलता।")],
          [R`$${k * k}\sigma$`, L("$k^2$ applies to the variance, not to the standard deviation.", "$k^2$ प्रसरण पर लागू होता है, मानक विचलन पर नहीं।")],
          k < 0 ? [R`$${k}\sigma$`, L("A standard deviation can never be negative; use $|k|$.", "मानक विचलन कभी ऋणात्मक नहीं होता; $|k|$ लीजिए।")] : [R`$\sigma ${bS}$`, L("Multiplying by k scales the spread; adding b does not change it.", "k से गुणा करने पर फैलाव बदलता है; b जोड़ने से नहीं।")],
        ]);
      return taskL(lang, {
        text: L(
          `A data set has standard deviation $\\sigma$. Every value x is replaced by $y = ${k}x ${bS}$. What is the ${askVar ? "variance" : "standard deviation"} of the new values?`,
          `किसी आँकड़ा-समूह का मानक विचलन $\\sigma$ है। प्रत्येक मान x के स्थान पर $y = ${k}x ${bS}$ लिया जाता है। नए मानों का ${askVar ? "प्रसरण" : "मानक विचलन"} क्या है?`,
        ),
        answer,
        hint: L("Adding a constant moves the data; multiplying stretches it. Spread is never negative.", "अचर जोड़ने से आँकड़े खिसकते हैं; गुणा करने से फैलते हैं। फैलाव कभी ऋणात्मक नहीं होता।"),
        solution: S(
          R`$y - \bar{y} = ${k}(x - \bar{x})$ ${L("(the constant cancels)", "(अचर कट जाता है)")}`,
          R`$\sigma_y^2 = ${k * k}\sigma^2$, $\sigma_y = ${ak}\sigma$`,
          L(`Answer: $${askVar ? `${k * k}\\sigma^2` : `${ak}\\sigma`}$.`, `उत्तर: $${askVar ? `${k * k}\\sigma^2` : `${ak}\\sigma`}$।`),
        ),
      });
    },
  },

  // ───────────────────────── Normal distribution ─────────────────────────
  {
    id: "exg-mat-normal",
    topics: [T("normal-distribution")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const c = r.pick(NCTX);
      const mu = pickMu(r, c.mu), sig = r.pick(c.sig);
      const uT = c.u ? ` ${c.u}` : "";
      const X = L(` (X${c.u ? `, in ${c.u}` : ""})`, ` (X${c.u ? `, ${c.u} में` : ""})`);
      const intro = L(`${c.en}${X} are normally distributed with mean ${mu}${uT} and standard deviation ${sig}${uT}.`, `${c.hi}${X} प्रसामान्य रूप से बंटित हैं, जिनका माध्य ${mu}${uT} और मानक विचलन ${sig}${uT} है।`);
      const table = (zs) => [...zs].sort((a, b) => a - b).map((z) => `$${PhiTex(z)}$`).join(", ");
      const use = (zs) => L(` (Use ${table(zs)}.)`, ` (दिया है: ${table(zs)}।)`);
      const others = (ex, k) => r.shuffle(ZS.filter((x) => !ex.includes(x))).slice(0, k);
      const FPhi = R`P(Z < -z) = 1 - \Phi(z)`;
      if (level <= 2) {
        const v = level === 1 ? r.int(0, 2) : r.int(3, 6);
        if (v === 1) {
          const z = r.pick(ZS), sgn = r.pick([1, -1]);
          const x = mu + sgn * z * sig, zz = sgn * z;
          const xT = en(x);
          return taskL(lang, {
            text: S(intro, L(`Find the z-score of the value ${xT}${uT}.`, `मान ${xT}${uT} का z-प्राप्तांक ज्ञात कीजिए।`)).replace("\n", " "),
            answer: numM(zz, null, [
              [-zz, L("The z-score is (x − μ)/σ; check the order of the subtraction.", "z-प्राप्तांक (x − μ)/σ है; घटाने का क्रम जाँचिए।")],
              [(x - mu) / (sig * sig), L("Divide by the standard deviation σ, not by the variance σ².", "मानक विचलन σ से भाग दीजिए, प्रसरण σ² से नहीं।")],
              [x / sig, L("Subtract the mean before dividing by σ.", "σ से भाग देने से पहले माध्य घटाइए।")],
            ]),
            data: { given: [`x = ${xT}`, R`\mu = ${mu}`, R`\sigma = ${sig}`], find: ["z"] },
            hint: L("The z-score tells how many standard deviations the value is from the mean.", "z-प्राप्तांक बताता है कि मान माध्य से कितने मानक विचलन दूर है।"),
            formula: FZ,
            solution: S(R`$z = \frac{${xT} - ${mu}}{${sig}} = \frac{${en(x - mu)}}{${sig}} = ${en(zz)}$`, L(`The z-score is ${en(zz)}.`, `z-प्राप्तांक ${en(zz)} है।`)),
          });
        }
        if (v === 0 || v === 2 || v === 3) {
          const z = r.pick(ZS);
          const below = v === 3;
          const a = below ? mu - z * sig : mu + z * sig;
          const op = v === 0 ? "<" : v === 2 ? ">" : r.pick(["<", ">"]);
          const P = P4(z);
          // a > μ: P(X<a) = Φ, P(X>a) = 1 − Φ; a < μ: obratno
          const ans = r4((op === "<") !== below ? P : 1 - P);
          const wrong = r4(1 - ans);
          const zs = [z, ...others([z], 2)];
          return taskL(lang, {
            text: S(intro, L(`Find $P(X ${op} ${en(a)})$.`, `$P(X ${op} ${en(a)})$ ज्ञात कीजिए।`) + use(zs)).replace("\n", " "),
            answer: numM(ans, 4, [
              [wrong, below
                ? L("For a value below the mean, z is negative: use $\\Phi(-z) = 1 - \\Phi(z)$ and check which tail you need.", "माध्य से छोटे मान के लिए z ऋणात्मक है: $\\Phi(-z) = 1 - \\Phi(z)$ लगाइए और जाँचिए कि कौन-सी पूँछ चाहिए।")
                : L("$\\Phi(z)$ is the area to the left of z; check which side you need.", "$\\Phi(z)$, z के बाईं ओर का क्षेत्रफल है; जाँचिए कि कौन-सी ओर चाहिए।")],
            ]),
            data: { given: [R`\mu = ${mu}`, R`\sigma = ${sig}`, PhiTex(z)], find: [`P(X ${op} ${en(a)})`] },
            hint: L("Standardise first: $z = (x - \\mu)/\\sigma$. Then sketch the bell curve and shade the region you need.", "पहले मानकीकरण कीजिए: $z = (x - \\mu)/\\sigma$। फिर घंटी-वक्र बनाकर आवश्यक क्षेत्र छायांकित कीजिए।"),
            formula: [FZ, FPhi],
            solution: S(
              R`$z = \frac{${en(a)} - ${mu}}{${sig}} = ${en(below ? -z : z)}$`,
              op === "<"
                ? (below ? R`$P(Z < ${en(-z)}) = 1 - \Phi(${en(z)}) = 1 - ${en(P, 4)} = ${en(ans, 4)}$` : R`$P(Z < ${en(z)}) = \Phi(${en(z)}) = ${en(P, 4)}$`)
                : (below ? R`$P(Z > ${en(-z)}) = P(Z < ${en(z)}) = \Phi(${en(z)}) = ${en(P, 4)}$` : R`$P(Z > ${en(z)}) = 1 - \Phi(${en(z)}) = 1 - ${en(P, 4)} = ${en(ans, 4)}$`),
              L(`The probability is ${en(ans, 4)}.`, `प्रायिकता ${en(ans, 4)} है।`),
            ),
          });
        }
        if (v === 4 || v === 5) {
          let z1, z2;
          do {
            z1 = r.pick(ZS);
            z2 = r.pick(ZS);
          } while (z1 === z2);
          const both = v === 5;
          let lo, hi, ans, line;
          const P1 = P4(z1), P2 = P4(z2);
          if (both) {
            const [za, zb] = z1 < z2 ? [z1, z2] : [z2, z1];
            lo = mu + za * sig;
            hi = mu + zb * sig;
            ans = r4(P4(zb) - P4(za));
            line = S(R`$z_1 = ${en(za)}$, $z_2 = ${en(zb)}$`, R`$P = \Phi(${en(zb)}) - \Phi(${en(za)}) = ${en(P4(zb), 4)} - ${en(P4(za), 4)} = ${en(ans, 4)}$`);
          } else {
            lo = mu - z1 * sig;
            hi = mu + z2 * sig;
            ans = r4(P2 + P1 - 1);
            line = S(R`$z_1 = ${en(-z1)}$, $z_2 = ${en(z2)}$`, R`$P = \Phi(${en(z2)}) - (1 - \Phi(${en(z1)})) = ${en(P2, 4)} + ${en(P1, 4)} - 1 = ${en(ans, 4)}$`);
          }
          const zs = [z1, z2, ...others([z1, z2], 1)];
          const list = both
            ? [[r4(P1 + P2 - 1), L("Both values are above the mean; subtract the two Φ values.", "दोनों मान माध्य से ऊपर हैं; दोनों Φ मानों को घटाइए।")], [r4(1 - ans), L("You found the area outside the interval.", "आपने अंतराल के बाहर का क्षेत्रफल ज्ञात किया है।")]]
            : [[r4(Math.abs(P2 - P1)), L("The lower value is below the mean, so its z is negative: $\\Phi(-z) = 1 - \\Phi(z)$.", "निचला मान माध्य से नीचे है, अतः उसका z ऋणात्मक है: $\\Phi(-z) = 1 - \\Phi(z)$।")], [r4(P1 + P2), L("A probability cannot exceed 1; subtract the area below the lower value.", "प्रायिकता 1 से अधिक नहीं हो सकती; निचले मान के नीचे का क्षेत्रफल घटाइए।")]];
          return taskL(lang, {
            text: S(intro, L(`Find $P(${en(lo)} < X < ${en(hi)})$.`, `$P(${en(lo)} < X < ${en(hi)})$ ज्ञात कीजिए।`) + use(zs)).replace("\n", " "),
            answer: numM(ans, 4, list),
            data: { given: [R`\mu = ${mu}`, R`\sigma = ${sig}`, PhiTex(z1), PhiTex(z2)], find: [`P(${en(lo)} < X < ${en(hi)})`] },
            hint: L("Standardise both ends, then use P(a < Z < b) = Φ(b) − Φ(a).", "दोनों सिरों का मानकीकरण कीजिए, फिर P(a < Z < b) = Φ(b) − Φ(a) लगाइए।"),
            formula: [FZ, R`P(a < Z < b) = \Phi(b) - \Phi(a)`],
            solution: S(line, L(`The probability is ${en(ans, 4)}.`, `प्रायिकता ${en(ans, 4)} है।`)),
          });
        }
        // v === 6: pričakovano število
        const z = r.pick(ZS);
        const a = mu + z * sig, N = r.pick([200, 250, 400, 500, 800, 1000, 1200]);
        const P = P4(z), p = r4(1 - P), cnt = Math.round(N * p);
        const ci = NCTX.indexOf(c);
        const item = L(["men", "mangoes", "bulbs", "students", "candidates", "cows"][ci], ["पुरुषों", "आमों", "बल्बों", "विद्यार्थियों", "परीक्षार्थियों", "गायों"][ci]);
        const more = ["are taller than", "are heavier than", "last longer than", "take longer than", "score more than", "give more than"][ci];
        return taskL(lang, {
          text: S(intro, L(`Out of ${N} ${item}, about how many ${more} ${en(a)}${uT}? Round to the nearest whole number.`, `${N} ${item} में से लगभग कितनों के लिए X का मान ${en(a)}${uT} से अधिक है? निकटतम पूर्ण संख्या तक पूर्णांकित कीजिए।`) + use([z, ...others([z], 2)])).replace("\n", " "),
          answer: numM(cnt, 0, [
            [Math.round(N * P), L("$\\Phi(z)$ gives the proportion below the value; you need the proportion above it.", "$\\Phi(z)$ मान से नीचे का अनुपात देता है; आपको उससे ऊपर का अनुपात चाहिए।")],
          ]),
          data: { given: [R`\mu = ${mu}`, R`\sigma = ${sig}`, `N = ${N}`, PhiTex(z)], find: [R`N \cdot P(X > ${en(a)})`] },
          hint: L("Find the probability for one item, then multiply by the number of items.", "पहले एक इकाई की प्रायिकता ज्ञात कीजिए, फिर इकाइयों की संख्या से गुणा कीजिए।"),
          formula: [FZ, R`\text{expected number} = N \cdot p`],
          solution: S(
            R`$z = \frac{${en(a)} - ${mu}}{${sig}} = ${en(z)}$`,
            R`$P(X > ${en(a)}) = 1 - ${en(P, 4)} = ${en(p, 4)}$`,
            R`$${N} \cdot ${en(p, 4)} = ${en(N * p, 2)} \approx ${cnt}$`,
            L(`About ${cnt} ${item}.`, `अपेक्षित संख्या लगभग ${cnt} है।`),
          ),
        });
      }
      const v = r.int(0, 3);
      if (v === 0) {
        const [p, z] = r.pick(INV);
        const dir = r.int(0, 3);
        const op = dir < 2 ? "<" : ">";
        const prob = dir === 0 || dir === 2 ? p : r4(1 - p);
        const plus = dir === 1 || dir === 2;
        const k = mu + (plus ? z : -z) * sig, kw = mu + (plus ? -z : z) * sig;
        return taskL(lang, {
          text: S(intro, L(`Find k such that $P(X ${op} k) = ${en(prob)}$.`, `k ज्ञात कीजिए जिससे $P(X ${op} k) = ${en(prob)}$ हो।`) + L(` (Use $\\Phi(${en(z)}) = ${en(1 - p)}$.)`, ` (दिया है: $\\Phi(${en(z)}) = ${en(1 - p)}$।)`) + roundToL(2, lang)).replace("\n", " "),
          answer: numM(k, 2, [
            [kw, L("Decide first whether k is above or below the mean: for a lower-tail probability below 0.5, z is negative.", "पहले तय कीजिए कि k माध्य से ऊपर है या नीचे: 0.5 से कम निचली पूँछ की प्रायिकता के लिए z ऋणात्मक है।")],
            [mu + z, L("Multiply z by the standard deviation before adding to the mean.", "माध्य में जोड़ने से पहले z को मानक विचलन से गुणा कीजिए।")],
          ]),
          data: { given: [R`\mu = ${mu}`, R`\sigma = ${sig}`, `P(X ${op} k) = ${en(prob)}`, R`\Phi(${en(z)}) = ${en(1 - p)}`], find: ["k"] },
          hint: L("Sketch the curve: is k to the left or to the right of the mean? That fixes the sign of z.", "वक्र बनाइए: k माध्य के बाईं ओर है या दाईं ओर? इससे z का चिह्न तय होता है।"),
          formula: R`k = \mu + z\sigma`,
          solution: S(
            plus
              ? L(`The area to the left of k is ${en(1 - p)} > 0.5, so k is above the mean: $z = ${en(z)}$.`, `k के बाईं ओर का क्षेत्रफल ${en(1 - p)} > 0.5 है, अतः k माध्य से ऊपर है: $z = ${en(z)}$।`)
              : L(`The area to the left of k is ${en(p)} < 0.5, so k is below the mean: $z = ${en(-z)}$.`, `k के बाईं ओर का क्षेत्रफल ${en(p)} < 0.5 है, अतः k माध्य से नीचे है: $z = ${en(-z)}$।`),
            R`$k = ${mu} ${plus ? "+" : "-"} ${en(z)} \cdot ${sig} ${eqs(k)} ${f2(k)}$`,
            L(`k ≈ ${f2(k)}${uT}.`, `k ≈ ${f2(k)}${uT}।`),
          ),
        });
      }
      if (v === 1) {
        const [p, z] = r.pick(INV);
        const upper = r.int(0, 1) === 0;
        const a = upper ? Math.round(mu + z * sig) : Math.round(mu - z * sig);
        if (a === mu) return null;
        const s = Math.abs(a - mu) / z;
        const op = upper ? ">" : "<";
        return taskL(lang, {
          text: L(
            `${c.en}${X} are normally distributed with mean ${mu}${uT}. Given that $P(X ${op} ${a}) = ${en(p)}$, find the standard deviation. (Use $\\Phi(${en(z)}) = ${en(1 - p)}$.)${roundToL(2, lang)}`,
            `${c.hi}${X} प्रसामान्य रूप से बंटित हैं, जिनका माध्य ${mu}${uT} है। यदि $P(X ${op} ${a}) = ${en(p)}$ है, तो मानक विचलन ज्ञात कीजिए। (दिया है: $\\Phi(${en(z)}) = ${en(1 - p)}$।)${roundToL(2, lang)}`,
          ),
          answer: numM(s, 2, [
            [Math.abs(a - mu) * z, L("Divide by z, do not multiply.", "z से भाग दीजिए, गुणा नहीं।")],
            [Math.abs(a - mu) / p, L("Divide by the z-value, not by the probability.", "प्रायिकता से नहीं, z-मान से भाग दीजिए।")],
          ]),
          data: { given: [R`\mu = ${mu}`, `P(X ${op} ${a}) = ${en(p)}`, R`\Phi(${en(z)}) = ${en(1 - p)}`], find: [R`\sigma`] },
          hint: L("Find the z-value of the given point, then use $z = (x - \\mu)/\\sigma$ to solve for σ.", "दिए गए बिंदु का z-मान ज्ञात कीजिए, फिर $z = (x - \\mu)/\\sigma$ से σ हल कीजिए।"),
          formula: FZ,
          solution: S(
            upper ? R`$P(Z > z) = ${en(p)} \Rightarrow z = ${en(z)}$` : R`$P(Z < z) = ${en(p)} \Rightarrow z = ${en(-z)}$`,
            R`$${en(upper ? z : -z)} = \frac{${a} - ${mu}}{\sigma}$`,
            R`$\sigma = \frac{${a - mu}}{${en(upper ? z : -z)}} ${eqs(s)} ${f2(s)}$`,
            L(`The standard deviation is about ${f2(s)}${uT}.`, `मानक विचलन लगभग ${f2(s)}${uT} है।`),
          ),
        });
      }
      if (v === 2) {
        const [[p1, z1], [p2, z2]] = r.shuffle(INV).slice(0, 2);
        const a = Math.round(mu - z1 * sig), b = Math.round(mu + z2 * sig);
        const s = (b - a) / (z1 + z2), m = a + z1 * s;
        const askMu = r.int(0, 1) === 0;
        const pc1 = en(p1 * 100), pc2 = en(p2 * 100);
        const what = askMu ? L("mean", "माध्य") : L("standard deviation", "मानक विचलन");
        return taskL(lang, {
          text: L(
            `${c.en}${X} are normally distributed. ${pc1}% of the values are below ${a}${uT} and ${pc2}% are above ${b}${uT}. Find the ${what}. (Use $\\Phi(${en(z1)}) = ${en(1 - p1)}$ and $\\Phi(${en(z2)}) = ${en(1 - p2)}$.)${roundToL(2, lang)}`,
            `${c.hi}${X} प्रसामान्य रूप से बंटित हैं। ${pc1}% मान ${a}${uT} से कम और ${pc2}% मान ${b}${uT} से अधिक हैं। ${what} ज्ञात कीजिए। (दिया है: $\\Phi(${en(z1)}) = ${en(1 - p1)}$ और $\\Phi(${en(z2)}) = ${en(1 - p2)}$।)${roundToL(2, lang)}`,
          ),
          answer: askMu
            ? numM(m, 2, [[(a + b) / 2, L("The two tail probabilities differ, so the mean is not halfway between the values.", "दोनों पूँछों की प्रायिकताएँ अलग हैं, अतः माध्य दोनों मानों के ठीक बीच में नहीं है।")], [a - z1 * s, L("The value with the small lower-tail probability is below the mean, so its z is negative.", "छोटी निचली पूँछ वाली प्रायिकता का मान माध्य से नीचे है, अतः उसका z ऋणात्मक है।")]])
            : numM(s, 2, [[Math.abs((b - a) / (z2 - z1)), L("The lower value has a negative z: $\\mu - z_1\\sigma = a$.", "निचले मान का z ऋणात्मक है: $\\mu - z_1\\sigma = a$।")], [(b - a) / 2, L("Set up two equations with the z-values; σ is not half the distance between the values.", "z-मानों के साथ दो समीकरण बनाइए; σ दोनों मानों की दूरी का आधा नहीं है।")]]),
          data: { given: [`P(X < ${a}) = ${pc1}\\%`, `P(X > ${b}) = ${pc2}\\%`, R`\Phi(${en(z1)}) = ${en(1 - p1)}`, R`\Phi(${en(z2)}) = ${en(1 - p2)}`], find: [askMu ? R`\mu` : R`\sigma`] },
          hint: L("Write two equations of the form $x = \\mu + z\\sigma$, one for each value, and solve them simultaneously.", "प्रत्येक मान के लिए $x = \\mu + z\\sigma$ के रूप का एक समीकरण लिखिए और दोनों को साथ-साथ हल कीजिए।"),
          formula: R`x = \mu + z\sigma`,
          solution: S(
            R`$\mu - ${en(z1)}\sigma = ${a}$, $\mu + ${en(z2)}\sigma = ${b}$`,
            R`$${en(r4(z1 + z2))}\sigma = ${b - a} \Rightarrow \sigma ${eqs(s)} ${en(s, 4)}$`,
            R`$\mu = ${a} + ${en(z1)}\sigma ${eqs(m)} ${en(m, 4)}$`,
            L(`The ${what} is about ${en(askMu ? m : s, 2)}${uT}.`, `${what} लगभग ${en(askMu ? m : s, 2)}${uT} है।`),
          ),
        });
      }
      // past: N(μ, σ²) z varianco
      const pairs = [];
      for (const s0 of [2, 4, 5]) for (const z of ZS) if (Number.isInteger(Math.round((z / s0) * 1e6) / 1e4) && z / s0 >= 0.2) pairs.push([s0, z]);
      const [s0, z] = r.pick(pairs);
      const zw = z / s0;
      const a = mu + z * s0;
      const up = r.int(0, 1) === 0;
      const P = P4(z), ans = r4(up ? 1 - P : P), wrong = r4(up ? 1 - P4(zw) : P4(zw));
      const zs = [z, zw, ...others([z, zw], 1)];
      return taskL(lang, {
        text: L(
          `${c.en} are modelled by $X \\sim N(${mu}, ${s0 * s0})$. Find $P(X ${up ? ">" : "<"} ${en(a)})$.` + use(zs),
          `${c.hi} का प्रतिरूप $X \\sim N(${mu}, ${s0 * s0})$ है। $P(X ${up ? ">" : "<"} ${en(a)})$ ज्ञात कीजिए।` + use(zs),
        ),
        answer: numM(ans, 4, [
          [wrong, L("In $N(\\mu, \\sigma^2)$ the second number is the variance; take its square root to get σ.", "$N(\\mu, \\sigma^2)$ में दूसरी संख्या प्रसरण है; σ के लिए उसका वर्गमूल लीजिए।")],
          [r4(1 - ans), L("Check which side of the value you need.", "जाँचिए कि मान की किस ओर का क्षेत्रफल चाहिए।")],
        ]),
        data: { given: [R`\mu = ${mu}`, R`\sigma^2 = ${s0 * s0}`, PhiTex(z)], find: [`P(X ${up ? ">" : "<"} ${en(a)})`] },
        hint: L("Read the notation carefully: $N(\\mu, \\sigma^2)$.", "संकेतन ध्यान से पढ़िए: $N(\\mu, \\sigma^2)$।"),
        formula: [FZ, FPhi],
        solution: S(
          R`$\sigma = \sqrt{${s0 * s0}} = ${s0}$`,
          R`$z = \frac{${en(a)} - ${mu}}{${s0}} = ${en(z)}$`,
          up ? R`$P(Z > ${en(z)}) = 1 - ${en(P, 4)} = ${en(ans, 4)}$` : R`$P(Z < ${en(z)}) = ${en(P, 4)}$`,
          L(`The probability is ${en(ans, 4)}.`, `प्रायिकता ${en(ans, 4)} है।`),
        ),
      });
    },
  },

  // ───────────────────────── Conic sections ─────────────────────────
  {
    id: "exg-mat-conics",
    topics: [T("conic-sections")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const FE = R`e = \frac{c}{a}`;
      const fracNote = L(" Give the answer as a fraction in lowest terms if it is not a whole number.", " यदि उत्तर पूर्णांक नहीं है, तो उसे न्यूनतम पदों में भिन्न के रूप में लिखिए।");
      const ellEq = (a, b) => R`\frac{x^2}{${a * a}} + \frac{y^2}{${b * b}} = 1`;
      const hypEq = (a, b) => R`\frac{x^2}{${a * a}} - \frac{y^2}{${b * b}} = 1`;
      if (level === 1) {
        const v = r.int(0, 2);
        if (v === 0) {
          const form = r.int(0, 3), a = r.int(1, 6), q = r.int(0, 2);
          const A = 4 * a, s = form % 2 === 0 ? 1 : -1, ax = form < 2 ? "x" : "y", oth = ax === "x" ? "y" : "x";
          const eq = ax === "x" ? `y^2 = ${s < 0 ? "-" : ""}${A}x` : `x^2 = ${s < 0 ? "-" : ""}${A}y`;
          const F = ax === "x"
            ? (s > 0 ? R`y^2 = 4ax:\ S(a, 0),\ x = -a,\ \text{LR} = 4a` : R`y^2 = -4ax:\ S(-a, 0),\ x = a,\ \text{LR} = 4a`)
            : (s > 0 ? R`x^2 = 4ay:\ S(0, a),\ y = -a,\ \text{LR} = 4a` : R`x^2 = -4ay:\ S(0, -a),\ y = a,\ \text{LR} = 4a`);
          const focus = ax === "x" ? `(${s * a}, 0)` : `(0, ${s * a})`;
          const texts = [
            [`Find the ${ax}-coordinate of the focus of the parabola $${eq}$.`, `परवलय $${eq}$ की नाभि का ${ax}-निर्देशांक ज्ञात कीजिए।`],
            [`The directrix of the parabola $${eq}$ is the line $${ax} = k$. Find k.`, `परवलय $${eq}$ की नियता रेखा $${ax} = k$ है। k ज्ञात कीजिए।`],
            [`Find the length of the latus rectum of the parabola $${eq}$.`, `परवलय $${eq}$ के नाभिलंब की लंबाई ज्ञात कीजिए।`],
          ];
          const ans = [s * a, -s * a, A][q];
          const mis = [
            [[s * A, L("$4a$ is the coefficient; a is a quarter of it.", "$4a$ गुणांक है; a उसका एक-चौथाई है।")], [-s * a, L(`The focus lies on the side towards which the parabola opens (the sign of the ${oth === "y" ? "x" : "y"}-term).`, `नाभि उस ओर होती है जिधर परवलय खुलता है (${oth === "y" ? "x" : "y"} वाले पद का चिह्न)।`)]],
            [[s * a, L("The directrix is on the opposite side of the vertex from the focus.", "नियता शीर्ष के उस ओर होती है जो नाभि के विपरीत है।")], [-s * A, L("$4a$ is the coefficient; a is a quarter of it.", "$4a$ गुणांक है; a उसका एक-चौथाई है।")]],
            [[a, L("That is a; the latus rectum has length 4a.", "यह a है; नाभिलंब की लंबाई 4a होती है।")], [2 * a, L("The latus rectum is the full chord through the focus: length 4a.", "नाभिलंब नाभि से होकर जाने वाली पूरी जीवा है: लंबाई 4a।")]],
          ][q];
          return taskL(lang, {
            text: L(...texts[q]),
            answer: numM(ans, null, mis),
            data: { given: [`4a = ${A}`], find: [["S", "k", R`\text{LR}`][q]] },
            hint: L(`Compare with the standard form to find a.`, `मानक रूप से तुलना करके a ज्ञात कीजिए।`),
            formula: F,
            solution: S(
              R`$4a = ${A} \Rightarrow a = ${a}$`,
              [L(`Focus $S${focus}$, so the ${ax}-coordinate is ${ans}.`, `नाभि $S${focus}$, अतः ${ax}-निर्देशांक ${ans} है।`), L(`Directrix: $${ax} = ${ans}$, so k = ${ans}.`, `नियता: $${ax} = ${ans}$, अतः k = ${ans}।`), L(`Latus rectum = 4a = ${A}.`, `नाभिलंब = 4a = ${A}।`)][q],
            ),
          });
        }
        if (v === 1) {
          const [a, b, c] = r.pick(ELL);
          const askE = r.int(0, 1) === 0;
          return taskL(lang, {
            text: askE
              ? L(`Find the eccentricity of the ellipse $${ellEq(a, b)}$.${fracNote}`, `दीर्घवृत्त $${ellEq(a, b)}$ की उत्केंद्रता ज्ञात कीजिए।${fracNote}`)
              : L(`Find the distance between the foci of the ellipse $${ellEq(a, b)}$.`, `दीर्घवृत्त $${ellEq(a, b)}$ की नाभियों के बीच की दूरी ज्ञात कीजिए।`),
            answer: askE
              ? fractionM(c, a, [[b / a, L("e = c/a, where $c^2 = a^2 - b^2$; it is not b/a.", "e = c/a, जहाँ $c^2 = a^2 - b^2$; यह b/a नहीं है।")], [Math.sqrt(a * a + b * b) / a, L("For an ellipse $c^2 = a^2 - b^2$; the plus sign is for a hyperbola.", "दीर्घवृत्त के लिए $c^2 = a^2 - b^2$; धन चिह्न अतिपरवलय के लिए है।")]])
              : numM(2 * c, null, [[c, L("That is the distance from the centre to one focus.", "यह केंद्र से एक नाभि तक की दूरी है।")], [2 * Math.sqrt(a * a + b * b), L("For an ellipse $c^2 = a^2 - b^2$; the plus sign is for a hyperbola.", "दीर्घवृत्त के लिए $c^2 = a^2 - b^2$; धन चिह्न अतिपरवलय के लिए है।")]]),
            data: { given: [`a^2 = ${a * a}`, `b^2 = ${b * b}`], find: [askE ? "e" : "2c"] },
            hint: L("For an ellipse with a > b, $c^2 = a^2 - b^2$ and the foci are at $(\\pm c, 0)$.", "a > b वाले दीर्घवृत्त के लिए $c^2 = a^2 - b^2$ और नाभियाँ $(\\pm c, 0)$ पर हैं।"),
            formula: [R`c^2 = a^2 - b^2`, FE],
            solution: S(
              R`$a = ${a}$, $b = ${b}$`,
              R`$c = \sqrt{${a * a} - ${b * b}} = ${c}$`,
              askE ? (fx(c, a) === R`\frac{${c}}{${a}}` ? R`$e = \frac{c}{a} = ${fx(c, a)}$` : R`$e = \frac{${c}}{${a}} = ${fx(c, a)}$`) : R`$2c = ${2 * c}$`,
              askE ? L(`The eccentricity is $${fx(c, a)}$.`, `उत्केंद्रता $${fx(c, a)}$ है।`) : L(`The foci are ${2 * c} units apart.`, `नाभियों के बीच की दूरी ${2 * c} इकाई है।`),
            ),
          });
        }
        const [a, b, c] = r.pick(HYP);
        const askE = r.int(0, 1) === 0;
        return taskL(lang, {
          text: askE
            ? L(`Find the eccentricity of the hyperbola $${hypEq(a, b)}$.${fracNote}`, `अतिपरवलय $${hypEq(a, b)}$ की उत्केंद्रता ज्ञात कीजिए।${fracNote}`)
            : L(`Find the positive gradient of the asymptotes of the hyperbola $${hypEq(a, b)}$.${fracNote}`, `अतिपरवलय $${hypEq(a, b)}$ की अनंतस्पर्शियों की धनात्मक ढाल ज्ञात कीजिए।${fracNote}`),
          answer: askE
            ? fractionM(c, a, [[b / a, L("e = c/a with $c^2 = a^2 + b^2$; b/a is the gradient of an asymptote.", "e = c/a, जहाँ $c^2 = a^2 + b^2$; b/a अनंतस्पर्शी की ढाल है।")], [Math.sqrt(Math.abs(a * a - b * b)) / a, L("For a hyperbola $c^2 = a^2 + b^2$ (the minus sign is for an ellipse).", "अतिपरवलय के लिए $c^2 = a^2 + b^2$ (ऋण चिह्न दीर्घवृत्त के लिए है)।")]])
            : fractionM(b, a, [[a / b, L("For $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$ the asymptotes are $y = \\pm \\frac{b}{a}x$.", "$\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$ की अनंतस्पर्शियाँ $y = \\pm \\frac{b}{a}x$ हैं।")], [(b * b) / (a * a), L("Take square roots: use b and a, not $b^2$ and $a^2$.", "वर्गमूल लीजिए: b और a लीजिए, $b^2$ और $a^2$ नहीं।")]]),
          data: { given: [`a^2 = ${a * a}`, `b^2 = ${b * b}`], find: [askE ? "e" : "m"] },
          hint: askE ? L("For a hyperbola $c^2 = a^2 + b^2$.", "अतिपरवलय के लिए $c^2 = a^2 + b^2$।") : L("The asymptotes are the lines the hyperbola approaches: put the right-hand side 0.", "अनंतस्पर्शियाँ वे रेखाएँ हैं जिनके पास अतिपरवलय पहुँचता है: दायाँ पक्ष 0 रखिए।"),
          formula: askE ? [R`c^2 = a^2 + b^2`, FE] : R`y = \pm \frac{b}{a}x`,
          solution: S(
            R`$a = ${a}$, $b = ${b}$`,
            askE ? R`$c = \sqrt{${a * a} + ${b * b}} = ${c}$, $e = \frac{c}{a} = ${fx(c, a)}$` : R`$y = \pm \frac{${b}}{${a}}x$`,
            askE ? L(`The eccentricity is $${fx(c, a)}$.`, `उत्केंद्रता $${fx(c, a)}$ है।`) : L(`The positive gradient is $${fx(b, a)}$.`, `धनात्मक ढाल $${fx(b, a)}$ है।`),
          ),
        });
      }
      if (level === 2) {
        const v = r.int(0, 3);
        if (v === 0) {
          const xForm = r.int(0, 1) === 0, a = r.int(1, 5), t = r.pick([1, 2, 3, -1, -2, -3]);
          const askLR = r.int(0, 1) === 0;
          const P = xForm ? [a * t * t, 2 * a * t] : [2 * a * t, a * t * t];
          const eq = xForm ? "y^2 = 4ax" : "x^2 = 4ay";
          const sub = xForm ? R`${pm(P[1])}^2 = 4a \cdot ${P[0]}` : R`${pm(P[0])}^2 = 4a \cdot ${P[1]}`;
          return taskL(lang, {
            text: askLR
              ? L(`The parabola $${eq}$ passes through the point $(${P[0]}, ${P[1]})$. Find the length of its latus rectum.`, `परवलय $${eq}$ बिंदु $(${P[0]}, ${P[1]})$ से होकर जाता है। उसके नाभिलंब की लंबाई ज्ञात कीजिए।`)
              : L(`The parabola $${eq}$ passes through the point $(${P[0]}, ${P[1]})$. Find the distance from the vertex to the focus.`, `परवलय $${eq}$ बिंदु $(${P[0]}, ${P[1]})$ से होकर जाता है। शीर्ष से नाभि की दूरी ज्ञात कीजिए।`),
            answer: askLR
              ? numM(4 * a, null, [[a, L("That is a; the latus rectum has length 4a.", "यह a है; नाभिलंब की लंबाई 4a है।")], [xForm ? (P[0] * P[0]) / P[1] : (P[1] * P[1]) / P[0], L("Substitute x and y into the correct places of the equation.", "x और y को समीकरण में सही स्थानों पर रखिए।")]])
              : numM(a, null, [[4 * a, L("That is 4a; the focus is at distance a from the vertex.", "यह 4a है; नाभि शीर्ष से a दूरी पर है।")], [Math.abs(xForm ? (P[0] * P[0]) / P[1] / 4 : (P[1] * P[1]) / P[0] / 4), L("Substitute x and y into the correct places of the equation.", "x और y को समीकरण में सही स्थानों पर रखिए।")]]),
            data: { given: [`x = ${P[0]}`, `y = ${P[1]}`], find: [askLR ? "4a" : "a"] },
            hint: L("Substitute the point into the equation to find a.", "a ज्ञात करने के लिए बिंदु को समीकरण में रखिए।"),
            formula: xForm ? R`y^2 = 4ax:\ S(a, 0),\ \text{LR} = 4a` : R`x^2 = 4ay:\ S(0, a),\ \text{LR} = 4a`,
            solution: S(R`$${sub}$`, R`$${(2 * a * t) ** 2} = ${4 * a * t * t}a \Rightarrow a = ${a}$`, askLR ? L(`Latus rectum = 4a = ${4 * a}.`, `नाभिलंब = 4a = ${4 * a}।`) : L(`The focus is ${a} unit${a === 1 ? "" : "s"} from the vertex.`, `नाभि शीर्ष से ${a} इकाई दूर है।`)),
          });
        }
        if (v === 1) {
          const [a, b, c] = r.pick(ELL.slice(0, 6));
          const g = gcd(a * a, b * b), A2 = (b * b) / g, B2 = (a * a) / g, C2 = (a * a * b * b) / g;
          const askE = r.int(0, 1) === 0;
          return taskL(lang, {
            text: askE
              ? L(`Find the eccentricity of the ellipse $${A2}x^2 + ${B2}y^2 = ${C2}$.${fracNote}`, `दीर्घवृत्त $${A2}x^2 + ${B2}y^2 = ${C2}$ की उत्केंद्रता ज्ञात कीजिए।${fracNote}`)
              : L(`Find the length of the latus rectum of the ellipse $${A2}x^2 + ${B2}y^2 = ${C2}$.${fracNote}`, `दीर्घवृत्त $${A2}x^2 + ${B2}y^2 = ${C2}$ के नाभिलंब की लंबाई ज्ञात कीजिए।${fracNote}`),
            answer: askE
              ? fractionM(c, a, [[b / a, L("e = c/a, where $c^2 = a^2 - b^2$; it is not b/a.", "e = c/a, जहाँ $c^2 = a^2 - b^2$; यह b/a नहीं है।")], [c / b, L("Divide by a, the semi-major axis (the larger denominator).", "a से भाग दीजिए, जो अर्ध-दीर्घ अक्ष (बड़ा हर) है।")]])
              : fractionM(2 * b * b, a, [[(2 * a * a) / b, L("The latus rectum is $\\frac{2b^2}{a}$ with a the larger semi-axis.", "नाभिलंब $\\frac{2b^2}{a}$ है, जहाँ a बड़ा अर्ध-अक्ष है।")], [(b * b) / a, L("That is half the latus rectum; the full length is $\\frac{2b^2}{a}$.", "यह नाभिलंब का आधा है; पूरी लंबाई $\\frac{2b^2}{a}$ है।")]]),
            hint: L(`Divide both sides by ${C2} to get the standard form.`, `मानक रूप पाने के लिए दोनों पक्षों को ${C2} से भाग दीजिए।`),
            formula: askE ? [R`c^2 = a^2 - b^2`, FE] : R`\text{LR} = \frac{2b^2}{a}`,
            solution: S(
              R`$${ellEq(a, b)}$`,
              R`$a = ${a}$, $b = ${b}$`,
              askE ? R`$c = \sqrt{${a * a} - ${b * b}} = ${c}$, $e = ${fx(c, a)}$` : R`$\text{LR} = \frac{2 \cdot ${b * b}}{${a}} = ${fx(2 * b * b, a)}$`,
              askE ? L(`The eccentricity is $${fx(c, a)}$.`, `उत्केंद्रता $${fx(c, a)}$ है।`) : L(`The latus rectum has length $${fx(2 * b * b, a)}$.`, `नाभिलंब की लंबाई $${fx(2 * b * b, a)}$ है।`),
            ),
          });
        }
        if (v === 2) {
          const [a, b, c] = r.pick(ELL);
          const viaE = r.int(0, 1) === 0;
          const eT = fx(c, a);
          return taskL(lang, {
            text: viaE
              ? L(`An ellipse $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ has major axis of length ${2 * a} and eccentricity $${eT}$. Find $b^2$.`, `दीर्घवृत्त $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ के दीर्घ अक्ष की लंबाई ${2 * a} और उत्केंद्रता $${eT}$ है। $b^2$ ज्ञात कीजिए।`)
              : L(`An ellipse with centre at the origin has foci $(\\pm ${c}, 0)$ and vertices $(\\pm ${a}, 0)$. Find $b^2$ in its equation $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$.`, `मूल बिंदु पर केंद्र वाले एक दीर्घवृत्त की नाभियाँ $(\\pm ${c}, 0)$ और शीर्ष $(\\pm ${a}, 0)$ हैं। उसके समीकरण $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ में $b^2$ ज्ञात कीजिए।`),
            answer: numM(b * b, null, [
              [a * a + c * c, L("For an ellipse $b^2 = a^2 - c^2$.", "दीर्घवृत्त के लिए $b^2 = a^2 - c^2$।")],
              [(a - c) ** 2, L("Square first, then subtract: $b^2 = a^2 - c^2$.", "पहले वर्ग कीजिए, फिर घटाइए: $b^2 = a^2 - c^2$।")],
              viaE ? [4 * a * a - c * c * 4, L("The major axis is 2a; halve it to get a.", "दीर्घ अक्ष 2a है; a के लिए उसका आधा लीजिए।")] : [c * c, L("That is $c^2$; b is the semi-minor axis.", "यह $c^2$ है; b अर्ध-लघु अक्ष है।")],
            ]),
            data: { given: viaE ? [`2a = ${2 * a}`, `e = ${eT}`] : [`c = ${c}`, `a = ${a}`], find: ["b^2"] },
            hint: viaE ? L("Find a from the major axis, then c = ae.", "दीर्घ अक्ष से a ज्ञात कीजिए, फिर c = ae।") : L("The vertices give a and the foci give c.", "शीर्षों से a और नाभियों से c मिलता है।"),
            formula: [FE, R`b^2 = a^2 - c^2`],
            solution: S(
              viaE ? R`$a = ${a}$, $c = ae = ${a} \cdot ${eT} = ${c}$` : R`$a = ${a}$, $c = ${c}$`,
              R`$b^2 = ${a * a} - ${c * c} = ${b * b}$`,
              L(`So $b^2 = ${b * b}$.`, `अतः $b^2 = ${b * b}$।`),
            ),
          });
        }
        const [a, b, c] = r.pick(HYP);
        const askE = r.int(0, 1) === 0;
        return taskL(lang, {
          text: askE
            ? L(`A hyperbola $\\frac{y^2}{a^2} - \\frac{x^2}{b^2} = 1$ has vertices $(0, \\pm ${a})$ and foci $(0, \\pm ${c})$. Find its eccentricity.${fracNote}`, `अतिपरवलय $\\frac{y^2}{a^2} - \\frac{x^2}{b^2} = 1$ के शीर्ष $(0, \\pm ${a})$ और नाभियाँ $(0, \\pm ${c})$ हैं। उसकी उत्केंद्रता ज्ञात कीजिए।${fracNote}`)
            : L(`A hyperbola $\\frac{y^2}{a^2} - \\frac{x^2}{b^2} = 1$ has vertices $(0, \\pm ${a})$ and foci $(0, \\pm ${c})$. Find $b^2$.`, `अतिपरवलय $\\frac{y^2}{a^2} - \\frac{x^2}{b^2} = 1$ के शीर्ष $(0, \\pm ${a})$ और नाभियाँ $(0, \\pm ${c})$ हैं। $b^2$ ज्ञात कीजिए।`),
          answer: askE
            ? fractionM(c, a, [[a / c, L("For a hyperbola e > 1: e = c/a.", "अतिपरवलय के लिए e > 1: e = c/a।")], [b / a, L("e = c/a, where c is the distance from the centre to a focus.", "e = c/a, जहाँ c केंद्र से नाभि की दूरी है।")]])
            : numM(b * b, null, [[a * a + c * c, L("For a hyperbola $c^2 = a^2 + b^2$, so $b^2 = c^2 - a^2$.", "अतिपरवलय के लिए $c^2 = a^2 + b^2$, अतः $b^2 = c^2 - a^2$।")], [a * a - c * c, L("For a hyperbola c > a, so $b^2 = c^2 - a^2$ is positive.", "अतिपरवलय में c > a, अतः $b^2 = c^2 - a^2$ धनात्मक है।")]]),
          data: { given: [`a = ${a}`, `c = ${c}`], find: [askE ? "e" : "b^2"] },
          hint: L("The vertices give a and the foci give c; for a hyperbola $c^2 = a^2 + b^2$.", "शीर्षों से a और नाभियों से c मिलता है; अतिपरवलय के लिए $c^2 = a^2 + b^2$।"),
          formula: [R`c^2 = a^2 + b^2`, FE],
          solution: S(R`$a = ${a}$, $c = ${c}$`, askE ? R`$e = \frac{c}{a} = ${fx(c, a)}$` : R`$b^2 = ${c * c} - ${a * a} = ${b * b}$`, askE ? L(`The eccentricity is $${fx(c, a)}$.`, `उत्केंद्रता $${fx(c, a)}$ है।`) : L(`So $b^2 = ${b * b}$.`, `अतः $b^2 = ${b * b}$।`)),
        });
      }
      const v = r.int(0, 4);
      if (v === 0) {
        const xForm = r.int(0, 1) === 0, a = r.int(1, 4), t = r.pick([1, 2, 3, 4, -1, -2, -3]);
        const A = 4 * a, along = 2 * a * t, x = a * t * t, d = x + a;
        const eq = xForm ? `y^2 = ${A}x` : `x^2 = ${A}y`;
        const v1 = xForm ? "x" : "y", v2 = xForm ? "y" : "x";
        return taskL(lang, {
          text: L(`The point P on the parabola $${eq}$ has ${v2}-coordinate ${along}. Find the distance of P from the focus.`, `परवलय $${eq}$ पर स्थित बिंदु P का ${v2}-निर्देशांक ${along} है। नाभि से P की दूरी ज्ञात कीजिए।`),
          answer: numM(d, null, [
            [x - a, L("The focal distance equals the distance to the directrix, which lies on the other side of the vertex: add a.", "नाभि-दूरी नियता से दूरी के बराबर है, जो शीर्ष के दूसरी ओर है: a जोड़िए।")],
            [x, L(`That is the ${v1}-coordinate of P; add the distance a from the vertex to the directrix.`, `यह P का ${v1}-निर्देशांक है; शीर्ष से नियता की दूरी a जोड़िए।`)],
            [Math.sqrt(x * x + along * along), L("That is the distance from the vertex, not from the focus.", "यह शीर्ष से दूरी है, नाभि से नहीं।")],
          ]),
          data: { given: [`4a = ${A}`, `${v2}_P = ${along}`], find: ["PS"] },
          hint: L("By definition, every point of a parabola is as far from the focus as from the directrix.", "परिभाषा से, परवलय का प्रत्येक बिंदु नाभि और नियता से समान दूरी पर होता है।"),
          formula: xForm ? R`PS = x_P + a` : R`PS = y_P + a`,
          solution: S(
            R`$4a = ${A} \Rightarrow a = ${a}$`,
            R`$${v1}_P = \frac{${pm(along)}^2}{${A}} = ${x}$`,
            L(`Directrix: $${v1} = -${a}$`, `नियता: $${v1} = -${a}$`),
            R`$PS = ${x} + ${a} = ${d}$`,
            L(`P is ${d} units from the focus.`, `P नाभि से ${d} इकाई दूर है।`),
          ),
        });
      }
      if (v === 1) {
        const [a, b, c] = r.pick(ELL25);
        const LR = (2 * b * b) / a, eT = fx(c, a), lrT = en(LR);
        return taskL(lang, {
          text: L(`An ellipse $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ (a > b) has eccentricity $${eT}$ and latus rectum of length ${lrT}. Find a.`, `दीर्घवृत्त $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ (a > b) की उत्केंद्रता $${eT}$ और नाभिलंब की लंबाई ${lrT} है। a ज्ञात कीजिए।`),
          answer: numM(a, null, [
            [LR / (2 * (1 - c / a)), L("Use $b^2 = a^2(1 - e^2)$: the factor is $1 - e^2$, not $1 - e$.", "$b^2 = a^2(1 - e^2)$ लगाइए: गुणक $1 - e^2$ है, $1 - e$ नहीं।")],
            [2 * a, L("$\\text{LR} = \\frac{2b^2}{a} = 2a(1 - e^2)$; do not drop the factor 2.", "$\\text{LR} = \\frac{2b^2}{a} = 2a(1 - e^2)$; गुणक 2 मत छोड़िए।")],
            [b, L("That is b; the question asks for the semi-major axis a.", "यह b है; प्रश्न अर्ध-दीर्घ अक्ष a पूछता है।")],
          ]),
          data: { given: [`e = ${eT}`, R`\text{LR} = ${lrT}`], find: ["a"] },
          hint: L("Write the latus rectum in terms of a and e only.", "नाभिलंब को केवल a और e के पदों में लिखिए।"),
          formula: [R`\text{LR} = \frac{2b^2}{a}`, R`b^2 = a^2(1 - e^2)`],
          solution: S(
            R`$\text{LR} = \frac{2a^2(1 - e^2)}{a} = 2a(1 - e^2)$`,
            R`$1 - e^2 = 1 - ${fx(c * c, a * a)} = ${fx(a * a - c * c, a * a)}$`,
            R`$${lrT} = 2a \cdot ${fx(a * a - c * c, a * a)} \Rightarrow a = ${a}$`,
            L(`So a = ${a} (and $b^2 = ${b * b}$).`, `अतः a = ${a} (और $b^2 = ${b * b}$)।`),
          ),
        });
      }
      if (v === 2) {
        const [a, b, c] = r.pick(HYP);
        const eT = fx(c, a);
        return taskL(lang, {
          text: L(`A hyperbola $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$ has foci $(\\pm ${c}, 0)$ and eccentricity $${eT}$. Find $b^2$.`, `अतिपरवलय $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$ की नाभियाँ $(\\pm ${c}, 0)$ और उत्केंद्रता $${eT}$ है। $b^2$ ज्ञात कीजिए।`),
          answer: numM(b * b, null, [
            [c * c + a * a, L("For a hyperbola $b^2 = c^2 - a^2$.", "अतिपरवलय के लिए $b^2 = c^2 - a^2$।")],
            [a * a, L("That is $a^2$; now use $b^2 = c^2 - a^2$.", "यह $a^2$ है; अब $b^2 = c^2 - a^2$ लगाइए।")],
            [c * c - (c * c * c * c) / (a * a), L("a = c/e, not c·e.", "a = c/e, न कि c·e।")],
          ]),
          data: { given: [`c = ${c}`, `e = ${eT}`], find: ["b^2"] },
          hint: L("From e = c/a find a, then use the relation between a, b and c for a hyperbola.", "e = c/a से a ज्ञात कीजिए, फिर अतिपरवलय के लिए a, b और c का संबंध लगाइए।"),
          formula: [FE, R`c^2 = a^2 + b^2`],
          solution: S(R`$a = \frac{c}{e} = ${c} \div ${eT} = ${a}$`, R`$b^2 = ${c * c} - ${a * a} = ${b * b}$`, L(`So $b^2 = ${b * b}$.`, `अतः $b^2 = ${b * b}$।`)),
        });
      }
      if (v === 3) {
        const hyp = r.int(0, 1) === 0;
        const [a, b, c] = hyp ? r.pick(HYP.slice(0, 6)) : r.pick(ELL.slice(0, 6));
        const g = gcd(a * a, b * b), A2 = (b * b) / g, B2 = (a * a) / g, C2 = (a * a * b * b) / g;
        const eq = `${A2}x^2 ${hyp ? "-" : "+"} ${B2}y^2 = ${C2}`;
        const E = L("ellipse", "दीर्घवृत्त"), H = L("hyperbola", "अतिपरवलय"), Pb = L("parabola", "परवलय");
        const ok = `${hyp ? H : E}, $e = ${fx(c, a)}$`;
        const wrong = hyp
          ? [[`${E}, $e = ${fx(c, a)}$`, L("The squared terms have opposite signs, so it is a hyperbola; an ellipse also has e < 1.", "वर्ग पदों के चिह्न विपरीत हैं, अतः यह अतिपरवलय है; दीर्घवृत्त के लिए e < 1 भी होता है।")], [`${H}, $e = ${fx(a, c)}$`, L("A hyperbola has e > 1: e = c/a.", "अतिपरवलय के लिए e > 1: e = c/a।")], [`${Pb}, $e = 1$`, L("A parabola has only one squared variable.", "परवलय में केवल एक चर का वर्ग होता है।")]]
          : [[`${H}, $e = ${fx(c, a)}$`, L("Both squared terms are positive, so it is an ellipse.", "दोनों वर्ग पद धनात्मक हैं, अतः यह दीर्घवृत्त है।")], [`${E}, $e = ${fx(a, c)}$`, L("An ellipse has e < 1: e = c/a with c < a.", "दीर्घवृत्त के लिए e < 1: e = c/a, जहाँ c < a।")], [`${Pb}, $e = 1$`, L("A parabola has only one squared variable.", "परवलय में केवल एक चर का वर्ग होता है।")]];
        return taskL(lang, {
          text: L(`Which statement about the curve $${eq}$ is correct?`, `वक्र $${eq}$ के बारे में कौन-सा कथन सही है?`),
          answer: choiceWhy(r, ok, wrong),
          hint: L(`Divide by ${C2} to get the standard form, then look at the signs.`, `मानक रूप के लिए ${C2} से भाग दीजिए, फिर चिह्न देखिए।`),
          formula: hyp ? [R`c^2 = a^2 + b^2`, FE] : [R`c^2 = a^2 - b^2`, FE],
          solution: S(
            R`$${hyp ? hypEq(a, b) : ellEq(a, b)}$`,
            hyp ? R`$c = \sqrt{${a * a} + ${b * b}} = ${c}$` : R`$c = \sqrt{${a * a} - ${b * b}} = ${c}$`,
            R`$e = \frac{c}{a} = ${fx(c, a)}$`,
            L(`Answer: ${ok}.`, `उत्तर: ${ok}।`),
          ),
        });
      }
      const [a, b, c] = r.pick(HYP);
      const eT = fx(c, a);
      return taskL(lang, {
        text: L(`The hyperbola $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$ has eccentricity $${eT}$. Find the positive gradient of its asymptotes.${fracNote}`, `अतिपरवलय $\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1$ की उत्केंद्रता $${eT}$ है। उसकी अनंतस्पर्शियों की धनात्मक ढाल ज्ञात कीजिए।${fracNote}`),
        answer: fractionM(b, a, [
          [a / b, L("The asymptotes are $y = \\pm \\frac{b}{a}x$, not $\\frac{a}{b}x$.", "अनंतस्पर्शियाँ $y = \\pm \\frac{b}{a}x$ हैं, $\\frac{a}{b}x$ नहीं।")],
          [(b * b) / (a * a), L("$e^2 - 1 = \\frac{b^2}{a^2}$; take the square root.", "$e^2 - 1 = \\frac{b^2}{a^2}$; वर्गमूल लीजिए।")],
          [(c - a) / a, L("Use $e^2 - 1$, not $e - 1$.", "$e - 1$ नहीं, $e^2 - 1$ लीजिए।")],
        ]),
        data: { given: [`e = ${eT}`], find: [R`\frac{b}{a}`] },
        hint: L("Combine $c^2 = a^2 + b^2$ with e = c/a to express b/a through e.", "$c^2 = a^2 + b^2$ और e = c/a को मिलाकर b/a को e के पदों में लिखिए।"),
        formula: [R`\frac{b^2}{a^2} = e^2 - 1`, R`y = \pm \frac{b}{a}x`],
        solution: S(
          R`$\frac{b^2}{a^2} = e^2 - 1 = ${fx(c * c, a * a)} - 1 = ${fx(b * b, a * a)}$`,
          R`$\frac{b}{a} = ${fx(b, a)}$`,
          L(`The positive gradient is $${fx(b, a)}$.`, `धनात्मक ढाल $${fx(b, a)}$ है।`),
        ),
      });
    },
  },

  // ───────────────────────── Binomial theorem ─────────────────────────
  {
    id: "exg-mat-binomial",
    topics: [T("binomial-theorem")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const FT = R`T_{r+1} = \binom{n}{r} a^{n-r} b^{r}`;
      if (level === 1) {
        const v = r.int(0, 2);
        const n = r.int(4, 7), a = r.pick([1, 2, 3]), b = r.pick([1, 2, 3, -1, -2]);
        const ex = `(${poly([[a, ""], [b, "x"]])})^{${n}}`;
        if (v === 0 || v === 1) {
          const k = r.int(2, n - 1);
          const coef = nCr(n, k) * a ** (n - k) * b ** k;
          const term = v === 1;
          return taskL(lang, {
            text: term
              ? L(`Expand $${ex}$ in ascending powers of x. Find the coefficient of its ${k + 1}${["st", "nd", "rd"][k] || "th"} term.`, `$${ex}$ का x की आरोही घातों में प्रसार कीजिए। इसके ${k + 1}वें पद का गुणांक ज्ञात कीजिए।`)
              : L(`Find the coefficient of $x^{${k}}$ in the expansion of $${ex}$.`, `$${ex}$ के प्रसार में $x^{${k}}$ का गुणांक ज्ञात कीजिए।`),
            answer: numM(coef, null, [
              [nCr(n, k) * b ** k, L(`The first term ${a} is also raised to a power: $${a}^{${n - k}}$.`, `पहला पद ${a} भी घात में है: $${a}^{${n - k}}$।`)],
              [nCr(n, k), L("Include the powers of both terms, not only the binomial coefficient.", "केवल द्विपद गुणांक नहीं, दोनों पदों की घातें भी शामिल कीजिए।")],
              [nCr(n, k + 1) * a ** (n - k - 1) * b ** (k + 1), L("The (r + 1)th term contains $x^r$; you used the wrong r.", "(r + 1)वें पद में $x^r$ होता है; आपने गलत r लिया।")],
            ]),
            data: { given: [`n = ${n}`], find: [term ? `T_{${k + 1}}` : `x^{${k}}`] },
            hint: L(`Use the general term with r = ${k}.`, `व्यापक पद में r = ${k} रखिए।`),
            formula: FT,
            solution: S(
              R`$T_{${k + 1}} = \binom{${n}}{${k}} \cdot ${a}^{${n - k}} \cdot (${b === 1 ? "" : b === -1 ? "-" : b}x)^{${k}}$`,
              R`$= ${nCr(n, k)} \cdot ${a ** (n - k)} \cdot ${pm(b ** k)} x^{${k}} = ${coef}x^{${k}}$`,
              L(`The coefficient is ${coef}.`, `गुणांक ${coef} है।`),
            ),
          });
        }
        const s = (a + b) ** n;
        return taskL(lang, {
          text: L(`Find the sum of the coefficients in the expansion of $${ex}$.`, `$${ex}$ के प्रसार में सभी गुणांकों का योग ज्ञात कीजिए।`),
          answer: numM(s, null, [
            [2 ** n, L(`$2^n$ is the sum of the binomial coefficients only; here the terms are ${a} and ${pm(b)}.`, `$2^n$ केवल द्विपद गुणांकों का योग है; यहाँ पद ${a} और ${pm(b)} हैं।`)],
            [(Math.abs(a) + Math.abs(b)) ** n, L("Keep the sign of the second term when you put x = 1.", "x = 1 रखते समय दूसरे पद का चिह्न बनाए रखिए।")],
          ]),
          hint: L("Put x = 1 in the expression.", "व्यंजक में x = 1 रखिए।"),
          formula: R`\text{sum of coefficients} = f(1)`,
          solution: S(R`$x = 1$: $(${a} ${b < 0 ? "-" : "+"} ${Math.abs(b)})^{${n}} = ${pm(a + b)}^{${n}} = ${s}$`, L(`The sum of the coefficients is ${s}.`, `गुणांकों का योग ${s} है।`)),
        });
      }
      if (level === 2) {
        const v = r.int(0, 3);
        if (v === 0) {
          const a = r.pick([1, 2]), c = r.pick([1, 2, 3, -1, -2]);
          const n = r.int(5, 8);
          let rr;
          do rr = r.int(0, n);
          while (n - 2 * rr <= 0 || n - 2 * rr === n);
          const k = n - 2 * rr;
          const coef = nCr(n, rr) * a ** (n - rr) * c ** rr;
          const ex = R`\left(${a === 1 ? "" : a}x ${c < 0 ? "-" : "+"} \frac{${Math.abs(c)}}{x}\right)^{${n}}`;
          return taskL(lang, {
            text: L(`Find the coefficient of $x^{${k}}$ in the expansion of $${ex}$.`, `$${ex}$ के प्रसार में $x^{${k}}$ का गुणांक ज्ञात कीजिए।`),
            answer: numM(coef, null, [
              [nCr(n, rr), L("Include the powers of the constants, not only the binomial coefficient.", "केवल द्विपद गुणांक नहीं, अचरों की घातें भी शामिल कीजिए।")],
              [c < 0 && rr % 2 === 1 ? -coef : nCr(n, rr + 1) * a ** (n - rr - 1) * c ** (rr + 1), c < 0 && rr % 2 === 1 ? L("An odd power of a negative number is negative.", "किसी ऋणात्मक संख्या की विषम घात ऋणात्मक होती है।") : L("Find r from the power of x: $n - 2r = " + k + "$.", "x की घात से r ज्ञात कीजिए: $n - 2r = " + k + "$।")],
            ]),
            data: { given: [`n = ${n}`], find: [`x^{${k}}`] },
            hint: L("Write the general term and collect the powers of x to find r.", "व्यापक पद लिखिए और x की घातें मिलाकर r ज्ञात कीजिए।"),
            formula: FT,
            solution: S(
              R`$T_{r+1} = \binom{${n}}{r} (${a === 1 ? "" : a}x)^{${n} - r} \left(\frac{${c}}{x}\right)^{r} = \binom{${n}}{r} ${a === 1 ? "" : `${a}^{${n} - r}`} (${c})^r x^{${n} - 2r}$`,
              R`$${n} - 2r = ${k} \Rightarrow r = ${rr}$`,
              R`$\binom{${n}}{${rr}} \cdot ${a ** (n - rr)} \cdot ${pm(c ** rr)} = ${coef}$`,
              L(`The coefficient is ${coef}.`, `गुणांक ${coef} है।`),
            ),
          });
        }
        if (v === 1) {
          const [p, q, ns] = r.pick([[1, 1, [4, 6, 8]], [2, 1, [3, 6, 9]], [1, 2, [3, 6, 9]], [3, 1, [4, 8]], [1, 3, [4, 8]]]);
          const n = r.pick(ns), c = r.pick([1, 2, 3, -1, -2]);
          const rr = (p * n) / (p + q);
          const val = nCr(n, rr) * c ** rr;
          const ex = R`\left(${pw("x", p)} ${c < 0 ? "-" : "+"} \frac{${Math.abs(c)}}{${pw("x", q)}}\right)^{${n}}`;
          return taskL(lang, {
            text: L(`Find the term independent of x in the expansion of $${ex}$.`, `$${ex}$ के प्रसार में x से स्वतंत्र पद ज्ञात कीजिए।`),
            answer: numM(val, null, [
              [nCr(n, rr), L(`Include the power of the constant: $(${c})^r$.`, `अचर की घात भी शामिल कीजिए: $(${c})^r$।`)],
              [c < 0 && rr % 2 === 1 ? -val : nCr(n, Math.round((q * n) / (p + q))) * c ** Math.round((q * n) / (p + q)), c < 0 && rr % 2 === 1 ? L("An odd power of a negative number is negative.", "किसी ऋणात्मक संख्या की विषम घात ऋणात्मक होती है।") : L("Set the total power of x to zero carefully to find r.", "r ज्ञात करने के लिए x की कुल घात को ध्यान से शून्य रखिए।")],
            ]),
            data: { given: [`n = ${n}`], find: [R`T_{r+1}\ (x^0)`] },
            hint: L("In the general term, make the power of x equal to zero.", "व्यापक पद में x की घात को शून्य के बराबर रखिए।"),
            formula: FT,
            solution: S(
              R`$T_{r+1} = \binom{${n}}{r} (${pw("x", p)})^{${n} - r} \left(\frac{${c}}{${pw("x", q)}}\right)^{r}$`,
              R`${L("Power of x:", "x की घात:")} $${p === 1 ? "" : p}(${n} - r) - ${q === 1 ? "" : q}r = 0 \Rightarrow r = ${rr}$`,
              R`$T_{${rr + 1}} = \binom{${n}}{${rr}} (${c})^{${rr}} = ${nCr(n, rr)} \cdot ${pm(c ** rr)} = ${val}$`,
              L(`The term independent of x is ${val}.`, `x से स्वतंत्र पद ${val} है।`),
            ),
          });
        }
        if (v === 2) {
          const n = r.pick([4, 6, 8]), a = r.pick([1, 2, 3]), b = r.pick([1, 2, -1, -2, 3]);
          const h = n / 2, coef = nCr(n, h) * a ** h * b ** h;
          const ex = `(${poly([[a, "x"], [b, ""]])})^{${n}}`;
          return taskL(lang, {
            text: L(`Find the coefficient of the middle term in the expansion of $${ex}$.`, `$${ex}$ के प्रसार के मध्य पद का गुणांक ज्ञात कीजिए।`),
            answer: numM(coef, null, [
              [nCr(n, h + 1) * a ** (h - 1) * b ** (h + 1), L(`There are ${n + 1} terms, so the middle one is the ${h + 1}th, with r = ${h}.`, `कुल ${n + 1} पद हैं, अतः मध्य पद ${h + 1}वाँ है, जिसमें r = ${h}।`)],
              [nCr(n, h), L("Include the powers of both terms, not only the binomial coefficient.", "केवल द्विपद गुणांक नहीं, दोनों पदों की घातें भी शामिल कीजिए।")],
            ]),
            data: { given: [`n = ${n}`], find: [`T_{${h + 1}}`] },
            hint: L(`An expansion with power n has n + 1 terms; for even n the middle term is the $(\\frac{n}{2} + 1)$th.`, `घात n वाले प्रसार में n + 1 पद होते हैं; सम n के लिए मध्य पद $(\\frac{n}{2} + 1)$वाँ होता है।`),
            formula: FT,
            solution: S(
              L(`${n + 1} terms, middle term $T_{${h + 1}}$ (r = ${h}).`, `${n + 1} पद, मध्य पद $T_{${h + 1}}$ (r = ${h})।`),
              R`$T_{${h + 1}} = \binom{${n}}{${h}} (${a === 1 ? "" : a}x)^{${h}} (${b})^{${h}} = ${nCr(n, h)} \cdot ${a ** h} \cdot ${pm(b ** h)}\,x^{${h}}$`,
              R`$= ${coef}x^{${h}}$`,
              L(`The coefficient is ${coef}.`, `गुणांक ${coef} है।`),
            ),
          });
        }
        const h = r.pick([0.01, 0.02, 0.03, 0.05, -0.01, -0.02]), n = r.int(4, 10);
        const t1 = n * h, t2 = ((n * (n - 1)) / 2) * h * h, val = 1 + t1 + t2;
        const base = en(1 + h);
        return taskL(lang, {
          text: L(`Use the first three terms of the binomial expansion of $(1 ${h < 0 ? "-" : "+"} ${en(Math.abs(h))})^{${n}}$ to estimate $${base}^{${n}}$.${roundToL(4, lang)}`, `$(1 ${h < 0 ? "-" : "+"} ${en(Math.abs(h))})^{${n}}$ के द्विपद प्रसार के पहले तीन पदों से $${base}^{${n}}$ का सन्निकट मान ज्ञात कीजिए।${roundToL(4, lang)}`),
          answer: numM(val, 4, [
            [1 + t1, L("Include the third term $\\binom{n}{2}h^2$.", "तीसरा पद $\\binom{n}{2}h^2$ भी शामिल कीजिए।")],
            [1 + t1 + n * (n - 1) * h * h, L("$\\binom{n}{2} = \\frac{n(n-1)}{2}$; do not forget to divide by 2.", "$\\binom{n}{2} = \\frac{n(n-1)}{2}$; 2 से भाग देना मत भूलिए।")],
          ]),
          data: { given: [`n = ${n}`], find: [`${base}^{${n}}`] },
          hint: L("$(1 + h)^n \\approx 1 + nh + \\frac{n(n-1)}{2}h^2$ for small h.", "छोटे h के लिए $(1 + h)^n \\approx 1 + nh + \\frac{n(n-1)}{2}h^2$।"),
          formula: R`(1 + h)^n \approx 1 + nh + \frac{n(n-1)}{2}h^2`,
          solution: S(
            R`$1 + ${n} \cdot ${pm(h)} + \frac{${n} \cdot ${n - 1}}{2} \cdot ${pm(h)}^2$`,
            R`$= 1 ${t1 < 0 ? "-" : "+"} ${en(Math.abs(t1))} + ${en(t2)} = ${en(val)}$`,
            L(`Estimate: ${en(val, 4)}.`, `सन्निकट मान: ${en(val, 4)}।`),
          ),
        });
      }
      const v = r.int(0, 4);
      if (v === 0) {
        const [p, q, ns] = r.pick([[2, 1, [6, 9]], [1, 2, [6, 9]], [1, 1, [6, 8]], [3, 1, [8]], [1, 3, [8]], [3, 2, [5, 10]], [2, 3, [5]]]);
        const n = r.pick(ns), a = r.pick(n >= 8 ? [1, 2] : [1, 2, 3]), b = r.pick(n >= 8 ? [1, 2] : [1, 2, 3]);
        const rr = (p * n) / (p + q);
        const val = nCr(n, rr) * a ** (n - rr) * (-b) ** rr;
        const ex = R`\left(${a === 1 ? "" : a}${pw("x", p)} - \frac{${b}}{${pw("x", q)}}\right)^{${n}}`;
        return taskL(lang, {
          text: L(`Find the term independent of x in the expansion of $${ex}$.`, `$${ex}$ के प्रसार में x से स्वतंत्र पद ज्ञात कीजिए।`),
          answer: numM(val, null, [
            [-val, L("Check the sign: $(-" + b + ")^r$ is negative only for odd r.", "चिह्न जाँचिए: $(-" + b + ")^r$ केवल विषम r के लिए ऋणात्मक है।")],
            [nCr(n, rr) * (-b) ** rr, L(`The first term's constant is also raised to a power: $${a}^{n - r}$.`, `पहले पद का अचर भी घात में है: $${a}^{n - r}$।`)],
            [nCr(n, rr), L("Include the powers of both constants.", "दोनों अचरों की घातें शामिल कीजिए।")],
          ]),
          data: { given: [`n = ${n}`], find: [R`T_{r+1}\ (x^0)`] },
          hint: L("Write the power of x in the general term and set it equal to 0.", "व्यापक पद में x की घात लिखिए और उसे 0 के बराबर रखिए।"),
          formula: FT,
          solution: S(
            R`$T_{r+1} = \binom{${n}}{r} (${a === 1 ? "" : a}${pw("x", p)})^{${n} - r} \left(-\frac{${b}}{${pw("x", q)}}\right)^{r}$`,
            R`${L("Power of x:", "x की घात:")} $${p === 1 ? "" : p}(${n} - r) - ${q === 1 ? "" : q}r = 0 \Rightarrow r = ${rr}$`,
            R`$T_{${rr + 1}} = \binom{${n}}{${rr}} \cdot ${a}^{${n - rr}} \cdot (-${b})^{${rr}} = ${nCr(n, rr)} \cdot ${a ** (n - rr)} \cdot ${pm((-b) ** rr)} = ${val}$`,
            L(`The term independent of x is ${val}.`, `x से स्वतंत्र पद ${val} है।`),
          ),
        });
      }
      if (v === 1) {
        const n = r.int(4, 8), k = r.int(2, 5), C2 = nCr(n, 2), V = C2 * k * k;
        return taskL(lang, {
          text: L(`In the expansion of $(1 + kx)^{${n}}$, where k > 0, the coefficient of $x^2$ is ${V}. Find k.`, `$(1 + kx)^{${n}}$ के प्रसार में, जहाँ k > 0, $x^2$ का गुणांक ${V} है। k ज्ञात कीजिए।`),
          answer: numM(k, null, [
            [k * k, L("That is $k^2$; take the square root.", "यह $k^2$ है; वर्गमूल लीजिए।")],
            [V / n, L(`The coefficient of $x^2$ is $\\binom{${n}}{2}k^2$, not $nk$.`, `$x^2$ का गुणांक $\\binom{${n}}{2}k^2$ है, $nk$ नहीं।`)],
            [Math.sqrt(V / (n * (n - 1))), L("$\\binom{n}{2} = \\frac{n(n-1)}{2}$; do not forget to divide by 2.", "$\\binom{n}{2} = \\frac{n(n-1)}{2}$; 2 से भाग देना मत भूलिए।")],
          ]),
          data: { given: [`n = ${n}`, `\\binom{${n}}{2}k^2 = ${V}`], find: ["k"] },
          hint: L("Write the term in $x^2$ with the general term, then solve for k.", "व्यापक पद से $x^2$ वाला पद लिखिए, फिर k के लिए हल कीजिए।"),
          formula: R`T_3 = \binom{n}{2}(kx)^2`,
          solution: S(R`$\binom{${n}}{2}k^2 = ${C2}k^2 = ${V}$`, R`$k^2 = ${k * k}$, $k = ${k}$`, L(`So k = ${k}.`, `अतः k = ${k}।`)),
        });
      }
      if (v === 2) {
        const n = r.int(5, 8), k = r.int(2, 4), a = r.pick([2, 3, -2, -1, -3]);
        const val = nCr(n, k) + a * nCr(n, k - 1);
        return taskL(lang, {
          text: L(`Find the coefficient of $x^{${k}}$ in the expansion of $(1 ${a < 0 ? "-" : "+"} ${Math.abs(a) === 1 ? "" : Math.abs(a)}x)(1 + x)^{${n}}$.`, `$(1 ${a < 0 ? "-" : "+"} ${Math.abs(a) === 1 ? "" : Math.abs(a)}x)(1 + x)^{${n}}$ के प्रसार में $x^{${k}}$ का गुणांक ज्ञात कीजिए।`),
          answer: numM(val, null, [
            [nCr(n, k), L(`The term ${pm(a)}x also multiplies the $x^{${k - 1}}$ term of the expansion.`, `पद ${pm(a)}x प्रसार के $x^{${k - 1}}$ वाले पद से भी गुणा होता है।`)],
            [nCr(n, k) + a * nCr(n, k), L(`${pm(a)}x must be multiplied by the coefficient of $x^{${k - 1}}$, not of $x^{${k}}$.`, `${pm(a)}x को $x^{${k - 1}}$ के गुणांक से गुणा करना है, $x^{${k}}$ के नहीं।`)],
          ]),
          data: { given: [`n = ${n}`], find: [`x^{${k}}`] },
          hint: L(`$x^{${k}}$ arises in two ways: 1 times the $x^{${k}}$ term, and the x term times the $x^{${k - 1}}$ term.`, `$x^{${k}}$ दो प्रकार से बनता है: 1 × $x^{${k}}$ वाला पद, और x वाला पद × $x^{${k - 1}}$ वाला पद।`),
          formula: R`(1 + x)^n = \sum_{r=0}^{n} \binom{n}{r} x^r`,
          solution: S(
            R`$1 \cdot \binom{${n}}{${k}} + (${a}) \cdot \binom{${n}}{${k - 1}} = ${nCr(n, k)} ${a < 0 ? "-" : "+"} ${Math.abs(a) * nCr(n, k - 1)} = ${val}$`,
            L(`The coefficient is ${val}.`, `गुणांक ${val} है।`),
          ),
        });
      }
      if (v === 3) {
        const p = r.int(3, 8), s = r.int(1, 3), q = p + s + 1;
        const n = p + q - 2;
        const ord = (k) => (lang === "hi" ? `${k}वें` : `${k}${k % 10 === 1 && k !== 11 ? "st" : k % 10 === 2 && k !== 12 ? "nd" : k % 10 === 3 && k !== 13 ? "rd" : "th"}`);
        return taskL(lang, {
          text: L(`In the expansion of $(1 + x)^n$, the coefficients of the ${ord(p)} and ${ord(q)} terms are equal. Find n.`, `$(1 + x)^n$ के प्रसार में ${ord(p)} और ${ord(q)} पदों के गुणांक बराबर हैं। n ज्ञात कीजिए।`),
          answer: numM(n, null, [
            [p + q, L("The kth term contains $\\binom{n}{k-1}$, not $\\binom{n}{k}$.", "kवें पद में $\\binom{n}{k-1}$ होता है, $\\binom{n}{k}$ नहीं।")],
            [p + q - 1, L("Both terms shift by one: $T_k$ has $r = k - 1$.", "दोनों पद एक-एक खिसकते हैं: $T_k$ में $r = k - 1$।")],
          ]),
          data: { given: [`k_1 = ${p}`, `k_2 = ${q}`], find: ["n"] },
          hint: L("Use $\\binom{n}{r} = \\binom{n}{s}$ with r ≠ s ⇒ r + s = n.", "$\\binom{n}{r} = \\binom{n}{s}$, r ≠ s ⇒ r + s = n का उपयोग कीजिए।"),
          formula: R`\binom{n}{r} = \binom{n}{n-r}`,
          solution: S(
            R`$T_{${p}} \to \binom{n}{${p - 1}}$, $T_{${q}} \to \binom{n}{${q - 1}}$`,
            R`$\binom{n}{${p - 1}} = \binom{n}{${q - 1}} \Rightarrow ${p - 1} + ${q - 1} = n$`,
            R`$n = ${n}$`,
            L(`So n = ${n}.`, `अतः n = ${n}।`),
          ),
        });
      }
      const n = r.int(3, 6), a = r.int(2, 4);
      let b;
      do b = r.int(1, 7);
      while (b === a);
      const s = (a - b) ** n;
      const ex = `(${a}x - ${b}y)^{${n}}`;
      return taskL(lang, {
        text: L(`Find the sum of the coefficients in the expansion of $${ex}$.`, `$${ex}$ के प्रसार में सभी गुणांकों का योग ज्ञात कीजिए।`),
        answer: numM(s, null, [
          [(a + b) ** n, L("Keep the minus sign: put x = y = 1 into the bracket.", "ऋण चिह्न बनाए रखिए: कोष्ठक में x = y = 1 रखिए।")],
          [2 ** n, L(`$2^n$ is the sum of the binomial coefficients only; here the terms are ${a}x and $-${b}y$.`, `$2^n$ केवल द्विपद गुणांकों का योग है; यहाँ पद ${a}x और $-${b}y$ हैं।`)],
        ]),
        hint: L("Put every variable equal to 1.", "प्रत्येक चर को 1 के बराबर रखिए।"),
        formula: R`\text{sum of coefficients} = f(1, 1)`,
        solution: S(R`$(${a} - ${b})^{${n}} = (${a - b})^{${n}} = ${s}$`, L(`The sum of the coefficients is ${s}.`, `गुणांकों का योग ${s} है।`)),
      });
    },
  },

  // ───────────────────────── Correlation and regression ─────────────────────────
  {
    id: "exg-mat-correlation",
    topics: [T("correlation-and-regression")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const ci = r.int(0, CCTX.length - 1);
      const cx = L(CCTX[ci][0], CCTX[ci][2]), cy = L(CCTX[ci][1], CCTX[ci][3]), csg = CCTX[ci][4];
      // Majhen nabor podatkov z znanimi vsotami.
      const mk = () => {
        for (let k = 0; k < 400; k++) {
          const n = r.int(5, 8);
          const xs = r.shuffle([...Array(16).keys()].map((i) => i + 2)).slice(0, n);
          const beta = csg * r.pick([0.5, 1, 1.5, 2, 3]), alpha = r.int(beta < 0 ? 40 : 5, beta < 0 ? 60 : 20);
          const ys = xs.map((x) => Math.round(alpha + beta * x + r.int(-4, 4)));
          const Sx = sum(xs), Sy = sum(ys), Sxx0 = sum(xs.map((x) => x * x)), Syy0 = sum(ys.map((y) => y * y)), Sxy0 = sum(xs.map((x, i) => x * ys[i]));
          const Sxx = Sxx0 - (Sx * Sx) / n, Syy = Syy0 - (Sy * Sy) / n, Sxy = Sxy0 - (Sx * Sy) / n;
          const rv = Sxy / Math.sqrt(Sxx * Syy);
          if (Math.min(...ys) >= 0 && Sxx > 0 && Syy > 0 && Math.abs(rv) > 0.4 && Math.abs(rv) < 0.995) return { n, xs, ys, Sx, Sy, Sxx0, Syy0, Sxy0, Sxx, Syy, Sxy, rv };
        }
        return null;
      };
      const sumsText = (d) => R`$n = ${d.n}$, $\sum x = ${d.Sx}$, $\sum y = ${d.Sy}$, $\sum x^2 = ${d.Sxx0}$, $\sum y^2 = ${d.Syy0}$, $\sum xy = ${d.Sxy0}$`;
      const sumsGiven = (d) => [`n = ${d.n}`, R`\sum x = ${d.Sx}`, R`\sum y = ${d.Sy}`, R`\sum x^2 = ${d.Sxx0}`, R`\sum y^2 = ${d.Syy0}`, R`\sum xy = ${d.Sxy0}`];
      const sLines = (d) => S(
        R`$S_{xx} = ${d.Sxx0} - \frac{${d.Sx}^2}{${d.n}} ${eqs(d.Sxx)} ${isEx(d.Sxx) ? en(r2(d.Sxx)) : en(d.Sxx, 3)}$`,
        R`$S_{xy} = ${d.Sxy0} - \frac{${d.Sx} \cdot ${d.Sy}}{${d.n}} ${eqs(d.Sxy)} ${isEx(d.Sxy) ? en(r2(d.Sxy)) : en(d.Sxy, 3)}$`,
      );
      const syyLine = (d) => R`$S_{yy} = ${d.Syy0} - \frac{${d.Sy}^2}{${d.n}} ${eqs(d.Syy)} ${isEx(d.Syy) ? en(r2(d.Syy)) : en(d.Syy, 3)}$`;
      if (level === 1) {
        const v = r.int(0, 2);
        if (v === 0) {
          const b = csg * r.pick([0.4, 0.5, 0.8, 1.2, 1.5, 2.5, 0.6]), a = r.int(b < 0 ? 35 : 5, b < 0 ? 60 : 25), x0 = r.int(4, 20);
          const y = a + b * x0;
          const line = `y = ${a} ${b < 0 ? "-" : "+"} ${en(Math.abs(b))}x`;
          return taskL(lang, {
            text: L(`For data on ${cx} and ${cy}, the regression line of y on x is $${line}$. Estimate y when x = ${x0}.`, `${cx} और ${cy} के आँकड़ों के लिए x पर y की समाश्रयण रेखा $${line}$ है। x = ${x0} होने पर y का आकलन कीजिए।`),
            answer: ansN(y, [[(x0 - a) / b, L("You solved for x; substitute x into the line to get y.", "आपने x के लिए हल किया; y के लिए x को रेखा में रखिए।")], [b * x0, L("Add the intercept a as well.", "अंतःखंड a भी जोड़िए।")]]),
            data: { given: [`${line}`.replace(/^y = /, R`\hat{y} = `), `x = ${x0}`], find: [R`\hat{y}`] },
            hint: L("Substitute the value of x into the equation of the line.", "x का मान रेखा के समीकरण में रखिए।"),
            formula: R`\hat{y} = a + bx`,
            solution: S(R`$\hat{y} = ${a} ${b < 0 ? "-" : "+"} ${en(Math.abs(b))} \cdot ${x0} = ${f2(y)}$`, L(`Estimated y ≈ ${f2(y)}.`, `y का आकलित मान ≈ ${f2(y)}।`)),
          });
        }
        if (v === 1) {
          const d = mk();
          if (!d) return null;
          const Sxx = r2(d.Sxx), Syy = r2(d.Syy), Sxy = r2(d.Sxy), rv = Sxy / Math.sqrt(Sxx * Syy);
          return taskL(lang, {
            text: L(`For data on ${cx} and ${cy}: $S_{xx} = ${en(Sxx)}$, $S_{yy} = ${en(Syy)}$ and $S_{xy} = ${en(Sxy)}$. Find Pearson's correlation coefficient r.${roundToL(3, lang)}`, `${cx} और ${cy} के आँकड़ों के लिए $S_{xx} = ${en(Sxx)}$, $S_{yy} = ${en(Syy)}$ और $S_{xy} = ${en(Sxy)}$ हैं। पियर्सन सहसंबंध गुणांक r ज्ञात कीजिए।${roundToL(3, lang)}`),
            answer: numM(rv, 3, [
              [Sxy / Sxx, L("$S_{xy}/S_{xx}$ is the gradient of the regression line, not r.", "$S_{xy}/S_{xx}$ समाश्रयण रेखा की ढाल है, r नहीं।")],
              [Sxy / (Sxx * Syy), L("Divide by the square root of $S_{xx}S_{yy}$.", "$S_{xx}S_{yy}$ के वर्गमूल से भाग दीजिए।")],
            ]),
            data: { given: [`S_{xx} = ${en(Sxx)}`, `S_{yy} = ${en(Syy)}`, `S_{xy} = ${en(Sxy)}`], find: ["r"] },
            hint: L("r compares $S_{xy}$ with the geometric mean of $S_{xx}$ and $S_{yy}$.", "r, $S_{xy}$ की तुलना $S_{xx}$ और $S_{yy}$ के गुणोत्तर माध्य से करता है।"),
            formula: FR,
            solution: S(R`$r = \frac{${en(Sxy)}}{\sqrt{${en(Sxx)} \cdot ${en(Syy)}}} \approx ${en(rv, 3)}$`, L(`r ≈ ${en(rv, 3)}.`, `r ≈ ${en(rv, 3)}।`)),
          });
        }
        const rv = r.pick([0.92, 0.85, 0.97, -0.88, -0.95, -0.91, 0.12, -0.08, 0.05, 0.35, 0.3, -0.3, -0.38]);
        const cat = rv >= 0.8 ? 0 : rv <= -0.8 ? 2 : Math.abs(rv) < 0.15 ? 4 : rv > 0 ? 1 : 3;
        const OPT = [
          L("strong positive linear correlation", "प्रबल धनात्मक रैखिक सहसंबंध"),
          L("weak positive linear correlation", "दुर्बल धनात्मक रैखिक सहसंबंध"),
          L("strong negative linear correlation", "प्रबल ऋणात्मक रैखिक सहसंबंध"),
          L("weak negative linear correlation", "दुर्बल ऋणात्मक रैखिक सहसंबंध"),
          L("almost no linear correlation", "लगभग कोई रैखिक सहसंबंध नहीं"),
        ];
        const sign = [1, 1, -1, -1, 0], strong = [2, 1, 2, 1, 0];
        const why = (k) => sign[k] !== sign[cat] && sign[k] && sign[cat]
          ? L("The sign of r gives the direction: negative r means y tends to decrease as x increases.", "r का चिह्न दिशा बताता है: ऋणात्मक r का अर्थ है कि x बढ़ने पर y घटने की प्रवृत्ति रखता है।")
          : L("|r| close to 1 means strong, close to 0 means weak or none.", "|r| का 1 के निकट होना प्रबल और 0 के निकट होना दुर्बल या शून्य सहसंबंध दर्शाता है।");
        const wrongK = r.shuffle([0, 1, 2, 3, 4].filter((k) => k !== cat)).slice(0, 3);
        return taskL(lang, {
          text: L(`For a set of paired data (x, y), Pearson's correlation coefficient is r = ${en(rv)}. Which description is correct?`, `युग्मित आँकड़ों (x, y) के एक समूह के लिए पियर्सन सहसंबंध गुणांक r = ${en(rv)} है। कौन-सा विवरण सही है?`),
          answer: choiceWhy(r, OPT[cat], wrongK.map((k) => [OPT[k], why(k)])),
          hint: L("Look at the sign of r for the direction and at |r| for the strength.", "दिशा के लिए r का चिह्न और प्रबलता के लिए |r| देखिए।"),
          solution: S(
            L(`Sign of r: ${rv > 0 ? "positive" : "negative"}; |r| = ${en(Math.abs(rv))} is ${strong[cat] === 2 ? "close to 1" : strong[cat] === 1 ? "well below 1" : "close to 0"}.`, `r का चिह्न: ${rv > 0 ? "धनात्मक" : "ऋणात्मक"}; |r| = ${en(Math.abs(rv))}, ${strong[cat] === 2 ? "1 के निकट है" : strong[cat] === 1 ? "1 से काफ़ी कम है" : "0 के निकट है"}।`),
            L(`Answer: ${OPT[cat]}.`, `उत्तर: ${OPT[cat]}।`),
          ),
        });
      }
      if (level === 2) {
        const v = r.int(0, 2);
        const d = mk();
        if (!d) return null;
        const b = d.Sxy / d.Sxx, xb = d.Sx / d.n, yb = d.Sy / d.n, a = yb - b * xb;
        const intro = L(`For ${d.n} pairs of data on ${cx} and ${cy}: ${sumsText(d)}.`, `${cx} और ${cy} के ${d.n} आँकड़ा-युग्मों के लिए: ${sumsText(d)}।`);
        if (v === 0) {
          return taskL(lang, {
            text: S(intro, L("Find Pearson's correlation coefficient r.", "पियर्सन सहसंबंध गुणांक r ज्ञात कीजिए।") + roundToL(3, lang)).replace("\n", " "),
            answer: numM(d.rv, 3, [
              [d.Sxy0 / Math.sqrt(d.Sxx0 * d.Syy0), L("Use $S_{xy}$, $S_{xx}$, $S_{yy}$: subtract the products of the sums divided by n.", "$S_{xy}$, $S_{xx}$, $S_{yy}$ लीजिए: योगों के गुणनफल को n से भाग देकर घटाइए।")],
              [b, L("$S_{xy}/S_{xx}$ is the gradient of the regression line, not r.", "$S_{xy}/S_{xx}$ समाश्रयण रेखा की ढाल है, r नहीं।")],
            ]),
            data: { given: sumsGiven(d), find: ["r"] },
            hint: L("First compute $S_{xx}$, $S_{yy}$ and $S_{xy}$.", "पहले $S_{xx}$, $S_{yy}$ और $S_{xy}$ ज्ञात कीजिए।"),
            formula: [FS, FR],
            solution: S(sLines(d), syyLine(d), R`$r = \frac{S_{xy}}{\sqrt{S_{xx}S_{yy}}} \approx ${en(d.rv, 3)}$`, L(`r ≈ ${en(d.rv, 3)}.`, `r ≈ ${en(d.rv, 3)}।`)),
          });
        }
        if (v === 1) {
          return taskL(lang, {
            text: S(intro, L("Find the gradient b of the regression line of y on x.", "x पर y की समाश्रयण रेखा की ढाल b ज्ञात कीजिए।") + roundToL(3, lang)).replace("\n", " "),
            answer: numM(b, 3, [
              [d.Sxy / d.Syy, L("For y on x divide by $S_{xx}$, not $S_{yy}$.", "x पर y के लिए $S_{xx}$ से भाग दीजिए, $S_{yy}$ से नहीं।")],
              [d.Sxy0 / d.Sxx0, L("Use $S_{xy}$ and $S_{xx}$, not the raw sums $\\sum xy$ and $\\sum x^2$.", "कच्चे योग $\\sum xy$ और $\\sum x^2$ नहीं, $S_{xy}$ और $S_{xx}$ लीजिए।")],
              [d.rv, L("That is r; the gradient is $S_{xy}/S_{xx}$.", "यह r है; ढाल $S_{xy}/S_{xx}$ है।")],
            ]),
            data: { given: sumsGiven(d), find: ["b"] },
            hint: L("The gradient of y on x is $S_{xy}/S_{xx}$.", "x पर y की ढाल $S_{xy}/S_{xx}$ है।"),
            formula: [FS, R`b = \frac{S_{xy}}{S_{xx}}`],
            solution: S(sLines(d), R`$b = \frac{S_{xy}}{S_{xx}} \approx ${en(b, 3)}$`, L(`b ≈ ${en(b, 3)}.`, `b ≈ ${en(b, 3)}।`)),
          });
        }
        return taskL(lang, {
          text: S(intro, L("The regression line of y on x is y = a + bx. Find a.", "x पर y की समाश्रयण रेखा y = a + bx है। a ज्ञात कीजिए।") + roundToL(2, lang)).replace("\n", " "),
          answer: numM(a, 2, [
            [yb + b * xb, L("$a = \\bar{y} - b\\bar{x}$: subtract, do not add.", "$a = \\bar{y} - b\\bar{x}$: घटाइए, जोड़िए नहीं।")],
            [xb - b * yb, L("The roles of x and y were swapped.", "x और y की भूमिकाएँ आपस में बदल गई हैं।")],
          ]),
          data: { given: sumsGiven(d), find: ["a"] },
          hint: L("The regression line passes through $(\\bar{x}, \\bar{y})$.", "समाश्रयण रेखा $(\\bar{x}, \\bar{y})$ से होकर जाती है।"),
          formula: [FS, R`b = \frac{S_{xy}}{S_{xx}},\ a = \bar{y} - b\bar{x}`],
          solution: S(sLines(d), R`$b ${eq4(b)} ${f4(b)}$, $\bar{x} ${eq4(xb)} ${f4(xb)}$, $\bar{y} ${eq4(yb)} ${f4(yb)}$`, R`$a = \bar{y} - b\bar{x} \approx ${en(a, 2)}$`, L(`a ≈ ${en(a, 2)}.`, `a ≈ ${en(a, 2)}।`)),
        });
      }
      const v = r.int(0, 3);
      if (v === 0) {
        const d = mk();
        if (!d) return null;
        const b = d.Sxy / d.Sxx, xb = d.Sx / d.n, yb = d.Sy / d.n, a = yb - b * xb;
        const x0 = Math.round(xb + r.int(-3, 3));
        const y0 = a + b * x0;
        return taskL(lang, {
          text: L(`For ${d.n} pairs of data on ${cx} and ${cy}: ${sumsText(d)}. Use the regression line of y on x to estimate y when x = ${x0}.${roundToL(2, lang)}`, `${cx} और ${cy} के ${d.n} आँकड़ा-युग्मों के लिए: ${sumsText(d)}। x पर y की समाश्रयण रेखा से x = ${x0} होने पर y का आकलन कीजिए।${roundToL(2, lang)}`),
          answer: numM(y0, 2, [
            [yb + b * x0, L("The line passes through $(\\bar{x}, \\bar{y})$: use $\\hat{y} = \\bar{y} + b(x - \\bar{x})$.", "रेखा $(\\bar{x}, \\bar{y})$ से होकर जाती है: $\\hat{y} = \\bar{y} + b(x - \\bar{x})$ लीजिए।")],
            [yb + (d.Sxy / d.Syy) * (x0 - xb), L("For y on x the gradient is $S_{xy}/S_{xx}$.", "x पर y के लिए ढाल $S_{xy}/S_{xx}$ है।")],
          ]),
          data: { given: [...sumsGiven(d), `x = ${x0}`], find: [R`\hat{y}`] },
          hint: L("Find $S_{xx}$ and $S_{xy}$, then the gradient and the means.", "$S_{xx}$ और $S_{xy}$ ज्ञात कीजिए, फिर ढाल और माध्य।"),
          formula: [FS, R`\hat{y} = \bar{y} + \frac{S_{xy}}{S_{xx}}(x - \bar{x})`],
          solution: S(
            sLines(d),
            R`$b ${eq4(b)} ${f4(b)}$, $\bar{x} ${eq4(xb)} ${f4(xb)}$, $\bar{y} ${eq4(yb)} ${f4(yb)}$`,
            R`$\hat{y} = ${f4(yb)} ${b < 0 ? "-" : "+"} ${f4(Math.abs(b))}(${x0} - ${f4(xb)}) \approx ${en(y0, 2)}$`,
            L(`Estimated y ≈ ${en(y0, 2)}.`, `y का आकलित मान ≈ ${en(y0, 2)}।`),
          ),
        });
      }
      if (v === 1 || v === 2) {
        const [[pn, pd], [qn, qd]] = r.pick(SLOPES);
        const sg2 = r.pick([1, -1]);
        const xb = r.int(5, 25), yb = r.int(5, 30);
        // y − ȳ = (sg·pn/pd)(x − x̄) → sg·pn x − pd y + (pd ȳ − sg·pn x̄) = 0
        const P = sg2 * pn, Qv = sg2 * qn;
        const s1 = P < 0 ? -1 : 1;
        const l1 = `${poly([[s1 * P, "x"], [-s1 * pd, "y"], [s1 * (pd * yb - P * xb), ""]])} = 0`;
        // x − x̄ = (sg·qn/qd)(y − ȳ) → qd x − sg·qn y + (sg·qn ȳ − qd x̄) = 0
        const l2 = `${poly([[qd, "x"], [-Qv, "y"], [Qv * yb - qd * xb, ""]])} = 0`;
        const byx = P / pd, bxy = Qv / qd, rr = sg2 * Math.sqrt(byx * bxy);
        if (v === 1) {
          const askX = r.int(0, 1) === 0;
          return taskL(lang, {
            text: L(`The two regression lines for a set of data are $${l1}$ and $${l2}$. Find the mean of ${askX ? "x" : "y"}.`, `किसी आँकड़ा-समूह की दो समाश्रयण रेखाएँ $${l1}$ और $${l2}$ हैं। ${askX ? "x" : "y"} का माध्य ज्ञात कीजिए।`),
            answer: numM(askX ? xb : yb, null, [[askX ? yb : xb, L("The intersection is $(\\bar{x}, \\bar{y})$; you gave the other coordinate.", "प्रतिच्छेद बिंदु $(\\bar{x}, \\bar{y})$ है; आपने दूसरा निर्देशांक दिया है।")]]),
            hint: L("Both regression lines pass through the point of means.", "दोनों समाश्रयण रेखाएँ माध्यों वाले बिंदु से होकर जाती हैं।"),
            formula: R`(\bar{x}, \bar{y}) = \text{intersection of the two lines}`,
            solution: S(
              L("Solve the two equations simultaneously:", "दोनों समीकरणों को साथ-साथ हल कीजिए:"),
              R`$${l1}$, $${l2}$`,
              R`$x = ${xb}$, $y = ${yb}$`,
              L(`So $\\bar{x} = ${xb}$ and $\\bar{y} = ${yb}$.`, `अतः $\\bar{x} = ${xb}$ और $\\bar{y} = ${yb}$।`),
            ),
          });
        }
        return taskL(lang, {
          text: L(`The regression line of y on x is $${l1}$ and the regression line of x on y is $${l2}$. Find the correlation coefficient r.`, `x पर y की समाश्रयण रेखा $${l1}$ है और y पर x की समाश्रयण रेखा $${l2}$ है। सहसंबंध गुणांक r ज्ञात कीजिए।`),
          answer: numM(rr, null, [
            [byx * bxy, L("That is $r^2$; take the square root.", "यह $r^2$ है; वर्गमूल लीजिए।")],
            [-rr, L("r has the same sign as the two regression coefficients.", "r का चिह्न दोनों समाश्रयण गुणांकों के समान होता है।")],
            [sg2 * Math.sqrt(byx / bxy), L("For x on y write the line as x = … and use the coefficient of y, not the gradient dy/dx.", "y पर x के लिए रेखा को x = … के रूप में लिखिए और y का गुणांक लीजिए, ढाल dy/dx नहीं।")],
          ]),
          hint: L("Rewrite the lines as $y = \\ldots + b_{yx}x$ and $x = \\ldots + b_{xy}y$.", "रेखाओं को $y = \\ldots + b_{yx}x$ और $x = \\ldots + b_{xy}y$ के रूप में लिखिए।"),
          formula: R`r = \pm\sqrt{b_{yx} b_{xy}}`,
          solution: S(
            R`$b_{yx} = ${fracTex(P, pd)}$, $b_{xy} = ${fracTex(Qv, qd)}$`,
            R`$r^2 = ${fracTex(P, pd)} \cdot ${fracTex(Qv, qd)} = ${en(byx * bxy)}$`,
            L(`Both coefficients are ${sg2 > 0 ? "positive" : "negative"}, so $r = ${en(rr)}$.`, `दोनों गुणांक ${sg2 > 0 ? "धनात्मक" : "ऋणात्मक"} हैं, अतः $r = ${en(rr)}$।`),
          ),
        });
      }
      const q = r.int(0, 2);
      if (q === 0) {
        const lo = r.int(2, 10) * 5, hi = lo + r.int(4, 10) * 5;
        const ins = r.shuffle([lo + 5, Math.round((lo + hi) / 2), hi - 5]).slice(0, 3);
        const out = hi + r.int(4, 10) * 5;
        return taskL(lang, {
          text: L(`A regression line of y on x was calculated from data with x-values between ${lo} and ${hi}. Which estimate of y is the least reliable?`, `x के ${lo} और ${hi} के बीच के मानों वाले आँकड़ों से x पर y की समाश्रयण रेखा ज्ञात की गई। y का कौन-सा आकलन सबसे कम विश्वसनीय है?`),
          answer: choiceWhy(r, L(`the estimate at x = ${out}`, `x = ${out} पर आकलन`), ins.map((x) => [L(`the estimate at x = ${x}`, `x = ${x} पर आकलन`), L(`x = ${x} lies inside the range of the data (interpolation).`, `x = ${x} आँकड़ों के परिसर के अंदर है (अंतर्वेशन)।`)])),
          hint: L("Is the value of x inside or outside the range of the data?", "x का मान आँकड़ों के परिसर के अंदर है या बाहर?"),
          solution: S(L(`x = ${out} lies outside ${lo}–${hi}: this is extrapolation, and the linear relationship may not hold there.`, `x = ${out}, ${lo}–${hi} के बाहर है: यह बहिर्वेशन है, और वहाँ रैखिक संबंध लागू न भी हो।`)),
        });
      }
      if (q === 1) {
        const rv = r.pick([0.86, 0.9, 0.93, 0.88]);
        const pair = r.int(0, 1);
        const [ten, thi] = pair === 0
          ? [`In a coastal town in Sri Lanka, the number of ice creams sold and the number of people rescued at the beach each day have r = ${rv}.`, `श्रीलंका के एक तटीय नगर में प्रतिदिन बिकी आइसक्रीम की संख्या और समुद्र-तट पर बचाए गए लोगों की संख्या के बीच r = ${rv} है।`]
          : [`For children aged 6 to 14 in a city in Nepal, shoe size and reading score have r = ${rv}.`, `नेपाल के एक शहर में 6 से 14 वर्ष के बच्चों के जूते के माप और पठन-अंक के बीच r = ${rv} है।`];
        const ok = pair === 0 ? L("Both may increase because of a third factor, hot weather.", "दोनों किसी तीसरे कारक, गर्म मौसम, के कारण बढ़ सकते हैं।") : L("Both may increase because of a third factor, the age of the child.", "दोनों किसी तीसरे कारक, बच्चे की आयु, के कारण बढ़ सकते हैं।");
        return taskL(lang, {
          text: L(`${ten} Which conclusion is justified?`, `${thi} कौन-सा निष्कर्ष उचित है?`),
          answer: choiceWhy(r, ok, [
            [pair === 0 ? L("Eating ice cream causes accidents at the beach.", "आइसक्रीम खाने से समुद्र-तट पर दुर्घटनाएँ होती हैं।") : L("Larger shoes make children read better.", "बड़े जूते बच्चों को बेहतर पढ़ना सिखाते हैं।"), L("Correlation alone does not prove that one variable causes the other.", "केवल सहसंबंध यह सिद्ध नहीं करता कि एक चर दूसरे का कारण है।")],
            [L("There is no relationship between the two variables.", "दोनों चरों के बीच कोई संबंध नहीं है।"), L(`r = ${rv} shows a strong linear relationship.`, `r = ${rv} एक प्रबल रैखिक संबंध दर्शाता है।`)],
            [L("When one variable increases, the other tends to decrease.", "एक चर बढ़ने पर दूसरा घटने की प्रवृत्ति रखता है।"), L("r is positive, so both tend to increase together.", "r धनात्मक है, अतः दोनों साथ-साथ बढ़ने की प्रवृत्ति रखते हैं।")],
          ]),
          hint: L("Does a high correlation tell you what causes what?", "क्या उच्च सहसंबंध यह बताता है कि किसका कारण क्या है?"),
          solution: S(L(`r = ${rv} is a strong positive correlation, but correlation is not causation; a common cause explains it.`, `r = ${rv} प्रबल धनात्मक सहसंबंध है, पर सहसंबंध कारणता नहीं है; एक साझा कारण इसे समझाता है।`)),
        });
      }
      const rv = r.pick([0.72, 0.64, -0.58, 0.81, -0.76]);
      const toM = r.int(0, 1) === 0;
      return taskL(lang, {
        text: toM
          ? L(`For students in Osaka, heights (in cm) and masses (in kg) have r = ${rv}. If all heights are converted to metres, what is the new value of r?`, `ओसाका के विद्यार्थियों की ऊँचाइयों (cm में) और द्रव्यमानों (kg में) के बीच r = ${rv} है। यदि सभी ऊँचाइयाँ मीटर में बदल दी जाएँ, तो r का नया मान क्या होगा?`)
          : L(`For days in Cairo, temperatures (in °C) and electricity use have r = ${rv}. If the temperatures are converted to °F using F = 1.8C + 32, what is the new value of r?`, `काहिरा में दिनों के तापमान (°C में) और बिजली की खपत के बीच r = ${rv} है। यदि तापमानों को F = 1.8C + 32 से °F में बदल दिया जाए, तो r का नया मान क्या होगा?`),
        answer: choiceWhy(r, `$${en(rv)}$`, [
          [`$${en(toM ? rv / 100 : r3(rv * 1.8))}$`, L("r has no units: a change of scale does not change it.", "r की कोई इकाई नहीं होती: पैमाना बदलने से यह नहीं बदलता।")],
          [`$${en(-rv)}$`, L("Multiplying by a positive number does not change the direction of the relationship.", "धनात्मक संख्या से गुणा करने पर संबंध की दिशा नहीं बदलती।")],
          [`$${en(toM ? rv * 100 : r3(rv * 1.8 + 32))}$`, L("|r| can never exceed 1; a change of units leaves r unchanged.", "|r| कभी 1 से अधिक नहीं हो सकता; इकाई बदलने पर r नहीं बदलता।")],
        ]),
        hint: L("Is r affected by a linear change of units with a positive factor?", "क्या धनात्मक गुणक वाले रैखिक इकाई-परिवर्तन से r बदलता है?"),
        solution: S(L(`A change of units multiplies x by a positive constant (and may add a constant); r is unchanged: r = ${en(rv)}.`, `इकाई-परिवर्तन x को एक धनात्मक अचर से गुणा करता है (और एक अचर जोड़ सकता है); r नहीं बदलता: r = ${en(rv)}।`)),
      });
    },
  },

  // ───────────────────────── Circle theorems ─────────────────────────
  {
    id: "exg-mat-circles",
    topics: [T("circle-theorems")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const ans = (v, list, why) => numM(v, null, list.map(([x, w]) => [x, w]));
      const mk = (text, find, given, answer, hint, formula, sol) =>
        taskL(lang, { text: text + L(" Give the answer in degrees.", " उत्तर अंशों में दीजिए।"), answer, data: { given, find: [find] }, hint, formula, solution: sol });
      const CEN = L("The angle at the centre is twice the angle at the circumference standing on the same arc.", "एक ही चाप द्वारा केंद्र पर बना कोण परिधि पर बने कोण का दोगुना होता है।");
      const SEMI = L("The angle in a semicircle is a right angle.", "अर्धवृत्त में बना कोण समकोण होता है।");
      const CYC = L("Opposite angles of a cyclic quadrilateral add up to 180°.", "चक्रीय चतुर्भुज के सम्मुख कोणों का योग 180° होता है।");
      const TAN = L("A tangent is perpendicular to the radius at the point of contact.", "स्पर्श रेखा स्पर्श बिंदु पर त्रिज्या पर लंब होती है।");
      const ALT = L("Alternate segment theorem: the angle between a tangent and a chord equals the angle in the alternate segment.", "एकांतर वृत्तखंड प्रमेय: स्पर्श रेखा और जीवा के बीच का कोण एकांतर वृत्तखंड में बने कोण के बराबर होता है।");
      const TWO = L("Tangents from an external point are equal in length.", "बाह्य बिंदु से खींची गई स्पर्श रेखाएँ लंबाई में बराबर होती हैं।");
      if (level === 1) {
        const v = r.int(0, 4);
        if (v === 0) {
          const x = r.int(20, 85), rev = r.int(0, 1) === 0;
          return rev
            ? mk(L(`A, B and C lie on a circle with centre O, and C is on the major arc AB. If $${ang("AOB", 2 * x)}$, find $\\angle ACB$.`, `A, B और C केंद्र O वाले एक वृत्त पर स्थित हैं और C दीर्घ चाप AB पर है। यदि $${ang("AOB", 2 * x)}$, तो $\\angle ACB$ ज्ञात कीजिए।`),
              R`\angle ACB`, [ang("AOB", 2 * x)], ans(x, [[4 * x, L("The angle at the centre is the larger one; halve it.", "केंद्र पर बना कोण बड़ा होता है; उसका आधा लीजिए।")], [180 - 2 * x, L("The angles are not supplementary; use the angle at the centre theorem.", "ये कोण संपूरक नहीं हैं; केंद्र वाले कोण का प्रमेय लगाइए।")]]),
              L("Both angles stand on the same arc AB.", "दोनों कोण एक ही चाप AB पर बने हैं।"), R`\angle AOB = 2\angle ACB`,
              S(CEN, R`$\angle ACB = \frac{${2 * x}^\circ}{2} = ${x}^\circ$`))
            : mk(L(`A, B and C lie on a circle with centre O, and C is on the major arc AB. If $${ang("ACB", x)}$, find the angle AOB.`, `A, B और C केंद्र O वाले एक वृत्त पर स्थित हैं और C दीर्घ चाप AB पर है। यदि $${ang("ACB", x)}$, तो कोण AOB ज्ञात कीजिए।`),
              R`\angle AOB`, [ang("ACB", x)], ans(2 * x, [[x / 2, L("The angle at the centre is twice, not half, the angle at the circumference.", "केंद्र पर बना कोण परिधि वाले कोण का दोगुना होता है, आधा नहीं।")], [180 - x, L("The angles are not supplementary; use the angle at the centre theorem.", "ये कोण संपूरक नहीं हैं; केंद्र वाले कोण का प्रमेय लगाइए।")]]),
              L("Both angles stand on the same arc AB.", "दोनों कोण एक ही चाप AB पर बने हैं।"), R`\angle AOB = 2\angle ACB`,
              S(CEN, R`$\angle AOB = 2 \cdot ${x}^\circ = ${2 * x}^\circ$`));
        }
        if (v === 1) {
          const x = r.int(15, 75);
          return mk(L(`AB is a diameter of a circle and C is a point on the circle. If $${ang("CAB", x)}$, find $\\angle CBA$.`, `AB एक वृत्त का व्यास है और C वृत्त पर एक बिंदु है। यदि $${ang("CAB", x)}$, तो $\\angle CBA$ ज्ञात कीजिए।`),
            R`\angle CBA`, [ang("CAB", x)], ans(90 - x, [[180 - x, L("The third angle of the triangle is 90°, so the two others add up to 90°.", "त्रिभुज का तीसरा कोण 90° है, अतः अन्य दो का योग 90° है।")], [x, L("Triangle ABC is not isosceles in general.", "त्रिभुज ABC सामान्यतः समद्विबाहु नहीं होता।")]]),
            L("What is $\\angle ACB$?", "$\\angle ACB$ कितना है?"), R`\angle ACB = 90^\circ`,
            S(SEMI, R`$\angle ACB = 90^\circ$`, R`$\angle CBA = 180^\circ - 90^\circ - ${x}^\circ = ${90 - x}^\circ$`));
        }
        if (v === 2) {
          const x = r.int(55, 130);
          return mk(L(`ABCD is a cyclic quadrilateral with $${ang("ABC", x)}$. Find $\\angle ADC$.`, `ABCD एक चक्रीय चतुर्भुज है जिसमें $${ang("ABC", x)}$ है। $\\angle ADC$ ज्ञात कीजिए।`),
            R`\angle ADC`, [ang("ABC", x)], ans(180 - x, [[x, L("Opposite angles of a cyclic quadrilateral are supplementary, not equal.", "चक्रीय चतुर्भुज के सम्मुख कोण संपूरक होते हैं, बराबर नहीं।")], [360 - x, L("Opposite angles add up to 180°, not 360°.", "सम्मुख कोणों का योग 180° होता है, 360° नहीं।")]]),
            L("B and D are opposite vertices.", "B और D सम्मुख शीर्ष हैं।"), R`\angle ABC + \angle ADC = 180^\circ`,
            S(CYC, R`$\angle ADC = 180^\circ - ${x}^\circ = ${180 - x}^\circ$`));
        }
        if (v === 3) {
          const x = r.int(20, 75);
          return mk(L(`PA is the tangent at A to a circle with centre O. If $${ang("AOP", x)}$, find $\\angle APO$.`, `PA केंद्र O वाले वृत्त के बिंदु A पर स्पर्श रेखा है। यदि $${ang("AOP", x)}$, तो $\\angle APO$ ज्ञात कीजिए।`),
            R`\angle APO`, [ang("AOP", x)], ans(90 - x, [[180 - x, L("$\\angle OAP = 90^\\circ$ is also part of the triangle.", "$\\angle OAP = 90^\\circ$ भी त्रिभुज का एक कोण है।")], [x, L("Triangle OAP is right-angled at A, not isosceles.", "त्रिभुज OAP, A पर समकोण है, समद्विबाहु नहीं।")]]),
            L("Look at triangle OAP.", "त्रिभुज OAP देखिए।"), R`OA \perp PA`,
            S(TAN, R`$\angle OAP = 90^\circ$`, R`$\angle APO = 180^\circ - 90^\circ - ${x}^\circ = ${90 - x}^\circ$`));
        }
        const x = r.int(20, 80);
        return mk(L(`C and D lie on the same arc AB of a circle (on the same side of chord AB). If $${ang("ACB", x)}$, find $\\angle ADB$.`, `C और D किसी वृत्त के एक ही चाप AB पर (जीवा AB के एक ही ओर) स्थित हैं। यदि $${ang("ACB", x)}$, तो $\\angle ADB$ ज्ञात कीजिए।`),
          R`\angle ADB`, [ang("ACB", x)], ans(x, [[180 - x, L("C and D are on the same side of AB, so the angles are equal, not supplementary.", "C और D, AB के एक ही ओर हैं, अतः कोण बराबर हैं, संपूरक नहीं।")], [2 * x, L("Doubling is for the angle at the centre.", "दोगुना केवल केंद्र पर बने कोण के लिए होता है।")]]),
          L("Both angles stand on chord AB in the same segment.", "दोनों कोण एक ही वृत्तखंड में जीवा AB पर बने हैं।"), R`\angle ACB = \angle ADB`,
          S(L("Angles in the same segment are equal.", "एक ही वृत्तखंड के कोण बराबर होते हैं।"), R`$\angle ADB = ${x}^\circ$`));
      }
      if (level === 2) {
        const v = r.int(0, 4);
        if (v === 0) {
          const x = r.int(20, 70);
          return mk(L(`O is the centre of a circle and AB is a chord with $${ang("OAB", x)}$. C is a point on the major arc AB. Find $\\angle ACB$.`, `O वृत्त का केंद्र है और AB एक जीवा है, जिसमें $${ang("OAB", x)}$ है। C दीर्घ चाप AB पर एक बिंदु है। $\\angle ACB$ ज्ञात कीजिए।`),
            R`\angle ACB`, [ang("OAB", x)], ans(90 - x, [[180 - 2 * x, L("That is $\\angle AOB$; the angle at the circumference is half of it.", "यह $\\angle AOB$ है; परिधि पर बना कोण इसका आधा है।")], [x, L("Find $\\angle AOB$ first from the isosceles triangle OAB.", "पहले समद्विबाहु त्रिभुज OAB से $\\angle AOB$ ज्ञात कीजिए।")]]),
            L("OA = OB, so triangle OAB is isosceles.", "OA = OB, अतः त्रिभुज OAB समद्विबाहु है।"), R`\angle AOB = 2\angle ACB`,
            S(R`$OA = OB \Rightarrow \angle OBA = ${x}^\circ$`, R`$\angle AOB = 180^\circ - 2 \cdot ${x}^\circ = ${180 - 2 * x}^\circ$`, CEN, R`$\angle ACB = ${90 - x}^\circ$`));
        }
        if (v === 1) {
          const x = 2 * r.int(15, 50), askPAB = r.int(0, 1) === 0;
          return askPAB
            ? mk(L(`PA and PB are tangents from an external point P to a circle, touching it at A and B. If $${ang("APB", x)}$, find $\\angle PAB$.`, `बाह्य बिंदु P से वृत्त पर PA और PB स्पर्श रेखाएँ हैं, जो उसे A और B पर स्पर्श करती हैं। यदि $${ang("APB", x)}$, तो $\\angle PAB$ ज्ञात कीजिए।`),
              R`\angle PAB`, [ang("APB", x)], ans(90 - x / 2, [[180 - x, L("PA = PB, so the two base angles share $180^\\circ - \\angle APB$ equally.", "PA = PB, अतः दोनों आधार-कोण $180^\\circ - \\angle APB$ को बराबर बाँटते हैं।")], [90 - x, L("The base angles are equal; halve $180^\\circ - \\angle APB$.", "आधार-कोण बराबर हैं; $180^\\circ - \\angle APB$ का आधा लीजिए।")]]),
              L("Which sides of triangle PAB are equal?", "त्रिभुज PAB की कौन-सी भुजाएँ बराबर हैं?"), R`PA = PB`,
              S(TWO, R`$\angle PAB = \angle PBA = \frac{180^\circ - ${x}^\circ}{2} = ${90 - x / 2}^\circ$`))
            : mk(L(`PA and PB are tangents from an external point P to a circle with centre O, touching it at A and B. If $${ang("APB", x)}$, find $\\angle AOB$.`, `बाह्य बिंदु P से केंद्र O वाले वृत्त पर PA और PB स्पर्श रेखाएँ हैं, जो उसे A और B पर स्पर्श करती हैं। यदि $${ang("APB", x)}$, तो $\\angle AOB$ ज्ञात कीजिए।`),
              R`\angle AOB`, [ang("APB", x)], ans(180 - x, [[x, L("OAPB is a quadrilateral with two right angles, so $\\angle AOB$ and $\\angle APB$ are supplementary.", "OAPB में दो समकोण हैं, अतः $\\angle AOB$ और $\\angle APB$ संपूरक हैं।")], [360 - x, L("Subtract the two right angles at A and B as well.", "A और B पर बने दो समकोण भी घटाइए।")]]),
              L("Use the angles of quadrilateral OAPB.", "चतुर्भुज OAPB के कोणों का उपयोग कीजिए।"), R`OA \perp PA,\ OB \perp PB`,
              S(TAN, R`$\angle AOB = 360^\circ - 90^\circ - 90^\circ - ${x}^\circ = ${180 - x}^\circ$`));
        }
        if (v === 2) {
          const x = r.int(35, 80), y = r.int(30, 80);
          if (x + y >= 160) return null;
          return mk(L(`TA is the tangent at A to a circle, and B and C are points on the circle. The angle between the tangent TA and the chord AB is $${ang("TAB", x)}$, with C in the alternate segment. If $${ang("CAB", y)}$, find $\\angle ABC$.`, `TA वृत्त के बिंदु A पर स्पर्श रेखा है, और B तथा C वृत्त पर बिंदु हैं। स्पर्श रेखा TA और जीवा AB के बीच का कोण $${ang("TAB", x)}$ है और C एकांतर वृत्तखंड में है। यदि $${ang("CAB", y)}$, तो $\\angle ABC$ ज्ञात कीजिए।`),
            R`\angle ABC`, [ang("TAB", x), ang("CAB", y)], ans(180 - x - y, [[x, L(`That is $\\angle ACB$; the question asks for $\\angle ABC$.`, `यह $\\angle ACB$ है; प्रश्न $\\angle ABC$ पूछता है।`)], [90 - y, L("Triangle ABC has no right angle here; use the alternate segment theorem.", "यहाँ त्रिभुज ABC में कोई समकोण नहीं है; एकांतर वृत्तखंड प्रमेय लगाइए।")]]),
            L("Find $\\angle ACB$ first.", "पहले $\\angle ACB$ ज्ञात कीजिए।"), R`\angle TAB = \angle ACB`,
            S(ALT, R`$\angle ACB = ${x}^\circ$`, R`$\angle ABC = 180^\circ - ${x}^\circ - ${y}^\circ = ${180 - x - y}^\circ$`));
        }
        if (v === 3) {
          const x = 2 * r.int(35, 80);
          return mk(L(`A, B and C lie on a circle with centre O, and C is on the minor arc AB. If $${ang("AOB", x)}$ (the non-reflex angle), find $\\angle ACB$.`, `A, B और C केंद्र O वाले वृत्त पर स्थित हैं और C लघु चाप AB पर है। यदि $${ang("AOB", x)}$ (अप्रतिवर्ती कोण), तो $\\angle ACB$ ज्ञात कीजिए।`),
            R`\angle ACB`, [ang("AOB", x)], ans(180 - x / 2, [[x / 2, L("C is on the minor arc, so $\\angle ACB$ stands on the major arc: use the reflex angle at O.", "C लघु चाप पर है, अतः $\\angle ACB$ दीर्घ चाप पर बना है: O पर प्रतिवर्ती कोण लीजिए।")], [360 - x, L("That is the reflex angle at O; halve it.", "यह O पर प्रतिवर्ती कोण है; उसका आधा लीजिए।")]]),
            L("Which arc does $\\angle ACB$ stand on?", "$\\angle ACB$ किस चाप पर बना है?"), R`\angle ACB = \frac{1}{2}\,\text{reflex}\,\angle AOB`,
            S(R`${L("Reflex", "प्रतिवर्ती")} $\angle AOB = 360^\circ - ${x}^\circ = ${360 - x}^\circ$`, CEN, R`$\angle ACB = \frac{${360 - x}^\circ}{2} = ${180 - x / 2}^\circ$`));
        }
        const x = r.int(55, 125);
        return mk(L(`ABCD is a cyclic quadrilateral. The side AB is extended beyond B to E, and $${ang("CBE", x)}$. Find $\\angle ADC$.`, `ABCD एक चक्रीय चतुर्भुज है। भुजा AB को B से आगे E तक बढ़ाया गया है और $${ang("CBE", x)}$ है। $\\angle ADC$ ज्ञात कीजिए।`),
          R`\angle ADC`, [ang("CBE", x)], ans(x, [[180 - x, L("That is $\\angle ABC$; now use the opposite angle.", "यह $\\angle ABC$ है; अब सम्मुख कोण लीजिए।")], [2 * x, L("No angle at the centre is involved here.", "यहाँ केंद्र पर बना कोई कोण नहीं है।")]]),
          L("Find $\\angle ABC$ from the straight line ABE.", "सरल रेखा ABE से $\\angle ABC$ ज्ञात कीजिए।"), R`\angle ABC + \angle ADC = 180^\circ`,
          S(R`$\angle ABC = 180^\circ - ${x}^\circ = ${180 - x}^\circ$`, CYC, R`$\angle ADC = 180^\circ - ${180 - x}^\circ = ${x}^\circ$`, L("(The exterior angle of a cyclic quadrilateral equals the interior opposite angle.)", "(चक्रीय चतुर्भुज का बहिष्कोण अंतःसम्मुख कोण के बराबर होता है।)")));
      }
      const v = r.int(0, 4);
      if (v === 0) {
        let a, b, c, d, x;
        do {
          a = r.int(2, 5);
          c = r.int(1, 4);
          b = r.int(-20, 30);
          x = r.int(10, 30);
          d = 180 - (a + c) * x - b;
        } while (a * x + b < 30 || c * x + d < 30 || a * x + b > 150 || c * x + d > 150 || a === c || d === 0);
        const A1 = a * x + b, A2 = c * x + d;
        const e1 = poly([[a, "x"], [b, ""]]), e2 = poly([[c, "x"], [d, ""]]);
        const big = Math.max(A1, A2);
        return mk(L(`In the cyclic quadrilateral ABCD, $\\angle A = (${e1})^\\circ$ and $\\angle C = (${e2})^\\circ$. Find the larger of these two angles.`, `चक्रीय चतुर्भुज ABCD में $\\angle A = (${e1})^\\circ$ और $\\angle C = (${e2})^\\circ$ है। इन दोनों कोणों में से बड़ा कोण ज्ञात कीजिए।`),
          R`\max(\angle A, \angle C)`, [R`\angle A = (${e1})^\circ`, R`\angle C = (${e2})^\circ`], ans(big, [[x, L("That is x; substitute it back to find the angle.", "यह x है; कोण ज्ञात करने के लिए इसे वापस रखिए।")], [Math.min(A1, A2), L("That is the smaller angle.", "यह छोटा कोण है।")], [Number.isInteger((360 - b - d) / (a + c)) ? a * ((360 - b - d) / (a + c)) + b : NaN, L("Opposite angles add up to 180°, not 360°.", "सम्मुख कोणों का योग 180° होता है, 360° नहीं।")]]),
          L("A and C are opposite angles.", "A और C सम्मुख कोण हैं।"), R`\angle A + \angle C = 180^\circ`,
          S(CYC, R`$${e1} + ${e2} = 180 \Rightarrow ${a + c}x ${b + d < 0 ? "-" : "+"} ${Math.abs(b + d)} = 180 \Rightarrow x = ${x}$`, R`$\angle A = ${A1}^\circ$, $\angle C = ${A2}^\circ$`, L(`The larger angle is ${big}°.`, `बड़ा कोण ${big}° है।`)));
      }
      if (v === 1) {
        const y = r.int(25, 80);
        return mk(L(`PA and PB are tangents from P to a circle, touching it at A and B. C is a point on the major arc AB with $${ang("ACB", y)}$. Find $\\angle APB$.`, `P से वृत्त पर PA और PB स्पर्श रेखाएँ हैं, जो उसे A और B पर स्पर्श करती हैं। C दीर्घ चाप AB पर एक बिंदु है और $${ang("ACB", y)}$ है। $\\angle APB$ ज्ञात कीजिए।`),
          R`\angle APB`, [ang("ACB", y)], ans(180 - 2 * y, [[180 - y, L("First find $\\angle AOB = 2\\angle ACB$ at the centre.", "पहले केंद्र पर $\\angle AOB = 2\\angle ACB$ ज्ञात कीजिए।")], [2 * y, L("That is $\\angle AOB$; $\\angle APB$ is its supplement.", "यह $\\angle AOB$ है; $\\angle APB$ इसका संपूरक है।")]]),
          L("Join A and B to the centre O.", "A और B को केंद्र O से मिलाइए।"), [R`\angle AOB = 2\angle ACB`, R`\angle AOB + \angle APB = 180^\circ`],
          S(CEN, R`$\angle AOB = ${2 * y}^\circ$`, TAN, R`$\angle APB = 360^\circ - 90^\circ - 90^\circ - ${2 * y}^\circ = ${180 - 2 * y}^\circ$`));
      }
      if (v === 2) {
        const x = r.int(25, 75);
        return mk(L(`TA is the tangent at A to a circle with centre O, and AB is a chord with $${ang("TAB", x)}$. Find $\\angle OBA$.`, `TA केंद्र O वाले वृत्त के बिंदु A पर स्पर्श रेखा है और AB एक जीवा है, जिसमें $${ang("TAB", x)}$ है। $\\angle OBA$ ज्ञात कीजिए।`),
          R`\angle OBA`, [ang("TAB", x)], ans(90 - x, [[x, L("$\\angle TAB$ equals the angle in the alternate segment, not the base angle of triangle OAB.", "$\\angle TAB$ एकांतर वृत्तखंड के कोण के बराबर है, त्रिभुज OAB के आधार-कोण के नहीं।")], [2 * x, L("That is $\\angle AOB$; the base angles share the rest.", "यह $\\angle AOB$ है; आधार-कोण शेष को बाँटते हैं।")], [180 - 2 * x, L("Subtract the angle at O from 180° and then halve.", "180° में से O वाला कोण घटाकर आधा कीजिए।")]]),
          L("$\\angle OAT = 90^\\circ$ and OA = OB.", "$\\angle OAT = 90^\\circ$ और OA = OB।"), R`OA \perp TA`,
          S(TAN, R`$\angle OAB = 90^\circ - ${x}^\circ = ${90 - x}^\circ$`, R`$OA = OB \Rightarrow \angle OBA = \angle OAB = ${90 - x}^\circ$`));
      }
      if (v === 3) {
        const x = r.int(20, 55), y = r.int(20, 55);
        return mk(L(`ABCD is a cyclic quadrilateral in which AC is a diameter. If $${ang("BAC", x)}$ and $${ang("CAD", y)}$, find $\\angle BCD$.`, `ABCD एक चक्रीय चतुर्भुज है जिसमें AC व्यास है। यदि $${ang("BAC", x)}$ और $${ang("CAD", y)}$, तो $\\angle BCD$ ज्ञात कीजिए।`),
          R`\angle BCD`, [ang("BAC", x), ang("CAD", y)], ans(180 - x - y, [[x + y, L("That is $\\angle BAD$; the opposite angle is its supplement.", "यह $\\angle BAD$ है; सम्मुख कोण इसका संपूरक है।")], [90 - x, L("That is only $\\angle ACB$; add $\\angle ACD$ too.", "यह केवल $\\angle ACB$ है; $\\angle ACD$ भी जोड़िए।")]]),
          L("Either use the semicircle angles at B and D, or the opposite angles of ABCD.", "या तो B और D पर अर्धवृत्त के कोण लीजिए, या ABCD के सम्मुख कोण।"), R`\angle BAD + \angle BCD = 180^\circ`,
          S(SEMI, R`$\angle ACB = 90^\circ - ${x}^\circ = ${90 - x}^\circ$, $\angle ACD = 90^\circ - ${y}^\circ = ${90 - y}^\circ$`, R`$\angle BCD = ${90 - x}^\circ + ${90 - y}^\circ = ${180 - x - y}^\circ$`, L(`(Check: $\\angle BAD = ${x + y}^\\circ$ and ${x + y}° + ${180 - x - y}° = 180°.)`, `(जाँच: $\\angle BAD = ${x + y}^\\circ$ और ${x + y}° + ${180 - x - y}° = 180°।)`)));
      }
      const x = r.int(35, 80);
      return mk(L(`PA and PB are tangents from P to a circle, touching it at A and B, and $${ang("PAB", x)}$. C is a point on the major arc AB. Find $\\angle ACB$.`, `P से वृत्त पर PA और PB स्पर्श रेखाएँ हैं, जो उसे A और B पर स्पर्श करती हैं, और $${ang("PAB", x)}$ है। C दीर्घ चाप AB पर एक बिंदु है। $\\angle ACB$ ज्ञात कीजिए।`),
        R`\angle ACB`, [ang("PAB", x)], ans(x, [[180 - 2 * x, L("That is $\\angle APB$, not an angle in the circle.", "यह $\\angle APB$ है, वृत्त के अंदर का कोण नहीं।")], [90 - x, L("Use the alternate segment theorem with tangent PA and chord AB.", "स्पर्श रेखा PA और जीवा AB के साथ एकांतर वृत्तखंड प्रमेय लगाइए।")], [2 * x, L("Doubling gives the angle at the centre, not at C.", "दोगुना करने पर केंद्र वाला कोण मिलता है, C वाला नहीं।")]]),
        L("Look at the angle between tangent PA and chord AB.", "स्पर्श रेखा PA और जीवा AB के बीच का कोण देखिए।"), R`\angle PAB = \angle ACB`,
        S(ALT, R`$\angle ACB = \angle PAB = ${x}^\circ$`));
    },
  },
];
