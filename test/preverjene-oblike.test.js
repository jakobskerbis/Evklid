// AUDIT-053 (prvotno AUDIT-050, ID je že zaseden): točna oblika rešitve (ulomek, celo število, koren, π, a + bi) sme imeti »=« le, če je preverjena točno
// (vstavljena v točen polinom da 0 ali je ničla točnega faktorja); sicer »≈«. Pred popravkom: x^15 + 7x − 1 = 0 → »= 1/7«
// (prava 0,142857142857114…), x^25 + 10⁻³⁰x − 1 = 0 → »= 1«, expandiran polinom s π → »= 141/11« (prava 141/11 + 10⁻¹⁴).
// Vrednosti: SymPy (nroots, 50 mest).
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze, solutionTex } from "../public/graph/scisolve.js";

const ENV = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };
const tex = (t) => solutionTex(analyze(t, ENV));
const parts = (t) => tex(t).split(",\\quad ");

test("ugibana točna oblika brez preverjanja: »≈«", () => {
  // SymPy: x^15 + 7x − 1 = 0 → 0,14285714285711…, x^25 + 10⁻³⁰x − 1 = 0 → 0,99999999999999999999999999999996
  const a = parts("x^15+7x−1=0");
  assert.equal(a[0], "x_{1} \\approx 0{,}142857");
  assert.ok(!a.join().includes("frac{1}{7}"), a[0]);
  assert.ok(a.every((p) => !p.includes(" = ")), a.join());
  const b = parts("x^25+10^(−30)x−1=0");
  assert.equal(b[0], "x_{1} \\approx 1");
  assert.ok(b.every((p) => !p.includes(" = ")), b.join());
});

test("expandiran polinom s π: bližnji ulomek ni ničla (SymPy: (x − π)(x + 2)(x − r − δ))", () => {
  const CASES = [
    // [enačba, napačna oblika, prava ničla r + δ]
    ["x^3+(−11900000000000011/1100000000000000 − π)·x^2+(−14100000000000011/550000000000000 + 11900000000000011·π/1100000000000000)·x+14100000000000011·π/550000000000000=0", "\\frac{141}{11}", 141 / 11 + 1e-14],
    ["x^3+(−52000000000000003/3000000000000000 − π)·x^2+(−58000000000000003/1500000000000000 + 52000000000000003·π/3000000000000000)·x+58000000000000003·π/1500000000000000=0", "\\frac{58}{3}", 58 / 3 + 1e-15],
    ["x^3+(52000000000000011/11000000000000000 − π)·x^2+(30000000000000011/5500000000000000 − 52000000000000011·π/11000000000000000)·x−30000000000000011·π/5500000000000000=0", "-\\frac{30}{11}", -30 / 11 - 1e-15],
  ];
  for (const [t, wrong, root] of CASES) {
    const s = tex(t);
    assert.ok(!s.includes(wrong), `${wrong}: ${s}`);
    assert.ok(s.includes("= -2") && s.includes("= \\pi \\approx 3{,}141593"), s); // −2 in π sta točni ničli
    assert.ok(analyze(t, ENV).roots.some((x) => Math.abs(x - root) < 1e-9), t);
  }
  // gruča (x − 8)³(x − 5 − π)³(x − 8,172) expandirano: 6407/800, 81/10 nista ničli
  const g = tex("x^7+((−3)·π+(−11793/250))·x^6+((3)·π^2+(31629/250)·π+(236427/250))·x^5+((−1)·π^3+(−27879/250)·π^2+(−275568/125)·π+(−2610211/250))·x^4+((8043/250)·π^3+(411741/250)·π^2+(5074953/250)·π+(17132631/250))·x^3+((−48516/125)·π^3+(−1508124/125)·π^2+(−13011564/125)·π+(−6683844/25))·x^2+((260128/125)·π^3+(5470944/125)·π^2+(7039968/25)·π+(2869664/5))·x+((−523008/125)·π^3+(−1569024/25)·π^2+(−1569024/5)·π+(−523008))=0");
  assert.ok(!/frac\{6407\}|frac\{81\}\{10\}|frac\{6527\}/.test(g), g);
});

