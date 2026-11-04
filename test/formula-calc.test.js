// Cele formule v kalkulatorju: formule iz zbirke (public/graph/formula-calc.js) in kemijske formule M(H2SO4)
// (public/graph/molska.js) v znanstvenem kalkulatorju.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { formulaToCalc, vRadianih } from "../public/graph/formula-calc.js";
import { chemSub, chemText, chemTex, chemNumbers } from "../public/graph/molska.js";
import { analyze, previewTex } from "../public/graph/scisolve.js";
import { evaluate } from "../public/graph/scicore.js";
import { molarMass } from "../public/graph/toolscore.js";
import { MASSES } from "../public/graph/pse-data.js";
import { annotateTex } from "../public/formula-data.js";

const DIR = "content/formulas/";
// vse formule ($…$) iz vrstic tabel vseh zbirk, brez skritih blokov :::simboli
function formulas() {
  const out = [];
  for (const f of readdirSync(DIR).filter((x) => x.endsWith(".md"))) {
    const md = readFileSync(DIR + f, "utf8").replace(/:::simboli[\s\S]*?:::/g, "");
    for (const line of md.split("\n").filter((l) => l.startsWith("|")))
      for (const m of line.matchAll(/\$([^$]+)\$/g)) out.push({ sheet: f.replace(".md", ""), tex: m[1] });
  }
  return out;
}

// vrednost ene strani enačbe pri danih vrednostih črk (null, če je ni mogoče izračunati)
function side(text, vars) {
  const r = evaluate(text, { vars, funcs: {}, deg: false });
  return r && !r.error && Number.isFinite(r.value) ? r.value : null;
}
function names(text) {
  const r = evaluate(text, { vars: {}, funcs: {} });
  return r?.error?.code === "missing" ? r.error.info.names : [];
}

test("formula iz zbirke: kalkulator jo prebere in pomeni isto kot LaTeX", () => {
  const all = formulas();
  assert.ok(all.length > 800, `formul: ${all.length}`);
  let n = 0;
  for (const { sheet, tex } of all) {
    const subject = sheet.slice(0, 3);
    const text = formulaToCalc(tex, subject);
    // v aplikaciji gumb bere LaTeX iz KaTeX MathML, kjer so simboli oviti v \htmlData (klikljive formule)
    const shown = formulaToCalc(annotateTex(tex, subject), subject);
    assert.equal(shown?.replace(/\s/g, ""), text?.replace(/\s/g, ""), `${sheet}: ${tex} z oznakami`);
    if (text == null) continue;
    n++;
    const r = analyze(text, { vars: {}, funcs: {} });
    assert.ok(r && (!r.error || r.error.code === "missing"), `${sheet}: ${tex} → ${text}: ${JSON.stringify(r?.error)}`);
    assert.equal((text.match(/=/g) || []).length, 1, `${sheet}: ${tex} → ${text}: ena zveza`);
    // lepšanje (oklepaji, ², ₀, √) ne spremeni pomena: obe strani sta enaki pri naključnih vrednostih črk
    const raw = formulaToCalc(tex, subject, { surovo: true });
    const sides = text.split("=");
    const rawSides = raw.split("=");
    const vars = {};
    let seed = 7;
    for (const v of new Set([...names(sides[0]), ...names(sides[1]), ...names(rawSides[0]), ...names(rawSides[1])])) vars[v] = 1.2 + ((seed = (seed * 7919) % 104729) % 1000) / 700;
    for (const k of [0, 1]) {
      const a = side(sides[k], vars);
      const b = side(rawSides[k], vars);
      assert.ok(a === b || (a != null && b != null && Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a))), `${sheet}: ${tex}: ${raw} ≠ ${text} (${b} ≠ ${a})`);
    }
  }
  assert.ok(n >= 300, `v kalkulator gre ${n} formul`);
});

