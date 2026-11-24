// AUDIT-044: razviti polinomi s π ali e z večkratnimi ničlami so kazali lažne kompleksne, npr. razvit
// (x − π)(x − 5,451)²(x − 5,454)² → 5,451 ± 0,00019i. Zdaj je vzorec kratnosti točen nad ℚ[π, e] (vstavitev
// naključnih ulomkov, π je transcendentno), ničle pa v gručah po tem vzorcu. Pričakovano: SymPy roots().
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze, solutionTex } from "../public/graph/scisolve.js";

const ENV = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };
const close = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));

// [enačba (razvita), realne [x, kratnost], kompleksne [re, im]] iz SymPy
const CASES = [
  ["x^5 - 21,81*x^4 - π*x^4 + 21,81*π*x^3 + 178,378533*x^3 - 648,40593474*x^2 - 178,378533*π*x^2 + 883,858272900516*x + 648,40593474*π*x - 883,858272900516*π=0", [[Math.PI, 1], [5.451, 2], [5.454, 2]], []],
  ["2*x^7 - 34,5992*x^6 - 4*π*x^6 + 2*π^2*x^5 + 169,85792008*x^5 + 69,1984*π*x^5 - 339,71584016*π*x^4 - 34,5992*π^2*x^4 + 153,137307968*x^4 - 3223,5641438208*x^3 - 306,274615936*π*x^3 + 169,85792008*π^2*x^3 + 153,137307968*π^2*x^2 + 6431,8485823488*x^2 + 6447,1282876416*π*x^2 - 12863,6971646976*π*x - 3223,5641438208*π^2*x + 6431,8485823488*π^2=0", [[-4, 1], [Math.PI, 2], [5.3248, 2], [5.325, 2]], []],
  ["x^2 - 2*π*x + π^2=0", [[Math.PI, 2]], []],
  ["x^3 - 3*π*x^2 + 3*π^2*x - π^3=0", [[Math.PI, 3]], []],
  ["x^3 - 2*e*x^2 - x^2 + 2*e*x + x*e^2 - e^2=0", [[1, 1], [Math.E, 2]], []],
  ["x^3 - 2*π*x^2 - e*x^2 + π^2*x + 2*e*π*x - e*π^2=0", [[Math.E, 1], [Math.PI, 2]], []],
  ["x^4 - 2*π*x^2 + π^2=0", [[-Math.sqrt(Math.PI), 2], [Math.sqrt(Math.PI), 2]], []],
  ["x^4 + 2*π*x^2 + π^2=0", [], [[0, -Math.sqrt(Math.PI)], [0, Math.sqrt(Math.PI)]]],
  ["x^3 - 4*π*x^2 + x^2 - 4*π*x + 4*π^2*x + 4*π^2=0", [[-1, 1], [2 * Math.PI, 2]], []],
  ["x^4 - 2*π*x^3 + 3*π^2*x^2/2 - π^3*x/2 + π^4/16=0", [[Math.PI / 2, 4]], []],
];

test("razviti polinomi s π, e: večkratne ničle brez lažnih kompleksnih (SymPy)", () => {
  for (const [t, real, cx] of CASES) {
    const r = analyze(t, ENV);
    assert.equal(r.roots.length, real.length, `${t.slice(0, 60)}: ${JSON.stringify(r.roots)} ${JSON.stringify(r.complex)}`);
    r.roots.forEach((x, i) => assert.ok(close(x, real[i][0]), `${t.slice(0, 60)}: ${x} ≠ ${real[i][0]}`));
    assert.deepEqual(r.mult, real.map((q) => q[1]), t.slice(0, 60));
    assert.equal(r.complex.length, cx.length, t.slice(0, 60));
    r.complex.forEach(([a, b], i) => assert.ok(close(a, cx[i][0]) && close(b, cx[i][1]), t.slice(0, 60)));
  }
});

test("brez večkratnih ničel ostane prejšnja pot (x² − (π + e)x + πe = 0)", () => {
  const r = analyze("x^2−(π+e)x+π·e=0", ENV);
  assert.ok(close(r.roots[0], Math.E) && close(r.roots[1], Math.PI));
  assert.deepEqual(r.mult, [1, 1]);
});

