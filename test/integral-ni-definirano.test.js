// AUDIT-046: integrand na delu intervala ni definiran (√ ali ln negativnega, 1/(x·ln x) za x < 0) je dal »—« (NaN).
// Zdaj: »Integral ne obstaja: funkcija na delu intervala ni definirana« (33 jezikov). NaN le zaradi preliva
// (sinh x / cosh x pri |x| ~ 10⁴: ∞/∞, e^x/(e^x − 2)) ni nedefiniranost: »ni mogoče zanesljivo izračunati«.
// Posamezne točke (sin x / x pri 0, (x² − 1)/(x − 1) pri 1, x·ln x pri 0) se integrirajo kot prej.
// Seznam: 104 primerov iz pregleda #977 (vsi so prej dali NaN).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { analyze, integralOf, integralErrorKey } from "../public/graph/scisolve.js";
import sl from "../public/i18n/sl.js";

const ENV = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };
const PREJ_NAN = [
  "∫(sqrt(x−5)+sin(x);0;1e4)",
  "∫(sqrt(x−5)+sin(x);−1e4;1e4)",
  "∫(sqrt(x−5)+sin(x);−3;1e3)",
  "∫(sqrt(x−5)+sin(x);0.5;5000)",
  "∫(sqrt(x−5)+cos(300x);0;1e4)",
  "∫(sqrt(x−5)+cos(300x);−1e4;1e4)",
  "∫(sqrt(x−5)+cos(300x);−3;1e3)",
  "∫(sqrt(x−5)+cos(300x);0.5;5000)",
  "∫(sqrt(x−5)+sin(x)^2;0;1e4)",
  "∫(sqrt(x−5)+sin(x)^2;−1e4;1e4)",
  "∫(sqrt(x−5)+sin(x)^2;−3;1e3)",
  "∫(sqrt(x−5)+sin(x)^2;0.5;5000)",
  "∫(sqrt(x−5);0;1e4)",
  "∫(sqrt(x−5);−1e4;1e4)",
  "∫(sqrt(x−5);−3;1e3)",
  "∫(sqrt(x−5);0.5;5000)",
  "∫(sqrt(5−x)+sin(x);0;1e4)",
  "∫(sqrt(5−x)+sin(x);−1e4;1e4)",
  "∫(sqrt(5−x)+sin(x);−3;1e3)",
  "∫(sqrt(5−x)+sin(x);0.5;5000)",
  "∫(sqrt(5−x)+cos(300x);0;1e4)",
  "∫(sqrt(5−x)+cos(300x);−1e4;1e4)",
  "∫(sqrt(5−x)+cos(300x);−3;1e3)",
  "∫(sqrt(5−x)+cos(300x);0.5;5000)",
  "∫(sqrt(5−x)+sin(x)^2;0;1e4)",
  "∫(sqrt(5−x)+sin(x)^2;−1e4;1e4)",
  "∫(sqrt(5−x)+sin(x)^2;−3;1e3)",
  "∫(sqrt(5−x)+sin(x)^2;0.5;5000)",
  "∫(sqrt(5−x);0;1e4)",
  "∫(sqrt(5−x);−1e4;1e4)",
  "∫(sqrt(5−x);−3;1e3)",
  "∫(sqrt(5−x);0.5;5000)",
  "∫(sqrt(sin(x))+sin(x);0;1e4)",
  "∫(sqrt(sin(x))+sin(x);−1e4;1e4)",
  "∫(sqrt(sin(x))+sin(x);−3;1e3)",
  "∫(sqrt(sin(x))+sin(x);0.5;5000)",
  "∫(sqrt(sin(x))+cos(300x);0;1e4)",
  "∫(sqrt(sin(x))+cos(300x);−1e4;1e4)",
  "∫(sqrt(sin(x))+cos(300x);−3;1e3)",
  "∫(sqrt(sin(x))+cos(300x);0.5;5000)",
  "∫(sqrt(sin(x))+sin(x)^2;0;1e4)",
  "∫(sqrt(sin(x))+sin(x)^2;−1e4;1e4)",
  "∫(sqrt(sin(x))+sin(x)^2;−3;1e3)",
  "∫(sqrt(sin(x))+sin(x)^2;0.5;5000)",
  "∫(sqrt(sin(x));0;1e4)",
  "∫(sqrt(sin(x));−1e4;1e4)",
  "∫(sqrt(sin(x));−3;1e3)",
  "∫(sqrt(sin(x));0.5;5000)",
  "∫(e^x/(e^x−2)+sin(x);0;1e4)",
  "∫(e^x/(e^x−2)+sin(x);−1e4;1e4)",
  "∫(e^x/(e^x−2)+sin(x);−3;1e3)",
  "∫(e^x/(e^x−2)+sin(x);0.5;5000)",
  "∫(e^x/(e^x−2)+cos(300x);0;1e4)",
  "∫(e^x/(e^x−2)+cos(300x);−1e4;1e4)",
  "∫(e^x/(e^x−2)+cos(300x);−3;1e3)",
  "∫(e^x/(e^x−2)+cos(300x);0.5;5000)",
  "∫(e^x/(e^x−2)+sin(x)^2;0;1e4)",
  "∫(e^x/(e^x−2)+sin(x)^2;−1e4;1e4)",
  "∫(e^x/(e^x−2)+sin(x)^2;−3;1e3)",
  "∫(e^x/(e^x−2)+sin(x)^2;0.5;5000)",
  "∫(e^x/(e^x−2);0;1e4)",
  "∫(e^x/(e^x−2);−1e4;1e4)",
  "∫(e^x/(e^x−2);−3;1e3)",
  "∫(e^x/(e^x−2);0.5;5000)",
  "∫(ln(x−3)+sin(x);0;1e4)",
  "∫(ln(x−3)+sin(x);−1e4;1e4)",
  "∫(ln(x−3)+sin(x);−3;1e3)",
  "∫(ln(x−3)+sin(x);0.5;5000)",
  "∫(ln(x−3)+cos(300x);0;1e4)",
  "∫(ln(x−3)+cos(300x);−1e4;1e4)",
  "∫(ln(x−3)+cos(300x);−3;1e3)",
  "∫(ln(x−3)+cos(300x);0.5;5000)",
  "∫(ln(x−3)+sin(x)^2;0;1e4)",
  "∫(ln(x−3)+sin(x)^2;−1e4;1e4)",
  "∫(ln(x−3)+sin(x)^2;−3;1e3)",
  "∫(ln(x−3)+sin(x)^2;0.5;5000)",
  "∫(ln(x−3);0;1e4)",
  "∫(ln(x−3);−1e4;1e4)",
  "∫(ln(x−3);−3;1e3)",
  "∫(ln(x−3);0.5;5000)",
  "∫(1/(x·ln(x))+sin(x);−1e4;1e4)",
  "∫(1/(x·ln(x))+sin(x);−3;1e3)",
  "∫(1/(x·ln(x))+cos(300x);−1e4;1e4)",
  "∫(1/(x·ln(x))+cos(300x);−3;1e3)",
  "∫(1/(x·ln(x))+sin(x)^2;−1e4;1e4)",
  "∫(1/(x·ln(x))+sin(x)^2;−3;1e3)",
  "∫(1/(x·ln(x));−1e4;1e4)",
  "∫(1/(x·ln(x));−3;1e3)",
  "∫(sinh(x)/cosh(x)+sin(x);0;1e4)",
  "∫(sinh(x)/cosh(x)+sin(x);−1e4;1e4)",
  "∫(sinh(x)/cosh(x)+sin(x);−3;1e3)",
  "∫(sinh(x)/cosh(x)+sin(x);0.5;5000)",
  "∫(sinh(x)/cosh(x)+cos(300x);0;1e4)",
  "∫(sinh(x)/cosh(x)+cos(300x);−1e4;1e4)",
  "∫(sinh(x)/cosh(x)+cos(300x);−3;1e3)",
  "∫(sinh(x)/cosh(x)+cos(300x);0.5;5000)",
  "∫(sinh(x)/cosh(x)+sin(x)^2;0;1e4)",
  "∫(sinh(x)/cosh(x)+sin(x)^2;−1e4;1e4)",
  "∫(sinh(x)/cosh(x)+sin(x)^2;−3;1e3)",
  "∫(sinh(x)/cosh(x)+sin(x)^2;0.5;5000)",
  "∫(sinh(x)/cosh(x);0;1e4)",
  "∫(sinh(x)/cosh(x);−1e4;1e4)",
  "∫(sinh(x)/cosh(x);−3;1e3)",
  "∫(sinh(x)/cosh(x);0.5;5000)"
];
const PRELIV = /sinh\(x\)\/cosh\(x\)|e\^x\/\(e\^x−2\)/;

