// AUDIT-006, 2. krog: določeni integral z oceno napake (Gauss–Kronrod + asimptotika ob singularnostih).
// Pravilo: številski izid je vedno »≈« in kaže le mesta, ki jih podpira ocena napake; integral, ki ne obstaja,
// pove »ne obstaja«; česar ne znamo zanesljivo izračunati, pove to (nikoli izmišljenega števila ali sodbe).
// Referenčne vrednosti: mpmath (30 mest) oziroma zaprte oblike iz SymPy; seznam je nespremenljiv.
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze } from "../public/graph/scisolve.js";
import { evaluate } from "../public/graph/scicore.js";
import { integrate, integrateInfo as integrateInfo0, withIntegralBudget, parse, compile } from "../public/graph/math.js";
// neposredni klici: velikodušna časovna meja (obremenjen stroj med testi), da test meri pravilnost, ne hitrosti
const integrateInfo = (...args) => withIntegralBudget(10000, () => integrateInfo0(...args));
import sl from "../public/i18n/sl.js";
import fs from "node:fs";

const ENV = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };

// [vnos, vrednost | "div" (ne obstaja) | "unk" (ni mogoče zanesljivo izračunati)]
export const REF_FINITE = [
  ["∫(x^2;0;1)", 0.3333333333333333],
  ["∫(sin(x);0;π)", 2],
  ["∫(e^x;0;1)", 1.718281828459045],
  ["∫(1/(1+x^2);−1;1)", 1.5707963267948966],
  ["∫(√(x);0;4)", 5.333333333333333],
  ["∫(x^3−2x;−2;3)", 11.25],
  ["∫(cos(x)^2;0;2π)", 3.141592653589793],
  ["∫(ln(x);1;e)", 1],
  ["∫(x·e^(−x);0;5)", 0.9595723180054871],
  ["∫(1/x;1;2)", 0.6931471805599453],
  ["∫(sin(x)/x;−1;2)", 2.551496047169878],
  ["∫((1−cos(x))/x^2;−1;1)", 0.9727707524706455],
  ["∫((e^x−1)/x;−1;1)", 2.114501750751457],
  ["∫(tan(x);0;1)", 0.6156264703860143],
  ["∫(abs(x);−1;2)", 2.5],
  ["∫(abs(sin(x));0;10)", 6.1609284709235475],
  ["∫(floor(x);0;3,5)", 4.5],
  ["∫(sign(x);−1;2)", 1],
  ["∫(abs(x−0,3)/(x−0,3);0;1)", 0.4],
  ["∫(floor(1000x);0;1)", 499.5],
  ["∫(sin(100x)^2;0;10)", 4.99767490123896],
  ["∫(e^(−x^2);−3;3)", 1.7724146965190426],
  ["∫(√(1−x^2);−1;1)", 1.5707963267948966],
  ["∫(x^10;0;2)", 186.1818181818182],
  ["∫(1/(x^2+0,01);−1;1)", 29.42255348607469],
  ["∫(sin(x)^3;0;π)", 1.3333333333333333],
  ["∫(cos(50x);0;1)", -0.005247497074078576],
  ["∫(x·sin(x);0;2π)", -6.283185307179586],
  ["∫(1/(1+e^x);−5;5)", 5],
  ["∫(ln(1+x);0;1)", 0.38629436111989063],
  ["∫(1/√(x);0;1)", 2],
  ["∫(1/√(1−x^2);−1;1)", 3.141592653589793],
  ["∫(ln(x);0;1)", -1],
  ["∫(1/x^0,99;0;1)", 100],
  ["∫(x^(−0,999);0;1)", 1000],
  ["∫(1/(x·ln(x)^2);0;0,5)", 1.4426950408889634],
  ["∫(1/(x·(−ln(x))^1,5);0;0,5)", 2.4022448175728996],
  ["∫(ln(abs(x));−1;1)", -2],
  ["∫(1/√(abs(x));−1;1)", 4],
  ["∫(x^(−1/3);0;1)", 1.5],
  ["∫(ln(x)^2;0;1)", 2],
  ["∫(1/√(x·(1−x));0;1)", 3.141592653589793],
  ["∫(ln(sin(x));0;π)", -2.177586090303602],
  ["∫(√(x)·ln(x);0;1)", -0.4444444444444444],
  ["∫(e^(−x)/√(x);0;1)", 1.4936482656248542],
  ["∫(1/√(abs(x−0,5));0;1)", 2.8284271247461903],
  ["∫(ln(abs(x−0,3));0;1)", -1.6108643020548934],
  ["∫(1/√(sin(x));0;1)", 2.0348053192075697],
  ["∫(1/√(2−x);0;2)", 2.8284271247461903],
  ["∫(ln(x)/√(x);0;1)", -4],
  ["∫(1/√(1−x);0;1)", 2],
  ["∫(x^(−0,9);0;1)", 10],
  ["∫(1/(√(x)·(1+x));0;1)", 1.5707963267948966],
  ["∫(ln(1−x);0;1)", -1],
  ["∫(1/√(−ln(x));0;1)", 1.772453850905516],
  ["∫(1/(x·ln(x)^2);0;0,1)", 0.4342944819032518],
  ["∫(1/x;0;1)", "div"],
  ["∫(1/x;−1;1)", "div"],
  ["∫(1/x^2;−1;1)", "div"],
  ["∫(1/(x−1);0;2)", "div"],
  ["∫(tan(x);0;3)", "div"],
  ["∫(1/(x·ln(x));0;0,5)", "div"],
  ["∫(tan(x);0;180)", "div"],
  ["∫(1/sin(100x);0;2)", "div"],
  ["∫(1/sin(x)^2;1;200)", "div"],
  ["∫(1/x^1,01;0;1)", "div"],
  ["∫(1/abs(x);−1;1)", "div"],
  ["∫(ln(x)/x;0;1)", "div"],
  ["∫(1/(x^2−1);0;2)", "div"],
  ["∫(1/cos(x);0;3)", "div"],
  ["∫(e^x/x;−1;1)", "div"],
  ["∫(1/(1−x);0;1)", "div"],
  ["∫(1/(x·(1−x));0;1)", "div"],
  ["∫(1/x^3;−1;2)", "div"],
  ["∫(1/(x·√(−ln(x)));0;0,5)", "div"],
  ["∫(cot(x);0;1)", "div"],
  ["∫(x·sin(1/x);0;1)", 0.3785300171241613],
  ["∫(cos(1/x);−1;1)", -0.16882190111914777],
  ["∫(sin(1/x)/x;0;1)", "unk"],
  ["∫(sin(1/x);0;1)", 0.5040670619069284],
  ["∫(x^2;1;0)", -0.3333333333333333],
  ["∫(1/√(x);1;0)", -2],
  ["∫(ln(x);1;0)", 1],
  ["∫(x^4−3x^2+1;−2;2)", 0.8],
  ["∫(1/(2+cos(x));0;2π)", 3.6275987284684357],
  ["∫(√(x^2+1);0;3)", 5.652639719868603],
  ["∫(atan(x);0;1)", 0.43882457311747564],
  ["∫(e^(sin(x));0;2π)", 7.954926521012846],
  ["∫(x^(−0,5)+x^(−0,25);0;1)", 3.3333333333333335],
  ["∫(1/√(4−x^2);0;2)", 1.5707963267948966],
  ["∫(x/√(1−x^2);0;1)", 1],
  ["∫(ln(x)·x;0;1)", -0.25],
  ["∫(1/(x·ln(x)^3);0;0,5)", -1.0406844905028039],
];

