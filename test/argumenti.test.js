// AUDIT-011: funkcija z napačnim številom vrednosti je jasna napaka (nikoli tiho izpuščena vrednost),
// zapis TeX nikjer ne pokaže »undefined«.
import test from "node:test";
import assert from "node:assert/strict";
import { parse, compile, toTex, BUILTINS, MathError, arityExample } from "../public/graph/math.js";
import { evaluate } from "../public/graph/scicore.js";
import { liveTex } from "../public/graph/sci-vnos.js";

test("nCr(171,1) z decimalno vejico: jasna napaka, brez »undefined«", () => {
  const r = evaluate("nCr(171,1)", { comma: true });
  assert.deepEqual(r, { error: { code: "arity", info: { f: "nCr", n: 2 } } });
  const tex = liveTex("nCr(171,1)", { comma: true });
  assert.ok(tex && !tex.includes("undefined"), tex);
  assert.match(tex, /\\square/);
  assert.equal(arityExample(r.error.info, ";"), "nCr(n;\u00a0k)");
});

test("napačno število vrednosti: napaka arity v compile", () => {
  for (const [src, f, n] of [
    ["sin(0,5)", "sin", 1], // z vejico kot ločilom: prej sin(0) = 0
    ["cos(1, 2)", "cos", 1],
    ["nCr(5)", "nCr", 2],
    ["nPr(5)", "nPr", 2],
    ["mod(7)", "mod", 2],
    ["root(8)", "root", 2],
    ["logb(8)", "logb", 2],
    ["randint(1)", "randint", 2],
    ["nCr(5, 2, 1)", "nCr", 2],
  ]) {
    assert.throws(() => compile(parse(src)), (e) => e instanceof MathError && e.code === "arity" && e.info.f === f && e.info.n === n, src);
  }
  // pravilni zapisi ostanejo
  assert.equal(compile(parse("nCr(5, 2)"))({}), 10);
  assert.equal(compile(parse("mod(7, 3)"))({}), 1);
  assert.equal(compile(parse("max(1, 5, 3)"))({}), 5);
  assert.equal(compile(parse("gcd(12)"))({}), 12);
  assert.ok(Math.abs(compile(parse("root(8, 3)"))({}) - 2) < 1e-12);
});

test("toTex: nobena funkcija s premalo vrednostmi ne izpiše »undefined«", () => {
  for (const f of BUILTINS) {
    for (let k = 0; k <= 3; k++) {
      const node = { k: "call", f, args: Array.from({ length: k }, (_, i) => ({ k: "num", v: i + 2 })) };
      for (const opt of [{}, { comma: true, sep: ";" }, { comma: false }]) {
        const tex = toTex(node, opt);
        assert.ok(!/undefined|NaN|null/.test(tex), `${f}/${k}: ${tex}`);
      }
    }
  }
});

test("znanstveni kalkulator: napaka arity ima zgled zapisa", () => {
  assert.equal(arityExample({ f: "sin", n: 1 }, ";"), "sin(x)");
  assert.equal(arityExample({ f: "mod", n: 2 }, ","), "mod(a,\u00a0b)");
  assert.equal(arityExample({ f: "root", n: 2 }, ";"), "root(x;\u00a0n)");
});

test("risba graf: sin(0,63*x) z decimalno vejico niha (prej ravna črta sin 0, BIO-SS-3 odnosi-med-vrstami)", async () => {
  const { renderDrawing } = await import("../public/risbe-izris.js");
  const body = "opis: Graf nihanja števila živali v času.\nx: 0 .. 20 | 5 | t\ny: 0 .. 100 | 20 | n\nf: 60 + 30*sin(0,63*x) | modra | 0 .. 20";
  const flat = "opis: Graf nihanja števila živali v času.\nx: 0 .. 20 | 5 | t\ny: 0 .. 100 | 20 | n\nf: 60 | modra | 0 .. 20";
  const path = (svg) => /<path[^>]*d="([^"]+)"/.exec(String(svg?.html ?? svg))?.[1];
  const a = path(renderDrawing("graf", body));
  const b = path(renderDrawing("graf", flat));
  assert.ok(a && b, "risba nima krivulje");
  assert.notEqual(a, b);
  const c = path(renderDrawing("graf", body.replace("60 + 30*sin(0,63*x)", "max(90*sin(0,63*x); 60)")));
  assert.ok(c && c !== b, "»;« v risbi loči vrednosti");
});
