// »Pokaži na grafu«: rezultat znanstvenega kalkulatorja → vrstice grafičnega kalkulatorja (public/graph/v-graf.js).
// Vsaka vrstica mora v grafu (model.js, zapis 3) pomeniti isto kot v znanstvenem kalkulatorju.
import { test } from "node:test";
import assert from "node:assert/strict";
import { graphPlan, graphable, numText, toText } from "../public/graph/v-graf.js";
import { buildModel, emptyState, ZAPIS, toNum } from "../public/graph/model.js";
import { compileLine } from "../public/graph/scicore.js";

const ENV = { vars: {}, funcs: {}, ans: 0, angle: "rad", comma: true };
const G = { texts: [], deg: false, W: 360, H: 320 };
const plan = (text, env = {}, g = {}) => graphPlan(text, { ...ENV, ...env }, { ...G, ...g });

// graf iz načrta (kot calc.js showPlan): zapis 3 v zapisu števil kalkulatorja
function model(p, { comma = true, deg = false, before = [] } = {}) {
  const s = emptyState();
  s.zapis = ZAPIS;
  s.vejica = comma;
  s.settings.deg = p.deg ?? deg;
  s.items = [...before, ...p.items].map((it, i) => ({ id: `i${i}`, color: i, ...it }));
  return buildModel(s, { comma });
}
const fnOf = (o) => (x) => toNum(o.fn(x));
// vrednost izraza v znanstvenem kalkulatorju pri x
function sci(text, x, env = {}) {
  const e = { ...ENV, ...env };
  const line = compileLine(text, { vars: { ...(e.vars || {}), x }, funcs: e.funcs, deg: e.angle === "deg", grad: e.angle === "grad", comma: e.comma });
  return line.run(line.ast)(line.scope);
}
const close = (a, b, msg) => assert.ok(Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)), `${msg}: ${a} ≠ ${b}`);
const noErrors = (m) => assert.deepEqual(m.items.filter((o) => o.kind === "error").map((o) => [o.src.text, o.error]), []);

test("določeni integral: f in orodje Ploščina pod krivuljo na [a; b], okno okoli intervala", () => {
  const p = plan("∫(x²;0;1)");
  assert.equal(p.kind, "integral");
  assert.equal(p.items.length, 1);
  assert.deepEqual(p.items[0].tools, { area: [0, 1] });
  assert.equal(p.message, false);
  const m = model(p);
  noErrors(m);
  close(fnOf(m.items[0])(0.5), 0.25, "f(0,5)");
  assert.ok(p.view.xmin < 0 && p.view.xmax > 1 && p.view.xmax < 3, JSON.stringify(p.view));
});

test("integral z neskončno mejo: končno okno, osenčen le viden del, v opombi celoten integral", () => {
  const p = plan("∫(e^(−x);0;∞)");
  const [a, b] = p.items[0].tools.area;
  assert.equal(a, 0);
  assert.ok(Number.isFinite(b) && b >= 4 && b <= 64, String(b));
  assert.equal(p.note.key, "gc.fromSci.partArea");
  close(p.note.vars.v, 1, "celoten integral");
  assert.ok(Number.isFinite(p.view.xmax));
  const q = plan("∫(1/(1+x²);−∞;∞)");
  assert.ok(q.items[0].tools.area.every(Number.isFinite));
  close(q.note.vars.v, Math.PI, "∫ po vsej osi");
});

test("divergenten ali nedefiniran integral: f brez osenčene vrednosti, graf pokaže sporočilo kalkulatorja", () => {
  for (const t of ["∫(1/x;0;1)", "∫(1/x²;−1;1)", "∫(x;0;∞)"]) {
    const p = plan(t);
    assert.equal(p.kind, "integral", t);
    assert.equal(p.items[0].tools, undefined, t);
    assert.equal(p.message, true, t);
    noErrors(model(p));
  }
});

test("nedoločeni integral: f in F (C = 0) z imenoma; F' = f", () => {
  const p = plan("integriraj(3x² + 2x)");
  assert.equal(p.kind, "antiderivative");
  assert.match(p.items[0].text, /^f\(x\) = /);
  assert.match(p.items[1].text, /^F\(x\) = /);
  const m = model(p);
  noErrors(m);
  const F = fnOf(m.items[1]);
  close(F(2) - F(0), 12, "F(2) − F(0)");
  close(F(0), 0, "C = 0");
  // F' = f tudi pri zapisu z minusi (−x·cos x + sin x, −1/2·e^(−2x))
  for (const t of ["integriraj(sin(x)·x)", "integriraj(e^(−2x))", "integriraj(3x² − 2)"]) {
    const mm = model(plan(t));
    noErrors(mm);
    const [ff, FF] = [fnOf(mm.items[0]), fnOf(mm.items[1])];
    for (const x of [-1, 0.5, 2]) assert.ok(Math.abs((FF(x + 1e-5) - FF(x - 1e-5)) / 2e-5 - ff(x)) < 1e-5, `${t} pri ${x}`);
  }
  // imena, ki jih graf že ima, se ne podvojijo
  const q = plan("integriraj(x)", {}, { texts: ["f(x) = sin(x)", "F(x) = 1"] });
  assert.match(q.items[0].text, /^g\(x\)/);
  assert.match(q.items[1].text, /^G\(x\)/);
});

