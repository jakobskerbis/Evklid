// Simbolno računanje v znanstvenem kalkulatorju (public/graph/cas.js): poenostavi, razvij, razstavi, reši za črko.
// Primeri iz učbenikov za OŠ/SŠ in matur; vsak rezultat cas.js sam preveri s števili, tu preverimo še zapis.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCommand, runCas, gcd, factorP, commandName } from "../public/graph/cas.js";
import { analyze } from "../public/graph/scisolve.js";
import { P, Q } from "../public/scan/algebra.js";

const cas = (text, env = {}) => {
  const cmd = parseCommand(text);
  assert.ok(cmd, `${text} ni ukaz`);
  return runCas(cmd, env);
};
const res = (text, env) => {
  const r = cas(text, env);
  assert.ok(!r.error, `${text} → ${JSON.stringify(r.error)}`);
  return r.resTex;
};

test("razvij: potence dvočlenikov in produkti", () => {
  assert.equal(res("razvij((a+b)³)"), "a^{3} + 3a^{2}b + 3ab^{2} + b^{3}");
  assert.equal(res("expand((2a−3b)²)"), "4a^{2} - 12ab + 9b^{2}");
  assert.equal(res("razvij((x−1)(x+1)(x²+1))"), "x^{4} - 1");
  assert.equal(res("razvij((x+1)²−(x−1)²)"), "4x");
});

test("razstavi: skupni faktor, razlika kvadratov in kubov, tročlenik, združevanje", () => {
  assert.equal(res("razstavi(x³−8)"), "\\left(x - 2\\right)\\left(x^{2} + 2x + 4\\right)");
  assert.equal(res("razstavi(x⁴−1)"), "\\left(x + 1\\right)\\left(x - 1\\right)\\left(x^{2} + 1\\right)");
  assert.equal(res("razstavi(6a²b−9ab²)"), "3ab\\left(2a - 3b\\right)");
  assert.equal(res("razstavi(x²−5xy+6y²)"), "\\left(x - 2y\\right)\\left(x - 3y\\right)");
  assert.equal(res("razstavi(ax+ay+bx+by)"), "\\left(a + b\\right)\\left(x + y\\right)");
  assert.equal(res("razstavi(2x²+x−1)"), "\\left(2x - 1\\right)\\left(x + 1\\right)");
  assert.equal(res("razstavi(4a²−12ab+9b²)"), "\\left(2a - 3b\\right)^{2}");
  assert.equal(res("razstavi(x³−x²−x+1)"), "\\left(x + 1\\right)\\left(x - 1\\right)^{2}");
  assert.equal(res("razstavi(x³+3x²y+3xy²+y³)"), "\\left(x + y\\right)^{3}");
  assert.equal(res("razstavi(x²+2x+1−y²)"), "\\left(x + y + 1\\right)\\left(x - y + 1\\right)");
  assert.equal(res("razstavi(2πr²+2πrh)"), "2πr\\left(h + r\\right)");
  // 4. stopnja brez racionalnih ničel (Sophie Germain) in nerazcepni nad ℚ
  assert.equal(res("factor(x⁴+4)"), "\\left(x^{2} + 2x + 2\\right)\\left(x^{2} - 2x + 2\\right)");
  assert.equal(res("razstavi(x⁴+x²+1)"), "\\left(x^{2} + x + 1\\right)\\left(x^{2} - x + 1\\right)");
  assert.equal(res("razstavi(x²−2)"), "x^{2} - 2");
  assert.equal(res("razstavi(x²+y²)"), "x^{2} + y^{2}");
  assert.equal(res("razstavi(0,5x²−2)"), "0{,}5\\left(x + 2\\right)\\left(x - 2\\right)");
});

test("poenostavi ulomke izrazov in zapiše pogoje", () => {
  const r = cas("poenostavi((x²−1)/(x−1))");
  assert.equal(r.resTex, "x + 1");
  assert.equal(r.cond, "x \\ne 1");
  assert.equal(res("poenostavi(1/x+1/(x+1))"), "\\frac{2x + 1}{x\\left(x + 1\\right)}");
  const ab = cas("poenostavi((a²−b²)/(a+b))");
  assert.equal(ab.resTex, "a - b");
  assert.equal(ab.cond, "a \\ne -b");
  assert.equal(res("poenostavi((x²+3x+2)/(x²−1))"), "\\frac{x + 2}{x - 1}");
  assert.equal(res("poenostavi((1−x)/(x+2))"), "\\frac{1 - x}{x + 2}");
  assert.equal(res("poenostavi((x+1)/2)"), "\\frac{x + 1}{2}");
  assert.equal(cas("poenostavi(1/(1/x))").cond, "x \\ne 0");
  assert.equal(res("razstavi((x²−1)/(x²+2x+1))"), "\\frac{x - 1}{x + 1}");
});

