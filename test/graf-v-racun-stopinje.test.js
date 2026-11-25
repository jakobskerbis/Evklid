// »Uporabi v računu« v grafu s stopinjami (pregled #998): ∫(f; a; b), vpisan v znanstveni kalkulator, mora dati isto
// kot ploščina na grafu, v načinu DEG, RAD in GRA kalkulatorja (integrali so v kalkulatorju vedno v radianih).
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildModel, emptyState, degreesToCalc, toNum } from "../public/graph/model.js";
import { integrate } from "../public/graph/math.js";
import { analyze } from "../public/graph/scisolve.js";

const graphArea = (text, a, b, deg) => {
  const s = emptyState();
  s.zapis = 3;
  s.vejica = true;
  s.settings.deg = deg;
  s.items = [{ id: "f", type: "expr", text }];
  const o = buildModel(s).items[0];
  return integrate((x) => toNum(o.fn(x)), a, b);
};

test("graf v stopinjah: vpisani integral pomeni isto v DEG, RAD in GRA", () => {
  for (const [f, a, b] of [
    ["sin(x)", 0, 180],
    ["cos(x/2) + x/100", -90, 270],
    ["sin(x)·cos(2x)", 10, 75],
    ["arctan(x)", 0, 3],
    ["tan(arcsin(x/2))", 0, 1],
  ]) {
    const want = graphArea(`y = ${f}`, a, b, true);
    const txt = `∫(${degreesToCalc(f)}; ${a}; ${b})`;
    for (const angle of ["deg", "rad", "grad"]) {
      const r = analyze(txt, { vars: {}, funcs: {}, ans: 0, deg: angle === "deg", grad: angle === "grad", comma: true });
      assert.ok(r && !r.error, `${txt} ${angle}: ${JSON.stringify(r?.error)}`);
      assert.ok(Math.abs(r.value - want) <= 1e-6 * Math.max(1, Math.abs(want)), `${txt} (${angle}): ${r.value} ≠ ${want}`);
    }
  }
  // primer iz pregleda: 360/π ≈ 114,59, ne 1,598
  assert.ok(Math.abs(graphArea("y = sin(x)", 0, 180, true) - 360 / Math.PI) < 1e-9);
});

test("graf v radianih: zapis ostane; nezanesljiv zapis → brez gumba", () => {
  assert.equal(degreesToCalc("x^2 + 1"), "x^2 + 1");
  assert.equal(degreesToCalc("sinh(x)"), "sinh(x)");
  assert.equal(degreesToCalc("sin x"), null);
  assert.equal(degreesToCalc("sin(x°)"), null);
  assert.equal(degreesToCalc("sin(cos(x))"), "sin((cos((x)°))°)");
});
