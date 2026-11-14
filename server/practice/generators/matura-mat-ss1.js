// Generatorji za teme 1. letnika gimnazije, ki jih zahteva maturitetna pot (MAT-SS-1): kartezični produkt in
// potenčna množica, dvojiški sestav, približki in napake, vsota in razlika potenc, enačbe in sistemi s parametrom,
// Gaussova metoda in sistemi linearnih neenačb. Merila: docs/kakovost.md §2. Vsi rezultati so izračunani v kodi
// iz istih števil, ki jih vidi dijak. Izvirne naloge, ne prepisane maturitetne. Zapisi kot v lekcijah MAT-SS-1
// (|A × B|, \mathcal{P}(A), 1011_{(2)}, \bar{x}, \Delta x, \delta x).
import { g } from "../rng.js";
import { roundHalfUp } from "../check.js";
import { tx } from "./mat.js";
import { num, sg, pickAns, name, wrapGens } from "./matura-util.js";

const P = "mat-ss1-matura-";
const T = (s) => `MAT-SS-1/${s}`;

// ---------- pomožne funkcije ----------
const pt = (x) => (x < 0 ? `(${tx(x)})` : tx(x));
const cl = (x) => Math.round(x * 1e9) / 1e9;
const decs = (v) => (String(v).split(".")[1] || "").length;
// Izmerjena vrednost z enakim številom decimalk kot njena napaka: md(12.5, 0.05) → "12{,}50".
const md = (v, err) => tx(v, decs(err));
const setT = (xs) => `\\{${xs.join(", ")}\\}`;
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const sortV = (xs) => [...xs].sort((u, v) => (typeof u === "number" ? u - v : u < v ? -1 : 1));
const pickSet = (r, pool, k) => sortV(r.shuffle(pool).slice(0, k));
const LET = ["a", "b", "c", "d", "e", "f", "g"];
// Sklanjatev ob številu: sk(2, "majico", "majici", "majice", "majic") → "$2$ majici".
function sk(n, ena, dve, tri, pet) {
  const h = n % 100;
  return `$${n}$ ${h === 1 ? ena : h === 2 ? dve : h === 3 || h === 4 ? tri : pet}`;
}
// Linearni izraz: lin([2, -1, 1], ["x", "y", "z"]) → "2x - y + z".
function lin(cs, vs) {
  let s = "";
  cs.forEach((c, i) => {
    if (c === 0) return;
    const ab = Math.abs(c);
    const t = (ab === 1 ? "" : tx(ab)) + vs[i];
    s += s === "" ? (c < 0 ? "-" : "") + t : (c < 0 ? " - " : " + ") + t;
  });
  return s || "0";
}
const XYZ = ["x", "y", "z"];
// m - c s parametrom m: mc(3) → "m - 3", mc(0) → "m".
const mc = (c) => (c === 0 ? "m" : `m ${sg(-c)}`);
const eq3 = (e) => `${lin(e.slice(0, 3), XYZ)} = ${tx(e[3])}`;
const cases = (rows) => `\\begin{cases} ${rows.join(" \\\\ ")} \\end{cases}`;
// a·x + b (izraz z enim x): ax(2, -3) → "2x - 3".
const ax = (a, b, v = "x") => (a === 0 ? tx(b) : `${lin([a], [v])}${b ? ` ${sg(b)}` : ""}`);
const REL = { "<": "<", "<=": "\\le", ">": ">", ">=": "\\ge" };
const FLIP = { "<": ">", "<=": ">=", ">": "<", ">=": "<=" };
const holds = (v, w, rel) => (rel === "<" ? v < w : rel === "<=" ? v <= w : rel === ">" ? v > w : v >= w);
const binS = (n) => n.toString(2);
const binN = (s) => Number(s); // dvojiški zapis, prebran kot zaporedje števk (odgovor 1011)
const bT = (s) => `${s}_{(2)}`;
const BIN_HINT = "samo števke 0 in 1, npr. 1011";
function primeFactors(n) {
  const out = [];
  for (let p = 2; p * p <= n; p++) while (n % p === 0) out.push(p), (n /= p);
  if (n > 1) out.push(n);
  return out;
}
const isPrime = (n) => n > 1 && primeFactors(n).length === 1;
function factT(n) {
  const fs = primeFactors(n);
  const ps = [...new Set(fs)];
  return ps.map((p) => {
    const e = fs.filter((q) => q === p).length;
    return e > 1 ? `${p}^${e}` : `${p}`;
  }).join(" \\cdot ");
}
const divisors = (n) => range(1, n).filter((d) => n % d === 0);

