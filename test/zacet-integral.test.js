// AUDIT-037: ročno natipkan nedokončan integral (»∫(«, »∫(x«, »∫(x;0«, »∫(x)«) se izriše kot predloga z okvirčki, ne surovo.
import test from "node:test";
import assert from "node:assert/strict";
import katex from "katex";
import { entryBase, caretTex, CARET, HOLE, TRUST } from "../public/graph/sci-vnos.js";

const env = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };
test("nedokončan ∫( se izriše kot predloga (AUDIT-037)", () => {
  const want = { "∫(": `\\int_{${HOLE}}^{${HOLE}}${HOLE}\\,dx`, "∫(x": `\\int_{${HOLE}}^{${HOLE}}x\\,dx`, "∫(x;0": `\\int_{0}^{${HOLE}}x\\,dx`, "∫(x)": `\\int_{${HOLE}}^{${HOLE}}x\\,dx`, "2+∫(x²": `2+\\int_{${HOLE}}^{${HOLE}}x^{2}\\,dx` };
  for (const [t, tex] of Object.entries(want)) {
    const b = entryBase(t, env);
    assert.ok(b?.ok, t);
    assert.equal(caretTex(b, t.length).split(CARET).join(""), tex, t);
    for (let p = 0; p <= t.length; p++) katex.renderToString(caretTex(b, p), { throwOnError: true, strict: "ignore", trust: TRUST });
  }
  // kazalec na koncu »∫(x« je za integrandom (tam se nadaljuje vnos)
  assert.equal(caretTex(entryBase("∫(x", env), 3).replace(CARET, "‸"), `\\int_{${HOLE}}^{${HOLE}}x‸\\,dx`);
});
