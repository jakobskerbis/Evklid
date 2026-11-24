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
