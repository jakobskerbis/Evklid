// Simbolno računanje, 3. faza (public/graph/casalg.js, casmat.js): koreni in potence, kotne funkcije, logaritmi
// in eksponentne funkcije v ukazih poenostavi/razvij ter determinanta in inverz matrike s črkami.
// Vsak rezultat program sam preveri s števili; tu preverimo še zapis, pogoje »Velja za …«, napake in časovno mejo.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCommand, runCas, commandName, commandStart } from "../public/graph/cas.js";
import { newCtx, verifyAt, lineFn } from "../public/graph/casalg.js";
import { compileLine } from "../public/graph/scicore.js";
import { analyze } from "../public/graph/scisolve.js";
import { texPlain } from "../public/graph/sci.js";

const DOT = { comma: false };
const cas = (text, env = DOT) => {
  const cmd = parseCommand(text);
  assert.ok(cmd, `${text} ni ukaz`);
  return runCas(cmd, env);
};
const res = (text, env) => {
  const r = cas(text, env);
  assert.ok(!r.error, `${text} → ${JSON.stringify(r.error)}`);
  return r.resTex;
};
const both = (text, env) => {
  const r = cas(text, env);
  assert.ok(!r.error, `${text} → ${JSON.stringify(r.error)}`);
  return [r.resTex, r.cond];
};
const code = (text, env) => cas(text, env).error?.code;

test("koreni: delno korenjenje, racionalizacija imenovalca, skupni koren", () => {
  assert.equal(res("poenostavi(√18 − √8)"), "\\sqrt{2}");
  assert.equal(res("poenostavi(1/(√3 − 1))"), "\\frac{\\sqrt{3} + 1}{2}");
  assert.equal(res("poenostavi((√5 + √3)(√5 − √3))"), "2");
  assert.equal(res("poenostavi((√a + √b)/(√a − √b))"), "\\frac{a + 2\\sqrt{ab} + b}{a - b}");
  assert.equal(res("poenostavi(1/(1+√2+√3))"), "\\frac{\\sqrt{2} - \\sqrt{6} + 2}{4}");
  assert.equal(res("poenostavi(1/(∛2+1))"), "\\frac{\\sqrt[3]{4} - \\sqrt[3]{2} + 1}{3}");
  assert.equal(res("poenostavi(√(4/9))"), "\\frac{2}{3}");
  assert.equal(res("poenostavi(√(x/2))"), "\\frac{\\sqrt{2x}}{2}");
  assert.equal(res("razvij((√x+1)^2)"), "x + 2\\sqrt{x} + 1");
  assert.equal(res("poenostavi(√π·√π)"), "π");
});

test("koreni s črkami: |x|, pogoji, lihi koreni, potence z ulomki", () => {
  assert.deepEqual(both("poenostavi(√(a³b²))"), ["a\\left|b\\right|\\sqrt{a}", undefined]);
  assert.equal(res("poenostavi(√(8x³))"), "2x\\sqrt{2x}");
  assert.equal(res("poenostavi(√(x²))"), "\\left|x\\right|");
  assert.equal(res("poenostavi(√(x²+2x+1))"), "\\left|x + 1\\right|");
  assert.equal(res("poenostavi(x^(1/2)·x^(1/3))"), "\\sqrt[6]{x^{5}}");
  assert.equal(res("poenostavi(∛(−8x³))"), "-2x");
  assert.deepEqual(both("poenostavi(√(x+1)·√(x+1))"), ["x + 1", "x \\ge -1"]);
  assert.deepEqual(both("poenostavi(√x·√x − x)"), ["0", "x \\ge 0"]);
  assert.equal(res("poenostavi(1/√(x+1))"), "\\frac{\\sqrt{x + 1}}{x + 1}");
  assert.deepEqual(both("poenostavi(x^(-1/2))"), ["\\frac{\\sqrt{x}}{x}", "x > 0"]);
  assert.equal(res("poenostavi(x^(3/2))"), "x\\sqrt{x}");
  assert.equal(res("poenostavi(8^(2/3))"), "4");
  assert.equal(res("poenostavi(√(-x))"), "\\sqrt{-x}");
  // pod sodim korenom samo negativno: ni definirano
  assert.equal(code("poenostavi(√(-4))"), "undef");
  assert.equal(code("poenostavi(√(-x²))"), "undef");
  // gnezdeni koreni še niso podprti
  assert.equal(code("poenostavi(√(1+√2))"), "casUnsupported");
});