test("reši za izbrano črko: linearne in kvadratne enačbe, formule iz fizike", () => {
  assert.equal(res("reši(2x+a=5; x)"), "x = \\frac{5 - a}{2}");
  const q = cas("reši(ax²+bx+c=0; x)");
  assert.equal(q.resTex, "x_{1,2} = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}");
  assert.equal(q.cond, "a \\ne 0");
  assert.equal(res("reši(s=vt+at²/2; a)"), "a = \\frac{2s - 2tv}{t^{2}}");
  assert.equal(res("reši(s=vt+at²/2; t)"), "t_{1,2} = \\frac{-v \\pm \\sqrt{2as + v^{2}}}{a}");
  assert.equal(res("reši(F=Gmm_2/r²; r)"), "r_{1,2} = \\pm\\sqrt{\\frac{G\\,m\\,m_{2}}{F}}");
  assert.equal(res("reši(pV=nRT; T)"), "T = \\frac{pV}{nR}");
  assert.equal(res("reši(x²=8; x)"), "x_{1,2} = \\pm 2\\sqrt{2}");
  assert.equal(res("reši(x²−2x−1=0; x)"), "x_{1,2} = 1 \\pm \\sqrt{2}");
  assert.equal(res("reši(1/x+1/y=1/f; f)"), "f = \\frac{xy}{x + y}");
  // x = a ni rešitev (imenovalec 0), ostane x = −a
  assert.equal(res("reši(x²/(x−a)=a²/(x−a); x)"), "x = -a");
  assert.equal(res("reši(x²+a²=0; x)"), "x \\in \\varnothing");
  assert.equal(res("reši(3=3; x)"), "x \\in \\mathbb{R}");
  assert.equal(cas("reši(x³+ax+1=0; x)").error.code, "casDegree");
  assert.equal(cas("reši(a=b; x)").error.code, "casVar");
  assert.equal(cas("reši(x²−1; x)").error.code, "casNeedEq");
});

test("česar še ne znamo, ne ugibamo; shranjene spremenljivke so števila", () => {
  assert.equal(cas("poenostavi(sin(x)/x)").error.code, "casUnsupported");
  assert.equal(cas("razstavi(√(x)−1)").error.code, "casUnsupported");
  assert.equal(cas("razstavi(x=1)").error.code, "casEquation");
  assert.equal(res("razstavi(x²−a²)", { vars: { a: 2 } }), "\\left(x + 2\\right)\\left(x - 2\\right)");
  assert.equal(parseCommand("factor(x) + 1"), null);
  assert.equal(parseCommand("2x + 1"), null);
  assert.deepEqual(parseCommand("solve(2x = a; x)"), { op: "solve", name: "solve", inner: "2x = a", v: "x" });
  // manjkajoč zaklepaj na koncu je dovoljen (kot drugje v kalkulatorju)
  assert.equal(res("razstavi(x²−1"), "\\left(x + 1\\right)\\left(x - 1\\right)");
  // prevelik izraz: časovna meja, ne zamrzne
  const t0 = Date.now();
  const big = cas("razstavi((x+y+z+w)^20 − (x−y)^19)");
  assert.ok(Date.now() - t0 < 4000);
  assert.ok(big.error ? big.error.code === "casBig" : big.resTex.length > 0);
});

test("kalkulator ponudi gumbe za izraze in enačbe s črkami", () => {
  assert.equal(analyze("x²−1").cas, true);
  assert.equal(analyze("sin(x)").cas, undefined);
  assert.equal(analyze("(a+b)²").kind, "sym");
  const eq = analyze("pV=nRT");
  assert.equal(eq.kind, "symeq");
  assert.deepEqual([...eq.solveFor].sort(), ["R", "T", "V", "n", "p"].sort());
  assert.deepEqual(analyze("y=2x+3").solveFor, ["x", "y"]);
  const r = analyze("razstavi(x³−8)");
  assert.equal(r.kind, "cas");
  assert.match(r.tex, /operatorname\{razstavi\}/);
  assert.equal(analyze("reši(2x+a=5; a)").resTex, "a = -2x + 5");
  assert.equal(commandName("factor", "sl"), "razstavi");
  assert.equal(commandName("factor", "de"), "factor");
});

test("jedro: NSD polinomov in razcep z večkratnostmi (naključni produkti)", () => {
  const x = P.v("x");
  const y = P.v("y");
  const lin = (a, b) => x.scale(a).add(P.num(b));
  // NSD((x − 1)²(x + 2), (x − 1)(x + 3)) = x − 1
  assert.ok(gcd(lin(1, -1).mul(lin(1, -1)).mul(lin(1, 2)), lin(1, -1).mul(lin(1, 3))).eq(lin(1, -1)));
  assert.ok(gcd(x.mul(x).sub(y.mul(y)), x.add(y)).eq(x.add(y)));
  let seed = 7;
  const rnd = (n) => ((seed = (seed * 48271) % 2147483647) % n);
  for (let k = 0; k < 40; k++) {
    const fs = Array.from({ length: 2 + rnd(3) }, () => lin(1 + rnd(4), rnd(11) - 5 || 1));
    const p = fs.reduce((a, b) => a.mul(b), P.num(1 + rnd(5)));
    const f = factorP(p);
    const prod = f.fs.reduce((a, g) => a.mul(g.p.pow(g.e)), P.num(f.c));
    assert.ok(prod.eq(p), `razcep ${p.text()}`);
    assert.ok(f.fs.every((g) => g.p.degree() === 1), `vsi faktorji linearni: ${p.text()}`);
    assert.equal(f.fs.reduce((s, g) => s + g.e, 0), fs.length);
  }
  assert.ok(factorP(P.num(new Q(6n))).fs.length === 0);
});

