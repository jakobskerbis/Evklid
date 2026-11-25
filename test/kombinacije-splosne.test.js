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

// Pregled #966: neceloštevilski n z velikim k je šel v zanko k-krat (nCr(−0,5; 10⁹) 11,5 s). Nad k = 1000 zdaj
// logaritem gama (Stirling z log1p). Vrednosti: mpmath binomial/ff na 30 mest (SymPy jih pri tako velikem k ne izračuna).
test("velik k pri neceloštevilskem n: hitro in kot mpmath", () => {
  const CASES = [
    ["nCr(−0,5;10^9)", 1.7841241159297556e-5],
    ["nCr(0,5;10^8)", -2.8209479283173362e-13],
    ["nCr(0,5;1001)", 8.9105949779492112e-6],
    ["nCr(2,5;5000)", -1.1978747326735088e-13],
    ["nCr(−1,5;3000)", 61.811597432226553],
    ["nCr(0,25;1500)", -2.1856840645835243e-5],
    ["nCr(7,5;10^6)", 4.467432985782343e-48],
  ];
  const t0 = performance.now();
  for (const [t, want] of CASES) {
    const v = evaluate(t, ENV).value;
    // prikaz na 11 mest: do pol enote 11. mesta (relativno ≤ 5·10⁻¹¹)
    assert.ok(Math.abs(v - want) <= 5.0001e-11 * Math.abs(want), `${t}: ${v} ≠ ${want}`);
  }
  assert.ok(performance.now() - t0 < 500, "brez zanke do k");
  // nPr: 3,59·10²⁵⁶⁵ in −9,83·10⁵⁷²³ (mpmath ff) sta zunaj double: ±∞ s pravim predznakom
  assert.equal(compile(parse("nPr(0.5, 1001)"))({}), Infinity);
  assert.equal(compile(parse("nPr(2.5, 2000)"))({}), -Infinity);
  // graf y = nCr(x; 10⁶): 1000 točk hitro
  const g = compile(parse("nCr(x, 1000000)"));
  const t1 = performance.now();
  for (let x = -5; x < 5; x += 0.01) g({ x });
  assert.ok(performance.now() - t1 < 500);
});

// Pregled #966, 2. krog: pri k ~ 10⁹ je bil k − n zaokrožen v double (napaka v 6. mestu, prikazano z »=«).
// Zdaj d = −n − 1 točno; rezultat ln Γ je približek: »≈« in 11 mest (pri 12 je bilo zadnje mesto napačno v 17/1900
// primerih, 3. krog). Vrednosti: mpmath binomial na 30 mest.
test("zelo velik k: točen d = −n − 1, prikaz z ≈", () => {
  for (const [t, want] of [
    ["nCr(−6,45;977673386)", 3.7685890136673263e46],
    ["nCr(2,25;123456789)", 2.8928444458194487e-27],
    ["nCr(−3,7;5·10^8)", 7.3623266941007667e22],
  ]) {
    const r = evaluate(t, ENV);
    assert.ok(Math.abs(r.value - want) <= 5.0001e-11 * Math.abs(want), `${t}: ${r.value} ≠ ${want}`);
    assert.ok(r.est && r.approx, `${t}: približek`);
    assert.equal(r.digits, 11, t);
    assert.equal(r.value, Number(want.toPrecision(11)), t);
  }
  // točni ostanejo brez ≈
  assert.ok(!evaluate("nCr(5,5;2)", ENV).est);
  assert.ok(!evaluate("nCr(200;2)", ENV).est);
});
