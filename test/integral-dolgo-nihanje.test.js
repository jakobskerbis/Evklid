// AUDIT-043: (1) dolg interval z nihanjem (∫(sin x; 0; 10⁴)) — ko številski izračun obupa, točna vrednost F(b) − F(a)
// iz nedoločenega integrala, če je F na [a, b] zvezna (prej »ni mogoče zanesljivo izračunati«, main pred #944 pravilno);
// (2) senčenje v grafu: novejše meje prekličejo starejši čakajoči izračun, ki se ne nabira.
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze } from "../public/graph/scisolve.js";
import { GraphView } from "../public/graph/plot.js";
import { parse, compile } from "../public/graph/math.js";

const ENV = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };

test("dolgi intervali z nihanjem in elementarnim F: točna vrednost (»=«)", () => {
  const CASES = [
    ["∫(sin(x);0;1e4)", 1 - Math.cos(1e4)],
    ["∫(cos(x);0;1e5)", Math.sin(1e5)],
    ["∫(sin(x);1e4;0)", Math.cos(1e4) - 1],
    ["∫(sin(x)^2;0;1e4)", 5000 - Math.sin(2e4) / 4],
    ["∫(cos(3x)+sin(7x);−1e4;1e4)", (2 * Math.sin(3e4)) / 3],
    ["∫(sin(1000x);0;100)", (1 - Math.cos(1e5)) / 1000],
    ["∫(sin(50x)·e^(−x);0;1000)", 50 / 2501],
    ["∫(x·sin(x);0;1e4)", Math.sin(1e4) - 1e4 * Math.cos(1e4)],
    ["∫(e^(−x)·sin(1000x);0;5000)", 1000 / 1000001],
  ];
  for (const [t, want] of CASES) {
    const r = analyze(t, ENV);
    assert.equal(r.kind, "value", `${t}: ${JSON.stringify(r)}`);
    assert.ok(Math.abs(r.value - want) <= 1e-9 * Math.max(1, Math.abs(want)), `${t}: ${r.value} ≠ ${want}`);
  }
});

test("brez F ali z neskončno mejo ostane »ni mogoče zanesljivo« (ne izmišljeno število)", () => {
  for (const t of ["∫(sin(1/x)/x;0;1)", "∫(sin(x);0;∞)", "∫(sin(x)/x;0;∞)"]) assert.equal(analyze(t, ENV).error?.code, "intUnknown", t);
  // predogled med tipkanjem točne poti ne poskuša (časovna meja)
  assert.ok(analyze("∫(sin(x);0;1e4)", { ...ENV, live: true }).error, "predogled");
});

test("pol in nihanje skupaj: nikoli »=« (F(b) − F(a) čez pol), ostane »ni mogoče zanesljivo« ali »ne obstaja«", () => {
  const DIV = [
    "∫(1/(x−1)+sin(x);0;1e4)",
    "∫(1/(x−2)+cos(x);0;1e4)",
    "∫(1/(x^2−1)+cos(x);−5000;5000)",
    "∫(x/(x^2−4)+sin(x);−1e4;1e4)",
    "∫(1/(x·ln(x))+sin(x);0.5;1e4)",
    "∫(1/(x−1)+sin(x)^2;0;1e4)",
    "∫(1/(x^2−1)+sin(1000x);−1e4;1e4)",
    "∫(1/(x^2−1)+cos(300x);−1e4;1e4)",
    "∫(1/(x^2−1)+sin(x)^2;−1e4;1e4)",
    "∫(x/(x^2−4)+sin(1000x);−1e4;1e4)",
    "∫(x/(x^2−4)+cos(300x);−1e4;1e4)",
    "∫(x/(x^2−4)+sin(x)^2;−1e4;1e4)",
    "∫(1/(x·ln(x))+sin(1000x);0.5;1e4)",
    "∫(1/(x·ln(x))+cos(300x);0.5;1e4)",
    "∫(1/(x·ln(x))+sin(x)^2;0.5;1e4)",
    "∫(tan(x)+sin(x);0;1e4)",
    "∫(1/x+cos(x);−1e4;1e4)",
  ];
  for (const t of DIV) {
    const r = analyze(t, ENV);
    assert.ok(r.error && ["intUnknown", "intDiverge", "intTimeout"].includes(r.error.code), `${t}: ${JSON.stringify(r)}`);
  }
  // zvezen F ostane točen: imenovalec brez ničle
  const r = analyze("∫(sin(x)·cos(x)/(1+sin(x)^2);0;1e4)", ENV);
  assert.ok(r.kind === "value" && !r.est && Math.abs(r.value - Math.log(1 + Math.sin(1e4) ** 2) / 2) < 1e-12, JSON.stringify(r));
});

test("nihajoč argument skoka (sign(sin x) na [0, 10⁴]): vsi skoki najdeni, mesta pravilna", () => {
  // 1591 polnih period, ostanek r = 3,4521762773 > π: 2π − r
  const r = analyze("∫(sign(sin(x));0;1e4)", ENV);
  const want = 2.8310090299016713;
  assert.ok(r.kind === "value" && r.est, JSON.stringify(r));
  const d = String(r.value).replace(/^-?0?\.?/, "").replace(".", "").length;
  assert.ok(Math.abs(r.value - want) <= 10 ** (Math.floor(Math.log10(Math.abs(r.value))) - d + 1), `${r.value} vs ${want}`);
});

test("senčenje: vlečenje meja ne nabira izračunov, zadnji se izvede enkrat", async () => {
  const calls = [];
  const realST = globalThis.setTimeout;
  const realCT = globalThis.clearTimeout;
  const timers = new Map();
  let id = 0;
  globalThis.setTimeout = (fn, ms) => (timers.set(++id, fn), id);
  globalThis.clearTimeout = (t) => timers.delete(t);
  try {
    const g = compile(parse("sin(10x)*sin(1/(x-7.5))"));
    const fn = (x) => g({ x });
    const ctx = new Proxy({}, { get: (o, k) => (k in o ? o[k] : () => {}), set: (o, k, v) => ((o[k] = v), true) });
    const view = Object.create(GraphView.prototype);
    const state = { view: { xmin: -4, xmax: 8, ymin: -5, ymax: 5 }, settings: {} };
    view.hooks = { fmt: (v) => String(v), label: (k) => k, getState: () => state };
    Object.assign(view, { X: (x) => x, Y: (y) => y, H: 400, handles: [], colorOf: () => "#000", draw: () => calls.push("draw") });
    const C = { bg: "#fff", text: "#000" };
    let scheduled = 0;
    for (const b of [8, 8.2, 8.4, 8.6]) {
      view.handles = [];
      const before = id;
      view.drawArea(ctx, { id: 1, kind: "y", fn, src: { tools: { area: [-3, b] } } }, C);
      scheduled += id - before;
    }
    assert.ok(scheduled >= 2, `poznejši izračuni: ${scheduled}`);
    // samo en čakajoč izračun (za zadnje meje), prejšnji so preklicani
    assert.ok(timers.size <= 1, `čakajočih: ${timers.size}`);
    // ko se meje umirijo, se izvede le zadnji in sproži eno risanje
    for (const fn of [...timers.values()]) fn();
    assert.ok(calls.length <= 1, `risanj: ${calls.length}`);
  } finally {
    globalThis.setTimeout = realST;
    globalThis.clearTimeout = realCT;
  }
});
