// AUDIT-048: istovetnost z ulomkom ali korenom. 1/(x − 2) = 1/(x − 2) je dala »rešitve ni na [−10¹²; 10¹²]«,
// √x = √x naključne »rešitve« 1/100, 1/50 …, ln(x²) ≤ 2 ln x desetine drobnih intervalov (šum zaokrožitve).
// Pričakovano (SymPy 1.14): L − R poenostavljeno, rešitev = presek definicijskih območij obeh strani
// (continuous_domain), če velja primerjava za konstanto L − R, sicer ∅.
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze, solutionTex, intervalsTex } from "../public/graph/scisolve.js";

const ENV = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };

// [vhod, pričakovano: "R" (vsak x iz območja) ali "0" (∅), pogoj območja v TeX ali ""]
const CASES = [
  ["1/(x-2)=1/(x-2)", "R", "x \\ne 2"],
  ["x/x=1", "R", "x \\ne 0"],
  ["(x²−4)/(x−2)=x+2", "R", "x \\ne 2"],
  ["1/x=1/x", "R", "x \\ne 0"],
  ["sqrt(x)=sqrt(x)", "R", "x \\ge 0"],
  ["ln(x)=ln(x)", "R", "x > 0"],
  ["sqrt(x)^2=x", "R", "x \\ge 0"],
  ["ln(x^2)=2ln(x)", "R", "x > 0"],
  ["e^(ln(x))=x", "R", "x > 0"],
  ["(x^3-1)/(x-1)=x^2+x+1", "R", "x \\ne 1"],
  ["x+1=x+1", "R", ""],
  ["sin(x)^2+cos(x)^2=1", "R", ""],
  // L − R je neničelna konstanta: ni rešitve (prej x = x + 10⁻¹² »x ∈ ℝ«, x/x = 1 + 10⁻¹⁵ »x = −100«)
  ["x/x=2", "0", ""],
  ["x=x+10^(-12)", "0", ""],
  ["x/x=1+10^(-15)", "0", ""],
  ["1/(x-2)=1/(x-2)+1", "0", ""],
  ["x+π=x+3", "0", ""],
  ["x=x+1", "0", ""],
];

for (const [text, want, cond] of CASES)
  test(`AUDIT-048: ${text}`, () => {
    const r = analyze(text, { ...ENV });
    assert.equal(r.kind, "solve", JSON.stringify(r));
    if (want === "R") {
      assert.equal(r.all, true);
      assert.equal(r.cond || "", cond);
      assert.equal(solutionTex(r), "x \\in \\mathbb{R}");
    } else {
      assert.equal(r.none, true);
      assert.equal(solutionTex(r), "x \\in \\varnothing");
    }
  });

// neenačbe: a ≤ a velja v vsem območju, a < a nikjer; konstanta c: velja, če velja c op 0
const INEQ = [
  ["ln(x^2)<=2ln(x)", "R", "x > 0"],
  ["1/(x-2)>=1/(x-2)", "R", "x \\ne 2"],
  ["(x²−4)/(x−2)<=x+2", "R", "x \\ne 2"],
  ["x/x<1", "0", ""],
  ["sqrt(x)<sqrt(x)", "0", ""],
  ["x/x<2", "R", "x \\ne 0"],
  ["x/x>2", "0", ""],
];
for (const [text, want, cond] of INEQ)
  test(`AUDIT-048 neenačba: ${text}`, () => {
    const r = analyze(text, { ...ENV });
    assert.equal(r.kind, "ineq", JSON.stringify(r));
    if (want === "R") {
      assert.equal(intervalsTex(r), "x \\in \\mathbb{R}");
      assert.equal(r.cond || "", cond);
    } else assert.equal(intervalsTex(r), "x \\in \\varnothing");
  });

// navadne enačbe ostanejo, kot so bile
test("AUDIT-048: enačbe brez istovetnosti se ne spremenijo", () => {
  assert.deepEqual(analyze("x^2=4", { ...ENV }).roots, [-2, 2]);
  assert.deepEqual(analyze("ln(x-1)=ln(5-x)", { ...ENV }).roots, [3]);
  assert.ok(Math.abs(analyze("sqrt(x+3)=x-1", { ...ENV }).roots[0] - (3 + Math.sqrt(17)) / 2) < 1e-12);
  assert.equal(analyze("2x+3=7", { ...ENV }).roots[0], 2);
});

// pogoj iz CAS mora biti pravo definicijsko območje, sicer ga ne pokažemo (pregled PR #988):
// √(x² − 1) je definiran za |x| ≥ 1 (CAS je dal »x ≥ −1, x ≥ 1«), ∛x tudi za x < 0 (CAS je dal »x ≥ 0«),
// √(1 − x²) za −1 ≤ x ≤ 1 (CAS je dal »x ≤ −1, x ≥ 1«)
test("AUDIT-048: napačen pogoj iz CAS ne pride v odgovor", () => {
  for (const text of ["sqrt(x^2-1)=sqrt(x^2-1)", "x^(1/3)=cbrt(x)", "sqrt(1-x^2)=sqrt(1-x^2)"]) {
    const r = analyze(text, { ...ENV });
    assert.ok(!/x \\ge -1|x \\ge 0|x \\le -1/.test(r.cond || ""), `${text}: ${r.cond}`);
  }
  assert.equal(analyze("x^(1/3)=cbrt(x)", { ...ENV }).all, true);
  assert.equal(analyze("sqrt(x-1)*sqrt(x+1)=sqrt(x^2-1)", { ...ENV }).all, true);
});
