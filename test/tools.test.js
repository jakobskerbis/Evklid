import test from "node:test";
import assert from "node:assert/strict";
import { evaluate, prepare, exactTex, formatNumber, convert, toFraction, CONSTANTS, QUANTITIES, mixedTex, primeFactors, factorsTex, dmsOf } from "../public/graph/scicore.js";
import { analyze, solutionTex, intervalsTex, systemTex, polyCoeffs, previewTex } from "../public/graph/scisolve.js";
import { stats, evalComplex, polyRoots, M, readMatrix, convertBase, molarMass, solveRatio } from "../public/graph/toolscore.js";
import { ELEMENTS, MASSES, CATEGORIES, shells, fullConfig, EXTRA } from "../public/graph/pse-data.js";
import { balance, parseSpecies, stoich, phOf, phAll, solveConc, dilution, massFraction, saltFormula, solubility, SOL_CATIONS, SOL_ANIONS } from "../public/graph/chemcore.js";
import { normal, studentT, chi2, binomial, poisson, geometric, hypergeometric, probability, phiInv } from "../public/graph/probcore.js";
import { fn, derivative, roots, limit, taylor, V, odeSolve, measurement, propagate, roundMeasurement, toTex } from "../public/graph/anacore.js";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const near = (a, b, eps = 1e-6, rel = false) => assert.ok(Math.abs(a - b) <= eps * (rel ? Math.abs(b) : 1 + Math.abs(b)), `${a} ≉ ${b}`);
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
    // Tekmovalni učbeniki (MAT-TEK, FIZ-TEK, KEM-TEK) imajo svoj list, razdeljen na razdelke z oznakami.
    for (const k of ["MAT-TEK", "FIZ-TEK", "KEM-TEK"]) {
      const tek = await fetch(`${base}/api/formulas?book=${k}`);
      assert.equal(tek.status, 200, k);
      const json = await tek.json();
      assert.equal(json.key, k);
      assert.ok(json.sections.length >= 5 && json.sections.every((s) => s.symbols.length), k);
      assert.ok(!json.md.includes(":::simboli"), k);
    }
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

// ---------- preizkusi domnev, intervali, regresije, TVM, tabela vrednosti ----------

import * as TC from "../public/graph/testcore.js";
import { regression, buildModel, emptyState } from "../public/graph/model.js";

// neodvisen p: Simpson po gostoti t (ne uporablja probcore); Lanczos za ln Γ
const lnG = (z) => {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = z;
  let t = z + 5.5;
  t -= (z + 0.5) * Math.log(t);
  let s = 1.000000000190015;
  for (const k of c) s += k / ++y;
  return -t + Math.log((2.5066282746310005 * s) / z);
};
const tPdf = (x, v) => (Math.exp(lnG((v + 1) / 2) - lnG(v / 2)) / Math.sqrt(v * Math.PI)) * (1 + (x * x) / v) ** (-(v + 1) / 2);
const tTail2 = (t, v) => {
  const N = 20000;
  const a = Math.abs(t);
  const h = (400 - a) / N;
  let s = tPdf(a, v) + tPdf(400, v);
  for (let i = 1; i < N; i++) s += tPdf(a + i * h, v) * (i % 2 ? 4 : 2);
  return 2 * ((s * h) / 3); // dva repa
};

test("preizkusi: t-test za povprečje (x̄=5,1, s=0,8, n=16, μ0=5 → t=0,5, df=15, p≈0,6243)", () => {
  const a = { mean: 5.1, mu0: 5, s: 0.8, n: 16 };
  const r = TC.tTest1(a);
  near(r.stat, 0.5, 1e-9);
  assert.equal(r.df, 15);
  near(r.p, 0.6243, 2e-4);
  assert.equal(r.reject, false);
  near(TC.tTest1(a, "gt").p, 0.6243 / 2, 2e-4);
  near(TC.tTest1(a, "lt").p, 1 - 0.6243 / 2, 2e-4);
  assert.equal(TC.tTest1({ ...a, mean: 7 }).reject, true);
});

test("preizkusi: z-test (x̄=103, μ0=100, σ=15, n=36 → z=1,2, p=2·0,11507=0,23014)", () => {
  const a = { mean: 103, mu0: 100, sigma: 15, n: 36 };
  near(TC.zTest1(a).stat, 1.2, 1e-9);
  near(TC.zTest1(a).p, 0.230139, 1e-4);
  near(TC.zTest1(a, "gt").p, 0.115070, 1e-4);
  // 2 vzorca: se = √(25/40 + 16/50) = 0,97468; z = 2/se = 2,05196; p = 0,0402
  const r2 = TC.zTest2({ mean: 50, sigma: 5, n: 40 }, { mean: 48, sigma: 4, n: 50 });
  near(r2.stat, 2 / Math.sqrt(25 / 40 + 16 / 50), 1e-9);
  near(r2.p, 0.04019, 2e-3);
});

