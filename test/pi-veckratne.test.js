// AUDIT-044: razviti polinomi s π ali e z večkratnimi ničlami so kazali lažne kompleksne, npr. razvit
// (x − π)(x − 5,451)²(x − 5,454)² → 5,451 ± 0,00019i. Zdaj je vzorec kratnosti točen nad ℚ[π, e] (vstavitev
// naključnih ulomkov, π je transcendentno), ničle pa v gručah po tem vzorcu. Pričakovano: SymPy roots().
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze } from "../public/graph/scisolve.js";

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