test("preverjene točne oblike ostanejo z »=«", () => {
  const CASES = [
    ["sin(x)=0,5", "x_{1} = \\frac{\\pi}{6} \\approx 0{,}523599,\\quad x_{2} = \\frac{5\\pi}{6} \\approx 2{,}617994"],
    ["x^2=2", "x_{1,2} = \\pm \\sqrt{2}"],
    ["(x−π)(x−1)=0", "x_{1} = 1,\\quad x_{2} = \\pi \\approx 3{,}141593"],
    ["(x^2+1)(x−3)=0", "x_{1} = 3,\\quad x_{2} = -i,\\quad x_{3} = i"],
    ["x^3=8", "x_{1} = 2,\\quad x_{2} = -1-\\sqrt{3}\\,i,\\quad x_{3} = -1+\\sqrt{3}\\,i"],
    ["x^4+4=0", "x_{1} = -1-i,\\quad x_{2} = -1+i,\\quad x_{3} = 1-i,\\quad x_{4} = 1+i"],
    ["(x^2−3)*(x−π)=0", "x_{1} = -\\sqrt{3} \\approx -1{,}732051,\\quad x_{2} = \\sqrt{3} \\approx 1{,}732051,\\quad x_{3} = \\pi"],
    ["(x^2+x+1)*(x−π)=0", "x_{1} = \\pi \\approx 3{,}141593,\\quad x_{2} = -\\frac{1}{2}-\\frac{\\sqrt{3}}{2}\\,i"],
    // expandirano s π: točno preverjene (polinom v π z racionalnimi koeficienti je 0)
    ["x^3−πx^2−3x+3π=0", "x_{1} = -\\sqrt{3} \\approx -1{,}732051,\\quad x_{2} = \\sqrt{3} \\approx 1{,}732051,\\quad x_{3} = \\pi"],
    ["x^3−πx^2+x−π=0", "x_{1} = \\pi \\approx 3{,}141593,\\quad x_{2} = -i,\\quad x_{3} = i"],
    ["x^2−(π+1/2)x+π/2=0", "x_{1} = \\frac{1}{2} \\approx 0{,}5,\\quad x_{2} = \\pi"],
    ["(x+19/2)^2*(x−π)=0", "x_{1,2} = -\\frac{19}{2} \\approx -9{,}5"],
    ["2x=3", "x = \\frac{3}{2} \\approx 1{,}5"],
  ];
  for (const [t, start] of CASES) assert.ok(tex(t).startsWith(start), `${t}: ${tex(t)}`);
});

test("x^3 + 10⁻³⁰ = 0: ni »x = 0« (prava −10⁻¹⁰)", () => {
  assert.ok(!/^x = 0$/.test(tex("x^3+10^(−30)=0")), tex("x^3+10^(−30)=0"));
});

