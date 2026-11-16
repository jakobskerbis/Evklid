// Naloge za teme matematike, dodane po primerjavi z učnimi načrti (2026-10-30): množice in diagrami (OŠ 6),
// točke, premice in ravnine v prostoru (OŠ 9), osnove logike, koordinatni sistem, funkcije, transformacije
// grafov, potenčna in korenska funkcija, matematična indukcija (gimnazija). Merila: docs/kakovost.md §2.
// Vsak odgovor je izračunan v kodi iz istih števil, kot so v besedilu.
import { gcd } from "../check.js";
import { nOf, verbOf } from "../rng.js";
import { lv, tt, tx, dat, eq, res, M, num, frac, choice, T, sortiraj } from "./vrzeli-util.js";

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const setTex = (arr) => `\\{${arr.join(", ")}\\}`;
const par = (x) => (x < 0 ? `(${x})` : `${x}`);
const sg = (n) => (n < 0 ? `- ${-n}` : `+ ${n}`);
const lcm = (a, b) => (a * b) / gcd(a, b);
// Okrajšan ulomek v TeX: fracTex(8, -4) → "-2", fracTex(-8, 3) → "-\\dfrac{8}{3}".
const fracTex = (n, d) => {
  const g = gcd(Math.abs(n), Math.abs(d)) || 1, s = n * d < 0 ? "-" : "";
  const p = Math.abs(n) / g, q = Math.abs(d) / g;
  return q === 1 ? `${s}${p}` : `${s}\\dfrac{${p}}{${q}}`;
};
// Glagol na začetku besedne zveze ob številu 2–4: vb(3, "igra klavir") → "igrajo klavir".
const VB = { trenira: ["trenirata", "trenirajo"], obiskuje: ["obiskujeta", "obiskujejo"], ima: ["imata", "imajo"], igra: ["igrata", "igrajo"], poje: ["pojeta", "pojejo"] };
const vb = (n, t) => t.replace(/^\S+/, (w) => (VB[w] ? verbOf(n, w, VB[w][0], VB[w][1]) : w));
const mono = (c, v) => (c === 1 ? v : c === -1 ? `-${v}` : `${c}${v}`);

// ------------------------------------------------------------ logika: izjave kot funkcije
const OPS = { in: ["\\wedge", "∧", (x, y) => x && y], ali: ["\\vee", "∨", (x, y) => x || y], imp: ["\\Rightarrow", "⇒", (x, y) => !x || y], ekv: ["\\Leftrightarrow", "⇔", (x, y) => x === y] };
const L = (n, neg = false) => ({ t: neg ? `\\neg ${n}` : n, u: neg ? `¬${n}` : n, f: (v) => (neg ? !v[n] : v[n]), atom: true });
const wrapT = (a) => (a.atom ? a.t : `(${a.t})`);
const wrapU = (a) => (a.atom ? a.u : `(${a.u})`);
const B2 = (op, a, b) => ({ t: `${wrapT(a)} ${OPS[op][0]} ${wrapT(b)}`, u: `${wrapU(a)} ${OPS[op][1]} ${wrapU(b)}`, f: (v) => OPS[op][2](a.f(v), b.f(v)) });
const NOT = (a) => ({ t: `\\neg ${wrapT(a)}`, u: `¬${wrapU(a)}`, f: (v) => !a.f(v), atom: true });
const A_ = L("A"), B_ = L("B"), C_ = L("C"), nA = L("A", true), nB = L("B", true), nC = L("C", true);
const rows = (vars) => range(0, 2 ** vars.length - 1).map((i) => Object.fromEntries(vars.map((x, k) => [x, !((i >> (vars.length - 1 - k)) & 1)])));
const R2 = rows(["A", "B"]), R3 = rows(["A", "B", "C"]);
const PN = (b) => (b ? "P" : "N");
const PNw = (b) => (b ? "pravilna" : "nepravilna");
const rowTxt = (v) => Object.entries(v).map(([k, b]) => `${k} ${PNw(b)}`).join(", ");
// »ko je A pravilna in B nepravilna« (za razlage napak).
const koTxt = (v) => "ko je " + Object.entries(v).map(([k, b]) => `${k} ${PNw(b)}`).join(", ").replace(/, ([^,]*)$/, " in $1");
const vVrst = (n) => `v $${n}$ ${n === 1 ? "vrstici" : "vrsticah"}`;
const col = (F, R) => R.map((v) => F.f(v));
const sameCol = (F, G, R) => R.every((v) => F.f(v) === G.f(v));
const firstDiff = (F, G, R) => R.find((v) => F.f(v) !== G.f(v));

// ------------------------------------------------------------ kocka ABCDEFGH
const V3 = { A: [0, 0, 0], B: [1, 0, 0], C: [1, 1, 0], D: [0, 1, 0], E: [0, 0, 1], F: [1, 0, 1], G: [1, 1, 1], H: [0, 1, 1] };
const EDGES = ["AB", "BC", "CD", "DA", "EF", "FG", "GH", "HE", "AE", "BF", "CG", "DH"];
const FDIAG = ["AC", "BD", "EG", "FH", "AF", "BE", "BG", "CF", "CH", "DG", "AH", "DE"];
const SDIAG = ["AG", "BH", "CE", "DF"];
const PLANES = [["ABCD", "spodnja ploskev"], ["EFGH", "zgornja ploskev"], ["ABFE", "sprednja ploskev"], ["DCGH", "zadnja ploskev"], ["ADHE", "leva ploskev"], ["BCGF", "desna ploskev"], ["ACGE", "diagonalni presek"], ["BDHF", "diagonalni presek"]];
const vsub = (p, q) => p.map((x, i) => x - q[i]);
const vadd = (p, q) => p.map((x, i) => x + q[i]);
const vmul = (p, k) => p.map((x) => x * k);
const vdot = (p, q) => p.reduce((s, x, i) => s + x * q[i], 0);
const vcross = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
const vlen = (p) => Math.hypot(...p);
const z0 = (x) => Math.abs(x) < 1e-9;
const vName = (p) => Object.keys(V3).find((k) => vlen(vsub(V3[k], p)) < 1e-9);
const dir = (l) => vsub(V3[l[1]], V3[l[0]]);
function relLL(l1, l2) {
  const P1 = V3[l1[0]], d1 = dir(l1), w = vsub(V3[l2[0]], P1), d2 = dir(l2), c = vcross(d1, d2);
  if (z0(vlen(c))) return { rel: z0(vlen(vcross(d1, w))) ? "isti" : "vzp" };
  if (!z0(vdot(w, c))) return { rel: "mim" };
  const X = vadd(P1, vmul(d1, vdot(vcross(w, d2), c) / vdot(c, c)));
  return { rel: "sek", X: vName(X) };
}
const plane = (p) => ({ P: V3[p[0]], n: vcross(vsub(V3[p[1]], V3[p[0]]), vsub(V3[p[2]], V3[p[0]])) });
function relLP(l, p) {
  const { P, n } = plane(p), d = dir(l), Q = V3[l[0]];
  if (z0(vdot(d, n))) return { rel: z0(vdot(vsub(Q, P), n)) ? "lezi" : "vzp" };
  const X = vadd(Q, vmul(d, vdot(vsub(P, Q), n) / vdot(d, n)));
  return { rel: "preb", X: vName(X), perp: z0(vlen(vcross(d, n))) };
}
const CUBE = "V kocki $ABCDEFGH$ je $ABCD$ spodnja ploskev, oglišča $E$, $F$, $G$ in $H$ pa ležijo po vrsti nad $A$, $B$, $C$ in $D$.";
const binom = (n, k) => (k < 0 || k > n ? 0 : range(1, k).reduce((p, i) => (p * (n - k + i)) / i, 1));