test("odvod: f z orodjem f′; odvod v točki: tangenta v a", () => {
  const p = plan("d/dx(x³)");
  assert.deepEqual(p.items[0].tools, { deriv: true });
  const q = plan("d/dx(x³; 2)");
  assert.equal(q.kind, "tangent");
  assert.deepEqual(q.items[0].tools, { tangent: 2 });
  assert.ok(q.view.xmin < 2 && q.view.xmax > 2);
  // |x| pri 0: odvoda ni, tangenta je narisana, kalkulator pove, zakaj
  assert.equal(plan("d/dx(|x|; 0)").message, true);
});

test("enačba: obe strani in realne rešitve kot točke; brez realnih rešitev opomba", () => {
  const p = plan("x² − 5x + 6 = 0");
  assert.equal(p.kind, "equation");
  assert.equal(p.items.length, 2); // L = 0: le y = L in ničle
  assert.equal(p.items[1].text, "[(2; 0); (3; 0)]");
  const q = plan("2x + 3 = 7");
  assert.deepEqual(q.items.map((i) => i.text), ["y = 2x + 3", "y = 7", "(2; 7)"]);
  const n = plan("x² + 1 = 0");
  assert.equal(n.items.length, 1);
  assert.equal(n.note.key, "sc.noReal");
  noErrors(model(p));
  // decimalna vejica ostane vejica, pika ostane pika (graf je v istem zapisu)
  assert.match(plan("2x = 5").items.at(-1).text, /2,5/);
  const d = plan("2x = 5", { comma: false });
  assert.match(d.items.at(-1).text, /2\.5/);
  noErrors(model(d, { comma: false }));
});

test("neenačba: senčenje (obstoječe senčenje neenačb), robovi v oknu", () => {
  const p = plan("x² < 4");
  assert.equal(p.kind, "inequality");
  const m = model(p);
  noErrors(m);
  const region = m.items.find((o) => o.kind === "region");
  assert.ok(region, m.items.map((o) => o.kind).join());
  assert.ok(region.cond(0, 5) && !region.cond(3, 0));
  assert.ok(p.view.xmin < -2 && p.view.xmax > 2);
});

test("sistem dveh enačb z x in y: obe krivulji in presečišča", () => {
  const p = plan("x + y = 3; x − y = 1");
  assert.equal(p.kind, "system");
  assert.equal(p.items.at(-1).text, "(2; 1)");
  const q = plan("x² + y² = 25; y = x + 1");
  const pts = q.items.at(-1).text;
  assert.match(pts, /\(-4; -3\)/);
  assert.match(pts, /\(3; 4\)/);
  noErrors(model(q));
  const none = plan("x² + y² = 1; y = 5");
  assert.equal(none.items.length, 2);
});

test("limita: f okoli a z oznako (a; L), prazen krožec, kjer f v a ni definirana", () => {
  const p = plan("lim_(x→0)(sin(x)/x)");
  assert.equal(p.kind, "limit");
  assert.equal(p.items[1].text, "(0; 1)");
  assert.equal(p.items[1].open, true);
  const q = plan("limita(x² + 1; x; 2)");
  assert.equal(q.items[1].open, false);
  assert.equal(q.items[1].text, "(2; 5)");
  // x → ∞: končno okno in črtkana asimptota y = L
  const r = plan("limita(1/x; x; ∞)");
  assert.equal(r.items[1].text, "y = 0");
  assert.equal(r.items[1].style, "dash");
  assert.ok(Number.isFinite(r.view.xmax) && r.view.xmax > 10);
  // limita ne obstaja: le f in sporočilo kalkulatorja
  const s = plan("limita(1/x; 0)");
  assert.equal(s.items.length, 1);
  assert.equal(s.message, true);
});

test("vsota in produkt: členi kot točke, opomba z vrednostjo; dolga vsota le prvi členi", () => {
  const p = plan("sum(k²; k; 1; 10)");
  assert.equal(p.kind, "sum");
  const m = model(p);
  noErrors(m);
  assert.equal(m.items[0].evalPoints().length, 10);
  assert.equal(p.note.vars.v, 385);
  const q = plan("sum(1/k²; k; 1; ∞)");
  assert.equal(q.note.key, "gc.fromSci.sumFirst");
  assert.equal(model(q).items[0].evalPoints().length, 60);
});

