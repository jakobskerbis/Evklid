// Vsi generatorji nalog: veljavne naloge pri vseh težavnostih ter skladni
// podatki (Podatki / Iščemo) in formula za rešen zgled.
import test from "node:test";
import assert from "node:assert/strict";
import { GENERATORS, generateTask } from "../server/practice/index.js";
import { makeRng } from "../server/practice/rng.js";

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

// Teme SŠ, ki so bile prej le na generatorjih OŠ: zdaj jih pokrivajo generatorji maturitetne ravni,
// teme OŠ pa ostanejo pri svojih generatorjih.
const SS_OS = {
  "MAT-SS-4/verjetnost": ["mat-ss4-matura-verjetnost", "mat-ss4-matura-pogojna-verjetnost"],
  "MAT-SS-2/podobnost": ["mat-ss2-matura-podobnost"],
  "MAT-SS-3/povrsina-in-prostornina-teles": ["mat-ss3-matura-telesa"],
  "MAT-SS-1/linearne-enacbe": ["mat-ss1-matura-linearne-enacbe"],
  "MAT-SS-1/linearna-funkcija": ["mat-ss1-matura-linearna-funkcija"],
  "MAT-SS-1/linearne-neenacbe": ["mat-ss1-matura-linearne-neenacbe"],
};
const gen = (id) => GENERATORS.find((x) => x.id === id);

test("teme SŠ (verjetnost, podobnost, telesa, linearne) imajo le generatorje SŠ, teme OŠ ostanejo pri OŠ", () => {
  for (const [topic, ids] of Object.entries(SS_OS)) {
    const got = GENERATORS.filter((g) => g.topics.includes(topic)).map((g) => g.id).sort();
    assert.deepEqual(got, [...ids].sort(), topic);
  }
  const os = { verjetnost: "MAT-OS-9/verjetnost", podobnost: "MAT-OS-9/podobni-trikotniki", telesa: "MAT-OS-9/valj", "linearne-enacbe": "MAT-OS-8/linearne-enacbe", "linearna-funkcija": "MAT-OS-9/linearna-funkcija", neenacbe: "MAT-OS-9/linearne-neenacbe" };
  for (const [id, topic] of Object.entries(os)) {
    const g = gen(id);
    assert.ok(g.topics.includes(topic) && g.topics.every((t) => !t.startsWith("MAT-SS-")), id);
  }
});

test("verjetnost: besedilo »pade šestica« in tipične napake pri vseh številskih nalogah", () => {
  let six = 0;
  for (const id of ["verjetnost", ...SS_OS["MAT-SS-4/verjetnost"]]) {
    const g = gen(id);
    for (const level of [1, 2, 3]) {
      for (let seed = 1; seed <= 80; seed++) {
        const t = g.gen(level, makeRng(seed * 7919 + level), g.topics[0]);
        assert.ok(!/šestico\?/.test(t.text), t.text);
        if (/da pade šestica\?/.test(t.text)) six++;
        if (t.answer.type === "choice") continue;
        assert.ok(t.answer.mistakes?.length, `${id} L${level} seed ${seed}: brez tipičnih napak`);
      }
    }
  }
  assert.ok(six > 0, "naloga »da pade šestica« se pojavi");
});

test("verjetnost SŠ: dve kocki in vsota pik se ujemata s štetjem vseh 36 izidov", () => {
  const g = gen("mat-ss4-matura-verjetnost");
  let n = 0;
  for (let seed = 1; seed <= 300; seed++) {
    const t = g.gen(1, makeRng(seed), g.topics[0]);
    const m = t.text.match(/vsota pik je (enaka|največ|vsaj) \$(\d+)\$/);
    if (!m) continue;
    const s = Number(m[2]);
    let c = 0;
    for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (m[1] === "enaka" ? a + b === s : m[1] === "največ" ? a + b <= s : a + b >= s) c++;
    assert.ok(Math.abs(t.answer.num / t.answer.den - c / 36) < 1e-12, t.text);
    n++;
  }
  assert.ok(n > 10);
});

test("linearne enačbe SŠ: rešitev zadošča enačbi", () => {
  const g = gen("mat-ss1-matura-linearne-enacbe");
  // TeX → JS: ulomki, kvadrati in množenje brez znaka (2x, 3(x + 1), )( …)
  const js = (s) => s.replace(/\\dfrac\{([^{}]*)\}\{([^{}]*)\}/g, "(($1)/($2))").replace(/\^2/g, "**2").replace(/(\d|\)|x)\s*(\(|x)/g, "$1*$2");
  let n = 0;
  for (const level of [1, 2]) {
    for (let seed = 1; seed <= 150; seed++) {
      const t = g.gen(level, makeRng(seed), g.topics[0]);
      const m = t.text.match(/^Reši enačbo \$(.*) = (.*)\$\.$/);
      if (!m) continue;
      const x = t.answer.type === "fraction" ? t.answer.num / t.answer.den : t.answer.value;
      const f = (e) => Function("x", `return ${js(e)}`)(x);
      assert.ok(Math.abs(f(m[1]) - f(m[2])) < 1e-9, t.text);
      n++;
    }
  }
  assert.ok(n > 50);
});

test("pogojna verjetnost: podatki pri »neodvisna ali nezdružljiva« so mogoči (P(A + B) ≤ 1)", () => {
  const g = gen("mat-ss4-matura-pogojna-verjetnost");
  let n = 0;
  for (let seed = 1; seed <= 4000; seed++) {
    const t = g.gen(2, makeRng(seed), g.topics[0]);
    if (!/^\(višja raven\) Za dogodka/.test(t.text)) continue;
    const [pA, pB, pAB] = [...t.text.matchAll(/= (\d)\{,\}(\d+)\$|= (0)\$/g)].map((m) => (m[3] ? 0 : Number(`${m[1]}.${m[2]}`)));
    assert.ok(pAB <= Math.min(pA, pB) + 1e-9 && pA + pB - pAB <= 1 + 1e-9, t.text);
    n++;
  }
  assert.ok(n > 100);
});