test("104 primerov iz pregleda: nikoli »—«; nedefiniranost pove, preliv je »ni mogoče zanesljivo«", () => {
  assert.equal(PREJ_NAN.length, 104);
  for (const t of PREJ_NAN) {
    const r = analyze(t, ENV);
    assert.ok(r.error, `${t}: ${JSON.stringify(r)}`);
    if (PRELIV.test(t)) assert.ok(["intUnknown", "intDiverge"].includes(r.error.code), `${t}: ${r.error.code}`);
    else assert.equal(r.error.code, "intUndefined", t);
  }
});

test("nedefiniranost tudi v sestavljenem izrazu, z ∞ in pri arcsin; posamezne točke se integrirajo", () => {
  for (const t of ["2·∫(sqrt(x−5);0;10)", "∫(√(x);−1;1)", "∫(arcsin(x);0;2)", "∫(sqrt(x^2−1);−2;2)", "∫(sqrt(−x);0;∞)", "∫(ln(x);−1;1)"])
    assert.equal(analyze(t, ENV).error?.code, "intUndefined", t);
  for (const [t, want] of [
    ["∫((x^2−1)/(x−1);0;2)", 4],
    ["∫(x·ln(x);0;1)", -0.25],
    ["∫(sin(x)/x;0;1)", 0.946083070367183],
    ["∫(sqrt(x);0;4)", 16 / 3],
    ["∫(sqrt(1−x^2);−1;1)", Math.PI / 2],
  ]) {
    const r = analyze(t, ENV);
    assert.ok(r.kind === "value" && Math.abs(r.value - want) < 1e-9, `${t}: ${JSON.stringify(r)}`);
  }
});

