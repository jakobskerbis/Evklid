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

// Ko dve različni napaki dasta isto vrednost, učenec ne sme dobiti razlage napačne napake (pregled PR #912).
const task = (id, level, seed) => {
  const g = GENERATORS.find((x) => x.id === id);
  return g.gen(level, makeRng(seed * 7919 + level), g.topics[0]);
};
const whyOf = (t, v) => (t.answer.mistakes || []).find((m) => Math.abs(m.value - v) < 1e-9)?.why;

test("napake brez prekrivanj: dve napaki ene naloge nimata iste vrednosti", () => {
  for (const ids of Object.values(TOPICS)) {
    for (const id of ids) {
      for (const level of [1, 2, 3]) {
        for (let seed = 1; seed <= 300; seed++) {
          const ms = task(id, level, seed)?.answer.mistakes || [];
          const vals = ms.map((m) => m.value);
          assert.equal(new Set(vals.map((v) => v.toFixed(9))).size, vals.length, `${id} L${level} seme ${seed}: ${vals}`);
        }
      }
    }
  }
});

test("napake: prave razlage pri primerih iz pregleda", () => {
  // sin(α − β): napaka po kvadrantu in v formuli dasta isto vrednost → ena skupna razlaga
  let t = task("dod-mat-ss34-adicijski-izreki", 3, 1);
  assert.match(t.text, /\\frac\{9\}\{41\}/);
  assert.equal(whyOf(t, -496 / 1025), "Preveri predznak drugega člena: v formuli in po kvadrantu.");
  assert.equal(t.answer.mistakes.length, 1);
  // sin x + cos x = 4/5: −res izhaja iz napačnega predznaka dvojnega produkta
  t = task("dod-mat-ss34-adicijski-preoblikovanje", 3, 4);
  assert.match(t.text, /\\sin x \+ \\cos x = \\frac\{4\}\{5\}/);
  assert.match(whyOf(t, 9 / 25), /dvojni produkt \$\+2/);
  // lim pri x → −1: napačen predznak ničel bi dal 0 → ostane le razlaga 0/0
  t = task("dod-mat-ss34-limita-in-zveznost-funkcije", 2, 1);
  assert.match(t.text, /x \\to -1/);
  assert.match(whyOf(t, 0), /\\frac\{0\}\{0\}/);
  assert.ok(!t.answer.mistakes.some((m) => /predznaka ničel/.test(m.why)));
  // lim pri x → ∞ z razmerjem prostih členov 0: splošna razlaga
  t = task("dod-mat-ss34-limita-in-zveznost-funkcije", 1, 5);
  assert.match(t.text, /2x\^2 - 3x/);
  assert.match(whyOf(t, 0), /Proti 0 gredo/);
  assert.ok(!t.answer.mistakes.some((m) => /prosti členi/.test(m.why)));
  // limita −1: vnos 1 je prej zdrs pri predznaku, zato brez razlage »∞/∞ ni 1«
  for (const [id, level, seed] of [["dod-mat-ss34-limita-in-zveznost-funkcije", 1, 4], ["dod-mat-ss34-zaporedja", 1, 28]]) {
    t = task(id, level, seed);
    assert.equal(t.answer.num / t.answer.den, -1, `${id} ${seed}`);
    assert.equal(whyOf(t, 1), undefined, `${id} ${seed}`);
  }
});

test("napake: brez zadnjega koraka v razlagi in brez prekrivanj pri integralu", () => {
  for (let seed = 1; seed <= 300; seed++) {
    for (const level of [1, 2, 3]) {
      for (const id of ["dod-mat-ss34-zaporedja", "dod-mat-ss34-geometrijska-vrsta", "dod-mat-ss34-limita-in-zveznost-funkcije", "dod-mat-ss34-adicijski-preoblikovanje"]) {
        for (const m of task(id, level, seed)?.answer.mistakes || []) {
          assert.ok(!/-krat večje|skupaj torej|kar gre proti|\\circ/.test(m.why), `${id} L${level} ${seed}: ${m.why}`);
        }
      }
      const t = task("dod-mat-ss34-nedoloceni-integral", level, seed);
      // ∫ m·x(x² + c) dx: pri n = 1 sta »pozabljen ½« in »stari eksponent« isto (m/2) → nobena razlaga
      const m1 = t.text.match(/\\int (\d*)x\(x\^2 \+ \d\)\\,dx = k\(x\^2 \+ \d\)\^\{2\}/);
      if (m1) assert.equal(whyOf(t, Number(m1[1] || 1) / 2), undefined, t.text);
      // ∫ a·x dx: brez deljenja je ista vrednost kot deljenje s starim eksponentom 1 → velja splošna razlaga
      const m2 = t.text.match(/\\int (-?\d*)x\\,dx = kx\^\{2\}/);
      if (m2) assert.match(whyOf(t, Number(m2[1] === "-" ? -1 : m2[1] || 1)) || "", /koeficient deliš z novim eksponentom/, t.text);
    }
  }
  // ulomljeni izrazi (razlika ulomkov) in limita s tangensom: nevtralni besedili
  let neutral = 0;
  let tan = 0;
  for (let seed = 1; seed <= 300; seed++) {
    const u = task("dod-mat-ss12-ulomljeni", 3, seed);
    const z = whyOf(u, 0);
    if (z) {
      assert.equal(z, "Najprej razširi na skupni imenovalec; minus velja za ves števec.");
      neutral++;
    }
    const l = task("dod-mat-ss34-limita-in-zveznost-funkcije", 2, seed);
    if (/\\tan/.test(l.text) && whyOf(l, 1)) {
      assert.match(whyOf(l, 1), /\\tan u/);
      assert.ok(!/sinus/.test(whyOf(l, 1)));
      tan++;
    }
  }
  assert.ok(neutral > 0 && tan > 0);
});
