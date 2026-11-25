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

test("pregled #953: blizu pola, navpična tangenta, gnezden odvod, f′(a), velik a", () => {
  assert.equal(val("d/dx(ln(x);10^-6)"), 1e6);
  assert.ok(Math.abs(val("d/dx(1/x;10^-6)") + 1e12) < 1);
  assert.equal(val("d/dx(|x|;10^-9)"), 1);
  assert.ok(Math.abs(val("d/dx(√(1-x^2);0,99999)") + 223.6051) < 1e-3);
  assert.ok(Math.abs(val("d/dx(sin(x);10^9)") - Math.cos(1e9)) < 1e-6);
  assert.equal(val("d/dx(d/dx(x^3;x);2)"), 12);
  assert.equal(val("2·d/dx(x^2;1)+1"), 5);
  // navpična tangenta in skok: ne obstaja, brez številk
  for (const s of ["d/dx(x^(2/3);0)", "d/dx(√|x|;0)", "d/dx(∛x;0)", "d/dx(sign(x);0)"]) assert.deepEqual(at(s).error, { code: "noDeriv", info: {} }, s);
  const f = (body, s) => analyze(s, { comma: true, funcs: { f: { param: "x", body } } });
  assert.equal(f("ln(x)", "f'(-1)").error?.code, "noDerivDomain");
  assert.deepEqual(f("|x-2|", "f'(2)").error, { code: "noDeriv", info: { left: -1, right: 1 } });
  assert.equal(f("x^3", "f'(2)").value, 12);
});
