// AUDIT-006: integrali, ki ne obstajajo (divergirajo), so prej dali končno število: ∫(1/x; −1; 1) ≈ −2,5·10⁻¹⁴,
// ∫(1/x; 0; 1) = 315,6, ∫(1/x²; −1; 1) = 1,9·10¹³, ∫(1/(x − 1); 0; 2) = 0,00105, ∫(tan x; 0; 3) = 64.
// Zdaj: napaka »intDiverge«; pri lihem notranjem polu še Cauchyjeva glavna vrednost (ni vrednost integrala).
// Pričakovane vrednosti iz SymPy (glavne vrednosti iz točnih nedoločenih integralov: log, Ei).
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze } from "../public/graph/scisolve.js";
import { evaluate } from "../public/graph/scicore.js";
import { integrate, integrateInfo, parse, compile } from "../public/graph/math.js";
import sl from "../public/i18n/sl.js";
import fs from "node:fs";

const ENV = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };

// [vnos, glavna vrednost (SymPy) ali null, če je ni]
const DIVERGENT = [
  ["∫(1/x;−1;1)", 0],
  ["∫(1/x;0;1)", null],
  ["∫(1/x^2;−1;1)", null],
  ["∫(1/(x−1);0;2)", 0],
  ["∫(tan(x);0;3)", 0.0100579150737],
  ["∫(1/x;−1;2)", 0.69314718056],
  ["∫(1/(x−0,5);0;3)", 1.60943791243],
  ["∫(1/x^3;−1;2)", 0.375],
  ["∫(1/(x−0,3);0;1)", 0.847297860387],
  ["∫(1/(x^2−1);0;2)", -0.549306144334],
  ["∫(1/cos(x);0;3)", 0.142068158389],
  ["∫(e^x/x;−1;1)", 2.11450175075],
  ["∫(1/x^2;0;1)", null],
  ["∫(ln(x)/x;0;1)", null],
  ["∫(1/(x−2)^2;0;3)", null],
  ["∫(1/(x−1);2;0)", 0],
  ["∫(1/x;1;−2)", 0.69314718056], // = −PV∫_{−2}^{1} = −(ln 1 − ln 2)
  ["2·∫(1/x;0;1)+1", null],
];

test("divergentni integrali: napaka intDiverge, glavna vrednost kot SymPy", () => {
  for (const [t, pv] of DIVERGENT) {
    for (const r of [analyze(t, ENV), evaluate(t, ENV)]) {
      assert.equal(r.error?.code, "intDiverge", `${t}: ${JSON.stringify(r)}`);
      if (pv === null) assert.equal(r.error.info.pv, undefined, `${t}: glavne vrednosti ni`);
      else assert.ok(Math.abs(r.error.info.pv - pv) <= 1e-5 * Math.max(1, Math.abs(pv)), `${t}: PV ${r.error.info.pv} ≠ ${pv}`);
    }
  }
});

test("integrate vrne NaN za divergentne, integrateInfo pove mesto pola", () => {
  const fn = (src) => {
    const g = compile(parse(src));
    return (x) => g({ x });
  };
  assert.ok(Number.isNaN(integrate(fn("1/x"), -1, 1)));
  assert.ok(Number.isNaN(integrate(fn("tan(x)"), 0, 10)));
  const r = integrateInfo(fn("tan(x)"), 0, 3);
  assert.equal(r.diverges, true);
  assert.ok(Math.abs(r.at - Math.PI / 2) < 1e-12);
  assert.equal(integrateInfo(fn("1/x"), 0, 1).at, 0);
});

test("običajni integrali ostanejo enaki (SymPy)", () => {
  const CONV = [
    ["∫(x^2;0;1)", 1 / 3],
    ["∫(sin(x);0;π)", 2],
    ["∫(1/x;1;2)", 0.693147180559945],
    ["∫(e^x;0;1)", 1.71828182845905],
    ["∫(1/(1+x^2);−1;1)", 1.5707963267949],
    ["∫(ln(x);0;1)", -1],
    ["∫(1/√(x);0;1)", 2],
  ];
  for (const [t, want] of CONV) {
    const r = analyze(t, ENV);
    assert.equal(r.kind, "value", `${t}: ${JSON.stringify(r)}`);
    assert.ok(Math.abs(r.value - want) < 1e-7, `${t}: ${r.value} ≠ ${want}`);
  }
});

test("sporočili sta v slovenščini in v vseh jezikih, z {pv}", () => {
  assert.match(sl["sc.errIntDiverge"], /divergira/);
  assert.match(sl["sc.errIntPv"], /\{pv\}/);
  const dir = new URL("../public/i18n/ui/", import.meta.url);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  assert.equal(files.length, 32);
  for (const f of files) {
    const j = JSON.parse(fs.readFileSync(new URL(f, dir), "utf8"));
    assert.ok(j["sc.errIntDiverge"] && j["sc.errIntPv"]?.includes("{pv}"), f);
    if (f !== "sl.json") assert.notEqual(j["sc.errIntDiverge"], sl["sc.errIntDiverge"], f);
  }
});