test("kotne funkcije: osnovne zveze, adicijski izreki, tan in cot", () => {
  assert.equal(res("poenostavi(sin²x + cos²x)"), "1");
  assert.deepEqual(both("poenostavi(sin(2x)/(2cos x))"), ["\\sin x", "\\cos x \\ne 0"]);
  assert.equal(res("poenostavi((1 − cos²x)/sin x)"), "\\sin x");
  assert.equal(res("poenostavi(1/cos²x − 1)"), "\\tan^{2} x");
  assert.equal(res("poenostavi(sin(x + π/2))"), "\\cos x");
  assert.equal(res("razvij(sin(x + y))"), "\\sin x\\cos y + \\cos x\\sin y");
  // cos 2x zapišemo s kosinusom (2cos²x − 1), sin 3x s sinusom (krajši zapis)
  assert.equal(res("razvij(cos(2x))"), "2\\cos^{2} x - 1");
  assert.equal(res("razvij(sin(3x))"), "3\\sin x - 4\\sin^{3} x");
  assert.equal(res("poenostavi(tan x · cos x)"), "\\sin x");
  assert.equal(res("poenostavi(sin(π/4)·sin x)"), "\\frac{\\sqrt{2}}{2}\\sin x");
  assert.equal(res("poenostavi(sin²(x²) + cos²(x²))"), "1");
  assert.equal(res("poenostavi(sin(x)/cos(x))"), "\\tan x");
  assert.equal(res("poenostavi(cos(x)/sin(x))"), "\\cot x");
  assert.equal(res("poenostavi(tan(x)^2 + 1)"), "\\frac{1}{\\cos^{2} x}");
  assert.equal(res("poenostavi(1/(1+sin x))"), "\\frac{1}{\\sin x + 1}");
  assert.equal(res("poenostavi(cos(π − x))"), "-\\cos x");
  assert.equal(res("poenostavi(sin(-x))"), "-\\sin x");
  assert.equal(res("poenostavi(tan(π/3)·x)"), "x\\sqrt{3}");
  assert.deepEqual(both("poenostavi(sin(x)^2/(1-cos(x)))"), ["\\cos x + 1", "\\cos x \\ne 1"]);
  // zamik, ki ni večkratnik π/6 ali π/4, in velik večkratnik ostaneta svoj kot
  assert.equal(res("poenostavi(sin(x+1))"), "\\sin\\left(x + 1\\right)");
  assert.equal(res("razvij(sin(30x))"), "\\sin\\left(30x\\right)");
  // krožne in hiperbolične funkcije še ne
  assert.equal(code("poenostavi(arctan(x)+1)"), "casUnsupported");
  assert.equal(code("poenostavi(sinh(x))"), "casUnsupported");
});

test("kotne funkcije v načinu DEG in GRA: zamik v stopinjah, preverjanje v istem načinu", () => {
  assert.equal(res("poenostavi(sin(x + 90))", { deg: true }), "\\cos x");
  assert.equal(res("poenostavi(cos(x+180))", { deg: true }), "-\\cos x");
  assert.equal(res("razvij(sin(x+30))", { deg: true, comma: false }), "\\frac{\\sqrt{3}}{2}\\sin x + \\frac{1}{2}\\cos x");
  assert.equal(res("poenostavi(sin(x+100))", { grad: true }), "\\cos x");
  assert.equal(res("poenostavi(sin²x + cos²x)", { deg: true }), "1");
  // v radianih je sin(x + 90) svoj kot, ne cos x
  assert.equal(res("poenostavi(sin(x + 90))"), "\\sin\\left(x + 90\\right)");
});

