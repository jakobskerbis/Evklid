// Zneski in števila v jeziku aplikacije (sl: 0,00 €), ne v jeziku brskalnika (j, 4. 11.: zgornja vrstica je kazala 0.00 €).
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

test("števila: nobenega toLocaleString(undefined) v public/*.js", () => {
  const bad = readdirSync("public")
    .filter((f) => f.endsWith(".js"))
    .flatMap((f) => readFileSync(`public/${f}`, "utf8").split("\n").map((l, i) => [f, i + 1, l]))
    .filter(([, , l]) => /toLocaleString\(\s*undefined\b/.test(l))
    .map(([f, n]) => `public/${f}:${n}`);
  assert.deepEqual(bad, [], "uporabi locale() iz public/i18n.js");
  assert.equal((0).toLocaleString("sl", { minimumFractionDigits: 2, maximumFractionDigits: 2 }), "0,00");
});
