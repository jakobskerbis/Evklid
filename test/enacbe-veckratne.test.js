// AUDIT-009: enačbe z večkratnimi ničlami. (x − 5)³ = 0 je dajala »ni realnih rešitev« in tri lažne
// kompleksne ničle 5 ± 0,0002i, x³ − 3x + 2 = 0 pa lažno ničlo 1,026 + 0,033i. Pričakovano: SymPy roots().
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze, solutionTex } from "../public/graph/scisolve.js";
import { polyRoots, polyRootsMult } from "../public/graph/toolscore.js";
import fs from "node:fs";

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

// ---- 2. krog pregleda (#941): bližnje ničle, ulomki v razstavljenem zapisu, neenačbe ----

test("bližnji različni ničli ostaneta dve (točni ulomki iz vnosa)", () => {
  const roots = (t) => analyze(t, ENV).roots;
  assert.deepEqual(roots("(x−1)(x−1,000001)(x+2)=0"), [-2, 1, 1.000001]);
  assert.deepEqual(roots("(x−0,1)(x−0,1000001)(x−3)=0"), [0.1, 0.1000001, 3]);
  assert.deepEqual(roots("x^3−3,000001x^2+3,000002x−1,000001=0"), [1, 1.000001]);
  assert.deepEqual(roots("(x−1)(x−1,0000001)=0"), [1, 1.0000001]);
});

test("razstavljen zapis z ulomki: brez lažnih kompleksnih (SymPy)", () => {
  const a = analyze("(x−33/5)^2(x+2)(x−7/4)^4(x−15/2)=0", ENV);
  assert.deepEqual([a.roots, a.complex], [[-2, 1.75, 6.6, 7.5], []]);
  const b = analyze("((x+9/5)^2+4)^4=0", ENV);
  assert.deepEqual([b.roots, b.complex], [[], [[-1.8, -2], [-1.8, 2]]]);
  const c = analyze("((x+8/7)^2+4)^2((x−10)^2+16)(x−49/3)=0", ENV);
  assert.equal(c.roots.length, 1);
  assert.ok(Math.abs(c.roots[0] - 49 / 3) < 1e-14);
  assert.equal(c.complex.length, 4);
  const d = analyze("((x−2)^2+25/4)^2(x−8)(x+13/3)(x−157/6)^2=0", ENV);
  assert.equal(d.roots.length, 3);
  assert.ok(Math.abs(d.roots[2] - 157 / 6) < 1e-14);
  assert.deepEqual(d.complex, [[2, -2.5], [2, 2.5]]);
  // veliki koeficienti (prej polyCoeffs = null in manjkajoča −26,8)
  const e = analyze("5x^7+774x^6+51282x^5+1885284x^4+41536205x^3+548451550x^2+4018904000x+12608060000=0", ENV);
  assert.deepEqual(e.roots, [-26.8, -20]);
});

test("neenačbe: brez lažnih intervalov in točk (primeri iz pregleda)", () => {
  const iv = (t) => analyze(t, ENV).intervals.map((i) => [i.lo, i.loIn, i.hi, i.hiIn]);
  const r1 = iv("81x^6+1242x^5+6939x^4+17724x^3+19159x^2+2058x−7203>0"); // (3x + 7)⁴(x² + 6x − 3)
  assert.equal(r1.length, 2);
  assert.ok(Math.abs(r1[0][2] - (-3 - 2 * Math.sqrt(3))) < 1e-12 && Math.abs(r1[1][0] - (-3 + 2 * Math.sqrt(3))) < 1e-12);
  assert.deepEqual(iv("−196x^5−3836x^4−597x^3+282322x^2+398255x−6134700>0"), [[-Infinity, false, -12, false]]);
  const r3 = iv("5x^7−155x^6+1955x^5−12145x^4+33920x^3−14620x^2−67200x−26000>0");
  assert.equal(r3.length, 2);
  assert.equal(r3[0][0], 5);
  assert.ok(Math.abs(r3[0][2] - (3 + Math.sqrt(13))) < 1e-12 && r3[1][0] === r3[0][2]);
  assert.deepEqual(iv("x^7−18x^6+128x^5−462x^4+892x^3−876x^2+369x−54>0"), [[6, false, Infinity, false]]);
  // (x − 2)²(x + 1) ≥ 0: [−1; ∞), dvojna ničla 2 ni izločena; (x − 2)² ≤ 0: samo {2}
  assert.deepEqual(iv("(x−2)^2(x+1)≥0"), [[-1, true, Infinity, false]]);
  assert.deepEqual(iv("(x−2)^2≤0"), [[2, true, 2, true]]);
});

