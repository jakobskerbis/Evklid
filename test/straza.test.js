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

test("straža: inštruktor v preizkusnem načinu (mock) podre Stražo", async () => {
  const { presojaStanja } = await import("../scripts/straza.mjs");
  const osnova = { id: "x", razlicica: "1" };
  assert.deepEqual(presojaStanja({ ...osnova, mock: false }).napake, []);
  assert.match(presojaStanja({ ...osnova, mock: true }).napake.join(), /preizkusnem načinu/);
});

test("straža: SymPy ne teče → napaka (skener P3-3); izklopljen ali še v zagonu ni napaka", async () => {
  const { presojaStanja } = await import("../scripts/straza.mjs");
  const osnova = { id: "x", razlicica: "1" };
  assert.match(presojaStanja({ ...osnova, cas: { vklopljen: true, deluje: false } }).napake.join(), /SymPy/);
  assert.deepEqual(presojaStanja({ ...osnova, cas: { vklopljen: true, deluje: true } }).napake, []);
  assert.deepEqual(presojaStanja({ ...osnova, cas: { vklopljen: true, deluje: null } }).napake, []);
  assert.deepEqual(presojaStanja({ ...osnova, cas: { vklopljen: false, deluje: null } }).napake, []);
});

test("/healthz/stanje: polje cas pove, ali SymPy teče", async () => {
  const { casStanje } = await import("../server/cas.js");
  const s = casStanje();
  assert.equal(typeof s.vklopljen, "boolean");
  assert.ok([true, false, null].includes(s.deluje));
});