// Pregled #980 (2. krog): pravilo »manj kompleksnih« je dajalo samozavestno napačne ničle. Zdaj razcep nad ℚ[π, e]
// (cas.js factorP), ničle faktorjev pri π na 32 mest. Pričakovano: SymPy roots().
test("razcep nad ℚ[π]: (x − π)³((x − 2)² + 10⁻¹⁸) in (x − 8)³(x − π − 5)³(x − 8,172)", () => {
  const a = analyze("x^5 - 3*π*x^4 - 4*x^4 + 4000000000000000001*x^3/1000000000000000000 + 3*π^2*x^3 + 12*π*x^3 - 12*π^2*x^2 - 12000000000000000003*π*x^2/1000000000000000000 - π^3*x^2 + 12000000000000000003*π^2*x/1000000000000000000 + 4*π^3*x - 4000000000000000001*π^3/1000000000000000000=0", ENV);
  assert.deepEqual([a.roots, a.mult], [[Math.PI], [3]]);
  assert.deepEqual(a.complex, [[2, -1e-9], [2, 1e-9]]);
  assert.ok(!solutionTex(a).includes("x_{1,2} = 2"));
  const b = analyze("x^7 - 11793*x^6/250 - 3*π*x^6 + 3*π^2*x^5 + 31629*π*x^5/250 + 236427*x^5/250 - 2610211*x^4/250 - 275568*π*x^4/125 - 27879*π^2*x^4/250 - π^3*x^4 + 8043*π^3*x^3/250 + 411741*π^2*x^3/250 + 5074953*π*x^3/250 + 17132631*x^3/250 - 13011564*π*x^2/125 - 6683844*x^2/25 - 1508124*π^2*x^2/125 - 48516*π^3*x^2/125 + 260128*π^3*x/125 + 5470944*π^2*x/125 + 2869664*x/5 + 7039968*π*x/25 - 1569024*π/5 - 1569024*π^2/25 - 523008 - 523008*π^3/125=0", ENV);
  assert.deepEqual(b.mult, [3, 3, 1]);
  assert.ok(close(b.roots[0], 8) && close(b.roots[1], Math.PI + 5) && close(b.roots[2], 8.172));
});