test("preizkusi: 2 vzorca t – Welch df in pooled", () => {
  const a = { mean: 20, s: 4, n: 10 };
  const b = { mean: 17, s: 2, n: 15 };
  const w = TC.tTest2(a, b);
  // df = (1,6 + 0,26667)² / (1,6²/9 + 0,26667²/14) = 3,484444/0,289524 = 12,0352
  near(w.df, 3.484444 / 0.289524, 1e-4);
  near(w.stat, 3 / Math.sqrt(1.6 + 4 / 15), 1e-9);
  near(w.p, tTail2(w.stat, w.df), 1e-4);
  // pooled: sp² = (9·16 + 14·4)/23 = 8,6957; se = √(8,6957·(1/10 + 1/15)) = 1,20386; df = 23
  const p = TC.tTest2(a, b, "ne", 0.05, true);
  assert.equal(p.df, 23);
  near(p.stat, 3 / 1.20386, 1e-4);
  near(p.p, tTail2(p.stat, 23), 1e-4);
});

test("preizkusi: deleži (58/100 proti 0,5 → z=1,6, p≈0,1096; 45/100 proti 30/100 → z=2,1909)", () => {
  const r = TC.propTest1({ x: 58, n: 100, p0: 0.5 });
  near(r.stat, 1.6, 1e-9);
  near(r.p, 0.1096, 1e-3);
  // pc = 0,375; se = √(0,375·0,625·0,02) = 0,068465
  const r2 = TC.propTest2({ x1: 45, n1: 100, x2: 30, n2: 100 });
  near(r2.stat, 0.15 / 0.068465, 1e-4);
  near(r2.p, 0.02846, 2e-3);
  assert.equal(r2.reject, true);
});

test("preizkusi: χ² prileganje (18, 22, 20, 40 → χ² = 308/25 = 12,32, df=3) in neodvisnost 2×2", () => {
  const g = TC.chiGof([18, 22, 20, 40]);
  near(g.stat, 12.32, 1e-9);
  assert.equal(g.df, 3);
  // df = 3: P(χ² > x) = 2(1 − Φ(√x)) + √(2x/π)·e^(−x/2) = 0,006353 (zapis z χ² = 12,8 bi dal 0,00508)
  near(g.p, 2 * normal(0, 1).cdf(-Math.sqrt(12.32)) + Math.sqrt((2 * 12.32) / Math.PI) * Math.exp(-6.16), 1e-6, true);
  near(TC.chiGof([20, 20, 20, 40], [25, 25, 25, 25]).stat, 12, 1e-9);
  near(1 - chi2(3).cdf(12.8), 0.00508, 1e-2, true);
  assert.equal(g.reject, true);
  // [[20,30],[30,20]]: vse pričakovane 25 → χ² = 4·25/25 = 4, df 1, p = 2(1−Φ(2)) = 0,0455
  const i = TC.chiIndep([[20, 30], [30, 20]]);
  near(i.stat, 4, 1e-9);
  assert.equal(i.df, 1);
  near(i.p, 0.0455, 2e-3);
  assert.equal(TC.chiIndep([[1, 2]]), null);
});

test("preizkusi: t-test za naklon (x=1..5, y=2,4,5,4,5 → b=0,6, a=2,2, r²=0,6, t=2,1213, df=3, p≈0,124)", () => {
  const r = TC.regTest([1, 2, 3, 4, 5], [2, 4, 5, 4, 5]);
  near(r.b, 0.6, 1e-9);
  near(r.a, 2.2, 1e-9);
  near(r.r2, 0.6, 1e-9);
  near(r.stat, 0.6 / (Math.sqrt(2.4 / 3) / Math.sqrt(10)), 1e-9);
  assert.equal(r.df, 3);
  near(r.p, tTail2(r.stat, 3), 1e-4);
});

