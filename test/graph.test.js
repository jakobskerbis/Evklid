import test from "node:test";
import assert from "node:assert/strict";
import { parse, compile, diff, simplify, toTex, fromTex, plottableFromText, niceNumber, integrate, normalize } from "../public/graph/math.js";
import { buildModel, emptyState, specialPoints, intersections, regression, toNum } from "../public/graph/model.js";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const val = (src, vars = {}, ctx = {}) => toNum(compile(parse(src), ctx)(vars));
const near = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) <= eps * (1 + Math.abs(b)), `${a} ≉ ${b}`);

test("parser: implicit multiplication, unicode and decimal comma", () => {
  near(val("2x", { x: 3 }), 6);
  near(val("2(x+1)", { x: 3 }), 8);
  near(val("(x+1)(x-1)", { x: 3 }), 8);
  near(val("sinx", { x: 0.5 }), Math.sin(0.5));
  near(val("2sin(x)cos(x)", { x: 0.3 }), Math.sin(0.6));
  near(val("x²", { x: 4 }), 16);
  near(val("√9 + 2π"), 3 + 2 * Math.PI);
  near(val("3·2 − 1"), 5);
  near(val("1,5 + 1"), 2.5);
  near(val("-x^2", { x: 3 }), -9);
  near(val("2^-1"), 0.5);
  near(val("|x - 5|", { x: 2 }), 3);
  near(val("log_2(8)"), 3);
  near(val("ln(e)"), 1);
  near(val("5!"), 120);
  near(val("sin(90)", {}, { deg: true }), 1);
  assert.equal(normalize("x² ≤ 3"), "x^(2) <= 3");
});

test("parser: piecewise, sums, integrals and derivatives inside expressions", () => {
  const pw = "{x < 0: -x, x^2}";
  near(val(pw, { x: -2 }), 2);
  near(val(pw, { x: 3 }), 9);
  near(val("∑_(n=1)^(4) n"), 10);
  near(val("∫_0^1 x^2 dx"), 1 / 3);
  near(val("d/dx(x^3)", { x: 2 }), 12);
});

test("toTex renders readable LaTeX", () => {
  assert.equal(toTex(parse("x^2")), "x^{2}");
  assert.match(toTex(parse("sqrt(x)")), /\\sqrt\{x\}/);
  assert.match(toTex(parse("x/2")), /\\frac\{x\}\{2\}/);
  assert.match(toTex(parse("y <= 2x")), /\\le/);
  assert.match(toTex(parse("r = sin(4θ)")), /\\theta/);
});

test("symbolic derivatives match numeric ones", () => {
  const cases = ["x^3 - 3x", "sin(x)cos(x)", "e^(2x)", "ln(x^2 + 1)", "sqrt(x)", "x/(x+1)", "2^x", "tan(x)", "x sin(x)"];
  for (const src of cases) {
    const d = simplify(diff(parse(src), "x"));
    const f = compile(parse(src));
    const g = compile(d);
    for (const x of [0.4, 1.3, 2.1]) {
      const h = 1e-5;
      const num = (toNum(f({ x: x + h })) - toNum(f({ x: x - h }))) / (2 * h);
      near(toNum(g({ x })), num, 1e-4);
    }
  }
});

test("adaptive integration", () => {
  near(integrate(Math.sin, 0, Math.PI), 2);
  near(integrate((x) => x * x, -1, 2), 3);
  near(integrate((x) => 1 / (1 + x * x), 0, 1), Math.PI / 4);
});

const model = (texts, extra = {}) => {
  const s = emptyState();
  s.items = texts.map((t, i) => ({ id: `i${i}`, type: "expr", text: t, color: i }));
  Object.assign(s, extra);
  return buildModel(s);
};

test("model: classifies every kind of expression", () => {
  const m = model(["y = x^2", "x = 2", "r = sin(4θ)", "(cos(t), sin(t))", "x^2 + y^2 = 9", "y > 2x", "(1, 2)", "a = 3", "f(x) = a x", "f(2)", "", "x^2"]);
  const kinds = m.items.map((o) => o.kind);
  assert.deepEqual(kinds, ["y", "x", "polar", "param", "implicit", "ineq-y", "points", "slider", "func", "value", "empty", "y"]);
  near(toNum(m.items[9].value), 6);
  near(toNum(m.items[0].fn(3)), 9);
});

test("model: missing variables, cycles and duplicates are reported", () => {
  const m = model(["y = kx + n", "a = b", "b = a", "c = 1", "c = 2"]);
  assert.equal(m.items[0].kind, "error");
  assert.equal(m.items[0].error.code, "missing");
  assert.deepEqual([...m.items[0].error.info.names].sort(), ["k", "n"]);
  assert.equal(m.items[1].kind, "error");
  assert.equal(m.items[4].kind, "error");
  assert.equal(m.items[4].error.code, "twice");
});

test("model: sliders feed functions", () => {
  const m = model(["k = 2", "y = kx"]);
  assert.equal(m.items[0].kind, "slider");
  near(toNum(m.items[1].fn(3)), 6);
});

