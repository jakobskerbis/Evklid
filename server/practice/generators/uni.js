// Generatorji nalog za fakultetne predmete (1. stopnja).
// Teme so določene po naslovu (glej server/university-data.js), zato isti
// generator velja za vse predmete in fakultete, ki imajo to temo.
import { roundHalfUp } from "../check.js";
import { tx } from "./mat.js";
import { uniTopicIds } from "../../curriculum.js";

const G = 9.81;
const R = 8.314;
const H = 6.626e-34;
const C = 2.998e8;
const E = 1.602e-19;
const ME = 9.109e-31;
const KE = 8.988e9;
const EPS0 = 8.854e-12;

const num = (value, unit, decimals = 2, extra = {}) => ({ type: "number", value, ...(unit ? { unit } : {}), decimals, ...extra });
const r2 = (x, d) => tx(roundHalfUp(x, d), d);
const DEG = Math.PI / 180;
// Koeficient v polinomu: "+ 3x", "- x", ...
const term = (c, v, first = false) => {
  if (c === 0) return "";
  const sign = c < 0 ? "-" : first ? "" : "+";
  const a = Math.abs(c);
  return `${sign} ${a === 1 && v ? "" : a}${v}`.trim() + " ";
};
// Koeficient pred spremenljivko: 1 → "", -1 → "-" (ne »1\sin x« ali »-1e^x«).
const cf = (c) => (c === 1 ? "" : c === -1 ? "-" : tx(c));
const poly = (cs, vars) => cs.map((c, i) => term(c, vars[i], cs.slice(0, i).every((x) => x === 0))).join("").trim() || "0";
const decWord = (d) => (d === 0 ? "na celo število" : d === 1 ? "na eno decimalko" : d === 2 ? "na dve decimalki" : `na ${d} decimalke`);
const MU = ["umol/L", "µmol/L", "μmol/L", "umol/l", "µmol/l", "μmol/l"];

