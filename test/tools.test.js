import test from "node:test";
import assert from "node:assert/strict";
import { evaluate, prepare, exactTex, formatNumber, convert, toFraction, CONSTANTS, QUANTITIES, mixedTex, primeFactors, factorsTex } from "../public/graph/scicore.js";
import { analyze, solutionTex, intervalsTex, systemTex, polyCoeffs, previewTex } from "../public/graph/scisolve.js";
import { stats, evalComplex, polyRoots, M, readMatrix, convertBase, molarMass } from "../public/graph/toolscore.js";
import { ELEMENTS, MASSES, CATEGORIES, shells, fullConfig, EXTRA } from "../public/graph/pse-data.js";
import { balance, parseSpecies, stoich, phOf, phAll, solveConc, dilution, massFraction, saltFormula, solubility, SOL_CATIONS, SOL_ANIONS } from "../public/graph/chemcore.js";
import { normal, studentT, chi2, binomial, poisson, geometric, hypergeometric, probability, phiInv } from "../public/graph/probcore.js";
import { fn, derivative, roots, limit, taylor, V, odeSolve, measurement, propagate, roundMeasurement, toTex } from "../public/graph/anacore.js";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const near = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) <= eps * (1 + Math.abs(b)), `${a} ≉ ${b}`);
const ev = (text, opts) => {
  const r = evaluate(text, opts);
  assert.ok(!r.error, `${text}: ${JSON.stringify(r.error)}`);
  return r.value;
};

test("znanstveni kalkulator: decimalna vejica, Ans, kombinacije, stopinje", () => {
  near(ev("1,5 + 2,25"), 3.75);
  near(ev("2Ans + 1", { ans: 5 }), 11);
  near(ev("Ans^2", { ans: 3 }), 9);
  near(ev("nCr(5;2)"), 10);
  near(ev("sin(30)", { deg: true }), 0.5);
  near(ev("sin(π/6)"), 0.5);
  near(ev("sin(90°)", { deg: false }), 1, 1e-9);
  near(ev("1,2E5"), 120000);
  near(ev("(2+3"), 5, 0);
  near(ev("√(16) + 3!"), 10);
  near(ev("log(1000) + ln(e)"), 4);
  assert.ok(typeof prepare("Ans+1") === "string");
});

test("znanstveni kalkulator: spremenljivke, napake in enačbe", () => {
  const set = evaluate("a = 4");
  assert.equal(set.assign, "a");
  near(set.value, 4);
  near(ev("3a", { vars: { a: 4 } }), 12);
  assert.ok(evaluate("3b").error, "neznana spremenljivka je napaka");
  assert.equal(evaluate("x + 1 = 3").error?.code, "notCalc");
  assert.ok(evaluate("2 +* 3").error);
});

test("znanstveni kalkulator: odstotki kot na telefonu, °, zaokroževanje, integral, odvod v točki", () => {
  near(ev("200 + 10%"), 220);
  near(ev("200 − 10%"), 180);
  near(ev("10% · 50"), 5);
  assert.match(evaluate("sin(30°)", { deg: true }).tex, /30\^\{\\circ\}/);
  near(ev("sin(30°)", { deg: true }), 0.5);
  near(ev("round(2,567; 2)"), 2.57);
  near(ev("∫(x²; 0; 3)"), 9, 1e-8);
  near(ev("d/dx(x³; 2)"), 12, 1e-9);
  assert.match(evaluate("gcd(12; 18)").tex, /12;18/, "argumenti z ; (decimalna vejica)");
});

