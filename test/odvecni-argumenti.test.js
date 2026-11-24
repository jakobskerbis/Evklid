// AUDIT-028: odvečna vrednost v log_b(…) in v uporabniški funkciji je napaka »arity«, nikoli tiho izpuščena.
// Prej: log_2(0,5) v zapisu, kjer vejica loči vrednosti, je bil log_2(0) = −∞ (zapis \log_{2}(0)), f(2,5) pri f(x) pa f(2).
import test from "node:test";
import assert from "node:assert/strict";
import { parse, compile, MathError, arityExample } from "../public/graph/math.js";
import { evaluate } from "../public/graph/scicore.js";
import { buildModel, ZAPIS } from "../public/graph/model.js";

const lines = (texts, st = {}) => buildModel({ ...st, items: texts.map((text, i) => ({ id: `i${i}`, type: "expr", text })) }, { comma: true }).items;

test("log_b z dvema vrednostma je napaka (s pravilnim zgledom)", () => {
  assert.throws(() => parse("log_2(0.5, 3)"), (e) => e instanceof MathError && e.code === "arity" && arityExample(e.info, ";") === "log_b(x)");
  assert.equal(compile(parse("log_2(8)"))({}), 3);
  assert.equal(evaluate("log_2(0,5; 3)").error?.code, "arity");
  assert.equal(evaluate("log_2(0,5)").value, -1);
  // star zapis grafa (blok GRAF): vejica v oklepaju loči vrednosti → napaka namesto −∞
  const [o] = lines(["log_2(0,5)"]);
  assert.equal(o.kind, "error");
  assert.equal(o.error.code, "arity");
  assert.equal(lines(["log_2(0,5)"], { zapis: ZAPIS })[0].value, -1);
});

test("uporabniška funkcija: število vrednosti po definiciji", () => {
  const old = lines(["f(x) = x^2", "f(2,5)"]);
  assert.equal(old[1].kind, "error");
  assert.deepEqual(old[1].error, { code: "arity", info: { f: "f", n: 1 } });
  assert.equal(lines(["f(x) = x^2", "f(2;5)"], { zapis: ZAPIS })[1].error?.code, "arity");
  assert.equal(lines(["f(x) = x^2", "f(2,5)"], { zapis: ZAPIS })[1].value, 6.25);
  assert.equal(lines(["f(x, y) = x + y", "f(2; 5)"], { zapis: ZAPIS })[1].value, 7);
  assert.equal(lines(["f(x, y) = x + y", "f(2)"], { zapis: ZAPIS })[1].error?.code, "arity");
  // v definiciji druge funkcije: napaka v tisti vrstici
  const g = lines(["f(x) = x^2", "g(x) = f(x; 1)"], { zapis: ZAPIS });
  assert.equal(g[1].error?.code, "arity");
  assert.equal(arityExample({ f: "f", n: 2 }, ";"), "f(a; b)");
  // znanstveni kalkulator
  const funcs = { f: { param: "x", body: "x^2" } };
  assert.equal(evaluate("f(2;5)", { funcs }).error?.code, "arity");
  assert.equal(evaluate("f(2,5)", { funcs }).value, 6.25);
});