export const UNI_GENERATORS = [
  // ------------------------------------------------------------ matematika
  {
    id: "uni-odvod",
    topics: uniTopicIds("Odvod funkcije"),
    gen(level, r) {
      if (level === 1) {
        const [a, b, c] = [r.nonZero(-4, 4), r.int(-6, 6), r.int(-9, 9)];
        const x0 = r.nonZero(-3, 3);
        const v = 3 * a * x0 ** 2 + 2 * b * x0 + c;
        return {
          text: `Dana je funkcija $f(x) = ${poly([a, b, c, r.int(-5, 5)], ["x^3", "x^2", "x", ""])}$. Izračunaj $f'(${x0})$.`,
          answer: num(v, null, 0),
          hint: "Odvajaj člen za členom: $(x^n)' = n x^{n-1}$, nato vstavi $x_0$.",
          solution: `$f'(x) = ${poly([3 * a, 2 * b, c], ["x^2", "x", ""])}$, zato $f'(${x0}) = ${v}$.`,
        };
      }
      if (level === 2) {
        const a = r.nonZero(-3, 3), k = r.pick([0.5, 1, 1.5, 2, -1]), b = r.nonZero(-4, 4);
        const v = a * k * Math.exp(k) + b;
        return {
          text: `Izračunaj odvod funkcije $f(x) = ${cf(a)}\\,e^{${cf(k)}x} ${b < 0 ? "-" : "+"} ${cf(Math.abs(b))}\\ln x$ v točki $x = 1$. Zaokroži ${decWord(3)}.`,
          answer: num(v, null, 3),
          hint: "$(e^{kx})' = k e^{kx}$ in $(\\ln x)' = \\dfrac{1}{x}$.",
          solution: `$f'(x) = ${cf(a * k)}\\,e^{${cf(k)}x} ${b < 0 ? "-" : "+"} \\dfrac{${Math.abs(b)}}{x}$, $f'(1) \\approx ${r2(v, 3)}$`,
        };
      }
      let a, b, c, d;
      do [a, b, c, d] = [r.nonZero(-5, 5), r.int(-5, 5), r.nonZero(-3, 3), r.nonZero(-5, 5)];
      while (a * d - b * c === 0);
      let x0 = r.int(-2, 3);
      if (c * x0 + d === 0) x0 += 1;
      const v = (a * d - b * c) / (c * x0 + d) ** 2;
      return {
        text: `Dana je $f(x) = \\dfrac{${poly([a, b], ["x", ""])}}{${poly([c, d], ["x", ""])}}$. Izračunaj $f'(${x0})$ in zaokroži ${decWord(3)}.`,
        answer: num(v, null, 3),
        hint: "Pravilo za odvod kvocienta: $\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^2}$.",
        solution: `$f'(x) = \\dfrac{${a * d - b * c}}{(${poly([c, d], ["x", ""])})^2}$, $f'(${x0}) \\approx ${r2(v, 3)}$`,
      };
    },
  },
  {
    id: "uni-integral",
    topics: uniTopicIds("Določeni integral"),
    gen(level, r) {
      if (level === 1) {
        const [a, b, c] = [r.nonZero(-3, 3), r.int(-4, 4), r.int(-5, 5)];
        const p = r.int(-2, 1), q = p + r.int(1, 3);
        const F = (x) => (a * x ** 3) / 3 + (b * x ** 2) / 2 + c * x;
        const v = F(q) - F(p);
        if (Math.abs(v) < 0.01) return null;
        return {
          text: `Izračunaj $\\displaystyle\\int_{${p}}^{${q}} \\left(${poly([a, b, c], ["x^2", "x", ""])}\\right)dx$. Zaokroži ${decWord(2)}.`,
          answer: num(v, null, 2),
          hint: "Poišči nedoločeni integral $F$ in uporabi $\\int_p^q f\\,dx = F(q) - F(p)$.",
          solution: `$F(x) = ${[[a, 3, "x^3"], [b, 2, "x^2"], [c, 1, "x"]]
            .filter(([k]) => k !== 0)
            .map(([k, d, x], i) => `${k < 0 ? "-" : i ? "+" : ""} ${k % d === 0 ? cf(Math.abs(k / d)) : `\\dfrac{${Math.abs(k)}}{${d}}`}${x}`)
            .join(" ")}$, $F(${q}) - F(${p}) \\approx ${r2(v, 2)}$`,
        };
      }
      if (level === 2) {
        const a = r.int(1, 5), k = r.pick([0.5, 1, 2, -1, -0.5]), T = r.int(1, 3);
        const v = (a / k) * (Math.exp(k * T) - 1);
        return {
          text: `Izračunaj $\\displaystyle\\int_{0}^{${T}} ${cf(a)}\\,e^{${cf(k)}x}\\,dx$. Zaokroži ${decWord(3)}.`,
          answer: num(v, null, 3),
          hint: "$\\int e^{kx}dx = \\dfrac{1}{k}e^{kx} + C$.",
          solution: `$\\dfrac{${a}}{${tx(k)}}\\left(e^{${tx(k * T)}} - 1\\right) \\approx ${r2(v, 3)}$`,
        };
      }
      const a = r.int(1, 4);
      const v = a * (1 - Math.cos(Math.PI / 2)) + 0; // ∫_0^{π/2} a sin x dx = a
      const b = r.int(1, 3);
      const w = v + (b * Math.PI ** 2) / 8; // + ∫_0^{π/2} b x dx
      return {
        text: `Izračunaj $\\displaystyle\\int_{0}^{\\pi/2} \\left(${cf(a)}\\sin x + ${cf(b)}x\\right)dx$. Zaokroži ${decWord(3)}.`,
        answer: num(w, null, 3),
        hint: "Integriraj vsak člen posebej: $\\int \\sin x\\,dx = -\\cos x$, $\\int x\\,dx = \\dfrac{x^2}{2}$.",
        solution: `$${cf(a)}\\left[-\\cos x\\right]_0^{\\pi/2} + ${cf(b)}\\left[\\dfrac{x^2}{2}\\right]_0^{\\pi/2} = ${a} + \\dfrac{${b}\\pi^2}{8} \\approx ${r2(w, 3)}$`,
      };
    },
  },
  {
    id: "uni-limita",
    topics: uniTopicIds("Limita in zveznost funkcije", "Zaporedja in limite"),
    gen(level, r) {
      if (level === 1) {
        const a = r.nonZero(-5, 5), b = r.nonZero(-5, 5);
        return {
          text: `Izračunaj $\\displaystyle\\lim_{x \\to ${a}} \\dfrac{${poly([1, b - a, -a * b], ["x^2", "x", ""])}}{${poly([1, -a], ["x", ""])}}$.`,
          answer: num(a + b, null, 0),
          hint: "Vstavljanje da $\\tfrac{0}{0}$. Števec razstavi in okrajšaj.",
          solution: `$\\dfrac{(x ${a < 0 ? "+" : "-"} ${Math.abs(a)})(x ${b < 0 ? "-" : "+"} ${Math.abs(b)})}{x ${a < 0 ? "+" : "-"} ${Math.abs(a)}} = x ${b < 0 ? "-" : "+"} ${Math.abs(b)} \\to ${a + b}$`,
        };
      }
      if (level === 2) {
        const p = r.nonZero(-6, 6), q = r.int(1, 7), s = r.int(-9, 9), t = r.int(-9, 9);
        return {
          text: `Izračunaj $\\displaystyle\\lim_{x \\to \\infty} \\dfrac{${poly([p, s, 1], ["x^2", "x", ""])}}{${poly([q, t, -2], ["x^2", "x", ""])}}$. Zaokroži ${decWord(3)}.`,
          answer: num(p / q, null, 3),
          hint: "Števec in imenovalec deli z najvišjo potenco $x^2$.",
          solution: `Limita je razmerje vodilnih koeficientov: $\\dfrac{${p}}{${q}} \\approx ${r2(p / q, 3)}$`,
        };
      }
      const a = r.int(2, 9), b = r.int(2, 9);
      return {
        text: `Izračunaj $\\displaystyle\\lim_{x \\to 0} \\dfrac{\\sin(${a}x)}{${b}x}$. Zaokroži ${decWord(3)}.`,
        answer: num(a / b, null, 3),
        hint: "Uporabi $\\lim_{u \\to 0} \\dfrac{\\sin u}{u} = 1$ s substitucijo $u = " + a + "x$.",
        solution: `$\\dfrac{${a}}{${b}}\\cdot\\dfrac{\\sin(${a}x)}{${a}x} \\to \\dfrac{${a}}{${b}} \\approx ${r2(a / b, 3)}$`,
      };
    },
  },
  {
    id: "uni-determinanta",
    topics: uniTopicIds("Matrike in determinante"),
    gen(level, r) {
      const n = level === 1 ? 2 : 3;
      const m = Array.from({ length: n }, () => Array.from({ length: n }, () => r.int(-4, 5)));
      const det =
        n === 2
          ? m[0][0] * m[1][1] - m[0][1] * m[1][0]
          : m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
      const tex = `\\begin{pmatrix}${m.map((row) => row.join(" & ")).join(" \\\\ ")}\\end{pmatrix}`;
      return {
        text: `Izračunaj determinanto matrike $A = ${tex}$.`,
        answer: num(det, null, 0),
        hint: n === 2 ? "$\\det\\begin{pmatrix}a & b\\\\ c & d\\end{pmatrix} = ad - bc$." : "Razvij po prvi vrstici (ali uporabi Sarrusovo pravilo).",
        solution: `$\\det A = ${det}$`,
      };
    },
  },
  {
    id: "uni-sistem",
    topics: uniTopicIds("Sistemi linearnih enačb"),
    gen(level, r) {
      const n = level === 1 ? 2 : 3;
      const vars = ["x", "y", "z"].slice(0, n);
      const sol = vars.map(() => r.int(-5, 5));
      let rows, det;
      do {
        rows = vars.map(() => vars.map(() => r.int(-4, 4)));
        det = n === 2 ? rows[0][0] * rows[1][1] - rows[0][1] * rows[1][0]
          : rows[0][0] * (rows[1][1] * rows[2][2] - rows[1][2] * rows[2][1]) - rows[0][1] * (rows[1][0] * rows[2][2] - rows[1][2] * rows[2][0]) + rows[0][2] * (rows[1][0] * rows[2][1] - rows[1][1] * rows[2][0]);
      } while (det === 0 || rows.some((row) => row.every((c) => c === 0)));
      const rhs = rows.map((row) => row.reduce((s, c, i) => s + c * sol[i], 0));
      const ask = r.int(0, n - 1);
      const eqs = rows.map((row, i) => `${poly(row, vars)} &= ${rhs[i]}`).join(" \\\\ ");
      return {
        text: `Reši sistem $\\begin{aligned} ${eqs} \\end{aligned}$ in zapiši vrednost $${vars[ask]}$.`,
        answer: num(sol[ask], null, 0),
        hint: "Uporabi Gaussovo eliminacijo: z vrsticami odpravi spremenljivke, dokler ne dobiš zgornje trikotne oblike.",
        solution: `$(${vars.join(", ")}) = (${sol.join(", ")})$`,
      };
    },
  },
  {
    id: "uni-lastne-vrednosti",
    topics: uniTopicIds("Lastne vrednosti in lastni vektorji"),
    gen(level, r) {
      const l1 = r.int(-3, 6);
      let l2 = r.int(-4, 5);
      if (l2 === l1) l2 -= 1;
      const a = r.int(-3, 5);
      const d = l1 + l2 - a;
      const P = -(a - l1) * (a - l2); // = bc
      let b, c;
      if (P === 0) [b, c] = [r.nonZero(-3, 3), 0];
      else {
        const divs = [];
        for (let k = 1; k <= Math.abs(P); k++) if (P % k === 0) divs.push(k, -k);
        b = r.pick(divs);
        c = P / b;
      }
      const big = Math.max(l1, l2);
      return {
        text: `Poišči ${level === 1 ? "večjo" : "večjo (po vrednosti)"} lastno vrednost matrike $A = \\begin{pmatrix}${a} & ${b} \\\\ ${c} & ${d}\\end{pmatrix}$.`,
        answer: num(big, null, 0),
        hint: "Reši karakteristično enačbo $\\det(A - \\lambda I) = \\lambda^2 - (\\operatorname{sl} A)\\lambda + \\det A = 0$.",
        solution: `$\\lambda^2 - ${l1 + l2 < 0 ? `(${l1 + l2})` : l1 + l2}\\lambda + ${l1 * l2 < 0 ? `(${l1 * l2})` : l1 * l2} = 0$, rešitvi $\\lambda_1 = ${Math.max(l1, l2)}$, $\\lambda_2 = ${Math.min(l1, l2)}$`,
      };
    },
  },
  {
    id: "uni-vektorji",
    topics: uniTopicIds("Vektorji"),
    gen(level, r) {
      const a = [r.int(-4, 4), r.int(-4, 4), r.nonZero(-4, 4)];
      const b = [r.nonZero(-4, 4), r.int(-4, 4), r.int(-4, 4)];
      const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
      const vt = (v) => `(${v.join(", ")})`;
      if (level === 1) {
        return {
          text: `Izračunaj skalarni produkt $\\vec a \\cdot \\vec b$ za $\\vec a = ${vt(a)}$ in $\\vec b = ${vt(b)}$.`,
          answer: num(dot, null, 0),
          hint: "$\\vec a \\cdot \\vec b = a_1 b_1 + a_2 b_2 + a_3 b_3$.",
          solution: `$\\vec a \\cdot \\vec b = ${dot}$`,
        };
      }
      const na = Math.hypot(...a), nb = Math.hypot(...b);
      if (level === 2) {
        const phi = Math.acos(dot / (na * nb)) / DEG;
        return {
          text: `Izračunaj kot med vektorjema $\\vec a = ${vt(a)}$ in $\\vec b = ${vt(b)}$ v stopinjah. Zaokroži ${decWord(1)}.`,
          answer: num(phi, "°", 1, { unitAlternatives: ["stopinj"] }),
          hint: "$\\cos\\varphi = \\dfrac{\\vec a \\cdot \\vec b}{|\\vec a|\\,|\\vec b|}$.",
          solution: `$\\cos\\varphi = \\dfrac{${dot}}{${r2(na, 3)} \\cdot ${r2(nb, 3)}}$, $\\varphi \\approx ${r2(phi, 1)}^\\circ$`,
        };
      }
      const cr = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
      const S = Math.hypot(...cr);
      return {
        text: `Izračunaj ploščino paralelograma, ki ga napenjata $\\vec a = ${vt(a)}$ in $\\vec b = ${vt(b)}$. Zaokroži ${decWord(2)}.`,
        answer: num(S, null, 2),
        hint: "Ploščina je $|\\vec a \\times \\vec b|$.",
        solution: `$\\vec a \\times \\vec b = ${vt(cr)}$, $S = |\\vec a \\times \\vec b| \\approx ${r2(S, 2)}$`,
      };
    },
  },
  {
    id: "uni-kompleksna",
    topics: uniTopicIds("Realna in kompleksna števila"),
    gen(level, r) {
      const [a, b, c, d] = [r.int(-5, 5), r.nonZero(-5, 5), r.int(-5, 5), r.nonZero(-5, 5)];
      const z = (x, y) => `${x} ${y < 0 ? "-" : "+"} ${Math.abs(y)}i`;
      if (level === 1) {
        return {
          text: `Izračunaj realni del produkta $(${z(a, b)})(${z(c, d)})$.`,
          answer: num(a * c - b * d, null, 0),
          hint: "$(a + bi)(c + di) = (ac - bd) + (ad + bc)i$.",
          solution: `$\\operatorname{Re} = ${a}\\cdot${c} - (${b})(${d}) = ${a * c - b * d}$`,
        };
      }
      if (level === 2) {
        const v = Math.hypot(a, b) / Math.hypot(c, d);
        return {
          text: `Izračunaj absolutno vrednost $\\left|\\dfrac{${z(a, b)}}{${z(c, d)}}\\right|$. Zaokroži ${decWord(3)}.`,
          answer: num(v, null, 3),
          hint: "$\\left|\\dfrac{z_1}{z_2}\\right| = \\dfrac{|z_1|}{|z_2|}$ in $|x + yi| = \\sqrt{x^2 + y^2}$.",
          solution: `$\\dfrac{\\sqrt{${a * a + b * b}}}{\\sqrt{${c * c + d * d}}} \\approx ${r2(v, 3)}$`,
        };
      }
      const arg = Math.atan2(b, a) / DEG;
      return {
        text: `Zapiši argument števila $z = ${z(a, b)}$ v stopinjah na intervalu $(-180^\\circ, 180^\\circ]$. Zaokroži ${decWord(1)}.`,
        answer: num(arg, "°", 1, { unitAlternatives: ["stopinj"] }),
        hint: "Pazi, v katerem kvadrantu leži $z$; $\\tan\\varphi = \\dfrac{y}{x}$ sam ne zadošča.",
        solution: `$\\varphi = \\operatorname{atan2}(${b}, ${a}) \\approx ${r2(arg, 1)}^\\circ$`,
      };
    },
  },
  {
    id: "uni-de1",
    topics: uniTopicIds("Diferencialne enačbe prvega reda"),
    gen(level, r) {
      if (level === 1) {
        const k = r.pick([0.1, 0.2, 0.3, 0.5, -0.2, -0.4]), y0 = r.int(2, 20), t = r.int(1, 6);
        const v = y0 * Math.exp(k * t);
        return {
          text: `Reši začetni problem $y' = ${tx(k)}\\,y$, $y(0) = ${y0}$ in izračunaj $y(${t})$. Zaokroži ${decWord(2)}.`,
          answer: num(v, null, 2),
          hint: "Enačba je ločljiva; rešitev je $y(t) = y(0)\\,e^{kt}$.",
          solution: `$y(t) = ${y0}e^{${tx(k)}t}$, $y(${t}) \\approx ${r2(v, 2)}$`,
        };
      }
      if (level === 2) {
        const k = r.pick([0.05, 0.1, 0.2, 0.35, 0.5]);
        return {
          text: `Količina snovi pada po enačbi $y' = -${tx(k)}\\,y$ (čas v minutah). Po kolikšnem času pade na polovico začetne vrednosti? Zaokroži ${decWord(2)}.`,
          answer: num(Math.log(2) / k, "min", 2),
          hint: "Iz $y(t) = y_0 e^{-kt} = \\tfrac{1}{2}y_0$ izrazi $t$.",
          solution: `$t = \\dfrac{\\ln 2}{${tx(k)}} \\approx ${r2(Math.log(2) / k, 2)}\\ \\mathrm{min}$`,
        };
      }
      const a = r.int(2, 12), b = r.pick([0.2, 0.5, 1, 2]), t = r.pick([1, 2, 3]);
      const v = (a / b) * (1 - Math.exp(-b * t));
      return {
        text: `Reši začetni problem $y' = ${a} - ${tx(b)}\\,y$, $y(0) = 0$ in izračunaj $y(${t})$. Zaokroži ${decWord(3)}.`,
        answer: num(v, null, 3),
        hint: "Linearna enačba: ravnovesna rešitev je $y = a/b$, odstopanje od nje pada eksponentno.",
        solution: `$y(t) = \\dfrac{${a}}{${tx(b)}}\\left(1 - e^{-${tx(b)}t}\\right)$, $y(${t}) \\approx ${r2(v, 3)}$`,
      };
    },
  },
  {
    id: "uni-vrste",
    topics: uniTopicIds("Vrste"),
    gen(level, r) {
      const a = r.int(1, 9);
      const [p, q] = r.pick(level === 1 ? [[1, 2], [1, 3], [1, 4], [2, 3]] : [[-1, 2], [3, 4], [-2, 3], [2, 5], [-3, 5]]);
      const start = level === 3 ? 1 : 0;
      const v = (a * (p / q) ** start) / (1 - p / q);
      return {
        text: `Izračunaj vsoto vrste $\\displaystyle\\sum_{n=${start}}^{\\infty} ${a}\\left(${p < 0 ? "-" : ""}\\dfrac{${Math.abs(p)}}{${q}}\\right)^n$. Zaokroži ${decWord(3)}.`,
        answer: num(v, null, 3),
        hint: "Geometrijska vrsta s prvim členom $a_0$ in količnikom $|q| < 1$ ima vsoto $\\dfrac{a_0}{1 - q}$.",
        solution: `Prvi člen je $${tx(a * (p / q) ** start, 4)}$, količnik $${tx(p / q, 4)}$, vsota $\\approx ${r2(v, 3)}$`,
      };
    },
  },
  {
    id: "uni-parcialni",
    topics: uniTopicIds("Parcialni odvodi"),
    gen(level, r) {
      const a = r.nonZero(-4, 4), b = r.nonZero(-3, 3), c = r.int(-5, 5);
      const x0 = r.nonZero(-2, 2), y0 = r.nonZero(-2, 2);
      const byX = level !== 2;
      const v = byX ? 2 * a * x0 * y0 + b * y0 ** 3 + c : a * x0 ** 2 + 3 * b * x0 * y0 ** 2;
      return {
        text: `Dana je $f(x, y) = ${poly([a, b, c], ["x^2y", "xy^3", "x"])}$. Izračunaj $\\dfrac{\\partial f}{\\partial ${byX ? "x" : "y"}}(${x0}, ${y0})$.`,
        answer: num(v, null, 0),
        hint: `Pri odvajanju po $${byX ? "x" : "y"}$ je $${byX ? "y" : "x"}$ konstanta.`,
        solution: byX ? `$f_x = ${poly([2 * a, b, c], ["xy", "y^3", ""])}$, vrednost $${v}$` : `$f_y = ${poly([a, 3 * b], ["x^2", "xy^2"])}$, vrednost $${v}$`,
      };
    },
  },
  {
    id: "uni-binomska",
    topics: uniTopicIds("Slučajne spremenljivke in porazdelitve", "Klasična verjetnost", "Verjetnost in statistika"),
    gen(level, r) {
      const n = r.int(5, level === 1 ? 8 : 15), k = r.int(1, Math.min(n, 6)), p = r.pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]);
      let C = 1;
      for (let i = 0; i < k; i++) C = (C * (n - i)) / (i + 1);
      const v = C * p ** k * (1 - p) ** (n - k);
      return {
        text: `Izdelek je pokvarjen z verjetnostjo $${tx(p)}$, neodvisno od drugih. Kolikšna je verjetnost, da je med $${n}$ izdelki natanko $${k}$ ${k === 1 ? "pokvarjen" : k === 2 ? "pokvarjena" : k <= 4 ? "pokvarjeni" : "pokvarjenih"}? Zaokroži ${decWord(4)}.`,
        answer: num(v, null, 4),
        hint: "Binomska porazdelitev: $P(X = k) = \\binom{n}{k}p^k(1 - p)^{n-k}$.",
        solution: `$\\binom{${n}}{${k}}\\cdot ${tx(p)}^{${k}}\\cdot ${tx(1 - p)}^{${n - k}} \\approx ${r2(v, 4)}$`,
      };
    },
  },
  {
    id: "uni-statistika",
    topics: uniTopicIds("Statistična obdelava rezultatov", "Verjetnost in statistika"),
    gen(level, r) {
      const base = r.dec(5, 50, 1);
      const xs = Array.from({ length: level === 1 ? 4 : 5 }, () => roundHalfUp(base + r.dec(-1, 1, 2), 2));
      const m = xs.reduce((s, x) => s + x, 0) / xs.length;
      const s = Math.sqrt(xs.reduce((t, x) => t + (x - m) ** 2, 0) / (xs.length - 1));
      const askMean = level === 1;
      return {
        text: `Pri ponovljenih meritvah ste dobili: $${xs.map((x) => tx(x)).join(";\\ ")}$. Izračunaj ${askMean ? "povprečje" : "vzorčni standardni odklon $s$"} in zaokroži ${decWord(3)}.`,
        answer: num(askMean ? m : s, null, 3),
        hint: askMean ? "$\\bar x = \\dfrac{1}{n}\\sum x_i$." : "$s = \\sqrt{\\dfrac{\\sum (x_i - \\bar x)^2}{n - 1}}$ (imenovalec $n - 1$).",
        solution: `$\\bar x \\approx ${r2(m, 4)}$, $s \\approx ${r2(s, 4)}$`,
      };
    },
  },
  {
    id: "uni-numerika",
    topics: uniTopicIds("Reševanje nelinearnih enačb", "Numerično integriranje"),
    gen(level, r, topicId) {
      if (topicId.endsWith("numericno-integriranje") || level === 3) {
        const b = r.int(1, 3), n = r.pick([2, 4]), c = r.int(1, 3);
        const f = (x) => c * x * x + 1;
        const h = b / n;
        let v = (f(0) + f(b)) / 2;
        for (let i = 1; i < n; i++) v += f(i * h);
        v *= h;
        return {
          text: `Oceni $\\displaystyle\\int_0^{${b}} (${c === 1 ? "" : c}x^2 + 1)\\,dx$ s trapeznim pravilom z $n = ${n}$ podintervali. Zaokroži ${decWord(4)}.`,
          answer: num(v, null, 4),
          hint: "$T = h\\left(\\tfrac{f_0}{2} + f_1 + \\dots + f_{n-1} + \\tfrac{f_n}{2}\\right)$, $h = (b - a)/n$.",
          solution: `$h = ${tx(h)}$, $T \\approx ${r2(v, 4)}$ (točno: $${r2((c * b ** 3) / 3 + b, 4)}$)`,
        };
      }
      const c = r.pick([2, 3, 5, 6, 7, 10]), x0 = r.int(1, 4);
      const x1 = x0 - (x0 * x0 - c) / (2 * x0);
      return {
        text: `Z Newtonovo metodo iščemo ničlo $f(x) = x^2 - ${c}$. Iz začetnega približka $x_0 = ${x0}$ izračunaj $x_1$. Zaokroži ${decWord(4)}.`,
        answer: num(x1, null, 4),
        hint: "$x_{k+1} = x_k - \\dfrac{f(x_k)}{f'(x_k)}$.",
        solution: `$x_1 = ${x0} - \\dfrac{${x0 * x0 - c}}{${2 * x0}} \\approx ${r2(x1, 4)}$`,
      };
    },
  },
  {
    id: "uni-obresti",
    topics: uniTopicIds("Obrestni račun"),
    gen(level, r) {
      const K0 = r.int(5, 50) * 100, p = r.pick([1.5, 2, 2.5, 3, 4, 5]), n = r.int(2, 10);
      if (level === 1) {
        const v = K0 * (1 + p / 100) ** n;
        return {
          text: `Vloga $${K0}\\ €$ se letno obrestuje po $${tx(p)}\\ \\%$ (obrestno obrestovanje). Koliko je vredna po $${n}$ letih? Zaokroži ${decWord(2)}.`,
          answer: num(v, "€", 2, { unitAlternatives: ["eur", "evrov"] }),
          hint: "$K_n = K_0 (1 + p/100)^n$.",
          solution: `$K_{${n}} = ${K0}\\cdot ${tx(1 + p / 100, 4)}^{${n}} \\approx ${r2(v, 2)}\\ €$`,
        };
      }
      if (level === 2) {
        const v = K0 * Math.exp((p / 100) * n);
        return {
          text: `Vloga $${K0}\\ €$ se zvezno obrestuje z letno obrestno mero $${tx(p)}\\ \\%$. Koliko je vredna po $${n}$ letih? Zaokroži ${decWord(2)}.`,
          answer: num(v, "€", 2, { unitAlternatives: ["eur", "evrov"] }),
          hint: "Zvezno obrestovanje: $K(t) = K_0 e^{rt}$.",
          solution: `$${K0}\\,e^{${tx(p / 100)}\\cdot ${n}} \\approx ${r2(v, 2)}\\ €$`,
        };
      }
      const v = ((1 + p / 100 / 12) ** 12 - 1) * 100;
      return {
        text: `Nominalna letna obrestna mera je $${tx(p)}\\ \\%$, obresti se pripisujejo mesečno. Kolikšna je efektivna letna obrestna mera v odstotkih? Zaokroži ${decWord(3)}.`,
        answer: num(v, "%", 3),
        hint: "$r_{\\mathrm{ef}} = \\left(1 + \\dfrac{r}{m}\\right)^m - 1$.",
        solution: `$\\left(1 + \\dfrac{${tx(p / 100)}}{12}\\right)^{12} - 1 \\approx ${r2(v, 3)}\\ \\%$`,
      };
    },
  },
  {
    id: "uni-anuiteta",
    topics: uniTopicIds("Rente in amortizacija"),
    gen(level, r) {
      const P = r.int(5, 40) * 1000, p = r.pick([2, 3, 4, 5, 6]), n = r.pick([5, 10, 15, 20]);
      const monthly = level >= 2;
      const i = monthly ? p / 100 / 12 : p / 100, N = monthly ? n * 12 : n;
      const a = (P * i) / (1 - (1 + i) ** -N);
      return {
        text: `Posojilo $${P}\\ €$ odplačujemo ${monthly ? "z mesečnimi" : "z letnimi"} anuitetami ${n} let, obrestna mera je $${p}\\ \\%$ letno${monthly ? " (mesečna mera je $p/12$)" : ""}. Kolikšna je anuiteta? Zaokroži ${decWord(2)}.`,
        answer: num(a, "€", 2, { unitAlternatives: ["eur", "evrov"] }),
        hint: "$a = \\dfrac{P\\,i}{1 - (1 + i)^{-N}}$, kjer je $i$ obrestna mera obdobja in $N$ število obrokov.",
        solution: `$i = ${tx(i, 5)}$, $N = ${N}$, $a \\approx ${r2(a, 2)}\\ €$`,
      };
    },
  },

  // ------------------------------------------------------------ fizika in mehanika
  {
    id: "uni-posevni-met",
    topics: uniTopicIds("Kinematika"),
    gen(level, r) {
      const v = r.int(8, 40), al = r.pick([15, 30, 37, 45, 53, 60, 75]);
      if (level === 1) {
        const h = (v * Math.sin(al * DEG)) ** 2 / (2 * G);
        return {
          text: `Telo vržemo s hitrostjo $${v}\\ \\mathrm{m/s}$ pod kotom $${al}^\\circ$ glede na vodoravnico. Kako visoko se dvigne? Zanemari upor zraka, $g = 9{,}81\\ \\mathrm{m/s^2}$. Zaokroži ${decWord(1)}.`,
          answer: num(h, "m", 1),
          hint: "Navpična komponenta hitrosti je $v\\sin\\alpha$; v najvišji točki je nič.",
          solution: `$h = \\dfrac{(v\\sin\\alpha)^2}{2g} \\approx ${r2(h, 1)}\\ \\mathrm{m}$`,
        };
      }
      const D = (v * v * Math.sin(2 * al * DEG)) / G;
      return {
        text: `Telo vržemo s tal s hitrostjo $${v}\\ \\mathrm{m/s}$ pod kotom $${al}^\\circ$. Kolikšen je domet na vodoravnih tleh? Zanemari upor zraka, $g = 9{,}81\\ \\mathrm{m/s^2}$. Zaokroži ${decWord(1)}.`,
        answer: num(D, "m", 1),
        hint: "Čas leta je $t = \\dfrac{2v\\sin\\alpha}{g}$, domet $D = v\\cos\\alpha \\cdot t$.",
        solution: `$D = \\dfrac{v^2\\sin 2\\alpha}{g} \\approx ${r2(D, 1)}\\ \\mathrm{m}$`,
      };
    },
  },
  {
    id: "uni-nihanje",
    topics: uniTopicIds("Harmonično nihanje"),
    gen(level, r) {
      if (level === 1) {
        const m = r.dec(0.1, 2, 2), k = r.int(10, 400);
        const T = 2 * Math.PI * Math.sqrt(m / k);
        return {
          text: `Utež z maso $${tx(m)}\\ \\mathrm{kg}$ niha na vzmeti s koeficientom $${k}\\ \\mathrm{N/m}$. Kolikšen je nihajni čas? Zaokroži ${decWord(3)}.`,
          answer: num(T, "s", 3),
          hint: "$T = 2\\pi\\sqrt{m/k}$.",
          solution: `$T = 2\\pi\\sqrt{${tx(m)}/${k}} \\approx ${r2(T, 3)}\\ \\mathrm{s}$`,
        };
      }
      if (level === 2) {
        const l = r.dec(0.2, 3, 2);
        const T = 2 * Math.PI * Math.sqrt(l / G);
        return {
          text: `Kolikšen je nihajni čas matematičnega nihala z dolžino $${tx(l)}\\ \\mathrm{m}$ pri majhnih odmikih? $g = 9{,}81\\ \\mathrm{m/s^2}$. Zaokroži ${decWord(3)}.`,
          answer: num(T, "s", 3),
          hint: "$T = 2\\pi\\sqrt{l/g}$.",
          solution: `$T \\approx ${r2(T, 3)}\\ \\mathrm{s}$`,
        };
      }
      const m = r.dec(0.2, 2, 1), k = r.int(20, 300), A = r.int(2, 15);
      const vmax = (A / 100) * Math.sqrt(k / m);
      return {
        text: `Utež z maso $${tx(m)}\\ \\mathrm{kg}$ na vzmeti ($k = ${k}\\ \\mathrm{N/m}$) niha z amplitudo $${A}\\ \\mathrm{cm}$. Kolikšna je največja hitrost uteži? Zaokroži ${decWord(3)}.`,
        answer: num(vmax, "m/s", 3),
        hint: "$v_{\\max} = A\\omega$, $\\omega = \\sqrt{k/m}$.",
        solution: `$v_{\\max} = ${tx(A / 100)}\\cdot\\sqrt{${k}/${tx(m)}} \\approx ${r2(vmax, 3)}\\ \\mathrm{m/s}$`,
      };
    },
  },
  {
    id: "uni-vrtenje",
    topics: uniTopicIds("Vrtenje togega telesa"),
    gen(level, r) {
      const m = r.dec(0.5, 20, 1), rr = r.dec(0.05, 0.6, 2), f = r.int(1, 20);
      const J = level === 1 ? 0.5 * m * rr * rr : m * rr * rr;
      const w = 2 * Math.PI * f;
      const Wk = 0.5 * J * w * w;
      return {
        text: `${level === 1 ? "Homogen valj (disk)" : "Tankostenski obroč"} z maso $${tx(m)}\\ \\mathrm{kg}$ in polmerom $${tx(rr)}\\ \\mathrm{m}$ se vrti okoli svoje osi s frekvenco $${f}\\ \\mathrm{s^{-1}}$. Kolikšna je njegova kinetična energija? Zaokroži ${decWord(1)}.`,
        answer: num(Wk, "J", 1),
        hint: `${level === 1 ? "$J = \\tfrac{1}{2}mr^2$" : "$J = mr^2$"}, $\\omega = 2\\pi\\nu$, $W_k = \\tfrac{1}{2}J\\omega^2$.`,
        solution: `$J \\approx ${r2(J, 5)}\\ \\mathrm{kg\\,m^2}$, $\\omega \\approx ${r2(w, 2)}\\ \\mathrm{s^{-1}}$, $W_k \\approx ${r2(Wk, 1)}\\ \\mathrm{J}$`,
      };
    },
  },
  {
    id: "uni-plin",
    topics: uniTopicIds("Idealni plin in kinetična teorija", "Plini"),
    gen(level, r) {
      const T = r.int(250, 500), V = r.dec(1, 50, 1);
      if (level === 1) {
        const p = r.int(80, 500);
        const n = (p * 1000 * V * 1e-3) / (R * T);
        return {
          text: `V posodi s prostornino $${tx(V)}\\ \\mathrm{L}$ je idealni plin pri $${p}\\ \\mathrm{kPa}$ in $${T}\\ \\mathrm{K}$. Kolikšna je množina plina? $R = 8{,}314\\ \\mathrm{J/(mol\\,K)}$. Zaokroži ${decWord(3)}.`,
          answer: num(n, "mol", 3),
          hint: "$pV = nRT$; tlak pretvori v Pa in prostornino v $\\mathrm{m^3}$.",
          solution: `$n = \\dfrac{pV}{RT} = \\dfrac{${p * 1000}\\cdot ${tx(V / 1000, 4)}}{8{,}314\\cdot ${T}} \\approx ${r2(n, 3)}\\ \\mathrm{mol}$`,
        };
      }
      const n = r.dec(0.1, 3, 2);
      const p = (n * R * T) / (V * 1e-3) / 1000;
      return {
        text: `$${tx(n)}\\ \\mathrm{mol}$ idealnega plina zapremo v posodo s prostornino $${tx(V)}\\ \\mathrm{L}$ pri $${T - 273}\\ ^\\circ\\mathrm{C}$. Kolikšen je tlak v kPa? Zaokroži ${decWord(1)}.`,
        answer: num((n * R * (T - 273 + 273.15)) / (V * 1e-3) / 1000, "kPa", 1, { alsoAccept: [p] }),
        hint: "Temperaturo pretvori v kelvine ($T = t + 273{,}15$), nato $p = nRT/V$.",
        solution: `$p = \\dfrac{nRT}{V} \\approx ${r2((n * R * (T - 273 + 273.15)) / (V * 1e-3) / 1000, 1)}\\ \\mathrm{kPa}$`,
      };
    },
  },
  {
    id: "uni-prvi-zakon",
    topics: uniTopicIds("Prvi zakon termodinamike"),
    gen(level, r) {
      const n = r.dec(0.2, 3, 1), T = r.int(280, 450);
      if (level <= 2) {
        const ratio = r.pick([2, 3, 4, 0.5]);
        const W = n * R * T * Math.log(ratio);
        return {
          text: `$${tx(n)}\\ \\mathrm{mol}$ idealnega plina se pri stalni temperaturi $${T}\\ \\mathrm{K}$ ${ratio > 1 ? "razpne" : "stisne"} na $${tx(ratio)}$-kratnik začetne prostornine. Koliko dela opravi plin? Rezultat v kJ zaokroži ${decWord(2)}.`,
          answer: num(W / 1000, "kJ", 2),
          hint: "Pri izotermni spremembi idealnega plina je $W = nRT\\ln\\dfrac{V_2}{V_1}$ (delo, ki ga opravi plin).",
          solution: `$W = ${tx(n)}\\cdot 8{,}314\\cdot ${T}\\cdot\\ln ${tx(ratio)} \\approx ${r2(W / 1000, 2)}\\ \\mathrm{kJ}$`,
        };
      }
      const eps = r.pick([2, 4, 5, 8, 10]);
      const T2 = T * eps ** 0.4;
      return {
        text: `Zrak ($\\kappa = 1{,}4$) s temperaturo $${T}\\ \\mathrm{K}$ adiabatno stisnemo na $1/${eps}$ začetne prostornine. Kolikšna je končna temperatura? Zaokroži ${decWord(1)}.`,
        answer: num(T2, "K", 1),
        hint: "Za adiabatno spremembo velja $TV^{\\kappa - 1} = \\text{konst.}$",
        solution: `$T_2 = T_1\\left(\\dfrac{V_1}{V_2}\\right)^{\\kappa - 1} = ${T}\\cdot ${eps}^{0{,}4} \\approx ${r2(T2, 1)}\\ \\mathrm{K}$`,
      };
    },
  },
  {
    id: "uni-izkoristek",
    topics: uniTopicIds("Drugi zakon termodinamike", "Krožni procesi"),
    gen(level, r, topicId) {
      if (topicId.endsWith("krozni-procesi") && level >= 2) {
        const eps = r.pick([6, 7, 8, 9, 10, 11]);
        const eta = (1 - 1 / eps ** 0.4) * 100;
        return {
          text: `Kolikšen je teoretični izkoristek Ottovega procesa s kompresijskim razmerjem $\\varepsilon = ${eps}$ in $\\kappa = 1{,}4$? Rezultat v % zaokroži ${decWord(1)}.`,
          answer: num(eta, "%", 1),
          hint: "$\\eta = 1 - \\dfrac{1}{\\varepsilon^{\\kappa - 1}}$.",
          solution: `$\\eta = 1 - ${eps}^{-0{,}4} \\approx ${r2(eta, 1)}\\ \\%$`,
        };
      }
      const Th = r.int(400, 900), Tc = r.int(270, 350);
      const eta = (1 - Tc / Th) * 100;
      return {
        text: `Toplotni stroj deluje med rezervoarjema s temperaturama $${Th}\\ \\mathrm{K}$ in $${Tc}\\ \\mathrm{K}$. Kolikšen je največji možni izkoristek v %? Zaokroži ${decWord(1)}.`,
        answer: num(eta, "%", 1),
        hint: "Carnotov izkoristek: $\\eta = 1 - \\dfrac{T_c}{T_h}$.",
        solution: `$\\eta = 1 - \\dfrac{${Tc}}{${Th}} \\approx ${r2(eta, 1)}\\ \\%$`,
      };
    },
  },
  {
    id: "uni-elektrostatika",
    topics: uniTopicIds("Elektrostatika"),
    gen(level, r) {
      if (level <= 2) {
        const q1 = r.nonZero(-9, 9), q2 = r.nonZero(-9, 9), d = r.int(2, 50);
        const F = (KE * Math.abs(q1 * q2) * 1e-12) / (d / 100) ** 2;
        return {
          text: `Točkasta naboja $${q1}\\ \\mathrm{\\mu C}$ in $${q2}\\ \\mathrm{\\mu C}$ sta $${d}\\ \\mathrm{cm}$ narazen. Kolikšna je velikost sile med njima? $k = 8{,}988\\cdot 10^9\\ \\mathrm{N\\,m^2/C^2}$. Zaokroži ${decWord(3)}.`,
          answer: num(F, "N", 3),
          hint: "$F = k\\dfrac{|q_1 q_2|}{r^2}$; pretvori v C in m.",
          solution: `$F \\approx ${r2(F, 3)}\\ \\mathrm{N}$`,
        };
      }
      const S = r.int(10, 400), d = r.dec(0.1, 5, 1);
      const Cp = (EPS0 * S * 1e-4) / (d * 1e-3) * 1e12;
      return {
        text: `Ploščati kondenzator ima plošči s ploščino $${S}\\ \\mathrm{cm^2}$, razmik med njima je $${tx(d)}\\ \\mathrm{mm}$ (zrak). Kolikšna je kapaciteta v pF? $\\varepsilon_0 = 8{,}854\\cdot 10^{-12}\\ \\mathrm{F/m}$. Zaokroži ${decWord(1)}.`,
        answer: num(Cp, "pF", 1),
        hint: "$C = \\varepsilon_0 \\dfrac{S}{d}$.",
        solution: `$C \\approx ${r2(Cp, 1)}\\ \\mathrm{pF}$`,
      };
    },
  },
  {
    id: "uni-vezja",
    topics: uniTopicIds("Električni tok in vezja"),
    gen(level, r) {
      if (level === 1) {
        const R1 = r.int(10, 200), R2 = r.int(10, 200), R3 = r.int(5, 100);
        const Re = (R1 * R2) / (R1 + R2) + R3;
        return {
          text: `Upornika $${R1}\\ \\Omega$ in $${R2}\\ \\Omega$ sta vezana vzporedno, zaporedno z njima je $${R3}\\ \\Omega$. Kolikšen je nadomestni upor? Zaokroži ${decWord(1)}.`,
          answer: num(Re, "Ω", 1, { unitAlternatives: ["ohm", "ohmov"] }),
          hint: "Vzporedno: $\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2}$, zaporedno se upori seštejejo.",
          solution: `$R = \\dfrac{${R1}\\cdot ${R2}}{${R1 + R2}} + ${R3} \\approx ${r2(Re, 1)}\\ \\Omega$`,
        };
      }
      const Rk = r.int(1, 100), Cu = r.int(1, 100), U0 = r.int(3, 24);
      const tau = Rk * Cu * 1e-3; // kΩ · µF = ms
      const t = roundHalfUp(tau * r.pick([0.5, 1, 1.5, 2]), 1);
      const Uc = U0 * (1 - Math.exp(-t / tau));
      return {
        text: `Prazen kondenzator s kapaciteto $${Cu}\\ \\mathrm{\\mu F}$ prek upora $${Rk}\\ \\mathrm{k\\Omega}$ priključimo na napetost $${U0}\\ \\mathrm{V}$. Kolikšna je napetost na kondenzatorju po $${tx(t * 1000)}\\ \\mathrm{ms}$? Zaokroži ${decWord(2)}.`,
        answer: num(Uc, "V", 2),
        hint: "$U_C(t) = U_0\\left(1 - e^{-t/\\tau}\\right)$, $\\tau = RC$.",
        solution: `$\\tau = RC = ${tx(tau * 1000)}\\ \\mathrm{ms}$, $U_C \\approx ${r2(Uc, 2)}\\ \\mathrm{V}$`,
      };
    },
  },
  {
    id: "uni-fotoni",
    topics: uniTopicIds("Fotoni in atomi"),
    gen(level, r) {
      if (level <= 2) {
        const lam = r.int(200, 800);
        const Ev = (H * C) / (lam * 1e-9) / E;
        return {
          text: `Kolikšna je energija fotona z valovno dolžino $${lam}\\ \\mathrm{nm}$ v elektronvoltih? Zaokroži ${decWord(2)}.`,
          answer: num(Ev, "eV", 2),
          hint: "$E = \\dfrac{hc}{\\lambda}$; $1\\ \\mathrm{eV} = 1{,}602\\cdot 10^{-19}\\ \\mathrm{J}$.",
          solution: `$E = \\dfrac{hc}{\\lambda} \\approx ${r2(Ev, 2)}\\ \\mathrm{eV}$`,
        };
      }
      const U = r.int(10, 500);
      const lam = H / Math.sqrt(2 * ME * E * U) * 1e9;
      return {
        text: `Elektron pospešimo iz mirovanja z napetostjo $${U}\\ \\mathrm{V}$. Kolikšna je njegova de Brogliejeva valovna dolžina v nm? Zaokroži ${decWord(4)}.`,
        answer: num(lam, "nm", 4),
        hint: "$\\lambda = \\dfrac{h}{p}$, $p = \\sqrt{2 m_e e U}$ (nerelativistično).",
        solution: `$\\lambda \\approx ${r2(lam, 4)}\\ \\mathrm{nm}$`,
      };
    },
  },
  {
    id: "uni-jama",
    topics: uniTopicIds("Uvod v kvantno mehaniko"),
    gen(level, r) {
      const L = r.dec(0.2, 2, 1), n = level === 1 ? 1 : r.int(2, 4);
      const En = (n * n * H * H) / (8 * ME * (L * 1e-9) ** 2) / E;
      const ask = level === 3 ? "razliko energij med stanjema $n = " + n + "$ in $n = 1$" : `energijo stanja $n = ${n}$`;
      const v = level === 3 ? En - En / (n * n) : En;
      return {
        text: `Elektron je v neskončni potencialni jami s širino $${tx(L)}\\ \\mathrm{nm}$. Izračunaj ${ask} v eV. Zaokroži ${decWord(3)}.`,
        answer: num(v, "eV", 3),
        hint: "$E_n = \\dfrac{n^2 h^2}{8 m_e L^2}$.",
        solution: `$E_1 \\approx ${r2(En / (n * n), 4)}\\ \\mathrm{eV}$, rezultat $\\approx ${r2(v, 3)}\\ \\mathrm{eV}$`,
      };
    },
  },
  {
    id: "uni-bernoulli",
    topics: uniTopicIds("Kontinuitetna in Bernoullijeva enačba"),
    gen(level, r) {
      const d1 = r.int(4, 20), d2 = r.int(2, d1 - 1), v1 = r.dec(0.5, 3, 1);
      const v2 = v1 * (d1 / d2) ** 2;
      if (level === 1) {
        return {
          text: `Voda teče po cevi s premerom $${d1}\\ \\mathrm{cm}$ s hitrostjo $${tx(v1)}\\ \\mathrm{m/s}$. Cev se zoži na premer $${d2}\\ \\mathrm{cm}$. Kolikšna je hitrost v ožjem delu? Zaokroži ${decWord(2)}.`,
          answer: num(v2, "m/s", 2),
          hint: "Kontinuitetna enačba: $S_1 v_1 = S_2 v_2$.",
          solution: `$v_2 = v_1\\left(\\dfrac{d_1}{d_2}\\right)^2 \\approx ${r2(v2, 2)}\\ \\mathrm{m/s}$`,
        };
      }
      const dp = (1000 / 2) * (v2 * v2 - v1 * v1) / 1000;
      return {
        text: `Voda ($\\rho = 1000\\ \\mathrm{kg/m^3}$) teče po vodoravni cevi s premerom $${d1}\\ \\mathrm{cm}$ s hitrostjo $${tx(v1)}\\ \\mathrm{m/s}$; cev se zoži na $${d2}\\ \\mathrm{cm}$. Za koliko je tlak v ožjem delu nižji? Rezultat v kPa zaokroži ${decWord(2)}.`,
        answer: num(dp, "kPa", 2),
        hint: "Najprej $v_2$ iz kontinuitetne enačbe, nato Bernoulli: $\\Delta p = \\tfrac{\\rho}{2}(v_2^2 - v_1^2)$.",
        solution: `$v_2 \\approx ${r2(v2, 3)}\\ \\mathrm{m/s}$, $\\Delta p \\approx ${r2(dp, 2)}\\ \\mathrm{kPa}$`,
      };
    },
  },
  {
    id: "uni-reynolds",
    topics: uniTopicIds("Viskoznost in Reynoldsovo število", "Tlačne izgube v ceveh"),
    gen(level, r) {
      const [name, rho, mu] = r.pick([["voda", 998, 1.0e-3], ["olje", 880, 0.08], ["glicerol", 1260, 1.41]]);
      const v = r.dec(0.1, 3, 1), d = r.int(1, 15);
      const Re = (rho * v * d * 0.01) / mu;
      return {
        text: `Po cevi s premerom $${d}\\ \\mathrm{cm}$ teče ${name} ($\\rho = ${rho}\\ \\mathrm{kg/m^3}$, $\\eta = ${tx(mu)}\\ \\mathrm{Pa\\,s}$) s povprečno hitrostjo $${tx(v)}\\ \\mathrm{m/s}$. Izračunaj Reynoldsovo število in ga zaokroži ${decWord(0)}.`,
        answer: num(Re, null, 0),
        hint: "$Re = \\dfrac{\\rho v d}{\\eta}$. Tok je laminaren pri $Re < 2300$.",
        solution: `$Re \\approx ${r2(Re, 0)}$ (${Re < 2300 ? "laminaren" : "turbulenten ali prehoden"} tok)`,
      };
    },
  },
  {
    id: "uni-prevod",
    topics: uniTopicIds("Prevod toplote"),
    gen(level, r) {
      const A = r.dec(1, 20, 1), dT = r.int(5, 40);
      const [m1, l1] = r.pick([["opeke", 0.7], ["betona", 1.4], ["lesa", 0.13], ["stekla", 0.8]]);
      const d1 = r.int(5, 30);
      if (level <= 2) {
        const P = (l1 * A * dT) / (d1 / 100);
        return {
          text: `Stena iz ${m1} ($\\lambda = ${tx(l1)}\\ \\mathrm{W/(m\\,K)}$) ima ploščino $${tx(A)}\\ \\mathrm{m^2}$ in debelino $${d1}\\ \\mathrm{cm}$. Temperaturna razlika med površinama je $${dT}\\ \\mathrm{K}$. Kolikšen je toplotni tok? Zaokroži ${decWord(1)}.`,
          answer: num(P, "W", 1),
          hint: "Fourierov zakon: $\\dot Q = \\lambda A\\dfrac{\\Delta T}{d}$.",
          solution: `$\\dot Q = ${tx(l1)}\\cdot ${tx(A)}\\cdot\\dfrac{${dT}}{${tx(d1 / 100)}} \\approx ${r2(P, 1)}\\ \\mathrm{W}$`,
        };
      }
      const d2 = r.int(5, 20), l2 = 0.04;
      const Rt = d1 / 100 / (l1 * A) + d2 / 100 / (l2 * A);
      const P = dT / Rt;
      return {
        text: `Stena iz ${m1} ($\\lambda_1 = ${tx(l1)}\\ \\mathrm{W/(m\\,K)}$, $${d1}\\ \\mathrm{cm}$) ima na zunanji strani še $${d2}\\ \\mathrm{cm}$ izolacije ($\\lambda_2 = 0{,}04\\ \\mathrm{W/(m\\,K)}$). Ploščina je $${tx(A)}\\ \\mathrm{m^2}$, temperaturna razlika $${dT}\\ \\mathrm{K}$. Kolikšen je toplotni tok? Zaokroži ${decWord(1)}.`,
        answer: num(P, "W", 1),
        hint: "Toplotna upora plasti se seštejeta: $R = \\dfrac{d_1}{\\lambda_1 A} + \\dfrac{d_2}{\\lambda_2 A}$, $\\dot Q = \\Delta T / R$.",
        solution: `$R \\approx ${r2(Rt, 4)}\\ \\mathrm{K/W}$, $\\dot Q \\approx ${r2(P, 1)}\\ \\mathrm{W}$`,
      };
    },
  },
  {
    id: "uni-podpore",
    topics: uniTopicIds("Ravnotežje togega telesa", "Sile in momenti", "Upogib nosilcev"),
    gen(level, r, topicId) {
      const L = r.int(2, 10), a = r.dec(0.5, L - 0.5, 1), F = r.int(2, 50);
      const B = (F * a) / L, A = F - B;
      if (topicId.endsWith("upogib-nosilcev") || level === 3) {
        const M = A * a;
        return {
          text: `Prostoležeči nosilec dolžine $${L}\\ \\mathrm{m}$ je obremenjen s točkovno silo $${F}\\ \\mathrm{kN}$ na razdalji $${tx(a)}\\ \\mathrm{m}$ od leve podpore. Kolikšen je največji upogibni moment? Zaokroži ${decWord(2)}.`,
          answer: num(M, "kNm", 2, { unitAlternatives: ["kN m", "kN·m"] }),
          hint: "Najprej reakciji podpor iz ravnotežja momentov; največji moment je pod silo: $M = F_A a$.",
          solution: `$F_A \\approx ${r2(A, 3)}\\ \\mathrm{kN}$, $M_{\\max} = F_A a \\approx ${r2(M, 2)}\\ \\mathrm{kNm}$`,
        };
      }
      const askB = level === 1;
      return {
        text: `Prostoležeči nosilec dolžine $${L}\\ \\mathrm{m}$ (podpori A levo in B desno) je obremenjen s točkovno navpično silo $${F}\\ \\mathrm{kN}$ na razdalji $${tx(a)}\\ \\mathrm{m}$ od podpore A. Kolikšna je reakcija v podpori ${askB ? "B" : "A"}? Lastno težo zanemari, zaokroži ${decWord(2)}.`,
        answer: num(askB ? B : A, "kN", 2),
        hint: "Zapiši ravnotežje momentov okoli ene podpore, nato ravnotežje sil.",
        solution: `$\\sum M_A = 0$: $F_B = \\dfrac{F a}{L} \\approx ${r2(B, 2)}\\ \\mathrm{kN}$, $F_A = F - F_B \\approx ${r2(A, 2)}\\ \\mathrm{kN}$`,
      };
    },
  },
  {
    id: "uni-napetost",
    topics: uniTopicIds("Napetosti in deformacije", "Osna obremenitev", "Mehanske lastnosti materialov"),
    gen(level, r) {
      const d = r.int(6, 40), F = r.int(2, 120);
      const A = (Math.PI * d * d) / 4; // mm²
      const sigma = (F * 1000) / A; // MPa
      if (level <= 2) {
        return {
          text: `Okrogla palica s premerom $${d}\\ \\mathrm{mm}$ je obremenjena z natezno silo $${F}\\ \\mathrm{kN}$. Kolikšna je normalna napetost v MPa? Zaokroži ${decWord(1)}.`,
          answer: num(sigma, "MPa", 1),
          hint: "$\\sigma = \\dfrac{F}{A}$, $A = \\dfrac{\\pi d^2}{4}$; $1\\ \\mathrm{MPa} = 1\\ \\mathrm{N/mm^2}$.",
          solution: `$A \\approx ${r2(A, 2)}\\ \\mathrm{mm^2}$, $\\sigma \\approx ${r2(sigma, 1)}\\ \\mathrm{MPa}$`,
        };
      }
      const L = r.dec(0.5, 3, 1);
      const dl = (F * 1000 * L * 1000) / (210000 * A);
      return {
        text: `Jeklena palica ($E = 210\\ \\mathrm{GPa}$) dolžine $${tx(L)}\\ \\mathrm{m}$ in premera $${d}\\ \\mathrm{mm}$ je obremenjena z natezno silo $${F}\\ \\mathrm{kN}$. Za koliko se podaljša? Rezultat v mm zaokroži ${decWord(3)}.`,
        answer: num(dl, "mm", 3),
        hint: "$\\Delta l = \\dfrac{F l}{E A}$; pazi na enote (N, mm, MPa).",
        solution: `$\\Delta l = \\dfrac{${F * 1000}\\cdot ${L * 1000}}{210000\\cdot ${r2(A, 2)}} \\approx ${r2(dl, 3)}\\ \\mathrm{mm}$`,
      };
    },
  },
  {
    id: "uni-torzija",
    topics: uniTopicIds("Torzija"),
    gen(level, r) {
      const d = r.int(15, 80), T = r.int(50, 3000);
      const tau = (16 * T * 1000) / (Math.PI * d ** 3);
      return {
        text: `Polna okrogla gred s premerom $${d}\\ \\mathrm{mm}$ prenaša torzijski moment $${T}\\ \\mathrm{Nm}$. Kolikšna je največja strižna napetost v MPa? Zaokroži ${decWord(1)}.`,
        answer: num(tau, "MPa", 1),
        hint: "$\\tau_{\\max} = \\dfrac{T}{W_p}$, $W_p = \\dfrac{\\pi d^3}{16}$.",
        solution: `$\\tau_{\\max} = \\dfrac{16\\cdot ${T * 1000}}{\\pi\\cdot ${d}^3} \\approx ${r2(tau, 1)}\\ \\mathrm{MPa}$`,
      };
    },
  },
  {
    id: "uni-uklon",
    topics: uniTopicIds("Uklon"),
    gen(level, r) {
      const d = r.int(10, 60), L = r.dec(0.5, 4, 1);
      const I = (Math.PI * d ** 4) / 64; // mm⁴
      const Lk = level === 3 ? 2 * L : L;
      const F = (Math.PI ** 2 * 210000 * I) / (Lk * 1000) ** 2 / 1000;
      return {
        text: `Jeklena palica ($E = 210\\ \\mathrm{GPa}$) krožnega prereza s premerom $${d}\\ \\mathrm{mm}$ in dolžino $${tx(L)}\\ \\mathrm{m}$ je ${level === 3 ? "na enem koncu vpeta, na drugem prosta" : "na obeh koncih členkasto podprta"}. Kolikšna je Eulerjeva kritična sila v kN? Zaokroži ${decWord(2)}.`,
        answer: num(F, "kN", 2),
        hint: `$F_{kr} = \\dfrac{\\pi^2 E I}{l_u^2}$, $I = \\dfrac{\\pi d^4}{64}$, uklonska dolžina $l_u = ${level === 3 ? "2l" : "l"}$.`,
        solution: `$I \\approx ${r2(I, 0)}\\ \\mathrm{mm^4}$, $F_{kr} \\approx ${r2(F, 2)}\\ \\mathrm{kN}$`,
      };
    },
  },
  {
    id: "uni-izmenicni",
    topics: uniTopicIds("Izmenični tokovi"),
    gen(level, r) {
      const Rr = r.int(10, 200), L = r.int(10, 500), f = 50;
      const XL = 2 * Math.PI * f * L * 1e-3;
      const Z = Math.hypot(Rr, XL);
      if (level <= 2) {
        return {
          text: `Upor $${Rr}\\ \\Omega$ in tuljava z induktivnostjo $${L}\\ \\mathrm{mH}$ sta vezana zaporedno na izmenično napetost s frekvenco $50\\ \\mathrm{Hz}$. Kolikšna je impedanca? Zaokroži ${decWord(1)}.`,
          answer: num(Z, "Ω", 1, { unitAlternatives: ["ohm", "ohmov"] }),
          hint: "$X_L = \\omega L = 2\\pi f L$, $Z = \\sqrt{R^2 + X_L^2}$.",
          solution: `$X_L \\approx ${r2(XL, 2)}\\ \\Omega$, $Z \\approx ${r2(Z, 1)}\\ \\Omega$`,
        };
      }
      const U = 230;
      const P = (U / Z) ** 2 * Rr;
      return {
        text: `Upor $${Rr}\\ \\Omega$ in tuljava $${L}\\ \\mathrm{mH}$ sta zaporedno priključena na $230\\ \\mathrm{V}$, $50\\ \\mathrm{Hz}$. Kolikšna je delovna moč? Zaokroži ${decWord(1)}.`,
        answer: num(P, "W", 1),
        hint: "Tok $I = U/Z$; delovna moč se troši le na uporu: $P = I^2 R$.",
        solution: `$Z \\approx ${r2(Z, 2)}\\ \\Omega$, $I \\approx ${r2(U / Z, 3)}\\ \\mathrm{A}$, $P \\approx ${r2(P, 1)}\\ \\mathrm{W}$`,
      };
    },
  },
  {
    id: "uni-vzvod",
    topics: uniTopicIds("Fazni diagrami"),
    gen(level, r) {
      const ca = r.int(2, 20), cb = r.int(ca + 20, 90), c0 = r.int(ca + 2, cb - 2);
      const wa = ((cb - c0) / (cb - ca)) * 100;
      return {
        text: `Zlitina s ${c0} mas. % komponente B je pri dani temperaturi v dvofaznem področju. Faza $\\alpha$ vsebuje ${ca} mas. % B, faza $\\beta$ pa ${cb} mas. % B. Kolikšen je masni delež faze $\\alpha$ v %? Zaokroži ${decWord(1)}.`,
        answer: num(wa, "%", 1),
        hint: "Vzvodno pravilo: $w_\\alpha = \\dfrac{c_\\beta - c_0}{c_\\beta - c_\\alpha}$.",
        solution: `$w_\\alpha = \\dfrac{${cb} - ${c0}}{${cb} - ${ca}} \\approx ${r2(wa, 1)}\\ \\%$`,
      };
    },
  },

  // ------------------------------------------------------------ kemija
  {
    id: "uni-ph",
    topics: uniTopicIds("Kisline in baze"),
    gen(level, r) {
      const c = r.pick([0.1, 0.05, 0.02, 0.01, 0.005, 0.001, 0.25]);
      if (level === 1) {
        const strongBase = r.next() < 0.5;
        const pH = strongBase ? 14 + Math.log10(c) : -Math.log10(c);
        return {
          text: `Izračunaj pH raztopine ${strongBase ? "NaOH" : "HCl"} s koncentracijo $${tx(c)}\\ \\mathrm{mol/L}$ pri $25\\ ^\\circ\\mathrm{C}$. Zaokroži ${decWord(2)}.`,
          answer: num(pH, null, 2),
          hint: strongBase ? "Močna baza popolnoma disociira: $\\mathrm{pOH} = -\\log[\\mathrm{OH^-}]$, $\\mathrm{pH} = 14 - \\mathrm{pOH}$." : "Močna kislina popolnoma disociira: $\\mathrm{pH} = -\\log[\\mathrm{H_3O^+}]$.",
          solution: `$\\mathrm{pH} \\approx ${r2(pH, 2)}$`,
        };
      }
      const [name, Ka] = r.pick([["ocetne kisline", 1.8e-5], ["mravljinčne kisline", 1.8e-4], ["benzojske kisline", 6.3e-5], ["HF", 6.8e-4]]);
      if (level === 2) {
        const x = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * c)) / 2;
        const pH = -Math.log10(x);
        const approx = -Math.log10(Math.sqrt(Ka * c));
        return {
          text: `Izračunaj pH raztopine ${name} s koncentracijo $${tx(c)}\\ \\mathrm{mol/L}$ ($K_a = ${tx(Ka * 10 ** -Math.floor(Math.log10(Ka)))}\\cdot 10^{${Math.floor(Math.log10(Ka))}}$). Zaokroži ${decWord(2)}.`,
          answer: num(pH, null, 2, { alsoAccept: [approx] }),
          hint: "Za šibko kislino: $K_a = \\dfrac{x^2}{c - x}$; pri $x \\ll c$ je $x \\approx \\sqrt{K_a c}$.",
          solution: `$[\\mathrm{H_3O^+}] \\approx ${tx(x * 1e3, 4)}\\cdot 10^{-3}\\ \\mathrm{mol/L}$, $\\mathrm{pH} \\approx ${r2(pH, 2)}$`,
        };
      }
      const ca = r.dec(0.05, 0.5, 2), cb = r.dec(0.05, 0.5, 2);
      const pH = -Math.log10(Ka) + Math.log10(cb / ca);
      return {
        text: `Pufer vsebuje $${tx(ca)}\\ \\mathrm{mol/L}$ ${name} ($K_a = ${tx(Ka * 10 ** -Math.floor(Math.log10(Ka)))}\\cdot 10^{${Math.floor(Math.log10(Ka))}}$) in $${tx(cb)}\\ \\mathrm{mol/L}$ njene konjugirane baze (natrijeve soli). Izračunaj pH. Zaokroži ${decWord(2)}.`,
        answer: num(pH, null, 2),
        hint: "Henderson-Hasselbalchova enačba: $\\mathrm{pH} = \\mathrm{p}K_a + \\log\\dfrac{c_b}{c_a}$.",
        solution: `$\\mathrm{pH} = ${r2(-Math.log10(Ka), 2)} + \\log\\dfrac{${tx(cb)}}{${tx(ca)}} \\approx ${r2(pH, 2)}$`,
      };
    },
  },
  {
    id: "uni-titracija",
    topics: uniTopicIds("Kislinsko-bazne titracije"),
    gen(level, r) {
      const Va = r.pick([10, 20, 25]), cb = r.pick([0.1, 0.05, 0.2]), Vb = r.dec(5, 30, 2);
      const diprotic = level >= 2;
      const ca = (cb * Vb) / Va / (diprotic ? 2 : 1);
      return {
        text: `Za titracijo $${Va}{,}00\\ \\mathrm{mL}$ raztopine ${diprotic ? "$\\mathrm{H_2SO_4}$" : "HCl"} smo porabili $${tx(Vb)}\\ \\mathrm{mL}$ raztopine NaOH s koncentracijo $${tx(cb)}\\ \\mathrm{mol/L}$. Kolikšna je koncentracija kisline? Zaokroži ${decWord(4)}.`,
        answer: num(ca, "mol/L", 4, { unitAlternatives: ["mol/l", "M"] }),
        hint: diprotic ? "$\\mathrm{H_2SO_4 + 2\\,NaOH \\to Na_2SO_4 + 2\\,H_2O}$: $n(\\text{kisline}) = \\tfrac{1}{2}n(\\mathrm{NaOH})$." : "V ekvivalentni točki je $n(\\mathrm{HCl}) = n(\\mathrm{NaOH})$.",
        solution: `$c = \\dfrac{${tx(cb)}\\cdot ${tx(Vb)}}{${diprotic ? "2\\cdot " : ""}${Va}} \\approx ${r2(ca, 4)}\\ \\mathrm{mol/L}$`,
      };
    },
  },
  {
    id: "uni-topnost",
    topics: uniTopicIds("Topnost"),
    gen(level, r) {
      if (level <= 2) {
        const [name, Ksp] = r.pick([["AgCl", 1.8e-10], ["BaSO4", 1.1e-10], ["AgBr", 5.0e-13], ["CaCO3", 3.4e-9]]);
        const s = Math.sqrt(Ksp) * 1e6;
        return {
          text: `Izračunaj topnost $\\mathrm{${name.replace(/(\d)/g, "_$1")}}$ v čisti vodi v $\\mathrm{\\mu mol/L}$, če je $K_{sp} = ${tx(Ksp * 10 ** -Math.floor(Math.log10(Ksp)))}\\cdot 10^{${Math.floor(Math.log10(Ksp))}}$. Zaokroži ${decWord(2)}.`,
          answer: num(s, "µmol/L", 2, { unitAlternatives: MU }),
          hint: "Za sol tipa AB velja $K_{sp} = s^2$.",
          solution: `$s = \\sqrt{K_{sp}} \\approx ${r2(s, 2)}\\ \\mathrm{\\mu mol/L}$`,
        };
      }
      const [name, Ksp] = r.pick([["CaF2", 3.9e-11], ["Mg(OH)2", 5.6e-12], ["PbCl2", 1.7e-5]]);
      const s = Math.cbrt(Ksp / 4) * 1e3;
      return {
        text: `Izračunaj topnost $\\mathrm{${name.replace(/(\d)/g, "_$1")}}$ v čisti vodi v mmol/L, če je $K_{sp} = ${tx(Ksp * 10 ** -Math.floor(Math.log10(Ksp)))}\\cdot 10^{${Math.floor(Math.log10(Ksp))}}$. Zaokroži ${decWord(3)}.`,
        answer: num(s, "mmol/L", 3, { unitAlternatives: ["mmol/l"] }),
        hint: "Za sol tipa AB₂ je $K_{sp} = s\\,(2s)^2 = 4s^3$.",
        solution: `$s = \\sqrt[3]{K_{sp}/4} \\approx ${r2(s, 3)}\\ \\mathrm{mmol/L}$`,
      };
    },
  },
  {
    id: "uni-stehiometrija",
    topics: uniTopicIds("Stehiometrija"),
    gen(level, r) {
      const m = r.dec(5, 200, 1);
      const eta = level >= 2 ? r.pick([65, 72, 80, 88, 95]) : 100;
      const mCO2 = ((m / 100.09) * 44.01 * eta) / 100;
      return {
        text: `Pri žarjenju razpade $${tx(m)}\\ \\mathrm{g}$ $\\mathrm{CaCO_3}$ ($M = 100{,}09\\ \\mathrm{g/mol}$) na $\\mathrm{CaO}$ in $\\mathrm{CO_2}$ ($M = 44{,}01\\ \\mathrm{g/mol}$)${eta < 100 ? `, izkoristek reakcije je $${eta}\\ \\%$` : ""}. Koliko gramov $\\mathrm{CO_2}$ nastane? Zaokroži ${decWord(2)}.`,
        answer: num(mCO2, "g", 2),
        hint: "$\\mathrm{CaCO_3 \\to CaO + CO_2}$: razmerje množin je 1 : 1; $n = m/M$." + (eta < 100 ? " Na koncu upoštevaj izkoristek." : ""),
        solution: `$n(\\mathrm{CaCO_3}) = ${r2(m / 100.09, 4)}\\ \\mathrm{mol}$, $m(\\mathrm{CO_2}) \\approx ${r2(mCO2, 2)}\\ \\mathrm{g}$`,
      };
    },
  },
  {
    id: "uni-raztopine",
    topics: uniTopicIds("Raztopine"),
    gen(level, r) {
      if (level === 1) {
        const c1 = r.pick([1, 2, 0.5, 6, 12]), c2 = r.pick([0.1, 0.05, 0.2, 0.25]), V2 = r.pick([100, 250, 500, 1000]);
        const V1 = (c2 * V2) / c1;
        return {
          text: `Koliko mL raztopine s koncentracijo $${tx(c1)}\\ \\mathrm{mol/L}$ potrebujemo za pripravo $${V2}\\ \\mathrm{mL}$ raztopine s koncentracijo $${tx(c2)}\\ \\mathrm{mol/L}$? Zaokroži ${decWord(1)}.`,
          answer: num(V1, "mL", 1, { unitAlternatives: ["ml"] }),
          hint: "Pri redčenju se množina topljenca ohrani: $c_1 V_1 = c_2 V_2$.",
          solution: `$V_1 = \\dfrac{${tx(c2)}\\cdot ${V2}}{${tx(c1)}} \\approx ${r2(V1, 1)}\\ \\mathrm{mL}$`,
        };
      }
      const [name, M, i] = r.pick([["glukoze", 180.16, 1], ["sečnine", 60.06, 1], ["NaCl", 58.44, 2], ["$\\mathrm{CaCl_2}$", 110.98, 3]]);
      const m = r.dec(1, 30, 1), mw = r.pick([100, 200, 250, 500]);
      const dT = (1.86 * i * (m / M)) / (mw / 1000);
      return {
        text: `V $${mw}\\ \\mathrm{g}$ vode raztopimo $${tx(m)}\\ \\mathrm{g}$ ${name} ($M = ${tx(M)}\\ \\mathrm{g/mol}$). Za koliko se zniža tališče? $K_f(\\mathrm{H_2O}) = 1{,}86\\ \\mathrm{K\\,kg/mol}$; ${i > 1 ? "elektrolit popolnoma disociira" : "snov ne disociira"}. Zaokroži ${decWord(2)}.`,
        answer: num(dT, "K", 2, { unitAlternatives: ["°c"] }),
        hint: "$\\Delta T_f = i\\,K_f\\,b$, molalnost $b = n/m_{\\text{topila}}$ (v kg).",
        solution: `$b \\approx ${r2(m / M / (mw / 1000), 4)}\\ \\mathrm{mol/kg}$, $i = ${i}$, $\\Delta T_f \\approx ${r2(dT, 2)}\\ \\mathrm{K}$`,
      };
    },
  },
  {
    id: "uni-termokemija",
    topics: uniTopicIds("Termokemija"),
    gen(level, r) {
      const [name, M, dH] = r.pick([["metana", 16.04, -890.3], ["etanola", 46.07, -1366.8], ["propana", 44.1, -2219.9], ["glukoze", 180.16, -2803]]);
      const m = r.dec(1, 100, 1);
      const Q = (m / M) * -dH;
      return {
        text: `Standardna sežigna entalpija ${name} je $${tx(dH)}\\ \\mathrm{kJ/mol}$ ($M = ${tx(M)}\\ \\mathrm{g/mol}$). Koliko toplote se sprosti pri popolnem sežigu $${tx(m)}\\ \\mathrm{g}$ te snovi? Rezultat v kJ zaokroži ${decWord(1)}.`,
        answer: num(Q, "kJ", 1, { alsoAccept: [-Q] }),
        hint: "$Q = n\\,|\\Delta_c H|$, $n = m/M$.",
        solution: `$n \\approx ${r2(m / M, 4)}\\ \\mathrm{mol}$, $Q \\approx ${r2(Q, 1)}\\ \\mathrm{kJ}$`,
      };
    },
  },
  {
    id: "uni-gibbs",
    topics: uniTopicIds("Gibbsova energija in kemijsko ravnotežje"),
    gen(level, r) {
      const T = r.pick([298, 350, 400, 500, 600]);
      if (level <= 2) {
        const dH = r.int(-150, 150), dS = r.int(-200, 250);
        const dG = dH - (T * dS) / 1000;
        return {
          text: `Za reakcijo je $\\Delta H^\\circ = ${dH}\\ \\mathrm{kJ/mol}$ in $\\Delta S^\\circ = ${dS}\\ \\mathrm{J/(mol\\,K)}$. Izračunaj $\\Delta G^\\circ$ pri $${T}\\ \\mathrm{K}$ v kJ/mol. Zaokroži ${decWord(1)}.`,
          answer: num(dG, "kJ/mol", 1),
          hint: "$\\Delta G = \\Delta H - T\\Delta S$; pazi, da sta $\\Delta H$ in $\\Delta S$ v istih enotah (kJ in J).",
          solution: `$\\Delta G^\\circ = ${dH} - ${T}\\cdot ${tx(dS / 1000, 3)} \\approx ${r2(dG, 1)}\\ \\mathrm{kJ/mol}$ (${dG < 0 ? "spontana" : "nespontana"} pri standardnih pogojih)`,
        };
      }
      const dG = r.dec(-8, 8, 1);
      const K = Math.exp((-dG * 1000) / (R * T));
      return {
        text: `Pri $${T}\\ \\mathrm{K}$ je $\\Delta G^\\circ = ${tx(dG)}\\ \\mathrm{kJ/mol}$. Izračunaj ravnotežno konstanto $K$. Zaokroži ${decWord(3)}.`,
        answer: num(K, null, 3),
        hint: "$\\Delta G^\\circ = -RT\\ln K$, torej $K = e^{-\\Delta G^\\circ/(RT)}$.",
        solution: `$K = e^{-${tx(dG * 1000)}/(8{,}314\\cdot ${T})} \\approx ${r2(K, 3)}$`,
      };
    },
  },
  {
    id: "uni-fazna",
    topics: uniTopicIds("Fazna ravnotežja", "Termodinamske lastnosti čistih snovi"),
    gen(level, r) {
      const [name, Tb, dHv] = r.pick([["voda", 373.15, 40.7], ["etanol", 351.4, 38.6], ["benzen", 353.2, 30.8], ["aceton", 329.2, 29.1]]);
      const T = Tb - r.int(10, 40);
      const p = 101.325 * Math.exp(((-dHv * 1000) / R) * (1 / T - 1 / Tb));
      return {
        text: `${name[0].toUpperCase() + name.slice(1)} vre pri $${tx(Tb)}\\ \\mathrm{K}$ in $101{,}325\\ \\mathrm{kPa}$, izparilna entalpija je $${tx(dHv)}\\ \\mathrm{kJ/mol}$. Oceni parni tlak pri $${tx(T)}\\ \\mathrm{K}$ v kPa. Zaokroži ${decWord(1)}.`,
        answer: num(p, "kPa", 1),
        hint: "Clausius-Clapeyronova enačba: $\\ln\\dfrac{p_2}{p_1} = -\\dfrac{\\Delta H_{izp}}{R}\\left(\\dfrac{1}{T_2} - \\dfrac{1}{T_1}\\right)$.",
        solution: `$p \\approx ${r2(p, 1)}\\ \\mathrm{kPa}$`,
      };
    },
  },
  {
    id: "uni-realni-plin",
    topics: uniTopicIds("Realni plini"),
    gen(level, r) {
      const n = r.dec(0.5, 3, 1), V = r.dec(0.5, 5, 1), T = r.int(280, 500);
      const a = 0.364, b = 4.27e-5; // CO2
      const Vm = V * 1e-3;
      const p = ((n * R * T) / (Vm - n * b) - (a * n * n) / (Vm * Vm)) / 1000;
      return {
        text: `Izračunaj tlak $${tx(n)}\\ \\mathrm{mol}$ $\\mathrm{CO_2}$ v posodi s prostornino $${tx(V)}\\ \\mathrm{L}$ pri $${T}\\ \\mathrm{K}$ z van der Waalsovo enačbo ($a = 0{,}364\\ \\mathrm{Pa\\,m^6/mol^2}$, $b = 4{,}27\\cdot 10^{-5}\\ \\mathrm{m^3/mol}$). Rezultat v kPa zaokroži ${decWord(0)}.`,
        answer: num(p, "kPa", 0),
        hint: "$p = \\dfrac{nRT}{V - nb} - \\dfrac{a n^2}{V^2}$ (vse v enotah SI).",
        solution: `$p \\approx ${r2(p, 0)}\\ \\mathrm{kPa}$ (idealni plin bi dal $${r2((n * R * T) / Vm / 1000, 0)}\\ \\mathrm{kPa}$)`,
      };
    },
  },
  {
    id: "uni-kinetika",
    topics: uniTopicIds("Kemijska kinetika", "Reakcijska hitrost in stehiometrija"),
    gen(level, r) {
      const k = r.pick([0.01, 0.02, 0.05, 0.1, 0.15, 0.3]), c0 = r.pick([0.1, 0.2, 0.5, 1, 2]), t = r.int(2, 30);
      if (level === 1) {
        return {
          text: `Reakcija prvega reda ima hitrostno konstanto $k = ${tx(k)}\\ \\mathrm{min^{-1}}$. Kolikšen je njen razpolovni čas? Zaokroži ${decWord(1)}.`,
          answer: num(Math.log(2) / k, "min", 1),
          hint: "Za reakcijo prvega reda je $t_{1/2} = \\dfrac{\\ln 2}{k}$, neodvisno od začetne koncentracije.",
          solution: `$t_{1/2} \\approx ${r2(Math.log(2) / k, 1)}\\ \\mathrm{min}$`,
        };
      }
      if (level === 2) {
        const c = c0 * Math.exp(-k * t);
        return {
          text: `Začetna koncentracija reaktanta v reakciji prvega reda je $${tx(c0)}\\ \\mathrm{mol/L}$, $k = ${tx(k)}\\ \\mathrm{min^{-1}}$. Kolikšna je koncentracija po $${t}\\ \\mathrm{min}$? Zaokroži ${decWord(4)}.`,
          answer: num(c, "mol/L", 4, { unitAlternatives: ["mol/l", "M"] }),
          hint: "$c = c_0 e^{-kt}$.",
          solution: `$c = ${tx(c0)}\\,e^{-${tx(k * t)}} \\approx ${r2(c, 4)}\\ \\mathrm{mol/L}$`,
        };
      }
      const k2 = r.pick([0.05, 0.1, 0.2, 0.5]);
      const c = 1 / (1 / c0 + k2 * t);
      return {
        text: `Reakcija drugega reda ($v = k[\\mathrm{A}]^2$) ima $k = ${tx(k2)}\\ \\mathrm{L/(mol\\,min)}$, začetna koncentracija je $${tx(c0)}\\ \\mathrm{mol/L}$. Kolikšna je koncentracija po $${t}\\ \\mathrm{min}$? Zaokroži ${decWord(4)}.`,
        answer: num(c, "mol/L", 4, { unitAlternatives: ["mol/l", "M"] }),
        hint: "Integrirani zakon drugega reda: $\\dfrac{1}{c} = \\dfrac{1}{c_0} + kt$.",
        solution: `$\\dfrac{1}{c} = ${tx(1 / c0)} + ${tx(k2 * t)}$, $c \\approx ${r2(c, 4)}\\ \\mathrm{mol/L}$`,
      };
    },
  },
  {
    id: "uni-arrhenius",
    topics: uniTopicIds("Arrheniusova enačba"),
    gen(level, r) {
      const Ea = r.int(30, 120), T1 = r.pick([290, 298, 300, 310]), dT = r.pick([10, 20, 30, 50]);
      const ratio = Math.exp(((Ea * 1000) / R) * (1 / T1 - 1 / (T1 + dT)));
      if (level <= 2) {
        return {
          text: `Aktivacijska energija reakcije je $${Ea}\\ \\mathrm{kJ/mol}$. Kolikokrat se poveča hitrostna konstanta, ko temperaturo zvišamo s $${T1}\\ \\mathrm{K}$ na $${T1 + dT}\\ \\mathrm{K}$? Zaokroži ${decWord(2)}.`,
          answer: num(ratio, null, 2),
          hint: "$\\ln\\dfrac{k_2}{k_1} = \\dfrac{E_a}{R}\\left(\\dfrac{1}{T_1} - \\dfrac{1}{T_2}\\right)$.",
          solution: `$\\dfrac{k_2}{k_1} \\approx ${r2(ratio, 2)}$`,
        };
      }
      const Eaj = (Math.log(ratio) * R) / (1 / T1 - 1 / (T1 + dT)) / 1000;
      return {
        text: `Hitrostna konstanta se pri segrevanju s $${T1}\\ \\mathrm{K}$ na $${T1 + dT}\\ \\mathrm{K}$ poveča za faktor $${r2(ratio, 3)}$. Izračunaj aktivacijsko energijo v kJ/mol. Zaokroži ${decWord(1)}.`,
        answer: num(Eaj, "kJ/mol", 1, { alsoAccept: [Ea] }),
        hint: "Iz Arrheniusove enačbe izrazi $E_a = \\dfrac{R\\ln(k_2/k_1)}{1/T_1 - 1/T_2}$.",
        solution: `$E_a \\approx ${r2(Eaj, 1)}\\ \\mathrm{kJ/mol}$`,
      };
    },
  },
  {
    id: "uni-nernst",
    topics: uniTopicIds("Elektrokemija", "Elektroanalizne metode", "Redoks reakcije in elektrokemija"),
    gen(level, r) {
      const [ion, E0, n] = r.pick([["Cu^{2+}/Cu", 0.34, 2], ["Zn^{2+}/Zn", -0.76, 2], ["Ag^{+}/Ag", 0.8, 1], ["Fe^{2+}/Fe", -0.44, 2], ["Ni^{2+}/Ni", -0.25, 2]]);
      const c = r.pick([1, 0.1, 0.01, 0.001, 0.5, 0.05]);
      const Ev = E0 + (0.05916 / n) * Math.log10(c);
      if (level <= 2) {
        return {
          text: `Izračunaj elektrodni potencial elektrode $\\mathrm{${ion}}$ ($E^\\circ = ${tx(E0)}\\ \\mathrm{V}$) pri koncentraciji ionov $${tx(c)}\\ \\mathrm{mol/L}$ in $25\\ ^\\circ\\mathrm{C}$. Zaokroži ${decWord(3)}.`,
          answer: num(Ev, "V", 3),
          hint: "Nernstova enačba: $E = E^\\circ + \\dfrac{0{,}05916\\ \\mathrm{V}}{n}\\log c(\\text{ion})$.",
          solution: `$E = ${tx(E0)} + \\dfrac{0{,}05916}{${n}}\\log ${tx(c)} \\approx ${r2(Ev, 3)}\\ \\mathrm{V}$`,
        };
      }
      const cz = r.pick([0.01, 0.1, 1]), cc = r.pick([0.01, 0.1, 1, 0.5]);
      const Ecell = 0.34 - -0.76 - (0.05916 / 2) * Math.log10(cz / cc);
      return {
        text: `Izračunaj napetost Daniellovega člena $\\mathrm{Zn|Zn^{2+}}(${tx(cz)}\\ \\mathrm{M})\\|\\mathrm{Cu^{2+}}(${tx(cc)}\\ \\mathrm{M})|\\mathrm{Cu}$ pri $25\\ ^\\circ\\mathrm{C}$ ($E^\\circ(\\mathrm{Cu}) = 0{,}34\\ \\mathrm{V}$, $E^\\circ(\\mathrm{Zn}) = -0{,}76\\ \\mathrm{V}$). Zaokroži ${decWord(3)}.`,
        answer: num(Ecell, "V", 3),
        hint: "$E = E^\\circ_{\\text{člena}} - \\dfrac{0{,}05916}{n}\\log Q$, $Q = \\dfrac{[\\mathrm{Zn^{2+}}]}{[\\mathrm{Cu^{2+}}]}$.",
        solution: `$E = 1{,}10 - 0{,}02958\\log\\dfrac{${tx(cz)}}{${tx(cc)}} \\approx ${r2(Ecell, 3)}\\ \\mathrm{V}$`,
      };
    },
  },
  {
    id: "uni-beer",
    topics: uniTopicIds("Spektrometrične metode"),
    gen(level, r) {
      const A = r.dec(0.05, 1.2, 3), eps = r.int(10, 250) * 100, l = level === 1 ? 1 : r.pick([0.5, 1, 2, 5]);
      const c = (A / (eps * l)) * 1e6;
      return {
        text: `Absorbanca raztopine v kiveti z debelino $${tx(l)}\\ \\mathrm{cm}$ je $${tx(A)}$, molarni absorpcijski koeficient je $${eps}\\ \\mathrm{L/(mol\\,cm)}$. Kolikšna je koncentracija v $\\mathrm{\\mu mol/L}$? Zaokroži ${decWord(2)}.`,
        answer: num(c, "µmol/L", 2, { unitAlternatives: MU }),
        hint: "Beer-Lambertov zakon: $A = \\varepsilon\\,l\\,c$.",
        solution: `$c = \\dfrac{A}{\\varepsilon l} \\approx ${r2(c, 2)}\\ \\mathrm{\\mu mol/L}$`,
      };
    },
  },
  {
    id: "uni-raoult",
    topics: uniTopicIds("Fazna ravnotežja zmesi", "Destilacija"),
    gen(level, r) {
      const pA = r.int(20, 100), pB = r.int(5, pA - 5), x = r.dec(0.1, 0.9, 2);
      const p = x * pA + (1 - x) * pB;
      if (level <= 2) {
        return {
          text: `Idealna tekoča zmes vsebuje molski delež $x_A = ${tx(x)}$ komponente A. Parna tlaka čistih komponent sta $p_A^* = ${pA}\\ \\mathrm{kPa}$ in $p_B^* = ${pB}\\ \\mathrm{kPa}$. Kolikšen je skupni parni tlak? Zaokroži ${decWord(2)}.`,
          answer: num(p, "kPa", 2),
          hint: "Raoultov zakon: $p = x_A p_A^* + x_B p_B^*$.",
          solution: `$p = ${tx(x)}\\cdot ${pA} + ${tx(1 - x)}\\cdot ${pB} \\approx ${r2(p, 2)}\\ \\mathrm{kPa}$`,
        };
      }
      const y = (x * pA) / p;
      return {
        text: `Idealna zmes ima $x_A = ${tx(x)}$, $p_A^* = ${pA}\\ \\mathrm{kPa}$, $p_B^* = ${pB}\\ \\mathrm{kPa}$. Kolikšen je molski delež A v pari nad zmesjo? Zaokroži ${decWord(3)}.`,
        answer: num(y, null, 3),
        hint: "Najprej skupni tlak po Raoultu, nato Dalton: $y_A = \\dfrac{x_A p_A^*}{p}$.",
        solution: `$p \\approx ${r2(p, 3)}\\ \\mathrm{kPa}$, $y_A \\approx ${r2(y, 3)}$`,
      };
    },
  },
  {
    id: "uni-reaktor",
    topics: uniTopicIds("Pretočni reaktorji", "Šaržni reaktor"),
    gen(level, r, topicId) {
      const k = r.pick([0.05, 0.1, 0.2, 0.4, 0.5]);
      if (topicId.endsWith("sarzni-reaktor")) {
        const X = r.pick([50, 75, 80, 90, 95, 99]);
        const t = -Math.log(1 - X / 100) / k;
        return {
          text: `V izotermnem šaržnem reaktorju poteka reakcija prvega reda s $k = ${tx(k)}\\ \\mathrm{min^{-1}}$. Koliko časa potrebujemo za konverzijo $${X}\\ \\%$? Zaokroži ${decWord(1)}.`,
          answer: num(t, "min", 1),
          hint: "Za reakcijo prvega reda v šaržnem reaktorju: $t = -\\dfrac{\\ln(1 - X)}{k}$.",
          solution: `$t = -\\dfrac{\\ln(1 - ${tx(X / 100)})}{${tx(k)}} \\approx ${r2(t, 1)}\\ \\mathrm{min}$`,
        };
      }
      const tau = r.int(2, 40);
      const cstr = level !== 2;
      const X = (cstr ? (k * tau) / (1 + k * tau) : 1 - Math.exp(-k * tau)) * 100;
      return {
        text: `V ${cstr ? "idealnem mešalnem (CSTR)" : "idealnem cevnem (PFR)"} reaktorju poteka izotermna reakcija prvega reda s $k = ${tx(k)}\\ \\mathrm{min^{-1}}$, zadrževalni čas je $${tau}\\ \\mathrm{min}$. Kolikšna je konverzija v %? Zaokroži ${decWord(1)}.`,
        answer: num(X, "%", 1),
        hint: cstr ? "Za CSTR in reakcijo prvega reda: $X = \\dfrac{k\\tau}{1 + k\\tau}$." : "Za PFR in reakcijo prvega reda: $X = 1 - e^{-k\\tau}$.",
        solution: `$k\\tau = ${tx(k * tau)}$, $X \\approx ${r2(X, 1)}\\ \\%$`,
      };
    },
  },
  {
    id: "uni-michaelis",
    topics: uniTopicIds("Encimska kinetika"),
    gen(level, r) {
      const Vmax = r.int(10, 200), Km = r.dec(0.1, 5, 1), S = r.dec(0.1, 10, 1);
      if (level <= 2) {
        const v = (Vmax * S) / (Km + S);
        return {
          text: `Encim ima $v_{\\max} = ${Vmax}\\ \\mathrm{\\mu mol/min}$ in $K_M = ${tx(Km)}\\ \\mathrm{mmol/L}$. Kolikšna je začetna hitrost pri koncentraciji substrata $${tx(S)}\\ \\mathrm{mmol/L}$? Zaokroži ${decWord(2)}.`,
          answer: num(v, "µmol/min", 2, { unitAlternatives: ["umol/min", "μmol/min"] }),
          hint: "Michaelis-Mentenova enačba: $v = \\dfrac{v_{\\max}[S]}{K_M + [S]}$.",
          solution: `$v = \\dfrac{${Vmax}\\cdot ${tx(S)}}{${tx(Km)} + ${tx(S)}} \\approx ${r2(v, 2)}\\ \\mathrm{\\mu mol/min}$`,
        };
      }
      const f = r.pick([0.25, 0.5, 0.75, 0.9]);
      const Sx = (f * Km) / (1 - f);
      return {
        text: `Pri kateri koncentraciji substrata doseže encim s $K_M = ${tx(Km)}\\ \\mathrm{mmol/L}$ $${f * 100}\\ \\%$ največje hitrosti? Rezultat v mmol/L zaokroži ${decWord(2)}.`,
        answer: num(Sx, "mmol/L", 2, { unitAlternatives: ["mmol/l"] }),
        hint: "Iz $\\dfrac{v}{v_{\\max}} = \\dfrac{[S]}{K_M + [S]}$ izrazi $[S]$.",
        solution: `$[S] = \\dfrac{f K_M}{1 - f} \\approx ${r2(Sx, 2)}\\ \\mathrm{mmol/L}$`,
      };
    },
  },

  // ------------------------------------------------------------ dodatne teme
  {
    id: "uni-nenasicenost",
    topics: uniTopicIds("Zgradba in vezi organskih molekul", "Določanje strukture iz spektrov", "Spektroskopija organskih spojin"),
    gen(level, r) {
      const c = r.int(2, level === 1 ? 6 : 12);
      const n = level === 1 ? 0 : r.int(0, 2);
      const x = level === 3 ? r.int(0, 2) : 0;
      const o = r.int(0, 3);
      const dbe = r.int(0, Math.min(6, c));
      const h = 2 * c + 2 + n - x - 2 * dbe;
      if (h < 1) return null;
      const f = `C_{${c}}H_{${h}}${n ? `N${n > 1 ? `_{${n}}` : ""}` : ""}${o ? `O${o > 1 ? `_{${o}}` : ""}` : ""}${x ? `Cl${x > 1 ? `_{${x}}` : ""}` : ""}`;
      return {
        text: `Izračunaj stopnjo nenasičenosti (število obročev in π-vezi) spojine z molekulsko formulo $\\mathrm{${f}}$.`,
        answer: num(dbe, null, 0),
        hint: "$\\mathrm{SN} = \\dfrac{2C + 2 + N - H - X}{2}$; kisik ne vpliva, halogeni štejejo kot vodik.",
        solution: `$\\mathrm{SN} = \\dfrac{2\\cdot ${c} + 2 + ${n} - ${h} - ${x}}{2} = ${dbe}$`,
      };
    },
  },
  {
    id: "uni-kristal",
    topics: uniTopicIds("Kristalne strukture", "Kristalna zgradba kovin"),
    gen(level, r) {
      const NA = 6.022e23;
      const fcc = [["baker", 361.5, 63.55], ["aluminij", 404.9, 26.98], ["nikelj", 352.4, 58.69], ["srebro", 408.6, 107.87]];
      const bcc = [["železo (α)", 286.7, 55.85], ["natrij", 429.1, 22.99], ["krom", 288.5, 52.0], ["volfram", 316.5, 183.84]];
      const isFcc = level !== 2;
      const [name, a, M] = r.pick(isFcc ? fcc : bcc);
      const Z = isFcc ? 4 : 2;
      if (level === 3) {
        const rr = (a * Math.SQRT2) / 4;
        return {
          text: `${name[0].toUpperCase() + name.slice(1)} kristalizira v ploskovno centrirani kubični mreži z mrežnim parametrom $a = ${tx(a)}\\ \\mathrm{pm}$. Kolikšen je kovinski polmer atoma? Zaokroži ${decWord(1)}.`,
          answer: num(rr, "pm", 1),
          hint: "V ploskovno centrirani mreži se atomi dotikajo vzdolž diagonale ploskve: $4r = a\\sqrt{2}$.",
          solution: `$r = \\dfrac{a\\sqrt{2}}{4} \\approx ${r2(rr, 1)}\\ \\mathrm{pm}$`,
        };
      }
      const rho = (Z * M) / (NA * (a * 1e-10) ** 3);
      return {
        text: `${name[0].toUpperCase() + name.slice(1)} ($M = ${tx(M)}\\ \\mathrm{g/mol}$) kristalizira v ${isFcc ? "ploskovno" : "prostorsko"} centrirani kubični mreži z mrežnim parametrom $a = ${tx(a)}\\ \\mathrm{pm}$. Izračunaj gostoto v $\\mathrm{g/cm^3}$. $N_A = 6{,}022\\cdot 10^{23}\\ \\mathrm{mol^{-1}}$. Zaokroži ${decWord(2)}.`,
        answer: num(rho, "g/cm³", 2, { unitAlternatives: ["g/cm3", "g cm-3"] }),
        hint: `V osnovni celici sta ${isFcc ? "4 atomi" : "2 atoma"}: $\\rho = \\dfrac{Z M}{N_A a^3}$ ($1\\ \\mathrm{pm} = 10^{-10}\\ \\mathrm{cm}$).`,
        solution: `$\\rho = \\dfrac{${Z}\\cdot ${tx(M)}}{6{,}022\\cdot 10^{23}\\cdot (${tx(a)}\\cdot 10^{-10})^3} \\approx ${r2(rho, 2)}\\ \\mathrm{g/cm^3}$`,
      };
    },
  },
  {
    id: "uni-bragg",
    topics: uniTopicIds("Rentgenska difrakcija"),
    gen(level, r) {
      const lam = r.pick([154.06, 70.93, 179.0]);
      const th = r.dec(10, 40, 2);
      const n = level === 1 ? 1 : r.int(1, 2);
      const d = (n * lam) / (2 * Math.sin(th * DEG));
      if (level === 3) {
        const [h, k, l] = r.pick([[1, 1, 1], [2, 0, 0], [2, 2, 0], [3, 1, 1], [1, 1, 0]]);
        const a = d * Math.sqrt(h * h + k * k + l * l);
        return {
          text: `Odboj prvega reda od ravnin $(${h}${k}${l})$ kubičnega kristala opazimo pri kotu $\\theta = ${tx(th)}^\\circ$; valovna dolžina rentgenske svetlobe je $${tx(lam)}\\ \\mathrm{pm}$. Kolikšen je mrežni parameter $a$? Zaokroži ${decWord(1)}.`,
          answer: num((lam / (2 * Math.sin(th * DEG))) * Math.sqrt(h * h + k * k + l * l), "pm", 1),
          hint: "Braggov zakon $n\\lambda = 2d\\sin\\theta$, za kubično mrežo $d_{hkl} = \\dfrac{a}{\\sqrt{h^2 + k^2 + l^2}}$.",
          solution: `$d = \\dfrac{\\lambda}{2\\sin\\theta}$, $a = d\\sqrt{${h * h + k * k + l * l}} \\approx ${r2((lam / (2 * Math.sin(th * DEG))) * Math.sqrt(h * h + k * k + l * l), 1)}\\ \\mathrm{pm}$`,
        };
      }
      return {
        text: `Rentgenska svetloba z valovno dolžino $${tx(lam)}\\ \\mathrm{pm}$ se odbije v ${n}. redu pri kotu $\\theta = ${tx(th)}^\\circ$. Kolikšna je razdalja med mrežnimi ravninami? Zaokroži ${decWord(1)}.`,
        answer: num(d, "pm", 1),
        hint: "Braggov zakon: $n\\lambda = 2d\\sin\\theta$.",
        solution: `$d = \\dfrac{${n}\\cdot ${tx(lam)}}{2\\sin ${tx(th)}^\\circ} \\approx ${r2(d, 1)}\\ \\mathrm{pm}$`,
      };
    },
  },
  {
    id: "uni-snovne-bilance",
    topics: uniTopicIds("Snovne bilance"),
    gen(level, r) {
      if (level === 1) {
        const m1 = r.int(50, 500), w1 = r.int(5, 40), m2 = r.int(50, 500), w2 = r.int(w1 + 5, 80);
        const w = ((m1 * w1 + m2 * w2) / (m1 + m2));
        return {
          text: `Zmešamo tok $${m1}\\ \\mathrm{kg/h}$ raztopine z masnim deležem soli $${w1}\\ \\%$ in tok $${m2}\\ \\mathrm{kg/h}$ z masnim deležem $${w2}\\ \\%$. Kolikšen je masni delež soli v zmesi? Rezultat v % zaokroži ${decWord(2)}.`,
          answer: num(w, "%", 2),
          hint: "Zapiši celotno bilanco in bilanco soli: $\\dot m_3 = \\dot m_1 + \\dot m_2$, $\\dot m_3 w_3 = \\dot m_1 w_1 + \\dot m_2 w_2$.",
          solution: `$w_3 = \\dfrac{${m1}\\cdot ${w1} + ${m2}\\cdot ${w2}}{${m1 + m2}} \\approx ${r2(w, 2)}\\ \\%$`,
        };
      }
      const F = r.int(500, 5000), wF = r.int(3, 20), wP = r.int(wF + 10, 65);
      const V = F * (1 - wF / wP);
      return {
        text: `V uparilnik vstopa $${F}\\ \\mathrm{kg/h}$ raztopine z masnim deležem topljenca $${wF}\\ \\%$. Raztopino koncentriramo na $${wP}\\ \\%$. Koliko vode na uro odparimo? Zaokroži ${decWord(1)}.`,
        answer: num(V, "kg/h", 1),
        hint: "Topljenec ne izpareva: $\\dot m_F w_F = \\dot m_P w_P$; voda je razlika $\\dot m_F - \\dot m_P$.",
        solution: `$\\dot m_P = \\dfrac{${F}\\cdot ${wF}}{${wP}} \\approx ${r2((F * wF) / wP, 2)}\\ \\mathrm{kg/h}$, $\\dot m_V \\approx ${r2(V, 1)}\\ \\mathrm{kg/h}$`,
      };
    },
  },
  {
    id: "uni-energijske-bilance",
    topics: uniTopicIds("Energijske bilance", "Konvekcija in prestop toplote"),
    gen(level, r, topicId) {
      if (topicId.endsWith("konvekcija-in-prestop-toplote")) {
        const h = r.int(5, 500), A = r.dec(0.2, 10, 1), dT = r.int(5, 80);
        const P = h * A * dT;
        return {
          text: `Površina s ploščino $${tx(A)}\\ \\mathrm{m^2}$ ima temperaturo za $${dT}\\ \\mathrm{K}$ višjo od okoliškega fluida, toplotna prestopnost je $${h}\\ \\mathrm{W/(m^2\\,K)}$. Kolikšen toplotni tok oddaja? Zaokroži ${decWord(1)}.`,
          answer: num(P, "W", 1),
          hint: "Newtonov zakon ohlajanja: $\\dot Q = \\alpha A \\Delta T$.",
          solution: `$\\dot Q = ${h}\\cdot ${tx(A)}\\cdot ${dT} \\approx ${r2(P, 1)}\\ \\mathrm{W}$`,
        };
      }
      const m = r.dec(0.1, 5, 2), cp = r.pick([4.18, 1.005, 2.1, 3.8]), T1 = r.int(10, 40), T2 = T1 + r.int(10, 60);
      const Q = m * cp * (T2 - T1);
      return {
        text: `Tok tekočine $${tx(m)}\\ \\mathrm{kg/s}$ ($c_p = ${tx(cp)}\\ \\mathrm{kJ/(kg\\,K)}$) segrejemo s $${T1}\\ ^\\circ\\mathrm{C}$ na $${T2}\\ ^\\circ\\mathrm{C}$. Kolikšen toplotni tok moramo dovajati? Rezultat v kW zaokroži ${decWord(1)}.`,
        answer: num(Q, "kW", 1),
        hint: "Za odprt sistem brez dela in sprememb kinetične ter potencialne energije: $\\dot Q = \\dot m c_p \\Delta T$.",
        solution: `$\\dot Q = ${tx(m)}\\cdot ${tx(cp)}\\cdot ${T2 - T1} \\approx ${r2(Q, 1)}\\ \\mathrm{kW}$`,
      };
    },
  },
  {
    id: "uni-sevanje",
    topics: uniTopicIds("Sevanje"),
    gen(level, r) {
      const SB = 5.67e-8;
      const eps = r.pick([0.1, 0.3, 0.6, 0.8, 0.95]), A = r.dec(0.1, 3, 1), t = r.int(80, 600), t0 = r.int(0, 30);
      const T = t + 273.15, T0 = t0 + 273.15;
      const P = level === 1 ? eps * SB * A * T ** 4 : eps * SB * A * (T ** 4 - T0 ** 4);
      return {
        text: level === 1
          ? `Telo s ploščino $${tx(A)}\\ \\mathrm{m^2}$, emisivnostjo $${tx(eps)}$ in temperaturo $${t}\\ ^\\circ\\mathrm{C}$ seva v prostor. Kolikšen toplotni tok izseva (brez prejetega sevanja)? $\\sigma = 5{,}67\\cdot 10^{-8}\\ \\mathrm{W/(m^2\\,K^4)}$. Zaokroži ${decWord(1)}.`
          : `Telo s ploščino $${tx(A)}\\ \\mathrm{m^2}$, emisivnostjo $${tx(eps)}$ in temperaturo $${t}\\ ^\\circ\\mathrm{C}$ je v veliki sobi s stenami pri $${t0}\\ ^\\circ\\mathrm{C}$. Kolikšen je neto toplotni tok s sevanjem? $\\sigma = 5{,}67\\cdot 10^{-8}\\ \\mathrm{W/(m^2\\,K^4)}$. Zaokroži ${decWord(1)}.`,
        answer: num(P, "W", 1),
        hint: "Stefan-Boltzmannov zakon: $\\dot Q = \\varepsilon\\sigma A (T^4 - T_0^4)$; temperature v kelvinih.",
        solution: `$\\dot Q \\approx ${r2(P, 1)}\\ \\mathrm{W}$`,
      };
    },
  },
  {
    id: "uni-lmtd",
    topics: uniTopicIds("Toplotni prenosniki"),
    gen(level, r) {
      const Th1 = r.int(90, 180), Th2 = Th1 - r.int(15, 50), Tc1 = r.int(10, 30), Tc2 = Tc1 + r.int(10, 40);
      const counter = level !== 1;
      const d1 = counter ? Th1 - Tc2 : Th1 - Tc1, d2 = counter ? Th2 - Tc1 : Th2 - Tc2;
      if (d1 <= 0 || d2 <= 0 || d1 === d2) return null;
      const lm = (d1 - d2) / Math.log(d1 / d2);
      return {
        text: `V ${counter ? "protitočnem" : "istosmernem"} prenosniku toplote se vroči tok ohladi s $${Th1}$ na $${Th2}\\ ^\\circ\\mathrm{C}$, hladni pa segreje s $${Tc1}$ na $${Tc2}\\ ^\\circ\\mathrm{C}$. Izračunaj logaritemsko srednjo temperaturno razliko. Zaokroži ${decWord(2)}.`,
        answer: num(lm, "K", 2, { unitAlternatives: ["°c"] }),
        hint: `$\\Delta T_{\\ln} = \\dfrac{\\Delta T_1 - \\Delta T_2}{\\ln(\\Delta T_1/\\Delta T_2)}$; pri ${counter ? "protitoku primerjaš vstop vročega z izstopom hladnega" : "istosmernem toku primerjaš oba vstopa in oba izstopa"}.`,
        solution: `$\\Delta T_1 = ${d1}\\ \\mathrm{K}$, $\\Delta T_2 = ${d2}\\ \\mathrm{K}$, $\\Delta T_{\\ln} \\approx ${r2(lm, 2)}\\ \\mathrm{K}$`,
      };
    },
  },
  {
    id: "uni-hidrostatika",
    topics: uniTopicIds("Hidrostatika"),
    gen(level, r) {
      const b = r.dec(0.5, 3, 1), hh = r.dec(0.5, 4, 1), top = level === 1 ? 0 : r.dec(0.2, 3, 1);
      const hc = top + hh / 2;
      const F = (1000 * G * hc * b * hh) / 1000;
      return {
        text: `Navpična pravokotna zapornica s širino $${tx(b)}\\ \\mathrm{m}$ in višino $${tx(hh)}\\ \\mathrm{m}$ ${top ? `ima zgornji rob $${tx(top)}\\ \\mathrm{m}$ pod gladino vode` : "sega od gladine vode navzdol"}. Kolikšna je rezultanta sil vode na zapornico (brez zračnega tlaka)? $\\rho = 1000\\ \\mathrm{kg/m^3}$, $g = 9{,}81\\ \\mathrm{m/s^2}$. Rezultat v kN zaokroži ${decWord(2)}.`,
        answer: num(F, "kN", 2),
        hint: "$F = \\rho g h_T A$, kjer je $h_T$ globina težišča ploskve.",
        solution: `$h_T = ${tx(hc)}\\ \\mathrm{m}$, $F = 1000\\cdot 9{,}81\\cdot ${tx(hc)}\\cdot ${tx(b * hh)} \\approx ${r2(F, 2)}\\ \\mathrm{kN}$`,
      };
    },
  },
  {
    id: "uni-fick",
    topics: uniTopicIds("Difuzija in prenos snovi"),
    gen(level, r) {
      const D = r.dec(0.5, 3, 1), c1 = r.dec(5, 50, 1), c2 = r.dec(0, c1 * 0.6, 1), dx = r.dec(0.5, 5, 1);
      const J = (D * 1e-9 * (c1 - c2)) / (dx * 1e-3) * 1e3; // mmol/(m² s)
      return {
        text: `Snov difundira skozi mirujočo plast vode debeline $${tx(dx)}\\ \\mathrm{mm}$. Koncentraciji na obeh straneh sta $${tx(c1)}$ in $${tx(c2)}\\ \\mathrm{mol/m^3}$, difuzivnost je $${tx(D)}\\cdot 10^{-9}\\ \\mathrm{m^2/s}$. Izračunaj gostoto difuzijskega toka v $\\mathrm{mmol/(m^2\\,s)}$ (vpiši samo število). Zaokroži ${decWord(4)}.`,
        answer: num(J, null, 4),
        hint: "Fickov zakon za stacionarno difuzijo skozi plast: $J = D\\dfrac{c_1 - c_2}{\\Delta x}$.",
        solution: `$J = ${tx(D)}\\cdot 10^{-9}\\cdot \\dfrac{${tx(c1 - c2)}}{${tx(dx / 1000, 4)}} \\approx ${r2(J, 4)}\\ \\mathrm{mmol/(m^2\\,s)}$`,
      };
    },
  },
  {
    id: "uni-kombinatorika",
    topics: uniTopicIds("Kombinatorika"),
    gen(level, r) {
      const binom = (n, k) => { let c = 1; for (let i = 0; i < k; i++) c = (c * (n - i)) / (i + 1); return Math.round(c); };
      if (level === 1) {
        const n = r.int(6, 15), k = r.int(2, 4);
        return {
          text: `Na koliko načinov lahko iz skupine $${n}$ študentov izberemo $${k}$-člansko komisijo (vrstni red ni pomemben)?`,
          answer: num(binom(n, k), null, 0),
          hint: "Število $k$-elementnih podmnožic $n$-elementne množice je $\\binom{n}{k}$.",
          solution: `$\\binom{${n}}{${k}} = ${binom(n, k)}$`,
        };
      }
      if (level === 2) {
        const n = r.int(6, 12), k = r.int(2, 4);
        let v = 1;
        for (let i = 0; i < k; i++) v *= n - i;
        return {
          text: `Na koliko načinov lahko iz $${n}$ kandidatov izberemo predsednika${k === 2 ? " in podpredsednika" : k === 3 ? ", podpredsednika in tajnika" : ", podpredsednika, tajnika in blagajnika"} (vsak opravlja eno funkcijo)?`,
          answer: num(v, null, 0),
          hint: "Vrstni red (funkcija) je pomemben: variacije brez ponavljanja $\\dfrac{n!}{(n-k)!}$.",
          solution: `$${Array.from({ length: k }, (_, i) => n - i).join("\\cdot ")} = ${v}$`,
        };
      }
      const n = r.int(8, 14), m = r.int(4, n - 3), k = r.int(3, 5);
      const v = binom(n, k) - binom(n - m, k);
      return {
        text: `V skupini je $${n}$ študentov, od tega $${m}$ kemikov. Koliko je $${k}$-članskih skupin, v katerih je vsaj en kemik?`,
        answer: num(v, null, 0),
        hint: "Od vseh izborov odštej tiste brez kemika.",
        solution: `$\\binom{${n}}{${k}} - \\binom{${n - m}}{${k}} = ${binom(n, k)} - ${binom(n - m, k)} = ${v}$`,
      };
    },
  },
  {
    id: "uni-de2",
    topics: uniTopicIds("Linearne diferencialne enačbe drugega reda"),
    gen(level, r) {
      let r1 = r.int(-4, 3), r2_ = r.int(-4, 3);
      if (r1 === r2_) r2_ += 1;
      const [hi, lo] = [Math.max(r1, r2_), Math.min(r1, r2_)];
      const p = -(r1 + r2_), q = r1 * r2_;
      const eq = `y'' ${p < 0 ? "-" : "+"} ${Math.abs(p)}y' ${q < 0 ? "-" : "+"} ${Math.abs(q)}y = 0`.replace(/[+-] 0y'? /g, "").replace(/ [+-] 0y = 0/, " = 0");
      if (level === 1) {
        return {
          text: `Zapiši večji koren karakteristične enačbe diferencialne enačbe $${eq}$.`,
          answer: num(hi, null, 0),
          hint: "Nastavek $y = e^{\\lambda x}$ da $\\lambda^2 + p\\lambda + q = 0$.",
          solution: `$\\lambda_1 = ${hi}$, $\\lambda_2 = ${lo}$; splošna rešitev $y = C_1 e^{${hi}x} + C_2 e^{${lo}x}$`,
        };
      }
      const y0 = r.int(1, 4), v0 = r.int(-4, 4);
      // y = C1 e^{hi x} + C2 e^{lo x}: C1 + C2 = y0, hi C1 + lo C2 = v0
      const C1 = (v0 - lo * y0) / (hi - lo), C2 = y0 - C1;
      const x = level === 2 ? 1 : 0.5;
      const v = C1 * Math.exp(hi * x) + C2 * Math.exp(lo * x);
      if (Math.abs(v) > 1e5) return null;
      return {
        text: `Reši začetni problem $${eq}$, $y(0) = ${y0}$, $y'(0) = ${v0}$ in izračunaj $y(${tx(x)})$. Zaokroži ${decWord(3)}.`,
        answer: num(v, null, 3),
        hint: "Poišči korena karakteristične enačbe, zapiši $y = C_1 e^{\\lambda_1 x} + C_2 e^{\\lambda_2 x}$ in konstanti določi iz začetnih pogojev.",
        solution: `$\\lambda = ${hi}, ${lo}$; $C_1 = ${tx(C1, 4)}$, $C_2 = ${tx(C2, 4)}$; $y(${tx(x)}) \\approx ${r2(v, 3)}$`,
      };
    },
  },
  {
    id: "uni-laplace",
    topics: uniTopicIds("Laplaceova transformacija", "Prenosne funkcije"),
    gen(level, r) {
      const a = r.int(1, 5), b = r.int(-3, 2), s0 = r.int(Math.max(b + 1, 1), 6);
      if (level === 1) {
        const v = a / (s0 - b);
        return {
          text: `Izračunaj vrednost Laplaceove transformiranke $F(s) = \\mathcal{L}\\{${a}e^{${b}t}\\}$ v točki $s = ${s0}$. Zaokroži ${decWord(4)}.`,
          answer: num(v, null, 4),
          hint: "$\\mathcal{L}\\{e^{bt}\\} = \\dfrac{1}{s - b}$ za $s > b$.",
          solution: `$F(s) = \\dfrac{${a}}{s ${b < 0 ? "+" : "-"} ${Math.abs(b)}}$, $F(${s0}) \\approx ${r2(v, 4)}$`,
        };
      }
      const w = r.int(1, 4), c = r.int(1, 4);
      const v = (a * w) / (s0 * s0 + w * w) + c / (s0 * s0);
      if (level === 2) {
        return {
          text: `Izračunaj $F(${s0})$ za $F(s) = \\mathcal{L}\\{${a}\\sin(${w}t) + ${c}t\\}$. Zaokroži ${decWord(4)}.`,
          answer: num(v, null, 4),
          hint: "$\\mathcal{L}\\{\\sin\\omega t\\} = \\dfrac{\\omega}{s^2 + \\omega^2}$, $\\mathcal{L}\\{t\\} = \\dfrac{1}{s^2}$; transformacija je linearna.",
          solution: `$F(s) = \\dfrac{${a * w}}{s^2 + ${w * w}} + \\dfrac{${c}}{s^2}$, $F(${s0}) \\approx ${r2(v, 4)}$`,
        };
      }
      // y' + k y = A, y(0) = 0 -> Y(s) = A / (s (s + k)) -> y(t) = A/k (1 - e^{-kt})
      const k = r.int(1, 5), A = r.int(1, 10), t = r.pick([0.5, 1, 2]);
      const y = (A / k) * (1 - Math.exp(-k * t));
      return {
        text: `Z Laplaceovo transformacijo reši $y' + ${k}y = ${A}$, $y(0) = 0$, in izračunaj $y(${tx(t)})$. Zaokroži ${decWord(4)}.`,
        answer: num(y, null, 4),
        hint: "Transformiraj: $sY + kY = A/s$, torej $Y = \\dfrac{A}{s(s + k)}$; razstavi na parcialne ulomke.",
        solution: `$Y = \\dfrac{${A}}{${k}}\\left(\\dfrac{1}{s} - \\dfrac{1}{s + ${k}}\\right)$, $y(t) = \\dfrac{${A}}{${k}}(1 - e^{-${k}t})$, $y(${tx(t)}) \\approx ${r2(y, 4)}$`,
      };
    },
  },
  {
    id: "uni-razpad",
    topics: uniTopicIds("Jedrska fizika"),
    gen(level, r) {
      const [iso, T, unit] = r.pick([["^{131}\\mathrm{I}", 8.02, "dni"], ["^{60}\\mathrm{Co}", 5.27, "let"], ["^{99m}\\mathrm{Tc}", 6.01, "ur"], ["^{32}\\mathrm{P}", 14.3, "dni"], ["^{137}\\mathrm{Cs}", 30.1, "let"]]);
      const A0 = r.int(10, 900), t = r.dec(0.5, 4, 1) * T;
      const tt = roundHalfUp(t, 1);
      if (level <= 2) {
        const A = A0 * 2 ** (-tt / T);
        return {
          text: `Vzorec izotopa $${iso}$ (razpolovni čas $${tx(T)}$ ${unit}) ima aktivnost $${A0}\\ \\mathrm{MBq}$. Kolikšna je njegova aktivnost po $${tx(tt)}$ ${unit === "let" ? "letih" : unit === "dni" ? "dneh" : "urah"}? Zaokroži ${decWord(2)}.`,
          answer: num(A, "MBq", 2),
          hint: "$A(t) = A_0\\,2^{-t/t_{1/2}} = A_0 e^{-\\lambda t}$, $\\lambda = \\ln 2 / t_{1/2}$.",
          solution: `$A = ${A0}\\cdot 2^{-${tx(tt)}/${tx(T)}} \\approx ${r2(A, 2)}\\ \\mathrm{MBq}$`,
        };
      }
      const f = r.pick([0.5, 0.25, 0.1, 0.05, 0.01]);
      const tx_ = (-T * Math.log(f)) / Math.log(2);
      return {
        text: `Po kolikšnem času pade aktivnost izotopa $${iso}$ (razpolovni čas $${tx(T)}$ ${unit}) na $${tx(f * 100)}\\ \\%$ začetne? Rezultat v ${unit === "let" ? "letih" : unit === "dni" ? "dneh" : "urah"} zaokroži ${decWord(1)} (vpiši samo število).`,
        answer: num(tx_, null, 1),
        hint: "Iz $A/A_0 = 2^{-t/t_{1/2}}$ sledi $t = t_{1/2}\\dfrac{\\ln(A_0/A)}{\\ln 2}$.",
        solution: `$t = ${tx(T)}\\cdot\\dfrac{\\ln ${tx(1 / f)}}{\\ln 2} \\approx ${r2(tx_, 1)}$ ${unit}`,
      };
    },
  },
  {
    id: "uni-relativnost",
    topics: uniTopicIds("Posebna teorija relativnosti"),
    gen(level, r) {
      const beta = r.pick([0.5, 0.6, 0.8, 0.9, 0.95, 0.99]);
      const g = 1 / Math.sqrt(1 - beta * beta);
      if (level === 1) {
        return {
          text: `Izračunaj Lorentzov faktor $\\gamma$ za telo, ki se giblje s hitrostjo $${tx(beta)}\\,c$. Zaokroži ${decWord(3)}.`,
          answer: num(g, null, 3),
          hint: "$\\gamma = \\dfrac{1}{\\sqrt{1 - v^2/c^2}}$.",
          solution: `$\\gamma = \\dfrac{1}{\\sqrt{1 - ${tx(beta)}^2}} \\approx ${r2(g, 3)}$`,
        };
      }
      if (level === 2) {
        const t0 = r.dec(1, 20, 1);
        return {
          text: `Mion ima v lastnem sistemu življenjski čas $${tx(t0)}\\ \\mathrm{\\mu s}$ in se giblje s hitrostjo $${tx(beta)}\\,c$. Kolikšen je njegov življenjski čas v laboratorijskem sistemu? Zaokroži ${decWord(2)}.`,
          answer: num(g * t0, "µs", 2, { unitAlternatives: ["us", "μs", "mikrosekund"] }),
          hint: "Podaljšanje časa: $\\Delta t = \\gamma\\,\\Delta t_0$.",
          solution: `$\\gamma \\approx ${r2(g, 4)}$, $\\Delta t \\approx ${r2(g * t0, 2)}\\ \\mathrm{\\mu s}$`,
        };
      }
      const Wk = (g - 1) * 0.511;
      return {
        text: `Kolikšna je kinetična energija elektrona ($m_ec^2 = 0{,}511\\ \\mathrm{MeV}$), ki se giblje s hitrostjo $${tx(beta)}\\,c$? Rezultat v MeV zaokroži ${decWord(3)}.`,
        answer: num(Wk, "MeV", 3),
        hint: "Relativistično: $W_k = (\\gamma - 1)\\,m_ec^2$.",
        solution: `$W_k = (${r2(g, 4)} - 1)\\cdot 0{,}511 \\approx ${r2(Wk, 3)}\\ \\mathrm{MeV}$`,
      };
    },
  },
  {
    id: "uni-boltzmann",
    topics: uniTopicIds("Boltzmannova porazdelitev", "Particijska funkcija"),
    gen(level, r, topicId) {
      const kB = 8.617e-5;
      const dE = r.dec(0.01, 0.1, 3), T = r.int(150, 1000);
      const x = Math.exp(-dE / (kB * T));
      if (topicId.endsWith("particijska-funkcija") || level === 3) {
        const p1 = x / (1 + x);
        return {
          text: `Sistem ima dve stanji z energijama $0$ in $${tx(dE)}\\ \\mathrm{eV}$ (brez degeneracije). Kolikšna je verjetnost, da je pri $${T}\\ \\mathrm{K}$ v višjem stanju? $k_B = 8{,}617\\cdot 10^{-5}\\ \\mathrm{eV/K}$. Zaokroži ${decWord(4)}.`,
          answer: num(p1, null, 4),
          hint: "Particijska funkcija $Z = 1 + e^{-\\Delta E/k_BT}$, verjetnost stanja $p_i = e^{-E_i/k_BT}/Z$.",
          solution: `$e^{-\\Delta E/k_BT} \\approx ${r2(x, 4)}$, $p = \\dfrac{${r2(x, 4)}}{1 + ${r2(x, 4)}} \\approx ${r2(p1, 4)}$`,
        };
      }
      return {
        text: `Energijska razlika med dvema nivojema je $${tx(dE)}\\ \\mathrm{eV}$. Kolikšno je razmerje zasedenosti višjega in nižjega nivoja pri $${T}\\ \\mathrm{K}$ (oba nedegenerirana)? $k_B = 8{,}617\\cdot 10^{-5}\\ \\mathrm{eV/K}$. Zaokroži ${decWord(4)}.`,
        answer: num(x, null, 4),
        hint: "Boltzmannova porazdelitev: $\\dfrac{N_2}{N_1} = e^{-\\Delta E/k_BT}$.",
        solution: `$\\dfrac{N_2}{N_1} = e^{-${tx(dE)}/(8{,}617\\cdot 10^{-5}\\cdot ${T})} \\approx ${r2(x, 4)}$`,
      };
    },
  },
  {
    id: "uni-markov",
    topics: uniTopicIds("Markovske verige"),
    gen(level, r) {
      const p = r.pick([0.1, 0.2, 0.3, 0.4, 0.5]), q = r.pick([0.1, 0.15, 0.25, 0.3, 0.6]);
      if (level <= 2) {
        const pi1 = q / (p + q);
        return {
          text: `Markovska veriga s stanjema 1 in 2 ima prehodni verjetnosti $P(1 \\to 2) = ${tx(p)}$ in $P(2 \\to 1) = ${tx(q)}$. Kolikšna je stacionarna verjetnost stanja 1? Zaokroži ${decWord(4)}.`,
          answer: num(pi1, null, 4),
          hint: "Stacionarna porazdelitev zadošča $\\pi P = \\pi$: $\\pi_1 p = \\pi_2 q$ in $\\pi_1 + \\pi_2 = 1$.",
          solution: `$\\pi_1 = \\dfrac{q}{p + q} = \\dfrac{${tx(q)}}{${tx(p + q)}} \\approx ${r2(pi1, 4)}$`,
        };
      }
      const P2 = (1 - p) * (1 - p) + p * q; // P(1->1 v dveh korakih)
      return {
        text: `Markovska veriga s stanjema 1 in 2 ima $P(1 \\to 2) = ${tx(p)}$ in $P(2 \\to 1) = ${tx(q)}$. Veriga začne v stanju 1. Kolikšna je verjetnost, da je po dveh korakih spet v stanju 1? Zaokroži ${decWord(4)}.`,
        answer: num(P2, null, 4),
        hint: "Izračunaj element $(1,1)$ matrike $P^2$: seštej po vmesnem stanju.",
        solution: `$P^2_{11} = (1 - ${tx(p)})^2 + ${tx(p)}\\cdot ${tx(q)} \\approx ${r2(P2, 4)}$`,
      };
    },
  },
  {
    id: "uni-redoks-titracija",
    topics: uniTopicIds("Redoks titracije", "Kompleksometrija"),
    gen(level, r, topicId) {
      const V = r.pick([10, 20, 25]), c = r.pick([0.02, 0.01, 0.05]), Vt = r.dec(5, 30, 2);
      if (topicId.endsWith("kompleksometrija")) {
        const mCa = c * Vt * 40.08; // mg
        return {
          text: `Vzorec vode titriramo z raztopino EDTA s koncentracijo $${tx(c)}\\ \\mathrm{mol/L}$ in porabimo $${tx(Vt)}\\ \\mathrm{mL}$. Koliko mg kalcija je bilo v vzorcu? $M(\\mathrm{Ca}) = 40{,}08\\ \\mathrm{g/mol}$. Zaokroži ${decWord(2)}.`,
          answer: num(mCa, "mg", 2),
          hint: "EDTA tvori s kovinskimi ioni komplekse v razmerju 1 : 1.",
          solution: `$n = ${tx(c)}\\cdot ${tx(Vt / 1000, 5)} = ${tx(c * Vt, 4)}\\ \\mathrm{mmol}$, $m \\approx ${r2(mCa, 2)}\\ \\mathrm{mg}$`,
        };
      }
      const cFe = (5 * c * Vt) / V;
      return {
        text: `Za titracijo $${V}{,}00\\ \\mathrm{mL}$ raztopine $\\mathrm{Fe^{2+}}$ v kislem porabimo $${tx(Vt)}\\ \\mathrm{mL}$ raztopine $\\mathrm{KMnO_4}$ s koncentracijo $${tx(c)}\\ \\mathrm{mol/L}$. Kolikšna je koncentracija $\\mathrm{Fe^{2+}}$? Zaokroži ${decWord(4)}.`,
        answer: num(cFe, "mol/L", 4, { unitAlternatives: ["mol/l", "M"] }),
        hint: "$\\mathrm{MnO_4^- + 5\\,Fe^{2+} + 8\\,H^+ \\to Mn^{2+} + 5\\,Fe^{3+} + 4\\,H_2O}$.",
        solution: `$c(\\mathrm{Fe^{2+}}) = \\dfrac{5\\cdot ${tx(c)}\\cdot ${tx(Vt)}}{${V}} \\approx ${r2(cFe, 4)}\\ \\mathrm{mol/L}$`,
      };
    },
  },
];