test("znanstveni kalkulator: enačbe, točne rešitve, kompleksne rešitve", () => {
  const sol = (text, opts) => {
    const r = analyze(text, opts);
    assert.equal(r.kind, "solve", `${text}: ${JSON.stringify(r)}`);
    return r;
  };
  assert.deepEqual(sol("x² − 5x + 6 = 0").roots, [2, 3]);
  assert.deepEqual(sol("2x + 3 = 7").roots, [2]);
  assert.match(solutionTex(sol("x/3 + 1/2 = 1")), /frac\{3\}\{2\}/);
  const golden = sol("x² − x − 1 = 0");
  assert.match(golden.exact, /\\frac\{1 \\pm \\sqrt\{5\}\}\{2\}/);
  near(golden.roots[1], (1 + Math.sqrt(5)) / 2);
  assert.match(sol("x² + 2x + 5 = 0").exact, /-1 \\pm 2i/);
  assert.deepEqual(sol("x³ − 6x² + 11x − 6 = 0").roots, [1, 2, 3]);
  const q = sol("x⁴ = 16");
  assert.deepEqual(q.roots, [-2, 2]);
  assert.equal(q.complex.length, 2);
  near(sol("2^x = 10").roots[0], Math.log2(10));
  near(sol("e^x = x + 2").roots[1], 1.1461932206, 1e-8);
  assert.deepEqual(sol("√(x) = 3").roots, [9]);
  const tri = sol("sin(x) = 0,5", { deg: true });
  assert.deepEqual(tri.roots, [30, 150]);
  assert.ok(tri.interval, "periodična enačba ima interval ene periode");
  assert.equal(sol("2cos(x) = 1").roots.length, 2);
  assert.ok(sol("x = x").all);
  assert.ok(sol("x + 1 = x").none);
  assert.equal(sol("sin(x) = 2").roots.length, 0);
  // spremenljivka iz pomnilnika ni neznanka
  assert.deepEqual(sol("a·x = 6", { vars: { a: 3 } }).roots, [2]);
});

test("znanstveni kalkulator: neenačbe, sistemi, drži/ne drži", () => {
  assert.match(intervalsTex(analyze("x² < 4")), /\(-2;\\,2\)/);
  assert.match(intervalsTex(analyze("x² ≥ 4")), /\(-\\infty;\\,-2\] \\cup \[2;\\,\\infty\)/);
  assert.match(intervalsTex(analyze("(x − 1)/(x + 2) > 0")), /\(-\\infty;\\,-2\) \\cup \(1;\\,\\infty\)/, "pol ni v rešitvi");
  assert.match(intervalsTex(analyze("x² + 1 > 0")), /mathbb\{R\}/);
  assert.match(intervalsTex(analyze("x² ≤ 0")), /\\\{0\\\}/);
  assert.match(intervalsTex(analyze("|x − 2| < 3")), /\(-1;\\,5\)/);
  assert.match(intervalsTex(analyze("1 < x ≤ 3")), /\(1;\\,3\]/);
  const s = analyze("x + y = 3; x − y = 1");
  assert.deepEqual(s.values, [2, 1]);
  assert.match(systemTex(s), /x = 2/);
  assert.deepEqual(analyze("2a + b + c = 7; a − b = 1; c = 2").values, [2, 1, 2]);
  assert.ok(analyze("x + y = 1; 2x + 2y = 5").none);
  assert.ok(analyze("x + y = 1; 2x + 2y = 2").many);
  assert.equal(analyze("x² + y² = 25; y = x + 1").kind, "plot");
  assert.equal(analyze("2 + 2 = 4").value, true);
  assert.equal(analyze("3 > 5").value, false);
});