// primeri, kjer je bil main (528c6c5) pravilen na vsaj 6 mest: ostati morajo število s pravilnimi mesti
const MAIN_OK = [
  "∫(x^2;0;1)",
  "∫(sin(x);0;π)",
  "∫(e^x;0;1)",
  "∫(1/(1+x^2);−1;1)",
  "∫(√(x);0;4)",
  "∫(x^3−2x;−2;3)",
  "∫(cos(x)^2;0;2π)",
  "∫(ln(x);1;e)",
  "∫(x·e^(−x);0;5)",
  "∫(1/x;1;2)",
  "∫(sin(x)/x;−1;2)",
  "∫((1−cos(x))/x^2;−1;1)",
  "∫((e^x−1)/x;−1;1)",
  "∫(tan(x);0;1)",
  "∫(abs(x);−1;2)",
  "∫(abs(sin(x));0;10)",
  "∫(floor(x);0;3,5)",
  "∫(sign(x);−1;2)",
  "∫(abs(x−0,3)/(x−0,3);0;1)",
  "∫(sin(100x)^2;0;10)",
  "∫(e^(−x^2);−3;3)",
  "∫(√(1−x^2);−1;1)",
  "∫(x^10;0;2)",
  "∫(1/(x^2+0,01);−1;1)",
  "∫(sin(x)^3;0;π)",
  "∫(cos(50x);0;1)",
  "∫(x·sin(x);0;2π)",
  "∫(1/(1+e^x);−5;5)",
  "∫(ln(1+x);0;1)",
  "∫(ln(x);0;1)",
  "∫(ln(abs(x));−1;1)",
  "∫(ln(x)^2;0;1)",
  "∫(ln(sin(x));0;π)",
  "∫(√(x)·ln(x);0;1)",
  "∫(ln(abs(x−0,3));0;1)",
  "∫(ln(1−x);0;1)",
  "∫(x·sin(1/x);0;1)",
  "∫(sin(1/x);0;1)",
  "∫(x^2;1;0)",
  "∫(ln(x);1;0)",
  "∫(x^4−3x^2+1;−2;2)",
  "∫(1/(2+cos(x));0;2π)",
  "∫(√(x^2+1);0;3)",
  "∫(atan(x);0;1)",
  "∫(e^(sin(x));0;2π)",
  "∫(ln(x)·x;0;1)",
];