// 1200 naključnih polinomov (SymPy roots(), naključni seed 1, stopnje 2–8, večkratne, kompleksne, iracionalne
// kvadratne): enačba razvita in razstavljena, neenačbi > 0 in < 0. »main«: kaj je bilo pravilno pred popravkom.
test("1200 polinomov iz SymPy: nič, kar je bilo pravilno, ne postane napačno", () => {
  const cases = JSON.parse(fs.readFileSync(new URL("./fixtures/polinomi-sympy.json", import.meta.url)));
  const near6 = (a, b) => a === b || Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(b));
  const okEq = (r, c) =>
    r?.kind === "solve" &&
    r.roots.length === c.real.length &&
    r.roots.every((x, i) => near6(x, c.real[i])) &&
    r.complex.length === c.cx.length &&
    [...r.complex].sort((a, b) => a[0] - b[0] || a[1] - b[1]).every((z, i) => near6(z[0], c.cx[i][0]) && near6(z[1], c.cx[i][1]));
  const want = (c, sgn) => {
    const rr = c.mults.filter((m) => m[1] === 0);
    const edges = [-Infinity, ...rr.map((m) => m[0]), Infinity];
    let s = sgn * c.lead * (c.deg % 2 ? -1 : 1);
    const w = [];
    for (let i = 0; i + 1 < edges.length; i++) {
      if (s > 0) w.push([edges[i], edges[i + 1]]);
      if (i < rr.length && rr[i][2] % 2) s = -s;
    }
    return w;
  };
  const okIq = (r, w) => r.intervals.length === w.length && r.intervals.every((x, i) => near6(x.lo, w[i][0]) && near6(x.hi, w[i][1]));
  const count = { eq: 0, fac: 0, gt: 0, lt: 0 };
  const regress = [];
  for (const c of cases) {
    const res = {
      eq: okEq(analyze(c.eq, ENV), c),
      fac: okEq(analyze(c.fac, ENV), c),
      gt: okIq(analyze(c.eq.replace("=0", ">0"), ENV), want(c, 1)),
      lt: okIq(analyze(c.eq.replace("=0", "<0"), ENV), want(c, -1)),
    };
    for (const k in res) {
      if (res[k]) count[k]++;
      else if (c.main.split(",").includes(k)) regress.push(`${k}: ${c[k === "fac" ? "fac" : "eq"]}`);
    }
  }
  assert.deepEqual(regress, [], "pravilno pred popravkom, zdaj napačno");
  // pred popravkom: eq 582, fac 503, > 956, < 990 od 1200
  assert.ok(count.eq >= 1190 && count.fac >= 1190 && count.gt >= 1190 && count.lt >= 1190, JSON.stringify(count));
});

// ---- 3. krog (#941): iracionalni koeficienti, bližnje decimalne ničle, zapis ----