test("znanstveni kalkulator: popravki pregleda (stopinje, poli, periodične neenačbe, zamrznitev)", () => {
  // cos(x) v stopinjah je na −10 … 10 skoraj polinom: ne sme veljati za polinom
  assert.deepEqual(analyze("cos(x) = 0", { deg: true }).roots, [90, 270]);
  assert.deepEqual(analyze("cos(x) = 0,5", { deg: true }).roots, [60, 300]);
  assert.equal(analyze("x + sin(x) = 1", { deg: true }).roots.length, 1);
  // pol in −0 nista rešitvi neenačbe
  assert.match(intervalsTex(analyze("1/(x − 1) > 0")), /x \\in \(1;\\,\\infty\)/);
  assert.match(intervalsTex(analyze("1/x ≤ 1")), /\(-\\infty;\\,0\) \\cup \[1;\\,\\infty\)/);
  assert.match(intervalsTex(analyze("ln(x) ≤ 0")), /\(0;\\,1\]/);
  assert.match(intervalsTex(analyze("√(x − 1) + 1 > 0")), /\[1;\\,\\infty\)/, "rob definicijskega območja ostane");
  // trigonometrična neenačba: na eni periodi, kot enačba
  const s = analyze("sin(x) > 0", { deg: true });
  assert.match(intervalsTex(s), /x \\in \(0;\\,180\)$/);
  assert.ok(s.interval);
  assert.match(intervalsTex(analyze("tan(x) > 0")), /\(0;\\,\\frac\{\\pi\}\{2\}\) \\cup \(\\pi;\\,\\frac\{3\\pi\}\{2\}\)/, "tan(90°) ni rešitev");
  assert.match(intervalsTex(analyze("sin(x) < 2", { deg: true })), /mathbb\{R\}/);
  // ničla na točki vzorčenja za mnogimi robovi definicijskega območja (x^x pri x < 0)
  assert.deepEqual(analyze("x^x = 4").roots, [2]);
  // odvečno »;« na koncu, nelinearen sistem s tremi neznankami
  assert.deepEqual(analyze("x² − 5x + 6 = 0;").roots, [2, 3]);
  assert.equal(analyze("x² + y = 1; y + z = 2; z = x").error?.code, "notCalc");
  // pretežko: odnehamo, namesto da zamrznemo zaslon
  const t0 = Date.now();
  assert.equal(analyze("∑_(n=1)^(10000) sin(n x) > 0").error?.code, "notCalc");
  assert.ok(Date.now() - t0 < 4000);
});

test("znanstveni kalkulator: funkcije f(x), odvodi, kompleksna števila, risanje", () => {
  const f = analyze("f(x) = x² + 1");
  assert.equal(f.kind, "func");
  assert.deepEqual(f.plot, ["y = x² + 1"]);
  const funcs = { f: { param: "x", body: f.body } };
  near(analyze("f(3) + 1", { funcs }).value, 11);
  near(analyze("f'(2)", { funcs }).value, 4, 1e-9);
  assert.equal(analyze("f(x) = x + b").error?.code, "missing");
  const d = analyze("d/dx(x³)");
  assert.equal(d.kind, "deriv");
  assert.match(d.resTex, /3x\^\{2\}/);
  const z = analyze("(1 + 2i)(3 − i)");
  assert.equal(z.kind, "complex");
  assert.deepEqual([z.re, z.im], [5, 5]);
  assert.deepEqual([analyze("i²").re, analyze("i²").im], [-1, 0]);
  assert.equal(analyze("x² + 1").kind, "expr");
  assert.equal(analyze("y = 2x + 1").kind, "plot");
  assert.deepEqual(analyze("2x + 3 = 7").plot, ["y = 2x + 3", "y = 7"]);
  assert.deepEqual(analyze("2,5x = 5").plot, ["y = 2.5x", "y = 5"], "graf dobi decimalno piko");
  assert.equal(previewTex("x + y = 3; x − y = 1").startsWith("\\begin{cases}"), true);
  assert.deepEqual(polyCoeffs((x) => 2 * x ** 3 - x + 4), [2, 0, -1, 4]);
  assert.equal(polyCoeffs(Math.sin), null);
});

test("števila: mešani ulomki, prafaktorji, inženirski zapis", () => {
  assert.equal(mixedTex(7 / 3), "2\\tfrac{1}{3}");
  assert.equal(mixedTex(1 / 3), null);
  assert.deepEqual(primeFactors(360), [[2, 3], [3, 2], [5, 1]]);
  assert.equal(factorsTex(360, primeFactors(360)), "2^{3}\\cdot 3^{2}\\cdot 5");
  assert.equal(primeFactors(2.5), null);
  assert.equal(formatNumber(12345.678, { mode: "eng" }).text, "12,345678 · 10^3");
  assert.equal(formatNumber(0.00047, { mode: "eng" }).text, "470 · 10^-6");
  assert.equal(formatNumber(999999.9999999, { mode: "eng" }).text, "1 · 10^6");
});

