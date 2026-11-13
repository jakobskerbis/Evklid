// Vsi generatorji nalog: veljavne naloge pri vseh težavnostih ter skladni
// podatki (Podatki / Iščemo) in formula za rešen zgled.
import test from "node:test";
import assert from "node:assert/strict";
import { GENERATORS, generateTask } from "../server/practice/index.js";

const SEEDS = 40;
const norm = (s) => String(s).replace(/\{,\}/g, ",").replace(/\\[,;: ]|~/g, " ");
// Števila v zapisu podatkov (npr. "9", "0,056", "9,81").
// Enote (\mathrm{m\ s^{-2}}) niso podatek: njihove eksponente izpustimo.
const numbers = (s) => norm(s).replace(/\\mathrm\{(?:[^{}]|\{[^{}]*\})*\}/g, "").match(/-?\d+(?:,\d+)?/g) || [];

function checkTask(t, where) {
  assert.ok(t.text && t.answer && t.solution && t.hint, `${where}: manjka text/answer/solution/hint`);
  for (const k of ["text", "solution", "hint"]) assert.equal(typeof t[k], "string", `${where}: ${k} ni niz`);
  // data: false / formula: false = naloga namenoma nima podatkov oz. formule (npr. urejanje enačbe).
  if (t.data != null && t.data !== false) {
    assert.ok(Array.isArray(t.data.given) && t.data.given.length, `${where}: data.given mora biti neprazen seznam`);
    for (const g of t.data.given) {
      assert.equal(typeof g, "string", `${where}: data.given vsebuje ne-niz`);
      assert.ok(g.includes("="), `${where}: podatek brez '=': ${g}`);
      assert.ok(!g.includes("$"), `${where}: podatek vsebuje $: ${g}`);
      // Vsako število iz podatkov mora biti v besedilu naloge (enak zapis).
      const text = norm(t.text);
      for (const n of numbers(g.split("=").slice(1).join("="))) {
        assert.ok(text.includes(n), `${where}: število ${n} iz podatka "${g}" ni v besedilu: ${t.text}`);
      }
    }
    assert.ok(Array.isArray(t.data.find) && t.data.find.length, `${where}: data.find mora biti neprazen seznam`);
    for (const f of t.data.find) assert.ok(typeof f === "string" && f && !f.includes("$") && !f.includes("="), `${where}: neveljaven data.find: ${f}`);
  }
  if (t.formula != null && t.formula !== false) {
    const fs = Array.isArray(t.formula) ? t.formula : [t.formula];
    assert.ok(fs.length, `${where}: prazna formula`);
    for (const f of fs) assert.ok(typeof f === "string" && f.trim() && !f.includes("$"), `${where}: neveljavna formula: ${f}`);
  }
}

test("vsi generatorji vrnejo veljavne naloge pri vseh težavnostih", () => {
  for (const g of GENERATORS) {
    for (const level of [1, 2, 3]) {
      for (let seed = 1; seed <= SEEDS; seed++) {
        const t = generateTask(g.topics[0], level, seed * 7919 + level);
        checkTask(t, `${g.id} L${level} seed ${seed}`);
        // Dvojezični generatorji (indijski izpiti): tudi hindijska naloga.
        if (g.langs?.includes("hi")) checkTask(generateTask(g.topics[0], level, seed * 7919 + level, "hi"), `${g.id} L${level} seed ${seed} hi`);
      }
    }
  }
});

test("naloge iz fizike in kemije imajo podatke in formulo", () => {
  const missing = new Set();
  for (const g of GENERATORS) {
    const subj = g.topics[0].slice(0, 3);
    if (subj !== "FIZ" && subj !== "KEM") continue;
    for (const level of [1, 2, 3]) {
      for (let seed = 1; seed <= 10; seed++) {
        const t = generateTask(g.topics[0], level, seed * 104729 + level);
        if (t.answer.type === "choice") continue; // vprašanja z izbiro nimajo nujno računa
        if (!t.data && t.data !== false) missing.add(`${g.id} L${level} (podatki)`);
        if (!t.formula && t.formula !== false) missing.add(`${g.id} L${level} (formula)`);
      }
    }
  }
  assert.deepEqual([...missing], [], `Brez podatkov/formule: ${[...missing].join(", ")}`);
});

test("pokritost matematike s podatki (samo poročilo)", () => {
  const withData = new Set(), without = new Set();
  for (const g of GENERATORS) {
    if (!g.topics[0].startsWith("MAT")) continue;
    for (const level of [1, 2, 3]) {
      const t = generateTask(g.topics[0], level, 12345 + level);
      (t.data || t.data === false ? withData : without).add(g.id);
    }
  }
  console.log(`MAT generatorji s podatki: ${withData.size}, brez: ${without.size}${without.size ? ` (${[...without].join(", ")})` : ""}`);
});
