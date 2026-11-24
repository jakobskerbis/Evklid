// AUDIT-005: decimalna vejica in »;« pomenita isto v grafičnem in znanstvenem kalkulatorju.
import test from "node:test";
import assert from "node:assert/strict";
import { buildModel, ZAPIS, migrateText, upgradeZapis, toNum } from "../public/graph/model.js";
import { evaluate } from "../public/graph/scicore.js";
import { parseCommand, runCas } from "../public/graph/cas.js";

const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} ≉ ${b}`);
const line = (text, { comma = true, zapis = ZAPIS } = {}) => buildModel({ zapis, items: [{ id: "a", type: "expr", text }] }, { comma }).items[0];

test("grafični kalkulator: sin(0,5) je sin 0,5 kot v znanstvenem (prej 0)", () => {
  near(evaluate("sin(0,5)", { comma: true }).value, Math.sin(0.5));
  near(line("y = sin(0,5)").fn(3), Math.sin(0.5));
  near(line("y = sin(0,5x)").fn(2), Math.sin(1));
  near(line("f(x) = sin(0,5x)").fn(2), Math.sin(1));
  const a = line("a = sin(0,5)");
  near(a.value, Math.sin(0.5));
  assert.equal(line("y = sin(0,5)").tex, "y = \\sin\\left(0{,}5\\right)");
});

test("grafični kalkulator: »;« loči argumente (prej napaka »;«), točka (1,5; 2)", () => {
  const m = line("y = max(1,5; 2)");
  assert.equal(m.kind, "y");
  near(m.fn(0), 2);
  near(line("y = max(1,5; 0,5)").fn(0), 1.5);
  near(line("y = nCr(5; 2)").fn(0), 10);
  const p = line("(1,5; 2)");
  assert.equal(p.kind, "points");
  assert.equal(p.tex, "\\left(1{,}5;\\ 2\\right)");
  assert.equal(line("(1, 5)").kind, "points"); // vejica s presledkom ostane ločilo
  assert.equal(line("f(x; y) = x + y").kind, "func");
  // dve decimalni vejici v enem številu ni seznam, ampak napaka (prej v znanstvenem tiho 1,2 · 0,3)
  assert.equal(line("y = [1,2,3]").kind, "error");
  assert.equal(evaluate("1,2,3", { comma: true }).error.code, "unexpected");
  assert.equal(evaluate("[1; 2; 3]", { comma: true }).error, undefined);
});

test("zapis s piko ostane, kot je bil", () => {
  assert.equal(line("(1,5)", { comma: false }).kind, "points");
  near(line("y = max(1,5)", { comma: false }).fn(0), 5);
  near(line("y = max(1.5; 2)", { comma: false }).fn(0), 2);
  near(evaluate("max(1,5)", { comma: false }).value, 5);
});

test("stari grafi in bloki GRAF (brez »zapis«) berejo vejico kot prej", () => {
  assert.equal(line("(1,5)", { zapis: null }).kind, "points");
  near(line("y = max(1,2)", { zapis: null }).fn(0), 2);
  near(line("y = 0,5x", { zapis: null }).fn(2), 1);
});

test("selitev starega zapisa: isti pomen, sin(0,5x) pa pomeni 0,5", () => {
  assert.equal(migrateText("(1,5)"), "(1, 5)");
  assert.equal(migrateText("y = max(1,2)"), "y = max(1, 2)");
  assert.equal(migrateText("y = 0,5x"), "y = 0,5x");
  assert.equal(migrateText("[1,2,3]"), "[1, 2, 3]");
  assert.equal(migrateText("y = sin(0,5x)"), "y = sin(0,5x)");
  assert.equal(migrateText("y = √(2,25)"), "y = √(2,25)");
  assert.equal(migrateText("cos(max(1,2))"), "cos(max(1, 2))");
  const s = upgradeZapis({ items: [{ id: "p", type: "expr", text: "(1,5)" }, { id: "q", type: "expr", text: "y = max(1,2) + sin(0,5x)" }, { id: "n", type: "note", text: "1,5" }] });
  assert.equal(s.zapis, ZAPIS);
  assert.deepEqual(s.items.map((i) => i.text), ["(1, 5)", "y = max(1, 2) + sin(0,5x)", "1,5"]);
  const m = buildModel(s, { comma: true });
  assert.equal(m.items[0].kind, "points");
  near(m.items[1].fn(2), 2 + Math.sin(1));
  assert.equal(upgradeZapis(s), s); // drugič nič
});

test("ukaz CAS: graf dobi pripravljeno besedilo, ne surovega sin(0,5x)", () => {
  const cmd = parseCommand("expand((x + 0,5)^2)");
  const r = runCas(cmd, { comma: true });
  assert.ok(r.plot?.length, JSON.stringify(r));
  const m = buildModel(upgradeZapis({ items: r.plot.map((text, i) => ({ id: `c${i}`, type: "expr", text })) }), { comma: true });
  near(toNum(m.items[0].fn(1)), 2.25);
});
