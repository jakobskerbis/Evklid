// Iskanje po učbeniku: predpomnjeno poenoteno besedilo ne spremeni zadetkov; odlomek ima vsak prikazan zadetek z lekcijo.
import test from "node:test";
import assert from "node:assert/strict";
import { searchTextbook } from "../server/textbook.js";

test("iskanje: ponovljeno iskanje vrne enake zadetke, odlomek za vsak prikazan zadetek z lekcijo, največ limit", () => {
  for (const q of ["ab", "ulomki", "energija", "xxxxxxxx"]) {
    const a = searchTextbook(q, {});
    const b = searchTextbook(q, {});
    assert.deepEqual(a, b, q);
    assert.ok(a.length <= 30, q);
    for (const h of a) {
      assert.equal(typeof h.snippet, "string");
      assert.ok(!("_lesson" in h) && !("score" in h), "notranji polji ne gresta odjemalcu");
    }
  }
  assert.equal(searchTextbook("ab", { limit: 5 }).length <= 5, true);
  // Kratka beseda, ki zadene veliko lekcij, mora ostati hitra (prej ~100 ms zaradi odlomka za vse zadetke).
  const t = process.hrtime.bigint();
  for (let i = 0; i < 10; i++) searchTextbook("ab", {});
  const ms = Number(process.hrtime.bigint() - t) / 1e7;
  assert.ok(ms < 80, `${ms.toFixed(1)} ms na iskanje`);
});
