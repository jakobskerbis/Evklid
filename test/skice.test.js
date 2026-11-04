// Interaktivne skice v karticah formul (public/skice/): računi v skici se ujemajo s formulami kartice.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { SKICE, skicaZa } from "../public/skice/index.js";
import { racunaj, C_HIP, ALFA_MIN, ALFA_MAX } from "../public/skice/pravokotni-trikotnik.js";

test("vsaka skica ima kartico z enakim imenom na svojem listu", () => {
  for (const key of Object.keys(SKICE)) {
    const [list, ime] = key.split("|");
    const md = fs.readFileSync(new URL(`../content/formulas/${list}.md`, import.meta.url), "utf8");
    assert.ok(md.split("\n").some((l) => l.startsWith(`| ${ime} |`)), `${key}: kartice ni`);
    assert.equal(skicaZa(list, ` ${ime} `), SKICE[key]);
  }
});

test("pravokotni trikotnik: c = 5, Pitagora in kotne funkcije za vsak položaj B", () => {
  for (let al = ALFA_MIN; al <= ALFA_MAX; al += 0.5) {
    const q = racunaj(al);
    assert.equal(q.c, C_HIP);
    assert.ok(Math.abs(q.a ** 2 + q.b ** 2 - 25) < 1e-9);
    assert.ok(Math.abs(q.sin ** 2 + q.cos ** 2 - 1) < 1e-12);
    assert.ok(Math.abs(q.tan - q.sin / q.cos) < 1e-9);
    assert.ok(Math.abs(q.tan * q.cot - 1) < 1e-9);
    assert.ok(Math.abs(q.sin - Math.sin((al * Math.PI) / 180)) < 1e-12);
  }
  // B ne zdrsne iz loka: kot ostane med mejama.
  assert.equal(racunaj(0).alfa, ALFA_MIN);
  assert.equal(racunaj(120).alfa, ALFA_MAX);
  assert.ok(Math.abs(racunaj(36.87).a - 3) < 0.001 && Math.abs(racunaj(36.87).b - 4) < 0.001);
});
