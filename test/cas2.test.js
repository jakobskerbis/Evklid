// Simbolno računanje, 2. faza (public/graph/calculus.js): nedoločeni integral, limita, Taylorjev polinom.
// Primeri iz učbenikov za gimnazijo in 1. letnik fakultete ter z mature; calculus.js vsak rezultat sam preveri
// s števili, tu preverimo še zapis, napake (nikoli napačen rezultat) in časovno mejo.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCommand, runCas, commandName } from "../public/graph/cas.js";
import { analyze } from "../public/graph/scisolve.js";

const cas = (text, env = {}) => {
  const cmd = parseCommand(text);
  assert.ok(cmd, `${text} ni ukaz`);
  return runCas(cmd, env);
};
const res = (text, env) => {
  const r = cas(text, env);
  assert.ok(!r.error, `${text} → ${JSON.stringify(r.error)}`);
  assert.ok(!r.approx, `${text} ni točen`);
  return r.resTex;
};
const code = (text, env) => cas(text, env).error?.code;

test("integral: potenca, linearnost, tabela, linearna substitucija", () => {
  assert.equal(res("integriraj(x³+2x−5)"), "\\frac{x^{4}}{4} + x^{2} - 5x + C");
  assert.equal(res("integriraj(1/x)"), "\\ln\\left|x\\right| + C");
  assert.equal(res("integriraj(x^(-3))"), "-\\frac{1}{2x^{2}} + C");
  assert.equal(res("integriraj(√x)"), "\\frac{2}{3}\\sqrt{x^{3}} + C");
  assert.equal(res("integriraj(cos(3x+1))"), "\\frac{1}{3}\\sin\\left(3x+1\\right) + C");
  assert.equal(res("integrate(e^(2x))"), "\\frac{1}{2}e^{2x} + C");
  assert.equal(res("integriraj(2^x)"), "\\frac{2^{x}}{\\ln 2} + C");
  assert.equal(res("integriraj(1/cos(x)²)"), "\\tan\\left(x\\right) + C");
  assert.equal(res("integriraj(1/sin(x)^2)"), "-\\cot\\left(x\\right) + C");
  assert.equal(res("integriraj(1/(x²+1))"), "\\arctan\\left(x\\right) + C");
  assert.equal(res("integriraj(1/√(1−x²))"), "\\arcsin\\left(x\\right) + C");
  assert.equal(res("integriraj(1/√(4−x²))"), "\\arcsin\\left(\\frac{x}{2}\\right) + C");
  assert.equal(res("integriraj(sin²x)"), "\\frac{x}{2} - \\frac{1}{4}\\sin\\left(2x\\right) + C");
  assert.equal(res("integriraj(tan x)"), "-\\ln\\left|\\cos\\left(x\\right)\\right| + C");
  assert.equal(res("integriraj(sinh x)"), "\\cosh\\left(x\\right) + C");
  // konstante in črke
  assert.equal(res("integriraj(3)"), "3x + C");
  assert.equal(res("integriraj(0)"), "C");
  assert.equal(res("integriraj(a·x²)"), "\\frac{a x^{3}}{3} + C");
  assert.equal(res("integriraj(sin(ωt); t)"), "-\\frac{\\cos\\left(\\omega t\\right)}{\\omega} + C");
  assert.equal(cas("integriraj(x·eˣ)").tex, "\\int x e^{x}\\,dx");
});