test("intervali zaupanja: t, z, 2 vzorca, deleži", () => {
  // x̄=10, s=2, n=25: t* = 2,0639 → 10 ± 0,82556
  const t = TC.tInt1({ mean: 10, s: 2, n: 25 });
  near(t.crit, 2.0639, 1e-4);
  near(t.lo, 9.1744, 1e-4);
  near(t.hi, 10.8256, 1e-4);
  const z = TC.zInt1({ mean: 10, sigma: 2, n: 25 });
  near(z.lo, 10 - 1.959964 * 0.4, 1e-5);
  near(z.hi, 10 + 1.959964 * 0.4, 1e-5);
  near(TC.zInt1({ mean: 10, sigma: 2, n: 25 }, 0.99).crit, 2.575829, 1e-5);
  // 1 delež 58/100: 0,58 ± 1,95996·√(0,58·0,42/100)
  near(TC.propInt1({ x: 58, n: 100 }).margin, 1.959964 * Math.sqrt((0.58 * 0.42) / 100), 1e-6);
  // 2 deleža: 0,45−0,30 ± 1,95996·√(0,45·0,55/100 + 0,3·0,7/100)
  near(TC.propInt2({ x1: 45, n1: 100, x2: 30, n2: 100 }).margin, 1.959964 * Math.sqrt(0.002475 + 0.0021), 1e-6);
  // 2 vzorca: razlika 3, se (Welch) = 1,36626, df = 12,0352
  const w = TC.tInt2({ mean: 20, s: 4, n: 10 }, { mean: 17, s: 2, n: 15 });
  near(w.margin, w.crit * 1.36626, 1e-4);
  near(w.df, 12.0352, 1e-3);
  near(TC.zInt2({ mean: 20, sigma: 4, n: 10 }, { mean: 17, sigma: 2, n: 15 }).margin, 1.959964 * 1.36626, 1e-4);
  assert.equal(TC.tInt2({ mean: 20, s: 4, n: 10 }, { mean: 17, s: 2, n: 15 }, 0.95, true).df, 23);
});

test("regresije: kvartična, logistična, sinusna iz točnih podatkov; ln, a·bˣ, a·xᵇ", () => {
  const xs = Array.from({ length: 21 }, (_, i) => i * 0.5);
  const q = regression(xs, xs.map((x) => x ** 4 - 2 * x * x + x + 1), "quart");
  [1, 0, -2, 1, 1].forEach((c, i) => near(q.p[i], c, 1e-6));
  near(q.r2, 1, 1e-9);
  const lg = regression(xs, xs.map((x) => 3 / (1 + 4 * Math.exp(-0.9 * x))), "logistic");
  [4, 0.9, 3].forEach((c, i) => near(lg.p[i], c, 1e-5));
  const x2 = Array.from({ length: 25 }, (_, i) => i * 0.4);
  const sn = regression(x2, x2.map((x) => 2.5 * Math.sin(1.3 * x + 0.7) + 4), "sin");
  [2.5, 1.3, 0.7, 4].forEach((c, i) => near(sn.p[i], c, 1e-5));
  near(sn.r2, 1, 1e-9);
  const px = [1, 2, 3, 4, 5, 6];
  const ln = regression(px, px.map((x) => 2 + 3 * Math.log(x)), "log");
  near(ln.p[0], 2, 1e-9);
  near(ln.p[1], 3, 1e-9);
  const ex = regression(px, px.map((x) => 5 * 1.5 ** x), "exp");
  near(ex.p[0], 5, 1e-9);
  near(ex.p[1], 1.5, 1e-9);
  const pw = regression(px, px.map((x) => 4 * x ** 0.5), "pow");
  near(pw.p[0], 4, 1e-9);
  near(pw.p[1], 0.5, 1e-9);
});