test("natančni rezultati: ulomki, koreni, večkratniki π", () => {
  assert.deepEqual(toFraction(0.75), { p: 3, q: 4 });
  assert.match(exactTex(0.5), /frac\{1\}\{2\}/);
  assert.match(exactTex(Math.sqrt(3) / 2), /sqrt\{3\}/);
  assert.match(exactTex(Math.PI / 4), /pi/);
  assert.equal(exactTex(60), null);
  assert.equal(exactTex(59.99999999999999), null);
});

test("oblike zapisa števil", () => {
  assert.equal(formatNumber(2.5).text, "2,5");
  assert.equal(formatNumber(2.5, { comma: false }).text, "2.5");
  assert.equal(formatNumber(2.5).tex, "2{,}5");
  assert.equal(formatNumber(Math.PI, { mode: "fix2" }).text, "3,14");
  assert.equal(formatNumber(123456, { mode: "sig3" }).text, "123000");
  assert.match(formatNumber(123456, { mode: "sci" }).text, /1,23.*10/);
});

test("pretvorbe enot in konstante", () => {
  near(convert(72, "speed", "km/h", "m/s"), 20);
  near(convert(100, "temperature", "°C", "°F"), 212);
  near(convert(0, "temperature", "°C", "K"), 273.15);
  near(convert(1, "energy", "kWh", "J"), 3.6e6);
  near(convert(0.1, "length", "m", "cm"), 10, 0);
  assert.ok(Number.isNaN(convert(1, "mass", "kg", "m")));
  assert.equal(QUANTITIES.length, 15);
  assert.equal(CONSTANTS.find((c) => c.id === "NA").value, 6.02214076e23);
});

test("statistika", () => {
  const s = stats([2, 4, 4, 4, 5, 5, 7, 9]);
  assert.equal(s.n, 8);
  near(s.mean, 5);
  near(s.median, 4.5);
  near(s.sdP, 2);
  assert.deepEqual(s.mode, [4]);
  assert.equal(s.range, 7);
});

test("kompleksna števila in koreni polinomov", () => {
  const z = evalComplex("(1+2i)(3-i)");
  near(z[0], 5);
  near(z[1], 5);
  const q = polyRoots([1, 0, 1]).sort((a, b) => a[1] - b[1]);
  near(q[0][0], 0); near(q[0][1], -1); near(q[1][0], 0); near(q[1][1], 1);
  const cubic = polyRoots([1, -6, 11, -6]).map(([re]) => re).sort((a, b) => a - b);
  cubic.forEach((r, i) => near(r, i + 1));
});

test("matrike: determinanta, inverz, sistem", () => {
  const A = readMatrix("2 1\n1 3");
  near(M.det(A), 5);
  const inv = M.inverse(A);
  near(inv[0][0], 0.6);
  near(inv[0][1], -0.2);
  const sol = M.solve(readMatrix("1 1\n1 -1"), readMatrix("3\n1"));
  near(sol.x[0][0] ?? sol.x[0], 2);
  assert.ok(M.solve(readMatrix("1 1\n2 2"), readMatrix("1\n3")).none);
  assert.ok(M.solve(readMatrix("1 1\n2 2"), readMatrix("1\n2")).many);
});

test("številski sistemi", () => {
  const r = convertBase("255", 10);
  assert.equal(r[2], "11111111");
  assert.equal(r[16].toUpperCase(), "FF");
  assert.equal(convertBase("777", 8)[10], "511");
});

test("molska masa iz formule", () => {
  near(molarMass("H2SO4", MASSES).M, 98.072, 1e-4);
  near(molarMass("CuSO4·5H2O", MASSES).M, 249.677, 1e-4);
  near(molarMass("K3[Fe(CN)6]", MASSES).M, 329.247, 1e-4);
  near(molarMass("SO4^2-", MASSES).M, 96.056, 1e-4);
  assert.equal(molarMass("Xy2", MASSES).error, "element");
  assert.ok(molarMass("H2(O", MASSES).error);
});