test("integral: per partes, u-substitucija, eksponentna · trigonometrična", () => {
  assert.equal(res("integriraj(x·eˣ)"), "x e^{x} - e^{x} + C");
  assert.equal(res("integriraj(x²·eˣ)"), "x^{2}e^{x} - 2x e^{x} + 2e^{x} + C");
  assert.equal(res("integriraj((x+1)·eˣ)"), "x e^{x} + C");
  assert.equal(res("integriraj(x²·sin x)"), "-x^{2}\\cos\\left(x\\right) + 2x\\sin\\left(x\\right) + 2\\cos\\left(x\\right) + C");
  assert.equal(res("integriraj(x·sin(2x))"), "-\\frac{x}{2}\\cos\\left(2x\\right) + \\frac{1}{4}\\sin\\left(2x\\right) + C");
  assert.equal(res("integriraj(ln x)"), "x\\ln\\left(x\\right) - x + C");
  assert.equal(res("integriraj(x·ln x)"), "\\frac{x^{2}}{2}\\ln\\left(x\\right) - \\frac{x^{2}}{4} + C");
  assert.equal(res("integriraj(arctan x)"), "x\\arctan\\left(x\\right) - \\frac{1}{2}\\ln\\left(x^{2}+1\\right) + C");
  assert.equal(res("integriraj(2x·cos(x²))"), "\\sin\\left(x^{2}\\right) + C");
  assert.equal(res("integriraj(sin(x)·cos(x))"), "\\frac{1}{2}\\sin^{2}\\left(x\\right) + C");
  assert.equal(res("integriraj(x·√(x²+1))"), "\\frac{1}{3}\\sqrt{\\left(x^{2}+1\\right)^{3}} + C");
  assert.equal(res("integriraj(ln(x)/x)"), "\\frac{1}{2}\\ln^{2}\\left(x\\right) + C");
  assert.equal(res("integriraj(1/(x·ln x))"), "\\ln\\left|\\ln\\left(x\\right)\\right| + C");
  assert.equal(res("integriraj(eˣ/(1+eˣ))"), "\\ln\\left|1+e^{x}\\right| + C");
  assert.equal(res("integriraj(sin(x)·e^(cos x))"), "-e^{\\cos\\left(x\\right)} + C");
  assert.equal(res("integriraj(eˣ·sin x)"), "\\frac{1}{2}e^{x}\\sin\\left(x\\right) - \\frac{1}{2}e^{x}\\cos\\left(x\\right) + C");
});

test("integral: racionalne funkcije (deljenje, delni ulomki, ln in arctan)", () => {
  assert.equal(res("integriraj(1/(x²−1))"), "\\frac{1}{2}\\ln\\left|x-1\\right| - \\frac{1}{2}\\ln\\left|x+1\\right| + C");
  assert.equal(res("integriraj((2x+3)/(x²+3x+2))"), "\\ln\\left|x+1\\right| + \\ln\\left|x+2\\right| + C");
  assert.equal(res("integriraj(x/(x²+1))"), "\\frac{1}{2}\\ln\\left(x^{2}+1\\right) + C");
  assert.equal(res("integriraj(1/(x+1)²)"), "-\\frac{1}{x+1} + C");
  assert.equal(res("integriraj(x/(x+1)^2)"), "\\ln\\left|x+1\\right| + \\frac{1}{x+1} + C");
  assert.equal(res("integriraj((x²+1)/(x−1))"), "\\frac{x^{2}}{2} + x + 2\\ln\\left|x-1\\right| + C");
  assert.equal(res("integriraj(5/(2x+3))"), "\\frac{5}{2}\\ln\\left|2x+3\\right| + C");
  assert.equal(res("integriraj(1/(x²+x+1))"), "\\frac{2\\sqrt{3}}{3}\\arctan\\left(\\frac{2x+1}{\\sqrt{3}}\\right) + C");
  assert.equal(res("integriraj(1/(x²−2))"), "\\frac{\\sqrt{2}}{4}\\ln\\left|\\frac{x-\\sqrt{2}}{x+\\sqrt{2}}\\right| + C");
  assert.equal(res("integriraj(1/(x³+1))"), "\\frac{1}{3}\\ln\\left|x+1\\right| + \\frac{\\sqrt{3}}{3}\\arctan\\left(\\frac{2x-1}{\\sqrt{3}}\\right) - \\frac{1}{6}\\ln\\left(x^{2}-x+1\\right) + C");
});