test("TVM: posojilo 200000, 30 let, 6 % → PMT = −1199,10; nazaj I, N, PV, FV; konec/začetek", () => {
  const v = { N: 360, I: 6, PV: 200000, PMT: NaN, FV: 0, PY: 12, CY: 12, begin: false };
  const r = TC.tvm(v, "PMT");
  near(r.PMT, -1199.101, 1e-6);
  near(TC.tvm({ ...v, PMT: r.PMT, I: NaN }, "I").I, 6, 1e-8);
  near(TC.tvm({ ...v, PMT: r.PMT, N: NaN }, "N").N, 360, 1e-8);
  near(TC.tvm({ ...v, PMT: r.PMT, PV: NaN }, "PV").PV, 200000, 1e-6);
  // 12 × 100 € mesečno po 12 % (i = 1 %): FV = 100·(1,01¹² − 1)/0,01 = 1268,25; na začetku ×1,01 = 1280,93
  const s = { N: 12, I: 12, PV: 0, PMT: -100, FV: NaN, PY: 12, CY: 12, begin: false };
  near(TC.tvm(s, "FV").FV, 1268.2503, 1e-6);
  near(TC.tvm({ ...s, begin: true }, "FV").FV, 1280.9328, 1e-6);
  // letno obrestovanje, mesečna plačila: i = 1,06^(1/12) − 1
  const ip = 1.06 ** (1 / 12) - 1;
  near(TC.tvm({ N: 12, I: 6, PV: 1000, PMT: NaN, FV: 0, PY: 12, CY: 1, begin: false }, "PMT").PMT, (-1000 * ip) / (1 - (1 + ip) ** -12), 1e-9);
  near(TC.tvm({ N: 10, I: 0, PV: 500, PMT: NaN, FV: 0, PY: 1, CY: 1, begin: false }, "PMT").PMT, -50, 1e-12);
  assert.equal(TC.tvm({ ...v, N: NaN }, "PMT"), null);
});

test("tabela vrednosti: f(x), g(x), korak, omejitve", () => {
  const r = TC.valueTable({ f: "x^2", g: "2x+1", start: -1, step: 0.5, rows: 5 });
  assert.deepEqual(r.xs, [-1, -0.5, 0, 0.5, 1]);
  assert.deepEqual(r.f, [1, 0.25, 0, 0.25, 1]);
  assert.deepEqual(r.g, [-1, 0, 1, 2, 3]);
  assert.equal(TC.valueTable({ f: "x", start: 0, step: 1, rows: 201 }).error, "range");
  assert.equal(TC.valueTable({ f: "x+a", start: 0, step: 1, rows: 3 }).error, "var");
  assert.equal(TC.valueTable({ f: "x", start: 0, step: 1, rows: 3 }).g, null);
  assert.ok(!Number.isFinite(TC.valueTable({ f: "1/x", start: 0, step: 1, rows: 2 }).f[0]));
});

test("ANOVA, F-test in F-porazdelitev (TI-84 ANOVA, 2-SampFTest)", () => {
  const a = TC.anova([[3, 4, 5, 4], [6, 7, 6, 8], [5, 5, 6, 4]]);
  assert.deepEqual([a.factor.df, a.error.df], [2, 9]);
  assert.ok(Math.abs(a.factor.ss - 15.5) < 1e-9 && Math.abs(a.error.ss - 6.75) < 1e-9);
  assert.ok(Math.abs(a.stat - 31 / 3) < 1e-9);
  // F(2, d2): P(F > x) = (1 + 2x/d2)^(−d2/2)
  assert.ok(Math.abs(a.p - (1 + (2 * a.stat) / 9) ** -4.5) < 1e-9, `p = ${a.p}`);
  assert.equal(a.reject, true);
  assert.ok(Math.abs(a.sxp - Math.sqrt(0.75)) < 1e-12);
  assert.equal(TC.anova([[1, 2]]), null, "ena skupina");
  assert.equal(TC.anova([[1], [2]]), null, "brez prostostnih stopenj znotraj skupin");
  // F(d1, d2): gostota se integrira v cdf
  const f = TC.fDist(3, 10);
  let s = 0;
  for (let i = 0; i < 10000; i++) s += f.pdf(1 + (i + 0.5) * 1e-4) * 1e-4;
  assert.ok(Math.abs(s - (f.cdf(2) - f.cdf(1))) < 1e-5);
  // F-test: F = s1²/s2², dvostranski p = 2·min(rep); F(1, 1) je simetričen okoli 1 v log merilu
  const ft = TC.fTest2({ s: 2, n: 10 }, { s: 1.5, n: 12 });
  assert.ok(Math.abs(ft.stat - 16 / 9) < 1e-12);
  assert.deepEqual([ft.df1, ft.df2], [9, 11]);
  assert.ok(ft.p > 0.3 && ft.p < 0.4 && !ft.reject);
  assert.ok(Math.abs(TC.fTest2({ s: 3, n: 5 }, { s: 1, n: 5 }, "gt").p - (1 - TC.fDist(4, 4).cdf(9))) < 1e-12);
  assert.ok(Math.abs(TC.fTest2({ s: 1, n: 5 }, { s: 1, n: 5 }).p - 1) < 1e-9);
});

