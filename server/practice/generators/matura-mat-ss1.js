// Generatorji za teme 1. letnika gimnazije, ki jih zahteva maturitetna pot (MAT-SS-1): kartezični produkt in
// potenčna množica, dvojiški sestav, približki in napake, vsota in razlika potenc, enačbe in sistemi s parametrom,
// Gaussova metoda in sistemi linearnih neenačb ter linearne enačbe, linearna funkcija in linearne neenačbe.
// Merila: docs/kakovost.md §2. Vsi rezultati so izračunani v kodi iz istih števil, ki jih vidi dijak. Izvirne naloge, ne prepisane maturitetne. Zapisi kot v lekcijah MAT-SS-1
// (|A × B|, \mathcal{P}(A), 1011_{(2)}, \bar{x}, \Delta x, \delta x).
import { g } from "../rng.js";
import { roundHalfUp } from "../check.js";
import { tx } from "./mat.js";
import { fr, num, frA, ft, sg, pickAns, name, wrapGens } from "./matura-util.js";

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
    topics: [T("kartezicni-produkt-in-potencna-mnozica"), "MAT-SS-2/mesane-naloge-1-in-2-letnika", "MAT-SS-4/vadbena-maturitetna-pola"],
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
    topics: [T("dvojiski-stevilski-sestav"), "MAT-SS-2/mesane-naloge-1-in-2-letnika", "MAT-SS-4/vadbena-maturitetna-pola"],
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
    topics: [T("priblizki-ter-absolutna-in-relativna-napaka"), "MAT-SS-2/mesane-naloge-1-in-2-letnika", "MAT-SS-4/vadbena-maturitetna-pola"],
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
    topics: [T("razstavljanje-vsote-in-razlike-potenc"), "MAT-SS-2/mesane-naloge-1-in-2-letnika", "MAT-SS-4/vadbena-maturitetna-pola"],
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
    topics: [T("enacbe-neenacbe-in-sistemi-s-parametrom"), "MAT-SS-2/mesane-naloge-1-in-2-letnika", "MAT-SS-4/vadbena-maturitetna-pola"],
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
    topics: [T("gaussova-metoda-in-sistemi-linearnih-neenacb"), "MAT-SS-2/mesane-naloge-1-in-2-letnika", "MAT-SS-4/vadbena-maturitetna-pola"],
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

// ================= linearne enačbe, linearna funkcija in linearne neenačbe (maturitetna raven) =================
// Vsaka naloga je sestavljena od rešitve nazaj (izberemo x0, nato koeficiente), zato so rešitve »lepe«,
// a račun ni trivialen. Intervali kot v lekciji MAT-SS-1/linearne-neenacbe: (-\infty, a], krajišča kot ulomki.
const VR = "(višja raven) ";
const gcdI = (a, b) => (b ? gcdI(b, a % b) : Math.abs(a));
const lcmI = (...xs) => xs.reduce((a, b) => (a * b) / gcdI(a, b));
// Odgovor kot celo število ali okrajšan ulomek.
const qA = (n, d, ms = []) => {
  const [a, b] = fr(n, d);
  return b === 1 ? num(a, null, ms) : frA(a, b, ms);
};
const qT = (n, d = 1) => ft(n, d);
// k·x z ulomljenim koeficientom: kxT(-2, 3) → "-\frac{2}{3}x".
function kxT(p, q = 1, v = "x") {
  const [a, b] = fr(p, q);
  if (b === 1) return lin([a], [v]);
  return `${a < 0 ? "-" : ""}\\frac{${Math.abs(a)}}{${b}}${v}`;
}
const fT = (p, q, n) => `${kxT(p, q)}${n ? ` ${sg(n)}` : ""}`;
// Člen z x s predznakom za nadaljevanje izraza: tX(-3) → "- 3x", tX(1) → "+ x".
const tX = (c, v = "x") => (c < 0 ? `- ${lin([-c], [v])}` : `+ ${lin([c], [v])}`);
// Koeficient pred x, tudi 0: lhsX(0) → "0 \cdot x".
const lhsX = (c) => (c === 0 ? "0 \\cdot x" : lin([c], ["x"]));
const xm = (p) => `x ${sg(-p)}`;
const mul = (k, inner) => (k === 1 ? `(${inner})` : `${k}(${inner})`);
const INF = "\\infty";
// Interval rešitev neenačbe »x rel e«, e = n/d.
function ivT(rel, n, d = 1) {
  const e = qT(n, d);
  return rel === "<" ? `(-${INF}, ${e})` : rel === "<=" ? `(-${INF}, ${e}]` : rel === ">" ? `(${e}, ${INF})` : `[${e}, ${INF})`;
}
const STRICT = { "<": "<=", "<=": "<", ">": ">=", ">=": ">" };
const WHY_FLIP_NEG = "Pri deljenju z negativnim številom se znak neenačbe obrne.";
const WHY_FLIP_POS = "Znak neenačbe se obrne le pri množenju ali deljenju z negativnim številom.";
const WHY_BR = (rel) => (rel.length === 1 ? "Pri strogi neenačbi krajišče ni rešitev: tam je okrogel oklepaj." : "Pri $\\le$ ali $\\ge$ je krajišče rešitev: tam je oglati oklepaj.");
// Napačni intervali: obrnjena smer, napačen oklepaj, napačen predznak krajišča.
const ivWrong = (rel, n, d, neg) => [
  [ivT(FLIP[rel], n, d), neg ? "Znak neenačbe se je pri deljenju z negativnim številom obrnil; preveri smer intervala." : WHY_FLIP_POS],
  [ivT(STRICT[rel], n, d), WHY_BR(rel)],
  [ivT(rel, -n, d), "Pri prenašanju člena na drugo stran pazi na predznak."],
  [ivT(FLIP[STRICT[rel]], n, d), "Preveri smer intervala in vrsto oklepaja."],
];
const relOut = (rel, A) => (A > 0 ? rel : FLIP[rel]);
const divLine = (A) => (A < 0 ? `Delimo z negativnim številom $${A}$, zato se znak obrne.` : `Delimo s pozitivnim številom $${A}$, znak ostane.`);
const eur = (x) => tx(x, Number.isInteger(x) ? null : 2);
const EUR_A = (v, ms = []) => ({ ...num(v, 2, ms, "€"), unitAlternatives: ["eur", "evrov", "evra", "evre"] });
// Sklanjatev »leto«: čez $2$ leti, $3$ leta, $5$ let.
const let_ = (n) => (n % 100 === 1 ? "leto" : n % 100 === 2 ? "leti" : n % 100 === 3 || n % 100 === 4 ? "leta" : "let");
const GIV = (L, R) => [`\\text{leva stran} = ${L}`, `\\text{desna stran} = ${R}`];
const FE = "ax = b,\\ a \\ne 0 \\;\\Rightarrow\\; x = \\dfrac{b}{a}";
const FN = ["ax < b,\\ a > 0 \\;\\Rightarrow\\; x < \\dfrac{b}{a}", "ax < b,\\ a < 0 \\;\\Rightarrow\\; x > \\dfrac{b}{a}"];

