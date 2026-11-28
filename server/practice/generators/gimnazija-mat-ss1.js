// Gimnazija: drugi tip naloge za teme mat-ss1, ki so imele en sam generator (j, 2026-11-25).
// Merila: docs/kakovost.md §2. Vsi odgovori so izračunani v kodi iz istih števil, kot so v besedilu.
// Obstoječi generatorji (dod-mat-ss12-*) računajo »naprej«; tu so obratna vprašanja, uporaba v
// besedilnih nalogah in pojmovne izbire.
import { g, nOf } from "../rng.js";
import { gcd, roundHalfUp } from "../check.js";
import { tx } from "./mat.js";
import { num, frA, ft, sg, pickAns, name, wrapGens } from "./matura-util.js";

const TP = (s) => `MAT-SS-1/${s}`;

// ---------- pomožne funkcije ----------
const M = (value, why) => ({ value, why });
const par = (x) => (x < 0 ? `(${x})` : `${x}`);
const mono = (c, v) => (c === 1 ? v : c === -1 ? `-${v}` : `${c}${v}`);
// Polinom s celimi koeficienti: poly([1, -3, 2]) → "x^2 - 3x + 2".
function poly(cs, v = "x") {
  const n = cs.length - 1;
  let s = "";
  cs.forEach((c, i) => {
    const e = n - i;
    if (c === 0) return;
    const abs = Math.abs(c);
    const coef = abs === 1 && e > 0 ? "" : `${abs}`;
    const pw = e === 0 ? "" : e === 1 ? v : `${v}^${e}`;
    if (s === "") s = (c < 0 ? "-" : "") + coef + pw;
    else s += (c < 0 ? " - " : " + ") + coef + pw;
  });
  return s || "0";
}
// ax + by (oba koeficienta različna od 0).
const lin2 = (a, b) => `${mono(a, "x")} ${b < 0 ? "-" : "+"} ${mono(Math.abs(b), "y")}`;
// x - a kot dvočlenik (a ≠ 0).
const xm = (a) => (a === 0 ? "x" : `x ${sg(-a)}`);
const dfr = (a, b) => `\\dfrac{${a}}{${b}}`;
const T = (o) => ({ ...o, solution: Array.isArray(o.solution) ? o.solution.filter(Boolean).join("\n") : o.solution });
const lcm = (a, b) => (a / gcd(a, b)) * b;
// Enočlenik c·x^m·y^n (eksponenta 0 ali 1 brez zapisa potence).
function term(c, ex, ey) {
  const pw = (v, e) => (e === 0 ? "" : e === 1 ? v : `${v}^{${e}}`);
  const vars = pw("x", ex) + pw("y", ey);
  if (!vars) return `${c}`;
  return mono(c, vars);
}
const eur = (value, mistakes) => ({ ...num(value, 2, mistakes, "€"), unitAlternatives: ["eur", "evrov", "evra"] });