test("integral: česar ne zna, ne ugiba (nikoli napačen rezultat)", () => {
  for (const t of ["integriraj(e^(x²))", "integriraj(sin(x)/x)", "integriraj(x^x)", "integriraj(1/(x⁴+1))", "integriraj(1/(x²+1)²)", "integriraj(sin(sin(x)))"]) assert.equal(code(t), "casIntegral", t);
  assert.equal(code("integriraj(x^2; 2)"), "casVarName");
  assert.equal(code("integriraj()"), "casEmpty");
  // določeni integral ∫(f; a; b) ostane številski
  assert.ok(Math.abs(analyze("∫(x²; 0; 3)").value - 9) < 1e-9);
});

test("limita: racionalne funkcije, standardne limite, L'Hôpital, 1^∞", () => {
  assert.equal(res("limita((x²−1)/(x−1); x; 1)"), "2");
  assert.equal(res("limita((x+2)/(x²−4); x; −2)"), "-\\frac{1}{4}");
  assert.equal(res("limita((3x²+1)/(2x²−x); x; ∞)"), "\\frac{3}{2}");
  assert.equal(res("limit(x/(x+1); x; -inf)"), "1");
  assert.equal(res("limita((x²+3)/(x+1); x; −∞)"), "-\\infty");
  assert.equal(res("limita(sin(x)/x; x; 0)"), "1");
  assert.equal(res("limita(sin(3x)/x; 0)"), "3");
  assert.equal(res("limita((1−cos x)/x²; x; 0)"), "\\frac{1}{2}");
  assert.equal(res("limita((eˣ−1)/x; x; 0)"), "1");
  assert.equal(res("limita(ln(1+x)/x; x; 0)"), "1");
  assert.equal(res("limita((2^x−1)/x; x; 0)"), "\\ln 2");
  assert.equal(res("limita((1+1/x)^x; x; ∞)"), "e");
  assert.equal(res("limita((1+2/x)^x; x; oo)"), "e^{2}");
  assert.equal(res("limita((1−1/x)^x; x; ∞)"), "\\frac{1}{e}");
  assert.equal(res("limita((1+x)^(1/x); x; 0)"), "e");
  assert.equal(res("limita(x·ln x; x; 0)"), "0");
  assert.equal(res("limita(ln(x)/x; x; ∞)"), "0");
  assert.equal(res("limita(x²·e^(−x); x; ∞)"), "0");
  assert.equal(res("limita(1/x−1/sin(x); x; 0)"), "0");
  assert.equal(res("limita(sin(x)/(x−π); x; π)"), "-1");
  assert.equal(res("limita(arctan x; x; ∞)"), "\\frac{\\pi}{2}");
  assert.equal(res("limita(1/x²; x; 0)"), "\\infty");
  assert.equal(res("limita(ln(x); x; 0)"), "-\\infty");
  assert.equal(res("limita(√x; x; 0)"), "0");
  assert.equal(cas("limita(sin(x)/x; x; 0)").tex, "\\lim\\limits_{x \\to 0} \\frac{\\sin\\left(x\\right)}{x}");
});

test("limita: ne obstaja (leva ≠ desna) je rezultat, ne napaka", () => {
  for (const t of ["limita(1/x; x; 0)", "limita(abs(x)/x; x; 0)", "limita(tan(x); x; π/2)", "limita(e^(1/x); x; 0)", "limita(floor(x); x; 2)"]) {
    const r = cas(t);
    assert.ok(!r.error && r.none, `${t} → ${JSON.stringify(r)}`);
  }
  assert.equal(code("limita(sin(x)/x; x; ∞)"), "casLimit"); // stiskanje še ne
  assert.equal(code("limita(x; x)"), "casPoint");
  assert.equal(code("limita(x; x; a)"), "casPoint");
});

