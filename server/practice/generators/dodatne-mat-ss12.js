// Generatorji za teme, ki prej niso imele nalog (mat-ss12: gimnazija, 1. in 2. letnik). Merila: docs/kakovost.md §2.
// Vsak generator izračuna števila in pravilen odgovor v kodi iz istih (zaokroženih) števil, kot so v besedilu.
// Kadar je rezultat izraz, ga vprašamo kot število (koeficient, vrednost pri danem x, eksponent) ali kot izbiro (options_tex).
import { NAMES, g } from "../rng.js";
import { roundHalfUp, gcd } from "../check.js";
import { tx } from "./mat.js";

// ---------- pomožne funkcije ----------
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const unitTex = (u) => (u.startsWith("\\") ? u : `\\mathrm{${u.replace("²", "^2").replace("³", "^3")}}`);
const qty = (val, unit) => `${val}\\ ${unitTex(unit)}`;
const dat = (sym, val, unit) => `${sym} = ${unit ? qty(val, unit) : val}`;
const needsRounding = (x, d) => d != null && Math.abs(x - roundHalfUp(x, d)) > 1e-9;
const eq = (x, d) => (needsRounding(x, d) ? "\\approx" : "=");
const deg = (x) => `${tx(x)}^\\circ`;
const dfr = (n, d) => `\\dfrac{${n}}{${d}}`;
const sum = (a) => a.reduce((s, x) => s + x, 0);
const lcm = (a, b) => (a / gcd(a, b)) * b;
const isPrime = (n) => n > 1 && range(2, Math.floor(Math.sqrt(n))).every((k) => n % k);
const divisors = (n) => range(1, n).filter((k) => n % k === 0);
const rad = (a) => (a * Math.PI) / 180;
const DEG_ALT = ["stopinj", "stopinje", "stopinja"];
// Okrajšan ulomek z (od 0 različnim) pozitivnim imenovalcem.
function red(n, d) {
  if (d < 0) [n, d] = [-n, -d];
  const k = gcd(n, d);
  return [n / k, d / k];
}
// Ulomek za TeX: ft(-3, 6) → "-\dfrac{1}{2}", ft(4, 2) → "2".
function ft(n, d = 1) {
  [n, d] = red(n, d);
  if (d === 1) return `${n}`;
  return n < 0 ? `-${dfr(-n, d)}` : dfr(n, d);
}
// Kot ft, negativno v oklepaju (za drugi operand).
const pf = (n, d = 1) => (n * d < 0 ? `\\left(${ft(n, d)}\\right)` : ft(n, d));
// Neokrajšan ulomek s predznakom v števcu (za vmesne korake): fu(3, -12) → "-\dfrac{3}{12}".
const fu = (n, d) => (n * d < 0 ? `-${dfr(Math.abs(n), Math.abs(d))}` : dfr(Math.abs(n), Math.abs(d)));
const pfu = (n, d) => (n * d < 0 ? `\\left(${fu(n, d)}\\right)` : fu(n, d));
// Predlog s/z pred številom (s 3, s 6, z 9, z 12 …).
const SZ = { 2: "z", 3: "s", 4: "s", 5: "s", 6: "s", 9: "z", 12: "z", 15: "s", 18: "z" };
const par = (x) => (x < 0 ? `(${x})` : `${x}`);
// Predznačen člen za nadaljevanje izraza: sg(-3) → "- 3", sg(4) → "+ 4".
const sg = (n) => (n < 0 ? `- ${-n}` : `+ ${n}`);
// Linearni faktor z ničlo r: xf(3) → "(x - 3)", xf(0) → "x".
const xf = (r) => (r === 0 ? "x" : `(x ${sg(-r)})`);
// Enočlenik s koeficientom: mono(1, "x") → "x", mono(-1, "x") → "-x", mono(3, "xy") → "3xy".
const mono = (c, v) => (c === 1 ? v : c === -1 ? `-${v}` : `${c}${v}`);
// Polinom iz koeficientov od najvišje potence: poly([2, -3, 1]) → "2x^2 - 3x + 1".
function poly(cs, v = "x") {
  const n = cs.length - 1;
  let s = "";
  cs.forEach((c, i) => {
    if (c === 0) return;
    const p = n - i;
    const m = p === 0 ? "" : p === 1 ? v : `${v}^${p}`;
    const a = Math.abs(c);
    const coef = p > 0 && a === 1 ? "" : `${a}`;
    s += s === "" ? `${c < 0 ? "-" : ""}${coef}${m}` : ` ${c < 0 ? "-" : "+"} ${coef}${m}`;
  });
  return s || "0";
}
const lin = (a, b, v = "x") => poly([a, b], v);
// Linearni izraz v x in y: lin2(3, -2) → "3x - 2y".
const lin2 = (a, b) => `${mono(a, "x")} ${b < 0 ? "-" : "+"} ${mono(Math.abs(b), "y")}`;
// Racionalna števila kot [števec, imenovalec].
const q = (n, d = 1) => red(n, d);
const qadd = (a, b) => q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const qsub = (a, b) => q(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const qmul = (a, b) => q(a[0] * b[0], a[1] * b[1]);
const qdiv = (a, b) => q(a[0] * b[1], a[1] * b[0]);
const qpow = (a, n) => (n >= 0 ? q(a[0] ** n, a[1] ** n) : q(a[1] ** -n, a[0] ** -n));
const qt = (a) => ft(a[0], a[1]);
// Razcep na prafaktorje v TeX: factorTex(72) → "2^3 \cdot 3^2".
function factorTex(n) {
  const f = {};
  for (let p = 2; p * p <= n; p++) while (n % p === 0) (f[p] = (f[p] || 0) + 1), (n /= p);
  if (n > 1) f[n] = (f[n] || 0) + 1;
  return Object.entries(f)
    .map(([p, e]) => (e === 1 ? p : `${p}^${e}`))
    .join(" \\cdot ");
}
const name2 = (r) => {
  const a = r.pick(NAMES);
  let b = r.pick(NAMES);
  while (b === a) b = r.pick(NAMES);
  return [a, b];
};

// Številski odgovor s tipičnimi napakami [[vrednost, zakaj], …]; napaka, ki je enaka pravilnemu rezultatu, odpade.
function num(value, unit = null, decimals = null, mistakes = [], extra = {}) {
  const show = (v) => (decimals == null ? Number(v.toFixed(9)) : roundHalfUp(v, decimals));
  const seen = new Set([show(value)]);
  const ms = [];
  for (const [v, why] of mistakes) {
    if (!Number.isFinite(v) || ms.length >= 3) continue;
    const vv = show(v);
    if (seen.has(vv)) continue;
    seen.add(vv);
    ms.push({ value: vv, why });
  }
  const a = { type: "number", value, decimals };
  if (unit) a.unit = unit;
  if (unit === "°") a.unitAlternatives = DEG_ALT;
  if (ms.length) a.mistakes = ms;
  return { ...a, ...extra };
}
// Racionalni odgovor: celo število kot število (z napakami), sicer okrajšan ulomek a/b.
function rat(x, mistakes = []) {
  const [n, d] = red(x[0], x[1]);
  if (d === 1) return num(n, null, null, mistakes);
  return { type: "fraction", num: n, den: d };
}
// Izbirni odgovor: pravilni + napačni [[možnost, zakaj], …]; why je urejen po premešanem vrstnem redu.
function choice(r, correct, wrong) {
  const seen = new Set([correct]);
  const w = wrong.filter(([o]) => !seen.has(o) && seen.add(o)).slice(0, 3);
  const opts = r.shuffle([correct, ...w.map((x) => x[0])]);
  const m = new Map(w);
  return { type: "choice", options: opts, index: opts.indexOf(correct), why: opts.map((o) => (o === correct ? null : m.get(o))) };
}
// Sestavi nalogo; solution je seznam vrstic (prazne odpadejo).
const T = (o) => ({ ...o, solution: Array.isArray(o.solution) ? o.solution.filter(Boolean).join("\n") : o.solution });

export const DODATNE_MAT_SS12 = [
  // ---------- 1. letnik ----------
  {
    id: "dod-mat-ss12-mnozice",
    topics: ["MAT-SS-1/mnozice"],
    gen(level, r) {
      const setTex = (s) => (s.length ? `\\{${s.join(", ")}\\}` : "\\emptyset");
      const ops = (A, B) => {
        const I = A.filter((x) => B.includes(x));
        const U = [...new Set([...A, ...B])].sort((x, y) => x - y);
        return {
          cup: { tex: "A \\cup B", set: U, name: "unijo", rule: "unija vsebuje vse elemente, ki so v $A$ ali v $B$ (skupne zapišemo le enkrat)" },
          cap: { tex: "A \\cap B", set: I, name: "presek", rule: "presek vsebuje elemente, ki so v $A$ in hkrati v $B$" },
          AmB: { tex: "A \\setminus B", set: A.filter((x) => !B.includes(x)), name: "razliko", rule: "razlika $A \\setminus B$ vsebuje elemente množice $A$, ki niso v $B$" },
          BmA: { tex: "B \\setminus A", set: B.filter((x) => !A.includes(x)), name: "razliko", rule: "razlika $B \\setminus A$ vsebuje elemente množice $B$, ki niso v $A$" },
        };
      };
      const FORM = ["A \\cup B = \\{x;\\ x \\in A \\lor x \\in B\\}", "A \\cap B = \\{x;\\ x \\in A \\land x \\in B\\}", "A \\setminus B = \\{x;\\ x \\in A \\land x \\notin B\\}"];
      const msFor = (op, A, B, o) => {
        const n = o.cup.set.length;
        return {
          cup: [[A.length + B.length, "Si skupne elemente štel dvakrat? V uniji je vsak element le enkrat."], [o.cap.set.length, "To je presek – v uniji so elementi, ki so v vsaj eni od množic."]],
          cap: [[n, "To je unija – v preseku so le elementi, ki so v obeh množicah."], [o.AmB.set.length, "To je razlika A \\ B, ne presek."]],
          AmB: [[A.length, "Iz A moraš odstraniti elemente, ki so tudi v B."], [o.BmA.set.length, "Pazi na vrstni red: A \\ B ni isto kot B \\ A."]],
          BmA: [[B.length, "Iz B moraš odstraniti elemente, ki so tudi v A."], [o.AmB.set.length, "Pazi na vrstni red: B \\ A ni isto kot A \\ B."]],
        }[op];
      };
      if (level === 1) {
        const pool = r.shuffle(range(1, 15));
        const nA = r.int(4, 6);
        const nB = r.int(3, 5);
        const k = r.int(1, 3);
        const A = pool.slice(0, nA).sort((x, y) => x - y);
        const B = [...pool.slice(0, k), ...pool.slice(nA, nA + nB - k)].sort((x, y) => x - y);
        const op = r.pick(["cup", "cap", "AmB", "BmA"]);
        const o = ops(A, B);
        const O = o[op];
        const text = r.pick([
          `Dani sta množici $A = ${setTex(A)}$ in $B = ${setTex(B)}$. Koliko elementov ima množica $${O.tex}$?`,
          `Za množici $A = ${setTex(A)}$ in $B = ${setTex(B)}$ zapiši ${O.name} $${O.tex}$. Koliko elementov ima?`,
        ]);
        return T({
          text,
          answer: num(O.set.length, null, null, msFor(op, A, B, o)),
          hint: `Pojdi po elementih: ${O.rule}.`,
          data: { given: [`A = ${setTex(A)}`, `B = ${setTex(B)}`], find: [`|${O.tex}|`] },
          formula: FORM,
          solution: [`Skupni elementi: $A \\cap B = ${setTex(o.cap.set)}$`, `$${O.tex} = ${setTex(O.set)}$`, `Število elementov: $|${O.tex}| = ${O.set.length}$`],
        });
      }
      if (level === 2) {
        const n = r.pick([12, 18, 20, 24, 28, 30, 36, 40]);
        const m = r.int(12, 25);
        const k = r.int(3, 5);
        const [desc, predTex, pred] = r.pick([
          ["sodih naravnih števil", "x \\text{ je sodo}", (x) => x % 2 === 0],
          ["lihih naravnih števil", "x \\text{ je liho}", (x) => x % 2 === 1],
          ["praštevil", "x \\text{ je praštevilo}", isPrime],
          [`naravnih večkratnikov števila ${k}`, `${k} \\mid x`, (x) => x % k === 0],
        ]);
        const A = divisors(n);
        const B = range(1, m - 1).filter(pred);
        const B2 = range(1, m).filter(pred);
        const op = r.pick(["cup", "cap", "AmB", "BmA"]);
        const o = ops(A, B);
        const O = o[op];
        const ms = msFor(op, A, B, o);
        const wrongM = ops(A, B2)[op].set.length;
        ms.push([wrongM, `Množica B vsebuje le števila, manjša od ${m} – število ${m} ne spada vanjo.`]);
        return T({
          text: `Naj bo $A$ množica vseh deliteljev števila $${n}$, $B$ pa množica vseh ${desc}, manjših od $${m}$. Koliko elementov ima množica $${O.tex}$?`,
          answer: num(O.set.length, null, null, ms),
          hint: "Najprej obe množici zapiši z naštevanjem elementov, nato poišči zahtevano množico.",
          data: { given: [`A = \\{x \\in \\mathbb{N};\\ x \\mid ${n}\\}`, `B = \\{x \\in \\mathbb{N};\\ x < ${m},\\ ${predTex}\\}`], find: [`|${O.tex}|`] },
          formula: FORM,
          solution: [`$A = ${setTex(A)}$`, `$B = ${setTex(B)}$`, `$${O.tex} = ${setTex(O.set)}$`, `Število elementov: $|${O.tex}| = ${O.set.length}$`],
        });
      }
      // Stavčni deli z naslonkami (jih, se jih, jih je, si jih je) na pravem mestu.
      const C = r.pick([
        { grp: "dijakov", A: (n) => `jih $${n}$ trenira nogomet`, B: "košarko", both: "oboje", none: "jih ne trenira ne nogometa ne košarke", bothQ: "jih trenira oba športa", one: "jih trenira samo enega od obeh športov" },
        { grp: "anketirancev", A: (n) => `jih $${n}$ ima psa`, B: "mačko", both: "oboje", none: "jih nima ne psa ne mačke", bothQ: "jih ima psa in mačko", one: "jih ima samo eno od obeh živali" },
        { grp: "dijakov", A: (n) => `se jih $${n}$ uči nemščino`, B: "španščino", both: "oba jezika", none: "se jih ne uči nobenega od teh dveh jezikov", bothQ: "se jih uči obeh jezikov", one: "se jih uči samo enega od obeh jezikov" },
        { grp: "turistov", A: (n) => `jih je $${n}$ obiskalo Bled`, B: "Piran", both: "oba kraja", none: "jih ni obiskalo ne Bleda ne Pirana", bothQ: "jih je obiskalo oba kraja", one: "jih je obiskalo samo enega od obeh krajev" },
        { grp: "obiskovalcev knjižnice", A: (n) => `si jih je $${n}$ izposodilo roman`, B: "strip", both: "oboje", none: "si jih ni izposodilo ne romana ne stripa", bothQ: "si jih je izposodilo roman in strip", one: "si jih je izposodilo samo eno od obeh vrst knjig" },
      ]);
      const c = r.int(5, 9);
      const a = c + r.int(5, 12);
      const b = c + r.int(5, 12);
      const none = r.int(5, 9);
      const N = a + b - c + none;
      const t = r.int(0, 2);
      const F = ["|A \\cup B| = |A| + |B| - |A \\cap B|"];
      const venn = `Vennov diagram: samo $A$: $${a - c}$, oboje: $${c}$, samo $B$: $${b - c}$`;
      if (t === 0) {
        return T({
          text: `Od $${N}$ ${C.grp} ${C.A(a)}, $${b}$ ${C.B}, $${c}$ pa ${C.both}. Koliko ${C.none}?`,
          answer: num(none, null, null, [[N - a - b, `Si upošteval, da je ${c} oseb štetih dvakrat (v A in v B)?`], [N - a - b - c, "Presek moraš od vsote |A| + |B| odšteti, ne prišteti k odštevancem."]]),
          hint: "Najprej izračunaj, koliko jih je v uniji $A \\cup B$; tisti v preseku so v $|A| + |B|$ šteti dvakrat.",
          data: { given: [`N = ${N}`, `|A| = ${a}`, `|B| = ${b}`, `|A \\cap B| = ${c}`], find: ["N - |A \\cup B|"] },
          formula: F,
          solution: [venn, `$|A \\cup B| = ${a} + ${b} - ${c} = ${a + b - c}$`, `Zunaj obeh množic: $${N} - ${a + b - c} = ${none}$`],
        });
      }
      if (t === 1) {
        return T({
          text: `Od $${N}$ ${C.grp} ${C.A(a)} in $${b}$ ${C.B}, $${none}$ pa ${C.none}. Koliko ${C.bothQ}?`,
          answer: num(c, null, null, [[a + b - N, `Si pozabil, da ${none} oseb ni v nobeni od množic?`], [N - none, "To je število v uniji, ne v preseku."]]),
          hint: "Iz vseh odštej tiste, ki niso v nobeni množici – dobiš $|A \\cup B|$. Nato uporabi formulo za moč unije.",
          data: { given: [`N = ${N}`, `|A| = ${a}`, `|B| = ${b}`, `N - |A \\cup B| = ${none}`], find: ["|A \\cap B|"] },
          formula: F,
          solution: [`$|A \\cup B| = ${N} - ${none} = ${N - none}$`, `$|A \\cap B| = |A| + |B| - |A \\cup B| = ${a} + ${b} - ${N - none} = ${c}$`],
        });
      }
      return T({
        text: `Od $${N}$ ${C.grp} ${C.A(a)}, $${b}$ ${C.B}, $${c}$ pa ${C.both}. Koliko ${C.one}?`,
        answer: num(a + b - 2 * c, null, null, [[a + b - c, "To je cela unija – tisti, ki so v obeh množicah, ne spadajo zraven."], [a + b, "Tisti v preseku so šteti v obeh skupinah; odšteti jih moraš dvakrat."]]),
        hint: "Nariši Vennov diagram: v preseku je $|A \\cap B|$, samo v $A$ pa $|A| - |A \\cap B|$.",
        data: { given: [`N = ${N}`, `|A| = ${a}`, `|B| = ${b}`, `|A \\cap B| = ${c}`], find: ["|A \\setminus B| + |B \\setminus A|"] },
        formula: ["|A \\setminus B| = |A| - |A \\cap B|"],
        solution: [`Samo v $A$: $${a} - ${c} = ${a - c}$`, `Samo v $B$: $${b} - ${c} = ${b - c}$`, `Samo v eni množici: $${a - c} + ${b - c} = ${a + b - 2 * c}$`],
      });
    },
  },
  {
    id: "dod-mat-ss12-deljivost",
    topics: ["MAT-SS-1/naravna-in-cela-stevila"],
    gen(level, r) {
      const DV = ["D(a, b) = \\text{zmnožek skupnih prafaktorjev z najmanjšimi eksponenti}", "v(a, b) = \\text{zmnožek vseh prafaktorjev z največjimi eksponenti}"];
      const pair = (lo, hi) => {
        const d = r.int(lo, hi);
        let m;
        let n;
        do {
          m = r.int(2, 9);
          n = r.int(2, 9);
        } while (m === n || gcd(m, n) !== 1);
        return [d * m, d * n, d, d * m * n, m, n];
      };
      if (level === 1) {
        const [a, b, D, v] = pair(2, 12);
        const askD = r.next() < 0.5;
        const text = askD
          ? r.pick([`Izračunaj $D(${a}, ${b})$.`, `Določi največji skupni delitelj števil $${a}$ in $${b}$.`])
          : r.pick([`Izračunaj $v(${a}, ${b})$.`, `Določi najmanjši skupni večkratnik števil $${a}$ in $${b}$.`]);
        const dT = factorTex(D) === String(D) ? `${D}` : `${factorTex(D)} = ${D}`;
        const vT = `${factorTex(v)} = ${v}`;
        return T({
          text,
          answer: askD
            ? num(D, null, null, [[v, "To je najmanjši skupni večkratnik, ne največji skupni delitelj."], [Math.min(a, b), "Manjše število ne deli nujno večjega – preveri razcep."]])
            : num(v, null, null, [[a * b, "Zmnožek a · b je skupni večkratnik, ni pa nujno najmanjši – deli ga z D(a, b)."], [D, "To je največji skupni delitelj, ne večkratnik."]]),
          hint: "Obe števili razcepi na prafaktorje.",
          data: { given: [`a = ${a}`, `b = ${b}`], find: [askD ? "D(a, b)" : "v(a, b)"] },
          formula: DV,
          solution: [`$${a} = ${factorTex(a)}$, $${b} = ${factorTex(b)}$`, askD ? `$D(${a}, ${b}) = ${dT}$` : `$v(${a}, ${b}) = ${vT}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 3);
        if (t === 0) {
          const [a, b, D, , m, n] = pair(6, 25);
          const who = r.pick(NAMES);
          return T({
            text: `${who} ima dve letvi, dolgi $${a}\\ \\mathrm{cm}$ in $${b}\\ \\mathrm{cm}$. ${g(who, "Razžagal", "Razžagala")} ju bo na enako dolge, čim daljše kose, ne da bi kaj ostalo. Koliko kosov bo ${g(who, "dobil", "dobila")}?`,
            answer: num(m + n, null, null, [[D, "To je dolžina enega kosa; vprašanje je, koliko kosov dobiš."], [m * n, "Kose iz obeh letev seštej, ne zmnoži."]]),
            hint: "Dolžina kosa mora deliti obe dolžini in biti čim večja – to je $D(a, b)$.",
            data: { given: [dat("a", a, "cm"), dat("b", b, "cm")], find: ["\\text{število kosov}"] },
            formula: [DV[0], "\\text{število kosov} = \\dfrac{a + b}{D(a, b)}"],
            solution: [`$${a} = ${factorTex(a)}$, $${b} = ${factorTex(b)}$`, `Dolžina kosa: $D(${a}, ${b}) = ${D}\\ \\mathrm{cm}$`, `Kosi: $${a} : ${D} + ${b} : ${D} = ${m} + ${n} = ${m + n}$`],
          });
        }
        if (t === 1) {
          const [a, b, D, , m, n] = pair(2, 12);
          return T({
            text: `Pravokotno dvorišče meri $${a}\\ \\mathrm{dm}$ × $${b}\\ \\mathrm{dm}$. Tlakovati ga želimo s čim večjimi enakimi kvadratnimi ploščami, ne da bi jih rezali. Koliko plošč potrebujemo?`,
            answer: num(m * n, null, null, [[D, "To je stranica ene plošče, ne število plošč."], [m + n, "Plošče ležijo v vrsticah in stolpcih – število v vrsti pomnoži s številom vrst."]]),
            hint: "Stranica plošče mora deliti obe dimenziji dvorišča in biti čim večja.",
            data: { given: [dat("a", a, "dm"), dat("b", b, "dm")], find: ["\\text{število plošč}"] },
            formula: [DV[0], "\\text{število plošč} = \\dfrac{a}{D} \\cdot \\dfrac{b}{D}"],
            solution: [`Stranica plošče: $D(${a}, ${b}) = ${D}\\ \\mathrm{dm}$`, `V eni vrsti: $${a} : ${D} = ${m}$, vrst: $${b} : ${D} = ${n}$`, `Plošč: $${m} \\cdot ${n} = ${m * n}$`],
          });
        }
        if (t === 2) {
          const opts = [12, 15, 18, 20, 24, 30, 36, 40, 45, 48, 50, 54, 72, 75, 80, 90];
          let a;
          let b;
          let v;
          do {
            a = r.pick(opts);
            b = r.pick(opts);
            v = (a * b) / gcd(a, b);
          } while (a === b || v % 60 || v > 1800 || v === a || v === b);
          const min = v / 60;
          return T({
            text: `Svetilnik A zasveti vsakih $${a}\\ \\mathrm{s}$, svetilnik B pa vsakih $${b}\\ \\mathrm{s}$. Ravnokar sta zasvetila hkrati. Čez koliko minut bosta prvič spet zasvetila hkrati?`,
            answer: num(min, "min", null, [[v, "To je čas v sekundah – pretvori v minute."], [(a * b) / 60, "Zmnožek časov je skupni večkratnik, ni pa najmanjši."]]),
            hint: "Iščeš najmanjši čas, ki je večkratnik obeh period – $v(a, b)$.",
            data: { given: [dat("t_A", a, "s"), dat("t_B", b, "s")], find: ["t"] },
            formula: [DV[1], "1\\ \\mathrm{min} = 60\\ \\mathrm{s}"],
            solution: [`$${a} = ${factorTex(a)}$, $${b} = ${factorTex(b)}$`, `$v(${a}, ${b}) = ${factorTex(v)} = ${v}\\ \\mathrm{s}$`, `$${v}\\ \\mathrm{s} = ${min}\\ \\mathrm{min}$`],
          });
        }
        const [a, b, , v] = pair(2, 6);
        const small = Math.min(a, b);
        const big = Math.max(a, b);
        return T({
          text: `Zobnika v menjalniku imata $${big}$ in $${small}$ zob. Označena zoba se ravno dotikata. Po koliko obratih manjšega zobnika se bosta prvič spet dotikala?`,
          answer: num(v / small, null, null, [[v, "To je število zob, ki gredo mimo stika – deli ga s številom zob manjšega zobnika."], [v / big, "To je število obratov večjega zobnika."]]),
          hint: "Število zob, ki gredo mimo stika, mora biti večkratnik obeh števil zob.",
          data: { given: [dat("z_1", big), dat("z_2", small)], find: ["\\text{število obratov}"] },
          formula: [DV[1], "\\text{obrati} = \\dfrac{v(z_1, z_2)}{z_2}"],
          solution: [`$v(${big}, ${small}) = ${v}$ zob gre mimo stika`, `Manjši zobnik: $${v} : ${small} = ${v / small}$ obratov`],
        });
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const [a, b, D, v] = pair(2, 9);
        return T({
          text: `Za naravni števili $a$ in $b$ velja $D(a, b) = ${D}$ in $v(a, b) = ${v}$. Koliko je $b$, če je $a = ${a}$?`,
          answer: num(b, null, null, [[v / a, "Upoštevaj zvezo a · b = D(a, b) · v(a, b)."], [v / D, "Deliti moraš z a, ne z D."]]),
          hint: "Za vsaki naravni števili velja $a \\cdot b = D(a, b) \\cdot v(a, b)$.",
          data: { given: [`D(a, b) = ${D}`, `v(a, b) = ${v}`, `a = ${a}`], find: ["b"] },
          formula: "a \\cdot b = D(a, b) \\cdot v(a, b)",
          solution: [`$${a} \\cdot b = ${D} \\cdot ${v} = ${D * v}$`, `$b = ${D * v} : ${a} = ${b}$`, `Preverba: $${b} = ${factorTex(b)}$, $D(${a}, ${b}) = ${D}$`],
        });
      }
      if (t === 1) {
        let p;
        let s;
        let u;
        let n;
        do {
          p = r.int(1, 4);
          s = r.int(1, 3);
          u = r.int(0, 2);
          n = 2 ** p * 3 ** s * 5 ** u;
        } while (n > 3000 || n < 20);
        const cnt = (p + 1) * (s + 1) * (u + 1);
        return T({
          text: `Koliko naravnih deliteljev ima število $${n}$? (Štej tudi $1$ in $${n}$.)`,
          answer: num(cnt, null, null, [[p + s + u, "Vsak delitelj ima obliko 2^i · 3^j · 5^k; eksponente izbiraš neodvisno – možnosti zmnoži."], [p * s * (u || 1), "Eksponent je lahko tudi 0 – za 2 imaš p + 1 možnosti."], [cnt - 2, "Šteti moraš tudi 1 in samo število."]]),
          hint: "Število razcepi na prafaktorje. Delitelj dobiš tako, da za vsak prafaktor izbereš eksponent od 0 do največjega.",
          data: { given: [`n = ${n}`], find: ["\\text{število deliteljev}"] },
          formula: "n = p_1^{e_1} \\cdot p_2^{e_2} \\cdots \\;\\Rightarrow\\; \\text{deliteljev je } (e_1 + 1)(e_2 + 1)\\cdots",
          solution: [`$${n} = ${factorTex(n)}$`, `Število deliteljev: $${[p, s, u].filter((e) => e).map((e) => `(${e} + 1)`).join(" \\cdot ")} = ${cnt}$`],
        });
      }
      const PARTS = { 9: [3], 6: [3, 2], 12: [3, 4], 15: [3, 5], 18: [9, 2] };
      const RULE = { 2: "zadnja števka je soda", 3: "vsota števk je deljiva s 3", 4: "zadnji dve števki tvorita število, deljivo s 4", 5: "zadnja števka je 0 ali 5", 9: "vsota števk je deljiva z 9" };
      let k;
      let digits;
      let pos;
      let sol;
      do {
        k = r.pick([9, 6, 12, 15, 18]);
        digits = [r.int(1, 9), r.int(0, 9), r.int(0, 9), r.int(0, 9)];
        pos = r.int(1, 3);
        const val = (x) => Number(digits.map((d, i) => (i === pos ? x : d)).join(""));
        sol = range(0, 9).filter((x) => val(x) % k === 0);
        if (sol.length) {
          const x = sol[0];
          const valx = val;
          const ms = PARTS[k].map((dv) => [range(0, 9).find((y) => valx(y) % dv === 0), k === 9 ? "Za deljivost z 9 mora biti vsota števk deljiva z 9, ne le s 3." : `Število mora biti deljivo hkrati ${SZ[PARTS[k][0]]} ${PARTS[k][0]} in ${SZ[PARTS[k][1]]} ${PARTS[k][1]} – upošteval si le eno pravilo.`]);
          const shown = digits.map((d, i) => (i === pos ? "x" : d)).join("");
          const n = val(x);
          return T({
            text: `Katera je najmanjša števka $x$, za katero je število $\\overline{${shown}}$ deljivo ${SZ[k]} $${k}$?`,
            answer: num(x, null, null, ms),
            hint: k === 9 ? "Število je deljivo z $9$, ko je vsota njegovih števk deljiva z $9$." : `Število je deljivo ${SZ[k]} $${k}$, ko je deljivo ${SZ[PARTS[k][0]]} $${PARTS[k][0]}$ in ${SZ[PARTS[k][1]]} $${PARTS[k][1]}$ hkrati.`,
            data: { given: [`n = \\overline{${shown}}`, `k = ${k}`], find: ["x"] },
            formula: PARTS[k].map((dv) => `${dv} \\mid n \\iff \\text{${RULE[dv]}}`),
            solution: [
              PARTS[k].length === 1 ? `Pogoj: ${RULE[9]}.` : `Pogoja: ${RULE[PARTS[k][0]]} in ${RULE[PARTS[k][1]]}.`,
              `Preizkušamo $x = 0, 1, 2, \\ldots$: prva ustrezna je $x = ${x}$.`,
              `Preverba: $${n} : ${k} = ${n / k}$`,
            ],
          });
        }
      } while (true);
    },
  },
  {
    id: "dod-mat-ss12-racionalna",
    topics: ["MAT-SS-1/racionalna-stevila"],
    gen(level, r) {
      const fracR = (lo = 2, hi = 9, neg = true) => {
        let n;
        let d;
        do {
          d = r.int(lo, hi);
          n = neg ? r.nonZero(-9, 9) : r.int(1, d - 1);
        } while (n % d === 0);
        return q(n, d);
      };
      if (level === 1) {
        const a = fracR();
        const b = fracR();
        const op = r.pick(["+", "-", "\\cdot", ":"]);
        const res = { "+": qadd, "-": qsub, "\\cdot": qmul, ":": qdiv }[op](a, b);
        const L = lcm(a[1], b[1]);
        const A = a[0] * (L / a[1]);
        const B = b[0] * (L / b[1]);
        const steps =
          op === "+" || op === "-"
            ? [`Skupni imenovalec: $${L}$`, `$${qt(a)} ${op} ${pf(...b)} = ${fu(A, L)} ${op} ${pfu(B, L)} = ${fu(op === "+" ? A + B : A - B, L)}$`, `Okrajšamo: $${qt(res)}$`]
            : op === "\\cdot"
              ? [`$${qt(a)} \\cdot ${pf(...b)} = ${dfr(`${par(a[0])} \\cdot ${par(b[0])}`, `${a[1]} \\cdot ${b[1]}`)} = ${fu(a[0] * b[0], a[1] * b[1])}$`, `Okrajšamo: $${qt(res)}$`]
              : [`Deliti pomeni množiti z obratno vrednostjo: $${qt(a)} : ${pf(...b)} = ${qt(a)} \\cdot ${pf(b[1], b[0])}$`, `$= ${fu(a[0] * b[1], a[1] * b[0])}$`, `Okrajšamo: $${qt(res)}$`];
        return T({
          text: r.pick([
            `Izračunaj $p ${op} q$ za $p = ${qt(a)}$ in $q = ${qt(b)}$. Rezultat zapiši kot okrajšan ulomek ali celo število.`,
            `Dani sta racionalni števili $p = ${qt(a)}$ in $q = ${qt(b)}$. Koliko je $p ${op} q$? Rezultat okrajšaj.`,
          ]),
          answer: rat(res),
          hint: { "+": "Ulomka razširi na skupni imenovalec, nato seštej števca.", "-": "Ulomka razširi na skupni imenovalec, nato odštej števca – pazi na predznake.", "\\cdot": "Števec pomnoži s števcem, imenovalec z imenovalcem; pred tem lahko navzkrižno okrajšaš.", ":": "Z ulomkom deliš tako, da pomnožiš z njegovo obratno vrednostjo." }[op],
          data: { given: [`p = ${qt(a)}`, `q = ${qt(b)}`], find: [`p ${op} q`] },
          formula: { "+": "\\dfrac{a}{b} + \\dfrac{c}{d} = \\dfrac{ad + bc}{bd}", "-": "\\dfrac{a}{b} - \\dfrac{c}{d} = \\dfrac{ad - bc}{bd}", "\\cdot": "\\dfrac{a}{b} \\cdot \\dfrac{c}{d} = \\dfrac{ac}{bd}", ":": "\\dfrac{a}{b} : \\dfrac{c}{d} = \\dfrac{a}{b} \\cdot \\dfrac{d}{c}" }[op],
          solution: steps,
        });
      }
      if (level === 2) {
        const t = r.int(0, 3);
        let X;
        let lines;
        let res;
        if (t === 0) {
          let a;
          let b;
          do {
            a = r.int(0, 9);
            b = r.int(0, 9);
          } while (a === b || (a === 9 && b === 9));
          const ab = `${a}${b}`;
          const v = 10 * a + b;
          X = `0{,}\\overline{${ab}}`;
          res = q(v, 99);
          lines = [`$x = ${X}$`, `$100x = ${v}{,}\\overline{${ab}}$`, `$100x - x = ${v} \\;\\Rightarrow\\; 99x = ${v}$`, `$x = ${dfr(v, 99)} = ${qt(res)}$`];
        } else if (t === 1) {
          let a;
          let b;
          do {
            a = r.int(0, 9);
            b = r.int(1, 8);
          } while (a === b);
          X = `0{,}${a}\\overline{${b}}`;
          res = q(10 * a + b - a, 90);
          lines = [`$x = ${X}$`, `$10x = ${a}{,}\\overline{${b}}$ in $100x = ${10 * a + b}{,}\\overline{${b}}$`, `$100x - 10x = ${10 * a + b} - ${a} \\;\\Rightarrow\\; 90x = ${10 * a + b - a}$`, `$x = ${dfr(10 * a + b - a, 90)} = ${qt(res)}$`];
        } else if (t === 2) {
          const k = r.int(1, 5);
          const a = r.int(1, 8);
          X = `${k}{,}\\overline{${a}}`;
          res = q(9 * k + a, 9);
          lines = [`$x = ${X}$`, `$10x = ${10 * k + a}{,}\\overline{${a}}$`, `$10x - x = ${10 * k + a} - ${k} \\;\\Rightarrow\\; 9x = ${9 * k + a}$`, `$x = ${qt(res)}$`];
        } else {
          let v;
          do v = r.int(10, 998);
          while (v % 111 === 0);
          const s = String(v).padStart(3, "0");
          X = `0{,}\\overline{${s}}`;
          res = q(v, 999);
          lines = [`$x = ${X}$`, `$1000x = ${v}{,}\\overline{${s}}$`, `$1000x - x = ${v} \\;\\Rightarrow\\; 999x = ${v}$`, `$x = ${dfr(v, 999)} = ${qt(res)}$`];
        }
        return T({
          text: r.pick([`Periodično decimalno število $${X}$ zapiši kot okrajšan ulomek.`, `Zapiši $x = ${X}$ v obliki okrajšanega ulomka.`]),
          answer: rat(res),
          hint: "Označi število z $x$ in ga pomnoži z tako potenco števila 10, da se perioda po decimalni vejici ujema. Nato odštej.",
          data: { given: [`x = ${X}`], find: ["x \\text{ kot ulomek}"] },
          formula: "x = 0{,}\\overline{ab} \\;\\Rightarrow\\; 100x - x = ab",
          solution: lines,
        });
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const a = fracR();
        let b;
        do b = fracR();
        while (b[0] * a[1] === a[0] * b[1]);
        const m = qdiv(qadd(a, b), [2, 1]);
        return T({
          text: `Katero število leži na številski premici natanko na sredini med številoma $p = ${qt(a)}$ in $q = ${qt(b)}$? Zapiši ga kot okrajšan ulomek.`,
          answer: rat(m),
          hint: "Sredina med dvema številoma je njuna aritmetična sredina.",
          data: { given: [`p = ${qt(a)}`, `q = ${qt(b)}`], find: ["s"] },
          formula: "s = \\dfrac{p + q}{2}",
          solution: [`$p + q = ${qt(a)} + ${pf(...b)} = ${qt(qadd(a, b))}$`, `$s = ${qt(qadd(a, b))} : 2 = ${qt(m)}$`],
        });
      }
      if (t === 1) {
        let a;
        let b;
        do {
          a = q(-r.int(5, 40), r.int(2, 7));
          b = q(r.int(5, 40), r.int(2, 7));
        } while (a[1] === 1 || b[1] === 1);
        const lo = Math.ceil(a[0] / a[1]);
        const hi = Math.floor(b[0] / b[1]);
        const cnt = hi - lo + 1;
        return T({
          text: `Koliko celih števil leži na številski premici med $${qt(a)}$ in $${qt(b)}$?`,
          answer: num(cnt, null, null, [[cnt - 1, "Si pozabil šteti število 0?"], [cnt + 2, "Si krajišči zaokrožil navzven? Celi števili tik zunaj intervala ne štejeta."], [cnt + 1, "Preveri obe krajišči: celo število mora ležati strogo med danima."]]),
          hint: "Ulomka pretvori v mešani števili ali decimalni zapis in poišči najmanjše in največje celo število vmes.",
          data: { given: [`p = ${qt(a)}`, `q = ${qt(b)}`], find: ["\\text{število celih števil}"] },
          formula: "\\text{od } m \\text{ do } n \\text{ je } n - m + 1 \\text{ celih števil}",
          solution: [`$${qt(a)} \\approx ${tx(a[0] / a[1], 2)}$, $${qt(b)} \\approx ${tx(b[0] / b[1], 2)}$`, `Cela števila od $${lo}$ do $${hi}$`, `Teh je $${hi} - ${par(lo)} + 1 = ${cnt}$.`],
        });
      }
      const most = r.next() < 0.5;
      for (;;) {
        const fs = [];
        while (fs.length < 4) {
          const d = r.int(3, 12);
          const n = r.int(1, d - 1);
          if (gcd(n, d) !== 1 || fs.some((f) => f[0] * d === n * f[1] || f[1] === d)) continue;
          fs.push([n, d]);
        }
        const val = (f) => f[0] / f[1];
        const best = fs.reduce((x, y) => ((most ? val(y) > val(x) : val(y) < val(x)) ? y : x));
        const bigN = fs.reduce((x, y) => ((most ? y[0] > x[0] : y[0] < x[0]) ? y : x));
        const bigD = fs.reduce((x, y) => ((most ? y[1] > x[1] : y[1] < x[1]) ? y : x));
        if (bigN === best || bigD === best) continue;
        const labels = ["a", "b", "c", "d"];
        const why = (f) =>
          f === bigN
            ? `Ta ulomek ima ${most ? "največji" : "najmanjši"} števec, a primerjati moraš cela ulomka (na skupnem imenovalcu).`
            : f === bigD
              ? `${most ? "Večji imenovalec pomeni manjše dele" : "Manjši imenovalec pomeni večje dele"} – samo po imenovalcu ne moreš sklepati.`
              : `Ta ulomek je približno ${tx(val(f), 3).replace("{,}", ",")}, kar ni ${most ? "največ" : "najmanj"}.`;
        const c = choice(r, labels[fs.indexOf(best)], fs.filter((f) => f !== best).map((f) => [labels[fs.indexOf(f)], why(f)]));
        c.options = c.options.map((l) => `${l} = ${dfr(...fs[labels.indexOf(l)])}`);
        return T({
          text: `Kateri od ulomkov $a = ${dfr(...fs[0])}$, $b = ${dfr(...fs[1])}$, $c = ${dfr(...fs[2])}$, $d = ${dfr(...fs[3])}$ je ${most ? "največji" : "najmanjši"}?`,
          answer: c,
          options_tex: true,
          hint: "Ulomke razširi na skupni imenovalec ali jih zapiši kot decimalna števila.",
          data: { given: fs.map((f, i) => `${labels[i]} = ${dfr(...f)}`), find: [most ? "\\text{največji ulomek}" : "\\text{najmanjši ulomek}"] },
          formula: "\\dfrac{a}{b} < \\dfrac{c}{d} \\iff ad < bc \\quad (b, d > 0)",
          solution: [fs.map((f, i) => `$${labels[i]} \\approx ${tx(val(f), 3)}$`).join(", "), `${most ? "Največji" : "Najmanjši"} je $${labels[fs.indexOf(best)]} = ${dfr(...best)}$.`],
        });
      }
    },
  },
  {
    id: "dod-mat-ss12-intervali",
    topics: ["MAT-SS-1/realna-stevila-in-intervali"],
    gen(level, r) {
      const ivTex = (l, lc, h, hc) => `${lc ? "[" : "("}${l}, ${h}${hc ? "]" : ")"}`;
      const intsIn = (l, lc, h, hc) => range(Math.ceil(l) - 1, Math.floor(h) + 1).filter((x) => (lc ? x >= l : x > l) && (hc ? x <= h : x < h));
      if (level === 1) {
        if (r.next() < 0.5) {
          const C = r.pick([
            { s: (a, b) => `Na številski premici ležita točki $A(${a})$ in $B(${b})$. Kolikšna je razdalja med njima?`, u: null, lo: -15, hi: 15 },
            { s: (a, b) => `Zjutraj je termometer kazal $${a}\\ ^\\circ\\mathrm{C}$, popoldne pa $${b}\\ ^\\circ\\mathrm{C}$. Za koliko stopinj se je temperatura spremenila?`, u: "°C", lo: -12, hi: 18 },
            { s: (a, b) => `Potapljač je $${-a}\\ \\mathrm{m}$ pod morsko gladino (na višini $${a}\\ \\mathrm{m}$), galeb pa leti $${b}\\ \\mathrm{m}$ nad gladino. Kolikšna je navpična razdalja med njima?`, u: "m", lo: -30, hi: 40 },
          ]);
          let a;
          let b;
          do {
            a = r.int(C.lo, -1);
            b = r.int(1, C.hi);
          } while (a === -b);
          if (C.u === "m") a = -Math.abs(a);
          const [x, y] = r.next() < 0.5 || C.u === "m" ? [a, b] : [b, a];
          const d = Math.abs(x - y);
          return T({
            text: C.s(x, y),
            answer: num(d, C.u, null, [[Math.abs(Math.abs(x) - Math.abs(y)), "Si odštel absolutni vrednosti? Razdalja je |a − b|, števili sta na različnih straneh ničle."], [Math.abs(x + y), "Pazi na predznak: razdalja je |a − b|."]], C.u === "°C" ? { unitAlternatives: ["stopinj", "stopinje", "°"] } : {}),
            hint: "Razdalja med številoma $a$ in $b$ na številski premici je $|a - b|$.",
            data: { given: C.u === "m" ? [dat("h_1", x, "m"), dat("h_2", y, "m")] : C.u ? [`T_1 = ${x}\\ ^\\circ\\mathrm{C}`, `T_2 = ${y}\\ ^\\circ\\mathrm{C}`] : [`a = ${x}`, `b = ${y}`], find: ["d"] },
            formula: "d(a, b) = |a - b|",
            solution: [`$d = |${x} - ${par(y)}| = |${x - y}|$`, `$d = ${d}${C.u === "°C" ? "\\ ^\\circ\\mathrm{C}" : C.u ? "\\ \\mathrm{m}" : ""}$`],
          });
        }
        const a = r.nonZero(-6, 6);
        const b = r.nonZero(-6, 6);
        const k = r.int(2, 3);
        const x0 = r.nonZero(-8, 8);
        const v1 = Math.abs(x0 - a);
        const v2 = Math.abs(x0 + b);
        const val = v1 - k * v2;
        return T({
          text: `Izračunaj vrednost izraza $E = |x ${sg(-a)}| - ${k}|x ${sg(b)}|$ za $x = ${x0}$.`,
          answer: num(val, null, null, [[(x0 - a) - k * (x0 + b), "Absolutna vrednost je vedno nenegativna – |−5| = 5."], [v1 + k * v2, "Pred drugo absolutno vrednostjo je minus."]]),
          hint: "Vstavi $x$, najprej izračunaj vrednost znotraj vsake absolutne vrednosti, nato absolutni vrednosti.",
          data: { given: [`x = ${x0}`], find: ["E"] },
          formula: "|a| = \\begin{cases} a, & a \\ge 0 \\\\ -a, & a < 0 \\end{cases}",
          solution: [`$|${x0} ${sg(-a)}| = |${x0 - a}| = ${v1}$`, `$|${x0} ${sg(b)}| = |${x0 + b}| = ${v2}$`, `$E = ${v1} - ${k} \\cdot ${v2} = ${val}$`],
        });
      }
      if (level === 2) {
        const a1 = r.int(-8, 2);
        const b1 = a1 + r.int(2, 5);
        const a2 = b1 + r.int(2, 6);
        const b2 = a2 + r.int(1, 5);
        const [lA, rA, lB, rB] = [r.next() < 0.5, r.next() < 0.5, r.next() < 0.5, r.next() < 0.5];
        const op = r.pick(["cap", "cup", "AmB", "BmA"]);
        const R = {
          cap: [b1, lB, a2, rA, "A \\cap B"],
          cup: [a1, lA, b2, rB, "A \\cup B"],
          AmB: [a1, lA, b1, !lB, "A \\setminus B"],
          BmA: [a2, !rA, b2, rB, "B \\setminus A"],
        }[op];
        const ints = intsIn(R[0], R[1], R[2], R[3]);
        const cnt = ints.length;
        const allC = intsIn(R[0], true, R[2], true).length;
        const allO = intsIn(R[0], false, R[2], false).length;
        const A = ivTex(a1, lA, a2, rA);
        const B = ivTex(b1, lB, b2, rB);
        return T({
          text: r.pick([`Dana sta intervala $A = ${A}$ in $B = ${B}$. Koliko celih števil vsebuje množica $${R[4]}$?`, `Koliko celih števil leži v množici $${R[4]}$, če je $A = ${A}$ in $B = ${B}$?`]),
          answer: num(cnt, null, null, [[allC, "Oglati oklepaj pomeni, da krajišče spada zraven, okrogli pa, da ne – preveri krajišči."], [allO, "Krajišče z oglatim oklepajem spada v interval."]]),
          hint: "Oba intervala nariši na številsko premico in odčitaj zahtevano množico. Pazi, ali krajišča spadajo zraven.",
          data: { given: [`A = ${A}`, `B = ${B}`], find: [`\\text{število celih števil v } ${R[4]}`] },
          formula: ["[a, b] = \\{x;\\ a \\le x \\le b\\}", "(a, b) = \\{x;\\ a < x < b\\}"],
          solution: [`$${R[4]} = ${ivTex(R[0], R[1], R[2], R[3])}$`, ints.length ? `Cela števila: $${ints.join(", ")}$` : "V tej množici ni celih števil.", `Teh je $${cnt}$.`],
        });
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const k = r.int(2, 3);
        const a = r.nonZero(-9, 9);
        const b = r.int(3, 11);
        const strict = r.next() < 0.5;
        const op = strict ? "<" : "\\le";
        const lo = (a - b) / k;
        const hi = (a + b) / k;
        const cnt = intsIn(lo, !strict, hi, !strict).length;
        return T({
          text: `Koliko celih števil reši neenačbo $|${k}x ${sg(-a)}| ${op} ${b}$?`,
          answer: num(cnt, null, null, [[strict ? 2 * b - 1 : 2 * b + 1, `Si pozabil deliti s ${k}? Neenačba je za ${k}x, ne za x.`], [intsIn(lo, strict, hi, strict).length, "Preveri, ali krajišči spadata zraven (< ali ≤)."]]),
          hint: `$|u| ${op} b$ pomeni $-b ${op} u ${op} b$. Nato razpolovi oziroma deli s koeficientom pri $x$.`,
          data: { given: [`f(x) = |${k}x ${sg(-a)}|`, `b = ${b}`], find: ["\\text{število celih rešitev}"] },
          formula: `|u| ${op} b \\iff -b ${op} u ${op} b`,
          solution: [`$-${b} ${op} ${k}x ${sg(-a)} ${op} ${b}$`, `$${a - b} ${op} ${k}x ${op} ${a + b}$`, `$${ft(a - b, k)} ${op} x ${op} ${ft(a + b, k)}$ (približno od $${tx(lo, 2)}$ do $${tx(hi, 2)}$)`, `Cela števila: $${intsIn(lo, !strict, hi, !strict).join(", ")}$ – teh je $${cnt}$.`],
        });
      }
      if (t === 1) {
        const C = r.pick([
          { s: (c, d) => `Hladilnik vzdržuje temperaturo $T$, ki od $${c}\\ ^\\circ\\mathrm{C}$ odstopa največ za $${d}\\ ^\\circ\\mathrm{C}$.`, v: "T", c: [3, 4, 5], d: [1, 2] },
          { s: (c, d) => `Premer $d$ izdelanega vijaka sme od $${c}\\ \\mathrm{mm}$ odstopati največ za $${d}\\ \\mathrm{mm}$.`, v: "d", c: [6, 8, 10, 12], d: [0.1, 0.2, 0.05] },
          { s: (c, d) => `Masa $m$ vrečke moke sme od $${c}\\ \\mathrm{g}$ odstopati največ za $${d}\\ \\mathrm{g}$.`, v: "m", c: [500, 1000], d: [5, 10, 15] },
          { s: (c, d) => `Termostat v dnevni sobi vzdržuje temperaturo $T$, ki od $${c}\\ ^\\circ\\mathrm{C}$ odstopa največ za $${d}\\ ^\\circ\\mathrm{C}$.`, v: "T", c: [20, 21, 22], d: [1, 2] },
        ]);
        const c = r.pick(C.c);
        const d = r.pick(C.d);
        const [cT, dT] = [tx(c), tx(d)];
        const right = `|${C.v} - ${cT}| \\le ${dT}`;
        const ch = choice(r, right, [
          [`|${C.v} + ${cT}| \\le ${dT}`, "Odstopanje od c je razlika med vrednostjo in c, torej |x − c|."],
          [`|${C.v} - ${dT}| \\le ${cT}`, "Zamenjal si srednjo vrednost in dovoljeno odstopanje."],
          [`|${C.v} - ${cT}| \\ge ${dT}`, "»Največ« pomeni ≤: odstopanje je kvečjemu tolikšno."],
          [`|${C.v} - ${cT}| < ${dT}`, "»Največ za« dovoljuje tudi natanko tolikšno odstopanje, zato ≤."],
        ]);
        return T({
          text: `${C.s(cT, dT)} Kateri zapis to pove?`,
          answer: ch,
          options_tex: true,
          hint: "Razdalja med $x$ in $c$ na številski premici je $|x - c|$.",
          data: { given: [`c = ${cT}`, `\\Delta = ${dT}`], find: ["\\text{neenačba}"] },
          formula: "|x - c| \\le \\Delta \\iff c - \\Delta \\le x \\le c + \\Delta",
          solution: [`Odstopanje od $${cT}$ je $|${C.v} - ${cT}|$.`, `»Največ ${dT}« pomeni $\\le ${dT}$, torej $${right}$.`],
        });
      }
      const a = r.nonZero(-7, 7);
      const b = r.int(2, 8);
      const ge = r.next() < 0.5;
      const op = ge ? "\\ge" : "\\le";
      const L = a - b;
      const H = a + b;
      const inside = `[${L}, ${H}]`;
      const outside = `(-\\infty, ${L}] \\cup [${H}, \\infty)`;
      const right = ge ? outside : inside;
      const ch = choice(r, right, [
        [ge ? inside : outside, ge ? "|x − a| ≥ b pomeni, da je x od a oddaljen vsaj b – rešitve so zunaj." : "|x − a| ≤ b pomeni, da je x od a oddaljen največ b – rešitve so med krajiščema."],
        [ge ? `(-\\infty, ${L}) \\cup (${H}, \\infty)` : `(${L}, ${H})`, "Neenakost ni stroga, zato krajišči spadata zraven."],
        [ge ? `(-\\infty, ${-a - b}] \\cup [${-a + b}, \\infty)` : `[${-a - b}, ${-a + b}]`, `Središče je število, pri katerem je izraz v absolutni vrednosti 0, torej x = ${a}.`],
      ]);
      return T({
        text: `Katera množica je rešitev neenačbe $|x ${sg(-a)}| ${op} ${b}$?`,
        answer: ch,
        options_tex: true,
        hint: `$|x ${sg(-a)}|$ je razdalja števila $x$ od števila $${a}$.`,
        data: { given: [`f(x) = |x ${sg(-a)}|`, `b = ${b}`], find: ["x"] },
        formula: ge ? "|u| \\ge b \\iff u \\le -b \\lor u \\ge b" : "|u| \\le b \\iff -b \\le u \\le b",
        solution: ge ? [`$x ${sg(-a)} \\le -${b}$ ali $x ${sg(-a)} \\ge ${b}$`, `$x \\le ${L}$ ali $x \\ge ${H}$`, `$x \\in ${outside}$`] : [`$-${b} \\le x ${sg(-a)} \\le ${b}$`, `$${L} \\le x \\le ${H}$`, `$x \\in ${inside}$`],
      });
    },
  },
  {
    id: "dod-mat-ss12-potence",
    topics: ["MAT-SS-1/potence-z-naravnimi-in-celimi-eksponenti"],
    gen(level, r) {
      const RULES = ["a^m \\cdot a^n = a^{m + n}", "a^m : a^n = a^{m - n}", "(a^m)^n = a^{m \\cdot n}", "a^{-n} = \\dfrac{1}{a^n}"];
      if (level === 1) {
        const base = r.pick([2, 3, 5, 10, -2, -3]);
        const maxE = { 2: 5, 3: 4, 5: 3, 10: 4, "-2": 5, "-3": 4 }[base];
        const e = r.int(1, maxE);
        const t = r.int(0, 2);
        let expr;
        let step;
        let wrong;
        if (t === 0) {
          const m = r.int(2, 7);
          const n = r.nonZero(-4, 5);
          const k = m + n - e;
          expr = `\\dfrac{a^{${m}} \\cdot a^{${n}}}{a^{${k}}}`;
          step = `a^{${m} + ${par(n)} - ${par(k)}}`;
          wrong = [[base ** (m * n - k), "Pri množenju potenc z enako osnovo eksponente seštejemo, ne množimo."], [base ** (m + n + k), "Pri deljenju eksponente odštejemo."]];
        } else if (t === 1) {
          const m = r.int(2, 4);
          const n = r.int(2, 3);
          const k = m * n - e;
          expr = `\\left(a^{${m}}\\right)^{${n}} : a^{${k}}`;
          step = `a^{${m} \\cdot ${n} - ${par(k)}}`;
          wrong = [[base ** (m + n - k), "Pri potenciranju potence eksponente zmnožimo."]];
        } else {
          const m = r.int(2, 6);
          const n = r.nonZero(-3, 4);
          const k = e - m + n;
          expr = `a^{${m}} \\cdot \\left(a^{${n}}\\right)^{-1} \\cdot a^{${k}}`;
          step = `a^{${m} - ${par(n)} + ${par(k)}}`;
          wrong = [[base ** (m + n + k), "Eksponent −1 obrne potenco: (a^n)^(−1) = a^(−n)."]];
        }
        const val = base ** e;
        if (base < 0 && e % 2) wrong.push([-val, "Liha potenca negativnega števila je negativna."]);
        return T({
          text: r.pick([`Poenostavi izraz in izračunaj njegovo vrednost za $a = ${base}$: $${expr}$`, `Izračunaj vrednost izraza $${expr}$ za $a = ${base}$. Najprej uporabi pravila za računanje s potencami.`]),
          answer: num(val, null, null, wrong),
          hint: "Izraz najprej poenostavi v eno samo potenco $a^n$, šele nato vstavi število.",
          data: { given: [`a = ${base}`], find: ["\\text{vrednost izraza}"] },
          formula: RULES.slice(0, 3),
          solution: [`$${expr} = ${step} = a^{${e}}$`, `$a^{${e}} = ${par(base)}^{${e}} = ${val}$`],
        });
      }
      if (level === 2) {
        let p;
        let s;
        do {
          p = r.nonZero(-5, 5);
          s = r.int(2, 6);
        } while (gcd(p, s) !== 1 || Math.abs(p) === 1);
        const a = q(p, s);
        const n = r.int(1, 3);
        const t = r.int(0, 2);
        let expr;
        let res;
        let lines;
        const inv = qpow(a, -1);
        if (t === 0) {
          const nn = n + 1;
          expr = `a^{-${nn}}`;
          res = qpow(a, -nn);
          lines = [`$a^{-${nn}} = \\left(\\dfrac{1}{a}\\right)^{${nn}} = \\left(${qt(inv)}\\right)^{${nn}}$`, `$= ${qt(res)}$`];
        } else if (t === 1) {
          expr = `a^{-${n}} - a^{0}`;
          res = qsub(qpow(a, -n), [1, 1]);
          lines = [`$a^{-${n}} = \\left(${qt(inv)}\\right)^{${n}} = ${qt(qpow(a, -n))}$, $a^0 = 1$`, `$${qt(qpow(a, -n))} - 1 = ${qt(res)}$`];
        } else {
          expr = `\\left(a^{-1}\\right)^{2} + a^{-1}`;
          res = qadd(qpow(a, -2), inv);
          lines = [`$a^{-1} = ${qt(inv)}$`, `$\\left(a^{-1}\\right)^{2} = ${qt(qpow(a, -2))}$`, `$${qt(qpow(a, -2))} + ${pf(...inv)} = ${qt(res)}$`];
        }
        return T({
          text: r.pick([`Izračunaj vrednost izraza $${expr}$ za $a = ${qt(a)}$. Rezultat zapiši kot okrajšan ulomek.`, `Za $a = ${qt(a)}$ izračunaj $${expr}$ (rezultat kot okrajšan ulomek).`]),
          answer: rat(res),
          hint: "Negativni eksponent obrne ulomek: $\\left(\\dfrac{p}{q}\\right)^{-n} = \\left(\\dfrac{q}{p}\\right)^{n}$.",
          data: { given: [`a = ${qt(a)}`], find: ["\\text{vrednost izraza}"] },
          formula: ["a^{-n} = \\dfrac{1}{a^n}", "\\left(\\dfrac{p}{q}\\right)^{-n} = \\left(\\dfrac{q}{p}\\right)^{n}", "a^0 = 1"],
          solution: lines,
        });
      }
      if (r.next() < 0.5) {
        const [a, b, d, e, f] = [r.nonZero(-3, 4), r.nonZero(-3, 3), r.nonZero(-4, 4), r.nonZero(-3, 4), r.nonZero(-3, 3)];
        const c = r.pick([2, 3, -1, -2]);
        const m = a * c + d - e;
        const n = b * c - f;
        const askX = r.next() < 0.5;
        const expr = `\\dfrac{\\left(x^{${a}} y^{${b}}\\right)^{${c}} \\cdot x^{${d}}}{x^{${e}} y^{${f}}}`;
        const val = askX ? m : n;
        return T({
          text: `Izraz $${expr}$ ($x, y \\ne 0$) zapiši v obliki $x^{m} y^{n}$. Koliko je $${askX ? "m" : "n"}$?`,
          answer: num(val, null, null, askX ? [[a + c + d - e, "Pri potenciranju potence eksponente zmnožimo: (x^a)^c = x^(a·c)."], [a * c + d + e, "Pri deljenju eksponent imenovalca odštejemo."]] : [[b + c - f, "Pri potenciranju potence eksponente zmnožimo: (y^b)^c = y^(b·c)."], [b * c + f, "Pri deljenju eksponent imenovalca odštejemo."]]),
          hint: "Najprej potenciraj oklepaj (eksponente pomnoži), nato pri isti osnovi eksponente seštej oziroma odštej.",
          data: { given: [`x^{m} y^{n} = ${expr}`], find: [askX ? "m" : "n"] },
          formula: RULES.slice(0, 3),
          solution: [`$\\left(x^{${a}} y^{${b}}\\right)^{${c}} = x^{${a * c}} y^{${b * c}}$`, `$x$: $${a * c} + ${par(d)} - ${par(e)} = ${m}$`, `$y$: $${b * c} - ${par(f)} = ${n}$`, `$x^{${m}} y^{${n}}$, torej $${askX ? "m" : "n"} = ${val}$`],
        });
      }
      const C = r.pick([
        { s: (A, B) => `Celica meri $${A}\\ \\mathrm{m}$. Kako dolga bi bila vrsta iz $${B}$ takih celic?`, u: "m", p: [-6, -5], q: [3, 4, 5], sym: "d" },
        { s: (A, B) => `Zrno peska ima maso $${A}\\ \\mathrm{kg}$. Kolikšna je masa $${B}$ takih zrn?`, u: "kg", p: [-6, -5], q: [6, 7, 8], sym: "m" },
        { s: (A, B) => `Kapljica vode ima prostornino $${A}\\ \\mathrm{m^3}$. Kolikšna je prostornina $${B}$ kapljic?`, u: "m^3", p: [-8, -7], q: [5, 6, 7], sym: "V" },
        { s: (A, B) => `Zlat listič je debel $${A}\\ \\mathrm{m}$. Kako visok je kup iz $${B}$ lističev?`, u: "m", p: [-8, -7], q: [3, 4], sym: "d" },
      ]);
      const am = r.pick([1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8]);
      const bm = r.pick([2, 3, 4, 5, 6, 8]);
      const p = r.pick(C.p);
      const qq = r.pick(C.q);
      let prod = am * bm;
      let e = p + qq;
      const norm = prod >= 10 - 1e-9;
      if (norm) {
        prod /= 10;
        e += 1;
      }
      const A = `${tx(am)} \\cdot 10^{${p}}`;
      const B = `${bm} \\cdot 10^{${qq}}`;
      return T({
        text: `${C.s(A, B)} Rezultat zapiši v obliki $c \\cdot 10^{n}$, kjer je $1 \\le c < 10$. Koliko je $n$?`,
        answer: num(e, null, null, [[p + qq, "Če je zmnožek mantis 10 ali več, ga zapiši kot c · 10 in povečaj eksponent za 1."], [p * qq, "Pri množenju potenc z osnovo 10 eksponente seštejemo."], [p - qq, "Pri množenju eksponente seštejemo, ne odštejemo."]]),
        hint: "Posebej zmnoži števili pred potencama in posebej potenci števila 10. Na koncu preveri, ali je $1 \\le c < 10$.",
        data: { given: [`${C.sym} = ${qty(A, C.u)}`, `N = ${B}`], find: ["n"] },
        formula: ["(a \\cdot 10^{p}) \\cdot (b \\cdot 10^{q}) = (a \\cdot b) \\cdot 10^{p + q}"],
        solution: [`$${A} \\cdot ${B} = ${tx(am * bm)} \\cdot 10^{${p + qq}}$`, norm ? `$${tx(am * bm)} \\cdot 10^{${p + qq}} = ${tx(prod)} \\cdot 10^{${e}}$` : null, `$n = ${e}$`],
      });
    },
  },
  {
    id: "dod-mat-ss12-algebrski",
    topics: ["MAT-SS-1/algebrski-izrazi"],
    gen(level, r) {
      const SQ = ["(a + b)^2 = a^2 + 2ab + b^2", "(a - b)^2 = a^2 - 2ab + b^2"];
      const xT = (a) => (a === 1 ? "x" : `(${a}x)`);
      if (level === 1) {
        if (r.next() < 0.6) {
          const a = r.int(1, 5);
          const b = r.nonZero(-9, 9);
          const E = `(${lin(a, b)})^2`;
          const res = [a * a, 2 * a * b, b * b];
          return T({
            text: r.pick([`Izraz $A = ${E}$ razvij (kvadriraj dvočlenik). Koliko je koeficient pri $x$?`, `Kvadriraj dvočlenik: $${E}$. Kateri koeficient stoji pri $x$?`]),
            answer: num(2 * a * b, null, null, [[a * b, "Si pozabil na faktor 2 v dvojnem produktu 2ab?"], [0, "(a + b)² ni a² + b² – manjka dvojni produkt 2ab."], [-2 * a * b, "Pazi na predznak drugega člena."]]),
            hint: "Uporabi obrazec za kvadrat dvočlenika; člen z $x$ je dvojni produkt.",
            data: { given: [`A = ${E}`], find: ["\\text{koeficient pri } x"] },
            formula: SQ,
            solution: [`$${E} = ${xT(a)}^2 + 2 \\cdot ${mono(a, "x")} \\cdot ${par(b)} + ${par(b)}^2$`, `$= ${poly(res)}$`, `Koeficient pri $x$: $${2 * a * b}$`],
          });
        }
        const [a, c] = [r.int(1, 4), r.int(1, 4)];
        const [b, d] = [r.nonZero(-7, 7), r.nonZero(-7, 7)];
        const E = `(${lin(a, b)})(${lin(c, d)})`;
        return T({
          text: `Zmnoži dvočlenika: $A = ${E}$. Koliko je koeficient pri $x$?`,
          answer: num(a * d + b * c, null, null, [[a * d, "Vsak člen prvega oklepaja pomnoži z vsakim členom drugega – manjka še en člen z x."], [b * c, "Vsak člen prvega oklepaja pomnoži z vsakim členom drugega – manjka še en člen z x."], [a * d - b * c, "Pazi na predznake pri množenju."]]),
          hint: "Vsak člen prvega oklepaja pomnoži z vsakim členom drugega, nato seštej podobne člene.",
          data: { given: [`A = ${E}`], find: ["\\text{koeficient pri } x"] },
          formula: "(a + b)(c + d) = ac + ad + bc + bd",
          solution: [`$${E} = ${mono(a * c, "x^2")} ${d * a < 0 ? "-" : "+"} ${mono(Math.abs(a * d), "x")} ${b * c < 0 ? "-" : "+"} ${mono(Math.abs(b * c), "x")} ${sg(b * d)}$`, `$= ${poly([a * c, a * d + b * c, b * d])}$`, `Koeficient pri $x$: $${a * d + b * c}$`],
        });
      }
      if (level === 2) {
        const a = r.int(1, 4);
        const b = r.nonZero(-6, 6);
        const [c, e] = [r.int(1, 4), r.int(1, 3)];
        const [d, f] = [r.nonZero(-6, 6), r.nonZero(-6, 6)];
        const sq = [a * a, 2 * a * b, b * b];
        const pr = [c * e, c * f + d * e, d * f];
        const res = sq.map((v, i) => v - pr[i]);
        const ask = r.pick([0, 1, 1, 2]);
        const W = ["x^2", "x", "\\text{prosti člen}"][ask];
        const askT = ["koeficient pri $x^2$", "koeficient pri $x$", "prosti člen (člen brez $x$)"][ask];
        const E = `(${lin(a, b)})^2 - (${lin(c, d)})(${lin(e, f)})`;
        const ms = [[sq[ask] + pr[ask], "Minus pred oklepajem spremeni predznak vsem členom zmnožka."]];
        if (ask === 1) ms.push([a * b - pr[1], "Pri kvadratu dvočlenika je srednji člen 2ab."]);
        if (ask !== 0) ms.push([sq[ask] - (ask === 1 ? c * f : pr[ask]) , "Pri množenju oklepajev manjka en člen z x."]);
        return T({
          text: r.pick([`Poenostavi izraz $B = ${E}$. Koliko je ${askT}?`, `Izraz $B = ${E}$ zapiši kot polinom. Koliko je ${askT}?`]),
          answer: num(res[ask], null, null, ms),
          hint: "Najprej kvadriraj in zmnoži oklepaja, zmnožek zapiši v oklepaju, nato odpravi oklepaj z minusom in uredi.",
          data: { given: [`B = ${E}`], find: [W === "\\text{prosti člen}" ? W : `\\text{koeficient pri } ${W}`] },
          formula: [SQ[0], "(a + b)(c + d) = ac + ad + bc + bd"],
          solution: [`$(${lin(a, b)})^2 = ${poly(sq)}$`, `$(${lin(c, d)})(${lin(e, f)}) = ${poly(pr)}$`, `$B = ${poly(sq)} - (${poly(pr)}) = ${poly(res)}$`, `Iskano število: $${res[ask]}$`],
        });
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const a = r.int(1, 3);
        const b = r.nonZero(-4, 4);
        const askX2 = r.next() < 0.5;
        const E = `(${lin(a, b)})^3`;
        const res = [a ** 3, 3 * a * a * b, 3 * a * b * b, b ** 3];
        const val = askX2 ? res[1] : res[2];
        return T({
          text: `Razvij kub dvočlenika $C = ${E}$. Koliko je koeficient pri $${askX2 ? "x^2" : "x"}$?`,
          answer: num(val, null, null, [[askX2 ? a * a * b : a * b * b, "V obrazcu za kub dvočlenika sta srednja člena 3a²b in 3ab²."], [0, "(a + b)³ ni a³ + b³ – manjkata srednja člena."], [-val, "Pazi na predznak: b je negativen, b² pa pozitiven."]]),
          hint: "Uporabi obrazec $(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$ z $a = " + mono(a, "x") + "$ in $b = " + b + "$.",
          data: { given: [`C = ${E}`], find: [`\\text{koeficient pri } ${askX2 ? "x^2" : "x"}`] },
          formula: "(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3",
          solution: [`$${E} = ${xT(a)}^3 + 3 \\cdot ${xT(a)}^2 \\cdot ${par(b)} + 3 \\cdot ${mono(a, "x")} \\cdot ${par(b)}^2 + ${par(b)}^3$`, `$= ${poly(res)}$`, `Koeficient pri $${askX2 ? "x^2" : "x"}$: $${val}$`],
        });
      }
      if (t === 1) {
        const a = r.int(4, 30);
        const k = r.int(1, 6);
        const P = 2 * a * k + k * k;
        const who = r.pick(NAMES);
        const what = r.pick([["kvadratne grede", "m"], ["kvadratne terase", "m"], ["kvadratne slike", "cm"], ["kvadratnega prta", "dm"]]);
        return T({
          text: `${who} je stranico ${what[0]} ${g(who, "podaljšal", "podaljšala")} za $${k}\\ \\mathrm{${what[1]}}$, zato se je ploščina povečala za $${P}\\ \\mathrm{${what[1]}^2}$. Kolikšna je bila prvotna stranica?`,
          answer: num(a, what[1], null, [[P / (2 * k), `Si pozabil odšteti člen k² = ${k * k}?`], [(P - k * k) / k, "Dvojni produkt je 2ak – deliti moraš z 2k."], [P / k, "Uporabi (a + k)² − a² = 2ak + k²."]]),
          hint: "Zapiši razliko ploščin $(a + k)^2 - a^2$ in jo poenostavi s kvadratom dvočlenika.",
          data: { given: [dat("k", k, what[1]), dat("\\Delta S", P, `${what[1]}^2`)], find: ["a"] },
          formula: ["(a + k)^2 - a^2 = 2ak + k^2"],
          solution: [`$(a + ${k})^2 - a^2 = ${2 * k}a + ${k * k}$`, `$${2 * k}a + ${k * k} = ${P}$`, `$${2 * k}a = ${P - k * k}$`, `$a = ${a}\\ \\mathrm{${what[1]}}$`],
        });
      }
      const base = r.pick([20, 30, 40, 50, 60, 70, 80, 100, 100, 200]);
      const k = r.int(1, base >= 100 ? 9 : 4);
      const plus = r.next() < 0.5;
      const N = plus ? base + k : base - k;
      const s = plus ? "+" : "-";
      return T({
        text: `Izračunaj na pamet $${N}^2$ tako, da število zapišeš kot $(${base} ${s} ${k})^2$ in uporabiš obrazec za kvadrat dvočlenika.`,
        answer: num(N * N, null, null, [[base * base + (plus ? 1 : -1) * k * k, "Manjka dvojni produkt 2ab."], [base * base + k * k, "(a − b)² ni a² + b² – manjka dvojni produkt."], [base * base + (plus ? 1 : -1) * base * k + k * k, "Dvojni produkt je 2ab, ne ab."]]),
        hint: `$(${base} ${s} ${k})^2 = ${base}^2 ${s} 2 \\cdot ${base} \\cdot ${k} + ${k}^2$`,
        data: { given: [`N = ${N} = ${base} ${s} ${k}`], find: ["N^2"] },
        formula: SQ,
        solution: [`$${N}^2 = (${base} ${s} ${k})^2 = ${base * base} ${s} ${2 * base * k} + ${k * k}$`, `$= ${N * N}$`],
      });
    },
  },
  {
    id: "dod-mat-ss12-razstavljanje",
    topics: ["MAT-SS-1/razstavljanje-izrazov"],
    gen(level, r) {
      const fac = (r1) => `(x ${sg(-r1)})`;
      if (level === 1) {
        if (r.next() < 0.6) {
          const gg = r.int(2, 6);
          let u;
          let v;
          do {
            u = r.int(1, 5);
            v = r.int(1, 5);
          } while (u === v || gcd(u, v) !== 1);
          const s = r.pick(["+", "-"]);
          const opp = s === "+" ? "-" : "+";
          const E = `${gg * u}x^2y ${s} ${gg * v}xy^2`;
          const right = `${gg}xy(${mono(u, "x")} ${s} ${mono(v, "y")})`;
          const ch = choice(r, right, r.shuffle([
            [`${gg}x(${mono(u, "xy")} ${s} ${mono(v, "y^2")})`, "Razcep ni dokončan: tudi y je skupni faktor obeh členov."],
            [`${gg}xy(${mono(u, "x")} ${s} ${mono(gg * v, "y")})`, "Tudi koeficient drugega člena moraš deliti s skupnim faktorjem."],
            [`${gg}xy(${mono(u, "x")} ${opp} ${mono(v, "y")})`, "Pri izpostavljanju se predznaki členov ne spremenijo."],
            [`xy(${mono(gg * u, "x")} ${s} ${mono(gg * v, "y")})`, "Izpostavi tudi največji skupni delitelj koeficientov."],
          ]));
          return T({
            text: r.pick([`Izraz $E = ${E}$ razstavi z izpostavljanjem skupnega faktorja.`, `Kateri zapis je popoln razcep izraza $E = ${E}$?`]),
            answer: ch,
            options_tex: true,
            hint: "Poišči največji skupni delitelj koeficientov in najnižje potence spremenljivk, ki nastopajo v obeh členih.",
            data: { given: [`E = ${E}`], find: ["\\text{razcep}"] },
            formula: "ab + ac = a(b + c)",
            solution: [`Skupni faktor: $D(${gg * u}, ${gg * v}) = ${gg}$, pri spremenljivkah $xy$`, `$E = ${right}$`],
          });
        }
        const a = r.int(12, 49);
        const b = r.int(11, 89);
        const c = 100 - b;
        return T({
          text: `Izračunaj na pameten način (z izpostavljanjem skupnega faktorja): $E = ${a} \\cdot ${b} + ${a} \\cdot ${c}$.`,
          answer: num(a * 100, null, null, [[a * b + c, "Skupni faktor pomnoži z obema členoma: a·b + a·c = a·(b + c)."]]),
          hint: "Oba člena imata skupni faktor – izpostavi ga.",
          data: { given: [`E = ${a} \\cdot ${b} + ${a} \\cdot ${c}`], find: ["E"] },
          formula: "ab + ac = a(b + c)",
          solution: [`$E = ${a} \\cdot (${b} + ${c})$`, `$E = ${a} \\cdot 100 = ${a * 100}$`],
        });
      }
      if (level === 2) {
        if (r.next() < 0.6) {
          let r1;
          let r2;
          do {
            r1 = r.nonZero(-9, 9);
            r2 = r.nonZero(-9, 9);
          } while (r1 >= r2 || r1 + r2 === 0);
          const P = poly([1, -(r1 + r2), r1 * r2]);
          const right = `${fac(r1)}${fac(r2)}`;
          const prod = r1 * r2;
          const alt = range(1, Math.abs(prod))
            .filter((u) => prod % u === 0)
            .flatMap((u) => [[u, prod / u], [-u, -prod / u]])
            .find(([u, w]) => Math.abs(u + w) !== Math.abs(r1 + r2) && u <= w);
          const wrong = [[`${fac(-r1)}${fac(-r2)}`, "Napačna predznaka: zmnožek bi dal nasprotni koeficient pri x."], [`${fac(r1)}${fac(-r2)}`, "En predznak je napačen – preveri, da zmnožek prostih členov da " + prod + "."]];
          if (alt) wrong.splice(1, 0, [`${fac(alt[0])}${fac(alt[1])}`, "Zmnožek prostih členov se ujema, vsota pa ne da koeficienta pri x."]);
          return T({
            text: r.pick([`Trinom $T = ${P}$ razstavi z Vietovim pravilom.`, `Kateri je razcep trinoma $T = ${P}$?`]),
            answer: choice(r, right, wrong),
            options_tex: true,
            hint: `Išči števili, katerih zmnožek je $${prod}$, vsota pa $${-(r1 + r2)}$.`,
            data: { given: [`T = ${P}`], find: ["\\text{razcep}"] },
            formula: "x^2 + (a + b)x + ab = (x + a)(x + b)",
            solution: [`Iščemo števili z zmnožkom $${prod}$ in vsoto $${-(r1 + r2)}$: to sta $${-r1}$ in $${-r2}$.`, `$T = ${right}$`],
          });
        }
        const a = r.int(1, 5);
        const b = r.int(1, 9);
        const y = r.next() < 0.5;
        const B = y ? mono(b, "y") : `${b}`;
        const E = `${mono(a * a, "x^2")} - ${y ? mono(b * b, "y^2") : b * b}`;
        const ax = mono(a, "x");
        const right = `(${ax} - ${B})(${ax} + ${B})`;
        return T({
          text: `Izraz $E = ${E}$ razstavi kot razliko kvadratov.`,
          answer: choice(r, right, [
            [`(${ax} - ${B})^2`, "To je kvadrat razlike; njegov razvoj ima še srednji člen −2ab."],
            [`(${ax} + ${B})^2`, "To je kvadrat vsote; razlika kvadratov je zmnožek vsote in razlike."],
            [`(${B} - ${ax})(${B} + ${ax})`, "Ta zmnožek je b² − a², torej nasprotna vrednost danega izraza."],
          ]),
          options_tex: true,
          hint: `Izraz zapiši kot $(${ax})^2 - ${y ? `(${B})` : B}^2$.`,
          data: { given: [`E = ${E}`], find: ["\\text{razcep}"] },
          formula: "a^2 - b^2 = (a - b)(a + b)",
          solution: [`$E = ${a === 1 ? "x" : `(${ax})`}^2 - ${y && b !== 1 ? `(${B})` : B}^2$`, `$E = ${right}$`],
        });
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const k = r.int(2, 5);
        if (r.next() < 0.5) {
          const b = r.int(1, 6);
          const E = `${k}x^3 - ${k * b * b}x`;
          const right = `${k}x(x - ${b})(x + ${b})`;
          return T({
            text: `Izraz $E = ${E}$ razstavi do konca.`,
            answer: choice(r, right, [
              [`${k}x(x^2 - ${b * b})`, "Razcep ni dokončan: v oklepaju je še razlika kvadratov."],
              [`${k}x(x - ${b})^2`, "Razlika kvadratov je (a − b)(a + b), ne (a − b)²."],
              [`x(${k}x - ${b})(${k}x + ${b})`, "Izpostavljenega faktorja ne smeš vnesti v oba oklepaja hkrati."],
            ]),
            options_tex: true,
            hint: "Najprej izpostavi skupni faktor, nato preveri, ali lahko oklepaj še razstaviš.",
            data: { given: [`E = ${E}`], find: ["\\text{razcep}"] },
            formula: ["ab + ac = a(b + c)", "a^2 - b^2 = (a - b)(a + b)"],
            solution: [`$E = ${k}x(x^2 - ${b * b})$`, `$E = ${right}$`],
          });
        }
        let r1;
        let r2;
        do {
          r1 = r.nonZero(-6, 6);
          r2 = r.nonZero(-6, 6);
        } while (r1 >= r2 || r1 + r2 === 0);
        const E = poly([k, -k * (r1 + r2), k * r1 * r2]);
        const right = `${k}${fac(r1)}${fac(r2)}`;
        return T({
          text: `Izraz $E = ${E}$ razstavi do konca.`,
          answer: choice(r, right, [
            [`(${k}x ${sg(-r1)})${fac(r2)}`, "Skupni faktor je treba izpostaviti pred oba oklepaja, ne ga vnesti le v enega."],
            [`${k}${fac(-r1)}${fac(-r2)}`, "Napačna predznaka – preveri vsoto ničel."],
            [`${k}(${poly([1, -(r1 + r2), r1 * r2])})`, "Razcep ni dokončan: trinom v oklepaju razstavi še z Vietovim pravilom."],
          ]),
          options_tex: true,
          hint: `Najprej izpostavi $${k}$, nato trinom v oklepaju razstavi z Vietovim pravilom.`,
          data: { given: [`E = ${E}`], find: ["\\text{razcep}"] },
          formula: ["ab + ac = a(b + c)", "x^2 + (a + b)x + ab = (x + a)(x + b)"],
          solution: [`$E = ${k}(${poly([1, -(r1 + r2), r1 * r2])})$`, `Števili z zmnožkom $${r1 * r2}$ in vsoto $${-(r1 + r2)}$: $${-r1}$ in $${-r2}$`, `$E = ${right}$`],
        });
      }
      if (t === 1) {
        const S = r.pick([20, 30, 40, 50, 60, 80, 100, 100]);
        const D = r.int(1, S / 5) * 2;
        const a = (S + D) / 2;
        const b = (S - D) / 2;
        return T({
          text: `Izračunaj brez računala (z razliko kvadratov): $${a}^2 - ${b}^2$.`,
          answer: num(a * a - b * b, null, null, [[(a - b) ** 2, "a² − b² ni (a − b)², ampak (a − b)(a + b)."], [a + b, "Zmnožiti moraš vsoto in razliko."]]),
          hint: "Uporabi $a^2 - b^2 = (a - b)(a + b)$.",
          data: { given: [`a = ${a}`, `b = ${b}`], find: ["a^2 - b^2"] },
          formula: "a^2 - b^2 = (a - b)(a + b)",
          solution: [`$${a}^2 - ${b}^2 = (${a} - ${b})(${a} + ${b})$`, `$= ${a - b} \\cdot ${a + b} = ${a * a - b * b}$`],
        });
      }
      const S = r.int(5, 20);
      const D = r.int(1, S - 1);
      const P = S * D;
      const askA = (S + D) % 2 === 0 && r.next() < 0.5;
      return T({
        text: `Za realni števili $a$ in $b$ velja $a^2 - b^2 = ${P}$ in $a + b = ${S}$. Koliko je ${askA ? "$a$" : "$a - b$"}?`,
        answer: num(askA ? (S + D) / 2 : D, null, null, askA ? [[D, "To je a − b; iz vsote in razlike izračunaj še a."], [(S + D), "Vsoto (a + b) + (a − b) = 2a še razpolovi."]] : [[P - S, "a² − b² razstavi kot (a − b)(a + b), nato deli."], [S * S - P, "Uporabi razliko kvadratov, ne kvadrat vsote."]]),
        hint: "Razstavi $a^2 - b^2 = (a - b)(a + b)$ in vstavi znano vsoto.",
        data: { given: [`a^2 - b^2 = ${P}`, `a + b = ${S}`], find: [askA ? "a" : "a - b"] },
        formula: "a^2 - b^2 = (a - b)(a + b)",
        solution: [`$(a - b) \\cdot ${S} = ${P}$`, `$a - b = ${D}$`, askA ? `$2a = (a + b) + (a - b) = ${S + D}$, torej $a = ${(S + D) / 2}$` : null],
      });
    },
  },
  {
    id: "dod-mat-ss12-ulomljeni",
    topics: ["MAT-SS-1/ulomljeni-izrazi"],
    gen(level, r) {
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const a = r.int(1, 9);
          const E = dfr(`x^2 - ${a * a}`, `x^2 + ${mono(a, "x")}`);
          const right = dfr(`x - ${a}`, "x");
          return T({
            text: r.pick([`Okrajšaj ulomljeni izraz $E = ${E}$.`, `Kateri izraz dobiš, ko okrajšaš $E = ${E}$?`]),
            answer: choice(r, right, [
              [`-${dfr(a, "x")}`, "Krajšati smeš le faktorje, ne posameznih členov (x² se ne krajša z x²)."],
              [dfr(`x + ${a}`, "x"), "Preveri, kateri faktor se pokrajša: števec je (x − a)(x + a)."],
              [`x - ${a}`, "Po krajšanju v imenovalcu ostane x."],
            ]),
            options_tex: true,
            hint: "Razstavi števec (razlika kvadratov) in imenovalec (izpostavi $x$), nato okrajšaj skupni faktor.",
            data: { given: [`E = ${E}`], find: ["\\text{okrajšan izraz}"] },
            formula: ["a^2 - b^2 = (a - b)(a + b)", "\\dfrac{a \\cdot c}{b \\cdot c} = \\dfrac{a}{b}"],
            solution: [`$E = ${dfr(`(x - ${a})(x + ${a})`, `x(x + ${a})`)}$`, `$E = ${right}$ (za $x \\ne 0$, $x \\ne -${a}$)`],
          });
        }
        if (t === 1) {
          const a = r.int(1, 7);
          const k = r.int(2, 6);
          const E = dfr(`${k}x - ${k * a}`, poly([1, -2 * a, a * a]));
          const right = dfr(k, `x - ${a}`);
          return T({
            text: `Okrajšaj ulomljeni izraz $E = ${E}$.`,
            answer: choice(r, right, [
              [dfr(k, `(x - ${a})^2`), "(x − a) se v števcu pojavi enkrat; v imenovalcu ostane še en faktor (x − a)."],
              [`${k}(x - ${a})`, "Ulomek si obrnil: (x − a)² je v imenovalcu."],
              [dfr(k, `x + ${a}`), "x² − 2ax + a² je kvadrat razlike (x − a)², ne razlika kvadratov."],
            ]),
            options_tex: true,
            hint: "V števcu izpostavi skupni faktor, imenovalec pa prepoznaj kot kvadrat dvočlenika.",
            data: { given: [`E = ${E}`], find: ["\\text{okrajšan izraz}"] },
            formula: ["(a - b)^2 = a^2 - 2ab + b^2", "\\dfrac{a \\cdot c}{b \\cdot c} = \\dfrac{a}{b}"],
            solution: [`$E = ${dfr(`${k}(x - ${a})`, `(x - ${a})^2`)}$`, `$E = ${right}$ (za $x \\ne ${a}$)`],
          });
        }
        const p = r.nonZero(-9, 9);
        const k = r.int(2, 5);
        let z;
        do z = r.nonZero(-6, 6);
        while (z === -p);
        const E = dfr(lin(1, p), lin(k, -k * z));
        return T({
          text: `Za katero vrednost $x$ ulomljeni izraz $E = ${E}$ ni definiran?`,
          answer: num(z, null, null, [[-p, "Izraz ni definiran, ko je imenovalec enak 0 – števec je lahko 0."], [k * z, `Enačbo ${k}x = ${k * z} še deli s ${k}.`], [-z, "Pazi na predznak pri reševanju enačbe."]]),
          hint: "Ulomek ni definiran, ko je imenovalec enak $0$.",
          data: { given: [`E = ${E}`], find: ["x"] },
          formula: "\\dfrac{A}{B} \\text{ je definiran} \\iff B \\ne 0",
          solution: [`$${lin(k, -k * z)} = 0$`, `$${k}x = ${k * z}$`, `$x = ${z}$`],
        });
      }
      if (level === 2) {
        let A;
        let B;
        let p;
        let qv;
        do {
          [A, B] = [r.int(1, 6), r.int(1, 6)];
          [p, qv] = [r.nonZero(-6, 6), r.nonZero(-6, 6)];
        } while (A === B || p === qv);
        const minus = r.next() < 0.5;
        const Bs = minus ? -B : B;
        const s = minus ? "-" : "+";
        const E = `${dfr(A, `x ${sg(p)}`)} ${s} ${dfr(B, `x ${sg(qv)}`)}`;
        const den = `(x ${sg(p)})(x ${sg(qv)})`;
        const right = dfr(poly([A + Bs, A * qv + Bs * p]), den);
        const wrong = [
          [dfr(`${A + Bs}`, poly([2, p + qv])), "Ulomkov ne seštevamo tako, da seštejemo števca in imenovalca."],
          [dfr(`${A + Bs}`, den), "Ko ulomek razširiš na skupni imenovalec, moraš pomnožiti tudi števec."],
          minus
            ? [dfr(poly([A + Bs, A * qv - Bs * p]), den), "Minus pred ulomkom velja za celoten razširjeni števec."]
            : [dfr(poly([A + Bs, A * p + Bs * qv]), den), "Števec razširiš s faktorjem, ki ga njegovemu imenovalcu manjka."],
        ];
        return T({
          text: r.pick([`Zapiši kot en ulomek: $E = ${E}$.`, `${minus ? "Odštej" : "Seštej"} ulomljena izraza: $E = ${E}$.`]),
          answer: choice(r, right, wrong),
          options_tex: true,
          hint: `Skupni imenovalec je $${den}$. Vsak števec pomnoži s faktorjem, ki manjka njegovemu imenovalcu.`,
          data: { given: [`E = ${E}`], find: ["E \\text{ kot en ulomek}"] },
          formula: "\\dfrac{a}{b} + \\dfrac{c}{d} = \\dfrac{ad + bc}{bd}",
          solution: [`$E = ${dfr(`${A === 1 ? "" : A}(x ${sg(qv)}) ${s} ${B === 1 ? "" : B}(x ${sg(p)})`, den)}$`, `$E = ${dfr(`${poly([A, A * qv])} ${s} ${minus ? `(${poly([B, B * p])})` : poly([B, B * p])}`, den)}$`, `$E = ${right}$`],
        });
      }
      const t = r.int(0, 2);
      let a;
      let b;
      do {
        a = r.int(1, 6);
        b = r.int(1, 6);
      } while (a === b);
      let E;
      let simp;
      let bad;
      let lines;
      let f;
      if (t === 0) {
        E = `${dfr(`x^2 - ${a * a}`, `x^2 + ${mono(b, "x")}`)} \\cdot ${dfr(`x + ${b}`, `x + ${a}`)}`;
        simp = dfr(`x - ${a}`, "x");
        bad = [0, -b, -a, a];
        f = (x) => q(x - a, x);
        lines = [`$E = ${dfr(`(x - ${a})(x + ${a})`, `x(x + ${b})`)} \\cdot ${dfr(`x + ${b}`, `x + ${a}`)}$`, `Okrajšamo $(x + ${a})$ in $(x + ${b})$: $E = ${simp}$`];
      } else if (t === 1) {
        E = `${dfr(poly([1, 2 * a, a * a]), `x^2 - ${b * b}`)} : ${dfr(`x + ${a}`, `x - ${b}`)}`;
        simp = dfr(`x + ${a}`, `x + ${b}`);
        bad = [b, -b, -a];
        f = (x) => q(x + a, x + b);
        lines = [`$E = ${dfr(`(x + ${a})^2`, `(x - ${b})(x + ${b})`)} \\cdot ${dfr(`x - ${b}`, `x + ${a}`)}$`, `Okrajšamo $(x + ${a})$ in $(x - ${b})$: $E = ${simp}$`];
      } else {
        E = `${dfr(b, `x - ${a}`)} - ${dfr(b, `x + ${a}`)}`;
        simp = dfr(2 * a * b, `x^2 - ${a * a}`);
        bad = [a, -a];
        f = (x) => q(2 * a * b, x * x - a * a);
        lines = [`$E = ${dfr(`${b}(x + ${a}) - ${b}(x - ${a})`, `(x - ${a})(x + ${a})`)}$`, `$E = ${simp}$`];
      }
      let x0;
      do x0 = r.nonZero(-7, 7);
      while (bad.includes(x0));
      const v = f(x0);
      return T({
        text: r.pick([`Poenostavi izraz $E = ${E}$ in izračunaj njegovo vrednost za $x = ${x0}$.`, `Izraz $E = ${E}$ najprej poenostavi, nato izračunaj $E$ pri $x = ${x0}$ (rezultat kot okrajšan ulomek).`]),
        answer: rat(v),
        hint: "Števce in imenovalce razstavi, pri deljenju pomnoži z obratno vrednostjo, okrajšaj in šele nato vstavi $x$.",
        data: { given: [`E = ${E}`, `x = ${x0}`], find: ["E"] },
        formula: ["a^2 - b^2 = (a - b)(a + b)", "\\dfrac{a}{b} \\cdot \\dfrac{c}{d} = \\dfrac{ac}{bd}", "\\dfrac{a}{b} : \\dfrac{c}{d} = \\dfrac{a}{b} \\cdot \\dfrac{d}{c}"],
        solution: [...lines, `$E(${x0}) = ${qt(v)}$`],
      });
    },
  },
  {
    id: "dod-mat-ss12-sistemi",
    topics: ["MAT-SS-1/sistemi-linearnih-enacb"],
    gen(level, r) {
      const cf = (b) => (Math.abs(b) === 1 ? "" : Math.abs(b));
      if (level === 1) {
        let x0;
        let y0;
        let k;
        let n;
        let a;
        let b;
        do {
          [x0, y0, k] = [r.int(-6, 6), r.int(-6, 6), r.nonZero(-4, 4)];
          n = y0 - k * x0;
          [a, b] = [r.int(1, 5), r.nonZero(-4, 4)];
        } while (a + b * k === 0 || n === 0);
        const c = a * x0 + b * y0;
        const e1 = `y = ${poly([k, n])}`;
        const e2 = `${lin2(a, b)} = ${c}`;
        const v = r.next() < 0.5 ? "x" : "y";
        const val = v === "x" ? x0 : y0;
        return T({
          text: r.pick([`Reši sistem enačb z zamenjalnim načinom: $${e1}$ in $${e2}$. Koliko je $${v}$?`, `Sistem enačb $${e1}$, $${e2}$ reši tako, da $y$ iz prve enačbe vstaviš v drugo. Koliko je $${v}$?`]),
          answer: num(val, null, null, [[v === "x" ? y0 : x0, `To je vrednost ${v === "x" ? "y" : "x"}; vprašanje je po ${v}.`], [-val, "Preveri predznake pri odpravljanju oklepaja."]]),
          hint: "Izraz za $y$ iz prve enačbe vstavi namesto $y$ v drugo enačbo; dobiš enačbo z eno neznanko.",
          data: { given: [e1, e2], find: [v] },
          formula: "y = kx + n \\;\\Rightarrow\\; ax + b(kx + n) = c",
          solution: [`$${mono(a, "x")} ${b < 0 ? "-" : "+"} ${cf(b)}(${poly([k, n])}) = ${c}$`, `$${poly([a + b * k, b * n])} = ${c}$`, `$${mono(a + b * k, "x")} = ${c - b * n} \\;\\Rightarrow\\; x = ${x0}$`, `$y = ${k} \\cdot ${par(x0)} ${sg(n)} = ${y0}$`],
        });
      }
      if (level === 2) {
        if (r.next() < 0.6) {
          let x0;
          let y0;
          let a1;
          let b1;
          let a2;
          let m;
          do {
            [x0, y0, a1, b1, m, a2] = [r.int(-5, 6), r.int(-5, 6), r.nonZero(-5, 5), r.nonZero(-3, 3), r.int(2, 3), r.nonZero(-5, 5)];
          } while (m * a1 + a2 === 0);
          const b2 = -m * b1;
          const c1 = a1 * x0 + b1 * y0;
          const c2 = a2 * x0 + b2 * y0;
          const e1 = `${lin2(a1, b1)} = ${c1}`;
          const e2 = `${lin2(a2, b2)} = ${c2}`;
          const v = r.next() < 0.5 ? "x" : "y";
          const val = v === "x" ? x0 : y0;
          return T({
            text: r.pick([`Reši sistem po metodi nasprotnih koeficientov: $${e1}$ in $${e2}$. Koliko je $${v}$?`, `Dan je sistem enačb $${e1}$, $${e2}$. Reši ga z nasprotnimi koeficienti in zapiši $${v}$.`]),
            answer: num(val, null, null, [[v === "x" ? y0 : x0, `To je vrednost ${v === "x" ? "y" : "x"}.`], [-val, "Pri množenju enačbe pomnoži vse člene, tudi desno stran – in pazi na predznake."]]),
            hint: `Prvo enačbo pomnoži z $${m}$, da bosta koeficienta pri $y$ nasprotni števili, nato enačbi seštej.`,
            data: { given: [e1, e2], find: [v] },
            formula: "\\text{enačbi pomnožimo, da sta koeficienta pri isti neznanki nasprotni števili, nato ju seštejemo}",
            solution: [`$${m} \\cdot$ (1. enačba): $${lin2(m * a1, m * b1)} = ${m * c1}$`, `Seštejemo z 2. enačbo: $${mono(m * a1 + a2, "x")} = ${m * c1 + c2}$, $x = ${x0}$`, `V 1. enačbo: $${a1} \\cdot ${par(x0)} ${b1 < 0 ? "-" : "+"} ${cf(b1)}y = ${c1}$, $y = ${y0}$`],
          });
        }
        const x0 = r.int(-5, 5);
        const y0 = r.int(-6, 6);
        let k1;
        let k2;
        do {
          k1 = r.nonZero(-4, 4);
          k2 = r.nonZero(-4, 4);
        } while (k1 === k2);
        const n1 = y0 - k1 * x0;
        const n2 = y0 - k2 * x0;
        const askY = r.next() < 0.5;
        const p1 = `y = ${poly([k1, n1])}`;
        const p2 = `y = ${poly([k2, n2])}`;
        return T({
          text: `Premici $p\\colon ${p1}$ in $q\\colon ${p2}$ se sekata v točki $P$. Kolikšna je ${askY ? "ordinata" : "abscisa"} točke $P$?`,
          answer: num(askY ? y0 : x0, null, null, [[askY ? x0 : y0, askY ? "To je abscisa (x); ordinata je y." : "To je ordinata (y); abscisa je x."], [askY ? -y0 : -x0, "Preveri predznake pri prenašanju členov."]]),
          hint: "V presečišču imata premici enak $y$ pri istem $x$: izenači desni strani.",
          data: { given: [p1, p2], find: [askY ? "y_P" : "x_P"] },
          formula: "k_1 x + n_1 = k_2 x + n_2",
          solution: [`$${poly([k1, n1])} = ${poly([k2, n2])}$`, `$${mono(k1 - k2, "x")} = ${n2 - n1}$, $x = ${x0}$`, `$y = ${k1} \\cdot ${par(x0)} ${sg(n1)} = ${y0}$`, `$P(${x0}, ${y0})$`],
        });
      }
      const t = r.int(0, 3);
      if (t === 0) {
        const A = r.int(8, 14);
        const C = r.int(3, 7);
        const ad = r.int(5, 40);
        const ch = r.int(5, 60);
        const N = ad + ch;
        const S = A * ad + C * ch;
        const place = r.pick(["V gledališče", "V kino", "Na koncert", "V živalski vrt"]);
        return T({
          text: `${place} je prišlo $${N}$ obiskovalcev. Vstopnica za odraslega stane $${A}\\ \\text{€}$, za otroka $${C}\\ \\text{€}$. Skupaj so plačali $${S}\\ \\text{€}$. Koliko je bilo otrok?`,
          answer: num(ch, null, null, [[ad, "To je število odraslih."], [S / A, "Upoštevaj, da imata vstopnici različni ceni – postavi sistem dveh enačb."]]),
          hint: "Naj bo $x$ število odraslih in $y$ število otrok. Zapiši enačbo za število oseb in enačbo za denar.",
          data: { given: [`N = ${N}`, `c_1 = ${A}\\ \\text{€}`, `c_2 = ${C}\\ \\text{€}`, `S = ${S}\\ \\text{€}`], find: ["y"] },
          formula: ["x + y = N", "c_1 x + c_2 y = S"],
          solution: [`$x + y = ${N}$, $${A}x + ${C}y = ${S}$`, `$x = ${N} - y$ vstavimo: $${A}(${N} - y) + ${C}y = ${S}$`, `$${A * N} - ${A - C}y = ${S}$, $${A - C}y = ${A * N - S}$`, `$y = ${ch}$ otrok (in $x = ${ad}$ odraslih)`],
        });
      }
      if (t === 1) {
        const d = r.int(5, 30);
        const tr = r.int(5, 25);
        const R = d + tr;
        const L = 2 * d + 3 * tr;
        const askT = r.next() < 0.5;
        return T({
          text: `Hotel ima $${R}$ sob, nekaj dvoposteljnih in nekaj triposteljnih, skupaj $${L}$ ležišč. Koliko je ${askT ? "triposteljnih" : "dvoposteljnih"} sob?`,
          answer: num(askT ? tr : d, null, null, [[askT ? d : tr, `To je število ${askT ? "dvoposteljnih" : "triposteljnih"} sob.`], [L / 2.5, "Ne deli ležišč s povprečjem – postavi sistem dveh enačb."]]),
          hint: "Naj bo $x$ število dvoposteljnih in $y$ število triposteljnih sob. Ena enačba šteje sobe, druga ležišča.",
          data: { given: [`R = ${R}`, `L = ${L}`], find: [askT ? "y" : "x"] },
          formula: ["x + y = R", "2x + 3y = L"],
          solution: [`$x + y = ${R}$, $2x + 3y = ${L}$`, `Prvo enačbo pomnožimo z $-2$ in prištejemo: $y = ${L} - ${2 * R} = ${tr}$`, `$x = ${R} - ${tr} = ${d}$`],
        });
      }
      if (t === 2) {
        const n1 = r.int(5, 40);
        const n2 = r.int(5, 40);
        const N = n1 + n2;
        const S = n1 + 2 * n2;
        const who = r.pick(NAMES);
        return T({
          text: `${who} ima v hranilniku $${N}$ kovancev po $1\\ \\text{€}$ in po $2\\ \\text{€}$, skupaj $${S}\\ \\text{€}$. Koliko kovancev po $2\\ \\text{€}$ ima?`,
          answer: num(n2, null, null, [[n1, "To je število kovancev po 1 €."], [S / 2, "Niso vsi kovanci po 2 € – postavi sistem."]]),
          hint: "Naj bo $x$ število kovancev po $1\\ \\text{€}$ in $y$ po $2\\ \\text{€}$. Zapiši enačbo za število kovancev in za vrednost.",
          data: { given: [`N = ${N}`, `S = ${S}\\ \\text{€}`], find: ["y"] },
          formula: ["x + y = N", "x + 2y = S"],
          solution: [`$x + y = ${N}$, $x + 2y = ${S}$`, `Odštejemo prvo enačbo od druge: $y = ${S} - ${N} = ${n2}$`, `$x = ${N} - ${n2} = ${n1}$`],
        });
      }
      const yrs = (n) => (n === 1 ? "leto" : n === 2 ? "leti" : n <= 4 ? "leta" : "let");
      for (;;) {
        const s = r.int(4, 15);
        const k = r.int(3, 6);
        const ts = range(1, 20).filter((t2) => (k * s + t2) % (s + t2) === 0 && (k * s + t2) / (s + t2) >= 2 && (k * s + t2) / (s + t2) < k);
        if (!ts.length || k * s > 70) continue;
        const t2 = r.pick(ts);
        const m = (k * s + t2) / (s + t2);
        const father = r.pick([["Oče", "sina", "oče", "starejši"], ["Mama", "hčere", "mama", "starejša"], ["Dedek", "vnuka", "dedek", "starejši"]]);
        return T({
          text: `${father[0]} je zdaj $${k}$-krat ${father[3]} od ${father[1]}. Čez $${t2}$ ${yrs(t2)} bo le še $${m}$-krat ${father[3]}. Koliko let je ${father[2]} zdaj?`,
          answer: num(k * s, null, null, [[s, `To je starost ${father[1]}.`], [k * s + t2, `To bo starost čez ${t2} ${yrs(t2)}; vprašanje je, koliko let ima zdaj.`]]),
          hint: "Naj bo $x$ sedanja starost mlajšega. Starejši ima zdaj $kx$ let; čez nekaj let sta oba starejša za enako število let.",
          data: { given: [`k = ${k}`, `t = ${t2}`, `m = ${m}`], find: ["y"] },
          formula: ["y = k x", "y + t = m(x + t)"],
          solution: [`$y = ${k}x$, $y + ${t2} = ${m}(x + ${t2})$`, `$${k}x + ${t2} = ${m}x + ${m * t2}$`, `$${k - m}x = ${m * t2 - t2}$, $x = ${s}$`, `$y = ${k} \\cdot ${s} = ${k * s}$ let`],
        });
      }
    },
  },
  {
    id: "dod-mat-ss12-koti",
    topics: ["MAT-SS-1/osnovni-geometrijski-pojmi"],
    gen(level, r) {
      if (level === 1) {
        const t = r.pick(["komp", "supl", "sokot", "sovrsni"]);
        const a = (t === "komp" ? r.int(5, 84) : r.int(5, 174)) + (r.next() < 0.3 ? 0.5 : 0);
        const A = deg(a);
        const D = {
          komp: [`Kolikšen je komplementarni kot kota $\\alpha = ${A}$?`, 90 - a, "\\alpha + \\beta = 90^\\circ", [[180 - a, "Komplementarna kota imata vsoto 90°, ne 180°."]]],
          supl: [`Kolikšen je suplementarni kot kota $\\alpha = ${A}$?`, 180 - a, "\\alpha + \\beta = 180^\\circ", [[90 - a, "Suplementarna kota imata vsoto 180°, ne 90°."], [360 - a, "Suplementarna kota imata vsoto 180°."]]],
          sokot: [`Kota $\\alpha = ${A}$ in $\\beta$ sta sokota. Koliko meri kot $\\beta$?`, 180 - a, "\\alpha + \\beta = 180^\\circ", [[90 - a, "Sokota skupaj tvorita iztegnjeni kot (180°)."], [a, "Enaka sta sovršna kota, ne sokota."]]],
          sovrsni: [`Premici se sekata pod kotom $\\alpha = ${A}$. Koliko meri kot, ki je kotu $\\alpha$ sovršen?`, a, "\\alpha = \\beta \\ (\\text{sovršna kota})", [[180 - a, "To je sokot; sovršna kota sta enaka."]]],
        }[t];
        return T({
          text: D[0],
          answer: num(D[1], "°", null, D[3]),
          hint: { komp: "Komplementarna kota se dopolnjujeta do pravega kota.", supl: "Suplementarna kota se dopolnjujeta do iztegnjenega kota.", sokot: "Sokota imata skupen en krak, druga kraka pa tvorita premico.", sovrsni: "Sovršna kota ležita drug nasproti drugemu ob presečišču premic." }[t],
          data: { given: [`\\alpha = ${A}`], find: ["\\beta"] },
          formula: D[2],
          solution: t === "sovrsni" ? [`Sovršna kota sta skladna.`, `$\\beta = \\alpha = ${A}$`] : [`$\\beta = ${t === "komp" ? 90 : 180}^\\circ - \\alpha$`, `$\\beta = ${t === "komp" ? 90 : 180}^\\circ - ${A} = ${deg(D[1])}$`],
        });
      }
      if (level === 2) {
        const R = r.pick([
          { name: "sta sovršna", tot: 0, f: "\\alpha = \\beta" },
          { name: "sta sokota", tot: 180, f: "\\alpha + \\beta = 180^\\circ" },
          { name: "sta komplementarna", tot: 90, f: "\\alpha + \\beta = 90^\\circ" },
          { name: "sta izmenična kota ob dveh vzporednicah, ki ju seka tretja premica", tot: 0, f: "\\alpha = \\beta" },
        ]);
        const x0 = r.int(5, 25);
        let p;
        let s;
        do {
          p = r.int(1, 6);
          s = r.int(1, 6);
        } while (p === s);
        const A1 = R.tot ? r.int(10, R.tot - 10) : r.int(20, 160);
        const A2 = R.tot ? R.tot - A1 : A1;
        const q1 = A1 - p * x0;
        const q2 = A2 - s * x0;
        const ea = `(${lin(p, q1)})^\\circ`;
        const eb = `(${lin(s, q2)})^\\circ`;
        const askA = r.next() < 0.5;
        const val = askA ? A1 : A2;
        const eqs = R.tot
          ? [`$${lin(p, q1)} + ${lin(s, q2)} = ${R.tot}$`, `$${lin(p + s, q1 + q2)} = ${R.tot}$`, `$${p + s}x = ${R.tot - q1 - q2}$, $x = ${x0}$`]
          : [`$${lin(p, q1)} = ${lin(s, q2)}$`, `$${mono(p - s, "x")} = ${q2 - q1}$, $x = ${x0}$`];
        return T({
          text: `Kota $\\alpha = ${ea}$ in $\\beta = ${eb}$ ${R.name}. Koliko meri kot $${askA ? "\\alpha" : "\\beta"}$?`,
          answer: num(val, "°", null, [[x0, "To je vrednost x; vstavi jo še v izraz za kot."], [askA ? A2 : A1, "To je drugi kot."]]),
          hint: `Zapiši enačbo $${R.f}$ in jo reši na $x$.`,
          data: { given: [`\\alpha = ${ea}`, `\\beta = ${eb}`], find: [askA ? "\\alpha" : "\\beta"] },
          formula: R.f,
          solution: [...eqs, askA ? `$\\alpha = ${p === 1 ? "" : `${p} \\cdot `}${x0}^\\circ ${sg(q1)}^\\circ = ${deg(A1)}$` : `$\\beta = ${s === 1 ? "" : `${s} \\cdot `}${x0}^\\circ ${sg(q2)}^\\circ = ${deg(A2)}$`],
        });
      }
      if (r.next() < 0.5) {
        const h = r.int(1, 12);
        const m = r.int(1, 59);
        const H = (h % 12) * 30 + 0.5 * m;
        const M = 6 * m;
        const d = Math.abs(H - M);
        const th = Math.min(d, 360 - d);
        const d2 = Math.abs((h % 12) * 30 - M);
        const mm = String(m).padStart(2, "0");
        return T({
          text: r.pick([`Koliko meri manjši kot med urnim in minutnim kazalcem, ko ura kaže ${h}.${mm}?`, `Ura kaže ${h}.${mm}. Kolikšen je manjši kot med kazalcema?`]),
          answer: num(th, "°", null, [[Math.min(d2, 360 - d2), "Urni kazalec se ne premika v skokih: vsako minuto se zavrti za 0,5°."], [360 - th, "Iščemo manjšega od obeh kotov med kazalcema."]]),
          hint: "Izračunaj, za koliko stopinj je vsak kazalec zavrten od številke 12. Minutni se vsako minuto zavrti za $6^\\circ$, urni za $0{,}5^\\circ$.",
          data: { given: [`\\text{ure} = ${h}`, `\\text{minute} = ${m}`], find: ["\\varphi"] },
          formula: ["\\alpha_{\\text{urni}} = 30^\\circ \\cdot h + 0{,}5^\\circ \\cdot m", "\\alpha_{\\text{minutni}} = 6^\\circ \\cdot m"],
          solution: [`Urni kazalec: $30^\\circ \\cdot ${h % 12} + 0{,}5^\\circ \\cdot ${m} = ${deg(H)}$`, `Minutni kazalec: $6^\\circ \\cdot ${m} = ${deg(M)}$`, `Razlika: $${deg(d)}$${d > 180 ? `, manjši kot: $360^\\circ - ${deg(d)} = ${deg(th)}$` : ""}`, `$\\varphi = ${deg(th)}$`],
        });
      }
      const NW = { 2: "dvo", 3: "tri", 4: "štiri" };
      for (;;) {
        const base = r.pick([90, 180]);
        const n = r.int(2, 4);
        const k = r.nonZero(-40, 40);
        if ((n * base + k) % (n + 1)) continue;
        const a = (n * base + k) / (n + 1);
        if (a <= 0 || a >= base) continue;
        const kind = base === 90 ? "komplementarnega" : "suplementarnega";
        return T({
          text: `Kot $\\alpha$ je za $${Math.abs(k)}^\\circ$ ${k > 0 ? "večji" : "manjši"} od ${NW[n]}kratnika svojega ${kind} kota. Koliko meri $\\alpha$?`,
          answer: num(a, "°", null, [[base - a, `To je ${kind.replace("ega", "i")} kot; vprašanje je po α.`], [(n * base + k) / n, `Ko člen ${n}α preneseš na levo, dobiš ${n + 1}α.`]]),
          hint: `${base === 90 ? "Komplementarni" : "Suplementarni"} kot kota $\\alpha$ je $${base}^\\circ - \\alpha$. Zapiši enačbo za $\\alpha$.`,
          data: { given: [`\\Delta = ${Math.abs(k)}^\\circ`], find: ["\\alpha"] },
          formula: `\\beta = ${base}^\\circ - \\alpha`,
          solution: [`$\\alpha = ${n}(${base}^\\circ - \\alpha) ${k > 0 ? "+" : "-"} ${Math.abs(k)}^\\circ$`, `$\\alpha = ${n * base}^\\circ - ${n}\\alpha ${k > 0 ? "+" : "-"} ${Math.abs(k)}^\\circ$`, `$${n + 1}\\alpha = ${n * base + k}^\\circ$`, `$\\alpha = ${deg(a)}$`],
        });
      }
    },
  },
  {
    id: "dod-mat-ss12-trikotnik",
    topics: ["MAT-SS-1/trikotnik"],
    gen(level, r) {
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const a = r.int(20, 100);
          const b = r.int(15, 160 - a);
          return T({
            text: r.pick([`V trikotniku $ABC$ je $\\alpha = ${a}^\\circ$ in $\\beta = ${b}^\\circ$. Koliko meri kot $\\gamma$?`, `Dva notranja kota trikotnika merita $${a}^\\circ$ in $${b}^\\circ$. Koliko meri tretji notranji kot?`]),
            answer: num(180 - a - b, "°", null, [[360 - a - b, "Vsota notranjih kotov trikotnika je 180°, ne 360°."], [a + b, "To je zunanji kot ob tretjem oglišču."]]),
            hint: "Vsota notranjih kotov trikotnika je $180^\\circ$.",
            data: { given: [`\\alpha = ${a}^\\circ`, `\\beta = ${b}^\\circ`], find: ["\\gamma"] },
            formula: "\\alpha + \\beta + \\gamma = 180^\\circ",
            solution: [`$\\gamma = 180^\\circ - \\alpha - \\beta$`, `$\\gamma = 180^\\circ - ${a}^\\circ - ${b}^\\circ = ${180 - a - b}^\\circ$`],
          });
        }
        if (t === 1) {
          const a = r.int(20, 90);
          const b = r.int(15, 150 - a);
          return T({
            text: `V trikotniku $ABC$ je $\\alpha = ${a}^\\circ$ in $\\beta = ${b}^\\circ$. Koliko meri zunanji kot $\\gamma'$ ob oglišču $C$?`,
            answer: num(a + b, "°", null, [[180 - a - b, "To je notranji kot γ; zunanji kot je njegov sokot."], [360 - a - b, "Zunanji kot je enak vsoti notranjih kotov ob drugih dveh ogliščih."]]),
            hint: "Zunanji kot je sokot notranjega kota ob istem oglišču.",
            data: { given: [`\\alpha = ${a}^\\circ`, `\\beta = ${b}^\\circ`], find: ["\\gamma'"] },
            formula: "\\gamma' = 180^\\circ - \\gamma = \\alpha + \\beta",
            solution: [`$\\gamma = 180^\\circ - ${a}^\\circ - ${b}^\\circ = ${180 - a - b}^\\circ$`, `$\\gamma' = 180^\\circ - ${180 - a - b}^\\circ = ${a + b}^\\circ$ (kar je ravno $\\alpha + \\beta$)`],
          });
        }
        if (r.next() < 0.5) {
          const gm = 2 * r.int(10, 80);
          return T({
            text: `V enakokrakem trikotniku meri kot ob vrhu $\\gamma = ${gm}^\\circ$. Koliko meri kot ob osnovnici?`,
            answer: num((180 - gm) / 2, "°", null, [[180 - gm, "Ostanek do 180° si delita oba kota ob osnovnici."], [gm, "Kota ob osnovnici sta enaka med sabo, ne kotu ob vrhu."]]),
            hint: "Kota ob osnovnici enakokrakega trikotnika sta skladna.",
            data: { given: [`\\gamma = ${gm}^\\circ`], find: ["\\alpha"] },
            formula: "2\\alpha + \\gamma = 180^\\circ",
            solution: [`$2\\alpha = 180^\\circ - ${gm}^\\circ = ${180 - gm}^\\circ$`, `$\\alpha = ${(180 - gm) / 2}^\\circ$`],
          });
        }
        const al = r.int(20, 85);
        return T({
          text: `V enakokrakem trikotniku meri kot ob osnovnici $\\alpha = ${al}^\\circ$. Koliko meri kot ob vrhu?`,
          answer: num(180 - 2 * al, "°", null, [[180 - al, "Ob osnovnici sta dva enaka kota."], [90 - al, "Vsota notranjih kotov je 180°: γ = 180° − 2α."]]),
          hint: "Kota ob osnovnici enakokrakega trikotnika sta skladna.",
          data: { given: [`\\alpha = ${al}^\\circ`], find: ["\\gamma"] },
          formula: "2\\alpha + \\gamma = 180^\\circ",
          solution: [`$\\gamma = 180^\\circ - 2 \\cdot ${al}^\\circ$`, `$\\gamma = ${180 - 2 * al}^\\circ$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const k = r.int(2, 12);
          const tt = 3 * k;
          const toV = r.next() < 0.5;
          return T({
            text: `V trikotniku $ABC$ meri težiščnica $t_a = ${tt}\\ \\mathrm{cm}$. Kolikšna je razdalja od težišča $T$ do ${toV ? "oglišča $A$" : "razpolovišča stranice $a$"}?`,
            answer: num(toV ? 2 * k : k, "cm", null, [[tt / 2, "Težišče ne razpolavlja težiščnice – deli jo v razmerju 2 : 1."], [toV ? k : 2 * k, "Daljši del težiščnice je ob oglišču."]]),
            hint: "Težišče deli vsako težiščnico v razmerju $2 : 1$, merjeno od oglišča.",
            data: { given: [dat("t_a", tt, "cm")], find: [toV ? "|AT|" : "|TA_1|"] },
            formula: "|AT| : |TA_1| = 2 : 1",
            solution: [`$|AT| = \\dfrac{2}{3} \\cdot ${tt}\\ \\mathrm{cm} = ${2 * k}\\ \\mathrm{cm}$`, `$|TA_1| = \\dfrac{1}{3} \\cdot ${tt}\\ \\mathrm{cm} = ${k}\\ \\mathrm{cm}$`, `Iskana razdalja: $${toV ? 2 * k : k}\\ \\mathrm{cm}$`],
          });
        }
        if (t === 1) {
          const [p, s, h] = r.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10]]);
          const k = r.int(1, 3);
          const [a, b, c] = [p * k, s * k, h * k];
          return T({
            text: `Pravokotni trikotnik ima kateti $a = ${a}\\ \\mathrm{cm}$ in $b = ${b}\\ \\mathrm{cm}$. Kolikšen je polmer trikotniku očrtane krožnice?`,
            answer: num(c / 2, "cm", null, [[c, "To je hipotenuza; središče očrtane krožnice je v njenem razpolovišču."], [(a + b) / 2, "Polmer je polovica hipotenuze, ne povprečje katet."]]),
            hint: "Po Talesovem izreku je hipotenuza premer očrtane krožnice.",
            data: { given: [dat("a", a, "cm"), dat("b", b, "cm")], find: ["R"] },
            formula: ["c^2 = a^2 + b^2", "R = \\dfrac{c}{2}"],
            solution: [`$c = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${c * c}} = ${c}\\ \\mathrm{cm}$`, `$R = \\dfrac{c}{2} = ${tx(c / 2)}\\ \\mathrm{cm}$`],
          });
        }
        if (r.next() < 0.5) {
          const P = [["Središče očrtane krožnice", "simetral stranic", "središče očrtane krožnice"], ["Središče včrtane krožnice", "simetral notranjih kotov", "središče včrtane krožnice"], ["Težišče", "težiščnic", "težišče"], ["Višinska točka", "nosilk višin", "višinska točka"]];
          const i = r.int(0, 3);
          return T({
            text: `${P[i][0]} trikotnika je presečišče …`,
            answer: choice(r, P[i][1], P.filter((_, j) => j !== i).map((x) => [x[1], `V presečišču ${x[1]} leži ${x[2]}.`])),
            hint: "Spomni se, katere točke so enako oddaljene od oglišč, katere od stranic in katera je ravnovesna točka.",
            data: false,
            formula: false,
            solution: [`${P[i][0]} trikotnika je presečišče ${P[i][1]}.`, i === 0 ? "Vsaka točka simetrale stranice je enako oddaljena od krajišč stranice, zato je presečišče enako oddaljeno od vseh oglišč." : i === 1 ? "Vsaka točka simetrale kota je enako oddaljena od krakov, zato je presečišče enako oddaljeno od vseh stranic." : i === 2 ? "Težiščnica povezuje oglišče z razpoloviščem nasprotne stranice." : "Višina je pravokotnica iz oglišča na nosilko nasprotne stranice."],
          });
        }
        const types = ["ostrokotnem", "pravokotnem", "topokotnem"];
        const ti = r.int(0, 2);
        const circ = r.next() < 0.5;
        const O = ["znotraj trikotnika", "na stranici trikotnika", "v oglišču trikotnika", "zunaj trikotnika"];
        const W = {
          [O[0]]: "Znotraj trikotnika leži le pri ostrokotnem trikotniku.",
          [O[1]]: "Na stranici (v razpolovišču hipotenuze) leži središče očrtane krožnice pravokotnega trikotnika.",
          [O[2]]: "V oglišču pravega kota leži višinska točka pravokotnega trikotnika.",
          [O[3]]: "Zunaj trikotnika leži pri topokotnem trikotniku.",
        };
        const correct = ti === 0 ? O[0] : ti === 2 ? O[3] : circ ? O[1] : O[2];
        return T({
          text: `Kje leži ${circ ? "središče očrtane krožnice" : "višinska točka"} v ${types[ti]} trikotniku?`,
          answer: choice(r, correct, O.filter((o) => o !== correct).map((o) => [o, W[o]])),
          hint: circ ? "Pomisli na Talesov izrek: kje je središče krožnice nad premerom?" : "V pravokotnem trikotniku sta kateti tudi višini.",
          data: false,
          formula: false,
          solution: [circ ? "Središče očrtane krožnice je presečišče simetral stranic." : "Višinska točka je presečišče nosilk višin.", `V ${types[ti]} trikotniku leži ${correct}.`],
        });
      }
      if (r.next() < 0.5) {
        const byG = r.next() < 0.5;
        let a;
        let b;
        do {
          a = r.int(20, 120);
          b = r.int(20, 140 - a);
        } while ((a + b) % 2);
        const gm = 180 - a - b;
        const val = 90 + gm / 2;
        return T({
          text: byG
            ? `Simetrali notranjih kotov ob ogliščih $A$ in $B$ trikotnika $ABC$ se sekata v točki $S$. Koliko meri kot $ASB$, če je $\\gamma = ${gm}^\\circ$?`
            : `V trikotniku $ABC$ je $\\alpha = ${a}^\\circ$ in $\\beta = ${b}^\\circ$. Simetrali kotov $\\alpha$ in $\\beta$ se sekata v točki $S$. Koliko meri kot $ASB$?`,
          answer: num(val, "°", null, [[180 - gm, "Simetrala razpolovi kot – v trikotniku ABS sta kota α/2 in β/2."], [90 - gm / 2, "Preveri: ∠ASB = 180° − (α + β)/2."], [gm, "To je kot γ."]]),
          hint: "Opazuj trikotnik $ABS$: njegova kota ob $A$ in $B$ sta polovici kotov $\\alpha$ in $\\beta$.",
          data: { given: byG ? [`\\gamma = ${gm}^\\circ`] : [`\\alpha = ${a}^\\circ`, `\\beta = ${b}^\\circ`], find: ["\\angle ASB"] },
          formula: ["\\alpha + \\beta + \\gamma = 180^\\circ", "\\angle ASB = 180^\\circ - \\dfrac{\\alpha + \\beta}{2}"],
          solution: [byG ? `$\\alpha + \\beta = 180^\\circ - ${gm}^\\circ = ${a + b}^\\circ$` : `$\\alpha + \\beta = ${a + b}^\\circ$`, `$\\dfrac{\\alpha}{2} + \\dfrac{\\beta}{2} = ${(a + b) / 2}^\\circ$`, `$\\angle ASB = 180^\\circ - ${(a + b) / 2}^\\circ = ${val}^\\circ$`],
        });
      }
      const OPT = { SSS: "izrek SSS", SKS: "izrek SKS", KSK: "izrek KSK", SsK: "izrek SsK", none: "nista nujno skladna" };
      const WHY = {
        SSS: "Izrek SSS zahteva vse tri pare stranic.",
        SKS: "Izrek SKS zahteva dve stranici in kot med njima.",
        KSK: "Izrek KSK zahteva stranico in oba kota ob njej.",
        SsK: "Izrek SsK zahteva dve stranici in kot nasproti daljši od njiju.",
        none: "Podatki zadoščajo za enega od izrekov o skladnosti.",
      };
      const kind = r.pick(["SSS", "SKS", "KSK", "SsK", "none", "none"]);
      const cm = (s, v) => `${s} = ${s}' = ${v}\\ \\mathrm{cm}`;
      const dg = (s, v) => `\\${s} = \\${s}' = ${v}^\\circ`;
      let given;
      let why = { ...WHY };
      let sol;
      const x = r.int(4, 9);
      const y = r.int(x + 1, x + 5);
      if (kind === "SSS") {
        given = [cm("a", x), cm("b", y), cm("c", r.int(y - x + 1, x + y - 1))];
        sol = "Vse tri stranice so paroma enake.";
      } else if (kind === "SKS") {
        given = [cm("a", x), cm("b", y), dg("gamma", r.int(30, 120))];
        sol = "Kot $\\gamma$ leži med stranicama $a$ in $b$.";
      } else if (kind === "KSK") {
        const al = r.int(30, 80);
        given = [cm("c", x), dg("alpha", al), dg("beta", r.int(30, 150 - al))];
        sol = "Kota $\\alpha$ in $\\beta$ ležita ob stranici $c$.";
      } else if (kind === "SsK") {
        given = [cm("a", y), cm("b", x), dg("alpha", r.int(40, 110))];
        sol = "Kot $\\alpha$ leži nasproti daljše stranice $a$.";
      } else if (r.next() < 0.5) {
        const al = r.int(30, 80);
        const be = r.int(30, 140 - al);
        given = [dg("alpha", al), dg("beta", be), dg("gamma", 180 - al - be)];
        sol = "Enaki koti določajo le obliko (podobnost), ne velikosti.";
        why.SsK = "Ni nobene stranice – podobna trikotnika sta lahko različno velika.";
      } else {
        given = [cm("a", x), cm("b", y), dg("alpha", r.int(25, 60))];
        sol = "Kot $\\alpha$ leži nasproti krajše stranice $a$, zato podatki ne določajo trikotnika enolično.";
        why.SsK = "Kot leži nasproti krajše stranice, zato SsK ne velja.";
        why.SKS = "Kot α ne leži med stranicama a in b.";
      }
      const others = r.shuffle(Object.keys(OPT).filter((k) => k !== kind)).slice(0, 3);
      return T({
        text: `Za trikotnika $ABC$ in $A'B'C'$ velja: $${given.join("$, $")}$. Ali sta skladna, in po katerem izreku?`,
        answer: choice(r, OPT[kind], others.map((k) => [OPT[k], why[k]])),
        hint: "Preveri, katere stranice in kote poznaš ter kje ležijo: kot med stranicama, ob stranici ali nasproti stranice.",
        data: { given, find: ["\\text{izrek o skladnosti}"] },
        formula: false,
        solution: [sol, kind === "none" ? "Trikotnika nista nujno skladna." : `Trikotnika sta skladna po izreku ${kind}.`],
      });
    },
  },
  {
    id: "dod-mat-ss12-stirikotniki",
    topics: ["MAT-SS-1/stirikotniki-in-krog"],
    gen(level, r) {
      const U = "cm^2";
      const area = (v, d, ms) => num(v, "cm²", d, ms, { unitAlternatives: ["cm2"] });
      if (level === 1) {
        const t = r.pick(["par", "romb", "trapez", "deltoid"]);
        if (t === "par") {
          const [a, v] = [r.int(4, 20), r.int(3, 15)];
          return T({
            text: `Paralelogram ima stranico $a = ${a}\\ \\mathrm{cm}$ in višino na to stranico $v_a = ${v}\\ \\mathrm{cm}$. Kolikšna je njegova ploščina?`,
            answer: area(a * v, null, [[(a * v) / 2, "Pri paralelogramu ne deliš z 2 – to velja za trikotnik."]]),
            hint: "Ploščina paralelograma je stranica krat višina na to stranico.",
            data: { given: [dat("a", a, "cm"), dat("v_a", v, "cm")], find: ["S"] },
            formula: "S = a \\cdot v_a",
            solution: [`$S = a \\cdot v_a = ${a}\\ \\mathrm{cm} \\cdot ${v}\\ \\mathrm{cm}$`, `$S = ${qty(a * v, U)}$`],
          });
        }
        if (t === "trapez") {
          const [a, c, v] = [r.int(8, 20), r.int(3, 7), r.int(3, 12)];
          return T({
            text: `Trapez ima osnovnici $a = ${a}\\ \\mathrm{cm}$ in $c = ${c}\\ \\mathrm{cm}$ ter višino $v = ${v}\\ \\mathrm{cm}$. Kolikšna je njegova ploščina?`,
            answer: area(((a + c) * v) / 2, null, [[(a + c) * v, "Vsoto osnovnic je treba deliti z 2 (srednjica)."], [(a * c * v) / 2, "Osnovnici seštej, ne zmnoži."]]),
            hint: "Ploščina trapeza je srednjica krat višina.",
            data: { given: [dat("a", a, "cm"), dat("c", c, "cm"), dat("v", v, "cm")], find: ["S"] },
            formula: "S = \\dfrac{a + c}{2} \\cdot v",
            solution: [`$S = \\dfrac{${a} + ${c}}{2} \\cdot ${v} = ${tx((a + c) / 2)} \\cdot ${v}$`, `$S = ${qty(tx(((a + c) * v) / 2), U)}$`],
          });
        }
        const [e, f] = [2 * r.int(2, 10), r.int(3, 16)];
        const nm = t === "romb" ? "Romb" : "Deltoid";
        return T({
          text: `${nm} ima diagonali $e = ${e}\\ \\mathrm{cm}$ in $f = ${f}\\ \\mathrm{cm}$. Kolikšna je njegova ploščina?`,
          answer: area((e * f) / 2, null, [[e * f, "Zmnožek diagonal je ploščina pravokotnika okoli lika – deli ga z 2."], [(e + f) / 2, "Diagonali zmnoži, ne seštej."]]),
          hint: `Diagonali ${t === "romb" ? "romba" : "deltoida"} sta pravokotni; lik je pol pravokotnika s stranicama $e$ in $f$.`,
          data: { given: [dat("e", e, "cm"), dat("f", f, "cm")], find: ["S"] },
          formula: "S = \\dfrac{e \\cdot f}{2}",
          solution: [`$S = \\dfrac{${e} \\cdot ${f}}{2}$`, `$S = ${qty((e * f) / 2, U)}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const [p, s, h] = r.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [6, 8, 10]]);
          const k = r.int(1, 2);
          const [x, v, b] = [p * k, s * k, h * k];
          const c = r.int(2, 12);
          const a = c + 2 * x;
          const S = ((a + c) * v) / 2;
          return T({
            text: `Enakokraki trapez ima osnovnici $a = ${a}\\ \\mathrm{cm}$ in $c = ${c}\\ \\mathrm{cm}$ ter krak $b = ${b}\\ \\mathrm{cm}$. Izračunaj njegovo ploščino.`,
            answer: area(S, null, [[((a + c) * b) / 2, "Krak ni višina – višino izračunaj s Pitagorovim izrekom."], [(a + c) * v, "Vsoto osnovnic deli z 2."]]),
            hint: "Iz oglišča $D$ spusti višino na $a$. Nastane pravokotni trikotnik s hipotenuzo $b$ in kateto $\\dfrac{a - c}{2}$.",
            data: { given: [dat("a", a, "cm"), dat("c", c, "cm"), dat("b", b, "cm")], find: ["S"] },
            formula: ["v^2 = b^2 - \\left(\\dfrac{a - c}{2}\\right)^2", "S = \\dfrac{a + c}{2} \\cdot v"],
            solution: [`$\\dfrac{a - c}{2} = \\dfrac{${a} - ${c}}{2} = ${x}\\ \\mathrm{cm}$`, `$v = \\sqrt{${b}^2 - ${x}^2} = \\sqrt{${v * v}} = ${v}\\ \\mathrm{cm}$`, `$S = \\dfrac{${a} + ${c}}{2} \\cdot ${v} = ${qty(tx(S), U)}$`],
          });
        }
        if (t === 1) {
          const rr = r.int(3, 15);
          const al = r.pick([30, 40, 45, 60, 72, 80, 100, 120, 135, 150, 210, 240]);
          const askS = r.next() < 0.5;
          const S = (Math.PI * rr * rr * al) / 360;
          const l = (Math.PI * rr * al) / 180;
          return T({
            text: `Krožni izsek ima polmer $r = ${rr}\\ \\mathrm{cm}$ in središčni kot $\\alpha = ${al}^\\circ$. Izračunaj ${askS ? "ploščino izseka" : "dolžino krožnega loka"}. Rezultat zaokroži na dve decimalki.`,
            answer: askS
              ? area(S, 2, [[Math.PI * rr * rr, "To je ploščina celega kroga – vzemi le delež α/360°."], [(Math.PI * 4 * rr * rr * al) / 360, "V formuli je polmer, ne premer."]])
              : num(l, "cm", 2, [[2 * Math.PI * rr, "To je obseg celega kroga – vzemi le delež α/360°."], [(Math.PI * rr * rr * al) / 360, "To je ploščina izseka, ne dolžina loka."]]),
            hint: `Izsek je del kroga v razmerju $\\dfrac{\\alpha}{360^\\circ}$.`,
            data: { given: [dat("r", rr, "cm"), `\\alpha = ${al}^\\circ`], find: [askS ? "S" : "l"] },
            formula: askS ? "S = \\dfrac{\\pi r^2 \\alpha}{360^\\circ}" : "l = \\dfrac{2\\pi r \\alpha}{360^\\circ}",
            solution: askS
              ? [`$S = \\dfrac{\\pi \\cdot ${rr}^2 \\cdot ${al}^\\circ}{360^\\circ}$`, `$S ${eq(S, 2)} ${qty(tx(S, 2), U)}$`]
              : [`$l = \\dfrac{2\\pi \\cdot ${rr} \\cdot ${al}^\\circ}{360^\\circ}$`, `$l ${eq(l, 2)} ${qty(tx(l, 2), "cm")}$`],
          });
        }
        const k = 2 * r.int(5, 40);
        const big = r.next() < 0.5;
        const val = big ? 90 + k / 2 : 90 - k / 2;
        return T({
          text: `V paralelogramu je en notranji kot za $${k}^\\circ$ večji od drugega. Koliko meri ${big ? "večji" : "manjši"} notranji kot?`,
          answer: num(val, "°", null, big ? [[90 + k, "Razliko si prištel k 90°, prišteti moraš le njeno polovico."], [(360 + k) / 2, "Sosednja kota paralelograma imata vsoto 180°, ne 360°."]] : [[90 - k, "Od 90° odštej le polovico razlike."], [(360 - k) / 2, "Sosednja kota paralelograma imata vsoto 180°, ne 360°."]]),
          hint: "Sosednja kota paralelograma sta suplementarna (vsota $180^\\circ$).",
          data: { given: [`\\beta - \\alpha = ${k}^\\circ`], find: [big ? "\\beta" : "\\alpha"] },
          formula: "\\alpha + \\beta = 180^\\circ",
          solution: [`$\\alpha + (\\alpha + ${k}^\\circ) = 180^\\circ$`, `$2\\alpha = ${180 - k}^\\circ$, $\\alpha = ${90 - k / 2}^\\circ$`, `$\\beta = ${90 + k / 2}^\\circ$`],
        });
      }
      const t = r.int(0, 3);
      if (t === 0) {
        const [p, s, h] = r.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13]]);
        const k = r.int(1, 3);
        const [a, e2, f2] = [h * k, p * k, s * k];
        const e = 2 * e2;
        const f = 2 * f2;
        return T({
          text: `Romb ima stranico $a = ${a}\\ \\mathrm{cm}$ in diagonalo $e = ${e}\\ \\mathrm{cm}$. Izračunaj ploščino romba.`,
          answer: area((e * f) / 2, null, [[e * f, "Zmnožek diagonal še razpolovi."], [a * a, "Romb ni kvadrat – ploščina ni a²."], [(e * f2) / 2, "Pitagorov izrek ti da polovico diagonale f – podvoji jo."]]),
          hint: "Diagonali romba se razpolavljata in sta pravokotni: polovici diagonal in stranica tvorijo pravokotni trikotnik.",
          data: { given: [dat("a", a, "cm"), dat("e", e, "cm")], find: ["S"] },
          formula: ["\\left(\\dfrac{f}{2}\\right)^2 = a^2 - \\left(\\dfrac{e}{2}\\right)^2", "S = \\dfrac{e \\cdot f}{2}"],
          solution: [`$\\dfrac{e}{2} = ${e2}\\ \\mathrm{cm}$`, `$\\dfrac{f}{2} = \\sqrt{${a}^2 - ${e2}^2} = ${f2}\\ \\mathrm{cm}$, $f = ${f}\\ \\mathrm{cm}$`, `$S = \\dfrac{${e} \\cdot ${f}}{2} = ${qty((e * f) / 2, U)}$`],
        });
      }
      if (t === 1) {
        const o = r.dec(10, 90, 1);
        const S = (o * o) / (4 * Math.PI);
        const what = r.pick(["Obseg kroga meri", "Okrogla miza ima obseg", "Obroč ima obseg"]);
        return T({
          text: `${what} $o = ${tx(o)}\\ \\mathrm{cm}$. Kolikšna je ploščina kroga? Rezultat zaokroži na dve decimalki.`,
          answer: area(S, 2, [[(o * o) / Math.PI, "Iz obsega o = 2πr dobiš r = o/(2π), ne o/π."], [Math.PI * o * o, "Najprej iz obsega izračunaj polmer."]]),
          hint: "Iz obsega najprej izračunaj polmer, nato ploščino.",
          data: { given: [dat("o", tx(o), "cm")], find: ["S"] },
          formula: ["o = 2\\pi r", "S = \\pi r^2"],
          solution: [`$r = \\dfrac{o}{2\\pi} = \\dfrac{${tx(o)}}{2\\pi} \\approx ${tx(o / (2 * Math.PI), 4)}\\ \\mathrm{cm}$`, `$S = \\pi r^2 ${eq(S, 2)} ${qty(tx(S, 2), U)}$`],
        });
      }
      if (t === 2) {
        if (r.next() < 0.5) {
          let a;
          let b;
          let c;
          do {
            [a, b, c] = [r.int(4, 15), r.int(4, 15), r.int(4, 15)];
          } while (a + c - b < 3 || a === b);
          const d = a + c - b;
          return T({
            text: `Štirikotniku $ABCD$ je včrtana krožnica. Stranice merijo $a = ${a}\\ \\mathrm{cm}$, $b = ${b}\\ \\mathrm{cm}$ in $c = ${c}\\ \\mathrm{cm}$. Koliko meri stranica $d$?`,
            answer: num(d, "cm", null, [[a + b - c, "V tangentnem štirikotniku sta enaki vsoti NASPROTNIH stranic: a + c = b + d."], [b + c - a, "V tangentnem štirikotniku velja a + c = b + d."]]),
            hint: "Štirikotnik z včrtano krožnico je tangentni štirikotnik.",
            data: { given: [dat("a", a, "cm"), dat("b", b, "cm"), dat("c", c, "cm")], find: ["d"] },
            formula: "a + c = b + d",
            solution: [`$d = a + c - b$`, `$d = ${a} + ${c} - ${b} = ${d}\\ \\mathrm{cm}$`],
          });
        }
        const al = r.int(50, 120);
        const k = r.int(5, Math.min(50, 165 - al));
        const be = al + k;
        return T({
          text: `Štirikotnik $ABCD$ je tetiven. Kot $\\alpha$ meri $${al}^\\circ$, kot $\\beta$ pa je za $${k}^\\circ$ večji od $\\alpha$. Koliko meri kot $\\delta$?`,
          answer: num(180 - be, "°", null, [[180 - al, "Kot δ leži nasproti kota β, ne α."], [360 - be, "Nasprotna kota tetivnega štirikotnika imata vsoto 180°."]]),
          hint: "V tetivnem štirikotniku sta nasprotna kota suplementarna.",
          data: { given: [`\\alpha = ${al}^\\circ`, `\\beta - \\alpha = ${k}^\\circ`], find: ["\\delta"] },
          formula: ["\\alpha + \\gamma = 180^\\circ", "\\beta + \\delta = 180^\\circ"],
          solution: [`$\\beta = ${al}^\\circ + ${k}^\\circ = ${be}^\\circ$`, `$\\delta = 180^\\circ - ${be}^\\circ = ${180 - be}^\\circ$`],
        });
      }
      const D = r.int(12, 40);
      const d = r.int(4, D - 4);
      const S = (Math.PI * (D * D - d * d)) / 4;
      return T({
        text: `Kovinska podložka ima obliko kolobarja z zunanjim premerom $${D}\\ \\mathrm{mm}$ in notranjim premerom $${d}\\ \\mathrm{mm}$. Kolikšna je ploščina podložke v $\\mathrm{mm^2}$? Zaokroži na eno decimalko.`,
        answer: num(S, "mm²", 1, [[Math.PI * (D * D - d * d), "Premera najprej razpolovi – v formuli sta polmera."], [(Math.PI * (D - d) ** 2) / 4, "Ploščina kolobarja je razlika ploščin krogov, ne krog z razliko polmerov."]], { unitAlternatives: ["mm2"] }),
        hint: "Ploščina kolobarja je razlika ploščin večjega in manjšega kroga.",
        data: { given: [dat("D", D, "mm"), dat("d", d, "mm")], find: ["S"] },
        formula: "S = \\pi (R^2 - r^2)",
        solution: [`$R = ${tx(D / 2)}\\ \\mathrm{mm}$, $r = ${tx(d / 2)}\\ \\mathrm{mm}$`, `$S = \\pi (${tx(D / 2)}^2 - ${tx(d / 2)}^2) ${eq(S, 1)} ${qty(tx(S, 1), "mm^2")}$`],
      });
    },
  },
  {
    id: "dod-mat-ss12-podatki",
    topics: ["MAT-SS-1/obdelava-podatkov"],
    gen(level, r) {
      const list = (v) => v.map((x) => `$${x}$`).join(", ");
      const dl = (v) => `x = ${v.join(";\\ ")}`;
      const median = (v) => {
        const s = [...v].sort((a, b) => a - b);
        const n = s.length;
        return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
      };
      const CTX = [
        { s: (v, w) => `${w} je na zadnjih ${v.length} preizkusih znanja ${g(w, "dosegel", "dosegla")} ${list(v)} točk.`, u: "", gen: () => r.int(8, 30) },
        { s: (v) => `Jutranje temperature v ${v.length} zaporednih dneh so bile ${list(v)} °C.`, u: "°C", gen: () => r.int(-6, 14) },
        { s: (v, w) => `${w} je ${v.length} dni beležil${g(w, "", "a")} čas vožnje v šolo: ${list(v)} minut.`, u: "min", gen: () => r.int(12, 35) },
        { s: (v) => `Igralci košarkarske ekipe so na tekmi dosegli ${list(v)} točk.`, u: "", gen: () => r.int(2, 28) },
      ];
      const C = r.pick(CTX);
      const who = r.pick(NAMES);
      const unit = C.u === "°C" ? "°C" : C.u || null;
      if (level === 1) {
        const n = r.int(5, 7);
        const v = Array.from({ length: n }, C.gen);
        const t = r.int(0, 2);
        const s = sum(v);
        const sorted = [...v].sort((a, b) => a - b);
        if (t === 0) {
          const m = s / n;
          return T({
            text: `${C.s(v, who)} Izračunaj aritmetično sredino. Rezultat zaokroži na eno decimalko.`,
            answer: num(m, unit, 1, [[s / (n - 1), `Vsoto deli s številom podatkov (${n}).`], [median(v), "To je mediana, ne aritmetična sredina."]], unit === "°C" ? { unitAlternatives: ["°", "stopinj"] } : {}),
            hint: "Seštej vse podatke in vsoto deli s številom podatkov.",
            data: { given: [dl(v)], find: ["\\bar{x}"] },
            formula: "\\bar{x} = \\dfrac{x_1 + x_2 + \\ldots + x_n}{n}",
            solution: [`Vsota: $${v.map(par).join(" + ")} = ${s}$`, `$\\bar{x} = \\dfrac{${s}}{${n}} ${eq(m, 1)} ${tx(m, 1)}$`],
          });
        }
        if (t === 1) {
          const v2 = n % 2 ? v : [...v, C.gen()];
          const s2 = [...v2].sort((a, b) => a - b);
          const me = median(v2);
          return T({
            text: `${C.s(v2, who)} Določi mediano.`,
            answer: num(me, unit, null, [[v2[(v2.length - 1) / 2], "Podatke najprej uredi po velikosti, šele nato izberi srednjega."], [roundHalfUp(sum(v2) / v2.length, 1), "To je aritmetična sredina, ne mediana."]], unit === "°C" ? { unitAlternatives: ["°", "stopinj"] } : {}),
            hint: "Podatke uredi po velikosti; mediana je srednji podatek.",
            data: { given: [dl(v2)], find: ["Me"] },
            formula: "Me = x_{\\frac{n + 1}{2}} \\ (n \\text{ liho, podatki urejeni})",
            solution: [`Urejeno: $${s2.join(";\\ ")}$`, `Srednji (${(v2.length + 1) / 2}.) podatek: $Me = ${me}$`],
          });
        }
        const R = sorted[n - 1] - sorted[0];
        return T({
          text: `${C.s(v, who)} Kolikšen je variacijski razmik podatkov?`,
          answer: num(R, unit, null, [[sorted[n - 1], "Od največjega podatka odštej najmanjšega."], [Math.abs(v[n - 1] - v[0]), "Ne odštevaj prvega in zadnjega zapisanega podatka, ampak največjega in najmanjšega."]], unit === "°C" ? { unitAlternatives: ["°", "stopinj"] } : {}),
          hint: "Variacijski razmik je razlika med največjim in najmanjšim podatkom.",
          data: { given: [dl(v)], find: ["R"] },
          formula: "R = x_{\\max} - x_{\\min}",
          solution: [`$x_{\\max} = ${sorted[n - 1]}$, $x_{\\min} = ${sorted[0]}$`, `$R = ${sorted[n - 1]} - ${par(sorted[0])} = ${R}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const f = [r.int(0, 3), r.int(1, 6), r.int(2, 9), r.int(2, 9), r.int(1, 7)];
          const N = sum(f);
          const S = f.reduce((a, x, i) => a + x * (i + 1), 0);
          const m = S / N;
          const shown = [5, 4, 3, 2, 1].filter((o) => f[o - 1] > 0);
          return T({
            text: `Pri pisnem preizkusu so dijaki dobili te ocene: ${shown.map((o) => `$${o}$ (${f[o - 1]}-krat)`).join(", ")}. Izračunaj povprečno oceno na dve decimalki.`,
            answer: num(m, null, 2, [[sum(shown) / shown.length, "Vsako oceno moraš upoštevati tolikokrat, kolikor jo je bilo – uteženo povprečje."], [S / 5, `Deli s številom dijakov (${N}), ne s številom različnih ocen.`]]),
            hint: "Vsako oceno pomnoži z njeno frekvenco, zmnožke seštej in deli s številom vseh dijakov.",
            data: { given: shown.map((o) => `f_${o} = ${f[o - 1]}`), find: ["\\bar{x}"] },
            formula: "\\bar{x} = \\dfrac{f_1 x_1 + f_2 x_2 + \\ldots + f_k x_k}{f_1 + f_2 + \\ldots + f_k}",
            solution: [`Število dijakov: $${shown.map((o) => f[o - 1]).join(" + ")} = ${N}$`, `Vsota ocen: $${shown.map((o) => `${o} \\cdot ${f[o - 1]}`).join(" + ")} = ${S}$`, `$\\bar{x} = \\dfrac{${S}}{${N}} ${eq(m, 2)} ${tx(m, 2)}$`],
          });
        }
        if (t === 1) {
          const n = r.pick([6, 8]);
          const v = Array.from({ length: n }, C.gen);
          const s2 = [...v].sort((a, b) => a - b);
          const me = median(v);
          return T({
            text: `${C.s(v, who)} Določi mediano.`,
            answer: num(me, unit, null, [[(v[n / 2 - 1] + v[n / 2]) / 2, "Podatke najprej uredi po velikosti."], [s2[n / 2], "Pri sodem številu podatkov je mediana povprečje obeh srednjih podatkov."], [roundHalfUp(sum(v) / n, 2), "To je aritmetična sredina."]], unit === "°C" ? { unitAlternatives: ["°", "stopinj"] } : {}),
            hint: "Podatke uredi po velikosti. Pri sodem številu podatkov je mediana povprečje obeh srednjih.",
            data: { given: [dl(v)], find: ["Me"] },
            formula: "Me = \\dfrac{x_{\\frac{n}{2}} + x_{\\frac{n}{2} + 1}}{2} \\ (n \\text{ sodo})",
            solution: [`Urejeno: $${s2.join(";\\ ")}$`, `Srednja podatka: $${s2[n / 2 - 1]}$ in $${s2[n / 2]}$`, `$Me = \\dfrac{${s2[n / 2 - 1]} + ${par(s2[n / 2])}}{2} = ${tx(me)}$`],
          });
        }
        const N = r.pick([20, 24, 25, 30, 36, 40, 48, 50, 60, 80, 120]);
        const k = r.int(2, Math.floor(N / 2));
        const cat = r.pick([["v šolo hodi peš", "anketiranih dijakov"], ["ima rado matematiko", "anketiranih dijakov"], ["zjutraj pije kavo", "anketiranih odraslih"], ["ima doma mačko", "anketiranih družin"]]);
        const ang = (k / N) * 360;
        return T({
          text: `Od $${N}$ ${cat[1]} jih $${k}$ ${cat[0]}. Kolikšen središčni kot pripada tej skupini v strukturnem krogu? Zaokroži na eno decimalko.`,
          answer: num(ang, "°", 1, [[(k / N) * 100, "To je delež v odstotkih; v strukturnem krogu ga pretvori v kot (cel krog je 360°)."], [(k / N) * 180, "Cel krog meri 360°, ne 180°."]]),
          hint: "Delež skupine pomnoži s $360^\\circ$.",
          data: { given: [`N = ${N}`, `k = ${k}`], find: ["\\alpha"] },
          formula: "\\alpha = \\dfrac{k}{N} \\cdot 360^\\circ",
          solution: [`Delež: $\\dfrac{${k}}{${N}} ${eq(k / N, 4)} ${tx(k / N, 4)}$`, `$\\alpha = \\dfrac{${k}}{${N}} \\cdot 360^\\circ ${eq(ang, 1)} ${deg(roundHalfUp(ang, 1))}$`],
        });
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const mu = r.int(5, 20);
        let d;
        do d = [r.int(-5, 5), r.int(-5, 5), r.int(-5, 5), r.int(-5, 5)];
        while (Math.abs(sum(d)) > 5 || d.every((x) => x === 0));
        d.push(-sum(d));
        const v = r.shuffle(d.map((x) => mu + x));
        const ss = sum(d.map((x) => x * x));
        const sd = Math.sqrt(ss / 5);
        return T({
          text: `${r.pick(["Pri metu na koš je", "Na tekmovanju v lokostrelstvu je"])} ${who} v petih serijah ${g(who, "dosegel", "dosegla")} ${list(v)} točk. Izračunaj standardni odklon. Rezultat zaokroži na dve decimalki.`,
          answer: num(sd, null, 2, [[ss / 5, "To je varianca – standardni odklon je njen kvadratni koren."], [Math.sqrt(ss / 4), "Pri populaciji deli vsoto kvadratov odklonov z n = 5."]]),
          hint: "Najprej izračunaj aritmetično sredino, nato odklone od nje, njihove kvadrate in povprečje kvadratov.",
          data: { given: [dl(v)], find: ["\\sigma"] },
          formula: ["\\bar{x} = \\dfrac{x_1 + \\ldots + x_n}{n}", "\\sigma = \\sqrt{\\dfrac{(x_1 - \\bar{x})^2 + \\ldots + (x_n - \\bar{x})^2}{n}}"],
          solution: [`$\\bar{x} = \\dfrac{${sum(v)}}{5} = ${mu}$`, `Odkloni: $${v.map((x) => x - mu).join(";\\ ")}$`, `Vsota kvadratov odklonov: $${ss}$, varianca: $\\dfrac{${ss}}{5} = ${tx(ss / 5)}$`, `$\\sigma = \\sqrt{${tx(ss / 5)}} ${eq(sd, 2)} ${tx(sd, 2)}$`],
        });
      }
      if (t === 1) {
        for (;;) {
          const n = r.pick([4, 5]);
          const mT = n + 1 === 5 ? r.int(15, 23) / 5 : r.int(5, 9) / 2;
          const x = r.int(1, 5);
          const S = Math.round((n + 1) * mT) - x;
          if (S < n || S > 5 * n) continue;
          const m0 = S / n;
          if (Math.abs(m0 - mT) < 1e-9) continue;
          return T({
            text: `${who} ima ${n === 4 ? "štiri ocene" : "pet ocen"} s povprečjem $${tx(m0)}$. Kakšno oceno mora dobiti pri naslednjem preizkusu, da bo povprečje vseh ocen natanko $${tx(mT)}$?`,
            answer: num(x, null, null, [[n * mT - S, `Novo povprečje se računa iz ${n + 1} ocen, ne iz ${n}.`], [roundHalfUp(2 * mT - m0, 2), "Povprečje ni sredina med starim povprečjem in novo oceno – računaj z vsotami."]]),
            hint: "Iz povprečja izračunaj vsoto dosedanjih ocen. Nova vsota mora biti novo povprečje krat novo število ocen.",
            data: { given: [`\\bar{x} = ${tx(m0)}`, `\\bar{x}' = ${tx(mT)}`], find: ["x"] },
            formula: "\\bar{x} = \\dfrac{\\text{vsota}}{n}",
            solution: [`Dosedanja vsota: $${n} \\cdot ${tx(m0)} = ${S}$`, `Potrebna vsota: $${n + 1} \\cdot ${tx(mT)} = ${S + x}$`, `$x = ${S + x} - ${S} = ${x}$`],
          });
        }
      }
      const n1 = r.int(12, 30);
      const n2 = r.int(12, 30);
      const m1 = r.dec(55, 85, 1);
      const m2 = r.dec(55, 85, 1);
      const m = (n1 * m1 + n2 * m2) / (n1 + n2);
      return T({
        text: `Razred A ima $${n1}$ dijakov s povprečjem $${tx(m1)}$ točke, razred B pa $${n2}$ dijakov s povprečjem $${tx(m2)}$ točke. Kolikšno je povprečje vseh dijakov obeh razredov? Zaokroži na dve decimalki.`,
        answer: num(m, null, 2, [[(m1 + m2) / 2, "Razreda sta različno velika – izračunaj skupno vsoto točk in jo deli s številom vseh dijakov."], [(n1 * m1 + n2 * m2) / 2, "Deliti moraš s številom vseh dijakov."]]),
        hint: "Za vsak razred izračunaj vsoto točk (povprečje krat število dijakov).",
        data: { given: [`n_A = ${n1}`, `\\bar{x}_A = ${tx(m1)}`, `n_B = ${n2}`, `\\bar{x}_B = ${tx(m2)}`], find: ["\\bar{x}"] },
        formula: "\\bar{x} = \\dfrac{n_A \\bar{x}_A + n_B \\bar{x}_B}{n_A + n_B}",
        solution: [`Vsota A: $${n1} \\cdot ${tx(m1)} = ${tx(n1 * m1)}$, vsota B: $${n2} \\cdot ${tx(m2)} = ${tx(n2 * m2)}$`, `Skupaj: $${tx(n1 * m1 + n2 * m2)}$ točk, $${n1 + n2}$ dijakov`, `$\\bar{x} = \\dfrac{${tx(n1 * m1 + n2 * m2)}}{${n1 + n2}} ${eq(m, 2)} ${tx(m, 2)}$`],
      });
    },
  },
  // ---------- 2. letnik ----------
  {
    id: "dod-mat-ss12-koreni",
    topics: ["MAT-SS-2/koreni"],
    gen(level, r) {
      const SF = [2, 3, 5, 6, 7, 10, 11];
      if (level === 1) {
        if (r.next() < 0.6) {
          let k;
          let s;
          let n;
          do {
            k = r.pick(SF);
            s = r.int(2, 9);
            n = s * s * k;
          } while (n > 600);
          const askA = r.next() < 0.7;
          const part = range(2, s - 1).find((p) => s % p === 0);
          const ms = askA ? [[s * s, "Iz kvadrata moraš še koreniti: √(a²) = a."], [part, "Razcep ni dokončan – izpostavi največji kvadrat, ki deli število."]] : [[n / s, "Pod korenom ostane število, deljeno s kvadratom a², ne z a."], [s * k, "Pod korenom ostane le faktor, ki ni popoln kvadrat."]];
          return T({
            text: `Delno koreni $\\sqrt{${n}}$, tako da dobiš obliko $a\\sqrt{b}$, kjer je $b$ čim manjše naravno število. Koliko je $${askA ? "a" : "b"}$?`,
            answer: num(askA ? s : k, null, null, ms),
            hint: `Poišči največji popolni kvadrat, ki deli $${n}$.`,
            data: { given: [`\\sqrt{${n}} = a\\sqrt{b}`], find: [askA ? "a" : "b"] },
            formula: "\\sqrt{a^2 b} = a\\sqrt{b}",
            solution: [`$${n} = ${s * s} \\cdot ${k}$`, `$\\sqrt{${n}} = \\sqrt{${s * s}} \\cdot \\sqrt{${k}} = ${s}\\sqrt{${k}}$`, `$${askA ? "a" : "b"} = ${askA ? s : k}$`],
          });
        }
        const k = r.pick([2, 3, 5, 6, 7]);
        let m;
        let n;
        do {
          m = r.int(1, 5);
          n = r.int(1, 5);
        } while (m === n);
        const [a, b] = [k * m * m, k * n * n];
        return T({
          text: `Izračunaj $\\sqrt{a} \\cdot \\sqrt{b}$ za $a = ${a}$ in $b = ${b}$.`,
          answer: num(k * m * n, null, null, [[a * b, "Zmnožek pod korenom moraš še koreniti."], [k * (m + n), "Korena zmnoži, ne seštevaj."]]),
          hint: "Korena zmnožiš tako, da zmnožiš korenjenca.",
          data: { given: [`a = ${a}`, `b = ${b}`], find: ["\\sqrt{a} \\cdot \\sqrt{b}"] },
          formula: "\\sqrt{a} \\cdot \\sqrt{b} = \\sqrt{a \\cdot b}",
          solution: [`$\\sqrt{${a}} \\cdot \\sqrt{${b}} = \\sqrt{${a * b}}$`, `$\\sqrt{${a * b}} = ${k * m * n}$`],
        });
      }
      if (level === 2) {
        const k = r.pick([2, 3, 5, 6, 7]);
        let ms;
        let cs;
        let K;
        do {
          ms = r.shuffle([1, 2, 3, 4, 5]).slice(0, 3);
          cs = [r.int(1, 3), r.nonZero(-3, 3), r.nonZero(-3, 3)];
          K = sum(ms.map((m, i) => m * cs[i]));
        } while (K === 0);
        const term = (c, m, first) => `${first ? (c < 0 ? "-" : "") : c < 0 ? " - " : " + "}${Math.abs(c) === 1 ? "" : Math.abs(c)}\\sqrt{${k * m * m}}`;
        const E = ms.map((m, i) => term(cs[i], m, i === 0)).join("");
        return T({
          text: r.pick([`Izraz $${E}$ zapiši v obliki $K\\sqrt{${k}}$. Koliko je $K$?`, `Poenostavi $${E}$. Rezultat ima obliko $K\\sqrt{${k}}$ – koliko je $K$?`]),
          answer: num(K, null, null, [[sum(cs), "Vsak koren najprej delno koreni – pred koren pride tudi faktor."], [sum(ms.map((m, i) => m * m * cs[i])), "Iz kvadrata pod korenom pride pred koren njegov koren, ne kvadrat."]]),
          hint: `Vsak koren delno koreni, da dobiš $\\sqrt{${k}}$, nato seštej podobne člene.`,
          data: { given: [`${E} = K\\sqrt{${k}}`], find: ["K"] },
          formula: ["\\sqrt{a^2 b} = a\\sqrt{b}", "m\\sqrt{b} + n\\sqrt{b} = (m + n)\\sqrt{b}"],
          solution: [ms.map((m) => `$\\sqrt{${k * m * m}} = ${m === 1 ? "" : m}\\sqrt{${k}}$`).join(", "), `$${E} = (${ms.map((m, i) => `${i ? (cs[i] < 0 ? " - " : " + ") : cs[i] < 0 ? "-" : ""}${Math.abs(cs[i]) === 1 ? "" : `${Math.abs(cs[i])} \\cdot `}${m}`).join("")})\\sqrt{${k}}$`, `$= ${K === 1 ? "" : K === -1 ? "-" : K}\\sqrt{${k}}$, torej $K = ${K}$`],
        });
      }
      const t = r.int(0, 2);
      if (t === 0) {
        let c;
        let b;
        do {
          c = r.int(1, 4);
          b = c * c + r.int(1, 6);
        } while (Number.isInteger(Math.sqrt(b)));
        const d = b - c * c;
        const j = r.int(1, 4);
        const k = d * j;
        const minus = r.next() < 0.5;
        const den = `\\sqrt{${b}} ${minus ? "-" : "+"} ${c}`;
        const conj = `\\sqrt{${b}} ${minus ? "+" : "-"} ${c}`;
        const bad = `\\sqrt{${b}} ${minus ? "-" : "+"} ${c}`;
        const fm = (f, x) => (f === 1 ? x : `${f}(${x})`);
        return T({
          text: `Racionaliziraj imenovalec: $${dfr(k, den)}$.`,
          answer: choice(r, fm(j, conj), [
            [fm(j, bad), "Števec in imenovalec pomnoži s konjugiranim izrazom – ta ima nasproten predznak."],
            [fm(k, conj), `V imenovalcu dobiš ${b} − ${c * c} = ${d}; s tem še deli.`],
            [dfr(`${k}(${conj})`, b + c * c), "Zmnožek (a − b)(a + b) je razlika kvadratov, a² − b², ne vsota."],
          ]),
          options_tex: true,
          hint: `Števec in imenovalec pomnoži z $${conj}$.`,
          data: { given: [`E = ${dfr(k, den)}`], find: ["E \\text{ brez korena v imenovalcu}"] },
          formula: "(\\sqrt{a} - b)(\\sqrt{a} + b) = a - b^2",
          solution: [`$${dfr(k, den)} \\cdot ${dfr(conj, conj)} = ${dfr(`${k}(${conj})`, `${b} - ${c * c}`)}$`, `$= ${dfr(`${k}(${conj})`, d)} = ${fm(j, conj)}$`],
        });
      }
      if (t === 1) {
        let c;
        let b;
        do {
          c = r.int(1, 5);
          b = r.int(2, 30);
        } while (Number.isInteger(Math.sqrt(b)) || b === c * c);
        const v = q(2 * c, b - c * c);
        return T({
          text: `Izračunaj natančno: $E = ${dfr(1, `\\sqrt{${b}} - ${c}`)} - ${dfr(1, `\\sqrt{${b}} + ${c}`)}$. Rezultat zapiši kot okrajšan ulomek ali celo število.`,
          answer: rat(v, [[2 * c, `Ne pozabi na imenovalec ${b} − ${c * c}.`], [(2 * c) / (b + c * c), "Zmnožek imenovalcev je razlika kvadratov: b − c²."]]),
          hint: "Ulomka spravi na skupni imenovalec – ta je razlika kvadratov.",
          data: { given: [`E = ${dfr(1, `\\sqrt{${b}} - ${c}`)} - ${dfr(1, `\\sqrt{${b}} + ${c}`)}`], find: ["E"] },
          formula: "(\\sqrt{a} - b)(\\sqrt{a} + b) = a - b^2",
          solution: [`$E = ${dfr(`(\\sqrt{${b}} + ${c}) - (\\sqrt{${b}} - ${c})`, `(\\sqrt{${b}} - ${c})(\\sqrt{${b}} + ${c})`)}$`, `$E = ${dfr(2 * c, `${b} - ${c * c}`)} = ${qt(v)}$`],
        });
      }
      const b = r.pick([2, 3, 5, 6, 7, 10]);
      const p = r.int(1, 4);
      const k = r.int(1, 20);
      const m = q(k, p * b);
      const den = `${p === 1 ? "" : p}\\sqrt{${b}}`;
      return T({
        text: `Racionaliziraj imenovalec ulomka $${dfr(k, den)}$ in ga zapiši v obliki $m\\sqrt{${b}}$. Koliko je $m$? (Ulomek okrajšaj.)`,
        answer: rat(m, [[k / p, `Pri množenju s √${b} dobiš v imenovalcu še ${b}.`], [k * b, "√b · √b = b pride v imenovalec, ne v števec."]]),
        hint: `Števec in imenovalec pomnoži s $\\sqrt{${b}}$.`,
        data: { given: [`${dfr(k, den)} = m\\sqrt{${b}}`], find: ["m"] },
        formula: "\\dfrac{a}{\\sqrt{b}} = \\dfrac{a\\sqrt{b}}{b}",
        solution: [`$${dfr(k, den)} \\cdot ${dfr(`\\sqrt{${b}}`, `\\sqrt{${b}}`)} = ${dfr(`${k}\\sqrt{${b}}`, `${p === 1 ? "" : `${p} \\cdot `}${b}`)}$`, `$= ${qt(m)}\\sqrt{${b}}$, torej $m = ${qt(m)}$`],
      });
    },
  },
  {
    id: "dod-mat-ss12-racionalni-eksponenti",
    topics: ["MAT-SS-2/potence-z-racionalnimi-eksponenti"],
    gen(level, r) {
      const ex = (p, qq) => `\\frac{${Math.abs(p)}}{${qq}}`;
      const root = (p, qq) => (qq === 2 ? `\\sqrt{x${p === 1 ? "" : `^{${p}}`}}` : `\\sqrt[${qq}]{x${p === 1 ? "" : `^{${p}}`}}`);
      const RF = ["a^{\\frac{p}{q}} = \\sqrt[q]{a^p} = \\left(\\sqrt[q]{a}\\right)^p", "a^{-r} = \\dfrac{1}{a^r}"];
      if (level === 1) {
        for (;;) {
          const [base, qq] = r.pick([[2, 3], [2, 4], [2, 5], [3, 2], [3, 3], [3, 4], [4, 2], [4, 3], [5, 2], [5, 3], [6, 2], [7, 2], [8, 2], [9, 2], [10, 3], [2, 6]]);
          const p = r.int(1, qq + 3);
          if (gcd(p, qq) !== 1 || p === qq || base ** p > 10000) continue;
          const a = base ** qq;
          const val = base ** p;
          return T({
            text: r.pick([`Izračunaj $a^{${ex(p, qq)}}$ za $a = ${a}$.`, `Koliko je $${a}^{${ex(p, qq)}}$?`]),
            answer: num(val, null, null, [[(a * p) / qq, "Racionalni eksponent ne pomeni množenja z ulomkom – pomeni koren in potenco."], [base, `To je ${qq}. koren; potenciraj ga še na ${p}.`], [a ** p, `Potenco moraš še koreniti (${qq}. koren).`]]),
            hint: `$a^{${ex(p, qq)}} = \\left(\\sqrt[${qq}]{a}\\right)^{${p}}$ – najprej koreni, nato potenciraj.`,
            data: { given: [`a = ${a}`], find: [`a^{${ex(p, qq)}}`] },
            formula: RF[0],
            solution: [`$${qq === 2 ? "\\sqrt" : `\\sqrt[${qq}]`}{${a}} = ${base}$`, p === 1 ? `$${a}^{${ex(p, qq)}} = ${val}$` : `$${a}^{${ex(p, qq)}} = ${base}^{${p}} = ${val}$`],
          });
        }
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          let u;
          let w;
          do {
            u = r.int(1, 5);
            w = r.int(2, 5);
          } while (u === w || gcd(u, w) !== 1);
          const qq = r.pick([2, 3]);
          const p = r.pick(qq === 2 ? [1, 3] : [1, 2, 4]);
          const a = q(u ** qq, w ** qq);
          const v = q(w ** p, u ** p);
          return T({
            text: `Izračunaj $a^{-${ex(p, qq)}}$ za $a = ${qt(a)}$. Rezultat zapiši kot okrajšan ulomek.`,
            answer: rat(v),
            hint: "Negativni eksponent obrne ulomek; nato koreni števec in imenovalec.",
            data: { given: [`a = ${qt(a)}`], find: [`a^{-${ex(p, qq)}}`] },
            formula: RF,
            solution: [`$a^{-${ex(p, qq)}} = \\left(${dfr(w ** qq, u ** qq)}\\right)^{${ex(p, qq)}}$`, `$\\sqrt[${qq}]{${dfr(w ** qq, u ** qq)}} = ${dfr(w, u)}$`, `$\\left(${dfr(w, u)}\\right)^{${p}} = ${qt(v)}$`],
          });
        }
        let p;
        let qq;
        do {
          qq = r.int(2, 6);
          p = r.int(1, 7);
        } while (gcd(p, qq) !== 1 || p === qq);
        const inv = r.next() < 0.5;
        const E = inv ? `\\dfrac{1}{${root(p, qq)}}` : `\\dfrac{${root(p, qq)}}{x}`;
        const v = inv ? q(-p, qq) : q(p - qq, qq);
        return T({
          text: `Izraz $${E}$ ($x > 0$) zapiši kot potenco $x^r$. Koliko je $r$? (Ulomek okrajšaj.)`,
          answer: rat(v),
          hint: `Koren zapiši kot potenco: $${root(p, qq)} = x^{${ex(p, qq)}}$.`,
          data: { given: [`x^r = ${E}`], find: ["r"] },
          formula: [RF[0], "\\dfrac{x^m}{x^n} = x^{m - n}"],
          solution: [`$${root(p, qq)} = x^{${ex(p, qq)}}$`, inv ? `$\\dfrac{1}{x^{${ex(p, qq)}}} = x^{-${ex(p, qq)}}$` : `$\\dfrac{x^{${ex(p, qq)}}}{x^1} = x^{${ex(p, qq)} - 1}$`, `$r = ${qt(v)}$`],
        });
      }
      if (r.next() < 0.5) {
        let parts;
        let v;
        do {
          parts = [0, 1, 2].map(() => {
            const qq = r.int(2, 6);
            let p;
            do p = r.int(1, 5);
            while (gcd(p, qq) !== 1);
            return [p, qq];
          });
          v = qsub(qadd(q(...parts[0]), q(...parts[1])), q(...parts[2]));
        } while (v[0] === 0);
        const E = `\\dfrac{${root(...parts[0])} \\cdot ${root(...parts[1])}}{${root(...parts[2])}}`;
        return T({
          text: `Izraz $${E}$ ($x > 0$) zapiši kot potenco $x^r$. Koliko je $r$? (Ulomek okrajšaj.)`,
          answer: rat(v),
          hint: "Vsak koren zapiši kot potenco z racionalnim eksponentom, nato eksponente seštej oziroma odštej.",
          data: { given: [`x^r = ${E}`], find: ["r"] },
          formula: [RF[0], "x^m \\cdot x^n = x^{m + n}", "\\dfrac{x^m}{x^n} = x^{m - n}"],
          solution: [`$x^{${ex(...parts[0])}} \\cdot x^{${ex(...parts[1])}} : x^{${ex(...parts[2])}}$`, `$r = ${dfr(...parts[0])} + ${dfr(...parts[1])} - ${dfr(...parts[2])} = ${qt(v)}$`],
        });
      }
      const s = r.int(2, 12);
      const fromV = r.next() < 0.5;
      const V = s ** 3;
      const P = 6 * s * s;
      return T({
        text: fromV
          ? `Kocka ima prostornino $V = ${V}\\ \\mathrm{cm^3}$. Kolikšna je njena površina? (Uporabi zvezo $a = V^{\\frac{1}{3}}$.)`
          : `Kocka ima površino $P = ${P}\\ \\mathrm{cm^2}$. Kolikšna je njena prostornina? (Uporabi zvezo $V = \\left(\\dfrac{P}{6}\\right)^{\\frac{3}{2}}$.)`,
        answer: fromV ? num(P, "cm²", null, [[s * s, "To je ploščina ene ploskve – kocka ima 6 ploskev."], [6 * s, "Rob moraš kvadrirati: P = 6a²."]], { unitAlternatives: ["cm2"] }) : num(V, "cm³", null, [[P / 6, "To je ploščina ene ploskve (a²); iz nje izračunaj a in nato a³."], [s, "To je rob kocke; prostornina je a³."]], { unitAlternatives: ["cm3"] }),
        hint: fromV ? "Rob kocke je $a = \\sqrt[3]{V}$, površina pa $P = 6a^2$." : "Iz $P = 6a^2$ izračunaj $a$, nato $V = a^3$.",
        data: { given: [fromV ? dat("V", V, "cm^3") : dat("P", P, "cm^2")], find: [fromV ? "P" : "V"] },
        formula: fromV ? ["a = V^{\\frac{1}{3}}", "P = 6a^2 = 6V^{\\frac{2}{3}}"] : ["a = \\left(\\dfrac{P}{6}\\right)^{\\frac{1}{2}}", "V = a^3 = \\left(\\dfrac{P}{6}\\right)^{\\frac{3}{2}}"],
        solution: fromV ? [`$a = ${V}^{\\frac{1}{3}} = ${s}\\ \\mathrm{cm}$`, `$P = 6 \\cdot ${s}^2 = ${P}\\ \\mathrm{cm^2}$`] : [`$\\dfrac{P}{6} = ${s * s}\\ \\mathrm{cm^2}$, $a = ${s * s}^{\\frac{1}{2}} = ${s}\\ \\mathrm{cm}$`, `$V = ${s}^3 = ${V}\\ \\mathrm{cm^3}$`],
      });
    },
  },
  {
    id: "dod-mat-ss12-kompleksna",
    topics: ["MAT-SS-2/kompleksna-stevila"],
    gen(level, r) {
      const zt = (a, b) => (a === 0 ? (b === 0 ? "0" : mono(b, "i")) : `${a}${b === 0 ? "" : b < 0 ? ` - ${mono(-b, "i")}` : ` + ${mono(b, "i")}`}`);
      const MUL = "(a + bi)(c + di) = (ac - bd) + (ad + bc)i";
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const [p, s, h] = r.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [7, 24, 25], [9, 12, 15]]);
          const sw = r.next() < 0.5;
          const a = (sw ? s : p) * r.pick([1, -1]);
          const b = (sw ? p : s) * r.pick([1, -1]);
          return T({
            text: r.pick([`Izračunaj absolutno vrednost kompleksnega števila $z = ${zt(a, b)}$.`, `Kolikšna je razdalja točke, ki ponazarja število $z = ${zt(a, b)}$, od izhodišča kompleksne ravnine?`]),
            answer: num(h, null, null, [[Math.abs(a) + Math.abs(b), "Absolutna vrednost ni vsota delov – uporabi Pitagorov izrek."], [h * h, "Vsoto kvadratov moraš še koreniti."]]),
            hint: "$|z|$ je razdalja točke $(a, b)$ od izhodišča.",
            data: { given: [`z = ${zt(a, b)}`], find: ["|z|"] },
            formula: "|a + bi| = \\sqrt{a^2 + b^2}",
            solution: [`$|z| = \\sqrt{${par(a)}^2 + ${par(b)}^2} = \\sqrt{${h * h}}$`, `$|z| = ${h}$`],
          });
        }
        if (t === 1) {
          const n = r.int(5, 99);
          const VAL = ["1", "i", "-1", "-i"];
          const correct = VAL[n % 4];
          return T({
            text: `Koliko je $i^{${n}}$?`,
            answer: choice(r, correct, VAL.filter((v) => v !== correct).map((v) => [v, `To bi veljalo, če bi bil ostanek pri deljenju ${n} s 4 enak ${VAL.indexOf(v)}; tu je ${n % 4}.`])),
            options_tex: true,
            hint: "Potence števila $i$ se ponavljajo s periodo 4: $i, -1, -i, 1, \\ldots$ Poišči ostanek eksponenta pri deljenju s 4.",
            data: { given: [`n = ${n}`], find: ["i^n"] },
            formula: ["i^2 = -1", "i^4 = 1", "i^{4k + r} = i^r"],
            solution: [`$${n} = 4 \\cdot ${Math.floor(n / 4)} + ${n % 4}$`, `$i^{${n}} = \\left(i^4\\right)^{${Math.floor(n / 4)}} \\cdot i^{${n % 4}} = ${correct}$`],
          });
        }
        const [a, b] = [r.nonZero(-6, 6), r.nonZero(-6, 6)];
        let p;
        let s;
        do {
          p = r.int(1, 4);
          s = r.nonZero(-3, 3);
        } while (p === s || p === -s);
        const askRe = r.next() < 0.5;
        const E = `${p === 1 ? "" : p}z ${s < 0 ? "-" : "+"} ${Math.abs(s) === 1 ? "" : Math.abs(s)}\\bar{z}`;
        const re = (p + s) * a;
        const im = (p - s) * b;
        return T({
          text: `Dano je število $z = ${zt(a, b)}$. Izračunaj ${askRe ? "realni" : "imaginarni"} del števila $w = ${E}$.`,
          answer: num(askRe ? re : im, null, null, askRe ? [[(p - s) * a, "Konjugirano število ima enak realni del: $\\bar{z} = a - bi$."]] : [[(p + s) * b, "Konjugirano število ima nasproten imaginarni del: $\\bar{z} = a - bi$."], [(p - s) * b * -1, "Pazi na predznak imaginarnega dela."]]),
          hint: "Konjugirano število $\\bar{z}$ dobiš tako, da imaginarnemu delu spremeniš predznak.",
          data: { given: [`z = ${zt(a, b)}`, `w = ${E}`], find: [askRe ? "\\operatorname{Re}(w)" : "\\operatorname{Im}(w)"] },
          formula: "z = a + bi \\;\\Rightarrow\\; \\bar{z} = a - bi",
          solution: [`$\\bar{z} = ${zt(a, -b)}$`, `$w = ${p === 1 ? "" : p}(${zt(a, b)}) ${s < 0 ? "-" : "+"} ${Math.abs(s) === 1 ? "" : Math.abs(s)}(${zt(a, -b)}) = ${zt(re, im)}$`, `${askRe ? "Realni" : "Imaginarni"} del: $${askRe ? re : im}$`],
        });
      }
      if (level === 2) {
        if (r.next() < 0.7) {
          const [a, b, c, d] = [r.nonZero(-6, 6), r.nonZero(-6, 6), r.nonZero(-6, 6), r.nonZero(-6, 6)];
          const re = a * c - b * d;
          const im = a * d + b * c;
          const askRe = r.next() < 0.5;
          return T({
            text: `Zmnoži kompleksni števili $z_1 = ${zt(a, b)}$ in $z_2 = ${zt(c, d)}$. Koliko je ${askRe ? "realni" : "imaginarni"} del zmnožka?`,
            answer: num(askRe ? re : im, null, null, askRe ? [[a * c + b * d, "Upoštevaj i² = −1: člen bi · di da −bd."], [a * c, "Manjka člen bi · di = −bd."]] : [[a * d, "Imaginarni del dobiš iz dveh členov: ad + bc."], [b * d, "bd · i² je realen člen."]]),
            hint: "Zmnoži vsak člen z vsakim in upoštevaj $i^2 = -1$.",
            data: { given: [`z_1 = ${zt(a, b)}`, `z_2 = ${zt(c, d)}`], find: [askRe ? "\\operatorname{Re}(z_1 z_2)" : "\\operatorname{Im}(z_1 z_2)"] },
            formula: ["i^2 = -1", MUL],
            solution: [`$(${zt(a, b)})(${zt(c, d)}) = ${a * c} ${sg(a * d)}i ${sg(b * c)}i ${sg(b * d)}i^2$`, `$= ${a * c} ${sg(a * d + b * c)}i ${sg(-b * d)}$`, `$= ${zt(re, im)}$`],
          });
        }
        const [a, b] = [r.nonZero(-9, 9), r.nonZero(-9, 9)];
        return T({
          text: `Izračunaj $z \\cdot \\bar{z}$ za $z = ${zt(a, b)}$.`,
          answer: num(a * a + b * b, null, null, [[a * a - b * b, "(a + bi)(a − bi) = a² − b²i² = a² + b², ker je i² = −1."], [Math.sqrt(a * a + b * b), "To je |z|; z · z̄ = |z|²."]]),
          hint: "Zmnožek števila in njegovega konjugiranega je razlika kvadratov – upoštevaj $i^2 = -1$.",
          data: { given: [`z = ${zt(a, b)}`], find: ["z \\cdot \\bar{z}"] },
          formula: "z \\cdot \\bar{z} = (a + bi)(a - bi) = a^2 + b^2",
          solution: [`$\\bar{z} = ${zt(a, -b)}$`, `$z \\cdot \\bar{z} = ${par(a)}^2 + ${par(b)}^2 = ${a * a + b * b}$`],
        });
      }
      if (r.next() < 0.55) {
        const [a, b, c, d] = [r.nonZero(-6, 6), r.nonZero(-6, 6), r.nonZero(-4, 4), r.nonZero(-4, 4)];
        const N = c * c + d * d;
        const re = q(a * c + b * d, N);
        const im = q(b * c - a * d, N);
        const askRe = r.next() < 0.5;
        return T({
          text: `Izračunaj ${askRe ? "realni" : "imaginarni"} del količnika $${dfr(zt(a, b), zt(c, d))}$. Rezultat zapiši kot okrajšan ulomek ali celo število.`,
          answer: rat(askRe ? re : im),
          hint: "Števec in imenovalec pomnoži s konjugiranim imenovalcem.",
          data: { given: [`z_1 = ${zt(a, b)}`, `z_2 = ${zt(c, d)}`], find: [askRe ? "\\operatorname{Re}\\dfrac{z_1}{z_2}" : "\\operatorname{Im}\\dfrac{z_1}{z_2}"] },
          formula: ["\\dfrac{z_1}{z_2} = \\dfrac{z_1 \\cdot \\bar{z}_2}{z_2 \\cdot \\bar{z}_2}", "z \\cdot \\bar{z} = a^2 + b^2"],
          solution: [`$${dfr(zt(a, b), zt(c, d))} \\cdot ${dfr(zt(c, -d), zt(c, -d))}$`, `Števec: $(${zt(a, b)})(${zt(c, -d)}) = ${zt(a * c + b * d, b * c - a * d)}$, imenovalec: $${c * c} + ${d * d} = ${N}$`, `$= ${fu(a * c + b * d, N)} ${b * c - a * d < 0 ? "-" : "+"} ${dfr(Math.abs(b * c - a * d), N)}i$`, `${askRe ? "Realni" : "Imaginarni"} del: $${qt(askRe ? re : im)}$`],
        });
      }
      let p;
      let s;
      do {
        p = r.int(1, 4);
        s = r.nonZero(-3, 4);
      } while (p === s || p === -s);
      const [x, y] = [r.nonZero(-6, 6), r.nonZero(-6, 6)];
      const u = (p + s) * x;
      const v = (p - s) * y;
      const askX = r.next() < 0.5;
      const L = `${p === 1 ? "" : p}z ${s < 0 ? "-" : "+"} ${Math.abs(s) === 1 ? "" : Math.abs(s)}\\bar{z}`;
      return T({
        text: `Poišči kompleksno število $z = x + yi$, za katero velja $${L} = ${zt(u, v)}$. Koliko je $${askX ? "x" : "y"}$?`,
        answer: num(askX ? x : y, null, null, askX ? [[u / (p - s), "Konjugirano število ima enak realni del – realna dela se seštejeta."]] : [[v / (p + s), "Konjugirano število ima nasproten imaginarni del."], [-y, "Pazi na predznak imaginarnega dela konjugiranega števila."]]),
        hint: "Vstavi $z = x + yi$ in $\\bar{z} = x - yi$, uredi in primerjaj realna ter imaginarna dela.",
        data: { given: [`${L} = ${zt(u, v)}`], find: [askX ? "x" : "y"] },
        formula: ["z = x + yi, \\ \\bar{z} = x - yi", "a + bi = c + di \\iff a = c \\land b = d"],
        solution: [`$${p === 1 ? "" : p}(x + yi) ${s < 0 ? "-" : "+"} ${Math.abs(s) === 1 ? "" : Math.abs(s)}(x - yi) = ${mono(p + s, "x")} ${p - s < 0 ? "-" : "+"} ${mono(Math.abs(p - s), "y")}i$`, `Realna dela: $${mono(p + s, "x")} = ${u}$${p + s === 1 ? "" : `, $x = ${x}$`}`, `Imaginarna dela: $${mono(p - s, "y")} = ${v}$${p - s === 1 ? "" : `, $y = ${y}$`}`],
      });
    },
  },
  {
    id: "dod-mat-ss12-kvadratna-funkcija",
    topics: ["MAT-SS-2/kvadratna-funkcija"],
    gen(level, r) {
      const TEME = ["p = -\\dfrac{b}{2a}", "q = f(p) = -\\dfrac{D}{4a}"];
      if (level === 1) {
        const a = r.pick([-2, -1, 1, 2, 3]);
        const p = r.nonZero(-5, 5);
        const qv = r.int(-9, 9);
        const b = -2 * a * p;
        const c = a * p * p + qv;
        const f = `f(x) = ${poly([a, b, c])}`;
        const askP = r.next() < 0.5;
        return T({
          text: r.pick([`Določi teme parabole $${f}$. Koliko je ${askP ? "abscisa $p$" : "ordinata $q$"} temena?`, `Graf funkcije $${f}$ je parabola s temenom $T(p, q)$. Koliko je $${askP ? "p" : "q"}$?`]),
          answer: askP
            ? num(p, null, null, [[-p, "Pazi na predznak: p = −b/(2a)."], [-b / a, "V imenovalcu je 2a."]])
            : num(qv, null, null, [[c, "q ni prosti člen – to je vrednost funkcije v temenu, f(p)."], [a * p * p - b * p + c, "Vstavi p s pravilnim predznakom."], [-qv, "Preveri predznak: q = −D/(4a)."]]),
          hint: "Abscisa temena je $p = -\\dfrac{b}{2a}$; ordinato dobiš kot $q = f(p)$.",
          data: { given: [f], find: [askP ? "p" : "q"] },
          formula: TEME,
          solution: [`$a = ${a}$, $b = ${b}$, $c = ${c}$`, `$p = -\\dfrac{${b}}{2 \\cdot ${par(a)}} = ${p}$`, `$q = f(${p}) = ${a} \\cdot ${par(p)}^2 ${sg(b)} \\cdot ${par(p)} ${sg(c)} = ${qv}$`, `$T(${p}, ${qv})$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          let x1;
          let x2;
          do {
            x1 = r.nonZero(-6, 6);
            x2 = r.nonZero(-6, 6);
          } while (x1 >= x2);
          const a = r.nonZero(-3, 3);
          const n = a * x1 * x2;
          return T({
            text: `Graf kvadratne funkcije ima ničli $x_1 = ${x1}$ in $x_2 = ${x2}$ ter seka ordinatno os v točki $N(0, ${n})$. Koliko je vodilni koeficient $a$?`,
            answer: num(a, null, null, [[-a, "Pri vstavljanju x = 0 v (x − x₁)(x − x₂) dobiš x₁ · x₂ – pazi na predznaka."], [n, "Začetna vrednost ni vodilni koeficient; uporabi ničelno obliko."]]),
            hint: "Zapiši ničelno obliko $f(x) = a(x - x_1)(x - x_2)$ in vstavi točko $N$.",
            data: { given: [`x_1 = ${x1}`, `x_2 = ${x2}`, `f(0) = ${n}`], find: ["a"] },
            formula: "f(x) = a(x - x_1)(x - x_2)",
            solution: [`$f(x) = a(x ${sg(-x1)})(x ${sg(-x2)})$`, `$f(0) = a \\cdot ${par(-x1)} \\cdot ${par(-x2)} = ${x1 * x2}a = ${n}$`, `$a = ${a}$`],
          });
        }
        if (t === 1) {
          const a = r.pick([-2, -1, 1, 2]);
          const p = r.nonZero(-5, 5);
          const d = r.int(1, 5);
          const qv = -a * d * d;
          const f = `f(x) = ${a === 1 ? "" : a === -1 ? "-" : a}(x ${sg(-p)})^2 ${sg(qv)}`;
          return T({
            text: `Kolikšna je večja ničla funkcije $${f}$?`,
            answer: num(p + d, null, null, [[p + d * d, "Iz kvadrata moraš še koreniti."], [p - d, "To je manjša ničla."], [-p + d, "V oklepaju (x − p) je teme pri x = p – pazi na predznak."]]),
            hint: "Postavi $f(x) = 0$, osami kvadrat in koreni (dve rešitvi).",
            data: { given: [f], find: ["x_2"] },
            formula: "a(x - p)^2 + q = 0 \\;\\Rightarrow\\; x = p \\pm \\sqrt{-\\dfrac{q}{a}}",
            solution: [`$${a === 1 ? "" : a === -1 ? "-" : a}(x ${sg(-p)})^2 = ${-qv}$`, `$(x ${sg(-p)})^2 = ${d * d}$`, `$x ${sg(-p)} = \\pm ${d}$`, `$x_1 = ${p - d}$, $x_2 = ${p + d}$`],
          });
        }
        const a = r.nonZero(-3, 3);
        const p = r.int(-4, 4);
        const qv = r.int(-6, 6);
        const dx = r.nonZero(-3, 3);
        const x0 = p + dx;
        const y0 = a * dx * dx + qv;
        return T({
          text: `Parabola ima teme v točki $T(${p}, ${qv})$ in poteka skozi točko $A(${x0}, ${y0})$. Koliko je vodilni koeficient $a$?`,
          answer: num(a, null, null, [[(y0 - qv) / dx, "V temenski obliki je (x − p) na kvadrat."], [(y0 + qv) / (dx * dx), "Pri vstavljanju q pazi na predznak."]]),
          hint: "Uporabi temensko obliko $f(x) = a(x - p)^2 + q$ in vstavi koordinati točke $A$.",
          data: { given: [`T = (${p}, ${qv})`, `A = (${x0}, ${y0})`], find: ["a"] },
          formula: "f(x) = a(x - p)^2 + q",
          solution: [`$${y0} = a(${x0} - ${par(p)})^2 ${sg(qv)}$`, `$${y0 - qv} = ${dx * dx === 1 ? "" : dx * dx}a$`, `$a = ${a}$`],
        });
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const k = r.int(5, 30);
        const L = 4 * k;
        return T({
          text: `Ob ravnem zidu želimo z $${L}\\ \\mathrm{m}$ ograje ograditi pravokotno ogrado (zid je četrta stranica). Kolikšna je največja možna ploščina ograde?`,
          answer: num(2 * k * k, "m²", null, [[(L * L) / 16, "Ograja je le na treh stranicah – ob zidu je ni."], [(L * L) / 4, "Vzporedna stranica je L − 2x; poišči teme parabole."]], { unitAlternatives: ["m2"] }),
          hint: "Naj bo $x$ dolžina stranice, pravokotne na zid. Ploščina je kvadratna funkcija $S(x) = x(L - 2x)$ – poišči njeno teme.",
          data: { given: [dat("L", L, "m")], find: ["S_{\\max}"] },
          formula: ["S(x) = x(L - 2x)", "p = -\\dfrac{b}{2a}"],
          solution: [`$S(x) = x(${L} - 2x) = -2x^2 + ${L}x$`, `$p = -\\dfrac{${L}}{2 \\cdot (-2)} = ${k}\\ \\mathrm{m}$`, `Stranici: $${k}\\ \\mathrm{m}$ in $${L - 2 * k}\\ \\mathrm{m}$`, `$S_{\\max} = ${k} \\cdot ${L - 2 * k} = ${2 * k * k}\\ \\mathrm{m^2}$`],
        });
      }
      if (t === 1) {
        const v = r.int(8, 25);
        const h0 = r.int(0, 15);
        const tm = v / 10;
        const H = h0 + (v * v) / 20;
        const askH = r.next() < 0.6;
        const ht = `h(t) = -5t^2 + ${v}t${h0 ? ` + ${h0}` : ""}`;
        return T({
          text: `Višino vrženega kamna opisuje funkcija $${ht}$ ($h$ v metrih, $t$ v sekundah). ${askH ? "Kolikšna je največja višina kamna? Zaokroži na dve decimalki." : "Čez koliko sekund doseže kamen največjo višino?"}`,
          answer: askH ? num(H, "m", 2, [[h0 + (v * v) / 10, "Vstavi t = v/10 v h(t): −5t² + vt + h₀."], [(v * v) / 20, "Prištej še začetno višino."]]) : num(tm, "s", null, [[v / 5, "p = −b/(2a): v imenovalcu je 2 · (−5) = −10."]]),
          hint: "Največja višina je v temenu parabole: $p = -\\dfrac{b}{2a}$, $q = h(p)$.",
          data: { given: [ht], find: [askH ? "h_{\\max}" : "t"] },
          formula: TEME,
          solution: [`$t = -\\dfrac{${v}}{2 \\cdot (-5)} = ${tx(tm)}\\ \\mathrm{s}$`, askH ? `$h(${tx(tm)}) = -5 \\cdot ${tx(tm)}^2 + ${v} \\cdot ${tx(tm)}${h0 ? ` + ${h0}` : ""} ${eq(H, 2)} ${tx(H, 2)}\\ \\mathrm{m}$` : null],
        });
      }
      const k = r.int(2, 10);
      const c0 = r.int(5, 20);
      const xs = r.int(1, 10);
      const n0 = k * (2 * xs + c0);
      const R = k * (c0 + xs) ** 2;
      const askR = r.next() < 0.5;
      const what = r.pick(["sladoledov", "vstopnic", "majic", "kosov peciva"]);
      return T({
        text: `Pri ceni $${c0}\\ \\text{€}$ prodajo na dan $${n0}$ ${what}. Za vsak evro podražitve prodajo $${k}$ manj. Pri kateri ceni je prihodek največji${askR ? " in koliko znaša? Vpiši največji prihodek v €." : "? Vpiši ceno v €."}`,
        answer: askR ? num(R, "€", null, [[c0 * n0, "To je sedanji prihodek – poišči teme parabole."]], { unitAlternatives: ["eur", "evrov"] }) : num(c0 + xs, "€", null, [[xs, "To je podražitev; vprašanje je po novi ceni."], [n0 / (2 * k), "Pri računu temena upoštevaj tudi sedanjo ceno."]], { unitAlternatives: ["eur", "evrov"] }),
        hint: "Naj bo $x$ podražitev v evrih. Prihodek je $R(x) = (c + x)(n - kx)$ – poišči teme.",
        data: { given: [`c = ${c0}\\ \\text{€}`, `n = ${n0}`, `k = ${k}`], find: [askR ? "R_{\\max}" : "c + x"] },
        formula: ["R(x) = (c + x)(n - kx)", "p = -\\dfrac{b}{2a}"],
        solution: [`$R(x) = (${c0} + x)(${n0} - ${k}x) = ${poly([-k, n0 - k * c0, c0 * n0])}$`, `$x = -\\dfrac{${n0 - k * c0}}{2 \\cdot (-${k})} = ${xs}$`, `Cena: $${c0 + xs}\\ \\text{€}$, prodaja: $${n0 - k * xs}$`, `$R_{\\max} = ${c0 + xs} \\cdot ${n0 - k * xs} = ${R}\\ \\text{€}$`],
      });
    },
  },
  {
    id: "dod-mat-ss12-kvadratna-enacba",
    topics: ["MAT-SS-2/kvadratna-enacba"],
    gen(level, r) {
      const QF = "x_{1,2} = \\dfrac{-b \\pm \\sqrt{D}}{2a}, \\quad D = b^2 - 4ac";
      if (level === 1) {
        let r1;
        let r2;
        do {
          r1 = r.int(-9, 9);
          r2 = r.int(-9, 9);
        } while (r1 >= r2);
        const k = r.pick([1, 1, 1, 2, 3]);
        const E = `${poly([k, -k * (r1 + r2), k * r1 * r2])} = 0`;
        const big = r.next() < 0.5;
        const val = big ? r2 : r1;
        const D = (r1 + r2) ** 2 - 4 * r1 * r2;
        return T({
          text: `Reši enačbo $${E}$. Vpiši ${big ? "večjo" : "manjšo"} rešitev.`,
          answer: num(val, null, null, [[-val, "Rešitvi sta nasprotni od števil v razcepu (x − x₁)(x − x₂) – pazi na predznak."], [big ? r1 : r2, `To je ${big ? "manjša" : "večja"} rešitev.`]]),
          hint: k === 1 ? "Trinom razstavi z Vietovim pravilom ali uporabi obrazec za rešitve." : `Najprej deli enačbo s $${k}$.`,
          data: { given: [E], find: [big ? "x_2" : "x_1"] },
          formula: ["x^2 - (x_1 + x_2)x + x_1 x_2 = (x - x_1)(x - x_2)", QF],
          solution: [k === 1 ? null : `$${poly([1, -(r1 + r2), r1 * r2])} = 0$`, `$D = ${par(-(r1 + r2))}^2 - 4 \\cdot ${par(r1 * r2)} = ${D}$`, `$${xf(r1)}${xf(r2)} = 0$`, `$x_1 = ${r1}$, $x_2 = ${r2}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const a = r.int(1, 3);
          const tt = r.nonZero(-5, 5);
          const b = 2 * a * tt;
          const m = a * tt * tt;
          const E = `${mono(a, "x^2")} ${b < 0 ? "-" : "+"} ${Math.abs(b)}x + m = 0`;
          return T({
            text: `Za katero vrednost parametra $m$ ima enačba $${E}$ dvojno rešitev?`,
            answer: num(m, null, null, [[(b * b) / 4, "V diskriminanti je 4ac = 4am – upoštevaj tudi a."], [(b * b) / 2, "D = b² − 4am; deli s 4a."], [-m, "Iz b² − 4am = 0 sledi m = b²/(4a) – pazi na predznak."]]),
            hint: "Kvadratna enačba ima dvojno rešitev, ko je diskriminanta enaka $0$.",
            data: { given: [E], find: ["m"] },
            formula: "D = b^2 - 4ac = 0",
            solution: [`$D = ${b}^2 - 4 \\cdot ${a} \\cdot m = ${b * b} - ${4 * a}m$`, `$${b * b} - ${4 * a}m = 0$`, `$m = ${m}$`],
          });
        }
        if (t === 1) {
          const kind = r.int(0, 2);
          let a;
          let b;
          let c;
          if (kind === 1) {
            a = r.nonZero(-3, 3);
            const rr = r.int(-5, 5);
            [b, c] = [-2 * a * rr, a * rr * rr];
          } else {
            do {
              [a, b, c] = [r.nonZero(-4, 4), r.int(-9, 9), r.nonZero(-9, 9)];
            } while ((b * b - 4 * a * c > 0 ? 2 : b * b - 4 * a * c === 0 ? 1 : 0) !== (kind === 0 ? 0 : 2));
          }
          const D = b * b - 4 * a * c;
          const n = D > 0 ? 2 : D === 0 ? 1 : 0;
          const Dw = b * b + 4 * a * c;
          const nw = Dw > 0 ? 2 : Dw === 0 ? 1 : 0;
          const E = `${poly([a, b, c])} = 0`;
          return T({
            text: `Koliko realnih rešitev ima enačba $${E}$?`,
            answer: num(n, null, null, [[nw, "Pri računanju D = b² − 4ac pazi na predznake (−4ac)."], [n === 2 ? 0 : 2, "Pozitivna diskriminanta da dve rešitvi, negativna nobene."]]),
            hint: "Izračunaj diskriminanto in poglej njen predznak.",
            data: { given: [E], find: ["\\text{število rešitev}"] },
            formula: ["D = b^2 - 4ac", "D > 0: 2,\\ D = 0: 1,\\ D < 0: 0 \\text{ realnih rešitev}"],
            solution: [`$a = ${a}$, $b = ${b}$, $c = ${c}$`, `$D = ${par(b)}^2 - 4 \\cdot ${par(a)} \\cdot ${par(c)} = ${D}$`, `$D ${D > 0 ? ">" : D === 0 ? "=" : "<"} 0$, zato ima enačba ${["nobene realne rešitve", "eno (dvojno) rešitev", "dve realni rešitvi"][n]}.`],
          });
        }
        let b;
        let c;
        let D;
        do {
          b = r.int(-9, 9);
          c = r.int(-12, 6);
          D = b * b - 4 * c;
        } while (D <= 0 || Number.isInteger(Math.sqrt(D)));
        const x2 = (-b + Math.sqrt(D)) / 2;
        const E = `${poly([1, b, c])} = 0`;
        return T({
          text: `Reši enačbo $${E}$. Vpiši večjo rešitev, zaokroženo na dve decimalki.`,
          answer: num(x2, null, 2, [[(-b - Math.sqrt(D)) / 2, "To je manjša rešitev."], [(b + Math.sqrt(D)) / 2, "V števcu je −b."], [-b + Math.sqrt(D), "Ne pozabi deliti z 2a."]]),
          hint: "Enačbe ne moreš razstaviti s celimi števili – uporabi obrazec z diskriminanto.",
          data: { given: [E], find: ["x_2"] },
          formula: QF,
          solution: [`$D = ${par(b)}^2 - 4 \\cdot 1 \\cdot ${par(c)} = ${D}$`, `$x_{1,2} = \\dfrac{${-b} \\pm \\sqrt{${D}}}{2}$`, `$x_2 = \\dfrac{${-b} + \\sqrt{${D}}}{2} ${eq(x2, 2)} ${tx(x2, 2)}$`],
        });
      }
      const t = r.int(0, 2);
      if (t === 0) {
        let a;
        let b;
        let c;
        do {
          [a, b, c] = [r.int(1, 4), r.nonZero(-9, 9), r.nonZero(-9, 9)];
        } while (b * b - 4 * a * c <= 0);
        const E = `${poly([a, b, c])} = 0`;
        const sq = r.next() < 0.5;
        const v = sq ? qsub(q(b * b, a * a), q(2 * c, a)) : q(-b, c);
        return T({
          text: `Naj bosta $x_1$ in $x_2$ rešitvi enačbe $${E}$. Brez reševanja enačbe izračunaj $${sq ? "x_1^2 + x_2^2" : "\\dfrac{1}{x_1} + \\dfrac{1}{x_2}"}$.`,
          answer: rat(v),
          hint: sq ? "Uporabi $x_1^2 + x_2^2 = (x_1 + x_2)^2 - 2x_1 x_2$ in Vietovi formuli." : "Ulomka seštej: $\\dfrac{1}{x_1} + \\dfrac{1}{x_2} = \\dfrac{x_1 + x_2}{x_1 x_2}$, nato uporabi Vietovi formuli.",
          data: { given: [E], find: [sq ? "x_1^2 + x_2^2" : "\\dfrac{1}{x_1} + \\dfrac{1}{x_2}"] },
          formula: ["x_1 + x_2 = -\\dfrac{b}{a}", "x_1 x_2 = \\dfrac{c}{a}"],
          solution: [`$x_1 + x_2 = ${ft(-b, a)}$, $x_1 x_2 = ${ft(c, a)}$`, sq ? `$x_1^2 + x_2^2 = \\left(${ft(-b, a)}\\right)^2 - 2 \\cdot ${pf(c, a)} = ${qt(v)}$` : `$\\dfrac{x_1 + x_2}{x_1 x_2} = ${pf(-b, a)} : ${pf(c, a)} = ${qt(v)}$`],
        });
      }
      if (t === 1) {
        let a;
        let b;
        do {
          a = r.int(3, 20);
          b = r.int(2, 15);
        } while (a <= b);
        const o = 2 * (a + b);
        const S = a * b;
        const what = r.pick(["Pravokotna njiva", "Pravokotno igrišče", "Pravokotna preproga", "Pravokotni vrt"]);
        const u = what.includes("preproga") ? "dm" : "m";
        return T({
          text: `${what} ima obseg $${o}\\ \\mathrm{${u}}$ in ploščino $${S}\\ \\mathrm{${u}^2}$. Koliko meri daljša stranica?`,
          answer: num(a, u, null, [[b, "To je krajša stranica."], [o / 4, "Pravokotnik ni kvadrat – reši sistem."]]),
          hint: "Iz obsega izrazi eno stranico z drugo ($a + b = \\dfrac{o}{2}$) in vstavi v ploščino – dobiš kvadratno enačbo.",
          data: { given: [dat("o", o, u), dat("S", S, `${u}^2`)], find: ["a"] },
          formula: ["o = 2(a + b)", "S = a \\cdot b"],
          solution: [`$a + b = ${a + b}$, torej $b = ${a + b} - a$`, `$a(${a + b} - a) = ${S}$`, `$a^2 - ${a + b}a + ${S} = 0$, $(a - ${a})(a - ${b}) = 0$`, `Daljša stranica: $${a}\\ \\mathrm{${u}}$`],
        });
      }
      const even = r.next() < 0.5;
      const n = even ? 2 * r.int(2, 15) : r.int(3, 30);
      const P = even ? n * (n + 2) : n * (n + 1);
      return T({
        text: even ? `Zmnožek dveh zaporednih sodih naravnih števil je $${P}$. Kateri je večji od njiju?` : `Zmnožek dveh zaporednih naravnih števil je $${P}$. Katero je večje od njiju?`,
        answer: num(even ? n + 2 : n + 1, null, null, [[n, "To je manjše število."], [Math.round(Math.sqrt(P)), "Zapiši enačbo in jo reši – koren zmnožka ni nujno eno od števil."]]),
        hint: even ? "Števili označi z $n$ in $n + 2$ ter zapiši enačbo." : "Števili označi z $n$ in $n + 1$ ter zapiši enačbo.",
        data: { given: [`P = ${P}`], find: ["n_2"] },
        formula: even ? "n(n + 2) = P" : "n(n + 1) = P",
        solution: [`$n(n + ${even ? 2 : 1}) = ${P}$`, `$n^2 + ${even ? "2" : ""}n - ${P} = 0$`, `$D = ${even ? 4 : 1} + ${4 * P} = ${(even ? 4 : 1) + 4 * P}$, $\\sqrt{D} = ${Math.sqrt((even ? 4 : 1) + 4 * P)}$`, `$n = ${n}$ (negativna rešitev ni naravno število), večje število: $${even ? n + 2 : n + 1}$`],
      });
    },
  },
  {
    id: "dod-mat-ss12-kvadratna-neenacba",
    topics: ["MAT-SS-2/kvadratna-neenacba"],
    gen(level, r) {
      if (level === 1) {
        let p;
        let s;
        do {
          p = r.int(-8, 6);
          s = r.int(-6, 9);
        } while (s - p < 2);
        const strict = r.next() < 0.5;
        const op = strict ? "<" : "\\le";
        const cnt = strict ? s - p - 1 : s - p + 1;
        const fx = `f(x) = ${xf(p)}${xf(s)}`;
        const E = `${fx.slice(7)} ${op} 0`;
        return T({
          text: `Koliko celih števil reši neenačbo $${E}$?`,
          answer: num(cnt, null, null, [[strict ? s - p + 1 : s - p - 1, strict ? "Neenačba je stroga – ničli nista rešitvi." : "Pri ≤ sta tudi ničli rešitvi."], [s - p, "Preštej cela števila od ene do druge ničle; preveri krajišči."]]),
          hint: "Ničli preberi iz razcepa. Parabola je odprta navzgor, zato je pod osjo $x$ med ničlama.",
          data: { given: [fx], find: ["\\text{število celih rešitev}"] },
          formula: "a > 0: \\ f(x) \\le 0 \\iff x_1 \\le x \\le x_2",
          solution: [`Ničli: $x_1 = ${p}$, $x_2 = ${s}$`, `Rešitev: $x \\in ${strict ? `(${p}, ${s})` : `[${p}, ${s}]`}$`, `Celih števil: $${cnt}$`],
        });
      }
      if (level === 2) {
        let r1;
        let r2;
        do {
          r1 = r.int(-7, 6);
          r2 = r.int(-6, 8);
        } while (r2 <= r1 || r1 === -r2);
        const a = r.pick([1, -1, 2, -2]);
        const op = r.pick(["<", "\\le", ">", "\\ge"]);
        const cl = op === "\\le" || op === "\\ge";
        const less = op === "<" || op === "\\le";
        const between = (a > 0) === less;
        const iv = (x1, x2, bt, c) => (bt ? `${c ? "[" : "("}${x1}, ${x2}${c ? "]" : ")"}` : `(-\\infty, ${x1}${c ? "]" : ")"} \\cup ${c ? "[" : "("}${x2}, \\infty)`);
        const right = iv(r1, r2, between, cl);
        const P = poly([a, -a * (r1 + r2), a * r1 * r2]);
        return T({
          text: `Reši neenačbo $${P} ${op} 0$.`,
          answer: choice(r, right, [
            [iv(r1, r2, !between, cl), a > 0 ? `Parabola je odprta navzgor: ${less ? "pod" : "nad"} osjo x je ${less ? "le med ničlama" : "levo in desno od ničel"}.` : `Parabola je odprta navzdol (a < 0): ${less ? "pod" : "nad"} osjo x je ${less ? "levo in desno od ničel" : "le med ničlama"}.`],
            [iv(r1, r2, between, !cl), cl ? "Neenakost ni stroga, zato ničli spadata k rešitvi." : "Neenakost je stroga, zato ničli nista rešitvi."],
            [iv(-r2, -r1, between, cl), "Ničli imata nasproten predznak od števil v razcepu (x − x₁)(x − x₂)."],
          ]),
          options_tex: true,
          hint: "Poišči ničli, skiciraj parabolo (pazi na predznak $a$) in odčitaj, kje je graf pod oziroma nad osjo $x$.",
          data: { given: [`f(x) = ${P}`], find: ["x"] },
          formula: "f(x) = a(x - x_1)(x - x_2)",
          solution: [`$${P} = ${a === 1 ? "" : a === -1 ? "-" : a}${xf(r1)}${xf(r2)}$, ničli $${r1}$ in $${r2}$`, `$a ${a > 0 ? ">" : "<"} 0$: parabola je odprta ${a > 0 ? "navzgor" : "navzdol"}, ${less ? "pod" : "nad"} osjo je ${between ? "med ničlama" : "zunaj ničel"}.`, `$x \\in ${right}$`],
        });
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const a = r.pick([1, 1, 2, 3]);
        const b = r.nonZero(-9, 9);
        const lim = (b * b) / (4 * a);
        const m = Math.floor(lim + 1e-9) + 1;
        const E = `${poly([a, b, 0])} + m > 0`;
        return T({
          text: `Kolikšno je najmanjše celo število $m$, pri katerem velja $${E}$ za vsa realna števila $x$?`,
          answer: num(m, null, null, [[Math.ceil(lim - 1e-9), "Pri D = 0 se parabola dotakne osi x – neenačba je stroga, zato mora biti D < 0."], [Math.floor((b * b) / 4) + 1, "V diskriminanti je 4am – upoštevaj tudi a."], [-m, "Iz D = b² − 4am < 0 sledi m > b²/(4a)."]]),
          hint: "Parabola, odprta navzgor, je povsod nad osjo $x$, ko nima ničel: $D < 0$.",
          data: { given: [`f(x) = ${poly([a, b, 0])} + m`], find: ["m"] },
          formula: "a > 0,\\ D < 0 \\;\\Rightarrow\\; f(x) > 0 \\text{ za vse } x",
          solution: [`$D = ${b * b} - ${4 * a}m < 0$`, `$m > ${ft(b * b, 4 * a)}${Number.isInteger(lim) ? "" : ` \\approx ${tx(lim, 2)}`}$`, `Najmanjše celo število: $m = ${m}$`],
        });
      }
      if (t === 1) {
        const t1 = r.int(1, 2);
        const t2 = t1 + r.int(1, 3);
        const h0 = r.int(0, 10);
        const H = 5 * t1 * t2 + h0;
        const v = 5 * (t1 + t2);
        const ht = `h(t) = -5t^2 + ${v}t${h0 ? ` + ${h0}` : ""}`;
        return T({
          text: `Višino žoge opisuje funkcija $${ht}$ ($h$ v metrih, $t$ v sekundah). Koliko sekund je žoga na višini vsaj $${H}\\ \\mathrm{m}$?`,
          answer: num(t2 - t1, "s", null, [[t2, "To je trenutek, ko žoga pade pod to višino; odštej trenutek, ko jo doseže."], [t1, "To je trenutek, ko žoga doseže to višino."]]),
          hint: `Reši neenačbo $h(t) \\ge ${H}$: prenesi vse na eno stran in poišči ničli.`,
          data: { given: [ht, dat("H", H, "m")], find: ["\\Delta t"] },
          formula: "h(t) \\ge H",
          solution: [`$-5t^2 + ${v}t ${sg(h0 - H)} \\ge 0$`, `$t^2 - ${t1 + t2}t + ${t1 * t2} \\le 0$`, `$(t - ${t1})(t - ${t2}) \\le 0 \\Rightarrow ${t1} \\le t \\le ${t2}$`, `$\\Delta t = ${t2} - ${t1} = ${t2 - t1}\\ \\mathrm{s}$`],
        });
      }
      let r1;
      let k;
      do {
        r1 = r.int(-6, 4);
        k = r.int(-9, 13);
      } while (k % 2 === 0 || k / 2 <= r1 + 0.5);
      const P = poly([2, -(k + 2 * r1), r1 * k]);
      const lo = r1;
      const hi = k / 2;
      const cnt = Math.floor(hi) - lo + 1;
      return T({
        text: `Koliko celih števil reši neenačbo $${P} \\le 0$?`,
        answer: num(cnt, null, null, [[Math.ceil(hi) - lo + 1, `Ničla ${tx(hi).replace("{,}", ",")} ni celo število – zaokroži navznoter.`], [cnt - 2, "Pri ≤ sta celoštevilski krajišči rešitvi."]]),
        hint: "Poišči ničli z obrazcem; parabola je odprta navzgor, zato so rešitve med ničlama.",
        data: { given: [`f(x) = ${P}`], find: ["\\text{število celih rešitev}"] },
        formula: "x_{1,2} = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
        solution: [`$D = ${(k + 2 * r1) ** 2} - ${8 * r1 * k} = ${(k + 2 * r1) ** 2 - 8 * r1 * k}$`, `Ničli: $x_1 = ${lo}$, $x_2 = ${ft(k, 2)} = ${tx(hi)}$`, `Rešitev: $${lo} \\le x \\le ${tx(hi)}$`, `Cela števila od $${lo}$ do $${Math.floor(hi)}$: teh je $${cnt}$.`],
      });
    },
  },
  {
    id: "dod-mat-ss12-eksponentna-funkcija",
    topics: ["MAT-SS-2/eksponentna-funkcija"],
    gen(level, r) {
      const BS = [[2, 1], [3, 1], [4, 1], [5, 1], [1, 2], [1, 3]];
      const bT = ([n, d]) => (d === 1 ? `${n}` : `\\left(${dfr(n, d)}\\right)`);
      const fT = (a, b, c, e = "x") => `${a === 1 ? "" : a === -1 ? "-" : `${a} \\cdot `}${bT(b)}^{${e}}${c ? ` ${sg(c)}` : ""}`;
      const NEG = ["a^{-n} = \\dfrac{1}{a^n}", "\\left(\\dfrac{p}{q}\\right)^{-n} = \\left(\\dfrac{q}{p}\\right)^{n}"];
      if (level === 1) {
        const b = r.pick(BS);
        const a = r.pick([1, 1, 2, 3, -1, -2]);
        const c = r.int(-5, 5);
        const x0 = r.nonZero(-3, 3);
        const pw = qpow(q(b[0], b[1]), x0);
        const v = qadd(qmul([a, 1], pw), [c, 1]);
        const f = `f(x) = ${fT(a, b, c)}`;
        return T({
          text: r.pick([`Dana je funkcija $${f}$. Izračunaj $f(${x0})$. Rezultat zapiši kot okrajšan ulomek ali celo število.`, `Koliko je $f(${x0})$, če je $${f}$? Rezultat zapiši kot okrajšan ulomek ali celo število.`]),
          answer: rat(v, [[(a * b[0] * x0) / b[1] + c, "Potenca b^x ni produkt b · x."], [-a * (pw[0] / pw[1]) + c, "Pazi na predznak koeficienta a."]]),
          hint: "Vstavi $x$ v eksponent; negativni eksponent obrne osnovo.",
          data: { given: [f], find: [`f(${x0})`] },
          formula: NEG,
          solution: [`$f(${x0}) = ${fT(a, b, c, x0)}$`, `$${bT(b)}^{${x0}} = ${qt(pw)}$`, `$f(${x0}) = ${a === 1 ? "" : `${a} \\cdot `}${pf(...pw)}${c ? ` ${sg(c)}` : ""} = ${qt(v)}$`],
        });
      }
      if (level === 2) {
        if (r.next() < 0.5) {
          const b = r.pick(BS);
          const a = r.pick([1, 2, 3, -1, -2, 4]);
          const c = r.int(-6, 6);
          const d = r.nonZero(-2, 2);
          const f = `f(x) = ${fT(a, b, c, `x ${sg(-d)}`)}`;
          const pw = qpow(q(b[0], b[1]), -d);
          const v = qadd(qmul([a, 1], pw), [c, 1]);
          return T({
            text: `V kateri točki graf funkcije $${f}$ seka ordinatno os? Vpiši ordinato presečišča (kot okrajšan ulomek ali celo število).`,
            answer: rat(v, [[a + c, "Presečišče z ordinatno osjo je pri x = 0; eksponent je tedaj " + -d + ", ne 0."], [a * (b[0] / b[1]) ** d + c, "Pri x = 0 je eksponent x − d = −d – pazi na predznak."]]),
            hint: "Ordinatno os graf seka pri $x = 0$: izračunaj $f(0)$.",
            data: { given: [f], find: ["f(0)"] },
            formula: ["N(0, f(0))", ...NEG],
            solution: [`$f(0) = ${fT(a, b, c, -d)}$`, `$${bT(b)}^{${-d}} = ${qt(pw)}$`, `$f(0) = ${qt(v)}$, presečišče $N(0, ${qt(v)})$`],
          });
        }
        const b = r.pick(BS);
        const a = r.pick([1, 2, 3, -1, -2]);
        const c = r.int(-5, 5);
        const big = b[0] > b[1];
        const inc = (a > 0) === big;
        const above = a > 0;
        const opt = (i, u) => `\\text{${i ? "narašča" : "pada"}, } Z_f = ${u ? `(${c}, \\infty)` : `(-\\infty, ${c})`}`;
        const monWhy = a < 0 ? "Negativni a graf prezrcali čez vodoravno os, zato se naraščanje in padanje zamenjata." : big ? "Pri osnovi b > 1 (in a > 0) funkcija narašča." : "Pri osnovi 0 < b < 1 (in a > 0) funkcija pada.";
        const rngWhy = above ? "Ker je a > 0, je a · b^x > 0, zato so vse vrednosti nad asimptoto y = c." : "Ker je a < 0, je a · b^x < 0, zato so vse vrednosti pod asimptoto y = c.";
        const f = `f(x) = ${fT(a, b, c)}`;
        return T({
          text: `Katera trditev drži za funkcijo $${f}$?`,
          answer: choice(r, opt(inc, above), [
            [opt(!inc, above), monWhy],
            [opt(inc, !above), rngWhy],
            [opt(!inc, !above), `${monWhy} ${rngWhy}`],
          ]),
          options_tex: true,
          hint: "Poglej osnovo ($b > 1$ ali $0 < b < 1$), predznak koeficienta $a$ in premik $c$ (vodoravna asimptota $y = c$).",
          data: { given: [f], find: ["\\text{monotonost}, Z_f"] },
          formula: ["f(x) = a \\cdot b^x + c: \\ y = c \\text{ je vodoravna asimptota}"],
          solution: [`Osnova $b = ${b[1] === 1 ? b[0] : dfr(...b)}$ ${big ? "> 1" : "< 1"}, $a = ${a}$ ${a > 0 ? "> 0" : "< 0"}: funkcija ${inc ? "narašča" : "pada"}.`, `Asimptota $y = ${c}$; graf je ${above ? "nad" : "pod"} njo, torej $Z_f = ${above ? `(${c}, \\infty)` : `(-\\infty, ${c})`}$.`],
        });
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const N0 = r.pick([100, 200, 250, 500, 800, 1000, 1500]);
        const [T0, u] = r.pick([[20, "min"], [30, "min"], [3, "h"], [4, "h"], [6, "h"]]);
        const k = r.int(2, 6);
        const tt = k * T0;
        return T({
          text: `Število bakterij v gojišču se podvoji vsakih $${T0}\\ \\mathrm{${u}}$. Na začetku jih je $${N0}$. Koliko bakterij je v gojišču po $${tt}\\ \\mathrm{${u}}$?`,
          answer: num(N0 * 2 ** k, null, null, [[N0 * 2 * k, "Rast ni linearna – v vsakem obdobju se število podvoji (množi z 2)."], [N0 * 2 ** (k - 1), `Preštej podvojitve: ${tt} : ${T0} = ${k}.`]]),
          hint: "Najprej izračunaj, kolikokrat se je število podvojilo.",
          data: { given: [`N_0 = ${N0}`, dat("T", T0, u), dat("t", tt, u)], find: ["N"] },
          formula: "N(t) = N_0 \\cdot 2^{\\frac{t}{T}}",
          solution: [`$\\dfrac{t}{T} = \\dfrac{${tt}}{${T0}} = ${k}$`, `$N = ${N0} \\cdot 2^{${k}} = ${N0} \\cdot ${2 ** k} = ${N0 * 2 ** k}$`],
        });
      }
      if (t === 1) {
        const k = r.int(2, 5);
        const m0 = r.pick([1, 2, 3, 5]) * 2 ** 6;
        const m = m0 / 2 ** k;
        const [T0, u, nm] = r.pick([[8, "dni", "joda-131"], [6, "h", "tehnecija-99m"], [30, "let", "cezija-137"], [5, "let", "kobalta-60"]]);
        const uT = u === "dni" ? "\\mathrm{dni}" : u === "let" ? "\\text{let}" : "\\mathrm{h}";
        return T({
          text: `Razpolovni čas izotopa ${nm} je $${T0}\\ ${uT}$. Po kolikšnem času od $${m0}\\ \\mathrm{mg}$ ostane le še $${m}\\ \\mathrm{mg}$?`,
          answer: num(k * T0, u === "h" ? "h" : u, null, [[((m0 / m) * T0) / 2, "Masa se ne zmanjšuje linearno – štej razpolovitve."], [(k + 1) * T0, "Preštej razpolovitve še enkrat: po vsaki je mase pol manj."], [(k - 1) * T0, "Preštej razpolovitve še enkrat: po vsaki je mase pol manj."]], u === "h" ? {} : { unitAlternatives: u === "dni" ? ["dni", "dan", "dneva", "d"] : ["let", "leti", "leta", "leto"] }),
          hint: "Ugotovi, kolikokrat moraš maso razpoloviti: $\\dfrac{m_0}{m} = 2^n$.",
          data: { given: [dat("T_{1/2}", T0, u === "h" ? "h" : u === "dni" ? "dni" : "let").replace("\\mathrm{let}", "\\text{let}"), dat("m_0", m0, "mg"), dat("m", m, "mg")], find: ["t"] },
          formula: "m = m_0 \\cdot \\left(\\dfrac{1}{2}\\right)^{\\frac{t}{T_{1/2}}}",
          solution: [`$\\dfrac{m_0}{m} = \\dfrac{${m0}}{${m}} = ${2 ** k} = 2^{${k}}$`, `Masa se je razpolovila $${k}$-krat.`, `$t = ${k} \\cdot ${T0}\\ ${uT} = ${k * T0}\\ ${uT}$`],
        });
      }
      const a = r.int(1, 5);
      const b = r.int(2, 4);
      const askF0 = r.next() < 0.5;
      const y1 = a * b;
      const y3 = a * b ** 3;
      return T({
        text: `Graf funkcije $f(x) = a \\cdot b^x$ ($b > 0$) poteka skozi točki $A(1, ${y1})$ in $B(3, ${y3})$. Koliko je $f(${askF0 ? 0 : 2})$?`,
        answer: num(askF0 ? a : a * b * b, null, null, askF0 ? [[y1 - (y3 - y1) / 2, "Eksponentna funkcija ni linearna – iz razmerja vrednosti izračunaj b."], [b, "To je osnova b; f(0) = a."]] : [[(y1 + y3) / 2, "Eksponentna funkcija ni linearna – vmesna vrednost ni povprečje."], [b * b, "Ne pozabi na koeficient a."]]),
        hint: "Deli $f(3)$ z $f(1)$: koeficient $a$ se pokrajša, ostane $b^2$.",
        data: { given: [`f(1) = ${y1}`, `f(3) = ${y3}`], find: [`f(${askF0 ? 0 : 2})`] },
        formula: "\\dfrac{f(3)}{f(1)} = \\dfrac{a b^3}{a b} = b^2",
        solution: [`$b^2 = \\dfrac{${y3}}{${y1}} = ${b * b}$, $b = ${b}$`, `$a \\cdot ${b} = ${y1}$, $a = ${a}$`, `$f(${askF0 ? 0 : 2}) = ${a} \\cdot ${b}^{${askF0 ? 0 : 2}} = ${askF0 ? a : a * b * b}$`],
      });
    },
  },
  {
    id: "dod-mat-ss12-eksponentne-enacbe",
    topics: ["MAT-SS-2/eksponentne-enacbe"],
    gen(level, r) {
      const RULE = "a^{m} = a^{n} \\iff m = n";
      const ef = (k, e) => (k === 1 ? e : k === -1 ? `-(${e})` : `${k}(${e})`);
      if (level === 1) {
        for (;;) {
          const b = r.pick([2, 3, 5]);
          const p = r.int(1, 3);
          const x0 = r.int(-2, 5);
          const qq = r.int(-3, 3);
          const k = p * x0 + qq;
          if (k < 1 || k > { 2: 9, 3: 6, 5: 4 }[b]) continue;
          const N = b ** k;
          const E = `${b}^{${lin(p, qq)}} = ${N}`;
          return T({
            text: r.pick([`Reši enačbo $${E}$.`, `Za kateri $x$ velja $${E}$?`]),
            answer: num(x0, null, null, [[k, `${N} = ${b}^${k}; eksponent ${lin(p, qq)} je enak ${k} – reši še linearno enačbo.`], [(k + qq) / p, "Pri prenašanju člena na drugo stran spremeni predznak."], [N / b, "Eksponentne enačbe ne rešiš z deljenjem – izenači eksponenta."]]),
            hint: `Desno stran zapiši kot potenco z osnovo $${b}$.`,
            data: { given: [E], find: ["x"] },
            formula: RULE,
            solution: [`$${N} = ${b}^{${k}}$`, `$${lin(p, qq)} = ${k}$`, p === 1 || qq === 0 ? null : `$${p}x = ${k - qq}$`, `$x = ${x0}$`],
          });
        }
      }
      if (level === 2) {
        for (;;) {
          const B = r.pick([2, 3, 5]);
          const m = r.int(1, 3);
          const n = r.int(1, 3);
          const sig = r.pick([1, -1]);
          if (B ** m > 125 || B ** n > 125 || m - sig * n === 0) continue;
          const s = r.int(-3, 3);
          const t = r.int(-3, 3);
          const L = B ** m;
          const RT = sig > 0 ? `${B ** n}` : `\\left(${dfr(1, B ** n)}\\right)`;
          const x = q(sig * n * t - m * s, m - sig * n);
          const E = `${L}^{${lin(1, s)}} = ${RT}^{${lin(1, t)}}`;
          return T({
            text: `Reši enačbo $${E}$. Rezultat zapiši kot okrajšan ulomek ali celo število.`,
            answer: rat(x, [[(sig * n * t - m * s) / (sig * n - m), "Pazi na predznak pri deljenju."], [(t - s) / (m - sig * n), "Eksponent m pomnoži z vsem v oklepaju: m(x + s) = mx + ms."]]),
            hint: `Obe strani zapiši kot potenci z osnovo $${B}$${sig < 0 ? " (ulomek $\\dfrac{1}{a^n} = a^{-n}$)" : ""}, nato izenači eksponenta.`,
            data: { given: [E], find: ["x"] },
            formula: [RULE, "(a^m)^n = a^{m \\cdot n}", "\\dfrac{1}{a^n} = a^{-n}"],
            solution: [`$${B}^{${ef(m, lin(1, s))}} = ${B}^{${ef(sig * n, lin(1, t))}}$`, `$${lin(m, m * s)} = ${lin(sig * n, sig * n * t)}$`, `$${mono(m - sig * n, "x")} = ${sig * n * t - m * s}$`, `$x = ${qt(x)}$`],
          });
        }
      }
      if (r.next() < 0.55) {
        for (;;) {
          const B = r.pick([2, 3]);
          const neg = r.next() < 0.35;
          const x1 = r.int(0, 3);
          const x2 = neg ? null : r.int(0, 3);
          if (x2 === x1) continue;
          const t1 = B ** x1;
          const t2 = neg ? -r.int(1, 6) : B ** x2;
          const S = t1 + t2;
          const P = t1 * t2;
          if (S === 0) continue;
          const E = `${B * B}^x ${S > 0 ? "-" : "+"} ${Math.abs(S) === 1 ? "" : `${Math.abs(S)} \\cdot `}${B}^x ${sg(P)} = 0`;
          const ans = neg ? x1 : x1 + x2;
          return T({
            text: `Reši enačbo $${E}$. ${neg ? "Vpiši rešitev." : "Vpiši vsoto vseh rešitev."}`,
            answer: num(ans, null, null, [[S, "To je vsota rešitev za t; vrni se k x: t = b^x."], [neg ? t1 : t1 * t2, "To je vrednost potence b^x; določi še eksponent x."]]),
            hint: `Uvedi novo spremenljivko $t = ${B}^x$; tedaj je $${B * B}^x = t^2$.`,
            data: { given: [E], find: [neg ? "x" : "x_1 + x_2"] },
            formula: [`t = ${B}^x, \\ ${B * B}^x = t^2`, RULE],
            solution: [`$t^2 ${S > 0 ? "-" : "+"} ${Math.abs(S) === 1 ? "" : Math.abs(S)}t ${sg(P)} = 0$`, `$(t ${sg(-t1)})(t ${sg(-t2)}) = 0$, $t_1 = ${t1}$, $t_2 = ${t2}$`, `$${B}^x = ${t1} \\Rightarrow x = ${x1}$`, neg ? `$${B}^x = ${t2}$ nima rešitve, ker je potenca vedno pozitivna.` : `$${B}^x = ${t2} \\Rightarrow x = ${x2}$`, neg ? `Rešitev: $x = ${x1}$` : `Vsota: $${x1} + ${x2} = ${ans}$`],
          });
        }
      }
      const B = r.pick([2, 3, 5]);
      if (r.next() < 0.5) {
        const u = r.int(1, 2);
        const x0 = r.int(0, B === 5 ? 3 : 4);
        const V = B ** (x0 + u) + B ** x0;
        const E = `${B}^{x + ${u}} + ${B}^x = ${V}`;
        return T({
          text: `Reši enačbo $${E}$.`,
          answer: num(x0, null, null, [[B ** x0, "To je vrednost potence; določi še eksponent x."], [x0 + u, `Izpostavi ${B}^x: ${B}^(x+${u}) = ${B}^x · ${B ** u}.`]]),
          hint: `Izpostavi $${B}^x$: $${B}^{x + ${u}} = ${B}^x \\cdot ${B}^{${u}}$.`,
          data: { given: [E], find: ["x"] },
          formula: ["a^{x + n} = a^x \\cdot a^n", RULE],
          solution: [`$${B}^x(${B}^{${u}} + 1) = ${V}$`, `$${B}^x \\cdot ${B ** u + 1} = ${V}$`, `$${B}^x = ${B ** x0} = ${B}^{${x0}}$`, `$x = ${x0}$`],
        });
      }
      const x0 = r.int(1, B === 5 ? 3 : 4);
      const V = B ** (x0 + 1) - B ** (x0 - 1);
      const E = `${B}^{x + 1} - ${B}^{x - 1} = ${V}`;
      return T({
        text: `Reši enačbo $${E}$.`,
        answer: num(x0, null, null, [[x0 - 1, `Izpostavil si ${B}^(x−1) = ${B ** (x0 - 1)}; eksponent x − 1 = ${x0 - 1}, torej je x za 1 večji.`], [B ** x0, "To je vrednost potence; določi še eksponent x."]]),
        hint: `Izpostavi najnižjo potenco $${B}^{x - 1}$.`,
        data: { given: [E], find: ["x"] },
        formula: ["a^{x + n} = a^x \\cdot a^n", RULE],
        solution: [`$${B}^{x - 1}(${B}^2 - 1) = ${V}$`, `$${B}^{x - 1} \\cdot ${B * B - 1} = ${V}$`, `$${B}^{x - 1} = ${B ** (x0 - 1)} = ${B}^{${x0 - 1}}$`, `$x - 1 = ${x0 - 1}$, $x = ${x0}$`],
      });
    },
  },
  {
    id: "dod-mat-ss12-logaritem",
    topics: ["MAT-SS-2/logaritem"],
    gen(level, r) {
      const DEF = "\\log_a b = x \\iff a^x = b";
      const isPow = (n, b) => {
        while (n > 1 && n % b === 0) n /= b;
        return n === 1;
      };
      if (level === 1) {
        const b = r.pick([2, 3, 4, 5, 10]);
        const kind = r.pick([0, 0, 1, 2, 3]);
        let NT;
        let v;
        let ms = [];
        if (kind === 0) {
          const k = r.int(2, b <= 3 ? 6 : b === 10 ? 4 : 3);
          NT = `${b ** k}`;
          v = q(k);
          ms = [[b ** k / b, "Logaritem ni deljenje: log_b N je eksponent, na katerega moraš potencirati b."], [k + 1, `Preveri: ${b}^${k} = ${b ** k}.`]];
        } else if (kind === 1) {
          const k = r.int(1, 3);
          NT = dfr(1, b ** k);
          v = q(-k);
          ms = [[k, "Pazi na predznak: 1/b^k = b^(−k)."]];
        } else if (kind === 2) {
          const root = r.pick([2, 3]);
          NT = root === 2 ? `\\sqrt{${b}}` : `\\sqrt[3]{${b}}`;
          v = q(1, root);
        } else {
          NT = `${b}\\sqrt{${b}}`;
          v = q(3, 2);
        }
        return T({
          text: r.pick([`Izračunaj $\\log_{${b}} ${NT}$.`, `Koliko je $\\log_{${b}} ${NT}$? (Rezultat kot okrajšan ulomek ali celo število.)`]),
          answer: rat(v, ms),
          hint: `Vprašaj se: na katero potenco moraš dvigniti $${b}$, da dobiš $${NT}$?`,
          data: { given: [`x = \\log_{${b}} ${NT}`], find: ["x"] },
          formula: [DEF, "\\sqrt[n]{a} = a^{\\frac{1}{n}}"],
          solution: [`$${NT} = ${b}^{${qt(v)}}$`, `$\\log_{${b}} ${NT} = ${qt(v)}$`],
        });
      }
      if (level === 2) {
        const RL = ["\\log_a x + \\log_a y = \\log_a (x y)", "\\log_a x - \\log_a y = \\log_a \\dfrac{x}{y}", "n \\log_a x = \\log_a x^n"];
        const t = r.int(0, 2);
        for (;;) {
          const b = r.pick([2, 3, 5, 6, 10]);
          const k = r.int(1, 3);
          if (t === 0) {
            const N = b ** (k + 1);
            const ds = divisors(N).filter((d) => d > 1 && d < N && !isPow(d, b) && d * d !== N);
            if (!ds.length) continue;
            const A = r.pick(ds);
            const Bv = N / A;
            const E = `\\log_{${b}} ${A} + \\log_{${b}} ${Bv}`;
            return T({
              text: `Izračunaj brez računala: $${E}$.`,
              answer: num(k + 1, null, null, [[Math.log(A + Bv) / Math.log(b), "Vsota logaritmov je logaritem zmnožka, ne vsote."]]),
              hint: "Uporabi pravilo za vsoto logaritmov z isto osnovo.",
              data: { given: [`x = ${E}`], find: ["x"] },
              formula: RL[0],
              solution: [`$${E} = \\log_{${b}} (${A} \\cdot ${Bv}) = \\log_{${b}} ${N}$`, `$${N} = ${b}^{${k + 1}}$, zato je rezultat $${k + 1}$`],
            });
          }
          if (t === 1) {
            const Bv = r.int(2, 9);
            if (isPow(Bv, b) || Bv === b) continue;
            const A = Bv * b ** k;
            if (A > 2000) continue;
            const E = `\\log_{${b}} ${A} - \\log_{${b}} ${Bv}`;
            return T({
              text: `Izračunaj brez računala: $${E}$.`,
              answer: num(k, null, null, [[Math.log(A - Bv) / Math.log(b), "Razlika logaritmov je logaritem količnika, ne razlike."], [-k, "Količnik je A/B, ne B/A."]]),
              hint: "Uporabi pravilo za razliko logaritmov z isto osnovo.",
              data: { given: [`x = ${E}`], find: ["x"] },
              formula: RL[1],
              solution: [`$${E} = \\log_{${b}} \\dfrac{${A}}{${Bv}} = \\log_{${b}} ${A / Bv}$`, `$${A / Bv} = ${b}^{${k}}$, zato je rezultat $${k}$`],
            });
          }
          const A = r.int(2, 12);
          const m = r.int(2, 3);
          const Bv = A ** m / b ** k;
          if (!Number.isInteger(Bv) || Bv <= 1 || Bv === A || isPow(Bv, b) || A === b || isPow(A, b)) continue;
          const E = `${m}\\log_{${b}} ${A} - \\log_{${b}} ${Bv}`;
          return T({
            text: `Izračunaj brez računala: $${E}$.`,
            answer: num(k, null, null, [[Math.log(A / Bv) / Math.log(b), `Koeficient ${m} pred logaritmom je eksponent: ${m} log A = log A^${m}.`], [Math.log((m * A) / Bv) / Math.log(b), `${m} log A ni log(${m}A), ampak log A^${m}.`]]),
            hint: "Koeficient pred logaritmom prenesi v eksponent, nato uporabi pravilo za razliko.",
            data: { given: [`x = ${E}`], find: ["x"] },
            formula: [RL[2], RL[1]],
            solution: [`$${m}\\log_{${b}} ${A} = \\log_{${b}} ${A}^{${m}} = \\log_{${b}} ${A ** m}$`, `$\\log_{${b}} \\dfrac{${A ** m}}{${Bv}} = \\log_{${b}} ${b ** k}$`, `$= ${k}$`],
          });
        }
      }
      const t = r.int(0, 3);
      if (t === 0) {
        const b = r.pick([2, 3, 5, 7]);
        let N;
        do N = r.int(2, 200);
        while (isPow(N, b));
        const v = Math.log(N) / Math.log(b);
        return T({
          text: `Izračunaj $\\log_{${b}} ${N}$ na tri decimalke. Uporabi prehod na desetiški ali naravni logaritem.`,
          answer: num(v, null, 3, [[Math.log10(N), `Logaritem števila ${N} moraš deliti še z logaritmom osnove.`], [Math.log10(N) - Math.log10(b), "Prehod na novo osnovo je količnik logaritmov, ne razlika."]]),
          hint: "Uporabi formulo za prehod na novo osnovo.",
          data: { given: [`x = \\log_{${b}} ${N}`], find: ["x"] },
          formula: "\\log_a b = \\dfrac{\\log b}{\\log a}",
          solution: [`$\\log_{${b}} ${N} = \\dfrac{\\log ${N}}{\\log ${b}}$`, `$= \\dfrac{${tx(Math.log10(N), 5)}}{${tx(Math.log10(b), 5)}} ${eq(v, 3)} ${tx(v, 3)}$`],
        });
      }
      if (t === 1) {
        for (;;) {
          const B = r.pick([2, 3, 5]);
          const m = r.int(2, 3);
          const n = r.nonZero(-4, 5);
          if (n % m === 0 || B ** m > 125 || B ** Math.abs(n) > 1000) continue;
          const arg = n > 0 ? `${B ** n}` : dfr(1, B ** -n);
          const v = q(n, m);
          return T({
            text: `Izračunaj natančno: $\\log_{${B ** m}} ${arg}$. Rezultat zapiši kot okrajšan ulomek.`,
            answer: rat(v),
            hint: `Osnovo in argument zapiši kot potenci števila $${B}$ ali pa uporabi prehod na osnovo $${B}$.`,
            data: { given: [`x = \\log_{${B ** m}} ${arg}`], find: ["x"] },
            formula: ["\\log_a b = \\dfrac{\\log_c b}{\\log_c a}", "\\log_c c^n = n"],
            solution: [`$\\log_{${B ** m}} ${arg} = \\dfrac{\\log_{${B}} ${arg}}{\\log_{${B}} ${B ** m}}$`, `$= \\dfrac{${n}}{${m}} = ${qt(v)}$`],
          });
        }
      }
      if (t === 2) {
        const G0 = r.pick([1000, 2000, 5000, 10000]);
        const p = r.pick([1.5, 2, 2.5, 3, 4, 5]);
        const f = r.pick([1.5, 2, 3]);
        const G = G0 * f;
        const tt = Math.log(f) / Math.log(1 + p / 100);
        const who = r.pick(NAMES);
        return T({
          text: `${who} je ${g(who, "vložil", "vložila")} $${G0}\\ \\text{€}$ po $${tx(p)}\\ \\%$ letnih obrestih z obrestnim obrestovanjem. Po koliko letih bo na računu $${tx(G)}\\ \\text{€}$? Zaokroži na eno decimalko.`,
          answer: num(tt, "let", 1, [[((f - 1) * 100) / p, "To bi veljalo pri navadnem obrestovanju; pri obrestnem obrestovanju se obrestujejo tudi obresti."], [Math.log(f) / Math.log(p), `Osnova je obrestovalni faktor 1 + p/100 = ${tx(1 + p / 100).replace("{,}", ",")}.`]], { unitAlternatives: ["leta", "leti", "leto", "l"] }),
          hint: "Zapiši $G = G_0 \\cdot r^n$ z $r = 1 + \\dfrac{p}{100}$ in enačbo logaritmiraj.",
          data: { given: [`G_0 = ${G0}\\ \\text{€}`, `p = ${tx(p)}\\ \\%`, `G = ${tx(G)}\\ \\text{€}`], find: ["n"] },
          formula: ["G = G_0 \\cdot \\left(1 + \\dfrac{p}{100}\\right)^n", "n = \\dfrac{\\log \\frac{G}{G_0}}{\\log \\left(1 + \\frac{p}{100}\\right)}"],
          solution: [`$\\left(${tx(1 + p / 100)}\\right)^n = \\dfrac{${tx(G)}}{${G0}} = ${tx(f)}$`, `$n = \\dfrac{\\log ${tx(f)}}{\\log ${tx(1 + p / 100)}} ${eq(tt, 1)} ${tx(tt, 1)}$ leta`],
        });
      }
      const a = r.pick([1.5, 2, 2.5, 3.2, 4, 5, 6.3, 8]);
      const k = r.int(2, 12);
      const pH = k - Math.log10(a);
      return T({
        text: `Koncentracija oksonijevih ionov v raztopini je $[\\mathrm{H_3O^+}] = ${tx(a)} \\cdot 10^{-${k}}\\ \\mathrm{mol/L}$. Izračunaj pH na dve decimalki.`,
        answer: num(pH, null, 2, [[k, "Upoštevaj tudi faktor pred potenco desetice."], [k + Math.log10(a), "−log(a · 10^(−k)) = k − log a; pazi na predznak."]]),
        hint: "Uporabi $\\mathrm{pH} = -\\log [\\mathrm{H_3O^+}]$ in pravilo za logaritem zmnožka.",
        data: { given: [`[\\mathrm{H_3O^+}] = ${tx(a)} \\cdot 10^{-${k}}\\ \\mathrm{mol/L}`], find: ["\\mathrm{pH}"] },
        formula: ["\\mathrm{pH} = -\\log [\\mathrm{H_3O^+}]", "\\log (a \\cdot 10^{n}) = \\log a + n"],
        solution: [`$\\mathrm{pH} = -\\log(${tx(a)} \\cdot 10^{-${k}}) = -(\\log ${tx(a)} - ${k})$`, `$= ${k} - ${tx(Math.log10(a), 4)} ${eq(pH, 2)} ${tx(pH, 2)}$`],
      });
    },
  },
  {
    id: "dod-mat-ss12-logaritemska-enacba",
    topics: ["MAT-SS-2/logaritemska-funkcija-in-enacbe"],
    gen(level, r) {
      const DEF = "\\log_a u = k \\iff u = a^k";
      const arg = (s) => (s === 0 ? "x" : `(x ${sg(s)})`);
      if (level === 1) {
        if (r.next() < 0.5) {
          const b = r.pick([2, 3, 5]);
          const a = r.int(-5, 5);
          const c = r.pick([-2, -1, -1, 1, 2]);
          const f = `f(x) = \\log_{${b}} ${arg(-a)} ${sg(c)}`;
          const v = qadd([a, 1], qpow([b, 1], -c));
          return T({
            text: `Določi ničlo funkcije $${f}$. Rezultat zapiši kot okrajšan ulomek ali celo število.`,
            answer: rat(v, [[a + 1, "Pri c ≠ 0 argument ni 1: iz log = −c sledi argument = b^(−c)."], [a - b ** -c, "Pri reševanju (x − a) = … pazi na predznak."], [a + b ** c, "Iz log_b u = −c sledi u = b^(−c) – pazi na predznak eksponenta."]]),
            hint: "Postavi $f(x) = 0$, osami logaritem in ga odpravi po definiciji.",
            data: { given: [f], find: ["x_0"] },
            formula: DEF,
            solution: [`$\\log_{${b}} ${arg(-a)} = ${-c}$`, `$${a === 0 ? "x" : `x ${sg(-a)}`} = ${b}^{${-c}} = ${qt(qpow([b, 1], -c))}$`, `$x = ${qt(v)}$`],
          });
        }
        const b = r.pick([2, 3, 5, 10]);
        const kind = r.int(0, 2);
        let A;
        let right;
        let wrong;
        if (kind === 2) {
          const k = r.int(2, 3);
          const m = r.nonZero(-9, 9);
          A = `${k}x ${sg(-m)}`;
          const c = ft(m, k);
          right = `(${c}, \\infty)`;
          wrong = [[`(${m}, \\infty)`, `Neenačbo ${k}x > ${m} še deli s ${k}.`], [`[${c}, \\infty)`, "Argument logaritma mora biti strogo pozitiven – krajišče ni vključeno."], [`(-\\infty, ${c})`, "Argument mora biti pozitiven: rešitve so desno od krajišča."]];
        } else {
          const a = r.nonZero(-7, 7);
          const rev = kind === 1;
          A = rev ? `${a} - x` : `x ${sg(-a)}`;
          right = rev ? `(-\\infty, ${a})` : `(${a}, \\infty)`;
          wrong = rev
            ? [[`(${a}, \\infty)`, `Pri ${a} − x > 0 je x < ${a}.`], [`(-\\infty, ${a}]`, "Argument mora biti strogo pozitiven – krajišče ni vključeno."], [`(-\\infty, ${-a})`, "Pazi na predznak krajišča."]]
            : [[`[${a}, \\infty)`, "Argument mora biti strogo pozitiven – krajišče ni vključeno."], [`(${-a}, \\infty)`, `Iz x ${sg(-a)} > 0 sledi x > ${a} – pazi na predznak.`], [`(-\\infty, ${a})`, "Argument mora biti pozitiven: rešitve so desno od krajišča."]];
        }
        const f = `f(x) = \\log_{${b}} (${A})`;
        return T({
          text: `Kakšno je definicijsko območje funkcije $${f}$?`,
          answer: choice(r, right, wrong),
          options_tex: true,
          hint: "Logaritem je definiran le za pozitivne argumente: reši neenačbo argument $> 0$.",
          data: { given: [f], find: ["D_f"] },
          formula: "\\log_a u \\text{ je definiran} \\iff u > 0",
          solution: [`$${A} > 0$`, `$D_f = ${right}$`],
        });
      }
      if (level === 2) {
        if (r.next() < 0.6) {
          for (;;) {
            const b = r.pick([2, 3, 5, 10]);
            const p = r.int(1, 4);
            const qq = r.int(-9, 9);
            const k = r.int(0, 3);
            if (b ** k > 1000) continue;
            const x = q(b ** k - qq, p);
            const E = `\\log_{${b}} (${lin(p, qq)}) = ${k}`;
            return T({
              text: r.pick([`Reši enačbo $${E}$. Rezultat zapiši kot okrajšan ulomek ali celo število.`, `Za kateri $x$ velja $${E}$? (Rezultat kot okrajšan ulomek ali celo število.)`]),
              answer: rat(x, [[(b * k - qq) / p, `log_b u = k pomeni u = b^k, ne b · k.`], [(k - qq) / p, "Logaritma ne moreš kar izpustiti – argument je enak b^k."]]),
              hint: "Enačbo zapiši v eksponentni obliki: argument je enak osnovi na desno stran.",
              data: { given: [E], find: ["x"] },
              formula: DEF,
              solution: [`$${lin(p, qq)} = ${b}^{${k}} = ${b ** k}$`, p === 1 ? null : `$${p}x = ${b ** k - qq}$`, `$x = ${qt(x)}$ (argument $${b ** k} > 0$, rešitev je ustrezna)`],
            });
          }
        }
        for (;;) {
          const b = r.pick([2, 3, 10]);
          const k = r.int(2, 4);
          const N = b ** k;
          if (N > 1000) continue;
          const Ms = divisors(N).filter((d) => d > 1 && d < N);
          const M = r.pick(Ms);
          const s = r.int(-6, 6);
          const x0 = N / M - s;
          const E = `\\log_{${b}} ${arg(s)} + \\log_{${b}} ${M} = ${k}`;
          return T({
            text: `Reši enačbo $${E}$.`,
            answer: num(x0, null, null, [[N - M - s, "Vsota logaritmov je logaritem zmnožka: log(u) + log(M) = log(M · u)."], [N / M + s, "Pri prenašanju člena pazi na predznak."]]),
            hint: "Levo stran združi v en logaritem zmnožka, nato enačbo zapiši v eksponentni obliki.",
            data: { given: [E], find: ["x"] },
            formula: ["\\log_a u + \\log_a v = \\log_a (u v)", DEF],
            solution: [`$\\log_{${b}} (${M}${arg(s) === "x" ? "x" : arg(s)}) = ${k}$`, `$${M}${arg(s) === "x" ? "x" : arg(s)} = ${b}^{${k}} = ${N}$`, `$${s === 0 ? "x" : `x ${sg(s)}`} = ${N / M}$, $x = ${x0}$`],
          });
        }
      }
      const t = r.int(0, 2);
      if (t === 0) {
        for (;;) {
          const b = r.pick([2, 3, 5, 10]);
          const k = r.int(1, 4);
          const N = b ** k;
          if (N > 1000 || N < 4) continue;
          const pairs = divisors(N).filter((d) => d * d < N).map((d2) => [N / d2, d2]);
          if (!pairs.length) continue;
          const [d1, d2] = r.pick(pairs);
          const a = d1 - d2;
          const E = `\\log_{${b}} x + \\log_{${b}} (x - ${a}) = ${k}`;
          return T({
            text: `Reši enačbo $${E}$.`,
            answer: num(d1, null, null, [[-d2, "Ta rešitev kvadratne enačbe ni v definicijskem območju: argument logaritma mora biti pozitiven."], [d2, "Preveri razcep kvadratne enačbe."]]),
            hint: "Najprej zapiši pogoje ($x > 0$ in $x > " + a + "$), nato levo stran združi v logaritem zmnožka.",
            data: { given: [E], find: ["x"] },
            formula: ["\\log_a u + \\log_a v = \\log_a (u v)", DEF],
            solution: [`Pogoj: $x > ${a}$`, `$x(x - ${a}) = ${b}^{${k}} = ${N}$`, `$x^2 - ${a}x - ${N} = 0$, $(x - ${d1})(x + ${d2}) = 0$`, `$x = ${d1}$ ($x = -${d2}$ ne ustreza pogoju)`],
          });
        }
      }
      if (t === 1) {
        const b = r.pick([2, 3, 5]);
        const j = r.int(0, 3);
        const a = r.int(-4, 4);
        const x0 = b ** j - a;
        const y0 = r.int(-4, 5);
        const c = y0 - j;
        const f = `f(x) = \\log_{${b}} ${arg(a)} + c`;
        return T({
          text: `Graf funkcije $${f}$ poteka skozi točko $A(${x0}, ${y0})$. Koliko je $c$?`,
          answer: num(c, null, null, [[y0 + j, "Pri prenosu logaritma na drugo stran spremeni predznak."], [y0 - (x0 + a), `log_${b} ${b ** j} = ${j} (eksponent), ne ${b ** j}.`]]),
          hint: "Vstavi koordinati točke $A$ v enačbo funkcije.",
          data: { given: [f, `A = (${x0}, ${y0})`], find: ["c"] },
          formula: "\\log_a a^n = n",
          solution: [`$${y0} = \\log_{${b}} (${x0} ${sg(a)}) + c = \\log_{${b}} ${b ** j} + c$`, `$\\log_{${b}} ${b ** j} = ${j}$`, `$c = ${y0} - ${j} = ${c}$`],
        });
      }
      for (;;) {
        const b = r.pick([2, 3, 4, 5]);
        const c = r.int(-5, 5);
        const x0 = c + r.int(1, 6);
        const a = b * (x0 - c) - x0;
        const E = `\\log_{${b}} ${arg(a)} - \\log_{${b}} ${arg(-c)} = 1`;
        if (a === -c) continue;
        return T({
          text: `Reši enačbo $${E}$.`,
          answer: num(x0, null, null, [[(-a - b * c) / (b - 1), "Pazi na predznake pri odpravljanju oklepaja."], [(b * c - a) / (b + 1), "Razlika logaritmov je logaritem količnika: argumenta delimo, ne odštejemo."]]),
          hint: "Levo stran zapiši kot logaritem količnika, nato uporabi definicijo logaritma.",
          data: { given: [E], find: ["x"] },
          formula: ["\\log_a u - \\log_a v = \\log_a \\dfrac{u}{v}", DEF],
          solution: [`Pogoj: $x > ${Math.max(c, -a)}$`, `$${dfr(a === 0 ? "x" : `x ${sg(a)}`, c === 0 ? "x" : `x ${sg(-c)}`)} = ${b}$`, `$${a === 0 ? "x" : `x ${sg(a)}`} = ${b}${arg(-c)}$`, `$${mono(1 - b, "x")} = ${-b * c - a}$, $x = ${x0}$`],
        });
      }
    },
  },
  {
    id: "dod-mat-ss12-kotne-funkcije",
    topics: ["MAT-SS-2/kotne-funkcije-v-pravokotnem-trikotniku"],
    gen(level, r) {
      const TRIG = ["\\sin \\alpha = \\dfrac{a}{c}", "\\cos \\alpha = \\dfrac{b}{c}", "\\tan \\alpha = \\dfrac{a}{b}"];
      const sin = (x) => Math.sin(rad(x));
      const cos = (x) => Math.cos(rad(x));
      const tan = (x) => Math.tan(rad(x));
      const atan = (x) => (Math.atan(x) * 180) / Math.PI;
      const asin = (x) => (Math.asin(x) * 180) / Math.PI;
      const TRI = "V pravokotnem trikotniku $ABC$ s pravim kotom pri $C$";
      if (level === 1) {
        const t = r.int(0, 2);
        const al = r.int(10, 80);
        if (t < 2) {
          const c = r.dec(4, 25, 1);
          const v = t === 0 ? c * sin(al) : c * cos(al);
          return T({
            text: `${TRI} meri hipotenuza $c = ${tx(c)}\\ \\mathrm{cm}$, kot $\\alpha$ pa $${al}^\\circ$. Izračunaj kateto $${t === 0 ? "a" : "b"}$. Zaokroži na dve decimalki.`,
            answer: num(v, "cm", 2, [[t === 0 ? c * cos(al) : c * sin(al), t === 0 ? "Kateta a leži nasproti kota α – uporabi sinus." : "Kateta b je priležna kotu α – uporabi kosinus."], [c * tan(al), "Pri hipotenuzi uporabi sinus ali kosinus, ne tangensa."]]),
            hint: `Kateta $${t === 0 ? "a" : "b"}$ je kotu $\\alpha$ ${t === 0 ? "nasprotna" : "priležna"}, poznaš pa hipotenuzo.`,
            data: { given: [dat("c", tx(c), "cm"), `\\alpha = ${al}^\\circ`], find: [t === 0 ? "a" : "b"] },
            formula: TRIG[t],
            solution: [t === 0 ? `$a = c \\cdot \\sin \\alpha = ${tx(c)} \\cdot \\sin ${al}^\\circ$` : `$b = c \\cdot \\cos \\alpha = ${tx(c)} \\cdot \\cos ${al}^\\circ$`, `$${t === 0 ? "a" : "b"} ${eq(v, 2)} ${qty(tx(v, 2), "cm")}$`],
          });
        }
        const b = r.dec(3, 20, 1);
        const v = b * tan(al);
        return T({
          text: `${TRI} meri kateta $b = ${tx(b)}\\ \\mathrm{cm}$, kot $\\alpha$ pa $${al}^\\circ$. Izračunaj kateto $a$. Zaokroži na dve decimalki.`,
          answer: num(v, "cm", 2, [[b / tan(al), "tan α = a/b, zato a = b · tan α (ne b : tan α)."], [b * sin(al), "Obe kateti povezuje tangens."]]),
          hint: "Kateta $a$ je kotu $\\alpha$ nasprotna, $b$ pa priležna – uporabi tangens.",
          data: { given: [dat("b", tx(b), "cm"), `\\alpha = ${al}^\\circ`], find: ["a"] },
          formula: TRIG[2],
          solution: [`$a = b \\cdot \\tan \\alpha = ${tx(b)} \\cdot \\tan ${al}^\\circ$`, `$a ${eq(v, 2)} ${qty(tx(v, 2), "cm")}$`],
        });
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const hyp = r.next() < 0.5;
          const a = r.dec(2, 15, 1);
          const other = hyp ? roundHalfUp(a + r.dec(1, 15, 1), 1) : r.dec(2, 15, 1);
          const v = hyp ? asin(a / other) : atan(a / other);
          return T({
            text: `${TRI} merita ${hyp ? "kateta $a = " + tx(a) + "\\ \\mathrm{cm}$ in hipotenuza $c = " + tx(other) + "\\ \\mathrm{cm}$" : "kateti $a = " + tx(a) + "\\ \\mathrm{cm}$ in $b = " + tx(other) + "\\ \\mathrm{cm}$"}. Koliko meri kot $\\alpha$? Zaokroži na eno decimalko stopinje.`,
            answer: num(v, "°", 1, [[90 - v, "To je kot β; kot α leži nasproti katete a."], hyp ? [atan(a / other), "Razmerje kateta : hipotenuza je sinus, ne tangens."] : [a < other ? asin(a / other) : NaN, "Kateti povezuje tangens; sinus je razmerje kateta : hipotenuza."]]),
            hint: hyp ? "Nasprotna kateta in hipotenuza: uporabi sinus in nato $\\sin^{-1}$." : "Obe kateti: uporabi tangens in nato $\\tan^{-1}$.",
            data: { given: hyp ? [dat("a", tx(a), "cm"), dat("c", tx(other), "cm")] : [dat("a", tx(a), "cm"), dat("b", tx(other), "cm")], find: ["\\alpha"] },
            formula: hyp ? TRIG[0] : TRIG[2],
            solution: [hyp ? `$\\sin \\alpha = \\dfrac{${tx(a)}}{${tx(other)}} ${eq(a / other, 4)} ${tx(a / other, 4)}$` : `$\\tan \\alpha = \\dfrac{${tx(a)}}{${tx(other)}} ${eq(a / other, 4)} ${tx(a / other, 4)}$`, `$\\alpha ${eq(v, 1)} ${deg(roundHalfUp(v, 1))}$`],
          });
        }
        if (t === 1) {
          const L = r.dec(3, 8, 1);
          const be = r.int(55, 80);
          const askH = r.next() < 0.5;
          const v = askH ? L * sin(be) : L * cos(be);
          return T({
            text: `Lestev, dolga $${tx(L)}\\ \\mathrm{m}$, je naslonjena na zid in s tlemi oklepa kot $${be}^\\circ$. ${askH ? "Kako visoko na zidu sega?" : "Kako daleč od zidu je njeno spodnje krajišče?"} Zaokroži na dve decimalki.`,
            answer: num(v, "m", 2, [[askH ? L * cos(be) : L * sin(be), askH ? "Višina leži nasproti kota ob tleh – uporabi sinus." : "Razdalja od zidu je priležna kotu ob tleh – uporabi kosinus."], [askH ? L * tan(be) : L / tan(be), "Lestev je hipotenuza – uporabi sinus ali kosinus."]]),
            hint: "Lestev, zid in tla tvorijo pravokotni trikotnik; lestev je hipotenuza.",
            data: { given: [dat("L", tx(L), "m"), `\\beta = ${be}^\\circ`], find: [askH ? "h" : "d"] },
            formula: askH ? "h = L \\cdot \\sin \\beta" : "d = L \\cdot \\cos \\beta",
            solution: [askH ? `$h = ${tx(L)} \\cdot \\sin ${be}^\\circ$` : `$d = ${tx(L)} \\cdot \\cos ${be}^\\circ$`, `$${askH ? "h" : "d"} ${eq(v, 2)} ${qty(tx(v, 2), "m")}$`],
          });
        }
        const s = r.dec(3, 30, 1);
        if (r.next() < 0.5) {
          const h = r.dec(2, 25, 1);
          const v = atan(h / s);
          return T({
            text: `Drog, visok $${tx(h)}\\ \\mathrm{m}$, meče senco, dolgo $${tx(s)}\\ \\mathrm{m}$. Pod kolikšnim kotom glede na tla padajo sončni žarki? Zaokroži na eno decimalko stopinje.`,
            answer: num(v, "°", 1, [[90 - v, "To je kot med žarkom in drogom; iščemo kot ob tleh."], [atan(s / h), "tan α = višina : senca (nasprotna : priležna kateta)."]]),
            hint: "Drog, senca in sončni žarek tvorijo pravokotni trikotnik. Višina je nasprotna kateta kota ob tleh.",
            data: { given: [dat("h", tx(h), "m"), dat("s", tx(s), "m")], find: ["\\alpha"] },
            formula: "\\tan \\alpha = \\dfrac{h}{s}",
            solution: [`$\\tan \\alpha = \\dfrac{${tx(h)}}{${tx(s)}} ${eq(h / s, 4)} ${tx(h / s, 4)}$`, `$\\alpha ${eq(v, 1)} ${deg(roundHalfUp(v, 1))}$`],
          });
        }
        const al = r.int(20, 70);
        const v = s * tan(al);
        return T({
          text: `Drevo meče senco, dolgo $${tx(s)}\\ \\mathrm{m}$, ko sonce sije pod kotom $${al}^\\circ$ glede na tla. Kako visoko je drevo? Zaokroži na dve decimalki.`,
          answer: num(v, "m", 2, [[s / tan(al), "tan α = višina : senca, zato višina = senca · tan α."], [s * sin(al), "Senca je kateta, ne hipotenuza – uporabi tangens."]]),
          hint: "Višina drevesa in senca sta kateti; višina leži nasproti kota $\\alpha$.",
          data: { given: [dat("s", tx(s), "m"), `\\alpha = ${al}^\\circ`], find: ["h"] },
          formula: "\\tan \\alpha = \\dfrac{h}{s}",
          solution: [`$h = s \\cdot \\tan \\alpha = ${tx(s)} \\cdot \\tan ${al}^\\circ$`, `$h ${eq(v, 2)} ${qty(tx(v, 2), "m")}$`],
        });
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const d = r.int(20, 100);
        const al = r.int(15, 35);
        const be = al + r.int(10, 30);
        const h = d / (1 / tan(al) - 1 / tan(be));
        const what = r.pick(["stolpa", "cerkvenega zvonika", "dimnika", "skale"]);
        return T({
          text: `Vrh ${what} vidimo pod kotom $${al}^\\circ$. Ko se mu po ravnem približamo za $${d}\\ \\mathrm{m}$, ga vidimo pod kotom $${be}^\\circ$. Kako visok je? Zaokroži na eno decimalko.`,
          answer: num(h, "m", 1, [[d * tan(be), `Razdalja ${d} m ni oddaljenost od vznožja – sestavi dve enačbi.`], [d * tan(al), `Razdalja ${d} m je razlika oddaljenosti, ne cela oddaljenost.`]]),
          hint: "Naj bo $x$ razdalja od bližje točke do vznožja. Iz obeh pravokotnih trikotnikov zapiši višino: $h = x \\tan \\beta = (x + d)\\tan \\alpha$.",
          data: { given: [dat("d", d, "m"), `\\alpha = ${al}^\\circ`, `\\beta = ${be}^\\circ`], find: ["h"] },
          formula: ["h = x \\cdot \\tan \\beta", "h = (x + d) \\cdot \\tan \\alpha"],
          solution: [`$x \\tan ${be}^\\circ = (x + ${d}) \\tan ${al}^\\circ$`, `$x = \\dfrac{${d} \\tan ${al}^\\circ}{\\tan ${be}^\\circ - \\tan ${al}^\\circ} \\approx ${tx((d * tan(al)) / (tan(be) - tan(al)), 2)}\\ \\mathrm{m}$`, `$h = x \\tan ${be}^\\circ ${eq(h, 1)} ${qty(tx(h, 1), "m")}$`],
        });
      }
      if (t === 1) {
        const b = r.dec(4, 20, 1);
        const al = r.int(25, 75);
        const S = b * b * sin(al) * cos(al);
        return T({
          text: `Enakokraki trikotnik ima krak $b = ${tx(b)}\\ \\mathrm{cm}$ in kot ob osnovnici $\\alpha = ${al}^\\circ$. Izračunaj njegovo ploščino. Zaokroži na dve decimalki.`,
          answer: num(S, "cm²", 2, [[2 * S, "Ploščina trikotnika je (osnovnica · višina) : 2."], [(b * b * sin(al)) / 2, "Osnovnica je 2b · cos α, višina b · sin α."]], { unitAlternatives: ["cm2"] }),
          hint: "Višina na osnovnico razdeli trikotnik na dva pravokotna trikotnika s hipotenuzo $b$.",
          data: { given: [dat("b", tx(b), "cm"), `\\alpha = ${al}^\\circ`], find: ["S"] },
          formula: ["v = b \\cdot \\sin \\alpha", "\\dfrac{a}{2} = b \\cdot \\cos \\alpha", "S = \\dfrac{a \\cdot v}{2}"],
          solution: [`$v = ${tx(b)} \\cdot \\sin ${al}^\\circ \\approx ${tx(b * sin(al), 3)}\\ \\mathrm{cm}$`, `$a = 2 \\cdot ${tx(b)} \\cdot \\cos ${al}^\\circ \\approx ${tx(2 * b * cos(al), 3)}\\ \\mathrm{cm}$`, `$S = \\dfrac{a \\cdot v}{2} ${eq(S, 2)} ${qty(tx(S, 2), "cm^2")}$`],
        });
      }
      const p = r.pick([5, 6, 8, 10, 12]);
      const h = r.dec(0.3, 1.2, 2);
      const ang = atan(p / 100);
      const L = h / sin(ang);
      return T({
        text: `Klančina za invalidski voziček ima naklon $${p}\\ \\%$ (na $100\\ \\mathrm{m}$ vodoravne razdalje se dvigne za $${p}\\ \\mathrm{m}$). Premagati mora višino $${tx(h)}\\ \\mathrm{m}$. Kako dolga je klančina (poševna dolžina)? Zaokroži na dve decimalki.`,
        answer: num(L, "m", 2, [[h / (p / 100), "To je vodoravna dolžina; klančina je poševna (hipotenuza)."], [h / sin(p), `Naklon ${p} % ni kot ${p}°; kot izračunaj iz tan α = ${p}/100.`]]),
        hint: "Naklon v odstotkih je $\\tan \\alpha = \\dfrac{p}{100}$. Iz tega izračunaj kot, nato dolžino klančine s sinusom.",
        data: { given: [`p = ${p}\\ \\%`, dat("h", tx(h), "m")], find: ["L"] },
        formula: ["\\tan \\alpha = \\dfrac{p}{100}", "\\sin \\alpha = \\dfrac{h}{L}"],
        solution: [`$\\tan \\alpha = ${tx(p / 100)}$, $\\alpha \\approx ${tx(ang, 3)}^\\circ$`, `$L = \\dfrac{h}{\\sin \\alpha} = \\dfrac{${tx(h)}}{\\sin ${tx(ang, 3)}^\\circ} ${eq(L, 2)} ${qty(tx(L, 2), "m")}$`],
      });
    },
  },
];
