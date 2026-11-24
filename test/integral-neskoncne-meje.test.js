// AUDIT-008: integrali z neskončno mejo so dali »—« (∫(1/x²; 1; ∞) bi moral biti 1, ∫(e^(−x²); −∞; ∞) = √π),
// divergentni (∫(1/x; 1; ∞)) pa morajo povedati, da divergirajo. Pričakovane vrednosti: SymPy integrate.
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze } from "../public/graph/scisolve.js";
import { integrate, parse, compile } from "../public/graph/math.js";

const ENV = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };

// [vnos, SymPy]
const CONVERGENT = [
  ["∫(1/x^2;1;∞)", 1],
  ["∫(e^(−x^2);−∞;∞)", 1.772453850905516],
  ["∫(1/(1+x^2);−∞;∞)", Math.PI],
  ["∫(x·e^(−x);0;∞)", 1],
  ["∫(e^x;−∞;0)", 1],
  ["∫(1/√(x^3);1;∞)", 2],
  ["∫(e^(−x)/√(x);0;∞)", 1.772453850905516],
  ["∫(1/(x^2−1);2;∞)", 0.54930614433405485],
  ["∫(ln(x)/x^2;1;∞)", 1],
  ["∫(e^(−2x);0;∞)", 0.5],
  ["∫(1/x^2;−∞;−1)", 1],
  ["∫(1/(x^2+4);0;∞)", 0.78539816339744831],
  ["∫(x^2·e^(−x);0;∞)", 2],
  ["∫(1/(x(x+1));1;∞)", 0.69314718055994531],
  ["∫(e^(−x)·sin(x);0;∞)", 0.5],
  ["∫(1/x^2;∞;1)", -1],
];
const DIVERGENT = ["∫(1/x;1;∞)", "∫(1/x^2;0;∞)", "∫(1;0;∞)", "∫(1/√(x);1;∞)", "∫(x^2;−∞;∞)", "∫(1/(x−3)^2;0;∞)"];

test("neskončne meje: vrednosti kot SymPy (točne ali z ≈ in pravilnimi mesti)", () => {
  for (const [t, want] of CONVERGENT) {
    const r = analyze(t, ENV);
    assert.equal(r.kind, "value", `${t}: ${JSON.stringify(r)}`);
    if (r.est) assert.ok(Math.abs(r.value - want) <= 1e-6 * Math.max(1, Math.abs(want)), `${t}: ${r.value} ≠ ${want}`);
    else assert.ok(Math.abs(r.value - want) <= 1e-11 * Math.max(1, Math.abs(want)), `${t}: ${r.value} ≠ ${want} (točno)`);
  }
  assert.equal(analyze("∫(1/x^2;1;∞)", ENV).value, 1);
  assert.equal(analyze("∫(1/(1+x^2);−∞;∞)", ENV).value, Math.PI);
  const g = analyze("∫(e^(−x^2);−∞;∞)", ENV);
  assert.ok(g.est && Math.abs(g.value - Math.sqrt(Math.PI)) < 1e-8, `√π: ${g.value}`);
});

test("neskončne meje: divergentni integrali povedo, da divergirajo", () => {
  for (const t of DIVERGENT) assert.equal(analyze(t, ENV).error?.code, "intDiverge", t);
});

test("nihajoči integrali do ∞ ne dajo izmišljenega števila", () => {
  for (const t of ["∫(sin(x)/x;0;∞)", "∫(sin(x);0;∞)"]) {
    const r = analyze(t, ENV);
    assert.ok(r.error || !Number.isFinite(r.value), `${t}: ${JSON.stringify(r)}`);
  }
  const f = compile(parse("1/x^2"));
  assert.ok(Math.abs(integrate((x) => f({ x }), 1, Infinity) - 1) < 1e-9);
});
