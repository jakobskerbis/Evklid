// Spodnja vrstica ostane na dnu zaslona (j 2026-11-04): v aplikaciji drsi samo odprt pogled, nikoli cela stran.
// Skrit napis (.sr-only) brez postavljenega prednika je stal na svojem mestu v drsni vsebini (»Jezik« na dnu Nastavitev)
// in podaljšal celo stran; klik na kartico z imenom na strani Jaz (scrollIntoView) je nato premaknil stran in vrstica je
// obvisela sredi zaslona. V brskalniku to preveri scripts/preveri-aplikacijo.cjs (»cela stran je … višja od zaslona«).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const style = readFileSync(new URL("../public/style.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

test(".sr-only stoji na vrhu svojega okvirja in ne podaljša strani", () => {
  const rule = /(^|\n)\.sr-only \{([^}]*)\}/.exec(style);
  assert.ok(rule, ".sr-only obstaja");
  assert.match(rule[2], /position:\s*absolute/);
  assert.match(rule[2], /(^|;)\s*top:\s*0/);
  assert.match(rule[2], /inset-inline-start:\s*0/);
});

test("aplikacija ima višino zaslona; drsijo pogledi, ne stran", () => {
  assert.match(style, /html, body \{[^}]*height: 100%/);
  assert.match(style, /\.view \{ flex: 1; min-height: 0; \}/);
});