test("periodni sistem: 118 elementov na pravih mestih", () => {
  assert.equal(ELEMENTS.length, 118);
  const by = (s) => ELEMENTS.find((e) => e.sym === s);
  assert.deepEqual([by("H").period, by("H").group], [1, 1]);
  assert.deepEqual([by("Fe").z, by("Fe").period, by("Fe").group], [26, 4, 8]);
  assert.deepEqual([by("Og").z, by("Og").group], [118, 18]);
  assert.equal(by("La").f, true);
  assert.equal(by("U").cat, "actinide");
  assert.equal(by("Cl").cat, "halogen");
  assert.equal(by("Ne").cat, "noble");
  assert.equal(by("Hg").sl, "živo srebro");
  near(MASSES.C, 12.011, 1e-3);
  assert.ok(MASSES.Tc > 0, "radioaktivni elementi imajo masno število");
  assert.equal(new Set(ELEMENTS.map((e) => e.cat)).size, CATEGORIES.length);
  assert.deepEqual(shells(11), [2, 8, 1]);
  assert.deepEqual(shells(26), [2, 8, 14, 2]);
  assert.equal(fullConfig(26), "1s2 2s2 2p6 3s2 3p6 4s2 3d6");
  assert.equal(Object.keys(EXTRA).length, 118);
});

test("kemija: urejanje enačb reakcij in ionov", () => {
  const co = (t) => balance(t, MASSES).coef;
  assert.deepEqual(co("Fe + O2 -> Fe2O3"), [4, 3, 2]);
  assert.deepEqual(co("C3H8 + O2 -> CO2 + H2O"), [1, 5, 3, 4]);
  assert.deepEqual(co("MnO4^- + Fe^2+ + H^+ -> Mn^2+ + Fe^3+ + H2O"), [1, 5, 8, 1, 5, 4]);
  assert.deepEqual(co("Cu + HNO3 -> Cu(NO3)2 + NO + H2O"), [3, 8, 3, 2, 4]);
  assert.deepEqual(co("KMnO4 + HCl -> KCl + MnCl2 + Cl2 + H2O"), [2, 16, 2, 2, 5, 8]);
  assert.equal(balance("H2 + O2 -> H2O2 + H2O", MASSES).error, "many");
  assert.equal(balance("H2 + O2", MASSES).error, "arrow");
  assert.equal(balance("Fe -> Cu", MASSES).error, "none");
  assert.equal(parseSpecies("Fe3+", MASSES).charge, 3);
  assert.equal(parseSpecies("NH4+", MASSES).charge, 1);
  assert.equal(parseSpecies("SO4^2-", MASSES).charge, -2);
  assert.equal(parseSpecies("SO₄²⁻", MASSES).charge, -2);
  assert.ok(parseSpecies("e-", MASSES).electron);
  // 2 H2 + O2 -> 2 H2O: pri 2 mol H2 in 2 mol O2 je omejujoči H2
  const st = stoich([2, 1, 2], 2, { 0: 2, 1: 2 });
  assert.equal(st.limiting, 0);
  assert.deepEqual(st.n, [2, 1, 2]);
});

test("kemija: pH, koncentracije, redčenje, topnost", () => {
  near(phOf("sa", 0.01).ph, 2, 1e-6);
  near(phOf("sb", 0.005, { z: 2 }).ph, 12, 1e-6);
  near(phOf("sa", 1e-8).ph, 6.978, 1e-3); // voda prispeva svoje H3O+
  near(phOf("wa", 0.1, { K: 1.8e-5 }).ph, 2.875, 1e-3);
  near(phAll("poh", 4).ph, 10);
  const c = solveConc({ m: 5.844, V: 0.1, M: 58.44 });
  near(c.n, 0.1); near(c.c, 1);
  near(dilution({ c1: 2, V1: 50, c2: 0.5 }).V2, 200);
  near(massFraction({ mt: 10, mv: 90 }).w, 0.1);
  assert.equal(SOL_CATIONS.length, 14);
  assert.equal(SOL_ANIONS.length, 9);
  const at = (c, a) => solubility(SOL_CATIONS.findIndex((x) => x[0] === c), SOL_ANIONS.findIndex((x) => x[0] === a));
  assert.equal(at("Na", "Cl"), "T");
  assert.equal(at("Ag", "Cl"), "N");
  assert.equal(at("Ca", "SO4"), "M");
  assert.equal(at("Ba", "SO4"), "N");
  assert.equal(saltFormula(["Al", 3], ["SO4", 2]), "Al2(SO4)3");
});

