// AUDIT-020: predloge det, inverz, ∑, ∏ in Ans²° se med vnosom izrišejo brez napake KaTeX.
import { test } from "node:test";
import assert from "node:assert/strict";
import katex from "katex";
import { entryBase } from "../public/graph/sci-vnos.js";

const tex = (s) => {
  const b = entryBase(s, { comma: true });
  assert.ok(b?.ok, `${s}: ni izrisa`);
  return b.tex;
};
const renders = (s) => assert.doesNotThrow(() => katex.renderToString(tex(s), { throwOnError: true, trust: true, strict: "ignore" }), s);

test("predloge iz menija ⋯ in njihova vmesna stanja (AUDIT-020)", () => {
  for (const s of ["det([[; ]; [; ]])", "det([[1; ]; [; ]])", "inverz([[; ]; [; ]])", "∑_(n=1)^() ", "∏_(n=1)^() ", "∑_(n=1)^(5) ", "∑_(n=1)^(() ", "(∏_(n=1)^() ", "2+∑_(n=1)^(5)", "Ans²°", "2³°", "√(²", "∫(⁻¹;;)"]) renders(s);
  assert.match(tex("det([[; ]; [; ]])"), /^\\det\\begin\{pmatrix\}/);
  assert.doesNotMatch(tex("det([[; ]; [; ]])"), /\\left[([]/);
  assert.match(tex("∑_(n=1)^() "), /^\\sum_\{n=1\}/);
});

test("dokončani zapisi ostanejo enaki", () => {
  assert.equal(tex("det([[1; 2]; [3; 4]])"), "\\det\\begin{pmatrix}1 & 2 \\\\ 3 & 4\\end{pmatrix}");
  assert.equal(tex("∑_(n=1)^(5) n"), "\\sum_{n=1}^{5}n");
  assert.equal(tex("x²"), "x^{2}");
});
