import { test } from "node:test";
import assert from "node:assert/strict";
import { SHOW_AFTER, expectedMs, progressAt, addDuration } from "../public/check-progress.js";

test("vrstica napredka pri preverjanju: šele po 2 s, z oceno preostalega časa", () => {
  assert.equal(progressAt(1999, 6000), null);
  const a = progressAt(SHOW_AFTER, 6000);
  assert.ok(a.pct > 0 && a.pct < 0.5);
  assert.equal(a.left, 4);
  const b = progressAt(5000, 6000);
  assert.ok(b.pct > a.pct);
  assert.equal(b.left, 1);
  const late = progressAt(20000, 6000);
  assert.equal(late.left, 0);
  assert.ok(late.pct <= 0.95 && late.pct > 0.9);
});

test("ocena trajanja iz zadnjih počasnih preverjanj", () => {
  assert.equal(expectedMs([]), 6000);
  assert.equal(expectedMs([500, 800]), 6000); // hitra preverjanja ne štejejo
  assert.equal(expectedMs([3000, 5000]), 4000);
  const h = Array.from({ length: 30 }, () => 3000).reduce((acc, ms) => addDuration(acc, ms), []);
  assert.equal(h.length, 16);
});
