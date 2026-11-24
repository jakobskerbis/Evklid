// AUDIT-009: enačbe z večkratnimi ničlami. (x − 5)³ = 0 je dajala »ni realnih rešitev« in tri lažne
// kompleksne ničle 5 ± 0,0002i, x³ − 3x + 2 = 0 pa lažno ničlo 1,026 + 0,033i. Pričakovano: SymPy roots().
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze, solutionTex } from "../public/graph/scisolve.js";
import { polyRoots, polyRootsMult } from "../public/graph/toolscore.js";

const ENV = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };
const close = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));

// [enačba, realne rešitve (vsaka enkrat), kompleksne [re, im]] iz SymPy
const CASES = [
  ["(x−5)^3=0", [5.0], []],
  ["(x−1)^2(x+2)=0", [-2.0, 1.0], []],
  ["x^3−3x+2=0", [-2.0, 1.0], []],
  ["(x−2)^4=0", [2.0], []],
  ["(x+1)^5=0", [-1.0], []],
  ["x^4−2x^2+1=0", [-1.0, 1.0], []],
  ["x^4+2x^2+1=0", [], [[0.0, -1.0], [0.0, 1.0]]],
  ["(2x−1)^2(x+3)=0", [-3.0, 0.5], []],
  ["x^3−6x^2+12x−8=0", [2.0], []],
  ["(x^2+1)^2(x−3)=0", [3.0], [[0.0, -1.0], [0.0, 1.0]]],
  ["x^5−x^4−2x^3+2x^2+x−1=0", [-1.0, 1.0], []],
  ["(x−π)^3=0", [3.141592653589793], []],
  ["(x−√(2))^2(x+1)=0", [-1.0, 1.4142135623730951], []],
  ["x^3=2", [1.2599210498948732], [[-0.6299605249474366, -1.0911236359717214], [-0.6299605249474366, 1.0911236359717214]]],
  ["x^6−3x^4+3x^2−1=0", [-1.0, 1.0], []],
  ["(3x+2)^3=0", [-0.6666666666666666], []],
  ["x^4−4x^3+6x^2−4x+1=0", [1.0], []],
  ["(x−0,5)^2(x−1,5)^2=0", [0.5, 1.5], []],
  ["x^8=0", [0.0], []],
  ["(x^2−2x+5)^2=0", [], [[1.0, -2.0], [1.0, 2.0]]],
  ["x^3−x^2−x+1=0", [-1.0, 1.0], []],
  ["(x−e)^2(x^2+π)=0", [2.718281828459045], [[0.0, -1.772453850905516], [0.0, 1.772453850905516]]],
];

test("enačbe z večkratnimi ničlami: rešitve kot SymPy, brez lažnih kompleksnih", () => {
  for (const [t, real, cx] of CASES) {
    const r = analyze(t, ENV);
    assert.equal(r.kind, "solve", t);
    assert.equal(r.roots.length, real.length, `${t}: realne ${JSON.stringify(r.roots)}`);
    r.roots.forEach((x, i) => assert.ok(close(x, real[i]), `${t}: ${x} ≠ ${real[i]}`));
    assert.equal(r.complex.length, cx.length, `${t}: kompleksne ${JSON.stringify(r.complex)}`);
    r.complex.forEach(([a, b], i) => assert.ok(close(a, cx[i][0]) && close(b, cx[i][1]), `${t}: ${a}+${b}i`));
  }
});

test("racionalne večkratne ničle so točne in v zapisu z »=«", () => {
  const tex = (t) => solutionTex(analyze(t, ENV));
  assert.equal(tex("(x−5)^3=0"), "x = 5");
  assert.equal(tex("x^3−3x+2=0"), "x_{1} = -2,\\quad x_{2} = 1");
  assert.equal(tex("(x−2)^4=0"), "x = 2");
  assert.equal(tex("(x+1)^5=0"), "x = -1");
  assert.deepEqual(analyze("(2x−1)^2(x+3)=0", ENV).roots, [-3, 0.5]);
});

test("polyRootsMult: večkratnosti kot SymPy, polyRoots vsako ničlo tolikokrat", () => {
  const M = {"(x−5)^3=0": [[5, 3]], "(x−1)^2(x+2)=0": [[-2, 1], [1, 2]], "(x+1)^5=0": [[-1, 5]], "x^6−3x^4+3x^2−1=0": [[-1, 3], [1, 3]], "(3x+2)^3=0": [[-0.6666666666666666, 3]], "x^8=0": [[0, 8]]};
  for (const [t, want] of Object.entries(M)) {
    const got = polyRootsMult(analyze(t, ENV).poly);
    assert.equal(got.length, want.length, t);
    got.forEach((g, i) => {
      assert.ok(close(g.re, want[i][0]) && g.im === 0, `${t}: ${g.re}`);
      assert.equal(g.m, want[i][1], `${t}: kratnost`);
    });
  }
  assert.deepEqual(polyRoots([1, -15, 75, -125]), [[5, 0], [5, 0], [5, 0]]);
  assert.deepEqual(polyRoots([1, 0, -3, 2]), [[-2, 0], [1, 0], [1, 0]]);
  // iracionalni koeficienti: (x − π)³ numerično, gruča treh ničel je ena trojna
  const pi = polyRootsMult([1, -3 * Math.PI, 3 * Math.PI ** 2, -(Math.PI ** 3)]);
  assert.equal(pi.length, 1);
  assert.equal(pi[0].m, 3);
  assert.ok(close(pi[0].re, Math.PI));
  // majhni koeficienti niso 0: x² − 10⁻¹² = 0 → ±10⁻⁶; x³ − 10⁻¹⁸ x = 0 → 0, ±10⁻⁹
  assert.deepEqual(polyRootsMult([1, 0, -1e-12]).map((r) => [r.re, r.m]), [[-1e-6, 1], [1e-6, 1]]);
  assert.ok(close(polyRootsMult([1, 0, -1e-18, 0])[2].re / 1e-9, 1));
  assert.deepEqual(polyRoots([1, -1e-300]), [[1e-300, 0]]);
  // bližnji, a različni ničli ostaneta dve: (x − 1)(x − 1,0001)
  assert.deepEqual(polyRootsMult([1, -2.0001, 1.0001]).map((r) => [r.re, r.m]), [[1, 1], [1.0001, 1]]);
});

test("neenačbe z večkratnimi ničlami ostanejo pravilne", () => {
  const iv = analyze("(x−1)^2(x+2)>0", ENV).intervals.map((i) => [i.lo, i.hi]);
  assert.deepEqual(iv, [[-2, 1], [1, Infinity]]);
  const iv2 = analyze("(x−5)^3≥0", ENV).intervals.map((i) => [i.lo, i.loIn, i.hi]);
  assert.deepEqual(iv2, [[5, true, Infinity]]);
});