test("formula iz zbirke: primeri pretvorbe", () => {
  const cases = [
    ["s = v t", "FIZ", "s = v t"],
    ["v = v_0 + a t", "FIZ", "v = v₀ + a t"],
    ["F = \\dfrac{G m_1 m_2}{r^2}", "FIZ", "F = (G m₁ m₂)/r²"],
    ["\\; v_2 = \\sqrt{\\dfrac{2 G M}{R}}", "FIZ", "v₂ = √((2 G M)/R)"],
    ["\\; s = v_0 t + \\dfrac{a t^2}{2}", "FIZ", "s = v₀ t + (a t²)/2"],
    ["\\vec{F} = m \\vec{a}", "FIZ", "F = m a"],
    ["\\; \\Delta W = \\Delta m\\, c^2", "FIZ", "ΔW = Δm c²"],
    ["F_{vz} = \\rho_{\\text{tek}}\\, g\\, V_{\\text{izp}}", "FIZ", "F_(vz) = ρ_(tek) g V_(izp)"],
    ["v = \\dfrac{2 \\pi r}{t_0} = \\omega r", "FIZ", "v = (2 π r)/t₀"],
    ["n = \\dfrac{m}{M}", "KEM", "n = m/M"],
    ["\\dfrac{p_1 V_1}{T_1} = \\dfrac{p_2 V_2}{T_2}", "KEM", "(p₁ V₁)/T₁ = (p₂ V₂)/T₂"],
    ["c^2 = a^2 + b^2", "MAT", "c² = a² + b²"],
    ["\\dfrac{1}{f} = \\dfrac{1}{a} + \\dfrac{1}{b}", "FIZ", "1/f = 1/a + 1/b"],
    ["y = k x + n", "MAT", "y = k x + n"],
    ["o = \\dfrac{a}{b} : \\dfrac{c}{d}", "MAT", "o = (a/b) : (c/d)"],
    ["d = a\\sqrt{2}", "MAT", "d = a √(2)"],
    // argument funkcije z več faktorji v oklepaju: vpisana števila (sin 2·30) ostanejo v argumentu
    ["D = \\dfrac{v_0^2 \\sin 2\\alpha}{g}", "FIZ", "D = (v₀² sin(2α))/g"],
    ["x = x_0 \\sin \\omega t", "FIZ", "x = x₀ sin(ω t)"],
    ["A = F s \\cos \\varphi", "FIZ", "A = F s cos φ"],
  ];
  for (const [tex, subj, want] of cases) assert.equal(formulaToCalc(tex, subj), want, tex);
  // kar kalkulator ne zna ali bi pomenilo kaj drugega: brez gumba
  for (const [tex, subj] of [
    ["\\int_a^b f(x)\\,dx = F(b) - F(a)", "MAT"],
    ["x_{1,2} = \\dfrac{-b \\pm \\sqrt{D}}{2a}", "MAT"],
    ["P(A') = 1 - P(A)", "MAT"],
    ["(\\sin x)' = \\cos x", "MAT"],
    ["\\sum_{k=1}^n k = \\dfrac{n(n+1)}{2}", "MAT"],
    ["F = \\dfrac{e_1 e_2}{4 \\pi \\varepsilon_0 r^2}", "FIZ"], // e je v kalkulatorju 2,718…
    ["\\tau = F r \\sin\\alpha", "FIZ"], // τ je v kalkulatorju 2π
    ["\\hbar = \\dfrac{h}{2\\pi}", "FIZ"], // neznan ukaz bi postal h·b·a·r
    ["C_n^r = \\dbinom{n}{r}", "MAT"],
    ["dV = r\\,dr\\,d\\varphi\\,dz", "MAT"],
    ["A\\vec{x} = \\vec{b}", "MAT"],
    ["g = 9{,}81\\,\\mathrm{m/s^2}", "FIZ"],
    ["\\mathrm{pH} = -\\log [\\mathrm{H_3O^+}]", "KEM"],
    ["a < b", "MAT"],
    ["S = \\dfrac{e f}{2}", "MAT"], // e je v matematiki Eulerjevo število
    ["e^2 = a^2 - b^2", "MAT"],
    ["a^0 = 1", "MAT"], // ena sama črka: istovetnost, ne račun
    ["i^2 = -1", "MAT"],
    ["E = D = \\lambda", "FIZ"], // veriga samih imen
    ["d x = \\Delta x", "MAT"],
    ["(A B)^{-1} = B^{-1} A^{-1}", "MAT"],
    // istovetnosti: ni neznanke, ki bi jo kalkulator izračunal
    ["a + b = b + a", "MAT"],
    ["(a + b)^2 = a^2 + 2 a b + b^2", "MAT"],
    ["\\dfrac{a}{b} : \\dfrac{c}{d} = \\dfrac{a}{b} \\cdot \\dfrac{d}{c}", "MAT"],
    ["\\sin^2 x + \\cos^2 x = 1", "MAT"],
  ])
    assert.equal(formulaToCalc(tex, subj), null, tex);
});

test("formula s koti v radianih preklopi kalkulator v RAD", () => {
  assert.equal(vRadianih("x = x₀ sin(ω t)"), true);
  assert.equal(vRadianih("sin(x + 2 k π) = sin x"), true);
  assert.equal(vRadianih("A = F s cos φ"), false);
  assert.equal(vRadianih("D = (v₀² sin(2α))/g"), false);
  assert.equal(vRadianih("sin θ_(min) = 1.22 (λ/D)"), false);
  assert.equal(vRadianih("F = m a"), false);
  const tools = readFileSync("public/graph/tools.js", "utf8");
  assert.ok(/angle: rad \? "rad"/.test(tools), "gumb pošlje angle: rad");
  const sci = readFileSync("public/graph/sci.js", "utf8");
  assert.ok(sci.includes("o.angle") && sci.includes("fromFormula"), "insert preklopi kot; črke formule niso shranjene spremenljivke");
});