const LINEARNE = [
  // ---------------- linearne enačbe ----------------
  {
    id: P + "linearne-enacbe",
    topics: [T("linearne-enacbe"), "MAT-SS-2/mesane-naloge-1-in-2-letnika", "MAT-SS-4/vadbena-maturitetna-pola"],
    gen(level, r) {
      const t = r.int(0, 4);
      if (level === 1) {
        if (t === 0) {
          // ax + b = cx + d
          const x0 = r.nonZero(-9, 9);
          const a = r.nonZero(-6, 9);
          const c = r.nonZero(-6, 9);
          const b = r.nonZero(-15, 15);
          if (a === c) return null;
          const d = (a - c) * x0 + b;
          if (d === 0) return null;
          const E = `${ax(a, b)} = ${ax(c, d)}`;
          return {
            text: `Reši enačbo $${E}$.`,
            answer: qA(x0, 1, [
              { value: (d + b) / (a - c), why: "Število, ki ga preneseš na drugo stran, spremeni predznak." },
              { value: (d - b) / (a + c), why: "Tudi člen z $x$ pri prenosu na levo stran spremeni predznak." },
              { value: (a - c) / (d - b), why: "Iz $ax = b$ sledi $x = \\frac{b}{a}$, ne $\\frac{a}{b}$." },
            ]),
            hint: "Člene z $x$ zberi na levi, števila na desni, nato deli s koeficientom pred $x$.",
            data: { given: GIV(ax(a, b), ax(c, d)), find: ["x"] },
            formula: FE,
            solution: `$${lin([a], ["x"])} ${tX(-c)} = ${tx(d)} ${sg(-b)}$\n$${lin([a - c], ["x"])} = ${d - b}$${a - c === 1 ? "" : `\n$x = ${x0}$`}\nPreizkus: obe strani sta enaki $${a * x0 + b}$.`,
          };
        }
        if (t === 1) {
          // p(x - q) - s(rx + t) = u
          const x0 = r.nonZero(-8, 8);
          const p = r.int(2, 5);
          const q = r.nonZero(-6, 6);
          const s = r.int(2, 4);
          const k = r.int(1, 3);
          const tt = r.nonZero(-6, 6);
          const A = p - s * k;
          if (A === 0) return null;
          const u = p * (x0 - q) - s * (k * x0 + tt);
          const B = u + p * q + s * tt;
          return {
            text: `Reši enačbo $${p}(${xm(q)}) - ${s}(${ax(k, tt)}) = ${u}$.`,
            answer: qA(x0, 1, [
              { value: (u + p * q - s * tt) / A, why: "Minus pred oklepajem spremeni predznak obema členoma v oklepaju." },
              { value: (u + q + s * tt) / A, why: "Število pred oklepajem pomnoži z vsakim členom v oklepaju." },
              { value: B / (p + s * k), why: "Pri $-" + s + "(\\ldots)$ je tudi člen z $x$ negativen." },
            ]),
            hint: "Najprej odpravi oklepaja. Minus pred drugim oklepajem spremeni predznak obema členoma.",
            data: { given: GIV(`${p}(${xm(q)}) - ${s}(${ax(k, tt)})`, `${u}`), find: ["x"] },
            formula: FE,
            solution: `$${p}x ${sg(-p * q)} ${tX(-s * k)} ${sg(-s * tt)} = ${u}$${p * q + s * tt === 0 ? "" : `\n$${lin([A], ["x"])} = ${u} ${sg(p * q + s * tt)}$`}\n$${lin([A], ["x"])} = ${B}$\n$x = ${x0}$`,
          };
        }
        if (t === 2) {
          // (x + a)/m - (x - b)/n = c
          const [m, n] = r.shuffle([2, 3, 4, 5, 6]).slice(0, 2);
          const L = lcmI(m, n);
          const a = r.nonZero(-5, 5);
          const b = r.nonZero(-5, 5);
          const c = r.nonZero(-4, 6);
          const coef = L / m - L / n;
          const rhs = c * L - (L / m) * a - (L / n) * b;
          if (rhs % coef !== 0 || rhs === 0) return null;
          const x0 = rhs / coef;
          if (Math.abs(x0) > 40) return null;
          const E = `\\dfrac{x ${sg(a)}}{${m}} - \\dfrac{x ${sg(-b)}}{${n}} = ${c}`;
          return {
            text: `Reši enačbo $${E}$.`,
            answer: qA(x0, 1, [
              { value: (c - (L / m) * a - (L / n) * b) / coef, why: `Z $${L}$ pomnoži vse člene, tudi desno stran.` },
              { value: (c * L - (L / m) * a + (L / n) * b) / coef, why: "Minus pred ulomkom velja za ves števec: $-(x - b) = -x + b$." },
            ]),
            hint: "Enačbo pomnoži z najmanjšim skupnim večkratnikom imenovalcev. Števca pri tem zapiši v oklepaju.",
            data: { given: GIV(`\\dfrac{x ${sg(a)}}{${m}} - \\dfrac{x ${sg(-b)}}{${n}}`, `${c}`), find: ["x"] },
            formula: FE,
            solution: `Pomnožimo z $${L}$:\n$${mul(L / m, `x ${sg(a)}`)} - ${mul(L / n, `x ${sg(-b)}`)} = ${c * L}$\n$${lin([L / m], ["x"])} ${sg((L / m) * a)} ${tX(-(L / n))} ${sg((L / n) * b)} = ${c * L}$\n$${lin([coef], ["x"])} = ${rhs}$\n$x = ${x0}$`,
          };
        }
        if (t === 3) {
          if (r.next() < 0.5) {
            // zaporedna števila
            const cnt = r.pick([3, 4, 5]);
            const [kind, step] = r.pick([["naravnih", 1], ["sodih", 2], ["lihih", 2]]);
            const x0 = kind === "naravnih" ? r.int(5, 60) : kind === "sodih" ? 2 * r.int(3, 40) : 2 * r.int(3, 40) + 1;
            const add = (step * cnt * (cnt - 1)) / 2;
            const S = cnt * x0 + add;
            const askMax = r.next() < 0.5;
            const ans = askMax ? x0 + step * (cnt - 1) : x0;
            const cntW = { 3: "treh", 4: "štirih", 5: "petih" }[cnt];
            const terms = Array.from({ length: cnt }, (_, i) => (i ? `x + ${i * step}` : "x")).join(", ");
            return {
              text: `Vsota ${cntW} zaporednih ${kind} števil je $${S}$. Katero je ${askMax ? "največje" : "najmanjše"} od teh števil?`,
              answer: num(ans, null, [
                { value: S / cnt, why: "To je povprečje števil (vsota, deljena s številom členov), ne iskano število." },
                { value: askMax ? x0 : x0 + step * (cnt - 1), why: `Vprašanje sprašuje po ${askMax ? "največjem" : "najmanjšem"} številu.` },
                { value: askMax ? x0 + cnt - 1 : null, why: step === 2 ? "Zaporedna soda (liha) števila se razlikujejo za 2." : "" },
              ]),
              hint: `Najmanjše število označi z $x$. Vsako naslednje je za $${step}$ večje.`,
              data: { given: [`S = ${S}`], find: [askMax ? "\\text{največje število}" : "\\text{najmanjše število}"] },
              formula: `x + (x + ${step}) + \\ldots = S`,
              solution: `Števila so $${terms}$.\n$${cnt}x + ${add} = ${S}$\n$${cnt}x = ${S - add}$\n$x = ${x0}$${askMax ? `\nNajvečje število je $x + ${step * (cnt - 1)} = ${ans}$.` : ""}`,
            };
          }
          // starost: čez koliko let bo starš k-krat starejši
          const [par, star, older] = r.pick([["Oče", "star", "starejši"], ["Mama", "stara", "starejša"]]);
          const [ch, chG] = r.pick([["sin", "sina"], ["hči", "hčere"]]);
          const k = r.pick([2, 3]);
          const S = r.int(5, 12);
          const x0 = r.int(2, 12);
          const A = k * (S + x0) - x0;
          if (A < 26 || A > 55) return null;
          return {
            text: `${par} je ${star} $${A}$ let, ${ch} pa $${S}$ let. Čez koliko let bo ${par.toLowerCase()} natanko $${k}$-krat ${older} od ${chG}?`,
            answer: num(x0, null, [
              { value: (A - k * S) / k, why: `Čez $x$ let bosta oba starejša za $x$: $${A} + x = ${k}(${S} + x)$.` },
              { value: A - k * S, why: `Po odpravi oklepaja ostane na desni $${k}x$; zberi člene z $x$ na eni strani.` },
              { value: A / k - S, why: `Tudi starost ${par === "Oče" ? "očeta" : "mame"} se poveča za $x$.` },
            ]),
            hint: `Čez $x$ let bo ${par.toLowerCase()} ${star} $${A} + x$, ${ch} pa $${S} + x$ let.`,
            data: { given: [`A = ${A}`, `S = ${S}`, `k = ${k}`], find: ["x"] },
            formula: "A + x = k\\,(S + x)",
            solution: `$${A} + x = ${k}(${S} + x)$\n$${A} + x = ${k * S} + ${k}x$\n$${A - k * S} = ${k - 1 === 1 ? "" : k - 1}x$\n$x = ${x0}$\nPreizkus: čez $${x0}$ ${let_(x0)} bo ${par.toLowerCase()} ${star} $${A + x0}$, ${ch} pa $${S + x0}$ let; $${A + x0} = ${k} \\cdot ${S + x0}$.`,
          };
        }
        // koliko rešitev: ena, nobena, vsa realna števila
        const p = r.int(2, 5);
        const q = r.nonZero(-6, 6);
        const s = r.nonZero(-9, 9);
        const kind = r.int(0, 2);
        const C0 = p * q + s;
        const p2 = kind === 0 ? p + r.pick([-2, -1, 1, 2]) : p;
        const w = kind === 2 ? C0 : kind === 1 ? C0 + r.nonZero(-6, 6) : r.int(-9, 9);
        if (p2 === 0) return null;
        const OPT = ["Natanko eno rešitev.", "Nobene rešitve.", "Neskončno mnogo: rešitev je vsako realno število.", "Natanko dve rešitvi."];
        const WHY = [
          "Koeficient pred $x$ se je odštel; ostane enakost brez $x$.",
          kind === 2 ? "Enakost $0 = 0$ je resnična za vsak $x$." : "Koeficient pred $x$ ni $0$, zato lahko delimo in dobimo eno rešitev.",
          kind === 1 ? "Enakost brez $x$ je neresnična, zato je ne izpolni noben $x$." : "Koeficient pred $x$ ni $0$, zato lahko delimo in dobimo eno rešitev.",
          "Linearna enačba nima nikoli natanko dveh rešitev.",
        ];
        const E = `${p}(${`x ${sg(q)}`}) ${sg(s)} = ${ax(p2, w)}`;
        const ans = pickAns(r, OPT[kind], OPT.map((o, i) => [o, WHY[i]]).filter((_, i) => i !== kind));
        return {
          text: `Koliko rešitev ima enačba $${E}$?`,
          answer: ans,
          hint: "Odpravi oklepaj in zberi člene z $x$ na levi. Poglej, ali koeficient pred $x$ ostane različen od $0$.",
          data: { given: GIV(`${p}(x ${sg(q)}) ${sg(s)}`, ax(p2, w)), find: ["\\text{število rešitev}"] },
          formula: ["a \\ne 0: \\text{ ena rešitev}", "0 \\cdot x = b,\\ b \\ne 0: \\text{ ni rešitve}", "0 \\cdot x = 0: x \\in \\mathbb{R}"],
          solution: `$${ax(p, C0)} = ${ax(p2, w)}$\n$${lhsX(p - p2)} = ${w - C0}$\n${kind === 0 ? `Koeficient $${p - p2} \\ne 0$, zato je rešitev ena: $x = ${qT(w - C0, p - p2)}$.` : kind === 1 ? `Enakost $0 = ${w - C0}$ ni resnična: enačba nima rešitve.` : "Enakost $0 = 0$ velja za vsak $x$: rešitev je vsako realno število."}`,
        };
      }
      if (level === 2) {
        if (t === 0) {
          // tri ulomki: (u1x + v1)/m - (u2x + v2)/n = (u3x + v3)/k
          const [m, n, k] = r.shuffle([2, 3, 4, 6]).slice(0, 3);
          const L = lcmI(m, n, k);
          const [u1, u2, u3] = [r.int(1, 3), r.int(1, 3), r.int(1, 3)];
          const [v1, v2, v3] = [r.nonZero(-5, 5), r.nonZero(-5, 5), r.nonZero(-5, 5)];
          const coef = (L / m) * u1 - (L / n) * u2 - (L / k) * u3;
          const rhs = (L / k) * v3 - (L / m) * v1 + (L / n) * v2;
          if (coef === 0 || rhs === 0) return null;
          const [xn, xd] = fr(rhs, coef);
          if (xd > 9 || Math.abs(xn / xd) > 20) return null;
          const N = (u, v) => ax(u, v);
          return {
            text: `Reši enačbo $\\dfrac{${N(u1, v1)}}{${m}} - \\dfrac{${N(u2, v2)}}{${n}} = \\dfrac{${N(u3, v3)}}{${k}}$.`,
            answer: qA(rhs, coef, [
              { value: (rhs - 2 * (L / n) * v2) / coef, why: "Minus pred ulomkom spremeni predznak vsem členom števca." },
              { value: (v3 - v1 + v2) / (u1 - u2 - u3), why: `Ko enačbo pomnožiš z $${L}$, se vsak števec pomnoži s svojim faktorjem.` },
            ]),
            hint: "Pomnoži z najmanjšim skupnim večkratnikom imenovalcev; vsak števec zapiši v oklepaju.",
            data: { given: GIV(`\\dfrac{${N(u1, v1)}}{${m}} - \\dfrac{${N(u2, v2)}}{${n}}`, `\\dfrac{${N(u3, v3)}}{${k}}`), find: ["x"] },
            formula: FE,
            solution: `Pomnožimo z $${L}$:\n$${mul(L / m, N(u1, v1))} - ${mul(L / n, N(u2, v2))} = ${mul(L / k, N(u3, v3))}$\n$${ax((L / m) * u1, (L / m) * v1)} ${tX(-(L / n) * u2)} ${sg(-(L / n) * v2)} = ${ax((L / k) * u3, (L / k) * v3)}$\n$${lin([coef], ["x"])} = ${rhs}$\n$x = ${qT(rhs, coef)}$`,
          };
        }
        if (t === 1) {
          const x0 = r.nonZero(-7, 7);
          const a = r.nonZero(-6, 6);
          const b = r.nonZero(-6, 6);
          if (r.next() < 0.5) {
            // (x + a)^2 - (x - b)^2 = c
            if (a + b === 0) return null;
            const c = (x0 + a) ** 2 - (x0 - b) ** 2;
            const C2 = a * a - b * b;
            return {
              text: `Reši enačbo $(x ${sg(a)})^2 - (x ${sg(-b)})^2 = ${c}$.`,
              answer: qA(x0, 1, [
                { value: a !== b ? (c - a * a - b * b) / (2 * (a - b)) : null, why: "Minus pred kvadratom spremeni predznak vsem trem členom razvitega kvadrata." },
                { value: (c - C2) / (a + b), why: "Pri kvadratu dvočlenika je srednji člen $2ab$, ne $ab$." },
              ]),
              hint: "Razvij oba kvadrata: $(x \\pm a)^2 = x^2 \\pm 2ax + a^2$. Člena $x^2$ se odštejeta.",
              data: { given: GIV(`(x ${sg(a)})^2 - (x ${sg(-b)})^2`, `${c}`), find: ["x"] },
              formula: "(x \\pm a)^2 = x^2 \\pm 2ax + a^2",
              solution: `$x^2 ${tX(2 * a)} + ${a * a} - (x^2 ${tX(-2 * b)} + ${b * b}) = ${c}$\n$${ax(2 * (a + b), C2)} = ${c}$\n$${lin([2 * (a + b)], ["x"])} = ${c - C2}$\n$x = ${x0}$`,
            };
          }
          // (x + a)(x - b) - x(x + c) = d
          const c = r.nonZero(-6, 6);
          const A = a - b - c;
          if (A === 0) return null;
          const d = A * x0 - a * b;
          return {
            text: `Reši enačbo $(x ${sg(a)})(x ${sg(-b)}) - x(x ${sg(c)}) = ${d}$.`,
            answer: qA(x0, 1, [
              { value: a - b + c !== 0 ? (d + a * b) / (a - b + c) : null, why: "Minus pred $x(x + c)$ spremeni predznak obema členoma." },
              { value: (d - a * b) / A, why: `Prosti člen produkta je $${pt(a)} \\cdot ${pt(-b)} = ${-a * b}$.` },
            ]),
            hint: "Zmnoži oklepaje; člena $x^2$ se odštejeta in ostane linearna enačba.",
            data: { given: GIV(`(x ${sg(a)})(x ${sg(-b)}) - x(x ${sg(c)})`, `${d}`), find: ["x"] },
            formula: "(x + a)(x + b) = x^2 + (a + b)x + ab",
            solution: `$x^2 ${tX(a - b)} ${sg(-a * b)} - x^2 ${tX(-c)} = ${d}$`.replace("+ 0x ", "") + `\n$${ax(A, -a * b)} = ${d}$\n$${lin([A], ["x"])} = ${d + a * b}$\n$x = ${x0}$`,
          };
        }
        if (t === 2) {
          // mešanje raztopin
          const p1 = r.pick([5, 10, 15, 20]);
          const p2 = r.pick([30, 40, 50, 60]);
          const V1 = r.int(2, 12);
          const x0 = r.int(1, 12);
          const pp = (V1 * p1 + x0 * p2) / (V1 + x0);
          if (!Number.isInteger(pp) || pp <= p1 || pp >= p2) return null;
          const sub = r.pick(["soli", "sladkorja"]);
          return {
            text: `V posodi imamo $${V1}\\ \\mathrm{l}$ $${p1}$-odstotne raztopine ${sub}. Koliko litrov $${p2}$-odstotne raztopine ${sub} moramo doliti, da dobimo $${pp}$-odstotno raztopino?`,
            answer: { ...num(x0, null, [
              { value: (V1 * (p2 - pp)) / (pp - p1), why: "Odstotka sta zamenjana: več močne raztopine pomeni višji odstotek mešanice." },
              { value: (V1 * (pp - p1)) / p2, why: "Na desni je tudi dolita raztopina: končna količina je $V_1 + x$." },
            ], "l"), unitAlternatives: ["L", "litrov", "litra", "liter", "litre", "dm³", "dm3"] },
            hint: `Količina ${sub} se ohrani: ${sub === "soli" ? "sol" : "sladkor"} v prvi raztopini in v doliti raztopini skupaj je ${sub === "soli" ? "sol" : "sladkor"} v mešanici.`,
            data: { given: [`V_1 = ${V1}\\ \\mathrm{l}`, `p_1 = ${p1}\\ \\%`, `p_2 = ${p2}\\ \\%`, `p = ${pp}\\ \\%`], find: ["x"] },
            formula: "p_1 V_1 + p_2\\,x = p\\,(V_1 + x)",
            solution: `$${tx(p1 / 100)} \\cdot ${V1} + ${tx(p2 / 100)}\\,x = ${tx(pp / 100)}\\,(${V1} + x)$\nPomnožimo s $100$: $${p1 * V1} + ${p2}x = ${pp * V1} + ${pp}x$\n$${p2 - pp}x = ${pp * V1 - p1 * V1}$\n$x = ${x0}\\ \\mathrm{l}$`,
          };
        }
        if (t === 3) {
          if (r.next() < 0.5) {
            // skupno delo
            const [a, b, T] = r.pick([[3, 6, 2], [4, 12, 3], [6, 12, 4], [10, 15, 6], [12, 24, 8], [20, 30, 12], [5, 20, 4], [8, 24, 6], [9, 18, 6], [2, 6, 1.5], [6, 10, 3.75], [4, 6, 2.4], [3, 12, 2.4], [10, 40, 8]]);
            const sw = r.next() < 0.5;
            const [A, B] = sw ? [b, a] : [a, b];
            const [s1, s2, q] = r.pick([
              ["Prva cev napolni bazen", "druga", "V kolikšnem času napolnita bazen, če sta odprti obe cevi hkrati?"],
              ["Prvi tiskalnik natisne vse letake", "drugi", "V kolikšnem času natisneta letake, če tiskata hkrati?"],
              ["Prvi kombajn požanje njivo", "drugi", "V kolikšnem času požanjeta njivo, če delata hkrati?"],
            ]);
            return {
              text: `${s1} v $${A}$ urah, ${s2} v $${B}$ urah. ${q} Rezultat zapiši v urah.`,
              answer: num(T, null, [
                { value: (A + B) / 2, why: "Skupaj delata hitreje kot vsak zase: čas mora biti krajši od obeh." },
                { value: A + B, why: "Skupaj delata hitreje kot vsak zase: čas mora biti krajši od obeh." },
                { value: Math.abs(A - B), why: `V eni uri opravita skupaj $\\frac{1}{${A}} + \\frac{1}{${B}}$ dela.` },
              ], "h"),
              hint: `${s2 === "druga" ? "Prva" : "Prvi"} v eni uri opravi $\\frac{1}{${A}}$ dela, ${s2} $\\frac{1}{${B}}$. V $x$ urah skupaj opravita celo delo.`,
              data: { given: [`t_1 = ${A}\\ \\mathrm{h}`, `t_2 = ${B}\\ \\mathrm{h}`], find: ["t"] },
              formula: "\\dfrac{t}{t_1} + \\dfrac{t}{t_2} = 1",
              solution: `$\\dfrac{x}{${A}} + \\dfrac{x}{${B}} = 1$\nPomnožimo z $${lcmI(A, B)}$: $${lin([lcmI(A, B) / A], ["x"])} + ${lin([lcmI(A, B) / B], ["x"])} = ${lcmI(A, B)}$\n$${lcmI(A, B) / A + lcmI(A, B) / B}x = ${lcmI(A, B)}$\n$x = ${tx(T)}\\ \\mathrm{h}$`,
            };
          }
          // srečanje
          const v1 = r.int(12, 24);
          const v2 = 5 * r.int(8, 16);
          const tm = r.pick([20, 30, 40, 45, 50, 60, 75, 90]);
          const d = ((v1 + v2) * tm) / 60;
          if (!Number.isInteger(d)) return null;
          return {
            text: `Kraja $A$ in $B$ sta oddaljena $${d}\\ \\mathrm{km}$. Iz $A$ proti $B$ odpelje kolesar s stalno hitrostjo $${v1}\\ \\mathrm{km/h}$, ob istem času pa iz $B$ proti $A$ avtomobil s stalno hitrostjo $${v2}\\ \\mathrm{km/h}$. Čez koliko minut se srečata?`,
            answer: num(tm, null, [
              { value: (d / (v1 + v2)), why: "To je čas v urah; pretvori ga v minute." },
              { value: (60 * d) / (v2 - v1), why: "Vozita drug proti drugemu, zato se razdalja med njima manjša z vsoto hitrosti." },
            ], "min"),
            hint: "Do srečanja skupaj prevozita celo razdaljo: $v_1 t + v_2 t = d$.",
            data: { given: [`d = ${d}\\ \\mathrm{km}`, `v_1 = ${v1}\\ \\mathrm{km/h}`, `v_2 = ${v2}\\ \\mathrm{km/h}`], find: ["t"] },
            formula: "v_1 t + v_2 t = d",
            solution: `$${v1}t + ${v2}t = ${d}$\n$${v1 + v2}t = ${d}$\n$t = ${qT(d, v1 + v2)}\\ \\mathrm{h} = ${tm}\\ \\mathrm{min}$`,
          };
        }
        // izražanje iz obrazca
        if (r.next() < 0.5) {
          const a = r.int(6, 20);
          const c = r.int(2, a - 2);
          const v = r.int(3, 12);
          const S = ((a + c) * v) / 2;
          return {
            text: `Ploščina trapeza je $S = \\dfrac{(a + c) \\cdot v}{2}$. Iz obrazca izrazi $c$ in izračunaj $c$, če je $S = ${tx(S)}\\ \\mathrm{cm^2}$, $a = ${a}\\ \\mathrm{cm}$ in $v = ${v}\\ \\mathrm{cm}$.`,
            answer: num(c, null, [
              { value: S / v - a, why: "Pred deljenjem z $v$ pomnoži z $2$: $a + c = \\frac{2S}{v}$." },
              { value: (2 * S - a) / v, why: "Najprej deli z $v$, šele nato odštej $a$." },
              { value: (2 * S) / v + a, why: "Ko $a$ preneseš na drugo stran, spremeni predznak." },
            ], "cm"),
            hint: "Obrazec pomnoži z $2$, deli z $v$ in odštej $a$.",
            data: { given: [`S = ${tx(S)}\\ \\mathrm{cm^2}`, `a = ${a}\\ \\mathrm{cm}`, `v = ${v}\\ \\mathrm{cm}`], find: ["c"] },
            formula: "S = \\dfrac{(a + c)\\,v}{2} \\;\\Rightarrow\\; c = \\dfrac{2S}{v} - a",
            solution: `$2S = (a + c)\\,v$\n$a + c = \\dfrac{2S}{v}$\n$c = \\dfrac{2S}{v} - a = \\dfrac{2 \\cdot ${tx(S)}}{${v}} - ${a} = ${tx((2 * S) / v)} - ${a} = ${c}\\ \\mathrm{cm}$`,
          };
        }
        const C = 5 * r.int(-6, 9);
        if (C === 0) return null;
        const F = 1.8 * C + 32;
        const Fi = Math.round(F);
        return {
          text: `Temperaturo v stopinjah Fahrenheita izračunamo po obrazcu $F = 1{,}8\\,C + 32$, kjer je $C$ temperatura v stopinjah Celzija. Iz obrazca izrazi $C$ in izračunaj, koliko stopinj Celzija je $${Fi}\\ ^\\circ\\mathrm{F}$.`,
          answer: num(C, null, [
            { value: Fi / 1.8 - 32, why: "Najprej odštej $32$, šele nato deli z $1{,}8$." },
            { value: (Fi + 32) / 1.8, why: "Ko $32$ preneseš na drugo stran, spremeni predznak." },
            { value: 1.8 * Fi + 32, why: "Iz obrazca izrazi $C$; ne vstavljaj $F$ namesto $C$." },
          ]),
          hint: "Na obeh straneh odštej $32$, nato deli z $1{,}8$.",
          data: { given: [`F = ${Fi}`], find: ["C"] },
          formula: "C = \\dfrac{F - 32}{1{,}8}",
          solution: `$1{,}8\\,C = F - 32$\n$C = \\dfrac{F - 32}{1{,}8} = \\dfrac{${Fi} - 32}{1{,}8} = \\dfrac{${Fi - 32}}{1{,}8} = ${C}$\n$${Fi}\\ ^\\circ\\mathrm{F}$ je $${C}\\ ^\\circ\\mathrm{C}$.`,
        };
      }
      // ---------- 3. raven ----------
      if (t === 0) {
        // parameter (višja raven): mx + p = cx + m
        const km = r.pick([1, 2, 3]);
        const p = r.nonZero(-6, 6);
        const c = r.nonZero(-6, 8);
        const E = `${km === 1 ? "" : km}mx ${sg(p)} = ${lin([c], ["x"])} + m`;
        const kmT = `${km === 1 ? "" : km}m ${sg(-c)}`;
        if (r.next() < 0.5) {
          if (c === p * km) return null;
          return {
            text: `${VR}Za katero vrednost parametra $m$ enačba $${E}$ nima rešitve?`,
            answer: qA(c, km, [
              { value: p, why: "Pri tej vrednosti je desna stran enaka $0$; enačba nima rešitve, ko je koeficient pred $x$ enak $0$." },
              { value: -c / km, why: "Pazi na predznak: koeficient pred $x$ je $" + kmT + "$." },
              { value: c, why: km === 1 ? "" : `Koeficient pred $x$ je $${km}m ${sg(-c)}$; deli tudi z $${km}$.` },
            ]),
            hint: "Člene z $x$ zberi na levi, ostalo na desni. Enačba $ax = b$ nima rešitve, ko je $a = 0$ in $b \\ne 0$.",
            data: { given: GIV(`${km === 1 ? "" : km}mx ${sg(p)}`, `${lin([c], ["x"])} + m`), find: ["m"] },
            formula: "ax = b:\\ a = 0,\\ b \\ne 0 \\Rightarrow \\text{ni rešitve}",
            solution: `$(${kmT})\\,x = m ${sg(-p)}$\nRešitve ni, ko je koeficient pred $x$ enak $0$, desna stran pa ne.\n$${kmT} = 0 \\;\\Rightarrow\\; m = ${qT(c, km)}$\nTedaj je desna stran $${qT(c, km)} ${sg(-p)} = ${qT(c - p * km, km)} \\ne 0$, zato enačba res nima rešitve.`,
          };
        }
        const x0 = r.nonZero(-5, 5);
        const den = km * x0 - 1;
        if (den === 0) return null;
        const mn = c * x0 - p;
        if (mn === 0 || fr(mn, den)[1] > 12) return null;
        // pri tej vrednosti m mora biti koeficient pred x različen od 0 (ena sama rešitev)
        if (Math.abs((km * mn) / den - c) < 1e-9) return null;
        return {
          text: `${VR}Za katero vrednost parametra $m$ ima enačba $${E}$ rešitev $x = ${x0}$?`,
          answer: qA(mn, den, [
            { value: (c * x0 + p) / den, why: "Pri prenosu $p$ na drugo stran pazi na predznak." },
            { value: mn / (km * x0), why: "Tudi člen $m$ na desni prenesi na levo: $m$ nastopa na obeh straneh." },
          ]),
          hint: "Vstavi dano rešitev namesto $x$ in reši linearno enačbo za $m$.",
          data: { given: [...GIV(`${km === 1 ? "" : km}mx ${sg(p)}`, `${lin([c], ["x"])} + m`), `x = ${x0}`], find: ["m"] },
          formula: "\\text{rešitev } x_0 \\text{ vstavimo v enačbo}",
          solution: `$${km === 1 ? "" : km}m \\cdot ${pt(x0)} ${sg(p)} = ${c} \\cdot ${pt(x0)} + m$\n$${lin([km * x0], ["m"])} - m = ${c * x0} ${sg(-p)}$\n$${lin([den], ["m"])} = ${mn}$\n$m = ${qT(mn, den)}$`,
        };
      }
      if (t === 1) {
        if (r.next() < 0.5) {
          // a/(x - p) = b/(x - q)
          const [a, b] = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 2);
          const p = r.nonZero(-6, 6);
          const q = r.nonZero(-6, 6);
          if (p === q) return null;
          const N = a * q - b * p;
          const D = a - b;
          if (N === 0) return null;
          const [xn, xd] = fr(N, D);
          if (xd > 6) return null;
          return {
            text: `Reši enačbo $\\dfrac{${a}}{${xm(p)}} = \\dfrac{${b}}{${xm(q)}}$.`,
            answer: qA(N, D, [
              { value: (a * p - b * q) / D, why: "Navzkrižno množimo: števec leve z imenovalcem desne strani." },
              { value: (a * q + b * p) / D, why: "Pri odpravi oklepaja pazi na predznak." },
            ]),
            hint: "Določi definicijsko območje, nato pomnoži s produktom imenovalcev.",
            data: { given: GIV(`\\dfrac{${a}}{${xm(p)}}`, `\\dfrac{${b}}{${xm(q)}}`), find: ["x"] },
            formula: "\\dfrac{a}{b} = \\dfrac{c}{d} \\;\\Rightarrow\\; ad = bc",
            solution: `Definicijsko območje: $x \\ne ${p}$ in $x \\ne ${q}$.\n$${a}(${xm(q)}) = ${b}(${xm(p)})$\n$${a}x ${sg(-a * q)} = ${b}x ${sg(-b * p)}$\n$${lin([D], ["x"])} = ${N}$\n$x = ${qT(N, D)}$, ki je v definicijskem območju.`,
          };
        }
        // (kx + s)/(x - p) = k + c/(x - q)
        const k = r.int(1, 3);
        const c = r.int(1, 9);
        const p = r.nonZero(-5, 5);
        const q = r.nonZero(-5, 5);
        const x0 = r.int(-8, 8);
        if (p === q || x0 === p || x0 === q || x0 === 0) return null;
        const sN = k * p * (q - x0) + c * (x0 - p);
        if (sN % (x0 - q) !== 0) return null;
        const s = sN / (x0 - q);
        if (s === 0 || Math.abs(s) > 30 || s === -k * p) return null;
        const A = s + k * p - c;
        const B = s * q + k * p * q - c * p;
        if (A === 0) return null;
        const kxs = ax(k, s);
        return {
          text: `Reši enačbo $\\dfrac{${kxs}}{${xm(p)}} = ${k} + \\dfrac{${c}}{${xm(q)}}$.`,
          answer: qA(B, A, [
            { value: A + 2 * c !== 0 ? (s * q + k * p * q + c * p) / (s + k * p + c) : null, why: `Člen $${c}(${xm(p)})$ odpravi pravilno: $${c}x ${sg(-c * p)}$.` },
            { value: p, why: `Pri $x = ${p}$ je imenovalec $0$: to število ni v definicijskem območju.` },
          ]),
          hint: "Zapiši definicijsko območje in enačbo pomnoži s produktom imenovalcev. Člena z $x^2$ se odštejeta.",
          data: { given: GIV(`\\dfrac{${kxs}}{${xm(p)}}`, `${k} + \\dfrac{${c}}{${xm(q)}}`), find: ["x"] },
          formula: "\\text{pomnožimo s skupnim imenovalcem; preverimo definicijsko območje}",
          solution: `Definicijsko območje: $x \\ne ${p}$ in $x \\ne ${q}$.\n$(${kxs})(${xm(q)}) = ${k === 1 ? "" : k}(${xm(p)})(${xm(q)}) + ${c}(${xm(p)})$\n$${k === 1 ? "" : k}x^2 ${tX(s - k * q)} ${sg(-s * q)} = ${k === 1 ? "" : k}x^2 ${tX(-k * (p + q) + c)} ${sg(k * p * q - c * p)}$`.replace(/ \+ 0x| - 0x/g, "").replace(/ \+ 0\$/g, "$").replace(/ \+ 0 =/g, " =") + `\n$${lin([A], ["x"])} = ${B}$\n$x = ${x0}$, ki je v definicijskem območju.`,
        };
      }
      if (t === 2) {
        // starostna razmerja
        const [par, older] = r.pick([["Oče", "starejši"], ["Mama", "starejša"]]);
        const [ch, chG] = r.pick([["sin", "sina"], ["hči", "hčere"]]);
        const [k, m] = r.pick([[3, 2], [4, 2], [5, 2], [5, 3], [4, 3]]);
        const x0 = r.int(4, 14);
        const nN = x0 * (k - m);
        if (nN % (m - 1) !== 0) return null;
        const n = nN / (m - 1);
        if (k * x0 < 24 || k * x0 > 58 || n < 2 || n > 30) return null;
        return {
          text: `${par} je zdaj $${k}$-krat ${older} od ${chG}. Čez $${n}$ ${let_(n)} bo le še $${m}$-krat ${older}. Koliko let ima ${ch} zdaj?`,
          answer: num(x0, null, [
            { value: k * x0, why: `To je starost ${par === "Oče" ? "očeta" : "mame"}; vprašanje sprašuje po starosti ${chG}.` },
            { value: x0 + n, why: `To je starost ${chG} čez $${n}$ ${let_(n)}.` },
            { value: (n * (m + 1)) / (k - m), why: `Ko $${n}$ preneseš na desno stran, spremeni predznak: $${k - m === 1 ? "" : k - m}x = ${m * n} - ${n}$.` },
          ]),
          hint: `Zdajšnjo starost ${chG} označi z $x$. Zdaj je ${par === "Oče" ? "oče star" : "mama stara"} $${k}x$, čez $${n}$ ${let_(n)} pa bosta stara $${k}x + ${n}$ in $x + ${n}$.`,
          data: { given: [`k = ${k}`, `n = ${n}`, `m = ${m}`], find: ["x"] },
          formula: "kx + n = m\\,(x + n)",
          solution: `$${k}x + ${n} = ${m}(x + ${n})$\n$${k}x + ${n} = ${m}x + ${m * n}$\n$${lin([k - m], ["x"])} = ${m * n - n}$\n$x = ${x0}$\nPreizkus: zdaj $${k * x0}$ in $${x0}$, čez $${n}$ ${let_(n)} $${k * x0 + n} = ${m} \\cdot ${x0 + n}$.`,
        };
      }
      if (t === 3) {
        // dohitevanje
        const v1 = r.pick([40, 50, 60, 70, 80]);
        const v2 = v1 + r.pick([10, 20, 30, 40]);
        const dt = r.pick([0.5, 1, 1.5, 2]);
        const tt = (v1 * dt) / (v2 - v1);
        if (!Number.isInteger(tt * 4) || tt > 8) return null;
        const askS = r.next() < 0.5;
        const S = v2 * tt;
        const base = `Tovornjak odpelje iz skladišča s stalno hitrostjo $${v1}\\ \\mathrm{km/h}$. Po $${tx(dt)}\\ \\mathrm{h}$ za njim iz istega skladišča odpelje kombi s stalno hitrostjo $${v2}\\ \\mathrm{km/h}$.`;
        return {
          text: `${base} ${askS ? "Koliko kilometrov od skladišča kombi dohiti tovornjak?" : "Koliko ur po svojem odhodu kombi dohiti tovornjak?"}`,
          answer: askS
            ? num(S, null, [
                { value: v1 * dt, why: "To je le prednost tovornjaka ob odhodu kombija." },
                { value: v2 * (tt + dt), why: "Kombi vozi manj časa kot tovornjak: za $t$ ur, tovornjak za $t + \\Delta t$." },
                { value: v1 * tt, why: "Tovornjak vozi dlje kot kombi: $t + \\Delta t$ ur." },
              ], "km")
            : num(tt, null, [
                { value: tt + dt, why: "To je čas od odhoda tovornjaka; vprašanje šteje od odhoda kombija." },
                { value: (v1 * dt) / v2, why: "Kombi se tovornjaku približuje z razliko hitrosti $v_2 - v_1$." },
                { value: (v1 * dt) / (v1 + v2), why: "Vozita v isto smer, zato se razdalja zmanjšuje z razliko hitrosti." },
              ], "h"),
          hint: "Ko ga dohiti, sta prevozila enako pot. Kombi vozi $t$ ur, tovornjak $t + \\Delta t$ ur.",
          data: { given: [`v_1 = ${v1}\\ \\mathrm{km/h}`, `\\Delta t = ${tx(dt)}\\ \\mathrm{h}`, `v_2 = ${v2}\\ \\mathrm{km/h}`], find: [askS ? "s" : "t"] },
          formula: "v_2\\,t = v_1\\,(t + \\Delta t)",
          solution: `$${v2}t = ${v1}(t + ${tx(dt)})$\n$${v2}t = ${v1}t + ${tx(v1 * dt)}$\n$${v2 - v1}t = ${tx(v1 * dt)}$\n$t = ${tx(tt)}\\ \\mathrm{h}$${askS ? `\n$s = v_2\\,t = ${v2} \\cdot ${tx(tt)} = ${tx(S)}\\ \\mathrm{km}$` : ""}`,
        };
      }
      // sprememba cene
      const [gen, nom, past] = r.pick([["kolesa", "kolo", "stalo"], ["prenosnika", "prenosnik", "stal"], ["plašča", "plašč", "stal"], ["telefona", "telefon", "stal"], ["kavča", "kavč", "stal"]]);
      const x0 = 10 * r.int(4, 60);
      const p = r.pick([10, 20, 25, 30, 50]);
      const q = r.pick([10, 20, 25, 40]);
      const up = r.next() < 0.5;
      const f1 = up ? 1 + p / 100 : 1 - p / 100;
      const f2 = up ? 1 - q / 100 : 1 + q / 100;
      const C = Math.round(x0 * f1 * f2 * 100) / 100;
      if (Math.abs(C - x0 * f1 * f2) > 1e-9 || Math.abs(C - x0) < 1e-9) return null;
      const net = up ? p - q : q - p;
      return {
        text: `Cena ${gen} se je najprej ${up ? "zvišala" : "znižala"} za $${p}\\ \\%$, nato pa ${up ? "znižala" : "zvišala"} za $${q}\\ \\%$. Zdaj ${nom} stane $${eur(C)}\\ \\text{€}$. Koliko je ${past} pred obema spremembama?`,
        answer: EUR_A(x0, [
          { value: net !== 0 ? C / (1 + net / 100) : null, why: "Odstotkov ne smemo seštevati: druga sprememba se računa od že spremenjene cene." },
          { value: C * (up ? (1 - p / 100) * (1 + q / 100) : (1 + p / 100) * (1 - q / 100)), why: "Spremembe razveljavimo z deljenjem s faktorjem, ne z obratno spremembo v odstotkih." },
          { value: C, why: "Ceni pred in po spremembah nista enaki." },
        ]),
        hint: `Prvotno ceno označi z $x$. ${up ? "Zvišanje" : "Znižanje"} za $${p}\\ \\%$ pomeni množenje s $${tx(f1)}$.`,
        data: { given: [`p = ${p}\\ \\%`, `q = ${q}\\ \\%`, `C = ${eur(C)}\\ \\text{€}`], find: ["x"] },
        formula: "x \\cdot \\left(1 \\pm \\dfrac{p}{100}\\right)\\left(1 \\pm \\dfrac{q}{100}\\right) = C",
        solution: `$x \\cdot ${tx(f1)} \\cdot ${tx(f2)} = ${eur(C)}$\n$${tx(cl(f1 * f2))}\\,x = ${eur(C)}$\n$x = \\dfrac{${eur(C)}}{${tx(cl(f1 * f2))}} = ${x0}\\ \\text{€}$`,
      };
    },
  },

  // ---------------- linearna funkcija ----------------
  {
    id: P + "linearna-funkcija",
    topics: [T("linearna-funkcija"), "MAT-SS-2/mesane-naloge-1-in-2-letnika", "MAT-SS-4/vadbena-maturitetna-pola"],
    gen(level, r) {
      const t = r.int(0, 4);
      const FK = "k = \\dfrac{y_2 - y_1}{x_2 - x_1}";
      if (level === 1) {
        if (t === 0) {
          const x1 = r.int(-5, 3);
          const x2 = x1 + r.int(1, 6);
          const y1 = r.int(-8, 8);
          const y2 = r.int(-8, 8);
          if (y1 === y2) return null;
          const dy = y2 - y1;
          const dx = x2 - x1;
          return {
            text: `Graf linearne funkcije $f$ poteka skozi točki $A(${x1}, ${y1})$ in $B(${x2}, ${y2})$. Izračunaj smerni koeficient $k$.`,
            answer: qA(dy, dx, [
              { value: dx / dy, why: "V števcu je razlika $y$, v imenovalcu razlika $x$." },
              { value: -dy / dx, why: "Obe razliki odštej v istem vrstnem redu." },
            ]),
            hint: "Smerni koeficient je sprememba $y$, deljena s spremembo $x$.",
            data: { given: [`x_1 = ${x1}`, `y_1 = ${y1}`, `x_2 = ${x2}`, `y_2 = ${y2}`], find: ["k"] },
            formula: FK,
            solution: `$k = \\dfrac{${y2} - ${pt(y1)}}{${x2} - ${pt(x1)}} = \\dfrac{${dy}}{${dx}}${fr(dy, dx)[1] === dx ? "" : ` = ${qT(dy, dx)}`}$`,
          };
        }
        if (t === 1) {
          // graf na sliki: preberi k in n, izračunaj f(a) daleč od slike
          const k = r.nonZero(-3, 3);
          const n = r.int(-4, 4);
          const a = r.pick([-12, -10, 10, 12, 15, 20]);
          const fa = k * a + n;
          return {
            text: `Na sliki je graf linearne funkcije $f$. Iz grafa določi predpis funkcije in izračunaj $f(${a})$.`,
            figure: { type: "line", k, n },
            answer: num(fa, null, [
              { value: n * a + k, why: "Zamenjana sta $k$ in $n$: $n$ je presečišče z osjo $y$, $k$ sprememba $y$ na enoto $x$." },
              { value: -k * a + n, why: "Preveri predznak smernega koeficienta: ali graf narašča ali pada?" },
              { value: k * a, why: "Ne pozabi prišteti začetne vrednosti $n$." },
            ]),
            hint: "Začetna vrednost $n$ je presečišče grafa z osjo $y$. Za $k$ poglej, za koliko se spremeni $y$, ko se $x$ poveča za $1$.",
            data: { given: ["f(x) = kx + n\\ (\\text{graf na sliki})"], find: [`f(${a})`] },
            formula: ["n = f(0)", FK],
            solution: `Graf seka os $y$ v točki $(0, ${n})$, zato je $n = ${n}$.\nKo se $x$ poveča za $1$, se $y$ ${k > 0 ? "poveča" : "zmanjša"} za $${Math.abs(k)}$, zato je $k = ${k}$.\n$f(x) = ${fT(k, 1, n)}$\n$f(${a}) = ${k} \\cdot ${pt(a)} ${sg(n)} = ${fa}$`.replace(` ${sg(0)} = `, " = "),
          };
        }
        if (t === 2) {
          // ničla funkcije z ulomljenim k
          const q = r.pick([2, 3, 4, 5]);
          const p = r.nonZero(-5, 5);
          if (gcdI(p, q) !== 1) return null;
          const x0 = q * r.nonZero(-4, 4);
          const n = (-p * x0) / q;
          return {
            text: `Izračunaj ničlo funkcije $f(x) = ${fT(p, q, n)}$.`,
            answer: num(x0, null, [
              { value: -x0, why: "Ko $n$ preneseš na drugo stran, spremeni predznak." },
              { value: n, why: "To je začetna vrednost (presečišče z osjo $y$), ne ničla." },
              { value: (-n * p) / q, why: `Delimo z $${qT(p, q)}$, kar pomeni množenje z obratno vrednostjo $${qT(q, p)}$.` },
            ]),
            hint: "Ničla je tisti $x$, pri katerem je $f(x) = 0$.",
            data: { given: [`f(x) = ${fT(p, q, n)}`], find: ["x_0"] },
            formula: "f(x_0) = 0 \\;\\Rightarrow\\; x_0 = -\\dfrac{n}{k}",
            solution: `$${fT(p, q, n)} = 0$\n$${kxT(p, q)} = ${-n}$\n$x = ${pt(-n)} \\cdot ${qT(q, p).startsWith("-") ? `\\left(${qT(q, p)}\\right)` : qT(q, p)} = ${x0}$`,
          };
        }
        if (t === 3) {
          // izbira pravilne trditve
          const k = r.nonZero(-4, 4);
          const n = r.nonZero(-6, 6);
          const z = qT(-n, k);
          const TR = [
            `Graf seka os $y$ v točki $(0, ${n})$.`,
            `Funkcija je ${k > 0 ? "naraščajoča" : "padajoča"}.`,
            `Ničla funkcije je $${z}$.`,
          ];
          const FA = [
            k !== n ? [`Graf seka os $y$ v točki $(0, ${k})$.`, "Os $y$ seka graf pri $x = 0$, torej v točki $(0, n)$."] : null,
            [`Funkcija je ${k > 0 ? "padajoča" : "naraščajoča"}.`, `Smerni koeficient je $${k}$, ${k > 0 ? "pozitiven: funkcija narašča" : "negativen: funkcija pada"}.`],
            qT(n, k) !== z ? [`Ničla funkcije je $${qT(n, k)}$.`, "Iz $kx + n = 0$ sledi $x = -\\frac{n}{k}$: pazi na predznak."] : null,
            -n / k !== n ? [`Graf seka os $x$ v točki $(${n}, 0)$.`, "Presečišče z osjo $x$ je ničla $-\\frac{n}{k}$, ne $n$."] : null,
            [`Graf je vzporeden osi $x$.`, "Vzporeden osi $x$ je graf le pri $k = 0$."],
          ].filter(Boolean);
          const pick = r.int(0, 2);
          const ans = pickAns(r, TR[pick], r.shuffle(FA));
          if (ans.options.length < 4) return null;
          return {
            text: `Dana je funkcija $f(x) = ${fT(k, 1, n)}$. Katera trditev je pravilna?`,
            answer: ans,
            hint: "Določi $k$ in $n$, nato še ničlo $x_0 = -\\frac{n}{k}$.",
            data: { given: [`f(x) = ${fT(k, 1, n)}`], find: ["\\text{pravilna trditev}"] },
            formula: ["n = f(0)", "x_0 = -\\dfrac{n}{k}"],
            solution: `$k = ${k}$, zato je funkcija ${k > 0 ? "naraščajoča" : "padajoča"}.\n$n = ${n}$: graf seka os $y$ v točki $(0, ${n})$.\nNičla: $x_0 = -\\dfrac{${n}}{${k}} = ${z}$.\nPravilna je trditev: ${TR[pick]}`,
          };
        }
        // f(a) ali f(x) = c pri ulomljenem k
        const q = r.pick([2, 3, 4]);
        const p = r.nonZero(-5, 5);
        if (gcdI(p, q) !== 1) return null;
        const n = r.int(-6, 6);
        const j = r.nonZero(-4, 4);
        const xs = q * j;
        const val = p * j + n;
        if (r.next() < 0.5) {
          return {
            text: `Dana je funkcija $f(x) = ${fT(p, q, n)}$. Izračunaj $f(${xs})$.`,
            answer: num(val, null, [
              { value: (q * xs) / p + n, why: `Pomnoži z $${qT(p, q)}$, ne z obratno vrednostjo.` },
              { value: p * j - n, why: "Preveri predznak začetne vrednosti." },
            ]),
            hint: "Namesto $x$ vstavi dano število.",
            data: { given: [`f(x) = ${fT(p, q, n)}`, `x = ${xs}`], find: [`f(${xs})`] },
            formula: "f(x) = kx + n",
            solution: `$f(${xs}) = ${qT(p, q)} \\cdot ${pt(xs)}${n ? ` ${sg(n)}` : ""} = ${p * j}${n ? ` ${sg(n)} = ${val}` : ""}$`,
          };
        }
        return {
          text: `Dana je funkcija $f(x) = ${fT(p, q, n)}$. Za kateri $x$ je $f(x) = ${val}$?`,
          answer: num(xs, null, [
            { value: ((val - n) * p) / q, why: `Delimo z $${qT(p, q)}$, kar pomeni množenje z $${qT(q, p)}$.` },
            { value: ((val + n) * q) / p, why: "Ko $n$ preneseš na drugo stran, spremeni predznak." },
            { value: (p * val) / q + n, why: "To je vrednost $f$ pri danem številu; iščemo $x$, pri katerem je $f(x)$ enak danemu številu." },
          ]),
          hint: "Reši enačbo $kx + n = c$.",
          data: { given: [`f(x) = ${fT(p, q, n)}`, `f(x) = ${val}`], find: ["x"] },
          formula: "kx + n = c \\;\\Rightarrow\\; x = \\dfrac{c - n}{k}",
          solution: `$${fT(p, q, n)} = ${val}$\n$${kxT(p, q)} = ${val - n}$\n$x = ${pt(val - n)} \\cdot ${qT(q, p).startsWith("-") ? `\\left(${qT(q, p)}\\right)` : qT(q, p)} = ${xs}$`,
        };
      }
      if (level === 2) {
        if (t === 0) {
          // predpis iz dveh točk, vprašanje po n
          const x1 = r.int(-6, 4);
          const x2 = x1 + r.int(2, 6);
          const y1 = r.int(-8, 8);
          const y2 = r.int(-8, 8);
          if (y1 === y2 || x1 === 0) return null;
          const dy = y2 - y1;
          const dx = x2 - x1;
          const nN = y1 * dx - dy * x1;
          const [kn, kd] = fr(dy, dx);
          return {
            text: `Graf linearne funkcije $f(x) = kx + n$ poteka skozi točki $A(${x1}, ${y1})$ in $B(${x2}, ${y2})$. Izračunaj začetno vrednost $n$.`,
            answer: qA(nN, dx, [
              { value: y1 + (dy / dx) * x1, why: "Iz $y_1 = kx_1 + n$ sledi $n = y_1 - kx_1$." },
              { value: dy / dx, why: "To je smerni koeficient $k$." },
              { value: y1 - (dx / dy) * x1, why: "Smerni koeficient je $\\frac{\\Delta y}{\\Delta x}$, ne obratno." },
            ]),
            hint: "Najprej izračunaj $k$, nato v $y = kx + n$ vstavi koordinati ene točke.",
            data: { given: [`x_1 = ${x1}`, `y_1 = ${y1}`, `x_2 = ${x2}`, `y_2 = ${y2}`], find: ["n"] },
            formula: [FK, "n = y_1 - k x_1"],
            solution: `$k = \\dfrac{${y2} - ${pt(y1)}}{${x2} - ${pt(x1)}} = ${qT(dy, dx)}$\n$n = y_1 - k x_1 = ${y1} - ${kd === 1 ? pt(kn) : `\\left(${qT(dy, dx)}\\right)`} \\cdot ${pt(x1)} = ${qT(nN, dx)}$\nPredpis: $f(x) = ${kxT(dy, dx)}${nN ? ` ${nN > 0 ? "+" : "-"} ${qT(Math.abs(nN), dx)}` : ""}$`,
          };
        }
        if (t === 1) {
          // vzporednica ali pravokotnica skozi točko
          const q = r.pick([1, 1, 2, 3]);
          const p = r.nonZero(-4, 4);
          if (gcdI(p, q) !== 1) return null;
          const n = r.int(-5, 5);
          const x0 = r.nonZero(-6, 6);
          const y0 = r.int(-6, 6);
          const par = r.next() < 0.5;
          // vzporedna: k' = p/q, pravokotna: k' = -q/p
          const [kn, kd] = par ? [p, q] : fr(-q, p);
          const nN = y0 * kd - kn * x0;
          return {
            text: `Premica $p$ poteka skozi točko $T(${x0}, ${y0})$ in je ${par ? "vzporedna premici" : "pravokotna na premico"} $y = ${fT(p, q, n)}$. Zapiši enačbo premice $p$ v obliki $y = kx + n$. Koliko je $n$?`,
            answer: qA(nN, kd, [
              par ? { value: y0 + (kn / kd) * x0, why: "Iz $y_0 = kx_0 + n$ sledi $n = y_0 - kx_0$." } : { value: y0 - (q / p) * x0, why: "Pravokotna premica ima smerni koeficient $-\\frac{1}{k}$: pazi na minus." },
              par ? { value: n, why: "Vzporedna premica ima enak smerni koeficient, začetna vrednost pa je drugačna." } : { value: y0 + (p / q) * x0, why: "Pravokotna premica ima smerni koeficient $-\\frac{1}{k}$, ne $-k$." },
              { value: y0 - (p / q) * (par ? -x0 : x0), why: par ? "Pri vstavljanju točke pazi na predznak koordinate." : "Za pravokotnico vzemi $k' = -\\frac{1}{k}$." },
            ]),
            hint: par ? "Vzporedni premici imata enak smerni koeficient." : "Za pravokotni premici velja $k_1 \\cdot k_2 = -1$.",
            data: { given: [`y = ${fT(p, q, n)}`, `x_0 = ${x0}`, `y_0 = ${y0}`], find: ["n"] },
            formula: [par ? "k_1 = k_2" : "k_1 \\cdot k_2 = -1", "n = y_0 - k x_0"],
            solution: `$k' = ${par ? qT(p, q) : `-\\dfrac{1}{${qT(p, q)}} = ${qT(-q, p)}`}$\n$n = y_0 - k' x_0 = ${y0} - ${kd === 1 ? pt(kn) : `\\left(${qT(kn, kd)}\\right)`} \\cdot ${pt(x0)} = ${qT(nN, kd)}$\nPremica $p$: $y = ${fT(kn, kd, 0)}${nN ? ` ${nN > 0 ? "+" : "-"} ${qT(Math.abs(nN), kd)}` : ""}$`,
          };
        }
        if (t === 2) {
          // taksi: cena kot linearna funkcija razdalje
          const kc = r.pick([80, 90, 110, 120, 125, 150, 160]);
          const nc = r.pick([200, 250, 300, 350, 400]);
          const d1 = r.int(3, 9);
          const d2 = d1 + r.int(3, 10);
          const C1 = (nc + kc * d1) / 100;
          const C2 = (nc + kc * d2) / 100;
          const ask = r.int(0, 2);
          const d3 = d2 + r.int(2, 12);
          const C3 = (nc + kc * d3) / 100;
          const Q = ["Koliko stane začetek vožnje, torej cena pri $0\\ \\mathrm{km}$?", "Koliko stane vsak prevoženi kilometer?", `Koliko bi plačali za vožnjo dolžine $${d3}\\ \\mathrm{km}$?`][ask];
          const val = [nc / 100, kc / 100, C3][ask];
          return {
            text: `Za vožnjo s taksijem dolžine $${d1}\\ \\mathrm{km}$ plačamo $${eur(C1)}\\ \\text{€}$, za vožnjo dolžine $${d2}\\ \\mathrm{km}$ pa $${eur(C2)}\\ \\text{€}$. Cena je linearna funkcija prevožene razdalje. ${Q}`,
            answer: EUR_A(val, [
              ask === 0 ? { value: C1 - C1 / d1, why: "Najprej izračunaj ceno kilometra iz razlike obeh voženj." } : null,
              ask === 1 ? { value: C2 / d2, why: "Cena ni sorazmerna z razdaljo: vsebuje še začetni znesek." } : null,
              ask === 2 ? { value: (C2 / d2) * d3, why: "Cena ni sorazmerna z razdaljo: vsebuje še začetni znesek." } : null,
              ask === 1 ? { value: (C2 - C1) / (d2 + d1), why: "Razliko cen deli z razliko razdalj." } : null,
              ask === 0 ? { value: kc / 100, why: "To je cena kilometra $k$, ne začetni znesek $n$." } : null,
              ask === 2 ? { value: C2 + C1, why: "Ceni voženj se ne seštejeta; uporabi predpis $C(d) = kd + n$." } : null,
            ]),
            hint: "Cena kilometra je razlika cen, deljena z razliko razdalj. Začetni znesek dobiš z vstavitvijo ene vožnje.",
            data: { given: [`d_1 = ${d1}\\ \\mathrm{km}`, `C_1 = ${eur(C1)}\\ \\text{€}`, `d_2 = ${d2}\\ \\mathrm{km}`, `C_2 = ${eur(C2)}\\ \\text{€}`], find: [["n", "k", "C"][ask]] },
            formula: ["C(d) = kd + n", "k = \\dfrac{C_2 - C_1}{d_2 - d_1}"],
            solution: `$k = \\dfrac{${eur(C2)} - ${eur(C1)}}{${d2} - ${d1}} = \\dfrac{${eur(cl(C2 - C1))}}{${d2 - d1}} = ${eur(kc / 100)}\\ \\text{€/km}$\n$n = C_1 - k d_1 = ${eur(C1)} - ${eur(kc / 100)} \\cdot ${d1} = ${eur(nc / 100)}\\ \\text{€}$${ask === 2 ? `\n$C(${d3}) = ${eur(kc / 100)} \\cdot ${d3} + ${eur(nc / 100)} = ${eur(C3)}\\ \\text{€}$` : ""}`,
          };
        }
        if (t === 3) {
          // ploščina trikotnika, ki ga graf oklepa s koordinatnima osema
          const n = r.nonZero(-8, 8);
          const x0 = r.nonZero(-9, 9);
          const S = Math.abs(n * x0) / 2;
          const [kn, kd] = fr(-n, x0);
          return {
            text: `Graf funkcije $f(x) = ${fT(kn, kd, n)}$ in koordinatni osi omejujejo trikotnik. Izračunaj njegovo ploščino.`,
            answer: num(S, null, [
              { value: 2 * S, why: "Ploščina pravokotnega trikotnika je polovica produkta katet." },
              { value: (n * n) / 2, why: "Kateti sta dolgi $|n|$ in $|x_0|$; ničlo izračunaj." },
              { value: Math.abs(n * kn / kd) / 2, why: "Druga kateta je ničla $|x_0|$, ne smerni koeficient." },
            ]),
            hint: "Trikotnik je pravokoten; kateti sta odseka na oseh: $|n|$ in $|x_0|$.",
            data: { given: [`f(x) = ${fT(kn, kd, n)}`], find: ["S"] },
            formula: ["x_0 = -\\dfrac{n}{k}", "S = \\dfrac{|n| \\cdot |x_0|}{2}"],
            solution: `Odsek na osi $y$: $n = ${n}$.\nNičla: $${fT(kn, kd, n)} = 0 \\;\\Rightarrow\\; x_0 = ${x0}$\n$S = \\dfrac{|${n}| \\cdot |${x0}|}{2} = ${tx(S)}$`,
          };
        }
        // presečišče grafov
        const k1 = r.nonZero(-4, 4);
        const k2 = r.nonZero(-4, 4);
        if (k1 === k2) return null;
        const X = r.nonZero(-5, 5);
        const Y = r.nonZero(-8, 8);
        const n1 = Y - k1 * X;
        const n2 = Y - k2 * X;
        const askX = r.next() < 0.5;
        return {
          text: `Izračunaj ${askX ? "absciso" : "ordinato"} presečišča grafov funkcij $f(x) = ${fT(k1, 1, n1)}$ in $g(x) = ${fT(k2, 1, n2)}$.`,
          answer: num(askX ? X : Y, null, [
            { value: askX ? Y : X, why: askX ? "Abscisa je koordinata $x$, ordinata koordinata $y$." : "Ordinata je koordinata $y$; vstavi $x$ v eno od funkcij." },
            { value: askX ? -X : k1 * -X + n1, why: "Pri prenašanju členov pazi na predznak." },
          ]),
          hint: "V presečišču je $f(x) = g(x)$. Reši enačbo in izračunaj še $y$.",
          data: { given: [`f(x) = ${fT(k1, 1, n1)}`, `g(x) = ${fT(k2, 1, n2)}`], find: [askX ? "x" : "y"] },
          formula: "f(x) = g(x)",
          solution: `$${fT(k1, 1, n1)} = ${fT(k2, 1, n2)}$\n$${lin([k1 - k2], ["x"])} = ${n2 - n1}$\n$x = ${X}$\n$y = f(${X}) = ${k1} \\cdot ${pt(X)}${n1 ? ` ${sg(n1)}` : ""} = ${Y}$\nPresečišče: $P(${X}, ${Y})$.`,
        };
      }
      // ---------- 3. raven ----------
      if (t === 0) {
        // parameter v predpisu funkcije
        const a = r.int(1, 3);
        const b = r.nonZero(-5, 5);
        const c = r.int(0, 2);
        const d = r.nonZero(-6, 6);
        const mE = (u, v) => `${u === 1 ? "" : u}m ${sg(v)}`;
        const fx = `(${mE(a, b)})x ${c === 0 ? sg(d) : `+ ${mE(c, d)}`}`;
        const kind = r.int(0, 3);
        let N, D, cond, sol, ms;
        if (kind === 0) {
          const K = r.nonZero(-5, 5);
          const NN = r.int(-5, 5);
          N = K - b; D = a;
          cond = `je graf funkcije $f$ vzporeden premici $y = ${fT(K, 1, NN)}$`;
          sol = `Vzporedni premici imata enak smerni koeficient:\n$${mE(a, b)} = ${K}$\n$${a === 1 ? "" : a}m = ${K - b}$`;
          ms = [{ value: (K + b) / a, why: "Pri prenosu števila na drugo stran pazi na predznak." }, { value: (-1 / K - b) / a, why: "Vzporedni premici imata enak smerni koeficient; $-\\frac{1}{k}$ velja za pravokotni." }];
        } else if (kind === 1) {
          const K = r.pick([-3, -2, 2, 3]);
          N = -1 - b * K; D = a * K;
          cond = `je graf funkcije $f$ pravokoten na premico $y = ${lin([K], ["x"])}$`;
          sol = `Za pravokotni premici velja $k_1 \\cdot k_2 = -1$:\n$(${mE(a, b)}) \\cdot ${pt(K)} = -1$\n$${mE(a, b)} = ${qT(-1, K)}$`;
          ms = [{ value: (K - b) / a, why: "Enak smerni koeficient imata vzporedni premici; pravokotni imata $k_1 k_2 = -1$." }, { value: (1 / K - b) / a, why: "Pravokotna premica ima smerni koeficient $-\\frac{1}{k}$: pazi na minus." }];
        } else {
          const x0 = r.nonZero(-4, 4);
          const y0 = kind === 2 ? r.int(-8, 8) : 0;
          N = y0 - b * x0 - d; D = a * x0 + c;
          if (D === 0) return null;
          // pri ničli mora biti funkcija res linearna z ničlo (k ≠ 0)
          if (kind === 3 && Math.abs(a * (N / D) + b) < 1e-9) return null;
          cond = kind === 2 ? `poteka graf funkcije $f$ skozi točko $T(${x0}, ${y0})$` : `je ničla funkcije $f$ enaka $${x0}$`;
          sol = `Vstavimo $x = ${x0}$ in $f(${x0}) = ${y0}$:\n$(${mE(a, b)}) \\cdot ${pt(x0)} ${c === 0 ? sg(d) : `+ ${mE(c, d)}`} = ${y0}$\n$${lin([a * x0 + c], ["m"])} ${sg(b * x0 + d)} = ${y0}$`.replace(" + 0 =", " =");
          ms = [{ value: (y0 + b * x0 + d) / D, why: "Pri prenosu števil na drugo stran pazi na predznak." }, { value: D !== c ? N / (a * x0) : null, why: "Tudi začetna vrednost vsebuje $m$." }];
        }
        if (N === 0) return null;
        return {
          text: `Dana je funkcija $f(x) = ${fx}$, kjer je $m$ realno število. Za katero vrednost $m$ ${cond}?`,
          answer: qA(N, D, ms),
          hint: kind <= 1 ? "Smerni koeficient funkcije $f$ je izraz v oklepaju pred $x$." : "Vstavi koordinati točke v predpis in reši linearno enačbo za $m$.",
          data: { given: [`f(x) = ${fx}`], find: ["m"] },
          formula: kind === 0 ? "k_1 = k_2" : kind === 1 ? "k_1 \\cdot k_2 = -1" : "y_0 = f(x_0)",
          solution: `${sol}\n$m = ${qT(N, D)}$`,
        };
      }
      if (t === 1) {
        // ničla in ena vrednost → druga vrednost
        const x0 = r.int(-6, 6);
        const a = r.int(-6, 8);
        const b = r.nonZero(-9, 9);
        const c = r.int(-8, 10);
        if (a === x0 || c === x0 || c === a || a === 0) return null;
        const [kn, kd] = fr(b, a - x0);
        if (kd > 4) return null;
        const N = b * (c - x0);
        const D = a - x0;
        return {
          text: `Linearna funkcija $f$ ima ničlo $x_0 = ${x0}$ in velja $f(${a}) = ${b}$. Izračunaj $f(${c})$.`,
          answer: qA(N, D, [
            { value: (b * c) / a, why: "Funkcija ni premo sorazmerna: graf ne gre nujno skozi izhodišče." },
            { value: (b * (c + x0)) / (a + x0), why: "Ničla je točka $(x_0, 0)$: $k = \\frac{f(a) - 0}{a - x_0}$." },
          ]),
          hint: "Graf poteka skozi točki $(x_0, 0)$ in $(a, f(a))$. Iz njiju izračunaj $k$ in $n$.",
          data: { given: [`x_0 = ${x0}`, `f(${a}) = ${b}`], find: [`f(${c})`] },
          formula: [FK, "f(x) = k\\,(x - x_0)"],
          solution: `Graf poteka skozi $(${x0}, 0)$ in $(${a}, ${b})$.\n$k = \\dfrac{${b} - 0}{${a} - ${pt(x0)}} = ${qT(b, a - x0)}$\n$f(x) = k(x - x_0) = ${qT(b, a - x0)}\\,(${xm(x0)})$`.replace("(x - 0)", "x") + `\n$f(${c}) = ${qT(b, a - x0)} \\cdot ${pt(c - x0)} = ${qT(N, D)}$`,
        };
      }
      if (t === 2) {
        // linearni model: sveča ali rezervoar, kdaj je prazno
        const candle = r.next() < 0.5;
        const v = candle ? r.pick([0.5, 1, 1.5, 2, 2.5]) : r.pick([20, 25, 30, 40, 50]);
        const T0 = candle ? r.int(6, 24) : r.int(10, 40);
        const h0 = v * T0;
        if (candle && (h0 > 30 || h0 < 8 || !Number.isInteger(h0))) return null;
        const t1 = r.int(1, Math.floor(T0 / 2));
        const t2 = t1 + r.int(2, Math.max(2, Math.floor(T0 / 2) - 1));
        if (t2 >= T0) return null;
        const h1 = h0 - v * t1;
        const h2 = h0 - v * t2;
        const askT = r.next() < 0.6;
        const U = candle ? ["h", "ur", "cm"] : ["min", "minut", "l"];
        // Oznaka količine: višina sveče h, prostornina vode V.
        const H = candle ? "h" : "V";
        const lead = candle
          ? `Sveča enakomerno gori. Po $${t1}\\ \\mathrm{h}$ je visoka $${tx(h1)}\\ \\mathrm{cm}$, po $${t2}\\ \\mathrm{h}$ pa $${tx(h2)}\\ \\mathrm{cm}$.`
          : `Iz rezervoarja enakomerno odteka voda. Po $${t1}\\ \\mathrm{min}$ je v njem $${h1}\\ \\mathrm{l}$ vode, po $${t2}\\ \\mathrm{min}$ pa $${h2}\\ \\mathrm{l}$.`;
        const Q = askT
          ? candle ? "Po koliko urah od prižiga sveča dogori?" : "Po koliko minutah od začetka iztekanja je rezervoar prazen?"
          : candle ? "Kako visoka je bila sveča pred prižigom?" : "Koliko vode je bilo v rezervoarju na začetku?";
        return {
          text: `${lead} ${Q}`,
          answer: askT
            ? num(T0, null, [
                { value: h2 / v, why: `To je čas od trenutka $t_2$ naprej; prištej še $${t2}$.` },
                { value: h1 / v, why: `To je čas od trenutka $t_1$ naprej; prištej še $${t1}$.` },
                { value: h0 / (h1 - h2), why: "Smerni koeficient je sprememba na enoto časa: razliko deli še s $t_2 - t_1$." },
              ], U[0])
            : num(h0, null, [
                { value: h1 + v * t2, why: `Začetna vrednost je $${H}(0) = ${H}_1 + v t_1$.` },
                { value: h1 + h2, why: "Količina se zmanjšuje enakomerno; izračunaj, koliko se zmanjša na enoto časa." },
                { value: h1, why: `To je vrednost po $${t1}$ ${candle ? "h" : "min"}, ne na začetku.` },
              ], U[2]),
          hint: "Količina je linearna funkcija časa. Iz dveh meritev izračunaj smerni koeficient (ta je negativen) in začetno vrednost.",
          data: { given: [`t_1 = ${t1}\\ \\mathrm{${U[0]}}`, `${H}_1 = ${tx(h1)}\\ \\mathrm{${U[2]}}`, `t_2 = ${t2}\\ \\mathrm{${U[0]}}`, `${H}_2 = ${tx(h2)}\\ \\mathrm{${U[2]}}`], find: [askT ? "t" : `${H}(0)`] },
          formula: [`${H}(t) = kt + n`, `k = \\dfrac{${H}_2 - ${H}_1}{t_2 - t_1}`],
          solution: `$k = \\dfrac{${tx(h2)} - ${tx(h1)}}{${t2} - ${t1}} = ${tx(-v)}$\n$n = ${H}_1 - k t_1 = ${tx(h1)} + ${tx(v)} \\cdot ${t1} = ${tx(h0)}$\n$${H}(t) = ${tx(-v)}t + ${tx(h0)}$${askT ? `\n$${H}(t) = 0 \\;\\Rightarrow\\; t = \\dfrac{${tx(h0)}}{${tx(v)}} = ${T0}\\ \\mathrm{${U[0]}}$` : `\nNa začetku: $${H}(0) = ${tx(h0)}\\ \\mathrm{${U[2]}}$`}`,
        };
      }
      if (t === 3) {
        // n iz ploščine trikotnika z osema
        const q = r.pick([1, 2, 3, 4]);
        const p = r.nonZero(-4, 4);
        if (gcdI(p, q) !== 1) return null;
        const n = r.int(2, 9);
        const S2 = (n * n * q) / Math.abs(p); // 2S
        if (!Number.isInteger(S2)) return null;
        const S = S2 / 2;
        return {
          text: `Graf funkcije $f(x) = ${kxT(p, q)} + n$, kjer je $n > 0$, in koordinatni osi omejujejo trikotnik s ploščino $${tx(S)}$. Izračunaj $n$.`,
          answer: num(n, null, [
            { value: n * n, why: "Iz $n^2 = \\ldots$ izračunaj še kvadratni koren." },
            { value: Math.sqrt(S * Math.abs(p) / q), why: "Ploščina je $\\frac{|n| \\cdot |x_0|}{2}$: ne pozabi faktorja $2$." },
            { value: (2 * S * Math.abs(p)) / q, why: "Ničla je $-\\frac{n}{k}$, zato ploščina vsebuje $n^2$." },
          ]),
          hint: "Ničla je $x_0 = -\\frac{n}{k}$. Ploščina trikotnika je $\\frac{|n| \\cdot |x_0|}{2}$.",
          data: { given: [`f(x) = ${kxT(p, q)} + n`, `S = ${tx(S)}`], find: ["n"] },
          formula: ["x_0 = -\\dfrac{n}{k}", "S = \\dfrac{|n| \\cdot |x_0|}{2} = \\dfrac{n^2}{2|k|}"],
          solution: `$|x_0| = \\dfrac{n}{|k|} = ${q === 1 ? (Math.abs(p) === 1 ? "n" : `\\dfrac{n}{${Math.abs(p)}}`) : `\\dfrac{${q}n}{${Math.abs(p)}}`}$`.replace("\\dfrac{n}{1}", "n") + `\n$S = \\dfrac{n^2}{2|k|} = ${tx(S)} \\;\\Rightarrow\\; n^2 = ${tx(S)} \\cdot 2 \\cdot ${qT(Math.abs(p), q)} = ${n * n}$\n$n = ${n}$ (ker je $n > 0$)`,
        };
      }
      // pravokotnica na premico v splošni obliki skozi točko
      const A = r.nonZero(-5, 5);
      const B = r.nonZero(-5, 5);
      const C = r.int(-9, 9);
      if (gcdI(gcdI(A, B), C) !== 1) return null;
      const x0 = r.nonZero(-6, 6);
      const y0 = r.int(-6, 6);
      // premica Ax + By + C = 0 ima k = -A/B, pravokotnica k' = B/A
      const [kn, kd] = fr(B, A);
      const nN = y0 * kd - kn * x0;
      return {
        text: `Graf linearne funkcije $f$ je pravokoten na premico $${lin([A, B], ["x", "y"])}${C ? ` ${sg(C)}` : ""} = 0$ in poteka skozi točko $T(${x0}, ${y0})$. Izračunaj začetno vrednost $n$ funkcije $f$.`,
        answer: qA(nN, kd, [
          { value: y0 + (A / B) * x0, why: "To je vzporednica: smerni koeficient dane premice je $-\\frac{A}{B}$, pravokotnice pa $\\frac{B}{A}$." },
          { value: y0 + (B / A) * x0, why: "Iz $y_0 = kx_0 + n$ sledi $n = y_0 - kx_0$." },
        ]),
        hint: "Dano premico zapiši v eksplicitni obliki $y = kx + n$, nato uporabi $k_1 \\cdot k_2 = -1$.",
        data: { given: [`x_0 = ${x0}`, `y_0 = ${y0}`], find: ["n"] },
        formula: ["Ax + By + C = 0 \\;\\Rightarrow\\; k = -\\dfrac{A}{B}", "k_1 \\cdot k_2 = -1"],
        solution: `$${lin([B], ["y"])} = ${lin([-A], ["x"])}${C ? ` ${sg(-C)}` : ""}$, zato je $k = ${qT(-A, B)}$.\nPravokotnica: $k' = -\\dfrac{1}{k} = ${qT(B, A)}$\n$n = y_0 - k' x_0 = ${y0} - ${kd === 1 ? pt(kn) : `\\left(${qT(kn, kd)}\\right)`} \\cdot ${pt(x0)} = ${qT(nN, kd)}$`,
      };
    },
  },

  // ---------------- linearne neenačbe ----------------
  {
    id: P + "linearne-neenacbe",
    topics: [T("linearne-neenacbe"), "MAT-SS-2/mesane-naloge-1-in-2-letnika", "MAT-SS-4/vadbena-maturitetna-pola"],
    gen(level, r) {
      const t = r.int(0, 4);
      const ivAns = (rel, n, d, neg) => {
        const ch = pickAns(r, ivT(rel, n, d), ivWrong(rel, n, d, neg));
        return ch.options.length >= 3 ? ch : null;
      };
      if (level === 1) {
        if (t === 0) {
          // ax + b rel cx + d → interval
          const a = r.nonZero(-5, 6);
          const c = r.nonZero(-5, 6);
          const A = a - c;
          if (A === 0) return null;
          const e = r.int(-7, 7);
          const b = r.nonZero(-9, 9);
          const d = A * e + b;
          const rel = r.pick(["<", "<=", ">", ">="]);
          const relR = relOut(rel, A);
          const ans = ivAns(relR, e, 1, A < 0);
          if (!ans) return null;
          return {
            text: `Reši neenačbo $${ax(a, b)} ${REL[rel]} ${ax(c, d)}$. Rešitev zapiši kot interval.`,
            answer: ans,
            options_tex: true,
            hint: "Člene z $x$ zberi na levi. Če deliš z negativnim številom, obrni znak neenačbe.",
            data: { given: GIV(ax(a, b), ax(c, d)), find: ["x"] },
            formula: FN,
            solution: `$${lin([a], ["x"])} ${tX(-c)} ${REL[rel]} ${tx(d)} ${sg(-b)}$\n$${lin([A], ["x"])} ${REL[rel]} ${d - b}$\n${divLine(A)}\n$x ${REL[relR]} ${e}$, torej $x \\in ${ivT(relR, e)}$.`,
          };
        }
        if (t === 1) {
          // najmanjše ali največje celo število
          const p = r.int(2, 5);
          const q = r.nonZero(-5, 5);
          const c = r.nonZero(-6, 6);
          const s = r.int(-9, 9);
          // p(x + q) rel (p + c)x + s → -c·x rel s - pq
          const rel = r.pick(["<", ">", "<=", ">="]);
          const A = -c;
          const R = s - p * q;
          const [en, ed] = fr(R, A);
          const relR = relOut(rel, A);
          const up = relR === ">" || relR === ">=";
          const e = R / A;
          let ans;
          if (up) ans = relR === ">=" ? Math.ceil(e - 1e-12) : Math.floor(e + 1e-12) + 1;
          else ans = relR === "<=" ? Math.floor(e + 1e-12) : Math.ceil(e - 1e-12) - 1;
          const RHS = ax(p + c, s);
          return {
            text: `Katero je ${up ? "najmanjše" : "največje"} celo število, ki reši neenačbo $${p}(x ${sg(q)}) ${REL[rel]} ${RHS}$?`,
            answer: num(ans, null, [
              { value: up ? ans - 1 : ans + 1, why: up ? "Preveri, ali to število res reši neenačbo (krajišče, strog znak)." : "Preveri, ali to število res reši neenačbo (krajišče, strog znak)." },
              { value: Math.round(e), why: "Krajišče ni nujno rešitev: preveri smer in strogost neenačbe." },
              { value: -ans, why: "Pri prenašanju členov pazi na predznak." },
            ]),
            hint: "Reši neenačbo, nato poišči ustrezno celo število ob krajišču. Pazi, ali je krajišče rešitev.",
            data: { given: GIV(`${p}(x ${sg(q)})`, RHS), find: [up ? "x_{\\min}" : "x_{\\max}"] },
            formula: FN,
            solution: `$${p}x ${sg(p * q)} ${REL[rel]} ${RHS}$\n$${lin([A], ["x"])} ${REL[rel]} ${R}$\n${divLine(A)}\n$x ${REL[relR]} ${qT(R, A)}$${ed === 1 ? "" : ` \\approx ${tx(roundHalfUp(e, 2))}`}\n${up ? "Najmanjše" : "Največje"} celo število v $${ivT(relR, R, A)}$ je $${ans}$.`,
          };
        }
        if (t === 2) {
          // številska premica → interval
          const x0 = r.int(-5, 6);
          const rel = r.pick(["<", ">", "<=", ">="]);
          const closed = rel.length === 2;
          const dir = rel[0] === "<" ? -1 : 1;
          const ans = pickAns(r, ivT(rel, x0), [
            [ivT(FLIP[rel], x0), "Pobarvani del kaže smer: levo so manjša števila, desno večja."],
            [ivT(STRICT[rel], x0), closed ? "Poln krožec pomeni, da krajišče spada zraven: oglati oklepaj." : "Prazen krožec pomeni, da krajišče ne spada zraven: okrogel oklepaj."],
            [dir < 0 ? `(${x0}, -${INF})` : `(${INF}, ${x0})`,"Interval pišemo od manjšega števila k večjemu, $-\\infty$ je vedno na levi."],
            [ivT(rel, -x0), "Preberi, pri katerem številu je krožec."],
          ]);
          return {
            text: `Na številski premici je prikazana množica rešitev neenačbe. Krožec je pri $${x0}$. Kateri interval je prikazan?`,
            figure: { type: "numberline", x0, dir, closed },
            answer: ans,
            options_tex: true,
            hint: "Poln krožec: krajišče spada zraven (oglati oklepaj). Prazen krožec: ne spada zraven (okrogel oklepaj). Pri $\\pm\\infty$ je oklepaj vedno okrogel.",
            data: { given: [`x_0 = ${x0}\\ (\\text{krožec na sliki})`], find: ["\\text{interval}"] },
            formula: ["x < a: (-\\infty, a)", "x \\ge a: [a, \\infty)"],
            solution: `Krožec pri $${x0}$ je ${closed ? "poln, zato krajišče spada zraven" : "prazen, zato krajišče ne spada zraven"}.\nPobarvano je ${dir < 0 ? "levo" : "desno"}: $x ${REL[rel]} ${x0}$.\nInterval: $${ivT(rel, x0)}$`,
          };
        }
        if (t === 3) {
          // negativni ulomljeni koeficient
          const q = r.pick([2, 3, 4, 5]);
          const p = r.int(1, 4);
          if (gcdI(p, q) !== 1) return null;
          const e = q * r.nonZero(-4, 4);
          const b = r.nonZero(-8, 8);
          const c = (-p * e) / q + b;
          const rel = r.pick(["<", "<=", ">", ">="]);
          const relR = FLIP[rel];
          const ans = ivAns(relR, e, 1, true);
          if (!ans) return null;
          return {
            text: `Reši neenačbo $${fT(-p, q, b)} ${REL[rel]} ${c}$. Rešitev zapiši kot interval.`,
            answer: ans,
            options_tex: true,
            hint: "Najprej odštej prosti člen, nato pomnoži z obratno vrednostjo koeficienta. Ta je negativna.",
            data: { given: GIV(fT(-p, q, b), `${c}`), find: ["x"] },
            formula: FN,
            solution: `$${kxT(-p, q)} ${REL[rel]} ${c} ${sg(-b)} = ${c - b}$\nPomnožimo z $${qT(-q, p)}$, ki je negativno, zato se znak obrne.\n$x ${REL[relR]} ${pt(c - b)} \\cdot \\left(${qT(-q, p)}\\right) = ${e}$\n$x \\in ${ivT(relR, e)}$`,
          };
        }
        // besedilna: naročnina in poraba
        const base = r.pick([5, 6, 8, 9, 10, 12]);
        const per = r.pick([0.5, 0.8, 1.2, 1.5, 2, 2.5]);
        const maxN = r.int(4, 20);
        // meja je celo število evrov med ceno za maxN in maxN + 1 GB
        const cLo = Math.ceil(cl(base + per * maxN));
        const cHi = Math.ceil(cl(base + per * (maxN + 1))) - 1;
        if (cHi < cLo) return null;
        const C = r.int(cLo, cHi);
        const lim = (C - base) / per;
        const who = name(r);
        return {
          text: `Mobilni paket stane $${eur(base)}\\ \\text{€}$ na mesec, vsak dodatni gigabajt prenosa pa $${eur(per)}\\ \\text{€}$. ${who} želi, da mesečni račun ne preseže $${eur(C)}\\ \\text{€}$. Največ koliko dodatnih gigabajtov lahko porabi?`,
          answer: num(maxN, null, [
            { value: Math.floor(C / per), why: "Od zneska najprej odštej mesečno naročnino." },
            { value: Math.ceil(lim - 1e-9) === maxN ? maxN + 1 : Math.ceil(lim - 1e-9), why: "Rezultat zaokroži navzdol: z enim gigabajtom več bi račun presegel mejo." },
          ]),
          hint: "Za $x$ gigabajtov je račun $" + eur(base) + " + " + eur(per) + "x$. Ta mora biti manjši ali enak meji.",
          data: { given: [`n = ${eur(base)}\\ \\text{€}`, `k = ${eur(per)}\\ \\text{€/GB}`, `C = ${eur(C)}\\ \\text{€}`], find: ["x_{\\max}"] },
          formula: "n + kx \\le C",
          solution: `$${eur(base)} + ${eur(per)}x \\le ${eur(C)}$\n$${eur(per)}x \\le ${eur(cl(C - base))}$\n$x \\le ${tx(roundHalfUp(lim, 3))}$\nNajveč $${maxN}$ GB.`,
        };
      }
      if (level === 2) {
        if (t === 0) {
          // dvojna neenačba
          const a = r.pick([-5, -4, -3, -2, 2, 3, 4, 5]);
          const b = r.int(-9, 9);
          const L = r.int(-6, 3);
          const U = L + r.int(2, 7);
          const [lo, hi] = a > 0 ? [a * L + b, a * U + b] : [a * U + b, a * L + b];
          const r1 = r.pick(["<", "<="]);
          const r2 = r.pick(["<", "<="]);
          // za x: pri a > 0 r1 velja pri L, r2 pri U; pri a < 0 obratno
          const [rL, rU] = a > 0 ? [r1, r2] : [r2, r1];
          const ints = [];
          for (let x = L - 1; x <= U + 1; x++) if (holds(lo, a * x + b, r1) && holds(a * x + b, hi, r2)) ints.push(x);
          const iv = `${rL === "<" ? "(" : "["}${L}, ${U}${rU === "<" ? ")" : "]"}`;
          const E = `${lo} ${REL[r1]} ${ax(a, b)} ${REL[r2]} ${hi}`;
          const sol = `$${lo} ${sg(-b)} ${REL[r1]} ${lin([a], ["x"])} ${REL[r2]} ${hi} ${sg(-b)}$\n$${lo - b} ${REL[r1]} ${lin([a], ["x"])} ${REL[r2]} ${hi - b}$\n${divLine(a)}\n$${L} ${REL[rL]} x ${REL[rU]} ${U}$, torej $x \\in ${iv}$.`;
          if (r.next() < 0.5) {
            return {
              text: `Koliko celih števil reši neenačbo $${E}$?`,
              answer: num(ints.length, null, [
                { value: U - L + 1, why: "Preveri krajišči: pri strogem znaku krajišče ni rešitev." },
                { value: U - L - 1, why: "Preveri krajišči: pri $\\le$ je krajišče rešitev." },
                { value: U - L, why: "Preštej cela števila na intervalu, upoštevaj krajišči." },
              ]),
              hint: "Od vseh treh delov odštej isto število, nato vse dele deli s koeficientom pred $x$. Pri negativnem obrni oba znaka.",
              data: { given: [`\\text{leva meja} = ${lo}`, `\\text{desna meja} = ${hi}`], find: ["\\text{število celih rešitev}"] },
              formula: FN,
              solution: `${sol}\nCela števila: $${ints.join(", ")}$, skupaj $${ints.length}$.`,
            };
          }
          const wrongs = [
            [`${rL === "<" ? "[" : "("}${L}, ${U}${rU === "<" ? ")" : "]"}`, "Preveri oklepaj pri levem krajišču: ali je znak strog?"],
            [`${rL === "<" ? "(" : "["}${L}, ${U}${rU === "<" ? "]" : ")"}`, "Preveri oklepaj pri desnem krajišču: ali je znak strog?"],
            [`${rL === "<" ? "(" : "["}${-U}, ${-L}${rU === "<" ? ")" : "]"}`, a < 0 ? "Pri deljenju z negativnim številom se zamenjata tudi meji." : "Pazi na predznak pri deljenju."],
          ];
          return {
            text: `Reši neenačbo $${E}$. Rešitev zapiši kot interval.`,
            answer: pickAns(r, iv, wrongs),
            options_tex: true,
            hint: "Od vseh treh delov odštej isto število, nato vse dele deli s koeficientom pred $x$. Pri negativnem obrni oba znaka.",
            data: { given: [`\\text{leva meja} = ${lo}`, `\\text{desna meja} = ${hi}`], find: ["x"] },
            formula: FN,
            solution: sol,
          };
        }
        if (t === 1) {
          // ulomki
          const [m, n] = r.shuffle([2, 3, 4, 5, 6]).slice(0, 2);
          const L = lcmI(m, n);
          const a = r.nonZero(-5, 5);
          const b = r.nonZero(-5, 5);
          const c = r.int(-3, 4);
          const A = L / m - L / n;
          const R = c * L - (L / m) * a + (L / n) * b;
          const rel = r.pick(["<", "<=", ">", ">="]);
          const relR = relOut(rel, A);
          const [en, ed] = fr(R, A);
          if (ed > 6) return null;
          const ans = ivAns(relR, en, ed, A < 0);
          if (!ans) return null;
          return {
            text: `Reši neenačbo $\\dfrac{x ${sg(a)}}{${m}} - \\dfrac{x ${sg(b)}}{${n}} ${REL[rel]} ${c}$. Rešitev zapiši kot interval.`,
            answer: ans,
            options_tex: true,
            hint: "Pomnoži z najmanjšim skupnim večkratnikom imenovalcev (pozitivno število: znak ostane). Minus pred ulomkom velja za ves števec.",
            data: { given: GIV(`\\dfrac{x ${sg(a)}}{${m}} - \\dfrac{x ${sg(b)}}{${n}}`, `${c}`), find: ["x"] },
            formula: FN,
            solution: `Pomnožimo z $${L}$ (znak ostane):\n$${mul(L / m, `x ${sg(a)}`)} - ${mul(L / n, `x ${sg(b)}`)} ${REL[rel]} ${c * L}$\n$${lin([L / m], ["x"])} ${sg((L / m) * a)} ${tX(-(L / n))} ${sg(-(L / n) * b)} ${REL[rel]} ${c * L}$\n$${lin([A], ["x"])} ${REL[rel]} ${R}$\n${divLine(A)}\n$x ${REL[relR]} ${qT(R, A)}$, torej $x \\in ${ivT(relR, en, ed)}$.`,
          };
        }
        if (t === 2) {
          // kvadrati se odštejejo
          const a = r.nonZero(-5, 5);
          const b = r.nonZero(-5, 5);
          const c = r.int(-20, 20);
          if (a === b) return null;
          // (x + a)^2 rel (x + b)^2 + c → 2(a - b)x rel c + b^2 - a^2
          const A = 2 * (a - b);
          const R = c + b * b - a * a;
          const rel = r.pick(["<", "<=", ">", ">="]);
          const relR = relOut(rel, A);
          const [en, ed] = fr(R, A);
          const ans = ivAns(relR, en, ed, A < 0);
          if (!ans) return null;
          const RHS = `(x ${sg(b)})^2${c ? ` ${sg(c)}` : ""}`;
          return {
            text: `Reši neenačbo $(x ${sg(a)})^2 ${REL[rel]} ${RHS}$. Rešitev zapiši kot interval.`,
            answer: ans,
            options_tex: true,
            hint: "Razvij kvadrata. Člena $x^2$ se odštejeta in ostane linearna neenačba.",
            data: { given: GIV(`(x ${sg(a)})^2`, RHS), find: ["x"] },
            formula: ["(x + a)^2 = x^2 + 2ax + a^2", ...FN],
            solution: `$x^2 ${tX(2 * a)} + ${a * a} ${REL[rel]} x^2 ${tX(2 * b)} + ${b * b}${c ? ` ${sg(c)}` : ""}$\n$${lin([A], ["x"])} ${REL[rel]} ${R}$\n${divLine(A)}\n$x ${REL[relR]} ${qT(R, A)}$, torej $x \\in ${ivT(relR, en, ed)}$.`,
          };
        }
        // primerjava ponudb
        const [ctx, unit, uG] = r.pick([["Izposoja kombija", "h", "uro"], ["Najem dvorane", "h", "uro"], ["Izposoja kolesa", "dan", "dan"]]);
        const nA = r.int(5, 30);
        const kA = r.int(3, 12);
        const kB = kA + r.int(2, 8);
        const nB = r.int(0, nA - 1);
        // A: nA + kA x, B: nB + kB x; A cenejša, ko (kB - kA) x > nA - nB
        const lim = (nA - nB) / (kB - kA);
        const ans = Math.floor(lim + 1e-12) + 1;
        const uw = unit === "h" ? "ur" : "dni";
        return {
          text: `${ctx} pri ponudniku A stane $${nA}\\ \\text{€}$ in $${kA}\\ \\text{€}$ za vsak${unit === "h" ? "o" : ""} ${uG}, pri ponudniku B pa ${nB ? `$${nB}\\ \\text{€}$ in ` : ""}$${kB}\\ \\text{€}$ za vsak${unit === "h" ? "o" : ""} ${uG}. Najmanj koliko celih ${uw} mora trajati najem, da je ponudnik A cenejši?`,
          answer: num(ans, null, [
            { value: Number.isInteger(lim) ? lim : Math.floor(lim), why: "Pri tej vrednosti A ni cenejši; vzemi prvo celo število, pri katerem je neenačba stroga in izpolnjena." },
            { value: nB ? Math.ceil((nA + nB) / (kB - kA)) : null, why: `Ko osnovno ceno ponudnika B ($${nB}\\ \\text{€}$) preneseš na drugo stran, ji spremeni predznak.` },
          ]),
          hint: "Zapiši ceni kot linearni funkciji časa in reši neenačbo $A(x) < B(x)$.",
          data: { given: [`n_A = ${nA}\\ \\text{€}`, `k_A = ${kA}\\ \\text{€}`, ...(nB ? [`n_B = ${nB}\\ \\text{€}`] : []), `k_B = ${kB}\\ \\text{€}`], find: ["x_{\\min}"] },
          formula: "n_A + k_A x < n_B + k_B x",
          solution: `$${nA} + ${kA}x < ${nB ? `${nB} + ` : ""}${kB}x$\n$${nA - nB} < ${kB - kA}x$\n$x > ${qT(nA - nB, kB - kA)}$\nNajmanjše celo število: $${ans}$.`,
        };
      }
      // ---------- 3. raven ----------
      if (t === 0) {
        // koliko naravnih števil reši neenačbo
        const [m, n] = r.shuffle([2, 3, 4, 5, 6]).slice(0, 2);
        const L = lcmI(m, n);
        const a = r.nonZero(-4, 4);
        const b = r.nonZero(-4, 4);
        const c = r.int(1, 5);
        const A = L / m - L / n;
        const R = c * L - (L / m) * a + (L / n) * b;
        const rel = r.pick(["<", "<="]);
        const relR = relOut(rel, A);
        if (relR[0] !== "<") return null;
        const e = R / A;
        const ints = [];
        for (let x = 1; x <= 200; x++) if (holds(A * x, R, rel)) ints.push(x);
        if (ints.length < 1 || ints.length > 30) return null;
        return {
          text: `Koliko naravnih števil reši neenačbo $\\dfrac{x ${sg(a)}}{${m}} - \\dfrac{x ${sg(b)}}{${n}} ${REL[rel]} ${c}$?`,
          answer: num(ints.length, null, [
            { value: ints.length + 1, why: "Naravna števila se začnejo z $1$; $0$ ni naravno število." },
            { value: Number.isInteger(e) ? (rel === "<" ? ints.length + 1 : ints.length - 1) : null, why: "Preveri krajišče: ali je pri danem znaku rešitev?" },
            { value: Math.floor(e), why: "Prešteti moraš vsa naravna števila v intervalu rešitev." },
          ]),
          hint: "Reši neenačbo, nato preštej naravna števila ($1, 2, 3, \\ldots$) v intervalu rešitev.",
          data: { given: GIV(`\\dfrac{x ${sg(a)}}{${m}} - \\dfrac{x ${sg(b)}}{${n}}`, `${c}`), find: ["\\text{število naravnih rešitev}"] },
          formula: FN,
          solution: `Pomnožimo z $${L}$:\n$${mul(L / m, `x ${sg(a)}`)} - ${mul(L / n, `x ${sg(b)}`)} ${REL[rel]} ${c * L}$\n$${lin([A], ["x"])} ${REL[rel]} ${R}$\n${divLine(A)}\n$x ${REL[relR]} ${qT(R, A)}$\nNaravne rešitve: $${ints.length <= 6 ? ints.join(", ") : `1, 2, \\ldots, ${ints[ints.length - 1]}`}$, skupaj $${ints.length}$.`,
        };
      }
      if (t === 1) {
        // povprečje točk
        const who = name(r);
        const k = r.int(3, 5);
        const goal = r.pick([70, 75, 80, 85, 90]);
        const sc = Array.from({ length: k }, () => r.int(55, 98));
        const sum = sc.reduce((u, v) => u + v, 0);
        const need = goal * (k + 1) - sum;
        if (need <= 40 || need > 100) return null;
        const scT = sc.slice(0, -1).map((x) => `$${x}$`).join(", ") + ` in $${sc[k - 1]}$`;
        return {
          text: `${who} je na ${k === 3 ? "treh" : k === 4 ? "štirih" : "petih"} testih ${g(who, "dosegel", "dosegla")} ${scT} točk (od $100$). Najmanj koliko točk mora doseči na naslednjem testu, da bo povprečje vseh testov vsaj $${goal}$ točk?`,
          answer: num(need, null, [
            { value: Math.ceil(2 * goal - sum / k), why: "Dosedanjega povprečja in zadnjega testa ne smeš povprečiti kot dve števili: vsak test šteje enako." },
            { value: goal, why: "Zadnji test mora nadomestiti tudi primanjkljaj prejšnjih testov." },
            { value: goal * k - sum, why: `Testov je skupaj $${k + 1}$, ne $${k}$.` },
          ]),
          hint: "Povprečje je vsota vseh točk, deljena s številom testov. Zapiši neenačbo za točke $x$ na zadnjem testu.",
          data: { given: [`\\text{vsota dosedanjih} = ${sc.join(" + ")}`, `\\bar{x} = ${goal}`], find: ["x_{\\min}"] },
          formula: "\\dfrac{\\text{vsota} + x}{n + 1} \\ge \\bar{x}",
          solution: `$\\dfrac{${sum} + x}{${k + 1}} \\ge ${goal}$\n$${sum} + x \\ge ${goal * (k + 1)}$\n$x \\ge ${need}$\nNajmanj $${need}$ točk.`,
        };
      }
      if (t === 2) {
        // definicijsko območje korena
        const a = r.nonZero(-5, 5);
        const e = r.int(-6, 6);
        const b = -a * e;
        const inv = r.next() < 0.4;
        const rel = inv ? ">" : ">=";
        const relR = relOut(rel, a);
        const inner = ax(a, b);
        const ans = pickAns(r, ivT(relR, e), [
          [ivT(FLIP[relR], e), a < 0 ? WHY_FLIP_NEG : "Pod korenom mora biti nenegativno število: preveri smer."],
          [ivT(STRICT[relR], e), inv ? "Ker je koren v imenovalcu, ne sme biti enak $0$: krajišče ni vključeno." : "Koren iz $0$ obstaja: krajišče je vključeno."],
          [ivT(relR, -e), "Pazi na predznak pri reševanju neenačbe."],
        ]);
        return {
          text: `Določi definicijsko območje funkcije $f(x) = ${inv ? `\\dfrac{1}{\\sqrt{${inner}}}` : `\\sqrt{${inner}}`}$.`,
          answer: ans,
          options_tex: true,
          hint: inv ? "Izraz pod korenom mora biti nenegativen, v imenovalcu pa ne sme biti $0$: torej strogo pozitiven." : "Izraz pod kvadratnim korenom mora biti nenegativen.",
          data: { given: [`f(x) = ${inv ? `\\dfrac{1}{\\sqrt{${inner}}}` : `\\sqrt{${inner}}`}`], find: ["D_f"] },
          formula: inv ? "\\dfrac{1}{\\sqrt{g(x)}}: g(x) > 0" : "\\sqrt{g(x)}: g(x) \\ge 0",
          solution: `$${inner} ${REL[rel]} 0$\n$${lin([a], ["x"])} ${REL[rel]} ${-b}$\n${divLine(a)}\n$x ${REL[relR]} ${e}$\n$D_f = ${ivT(relR, e)}$`.replace(" - 0$", "$"),
        };
      }
      if (t === 3) {
        // f(x) > g(x)
        const q1 = r.pick([1, 2, 3]);
        const p1 = r.nonZero(-4, 4);
        const k2 = r.nonZero(-3, 3);
        const n1 = r.int(-6, 6);
        const n2 = r.int(-6, 6);
        // f - g = (p1/q1 - k2) x + (n1 - n2)
        const An = p1 - k2 * q1; // koeficient * q1
        if (An === 0) return null;
        const Rn = (n2 - n1) * q1;
        const above = r.next() < 0.5;
        const rel = above ? ">" : "<";
        const relR = relOut(rel, An);
        const [en, ed] = fr(Rn, An);
        if (ed > 6) return null;
        const ans = ivAns(relR, en, ed, An < 0);
        if (!ans) return null;
        return {
          text: `Dani sta funkciji $f(x) = ${fT(p1, q1, n1)}$ in $g(x) = ${fT(k2, 1, n2)}$. Za katere $x$ leži graf funkcije $f$ ${above ? "nad" : "pod"} grafom funkcije $g$?`,
          answer: ans,
          options_tex: true,
          hint: `Reši neenačbo $f(x) ${above ? ">" : "<"} g(x)$.`,
          data: { given: [`f(x) = ${fT(p1, q1, n1)}`, `g(x) = ${fT(k2, 1, n2)}`], find: ["x"] },
          formula: `f(x) ${above ? ">" : "<"} g(x)`,
          solution: `$${fT(p1, q1, n1)} ${rel} ${fT(k2, 1, n2)}$\n${q1 > 1 ? `Pomnožimo s $${q1}$: $${ax(p1, n1 * q1)} ${rel} ${ax(k2 * q1, n2 * q1)}$\n` : ""}$${lin([An], ["x"])} ${rel} ${Rn}$\n${divLine(An)}\n$x ${REL[relR]} ${qT(Rn, An)}$, torej $x \\in ${ivT(relR, en, ed)}$.`,
        };
      }
      // poseben primer: prazna množica ali vsa realna števila
      const p = r.int(2, 5);
      const q = r.nonZero(-6, 6);
      const s = r.int(1, 4);
      const w = r.nonZero(-9, 9);
      // p(x + q) + s·x  rel  (p + s)x + w  →  0·x rel w - pq
      const rel = r.pick(["<", "<=", ">", ">="]);
      const R = w - p * q;
      const all = holds(0, R, rel);
      const E = `${p}(x ${sg(q)}) + ${lin([s], ["x"])} ${REL[rel]} ${ax(p + s, w)}`;
      const OPT = ["\\emptyset", "\\mathbb{R} = (-\\infty, \\infty)", ivT(rel, R, 1), ivT(FLIP[rel], R, 1)];
      const WHY = [
        "Trditev brez $x$ je resnična, zato jo izpolni vsak $x$.",
        "Trditev brez $x$ je neresnična, zato je ne izpolni noben $x$.",
        "Člen z $x$ se odšteje: ostane trditev brez $x$, ki je resnična za vse ali za noben $x$.",
        "Člen z $x$ se odšteje: ostane trditev brez $x$, ki je resnična za vse ali za noben $x$.",
      ];
      const ci = all ? 1 : 0;
      return {
        text: `Reši neenačbo $${E}$.`,
        answer: pickAns(r, OPT[ci], OPT.map((o, i) => [o, WHY[i]]).filter((_, i) => i !== ci)),
        options_tex: true,
        hint: "Odpravi oklepaj in zberi člene z $x$ na levi. Kaj ostane?",
        data: { given: GIV(`${p}(x ${sg(q)}) + ${lin([s], ["x"])}`, ax(p + s, w)), find: ["x"] },
        formula: ["0 \\cdot x < b,\\ b > 0: x \\in \\mathbb{R}", "0 \\cdot x < b,\\ b \\le 0: x \\in \\emptyset"],
        solution: `$${ax(p + s, p * q)} ${REL[rel]} ${ax(p + s, w)}$\n$0 \\cdot x ${REL[rel]} ${R}$\nTrditev $0 ${REL[rel]} ${R}$ je ${all ? "resnična" : "neresnična"}, zato ${all ? "neenačbo reši vsako realno število: $x \\in \\mathbb{R}$" : "neenačba nima rešitve: $\\emptyset$"}.`,
      };
    },
  },
];

// Deljenje z 1 ni korak rešitve: vrstico izpustimo, prav tako enako vrstico tik pred njo.
const brezDeljenjaZ1 = (s) => {
  const L = s.split("\n");
  const i = L.indexOf(divLine(1));
  if (i < 1) return s;
  const dup = (L[i + 1] || "").startsWith(L[i - 1]);
  L.splice(dup ? i - 1 : i, dup ? 2 : 1);
  return L.join("\n");
};
const LINEARNE_CISTE = LINEARNE.map((g) => ({
  ...g,
  gen(level, r, topic) {
    const t = g.gen(level, r, topic);
    if (t && typeof t.solution === "string") t.solution = brezDeljenjaZ1(t.solution);
    return t;
  },
}));

export const MATURA_MAT_SS1 = wrapGens([...GENS, ...LINEARNE_CISTE]);