test("logaritmi: združi, razvij, osnova, pogoji", () => {
  assert.deepEqual(both("poenostavi(log(a) + log(b))"), ["\\log\\left(ab\\right)", "a, b > 0"]);
  assert.deepEqual(both("poenostavi(2ln x − ln(x²·y))"), ["-\\ln y", "x, y > 0"]);
  assert.deepEqual(both("razvij(log(a²b/c))"), ["2\\log a + \\log b - \\log c", "a, b, c > 0"]);
  assert.equal(res("poenostavi(log(20) − log(2))"), "1");
  assert.equal(res("poenostavi(logb(8, 2))"), "3");
  assert.equal(res("poenostavi(logb(8; 2))", {}), "3");
  assert.equal(res("poenostavi(log_2(x)/log_2(4))"), "\\frac{1}{2}\\log_{2} x");
  assert.equal(res("poenostavi(ln(x)/ln(10))"), "\\log x");
  assert.equal(res("poenostavi(log(5))"), "\\log 5");
  assert.equal(res("poenostavi(log(2)+log(3))"), "\\log 6");
  assert.equal(res("poenostavi(log(100x))"), "\\log x + 2");
  assert.equal(res("poenostavi(log(0,01))", {}), "-2");
  assert.equal(res("poenostavi(ln(√x))"), "\\frac{1}{2}\\ln x");
  assert.equal(res("razvij(ln(x/(x+1)))"), "\\ln x - \\ln\\left(x + 1\\right)");
  assert.deepEqual(both("poenostavi(ln(-x))"), ["\\ln\\left(-x\\right)", "x < 0"]);
});

test("eksponentne funkcije", () => {
  assert.equal(res("poenostavi(ln(e^(3x)))"), "3x");
  assert.deepEqual(both("poenostavi(e^(ln x))"), ["x", "x > 0"]);
  assert.equal(res("poenostavi(e^x·e^(2x))"), "e^{3x}");
  assert.equal(res("poenostavi((e^x)^2·e^(-x))"), "e^{x}");
  assert.equal(res("poenostavi(e^(2ln x))"), "x^{2}");
  assert.equal(res("poenostavi(e^(x+ln 2))"), "2e^{x}");
  assert.equal(res("poenostavi(x·e^x / e^x)"), "x");
  assert.equal(res("poenostavi(ln(2^x))"), "x\\ln 2");
  assert.equal(res("poenostavi(2^x·2^(x+1))"), "2\\cdot 2^{2x}");
  assert.equal(res("razstavi(e^(2x)-1)"), "\\left(e^{x} + 1\\right)\\left(e^{x} - 1\\right)");
});

test("matrike: determinanta in inverz s črkami, številske matrike, decimalna vejica", () => {
  assert.equal(res("det([[a, b], [c, d]])"), "ad - bc");
  assert.equal(res("det([[1, x], [x, 1]])"), "1 - x^{2}");
  assert.equal(res("det([[p,q,r],[s,t,u],[v,w,z]])"), "ptz - puw - qsz + quv + rsw - rtv");
  assert.equal(res("det([[x,1,1],[1,x,1],[1,1,x]])"), "x^{3} - 3x + 2");
  assert.equal(res("det([[√2, 1], [1, √2]])"), "1");
  assert.equal(res("det([[1,2],[3,4]])"), "-2");
  const inv = cas("inverz([[a, b], [c, d]])");
  assert.equal(inv.resTex, "\\frac{1}{ad - bc}\\begin{pmatrix}d & -b \\\\ -c & a\\end{pmatrix}");
  assert.equal(inv.cond, "ad - bc \\ne 0");
  assert.equal(inv.tex, "\\begin{pmatrix}a & b \\\\ c & d\\end{pmatrix}^{-1}");
  assert.equal(res("inverse([[1,2],[3,4]])"), "\\begin{pmatrix}-2 & 1 \\\\ \\frac{3}{2} & -\\frac{1}{2}\\end{pmatrix}");
  assert.equal(res("inv([[x, 1], [1, x]])"), "\\frac{1}{x^{2} - 1}\\begin{pmatrix}x & -1 \\\\ -1 & x\\end{pmatrix}");
  assert.equal(cas("inv([[x, 1], [1, x]])").cond, "x \\ne -1,\\; x \\ne 1");
  assert.equal(res("inverz([[a,0],[0,b]])"), "\\frac{1}{ab}\\begin{pmatrix}b & 0 \\\\ 0 & a\\end{pmatrix}");
  // elementi z ulomki: zapis po elementih
  assert.equal(res("inverz([[1/x, 1], [0, x]])"), "\\begin{pmatrix}x & -1 \\\\ 0 & \\frac{1}{x}\\end{pmatrix}");
  assert.equal(res("inverz([[cos x, -sin x],[sin x, cos x]])"), "\\begin{pmatrix}\\cos x & \\sin x \\\\ -\\sin x & \\cos x\\end{pmatrix}");
  // decimalna vejica: elementi ločeni s »;«
  assert.equal(res("det([[1,5; 2]; [3; x]])", {}), "1{,}5x - 6");
  assert.equal(res("inverz([[a; b]; [c; d]])", {}), inv.resTex);
  assert.equal(res("det([[1;2];[3;4]])"), "-2");
  // napake
  assert.equal(code("inverz([[1,2],[2,4]])"), "casSingular");
  assert.equal(code("inverz([[a, b], [2a, 2b]])"), "casSingular");
  assert.equal(code("det([[1,2],[3]])"), "casMatrix");
  assert.equal(code("det([a,b])"), "casMatrix");
  assert.equal(code("det(5)"), "casMatrix");
  assert.equal(code("det([[1,0,0,0,0,0],[0,1,0,0,0,0],[0,0,1,0,0,0],[0,0,0,1,0,0],[0,0,0,0,1,0],[0,0,0,0,0,1]])"), "casBig");
  assert.equal(commandName("inverse", "sl"), "inverz");
  assert.equal(commandName("det", "en"), "det");
  assert.ok(commandStart("det([[a; b]; [c; d]])"));
  // besedilo za odložišče kalkulator spet prebere
  assert.equal(texPlain(inv.resTex), "(1)/(ad - bc)·[[d; -b]; [-c; a]]");
  assert.equal(texPlain("\\sqrt[6]{x^{5}}"), "root(x^5; 6)");
});

