// Indija: izpitne naloge (CBSE, ICSE/ISC, državne šole, JEE, NEET), angleško in hindijsko.
// Vsak generator ima langs: ["en", "hi"] in gen(level, r, topic, lang); besedila z L = bi(lang).
// Vse naključne izbire so pred izbiro besedil (isto seme → ista naloga v obeh jezikih).
import { en, numM, task, choiceWhy, bi, roundToL, fracTex, fractionM, poly, sg, sco } from "./exam-util.js";
import { gcd } from "../check.js";

const T = (slug) => `MAT-EXB/${slug}`;
const R = String.raw;
// Rešitev: vrstice, združene z novo vrstico (prazne izpustimo).
const S = (...lines) => lines.filter((x) => x !== "" && x != null && x !== false).join("\n");
const NAMES = [
  ["Aarav", "आरव"], ["Priya", "प्रिया"], ["Rohan", "रोहन"], ["Ananya", "अनन्या"], ["Kabir", "कबीर"],
  ["Meera", "मीरा"], ["Ishaan", "ईशान"], ["Kavya", "काव्या"], ["Arjun", "अर्जुन"], ["Sneha", "स्नेहा"],
];
const r2 = (v) => Math.round(v * 100) / 100;
// Ali ima vrednost največ dve decimalki (točen rezultat)?
const isEx = (v) => Math.abs(v * 100 - Math.round(v * 100)) < 1e-6;
// Številski odgovor: točen, če ima največ 2 decimalki, sicer zaokrožen na 2.
const ansN = (v, list = []) => (isEx(v) ? numM(r2(v), null, list) : numM(v, 2, list));
const rnd = (v, lang) => (isEx(v) ? "" : roundToL(2, lang));
const f2 = (v) => (isEx(v) ? en(r2(v)) : en(v, 2));
const eqs = (v) => (isEx(v) ? "=" : R`\approx`);
const lcm = (a, b) => (a / gcd(a, b)) * b;
const pm = (v) => (v < 0 ? `(${en(v)})` : en(v));
const fmap = (n) => {
  const m = new Map();
  for (let p = 2; p * p <= n; p++) while (n % p === 0) { m.set(p, (m.get(p) || 0) + 1); n /= p; }
  if (n > 1) m.set(n, (m.get(n) || 0) + 1);
  return m;
};
const pf = (n) => [...fmap(n)].map(([p, e]) => (e > 1 ? `${p}^{${e}}` : `${p}`)).join(R` \times `);
// "pf = n", brez podvajanja pri praštevilu (5 = 5).
const pfEq = (n) => (pf(n) === String(n) ? `${n}` : `${pf(n)} = ${n}`);
const FHCF = (L) => L(R`\text{HCF} = \text{product of the smallest powers of the common primes}`, R`\text{HCF} = \text{उभयनिष्ठ अभाज्य गुणनखंडों की सबसे छोटी घातों का गुणनफल}`);
const FLCM = (L) => L(R`\text{LCM} = \text{product of the greatest powers of all primes}`, R`\text{LCM} = \text{सभी अभाज्य गुणनखंडों की सबसे बड़ी घातों का गुणनफल}`);
const lin = (p, v = "x") => (p === 0 ? v : `${v} ${sg(p)}`);
// Ulomek v besedilu: "Give … as a fraction in lowest terms."
const fracNote = (L) => L(" Give the answer as a fraction in lowest terms if it is not a whole number.", " यदि उत्तर पूर्णांक नहीं है, तो उसे न्यूनतम पदों में भिन्न के रूप में लिखिए।");
// p(t) za koeficiente [a3, a2, a1, a0]
const ev = (c, t) => c.reduce((s, k) => s * t + k, 0);
const cubic = (c) => poly([[c[0], "x^3"], [c[1], "x^2"], [c[2], "x"], [c[3], ""]]);
const sub3 = (c, t) => poly([[c[0], `(${en(t)})^3`], [c[1], `(${en(t)})^2`], [c[2], `(${en(t)})`], [c[3], ""]]).replace(/^(\d+)\(/, "$1(");
// Tabela razredov (2 stolpca): razred | frekvenca.
const tab = (L, lo, h, f) => R`$\begin{array}{c|c} \text{${L("Class", "वर्ग")}} & \text{${L("Frequency", "बारंबारता")}} \\ \hline ${f.map((x, i) => R`${lo + i * h}\text{–}${lo + (i + 1) * h} & ${x}`).join(R` \\ `)} \end{array}$`;
// Pitagorejske četverke a² + b² + c² = d² (smerni kosinusi z lepimi ulomki).
const QUAD = [[1, 2, 2, 3], [2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 10, 11, 15], [2, 5, 14, 15], [8, 9, 12, 17], [6, 10, 15, 19], [1, 12, 12, 17]];
// Kot v stopinjah kot večkratnik π: 120 → \frac{2\pi}{3}.
const piTex = (deg) => {
  if (deg === 0) return "0";
  const g = gcd(Math.abs(deg), 180), n = Math.abs(deg) / g, d = 180 / g, s = deg < 0 ? "-" : "";
  const top = n === 1 ? R`\pi` : R`${n}\pi`;
  return d === 1 ? `${s}${top}` : R`${s}\frac{${top}}{${d}}`;
};
// Inverzne kotne funkcije: glavne veje in standardne vrednosti (kot θ° → vrednost funkcije).
const ITF = {
  sin: { name: "sin⁻¹", tex: R`\sin^{-1}`, fwd: R`\sin`, odd: true, th: [30, 45, 60, 90], val: { 30: R`\frac{1}{2}`, 45: R`\frac{1}{\sqrt{2}}`, 60: R`\frac{\sqrt{3}}{2}`, 90: "1" }, range: R`\left[-\frac{\pi}{2}, \frac{\pi}{2}\right]`, rangeD: "[−90°, 90°]" },
  cos: { name: "cos⁻¹", tex: R`\cos^{-1}`, fwd: R`\cos`, odd: false, th: [30, 45, 60], val: { 30: R`\frac{\sqrt{3}}{2}`, 45: R`\frac{1}{\sqrt{2}}`, 60: R`\frac{1}{2}` }, range: R`[0, \pi]`, rangeD: "[0°, 180°]" },
  tan: { name: "tan⁻¹", tex: R`\tan^{-1}`, fwd: R`\tan`, odd: true, th: [30, 45, 60], val: { 30: R`\frac{1}{\sqrt{3}}`, 45: "1", 60: R`\sqrt{3}` }, range: R`\left(-\frac{\pi}{2}, \frac{\pi}{2}\right)`, rangeD: "(−90°, 90°)" },
  cot: { name: "cot⁻¹", tex: R`\cot^{-1}`, fwd: R`\cot`, odd: false, th: [30, 45, 60], val: { 30: R`\sqrt{3}`, 45: "1", 60: R`\frac{1}{\sqrt{3}}` }, range: R`(0, \pi)`, rangeD: "(0°, 180°)" },
  sec: { name: "sec⁻¹", tex: R`\sec^{-1}`, fwd: R`\sec`, odd: false, th: [30, 45, 60], val: { 30: R`\frac{2}{\sqrt{3}}`, 45: R`\sqrt{2}`, 60: "2" }, range: R`[0, \pi] - \left\{\frac{\pi}{2}\right\}`, rangeD: "[0°, 180°] − {90°}" },
  cosec: { name: "cosec⁻¹", tex: R`\operatorname{cosec}^{-1}`, fwd: R`\operatorname{cosec}`, odd: true, th: [30, 45, 60], val: { 30: "2", 45: R`\sqrt{2}`, 60: R`\frac{2}{\sqrt{3}}` }, range: R`\left[-\frac{\pi}{2}, \frac{\pi}{2}\right] - \{0\}`, rangeD: "[−90°, 90°] − {0°}" },
};
// Hindijska rešitev mora imeti vsaj eno vrstico besedila (ne samo formule).
const taskL = (lang, o) => {
  if (lang === "hi" && !/[\u0900-\u097F]/.test(String(o.solution).replace(/\$[^$]*\$/g, ""))) o.solution = "हल:\n" + o.solution;
  return task(o);
};
const divTex = (t) => (t > 0 ? `x - ${t}` : `x + ${-t}`);

export const EXAM_IN_MAT = [
  // ───────────────────────── Real numbers ─────────────────────────
  {
    id: "exi-mat-hcf-lcm",
    topics: [T("real-numbers")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      if (level === 1) {
        let a, b;
        do {
          a = 2 ** r.int(1, 4) * 3 ** r.int(0, 2) * r.pick([1, 5, 7]);
          b = 2 ** r.int(0, 3) * 3 ** r.int(1, 3) * r.pick([1, 5, 11]);
        } while (a === b || gcd(a, b) === 1 || Math.min(a, b) < 20 || Math.max(a, b) > 1000);
        const askH = r.int(0, 1) === 0;
        const h = gcd(a, b), l = lcm(a, b);
        const fa = fmap(a), fb = fmap(b);
        let hmax = 1;
        for (const [p, e] of fa) if (fb.has(p)) hmax *= p ** Math.max(e, fb.get(p));
        const what = askH ? L("HCF", "HCF (महत्तम समापवर्तक)") : L("LCM", "LCM (लघुत्तम समापवर्त्य)");
        return taskL(lang, {
          text: L(`Using prime factorisation, find the ${what} of ${a} and ${b}.`, `अभाज्य गुणनखंडन विधि से ${a} और ${b} का ${what} ज्ञात कीजिए।`),
          answer: askH
            ? numM(h, null, [
                [l, L("That is the LCM. For the HCF take only the common primes, each with its smallest power.", "यह LCM है। HCF के लिए केवल उभयनिष्ठ अभाज्य गुणनखंड लीजिए, प्रत्येक की सबसे छोटी घात के साथ।")],
                [hmax, L("For the HCF take the smallest power of each common prime, not the greatest.", "HCF में प्रत्येक उभयनिष्ठ अभाज्य गुणनखंड की सबसे छोटी घात लीजिए, सबसे बड़ी नहीं।")],
              ])
            : numM(l, null, [
                [h, L("That is the HCF. For the LCM take every prime that appears, each with its greatest power.", "यह HCF है। LCM के लिए हर अभाज्य गुणनखंड लीजिए, प्रत्येक की सबसे बड़ी घात के साथ।")],
                [a * b, L("The product counts the common factors twice; it is a common multiple, but not the least.", "गुणनफल में उभयनिष्ठ गुणनखंड दो बार गिने जाते हैं; यह एक सार्व गुणज है, पर सबसे छोटा नहीं।")],
              ]),
          data: { given: [`a = ${a}`, `b = ${b}`], find: [askH ? R`\text{HCF}(a, b)` : R`\text{LCM}(a, b)`] },
          hint: L("Write each number as a product of prime powers first.", "पहले प्रत्येक संख्या को अभाज्य संख्याओं की घातों के गुणनफल के रूप में लिखिए।"),
          formula: askH ? FHCF(L) : FLCM(L),
          solution: S(
            `$${a} = ${pf(a)}$`,
            `$${b} = ${pf(b)}$`,
            askH
              ? L("Common primes with their smallest powers:", "उभयनिष्ठ अभाज्य गुणनखंड, सबसे छोटी घातों के साथ:")
              : L("All primes with their greatest powers:", "सभी अभाज्य गुणनखंड, सबसे बड़ी घातों के साथ:"),
            askH ? R`$\text{HCF} = ${pfEq(h)}$` : R`$\text{LCM} = ${pfEq(l)}$`,
          ),
        });
      }
      if (level === 2) {
        const v = r.int(0, 2);
        if (v === 0) {
          const h = r.pick([6, 8, 9, 12, 13, 14, 15, 18, 23, 26]);
          let m, n;
          do { m = r.int(2, 9); n = r.int(2, 9); } while (m === n || gcd(m, n) !== 1);
          const a = h * m, b = h * n, l = h * m * n;
          const askOther = r.int(0, 1) === 0;
          if (askOther) {
            return taskL(lang, {
              text: L(`The HCF of two numbers is ${h} and their LCM is ${l}. If one of the numbers is ${a}, find the other number.`, `दो संख्याओं का HCF ${h} और LCM ${l} है। यदि इनमें से एक संख्या ${a} है, तो दूसरी संख्या ज्ञात कीजिए।`),
              answer: numM(b, null, [
                [h * l, L("You multiplied HCF and LCM but did not divide by the given number.", "आपने HCF और LCM का गुणा किया, पर दी गई संख्या से भाग नहीं दिया।")],
                [(a * l) / h, L("Use HCF × LCM = product of the two numbers, then divide by the known number.", "HCF × LCM = दोनों संख्याओं का गुणनफल लीजिए, फिर ज्ञात संख्या से भाग दीजिए।")],
              ]),
              data: { given: [R`\text{HCF} = ${h}`, R`\text{LCM} = ${l}`, `a = ${a}`], find: ["b"] },
              hint: L("For two numbers, HCF × LCM equals the product of the numbers.", "दो संख्याओं के लिए HCF × LCM = उन संख्याओं का गुणनफल।"),
              formula: R`\text{HCF}(a, b) \times \text{LCM}(a, b) = a \times b`,
              solution: S(
                L("Product of the two numbers = HCF × LCM:", "दोनों संख्याओं का गुणनफल = HCF × LCM:"),
                R`$${a} \times b = ${h} \times ${l} = ${h * l}$`,
                R`$b = \dfrac{${h * l}}{${a}} = ${b}$`,
              ),
            });
          }
          return taskL(lang, {
            text: L(`Given that HCF(${a}, ${b}) = ${h}, find LCM(${a}, ${b}).`, `दिया है कि HCF(${a}, ${b}) = ${h} है। LCM(${a}, ${b}) ज्ञात कीजिए।`),
            answer: numM(l, null, [
              [a * b, L("Divide the product of the numbers by the HCF.", "संख्याओं के गुणनफल को HCF से भाग दीजिए।")],
              [a * b * h, L("LCM = product ÷ HCF, not product × HCF.", "LCM = गुणनफल ÷ HCF, न कि गुणनफल × HCF।")],
            ]),
            data: { given: [`a = ${a}`, `b = ${b}`, R`\text{HCF} = ${h}`], find: [R`\text{LCM}`] },
            hint: L("For two numbers, HCF × LCM equals the product of the numbers.", "दो संख्याओं के लिए HCF × LCM = उन संख्याओं का गुणनफल।"),
            formula: R`\text{HCF}(a, b) \times \text{LCM}(a, b) = a \times b`,
            solution: S(
              L("LCM = product of the numbers ÷ HCF:", "LCM = संख्याओं का गुणनफल ÷ HCF:"),
              R`$\text{LCM} = \dfrac{${a} \times ${b}}{${h}} = \dfrac{${a * b}}{${h}} = ${l}$`,
            ),
          });
        }
        if (v === 1) {
          const ctx = r.int(0, 2);
          let t;
          if (ctx === 0) {
            do t = r.shuffle([4, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 30]).slice(0, 3).sort((x, y) => x - y);
            while (lcm(lcm(t[0], t[1]), t[2]) > 360 || t[2] % t[0] === 0 && t[2] % t[1] === 0);
          } else if (ctx === 1) {
            do t = r.shuffle([24, 30, 36, 40, 45, 48, 54, 60, 72, 80, 90, 108]).slice(0, 3).sort((x, y) => x - y);
            while (lcm(lcm(t[0], t[1]), t[2]) > 1440 || t[2] % t[0] === 0 && t[2] % t[1] === 0);
          } else {
            do t = r.shuffle([6, 8, 9, 10, 12, 14, 15, 16, 18, 20]).slice(0, 2).sort((x, y) => x - y);
            while (t[1] % t[0] === 0 || lcm(t[0], t[1]) > 144);
          }
          const i = r.int(0, NAMES.length - 1), j = (i + 1 + r.int(0, NAMES.length - 2)) % NAMES.length;
          const l = t.reduce(lcm), prod = t.reduce((x, y) => x * y), h = t.reduce(gcd);
          const [A, B] = [L(...NAMES[i]), L(...NAMES[j])];
          const text = [
            L(`Three bells ring at intervals of ${t[0]}, ${t[1]} and ${t[2]} minutes. If they ring together at 8 a.m., after how many minutes will they next ring together?`, `तीन घंटियाँ क्रमशः ${t[0]}, ${t[1]} और ${t[2]} मिनट के अंतराल पर बजती हैं। यदि वे सुबह 8 बजे एक साथ बजती हैं, तो कितने मिनट बाद वे फिर एक साथ बजेंगी?`),
            L(`Traffic lights at three road crossings change after every ${t[0]}, ${t[1]} and ${t[2]} seconds respectively. If they change together at 7 a.m., after how many seconds will they next change together?`, `तीन चौराहों की ट्रैफ़िक लाइटें क्रमशः हर ${t[0]}, ${t[1]} और ${t[2]} सेकंड बाद बदलती हैं। यदि वे सुबह 7 बजे एक साथ बदलती हैं, तो कितने सेकंड बाद वे फिर एक साथ बदलेंगी?`),
            L(`${A} takes ${t[0]} minutes and ${B} takes ${t[1]} minutes to cycle one round of a circular park. They start together from the same point in the same direction. After how many minutes will they meet again at the starting point?`, `एक वृत्ताकार पार्क का एक चक्कर साइकिल से लगाने में ${A} को ${t[0]} मिनट और ${B} को ${t[1]} मिनट लगते हैं। दोनों एक ही बिंदु से एक ही दिशा में साथ-साथ चलना शुरू करते हैं। कितने मिनट बाद वे प्रारंभिक बिंदु पर फिर मिलेंगे?`),
          ][ctx];
          return taskL(lang, {
            text,
            answer: numM(l, null, [
              [prod, L("The product is a common multiple, but not the least one.", "गुणनफल एक सार्व गुणज है, पर सबसे छोटा नहीं।")],
              [h, L("The HCF divides the intervals; you need the smallest common multiple of them.", "HCF अंतरालों को विभाजित करता है; आपको इनका सबसे छोटा सार्व गुणज चाहिए।")],
            ]),
            data: { given: t.map((x, k) => `t_${k + 1} = ${x}`), find: [R`\text{LCM}(${t.join(", ")})`] },
            hint: L("They are together again after a time that is a multiple of every interval. Which is the smallest such time?", "वे फिर साथ होंगे ऐसे समय पर जो हर अंतराल का गुणज हो। ऐसा सबसे छोटा समय कौन-सा है?"),
            formula: FLCM(L),
            solution: S(
              t.map((x) => `$${x} = ${pf(x)}$`).join(", "),
              L("The time is the LCM of the intervals:", "अभीष्ट समय अंतरालों का LCM है:"),
              R`$\text{LCM} = ${pfEq(l)}$`,
            ),
          });
        }
        const ctx = r.int(0, 2);
        let h, m, n;
        if (ctx === 0) {
          h = r.pick([15, 25, 30, 35, 45, 75]);
          do { m = r.int(Math.ceil(300 / h), Math.floor(1500 / h)); n = r.int(Math.ceil(300 / h), Math.floor(1500 / h)); } while (m <= n || gcd(m, n) !== 1);
        } else if (ctx === 1) {
          h = r.pick([8, 12, 16, 24, 32]);
          do { m = r.int(9, 40); n = r.int(2, 8); } while (gcd(m, n) !== 1);
        } else {
          h = r.pick([10, 12, 15, 18, 20, 24]);
          do { m = r.int(8, 30); n = r.int(5, 25); } while (m === n || gcd(m, n) !== 1);
        }
        const a = h * m, b = h * n;
        const text = [
          L(`A room is ${en(a / 100)} m long and ${en(b / 100)} m wide. Find the side, in cm, of the largest square tile with which the floor can be covered exactly, without cutting any tile.`, `एक कमरे की लंबाई ${en(a / 100)} m और चौड़ाई ${en(b / 100)} m है। उस सबसे बड़ी वर्गाकार टाइल की भुजा (cm में) ज्ञात कीजिए जिससे फ़र्श को बिना कोई टाइल काटे पूरा ढका जा सके।`),
          L(`An army contingent of ${a} members is to march behind an army band of ${b} members in a parade. The two groups are to march in the same number of columns. What is the maximum number of columns in which they can march?`, `एक परेड में ${a} सदस्यों वाली सेना की एक टुकड़ी को ${b} सदस्यों वाले आर्मी बैंड के पीछे मार्च करना है। दोनों समूहों को समान संख्या के स्तंभों में मार्च करना है। स्तंभों की अधिकतम संख्या क्या है?`),
          L(`A sweet seller has ${a} kaju barfis and ${b} badam barfis. She stacks them so that each stack has the same number of barfis of one kind only, using as few stacks as possible. How many barfis are in each stack?`, `एक मिठाई विक्रेता के पास ${a} काजू बर्फ़ी और ${b} बादाम बर्फ़ी हैं। वह इन्हें ऐसे ढेरों में रखती है कि प्रत्येक ढेर में एक ही प्रकार की बराबर संख्या में बर्फ़ियाँ हों और ढेरों की संख्या न्यूनतम हो। प्रत्येक ढेर में कितनी बर्फ़ियाँ होंगी?`),
        ][ctx];
        return taskL(lang, {
          text,
          answer: numM(h, null, [
            [lcm(a, b), L("The LCM is a common multiple; here you need the largest number that divides both.", "LCM एक सार्व गुणज है; यहाँ आपको वह सबसे बड़ी संख्या चाहिए जो दोनों को विभाजित करे।")],
            [ctx === 0 ? h / 100 : a - b, ctx === 0 ? L("The side is asked in cm, not in m.", "भुजा cm में पूछी गई है, m में नहीं।") : L("The difference is not a common divisor in general; find the HCF.", "अंतर सामान्यतः सार्व भाजक नहीं होता; HCF ज्ञात कीजिए।")],
          ]),
          data: { given: ctx === 0 ? [R`l = ${en(a / 100)}\ \mathrm{m}`, R`b = ${en(b / 100)}\ \mathrm{m}`] : [`a = ${a}`, `b = ${b}`], find: [R`\text{HCF}(a, b)`] },
          hint: L("The required number must divide both quantities exactly, and be as large as possible.", "अभीष्ट संख्या दोनों राशियों को पूरा-पूरा विभाजित करे और यथासंभव बड़ी हो।"),
          formula: FHCF(L),
          solution: S(
            ctx === 0 ? L(`In cm: ${a} cm and ${b} cm.`, `cm में: ${a} cm और ${b} cm।`) : "",
            `$${a} = ${pf(a)}$, $${b} = ${pf(b)}$`,
            R`$\text{HCF}(${a}, ${b}) = ${pfEq(h)}$`,
            ctx === 0 ? L(`The largest tile has side ${h} cm.`, `सबसे बड़ी टाइल की भुजा ${h} cm है।`) : ctx === 1 ? L(`Maximum number of columns = ${h}.`, `स्तंभों की अधिकतम संख्या = ${h}`) : L(`Each stack has ${h} barfis.`, `प्रत्येक ढेर में ${h} बर्फ़ियाँ होंगी।`),
          ),
        });
      }
      // level 3
      const v = r.int(0, 3);
      if (v === 0) {
        let h, m, n, r1, r2;
        do {
          h = r.int(11, 45); m = r.int(5, 40); n = r.int(5, 40); r1 = r.int(1, h - 1); r2 = r.pick([r1, r.int(1, h - 1)]);
        } while (m === n || gcd(m, n) !== 1 || h * m > 1900 || h * n > 1900);
        const x = h * m + r1, y = h * n + r2;
        const same = r1 === r2;
        return taskL(lang, {
          text: same
            ? L(`Find the largest number that divides ${x} and ${y} leaving remainder ${r1} in each case.`, `वह सबसे बड़ी संख्या ज्ञात कीजिए जिससे ${x} और ${y} को भाग देने पर प्रत्येक दशा में ${r1} शेष बचता है।`)
            : L(`Find the largest number that divides ${x} and ${y} leaving remainders ${r1} and ${r2} respectively.`, `वह सबसे बड़ी संख्या ज्ञात कीजिए जिससे ${x} और ${y} को भाग देने पर क्रमशः ${r1} और ${r2} शेष बचते हैं।`),
          answer: numM(h, null, [
            [gcd(x, y), L("First subtract the remainders: the number must divide the differences exactly.", "पहले शेषफल घटाइए: संख्या को अंतरों को पूरा-पूरा विभाजित करना चाहिए।")],
            [gcd(x + r1, y + r2), L("Subtract the remainders, do not add them.", "शेषफल घटाइए, जोड़िए नहीं।")],
          ]),
          data: { given: [`${x}`, `${y}`, `r_1 = ${r1}`, `r_2 = ${r2}`], find: [R`\text{HCF}(${x} - ${r1},\ ${y} - ${r2})`] },
          hint: L("If a number leaves remainder r when it divides x, then it divides x − r exactly.", "यदि कोई संख्या x को भाग देने पर r शेष छोड़ती है, तो वह x − r को पूरा-पूरा विभाजित करती है।"),
          formula: R`d = \text{HCF}(x - r_1,\ y - r_2)`,
          solution: S(
            R`$${x} - ${r1} = ${h * m} = ${pf(h * m)}$`,
            R`$${y} - ${r2} = ${h * n} = ${pf(h * n)}$`,
            R`$\text{HCF}(${h * m}, ${h * n}) = ${h}$`,
            L(`${h} is larger than the remainders, so the answer is ${h}.`, `${h} शेषफलों से बड़ा है, अतः उत्तर ${h} है।`),
          ),
        });
      }
      if (v === 1) {
        let t, k;
        do {
          t = r.shuffle([6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 28, 30, 35, 36, 40, 45]).slice(0, 3).sort((x, y) => x - y);
          k = r.int(2, 9);
        } while (t.reduce(lcm) > 1000 || k >= t[0]);
        const l = t.reduce(lcm);
        const less = r.int(0, 1) === 1;
        const ans = less ? l - k : l + k;
        return taskL(lang, {
          text: less
            ? L(`Find the smallest number which, when divided by ${t[0]}, ${t[1]} and ${t[2]}, leaves remainders ${t[0] - k}, ${t[1] - k} and ${t[2] - k} respectively.`, `वह सबसे छोटी संख्या ज्ञात कीजिए जिसे ${t[0]}, ${t[1]} और ${t[2]} से भाग देने पर क्रमशः ${t[0] - k}, ${t[1] - k} और ${t[2] - k} शेष बचते हैं।`)
            : L(`Find the smallest number greater than ${k} which, when divided by ${t[0]}, ${t[1]} and ${t[2]}, leaves remainder ${k} in each case.`, `${k} से बड़ी वह सबसे छोटी संख्या ज्ञात कीजिए जिसे ${t[0]}, ${t[1]} और ${t[2]} से भाग देने पर प्रत्येक दशा में ${k} शेष बचता है।`),
          answer: numM(ans, null, [
            [less ? l + k : l - k, less ? L(`Each remainder is ${k} less than its divisor, so the number is ${k} less than a common multiple.`, `प्रत्येक शेषफल अपने भाजक से ${k} कम है, अतः संख्या किसी सार्व गुणज से ${k} कम है।`) : L("Add the remainder to the LCM, do not subtract it.", "शेषफल को LCM में जोड़िए, घटाइए नहीं।")],
            [l, L("The LCM itself leaves remainder 0; adjust it for the remainders.", "LCM स्वयं शेषफल 0 छोड़ता है; शेषफलों के अनुसार इसे बदलिए।")],
          ]),
          data: { given: t.map((x, i) => `d_${i + 1} = ${x}`), find: ["N"] },
          hint: less
            ? L("Compare each remainder with its divisor: what is the same in all three cases?", "प्रत्येक शेषफल की तुलना उसके भाजक से कीजिए: तीनों दशाओं में क्या समान है?")
            : L("N minus the remainder must be divisible by all three numbers.", "N में से शेषफल घटाने पर संख्या तीनों से विभाज्य होनी चाहिए।"),
          formula: less ? R`N = \text{LCM} - ${k}` : R`N = \text{LCM} + ${k}`,
          solution: S(
            t.map((x) => `$${x} = ${pf(x)}$`).join(", "),
            R`$\text{LCM} = ${pfEq(l)}$`,
            less
              ? L(`Each remainder is ${k} less than the divisor, so N + ${k} is a common multiple.`, `प्रत्येक शेषफल भाजक से ${k} कम है, अतः N + ${k} एक सार्व गुणज है।`)
              : L(`N − ${k} is a common multiple of all three.`, `N − ${k} तीनों का सार्व गुणज है।`),
            `$N = ${l} ${less ? "-" : "+"} ${k} = ${ans}$`,
          ),
        });
      }
      if (v === 2) {
        let h, m, n, steps;
        do {
          h = r.pick([17, 19, 23, 29, 31, 37, 41, 43, 47]); m = r.int(10, 40); n = r.int(5, 35);
          steps = [];
          if (m > n && gcd(m, n) === 1) {
            let [x, y] = [h * m, h * n];
            while (y) { steps.push([x, y, Math.floor(x / y), x % y]); [x, y] = [y, x % y]; }
          }
        } while (m <= n || gcd(m, n) !== 1 || h * m > 1600 || steps.length < 3);
        const a = h * m, b = h * n;
        const prev = steps[steps.length - 1][0];
        return taskL(lang, {
          text: L(`Use Euclid's division algorithm to find the HCF of ${a} and ${b}.`, `यूक्लिड विभाजन एल्गोरिथ्म का प्रयोग करके ${a} और ${b} का HCF ज्ञात कीजिए।`),
          answer: numM(h, null, [
            [prev, L("The HCF is the divisor at the step where the remainder becomes 0.", "HCF वह भाजक है जिस चरण में शेषफल 0 हो जाता है।")],
            [steps[0][3], L("Continue dividing until the remainder is 0; one step is not enough.", "शेषफल 0 होने तक भाग देते रहिए; एक चरण पर्याप्त नहीं है।")],
          ]),
          data: { given: [`a = ${a}`, `b = ${b}`], find: [R`\text{HCF}(a, b)`] },
          hint: L("Write a = bq + r, then repeat with b and r until the remainder is 0.", "a = bq + r लिखिए, फिर b और r के साथ यही दोहराइए जब तक शेषफल 0 न हो जाए।"),
          formula: R`a = bq + r,\quad 0 \le r < b`,
          solution: S(
            ...steps.map(([x, y, q, rr]) => R`$${x} = ${y} \times ${q} + ${rr}$`),
            L(`The remainder is 0 when the divisor is ${h}, so HCF = ${h}.`, `भाजक ${h} पर शेषफल 0 हो जाता है, अतः HCF = ${h}।`),
          ),
        });
      }
      let h, ms;
      do {
        h = r.pick([17, 19, 23, 29, 31, 37]);
        ms = r.shuffle([7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 21, 22, 25]).slice(0, 3).sort((x, y) => x - y);
      } while (ms.reduce(gcd) !== 1 || h * ms[2] > 999);
      const [a, b, c] = ms.map((x) => x * h);
      return taskL(lang, {
        text: L(`Three tankers contain ${a} litres, ${b} litres and ${c} litres of milk. Find the greatest capacity (in litres) of a container that can measure the milk of each tanker an exact number of times.`, `तीन टैंकरों में क्रमशः ${a} लीटर, ${b} लीटर और ${c} लीटर दूध है। उस बर्तन की अधिकतम धारिता (लीटर में) ज्ञात कीजिए जिससे प्रत्येक टैंकर का दूध पूरा-पूरा मापा जा सके।`),
        answer: numM(h, null, [
          [gcd(a, b), L("The capacity must divide all three amounts, not just two.", "धारिता तीनों मात्राओं को विभाजित करनी चाहिए, केवल दो को नहीं।")],
          [b - a, L("The difference of two amounts is not always a common divisor; find the HCF of all three.", "दो मात्राओं का अंतर सदैव सार्व भाजक नहीं होता; तीनों का HCF ज्ञात कीजिए।")],
        ]),
        data: { given: [`${a}`, `${b}`, `${c}`], find: [R`\text{HCF}(${a}, ${b}, ${c})`] },
        hint: L("The capacity must divide all three amounts exactly.", "धारिता को तीनों मात्राओं को पूरा-पूरा विभाजित करना चाहिए।"),
        formula: R`\text{HCF}(a, b, c) = \text{HCF}(\text{HCF}(a, b), c)`,
        solution: S(
          `$${a} = ${pf(a)}$, $${b} = ${pf(b)}$, $${c} = ${pf(c)}$`,
          L("The only common prime factor is", "एकमात्र उभयनिष्ठ अभाज्य गुणनखंड है") + ` $${h}$.`,
          R`$\text{HCF} = ${h}$`,
        ),
      });
    },
  },
  {
    id: "exi-mat-real-fta",
    topics: [T("real-numbers")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      if (level === 1) {
        let N;
        do N = 2 ** r.int(1, 5) * 3 ** r.int(0, 3) * 5 ** r.int(0, 2) * r.pick([1, 7, 11, 13]);
        while (N < 100 || N > 20000);
        const v = r.int(0, 2);
        const f = [...fmap(N)];
        const p = r.pick(f)[0];
        const e = fmap(N).get(p);
        const total = f.reduce((s, [, k]) => s + k, 0);
        const big = f[f.length - 1][0];
        const second = f.length > 1 ? f[f.length - 2][0] : 1;
        const q = [
          L(`What is the exponent (power) of ${p} in it?`, `इसमें ${p} की घात क्या है?`),
          L("How many prime factors does it have in total, counting repeated factors?", "दोहराए गए गुणनखंडों को भी गिनते हुए इसमें कुल कितने अभाज्य गुणनखंड हैं?"),
          L("What is its largest prime factor?", "इसका सबसे बड़ा अभाज्य गुणनखंड क्या है?"),
        ][v];
        const ans = [e, total, big][v];
        const mis = [
          [[p ** e, L("The exponent is how many times the prime appears, not the prime power itself.", "घात यह बताती है कि अभाज्य संख्या कितनी बार आती है, यह स्वयं अभाज्य घात नहीं है।")]],
          [[f.length, L("Count repeated factors too: 2 × 2 × 3 has three prime factors.", "दोहराए गए गुणनखंड भी गिनिए: 2 × 2 × 3 में तीन अभाज्य गुणनखंड हैं।")]],
          [[second, L("Divide out all the small primes first; the last prime left is the largest.", "पहले सभी छोटे अभाज्य गुणनखंड अलग कीजिए; अंत में बचा अभाज्य सबसे बड़ा है।")], [N / big, L("A prime factor must itself be prime.", "अभाज्य गुणनखंड स्वयं अभाज्य संख्या होनी चाहिए।")]],
        ][v];
        return taskL(lang, {
          text: L(`Write ${N} as a product of its prime factors. `, `${N} को अभाज्य गुणनखंडों के गुणनफल के रूप में लिखिए। `) + q,
          answer: numM(ans, null, mis),
          data: { given: [`N = ${N}`], find: [[`\\text{exponent of } ${p}`, R`\text{number of prime factors}`, R`\text{largest prime factor}`][v]] },
          hint: L("Keep dividing by the smallest prime that divides the number (2, 3, 5, 7, …).", "संख्या को उस सबसे छोटी अभाज्य संख्या से बार-बार भाग दीजिए जो उसे विभाजित करती है (2, 3, 5, 7, …)।"),
          formula: R`N = p_1^{a_1} \times p_2^{a_2} \times \dots`,
          solution: S(
            L("By the Fundamental Theorem of Arithmetic, the factorisation is unique:", "अंकगणित की आधारभूत प्रमेय के अनुसार यह गुणनखंडन अद्वितीय है:"),
            `$${N} = ${pf(N)}$`,
            [
              L(`The exponent of ${p} is ${e}.`, `${p} की घात ${e} है।`),
              L(`Total number of prime factors = ${f.map(([, k]) => k).join(" + ")} = ${total}.`, `अभाज्य गुणनखंडों की कुल संख्या = ${f.map(([, k]) => k).join(" + ")} = ${total}`),
              L(`The largest prime factor is ${big}.`, `सबसे बड़ा अभाज्य गुणनखंड ${big} है।`),
            ][v],
          ),
        });
      }
      if (level === 2) {
        const p = r.pick([2, 3, 5, 7]);
        let q;
        do q = r.pick([2, 3, 5, 7]); while (q === p);
        const k = r.int(2, 5), m = r.int(2, 3);
        const askIrr = r.int(0, 1) === 0;
        const bi1 = r.int(0, 1), ai1 = r.int(0, 2);
        const RAT = [
          [R`$(${k} + \sqrt{${p}})(${k} - \sqrt{${p}})$`, R`$(${k} + \sqrt{${p}})(${k} - \sqrt{${p}}) = ${k * k} - ${p} = ${k * k - p}$`, L(`(a + b)(a − b) = a² − b² removes the root: this equals ${k * k - p}, which is rational.`, `(a + b)(a − b) = a² − b² से मूल हट जाता है: यह ${k * k - p} के बराबर है, जो परिमेय है।`)],
          [R`$\dfrac{\sqrt{${p * m * m}}}{\sqrt{${p}}}$`, R`$\dfrac{\sqrt{${p * m * m}}}{\sqrt{${p}}} = \sqrt{${m * m}} = ${m}$`, L(`The quotient is √${m * m} = ${m}, which is rational.`, `भागफल √${m * m} = ${m} है, जो परिमेय है।`)],
          [R`$2\sqrt{${p}} \times 3\sqrt{${p}}$`, R`$2\sqrt{${p}} \times 3\sqrt{${p}} = 6 \times ${p} = ${6 * p}$`, L(`√${p} × √${p} = ${p}, so the product is ${6 * p}, which is rational.`, `√${p} × √${p} = ${p}, अतः गुणनफल ${6 * p} है, जो परिमेय है।`)],
        ];
        const IRR = [
          [R`$(${k} + \sqrt{${p}})^2$`, R`$(${k} + \sqrt{${p}})^2 = ${k * k + p} + ${2 * k}\sqrt{${p}}$`, L(`(${k} + √${p})² = ${k * k + p} + ${2 * k}√${p} still contains √${p}, so it is irrational.`, `(${k} + √${p})² = ${k * k + p} + ${2 * k}√${p} में √${p} बचा रहता है, अतः यह अपरिमेय है।`)],
          [R`$\sqrt{${p}} \times \sqrt{${q}}$`, R`$\sqrt{${p}} \times \sqrt{${q}} = \sqrt{${p * q}}$`, L(`${p * q} is not a perfect square, so √${p * q} is irrational.`, `${p * q} पूर्ण वर्ग नहीं है, अतः √${p * q} अपरिमेय है।`)],
          [R`$${k} + \sqrt{${p}}$`, R`$${k} + \sqrt{${p}}$`, L("Rational + irrational is always irrational.", "परिमेय + अपरिमेय सदैव अपरिमेय होता है।")],
          [R`$\dfrac{\sqrt{${p}}}{${k}}$`, R`$\dfrac{\sqrt{${p}}}{${k}} = \dfrac{1}{${k}}\sqrt{${p}}$`, L("A non-zero rational times an irrational number is irrational.", "शून्येतर परिमेय और अपरिमेय संख्या का गुणनफल अपरिमेय होता है।")],
        ];
        const correct = askIrr ? IRR[bi1] : RAT[ai1];
        const wrongUse = askIrr ? RAT : [IRR[0], IRR[1], IRR[2 + bi1]];
        const opts = [correct, ...wrongUse];
        return taskL(lang, {
          text: (askIrr ? L("Which of the following numbers is irrational?", "निम्नलिखित में से कौन-सी संख्या अपरिमेय है?") : L("Which of the following numbers is rational?", "निम्नलिखित में से कौन-सी संख्या परिमेय है?")) + L(` (You may use that $\\sqrt{${p}}$ and $\\sqrt{${q}}$ are irrational.)`, ` (आप मान सकते हैं कि $\\sqrt{${p}}$ और $\\sqrt{${q}}$ अपरिमेय हैं।)`),
          answer: choiceWhy(r, correct[0], wrongUse.map(([o, , w]) => [o, w])),
          data: { given: [R`\sqrt{${p}},\ \sqrt{${q}} \notin \mathbb{Q}`], find: [askIrr ? R`x \notin \mathbb{Q}` : R`x \in \mathbb{Q}`] },
          hint: L("Simplify each number. If a square root that is not a perfect square survives, the number is irrational.", "प्रत्येक संख्या को सरल कीजिए। यदि किसी अपूर्ण वर्ग का वर्गमूल बचा रहता है, तो संख्या अपरिमेय है।"),
          formula: R`(a + b)(a - b) = a^2 - b^2`,
          solution: S(
            L("Simplify each option:", "प्रत्येक विकल्प को सरल कीजिए:"),
            ...opts.map(([, s]) => s),
            askIrr
              ? L(`Only ${correct[0]} keeps an irrational part.`, `केवल ${correct[0]} में अपरिमेय भाग बचता है।`)
              : L(`Only ${correct[0]} simplifies to a rational number.`, `केवल ${correct[0]} सरल होकर परिमेय संख्या बनती है।`),
          ),
        });
      }
      const v = r.int(0, 2);
      if (v === 0) {
        const A = r.int(2, 3), B = r.int(3, 4), x = r.int(1, B - 1), y = r.int(1, A - 1);
        const P = r.pick([5, 11]), Q = r.pick([7, 13]);
        const h = 2 ** x * 3 ** y, l = 2 ** B * 3 ** A * P * Q;
        return taskL(lang, {
          text: L(R`Let $a = 2^{x} \times 3^{${A}} \times ${P}$ and $b = 2^{${B}} \times 3^{y} \times ${Q}$, where x and y are natural numbers. If HCF(a, b) = ${h}, find LCM(a, b).`, R`माना $a = 2^{x} \times 3^{${A}} \times ${P}$ और $b = 2^{${B}} \times 3^{y} \times ${Q}$ है, जहाँ x और y प्राकृत संख्याएँ हैं। यदि HCF(a, b) = ${h} है, तो LCM(a, b) ज्ञात कीजिए।`),
          answer: numM(l, null, [
            [2 ** B * 3 ** A * P, L(`Include every prime that appears in a or b — ${Q} too.`, `a या b में आने वाला हर अभाज्य गुणनखंड लीजिए — ${Q} भी।`)],
            [2 ** x * 3 ** y * 2 ** B * 3 ** A * P * Q, L("Find x and y from the HCF first, then take the greatest power of each prime.", "पहले HCF से x और y ज्ञात कीजिए, फिर प्रत्येक अभाज्य की सबसे बड़ी घात लीजिए।")],
          ]),
          data: { given: [`a = 2^{x} \\cdot 3^{${A}} \\cdot ${P}`, `b = 2^{${B}} \\cdot 3^{y} \\cdot ${Q}`, R`\text{HCF} = ${h}`], find: [R`\text{LCM}(a, b)`] },
          hint: L(`Write ${h} as a product of primes and compare it with the smallest powers in a and b.`, `${h} को अभाज्य गुणनखंडों में लिखिए और a तथा b की सबसे छोटी घातों से तुलना कीजिए।`),
          formula: R`\text{HCF} = \prod p^{\min},\quad \text{LCM} = \prod p^{\max}`,
          solution: S(
            R`$${h} = ${pf(h)}$`,
            L(`The HCF has the smallest powers of 2 and 3, so x = ${x} and y = ${y} (both less than ${B} and ${A}).`, `HCF में 2 और 3 की सबसे छोटी घातें होती हैं, अतः x = ${x} और y = ${y} (जो ${B} और ${A} से कम हैं)।`),
            R`$\text{LCM} = 2^{${B}} \times 3^{${A}} \times ${P} \times ${Q} = ${l}$`,
          ),
        });
      }
      if (v === 1) {
        const n = r.pick([6, 7, 8, 9, 10, 12]);
        let l = 1, fct = 1;
        for (let i = 2; i <= n; i++) { l = lcm(l, i); fct *= i; }
        const pows = [];
        for (const p of [2, 3, 5, 7, 11]) if (p <= n) { let q = p; while (q * p <= n) q *= p; pows.push(q); }
        return taskL(lang, {
          text: L(`Find the smallest natural number that is divisible by every natural number from 1 to ${n}.`, `वह सबसे छोटी प्राकृत संख्या ज्ञात कीजिए जो 1 से ${n} तक की प्रत्येक प्राकृत संख्या से विभाज्य हो।`),
          answer: numM(l, null, [
            [fct, L(`${n}! is a common multiple, but not the smallest one.`, `${n}! एक सार्व गुणज है, पर सबसे छोटा नहीं।`)],
            [l / 2, L("Take the greatest power of 2 that is at most n.", "2 की वह सबसे बड़ी घात लीजिए जो n से अधिक न हो।")],
          ]),
          data: { given: [`1, 2, \\dots, ${n}`], find: [R`\text{LCM}(1, 2, \dots, ${n})`] },
          hint: L(`You need the LCM of 1, 2, …, ${n}: take each prime with the largest power not exceeding ${n}.`, `आपको 1, 2, …, ${n} का LCM चाहिए: प्रत्येक अभाज्य की वह सबसे बड़ी घात लीजिए जो ${n} से अधिक न हो।`),
          formula: R`\text{LCM} = \prod p^{\max}`,
          solution: S(
            L(`Largest prime powers not exceeding ${n}:`, `${n} से अधिक न होने वाली सबसे बड़ी अभाज्य घातें:`) + ` $${pows.join(", ")}$`,
            R`$\text{LCM} = ${pows.join(R` \times `)} = ${l}$`,
          ),
        });
      }
      let nums;
      do nums = [0, 1, 2].map(() => 2 ** r.int(0, 3) * 3 ** r.int(0, 2) * r.pick([1, 5, 7]));
      while (new Set(nums).size < 3 || Math.min(...nums) < 6 || nums.reduce(gcd) === 1 && r.next() < 0.5);
      nums.sort((x, y) => x - y);
      const askL = r.int(0, 1) === 0;
      const h = nums.reduce(gcd), l = nums.reduce(lcm), prod = nums.reduce((x, y) => x * y);
      return taskL(lang, {
        text: L(`Find the ${askL ? "LCM" : "HCF"} of ${nums[0]}, ${nums[1]} and ${nums[2]} by prime factorisation.`, `अभाज्य गुणनखंडन विधि से ${nums[0]}, ${nums[1]} और ${nums[2]} का ${askL ? "LCM" : "HCF"} ज्ञात कीजिए।`),
        answer: askL
          ? numM(l, null, [
              [prod / h, L("HCF × LCM = product holds for two numbers only, not for three.", "HCF × LCM = गुणनफल केवल दो संख्याओं के लिए सत्य है, तीन के लिए नहीं।")],
              [lcm(nums[0], nums[1]), L("Include the third number as well.", "तीसरी संख्या को भी शामिल कीजिए।")],
            ])
          : numM(h, null, [
              [prod / l, L("HCF × LCM = product holds for two numbers only, not for three.", "HCF × LCM = गुणनफल केवल दो संख्याओं के लिए सत्य है, तीन के लिए नहीं।")],
              [gcd(nums[0], nums[1]), L("The HCF must divide the third number as well.", "HCF को तीसरी संख्या को भी विभाजित करना चाहिए।")],
            ]),
        data: { given: nums.map((x, i) => `${"abc"[i]} = ${x}`), find: [askL ? R`\text{LCM}(a, b, c)` : R`\text{HCF}(a, b, c)`] },
        hint: L("Factorise all three numbers. Be careful: HCF × LCM = product is true only for two numbers.", "तीनों संख्याओं के गुणनखंड कीजिए। ध्यान दें: HCF × LCM = गुणनफल केवल दो संख्याओं के लिए सत्य है।"),
        formula: askL ? R`\text{LCM} = \prod p^{\max}` : R`\text{HCF} = \prod p^{\min}`,
        solution: S(
          nums.map((x) => `$${x} = ${pf(x)}$`).join(", "),
          askL ? L("Greatest power of every prime:", "प्रत्येक अभाज्य की सबसे बड़ी घात:") : L("Smallest power of every common prime:", "प्रत्येक उभयनिष्ठ अभाज्य की सबसे छोटी घात:"),
          askL ? R`$\text{LCM} = ${pfEq(l)}$` : R`$\text{HCF} = ${h === 1 ? "1" : pfEq(h)}$`,
        ),
      });
    },
  },
  // ───────────────────────── Polynomials ─────────────────────────
  {
    id: "exi-mat-poly-zeros",
    topics: [T("polynomials")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const HINT_REL = L("For $ax^2 + bx + c$: sum of zeros $= -b/a$, product of zeros $= c/a$.", "$ax^2 + bx + c$ के लिए: शून्यकों का योग $= -b/a$, शून्यकों का गुणनफल $= c/a$।");
      if (level === 1) {
        const v = r.int(0, 2);
        if (v < 2) {
          let q, p, z, a, b, c;
          do {
            q = r.pick([1, 2, 3, 2]); p = r.int(-7, 7); z = r.nonZero(-5, 5);
            a = q; b = -(p + q * z); c = p * z;
          } while (p === 0 || gcd(p, q) !== 1 || b === 0);
          const tex = poly([[a, "x^2"], [b, "x"], [c, ""]]);
          const sum = v === 0;
          const [n, d] = sum ? [-b, a] : [c, a];
          return taskL(lang, {
            text: (sum
              ? L(`Find the sum of the zeros of the quadratic polynomial $p(x) = ${tex}$.`, `द्विघात बहुपद $p(x) = ${tex}$ के शून्यकों का योग ज्ञात कीजिए।`)
              : L(`Find the product of the zeros of the quadratic polynomial $p(x) = ${tex}$.`, `द्विघात बहुपद $p(x) = ${tex}$ के शून्यकों का गुणनफल ज्ञात कीजिए।`)) + (n % d ? fracNote(L) : ""),
            answer: sum
              ? fractionM(n, d, [[b / a, L("Sum of zeros is −b/a: watch the minus sign.", "शून्यकों का योग −b/a है: ऋण चिह्न पर ध्यान दीजिए।")], [c / a, L("c/a is the product of the zeros, not the sum.", "c/a शून्यकों का गुणनफल है, योग नहीं।")]])
              : fractionM(n, d, [[-c / a, L("Product of zeros is +c/a, with no minus sign.", "शून्यकों का गुणनफल +c/a है, ऋण चिह्न के बिना।")], [-b / a, L("−b/a is the sum of the zeros, not the product.", "−b/a शून्यकों का योग है, गुणनफल नहीं।")]]),
            data: { given: [`p(x) = ${tex}`], find: [sum ? R`\alpha + \beta` : R`\alpha\beta`] },
            hint: HINT_REL,
            formula: sum ? R`\alpha + \beta = -\dfrac{b}{a}` : R`\alpha\beta = \dfrac{c}{a}`,
            solution: S(
              L(`Here a = ${a}, b = ${b}, c = ${c}.`, `यहाँ a = ${a}, b = ${b}, c = ${c} है।`),
              sum ? R`$\alpha + \beta = -\dfrac{${b}}{${a}} = ${fracTex(n, d)}$` : R`$\alpha\beta = \dfrac{${c}}{${a}}${gcd(c, a) > 1 || a === 1 || c < 0 ? ` = ${fracTex(n, d)}` : ""}$`,
              L(`Check: the zeros are $${fracTex(p, q)}$ and $${z}$.`, `जाँच: शून्यक $${fracTex(p, q)}$ और $${z}$ हैं।`),
            ),
          });
        }
        let z, w;
        do { z = r.nonZero(-5, 5); w = r.nonZero(-6, 6); } while (z + w === 0 || z === w);
        const k = -(z + w), c = z * w;
        return taskL(lang, {
          text: L(`If ${z} is a zero of the polynomial $p(x) = x^2 + kx ${sg(c)}$, find the value of k.`, `यदि ${z} बहुपद $p(x) = x^2 + kx ${sg(c)}$ का एक शून्यक है, तो k का मान ज्ञात कीजिए।`),
          answer: numM(k, null, [
            [-k, L("Check the signs when you move terms across the equals sign.", "पदों को बराबर चिह्न के पार ले जाते समय चिह्नों की जाँच कीजिए।")],
            [-(z + c) / z, L(`Square the zero: p(${z}) contains (${z})², not ${z}.`, `शून्यक का वर्ग कीजिए: p(${z}) में (${z})² आता है, ${z} नहीं।`)],
          ]),
          data: { given: [R`\alpha = ${z}`, R`p(x) = x^2 + kx ${sg(c)}`], find: ["k"] },
          hint: L(`A zero makes the polynomial equal to 0: put x = ${z}.`, `शून्यक पर बहुपद का मान 0 होता है: x = ${z} रखिए।`),
          formula: R`p(\alpha) = 0`,
          solution: S(
            L(`Since ${z} is a zero, p(${z}) = 0:`, `चूँकि ${z} एक शून्यक है, अतः p(${z}) = 0:`),
            R`$(${z})^2 + k(${z}) ${sg(c)} = 0$`,
            R`$${z * z + c} ${z < 0 ? "-" : "+"} ${Math.abs(z)}k = 0$`,
            R`$k = ${k}$`,
          ),
        });
      }
      if (level === 2) {
        const v = r.int(0, 2);
        if (v < 2) {
          let a, b, c;
          do { a = r.int(1, 3); b = r.nonZero(-9, 9); c = r.nonZero(-8, 8); } while (b * b - 4 * a * c < 0 || gcd(gcd(a, b), c) !== 1);
          const tex = poly([[a, "x^2"], [b, "x"], [c, ""]]);
          if (v === 0) {
            const n = b * b - 2 * a * c, d = a * a;
            return taskL(lang, {
              text: L(R`If α and β are the zeros of $p(x) = ${tex}$, find the value of $\alpha^2 + \beta^2$.`, R`यदि α और β बहुपद $p(x) = ${tex}$ के शून्यक हैं, तो $\alpha^2 + \beta^2$ का मान ज्ञात कीजिए।`) + (n % d ? fracNote(L) : ""),
              answer: fractionM(n, d, [
                [(b * b + 2 * a * c) / d, L("(α + β)² = α² + β² + 2αβ, so subtract 2αβ, do not add it.", "(α + β)² = α² + β² + 2αβ, अतः 2αβ घटाइए, जोड़िए नहीं।")],
                [(b * b) / d, L("(α + β)² also contains 2αβ; remove it.", "(α + β)² में 2αβ भी होता है; उसे हटाइए।")],
              ]),
              data: { given: [`p(x) = ${tex}`], find: [R`\alpha^2 + \beta^2`] },
              hint: L("Write α² + β² using α + β and αβ.", "α² + β² को α + β और αβ के पदों में लिखिए।"),
              formula: R`\alpha^2 + \beta^2 = (\alpha + \beta)^2 - 2\alpha\beta`,
              solution: S(
                R`$\alpha + \beta = ${fracTex(-b, a)}$, $\alpha\beta = ${fracTex(c, a)}$`,
                R`$\alpha^2 + \beta^2 = \left(${fracTex(-b, a)}\right)^2 - 2 \cdot ${fracTex(c, a).startsWith("-") ? `\\left(${fracTex(c, a)}\\right)` : fracTex(c, a)}$`,
                R`$\alpha^2 + \beta^2 = ${fracTex(n, d)}$`,
                L("(Here we did not need the zeros themselves.)", "(यहाँ शून्यकों को अलग से ज्ञात करने की आवश्यकता नहीं पड़ी।)"),
              ),
            });
          }
          return taskL(lang, {
            text: L(R`If α and β are the zeros of $p(x) = ${tex}$, find the value of $\dfrac{1}{\alpha} + \dfrac{1}{\beta}$.`, R`यदि α और β बहुपद $p(x) = ${tex}$ के शून्यक हैं, तो $\dfrac{1}{\alpha} + \dfrac{1}{\beta}$ का मान ज्ञात कीजिए।`) + (b % c ? fracNote(L) : ""),
            answer: fractionM(-b, c, [
              [b / c, L("α + β = −b/a: keep the minus sign.", "α + β = −b/a: ऋण चिह्न बनाए रखिए।")],
              [-c / b, L("You inverted the fraction: it is (α + β)/(αβ).", "आपने भिन्न उलट दी: यह (α + β)/(αβ) है।")],
            ]),
            data: { given: [`p(x) = ${tex}`], find: [R`\dfrac{1}{\alpha} + \dfrac{1}{\beta}`] },
            hint: L("Add the two fractions over a common denominator.", "दोनों भिन्नों को उभयनिष्ठ हर लेकर जोड़िए।"),
            formula: R`\dfrac{1}{\alpha} + \dfrac{1}{\beta} = \dfrac{\alpha + \beta}{\alpha\beta}`,
            solution: S(
              R`$\alpha + \beta = ${fracTex(-b, a)}$, $\alpha\beta = ${fracTex(c, a)}$`,
              R`$\dfrac{1}{\alpha} + \dfrac{1}{\beta} = \dfrac{\alpha + \beta}{\alpha\beta} = \dfrac{-b/a}{c/a} = -\dfrac{b}{c}$`,
              R`$= ${fracTex(-b, c)}$`,
              L("(The zeros themselves were not needed.)", "(शून्यकों को अलग से ज्ञात करने की आवश्यकता नहीं पड़ी।)"),
            ),
          });
        }
        let A, z;
        do { A = r.int(1, 2); z = [r.nonZero(-4, 5), r.nonZero(-4, 5), r.nonZero(-4, 5)]; } while (new Set(z).size < 3);
        const s1 = z[0] + z[1] + z[2], s2 = z[0] * z[1] + z[0] * z[2] + z[1] * z[2], s3 = z[0] * z[1] * z[2];
        const c = [A, -A * s1, A * s2, -A * s3];
        return taskL(lang, {
          text: L(`Two zeros of the cubic polynomial $p(x) = ${cubic(c)}$ are ${z[0]} and ${z[1]}. Find its third zero.`, `त्रिघात बहुपद $p(x) = ${cubic(c)}$ के दो शून्यक ${z[0]} और ${z[1]} हैं। इसका तीसरा शून्यक ज्ञात कीजिए।`),
          answer: numM(z[2], null, [
            [c[1] / A - z[0] - z[1], L("Sum of the zeros of a cubic is −b/a: watch the sign.", "त्रिघात बहुपद के शून्यकों का योग −b/a है: चिह्न पर ध्यान दीजिए।")],
            [-c[1] / A, L("−b/a is the sum of all three zeros; subtract the two known zeros.", "−b/a तीनों शून्यकों का योग है; दोनों ज्ञात शून्यक घटाइए।")],
          ]),
          data: { given: [`p(x) = ${cubic(c)}`, R`\alpha = ${z[0]}`, R`\beta = ${z[1]}`], find: [R`\gamma`] },
          hint: L("For a cubic ax³ + bx² + cx + d, the sum of the three zeros is −b/a.", "त्रिघात बहुपद ax³ + bx² + cx + d के तीनों शून्यकों का योग −b/a होता है।"),
          formula: R`\alpha + \beta + \gamma = -\dfrac{b}{a}`,
          solution: S(
            R`$\alpha + \beta + \gamma = -\dfrac{${c[1]}}{${A}} = ${s1}$`,
            R`$${pm(z[0])} + ${pm(z[1])} + \gamma = ${s1}$`,
            R`$\gamma = ${z[2]}$`,
            L("Check with the product:", "गुणनफल से जाँच:") + R` $\alpha\beta\gamma = -\dfrac{${c[3]}}{${A}} = ${s3}$.`,
          ),
        });
      }
      const v = r.int(0, 3);
      if (v === 0) {
        const al = r.nonZero(-4, 4), t = r.int(2, 4);
        const p = -(1 + t) * al, k = t * al * al;
        return taskL(lang, {
          text: L(`If one zero of the polynomial $x^2 ${sco(p)} + k$ is ${t} times the other, find the value of k.`, `यदि बहुपद $x^2 ${sco(p)} + k$ का एक शून्यक दूसरे शून्यक का ${t} गुना है, तो k का मान ज्ञात कीजिए।`),
          answer: numM(k, null, [
            [t * Math.abs(al), L("The product of the zeros is α · tα = tα², not tα.", "शून्यकों का गुणनफल α · tα = tα² है, tα नहीं।")],
            [(t * p * p) / (t + 1), L("First find α from the sum (1 + t)α = −b, then the product.", "पहले योग (1 + t)α = −b से α ज्ञात कीजिए, फिर गुणनफल।")],
          ]),
          data: { given: [R`\beta = ${t}\alpha`, R`p(x) = x^2 ${sco(p)} + k`], find: ["k"] },
          hint: L(`Call the zeros α and ${t}α and use the sum of the zeros first.`, `शून्यकों को α और ${t}α मानिए और पहले शून्यकों के योग का प्रयोग कीजिए।`),
          formula: R`\alpha + \beta = -\dfrac{b}{a},\quad \alpha\beta = \dfrac{c}{a}`,
          solution: S(
            L(`Let the zeros be α and ${t}α.`, `माना शून्यक α और ${t}α हैं।`),
            R`$\alpha + ${t}\alpha = ${-p} \Rightarrow ${t + 1}\alpha = ${-p} \Rightarrow \alpha = ${al}$`,
            R`$k = \alpha \cdot ${t}\alpha = ${t} \cdot (${al})^2 = ${k}$`,
          ),
        });
      }
      if (v === 1) {
        const m = r.int(2, 5), b = 4 * m * m + r.int(1, 6);
        return taskL(lang, {
          text: L(`If the zeros of the polynomial $(a^2 + ${m * m})x^2 + ${b}x + ${2 * m}a$ are reciprocals of each other, find the value of a.`, `यदि बहुपद $(a^2 + ${m * m})x^2 + ${b}x + ${2 * m}a$ के शून्यक एक-दूसरे के व्युत्क्रम हैं, तो a का मान ज्ञात कीजिए।`),
          answer: numM(m, null, [
            [-m, L("(a − m)² = 0 gives only the positive value; check the sign.", "(a − m)² = 0 से केवल धनात्मक मान मिलता है; चिह्न जाँचिए।")],
            [2 * m, L("Set the product of the zeros equal to 1 and solve the quadratic in a.", "शून्यकों का गुणनफल 1 के बराबर रखिए और a में द्विघात समीकरण हल कीजिए।")],
          ]),
          data: { given: [R`p(x) = (a^2 + ${m * m})x^2 + ${b}x + ${2 * m}a`], find: ["a"] },
          hint: L("If the zeros are α and 1/α, what is their product?", "यदि शून्यक α और 1/α हैं, तो उनका गुणनफल क्या है?"),
          formula: R`\alpha\beta = \dfrac{c}{a}`,
          solution: S(
            L("Product of the zeros = 1:", "शून्यकों का गुणनफल = 1:"),
            R`$\dfrac{${2 * m}a}{a^2 + ${m * m}} = 1 \Rightarrow a^2 - ${2 * m}a + ${m * m} = 0$`,
            R`$(a - ${m})^2 = 0 \Rightarrow a = ${m}$`,
            L(`Check: $${2 * m * m}x^2 + ${b}x + ${2 * m * m}$ has discriminant $${b * b - 16 * m ** 4} > 0$, so the zeros are real.`, `जाँच: $${2 * m * m}x^2 + ${b}x + ${2 * m * m}$ का विविक्तकर $${b * b - 16 * m ** 4} > 0$ है, अतः शून्यक वास्तविक हैं।`),
          ),
        });
      }
      if (v === 2) {
        let s, p;
        do { s = r.nonZero(-9, 9); p = r.nonZero(-9, 9); } while (s * s < 4 * p || s * s - 2 * p === 0);
        const tex = poly([[1, "x^2"], [-s, "x"], [p, ""]]);
        const n = s * s - 2 * p;
        return taskL(lang, {
          text: L(R`If α and β are the zeros of $p(x) = ${tex}$, find $\dfrac{\alpha}{\beta} + \dfrac{\beta}{\alpha}$.`, R`यदि α और β बहुपद $p(x) = ${tex}$ के शून्यक हैं, तो $\dfrac{\alpha}{\beta} + \dfrac{\beta}{\alpha}$ ज्ञात कीजिए।`) + (n % p ? fracNote(L) : ""),
          answer: fractionM(n, p, [
            [(s * s) / p, L("α² + β² = (α + β)² − 2αβ: you forgot the −2αβ.", "α² + β² = (α + β)² − 2αβ: आप −2αβ भूल गए।")],
            [(s * s + 2 * p) / p, L("Subtract 2αβ, do not add it.", "2αβ घटाइए, जोड़िए नहीं।")],
          ]),
          data: { given: [`p(x) = ${tex}`], find: [R`\dfrac{\alpha}{\beta} + \dfrac{\beta}{\alpha}`] },
          hint: L("Add the fractions: the numerator is α² + β².", "भिन्नों को जोड़िए: अंश α² + β² बनता है।"),
          formula: R`\dfrac{\alpha}{\beta} + \dfrac{\beta}{\alpha} = \dfrac{(\alpha + \beta)^2 - 2\alpha\beta}{\alpha\beta}`,
          solution: S(
            R`$\alpha + \beta = ${s}$, $\alpha\beta = ${p}$`,
            R`$\alpha^2 + \beta^2 = (${s})^2 - 2(${p}) = ${n}$`,
            L("Write the sum over the common denominator αβ:", "उभयनिष्ठ हर αβ लेकर योग लिखिए:"),
            R`$\dfrac{\alpha}{\beta} + \dfrac{\beta}{\alpha} = \dfrac{${n}}{${p}} = ${fracTex(n, p)}$`,
          ),
        });
      }
      const a = r.nonZero(-4, 4), d = r.int(1, 4);
      const c = [1, -3 * a, 3 * a * a - d * d, -a * (a * a - d * d)];
      return taskL(lang, {
        text: L(`The zeros of the polynomial $${cubic(c)}$ are $a - b$, $a$ and $a + b$, where $b > 0$. Find b.`, `बहुपद $${cubic(c)}$ के शून्यक $a - b$, $a$ और $a + b$ हैं, जहाँ $b > 0$ है। b ज्ञात कीजिए।`),
        answer: numM(d, null, [
          [d * d, L("That is b²; take the positive square root.", "यह b² है; धनात्मक वर्गमूल लीजिए।")],
          [Math.abs(a), L("a comes from the sum of the zeros; b needs one more relation (the product).", "a शून्यकों के योग से मिलता है; b के लिए एक और संबंध (गुणनफल) चाहिए।")],
        ]),
        data: { given: [`p(x) = ${cubic(c)}`], find: ["b"] },
        hint: L("Use the sum of the zeros to find a, then the product of the zeros to find b.", "शून्यकों के योग से a ज्ञात कीजिए, फिर शून्यकों के गुणनफल से b।"),
        formula: R`\alpha + \beta + \gamma = -\dfrac{b}{a},\quad \alpha\beta\gamma = -\dfrac{d}{a}`,
        solution: S(
          R`$3a = ${3 * a} \Rightarrow a = ${a}$`,
          R`$a(a^2 - b^2) = ${-c[3]} \Rightarrow ${a}(${a * a} - b^2) = ${-c[3]}$`,
          R`$${a * a} - b^2 = ${a * a - d * d} \Rightarrow b^2 = ${d * d} \Rightarrow b = ${d}$`,
          L(`The zeros are ${a - d}, ${a} and ${a + d}.`, `शून्यक ${a - d}, ${a} और ${a + d} हैं।`),
        ),
      });
    },
  },
  {
    id: "exi-mat-remainder-factor",
    topics: [T("polynomials")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      if (level === 1) {
        const t = r.pick([1, 2, 3, -1, -2, -3]);
        const c = [r.int(1, 2), r.int(-5, 5), r.int(-6, 6), r.nonZero(-9, 9)];
        const rem = ev(c, t);
        return taskL(lang, {
          text: L(`Using the remainder theorem, find the remainder when $p(x) = ${cubic(c)}$ is divided by $(${divTex(t)})$.`, `शेषफल प्रमेय का प्रयोग करके वह शेषफल ज्ञात कीजिए जो $p(x) = ${cubic(c)}$ को $(${divTex(t)})$ से भाग देने पर प्राप्त होता है।`),
          answer: numM(rem, null, [
            [ev(c, -t), L(`Put x equal to the zero of the divisor: ${divTex(t)} = 0 gives x = ${t}.`, `भाजक के शून्यक को x के स्थान पर रखिए: ${divTex(t)} = 0 से x = ${t} मिलता है।`)],
            [c.reduce((s, k) => s + k, 0), L("p(1) is the sum of the coefficients; substitute the zero of the divisor instead.", "p(1) गुणांकों का योग है; इसके स्थान पर भाजक का शून्यक रखिए।")],
          ]),
          data: { given: [`p(x) = ${cubic(c)}`, `g(x) = ${divTex(t)}`], find: [`p(${t})`] },
          hint: L("The remainder on dividing p(x) by (x − a) is p(a).", "p(x) को (x − a) से भाग देने पर शेषफल p(a) होता है।"),
          formula: L(R`\text{remainder} = p(a)`, R`\text{शेषफल} = p(a)`),
          solution: S(
            L(`${divTex(t)} = 0 gives x = ${t}.`, `${divTex(t)} = 0 से x = ${t}।`),
            `$p(${t}) = ${sub3(c, t)}$`,
            `$p(${t}) = ${poly(c.map((k, i) => [k * t ** (3 - i), ""])).replace(/^$/, "0")} = ${rem}$`,
            L(`Remainder = ${rem}.`, `शेषफल = ${rem}`),
          ),
        });
      }
      if (level === 2) {
        const v = r.int(0, 2);
        if (v < 2) {
          let t, k, cc, pos, c, d0;
          do {
            t = r.pick([1, 2, 3, -1, -2, -3]); k = r.nonZero(-6, 6); cc = r.nonZero(-6, 6); pos = r.int(0, 1);
            c = pos === 0 ? [1, k, cc, 0] : [1, cc, k, 0];
            d0 = r.int(-9, 9);
          } while (t === 1 && pos === 0);
          const R0 = v === 1 ? d0 : 0;
          c[3] = R0 - ev(c, t);
          if (c[3] === 0) c[3] = 0;
          const kTerm = pos === 0 ? "kx^2" : "kx";
          const other = pos === 0 ? sco(cc, "x").replace("+ 0x", "") : sco(cc, "x^2").replace("+ 0x^2", "");
          const ptex = pos === 0 ? `x^3 + kx^2 ${cc ? sco(cc, "x") : ""} ${c[3] ? sg(c[3]) : ""}` : `x^3 ${cc ? sco(cc, "x^2") : ""} + kx ${c[3] ? sg(c[3]) : ""}`;
          void kTerm; void other;
          const tp = pos === 0 ? t * t : t;
          const known = t ** 3 + (pos === 0 ? cc * t : cc * t * t) + c[3];
          const kWrong = (R0 - ((-t) ** 3 + (pos === 0 ? cc * -t : cc * t * t) + c[3])) / (pos === 0 ? t * t : -t);
          return taskL(lang, {
            text: v === 0
              ? L(R`Find the value of k if $(${divTex(t)})$ is a factor of $p(x) = ${ptex.replace(/\s+/g, " ").trim()}$.`, R`k का मान ज्ञात कीजिए, यदि $(${divTex(t)})$ बहुपद $p(x) = ${ptex.replace(/\s+/g, " ").trim()}$ का एक गुणनखंड है।`)
              : L(R`When $p(x) = ${ptex.replace(/\s+/g, " ").trim()}$ is divided by $(${divTex(t)})$, the remainder is ${R0}. Find the value of k.`, R`जब $p(x) = ${ptex.replace(/\s+/g, " ").trim()}$ को $(${divTex(t)})$ से भाग दिया जाता है, तो शेषफल ${R0} आता है। k का मान ज्ञात कीजिए।`),
            answer: numM(k, null, [
              [kWrong, L(`Use x = ${t}, the value that makes ${divTex(t)} zero.`, `x = ${t} लीजिए, वह मान जिस पर ${divTex(t)} शून्य होता है।`)],
              [-k, L("Check the signs when solving the linear equation in k.", "k के रैखिक समीकरण को हल करते समय चिह्न जाँचिए।")],
            ]),
            data: { given: [`p(x) = ${ptex.replace(/\s+/g, " ").trim()}`, `g(x) = ${divTex(t)}`, ...(v === 1 ? [`R = ${R0}`] : [])], find: ["k"] },
            hint: v === 0 ? L("Factor theorem: (x − a) is a factor of p(x) exactly when p(a) = 0.", "गुणनखंड प्रमेय: (x − a), p(x) का गुणनखंड है यदि और केवल यदि p(a) = 0 हो।") : L("Remainder theorem: the remainder is p(a).", "शेषफल प्रमेय: शेषफल p(a) होता है।"),
            formula: v === 0 ? R`p(a) = 0` : L(R`p(a) = \text{remainder}`, R`p(a) = \text{शेषफल}`),
            solution: S(
              L(`Put x = ${t}:`, `x = ${t} रखिए:`),
              R`$${pm(t)}^3 + ${pos === 0 ? `k${pm(t)}^2` : `${pm(cc)}${pm(t)}^2`} + ${pos === 0 ? `${pm(cc)}${pm(t)}` : `k${pm(t)}`} ${sg(c[3])} = ${R0}$`,
              R`$${known} ${tp < 0 ? "-" : "+"} ${Math.abs(tp)}k = ${R0}$`,
              R`$k = \dfrac{${R0 - known}}{${tp}} = ${k}$`,
            ),
          });
        }
        let q, s, c;
        do { q = r.pick([2, 3]); s = r.pick([1, -1, 2, -2]); c = [r.int(1, 3), r.int(-5, 5), r.int(-6, 6), r.int(-5, 5)]; } while (gcd(s, q) !== 1);
        const num = c[0] * s ** 3 + c[1] * s * s * q + c[2] * s * q * q + c[3] * q ** 3, den = q ** 3;
        const div = s > 0 ? `${q}x - ${s}` : `${q}x + ${-s}`;
        const vn = -c[0] * s ** 3 + c[1] * s * s * q - c[2] * s * q * q + c[3] * q ** 3;
        return taskL(lang, {
          text: L(`Find the remainder when $p(x) = ${cubic(c)}$ is divided by $(${div})$.`, `$p(x) = ${cubic(c)}$ को $(${div})$ से भाग देने पर शेषफल ज्ञात कीजिए।`) + fracNote(L),
          answer: fractionM(num, den, [
            [vn / den, L(`${div} = 0 gives x = ${s}/${q}; check the sign.`, `${div} = 0 से x = ${s}/${q} मिलता है; चिह्न जाँचिए।`)],
            [ev(c, s * q), L(`Solve ${div} = 0 for x: divide by ${q}, do not multiply.`, `${div} = 0 को x के लिए हल कीजिए: ${q} से भाग दीजिए, गुणा नहीं।`)],
          ]),
          data: { given: [`p(x) = ${cubic(c)}`, `g(x) = ${div}`], find: [`p\\left(${fracTex(s, q)}\\right)`] },
          hint: L("The remainder on dividing by (ax − b) is p(b/a).", "(ax − b) से भाग देने पर शेषफल p(b/a) होता है।"),
          formula: L(R`\text{remainder} = p\left(\dfrac{b}{a}\right)`, R`\text{शेषफल} = p\left(\dfrac{b}{a}\right)`),
          solution: S(
            L(`${div} = 0 gives`, `${div} = 0 से`) + ` $x = ${fracTex(s, q)}$.`,
            R`$p\left(${fracTex(s, q)}\right) = ${poly([[c[0], R`\left(${fracTex(s, q)}\right)^3`], [c[1], R`\left(${fracTex(s, q)}\right)^2`], [c[2], R`\left(${fracTex(s, q)}\right)`], [c[3], ""]])}$`,
            R`$= \dfrac{${num}}{${den}}${gcd(num, den) > 1 ? ` = ${fracTex(num, den)}` : ""}$`,
          ),
        });
      }
      const v = r.int(0, 1);
      if (v === 0) {
        let a, t, m, s, e;
        do { a = r.int(1, 4); t = r.pick([2, 3, -1, -2]); m = r.int(1, 5); s = r.int(1, 7); e = a * (t ** 3 - 1) - 2 * t ** 3 + s * t - m * t * t; } while (e === 0 || Math.abs(e) > 120);
        // p(x) = a x^3 + m x^2 - e' … konstanta: p(t) = q(t) ⇒ a t^3 + m t^2 + K = 2t^3 - s t + a ⇒ K = 2t^3 - st + a - a t^3 - m t^2 = -e
        const K = -e;
        const pT = a * t ** 3 + m * t * t + K;
        const wrongA = (() => { const u = -t; const den = u ** 3 - 1; return den ? (2 * u ** 3 - s * u - m * u * u - K) / den : NaN; })();
        return taskL(lang, {
          text: L(`The polynomials $ax^3 + ${m}x^2 ${sg(K)}$ and $2x^3 - ${s}x + a$ leave the same remainder when divided by $(${divTex(t)})$. Find the value of a.`, `बहुपदों $ax^3 + ${m}x^2 ${sg(K)}$ और $2x^3 - ${s}x + a$ को $(${divTex(t)})$ से भाग देने पर समान शेषफल बचता है। a का मान ज्ञात कीजिए।`),
          answer: numM(a, null, [
            [wrongA, L(`Substitute x = ${t}, the zero of ${divTex(t)}.`, `x = ${t} रखिए, जो ${divTex(t)} का शून्यक है।`)],
            [-a, L("Collect the a-terms on one side carefully.", "a वाले पदों को सावधानी से एक ओर इकट्ठा कीजिए।")],
          ]),
          data: { given: [`p(x) = ax^3 + ${m}x^2 ${sg(K)}`, `q(x) = 2x^3 - ${s}x + a`, `g(x) = ${divTex(t)}`], find: ["a"] },
          hint: L(`Find both remainders with x = ${t} and set them equal.`, `x = ${t} रखकर दोनों शेषफल ज्ञात कीजिए और उन्हें बराबर रखिए।`),
          formula: R`p(t) = q(t)`,
          solution: S(
            R`$p(${t}) = a${pm(t)}^3 + ${m}${pm(t)}^2 ${sg(K)} = ${t ** 3}a ${sg(m * t * t + K)}$`,
            R`$q(${t}) = 2${pm(t)}^3 - ${s}${pm(t)} + a = a ${sg(2 * t ** 3 - s * t)}$`,
            R`$${t ** 3}a ${sg(m * t * t + K)} = a ${sg(2 * t ** 3 - s * t)}$`,
            R`$${t ** 3 - 1}a = ${2 * t ** 3 - s * t - m * t * t - K} \Rightarrow a = ${a}$`,
            L(`Both remainders equal ${pT}.`, `दोनों शेषफल ${pT} हैं।`),
          ),
        });
      }
      let A, B, t1, t2, c0;
      do { A = r.nonZero(-6, 6); B = r.nonZero(-6, 6); t1 = r.pick([1, 2, -1, -2, 3]); t2 = r.pick([1, 2, -1, -2, 3, -3]); c0 = -(t1 ** 3 + A * t1 * t1 + B * t1); } while (t1 === t2 || c0 === 0 || Math.abs(c0) > 60);
      const Rm = t2 ** 3 + A * t2 * t2 + B * t2 + c0;
      const askA = r.int(0, 1) === 0;
      return taskL(lang, {
        text: L(`$(${divTex(t1)})$ is a factor of $p(x) = x^3 + ax^2 + bx ${sg(c0)}$, and when p(x) is divided by $(${divTex(t2)})$ the remainder is ${Rm}. Find the value of ${askA ? "a" : "b"}.`, `$(${divTex(t1)})$, बहुपद $p(x) = x^3 + ax^2 + bx ${sg(c0)}$ का एक गुणनखंड है, और p(x) को $(${divTex(t2)})$ से भाग देने पर शेषफल ${Rm} आता है। ${askA ? "a" : "b"} का मान ज्ञात कीजिए।`),
        answer: numM(askA ? A : B, null, [
          [askA ? B : A, L(`You found the other unknown; the question asks for ${askA ? "a" : "b"}.`, `आपने दूसरा अज्ञात ज्ञात किया; प्रश्न ${askA ? "a" : "b"} पूछता है।`)],
          [askA ? -A : -B, L("Check the signs in the two equations.", "दोनों समीकरणों में चिह्नों की जाँच कीजिए।")],
        ]),
        data: { given: [`p(x) = x^3 + ax^2 + bx ${sg(c0)}`, `g_1(x) = ${divTex(t1)}`, `g_2(x) = ${divTex(t2)}`, `R = ${Rm}`], find: [askA ? "a" : "b"] },
        hint: L("Factor theorem gives one equation, remainder theorem gives another. Solve the pair.", "गुणनखंड प्रमेय से एक समीकरण और शेषफल प्रमेय से दूसरा समीकरण मिलता है। दोनों को हल कीजिए।"),
        formula: R`p(t_1) = 0,\quad p(t_2) = R`,
        solution: S(
          R`$p(${t1}) = 0:\ ${poly([[t1 * t1, "a"], [t1, "b"]])} = ${-(t1 ** 3) - c0}$`,
          R`$p(${t2}) = ${Rm}:\ ${poly([[t2 * t2, "a"], [t2, "b"]])} = ${Rm - t2 ** 3 - c0}$`,
          L(`Eliminate ${askA ? "b" : "a"} (multiply and subtract) and solve:`, `${askA ? "b" : "a"} का विलोपन कीजिए (गुणा करके घटाइए) और हल कीजिए:`),
          R`$a = ${A},\quad b = ${B}$`,
        ),
      });
    },
  },
  // ───────────────────────── Similar triangles ─────────────────────────
  {
    id: "exi-mat-bpt-areas",
    topics: [T("similar-triangles")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const BPT = R`\dfrac{AD}{DB} = \dfrac{AE}{EC}`;
      const AREA = R`\dfrac{\text{ar}(\triangle_1)}{\text{ar}(\triangle_2)} = \left(\dfrac{a_1}{a_2}\right)^2`;
      const PAIRS = [[1, 2], [2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [1, 3], [3, 7], [4, 7]];
      const pre = L(R`In $\triangle ABC$, $DE \parallel BC$ with D on AB and E on AC.`, R`$\triangle ABC$ में $DE \parallel BC$ है, जहाँ D भुजा AB पर और E भुजा AC पर है।`);
      if (level === 1) {
        const v = r.int(0, 1);
        if (v === 0) {
          let u, w;
          do { u = r.int(1, 5); w = r.int(1, 5); } while (u === w || gcd(u, w) !== 1);
          const g = r.pick([1, 1.5, 2, 2.5]), s = r.pick([1, 1.2, 1.5, 2, 2.5, 3]);
          const AD = u * g, DB = w * g, AE = r2(u * s), EC = r2(w * s);
          return taskL(lang, {
            text: pre + L(` If AD = ${en(AD)} cm, DB = ${en(DB)} cm and AE = ${en(AE)} cm, find EC (in cm).`, ` यदि AD = ${en(AD)} cm, DB = ${en(DB)} cm और AE = ${en(AE)} cm है, तो EC (cm में) ज्ञात कीजिए।`),
            answer: ansN(EC, [
              [(AE * AD) / DB, L("Match the parts: AD goes with AE, and DB goes with EC.", "भागों का मिलान कीजिए: AD के साथ AE और DB के साथ EC आता है।")],
              [AE, L("DE ∥ BC divides the sides in the same ratio, not into equal parts.", "DE ∥ BC भुजाओं को समान अनुपात में बाँटती है, बराबर भागों में नहीं।")],
            ]),
            data: { given: [`AD = ${en(AD)}\\ \\mathrm{cm}`, `DB = ${en(DB)}\\ \\mathrm{cm}`, `AE = ${en(AE)}\\ \\mathrm{cm}`], find: ["EC"] },
            hint: L("A line parallel to one side divides the other two sides in the same ratio (BPT).", "किसी भुजा के समांतर रेखा अन्य दो भुजाओं को समान अनुपात में विभाजित करती है (आधारभूत समानुपातिकता प्रमेय)।"),
            formula: BPT,
            solution: S(
              L("By the basic proportionality theorem:", "आधारभूत समानुपातिकता प्रमेय से:"),
              R`$\dfrac{${en(AD)}}{${en(DB)}} = \dfrac{${en(AE)}}{EC}$`,
              R`$EC = \dfrac{${en(AE)} \times ${en(DB)}}{${en(AD)}} = ${en(EC)}\ \text{cm}$`,
            ),
          });
        }
        const [u, w] = r.pick(PAIRS);
        const c = r.pick([2, 3, 4, 5, 6, 8]);
        const askBig = r.int(0, 1) === 0;
        const A1 = u * u * c, A2 = w * w * c;
        const [given, want] = askBig ? [A1, A2] : [A2, A1];
        return taskL(lang, {
          text: L(R`$\triangle ABC \sim \triangle PQR$ and their corresponding sides are in the ratio ${u} : ${w}. If ar($\triangle ${askBig ? "ABC" : "PQR"}$) = ${given} cm², find ar($\triangle ${askBig ? "PQR" : "ABC"}$) (in cm²).`, R`$\triangle ABC \sim \triangle PQR$ है और इनकी संगत भुजाओं का अनुपात ${u} : ${w} है। यदि ar($\triangle ${askBig ? "ABC" : "PQR"}$) = ${given} cm² है, तो ar($\triangle ${askBig ? "PQR" : "ABC"}$) (cm² में) ज्ञात कीजिए।`),
          answer: ansN(want, [
            [askBig ? (A1 * w) / u : (A2 * u) / w, L("Areas of similar triangles are in the ratio of the squares of the sides.", "समरूप त्रिभुजों के क्षेत्रफल भुजाओं के वर्गों के अनुपात में होते हैं।")],
            [askBig ? (A1 * u * u) / (w * w) : (A2 * w * w) / (u * u), L("You inverted the ratio: the larger triangle has the larger area.", "आपने अनुपात उलट दिया: बड़े त्रिभुज का क्षेत्रफल बड़ा होता है।")],
          ]),
          data: { given: [`a_1 : a_2 = ${u} : ${w}`, `\\text{ar}_${askBig ? 1 : 2} = ${given}\\ \\mathrm{cm^2}`], find: [`\\text{ar}_${askBig ? 2 : 1}`] },
          hint: L("Square the ratio of the sides.", "भुजाओं के अनुपात का वर्ग कीजिए।"),
          formula: AREA,
          solution: S(
            L("The ratio of the areas is the square of the ratio of the sides:", "क्षेत्रफलों का अनुपात भुजाओं के अनुपात का वर्ग होता है:"),
            R`$\dfrac{\text{ar}(\triangle ABC)}{\text{ar}(\triangle PQR)} = \left(\dfrac{${u}}{${w}}\right)^2 = \dfrac{${u * u}}{${w * w}}$`,
            askBig ? R`$\text{ar}(\triangle PQR) = ${A1} \times \dfrac{${w * w}}{${u * u}} = ${en(A2)}\ \text{cm}^2$` : R`$\text{ar}(\triangle ABC) = ${A2} \times \dfrac{${u * u}}{${w * w}} = ${en(A1)}\ \text{cm}^2$`,
          ),
        });
      }
      if (level === 2) {
        const v = r.int(0, 2);
        if (v === 0) {
          let u, w;
          do { u = r.int(1, 5); w = r.int(1, 5); } while (u === w || gcd(u, w) !== 1);
          const g = r.pick([1, 1.5, 2, 2.5]), s = r.pick([1, 1.2, 1.5, 2, 2.4, 3]);
          const AD = u * g, DB = w * g, AC = r2((u + w) * s), AE = r2(u * s);
          return taskL(lang, {
            text: pre + L(` If AD = ${en(AD)} cm, DB = ${en(DB)} cm and AC = ${en(AC)} cm, find AE (in cm).`, ` यदि AD = ${en(AD)} cm, DB = ${en(DB)} cm और AC = ${en(AC)} cm है, तो AE (cm में) ज्ञात कीजिए।`),
            answer: ansN(AE, [
              [(AC * AD) / DB, L("AC is the whole side: compare AD with the whole AB, not with DB.", "AC पूरी भुजा है: AD की तुलना पूरी AB से कीजिए, DB से नहीं।")],
              [r2(w * s), L("That is EC. AE is the part next to A.", "यह EC है। AE शीर्ष A के पास वाला भाग है।")],
            ]),
            data: { given: [`AD = ${en(AD)}\\ \\mathrm{cm}`, `DB = ${en(DB)}\\ \\mathrm{cm}`, `AC = ${en(AC)}\\ \\mathrm{cm}`], find: ["AE"] },
            hint: L("From BPT, AD/AB = AE/AC. First find AB.", "आधारभूत समानुपातिकता प्रमेय से AD/AB = AE/AC। पहले AB ज्ञात कीजिए।"),
            formula: R`\dfrac{AD}{AB} = \dfrac{AE}{AC}`,
            solution: S(
              R`$AB = AD + DB = ${en(AD)} + ${en(DB)} = ${en(AD + DB)}\ \text{cm}$`,
              L("By BPT:", "आधारभूत समानुपातिकता प्रमेय से:") + R` $\dfrac{AE}{${en(AC)}} = \dfrac{${en(AD)}}{${en(AD + DB)}}$`,
              R`$AE = \dfrac{${en(AC)} \times ${en(AD)}}{${en(AD + DB)}} = ${en(AE)}\ \text{cm}$`,
            ),
          });
        }
        const [u, w] = r.pick(PAIRS);
        const c = r.pick([2, 3, 4, 5, 6, 8]), k = r.pick([1.5, 2, 2.5, 3, 4, 1.2]);
        const A1 = u * u * c, A2 = w * w * c;
        if (v === 1) {
          const a1 = r2(w * k), a2 = r2(u * k);
          return taskL(lang, {
            text: L(`The areas of two similar triangles are ${A2} cm² and ${A1} cm². A side of the first triangle is ${en(a1)} cm. Find the corresponding side of the second triangle (in cm).`, `दो समरूप त्रिभुजों के क्षेत्रफल ${A2} cm² और ${A1} cm² हैं। पहले त्रिभुज की एक भुजा ${en(a1)} cm है। दूसरे त्रिभुज की संगत भुजा (cm में) ज्ञात कीजिए।`),
            answer: ansN(a2, [
              [(a1 * A1) / A2, L("Sides are in the ratio of the square roots of the areas, not of the areas.", "भुजाएँ क्षेत्रफलों के वर्गमूलों के अनुपात में होती हैं, क्षेत्रफलों के अनुपात में नहीं।")],
              [(a1 * w) / u, L("You inverted the ratio: the smaller triangle has the shorter side.", "आपने अनुपात उलट दिया: छोटे त्रिभुज की भुजा छोटी होती है।")],
            ]),
            data: { given: [`\\text{ar}_1 = ${A2}\\ \\mathrm{cm^2}`, `\\text{ar}_2 = ${A1}\\ \\mathrm{cm^2}`, `a_1 = ${en(a1)}\\ \\mathrm{cm}`], find: ["a_2"] },
            hint: L("The ratio of the sides is the square root of the ratio of the areas.", "भुजाओं का अनुपात क्षेत्रफलों के अनुपात का वर्गमूल होता है।"),
            formula: AREA,
            solution: S(
              R`$\left(\dfrac{a_1}{a_2}\right)^2 = \dfrac{${A2}}{${A1}} = \dfrac{${w * w}}{${u * u}}$`,
              R`$\dfrac{a_1}{a_2} = \dfrac{${w}}{${u}}$`,
              R`$a_2 = ${en(a1)} \times \dfrac{${u}}{${w}} = ${en(a2)}\ \text{cm}$`,
              L("(The second triangle is the smaller one.)", "(दूसरा त्रिभुज छोटा है।)"),
            ),
          });
        }
        const P1 = r2(u * k * 3), P2 = r2(w * k * 3);
        return taskL(lang, {
          text: L(`The perimeters of two similar triangles are ${en(P1)} cm and ${en(P2)} cm. The area of the first triangle is ${A1} cm². Find the area of the second triangle (in cm²).`, `दो समरूप त्रिभुजों के परिमाप ${en(P1)} cm और ${en(P2)} cm हैं। पहले त्रिभुज का क्षेत्रफल ${A1} cm² है। दूसरे त्रिभुज का क्षेत्रफल (cm² में) ज्ञात कीजिए।`),
          answer: ansN(A2, [
            [(A1 * P2) / P1, L("Areas go with the square of the ratio of perimeters.", "क्षेत्रफल परिमापों के अनुपात के वर्ग के अनुसार बदलते हैं।")],
            [(A1 * u * u) / (w * w), L("You inverted the ratio: the triangle with the larger perimeter has the larger area.", "आपने अनुपात उलट दिया: बड़े परिमाप वाले त्रिभुज का क्षेत्रफल बड़ा होता है।")],
          ]),
          data: { given: [`P_1 = ${en(P1)}\\ \\mathrm{cm}`, `P_2 = ${en(P2)}\\ \\mathrm{cm}`, `\\text{ar}_1 = ${A1}\\ \\mathrm{cm^2}`], find: [R`\text{ar}_2`] },
          hint: L("For similar triangles, the ratio of perimeters equals the ratio of corresponding sides.", "समरूप त्रिभुजों में परिमापों का अनुपात संगत भुजाओं के अनुपात के बराबर होता है।"),
          formula: R`\dfrac{\text{ar}_1}{\text{ar}_2} = \left(\dfrac{P_1}{P_2}\right)^2`,
          solution: S(
            R`$\dfrac{P_1}{P_2} = \dfrac{${en(P1)}}{${en(P2)}} = \dfrac{${u}}{${w}}$`,
            L("So the sides are in the same ratio, and", "अतः भुजाएँ भी इसी अनुपात में हैं, और") + R` $\dfrac{\text{ar}_1}{\text{ar}_2} = \dfrac{${u * u}}{${w * w}}$`,
            R`$\text{ar}_2 = ${A1} \times \dfrac{${w * w}}{${u * u}} = ${en(A2)}\ \text{cm}^2$`,
          ),
        });
      }
      const v = r.int(0, 2);
      if (v === 0) {
        const [u, w] = r.pick([[1, 2], [2, 3], [3, 4], [2, 5], [3, 5], [1, 3], [2, 1], [3, 2], [1, 1], [4, 3]]);
        const n = u * u, d = (u + w) ** 2 - u * u;
        return taskL(lang, {
          text: pre + L(R` If AD : DB = ${u} : ${w}, find $\text{ar}(\triangle ADE) : \text{ar}(\text{trapezium } DECB)$ as a fraction.`, R` यदि AD : DB = ${u} : ${w} है, तो $\text{ar}(\triangle ADE) : \text{ar}(\text{समलंब } DECB)$ को भिन्न के रूप में ज्ञात कीजिए।`),
          answer: fractionM(n, d, [
            [u / w, L("Areas need the square of a ratio of sides, and the trapezium is ABC minus ADE.", "क्षेत्रफल के लिए भुजाओं के अनुपात का वर्ग चाहिए, और समलंब = ABC − ADE।")],
            [(u * u) / (w * w), L("△ADE ∼ △ABC, not △DBE: compare AD with AB = AD + DB.", "△ADE ∼ △ABC है: AD की तुलना AB = AD + DB से कीजिए।")],
            [(u * u) / ((u + w) ** 2), L("That is ADE : ABC. The trapezium is ABC with ADE removed.", "यह ADE : ABC है। समलंब में से ADE घटाया हुआ भाग है।")],
          ]),
          data: { given: [`AD : DB = ${u} : ${w}`], find: [R`\dfrac{\text{ar}(ADE)}{\text{ar}(DECB)}`] },
          hint: L("△ADE ∼ △ABC. Find AD : AB first.", "△ADE ∼ △ABC है। पहले AD : AB ज्ञात कीजिए।"),
          formula: R`\dfrac{\text{ar}(ADE)}{\text{ar}(ABC)} = \left(\dfrac{AD}{AB}\right)^2`,
          solution: S(
            R`$\dfrac{AD}{AB} = \dfrac{${u}}{${u + w}}$`,
            R`$\dfrac{\text{ar}(ADE)}{\text{ar}(ABC)} = \dfrac{${u * u}}{${(u + w) ** 2}}$`,
            L("Take ar(ADE) = " + `${u * u}k and ar(ABC) = ${(u + w) ** 2}k. Then ar(DECB) = ${d}k.`, "माना ar(ADE) = " + `${u * u}k और ar(ABC) = ${(u + w) ** 2}k। तब ar(DECB) = ${d}k।`),
            R`$\text{ar}(ADE) : \text{ar}(DECB) = ${fracTex(n, d)}$`,
          ),
        });
      }
      if (v === 1) {
        let x, p, q, s, t, den, ok = false;
        for (let i = 0; i < 3000 && !ok; i++) {
          x = r.int(3, 10); p = r.int(-3, 4); q = r.int(-3, 4); s = r.int(-3, 4); t = r.int(-3, 4);
          den = p + t - q - s;
          ok = den !== 0 && q * s - p * t === x * den && Math.min(x + p, x + q, x + s, x + t) >= 1 && !(p === q && s === t) && (x + p) * (x + t) === (x + q) * (x + s);
        }
        if (!ok) { x = 4; p = 0; q = -2; s = 2; t = -1; den = -1; }
        const d2 = p + s - q - t;
        const wrongX = d2 !== 0 ? (q * t - p * s) / d2 : NaN;
        return taskL(lang, {
          text: pre + L(` If $AD = ${lin(p)}$, $DB = ${lin(q)}$, $AE = ${lin(s)}$ and $EC = ${lin(t)}$ (in cm), find x.`, ` यदि $AD = ${lin(p)}$, $DB = ${lin(q)}$, $AE = ${lin(s)}$ और $EC = ${lin(t)}$ (cm में) है, तो x ज्ञात कीजिए।`),
          answer: numM(x, null, [[wrongX, L("Set AD/DB = AE/EC: the part next to A over the other part, on both sides.", "AD/DB = AE/EC लिखिए: दोनों ओर A के पास वाला भाग ऊपर और दूसरा भाग नीचे।")]]),
          data: { given: [`AD = ${lin(p)}`, `DB = ${lin(q)}`, `AE = ${lin(s)}`, `EC = ${lin(t)}`], find: ["x"] },
          hint: L("Write the BPT proportion and cross-multiply; the x² terms cancel.", "आधारभूत समानुपातिकता प्रमेय का अनुपात लिखकर वज्र-गुणन कीजिए; x² वाले पद कट जाते हैं।"),
          formula: BPT,
          solution: S(
            R`$\dfrac{${lin(p)}}{${lin(q)}} = \dfrac{${lin(s)}}{${lin(t)}}$`,
            R`$(${lin(p)})(${lin(t)}) = (${lin(q)})(${lin(s)})$`,
            R`$${poly([[1, "x^2"], [p + t, "x"], [p * t, ""]])} = ${poly([[1, "x^2"], [q + s, "x"], [q * s, ""]])}$`,
            R`$${poly([[den, "x"]])} = ${q * s - p * t} \Rightarrow x = ${x}$`,
            L(`Check: AD = ${x + p}, DB = ${x + q}, AE = ${x + s}, EC = ${x + t}.`, `जाँच: AD = ${x + p}, DB = ${x + q}, AE = ${x + s}, EC = ${x + t}।`),
          ),
        });
      }
      let u, w;
      do { u = r.int(1, 5); w = r.int(1, 5); } while (u === w || gcd(u, w) !== 1);
      const g = r.pick([1, 1.5, 2, 3]), Ar = (u + w) ** 2 * r.pick([2, 3, 4, 5, 6]);
      const AD = u * g, DB = w * g, ans = (Ar * u * u) / (u + w) ** 2;
      return taskL(lang, {
        text: pre + L(R` AD = ${en(AD)} cm, DB = ${en(DB)} cm and ar($\triangle ABC$) = ${Ar} cm². Find ar($\triangle ADE$) (in cm²).`, R` AD = ${en(AD)} cm, DB = ${en(DB)} cm और ar($\triangle ABC$) = ${Ar} cm² है। ar($\triangle ADE$) (cm² में) ज्ञात कीजिए।`),
        answer: ansN(ans, [
          [(Ar * u * u) / (w * w), L("Compare AD with the whole side AB = AD + DB, not with DB.", "AD की तुलना पूरी भुजा AB = AD + DB से कीजिए, DB से नहीं।")],
          [(Ar * u) / (u + w), L("Areas scale with the square of the ratio of sides.", "क्षेत्रफल भुजाओं के अनुपात के वर्ग के अनुसार बदलते हैं।")],
        ]),
        data: { given: [`AD = ${en(AD)}\\ \\mathrm{cm}`, `DB = ${en(DB)}\\ \\mathrm{cm}`, `\\text{ar}(ABC) = ${Ar}\\ \\mathrm{cm^2}`], find: [R`\text{ar}(ADE)`] },
        hint: L("DE ∥ BC makes △ADE ∼ △ABC (AA). Which sides correspond?", "DE ∥ BC से △ADE ∼ △ABC (AA)। कौन-सी भुजाएँ संगत हैं?"),
        formula: R`\dfrac{\text{ar}(ADE)}{\text{ar}(ABC)} = \left(\dfrac{AD}{AB}\right)^2`,
        solution: S(
          L("△ADE ∼ △ABC (AA similarity).", "△ADE ∼ △ABC (AA समरूपता)।"),
          R`$AB = ${en(AD)} + ${en(DB)} = ${en(AD + DB)}\ \text{cm}$, $\dfrac{AD}{AB} = \dfrac{${u}}{${u + w}}$`,
          R`$\text{ar}(ADE) = ${Ar} \times \dfrac{${u * u}}{${(u + w) ** 2}} = ${f2(ans)}\ \text{cm}^2$`,
        ),
      });
    },
  },
  {
    id: "exi-mat-pythagoras-shadow",
    topics: [T("similar-triangles")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const TR = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29], [12, 16, 20]];
      const PY = R`c^2 = a^2 + b^2`;
      if (level === 1) {
        const v = r.int(0, 1);
        if (v === 0) {
          const [u, w] = r.pick([[2, 3], [3, 2], [3, 4], [4, 3], [1, 2], [5, 4], [4, 5]]);
          const g = r.pick([1, 1.5, 2, 3]), k = r.pick([4, 5, 6, 7, 8, 10, 12]);
          const obj = r.int(0, 2);
          const h1 = u * g, s1 = w * g, s2 = w * k, h2 = u * k;
          const O = [L("tower", "मीनार"), L("tree", "पेड़"), L("building", "इमारत")][obj];
          return taskL(lang, {
            text: L(`A vertical pole ${en(h1)} m long casts a shadow ${en(s1)} m long on the ground. At the same time a ${O} casts a shadow ${en(s2)} m long. Find the height of the ${O} (in m).`, `${en(h1)} m लंबा एक ऊर्ध्वाधर खंभा भूमि पर ${en(s1)} m लंबी छाया बनाता है। उसी समय एक ${O} की छाया ${en(s2)} m लंबी है। ${O} की ऊँचाई (m में) ज्ञात कीजिए।`),
            answer: ansN(h2, [
              [(s2 * s1) / h1, L("Match height with height and shadow with shadow.", "ऊँचाई का मिलान ऊँचाई से और छाया का मिलान छाया से कीजिए।")],
              [h1 + s2 - s1, L("The shadows are proportional to the heights; adding the difference does not work.", "छायाएँ ऊँचाइयों के समानुपाती हैं; अंतर जोड़ने से काम नहीं चलता।")],
            ]),
            data: { given: [`h_1 = ${en(h1)}\\ \\mathrm{m}`, `s_1 = ${en(s1)}\\ \\mathrm{m}`, `s_2 = ${en(s2)}\\ \\mathrm{m}`], find: ["h_2"] },
            hint: L("The sun's rays make the same angle with the ground, so the two triangles are similar.", "सूर्य की किरणें भूमि से समान कोण बनाती हैं, अतः दोनों त्रिभुज समरूप हैं।"),
            formula: R`\dfrac{h_1}{s_1} = \dfrac{h_2}{s_2}`,
            solution: S(
              L("The triangles are similar (AA), so", "दोनों त्रिभुज समरूप हैं (AA), अतः"),
              R`$\dfrac{${en(h1)}}{${en(s1)}} = \dfrac{h_2}{${en(s2)}}$`,
              R`$h_2 = \dfrac{${en(h1)} \times ${en(s2)}}{${en(s1)}} = ${en(h2)}\ \text{m}$`,
            ),
          });
        }
        const [a, b, c] = r.pick(TR);
        const k = r.pick([1, 0.5, 1, 2]);
        const askFoot = r.int(0, 1) === 0;
        const [A, B, C] = [a * k, b * k, c * k];
        const [given, want] = askFoot ? [B, A] : [A, B];
        return taskL(lang, {
          text: askFoot
            ? L(`A ladder ${en(C)} m long reaches a window ${en(B)} m above the ground. Find the distance of the foot of the ladder from the base of the wall (in m).`, `${en(C)} m लंबी एक सीढ़ी भूमि से ${en(B)} m ऊपर स्थित एक खिड़की तक पहुँचती है। दीवार के आधार से सीढ़ी के पाद की दूरी (m में) ज्ञात कीजिए।`)
            : L(`A ladder ${en(C)} m long leans against a wall with its foot ${en(A)} m from the wall. How high up the wall does it reach (in m)?`, `${en(C)} m लंबी एक सीढ़ी दीवार से टिकी है और उसका पाद दीवार से ${en(A)} m दूर है। सीढ़ी दीवार पर कितनी ऊँचाई (m में) तक पहुँचती है?`),
          answer: ansN(want, [
            [C - given, L("Lengths do not subtract; their squares do (Pythagoras).", "लंबाइयाँ नहीं, उनके वर्ग घटाए जाते हैं (पाइथागोरस प्रमेय)।")],
            [Math.sqrt(C * C + given * given), L("The ladder is the hypotenuse: subtract the squares, do not add.", "सीढ़ी कर्ण है: वर्गों को घटाइए, जोड़िए नहीं।")],
          ]),
          data: { given: [`c = ${en(C)}\\ \\mathrm{m}`, `${askFoot ? "h" : "d"} = ${en(given)}\\ \\mathrm{m}`], find: [askFoot ? "d" : "h"] },
          hint: L("The wall, the ground and the ladder form a right triangle with the ladder as hypotenuse.", "दीवार, भूमि और सीढ़ी एक समकोण त्रिभुज बनाते हैं, जिसका कर्ण सीढ़ी है।"),
          formula: PY,
          solution: S(
            L("By Pythagoras theorem:", "पाइथागोरस प्रमेय से:"),
            R`$${askFoot ? "d" : "h"}^2 = ${en(C)}^2 - ${en(given)}^2 = ${en(C * C)} - ${en(given * given)} = ${en(want * want)}$`,
            R`$${askFoot ? "d" : "h"} = ${en(want)}\ \text{m}$`,
          ),
        });
      }
      if (level === 2) {
        const v = r.int(0, 2);
        if (v === 0) {
          const [a, b, c] = r.pick(TR);
          const h1 = r.int(3, 12);
          const [dh, d] = r.int(0, 1) ? [a, b] : [b, a];
          const h2 = h1 + dh;
          if (d > 30) return null;
          return taskL(lang, {
            text: L(`Two poles of heights ${h1} m and ${h2} m stand on level ground ${d} m apart. Find the distance between their tops (in m).`, `समतल भूमि पर ${h1} m और ${h2} m ऊँचे दो खंभे एक-दूसरे से ${d} m की दूरी पर खड़े हैं। उनके शिखरों के बीच की दूरी (m में) ज्ञात कीजिए।`),
            answer: ansN(c, [
              [Math.sqrt(d * d + h2 * h2), L("Use the difference of the heights as the vertical side.", "ऊर्ध्वाधर भुजा के रूप में ऊँचाइयों का अंतर लीजिए।")],
              [Math.sqrt(d * d + (h1 + h2) ** 2), L("The vertical side is the difference of the heights, not their sum.", "ऊर्ध्वाधर भुजा ऊँचाइयों का अंतर है, योग नहीं।")],
            ]),
            data: { given: [`h_1 = ${h1}\\ \\mathrm{m}`, `h_2 = ${h2}\\ \\mathrm{m}`, `d = ${d}\\ \\mathrm{m}`], find: [R`\ell`] },
            hint: L("Draw a horizontal line from the top of the shorter pole to the taller pole.", "छोटे खंभे के शिखर से बड़े खंभे तक एक क्षैतिज रेखा खींचिए।"),
            formula: R`\ell^2 = d^2 + (h_2 - h_1)^2`,
            solution: S(
              R`$h_2 - h_1 = ${h2} - ${h1} = ${dh}\ \text{m}$`,
              R`$\ell^2 = ${d}^2 + ${dh}^2 = ${d * d + dh * dh}$`,
              R`$\ell = ${c}\ \text{m}$`,
            ),
          });
        }
        if (v === 1) {
          const [a, b, c] = r.pick(TR.filter((x) => x[2] <= 20));
          const f = r.pick([50, 100]), t = r.pick([1.5, 2, 2.5, 3]);
          const [v1, v2] = r.int(0, 1) ? [a * f, b * f] : [b * f, a * f];
          const d = c * f * t;
          return taskL(lang, {
            text: L(`Two aeroplanes leave an airport at the same time. One flies due north at ${v1} km/h and the other due east at ${v2} km/h. How far apart (in km) will they be after ${en(t)} hours?`, `दो हवाई जहाज़ एक ही समय पर एक हवाई अड्डे से उड़ान भरते हैं। एक ${v1} km/h की चाल से उत्तर की ओर और दूसरा ${v2} km/h की चाल से पूर्व की ओर उड़ता है। ${en(t)} घंटे बाद उनके बीच की दूरी (km में) कितनी होगी?`),
            answer: ansN(d, [
              [(v1 + v2) * t, L("The paths are at right angles: use Pythagoras, not the sum of the distances.", "पथ परस्पर लंब हैं: दूरियों का योग नहीं, पाइथागोरस प्रमेय लगाइए।")],
              [c * f, L(`That is the distance after 1 hour; multiply by ${en(t)}.`, `यह 1 घंटे बाद की दूरी है; ${en(t)} से गुणा कीजिए।`)],
            ]),
            data: { given: [`v_1 = ${v1}\\ \\mathrm{km/h}`, `v_2 = ${v2}\\ \\mathrm{km/h}`, `t = ${en(t)}\\ \\mathrm{h}`], find: ["d"] },
            hint: L("Find how far each plane goes; north and east are perpendicular.", "ज्ञात कीजिए कि प्रत्येक जहाज़ कितनी दूरी तय करता है; उत्तर और पूर्व परस्पर लंब हैं।"),
            formula: R`d^2 = d_1^2 + d_2^2`,
            solution: S(
              R`$d_1 = ${v1} \times ${en(t)} = ${en(v1 * t)}\ \text{km}$, $d_2 = ${v2} \times ${en(t)} = ${en(v2 * t)}\ \text{km}$`,
              R`$d^2 = ${en(v1 * t)}^2 + ${en(v2 * t)}^2 = ${en(d * d)}$`,
              R`$d = ${en(d)}\ \text{km}$`,
            ),
          });
        }
        const sh = r.shuffle(TR.slice(0, 6));
        const k = r.int(1, 3);
        const right = sh[0].map((x) => x * k);
        const bad = sh.slice(1, 4).map(([a, b, c], i) => (i % 2 ? [a, b, c + 1] : [a, b + 1, c]));
        const opt = (t) => `${t[0]} cm, ${t[1]} cm, ${t[2]} cm`;
        const why = ([a, b, c]) => L(`${a}² + ${b}² = ${a * a + b * b}, but ${c}² = ${c * c}: not equal.`, `${a}² + ${b}² = ${a * a + b * b}, पर ${c}² = ${c * c}: ये बराबर नहीं हैं।`);
        return taskL(lang, {
          text: L("The sides of four triangles are given below. Which of them is a right triangle? (Use the converse of Pythagoras theorem.)", "चार त्रिभुजों की भुजाएँ नीचे दी गई हैं। इनमें से कौन-सा समकोण त्रिभुज है? (पाइथागोरस प्रमेय के विलोम का प्रयोग कीजिए।)"),
          answer: choiceWhy(r, opt(right), bad.map((t) => [opt(t), why(t)])),
          hint: L("For each triangle, compare the square of the longest side with the sum of the squares of the other two.", "प्रत्येक त्रिभुज में सबसे लंबी भुजा के वर्ग की तुलना अन्य दो भुजाओं के वर्गों के योग से कीजिए।"),
          formula: R`a^2 + b^2 = c^2`,
          solution: S(
            ...bad.map(([a, b, c]) => R`$${a}^2 + ${b}^2 = ${a * a + b * b} \ne ${c * c} = ${c}^2$`),
            R`$${right[0]}^2 + ${right[1]}^2 = ${right[0] ** 2 + right[1] ** 2} = ${right[2]}^2$`,
            L(`So the triangle with sides ${opt(right)} is right-angled.`, `अतः ${opt(right)} भुजाओं वाला त्रिभुज समकोण त्रिभुज है।`),
          ),
        });
      }
      const v = r.int(0, 2);
      if (v === 0) {
        const h = r.pick([0.9, 1.2, 1.5, 1.6]), q = r.int(3, 5), sp = r.pick([0.8, 1, 1.2, 1.5]), t = r.int(2, 6);
        const H = r2(h * q), d = r2(sp * t), s = d / (q - 1);
        return taskL(lang, {
          text: L(`A girl of height ${en(h)} m is walking away from the base of a lamp-post at a speed of ${en(sp)} m/s. The lamp is ${en(H)} m above the ground. Find the length of her shadow after ${t} seconds (in m).`, `${en(h)} m लंबी एक लड़की ${en(sp)} m/s की चाल से एक लैंप-पोस्ट के आधार से दूर जा रही है। लैंप भूमि से ${en(H)} m की ऊँचाई पर है। ${t} सेकंड बाद उसकी छाया की लंबाई (m में) ज्ञात कीजिए।`) + rnd(s, lang),
          answer: ansN(s, [
            [(h * d) / H, L("The big triangle's base is the distance plus the shadow, not the distance alone.", "बड़े त्रिभुज का आधार दूरी + छाया है, केवल दूरी नहीं।")],
            [(h * d) / (H + h), L("Use H − h after cross-multiplying, not H + h.", "वज्र-गुणन के बाद H − h आता है, H + h नहीं।")],
          ]),
          data: { given: [`h = ${en(h)}\\ \\mathrm{m}`, `H = ${en(H)}\\ \\mathrm{m}`, `v = ${en(sp)}\\ \\mathrm{m/s}`, `t = ${t}\\ \\mathrm{s}`], find: ["s"] },
          hint: L("First find how far she is from the lamp-post. Then compare the small triangle (girl, shadow) with the big one (lamp-post).", "पहले ज्ञात कीजिए कि वह लैंप-पोस्ट से कितनी दूर है। फिर छोटे त्रिभुज (लड़की, छाया) की तुलना बड़े त्रिभुज (लैंप-पोस्ट) से कीजिए।"),
          formula: R`\dfrac{s}{s + d} = \dfrac{h}{H}`,
          solution: S(
            R`$d = ${en(sp)} \times ${t} = ${en(d)}\ \text{m}$`,
            L("The two triangles are similar (AA):", "दोनों त्रिभुज समरूप हैं (AA):"),
            R`$\dfrac{s}{s + ${en(d)}} = \dfrac{${en(h)}}{${en(H)}} = \dfrac{1}{${q}}$`,
            R`$${q}s = s + ${en(d)} \Rightarrow s = \dfrac{${en(d)}}{${q - 1}} ${eqs(s)} ${f2(s)}\ \text{m}$`,
          ),
        });
      }
      if (v === 1) {
        const a = r.pick([6, 9, 12, 15, 18, 4.5, 7.5]), n = r.pick([3, 4]);
        const ad = Math.sqrt((3 * a * a) / 4 + (a / 2 - a / n) ** 2);
        return taskL(lang, {
          text: L(R`In an equilateral triangle ABC of side ${en(a)} cm, D is the point on BC with $BD = \dfrac{1}{${n}}BC$. Find AD (in cm).`, R`${en(a)} cm भुजा वाले एक समबाहु त्रिभुज ABC में, D भुजा BC पर ऐसा बिंदु है कि $BD = \dfrac{1}{${n}}BC$ है। AD (cm में) ज्ञात कीजिए।`) + rnd(ad, lang),
          answer: ansN(ad, [
            [(a * Math.sqrt(3)) / 2, L("That is the altitude AE to the midpoint E. D is not the midpoint.", "यह मध्य-बिंदु E तक का शीर्षलंब AE है। D मध्य-बिंदु नहीं है।")],
            [Math.sqrt(a * a - (a / n) ** 2), L("Angle ADB is not a right angle; drop the perpendicular AE first.", "कोण ADB समकोण नहीं है; पहले लंब AE डालिए।")],
          ]),
          data: { given: [`AB = BC = CA = ${en(a)}\\ \\mathrm{cm}`, `BD = \\dfrac{1}{${n}} BC`], find: ["AD"] },
          hint: L("Draw AE ⊥ BC. In an equilateral triangle E is the midpoint of BC.", "AE ⊥ BC खींचिए। समबाहु त्रिभुज में E, BC का मध्य-बिंदु होता है।"),
          formula: R`AD^2 = AE^2 + DE^2`,
          solution: S(
            R`$AE^2 = ${en(a)}^2 - \left(\dfrac{${en(a)}}{2}\right)^2 = ${en((3 * a * a) / 4)}$`,
            R`$DE = BE - BD = ${en(a / 2)} - ${f2(a / n)} = ${f2(a / 2 - a / n)}\ \text{cm}$`,
            R`$AD^2 = ${en((3 * a * a) / 4)} + ${f2((a / 2 - a / n) ** 2)} = ${f2(ad * ad)}$`,
            R`$AD ${eqs(ad)} ${f2(ad)}\ \text{cm}$`,
          ),
        });
      }
      const LEGS = { 12: [5, 9, 16, 35], 8: [6, 15], 24: [7, 10, 18, 32], 15: [8, 20, 36], 20: [15, 21, 48] };
      const AD = r.pick([12, 8, 24, 15, 20]);
      const [bd, dc] = r.shuffle(LEGS[AD]).slice(0, 2);
      const AB = Math.sqrt(AD * AD + bd * bd), AC = Math.sqrt(AD * AD + dc * dc);
      return taskL(lang, {
        text: L(R`In $\triangle ABC$, AD ⊥ BC with D on BC. If AB = ${AB} cm, BD = ${bd} cm and DC = ${dc} cm, find AC (in cm).`, R`$\triangle ABC$ में AD ⊥ BC है, जहाँ D भुजा BC पर है। यदि AB = ${AB} cm, BD = ${bd} cm और DC = ${dc} cm है, तो AC (cm में) ज्ञात कीजिए।`),
        answer: ansN(AC, [
          [Math.sqrt(AB * AB + dc * dc), L("AB is a hypotenuse: AD² = AB² − BD². Then use AD in △ADC.", "AB एक कर्ण है: AD² = AB² − BD²। फिर △ADC में AD का प्रयोग कीजिए।")],
          [AB - bd + dc, L("Pythagoras works with squares of lengths, not the lengths themselves.", "पाइथागोरस प्रमेय में लंबाइयों के वर्ग लगते हैं, स्वयं लंबाइयाँ नहीं।")],
        ]),
        data: { given: [`AB = ${AB}\\ \\mathrm{cm}`, `BD = ${bd}\\ \\mathrm{cm}`, `DC = ${dc}\\ \\mathrm{cm}`], find: ["AC"] },
        hint: L("Use Pythagoras twice: first in △ABD to find AD, then in △ADC.", "पाइथागोरस प्रमेय दो बार लगाइए: पहले △ABD में AD के लिए, फिर △ADC में।"),
        formula: R`AC^2 = AB^2 - BD^2 + DC^2`,
        solution: S(
          R`$AD^2 = AB^2 - BD^2 = ${AB * AB} - ${bd * bd} = ${AD * AD}$`,
          R`$AC^2 = AD^2 + DC^2 = ${AD * AD} + ${dc * dc} = ${AC * AC}$`,
          R`$AC = ${AC}\ \text{cm}$`,
          L("(This is the result AB² + DC² = AC² + BD².)", "(यही परिणाम AB² + DC² = AC² + BD² है।)"),
        ),
      });
    },
  },
  // ───────────────────────── Surface areas and volumes ─────────────────────────
  {
    id: "exi-mat-solids",
    topics: [T("surface-areas-and-volumes")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const P = 22 / 7;
      const PIN = L(R` Use $\pi = \dfrac{22}{7}$.`, R` $\pi = \dfrac{22}{7}$ लीजिए।`);
      if (level === 1) {
        const sh = r.int(0, 7);
        const rr = r.pick([3.5, 7, 10.5, 14, 21]);
        const h = sh === 2 ? 3 * r.int(2, 10) : r.int(5, 30);
        const l = Math.round(rr) + r.int(3, 15);
        const sol = [L("cylinder", "बेलन"), L("cylinder", "बेलन"), L("cone", "शंकु"), L("cone", "शंकु"), L("sphere", "गोले"), L("sphere", "गोले"), L("hemisphere", "अर्धगोले"), L("hemisphere", "अर्धगोले")][sh];
        const qty = [L("volume", "आयतन"), L("curved surface area", "वक्र पृष्ठीय क्षेत्रफल"), L("volume", "आयतन"), L("curved surface area", "वक्र पृष्ठीय क्षेत्रफल"), L("surface area", "पृष्ठीय क्षेत्रफल"), L("volume", "आयतन"), L("total surface area", "कुल पृष्ठीय क्षेत्रफल"), L("volume", "आयतन")][sh];
        const unit = [3, 2, 3, 2, 2, 3, 2, 3][sh] === 3 ? "cm³" : "cm²";
        const rs = en(rr);
        const dims = sh < 2 || sh === 2
          ? L(`with base radius ${rs} cm and height ${h} cm`, `आधार त्रिज्या ${rs} cm और ऊँचाई ${h} cm वाले`)
          : sh === 3 ? L(`with base radius ${rs} cm and slant height ${l} cm`, `आधार त्रिज्या ${rs} cm और तिर्यक ऊँचाई ${l} cm वाले`)
          : L(`of radius ${rs} cm`, `त्रिज्या ${rs} cm वाले`);
        const V = [P * rr * rr * h, 2 * P * rr * h, (P * rr * rr * h) / 3, P * rr * l, 4 * P * rr * rr, (4 / 3) * P * rr ** 3, 3 * P * rr * rr, (2 / 3) * P * rr ** 3][sh];
        const F = [R`V = \pi r^2 h`, R`S = 2\pi r h`, R`V = \dfrac{1}{3}\pi r^2 h`, R`S = \pi r l`, R`S = 4\pi r^2`, R`V = \dfrac{4}{3}\pi r^3`, R`S = 3\pi r^2`, R`V = \dfrac{2}{3}\pi r^3`][sh];
        const SUB = [R`\dfrac{22}{7} \times ${rs}^2 \times ${h}`, R`2 \times \dfrac{22}{7} \times ${rs} \times ${h}`, R`\dfrac{1}{3} \times \dfrac{22}{7} \times ${rs}^2 \times ${h}`, R`\dfrac{22}{7} \times ${rs} \times ${l}`, R`4 \times \dfrac{22}{7} \times ${rs}^2`, R`\dfrac{4}{3} \times \dfrac{22}{7} \times ${rs}^3`, R`3 \times \dfrac{22}{7} \times ${rs}^2`, R`\dfrac{2}{3} \times \dfrac{22}{7} \times ${rs}^3`][sh];
        const MIS = [
          [[2 * P * rr * h, L("2πrh is the curved surface area; volume is πr²h.", "2πrh वक्र पृष्ठीय क्षेत्रफल है; आयतन πr²h है।")], [P * 4 * rr * rr * h, L("Use the radius, not the diameter.", "त्रिज्या लीजिए, व्यास नहीं।")]],
          [[2 * P * rr * (rr + h), L("That includes the two circular ends (total surface area).", "इसमें दोनों वृत्ताकार सिरे भी शामिल हैं (कुल पृष्ठीय क्षेत्रफल)।")], [P * rr * h, L("The curved surface of a cylinder is 2πrh.", "बेलन का वक्र पृष्ठ 2πrh होता है।")]],
          [[P * rr * rr * h, L("A cone holds one third of the cylinder with the same base and height.", "शंकु का आयतन समान आधार और ऊँचाई वाले बेलन का एक-तिहाई होता है।")], [(P * rr * h) / 3, L("Square the radius.", "त्रिज्या का वर्ग कीजिए।")]],
          [[P * rr * (l + rr), L("That adds the base (total surface area); only the curved surface is asked.", "इसमें आधार भी जुड़ गया (कुल पृष्ठीय क्षेत्रफल); केवल वक्र पृष्ठ पूछा गया है।")], [2 * P * rr * l, L("The curved surface of a cone is πrl, without the factor 2.", "शंकु का वक्र पृष्ठ πrl है, 2 के गुणनखंड के बिना।")]],
          [[(4 / 3) * P * rr ** 3, L("That is the volume; the surface area is 4πr².", "यह आयतन है; पृष्ठीय क्षेत्रफल 4πr² है।")], [2 * P * rr * rr, L("A whole sphere has 4πr², not 2πr².", "पूरे गोले का पृष्ठ 4πr² होता है, 2πr² नहीं।")]],
          [[4 * P * rr * rr, L("4πr² is the surface area; the volume is (4/3)πr³.", "4πr² पृष्ठीय क्षेत्रफल है; आयतन (4/3)πr³ है।")], [P * rr ** 3, L("Do not forget the factor 4/3.", "4/3 का गुणनखंड न भूलें।")]],
          [[2 * P * rr * rr, L("Add the flat circular face πr² to the curved surface 2πr².", "वक्र पृष्ठ 2πr² में समतल वृत्ताकार फलक πr² भी जोड़िए।")], [4 * P * rr * rr, L("A hemisphere is half a sphere plus one flat face: 2πr² + πr².", "अर्धगोला आधा गोला और एक समतल फलक है: 2πr² + πr²।")]],
          [[(4 / 3) * P * rr ** 3, L("That is a whole sphere; take half of it.", "यह पूरा गोला है; इसका आधा लीजिए।")], [2 * P * rr * rr, L("That is the curved surface area, not the volume.", "यह वक्र पृष्ठीय क्षेत्रफल है, आयतन नहीं।")]],
        ][sh];
        const sym = F[0];
        return taskL(lang, {
          text: L(`Find the ${qty} of a ${sol} ${dims}, in ${unit}.`, `${dims} एक ${sol} का ${qty} (${unit} में) ज्ञात कीजिए।`) + PIN + rnd(V, lang),
          answer: ansN(V, MIS),
          data: { given: [`r = ${rs}\\ \\mathrm{cm}`, ...(sh < 3 ? [`h = ${h}\\ \\mathrm{cm}`] : sh === 3 ? [`l = ${l}\\ \\mathrm{cm}`] : []), R`\pi = \dfrac{22}{7}`], find: [sym] },
          hint: L("Write the formula first, then substitute r (and h or l).", "पहले सूत्र लिखिए, फिर r (और h या l) का मान रखिए।"),
          formula: F,
          solution: S(
            L("Formula:", "सूत्र:") + ` $${F}$`,
            R`$${sym} = ${SUB}$`,
            R`$${sym} ${eqs(V)} ${f2(V)}\ \text{${unit === "cm³" ? "cm}^3" : "cm}^2"}$`.replace(R`\text{cm}^3}`, R`\text{cm}^3`).replace(R`\text{cm}^2}`, R`\text{cm}^2`),
          ),
        });
      }
      if (level === 2) {
        const v = r.int(0, 3);
        if (v === 0) {
          const rr = r.pick([3.5, 7, 2.1, 1.4]), h = 3 * r.int(2, 6);
          const H = r2(rr + h);
          const hemi = (2 / 3) * P * rr ** 3, cone = (P * rr * rr * h) / 3, V = hemi + cone;
          return taskL(lang, {
            text: L(`A toy is in the shape of a cone mounted on a hemisphere of the same radius ${en(rr)} cm. The total height of the toy is ${en(H)} cm. Find its volume (in cm³).`, `एक खिलौना ${en(rr)} cm त्रिज्या वाले अर्धगोले पर उसी त्रिज्या का शंकु रखकर बना है। खिलौने की कुल ऊँचाई ${en(H)} cm है। खिलौने का आयतन (cm³ में) ज्ञात कीजिए।`) + PIN + rnd(V, lang),
            answer: ansN(V, [
              [hemi + (P * rr * rr * H) / 3, L("The cone's height is the total height minus the radius of the hemisphere.", "शंकु की ऊँचाई = कुल ऊँचाई − अर्धगोले की त्रिज्या।")],
              [(4 / 3) * P * rr ** 3 + cone, L("The base is a hemisphere: take half the volume of a sphere.", "आधार अर्धगोला है: गोले के आयतन का आधा लीजिए।")],
            ]),
            data: { given: [`r = ${en(rr)}\\ \\mathrm{cm}`, `H = ${en(H)}\\ \\mathrm{cm}`, R`\pi = \dfrac{22}{7}`], find: ["V"] },
            hint: L("Volume of the toy = volume of the hemisphere + volume of the cone. Find the cone's height first.", "खिलौने का आयतन = अर्धगोले का आयतन + शंकु का आयतन। पहले शंकु की ऊँचाई ज्ञात कीजिए।"),
            formula: R`V = \dfrac{2}{3}\pi r^3 + \dfrac{1}{3}\pi r^2 h`,
            solution: S(
              R`$h = ${en(H)} - ${en(rr)} = ${h}\ \text{cm}$`,
              R`$V_1 = \dfrac{2}{3} \times \dfrac{22}{7} \times ${en(rr)}^3 ${eqs(hemi)} ${f2(hemi)}\ \text{cm}^3$`,
              R`$V_2 = \dfrac{1}{3} \times \dfrac{22}{7} \times ${en(rr)}^2 \times ${h} ${eqs(cone)} ${f2(cone)}\ \text{cm}^3$`,
              R`$V = V_1 + V_2 ${eqs(V)} ${f2(V)}\ \text{cm}^3$`,
            ),
          });
        }
        const TRC = [[3.5, 12, 12.5], [7, 24, 25], [10.5, 14, 17.5], [2.1, 2.8, 3.5], [0.7, 2.4, 2.5], [1.4, 4.8, 5]];
        if (v === 1) {
          const [rr, h, l] = r.pick(TRC);
          const A = 2 * P * rr * rr + P * rr * l;
          return taskL(lang, {
            text: L(`A toy is a cone of base radius ${en(rr)} cm mounted on a hemisphere of the same radius. The height of the cone is ${en(h)} cm. Find the total surface area of the toy (in cm²).`, `एक खिलौना ${en(rr)} cm आधार त्रिज्या वाले शंकु को उसी त्रिज्या वाले अर्धगोले पर रखकर बना है। शंकु की ऊँचाई ${en(h)} cm है। खिलौने का कुल पृष्ठीय क्षेत्रफल (cm² में) ज्ञात कीजिए।`) + PIN + rnd(A, lang),
            answer: ansN(A, [
              [2 * P * rr * rr + P * rr * h, L("The curved surface of a cone uses the slant height l, not the height h.", "शंकु के वक्र पृष्ठ में तिर्यक ऊँचाई l लगती है, ऊँचाई h नहीं।")],
              [3 * P * rr * rr + P * rr * l, L("The flat circular faces are joined inside the toy; they are not part of its surface.", "समतल वृत्ताकार फलक खिलौने के अंदर जुड़े हैं; वे उसके पृष्ठ का भाग नहीं हैं।")],
            ]),
            data: { given: [`r = ${en(rr)}\\ \\mathrm{cm}`, `h = ${en(h)}\\ \\mathrm{cm}`, R`\pi = \dfrac{22}{7}`], find: ["S"] },
            hint: L("Only the outer surfaces count: the curved surface of the hemisphere and of the cone. Find l first.", "केवल बाहरी पृष्ठ गिने जाते हैं: अर्धगोले और शंकु के वक्र पृष्ठ। पहले l ज्ञात कीजिए।"),
            formula: R`S = 2\pi r^2 + \pi r l,\quad l = \sqrt{r^2 + h^2}`,
            solution: S(
              R`$l = \sqrt{${en(rr)}^2 + ${en(h)}^2} = ${en(l)}\ \text{cm}$`,
              R`$S = 2 \times \dfrac{22}{7} \times ${en(rr)}^2 + \dfrac{22}{7} \times ${en(rr)} \times ${en(l)}$`,
              R`$S = ${f2(2 * P * rr * rr)} + ${f2(P * rr * l)} ${eqs(A)} ${f2(A)}\ \text{cm}^2$`,
            ),
          });
        }
        if (v === 2) {
          const d = r.pick([3.5, 5, 7, 4.2, 2.8]), rr = d / 2, lc = r.pick([7, 9, 10, 14, 6]);
          const Lt = r2(lc + d);
          const A = 2 * P * rr * lc + 4 * P * rr * rr;
          return taskL(lang, {
            text: L(`A medicine capsule is a cylinder with two hemispheres stuck to its ends. The whole capsule is ${en(Lt)} mm long and its diameter is ${en(d)} mm. Find its surface area (in mm²).`, `दवा का एक कैप्सूल एक बेलन के दोनों सिरों पर एक-एक अर्धगोला लगाकर बना है। पूरे कैप्सूल की लंबाई ${en(Lt)} mm और व्यास ${en(d)} mm है। इसका पृष्ठीय क्षेत्रफल (mm² में) ज्ञात कीजिए।`) + PIN + rnd(A, lang),
            answer: ansN(A, [
              [2 * P * rr * Lt + 4 * P * rr * rr, L("The cylindrical part is shorter: subtract the two radii from the total length.", "बेलनाकार भाग छोटा है: कुल लंबाई में से दोनों त्रिज्याएँ घटाइए।")],
              [2 * P * d * lc + 4 * P * d * d, L("Use the radius (half the diameter).", "त्रिज्या (व्यास का आधा) लीजिए।")],
            ]),
            data: { given: [`L = ${en(Lt)}\\ \\mathrm{mm}`, `d = ${en(d)}\\ \\mathrm{mm}`, R`\pi = \dfrac{22}{7}`], find: ["S"] },
            hint: L("Two hemispheres make one sphere. Find the length of the cylindrical part first.", "दो अर्धगोले मिलकर एक गोला बनाते हैं। पहले बेलनाकार भाग की लंबाई ज्ञात कीजिए।"),
            formula: R`S = 2\pi r h + 4\pi r^2`,
            solution: S(
              R`$r = ${en(rr)}\ \text{mm}$, $h = ${en(Lt)} - 2 \times ${en(rr)} = ${lc}\ \text{mm}$`,
              R`$S = 2 \times \dfrac{22}{7} \times ${en(rr)} \times ${lc} + 4 \times \dfrac{22}{7} \times ${en(rr)}^2$`,
              R`$S = ${f2(2 * P * rr * lc)} + ${f2(4 * P * rr * rr)} ${eqs(A)} ${f2(A)}\ \text{mm}^2$`,
            ),
          });
        }
        const [rr, h, l] = r.pick(TRC);
        const A = 2 * P * rr * h + P * rr * rr + P * rr * l;
        return taskL(lang, {
          text: L(`From a solid cylinder of height ${en(h)} cm and diameter ${en(2 * rr)} cm, a conical cavity of the same height and diameter is hollowed out. Find the total surface area of the remaining solid (in cm²).`, `${en(h)} cm ऊँचाई और ${en(2 * rr)} cm व्यास वाले एक ठोस बेलन में से उसी ऊँचाई और व्यास का एक शंक्वाकार खोखला भाग निकाल लिया जाता है। शेष ठोस का कुल पृष्ठीय क्षेत्रफल (cm² में) ज्ञात कीजिए।`) + PIN + rnd(A, lang),
          answer: ansN(A, [
            [2 * P * rr * h + 2 * P * rr * rr, L("The cone was removed: its curved surface is now inside, and one base is gone.", "शंकु निकाल दिया गया है: उसका वक्र पृष्ठ अब अंदर है, और एक आधार हट गया है।")],
            [2 * P * rr * h + 2 * P * rr * rr + P * rr * l, L("One circular end is cut away by the cavity; count only one base.", "खोखले भाग से एक वृत्ताकार सिरा कट गया है; केवल एक आधार गिनिए।")],
          ]),
          data: { given: [`h = ${en(h)}\\ \\mathrm{cm}`, `d = ${en(2 * rr)}\\ \\mathrm{cm}`, R`\pi = \dfrac{22}{7}`], find: ["S"] },
          hint: L("Remaining surface = curved surface of the cylinder + one base + curved surface of the cone.", "शेष पृष्ठ = बेलन का वक्र पृष्ठ + एक आधार + शंकु का वक्र पृष्ठ।"),
          formula: R`S = 2\pi r h + \pi r^2 + \pi r l`,
          solution: S(
            R`$l = \sqrt{${en(rr)}^2 + ${en(h)}^2} = ${en(l)}\ \text{cm}$`,
            R`$2\pi r h ${eqs(2 * P * rr * h)} ${f2(2 * P * rr * h)},\ \pi r^2 ${eqs(P * rr * rr)} ${f2(P * rr * rr)},\ \pi r l ${eqs(P * rr * l)} ${f2(P * rr * l)}$`,
            R`$S ${eqs(A)} ${f2(A)}\ \text{cm}^2$`,
          ),
        });
      }
      const v = r.int(0, 2);
      if (v === 0) {
        const sub = r.int(0, 2);
        if (sub === 0) {
          const [Rb, rs] = r.pick([[6, 2], [6, 3], [8, 2], [9, 3], [10, 2], [12, 3], [12, 4], [10, 5], [7, 3.5], [10.5, 3.5]]);
          const n = (Rb / rs) ** 3;
          return taskL(lang, {
            text: L(`A metallic sphere of radius ${en(Rb)} cm is melted and recast into small spheres, each of radius ${en(rs)} cm. How many small spheres are obtained?`, `${en(Rb)} cm त्रिज्या वाले धातु के एक गोले को पिघलाकर ${en(rs)} cm त्रिज्या वाले छोटे गोले बनाए जाते हैं। कितने छोटे गोले प्राप्त होंगे?`),
            answer: numM(n, null, [
              [(Rb / rs) ** 2, L("Recasting keeps the volume, so compare r³, not r².", "पुनः ढालने में आयतन समान रहता है, अतः r³ की तुलना कीजिए, r² की नहीं।")],
              [Rb / rs, L("Volumes go with the cube of the radius.", "आयतन त्रिज्या के घन के अनुसार बदलता है।")],
            ]),
            data: { given: [`R = ${en(Rb)}\\ \\mathrm{cm}`, `r = ${en(rs)}\\ \\mathrm{cm}`], find: ["n"] },
            hint: L("Volume is unchanged: n × (volume of a small sphere) = volume of the big sphere.", "आयतन नहीं बदलता: n × (छोटे गोले का आयतन) = बड़े गोले का आयतन।"),
            formula: R`n \cdot \dfrac{4}{3}\pi r^3 = \dfrac{4}{3}\pi R^3`,
            solution: S(
              R`$n = \dfrac{\frac{4}{3}\pi R^3}{\frac{4}{3}\pi r^3} = \left(\dfrac{R}{r}\right)^3$`,
              R`$n = \left(\dfrac{${en(Rb)}}{${en(rs)}}\right)^3 = ${Rb / rs}^3 = ${n}$`,
            ),
          });
        }
        if (sub === 1) {
          let rc, hc, d, n;
          do { rc = r.int(2, 6); hc = r.int(4, 45); d = r.pick([1, 2, 3, 4]); n = (rc * rc * hc) / ((4 / 3) * (d / 2) ** 3); } while (Math.abs(n - Math.round(n)) > 1e-9 || n > 3000 || n < 4);
          n = Math.round(n);
          return taskL(lang, {
            text: L(`A solid metallic cylinder of base radius ${rc} cm and height ${hc} cm is melted and recast into solid spheres of diameter ${d} cm each. How many spheres are formed?`, `${rc} cm आधार त्रिज्या और ${hc} cm ऊँचाई वाले धातु के एक ठोस बेलन को पिघलाकर ${d} cm व्यास वाले ठोस गोले बनाए जाते हैं। कितने गोले बनेंगे?`),
            answer: numM(n, null, [
              [n / 8, L("The sphere's radius is half its diameter.", "गोले की त्रिज्या उसके व्यास की आधी होती है।")],
              [(rc * rc * hc) / (d / 2) ** 3, L("The volume of a sphere has the factor 4/3.", "गोले के आयतन में 4/3 का गुणनखंड होता है।")],
            ]),
            data: { given: [`r = ${rc}\\ \\mathrm{cm}`, `h = ${hc}\\ \\mathrm{cm}`, `d = ${d}\\ \\mathrm{cm}`], find: ["n"] },
            hint: L("Number of spheres = volume of the cylinder ÷ volume of one sphere; π cancels.", "गोलों की संख्या = बेलन का आयतन ÷ एक गोले का आयतन; π कट जाता है।"),
            formula: R`n = \dfrac{\pi r^2 h}{\frac{4}{3}\pi \rho^3}`,
            solution: S(
              R`$\rho = \dfrac{${d}}{2} = ${en(d / 2)}\ \text{cm}$`,
              R`$n = \dfrac{${rc}^2 \times ${hc}}{\frac{4}{3} \times ${en(d / 2)}^3} = \dfrac{3 \times ${rc * rc * hc}}{4 \times ${en((d / 2) ** 3)}} = \dfrac{${3 * rc * rc * hc}}{${en(4 * (d / 2) ** 3)}} = ${n}$`,
            ),
          });
        }
        const [Rb, rc] = r.pick([[4.2, 6], [3, 2], [6, 4], [6, 8], [3, 4], [9, 6], [2.1, 1.4], [4.5, 3], [6, 3]]);
        const hc = ((4 / 3) * Rb ** 3) / (rc * rc);
        return taskL(lang, {
          text: L(`A metallic sphere of radius ${en(Rb)} cm is melted and recast into a solid cylinder of radius ${en(rc)} cm. Find the height of the cylinder (in cm).`, `${en(Rb)} cm त्रिज्या वाले धातु के एक गोले को पिघलाकर ${en(rc)} cm त्रिज्या वाला एक ठोस बेलन बनाया जाता है। बेलन की ऊँचाई (cm में) ज्ञात कीजिए।`) + rnd(hc, lang),
          answer: ansN(hc, [
            [Rb ** 3 / (rc * rc), L("The volume of a sphere has the factor 4/3.", "गोले के आयतन में 4/3 का गुणनखंड होता है।")],
            [((4 / 3) * Rb ** 3) / rc, L("The cylinder's volume has r², so divide by r².", "बेलन के आयतन में r² है, अतः r² से भाग दीजिए।")],
          ]),
          data: { given: [`R = ${en(Rb)}\\ \\mathrm{cm}`, `r = ${en(rc)}\\ \\mathrm{cm}`], find: ["h"] },
          hint: L("Volume is unchanged: πr²h = (4/3)πR³. π cancels.", "आयतन नहीं बदलता: πr²h = (4/3)πR³। π कट जाता है।"),
          formula: R`\pi r^2 h = \dfrac{4}{3}\pi R^3`,
          solution: S(
            R`$h = \dfrac{\frac{4}{3} R^3}{r^2} = \dfrac{\frac{4}{3} \times ${en(Rb)}^3}{${en(rc)}^2}$`,
            R`$h = \dfrac{${f2((4 / 3) * Rb ** 3)}}{${en(rc * rc)}} ${eqs(hc)} ${f2(hc)}\ \text{cm}$`,
          ),
        });
      }
      if (v === 1) {
        if (r.int(0, 1) === 0) {
          let d, sp, Rt, Ht, tm;
          do {
            d = r.pick([10, 20]); sp = r.int(2, 6); Rt = r.pick([2, 2.5, 3, 4, 5]); Ht = r.pick([1, 1.5, 2, 2.4, 3]);
            tm = (60 * Rt * Rt * Ht) / ((d / 200) ** 2 * sp * 1000);
          } while (Math.abs(tm - Math.round(tm)) > 1e-9);
          return taskL(lang, {
            text: L(`Water flows at ${sp} km/h through a cylindrical pipe of internal diameter ${d} cm into a cylindrical tank of base radius ${en(Rt)} m. In how many minutes will the water in the tank rise to ${en(Ht)} m?`, `आंतरिक व्यास ${d} cm वाले एक बेलनाकार पाइप से पानी ${sp} km/h की चाल से आधार त्रिज्या ${en(Rt)} m वाली एक बेलनाकार टंकी में जा रहा है। टंकी में पानी का तल ${en(Ht)} m तक कितने मिनट में पहुँचेगा?`),
            answer: numM(Math.round(tm), null, [
              [tm / 4, L("The pipe's radius is half its diameter.", "पाइप की त्रिज्या उसके व्यास की आधी होती है।")],
              [tm / 60, L("That is the time in hours; convert it to minutes.", "यह घंटों में समय है; इसे मिनटों में बदलिए।")],
            ]),
            data: { given: [`d = ${d}\\ \\mathrm{cm}`, `v = ${sp}\\ \\mathrm{km/h}`, `R = ${en(Rt)}\\ \\mathrm{m}`, `H = ${en(Ht)}\\ \\mathrm{m}`], find: [L(R`t\ (\text{min})`, R`t\ (\text{मिनट})`)] },
            hint: L("In one hour the pipe delivers a cylinder of water of radius = pipe radius and length = distance flowed. Work in metres.", "एक घंटे में पाइप से निकला पानी एक बेलन है, जिसकी त्रिज्या पाइप की त्रिज्या और लंबाई बहाव की दूरी है। मीटर में गणना कीजिए।"),
            formula: R`t = \dfrac{\pi R^2 H}{\pi r^2 v}`,
            solution: S(
              R`$r = ${en(d / 200)}\ \text{m}$, $v = ${sp * 1000}\ \text{m/h}$`,
              R`$\text{${L("water per hour", "प्रति घंटा पानी")}} = \pi \times ${en(d / 200)}^2 \times ${sp * 1000} = ${en((d / 200) ** 2 * sp * 1000)}\pi\ \text{m}^3$`,
              R`$\text{${L("tank", "टंकी")}} = \pi \times ${en(Rt)}^2 \times ${en(Ht)} = ${en(Rt * Rt * Ht)}\pi\ \text{m}^3$`,
              R`$t = \dfrac{${en(Rt * Rt * Ht)}}{${en((d / 200) ** 2 * sp * 1000)}}\ \text{h} = \dfrac{${en(Rt * Rt * Ht)} \times 60}{${en((d / 200) ** 2 * sp * 1000)}}\ \text{min} = ${Math.round(tm)}\ \text{min}$`,
            ),
          });
        }
        const w = r.pick([5, 6, 8, 10]), dp = r.pick([1.2, 1.5, 2]), sp = r.pick([6, 8, 10, 12]), tmin = r.pick([20, 30, 45, 60]), hc = r.pick([5, 8, 10]);
        const vol = w * dp * sp * 1000 * (tmin / 60), area = vol / (hc / 100);
        return taskL(lang, {
          text: L(`Water in a canal ${w} m wide and ${en(dp)} m deep is flowing at ${sp} km/h. How much area (in m²) will it irrigate in ${tmin} minutes if ${hc} cm of standing water is needed?`, `${w} m चौड़ी और ${en(dp)} m गहरी एक नहर में पानी ${sp} km/h की चाल से बह रहा है। यदि ${hc} cm खड़े पानी की आवश्यकता हो, तो ${tmin} मिनट में यह कितने क्षेत्रफल (m² में) की सिंचाई करेगी?`),
          answer: ansN(area, [
            [vol / hc, L(`Convert ${hc} cm to metres before dividing.`, `भाग देने से पहले ${hc} cm को मीटर में बदलिए।`)],
            [(w * dp * sp * 1000) / (hc / 100), L(`The water flows for ${tmin} minutes, not a full hour.`, `पानी ${tmin} मिनट बहता है, पूरा एक घंटा नहीं।`)],
          ]),
          data: { given: [`b = ${w}\\ \\mathrm{m}`, `d = ${en(dp)}\\ \\mathrm{m}`, `v = ${sp}\\ \\mathrm{km/h}`, `t = ${tmin}\\ \\mathrm{min}`, `h = ${hc}\\ \\mathrm{cm}`], find: ["A"] },
          hint: L("Volume of water = width × depth × length flowed. Then area = volume ÷ height of standing water.", "पानी का आयतन = चौड़ाई × गहराई × बहाव की लंबाई। फिर क्षेत्रफल = आयतन ÷ खड़े पानी की ऊँचाई।"),
          formula: R`A = \dfrac{b \cdot d \cdot (v t)}{h}`,
          solution: S(
            R`$vt = ${sp * 1000} \times \dfrac{${tmin}}{60} = ${en(sp * 1000 * tmin / 60)}\ \text{m}$`,
            R`$V = ${w} \times ${en(dp)} \times ${en(sp * 1000 * tmin / 60)} = ${en(vol)}\ \text{m}^3$`,
            R`$A = \dfrac{${en(vol)}}{${en(hc / 100)}} = ${f2(area)}\ \text{m}^2$`,
          ),
        });
      }
      const dw = r.pick([2, 3, 4, 7]), H = r.pick([10, 14, 20, 21, 12]), w = r.pick([2, 3, 4, 5]);
      const rw = dw / 2, ht = (rw * rw * H) / ((rw + w) ** 2 - rw * rw);
      return taskL(lang, {
        text: L(`A well of diameter ${dw} m is dug ${H} m deep. The earth taken out is spread evenly all around it in the shape of a circular ring (embankment) of width ${w} m. Find the height of the embankment (in m).`, `${dw} m व्यास वाला एक कुआँ ${H} m गहरा खोदा गया। निकली हुई मिट्टी को कुएँ के चारों ओर ${w} m चौड़ी एक वृत्ताकार वलय (तटबंध) के रूप में समान रूप से फैलाया गया। तटबंध की ऊँचाई (m में) ज्ञात कीजिए।`) + rnd(ht, lang),
        answer: ansN(ht, [
          [(rw * rw * H) / (rw + w) ** 2, L("The embankment is a ring: subtract the area of the well's mouth.", "तटबंध एक वलय है: कुएँ के मुख का क्षेत्रफल घटाइए।")],
          [(rw * rw * H) / (w * w), L("The ring's area is π(R² − r²) with R = r + width, not π × width².", "वलय का क्षेत्रफल π(R² − r²) है, जहाँ R = r + चौड़ाई; यह π × चौड़ाई² नहीं है।")],
        ]),
        data: { given: [`d = ${dw}\\ \\mathrm{m}`, `H = ${H}\\ \\mathrm{m}`, `w = ${w}\\ \\mathrm{m}`], find: ["h"] },
        hint: L("Volume of earth dug = volume of the embankment (a hollow cylinder with inner radius r and outer radius r + width).", "खोदी गई मिट्टी का आयतन = तटबंध का आयतन (आंतरिक त्रिज्या r और बाहरी त्रिज्या r + चौड़ाई वाला खोखला बेलन)।"),
        formula: R`\pi r^2 H = \pi (R^2 - r^2) h`,
        solution: S(
          R`$r = ${en(rw)}\ \text{m}$, $R = ${en(rw)} + ${w} = ${en(rw + w)}\ \text{m}$`,
          R`$\pi \times ${en(rw)}^2 \times ${H} = \pi (${en(rw + w)}^2 - ${en(rw)}^2)\, h$`,
          R`$h = \dfrac{${en(rw * rw * H)}}{${en((rw + w) ** 2 - rw * rw)}} ${eqs(ht)} ${f2(ht)}\ \text{m}$`,
          L("(π cancels, so its value is not needed.)", "(π कट जाता है, अतः उसके मान की आवश्यकता नहीं।)"),
        ),
      });
    },
  },
  {
    id: "exi-mat-solids-reverse",
    topics: [T("surface-areas-and-volumes")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const P = 22 / 7;
      const PIN = L(R` Use $\pi = \dfrac{22}{7}$.`, R` $\pi = \dfrac{22}{7}$ लीजिए।`);
      const R7 = [3.5, 7, 10.5, 14, 21];
      if (level === 1) {
        const v = r.int(0, 3);
        const rr = r.pick(R7);
        if (v === 0) {
          const h = r.int(3, 25), V = P * rr * rr * h;
          return taskL(lang, {
            text: L(`The volume of a right circular cylinder is ${f2(V)} cm³ and its base radius is ${en(rr)} cm. Find its height (in cm).`, `एक लंब वृत्तीय बेलन का आयतन ${f2(V)} cm³ और आधार त्रिज्या ${en(rr)} cm है। इसकी ऊँचाई (cm में) ज्ञात कीजिए।`) + PIN,
            answer: ansN(h, [[V / (P * rr), L("Divide by πr², not πr.", "πr² से भाग दीजिए, πr से नहीं।")], [V / (2 * P * rr), L("2πr belongs to the curved surface area; the volume is πr²h.", "2πr वक्र पृष्ठीय क्षेत्रफल में आता है; आयतन πr²h है।")]]),
            data: { given: [`V = ${f2(V)}\\ \\mathrm{cm^3}`, `r = ${en(rr)}\\ \\mathrm{cm}`], find: ["h"] },
            hint: L("Write V = πr²h and solve for h.", "V = πr²h लिखिए और h के लिए हल कीजिए।"),
            formula: R`h = \dfrac{V}{\pi r^2}`,
            solution: S(L("From V = πr²h:", "V = πr²h से:"), R`$h = \dfrac{${f2(V)}}{\frac{22}{7} \times ${en(rr)}^2} = \dfrac{${f2(V)}}{${f2(P * rr * rr)}} = ${h}\ \text{cm}$`),
          });
        }
        if (v === 1) {
          const A = 4 * P * rr * rr;
          return taskL(lang, {
            text: L(`The surface area of a sphere is ${f2(A)} cm². Find its radius (in cm).`, `एक गोले का पृष्ठीय क्षेत्रफल ${f2(A)} cm² है। इसकी त्रिज्या (cm में) ज्ञात कीजिए।`) + PIN,
            answer: ansN(rr, [[2 * rr, L("You forgot the 4 in 4πr² (or found the diameter).", "आप 4πr² का 4 भूल गए (या व्यास निकाल लिया)।")], [rr * rr, L("That is r²; take the square root.", "यह r² है; वर्गमूल लीजिए।")]]),
            data: { given: [`S = ${f2(A)}\\ \\mathrm{cm^2}`], find: ["r"] },
            hint: L("Write S = 4πr², find r², then take the square root.", "S = 4πr² लिखिए, r² ज्ञात कीजिए, फिर वर्गमूल लीजिए।"),
            formula: R`r = \sqrt{\dfrac{S}{4\pi}}`,
            solution: S(L("From S = 4πr²:", "S = 4πr² से:"), R`$r^2 = \dfrac{${f2(A)}}{4 \times \frac{22}{7}} = ${f2(rr * rr)}$`, R`$r = ${en(rr)}\ \text{cm}$`),
          });
        }
        if (v === 2) {
          const l = Math.round(rr) + r.int(3, 15), A = P * rr * l;
          return taskL(lang, {
            text: L(`The curved surface area of a cone is ${f2(A)} cm² and its base radius is ${en(rr)} cm. Find its slant height (in cm).`, `एक शंकु का वक्र पृष्ठीय क्षेत्रफल ${f2(A)} cm² और आधार त्रिज्या ${en(rr)} cm है। इसकी तिर्यक ऊँचाई (cm में) ज्ञात कीजिए।`) + PIN,
            answer: ansN(l, [[A / (2 * P * rr), L("The curved surface of a cone is πrl, without a factor 2.", "शंकु का वक्र पृष्ठ πrl है, 2 के गुणनखंड के बिना।")], [A / (P * rr * rr), L("Divide by πr, not πr².", "πr से भाग दीजिए, πr² से नहीं।")]]),
            data: { given: [`S = ${f2(A)}\\ \\mathrm{cm^2}`, `r = ${en(rr)}\\ \\mathrm{cm}`], find: ["l"] },
            hint: L("Write S = πrl and solve for l.", "S = πrl लिखिए और l के लिए हल कीजिए।"),
            formula: R`l = \dfrac{S}{\pi r}`,
            solution: S(L("From S = πrl:", "S = πrl से:"), R`$l = \dfrac{${f2(A)}}{\frac{22}{7} \times ${en(rr)}} = \dfrac{${f2(A)}}{${f2(P * rr)}} = ${l}\ \text{cm}$`),
          });
        }
        const h = 3 * r.int(1, 8), V = (P * rr * rr * h) / 3;
        return taskL(lang, {
          text: L(`The volume of a right circular cone is ${f2(V)} cm³ and its base radius is ${en(rr)} cm. Find its height (in cm).`, `एक लंब वृत्तीय शंकु का आयतन ${f2(V)} cm³ और आधार त्रिज्या ${en(rr)} cm है। इसकी ऊँचाई (cm में) ज्ञात कीजिए।`) + PIN,
          answer: ansN(h, [[h / 3, L("The cone's volume is (1/3)πr²h: multiply by 3.", "शंकु का आयतन (1/3)πr²h है: 3 से गुणा कीजिए।")], [V / (P * rr), L("Divide by πr², not πr.", "πr² से भाग दीजिए, πr से नहीं।")]]),
          data: { given: [`V = ${f2(V)}\\ \\mathrm{cm^3}`, `r = ${en(rr)}\\ \\mathrm{cm}`], find: ["h"] },
          hint: L("Write V = (1/3)πr²h and solve for h.", "V = (1/3)πr²h लिखिए और h के लिए हल कीजिए।"),
          formula: R`h = \dfrac{3V}{\pi r^2}`,
          solution: S(L("From V = (1/3)πr²h:", "V = (1/3)πr²h से:"), R`$h = \dfrac{3 \times ${f2(V)}}{\frac{22}{7} \times ${en(rr)}^2} = \dfrac{${f2(3 * V)}}{${f2(P * rr * rr)}} = ${h}\ \text{cm}$`),
        });
      }
      if (level === 2) {
        const v = r.int(0, 2);
        if (v === 0) {
          const sc = r.int(0, 4), k = r.int(2, 4);
          const times = (x) => L(`$${x}$ times`, `$${x}$ गुना`);
          const POW = (p) => ({
            1: L("That would need the quantity to be proportional to r. Check the power of r in the formula.", "ऐसा तभी होता जब राशि r के अनुक्रमानुपाती होती। सूत्र में r की घात देखिए।"),
            2: L("Squaring the factor is right for areas (r²). Check the power of r in this formula.", "गुणक का वर्ग क्षेत्रफलों (r²) के लिए सही है। इस सूत्र में r की घात देखिए।"),
            3: L("Cubing the factor is right for volumes (r³). Check the power of r in this formula.", "गुणक का घन आयतनों (r³) के लिए सही है। इस सूत्र में r की घात देखिए।"),
            d: L("Multiplying the radius does not simply double the quantity. Use the power of r.", "त्रिज्या को गुणा करने से राशि केवल दुगुनी नहीं होती। r की घात का प्रयोग कीजिए।"),
          })[p];
          let text, correct, wrong, F;
          if (sc <= 2) {
            const p = [2, 3, 2][sc];
            text = [
              L(`The radius of a sphere is multiplied by ${k}. How many times its original value does its surface area become?`, `एक गोले की त्रिज्या ${k} गुनी कर दी जाती है। उसका पृष्ठीय क्षेत्रफल मूल का कितना गुना हो जाता है?`),
              L(`The radius of a sphere is multiplied by ${k}. How many times its original value does its volume become?`, `एक गोले की त्रिज्या ${k} गुनी कर दी जाती है। उसका आयतन मूल का कितना गुना हो जाता है?`),
              L(`The base radius of a cylinder is multiplied by ${k} and its height is unchanged. How many times its original value does its volume become?`, `एक बेलन की आधार त्रिज्या ${k} गुनी कर दी जाती है और ऊँचाई वही रहती है। उसका आयतन मूल का कितना गुना हो जाता है?`),
            ][sc];
            F = [R`S = 4\pi r^2`, R`V = \tfrac{4}{3}\pi r^3`, R`V = \pi r^2 h`][sc];
            correct = times(k ** p);
            wrong = [[times(k), POW(1)], [times(k ** 2), POW(2)], [times(k ** 3), POW(3)], [times(2 * k), POW("d")], [times(k ** 4), L("No formula here has r⁴. Check the power of r.", "यहाँ किसी सूत्र में r⁴ नहीं है। r की घात देखिए।")]];
          } else if (sc === 3) {
            text = L("The radius of a cylinder is halved and its height is doubled. How many times its original value does its volume become?", "एक बेलन की त्रिज्या आधी और ऊँचाई दुगुनी कर दी जाती है। उसका आयतन मूल का कितना गुना हो जाता है?");
            F = R`V = \pi r^2 h`;
            correct = times(R`\frac{1}{2}`);
            wrong = [[times(1), L("The changes do not cancel: the radius is squared.", "परिवर्तन एक-दूसरे को निरस्त नहीं करते: त्रिज्या का वर्ग होता है।")], [times(2), L("Halving r divides r² by 4, not by 2.", "r को आधा करने से r², 4 से भाग होता है, 2 से नहीं।")], [times(R`\frac{1}{4}`), L("You forgot that the height is doubled.", "आप भूल गए कि ऊँचाई दुगुनी हुई है।")]];
          } else {
            text = L("A cylinder and a cone have the same base radius and the same height. How many such cones of water fill the cylinder?", "एक बेलन और एक शंकु की आधार त्रिज्या और ऊँचाई समान हैं। ऐसे कितने शंकु पानी से बेलन भर जाएगा?");
            F = R`V_{\text{cone}} = \dfrac{1}{3}\pi r^2 h`;
            correct = `$3$`;
            wrong = [[`$2$`, L("A hemisphere is 2/3 of the cylinder around it; a cone is 1/3.", "अर्धगोला अपने चारों ओर के बेलन का 2/3 होता है; शंकु 1/3 होता है।")], [`$4$`, L("Compare πr²h with (1/3)πr²h.", "πr²h की तुलना (1/3)πr²h से कीजिए।")], [R`$\frac{1}{3}$`, L("That is the cone as a fraction of the cylinder; the question asks for the number of cones.", "यह बेलन के भाग के रूप में शंकु है; प्रश्न शंकुओं की संख्या पूछता है।")]];
          }
          return taskL(lang, {
            text,
            answer: choiceWhy(r, correct, wrong),
            hint: L("Write the formula and see how each length enters it (power of r, power of h).", "सूत्र लिखिए और देखिए कि प्रत्येक लंबाई उसमें किस घात में आती है (r की घात, h की घात)।"),
            formula: F,
            solution: S(
              L("Formula:", "सूत्र:") + ` $${F}$`,
              sc <= 2 ? R`$\text{${L("new", "नया")}} = ${[`4\\pi (${k}r)^2`, `\\tfrac{4}{3}\\pi (${k}r)^3`, `\\pi (${k}r)^2 h`][sc]} = ${k ** [2, 3, 2][sc]} \times \text{${L("old", "पुराना")}}$`
                : sc === 3 ? R`$\pi \left(\dfrac{r}{2}\right)^2 (2h) = \dfrac{1}{2}\pi r^2 h$` : R`$\dfrac{\pi r^2 h}{\frac{1}{3}\pi r^2 h} = 3$`,
              L("Answer:", "उत्तर:") + ` ${correct}`,
            ),
          });
        }
        if (v === 1) {
          const d = r.pick([10.5, 21, 14, 7, 28, 17.5]), rr = d / 2;
          const V = (2 / 3) * P * rr ** 3, lit = V / 1000;
          return taskL(lang, {
            text: L(`How many litres of milk can a hemispherical bowl of diameter ${en(d)} cm hold?`, `${en(d)} cm व्यास वाले एक अर्धगोलाकार कटोरे में कितने लीटर दूध आ सकता है?`) + PIN + rnd(lit, lang),
            answer: ansN(lit, [[V, L("1 litre = 1000 cm³: convert the volume to litres.", "1 लीटर = 1000 cm³: आयतन को लीटर में बदलिए।")], [(2 / 3) * P * d ** 3 / 1000, L("Use the radius (half the diameter).", "त्रिज्या (व्यास का आधा) लीजिए।")], [(4 / 3) * P * rr ** 3 / 1000, L("A bowl is half a sphere.", "कटोरा आधा गोला है।")]]),
            data: { given: [`d = ${en(d)}\\ \\mathrm{cm}`, R`\pi = \dfrac{22}{7}`], find: ["V"] },
            hint: L("Find the volume of the hemisphere in cm³, then divide by 1000.", "अर्धगोले का आयतन cm³ में ज्ञात कीजिए, फिर 1000 से भाग दीजिए।"),
            formula: R`V = \dfrac{2}{3}\pi r^3`,
            solution: S(
              R`$r = ${en(rr)}\ \text{cm}$`,
              R`$V = \dfrac{2}{3} \times \dfrac{22}{7} \times ${en(rr)}^3 ${eqs(V)} ${f2(V)}\ \text{cm}^3$`,
              R`$V ${eqs(lit)} ${f2(lit)}\ \text{L}$`,
            ),
          });
        }
        const rr = r.pick(R7), x = r.pick([5, 8, 10, 12, 16, 20]);
        const A = 2 * P * rr * rr, cost = (A * x) / 100;
        return taskL(lang, {
          text: L(`The inner surface of a hemispherical bowl of radius ${en(rr)} cm is to be painted at ₹${x} per 100 cm². Find the cost of painting (in ₹).`, `${en(rr)} cm त्रिज्या वाले एक अर्धगोलाकार कटोरे के भीतरी पृष्ठ को ₹${x} प्रति 100 cm² की दर से रँगना है। रँगने का व्यय (₹ में) ज्ञात कीजिए।`) + PIN + rnd(cost, lang),
          answer: ansN(cost, [[(3 * P * rr * rr * x) / 100, L("The bowl is open: only the curved surface 2πr² is painted.", "कटोरा खुला है: केवल वक्र पृष्ठ 2πr² रँगा जाता है।")], [A * x, L("The rate is per 100 cm²: divide the area by 100.", "दर प्रति 100 cm² है: क्षेत्रफल को 100 से भाग दीजिए।")]]),
          data: { given: [`r = ${en(rr)}\\ \\mathrm{cm}`, R`\text{rate} = \text{₹}${x}/100\ \text{cm}^2`], find: [L(R`\text{cost}`, R`\text{व्यय}`)] },
          hint: L("Find the inner curved surface area, then use the rate per 100 cm².", "भीतरी वक्र पृष्ठीय क्षेत्रफल ज्ञात कीजिए, फिर प्रति 100 cm² की दर लगाइए।"),
          formula: R`S = 2\pi r^2`,
          solution: S(
            R`$S = 2 \times \dfrac{22}{7} \times ${en(rr)}^2 = ${f2(A)}\ \text{cm}^2$`,
            R`$\text{${L("cost", "व्यय")}} = \dfrac{${f2(A)}}{100} \times ${x} ${eqs(cost)} \text{₹}\,${f2(cost)}$`,
          ),
        });
      }
      const v = r.int(0, 2);
      if (v === 0) {
        let Rb, rho, hb, n;
        do { Rb = r.pick([6, 9, 12, 15]); rho = r.pick([1, 1.5, 2, 3]); hb = r.int(2, 12); n = ((2 / 3) * Rb ** 3) / (rho * rho * hb); } while (Math.abs(n - Math.round(n)) > 1e-9 || n > 500);
        n = Math.round(n);
        return taskL(lang, {
          text: L(`A hemispherical bowl of internal radius ${Rb} cm is full of liquid. The liquid is to be filled into cylindrical bottles of diameter ${en(2 * rho)} cm and height ${hb} cm. How many bottles are needed to empty the bowl?`, `${Rb} cm आंतरिक त्रिज्या वाला एक अर्धगोलाकार कटोरा द्रव से भरा है। इस द्रव को ${en(2 * rho)} cm व्यास और ${hb} cm ऊँचाई वाली बेलनाकार बोतलों में भरना है। कटोरा खाली करने के लिए कितनी बोतलें चाहिए?`),
          answer: numM(n, null, [[n / 4, L("The bottle's radius is half its diameter.", "बोतल की त्रिज्या उसके व्यास की आधी होती है।")], [2 * n, L("The bowl is a hemisphere: (2/3)πr³, not (4/3)πr³.", "कटोरा अर्धगोला है: (2/3)πr³, न कि (4/3)πr³।")]]),
          data: { given: [`R = ${Rb}\\ \\mathrm{cm}`, `d = ${en(2 * rho)}\\ \\mathrm{cm}`, `h = ${hb}\\ \\mathrm{cm}`], find: ["n"] },
          hint: L("Number of bottles = volume of the bowl ÷ volume of one bottle; π cancels.", "बोतलों की संख्या = कटोरे का आयतन ÷ एक बोतल का आयतन; π कट जाता है।"),
          formula: R`n = \dfrac{\frac{2}{3}\pi R^3}{\pi r^2 h}`,
          solution: S(
            R`$r = ${en(rho)}\ \text{cm}$`,
            R`$n = \dfrac{\frac{2}{3} \times ${Rb}^3}{${en(rho)}^2 \times ${hb}} = \dfrac{${en((2 / 3) * Rb ** 3)}}{${en(rho * rho * hb)}} = ${n}$`,
          ),
        });
      }
      if (v === 1) {
        const Lr = r.pick([22, 44, 33]), B = r.pick([14, 20, 21]), rain = r.pick([1, 2, 2.5]), rv = r.pick([1, 2, 0.7, 1.4]);
        const vol = Lr * B * (rain / 100), h = vol / (P * rv * rv);
        return taskL(lang, {
          text: L(`A flat rooftop measures ${Lr} m × ${B} m. After a rainfall of ${en(rain)} cm, all the rainwater from the roof flows into a cylindrical vessel of base diameter ${en(2 * rv)} m. Find the height of the water in the vessel (in m).`, `एक समतल छत की माप ${Lr} m × ${B} m है। ${en(rain)} cm वर्षा के बाद छत का सारा पानी ${en(2 * rv)} m आधार व्यास वाले एक बेलनाकार बर्तन में चला जाता है। बर्तन में पानी की ऊँचाई (m में) ज्ञात कीजिए।`) + PIN + rnd(h, lang),
          answer: ansN(h, [[h * 100, L(`Convert ${en(rain)} cm to metres first.`, `पहले ${en(rain)} cm को मीटर में बदलिए।`)], [h / 4, L("Use the radius of the vessel, not its diameter.", "बर्तन की त्रिज्या लीजिए, व्यास नहीं।")]]),
          data: { given: [`${Lr}\\ \\mathrm{m} \\times ${B}\\ \\mathrm{m}`, `h_r = ${en(rain)}\\ \\mathrm{cm}`, `d = ${en(2 * rv)}\\ \\mathrm{m}`], find: ["h"] },
          hint: L("Volume of rainwater on the roof = volume of water in the vessel. Work in metres.", "छत पर वर्षा-जल का आयतन = बर्तन में पानी का आयतन। मीटर में गणना कीजिए।"),
          formula: R`l \cdot b \cdot h_r = \pi r^2 h`,
          solution: S(
            R`$V = ${Lr} \times ${B} \times ${en(rain / 100)} = ${en(vol)}\ \text{m}^3$`,
            R`$h = \dfrac{${en(vol)}}{\frac{22}{7} \times ${en(rv)}^2} ${eqs(h)} ${f2(h)}\ \text{m}$`,
          ),
        });
      }
      const Rs = r.int(2, 7), form = r.int(0, 1);
      const [rc, hc] = form ? [2 * Rs, Rs] : [Rs, 4 * Rs];
      return taskL(lang, {
        text: L(`A solid metallic cone of base radius ${rc} cm and height ${hc} cm is melted and recast into a solid sphere. Find the radius of the sphere (in cm).`, `${rc} cm आधार त्रिज्या और ${hc} cm ऊँचाई वाले धातु के एक ठोस शंकु को पिघलाकर एक ठोस गोला बनाया जाता है। गोले की त्रिज्या (cm में) ज्ञात कीजिए।`),
        answer: ansN(Rs, [[Math.cbrt(rc * rc * hc), L("Equate (4/3)πR³ with (1/3)πr²h: there is a factor 4 left.", "(4/3)πR³ को (1/3)πr²h के बराबर रखिए: 4 का गुणनखंड बचता है।")], [Math.sqrt((rc * rc * hc) / 4), L("Volume gives R³: take the cube root.", "आयतन से R³ मिलता है: घनमूल लीजिए।")]]),
        data: { given: [`r = ${rc}\\ \\mathrm{cm}`, `h = ${hc}\\ \\mathrm{cm}`], find: ["R"] },
        hint: L("Volume is unchanged: (4/3)πR³ = (1/3)πr²h.", "आयतन नहीं बदलता: (4/3)πR³ = (1/3)πr²h।"),
        formula: R`\dfrac{4}{3}\pi R^3 = \dfrac{1}{3}\pi r^2 h`,
        solution: S(
          R`$4R^3 = r^2 h = ${rc}^2 \times ${hc} = ${rc * rc * hc}$`,
          R`$R^3 = ${(rc * rc * hc) / 4} \Rightarrow R = ${Rs}\ \text{cm}$`,
        ),
      });
    },
  },
  // ───────────────────────── Statistics of grouped data ─────────────────────────
  {
    id: "exi-mat-grouped-mean",
    topics: [T("statistics-of-grouped-data")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      if (level === 1) {
        const h = r.pick([10, 10, 20]), lo = r.pick([0, 10, 20, 30]) * (h / 10);
        const f = [0, 1, 2, 3, 4].map(() => r.int(2, 12));
        const x = f.map((_, i) => lo + i * h + h / 2);
        const N = f.reduce((a, b) => a + b, 0), Sfx = f.reduce((s, fi, i) => s + fi * x[i], 0), m = Sfx / N;
        const Sfl = f.reduce((s, fi, i) => s + fi * (lo + i * h), 0);
        return taskL(lang, {
          text: L("Find the mean of the following frequency distribution by the direct method.", "प्रत्यक्ष विधि से निम्नलिखित बारंबारता बंटन का माध्य ज्ञात कीजिए।") + " " + tab(L, lo, h, f) + rnd(m, lang),
          answer: ansN(m, [
            [Sfx / f.length, L("Divide by the total frequency Σf, not by the number of classes.", "कुल बारंबारता Σf से भाग दीजिए, वर्गों की संख्या से नहीं।")],
            [Sfl / N, L("Use the class marks (mid-points), not the lower limits.", "वर्ग चिह्न (मध्य-बिंदु) लीजिए, निम्न सीमाएँ नहीं।")],
          ]),
          data: { given: [`f_i = ${f.join(", ")}`], find: [R`\bar{x}`] },
          hint: L("Find the class mark x of each class, then the products f·x.", "प्रत्येक वर्ग का वर्ग चिह्न x ज्ञात कीजिए, फिर गुणनफल f·x।"),
          formula: R`\bar{x} = \dfrac{\Sigma f_i x_i}{\Sigma f_i}`,
          solution: S(
            L("Class marks:", "वर्ग चिह्न:") + ` $x_i = ${x.join(", ")}$`,
            R`$\Sigma f_i = ${N}$, $\Sigma f_i x_i = ${f.map((fi, i) => `${fi} \\cdot ${x[i]}`).join(" + ")} = ${Sfx}$`,
            R`$\bar{x} = \dfrac{${Sfx}}{${N}} ${eqs(m)} ${f2(m)}$`,
          ),
        });
      }
      if (level === 2) {
        const k = r.int(5, 6), h = r.pick([20, 25, 50]), lo = r.pick([100, 150, 200, 500]);
        const f = Array.from({ length: k }, () => r.int(3, 20));
        const ctx = r.int(0, 2);
        const x = f.map((_, i) => lo + i * h + h / 2);
        const ai = Math.floor(k / 2), a = x[ai];
        const u = x.map((xi) => (xi - a) / h);
        const N = f.reduce((s, b) => s + b, 0), Sfu = f.reduce((s, fi, i) => s + fi * u[i], 0), m = a + (h * Sfu) / N;
        const what = [
          L("The table shows the daily wages (in ₹) of the workers of a factory. Find the mean daily wage (in ₹) by the step-deviation method.", "सारणी में एक कारखाने के श्रमिकों की दैनिक मज़दूरी (₹ में) दी गई है। पग-विचलन विधि से माध्य दैनिक मज़दूरी (₹ में) ज्ञात कीजिए।"),
          L("The table shows the monthly electricity bills (in ₹) of some households. Find the mean bill (in ₹) by the step-deviation method.", "सारणी में कुछ परिवारों के मासिक बिजली बिल (₹ में) दिए गए हैं। पग-विचलन विधि से माध्य बिल (₹ में) ज्ञात कीजिए।"),
          L("The table shows the daily sales (in ₹) of a shop over some days. Find the mean daily sale (in ₹) by the step-deviation method.", "सारणी में कुछ दिनों में एक दुकान की दैनिक बिक्री (₹ में) दी गई है। पग-विचलन विधि से माध्य दैनिक बिक्री (₹ में) ज्ञात कीजिए।"),
        ][ctx];
        return taskL(lang, {
          text: what + " " + tab(L, lo, h, f) + rnd(m, lang),
          answer: ansN(m, [
            [a + Sfu / N, L("In the step-deviation method multiply Σfu/Σf by the class size h.", "पग-विचलन विधि में Σfu/Σf को वर्ग माप h से गुणा कीजिए।")],
            [(h * Sfu) / N, L("Add the assumed mean a to h·Σfu/Σf.", "h·Σfu/Σf में कल्पित माध्य a जोड़िए।")],
          ]),
          data: { given: [`f_i = ${f.join(", ")}`], find: [R`\bar{x}`] },
          hint: L("Take a class mark in the middle as the assumed mean a and compute u = (x − a)/h.", "बीच के किसी वर्ग चिह्न को कल्पित माध्य a लीजिए और u = (x − a)/h ज्ञात कीजिए।"),
          formula: R`\bar{x} = a + h \cdot \dfrac{\Sigma f_i u_i}{\Sigma f_i},\quad u_i = \dfrac{x_i - a}{h}`,
          solution: S(
            L("Class marks:", "वर्ग चिह्न:") + ` $x_i = ${x.join(", ")}$`,
            R`$a = ${a}$, $h = ${h}$, $u_i = ${u.join(", ")}$`,
            R`$\Sigma f_i = ${N}$, $\Sigma f_i u_i = ${Sfu}$`,
            R`$\bar{x} = ${a} + ${h} \times \dfrac{${Sfu}}{${N}} ${eqs(m)} ${f2(m)}$`,
          ),
        });
      }
      let h, lo, f, p, j, N, x, Sx, m;
      do {
        h = r.pick([10, 20]); lo = r.pick([0, 10, 20]) * (h / 10); N = r.pick([20, 25, 50]); p = r.int(3, 12); j = r.int(0, 4);
        f = [0, 1, 2, 3, 4].map(() => r.int(1, 12));
        f[j] = p;
        const lastI = j === 4 ? 3 : 4;
        f[lastI] = 0;
        f[lastI] = N - f.reduce((s, b) => s + b, 0);
        x = f.map((_, i) => lo + i * h + h / 2);
        Sx = f.reduce((s, fi, i) => s + fi * x[i], 0);
        m = Sx / N;
      } while (f.some((v) => v < 1 || v > 15) || Math.abs(m - x[j]) < 1e-9);
      const N1 = N - p, S1 = Sx - p * x[j];
      const fl = f.map((v, i) => (i === j ? "p" : v));
      return taskL(lang, {
        text: L(`The mean of the following distribution is ${f2(m)}. Find the missing frequency p.`, `निम्नलिखित बंटन का माध्य ${f2(m)} है। लुप्त बारंबारता p ज्ञात कीजिए।`) + " " + tab(L, lo, h, fl),
        answer: numM(p, null, [
          [(m * N1 - S1) / x[j], L("p also appears in Σf: the denominator is (known total + p).", "p, Σf में भी आता है: हर (ज्ञात योग + p) होता है।")],
          [(S1 - m * N1) / (m + x[j]), L("Collect the p-terms on one side carefully: m·p − x·p.", "p वाले पदों को सावधानी से एक ओर लाइए: m·p − x·p।")],
        ]),
        data: { given: [R`\bar{x} = ${f2(m)}`], find: ["p"] },
        hint: L("Write Σf and Σfx with p in them, then use mean = Σfx / Σf.", "Σf और Σfx को p सहित लिखिए, फिर माध्य = Σfx / Σf लगाइए।"),
        formula: R`\bar{x} = \dfrac{\Sigma f_i x_i}{\Sigma f_i}`,
        solution: S(
          L("Class marks:", "वर्ग चिह्न:") + ` $x_i = ${x.join(", ")}$`,
          R`$\Sigma f_i = ${N1} + p$, $\Sigma f_i x_i = ${S1} + ${x[j]}p$`,
          R`$${f2(m)}(${N1} + p) = ${S1} + ${x[j]}p$`,
          R`$${en(r2(m * N1))} + ${f2(m)}p = ${S1} + ${x[j]}p \Rightarrow p = \dfrac{${en(r2(S1 - m * N1))}}{${en(r2(m - x[j]))}} = ${p}$`,
        ),
      });
    },
  },
  {
    id: "exi-mat-grouped-median-mode",
    topics: [T("statistics-of-grouped-data")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const uni = (k) => {
        const pk = r.int(1, k - 2);
        const f = Array.from({ length: k }, () => r.int(2, 14));
        f[pk] = Math.max(...f.filter((_, i) => i !== pk)) + r.int(1, 6);
        return [f, pk];
      };
      const cumul = (f) => f.reduce((a, v) => [...a, (a.at(-1) || 0) + v], []);
      if (level === 1) {
        const v = r.int(0, 2);
        if (v === 0) {
          const mean = r.dec(20, 80, 1), med = r2(mean + r.pick([-1, 1]) * r.dec(0.5, 5, 1));
          const askMode = r.int(0, 2) > 0;
          const mode = r2(3 * med - 2 * mean);
          const mean2 = r2(r.dec(20, 80, 1)), mode2 = r2(mean2 + r.pick([-3, 3]) * r.dec(0.4, 3, 1)), med2 = (mode2 + 2 * mean2) / 3;
          if (askMode) {
            return taskL(lang, {
              text: L(`For a moderately skewed distribution, the mean is ${en(mean)} and the median is ${en(med)}. Using the empirical relationship between mean, median and mode, find the mode.`, `एक मध्यम रूप से विषम बंटन का माध्य ${en(mean)} और माध्यक ${en(med)} है। माध्य, माध्यक और बहुलक के बीच के आनुभविक संबंध का प्रयोग करके बहुलक ज्ञात कीजिए।`),
              answer: ansN(mode, [[3 * mean - 2 * med, L("The relation is 3 Median = Mode + 2 Mean; the 3 goes with the median.", "संबंध 3 माध्यक = बहुलक + 2 माध्य है; 3 माध्यक के साथ आता है।")], [(3 * med + 2 * mean) / 1, L("Mode = 3 Median − 2 Mean: subtract.", "बहुलक = 3 माध्यक − 2 माध्य: घटाइए।")]]),
              data: { given: [R`\bar{x} = ${en(mean)}`, R`M_e = ${en(med)}`], find: [R`M_o`] },
              hint: L("Use 3 Median = Mode + 2 Mean.", "3 माध्यक = बहुलक + 2 माध्य का प्रयोग कीजिए।"),
              formula: R`3\,M_e = M_o + 2\,\bar{x}`,
              solution: S(L("From the empirical relationship:", "आनुभविक संबंध से:"), R`$M_o = 3 \times ${en(med)} - 2 \times ${en(mean)} = ${en(r2(3 * med))} - ${en(r2(2 * mean))} = ${en(mode)}$`),
            });
          }
          return taskL(lang, {
            text: L(`For a moderately skewed distribution, the mode is ${en(mode2)} and the mean is ${en(mean2)}. Using the empirical relationship, find the median.`, `एक मध्यम रूप से विषम बंटन का बहुलक ${en(mode2)} और माध्य ${en(mean2)} है। आनुभविक संबंध का प्रयोग करके माध्यक ज्ञात कीजिए।`) + rnd(med2, lang),
            answer: ansN(med2, [[(mode2 + mean2) / 2, L("The median is not the average of mode and mean; use 3 Median = Mode + 2 Mean.", "माध्यक, बहुलक और माध्य का औसत नहीं है; 3 माध्यक = बहुलक + 2 माध्य लगाइए।")], [3 * mode2 - 2 * mean2, L("Solve 3 Median = Mode + 2 Mean for the median.", "3 माध्यक = बहुलक + 2 माध्य को माध्यक के लिए हल कीजिए।")]]),
            data: { given: [R`M_o = ${en(mode2)}`, R`\bar{x} = ${en(mean2)}`], find: [R`M_e`] },
            hint: L("Use 3 Median = Mode + 2 Mean.", "3 माध्यक = बहुलक + 2 माध्य का प्रयोग कीजिए।"),
            formula: R`3\,M_e = M_o + 2\,\bar{x}`,
            solution: S(L("From the empirical relationship:", "आनुभविक संबंध से:"), R`$M_e = \dfrac{${en(mode2)} + 2 \times ${en(mean2)}}{3} = \dfrac{${en(r2(mode2 + 2 * mean2))}}{3} ${eqs(med2)} ${f2(med2)}$`),
          });
        }
        const h = r.pick([10, 20, 5]), lo = r.pick([0, 10, 20, 40]);
        const [f, pk] = uni(6);
        const cf = cumul(f), N = cf.at(-1);
        if (v === 1) {
          return taskL(lang, {
            text: L("Find the lower limit of the modal class of the following distribution.", "निम्नलिखित बंटन के बहुलक वर्ग की निम्न सीमा ज्ञात कीजिए।") + " " + tab(L, lo, h, f),
            answer: numM(lo + pk * h, null, [[f[pk], L("That is the highest frequency; the question asks for the class limit.", "यह सबसे बड़ी बारंबारता है; प्रश्न वर्ग सीमा पूछता है।")], [lo + (pk + 1) * h, L("That is the upper limit of the modal class.", "यह बहुलक वर्ग की उपरि सीमा है।")]]),
            data: { given: [R`f_{\max} = ${f[pk]}`], find: ["l"] },
            hint: L("The modal class is the class with the highest frequency.", "बहुलक वर्ग वह वर्ग है जिसकी बारंबारता सबसे अधिक है।"),
            formula: L(R`\text{modal class: } f = f_{\max}`, R`\text{बहुलक वर्ग: } f = f_{\max}`),
            solution: S(L(`The highest frequency is ${f[pk]}.`, `सबसे बड़ी बारंबारता ${f[pk]} है।`), L(`Modal class: ${lo + pk * h}–${lo + (pk + 1) * h}, lower limit l = ${lo + pk * h}.`, `बहुलक वर्ग: ${lo + pk * h}–${lo + (pk + 1) * h}, निम्न सीमा l = ${lo + pk * h}।`)),
          });
        }
        const mi = cf.findIndex((c) => c > N / 2);
        return taskL(lang, {
          text: L("Find the lower limit of the median class of the following distribution.", "निम्नलिखित बंटन के माध्यक वर्ग की निम्न सीमा ज्ञात कीजिए।") + " " + tab(L, lo, h, f),
          answer: numM(lo + mi * h, null, [[lo + pk * h, L("That is the modal class. The median class contains the (N/2)-th observation.", "यह बहुलक वर्ग है। माध्यक वर्ग में (N/2)-वाँ प्रेक्षण होता है।")], [lo + (mi + 1) * h, L("That is the upper limit of the median class.", "यह माध्यक वर्ग की उपरि सीमा है।")], [N / 2, L("N/2 tells you which class to choose; the answer is that class's lower limit.", "N/2 से पता चलता है कि कौन-सा वर्ग चुनना है; उत्तर उस वर्ग की निम्न सीमा है।")]]),
          data: { given: [`f_i = ${f.join(", ")}`], find: ["l"] },
          hint: L("Make the cumulative frequency column and find the first class whose cumulative frequency is greater than N/2.", "संचयी बारंबारता स्तंभ बनाइए और वह पहला वर्ग ढूँढिए जिसकी संचयी बारंबारता N/2 से अधिक है।"),
          formula: R`\dfrac{N}{2}`,
          solution: S(R`$N = ${N}$, $\dfrac{N}{2} = ${en(N / 2)}$`, L("Cumulative frequencies:", "संचयी बारंबारताएँ:") + ` $${cf.join(", ")}$`, L(`The first cumulative frequency greater than ${en(N / 2)} is ${cf[mi]}, so the median class is ${lo + mi * h}–${lo + (mi + 1) * h}; l = ${lo + mi * h}.`, `${en(N / 2)} से बड़ी पहली संचयी बारंबारता ${cf[mi]} है, अतः माध्यक वर्ग ${lo + mi * h}–${lo + (mi + 1) * h} है; l = ${lo + mi * h}।`)),
        });
      }
      if (level === 2) {
        const h = r.pick([10, 20, 5, 10]), lo = r.pick([0, 10, 20, 30, 40]);
        const k = r.int(5, 6);
        const [f, pk] = uni(k);
        const l = lo + pk * h, f1 = f[pk], f0 = f[pk - 1], f2v = f[pk + 1];
        const mode = l + ((f1 - f0) / (2 * f1 - f0 - f2v)) * h;
        const ctx = r.int(0, 2);
        const intro = [
          L("The table shows the marks obtained by students of a class in a test. Find the mode of the data.", "सारणी में एक कक्षा के विद्यार्थियों द्वारा एक परीक्षा में प्राप्त अंक दिए गए हैं। आँकड़ों का बहुलक ज्ञात कीजिए।"),
          L("The table shows the ages (in years) of patients admitted to a hospital in a week. Find the mode of the data.", "सारणी में एक सप्ताह में एक अस्पताल में भर्ती मरीज़ों की आयु (वर्षों में) दी गई है। आँकड़ों का बहुलक ज्ञात कीजिए।"),
          L("Find the mode of the following frequency distribution.", "निम्नलिखित बारंबारता बंटन का बहुलक ज्ञात कीजिए।"),
        ][ctx];
        return taskL(lang, {
          text: intro + " " + tab(L, lo, h, f) + rnd(mode, lang),
          answer: ansN(mode, [
            [l + (f1 - f0) / (2 * f1 - f0 - f2v), L("Multiply the fraction by the class size h.", "भिन्न को वर्ग माप h से गुणा कीजिए।")],
            [l + ((f1 - f2v) / (2 * f1 - f0 - f2v)) * h, L("The numerator is f₁ − f₀, using the class before the modal class.", "अंश f₁ − f₀ है, जिसमें बहुलक वर्ग से पहले वाले वर्ग की बारंबारता लगती है।")],
            [l + ((f1 - f0) / (2 * f1 - f0 + f2v)) * h, L("The denominator is 2f₁ − f₀ − f₂: both neighbouring frequencies are subtracted.", "हर 2f₁ − f₀ − f₂ है: दोनों पड़ोसी बारंबारताएँ घटाई जाती हैं।")],
          ]),
          data: { given: [`l = ${l}`, `f_1 = ${f1}`, `f_0 = ${f0}`, `f_2 = ${f2v}`], find: [R`M_o`] },
          hint: L("Find the modal class (highest frequency) and the frequencies of the classes just before and after it.", "बहुलक वर्ग (सबसे अधिक बारंबारता) और उसके ठीक पहले व ठीक बाद वाले वर्गों की बारंबारताएँ ज्ञात कीजिए।"),
          formula: R`M_o = l + \dfrac{f_1 - f_0}{2f_1 - f_0 - f_2} \times h`,
          solution: S(
            L(`Modal class: ${l}–${l + h}`, `बहुलक वर्ग: ${l}–${l + h}`) + R`, $l = ${l}$, $f_1 = ${f1}$, $f_0 = ${f0}$, $f_2 = ${f2v}$, $h = ${h}$`,
            R`$M_o = ${l} + \dfrac{${f1} - ${f0}}{2 \times ${f1} - ${f0} - ${f2v}} \times ${h} = ${l} + \dfrac{${(f1 - f0) * h}}{${2 * f1 - f0 - f2v}}$`,
            R`$M_o ${eqs(mode)} ${f2(mode)}$`,
          ),
        });
      }
      if (r.int(0, 1) === 0) {
        let f, cf, N, mi, h, lo;
        do {
          h = r.pick([10, 20, 5]); lo = r.pick([0, 10, 20, 100, 150]);
          f = Array.from({ length: 6 }, () => r.int(2, 18));
          cf = cumul(f); N = cf.at(-1); mi = cf.findIndex((c) => c >= N / 2);
        } while (cf.some((c) => c === N / 2) || mi === 0);
        const l = lo + mi * h, c = cf[mi - 1], fm = f[mi];
        const med = l + ((N / 2 - c) / fm) * h;
        return taskL(lang, {
          text: L("Find the median of the following frequency distribution.", "निम्नलिखित बारंबारता बंटन का माध्यक ज्ञात कीजिए।") + " " + tab(L, lo, h, f) + rnd(med, lang),
          answer: ansN(med, [
            [l + ((N / 2 - cf[mi]) / fm) * h, L("cf is the cumulative frequency of the class before the median class.", "cf माध्यक वर्ग से पहले वाले वर्ग की संचयी बारंबारता है।")],
            [l + ((N - c) / fm) * h, L("Use N/2, not N.", "N/2 लीजिए, N नहीं।")],
            [l + (N / 2 - c) / fm, L("Multiply the fraction by the class size h.", "भिन्न को वर्ग माप h से गुणा कीजिए।")],
          ]),
          data: { given: [`f_i = ${f.join(", ")}`], find: [R`M_e`] },
          hint: L("Make the cumulative frequency column and locate the class containing the (N/2)-th observation.", "संचयी बारंबारता स्तंभ बनाइए और (N/2)-वें प्रेक्षण वाला वर्ग ढूँढिए।"),
          formula: R`M_e = l + \dfrac{\frac{N}{2} - cf}{f} \times h`,
          solution: S(
            L("Cumulative frequencies:", "संचयी बारंबारताएँ:") + ` $${cf.join(", ")}$`,
            R`$\dfrac{N}{2} = ${en(N / 2)}$` + L(`, so the median class is ${l}–${l + h}.`, `, अतः माध्यक वर्ग ${l}–${l + h} है।`),
            R`$M_e = ${l} + \dfrac{${en(N / 2)} - ${c}}{${fm}} \times ${h} ${eqs(med)} ${f2(med)}$`,
          ),
        });
      }
      let f, N, mi, j, jy, c, med, xv;
      const h = 10, lo = r.pick([0, 10, 20]);
      do {
        mi = r.int(2, 3);
        f = Array.from({ length: 6 }, () => r.int(2, 14));
        f[mi] = r.pick([4, 5, 8, 10, 20]);
        j = r.int(0, mi - 1); jy = r.int(mi + 1, 5);
        N = f.reduce((a, b) => a + b, 0);
        const cf = cumul(f);
        c = cf[mi - 1];
        med = lo + mi * h + ((N / 2 - c) / f[mi]) * h;
        xv = f[j];
      } while (N % 2 || !(c < N / 2 && N / 2 < c + f[mi]));
      const fl = f.map((v, i) => (i === j ? "x" : i === jy ? "y" : v));
      const l = lo + mi * h, cOther = c - xv;
      return taskL(lang, {
        text: L(`The median of the following distribution is ${f2(med)} and the total frequency is ${N}. Find the missing frequency x.`, `निम्नलिखित बंटन का माध्यक ${f2(med)} है और कुल बारंबारता ${N} है। लुप्त बारंबारता x ज्ञात कीजिए।`) + " " + tab(L, lo, h, fl),
        answer: numM(xv, null, [
          [f[jy], L("That is y. Use the median formula, where x sits in the cumulative frequency cf.", "यह y है। माध्यक सूत्र लगाइए, जिसमें x संचयी बारंबारता cf में आता है।")],
          [N / 2 - cOther, L("The (N/2 − cf)/f · h part is not zero here: the median is not the lower limit.", "यहाँ (N/2 − cf)/f · h वाला भाग शून्य नहीं है: माध्यक निम्न सीमा के बराबर नहीं है।")],
        ]),
        data: { given: [R`M_e = ${f2(med)}`, `N = ${N}`], find: ["x"] },
        hint: L("The median lies in the class that contains it; there cf = (known frequencies before it) + x.", "माध्यक जिस वर्ग में है वही माध्यक वर्ग है; वहाँ cf = (उससे पहले की ज्ञात बारंबारताएँ) + x।"),
        formula: R`M_e = l + \dfrac{\frac{N}{2} - cf}{f} \times h`,
        solution: S(
          L(`The median ${f2(med)} lies in the class ${l}–${l + h}, so l = ${l}, f = ${f[mi]}.`, `माध्यक ${f2(med)} वर्ग ${l}–${l + h} में है, अतः l = ${l}, f = ${f[mi]}।`),
          R`$cf = ${cOther} + x$`,
          R`$${f2(med)} = ${l} + \dfrac{${N / 2} - (${cOther} + x)}{${f[mi]}} \times ${h}$`,
          R`$${en(r2(((med - l) * f[mi]) / h))} = ${N / 2 - cOther} - x \Rightarrow x = ${xv}$`,
        ),
      });
    },
  },
  // ───────────────────────── Commercial mathematics (ICSE) ─────────────────────────
  {
    id: "exi-mat-gst",
    topics: [T("commercial-mathematics")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const ITEMS = [["laptop", "लैपटॉप"], ["washing machine", "वॉशिंग मशीन"], ["mobile phone", "मोबाइल फ़ोन"], ["air conditioner", "एयर कंडीशनर"], ["bicycle", "साइकिल"], ["television set", "टेलीविज़न सेट"]];
      const INTRA = [["Pune", "Mumbai", "Maharashtra", "पुणे", "मुंबई", "महाराष्ट्र"], ["Lucknow", "Kanpur", "Uttar Pradesh", "लखनऊ", "कानपुर", "उत्तर प्रदेश"], ["Jaipur", "Udaipur", "Rajasthan", "जयपुर", "उदयपुर", "राजस्थान"], ["Chennai", "Madurai", "Tamil Nadu", "चेन्नई", "मदुरै", "तमिलनाडु"]];
      const INTER = [["Delhi", "Jaipur", "Rajasthan", "दिल्ली", "जयपुर", "राजस्थान"], ["Chennai", "Bengaluru", "Karnataka", "चेन्नई", "बेंगलुरु", "कर्नाटक"], ["Kolkata", "Patna", "Bihar", "कोलकाता", "पटना", "बिहार"], ["Mumbai", "Ahmedabad", "Gujarat", "मुंबई", "अहमदाबाद", "गुजरात"]];
      const it = r.pick(ITEMS), pl = r.pick(INTRA), px = r.pick(INTER);
      const g = r.pick([5, 12, 18, 28]);
      const item = L(it[0], it[1]);
      const [c1, c2, st] = [L(pl[0], pl[3]), L(pl[1], pl[4]), L(pl[2], pl[5])];
      const [x1, x2, xs] = [L(px[0], px[3]), L(px[1], px[4]), L(px[2], px[5])];
      const RULE = L("Within a state GST is split equally into CGST and SGST; between states the whole GST is charged as IGST.", "एक ही राज्य में GST, CGST और SGST में बराबर बँटता है; दो राज्यों के बीच पूरा GST, IGST के रूप में लगता है।");
      if (level === 1) {
        const P = 100 * r.int(25, 600);
        const v = r.int(0, 2);
        if (v < 2) {
          const askC = v === 0;
          const C = (P * g) / 200, tot = P + (P * g) / 100;
          return taskL(lang, {
            text: L(`A shopkeeper in ${c1} sells a ${item} to a customer in ${c2} (both in ${st}) for ₹${P}. The GST rate is ${g}%. Find ${askC ? "the CGST charged" : "the total amount paid by the customer"} (in ₹).`, `${c1} का एक दुकानदार ${c2} के एक ग्राहक को (दोनों ${st} में) एक ${item} ₹${P} में बेचता है। GST की दर ${g}% है। ${askC ? "ग्राहक से लिया गया CGST" : "ग्राहक द्वारा चुकाई गई कुल राशि"} (₹ में) ज्ञात कीजिए।`),
            answer: askC
              ? ansN(C, [[(P * g) / 100, L("Within a state, CGST is only half of the GST.", "एक ही राज्य में CGST, GST का केवल आधा होता है।")], [P + C, L("Only the tax is asked, not the price plus tax.", "केवल कर पूछा गया है, मूल्य + कर नहीं।")]])
              : ansN(tot, [[P + C, L("Add both CGST and SGST.", "CGST और SGST दोनों जोड़िए।")], [(P * g) / 100, L("Add the tax to the price.", "कर को मूल्य में जोड़िए।")]]),
            data: { given: [R`P = \text{₹}${P}`, `\\text{GST} = ${g}\\%`], find: [askC ? R`\text{CGST}` : L(R`\text{amount}`, R`\text{कुल राशि}`)] },
            hint: RULE,
            formula: R`\text{CGST} = \text{SGST} = \dfrac{\text{GST rate}}{2} \times P`,
            solution: S(
              L(`Intra-state sale: CGST = SGST = ${en(g / 2)}%.`, `राज्य के अंदर बिक्री: CGST = SGST = ${en(g / 2)}%।`),
              R`$\text{CGST} = \text{SGST} = \dfrac{${en(g / 2)}}{100} \times ${P} = ${f2(C)}$`,
              askC ? L(`CGST = ₹${f2(C)}`, `CGST = ₹${f2(C)}`) : R`$\text{${L("amount", "कुल राशि")}} = ${P} + ${f2(C)} + ${f2(C)} = \text{₹}\,${f2(tot)}$`,
            ),
          });
        }
        const I = (P * g) / 100;
        return taskL(lang, {
          text: L(`A dealer in ${x1} sells goods worth ₹${P} to a dealer in ${x2} (${xs}). The GST rate is ${g}%. Find the IGST charged (in ₹).`, `${x1} का एक व्यापारी ${x2} (${xs}) के एक व्यापारी को ₹${P} का सामान बेचता है। GST की दर ${g}% है। लिया गया IGST (₹ में) ज्ञात कीजिए।`),
          answer: ansN(I, [[I / 2, L("Between two states the whole GST is IGST; it is not split.", "दो राज्यों के बीच पूरा GST, IGST होता है; यह बँटता नहीं।")], [P + I, L("Only the tax is asked.", "केवल कर पूछा गया है।")]]),
          data: { given: [R`P = \text{₹}${P}`, `\\text{GST} = ${g}\\%`], find: [R`\text{IGST}`] },
          hint: RULE,
          formula: R`\text{IGST} = \text{GST rate} \times P`,
          solution: S(L("Inter-state sale, so the whole GST is IGST:", "अंतर-राज्यीय बिक्री है, अतः पूरा GST, IGST है:"), R`$\text{IGST} = \dfrac{${g}}{100} \times ${P} = \text{₹}\,${f2(I)}$`),
        });
      }
      if (level === 2) {
        const v = r.int(0, 2);
        const M = 100 * r.int(20, 400), d = r.pick([5, 10, 15, 20, 25]);
        const SP = M * (1 - d / 100);
        if (v === 0) {
          const amt = SP * (1 + g / 100);
          return taskL(lang, {
            text: L(`The marked price of a ${item} is ₹${M}. The shopkeeper gives a discount of ${d}%, and GST at ${g}% is charged on the reduced price. How much does the customer pay (in ₹)?`, `एक ${item} का अंकित मूल्य ₹${M} है। दुकानदार ${d}% की छूट देता है और घटे हुए मूल्य पर ${g}% की दर से GST लगता है। ग्राहक कितनी राशि (₹ में) चुकाता है?`),
            answer: ansN(amt, [[M * (1 + g / 100) - (M * d) / 100, L("GST is charged on the price after the discount.", "GST छूट के बाद वाले मूल्य पर लगता है।")], [M * (1 - d / 100 + g / 100), L("Apply the discount first, then GST on the new price; the percentages do not simply add.", "पहले छूट लगाइए, फिर नए मूल्य पर GST; प्रतिशत सीधे नहीं जुड़ते।")]]),
            data: { given: [R`M = \text{₹}${M}`, `d = ${d}\\%`, `\\text{GST} = ${g}\\%`], find: [L(R`\text{amount}`, R`\text{कुल राशि}`)] },
            hint: L("First find the selling price after the discount, then add GST on it.", "पहले छूट के बाद विक्रय मूल्य ज्ञात कीजिए, फिर उस पर GST जोड़िए।"),
            formula: R`A = M\left(1 - \dfrac{d}{100}\right)\left(1 + \dfrac{g}{100}\right)`,
            solution: S(R`$SP = ${M} - \dfrac{${d}}{100} \times ${M} = ${f2(SP)}$`, R`$\text{GST} = \dfrac{${g}}{100} \times ${f2(SP)} = ${f2((SP * g) / 100)}$`, R`$A = ${f2(SP)} + ${f2((SP * g) / 100)} = \text{₹}\,${f2(amt)}$`),
          });
        }
        if (v === 1) {
          const Pb = 100 * r.int(10, 300), A = Pb * (1 + g / 100);
          return taskL(lang, {
            text: L(`A customer pays ₹${f2(A)} for a ${item}, including GST at ${g}%. Find the price of the ${item} before GST (in ₹).`, `एक ग्राहक ${g}% GST सहित एक ${item} के लिए ₹${f2(A)} चुकाता है। GST से पहले ${item} का मूल्य (₹ में) ज्ञात कीजिए।`),
            answer: ansN(Pb, [[A * (1 - g / 100), L(`GST was ${g}% of the price before tax, not of the final amount; divide by ${en(1 + g / 100)}.`, `GST कर-पूर्व मूल्य का ${g}% था, अंतिम राशि का नहीं; ${en(1 + g / 100)} से भाग दीजिए।`)], [A - (A * g) / 100, L("Taking g% of the final amount removes too much.", "अंतिम राशि का g% घटाने से अधिक घट जाता है।")]]),
            data: { given: [R`A = \text{₹}${f2(A)}`, `\\text{GST} = ${g}\\%`], find: ["P"] },
            hint: L(`The amount paid is (100 + ${g})% of the price before GST.`, `चुकाई गई राशि GST से पहले के मूल्य का (100 + ${g})% है।`),
            formula: R`P = \dfrac{100 \times A}{100 + g}`,
            solution: S(R`$P \times \dfrac{${100 + g}}{100} = ${f2(A)}$`, R`$P = \dfrac{100 \times ${f2(A)}}{${100 + g}} = \text{₹}\,${Pb}$`),
          });
        }
        const C = (SP * g) / 200;
        return taskL(lang, {
          text: L(`A shop in ${c1} sells a ${item} with marked price ₹${M} to a customer in ${c2} (both in ${st}) at a discount of ${d}%. The GST rate is ${g}%. Find the SGST paid by the customer (in ₹).`, `${c1} की एक दुकान ${c2} के एक ग्राहक को (दोनों ${st} में) एक ${item} ${d}% छूट पर बेचती है, जिसका अंकित मूल्य ₹${M} है। GST की दर ${g}% है। ग्राहक द्वारा चुकाया गया SGST (₹ में) ज्ञात कीजिए।`),
          answer: ansN(C, [[(M * g) / 200, L("Tax is charged on the discounted price.", "कर छूट के बाद वाले मूल्य पर लगता है।")], [(SP * g) / 100, L("SGST is half of the GST for an intra-state sale.", "राज्य के अंदर बिक्री में SGST, GST का आधा होता है।")]]),
          data: { given: [R`M = \text{₹}${M}`, `d = ${d}\\%`, `\\text{GST} = ${g}\\%`], find: [R`\text{SGST}`] },
          hint: L("Find the discounted price, then take half the GST rate on it.", "छूट के बाद मूल्य ज्ञात कीजिए, फिर उस पर GST की आधी दर लगाइए।"),
          formula: R`\text{SGST} = \dfrac{g}{2} \% \times SP`,
          solution: S(R`$SP = ${M} \times \dfrac{${100 - d}}{100} = ${f2(SP)}$`, L(`SGST rate = ${en(g / 2)}%.`, `SGST की दर = ${en(g / 2)}%।`), R`$\text{SGST} = \dfrac{${en(g / 2)}}{100} \times ${f2(SP)} = \text{₹}\,${f2(C)}$`),
        });
      }
      const v = r.int(0, 2);
      const P1 = 100 * r.int(20, 300), P2 = P1 + 100 * r.int(2, 60);
      if (v === 0) {
        const askS = r.int(0, 1) === 0;
        const net = (g * (P2 - P1)) / 100, ans = askS ? net / 2 : net;
        return taskL(lang, {
          text: L(`A wholesaler in ${c1} sells a ${item} to a retailer in ${c2} for ₹${P1}. The retailer sells it to a customer in ${c2} for ₹${P2}. Both are in ${st} and the GST rate is ${g}%. Find the ${askS ? "SGST" : "total GST (CGST + SGST)"} paid by the retailer to the government (in ₹).`, `${c1} का एक थोक व्यापारी ${c2} के एक फुटकर व्यापारी को एक ${item} ₹${P1} में बेचता है। फुटकर व्यापारी इसे ${c2} के एक ग्राहक को ₹${P2} में बेचता है। दोनों ${st} में हैं और GST की दर ${g}% है। फुटकर व्यापारी द्वारा सरकार को चुकाया गया ${askS ? "SGST" : "कुल GST (CGST + SGST)"} (₹ में) ज्ञात कीजिए।`),
          answer: ansN(ans, [[askS ? (g * P2) / 200 : (g * P2) / 100, L("The retailer gets input tax credit for the GST already paid on the purchase.", "फुटकर व्यापारी को खरीद पर चुकाए गए GST का इनपुट टैक्स क्रेडिट मिलता है।")], [askS ? net : net / 2, askS ? L("SGST is half of the net GST.", "SGST, शुद्ध GST का आधा है।") : L("Add both CGST and SGST.", "CGST और SGST दोनों जोड़िए।")]]),
          data: { given: [R`P_1 = \text{₹}${P1}`, R`P_2 = \text{₹}${P2}`, `\\text{GST} = ${g}\\%`], find: [askS ? R`\text{SGST}` : R`\text{GST}`] },
          hint: L("GST payable = tax on the sale − tax already paid on the purchase (input tax credit).", "देय GST = बिक्री पर कर − खरीद पर पहले चुकाया कर (इनपुट टैक्स क्रेडिट)।"),
          formula: R`\text{GST payable} = \text{output tax} - \text{input tax}`,
          solution: S(
            R`$\text{${L("output tax", "बिक्री पर कर")}} = \dfrac{${g}}{100} \times ${P2} = ${f2((g * P2) / 100)}$`,
            R`$\text{${L("input tax", "खरीद पर कर")}} = \dfrac{${g}}{100} \times ${P1} = ${f2((g * P1) / 100)}$`,
            R`$\text{GST} = ${f2((g * P2) / 100)} - ${f2((g * P1) / 100)} = ${f2(net)}$`,
            askS ? L(`SGST = half of it = ₹${f2(ans)}`, `SGST = इसका आधा = ₹${f2(ans)}`) : L(`Total GST paid = ₹${f2(ans)}`, `चुकाया गया कुल GST = ₹${f2(ans)}`),
          ),
        });
      }
      if (v === 1) {
        const net = (g * (P2 - P1)) / 100;
        return taskL(lang, {
          text: L(`A dealer in ${x1} sells a ${item} to a dealer in ${x2} (${xs}) for ₹${P1}. The second dealer sells it to a customer in ${x2} for ₹${P2}. The GST rate is ${g}%. Find the net GST paid to the government by the dealer in ${x2} (in ₹).`, `${x1} का एक व्यापारी ${x2} (${xs}) के एक व्यापारी को एक ${item} ₹${P1} में बेचता है। दूसरा व्यापारी इसे ${x2} के एक ग्राहक को ₹${P2} में बेचता है। GST की दर ${g}% है। ${x2} के व्यापारी द्वारा सरकार को चुकाया गया शुद्ध GST (₹ में) ज्ञात कीजिए।`),
          answer: ansN(net, [[(g * P2) / 100, L("The IGST paid on the purchase is available as input tax credit.", "खरीद पर चुकाया गया IGST इनपुट टैक्स क्रेडिट के रूप में मिलता है।")], [net / 2, L("Net GST is CGST + SGST together.", "शुद्ध GST, CGST + SGST दोनों मिलाकर है।")]]),
          data: { given: [R`P_1 = \text{₹}${P1}`, R`P_2 = \text{₹}${P2}`, `\\text{GST} = ${g}\\%`], find: [R`\text{GST}`] },
          hint: L("The purchase is inter-state (IGST), the sale is intra-state (CGST + SGST). Subtract the input tax.", "खरीद अंतर-राज्यीय (IGST) है, बिक्री राज्य के अंदर (CGST + SGST)। इनपुट कर घटाइए।"),
          formula: R`\text{GST payable} = \text{output tax} - \text{input tax}`,
          solution: S(
            R`$\text{IGST (input)} = \dfrac{${g}}{100} \times ${P1} = ${f2((g * P1) / 100)}$`,
            R`$\text{CGST} + \text{SGST (output)} = \dfrac{${g}}{100} \times ${P2} = ${f2((g * P2) / 100)}$`,
            R`$\text{${L("net GST", "शुद्ध GST")}} = ${f2((g * P2) / 100)} - ${f2((g * P1) / 100)} = \text{₹}\,${f2(net)}$`,
          ),
        });
      }
      const P3 = P2 + 100 * r.int(2, 40);
      const tot = (g * P3) / 100;
      return taskL(lang, {
        text: L(`A manufacturer sells a ${item} to a wholesaler for ₹${P1}, the wholesaler sells it to a retailer for ₹${P2}, and the retailer sells it to a customer for ₹${P3}, all within ${st}. The GST rate is ${g}%. Find the total GST received by the government (in ₹).`, `एक निर्माता एक ${item} थोक व्यापारी को ₹${P1} में, थोक व्यापारी फुटकर व्यापारी को ₹${P2} में और फुटकर व्यापारी ग्राहक को ₹${P3} में बेचता है; सभी ${st} में हैं। GST की दर ${g}% है। सरकार को मिला कुल GST (₹ में) ज्ञात कीजिए।`),
        answer: ansN(tot, [[(g * (P1 + P2 + P3)) / 100, L("With input tax credit each dealer pays only on the value added; the taxes are not counted three times.", "इनपुट टैक्स क्रेडिट से हर व्यापारी केवल बढ़ाए गए मूल्य पर कर देता है; कर तीन बार नहीं गिने जाते।")], [(g * (P3 - P1)) / 100, L("The manufacturer's GST on the first sale is also received by the government.", "पहली बिक्री पर निर्माता का GST भी सरकार को मिलता है।")]]),
        data: { given: [R`P_1 = \text{₹}${P1}`, R`P_2 = \text{₹}${P2}`, R`P_3 = \text{₹}${P3}`, `\\text{GST} = ${g}\\%`], find: [R`\text{GST}`] },
        hint: L("Find the GST paid at each stage after input tax credit, then add.", "इनपुट टैक्स क्रेडिट के बाद प्रत्येक चरण पर चुकाया GST ज्ञात कीजिए, फिर जोड़िए।"),
        formula: R`\text{GST} = \dfrac{g}{100}\left[P_1 + (P_2 - P_1) + (P_3 - P_2)\right]`,
        solution: S(
          R`$\dfrac{${g}}{100} \times ${P1} = ${f2((g * P1) / 100)}$`,
          R`$\dfrac{${g}}{100} \times (${P2} - ${P1}) = ${f2((g * (P2 - P1)) / 100)}$`,
          R`$\dfrac{${g}}{100} \times (${P3} - ${P2}) = ${f2((g * (P3 - P2)) / 100)}$`,
          L(`Total = ₹${f2(tot)}, which is exactly ${g}% of the final price ₹${P3}.`, `कुल = ₹${f2(tot)}, जो अंतिम मूल्य ₹${P3} का ठीक ${g}% है।`),
        ),
      });
    },
  },
  {
    id: "exi-mat-recurring-deposit",
    topics: [T("commercial-mathematics")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const nm = r.pick(NAMES), N = L(nm[0], nm[1]);
      const P = r.pick([500, 600, 800, 1000, 1200, 1500, 2000, 2500]), n = r.pick([12, 18, 24, 36, 6, 30]), rt = r.pick([6, 7, 8, 9, 10, 7.5, 8.5]);
      const I = (P * n * (n + 1) * rt) / 2400, M = P * n + I;
      const F = R`I = P \times \dfrac{n(n+1)}{2 \times 12} \times \dfrac{r}{100}`;
      const intro = L(`${N} deposited ₹${P} per month in a recurring deposit account for ${n} months at ${en(rt)}% per annum.`, `${N} ने ${en(rt)}% वार्षिक ब्याज दर पर एक आवर्ती जमा खाते में ${n} महीनों तक प्रति माह ₹${P} जमा किए।`);
      const subI = R`$I = ${P} \times \dfrac{${n} \times ${n + 1}}{24} \times \dfrac{${en(rt)}}{100} = ${f2(I)}$`;
      if (level === 1) {
        return taskL(lang, {
          text: intro + L(" Find the interest earned at maturity (in ₹).", " परिपक्वता पर मिला ब्याज (₹ में) ज्ञात कीजिए।") + rnd(I, lang),
          answer: ansN(I, [[(P * n * rt * n) / 1200, L("In an RD each instalment stays for a different time; use the RD formula with n(n+1)/2 months.", "आवर्ती जमा में हर किस्त अलग समय तक रहती है; n(n+1)/2 महीनों वाला सूत्र लगाइए।")], [(P * n * (n + 1) * rt) / 200, L("The equivalent time n(n+1)/2 is in months: divide by 12 to get years.", "समतुल्य समय n(n+1)/2 महीनों में है: वर्ष के लिए 12 से भाग दीजिए।")]]),
          data: { given: [`P = ${P}`, `n = ${n}`, `r = ${en(rt)}\\%`], find: ["I"] },
          hint: L("Use the recurring deposit interest formula of ICSE.", "आवर्ती जमा के ब्याज का सूत्र लगाइए।"),
          formula: F,
          solution: S(L("Recurring deposit interest:", "आवर्ती जमा का ब्याज:"), subI, L(`Interest = ₹${f2(I)}`, `ब्याज = ₹${f2(I)}`)),
        });
      }
      if (level === 2) {
        return taskL(lang, {
          text: intro + L(" Find the maturity value (in ₹).", " परिपक्वता राशि (₹ में) ज्ञात कीजिए।") + rnd(M, lang),
          answer: ansN(M, [[I, L("That is only the interest; add the total amount deposited (P × n).", "यह केवल ब्याज है; कुल जमा राशि (P × n) भी जोड़िए।")], [P * n * (1 + (rt * n) / 1200), L("Each instalment earns interest for a different time; use the RD formula.", "हर किस्त अलग समय तक ब्याज कमाती है; आवर्ती जमा का सूत्र लगाइए।")]]),
          data: { given: [`P = ${P}`, `n = ${n}`, `r = ${en(rt)}\\%`], find: ["MV"] },
          hint: L("Maturity value = total deposited + interest.", "परिपक्वता राशि = कुल जमा + ब्याज।"),
          formula: R`MV = P \times n + I`,
          solution: S(subI, R`$P \times n = ${P} \times ${n} = ${P * n}$`, R`$MV = ${P * n} + ${f2(I)} = \text{₹}\,${f2(M)}$`),
        });
      }
      const v = r.int(0, 2);
      if (v === 0) {
        const k = n + (n * (n + 1) * rt) / 2400;
        return taskL(lang, {
          text: L(`${N} has a recurring deposit account for ${n} months at ${en(rt)}% per annum and receives ₹${f2(M)} at maturity. Find the monthly instalment (in ₹).`, `${N} का ${en(rt)}% वार्षिक ब्याज पर ${n} महीनों का एक आवर्ती जमा खाता है और परिपक्वता पर ₹${f2(M)} मिलते हैं। मासिक किस्त (₹ में) ज्ञात कीजिए।`),
          answer: ansN(P, [[M / n, L("The maturity value includes interest; you cannot just divide by n.", "परिपक्वता राशि में ब्याज भी है; केवल n से भाग नहीं दे सकते।")], [M / ((n * (n + 1) * rt) / 2400), L("MV = Pn + I: the deposits Pn are part of the maturity value too.", "MV = Pn + I: जमा राशि Pn भी परिपक्वता राशि का भाग है।")]]),
          data: { given: [`MV = ${f2(M)}`, `n = ${n}`, `r = ${en(rt)}\\%`], find: ["P"] },
          hint: L("Write the maturity value as P × n + I with I in terms of P, then solve for P.", "परिपक्वता राशि को P × n + I लिखिए, जहाँ I को P के पदों में लिखें; फिर P ज्ञात कीजिए।"),
          formula: R`MV = Pn + P \cdot \dfrac{n(n+1)}{24} \cdot \dfrac{r}{100}`,
          solution: S(
            R`$I = P \times \dfrac{${n} \times ${n + 1}}{24} \times \dfrac{${en(rt)}}{100} = ${en(r2((n * (n + 1) * rt) / 2400 * 1e4) / 1e4)}P$`,
            R`$${n}P + ${en(r2((n * (n + 1) * rt) / 2400 * 1e4) / 1e4)}P = ${f2(M)}$`,
            R`$P = \dfrac{${f2(M)}}{${en(Math.round(k * 1e6) / 1e6)}} = \text{₹}\,${P}$`,
          ),
        });
      }
      if (v === 1) {
        return taskL(lang, {
          text: L(`${N} deposited ₹${P} per month for ${n} months in a recurring deposit account and received ₹${f2(M)} at maturity. Find the rate of interest (in % per annum).`, `${N} ने एक आवर्ती जमा खाते में ${n} महीनों तक प्रति माह ₹${P} जमा किए और परिपक्वता पर ₹${f2(M)} प्राप्त किए। ब्याज की दर (% वार्षिक में) ज्ञात कीजिए।`),
          answer: ansN(rt, [[(2400 * M) / (P * n * (n + 1)), L("First subtract the money deposited (P × n) to get the interest.", "ब्याज पाने के लिए पहले जमा राशि (P × n) घटाइए।")], [(200 * I) / (P * n * (n + 1)), L("The time n(n+1)/2 is in months; divide by 12.", "समय n(n+1)/2 महीनों में है; 12 से भाग दीजिए।")]]),
          data: { given: [`P = ${P}`, `n = ${n}`, `MV = ${f2(M)}`], find: ["r"] },
          hint: L("Interest = maturity value − total deposits. Then use the RD formula to find r.", "ब्याज = परिपक्वता राशि − कुल जमा। फिर आवर्ती जमा के सूत्र से r ज्ञात कीजिए।"),
          formula: F,
          solution: S(
            R`$I = ${f2(M)} - ${P} \times ${n} = ${f2(I)}$`,
            R`$${f2(I)} = ${P} \times \dfrac{${n} \times ${n + 1}}{24} \times \dfrac{r}{100}$`,
            R`$r = \dfrac{${f2(I)} \times 2400}{${P} \times ${n * (n + 1)}} = ${en(rt)}\%$`,
          ),
        });
      }
      return taskL(lang, {
        text: L(`${N} deposits ₹${P} per month in a recurring deposit account at ${en(rt)}% per annum. The interest at maturity is ₹${f2(I)}. For how many months was the account held?`, `${N} के आवर्ती जमा खाते में ${en(rt)}% वार्षिक ब्याज पर प्रति माह ₹${P} जमा होते हैं। परिपक्वता पर ब्याज ₹${f2(I)} है। खाता कितने महीनों के लिए था?`),
        answer: numM(n, null, [[n + 1, L("n(n+1) = product of two consecutive numbers: n is the smaller one.", "n(n+1) दो क्रमागत संख्याओं का गुणनफल है: n छोटी संख्या है।")], [(n * (n + 1)) / 2, L("Solve n(n + 1) = … for n; do not stop at n(n+1)/2.", "n(n + 1) = … को n के लिए हल कीजिए; n(n+1)/2 पर न रुकें।")]]),
        data: { given: [`P = ${P}`, `r = ${en(rt)}\\%`, `I = ${f2(I)}`], find: ["n"] },
        hint: L("Put the values in the RD formula: you get n(n + 1) = a number. Write it as a product of two consecutive integers.", "मान आवर्ती जमा सूत्र में रखिए: n(n + 1) = एक संख्या मिलेगी। इसे दो क्रमागत पूर्णांकों के गुणनफल के रूप में लिखिए।"),
        formula: F,
        solution: S(
          R`$${f2(I)} = ${P} \times \dfrac{n(n+1)}{24} \times \dfrac{${en(rt)}}{100}$`,
          R`$n(n+1) = \dfrac{${f2(I)} \times 2400}{${P} \times ${en(rt)}} = ${n * (n + 1)} = ${n} \times ${n + 1}$`,
          L(`So n = ${n} months.`, `अतः n = ${n} महीने।`),
        ),
      });
    },
  },
  {
    id: "exi-mat-shares",
    topics: [T("commercial-mathematics")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const nm = r.pick(NAMES), N = L(nm[0], nm[1]);
      const FV = r.pick([10, 20, 50, 100]), d = r.pick([5, 6, 8, 10, 12, 15]);
      const pr = r.pick([-1, 1]) * r.pick([0.1, 0.2, 0.25, 0.3, 0.5]);
      const MV = r2(FV * (1 + pr));
      const FD = R`\text{${L("dividend", "लाभांश")}} = n \times FV \times \dfrac{d}{100}`;
      if (level === 1) {
        if (r.int(0, 1) === 0) {
          const n = r.pick([50, 80, 100, 120, 150, 200, 250, 400, 500]);
          const D = (n * FV * d) / 100;
          return taskL(lang, {
            text: L(`${N} holds ${n} shares of face value ₹${FV} each, quoted in the market at ₹${en(MV)}. The company declares a dividend of ${d}%. Find ${N}'s annual dividend (in ₹).`, `${N} के पास ₹${FV} अंकित मूल्य वाले ${n} शेयर हैं, जिनका बाज़ार मूल्य ₹${en(MV)} है। कंपनी ${d}% लाभांश घोषित करती है। ${N} का वार्षिक लाभांश (₹ में) ज्ञात कीजिए।`),
            answer: ansN(D, [[(n * MV * d) / 100, L("Dividend is always calculated on the face value, not the market value.", "लाभांश सदैव अंकित मूल्य पर निकाला जाता है, बाज़ार मूल्य पर नहीं।")], [(FV * d) / 100, L("That is the dividend on one share; multiply by the number of shares.", "यह एक शेयर का लाभांश है; शेयरों की संख्या से गुणा कीजिए।")]]),
            data: { given: [`n = ${n}`, `FV = ${FV}`, `MV = ${en(MV)}`, `d = ${d}\\%`], find: [L(R`\text{dividend}`, R`\text{लाभांश}`)] },
            hint: L("Dividend per share = d% of the face value.", "प्रति शेयर लाभांश = अंकित मूल्य का d%।"),
            formula: FD,
            solution: S(R`$\text{${L("per share", "प्रति शेयर")}} = \dfrac{${d}}{100} \times ${FV} = ${f2((FV * d) / 100)}$`, R`$\text{${L("dividend", "लाभांश")}} = ${n} \times ${f2((FV * d) / 100)} = \text{₹}\,${f2(D)}$`),
          });
        }
        const n = r.pick([40, 50, 60, 80, 100, 120, 150, 200]), X = r2(n * MV);
        return taskL(lang, {
          text: L(`${N} invests ₹${f2(X)} in ₹${FV} shares quoted at ₹${en(MV)}. How many shares does ${N} buy?`, `${N} ने ₹${FV} वाले शेयरों में, जिनका बाज़ार मूल्य ₹${en(MV)} है, ₹${f2(X)} का निवेश किया। ${N} ने कितने शेयर खरीदे?`),
          answer: numM(n, null, [[X / FV, L("Shares are bought at the market value, not the face value.", "शेयर बाज़ार मूल्य पर खरीदे जाते हैं, अंकित मूल्य पर नहीं।")]]),
          data: { given: [`X = ${f2(X)}`, `MV = ${en(MV)}`], find: ["n"] },
          hint: L("Each share costs its market value.", "प्रत्येक शेयर का मूल्य उसका बाज़ार मूल्य है।"),
          formula: R`n = \dfrac{\text{investment}}{MV}`,
          solution: S(L("Number of shares = investment ÷ market value:", "शेयरों की संख्या = निवेश ÷ बाज़ार मूल्य:"), R`$n = \dfrac{${f2(X)}}{${en(MV)}} = ${n}$`),
        });
      }
      if (level === 2) {
        const n = r.pick([40, 50, 60, 80, 100, 120, 150, 200, 250]), X = r2(n * MV), D = (n * FV * d) / 100;
        const prem = MV > FV;
        const how = prem ? L(`at a premium of ₹${en(r2(MV - FV))}`, `₹${en(r2(MV - FV))} प्रीमियम पर`) : L(`at a discount of ₹${en(r2(FV - MV))}`, `₹${en(r2(FV - MV))} बट्टे (डिस्काउंट) पर`);
        const premD = prem ? L(R`\text{premium}`, R`\text{प्रीमियम}`) + ` = ${en(r2(MV - FV))}` : L(R`\text{discount}`, R`\text{बट्टा}`) + ` = ${en(r2(FV - MV))}`;
        if (r.int(0, 1) === 0) {
          return taskL(lang, {
            text: L(`${N} invests ₹${f2(X)} in ₹${FV} shares ${how}, paying a dividend of ${d}%. Find ${N}'s annual income (in ₹).`, `${N} ने ${d}% लाभांश देने वाले ₹${FV} के शेयरों में, ${how}, ₹${f2(X)} का निवेश किया। ${N} की वार्षिक आय (₹ में) ज्ञात कीजिए।`),
            answer: ansN(D, [[(X * d) / 100, L("The dividend rate applies to the face value of the shares, not to the money invested.", "लाभांश की दर शेयरों के अंकित मूल्य पर लगती है, निवेश की गई राशि पर नहीं।")], [(X / (2 * FV - MV)) * FV * d / 100, L(prem ? "A premium adds to the face value: MV = FV + premium." : "A discount is subtracted from the face value: MV = FV − discount.", prem ? "प्रीमियम अंकित मूल्य में जुड़ता है: MV = FV + प्रीमियम।" : "बट्टा अंकित मूल्य से घटता है: MV = FV − बट्टा।")]]),
            data: { given: [`X = ${f2(X)}`, `FV = ${FV}`, premD, `d = ${d}\\%`], find: [L(R`\text{income}`, R`\text{आय}`)] },
            hint: L("Find the market value, then the number of shares, then the dividend on their face value.", "बाज़ार मूल्य ज्ञात कीजिए, फिर शेयरों की संख्या, फिर उनके अंकित मूल्य पर लाभांश।"),
            formula: FD,
            solution: S(R`$MV = ${FV} ${prem ? "+" : "-"} ${en(Math.abs(r2(MV - FV)))} = ${en(MV)}$`, R`$n = \dfrac{${f2(X)}}{${en(MV)}} = ${n}$`, R`$\text{${L("income", "आय")}} = ${n} \times ${FV} \times \dfrac{${d}}{100} = \text{₹}\,${f2(D)}$`),
          });
        }
        const ret = (FV * d) / MV;
        return taskL(lang, {
          text: L(`A company pays a dividend of ${d}% on its ₹${FV} shares, which are available ${how}. Find the percentage return on the investment.`, `एक कंपनी अपने ₹${FV} के शेयरों पर ${d}% लाभांश देती है, जो ${how} उपलब्ध हैं। निवेश पर प्रतिशत प्रतिफल (आय) ज्ञात कीजिए।`) + rnd(ret, lang),
          answer: ansN(ret, [[d, L("d% is paid on the face value; the return is measured on the money you pay (market value).", "d% अंकित मूल्य पर मिलता है; प्रतिफल चुकाई गई राशि (बाज़ार मूल्य) पर मापा जाता है।")], [(d * MV) / FV, L("Return = dividend ÷ investment: divide by the market value.", "प्रतिफल = लाभांश ÷ निवेश: बाज़ार मूल्य से भाग दीजिए।")]]),
          data: { given: [`FV = ${FV}`, premD, `d = ${d}\\%`], find: [L(R`\text{return}\ \%`, R`\text{प्रतिफल}\ \%`)] },
          hint: L("Work with one share: dividend on it ÷ price paid for it × 100.", "एक शेयर लेकर चलिए: उसका लाभांश ÷ उसके लिए चुकाया मूल्य × 100।"),
          formula: L(R`\text{return}\ \% = \dfrac{FV \times d}{MV}`, R`\text{प्रतिफल}\ \% = \dfrac{FV \times d}{MV}`),
          solution: S(R`$MV = ${en(MV)}$, ${L("dividend per share", "प्रति शेयर लाभांश")} $= \dfrac{${d}}{100} \times ${FV} = ${f2((FV * d) / 100)}$`, R`$\text{${L("return", "प्रतिफल")}} = \dfrac{${f2((FV * d) / 100)}}{${en(MV)}} \times 100 ${eqs(ret)} ${f2(ret)}\%$`),
        });
      }
      if (r.int(0, 1) === 0) {
        const n = r.pick([50, 60, 80, 100, 120, 150, 200, 300, 400]), inc = (n * FV * d) / 100, X = r2(n * MV);
        return taskL(lang, {
          text: L(`How much money (in ₹) must ${N} invest in ${d}% ₹${FV} shares quoted at ₹${en(MV)} to obtain an annual income of ₹${f2(inc)}?`, `${N} को ₹${en(MV)} पर उपलब्ध ${d}% वाले ₹${FV} के शेयरों में कितनी राशि (₹ में) निवेश करनी चाहिए ताकि वार्षिक आय ₹${f2(inc)} हो?`),
          answer: ansN(X, [[(inc * 100) / d, L("That is the face value of the shares needed; they are bought at the market value.", "यह आवश्यक शेयरों का अंकित मूल्य है; शेयर बाज़ार मूल्य पर खरीदे जाते हैं।")], [n, L("That is the number of shares; multiply by the market value.", "यह शेयरों की संख्या है; बाज़ार मूल्य से गुणा कीजिए।")]]),
          data: { given: [`d = ${d}\\%`, `FV = ${FV}`, `MV = ${en(MV)}`, R`${L(R`\text{income}`, R`\text{आय}`)} = ${f2(inc)}`], find: ["X"] },
          hint: L("Find the dividend on one share, then how many shares give the income.", "एक शेयर का लाभांश ज्ञात कीजिए, फिर कितने शेयरों से यह आय मिलेगी।"),
          formula: R`X = n \times MV,\quad n = \dfrac{\text{income}}{FV \times d/100}`,
          solution: S(R`$\text{${L("dividend per share", "प्रति शेयर लाभांश")}} = \dfrac{${d}}{100} \times ${FV} = ${f2((FV * d) / 100)}$`, R`$n = \dfrac{${f2(inc)}}{${f2((FV * d) / 100)}} = ${n}$`, R`$X = ${n} \times ${en(MV)} = \text{₹}\,${f2(X)}$`),
        });
      }
      let n1, MV1, FV2, d2, MV2, n2, d1;
      do {
        n1 = r.pick([100, 150, 200, 240, 300, 400]); MV1 = r.pick([12, 15, 18, 24, 30, 36, 45, 60, 75, 120, 125, 150]); d1 = r.pick([5, 6, 8, 10]);
        FV2 = r.pick([10, 20, 50, 100]); d2 = r.pick([8, 9, 10, 12, 15]); MV2 = r.pick([FV2 * 0.8, FV2 * 1.25, FV2 * 1.5, FV2 * 1.2, FV2 * 0.9]);
        n2 = (n1 * MV1) / MV2;
      } while (Math.abs(n2 - Math.round(n2)) > 1e-9 || MV1 < FV / 2 || MV1 > FV * 2 || (n2 * FV2 * d2) / 100 <= (n1 * FV * d1) / 100);
      const old = (n1 * FV * d1) / 100, neu = (n2 * FV2 * d2) / 100;
      return taskL(lang, {
        text: L(`${N} holds ${n1} shares (₹${FV} each) paying ${d1}% dividend. ${N} sells them at ₹${MV1} each and invests the proceeds in ₹${FV2} shares at ₹${en(MV2)} paying ${d2}% dividend. Find the increase in annual income (in ₹).`, `${N} के पास ${d1}% लाभांश वाले ${n1} शेयर (प्रत्येक ₹${FV}) हैं। ${N} ने इन्हें ₹${MV1} प्रति शेयर पर बेचकर पूरी राशि ${d2}% लाभांश वाले ₹${FV2} के शेयरों में ₹${en(MV2)} पर निवेश की। वार्षिक आय में वृद्धि (₹ में) ज्ञात कीजिए।`),
        answer: ansN(neu - old, [[neu, L("That is the new income; subtract the old income.", "यह नई आय है; इसमें से पुरानी आय घटाइए।")], [(n1 * MV1 * d2) / 100 - old, L("The new dividend is on the face value of the new shares, not on the money invested.", "नया लाभांश नए शेयरों के अंकित मूल्य पर है, निवेश की गई राशि पर नहीं।")]]),
        data: { given: [`n_1 = ${n1}`, `MV_1 = ${MV1}`, `MV_2 = ${en(MV2)}`, `FV_2 = ${FV2}`], find: [R`\Delta`] },
        hint: L("Old income from the old shares; sale money ÷ new market value gives the new number of shares.", "पुराने शेयरों से पुरानी आय निकालिए; बिक्री की राशि ÷ नया बाज़ार मूल्य से नए शेयरों की संख्या मिलती है।"),
        formula: FD,
        solution: S(
          R`$\text{${L("old income", "पुरानी आय")}} = ${n1} \times ${FV} \times \dfrac{${d1}}{100} = ${f2(old)}$`,
          R`$\text{${L("sale money", "बिक्री राशि")}} = ${n1} \times ${MV1} = ${n1 * MV1}$, $n_2 = \dfrac{${n1 * MV1}}{${en(MV2)}} = ${Math.round(n2)}$`,
          R`$\text{${L("new income", "नई आय")}} = ${Math.round(n2)} \times ${FV2} \times \dfrac{${d2}}{100} = ${f2(neu)}$`,
          R`$\text{${L("increase", "वृद्धि")}} = ${f2(neu)} - ${f2(old)} = \text{₹}\,${f2(neu - old)}$`,
        ),
      });
    },
  },
  // ───────────────────────── Linear programming ─────────────────────────
  {
    id: "exi-mat-lpp",
    topics: [T("linear-programming")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      // Dve premici skozi celoštevilsko točko (p, q) s celoštevilskimi presečišči z osema; premica 1 je položnejša.
      let p, q, a1, b1, a2, b2, c1, c2, ok = false;
      for (let i = 0; i < 5000 && !ok; i++) {
        p = r.int(1, 6); q = r.int(1, 6); a1 = r.int(1, 4); b1 = r.int(1, 4); a2 = r.int(1, 4); b2 = r.int(1, 4);
        c1 = a1 * p + b1 * q; c2 = a2 * p + b2 * q;
        ok = a1 * b2 < a2 * b1 && c1 % a1 === 0 && c1 % b1 === 0 && c2 % a2 === 0 && c2 % b2 === 0 && gcd(gcd(a1, b1), c1) === 1 && gcd(gcd(a2, b2), c2) === 1;
      }
      if (!ok) { p = 2; q = 3; a1 = 1; b1 = 2; c1 = 8; a2 = 3; b2 = 1; c2 = 9; }
      const al = r.int(1, 9), be = r.int(1, 9);
      const Z = (x, y) => al * x + be * y;
      const ztex = poly([[al, "x"], [be, "y"]]);
      const pt = ([x, y]) => `(${x}, ${y})`;
      const le = [[0, 0], [c2 / a2, 0], [p, q], [0, c1 / b1]];
      const ge = [[0, c2 / b2], [p, q], [c1 / a1, 0]];
      const cons = (rel) => [R`${poly([[a1, "x"], [b1, "y"]])} ${rel} ${c1}`, R`${poly([[a2, "x"], [b2, "y"]])} ${rel} ${c2}`, R`x \ge 0,\ y \ge 0`];
      const table = (cs, zf = Z) => cs.map(([x, y]) => R`Z${pt([x, y])} = ${zf(x, y)}`).join(",\\ ");
      const CORNER = L("The optimum of Z on the feasible region occurs at a corner point.", "सुसंगत क्षेत्र पर Z का इष्टतम मान किसी कोनीय बिंदु पर होता है।");
      if (level === 1) {
        if (r.int(0, 1) === 0) {
          const vals = le.map(([x, y]) => Z(x, y)), mx = Math.max(...vals);
          return taskL(lang, {
            text: L(`The corner points of the bounded feasible region of an LPP are ${le.map(pt).join(", ")}. Find the maximum value of $Z = ${ztex}$.`, `एक रैखिक प्रोग्रामन समस्या के परिबद्ध सुसंगत क्षेत्र के कोनीय बिंदु ${le.map(pt).join(", ")} हैं। $Z = ${ztex}$ का अधिकतम मान ज्ञात कीजिए।`),
            answer: numM(mx, null, [[Z(p, q) === mx ? Math.max(Z(c2 / a2, 0), Z(0, c1 / b1)) : Z(p, q), L("Evaluate Z at every corner point and take the largest value.", "प्रत्येक कोनीय बिंदु पर Z का मान निकालिए और सबसे बड़ा लीजिए।")], [Math.min(...vals), L("That is the minimum; the question asks for the maximum.", "यह न्यूनतम है; प्रश्न अधिकतम पूछता है।")]]),
            data: { given: le.map(pt), find: [R`Z_{\max}`] },
            hint: CORNER,
            formula: R`Z = ${ztex}`,
            solution: S(L("Values of Z at the corners:", "कोनीय बिंदुओं पर Z के मान:"), `$${table(le)}$`, L(`Maximum value of Z = ${mx}.`, `Z का अधिकतम मान = ${mx}।`)),
          });
        }
        const zf = (x, y) => al * x - be * y;
        const vals = le.map(([x, y]) => zf(x, y)), mn = Math.min(...vals);
        const zt = poly([[al, "x"], [-be, "y"]]);
        return taskL(lang, {
          text: L(`The corner points of the bounded feasible region of an LPP are ${le.map(pt).join(", ")}. Find the minimum value of $Z = ${zt}$.`, `एक रैखिक प्रोग्रामन समस्या के परिबद्ध सुसंगत क्षेत्र के कोनीय बिंदु ${le.map(pt).join(", ")} हैं। $Z = ${zt}$ का न्यूनतम मान ज्ञात कीजिए।`),
          answer: numM(mn, null, [[0, L("Z can be negative here: check every corner, not just the origin.", "यहाँ Z ऋणात्मक हो सकता है: केवल मूल बिंदु नहीं, हर कोनीय बिंदु जाँचिए।")], [Math.max(...vals), L("That is the maximum; the question asks for the minimum.", "यह अधिकतम है; प्रश्न न्यूनतम पूछता है।")]]),
          data: { given: le.map(pt), find: [R`Z_{\min}`] },
          hint: CORNER,
          formula: R`Z = ${zt}`,
          solution: S(L("Values of Z at the corners:", "कोनीय बिंदुओं पर Z के मान:"), `$${table(le, zf)}$`, L(`Minimum value of Z = ${mn}.`, `Z का न्यूनतम मान = ${mn}।`)),
        });
      }
      if (level === 2) {
        const vals = le.map(([x, y]) => Z(x, y)), mx = Math.max(...vals);
        return taskL(lang, {
          text: L(R`Maximise $Z = ${ztex}$ subject to $${cons(R`\le`).join("$, $")}$. Find the maximum value of Z.`, R`व्यवरोधों $${cons(R`\le`).join("$, $")}$ के अंतर्गत $Z = ${ztex}$ का अधिकतमीकरण कीजिए। Z का अधिकतम मान ज्ञात कीजिए।`),
          answer: numM(mx, null, [[Math.max(Z(c1 / a1, 0), Z(0, c2 / b2), Z(c2 / a2, 0), Z(0, c1 / b1)), L("Not every intercept is a corner: points that break the other constraint are outside the region.", "हर अंतःखंड कोनीय बिंदु नहीं होता: दूसरे व्यवरोध को तोड़ने वाले बिंदु क्षेत्र के बाहर हैं।")], [Z(p, q), L("Check all corner points, including those on the axes.", "अक्षों पर स्थित बिंदुओं सहित सभी कोनीय बिंदु जाँचिए।")]]),
          data: { given: cons(R`\le`), find: [R`Z_{\max}`] },
          hint: L("Draw both lines, shade the common region and find its corner points, including the intersection of the two lines.", "दोनों रेखाएँ खींचिए, उभयनिष्ठ क्षेत्र छायांकित कीजिए और उसके कोनीय बिंदु ज्ञात कीजिए, जिनमें दोनों रेखाओं का प्रतिच्छेद बिंदु भी है।"),
          formula: R`Z = ${ztex}`,
          solution: S(
            L("Intersection of the two lines:", "दोनों रेखाओं का प्रतिच्छेद बिंदु:") + ` $${pt([p, q])}$`,
            L("Corner points:", "कोनीय बिंदु:") + ` $${le.map(pt).join(", ")}$`,
            `$${table(le)}$`,
            L(`Maximum Z = ${mx}.`, `Z का अधिकतम मान = ${mx}।`),
          ),
        });
      }
      const v = r.int(0, 2);
      if (v === 0) {
        const vals = ge.map(([x, y]) => Z(x, y)), mn = Math.min(...vals);
        return taskL(lang, {
          text: L(R`Minimise $Z = ${ztex}$ subject to $${cons(R`\ge`).join("$, $")}$. Find the minimum value of Z.`, R`व्यवरोधों $${cons(R`\ge`).join("$, $")}$ के अंतर्गत $Z = ${ztex}$ का न्यूनतमीकरण कीजिए। Z का न्यूनतम मान ज्ञात कीजिए।`),
          answer: numM(mn, null, [[0, L("(0, 0) does not satisfy the ≥ constraints, so it is not in the region.", "(0, 0) ≥ वाले व्यवरोधों को संतुष्ट नहीं करता, अतः क्षेत्र में नहीं है।")], [Math.min(Z(c1 / a1, 0), Z(0, c2 / b2), Z(c2 / a2, 0), Z(0, c1 / b1)), L("Not every intercept is a corner: points that break the other constraint are outside the region.", "हर अंतःखंड कोनीय बिंदु नहीं होता: दूसरे व्यवरोध को तोड़ने वाले बिंदु क्षेत्र के बाहर हैं।")]]),
          data: { given: cons(R`\ge`), find: [R`Z_{\min}`] },
          hint: L("The region is unbounded. Find its corner points, compare Z there, then check the half-plane Z < m.", "क्षेत्र अपरिबद्ध है। इसके कोनीय बिंदु ज्ञात कीजिए, वहाँ Z की तुलना कीजिए, फिर अर्धतल Z < m की जाँच कीजिए।"),
          formula: R`Z = ${ztex}`,
          solution: S(
            L("Corner points of the unbounded region:", "अपरिबद्ध क्षेत्र के कोनीय बिंदु:") + ` $${ge.map(pt).join(", ")}$`,
            `$${table(ge)}$`,
            L(`The smallest value is m = ${mn}. The half-plane $${ztex} < ${mn}$ has no point in common with the region, so the minimum is ${mn}.`, `सबसे छोटा मान m = ${mn} है। अर्धतल $${ztex} < ${mn}$ का क्षेत्र से कोई उभयनिष्ठ बिंदु नहीं है, अतः न्यूनतम मान ${mn} है।`),
          ),
        });
      }
      if (v === 1) {
        const k = r.pick([10, 20, 25, 50, 100]);
        const ctx = r.int(0, 1);
        const mx = Math.max(...le.map(([x, y]) => Z(x, y))) * k;
        const text = ctx === 0
          ? L(`A carpenter makes tables and chairs. A table needs ${a1} h of cutting and ${a2} h of polishing; a chair needs ${b1} h of cutting and ${b2} h of polishing. At most ${c1} h of cutting and ${c2} h of polishing are available per day. The profit is ₹${al * k} per table and ₹${be * k} per chair. Find the maximum daily profit (in ₹).`, `एक बढ़ई मेज़ें और कुर्सियाँ बनाता है। एक मेज़ के लिए ${a1} घंटे कटाई और ${a2} घंटे पॉलिश, तथा एक कुर्सी के लिए ${b1} घंटे कटाई और ${b2} घंटे पॉलिश चाहिए। प्रतिदिन अधिकतम ${c1} घंटे कटाई और ${c2} घंटे पॉलिश उपलब्ध हैं। लाभ प्रति मेज़ ₹${al * k} और प्रति कुर्सी ₹${be * k} है। अधिकतम दैनिक लाभ (₹ में) ज्ञात कीजिए।`)
          : L(`A cottage industry makes pedestal lamps and wooden shades. A lamp needs ${a1} h on a grinding machine and ${a2} h on a sprayer; a shade needs ${b1} h and ${b2} h. The grinder is available for at most ${c1} h and the sprayer for at most ${c2} h a day. The profit is ₹${al * k} per lamp and ₹${be * k} per shade. Find the maximum daily profit (in ₹).`, `एक कुटीर उद्योग पेडस्टल लैंप और लकड़ी के शेड बनाता है। एक लैंप के लिए ग्राइंडिंग मशीन पर ${a1} घंटे और स्प्रेयर पर ${a2} घंटे, तथा एक शेड के लिए ${b1} घंटे और ${b2} घंटे चाहिए। ग्राइंडर प्रतिदिन अधिकतम ${c1} घंटे और स्प्रेयर अधिकतम ${c2} घंटे उपलब्ध है। लाभ प्रति लैंप ₹${al * k} और प्रति शेड ₹${be * k} है। अधिकतम दैनिक लाभ (₹ में) ज्ञात कीजिए।`);
        return taskL(lang, {
          text,
          answer: numM(mx, null, [[Z(p, q) * k === mx ? Math.max(Z(c2 / a2, 0), Z(0, c1 / b1)) * k : Z(p, q) * k, L("Compare the profit at all corner points of the feasible region.", "सुसंगत क्षेत्र के सभी कोनीय बिंदुओं पर लाभ की तुलना कीजिए।")], [Math.max(Z(c1 / a1, 0), Z(0, c2 / b2)) * k, L("An intercept of one line can break the other constraint; it is then not feasible.", "एक रेखा का अंतःखंड दूसरे व्यवरोध को तोड़ सकता है; तब वह सुसंगत नहीं है।")]]),
          data: { given: cons(R`\le`), find: [R`Z_{\max} = \max(${al * k}x + ${be * k}y)`] },
          hint: L("Let x and y be the numbers made. Write one constraint per machine, then use the corner-point method.", "माना x और y बनाई गई वस्तुओं की संख्याएँ हैं। हर मशीन के लिए एक व्यवरोध लिखिए, फिर कोनीय बिंदु विधि लगाइए।"),
          formula: R`Z = ${al * k}x + ${be * k}y`,
          solution: S(
            L("Constraints:", "व्यवरोध:") + R` $${cons(R`\le`).join(",\\ ")}$`,
            L("Corner points:", "कोनीय बिंदु:") + ` $${le.map(pt).join(", ")}$`,
            `$${table(le, (x, y) => Z(x, y) * k)}$`,
            L(`Maximum profit = ₹${mx}.`, `अधिकतम लाभ = ₹${mx}।`),
          ),
        });
      }
      const vals = ge.map(([x, y]) => Z(x, y)), mn = Math.min(...vals);
      const at = ge.find(([x, y]) => Z(x, y) === mn);
      const correct = L(`Z has a minimum value ${mn} but no maximum value.`, `Z का न्यूनतम मान ${mn} है, पर कोई अधिकतम मान नहीं है।`);
      return taskL(lang, {
        text: L(R`For the constraints $${cons(R`\ge`).join("$, $")}$, which statement about $Z = ${ztex}$ is true?`, R`व्यवरोधों $${cons(R`\ge`).join("$, $")}$ के लिए $Z = ${ztex}$ के बारे में कौन-सा कथन सत्य है?`),
        answer: choiceWhy(r, correct, [
          [L(`Z has a maximum value ${Math.max(...vals)} at a corner point.`, `Z का अधिकतम मान ${Math.max(...vals)} एक कोनीय बिंदु पर है।`), L("The region is unbounded upwards, so Z can be made as large as we like.", "क्षेत्र ऊपर की ओर अपरिबद्ध है, अतः Z को जितना चाहें उतना बड़ा किया जा सकता है।")],
          [L("Z has neither a maximum nor a minimum value.", "Z का न तो अधिकतम मान है और न ही न्यूनतम मान।"), L(`An unbounded region can still give a minimum: check the half-plane ${ztex} < ${mn}.`, `अपरिबद्ध क्षेत्र में भी न्यूनतम हो सकता है: अर्धतल ${ztex} < ${mn} जाँचिए।`)],
          [L("Z has a minimum value 0 at (0, 0).", "Z का न्यूनतम मान 0 है, जो (0, 0) पर है।"), L("(0, 0) does not satisfy the ≥ constraints.", "(0, 0) ≥ वाले व्यवरोधों को संतुष्ट नहीं करता।")],
        ]),
        data: { given: cons(R`\ge`), find: [R`Z_{\min},\ Z_{\max}`] },
        hint: L("Find the corner points of the (unbounded) region and test both directions.", "(अपरिबद्ध) क्षेत्र के कोनीय बिंदु ज्ञात कीजिए और दोनों दिशाओं में जाँचिए।"),
        formula: R`Z = ${ztex}`,
        solution: S(
          `$${table(ge)}$`,
          L(`The smallest value ${mn} is at ${pt(at)}; the half-plane Z < ${mn} has no common point with the region, so ${mn} is the minimum.`, `सबसे छोटा मान ${mn} बिंदु ${pt(at)} पर है; अर्धतल Z < ${mn} का क्षेत्र से कोई उभयनिष्ठ बिंदु नहीं है, अतः ${mn} न्यूनतम है।`),
          L("Z grows without limit as x or y grows, so there is no maximum.", "x या y बढ़ने पर Z असीमित रूप से बढ़ता है, अतः अधिकतम मान नहीं है।"),
        ),
      });
    },
  },
  // ───────────────────────── Conditional probability and Bayes ─────────────────────────
  {
    id: "exi-mat-conditional-probability",
    topics: [T("conditional-probability-and-bayes-theorem")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const FC = R`P(A \mid B) = \dfrac{P(A \cap B)}{P(B)}`;
      const HC = L("Restrict the sample space to B, then count the outcomes of A inside it.", "प्रतिदर्श समष्टि को B तक सीमित कीजिए, फिर उसमें A के परिणाम गिनिए।");
      if (level === 1) {
        const v = r.int(0, 2);
        if (v === 0) {
          const EV = [
            ["an even number", "सम संख्या", [2, 4, 6]], ["an odd number", "विषम संख्या", [1, 3, 5]], ["a prime number", "अभाज्य संख्या", [2, 3, 5]],
            ["a number greater than 2", "2 से बड़ी संख्या", [3, 4, 5, 6]], ["a number greater than 3", "3 से बड़ी संख्या", [4, 5, 6]], ["a number greater than 4", "4 से बड़ी संख्या", [5, 6]],
            ["a multiple of 3", "3 का गुणज", [3, 6]], ["a number less than 4", "4 से छोटी संख्या", [1, 2, 3]], ["a number less than 5", "5 से छोटी संख्या", [1, 2, 3, 4]],
          ];
          let A, B, AB;
          do { A = r.pick(EV); B = r.pick(EV); AB = A[2].filter((x) => B[2].includes(x)); } while (A === B || AB.length === 0 || AB.length === B[2].length);
          return taskL(lang, {
            text: L(`A fair die is thrown once. Given that it shows ${B[0]}, what is the probability that it shows ${A[0]}?`, `एक न्याय्य पासा एक बार फेंका जाता है। यदि ज्ञात है कि पासे पर ${B[1]} आई है, तो इसकी प्रायिकता क्या है कि उस पर ${A[1]} आई है?`),
            answer: fractionM(AB.length, B[2].length, [[AB.length / 6, L("Given B, the sample space shrinks to the outcomes of B.", "B दिया होने पर प्रतिदर्श समष्टि केवल B के परिणामों तक सिमट जाती है।")], [AB.length / A[2].length, L("That is P(B | A); here B is the condition.", "यह P(B | A) है; यहाँ शर्त B है।")]]),
            hint: HC,
            formula: R`P(A \mid B) = \dfrac{n(A \cap B)}{n(B)}`,
            solution: S(R`$B = \{${B[2].join(", ")}\}$, $A \cap B = \{${AB.join(", ")}\}$`, R`$P(A \mid B) = \dfrac{${AB.length}}{${B[2].length}}${gcd(AB.length, B[2].length) > 1 ? ` = ${fracTex(AB.length, B[2].length)}` : ""}$`, L("(Only the outcomes of B are possible now.)", "(अब केवल B के परिणाम संभव हैं।)")),
          });
        }
        if (v === 1) {
          const b = r.int(12, 25), g = r.int(10, 25), x = r.int(3, b - 2), y = r.int(3, g - 2);
          const askG = r.int(0, 1) === 0;
          const [num, oth] = askG ? [y, g] : [x, b];
          return taskL(lang, {
            text: L(`A class has ${b} boys and ${g} girls. ${x} of the boys and ${y} of the girls play chess. A student chosen at random plays chess. What is the probability that the student is a ${askG ? "girl" : "boy"}?`, `एक कक्षा में ${b} लड़के और ${g} लड़कियाँ हैं। ${x} लड़के और ${y} लड़कियाँ शतरंज खेलते हैं। यादृच्छया चुना गया एक विद्यार्थी शतरंज खेलता है। इसकी प्रायिकता क्या है कि वह ${askG ? "लड़की" : "लड़का"} है?`),
            answer: fractionM(num, x + y, [[num / oth, L(`That is P(chess | ${askG ? "girl" : "boy"}); the condition here is "plays chess".`, `यह P(शतरंज | ${askG ? "लड़की" : "लड़का"}) है; यहाँ शर्त "शतरंज खेलता है" है।`)], [num / (b + g), L("That is P(both); divide by the number of chess players.", "यह दोनों की संयुक्त प्रायिकता है; शतरंज खेलने वालों की संख्या से भाग दीजिए।")]]),
            data: { given: [R`n(B \cap C) = ${x}`, R`n(G \cap C) = ${y}`], find: [R`P(${askG ? "G" : "B"} \mid C)`] },
            hint: L("The condition is that the student plays chess: count only chess players.", "शर्त यह है कि विद्यार्थी शतरंज खेलता है: केवल शतरंज खेलने वालों को गिनिए।"),
            formula: FC,
            solution: S(R`$n(C) = ${x} + ${y} = ${x + y}$`, R`$P(${askG ? "G" : "B"} \mid C) = \dfrac{${num}}{${x + y}}${gcd(num, x + y) > 1 ? ` = ${fracTex(num, x + y)}` : ""}$`, L("(Only chess players are counted.)", "(केवल शतरंज खेलने वाले गिने गए।)")),
          });
        }
        const D = r.pick([10, 12, 13, 15, 20]);
        let a, b, c;
        do { a = r.int(2, D - 1); b = r.int(2, D - 1); c = r.int(1, Math.min(a, b) - 1); } while (a === b || a + b - c > D);
        const askAB = r.int(0, 1) === 0;
        return taskL(lang, {
          text: L(R`For two events A and B, $P(A) = ${fracTex(a, D)}$, $P(B) = ${fracTex(b, D)}$ and $P(A \cap B) = ${fracTex(c, D)}$. Find $${askAB ? R`P(A \mid B)` : R`P(B \mid A)`}$.`, R`दो घटनाओं A और B के लिए $P(A) = ${fracTex(a, D)}$, $P(B) = ${fracTex(b, D)}$ और $P(A \cap B) = ${fracTex(c, D)}$ है। $${askAB ? R`P(A \mid B)` : R`P(B \mid A)`}$ ज्ञात कीजिए।`),
          answer: fractionM(c, askAB ? b : a, [[c / (askAB ? a : b), L("Divide by the probability of the condition (the event after the bar).", "शर्त वाली घटना (खड़ी रेखा के बाद वाली) की प्रायिकता से भाग दीजिए।")], [c / D, L("That is P(A ∩ B) itself; divide by the probability of the condition.", "यह स्वयं P(A ∩ B) है; शर्त वाली घटना की प्रायिकता से भाग दीजिए।")]]),
          data: { given: [`P(A) = ${fracTex(a, D)}`, `P(B) = ${fracTex(b, D)}`, R`P(A \cap B) = ${fracTex(c, D)}`], find: [askAB ? R`P(A \mid B)` : R`P(B \mid A)`] },
          hint: L("Conditional probability = P(both) ÷ P(condition).", "सप्रतिबंध प्रायिकता = P(दोनों) ÷ P(शर्त)।"),
          formula: askAB ? FC : R`P(B \mid A) = \dfrac{P(A \cap B)}{P(A)}`,
          solution: S(L("Using the definition:", "परिभाषा से:"), R`$${askAB ? R`P(A \mid B)` : R`P(B \mid A)`} = \dfrac{${c}/${D}}{${askAB ? b : a}/${D}} = ${fracTex(c, askAB ? b : a)}$`),
        });
      }
      if (level === 2) {
        const v = r.int(0, 3);
        if (v === 0) {
          const ALL = [];
          for (let i = 1; i <= 6; i++) for (let j = 1; j <= 6; j++) ALL.push([i, j]);
          const k = r.int(1, 6), s = r.int(5, 9), t = r.int(6, 9);
          const BS = [
            [L(`the sum of the numbers is ${s}`, `संख्याओं का योग ${s} है`), ([i, j]) => i + j === s],
            [L(`at least one die shows ${k}`, `कम से कम एक पासे पर ${k} है`), ([i, j]) => i === k || j === k],
            [L("the sum of the numbers is even", "संख्याओं का योग सम है"), ([i, j]) => (i + j) % 2 === 0],
            [L(`the first die shows ${k}`, `पहले पासे पर ${k} है`), ([i]) => i === k],
          ];
          const AS = [
            [L("both dice show the same number", "दोनों पासों पर एक ही संख्या है"), ([i, j]) => i === j],
            [L(`at least one die shows ${k}`, `कम से कम एक पासे पर ${k} है`), ([i, j]) => i === k || j === k],
            [L(`the sum is greater than ${t}`, `योग ${t} से अधिक है`), ([i, j]) => i + j > t],
            [L("the first die shows an even number", "पहले पासे पर सम संख्या है"), ([i]) => i % 2 === 0],
          ];
          let A, B, nB, nAB;
          do { A = r.pick(AS); B = r.pick(BS); nB = ALL.filter(B[1]).length; nAB = ALL.filter((o) => A[1](o) && B[1](o)).length; } while (A[0] === B[0] || nAB === 0 || nAB === nB);
          const nA = ALL.filter(A[1]).length;
          return taskL(lang, {
            text: L(`Two fair dice are thrown. Find the probability that ${A[0]}, given that ${B[0]}.`, `दो न्याय्य पासे फेंके जाते हैं। यदि ज्ञात है कि ${B[0]}, तो इसकी प्रायिकता ज्ञात कीजिए कि ${A[0]}।`),
            answer: fractionM(nAB, nB, [[nAB / 36, L("Given B, count only the outcomes of B, not all 36.", "B दिया होने पर केवल B के परिणाम गिनिए, सभी 36 नहीं।")], [nA / 36, L("The condition changes the probability; use only the outcomes where B happens.", "शर्त प्रायिकता बदल देती है; केवल वे परिणाम लीजिए जिनमें B होती है।")]]),
            hint: HC,
            formula: R`P(A \mid B) = \dfrac{n(A \cap B)}{n(B)}`,
            solution: S(L(`Outcomes with the condition: n(B) = ${nB}.`, `शर्त वाले परिणाम: n(B) = ${nB}।`), L(`Among them, A happens in n(A ∩ B) = ${nAB}.`, `इनमें से A, n(A ∩ B) = ${nAB} परिणामों में होती है।`), R`$P(A \mid B) = \dfrac{${nAB}}{${nB}}${gcd(nAB, nB) > 1 ? ` = ${fracTex(nAB, nB)}` : ""}$`),
          });
        }
        if (v === 1) {
          const [p1n, p1d] = r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5]]);
          const [p2n, p2d] = r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [1, 6]]);
          const i = r.int(0, NAMES.length - 1), j = (i + 1 + r.int(0, NAMES.length - 2)) % NAMES.length;
          const [A, B] = [L(...NAMES[i]), L(...NAMES[j])];
          const exact = r.int(0, 2) === 0;
          const qa = (p1d - p1n) * (p2d - p2n), den = p1d * p2d;
          const num = exact ? p1n * (p2d - p2n) + (p1d - p1n) * p2n : den - qa;
          return taskL(lang, {
            text: L(`The probability that ${A} solves a problem is $${fracTex(p1n, p1d)}$ and that ${B} solves it is $${fracTex(p2n, p2d)}$. They try independently. Find the probability that ${exact ? "exactly one of them solves it" : "the problem is solved"}.`, `किसी प्रश्न को ${A} द्वारा हल किए जाने की प्रायिकता $${fracTex(p1n, p1d)}$ और ${B} द्वारा हल किए जाने की प्रायिकता $${fracTex(p2n, p2d)}$ है। दोनों स्वतंत्र रूप से प्रयास करते हैं। प्रायिकता ज्ञात कीजिए कि ${exact ? "उनमें से ठीक एक इसे हल करता है" : "प्रश्न हल हो जाता है"}।`),
            answer: fractionM(num, den, exact
              ? [[(p1n * p2n) / den + num / den, L("Exactly one excludes the case where both solve it.", "ठीक एक में वह स्थिति शामिल नहीं है जिसमें दोनों हल करते हैं।")], [p1n / p1d + p2n / p2d, L("Add P(A solves, B fails) and P(A fails, B solves).", "P(A हल करे, B न करे) और P(A न करे, B हल करे) जोड़िए।")]]
              : [[p1n / p1d + p2n / p2d, L("The events overlap: subtract P(both solve), or use 1 − P(neither).", "घटनाएँ अतिव्यापी हैं: P(दोनों हल करें) घटाइए, या 1 − P(कोई नहीं) लीजिए।")], [(p1n * p2n) / den, L("That is P(both solve); the problem is solved if at least one solves it.", "यह P(दोनों हल करें) है; कम से कम एक के हल करने पर प्रश्न हल हो जाता है।")]]),
            data: { given: [`P(A) = ${fracTex(p1n, p1d)}`, `P(B) = ${fracTex(p2n, p2d)}`], find: [exact ? R`P(\text{exactly one})` : R`P(A \cup B)`] },
            hint: exact ? L("Exactly one: (A solves and B fails) or (A fails and B solves).", "ठीक एक: (A हल करे और B न करे) या (A न करे और B हल करे)।") : L("P(solved) = 1 − P(neither solves). For independent events multiply.", "P(हल) = 1 − P(कोई हल न करे)। स्वतंत्र घटनाओं के लिए गुणा कीजिए।"),
            formula: exact ? R`P = P(A)P(\bar{B}) + P(\bar{A})P(B)` : R`P(A \cup B) = 1 - P(\bar{A})P(\bar{B})`,
            solution: S(
              R`$P(\bar{A}) = ${fracTex(p1d - p1n, p1d)}$, $P(\bar{B}) = ${fracTex(p2d - p2n, p2d)}$`,
              exact ? R`$P = ${fracTex(p1n, p1d)} \cdot ${fracTex(p2d - p2n, p2d)} + ${fracTex(p1d - p1n, p1d)} \cdot ${fracTex(p2n, p2d)} = ${fracTex(num, den)}$` : R`$P = 1 - ${fracTex(p1d - p1n, p1d)} \cdot ${fracTex(p2d - p2n, p2d)} = 1 - ${fracTex(qa, den)} = ${fracTex(num, den)}$`,
            ),
          });
        }
        if (v === 2) {
          const [pa, qa2] = r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [1, 5]]);
          const [pb, qb] = r.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [1, 6], [5, 6]]);
          const ind = r.int(0, 1) === 0;
          const den = qa2 * qb, prod = pa * pb;
          const cn = ind ? prod : prod + (prod > 1 && r.int(0, 1) ? -1 : 1);
          const ok = Math.min(pa * qb, pb * qa2) >= cn && cn >= 1;
          const cnn = ok ? cn : prod;
          const isInd = cnn === prod;
          const S1 = L("A and B are independent.", "A और B स्वतंत्र घटनाएँ हैं।"), S2 = L("A and B are not independent.", "A और B स्वतंत्र घटनाएँ नहीं हैं।");
          const S3 = L("A and B are mutually exclusive.", "A और B परस्पर अपवर्जी हैं।"), S4 = L("A and B are both independent and mutually exclusive.", "A और B स्वतंत्र भी हैं और परस्पर अपवर्जी भी।");
          const cmp = L(`Compare P(A)·P(B) = ${prod}/${den} with P(A ∩ B) = ${cnn}/${den}.`, `P(A)·P(B) = ${prod}/${den} की तुलना P(A ∩ B) = ${cnn}/${den} से कीजिए।`);
          return taskL(lang, {
            text: L(R`For two events, $P(A) = ${fracTex(pa, qa2)}$, $P(B) = ${fracTex(pb, qb)}$ and $P(A \cap B) = ${fracTex(cnn, den)}$. Which statement is true?`, R`दो घटनाओं के लिए $P(A) = ${fracTex(pa, qa2)}$, $P(B) = ${fracTex(pb, qb)}$ और $P(A \cap B) = ${fracTex(cnn, den)}$ है। कौन-सा कथन सत्य है?`),
            answer: choiceWhy(r, isInd ? S1 : S2, [
              [isInd ? S2 : S1, cmp],
              [S3, L("Mutually exclusive events have P(A ∩ B) = 0, which is not the case here.", "परस्पर अपवर्जी घटनाओं में P(A ∩ B) = 0 होता है, जो यहाँ नहीं है।")],
              [S4, L("Events with non-zero probabilities cannot be both independent and mutually exclusive.", "शून्येतर प्रायिकताओं वाली घटनाएँ स्वतंत्र और परस्पर अपवर्जी दोनों नहीं हो सकतीं।")],
            ]),
            data: { given: [`P(A) = ${fracTex(pa, qa2)}`, `P(B) = ${fracTex(pb, qb)}`, R`P(A \cap B) = ${fracTex(cnn, den)}`], find: [R`P(A \cap B) \overset{?}{=} P(A)P(B)`] },
            hint: L("A and B are independent exactly when P(A ∩ B) = P(A)·P(B).", "A और B स्वतंत्र हैं यदि और केवल यदि P(A ∩ B) = P(A)·P(B)।"),
            formula: R`P(A \cap B) = P(A)\,P(B)`,
            solution: S(R`$P(A)\,P(B) = ${fracTex(pa, qa2)} \cdot ${fracTex(pb, qb)} = ${fracTex(prod, den)}$`, R`$P(A \cap B) = ${fracTex(cnn, den)}$`, isInd ? L("They are equal, so A and B are independent.", "दोनों बराबर हैं, अतः A और B स्वतंत्र हैं।") : L("They are not equal, so A and B are not independent.", "दोनों बराबर नहीं हैं, अतः A और B स्वतंत्र नहीं हैं।")),
          });
        }
        const red = r.int(3, 8), blk = r.int(2, 8), n = red + blk;
        return taskL(lang, {
          text: L(`A bag contains ${red} red and ${blk} black balls. Two balls are drawn one after the other without replacement. Find the probability that both are red.`, `एक थैले में ${red} लाल और ${blk} काली गेंदें हैं। बिना प्रतिस्थापन के एक के बाद एक दो गेंदें निकाली जाती हैं। दोनों गेंदों के लाल होने की प्रायिकता ज्ञात कीजिए।`),
          answer: fractionM(red * (red - 1), n * (n - 1), [[(red * red) / (n * n), L("Without replacement the second draw has one ball fewer (and one red fewer).", "बिना प्रतिस्थापन के दूसरी बार एक गेंद कम (और एक लाल कम) होती है।")], [(red * (red - 1)) / (n * n), L("After the first draw only n − 1 balls are left.", "पहली बार निकालने के बाद केवल n − 1 गेंदें बचती हैं।")]]),
          data: { given: [`n(R) = ${red}`, `n(B) = ${blk}`], find: [R`P(R_1 \cap R_2)`] },
          hint: L("Use the multiplication rule: P(R₁ ∩ R₂) = P(R₁) · P(R₂ | R₁).", "गुणन नियम लगाइए: P(R₁ ∩ R₂) = P(R₁) · P(R₂ | R₁)।"),
          formula: R`P(R_1 \cap R_2) = P(R_1)\,P(R_2 \mid R_1)`,
          solution: S(R`$P(R_1) = \dfrac{${red}}{${n}}$, $P(R_2 \mid R_1) = \dfrac{${red - 1}}{${n - 1}}$`, R`$P = \dfrac{${red}}{${n}} \cdot \dfrac{${red - 1}}{${n - 1}} = ${fracTex(red * (red - 1), n * (n - 1))}$`),
        });
      }
      const v = r.int(0, 3);
      if (v === 0) {
        const n = r.int(2, 3), sub = r.int(0, 1);
        const ALL = [];
        for (let m = 0; m < 2 ** n; m++) ALL.push([...Array(n)].map((_, i) => (m >> i) & 1));
        const B = sub === 0 ? (o) => o.some((x) => x) : (o) => o[0] === 1;
        const kB = r.int(n === 3 ? 1 : 2, n);
        const A = (o) => o.filter((x) => x).length === kB;
        const nB = ALL.filter(B).length, nAB = ALL.filter((o) => A(o) && B(o)).length;
        const aTxt = kB === n ? L(n === 2 ? "both are boys" : "all three are boys", n === 2 ? "दोनों लड़के हों" : "तीनों लड़के हों") : L(`exactly ${kB} of them are boys`, `उनमें से ठीक ${kB} लड़के हों`);
        const bTxt = sub === 0 ? L("at least one child is a boy", "कम से कम एक बच्चा लड़का है") : L("the eldest child is a boy", "सबसे बड़ा बच्चा लड़का है");
        return taskL(lang, {
          text: L(`A family has ${n} children. Assuming a boy and a girl are equally likely, find the probability that ${aTxt}, given that ${bTxt}.`, `एक परिवार में ${n} बच्चे हैं। लड़का और लड़की होना समसंभाव्य मानते हुए, यदि ज्ञात है कि ${bTxt}, तो प्रायिकता ज्ञात कीजिए कि ${aTxt}।`),
          answer: fractionM(nAB, nB, [[ALL.filter(A).length / ALL.length, L("The condition removes some outcomes; do not use all of them.", "शर्त कुछ परिणाम हटा देती है; सभी परिणाम न लें।")], [nAB / 2 ** (n - 1), L("List the outcomes carefully: the condition has a different number of cases.", "परिणामों को ध्यान से सूचीबद्ध कीजिए: शर्त में मामलों की संख्या अलग है।")]]),
          hint: L("Write all outcomes like BG, GB, … and keep only those that satisfy the condition.", "सभी परिणाम (जैसे BG, GB, …) लिखिए और केवल शर्त को संतुष्ट करने वाले रखिए।"),
          formula: R`P(A \mid B) = \dfrac{n(A \cap B)}{n(B)}`,
          solution: S(L("Outcomes satisfying the condition:", "शर्त को संतुष्ट करने वाले परिणाम:") + ` ${ALL.filter(B).map((o) => o.map((x) => (x ? "B" : "G")).join("")).join(", ")}` + L("", " (B = लड़का, G = लड़की)"), L(`n(B) = ${nB}, n(A ∩ B) = ${nAB}`, `n(B) = ${nB}, n(A ∩ B) = ${nAB}`), R`$P(A \mid B) = ${fracTex(nAB, nB)}$`),
        });
      }
      const D = r.pick([10, 12, 15, 20, 30]);
      let a, b, c;
      do { a = r.int(2, D - 2); b = r.int(2, D - 2); c = r.int(1, Math.min(a, b) - 1); } while (a + b - c > D || a === b);
      if (v === 1) {
        return taskL(lang, {
          text: L(R`For events A and B, $P(A) = ${fracTex(a, D)}$, $P(B) = ${fracTex(b, D)}$ and $P(A \mid B) = ${fracTex(c, b)}$. Find $P(B \mid A)$.`, R`घटनाओं A और B के लिए $P(A) = ${fracTex(a, D)}$, $P(B) = ${fracTex(b, D)}$ और $P(A \mid B) = ${fracTex(c, b)}$ है। $P(B \mid A)$ ज्ञात कीजिए।`),
          answer: fractionM(c, a, [[c / b, L("P(B | A) is not the same as P(A | B).", "P(B | A), P(A | B) के समान नहीं है।")], [c / D, L("That is P(A ∩ B); divide it by P(A).", "यह P(A ∩ B) है; इसे P(A) से भाग दीजिए।")]]),
          data: { given: [`P(A) = ${fracTex(a, D)}`, `P(B) = ${fracTex(b, D)}`, R`P(A \mid B) = ${fracTex(c, b)}`], find: [R`P(B \mid A)`] },
          hint: L("First find P(A ∩ B) from P(A | B) and P(B).", "पहले P(A | B) और P(B) से P(A ∩ B) ज्ञात कीजिए।"),
          formula: R`P(A \cap B) = P(B)\,P(A \mid B),\quad P(B \mid A) = \dfrac{P(A \cap B)}{P(A)}`,
          solution: S(R`$P(A \cap B) = ${fracTex(b, D)} \cdot ${fracTex(c, b)} = ${fracTex(c, D)}$`, R`$P(B \mid A) = \dfrac{${fracTex(c, D)}}{${fracTex(a, D)}} = ${fracTex(c, a)}$`),
        });
      }
      if (v === 2) {
        return taskL(lang, {
          text: L(R`For events A and B, $P(A) = ${fracTex(a, D)}$, $P(B) = ${fracTex(b, D)}$ and $P(A \mid B) = ${fracTex(c, b)}$. Find $P(A \cup B)$.`, R`घटनाओं A और B के लिए $P(A) = ${fracTex(a, D)}$, $P(B) = ${fracTex(b, D)}$ और $P(A \mid B) = ${fracTex(c, b)}$ है। $P(A \cup B)$ ज्ञात कीजिए।`),
          answer: fractionM(a + b - c, D, [[(a + b) / D, L("Subtract P(A ∩ B) so the overlap is not counted twice.", "P(A ∩ B) घटाइए ताकि उभयनिष्ठ भाग दो बार न गिना जाए।")], [a / D + b / D - c / b, L("Subtract P(A ∩ B) = P(B)·P(A | B), not P(A | B) itself.", "P(A ∩ B) = P(B)·P(A | B) घटाइए, स्वयं P(A | B) नहीं।")]]),
          data: { given: [`P(A) = ${fracTex(a, D)}`, `P(B) = ${fracTex(b, D)}`, R`P(A \mid B) = ${fracTex(c, b)}`], find: [R`P(A \cup B)`] },
          hint: L("Find P(A ∩ B) first, then use the addition theorem.", "पहले P(A ∩ B) ज्ञात कीजिए, फिर योग प्रमेय लगाइए।"),
          formula: R`P(A \cup B) = P(A) + P(B) - P(A \cap B)`,
          solution: S(R`$P(A \cap B) = P(B)\,P(A \mid B) = ${fracTex(b, D)} \cdot ${fracTex(c, b)} = ${fracTex(c, D)}$`, R`$P(A \cup B) = ${fracTex(a, D)} + ${fracTex(b, D)} - ${fracTex(c, D)} = ${fracTex(a + b - c, D)}$`),
        });
      }
      const CARDS = [];
      for (const s of ["S", "H", "D", "C"]) for (let k = 1; k <= 13; k++) CARDS.push([s, k]);
      const BS = [
        [L("it is a red card", "यह लाल पत्ता है"), ([s]) => s === "H" || s === "D"],
        [L("it is a face card (J, Q or K)", "यह तस्वीर वाला पत्ता (J, Q या K) है"), ([, k]) => k >= 11],
        [L("it is a spade", "यह हुकुम का पत्ता है"), ([s]) => s === "S"],
        [L("it is not an ace", "यह इक्का नहीं है"), ([, k]) => k !== 1],
      ];
      const AS = [
        [L("a king", "बादशाह"), ([, k]) => k === 13],
        [L("a heart", "पान का पत्ता"), ([s]) => s === "H"],
        [L("a red face card", "लाल तस्वीर वाला पत्ता"), ([s, k]) => (s === "H" || s === "D") && k >= 11],
        [L("a number card from 2 to 10", "2 से 10 तक का संख्या वाला पत्ता"), ([, k]) => k >= 2 && k <= 10],
      ];
      let A, B, nB, nAB;
      do { A = r.pick(AS); B = r.pick(BS); nB = CARDS.filter(B[1]).length; nAB = CARDS.filter((o) => A[1](o) && B[1](o)).length; } while (nAB === 0 || nAB === nB);
      const nA = CARDS.filter(A[1]).length;
      return taskL(lang, {
        text: L(`A card is drawn at random from a well-shuffled pack of 52 cards. Given that ${B[0]}, find the probability that it is ${A[0]}.`, `52 पत्तों की अच्छी तरह फेंटी गई गड्डी से एक पत्ता यादृच्छया निकाला जाता है। यदि ज्ञात है कि ${B[0]}, तो प्रायिकता ज्ञात कीजिए कि यह ${A[0]} है।`),
        answer: fractionM(nAB, nB, [[nA / 52, L("Use the condition: count only the cards that satisfy it.", "शर्त का प्रयोग कीजिए: केवल उसे संतुष्ट करने वाले पत्ते गिनिए।")], [nAB / 52, L("Divide by the number of cards satisfying the condition, not by 52.", "52 से नहीं, शर्त को संतुष्ट करने वाले पत्तों की संख्या से भाग दीजिए।")]]),
        hint: HC,
        formula: R`P(A \mid B) = \dfrac{n(A \cap B)}{n(B)}`,
        solution: S(L(`Cards satisfying the condition: ${nB}.`, `शर्त को संतुष्ट करने वाले पत्ते: ${nB}।`), L(`Of these, ${nAB} are ${A[0]}.`, `इनमें से ${nAB} पत्ते "${A[0]}" हैं।`), R`$P(A \mid B) = \dfrac{${nAB}}{${nB}}${gcd(nAB, nB) > 1 ? ` = ${fracTex(nAB, nB)}` : ""}$`),
      });
    },
  },
  {
    id: "exi-mat-bayes",
    topics: [T("conditional-probability-and-bayes-theorem")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const FT = R`P(E) = P(E_1)P(E \mid E_1) + P(E_2)P(E \mid E_2)`;
      const FB = R`P(E_i \mid E) = \dfrac{P(E_i)P(E \mid E_i)}{\sum_j P(E_j)P(E \mid E_j)}`;
      if (level <= 2) {
        let r1, b1, r2, b2;
        do { r1 = r.int(1, 7); b1 = r.int(1, 7); r2 = r.int(1, 7); b2 = r.int(1, 7); } while (r1 * (r2 + b2) === r2 * (r1 + b1));
        const n1 = r1 + b1, n2 = r2 + b2;
        const die = level === 2 && r.int(0, 1) === 1;
        const [w1n, w1d] = die ? [1, 3] : [1, 2];
        const [w2n, w2d] = die ? [2, 3] : [1, 2];
        const ctx = r.int(0, 1);
        const pick = die
          ? L("A die is thrown; if it shows 1 or 2, bag I is chosen, otherwise bag II.", "एक पासा फेंका जाता है; यदि 1 या 2 आए तो थैला I चुना जाता है, अन्यथा थैला II।")
          : L("One of the bags is chosen at random.", "इनमें से एक थैला यादृच्छया चुना जाता है।");
        const bags = ctx === 0
          ? L(`Bag I contains ${r1} red and ${b1} black balls; bag II contains ${r2} red and ${b2} black balls.`, `थैले I में ${r1} लाल और ${b1} काली गेंदें हैं; थैले II में ${r2} लाल और ${b2} काली गेंदें हैं।`)
          : L(`Box I contains ${r1} good and ${b1} defective bulbs; box II contains ${r2} good and ${b2} defective bulbs.`, `डिब्बे I में ${r1} अच्छे और ${b1} ख़राब बल्ब हैं; डिब्बे II में ${r2} अच्छे और ${b2} ख़राब बल्ब हैं।`);
        const pick2 = ctx === 0 ? pick : pick.replace(/bags/g, "boxes").replace(/bag/g, "box").replace(/थैला/g, "डिब्बा");
        const item = ctx === 0 ? L("red", "लाल") : L("good", "अच्छी");
        const [u, w] = ctx === 0 ? ["R", "B"] : ["G", "D"];
        const cnt = [`${u}_1 = ${r1}`, `${w}_1 = ${b1}`, `${u}_2 = ${r2}`, `${w}_2 = ${b2}`];
        // P(red) = w1·r1/n1 + w2·r2/n2
        const tn = w1n * r1 * w2d * n2 + w2n * r2 * w1d * n1, td = w1d * n1 * w2d * n2;
        const bn = w1n * r1 * w2d * n2;
        const totalTex = R`${fracTex(w1n, w1d)} \cdot \dfrac{${r1}}{${n1}} + ${fracTex(w2n, w2d)} \cdot \dfrac{${r2}}{${n2}} = ${fracTex(tn, td)}`;
        if (level === 1 || (die && r.int(0, 1) === 0)) {
          return taskL(lang, {
            text: bags + " " + pick2 + " " + (ctx === 0 ? L("A ball is drawn from it. Find the probability that it is red.", "उसमें से एक गेंद निकाली जाती है। गेंद के लाल होने की प्रायिकता ज्ञात कीजिए।") : L("A bulb is drawn from it. Find the probability that it is good.", "उसमें से एक बल्ब निकाला जाता है। बल्ब के अच्छा होने की प्रायिकता ज्ञात कीजिए।")),
            answer: fractionM(tn, td, [[(r1 + r2) / (n1 + n2), L("You cannot pool the two bags: weight each bag's probability by the chance of choosing it.", "दोनों थैलों को मिलाया नहीं जा सकता: प्रत्येक थैले की प्रायिकता को उसे चुनने की प्रायिकता से गुणा कीजिए।")], [r1 / n1 + r2 / n2, L("Multiply each term by the probability of choosing that bag.", "प्रत्येक पद को उस थैले को चुनने की प्रायिकता से गुणा कीजिए।")]]),
            data: { given: cnt, find: ["P(E)"] },
            hint: L("Use the theorem of total probability over the two bags.", "दोनों थैलों पर संपूर्ण प्रायिकता प्रमेय लगाइए।"),
            formula: FT,
            solution: S(L(`E: the item drawn is ${item}. E₁, E₂: bag (box) I or II is chosen.`, `E: निकाली गई वस्तु ${item} है। E₁, E₂: थैला (डिब्बा) I या II चुना गया।`), `$P(E) = ${totalTex}$`),
          });
        }
        return taskL(lang, {
          text: bags + " " + pick2 + " " + (ctx === 0 ? L("A ball drawn from it is red. Find the probability that it came from bag I.", "उसमें से निकाली गई गेंद लाल है। प्रायिकता ज्ञात कीजिए कि यह थैले I से निकाली गई थी।") : L("A bulb drawn from it is good. Find the probability that it came from box I.", "उसमें से निकाला गया बल्ब अच्छा है। प्रायिकता ज्ञात कीजिए कि यह डिब्बे I से निकाला गया था।")),
          answer: fractionM(bn, tn, [[(w1n * r1) / (w1d * n1), L("That is P(E₁ ∩ E); divide by the total probability P(E).", "यह P(E₁ ∩ E) है; इसे संपूर्ण प्रायिकता P(E) से भाग दीजिए।")], [r1 / (r1 + r2), L("The bags have different sizes and chances; use Bayes' theorem.", "थैलों के आकार और चुनने की प्रायिकताएँ अलग हैं; बेज़-प्रमेय लगाइए।")]]),
          data: { given: cnt, find: [R`P(E_1 \mid E)`] },
          hint: L("Bayes' theorem: the part of the total probability that comes through bag I.", "बेज़-प्रमेय: संपूर्ण प्रायिकता का वह भाग जो थैले I से आता है।"),
          formula: FB,
          solution: S(L(`E: the item is ${item}.`, `E: वस्तु ${item} है।`), `$P(E) = ${totalTex}$`, R`$P(E_1 \mid E) = \dfrac{${fracTex(w1n, w1d)} \cdot ${fracTex(r1, n1)}}{${fracTex(tn, td)}} = ${fracTex(bn, tn)}$`),
        });
      }
      const v = r.int(0, 2);
      if (v === 0) {
        let p, d;
        do { p = [r.int(2, 6) * 5, r.int(2, 6) * 5]; p.push(100 - p[0] - p[1]); d = [r.int(1, 5), r.int(1, 5), r.int(1, 5)]; } while (p[2] < 10);
        const k = r.int(0, 2), M = ["A", "B", "C"][k];
        const tot = p[0] * d[0] + p[1] * d[1] + p[2] * d[2];
        return taskL(lang, {
          text: L(`Machines A, B and C produce ${p[0]}%, ${p[1]}% and ${p[2]}% of the bolts in a factory; ${d[0]}%, ${d[1]}% and ${d[2]}% of their output respectively is defective. A bolt chosen at random is defective. Find the probability that it was made by machine ${M}.`, `एक कारख़ाने में मशीनें A, B और C क्रमशः ${p[0]}%, ${p[1]}% और ${p[2]}% बोल्ट बनाती हैं; इनके उत्पादन का क्रमशः ${d[0]}%, ${d[1]}% और ${d[2]}% त्रुटिपूर्ण होता है। यादृच्छया चुना गया एक बोल्ट त्रुटिपूर्ण है। प्रायिकता ज्ञात कीजिए कि यह मशीन ${M} द्वारा बनाया गया था।`),
          answer: fractionM(p[k] * d[k], tot, [[p[k] / 100, L("That is the prior P(machine); update it with the defect rates (Bayes).", "यह पूर्व प्रायिकता P(मशीन) है; इसे त्रुटि-दरों से बेज़-प्रमेय द्वारा अद्यतन कीजिए।")], [d[k] / (d[0] + d[1] + d[2]), L("Weight each defect rate by the share of production of that machine.", "प्रत्येक त्रुटि-दर को उस मशीन के उत्पादन-भाग से गुणा कीजिए।")]]),
          data: { given: [`P(A), P(B), P(C) = ${p.map((x) => `${x}\\%`).join(", ")}`, R`P(D \mid \cdot) = ${d.map((x) => `${x}\\%`).join(", ")}`], find: [R`P(${M} \mid D)`] },
          hint: L("Bayes: P(machine | defective) = P(machine)·P(defective | machine) ÷ P(defective).", "बेज़: P(मशीन | त्रुटिपूर्ण) = P(मशीन)·P(त्रुटिपूर्ण | मशीन) ÷ P(त्रुटिपूर्ण)।"),
          formula: FB,
          solution: S(
            R`$P(D) = \dfrac{${p[0]} \cdot ${d[0]} + ${p[1]} \cdot ${d[1]} + ${p[2]} \cdot ${d[2]}}{10000} = \dfrac{${tot}}{10000}$`,
            R`$P(${M} \mid D) = \dfrac{${p[k]} \cdot ${d[k]}}{${tot}} = ${fracTex(p[k] * d[k], tot)}$`,
          ),
        });
      }
      if (v === 1) {
        const pr = r.pick([1, 2, 5, 10]), s = r.pick([80, 90, 95, 99]), f = r.pick([1, 2, 5, 10]);
        const num = s * pr, tot = s * pr + f * (100 - pr);
        return taskL(lang, {
          text: L(`${pr}% of the people in a town have a certain disease. A blood test detects the disease in ${s}% of people who have it, but also gives a positive result for ${f}% of healthy people. A person chosen at random tests positive. Find the probability that the person actually has the disease.`, `एक शहर के ${pr}% लोगों को एक रोग है। एक रक्त-परीक्षण रोगी लोगों में से ${s}% में रोग पकड़ लेता है, पर ${f}% स्वस्थ लोगों के लिए भी धनात्मक परिणाम देता है। यादृच्छया चुने गए एक व्यक्ति का परीक्षण धनात्मक आता है। प्रायिकता ज्ञात कीजिए कि उसे वास्तव में रोग है।`),
          answer: fractionM(num, tot, [[s / 100, L("That is P(positive | disease); you need P(disease | positive).", "यह P(धनात्मक | रोग) है; आपको P(रोग | धनात्मक) चाहिए।")], [(s * pr) / 10000, L("That is P(disease and positive); divide by P(positive).", "यह P(रोग और धनात्मक) है; इसे P(धनात्मक) से भाग दीजिए।")]]),
          data: { given: [`P(D) = ${pr}\\%`, R`P(+ \mid D) = ${s}\%`, R`P(+ \mid \bar{D}) = ${f}\%`], find: [R`P(D \mid +)`] },
          hint: L("Positive results come from sick people and from healthy people; find what fraction comes from sick people.", "धनात्मक परिणाम रोगियों और स्वस्थ लोगों दोनों से आते हैं; ज्ञात कीजिए कि इनका कितना भाग रोगियों से आता है।"),
          formula: R`P(D \mid +) = \dfrac{P(D)P(+ \mid D)}{P(D)P(+ \mid D) + P(\bar{D})P(+ \mid \bar{D})}`,
          solution: S(
            R`$P(D)P(+ \mid D) = \dfrac{${pr}}{100} \cdot \dfrac{${s}}{100} = \dfrac{${num}}{10000}$`,
            R`$P(\bar{D})P(+ \mid \bar{D}) = \dfrac{${100 - pr}}{100} \cdot \dfrac{${f}}{100} = \dfrac{${f * (100 - pr)}}{10000}$`,
            R`$P(D \mid +) = \dfrac{${num}}{${num} + ${f * (100 - pr)}} = ${fracTex(num, tot)}$`,
            L("Even with a good test, a positive result is often a false alarm when the disease is rare.", "अच्छे परीक्षण के बावजूद, दुर्लभ रोग में धनात्मक परिणाम अक्सर झूठी चेतावनी होता है।"),
          ),
        });
      }
      const [tn, td] = r.pick([[3, 4], [2, 3], [4, 5], [3, 5], [5, 6], [5, 7]]);
      const six = r.int(0, 1) === 0;
      const [en1, ed1] = six ? [1, 6] : [1, 3];
      const i = r.int(0, NAMES.length - 1), N = L(...NAMES[i]);
      const num = en1 * tn, tot = en1 * tn + (ed1 - en1) * (td - tn);
      return taskL(lang, {
        text: L(`${N} speaks the truth ${tn} out of ${td} times. ${N} throws a die and reports that it shows ${six ? "a six" : "a number greater than 4"}. Find the probability that this is actually true.`, `${N} के सच बोलने की प्रायिकता $${fracTex(tn, td)}$ है। ${N} ने एक पासा फेंककर बताया कि उस पर ${six ? "छह आया" : "4 से बड़ी संख्या आई"} है। प्रायिकता ज्ञात कीजिए कि यह वास्तव में सत्य है।`),
        answer: fractionM(num, tot, [[tn / td, L("The report is not the whole story: the event itself is unlikely, so use Bayes' theorem.", "केवल कथन पर्याप्त नहीं है: घटना स्वयं कम संभावित है, अतः बेज़-प्रमेय लगाइए।")], [en1 / ed1, L("Use the report: combine the chance of the event with the chance of telling the truth.", "कथन का प्रयोग कीजिए: घटना की प्रायिकता को सच बोलने की प्रायिकता से जोड़िए।")]]),
        data: { given: [`P(T) = ${fracTex(tn, td)}`], find: [R`P(E \mid \text{report})`] },
        hint: L("The report is made either when the event happened and the truth is told, or when it did not happen and a lie is told.", "यह कथन तब मिलता है जब घटना हुई और सच बोला गया, या जब घटना नहीं हुई और झूठ बोला गया।"),
        formula: FB,
        solution: S(
          R`$P(E)P(T) = ${fracTex(en1, ed1)} \cdot ${fracTex(tn, td)} = ${fracTex(num, ed1 * td)}$`,
          R`$P(\bar{E})P(\bar{T}) = ${fracTex(ed1 - en1, ed1)} \cdot ${fracTex(td - tn, td)} = ${fracTex((ed1 - en1) * (td - tn), ed1 * td)}$`,
          R`$P = \dfrac{${num}}{${num} + ${(ed1 - en1) * (td - tn)}} = ${fracTex(num, tot)}$`,
        ),
      });
    },
  },
  // ───────────────────────── Inverse trigonometric functions ─────────────────────────
  {
    id: "exi-mat-inv-trig-values",
    topics: [T("inverse-trigonometric-functions")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const term = (fn, th, neg) => R`${ITF[fn].tex}\left(${neg ? "-" : ""}${ITF[fn].val[th]}\right)`;
      const pv = (fn, th, neg) => (!neg ? th : ITF[fn].odd ? -th : 180 - th);
      const DEG = L(" Give the answer in degrees.", " उत्तर अंशों (डिग्री) में दीजिए।");
      if (level === 1) {
        const fn = r.pick(Object.keys(ITF)), th = r.pick(ITF[fn].th), neg = r.int(0, 2) > 0;
        const ans = pv(fn, th, neg);
        const mis = neg
          ? ITF[fn].odd
            ? [[th, L("The argument is negative, and this function is odd: the principal value is negative too.", "तर्क ऋणात्मक है और यह फलन विषम है: मुख्य मान भी ऋणात्मक होगा।")], [180 - th, L(`That would be right for cos⁻¹; the range of this function is ${ITF[fn].rangeD}.`, `यह cos⁻¹ के लिए सही होता; इस फलन का परिसर ${ITF[fn].rangeD} है।`)]]
            : [[-th, L(`The principal value must lie in ${ITF[fn].rangeD}; a negative angle is not allowed.`, `मुख्य मान ${ITF[fn].rangeD} में होना चाहिए; ऋणात्मक कोण मान्य नहीं है।`)], [th, L("You ignored the minus sign of the argument.", "आपने तर्क का ऋण चिह्न छोड़ दिया।")]]
          : [[90 - th, L("You used the value of the complementary function (e.g. sin instead of cos).", "आपने पूरक फलन का मान लिया (जैसे cos के स्थान पर sin)।")]];
        return taskL(lang, {
          text: L(`Find the principal value of $${term(fn, th, neg)}$.`, `$${term(fn, th, neg)}$ का मुख्य मान ज्ञात कीजिए।`) + DEG,
          answer: numM(ans, null, mis),
          data: { given: [R`${ITF[fn].tex}x \in ${ITF[fn].range}`], find: [R`\theta^\circ`] },
          hint: L(`Find the angle in the principal value branch ${ITF[fn].rangeD} whose ${fn} has the given value.`, `मुख्य मान शाखा ${ITF[fn].rangeD} में वह कोण ढूँढिए जिसका ${fn} दिया गया मान है।`),
          formula: R`${ITF[fn].tex}x \in ${ITF[fn].range}`,
          solution: S(
            R`$${ITF[fn].fwd}\,${ans}^\circ = ${neg ? "-" : ""}${ITF[fn].val[th]}$`,
            L(`and ${ans}° lies in the principal value branch ${ITF[fn].rangeD}.`, `और ${ans}° मुख्य मान शाखा ${ITF[fn].rangeD} में है।`),
            R`$${term(fn, th, neg)} = ${ans}^\circ$`,
          ),
        });
      }
      if (level === 2) {
        const fns = r.shuffle(Object.keys(ITF)).slice(0, r.int(2, 3));
        const terms = fns.map((fn, i) => ({ fn, th: r.pick(ITF[fn].th.filter((x) => x !== 90)), neg: i === 0 ? true : r.int(0, 1) === 1, c: i === 0 ? 1 : r.pick([1, -1, 2]) }));
        const expr = terms.map(({ fn, th, neg, c }, i) => (i === 0 ? "" : c < 0 ? " - " : " + ") + (Math.abs(c) === 2 ? "2" : "") + term(fn, th, neg)).join("");
        const val = terms.reduce((s, t) => s + t.c * pv(t.fn, t.th, t.neg), 0);
        const naive = terms.reduce((s, t) => s + t.c * (t.neg ? -t.th : t.th), 0);
        const noSign = terms.reduce((s, t) => s + t.c * t.th, 0);
        return taskL(lang, {
          text: L(`Find the value of $${expr}$.`, `$${expr}$ का मान ज्ञात कीजिए।`) + DEG,
          answer: numM(val, null, [
            [naive, L("For cos⁻¹, sec⁻¹ and cot⁻¹ a negative argument gives 180° − θ, not −θ.", "cos⁻¹, sec⁻¹ और cot⁻¹ में ऋणात्मक तर्क से 180° − θ मिलता है, −θ नहीं।")],
            [noSign, L("Take the minus signs inside the brackets into account.", "कोष्ठकों के अंदर के ऋण चिह्नों को ध्यान में रखिए।")],
          ]),
          data: { given: terms.map(({ fn }) => R`${ITF[fn].tex}x \in ${ITF[fn].range}`), find: [R`\theta^\circ`] },
          hint: L("Find each principal value separately (watch the ranges), then combine.", "प्रत्येक मुख्य मान अलग-अलग ज्ञात कीजिए (परिसरों पर ध्यान दें), फिर जोड़िए।"),
          formula: R`\cos^{-1}(-x) = 180^\circ - \cos^{-1}x,\quad \sin^{-1}(-x) = -\sin^{-1}x`,
          solution: S(
            ...terms.map(({ fn, th, neg }) => R`$${term(fn, th, neg)} = ${pv(fn, th, neg)}^\circ$`),
            L("Combining:", "जोड़ने पर:") + R` $${terms.map(({ fn, th, neg, c }, i) => (i === 0 ? "" : c < 0 ? " - " : " + ") + (Math.abs(c) === 2 ? "2 \\cdot " : "") + pm(pv(fn, th, neg))).join("")} = ${val}^\circ$`,
          ),
        });
      }
      if (r.int(0, 1) === 0) {
        const fn = r.pick(["sin", "cos", "tan"]);
        const deg = r.pick({ sin: [120, 135, 150, 210, 225, 240, 300, 315], cos: [210, 225, 240, 300, 315, 390], tan: [120, 135, 150, 210, 240] }[fn]);
        const rad = (deg * Math.PI) / 180;
        const ans = Math.round((({ sin: Math.asin(Math.sin(rad)), cos: Math.acos(Math.cos(rad)), tan: Math.atan(Math.tan(rad)) })[fn] * 180) / Math.PI);
        const ex = R`${ITF[fn].tex}\left(${ITF[fn].fwd} ${piTex(deg)}\right)`;
        return taskL(lang, {
          text: L(`Find the principal value of $${ex}$.`, `$${ex}$ का मुख्य मान ज्ञात कीजिए।`) + DEG,
          answer: numM(ans, null, [
            [deg, L(`${ITF[fn].name}(${fn} θ) = θ only when θ is in the principal branch ${ITF[fn].rangeD}.`, `${ITF[fn].name}(${fn} θ) = θ केवल तभी, जब θ मुख्य शाखा ${ITF[fn].rangeD} में हो।`)],
            [-ans, L("Check the sign of the value of the inner function first.", "पहले अंदर वाले फलन के मान का चिह्न जाँचिए।")],
          ]),
          data: { given: [R`\theta = ${piTex(deg)}`], find: [R`\theta_0^\circ`] },
          hint: L(`The angle ${deg}° is outside ${ITF[fn].rangeD}. Find the angle in that range with the same ${fn} value.`, `कोण ${deg}° परिसर ${ITF[fn].rangeD} से बाहर है। उस परिसर में समान ${fn} मान वाला कोण ढूँढिए।`),
          formula: R`${ITF[fn].tex}(${ITF[fn].fwd}\,\theta) = \theta \iff \theta \in ${ITF[fn].range}`,
          solution: S(
            R`$${ITF[fn].fwd}\,${deg}^\circ = ${ITF[fn].fwd}\,${ans}^\circ$`,
            L(`and ${ans}° lies in ${ITF[fn].rangeD}.`, `और ${ans}° परिसर ${ITF[fn].rangeD} में है।`),
            R`$${ex} = ${ans}^\circ$`,
          ),
        });
      }
      const fn = r.pick(["sin", "cos", "tan"]), th = r.pick(ITF[fn].th.filter((x) => x !== 90)), neg = r.int(0, 1) === 1;
      const outer = r.pick(["sin", "cos"]), A = r.pick([30, 60, 90, 45]), op = r.pick([1, -1]);
      const p0 = pv(fn, th, neg), ang = A + op * p0;
      const f = (d) => (outer === "sin" ? Math.sin((d * Math.PI) / 180) : Math.cos((d * Math.PI) / 180));
      const val = Math.round(f(ang) * 1e10) / 1e10, wrongAng = A + op * (neg ? -th : th);
      const ex = R`${"\\" + outer}\left(${piTex(A)} ${op > 0 ? "+" : "-"} ${term(fn, th, neg)}\right)`;
      return taskL(lang, {
        text: L(`Find the value of $${ex}$.`, `$${ex}$ का मान ज्ञात कीजिए।`) + rnd(val, lang),
        answer: ansN(val, [[Math.round(f(wrongAng) * 1e10) / 1e10, L("Check the principal value of the inverse function: its range matters.", "प्रतिलोम फलन का मुख्य मान जाँचिए: उसका परिसर महत्वपूर्ण है।")], [Math.round((f(A) + op * f(p0)) * 1e10) / 1e10, L("You cannot split the function over a sum; first find the whole angle.", "फलन को योग पर बाँटा नहीं जा सकता; पहले पूरा कोण ज्ञात कीजिए।")]]),
        hint: L("First find the principal value of the inverse function, then the angle inside the bracket.", "पहले प्रतिलोम फलन का मुख्य मान ज्ञात कीजिए, फिर कोष्ठक के अंदर का कोण।"),
        formula: R`${ITF[fn].tex}x \in ${ITF[fn].range}`,
        solution: S(
          R`$${term(fn, th, neg)} = ${p0}^\circ$`,
          R`$${piTex(A)} = ${A}^\circ$, ${L("so the angle is", "अतः कोण")} $${A}^\circ ${op > 0 ? "+" : "-"} (${p0}^\circ) = ${ang}^\circ$`,
          R`$${"\\" + outer}\,${ang}^\circ ${eqs(val)} ${f2(val)}$`,
        ),
      });
    },
  },
  {
    id: "exi-mat-inv-trig-identities",
    topics: [T("inverse-trigonometric-functions")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      if (level === 1) {
        // Lastnosti (sin⁻¹x + cos⁻¹x = π/2 …) so izpadle iz racionaliziranega NCERT/CBSE: na L1 samo glavne veje.
        r.int(0, 1); // ohrani zaporedje naključnih števil
        const fns = Object.keys(ITF);
        const fn = r.pick(fns);
        const others = r.shuffle(fns.filter((x) => x !== fn)).slice(0, 3);
        return taskL(lang, {
          text: L(`What is the principal value branch (range) of $${ITF[fn].tex}x$?`, `$${ITF[fn].tex}x$ की मुख्य मान शाखा (परिसर) क्या है?`),
          answer: choiceWhy(r, `$${ITF[fn].range}$`, others.map((o) => [`$${ITF[o].range}$`, L(`That is the principal value branch of ${ITF[o].name}.`, `यह ${ITF[o].name} की मुख्य मान शाखा है।`)])),
          data: { given: [R`${ITF[fn].fwd}\ \text{${L("is one-one on this interval", "इस अंतराल पर एकैकी है")}}`], find: [L(R`\text{range}`, R`\text{परिसर}`)] },
          hint: L(`It is the interval on which ${fn} is one-one and takes every value of its range exactly once.`, `यह वह अंतराल है जिस पर ${fn} एकैकी है और अपने परिसर का हर मान ठीक एक बार लेता है।`),
          formula: R`${ITF[fn].tex}x \in ${ITF[fn].range}`,
          solution: S(L(`The principal value branch of ${ITF[fn].name} is`, `${ITF[fn].name} की मुख्य मान शाखा है`) + ` $${ITF[fn].range}$.`),
        });
      }
      const TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
      // कोण θ: sin = a/c, cos = b/c, tan = a/b
      const rep = (fn, [a, b, c]) => ({ sin: [a, c], cos: [b, c], tan: [a, b] })[fn];
      if (level === 2) {
        if (r.int(0, 1) === 0) {
          const pair = r.int(0, 2), S0 = r.pick([30, 45, 60, 120, 150]);
          const [f1, f2n] = [["sin", "cos"], ["tan", "cot"], ["sec", "cosec"]][pair];
          return taskL(lang, {
            text: L(`If $${ITF[f1].tex}x + ${ITF[f1].tex}y = ${piTex(S0)}$, find $${ITF[f2n].tex}x + ${ITF[f2n].tex}y$ in degrees.`, `यदि $${ITF[f1].tex}x + ${ITF[f1].tex}y = ${piTex(S0)}$ है, तो $${ITF[f2n].tex}x + ${ITF[f2n].tex}y$ का मान अंशों (डिग्री) में ज्ञात कीजिए।`),
            answer: numM(180 - S0, null, [[S0, L("The co-function sum is not the same: each pair adds up to 90°.", "सह-फलनों का योग वही नहीं है: प्रत्येक युग्म का योग 90° होता है।")], [90 - S0, L("There are two pairs (for x and for y), so the total is 2 × 90°.", "दो युग्म हैं (x और y के लिए), अतः कुल 2 × 90° है।")]]),
            data: { given: [R`${ITF[f1].tex}x + ${ITF[f1].tex}y = ${piTex(S0)}`], find: [R`${ITF[f2n].tex}x + ${ITF[f2n].tex}y`] },
            hint: L(`Use ${ITF[f1].name} x + ${ITF[f2n].name} x = 90° for x and for y.`, `x और y दोनों के लिए ${ITF[f1].name} x + ${ITF[f2n].name} x = 90° लगाइए।`),
            formula: R`${ITF[f1].tex}x + ${ITF[f2n].tex}x = \dfrac{\pi}{2}`,
            solution: S(R`$${ITF[f2n].tex}x + ${ITF[f2n].tex}y = \left(90^\circ - ${ITF[f1].tex}x\right) + \left(90^\circ - ${ITF[f1].tex}y\right)$`, R`$= 180^\circ - ${S0}^\circ = ${180 - S0}^\circ$`),
          });
        }
        const tri = r.pick(TRI), inner = r.pick(["sin", "cos", "tan"]);
        const outer = r.pick(["sin", "cos", "tan"].filter((x) => x !== inner));
        const [in1, in2] = rep(inner, tri), [n, d] = rep(outer, tri);
        const ex = R`${"\\" + outer}\left(${"\\" + inner}^{-1} \dfrac{${in1}}{${in2}}\right)`;
        return taskL(lang, {
          text: L(`Find the value of $${ex}$.`, `$${ex}$ का मान ज्ञात कीजिए।`) + fracNote(L),
          answer: fractionM(n, d, [[d / n, L("You inverted the ratio; check which side goes on top.", "आपने अनुपात उलट दिया; देखिए कौन-सी भुजा अंश में आती है।")], [in1 / in2, L(`That is the ${inner} of the angle; the question asks for its ${outer}.`, `यह कोण का ${inner} है; प्रश्न उसका ${outer} पूछता है।`)]]),
          data: { given: [R`\theta = ${"\\" + inner}^{-1} \dfrac{${in1}}{${in2}}`], find: [R`${"\\" + outer}\,\theta`] },
          hint: L("Draw a right triangle for θ with the given ratio and find the third side by Pythagoras.", "दिए गए अनुपात से θ के लिए एक समकोण त्रिभुज बनाइए और पाइथागोरस से तीसरी भुजा ज्ञात कीजिए।"),
          formula: R`a^2 + b^2 = c^2`,
          solution: S(
            R`$${"\\" + inner}\,\theta = \dfrac{${in1}}{${in2}}$, θ ${L("is acute", "न्यून कोण है")}.`,
            L(`Sides of the triangle: opposite ${tri[0]}, adjacent ${tri[1]}, hypotenuse ${tri[2]}.`, `त्रिभुज की भुजाएँ: सम्मुख ${tri[0]}, संलग्न ${tri[1]}, कर्ण ${tri[2]}।`),
            R`$${"\\" + outer}\,\theta = \dfrac{${n}}{${d}}$`,
          ),
        });
      }
      const v = r.int(0, 2);
      if (v === 0) {
        const D = r.pick([-60, -30, 0, 30, 60]), form = r.int(0, 1);
        const ang = (90 + D) / 2;
        const x = form === 0 ? Math.sin((ang * Math.PI) / 180) : Math.cos((ang * Math.PI) / 180);
        const xr = Math.round(x * 1e10) / 1e10;
        const [fa, fb] = form === 0 ? ["sin", "cos"] : ["cos", "sin"];
        return taskL(lang, {
          text: L(`Solve for x: $${ITF[fa].tex}x - ${ITF[fb].tex}x = ${piTex(D)}$.`, `x के लिए हल कीजिए: $${ITF[fa].tex}x - ${ITF[fb].tex}x = ${piTex(D)}$।`) + rnd(xr, lang),
          answer: ansN(xr, [[ang, L("That is the angle; x is its " + fa + ".", "यह कोण है; x उसका " + fa + " है।")], [Math.round((form === 0 ? Math.sin(((90 - D) * Math.PI) / 360) : Math.cos(((90 - D) * Math.PI) / 360)) * 1e10) / 1e10, L("Add the two equations correctly: 2·(the first inverse) = 90° + the given angle.", "दोनों समीकरणों को ठीक से जोड़िए: 2·(पहला प्रतिलोम) = 90° + दिया कोण।")]]),
          data: { given: [R`${ITF[fa].tex}x - ${ITF[fb].tex}x = ${piTex(D)}`], find: ["x"] },
          hint: L("Add the identity sin⁻¹x + cos⁻¹x = π/2 to the given equation.", "दिए गए समीकरण में सर्वसमिका sin⁻¹x + cos⁻¹x = π/2 जोड़िए।"),
          formula: R`\sin^{-1}x + \cos^{-1}x = \dfrac{\pi}{2}`,
          solution: S(
            L("Adding the two equations:", "दोनों समीकरणों को जोड़ने पर:"),
            R`$2\,${ITF[fa].tex}x = 90^\circ ${D < 0 ? "-" : "+"} ${Math.abs(D)}^\circ \Rightarrow ${ITF[fa].tex}x = ${ang}^\circ$`,
            R`$x = ${"\\" + fa}\,${ang}^\circ ${eqs(xr)} ${f2(xr)}$`,
          ),
        });
      }
      if (v === 1) {
        let p1, q1, p2, q2, plus;
        do { p1 = r.int(1, 5); q1 = r.int(2, 9); p2 = r.int(1, 5); q2 = r.int(2, 9); plus = r.int(0, 1) === 1; } while (p1 >= q1 || p2 >= q2 || gcd(p1, q1) > 1 || gcd(p2, q2) > 1 || (p1 === p2 && q1 === q2) || (!plus && p1 * q2 <= p2 * q1));
        const n = plus ? p1 * q2 + p2 * q1 : p1 * q2 - p2 * q1, d = plus ? q1 * q2 - p1 * p2 : q1 * q2 + p1 * p2;
        const sg1 = plus ? "+" : "-";
        return taskL(lang, {
          text: L(R`If $\tan^{-1}${fracTex(p1, q1)} ${sg1} \tan^{-1}${fracTex(p2, q2)} = \tan^{-1}x$, find x.`, R`यदि $\tan^{-1}${fracTex(p1, q1)} ${sg1} \tan^{-1}${fracTex(p2, q2)} = \tan^{-1}x$ है, तो x ज्ञात कीजिए।`) + fracNote(L),
          answer: fractionM(n, d, [[n / (q1 * q2), L("tan⁻¹a ± tan⁻¹b is not tan⁻¹(a ± b); use the formula with 1 ∓ ab.", "tan⁻¹a ± tan⁻¹b, tan⁻¹(a ± b) नहीं है; 1 ∓ ab वाला सूत्र लगाइए।")], [n / (plus ? q1 * q2 + p1 * p2 : q1 * q2 - p1 * p2), L(`Check the sign in the denominator: it is 1 ${plus ? "−" : "+"} ab.`, `हर में चिह्न जाँचिए: यह 1 ${plus ? "−" : "+"} ab है।`)]]),
          data: { given: [`a = ${fracTex(p1, q1)}`, `b = ${fracTex(p2, q2)}`], find: ["x"] },
          hint: L("Use the addition formula for tan⁻¹ (here ab < 1).", "tan⁻¹ के योग/अंतर सूत्र का प्रयोग कीजिए (यहाँ ab < 1 है)।"),
          formula: plus ? R`\tan^{-1}a + \tan^{-1}b = \tan^{-1}\dfrac{a + b}{1 - ab}` : R`\tan^{-1}a - \tan^{-1}b = \tan^{-1}\dfrac{a - b}{1 + ab}`,
          solution: S(
            R`$x = \dfrac{${fracTex(p1, q1)} ${sg1} ${fracTex(p2, q2)}}{1 ${plus ? "-" : "+"} ${fracTex(p1, q1)} \cdot ${fracTex(p2, q2)}} = \dfrac{${fracTex(n, q1 * q2)}}{${fracTex(d, q1 * q2)}}$`,
            R`$x = ${fracTex(n, d)}$`,
            L("(Multiply numerator and denominator by", "(अंश और हर को") + ` ${q1 * q2} ` + L("to clear the fractions.)", "से गुणा करके भिन्न हटाइए।)"),
          ),
        });
      }
      let t1, t2;
      do { t1 = r.pick(TRI); t2 = r.pick(TRI); } while (t1 === t2);
      const r1 = r.pick(["sin", "cos", "tan"]), r2f = r.pick(["sin", "cos", "tan"]), outer = r.pick(["sin", "cos"]);
      const [a1, b1, c1] = t1, [a2, b2, c2] = t2;
      const num = outer === "sin" ? a1 * b2 + b1 * a2 : b1 * b2 - a1 * a2, den = c1 * c2;
      const [x1, y1] = rep(r1, t1), [x2, y2] = rep(r2f, t2);
      const ex = R`${"\\" + outer}\left(${"\\" + r1}^{-1}\dfrac{${x1}}{${y1}} + ${"\\" + r2f}^{-1}\dfrac{${x2}}{${y2}}\right)`;
      return taskL(lang, {
        text: L(`Find the value of $${ex}$.`, `$${ex}$ का मान ज्ञात कीजिए।`) + fracNote(L),
        answer: fractionM(num, den, outer === "sin"
          ? [[a1 / c1 + a2 / c2, L("sin(A + B) ≠ sin A + sin B; use the expansion.", "sin(A + B) ≠ sin A + sin B; प्रसार सूत्र लगाइए।")], [(a1 * b2 - b1 * a2) / den, L("sin(A + B) = sin A cos B + cos A sin B (plus sign).", "sin(A + B) = sin A cos B + cos A sin B (धन चिह्न)।")]]
          : [[(b1 * b2 + a1 * a2) / den, L("cos(A + B) = cos A cos B − sin A sin B (minus sign).", "cos(A + B) = cos A cos B − sin A sin B (ऋण चिह्न)।")], [b1 / c1 + b2 / c2, L("cos(A + B) ≠ cos A + cos B; use the expansion.", "cos(A + B) ≠ cos A + cos B; प्रसार सूत्र लगाइए।")]]),
        data: { given: [R`A = ${"\\" + r1}^{-1}\dfrac{${x1}}{${y1}}`, R`B = ${"\\" + r2f}^{-1}\dfrac{${x2}}{${y2}}`], find: [R`${"\\" + outer}(A + B)`] },
        hint: L("Find sin and cos of each angle from a right triangle, then expand.", "समकोण त्रिभुज से प्रत्येक कोण का sin और cos ज्ञात कीजिए, फिर प्रसार कीजिए।"),
        formula: outer === "sin" ? R`\sin(A + B) = \sin A\cos B + \cos A\sin B` : R`\cos(A + B) = \cos A\cos B - \sin A\sin B`,
        solution: S(
          R`$\sin A = \dfrac{${a1}}{${c1}},\ \cos A = \dfrac{${b1}}{${c1}},\ \sin B = \dfrac{${a2}}{${c2}},\ \cos B = \dfrac{${b2}}{${c2}}$`,
          outer === "sin" ? R`$\sin(A + B) = \dfrac{${a1} \cdot ${b2} + ${b1} \cdot ${a2}}{${den}} = ${fracTex(num, den)}$` : R`$\cos(A + B) = \dfrac{${b1} \cdot ${b2} - ${a1} \cdot ${a2}}{${den}} = ${fracTex(num, den)}$`,
          L("(Both angles are acute, so all these values are positive.)", "(दोनों कोण न्यून हैं, अतः ये सभी मान धनात्मक हैं।)"),
        ),
      });
    },
  },
  // ───────────────────────── Three-dimensional geometry ─────────────────────────
  {
    id: "exi-mat-3d-lines",
    topics: [T("three-dimensional-geometry")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const qv = () => {
        const [a, b, c, d] = r.pick(QUAD);
        const v = r.shuffle([a, b, c]).map((x) => x * r.pick([1, -1]));
        return [v, d];
      };
      const dot = (u, w) => u[0] * w[0] + u[1] * w[1] + u[2] * w[2];
      if (level === 1) {
        const v = r.int(0, 2);
        if (v < 2) {
          const [dr, d] = qv();
          const k = r.pick([1, 1, 2, 3]);
          const ax = r.int(0, 2), nm = "lmn"[ax], axn = "xyz"[ax];
          const P0 = [r.int(-5, 5), r.int(-5, 5), r.int(-5, 5)];
          const Q0 = P0.map((x, i) => x + dr[i] * k);
          const sum = Math.abs(dr[0]) + Math.abs(dr[1]) + Math.abs(dr[2]);
          return taskL(lang, {
            text: v === 0
              ? L(`A line has direction ratios ${dr.map((x) => x * k).join(", ")}. Taking the direction cosines with the same signs as these direction ratios, find ${nm} (the direction cosine with the ${axn}-axis).`, `एक रेखा के दिक्-अनुपात ${dr.map((x) => x * k).join(", ")} हैं। इन्हीं चिह्नों वाली दिक्-कोसाइन लेते हुए ${nm} (${axn}-अक्ष के साथ दिक्-कोसाइन) ज्ञात कीजिए।`) + fracNote(L)
              : L(`Find the direction cosine ${nm} (with the ${axn}-axis) of the line directed from P(${P0.join(", ")}) to Q(${Q0.join(", ")}).`, `बिंदु P(${P0.join(", ")}) से Q(${Q0.join(", ")}) की ओर दिष्ट रेखा की दिक्-कोसाइन ${nm} (${axn}-अक्ष के साथ) ज्ञात कीजिए।`) + fracNote(L),
            answer: fractionM(dr[ax], d, [[dr[ax] / sum, L("Divide by √(a² + b² + c²), not by a + b + c.", "√(a² + b² + c²) से भाग दीजिए, a + b + c से नहीं।")], [dr[ax] / (d * d), L("Take the square root of a² + b² + c².", "a² + b² + c² का वर्गमूल लीजिए।")], [-dr[ax] / d, L(v === 1 ? "Direction ratios are Q − P (from P to Q)." : "Keep the sign of the direction ratio.", v === 1 ? "दिक्-अनुपात Q − P हैं (P से Q की ओर)।" : "दिक्-अनुपात का चिह्न बनाए रखिए।")]]),
            data: { given: v === 0 ? [`(a, b, c) = (${dr.map((x) => x * k).join(", ")})`] : [`P(${P0.join(", ")})`, `Q(${Q0.join(", ")})`], find: [nm] },
            hint: L("Divide each direction ratio by √(a² + b² + c²).", "प्रत्येक दिक्-अनुपात को √(a² + b² + c²) से भाग दीजिए।"),
            formula: R`l = \dfrac{a}{\sqrt{a^2 + b^2 + c^2}},\ m = \dfrac{b}{\sqrt{a^2 + b^2 + c^2}},\ n = \dfrac{c}{\sqrt{a^2 + b^2 + c^2}}`,
            solution: S(
              v === 1 ? R`$(a, b, c) = Q - P = (${dr.map((x) => x * k).join(", ")})$` : "",
              R`$\sqrt{a^2 + b^2 + c^2} = \sqrt{${dr.map((x) => (x * k) ** 2).join(" + ")}} = ${d * k}$`,
              R`$${nm} = \dfrac{${dr[ax] * k}}{${d * k}} = ${fracTex(dr[ax], d)}$`,
              L("(The three direction cosines satisfy l² + m² + n² = 1.)", "(तीनों दिक्-कोसाइन l² + m² + n² = 1 को संतुष्ट करती हैं।)"),
            ),
          });
        }
        const [al, be, ga] = r.pick([[60, 45, 60], [45, 60, 60], [60, 60, 45], [45, 45, 90], [90, 60, 30], [30, 90, 60], [60, 90, 30], [90, 45, 45], [45, 90, 45], [90, 30, 60]]);
        return taskL(lang, {
          text: L(`A line makes angles ${al}° and ${be}° with the x-axis and the y-axis. Find the angle γ (with 0° ≤ γ ≤ 90°) it makes with the z-axis, in degrees.`, `एक रेखा x-अक्ष और y-अक्ष के साथ क्रमशः ${al}° और ${be}° के कोण बनाती है। z-अक्ष के साथ इसका कोण γ (0° ≤ γ ≤ 90°) अंशों में ज्ञात कीजिए।`),
          answer: numM(ga, null, [[180 - al - be, L("The angles with the axes do not add up to 180°; use l² + m² + n² = 1.", "अक्षों के साथ कोणों का योग 180° नहीं होता; l² + m² + n² = 1 लगाइए।")], [90 - ga === ga ? NaN : 90 - ga, L("You solved for sin γ instead of cos γ.", "आपने cos γ के स्थान पर sin γ से कोण निकाला।")]]),
          data: { given: [R`\alpha = ${al}^\circ`, R`\beta = ${be}^\circ`], find: [R`\gamma`] },
          hint: L("The direction cosines satisfy cos²α + cos²β + cos²γ = 1.", "दिक्-कोसाइन cos²α + cos²β + cos²γ = 1 को संतुष्ट करती हैं।"),
          formula: R`\cos^2\alpha + \cos^2\beta + \cos^2\gamma = 1`,
          solution: S(
            R`$\cos^2\gamma = 1 - \cos^2 ${al}^\circ - \cos^2 ${be}^\circ = 1 - ${fracTex(Math.round(4 * Math.cos((al * Math.PI) / 180) ** 2), 4)} - ${fracTex(Math.round(4 * Math.cos((be * Math.PI) / 180) ** 2), 4)} = ${fracTex(Math.round(4 * Math.cos((ga * Math.PI) / 180) ** 2), 4)}$`,
            L(`With 0° ≤ γ ≤ 90°, γ = ${ga}°.`, `0° ≤ γ ≤ 90° लेने पर γ = ${ga}°।`),
          ),
        });
      }
      if (level === 2) {
        if (r.int(0, 1) === 0) {
          let A, dA, B, dB;
          do { [A, dA] = qv(); [B, dB] = qv(); } while (A.every((x, i) => Math.abs(x) === Math.abs(B[i])));
          const c = dot(A, B), cosv = Math.abs(c) / (dA * dB);
          const th = (Math.acos(cosv) * 180) / Math.PI;
          const sym = r.int(0, 1) === 1;
          const P1 = [r.int(-3, 3), r.int(-3, 3), r.int(-3, 3)], P2 = [r.int(-3, 3), r.int(-3, 3), r.int(-3, 3)];
          const lineTex = (P, v2) => ["x", "y", "z"].map((x, i) => R`\dfrac{${lin(-P[i], x)}}{${v2[i]}}`).join(" = ");
          return taskL(lang, {
            text: (sym
              ? L(`Find the angle between the lines $${lineTex(P1, A)}$ and $${lineTex(P2, B)}$, in degrees.`, `रेखाओं $${lineTex(P1, A)}$ और $${lineTex(P2, B)}$ के बीच का कोण अंशों में ज्ञात कीजिए।`)
              : L(`Find the angle between two lines with direction ratios ${A.join(", ")} and ${B.join(", ")}, in degrees.`, `दिक्-अनुपात ${A.join(", ")} और ${B.join(", ")} वाली दो रेखाओं के बीच का कोण अंशों में ज्ञात कीजिए।`)) + rnd(th, lang) + L(" (Take the acute angle.)", " (न्यून कोण लीजिए।)"),
            answer: ansN(th, [[c < 0 ? 180 - th : th + 90, c < 0 ? L("The angle between lines uses |cos θ|; take the acute angle.", "रेखाओं के बीच कोण में |cos θ| लिया जाता है; न्यून कोण लीजिए।") : L("Use cos θ, not sin θ, for the angle between direction ratios.", "दिक्-अनुपातों के बीच कोण के लिए cos θ लीजिए, sin θ नहीं।")], [(Math.acos(Math.min(1, Math.abs(c) / (dA * dA + dB * dB))) * 180) / Math.PI, L("Divide by the product of the magnitudes, √(a₁²+b₁²+c₁²)·√(a₂²+b₂²+c₂²).", "परिमाणों के गुणनफल √(a₁²+b₁²+c₁²)·√(a₂²+b₂²+c₂²) से भाग दीजिए।")]]),
            data: { given: [`(a_1, b_1, c_1) = (${A.join(", ")})`, `(a_2, b_2, c_2) = (${B.join(", ")})`], find: [R`\theta`] },
            hint: L(sym ? "Read the direction ratios from the denominators, then use the dot-product formula." : "Use the dot-product formula for the cosine of the angle.", sym ? "हरों से दिक्-अनुपात पढ़िए, फिर अदिश गुणनफल वाला सूत्र लगाइए।" : "कोण की कोसाइन के लिए अदिश गुणनफल वाला सूत्र लगाइए।"),
            formula: R`\cos\theta = \dfrac{|a_1a_2 + b_1b_2 + c_1c_2|}{\sqrt{a_1^2 + b_1^2 + c_1^2}\,\sqrt{a_2^2 + b_2^2 + c_2^2}}`,
            solution: S(
              R`$a_1a_2 + b_1b_2 + c_1c_2 = ${c}$, $\sqrt{a_1^2 + b_1^2 + c_1^2} = ${dA}$, $\sqrt{a_2^2 + b_2^2 + c_2^2} = ${dB}$`,
              R`$\cos\theta = \dfrac{${Math.abs(c)}}{${dA * dB}}${Math.abs(c) ? ` \\approx ${en(cosv, 4)}` : ""}$`,
              R`$\theta ${eqs(th)} ${f2(th)}^\circ$`,
            ),
          });
        }
        const par = r.int(0, 2) === 0;
        if (par) {
          const [A] = qv(), m = r.pick([2, 3, -2]), ax = r.int(0, 2);
          const B = A.map((x) => x * m);
          const shown = B.map((x, i) => (i === ax ? "k" : x));
          return taskL(lang, {
            text: L(`Find k if the line with direction ratios ${A.join(", ")} is parallel to the line with direction ratios ${shown.join(", ")}.`, `k ज्ञात कीजिए, यदि दिक्-अनुपात ${A.join(", ")} वाली रेखा, दिक्-अनुपात ${shown.join(", ")} वाली रेखा के समांतर है।`),
            answer: numM(B[ax], null, [[A[ax], L("Parallel lines have proportional direction ratios; find the common factor first.", "समांतर रेखाओं के दिक्-अनुपात समानुपाती होते हैं; पहले उभयनिष्ठ गुणक ज्ञात कीजिए।")], [-B[ax], L("Keep the sign of the proportionality factor.", "समानुपात गुणक का चिह्न बनाए रखिए।")]]),
            data: { given: [`(${A.join(", ")})`, `(${shown.join(", ")})`], find: ["k"] },
            hint: L("For parallel lines a₂/a₁ = b₂/b₁ = c₂/c₁.", "समांतर रेखाओं के लिए a₂/a₁ = b₂/b₁ = c₂/c₁।"),
            formula: R`\dfrac{a_2}{a_1} = \dfrac{b_2}{b_1} = \dfrac{c_2}{c_1}`,
            solution: S(L(`The known pairs give the factor ${m}.`, `ज्ञात युग्मों से गुणक ${m} मिलता है।`), R`$k = ${m} \times ${pm(A[ax])} = ${B[ax]}$`),
          });
        }
        let a1, b1, a2, b2, c2, k, kc;
        do { a1 = r.nonZero(-5, 5); b1 = r.nonZero(-5, 5); a2 = r.nonZero(-5, 5); b2 = r.nonZero(-5, 5); c2 = r.nonZero(-5, 5); k = r.nonZero(-6, 6); kc = a1 * a2 + b1 * b2 + k * c2; } while (kc !== 0);
        return taskL(lang, {
          text: L(`Find k if the lines with direction ratios ${a1}, ${b1}, k and ${a2}, ${b2}, ${c2} are perpendicular.`, `k ज्ञात कीजिए, यदि दिक्-अनुपात ${a1}, ${b1}, k और ${a2}, ${b2}, ${c2} वाली रेखाएँ परस्पर लंब हैं।`),
          answer: numM(k, null, [[-k, L("Move the terms carefully: a₁a₂ + b₁b₂ + k·c₂ = 0.", "पदों को सावधानी से स्थानांतरित कीजिए: a₁a₂ + b₁b₂ + k·c₂ = 0।")], [(a2 / a1) * c2, L("Perpendicular lines need a zero dot product, not proportional direction ratios.", "लंब रेखाओं के लिए अदिश गुणनफल शून्य होता है, दिक्-अनुपात समानुपाती नहीं।")]]),
          data: { given: [`(${a1}, ${b1}, k)`, `(${a2}, ${b2}, ${c2})`], find: ["k"] },
          hint: L("Perpendicular lines: a₁a₂ + b₁b₂ + c₁c₂ = 0.", "लंब रेखाएँ: a₁a₂ + b₁b₂ + c₁c₂ = 0।"),
          formula: R`a_1a_2 + b_1b_2 + c_1c_2 = 0`,
          solution: S(R`$${pm(a1)} \cdot ${pm(a2)} + ${pm(b1)} \cdot ${pm(b2)} + k \cdot ${pm(c2)} = 0$`, R`$${a1 * a2 + b1 * b2} ${sco(c2, "k")} = 0 \Rightarrow k = ${k}$`),
        });
      }
      if (r.int(0, 1) === 0) {
        let a, m, kk, c, n, j, b, e, A0, B0, C0, D0, E0, F0;
        do {
          a = r.int(1, 4); m = r.pick([2, 3, 5, 7]); kk = r.int(1, 3); c = r.int(1, 5); n = r.pick([2, 3, 5, 7]); j = r.int(1, 3); b = r.int(1, 4); e = r.int(1, 6);
          A0 = r.int(1, 9); B0 = m * r.int(1, 3); C0 = r.int(1, 6); D0 = n * r.int(1, 2); E0 = r.int(1, 6); F0 = r.int(1, 9);
        } while (gcd(kk, m) > 1 && kk > 1);
        // L1: (A0 - x)/a = (m y - B0)/(kk p) = (z - C0)/c → DR (-a, kk p/m, c)
        // L2: (D0 - n x)/(j p) = (y - E0)/b = (F0 - z)/e → DR (-j p/n, b, -e)
        // pravokotnost: a j p/n + kk b p/m - c e = 0 → p = c e m n/(a j m + kk b n)
        const pn = c * e * m * n, pd = a * j * m + kk * b * n;
        const naive = -(c * e) / (a * j + kk * b), half = (c * e) / (a * j + kk * b);
        const l1 = R`\dfrac{${A0} - x}{${a}} = \dfrac{${m}y - ${B0}}{${kk === 1 ? "" : kk}p} = \dfrac{z - ${C0}}{${c}}`;
        const l2 = R`\dfrac{${D0} - ${n}x}{${j === 1 ? "" : j}p} = \dfrac{y - ${E0}}{${b}} = \dfrac{${F0} - z}{${e}}`;
        return taskL(lang, {
          text: L(`Find the value of p so that the lines $${l1}$ and $${l2}$ are at right angles.`, `p का मान ज्ञात कीजिए ताकि रेखाएँ $${l1}$ और $${l2}$ परस्पर लंब हों।`) + fracNote(L),
          answer: fractionM(pn, pd, [[naive, L("First write each line in standard form (x − x₁)/a = …: the coefficients of x, y, z must be +1.", "पहले प्रत्येक रेखा को मानक रूप (x − x₁)/a = … में लिखिए: x, y, z के गुणांक +1 होने चाहिए।")], [half, L("Also divide by the coefficient of x, y or z (e.g. 7y − 14 = 7(y − 2)).", "x, y या z के गुणांक से भी भाग दीजिए (जैसे 7y − 14 = 7(y − 2))।")]]),
          hint: L("Rewrite both lines in the standard form (x − x₁)/a = (y − y₁)/b = (z − z₁)/c, read the direction ratios, then use a₁a₂ + b₁b₂ + c₁c₂ = 0.", "दोनों रेखाओं को मानक रूप (x − x₁)/a = (y − y₁)/b = (z − z₁)/c में लिखिए, दिक्-अनुपात पढ़िए, फिर a₁a₂ + b₁b₂ + c₁c₂ = 0 लगाइए।"),
          formula: R`a_1a_2 + b_1b_2 + c_1c_2 = 0`,
          solution: S(
            L("Standard forms:", "मानक रूप:") + R` $\dfrac{x - ${A0}}{-${a}} = \dfrac{y - ${fracTex(B0, m)}}{${fracTex(kk, m)}p} = \dfrac{z - ${C0}}{${c}}$`,
            R`$\dfrac{x - ${fracTex(D0, n)}}{-${fracTex(j, n)}p} = \dfrac{y - ${E0}}{${b}} = \dfrac{z - ${F0}}{-${e}}$`,
            R`$(-${a})\left(-${fracTex(j, n)}p\right) + ${fracTex(kk, m)}p \cdot ${b} + ${c}(-${e}) = 0$`,
            R`$p\left(${fracTex(a * j, n)} + ${fracTex(kk * b, m)}\right) = ${c * e} \Rightarrow p = ${fracTex(pn, pd)}$`,
          ),
        });
      }
      let a1, a2, b1, b2, cr, nrm, num;
      do {
        a1 = [r.int(-3, 3), r.int(-3, 3), r.int(-3, 3)]; a2 = [r.int(-3, 3), r.int(-3, 3), r.int(-3, 3)];
        b1 = [r.nonZero(-3, 3), r.int(-3, 3), r.nonZero(-3, 3)]; b2 = [r.int(-3, 3), r.nonZero(-3, 3), r.nonZero(-3, 3)];
        cr = [b1[1] * b2[2] - b1[2] * b2[1], b1[2] * b2[0] - b1[0] * b2[2], b1[0] * b2[1] - b1[1] * b2[0]];
        nrm = Math.sqrt(dot(cr, cr));
        num = dot(a2.map((x, i) => x - a1[i]), cr);
      } while (nrm === 0 || num === 0);
      const dd = Math.abs(num) / nrm;
      const vt = (v) => poly([[v[0], R`\hat{i}`], [v[1], R`\hat{j}`], [v[2], R`\hat{k}`]]);
      return taskL(lang, {
        text: L(R`Find the shortest distance between the lines $\vec{r} = (${vt(a1)}) + \lambda(${vt(b1)})$ and $\vec{r} = (${vt(a2)}) + \mu(${vt(b2)})$.`, R`रेखाओं $\vec{r} = (${vt(a1)}) + \lambda(${vt(b1)})$ और $\vec{r} = (${vt(a2)}) + \mu(${vt(b2)})$ के बीच की न्यूनतम दूरी ज्ञात कीजिए।`) + rnd(dd, lang),
        answer: ansN(dd, [[Math.abs(num), L("Divide by |b₁ × b₂|.", "|b₁ × b₂| से भाग दीजिए।")], [Math.sqrt(a2.reduce((s, x, i) => s + (x - a1[i]) ** 2, 0)), L("That is the distance between the two given points, not between the lines.", "यह दिए गए दो बिंदुओं के बीच की दूरी है, रेखाओं के बीच की नहीं।")]]),
        data: { given: [R`\vec{a}_1 = ${vt(a1)}`, R`\vec{b}_1 = ${vt(b1)}`, R`\vec{a}_2 = ${vt(a2)}`, R`\vec{b}_2 = ${vt(b2)}`], find: ["d"] },
        hint: L("Find b₁ × b₂ and a₂ − a₁, then project a₂ − a₁ on the common perpendicular.", "b₁ × b₂ और a₂ − a₁ ज्ञात कीजिए, फिर a₂ − a₁ का उभयनिष्ठ लंब पर प्रक्षेप लीजिए।"),
        formula: R`d = \dfrac{\left|(\vec{a}_2 - \vec{a}_1)\cdot(\vec{b}_1 \times \vec{b}_2)\right|}{\left|\vec{b}_1 \times \vec{b}_2\right|}`,
        solution: S(
          R`$\vec{b}_1 \times \vec{b}_2 = ${vt(cr)}$, $|\vec{b}_1 \times \vec{b}_2| = \sqrt{${dot(cr, cr)}}$`,
          R`$(\vec{a}_2 - \vec{a}_1)\cdot(\vec{b}_1 \times \vec{b}_2) = ${num}$`,
          R`$d = \dfrac{${Math.abs(num)}}{\sqrt{${dot(cr, cr)}}} ${eqs(dd)} ${f2(dd)}$`,
        ),
      });
    },
  },
  {
    id: "exi-mat-3d-plane",
    topics: [T("three-dimensional-geometry")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const [[a, b, c], N] = (() => { const [p, q, s, d] = r.pick(QUAD); return [r.shuffle([p, q, s]).map((x) => x * r.pick([1, -1])), d]; })();
      const ptP = [r.int(-5, 5), r.int(-5, 5), r.int(-5, 5)];
      const pl = (dd) => R`${poly([[a, "x"], [b, "y"], [c, "z"]])} ${sg(dd)} = 0`;
      const FD = R`d = \dfrac{|ax_1 + by_1 + cz_1 + d|}{\sqrt{a^2 + b^2 + c^2}}`;
      if (level === 1) {
        let d0;
        do d0 = r.nonZero(-20, 20); while (a * ptP[0] + b * ptP[1] + c * ptP[2] + d0 === 0);
        const s = a * ptP[0] + b * ptP[1] + c * ptP[2] + d0, dist = Math.abs(s) / N;
        if (r.int(0, 2) > 0) {
          return taskL(lang, {
            text: L(`Find the distance of the point (${ptP.join(", ")}) from the plane $${pl(d0)}$.`, `बिंदु (${ptP.join(", ")}) की समतल $${pl(d0)}$ से दूरी ज्ञात कीजिए।`) + rnd(dist, lang),
            answer: ansN(dist, [[Math.abs(s), L("Divide by √(a² + b² + c²).", "√(a² + b² + c²) से भाग दीजिए।")], [Math.abs(s - d0) / N, L("Include the constant term d in the numerator.", "अंश में अचर पद d भी शामिल कीजिए।")], [s / N < 0 ? s / N : NaN, L("Distance is never negative: take the modulus.", "दूरी कभी ऋणात्मक नहीं होती: मापांक लीजिए।")]]),
            data: { given: [`P(${ptP.join(", ")})`, pl(d0)], find: ["d"] },
            hint: L("Substitute the point into the left side of the plane's equation and divide by the length of the normal.", "बिंदु को समतल के समीकरण के बाएँ पक्ष में रखिए और अभिलंब की लंबाई से भाग दीजिए।"),
            formula: FD,
            solution: S(R`$${poly([[a, `(${ptP[0]})`], [b, `(${ptP[1]})`], [c, `(${ptP[2]})`]])} ${sg(d0)} = ${s}$`, R`$\sqrt{${a * a} + ${b * b} + ${c * c}} = ${N}$`, R`$d = \dfrac{${Math.abs(s)}}{${N}} ${eqs(dist)} ${f2(dist)}$`, L("(The distance is in the same units as the coordinates.)", "(दूरी निर्देशांकों की इकाइयों में है।)")),
          });
        }
        const ax = r.int(0, 2), nm = "lmn"[ax], dpl = Math.abs(d0);
        return taskL(lang, {
          text: L(`For the plane $${pl(d0)}$, find the direction cosine ${nm} of its unit normal directed from the origin to the plane.`, `समतल $${pl(d0)}$ के मूल बिंदु से समतल की ओर दिष्ट इकाई अभिलंब की दिक्-कोसाइन ${nm} ज्ञात कीजिए।`) + fracNote(L),
          answer: fractionM([a, b, c][ax] * (d0 < 0 ? 1 : -1), N, [[([a, b, c][ax] * (d0 < 0 ? 1 : -1)) / dpl, L("Divide by √(a² + b² + c²), not by the constant.", "√(a² + b² + c²) से भाग दीजिए, अचर पद से नहीं।")], [([a, b, c][ax] * (d0 < 0 ? -1 : 1)) / N, L("Write the plane as ax + by + cz = p with p > 0 first; this may change the signs.", "पहले समतल को ax + by + cz = p (p > 0) के रूप में लिखिए; इससे चिह्न बदल सकते हैं।")]]),
          data: { given: [pl(d0)], find: [nm] },
          hint: L("Bring the plane to the normal form lx + my + nz = p with p ≥ 0.", "समतल को अभिलंब रूप lx + my + nz = p (p ≥ 0) में लाइए।"),
          formula: R`lx + my + nz = p,\quad l = \dfrac{a}{\sqrt{a^2 + b^2 + c^2}}`,
          solution: S(
            R`$${poly([[a * (d0 < 0 ? 1 : -1), "x"], [b * (d0 < 0 ? 1 : -1), "y"], [c * (d0 < 0 ? 1 : -1), "z"]])} = ${dpl}$`,
            R`$\sqrt{${a * a} + ${b * b} + ${c * c}} = ${N}$`,
            R`$${nm} = ${fracTex([a, b, c][ax] * (d0 < 0 ? 1 : -1), N)}$`,
            L(`(The distance of the plane from the origin is p = ${dpl}/${N}.)`, `(समतल की मूल बिंदु से दूरी p = ${dpl}/${N} है।)`),
          ),
        });
      }
      if (level === 2) {
        if (r.int(0, 1) === 0) {
          const k = r.pick([2, 3, -2]);
          let d1, d2;
          do { d1 = r.int(-15, 15); d2 = r.int(-30, 30); } while (d1 * k === d2);
          const dist = Math.abs(d1 - d2 / k) / N;
          const p2 = R`${poly([[k * a, "x"], [k * b, "y"], [k * c, "z"]])} = ${d2}`;
          return taskL(lang, {
            text: L(`Find the distance between the parallel planes $${poly([[a, "x"], [b, "y"], [c, "z"]])} = ${d1}$ and $${p2}$.`, `समांतर समतलों $${poly([[a, "x"], [b, "y"], [c, "z"]])} = ${d1}$ और $${p2}$ के बीच की दूरी ज्ञात कीजिए।`) + rnd(dist, lang),
            answer: ansN(dist, [[Math.abs(d1 - d2) / N, L(`First divide the second equation by ${k} so that both have the same coefficients.`, `पहले दूसरे समीकरण को ${k} से भाग दीजिए ताकि दोनों के गुणांक समान हों।`)], [Math.abs(d1 - d2) / (Math.abs(k) * N), L("Make the coefficients equal before subtracting the constants.", "अचर पद घटाने से पहले गुणांक बराबर कीजिए।")]]),
            data: { given: [R`${poly([[a, "x"], [b, "y"], [c, "z"]])} = ${d1}`, p2], find: ["d"] },
            hint: L("Write both planes with identical coefficients of x, y, z.", "दोनों समतलों में x, y, z के गुणांक एक जैसे कीजिए।"),
            formula: R`d = \dfrac{|d_1 - d_2|}{\sqrt{a^2 + b^2 + c^2}}`,
            solution: S(L(`Divide the second equation by ${k}:`, `दूसरे समीकरण को ${k} से भाग दीजिए:`) + R` $${poly([[a, "x"], [b, "y"], [c, "z"]])} = ${fracTex(d2, k)}$`, R`$d = \dfrac{\left|${d1} - \left(${fracTex(d2, k)}\right)\right|}{${N}} = ${fracTex(Math.abs(d1 * k - d2), Math.abs(k) * N)} ${eqs(dist)} ${f2(dist)}$`),
          });
        }
        const d0 = r.nonZero(-20, 20);
        const s = a * ptP[0] + b * ptP[1] + c * ptP[2] - d0, dist = Math.abs(s) / N;
        if (s === 0) return null;
        const vt = (v) => poly([[v[0], R`\hat{i}`], [v[1], R`\hat{j}`], [v[2], R`\hat{k}`]]);
        return taskL(lang, {
          text: L(R`Find the distance of the point with position vector $${vt(ptP)}$ from the plane $\vec{r}\cdot(${vt([a, b, c])}) = ${d0}$.`, R`स्थिति सदिश $${vt(ptP)}$ वाले बिंदु की समतल $\vec{r}\cdot(${vt([a, b, c])}) = ${d0}$ से दूरी ज्ञात कीजिए।`) + rnd(dist, lang),
          answer: ansN(dist, [[Math.abs(a * ptP[0] + b * ptP[1] + c * ptP[2] + d0) / N, L("In r·n = d the constant moves to the left as −d.", "r·n = d में अचर पद बाईं ओर −d बनकर जाता है।")], [Math.abs(s), L("Divide by |n|.", "|n| से भाग दीजिए।")]]),
          data: { given: [R`\vec{a} = ${vt(ptP)}`, R`\vec{n} = ${vt([a, b, c])}`, `d = ${d0}`], find: ["D"] },
          hint: L("Distance = |a·n − d| / |n|.", "दूरी = |a·n − d| / |n|।"),
          formula: R`D = \dfrac{|\vec{a}\cdot\vec{n} - d|}{|\vec{n}|}`,
          solution: S(R`$\vec{a}\cdot\vec{n} = ${a * ptP[0] + b * ptP[1] + c * ptP[2]}$, $|\vec{n}| = ${N}$`, R`$D = \dfrac{|${a * ptP[0] + b * ptP[1] + c * ptP[2]} - ${pm(d0)}|}{${N}} ${eqs(dist)} ${f2(dist)}$`),
        });
      }
      const v = r.int(0, 2);
      if (v === 0) {
        const D = r.int(1, 4), s = a * ptP[0] + b * ptP[1] + c * ptP[2];
        const k1 = s + D * N, k2 = s - D * N;
        return taskL(lang, {
          text: L(`The distance of the point (${ptP.join(", ")}) from the plane $${poly([[a, "x"], [b, "y"], [c, "z"]])} = k$ is ${D} units. Find the larger possible value of k.`, `बिंदु (${ptP.join(", ")}) की समतल $${poly([[a, "x"], [b, "y"], [c, "z"]])} = k$ से दूरी ${D} इकाई है। k का बड़ा संभव मान ज्ञात कीजिए।`),
          answer: numM(k1, null, [[k2, L("|s − k| = D·|n| has two solutions; take the larger one.", "|s − k| = D·|n| के दो हल हैं; बड़ा वाला लीजिए।")], [s + D, L("Multiply D by √(a² + b² + c²).", "D को √(a² + b² + c²) से गुणा कीजिए।")]]),
          data: { given: [`P(${ptP.join(", ")})`, `d = ${D}`], find: ["k"] },
          hint: L("Write the distance formula with k and remove the modulus: two cases.", "k सहित दूरी सूत्र लिखिए और मापांक हटाइए: दो स्थितियाँ बनती हैं।"),
          formula: FD,
          solution: S(R`$\dfrac{|${s} - k|}{${N}} = ${D} \Rightarrow |${s} - k| = ${D * N}$`, R`$k = ${s} \pm ${D * N} \Rightarrow k = ${k1}\ \text{${L("or", "या")}}\ k = ${k2}$`, L(`The larger value is ${k1}.`, `बड़ा मान ${k1} है।`)),
        });
      }
      const [q2, N2] = (() => { const [p, q, s, d] = r.pick(QUAD); return [r.shuffle([p, q, s]).map((x) => x * r.pick([1, -1])), d]; })();
      const dt = a * q2[0] + b * q2[1] + c * q2[2];
      const ratio = Math.abs(dt) / (N * N2);
      if (v === 1) {
        const th = (Math.acos(ratio) * 180) / Math.PI;
        const P1 = R`${poly([[a, "x"], [b, "y"], [c, "z"]])} = ${r.int(1, 9)}`, P2 = R`${poly([[q2[0], "x"], [q2[1], "y"], [q2[2], "z"]])} = ${r.int(-9, 9)}`;
        return taskL(lang, {
          text: L(`Find the angle between the planes $${P1}$ and $${P2}$, in degrees (acute angle).`, `समतलों $${P1}$ और $${P2}$ के बीच का न्यून कोण अंशों में ज्ञात कीजिए।`) + rnd(th, lang),
          answer: ansN(th, [[90 - th, L("The angle between planes is the angle between their normals: use cos, not sin.", "समतलों के बीच का कोण उनके अभिलंबों के बीच का कोण है: cos लीजिए, sin नहीं।")], [dt < 0 ? 180 - th : NaN, L("Take |n₁·n₂| to get the acute angle.", "न्यून कोण के लिए |n₁·n₂| लीजिए।")]]),
          data: { given: [P1, P2], find: [R`\theta`] },
          hint: L("Find the angle between the normal vectors.", "अभिलंब सदिशों के बीच का कोण ज्ञात कीजिए।"),
          formula: R`\cos\theta = \dfrac{|\vec{n}_1\cdot\vec{n}_2|}{|\vec{n}_1|\,|\vec{n}_2|}`,
          solution: S(R`$\vec{n}_1\cdot\vec{n}_2 = ${dt}$, $|\vec{n}_1| = ${N}$, $|\vec{n}_2| = ${N2}$`, R`$\cos\theta = \dfrac{${Math.abs(dt)}}{${N * N2}}$`, R`$\theta ${eqs(th)} ${f2(th)}^\circ$`),
        });
      }
      const ph = (Math.asin(ratio) * 180) / Math.PI;
      const P0 = [r.int(-3, 3), r.int(-3, 3), r.int(-3, 3)];
      const lineTex = ["x", "y", "z"].map((x, i) => R`\dfrac{${lin(-P0[i], x)}}{${q2[i]}}`).join(" = ");
      const dpl = r.nonZero(-9, 9);
      return taskL(lang, {
        text: L(`Find the angle between the line $${lineTex}$ and the plane $${pl(dpl)}$, in degrees.`, `रेखा $${lineTex}$ और समतल $${pl(dpl)}$ के बीच का कोण अंशों में ज्ञात कीजिए।`) + rnd(ph, lang),
        answer: ansN(ph, [[90 - ph, L("For a line and a plane use sin φ (the normal is perpendicular to the plane).", "रेखा और समतल के लिए sin φ लीजिए (अभिलंब समतल पर लंब है)।")], [dt < 0 ? -ph : NaN, L("Take the modulus |b·n|.", "मापांक |b·n| लीजिए।")]]),
        data: { given: [R`\vec{b} = (${q2.join(", ")})`, pl(dpl)], find: [R`\varphi`] },
        hint: L("The angle between a line and a plane is 90° minus the angle between the line and the normal.", "रेखा और समतल के बीच का कोण = 90° − (रेखा और अभिलंब के बीच का कोण)।"),
        formula: R`\sin\varphi = \dfrac{|\vec{b}\cdot\vec{n}|}{|\vec{b}|\,|\vec{n}|}`,
        solution: S(R`$\vec{b}\cdot\vec{n} = ${dt}$, $|\vec{b}| = ${N2}$, $|\vec{n}| = ${N}$`, R`$\sin\varphi = \dfrac{${Math.abs(dt)}}{${N * N2}}$`, R`$\varphi ${eqs(ph)} ${f2(ph)}^\circ$`),
      });
    },
  },
  // ───────────────────────── Limits and continuity ─────────────────────────
  {
    id: "exi-mat-limits",
    topics: [T("limits-and-continuity")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const cx = (k, v = "x") => (k === 1 ? v : k === -1 ? "-" + v : k + v);
      const tf = (n, d) => (n === 0 ? "" : ` ${n < 0 ? "-" : "+"} \\frac{${Math.abs(n)}}{${d}}`);
      const EV = (ex) => L(`Evaluate $${ex}$.`, `$${ex}$ का मान ज्ञात कीजिए।`);
      if (level === 1) {
        const v = r.int(0, 2);
        if (v === 0) {
          let a, b;
          do { a = r.nonZero(-5, 5); b = r.int(-6, 6); } while (a === b);
          const num = poly([[1, "x^2"], [-(a + b), "x"], [a * b, ""]]);
          const ex = R`\lim_{x \to ${a}} \dfrac{${num}}{${lin(-a)}}`;
          return taskL(lang, {
            text: EV(ex),
            answer: numM(a - b, null, [[0, L("Direct substitution gives 0/0, which is indeterminate, not 0. Factorise first.", "सीधे रखने पर 0/0 मिलता है, जो अनिर्धार्य है, 0 नहीं। पहले गुणनखंड कीजिए।")], [a + b, L("After cancelling (x − a), substitute into the remaining factor carefully.", "(x − a) काटने के बाद शेष गुणनखंड में मान सावधानी से रखिए।")]]),
            data: { given: [R`x \to ${a}`, R`\dfrac{0}{0}`], find: ["L"] },
            hint: L(`Substitution gives 0/0, so (x ${a < 0 ? "+" : "−"} ${Math.abs(a)}) is a factor of the numerator.`, `मान रखने पर 0/0 मिलता है, अतः (x ${a < 0 ? "+" : "−"} ${Math.abs(a)}) अंश का एक गुणनखंड है।`),
            formula: R`x^2 - (a + b)x + ab = (x - a)(x - b)`,
            solution: S(L("Factorise the numerator and cancel the common factor:", "अंश के गुणनखंड करके उभयनिष्ठ गुणनखंड काटिए:"), R`$\dfrac{(${lin(-a)})(${lin(-b)})}{${lin(-a)}} = ${lin(-b)}$`, R`$\lim = ${pm(a)} ${b < 0 ? "+" : "-"} ${Math.abs(b)} = ${a - b}$`),
          });
        }
        if (v === 1) {
          const n = r.int(3, 5), a = r.int(1, 3);
          const ex = R`\lim_{x \to ${a}} \dfrac{x^{${n}} - ${a ** n}}{x - ${a}}`;
          return taskL(lang, {
            text: EV(ex),
            answer: numM(n * a ** (n - 1), null, [[a ** (n - 1), L("The standard limit is n·aⁿ⁻¹: multiply by n.", "मानक सीमा n·aⁿ⁻¹ है: n से गुणा कीजिए।")], [n * a ** n, L("The power of a is n − 1, not n.", "a की घात n − 1 है, n नहीं।")]]),
            data: { given: [`n = ${n}`, `a = ${a}`], find: ["L"] },
            hint: L(`Write ${a ** n} as ${a}^${n} and use the standard limit for (xⁿ − aⁿ)/(x − a).`, `${a ** n} को ${a}^${n} लिखिए और (xⁿ − aⁿ)/(x − a) की मानक सीमा लगाइए।`),
            formula: R`\lim_{x \to a} \dfrac{x^n - a^n}{x - a} = n a^{n-1}`,
            solution: S(R`$${a ** n} = ${a}^{${n}}$`, L("Using the standard limit:", "मानक सीमा से:"), R`$\lim = ${n} \cdot ${a}^{${n - 1}} = ${n * a ** (n - 1)}$`),
          });
        }
        let a, b;
        do { a = r.int(1, 9); b = r.int(1, 9); } while (a === b);
        const kind = r.int(0, 2);
        const ex = [R`\lim_{x \to 0} \dfrac{\sin ${cx(a)}}{${cx(b)}}`, R`\lim_{x \to 0} \dfrac{\tan ${cx(a)}}{\sin ${cx(b)}}`, R`\lim_{x \to 0} \dfrac{\sin ${cx(a)}}{\tan ${cx(b)}}`][kind];
        return taskL(lang, {
          text: EV(ex) + fracNote(L),
          answer: fractionM(a, b, [[b / a, L("You inverted the ratio: the coefficient in the numerator goes on top.", "आपने अनुपात उलट दिया: अंश वाला गुणांक ऊपर आता है।")], [1, L("sin(ax)/(bx) → 1 only when a = b; adjust the coefficients.", "sin(ax)/(bx) → 1 केवल तभी जब a = b हो; गुणांकों को समायोजित कीजिए।")]]),
          data: { given: [a !== 1 && `a = ${a}`, b !== 1 && `b = ${b}`].filter(Boolean), find: ["L"] },
          hint: L("Multiply and divide so that each sin or tan is divided by its own angle.", "ऐसे गुणा और भाग कीजिए कि हर sin या tan अपने ही कोण से भाजित हो।"),
          formula: R`\lim_{x \to 0} \dfrac{\sin x}{x} = \lim_{x \to 0} \dfrac{\tan x}{x} = 1`,
          solution: S(L("Rewrite:", "पुनः लिखिए:") + R` $\dfrac{${["\\sin", "\\tan", "\\sin"][kind]} ${cx(a)}}{${cx(a)}} \cdot \dfrac{${cx(b)}}{${["", "\\sin ", "\\tan "][kind]}${cx(b)}} \cdot \dfrac{${a}}{${b}}$`, R`$\lim = 1 \cdot 1 \cdot \dfrac{${a}}{${b}} = ${fracTex(a, b)}$`),
        });
      }
      if (level === 2) {
        const v = r.int(0, 3);
        if (v === 0) {
          const lower = r.int(0, 2) === 0;
          const a = r.nonZero(-6, 6), b = r.int(-9, 9), c = r.nonZero(-9, 9), d = r.nonZero(-5, 5), e = r.int(-9, 9), f = r.nonZero(-9, 9);
          const num = lower ? poly([[b || 1, "x"], [c, ""]]) : poly([[a, "x^2"], [b, "x"], [c, ""]]);
          const den = poly([[d, "x^2"], [e, "x"], [f, ""]]);
          const ex = R`\lim_{x \to \infty} \dfrac{${num}}{${den}}`;
          return taskL(lang, {
            text: EV(ex) + fracNote(L),
            answer: lower ? fractionM(0, 1, [[(b || 1) / d, L("The numerator has a lower degree: divide by x² and every term of the numerator → 0.", "अंश की घात कम है: x² से भाग देने पर अंश का हर पद → 0।")], [c / f, L("That is the limit as x → 0. For x → ∞ the highest powers decide.", "यह x → 0 पर सीमा है। x → ∞ पर उच्चतम घातें निर्णायक होती हैं।")]]) : fractionM(a, d, [[c / f, L("That is the limit as x → 0. For x → ∞ the highest powers decide.", "यह x → 0 पर सीमा है। x → ∞ पर उच्चतम घातें निर्णायक होती हैं।")], [b / e, L("Compare the coefficients of the highest power x², not of x.", "उच्चतम घात x² के गुणांकों की तुलना कीजिए, x के नहीं।")]]),
            data: { given: [R`x \to \infty`], find: ["L"] },
            hint: L("Divide the numerator and the denominator by the highest power of x in the denominator.", "अंश और हर दोनों को हर में x की उच्चतम घात से भाग दीजिए।"),
            formula: R`\lim_{x \to \infty} \dfrac{1}{x^k} = 0\quad (k > 0)`,
            solution: S(L("Divide every term by x²:", "हर पद को x² से भाग दीजिए:"), lower ? R`$\dfrac{\frac{${b || 1}}{x}${tf(c, "x^2")}}{${d}${tf(e, "x")}${tf(f, "x^2")}} \to \dfrac{0}{${d}} = 0$` : R`$\dfrac{${a}${tf(b, "x")}${tf(c, "x^2")}}{${d}${tf(e, "x")}${tf(f, "x^2")}} \to \dfrac{${a}}{${d}} = ${fracTex(a, d)}$`),
          });
        }
        if (v === 1) {
          const a = r.int(2, 8), b = r.int(1, 4);
          const ex = R`\lim_{x \to 0} \dfrac{1 - \cos ${a}x}{${b === 1 ? "" : b}x^2}`;
          return taskL(lang, {
            text: EV(ex) + fracNote(L),
            answer: fractionM(a * a, 2 * b, [[a / (2 * b), L("1 − cos ax = 2 sin²(ax/2): the a gets squared.", "1 − cos ax = 2 sin²(ax/2): a का वर्ग होता है।")], [(a * a) / b, L("Remember the factor 1/2 from 1 − cos θ = 2 sin²(θ/2).", "1 − cos θ = 2 sin²(θ/2) से आने वाला 1/2 याद रखिए।")]]),
            data: { given: [`a = ${a}`, b !== 1 && `b = ${b}`].filter(Boolean), find: ["L"] },
            hint: L("Use 1 − cos θ = 2 sin²(θ/2) and then the standard limit sin t / t → 1.", "1 − cos θ = 2 sin²(θ/2) लगाइए, फिर मानक सीमा sin t / t → 1।"),
            formula: R`1 - \cos\theta = 2\sin^2\dfrac{\theta}{2}`,
            solution: S(R`$\dfrac{2\sin^2 \frac{${a}x}{2}}{${b === 1 ? "" : b}x^2} = \dfrac{2}{${b}} \cdot \left(\dfrac{\sin \frac{${a}x}{2}}{\frac{${a}x}{2}}\right)^2 \cdot \dfrac{${a * a}}{4}$`, R`$\lim = \dfrac{2}{${b}} \cdot 1 \cdot \dfrac{${a * a}}{4} = ${fracTex(a * a, 2 * b)}$`),
          });
        }
        if (v === 2) {
          let a, b;
          do { a = r.int(1, 6); b = r.int(1, 5); } while (a === b);
          const kind = r.int(0, 2);
          if (kind === 0) {
            const ex = R`\lim_{x \to 0} (1 + ${cx(a)})^{\frac{${b}}{x}}`;
            return taskL(lang, {
              text: L(`If $${ex} = e^k$, find k.`, `यदि $${ex} = e^k$ है, तो k ज्ञात कीजिए।`),
              answer: numM(a * b, null, [[b, L("Write the power as (1/(ax))·(ab): the a also goes into the exponent.", "घात को (1/(ax))·(ab) लिखिए: a भी घातांक में जाता है।")], [a + b, L("The constants multiply in the exponent, they do not add.", "घातांक में अचर गुणा होते हैं, जुड़ते नहीं।")]]),
              data: { given: [a !== 1 && `a = ${a}`, `b = ${b}`].filter(Boolean), find: ["k"] },
              hint: L("Use the standard limit (1 + t)^(1/t) → e as t → 0.", "मानक सीमा (1 + t)^(1/t) → e (t → 0) का प्रयोग कीजिए।"),
              formula: R`\lim_{t \to 0}(1 + t)^{1/t} = e`,
              solution: S(R`$(1 + ${cx(a)})^{\frac{${b}}{x}} = \left[(1 + ${cx(a)})^{\frac{1}{${cx(a)}}}\right]^{${a * b}}$`, R`$\lim = e^{${a * b}} \Rightarrow k = ${a * b}$`),
            });
          }
          const ex = kind === 1 ? R`\lim_{x \to 0} \dfrac{e^{${cx(a)}} - 1}{${cx(b)}}` : R`\lim_{x \to 0} \dfrac{\log(1 + ${cx(a)})}{${cx(b)}}`;
          return taskL(lang, {
            text: EV(ex) + fracNote(L),
            answer: fractionM(a, b, [[b / a, L("You inverted the ratio.", "आपने अनुपात उलट दिया।")], [1 / b, L("Make the denominator match the exponent (argument) first: multiply and divide by " + a + ".", "पहले हर को घातांक (तर्क) के समान बनाइए: " + a + " से गुणा और भाग कीजिए।")]]),
            data: { given: [a !== 1 && `a = ${a}`, b !== 1 && `b = ${b}`].filter(Boolean), find: ["L"] },
            hint: kind === 1 ? L("Use (eᵗ − 1)/t → 1 as t → 0.", "(eᵗ − 1)/t → 1 (t → 0) का प्रयोग कीजिए।") : L("Use log(1 + t)/t → 1 as t → 0.", "log(1 + t)/t → 1 (t → 0) का प्रयोग कीजिए।"),
            formula: kind === 1 ? R`\lim_{t \to 0} \dfrac{e^t - 1}{t} = 1` : R`\lim_{t \to 0} \dfrac{\log(1 + t)}{t} = 1`,
            solution: S(L("Multiply and divide by", "गुणा और भाग कीजिए") + ` $${a}$:`, kind === 1 ? R`$\dfrac{e^{${cx(a)}} - 1}{${cx(a)}} \cdot \dfrac{${a}}{${b}} \to 1 \cdot \dfrac{${a}}{${b}} = ${fracTex(a, b)}$` : R`$\dfrac{\log(1 + ${cx(a)})}{${cx(a)}} \cdot \dfrac{${a}}{${b}} \to 1 \cdot \dfrac{${a}}{${b}} = ${fracTex(a, b)}$`),
          });
        }
        const s0 = r.int(1, 5), a = r.int(1, 4);
        const ex = R`\lim_{x \to 0} \dfrac{\sqrt{${s0 * s0} + ${a === 1 ? "" : a}x} - ${s0}}{x}`;
        return taskL(lang, {
          text: EV(ex) + fracNote(L),
          answer: fractionM(a, 2 * s0, [[a / s0, L("After rationalising the denominator is √(…) + " + s0 + ", which tends to " + 2 * s0 + ".", "परिमेयकरण के बाद हर √(…) + " + s0 + " होता है, जो " + 2 * s0 + " की ओर जाता है।")], [0, L("Direct substitution gives 0/0; rationalise first.", "सीधे रखने पर 0/0 मिलता है; पहले परिमेयकरण कीजिए।")]]),
          data: { given: [R`\dfrac{0}{0}`], find: ["L"] },
          hint: L("Multiply numerator and denominator by the conjugate √(…) + " + s0 + ".", "अंश और हर को संयुग्मी √(…) + " + s0 + " से गुणा कीजिए।"),
          formula: R`(\sqrt{p} - q)(\sqrt{p} + q) = p - q^2`,
          solution: S(R`$\dfrac{(${s0 * s0} + ${a === 1 ? "" : a}x) - ${s0 * s0}}{x\left(\sqrt{${s0 * s0} + ${a === 1 ? "" : a}x} + ${s0}\right)} = \dfrac{${a}}{\sqrt{${s0 * s0} + ${a === 1 ? "" : a}x} + ${s0}}$`, R`$\lim = \dfrac{${a}}{${s0} + ${s0}} = ${fracTex(a, 2 * s0)}$`),
        });
      }
      const v = r.int(0, 2);
      if (v === 0) {
        let c, p, q, m, n, kn, kd;
        do { c = r.int(1, 3); p = r.int(1, 2); q = r.int(-5, 5); m = r.nonZero(-4, 4); n = r.int(-6, 6); kn = m * c + n - q; kd = c ** p; } while (kn === 0);
        const left = R`k${p === 2 ? "x^2" : "x"} ${q ? sg(q) : ""}`, right = poly([[m, "x"], [n, ""]]);
        const fx = R`f(x) = \begin{cases} ${left}, & x \le ${c} \\ ${right}, & x > ${c} \end{cases}`;
        return taskL(lang, {
          text: L(`Find the value of k for which $${fx}$ is continuous at x = ${c}.`, `k का वह मान ज्ञात कीजिए जिसके लिए $${fx}$, x = ${c} पर संतत है।`) + fracNote(L),
          answer: fractionM(kn, kd, [[(m * c + n) / kd, L("Include the constant term of the left piece when you equate the two sides.", "दोनों पक्षों को बराबर करते समय बाएँ भाग का अचर पद भी शामिल कीजिए।")], [kn / c, L(`Substitute x = ${c} into x² as well.`, `x² में भी x = ${c} रखिए।`)]]),
          data: { given: [R`\lim_{x \to ${c}^-} f = \lim_{x \to ${c}^+} f = f(${c})`], find: ["k"] },
          hint: L("Continuity at c: the left-hand limit, the right-hand limit and f(c) must be equal.", "c पर सांतत्य: वाम-पक्ष सीमा, दक्षिण-पक्ष सीमा और f(c) बराबर होने चाहिए।"),
          formula: R`\lim_{x \to c^-} f(x) = \lim_{x \to c^+} f(x) = f(c)`,
          solution: S(R`$f(${c}) = k \cdot ${c}${p === 2 ? "^2" : ""} ${q ? sg(q) : ""} = ${cx(kd, "k")} ${q ? sg(q) : ""}$`, R`$\lim_{x \to ${c}^+} f(x) = ${pm(m)} \cdot ${c}${n ? " " + sg(n) : ""} = ${m * c + n}$`, R`$${cx(kd, "k")} ${q ? sg(q) : ""} = ${m * c + n} \Rightarrow k = ${fracTex(kn, kd)}$`),
        });
      }
      if (v === 1) {
        const a = r.int(2, 8), b = r.int(1, 4);
        const fx = R`f(x) = \begin{cases} \dfrac{1 - \cos ${a}x}{${b === 1 ? "" : b}x^2}, & x \ne 0 \\ k, & x = 0 \end{cases}`;
        return taskL(lang, {
          text: L(`Find the value of k for which $${fx}$ is continuous at x = 0.`, `k का वह मान ज्ञात कीजिए जिसके लिए $${fx}$, x = 0 पर संतत है।`) + fracNote(L),
          answer: fractionM(a * a, 2 * b, [[0, L("f(0) = k is not found by putting x = 0 into the first piece (that gives 0/0).", "पहले भाग में x = 0 रखकर k नहीं मिलता (उससे 0/0 मिलता है)।")], [a / (2 * b), L("1 − cos ax = 2 sin²(ax/2): the a gets squared.", "1 − cos ax = 2 sin²(ax/2): a का वर्ग होता है।")]]),
          data: { given: [R`f(0) = k`], find: ["k"] },
          hint: L("k must equal the limit of the first piece as x → 0.", "k, x → 0 पर पहले भाग की सीमा के बराबर होना चाहिए।"),
          formula: R`1 - \cos\theta = 2\sin^2\dfrac{\theta}{2},\quad \lim_{t \to 0}\dfrac{\sin t}{t} = 1`,
          solution: S(R`$\lim_{x \to 0} \dfrac{2\sin^2\frac{${a}x}{2}}{${b === 1 ? "" : b}x^2} = \dfrac{2}{${b}} \cdot \dfrac{${a * a}}{4} = ${fracTex(a * a, 2 * b)}$`, L("For continuity k equals this limit:", "सांतत्य के लिए k इस सीमा के बराबर है:") + R` $k = ${fracTex(a * a, 2 * b)}$`),
        });
      }
      let a, b, p0, q0;
      do { a = r.nonZero(-4, 5); b = r.int(-6, 6); p0 = r.int(1, 4); q0 = p0 + r.int(2, 8); } while (a * p0 + b === a * q0 + b);
      const c1 = a * p0 + b, c2 = a * q0 + b, askA = r.int(0, 1) === 0;
      const fx = R`f(x) = \begin{cases} ${c1}, & x \le ${p0} \\ ax + b, & ${p0} < x < ${q0} \\ ${c2}, & x \ge ${q0} \end{cases}`;
      return taskL(lang, {
        text: L(`Find ${askA ? "a" : "b"} if $${fx}$ is continuous everywhere.`, `यदि $${fx}$ सर्वत्र संतत है, तो ${askA ? "a" : "b"} ज्ञात कीजिए।`),
        answer: numM(askA ? a : b, null, [[askA ? b : a, L(`You found the other constant; the question asks for ${askA ? "a" : "b"}.`, `आपने दूसरा अचर ज्ञात किया; प्रश्न ${askA ? "a" : "b"} पूछता है।`)], [askA ? (c2 - c1) / (q0 + p0) : c1 + a * p0, L("Subtract the two continuity equations carefully.", "सांतत्य के दोनों समीकरणों को सावधानी से घटाइए।")]]),
        data: { given: [`${cx(p0, "a")} + b = ${c1}`, `${q0}a + b = ${c2}`], find: [askA ? "a" : "b"] },
        hint: L(`Continuity at x = ${p0} and at x = ${q0} gives two equations in a and b.`, `x = ${p0} और x = ${q0} पर सांतत्य से a और b में दो समीकरण मिलते हैं।`),
        formula: R`\lim_{x \to c^-} f(x) = \lim_{x \to c^+} f(x) = f(c)`,
        solution: S(L(`At x = ${p0}:`, `x = ${p0} पर:`) + R` $${cx(p0, "a")} + b = ${c1}$`, L(`At x = ${q0}:`, `x = ${q0} पर:`) + R` $${q0}a + b = ${c2}$`, R`$${q0 - p0}a = ${c2 - c1} \Rightarrow a = ${a},\ b = ${b}$`),
      });
    },
  },
  // ───────────────────────── Differential equations ─────────────────────────
  {
    id: "exi-mat-differential-equations",
    topics: [T("differential-equations")],
    langs: ["en", "hi"],
    gen(level, r, _t, lang) {
      const L = bi(lang);
      const Dn = (k) => (k === 0 ? "y" : k === 1 ? R`\dfrac{dy}{dx}` : R`\dfrac{d^{${k}}y}{dx^{${k}}}`);
      const pw = (k, p) => (p === 1 ? Dn(k) : k === 0 ? R`y^{${p}}` : R`\left(${Dn(k)}\right)^{${p}}`);
      const xp = (n) => (n === 0 ? "1" : n === 1 ? "x" : R`x^{${n}}`);
      const ax = (a) => (a === 1 ? "x" : en(a) + "x");
      if (level === 1) {
        if (r.int(0, 1) === 0) {
          const h = r.int(1, 3), p = r.int(1, 3), q = r.int(2, 4), c = r.int(1, 9), ask = r.int(0, 2);
          const extra = r.pick([R`\sin x`, "x", R`e^x`, "0"]);
          const terms = [pw(h, p), R`${c === 1 ? "" : c}${pw(h - 1, q)}`];
          if (r.int(0, 1)) terms.reverse();
          const eq = R`${terms.join(" + ")} = ${extra}`;
          const what = [L("order", "कोटि"), L("degree", "घात"), L("sum of the order and the degree", "कोटि और घात का योग")][ask];
          const ans = [h, p, h + p][ask];
          return taskL(lang, {
            text: L(`Find the ${what} of the differential equation $${eq}$.`, `अवकल समीकरण $${eq}$ की ${what} ज्ञात कीजिए।`),
            answer: numM(ans, null, ask === 0 ? [[p, L("That is the degree. The order is the highest derivative that appears.", "यह घात है। कोटि उच्चतम अवकलज की कोटि होती है।")], [Math.max(p, q), L("The order is not a power: it is the highest derivative.", "कोटि कोई घात नहीं है: यह उच्चतम अवकलज है।")]] : ask === 1 ? [[q, L("The degree is the power of the highest-order derivative, not the largest power in the equation.", "घात उच्चतम कोटि वाले अवकलज की घात है, समीकरण की सबसे बड़ी घात नहीं।")], [h, L("That is the order.", "यह कोटि है।")]] : [[h + q, L("The degree comes from the highest-order derivative only.", "घात केवल उच्चतम कोटि वाले अवकलज से आती है।")], [h * p, L("Add the order and the degree.", "कोटि और घात को जोड़िए।")]]),
            data: { given: [eq], find: [[L(R`\text{order}`, R`\text{कोटि}`), L(R`\text{degree}`, R`\text{घात}`), L(R`\text{order} + \text{degree}`, R`\text{कोटि} + \text{घात}`)][ask]] },
            hint: L("Order: the highest derivative present. Degree: the power of that highest derivative (the equation is a polynomial in the derivatives).", "कोटि: उपस्थित उच्चतम अवकलज। घात: उस उच्चतम अवकलज की घात (समीकरण अवकलजों में बहुपद है)।"),
            formula: L(R`\text{order} = \text{highest derivative},\ \text{degree} = \text{its power}`, R`\text{कोटि} = \text{उच्चतम अवकलज},\ \text{घात} = \text{उसकी घात}`),
            solution: S(L(`Highest derivative: ${h === 1 ? "dy/dx" : `d${h === 2 ? "²" : "³"}y/dx${h === 2 ? "²" : "³"}`}, so the order is ${h}.`, `उच्चतम अवकलज: ${h === 1 ? "dy/dx" : `d${h === 2 ? "²" : "³"}y/dx${h === 2 ? "²" : "³"}`}, अतः कोटि ${h} है।`), L(`Its power is ${p}, so the degree is ${p}.`, `इसकी घात ${p} है, अतः घात ${p} है।`), ask === 2 ? L(`Sum = ${h} + ${p} = ${h + p}.`, `योग = ${h} + ${p} = ${h + p}।`) : ""),
          });
        }
        const a = 3 * r.int(-2, 3), b = 2 * r.int(-3, 3), c = r.int(-5, 5), y0 = r.int(-5, 9), x1 = r.int(1, 4);
        const rhs = poly([[a, "x^2"], [b, "x"], [c, ""]]);
        if (rhs === "0") return null;
        const val = (a * x1 ** 3) / 3 + (b * x1 * x1) / 2 + c * x1 + y0;
        return taskL(lang, {
          text: L(R`Solve $\dfrac{dy}{dx} = ${rhs}$ given that y = ${y0} when x = 0, and find y when x = ${x1}.`, R`$\dfrac{dy}{dx} = ${rhs}$ को हल कीजिए, जबकि x = 0 पर y = ${y0} है, और x = ${x1} पर y ज्ञात कीजिए।`),
          answer: numM(val, null, [[val - y0, L("Use the initial condition to find the constant of integration.", "समाकलन अचर ज्ञात करने के लिए प्रारंभिक प्रतिबंध का प्रयोग कीजिए।")], [2 * a * x1 + b, L("Integrate the right side; do not differentiate it.", "दाएँ पक्ष का समाकलन कीजिए; अवकलन नहीं।")]]),
          data: { given: [`y(0) = ${y0}`], find: [`y(${x1})`] },
          hint: L("Integrate both sides with respect to x and add a constant C.", "दोनों पक्षों का x के सापेक्ष समाकलन कीजिए और अचर C जोड़िए।"),
          formula: R`y = \int f(x)\,dx + C`,
          solution: S(R`$y = ${poly([[a / 3, "x^3"], [b / 2, "x^2"], [c, "x"]])} + C$`, L(`From y(0) = ${y0}: C = ${y0}.`, `y(0) = ${y0} से: C = ${y0}।`), R`$y(${x1}) = ${val}$`),
        });
      }
      if (level === 2) {
        if (r.int(0, 1) === 0) {
          const sub = r.int(0, 2);
          if (sub === 0) {
            const [a, b, c] = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [7, 24, 25]]);
            const [x1, y0] = r.int(0, 1) ? [a, b] : [b, a];
            return taskL(lang, {
              text: L(R`Solve $\dfrac{dy}{dx} = \dfrac{x}{y}$ with y(0) = ${y0} (y > 0), and find y when x = ${x1}.`, R`$\dfrac{dy}{dx} = \dfrac{x}{y}$ को y(0) = ${y0} (y > 0) के साथ हल कीजिए और x = ${x1} पर y ज्ञात कीजिए।`),
              answer: numM(c, null, [[x1, L("Use the initial condition to find the constant.", "अचर ज्ञात करने के लिए प्रारंभिक प्रतिबंध का प्रयोग कीजिए।")], [x1 + y0, L("After separating, integrate: y²/2 = x²/2 + C; the squares add, not the values.", "चरों को पृथक करके समाकलन कीजिए: y²/2 = x²/2 + C; वर्ग जुड़ते हैं, मान नहीं।")]]),
              data: { given: [`y(0) = ${y0}`], find: [`y(${x1})`] },
              hint: L("Separate the variables: y dy = x dx, then integrate.", "चरों को पृथक कीजिए: y dy = x dx, फिर समाकलन कीजिए।"),
              formula: R`\int y\,dy = \int x\,dx`,
              solution: S(R`$\dfrac{y^2}{2} = \dfrac{x^2}{2} + C \Rightarrow y^2 = x^2 + 2C$`, L(`y(0) = ${y0} gives y² = x² + ${y0 * y0}.`, `y(0) = ${y0} से y² = x² + ${y0 * y0}।`), R`$y(${x1}) = \sqrt{${x1 * x1} + ${y0 * y0}} = ${c}$`),
            });
          }
          if (sub === 1) {
            const x0 = r.int(1, 4), y0 = r.nonZero(-9, 9), x1 = r.int(2, 9);
            const val = (y0 * x1) / x0;
            return taskL(lang, {
              text: L(R`Solve $x\dfrac{dy}{dx} = y$ (x > 0) given y = ${y0} when x = ${x0}, and find y when x = ${x1}.`, R`$x\dfrac{dy}{dx} = y$ (x > 0) को हल कीजिए, जबकि x = ${x0} पर y = ${y0} है, और x = ${x1} पर y ज्ञात कीजिए।`) + rnd(val, lang),
              answer: ansN(val, [[y0 + x1 - x0, L("The solution is y = Cx (a straight line through the origin), not y = x + C.", "हल y = Cx है (मूल बिंदु से जाने वाली रेखा), y = x + C नहीं।")], [(y0 * x0) / x1, L("From log y = log x + log C we get y = Cx, so y grows with x.", "log y = log x + log C से y = Cx मिलता है, अतः y, x के साथ बढ़ता है।")]]),
              data: { given: [`y(${x0}) = ${y0}`], find: [`y(${x1})`] },
              hint: L("Separate the variables: dy/y = dx/x.", "चरों को पृथक कीजिए: dy/y = dx/x।"),
              formula: R`\int \dfrac{dy}{y} = \int \dfrac{dx}{x}`,
              solution: S(R`$\log|y| = \log x + \log|C| \Rightarrow y = Cx$`, L(`y(${x0}) = ${y0} gives`, `y(${x0}) = ${y0} से`) + R` $C = ${fracTex(y0, x0)}$.`, R`$y(${x1}) = ${fracTex(y0, x0)} \times ${x1} ${eqs(val)} ${f2(val)}$`),
            });
          }
          const k = r.pick([0.5, 1, 2, -1, -0.5]), y0 = r.int(2, 9), x1 = r.pick([1, 2]);
          const ek = Number(Math.exp(k * x1).toFixed(4)), val = y0 * ek;
          return taskL(lang, {
            text: L(R`Solve $\dfrac{dy}{dx} = ${k === 1 ? "" : k === -1 ? "-" : en(k)}y$ with y(0) = ${y0}, and find y(${x1}). (Use $e^{${en(k * x1)}} \approx ${en(ek)}$.)`, R`$\dfrac{dy}{dx} = ${k === 1 ? "" : k === -1 ? "-" : en(k)}y$ को y(0) = ${y0} के साथ हल कीजिए और y(${x1}) ज्ञात कीजिए। ($e^{${en(k * x1)}} \approx ${en(ek)}$ लीजिए।)`) + rnd(val, lang),
            answer: ansN(val, [[y0 + k * x1, L("Separating gives log y = kx + C, so y = y₀eᵏˣ, not y₀ + kx.", "पृथक्करण से log y = kx + C मिलता है, अतः y = y₀eᵏˣ, न कि y₀ + kx।")], [ek, L("Multiply by the initial value y(0).", "प्रारंभिक मान y(0) से गुणा कीजिए।")]]),
            data: { given: [`y(0) = ${y0}`, Math.abs(k) !== 1 && `k = ${en(k)}`].filter(Boolean), find: [`y(${x1})`] },
            hint: L("Separate: dy/y = k dx, integrate, and use y(0).", "पृथक कीजिए: dy/y = k dx, समाकलन कीजिए और y(0) का प्रयोग कीजिए।"),
            formula: R`y = y_0\,e^{kx}`,
            solution: S(R`$\log y = ${en(k)}x + C \Rightarrow y = Ae^{${en(k)}x}$`, L(`y(0) = ${y0} gives A = ${y0}.`, `y(0) = ${y0} से A = ${y0}।`), R`$y(${x1}) = ${y0} \times ${en(ek)} ${eqs(val)} ${f2(val)}$`),
          });
        }
        const k = r.int(1, 2), m = r.int(0, 2), y0 = r.int(-3, 5);
        const s = m + k + 1, num = 2 ** s - 1 + s * y0, den = s * 2 ** k;
        const Q = m === 0 ? "1" : m === 1 ? "x" : "x^2", PX = k === 1 ? R`\dfrac{y}{x}` : R`\dfrac{${k}y}{x}`;
        return taskL(lang, {
          text: L(R`Solve $\dfrac{dy}{dx} + ${PX} = ${Q}$ (x > 0) with y(1) = ${y0}, and find y(2).`, R`$\dfrac{dy}{dx} + ${PX} = ${Q}$ (x > 0) को y(1) = ${y0} के साथ हल कीजिए और y(2) ज्ञात कीजिए।`) + fracNote(L),
          answer: fractionM(num, den, [[2 ** s / den, L("Find the constant C from y(1) before evaluating at x = 2.", "x = 2 पर मान निकालने से पहले y(1) से अचर C ज्ञात कीजिए।")], [num / s, L("Divide by the integrating factor at x = 2 to get y.", "y पाने के लिए x = 2 पर समाकलन गुणक से भाग दीजिए।")]]),
          data: { given: [R`P = \dfrac{${k}}{x}`, `Q = ${Q}`, `y(1) = ${y0}`], find: ["y(2)"] },
          hint: L("Linear equation: integrating factor IF = e^(∫P dx). Then y·IF = ∫Q·IF dx + C.", "रैखिक समीकरण: समाकलन गुणक IF = e^(∫P dx)। फिर y·IF = ∫Q·IF dx + C।"),
          formula: R`y \cdot \text{IF} = \int Q \cdot \text{IF}\,dx + C,\quad \text{IF} = e^{\int P\,dx}`,
          solution: S(
            R`$\text{IF} = e^{\int \frac{${k}}{x}dx} = ${xp(k)}$`,
            R`$${xp(k)}y = \int ${xp(m + k)}\,dx = \dfrac{x^{${s}}}{${s}} + C$`,
            L(`y(1) = ${y0}:`, `y(1) = ${y0}:`) + R` $${y0} = \dfrac{1}{${s}} + C \Rightarrow C = ${fracTex(s * y0 - 1, s)}$`,
            R`$${2 ** k}\,y(2) = \dfrac{${2 ** s}}{${s}} + ${fracTex(s * y0 - 1, s).startsWith("-") ? `\\left(${fracTex(s * y0 - 1, s)}\\right)` : fracTex(s * y0 - 1, s)} = ${fracTex(num, s)} \Rightarrow y(2) = ${fracTex(num, den)}$`,
          ),
        });
      }
      const v = r.int(0, 2);
      const LN = { 1.1: 0.0953, 1.2: 0.1823, 1.25: 0.2231, 1.5: 0.4055, 2: 0.6931, 3: 1.0986 };
      if (v === 0) {
        const p = r.pick([10, 20, 25, 50]), m = r.pick([2, 3]), Tt = r.pick([1, 2, 3, 5]);
        const g = 1 + p / 100, t = (Tt * LN[m]) / LN[g];
        const ctx = r.int(0, 1);
        return taskL(lang, {
          text: (ctx === 0
            ? L(`The number of bacteria in a culture grows at a rate proportional to the number present. It increases by ${p}% in ${Tt} hour${Tt > 1 ? "s" : ""}. In how many hours will it become ${m} times the original number?`, `एक कल्चर में जीवाणुओं की संख्या उपस्थित संख्या के समानुपाती दर से बढ़ती है। ${Tt} घंटे में यह ${p}% बढ़ जाती है। कितने घंटों में यह मूल संख्या की ${m} गुनी हो जाएगी?`)
            : L(`The population of a town grows at a rate proportional to the population. It increases by ${p}% in ${Tt} year${Tt > 1 ? "s" : ""}. In how many years will it become ${m} times the original population?`, `एक नगर की जनसंख्या, जनसंख्या के समानुपाती दर से बढ़ती है। ${Tt} वर्ष में यह ${p}% बढ़ जाती है। कितने वर्षों में यह मूल जनसंख्या की ${m} गुनी हो जाएगी?`)) + L(` (Use ln ${m} = ${LN[m]}, ln ${g} = ${LN[g]}.)`, ` (ln ${m} = ${LN[m]}, ln ${g} = ${LN[g]} लीजिए।)`) + roundToL(2, lang),
          answer: numM(t, 2, [[(Tt * (m - 1) * 100) / p, L("The growth is exponential (dN/dt = kN), not linear.", "वृद्धि चरघातांकी है (dN/dt = kN), रैखिक नहीं।")], [(Tt * LN[m]) / (p / 100), L(`k comes from e^{kT} = ${g}, so kT = ln ${g}, not ${p / 100}.`, `k, e^{kT} = ${g} से मिलता है, अतः kT = ln ${g}, न कि ${p / 100}।`)]]),
          data: { given: [R`N(${Tt}) = ${g}N_0`, `N(t) = ${m}N_0`], find: ["t"] },
          hint: L("Solve dN/dt = kN to get N = N₀e^(kt), find k from the given increase, then solve for t.", "dN/dt = kN हल करके N = N₀e^(kt) प्राप्त कीजिए, दी गई वृद्धि से k ज्ञात कीजिए, फिर t के लिए हल कीजिए।"),
          formula: R`N = N_0 e^{kt}`,
          solution: S(R`$N = N_0e^{kt}$, $e^{${Tt}k} = ${g} \Rightarrow k = \dfrac{\ln ${g}}{${Tt}}$`, R`$e^{kt} = ${m} \Rightarrow t = \dfrac{\ln ${m}}{k} = \dfrac{${Tt} \times ${LN[m]}}{${LN[g]}}$`, R`$t \approx ${en(t, 2)}$`),
        });
      }
      if (v === 1) {
        const rr = r.pick([4, 5, 8, 10]), m = r.pick([2, 3]);
        const t = LN[m] / (rr / 100);
        return taskL(lang, {
          text: L(`In a bank, a principal increases continuously at the rate of ${rr}% per year (dP/dt = ${rr / 100}P). In how many years will it become ${m} times itself? (Use ln ${m} = ${LN[m]}.)`, `एक बैंक में मूलधन ${rr}% प्रति वर्ष की दर से सतत रूप से बढ़ता है (dP/dt = ${rr / 100}P)। कितने वर्षों में यह स्वयं का ${m} गुना हो जाएगा? (ln ${m} = ${LN[m]} लीजिए।)`) + roundToL(2, lang),
          answer: numM(t, 2, [[((m - 1) * 100) / rr, L("Continuous growth is exponential; simple interest gives a different time.", "सतत वृद्धि चरघातांकी है; साधारण ब्याज से अलग समय मिलता है।")], [(LN[m] * rr) / 100, L("Divide ln m by the rate, do not multiply.", "ln m को दर से भाग दीजिए, गुणा नहीं।")]]),
          data: { given: [R`\dfrac{dP}{dt} = ${rr / 100}P`, `P(t) = ${m}P_0`], find: ["t"] },
          hint: L("Separate the variables: dP/P = r dt, so P = P₀e^(rt).", "चरों को पृथक कीजिए: dP/P = r dt, अतः P = P₀e^(rt)।"),
          formula: R`P = P_0e^{rt}`,
          solution: S(R`$\ln\dfrac{P}{P_0} = ${rr / 100}t$`, R`$\ln ${m} = ${rr / 100}t \Rightarrow t = \dfrac{${LN[m]}}{${rr / 100}}$`, R`$t \approx ${en(t, 2)}$`),
        });
      }
      const a = r.pick([1, 2, 3, 0.5]), b = r.int(1, 9), y0 = r.int(0, 9);
      const E = Number(Math.exp(-a).toFixed(4));
      const fa = (v) => (a === 0.5 ? en(v) : fracTex(Math.round(v * a), a));
      const val = b / a + (y0 - b / a) * E;
      return taskL(lang, {
        text: L(R`Solve the linear differential equation $\dfrac{dy}{dx} + ${a === 1 ? "" : en(a)}y = ${b}$ with y(0) = ${y0}, and find y(1). (Use $e^{-${en(a)}} \approx ${en(E)}$.)`, R`रैखिक अवकल समीकरण $\dfrac{dy}{dx} + ${a === 1 ? "" : en(a)}y = ${b}$ को y(0) = ${y0} के साथ हल कीजिए और y(1) ज्ञात कीजिए। ($e^{-${en(a)}} \approx ${en(E)}$ लीजिए।)`) + roundToL(2, lang),
        answer: numM(val, 2, [[b / a, L("That is only the steady value; add the term with the constant C.", "यह केवल स्थिर मान है; अचर C वाला पद भी जोड़िए।")], [b / a + y0 * E, L("C = y(0) − b/a, not y(0).", "C = y(0) − b/a है, y(0) नहीं।")]]),
        data: { given: [`P = ${en(a)}`, `Q = ${b}`, `y(0) = ${y0}`], find: ["y(1)"] },
        hint: L("IF = e^(ax). Multiply through and integrate: y·e^(ax) = ∫b·e^(ax) dx.", "IF = e^(ax)। पूरे समीकरण को गुणा करके समाकलन कीजिए: y·e^(ax) = ∫b·e^(ax) dx।"),
        formula: R`y \cdot \text{IF} = \int Q \cdot \text{IF}\,dx + C`,
        solution: S(
          R`$\text{IF} = e^{${ax(a)}}$, $ye^{${ax(a)}} = ${a === 1 ? b : R`\dfrac{${b}}{${en(a)}}`}e^{${ax(a)}} + C$`,
          R`$y = ${fa(b / a)} + Ce^{-${ax(a)}}$, $y(0) = ${y0} \Rightarrow C = ${fa(y0 - b / a)}$`,
          R`$y(1) = ${fa(b / a)} ${y0 - b / a < 0 ? `- ${fa(b / a - y0)}` : `+ ${fa(y0 - b / a)}`} \times ${en(E)} \approx ${en(val, 2)}$`,
        ),
      });
    },
  },
];