test("iracionalni faktorji: vsak faktor posebej, kratnosti se seštejejo (SymPy)", () => {
  const ra = (t) => analyze(t, ENV);
  const a = ra("(x−6,177104)(x−6,177106)(x+√(7))=0");
  assert.deepEqual([a.roots, a.complex], [[-Math.sqrt(7), 6.177104, 6.177106], []]);
  const b = ra("(x−√(7))^2(x−4/3)(x−π)=0");
  assert.deepEqual([b.roots, b.complex, b.mult], [[4 / 3, Math.sqrt(7), Math.PI], [], [1, 2, 1]]);
  const c = ra("(x−π)^2(x−3)^2=0");
  assert.deepEqual([c.roots, c.mult], [[3, Math.PI], [2, 2]]);
  const d = ra("(x−9,490161)^3(x−9,490162)^3=0");
  assert.deepEqual([d.roots, d.mult], [[9.490161, 9.490162], [3, 3]]);
  const e = ra("(x+√(5))^6(x+19/9)^2=0");
  assert.deepEqual([e.roots, e.complex, e.mult], [[-Math.sqrt(5), -19 / 9], [], [6, 2]]);
  const f = ra("(x−√(2))(x^2−2)=0"); // isti koren iz dveh faktorjev
  assert.deepEqual(f.mult, [1, 2]);
  const g = ra("x^2−2√(2)x+2=0"); // razvito: (x − √2)², kratnost iz meje napake
  assert.deepEqual([g.roots, g.mult], [[Math.SQRT2], [2]]);
  // razvito, bližnji decimalni ničli in √7: ostaneta dve (prej ena izgine)
  const h = ra("x^3 + √(7)*x^2 + 16,676946*x^2 + 16,676946*√(7)*x + 69,530131971728*x + 69,530131971728*√(7)=0");
  assert.equal(h.roots.length, 3);
});

test("bližnje rešitve se v zapisu razlikujejo", () => {
  const tex = (t) => solutionTex(analyze(t, ENV));
  assert.equal(tex("(x−0,1)(x−0,1000001)(x−3)=0"), "x_{1} = \\frac{1}{10} \\approx 0{,}1,\\quad x_{2} = 0{,}1000001,\\quad x_{3} = 3");
  assert.equal(tex("(x−1)(x−1,0000000001)=0"), "x_{1} = 1,\\quad x_{2} = 1{,}0000000001");
  assert.equal(tex("(x−1)(x−2)=0"), "x_{1} = 1,\\quad x_{2} = 2");
});

// 2700 razstavljenih (seme 3 in 4: decimalke s 3–7 mesti, bližnje ničle, ulomki, kratnosti do 6, √2…√10, π,
// stopnje do 12) + 1151 istih z iracionalnimi koeficienti, razvitih s SymPy expand. »main«: pravilno pred popravkom.
test("3851 polinomov z iracionalnimi koeficienti iz SymPy: nič pravilnega ne postane napačno", () => {
  const cases = JSON.parse(fs.readFileSync(new URL("./fixtures/polinomi-sympy-3.json", import.meta.url)));
  const near7 = (a, b) => Math.abs(a - b) <= 1e-7 * Math.max(1, Math.abs(b));
  const ok = (r, c) =>
    r?.kind === "solve" &&
    r.roots.length === c.real.length &&
    r.roots.every((x, i) => near7(x, c.real[i])) &&
    r.complex.length === c.cx.length &&
    [...r.complex].sort((a, b) => a[0] - b[0] || a[1] - b[1]).every((z, i) => near7(z[0], c.cx[i][0]) && near7(z[1], c.cx[i][1]));
  const count = { razstavljeno: 0, razvito: 0 };
  const regress = [];
  for (const c of cases) {
    if (ok(analyze(c.t, ENV), c)) count[c.src]++;
    else if (c.main) regress.push(c.t);
  }
  assert.deepEqual(regress, [], "pravilno pred popravkom, zdaj napačno");
  // pred popravkom: razstavljeno 958/2700, razvito 339/1151 (preostale razvite napake: SymPy izpiše 15 mest, zato
  // je vpisan polinom drugačen od razstavljenega in ima res kompleksne ničle)
  assert.equal(count.razstavljeno, 2700);
  assert.ok(count.razvito >= 1090, JSON.stringify(count));
});
