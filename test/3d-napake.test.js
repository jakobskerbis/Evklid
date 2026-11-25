// Napake 3D sveta (public/3d/napake.js): vsaka napaka ne sme reči »Preveri povezavo«. Star Safari (SyntaxError) mora
// dobiti navodilo za posodobitev, premalo pomnilnika nasvet za nižjo kakovost, neznana napaka kodo.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { napakaBesedilo } from "../public/3d/napake.js";

const na = (err) => napakaBesedilo(err, { naVoljo: true });

test("star brskalnik: SyntaxError → posodobi sistem in brskalnik", () => {
  assert.equal(na(new SyntaxError("Unexpected token '{'")).key, "a3.oldBrowser");
  assert.equal(na({ koda: "brskalnik" }).key, "a3.oldBrowser");
});

test("pomnilnik: RangeError, »out of memory«, izgubljen kontekst → nižja kakovost", () => {
  assert.equal(na(new RangeError("Array buffer allocation failed")).key, "a3.lowMemory");
  assert.equal(na(new Error("Out of memory")).key, "a3.lowMemory");
  assert.equal(na(new Error("WebGL: CONTEXT_LOST_WEBGL")).key, "a3.lowMemory");
  assert.equal(na({ koda: "pomnilnik" }).vrsta, "pomnilnik");
});

test("povezava: Safari »Load failed«, Chrome »Failed to fetch«, uvoz modula, HTTP 404 in 500, brez povezave", () => {
  for (const m of ["Load failed", "Failed to fetch", "Importing a module script failed.", "error loading dynamically imported module", "Failed to fetch dynamically imported module: https://x/3d/a.js", "NetworkError when attempting to fetch resource."]) {
    assert.equal(na(new TypeError(m)).key, "a3.loadError", m);
  }
  const http404 = na(Object.assign(new Error('fetch for "https://x/a.glb" responded with 404: Not Found'), { response: { status: 404 } }));
  assert.deepEqual([http404.key, http404.detail], ["a3.loadError", "HTTP 404"]);
  assert.equal(na(new Error("HTTP 500")).key, "a3.loadError");
  assert.equal(na({ status: 503 }).key, "a3.loadError");
  // brez povezave: tudi napaka, ki je sicer ne bi prepoznali, pomeni povezavo
  assert.equal(napakaBesedilo(new TypeError("x is not a function"), { naVoljo: false }).key, "a3.loadError");
});

test("WebGL ostane svoje sporočilo, neznana napaka dobi splošno besedilo in ime napake", () => {
  assert.equal(na({ koda: "webgl" }).key, "a3.noWebgl");
  const r = na(new TypeError("Cannot read properties of undefined (reading 'x')"));
  assert.deepEqual([r.key, r.vrsta, r.detail], ["a3.otherError", "drugo", "TypeError"]);
  assert.equal(na(null).key, "a3.otherError");
  assert.equal(na("niz").detail, "Error");
});

test("vsak ključ ima besedilo v slovenščini in v živih jezikih", async () => {
  const { default: SL } = await import("../public/i18n/sl.js");
  const { LIVE_UI_LANGUAGES } = await import("../public/i18n/languages.js");
  const kljuci = ["a3.oldBrowser", "a3.lowMemory", "a3.lowQuality", "a3.otherError", "a3.errorCode", "a3.retry", "a3.loadError", "a3.noWebgl"];
  for (const k of kljuci) assert.ok(SL[k], `sl: ${k}`);
  for (const jezik of LIVE_UI_LANGUAGES.filter((j) => j !== "sl")) {
    const ui = JSON.parse(fs.readFileSync(new URL(`../public/i18n/ui/${jezik}.json`, import.meta.url), "utf8"));
    for (const k of kljuci) assert.ok(ui[k], `${jezik}: ${k}`);
  }
});