test("pregled #993: točna racionalna ničla in ničla linearnega faktorja se preverita v vpisani enačbi", () => {
  const CASES = [
    // [enačba, pričakovan zapis] (SymPy: točne ničle iz vpisanih decimalk)
    ["x−0,666666666667=0", "x = 0{,}666666666667"],
    ["(x−0,1428571428571)(x−1)=0", "x_{1} = 0{,}1428571428571,\\quad x_{2} = 1"],
    ["3x−1,000000000001=0", "x \\approx 0{,}333333"], // 1000000000001/3000000000000: ni končne decimalke
    ["((x−4/3)^2−10^(−24))=0", "x_{1} \\approx 1{,}333333333332,\\quad x_{2} \\approx 1{,}333333333334"],
    ["(x−√(2)−10^(−20))(x−1)=0", "x_{1} = 1,\\quad x_{2} \\approx 1{,}414214"],
    ["(x−π−10^(−15))(x−1)=0", "x_{1} = 1,\\quad x_{2} \\approx 3{,}141593"],
    ["x^2−0,666666666667x+1=0", "x_{1} \\approx 0{,}333333-0{,}942809\\,i,\\quad x_{2} \\approx 0{,}333333+0{,}942809\\,i"],
    ["(x−0,666666666667)^2+1=0", "x_{1} \\approx 0{,}666667-i,\\quad x_{2} \\approx 0{,}666667+i"],
    ["x^2=2,000000000001", "x_{1} \\approx -1{,}414214,\\quad x_{2} \\approx 1{,}414214"],
    ["x−2^60=0", "x = 1\\,152\\,921\\,504\\,606\\,846\\,976"],
    ["sin(x)=1/2+10^(−17)", "x_{1} \\approx 0{,}523599,\\quad x_{2} \\approx 2{,}617994"],
    // ostane točno
    ["x−0,25=0", "x = \\frac{1}{4} \\approx 0{,}25"],
    ["(x^2+1)(x−√(3))=0", "x_{1} = \\sqrt{3} \\approx 1{,}732051,\\quad x_{2} = -i,\\quad x_{3} = i"],
    ["(x−√2)(x+√8)=0", "x_{1} = -2\\sqrt{2} \\approx -2{,}828427,\\quad x_{2} = \\sqrt{2} \\approx 1{,}414214"],
    ["2sin(x)=√(2)", "x_{1} = \\frac{\\pi}{4} \\approx 0{,}785398,\\quad x_{2} = \\frac{3\\pi}{4} \\approx 2{,}356194"],
    ["cos(x)=−1/2", "x_{1} = \\frac{2\\pi}{3} \\approx 2{,}094395,\\quad x_{2} = \\frac{4\\pi}{3} \\approx 4{,}18879"],
    ["x^2+2x+1,000000000001=0", "x_{1} = -1-0{,}000001\\,i,\\quad x_{2} = -1+0{,}000001\\,i"],
  ];
  for (const [t, want] of CASES) assert.equal(tex(t), want, t);
  const DEG = { ...ENV, deg: true };
  assert.equal(solutionTex(analyze("sin(x)=0,5", DEG)), "x_{1} = 30^{\\circ},\\quad x_{2} = 150^{\\circ}");
  assert.equal(solutionTex(analyze("sin(x)=1/2+10^(−17)", DEG)), "x_{1} \\approx 30^{\\circ},\\quad x_{2} \\approx 150^{\\circ}");
});

test("pregled #993, 2. krog: kompleksne ničle z dvema korenoma ostanejo točne (dve spremenljivki v zeroAtExact)", () => {
  const CASES = [
    ["x^6=8", "x_{3} = -\\frac{\\sqrt{2}}{2}-\\frac{\\sqrt{6}}{2}\\,i"],
    ["x^6=27", "x_{3} = -\\frac{\\sqrt{3}}{2}-\\frac{3}{2}\\,i"],
    ["x^3=−3√3", "x_{2} = \\frac{\\sqrt{3}}{2}-\\frac{3}{2}\\,i"],
    ["x^2+√2x+2=0", "x_{1} = -\\frac{\\sqrt{2}}{2}-\\frac{\\sqrt{6}}{2}\\,i"],
    ["(x+1/3)^2+10^(−16)=0", "x_{1} = -\\frac{1}{3}-1\\cdot 10^{-8}\\,i"],
  ];
  for (const [t, part] of CASES) assert.ok(parts(t).includes(part), `${t}: ${tex(t)}`);
  // napačno locirana ničla v gruči z isto vrednostjo kot točna ni drugič »= 1« (prave 1 ± 10⁻¹⁰ i)
  assert.equal(tex("(x−1)((x−1)^2+10^(−20))=0").match(/ = 1/g)?.length, 1, tex("(x−1)((x−1)^2+10^(−20))=0"));
  // brez točne preverbe ostane ≈ (x² − 0,666666666667x + 1 = 0)
  assert.ok(parts("x^2−0,666666666667x+1=0").every((p) => p.includes("\\approx")));
});
