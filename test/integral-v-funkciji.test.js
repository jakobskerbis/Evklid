// AUDIT-070: uporabniška funkcija z integralom v telesu, k(x) = ∫(sin(t); 0; x), je dala »—« (∫(f; a; b) je vedno
// integriral po x, sin(t) pa je ostal brez t), d/dx(∫(sin(t); 0; x); π/2) pa »noDiff«. Zdaj je spremenljivka integrala
// x ali edina črka v f, ki ni v mejah; odvod po Leibnizovem pravilu (osnovni izrek, verižno pravilo za meje, ∂f/∂x pod
// integralom); številska vrednost z »≈« in zanesljivimi mesti; ∫ in d/dx v radianih tudi v DEG (#1005).
// Vrednosti: SymPy (integrate, diff, N na 20 mest).
import { test } from "node:test";
import assert from "node:assert/strict";
import { evaluate, functionDef } from "../public/graph/scicore.js";

function run(lines, deg = false) {
  const funcs = {};
  const out = [];
  for (const t of lines) {
    const fd = functionDef(t);
    if (fd) funcs[fd.name] = { param: fd.param, body: fd.body };
    else out.push(evaluate(t, { vars: {}, funcs, ans: 0, deg, grad: false, comma: true }));
  }
  return out;
}
const close = (a, b, tol = 1e-11) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));

for (const deg of [false, true])
  test(`integral v funkciji in odvod (${deg ? "DEG" : "RAD"}; ∫ in d/dx v radianih)`, () => {
    const CASES = [
      // [vrstice, SymPy, točno (brez ≈)]
      [["k(x) = ∫(sin(t);0;x)", "k(1)"], 0.4596976941318602826, false],
      [["k(x) = ∫(sin(t);0;x)", "k(2,5)"], 1.8011436155469337148, false],
      [["k(t) = ∫(sin(t);0;t)", "k(1)"], 0.4596976941318602826, false],
      [["g(x) = ∫(e^(−t^2);0;x)", "g(1)"], 0.7468241328124270254, false],
      [["f(x) = ∫(t^2;0;x)+x", "f(3)"], 12, false],
      [["d/dx(∫(sin(t);0;x);π/2)"], 1, true],
      [["k(x) = ∫(sin(t);0;x)", "d/dx(k(x);π/2)"], 1, true],
      [["f(x) = ∫(t^2;0;x)+x", "d/dx(f(x);3)"], 10, true],
      [["d/dx(∫(t^2;0;x^2);2)"], 64, true],
      [["d/dx(∫(sin(t);x;2x);1)"], 0.97712386884346688414, true],
      [["d/dx(∫(e^(−t^2);0;sin(x));1)"], 0.26614875726971377126, true],
      // f odvisna od x: še ∫ ∂f/∂x dt (številsko, ≈)
      [["d/dx(∫(x·t;0;x);2)"], 6, false],
      [["d/dx(∫(cos(x·t);0;x);1)"], 0.23913362692838292815, false],
    ];
    for (const [lines, want, exact] of CASES) {
      const r = run(lines, deg).at(-1);
      assert.ok(!r.error && close(r.value, want), `${lines.join(" | ")}: ${JSON.stringify(r)}`);
      assert.equal(!!r.est, !exact, `${lines.join(" | ")}: ≈ ${JSON.stringify(r)}`);
    }
  });

test("∫(f; a; b) ostane po x, kadar je x v f (∫(x^2; 0; 1), ∫(sin(x); 0; π))", () => {
  assert.ok(close(run(["∫(x^2;0;1)"])[0].value, 1 / 3));
  assert.ok(close(run(["∫(sin(x);0;π)"])[0].value, 2));
  assert.ok(close(run(["∫(sin(t);0;1)"])[0].value, 0.4596976941318602826));
});

// Pregled ponovne združitve (26. 11. 2026): v grafu drsnik v integrandu ni spremenljivka integrala (a = 3,
// y = ∫(a; 0; x) pri x = 2 je 6, ne 2); črka brez definicije ostane kot na main: manjka, graf ponudi drsnik.
test("graf: drsnik v integrandu, ∫ po x; nedefinirana črka manjka (kot prej)", async () => {
  const { buildModel, ZAPIS } = await import("../public/graph/model.js");
  const m = buildModel({ zapis: ZAPIS, settings: {}, items: [{ id: "a", type: "expr", text: "a = 3" }, { id: "b", type: "expr", text: "y = ∫(a; 0; x)" }, { id: "c", type: "expr", text: "y = ∫(b; 0; x)" }] }, { comma: true });
  assert.ok(close(m.items[1].fn(2), 6), String(m.items[1].fn(2)));
  assert.deepEqual(m.items[2].error?.info?.names, ["b"]);
  // znanstveni kalkulator: shranjena spremenljivka ni spremenljivka integrala, sin(t) je še vedno po t (AUDIT-085)
  assert.ok(close(evaluate("∫(a;0;2)", { vars: { a: 3 }, funcs: {}, ans: 0, comma: true }).value, 6));
  assert.ok(close(run(["∫(sin(t);0;1)"])[0].value, 0.4596976941318602826));
});

// Pregled 2/3 (26. 11. 2026): črka za števko je spremenljivka integrala (∫(2t; 0; 1)); strežnik in graf (calcText brez
// freeInt) ostaneta po x kot na main (∫(a; 0; 3) = 3a pri preverjanju odgovorov).
test("∫(2t; 0; 1), ∫(3t²; 0; 2), f(x) = ∫(2t+1; 0; x); calcText privzeto po x", async () => {
  assert.ok(close(run(["∫(2t;0;1)"])[0].value, 1));
  assert.ok(close(run(["∫(3t²;0;2)"])[0].value, 8));
  assert.ok(close(run(["f(x) = ∫(2t+1;0;x)", "f(2)"]).at(-1).value, 6));
  const { calcText, intVar } = await import("../public/graph/math.js");
  // »d/dx« v integrandu ni črka d
  assert.equal(intVar("d/dx(t³)+t", null, "0 1"), "t");
  assert.match(calcText("∫(a;0;3)"), /\) dx\)$/);
  assert.match(calcText("∫(2t;0;1)"), /\) dx\)$/);
  assert.match(calcText("∫(2t;0;1)", { freeInt: true }), /\) dt\)$/);
});
