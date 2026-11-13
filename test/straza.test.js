// Straža (scripts/straza.mjs): brez omrežja preveri le, da skript obstaja in ima smiselne preizkuse.
import test from "node:test";
import assert from "node:assert/strict";

process.env.STRAZA_URL = "http://127.0.0.1:9";
const { PREIZKUSI, OSNOVA } = await import("../scripts/straza.mjs");

test("straža: preizkusi so samo javni GET-i brez prijave in brez AI", () => {
  assert.ok(PREIZKUSI.length >= 5);
  assert.equal(OSNOVA, "http://127.0.0.1:9");
  for (const p of PREIZKUSI) {
    assert.match(p.pot, /^\/[\w./-]*$/, p.pot);
    assert.ok(!/chat|login|prijav|account|student|pay|stripe/i.test(p.pot), p.pot);
    assert.equal(typeof p.preveri, "function");
  }
});
