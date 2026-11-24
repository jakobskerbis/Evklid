// AUDIT-017 in AUDIT-018: odvod v točki d/dx(f; a) v znanstvenem kalkulatorju.
// Zunaj definicijskega območja ni odvoda (prej ln x pri −1 → −1), v vogalu in skoku tudi ne (prej |x| pri 0 → 0).
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze } from "../public/graph/scisolve.js";

const at = (s) => analyze(s, { comma: true });
const val = (s) => {
  const r = at(s);
  assert.equal(r.kind, "value", `${s}: ${JSON.stringify(r)}`);
  return r.value;
};
const err = (s) => at(s).error?.code;

test("odvod v točki zunaj definicijskega območja ne obstaja (AUDIT-017)", () => {
  for (const s of ["d/dx(ln(x);-1)", "d/dx(ln(x);0)", "d/dx(log(x);-3)", "d/dx(ln(x^2-1);0,5)", "d/dx(1/x;0)"]) assert.equal(err(s), "noDerivDomain", s);
});

test("vogal in skok: levi in desni odvod se ne ujemata (AUDIT-018)", () => {
  assert.deepEqual(at("d/dx(|x|;0)").error, { code: "noDeriv", info: { left: -1, right: 1 } });
  assert.deepEqual(at("d/dx(|x^2-4|;2)").error, { code: "noDeriv", info: { left: -4, right: 4 } });
  assert.equal(err("d/dx(|sin(x)|;π)"), "noDeriv");
  assert.equal(err("d/dx(floor(x);1)"), "noDeriv");
  for (let a = -40; a <= 40; a += 7.3) {
    const A = String(+a.toFixed(1)).replace(".", ",");
    assert.equal(err(`d/dx(3·|x-(${A})|+x^2;${A})`), "noDeriv", A);
  }
});

test("odvedljive funkcije ostanejo enake, tudi daleč od 0 in blizu vogala", () => {
  assert.equal(val("d/dx(x^3;2)"), 12);
  assert.equal(val("d/dx(x·|x|;0)"), 0);
  assert.equal(val("d/dx(|x|^3;0)"), 0);
  assert.equal(val("d/dx(|x|;0,1)"), 1);
  assert.equal(val("d/dx(x^2;10^8)"), 2e8);
  assert.ok(Math.abs(val("d/dx(sin(x);10^6)") - Math.cos(1e6)) < 1e-9);
  assert.ok(Math.abs(val("d/dx(e^x;100)") / Math.exp(100) - 1) < 1e-12);
  assert.ok(Math.abs(val("d/dx(tan(x);1,5)") - 1 / Math.cos(1.5) ** 2) < 1e-9);
  assert.equal(val("d/dx(√x;4)"), 0.25);
});
