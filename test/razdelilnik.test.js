// Ločnice med deli strani (public/razdelilnik.js): meje velikosti in shranjevanje na napravi.
import test from "node:test";
import assert from "node:assert/strict";

const mem = new Map();
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
};
const { clampSize, limits, sizeFor, readSize, saveSize, resetSplits, splitsOn } = await import("../public/razdelilnik.js");

test("clampSize: stays between min and max, rounds, min wins when max < min", () => {
  assert.equal(clampSize(150, 200, 480), 200);
  assert.equal(clampSize(600, 200, 480), 480);
  assert.equal(clampSize(300.6, 200, 480), 301);
  assert.equal(clampSize(300, 200, 120), 200);
});

test("limits: the other part keeps its minimum; max may depend on the space", () => {
  assert.deepEqual(limits(1200, { min: 200, max: 480, otherMin: 420 }), { min: 200, max: 480 });
  // Ozko okno: drugi del dobi vsaj 420 px, zato je največ 780 − 420 = 360.
  assert.deepEqual(limits(780, { min: 200, max: 480, otherMin: 420 }), { min: 200, max: 360 });
  // Še ožje: največ ne pade pod min.
  assert.deepEqual(limits(500, { min: 200, max: 480, otherMin: 420 }), { min: 200, max: 200 });
  assert.deepEqual(limits(1000, { min: 300, max: (a) => a * 0.5 }), { min: 300, max: 500 });
});

test("sizeFor: stored size is clamped to the current space, 0 only when the part may hide", () => {
  const lim = { min: 200, max: 360 };
  assert.equal(sizeFor(null, lim), null);
  assert.equal(sizeFor(450, lim), 360); // okno se je zožilo
  assert.equal(sizeFor(250, lim), 250);
  assert.equal(sizeFor(0, lim, true), 0);
  assert.equal(sizeFor(0, lim, false), 200);
});

test("sizes persist per device under the brand key and reset together", () => {
  mem.clear();
  assert.equal(readSize("chat"), null);
  saveSize("chat", 321.4);
  saveSize("path", 400);
  assert.equal(readSize("chat"), 321);
  assert.deepEqual(JSON.parse(mem.get("evklid.razdelilnik")), { chat: 321, path: 400 });
  saveSize("chat", 0);
  assert.equal(readSize("chat"), 0);
  saveSize("chat", null);
  assert.equal(readSize("chat"), null);
  assert.equal(readSize("path"), 400);
  resetSplits();
  assert.equal(mem.has("evklid.razdelilnik"), false);
  // Pokvarjena ali tuja vrednost ne podre aplikacije.
  mem.set("evklid.razdelilnik", "{nič");
  assert.equal(readSize("chat"), null);
  mem.set("evklid.razdelilnik", JSON.stringify({ chat: -5, path: "300" }));
  assert.equal(readSize("chat"), null);
  assert.equal(readSize("path"), null);
});

test("splitters follow the »Premična okna« setting", () => {
  mem.clear();
  assert.equal(splitsOn(), true);
  mem.set("evklid.windows", "0");
  assert.equal(splitsOn(), false);
  mem.set("evklid.windows", "1");
  assert.equal(splitsOn(), true);
});
