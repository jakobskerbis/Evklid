// Izpitne naloge iz matematike (angleško in hindijsko): teme, ki jih zahtevajo SAT, gaokao, JEE in
// CBSE, slovenski generatorji pa jih nimajo (kvadratne enačbe, trigonometrija, zaporedja,
// logaritmi, odvodi, integrali, kompleksna števila, vektorji, matrike …).
// Teme so v banki "MAT-EXB" (server/exam-data.js); izpitne poti jih uporabijo kot osnovo.
// Vsak generator ima langs: ["en", "hi"] in gen(level, r, _topic, lang); besedila z L = bi(lang),
// števila in naključne izbire so v obeh jezikih enake.
import { choices } from "../rng.js";
import { en, sg, co, sco, par, frac, fracTex, reduce, num, fraction, task, nCr, fact, poly, factor, numM, fractionM, dq, bi, roundToL } from "./exam-util.js";

const T = (slug) => `MAT-EXB/${slug}`;
// Angleški vrstilni števnik: 1st, 2nd, 3rd, 11th, 23rd …
const ordEn = (n) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th"}`;
const gcd2 = (x, y) => (y ? gcd2(y, x % y) : x);
const reduced = (t) => t.map((x) => x / gcd2(gcd2(t[0], t[1]), t[2]));
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [7, 24, 25], [9, 12, 15], [20, 21, 29]];
const LANGS = ["en", "hi"];
// Zgled vnosa (inputHint) v jeziku naloge.
const eg = (L, s) => L(`e.g. ${s}`, `जैसे ${s}`);

