// Vnos znanstvenega kalkulatorja je viden samo kot lep zapis s kazalcem (j, 5. 11.).
import { test } from "node:test";
import assert from "node:assert/strict";
import { entryTex, complete } from "../public/graph/sci-vnos.js";

const caret = (r) => (r.tex.match(/\\rule/g) || []).length;

test("nedokončan vnos se izriše lepo, s kazalcem in praznimi okvirčki", () => {
  assert.equal(entryTex("", 0), null);
  const e = entryTex("5ee^(e", 6);
  assert.ok(e.ok && caret(e) === 1 && /e\^\{e/.test(e.tex), e.tex);
  assert.ok(!/\^\(|\(@/.test(e.tex), "surov ^( ni v zapisu");
  const pow = entryTex("e^(", 3);
  assert.match(pow.tex, /e\^\{\{\\color\{#2f6bff\}\\rule/, "kazalec v eksponentu");
  const sum = entryTex("5+", 2);
  assert.ok(sum.ok && sum.tex.startsWith("5+") && caret(sum) === 1);
  assert.match(entryTex("sin(", 4).tex, /^\\sin\\left\(.*\\rule.*\\right\)$/);
  assert.match(entryTex("(2+3)/", 6).tex, /^\\frac\{2\+3\}\{/);
});

test("kazalec je na mestu vnosa, tudi sredi izraza; manjkajoči del je okvirček", () => {
  const mid = entryTex("5ee^(e", 3);
  assert.ok(mid.tex.indexOf("\\rule") < mid.tex.indexOf("^{e}"), mid.tex);
  const hole = entryTex("2^(+1", 1);
  assert.ok(hole === null || caret(hole) === 1);
  const gap = entryTex("(2+)*3", 5);
  assert.ok(gap.ok && gap.tex.includes("\\square") || caret(gap) === 1);
});

test("nerazčlenljivo besedilo ni surovo: matematična pisava s kazalcem; vedno natanko en kazalec", () => {
  for (const [t, c] of [["2x+3=7", 6], ["d/dx(x^2", 8], ["∫(x;0;", 6], ["3;", 2], ["))", 1], ["x$#", 3]]) {
    const e = entryTex(t, c);
    assert.ok(e && caret(e) === 1, `${t}: ${e && e.tex}`);
  }
  assert.equal(complete("sin(2+(3", "q"), "sin(2+(3))");
});
