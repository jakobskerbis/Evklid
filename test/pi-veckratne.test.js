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