test("pregled 2: pokrajšane črke, pogoji parametrov, razcep s substitucijo, velike potence", () => {
  // črke, ki se pokrajšajo, se vseeno preverijo (prej »ni bilo mogoče preveriti«)
  const xx = cas("poenostavi(x/x)");
  assert.equal(xx.resTex, "1");
  assert.equal(xx.cond, "x \\ne 0");
  assert.equal(res("poenostavi((x−1)/(1−x))"), "-1");
  const all = cas("reši(x/x=1; x)");
  assert.equal(all.resTex, "x \\in \\mathbb{R}");
  assert.equal(all.cond, "x \\ne 0");
  // faktor brez iskane črke in imenovalec z njo dasta pogoj; π ≠ 0 in x² + 1 ≠ 0 ne pišemo
  assert.equal(cas("reši((a−1)x=a²−1; x)").cond, "a \\ne 1");
  assert.equal(cas("reši(kx²=k; x)").cond, "k \\ne 0");
  const ax = cas("reši(a/x=1; x)");
  assert.equal(ax.resTex, "x = a");
  assert.equal(ax.cond, "a \\ne 0");
  assert.equal(cas("reši(πr²=S; r)").cond, undefined);
  assert.equal(cas("poenostavi(1/(x²+1)−1/(x²+1))").cond, undefined);
  // ax² + 1 = 0 ima rešitvi za a < 0 (prej »x ∈ ∅«)
  assert.equal(res("reši(ax²+1=0; x)"), "x_{1,2} = \\pm\\sqrt{-\\frac{1}{a}}");
  assert.equal(res("reši(x²(a²+1)+1=0; x)"), "x \\in \\varnothing");
  // t = x³, t = x⁵, t = xy
  assert.equal(res("razstavi(x⁶+5x³+6)"), "\\left(x^{3} + 2\\right)\\left(x^{3} + 3\\right)");
  assert.equal(res("razstavi(x^10−1)"), "\\left(x + 1\\right)\\left(x - 1\\right)\\left(x^{4} + x^{3} + x^{2} + x + 1\\right)\\left(x^{4} - x^{3} + x^{2} - x + 1\\right)");
  assert.equal(res("razstavi(x^12+1)"), "\\left(x^{4} + 1\\right)\\left(x^{8} - x^{4} + 1\\right)");
  assert.equal(res("razstavi(x⁶y⁶−1)"), "\\left(xy + 1\\right)\\left(xy - 1\\right)\\left(x^{2}y^{2} + xy + 1\\right)\\left(x^{2}y^{2} - xy + 1\\right)");
  // razvit (x + 1)²⁴ se izračuna točno; preverjanje upošteva zaokrožitev pri seštevanju velikih členov
  assert.match(res("razvij((x+1)^24)"), /^x\^\{24\} \+ 24x\^\{23\}/);
  assert.equal(cas("razvij((x+1)^25)").error.code, "casBig");
  // rezultat, ki ga KaTeX ne bi izrisal (preveč \, za tisočice), je »preveč zapleteno«, ne rdeč TeX
  assert.equal(cas("razvij((x+2y+3z)^16)").error.code, "casBig");
  // vrstni red členov po abecedi, shranjena decimalna vrednost ostane decimalna
  assert.equal(res("razvij((x+y+z)²)"), "x^{2} + 2xy + 2xz + y^{2} + 2yz + z^{2}");
  assert.match(res("razvij((y+z)³)"), /^y\^\{3\} \+ 3y\^\{2\}z \+ 3yz\^\{2\} \+ z\^\{3\}$/);
  assert.equal(res("razvij((x+a)²)", { vars: { a: 0.1 } }), "x^{2} + 0{,}2x + 0{,}01");
  // ukaz, ki mu sledi še kaj, ni zmnožek črk r·a·z·s·t·a·v·i
  assert.equal(analyze("razstavi(x²+3x+2)/(x+1)").error.code, "casTrailing");
});

test("reši brez drugih črk in 3. stopnje: številski reševalnik", () => {
  assert.equal(analyze("reši(x³=8; x)").resTex, "x = 2"); // (x − 2)(x² + 2x + 4)
  const r = analyze("reši(x³=2; x)");
  assert.equal(r.kind, "solve");
  assert.ok(Math.abs(r.roots[0] - Math.cbrt(2)) < 1e-9);
  assert.equal(analyze("reši(x³+ax=1; x)").error.code, "casDegree");
});
