// AUDIT-055: v načinu DEG in GRA je sproten predogled odvoda in integrala računal v stopinjah, rezultat po = pa v
// radianih (∫(sin(x);0;π): predogled ≈ 0,0861, rezultat 2; d/dx(sin(x);0): 0,01745 proti 1). Dogovor: odvodi in
// integrali so vedno v radianih (docs/oblikovanje.md »Enota kota«), predogled in rezultat sta enaka.
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze } from "../public/graph/scisolve.js";
import { analyzeLive } from "../public/graph/sci-vnos.js";

test("predogled = rezultat za odvode in integrale v DEG, RAD in GRA", () => {
  for (const t of ["∫(sin(x);0;π)", "d/dx(sin(x);0)", "∫(cos(x)²;0;1)+1", "d/dx(tan(x);π/4)·2", "∫_0^π sin(x) dx"]) {
    for (const angle of ["deg", "rad", "grad"]) {
      const env = { vars: {}, funcs: {}, ans: 0, deg: angle === "deg", grad: angle === "grad", comma: true };
      const live = analyzeLive(t, env);
      const done = analyze(t, env);
      assert.ok(live && !live.error && done && !done.error, `${t} ${angle}`);
      assert.ok(Math.abs(live.value - done.value) <= 1e-9 * Math.max(1, Math.abs(done.value)), `${t} (${angle}): predogled ${live.value}, rezultat ${done.value}`);
    }
  }
  const env = { vars: {}, funcs: {}, ans: 0, deg: true, comma: true };
  assert.ok(Math.abs(analyzeLive("∫(sin(x);0;π)", env).value - 2) < 1e-9);
  assert.ok(Math.abs(analyzeLive("d/dx(sin(x);0)", env).value - 1) < 1e-9);
  // brez odvoda in integrala ostane enota kota: sin 30 v DEG je 0,5
  assert.ok(Math.abs(analyzeLive("sin(30)", env).value - 0.5) < 1e-12);
  assert.ok(Math.abs(analyzeLive("sin(30°)+1", env).value - 1.5) < 1e-12);
});