test("special points: roots, extrema, y-intercept; no fake roots at asymptotes", () => {
  const pts = specialPoints((x) => x ** 3 - 3 * x, -3, 3);
  const roots = pts.filter((p) => p.type === "root").map((p) => p.x).sort((a, b) => a - b);
  assert.equal(roots.length, 3);
  near(roots[0], -Math.sqrt(3), 1e-6);
  near(roots[1], 0, 1e-6);
  near(roots[2], Math.sqrt(3), 1e-6);
  const max = pts.find((p) => p.type === "max");
  const min = pts.find((p) => p.type === "min");
  near(max.x, -1, 1e-5);
  near(max.y, 2, 1e-6);
  near(min.x, 1, 1e-5);
  assert.ok(pts.some((p) => p.type === "yint"));

  const tan = specialPoints(Math.tan, -2, 2);
  const tanRoots = tan.filter((p) => p.type === "root");
  assert.equal(tanRoots.length, 1);
  assert.ok(!tan.some((p) => p.type === "max" || p.type === "min"));
});

test("intersections of two curves", () => {
  const xs = intersections((x) => x * x, (x) => x + 2, -5, 5)
    .map((p) => p.x)
    .sort((a, b) => a - b);
  assert.equal(xs.length, 2);
  near(xs[0], -1, 1e-6);
  near(xs[1], 2, 1e-6);
});

test("regression fits known data", () => {
  const xs = [1, 2, 3, 4, 5];
  const lin = regression(xs, xs.map((x) => 2 * x + 1), "lin");
  near(lin.p[0], 2);
  near(lin.p[1], 1);
  near(lin.r2, 1);
  const quad = regression(xs, xs.map((x) => x * x - x), "quad");
  near(quad.fn(6), 30, 1e-6);
  const ex = regression(xs, xs.map((x) => 3 * Math.exp(0.5 * x)), "exp");
  near(ex.fn(2), 3 * Math.E, 1e-6);
});

test("tables become points and regression in the model", () => {
  const s = emptyState();
  s.items = [{ id: "t", type: "table", reg: "lin", cols: [{ name: "x_1", values: [1, 2, 3] }, { name: "y_1", values: [3, 5, 7] }] }];
  const m = buildModel(s);
  const t = m.items[0];
  assert.equal(t.series[0].length, 3);
  near(t.fit.fn(10), 21);
});

test("fromTex and plottableFromText pick graphs from tutor text", () => {
  near(val(fromTex("\\frac{x^{2}}{2}"), { x: 4 }), 8);
  near(val(fromTex("\\sqrt{x}+\\left(x\\right)"), { x: 9 }), 12);
  const found = plottableFromText("Nariši $y = 2x + 1$ in $f(x) = x^2 - 4$. Rešitev je $x = 3$, ploščina $S = 5$.");
  assert.ok(found.length >= 2);
  assert.ok(found.some((s) => s.replace(/\s/g, "") === "y=2x+1"));
  assert.ok(!found.some((s) => /S/.test(s)));
});

test("niceNumber hides float noise and uses decimal comma", () => {
  assert.equal(niceNumber(0.1 + 0.2), "0,3");
  assert.equal(niceNumber(2.5, { comma: false }), "2.5");
});

test("saved graphs API: create, list, update, delete; per student", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { streamFn: async () => ({ text: "", content: [] }) });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, method = "GET", body) => {
    const r = await fetch(base + path, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    return { status: r.status, body: await r.json() };
  };
  try {
    const a = (await call("/api/students", "POST", { name: "Ana" })).body;
    const b = (await call("/api/students", "POST", { name: "Bor" })).body;
    const state = emptyState();
    state.items[0].text = "y = x^2";
    assert.equal((await call(`/api/students/${a.id}/graphs`, "POST", { title: "  Parabola  ", data: { foo: 1 } })).status, 400);
    const made = await call(`/api/students/${a.id}/graphs`, "POST", { title: "  Parabola  ", data: state, thumb: "javascript:alert(1)" });
    assert.equal(made.status, 201);
    assert.equal(made.body.title, "Parabola");
    const list = (await call(`/api/students/${a.id}/graphs`)).body;
    assert.equal(list.length, 1);
    assert.equal(list[0].thumb, null);
    const one = (await call(`/api/students/${a.id}/graphs/${made.body.id}`)).body;
    assert.equal(one.data.items[0].text, "y = x^2");
    // drug učenec ne vidi grafa
    assert.equal((await call(`/api/students/${b.id}/graphs/${made.body.id}`)).status, 404);
    assert.equal((await call(`/api/students/${b.id}/graphs`)).body.length, 0);
    state.items[0].text = "y = x^3";
    assert.equal((await call(`/api/students/${a.id}/graphs/${made.body.id}`, "PUT", { title: "Kubična", data: state })).status, 200);
    assert.equal((await call(`/api/students/${a.id}/graphs/${made.body.id}`)).body.data.items[0].text, "y = x^3");
    assert.equal((await call(`/api/students/${a.id}/graphs/${made.body.id}`, "DELETE")).status, 200);
    assert.equal((await call(`/api/students/${a.id}/graphs`)).body.length, 0);
  } finally {
    server.close();
  }
});

test("plottableFromText: \\iff splits two forms, a bare domain x > 0 next to a curve is dropped (j 4. 11.)", () => {
  const found = plottableFromText("Zapišemo $y = \\log_{10}(x) \\iff 10^y = x$, kjer je $x > 0$.");
  assert.ok(found.includes("y = log_(10)(x)"), JSON.stringify(found));
  assert.ok(!found.some((s) => /^x\s*>/.test(s)), JSON.stringify(found));
  assert.deepEqual(plottableFromText("Rešitev: $x > 0$"), ["x > 0"]);
});
