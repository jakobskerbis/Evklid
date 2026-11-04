// Preglednica, Poskusi (kocka, kovanec, številska premica, Preveri) in zaporedja v grafičnem kalkulatorju.
import test from "node:test";
import assert from "node:assert/strict";
import { evalSheet, columnStats, fill, shiftRefs, parseCell } from "../public/graph/sheetcore.js";
import { diceDist, coinDist, roll, verify, solutionSet, intersect } from "../public/graph/trialscore.js";
import { buildModel } from "../public/graph/model.js";
import { normalize, parse, compile } from "../public/graph/math.js";

const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps, `${a} ≉ ${b}`);

test("preglednica: števila, besedilo, formule, obsegi in funkcije kot na Casiu", () => {
  const r = evalSheet(
    { A1: "3", A2: "4,5", A3: "-2", A4: "=sum(A1:A3)", B1: "=A1*2", B2: "=B1+$A$1", D1: "višina", E1: "=mean(A1:A3)", E2: "=max(A1:A3; 10)", E3: "=Sum(A1;A2)*2,5", E4: "=AVERAGE(A1:A2)", E5: "=2e3", E6: "=A9+1", E7: "=count(A1:A9)" },
    { comma: true },
  );
  assert.equal(r.A2.v, 4.5);
  assert.equal(r.A4.v, 5.5);
  assert.equal(r.B2.v, 9);
  assert.equal(r.D1.text, "višina");
  near(r.E1.v, 5.5 / 3);
  assert.equal(r.E2.v, 10);
  assert.equal(r.E3.v, 18.75);
  assert.equal(r.E4.v, 3.75);
  assert.equal(r.E5.v, 2000); // 2e3 ni sklic na E3
  assert.equal(r.E6.v, 1); // prazna celica šteje 0
  assert.equal(r.E7.v, 4); // prazne celice v obsegu se ne štejejo
});

test("preglednica: napake (krožni sklic, besedilo, deljenje z 0, obseg brez funkcije)", () => {
  const r = evalSheet({ C1: "=C2", C2: "=C1", D1: "abc", D2: "=D1+1", E1: "=1/0", E2: "=A1:A2", E3: "=foo(2)", E4: "=mean(B1:B3)" });
  assert.equal(r.C1.err, "cycle");
  assert.equal(r.D2.err, "ref");
  assert.equal(r.E1.err, "undef");
  assert.equal(r.E2.err, "syntax");
  assert.equal(r.E3.err, "syntax");
  assert.equal(r.E4.err, "undef");
});

test("preglednica: polnjenje premakne relativne sklice, $ ostane; statistika po stolpcih", () => {
  assert.equal(shiftRefs("=A1*2+$A$1+A$2+$B3", 2, 1), "=B3*2+$A$1+B$2+$B5");
  assert.equal(shiftRefs("=A45+1", 1), "=#REF+1");
  assert.equal(shiftRefs("12", 3), "12");
  const cells = fill({ A1: "1", A2: "=A1+1" }, "A2", "A10");
  assert.equal(cells.A10, "=A9+1");
  const cs = columnStats(evalSheet(cells));
  assert.deepEqual(cs[0], { n: 10, sum: 55, mean: 5.5, min: 1, max: 10 });
  assert.equal(cs[1], null);
  assert.equal(parseCell("E45").r, 44);
  assert.equal(parseCell("F1"), null);
  assert.equal(parseCell("A46"), null);
});

test("poskusi: verjetnosti kock in kovancev, meti", () => {
  const d2 = diceDist(2);
  assert.equal(d2.length, 11);
  near(d2.find((o) => o.x === 7).p, 6 / 36);
  near(diceDist(3).reduce((s, o) => s + o.p, 0), 1);
  assert.deepEqual(coinDist(3).map((o) => o.p), [0.125, 0.375, 0.375, 0.125]);
  let i = 0;
  const seq = [0, 0.99, 0.5, 0.2];
  const r = roll("dice", 2, 2, () => seq[i++ % seq.length]);
  assert.deepEqual(r.counts, { 7: 1, 6: 1 });
  assert.deepEqual(r.last, [4, 2]);
  const c = roll("coin", 1, 1000);
  assert.equal((c.counts[0] || 0) + (c.counts[1] || 0), 1000);
});