// ================= generatorji =================
const GENS = [
  // ---------------- kartezični produkt in potenčna množica ----------------
  {
    id: P + "kartezicni-produkt",
    topics: [T("kartezicni-produkt-in-potencna-mnozica")],
    gen(level, r) {
      const PF = "|A \\times B| = |A| \\cdot |B|";
      const PP = "|\\mathcal{P}(A)| = 2^{|A|}";
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const m = r.int(2, 5);
          const n = r.int(2, 5);
          const ctx = r.int(0, 2);
          if (ctx > 0 && m !== n) {
            const nm = name(r);
            const [txt, gm, gn] =
              ctx === 1
                ? [`${nm} ima v omari ${sk(m, "majico", "majici", "majice", "majic")} in ${sk(n, "kapo", "kapi", "kape", "kap")}. Na koliko načinov lahko izbere par (majica, kapa)?`, "M", "K"]
                : [`Šolska kuhinja ponuja ${sk(m, "juho", "juhi", "juhe", "juh")} in ${sk(n, "glavno jed", "glavni jedi", "glavne jedi", "glavnih jedi")}. Koliko različnih kosil (juha, glavna jed) lahko sestavi ${nm}?`, "J", "G"];
            return {
              text: txt,
              answer: num(m * n, null, [
                { value: m + n, why: "Vsako izbiro iz prve množice združiš z vsako iz druge, zato števili zmnožiš, ne sešteješ." },
                { value: Math.max(m, n) ** 2, why: "Upoštevaj obe množici: prva komponenta para je iz ene, druga iz druge." },
              ]),
              hint: "Vsak izbor je urejen par. Koliko parov dobiš, če vsak element prve množice združiš z vsakim elementom druge?",
              data: { given: [`|${gm}| = ${m}`, `|${gn}| = ${n}`], find: [`|${gm} \\times ${gn}|`] },
              formula: PF,
              solution: `Izbori so urejeni pari iz $${gm} \\times ${gn}$, $|${gm}| = ${m}$, $|${gn}| = ${n}$.\nVsako od $${m}$ izbir združimo z vsako od $${n}$ izbir.\n$|${gm} \\times ${gn}| = ${m} \\cdot ${n} = ${m * n}$`,
            };
          }
          const A = pickSet(r, range(1, 9), m);
          const B = pickSet(r, LET.slice(0, 6), n);
          const [X, Y] = r.pick([["A", "B"], ["B", "A"], ["A", "A"], ["B", "B"]]);
          const sz = { A: m, B: n };
          const val = sz[X] * sz[Y];
          return {
            text: `Dani sta množici $A = ${setT(A)}$ in $B = ${setT(B)}$. Koliko elementov ima množica $${X} \\times ${Y}$?`,
            answer: num(val, null, [
              { value: sz[X] + sz[Y], why: "Kartezični produkt sestavljajo vsi urejeni pari, zato moči zmnožiš, ne sešteješ." },
              X === Y ? { value: sz[X], why: `Tudi pri $${X} \\times ${X}$ so elementi pari: vsak element združiš z vsakim, tudi s samim sabo.` } : { value: sz[X] ** 2, why: `Druga komponenta para je iz $${Y}$, ne iz $${X}$.` },
            ]),
            hint: `Preštej elemente obeh množic. Vsak element prve množice tvori par z vsakim elementom druge.`,
            data: { given: [`A = ${setT(A)}`, `B = ${setT(B)}`], find: [`|${X} \\times ${Y}|`] },
            formula: PF,
            solution: `$|A| = ${m}$, $|B| = ${n}$\n$|${X} \\times ${Y}| = |${X}| \\cdot |${Y}| = ${sz[X]} \\cdot ${sz[Y]} = ${val}$`,
          };
        }
        if (t === 1) {
          const A = pickSet(r, range(1, 6), 3);
          const B = pickSet(r, range(2, 9), 3);
          const sw = r.next() < 0.5;
          const [Xs, Ys, XN, YN] = sw ? [B, A, "B", "A"] : [A, B, "A", "B"];
          const inP = (p) => Xs.includes(p[0]) && Ys.includes(p[1]);
          const x = r.pick(Xs);
          const y = r.pick(Ys);
          if (inP([y, x])) return null;
          const pr = (p) => `(${p[0]}, ${p[1]})`;
          const onlyX = Xs.filter((u) => !Ys.includes(u));
          const onlyY = Ys.filter((u) => !Xs.includes(u));
          const cands = [
            [[y, x], `Vrstni red v urejenem paru je pomemben: prva komponenta mora biti iz $${XN}$, druga iz $${YN}$. Ta par je v $${YN} \\times ${XN}$.`],
            onlyX.length ? [[x, r.pick(onlyX)], `Druga komponenta mora biti element množice $${YN}$.`] : null,
            onlyY.length ? [[r.pick(onlyY), y], `Prva komponenta mora biti element množice $${XN}$.`] : null,
            [[r.pick(Ys), r.pick(Xs)], `Komponenti sta v napačnem vrstnem redu: prva mora biti iz $${XN}$, druga iz $${YN}$.`],
          ].filter((cd) => cd && !inP(cd[0]));
          const c = pickAns(r, pr([x, y]), cands.map(([p, w]) => [pr(p), w]));
          if (c.options.length < 3) return null;
          return {
            text: `Dani sta množici $A = ${setT(A)}$ in $B = ${setT(B)}$. Kateri urejeni par je element množice $${XN} \\times ${YN}$?`,
            answer: c,
            options_tex: true,
            hint: `V paru iz $${XN} \\times ${YN}$ je prva komponenta iz $${XN}$, druga pa iz $${YN}$. Preveri obe komponenti.`,
            data: { given: [`A = ${setT(A)}`, `B = ${setT(B)}`], find: [`(x, y) \\in ${XN} \\times ${YN}`] },
            formula: `${XN} \\times ${YN} = \\{(x, y) \\mid x \\in ${XN} \\wedge y \\in ${YN}\\}`,
            solution: `Prva komponenta mora biti iz $${XN} = ${setT(Xs)}$, druga iz $${YN} = ${setT(Ys)}$.\n$${x} \\in ${XN}$ in $${y} \\in ${YN}$, zato je $${pr([x, y])} \\in ${XN} \\times ${YN}$.\nPar $${pr([y, x])}$ pa ni v $${XN} \\times ${YN}$: vrstni red je pomemben.`,
          };
        }
        // osnovna raven: majhno množico izpišemo (obrazec 2^n je višja raven)
        const n = r.int(2, 3);
        const A = r.next() < 0.5 ? pickSet(r, range(1, 12), n) : pickSet(r, LET, n);
        const subs = range(0, 2 ** n - 1)
          .map((mask) => A.filter((_, i) => (mask >> i) & 1))
          .sort((u, v) => u.length - v.length)
          .map((s) => (s.length ? setT(s) : "\\emptyset"));
        return {
          text: `Koliko elementov ima potenčna množica $\\mathcal{P}(A)$ množice $A = ${setT(A)}$?`,
          answer: num(2 ** n, null, [
            { value: 2 ** n - 1, why: "Prazna množica je podmnožica vsake množice, zato je tudi element $\\mathcal{P}(A)$." },
            { value: 2 ** n - 2, why: "Med podmnožice množice $A$ spadata tudi $\\emptyset$ in $A$ sama." },
            { value: n, why: "Elementi $\\mathcal{P}(A)$ so podmnožice množice $A$, ne njeni elementi." },
          ]),
          hint: "Izpiši vse podmnožice množice $A$, urejene po številu elementov. Ne pozabi na prazno množico in na $A$.",
          data: { given: [`A = ${setT(A)}`], find: ["|\\mathcal{P}(A)|"] },
          formula: "\\mathcal{P}(A) = \\{X \\mid X \\subseteq A\\}",
          solution: `Podmnožice izpišemo po številu elementov, od $\\emptyset$ do $A$:\n$\\mathcal{P}(A) = \\{${subs.join(", ")}\\}$\n$|\\mathcal{P}(A)| = ${2 ** n}$`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          // opisno podani množici: A ⊂ ℕ, B ⊂ ℤ
          const p = r.int(3, 7);
          const leA = r.next() < 0.5;
          const cA = leA ? p : p - 1;
          const lo = r.int(-4, 0);
          const hi = r.int(1, 4);
          const r1 = r.pick(["<", "<="]);
          const r2 = r.pick(["<", "<="]);
          const Bs = range(lo - 1, hi + 1).filter((x) => holds(lo, x, r1) && holds(x, hi, r2));
          const cB = Bs.length;
          const Atex = `\\{x \\in \\mathbb{N} \\mid x ${leA ? "\\le" : "<"} ${p}\\}`;
          const Btex = `\\{x \\in \\mathbb{Z} \\mid ${lo} ${REL[r1]} x ${REL[r2]} ${hi}\\}`;
          const Al = range(1, cA);
          return {
            text: `Dani sta množici $A = ${Atex}$ in $B = ${Btex}$. Koliko elementov ima $A \\times B$?`,
            answer: num(cA * cB, null, [
              { value: (cA + 1) * cB, why: "Množica $\\mathbb{N}$ se začne z $1$: števila $0$ ni v $A$." },
              { value: cA * (hi - lo), why: `Celih števil med $${lo}$ in $${hi}$ ni $${hi} - ${pt(lo)}$: pri štetju upoštevaj, katero krajišče je vključeno.` },
              { value: cA + cB, why: "Moči kartezičnega produkta se zmnožita, ne seštejeta." },
            ]),
            hint: "Najprej izpiši elemente obeh množic in jih preštej. Pazi, ali je krajišče vključeno.",
            data: { given: [`A = ${Atex}`, `B = ${Btex}`], find: ["|A \\times B|"] },
            formula: PF,
            solution: `$A = ${setT(Al)}$, $|A| = ${cA}$\n$B = ${setT(Bs)}$, $|B| = ${cB}$\n$|A \\times B| = ${cA} \\cdot ${cB} = ${cA * cB}$`,
          };
        }
        if (t === 1) {
          // točke s celima koordinatama v pravokotniku A × B
          const a = r.int(-3, 1);
          const b = a + r.int(2, 5);
          const c = r.int(-3, 1);
          const d = c + r.int(2, 4);
          const [la, rb, lc, rd] = [r.next() < 0.5, r.next() < 0.7, r.next() < 0.7, r.next() < 0.5]; // true = zaprto
          const ints = (u, v, cu, cv) => range(u, v).filter((x) => (x > u || cu) && (x < v || cv));
          const IA = ints(a, b, la, rb);
          const IB = ints(c, d, lc, rd);
          const iv = (u, v, cu, cv) => `${cu ? "[" : "("}${u}, ${v}${cv ? "]" : ")"}`;
          const At = iv(a, b, la, rb);
          const Bt = iv(c, d, lc, rd);
          const val = IA.length * IB.length;
          return {
            text: `Dana sta intervala $A = ${At}$ in $B = ${Bt}$. Množica $A \\times B$ je v ravnini pravokotnik. Koliko točk s celima koordinatama leži v $A \\times B$?`,
            answer: num(val, null, [
              { value: (b - a + 1) * (d - c + 1), why: "Okrogel oklepaj pomeni, da krajišče ne spada v interval: tistih celih števil ne štej." },
              { value: (b - a) * (d - c), why: "Število celih števil na intervalu ni enako dolžini intervala: preštej jih po vrsti." },
              { value: IA.length + IB.length, why: "Točka je par $(x, y)$: vsako možno absciso združiš z vsako ordinato, zato števili zmnožiš." },
            ]),
            hint: "Posebej preštej cela števila v $A$ (možne abscise) in v $B$ (možne ordinate).",
            data: { given: [`A = ${At}`, `B = ${Bt}`], find: ["\\text{število točk s celima koordinatama}"] },
            formula: PF,
            solution: `Cela števila v $A$: $${IA.join(", ")}$, teh je $${IA.length}$.\nCela števila v $B$: $${IB.join(", ")}$, teh je $${IB.length}$.\nŠtevilo točk: $${IA.length} \\cdot ${IB.length} = ${val}$`,
          };
        }
        if (r.next() < 0.5) {
          // 𝒫(A) za opisno podano množico
          const N = r.pick([6, 8, 10, 12, 14, 15, 16, 18, 20, 21, 22]);
          const D = divisors(N);
          const k = D.length;
          return {
            text: `Množica $A$ vsebuje vse naravne delitelje števila $${N}$. Koliko elementov ima potenčna množica $\\mathcal{P}(A)$?`,
            answer: num(2 ** k, null, [
              { value: 2 ** (k - 2), why: `Med delitelje štejeta tudi $1$ in $${N}$.` },
              { value: 2 ** k - 1, why: "Tudi prazna množica je element potenčne množice." },
              { value: k * k, why: "Moč potenčne množice je $2^n$, ne $n^2$." },
            ]),
            hint: "Najprej izpiši vse delitelje in jih preštej. Nato uporabi moč potenčne množice.",
            data: { given: [`N = ${N}`], find: ["|\\mathcal{P}(A)|"] },
            formula: PP,
            solution: `$A = ${setT(D)}$, $|A| = ${k}$\n$|\\mathcal{P}(A)| = 2^{${k}} = ${2 ** k}$`,
          };
        }
        // obratno: iz |𝒫(A)| do |A|
        const m = r.int(2, 6);
        const n = r.int(2, 6);
        return {
          text: `Za končni množici $A$ in $B$ velja $|\\mathcal{P}(A)| = ${2 ** m}$ in $|B| = ${n}$. Koliko elementov ima $A \\times B$?`,
          answer: num(m * n, null, [
            { value: 2 ** m * n, why: `$${2 ** m}$ je število podmnožic množice $A$, ne število njenih elementov.` },
            { value: m + n, why: "Moči kartezičnega produkta se zmnožita." },
            { value: (2 ** m / 2) * n, why: `$|\\mathcal{P}(A)| = 2^{|A|}$: iskati moraš eksponent, ne polovice.` },
          ]),
          hint: `Najprej ugotovi $|A|$ iz $2^{|A|} = ${2 ** m}$.`,
          data: { given: [`|\\mathcal{P}(A)| = ${2 ** m}`, `|B| = ${n}`], find: ["|A \\times B|"] },
          formula: [PP, PF],
          solution: `$2^{|A|} = ${2 ** m} = 2^{${m}}$, torej $|A| = ${m}$\n$|A \\times B| = ${m} \\cdot ${n} = ${m * n}$`,
        };
      }
      // level 3
      const t = r.int(0, 3);
      if (t === 0) {
        const [m, n] = r.pick([[2, 2], [2, 3], [3, 2], [2, 4], [4, 2], [2, 5], [5, 2], [3, 3]]);
        const A = pickSet(r, range(0, 9), m);
        const B = pickSet(r, LET, n);
        return {
          text: `Dani sta množici $A = ${setT(A)}$ in $B = ${setT(B)}$. Koliko elementov ima potenčna množica $\\mathcal{P}(A \\times B)$?`,
          answer: num(2 ** (m * n), null, [
            { value: 2 ** m * 2 ** n, why: "$\\mathcal{P}(A \\times B)$ ni $\\mathcal{P}(A) \\times \\mathcal{P}(B)$: najprej preštej pare v $A \\times B$." },
            { value: m * n, why: "To je moč $A \\times B$. Potenčna množica ima $2^{|A \\times B|}$ elementov." },
            { value: 2 ** (m + n), why: "Moč kartezičnega produkta je produkt moči, ne vsota." },
          ]),
          hint: "Najprej ugotovi, koliko parov ima $A \\times B$. Nato preštej podmnožice te množice.",
          data: { given: [`A = ${setT(A)}`, `B = ${setT(B)}`], find: ["|\\mathcal{P}(A \\times B)|"] },
          formula: [PF, PP],
          solution: `$|A \\times B| = ${m} \\cdot ${n} = ${m * n}$\n$|\\mathcal{P}(A \\times B)| = 2^{${m * n}} = ${2 ** (m * n)}$`,
        };
      }
      if (t === 1) {
        // (A × B) ∩ (B × A) oz. unija
        const k = r.int(1, 3);
        const pool = r.shuffle(range(1, 12));
        const S = pool.slice(0, k);
        const m = k + r.int(1, 3);
        const n = k + r.int(1, 3);
        const A = sortV([...S, ...pool.slice(k, m)]);
        const B = sortV([...S, ...pool.slice(m, m + n - k)]);
        const uni = r.next() < 0.5;
        const val = uni ? 2 * m * n - k * k : k * k;
        return {
          text: `Dani sta množici $A = ${setT(A)}$ in $B = ${setT(B)}$. Koliko elementov ima množica $(A \\times B) ${uni ? "\\cup" : "\\cap"} (B \\times A)$?`,
          answer: num(val, null, uni
            ? [
                { value: 2 * m * n, why: "Pare, ki so v obeh produktih, si štel dvakrat. Odštej moč preseka." },
                { value: m * n, why: "$A \\times B$ in $B \\times A$ nista enaki množici: zaradi vrstnega reda so pari večinoma različni." },
                { value: 2 * m * n - k, why: "Presek produktov sestavljajo pari, katerih obe komponenti sta v $A \\cap B$: teh je $|A \\cap B|^2$." },
              ]
            : [
                { value: k, why: "Elementi preseka so pari, ne števila: obe komponenti sta iz $A \\cap B$." },
                { value: m * n, why: "$A \\times B$ in $B \\times A$ nista enaki: par $(a, b)$ je v obeh le, če sta $a$ in $b$ v $A \\cap B$." },
                { value: 2 * k, why: `Par $(x, y)$ sestaviš iz vsakega $x$ in vsakega $y$ iz $A \\cap B$: števili zmnožiš.` },
              ]),
          hint: "Par $(x, y)$ je v $A \\times B$ in v $B \\times A$ natanko takrat, ko sta $x$ in $y$ oba v $A \\cap B$.",
          data: { given: [`A = ${setT(A)}`, `B = ${setT(B)}`], find: [`|(A \\times B) ${uni ? "\\cup" : "\\cap"} (B \\times A)|`] },
          formula: uni ? ["(A \\times B) \\cap (B \\times A) = (A \\cap B) \\times (A \\cap B)", "|X \\cup Y| = |X| + |Y| - |X \\cap Y|"] : "(A \\times B) \\cap (B \\times A) = (A \\cap B) \\times (A \\cap B)",
          solution: `$A \\cap B = ${setT(sortV(S))}$, $|A \\cap B| = ${k}$\n$|(A \\times B) \\cap (B \\times A)| = ${k}^2 = ${k * k}$${uni ? `\n$|A \\times B| = |B \\times A| = ${m} \\cdot ${n} = ${m * n}$\n$|(A \\times B) \\cup (B \\times A)| = ${m * n} + ${m * n} - ${k * k} = ${val}$` : ""}`,
        };
      }
      if (t === 2) {
        const m = r.int(2, 5);
        const n = r.int(2, 5);
        if (m === n) return null;
        return {
          text: `Za končni množici velja $|A \\times B| = ${m * n}$ in $|\\mathcal{P}(A)| = ${2 ** m}$. Koliko elementov ima $\\mathcal{P}(B)$?`,
          answer: num(2 ** n, null, [
            { value: n, why: "To je moč množice $B$. Iskana je moč njene potenčne množice." },
            { value: 2 ** (m * n - m), why: "Moči se pri kartezičnem produktu zmnožita: $|B| = |A \\times B| : |A|$, ne razlika." },
            { value: (m * n) / 2 ** m, why: `$|A|$ ni $${2 ** m}$: to je število podmnožic. Iz $2^{|A|} = ${2 ** m}$ najprej izračunaj $|A|$.` },
          ]),
          hint: `Iz $2^{|A|} = ${2 ** m}$ dobiš $|A|$, nato iz $|A \\times B| = |A| \\cdot |B|$ še $|B|$.`,
          data: { given: [`|A \\times B| = ${m * n}`, `|\\mathcal{P}(A)| = ${2 ** m}`], find: ["|\\mathcal{P}(B)|"] },
          formula: [PF, PP],
          solution: `$2^{|A|} = ${2 ** m}$, torej $|A| = ${m}$\n$|B| = ${m * n} : ${m} = ${n}$\n$|\\mathcal{P}(B)| = 2^{${n}} = ${2 ** n}$`,
        };
      }
      const a = r.int(1, 4);
      const b = r.int(2, 4);
      const val = (2 * a + 1) * (2 * b - 1);
      return {
        text: `Dani sta množici $A = \\{x \\in \\mathbb{Z} \\mid |x| \\le ${a}\\}$ in $B = \\{y \\in \\mathbb{Z} \\mid |y| < ${b}\\}$. Koliko točk ima graf množice $A \\times B$ v koordinatnem sistemu?`,
        answer: num(val, null, [
          { value: 2 * a * (2 * b - 2), why: `Ne pozabi na število $0$: tudi zanj velja $|0| \\le ${a}$ in $|0| < ${b}$.` },
          { value: (2 * a + 1) * (2 * b + 1), why: `Pri $|y| < ${b}$ število $\\pm ${b}$ ni vključeno.` },
          { value: (a + 1) * b, why: "Absolutna vrednost: v množico spadajo tudi negativna števila." },
        ]),
        hint: "Izpiši elemente obeh množic. Vsak element množice je ena možna koordinata, točka pa je par.",
        data: { given: [`A = \\{x \\in \\mathbb{Z} \\mid |x| \\le ${a}\\}`, `B = \\{y \\in \\mathbb{Z} \\mid |y| < ${b}\\}`], find: ["|A \\times B|"] },
        formula: PF,
        solution: `$A = ${setT(range(-a, a))}$, $|A| = ${2 * a + 1}$\n$B = ${setT(range(-b + 1, b - 1))}$, $|B| = ${2 * b - 1}$\nGraf ima $${2 * a + 1} \\cdot ${2 * b - 1} = ${val}$ točk.`,
      };
    },
  },

  // ---------------- dvojiški sestav ----------------
  {
    id: P + "dvojiski-sestav",
    topics: [T("dvojiski-stevilski-sestav")],
    gen(level, r) {
      const FB = "a_k \\ldots a_1 a_0{}_{(2)} = a_k \\cdot 2^k + \\ldots + a_1 \\cdot 2 + a_0";
      const expand = (s) => {
        const n = s.length;
        const terms = [...s].map((d, i) => [d, n - 1 - i]).filter(([d]) => d === "1");
        return { sum: terms.map(([, e]) => `2^{${e}}`).join(" + "), vals: terms.map(([, e]) => 2 ** e).join(" + ") };
      };
      const divSteps = (n) => {
        const out = [];
        let q = n;
        while (q > 0) {
          out.push(`$${q} = ${Math.floor(q / 2)} \\cdot 2 + ${q % 2}$`);
          q = Math.floor(q / 2);
        }
        return out;
      };
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const n = r.int(9, 63);
          const s = binS(n);
          const rev = parseInt([...s].reverse().join(""), 2);
          const ones = [...s].filter((d) => d === "1").length;
          const e = expand(s);
          return {
            text: `Pretvori število $${bT(s)}$ v desetiški sestav.`,
            answer: num(n, null, [
              { value: rev, why: "Mestne vrednosti rastejo od desne proti levi: najbolj desna števka je vredna $2^0 = 1$." },
              { value: ones, why: "Enica ni vredna $1$, ampak toliko, kolikor je vredno njeno mesto." },
              { value: 2 * n, why: "Prvo mesto z desne ima vrednost $2^0 = 1$, ne $2^1$." },
            ]),
            hint: "Nad vsako števko zapiši mestno vrednost ($1, 2, 4, 8, \\ldots$ od desne) in seštej tiste nad enicami.",
            data: { given: [`x = ${bT(s)}`], find: ["x \\text{ v desetiškem sestavu}"] },
            formula: FB,
            solution: `$${bT(s)} = ${e.sum}$\n$= ${e.vals}$\n$= ${n}$`,
          };
        }
        if (t === 1) {
          const len = r.int(6, 8);
          let s = "1" + [...Array(len - 1)].map(() => (r.next() < 0.5 ? "1" : "0")).join("");
          const k = r.int(2, len); // mesto z desne
          s = s.slice(0, len - k) + "1" + s.slice(len - k + 1);
          return {
            text: `Koliko je v desetiškem sestavu vredna enica, ki v zapisu $${bT(s)}$ stoji na ${k}. mestu z desne?`,
            answer: num(2 ** (k - 1), null, [
              { value: 2 ** k, why: "Prvo mesto z desne ima vrednost $2^0 = 1$, zato ima $k$. mesto vrednost $2^{k - 1}$." },
              { value: 10 ** (k - 1), why: "V dvojiškem sestavu so mestne vrednosti potence števila $2$, ne $10$." },
              { value: 2 * (k - 1), why: "Mestna vrednost je potenca $2^{k - 1}$, ne produkt $2 \\cdot (k - 1)$." },
            ]),
            hint: "Mestne vrednosti od desne so $1, 2, 4, 8, \\ldots$, torej $2^0, 2^1, 2^2, \\ldots$",
            data: { given: [`x = ${bT(s)}`, `k = ${k}`], find: ["\\text{vrednost mesta}"] },
            formula: "\\text{mesto } k \\text{ z desne: } 2^{k - 1}",
            solution: `Mesta z desne imajo vrednosti $2^0, 2^1, 2^2, \\ldots$\n${k}. mesto ima vrednost $2^{${k - 1}} = ${2 ** (k - 1)}$.`,
          };
        }
        const n = r.int(4, 10);
        const big = r.next() < 0.6;
        return big
          ? {
              text: `Katero je največje naravno število, ki ima v dvojiškem zapisu največ ${sk(n, "števko", "števki", "števke", "števk")}? Odgovor zapiši v desetiškem sestavu.`,
              answer: num(2 ** n - 1, null, [
                { value: 2 ** n, why: `$2^{${n}}$ je v dvojiškem sestavu enica in ${n} ničel, to je že $${n + 1}$ števk.` },
                { value: 2 ** (n - 1), why: "To je najmanjše število s toliko števkami. Največje ima same enice." },
                { value: binN("1".repeat(n)), why: "Odgovor zapiši v desetiškem sestavu: same enice pretvori." },
              ]),
              hint: "Največje število ima na vseh mestih enico. Koliko je to, če mu prišteješ $1$?",
              data: { given: [`n = ${n}`], find: ["x_{\\max}"] },
              formula: "\\underbrace{11\\ldots1}_{n}{}_{(2)} = 2^n - 1",
              solution: `Največje število ima same enice: $${bT("1".repeat(n))}$.\nČe mu prištejemo $1$, dobimo $${bT("1" + "0".repeat(n))} = 2^{${n}} = ${2 ** n}$.\nZato je $x_{\\max} = 2^{${n}} - 1 = ${2 ** n - 1}$.`,
            }
          : {
              text: `Katero je najmanjše naravno število, ki ima v dvojiškem zapisu natanko ${sk(n, "števko", "števki", "števke", "števk")}? Odgovor zapiši v desetiškem sestavu.`,
              answer: num(2 ** (n - 1), null, [
                { value: 2 ** n, why: `$2^{${n}}$ ima v dvojiškem zapisu že $${n + 1}$ števk.` },
                { value: 2 ** (n - 1) - 1, why: `To število ima same enice in le $${n - 1}$ števk.` },
                { value: 10 ** (n - 1), why: "Odgovor zapiši v desetiškem sestavu: mestna vrednost prve števke je potenca števila $2$." },
              ]),
              hint: "Prva števka mora biti $1$, vse druge so lahko $0$. Kolikšna je mestna vrednost prve števke?",
              data: { given: [`n = ${n}`], find: ["x_{\\min}"] },
              formula: "1\\underbrace{0\\ldots0}_{n - 1}{}_{(2)} = 2^{n - 1}",
              solution: `Najmanjše tako število je $${bT("1" + "0".repeat(n - 1))}$.\nEnica stoji na ${n}. mestu z desne, njena vrednost je $2^{${n - 1}}$.\n$x_{\\min} = 2^{${n - 1}} = ${2 ** (n - 1)}$`,
            };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const n = r.int(20, 120);
          const s = binS(n);
          const rv = [...s].reverse().join("");
          return {
            text: `Pretvori desetiško število $${n}$ v dvojiški sestav. Vpiši dvojiški zapis.`,
            inputHint: BIN_HINT,
            answer: num(binN(s), null, [
              { value: binN(rv), why: "Ostanke pri deljenju z $2$ beri od spodaj navzgor: zadnji ostanek je prva števka." },
              { value: binN(binS(Math.floor(n / 2))), why: "Manjka zadnja števka: to je ostanek pri prvem deljenju z $2$." },
            ]),
            hint: "Število zaporedoma deli z $2$ in si zapisuj ostanke, dokler količnik ni $0$.",
            data: { given: [`x = ${n}`], find: ["x \\text{ v dvojiškem sestavu}"] },
            formula: "a = q \\cdot 2 + r,\\ r \\in \\{0, 1\\}",
            solution: `${divSteps(n).join("\n")}\nOstanke beremo od spodaj navzgor: $${n} = ${bT(s)}$`,
          };
        }
        if (t === 1) {
          const n = r.int(30, 250);
          const s = binS(n);
          const ones = [...s].filter((d) => d === "1").length;
          const e = expand(s);
          return {
            text: `Koliko enic ima dvojiški zapis števila $${n}$?`,
            answer: num(ones, null, [
              { value: s.length, why: "To je število vseh števk. Preštej le enice." },
              { value: s.length - ones, why: "To je število ničel." },
            ]),
            hint: `Zapiši $${n}$ kot vsoto različnih potenc števila $2$: vsaka potenca v vsoti je ena enica.`,
            data: { given: [`x = ${n}`], find: ["\\text{število enic}"] },
            formula: "x = 2^{k_1} + 2^{k_2} + \\ldots",
            solution: `$${n} = ${e.vals} = ${e.sum}$\n$${n} = ${bT(s)}$\nŠtevilo enic: $${ones}$`,
          };
        }
        const a = r.int(5, 30);
        const b = r.int(3, 20);
        const sa = binS(a);
        const sb = binS(b);
        const inBin = r.next() < 0.5;
        const sum = a + b;
        return {
          text: `Izračunaj $${bT(sa)} + ${bT(sb)}$. Rezultat zapiši v ${inBin ? "dvojiškem" : "desetiškem"} sestavu.`,
          ...(inBin ? { inputHint: BIN_HINT } : {}),
          answer: num(inBin ? binN(binS(sum)) : sum, null, [
            { value: binN(sa) + binN(sb), why: "V dvojiškem sestavu je $1 + 1 = 10_{(2)}$: zapišeš $0$, enico pa preneseš na naslednje mesto." },
            inBin ? { value: sum, why: "Rezultat zapiši v dvojiškem sestavu." } : { value: binN(binS(sum)), why: "Rezultat zapiši v desetiškem sestavu." },
          ]),
          hint: "Lahko seštevaš pisno v dvojiškem sestavu (pazi na prenos) ali pa najprej obe števili pretvoriš v desetiški sestav.",
          data: { given: [`a = ${bT(sa)}`, `b = ${bT(sb)}`], find: ["a + b"] },
          formula: ["1_{(2)} + 1_{(2)} = 10_{(2)}", FB],
          solution: `$${bT(sa)} = ${a}$, $${bT(sb)} = ${b}$\n$${a} + ${b} = ${sum}$\n$${sum} = ${bT(binS(sum))}$`,
        };
      }
      const t = r.int(0, 2);
      if (t === 0) {
        const N = r.int(100, 5000);
        const k = Math.floor(Math.log2(N));
        return {
          text: `Koliko števk ima dvojiški zapis števila $${N}$?`,
          answer: num(k + 1, null, [
            { value: k, why: `$2^{${k}}$ je največja potenca, ki ne preseže števila, a $2^{${k}}$ ima $${k + 1}$ števk (od $2^0$ do $2^{${k}}$).` },
            { value: String(N).length, why: "To je število desetiških števk." },
            { value: k + 2, why: `$2^{${k + 1}}$ je že večje od $${N}$, zato to mesto ostane prazno.` },
          ]),
          hint: "Poišči največjo potenco števila $2$, ki ni večja od danega števila. Mesta gredo od $2^0$ do te potence.",
          data: { given: [`x = ${N}`], find: ["\\text{število števk}"] },
          formula: "2^k \\le x < 2^{k + 1} \\Rightarrow k + 1 \\text{ števk}",
          solution: `$2^{${k}} = ${2 ** k} \\le ${N} < ${2 ** (k + 1)} = 2^{${k + 1}}$\nNajvišje mesto ima vrednost $2^{${k}}$, mesta so od $2^0$ do $2^{${k}}$.\nŠtevilo števk: $${k} + 1 = ${k + 1}$`,
        };
      }
      if (t === 1) {
        const n = r.int(5, 10);
        const most = r.next() < 0.5;
        return most
          ? {
              text: `Koliko naravnih števil ima dvojiški zapis z največ ${n} števkami?`,
              answer: num(2 ** n - 1, null, [
                { value: 2 ** n, why: "Med $2^n$ zapisi je tudi $0$, ki ni naravno število." },
                { value: 2 ** (n - 1), why: `To so števila z natanko ${n} števkami. Prištej še krajša števila.` },
                { value: 2 * n, why: "Možnosti za posamezna mesta se zmnožijo, ne seštejejo." },
              ]),
              hint: `Največje tako število je $${bT("1".repeat(n))}$. Koliko je to v desetiškem sestavu?`,
              data: { given: [`n = ${n}`], find: ["\\text{število naravnih števil}"] },
              formula: "\\underbrace{11\\ldots1}_{n}{}_{(2)} = 2^n - 1",
              solution: `To so števila od $1$ do $${bT("1".repeat(n))}$.\n$${bT("1".repeat(n))} = 2^{${n}} - 1 = ${2 ** n - 1}$\nTakih števil je $${2 ** n - 1}$.`,
            }
          : {
              text: `Koliko naravnih števil ima dvojiški zapis z natanko ${n} števkami?`,
              answer: num(2 ** (n - 1), null, [
                { value: 2 ** n, why: "Prva števka mora biti $1$; izbiraš lahko le preostala mesta." },
                { value: 2 ** n - 1, why: "To so vsa števila z največ toliko števkami. Krajša števila odštej." },
                { value: 2 ** (n - 1) - 1, why: `Šteti začneš pri $2^{${n - 1}}$: tudi to število ima ${n} števk.` },
              ]),
              hint: "Prva števka je vedno $1$. Na koliko načinov lahko izpolniš preostala mesta?",
              data: { given: [`n = ${n}`], find: ["\\text{število naravnih števil}"] },
              formula: "\\text{od } 2^{n - 1} \\text{ do } 2^n - 1",
              solution: `Prva števka je $1$, za vsako od ostalih $${n - 1}$ mest sta $2$ možnosti.\n$2^{${n - 1}} = ${2 ** (n - 1)}$\nTo so števila od $${2 ** (n - 1)}$ do $${2 ** n - 1}$.`,
            };
      }
      // množenje / deljenje s potenco števila 2
      const k = r.int(1, 3);
      const a = r.int(5, 40);
      const mul = r.next() < 0.6;
      const NIC = { 1: "eno ničlo", 2: "dve ničli", 3: "tri ničle" };
      const x = mul ? a : a * 2 ** k;
      const res = mul ? a * 2 ** k : a;
      const sx = binS(x);
      const sr = binS(res);
      return {
        text: `Število $${bT(sx)}$ ${mul ? "pomnožimo" : "delimo"} s številom $${2 ** k}$. Zapiši rezultat v dvojiškem sestavu.`,
        inputHint: BIN_HINT,
        answer: num(binN(sr), null, [
          mul ? { value: binN(binS(x + 2 ** k)), why: "Množil si, ne prištel: množenje z $2$ doda na konec ničlo." } : { value: binN(binS(x - 2 ** k)), why: "Delil si, ne odštel: deljenje z $2$ odstrani zadnjo ničlo." },
          { value: binN(binS(mul ? x * 2 ** (k - 1) : x / 2 ** (k - 1))), why: `$${2 ** k} = 2^{${k}}$, zato ${mul ? "dodaš" : "odstraniš"} ${NIC[k]}.` },
          { value: res, why: "Rezultat zapiši v dvojiškem sestavu." },
        ]),
        hint: `Množenje z $2$ v dvojiškem sestavu deluje kot množenje z $10$ v desetiškem. Kako zapišeš $${2 ** k}$ kot potenco števila $2$?`,
        data: { given: [`x = ${bT(sx)}`, `${mul ? "\\text{faktor}" : "\\text{delitelj}"} = ${2 ** k}`], find: [mul ? "x \\cdot " + 2 ** k : `x : ${2 ** k}`] },
        formula: "x \\cdot 2^k: \\text{ na konec dodaš } k \\text{ ničel}",
        solution: `$${2 ** k} = 2^{${k}}$\n${mul ? `Na konec dodamo ${NIC[k]}` : `Na koncu odstranimo ${NIC[k]}`}: $${bT(sr)}$\nPreizkus: $${x} ${mul ? "\\cdot" : ":"} ${2 ** k} = ${res}$ in $${bT(sr)} = ${res}$.`,
      };
    },
  },

  // ---------------- približki ter absolutna in relativna napaka ----------------
  {
    id: P + "priblizki-napake",
    topics: [T("priblizki-ter-absolutna-in-relativna-napaka")],
    gen(level, r) {
      const FA = "\\Delta x = |\\bar{x} - x|";
      const FR = "\\delta x = \\frac{\\Delta x}{|x|} \\cdot 100\\ \\%";
      const pct = (v, d, ms) => ({ ...num(v, d, ms, "%"), unitAlternatives: ["odstotkov", "odstotka", "odstotke"] });
      const withU = (v, d, ms, u, alts = []) => ({ ...num(v, d, ms, u), unitAlternatives: alts });
      const PLACE = { 1: "desetinke", 2: "stotinke", 3: "tisočinke" };
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const d = r.pick([1, 2, 3, -1, -2, -3]);
          if (d > 0) {
            // štiri decimalke, števka za zaokrožitvenim mestom pogosto ≥ 5
            const X = r.int(10, 999) * 10000 + r.int(0, 9999);
            const next = Math.floor(X / 10 ** (3 - d)) % 10;
            if (X % 10 === 0 || (next < 5 && r.next() < 0.6)) return null;
            const x = X / 10000;
            const v = roundHalfUp(x, d);
            const tr = Math.floor(X / 10 ** (4 - d)) / 10 ** d;
            return {
              text: `Zaokroži število $${tx(x)}$ na ${PLACE[d]}.`,
              answer: num(v, d, [
                { value: tr, why: "Odvrženih števk ne smeš samo odrezati: če je prva odvržena števka $5$ ali več, zadnjo ohranjeno povečaš za $1$." },
                d > 1 ? { value: roundHalfUp(x, d - 1), why: `${PLACE[d][0].toUpperCase() + PLACE[d].slice(1)} so ${d}. decimalno mesto: ohraniti moraš ${d === 2 ? "dve decimalki" : "tri decimalke"}.` } : null,
              ]),
              hint: "Poišči mesto, na katero zaokrožuješ, in poglej prvo odvrženo števko.",
              data: { given: [`x = ${tx(x)}`], find: ["\\bar{x}"] },
              formula: "0\\text{–}4 \\text{ navzdol},\\ 5\\text{–}9 \\text{ navzgor}",
              solution: `Ohranimo $${d}$ ${d === 1 ? "decimalko" : d === 2 ? "decimalki" : "decimalke"}, prva odvržena števka je $${next}$.\n${next >= 5 ? "Ker je $5$ ali več, zadnjo ohranjeno števko povečamo za $1$." : "Ker je manj kot $5$, zadnja ohranjena števka ostane."}\n$${tx(x)} \\approx ${tx(v, d)}$`,
            };
          }
          const pl = 10 ** -d;
          const N = r.int(10000, 99999);
          if (N % pl === 0) return null;
          const v = Math.floor(N / pl + 0.5) * pl;
          const tr = Math.floor(N / pl) * pl;
          const nm = { 1: "desetice", 2: "stotice", 3: "tisočice" }[-d];
          const nxt = Math.floor(N / (pl / 10)) % 10;
          return {
            text: `Zaokroži število $${tx(N)}$ na ${nm}.`,
            answer: num(v, null, [
              { value: tr, why: "Če je prva odvržena števka $5$ ali več, zadnjo ohranjeno števko povečaš za $1$." },
              { value: Math.floor(N / pl + 0.5), why: "Odrezana mesta nadomesti z ničlami: število mora ostati približno enako veliko." },
              { value: Math.floor(N / (pl * 10) + 0.5) * pl * 10, why: `Zaokrožiti moraš na ${nm}: preveri, katero mesto ohraniš.` },
            ]),
            hint: `Poišči mesto ${nm.slice(0, -1)} in poglej števko desno od njega.`,
            data: { given: [`x = ${tx(N)}`], find: ["\\bar{x}"] },
            formula: "0\\text{–}4 \\text{ navzdol},\\ 5\\text{–}9 \\text{ navzgor}",
            solution: `Prva odvržena števka je $${nxt}$, zato zaokrožimo ${nxt >= 5 ? "navzgor" : "navzdol"}.\nOdrezana mesta nadomestimo z ničlami: $${tx(N)} \\approx ${tx(v)}$`,
          };
        }
        if (t === 1) {
          const X = r.int(1000, 49999); // tisočinke
          const k = r.pick([1, 2]);
          let A = roundHalfUp(X / 1000, k) * 1000;
          if (r.next() < 0.3) A += r.pick([-1, 1]) * 10 ** (3 - k);
          A = Math.round(A);
          const D = Math.abs(A - X);
          if (D === 0) return null;
          const x = X / 1000;
          const xa = A / 1000;
          const Dv = D / 1000;
          const nm = name(r);
          const ctx = r.int(0, 2);
          const u = ctx === 0 ? "" : ctx === 1 ? "\\ \\mathrm{m}" : "\\ \\mathrm{kg}";
          const text =
            ctx === 0
              ? `Število $x = ${tx(x)}$ nadomestimo s približkom $\\bar{x} = ${tx(xa)}$. Izračunaj absolutno napako.`
              : ctx === 1
                ? `Dolžina police je $${tx(x)}${u}$. ${nm} je v načrtu ${g(nm, "zapisal", "zapisala")} $${tx(xa)}${u}$. Kolikšna je absolutna napaka (v m)?`
                : `Vreča tehta $${tx(x)}${u}$, na nalepki pa piše $${tx(xa)}${u}$. Kolikšna je absolutna napaka (v kg)?`;
          return {
            text,
            answer: num(Dv, null, [
              A < X ? { value: (A - X) / 1000, why: "Absolutna napaka je absolutna vrednost razlike, zato ni negativna." } : null,
              { value: Dv / x, why: "To je relativna napaka. Absolutna napaka je le razlika med približkom in točno vrednostjo." },
            ]),
            hint: "Od približka odštej točno vrednost in vzemi absolutno vrednost.",
            data: { given: [`x = ${tx(x)}${u}`, `\\bar{x} = ${tx(xa)}${u}`], find: ["\\Delta x"] },
            formula: FA,
            solution: `$\\Delta x = |\\bar{x} - x| = |${tx(xa)} - ${tx(x)}|$\n$= |${tx((A - X) / 1000)}| = ${tx(Dv)}${u}$`,
          };
        }
        // največja napaka zaokroženega števila
        const d = r.pick([1, 2, 3, 0, -1]);
        const unitPl = 10 ** -d;
        const val = d > 0 ? r.int(10 ** d, 99 * 10 ** d) / 10 ** d : r.int(12, 999) * unitPl;
        const nm = { 1: "desetinke", 2: "stotinke", 3: "tisočinke", 0: "enice", "-1": "desetice" }[d];
        const half = cl(unitPl / 2);
        return {
          text: `Število je zaokroženo na ${nm}: $\\bar{x} = ${tx(val, d > 0 ? d : null)}$. Kolikšna je največja možna absolutna napaka?`,
          answer: num(half, null, [
            { value: unitPl, why: "Pri zaokroževanju se zmotiš največ za pol enote zadnjega ohranjenega mesta." },
            { value: cl(unitPl / 20), why: "Napaka je pol enote zadnjega ohranjenega mesta, ne naslednjega mesta." },
            { value: 0.5, why: `Pol enote mesta, na katero je zaokroženo (${nm}), ne pol enice.` },
          ]),
          hint: "Za koliko se lahko največ razlikuje točna vrednost, ki se zaokroži na ta približek?",
          data: { given: [`\\bar{x} = ${tx(val, d > 0 ? d : null)}`], find: ["\\Delta x_{\\max}"] },
          formula: "\\Delta x \\le \\tfrac{1}{2} \\text{ enote zadnjega mesta}",
          solution: `Zadnje ohranjeno mesto so ${nm}, ena enota je $${tx(unitPl)}$.\nNa $${tx(val, d > 0 ? d : null)}$ se zaokrožijo števila od $${tx(cl(val - half))}$ do $${tx(cl(val + half))}$.\n$\\Delta x \\le ${tx(unitPl)} : 2 = ${tx(half)}$`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          // meritev: relativna napaka v %
          const ctx = r.pick([["dolžino mize", "cm", 60, 250], ["maso paketa", "g", 200, 900], ["čas teka", "s", 40, 300], ["prostornino posode", "ml", 250, 990]]);
          const x = r.int(ctx[2], ctx[3]);
          const D = r.nonZero(-9, 9);
          const xa = x + D;
          const del = (Math.abs(D) / x) * 100;
          const nm = name(r);
          return {
            text: `${nm} je za ${ctx[0]} ${g(nm, "izmeril", "izmerila")} $${xa}\\ \\mathrm{${ctx[1]}}$, prava vrednost pa je $${x}\\ \\mathrm{${ctx[1]}}$. Kolikšna je relativna napaka meritve v odstotkih? Zaokroži na desetinko odstotka.`,
            answer: pct(del, 1, [
              { value: (Math.abs(D) / xa) * 100, why: "Pri točno znani vrednosti deliš s pravo vrednostjo, ne z izmerjeno." },
              { value: del / 100, why: "Količnik pomnoži s $100\\ \\%$, da dobiš odstotke." },
              { value: Math.abs(D), why: "To je absolutna napaka. Relativna je absolutna napaka, deljena s pravo vrednostjo." },
            ]),
            hint: "Najprej izračunaj absolutno napako, nato jo deli s pravo vrednostjo.",
            data: { given: [`x = ${x}\\ \\mathrm{${ctx[1]}}`, `\\bar{x} = ${xa}\\ \\mathrm{${ctx[1]}}`], find: ["\\delta x\\ (\\%)"] },
            formula: [FA, FR],
            solution: `$\\Delta x = |${xa} - ${x}| = ${Math.abs(D)}\\ \\mathrm{${ctx[1]}}$\n$\\delta x = \\frac{${Math.abs(D)}}{${x}} \\cdot 100\\ \\% \\approx ${tx(roundHalfUp(del, 1), 1)}\\ \\%$`,
          };
        }
        if (t === 1) {
          const C = r.pick([
            ["\\pi", Math.PI, [3.14, 3.1, 3.142]],
            ["\\sqrt{2}", Math.SQRT2, [1.41, 1.4, 1.42]],
            ["\\sqrt{3}", Math.sqrt(3), [1.73, 1.7, 1.74]],
            ["\\frac{1}{3}", 1 / 3, [0.33, 0.3, 0.333]],
            ["\\frac{2}{3}", 2 / 3, [0.67, 0.7, 0.667]],
            ["\\frac{1}{7}", 1 / 7, [0.14, 0.143, 0.15]],
            ["\\frac{5}{6}", 5 / 6, [0.83, 0.8, 0.833]],
          ]);
          const xa = r.pick(C[2]);
          const D = Math.abs(xa - C[1]);
          const del = (D / C[1]) * 100;
          if (roundHalfUp(del, 2) < 0.01) return null;
          return {
            text: `Število $${C[0]}$ nadomestimo s približkom $${tx(xa)}$. Kolikšna je relativna napaka v odstotkih? Zaokroži na stotinko odstotka.`,
            answer: pct(del, 2, [
              { value: del / 100, why: "Količnik pomnoži s $100\\ \\%$, da dobiš odstotke." },
              { value: D, why: "To je absolutna napaka. Deli jo še s točno vrednostjo." },
              { value: (D / C[1]) * 1000, why: "Za odstotke pomnožiš s $100$, ne s $1000$." },
            ]),
            hint: `Točno vrednost $${C[0]}$ izračunaj z računalom na vsaj šest decimalk, nato izračunaj absolutno napako.`,
            data: { given: [`x = ${C[0]}`, `\\bar{x} = ${tx(xa)}`], find: ["\\delta x\\ (\\%)"] },
            formula: [FA, FR],
            solution: `$${C[0]} \\approx ${tx(roundHalfUp(C[1], 6))}$\n$\\Delta x \\approx |${tx(xa)} - ${tx(roundHalfUp(C[1], 6))}| = ${tx(roundHalfUp(D, 6))}$\n$\\delta x = \\frac{${tx(roundHalfUp(D, 6))}}{${tx(roundHalfUp(C[1], 6))}} \\cdot 100\\ \\% \\approx ${tx(roundHalfUp(del, 2), 2)}\\ \\%$`,
          };
        }
        // napaka vsote in razlike
        const a = r.int(80, 300) / 10;
        const b = r.int(30, 79) / 10;
        const da = r.pick([0.1, 0.05, 0.2]);
        const db = r.pick([0.1, 0.05, 0.2, 0.5]);
        const kind = r.int(0, 3);
        const aT = `a = (${md(a, da)} \\pm ${tx(da)})\\ \\mathrm{cm}`;
        const bT_ = `b = (${md(b, db)} \\pm ${tx(db)})\\ \\mathrm{cm}`;
        const given = [`a = ${md(a, da)}\\ \\mathrm{cm}`, `\\Delta a = ${tx(da)}\\ \\mathrm{cm}`, `b = ${md(b, db)}\\ \\mathrm{cm}`, `\\Delta b = ${tx(db)}\\ \\mathrm{cm}`];
        const sumD = cl(da + db);
        if (kind === 0 || kind === 1) {
          const dif = kind === 1;
          return {
            text: `Izmerili smo $${aT}$ in $${bT_}$. Kolikšna je absolutna napaka ${dif ? "razlike $a - b$" : "vsote $a + b$"} (v cm)?`,
            answer: withU(sumD, null, [
              dif ? { value: cl(Math.abs(da - db)), why: "Pri razliki se napaki ne odštejeta: v najslabšem primeru je $a$ prevelik in $b$ premajhen, zato se napaki seštejeta." } : null,
              { value: Math.max(da, db), why: "Upoštevaj napaki obeh meritev: absolutni napaki se seštejeta." },
              { value: cl(da * db), why: "Absolutni napaki se pri vsoti in razliki seštejeta, ne zmnožita." },
            ], "cm"),
            hint: "Premisli najslabši primer: kako daleč od izračunane vrednosti je lahko rezultat?",
            data: { given, find: [`\\Delta(a ${dif ? "-" : "+"} b)`] },
            formula: "\\Delta(a \\pm b) = \\Delta a + \\Delta b",
            solution: `${dif ? `$a - b = ${tx(cl(a - b), Math.max(decs(da), decs(db)))}\\ \\mathrm{cm}$` : `$a + b = ${tx(cl(a + b), Math.max(decs(da), decs(db)))}\\ \\mathrm{cm}$`}\nPri vsoti in razliki se absolutni napaki seštejeta.\n$\\Delta = ${tx(da)} + ${tx(db)} = ${tx(sumD)}\\ \\mathrm{cm}$`,
          };
        }
        const o = cl(2 * (a + b));
        const dO = cl(2 * sumD);
        const askMax = kind === 3;
        return {
          text: `Stranici pravokotnika sta $${aT}$ in $${bT_}$. ${askMax ? "Kolikšen je lahko obseg pravokotnika največ (v cm)?" : "Kolikšna je absolutna napaka obsega (v cm)?"}`,
          answer: withU(askMax ? cl(o + dO) : dO, null, askMax
            ? [
                { value: cl(o + sumD), why: "Obseg vsebuje vsako stranico dvakrat, zato tudi vsako napako dvakrat." },
                { value: o, why: "To je izračunani obseg. Prištej še njegovo absolutno napako." },
                { value: cl(o - dO), why: "To je najmanjši možni obseg." },
              ]
            : [
                { value: sumD, why: "Obseg je $2a + 2b$: vsaka stranica in njena napaka nastopata dvakrat." },
                { value: cl(4 * Math.max(da, db)), why: "Napaki stranic sta različni: vsako upoštevaj posebej." },
              ], "cm"),
          hint: "Obseg je $o = 2a + 2b$. Pri vsoti se absolutne napake seštejejo.",
          data: { given, find: [askMax ? "o_{\\max}" : "\\Delta o"] },
          formula: ["o = 2a + 2b", "\\Delta o = 2\\Delta a + 2\\Delta b"],
          solution: `$o = 2 \\cdot ${md(a, da)} + 2 \\cdot ${md(b, db)} = ${tx(o)}\\ \\mathrm{cm}$\n$\\Delta o = 2 \\cdot ${tx(da)} + 2 \\cdot ${tx(db)} = ${tx(dO)}\\ \\mathrm{cm}$${askMax ? `\n$o_{\\max} = ${tx(o)} + ${tx(dO)} = ${tx(cl(o + dO))}\\ \\mathrm{cm}$` : ""}`,
        };
      }
      // level 3: produkt in količnik
      const t = r.int(0, 2);
      if (t === 0) {
        const a = r.int(80, 250) / 10;
        const b = r.int(40, 120) / 10;
        const da = r.pick([0.1, 0.05, 0.2]);
        const db = r.pick([0.1, 0.05]);
        const S = cl(a * b);
        const dRel = da / a + db / b;
        const askRel = r.next() < 0.5;
        const given = [`a = ${md(a, da)}\\ \\mathrm{cm}`, `\\Delta a = ${tx(da)}\\ \\mathrm{cm}`, `b = ${md(b, db)}\\ \\mathrm{cm}`, `\\Delta b = ${tx(db)}\\ \\mathrm{cm}`];
        const base = `Stranici pravokotnika smo izmerili: $a = (${md(a, da)} \\pm ${tx(da)})\\ \\mathrm{cm}$ in $b = (${md(b, db)} \\pm ${tx(db)})\\ \\mathrm{cm}$.`;
        const dS = S * dRel;
        const steps = `$S = ${md(a, da)} \\cdot ${md(b, db)} = ${tx(S)}\\ \\mathrm{cm^2}$\n$\\delta a = \\frac{${tx(da)}}{${md(a, da)}} \\approx ${tx(roundHalfUp(da / a, 5))}$, $\\delta b = \\frac{${tx(db)}}{${md(b, db)}} \\approx ${tx(roundHalfUp(db / b, 5))}$\n$\\delta S \\approx \\delta a + \\delta b \\approx ${tx(roundHalfUp(dRel, 5))} \\approx ${tx(roundHalfUp(dRel * 100, 1), 1)}\\ \\%$`;
        return askRel
          ? {
              text: `${base} Oceni relativno napako ploščine v odstotkih. Zaokroži na desetinko odstotka.`,
              // Ocena je pravilna; sprejmemo tudi natančno mejo (a + Δa)(b + Δb) - ab.
              answer: { ...pct(dRel * 100, 1, [
                { value: Math.abs(da / a - db / b) * 100, why: "Relativni napaki se pri produktu seštejeta, ne odštejeta." },
                { value: ((da + db) / S) * 100, why: "Pri produktu ne seštevaš absolutnih napak: seštej relativni napaki stranic." },
                { value: (da / a) * 100, why: "Upoštevaj napaki obeh stranic." },
              ]), alsoAccept: [((1 + da / a) * (1 + db / b) - 1) * 100] },
              hint: "Izračunaj relativni napaki obeh stranic. Kaj velja za relativno napako produkta?",
              data: { given, find: ["\\delta S\\ (\\%)"] },
              formula: ["\\delta(a \\cdot b) \\approx \\delta a + \\delta b", "\\delta a = \\frac{\\Delta a}{a}"],
              solution: steps,
            }
          : {
              text: `${base} Oceni absolutno napako ploščine (v cm², na dve decimalki).`,
              answer: { ...withU(dS, 2, [
                { value: da * db, why: "Napaki se ne zmnožita: pri produktu se seštejeta relativni napaki." },
                { value: da + db, why: "Pri produktu se ne seštejeta absolutni, ampak relativni napaki." },
                { value: b * da, why: "Upoštevaj napaki obeh stranic: $\\Delta S \\approx b\\,\\Delta a + a\\,\\Delta b$." },
              ], "cm²", ["cm2", "cm^2"]), alsoAccept: [(a + da) * (b + db) - a * b] },
              hint: "Najprej oceni relativno napako ploščine, nato jo pomnoži s ploščino.",
              data: { given, find: ["\\Delta S"] },
              formula: ["\\delta(a \\cdot b) \\approx \\delta a + \\delta b", "\\Delta S = S \\cdot \\delta S"],
              solution: `${steps}\n$\\Delta S \\approx ${tx(S)} \\cdot ${tx(roundHalfUp(dRel, 5))} \\approx ${tx(roundHalfUp(dS, 2), 2)}\\ \\mathrm{cm^2}$ (enako je $b\\,\\Delta a + a\\,\\Delta b$)`,
            };
      }
      if (t === 1) {
        const s = r.int(10, 80) * 5;
        const tt = r.int(80, 600) / 10;
        const ds = r.pick([0.5, 1, 2]);
        const dt = r.pick([0.1, 0.2]);
        const nm = name(r);
        const dRel = ds / s + dt / tt;
        return {
          text: `${nm} je ${g(nm, "pretekel", "pretekla")} $s = (${s} \\pm ${tx(ds)})\\ \\mathrm{m}$ v času $t = (${md(tt, dt)} \\pm ${tx(dt)})\\ \\mathrm{s}$. Oceni relativno napako povprečne hitrosti $v = \\frac{s}{t}$ v odstotkih. Zaokroži na desetinko odstotka.`,
          answer: { ...pct(dRel * 100, 1, [
            { value: Math.abs(ds / s - dt / tt) * 100, why: "Tudi pri količniku se relativni napaki seštejeta, ne odštejeta: najslabše je, ko je pot prevelika in čas premajhen." },
            { value: (ds / dt / (s / tt)) * 100, why: "Napake ne deliš: seštej relativni napaki poti in časa." },
            { value: (dt / tt) * 100, why: "Upoštevaj napaki obeh meritev." },
          ]), alsoAccept: [((1 + ds / s) / (1 - dt / tt) - 1) * 100] },
          hint: "Izračunaj relativni napaki poti in časa. Kaj velja za relativno napako količnika?",
          data: { given: [`s = ${s}\\ \\mathrm{m}`, `\\Delta s = ${tx(ds)}\\ \\mathrm{m}`, `t = ${md(tt, dt)}\\ \\mathrm{s}`, `\\Delta t = ${tx(dt)}\\ \\mathrm{s}`], find: ["\\delta v\\ (\\%)"] },
          formula: ["\\delta\\left(\\frac{s}{t}\\right) \\approx \\delta s + \\delta t", "\\delta s = \\frac{\\Delta s}{s}"],
          solution: `$\\delta s = \\frac{${tx(ds)}}{${s}} \\approx ${tx(roundHalfUp(ds / s, 5))}$\n$\\delta t = \\frac{${tx(dt)}}{${md(tt, dt)}} \\approx ${tx(roundHalfUp(dt / tt, 5))}$\n$\\delta v \\approx ${tx(roundHalfUp(ds / s, 5))} + ${tx(roundHalfUp(dt / tt, 5))} \\approx ${tx(roundHalfUp(dRel * 100, 1), 1)}\\ \\%$`,
        };
      }
      // kvadrat oz. kocka: δ(a^k) ≈ k·δa
      const k = r.pick([2, 3]);
      const a = r.int(20, 150) / 10;
      const da = r.pick([0.1, 0.05, 0.2]);
      const dRel = (k * da) / a;
      const what = k === 2 ? "ploščine kvadrata" : "prostornine kocke";
      return {
        text: `${k === 2 ? "Stranico kvadrata" : "Rob kocke"} smo izmerili: $a = (${md(a, da)} \\pm ${tx(da)})\\ \\mathrm{cm}$. Oceni relativno napako ${what} v odstotkih. Zaokroži na desetinko odstotka.`,
        answer: { ...pct(dRel * 100, 1, [
          { value: (da / a) * 100, why: `${k === 2 ? "Ploščina $a \\cdot a$" : "Prostornina $a \\cdot a \\cdot a$"} je produkt: relativna napaka vsakega faktorja se prišteje.` },
          { value: k * da, why: `Absolutno napako deli z dolžino ${k === 2 ? "stranice" : "roba"}, da dobiš relativno napako.` },
          { value: ((da / a) ** k) * 100, why: "Relativne napake faktorjev se seštejejo, ne zmnožijo." },
        ]), alsoAccept: [((1 + da / a) ** k - 1) * 100] },
        hint: `$a^${k}$ je produkt ${k === 2 ? "dveh" : "treh"} enakih faktorjev. Kaj se zgodi z relativnimi napakami pri produktu?`,
        data: { given: [`a = ${md(a, da)}\\ \\mathrm{cm}`, `\\Delta a = ${tx(da)}\\ \\mathrm{cm}`], find: [`\\delta(a^${k})\\ (\\%)`] },
        formula: ["\\delta(a \\cdot b) \\approx \\delta a + \\delta b", `\\delta(a^${k}) \\approx ${k}\\,\\delta a`],
        solution: `$\\delta a = \\frac{${tx(da)}}{${md(a, da)}} \\approx ${tx(roundHalfUp(da / a, 5))}$\n$a^${k}$ ima ${k === 2 ? "dva enaka faktorja" : "tri enake faktorje"}, zato $\\delta(a^${k}) \\approx ${k} \\cdot ${tx(roundHalfUp(da / a, 5))}$\n$\\approx ${tx(roundHalfUp(dRel * 100, 1), 1)}\\ \\%$`,
      };
    },
  },

  // ---------------- razstavljanje vsote in razlike potenc ----------------
  {
    id: P + "vsota-razlika-potenc",
    topics: [T("razstavljanje-vsote-in-razlike-potenc")],
    gen(level, r) {
      const F3 = ["a^3 - b^3 = (a - b)(a^2 + ab + b^2)", "a^3 + b^3 = (a + b)(a^2 - ab + b^2)"];
      const px = (p) => (p === 1 ? "x" : `${p}x`);
      const cb = (p) => (p === 1 ? "x^3" : `(${p}x)^3`);
      const cube = (p, q, s) => `${p ** 3 === 1 ? "" : p ** 3}x^3 ${s > 0 ? "+" : "-"} ${q ** 3}`;
      const linF = (p, q, s) => `${px(p)} ${s > 0 ? "+" : "-"} ${q}`;
      const quadF = (A, B, C) => `${A === 1 ? "" : A}x^2 ${B < 0 ? "-" : "+"} ${Math.abs(B) === 1 ? "" : Math.abs(B)}x + ${C}`;
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const p = r.pick([1, 1, 2, 3]);
          const q = r.int(1, 5);
          if (p === q) return null;
          const s = r.pick([1, -1]);
          const B = -s * p * q;
          const askC = r.next() < 0.35;
          const E = cube(p, q, s);
          const form = `(${linF(p, q, s)})(kx^2 + mx + n)`;
          return {
            text: `Izraz $${E}$ zapišemo kot $${form}$. Koliko je ${askC ? "$n$" : "$m$"}?`,
            answer: num(askC ? q * q : B, null, askC
              ? [
                  { value: q, why: "Zadnji člen drugega faktorja je kvadrat drugega člena $b^2$." },
                  { value: -q * q, why: "Zadnji člen drugega faktorja je pri vsoti in pri razliki kubov vedno pozitiven." },
                  { value: 2 * q, why: "Zadnji člen je $b^2$, ne $2b$." },
                ]
              : [
                  { value: -B, why: "Srednji člen drugega faktorja ima nasproten predznak kot prvi faktor." },
                  { value: 2 * B, why: "Drugi faktor ni kvadrat dvočlenika: srednji člen je $ab$, ne $2ab$." },
                  { value: -s * q, why: `Srednji člen je produkt $a \\cdot b = ${px(p)} \\cdot ${q}$.` },
                ]),
            hint: `Prepoznaj kuba: $${E} = ${cb(p)} ${s > 0 ? "+" : "-"} ${q}^3$. Nato uporabi obrazec.`,
            data: { given: [`${E} = ${form}`], find: [askC ? "n" : "m"] },
            formula: F3,
            solution: `$a = ${px(p)}$, $b = ${q}$\n$${E} = (${linF(p, q, s)})(${quadF(p * p, B, q * q)})$\n${askC ? `$n = b^2 = ${q * q}$` : `$m = ${s > 0 ? "-" : ""}ab = ${B}$`}`,
          };
        }
        if (t === 1) {
          const p = r.pick([1, 1, 2]);
          const q = r.int(1, 5);
          if (p === q) return null;
          const s = r.pick([1, -1]);
          const E = cube(p, q, s);
          const L = linF(p, q, s);
          const Lo = linF(p, q, -s);
          const B = -s * p * q;
          const right = `(${L})(${quadF(p * p, B, q * q)})`;
          const c = pickAns(r, right, r.shuffle([
            [`(${L})(${quadF(p * p, -B, q * q)})`, "Srednji člen drugega faktorja ima nasproten predznak kot prvi faktor."],
            [`(${L})(${quadF(p * p, 2 * B, q * q)})`, "Drugi faktor ni kvadrat dvočlenika: srednji člen je $ab$, ne $2ab$."],
            [`(${L})^3`, `${s > 0 ? "Vsota" : "Razlika"} kubov ni kub ${s > 0 ? "vsote" : "razlike"}: $(a ${s > 0 ? "+" : "-"} b)^3$ ima še srednja člena.`],
            [`(${Lo})(${quadF(p * p, -B, q * q)})`, `V prvem faktorju je isti znak kot v izrazu: pri ${s > 0 ? "vsoti" : "razliki"} je to $${s > 0 ? "+" : "-"}$.`],
          ]));
          return {
            text: `Kateri zapis je razcep izraza $${E}$?`,
            answer: c,
            options_tex: true,
            hint: `Zapiši izraz kot $a^3 ${s > 0 ? "+" : "-"} b^3$ in poišči $a$ in $b$.`,
            data: { given: [`a^3 ${s > 0 ? "+" : "-"} b^3 = ${E}`], find: ["\\text{razcep}"] },
            formula: F3,
            solution: `$${E} = ${cb(p)} ${s > 0 ? "+" : "-"} ${q}^3$, $a = ${px(p)}$, $b = ${q}$\n$= ${right}$`,
          };
        }
        const p = r.pick([1, 1, 2, 3]);
        const q = r.int(2, 6);
        if (p === q) return null;
        const s = r.pick([1, -1]);
        const E = cube(p, q, s);
        const m = s * q;
        return {
          text: `Izraz $${E}$ ima linearni faktor oblike $${px(p)} + c$. Koliko je $c$?`,
          answer: num(m, null, [
            { value: -m, why: `Prvi faktor ima isti znak kot izraz: pri ${s > 0 ? "vsoti" : "razliki"} kubov je $${px(p)} ${s > 0 ? "+" : "-"} b$.` },
            { value: s * q ** 3, why: `$${q ** 3}$ je kub; v faktorju je $b = \\sqrt[3]{${q ** 3}}$.` },
            { value: s * q * q, why: `$b$ je kubni koren, ne kvadratni: $b^3 = ${q ** 3}$.` },
          ]),
          hint: `Katero število je na kub enako $${q ** 3}$?`,
          data: { given: [`${E} = (${px(p)} + c)(\\ldots)`], find: ["c"] },
          formula: F3,
          solution: `$${q ** 3} = ${q}^3$, torej $${E} = ${cb(p)} ${s > 0 ? "+" : "-"} ${q}^3$\nPrvi faktor je $${linF(p, q, s)}$, zato $c = ${m}$.`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          // a ± b in ab → a³ ± b³
          const a = r.int(-4, 7);
          const b = r.int(-4, 6);
          if (a === b || a === -b || a * b === 0) return null;
          const plus = r.next() < 0.5;
          const s = plus ? a + b : a - b;
          const p = a * b;
          const val = a ** 3 + (plus ? 1 : -1) * b ** 3;
          return {
            text: `Za števili $a$ in $b$ velja $a ${plus ? "+" : "-"} b = ${s}$ in $ab = ${p}$. Izračunaj $a^3 ${plus ? "+" : "-"} b^3$, ne da bi računal $a$ in $b$.`,
            answer: num(val, null, plus
              ? [
                  { value: s ** 3, why: "$(a + b)^3$ ni enako $a^3 + b^3$: manjkata srednja člena." },
                  { value: s * (s * s - 2 * p), why: "$a^2 - ab + b^2 = (a + b)^2 - 3ab$: odšteti moraš še $ab$." },
                  { value: s * (s * s - p), why: "$a^2 + b^2 = (a + b)^2 - 2ab$, ne $(a + b)^2$." },
                ]
              : [
                  { value: s ** 3, why: "$(a - b)^3$ ni enako $a^3 - b^3$: manjkata srednja člena." },
                  { value: s * (s * s + 2 * p), why: "$a^2 + ab + b^2 = (a - b)^2 + 3ab$: prišteti moraš še $ab$." },
                  { value: s * (s * s + p), why: "$a^2 + b^2 = (a - b)^2 + 2ab$, ne $(a - b)^2$." },
                ]),
            hint: `Razstavi $a^3 ${plus ? "+" : "-"} b^3$ in drugi faktor izrazi z $a ${plus ? "+" : "-"} b$ in $ab$.`,
            data: { given: [`a ${plus ? "+" : "-"} b = ${s}`, `ab = ${p}`], find: [`a^3 ${plus ? "+" : "-"} b^3`] },
            formula: plus ? [F3[1], "a^2 + b^2 = (a + b)^2 - 2ab"] : [F3[0], "a^2 + b^2 = (a - b)^2 + 2ab"],
            solution: plus
              ? `$a^2 - ab + b^2 = (a + b)^2 - 3ab = ${pt(s)}^2 - 3 \\cdot ${pt(p)} = ${s * s - 3 * p}$\n$a^3 + b^3 = (a + b)(a^2 - ab + b^2) = ${pt(s)} \\cdot ${pt(s * s - 3 * p)} = ${val}$`
              : `$a^2 + ab + b^2 = (a - b)^2 + 3ab = ${pt(s)}^2 + 3 \\cdot ${pt(p)} = ${s * s + 3 * p}$\n$a^3 - b^3 = (a - b)(a^2 + ab + b^2) = ${pt(s)} \\cdot ${pt(s * s + 3 * p)} = ${val}$`,
          };
        }
        if (t === 1) {
          const p = r.pick([1, 2, 3]);
          const q = r.int(1, 4);
          if (p === q) return null;
          const s = r.pick([1, -1]);
          const k = r.nonZero(-3, 3);
          const E = cube(p, q, s);
          const B = -s * p * q;
          const Q = (bb) => p * p * k * k + bb * k + q * q;
          return {
            text: `Izraz $${E}$ razstavimo na linearni in kvadratni faktor. Kolikšna je vrednost kvadratnega faktorja pri $x = ${k}$?`,
            answer: num(Q(B), null, [
              { value: Q(-B), why: "Srednji člen kvadratnega faktorja ima nasproten predznak kot linearni faktor." },
              { value: Q(2 * B), why: "Kvadratni faktor ni kvadrat dvočlenika: srednji člen je $ab$, ne $2ab$." },
              { value: p * k + s * q, why: "To je vrednost linearnega faktorja." },
            ]),
            hint: "Najprej zapiši razcep, nato v drugi faktor vstavi dano vrednost.",
            data: { given: [`E = ${E}`, `x = ${k}`], find: ["\\text{vrednost kvadratnega faktorja}"] },
            formula: F3,
            solution: `$${E} = (${linF(p, q, s)})(${quadF(p * p, B, q * q)})$\n$${p * p === 1 ? "" : `${p * p} \\cdot `}${pt(k)}^2 ${B < 0 ? "-" : "+"} ${Math.abs(B)} \\cdot ${pt(k)} + ${q * q} = ${Q(B)}$`,
          };
        }
        const a = r.int(6, 15);
        const b = r.int(2, a - 2);
        const plus = r.next() < 0.5;
        const val = plus ? a * a - a * b + b * b : a * a + a * b + b * b;
        return {
          text: `Brez računala izračunaj $\\frac{${a}^3 ${plus ? "+" : "-"} ${b}^3}{${a} ${plus ? "+" : "-"} ${b}}$.`,
          answer: num(val, null, plus
            ? [
                { value: a * a + a * b + b * b, why: "Pri vsoti kubov je srednji člen drugega faktorja negativen: $a^2 - ab + b^2$." },
                { value: a * a + b * b, why: "Drugi faktor ima tri člene: ne pozabi na $-ab$." },
                { value: (a + b) ** 2, why: "Drugi faktor ni $(a + b)^2$." },
              ]
            : [
                { value: a * a - a * b + b * b, why: "Pri razliki kubov je srednji člen drugega faktorja pozitiven: $a^2 + ab + b^2$." },
                { value: a * a + b * b, why: "Drugi faktor ima tri člene: ne pozabi na $ab$." },
                { value: (a - b) ** 2, why: "Drugi faktor ni $(a - b)^2$." },
              ]),
          hint: `Števec razstavi kot ${plus ? "vsoto" : "razliko"} kubov in okrajšaj.`,
          data: { given: [`a = ${a}`, `b = ${b}`], find: [`\\frac{a^3 ${plus ? "+" : "-"} b^3}{a ${plus ? "+" : "-"} b}`] },
          formula: plus ? F3[1] : F3[0],
          solution: `$\\frac{${a}^3 ${plus ? "+" : "-"} ${b}^3}{${a} ${plus ? "+" : "-"} ${b}} = ${a}^2 ${plus ? "-" : "+"} ${a} \\cdot ${b} + ${b}^2$\n$= ${a * a} ${plus ? "-" : "+"} ${a * b} + ${b * b} = ${val}$`,
        };
      }
      // level 3
      const t = r.int(0, 2);
      if (t === 0) {
        const plus = r.next() < 0.4;
        const n = plus ? r.pick([5, 7]) : r.pick([4, 5, 6, 7]);
        const c = r.pick([2, 3]);
        const askTerms = r.next() < 0.35;
        const E = `x^{${n}} ${plus ? "+" : "-"} ${c ** n}`;
        if (askTerms) {
          return {
            text: `Izraz $${E}$ razstavimo kot $(x ${plus ? "+" : "-"} ${c})(\\ldots)$. Koliko členov ima drugi faktor?`,
            answer: num(n, null, [
              { value: n - 1, why: `Eksponenti v drugem faktorju gredo od $${n - 1}$ do $0$: to je $${n}$ členov.` },
              { value: n + 1, why: `Najvišja potenca v drugem faktorju je $x^{${n - 1}}$, ne $x^{${n}}$.` },
              { value: 3, why: "Tri člene ima drugi faktor le pri kubih." },
            ]),
            hint: `$${c ** n} = ${c}^{${n}}$. Zapiši obrazec za $a^n ${plus ? "+" : "-"} b^n$ in preštej člene.`,
            data: { given: [`${E} = (x ${plus ? "+" : "-"} ${c})(\\ldots)`], find: ["\\text{število členov}"] },
            formula: plus ? "a^n + b^n = (a + b)(a^{n-1} - a^{n-2}b + \\ldots + b^{n-1}),\\ n \\text{ lih}" : "a^n - b^n = (a - b)(a^{n-1} + a^{n-2}b + \\ldots + b^{n-1})",
            solution: `$${E} = x^{${n}} ${plus ? "+" : "-"} ${c}^{${n}}$\nV drugem faktorju so členi $x^{${n - 1}}, x^{${n - 2}} \\cdot ${c}, \\ldots, ${c}^{${n - 1}}$.\nEksponenti pri $x$ gredo od $${n - 1}$ do $0$: to je $${n}$ členov.`,
          };
        }
        const k = r.int(1, n - 2);
        const e = n - 1 - k;
        const coef = (plus && e % 2 === 1 ? -1 : 1) * c ** e;
        return {
          text: `Izraz $${E}$ razstavimo kot $(x ${plus ? "+" : "-"} ${c})(\\ldots)$. Kolikšen je koeficient pri $x^{${k}}$ v drugem faktorju?`,
          answer: num(coef, null, [
            { value: (plus && e % 2 === 0 ? -1 : 1) * c ** e, why: "Pri vsoti potenc se predznaki v drugem faktorju izmenjujejo, začnejo pa s $+$ pri najvišji potenci." },
            { value: (plus && (e + 1) % 2 === 1 ? -1 : 1) * c ** (e + 1), why: `V vsakem členu je vsota eksponentov $${n - 1}$, ne $${n}$.` },
            { value: (plus && k % 2 === 1 ? -1 : 1) * c ** k, why: `Pri $x^{${k}}$ ima $${c}$ eksponent $${n - 1} - ${k}$.` },
          ]),
          hint: `V drugem faktorju je člen oblike $x^{${k}} \\cdot ${c}^{j}$, pri čemer je $${k} + j = ${n - 1}$.`,
          data: { given: [`${E} = (x ${plus ? "+" : "-"} ${c})(\\ldots)`, `k = ${k}`], find: [`\\text{koeficient pri } x^{${k}}`] },
          formula: plus ? "a^n + b^n = (a + b)(a^{n-1} - a^{n-2}b + \\ldots + b^{n-1}),\\ n \\text{ lih}" : "a^n - b^n = (a - b)(a^{n-1} + a^{n-2}b + \\ldots + b^{n-1})",
          solution: `$a = x$, $b = ${c}$, $n = ${n}$\nČlen z $x^{${k}}$: $${plus && e % 2 === 1 ? "-" : ""}x^{${k}} \\cdot ${c}^{${e}}$ (vsota eksponentov je $${n - 1}$${plus ? ", predznak se izmenjuje" : ""})\nKoeficient: $${coef}$`,
        };
      }
      if (t === 1) {
        // največji praštevilski delitelj a^k - 1 med danimi
        const [base, k] = r.pick([[2, 6], [2, 8], [2, 9], [2, 10], [2, 12], [3, 4], [3, 6], [5, 4], [2, 15]]);
        const N = base ** k - 1;
        const D = [...new Set(primeFactors(N))];
        const PR = range(2, 100).filter(isPrime);
        const ans = r.pick(D.filter((p) => p > 3 && p < 100));
        if (!ans) return null;
        const bigger = r.shuffle(PR.filter((p) => p > ans && !D.includes(p))).slice(0, r.int(1, 2));
        const smaller = r.shuffle(PR.filter((p) => p < ans)).slice(0, 4 - 1 - bigger.length);
        if (!bigger.length) return null;
        const list = sortV([ans, ...bigger, ...smaller]);
        const half = k % 2 === 0;
        const m = half ? k / 2 : k / 3;
        const A1 = base ** m - 1;
        const A2 = half ? base ** m + 1 : base ** (2 * m) + base ** m + 1;
        const divL = list.filter((p) => N % p === 0);
        return {
          text: `Katero je največje izmed praštevil $${list.join(", ")}$, ki deli število $${base}^{${k}} - 1$? Pomagaj si z razcepom razlike potenc.`,
          answer: num(ans, null, [
            { value: Math.max(...bigger), why: "Tega praštevila nisi preveril: razstavi število na faktorje in preveri vsakega." },
            { value: Math.min(...divL), why: "To praštevilo res deli dano število, ni pa največje med danimi." },
          ]),
          hint: half ? `$${base}^{${k}} - 1 = (${base}^{${m}})^2 - 1$ je razlika kvadratov.` : `$${base}^{${k}} - 1 = (${base}^{${m}})^3 - 1$ je razlika kubov.`,
          data: { given: [`N = ${base}^{${k}} - 1`], find: ["\\text{največji praštevilski delitelj med danimi}"] },
          formula: half ? "a^2 - 1 = (a - 1)(a + 1)" : "a^3 - 1 = (a - 1)(a^2 + a + 1)",
          solution: `${half ? `$${base}^{${k}} - 1 = (${base}^{${m}} - 1)(${base}^{${m}} + 1)$` : `$${base}^{${k}} - 1 = (${base}^{${m}} - 1)(${base}^{${2 * m}} + ${base}^{${m}} + 1)$`} $= ${A1} \\cdot ${A2}$\n${[A1, A2].filter((v) => !isPrime(v)).map((v) => `$${v} = ${factT(v)}$`).join(", ") || `Oba faktorja sta praštevili.`}\nPraštevilski delitelji: $${D.join(", ")}$\nMed danimi praštevili delijo $${divL.join(", ")}$, največje je $${ans}$.`,
        };
      }
      // izbira: kaj zagotovo deli a^n - b^n
      const a = r.int(5, 11);
      const b = r.int(2, a - 2);
      const c = pickAns(r, String(a - b), [
        [String(a + b), `Število $a + b$ deli $a^n - b^n$ le pri sodem $n$; pri $n = 1$ dobiš $${a - b}$, ki ni večkratnik števila $${a + b}$.`],
        [String(a * b), `Pri $n = 1$ dobiš $${a} - ${b} = ${a - b}$, ki ni večkratnik števila $${a * b}$.`],
        [String(a * a + b * b), `Pri $n = 1$ dobiš $${a - b}$, kar je manj kot $${a * a + b * b}$, zato ga to število ne deli.`],
      ]);
      return {
        text: `Katero od števil zagotovo deli $${a}^n - ${b}^n$ za vsako naravno število $n$?`,
        answer: c,
        hint: "Kateri faktor se v razcepu $a^n - b^n$ pojavi pri vsakem $n$?",
        data: { given: [`a^n - b^n = ${a}^n - ${b}^n`], find: ["\\text{delitelj za vsak } n"] },
        formula: "a^n - b^n = (a - b)(a^{n-1} + a^{n-2}b + \\ldots + b^{n-1})",
        solution: `Za vsak $n$ velja $${a}^n - ${b}^n = (${a} - ${b})(\\ldots)$, drugi faktor je celo število.\nZato $${a - b}$ deli $${a}^n - ${b}^n$ za vsak $n$.\nPri $n = 1$ je vrednost $${a - b}$, zato nobeno drugo ponujeno število ne deli vseh.`,
      };
    },
  },

  // ---------------- enačbe, neenačbe in sistemi s parametrom ----------------
  {
    id: P + "parameter",
    topics: [T("enacbe-neenacbe-in-sistemi-s-parametrom")],
    gen(level, r) {
      const FE = ["ax = b,\\ a \\ne 0: x = \\frac{b}{a}", "a = 0,\\ b \\ne 0: \\text{ni rešitve}", "a = 0,\\ b = 0: x \\in \\mathbb{R}"];
      const FN = ["ax > b,\\ a > 0: x > \\frac{b}{a}", "ax > b,\\ a < 0: x < \\frac{b}{a}"];
      const mT = (c, form) => (form === 0 ? `${mc(c)}` : form === 1 ? `${c} - m` : `m ${sg(c)}`);
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const a = r.nonZero(-5, 5);
          const tt = r.nonZero(-6, 6);
          const d = a * tt;
          const c = r.int(1, 6);
          const form = r.int(0, 2);
          const M = form === 0 ? a + c : form === 1 ? c - a : a - c;
          const rel = r.pick(["<", "<=", ">", ">="]);
          const relR = a > 0 ? rel : FLIP[rel];
          const opt = (rl, v) => `x ${REL[rl]} ${v}`;
          const ch = pickAns(r, opt(relR, tt), [
            [opt(FLIP[relR], tt), a < 0 ? "Deliš z negativnim številom, zato se znak neenačbe obrne." : "Znak neenačbe se obrne le pri deljenju z negativnim številom."],
            [opt(relR, -tt), "Pri deljenju pazi na predznak količnika."],
            [opt(FLIP[relR], -tt), "Preveri predznak količnika in smer neenačbe."],
          ]);
          return {
            text: `Reši neenačbo $(${mT(c, form)})x ${REL[rel]} ${d}$ za $m = ${M}$.`,
            answer: ch,
            options_tex: true,
            hint: "Vstavi vrednost parametra in izračunaj koeficient pred $x$. Pazi na njegov predznak.",
            data: { given: [`m = ${M}`], find: ["x"] },
            formula: FN,
            solution: `Za $m = ${M}$: $${mT(c, form).replace("m", pt(M))} = ${a}$, neenačba je $${a}x ${REL[rel]} ${d}$.\n${a < 0 ? `Delimo z negativnim številom $${a}$, znak se obrne.` : `Delimo s pozitivnim številom $${a}$, znak ostane.`}\n$x ${REL[relR]} ${tt}$`,
          };
        }
        if (t === 1) {
          const k = r.pick([1, 1, 2, 3]);
          const c = k * r.nonZero(-4, 5);
          const b1 = r.int(-6, 6);
          const b2 = r.int(-6, 6);
          if (b1 === b2) return null;
          const km = k === 1 ? "" : `${k}`;
          const E = `${km}mx${b1 ? ` ${sg(b1)}` : ""} = ${lin([c], ["x"])}${b2 ? ` ${sg(b2)}` : ""}`;
          return {
            text: `Za katero vrednost parametra $m$ enačba $${E}$ nima rešitve?`,
            answer: num(c / k, null, [
              { value: -c / k, why: `Člen $${lin([c], ["x"])}$ prenesi na levo stran: dobiš $(${k === 1 ? "" : k}${mc(c)})x$.` },
              k > 1 ? { value: c, why: `Koeficient pred $x$ je $${k}${mc(c)}$: enačbo $${k}m = ${c}$ še deli s številom $${k}$.` } : null,
              { value: b2 - b1, why: "Enačba nima rešitve, ko je koeficient pred $x$ enak $0$, desna stran pa ne." },
            ]),
            hint: "Člene z $x$ prenesi na levo, števila na desno. Kdaj enačba oblike $ax = b$ nima rešitve?",
            data: { given: [E], find: ["m"] },
            formula: FE,
            solution: `$(${km}${mc(c)})x = ${b2 - b1}$\nRešitve ni, ko je $${km}${mc(c)} = 0$ in desna stran $${b2 - b1} \\ne 0$.\n$m = ${tx(c / k)}$`,
          };
        }
        const m = r.int(-5, 6);
        const s = r.nonZero(-4, 4);
        const c = r.int(-4, 4);
        const b = r.int(-6, 6);
        if (m === c || b === 0) return null;
        const e = m * s - b - c * s;
        const lhs = `mx ${sg(-b)}`;
        const rhs = c === 0 ? tx(e) : `${lin([c], ["x"])}${e ? ` ${sg(e)}` : ""}`;
        return {
          text: `Za katero vrednost parametra $m$ je $x = ${s}$ rešitev enačbe $${lhs} = ${rhs}$?`,
          answer: num(m, null, [
            { value: (c * s + e - b) / s, why: "Pri prenosu števila na drugo stran mu spremeni predznak." },
            { value: -m, why: `Pazi na predznak pri deljenju s številom $${s}$.` },
            { value: m * s, why: `Na koncu še deli s številom $${s}$.` },
          ]),
          hint: `Vstavi $x = ${s}$ v enačbo. Dobiš linearno enačbo za $m$.`,
          data: { given: [`${lhs} = ${rhs}`, `x = ${s}`], find: ["m"] },
          formula: "x = s \\text{ je rešitev} \\iff \\text{po vstavitvi enačba velja}",
          solution: `$m \\cdot ${pt(s)} ${sg(-b)} = ${c === 0 ? tx(e) : `${c} \\cdot ${pt(s)}${e ? ` ${sg(e)}` : ""}`}$\n$${lin([s], ["m"])} = ${c * s + e + b}$${s === 1 ? "" : `\n$m = ${m}$`}`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const u = r.int(-4, 4);
          const v = r.int(-4, 4);
          if (u === v) return null;
          const S = u + v;
          const Pr = u * v;
          const coef = `m^2 ${S ? `${-S > 0 ? "+" : "-"} ${Math.abs(S) === 1 ? "" : Math.abs(S)}m` : ""} ${Pr ? sg(Pr) : ""}`.replace(/\s+/g, " ").trim();
          const rhs = u === 0 ? "m" : `m ${sg(-u)}`;
          const askNone = r.next() < 0.6;
          const ansV = askNone ? v : u;
          return {
            text: `Za katero vrednost parametra $m$ ima enačba $(${coef})x = ${rhs}$ ${askNone ? "nobene rešitve" : "neskončno mnogo rešitev"}?`,
            answer: num(ansV, null, [
              { value: askNone ? u : v, why: askNone ? `Pri $m = ${u}$ je tudi desna stran $0$: dobiš $0 \\cdot x = 0$, kar velja za vsak $x$.` : `Pri $m = ${v}$ desna stran ni $0$: dobiš $0 \\cdot x = ${v - u}$, kar ne velja nikoli.` },
              { value: -ansV, why: "Ničli koeficienta preberi iz razcepa $(m - p)(m - q)$: pazi na predznak." },
            ]),
            zeroOk: true,
            hint: "Razstavi koeficient pred $x$. Za katere $m$ je enak $0$? Pri vsaki taki vrednosti preveri še desno stran.",
            data: { given: [`(${coef})x = ${rhs}`], find: ["m"] },
            formula: FE,
            solution: `$${coef} = ${u === 0 ? "m" : `(m ${sg(-u)})`}${v === 0 ? "m" : `(m ${sg(-v)})`}$, ničli $m = ${u}$ in $m = ${v}$.\n$m = ${u}$: $0 \\cdot x = 0$, rešitev je vsak $x \\in \\mathbb{R}$.\n$m = ${v}$: $0 \\cdot x = ${v - u}$, rešitve ni.\nOdgovor: $m = ${ansV}$`,
          };
        }
        if (t === 1) {
          const a1 = r.nonZero(-3, 3);
          const b1 = r.nonZero(-4, 4);
          const e1 = r.nonZero(-6, 6);
          const lam = r.pick([2, 3, -2, -1, -3]);
          const a2 = lam * a1;
          const none = r.next() < 0.5;
          const mv = lam * b1;
          if (none) {
            const e2 = lam * e1 + r.nonZero(-3, 3);
            const E1 = `${lin([a1, b1], ["x", "y"])} = ${e1}`;
            const E2 = `${lin([a2], ["x"])} + my = ${e2}`;
            return {
              text: `Za katero vrednost parametra $m$ sistem $${cases([E1, E2])}$ nima rešitve?`,
              answer: num(mv, null, [
                { value: b1, why: "Koeficienta morata biti sorazmerna kot pri $x$, ne enaka." },
                { value: -mv, why: `Razmerje koeficientov pri $x$ je $${a2} : ${pt(a1)} = ${lam}$: pazi na predznak.` },
                { value: (b1 * a1) / a2, why: "Razmerje vzemi v isti smeri: druga enačba proti prvi." },
              ]),
              hint: "Sistem nima rešitve, ko sta premici vzporedni in različni: koeficienta pri $x$ in $y$ sta v istem razmerju.",
              data: { given: [E1, E2], find: ["m"] },
              formula: "\\frac{a_2}{a_1} = \\frac{b_2}{b_1} \\ne \\frac{c_2}{c_1} \\Rightarrow \\text{ni rešitve}",
              solution: `Razmerje koeficientov pri $x$: $${a2} : ${pt(a1)} = ${lam}$\nPremici sta vzporedni, ko je $m = ${lam} \\cdot ${pt(b1)} = ${mv}$.\nDesni strani: $${lam} \\cdot ${pt(e1)} = ${lam * e1} \\ne ${e2}$, premici sta različni, sistem nima rešitve.`,
            };
          }
          const E1 = `${lin([a1, b1], ["x", "y"])} = ${e1}`;
          const E2 = `${lin([a2, mv], ["x", "y"])} = n`;
          return {
            text: `Sistem $${cases([E1, E2])}$ ima neskončno mnogo rešitev. Koliko je $n$?`,
            answer: num(lam * e1, null, [
              { value: e1, why: "Enačbi morata biti sorazmerni: tudi desno stran pomnoži z istim številom." },
              { value: -lam * e1, why: `Druga enačba je $${lam}$-kratnik prve: pazi na predznak.` },
              { value: e1 / lam, why: "Razmerje vzemi v pravi smeri: druga enačba je večkratnik prve." },
            ]),
            zeroOk: true,
            hint: "Neskončno rešitev pomeni, da je druga enačba večkratnik prve. S katerim številom pomnožiš prvo enačbo?",
            data: { given: [E1, E2], find: ["n"] },
            formula: "\\frac{a_2}{a_1} = \\frac{b_2}{b_1} = \\frac{c_2}{c_1} \\Rightarrow \\text{neskončno rešitev}",
            solution: `$${a2} : ${pt(a1)} = ${lam}$ in $${mv} : ${pt(b1)} = ${lam}$\nDruga enačba mora biti $${lam}$-kratnik prve.\n$n = ${lam} \\cdot ${pt(e1)} = ${lam * e1}$`,
          };
        }
        // predznak rešitve: (m - c)x = d, rešitev pozitivna
        const c = r.int(-4, 5);
        const d = r.nonZero(-9, 9);
        const lhs = c === 0 ? "mx" : `(${mc(c)})x`;
        const ans = d > 0 ? c + 1 : c - 1;
        return {
          text: `Rešitev enačbe $${lhs} = ${d}$ naj bo pozitivna. ${d > 0 ? "Katero je najmanjše" : "Katero je največje"} celo število $m$, pri katerem to velja?`,
          answer: num(ans, null, [
            { value: c, why: `Pri $m = ${c}$ je koeficient pred $x$ enak $0$ in enačba nima rešitve.` },
            { value: d > 0 ? c - 1 : c + 1, why: `Količnik $\\frac{${d}}{${mc(c)}}$ je pozitiven, ko imata števec in imenovalec isti predznak.` },
            { value: -ans, why: "Pazi na predznak pri prenosu člena $c$." },
          ]),
          zeroOk: true,
          hint: `Izrazi $x = \\frac{${d}}{${mc(c)}}$. Kdaj je ulomek pozitiven?`,
          data: { given: [`${lhs} = ${d}`], find: ["m"] },
          formula: "\\frac{p}{q} > 0 \\iff p, q \\text{ istega predznaka}",
          solution: `Za $m \\ne ${c}$: $x = \\frac{${d}}{${mc(c)}}$\nŠtevec je ${d > 0 ? "pozitiven" : "negativen"}, zato mora biti tudi $${mc(c)} ${d > 0 ? ">" : "<"} 0$, torej $m ${d > 0 ? ">" : "<"} ${c}$.\n${d > 0 ? "Najmanjše" : "Največje"} celo število: $m = ${ans}$`,
        };
      }
      // level 3
      const t = r.int(0, 2);
      if (t === 0) {
        // (m - c)x > m + e ima rešitev (t, ∞) ali (−∞, t): določi m
        const m = r.int(-6, 8);
        const c = r.int(-4, 4);
        const e = r.int(-6, 6);
        const a = m - c;
        if (a === 0 || (m + e) % a !== 0) return null;
        const tt = (m + e) / a;
        if (tt === 1) return null;
        const rel = r.pick([">", "<"]);
        const right = (a > 0) === (rel === ">");
        const iv = right ? `(${tt}, \\infty)` : `(-\\infty, ${tt})`;
        const L = c === 0 ? "mx" : `(${mc(c)})x`;
        const R = e === 0 ? "m" : `m ${sg(e)}`;
        return {
          text: `Za neko vrednost parametra $m$ je množica rešitev neenačbe $${L} ${rel} ${R}$ interval $${iv}$. Koliko je $m$?`,
          answer: num(m, null, [
            { value: (tt * c - e) / (tt - 1), why: "Pri preoblikovanju enačbe za $m$ pazi na predznake." },
            { value: a, why: `To je koeficient $${mc(c)}$. Iz njega izračunaj še $m$.` },
            { value: tt, why: "To je krajišče intervala, iščeš pa parameter $m$." },
          ]),
          zeroOk: true,
          hint: `Krajišče intervala je $\\frac{${R}}{${mc(c)}}$. Izenači ga z danim krajiščem in preveri smer neenačbe.`,
          data: { given: [`\\{x \\mid ${L} ${rel} ${R}\\} = ${iv}`], find: ["m"] },
          formula: FN,
          solution: `Krajišče: $\\frac{${R}}{${mc(c)}} = ${tt}$\n$${R} = ${tt}(${mc(c)})$, $${1 - tt === 1 ? "" : 1 - tt === -1 ? "-" : 1 - tt}m = ${-tt * c - e}$, $m = ${m}$\nPreizkus: $${lin([a], ["x"])} ${rel} ${m + e}$, ${a > 0 ? "delimo s pozitivnim številom" : "delimo z negativnim številom, znak se obrne"}: $x ${right ? ">" : "<"} ${tt}$, kar se ujema.`,
        };
      }
      if (t === 1) {
        // mx + k²y = kq, x + my = q
        const k = r.pick([2, 3, 4]);
        const q = r.nonZero(-5, 5);
        const askNone = r.next() < 0.5;
        const E1 = `mx + ${k * k}y = ${k * q}`;
        const E2 = `x + my = ${q}`;
        const ansV = askNone ? -k : k;
        return {
          text: `Za katero vrednost parametra $m$ ima sistem $${cases([E1, E2])}$ ${askNone ? "nobene rešitve" : "neskončno mnogo rešitev"}?`,
          answer: num(ansV, null, [
            { value: -ansV, why: askNone ? `Pri $m = ${k}$ je prva enačba $${k}$-kratnik druge: premici sovpadata in rešitev je neskončno.` : `Pri $m = ${-k}$ sta premici vzporedni in različni: rešitve ni.` },
            { value: k * k, why: `Pogoj je $m \\cdot m = ${k * k}$, torej $m^2 = ${k * k}$: izračunaj $m$.` },
            { value: k * q, why: "Primerjaj koeficiente pri neznankah, ne desnih strani." },
          ]),
          hint: "Iz druge enačbe izrazi $x$ in ga vstavi v prvo. Dobiš enačbo oblike $Ay = B$ s parametrom.",
          data: { given: [E1, E2], find: ["m"] },
          formula: FE,
          solution: `Iz druge enačbe: $x = ${q} - my$\nVstavimo v prvo: $m(${q} - my) + ${k * k}y = ${k * q}$, torej $(${k * k} - m^2)y = ${k * q} ${sg(-q)}m$\n$${k * k} - m^2 = 0$ za $m = \\pm ${k}$.\n$m = ${k}$: $0 \\cdot y = 0$, neskončno rešitev. $m = ${-k}$: $0 \\cdot y = ${2 * k * q}$, ni rešitve.\nOdgovor: $m = ${ansV}$`,
        };
      }
      const c = r.int(-3, 5);
      const d = r.pick([4, 6, 8, 9, 10, 12, 15, 16, 18, 20]);
      const tau = divisors(d).length;
      const L = c === 0 ? "mx" : `(${mc(c)})x`;
      return {
        text: `Za koliko celih števil $m$ ima enačba $${L} = ${d}$ celoštevilsko rešitev?`,
        answer: num(2 * tau, null, [
          { value: tau, why: "Upoštevaj tudi negativne delitelje: $m - c$ je lahko negativen." },
          { value: 2 * tau + 1, why: `Pri $m = ${c}$ enačba nima rešitve, zato te vrednosti ne štej.` },
          { value: 2 * tau - 2, why: `Tudi $\\pm 1$ in $\\pm ${d}$ sta delitelja števila $${d}$.` },
        ]),
        hint: `Za $m \\ne ${c}$ je $x = \\frac{${d}}{${mc(c)}}$. Kdaj je to celo število?`,
        data: { given: [`${L} = ${d}`], find: ["\\text{število celih } m"] },
        formula: "x = \\frac{d}{m - c} \\in \\mathbb{Z} \\iff (m - c) \\mid d",
        solution: `Za $m = ${c}$ rešitve ni; sicer je $x = \\frac{${d}}{${mc(c)}}$.\n$x$ je celo, ko je $${mc(c)}$ delitelj števila $${d}$: $\\pm ${divisors(d).join(", \\pm ")}$.\nTo je $2 \\cdot ${tau} = ${2 * tau}$ vrednosti za $${mc(c)}$, torej tudi za $m$.`,
      };
    },
  },

  // ---------------- Gaussova metoda in sistemi linearnih neenačb ----------------
  {
    id: P + "gauss-neenacbe",
    topics: [T("gaussova-metoda-in-sistemi-linearnih-neenacb")],
    gen(level, r) {
      const FG = ["\\text{trikotna oblika: odstrani } x \\text{ iz 2. in 3. enačbe, nato } y \\text{ iz 3.}", "\\text{nato vstavljaj nazaj: } z \\to y \\to x"];
      // Gaussova eliminacija za sistem s celimi koeficienti, 1. enačba ima pri x koeficient 1.
      function gauss(E) {
        const [e1, e2, e3] = E;
        const sub = (e, f, k) => e.map((v, i) => v - k * f[i]);
        const E2 = sub(e2, e1, e2[0]);
        const E3 = sub(e3, e1, e3[0]);
        if (E2[1] === 0) return null;
        let F = E3;
        let comb = "";
        if (E3[1] !== 0) {
          F = E3.map((v, i) => E2[1] * v - E3[1] * E2[i]);
          comb = `$${E2[1]} \\cdot (3') ${sg(-E3[1])} \\cdot (2')$: `;
        }
        if (F[2] === 0) return null;
        const z = F[3] / F[2];
        const y = (E2[3] - E2[2] * z) / E2[1];
        const x = e1[3] - e1[1] * y - e1[2] * z;
        const st = (e, k, i) => (k === 0 ? `${i}. enačba je brez $x$: $${eq3(e)}$ (${i}')` : `$(${i}) ${k === 1 ? "-" : k === -1 ? "+" : `${sg(-k)} \\cdot`} (1)$: $${eq3(e)}$ (${i}')`);
        const plus = (v) => (v ? ` ${sg(v)}` : "");
        const lines = [
          st(E2, e2[0], 2),
          st(E3, e3[0], 3),
          comb || F[2] !== 1 ? `${comb}$${eq3(F)}$, $z = ${z}$` : `Iz (3'): $z = ${z}$`,
          `Iz (2'): $${lin([E2[1]], ["y"])}${plus(E2[2] * z)} = ${E2[3]}$, $y = ${y}$`,
          `Iz (1): $x = ${e1[3]}${plus(-e1[1] * y)}${plus(-e1[2] * z)} = ${x}$`,
        ];
        return { x, y, z, lines };
      }
      function sys3(r, sol, firstOne = true) {
        for (let i = 0; i < 80; i++) {
          const rows = [];
          for (let j = 0; j < 3; j++) {
            const a = j === 0 && firstOne ? 1 : r.int(-3, 3);
            const b = r.nonZero(-3, 3);
            const c = r.int(-3, 3);
            rows.push([a, b, c, a * sol[0] + b * sol[1] + c * sol[2]]);
          }
          const G = gauss(rows);
          if (G && G.x === sol[0] && G.y === sol[1] && G.z === sol[2] && rows.every((e) => e.slice(0, 3).filter((v) => v !== 0).length >= 2)) return { rows, G };
        }
        return null;
      }
      // cela števila, ki zadoščajo pogoju na [-30, 30]
      const intsOk = (ok) => range(-30, 30).filter(ok);
      // neenačba ax + b REL c → x REL' meja (meja je celo število)
      function ineq(r) {
        const a = r.nonZero(-4, 5);
        const bound = r.int(-6, 7);
        const b = r.int(-8, 8);
        const rel = r.pick(["<", "<=", ">", ">="]);
        const c = a * bound + b;
        const relX = a > 0 ? rel : FLIP[rel];
        return { a, b, c, rel, bound, relX, ok: (x) => holds(a * x + b, c, rel), tex: `${ax(a, b)} ${REL[rel]} ${c}` };
      }
      function ineqPair(r, needNeg) {
        for (let i = 0; i < 80; i++) {
          const A = ineq(r);
          const B = ineq(r);
          if (needNeg && A.a > 0 && B.a > 0) continue;
          if (!needNeg && (A.a < 0 || B.a < 0)) continue;
          const up = (q) => q.relX === "<" || q.relX === "<=";
          if (up(A) === up(B)) continue;
          const ks = intsOk((x) => A.ok(x) && B.ok(x));
          if (ks.length < 2 || ks.length > 12) continue;
          return { A, B, ks };
        }
        return null;
      }
      const ineqSteps = (q) =>
        [q.tex, q.b ? `${lin([q.a], ["x"])} ${REL[q.rel]} ${q.c - q.b}` : null, q.a === 1 ? null : `x ${REL[q.relX]} ${q.bound}`]
          .filter(Boolean)
          .map((s) => `$${s}$`)
          .join(" → ") + (q.a < 0 ? " (deljenje z negativnim številom obrne znak)" : "");
      // napačni štetji: krajišči vključeni oz. izključeni
      const offBy = (P) => {
        const lo = Math.min(...[P.A, P.B].map((q) => q.bound));
        const hi = Math.max(...[P.A, P.B].map((q) => q.bound));
        return [hi - lo + 1, hi - lo - 1, hi - lo];
      };
      if (level === 1) {
        const t = r.int(0, 2);
        if (t === 0) {
          const x = r.int(-4, 5);
          const y = r.int(-4, 5);
          const z = r.nonZero(-4, 4);
          const a = r.nonZero(-3, 3);
          const b = r.nonZero(-3, 3);
          const c = r.nonZero(-3, 3);
          const k = r.pick([1, 2, 3]);
          const E1 = [1, a, b, x + a * y + b * z];
          const E2 = [0, 1, c, y + c * z];
          const E3 = [0, 0, k, k * z];
          const ask = r.pick(["x", "y"]);
          const val = ask === "x" ? x : y;
          return {
            text: `Sistem $${cases([eq3(E1), eq3(E2), eq3(E3)])}$ je že v trikotni obliki. Koliko je $${ask}$?`,
            answer: num(val, null, [
              { value: ask === "x" ? E1[3] + a * y + b * z : E2[3] + c * z, why: "Ko člen preneseš na drugo stran enačbe, mu spremeni predznak." },
              { value: ask === "x" ? y : z, why: `To je vrednost druge neznanke. Iščeš $${ask}$.` },
              { value: ask === "x" ? E1[3] - a * y : E2[3] - c * k * z, why: ask === "x" ? "Vstaviti moraš obe že znani neznanki, $y$ in $z$." : "Vstavi vrednost $z$, ne $kz$." },
            ]),
            zeroOk: true,
            hint: "Začni pri zadnji enačbi: izračunaj $z$, ga vstavi v drugo enačbo in nadaljuj navzgor.",
            data: { given: [eq3(E1), eq3(E2), eq3(E3)], find: [ask] },
            formula: FG[1],
            solution: `Iz 3. enačbe: $z = ${z}$\nIz 2. enačbe: $y = ${E2[3]} ${sg(-c)} \\cdot ${pt(z)} = ${y}$${ask === "x" ? `\nIz 1. enačbe: $x = ${E1[3]}${y ? ` ${sg(-a * y)}` : ""} ${sg(-b * z)} = ${x}$` : ""}`,
          };
        }
        if (t === 1) {
          const Pq = ineqPair(r, false);
          if (!Pq) return null;
          const { A, B, ks } = Pq;
          return {
            text: `Koliko celih števil reši sistem neenačb $${A.tex}$ in $${B.tex}$?`,
            answer: num(ks.length, null, offBy(Pq).map((v) => ({ value: v, why: "Preveri krajišči: pri $<$ in $>$ krajišče ni rešitev, pri $\\le$ in $\\ge$ je." }))),
            hint: "Reši vsako neenačbo posebej in rešitvi nariši na isto številsko premico. Rešitev sistema je presek.",
            data: { given: [`M_1 = \\{x \\mid ${A.tex}\\}`, `M_2 = \\{x \\mid ${B.tex}\\}`], find: ["|M_1 \\cap M_2 \\cap \\mathbb{Z}|"] },
            formula: "\\text{rešitev sistema} = \\text{presek rešitev}",
            solution: `${ineqSteps(A)}\n${ineqSteps(B)}\nCela števila v preseku: $${ks.join(", ")}$, teh je $${ks.length}$.`,
          };
        }
        const x0 = r.int(-3, 4);
        const y0 = r.int(-3, 4);
        const mk = () => {
          const a = r.nonZero(-3, 3);
          const b = r.nonZero(-2, 2);
          const rel = r.pick(["<", "<=", ">", ">="]);
          const c = a * x0 + b * y0 + r.int(-3, 3);
          return { tex: `${lin([a, b], ["x", "y"])} ${REL[rel]} ${c}`, ok: holds(a * x0 + b * y0, c, rel), val: a * x0 + b * y0, a, b, c, rel };
        };
        const I1 = mk();
        const I2 = mk();
        const key = I1.ok && I2.ok ? 0 : !I1.ok && I2.ok ? 1 : I1.ok && !I2.ok ? 2 : 3;
        // Možnosti se izključujejo (pri key = 3 bi bila »ne zadošča prvi« tudi resnična).
        const O = ["Da, zadošča obema neenačbama.", "Ne, zadošča le drugi neenačbi.", "Ne, zadošča le prvi neenačbi.", "Ne, ne zadošča nobeni neenačbi."];
        const W = [
          "Točka ne zadošča vsaj eni neenačbi: vstavi koordinati v obe in primerjaj.",
          I1.ok ? "Prva neenačba je izpolnjena: vstavi koordinati še enkrat in pazi na strogost znaka." : "Tudi druga neenačba ni izpolnjena: vstavi koordinati še enkrat in pazi na strogost znaka.",
          I2.ok ? "Druga neenačba je izpolnjena: vstavi koordinati še enkrat in pazi na strogost znaka." : "Tudi prva neenačba ni izpolnjena: vstavi koordinati še enkrat in pazi na strogost znaka.",
          "Vsaj ena neenačba je izpolnjena: preveri vsako posebej.",
        ];
        const c = pickAns(r, O[key], O.map((o, i) => [o, W[i]]).filter((_, i) => i !== key));
        const sub = (I) => `$${I.a} \\cdot ${pt(x0)} ${sg(I.b)} \\cdot ${pt(y0)} = ${I.val}$, $${I.val} ${REL[I.rel]} ${I.c}$ ${I.ok ? "velja" : "ne velja"}`;
        return {
          text: `Ali točka $T(${x0}, ${y0})$ zadošča sistemu neenačb $${I1.tex}$ in $${I2.tex}$?`,
          answer: c,
          hint: "Vstavi koordinati točke v vsako neenačbo posebej in preveri, ali neenačba drži.",
          data: { given: [`T = (${x0}, ${y0})`], find: ["T \\text{ v rešitvi?}"] },
          formula: "\\text{točka je rešitev sistema} \\iff \\text{zadošča vsem neenačbam}",
          solution: `1. neenačba: ${sub(I1)}.\n2. neenačba: ${sub(I2)}.\n${key === 0 ? "Točka zadošča obema, zato je rešitev sistema." : "Točka ni rešitev sistema."}`,
        };
      }
      if (level === 2) {
        const t = r.int(0, 2);
        if (t === 0) {
          const sol = [r.int(-4, 5), r.int(-4, 5), r.int(-4, 5)];
          const S = sys3(r, sol);
          if (!S) return null;
          const ask = r.pick(["x", "y", "z", "s"]);
          const val = ask === "s" ? sol[0] + sol[1] + sol[2] : sol[XYZ.indexOf(ask)];
          const others = XYZ.map((v, i) => ({ v, val: sol[i] })).filter((o) => o.v !== ask);
          return {
            text: `Z Gaussovo metodo reši sistem $${cases(S.rows.map(eq3))}$. ${ask === "s" ? "Koliko je $x + y + z$?" : `Koliko je $${ask}$?`}`,
            answer: num(val, null, [
              ...others.slice(0, 2).map((o) => ({ value: o.val, why: `To je vrednost neznanke $${o.v}$.` })),
              ask === "s" ? { value: sol[0] + sol[1] - sol[2], why: "Preveri predznake pri seštevanju." } : { value: -val, why: "Ko člen preneseš na drugo stran, mu spremeni predznak." },
            ]),
            zeroOk: true,
            hint: "S prvo enačbo odstrani $x$ iz druge in tretje enačbe. Nato iz novih dveh enačb odstrani $y$.",
            data: { given: S.rows.map(eq3), find: [ask === "s" ? "x + y + z" : ask] },
            formula: FG,
            solution: `${S.G.lines.join("\n")}${ask === "s" ? `\n$x + y + z = ${sol[0]} ${sg(sol[1])} ${sg(sol[2])} = ${val}$` : ""}`,
          };
        }
        if (t === 1) {
          const Pq = ineqPair(r, true);
          if (!Pq) return null;
          const { A, B, ks } = Pq;
          const askSum = r.next() < 0.5;
          const sum = ks.reduce((s, k) => s + k, 0);
          const lo = Math.min(A.bound, B.bound);
          const hi = Math.max(A.bound, B.bound);
          const sumR = (u, v) => range(u, v).reduce((s, k) => s + k, 0);
          return {
            text: `Reši sistem neenačb $${A.tex}$ in $${B.tex}$. ${askSum ? "Koliko je vsota vseh celih rešitev?" : "Koliko celih števil reši sistem?"}`,
            answer: num(askSum ? sum : ks.length, null, askSum
              ? [
                  { value: sumR(lo, hi), why: "Preveri krajišči: pri strogi neenačbi krajišče ni rešitev." },
                  { value: sumR(lo + 1, hi - 1), why: "Pri $\\le$ in $\\ge$ je krajišče rešitev." },
                ]
              : offBy(Pq).map((v) => ({ value: v, why: "Preveri krajišči: pri strogi neenačbi krajišče ni rešitev, pri $\\le$ in $\\ge$ je." }))),
            zeroOk: askSum,
            hint: "Pri deljenju z negativnim številom se znak neenačbe obrne. Rešitev sistema je presek obeh rešitev.",
            data: { given: [`M_1 = \\{x \\mid ${A.tex}\\}`, `M_2 = \\{x \\mid ${B.tex}\\}`], find: [askSum ? "\\text{vsota celih rešitev}" : "\\text{število celih rešitev}"] },
            formula: ["ax < b,\\ a < 0 \\Rightarrow x > \\frac{b}{a}", "\\text{rešitev sistema} = \\text{presek rešitev}"],
            solution: `${ineqSteps(A)}\n${ineqSteps(B)}\nCela števila v preseku: $${ks.join(", ")}$${askSum ? `, vsota je $${sum}$` : `, teh je $${ks.length}$`}.`,
          };
        }
        // koliko danih točk zadošča sistemu
        const a = r.nonZero(-2, 2);
        const c = r.int(-2, 3);
        const k = r.int(2, 6);
        const rel1 = r.pick([">", ">="]);
        const rel2 = r.pick(["<", "<="]);
        const ok = (p) => holds(p[1], a * p[0] + c, rel1) && holds(p[0] + p[1], k, rel2);
        const pts = [];
        for (let i = 0; i < 40 && pts.length < 4; i++) {
          const p = [r.int(-3, 4), r.int(-3, 5)];
          if (!pts.some((q) => q[0] === p[0] && q[1] === p[1])) pts.push(p);
        }
        const cnt = pts.filter(ok).length;
        if (cnt === 0 || cnt === 4) return null;
        const L = ["A", "B", "C", "D"];
        const I1 = `y ${REL[rel1]} ${ax(a, c)}`;
        const I2 = `x + y ${REL[rel2]} ${k}`;
        const ptT = pts.map((p, i) => `${L[i]}(${p[0]}, ${p[1]})`).join(", ");
        const loose = pts.filter((p) => holds(p[1], a * p[0] + c, ">=") && holds(p[0] + p[1], k, "<=")).length;
        const either = pts.filter((p) => holds(p[1], a * p[0] + c, rel1) || holds(p[0] + p[1], k, rel2)).length;
        return {
          text: `Koliko izmed točk $${ptT}$ zadošča sistemu neenačb $${I1}$ in $${I2}$?`,
          answer: num(cnt, null, [
            { value: loose, why: "Pri strogi neenačbi točka na robu (enakost) ni rešitev." },
            { value: either, why: "Točka mora zadoščati obema neenačbama hkrati, ne le eni." },
          ]),
          hint: "Za vsako točko vstavi koordinati v obe neenačbi.",
          data: { given: [`M = \\{(x, y) \\mid ${I1},\\ ${I2}\\}`], find: ["\\text{število danih točk v } M"] },
          formula: "\\text{rešitev sistema} = \\text{presek polravnin}",
          solution: `${pts.map((p, i) => `$${L[i]}$: $${p[1]} ${REL[rel1]} ${a * p[0] + c}$ ${holds(p[1], a * p[0] + c, rel1) ? "velja" : "ne velja"}, $${p[0] + p[1]} ${REL[rel2]} ${k}$ ${holds(p[0] + p[1], k, rel2) ? "velja" : "ne velja"}`).join("\n")}\nSistemu ${cnt === 1 ? "zadošča" : cnt === 2 ? "zadoščata" : "zadoščajo"} $${cnt}$ ${cnt === 1 ? "točka" : cnt === 2 ? "točki" : "točke"}.`,
        };
      }
      // level 3
      const t = r.int(0, 2);
      if (t === 0) {
        // besedilna naloga: vstopnice
        const prices = [r.int(3, 6), r.int(7, 10), r.int(11, 15)];
        const names = ["otroška", "dijaška", "odrasla"];
        const fam = ["Novakovi", "Kovačevi", "Horvatovi"];
        for (let i = 0; i < 60; i++) {
          const rows = [[1, r.int(0, 3), r.int(1, 2)], [r.int(0, 3), r.int(1, 3), r.int(0, 2)], [r.int(0, 3), r.int(0, 2), r.int(1, 3)]];
          const E = rows.map((rw) => [...rw, rw[0] * prices[0] + rw[1] * prices[1] + rw[2] * prices[2]]);
          const G = gauss(E);
          if (!G || G.x !== prices[0] || G.y !== prices[1] || G.z !== prices[2]) continue;
          const KIND = ["otroške", "dijaške", "odrasle"];
          const buy = (rw) => rw.slice(0, 3).map((n, j) => (n ? `${KIND[j]}: $${n}$` : null)).filter(Boolean).join(", ");
          const lines = E.map((rw, j) => `${fam[j]} so za vstopnice (${buy(rw)}) plačali $${rw[3]}$ €.`);
          const ask = r.int(0, 2);
          return {
            text: `Na koncertu prodajajo otroške, dijaške in odrasle vstopnice. ${lines.join(" ")} Koliko evrov stane ${names[ask]} vstopnica?`,
            answer: { ...num(prices[ask], null, prices.map((p, j) => ({ value: p, why: `To je cena ${KIND[j]} vstopnice.` })).filter((_, j) => j !== ask), "€"), unitAlternatives: ["eur", "evrov", "evra", "evre"] },
            hint: "Označi cene z $x$, $y$, $z$ in zapiši tri enačbe. Sistem reši z Gaussovo metodo.",
            data: { given: E.map((rw, j) => `\\text{${fam[j]}: } ${eq3(rw)}`), find: [["x", "y", "z"][ask]] },
            formula: FG,
            solution: `$x$, $y$, $z$ so cene otroške, dijaške in odrasle vstopnice (v €).\nSistem: $${cases(E.map(eq3))}$\n${G.lines.join("\n")}\n${names[ask][0].toUpperCase() + names[ask].slice(1)} vstopnica stane $${prices[ask]}$ €.`,
          };
        }
        return null;
      }
      if (t === 1) {
        // cele točke v trikotniku x ≥ 0, y ≥ 0, ax + by REL c
        const a = r.pick([1, 1, 2, 3]);
        const b = r.pick([1, 2, 3]);
        const c = r.int(4, 9);
        const rel = r.pick(["<", "<="]);
        const ptsIn = (rl, strictAxes) => {
          let n = 0;
          for (let x = 0; x <= c; x++) for (let y = 0; y <= c; y++) if ((!strictAxes || (x > 0 && y > 0)) && holds(a * x + b * y, c, rl)) n++;
          return n;
        };
        const val = ptsIn(rel, false);
        const I = `${lin([a, b], ["x", "y"])} ${REL[rel]} ${c}`;
        const rows = [];
        for (let x = 0; a * x <= c; x++) {
          const ys = range(0, c).filter((y) => holds(a * x + b * y, c, rel));
          if (ys.length) rows.push(`$x = ${x}$: $y \\in \\{${ys.join(", ")}\\}$, ${sk(ys.length, "točka", "točki", "točke", "točk")}`);
        }
        return {
          text: `Koliko točk s celima koordinatama zadošča sistemu neenačb $x \\ge 0$, $y \\ge 0$ in $${I}$?`,
          answer: num(val, null, [
            { value: ptsIn(rel, true), why: "Točke na koordinatnih oseh ($x = 0$ ali $y = 0$) zadoščajo pogojema $x \\ge 0$, $y \\ge 0$." },
            { value: ptsIn(rel === "<" ? "<=" : "<", false), why: rel === "<" ? "Pri strogi neenačbi točke na robni premici niso rešitve." : "Pri $\\le$ so točke na robni premici rešitve." },
          ]),
          hint: "Za vsako celo vrednost $x$ od $0$ naprej preštej, koliko celih $y$ ustreza.",
          data: { given: [`M = \\{(x, y) \\mid x \\ge 0,\\ y \\ge 0,\\ ${I}\\}`], find: ["\\text{število celih točk v } M"] },
          formula: "\\text{rešitev sistema} = \\text{presek polravnin}",
          solution: `${rows.join("\n")}\nSkupaj: ${sk(val, "točka", "točki", "točke", "točk")}.`,
        };
      }
      // sistem z ulomki
      for (let i = 0; i < 60; i++) {
        const k1 = r.pick([2, 3]);
        const lo = r.int(-6, 2);
        const p = r.nonZero(-3, 3);
        // 1. neenačba: (x - p)/k1 REL1 (lo - p)/k1 → x REL1 lo
        const q1 = lo - p;
        if (q1 % k1 !== 0) continue;
        const rel1 = r.pick([">", ">="]);
        const hi = lo + r.int(3, 9);
        // 2. neenačba: s - x/k2 REL2 s - hi/k2 (deljenje z -1/k2 obrne znak) → x REL hi
        const k2 = r.pick([2, 3, 4]);
        if (hi % k2 !== 0) continue;
        const s = r.int(1, 5);
        const rel2 = r.pick([">", ">="]); // s - x/k2 > s - hi/k2 ⟺ x < hi
        const R2 = s - hi / k2;
        const ok = (x) => holds(x, lo, rel1) && holds(-x, -hi, rel2);
        const ks = range(lo - 2, hi + 2).filter(ok);
        if (ks.length < 2) continue;
        const askSum = r.next() < 0.5;
        const sum = ks.reduce((u, v) => u + v, 0);
        const T1 = `\\frac{x ${sg(-p)}}{${k1}} ${REL[rel1]} ${q1 / k1}`;
        const T2 = `${s} - \\frac{x}{${k2}} ${REL[rel2]} ${R2}`;
        const relX2 = FLIP[rel2];
        const closed = range(lo, hi);
        const open = range(lo + 1, hi - 1);
        const agg = (xs) => (askSum ? xs.reduce((u, v) => u + v, 0) : xs.length);
        return {
          text: `Reši sistem neenačb $${T1}$ in $${T2}$. ${askSum ? "Koliko je vsota vseh celih rešitev?" : "Koliko celih števil reši sistem?"}`,
          answer: num(agg(ks), null, [
            { value: agg(closed), why: "Preveri krajišči: pri strogi neenačbi krajišče ni rešitev." },
            { value: agg(open), why: "Pri $\\le$ in $\\ge$ je krajišče rešitev." },
          ]),
          zeroOk: askSum,
          hint: `Obe neenačbi pomnoži, da se znebiš ulomkov. Pri množenju z negativnim številom se znak obrne.`,
          data: { given: [`M_1 = \\{x \\mid ${T1}\\}`, `M_2 = \\{x \\mid ${T2}\\}`], find: [askSum ? "\\text{vsota celih rešitev}" : "\\text{število celih rešitev}"] },
          formula: ["\\cdot (-k): \\text{ znak se obrne}", "\\text{rešitev sistema} = \\text{presek rešitev}"],
          solution: `1. neenačba: $x ${sg(-p)} ${REL[rel1]} ${q1}$, $x ${REL[rel1]} ${lo}$\n2. neenačba: $-\\frac{x}{${k2}} ${REL[rel2]} ${R2 - s}$, pomnožimo z $-${k2}$: $x ${REL[relX2]} ${hi}$\nCela števila: $${ks.join(", ")}$${askSum ? `, vsota je $${sum}$` : `, teh je $${ks.length}$`}.`,
        };
      }
      return null;
    },
  },
];

export const MATURA_MAT_SS1 = wrapGens(GENS);