test("Denarni tokovi: NPV, IRR, NFV, vračilna doba; amortizacija ΣInt, ΣPrn, bal kot TI-84", () => {
  const cf = [-1000, 300, 400, 500];
  assert.ok(Math.abs(TC.npv(10, cf) - (-1000 + 300 / 1.1 + 400 / 1.21 + 500 / 1.331)) < 1e-9);
  const irr = TC.irr(cf);
  assert.ok(Math.abs(TC.npv(irr, cf)) < 1e-7, `IRR ${irr}`);
  assert.ok(Math.abs(irr - 8.896) < 0.001);
  assert.equal(TC.irr([100, 200]), null, "isti predznak");
  const r = TC.cashFlow(10, cf);
  assert.ok(Math.abs(r.nfv - r.npv * 1.331) < 1e-9);
  assert.ok(Math.abs(r.pbp - 2.6) < 1e-12, "−700, −300, +200 → 2 + 300/500");
  assert.equal(r.dpbp, null, "z diskontiranjem se ne povrne");
  assert.deepEqual(TC.readFlows([[-1000], [300, 3]]), [-1000, 300, 300, 300]);
  assert.equal(TC.readFlows([[300, 0]]), null);
  // posojilo 200 000, 30 let, 6 %: PMT = −1199,10; prvo plačilo 1000 obresti, ΣInt za 1. leto −11 933,19
  const v = { N: 360, I: 6, PV: 200000, FV: 0, PY: 12, CY: 12, begin: false };
  const pmt = TC.tvm({ ...v, PMT: NaN }, "PMT").PMT;
  const rows = TC.amortize({ ...v, PMT: pmt });
  assert.equal(rows.length, 360);
  assert.ok(Math.abs(rows[0].int + 1000) < 1e-6 && Math.abs(rows[0].prn - (pmt + 1000)) < 1e-6);
  assert.ok(Math.abs(rows[359].bal) < 1e-5, "na koncu ni dolga");
  const y1 = TC.amortSum(rows, 1, 12);
  assert.ok(Math.abs(y1.int + 11933.19) < 0.01 && Math.abs(y1.prn + 2456.02) < 0.01 && Math.abs(y1.bal - 197543.98) < 0.01);
  assert.ok(Math.abs(y1.int + y1.prn - 12 * pmt) < 1e-6);
  assert.equal(TC.amortSum(rows, 0, 12), null);
  // plačilo na začetku obdobja: prvo plačilo je samo glavnica
  const pb = TC.tvm({ ...v, begin: true, PMT: NaN }, "PMT").PMT;
  const rb = TC.amortize({ ...v, begin: true, PMT: pb });
  assert.equal(rb[0].int, 0);
  assert.ok(Math.abs(rb[359].bal) < 1e-5);
});

test("Pol/Rec sredi izraza: vektorji, skalarni produkt, dolžina; Pol le zunaj", () => {
  const env = { deg: true };
  const pair = (s) => analyze(s, env).items.map((x) => x.v);
  const near2 = (a, b) => a.every((x, i) => Math.abs(x - b[i]) < 1e-9);
  assert.ok(near2(pair("Pol(3;4)"), [5, Math.atan2(4, 3) * (180 / Math.PI)]));
  assert.ok(near2(pair("pol(3;4)"), [5, Math.atan2(4, 3) * (180 / Math.PI)]));
  const c = Math.sqrt(3) / 2;
  assert.ok(near2(pair("Rec(5;30)+Rec(3;120)"), [5 * c - 1.5, 2.5 + 3 * c]));
  assert.ok(near2(pair("Pol(Rec(5;30)+Rec(3;120))"), [Math.sqrt(34), 30 + (Math.atan2(3, 5) * 180) / Math.PI]));
  assert.ok(near2(pair("2Rec(2;30)-Rec(1;0)/2"), [4 * c - 0.5, 2]));
  assert.ok(near2(pair("-Rec(2;90)"), [0, -2]));
  assert.ok(Math.abs(analyze("Rec(2;0)·Rec(3;60)", env).value - 3) < 1e-9, "skalarni produkt");
  assert.ok(Math.abs(analyze("|Rec(5;30)-Rec(3;120)|", env).value - Math.sqrt(34)) < 1e-9, "dolžina");
  assert.ok(near2(pair("Rec(2;π/6)").slice(0, 1), [2 * Math.cos(Math.PI / 6 * Math.PI / 180)]), "v stopinjah je π/6 kot v stopinjah");
  assert.ok(near2(analyze("Rec(2;π/6)", { deg: false }).items.map((x) => x.v), [Math.sqrt(3), 1]));
  for (const [s, code] of [["2Pol(3;4)", "polInside"], ["√(Pol(3;4))", "polInside"], ["Pol(1;1)·Rec(2;0)", "polInside"], ["Rec(2;30)+1", "vecMix"], ["sin(Rec(1;2))", "vecOp"], ["1/Rec(1;2)", "vecOp"]]) assert.equal(analyze(s, env).error?.code, code, s);
  assert.deepEqual(analyze("Pol(a;4)", env).error, { code: "missing", info: { names: ["a"] } });
  assert.equal(analyze("Pol(a;4)", { ...env, vars: { a: 3 } }).items[0].v, 5);
  // način graf: Rec je točka, z drsnikom ali t tudi krivulja
  const m = (texts) => {
    const s = emptyState();
    s.items = texts.map((t, i) => ({ id: `i${i}`, type: "expr", text: t, color: i }));
    return buildModel(s);
  };
  const g = m(["Rec(2, π/6)", "Rec(1, 0) + Rec(1, π/2)", "Rec(2, t)", "Rec(1, 0) + 1"]);
  assert.deepEqual(g.items.map((o) => o.kind), ["points", "points", "param", "error"]);
  assert.ok(near2(g.items[0].evalPoints()[0], [Math.sqrt(3), 1]));
  assert.ok(near2(g.items[1].evalPoints()[0], [1, 1]));
  assert.ok(Math.abs(g.items[2].fy(Math.PI / 2) - 2) < 1e-12);
});

