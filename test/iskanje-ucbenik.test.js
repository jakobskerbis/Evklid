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

// N-07 (j, 25. 11. 2026: vsa matematika v KaTeX): odlomek obdrži formule cele kot $…$, da jih učbenik izriše; prej je
// iz $$…$$ ostal surov »F = k\,\frac{q1 q2}{r^2}«. Meji odlomka nikoli sredi formule.
test("iskanje: odlomek ima cele formule $…$ in nobenega surovega LaTeX-a zunaj njih", () => {
  let formul = 0;
  for (const q of ["coulomb", "ulomek", "integral", "energija", "enacba", "potenca", "odvod", "kot"]) {
    for (const h of searchTextbook(q, {})) {
      const s = h.snippet;
      assert.equal((s.match(/\$/g) || []).length % 2, 0, `${h.id}: nezaprta formula v »${s}«`);
      const zunaj = s.split(/\$[^$]+\$/).join(" ");
      assert.doesNotMatch(zunaj, /\\[a-zA-Z]+|[A-Za-z0-9]\^[\w{]/, `${h.id}: surov LaTeX v »${s}«`);
      formul += (s.match(/\$[^$]+\$/g) || []).length;
    }
  }
  assert.ok(formul > 10, `premalo formul v odlomkih (${formul})`);
  const c = searchTextbook("coulombov zakon", {}).find((h) => /\\frac\{q_1 q_2\}/.test(h.snippet));
  assert.ok(c, "Coulombov zakon: formula v odlomku");
  assert.match(c.snippet, /\$F = k\\,\\frac\{q_1 q_2\}\{r\^2\}\$/);
});