export const DODATNE_VRZELI_MAT = [
  // ------------------------------------------------------------ OŠ 6: množice in diagrami
  {
    id: "vrz-mnozice-diagrami",
    topics: ["MAT-OS-6/mnozice-in-diagrami"],
    gen(level, r) {
      level = lv(level);
      const LAST = [
        ["soda števila", (n) => n % 2 === 0], ["liha števila", (n) => n % 2 === 1], ["večkratniki števila 3", (n) => n % 3 === 0], ["večkratniki števila 4", (n) => n % 4 === 0],
        ["večkratniki števila 5", (n) => n % 5 === 0], ["števila, večja od 12", (n) => n > 12], ["delitelji števila 24", (n) => 24 % n === 0], ["delitelji števila 30", (n) => 30 % n === 0],
      ];
      const mult = (a, N) => range(1, N).filter((x) => x % a === 0);
      const k = r.int(0, 2);
      if (level === 1 && k === 0) {
        const [pa, pb] = r.shuffle(LAST.filter((p, i) => i > 1 || r.next() < 0.5)).slice(0, 2);
        const n = r.int(1, 20), a = pa[1](n), b = pb[1](n);
        const REG = [["v presek obeh krogov", a && b], ["samo v krog A", a && !b], ["samo v krog B", !a && b], ["zunaj obeh krogov", !a && !b]];
        const idx = REG.findIndex((x) => x[1]);
        const why = REG.map((x, i) => {
          if (i === idx) return null;
          if (i === 0) return `${n} ni hkrati v A in v B. V presek sodijo le števila, ki so v obeh množicah.`;
          if (i === 1) return a ? `${n} je tudi v B, zato sodi v presek.` : `${n} ni v množici A (${pa[0]}).`;
          if (i === 2) return b ? `${n} je tudi v A, zato sodi v presek.` : `${n} ni v množici B (${pb[0]}).`;
          return `${n} je v množici ${a ? "A" : "B"}, zato je znotraj kroga.`;
        });
        return T(
          `Univerzalna množica so naravna števila od 1 do 20. Množica $A$ so ${pa[0]}, množica $B$ pa ${pb[0]}. Kam v Euler-Vennovem diagramu zapišemo število $${n}$?`,
          { type: "choice", options: REG.map((x) => x[0]), index: idx, why },
          "Za število posebej preveri, ali je v A in ali je v B.",
          [`n = ${n}`], [tt("območje v diagramu")], false,
          [`${n} ${a ? "je" : "ni"} v množici A (${pa[0]}).`, `${n} ${b ? "je" : "ni"} v množici B (${pb[0]}).`, `Zato ga zapišemo ${REG[idx][0]}.`],
        );
      }
      if (level === 1 && k === 2) return sortiraj("carroll", 1, r);
      if ((level === 1 && k === 1) || (level === 2 && k === 0)) {
        let a, b, N, A, B, P;
        do {
          a = r.pick([2, 3, 4, 5]);
          b = r.pick([2, 3, 4, 5, 6].filter((x) => x !== a));
          N = a === 2 || b === 2 ? 20 : r.pick([24, 30]);
          A = mult(a, N);
          B = mult(b, N);
          P = A.filter((x) => B.includes(x));
        } while (!P.length);
        const U = [...new Set([...A, ...B])].sort((x, y) => x - y);
        const presek = level === 1;
        return T(
          `Množica $A = ${setTex(A)}$ so večkratniki števila ${a}, množica $B = ${setTex(B)}$ pa večkratniki števila ${b}, ki niso večji od ${N}. Koliko elementov ima ${presek ? "presek $A \\cap B$" : "unija $A \\cup B$"}?`,
          num(presek ? P.length : U.length, "", null, presek
            ? [M(A.length + B.length, "Si preštel vse elemente obeh množic? V presek sodijo le elementi, ki so v A in hkrati v B."), M(U.length, "To je število elementov unije. Presek so le skupni elementi.")]
            : [M(A.length + B.length, `Skupne elemente si štel dvakrat. Vsak element unije šteješ le enkrat.`), M(P.length, "To je število skupnih elementov (presek). Unija so vsi elementi, ki so v A ali v B.")]),
          presek ? "Poišči števila, ki so v obeh seznamih." : "Zapiši vse elemente iz A, nato dodaj še tiste iz B, ki jih še ni.",
          [`A = ${setTex(A)}`, `B = ${setTex(B)}`], [presek ? "A \\cap B" : "A \\cup B"],
          presek ? "A \\cap B = \\{x;\\ x \\in A \\text{ in } x \\in B\\}" : "A \\cup B = \\{x;\\ x \\in A \\text{ ali } x \\in B\\}",
          presek
            ? [`Skupni elementi: $A \\cap B = ${setTex(P)}$ (večkratniki števila ${lcm(a, b)}).`, `Presek ima $${P.length}$ elementov.`]
            : [`$A \\cup B = ${setTex(U)}$`, `Skupnih elementov $${setTex(P)}$ ne štejemo dvakrat.`, `Unija ima $${U.length}$ elementov.`],
        );
      }
      if (level === 2 && k === 1) {
        const CTX = [
          ["trenira nogomet", "trenira košarko", "trenira oba športa", "ne trenira nobenega od teh dveh športov"],
          ["poje v pevskem zboru", "obiskuje plesni krožek", "obiskuje oboje", "ne obiskuje ne zbora ne plesnega krožka"],
          ["ima doma psa", "ima doma mačko", "ima psa in mačko", "nima ne psa ne mačke"],
          ["igra klavir", "igra kitaro", "igra oba inštrumenta", "ne igra nobenega od teh dveh inštrumentov"],
        ];
        const c = r.int(2, 6), a = c + r.int(3, 9), b = c + r.int(3, 8), U = a + b - c, N = U + r.int(1, 6), x = r.pick(CTX);
        return T(
          `V razredu je ${N} učencev. ${a} jih ${x[0]}, ${b} jih ${x[1]}, ${c} pa ${c >= 5 ? `jih ${x[2]}` : vb(c, x[2])}. Koliko učencev ${x[3]}?`,
          num(N - U, "", null, [M(N - a - b, `Učence, ki ${vb(3, x[2])}, si odštel dvakrat. Šteti jih moraš le enkrat.`), M(U, "To je število učencev v uniji (vsaj eno od obojega). Odšteti ga moraš od vseh učencev."), M(N - a - b - c, "Presek moraš k vsoti prišteti nazaj, ne odšteti.")]),
          "Nariši Vennov diagram: v presek zapiši tiste z obojim, nato izračunaj, koliko jih je vsaj v enem krogu.",
          [`n = ${N}`, `n(A) = ${a}`, `n(B) = ${b}`, `n(A \\cap B) = ${c}`], [tt("zunaj obeh krogov")],
          "n(A \\cup B) = n(A) + n(B) - n(A \\cap B)",
          [`V uniji (vsaj eno): $${a} + ${b} - ${c} = ${U}$ (tiste v preseku smo šteli dvakrat).`, `Zunaj obeh krogov: $${N} - ${U} = ${N - U}$.`],
        );
      }
      if (level === 2 && k === 2) {
        const N = r.pick([20, 25, 30]), m = r.pick([8, 10, 12, 15]);
        const p1 = r.pick([["sodo", (x) => x % 2 === 0], ["liho", (x) => x % 2 === 1]]), p2 = r.pick([[`večje od ${m}`, (x) => x > m], [`največ ${m}`, (x) => x <= m]]);
        const all = range(1, N), hit = all.filter((x) => p1[1](x) && p2[1](x));
        return T(
          `Števila od 1 do ${N} razvrstimo v Carrollov diagram: vrstici sta »sodo« in »liho«, stolpca pa »večje od ${m}« in »največ ${m}«. Koliko števil je v polju »${p1[0]} in ${p2[0]}«?`,
          num(hit.length, "", null, [M(all.filter(p1[1]).length, `Si preštel vsa števila v vrstici »${p1[0]}«? Upoštevati moraš še stolpec »${p2[0]}«.`), M(all.filter(p2[1]).length, `Si upošteval le stolpec »${p2[0]}«? Število mora biti tudi v vrstici »${p1[0]}«.`)]),
          "V polje sodijo števila, ki ustrezajo obema pogojema hkrati. Zapiši jih po vrsti.",
          [`${tt("zadnje število")} = ${N}`, `${tt("meja")} = ${m}`], [tt("število števil v polju")], false,
          [`Števila v polju »${p1[0]} in ${p2[0]}«: ${hit.join(", ")}.`, `Teh je $${hit.length}$.`],
        );
      }
      if (level === 3 && k === 0) {
        const c = r.int(3, 9), a = c + r.int(4, 12), b = c + r.int(3, 10), U = a + b - c;
        const x = r.pick([["psa", "mačko", "imajo psa ali mačko (ali oboje)", "ima psa in mačko"], ["kolo", "rolko", "imajo kolo ali rolko (ali oboje)", "ima kolo in rolko"], ["sestro", "brata", "imajo sestro ali brata (ali oboje)", "ima sestro in brata"]]);
        return T(
          `V anketi so sodelovali le ljudje, ki ${x[2]}. Vseh je bilo ${U}. ${x[0] === "psa" ? "Psa" : x[0] === "kolo" ? "Kolo" : "Sestro"} jih ima ${a}, ${x[1]} pa ${b}. Koliko jih ${x[3]}?`,
          num(c, "", null, [M(a + b, "To je vsota obeh skupin. Tisti z obojim so v njej šteti dvakrat."), M(U - a, `To je število tistih, ki imajo samo ${x[1]}.`), M(U - b, `To je število tistih, ki imajo samo ${x[0]}.`)]),
          "V vsoti obeh skupin so tisti z obojim šteti dvakrat. Primerjaj to vsoto s številom vseh.",
          [`n(A \\cup B) = ${U}`, `n(A) = ${a}`, `n(B) = ${b}`], ["n(A \\cap B)"],
          "n(A \\cup B) = n(A) + n(B) - n(A \\cap B)",
          [`$${a} + ${b} = ${a + b}$, a vseh je le $${U}$.`, `Razlika so tisti, ki so šteti dvakrat: $${a + b} - ${U} = ${c}$.`],
        );
      }
      if (level === 3 && k === 1) {
        const c = r.int(2, 7), a = c + r.int(3, 10), b = c + r.int(3, 9), U = a + b - c, d = r.int(1, 6), N = U + d;
        return T(
          `V razredu je ${N} učencev. ${a} jih rado bere, ${b} jih rado riše, ${d} pa ${verbOf(d, "ne mara", "ne marata", "ne marajo")} ne branja ne risanja. Koliko učencev rado bere in riše?`,
          num(c, "", null, [M(a + b - N, `Si pozabil na ${nOf(d, "učenca", "učenca", "učence", "učencev")}, ki ne marajo ničesar od tega? Niso v nobenem krogu.`), M(U, "To je število učencev, ki imajo radi vsaj eno. Iščemo presek."), M(N - d - a, "To je število tistih, ki le radi rišejo.")]),
          "Najprej izračunaj, koliko učencev je v vsaj enem krogu Vennovega diagrama.",
          [`n = ${N}`, `n(A) = ${a}`, `n(B) = ${b}`, `${tt("nobeno")} = ${d}`], ["n(A \\cap B)"],
          "n(A \\cup B) = n(A) + n(B) - n(A \\cap B)",
          [`V vsaj enem krogu: $${N} - ${d} = ${U}$.`, `$n(A \\cap B) = n(A) + n(B) - n(A \\cup B) = ${a} + ${b} - ${U} = ${c}$.`],
        );
      }
      if (level === 3) {
        const [a, b] = r.shuffle([2, 3, 4, 5, 6, 7]).slice(0, 2), N = r.pick([20, 30, 40]);
        const nA = Math.floor(N / a), nB = Math.floor(N / b), l = lcm(a, b), nAB = Math.floor(N / l), U = nA + nB - nAB;
        return T(
          `Med števili od 1 do ${N} je $A$ množica večkratnikov števila ${a}, $B$ pa množica večkratnikov števila ${b}. Koliko števil od 1 do ${N} ni ne v $A$ ne v $B$?`,
          num(N - U, "", null, [M(N - nA - nB, `Skupne večkratnike (večkratnike števila ${l}) si odštel dvakrat, zato jih moraš enkrat prišteti nazaj.`), M(N - nA, "Odšteti moraš tudi večkratnike drugega števila."), M(U, "To je število elementov unije. Iščemo števila zunaj obeh krogov.")]),
          `Preštej večkratnike vsakega števila in skupne večkratnike (večkratnike števila ${l}).`,
          [`${tt("zadnje število")} = ${N}`], [tt("zunaj A in B")],
          "n(A \\cup B) = n(A) + n(B) - n(A \\cap B)",
          [`$n(A) = ${nA}$, $n(B) = ${nB}$, skupni večkratniki števila ${l}: $n(A \\cap B) = ${nAB}$.`, `$n(A \\cup B) = ${nA} + ${nB} - ${nAB} = ${U}$`, `Zunaj obeh: $${N} - ${U} = ${N - U}$.`],
        );
      }
      return sortiraj("carroll", 3, r);
    },
  },

  // ------------------------------------------------------------ OŠ 9: točke, premice in ravnine v prostoru
  {
    id: "vrz-prostor",
    topics: ["MAT-OS-9/tocke-premice-in-ravnine-v-prostoru"],
    gen(level, r) {
      level = lv(level);
      const k = r.int(0, 2);
      if (level === 1 && k !== 1) {
        let l1, l2, R;
        do {
          [l1, l2] = r.shuffle([...EDGES, ...FDIAG]).slice(0, 2);
          R = relLL(l1, l2);
        } while (R.rel === "isti");
        const OPT = [["sta vzporedni", "vzp"], ["se sekata", "sek"], ["sta mimobežni", "mim"]];
        const idx = OPT.findIndex((o) => o[1] === R.rel);
        const sekX = R.X ? `oglišču $${R.X}$` : "središču ploskve";
        const why = OPT.map(([, k2]) => {
          if (k2 === R.rel) return null;
          if (k2 === "vzp") return "Vzporedni premici imata isto smer. Ti dve nimata iste smeri.";
          if (k2 === "sek") return R.rel === "vzp" ? "Vzporedni premici nimata skupne točke." : "Premici nimata skupne točke: ne ležita v isti ravnini.";
          return R.rel === "sek" ? "Premici imata skupno točko, zato nista mimobežni." : "Vzporedni premici ležita v isti ravnini, mimobežni pa ne.";
        });
        return T(
          `${CUBE} Kakšna je medsebojna lega premic $${l1}$ in $${l2}$?`,
          { type: "choice", options: OPT.map((o) => o[0]), index: idx, why },
          "Poišči, ali imata premici skupno točko. Če je nimata, preveri, ali ležita v isti ploskvi ali preseku kocke.",
          [`${tt("premici")} = ${l1},\\ ${l2}`], [tt("medsebojna lega")], false,
          [R.rel === "vzp" ? "Premici imata isto smer in ležita v isti ravnini, skupne točke nimata: sta vzporedni." : R.rel === "sek" ? `Premici imata skupno točko v ${sekX.replace("$", "$")}, zato se sekata.` : "Premici nimata skupne točke in ne ležita v isti ravnini: sta mimobežni."],
        );
      }
      if (level === 1) {
        const e = r.pick(EDGES), q = r.pick(["vzp", "mim", "sek"]);
        const others = EDGES.filter((x) => x !== e).map((x) => [x, relLL(e, x).rel]);
        const hit = others.filter((x) => x[1] === q).map((x) => x[0]);
        const text = q === "vzp" ? `Koliko robov kocke je vzporednih z robom $${e}$? Roba $${e}$ ne štej.` : q === "mim" ? `Koliko robov kocke je mimobežnih z robom $${e}$?` : `Koliko robov kocke ima z robom $${e}$ skupno oglišče? Roba $${e}$ ne štej.`;
        const mist = q === "vzp" ? [M(4, `Si štel tudi rob ${e}?`), M(1, "Vzporedni so robovi v vseh ploskvah, ne le nasprotni rob iste ploskve.")]
          : q === "mim" ? [M(7, "Vzporedni robovi ležijo z robom v isti ravnini, zato niso mimobežni."), M(3, "To so vzporedni robovi. Mimobežni nimajo skupne točke in niso vzporedni.")]
            : [M(2, "V vsakem krajišču roba se stikata še dva robova."), M(3, "Kocka ima v vsakem oglišču tri robove; dva krajišča roba dasta skupaj štiri druge robove.")];
        return T(
          `${CUBE} ${text}`,
          num(hit.length, "", null, mist),
          q === "vzp" ? "Pomisli na robove, ki kažejo v isto smer kot rob." : q === "mim" ? "Od vseh robov odštej tiste, ki imajo z robom skupno točko, in vzporedne." : "Poglej obe krajišči roba in robove, ki se tam stikajo.",
          [`${tt("rob")} = ${e}`], [tt("število robov")], false,
          [`Taki robovi so: ${hit.map((x) => `$${x}$`).join(", ")}.`, `Teh je $${hit.length}$.`],
        );
      }
      if (level === 2 && k === 0) {
        const l = r.pick([...EDGES, ...FDIAG, ...SDIAG]), [p, pn] = r.pick(PLANES), R = relLP(l, p);
        const OPT = [["leži v ravnini", "lezi"], ["je vzporedna z ravnino", "vzp"], ["prebada ravnino", "preb"]];
        const why = OPT.map(([, k2]) => {
          if (k2 === R.rel) return null;
          if (k2 === "lezi") return "Ne leži v njej: vsaj eno krajišče premice ni v ravnini.";
          if (k2 === "vzp") return R.rel === "lezi" ? "Premica, ki leži v ravnini, ni vzporedna z njo (ima z njo vse točke skupne)." : "Premica ima z ravnino skupno točko, zato ni vzporedna z njo.";
          return R.rel === "lezi" ? "Premica ima z ravnino vse točke skupne, ne le ene." : "Premica nima z ravnino nobene skupne točke.";
        });
        return T(
          `${CUBE} Kakšna je lega premice $${l}$ glede na ravnino $${p}$ (${pn})?`,
          { type: "choice", options: OPT.map((o) => o[0]), index: OPT.findIndex((o) => o[1] === R.rel), why },
          "Preveri, ali krajišči premice ležita v ravnini. Če ne, poglej, ali premica kaže »skozi« ravnino.",
          [`${tt("premica")} = ${l}`, `${tt("ravnina")} = ${p}`], [tt("lega premice")], false,
          [R.rel === "lezi" ? `Obe točki $${l[0]}$ in $${l[1]}$ ležita v ravnini, zato premica leži v ravnini.` : R.rel === "vzp" ? `Premica nima skupne točke z ravnino, je pa vzporedna s premico v ravnini, zato je vzporedna z ravnino.` : `Premica ima z ravnino natanko eno skupno točko${R.X ? `, oglišče $${R.X}$` : ""}, zato jo prebada.${R.perp ? " Je celo pravokotna nanjo." : ""}`],
        );
      }
      if (level === 2 && k === 1) {
        const pool = [...EDGES, ...FDIAG, ...SDIAG];
        const cand = PLANES.filter(([p]) => pool.some((l) => relLP(l, p).perp));
        const [p, pn] = r.pick(cand);
        const right = r.pick(pool.filter((l) => relLP(l, p).perp));
        const wrong = r.shuffle(pool.filter((l) => !relLP(l, p).perp)).slice(0, 3).map((l) => {
          const R = relLP(l, p);
          return [`$${l}$`, R.rel === "lezi" ? `Premica ${l} leži v ravnini ${p}, zato ni pravokotna nanjo.` : R.rel === "vzp" ? `Premica ${l} je vzporedna z ravnino ${p}.` : `Premica ${l} prebada ravnino poševno: ni pravokotna na vse premice v ravnini.`];
        });
        return T(
          `${CUBE} Katera premica je pravokotna na ravnino $${p}$ (${pn})?`,
          choice(r, `$${right}$`, wrong),
          "Premica je pravokotna na ravnino, če je pravokotna na dve nevzporedni premici v tej ravnini.",
          [`${tt("ravnina")} = ${p}`], [tt("pravokotnica na ravnino")], false,
          [`Premica $${right}$ je pravokotna na dve nevzporedni premici v ravnini ${p}, zato je pravokotna na ravnino.`],
        );
      }
      if (level === 2) {
        const [p] = r.pick(PLANES), { P, n } = plane(p);
        const X = r.pick(Object.keys(V3).filter((v) => !p.includes(v)));
        const kf = Math.abs(vdot(vsub(V3[X], P), n)) / vlen(n);
        const foot = vsub(V3[X], vmul(n, vdot(vsub(V3[X], P), n) / vdot(n, n)));
        const a = r.pick([3, 4, 5, 6, 8, 10, 12, 2.5, 4.5, 7.5]), d = kf * a, face = Math.abs(kf - 1) < 1e-9;
        const Y = face ? vName(foot) : vName(vsub(vmul(foot, 2), V3[X]));
        return T(
          `${CUBE} Rob kocke meri $a = ${tx(a)}\\ \\mathrm{cm}$. Kolikšna je razdalja oglišča $${X}$ od ravnine $${p}$? Zaokroži na dve decimalki.`,
          num(d, "cm", 2, face ? [M(a * Math.SQRT2, "To je diagonala ploskve. Razdalja je dolžina pravokotnice, tu je to rob."), M(a / 2, "Razdalja do ravnine je cel rob, ne polovica.")] : [M(a * Math.SQRT2, "To je cela diagonala ploskve; razdalja je le polovica diagonale."), M(a, "Rob ni pravokoten na to ravnino. Poišči pravokotno projekcijo oglišča.")]),
          "Poišči pravokotno projekcijo oglišča na ravnino. Razdalja je dolžina daljice od oglišča do projekcije.",
          [dat("a", tx(a), "cm")], ["d"],
          face ? "d = a" : "d = \\dfrac{a\\sqrt{2}}{2}",
          face
            ? [`Rob $${X}${Y}$ je pravokoten na ravnino $${p}$, zato je pravokotna projekcija oglišča $${X}$ točka $${Y}$.`, `$d = a = ${tx(a)}\\ \\mathrm{cm}$`]
            : [`Pravokotna projekcija oglišča $${X}$ je razpolovišče diagonale $${X}${Y}$ ploskve (diagonali kvadrata sta pravokotni).`, `$d = \\dfrac{a\\sqrt{2}}{2} = \\dfrac{${tx(a)} \\cdot \\sqrt{2}}{2} ${res(d, 2, "cm")}$`],
        );
      }
      if (level === 3 && k === 0) {
        const a = r.pick([3, 4, 5, 6, 8]), b = r.pick([4, 5, 6, 7, 9, 12].filter((x) => x !== a)), c = r.pick([5, 7, 9, 10]);
        const [X, p, tri] = r.pick([["B", "ACGE", "ABC"], ["D", "ACGE", "ADC"], ["A", "BDHF", "ABD"], ["C", "BDHF", "CBD"]]);
        const e = Math.hypot(a, b), d = (a * b) / e;
        return T(
          `Kvader $ABCDEFGH$ ima osnovno ploskev $ABCD$ z robovoma $|AB| = ${a}\\ \\mathrm{cm}$ in $|BC| = ${b}\\ \\mathrm{cm}$ ter višino $${c}\\ \\mathrm{cm}$ ($E$, $F$, $G$, $H$ so nad $A$, $B$, $C$, $D$). Kolikšna je razdalja oglišča $${X}$ od ravnine $${p}$? Zaokroži na dve decimalki.`,
          num(d, "cm", 2, [M(e / 2, "Polovica diagonale je razdalja le pri kvadratni osnovni ploskvi. Tu poišči višino trikotnika na diagonalo."), M(Math.min(a, b), "Rob ni pravokoten na diagonalni presek."), M(e, "To je diagonala osnovne ploskve.")]),
          "Ravnina je pravokotna na osnovno ploskev. Razdalja je višina pravokotnega trikotnika na osnovni ploskvi na njegovo hipotenuzo (diagonalo).",
          [dat("a", a, "cm"), dat("b", b, "cm"), dat("c", c, "cm")], ["d"],
          ["e = \\sqrt{a^2 + b^2}", "d = \\dfrac{a\\,b}{e}"],
          [`Ravnina $${p}$ je pravokotna na osnovno ploskev, zato je iskana razdalja višina pravokotnega trikotnika $${tri}$ na hipotenuzo (višina kvadra ni pomembna).`, `$e = \\sqrt{${a}^2 + ${b}^2} ${res(e, 3, "cm")}$`, `Ploščina trikotnika: $\\dfrac{a\\,b}{2} = \\dfrac{e\\,d}{2}$, zato $d = \\dfrac{${a} \\cdot ${b}}{${tx(e, 3)}} ${res(d, 2, "cm")}$`],
        );
      }
      if (level === 3 && k === 1) {
        const CTX = r.pick([
          ["Drog stoji pravokotno na vodoravna tla. Vrh droga je", "nad tlemi. Vrv napnemo od vrha droga do točke na tleh, ki je", "od vznožja droga. Kako dolga je vrv?", "m"],
          ["Svetilka visi točno nad točko N na mizi, ki je pravokotna na vrvico svetilke. Svetilka je", "nad mizo. Kovanec leži na mizi", "od točke N. Kolikšna je razdalja od svetilke do kovanca?", "dm"],
          ["Navpični steber mostu stoji na vodoravni ploščadi. Vrh stebra je", "nad ploščadjo. Jeklenica gre od vrha do sidra na ploščadi, ki je", "od vznožja stebra. Kako dolga je jeklenica?", "m"],
        ]);
        const hgt = r.dec(2, 12, 1), x = r.dec(1.5, 9, 1), d = Math.hypot(hgt, x), u = CTX[3];
        return T(
          `${CTX[0]} $${tx(hgt)}\\ \\mathrm{${u}}$ ${CTX[1]} $${tx(x)}\\ \\mathrm{${u}}$ ${CTX[2]} Zaokroži na eno decimalko.`,
          num(d, u, 1, [M(hgt + x, "Daljic ne smeš sešteti: tvorita pravokotni trikotnik."), M(Math.abs(hgt - x), "Uporabi Pitagorov izrek: daljici sta kateti."), M(Math.sqrt(Math.abs(hgt * hgt - x * x)), "Iskana razdalja je hipotenuza, zato kvadrata katet sešteješ.")]),
          "Premica, ki je pravokotna na ravnino, je pravokotna na vsako premico v tej ravnini skozi svoje vznožje.",
          [dat("h", tx(hgt), u), dat("x", tx(x), u)], ["d"],
          "d = \\sqrt{h^2 + x^2}",
          [`Premica je pravokotna na ravnino, zato je pravokotna tudi na daljico od vznožja do točke na ravnini: nastane pravokotni trikotnik.`, `$d = \\sqrt{${tx(hgt)}^2 + ${tx(x)}^2} ${res(d, 1, u)}$`],
        );
      }
      const n = r.int(4, 7), q = r.pick(["premic", "ravnin"]);
      const ans = q === "premic" ? binom(n, 2) : binom(n, 3);
      return T(
        `V prostoru ${n <= 4 ? `so ${n} točke` : `je ${n} točk`}. Nobene tri ne ležijo na isti premici in nobene štiri ne v isti ravnini. Koliko različnih ${q} določajo te točke?`,
        num(ans, "", null, q === "premic" ? [M(n * (n - 1), "Vsako premico si štel dvakrat (AB in BA sta ista premica)."), M(binom(n, 3), "To je število ravnin. Premico določata dve točki.")] : [M(binom(n, 2), "To je število premic. Ravnino določajo tri nekolinearne točke."), M(n * (n - 1) * (n - 2), "Vsako ravnino si štel 6-krat (vrstni red treh točk ni pomemben).")]),
        q === "premic" ? "Premico določata dve različni točki. Koliko je parov točk?" : "Ravnino določajo tri točke, ki ne ležijo na isti premici. Koliko je trojic točk?",
        [`n = ${n}`], [`${tt("število")}\\ ${tt(q)}`],
        q === "premic" ? "\\dfrac{n(n-1)}{2}" : "\\dfrac{n(n-1)(n-2)}{6}",
        q === "premic" ? [`Vsak par točk določa eno premico.`, `$\\dfrac{${n} \\cdot ${n - 1}}{2} = ${ans}$`] : [`Vsaka trojica točk določa eno ravnino.`, `$\\dfrac{${n} \\cdot ${n - 1} \\cdot ${n - 2}}{6} = ${ans}$`],
      );
    },
  },

  // ------------------------------------------------------------ SŠ 1: osnove logike
  {
    id: "vrz-logika",
    topics: ["MAT-SS-1/osnove-logike"],
    gen(level, r) {
      level = lv(level);
      const k = r.int(0, 2);
      const lits2 = [A_, nA, B_, nB];
      if (level === 1 && k === 0) {
        const S = [["Število 7 je praštevilo", true], ["Število 12 je deljivo s 5", false], ["Kvadrat ima štiri enako dolge stranice", true], ["Število 9 je praštevilo", false], ["Vsota notranjih kotov trikotnika je 180 stopinj", true], ["Število 2 je liho", false], ["Število 15 je večkratnik števila 3", true], ["Kocka ima 8 oglišč", true], ["Število 1 je praštevilo", false], ["Vsako sodo število je deljivo s 4", false], ["Število 0 je sodo", true], ["Pravokotnik ima štiri prave kote", true]];
        const [[sA, a], [sB, b]] = r.shuffle(S).slice(0, 2);
        const v = { A: a, B: b };
        const list = ["in", "ali", "imp", "ekv"].map((op) => B2(op, A_, B_));
        const cnt = list.filter((F) => F.f(v)).length;
        const wrongImp = list.filter((F, i) => (i === 2 ? a && b : F.f(v))).length;
        const swapImp = list.filter((F, i) => (i === 2 ? !b || a : F.f(v))).length;
        return T(
          `Izjava $A$: »${sA}.« Izjava $B$: »${sB}.« Koliko izmed izjav $A \\wedge B$, $A \\vee B$, $A \\Rightarrow B$ in $A \\Leftrightarrow B$ je pravilnih?`,
          num(cnt, "", null, [M(wrongImp, "Implikacija ni isto kot konjunkcija: A ⇒ B je nepravilna le, ko je A pravilna in B nepravilna."), M(swapImp, "Si implikacijo prebral v obratni smeri (B ⇒ A)?"), M(4 - cnt, "Si preštel nepravilne izjave?")]),
          "Najprej ugotovi, ali sta A in B pravilni. Nato za vsako sestavljeno izjavo uporabi njeno pravilnostno tabelo.",
          [`A = ${tt(sA)}`, `B = ${tt(sB)}`], [tt("število pravilnih izjav")],
          "A \\Rightarrow B \\text{ je nepravilna le pri } A = P,\\ B = N",
          [`$A$ je ${PNw(a)}, $B$ je ${PNw(b)}.`, ...list.map((F) => `$${F.t}$: ${PNw(F.f(v))}`), `Pravilnih je $${cnt}$.`],
        );
      }
      if (level === 1 && k === 1) {
        let F, c, ask;
        do {
          F = B2(r.pick(["in", "ali", "imp"]), r.pick([A_, nA]), r.pick([B_, nB]));
          if (r.next() < 0.5) F = { ...B2(r.pick(["in", "ali", "imp"]), r.pick([B_, nB]), r.pick([A_, nA])) };
          c = col(F, R2);
          ask = c.filter(Boolean).length === 1 ? true : c.filter((x) => !x).length === 1 ? false : null;
        } while (ask === null);
        const idx = c.findIndex((x) => x === ask);
        return T(
          `V kateri vrstici pravilnostne tabele je izjava $${F.t}$ ${PNw(ask)}? Taka vrstica je ena sama.`,
          { type: "choice", options: R2.map(rowTxt), index: idx, why: R2.map((v, i) => (i === idx ? null : `Ko je ${koTxt(v).slice(6)}, je ${F.u} ${PNw(c[i])}.`)) },
          "Izračunaj vrednost izjave v vseh štirih vrsticah tabele.",
          [`${tt("izjava")} = ${F.t}`], [tt("vrstica tabele")], false,
          [...R2.map((v, i) => `${rowTxt(v)}: $${F.t}$ je ${PNw(c[i])}.`), `Izjava je ${PNw(ask)} le v vrstici ${rowTxt(R2[idx])}.`],
        );
      }
      if (level === 1) {
        const n = r.int(2, 5), names = ["A", "B", "C", "D", "E"].slice(0, n);
        return T(
          `V sestavljeni izjavi ${n === 2 ? "nastopata 2 izjavi" : n <= 4 ? `nastopajo ${n} izjave` : `nastopa ${n} izjav`}: ${names.map((x) => `$${x}$`).join(", ")}. Koliko vrstic ima njena pravilnostna tabela?`,
          num(2 ** n, "", null, [M(2 * n, "Vsaka nova izjava število vrstic podvoji, ne poveča za 2."), M(n * n, "Število vrstic je potenca števila 2.")]),
          "Vsaka izjava je lahko pravilna ali nepravilna. Koliko je vseh kombinacij?",
          [`n = ${n}`], [tt("število vrstic")], "2^n",
          [`Vsaka od $${n}$ izjav ima 2 možni vrednosti.`, `Vrstic je $2^{${n}} = ${2 ** n}$.`],
        );
      }
      if (level === 2 && k === 0) {
        let F, inner, c;
        do {
          const [x, y] = r.shuffle([r.pick([A_, nA]), r.pick([B_, nB])]), z = r.pick(lits2);
          inner = B2(r.pick(["in", "ali", "imp", "ekv"]), x, y);
          F = r.next() < 0.5 ? B2(r.pick(["in", "ali", "imp", "ekv"]), inner, z) : B2(r.pick(["in", "ali", "imp"]), z, inner);
          c = col(F, R2);
        } while (!(F.t.includes("A") && F.t.includes("B")) || c.every(Boolean) || c.every((x) => !x));
        const cnt = c.filter(Boolean).length, ci = col(inner, R2).filter(Boolean).length;
        return T(
          `V koliko vrsticah pravilnostne tabele je izjava $${F.t}$ pravilna?`,
          num(cnt, "", null, [M(4 - cnt, "Si preštel vrstice, v katerih je izjava nepravilna?"), M(ci, `To je število pravilnih vrstic za oklepaj $(${inner.u})$, ne za celo izjavo.`)]),
          "Sestavi tabelo s stolpci A, B, oklepaj in cela izjava. Najprej izračunaj oklepaj.",
          [`${tt("izjava")} = ${F.t}`], [tt("število pravilnih vrstic")], false,
          ["P pomeni pravilna, N nepravilna.", ...R2.map((v, i) => `${rowTxt(v)}: $${inner.t}$ je ${PN(inner.f(v))}, cela izjava je ${PN(c[i])}.`), `Izjava je pravilna ${vVrst(cnt)}.`],
        );
      }
      if (level === 2 && k === 1) {
        const CAND = [
          NOT(B2("in", A_, B_)), B2("ali", nA, nB), B2("imp", A_, nB), NOT(B2("ali", A_, B_)), B2("in", nA, nB), B2("imp", A_, B_), B2("ali", nA, B_), B2("imp", nB, nA),
          B2("imp", B_, A_), B2("imp", nA, nB), B2("ali", A_, nB), B2("in", A_, nB), B2("in", nA, B_), B2("ekv", A_, B_), B2("in", B2("imp", A_, B_), B2("imp", B_, A_)), B2("ekv", nA, nB),
          B2("ali", A_, B_), B2("in", A_, B_), NOT(B2("imp", A_, B_)), B2("ekv", nA, B_),
        ];
        const TGT = [NOT(B2("in", A_, B_)), NOT(B2("ali", A_, B_)), B2("imp", A_, B_), NOT(B2("imp", A_, B_)), B2("ekv", A_, B_), B2("imp", B_, A_)];
        const F = r.pick(TGT);
        const eqs = CAND.filter((G) => G.t !== F.t && sameCol(F, G, R2)), neq = CAND.filter((G) => !sameCol(F, G, R2));
        const right = r.pick(eqs);
        const wrong = r.shuffle(neq).slice(0, 3).map((G) => {
          const v = firstDiff(F, G, R2);
          return [G.t, `Ni enakovredna: ${koTxt(v)}, je ${F.u} ${PNw(F.f(v))}, ${G.u} pa ${PNw(G.f(v))}.`];
        });
        return T(
          `Katera izjava je enakovredna izjavi $${F.t}$?`,
          choice(r, right.t, wrong, { options_tex: true }),
          "Enakovredni izjavi imata v pravilnostni tabeli enak stolpec v vseh vrsticah.",
          [`${tt("izjava")} = ${F.t}`], [tt("enakovredna izjava")], false,
          [`Stolpec za $${F.t}$: ${col(F, R2).map(PN).join(", ")} (vrstice PP, PN, NP, NN).`, `Stolpec za $${right.t}$: ${col(right, R2).map(PN).join(", ")}, torej je enak.`],
        );
      }
      if (level === 2) {
        const S = [["Ana je doma", "Ana ni doma"], ["Luka igra kitaro", "Luka ne igra kitare"], ["danes je ponedeljek", "danes ni ponedeljek"], ["število n je sodo", "število n ni sodo"], ["trikotnik je pravokoten", "trikotnik ni pravokoten"], ["zunaj sneži", "zunaj ne sneži"], ["Eva ima kolo", "Eva nima kolesa"], ["vlak zamuja", "vlak ne zamuja"]];
        const [[a, na], [b, nb]] = r.shuffle(S).slice(0, 2);
        const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
        const form = r.pick(["in", "ali", "imp"]);
        let stmt, right, wrong;
        if (form === "in") {
          stmt = `${cap(a)} in ${b}.`;
          right = `${cap(na)} ali ${nb}.`;
          wrong = [[`${cap(na)} in ${nb}.`, "Pri negaciji konjunkcije se »in« spremeni v »ali«: ¬(A ∧ B) ≡ ¬A ∨ ¬B."], [`${cap(a)} ali ${b}.`, "Delni izjavi moraš zanikati, ne le zamenjati veznika."], [`${cap(na)} in ${b}.`, "Zanikati moraš obe delni izjavi in zamenjati veznik."]];
        } else if (form === "ali") {
          stmt = `${cap(a)} ali ${b}.`;
          right = `${cap(na)} in ${nb}.`;
          wrong = [[`${cap(na)} ali ${nb}.`, "Pri negaciji disjunkcije se »ali« spremeni v »in«: ¬(A ∨ B) ≡ ¬A ∧ ¬B."], [`${cap(a)} in ${b}.`, "Delni izjavi moraš zanikati, ne le zamenjati veznika."], [`${cap(na)} ali ${b}.`, "Zanikati moraš obe delni izjavi in zamenjati veznik."]];
        } else {
          stmt = `Če ${a}, potem ${b}.`;
          right = `${cap(a)} in ${nb}.`;
          wrong = [[`Če ${na}, potem ${nb}.`, "To je nasprotna implikacija, ne negacija. Implikacija je nepravilna le, ko je A pravilna in B nepravilna."], [`Če ${b}, potem ${a}.`, "To je obrat implikacije, ne negacija."], [`${cap(na)} in ${nb}.`, "Negacija implikacije A ⇒ B je A ∧ ¬B: prvi del ostane nezanikan."]];
        }
        return T(
          `Katera izjava je negacija izjave »${stmt}«?`,
          choice(r, right, wrong),
          form === "imp" ? "Implikacija A ⇒ B je nepravilna le takrat, ko je A pravilna in B nepravilna." : "Uporabi De Morganov zakon: zanikaš obe delni izjavi in zamenjaš veznik.",
          [`${tt("izjava")} = ${form === "in" ? "A \\wedge B" : form === "ali" ? "A \\vee B" : "A \\Rightarrow B"}`], [tt("negacija")],
          form === "in" ? "\\neg(A \\wedge B) \\equiv \\neg A \\vee \\neg B" : form === "ali" ? "\\neg(A \\vee B) \\equiv \\neg A \\wedge \\neg B" : "\\neg(A \\Rightarrow B) \\equiv A \\wedge \\neg B",
          [`Izjava ima obliko $${form === "in" ? "A \\wedge B" : form === "ali" ? "A \\vee B" : "A \\Rightarrow B"}$.`, `Negacija: »${right}«`],
        );
      }
      if (level === 3 && k === 0) {
        const TAV = [B2("imp", B2("in", B2("imp", A_, B_), A_), B_), B2("imp", B2("in", A_, B_), A_), B2("imp", A_, B2("ali", A_, B_)), B2("imp", B2("in", B2("imp", A_, B_), B2("imp", B_, C_)), B2("imp", A_, C_)), B2("ali", B2("imp", A_, B_), B2("imp", B_, A_)), B2("imp", B2("in", B2("imp", A_, B_), nB), nA)];
        const NE = [
          [B2("imp", B2("in", B2("imp", A_, B_), B_), A_), "To je napačen sklep »iz posledice na vzrok«."],
          [B2("imp", B2("in", B2("imp", A_, B_), nA), nB), "To je napačen sklep: iz ¬A ne sledi ¬B."],
          [B2("imp", B2("imp", A_, B_), B2("imp", B_, A_)), "Iz implikacije ne sledi njen obrat."],
          [B2("imp", A_, B2("in", A_, B_)), "Iz A ne sledi, da je pravilna tudi B."],
          [B2("imp", B2("ali", A_, B_), A_), "Disjunkcija je lahko pravilna le zaradi B."],
          [B2("imp", B2("imp", A_, B2("ali", B_, C_)), B2("imp", A_, B_)), "Iz A lahko sledi le C, ne pa B."],
        ];
        const F = r.pick(TAV), vars = (G) => (G.t.includes("C") ? R3 : R2);
        const wrong = r.shuffle(NE).slice(0, 3).map(([G, w]) => {
          const v = vars(G).find((x) => !G.f(x));
          return [G.t, `${w} Ni tavtologija: ${koTxt(v)}, je nepravilna.`];
        });
        return T(
          "Katera izjava je tavtologija (pravilna pri vseh vrednostih izjav, ki v njej nastopajo)?",
          choice(r, F.t, wrong, { options_tex: true }),
          "Za vsako izjavo poišči vrstico, v kateri bi bila nepravilna. Pri implikaciji je to le, ko je levi del pravilen in desni nepravilen.",
          [`${tt("tavtologija")} = ${tt("pravilna v vseh vrsticah")}`], [tt("tavtologija")], false,
          [`Izjava $${F.t}$ je v vseh ${vars(F).length} vrsticah pravilna: implikacija bi bila nepravilna le, če bi bil levi del pravilen in desni nepravilen, to pa se ne zgodi.`],
        );
      }
      if (level === 3 && k === 1) {
        let F, inner, c;
        do {
          const x = r.pick([A_, nA]), y = r.pick([B_, nB]), z = r.pick([C_, nC]);
          inner = B2(r.pick(["in", "ali", "imp", "ekv"]), x, y);
          F = r.next() < 0.5 ? B2(r.pick(["in", "ali", "imp", "ekv"]), inner, z) : B2(r.pick(["in", "ali", "imp"]), z, inner);
          c = col(F, R3);
        } while (c.every(Boolean) || c.every((x) => !x));
        const cnt = c.filter(Boolean).length;
        const short = (v) => `${PN(v.A)}${PN(v.B)}${PN(v.C)}`;
        return T(
          `V koliko vrsticah pravilnostne tabele je izjava $${F.t}$ pravilna?`,
          num(cnt, "", null, [M(8 - cnt, "Si preštel nepravilne vrstice?"), M(col(inner, R3).filter(Boolean).length, "To velja za oklepaj, ne za celo izjavo."), M(cnt % 2 ? NaN : cnt / 2, "Tabela s tremi izjavami ima 8 vrstic, ne 4.")]),
          "Tabela ima 8 vrstic (A, B, C). Najprej izračunaj stolpec za oklepaj.",
          [`${tt("izjava")} = ${F.t}`], [tt("število pravilnih vrstic")], "2^3 = 8\\ \\text{vrstic}",
          ["P pomeni pravilna, N nepravilna.", `Vrednosti (A B C: oklepaj → izjava): ${R3.map((v) => `${short(v)}: ${PN(inner.f(v))} → ${PN(F.f(v))}`).join("; ")}.`, `Izjava je pravilna ${vVrst(cnt)}.`],
        );
      }
      const PAIRS = [
        [B2("imp", A_, B2("imp", B_, C_)), [B2("imp", B2("in", A_, B_), C_)], [B2("imp", B2("imp", A_, B_), C_), B2("imp", B2("ali", A_, B_), C_), B2("in", B2("imp", A_, B_), C_)]],
        [NOT(B2("in", B2("in", A_, B_), C_)), [B2("ali", B2("ali", nA, nB), nC)], [B2("in", B2("in", nA, nB), nC), B2("ali", B2("in", nA, nB), nC), B2("in", B2("ali", nA, nB), nC)]],
        [B2("in", A_, B2("ali", B_, C_)), [B2("ali", B2("in", A_, B_), B2("in", A_, C_))], [B2("in", B2("ali", A_, B_), C_), B2("ali", B2("in", A_, B_), C_), B2("ali", A_, B2("in", B_, C_))]],
        [B2("ali", A_, B2("in", B_, C_)), [B2("in", B2("ali", A_, B_), B2("ali", A_, C_))], [B2("in", B2("ali", A_, B_), C_), B2("ali", B2("in", A_, B_), C_), B2("in", A_, B2("ali", B_, C_))]],
      ];
      const [F, eqs, neq] = r.pick(PAIRS), right = r.pick(eqs);
      const wrong = neq.filter((G) => !sameCol(F, G, R3)).map((G) => {
        const v = firstDiff(F, G, R3);
        return [G.t, `Ni enakovredna: ${koTxt(v)}, je dana izjava ${PNw(F.f(v))}, ta pa ${PNw(G.f(v))}.`];
      });
      return T(
        `Katera izjava je enakovredna izjavi $${F.t}$?`,
        choice(r, right.t, wrong, { options_tex: true }),
        "Primerjaj stolpca obeh izjav v tabeli z 8 vrsticami ali uporabi znane zakone (De Morgan, distributivnost, A ⇒ B ≡ ¬A ∨ B).",
        [`${tt("izjava")} = ${F.t}`], [tt("enakovredna izjava")], false,
        [`Stolpec za $${F.t}$ (vrstice PPP … NNN): ${col(F, R3).map(PN).join("")}.`, `Stolpec za $${right.t}$: ${col(right, R3).map(PN).join("")}, torej je enak.`],
      );
    },
  },

  // ------------------------------------------------------------ SŠ 1: pravokotni koordinatni sistem
  {
    id: "vrz-koordinate",
    topics: ["MAT-SS-1/pravokotni-koordinatni-sistem-v-ravnini"],
    gen(level, r) {
      level = lv(level);
      const k = r.int(0, 2);
      const pt = (n, x, y) => `${n}(${x}, ${y})`;
      if (level === 1 && k !== 2) {
        const [dx0, dy0] = r.pick([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [8, 15], [9, 12]]);
        const dx = dx0 * r.pick([1, -1]), dy = dy0 * r.pick([1, -1]);
        const x1 = r.int(-6, 6), y1 = r.int(-6, 6), x2 = x1 + dx, y2 = y1 + dy, d = Math.hypot(dx, dy);
        return T(
          `Izračunaj razdaljo med točkama $${pt("A", x1, y1)}$ in $${pt("B", x2, y2)}$.`,
          num(d, "", null, [M(Math.abs(dx) + Math.abs(dy), "Razlik ne sešteješ: razdalja je hipotenuza pravokotnega trikotnika (Pitagorov izrek)."), M(dx * dx + dy * dy, "Pozabil si koreniti.")]),
          "Izračunaj razliki koordinat in uporabi Pitagorov izrek.",
          [`A = (${x1}, ${y1})`, `B = (${x2}, ${y2})`], ["d(A, B)"],
          "d(A, B) = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}",
          [`$x_2 - x_1 = ${x2} - ${par(x1)} = ${dx}$, $y_2 - y_1 = ${y2} - ${par(y1)} = ${dy}$`, `$d = \\sqrt{${par(dx)}^2 + ${par(dy)}^2} = \\sqrt{${dx * dx + dy * dy}} = ${d}$`],
        );
      }
      if (level === 1) {
        const x1 = r.int(-9, 9), y1 = r.int(-9, 9), x2 = r.int(-9, 9), y2 = r.int(-9, 9), ax = r.pick(["x", "y"]);
        const [u, v] = ax === "x" ? [x1, x2] : [y1, y2];
        return T(
          `Izračunaj ${ax === "x" ? "absciso" : "ordinato"} ($${ax}$-koordinato) razpolovišča $S$ daljice z začetkom v $${pt("A", x1, y1)}$ in koncem v $${pt("B", x2, y2)}$.`,
          num((u + v) / 2, "", 1, [M(u + v, "Pozabil si deliti z 2."), M((v - u) / 2, "Koordinati sešteješ, ne odšteješ.")]),
          `Razpolovišče ima koordinati, ki sta aritmetični sredini koordinat krajišč.`,
          [`A = (${x1}, ${y1})`, `B = (${x2}, ${y2})`], [`${ax}_S`],
          `${ax}_S = \\dfrac{${ax}_1 + ${ax}_2}{2}`,
          [`$${ax}_S = \\dfrac{${u} + ${par(v)}}{2} = \\dfrac{${u + v}}{2} = ${tx((u + v) / 2)}$`],
        );
      }
      if (level === 2 && k === 0) {
        let x1, y1, x2, y2, s2;
        do {
          [x1, y1, x2, y2] = [r.int(-8, 8), r.int(-8, 8), r.int(-8, 8), r.int(-8, 8)];
          s2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
        } while (!s2 || Number.isInteger(Math.sqrt(s2)));
        const d = Math.sqrt(s2);
        return T(
          `Izračunaj razdaljo med točkama $${pt("P", x1, y1)}$ in $${pt("Q", x2, y2)}$. Zaokroži na dve decimalki.`,
          num(d, "", 2, [M(Math.abs(x2 - x1) + Math.abs(y2 - y1), "Razlik ne sešteješ: uporabi Pitagorov izrek."), M(Math.sqrt((x2 + x1) ** 2 + (y2 + y1) ** 2), "Koordinati odšteješ, ne sešteješ."), M(s2, "Pozabil si koreniti.")]),
          "Razlike koordinat kvadriraj, seštej in koreni.",
          [`P = (${x1}, ${y1})`, `Q = (${x2}, ${y2})`], ["d(P, Q)"],
          "d(P, Q) = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}",
          [`$d = \\sqrt{(${x2} - ${par(x1)})^2 + (${y2} - ${par(y1)})^2} = \\sqrt{${(x2 - x1) ** 2} + ${(y2 - y1) ** 2}} = \\sqrt{${s2}}$`, `$d ${res(d, 2, "")}$`],
        );
      }
      if (level === 2 && k === 1) {
        let P;
        do P = [0, 1, 2].map(() => [r.int(-6, 6), r.int(-6, 6)]);
        while ((P[1][0] - P[0][0]) * (P[2][1] - P[0][1]) - (P[2][0] - P[0][0]) * (P[1][1] - P[0][1]) === 0);
        const [[x1, y1], [x2, y2], [x3, y3]] = P;
        const D = (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1), S = Math.abs(D) / 2;
        return T(
          `Izračunaj ploščino trikotnika z oglišči $${pt("A", x1, y1)}$, $${pt("B", x2, y2)}$ in $${pt("C", x3, y3)}$.`,
          num(S, "", 1, [M(Math.abs(D), "Pozabil si deliti z 2."), M(Math.abs((x2 - x1) * (y3 - y1) + (x3 - x1) * (y2 - y1)) / 2, "Produkta odšteješ, ne sešteješ.")]),
          "Uporabi obrazec s koordinatami: v absolutni vrednosti odšteješ produkta razlik koordinat.",
          [`A = (${x1}, ${y1})`, `B = (${x2}, ${y2})`, `C = (${x3}, ${y3})`], ["S"],
          "S = \\tfrac{1}{2}\\left|(x_2 - x_1)(y_3 - y_1) - (x_3 - x_1)(y_2 - y_1)\\right|",
          [`$(x_2 - x_1)(y_3 - y_1) = ${par(x2 - x1)} \\cdot ${par(y3 - y1)} = ${(x2 - x1) * (y3 - y1)}$`, `$(x_3 - x_1)(y_2 - y_1) = ${par(x3 - x1)} \\cdot ${par(y2 - y1)} = ${(x3 - x1) * (y2 - y1)}$`, `$S = \\tfrac{1}{2}\\left|${(x2 - x1) * (y3 - y1)} - ${par((x3 - x1) * (y2 - y1))}\\right| = \\tfrac{1}{2} \\cdot ${Math.abs(D)} = ${tx(S)}$`],
        );
      }
      if (level === 2 || (level === 3 && k === 0)) {
        const xA = r.int(-8, 8), yA = r.int(-8, 8), xS = r.int(-6, 6) + (level === 3 ? 0.5 * r.pick([0, 1]) : 0), yS = r.int(-6, 6), ax = r.pick(["x", "y"]);
        const [a, s] = ax === "x" ? [xA, xS] : [yA, yS];
        // Z decimalno koordinato ločimo s podpičjem vse točke naloge, da je zapis enoten (»S(3,5; −1)«, »A(−7; 8)«).
        const sep = Number.isInteger(xS) ? ", " : "; ";
        return T(
          `Točka $S(${tx(xS)}${sep}${yS})$ je razpolovišče daljice $AB$, kjer je $A(${xA}${sep}${yA})$. Izračunaj ${ax === "x" ? "absciso" : "ordinato"} točke $B$.`,
          num(2 * s - a, "", null, [M((a + s) / 2, "To je razpolovišče daljice AS, ne točka B."), M(s - a, "Točka B je od S oddaljena toliko kot A: B = 2S − A."), M(2 * s + a, "Koordinato točke A odšteješ: x_B = 2x_S − x_A.")]),
          "Iz obrazca za razpolovišče izrazi koordinato drugega krajišča.",
          [`S = (${tx(xS)}${sep}${yS})`, `A = (${xA}${sep}${yA})`], [`${ax}_B`],
          `${ax}_S = \\dfrac{${ax}_A + ${ax}_B}{2} \\Rightarrow ${ax}_B = 2${ax}_S - ${ax}_A`,
          [`$${ax}_B = 2 \\cdot ${par(s).replace(".", "{,}")} - ${par(a)} = ${tx(2 * s - a)}$`, `Preizkus: $\\dfrac{${a} + ${par(2 * s - a).replace(".", "{,}")}}{2} = ${tx(s)}$`],
        );
      }
      if (level === 3 && k === 1) {
        let x1, y1, x2, y2;
        do [x1, y1, x2, y2] = [r.int(-6, 6), r.int(-6, 6), r.int(-6, 6), r.int(-6, 6)];
        while (x1 === x2);
        const x = (x2 * x2 + y2 * y2 - x1 * x1 - y1 * y1) / (2 * (x2 - x1));
        return T(
          `Na abscisni osi poišči točko $T(x, 0)$, ki je enako oddaljena od točk $${pt("A", x1, y1)}$ in $${pt("B", x2, y2)}$. Izračunaj $x$ in zaokroži na dve decimalki.`,
          num(x, "", 2, [M((x1 + x2) / 2, "Razpolovišče daljice AB je enako oddaljeno od A in B, a v splošnem ne leži na osi x."), M(-x, "Pazi na predznak pri reševanju linearne enačbe.")]),
          "Zapiši d(T, A) = d(T, B), obe strani kvadriraj in reši linearno enačbo za x.",
          [`A = (${x1}, ${y1})`, `B = (${x2}, ${y2})`], ["x"],
          "(x - x_1)^2 + y_1^2 = (x - x_2)^2 + y_2^2",
          [`$(x - ${par(x1)})^2 + ${par(y1)}^2 = (x - ${par(x2)})^2 + ${par(y2)}^2$`, `Člen $x^2$ se odšteje: $${-2 * x1}x + ${x1 * x1 + y1 * y1} = ${-2 * x2}x + ${x2 * x2 + y2 * y2}$`, `$${2 * (x2 - x1)}x = ${x2 * x2 + y2 * y2 - x1 * x1 - y1 * y1}$, $x ${res(x, 2, "")}$`],
        );
      }
      let P;
      do P = [0, 1, 2].map(() => [r.int(-5, 5), r.int(-5, 5)]);
      while ((P[1][0] - P[0][0]) * (P[2][1] - P[0][1]) - (P[2][0] - P[0][0]) * (P[1][1] - P[0][1]) === 0);
      const [[x1, y1], [x2, y2], [x3, y3]] = P;
      const ab = Math.hypot(x2 - x1, y2 - y1), bc = Math.hypot(x3 - x2, y3 - y2), ca = Math.hypot(x1 - x3, y1 - y3), o = ab + bc + ca;
      return T(
        `Izračunaj obseg trikotnika z oglišči $${pt("A", x1, y1)}$, $${pt("B", x2, y2)}$ in $${pt("C", x3, y3)}$. Zaokroži na dve decimalki.`,
        num(o, "", 2, [M(ab + bc, "Seštej vse tri stranice."), M(Math.abs(x2 - x1) + Math.abs(y2 - y1) + Math.abs(x3 - x2) + Math.abs(y3 - y2) + Math.abs(x1 - x3) + Math.abs(y1 - y3), "Dolžine stranic izračunaš s Pitagorovim izrekom, ne z vsoto razlik.")]),
        "Izračunaj dolžine vseh treh stranic z obrazcem za razdaljo in jih seštej.",
        [`A = (${x1}, ${y1})`, `B = (${x2}, ${y2})`, `C = (${x3}, ${y3})`], ["o"],
        ["d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}", "o = a + b + c"],
        [`$|AB| = \\sqrt{${(x2 - x1) ** 2} + ${(y2 - y1) ** 2}} ${res(ab, 3, "")}$`, `$|BC| = \\sqrt{${(x3 - x2) ** 2} + ${(y3 - y2) ** 2}} ${res(bc, 3, "")}$`, `$|CA| = \\sqrt{${(x1 - x3) ** 2} + ${(y1 - y3) ** 2}} ${res(ca, 3, "")}$`, `$o ${res(o, 2, "")}$`],
      );
    },
  },

  // ------------------------------------------------------------ SŠ 2: funkcije in njihove lastnosti
  {
    id: "vrz-funkcije",
    topics: ["MAT-SS-2/funkcije-in-njihove-lastnosti"],
    gen(level, r) {
      level = lv(level);
      const k = r.int(0, 2);
      if (level === 1 && k === 0) {
        const a = r.pick([2, 3, -2, 4, -1, 5]), b = r.int(-6, 6), c = r.int(-5, 5), x0 = r.int(-4, 4), order = r.pick(["fg", "gf"]);
        const f = (x) => a * x + b, gg = (x) => x * x + c;
        const val = order === "fg" ? f(gg(x0)) : gg(f(x0)), other = order === "fg" ? gg(f(x0)) : f(gg(x0));
        const fx = `${mono(a, "x")} ${sg(b)}`.replace(" + 0", "").replace(" - 0", ""), gx = `x^2 ${sg(c)}`.replace(" + 0", "").replace(" - 0", "");
        return T(
          `Dani sta funkciji $f(x) = ${fx}$ in $g(x) = ${gx}$. Izračunaj $(${order === "fg" ? "f \\circ g" : "g \\circ f"})(${x0})$.`,
          num(val, "", null, [M(other, `Vrstni red je obraten: $(${order === "fg" ? "f \\circ g" : "g \\circ f"})(x) = ${order === "fg" ? "f(g(x))" : "g(f(x))"}$, najprej izračunaš notranjo funkcijo.`), M(f(x0) * gg(x0), "Kompozitum ni produkt funkcij.")]),
          `Najprej izračunaj ${order === "fg" ? "g" : "f"}(${x0}), nato rezultat vstavi v ${order === "fg" ? "f" : "g"}.`,
          [`f(x) = ${fx}`, `g(x) = ${gx}`, `x = ${x0}`], [order === "fg" ? "(f \\circ g)(x)" : "(g \\circ f)(x)"],
          order === "fg" ? "(f \\circ g)(x) = f(g(x))" : "(g \\circ f)(x) = g(f(x))",
          order === "fg" ? [`$g(${x0}) = ${par(x0)}^2${c ? " " + sg(c) : ""} = ${gg(x0)}$`, `$f(${gg(x0)}) = ${a} \\cdot ${par(gg(x0))}${b ? " " + sg(b) : ""} = ${val}$`] : [`$f(${x0}) = ${a} \\cdot ${par(x0)}${b ? " " + sg(b) : ""} = ${f(x0)}$`, `$g(${f(x0)}) = ${par(f(x0))}^2${c ? " " + sg(c) : ""} = ${val}$`],
        );
      }
      if (level === 1 && k === 1) {
        const a = r.pick([1, 2, 3, -1, -2]), b = r.nonZero(-7, 7), c = r.nonZero(-6, 6);
        if (r.next() < 0.5)
          return T(
            `Katero realno število ne spada v definicijsko območje funkcije $f(x) = \\dfrac{${mono(a, "x")} ${sg(b)}}{x ${sg(-c)}}$?`,
            num(c, "", null, [M(-c, "Pazi na predznak: imenovalec je 0, ko je x enak številu, ki ga odštevamo."), M(-b / a, "To je ničla števca (ničla funkcije), ki v definicijsko območje spada.")]),
            "Ulomek ni definiran, kadar je imenovalec enak 0.",
            [`f(x) = \\dfrac{${mono(a, "x")} ${sg(b)}}{x ${sg(-c)}}`], [tt("izločeno število")],
            "x - c \\ne 0",
            [`$x ${sg(-c)} = 0 \\Rightarrow x = ${c}$`, `Definicijsko območje: $\\mathbb{R} \\setminus \\{${c}\\}$`],
          );
        return T(
          `Katero je najmanjše število v definicijskem območju funkcije $f(x) = \\sqrt{x ${sg(-c)}} ${sg(b)}$?`,
          num(c, "", null, [M(-c, "Pazi na predznak: izraz pod korenom mora biti nenegativen, x − c ≥ 0."), M(b, "Člen zunaj korena ne vpliva na definicijsko območje.")]),
          "Izraz pod sodim korenom mora biti večji ali enak 0.",
          [`f(x) = \\sqrt{x ${sg(-c)}} ${sg(b)}`], [tt("najmanjše število v D")],
          "x - c \\ge 0",
          [`$x ${sg(-c)} \\ge 0 \\Rightarrow x \\ge ${c}$`, `$D_f = [${c}, \\infty)$, najmanjše število je $${c}$.`],
        );
      }
      if (level === 1) {
        const a = r.pick([2, 3, -1, -2]), b = r.int(1, 5), c = r.int(1, 6);
        const POOL = [
          [`${mono(a, "x^4")} ${sg(-b)}x^2`.replace(/([+-]) 1x/, "$1 x"), (x) => a * x ** 4 - b * x * x], [`x^2 ${sg(-c)}`, (x) => x * x - c], [`|x| ${sg(c)}`, (x) => Math.abs(x) + c], [`${mono(a, "x^2")} + |x|`, (x) => a * x * x + Math.abs(x)],
          [`${mono(a, "x^3")} ${sg(b)}x`.replace(/([+-]) 1x/, "$1 x"), (x) => a * x ** 3 + b * x], [`\\dfrac{${a}}{x}`, (x) => a / x], [`x^5 - ${b === 1 ? "" : b}x^3`, (x) => x ** 5 - b * x ** 3], [`x|x|`, (x) => x * Math.abs(x)],
          [`x^2 ${sg(b)}x`.replace(/([+-]) 1x/, "$1 x"), (x) => x * x + b * x], [`x^3 ${sg(c)}`, (x) => x ** 3 + c], [`(x ${sg(-c)})^2`, (x) => (x - c) ** 2], [`${mono(a, "x")} ${sg(c)}`, (x) => a * x + c],
        ];
        const [tex, f] = r.pick(POOL), X = [0.7, 1.3, 2.9];
        const even = X.every((x) => Math.abs(f(-x) - f(x)) < 1e-9), odd = X.every((x) => Math.abs(f(-x) + f(x)) < 1e-9);
        const OPT = ["soda", "liha", "ni ne soda ne liha"], idx = even ? 0 : odd ? 1 : 2;
        const f1 = f(1), fm1 = f(-1);
        const why = OPT.map((o, i) => (i === idx ? null : i === 0 ? `Ni soda: f(−1) = ${tx(fm1).replace("{,}", ",").replace("-", "−")}, f(1) = ${tx(f1).replace("{,}", ",").replace("-", "−")}, torej f(−x) ≠ f(x).` : i === 1 ? `Ni liha: f(−1) = ${tx(fm1).replace("{,}", ",").replace("-", "−")}, −f(1) = ${tx(-f1).replace("{,}", ",").replace("-", "−")}, torej f(−x) ≠ −f(x).` : `Je ${even ? "soda: f(−x) = f(x)" : "liha: f(−x) = −f(x)"} za vsak x.`));
        return T(
          `Ali je funkcija $f(x) = ${tex}$ soda, liha ali ni ne soda ne liha?`,
          { type: "choice", options: OPT, index: idx, why },
          "Izračunaj f(−x) in ga primerjaj s f(x) in z −f(x).",
          [`f(x) = ${tex}`], [tt("sodost funkcije")], ["f(-x) = f(x)\\ \\text{(soda)}", "f(-x) = -f(x)\\ \\text{(liha)}"],
          [`Primer: $f(1) = ${tx(f1)}$, $f(-1) = ${tx(fm1)}$.`, even ? "Za vsak x velja f(−x) = f(x): funkcija je soda (graf je simetričen glede na os y)." : odd ? "Za vsak x velja f(−x) = −f(x): funkcija je liha (graf je simetričen glede na izhodišče)." : "Ne velja ne f(−x) = f(x) ne f(−x) = −f(x): funkcija ni ne soda ne liha."],
        );
      }
      if (level === 2 && k === 0) {
        const cube = r.next() < 0.4;
        const a = r.pick([2, 3, 4, -2, -3, 5]), b = r.nonZero(-9, 9), x0 = cube ? r.int(-3, 3) : r.int(-6, 8);
        const y0 = cube ? a * x0 ** 3 + b : a * x0 + b;
        const fx = `${mono(a, cube ? "x^3" : "x")} ${sg(b)}`;
        return T(
          `Dana je funkcija $f(x) = ${fx}$. Izračunaj $f^{-1}(${y0})$.`,
          num(x0, "", null, [M(cube ? a * y0 ** 3 + b : a * y0 + b, "To je f(y), ne vrednost obratne funkcije."), M(cube ? (y0 - b) / a : 1 / (a * y0 + b), cube ? "Pozabil si izračunati tretji koren." : "Obratna funkcija ni 1/f: f⁻¹(y) ni enako 1/f(y).")]),
          "Vrednost f⁻¹(y) je tisti x, za katerega velja f(x) = y. Reši enačbo.",
          [`f(x) = ${fx}`, `y = ${y0}`], ["f^{-1}(y)"],
          "f^{-1}(y) = x \\iff f(x) = y",
          [`$${fx.replace(/x/g, "x")} = ${y0}$`, cube ? `$x^3 = \\dfrac{${y0} ${sg(-b)}}{${a}} = ${(y0 - b) / a}$, $x = ${x0}$` : `$${mono(a, "x")} = ${y0 - b}$, $x = ${x0}$`, `$f^{-1}(${y0}) = ${x0}$`],
        );
      }
      if (level === 2 && k === 1) {
        if (r.next() < 0.5) {
          const n = r.int(2, 7);
          return T(
            `Koliko celih števil je v definicijskem območju funkcije $f(x) = \\sqrt{${n * n} - x^2}$?`,
            num(2 * n + 1, "", null, [M(2 * n, "Ne pozabi na število 0."), M(2 * n - 1, "Krajišči intervala spadata v definicijsko območje (koren iz 0 obstaja)."), M(n + 1, "Upoštevaj tudi negativna števila.")]),
            "Izraz pod korenom mora biti nenegativen. Reši neenačbo.",
            [`f(x) = \\sqrt{${n * n} - x^2}`], [tt("število celih števil")],
            `${n * n} - x^2 \\ge 0`,
            [`$x^2 \\le ${n * n} \\Rightarrow -${n} \\le x \\le ${n}$`, `Cela števila od $-${n}$ do $${n}$: $${2 * n + 1}$ števil.`],
          );
        }
        const a = r.int(-6, 3), b = a + r.int(2, 9);
        return T(
          `Koliko celih števil je v definicijskem območju funkcije $f(x) = \\sqrt{x ${sg(-a)}} + \\sqrt{${b} - x}$?`,
          num(b - a + 1, "", null, [M(b - a, "Šteti moraš obe krajišči intervala."), M(b - a - 1, "Krajišči spadata v definicijsko območje (koren iz 0 obstaja).")]),
          "Oba izraza pod korenoma morata biti nenegativna hkrati.",
          [`f(x) = \\sqrt{x ${sg(-a)}} + \\sqrt{${b} - x}`], [tt("število celih števil")],
          "x - a \\ge 0 \\text{ in } b - x \\ge 0",
          [`$x \\ge ${a}$ in $x \\le ${b}$, torej $D_f = [${a}, ${b}]$.`, `Cela števila: $${b} - ${par(a)} + 1 = ${b - a + 1}$.`],
        );
      }
      if (level === 2) {
        const p = r.nonZero(-5, 5), q = r.int(-6, 6), neg = r.next() < 0.5;
        const fx = `${neg ? "-" : ""}|x ${sg(-p)}| ${sg(q)}`;
        return T(
          `Kolikšna je ${neg ? "največja" : "najmanjša"} vrednost funkcije $f(x) = ${fx}$?`,
          num(q, "", null, [M(p, "To je x, pri katerem je vrednost dosežena, ne vrednost sama."), M(-q, "Pazi na predznak prostega člena.")]),
          `Absolutna vrednost je vedno ≥ 0. Kdaj je enaka 0?`,
          [`f(x) = ${fx}`], [neg ? tt("največja vrednost") : tt("najmanjša vrednost")],
          "|x - p| \\ge 0",
          [`$|x ${sg(-p)}| \\ge 0$, enakost velja pri $x = ${p}$.`, `${neg ? "Največja" : "Najmanjša"} vrednost: $f(${p}) = ${q}$, zaloga vrednosti je $${neg ? `(-\\infty, ${q}]` : `[${q}, \\infty)`}$.`],
        );
      }
      if (level === 3 && k === 0) {
        let a, b, d, kk, num0, den0;
        do {
          [a, b, d, kk] = [r.nonZero(-4, 4), r.int(-6, 6), r.nonZero(-5, 5), r.int(-6, 6)];
          num0 = b - kk * d;
          den0 = kk - a;
        } while (a * d - b === 0 || den0 === 0 || num0 === 0);
        const fT = `\\dfrac{${mono(a, "x")} ${sg(b)}}{x ${sg(d)}}`.replace(" + 0}", "}").replace(" - 0}", "}");
        return T(
          `Dana je funkcija $f(x) = ${fT}$. Izračunaj $f^{-1}(${kk})$. Rezultat zapiši kot okrajšan ulomek ali celo število.`,
          frac(num0, den0, [M((a * kk + b) / (kk + d), "To je f(k), ne vrednost obratne funkcije."), M(-num0 / den0, "Pazi na predznak pri izražanju x.")]),
          "Reši enačbo f(x) = k: pomnoži z imenovalcem in izrazi x.",
          [`f(x) = ${fT}`, `k = ${kk}`], ["f^{-1}(k)"],
          "f(x) = k \\Rightarrow x = f^{-1}(k)",
          [`$${mono(a, "x")}${b ? " " + sg(b) : ""} = ${kk === 0 ? "0" : `${kk === 1 ? "" : kk === -1 ? "-" : kk}(x ${sg(d)})`}$`, `$${mono(a - kk, "x")} = ${kk * d - b}$`, `$x = ${fracTex(kk * d - b, a - kk)}$`],
        );
      }
      if (level === 3 && k === 1) {
        const a = r.pick([1, 2, 3]), x0 = r.int(2, 6), b = r.nonZero(-9, 9), m = a * x0 * x0 + b;
        const fx = `${mono(a, "x")} ${sg(b)}`;
        return T(
          `Dani sta $f(x) = ${fx}$ in $g(x) = x^2$. Poišči pozitivno rešitev enačbe $(f \\circ g)(x) = ${m}$.`,
          num(x0, "", null, [M(-x0, "Iskali smo pozitivno rešitev."), M((Math.sqrt(m) - b) / a, "Vrstni red je obraten: (f ∘ g)(x) = f(g(x)) = f(x²)."), M(x0 * x0, "To je x², ne x.")]),
          "Zapiši (f ∘ g)(x) = f(g(x)) kot izraz z x in reši enačbo.",
          [`f(x) = ${fx}`, "g(x) = x^2", `m = ${m}`], ["x"],
          "(f \\circ g)(x) = f(g(x))",
          [`$(f \\circ g)(x) = f(x^2) = ${mono(a, "x^2")} ${sg(b)}$`, `$${mono(a, "x^2")} ${sg(b)} = ${m} \\Rightarrow x^2 = ${x0 * x0}$`, `Pozitivna rešitev: $x = ${x0}$`],
        );
      }
      const kk = r.int(1, 5), a = r.pick([2, 3, -2]);
      const INJ = [[`x^3 + ${kk}`], [`${a}x - ${kk}`], [`\\sqrt{x} + ${kk}`], ["x|x|"], [`\\dfrac{${kk}}{x}`]];
      const NON = [[`x^2 + ${kk}`, 1, -1, (x) => x * x + kk], [`|x - ${kk}|`, kk - 1, kk + 1, (x) => Math.abs(x - kk)], ["x^4", 1, -1, (x) => x ** 4], [`x^3 - ${kk * kk}x`, 0, kk, (x) => x ** 3 - kk * kk * x], [`(x + ${kk})^2`, -kk - 1, -kk + 1, (x) => (x + kk) ** 2]];
      const right = r.pick(INJ)[0];
      const wrong = r.shuffle(NON).slice(0, 3).map(([t, x1, x2, f]) => [`$f(x) = ${t}$`, `Ni injektivna: f(${x1}) = f(${x2}) = ${f(x1)}, različna x imata isto vrednost.`.replace(/-/g, "−")]);
      return T(
        "Katera funkcija je injektivna na svojem definicijskem območju?",
        choice(r, `$f(x) = ${right}$`, wrong),
        "Funkcija je injektivna, če različnima x pripadata različni vrednosti. Pri neinjektivni poišči dva x z isto vrednostjo.",
        [`${tt("injektivnost")} = ${tt("različnima x pripadata različni vrednosti")}`], [tt("injektivna funkcija")],
        "x_1 \\ne x_2 \\Rightarrow f(x_1) \\ne f(x_2)",
        [`Funkcija $f(x) = ${right}$ je na svojem definicijskem območju ${right.includes("dfrac") ? "padajoča na vsakem od intervalov in zavzame vsako vrednost največ enkrat" : "strogo monotona"}, zato je injektivna.`, "Pri drugih poiščemo dva različna x z isto vrednostjo (glej razlage)."],
      );
    },
  },

  // ------------------------------------------------------------ SŠ 2: transformacije grafov
  {
    id: "vrz-transformacije",
    topics: ["MAT-SS-2/transformacije-grafov"],
    gen(level, r) {
      level = lv(level);
      const k = r.int(0, 2);
      const F = r.pick([["x^2", (x) => x * x, (u) => (u === "x" ? "x^2" : `(${u})^2`)], ["|x|", Math.abs, (u) => `|${u}|`], ["\\sqrt{x}", (x) => (x < 0 ? NaN : Math.sqrt(x)), (u) => `\\sqrt{${u}}`], ["x^3", (x) => x ** 3, (u) => (u === "x" ? "x^3" : `(${u})^3`)]]);
      const inner = (p) => (p === 0 ? "x" : `x ${sg(-p)}`);
      if (level === 1 && k === 0) {
        const c = r.int(1, 6);
        const KIND = r.pick([
          [`f(x - ${c})`, `premik za ${c} v desno`, [[`premik za ${c} v levo`, "Znotraj oklepaja deluje obratno: x − c premakne graf v desno."], [`premik za ${c} navzgor`, "Sprememba pri x (znotraj f) premakne graf vodoravno."], [`premik za ${c} navzdol`, "Sprememba pri x (znotraj f) premakne graf vodoravno."]]],
          [`f(x + ${c})`, `premik za ${c} v levo`, [[`premik za ${c} v desno`, "Znotraj oklepaja deluje obratno: x + c premakne graf v levo."], [`premik za ${c} navzgor`, "Sprememba pri x premakne graf vodoravno."], [`premik za ${c} navzdol`, "Sprememba pri x premakne graf vodoravno."]]],
          [`f(x) + ${c}`, `premik za ${c} navzgor`, [[`premik za ${c} v desno`, "Prištevanje k vrednosti funkcije premakne graf navpično."], [`premik za ${c} v levo`, "Prištevanje k vrednosti funkcije premakne graf navpično."], [`premik za ${c} navzdol`, "Vrednosti se povečajo, graf gre navzgor."]]],
          [`f(x) - ${c}`, `premik za ${c} navzdol`, [[`premik za ${c} navzgor`, "Vrednosti se zmanjšajo, graf gre navzdol."], [`premik za ${c} v desno`, "Odštevanje od vrednosti funkcije premakne graf navpično."], [`premik za ${c} v levo`, "Odštevanje od vrednosti funkcije premakne graf navpično."]]],
          ["-f(x)", "zrcaljenje čez os x", [["zrcaljenje čez os y", "Pri −f(x) se spremenijo vrednosti (y), ne x."], ["zrcaljenje čez izhodišče", "To bi bilo −f(−x)."], ["premik za 1 navzdol", "Minus pred f ni odštevanje števila, ampak množenje z −1."]]],
          ["f(-x)", "zrcaljenje čez os y", [["zrcaljenje čez os x", "Pri f(−x) se zamenja predznak x, vrednosti ostanejo."], ["zrcaljenje čez izhodišče", "To bi bilo −f(−x)."], ["premik za 1 v levo", "−x ni x − 1 ali x + 1."]]],
          [`${c + 1}f(x)`, `raztezanje v smeri osi y s faktorjem ${c + 1}`, [[`raztezanje v smeri osi x s faktorjem ${c + 1}`, "Faktor pred f množi vrednosti, zato deluje navpično."], [`premik za ${c + 1} navzgor`, "Množenje ni prištevanje."], [`skrčitev v smeri osi y s faktorjem ${c + 1}`, "Faktor večji od 1 graf raztegne."]]],
        ]);
        return T(
          `Kako dobimo graf funkcije $g(x) = ${KIND[0]}$ iz grafa funkcije $f$?`,
          choice(r, KIND[1], KIND[2]),
          "Sprememba znotraj f (pri x) deluje vodoravno in obratno, sprememba zunaj f pa navpično.",
          [`g(x) = ${KIND[0]}`], [tt("preslikava grafa")], ["g(x) = f(x - p) + q"],
          [`$g(x) = ${KIND[0]}$: ${KIND[1]}.`],
        );
      }
      if (level === 1) {
        const x0 = r.int(-5, 5), y0 = r.int(-5, 5), c = r.int(1, 6), kind = r.pick(["d", "l", "g", "s"]), ax = r.pick(["x", "y"]);
        const g = { d: `f(x - ${c})`, l: `f(x + ${c})`, g: `f(x) + ${c}`, s: `f(x) - ${c}` }[kind];
        const nx = x0 + (kind === "d" ? c : kind === "l" ? -c : 0), ny = y0 + (kind === "g" ? c : kind === "s" ? -c : 0);
        const ans = ax === "x" ? nx : ny, wrongV = ax === "x" ? x0 + (kind === "d" ? -c : kind === "l" ? c : 0) : y0;
        return T(
          `Točka $T(${x0}, ${y0})$ leži na grafu funkcije $f$. Graf funkcije $g(x) = ${g}$ dobimo s premikom. V katero točko se preslika $T$? Vpiši njeno ${ax === "x" ? "absciso" : "ordinato"}.`,
          num(ans, "", null, [M(wrongV, ax === "x" && (kind === "d" || kind === "l") ? "Znotraj oklepaja deluje obratno: f(x − c) premakne graf v desno." : "Ta koordinata se pri tem premiku ne spremeni... preveri, ali premik deluje vodoravno ali navpično."), M(ax === "x" ? x0 : y0 + (kind === "g" ? -c : kind === "s" ? c : 0), "Preveri smer premika.")]),
          "Ugotovi, ali je premik vodoraven (sprememba pri x) ali navpičen (sprememba vrednosti), in v katero smer.",
          [`T = (${x0}, ${y0})`, `g(x) = ${g}`], [`${ax}_{T'}`],
          "g(x) = f(x - p) + q:\\ (x, y) \\mapsto (x + p,\\ y + q)",
          [`$g(x) = ${g}$ je ${kind === "d" ? `premik za ${c} v desno` : kind === "l" ? `premik za ${c} v levo` : kind === "g" ? `premik za ${c} navzgor` : `premik za ${c} navzdol`}.`, `$T' = (${nx}, ${ny})$`],
        );
      }
      if (level === 2 && k === 0) {
        let p, q, a, x1, base;
        do {
          [p, q, a] = [r.nonZero(-4, 4), r.nonZero(-5, 5), r.pick([1, 2, 3, -1, -2])];
          base = F[0] === "\\sqrt{x}" ? r.pick([0, 1, 4, 9]) : r.int(-3, 3);
          x1 = base + p;
        } while (!Number.isFinite(F[1](base)));
        const val = a * F[1](base) + q;
        const gT = `${a === 1 ? "" : a === -1 ? "-" : a}${F[2](inner(p))} ${sg(q)}`.replace(" + 0", "").replace(" - 0", "");
        return T(
          `Graf funkcije $f(x) = ${F[0]}$ preslikamo v graf funkcije $g(x) = ${gT}$. Izračunaj $g(${x1})$.`,
          num(val, "", null, [M(a * F[1](x1 + p) + q, "V f vstaviš x − p, ne x + p."), M(a * (F[1](x1) - p) + q, "Premik p je znotraj funkcije f.")]),
          "Vstavi x v g: najprej izračunaj izraz v oklepaju, nato f, nato pomnoži in prištej.",
          [`g(x) = ${gT}`, `x = ${x1}`], [`g(${x1})`],
          "g(x) = a\\,f(x - p) + q",
          [`$x - p = ${x1} - ${par(p)} = ${base}$`, `$f(${base}) = ${F[1](base)}$`, `$g(${x1}) = ${a} \\cdot ${par(F[1](base))} ${sg(q)} = ${val}$`],
        );
      }
      if (level === 2 && k === 1) {
        const x0 = r.int(-4, 4), y0 = r.int(-4, 4), p = r.nonZero(-4, 4), q = r.nonZero(-4, 4), a = r.pick([2, 3, -1, -2]), ax = r.pick(["x", "y"]);
        const nx = x0 + p, ny = a * y0 + q;
        const g = `${a === -1 ? "-" : a}f(${inner(p)}) ${sg(q)}`;
        return T(
          `Točka $T(${x0}, ${y0})$ leži na grafu funkcije $f$. V katero točko grafa funkcije $g(x) = ${g}$ se preslika? Vpiši njeno ${ax === "x" ? "absciso" : "ordinato"}.`,
          num(ax === "x" ? nx : ny, "", null, ax === "x" ? [M(x0 - p, "Znotraj oklepaja deluje obratno: f(x − p) premakne graf za p v desno."), M(a * x0 + p, "Faktor a deluje navpično, ne vodoravno.")] : [M(a * (y0 + q), "Najprej pomnožiš z a, nato prišteješ q."), M(y0 + q, "Pozabil si na faktor a.")]),
          "Abscisa se spremeni le zaradi premika v oklepaju, ordinata zaradi faktorja a in prištetega q.",
          [`T = (${x0}, ${y0})`, `g(x) = ${g}`], [`${ax}_{T'}`],
          "(x, y) \\mapsto (x + p,\\ a y + q)",
          [`$x' = ${x0} + ${par(p)} = ${nx}$`, `$y' = ${a} \\cdot ${par(y0)} ${sg(q)} = ${ny}$`, `$T' = (${nx}, ${ny})$`],
        );
      }
      if (level === 2) {
        const a = r.pick([1, 2, 3, -1, -4]), p = r.nonZero(-5, 5), q = r.nonZero(-5, 5), which = r.pick(["nav", "vod"]);
        const gT = `\\dfrac{${a}}{x ${sg(-p)}} ${sg(q)}`;
        return T(
          `Zapiši enačbo ${which === "nav" ? "navpične" : "vodoravne"} asimptote grafa funkcije $g(x) = ${gT}$. Vpiši število $c$ iz enačbe ${which === "nav" ? "$x = c$" : "$y = c$"}.`,
          num(which === "nav" ? p : q, "", null, which === "nav" ? [M(-p, "Pazi na predznak: imenovalec je 0 pri x = p."), M(q, "q določa vodoravno asimptoto.")] : [M(-q, "Pazi na predznak: graf premaknemo za q navzgor."), M(p, "p določa navpično asimptoto."), M(0, "Asimptota y = 0 se premakne skupaj z grafom.")]),
          "Graf funkcije 1/x ima asimptoti osi. Ugotovi, kam se premakneta.",
          [`g(x) = ${gT}`], ["c"],
          "g(x) = \\dfrac{a}{x - p} + q:\\ x = p,\\ y = q",
          [`Graf funkcije $\\dfrac{${a}}{x}$ ima asimptoti $x = 0$ in $y = 0$.`, `Premik za ${p} vodoravno in ${q} navpično: ${which === "nav" ? `$x = ${p}$` : `$y = ${q}$`}.`],
        );
      }
      if (level === 3 && k === 0) {
        const p = r.nonZero(-4, 4), q = r.nonZero(-5, 5), order = r.pick(["zrcali-premik", "premik-zrcali"]);
        let x1;
        do x1 = r.int(-3, 5);
        while (x1 === p);
        const f = (x) => x * x, val = order === "zrcali-premik" ? -f(x1 - p) + q : -(f(x1 - p) + q), other = order === "zrcali-premik" ? -(f(x1 - p) + q) : -f(x1 - p) + q;
        const steps = order === "zrcali-premik" ? `najprej zrcalimo čez os x, nato ga premaknemo za ${Math.abs(p)} ${p >= 0 ? "v desno" : "v levo"} in za ${Math.abs(q)} ${q >= 0 ? "navzgor" : "navzdol"}` : `najprej premaknemo za ${Math.abs(p)} ${p >= 0 ? "v desno" : "v levo"} in za ${Math.abs(q)} ${q >= 0 ? "navzgor" : "navzdol"}, nato pa zrcalimo čez os x`;
        const gT = order === "zrcali-premik" ? `-(${inner(p)})^2 ${sg(q)}` : `-\\left((${inner(p)})^2 ${sg(q)}\\right)`;
        return T(
          `Graf funkcije $f(x) = x^2$ ${steps}. Dobimo graf funkcije $g$. Izračunaj $g(${x1})$.`,
          num(val, "", null, [M(other, "Vrstni red preslikav je pomemben: zrcaljenje čez os x spremeni predznak vsega, kar je že izračunano."), M(f(x1 - p) + q, "Pozabil si na zrcaljenje čez os x."), M(-f(x1 + p) + (order === "zrcali-premik" ? q : -q), p > 0 ? `Premik v desno za ${p} pomeni x − ${p}.` : `Premik v levo za ${-p} pomeni x + ${-p}.`)]),
          "Zapiši g(x) po korakih, v vrstnem redu preslikav.",
          [`f(x) = x^2`, `x = ${x1}`], [`g(${x1})`],
          ["-f(x)\\ \\text{(zrcaljenje čez os x)}", "f(x - p) + q\\ \\text{(premik)}"],
          [`$g(x) = ${gT}$`, `$g(${x1}) = ${order === "zrcali-premik" ? `-(${x1} - ${par(p)})^2 ${sg(q)}` : `-\\left((${x1} - ${par(p)})^2 ${sg(q)}\\right)`} = ${val}$`],
        );
      }
      if (level === 3 && k === 1) {
        const s = r.int(1, 4), p = r.int(1, 6), q = r.nonZero(-3, 3), y1 = s + q, x1 = s * s + p;
        return T(
          `Graf funkcije $f(x) = \\sqrt{x}$ premaknemo za $p$ v desno in za ${Math.abs(q)} ${q >= 0 ? "navzgor" : "navzdol"} ($q = ${q}$). Dobljeni graf gre skozi točko $(${x1}, ${y1})$. Izračunaj $p$.`,
          num(p, "", null, [M(x1 - (y1 - q), "Pozabil si kvadrirati: iz √(x − p) = s sledi x − p = s²."), M(x1 - y1 * y1, `Najprej odštej ${q} (navpični premik), šele nato kvadriraj.`), M(-p, "Premik v desno pomeni x − p s pozitivnim p.")]),
          "Zapiši g(x) = √(x − p) + q, vstavi koordinati točke in reši enačbo za p.",
          [`T = (${x1}, ${y1})`, `q = ${q}`], ["p"],
          "g(x) = \\sqrt{x - p} + q",
          [`$${y1} = \\sqrt{${x1} - p} ${sg(q)} \\Rightarrow \\sqrt{${x1} - p} = ${s}$`, `$${x1} - p = ${s * s} \\Rightarrow p = ${p}$`],
        );
      }
      const a = r.pick([2, 3, 4]), p = r.int(1, 6), x1 = p + r.pick([1, 2, 3]);
      const fx = (x) => 1 / x, val = a * fx(x1 - p);
      return T(
        `Graf funkcije $f(x) = \\dfrac{1}{x}$ raztegnemo v smeri osi y s faktorjem ${a}, nato ga zrcalimo čez os y in na koncu premaknemo za ${p} v desno. Izračunaj $g(${x1})$ in zaokroži na dve decimalki.`,
        num(-a / (x1 - p), "", 2, [M(val, "Zrcaljenje čez os y zamenja x z −x: g(x) = a · f(−(x − p))."), M(-a / (x1 + p), "Premik naredimo zadnji: v že zrcaljeni funkciji a/(−x) zamenjamo x z x − p. Če premakneš pred zrcaljenjem, dobiš a/(−x − p)."), M(-1 / (a * (x1 - p)), "Raztezanje v smeri osi y pomnoži vrednost, ne x.")]),
        "Zapiši funkcijo po korakih: a·f(x), nato a·f(−x), nato x zamenjaš z x − p.",
        ["f(x) = \\dfrac{1}{x}", `a = ${a}`, `p = ${p}`, `x = ${x1}`], [`g(${x1})`],
        ["a\\,f(x)", "f(-x)", "f(x - p)"],
        [`Raztezanje: $\\dfrac{${a}}{x}$; zrcaljenje čez os y: $\\dfrac{${a}}{-x}$; premik: $g(x) = \\dfrac{${a}}{-(x - ${p})}$`, `$g(${x1}) = \\dfrac{${a}}{-(${x1} - ${p})} ${res(-a / (x1 - p), 2, "")}$`],
      );
    },
  },

  // ------------------------------------------------------------ SŠ 2: potenčna in korenska funkcija
  {
    id: "vrz-potencna",
    topics: ["MAT-SS-2/potencna-in-korenska-funkcija"],
    gen(level, r) {
      level = lv(level);
      const k = r.int(0, 2);
      if (level === 1 && k === 0) {
        const n = r.pick([-3, -2, -1, 2, 3, 4, 5]), a = r.pick([1, 2, 3, -1, -2, 4]), x = r.pick([-3, -2, -1, 2, 3]);
        const fx = `${mono(a, `x^{${n}}`)}`;
        if (n > 0)
          return T(
            `Izračunaj vrednost funkcije $f(x) = ${fx}$ pri $x = ${x}$.`,
            num(a * x ** n, "", null, [M(a * Math.abs(x) ** n, "Pazi na predznak: liha potenca negativnega števila je negativna."), M((a * x) ** n, `Potenciraš le x, ne a·x.`)]),
            "Najprej izračunaj potenco, nato pomnoži s koeficientom.",
            [`f(x) = ${fx}`, `x = ${x}`], [`f(${x})`], "f(x) = a\\,x^n",
            [`$${par(x)}^{${n}} = ${x ** n}$`, a === 1 ? `$f(${x}) = ${x ** n}$` : `$f(${x}) = ${a === -1 ? "-" : `${a} \\cdot `}${par(x ** n)} = ${a * x ** n}$`],
          );
        const den = x ** -n;
        return T(
          `Izračunaj vrednost funkcije $f(x) = ${fx}$ pri $x = ${x}$. Rezultat zapiši kot okrajšan ulomek ali celo število.`,
          frac(a, den, [M(a * den, "Negativni eksponent pomeni obratno vrednost: x⁻ⁿ = 1/xⁿ."), M(-a / den, x < 0 && n % 2 ? "Preveri predznak: liha potenca negativnega števila je negativna." : "Pazi na predznak koeficienta a."), M(1 / (a * den), "Koeficient a ostane v števcu.")]),
          "Negativni eksponent: x⁻ⁿ = 1/xⁿ.",
          [`f(x) = ${fx}`, `x = ${x}`], [`f(${x})`], "x^{-n} = \\dfrac{1}{x^n}",
          [`$${par(x)}^{${n}} = \\dfrac{1}{${par(x)}^{${-n}}} = \\dfrac{1}{${den}}$`, `$f(${x}) = \\dfrac{${a}}{${den}}${fracTex(a, den) === `\\dfrac{${a}}{${den}}` ? "" : ` = ${fracTex(a, den)}`}$`],
        );
      }
      if (level === 1 && k === 1) {
        const n = r.pick([2, 3, 4, 5, 6]), sgn = r.pick([1, -1, 0]), base = r.int(2, 3), c = sgn * base ** n;
        const sol = c === 0 ? 1 : n % 2 ? 1 : c > 0 ? 2 : 0;
        return T(
          `Koliko realnih rešitev ima enačba $x^{${n}} = ${c}$?`,
          num(sol, "", null, [M(n % 2 ? 2 : 1, n % 2 ? "Liha potenca je injektivna: vsako vrednost zavzame natanko enkrat." : "Pri sodi potenci imata x in −x isto vrednost."), M(n, "Število realnih rešitev ni enako eksponentu."), M(c < 0 && n % 2 === 0 ? 2 : 0, "Pomisli, ali je soda potenca lahko negativna.")]),
          "Nariši graf y = xⁿ in premico y = c. Koliko presečišč imata?",
          [`n = ${n}`, `c = ${c}`], [tt("število rešitev")], "x^n = c",
          [n % 2 ? `Eksponent je lih: funkcija je naraščajoča in zavzame vsako realno vrednost natanko enkrat.` : c > 0 ? `Eksponent je sod: rešitvi sta $x = \\pm${base}$.` : c === 0 ? "Edina rešitev je x = 0." : "Eksponent je sod: potenca ni nikoli negativna.", `Število rešitev: $${sol}$.`],
        );
      }
      if (level === 1) {
        const n = r.pick([-3, -2, -1, 2, 3, 4, 5]), even = n % 2 === 0;
        const ST = [
          ["Funkcija je soda.", even, "Graf je simetričen glede na os y le pri sodem eksponentu."],
          ["Funkcija je liha.", !even, "Liha je potenčna funkcija z lihim eksponentom."],
          ["Definicijsko območje je ℝ ∖ {0}.", n < 0, "Pri negativnem eksponentu x ne sme biti 0 (deljenje z 0)."],
          ["Definicijsko območje je ℝ.", n > 0, "Pri negativnem eksponentu x = 0 ni v definicijskem območju."],
          ["Zaloga vrednosti je [0, ∞).", n > 0 && even, "Zaloga vrednosti [0, ∞) velja le za pozitivni sodi eksponent."],
          ["Graf gre skozi točko (−1, −1).", !even, "Pri sodem eksponentu je (−1)ⁿ = 1."],
          ["Graf gre skozi točko (0, 0).", n > 0, "Pri negativnem eksponentu funkcija pri 0 ni definirana."],
        ];
        const right = r.pick(ST.filter((s) => s[1]));
        const wrong = ST.filter((s) => !s[1]).map((s) => [s[0], s[2]]);
        return T(
          `Katera trditev velja za funkcijo $f(x) = x^{${n}}$?`,
          choice(r, right[0], wrong),
          "Poglej, ali je eksponent sod ali lih in ali je pozitiven ali negativen.",
          [`n = ${n}`], [tt("pravilna trditev")], false,
          [`Eksponent ${n} je ${even ? "sod" : "lih"} in ${n > 0 ? "pozitiven" : "negativen"}.`, `Pravilna je trditev: ${right[0]}`],
        );
      }
      if (level === 2 && k === 0) {
        const root = r.pick([2, 3]), q = r.int(2, 5), p = r.int(-6, 6);
        const x = root === 2 ? q * q + p : q ** 3 - p;
        const tex = root === 2 ? `\\sqrt{x ${sg(-p)}} = ${q}` : `\\sqrt[3]{x ${sg(p)}} = ${q}`;
        return T(
          `Reši enačbo $${tex}$.`,
          num(x, "", null, root === 2 ? [M(q + p, "Obe strani moraš kvadrirati."), M(q * q - p, "Pazi na predznak pri prenosu števila.")] : [M(q + p, "Obe strani moraš kubirati."), M(q ** 3 + p, "Pazi na predznak pri prenosu števila."), M(q * q - p, "Pri tretjem korenu potenciraš na 3, ne na 2.")]),
          root === 2 ? "Obe strani kvadriraj in preveri rešitev." : "Obe strani dvigni na tretjo potenco.",
          [root === 2 ? `\\sqrt{x ${sg(-p)}} = ${q}` : `\\sqrt[3]{x ${sg(p)}} = ${q}`], ["x"],
          root === 2 ? "\\sqrt{u} = q \\Rightarrow u = q^2" : "\\sqrt[3]{u} = q \\Rightarrow u = q^3",
          [root === 2 ? `$x ${sg(-p)} = ${q * q}$` : `$x ${sg(p)} = ${q ** 3}$`, `$x = ${x}$`, `Preizkus: ${root === 2 ? `$\\sqrt{${x} ${sg(-p)}} = \\sqrt{${q * q}} = ${q}$` : `$\\sqrt[3]{${x} ${sg(p)}} = ${q}$`}`],
        );
      }
      if (level === 2 && k === 1) {
        const ctx = r.pick(["kocka", "krogla", "pad"]);
        if (ctx === "kocka") {
          const V = r.int(20, 300);
          return T(
            `Prostornina kocke je $V = ${V}\\ \\mathrm{cm^3}$. Koliko meri njen rob? Zaokroži na dve decimalki.`,
            num(Math.cbrt(V), "cm", 2, [M(V / 3, "Rob ni tretjina prostornine: a = ∛V."), M(Math.sqrt(V), "Prostornina kocke je a³, zato potrebuješ tretji koren.")]),
            "Prostornina kocke je V = a³. Izrazi a s korenom.",
            [dat("V", V, "cm³")], ["a"], "a = \\sqrt[3]{V}",
            [`$V = a^3 \\Rightarrow a = \\sqrt[3]{V}$`, `$a = \\sqrt[3]{${V}} ${res(Math.cbrt(V), 2, "cm")}$`],
          );
        }
        if (ctx === "krogla") {
          const V = r.int(50, 2000), rr = Math.cbrt((3 * V) / (4 * Math.PI));
          return T(
            `Krogla ima prostornino $V = ${V}\\ \\mathrm{cm^3}$. Kolikšen je njen polmer? Zaokroži na dve decimalki.`,
            num(rr, "cm", 2, [M(Math.cbrt(V), "Upoštevaj faktor 4π/3 v obrazcu za prostornino krogle."), M(Math.sqrt((3 * V) / (4 * Math.PI)), "Polmer je pod tretjim korenom (V ∝ r³).")]),
            "Iz V = 4πr³/3 izrazi r³, nato koreni.",
            [dat("V", V, "cm³")], ["r"], "r = \\sqrt[3]{\\dfrac{3V}{4\\pi}}",
            [`$r^3 = \\dfrac{3V}{4\\pi} = \\dfrac{3 \\cdot ${V}}{4\\pi} ${res((3 * V) / (4 * Math.PI), 2, "cm³")}$`, `$r ${res(rr, 2, "cm")}$`],
          );
        }
        const hh = r.int(5, 80), t = Math.sqrt((2 * hh) / 9.81);
        return T(
          `Pri prostem padu je čas padanja s višine $h$ enak $t = \\sqrt{\\dfrac{2h}{g}}$. Koliko časa pada kamen z višine $h = ${hh}\\ \\mathrm{m}$? Uporabi $g = 9{,}81\\ \\mathrm{m/s^2}$ in zaokroži na dve decimalki.`,
          num(t, "s", 2, [M((2 * hh) / 9.81, "Pozabil si koreniti."), M(Math.sqrt(hh / 9.81), "Pozabil si faktor 2 pod korenom.")]),
          "Vstavi podatke pod koren in koreni.",
          [dat("h", hh, "m"), dat("g", "9{,}81", "m/s²")], ["t"], "t = \\sqrt{\\dfrac{2h}{g}}",
          [`$\\dfrac{2h}{g} = \\dfrac{2 \\cdot ${hh}}{9{,}81} ${res((2 * hh) / 9.81, 3, "s²")}$`, `$t ${res(t, 2, "s")}$`],
        );
      }
      if (level === 2) {
        const kk = r.int(-8, 8), x0 = r.int(-3, 3), y = x0 ** 3 + kk;
        return T(
          `Funkcija $f(x) = x^3 ${sg(kk)}$ je injektivna. Izračunaj $f^{-1}(${y})$.`,
          num(x0, "", null, [M(y - kk, "Pozabil si izračunati tretji koren."), M(y ** 3 + kk, "To je f(y), ne obratna funkcija.")]),
          "Obratna funkcija korenske oblike: iz y = x³ + k izrazi x.",
          [`f(x) = x^3 ${sg(kk)}`, `y = ${y}`], ["f^{-1}(y)"], "f^{-1}(x) = \\sqrt[3]{x - k}",
          [`$f^{-1}(x) = \\sqrt[3]{x ${sg(-kk)}}$`, `$f^{-1}(${y}) = \\sqrt[3]{${y - kk}} = ${x0}$`],
        );
      }
      if (level === 3 && k === 0) {
        const a = r.int(1, 5), kk = r.pick([2, 3]), n = r.pick([-3, -2, -1, 2, 3, 4, 5].filter((x) => !(kk === 3 && Math.abs(x) > 3)));
        const yT = n > 0 ? `${a * kk ** n}` : (() => { const d = kk ** -n, g0 = gcd(a, d); return d / g0 === 1 ? `${a / g0}` : `\\dfrac{${a / g0}}{${d / g0}}`; })();
        return T(
          `Graf potenčne funkcije $f(x) = a\\,x^n$ ($n$ je celo število) gre skozi točki $(1, ${a})$ in $(${kk}, ${yT})$. Izračunaj $n$.`,
          num(n, "", null, [M(a * kk ** n / a, "To je razmerje vrednosti, ne eksponent. Reši kⁿ = razmerje."), M(-n, "Preveri predznak: če se vrednost pri večjem x zmanjša, je eksponent negativen.")]),
          "Iz prve točke dobiš a. Nato reši enačbo a·kⁿ = y.",
          [`T_1 = (1, ${a})`, `T_2 = (${kk}, ${yT})`], ["n"], "f(1) = a,\\ f(k) = a\\,k^n",
          [`$f(1) = a = ${a}$`, `$${a} \\cdot ${kk}^n = ${yT} \\Rightarrow ${kk}^n = ${n > 0 ? kk ** n : `\\dfrac{1}{${kk ** -n}}`}$`, `$n = ${n}$`],
        );
      }
      const ctx = r.pick([["vetrnica", "Moč vetrnice je sorazmerna s tretjo potenco hitrosti vetra", 3, "kW", "m/s", [5, 6, 8], [7, 9, 10, 12]], ["svetilka", "Gostota svetlobnega toka svetilke pada s kvadratom razdalje", -2, "W/m²", "m", [1, 2, 3], [4, 5, 6]], ["kocka", "Masa kovinske kocke je sorazmerna s tretjo potenco njenega roba", 3, "g", "cm", [2, 3, 4], [5, 6, 8]]]);
      const x1 = r.pick(ctx[5]), x2 = r.pick(ctx[6]), y1 = ctx[0] === "svetilka" ? r.int(20, 90) : r.int(10, 200);
      const y2 = y1 * (x2 / x1) ** ctx[2];
      const lab = ctx[0] === "vetrnica" ? ["v", "P"] : ctx[0] === "svetilka" ? ["r", "j"] : ["a", "m"];
      return T(
        `${ctx[1]}. Pri $${lab[0]}_1 = ${x1}\\ \\mathrm{${ctx[4]}}$ je $${lab[1]}_1 = ${y1}\\ ${ctx[3] === "W/m²" ? "\\mathrm{W/m^2}" : `\\mathrm{${ctx[3]}}`}$. Kolikšna je pri $${lab[0]}_2 = ${x2}\\ \\mathrm{${ctx[4]}}$? Zaokroži na eno decimalko.`,
        num(y2, ctx[3], 1, [M(y1 * (x2 / x1), "Količini nista premo sorazmerni: upoštevaj potenco."), M(y1 * (x2 / x1) ** (ctx[2] > 0 ? 2 : -1), "Preveri eksponent v modelu."), M(y1 * (x1 / x2) ** ctx[2], "Razmerje si obrnil.")]),
        "Model je y = c·xⁿ. Razmerje y₂/y₁ je (x₂/x₁)ⁿ.",
        [dat(`${lab[0]}_1`, x1, ctx[4]), dat(`${lab[1]}_1`, y1, ctx[3]), dat(`${lab[0]}_2`, x2, ctx[4])], [`${lab[1]}_2`],
        `\\dfrac{${lab[1]}_2}{${lab[1]}_1} = \\left(\\dfrac{${lab[0]}_2}{${lab[0]}_1}\\right)^{${ctx[2]}}`,
        [`$\\dfrac{${lab[0]}_2}{${lab[0]}_1} = \\dfrac{${x2}}{${x1}}$`, `$${lab[1]}_2 = ${y1} \\cdot \\left(\\dfrac{${x2}}{${x1}}\\right)^{${ctx[2]}} ${res(y2, 1, ctx[3])}$`],
      );
    },
  },

  // ------------------------------------------------------------ SŠ 4: matematična indukcija
  {
    id: "vrz-indukcija",
    topics: ["MAT-SS-4/matematicna-indukcija"],
    gen(level, r) {
      level = lv(level);
      const k = r.int(0, 2);
      const SUMS = [
        ["1 + 2 + 3 + \\ldots + n", (j) => j, "\\dfrac{n(n+1)}{2}", (n) => (n * (n + 1)) / 2],
        ["1 + 3 + 5 + \\ldots + (2n - 1)", (j) => 2 * j - 1, "n^2", (n) => n * n],
        ["1^2 + 2^2 + \\ldots + n^2", (j) => j * j, "\\dfrac{n(n+1)(2n+1)}{6}", (n) => (n * (n + 1) * (2 * n + 1)) / 6],
        ["1 + 2 + 4 + \\ldots + 2^{n-1}", (j) => 2 ** (j - 1), "2^n - 1", (n) => 2 ** n - 1],
        ["1 \\cdot 2 + 2 \\cdot 3 + \\ldots + n(n+1)", (j) => j * (j + 1), "\\dfrac{n(n+1)(n+2)}{3}", (n) => (n * (n + 1) * (n + 2)) / 3],
        ["1^3 + 2^3 + \\ldots + n^3", (j) => j ** 3, "\\left(\\dfrac{n(n+1)}{2}\\right)^2", (n) => ((n * (n + 1)) / 2) ** 2],
      ];
      if (level === 1 && k === 0) {
        const [lhs, term] = r.pick(SUMS), m = r.int(4, 12);
        return T(
          `Z indukcijo dokazujemo formulo za vsoto $${lhs}$. V indukcijskem koraku gremo od $n = ${m}$ k $n = ${m + 1}$: vsoti prištejemo en člen. Koliko je ta člen?`,
          num(term(m + 1), "", null, [M(term(m), `To je zadnji člen vsote za n = ${m}. Prišteti moramo naslednjega.`), M(m + 1, "Člen dobiš tako, da v splošni člen vstaviš n + 1.")]),
          "Vsota za n + 1 ima en člen več: splošni člen pri n + 1.",
          [`${tt("vsota")} = ${lhs}`, `n = ${m}`], [tt("dodani člen")], "S(n+1) = S(n) + a_{n+1}",
          [`Splošni člen vsote je $${lhs.split("\\ldots + ")[1]}$, pri $n = ${m + 1}$:`, `$a_{${m + 1}} = ${lhs.split("\\ldots + ")[1].replace(/(\d)n/g, "$1 \\cdot n").replace(/n/g, String(m + 1))} = ${term(m + 1)}$`],
        );
      }
      if (level === 1 && k === 1) {
        const [lhs, term, rhs, F] = r.pick(SUMS), m = r.int(3, 8);
        const direct = range(1, m).reduce((s, j) => s + term(j), 0);
        return T(
          `Trditev: $${lhs} = ${rhs}$. Preveri jo za $n = ${m}$: izračunaj vrednost leve strani.`,
          num(direct, "", null, [M(direct - term(m), "Vsota ima člene od 1 do n, zadnjega ne izpusti."), M(direct + term(m + 1), `Sešteti moraš le ${m} členov.`)]),
          "Zapiši vse člene vsote in jih seštej. Rezultat primerjaj z desno stranjo.",
          [`n = ${m}`], [tt("leva stran")], `${lhs} = ${rhs}`,
          [`Leva stran: $${range(1, m).map(term).join(" + ")} = ${direct}$`, `Desna stran: $${F(m)}$, torej trditev za $n = ${m}$ velja.`],
        );
      }
      if (level === 1) {
        const Q = r.pick([
          ["Kaj dokažemo v bazi indukcije?", "da trditev velja za najmanjše naravno število, npr. n = 1", [["da trditev velja za vsa naravna števila", "To je cilj celotnega dokaza, ne baze."], ["da iz veljavnosti za n sledi veljavnost za n + 1", "To je indukcijski korak."], ["da trditev velja za n = 1, 2 in 3", "Nekaj primerov ni dokaz; baza je en sam začetni primer."]]],
          ["Kaj predpostavimo v indukcijskem koraku?", "da trditev velja za neko naravno število n", [["da trditev velja za n + 1", "To moramo v koraku dokazati."], ["da trditev velja za vsa naravna števila", "To bi bil krožni sklep."], ["da trditev ne velja za n", "Predpostavimo veljavnost za n."]]],
          ["Trditev velja za n = 1 in iz veljavnosti za n sledi veljavnost za n + 2. Za katera naravna števila je dokazana?", "za vsa liha naravna števila", [["za vsa naravna števila", "Koraki po 2 preskočijo soda števila."], ["samo za n = 1", "Korak nas vodi od 1 k 3, 5, 7 …"], ["za vsa soda naravna števila", "Začnemo pri lihem številu 1."]]],
          ["Indukcijski korak je dokazan, baze pa nismo preverili. Kaj lahko sklepamo?", "nič: trditev je lahko nepravilna za vsa naravna števila", [["trditev velja za vsa naravna števila", "Brez baze veriga sklepov nima začetka (primer: n = n + 1 ima pravilen korak)."], ["trditev velja za vsa n razen 1", "Korak sam ne zagotovi nobenega primera."], ["trditev velja za n = 1", "Baze nismo preverili."]]],
        ]);
        return T(
          Q[0], choice(r, Q[1], Q[2]),
          "Dokaz z indukcijo ima dva dela: bazo (začetni primer) in indukcijski korak (iz n sledi n + 1).",
          [`${tt("indukcija")} = ${tt("baza in korak")}`], [tt("pravilen odgovor")], false,
          [`Pravilno: ${Q[1]}.`],
        );
      }
      if (level === 2 && k === 0) {
        const D = r.pick([
          ...[[2, 1, 1], [3, 1, 2], [4, 2, 3], [5, 3, 4], [6, 4, 5], [7, 5, 6], [9, 7, 8], [11, 9, 10]].map(([c, d, m]) => ["pot", c, d, m]),
          ...[[3], [5], [6], [7], [10]].map(([a]) => ["minus1", a, -1, a - 1]),
          ["kub", 0, 0, 6],
        ]);
        if (D[0] === "kub") {
          return T(
            "Dokazujemo, da je $n^3 - n$ deljivo s 6 za vsa naravna števila $n$. V koraku zapišemo $(n+1)^3 - (n+1) = (n^3 - n) + c \\cdot n(n+1)$. Koliko je $c$?",
            num(3, "", null, [M(1, "Razvij (n+1)³ = n³ + 3n² + 3n + 1."), M(6, "Število c ni delitelj, ampak koeficient pri n(n+1).")]),
            "Razvij (n + 1)³ in od rezultata odštej n³ − n.",
            ["\\text{izraz} = n^3 - n"], ["c"], "(n+1)^3 = n^3 + 3n^2 + 3n + 1",
            ["$(n+1)^3 - (n+1) = n^3 + 3n^2 + 3n + 1 - n - 1 = (n^3 - n) + 3n^2 + 3n$", "$3n^2 + 3n = 3n(n+1)$, torej $c = 3$.", "Ker je $n(n+1)$ sodo, je $3n(n+1)$ deljivo s 6."],
          );
        }
        const [, c, d, m] = D, cc = d * (1 - c);
        const expr = d === -1 ? `${c}^n - 1` : `${c}^n + ${d}`;
        return T(
          `Dokazujemo, da je $${expr}$ deljivo z ${m} za vsa naravna števila $n$. V koraku zapišemo $${c}^{n+1} ${d === -1 ? "- 1" : `+ ${d}`} = ${c}\\left(${expr}\\right) + c$. Koliko je $c$?`,
          num(cc, "", null, [M(d, "Ko izpostaviš osnovo, se tudi prosti člen pomnoži z njo; razliko moraš popraviti."), M(-cc, "Preveri predznak."), M(m, "Iščemo število c, ki ga prištejemo, ne delitelja.")]),
          `Izračunaj ${c}·(${c}ⁿ ${d === -1 ? "− 1" : `+ ${d}`}) in primerjaj z ${c}ⁿ⁺¹ ${d === -1 ? "− 1" : `+ ${d}`}.`,
          [`${tt("izraz")} = ${expr}`], ["c"], "a^{n+1} = a \\cdot a^n",
          [`$${c}\\left(${expr}\\right) = ${c}^{n+1} ${d === -1 ? `- ${c}` : `+ ${c * d}`}$`, `$${c}^{n+1} ${d === -1 ? "- 1" : `+ ${d}`} - \\left(${c}^{n+1} ${d === -1 ? `- ${c}` : `+ ${c * d}`}\\right) = ${cc}$`, `Oba člena sta deljiva z ${m} (prvi po indukcijski predpostavki), zato je deljiva tudi vsota.`],
        );
      }
      if (level === 2 && k === 1) {
        const [lhs, term, rhs, F] = r.pick(SUMS), m = r.int(5, 15);
        return T(
          `Za vsoto $S(n) = ${lhs}$ velja $S(n) = ${rhs}$. Izračunaj $S(${m + 1}) - S(${m})$ s formulo.`,
          num(F(m + 1) - F(m), "", null, [M(term(m), `To je ${m}. člen, razlika pa je ${m + 1}. člen.`), M(F(m + 1), "Odšteti moraš še S(m).")]),
          "Izračunaj obe vrednosti s formulo in ju odštej. Rezultat primerjaj s splošnim členom.",
          [`m = ${m}`], [`S(${m + 1}) - S(${m})`], `S(n) = ${rhs}`,
          [`$S(${m + 1}) = ${F(m + 1)}$, $S(${m}) = ${F(m)}$`, `$S(${m + 1}) - S(${m}) = ${F(m + 1) - F(m)}$, kar je ravno člen $a_{${m + 1}}$.`],
        );
      }
      if (level === 2) {
        const b = r.pick([3, 4, 5]), m = r.int(3, 6), zs = b - 1 === 2 ? "z" : "s";
        const lhs = (b ** m - 1) / (b - 1);
        return T(
          `Z indukcijo smo dokazali, da je $${b}^n - 1$ deljivo ${zs} ${b - 1}. Izračunaj količnik $\\dfrac{${b}^{${m}} - 1}{${b - 1}}$.`,
          num(lhs, "", null, [M(b ** m - 1, `Rezultat moraš še deliti ${zs} ${b - 1}.`), M(b ** (m - 1), "Količnik je vsota 1 + b + … + b^(m−1).")]),
          `Izračunaj ${b}^${m}, odštej 1 in deli. Preveri z vsoto 1 + ${b} + … + ${b}^${m - 1}.`,
          [`b = ${b}`, `m = ${m}`], [tt("količnik")], "\\dfrac{b^m - 1}{b - 1} = 1 + b + \\ldots + b^{m-1}",
          [`$${b}^{${m}} - 1 = ${b ** m - 1}$`, `$${b ** m - 1} : ${b - 1} = ${lhs}$`, `Preizkus: $${range(0, m - 1).map((j) => b ** j).join(" + ")} = ${lhs}$`],
        );
      }
      if (level === 3 && k === 0) {
        const INEQ = r.pick([
          ["2^n > n^2", (n) => 2n ** n > n * n],
          ["2^n > n^3", (n) => 2n ** n > n ** 3n],
          ["3^n > n^3", (n) => 3n ** n > n ** 3n],
          ["2^n > 2n + 1", (n) => 2n ** n > 2n * n + 1n],
          ["n! > 2^n", (n) => range(1, Number(n)).reduce((p, x) => p * BigInt(x), 1n) > 2n ** n],
          ["n! > 3^n", (n) => range(1, Number(n)).reduce((p, x) => p * BigInt(x), 1n) > 3n ** n],
          ["3^n > 2^n + n^2", (n) => 3n ** n > 2n ** n + n * n],
        ]);
        let n0 = 60;
        while (n0 > 1 && INEQ[1](BigInt(n0 - 1))) n0--;
        const first = range(1, 60).find((n) => INEQ[1](BigInt(n)));
        return T(
          `Neenakost $${INEQ[0]}$ velja za vsa naravna števila od nekega $n_0$ naprej (in jo nato dokažemo z indukcijo). Poišči najmanjši tak $n_0$, da velja za vsa $n \\ge n_0$.`,
          num(n0, "", null, [...(first !== n0 ? [M(first, `Neenakost velja pri n = ${first}, a ne za vsa večja n.`)] : []), M(n0 - 1, `Pri n = ${n0 - 1} neenakost še ne velja.`), M(n0 + 1, `Neenakost velja že pri n = ${n0}.`)]),
          "Izračunaj obe strani za n = 1, 2, 3, … in poišči, od kod naprej je leva stran vedno večja.",
          [`${tt("neenakost")} = ${INEQ[0]}`], ["n_0"], INEQ[0],
          [`Vrednosti: ${range(Math.max(1, n0 - 3), n0 + 1).map((n) => `$n = ${n}$: ${INEQ[1](BigInt(n)) ? "velja" : "ne velja"}`).join(", ")}.`, `Od $n_0 = ${n0}$ naprej velja (korak indukcije: leva stran raste hitreje od desne).`],
        );
      }
      if (level === 3 && k === 1) {
        const p = r.int(2, 6), q = r.int(-4, 3), A0 = p, Bc = p + 2 * q, ask = r.pick(["a", "b"]);
        const a1 = p + q, a2 = 2 * p + q, a3 = 3 * p + q, last = q >= 0 ? `${p}n + ${q}` : `${p}n - ${-q}`;
        return T(
          `Poišči števili $a$ in $b$, da velja $${a1} + ${a2} + ${a3} + \\ldots + (${last}) = \\dfrac{n(an + b)}{2}$ za vsa naravna števila $n$. Koliko je $${ask}$?`,
          num(ask === "a" ? A0 : Bc, "", null, ask === "a" ? [M(2 * p, "Desna stran je deljena z 2: a je koeficient pri n² v 2S(n)."), M(Bc, "To je b.")] : [M(p + q, "To je prvi člen, ne b."), M(A0, "To je a."), M(2 * q, "Vstavi n = 1: (a + b)/2 = prvi člen.")]),
          "Vstavi n = 1 in n = 2 ter reši sistem dveh enačb za a in b.",
          [`a_1 = ${a1}`, `a_2 = ${a2}`], [ask], "S(1) = a_1,\\ S(2) = a_1 + a_2",
          [`$n = 1$: $\\dfrac{a + b}{2} = ${a1} \\Rightarrow a + b = ${2 * a1}$`, `$n = 2$: $\\dfrac{2(2a + b)}{2} = ${a1 + a2} \\Rightarrow 2a + b = ${a1 + a2}$`, `$a = ${A0}$, $b = ${Bc}$ (formulo nato dokažemo z indukcijo).`],
        );
      }
      const m = r.int(4, 9), x = r.pick([0.1, 0.2, 0.05, 0.3]);
      const exact = (1 + x) ** m, bern = 1 + m * x;
      return T(
        `Z indukcijo dokažemo Bernoullijevo neenakost $(1 + x)^n \\ge 1 + nx$ za $x > -1$. Izračunaj razliko leve in desne strani za $n = ${m}$ in $x = ${tx(x)}$. Zaokroži na štiri decimalke.`,
        num(exact - bern, "", 4, [M(exact, "Izračunati moraš razliko, ne le leve strani."), M(bern - exact, "Leva stran je večja: odštej desno od leve.")]),
        "Izračunaj (1 + x)ⁿ z računalom in odštej 1 + nx.",
        [`n = ${m}`, `x = ${tx(x)}`], [tt("razlika")], "(1 + x)^n \\ge 1 + nx",
        [`$(1 + ${tx(x)})^{${m}} ${res(exact, 6, "")}$`, `$1 + ${m} \\cdot ${tx(x)} = ${tx(bern)}$`, `Razlika: $${eq(exact - bern, 4)} ${tx(exact - bern, 4)}$ (pozitivna, kot trdi neenakost).`],
      );
    },
  },
];