test("Denarni tokovi: robni primeri (velik IRR, prvi tok 0, brez ničle)", () => {
  assert.ok(Math.abs(TC.irr([-1, 100]) - 9900) < 0.01, "IRR 9900 %");
  assert.ok(Math.abs(TC.cashFlow(0, [0, -100, 200]).pbp - 1.5) < 1e-12, "prvi tok 0");
  assert.equal(TC.irr([-100, 200, -500]), null, "mešani predznaki, NPV nikoli 0");
  assert.equal(TC.cashFlow(0, [-100, 50]).pbp, null);
});

import { regressionX, regressionTex, MODELS } from "../public/graph/model.js";
import { stats2, expandFreq, logic32 } from "../public/graph/toolscore.js";
import { fisherF } from "../public/graph/probcore.js";

test("regresija: logistična z leti kot x (brez a = ∞), e^x in 1/x, obratna napoved x̂", () => {
  assert.ok(MODELS.includes("expe") && MODELS.includes("inv"));
  const L = (x) => 300 / (1 + Math.exp(-0.6 * (x - 2007)));
  const yr = [...Array(15).keys()].map((i) => 2000 + i);
  const lg = regression(yr, yr.map(L), "logistic");
  assert.ok(lg.r2 > 0.999999 && Number.isFinite(lg.p[1] + lg.p[2] + lg.xm), JSON.stringify(lg));
  near(lg.fn(2010), L(2010), 1e-4);
  near(lg.xm, 2007, 1e-4);
  assert.match(regressionTex(lg), /2007/); // pri velikem a zapis c/(1 + e^{−b(x − xm)})
  near(regressionX(lg, 150)[0], 2007, 1e-4);
  const xs = [1, 2, 3, 4, 5, 6];
  const ee = regression(xs, xs.map((x) => 2 * Math.exp(0.3 * x)), "expe");
  near(ee.p[0], 2, 1e-6);
  near(ee.p[1], 0.3, 1e-6);
  near(regressionX(ee, 2 * Math.exp(0.9))[0], 3, 1e-6);
  const iv = regression(xs, xs.map((x) => 4 + 6 / x), "inv");
  near(iv.p[0], 4, 1e-9);
  near(iv.p[1], 6, 1e-9);
  near(regressionX(iv, 7)[0], 2, 1e-9);
  const lin = regression([1, 2, 3, 4, 5], [2, 4, 5, 4, 5], "lin");
  near(lin.p[0], 0.6);
  near(lin.p[1], 2.2);
  near(regressionX(lin, 5)[0], 14 / 3);
  const q = regression([-2, -1, 0, 1, 2], [4, 1, 0, 1, 4], "quad");
  assert.deepEqual(regressionX(q, 9).map((v) => +v.toFixed(6)), [-3, 3]);
  assert.deepEqual(regressionX(q, -1), []);
  assert.equal(regressionX(regression(xs, xs.map((x) => x ** 3), "cubic"), 8), null);
});

