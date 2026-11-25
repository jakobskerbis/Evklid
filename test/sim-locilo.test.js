// Decimalno ločilo v simulacijah sledi jeziku vmesnika (public/sim/kit.js: fmt, tfmt, decZapis, beriStevilo).
import test from "node:test";
import assert from "node:assert/strict";
import { fmt, tfmt, decLocilo, decZapis, decBesedilo, decTeX, beriStevilo } from "../public/sim/kit.js";

test("fmt: vejica v sl, de, hr, it, hu; pika v en; minus »−«", () => {
  assert.equal(fmt(1.5, 2, "sl"), "1,5");
  assert.equal(fmt(1.5, 2, "en"), "1.5");
  for (const l of ["de", "hr", "it", "hu"]) assert.equal(fmt(1.25, 2, l), "1,25", l);
  assert.equal(fmt(-2.75, 2, "sl"), "−2,75");
  assert.equal(fmt(-2.75, 2, "en"), "−2.75");
  assert.equal(fmt(-0.001, 2, "en"), "0");
  assert.equal(fmt(NaN, 2, "en"), "–");
});

test("ločilo po Intl: fr, ru … vejica; en in en-GB pika; neznan jezik po uiChain", () => {
  for (const l of ["sl", "fr", "ru", "sr"]) assert.equal(decLocilo(l), ",", l);
  assert.equal(decLocilo("en"), ".");
  assert.equal(decLocilo("en-GB"), ".");
  assert.equal(fmt(1.5, 2, "fr"), "1,5");
  assert.equal(decLocilo("xx"), ","); // neznan → sl
  assert.equal(fmt(3.14), "3,14"); // brez dokumenta slovensko
});

test("stalnice v formuli in besedilu ter eksponent", () => {
  assert.equal(decTeX(String.raw`m \cdot 9{,}81 = 0,1\ x_{1,2}`, "en"), String.raw`m \cdot 9.81 = 0.1\ x_{1,2}`);
  assert.equal(decTeX("9{,}81", "sl"), "9{,}81");
  assert.equal(decBesedilo("0,25 in 1, 2", "en"), "0.25 in 1, 2");
  assert.equal(decBesedilo("109,5°", "sl"), "109,5°");
  assert.equal(decZapis("1.2e-5", "en"), "1.2e−5");
});

test("jezik vzame iz <html lang>", () => {
  const prej = globalThis.document;
  try {
    globalThis.document = { documentElement: { lang: "en" } };
    assert.equal(fmt(0.25), "0.25");
    assert.equal(decZapis("-12.30"), "−12.30");
    globalThis.document.documentElement.lang = "sl";
    assert.equal(fmt(0.25), "0,25");
  } finally {
    if (prej === undefined) delete globalThis.document;
    else globalThis.document = prej;
  }
});

test("tfmt: {,} samo pri vejici", () => {
  assert.equal(tfmt(-1.5, 2, "sl"), "-1{,}5");
  assert.equal(tfmt(-1.5, 2, "en"), "-1.5");
});

test("beriStevilo sprejme vejico ali piko", () => {
  assert.equal(beriStevilo("0,35"), 0.35);
  assert.equal(beriStevilo(" 24.80 "), 24.8);
  assert.equal(beriStevilo("−1,5"), -1.5);
  assert.equal(beriStevilo(""), null);
  assert.equal(beriStevilo("abc"), null);
});