// Pregled #980 (3. krog): razcep nad ℚ[π] je pri stopnji 8 presegel mejo velikosti števil (10⁴⁰⁰) in padel na
// številsko pot, kjer se je dvojna ničla π − 3 razcepila (≈ 0,141593 ∓ 1,93·10⁻⁸ i). Meja je zdaj 10²⁰⁰⁰ (čas
// ostane omejen z rokom 800 ms). Enačbe: SymPy expand.
test("razcep nad ℚ[π] tudi pri stopnji 8–10 (večkratne ničle s π ostanejo cele)", () => {
  const CASES = [
    // [enačba, realne ničle, kratnosti, kompleksne]
    ["(1)·x^8+(347/20 − 4·π)·x^7+(−307·π/5 + 6·π^2 + 227209/1600)·x^6+(−179689·π/400 − 4·π^3 + 118929/160 + 801·π^2/10)·x^5+(−106409·π/50 − 227·π^3/5 + π^4 + 855427/320 + 414107·π^2/800)·x^4+(−67789·π/10 − 102249·π^3/400 + 187·π^4/20 + 2539599/400 + 880961·π^2/400)·x^3+(−531261·π/40 − 96949·π^3/100 + 72329·π^4/1600 + 14568039/1600 + 2407667·π^2/400)·x^2+(−853629·π^3/400 − 5499711·π/400 + 5502357/800 + 121569·π^4/800 + 3541377·π^2/400)·x^1+(−367353·π^3/200 − 1102059·π/200 + 3306177/1600 + 367353·π^4/1600 + 4040883·π^2/800)·x^0=0", [-147 / 40, Math.PI - 3, Math.PI - 1], [2, 2, 2], [[-1, -4], [-1, 4]]],
    ["(1)·x^9+(407/20 − 5·π)·x^8+(−363·π/4 + 10·π^2 + 310489/1600)·x^7+(−248137·π/320 − 10·π^3 + 1870917/1600 + 319·π^2/2)·x^6+(−3375323·π/800 − 275·π^3/2 + 5·π^4 + 1569001/320 + 38629·π^2/32)·x^5+(−25338639·π/1600 − 145513·π^3/160 − π^5 + 231·π^4/4 + 22989801/1600 + 4706787·π^2/800)·x^4+(−15986889·π/400 − 98469·π^3/25 − 187·π^5/20 + 45043227/1600 + 105241·π^4/320 + 776211·π^2/40)·x^3+(−1106171·π^3/100 − 100318203·π/1600 − 72329·π^5/1600 + 54708831/1600 + 2011309·π^4/1600 + 4019247·π^2/100)·x^2+(−683697·π^3/40 − 42908859·π/800 − 121569·π^5/800 + 36320319/1600 + 4511283·π^4/1600 + 36288567·π^2/800)·x^1+(−8449119·π^3/800 − 367353·π^5/1600 − 29755593·π/1600 + 9918531/1600 + 3306177·π^2/160 + 4040883·π^4/1600)·x^0=0", [-147 / 40, Math.PI - 3, Math.PI - 1], [2, 3, 2], [[-1, -4], [-1, 4]]],
    ["(1)·x^10+(−11 − π)·x^9+(−2·π^2 + 11·π + 172/3)·x^8+(−172·π/3 − 4564/27 + 2·π^3 + 22·π^2)·x^7+(−344·π^2/3 − 22·π^3 + π^4 + 7105/27 + 4564·π/27)·x^6+(−11·π^4 − 7105·π/27 − π^5 − 4459/27 + 9128·π^2/27 + 344·π^3/3)·x^5+(−9128·π^3/27 − 14210·π^2/27 + 4459·π/27 + 11·π^5 + 172·π^4/3)·x^4+(−172·π^5/3 − 4564·π^4/27 + 8918·π^2/27 + 14210·π^3/27)·x^3+(−8918·π^3/27 + 7105·π^4/27 + 4564·π^5/27)·x^2+(−7105·π^5/27 − 4459·π^4/27)·x^1+(4459·π^5/27)·x^0=0", [-Math.PI, 7 / 3, Math.PI], [2, 3, 3], [[2, -3], [2, 3]]],
    ["(1)·x^9+(−6·π − 7/3)·x^8+(−347/36 + 44·π/3 + 13·π^2)·x^7+(−12·π^3 − 101·π^2/3 − 31/2 + 1009·π/18)·x^6+(−4187·π^2/36 − 487/36 + 523·π/6 + 4·π^4 + 100·π^3/3)·x^5+(−518·π^2/3 − 12·π^4 − 229/36 + 655·π/9 + 101·π^3)·x^4+(−31·π^4 − 1213·π^2/9 − 3/2 + 575·π/18 + 422·π^3/3)·x^3+(−40·π^4 − 1897·π^2/36 − 5/36 + 41·π/6 + 296·π^3/3)·x^2+(−24·π^4 − 28·π^2/3 + 5·π/9 + 31·π^3)·x^1+(−5·π^4 − 5·π^2/9 + 10·π^3/3)·x^0=0", [-0.5, Math.PI - 1 / 3, 5, 2 * Math.PI], [2, 2, 1, 2], [[-0.5, -Math.sqrt(3) / 2], [-0.5, Math.sqrt(3) / 2]]],
    ["(1)·x^8+(−4·π − 44/7)·x^7+(533/49 + 6·π^2 + 176·π/7)·x^6+(−264·π^2/7 − 2132·π/49 − 4·π^3 − 44/7)·x^5+(484/49 + 176·π/7 + π^4 + 3198·π^2/49 + 176·π^3/7)·x^4+(−2132·π^3/49 − 44·π^4/7 − 264·π^2/7 − 1936·π/49)·x^3+(2904·π^2/49 + 176·π^3/7 + 533·π^4/49)·x^2+(−1936·π^3/49 − 44·π^4/7)·x^1+(484·π^4/49)·x^0=0", [Math.PI, 22 / 7], [4, 2], [[0, -1], [0, 1]]],
  ];
  for (const [t, real, mult, cx] of CASES) {
    const r = analyze(t, ENV);
    assert.deepEqual(r.mult, mult, t);
    assert.ok(r.roots.every((x, i) => close(x, real[i])), `${t}: ${r.roots}`);
    assert.equal(r.complex.length, cx.length, t);
    assert.ok(r.complex.every(([a, b], i) => close(a, cx[i][0]) && close(b, cx[i][1])), `${t}: ${JSON.stringify(r.complex)}`);
  }
  assert.ok(solutionTex(analyze(CASES[0][0], ENV)).includes("x_{1,2} = -\\frac{147}{40}"));
});
