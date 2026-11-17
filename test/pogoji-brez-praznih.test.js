// Pogoji brez praznih mest (j, 17. 11. 2026): na javni strani ne sme ostati nobeno »[…]« polje
// in nobena interna opomba »za pravnika«. Do registracije s.p. velja začasno besedilo.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../public/pogoji.html", import.meta.url), "utf8");
const besedilo = html
  .replace(/<script[\s\S]*?<\/script>/gi, "")
  .replace(/<style[\s\S]*?<\/style>/gi, "")
  .replace(/<!--[\s\S]*?-->/g, "");

test("pogoji.html nima praznih mest »[…]«", () => {
  const najdeno = besedilo.match(/\[[^\]\n]{1,200}\]/g) ?? [];
  assert.deepEqual(najdeno, []);
});

test("pogoji.html nima opomb za pravnika", () => {
  assert.doesNotMatch(html, /za pravnika/i);
});

test("pogoji.html nima označenih polj class=\"todo\"", () => {
  assert.doesNotMatch(besedilo, /class="todo"/);
});
