// AUDIT-005: isto besedilo pomeni isto v znanstvenem in grafičnem kalkulatorju, zapis TeX pa se prebere nazaj
// v isto vrednost. 10 000 naključnih izrazov (stalno seme), v slovenskem zapisu (decimalna vejica, »;«) in s piko.
import test from "node:test";
import assert from "node:assert/strict";
import { parse, compile, toTex, fromTex, argSeparators } from "../public/graph/math.js";
import { evaluate } from "../public/graph/scicore.js";
import { buildModel, ZAPIS, toNum } from "../public/graph/model.js";

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Izraz kot besedilo: comma → »2,5« in »; «, sicer »2.5« in », «.
function gen(r, comma, depth = 0) {
  const pick = (a) => a[Math.floor(r() * a.length)];
  const sep = comma ? "; " : ", ";
  const num = () => {
    const whole = String(Math.floor(r() * 20));
    if (r() < 0.5) return whole;
    const dec = String(Math.floor(r() * 100)).padStart(1 + Math.floor(r() * 2), "0");
    return `${whole}${comma ? "," : "."}${dec}`;
  };
  const small = () => String(1 + Math.floor(r() * 6));
  if (depth > 3 || r() < 0.3) return r() < 0.15 ? pick(["π", "e", "x"]) : num();
  const a = () => gen(r, comma, depth + 1);
  switch (Math.floor(r() * 9)) {
    case 0:
      return `${a()} + ${a()}`;
    case 1:
      return `${a()} - ${a()}`;
    case 2:
      return `${a()}·${a()}`;
    case 3:
      return `(${a()})/(${a()})`;
    case 4:
      return `(${a()})^${small()}`;
    case 5:
      return `${pick(["sin", "cos", "tan", "ln", "sqrt", "abs", "arctan", "floor"])}(${a()})`;
    case 6:
      return `${pick(["max", "min"])}(${Array.from({ length: 2 + Math.floor(r() * 2) }, a).join(sep)})`;
    case 7: // exp le majhnih števil: tan(e^19) je slabo pogojen (razlika med e^x in exp(x) v zadnjih bitih)
      return pick([`exp(${small()})`, `nCr(${small()}${sep}${Math.floor(r() * 4)})`, `mod(${a()}${sep}${small()})`, `root(${a()}${sep}${small()})`, `nPr(${small()}${sep}${Math.floor(r() * 3)})`]);
    default:
      return `-(${a()})`;
  }
}

const same = (a, b) => (Number.isNaN(a) && Number.isNaN(b)) || a === b || Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
const sciValue = (text, comma) => {
  const r = evaluate(text, { comma });
  return r?.error ? { error: r.error.code } : toNum(r.value ?? NaN);
};
const graphValue = (text, comma) => {
  const m = buildModel({ zapis: ZAPIS, items: [{ id: "a", type: "expr", text: `y = ${text}` }] }, { comma });
  const o = m.items[0];
  if (o.kind === "error") return { error: o.error.code };
  return toNum(o.fn(0.7));
};

for (const comma of [true, false]) {
  test(`10 000 izrazov (${comma ? "decimalna vejica" : "decimalna pika"}): enaka vrednost v obeh kalkulatorjih in po poti toTex → fromTex`, () => {
    const r = rng(comma ? 20261124 : 11242026);
    const bad = [];
    for (let k = 0; k < 10000 && bad.length < 10; k++) {
      const text = gen(r, comma);
      const g = graphValue(text, comma);
      const sx = sciValue(text.replace(/(?<![a-z])x(?![a-z])/g, comma ? "(0,7)" : "(0.7)"), comma);
      if (typeof g === "object" || typeof sx === "object" || !same(g, sx)) {
        bad.push(`kalkulatorja: ${text} → graf ${JSON.stringify(g)}, znanstveni ${JSON.stringify(sx)}`);
        continue;
      }
      const ast = parse(argSeparators(text, comma));
      const tex = toTex(ast, { comma, sep: comma ? ";" : "," });
      // brez preskakovanja: fromTex pozna \\binom, \\lfloor, \\lceil in gnezdene \\left| … \\right| (AUDIT-027)
      let back;
      try {
        back = toNum(compile(parse(fromTex(tex)))({ x: 0.7 }));
      } catch (e) {
        back = `napaka ${e.code || e.message}`;
      }
      if (!same(back, g)) bad.push(`toTex: ${text} → ${tex} → ${fromTex(tex)} = ${back}, prej ${g}`);
    }
    assert.deepEqual(bad, []);
  });
}