test("Taylorjev polinom: točni koeficienti, točka a, privzeti a = 0 in n = 5", () => {
  assert.equal(res("taylor(eˣ; x; 0; 4)"), "1 + x + \\frac{x^{2}}{2} + \\frac{x^{3}}{6} + \\frac{x^{4}}{24}");
  assert.equal(res("taylor(sin x; x; 0; 5)"), "x - \\frac{x^{3}}{6} + \\frac{x^{5}}{120}");
  assert.equal(res("taylor(ln x; x; 1; 3)"), "\\left(x - 1\\right) - \\frac{\\left(x - 1\\right)^{2}}{2} + \\frac{\\left(x - 1\\right)^{3}}{3}");
  assert.equal(res("taylor(cos x)"), "1 - \\frac{x^{2}}{2} + \\frac{x^{4}}{24}");
  assert.equal(res("taylor(tan x; x; 0; 7)"), "x + \\frac{x^{3}}{3} + \\frac{2x^{5}}{15} + \\frac{17x^{7}}{315}");
  assert.equal(res("taylor(√(1+x); x; 0; 3)"), "1 + \\frac{x}{2} - \\frac{x^{2}}{8} + \\frac{x^{3}}{16}");
  assert.equal(res("taylor(eˣ; x; 1; 2)"), "e + e\\left(x - 1\\right) + \\frac{e\\left(x - 1\\right)^{2}}{2}");
  assert.equal(res("taylor(sin x; x; π/6; 2)"), "\\frac{1}{2} + \\frac{\\sqrt{3}\\left(x - \\frac{\\pi}{6}\\right)}{2} - \\frac{\\left(x - \\frac{\\pi}{6}\\right)^{2}}{4}");
  assert.equal(res("taylor(ln x; x; 2; 2)"), "\\ln 2 + \\frac{x - 2}{2} - \\frac{\\left(x - 2\\right)^{2}}{8}");
  assert.equal(res("taylor(eˣ; x; 0; 10)").split(" + ").length, 11);
  // polinom: brez » + …«
  assert.equal(res("taylor(x³+1; x; 1; 5)"), "2 + 3\\left(x - 1\\right) + 3\\left(x - 1\\right)^{2} + \\left(x - 1\\right)^{3}");
  assert.equal(code("taylor(ln x; x; 0; 3)"), "casTaylor");
  assert.equal(code("taylor(eˣ; x; 0; 11)"), "casTaylorN");
  assert.equal(code("taylor(eˣ; x; 0; 2,5)"), "casTaylorN");
});

test("časovna meja: zapleteni vnosi se končajo hitro, brez obešanja", () => {
  for (const t of ["integriraj((x+1)^20·sin x)", "integriraj(1/(x^12−1))", "integriraj(sin(sin(sin(x))))·x", "limita((x^10+sin(x))/(e^x−1−x); x; 0)", "limita(x^30·e^(−x); x; ∞)", "taylor(sin(cos(tan(eˣ))); x; 0; 10)"]) {
    const cmd = parseCommand(t);
    if (!cmd) continue;
    const t0 = Date.now();
    runCas(cmd, {});
    assert.ok(Date.now() - t0 < 2500, `${t}: ${Date.now() - t0} ms`);
  }
  const t0 = Date.now();
  runCas(parseCommand("limita(x^30·e^(−x); x; ∞)"), { live: true });
  assert.ok(Date.now() - t0 < 1000);
});

test("kalkulator: ukazi, imena po jezikih, stopinje ne vplivajo", () => {
  assert.equal(commandName("integrate"), "integriraj");
  assert.equal(commandName("limit", "sl"), "limita");
  assert.equal(commandName("integrate", "en"), "integrate");
  assert.equal(commandName("taylor", "de"), "taylor");
  assert.deepEqual(parseCommand("limita(sin(x)/x; x; 0)"), { op: "limit", name: "limita", inner: "sin(x)/x", args: ["x", "0"] });
  assert.equal(parseCommand("integriraj(x; x; 1)"), null);
  const r = analyze("integriraj(x·eˣ)");
  assert.equal(r.kind, "cas");
  assert.equal(r.op, "integrate");
  // v načinu DEG analiza računa v radianih (kot v učbeniku)
  assert.equal(analyze("limita(sin(x)/x; x; 0)", { deg: true }).resTex, "1");
  assert.equal(analyze("integriraj(cos x)", { deg: true }).resTex, "\\sin\\left(x\\right) + C");
  // shranjena spremenljivka je število
  assert.equal(analyze("integriraj(a·x)", { vars: { a: 4 } }).resTex, "2x^{2} + C");
  assert.equal(analyze("x²·sin(x)").kind, "expr");
});

