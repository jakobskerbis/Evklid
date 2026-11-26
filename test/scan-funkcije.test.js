// Imena funkcij iz branja (log(a, b), factorial, binomial, C(n,k), V(n,k)): lokalno preverjanje jih razume, SymPy dobi
// svoj zapis, neznana funkcija pa ne da »Napačno« (meritev brez SymPy 26. 11.: 40/468 lažnih alarmov, 0! = 0 potrjeno).
import test from "node:test";
import assert from "node:assert/strict";
import { prep, kombinatorika } from "../public/scan/solvecore.js";
import { verifyAi } from "../public/scan/verify.js";
import { casText } from "../server/scan.js";

test("prep: imena funkcij v zapis kalkulatorja", () => {
  assert.equal(prep("log(x-3, 2)=4"), "logb(x-3, 2)=4");
  assert.equal(prep("log(log(81,3), 2)"), "logb(logb(81, 3), 2)");
  assert.equal(prep("factorial(14)/factorial(4)"), "(14)!/(4)!");
  assert.equal(prep("binomial(10,3)"), "nCr(10, 3)");
  // C(n, k) in V(n, k) le pri preverjanju: v besedilu je »V(2, 3)« lahko teme parabole (gre tudi AI)
  assert.equal(prep("Teme V(2,3) in točka C(4,5)"), "Teme V(2,3) in točka C(4,5)");
  assert.equal(kombinatorika("C(10,3)+V(5,2)+C(1, x)"), "nCr(10, 3)+nPr(5, 2)+C(1, x)");
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
  // kombinatorika s spremenljivko: kalkulator jo izračuna tudi za n = −4 (gama), zato brez sodbe
  assert.equal(st("binomial(n,2)=10", { kind: "equation", variable: "n", solutions: ["5", "-4"] }), "unverified");
  assert.equal(st("C(n,2)=10", { kind: "equation", variable: "n", solutions: ["5"] }), "unverified");
  // istovetnost izrazov s spremenljivko velja (gama): primerjava v točkah
  assert.notEqual(st("factorial(n)/factorial(n-2)", { kind: "expression", value: "n*(n-1)" }), "wrong");
  assert.equal(st("factorial(n)/factorial(n-2)", { kind: "expression", value: "n*(n-1)*(n-2)" }), "wrong");
  assert.equal(st("log(8, 2, 3)", { kind: "arith", value: "3" }), "unverified");
  // decimalna vejica v klicu funkcije (AUDIT-096): »arcsin(0,5)« = 30° ni »Napačno«; »log(0,5)« je lahko log 0,5
  // ali log z osnovo 5, zato brez sodbe; s presledkom (»log(15625, 5)«) in pri kombinatoriki sta to dva argumenta
  assert.equal(st("arcsin(0,5)", { kind: "arith", value: "30°" }), "unverified");
  assert.equal(st("sqrt(2,25)", { kind: "arith", value: "1,5" }), "unverified");
  assert.equal(st("log(0,5)", { kind: "arith", value: "-0,30103" }), "unverified");
  assert.equal(st("C(5,2)", { kind: "arith", value: "11" }), "wrong");
  assert.equal(st("2,5+1", { kind: "arith", value: "3,5" }), "verified");
  // veljaven zapis ni »neznana funkcija«: d/dx(…), produkt črk pred oklepajem
  assert.equal(st("d/dx(x^2)", { kind: "derivative", value: "3x" }), "wrong");
  assert.equal(st("a^2b+ab^2", { kind: "expression", value: "ab(a+2b)" }), "wrong");
  assert.notEqual(st("a^2b+ab^2", { kind: "expression", value: "ab(a+b)" }), "unverified");
  // neznana funkcija: brez sodbe
  assert.equal(st("gamma(5)", { kind: "arith", value: "24" }), "unverified");
  assert.equal(st("gamma(5)", { kind: "arith", value: "99" }), "unverified");
});
