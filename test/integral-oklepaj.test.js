// AUDIT-054: integrand z več členi je v zapisu integrala v oklepaju (∫₀² (x² − 1) dx, ne ∫₀² x² − 1 dx).
import { test } from "node:test";
import assert from "node:assert/strict";
import { compileLine, lineTex } from "../public/graph/scicore.js";

const tex = (s) => lineTex(compileLine(s).ast);

test("∫ z vsoto ali razliko: oklepaj okoli integranda; en člen brez oklepaja", () => {
  assert.equal(tex("∫(x^2 - 1; 0; 2)"), "\\int_{0}^{2}\\left(x^{2}-1\\right)\\,dx");
  assert.equal(tex("∫(x + sin(x); 0; π)"), "\\int_{0}^{\\pi}\\left(x+\\sin\\left(x\\right)\\right)\\,dx");
  assert.equal(tex("∫(x^2; 0; 1)"), "\\int_{0}^{1}x^{2}\\,dx");
  assert.equal(tex("∫(2x·e^x; 0; 1)").includes("\\left("), false);
  assert.equal(tex("∫(−x; 0; 1)"), "\\int_{0}^{1}-x\\,dx");
});