test("statistika 2 spremenljivk in pogostosti (kot Casio fx-991CW)", () => {
  const s = stats2([1, 2, 3, 4, 5], [2, 4, 5, 4, 5]);
  assert.equal(s.n, 5);
  assert.deepEqual([s.sx, s.sy, s.sxx, s.syy, s.sxy], [15, 20, 55, 86, 66]);
  near(s.mx, 3);
  near(s.my, 4);
  near(s.sdPx, Math.SQRT2);
  near(s.sdSx, Math.sqrt(2.5));
  near(s.r, 0.7745966692);
  assert.equal(stats2([1, 2], [3]), null);
  assert.ok(Number.isNaN(stats2([1, 1, 1], [1, 2, 3]).r));
  near(stats2([1e200, 2e200, 3e200], [1, 2, 3]).r, 1); // Σx² = ∞, r pa ostane 1
  assert.deepEqual(expandFreq([1, 2, 3], [2, 0, 1]), [1, 1, 3]);
  assert.equal(expandFreq([1, 2], [1]), null);
  assert.equal(expandFreq([1, 2], [1, 1.5]), null);
  const st = stats(expandFreq([2, 4, 5], [1, 3, 2]));
  near(st.mean, 24 / 6);
  near(st.sumSq, 4 + 48 + 50);
});

test("številski sistemi: logične operacije na 32 bitih", () => {
  assert.equal(logic32(12n, 10n, "and")[10], "8");
  assert.equal(logic32(12n, 10n, "or")[2], "1110");
  assert.equal(logic32(2024n, 1000n, "xor")[16], "400");
  assert.equal(logic32(5n, 0n, "not")[10], "-6");
  assert.equal(logic32(5n, 0n, "not")[16], "FFFFFFFA");
  assert.equal(logic32(1n, 0n, "neg")[2], "1".repeat(32));
  assert.equal(logic32(0n, 0n, "xnor")[10], "-1");
  assert.equal(logic32(2n ** 31n, 1n, "and"), null);
  assert.equal(logic32(-(2n ** 31n), 0n, "neg")[10], "-2147483648");
  assert.equal(convertBase("FF", 16).value, 255n);
});

test("matrike: sled, karakteristični polinom, lastne vrednosti", () => {
  assert.equal(M.trace([[2, 1], [1, 3]]), 5);
  assert.deepEqual(M.charPoly([[2, 1], [1, 3]]).map((v) => Math.round(v * 1e9) / 1e9), [1, -5, 5]);
  const ev = M.eigen([[2, 0, 0], [0, 3, 4], [0, 4, 9]]);
  assert.deepEqual(ev.map(([re, im]) => [+re.toFixed(9), +im.toFixed(9)]), [[1, 0], [2, 0], [11, 0]]);
  const rot = M.eigen([[0, -1], [1, 0]]); // ±i
  assert.deepEqual(rot.map(([re, im]) => [+re.toFixed(9) + 0, Math.abs(+im.toFixed(9))]), [[0, 1], [0, 1]]);
  assert.equal(M.trace([[1, 2, 3]]), null);
  // večkratne lastne vrednosti (QR, ne ničle polinoma): I in Jordanov blok brez »kompleksnega« šuma
  const I10 = Array.from({ length: 10 }, (_, i) => Array.from({ length: 10 }, (_, j) => (i === j ? 1 : 0)));
  assert.deepEqual(M.eigen(I10), Array(10).fill([1, 0]));
  assert.deepEqual(M.eigen([[2, 1, 0], [0, 2, 1], [0, 0, 2]]), [[2, 0], [2, 0], [2, 0]]);
  assert.deepEqual(M.eigen([[5]]), [[5, 0]]);
});

test("Fisherjeva F: kvantil, pričakovana vrednost, isto kot F-test", () => {
  const F = fisherF(5, 10);
  near(F.inv(0.95), 3.325834530, 1e-6);
  near(F.cdf(F.inv(0.3)), 0.3, 1e-9);
  near(F.mean, 10 / 8);
  near(TC.fDist(5, 10).cdf(2), F.cdf(2), 1e-12);
});

