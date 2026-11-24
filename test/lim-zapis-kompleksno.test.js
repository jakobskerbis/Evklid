// AUDIT-051: lim_(x→a)(f) s tipkovnice klepeta (symbols.js) je v kalkulatorju dal »Ne poznam →«; √(−1) pa
// »Rezultat ni definiran (npr. deljenje z 0)«. Zdaj je zapis limita(f; x; a), √(−1) pove kompleksno vrednost.
// Pričakovano: SymPy limit, sqrt(-1), log(-1).
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze } from "../public/graph/scisolve.js";

const ENV = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };

const LIMITS = [
  ["lim_(x→0)(sin(x)/x)", "1"],
  ["lim_(x->0) sin(x)/x", "1"],
  ["lim_{x→2}(x^2-4)/(x-2)", "4"],
  ["lim_(x→1)((x^3-1)/(x-1))", "3"],
  ["lim_(n→∞)((1+1/n)^n)", "e"],
];
for (const [text, want] of LIMITS)
  test(`AUDIT-051: ${text} = ${want}`, () => {
    const r = analyze(text, { ...ENV });
    assert.equal(r.kind, "cas", JSON.stringify(r));
    assert.equal(r.op, "limit");
    assert.equal(r.resTex, want);
    assert.match(r.tex, /\\lim/);
  });

test("AUDIT-051: lim_(x→0)(1/x) ne obstaja, enako kot limita(1/x; x; 0)", () => {
  assert.equal(analyze("lim_(x→0)(1/x)", { ...ENV }).none, analyze("limita(1/x; x; 0)", { ...ENV }).none);
});

test("AUDIT-051: drugo besedilo z »lim« ostane, kot je", () => {
  assert.equal(analyze("limita(sin(x)/x; x; 0)", { ...ENV }).resTex, "1");
  assert.notEqual(analyze("lim_(x→0)()", { ...ENV })?.kind, "cas");
});

// [vhod, re, im] iz SymPy (glavna vrednost)
const NOT_REAL = [
  ["sqrt(-1)", 0, 1],
  ["√(-4)", 0, 2],
  ["ln(-1)", 0, Math.PI],
  ["(-8)^(1/4)", 1.189207115002721, 1.189207115002721],
];
for (const [text, re, im] of NOT_REAL)
  test(`AUDIT-051: ${text} ni realno število`, () => {
    const r = analyze(text, { ...ENV });
    assert.equal(r.error?.code, "notReal", JSON.stringify(r));
    assert.ok(Math.abs(r.error.info.re - re) < 1e-12 && Math.abs(r.error.info.im - im) < 1e-12);
  });

test("AUDIT-051: 1/0 in kompleksni vnos ostaneta", () => {
  assert.equal(analyze("1/0", { ...ENV }).kind, "value");
  const z = analyze("sqrt(-1)+i", { ...ENV });
  assert.equal(z.kind, "complex");
  assert.equal(z.im, 2);
});

test("AUDIT-051 (revizija): shranjena i ali j nista imaginarna enota v sporočilu notReal", () => {
  for (const v of ["i", "j"]) {
    const r = analyze(`sqrt(-1)+${v}`, { ...ENV, vars: { [v]: 2 } });
    assert.notEqual(r.error?.code, "notReal", JSON.stringify(r));
  }
});

test("AUDIT-051 (revizija): točka z oklepaji, lim_(x→(π/2)) in lim_(x→sqrt(2))", () => {
  assert.equal(analyze("lim_(x→(π/2))(cos(x)/(x-π/2))", { ...ENV }).resTex, "-1");
  assert.equal(analyze("lim_(x→sqrt(2))(x^2)", { ...ENV }).resTex, "2");
});
