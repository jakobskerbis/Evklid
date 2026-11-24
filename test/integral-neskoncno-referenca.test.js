// AUDIT-008, 2. krog (in AUDIT-024): neskončne meje in zelo dolgi intervali v jedru z oceno napake.
// Rep od X0 naprej računamo v u = 1/x (asimptotika ob u = 0: 1/x^1,001 obstaja, 1/x ne), vrhove daleč od 0 najde
// gosto tipanje. Referenčne vrednosti: mpmath (30 mest) oziroma SymPy; seznam je nespremenljiv.
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze } from "../public/graph/scisolve.js";
import { evaluate } from "../public/graph/scicore.js";
import sl from "../public/i18n/sl.js";
import fs from "node:fs";

const ENV = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };

// [vnos, vrednost | "div" | "unk"]
const REF_INFINITE = [
  ["∫(1/x^2;1;∞)", 1],
  ["∫(1/(1+x^2);−∞;∞)", 3.141592653589793],
  ["∫(e^(−x^2);−∞;∞)", 1.772453850905516],
  ["∫(1/x^1,001;1;∞)", 1000],
  ["∫(1/x^1,0001;1;∞)", 10000],
  ["∫(1/(x·ln(x));2;∞)", "div"],
  ["∫(1/(x·ln(x)^1,01);2;∞)", 100.3671854005107],
  ["∫(1/(x·ln(x)^2);2;∞)", 1.4426950408889634],
  ["∫(e^(−(x−100)^2);−∞;∞)", 1.772453850905516],
  ["∫(e^(−(x−1000)^2);0;∞)", 1.772453850905516],
  ["∫(e^(−x)·sin(100x);0;∞)", 0.009999000099990002],
  ["∫(e^(−x)·sin(1000x);0;∞)", 0.000999999000001],
  ["∫(sin(x)/(x·(1+x^2));−∞;∞)", 1.9858653037988716],
  ["∫(1/x^2+sin(x)/x^3;1;∞)", 1.3785300171241612],
  ["∫(x^20·e^(−x);0;∞)", 2432902008176640000],
  ["∫(x^30·e^(−x);0;∞)", 2.6525285981219107e+32],
  ["∫(e^(x^2);0;∞)", "div"],
  ["∫(x^5;−∞;∞)", "div"],
  ["∫(e^x;0;∞)", "div"],
  ["∫(1/x;1;∞)", "div"],
  ["∫(1;0;∞)", "div"],
  ["∫(sin(x)/x;0;∞)", "unk"],
  ["∫(sin(x);0;∞)", "unk"],
  ["∫(1/(1+x^2);0;1e300)", 1.5707963267948966],
  ["∫(e^(−x^2);−1e10;1e10)", 1.772453850905516],
  ["∫(e^(−x)/√(x);0;∞)", 1.772453850905516],
  ["∫(ln(x)/(1+x^2);0;∞)", 0],
  ["∫(sin(x)/x^2;1;∞)", 0.5040670619069284],
  ["∫(x^2·e^(−x^2);−∞;∞)", 0.886226925452758],
  ["∫(1/(1+x^4);−∞;∞)", 2.221441469079183],
  ["∫(x/(e^x−1);0;∞)", 1.6449340668482264],
  ["∫(e^(−x)·ln(x);0;∞)", -0.5772156649015329],
  ["∫(1/(1+x)^2;0;∞)", 1],
  ["∫(e^(−x)·cos(x);0;∞)", 0.5],
  ["∫(cos(x)/(1+x^2);0;∞)", 0.5778636748954609],
  ["∫(e^x;−∞;0)", 1],
  ["∫(1/√(x);1;∞)", "div"],
  ["∫(1/(x·√(x));1;∞)", 2],
  ["∫(x·e^(−x^2);0;∞)", 0.5],
  ["∫(1/(e^x+e^(−x));−∞;∞)", 1.5707963267948966],
  ["∫(1/(x^2+2x+2);−∞;∞)", 3.141592653589793],
  ["∫(e^(−abs(x));−∞;∞)", 2],
  ["∫(1/(√(x)·(1+x));0;∞)", 3.141592653589793],
  ["∫(sin(x)^2/x^2;−∞;∞)", 3.141592653589793],
  ["∫(x^3;0;∞)", "div"],
  ["∫(ln(x);1;∞)", "div"],
  ["∫(atan(x)/x^2;1;∞)", 1.131971753677421],
  ["∫(1/x^2;−∞;−1)", 1],
  ["∫(e^(2x);−∞;1)", 3.694528049465325],
  ["∫(1/(x^2·ln(x)^2);2;∞)", 0.34267647738339374],
  ["∫(x^2/(1+x^4);0;∞)", 1.1107207345395915],
];

const sig = (v) => String(Math.abs(v)).replace(/e.*$/, "").replace(".", "").replace(/^0+/, "").length;
function digitsOk(r, want, d) {
  if (!r || r.kind !== "value" || !Number.isFinite(r.value)) return false;
  const v = r.value;
  if (!r.est) return Math.abs(v - want) <= 1e-12 * Math.max(1, Math.abs(want));
  if (v === 0) return Math.abs(want) < 1e-9;
  const e = Math.floor(Math.log10(Math.abs(v)));
  return Math.abs(v - want) <= 10 ** (e - (d || sig(v)) + 1);
}
function check(t, want) {
  const r = analyze(t, ENV);
  if (want === "div") return [r?.error?.code === "intDiverge", r];
  if (want === "unk") return [r?.error?.code === "intUnknown" || r?.error?.code === "intTimeout", r];
  return [digitsOk(r, want, r?.est ? evaluate(t, ENV).digits : undefined), r];
}