test("preverjanje zavrne napačen rezultat; časovna meja in prevelik vnos", () => {
  const line = compileLine("√x·√x", DOT);
  const ctx = newCtx(line, DOT);
  const f = lineFn(line, line.ast);
  assert.equal(verifyAt(ctx, ["x"], f, (e) => e.x), true);
  assert.equal(verifyAt(ctx, ["x"], f, (e) => Math.abs(e.x) + 1e-6), false);
  assert.equal(verifyAt(ctx, ["x"], f, (e) => -e.x), false);
  // prevelika števila in redovi korenov
  assert.equal(code("poenostavi(√(1234567891011121314))"), "casBig");
  assert.equal(code("poenostavi(root(x;4)·root(x;6)·root(x;5))"), "casBig");
  for (const s of ["poenostavi((√x+√y+√z+1)^24)", "poenostavi((sin(x)+cos(y)+sin(z)+1)^20)", "inverz([[a,b,c,d,f],[g,h,j,k,l],[m,n,o,p,q],[r,s,t,u,v],[w,x,y,z,A]])"]) {
    const t0 = Date.now();
    const r = cas(s);
    assert.ok(Date.now() - t0 < 4000, s);
    assert.ok(r.error ? ["casBig", "casUnverified"].includes(r.error.code) : r.resTex.length > 0, s);
  }
  // sprotni predogled: kratka meja
  const t0 = Date.now();
  cas("poenostavi((√x+√y+√z+1)^24)", { live: true, comma: false });
  assert.ok(Date.now() - t0 < 1500);
});

test("gumbi Poenostavi/Razvij za izraze s koreni, kotnimi funkcijami in logaritmi, ne za števila", () => {
  assert.equal(analyze("sin(x)^2+cos(x)^2").cas, true);
  assert.equal(analyze("√(8x³)").cas, true);
  assert.equal(analyze("log(a)+log(b)").kind, "sym");
  assert.equal(analyze("√18−√8").kind, "value");
  assert.equal(analyze("√18−√8").cas, undefined);
  assert.equal(analyze("arcsin(x)").cas, undefined);
  const r = analyze("det([[a; b]; [c; d]])");
  assert.equal(r.kind, "cas");
  assert.equal(r.resTex, "ad - bc");
  // 1. faza ostane enaka
  assert.equal(res("razstavi(x²−1)"), "\\left(x + 1\\right)\\left(x - 1\\right)");
  assert.equal(res("poenostavi((x²−1)/(x−1))"), "x + 1");
});