test("toTex → fromTex: \\binom, \\lfloor, \\lceil in gnezdene absolutne vrednosti (AUDIT-027)", () => {
  for (const [text, x] of [["nCr(5, 2)", 10], ["floor(2.5) + ceil(0.2)", 3], ["abs(abs(x) - 1)·abs(2 - abs(x - 3))", 0.3 * 0.3], ["abs(x - abs(x - 2)·abs(1 - x))", 0.31], ["floor(abs(-2.5))", 2], ["nCr(floor(5.5), ceil(1.5))", 10]]) {
    const tex = toTex(parse(text), { comma: false });
    assert.ok(same(compile(parse(fromTex(tex)))({ x: 0.7 }), x), `${text} → ${tex} → ${fromTex(tex)}`);
  }
});

// AUDIT-026: razredi zapisov, ki so prej v kalkulatorjih pomenili različno (skupna priprava calcText in calcRewrite).
const CLASSES = [
  ["1 000 + 1", 1001],
  ["2e3", 2000],
  ["3E-2", 0.03],
  ["200 + 10 %", 220],
  ["200 - 10 %", 180],
  ["1.234,5", 1234.5],
  ["round(2,345; 2)", 2.35],
  ["12 3456", { error: "unexpected" }],
  ["∫(x; 0; 1)", 0.5],
  ["2e^2", 2 * Math.E ** 2], // e je Eulerjevo število, kadar sledi potenca, črka ali oklepaj
  ["2e3x", 2 * Math.E * 3 * 0.7],
  ["2e-x", 2 * Math.E - 0.7],
  // AUDIT-041: število v znanstvenem zapisu je celota (prej x/1e8 = (x/1)·10⁸)
  ["x/1e8", 0.7e-8],
  ["2/3e2", 2 / 300],
  ["1/2E-3", 500],
  ["x^2e3", 0], // 0,7^2000
  ["−1e2", -100],
  ["2e3^2", 4e6],
  ["3e2!", Infinity],
  ["2/1,5e1", 2 / 15],
];
test("isti zapis pomeni isto v znanstvenem in grafičnem kalkulatorju (tisočice, 2e3, %, round, ∫, nejasna števila)", () => {
  for (const [text, want] of CLASSES) {
    const g = graphValue(text, true);
    const s = sciValue(text.includes("∫") ? text : text.replace(/(?<![a-z])x(?![a-z])/g, "(0,7)"), true); // x v ∫ je spremenljivka integrala
    if (typeof want === "object") {
      assert.deepEqual(g, want, `graf ${text}`);
      assert.deepEqual(s, want, `znanstveni ${text}`);
    } else {
      assert.ok(same(g, want), `graf ${text}: ${JSON.stringify(g)} ≠ ${want}`);
      assert.ok(same(s, want), `znanstveni ${text}: ${JSON.stringify(s)} ≠ ${want}`);
    }
  }
  // E kot ime: v grafu z vrstico »E = 5« in v kalkulatorju s spremenljivko E je »3E-2« 3·E − 2
  const m = buildModel({ zapis: ZAPIS, items: [{ id: "a", type: "expr", text: "E = 5" }, { id: "b", type: "expr", text: "3E-2" }] }, { comma: true });
  assert.equal(toNum(m.items[1].value), 13);
  assert.equal(evaluate("3E-2", { comma: true, vars: { E: 5 } }).value, 13);
});