test("verjetnostne porazdelitve", () => {
  const z = normal(0, 1);
  near(z.cdf(1.96), 0.975, 1e-4);
  near(phiInv(0.975), 1.959964, 1e-5);
  near(probability(z, "between", -1, 1), 0.682689, 1e-5);
  near(studentT(10).inv(0.975), 2.228139, 1e-5);
  near(chi2(5).inv(0.95), 11.0705, 1e-4);
  near(probability(binomial(10, 0.5), "eq", 5), 0.246094, 1e-5);
  near(probability(poisson(2), "le", 2), 0.676676, 1e-5);
  near(probability(binomial(10, 0.5), "lt", 5) + probability(binomial(10, 0.5), "ge", 5), 1, 1e-9);
});

test("analiza: ničle, limite, Taylor, odvod", () => {
  const f = fn("x^3 - 3x");
  const r = roots((x) => f.f({ x }), -3, 3);
  assert.equal(r.length, 3);
  near(r[2], Math.sqrt(3), 1e-6);
  near(roots((x) => (x - 1) ** 2, -2, 3)[0], 1, 1e-4); // dvojna ničla
  near(limit((x) => Math.sin(x) / x, 0), 1, 1e-6);
  near(limit((x) => (1 + 1 / x) ** x, Infinity), Math.E, 1e-5);
  assert.ok(!Number.isFinite(limit((x) => 1 / x, 0)));
  const t = taylor(fn("e^x").node, 0, 3);
  assert.ok(t, "Taylorjev polinom");
  assert.ok(toTex(derivative(fn("x^2").node)).includes("x"));
});

test("vektorji, diferencialne enačbe, merske napake", () => {
  assert.deepEqual(V.cross([1, 0, 0], [0, 1, 0]), [0, 0, 1]);
  assert.equal(V.dot([1, 2, 3], [4, 5, 6]), 32);
  near(V.angle([1, 0], [0, 1]), Math.PI / 2);
  const ode = odeSolve(({ y }) => y, { x0: 0, y0: 1, x1: 1, N: 50 });
  near(ode.at(-1).y, Math.E, 1e-7);
  const osc = odeSolve(({ y }) => -y, { order: 2, x0: 0, y0: 1, yd0: 0, x1: Math.PI, N: 200 });
  near(osc.at(-1).y, -1, 1e-6);
  const m = measurement([1, 2, 3]);
  near(m.mean, 2); near(m.s, 1); near(m.maxDev, 1);
  const p = propagate(fn("a*b").node, { a: 2, b: 3 }, { a: 0.1, b: 0.2 });
  near(p.value, 6); near(p.max, 0.7); near(p.quad, Math.hypot(0.3, 0.4));
  assert.deepEqual(roundMeasurement(9.8123, 0.0345), { x: 9.81, dx: 0.03, dec: 2 });
  assert.deepEqual(roundMeasurement(9.8123, 0.0145), { x: 9.812, dx: 0.015, dec: 3 });
});

test("zbirka formul prek API", async () => {
  const app = createApp(openDb(":memory:"), { streamFn: async () => ({ text: "", content: [] }) });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const r = await fetch(`${base}/api/formulas?book=KEM-OS`);
    assert.equal(r.status, 200);
    const body = await r.json();
    assert.equal(body.key, "KEM-OS");
    assert.ok(body.md.length > 100);
    for (const k of ["MAT-UNI", "FIZ-UNI", "KEM-UNI"]) assert.equal((await fetch(`${base}/api/formulas?book=${k}`)).status, 200);
    assert.equal((await fetch(`${base}/api/formulas?book=../x`)).status, 404);
    assert.equal((await fetch(`${base}/api/formulas?book=ZGO-OS`)).status, 404);
  } finally {
    server.close();
  }
});

