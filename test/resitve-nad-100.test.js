// AUDIT-015: enačbe in neenačbe z rešitvijo zunaj [−100, 100] (prej »x ∈ ∅« oziroma napačen interval).
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze, solutionTex } from "../public/graph/scisolve.js";

const an = (s) => analyze(s, { comma: true });
const close = (a, b) => Math.abs(a - b) <= 1e-8 * Math.max(1, Math.abs(b));

test("enačbe z rešitvijo nad 100 (AUDIT-015)", () => {
  for (const [s, r] of [["√x=20", 400], ["ln(x)=7", Math.exp(7)], ["∛x=-30", -27000], ["log(x)=3,5", 10 ** 3.5], ["x+ln(x)=5000", 4991.484511358231], ["ln(x+1)=9", Math.exp(9) - 1]]) {
    const a = an(s);
    assert.equal(a.roots.length, 1, s);
    assert.ok(close(a.roots[0], r), `${s}: ${a.roots[0]} ≠ ${r}`);
  }
});

test("neenačbe z mejo nad 100 (AUDIT-015)", () => {
  const z = (v) => (v === 0 ? 0 : Number.isFinite(v) ? v : null); // −0 je 0, ±∞ je null
  const iv = (s) => an(s).intervals.map((i) => [z(i.lo), z(i.hi)]);
  assert.deepEqual(iv("√x<20"), [[0, 400]]);
  const [[lo, hi]] = iv("ln(x)>5");
  assert.ok(close(lo, Math.exp(5)) && hi === null);
  // e^x je za x < −745 v računalniku točno 0: to ni ničla, meja goste mreže (−100) pa ni kritična točka
  assert.deepEqual(iv("e^x>0"), [[null, null]]);
  const [[, h2]] = iv("e^x<10^(-50)");
  assert.ok(close(h2, -50 * Math.log(10)));
  assert.deepEqual(iv("x+100>0"), [[-100, null]]);
});

test("brez rešitve: »na intervalu ni rešitve«, ne »∅« (AUDIT-015)", () => {
  const a = an("e^x=-1");
  assert.deepEqual(a.roots, []);
  assert.ok(a.searched);
  assert.match(solutionTex(a), /\\notin/);
  // polinom brez realnih rešitev ostane, kot je bil (dokazano)
  assert.ok(!an("x^2+1=0").searched);
});