// Naključni izrazi iz teh razredov (stalno seme): oba kalkulatorja dasta isto vrednost ali isto napako.
function genClass(r, comma) {
  const pick = (a) => a[Math.floor(r() * a.length)];
  const d = comma ? "," : ".";
  const sep = comma ? "; " : ", ";
  const int = () => String(1 + Math.floor(r() * 999));
  const num = () => (r() < 0.5 ? int() : `${int()}${d}${Math.floor(r() * 100)}`);
  const term = () =>
    pick([
      () => `${1 + Math.floor(r() * 99)} ${String(Math.floor(r() * 1000)).padStart(3, "0")}`, // tisočice
      () => (comma ? `${1 + Math.floor(r() * 99)}.${String(Math.floor(r() * 1000)).padStart(3, "0")},${Math.floor(r() * 10)}` : num()),
      () => `${num()}${pick(["e", "E"])}${pick(["", "-", "+"])}${Math.floor(r() * 4)}`,
      () => `round(${num()}${sep}${Math.floor(r() * 3)})`,
      () => `∫(${pick(["x", "x^2", "2x + 1", "sin(x)"])}${sep}0${sep}${1 + Math.floor(r() * 3)})`,
      () => `${int()} ${int()}`, // nejasno, če skupina nima 3 števk
      num,
    ])();
  const a = term();
  return pick([() => a, () => `${a} + ${term()}`, () => `${a} ${pick(["+", "-"])} ${Math.floor(r() * 50)} %`, () => `${a}·${term()}`, () => `(${a})/(${term()})`])();
}
for (const comma of [true, false]) {
  test(`3000 izrazov iz razredov AUDIT-026 (${comma ? "decimalna vejica" : "decimalna pika"}): kalkulatorja se ujemata`, () => {
    const r = rng(comma ? 17112026 : 26111017);
    const bad = [];
    for (let k = 0; k < 3000 && bad.length < 10; k++) {
      const text = genClass(r, comma);
      const g = graphValue(text, comma);
      const s = sciValue(text, comma);
      const ok = typeof g === "object" || typeof s === "object" ? JSON.stringify(g) === JSON.stringify(s) : same(g, s);
      if (!ok) bad.push(`${text} → graf ${JSON.stringify(g)}, znanstveni ${JSON.stringify(s)}`);
    }
    assert.deepEqual(bad, []);
  });
}

test("graf zapisa 2 se pretvori v zapis 3 z enakim pomenom (2e-1, + 10 %), namig ob »2e3x« (pregled #961)", async () => {
  const { upgradeZapis } = await import("../public/graph/model.js");
  const st = { zapis: 2, vejica: true, items: ["y = 2e-1", "y = x + 10 %", "y = 2,5e3x", "y = max(1,5; 2)", "y = 3E-2"].map((text, i) => ({ id: `i${i}`, type: "expr", text })) };
  const val = (s) => buildModel(s, { comma: true }).items.map((o) => toNum(o.fn ? o.fn(2) : o.value));
  const before = val(st);
  const up = upgradeZapis(st, true);
  assert.equal(up.zapis, ZAPIS);
  assert.deepEqual(up.items.map((i) => i.text), ["y = 2·e-1", "y = x + (10 %)", "y = 2,5e3x", "y = max(1,5; 2)", "y = 3·E-2"]);
  const after = val(up);
  before.forEach((b, i) => assert.ok(Number.isNaN(b) ? Number.isNaN(after[i]) : same(b, after[i]), `${st.items[i].text}: ${b} → ${after[i]}`));
  // star graf brez zapisa (blok GRAF): enako
  const old = { items: [{ id: "a", type: "expr", text: "y = 2e-1" }] };
  assert.ok(same(val(old)[0], val(upgradeZapis(old, true))[0]));
  // namig: pomen ostane 2·e·3·x
  const o = buildModel({ zapis: ZAPIS, items: [{ id: "a", type: "expr", text: "y = 2e3x" }] }, { comma: true }).items[0];
  assert.deepEqual(o.hint, { code: "eulerE", src: "2e3x", euler: "2·e·3·x", fix: "2e3·x" });
  assert.ok(same(toNum(o.fn(1)), 6 * Math.E));
  assert.equal(buildModel({ zapis: ZAPIS, items: [{ id: "a", type: "expr", text: "y = 2e3·x" }] }, { comma: true }).items[0].hint, undefined);
});