test("kalkulator: ∑/∏ (sum(...; n; a; b) in ∑_(n=a)^(b)), Int, frac, rand, randint", () => {
  const v = (s, env = {}) => evaluate(s, env).value;
  // vsota prvih 10 kvadratov = n(n+1)(2n+1)/6 = 385, 5! = 120
  assert.equal(v("sum(n^2;n;1;10)"), 385);
  assert.equal(v("prod(n;n;1;5)"), 120);
  assert.equal(v("∑_(n=1)^(10) n^2"), 385);
  assert.equal(v("∏_(n=1)^(5) n"), 120);
  assert.ok(Math.abs(v("sum(1/n;n;1;3)") - 11 / 6) < 1e-12);
  assert.equal(v("sum(1;n;1;100000)"), 100000); // meja: 100 000 členov
  assert.equal(evaluate("sum(1;n;1;100001)").error.code, "sumLimit");
  // Casio Int/Frac: celi del proti 0
  assert.equal(v("Int(-2,7)"), -2);
  assert.equal(v("Int(2,7)"), 2);
  assert.ok(Math.abs(v("frac(-2,7)") + 0.7) < 1e-12);
  assert.ok(Math.abs(v("frac(2,75)") - 0.75) < 1e-12);
  let lo = Infinity, hi = -Infinity, r0 = 1, r1 = 0;
  for (let i = 0; i < 3000; i++) {
    const k = v("randint(3;6)");
    lo = Math.min(lo, k); hi = Math.max(hi, k);
    const u = v("rand");
    r0 = Math.min(r0, u); r1 = Math.max(r1, u);
  }
  assert.equal(lo, 3);
  assert.equal(hi, 6);
  assert.ok(r0 >= 0 && r1 < 1 && r1 > 0.9 && r0 < 0.1);
  assert.equal(v("randint(-2;-2)"), -2);
});

test("kalkulator: Pol in Rec upoštevata enoto kota", () => {
  const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} ≠ ${b}`);
  // Casio Pol(1;1) = (√2, 45°); π/4 v radianih
  let r = analyze("Pol(1;1)", { deg: true });
  assert.equal(r.kind, "pair");
  close(r.items[0].v, Math.SQRT2);
  close(r.items[1].v, 45);
  close(analyze("Pol(1;1)", { deg: false }).items[1].v, Math.PI / 4);
  // Pol(−1; 0): θ = 180°
  close(analyze("Pol(-1;0)", { deg: true }).items[1].v, 180);
  // Rec(2; 60°) = (1, √3)
  r = analyze("Rec(2;60°)", { deg: true });
  close(r.items[0].v, 1);
  close(r.items[1].v, Math.sqrt(3));
  r = analyze("Rec(2;60°)", { deg: false });
  close(r.items[0].v, 1);
  close(r.items[1].v, Math.sqrt(3));
  r = analyze("Rec(2;π/3)", { deg: false });
  close(r.items[1].v, Math.sqrt(3));
  assert.ok(analyze("Pol(1)", {}).error);
});

test("verjetnost: geometrijska in hipergeometrijska porazdelitev", () => {
  const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} ≠ ${b}`);
  // geometpdf(0,2; 3) = 0,8² · 0,2 = 0,128; geometcdf(0,2; 3) = 1 − 0,8³ = 0,488 (TI-84)
  const g = geometric(0.2);
  close(probability(g, "eq", 3), 0.128);
  close(probability(g, "le", 3), 0.488);
  close(g.pdf(0), 0);
  close(g.mean, 5);
  // hipergeometrijska N=20, K=7, n=5: C(7,2)·C(13,3)/C(20,5) = 21·286/15504
  const h = hypergeometric(20, 7, 5);
  close(probability(h, "eq", 2), (21 * 286) / 15504);
  close(probability(h, "le", 2), (1287 + 7 * 715 + 21 * 286) / 15504); // C(13,5)=1287, C(13,4)=715
  close(probability(h, "le", 5), 1);
  close(h.mean, (5 * 7) / 20);
});