test("enota kota GRA (gradi): 400 v polnem krogu, kot Casio", () => {
  const G = { grad: true };
  near(ev("sin(100)", G), 1);
  near(ev("tan(50)", G), 1);
  assert.equal(ev("cos(100)", G), 0); // točno 0, ne 10⁻¹⁶
  near(ev("arcsin(1)", G), 100);
  near(ev("arctan(1)", G), 50);
  near(ev("90°", G), 100); // stopinje v gradih
  near(ev("sin(90°)", G), 1);
  // enačbe: rešitve na eni periodi [0; 400)
  const r = analyze("sin(x) = 1", G);
  assert.deepEqual(r.roots.map(Math.round), [100]);
  assert.equal(r.grad, true);
  assert.match(r.interval, /400\^\{\\mathrm\{g\}\}/);
  assert.match(solutionTex(r), /100\^\{\\mathrm\{g\}\}/);
  // Pol v gradih, odvod vedno v radianih
  const p = analyze("Pol(1; 1)", G);
  near(p.items[1].v, 50);
  assert.equal(p.grad, true);
  assert.equal(analyze("d/dx(sin(x))", G).resTex, "\\cos\\left(x\\right)");
});

test("točne vrednosti kotnih funkcij na pravih kotih (cos 90° = 0, tan 90° ne obstaja)", () => {
  assert.equal(ev("cos(90)", { deg: true }), 0);
  assert.equal(ev("sin(180)", { deg: true }), 0);
  assert.equal(ev("sin(-90)", { deg: true }), -1);
  assert.equal(ev("cos(π)"), -1);
  assert.equal(ev("sin(π)"), 0);
  assert.ok(Number.isNaN(evaluate("tan(90)", { deg: true }).value));
  assert.ok(Number.isNaN(evaluate("1/cos(90)", { deg: true }).value) || !Number.isFinite(evaluate("1/cos(90)", { deg: true }).value));
  near(ev("tan(45)", { deg: true }), 1);
  near(ev("sin(30)", { deg: true }), 0.5);
});

test("stopinje, minute, sekunde: vnos 30°15′20″ in izpis °′″", () => {
  const D = { deg: true };
  near(ev("30°15′20″", D), 30 + 15 / 60 + 20 / 3600);
  near(ev("-30°15′", D), -30.25); // minus velja za ves kot
  near(ev("2·30°15′", D), 60.5);
  near(ev("15′", D), 0.25);
  near(ev("30°15′ + 10°50′", D), 41.0833333333);
  near(ev("sin(30°0′)", D), 0.5);
  near(ev("30°30′", {}), (30.5 * Math.PI) / 180); // v radianih
  near(ev("1,5°30′", D), 2);
  assert.equal(evaluate("30°15′20″", D).tex, "30^{\\circ}15^{\\prime}20^{\\prime\\prime}");
  assert.deepEqual(dmsOf(30 + 15 / 60 + 20 / 3600), { text: "30°15′20″", tex: "30^{\\circ}15^{\\prime}20^{\\prime\\prime}" });
  assert.equal(dmsOf(-30.25).text, "−30°15′0″");
  assert.equal(dmsOf(359.99999).text, "359°59′59,96″");
  assert.equal(dmsOf(12.5, { comma: false }).text, "12°30′0″");
  assert.equal(dmsOf(NaN), null);
  // izpis gre nazaj v vnos
  near(ev(dmsOf(48.123456).text.replace("−", "-"), D), 48.123456, 1e-5);
});

test("matrike: enotska matrika I_n in potenca A^n", () => {
  assert.deepEqual(M.identity(3), [[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
  const A = [[1, 1], [1, 0]];
  assert.deepEqual(M.pow(A, 10), [[89, 55], [55, 34]]); // Fibonaccijeva števila
  assert.deepEqual(M.pow(A, 0), M.identity(2));
  assert.deepEqual(M.pow([[2, 0], [0, 4]], -1), [[0.5, 0], [0, 0.25]]);
  assert.equal(M.pow([[1, 2], [2, 4]], -1), null); // singularna
  assert.equal(M.pow([[1, 2, 3]], 2), null); // ni kvadratna
});

test("razmerje a : b = c : d z neznanko na katerem koli mestu", () => {
  assert.deepEqual(solveRatio([2, 3, 4, NaN]), { i: 3, value: 6 });
  assert.deepEqual(solveRatio([NaN, 3, 4, 6]), { i: 0, value: 2 });
  assert.deepEqual(solveRatio([2, NaN, 4, 6]), { i: 1, value: 3 });
  assert.deepEqual(solveRatio([2, 3, NaN, 6]), { i: 2, value: 4 });
  near(solveRatio([3, 7, 1, NaN]).value, 7 / 3);
  assert.deepEqual(solveRatio([0, 3, 4, NaN]), { error: "zero" });
  assert.deepEqual(solveRatio([2, 3, NaN, NaN]), { error: "count" });
  assert.deepEqual(solveRatio([2, 3, 4, 6]), { error: "count" });
});