test("pregled 2: sodi koreni sodih potenc, združeni koreni, racionalizacija in pogoji matrik", () => {
  // ⁴√(x²) = √|x| (prej √x brez pogoja, napačno za x < 0), ⁶√(x²) = ∛|x| (prej ∛x), ⁴√(x⁶) = |x|√|x|
  assert.deepEqual(both("poenostavi(root(x^2;4))"), ["\\sqrt{\\left|x\\right|}", undefined]);
  assert.deepEqual(both("poenostavi(root(x^2;6))"), ["\\sqrt[3]{\\left|x\\right|}", undefined]);
  assert.deepEqual(both("poenostavi(root(x^6;4))"), ["\\left|x\\right|\\sqrt{\\left|x\\right|}", undefined]);
  assert.equal(res("poenostavi(root(x^2;4)^4)"), "x^{2}");
  // √x·√y = √(xy) le za x, y ≥ 0; √(x⁵y³) = x²y√(xy) je za x, y < 0 napačno brez pogoja
  assert.deepEqual(both("poenostavi(√x·√y)"), ["\\sqrt{xy}", "x, y \\ge 0"]);
  assert.deepEqual(both("poenostavi(√(x^5·y^3))"), ["x^{2}y\\sqrt{xy}", "x, y \\ge 0"]);
  // racionalizacija doda imenovalec: 1/(√x + 1) = (√x − 1)/(x − 1) velja le za x ≠ 1
  assert.deepEqual(both("poenostavi(1/(√x+1))"), ["\\frac{\\sqrt{x} - 1}{x - 1}", "x \\ne 1"]);
  assert.equal(cas("poenostavi(1/(sin x + cos x))").cond, "\\sin x + \\cos x \\ne 0,\\; 2\\cos^{2} x - 1 \\ne 0");
  assert.equal(cas("poenostavi(1/√(x+1))").cond, "x > -1");
  // determinanta: pogoji elementov; π − e ni nikoli 0
  assert.deepEqual(both("det([[1/x, 0],[0, x]])"), ["1", "x \\ne 0"]);
  assert.deepEqual(both("det([[√x, 1], [1, √x]])"), ["x - 1", "x \\ge 0"]);
  assert.deepEqual(both("det([[tan x, 0],[0, cos x]])"), ["\\sin x", "\\cos x \\ne 0"]);
  assert.equal(cas("inverz([[e, π],[1, 1]])").cond, undefined);
  // preverjanje: kjer prikazani pogoji veljajo, mora rezultat obstajati, če obstaja vnos
  const line = compileLine("root(x^2;4)", DOT);
  const ctx = newCtx(line, DOT);
  const f = lineFn(line, line.ast);
  assert.equal(verifyAt(ctx, ["x"], f, (e) => Math.sqrt(e.x), undefined, undefined, () => true), false);
  assert.equal(verifyAt(ctx, ["x"], f, (e) => Math.sqrt(e.x), undefined, undefined, (e) => e.x >= 0), true);
  // besedilo za odložišče: √2x in e^3x bi kalkulator prebral kot √2·x in e³·x
  assert.equal(texPlain(res("poenostavi(e^x·e^(2x))")), "e^(3x)");
  assert.equal(texPlain(res("poenostavi(√(x/2))")), "(√(2x))/(2)");
  assert.equal(texPlain(res("poenostavi(sin(x/2)^2)")), "sin^2((x)/(2))");
});

test("pregled 2b: e·e^{2x}, pogoj z istim zapisom determinante, množenje pred n-tim korenom v besedilu", () => {
  assert.equal(res("razvij(e^(2x+1))"), "e\\cdot e^{2x}");
  assert.equal(res("poenostavi(e^(x+2))"), "e^{2}\\cdot e^{x}");
  const r = cas("inverz([[a,b,c],[d,e,f],[g,h,k]])");
  assert.equal(r.cond, `${/\\frac\{1\}\{([^{}]*)\}/.exec(r.resTex)[1]} \\ne 0`);
  assert.equal(texPlain("x^{2}\\sqrt[6]{x^{5}}"), "x^2·root(x^5; 6)");
  assert.equal(texPlain("\\sqrt[5]{x}y"), "root(x; 5)·y");
  assert.equal(texPlain("\\frac{\\sqrt[4]{x}}{2}"), "(root(x; 4))/(2)");
});