test("sporočilo je v vseh 33 jezikih", () => {
  assert.match(sl["sc.errIntUndefined"], /ni definirana/);
  const dir = new URL("../public/i18n/ui/", import.meta.url);
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const j = JSON.parse(fs.readFileSync(new URL(f, dir), "utf8"));
    assert.ok(j["sc.errIntUndefined"] && j["sc.errIntUndefined"] !== sl["sc.errIntUndefined"], f);
  }
  assert.deepEqual(integralErrorKey({ code: "intUndefined" }), ["sc.errIntUndefined", {}]);
  assert.match(fs.readFileSync(new URL("../public/graph/sci.js", import.meta.url), "utf8"), /case "intUndefined":[\s\S]{0,120}integralErrorKey\(e\)/);
});

test("šum zaokrožitve ob meji območja ni »ni definirana« (sin²x + cos²x − 1 ≡ 0)", () => {
  for (const t of [
    "∫(sqrt(sin(x)^2+cos(x)^2−1);0;10)",
    "∫(sqrt(1−sin(x)^2−cos(x)^2);0;10)",
    "∫(sqrt((x+1)^2−x^2−2x−1);0;1000)",
    "∫((sin(x)^2+cos(x)^2−1)^0,5;0;10)",
    "∫(sqrt(cos(x)^2−1+sin(x)^2);−5;5)",
  ]) {
    const r = analyze(t, ENV);
    assert.ok(r.kind === "value" && Math.abs(r.value) < 1e-6, `${t}: ${JSON.stringify(r)}`);
  }
  const r = analyze("∫(x·sqrt(sin(x)^2+cos(x)^2−1)+1;0;2)", ENV);
  assert.ok(r.kind === "value" && Math.abs(r.value - 2) < 1e-9, JSON.stringify(r));
  // arcsin(sin² + cos²) = arcsin(1) = π/2 tudi, ko je argument zaradi zaokrožitve 1 + 2·10⁻¹⁶
  const s2 = analyze("∫(arcsin(sin(x)^2+cos(x)^2);0;1)", ENV);
  assert.ok(s2.kind === "value" && Math.abs(s2.value - Math.PI / 2) < 1e-6, JSON.stringify(s2));
  // res negativno ostane »ni definirana«
  for (const t of ["∫(sqrt(−1e−20);0;1)", "∫(sqrt(x−5);0;10)", "∫(sqrt(sin(x)^2+cos(x)^2−1,001);0;10)"]) assert.equal(analyze(t, ENV).error?.code, "intUndefined", t);
  // drobna prava vrednost ni šum
  assert.ok(Math.abs(analyze("∫(sqrt(x^2−1e−30);0;1)", ENV).value - 0.5) < 1e-9);
});

test("orodje Analiza da isti izid in isto sporočilo kot kalkulator", () => {
  const CASES = [
    ["sqrt(sin(x))", 0, 10],
    ["sqrt(x-5)", 0, 1e4],
    ["ln(x-3)", 0, 10],
    ["sinh(x)/cosh(x)", -1e4, 1e4],
    ["1/x", -1, 1],
    ["1/x", 0, 1],
    ["sin(1/x)/x", 0, 1],
    ["1/sqrt(x)", 0, 1],
    ["x^3 - 3x", -3, 3],
    ["sqrt(sin(x)^2+cos(x)^2-1)", 0, 10],
    ["sin(x)", 0, 1e4],
  ];
  for (const [f, a, b] of CASES) {
    const tool = integralOf(f, a, b);
    const calc = analyze(`∫(${f};${a};${b})`, { ...ENV, comma: false });
    assert.deepEqual(tool.error ? integralErrorKey(tool.error) : [tool.value, !!tool.est], calc.error ? integralErrorKey(calc.error) : [calc.value, !!calc.est], f);
  }
  assert.equal(integralOf("sqrt(sin(x))", 0, 10).error.code, "intUndefined");
  const src = fs.readFileSync(new URL("../public/graph/tools-ana.js", import.meta.url), "utf8");
  const part = src.slice(src.indexOf('part === "int"'), src.indexOf('part === "lim"'));
  assert.match(part, /integralOf\(st\.f, a, b/);
  assert.match(part, /integralErrorKey/);
});
