// Čiščenje mrež (scripts/atlas/pocisti-mreze.mjs): igle (trikotnik s ploščino 0) ob šivu režnjev jeter.
import test from "node:test";
import assert from "node:assert/strict";
import * as G from "../scripts/atlas/zile-mreza.mjs";
import { obrniIgle } from "../scripts/atlas/pocisti-mreze.mjs";

// Ravna zaplata: igla (A, B, C) s C na sredi AB, nad njo sosed (B, A, D), pod njo (A, C, X) in (C, B, X).
// sivUV: sosed ima na robu AB svoja izrisna oglišča (enak položaj, drug UV).
function zaplata(sivUV) {
  const P = [0, 0, 0, 2, 0, 0, 1, 0, 0, 1, -1, 0, 1, 1, 0];
  const uv = [0, 0, 1, 0, 0.5, 0, 0.5, -0.5, 0.5, 0.5];
  let a = 0, b = 1;
  if (sivUV) { P.push(0, 0, 0, 2, 0, 0); uv.push(5, 5, 6, 5); a = 5; b = 6; }
  const F = [0, 1, 2, b, a, 4, 0, 2, 3, 2, 1, 3];
  const m = { P, A: new Map([["TEXCOORD_0", { n: 2, d: uv }]]), F, spremenjeno: false };
  G.zvari(m);
  return m;
}

const ploscina = (m, f) => {
  const p = (i) => [m.P[i * 3], m.P[i * 3 + 1], m.P[i * 3 + 2]];
  const [a, b, c] = [0, 1, 2].map((k) => p(m.F[f * 3 + k]));
  return Math.hypot(...G.v3.cross(G.v3.sub(b, a), G.v3.sub(c, a))) / 2;
};

for (const sivUV of [false, true]) {
  test(`obrniIgle: igla izgine, ploščina in mnogoternost ostaneta (${sivUV ? "čez šiv UV" : "brez šiva"})`, () => {
    const m = zaplata(sivUV);
    const T0 = m.F.length / 3;
    const vsota0 = Array.from({ length: T0 }, (_, f) => ploscina(m, f)).reduce((s, x) => s + x, 0);
    assert.equal(obrniIgle(m), 1);
    const T = m.F.length / 3;
    assert.equal(T, T0);
    for (let f = 0; f < T; f++) assert.ok(ploscina(m, f) > 1e-6, `trikotnik ${f} ima ploščino 0`);
    const vsota = Array.from({ length: T }, (_, f) => ploscina(m, f)).reduce((s, x) => s + x, 0);
    assert.ok(Math.abs(vsota - vsota0) < 1e-9);
    for (const l of G.robovi(m).values()) assert.ok(l.length <= 2, "nemnogoteren rob");
    if (sivUV) {
      // novo oglišče na strani soseda: UV med njegovima ogliščema na robu
      const uv = m.A.get("TEXCOORD_0").d;
      const M = m.P.length / 3 - 1;
      assert.deepEqual([uv[M * 2], uv[M * 2 + 1]], [5.5, 5]);
    }
    assert.equal(obrniIgle(m), 0); // drugi zagon ne spremeni nič
  });
}