test("formula v kalkulatorju: neznanko izračuna, ko vpišeš ostale vrednosti", () => {
  const solve = (text) => analyze(text, { vars: {}, funcs: {} });
  // s = v t, s = 100, v = 4 → t = 25
  assert.equal(solve("100 = 4 t").roots[0], 25);
  // Δt je ena neznanka, ne Δ · t; Δπ in Δe ostaneta Δ · π in Δ · e
  assert.deepEqual(analyze("Δπ = 2", { vars: {}, funcs: {} }).solveFor?.includes("Δπ") ?? false, false);
  const r = solve("6 = 3 Δt");
  assert.equal(r.kind, "solve");
  assert.equal(r.v, "Δt");
  assert.equal(r.roots[0], 2);
  // formula s samimi črkami: kalkulator ponudi »izrazi …« za vsako črko
  assert.deepEqual(solve(formulaToCalc("Q = m c \\Delta T", "FIZ")).solveFor.sort(), ["c", "m", "Q", "ΔT"].sort());
  // shranjene spremenljivke se upoštevajo: m = 2, a = 3 → F = 6
  assert.equal(analyze("F = m a", { vars: { m: 2, a: 3 }, funcs: {} }).value, 6);
});

test("M(H2SO4) v kalkulatorju je molska masa, tudi sredi računa in v enačbi", () => {
  const run = (text, fn = analyze) => {
    const k = chemSub(text);
    return k ? k.fix(fn(k.text, { vars: k.vars, funcs: {} })) : fn(text, { vars: {}, funcs: {} });
  };
  const M = molarMass("H2SO4", MASSES).M;
  assert.ok(Math.abs(M - 98.08) < 0.02);
  assert.equal(run("M(H2SO4)").value, M);
  assert.equal(run("M(H₂SO₄)·2").value, 2 * M);
  assert.equal(run("M(H2SO4)").tex, "M(\\mathrm{H_{2}SO_{4}})");
  // n = m/M: 2 g NaCl
  const n = run("2 = n·M(NaCl)");
  assert.equal(n.kind, "solve");
  assert.ok(Math.abs(n.roots[0] - 2 / molarMass("NaCl", MASSES).M) < 1e-12);
  assert.ok(n.tex.includes("M(\\mathrm{NaCl})"));
  assert.equal(run("m = 0,5·M(Ca(OH)2)").value, 0.5 * molarMass("Ca(OH)2", MASSES).M);
  assert.equal(run("M(CuSO4·5H2O)").value, molarMass("CuSO4·5H2O", MASSES).M);
  assert.equal(run("M(H2O) + M(H2O)").value, 2 * molarMass("H2O", MASSES).M);
  // predogled in sproten račun med tipkanjem
  assert.equal(run("M(NaCl)", evaluate).value, molarMass("NaCl", MASSES).M);
  assert.equal(run("2 = n·M(NaCl)", previewTex), "2 = n M(\\mathrm{NaCl})");
  // ni kemijska formula: ostane spomin M krat oklepaj
  assert.equal(chemSub("M(2 + 3)"), null);
  assert.equal(chemSub("M(Xx)"), null);
  assert.equal(chemSub("2M"), null);
  assert.equal(chemSub("xM(H2O)"), null);
  assert.equal(chemSub("sin(M(x))"), null);
  assert.equal(chemNumbers("2 = n·M(NaCl)"), `2 = n·${molarMass("NaCl", MASSES).M}`);
  assert.equal(chemNumbers("2 + 3"), "2 + 3");
  // telo funkcije, graf in ukaz za korake dobijo število, ne začasnega imena M_(kem0)
  const M2 = molarMass("H2O", MASSES).M;
  const f = run("f(x) = M(H2O)·x");
  assert.equal(f.kind, "func");
  assert.ok(!JSON.stringify(f).includes("kem"), JSON.stringify(f));
  assert.ok(f.body.includes(String(M2)), f.body);
  assert.ok(!JSON.stringify(run("y = M(H2O)·x")).includes("kem"));
  // 2M(H2O) je 2 · M(H2O)
  assert.equal(run("2M(H2O)").value, 2 * M2);
  assert.equal(chemText("CuSO4.5H2O"), "M(CuSO₄·5H₂O)");
  assert.equal(chemTex("CuSO4·5H2O"), "\\mathrm{CuSO_{4}\\cdot 5H_{2}O}");
});

test("periodni sistem vpiše celo formulo v kalkulator", () => {
  assert.equal(chemText("H2SO4"), "M(H₂SO₄)");
  assert.equal(chemText("CuSO4*5H2O"), "M(CuSO₄·5H₂O)");
  assert.equal(chemText("SO4^2-"), "M(SO₄)");
  assert.equal(chemText("NH4+"), "M(NH₄)");
  assert.equal(chemText("Fe"), "M(Fe)");
  assert.equal(chemText("Xy2"), null);
  assert.equal(chemText(""), null);
  const tools = readFileSync("public/graph/tools.js", "utf8");
  assert.ok(tools.includes("chemText(f)") && tools.includes("chemText(e.sym)"), "PSE: molska masa in element gresta v kalkulator kot M(…)");
  assert.ok(tools.includes("formulaToCalc(a.textContent, subject)"), "zbirka formul: gumb »V kalkulator«");
  const sci = readFileSync("public/graph/sci.js", "utf8");
  assert.ok(sci.includes("withChem(text, analyze)") && sci.includes("withChem(text, evaluate)"), "kalkulator bere M(…) ob = in med tipkanjem");
});
