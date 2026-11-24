// AUDIT-020: nCr in nPr z negativnim ali neceloštevilskim n: nCr(−5; 2) je bil 0 (SymPy 15), nCr(5,5; 2) 12
// (SymPy 12,375). Zdaj splošni binomski koeficient in padajoča potenca kot SymPy binomial / ff za celo število
// k ≥ 0; drugačen k je napaka »ncrK« z jasnim sporočilom.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { evaluate } from "../public/graph/scicore.js";
import { parse, compile } from "../public/graph/math.js";
import sl from "../public/i18n/sl.js";

const ENV = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };
const frac = (s) => (s.includes("/") ? Number(s.split("/")[0]) / Number(s.split("/")[1]) : Number(s));

// [vnos, SymPy binomial/ff kot točen ulomek]
const CASES = [
  ["nCr(−5;2)", "15"],
  ["nCr(5,5;2)", "99/8"],
  ["nCr(−1;5)", "-1"],
  ["nCr(0,5;3)", "1/16"],
  ["nCr(−7;3)", "-84"],
  ["nCr(−1,5;4)", "315/128"],
  ["nCr(−10;10)", "92378"],
  ["nCr(2,5;0)", "1"],
  ["nCr(5;7)", "0"],
  ["nCr(−3;0)", "1"],
  ["nCr(0,25;2)", "-3/32"],
  ["nCr(−200;2)", "20100"],
  ["nPr(−5;2)", "30"],
  ["nPr(5,5;2)", "99/4"],
  ["nPr(−3;4)", "360"],
  ["nPr(0,5;5)", "105/32"],
  ["nPr(2,5;3)", "15/8"],
  ["nPr(−1;3)", "-6"],
  ["nPr(5;7)", "0"],
  // ostane kot prej (AUDIT-010)
  ["nCr(200;2)", "19900"],
  ["nCr(5;2)", "10"],
];

test("nCr in nPr z negativnim ali neceloštevilskim n kot SymPy", () => {
  for (const [t, want] of CASES) {
    const r = evaluate(t, ENV);
    assert.ok(!r.error, `${t}: ${JSON.stringify(r.error)}`);
    assert.ok(Math.abs(r.value - frac(want)) <= 1e-12 * Math.max(1, Math.abs(frac(want))), `${t}: ${r.value} ≠ ${want}`);
  }
});

test("k, ki ni celo število ≥ 0: jasna napaka, ne 0 ali izmišljeno število", () => {
  for (const [t, f] of [["nCr(5;2,5)", "nCr"], ["nCr(5;−1)", "nCr"], ["nPr(5;0,5)", "nPr"], ["nPr(7;−2)", "nPr"]]) assert.deepEqual(evaluate(t, ENV).error, { code: "ncrK", info: { f } }, t);
  // v grafu (k je spremenljivka) ni napake, le NaN, da risanje ne pade
  const g = compile(parse("nCr(5, x)"));
  assert.ok(Number.isNaN(g({ x: 2.5 })));
  assert.equal(g({ x: 2 }), 10);
  assert.equal(compile(parse("nCr(x, 2)"))({ x: 5.5 }), 12.375);
});

test("sporočilo sc.errNcrK v vseh jezikih", () => {
  assert.match(sl["sc.errNcrK"], /\{f\}/);
  const dir = new URL("../public/i18n/ui/", import.meta.url);
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const j = JSON.parse(fs.readFileSync(new URL(f, dir), "utf8"));
    assert.ok(j["sc.errNcrK"]?.includes("{f}"), f);
  }
});