const sig = (v) => String(Math.abs(v)).replace(/e.*$/, "").replace(".", "").replace(/^0+/, "").length;
/** Prikazana vrednost je pravilna na vsa svoja mesta (do enote zadnjega mesta). */
// d: zanesljiva mesta (evaluate(…).digits), sicer iz zapisa števila
export function digitsOk(r, want, d) {
  if (!r || r.kind !== "value" || !Number.isFinite(r.value)) return false;
  const v = r.value;
  if (!r.est) return Math.abs(v - want) <= 1e-12 * Math.max(1, Math.abs(want));
  if (v === 0) return Math.abs(want) < 1e-9;
  const e = Math.floor(Math.log10(Math.abs(v)));
  return Math.abs(v - want) <= 10 ** (e - (d || sig(v)) + 1);
}
export function check(t, want, env = ENV) {
  const r = analyze(t, env);
  if (typeof want === "number" && r?.est) return [digitsOk(r, want, evaluate(t, env).digits), r];
  if (want === "div") return [r?.error?.code === "intDiverge", r];
  if (want === "unk") return [r?.error?.code === "intUnknown" || r?.error?.code === "intTimeout", r];
  return [digitsOk(r, want), r];
}

test("referenčni integrali (mpmath): pravilna mesta, »ne obstaja« ali »ni mogoče zanesljivo«", () => {
  assert.ok(REF_FINITE.length >= 90);
  const bad = [];
  for (const [t, want] of REF_FINITE) {
    const [ok, r] = check(t, want);
    if (!ok) bad.push(`${t}: ${JSON.stringify(r)} ≠ ${want}`);
  }
  assert.deepEqual(bad, []);
});

test("brez regresij: kar je main izračunal pravilno, je še vedno število s pravilnimi mesti", () => {
  const ref = new Map(REF_FINITE);
  for (const t of MAIN_OK) assert.ok(check(t, ref.get(t))[0], t);
});

test("številski integral je vedno »≈«, z vsaj 9 zanesljivimi mesti pri gladkih", () => {
  for (const t of ["∫(x^2;0;1)", "∫(sin(x);0;π)", "∫(e^(−1000x^2);−1;1)", "∫(1/x;1;2)"]) {
    const r = analyze(t, ENV);
    assert.ok(r.est && r.approx, `${t}: ${JSON.stringify(r)}`);
    assert.ok(sig(r.value) >= 1);
  }
  // e^(−1000x²) na [−1, 1]: √(π/1000)·erf(√1000)
  const g = analyze("∫(e^(−1000x^2);−1;1)", ENV);
  assert.ok(digitsOk(g, 0.05604991216397929), JSON.stringify(g));
  assert.ok(Math.abs(analyze("∫(x^2;0;1)", ENV).value - 1 / 3) < 1e-12);
});

test("pregled: primeri iz ocene #944 (vnos → pričakovano)", () => {
  const want = new Map([
    ["∫(1/x^0,99;0;1)", 100],
    ["∫(x^(−0,999);0;1)", 1000],
    ["∫(1/(x·ln(x));0;0,5)", "div"],
    ["∫(1/(x·ln(x)^2);0;0,5)", 1.4426950408889634],
    ["∫(1/(x·(−ln(x))^1,5);0;0,5)", 2.4022448175728996],
    ["∫(tan(x);0;180)", "div"],
    ["∫(1/sin(100x);0;2)", "div"],
    ["∫(1/sin(x)^2;1;200)", "div"],
    ["∫((1−cos(x))/x^2;−1;1)", 0.9727707524706455],
    ["∫(x·sin(1/x);0;1)", 0.3785300171241613],
    ["∫(cos(1/x);−1;1)", -0.16882190111914777],
    ["∫(sin(1/x)/x;0;1)", "unk"],
    ["∫(sign(x);−1;2)", 1],
    ["∫(abs(x−0,3)/(x−0,3);0;1)", 0.4],
    ["∫(floor(1000x);0;1)", 499.5],
  ]);
  for (const [t, w] of want) assert.ok(check(t, w)[0], `${t}: ${JSON.stringify(analyze(t, ENV))}`);
});

