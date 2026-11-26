// Imena funkcij iz branja (log(a, b), factorial, binomial, C(n,k), V(n,k)): lokalno preverjanje jih razume, SymPy dobi
// svoj zapis, neznana funkcija pa ne da »Napačno« (meritev brez SymPy 26. 11.: 40/468 lažnih alarmov, 0! = 0 potrjeno).
import test from "node:test";
import assert from "node:assert/strict";
import { prep } from "../public/scan/solvecore.js";
import { verifyAi } from "../public/scan/verify.js";
import { casText } from "../server/scan.js";

test("prep: imena funkcij v zapis kalkulatorja", () => {
  assert.equal(prep("log(x-3, 2)=4"), "logb(x-3, 2)=4");
  assert.equal(prep("log(log(81,3), 2)"), "logb(logb(81, 3), 2)");
  assert.equal(prep("factorial(14)/factorial(4)"), "(14)!/(4)!");
  assert.equal(prep("binomial(10,3)+C(10,3)+V(5,2)"), "nCr(10, 3)+nCr(10, 3)+nPr(5, 2)");
  assert.equal(prep("C(1, x)"), "C(1, x)"); // ni kombinatorika (točka, funkcija)
  assert.equal(prep("log(100)"), "log(100)");
});

test("casText: SymPy dobi binomial, factorial in log z osnovo", () => {
  assert.equal(casText(prep("nCr(10,3)+V(5,2)")), "binomial(10, 3)+(factorial(5)/factorial((5)-(2)))");
  assert.equal(casText(prep("log(x-3, 2)=4")), "log(x-3, 2)=4");
  assert.equal(casText(prep("factorial(14)/factorial(4)")), "(14)!/(4)!");
});

test("verifyAi: pravilno ni »Napačno«, napačno ni potrjeno", () => {
  const st = (t, sol) => verifyAi(t, sol).status;
  assert.notEqual(st("log(15625, 5)", { kind: "arith", value: "6" }), "wrong");
  assert.equal(st("log(15625, 5)", { kind: "arith", value: "5" }), "wrong");
  assert.notEqual(st("factorial(14)/factorial(4)", { kind: "arith", value: "3632428800" }), "wrong");
  assert.equal(st("factorial(0)", { kind: "arith", value: "1" }) === "wrong", false);
  assert.ok(!["verified", "partial", "numeric"].includes(st("factorial(0)", { kind: "arith", value: "0" })), "0! = 0 ni potrjeno");
  assert.notEqual(st("log(x-3, 2)=4", { kind: "equation", variable: "x", solutions: ["19"] }), "wrong");
  assert.equal(st("log(x-3, 2)=4", { kind: "equation", variable: "x", solutions: ["20"] }), "wrong");
  assert.notEqual(st("C(10,3)", { kind: "arith", value: "120" }), "wrong");
  // neznana funkcija: brez sodbe
  assert.equal(st("gamma(5)", { kind: "arith", value: "24" }), "unverified");
  assert.equal(st("gamma(5)", { kind: "arith", value: "99" }), "unverified");
});