test("pregled: zapis ln 2, −2x, −λ in krajšanje konstant; besedilo za odložišče", async () => {
  // »\ln 2x« bi se bralo kot ln(2x)
  assert.equal(res("integriraj(ln(2)·x)"), "\\frac{x^{2}\\ln 2}{2} + C");
  assert.equal(res("integriraj(ln(2))"), "x\\ln 2 + C");
  assert.equal(res("integriraj(ln(2)·sin(x))"), "-\\cos\\left(x\\right)\\ln 2 + C");
  assert.equal(res("integriraj(x·2^x)"), "\\frac{x\\cdot 2^{x}}{\\ln 2} - \\frac{2^{x}}{\\ln^{2} 2} + C");
  assert.equal(res("taylor(3^x; x; 0; 1)"), "1 + x\\ln 3");
  // ln(kx): x ln(kx) − x, ne ½·2x ln(2x); −2x brez (−2)
  assert.equal(res("integriraj(ln(2x))"), "x\\ln\\left(2x\\right) - x + C");
  assert.equal(res("integriraj(ln(−2x))"), "x\\ln\\left(-2x\\right) - x + C");
  assert.equal(res("integriraj(e^(−2x))"), "-\\frac{1}{2}e^{-2x} + C");
  assert.equal(res("integriraj(√(−2x+1))"), "-\\frac{1}{3}\\sqrt{\\left(-2x+1\\right)^{3}} + C");
  assert.equal(res("integriraj(e^(−λ·t); t)"), "-\\frac{e^{-\\lambda t}}{\\lambda} + C");
  assert.equal(res("integriraj(a·cos(a·x))"), "\\sin\\left(a x\\right) + C");
  // odložišče: imena funkcij in grške črke ostanejo, \infty ni »∈fty«
  const { texPlain } = await import("../public/graph/sci.js");
  assert.equal(texPlain(res("integriraj(1/(x²−4))")), "(1)/(4) ln|x-2| - (1)/(4) ln|x+2| + C");
  assert.equal(texPlain(res("integriraj(x·cos x)")), "x sin(x) + cos(x) + C");
  assert.equal(texPlain(res("integriraj(e^(−λ·t); t)")), "-(e^(-λ t))/(λ) + C");
  assert.equal(texPlain(res("taylor(eˣ; x; 0; 2)")), "1 + x + (x^2)/(2)");
  assert.equal(texPlain("x \\in \\left(2,\\infty\\right)"), "x ∈ (2,∞)");
});

test("pregled: limita ⁵√x pri 0 obstaja (ni »ne obstaja«), majhna točka a ne preskoči 0", () => {
  for (const t of ["limita(root(x;5); x; 0)", "limita(root(x−2;9); x; 2)", "limita(sgn(x)/ln(abs(x)); x; 0)"]) assert.ok(!cas(t).none, t);
  const r = cas("limita(1/x; x; 1e-9)");
  assert.ok(!r.none && !r.error && Math.abs(Number(r.resTex) - 1e9) < 1, JSON.stringify(r));
  assert.ok(cas("limita(sin(1/x); x; 0)").none || code("limita(sin(1/x); x; 0)") === "casLimit");
});

test("analiza v načinu DEG: računano v radianih, to pove opomba", () => {
  const r = analyze("integriraj(sin(x))", { deg: true });
  assert.equal(r.rad, true);
  assert.equal(analyze("integriraj(sin(x))", {}).rad, undefined);
  assert.doesNotMatch(analyze("taylor(sin(x); x; 0; 5)").resTex, /ldots/);
});