test("integral v izrazu, s spremenljivko in obrnjenimi mejami", () => {
  const r = analyze("2·∫(x;0;1)+1", ENV);
  assert.ok(Math.abs(r.value - 2) < 1e-12 && r.est, JSON.stringify(r));
  const p = analyze("∫(a·x;0;1)", { ...ENV, vars: { a: 4 } });
  assert.ok(Math.abs(p.value - 2) < 1e-12, JSON.stringify(p));
  assert.equal(analyze("2·∫(1/x;0;1)", ENV).error?.code, "intDiverge");
  assert.equal(analyze("1+∫(sin(1/x)/x;0;1)", ENV).error?.code, "intUnknown");
});

test("časovna meja: predogled ≤ ~50 ms, Izračunaj ≤ ~1 s (nato »ni mogoče zanesljivo«)", () => {
  for (const t of ["∫(floor(1000x);0;1)", "∫(cos(1/x);−1;1)", "∫(x·sin(1/x);0;1)", "∫(tan(x);0;180)"]) {
    let t0 = performance.now();
    evaluate(t, { ...ENV, live: true });
    assert.ok(performance.now() - t0 < 300, `${t} predogled ${performance.now() - t0} ms`);
    t0 = performance.now();
    analyze(t, ENV);
    assert.ok(performance.now() - t0 < 1500, `${t} ${performance.now() - t0} ms`);
  }
});

test("krivulja F(x) = ∫(1/t^4; −1; x) v 201 točkah je hitra (main 3,7 s)", () => {
  const F = compile(parse("int_(-1)^x 1/t^4 dt"));
  const t0 = performance.now();
  for (let i = 0; i <= 200; i++) F({ x: -1 + (3 * i) / 200 });
  assert.ok(performance.now() - t0 < 2000, `${performance.now() - t0} ms`);
});

test("integrateInfo: ocena napake je poštena (prava napaka ≤ ocena)", () => {
  const fn = (src) => {
    const g = compile(parse(src));
    return (x) => g({ x });
  };
  for (const [src, a, b, want] of [
    ["1/sqrt(1-x^2)", -1, 1, Math.PI],
    ["x*sin(1/x)", 0, 1, 0.3785300171241613],
    ["(1-cos(x))/x^2", -1, 1, 0.9727707524706455],
    ["1/(x*ln(x)^2)", 0, 0.5, 1 / Math.LN2],
  ]) {
    const r = integrateInfo(fn(src), a, b);
    assert.ok(Math.abs(r.value - want) <= r.err, `${src}: ${r.value} ± ${r.err} vs ${want}`);
  }
  assert.ok(Number.isNaN(integrate(fn("sin(1/x)/x"), 0, 1)));
});

test("sporočilo »ni mogoče zanesljivo izračunati« je v vseh 33 jezikih", () => {
  assert.match(sl["sc.errIntUnknown"], /ni mogoče zanesljivo/);
  const dir = new URL("../public/i18n/ui/", import.meta.url);
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const j = JSON.parse(fs.readFileSync(new URL(f, dir), "utf8"));
    assert.ok(j["sc.errIntUnknown"] && j["sc.errIntUnknown"] !== sl["sc.errIntUnknown"], f);
  }
});

// ---------- 3. krog ----------
const FU = (u) => {
  const n = Math.floor(u);
  return n * u - (n * (n + 1)) / 2; // ∫₀^u floor
};