test("referenčni integrali z neskončno mejo (mpmath): pravilna mesta, »ne obstaja«, »ni mogoče zanesljivo«", () => {
  assert.ok(REF_INFINITE.length >= 50);
  const bad = [];
  for (const [t, want] of REF_INFINITE) {
    const [ok, r] = check(t, want);
    if (!ok) bad.push(`${t}: ${JSON.stringify(r)} ≠ ${want}`);
  }
  assert.deepEqual(bad, []);
});

test("pregled #950: 1/x^1,001 = 1000, logaritemski repi, ozki vrhovi, 20!, pravo sporočilo", () => {
  assert.equal(analyze("∫(1/x^1,001;1;∞)", ENV).value, 1000);
  assert.ok(Math.abs(analyze("∫(1/x^1,0001;1;∞)", ENV).value - 10000) < 1e-8);
  assert.equal(analyze("∫(1/(x·ln(x));2;∞)", ENV).error?.code, "intDiverge");
  for (const [t, w] of [
    ["∫(e^(−(x−100)^2);−∞;∞)", Math.sqrt(Math.PI)],
    ["∫(e^(−(x−1000)^2);0;∞)", Math.sqrt(Math.PI)],
    ["∫(x^20·e^(−x);0;∞)", 2432902008176640000],
    ["∫(e^(−x)·sin(100x);0;∞)", 100 / 10001],
    ["∫(sin(x)/(x·(1+x^2));−∞;∞)", Math.PI * (1 - Math.exp(-1))],
  ])
    assert.ok(check(t, w)[0], `${t}: ${JSON.stringify(analyze(t, ENV))}`);
  for (const t of ["∫(1/x;1;∞)", "∫(1;0;∞)", "∫(x^5;−∞;∞)"]) {
    const r = analyze(t, ENV);
    assert.equal(r.error?.code, "intDiverge", t);
    assert.equal(r.error.info.inf, true, `${t}: sporočilo o neskončnem intervalu, ne o polu`);
  }
  assert.equal(analyze("∫(1/x;0;1)", ENV).error.info.inf, undefined);
});

test("AUDIT-024: zelo dolgi intervali (prej 5,17·10⁻²³ in 0)", () => {
  assert.ok(check("∫(1/(1+x^2);0;1e300)", Math.PI / 2)[0]);
  assert.ok(check("∫(e^(−x^2);−1e10;1e10)", Math.sqrt(Math.PI))[0]);
});

test("brez zamrznitve: predogled ≤ ~50 ms, Izračunaj ≤ ~1 s", () => {
  for (const t of ["∫(x^20·e^(−x);0;∞)", "∫(x^30·e^(−x);0;∞)", "∫(e^(x^2);0;∞)", "∫(x^5;−∞;∞)", "∫(e^x;0;∞)", "∫(sin(x)^2/x^2;−∞;∞)"]) {
    let t0 = performance.now();
    evaluate(t, { ...ENV, live: true });
    assert.ok(performance.now() - t0 < 200, `${t} predogled ${performance.now() - t0} ms`);
    t0 = performance.now();
    analyze(t, ENV);
    assert.ok(performance.now() - t0 < 1500, `${t} ${performance.now() - t0} ms`);
  }
});

test("sporočilo za neskončni interval je v vseh 33 jezikih", () => {
  assert.match(sl["sc.errIntDivergeInf"], /neskončnem intervalu/);
  const dir = new URL("../public/i18n/ui/", import.meta.url);
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const j = JSON.parse(fs.readFileSync(new URL(f, dir), "utf8"));
    assert.ok(j["sc.errIntDivergeInf"] && j["sc.errIntDivergeInf"] !== sl["sc.errIntDivergeInf"], f);
  }
});

// ---------- 3. krog ----------
test("x^n·e^(−x) do ∞: n! tudi pri velikih n (∞·0 v repu), sicer »ni mogoče zanesljivo«, nikoli »—«", () => {
  const fact = (n) => {
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  };
  for (const n of [33, 35, 40, 50, 70]) assert.ok(check(`∫(x^${n}·e^(−x);0;∞)`, fact(n))[0], `n = ${n}: ${JSON.stringify(analyze(`∫(x^${n}·e^(−x);0;∞)`, ENV))}`);
  for (const n of [100, 150]) {
    const r = analyze(`∫(x^${n}·e^(−x);0;∞)`, ENV);
    assert.ok(r.error?.code === "intUnknown" || check(`∫(x^${n}·e^(−x);0;∞)`, fact(n))[0], `n = ${n}: ${JSON.stringify(r)}`);
  }
});

test("sestavljen izraz z integralom do ∞: le zanesljiva mesta", () => {
  const r = evaluate("∫(abs(sin(x))/x^2;1;∞)·2", ENV);
  assert.ok(r.error?.code === "intTimeout" || (r.est && digitsOk({ kind: "value", ...r }, 1.5488598147, r.digits)), JSON.stringify(r));
});