test("poskusi: Preveri (drži / ne drži) in številska premica", () => {
  assert.equal(verify("√8 = 2√2").value, true);
  assert.equal(verify("π > 3,14").value, true);
  assert.equal(verify("1/3 = 0,333").value, false);
  assert.equal(verify("0,1 + 0,2 = 0,3").value, true);
  assert.equal(verify("2 ≠ 2").value, false);
  assert.equal(verify("2³ ≠ 3²").value, true);
  assert.equal(verify("x > 2").error, "unknowns");
  assert.equal(verify("2 + 3").error, "notCmp");
  assert.equal(verify(""), null);
  const a = solutionSet("x > -2").intervals;
  const b = solutionSet("x ≤ 3").intervals;
  const c = solutionSet("x^2 > 1").intervals;
  assert.deepEqual(intersect(intersect(a, b), c), [
    { lo: -2, hi: -1, loIn: false, hiIn: false },
    { lo: 1, hi: 3, loIn: false, hiIn: true },
  ]);
  assert.deepEqual(solutionSet("2x + 1 = 5").intervals, [{ lo: 2, hi: 2, loIn: true, hiIn: true }]);
  assert.ok(solutionSet("sin(x) > 0").period);
  assert.equal(solutionSet("x + y > 1").error, "line");
  // ≠ in toleranca pri primerjavi
  assert.equal(normalize("1 ≠ 2"), "1 != 2");
  assert.equal(compile(parse("0.1 + 0.2 != 0.3"))({}), false);
});

test("grafični kalkulator: zaporedja (rekurzivna, eksplicitna, Fibonacci, tabela vrednosti)", () => {
  const st = {
    items: [
      { id: "a", type: "expr", text: "u(n) = u(n - 1) + d" },
      { id: "b", type: "expr", text: "u(1) = 2" },
      { id: "c", type: "expr", text: "d = 3" },
      { id: "e", type: "expr", text: "s = u(10)" },
      { id: "f", type: "expr", text: "a(n) = 1/n" },
      { id: "g", type: "expr", text: "F(n) = F(n-1) + F(n-2)" },
      { id: "h", type: "expr", text: "F(1) = 1" },
      { id: "i", type: "expr", text: "F(2) = 1" },
      { id: "j", type: "expr", text: "v(n) = 2v(n-1)" },
      { id: "k", type: "table", ref: "a", cols: [{ name: "n", values: [1, 2, 3, 1.5] }, { name: "u", values: [] }] },
      { id: "l", type: "expr", text: "f(x) = x^2" },
      { id: "m", type: "expr", text: "f(2) = 4" },
      { id: "n", type: "expr", text: "w(n) = w(n-1) + 1" },
      { id: "o", type: "expr", text: "w(0) = q" },
    ],
    settings: {},
  };
  const M = buildModel(st);
  const by = Object.fromEntries(M.items.map((o) => [o.id, o]));
  assert.equal(by.a.kind, "func");
  assert.equal(by.a.plot, "seq");
  assert.deepEqual(by.a.seq.range(1, 4), [[1, 2], [2, 5], [3, 8], [4, 11]]);
  assert.equal(by.b.kind, "seqinit");
  assert.equal(by.e.value, 29);
  assert.equal(by.f.plot, "seq");
  assert.equal(by.f.fn(4), 0.25);
  assert.ok(Number.isNaN(by.f.fn(0))); // eksplicitno zaporedje začne pri n = 1
  assert.ok(Number.isNaN(by.f.fn(2.5)));
  assert.deepEqual(by.g.seq.range(1, 8).map((p) => p[1]), [1, 1, 2, 3, 5, 8, 13, 21]);
  assert.equal(by.j.kind, "error");
  assert.equal(by.j.error.code, "seqStart");
  assert.deepEqual(by.k.cols[1].values.slice(0, 3), [2, 5, 8]);
  assert.ok(Number.isNaN(by.k.cols[1].values[3]));
  assert.equal(by.l.plot, "y"); // f(x) ostane navadna funkcija
  assert.equal(by.m.kind, "value");
  assert.equal(by.o.kind, "error"); // q ni definiran
  assert.deepEqual(by.o.missing, ["q"]);
  // dolgo rekurzivno zaporedje v enem računu (brez prekoračitve sklada)
  const long = by.a.seq.range(1, 10001, 100);
  assert.equal(long.at(-1)[1], 2 + 3 * 10000);
});
