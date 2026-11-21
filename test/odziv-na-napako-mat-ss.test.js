// Tipične napake pri maturitetnih temah MAT-SS (zaporedja, geometrijska vrsta, nedoločeni integral,
// ulomljeni izrazi, adicijski izreki, limita): naloge s številskim odgovorom imajo razlage napak,
// vrednost napake ni pravilni odgovor in vnos te vrednosti vrne njeno razlago.
import test from "node:test";
import assert from "node:assert/strict";
import { GENERATORS } from "../server/practice/index.js";
import { makeRng } from "../server/practice/rng.js";
import { checkAnswer, fmt } from "../server/practice/check.js";

const TOPICS = {
  "MAT-SS-4/zaporedja": ["dod-mat-ss34-zaporedja"],
  "MAT-SS-4/geometrijska-vrsta": ["dod-mat-ss34-geometrijska-vrsta"],
  "MAT-SS-4/nedoloceni-integral": ["dod-mat-ss34-nedoloceni-integral"],
  "MAT-SS-1/ulomljeni-izrazi": ["dod-mat-ss12-ulomljeni"],
  "MAT-SS-3/adicijski-izreki": ["dod-mat-ss34-adicijski-izreki", "dod-mat-ss34-adicijski-preoblikovanje"],
  "MAT-SS-4/limita-in-zveznost-funkcije": ["dod-mat-ss34-limita-in-zveznost-funkcije"],
};
const SEEDS = 150;

// Vrednost kot okrajšan ulomek »p/q« (verižni ulomek), za vnos pri nalogah z ulomkom.
function asFraction(v) {
  let [h0, h1, k0, k1, x] = [0, 1, 1, 0, Math.abs(v)];
  for (let i = 0; i < 30; i++) {
    const a = Math.floor(x);
    [h0, h1] = [h1, a * h1 + h0];
    [k0, k1] = [k1, a * k1 + k0];
    if (Math.abs(h1 / k1 - Math.abs(v)) < 1e-12 || x - a < 1e-12) break;
    x = 1 / (x - a);
  }
  return `${v < 0 ? "-" : ""}${h1}/${k1}`;
}

test("maturitetne teme MAT-SS: generatorji obstajajo in so pri svoji temi", () => {
  for (const [topic, ids] of Object.entries(TOPICS)) {
    for (const id of ids) {
      const g = GENERATORS.find((x) => x.id === id);
      assert.ok(g, id);
      assert.ok(g.topics.includes(topic) && g.topics.includes("MAT-SS-4/vadbena-maturitetna-pola"), id);
    }
  }
});

for (const [topic, ids] of Object.entries(TOPICS)) {
  test(`${topic}: tipične napake imajo razlago in jih preverjanje prepozna`, () => {
    let numeric = 0;
    let withMistakes = 0;
    for (const id of ids) {
      const g = GENERATORS.find((x) => x.id === id);
      for (const level of [1, 2, 3]) {
        for (let seed = 1; seed <= SEEDS; seed++) {
          const t = g.gen(level, makeRng(seed * 7919 + level), g.topics[0]);
          if (!t) continue;
          const a = t.answer;
          if (a.type !== "number" && a.type !== "fraction") continue;
          numeric++;
          const ms = a.mistakes || [];
          if (ms.length) withMistakes++;
          const where = `${id} L${level} seme ${seed}`;
          const right = a.type === "fraction" ? a.num / a.den : a.value;
          assert.ok(ms.length <= 3, `${where}: največ 3 napake`);
          ms.forEach((m, i) => {
            assert.ok(Number.isFinite(m.value) && typeof m.why === "string" && m.why.length > 10, `${where}: napaka brez vrednosti ali razlage`);
            assert.ok(!/undefined|NaN|Infinity/.test(m.why), `${where}: ${m.why}`);
            assert.ok(Math.abs(m.value - right) > 1e-6, `${where}: napaka ${m.value} je enaka odgovoru`);
            for (const o of ms.slice(0, i)) assert.ok(Math.abs(o.value - m.value) > 1e-6, `${where}: podvojena napaka ${m.value}`);
            const input = a.type === "fraction" ? asFraction(m.value) : fmt(m.value) + (a.unit ? ` ${a.unit}` : "");
            const res = checkAnswer(a, input);
            assert.equal(res.kind, "wrong", `${where}: vnos ${input} (odgovor ${right})`);
            assert.equal(res.mistake?.message, m.why, `${where}: vnos ${input} ne vrne svoje razlage`);
          });
        }
      }
    }
    assert.ok(numeric > 100, `${topic}: premalo številskih nalog`);
    assert.ok(withMistakes / numeric >= 0.85, `${topic}: tipične napake le pri ${withMistakes}/${numeric} nalogah`);
  });
}
