// AUDIT-023: kratnost rešitve v zapisu: (x − 5)³ = 0 → x₁,₂,₃ = 5 (trojna rešitev). Kratnosti: SymPy roots().
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { analyze, solutionTex } from "../public/graph/scisolve.js";
import sl from "../public/i18n/sl.js";

const ENV = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };
const tex = (t, f) => solutionTex(analyze(t, ENV), true, "auto", f);

test("kratnost kot SymPy roots() in v zapisu", () => {
  // [enačba, kratnosti realnih (SymPy), zapis]
  const CASES = [
    ["(x−5)^3=0", [3], "x_{1,2,3} = 5\\;(\\text{trojna rešitev})"],
    ["x^2−6x+9=0", [2], "x_{1,2} = 3\\;(\\text{dvojna rešitev})"],
    ["(x−1)^2(x+2)=0", [1, 2], "x_{1} = -2,\\quad x_{2,3} = 1\\;(\\text{dvojna rešitev})"],
    ["(x+1)^5=0", [5], "x_{1,\\ldots,5} = -1\\;(\\text{5-kratna rešitev})"],
    ["x^4−2x^2+1=0", [2, 2], "x_{1,2} = -1\\;(\\text{dvojna rešitev}),\\quad x_{3,4} = 1\\;(\\text{dvojna rešitev})"],
    ["x^5−x^4−2x^3+2x^2+x−1=0", [2, 3], "x_{1,2} = -1\\;(\\text{dvojna rešitev}),\\quad x_{3,4,5} = 1\\;(\\text{trojna rešitev})"],
    ["(x−π)^2(x−3)^2=0", [2, 2], null],
    ["(x−√(7))^2(x−4/3)(x−π)=0", [1, 2, 1], null],
    ["x^8=0", [8], "x_{1,\\ldots,8} = 0\\;(\\text{8-kratna rešitev})"],
    ["(x−1)(x−2)=0", [1, 1], "x_{1} = 1,\\quad x_{2} = 2"],
    ["x^2=4", [1, 1], "x_{1} = -2,\\quad x_{2} = 2"],
  ];
  for (const [t, mult, want] of CASES) {
    const r = analyze(t, ENV);
    assert.deepEqual(r.mult, mult, t);
    if (want) assert.equal(tex(t), want, t);
  }
  // kompleksna dvojna: ((x + 9/5)² + 4)² = 0 (SymPy: −9/5 ± 2i, vsaka kratnosti 2)
  assert.equal(tex("((x+9/5)^2+4)^2=0"), "x_{1,2} = -\\frac{9}{5}-2i\\;(\\text{dvojna rešitev}),\\quad x_{3,4} = -\\frac{9}{5}+2i\\;(\\text{dvojna rešitev})");
});

test("oznaka v jeziku vmesnika (prevod), vsi jeziki imajo ključe", () => {
  const en = (m) => (m === 2 ? "double root" : m === 3 ? "triple root" : `root of multiplicity ${m}`);
  assert.equal(tex("(x−5)^3=0", en), "x_{1,2,3} = 5\\;(\\text{triple root})");
  assert.equal(sl["sc.mult.2"], "dvojna rešitev");
  assert.match(sl["sc.mult.n"], /\{n\}/);
  const dir = new URL("../public/i18n/ui/", import.meta.url);
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const j = JSON.parse(fs.readFileSync(new URL(f, dir), "utf8"));
    assert.ok(j["sc.mult.2"] && j["sc.mult.3"] && j["sc.mult.n"]?.includes("{n}"), f);
  }
});