export const EXAM_MAT = [
  {
    id: "ex-quadratic",
    topics: [T("quadratic-equations")],
    langs: LANGS,
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const p = r.int(-7, 7);
      let q = r.int(-7, 7);
      if (q === p) q += 2;
      const s = p + q, m = p * q;
      if (level === 1) {
        const eq = `${poly([[1, "x^2"], [-s, "x"], [m, ""]])} = 0`;
        return task({
          text: L(`What is the larger solution of $${eq}$?`, `$${eq}$ का बड़ा हल क्या है?`),
          answer: num(Math.max(p, q)),
          hint: L("Find two numbers whose product is the constant term and whose sum is the opposite of the x-coefficient.", "ऐसी दो संख्याएँ ज्ञात कीजिए जिनका गुणनफल अचर पद के बराबर हो और योग $x$ के गुणांक के बराबर परंतु विपरीत चिह्न वाला हो।"),
          solution: L(
            `$${eq}$\n$${factor(p)}${factor(q)} = 0$\n$x = ${p}$ or $x = ${q}$, so the larger solution is $${Math.max(p, q)}$.`,
            `$${eq}$\n$${factor(p)}${factor(q)} = 0$\n$x = ${p}$ या $x = ${q}$, अतः बड़ा हल $${Math.max(p, q)}$ है।`
          ),
          formula: "x_{1,2} = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
        });
      }
      if (level === 2) {
        const a = r.pick([2, 3, -2]);
        const eq = `${poly([[a, "x^2"], [-a * s, "x"], [a * m, ""]])} = 0`;
        return task({
          text: L(`What is the sum of the solutions of $${eq}$?`, `$${eq}$ के हलों का योग क्या है?`),
          answer: num(s),
          hint: L("For $ax^2 + bx + c = 0$ the sum of the roots is $-\\dfrac{b}{a}$.", "$ax^2 + bx + c = 0$ के लिए मूलों का योग $-\\dfrac{b}{a}$ होता है।"),
          solution: L(
            `Sum of roots $= -\\dfrac{b}{a} = -\\dfrac{${-a * s}}{${a}} = ${s}$.\n(The roots are $${p}$ and $${q}$.)`,
            `मूलों का योग $= -\\dfrac{b}{a} = -\\dfrac{${-a * s}}{${a}} = ${s}$।\n(मूल $${p}$ और $${q}$ हैं।)`
          ),
          formula: "x_1 + x_2 = -\\dfrac{b}{a}, \\quad x_1 x_2 = \\dfrac{c}{a}",
        });
      }
      const pl = poly([[1, "x^2"], [-s, "x"], [m, ""]]);
      const sol = `$\\alpha + \\beta = ${s}$, $\\alpha\\beta = ${m}$\n$\\alpha^2 + \\beta^2 = (\\alpha+\\beta)^2 - 2\\alpha\\beta = ${par(s)}^2 - 2 \\cdot ${par(m)} = ${s * s - 2 * m}$`;
      return task({
        text: L(
          `If $\\alpha$ and $\\beta$ are the roots of $${pl} = 0$, what is $\\alpha^2 + \\beta^2$?`,
          `यदि $\\alpha$ और $\\beta$ समीकरण $${pl} = 0$ के मूल हैं, तो $\\alpha^2 + \\beta^2$ का मान क्या है?`
        ),
        answer: num(s * s - 2 * m),
        hint: L("Use $\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta$ and Vieta's formulas.", "$\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta$ तथा मूलों और गुणांकों के संबंध (वियेटा सूत्र) का प्रयोग कीजिए।"),
        solution: L(sol, `मूलों और गुणांकों के संबंध से:\n${sol}`),
        formula: "\\alpha^2 + \\beta^2 = (\\alpha + \\beta)^2 - 2\\alpha\\beta",
      });
    },
  },
  {
    id: "ex-systems",
    topics: [T("systems-of-linear-equations")],
    langs: LANGS,
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const x = r.int(-6, 9), y = x + r.nonZero(-6, 6);
      if (level === 1) {
        return task({
          text: L(`If $x + y = ${x + y}$ and $x - y = ${x - y}$, what is the value of $x$?`, `यदि $x + y = ${x + y}$ और $x - y = ${x - y}$ है, तो $x$ का मान क्या है?`),
          answer: num(x),
          hint: L("Add the two equations to eliminate $y$.", "$y$ का विलोपन करने के लिए दोनों समीकरणों को जोड़िए।"),
          solution: L(`Adding: $2x = ${x + y} + ${par(x - y)} = ${2 * x}$, so $x = ${x}$.`, `जोड़ने पर: $2x = ${x + y} + ${par(x - y)} = ${2 * x}$, अतः $x = ${x}$।`),
        });
      }
      if (level === 2) {
        const a = r.pick([2, 3, 4]), b = r.pick([1, -1, 2, -3]), c = r.pick([1, 2, 5]), d = r.pick([-1, 3, -2]);
        if (a * d - b * c === 0) return null;
        const e1 = `$${co(a)} ${sco(b, "y")} = ${a * x + b * y}$`, e2 = `$${co(c)} ${sco(d, "y")} = ${c * x + d * y}$`;
        const last = `$${b * c - a * d}y = ${c * (a * x + b * y) - a * (c * x + d * y)}$`;
        return task({
          text: L(`Solve the system ${e1}, ${e2}. What is the value of $y$?`, `समीकरण निकाय ${e1}, ${e2} को हल कीजिए। $y$ का मान क्या है?`),
          answer: num(y),
          hint: L("Multiply the equations so that the $x$-terms cancel, then subtract.", "समीकरणों को ऐसी संख्याओं से गुणा कीजिए कि $x$ वाले पद बराबर हो जाएँ, फिर घटाइए।"),
          solution: L(
            `Eliminate $x$: multiply the first equation by $${c}$ and the second by $${a}$ and subtract:\n${last}, so $y = ${y}$ (and $x = ${x}$).`,
            `$x$ का विलोपन: पहले समीकरण को $${c}$ से और दूसरे को $${a}$ से गुणा करके घटाइए:\n${last}, अतः $y = ${y}$ (और $x = ${x}$)।`
          ),
        });
      }
      const ad = r.int(6, 15), ch = r.int(3, ad - 1), na = r.int(20, 80), nc = r.int(20, 80);
      return task({
        text: L(
          `A theater sold ${na + nc} tickets for a total of ${ad * na + ch * nc} dollars. Adult tickets cost ${ad} dollars and child tickets cost ${ch} dollars. How many adult tickets were sold?`,
          `एक थिएटर ने कुल ${ad * na + ch * nc} डॉलर में ${na + nc} टिकट बेचे। वयस्क का टिकट ${ad} डॉलर का और बच्चे का टिकट ${ch} डॉलर का था। वयस्कों के कितने टिकट बिके?`
        ),
        answer: num(na),
        hint: L(
          "Let $a$ be adult tickets and $c$ child tickets: $a + c = $ total and $" + ad + "a + " + ch + "c = $ revenue.",
          "मान लीजिए वयस्कों के $a$ और बच्चों के $c$ टिकट बिके: $a + c = $ कुल टिकट और $" + ad + "a + " + ch + "c = $ कुल आय।"
        ),
        solution: L(
          `$a + c = ${na + nc}$ and $${ad}a + ${ch}c = ${ad * na + ch * nc}$.\nSubstitute $c = ${na + nc} - a$: $${ad - ch}a = ${ad * na + ch * nc} - ${ch * (na + nc)} = ${(ad - ch) * na}$, so $a = ${na}$.`,
          `$a + c = ${na + nc}$ और $${ad}a + ${ch}c = ${ad * na + ch * nc}$।\n$c = ${na + nc} - a$ रखने पर: $${ad - ch}a = ${ad * na + ch * nc} - ${ch * (na + nc)} = ${(ad - ch) * na}$, अतः $a = ${na}$।`
        ),
      });
    },
  },
  {
    id: "ex-exponential",
    topics: [T("exponential-growth-and-decay")],
    langs: LANGS,
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      if (level === 1) {
        const P = r.pick([1000, 2000, 500, 1500]), rate = r.pick([2, 3, 4, 5]), t = r.int(2, 5);
        const v = P * (1 + rate / 100) ** t;
        const sol = `$A = ${P} \\cdot ${en(1 + rate / 100)}^{${t}} \\approx ${en(v, 2)}$`;
        return task({
          text: L(
            `${P} dollars are invested at ${rate}% interest compounded annually. What is the value of the investment after ${t} years, in dollars?`,
            `${P} डॉलर ${rate}% वार्षिक चक्रवृद्धि ब्याज पर निवेश किए गए हैं। ${t} वर्ष बाद निवेश का मान कितने डॉलर होगा?`
          ) + roundToL(2, lang),
          answer: num(v, 2),
          hint: L("Each year the amount is multiplied by $1 + \\dfrac{r}{100}$.", "हर वर्ष राशि $1 + \\dfrac{r}{100}$ से गुणा हो जाती है।"),
          formula: "A = P\\left(1 + \\dfrac{r}{100}\\right)^t",
          solution: L(sol, `मिश्रधन: ${sol}`),
        });
      }
      if (level === 2) {
        const N = r.pick([800, 1200, 640, 960]), h = r.pick([2, 3, 5, 8]), k = r.int(2, 4);
        const m = `$m = ${N} \\cdot \\left(\\tfrac12\\right)^{${k}} = ${en(N / 2 ** k)}\\ \\text{mg}$`;
        return task({
          text: L(
            `A substance has a half-life of ${h} hours. A sample has a mass of ${N} mg. What is its mass after ${h * k} hours, in mg?`,
            `एक पदार्थ की अर्ध-आयु ${h} घंटे है। एक नमूने का द्रव्यमान ${N} mg है। ${h * k} घंटे बाद उसका द्रव्यमान कितने mg होगा?`
          ),
          answer: num(N / 2 ** k, 2),
          hint: L("Count the number of half-lives that pass.", "गिनिए कि इस समय में कितनी अर्ध-आयु बीतती हैं।"),
          formula: "m = m_0 \\left(\\tfrac12\\right)^{t / T_{1/2}}",
          solution: L(`$${h * k} / ${h} = ${k}$ half-lives.\n${m}`, `$${h * k} / ${h} = ${k}$ अर्ध-आयु।\n${m}`),
        });
      }
      const f = r.pick([1.5, 2, 3]), y0 = r.pick([100, 200, 50]), t = r.int(2, 4);
      return task({
        text: L(
          `A population is modeled by $P(t) = ${y0} \\cdot b^t$, where $t$ is in years. If $P(${t}) = ${en(y0 * f ** t)}$, what is the value of $b$?`,
          `एक जनसंख्या को $P(t) = ${y0} \\cdot b^t$ द्वारा निरूपित किया गया है, जहाँ $t$ वर्षों में है। यदि $P(${t}) = ${en(y0 * f ** t)}$ है, तो $b$ का मान क्या है?`
        ),
        answer: num(f, 2, { alsoAccept: [] }),
        hint: L("Divide by the starting value and take the root.", "प्रारंभिक मान से भाग दीजिए और फिर मूल निकालिए।"),
        solution: L(
          `$b^{${t}} = \\dfrac{${en(y0 * f ** t)}}{${y0}} = ${en(f ** t)}$, so $b = \\sqrt[${t}]{${en(f ** t)}} = ${en(f)}$.`,
          `$b^{${t}} = \\dfrac{${en(y0 * f ** t)}}{${y0}} = ${en(f ** t)}$, अतः $b = \\sqrt[${t}]{${en(f ** t)}} = ${en(f)}$।`
        ),
      });
    },
  },
  {
    id: "ex-right-trig",
    topics: [T("right-triangle-trigonometry")],
    langs: LANGS,
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      if (level === 1) {
        const [a, b, c] = r.pick(TRIPLES);
        const fn = r.pick(["sin", "cos", "tan"]);
        const [n, d] = fn === "sin" ? [a, c] : fn === "cos" ? [b, c] : [a, b];
        return task({
          text: L(
            `In right triangle $ABC$, angle $C$ is the right angle, $BC = ${a}$, $AC = ${b}$ and $AB = ${c}$. What is $\\${fn} A$? Write it as a fraction.`,
            `समकोण त्रिभुज $ABC$ में कोण $C$ समकोण है, $BC = ${a}$, $AC = ${b}$ और $AB = ${c}$ है। $\\${fn} A$ का मान क्या है? उत्तर भिन्न के रूप में लिखिए।`
          ),
          answer: fraction(n, d),
          inputHint: eg(L, "3/5"),
          hint: L(
            "SOH CAH TOA: sine = opposite/hypotenuse, cosine = adjacent/hypotenuse, tangent = opposite/adjacent.",
            "sin = सम्मुख भुजा/कर्ण, cos = आसन्न भुजा/कर्ण, tan = सम्मुख भुजा/आसन्न भुजा।"
          ),
          solution: L(
            `For angle $A$: opposite side $BC = ${a}$, adjacent side $AC = ${b}$, hypotenuse $AB = ${c}$.\n$\\${fn} A = ${frac(n, d)} = ${fracTex(n, d)}$`,
            `कोण $A$ के लिए: सम्मुख भुजा $BC = ${a}$, आसन्न भुजा $AC = ${b}$, कर्ण $AB = ${c}$।\n$\\${fn} A = ${frac(n, d)} = ${fracTex(n, d)}$`
          ),
        });
      }
      const ang = r.pick([20, 25, 35, 40, 50, 55, 65]);
      if (level === 2) {
        const h = r.int(8, 30);
        const v = h * Math.sin((ang * Math.PI) / 180);
        return task({
          text: L(
            `A right triangle has a hypotenuse of length ${h} cm and an acute angle of ${ang}°. What is the length of the side opposite this angle, in cm?`,
            `एक समकोण त्रिभुज के कर्ण की लंबाई ${h} cm है और उसका एक न्यून कोण ${ang}° है। इस कोण की सम्मुख भुजा की लंबाई कितने cm है?`
          ) + roundToL(2, lang),
          answer: num(v, 2),
          hint: L("opposite = hypotenuse × sin(angle).", "सम्मुख भुजा = कर्ण × sin(कोण)।"),
          solution: L(
            `$\\text{opposite} = ${h} \\cdot \\sin ${ang}^\\circ \\approx ${en(v, 2)}\\ \\text{cm}$`,
            `सम्मुख भुजा $= ${h} \\cdot \\sin ${ang}^\\circ \\approx ${en(v, 2)}\\ \\text{cm}$`
          ),
        });
      }
      const dist = r.int(20, 80);
      const v = dist * Math.tan((ang * Math.PI) / 180);
      const sol = `$h = ${dist} \\cdot \\tan ${ang}^\\circ \\approx ${en(v, 1)}\\ \\text{m}$`;
      return task({
        text: L(
          `From a point ${dist} m from the foot of a tower, the angle of elevation of the top of the tower is ${ang}°. How tall is the tower, in meters?`,
          `एक मीनार के पाद से ${dist} m दूर स्थित एक बिंदु से मीनार के शिखर का उन्नयन कोण ${ang}° है। मीनार की ऊँचाई कितने मीटर है?`
        ) + roundToL(1, lang),
        answer: num(v, 1),
        hint: L("The height is opposite the angle and the distance is adjacent to it.", "ऊँचाई इस कोण की सम्मुख भुजा है और दूरी इसकी आसन्न भुजा है।"),
        solution: L(sol, `ऊँचाई: ${sol}`),
      });
    },
  },
  {
    id: "ex-ap",
    topics: [T("arithmetic-progressions")],
    langs: LANGS,
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const a = r.int(-10, 15), d = r.nonZero(-5, 7), n = r.int(8, 30);
      const seq = `$${a}, ${a + d}, ${a + 2 * d}, \\dots$`;
      const an = `$a_{${n}} = ${a} + ${n - 1} \\cdot ${par(d)} = ${a + (n - 1) * d}$`;
      if (level === 1) {
        return task({
          text: L(`An arithmetic progression begins ${seq} What is its ${ordEn(n)} term?`, `एक समांतर श्रेढ़ी ${seq} से आरंभ होती है। इसका ${n}वाँ पद क्या है?`),
          answer: num(a + (n - 1) * d),
          hint: L("$a_n = a_1 + (n-1)d$.", "सूत्र $a_n = a_1 + (n-1)d$ का प्रयोग कीजिए।"),
          formula: "a_n = a_1 + (n-1)d",
          solution: L(`$d = ${d}$\n${an}`, `सार्व अंतर $d = ${d}$\n${an}`),
        });
      }
      if (level === 2) {
        const S = (n * (2 * a + (n - 1) * d)) / 2;
        const sol = `$S_{${n}} = \\dfrac{${n}}{2}\\left(2 \\cdot ${par(a)} + ${n - 1} \\cdot ${par(d)}\\right) = ${S}$`;
        return task({
          text: L(`Find the sum of the first ${n} terms of the arithmetic progression ${seq}`, `समांतर श्रेढ़ी ${seq} के प्रथम ${n} पदों का योग ज्ञात कीजिए।`),
          answer: num(S),
          hint: L("$S_n = \\dfrac{n}{2}\\left(2a_1 + (n-1)d\\right)$.", "सूत्र $S_n = \\dfrac{n}{2}\\left(2a_1 + (n-1)d\\right)$ का प्रयोग कीजिए।"),
          formula: "S_n = \\dfrac{n}{2}\\left(2a_1 + (n-1)d\\right)",
          solution: L(sol, `योग: ${sol}`),
        });
      }
      const m = r.int(3, 6), k = m + r.int(3, 6);
      const first = `$${k - m}d = ${a + (k - 1) * d} - ${par(a + (m - 1) * d)} = ${(k - m) * d}$`;
      return task({
        text: L(
          `In an arithmetic progression, $a_{${m}} = ${a + (m - 1) * d}$ and $a_{${k}} = ${a + (k - 1) * d}$. What is $a_{${n}}$?`,
          `एक समांतर श्रेढ़ी में $a_{${m}} = ${a + (m - 1) * d}$ और $a_{${k}} = ${a + (k - 1) * d}$ है। $a_{${n}}$ ज्ञात कीजिए।`
        ),
        answer: num(a + (n - 1) * d),
        hint: L("Subtract the two terms to find the common difference first.", "पहले दोनों पदों को घटाकर सार्व अंतर ज्ञात कीजिए।"),
        formula: "a_n = a_1 + (n-1)d",
        solution: L(`${first}, so $d = ${d}$ and $a_1 = ${a}$.\n${an}`, `${first}, अतः $d = ${d}$ और $a_1 = ${a}$।\n${an}`),
      });
    },
  },
  {
    id: "ex-gp",
    topics: [T("geometric-progressions")],
    langs: LANGS,
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const a = r.pick([1, 2, 3, 5, -2]), q = r.pick([2, 3, -2]), n = r.int(5, 8);
      const seq = `$${a}, ${a * q}, ${a * q * q}, \\dots$`;
      if (level === 1) {
        const an = `$a_{${n}} = ${a} \\cdot ${par(q)}^{${n - 1}} = ${a * q ** (n - 1)}$`;
        return task({
          text: L(`A geometric sequence begins ${seq} What is its ${ordEn(n)} term?`, `एक गुणोत्तर श्रेढ़ी ${seq} से आरंभ होती है। इसका ${n}वाँ पद क्या है?`),
          answer: num(a * q ** (n - 1)),
          hint: L("$a_n = a_1 q^{n-1}$.", "सूत्र $a_n = a_1 q^{n-1}$ का प्रयोग कीजिए।"),
          formula: "a_n = a_1 q^{\\,n-1}",
          solution: L(`$q = ${q}$\n${an}`, `सार्व अनुपात $q = ${q}$\n${an}`),
        });
      }
      if (level === 2) {
        const S = (a * (q ** n - 1)) / (q - 1);
        const sol = `$S_{${n}} = ${a} \\cdot \\dfrac{${par(q)}^{${n}} - 1}{${q} - 1} = ${S}$`;
        return task({
          text: L(`Find the sum of the first ${n} terms of the geometric sequence ${seq}`, `गुणोत्तर श्रेढ़ी ${seq} के प्रथम ${n} पदों का योग ज्ञात कीजिए।`),
          answer: num(S),
          hint: L("$S_n = a_1 \\dfrac{q^n - 1}{q - 1}$.", "सूत्र $S_n = a_1 \\dfrac{q^n - 1}{q - 1}$ का प्रयोग कीजिए।"),
          formula: "S_n = a_1 \\dfrac{q^n - 1}{q - 1}",
          solution: L(sol, `योग: ${sol}`),
        });
      }
      const a1 = r.pick([6, 8, 9, 12, 18]), [qn, qd] = r.pick([[1, 2], [1, 3], [2, 3], [-1, 2], [3, 4]]);
      const [sn, sd] = reduce(a1 * qd, qd - qn);
      const ser = `$${a1} + ${a1} \\cdot \\left(${fracTex(qn, qd)}\\right) + ${a1} \\cdot \\left(${fracTex(qn, qd)}\\right)^2 + \\dots$`;
      const sol = `$S = \\dfrac{${a1}}{1 - \\left(${fracTex(qn, qd)}\\right)} = ${fracTex(sn, sd)}$`;
      return task({
        text: L(
          `Find the sum to infinity of the geometric series ${ser} Write it as a fraction or a whole number.`,
          `गुणोत्तर श्रेणी ${ser} का अनंत पदों तक योग ज्ञात कीजिए। उत्तर भिन्न या पूर्ण संख्या के रूप में लिखिए।`
        ),
        answer: fraction(sn, sd),
        inputHint: eg(L, "27/2"),
        hint: L("For $|q| < 1$: $S = \\dfrac{a_1}{1 - q}$.", "$|q| < 1$ के लिए: $S = \\dfrac{a_1}{1 - q}$।"),
        formula: "S_\\infty = \\dfrac{a_1}{1 - q}",
        solution: L(sol, `अनंत पदों तक योग: ${sol}`),
      });
    },
  },
  {
    id: "ex-statistics",
    topics: [T("statistics-mean-median")],
    langs: LANGS,
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const n = level === 2 ? 8 : 7;
      const data = Array.from({ length: n }, () => r.int(2, 40));
      const sorted = [...data].sort((a, b) => a - b);
      if (level === 1) {
        const sum = data.reduce((s, x) => s + x, 0);
        return task({
          text: L(`What is the mean of the data set $${data.join(", ")}$?`, `आँकड़ों $${data.join(", ")}$ का माध्य क्या है?`) + roundToL(2, lang),
          answer: num(sum / n, 2),
          hint: L("Add the values and divide by how many there are.", "सभी मानों को जोड़िए और मानों की संख्या से भाग दीजिए।"),
          solution: L(
            `Sum $= ${sum}$, count $= ${n}$\nMean $= ${sum} / ${n} \\approx ${en(sum / n, 2)}$`,
            `योग $= ${sum}$, मानों की संख्या $= ${n}$\nमाध्य $= ${sum} / ${n} \\approx ${en(sum / n, 2)}$`
          ),
        });
      }
      if (level === 2) {
        const med = (sorted[3] + sorted[4]) / 2;
        return task({
          text: L(`What is the median of the data set $${data.join(", ")}$?`, `आँकड़ों $${data.join(", ")}$ की माध्यिका क्या है?`),
          answer: num(med),
          hint: L(
            "Sort the values. With an even number of values, the median is the mean of the two middle ones.",
            "मानों को आरोही क्रम में लिखिए। मानों की संख्या सम हो, तो माध्यिका दोनों मध्य मानों का माध्य होती है।"
          ),
          solution: L(
            `Sorted: $${sorted.join(", ")}$\nMedian $= \\dfrac{${sorted[3]} + ${sorted[4]}}{2} = ${en(med)}$`,
            `आरोही क्रम में: $${sorted.join(", ")}$\nमाध्यिका $= \\dfrac{${sorted[3]} + ${sorted[4]}}{2} = ${en(med)}$`
          ),
        });
      }
      const mean = r.int(10, 30), k = 5;
      const known = Array.from({ length: k - 1 }, () => r.int(mean - 8, mean + 8));
      const missing = mean * k - known.reduce((s, x) => s + x, 0);
      return task({
        text: L(
          `The mean of five numbers is ${mean}. Four of the numbers are $${known.join(", ")}$. What is the fifth number?`,
          `पाँच संख्याओं का माध्य ${mean} है। इनमें से चार संख्याएँ $${known.join(", ")}$ हैं। पाँचवीं संख्या क्या है?`
        ),
        answer: num(missing),
        hint: L("The total of the five numbers is $5 \\times$ the mean.", "पाँचों संख्याओं का योग $5 \\times$ माध्य होता है।"),
        solution: L(
          `Total $= 5 \\cdot ${mean} = ${5 * mean}$\nFifth number $= ${5 * mean} - ${known.reduce((s, x) => s + x, 0)} = ${missing}$`,
          `कुल योग $= 5 \\cdot ${mean} = ${5 * mean}$\nपाँचवीं संख्या $= ${5 * mean} - ${known.reduce((s, x) => s + x, 0)} = ${missing}$`
        ),
      });
    },
  },
  {
    id: "ex-logarithms",
    topics: [T("logarithms")],
    langs: LANGS,
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const b = r.pick([2, 3, 5, 10]);
      if (level === 1) {
        const k = r.int(-2, b === 10 ? 4 : 5);
        const arg = k >= 0 ? `${b ** k}` : `\\frac{1}{${b ** -k}}`;
        return task({
          text: L(`Evaluate $\\log_{${b}} ${arg}$.`, `$\\log_{${b}} ${arg}$ का मान ज्ञात कीजिए।`),
          answer: num(k),
          hint: L("$\\log_b x = k$ means $b^k = x$.", "$\\log_b x = k$ का अर्थ है $b^k = x$।"),
          solution: L(`$${b}^{${k}} = ${arg}$, so $\\log_{${b}} ${arg} = ${k}$.`, `$${b}^{${k}} = ${arg}$, अतः $\\log_{${b}} ${arg} = ${k}$।`),
        });
      }
      if (level === 2) {
        const k = r.int(2, 4), x = r.pick([2, 4, 8, 3]), y = b ** k * x;
        const sol = `$\\log_{${b}} \\dfrac{${y}}{${x}} = \\log_{${b}} ${y / x} = ${k}$`;
        return task({
          text: L(`Evaluate $\\log_{${b}} ${y} - \\log_{${b}} ${x}$.`, `$\\log_{${b}} ${y} - \\log_{${b}} ${x}$ का मान ज्ञात कीजिए।`),
          answer: num(k),
          hint: L("$\\log_b x - \\log_b y = \\log_b \\dfrac{x}{y}$.", "नियम $\\log_b x - \\log_b y = \\log_b \\dfrac{x}{y}$ का प्रयोग कीजिए।"),
          formula: "\\log_b x - \\log_b y = \\log_b \\dfrac{x}{y}",
          solution: L(sol, `भागफल नियम से: ${sol}`),
        });
      }
      const a = r.int(-5, 6), k = r.int(1, b === 10 ? 2 : 4);
      const eq = `$\\log_{${b}}${a ? `(${poly([[1, "x"], [a, ""]])})` : " x"} = ${k}$`;
      return task({
        text: L(`Solve ${eq}.`, `${eq} को हल कीजिए।`),
        answer: num(b ** k - a),
        hint: L("Rewrite in exponential form: $x + a = b^k$.", "घातांकीय रूप में लिखिए: $x + a = b^k$।"),
        solution: L(
          `$${poly([[1, "x"], [a, ""]])} = ${b}^{${k}} = ${b ** k}$, so $x = ${b ** k - a}$.`,
          `$${poly([[1, "x"], [a, ""]])} = ${b}^{${k}} = ${b ** k}$, अतः $x = ${b ** k - a}$।`
        ),
      });
    },
  },
  {
    id: "ex-functions",
    topics: [T("functions")],
    langs: LANGS,
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const a = r.nonZero(-3, 3), b = r.int(-6, 6), c = r.int(-9, 9), x0 = r.int(-4, 4);
      const f = (x) => a * x * x + b * x + c;
      const fTex = poly([[a, "x^2"], [b, "x"], [c, ""]]);
      if (level === 1) {
        const sol = `$f(${x0}) = ${a} \\cdot ${par(x0)}^2 + ${par(b)} \\cdot ${par(x0)} + ${par(c)} = ${f(x0)}$`;
        return task({
          text: L(`If $f(x) = ${fTex}$, what is $f(${x0})$?`, `यदि $f(x) = ${fTex}$ है, तो $f(${x0})$ का मान क्या है?`),
          answer: num(f(x0)),
          hint: L("Substitute the value for every $x$ and use the order of operations.", "हर $x$ के स्थान पर दिया गया मान रखिए और संक्रियाओं के सही क्रम का पालन कीजिए।"),
          solution: L(sol, `मान रखने पर: ${sol}`),
        });
      }
      const m = r.nonZero(-4, 4), k = r.int(-8, 8);
      if (level === 2) {
        const g = (x) => m * x + k;
        return task({
          text: L(
            `Let $f(x) = ${fTex}$ and $g(x) = ${poly([[m, "x"], [k, ""]])}$. What is $f(g(${x0}))$?`,
            `मान लीजिए $f(x) = ${fTex}$ और $g(x) = ${poly([[m, "x"], [k, ""]])}$ है। $f(g(${x0}))$ का मान क्या है?`
          ),
          answer: num(f(g(x0))),
          hint: L(
            "Work from the inside out: first $g(" + x0 + ")$, then put the result into $f$.",
            "अंदर से बाहर की ओर चलिए: पहले $g(" + x0 + ")$ ज्ञात कीजिए, फिर परिणाम को $f$ में रखिए।"
          ),
          solution: L(`$g(${x0}) = ${g(x0)}$\n$f(${g(x0)}) = ${f(g(x0))}$`, `पहले $g(${x0}) = ${g(x0)}$\nफिर $f(${g(x0)}) = ${f(g(x0))}$`),
        });
      }
      const y = m * x0 + k;
      return task({
        text: L(
          `The function $h(x) = ${poly([[m, "x"], [k, ""]])}$ has an inverse $h^{-1}$. What is $h^{-1}(${y})$?`,
          `फलन $h(x) = ${poly([[m, "x"], [k, ""]])}$ का प्रतिलोम फलन $h^{-1}$ है। $h^{-1}(${y})$ का मान क्या है?`
        ),
        answer: num(x0),
        hint: L("$h^{-1}(y)$ is the $x$ with $h(x) = y$.", "$h^{-1}(y)$ वह $x$ है, जिसके लिए $h(x) = y$ हो।"),
        solution: L(
          `Solve $${poly([[m, "x"], [k, ""]])} = ${y}$: $x = \\dfrac{${y} - ${par(k)}}{${m}} = ${x0}$.`,
          `$${poly([[m, "x"], [k, ""]])} = ${y}$ को हल कीजिए: $x = \\dfrac{${y} - ${par(k)}}{${m}} = ${x0}$।`
        ),
      });
    },
  },
  {
    id: "ex-inequalities",
    topics: [T("quadratic-inequalities")],
    langs: LANGS,
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      if (level === 1) {
        const a = r.pick([2, 3, 4, 5]), b = r.int(-9, 9), c = r.int(-20, 30);
        const bound = (c - b) / a;
        const smallest = Math.floor(bound) + 1;
        return task({
          text: L(
            `What is the smallest integer $x$ that satisfies $${poly([[a, "x"], [b, ""]])} > ${c}$?`,
            `$${poly([[a, "x"], [b, ""]])} > ${c}$ को संतुष्ट करने वाला सबसे छोटा पूर्णांक $x$ क्या है?`
          ),
          answer: num(smallest),
          hint: L(
            "Solve for $x$ as with an equation, then pick the first integer above the bound.",
            "समीकरण की तरह $x$ के लिए हल कीजिए, फिर सीमा से बड़ा पहला पूर्णांक चुनिए।"
          ),
          solution: L(
            `$${a}x > ${c - b}$, so $x > ${fracTex(c - b, a)}$. The smallest integer is $${smallest}$.`,
            `$${a}x > ${c - b}$, अतः $x > ${fracTex(c - b, a)}$। सबसे छोटा पूर्णांक $${smallest}$ है।`
          ),
        });
      }
      const p = r.int(-6, 3), q = p + r.int(3, 9);
      const strict = level === 2;
      const s = p + q, m = p * q;
      const pl = poly([[1, "x^2"], [-s, "x"], [m, ""]]);
      const count = strict ? q - p - 1 : q - p + 1;
      const rel = strict ? "<" : "\\le";
      return task({
        text: L(`How many integers $x$ satisfy $${pl} ${rel} 0$?`, `कितने पूर्णांक $x$ असमिका $${pl} ${rel} 0$ को संतुष्ट करते हैं?`),
        answer: num(count),
        hint: L(
          "Factor the quadratic. The parabola opens upwards, so it is negative between the roots.",
          "द्विघात व्यंजक के गुणनखंड कीजिए। परवलय ऊपर की ओर खुलता है, इसलिए मूलों के बीच इसका मान ऋणात्मक होता है।"
        ),
        solution: L(
          `$${pl} = ${factor(p)}${factor(q)}$\nSolution: $${p} ${rel} x ${rel} ${q}$, which contains ${count} integers.`,
          `$${pl} = ${factor(p)}${factor(q)}$\nहल: $${p} ${rel} x ${rel} ${q}$, जिसमें ${count} पूर्णांक हैं।`
        ),
      });
    },
  },
  {
    id: "ex-trig-values",
    topics: [T("trigonometric-identities")],
    langs: LANGS,
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const FRAC = L(" Write it as a fraction.", " उत्तर भिन्न के रूप में लिखिए।");
      // Pitagorejska trojica okrajšana (9-12-15 → 3-4-5), da so ulomki v rešitvi taki kot v besedilu.
      const [a0, b0, c] = reduced(r.pick(TRIPLES));
      const [a, b] = r.next() < 0.5 ? [a0, b0] : [b0, a0];
      const S3 = 0.8660254, S2 = 0.7071068;
      if (level === 1) {
        // [izraz, vrednost, tipična napačna vrednost, zakaj]
        const items = [
          ["\\sin 30^\\circ", 0.5, S3, L("That is $\\cos 30^\\circ$; sine of 30° is the smaller value.", "यह $\\cos 30^\\circ$ का मान है; $\\sin 30^\\circ$ इन दोनों में छोटा मान है।")],
          ["\\cos 60^\\circ", 0.5, S3, L("That is $\\sin 60^\\circ$; cosine decreases from 1 at 0° to 0 at 90°.", "यह $\\sin 60^\\circ$ का मान है; cos का मान 0° पर 1 से घटकर 90° पर 0 हो जाता है।")],
          ["\\tan 45^\\circ", 1, S2, L("$\\tan 45^\\circ = \\sin 45^\\circ / \\cos 45^\\circ$; the two are equal.", "$\\tan 45^\\circ = \\sin 45^\\circ / \\cos 45^\\circ$; ये दोनों बराबर हैं।")],
          ["\\cos 0^\\circ", 1, 0, L("That is $\\sin 0^\\circ$; at 0° the cosine is the largest.", "यह $\\sin 0^\\circ$ का मान है; 0° पर cos का मान सबसे बड़ा होता है।")],
          ["\\sin 90^\\circ", 1, 0, L("That is $\\cos 90^\\circ$; at 90° the sine is the largest.", "यह $\\cos 90^\\circ$ का मान है; 90° पर sin का मान सबसे बड़ा होता है।")],
          ["\\cos 90^\\circ", 0, 1, L("That is $\\sin 90^\\circ$.", "यह $\\sin 90^\\circ$ का मान है।")],
          ["\\sin^2 45^\\circ", 0.5, S2, L("You forgot to square $\\sin 45^\\circ$.", "आप $\\sin 45^\\circ$ का वर्ग करना भूल गए।")],
          ["\\cos^2 30^\\circ", 0.75, S3, L("You forgot to square $\\cos 30^\\circ$.", "आप $\\cos 30^\\circ$ का वर्ग करना भूल गए।")],
          ["\\sin^2 60^\\circ", 0.75, S3, L("You forgot to square $\\sin 60^\\circ$.", "आप $\\sin 60^\\circ$ का वर्ग करना भूल गए।")],
          ["\\tan^2 60^\\circ", 3, 1.7320508, L("You forgot to square $\\tan 60^\\circ = \\sqrt3$.", "आप $\\tan 60^\\circ = \\sqrt3$ का वर्ग करना भूल गए।")],
          ["\\sin^2 30^\\circ", 0.25, 0.5, L("You forgot to square $\\sin 30^\\circ$.", "आप $\\sin 30^\\circ$ का वर्ग करना भूल गए।")],
          ["\\cos^2 60^\\circ", 0.25, 0.5, L("You forgot to square $\\cos 60^\\circ$.", "आप $\\cos 60^\\circ$ का वर्ग करना भूल गए।")],
          ["2\\sin 30^\\circ", 1, 0.5, L("Multiply $\\sin 30^\\circ$ by 2.", "$\\sin 30^\\circ$ को 2 से गुणा कीजिए।")],
          ["4\\cos^2 60^\\circ", 1, 2, L("Square $\\cos 60^\\circ$ before multiplying by 4.", "4 से गुणा करने से पहले $\\cos 60^\\circ$ का वर्ग कीजिए।")],
          ["\\sin 30^\\circ + \\cos 60^\\circ", 1, 0.5, L("Both terms equal $\\tfrac12$; add them.", "दोनों पद $\\tfrac12$ के बराबर हैं; इन्हें जोड़िए।")],
          ["2\\cos^2 45^\\circ", 1, 2 * S2, L("Square $\\cos 45^\\circ$ first: $(\\sqrt2/2)^2 = \\tfrac12$.", "पहले $\\cos 45^\\circ$ का वर्ग कीजिए: $(\\sqrt2/2)^2 = \\tfrac12$।")],
          ["\\tan 45^\\circ \\cdot \\sin 30^\\circ", 0.5, 1, L("Multiply by $\\sin 30^\\circ = \\tfrac12$.", "$\\sin 30^\\circ = \\tfrac12$ से गुणा कीजिए।")],
          ["\\sin^2 37^\\circ + \\cos^2 37^\\circ", 1, 0, L("For every angle $\\sin^2\\theta + \\cos^2\\theta = 1$.", "प्रत्येक कोण के लिए $\\sin^2\\theta + \\cos^2\\theta = 1$ होता है।")],
        ];
        const [tex, val, wrong, why] = r.pick(items);
        const sv = "$\\sin 30^\\circ = \\cos 60^\\circ = \\tfrac12$, $\\sin 45^\\circ = \\cos 45^\\circ = \\tfrac{\\sqrt2}{2}$, $\\sin 60^\\circ = \\cos 30^\\circ = \\tfrac{\\sqrt3}{2}$, $\\tan 45^\\circ = 1$";
        return task({
          text: L(`What is the exact value of $${tex}$? Give it as a decimal.`, `$${tex}$ का यथार्थ मान क्या है? उत्तर दशमलव में दीजिए।`),
          answer: numM(val, null, [[wrong, why]]),
          hint: L(
            "Use the values for the special angles 0°, 30°, 45°, 60° and 90° (draw the 30-60-90 and 45-45-90 triangles).",
            "विशेष कोणों 0°, 30°, 45°, 60° और 90° के मानों का प्रयोग कीजिए (30-60-90 और 45-45-90 त्रिभुज बनाइए)।"
          ),
          formula: "\\sin 30^\\circ = \\tfrac12,\\ \\sin 45^\\circ = \\tfrac{\\sqrt2}{2},\\ \\sin 60^\\circ = \\tfrac{\\sqrt3}{2}",
          solution: L(`Special values: ${sv}.\nSubstitute: $${tex} = ${en(val)}$`, `विशेष मान: ${sv}।\nमान रखने पर: $${tex} = ${en(val)}$`),
        });
      }
      if (level === 2) {
        const v = r.int(0, 2);
        if (v === 0) {
          const cs = `$\\cos\\theta = \\sqrt{1 - \\left(${frac(a, c)}\\right)^2} = \\sqrt{${frac(c * c - a * a, c * c)}} = ${frac(b, c)}$`;
          const tn = `$\\tan\\theta = ${frac(a, c)} \\div ${frac(b, c)} = ${fracTex(a, b)}$`;
          return task({
            text: L(
              `If $\\sin\\theta = ${fracTex(a, c)}$ and $\\theta$ is acute, what is $\\tan\\theta$?`,
              `यदि $\\sin\\theta = ${fracTex(a, c)}$ है और $\\theta$ न्यून कोण है, तो $\\tan\\theta$ का मान क्या है?`
            ) + FRAC,
            answer: fractionM(a, b, [
              [b / a, L("That is $\\cot\\theta$: $\\tan\\theta = \\sin\\theta / \\cos\\theta$.", "यह $\\cot\\theta$ है: $\\tan\\theta = \\sin\\theta / \\cos\\theta$ होता है।")],
              [b / c, L("That is $\\cos\\theta$; divide $\\sin\\theta$ by it.", "यह $\\cos\\theta$ है; $\\sin\\theta$ को इससे भाग दीजिए।")],
            ]),
            inputHint: eg(L, "3/4"),
            hint: L("Use $\\sin^2\\theta + \\cos^2\\theta = 1$ to find $\\cos\\theta$ first.", "पहले $\\sin^2\\theta + \\cos^2\\theta = 1$ से $\\cos\\theta$ ज्ञात कीजिए।"),
            formula: "\\sin^2\\theta + \\cos^2\\theta = 1, \\quad \\tan\\theta = \\dfrac{\\sin\\theta}{\\cos\\theta}",
            solution: L(`${cs}\n${tn}`, `सर्वसमिका से: ${cs}\nअतः ${tn}`),
          });
        }
        if (v === 1) {
          const c2 = `$\\cos^2\\theta = 1 - \\left(${frac(a, c)}\\right)^2 = ${frac(b * b, c * c)}$\n$|\\cos\\theta| = ${frac(b, c)}$`;
          return task({
            text: L(
              `If $\\sin\\theta = ${fracTex(a, c)}$ and $90^\\circ < \\theta < 180^\\circ$, what is $\\cos\\theta$?`,
              `यदि $\\sin\\theta = ${fracTex(a, c)}$ और $90^\\circ < \\theta < 180^\\circ$ है, तो $\\cos\\theta$ का मान क्या है?`
            ) + FRAC,
            answer: fractionM(-b, c, [
              [b / c, L("In the second quadrant the cosine is negative.", "दूसरे चतुर्थांश में cos का मान ऋणात्मक होता है।")],
              [-a / c, L("Use $\\cos\\theta = \\pm\\sqrt{1 - \\sin^2\\theta}$, not $-\\sin\\theta$.", "$-\\sin\\theta$ नहीं, बल्कि $\\cos\\theta = \\pm\\sqrt{1 - \\sin^2\\theta}$ का प्रयोग कीजिए।")],
            ]),
            inputHint: eg(L, "-4/5"),
            hint: L(
              "Find $|\\cos\\theta|$ from $\\sin^2\\theta + \\cos^2\\theta = 1$, then choose the sign for the second quadrant.",
              "$\\sin^2\\theta + \\cos^2\\theta = 1$ से $|\\cos\\theta|$ ज्ञात कीजिए, फिर दूसरे चतुर्थांश के अनुसार चिह्न चुनिए।"
            ),
            formula: "\\sin^2\\theta + \\cos^2\\theta = 1",
            solution: L(
              `${c2}\nIn quadrant II cosine is negative: $\\cos\\theta = ${fracTex(-b, c)}$`,
              `${c2}\nदूसरे चतुर्थांश में cos ऋणात्मक होता है: $\\cos\\theta = ${fracTex(-b, c)}$`
            ),
          });
        }
        const items = [["\\sin 150^\\circ", 0.5, 30], ["\\cos 120^\\circ", -0.5, 60], ["\\tan 135^\\circ", -1, 45], ["\\sin 210^\\circ", -0.5, 30], ["\\cos 240^\\circ", -0.5, 60], ["\\sin 330^\\circ", -0.5, 30], ["\\cos 300^\\circ", 0.5, 60], ["\\tan 225^\\circ", 1, 45], ["\\cos 180^\\circ", -1, 0], ["\\sin 270^\\circ", -1, 90], ["\\tan 315^\\circ", -1, 45], ["\\cos 150^\\circ \\cdot \\cos 30^\\circ", -0.75, 30], ["\\sin^2 120^\\circ", 0.75, 60], ["\\cos 120^\\circ + \\sin 150^\\circ", 0, "60^\\circ,\\ 30"]];
        const [tex, val, ref] = r.pick(items);
        return task({
          text: L(`Find the exact value of $${tex}$. Give it as a decimal.`, `$${tex}$ का यथार्थ मान ज्ञात कीजिए। उत्तर दशमलव में दीजिए।`),
          answer: numM(val, null, [
            [-val, L("Check the sign in that quadrant (All–Sin–Tan–Cos).", "उस चतुर्थांश में चिह्न जाँचिए (All–Sin–Tan–Cos)।")],
            [Math.abs(val) === 0.5 ? S3 * Math.sign(val) : NaN, L("Use the reference angle with the same function (sine stays sine).", "संदर्भ कोण के साथ वही फलन लीजिए (sin, sin ही रहता है और cos, cos ही)।")],
          ]),
          hint: L(
            "Write the angle as $180^\\circ \\pm \\alpha$ or $360^\\circ - \\alpha$, use the reference angle $\\alpha$, then decide the sign from the quadrant.",
            "कोण को $180^\\circ \\pm \\alpha$ या $360^\\circ - \\alpha$ के रूप में लिखिए, संदर्भ कोण $\\alpha$ का प्रयोग कीजिए, फिर चतुर्थांश से चिह्न तय कीजिए।"
          ),
          formula: "\\sin(180^\\circ - \\alpha) = \\sin\\alpha,\\ \\cos(180^\\circ - \\alpha) = -\\cos\\alpha",
          solution: L(
            `Reference angle: $${ref}^\\circ$.\nSign from the quadrant (All–Sin–Tan–Cos).\n$${tex} = ${en(val)}$`,
            `संदर्भ कोण: $${ref}^\\circ$।\nचिह्न चतुर्थांश से (All–Sin–Tan–Cos)।\n$${tex} = ${en(val)}$`
          ),
        });
      }
      const v = r.int(0, 4);
      const cosT = frac(b, c);
      if (v === 0) {
        const cs = `$\\cos\\theta = \\sqrt{1 - \\left(${frac(a, c)}\\right)^2} = ${cosT}$`;
        const s2 = `$\\sin 2\\theta = 2 \\cdot ${frac(a, c)} \\cdot ${cosT} = ${fracTex(2 * a * b, c * c)}$`;
        return task({
          text: L(
            `If $\\sin\\theta = ${fracTex(a, c)}$ and $\\theta$ is acute, what is $\\sin 2\\theta$?`,
            `यदि $\\sin\\theta = ${fracTex(a, c)}$ है और $\\theta$ न्यून कोण है, तो $\\sin 2\\theta$ का मान क्या है?`
          ) + FRAC,
          answer: fractionM(2 * a * b, c * c, [
            [(2 * a) / c, L("$\\sin 2\\theta \\neq 2\\sin\\theta$; use the double-angle formula.", "$\\sin 2\\theta \\neq 2\\sin\\theta$; द्विगुण कोण सूत्र का प्रयोग कीजिए।")],
            [(a * b) / (c * c), L("You forgot the factor 2 in $2\\sin\\theta\\cos\\theta$.", "आप $2\\sin\\theta\\cos\\theta$ में गुणक 2 भूल गए।")],
          ]),
          inputHint: eg(L, "24/25"),
          hint: L(
            "Find $\\cos\\theta$ first, then use $\\sin 2\\theta = 2 \\sin\\theta \\cos\\theta$.",
            "पहले $\\cos\\theta$ ज्ञात कीजिए, फिर $\\sin 2\\theta = 2 \\sin\\theta \\cos\\theta$ का प्रयोग कीजिए।"
          ),
          formula: "\\sin 2\\theta = 2\\sin\\theta\\cos\\theta",
          solution: L(`${cs}\n${s2}`, `पहले ${cs}\nद्विगुण कोण सूत्र से: ${s2}`),
        });
      }
      if (v === 1) {
        const ss = `$\\sin^2\\theta = ${frac(a * a, c * c)}$`;
        const c2 = `$\\cos 2\\theta = 1 - 2 \\cdot ${frac(a * a, c * c)} = ${fracTex(c * c - 2 * a * a, c * c)}$`;
        return task({
          text: L(
            `If $\\sin\\theta = ${fracTex(a, c)}$ and $\\theta$ is acute, what is $\\cos 2\\theta$?`,
            `यदि $\\sin\\theta = ${fracTex(a, c)}$ है और $\\theta$ न्यून कोण है, तो $\\cos 2\\theta$ का मान क्या है?`
          ) + FRAC,
          answer: fractionM(b * b - a * a, c * c, [
            [(a * a - b * b) / (c * c), L("Sign error: $\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta$.", "चिह्न की त्रुटि: $\\cos 2\\theta = \\cos^2\\theta - \\sin^2\\theta$ होता है।")],
            [(2 * b) / c, L("$\\cos 2\\theta \\neq 2\\cos\\theta$.", "ध्यान दीजिए: $\\cos 2\\theta \\neq 2\\cos\\theta$।")],
            [1 - (2 * a) / c, L("Use $1 - 2\\sin^2\\theta$: the sine must be squared.", "$1 - 2\\sin^2\\theta$ का प्रयोग कीजिए: sin का वर्ग करना आवश्यक है।")],
          ]),
          inputHint: eg(L, "7/25"),
          hint: L("Use $\\cos 2\\theta = 1 - 2\\sin^2\\theta$.", "सूत्र $\\cos 2\\theta = 1 - 2\\sin^2\\theta$ का प्रयोग कीजिए।"),
          formula: "\\cos 2\\theta = 1 - 2\\sin^2\\theta",
          solution: L(`${ss}\n${c2}`, `यहाँ ${ss}\nसूत्र से: ${c2}`),
        });
      }
      if (v === 2) {
        const l1 = `$2\\tan\\theta = ${fracTex(2 * a, b)}$`;
        const l2 = `$1 - \\tan^2\\theta = 1 - ${frac(a * a, b * b)} = ${fracTex(b * b - a * a, b * b)}$`;
        const l3 = `$\\tan 2\\theta = ${fracTex(2 * a, b)} \\div ${fracTex(b * b - a * a, b * b)} = ${fracTex(2 * a * b, b * b - a * a)}$`;
        return task({
          text: L(`If $\\tan\\theta = ${fracTex(a, b)}$, what is $\\tan 2\\theta$?`, `यदि $\\tan\\theta = ${fracTex(a, b)}$ है, तो $\\tan 2\\theta$ का मान क्या है?`) + FRAC,
          answer: fractionM(2 * a * b, b * b - a * a, [
            [(2 * a) / b, L("$\\tan 2\\theta \\neq 2\\tan\\theta$; use the double-angle formula.", "$\\tan 2\\theta \\neq 2\\tan\\theta$; द्विगुण कोण सूत्र का प्रयोग कीजिए।")],
            [(2 * a * b) / (b * b + a * a), L("The denominator is $1 - \\tan^2\\theta$, not $1 + \\tan^2\\theta$.", "हर $1 + \\tan^2\\theta$ नहीं, बल्कि $1 - \\tan^2\\theta$ होता है।")],
          ]),
          inputHint: eg(L, "24/7"),
          hint: L("Use $\\tan 2\\theta = \\dfrac{2\\tan\\theta}{1 - \\tan^2\\theta}$.", "सूत्र $\\tan 2\\theta = \\dfrac{2\\tan\\theta}{1 - \\tan^2\\theta}$ का प्रयोग कीजिए।"),
          formula: "\\tan 2\\theta = \\dfrac{2\\tan\\theta}{1 - \\tan^2\\theta}",
          solution: L(`${l1}\n${l2}\n${l3}`, `अंश: ${l1}\nहर: ${l2}\n${l3}`),
        });
      }
      if (v === 3) {
        // Drug trikotnik (ne podobni), sicer je lahko A + B = 90°.
        const [p0, q0, s] = reduced(r.pick(TRIPLES.filter((t) => reduced(t)[2] !== c)));
        const [p, q] = r.next() < 0.5 ? [p0, q0] : [q0, p0];
        // sin A = a/c, cos B = q/s; oba kota ostra
        const l1 = `$\\cos A = ${frac(b, c)}$, $\\sin B = ${frac(p, s)}$`;
        const rest = `$\\sin(A+B) = ${frac(a, c)} \\cdot ${frac(q, s)} + ${frac(b, c)} \\cdot ${frac(p, s)} = ${frac(a * q + b * p, c * s)}$${fracTex(a * q + b * p, c * s) === frac(a * q + b * p, c * s) ? "" : `\n$= ${fracTex(a * q + b * p, c * s)}$`}`;
        return task({
          text: L(
            `$A$ and $B$ are acute angles with $\\sin A = ${fracTex(a, c)}$ and $\\cos B = ${fracTex(q, s)}$. What is $\\sin(A + B)$?`,
            `$A$ और $B$ न्यून कोण हैं, जिनके लिए $\\sin A = ${fracTex(a, c)}$ और $\\cos B = ${fracTex(q, s)}$ है। $\\sin(A + B)$ का मान क्या है?`
          ) + FRAC,
          answer: fractionM(a * q + b * p, c * s, [
            [a / c + p / s, L("$\\sin(A+B) \\neq \\sin A + \\sin B$; use the addition formula.", "$\\sin(A+B) \\neq \\sin A + \\sin B$; योग सूत्र का प्रयोग कीजिए।")],
            [(a * q - b * p) / (c * s), L("That is $\\sin(A - B)$; for $A + B$ both terms are added.", "यह $\\sin(A - B)$ है; $A + B$ के लिए दोनों पद जोड़े जाते हैं।")],
          ]),
          inputHint: eg(L, "56/65"),
          hint: L(
            "Find $\\cos A$ and $\\sin B$ first, then use $\\sin(A+B) = \\sin A\\cos B + \\cos A\\sin B$.",
            "पहले $\\cos A$ और $\\sin B$ ज्ञात कीजिए, फिर $\\sin(A+B) = \\sin A\\cos B + \\cos A\\sin B$ का प्रयोग कीजिए।"
          ),
          formula: "\\sin(A+B) = \\sin A\\cos B + \\cos A \\sin B",
          solution: L(`${l1}\n${rest}`, `पहले ${l1}\nयोग सूत्र से: ${rest}`),
        });
      }
      const c1 = `$|\\cos\\theta| = \\sqrt{1 - \\left(${frac(a, c)}\\right)^2} = ${frac(b, c)}$`;
      const c3 = `$\\tan\\theta = ${frac(a, c)} : \\left(-${frac(b, c)}\\right) = ${fracTex(-a, b)}$`;
      return task({
        text: L(
          `If $\\sin\\theta = ${fracTex(a, c)}$ and $\\theta$ is obtuse, what is $\\tan\\theta$?`,
          `यदि $\\sin\\theta = ${fracTex(a, c)}$ है और $\\theta$ अधिक कोण है, तो $\\tan\\theta$ का मान क्या है?`
        ) + FRAC,
        answer: fractionM(-a, b, [
          [a / b, L("An obtuse angle is in quadrant II, where the tangent is negative.", "अधिक कोण दूसरे चतुर्थांश में होता है, जहाँ tan का मान ऋणात्मक होता है।")],
          [-b / a, L("That is $\\cot\\theta$; $\\tan\\theta = \\sin\\theta / \\cos\\theta$.", "यह $\\cot\\theta$ है; $\\tan\\theta = \\sin\\theta / \\cos\\theta$ होता है।")],
        ]),
        inputHint: eg(L, "-3/4"),
        hint: L("Find $\\cos\\theta$ (negative for an obtuse angle), then divide.", "$\\cos\\theta$ ज्ञात कीजिए (अधिक कोण के लिए यह ऋणात्मक है), फिर भाग दीजिए।"),
        formula: "\\tan\\theta = \\dfrac{\\sin\\theta}{\\cos\\theta}",
        solution: L(
          `${c1}\n$\\theta$ obtuse, so $\\cos\\theta = -${frac(b, c)}$\n${c3}`,
          `${c1}\n$\\theta$ अधिक कोण है, अतः $\\cos\\theta = -${frac(b, c)}$\n${c3}`
        ),
      });
    },
  },
  {
    id: "ex-coordinate",
    topics: [T("coordinate-geometry")],
    langs: LANGS,
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const x1 = r.int(-6, 6), y1 = r.int(-6, 6);
      if (level === 1) {
        const [a, b, c] = r.pick(TRIPLES.slice(0, 4));
        const [dx, dy] = r.next() < 0.5 ? [a, b] : [b, a];
        const sx = r.pick([1, -1]), sy = r.pick([1, -1]);
        const P1 = `$(${x1}, ${y1})$`, P2 = `$(${x1 + sx * dx}, ${y1 + sy * dy})$`;
        const sol = `$d = \\sqrt{${dx}^2 + ${dy}^2} = \\sqrt{${c * c}} = ${c}$`;
        return task({
          text: L(`What is the distance between the points ${P1} and ${P2}?`, `बिंदुओं ${P1} और ${P2} के बीच की दूरी क्या है?`),
          answer: num(c),
          hint: L("$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$.", "दूरी सूत्र: $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$।"),
          formula: "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}",
          solution: L(sol, `दूरी सूत्र से: ${sol}`),
        });
      }
      const x2 = x1 + r.nonZero(-5, 5), y2 = r.int(-6, 6);
      if (level === 2) {
        const sol = `$k = \\dfrac{${y2} - ${par(y1)}}{${x2} - ${par(x1)}} = ${fracTex(y2 - y1, x2 - x1)}$`;
        return task({
          text: L(
            `What is the slope of the line through $(${x1}, ${y1})$ and $(${x2}, ${y2})$? Write it as a fraction or a whole number.`,
            `बिंदुओं $(${x1}, ${y1})$ और $(${x2}, ${y2})$ से होकर जाने वाली रेखा की ढाल क्या है? उत्तर भिन्न या पूर्ण संख्या के रूप में लिखिए।`
          ),
          answer: fraction(y2 - y1, x2 - x1),
          inputHint: eg(L, "-3/2"),
          hint: L("slope $= \\dfrac{y_2 - y_1}{x_2 - x_1}$.", "ढाल $= \\dfrac{y_2 - y_1}{x_2 - x_1}$।"),
          formula: "k = \\dfrac{y_2 - y_1}{x_2 - x_1}",
          solution: L(sol, `ढाल: ${sol}`),
        });
      }
      const k = r.nonZero(-3, 3), n = r.int(-8, 8);
      const xa = r.int(-4, 0), xb = xa + r.int(1, 4);
      const ks = `$k = \\dfrac{${k * xb + n} - ${par(k * xa + n)}}{${xb} - ${par(xa)}} = ${k}$`;
      const ns = `$n = y - kx = ${k * xa + n} - ${par(k)} \\cdot ${par(xa)} = ${n}$`;
      return task({
        text: L(
          `A line passes through $(${xa}, ${k * xa + n})$ and $(${xb}, ${k * xb + n})$. What is its $y$-intercept?`,
          `एक रेखा बिंदुओं $(${xa}, ${k * xa + n})$ और $(${xb}, ${k * xb + n})$ से होकर जाती है। इसका $y$-अंतःखंड क्या है?`
        ),
        answer: num(n),
        hint: L("Find the slope, then use $y = kx + n$ with one of the points.", "पहले ढाल ज्ञात कीजिए, फिर किसी एक बिंदु के साथ $y = kx + n$ का प्रयोग कीजिए।"),
        solution: L(`${ks}\n${ns}`, `ढाल: ${ks}\n$y$-अंतःखंड: ${ns}`),
      });
    },
  },
  {
    id: "ex-combinatorics",
    topics: [T("permutations-and-combinations")],
    langs: LANGS,
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      if (level === 1) {
        const n = r.int(5, 10), k = r.int(2, 4);
        const sol = `$\\binom{${n}}{${k}} = ${nCr(n, k)}$`;
        return task({
          text: L(`In how many ways can a committee of ${k} be chosen from ${n} students?`, `${n} विद्यार्थियों में से ${k} सदस्यों की एक समिति कितने प्रकार से चुनी जा सकती है?`),
          answer: num(nCr(n, k)),
          hint: L("Order does not matter: use $\\binom{n}{k}$.", "यहाँ क्रम का महत्व नहीं है: $\\binom{n}{k}$ का प्रयोग कीजिए।"),
          formula: "\\binom{n}{k} = \\dfrac{n!}{k!\\,(n-k)!}",
          solution: L(sol, `संचय: ${sol}`),
        });
      }
      if (level === 2) {
        const n = r.int(4, 7), k = r.int(2, 3);
        const v = fact(n) / fact(n - k);
        const sol = `$${Array.from({ length: k }, (_, i) => n - i).join(" \\cdot ")} = ${v}$`;
        return task({
          text: L(
            `${n} runners take part in a race. In how many ways can the ${k === 2 ? "gold and silver medals" : "gold, silver and bronze medals"} be awarded?`,
            `एक दौड़ में ${n} धावक भाग लेते हैं। ${k === 2 ? "स्वर्ण और रजत पदक" : "स्वर्ण, रजत और कांस्य पदक"} कितने प्रकार से दिए जा सकते हैं?`
          ),
          answer: num(v),
          hint: L("Order matters: $n(n-1)\\cdots$.", "यहाँ क्रम का महत्व है: $n(n-1)\\cdots$।"),
          formula: "V_n^k = \\dfrac{n!}{(n-k)!}",
          solution: L(sol, `क्रमचय: ${sol}`),
        });
      }
      const boys = r.int(4, 7), girls = r.int(3, 6), k = 3;
      const v = nCr(boys + girls, k) - nCr(boys, k);
      const all = `$\\binom{${boys + girls}}{${k}} = ${nCr(boys + girls, k)}$`, only = `$\\binom{${boys}}{${k}} = ${nCr(boys, k)}$`;
      const diff = `$${nCr(boys + girls, k)} - ${nCr(boys, k)} = ${v}$`;
      return task({
        text: L(
          `A group has ${boys} boys and ${girls} girls. In how many ways can a team of ${k} be chosen if it must include at least one girl?`,
          `एक समूह में ${boys} लड़के और ${girls} लड़कियाँ हैं। ${k} सदस्यों की एक टीम कितने प्रकार से चुनी जा सकती है, यदि टीम में कम से कम एक लड़की का होना आवश्यक है?`
        ),
        answer: num(v),
        hint: L("Count all teams and subtract the teams with no girls.", "सभी संभव टीमें गिनिए और उनमें से वे टीमें घटाइए जिनमें कोई लड़की नहीं है।"),
        solution: L(`All teams: ${all}; only boys: ${only}.\n${diff}`, `सभी टीमें: ${all}; केवल लड़के: ${only}।\n${diff}`),
      });
    },
  },
  {
    id: "ex-derivatives",
    topics: [T("differentiation")],
    langs: LANGS,
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const a = r.nonZero(-4, 5), b = r.int(-6, 6), c = r.int(-9, 9), x0 = r.int(-3, 3);
      if (level === 1) {
        const n = r.int(2, 4);
        const d = a * n * x0 ** (n - 1) + b;
        const sol = `$f'(x) = ${poly([[a * n, n === 2 ? "x" : `x^{${n - 1}}`], [b, ""]])}$\n$f'(${x0}) = ${a * n} \\cdot ${par(x0)}${n === 2 ? "" : `^{${n - 1}}`} ${b ? sg(b) : ""} = ${d}$`;
        const ff = `$f(x) = ${poly([[a, `x^${n}`], [b, "x"], [c, ""]])}$`;
        return task({
          text: L(`If ${ff}, what is $f'(${x0})$?`, `यदि ${ff} है, तो $f'(${x0})$ का मान क्या है?`),
          answer: num(d),
          hint: L("$(x^n)' = n x^{n-1}$; constants differentiate to 0.", "$(x^n)' = n x^{n-1}$; अचर का अवकलज 0 होता है।"),
          formula: "(x^n)' = n x^{n-1}",
          solution: L(sol, `अवकलज: ${sol}`),
        });
      }
      if (level === 2) {
        const p = r.nonZero(-2, 2);
        const fv = p * x0 ** 3 + b * x0 + c, d = 3 * p * x0 * x0 + b;
        const n = fv - d * x0;
        const cur = `$y = ${poly([[p, "x^3"], [b, "x"], [c, ""]])}$`;
        const l1 = `$y(${x0}) = ${fv}$, $y' = ${poly([[3 * p, "x^2"], [b, ""]])}$, $m = ${d}$`;
        const l2 = `$n = ${fv} - ${par(d)} \\cdot ${par(x0)} = ${n}$`;
        return task({
          text: L(
            `The tangent to ${cur} at $x = ${x0}$ has equation $y = mx + n$. What is $n$?`,
            `वक्र ${cur} के बिंदु $x = ${x0}$ पर स्पर्श रेखा का समीकरण $y = mx + n$ है। $n$ का मान क्या है?`
          ),
          answer: num(n),
          hint: L(
            "Slope $m = y'(x_0)$; the tangent passes through $(x_0, y(x_0))$.",
            "ढाल $m = y'(x_0)$ है; स्पर्श रेखा बिंदु $(x_0, y(x_0))$ से होकर जाती है।"
          ),
          solution: L(`${l1}\n${l2}`, `${l1}\nअतः ${l2}`),
        });
      }
      const k = r.int(1, 4), s = r.pick([1, -1]);
      const ext = s > 0 ? L("minimum", "निम्नतम") : L("maximum", "उच्चतम");
      const ff = `$f(x) = ${poly([[1, "x^3"], [-3 * k * k, "x"], [c, ""]])}$`;
      const l1 = `$f'(x) = 3x^2 - ${3 * k * k} = 0 \\Rightarrow x = \\pm ${k}$`;
      return task({
        text: L(`The function ${ff} has a local ${ext}. At what value of $x$?`, `फलन ${ff} का $x$ के किस मान पर स्थानीय ${ext} है?`),
        answer: num(s * k),
        hint: L("Solve $f'(x) = 0$ and check the sign of $f''(x)$.", "$f'(x) = 0$ को हल कीजिए और $f''(x)$ का चिह्न जाँचिए।"),
        solution: L(
          `${l1}\n$f''(x) = 6x$: $f''(${k}) > 0$ (minimum), $f''(${-k}) < 0$ (maximum).\nSo the local ${ext} is at $x = ${s * k}$.`,
          `${l1}\n$f''(x) = 6x$: $f''(${k}) > 0$ (निम्नतम), $f''(${-k}) < 0$ (उच्चतम)।\nअतः स्थानीय ${ext} $x = ${s * k}$ पर है।`
        ),
      });
    },
  },
  {
    id: "ex-integrals",
    topics: [T("integration")],
    langs: LANGS,
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const EV = (ex) => L(`Evaluate ${ex}.`, `${ex} का मान ज्ञात कीजिए।`);
      const FW = L(" Write it as a fraction or a whole number.", " उत्तर भिन्न या पूर्ण संख्या के रूप में लिखिए।");
      if (level === 1) {
        if (r.next() < 0.25) {
          const k = r.int(2, 9), sin = r.next() < 0.5;
          const val = sin ? 2 * k : k;
          const sol = sin
            ? `$\\int_0^{\\pi} ${k}\\sin x\\,dx = ${k}\\left[-\\cos x\\right]_0^{\\pi}$\n$= ${k}\\left(-\\cos\\pi + \\cos 0\\right) = ${k}(1 + 1) = ${val}$`
            : `$\\int_0^{\\pi/2} ${k}\\cos x\\,dx = ${k}\\left[\\sin x\\right]_0^{\\pi/2}$\n$= ${k}(1 - 0) = ${val}$`;
          return task({
            text: EV(`$\\displaystyle\\int_0^{${sin ? "\\pi" : "\\pi/2"}} ${k}\\${sin ? "sin" : "cos"} x\\,dx$`),
            answer: numM(val, null, [
              [sin ? 0 : -k, sin ? L("Check the sign: an antiderivative of $\\sin x$ is $-\\cos x$.", "चिह्न जाँचिए: $\\sin x$ का प्रतिअवकलज $-\\cos x$ है।") : L("An antiderivative of $\\cos x$ is $+\\sin x$.", "$\\cos x$ का प्रतिअवकलज $+\\sin x$ है।")],
              [sin ? -2 * k : 0, sin ? L("$[-\\cos x]_0^{\\pi} = -\\cos\\pi + \\cos 0$; watch both signs.", "$[-\\cos x]_0^{\\pi} = -\\cos\\pi + \\cos 0$; दोनों चिह्नों पर ध्यान दीजिए।") : L("Use $\\sin(\\pi/2) = 1$ and $\\sin 0 = 0$.", "$\\sin(\\pi/2) = 1$ और $\\sin 0 = 0$ का प्रयोग कीजिए।")],
            ]),
            hint: L(
              `Find an antiderivative of $\\${sin ? "sin" : "cos"} x$ and substitute the limits.`,
              `$\\${sin ? "sin" : "cos"} x$ का प्रतिअवकलज ज्ञात कीजिए और सीमाएँ रखिए।`
            ),
            formula: sin ? "\\int \\sin x\\,dx = -\\cos x + C" : "\\int \\cos x\\,dx = \\sin x + C",
            solution: L(sol, `प्रतिअवकलज से: ${sol}`),
          });
        }
        const n = r.int(0, 3), a = r.int(1, 4), b = r.int(1, n === 3 ? 3 : 5);
        const c = (n + 1) * a, val = a * b ** (n + 1);
        const integrand = n === 0 ? `${c}` : `${c}${n === 1 ? "x" : `x^{${n}}`}`;
        const F = `$F(x) = ${co(a, n === 0 ? "x" : `x^{${n + 1}}`)}$\n$F(${b}) - F(0) = ${a === 1 ? "" : `${a} \\cdot `}${b}^{${n + 1}} - 0 = ${val}$`;
        return task({
          text: EV(`$\\displaystyle\\int_0^{${b}} ${integrand}\\,dx$`),
          answer: numM(val, null, [
            [c * b ** (n + 1), L(`You forgot to divide by $n + 1 = ${n + 1}$.`, `आप $n + 1 = ${n + 1}$ से भाग देना भूल गए।`)],
            [n ? c * n * b ** (n - 1) : NaN, L("You differentiated instead of integrating.", "आपने समाकलन के स्थान पर अवकलन कर दिया।")],
            [n ? a * b ** n : NaN, L("Raise the power by one: $x^n \\to \\dfrac{x^{n+1}}{n+1}$.", "घात को एक बढ़ाइए: $x^n \\to \\dfrac{x^{n+1}}{n+1}$।")],
          ]),
          hint: L(
            "Use the power rule for integrals, then substitute the upper and lower limits.",
            "समाकलन के घात नियम का प्रयोग कीजिए, फिर ऊपरी और निचली सीमाएँ रखिए।"
          ),
          formula: "\\int x^n\\,dx = \\dfrac{x^{n+1}}{n+1} + C",
          solution: L(`Antiderivative: ${F}`, `प्रतिअवकलज: ${F}`),
        });
      }
      if (level === 2) {
        const v = r.int(0, 2);
        if (v === 0) {
          const p = r.int(1, 3), q = r.int(-4, 5), lo = r.int(0, 2), hi = lo + r.int(1, 3);
          const F = (x) => p * x ** 3 + q * x;
          const sol = `$F(x) = ${poly([[p, "x^3"], [q, "x"]])}$\n$F(${hi}) = ${F(hi)}$, $F(${lo}) = ${F(lo)}$\n$F(${hi}) - F(${lo}) = ${F(hi)} - ${par(F(lo))} = ${F(hi) - F(lo)}$`;
          return task({
            text: EV(`$\\displaystyle\\int_{${lo}}^{${hi}} (${poly([[3 * p, "x^2"], [q, ""]])})\\,dx$`),
            answer: numM(F(hi) - F(lo), null, [
              [F(hi), L("Subtract the value of the antiderivative at the lower limit.", "निचली सीमा पर प्रतिअवकलज का मान घटाइए।")],
              [F(hi) + F(lo), L("It is $F(b) - F(a)$, not $F(b) + F(a)$.", "यह $F(b) + F(a)$ नहीं, बल्कि $F(b) - F(a)$ होता है।")],
              [3 * p * hi * hi + q - (3 * p * lo * lo + q), L("You substituted into $f$ instead of into the antiderivative $F$.", "आपने सीमाएँ प्रतिअवकलज $F$ के स्थान पर $f$ में रख दीं।")],
            ]),
            hint: L("Find an antiderivative, then subtract its values at the limits.", "प्रतिअवकलज ज्ञात कीजिए, फिर सीमाओं पर उसके मानों का अंतर लीजिए।"),
            formula: "\\int_a^b f(x)\\,dx = F(b) - F(a)",
            solution: L(sol, `प्रतिअवकलज: ${sol}`),
          });
        }
        if (v === 1) {
          const bb = r.int(2, 6), c = bb * r.int(1, 4);
          const val = c - c / bb;
          const sol = `$F(x) = -\\dfrac{${c}}{x}$\n$F(${bb}) - F(1) = -${fracTex(c, bb)} + ${c}$\n$= ${en(val)}$`;
          return task({
            text: EV(`$\\displaystyle\\int_1^{${bb}} \\dfrac{${c}}{x^2}\\,dx$`),
            answer: numM(val, null, [
              [c / bb - c, L("Sign error: an antiderivative of $x^{-2}$ is $-x^{-1}$.", "चिह्न की त्रुटि: $x^{-2}$ का प्रतिअवकलज $-x^{-1}$ है।")],
              [c * Math.log(bb), L("That would be $\\int \\frac{1}{x}dx$; here the power is $-2$.", "यह $\\int \\frac{1}{x}dx$ का मान होता; यहाँ घात $-2$ है।")],
              [c, L("Subtract the value at the upper limit as well.", "ऊपरी सीमा वाला पद भी शामिल कीजिए।")],
            ]),
            hint: L("Write the integrand as $" + c + "x^{-2}$ and use the power rule.", "समाकल्य को $" + c + "x^{-2}$ के रूप में लिखिए और घात नियम का प्रयोग कीजिए।"),
            formula: "\\int x^{-2}\\,dx = -x^{-1} + C",
            solution: L(sol, `प्रतिअवकलज: ${sol}`),
          });
        }
        const k = r.int(2, 9);
        const sol = `$\\left[e^x\\right]_0^{\\ln ${k}} = e^{\\ln ${k}} - e^0$\n$= ${k} - 1 = ${k - 1}$`;
        return task({
          text: EV(`$\\displaystyle\\int_0^{\\ln ${k}} e^{x}\\,dx$`),
          answer: numM(k - 1, null, [
            [k, L("Subtract the value at the lower limit: $e^0 = 1$, not 0.", "निचली सीमा का मान घटाइए: $e^0 = 1$ है, 0 नहीं।")],
            [Math.log(k), L("$e^{\\ln k} = k$; substitute into $e^x$.", "$e^{\\ln k} = k$; सीमाएँ $e^x$ में रखिए।")],
          ]),
          hint: L("An antiderivative of $e^x$ is $e^x$; use $e^{\\ln k} = k$.", "$e^x$ का प्रतिअवकलज $e^x$ है; $e^{\\ln k} = k$ का प्रयोग कीजिए।"),
          formula: "\\int e^x\\,dx = e^x + C",
          solution: L(sol, `प्रतिअवकलज $e^x$ है: ${sol}`),
        });
      }
      const v = r.int(0, 4);
      if (v === 0) {
        const k = r.int(1, 6);
        const rest = `$A = \\int_0^{${k}} (${co(k)} - x^2)\\,dx = \\left[\\tfrac{${k}}{2}x^2 - \\tfrac{x^3}{3}\\right]_0^{${k}}$\n$= ${fracTex(k ** 3, 2)} - ${fracTex(k ** 3, 3)} = ${fracTex(k ** 3, 6)}$`;
        return task({
          text: L(
            `Find the area of the region enclosed by $y = x^2$ and $y = ${co(k)}$.`,
            `$y = x^2$ और $y = ${co(k)}$ से परिबद्ध क्षेत्र का क्षेत्रफल ज्ञात कीजिए।`
          ) + FW,
          answer: fractionM(k ** 3, 6, [
            [k ** 3 / 2, L("That is the area under the line only; subtract the area under the parabola.", "यह केवल रेखा के नीचे का क्षेत्रफल है; परवलय के नीचे का क्षेत्रफल घटाइए।")],
            [k ** 3 / 3, L("That is the area under the parabola; take (upper − lower).", "यह परवलय के नीचे का क्षेत्रफल है; (ऊपरी − निचला) लीजिए।")],
          ]),
          inputHint: eg(L, "9/2"),
          hint: L("Find the intersection points, then integrate (upper − lower).", "प्रतिच्छेद बिंदु ज्ञात कीजिए, फिर (ऊपरी − निचला) का समाकलन कीजिए।"),
          formula: "A = \\int_a^b (f(x) - g(x))\\,dx",
          solution: L(
            `Intersections: $x^2 = ${co(k)} \\Rightarrow x = 0, x = ${k}$\n${rest}`,
            `प्रतिच्छेद बिंदु: $x^2 = ${co(k)} \\Rightarrow x = 0, x = ${k}$\n${rest}`
          ),
        });
      }
      if (v === 1) {
        const m = r.int(1, 5);
        const rest = `$A = \\int_{-${m}}^{${m}} (${m * m} - x^2)\\,dx = \\left[${m * m}x - \\tfrac{x^3}{3}\\right]_{-${m}}^{${m}}$\n$= 2\\left(${m ** 3} - ${fracTex(m ** 3, 3)}\\right) = ${fracTex(4 * m ** 3, 3)}$`;
        return task({
          text: L(
            `Find the area of the region between the curve $y = ${m * m} - x^2$ and the x-axis.`,
            `वक्र $y = ${m * m} - x^2$ और x-अक्ष के बीच के क्षेत्र का क्षेत्रफल ज्ञात कीजिए।`
          ) + FW,
          answer: fractionM(4 * m ** 3, 3, [
            [(2 * m ** 3) / 3, L("Integrate over the whole interval $[-" + m + ", " + m + "]$, not just $[0, " + m + "]$.", "केवल $[0, " + m + "]$ पर नहीं, पूरे अंतराल $[-" + m + ", " + m + "]$ पर समाकलन कीजिए।")],
            [2 * m ** 3, L("You forgot to subtract the integral of $x^2$ (that is the whole rectangle).", "आप $x^2$ का समाकल घटाना भूल गए (यह पूरे आयत का क्षेत्रफल है)।")],
          ]),
          inputHint: eg(L, "32/3"),
          hint: L(
            "Find where the curve meets the x-axis, then integrate between those points.",
            "ज्ञात कीजिए कि वक्र x-अक्ष को कहाँ काटता है, फिर उन बिंदुओं के बीच समाकलन कीजिए।"
          ),
          formula: "A = \\int_a^b f(x)\\,dx",
          solution: L(
            `Zeros: $${m * m} - x^2 = 0 \\Rightarrow x = \\pm ${m}$\n${rest}`,
            `x-अक्ष से प्रतिच्छेद: $${m * m} - x^2 = 0 \\Rightarrow x = \\pm ${m}$\n${rest}`
          ),
        });
      }
      if (v === 2) {
        const k = r.int(2, 8), c = r.int(1, 6), N = k * k + c * k;
        const l12 = `$\\int_0^k (2x + ${c})\\,dx = k^2 + ${c}k$\n$k^2 + ${c}k - ${N} = 0 \\Rightarrow (k - ${k})(k + ${k + c}) = 0$`;
        return task({
          text: L(
            `Find the positive number $k$ such that $\\displaystyle\\int_0^{k} (2x + ${c})\\,dx = ${N}$.`,
            `वह धनात्मक संख्या $k$ ज्ञात कीजिए जिसके लिए $\\displaystyle\\int_0^{k} (2x + ${c})\\,dx = ${N}$ हो।`
          ),
          answer: numM(k, null, [
            [Math.sqrt(N), L(`You dropped the term ${c}k from the antiderivative.`, `आपने प्रतिअवकलज में से पद ${c}k छोड़ दिया।`)],
            [N / c, L("Integrate both terms: the antiderivative is $x^2 + " + c + "x$.", "दोनों पदों का समाकलन कीजिए: प्रतिअवकलज $x^2 + " + c + "x$ है।")],
          ]),
          hint: L(
            "Integrate to get an expression in $k$, then solve the quadratic equation.",
            "समाकलन करके $k$ में एक व्यंजक प्राप्त कीजिए, फिर द्विघात समीकरण हल कीजिए।"
          ),
          formula: "\\int_0^k (2x + c)\\,dx = k^2 + ck",
          solution: L(`${l12}\n$k > 0$, so $k = ${k}$`, `${l12}\n$k > 0$ है, अतः $k = ${k}$`),
        });
      }
      if (v === 3) {
        const a = r.int(1, 6), b = r.int(0, 8), Tt = r.int(2, 8);
        const s = 0.5 * a * Tt * Tt + b * Tt;
        const sol = `$s = \\int_0^{${Tt}} (${poly([[a, "t"], [b, ""]])})\\,dt = \\left[\\tfrac{${a}}{2}t^2 ${b ? `+ ${b}t` : ""}\\right]_0^{${Tt}}$\n$= ${en(0.5 * a * Tt * Tt)}${b ? ` + ${b * Tt}` : ""} = ${en(s)}\\ \\text{m}$`;
        return task({
          text: L(
            `A particle moves along a line with velocity $v(t) = ${poly([[a, "t"], [b, ""]])}$ m/s. How far does it travel from $t = 0$ to $t = ${Tt}$ s, in meters?`,
            `एक कण एक सरल रेखा के अनुदिश वेग $v(t) = ${poly([[a, "t"], [b, ""]])}$ m/s से चलता है। $t = 0$ से $t = ${Tt}$ s तक यह कितने मीटर दूरी तय करता है?`
          ),
          data: { given: [`v(t) = ${poly([[a, "t"], [b, ""]])}\\ \\mathrm{m/s}`, dq("T", Tt, "s")], find: ["s"] },
          answer: numM(s, null, [
            [(a * Tt + b) * Tt, L("The velocity is not constant: integrate $v(t)$ instead of using $v(T)\\cdot T$.", "वेग अचर नहीं है: $v(T)\\cdot T$ के स्थान पर $v(t)$ का समाकलन कीजिए।")],
            [a * Tt + b, L("That is the final velocity; distance is the integral of velocity.", "यह अंतिम वेग है; दूरी वेग का समाकल होती है।")],
            [a * Tt * Tt + b * Tt, L("An antiderivative of $" + a + "t$ is $\\tfrac{" + a + "}{2}t^2$.", "$" + a + "t$ का प्रतिअवकलज $\\tfrac{" + a + "}{2}t^2$ है।")],
          ]),
          hint: L(
            "Distance is the integral of velocity over the time interval (the velocity is never negative here).",
            "दूरी, समय-अंतराल पर वेग का समाकल होती है (यहाँ वेग कभी ऋणात्मक नहीं होता)।"
          ),
          formula: "s = \\int_0^T v(t)\\,dt",
          solution: L(sol, `दूरी: ${sol}`),
        });
      }
      const p = 3 * r.int(1, 4), bb = r.int(1, 6);
      const avg = (p * bb * bb) / 3;
      const l1 = `$\\int_0^{${bb}} ${p}x^2\\,dx = \\left[${co(p / 3, "x^3")}\\right]_0^{${bb}} = ${(p * bb ** 3) / 3}$`;
      const l2 = `$\\bar f = \\dfrac{${(p * bb ** 3) / 3}}{${bb}} = ${en(avg)}$`;
      return task({
        text: L(`What is the average value of $f(x) = ${p}x^2$ on the interval $[0, ${bb}]$?`, `अंतराल $[0, ${bb}]$ पर $f(x) = ${p}x^2$ का औसत मान क्या है?`),
        answer: numM(avg, null, [
          [(p * bb ** 3) / 3, L("That is the integral; divide by the length of the interval.", "यह समाकल का मान है; इसे अंतराल की लंबाई से भाग दीजिए।")],
          [(p * bb * bb) / 2, L("The average of $x^2$ is not half of its largest value.", "$x^2$ का औसत उसके सबसे बड़े मान का आधा नहीं होता।")],
          [p * bb * bb, L("That is the largest value of $f$, not the average.", "यह $f$ का सबसे बड़ा मान है, औसत नहीं।")],
        ]),
        hint: L("Average value = (integral over the interval) ÷ (length of the interval).", "औसत मान = (अंतराल पर समाकल) ÷ (अंतराल की लंबाई)।"),
        formula: "\\bar f = \\dfrac{1}{b-a}\\int_a^b f(x)\\,dx",
        solution: L(`${l1}\n${l2}`, `समाकल: ${l1}\nऔसत मान: ${l2}`),
      });
    },
  },
  {
    id: "ex-complex",
    topics: [T("complex-numbers")],
    langs: LANGS,
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const z = (a, b) => `${a} ${b < 0 ? "-" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}i`;
      // Imaginarni člen v vmesnem koraku: 1 → i, −1 → (−i), sicer (k)i.
      const ci = (k) => (k === 1 ? "i" : k === -1 ? "(-i)" : `${par(k)}i`);
      if (level === 1) {
        const [a, b, c] = r.pick(TRIPLES.slice(0, 4));
        const sa = r.pick([1, -1]) * a, sb = r.pick([1, -1]) * b;
        const sol = `$|z| = \\sqrt{${par(sa)}^2 + ${par(sb)}^2} = \\sqrt{${c * c}} = ${c}$`;
        return task({
          text: L(`What is the modulus $|z|$ of $z = ${z(sa, sb)}$?`, `$z = ${z(sa, sb)}$ का मापांक $|z|$ क्या है?`),
          answer: num(c),
          hint: L("$|a + bi| = \\sqrt{a^2 + b^2}$.", "मापांक: $|a + bi| = \\sqrt{a^2 + b^2}$।"),
          solution: L(sol, `मापांक: ${sol}`),
        });
      }
      const a = r.nonZero(-5, 5), b = r.nonZero(-5, 5), c = r.nonZero(-5, 5), d = r.nonZero(-5, 5);
      if (level === 2) {
        const prod = `$(${z(a, b)})(${z(c, d)})$`;
        const l1 = `$(${z(a, b)})(${z(c, d)}) = ${a * c} + ${ci(a * d)} + ${ci(b * c)} + ${ci(b * d)}^2$`;
        const re = `$${a * c} - ${par(b * d)} = ${a * c - b * d}$`;
        return task({
          text: L(`What is the real part of ${prod}?`, `${prod} का वास्तविक भाग क्या है?`),
          answer: num(a * c - b * d),
          hint: L("Multiply out and use $i^2 = -1$.", "कोष्ठक खोलकर गुणा कीजिए और $i^2 = -1$ का प्रयोग कीजिए।"),
          solution: L(`${l1}\nReal part: ${re}`, `${l1}\nवास्तविक भाग: ${re}`),
        });
      }
      const sq = `$(${z(a, b)})^2 = ${a * a - b * b} + ${ci(2 * a * b)}$`;
      return task({
        text: L(`What is the imaginary part of $(${z(a, b)})^2$?`, `$(${z(a, b)})^2$ का काल्पनिक भाग क्या है?`),
        answer: num(2 * a * b),
        hint: L("$(a + bi)^2 = a^2 - b^2 + 2abi$.", "सूत्र: $(a + bi)^2 = a^2 - b^2 + 2abi$।"),
        solution: L(`${sq}, so the imaginary part is $${2 * a * b}$.`, `${sq}, अतः काल्पनिक भाग $${2 * a * b}$ है।`),
      });
    },
  },
  {
    id: "ex-vectors",
    topics: [T("vectors")],
    langs: LANGS,
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const v = () => [r.int(-5, 5), r.int(-5, 5), r.int(-5, 5)];
      const vt = (a) => `(${a.join(", ")})`;
      if (level === 1) {
        const a = v(), b = v();
        const d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        const sol = `$${a[0]} \\cdot ${par(b[0])} + ${par(a[1])} \\cdot ${par(b[1])} + ${par(a[2])} \\cdot ${par(b[2])} = ${d}$`;
        return task({
          text: L(
            `What is the dot product $\\vec a \\cdot \\vec b$ for $\\vec a = ${vt(a)}$ and $\\vec b = ${vt(b)}$?`,
            `$\\vec a = ${vt(a)}$ और $\\vec b = ${vt(b)}$ के लिए अदिश गुणनफल $\\vec a \\cdot \\vec b$ क्या है?`
          ),
          answer: num(d),
          hint: L("$\\vec a \\cdot \\vec b = a_1b_1 + a_2b_2 + a_3b_3$.", "अदिश गुणनफल: $\\vec a \\cdot \\vec b = a_1b_1 + a_2b_2 + a_3b_3$।"),
          solution: L(sol, `अदिश गुणनफल: ${sol}`),
        });
      }
      if (level === 2) {
        const [x, y, z, m] = r.pick([[2, 3, 6, 7], [1, 4, 8, 9], [2, 6, 9, 11], [4, 4, 7, 9], [1, 2, 2, 3], [2, 10, 11, 15]]);
        const s = () => r.pick([1, -1]);
        const a = r.shuffle([s() * x, s() * y, s() * z]);
        const sol = `$|\\vec a| = \\sqrt{${a.map((c) => `${par(c)}^2`).join(" + ")}} = \\sqrt{${m * m}} = ${m}$`;
        return task({
          text: L(`What is the magnitude of $\\vec a = ${vt(a)}$?`, `$\\vec a = ${vt(a)}$ का परिमाण क्या है?`),
          answer: num(m),
          hint: L("$|\\vec a| = \\sqrt{a_1^2 + a_2^2 + a_3^2}$.", "परिमाण: $|\\vec a| = \\sqrt{a_1^2 + a_2^2 + a_3^2}$।"),
          solution: L(sol, `परिमाण: ${sol}`),
        });
      }
      // a·b = 0: k, a0, a1, b2 izberemo, b3 = ±1, a2 izračunamo.
      const k = r.int(-3, 3), b2 = r.nonZero(-3, 3), b3 = r.pick([1, -1]);
      const a0 = r.nonZero(-4, 4), a1 = r.int(-4, 4);
      const a = [a0, a1, -(a0 * k + a1 * b2) * b3];
      const rest = a[1] * b2 + a[2] * b3;
      const sol = `$${a[0]}k + ${par(a[1])} \\cdot ${par(b2)} + ${par(a[2])} \\cdot ${par(b3)} = 0 \\Rightarrow ${a[0]}k = ${-rest} \\Rightarrow k = ${k}$`;
      return task({
        text: L(
          `For which value of $k$ are $\\vec a = ${vt(a)}$ and $\\vec b = (k, ${b2}, ${b3})$ perpendicular?`,
          `$k$ के किस मान के लिए $\\vec a = ${vt(a)}$ और $\\vec b = (k, ${b2}, ${b3})$ परस्पर लंबवत हैं?`
        ),
        answer: num(k),
        hint: L("Perpendicular vectors have dot product 0.", "लंबवत सदिशों का अदिश गुणनफल 0 होता है।"),
        solution: L(sol, `अदिश गुणनफल शून्य होना चाहिए: ${sol}`),
      });
    },
  },
  {
    id: "ex-matrices",
    topics: [T("matrices-and-determinants")],
    langs: LANGS,
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const m = () => r.int(-5, 6);
      const DET = (M) => L(`Find the determinant of ${M}.`, `${M} का सारणिक ज्ञात कीजिए।`);
      if (level === 1) {
        const [a, b, c, d] = [m(), m(), m(), m()];
        const sol = `$${a} \\cdot ${par(d)} - ${par(b)} \\cdot ${par(c)} = ${a * d - b * c}$`;
        return task({
          text: DET(`$\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & ${d} \\end{pmatrix}$`),
          answer: num(a * d - b * c),
          hint: L("$\\det = ad - bc$.", "सारणिक: $\\det = ad - bc$।"),
          solution: L(sol, `सारणिक: ${sol}`),
        });
      }
      if (level === 2) {
        const A = [[m(), m(), m()], [m(), m(), m()], [m(), m(), m()]];
        const det = A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
        const ex = `$${A[0][0]}(${A[1][1] * A[2][2] - A[1][2] * A[2][1]}) - ${par(A[0][1])}(${A[1][0] * A[2][2] - A[1][2] * A[2][0]}) + ${par(A[0][2])}(${A[1][0] * A[2][1] - A[1][1] * A[2][0]}) = ${det}$`;
        return task({
          text: DET(`$\\begin{pmatrix} ${A.map((row) => row.join(" & ")).join(" \\\\ ")} \\end{pmatrix}$`),
          answer: num(det),
          hint: L("Expand along the first row (or use Sarrus' rule).", "पहली पंक्ति के अनुदिश प्रसरण कीजिए (या सारस नियम का प्रयोग कीजिए)।"),
          solution: L(`Expanding along the first row:\n${ex}`, `पहली पंक्ति के अनुदिश प्रसरण करने पर:\n${ex}`),
        });
      }
      // ak = bc: b = a·m, k = c·m.
      const a = r.nonZero(-4, 4), c = r.nonZero(-5, 5), mm = r.nonZero(-3, 3);
      const b = a * mm, k = c * mm;
      const M = `$\\begin{pmatrix} ${a} & ${b} \\\\ ${c} & k \\end{pmatrix}$`;
      const sol = `$${a}k - ${par(b)} \\cdot ${par(c)} = 0 \\Rightarrow k = ${k}$`;
      return task({
        text: L(`For which value of $k$ is the matrix ${M} singular (not invertible)?`, `$k$ के किस मान के लिए आव्यूह ${M} अव्युत्क्रमणीय है?`),
        answer: num(k),
        hint: L("A matrix is singular when its determinant is 0.", "जिस आव्यूह का सारणिक 0 हो, वह अव्युत्क्रमणीय होता है।"),
        solution: L(sol, `सारणिक शून्य होना चाहिए: ${sol}`),
      });
    },
  },
  {
    id: "ex-probability",
    topics: [T("probability")],
    langs: LANGS,
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      const FRAC = L(" Write it as a fraction.", " उत्तर भिन्न के रूप में लिखिए।");
      const COMP = L("That is the probability of the complement.", "यह पूरक घटना की प्रायिकता है।");
      const MULT = L("Multiply the probabilities of the two draws, do not add them.", "दोनों बार की प्रायिकताओं को गुणा कीजिए, जोड़िए नहीं।");
      const FAV = L("P = \\dfrac{\\text{favourable}}{\\text{all outcomes}}", "P = \\dfrac{\\text{अनुकूल परिणाम}}{\\text{सभी परिणाम}}");
      if (level === 1) {
        const v = r.int(0, 3);
        if (v === 0) {
          const s = r.int(2, 12);
          const ways = 6 - Math.abs(s - 7);
          const P = `$P = ${frac(ways, 36)} = ${fracTex(ways, 36)}$`;
          return task({
            text: L(
              `Two fair six-sided dice are rolled. What is the probability that the sum is ${s}?`,
              `छह फलकों वाले दो अनभिनत पासे फेंके जाते हैं। अंकों का योग ${s} आने की प्रायिकता क्या है?`
            ) + FRAC,
            answer: fractionM(ways, 36, [
              [1 / 11, L("The 11 possible sums are not equally likely; count ordered pairs out of 36.", "11 संभव योग समसंभाव्य नहीं हैं; 36 में से क्रमित युग्म गिनिए।")],
              [ways / 6, L("There are 36 outcomes for two dice, not 6.", "दो पासों के 6 नहीं, बल्कि 36 परिणाम होते हैं।")],
            ]),
            inputHint: eg(L, "1/6"),
            hint: L("There are 36 equally likely ordered outcomes; count the pairs with this sum.", "36 समसंभाव्य क्रमित परिणाम हैं; इस योग वाले युग्म गिनिए।"),
            formula: FAV,
            solution: L(
              `All outcomes: $6 \\cdot 6 = 36$\nPairs with sum ${s}: ${ways}\n${P}`,
              `सभी परिणाम: $6 \\cdot 6 = 36$\nयोग ${s} वाले युग्म: ${ways}\n${P}`
            ),
          });
        }
        if (v === 1) {
          const ev = [
            [L("a prime number", "एक अभाज्य संख्या"), 3, "2, 3, 5"],
            [L("a multiple of 3", "3 का गुणज"), 2, "3, 6"],
            [L("an even number", "एक सम संख्या"), 3, "2, 4, 6"],
            [L("greater than 4", "4 से बड़ी"), 2, "5, 6"],
            [L("less than 3", "3 से छोटी"), 2, "1, 2"],
            [L("at least 2", "कम से कम 2"), 5, "2, 3, 4, 5, 6"],
            [L("a factor of 6", "6 का गुणनखंड"), 4, "1, 2, 3, 6"],
            [L("a perfect square", "एक पूर्ण वर्ग"), 2, "1, 4"],
          ];
          const [desc, k, list] = r.pick(ev);
          const P = `$P = ${frac(k, 6)} = ${fracTex(k, 6)}$`;
          return task({
            text: L(
              `A fair six-sided die is rolled once. What is the probability that the number shown is ${desc}?`,
              `छह फलकों वाला एक अनभिनत पासा एक बार फेंका जाता है। प्रायिकता क्या है कि प्राप्त संख्या ${desc} हो?`
            ) + FRAC,
            answer: fractionM(k, 6, [[(6 - k) / 6, COMP], [k / 5, L("A die has 6 equally likely faces.", "पासे के 6 समसंभाव्य फलक होते हैं।")]]),
            inputHint: eg(L, "1/3"),
            hint: L("List the faces that satisfy the condition and divide by 6.", "शर्त को संतुष्ट करने वाले फलक गिनिए और 6 से भाग दीजिए।"),
            formula: FAV,
            solution: L(`Favourable faces: ${list} (${k} of them)\n${P}`, `अनुकूल फलक: ${list} (कुल ${k})\n${P}`),
          });
        }
        if (v === 2) {
          const cards = [
            [L("a heart", "पान का पत्ता"), 13, L("13 hearts", "पान के 13 पत्ते"), 4],
            [L("a king", "बादशाह"), 4, L("4 kings", "4 बादशाह"), 13],
            [L("a red king", "लाल बादशाह"), 2, L("2 red kings", "2 लाल बादशाह"), 4],
            [L("a face card (J, Q or K)", "तस्वीर वाला पत्ता (J, Q या K)"), 12, L("12 face cards", "तस्वीर वाले 12 पत्ते"), 4],
            [L("an ace or a king", "इक्का या बादशाह"), 8, L("4 aces + 4 kings", "4 इक्के + 4 बादशाह"), 4],
            [L("a black card", "काले रंग का पत्ता"), 26, L("26 black cards", "काले रंग के 26 पत्ते"), 13],
            [L("a red ace", "लाल इक्का"), 2, L("2 red aces", "2 लाल इक्के"), 4],
            [L("a spade or a heart", "हुकुम या पान का पत्ता"), 26, "13 + 13", 13],
          ];
          const [desc, k, why, alt] = r.pick(cards);
          const P = `$P = ${frac(k, 52)} = ${fracTex(k, 52)}$`;
          return task({
            text: L(
              `A card is drawn at random from a standard deck of 52 cards. What is the probability that it is ${desc}?`,
              `52 पत्तों की ताश की एक गड्डी में से यादृच्छया एक पत्ता निकाला जाता है। प्रायिकता क्या है कि यह ${desc} हो?`
            ) + FRAC,
            answer: fractionM(k, 52, [[alt / 52, L("Recount the cards that satisfy the condition (4 suits × 13 ranks).", "शर्त को संतुष्ट करने वाले पत्ते फिर से गिनिए (4 प्रकार × 13 पत्ते)।")], [(52 - k) / 52, COMP]]),
            inputHint: eg(L, "1/13"),
            hint: L("A deck has 4 suits of 13 cards; count the favourable cards.", "गड्डी में 4 प्रकार (हुकुम, पान, ईंट, चिड़ी) के 13-13 पत्ते होते हैं; अनुकूल पत्ते गिनिए।"),
            formula: L("P = \\dfrac{\\text{favourable}}{52}", "P = \\dfrac{\\text{अनुकूल परिणाम}}{52}"),
            solution: L(`Favourable cards: ${why} = ${k}\n${P}`, `अनुकूल पत्ते: ${why} = ${k}\n${P}`),
          });
        }
        const red = r.int(2, 9), blue = r.int(2, 9), green = r.int(1, 6), n = red + blue + green;
        const P = `$P = ${frac(blue + green, n)} = ${fracTex(blue + green, n)}$`;
        return task({
          text: L(
            `A bag contains ${red} red, ${blue} blue and ${green} green marbles. One marble is drawn at random. What is the probability that it is not red?`,
            `एक थैले में ${red} लाल, ${blue} नीले और ${green} हरे कंचे हैं। यादृच्छया एक कंचा निकाला जाता है। इसके लाल न होने की प्रायिकता क्या है?`
          ) + FRAC,
          answer: fractionM(blue + green, n, [
            [red / n, L("That is the probability that it IS red.", "यह कंचे के लाल होने की प्रायिकता है।")],
            [blue / n, L("\"Not red\" includes the green marbles too.", "\"लाल नहीं\" में हरे कंचे भी शामिल हैं।")],
          ]),
          inputHint: eg(L, "2/5"),
          data: { given: [`r = ${red}`, `b = ${blue}`, `g = ${green}`], find: ["P(\\text{not red})"] },
          hint: L("Count the marbles that are not red, or use $1 - P(\\text{red})$.", "लाल न होने वाले कंचे गिनिए, या $1 - P(\\text{लाल})$ का प्रयोग कीजिए।"),
          formula: L("P(\\text{not } A) = 1 - P(A)", "P(\\text{न } A) = 1 - P(A)"),
          solution: L(
            `Total: $${red} + ${blue} + ${green} = ${n}$\nNot red: $${blue + green}$\n${P}`,
            `कुल: $${red} + ${blue} + ${green} = ${n}$\nलाल नहीं: $${blue + green}$\n${P}`
          ),
        });
      }
      if (level === 2) {
        const v = r.int(0, 4);
        const red = r.int(3, 8), blue = r.int(2, 7), n = red + blue;
        const bag = { given: [`r = ${red}`, `b = ${blue}`], find: ["P"] };
        const BAG = L(`A bag contains ${red} red and ${blue} blue balls.`, `एक थैले में ${red} लाल और ${blue} नीली गेंदें हैं।`);
        if (v === 0) {
          const P = `$P = ${frac(red, n)} \\cdot ${frac(red - 1, n - 1)} = ${fracTex(red * (red - 1), n * (n - 1))}$`;
          return task({
            text: BAG + L(
              " Two balls are drawn without replacement. What is the probability that both are red?",
              " बिना प्रतिस्थापन के दो गेंदें निकाली जाती हैं। दोनों गेंदों के लाल होने की प्रायिकता क्या है?"
            ) + FRAC,
            answer: fractionM(red * (red - 1), n * (n - 1), [
              [(red * red) / (n * n), L("Without replacement the second draw has one red ball and one ball fewer.", "बिना प्रतिस्थापन के दूसरी बार एक लाल गेंद कम होती है और कुल गेंदें भी एक कम होती हैं।")],
              [(2 * red) / n, MULT],
            ]),
            inputHint: eg(L, "2/7"),
            data: bag,
            hint: L(
              "Multiply the probability for the first draw by the probability for the second draw (one red ball fewer).",
              "पहली बार की प्रायिकता को दूसरी बार की प्रायिकता (एक लाल गेंद कम) से गुणा कीजिए।"
            ),
            formula: "P(A \\cap B) = P(A)\\,P(B \\mid A)",
            solution: L(
              `First red: $${frac(red, n)}$\nSecond red (given the first): $${frac(red - 1, n - 1)}$\n${P}`,
              `पहली गेंद लाल: $${frac(red, n)}$\nदूसरी गेंद लाल (पहली लाल होने पर): $${frac(red - 1, n - 1)}$\n${P}`
            ),
          });
        }
        if (v === 1) {
          const P = `$P = ${frac(blue, n)} \\cdot ${frac(blue, n)} = ${fracTex(blue * blue, n * n)}$`;
          return task({
            text: BAG + L(
              " A ball is drawn, put back, and a second ball is drawn. What is the probability that both are blue?",
              " एक गेंद निकालकर वापस रख दी जाती है, फिर दूसरी गेंद निकाली जाती है। दोनों गेंदों के नीली होने की प्रायिकता क्या है?"
            ) + FRAC,
            answer: fractionM(blue * blue, n * n, [
              [(blue * (blue - 1)) / (n * (n - 1)), L("The ball is put back, so the second draw has the same probabilities.", "गेंद वापस रख दी जाती है, इसलिए दूसरी बार भी प्रायिकताएँ वही रहती हैं।")],
              [(2 * blue) / n, MULT],
            ]),
            inputHint: eg(L, "4/25"),
            data: bag,
            hint: L("With replacement the two draws are independent.", "प्रतिस्थापन के साथ दोनों बार गेंद निकालना स्वतंत्र घटनाएँ हैं।"),
            formula: "P(A \\cap B) = P(A)\\,P(B)",
            solution: L(`Each draw: $P(\\text{blue}) = ${frac(blue, n)}$\n${P}`, `हर बार: $P(\\text{नीली}) = ${frac(blue, n)}$\n${P}`),
          });
        }
        if (v === 2) {
          const rb = `$P(RB) = ${frac(red, n)} \\cdot ${frac(blue, n - 1)} = ${frac(red * blue, n * (n - 1))}$`;
          const br = `$P(BR) = ${frac(blue, n)} \\cdot ${frac(red, n - 1)} = ${frac(red * blue, n * (n - 1))}$`;
          const P = `$P = ${fracTex(2 * red * blue, n * (n - 1))}$`;
          return task({
            text: BAG + L(
              " Two balls are drawn without replacement. What is the probability that they have different colours?",
              " बिना प्रतिस्थापन के दो गेंदें निकाली जाती हैं। दोनों गेंदों के रंग अलग-अलग होने की प्रायिकता क्या है?"
            ) + FRAC,
            answer: fractionM(2 * red * blue, n * (n - 1), [
              [(red * blue) / (n * (n - 1)), L("Red-then-blue and blue-then-red are both possible: multiply by 2.", "पहले लाल फिर नीली और पहले नीली फिर लाल, दोनों संभव हैं: 2 से गुणा कीजिए।")],
              [(2 * red * blue) / (n * n), L("Without replacement the second draw is out of one ball fewer.", "बिना प्रतिस्थापन के दूसरी बार कुल गेंदें एक कम होती हैं।")],
            ]),
            inputHint: eg(L, "3/5"),
            data: bag,
            hint: L("Add the probabilities of red-then-blue and blue-then-red.", "पहले लाल फिर नीली और पहले नीली फिर लाल की प्रायिकताएँ जोड़िए।"),
            formula: "P = P(RB) + P(BR)",
            solution: L(`${rb}\n${br}\n${P}`, `पहले लाल, फिर नीली: ${rb}\nपहले नीली, फिर लाल: ${br}\nकुल: ${P}`),
          });
        }
        if (v === 3) {
          const m = r.int(3, 6), k = r.int(1, m - 1);
          const all = `$2^{${m}} = ${2 ** m}$`, kk = `$\\binom{${m}}{${k}} = ${nCr(m, k)}$`;
          const P = `$P = ${frac(nCr(m, k), 2 ** m)} = ${fracTex(nCr(m, k), 2 ** m)}$`;
          return task({
            text: L(
              `A fair coin is tossed ${m} times. What is the probability of getting exactly ${k} head${k === 1 ? "" : "s"}?`,
              `एक अनभिनत सिक्के को ${m} बार उछाला जाता है। ठीक ${k} बार चित आने की प्रायिकता क्या है?`
            ) + FRAC,
            answer: fractionM(nCr(m, k), 2 ** m, [
              [1 / 2 ** m, L(`That is one particular order; there are $\\binom{${m}}{${k}}$ orders.`, `यह केवल एक विशेष क्रम की प्रायिकता है; कुल $\\binom{${m}}{${k}}$ क्रम संभव हैं।`)],
              [k / m, L("Count outcomes: there are $2^n$ equally likely sequences.", "परिणाम गिनिए: कुल $2^n$ समसंभाव्य अनुक्रम होते हैं।")],
            ]),
            inputHint: eg(L, "3/8"),
            data: { given: [`n = ${m}`, `k = ${k}`], find: ["P"] },
            hint: L(
              "Count the sequences with exactly that many heads and divide by the number of all sequences.",
              "ठीक उतनी बार चित वाले अनुक्रम गिनिए और सभी अनुक्रमों की संख्या से भाग दीजिए।"
            ),
            formula: "P = \\dfrac{\\binom{n}{k}}{2^n}",
            solution: L(
              `All sequences: ${all}\nWith exactly ${k} heads: ${kk}\n${P}`,
              `सभी अनुक्रम: ${all}\nठीक ${k} बार चित वाले: ${kk}\n${P}`
            ),
          });
        }
        const pa = r.int(3, 7) / 10, pb = r.int(2, 6) / 10, pab = r.int(1, Math.round(Math.min(pa, pb) * 10) - 1) / 10;
        const u = pa + pb - pab;
        const sol = `$P(A \\cup B) = ${en(pa)} + ${en(pb)} - ${en(pab)}$\n$= ${en(Math.round(u * 100) / 100)}$`;
        return task({
          text: L(
            `For two events, $P(A) = ${en(pa)}$, $P(B) = ${en(pb)}$ and $P(A \\cap B) = ${en(pab)}$. What is $P(A \\cup B)$?`,
            `दो घटनाओं के लिए $P(A) = ${en(pa)}$, $P(B) = ${en(pb)}$ और $P(A \\cap B) = ${en(pab)}$ है। $P(A \\cup B)$ का मान क्या है?`
          ),
          answer: numM(Math.round(u * 100) / 100, null, [
            [pa + pb, L("Subtract $P(A \\cap B)$; otherwise the overlap is counted twice.", "$P(A \\cap B)$ घटाइए; नहीं तो उभयनिष्ठ भाग दो बार गिना जाता है।")],
            [pa * pb, L("That is $P(A \\cap B)$ for independent events, not the union.", "यह स्वतंत्र घटनाओं के लिए $P(A \\cap B)$ है, सम्मिलन नहीं।")],
            [1 - u, L("That is the probability that neither happens.", "यह इसकी प्रायिकता है कि दोनों में से कोई भी घटना न घटे।")],
          ]),
          data: { given: [dq("P(A)", pa), dq("P(B)", pb), dq("P(A \\cap B)", pab)], find: ["P(A \\cup B)"] },
          hint: L("Add the two probabilities and remove the overlap once.", "दोनों प्रायिकताएँ जोड़िए और उभयनिष्ठ भाग को एक बार घटाइए।"),
          formula: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)",
          solution: L(sol, `योग नियम से: ${sol}`),
        });
      }
      const v = r.int(0, 4);
      if (v === 0) {
        const k = r.int(2, 4);
        const P = `$P = 1 - ${frac(5 ** k, 6 ** k)} = ${fracTex(6 ** k - 5 ** k, 6 ** k)}$`;
        const none = `\\left(\\tfrac56\\right)^{${k}} = ${frac(5 ** k, 6 ** k)}`;
        return task({
          text: L(
            `A fair die is rolled ${k} times. What is the probability of getting at least one six?`,
            `एक अनभिनत पासे को ${k} बार फेंका जाता है। कम से कम एक बार छह आने की प्रायिकता क्या है?`
          ) + FRAC,
          answer: fractionM(6 ** k - 5 ** k, 6 ** k, [
            [k / 6, L("Adding $\\tfrac16$ for each roll counts outcomes with several sixes more than once.", "हर बार के लिए $\\tfrac16$ जोड़ने से कई छह वाले परिणाम एक से अधिक बार गिने जाते हैं।")],
            [1 / 6 ** k, L("That is the probability that every roll is a six.", "यह हर बार छह आने की प्रायिकता है।")],
            [5 ** k / 6 ** k, L("That is the probability of no six; subtract it from 1.", "यह एक भी बार छह न आने की प्रायिकता है; इसे 1 में से घटाइए।")],
          ]),
          inputHint: eg(L, "11/36"),
          data: { given: [`n = ${k}`], find: ["P(\\text{at least one six})"] },
          hint: L("Use the complement: $1 - P(\\text{no six})$.", "पूरक घटना का प्रयोग कीजिए: $1 - P(\\text{एक भी छह नहीं})$।"),
          formula: L("P(\\text{at least one}) = 1 - P(\\text{none})", "P(\\text{कम से कम एक}) = 1 - P(\\text{एक भी नहीं})"),
          solution: L(`$P(\\text{no six}) = ${none}$\n${P}`, `एक भी बार छह न आने की प्रायिकता: $${none}$\n${P}`),
        });
      }
      if (v === 1) {
        const p = r.pick([0.01, 0.02, 0.05, 0.1]), s = r.pick([0.9, 0.95, 0.99]), f = r.pick([0.02, 0.05, 0.1]);
        const post = (p * s) / (p * s + (1 - p) * f);
        const l1 = `$${en(p)} \\cdot ${en(s)} = ${en(p * s, 5)}$`, l2 = `$${en(1 - p)} \\cdot ${en(f)} = ${en((1 - p) * f, 5)}$`;
        const l3 = `$P(D \\mid +) = \\dfrac{${en(p * s, 5)}}{${en(p * s + (1 - p) * f, 5)}} \\approx ${en(post, 3)}$`;
        return task({
          text: L(
            `A disease affects ${en(p * 100)}% of a population. A test detects it in ${en(s * 100)}% of people who have it, but also gives a positive result for ${en(f * 100)}% of healthy people. A person tests positive. What is the probability that they have the disease?`,
            `एक रोग किसी जनसंख्या के ${en(p * 100)}% लोगों को होता है। एक परीक्षण ${en(s * 100)}% रोगियों में रोग का पता लगा लेता है, परंतु ${en(f * 100)}% स्वस्थ लोगों के लिए भी धनात्मक परिणाम देता है। एक व्यक्ति का परीक्षण धनात्मक आता है। उस व्यक्ति के रोगी होने की प्रायिकता क्या है?`
          ) + roundToL(3, lang),
          answer: numM(post, 3, [
            [s, L("That is $P(+\\mid D)$; you need $P(D \\mid +)$, which depends on how rare the disease is.", "यह $P(+\\mid D)$ है; आपको $P(D \\mid +)$ चाहिए, जो इस पर भी निर्भर करती है कि रोग कितना दुर्लभ है।")],
            [p * s, L("That is $P(D \\cap +)$; divide it by the total probability of a positive test.", "यह $P(D \\cap +)$ है; इसे धनात्मक परीक्षण की कुल प्रायिकता से भाग दीजिए।")],
            [1 - f, L("That is the probability that a healthy person tests negative.", "यह किसी स्वस्थ व्यक्ति का परीक्षण ऋणात्मक आने की प्रायिकता है।")],
          ]),
          data: { given: [`P(D) = ${en(p * 100)}\\%`, `P(+ \\mid D) = ${en(s * 100)}\\%`, `P(+ \\mid \\text{healthy}) = ${en(f * 100)}\\%`], find: ["P(D \\mid +)"] },
          hint: L(
            "Find the probability of a positive test from both groups (ill and healthy), then use Bayes' theorem.",
            "दोनों समूहों (रोगी और स्वस्थ) से धनात्मक परीक्षण की प्रायिकता ज्ञात कीजिए, फिर बेज़-प्रमेय का प्रयोग कीजिए।"
          ),
          formula: "P(D \\mid +) = \\dfrac{P(D)P(+ \\mid D)}{P(D)P(+ \\mid D) + P(\\bar D)P(+ \\mid \\bar D)}",
          solution: L(
            `Ill and positive: ${l1}\nHealthy and positive: ${l2}\n${l3}`,
            `रोगी और धनात्मक: ${l1}\nस्वस्थ और धनात्मक: ${l2}\n${l3}`
          ),
        });
      }
      if (v === 2) {
        const m = r.int(4, 8), k = r.int(1, m - 1), p = r.pick([0.2, 0.3, 0.4, 0.6, 0.7]);
        const P = nCr(m, k) * p ** k * (1 - p) ** (m - k);
        const sol = `$\\binom{${m}}{${k}} = ${nCr(m, k)}$\n$P = ${nCr(m, k)} \\cdot ${en(p)}^{${k}} \\cdot ${en(1 - p)}^{${m - k}}$\n$\\approx ${en(P, 4)}$`;
        return task({
          text: L(
            `A basketball player scores a free throw with probability ${en(p)}, independently each time. She takes ${m} free throws. What is the probability that she scores exactly ${k}?`,
            `एक बास्केटबॉल खिलाड़ी हर फ्री थ्रो ${en(p)} प्रायिकता से सफल करती है, और हर प्रयास स्वतंत्र है। वह ${m} फ्री थ्रो लेती है। उसके ठीक ${k} थ्रो सफल होने की प्रायिकता क्या है?`
          ) + roundToL(4, lang),
          answer: numM(P, 4, [
            [p ** k * (1 - p) ** (m - k), L(`That is one particular order of hits and misses; multiply by $\\binom{${m}}{${k}}$.`, `यह सफल और असफल प्रयासों का केवल एक विशेष क्रम है; $\\binom{${m}}{${k}}$ से गुणा कीजिए।`)],
            [nCr(m, k) * p ** k, L("Include the probability of the misses, $(1-p)^{n-k}$.", "असफल प्रयासों की प्रायिकता $(1-p)^{n-k}$ भी शामिल कीजिए।")],
          ]),
          data: { given: [`n = ${m}`, `k = ${k}`, dq("p", p)], find: ["P"] },
          hint: L(
            "This is a binomial distribution: choose which throws are hits, then multiply the probabilities.",
            "यह द्विपद बंटन है: चुनिए कि कौन-से प्रयास सफल हैं, फिर प्रायिकताओं को गुणा कीजिए।"
          ),
          formula: "P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}",
          solution: L(sol, `द्विपद बंटन से: ${sol}`),
        });
      }
      if (v === 3) {
        const cost = r.pick([2, 3, 5]), W = r.pick([10, 20, 25, 50]), a = r.int(1, 3), b = r.pick([6, 8, 10, 12]);
        const E = (W * a) / b - cost;
        const l1 = `$${W} \\cdot ${fracTex(a, b)} = ${en((W * a) / b, 2)}$`, l2 = `$E = ${en((W * a) / b, 2)} - ${cost} = ${en(E, 2)}$`;
        return task({
          text: L(
            `A game costs ${cost} dollars to play. You win a prize of ${W} dollars with probability ${a}/${b}, otherwise nothing. What is your expected gain per game, in dollars? (A loss is negative.)`,
            `एक खेल खेलने का शुल्क ${cost} डॉलर है। ${a}/${b} प्रायिकता से आप ${W} डॉलर का पुरस्कार जीतते हैं, अन्यथा कुछ नहीं। प्रति खेल आपका प्रत्याशित लाभ कितने डॉलर है? (हानि को ऋणात्मक संख्या से लिखिए।)`
          ) + roundToL(2, lang),
          answer: numM(E, 2, [
            [(W * a) / b, L("Subtract the cost of playing.", "खेलने का शुल्क घटाइए।")],
            [((W - cost) * a) / b, L("You pay the cost every game, not only when you win.", "शुल्क हर खेल में देना पड़ता है, केवल जीतने पर नहीं।")],
            [-E, L("Check the sign: gain = expected winnings − cost.", "चिह्न जाँचिए: लाभ = प्रत्याशित जीत − शुल्क।")],
          ]),
          data: { given: [dq("c", cost), dq("W", W), `P = ${a}/${b}`], find: ["E"] },
          hint: L("Expected winnings = prize × probability; then subtract what you pay.", "प्रत्याशित जीत = पुरस्कार × प्रायिकता; फिर इसमें से दिया गया शुल्क घटाइए।"),
          formula: "E = W \\cdot P - c",
          solution: L(`Expected winnings: ${l1}\n${l2}`, `प्रत्याशित जीत: ${l1}\n${l2}`),
        });
      }
      const gg = r.int(3, 9), gn = r.int(5, 12), bg = r.int(2, 8), bn = r.int(5, 12);
      const girls = gg + gn, total = girls + bg + bn;
      const P = `$P = ${frac(gg, girls)} = ${fracTex(gg, girls)}$`;
      return task({
        text: L(
          `In a class, ${gg} girls and ${bg} boys wear glasses, while ${gn} girls and ${bn} boys do not. A student is chosen at random and turns out to be a girl. What is the probability that she wears glasses?`,
          `एक कक्षा में ${gg} लड़कियाँ और ${bg} लड़के चश्मा पहनते हैं, जबकि ${gn} लड़कियाँ और ${bn} लड़के चश्मा नहीं पहनते। यादृच्छया एक विद्यार्थी चुना जाता है और वह लड़की है। उसके चश्मा पहनने की प्रायिकता क्या है?`
        ) + FRAC,
        answer: fractionM(gg, girls, [
          [gg / total, L("That is $P(\\text{girl and glasses})$; the condition restricts you to the girls.", "यह $P(\\text{लड़की और चश्मा})$ है; शर्त के कारण केवल लड़कियों को ही गिनना है।")],
          [gg / (gg + bg), L("That is $P(\\text{girl} \\mid \\text{glasses})$, the reverse condition.", "यह $P(\\text{लड़की} \\mid \\text{चश्मा})$ है, यानी उलटी शर्त।")],
        ]),
        inputHint: eg(L, "3/8"),
        data: { given: [`\\text{girls with glasses} = ${gg}`, `\\text{girls without} = ${gn}`, `\\text{boys with glasses} = ${bg}`, `\\text{boys without} = ${bn}`], find: ["P(\\text{glasses} \\mid \\text{girl})"] },
        hint: L(
          "Given that the student is a girl, only the girls count as possible outcomes.",
          "दिया है कि चुनी गई विद्यार्थी लड़की है, इसलिए केवल लड़कियाँ ही संभव परिणाम हैं।"
        ),
        formula: "P(A \\mid B) = \\dfrac{n(A \\cap B)}{n(B)}",
        solution: L(
          `Girls: $${gg} + ${gn} = ${girls}$\nGirls with glasses: $${gg}$\n${P}`,
          `लड़कियाँ: $${gg} + ${gn} = ${girls}$\nचश्मा पहनने वाली लड़कियाँ: $${gg}$\n${P}`
        ),
      });
    },
  },
  {
    id: "ex-binomial",
    topics: [T("binomial-distribution")],
    langs: LANGS,
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      if (level === 1) {
        const n = r.int(3, 6), k = r.int(1, n - 1);
        const h = "$P(X = k) = \\binom{n}{k} \\left(\\tfrac12\\right)^n$";
        const sol = `$P(X = ${k}) = \\binom{${n}}{${k}} \\cdot \\dfrac{1}{${2 ** n}} = ${fracTex(nCr(n, k), 2 ** n)}$`;
        return task({
          text: L(
            `A fair coin is tossed ${n} times. What is the probability of getting exactly ${k} heads? Write it as a fraction.`,
            `एक अनभिनत सिक्के को ${n} बार उछाला जाता है। ठीक ${k} बार चित आने की प्रायिकता क्या है? उत्तर भिन्न के रूप में लिखिए।`
          ),
          answer: fraction(nCr(n, k), 2 ** n),
          inputHint: eg(L, "3/8"),
          hint: L(h, `द्विपद बंटन: ${h}`),
          solution: L(sol, `द्विपद बंटन से: ${sol}`),
        });
      }
      const BIN = "$P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}$";
      if (level === 2) {
        const n = r.int(5, 12), p = r.pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.6, 0.7]), k = Math.max(1, Math.min(n - 1, Math.round(n * p) + r.int(-1, 1)));
        const P = nCr(n, k) * p ** k * (1 - p) ** (n - k);
        const sol = `$P(X = ${k}) = \\binom{${n}}{${k}} \\cdot ${en(p)}^{${k}} \\cdot ${en(1 - p)}^{${n - k}} \\approx ${en(P, 3)}$`;
        return task({
          text: L(`$X \\sim B(${n}, ${en(p)})$. Find $P(X = ${k})$.`, `$X \\sim B(${n}, ${en(p)})$ है। $P(X = ${k})$ ज्ञात कीजिए।`) + roundToL(3, lang),
          answer: num(P, 3),
          hint: L(BIN, `द्विपद बंटन: ${BIN}`),
          formula: "P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}",
          solution: L(sol, `द्विपद बंटन से: ${sol}`),
        });
      }
      const n = r.int(8, 20), p = r.pick([0.05, 0.1, 0.15, 0.2]);
      if (r.next() < 0.5) {
        const P = (1 - p) ** n + n * p * (1 - p) ** (n - 1);
        const h = "$P(X \\le 1) = P(X = 0) + P(X = 1)$";
        const sol = `$P(X \\le 1) = ${en(1 - p)}^{${n}} + ${n} \\cdot ${en(p)} \\cdot ${en(1 - p)}^{${n - 1}} \\approx ${en(P, 3)}$`;
        return task({
          text: L(
            `In a factory ${en(p * 100)}% of items are faulty. A sample of ${n} items is taken. Find the probability that at most one item is faulty.`,
            `एक कारखाने में ${en(p * 100)}% वस्तुएँ त्रुटिपूर्ण होती हैं। ${n} वस्तुओं का एक नमूना लिया जाता है। अधिक से अधिक एक वस्तु के त्रुटिपूर्ण होने की प्रायिकता ज्ञात कीजिए।`
          ) + roundToL(3, lang),
          answer: num(P, 3),
          hint: L(h, `अधिक से अधिक एक: ${h}`),
          solution: L(sol, `द्विपद बंटन से: ${sol}`),
        });
      }
      const V = n * p * (1 - p);
      const h = "$\\operatorname{Var}(X) = np(1-p)$";
      const sol = `$\\operatorname{Var}(X) = ${n} \\cdot ${en(p)} \\cdot ${en(1 - p)} = ${en(V, 2)}$`;
      return task({
        text: L(`$X \\sim B(${n}, ${en(p)})$. Find the variance $\\operatorname{Var}(X)$.`, `$X \\sim B(${n}, ${en(p)})$ है। प्रसरण $\\operatorname{Var}(X)$ ज्ञात कीजिए।`) + roundToL(2, lang),
        answer: num(V, 2),
        hint: L(h, `द्विपद बंटन का प्रसरण: ${h}`),
        solution: L(sol, `प्रसरण: ${sol}`),
      });
    },
  },
  {
    id: "ex-percent-ratio",
    topics: [T("ratios-rates-and-percentages")],
    langs: LANGS,
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      if (level === 1) {
        const p = r.pick([12, 15, 20, 25, 35, 40, 65]), base = r.pick([80, 120, 240, 360, 500]);
        const sol = `$${base} \\cdot ${en(p / 100)} = ${en((p * base) / 100)}$`;
        return task({
          text: L(`What is ${p}% of ${base}?`, `${base} का ${p}% कितना है?`),
          answer: num((p * base) / 100),
          hint: L("Multiply by $\\dfrac{p}{100}$.", "$\\dfrac{p}{100}$ से गुणा कीजिए।"),
          solution: L(sol, `गुणा करने पर: ${sol}`),
        });
      }
      if (level === 2) {
        const old = r.pick([40, 50, 80, 120, 250]), ch = r.pick([-30, -20, -15, 10, 25, 40]);
        const nw = old * (1 + ch / 100);
        const sol = `$\\dfrac{${en(nw)} - ${old}}{${old}} \\cdot 100 = ${ch}\\%$`;
        return task({
          text: L(
            `The price of a jacket changed from ${old} dollars to ${en(nw)} dollars. By what percent did the price change? (Use a negative number for a decrease.)`,
            `एक जैकेट का मूल्य ${old} डॉलर से बदलकर ${en(nw)} डॉलर हो गया। मूल्य में कितने प्रतिशत परिवर्तन हुआ? (कमी के लिए ऋणात्मक संख्या लिखिए।)`
          ),
          answer: num(ch),
          hint: L(
            "percent change $= \\dfrac{\\text{new} - \\text{old}}{\\text{old}} \\cdot 100$.",
            "प्रतिशत परिवर्तन $= \\dfrac{\\text{नया} - \\text{पुराना}}{\\text{पुराना}} \\cdot 100$।"
          ),
          solution: L(sol, `प्रतिशत परिवर्तन: ${sol}`),
        });
      }
      const a = r.int(2, 5), b = r.int(1, 4), c = r.int(1, 3), unit = r.int(4, 15);
      const total = (a + b + c) * unit;
      return task({
        text: L(
          `${total} dollars are shared among three people in the ratio $${a} : ${b} : ${c}$. How many dollars does the first person get?`,
          `${total} डॉलर तीन व्यक्तियों में $${a} : ${b} : ${c}$ के अनुपात में बाँटे जाते हैं। पहले व्यक्ति को कितने डॉलर मिलते हैं?`
        ),
        answer: num(a * unit),
        hint: L("Find the value of one part first.", "पहले एक भाग का मान ज्ञात कीजिए।"),
        solution: L(
          `Parts: $${a} + ${b} + ${c} = ${a + b + c}$; one part $= ${total} / ${a + b + c} = ${unit}$.\nFirst person: $${a} \\cdot ${unit} = ${a * unit}$`,
          `कुल भाग: $${a} + ${b} + ${c} = ${a + b + c}$; एक भाग $= ${total} / ${a + b + c} = ${unit}$।\nपहला व्यक्ति: $${a} \\cdot ${unit} = ${a * unit}$`
        ),
      });
    },
  },
  {
    id: "ex-circles",
    topics: [T("circles")],
    langs: LANGS,
    gen(level, r, _topic, lang) {
      const L = bi(lang);
      if (level === 1) {
        const rad = r.int(2, 12);
        const sol = `$A = \\pi \\cdot ${rad}^2 \\approx ${en(Math.PI * rad * rad, 1)}\\ \\text{cm}^2$`;
        return task({
          text: L(`What is the area of a circle with radius ${rad} cm, in cm²?`, `${rad} cm त्रिज्या वाले वृत्त का क्षेत्रफल कितने cm² है?`) + roundToL(1, lang),
          answer: num(Math.PI * rad * rad, 1),
          hint: L("$A = \\pi r^2$.", "सूत्र: $A = \\pi r^2$।"),
          formula: "A = \\pi r^2",
          solution: L(sol, `क्षेत्रफल: ${sol}`),
        });
      }
      if (level === 2) {
        const h = r.int(-5, 5), k = r.int(-5, 5), rad = r.int(2, 8);
        const D = -2 * h, E = -2 * k, F = h * h + k * k - rad * rad;
        const eq = `${poly([[1, "x^2"], [1, "y^2"], [D, "x"], [E, "y"], [F, ""]])} = 0`;
        const l = `$${factor(h)}^2 + ${factor(k, "y")}^2 = ${h * h} + ${k * k} - ${par(F)} = ${rad * rad}$`;
        return task({
          text: L(`The equation of a circle is $${eq}$. What is its radius?`, `एक वृत्त का समीकरण $${eq}$ है। इसकी त्रिज्या क्या है?`),
          answer: num(rad),
          hint: L("Complete the square in $x$ and in $y$.", "$x$ और $y$ दोनों में पूर्ण वर्ग बनाइए।"),
          formula: "(x - p)^2 + (y - q)^2 = r^2",
          solution: L(`${l}, so $r = ${rad}$.`, `पूर्ण वर्ग बनाने पर: ${l}, अतः $r = ${rad}$।`),
        });
      }
      const rad = r.int(3, 12), ang = r.pick([30, 45, 60, 72, 90, 120, 150]);
      const A = (ang / 360) * Math.PI * rad * rad;
      const sol = `$A = \\dfrac{${ang}}{360} \\cdot \\pi \\cdot ${rad}^2 \\approx ${en(A, 1)}\\ \\text{cm}^2$`;
      return task({
        text: L(
          `A sector of a circle with radius ${rad} cm has a central angle of ${ang}°. What is the area of the sector, in cm²?`,
          `${rad} cm त्रिज्या वाले एक वृत्त के त्रिज्यखंड का केंद्रीय कोण ${ang}° है। त्रिज्यखंड का क्षेत्रफल कितने cm² है?`
        ) + roundToL(1, lang),
        answer: num(A, 1),
        hint: L("Sector area $= \\dfrac{\\theta}{360^\\circ} \\pi r^2$.", "त्रिज्यखंड का क्षेत्रफल $= \\dfrac{\\theta}{360^\\circ} \\pi r^2$।"),
        formula: "A = \\dfrac{\\theta}{360^\\circ}\\pi r^2",
        solution: L(sol, `क्षेत्रफल: ${sol}`),
      });
    },
  },
];

// Pomožno: izbirna naloga z že pripravljenimi možnostmi (za generatorje, ki jo potrebujejo).
export const examChoice = (r, correct, distractors) => ({ type: "choice", ...choices(r, correct, distractors) });