const GENS = [
  // ================= potence =================
  {
    id: "gim-potence-dop",
    topics: [TP("potence-z-naravnimi-in-celimi-eksponenti")],
    gen(level, r) {
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          // Obratno vprašanje: a^n = b, iščemo celi eksponent.
          const b = r.pick([2, 2, 3, 5, 10]);
          const maxE = { 2: 6, 3: 4, 5: 3, 10: 5 }[b];
          let e;
          do e = r.int(-maxE, maxE);
          while (e === 0 || e === 1);
          const P = b ** Math.abs(e);
          const val = e > 0 ? `${P}` : dfr(1, P);
          const eq = `${b}^{n} = ${val}`;
          return T({
            text: r.pick([`Za katero celo število $n$ velja $${eq}$?`, `Določi celo število $n$, da bo $${eq}$.`]),
            answer: num(e, null, e > 0 ? [M(P / b, "Potenca ni zmnožek osnove in eksponenta: $a^n$ pomeni $n$ enakih faktorjev."), M(e - 1, "Preštej faktorje, ne množenj med njimi.")] : [M(-e, "Ulomek z 1 v števcu je potenca z negativnim eksponentom."), M(P / b, "Najprej imenovalec zapiši kot potenco, nato upoštevaj obratno vrednost.")]),
            hint: e > 0 ? `Število $${P}$ zapiši kot zmnožek samih faktorjev $${b}$.` : `Imenovalec zapiši kot potenco osnove $${b}$, nato uporabi $\\dfrac{1}{a^k} = a^{-k}$.`,
            data: { given: [eq], find: ["n"] },
            formula: ["a^{-k} = \\dfrac{1}{a^{k}}", "a^{m} = a^{n} \\Rightarrow m = n"],
            solution:
              e > 0
                ? [`$${P} = ${Array(e).fill(b).join(" \\cdot ")} = ${b}^{${e}}$`, `$${b}^{n} = ${b}^{${e}}$`, `$n = ${e}$`]
                : [`$${P} = ${b}^{${-e}}$`, `$${dfr(1, P)} = ${dfr(1, `${b}^{${-e}}`)} = ${b}^{${e}}$`, `$n = ${e}$`],
          });
        }
        if (t === 1) {
          // Predznak: −a^n, (−a)^n, −(−a)^n.
          const a = r.int(2, 5);
          const n = a === 5 ? r.int(2, 3) : r.int(2, 4);
          const P = a ** n;
          const f = r.int(0, 2);
          const pn = (-a) ** n;
          const expr = [`-${a}^{${n}}`, `(-${a})^{${n}}`, `-(-${a})^{${n}}`][f];
          const val = [-P, pn, -pn][f];
          const signWhy = [
            "Potenciranje ima prednost pred minusom: minus ni del osnove.",
            n % 2 ? "Liha potenca negativnega števila je negativna." : "Soda potenca negativnega števila je pozitivna.",
            "Minus pred oklepajem spremeni predznak potence v oklepaju.",
          ][f];
          return T({
            text: r.pick([`Izračunaj vrednost izraza $E = ${expr}$.`, `Koliko je $E = ${expr}$? Pazi na predznak.`]),
            answer: num(val, null, [M(-val, signWhy), M(Math.sign(val) * a * n, "Potenca ni zmnožek osnove in eksponenta.")]),
            hint: "Najprej ugotovi, ali je minus del osnove (v oklepaju) ali stoji pred potenco.",
            data: { given: [`E = ${expr}`], find: ["E"] },
            formula: ["-a^{n} = -\\left(a^{n}\\right)", "(-a)^{n} = a^{n} \\text{ za sodi } n", "(-a)^{n} = -a^{n} \\text{ za lihi } n"],
            solution: [
              f === 0 ? `$E = -\\left(${a}^{${n}}\\right) = -(${Array(n).fill(a).join(" \\cdot ")})$` : `$(-${a})^{${n}} = ${Array(n).fill(`(-${a})`).join(" \\cdot ")} = ${pn}$`,
              `$E = ${f === 2 ? `-\\left(${pn}\\right) = ` : ""}${val}$`,
            ],
          });
        }
        // Pojmovna izbira: potenca zmnožka in potenca potence.
        const k = r.pick([2, 3, 5]);
        const n = k === 2 ? r.int(2, 5) : k === 3 ? r.int(2, 4) : r.int(2, 3);
        let m;
        do m = r.next() < 0.35 ? r.int(-4, -2) : r.int(2, 5);
        while (m === n || m * n === m + n);
        const expr = `\\left(${k}a^{${m}}\\right)^{${n}}`;
        const right = `${k ** n}a^{${m * n}}`;
        return T({
          text: r.pick([`Kateri izraz je enak $A = ${expr}$ (za $a \\ne 0$)?`, `Poenostavi $A = ${expr}$ (za $a \\ne 0$).`]),
          answer: pickAns(r, right, [
            [`${k}a^{${m * n}}`, "Potencirati moraš vsak faktor v oklepaju, tudi koeficient."],
            [`${k ** n}${m + n === 0 ? "" : m + n === 1 ? "a" : `a^{${m + n}}`}`, "Pri potenciranju potence eksponente zmnožimo, ne seštejemo."],
            [`${k * n}a^{${m * n}}`, "Potenca koeficienta ni zmnožek koeficienta in eksponenta."],
            [`${k ** n}a^{${m}}`, "Tudi potenco $a^m$ v oklepaju je treba potencirati."],
          ]),
          options_tex: true,
          hint: "Potenciraj vsak faktor v oklepaju posebej.",
          data: { given: [`A = ${expr}`], find: ["A"] },
          formula: ["(a \\cdot b)^{n} = a^{n} \\cdot b^{n}", "\\left(a^{m}\\right)^{n} = a^{m \\cdot n}"],
          solution: [`$A = ${k}^{${n}} \\cdot \\left(a^{${m}}\\right)^{${n}}$`, `$A = ${right}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          // Enačba z isto osnovo: najprej zapiši število kot potenco osnove.
          const [b, p] = r.pick([[2, 2], [2, 3], [3, 2], [3, 3], [5, 2], [2, 4]]);
          const B = b ** p;
          const k = p === 4 || B > 10 ? 2 : r.int(2, 3);
          const div = r.next() < 0.5;
          let n;
          let s;
          do {
            n = r.nonZero(-4, 6);
            s = div ? n - p * k : n + p * k;
          } while (s === 0 || s === 1);
          const eq = div ? `${dfr(`${b}^{n}`, `${B}^{${k}}`)} = ${b}^{${s}}` : `${b}^{n} \\cdot ${B}^{${k}} = ${b}^{${s}}`;
          const ms = div
            ? [M(s - p * k, "Pri deljenju potenc se eksponenta odštejeta – iz $n - c = s$ dobiš $n$ s prištevanjem."), M(s + p + k, "Pri potenciranju potence eksponente zmnožimo, ne seštejemo."), M(s + k, `Najprej zapiši $${B}$ kot potenco osnove $${b}$.`)]
            : [M(s + p * k, "Pri množenju potenc se eksponenta seštejeta – iz $n + c = s$ dobiš $n$ z odštevanjem."), M(s - p - k, "Pri potenciranju potence eksponente zmnožimo, ne seštejemo."), M(s - k, `Najprej zapiši $${B}$ kot potenco osnove $${b}$.`)];
          return T({
            text: r.pick([`Za katero celo število $n$ velja $${eq}$?`, `Določi celo število $n$, za katero je $${eq}$.`]),
            answer: num(n, null, ms),
            hint: `Zapiši $${B}$ kot potenco z osnovo $${b}$, nato levo stran združi v eno potenco.`,
            data: { given: [eq], find: ["n"] },
            formula: ["\\left(a^{m}\\right)^{n} = a^{m \\cdot n}", div ? "a^{m} : a^{n} = a^{m - n}" : "a^{m} \\cdot a^{n} = a^{m + n}"],
            solution: [
              `$${B}^{${k}} = \\left(${b}^{${p}}\\right)^{${k}} = ${b}^{${p * k}}$`,
              `$${b}^{n ${div ? "-" : "+"} ${p * k}} = ${b}^{${s}}$`,
              `$n ${div ? "-" : "+"} ${p * k} = ${s}$`,
              `$n = ${n}$`,
            ],
          });
        }
        if (t === 1) {
          // Prepogibanje papirja: d = d0 · 2^n, nato pretvorba v cm.
          const nm = name(r);
          const d = r.pick([0.1, 0.05, 0.2]);
          const n = r.int(5, 10);
          const mm = roundHalfUp(d * 2 ** n, 4);
          const cm = roundHalfUp(mm / 10, 4);
          return T({
            text: `${nm} prepogne list papirja, debel $${tx(d)}\\ \\mathrm{mm}$, na pol, nato sveženj spet na pol in tako naprej – skupaj $${n}$-krat. Kako debel je prepognjeni sveženj? Rezultat zapiši v centimetrih na dve decimalki.`,
            answer: num(cm, 2, [M(roundHalfUp((d * 2 * n) / 10, 4), "Vsak pregib debelino podvoji: to je potenca števila 2, ne zmnožek 2 · n."), M(mm, "To je debelina v milimetrih; pretvori jo v centimetre."), M(roundHalfUp((d * 2 ** (n - 1)) / 10, 4), "Po vsakem od pregibov se debelina podvoji – preštej jih vse.")], "cm"),
            hint: "Po vsakem pregibu je listov dvakrat toliko kot prej. Koliko listov je v svežnju po vseh pregibih?",
            data: { given: [`d_0 = ${tx(d)}\\ \\mathrm{mm}`, `n = ${n}`], find: ["d"] },
            formula: ["d = d_0 \\cdot 2^{n}", "1\\ \\mathrm{cm} = 10\\ \\mathrm{mm}"],
            solution: [`Število listov: $2^{${n}} = ${2 ** n}$`, `$d = ${tx(d)}\\ \\mathrm{mm} \\cdot ${2 ** n} = ${tx(mm)}\\ \\mathrm{mm}$`, `$d = ${tx(cm)}\\ \\mathrm{cm}$`],
          });
        }
        // Bakterije: v preteklost z negativnim eksponentom.
        const per = r.pick([1, 2, 3]);
        const H = per === 1 ? r.int(2, 6) : per === 2 ? r.int(1, 3) : r.int(1, 2);
        const k = H * per;
        const c = r.pick([3, 5, 7, 15, 25, 75]) * 100;
        const N = c * 2 ** k;
        const perT = per === 1 ? "vsako uro" : `vsakih $${60 / per}$ minut`;
        const hT = H === 1 ? "eno uro" : H === 2 ? "$2$ urama" : `$${H}$ urami`;
        const ms = [M(N / (2 * k), "Podvojitev $k$-krat pomeni množenje s $2^k$, ne z $2k$."), M(N * 2 ** k, "V preteklost: število bakterij je bilo manjše, zato deliš.")];
        if (per > 1) ms.push(M(N / 2 ** H, "V eni uri se kultura podvoji večkrat."));
        return T({
          text: `Število bakterij v kulturi se podvoji ${perT}. Zdaj je v kulturi $${N}$ bakterij. Koliko bakterij je bilo v kulturi pred ${hT}?`,
          answer: num(c, null, ms),
          hint: "Najprej ugotovi, kolikokrat se je število bakterij v tem času podvojilo.",
          data: { given: [`N = ${N}`, per === 1 ? null : `T = ${60 / per}\\ \\mathrm{min}`, H === 1 ? null : `t = ${H}\\ \\mathrm{h}`].filter(Boolean), find: ["N_0"] },
          formula: ["N = N_0 \\cdot 2^{k}", "N_0 = N \\cdot 2^{-k}"],
          solution: [
            `Število podvojitev: $k = ${per === 1 ? `${H}` : `${H} \\cdot ${per} = ${k}`}$`,
            `$N_0 = ${N} \\cdot 2^{-${k}} = ${dfr(N, 2 ** k)}$`,
            `$N_0 = ${c}$`,
          ],
        });
      }
      const t = r.int(0, 1);
      if (t === 0) {
        // Enačba P^(n+u) = Q^(n+v) z isto osnovo.
        for (;;) {
          const b = r.pick([2, 2, 3]);
          const [p, q] = b === 2 ? r.pick([[2, 3], [3, 2], [2, 4], [4, 2], [3, 4], [4, 3]]) : r.pick([[2, 3], [3, 2]]);
          const n = r.int(-3, 6);
          const u = r.nonZero(-3, 3);
          const num_ = p * (n + u);
          if (num_ % q) continue;
          const v = num_ / q - n;
          if (v === 0 || Math.abs(v) > 6 || n + u === 0 || n + v === 0) continue;
          const P = b ** p;
          const Q = b ** q;
          const eq = `${P}^{n ${sg(u)}} = ${Q}^{n ${sg(v)}}`;
          const wrong = (v - u) / (p - q);
          return T({
            text: r.pick([`Za katero celo število $n$ velja $${eq}$?`, `Reši enačbo $${eq}$ v množici celih števil.`]),
            answer: num(n, null, [M(wrong, "Eksponent osnove pomnoži s celim eksponentom v oklepaju, ne le z $n$."), M(-n, "Pri prenašanju členov čez enačaj pazi na predznak.")]),
            hint: `Obe strani zapiši kot potenco z osnovo $${b}$ in izenači eksponenta.`,
            data: { given: [eq], find: ["n"] },
            formula: ["\\left(a^{m}\\right)^{n} = a^{m \\cdot n}", "a^{x} = a^{y} \\Rightarrow x = y"],
            solution: [
              `$${P} = ${b}^{${p}}$, $${Q} = ${b}^{${q}}$`,
              `$${b}^{${p}(n ${sg(u)})} = ${b}^{${q}(n ${sg(v)})}$`,
              `$${p}n ${sg(p * u)} = ${q}n ${sg(q * v)}$`,
              p - q === 1 ? null : `$${mono(p - q, "n")} = ${q * v - p * u}$`,
              `$n = ${n}$`,
            ],
          });
        }
      }
      // Razpolovni čas: obratno vprašanje (koliko časa je minilo).
      for (;;) {
        const ctx = r.pick([
          { what: "radioaktivnega izotopa", u: "dni", sym: "\\mathrm{d}" },
          { what: "zdravila v krvi", u: "ur", sym: "\\mathrm{h}" },
        ]);
        const Th = r.pick([5, 6, 8, 10, 12, 15]);
        const k = r.int(2, 6);
        const m0 = r.pick([40, 64, 80, 96, 120, 160, 200, 320]);
        const m = m0 / 2 ** k;
        if (Math.abs(roundHalfUp(m, 3) - m) > 1e-12) continue;
        return T({
          text: `Razpolovni čas ${ctx.what} je $${Th}$ ${ctx.u}. Od začetnih $${m0}\\ \\mathrm{mg}$ je ostalo še $${tx(m)}\\ \\mathrm{mg}$. Koliko ${ctx.u} je minilo?`,
          answer: num(k * Th, null, [M(k, "To je število razpolovnih časov; pretvori ga še v čas."), M((k + 1) * Th, "Po prvem razpolovnem času ostane polovica, torej $2^{-1}$ začetne mase: preštej razpolovitve."), M((m0 / m / 2) * Th, "Razmerje mas je potenca števila 2, ne dvakratnik števila razpolovitev.")]),
          hint: "Izračunaj, kolikšen del začetne mase je ostal, in ta del zapiši kot potenco $2^{-k}$.",
          data: { given: [`T = ${Th}\\ ${ctx.sym}`, `m_0 = ${m0}\\ \\mathrm{mg}`, `m = ${tx(m)}\\ \\mathrm{mg}`], find: ["t"] },
          formula: ["m = m_0 \\cdot 2^{-k}", "t = k \\cdot T"],
          solution: [`$\\dfrac{m}{m_0} = \\dfrac{${tx(m)}}{${m0}} = \\dfrac{1}{${2 ** k}} = 2^{-${k}}$`, `Število razpolovnih časov: $k = ${k}$`, `$t = ${k} \\cdot ${Th} = ${k * Th}$ ${ctx.u}`],
        });
      }
    },
  },

  // ================= razstavljanje =================
  {
    id: "gim-razstavljanje-dop",
    topics: [TP("razstavljanje-izrazov")],
    gen(level, r) {
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          // Dopolni do popolnega kvadrata (obratno: iščemo manjkajoči člen).
          const a = r.int(2, 9);
          const s = r.pick([1, -1]);
          const askC = r.next() < 0.5;
          if (askC) {
            const T_ = `x^2 ${sg(2 * a * s)}x + c`;
            return T({
              text: `Za katero število $c$ je trinom $T = ${T_}$ kvadrat dvočlenika?`,
              answer: num(a * a, null, [M(2 * a, "Število $c$ je kvadrat polovice koeficienta pri $x$."), M(4 * a * a, "Koeficient pri $x$ je $2b$: najprej ga razpolovi, nato kvadriraj."), M(a, "Zadnji člen kvadrata dvočlenika je $b^2$, ne $b$.")]),
              hint: `Primerjaj s $(x ${s > 0 ? "+" : "-"} b)^2 = x^2 ${s > 0 ? "+" : "-"} 2bx + b^2$: iz srednjega člena določi $b$.`,
              data: { given: [`T = ${T_}`], find: ["c"] },
              formula: ["(x + b)^2 = x^2 + 2bx + b^2", "(x - b)^2 = x^2 - 2bx + b^2"],
              solution: [`$2b = ${2 * a}$, torej $b = ${a}$`, `$c = b^2 = ${a * a}$`, `$T = (x ${sg(s * a)})^2$`],
            });
          }
          const T_ = `x^2 + px + ${a * a}`;
          return T({
            text: `Za katero ${s > 0 ? "pozitivno" : "negativno"} število $p$ je trinom $T = ${T_}$ kvadrat dvočlenika?`,
            answer: num(2 * s * a, null, [M(s * a, "Srednji člen kvadrata dvočlenika je dvojni zmnožek $2bx$."), M(-2 * s * a, "Preveri predznak, ki ga zahteva naloga."), M(s * a * a, "Število $p$ je dvojni zmnožek, ne kvadrat.")]),
            hint: `Zadnji člen je $${a * a} = b^2$. Določi $b$ in se spomni, kako je videti srednji člen kvadrata dvočlenika.`,
            data: { given: [`T = ${T_}`], find: ["p"] },
            formula: ["(x + b)^2 = x^2 + 2bx + b^2", "(x - b)^2 = x^2 - 2bx + b^2"],
            solution: [`$b^2 = ${a * a}$, torej $b = ${s > 0 ? "" : "-"}${a}$`, `$p = 2b = ${2 * s * a}$`, `$T = (x ${sg(s * a)})^2$`],
          });
        }
        if (t === 1) {
          // Največji skupni faktor: koeficient ali eksponent.
          const gg = r.pick([2, 3, 4, 5, 6, 8, 9, 10, 12]);
          let u;
          let v;
          do {
            u = r.int(1, 7);
            v = r.int(2, 7);
          } while (u === v || gcd(u, v) !== 1);
          const [a1, a2] = [r.int(1, 5), r.int(1, 5)];
          let b1;
          let b2;
          do [b1, b2] = [r.int(1, 4), r.int(1, 4)];
          while (a1 === a2 && b1 === b2);
          const s = r.pick([1, -1]);
          const [k1, k2] = [gg * u, gg * v];
          const m = Math.min(a1, a2);
          const n = Math.min(b1, b2);
          const E = `${term(k1, a1, b1)} ${s > 0 ? "+" : "-"} ${term(k2, a2, b2)}`;
          const ask = r.pick(["c", "c", "m", "n"]);
          const val = { c: gg, m, n }[ask];
          const sub = [2, 3].find((d) => gg % d === 0 && d < gg);
          const ms = {
            c: [M(Math.min(k1, k2), "Skupni faktor mora deliti oba koeficienta."), sub ? M(sub, "Izpostaviti moraš največji skupni delitelj, ne le enega od deliteljev.") : null, M(k1 * k2, "Skupni faktor je delitelj obeh koeficientov, ne njun zmnožek.")],
            m: [M(Math.max(a1, a2), "Izpostaviš lahko le tolikšno potenco, ki nastopa v obeh členih."), M(Math.abs(a1 - a2), "Eksponent skupnega faktorja ni razlika eksponentov.")],
            n: [M(Math.max(b1, b2), "Izpostaviš lahko le tolikšno potenco, ki nastopa v obeh členih."), M(Math.abs(b1 - b2), "Eksponent skupnega faktorja ni razlika eksponentov.")],
          }[ask].filter(Boolean);
          const inner = `${term(u, a1 - m, b1 - n)} ${s > 0 ? "+" : "-"} ${term(v, a2 - m, b2 - n)}`;
          return T({
            text: `Iz izraza $E = ${E}$ izpostavimo največji skupni faktor $c\\,x^{m}y^{n}$. Koliko je $${ask}$?`,
            answer: num(val, null, ms),
            hint: "Za koeficient poišči največji skupni delitelj koeficientov, pri vsaki spremenljivki pa potenco, ki jo vsebujeta oba člena.",
            data: { given: [`E = ${E}`], find: [ask] },
            formula: "ab + ac = a(b + c)",
            solution: [`$D(${k1}, ${k2}) = ${gg}$`, `Skupni potenci: $x^{${m}}$ in $y^{${n}}$`, `$E = ${term(gg, m, n)}(${inner})$`, `$${ask} = ${val}$`],
          });
        }
        // Skupni faktor dveh izrazov (pojmovna izbira).
        const a = r.int(1, 9);
        const s = r.pick([1, -1]);
        const k = r.int(2, 6);
        const tpl = r.int(0, 2);
        const A = `x^2 - ${a * a}`;
        const B = [poly([1, s * a, 0]), `${k}x ${sg(k * s * a)}`, poly([1, 2 * s * a, a * a])][tpl];
        const Bfac = [`x(x ${sg(s * a)})`, `${k}(x ${sg(s * a)})`, `(x ${sg(s * a)})^2`][tpl];
        const right = `x ${sg(s * a)}`;
        const other = [`x`, `${k}`, `(x ${sg(s * a)})^2`][tpl];
        return T({
          text: `Kateri faktor je skupen izrazoma $A = ${A}$ in $B = ${B}$?`,
          answer: pickAns(r, right, [
            [`x ${sg(-s * a)}`, "Ta faktor ima le izraz $A$; preveri še razcep izraza $B$."],
            [other, tpl === 2 ? "Izraz $A$ vsebuje ta dvočlenik le enkrat, ne na kvadrat." : "Ta faktor ima le izraz $B$; razcep izraza $A$ ga ne vsebuje."],
            ["\\text{nimata skupnega faktorja}", "Oba izraza najprej razstavi: $A$ je razlika kvadratov."],
          ]),
          options_tex: true,
          hint: "Oba izraza razstavi na faktorje in primerjaj razcepa.",
          data: { given: [`A = ${A}`, `B = ${B}`], find: ["\\text{skupni faktor}"] },
          formula: ["a^2 - b^2 = (a - b)(a + b)", "ab + ac = a(b + c)"],
          solution: [`$A = (x - ${a})(x + ${a})$`, `$B = ${Bfac}$`, `Skupni faktor: $${right}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 1);
        if (t === 0) {
          // Združevanje členov in enačba E = 0 (ena realna rešitev).
          const p = r.nonZero(-6, 6);
          const c = r.pick([1, 2, 3, 4, 5, 9]);
          const E = poly([1, p, c, p * c]);
          return T({
            text: `Izraz $E = ${E}$ razstavi z združevanjem členov in nato reši enačbo $E = 0$ v množici realnih števil.`,
            answer: num(-p, null, [M(p, "Iz $x + a = 0$ sledi $x = -a$: pazi na predznak."), M(-c, "Drugi faktor $x^2 + " + c + "$ je za vsak realni $x$ pozitiven, zato nima ničel.")]),
            hint: "Združi prva dva in zadnja dva člena ter iz vsakega para izpostavi skupni faktor.",
            data: { given: [`E = ${E}`], find: ["x"] },
            formula: ["ab + ac = a(b + c)", "A \\cdot B = 0 \\iff A = 0 \\text{ ali } B = 0"],
            solution: [
              `$E = x^2(x ${sg(p)}) ${c === 1 ? "+" : `+ ${c}`}(x ${sg(p)})$`,
              `$E = (x ${sg(p)})(x^2 + ${c})$`,
              `$x^2 + ${c} > 0$ za vsak realni $x$`,
              `$x ${sg(p)} = 0 \\Rightarrow x = ${-p}$`,
            ],
          });
        }
        if (r.next() < 0.5) {
          // kx^2 - mx = 0: od 0 različna rešitev.
          const k = r.int(2, 9);
          let m;
          do m = r.nonZero(-12, 12);
          while (Math.abs(m) === k);
          const mx = `${m > 0 ? "-" : "+"} ${mono(Math.abs(m), "x")}`;
          const eq = `${k}x^2 ${mx} = 0`;
          return T({
            text: `Enačba $${eq}$ ima dve rešitvi. Ena je $x = 0$. Koliko je druga? Zapiši jo kot okrajšan ulomek ali celo število.`,
            answer: frA(m, k, [M(-m / k, "Pazi na predznak pri reševanju linearne enačbe."), M(k / m, "Pri reševanju $kx = m$ deliš s koeficientom pri $x$.")]),
            hint: "Izpostavi $x$ in uporabi: zmnožek je enak 0, ko je vsaj en faktor enak 0.",
            data: { given: [eq], find: ["x_2"] },
            formula: ["ab + ac = a(b + c)", "A \\cdot B = 0 \\iff A = 0 \\text{ ali } B = 0"],
            solution: [`$x(${k}x ${sg(-m)}) = 0$`, `$x_1 = 0$ ali $${k}x ${sg(-m)} = 0$`, `$${k}x = ${m}$`, `$x_2 = ${ft(m, k)}$`],
          });
        }
        // a^2 x^2 - b^2 = 0: pozitivna rešitev.
        const a = r.int(1, 6);
        let b;
        do b = r.int(1, 9);
        while (b === a || gcd(a, b) !== 1);
        const eq = `${mono(a * a, "x^2")} - ${b * b} = 0`;
        return T({
          text: `Enačbo $${eq}$ reši z razcepom na razliko kvadratov. Koliko je pozitivna rešitev? Zapiši jo kot okrajšan ulomek ali celo število.`,
          answer: frA(b, a, [M((b * b) / (a * a), "Iz $x^2 = c$ sledi $x = \\sqrt{c}$, ne $x = c$."), M(a / b, "Pri reševanju $ax = b$ deliš s koeficientom pri $x$.")]),
          hint: "Levo stran zapiši kot razliko kvadratov $(ax)^2 - b^2$ in razstavi.",
          data: { given: [eq], find: ["x"] },
          formula: ["a^2 - b^2 = (a - b)(a + b)", "A \\cdot B = 0 \\iff A = 0 \\text{ ali } B = 0"],
          solution: [`$(${mono(a, "x")})^2 - ${b}^2 = 0$`, `$(${mono(a, "x")} - ${b})(${mono(a, "x")} + ${b}) = 0$`, `$x = ${ft(b, a)}$ ali $x = ${ft(-b, a)}$`, `Pozitivna rešitev: $x = ${ft(b, a)}$`],
        });
      }
      const t = r.int(0, 2);
      if (t === 0) {
        // Združevanje + razlika kvadratov: tri rešitve, vprašamo po največji ali najmanjši.
        let p;
        let d;
        do {
          p = r.nonZero(-7, 7);
          d = r.int(1, 6);
        } while (Math.abs(p) === d);
        const E = poly([1, p, -d * d, -p * d * d]);
        const roots = [-p, d, -d];
        const big = r.next() < 0.5;
        const val = big ? Math.max(...roots) : Math.min(...roots);
        const other = big ? Math.min(...roots) : Math.max(...roots);
        const flip = big ? Math.max(p, d, -d) : Math.min(p, d, -d);
        return T({
          text: `Reši enačbo $${E} = 0$ z razstavljanjem. Koliko je ${big ? "največja" : "najmanjša"} rešitev?`,
          answer: num(val, null, [M(other, `To je ${big ? "najmanjša" : "največja"} rešitev.`), M(flip, "Iz $x + a = 0$ sledi $x = -a$: pazi na predznak."), M(big ? d : -d, "Upoštevaj tudi ničlo prvega faktorja.")]),
          hint: "Združi prva dva in zadnja dva člena, izpostavi skupni dvočlenik, nato razstavi še razliko kvadratov.",
          data: { given: [`${E} = 0`], find: [big ? "x_{\\max}" : "x_{\\min}"] },
          formula: ["ab + ac = a(b + c)", "a^2 - b^2 = (a - b)(a + b)"],
          solution: [
            `$x^2(x ${sg(p)}) - ${d * d === 1 ? "" : d * d}(x ${sg(p)}) = 0$`,
            `$(x ${sg(p)})(x^2 - ${d * d}) = 0$`,
            `$(x ${sg(p)})(x - ${d})(x + ${d}) = 0$`,
            `Rešitve: $${-p}$, $${d}$, $${-d}$`,
            `${big ? "Največja" : "Najmanjša"}: $x = ${val}$`,
          ],
        });
      }
      if (t === 1) {
        // Pravokotnik ali kvadrat: stranico dobimo iz razcepa ploščine.
        const x0 = r.int(2, 12);
        const what = r.pick([["vrt", "m"], ["slika", "cm"], ["njiva", "m"], ["preproga", "dm"]]);
        const u = what[1];
        if (r.next() < 0.55) {
          let a;
          let b;
          do [a, b] = [r.int(1, 9), r.int(1, 9)];
          while (a === b);
          const S = poly([1, a + b, a * b]);
          const O = 2 * (2 * x0 + a + b);
          return T({
            text: `Pravokotna ${what[0] === "vrt" ? "gredica" : what[0]} ima ploščino $(${S})\\ \\mathrm{${u}^2}$, ena njena stranica meri $(x + ${a})\\ \\mathrm{${u}}$. Kolikšen je obseg pri $x = ${x0}$?`,
            answer: num(O, null, [M(x0 + b, "To je druga stranica; obseg je vsota vseh štirih stranic."), M(2 * x0 + a + b, "Obseg pravokotnika je $2(a + b)$, ne $a + b$."), M((x0 + a) * (x0 + b), "To je ploščina, ne obseg.")], u),
            hint: "Ploščino razstavi kot trinom (Vietovo pravilo); eden od faktorjev je dana stranica.",
            data: { given: [`S = (${S})\\ \\mathrm{${u}^2}`, `a = (x + ${a})\\ \\mathrm{${u}}`, `x = ${x0}`], find: ["o"] },
            formula: ["x^2 + (a + b)x + ab = (x + a)(x + b)", "o = 2(a + b)"],
            solution: [`$${S} = (x + ${a})(x + ${b})$`, `Druga stranica: $b = x + ${b}$`, `$o = 2\\big((x + ${a}) + (x + ${b})\\big) = ${mono(4, "x")} + ${2 * (a + b)}$`, `$o = 4 \\cdot ${x0} + ${2 * (a + b)} = ${O}\\ \\mathrm{${u}}$`],
          });
        }
        const a = r.int(2, 5);
        const b = r.int(1, 9);
        const S = poly([a * a, 2 * a * b, b * b]);
        const O = 4 * (a * x0 + b);
        return T({
          text: `Kvadratna ${what[0] === "vrt" ? "gredica" : what[0]} ima ploščino $(${S})\\ \\mathrm{${u}^2}$. Kolikšen je njen obseg pri $x = ${x0}$?`,
          answer: num(O, null, [M(a * x0 + b, "To je stranica kvadrata; obseg so štiri stranice."), M((a * x0 + b) ** 2, "To je ploščina, ne obseg."), M(4 * (a * x0 + b * b), "Ploščina je kvadrat dvočlenika: stranica je $(ax + b)$.")], u),
          hint: "Ploščino prepoznaj kot kvadrat dvočlenika – tako dobiš stranico.",
          data: { given: [`S = (${S})\\ \\mathrm{${u}^2}`, `x = ${x0}`], find: ["o"] },
          formula: ["(a + b)^2 = a^2 + 2ab + b^2", "o = 4a"],
          solution: [`$${S} = (${mono(a, "x")} + ${b})^2$`, `Stranica: $${mono(a, "x")} + ${b}$`, `Pri $x = ${x0}$: stranica $= ${a * x0 + b}\\ \\mathrm{${u}}$`, `$o = 4 \\cdot ${a * x0 + b} = ${O}\\ \\mathrm{${u}}$`],
        });
      }
      // Računanje na pamet: kvadrat razlike v obratni smeri.
      const D = r.pick([10, 10, 20, 30, 100]);
      const b = r.int(D === 100 ? 101 : 11, D === 100 ? 299 : 89);
      const a = b + D;
      const plus = r.next() < 0.4;
      const val = plus ? (a + b) ** 2 : D * D;
      const E = `${a}^2 ${plus ? "+" : "-"} 2 \\cdot ${a} \\cdot ${b} + ${b}^2`;
      return T({
        text: `Izračunaj brez računala: $E = ${E}$. Namig: izraz razstavi.`,
        answer: num(val, null, plus ? [M(a + b, "Izraz je kvadrat vsote, rezultat moraš še kvadrirati."), M(a * a + b * b, "Ne pozabi dvojnega zmnožka.")] : [M(D, "Izraz je kvadrat razlike, rezultat moraš še kvadrirati."), M((a + b) ** 2, "Srednji člen je odšteven: to je kvadrat razlike."), M(a * a - b * b, "To ni razlika kvadratov – izraz ima tri člene.")]),
        hint: "Primerjaj izraz z obrazcem za kvadrat dvočlenika.",
        data: { given: [`E = ${E}`], find: ["E"] },
        formula: plus ? "a^2 + 2ab + b^2 = (a + b)^2" : "a^2 - 2ab + b^2 = (a - b)^2",
        solution: [`$E = (${a} ${plus ? "+" : "-"} ${b})^2$`, `$E = ${plus ? a + b : D}^2 = ${val}$`],
      });
    },
  },

  // ================= ulomljeni izrazi =================
  {
    id: "gim-ulomljeni-dop",
    topics: [TP("ulomljeni-izrazi")],
    gen(level, r) {
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          // Kdaj je ulomek enak 0.
          const k = r.int(2, 5);
          const z = r.nonZero(-6, 6);
          let n;
          do n = r.nonZero(-7, 7);
          while (n === -z);
          const E = dfr(`${k}x ${sg(-k * z)}`, `x ${sg(n)}`);
          return T({
            text: r.pick([`Za katero vrednost $x$ je vrednost izraza $E = ${E}$ enaka $0$?`, `Poišči ničlo ulomljenega izraza $E = ${E}$.`]),
            answer: num(z, null, [M(-n, "Pri tej vrednosti je imenovalec 0 in izraz ni definiran; ulomek je 0, ko je števec 0."), M(k * z, "Enačbo za števec še deli s koeficientom pri $x$."), M(-z, "Pazi na predznak pri reševanju.")]),
            hint: "Ulomek je enak 0, ko je njegov števec enak 0 (imenovalec pa ne).",
            data: { given: [`E = ${E}`], find: ["x"] },
            formula: "\\dfrac{A}{B} = 0 \\iff A = 0 \\text{ in } B \\ne 0",
            solution: [`$${k}x ${sg(-k * z)} = 0$`, `$x = ${z}$`, `Imenovalec pri $x = ${z}$: $${z} ${sg(n)} = ${z + n} \\ne 0$`],
          });
        }
        if (t === 1) {
          // Koliko števil ni v definicijskem območju.
          const a = r.int(1, 9);
          const tpl = r.int(0, 3);
          const den = [`x^2 - ${a * a}`, `x^2 + ${a * a}`, poly([1, -2 * a, a * a]), poly([1, a, 0])][tpl];
          const fac = [`(x - ${a})(x + ${a})`, `x^2 + ${a * a} > 0`, `(x - ${a})^2`, `x(x ${sg(a)})`][tpl];
          const zeros = [[a, -a], [], [a], [0, -a]][tpl];
          let m;
          do m = r.nonZero(-9, 9);
          while (zeros.includes(-m));
          const E = dfr(`x ${sg(m)}`, den);
          const cnt = zeros.length;
          const why = [
            [1, "Enačba $x^2 = a^2$ ima tudi negativno rešitev."],
            [2, "Vsota kvadratov $x^2 + a^2$ je za vsak realni $x$ pozitivna."],
            [2, "Kvadrat dvočlenika ima eno samo (dvojno) ničlo."],
            [1, "Razstavi imenovalec: tudi $x = 0$ je njegova ničla."],
          ][tpl];
          return T({
            text: `Koliko realnih števil ne spada v definicijsko območje izraza $E = ${E}$?`,
            answer: num(cnt, null, [M(why[0], why[1]), M(cnt + 1, "Ničla števca ne izključi števila iz definicijskega območja.")]),
            zeroOk: true,
            hint: "Izraz ni definiran tam, kjer je imenovalec enak 0. Imenovalec razstavi.",
            data: { given: [`E = ${E}`], find: ["\\text{število izključenih vrednosti}"] },
            formula: "\\dfrac{A}{B} \\text{ je definiran} \\iff B \\ne 0",
            solution: [
              tpl === 1 ? `$${fac}$ za vsak realni $x$` : `$${den} = ${fac}$`,
              cnt ? `Imenovalec je 0 pri $x = ${zeros.join("$ in $x = ")}$` : "Imenovalec ni nikoli 0.",
              `Izključenih števil: $${cnt}$`,
            ],
          });
        }
        // Za kateri x ima ulomek dano vrednost.
        const c = r.pick([2, 3, 4, 5, -2, -3, -4]);
        const d = r.nonZero(-5, 5);
        const A = c * d;
        const b = r.nonZero(-6, 6);
        const E = dfr(A, `x ${sg(-b)}`);
        return T({
          text: `Za katero vrednost $x$ ima izraz $E = ${E}$ vrednost $${c}$?`,
          answer: num(b + d, null, [M(b + A * c, "Iz $\\dfrac{A}{B} = c$ sledi $B = \\dfrac{A}{c}$, ne $B = A \\cdot c$."), M(d - b, "Pazi na predznak, ko $b$ preneseš na drugo stran."), M(d, "Dobil si vrednost imenovalca; izračunaj še $x$.")]),
          hint: "Pomnoži obe strani z imenovalcem, nato izrazi $x$.",
          data: { given: [`E = ${E}`, `\\text{vrednost} = ${c}`], find: ["x"] },
          formula: "\\dfrac{A}{B} = c \\Rightarrow B = \\dfrac{A}{c}",
          solution: [`$x ${sg(-b)} = \\dfrac{${A}}{${c}} = ${d}$`, `$x = ${d} ${sg(b)} = ${b + d}$`, `Imenovalec: $${b + d} ${sg(-b)} = ${d} \\ne 0$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          // Ničla s pastjo: ena ničla števca ni v definicijskem območju.
          let a;
          let b;
          let tpl;
          let bad;
          do {
            a = r.nonZero(-7, 7);
            b = r.nonZero(-7, 7);
            tpl = r.int(0, 2);
            bad = [[b], [b, -b], [0, b]][tpl];
          } while (a === b || bad.includes(a));
          const N = poly([1, -(a + b), a * b]);
          const D = [`x ${sg(-b)}`, `x^2 - ${b * b}`, poly([1, -b, 0])][tpl];
          const Df = [`x ${sg(-b)}`, `(x ${sg(-b)})(x ${sg(b)})`, `x(x ${sg(-b)})`][tpl];
          return T({
            text: `Za katero vrednost $x$ je vrednost izraza $E = ${dfr(N, D)}$ enaka $0$?`,
            answer: num(a, null, [M(b, "Pri tej vrednosti je imenovalec 0, zato izraz tam ni definiran."), M(-a, "Iz $x - a = 0$ sledi $x = a$: pazi na predznak.")]),
            hint: "Razstavi števec in imenovalec. Ulomek je 0, ko je števec 0, imenovalec pa ne.",
            data: { given: [`E = ${dfr(N, D)}`], find: ["x"] },
            formula: ["x^2 + (a + b)x + ab = (x + a)(x + b)", "\\dfrac{A}{B} = 0 \\iff A = 0 \\text{ in } B \\ne 0"],
            solution: [`$E = ${dfr(`(x ${sg(-a)})(x ${sg(-b)})`, Df)}$`, `Števec je 0 pri $x = ${a}$ ali $x = ${b}$`, `Pri $x = ${b}$ je imenovalec 0 – to ni v definicijskem območju.`, `$x = ${a}$`],
          });
        }
        if (t === 1) {
          // Vsota ali razlika ulomkov: koeficient števca.
          const a = r.int(1, 7);
          let A;
          let B;
          do [A, B] = [r.int(1, 7), r.int(1, 7)];
          while (A === B);
          const minus = r.next() < 0.6;
          const p = minus ? A - B : A + B;
          const q = minus ? (A + B) * a : (A - B) * a;
          const ask = minus ? r.pick(["p", "q", "q"]) : "q";
          const val = ask === "p" ? p : q;
          const E = `${dfr(A, `x - ${a}`)} ${minus ? "-" : "+"} ${dfr(B, `x + ${a}`)}`;
          const ms = minus
            ? ask === "p"
              ? [M(A + B, "Minus pred ulomkom velja za ves razširjeni števec."), M(B - A, "Pazi na vrstni red pri odštevanju.")]
              : [M((A - B) * a, "Minus pred ulomkom spremeni predznak obema členoma razširjenega števca."), M(-(A + B) * a, "Vsak števec razširiš s faktorjem, ki manjka njegovemu imenovalcu.")]
            : [M((B - A) * a, "Vsak števec razširiš s faktorjem, ki manjka njegovemu imenovalcu."), M((A + B) * a, "Pri razširjanju drugega ulomka pazi na predznak v $x - " + a + "$.")];
          return T({
            text: `Izraz $E = ${E}$ zapiši kot en ulomek v obliki $${dfr("px + q", `x^2 - ${a * a}`)}$. Koliko je $${ask}$?`,
            answer: num(val, null, ms),
            hint: `Skupni imenovalec je $(x - ${a})(x + ${a}) = x^2 - ${a * a}$. Vsak števec pomnoži s faktorjem, ki manjka njegovemu imenovalcu.`,
            data: { given: [`E = ${E}`], find: [ask] },
            formula: ["\\dfrac{a}{b} \\pm \\dfrac{c}{d} = \\dfrac{ad \\pm bc}{bd}", "(x - a)(x + a) = x^2 - a^2"],
            solution: [
              `$E = ${dfr(`${A === 1 ? "" : A}(x + ${a}) ${minus ? "-" : "+"} ${B === 1 ? "" : B}(x - ${a})`, `x^2 - ${a * a}`)}$`,
              `$E = ${dfr(`${poly([A, A * a])} ${minus ? `- (${poly([B, -B * a])})` :`+ ${poly([B, -B * a])}`}`, `x^2 - ${a * a}`)}$`,
              `$E = ${dfr(poly([p, q]), `x^2 - ${a * a}`)}$`,
              `$${ask} = ${val}$`,
            ],
          });
        }
        // Najmanjši skupni imenovalec (izbira).
        const a = r.int(1, 8);
        const s = r.pick([1, -1]);
        const k = r.int(2, 6);
        const A = r.int(1, 9);
        const B = r.int(1, 9);
        const asX = r.next() < 0.55;
        const D2 = asX ? poly([1, s * a, 0]) : `${k}x ${sg(k * s * a)}`;
        const f = asX ? "x" : `${k}`;
        const right = `${f}(x - ${a})(x + ${a})`;
        return T({
          text: `Kateri je najmanjši skupni imenovalec ulomkov $${dfr(A, `x^2 - ${a * a}`)}$ in $${dfr(B, D2)}$?`,
          answer: pickAns(r, right, [
            [`(x^2 - ${a * a})(${D2})`, "To je skupni imenovalec, ni pa najmanjši: en dvočlenik bi nastopal dvakrat."],
            [`(x - ${a})(x + ${a})`, "Manjka faktor drugega imenovalca, ki ga prvi nima."],
            [`${f}(x ${sg(s * a)})`, "Manjka faktor prvega imenovalca, ki ga drugi nima."],
          ]),
          options_tex: true,
          hint: "Oba imenovalca razstavi. Najmanjši skupni imenovalec vsebuje vsak faktor tolikokrat, kolikor največkrat nastopa v enem imenovalcu.",
          data: { given: [`E_1 = ${dfr(A, `x^2 - ${a * a}`)}`, `E_2 = ${dfr(B, D2)}`], find: ["\\text{najmanjši skupni imenovalec}"] },
          formula: ["a^2 - b^2 = (a - b)(a + b)", "ab + ac = a(b + c)"],
          solution: [`$x^2 - ${a * a} = (x - ${a})(x + ${a})$`, `$${D2} = ${f}(x ${sg(s * a)})$`, `Najmanjši skupni imenovalec: $${right}$`],
        });
      }
      const t = r.int(0, 2);
      if (t === 0) {
        // Povprečna hitrost tja in nazaj (s se pokrajša).
        const ctx = r.pick([
          { who: (n) => `${n} ${g(n, "je kolesaril", "je kolesarila")}`, lo: 10, hi: 30 },
          { who: (n) => `${n} ${g(n, "je tekel", "je tekla")}`, lo: 6, hi: 16 },
          { who: (n) => `${n} se je z avtom ${g(n, "peljal", "peljala")}`, lo: 40, hi: 90 },
        ]);
        const nm = name(r);
        let v1;
        let v2;
        do [v1, v2] = [r.int(ctx.lo, ctx.hi), r.int(ctx.lo, ctx.hi)];
        while (Math.max(v1, v2) < 1.3 * Math.min(v1, v2));
        const v = (2 * v1 * v2) / (v1 + v2);
        const exact = Math.abs(roundHalfUp(v, 1) - v) < 1e-9;
        return T({
          text: `${ctx.who(nm)} od doma do jezera s hitrostjo $${v1}\\ \\mathrm{km/h}$, po isti poti nazaj pa s hitrostjo $${v2}\\ \\mathrm{km/h}$. Kolikšna je povprečna hitrost za vso pot? Dolžino poti označi s $s$. Rezultat zaokroži na eno decimalko.`,
          answer: num(v, 1, [M((v1 + v2) / 2, "Povprečna hitrost ni povprečje hitrosti: počasneje se vozi dlje časa."), M((v1 * v2) / (v1 + v2), "Celotna pot je $2s$, ne $s$.")], "km/h"),
          hint: "Zapiši čas za pot tja in čas za pot nazaj kot ulomka s $s$, ju seštej in deli celotno pot s celotnim časom.",
          data: { given: [`v_1 = ${v1}\\ \\mathrm{km/h}`, `v_2 = ${v2}\\ \\mathrm{km/h}`], find: ["\\bar{v}"] },
          formula: ["t = \\dfrac{s}{v_1} + \\dfrac{s}{v_2}", "\\bar{v} = \\dfrac{2s}{t}"],
          solution: [
            `$t = \\dfrac{s}{${v1}} + \\dfrac{s}{${v2}} = \\dfrac{${v2}s + ${v1}s}{${v1 * v2}} = \\dfrac{${v1 + v2}s}{${v1 * v2}}$`,
            `$\\bar{v} = \\dfrac{2s}{t} = \\dfrac{2s \\cdot ${v1 * v2}}{${v1 + v2}s} = \\dfrac{${2 * v1 * v2}}{${v1 + v2}}$`,
            `$\\bar{v} ${exact ? "=" : "\\approx"} ${exact ? tx(v) : tx(v, 1)}\\ \\mathrm{km/h}$`,
          ],
        });
      }
      if (t === 1) {
        // Skupno delo: 1/a + 1/b.
        let a;
        let b;
        do [a, b] = [r.int(2, 12), r.int(2, 12)];
        while (a >= b || (60 * a * b) % (a + b));
        const Tm = (60 * a * b) / (a + b);
        const ctx = r.pick([
          ["Prva cev sama napolni bazen", "druga sama", "Koliko minut potrebujeta, da ga napolnita skupaj?", "Obe cevi skupaj napolnita bazen", "Koliko ur potrebuje druga cev sama?"],
          ["Prvi pleskar sam prepleska dvorano", "drugi sam", "Koliko minut potrebujeta, da jo prepleskata skupaj?", "Skupaj jo prepleskata", "Koliko ur potrebuje drugi pleskar sam?"],
          ["Prvi stroj sam opravi naročilo", "drugi sam", "Koliko minut potrebujeta, da ga opravita skupaj?", "Oba stroja skupaj ga opravita", "Koliko ur potrebuje drugi stroj sam?"],
        ]);
        const hT = (n) => `$${n}$ ${nOf(n, "uri", "urah", "urah", "urah").split(" ")[1]}`;
        if (r.next() < 0.6) {
          return T({
            text: `${ctx[0]} v ${hT(a)}, ${ctx[1]} v ${hT(b)}. ${ctx[2]}`,
            answer: num(Tm, null, [M(((a + b) / 2) * 60, "Skupni čas ni povprečje obeh časov; skupaj delata hitreje kot vsak posebej."), M((60 * (a + b)) / (a * b), "Vsota $\\dfrac{1}{a} + \\dfrac{1}{b}$ je del dela v eni uri; čas je njena obratna vrednost."), M((a * b) / (a + b), "Rezultat je v urah; pretvori ga v minute.")]),
            hint: "V eni uri prvi opravi $\\dfrac{1}{a}$ dela, drugi $\\dfrac{1}{b}$. Seštej ulomka.",
            data: { given: [`t_1 = ${a}\\ \\mathrm{h}`, `t_2 = ${b}\\ \\mathrm{h}`], find: ["t"] },
            formula: ["\\dfrac{1}{t} = \\dfrac{1}{t_1} + \\dfrac{1}{t_2}"],
            solution: [`$\\dfrac{1}{${a}} + \\dfrac{1}{${b}} = \\dfrac{${b} + ${a}}{${a * b}} = ${ft(a + b, a * b)}$ dela na uro`, `$t = ${ft(a * b, a + b)}\\ \\mathrm{h}$`, `$t = ${ft(a * b, a + b)} \\cdot 60\\ \\mathrm{min} = ${Tm}\\ \\mathrm{min}$`],
          });
        }
        return T({
          text: `${ctx[0]} v ${hT(a)}. ${ctx[3]} v $${Tm}$ minutah. ${ctx[4]}`,
          answer: num(b, null, [M(roundHalfUp(a - Tm / 60, 4), "Časov ne odštevamo; odštevamo dele dela, opravljene v eni uri."), M(roundHalfUp((a * Tm) / 60 / (a + Tm / 60), 4), "Drugi sam dela počasneje kot oba skupaj: $\\dfrac{1}{t_2} = \\dfrac{1}{t} - \\dfrac{1}{t_1}$.")]),
          hint: "Skupni čas pretvori v ure. V eni uri oba skupaj opravita $\\dfrac{1}{t}$ dela; od tega odštej delež prvega.",
          data: { given: [`t_1 = ${a}\\ \\mathrm{h}`, `t = ${Tm}\\ \\mathrm{min}`], find: ["t_2"] },
          formula: ["\\dfrac{1}{t_2} = \\dfrac{1}{t} - \\dfrac{1}{t_1}"],
          solution: [`$t = ${Tm}\\ \\mathrm{min} = ${dfr(Tm, 60)}\\ \\mathrm{h} = ${ft(Tm, 60)}\\ \\mathrm{h}$`, `$\\dfrac{1}{t_2} = ${ft(60, Tm)} - \\dfrac{1}{${a}} = ${ft(1, b)}$`, `$t_2 = ${b}\\ \\mathrm{h}$`],
        });
      }
      // Dvojni ulomek (izbira).
      const a = r.int(1, 9);
      if (r.next() < 0.5) {
        const E = dfr(`1 - ${dfr(a, "x")}`, `x - ${dfr(a * a, "x")}`);
        const right = dfr(1, `x + ${a}`);
        return T({
          text: `Poenostavi dvojni ulomek $E = ${E}$ (za $x \\ne 0$, $x \\ne \\pm ${a}$).`,
          answer: pickAns(r, right, [
            [dfr(1, `x - ${a}`), `Razstavi $x^2 - ${a * a}$ = $(x - ${a})(x + ${a})$ in preveri, kateri faktor se pokrajša.`],
            [dfr("x", `x + ${a}`), "Imenovalca $x$ v števcu in imenovalcu dvojnega ulomka se pokrajšata."],
            [dfr(`(x - ${a})(x^2 - ${a * a})`, "x^2"), "Pri deljenju z ulomkom pomnožiš z obratno vrednostjo."],
          ]),
          options_tex: true,
          hint: "Števec in imenovalec dvojnega ulomka zapiši vsakega kot en ulomek, nato deli (pomnoži z obratno vrednostjo).",
          data: { given: [`E = ${E}`], find: ["E"] },
          formula: ["\\dfrac{a}{b} : \\dfrac{c}{d} = \\dfrac{a}{b} \\cdot \\dfrac{d}{c}", "a^2 - b^2 = (a - b)(a + b)"],
          solution: [`Števec: $${dfr(`x - ${a}`, "x")}$, imenovalec: $${dfr(`x^2 - ${a * a}`, "x")}$`, `$E = ${dfr(`x - ${a}`, "x")} \\cdot ${dfr("x", `(x - ${a})(x + ${a})`)}$`, `$E = ${right}$`],
        });
      }
      const E = dfr(`${dfr("x", a)} - ${dfr(a, "x")}`, `${dfr(1, a)} + ${dfr(1, "x")}`);
      const right = `x - ${a}`;
      return T({
        text: `Poenostavi dvojni ulomek $E = ${E}$ (za $x \\ne 0$, $x \\ne -${a}$).`,
        answer: pickAns(r, right, [
          [`x + ${a}`, `Razstavi $x^2 - ${a * a}$ = $(x - ${a})(x + ${a})$ in preveri, kateri faktor se pokrajša.`],
          [dfr(`x - ${a}`, `${mono(a, "x")}`), `Skupni imenovalec $${mono(a, "x")}$ nastopa v števcu in imenovalcu dvojnega ulomka, zato se pokrajša.`],
          [dfr(1, `x - ${a}`), "Pri deljenju z ulomkom pomnožiš z obratno vrednostjo delitelja, ne deljenca."],
        ]),
        options_tex: true,
        hint: "Števec in imenovalec dvojnega ulomka zapiši vsakega kot en ulomek s skupnim imenovalcem, nato deli.",
        data: { given: [`E = ${E}`], find: ["E"] },
        formula: ["\\dfrac{a}{b} : \\dfrac{c}{d} = \\dfrac{a}{b} \\cdot \\dfrac{d}{c}", "a^2 - b^2 = (a - b)(a + b)"],
        solution: [`Števec: $${dfr(`x^2 - ${a * a}`, `${mono(a, "x")}`)}$, imenovalec: $${dfr(`x + ${a}`, `${mono(a, "x")}`)}$`, `$E = ${dfr(`(x - ${a})(x + ${a})`, `${mono(a, "x")}`)} \\cdot ${dfr(`${mono(a, "x")}`, `x + ${a}`)}$`, `$E = ${right}$`],
      });
    },
  },

  // ================= sistemi linearnih enačb =================
  {
    id: "gim-sistemi-dop",
    topics: [TP("sistemi-linearnih-enacb")],
    gen(level, r) {
      if (level === 1) {
        if (r.next() < 0.5) {
          // Število rešitev (pojmovno, grafični pomen).
          const kind = r.pick(["one", "none", "inf"]);
          let a1;
          let b1;
          let c1;
          let a2;
          let b2;
          let c2;
          const m = r.pick([2, 3, -1, -2]);
          for (;;) {
            [a1, b1] = [r.nonZero(-5, 5), r.nonZero(-5, 5)];
            c1 = r.int(-9, 9);
            if (kind === "one") {
              [a2, b2] = [r.nonZero(-5, 5), r.nonZero(-5, 5)];
              c2 = r.int(-9, 9);
              if (a1 * b2 - a2 * b1 === 0) continue;
            } else {
              [a2, b2] = [m * a1, m * b1];
              c2 = kind === "inf" ? m * c1 : m * c1 + r.nonZero(-4, 4);
            }
            if (gcd(Math.abs(a1), gcd(Math.abs(b1), Math.abs(c1))) !== 1) continue;
            break;
          }
          const e1 = `${lin2(a1, b1)} = ${c1}`;
          const e2 = `${lin2(a2, b2)} = ${c2}`;
          const L = { one: "natanko eno rešitev", none: "nobene rešitve", inf: "neskončno mnogo rešitev" };
          const W = {
            one: { none: "Koeficienta pri $x$ in $y$ nista v enakem razmerju, zato premici nista vzporedni.", inf: "Enačbi nista večkratnik ena druge, zato premici ne sovpadata." },
            none: { one: "Levi strani sta sorazmerni: premici sta vzporedni in se ne sekata.", inf: "Desni strani nista v enakem razmerju kot levi: premici sta vzporedni, a različni." },
            inf: { one: "Druga enačba je večkratnik prve: premici sovpadata.", none: "Tudi desni strani sta v enakem razmerju: premici sovpadata." },
          }[kind];
          const wrongs = ["one", "none", "inf"].filter((k) => k !== kind).map((k) => [L[k], W[k]]);
          wrongs.push(["natanko dve rešitvi", "Dve premici imata največ eno skupno točko ali pa sovpadata – natanko dveh rešitev ni."]);
          const sol =
            kind === "one"
              ? [`$${a1} \\cdot ${par(b2)} = ${a1 * b2}$, $${a2} \\cdot ${par(b1)} = ${a2 * b1}$: $a_1 b_2 \\ne a_2 b_1$, koeficienta nista sorazmerna`, "Premici se sekata v eni točki.", `Sistem ima ${L[kind]}.`]
              : [`Leva stran druge enačbe je $${m}$-kratnik leve strani prve.`, `Desni strani: $${m} \\cdot ${par(c1)} = ${m * c1} ${kind === "inf" ? "=" : "\\ne"} ${c2}$`, kind === "inf" ? "Premici sovpadata." : "Premici sta vzporedni in različni.", kind === "none" ? "Sistem nima nobene rešitve." : `Sistem ima ${L[kind]}.`];
          return T({
            text: r.pick([`Koliko rešitev ima sistem enačb $${e1}$, $${e2}$?`, `Brez reševanja ugotovi, koliko rešitev ima sistem $${e1}$ in $${e2}$.`]),
            answer: pickAns(r, L[kind], wrongs),
            hint: "Primerjaj razmerje koeficientov pri $x$, pri $y$ in desnih strani obeh enačb.",
            data: { given: [e1, e2], find: ["\\text{število rešitev}"] },
            formula: ["\\dfrac{a_1}{a_2} \\ne \\dfrac{b_1}{b_2}: \\text{ ena rešitev}", "\\dfrac{a_1}{a_2} = \\dfrac{b_1}{b_2} \\ne \\dfrac{c_1}{c_2}: \\text{ ni rešitve}", "\\dfrac{a_1}{a_2} = \\dfrac{b_1}{b_2} = \\dfrac{c_1}{c_2}: \\text{ neskončno rešitev}"],
            solution: sol,
          });
        }
        // Neznani koeficient: (x0, y0) je rešitev sistema.
        let x0;
        let y0;
        do [x0, y0] = [r.nonZero(-5, 5), r.nonZero(-5, 5)];
        while (x0 === y0 || x0 === -y0);
        const [a1, b1] = [r.nonZero(-4, 4), r.nonZero(-4, 4)];
        const c1 = a1 * x0 + b1 * y0;
        const [a2, b2] = [r.nonZero(-6, 6), r.nonZero(-6, 6)];
        const c2 = a2 * x0 + b2 * y0;
        const ask = r.pick(["a", "b", "c"]);
        const e1 = `${lin2(a1, b1)} = ${c1}`;
        const e2 = ask === "a" ? `ax ${b2 < 0 ? "-" : "+"} ${mono(Math.abs(b2), "y")} = ${c2}` : ask === "b" ? `${mono(a2, "x")} + by = ${c2}` : `${lin2(a2, b2)} = c`;
        const val = { a: a2, b: b2, c: c2 }[ask];
        const ms = {
          a: [M((c2 - b2 * x0) / y0, "Prva koordinata para je $x$, druga $y$."), M((c2 + b2 * y0) / x0, "Pazi na predznak, ko člen preneseš na drugo stran.")],
          b: [M((c2 - a2 * y0) / x0, "Prva koordinata para je $x$, druga $y$."), M((c2 + a2 * x0) / y0, "Pazi na predznak, ko člen preneseš na drugo stran.")],
          c: [M(a2 * y0 + b2 * x0, "Prva koordinata para je $x$, druga $y$."), M(a2 * x0 - b2 * y0, "Pazi na predznak pri vstavljanju negativnih števil.")],
        }[ask];
        const ins = ask === "a" ? `${x0 === 1 ? "" : par(x0)}a ${sg(b2)} \\cdot ${par(y0)} = ${c2}` : ask === "b" ? `${a2} \\cdot ${par(x0)} + ${y0 === 1 ? "" : par(y0)}b = ${c2}` : `c = ${a2} \\cdot ${par(x0)} ${sg(b2)} \\cdot ${par(y0)}`;
        return T({
          text: `Urejeni par $(${x0}, ${y0})$ je rešitev sistema $${e1}$, $${e2}$. Koliko je $${ask}$?`,
          answer: num(val, null, ms),
          hint: "Rešitev sistema zadošča obema enačbama: vstavi $x$ in $y$ v drugo enačbo.",
          data: { given: [`x = ${x0}`, `y = ${y0}`, e2], find: [ask] },
          formula: "a_2 x_0 + b_2 y_0 = c_2",
          solution: [`Preverba v 1. enačbi: $${a1} \\cdot ${par(x0)} ${sg(b1)} \\cdot ${par(y0)} = ${c1}$ ✓`, `$${ins}$`, ask === "c" ? null : `$${ask === "a" ? `${mono(x0, "a")} = ${c2 - b2 * y0}` : `${mono(y0, "b")} = ${c2 - a2 * x0}`}$`, `$${ask} = ${val}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          // Sistem z ulomki: najprej odpravi ulomke.
          let p;
          let q;
          let i;
          let j;
          let a2;
          let b2;
          for (;;) {
            [p, q] = [r.int(2, 6), r.int(2, 6)];
            [i, j] = [r.nonZero(-4, 4), r.nonZero(-4, 4)];
            [a2, b2] = [r.pick([1, 1, 2, -1]), r.pick([1, -1, 2, -2])];
            if (p === q || i + j === 0) continue;
            if (b2 * q === a2 * p) continue; // det(1/p, 1/q; a2, b2) = b2/p − a2/q ≠ 0
            break;
          }
          const x0 = p * i;
          const y0 = q * j;
          const c1 = i + j;
          const c2 = a2 * x0 + b2 * y0;
          const L = lcm(p, q);
          const [A1, B1, C1] = [L / p, L / q, L * c1];
          const e1 = `${dfr("x", p)} + ${dfr("y", q)} = ${c1}`;
          const e2 = `${lin2(a2, b2)} = ${c2}`;
          const askX = r.next() < 0.5;
          const val = askX ? x0 : y0;
          // Napaka: pomnožil le levo stran (desna ostane c1).
          const det = A1 * b2 - a2 * B1;
          const wx = (c1 * b2 - c2 * B1) / det;
          const wy = (A1 * c2 - a2 * c1) / det;
          const Dx = C1 * b2 - c2 * B1;
          return T({
            text: `Reši sistem enačb $${e1}$, $${e2}$. Koliko je $${askX ? "x" : "y"}$?`,
            answer: num(val, null, [M(askX ? y0 : x0, `To je vrednost ${askX ? "$y$" : "$x$"}.`), M(roundHalfUp(askX ? wx : wy, 6), "Ko enačbo pomnožiš, da odpraviš ulomke, pomnoži tudi desno stran.")]),
            hint: `Prvo enačbo pomnoži s skupnim imenovalcem $${L}$, nato reši sistem brez ulomkov.`,
            data: { given: [e1, e2], find: [askX ? "x" : "y"] },
            formula: "\\dfrac{x}{p} + \\dfrac{y}{q} = c \\;\\Big|\\cdot pq",
            solution: [
              `$${L} \\cdot$ (1. enačba): $${lin2(A1, B1)} = ${C1}$`,
              `Odpravimo $y$: $${b2} \\cdot$ (nova 1. enačba) $- ${par(B1)} \\cdot$ (2. enačba)`,
              `$${mono(det, "x")} = ${Dx}$, $x = ${x0}$`,
              `Iz 2. enačbe: $${mono(b2, "y")} = ${c2} ${sg(-a2 * x0)} = ${b2 * y0}$, $y = ${y0}$`,
            ],
          });
        }
        if (t === 1) {
          // Premica skozi dve točki: sistem za k in n.
          const k = r.nonZero(-4, 4);
          const n = r.int(-8, 8);
          let x1;
          let x2;
          do [x1, x2] = [r.int(-5, 5), r.int(-5, 5)];
          while (x1 >= x2);
          const [y1, y2] = [k * x1 + n, k * x2 + n];
          const askK = r.next() < 0.5;
          const ms = askK
            ? [M(y2 !== y1 ? (x2 - x1) / (y2 - y1) : NaN, "Smerni koeficient je razlika $y$ deljeno z razliko $x$, ne obratno."), M(-k, "Pri odštevanju enačb pazi na predznake.")]
            : [M(y1 + k * x1, "Iz $y_1 = kx_1 + n$ sledi $n = y_1 - kx_1$: pazi na predznak."), M(-n, "Pri odštevanju enačb pazi na predznake.")];
          return T({
            text: `Premica $y = kx + n$ poteka skozi točki $A(${x1}, ${y1})$ in $B(${x2}, ${y2})$. Zapiši sistem dveh enačb za $k$ in $n$ ter ga reši. Koliko je $${askK ? "k" : "n"}$?`,
            answer: num(askK ? k : n, null, ms),
            zeroOk: !askK,
            hint: "Koordinati vsake točke vstavi v $y = kx + n$. Dobiš dve enačbi; odštej ju, da odpraviš $n$.",
            data: { given: [`x_A = ${x1}`, `y_A = ${y1}`, `x_B = ${x2}`, `y_B = ${y2}`], find: [askK ? "k" : "n"] },
            formula: ["y_A = k x_A + n", "y_B = k x_B + n"],
            solution: [
              x1 === 0 ? `$${y1} = n$` : `$${y1} = ${mono(x1, "k")} + n$`,
              x2 === 0 ? `$${y2} = n$` : `$${y2} = ${mono(x2, "k")} + n$`,
              `Odštejemo: $${y2 - y1} = ${mono(x2 - x1, "k")}$, $k = ${k}$`,
              `$n = ${y1}${k * x1 ? ` ${sg(-k * x1)}` : ""} = ${n}$`,
            ],
          });
        }
        // Nakup dveh vrst izdelkov.
        const items = r.pick([
          [["zvezek", "zvezka", "zvezke", "zvezkov"], ["svinčnik", "svinčnika", "svinčnike", "svinčnikov"], [120, 350], [40, 150]],
          [["kroasan", "kroasana", "kroasane", "kroasanov"], ["jogurt", "jogurta", "jogurte", "jogurtov"], [90, 220], [50, 150]],
          [["lonček barve", "lončka barve", "lončke barve", "lončkov barve"], ["čopič", "čopiča", "čopiče", "čopičev"], [250, 600], [80, 300]],
        ]);
        let a1;
        let b1;
        let a2;
        let b2;
        do [a1, b1, a2, b2] = [r.int(1, 6), r.int(1, 6), r.int(1, 6), r.int(1, 6)];
        while (a1 * b2 - a2 * b1 === 0);
        const X = r.int(items[2][0] / 10, items[2][1] / 10) * 10;
        let Y;
        do Y = r.int(items[3][0] / 10, items[3][1] / 10) * 10;
        while (Y === X);
        const C1 = a1 * X + b1 * Y;
        const C2 = a2 * X + b2 * Y;
        const [n1, n2] = [name(r), name(r)];
        const it = (k, i) => nOf(k, ...items[i]).replace(/^(\d+)/, "$$$1$$");
        const askX = r.next() < 0.5;
        const det = a1 * b2 - a2 * b1;
        return T({
          text: `${n1} je za ${it(a1, 0)} in ${it(b1, 1)} ${g(n1, "plačal", "plačala")} $${tx(C1 / 100, 2)}$ €, ${n2 === n1 ? "prijatelj" : n2} pa za ${it(a2, 0)} in ${it(b2, 1)} $${tx(C2 / 100, 2)}$ €. Koliko stane en ${askX ? items[0][0] : items[1][0]}?`,
          answer: eur((askX ? X : Y) / 100, [M((askX ? Y : X) / 100, "To je cena drugega izdelka."), M(roundHalfUp(C1 / 100 / (a1 + b1), 2), "Izdelka nista enako draga – postavi sistem dveh enačb.")]),
          hint: "Ceno enega in drugega izdelka označi z $x$ in $y$ ter zapiši dve enačbi. Reši ju z nasprotnimi koeficienti.",
          data: { given: [`${lin2(a1, b1)} = ${tx(C1 / 100, 2)}`, `${lin2(a2, b2)} = ${tx(C2 / 100, 2)}`], find: [askX ? "x" : "y"] },
          formula: ["a_1 x + b_1 y = c_1", "a_2 x + b_2 y = c_2"],
          solution: [
            `$${lin2(a1, b1)} = ${tx(C1 / 100, 2)}$, $${lin2(a2, b2)} = ${tx(C2 / 100, 2)}$`,
            `Odpravimo $y$: $${mono(det, "x")} = ${b2} \\cdot ${tx(C1 / 100, 2)} - ${b1} \\cdot ${tx(C2 / 100, 2)} = ${tx((b2 * C1 - b1 * C2) / 100, 2)}$`,
            `$x = ${tx(X / 100, 2)}$ €`,
            `Iz 1. enačbe: $${mono(b1, "y")} = ${tx(C1 / 100, 2)} - ${a1} \\cdot ${tx(X / 100, 2)} = ${tx((b1 * Y) / 100, 2)}$, $y = ${tx(Y / 100, 2)}$ €`,
          ],
        });
      }
      const t = r.int(0, 2);
      if (t === 0) {
        // Mešanje raztopin.
        for (;;) {
          const p1 = r.pick([5, 10, 12, 15, 20]);
          const p2 = r.pick([25, 30, 35, 40, 50]);
          const x = r.int(2, 30) * 10;
          const y = r.int(2, 30) * 10;
          const m = x + y;
          if ((p1 * x + p2 * y) % m) continue;
          const p = (p1 * x + p2 * y) / m;
          if (p === p1 || p === p2) continue;
          const askX = r.next() < 0.5;
          return T({
            text: `Raztopino sladkorja z masnim deležem $${p1}\\ \\%$ zmešamo z raztopino z masnim deležem $${p2}\\ \\%$ in dobimo $${m}\\ \\mathrm{g}$ raztopine z masnim deležem $${p}\\ \\%$. Koliko gramov ${askX ? "prve" : "druge"} raztopine smo uporabili?`,
            answer: num(askX ? x : y, null, [M(askX ? y : x, `To je masa ${askX ? "druge" : "prve"} raztopine.`), M(m / 2, "Raztopini nista nujno v enakem razmerju – postavi sistem za maso raztopine in maso sladkorja.")], "g"),
            hint: "Naj bo $x$ masa prve in $y$ masa druge raztopine. Ena enačba velja za maso raztopine, druga za maso sladkorja.",
            data: { given: [`w_1 = ${p1}\\ \\%`, `w_2 = ${p2}\\ \\%`, `m = ${m}\\ \\mathrm{g}`, `w = ${p}\\ \\%`], find: [askX ? "x" : "y"] },
            formula: ["x + y = m", "w_1 x + w_2 y = w \\cdot m"],
            solution: [
              `$x + y = ${m}$, $${tx(p1 / 100)}x + ${tx(p2 / 100)}y = ${tx(p / 100)} \\cdot ${m} = ${tx((p * m) / 100)}$`,
              `Drugo enačbo pomnožimo s 100: $${p1}x + ${p2}y = ${p * m}$`,
              `$y = ${m} - x$: $${p1}x + ${p2}(${m} - x) = ${p * m}$, $${p2 - p1}x = ${p2 * m - p * m}$`,
              `$x = ${x}\\ \\mathrm{g}$, $y = ${y}\\ \\mathrm{g}$`,
            ],
          });
        }
      }
      if (t === 1) {
        // Čoln na reki.
        for (;;) {
          const t1 = r.int(1, 4);
          const t2 = r.int(t1 + 1, 6);
          const c = r.int(1, 6);
          const s = lcm(t1, t2) * c;
          const d = s / t1;
          const w = s / t2;
          if ((d - w) % 2 || s > 120 || w < 4) continue;
          const v = (d + w) / 2;
          const u = (d - w) / 2;
          if (u > 8) continue;
          const askU = r.next() < 0.5;
          const hT = (n) => nOf(n, "uri", "urah", "urah", "urah").replace(/^(\d+)/, "$$$1$$");
          return T({
            text: `Čoln prepluje $${s}\\ \\mathrm{km}$ po reki navzdol v ${hT(t1)}, enako pot proti toku pa v ${hT(t2)}. Kolikšna je hitrost ${askU ? "rečnega toka" : "čolna v mirujoči vodi"}? Hitrosti sta stalni.`,
            answer: num(askU ? u : v, null, [M(askU ? v : u, `To je hitrost ${askU ? "čolna v mirujoči vodi" : "toka"}.`), M(askU ? d - w : d + w, "Razliko (vsoto) hitrosti moraš še razpoloviti.")], "km/h"),
            hint: "Naj bo $v$ hitrost čolna v mirujoči vodi in $u$ hitrost toka. Po toku je hitrost $v + u$, proti toku $v - u$.",
            data: { given: [`s = ${s}\\ \\mathrm{km}`, `t_1 = ${t1}\\ \\mathrm{h}`, `t_2 = ${t2}\\ \\mathrm{h}`], find: [askU ? "u" : "v"] },
            formula: ["v + u = \\dfrac{s}{t_1}", "v - u = \\dfrac{s}{t_2}"],
            solution: [`$v + u = \\dfrac{${s}}{${t1}} = ${d}$`, `$v - u = \\dfrac{${s}}{${t2}} = ${w}$`, `Seštejemo: $2v = ${d + w}$, $v = ${v}\\ \\mathrm{km/h}$`, `$u = ${d} - ${v} = ${u}\\ \\mathrm{km/h}$`],
          });
        }
      }
      // Dvomestno število (števki).
      let a;
      let b;
      do [a, b] = [r.int(1, 9), r.int(1, 9)];
      while (a === b);
      const S = a + b;
      const D = 9 * Math.abs(a - b);
      const bigger = b > a;
      return T({
        text: `Vsota števk dvomestnega števila je $${S}$. Če števki zamenjamo, dobimo število, ki je za $${D}$ ${bigger ? "večje" : "manjše"} od prvotnega. Katero je prvotno število?`,
        answer: num(10 * a + b, null, [M(10 * b + a, "To je število z zamenjanima števkama."), M(a, "To je le števka desetic; vprašanje je celo število.")]),
        hint: "Naj bo $x$ števka desetic in $y$ števka enic. Število je $10x + y$, z zamenjanima števkama $10y + x$.",
        data: { given: [`x + y = ${S}`, `\\Delta = ${D}`], find: ["10x + y"] },
        formula: ["x + y = S", `(10y + x) - (10x + y) = ${bigger ? "" : "-"}\\Delta`],
        solution: [`$x + y = ${S}$`, `$(10y + x) - (10x + y) = ${bigger ? D : -D}$, torej $9(y - x) = ${bigger ? D : -D}$, $y - x = ${b - a}$`, `$2y = ${S + b - a}$, $y = ${b}$, $x = ${a}$`, `Število: $${10 * a + b}$`],
      });
    },
  },
];

export const GIMNAZIJA_MAT_SS1 = wrapGens(GENS);