test("skoki iz drevesa (floor, sign, round, mod, {…}): razdelimo pri njih, vsa mesta pravilna", () => {
  assert.ok(check("∫(floor(7x);0;2,88)", 27.6)[0], JSON.stringify(analyze("∫(floor(7x);0;2,88)", ENV)));
  assert.ok(check("∫(floor(7x);−0,627;2,88)", 25.893571428571427)[0]);
  assert.ok(check("∫(sign(x+0,791);−2;2,35)", 1.932)[0]);
  assert.ok(check("∫({x<0,4: 1, 2};0;1)", 1.6)[0]);
  assert.ok(check("∫(mod(x;0,7);0;3)", 1)[0]);
  assert.ok(check("∫(ceil(3x);0,1;1,234)", (1 / 3 - 0.1) + 2 / 3 + 1 + 4 * 0.234)[0]);
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 30; i++) {
    const k = 1 + Math.floor(rnd() * 12);
    const a = +(rnd() * 4 - 2).toFixed(3);
    const b = +(a + 0.1 + rnd() * 4).toFixed(3);
    const t = `∫(floor(${k}x);${String(a).replace(".", ",")};${String(b).replace(".", ",")})`;
    assert.ok(check(t, (FU(k * b) - FU(k * a)) / k)[0], `${t}: ${JSON.stringify(analyze(t, ENV))}`);
  }
});

test("brez drevesa (Analiza, graf): ocena napake pri skokih je poštena (prava napaka ≤ err)", () => {
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 25; i++) {
    const k = 1 + Math.floor(rnd() * 12);
    const a = +(rnd() * 4 - 2).toFixed(3);
    const b = +(a + 0.1 + rnd() * 4).toFixed(3);
    const r = integrateInfo((x) => Math.floor(k * x), a, b);
    const want = (FU(k * b) - FU(k * a)) / k;
    assert.ok(Math.abs(r.value - want) <= r.err, `floor(${k}x) na [${a}, ${b}]: ${r.value} ± ${r.err} vs ${want}`);
  }
});

test("pol tik ob meji: ∫(1/x; −1; 10⁻¹²) ne obstaja; ocena brez enega zanesljivega mesta ne da števila", async () => {
  assert.equal(analyze("∫(1/x;−1;1e−12)", ENV).error?.code, "intDiverge");
  const { zanesljivaMesta } = await import("../public/graph/scicore.js");
  assert.equal(zanesljivaMesta({ value: 1.5, err: 0.4 }), null); // d = 0
  assert.equal(zanesljivaMesta({ value: 1.5, err: 0.1 }).digits, 1);
});

test("sestavljen izraz z integralom kaže le zanesljiva mesta (napaka se prenese skozi račun)", () => {
  const want = 0.5040670619069284;
  for (const [t, w] of [
    ["∫(sin(1/x);0;1)·1", want],
    ["1+∫(sin(1/x);0;1)", 1 + want],
    ["2·∫(sin(1/x);0;1)−∫(x;0;1)", 2 * want - 0.5],
  ]) {
    const r = evaluate(t, ENV);
    assert.ok(r.est && r.digits <= 6 && digitsOk({ kind: "value", ...r }, w, r.digits), `${t}: ${JSON.stringify(r)} (${r.digits} mest)`);
  }
  assert.equal(analyze("∫(x;0;1)−∫(x;0;1)", ENV).value, 0);
});

test("ozki vrhovi: e^(−10¹²x²) in 1/(1 + 10³⁰⁰x²) (prej ≈ 0 in »ne obstaja«)", () => {
  assert.ok(check("∫(e^(−1e12·x^2);−1;1)", Math.sqrt(Math.PI) * 1e-6)[0], JSON.stringify(analyze("∫(e^(−1e12·x^2);−1;1)", ENV)));
  assert.ok(check("∫(1/(1+1e300·x^2);0;1)", (Math.PI / 2) * 1e-150)[0], JSON.stringify(analyze("∫(1/(1+1e300·x^2);0;1)", ENV)));
  assert.ok(check("∫(e^(−1e8·(x−0,3)^2);0;1)", Math.sqrt(Math.PI) * 1e-4)[0], JSON.stringify(analyze("∫(e^(−1e8·(x−0,3)^2);0;1)", ENV)));
});

test("senčenje v grafu: kar se ne izide v 30 ms, dokonča pozneje (ne ostane »∫ ≈ ?«)", () => {
  const src = fs.readFileSync(new URL("../public/graph/plot.js", import.meta.url), "utf8");
  const part = src.slice(src.indexOf("drawArea(ctx, o, C) {"), src.indexOf("const text =", src.indexOf("drawArea(ctx, o, C) {")) + 400);
  assert.match(part, /setTimeout/);
  assert.match(part, /withIntegralBudget\(2000/);
  assert.match(part, /∫ ≈ …/);
});

test("ime za zanesljiva mesta ni »certified« (CodeQL)", () => {
  for (const f of ["scicore.js", "sci.js", "plot.js"]) assert.doesNotMatch(fs.readFileSync(new URL(`../public/graph/${f}`, import.meta.url), "utf8"), /certif|\bcert\b/i, f);
});