test("funkcija, poenostavitev in definicija: isti pomen kot v kalkulatorju (tudi odsekoma, Ans, spremenljivke, f(x))", () => {
  const env = { vars: { a: 2 }, funcs: { f: { param: "x", body: "x² + 1" } }, ans: 3 };
  for (const [t, ref] of [
    ["f(x) + a·x", "x² + 1 + 2x"],
    ["{x < 0: −x; x²}", "{x < 0: −x; x²}"],
    ["Ans·x − 1,5", "3x − 1,5"],
    ["e^(−x²/2)", "e^(−x²/2)"],
    ["3·10^(−7)·x", "0,0000003x"],
    ["poenostavi((x² − 1)/(x − 1))", "(x² − 1)/(x − 1)"],
    ["√(x) + ∛(x) + |x|", "√(x) + ∛(x) + |x|"],
  ]) {
    const p = plan(t, env);
    assert.ok(p, t);
    const m = model(p);
    noErrors(m);
    const f = fnOf(m.items[0]);
    for (const x of [-1.5, 0.25, 2, 3.7]) {
      const want = sci(ref, x);
      if (Number.isNaN(want)) assert.ok(Number.isNaN(f(x)), `${t} pri ${x}`);
      else close(f(x), want, `${t} pri ${x}`);
    }
  }
  // luknja poenostavitve ostane (x = 1 ni v definicijskem območju)
  assert.ok(Number.isNaN(fnOf(model(plan("poenostavi((x² − 1)/(x − 1))")).items[0])(1)));
  const d = plan("g(t) = t² − t");
  assert.match(d.items[0].text, /^g\(x\) = /);
});

test("DEG/RAD/GRA: graf kotnih funkcij pomeni isto kot kalkulator", () => {
  // graf brez kotnih funkcij dobi enoto kalkulatorja
  const p = plan("sin(x) = 0,5", { angle: "deg" });
  assert.equal(p.deg, true);
  assert.deepEqual(p.items.at(-1).text, "[(30; 0,5); (150; 0,5)]");
  assert.ok(p.view.ymax < 3, JSON.stringify(p.view)); // os y ni raztegnjena na stotine
  // graf že ima kotne funkcije v radianih: enota ostane, zapis pretvori
  for (const [angle, gdeg] of [["deg", false], ["rad", true], ["grad", false], ["grad", true]]) {
    const q = plan("sin(x) + arctan(x/50)", { angle }, { texts: ["y = cos(x)"], deg: gdeg });
    assert.equal(q.deg, undefined, `${angle}/${gdeg}`);
    const m = model(q, { deg: gdeg, before: [{ type: "expr", text: "y = cos(x)" }] });
    noErrors(m);
    const f = fnOf(m.items[1]);
    for (const x of [10, 45, 100]) close(f(x), sci("sin(x) + arctan(x/50)", x, { angle }), `${angle} graf ${gdeg ? "deg" : "rad"} pri ${x}`);
  }
  // odvodi in integrali so v kalkulatorju vedno v radianih
  const r = plan("∫(sin(x);0;π)", { angle: "deg" });
  assert.notEqual(r.deg, true);
  close(fnOf(model(r).items[0])(Math.PI / 2), 1, "sin v radianih");
});

test("osnovna šola: analiza (integral, odvod, limita, vsota) brez gumba, enačbe z gumbom", () => {
  assert.equal(plan("∫(x²;0;1)", {}, { simple: true }), null);
  assert.equal(plan("d/dx(x³)", {}, { simple: true }), null);
  assert.ok(plan("2x + 3 = 7", {}, { simple: true }));
  assert.equal(graphable({ kind: "value", text: "∫(x²;0;1)" }, { simple: true }), false);
  assert.equal(graphable({ kind: "solve", text: "2x+3=7" }, { simple: true }), true);
  assert.equal(graphable({ kind: "value", text: "2+3" }), false);
  assert.equal(graphable({ kind: "value", text: "∫(x²;0;1)" }), true);
});

test("brez grafa: navaden račun, kompleksno število, enačba s črkami", () => {
  for (const t of ["2 + 3", "(1 + 2i)(3 − i)", "a + b = c"]) assert.equal(plan(t), null, t);
});

test("zapis števil: brez »e«, vejica ali pika", () => {
  assert.equal(numText(2.5e-7, true), "2,5·10^(-7)");
  assert.equal(numText(0.1 + 0.2, true), "0,3");
  assert.equal(numText(-3, false), "-3");
  assert.equal(numText(Infinity), "∞");
  assert.throws(() => toText({ k: "int", a: { k: "var", name: "x" }, v: "x" }, { comma: true, unit: "rad", used: {} }));
});
