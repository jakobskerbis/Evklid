// AUDIT-042: preverjanje v klepetu (live-check.js) in sodba koraka (sodba-koraka.js) bereta števila po istem
// pravilu kot kalkulatorja (calcText). Prej: »1.234,5« = 1,234 · 0,5 = 0,617, »2e3« = 2·e·3.
import test from "node:test";
import assert from "node:assert/strict";
import { num } from "../server/live-check.js";
import { value } from "../server/sodba-koraka.js";

test("isto branje števil kot kalkulatorja", () => {
  const cases = [
    ["1.234,5", 1234.5],
    ["2e3", 2000],
    ["1,5e-3", 0.0015],
    ["1 000", 1000],
    ["2,5", 2.5],
    ["−3", -3],
    ["\\sqrt{2}", Math.SQRT2],
    ["\\frac{1}{2}", 0.5],
    ["3,2·10^{4}", 32000],
    ["x/1e8".replace("x", "2"), 2e-8],
  ];
  for (const [t, v] of cases) {
    assert.ok(Math.abs(num(t) - v) < 1e-12, `live-check ${t}: ${num(t)}`);
    assert.ok(Math.abs(value(t) - v) < 1e-12, `sodba ${t}: ${value(t)}`);
  }
  // nejasno: brez sodbe kode
  for (const t of ["1,2,3", "12 34", "1, 2"]) {
    assert.equal(num(t), null, `live-check ${t}`);
    assert.equal(value(t), null, `sodba ${t}`);
  }
  assert.equal(value("1.000"), null); // tisočice ali decimalke: sodba koraka ne sodi
});

test("mešana števila (»1 1/2«, »1\\frac{1}{2}«) so nejasna: sodba koraka ne sodi (pregled #976)", async () => {
  const { stepVerdict } = await import("../server/sodba-koraka.js");
  for (const m of ["1 1/2 + 1 = 2 1/2", "2 1/2 · 2 = 5", "1 1/2 = 1,5", "2 2/3 · 3 = 8", "3/2 = 1 1/2", "5 - 1 1/2 = 3 1/2", "$1\\frac{1}{2} + 1 = 2\\frac{1}{2}$", "$2\\frac{1}{2} \\cdot 2 = 5$"]) {
    assert.equal(stepVerdict(m, {}), null, m);
  }
  assert.equal(value("1 1/2"), null);
  assert.equal(num("1 1/2"), null);
  // dve vrednosti niso eno število
  assert.equal(num("1;2"), null);
  // večmestni imenovalec z znanstvenim zapisom
  for (const [t, v] of [["2/12e3", 2 / 12000], ["1/25e-3", 40]]) {
    assert.ok(Math.abs(num(t) - v) < 1e-12, `${t}: ${num(t)}`);
    assert.ok(Math.abs(value(t) - v) < 1e-12, `${t}: ${value(t)}`);
  }
});
