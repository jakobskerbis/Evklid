// Graf v odgovoru inštruktorja: okno po zanimivih točkah in asimptote (public/graph/okno.js, server/odpri.js).
import { test } from "node:test";
import assert from "node:assert/strict";
import { fitView, verticalAsymptotes, endAsymptotes, asymptoteLabel, niceNumber, features } from "../public/graph/okno.js";
import { parseOpenBlocks, parseGraphView } from "../server/odpri.js";

const F = {
  rac: (x) => (x * x - 4) / (x - 1),
  ulo: (x) => (x - 2) / (x + 1),
  inv: (x) => 1 / x,
  inv2: (x) => 1 / (x * x),
  tan: Math.tan,
  kub: (x) => x ** 3 - 3 * x * x - 9 * x + 5,
  exp: Math.exp,
  ln: Math.log,
  sin: Math.sin,
  sqrt: Math.sqrt,
  lin: (x) => 2 * x + 1,
  odstr: (x) => (x * x - 1) / (x - 1), // odstranljiva nezveznost pri 1, ni pol
  skok: (x) => x / Math.abs(x), // skok pri 0, ni pol
};
const near = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;
const inView = (v, x, y) => x > v.xmin && x < v.xmax && (y == null || (y > v.ymin && y < v.ymax));

test("navpične asimptote: poli, rob območja z neomejeno vrednostjo; ne skok, ne odstranljiva točka, ne prekoračitev", () => {
  assert.deepEqual(verticalAsymptotes(F.rac, -5, 5), [1]);
  assert.deepEqual(verticalAsymptotes(F.ulo, -5, 5), [-1]);
  assert.deepEqual(verticalAsymptotes(F.inv, -5, 5), [0]); // vzorec zadene pol (1/0 = Infinity)
  assert.deepEqual(verticalAsymptotes(F.inv, -4.9, 5.3), [0]);
  assert.deepEqual(verticalAsymptotes(F.inv2, -3.3, 4.1), [0]); // brez spremembe predznaka
  assert.deepEqual(verticalAsymptotes(F.ln, -2, 6), [0]);
  const t = verticalAsymptotes(F.tan, -5, 5);
  assert.equal(t.length, 4);
  for (const [i, k] of [-3, -1, 1, 3].entries()) assert.ok(near(t[i], (k * Math.PI) / 2, 1e-9), `${t[i]}`);
  for (const f of ["sqrt", "kub", "sin", "lin", "odstr", "skok"]) assert.deepEqual(verticalAsymptotes(F[f], -6, 6), [], f);
  assert.deepEqual(verticalAsymptotes(F.exp, 600, 800), []); // e^x → Infinity pri x ≈ 710 ni pol
});

test("vodoravne in poševne asimptote za x → ±∞", () => {
  assert.deepEqual(endAsymptotes(F.rac), [{ k: 1, n: 1, sides: [-1, 1] }]);
  assert.deepEqual(endAsymptotes(F.ulo), [{ k: 0, n: 1, sides: [-1, 1] }]);
  assert.deepEqual(endAsymptotes(F.inv), [{ k: 0, n: 0, sides: [-1, 1] }]);
  assert.deepEqual(endAsymptotes(F.exp), [{ k: 0, n: 0, sides: [-1] }]);
  assert.deepEqual(endAsymptotes((x) => (2 * x * x + 1) / (2 * x - 1)), [{ k: 1, n: 0.5, sides: [-1, 1] }]);
  for (const f of ["kub", "ln", "sqrt", "sin", "tan", "lin"]) assert.deepEqual(endAsymptotes(F[f]), [], f);
  assert.deepEqual(endAsymptotes(() => 3), []); // konstanta je sama sebi premica
});

test("oznake asimptot: celo število, ulomek, π, poševna premica", () => {
  assert.equal(asymptoteLabel({ x: 1 }), "x = 1");
  assert.equal(asymptoteLabel({ x: -1 }), "x = −1");
  assert.equal(asymptoteLabel({ x: Math.PI / 2 }), "x = π/2");
  assert.equal(asymptoteLabel({ x: (-3 * Math.PI) / 2 }), "x = −3π/2");
  assert.equal(asymptoteLabel({ k: 0, n: 0 }), "y = 0");
  assert.equal(asymptoteLabel({ k: 1, n: 1 }), "y = x + 1");
  assert.equal(asymptoteLabel({ k: -2, n: -0.5 }), "y = −2x − 1/2");
  assert.equal(asymptoteLabel({ k: -1, n: 0 }), "y = −x");
  assert.equal(niceNumber(0.3712), "0,37");
});

test("zanimive točke: ničle, ekstremi, prevoj, pol", () => {
  const p = features(F.kub, -10, 10);
  const has = (type, x, eps = 1e-4) => p.some((q) => q.type === type && near(q.x, x, eps));
  assert.ok(has("max", -1) && has("min", 3) && has("infl", 1, 0.01), JSON.stringify(p));
  assert.equal(p.filter((q) => q.type === "root").length, 3);
  const r = features(F.rac, -10, 10);
  assert.ok(r.some((q) => q.type === "pole" && q.x === 1));
  assert.ok(r.some((q) => q.type === "root" && near(q.x, 2)) && r.some((q) => q.type === "root" && near(q.x, -2)));
});

test("okno: (x² − 4)/(x − 1) pokaže ničle, pol in presečišče z osjo y, ne −20 … 20", () => {
  const v = fitView([F.rac], { W: 320, H: 220 });
  for (const [x, y] of [[-2, 0], [2, 0], [0, 4]]) assert.ok(inView(v, x, y), JSON.stringify(v));
  assert.ok(inView(v, 1));
  assert.ok(v.xmax - v.xmin < 10 && v.ymax - v.ymin < 20, JSON.stringify(v)); // pol ne raztegne okna
});

test("okno: druge funkcije iz primerjave", () => {
  const W = 320, H = 220;
  const kub = fitView([F.kub], { W, H });
  for (const [x, y] of [[-1, 10], [3, -22], [1, -6], [-2.19, 0], [4.69, 0]]) assert.ok(inView(kub, x, y), `kub ${JSON.stringify(kub)}`);
  const x4 = fitView([(x) => x ** 4 - 5 * x * x + 4], { W, H }); // ničle ±1, ±2, trije ekstremi
  for (const x of [-2, -1, 1, 2]) assert.ok(inView(x4, x, 0), `x4 ${JSON.stringify(x4)}`);
  const ulo = fitView([F.ulo], { W, H });
  assert.ok(inView(ulo, -1) && inView(ulo, 2, 0) && inView(ulo, 0, -2) && ulo.ymin < 1 && ulo.ymax > 1);
  const tan = fitView([F.tan], { W, H });
  assert.ok(near(tan.xmin, -tan.xmax, 1e-6) && tan.xmax > 1.5 * Math.PI && tan.xmax < 4 * Math.PI, `tan ${JSON.stringify(tan)}`);
  const sin = fitView([F.sin], { W, H });
  assert.ok(sin.xmax >= 1.5 * Math.PI && sin.xmax < 3 * Math.PI && sin.ymin < -1 && sin.ymin > -3, `sin ${JSON.stringify(sin)}`);
  const sinW = fitView([F.sin], { W: 700, H: 220 }); // širok zaslon: dve periodi na vsako stran
  assert.ok(sinW.xmax >= 2 * Math.PI && sinW.xmax < 4 * Math.PI, `sin širok ${JSON.stringify(sinW)}`);
  const exp = fitView([F.exp], { W, H });
  assert.ok(inView(exp, 0, 1) && exp.ymin < 0 && exp.ymax < 40 && exp.xmax < 8, `exp ${JSON.stringify(exp)}`);
  // √x in ln x: okno večinoma desno od 0 (tam sta definirani)
  for (const f of ["sqrt", "ln"]) {
    const v = fitView([F[f]], { W, H });
    assert.ok(v.xmin < 0 && v.xmin > -1.5 && v.xmax > 4, `${f} ${JSON.stringify(v)}`);
  }
  assert.ok(inView(fitView([F.ln], { W, H }), 1, 0));
  // razmerje osi ostane razumno
  for (const [k, f] of Object.entries(F)) {
    const v = fitView([f], { W, H });
    const rho = (v.ymax - v.ymin) / H / ((v.xmax - v.xmin) / W);
    assert.ok(rho >= 0.19 && rho <= 8.01, `${k}: ${rho}`);
  }
});

test("okno: podano okno ostane, kot je; ena podana os, druga se prilagodi", () => {
  const fixed = { xmin: -2, xmax: 6, ymin: -5, ymax: 5 };
  assert.deepEqual(fitView([F.rac], { fixed }), fixed);
  const v = fitView([F.kub], { W: 320, H: 220, fixed: { xmin: 0, xmax: 4 } });
  assert.equal(v.xmin, 0);
  assert.equal(v.xmax, 4);
  assert.ok(inView({ ...v, xmin: -1, xmax: 5 }, 3, -22), JSON.stringify(v));
  assert.equal(fitView([], {}), null);
});

test("GRAF: neobvezno okno v seznamu", () => {
  assert.deepEqual(parseGraphView('["y = x^2", {"x": [-2, 6], "y": [-5, 5]}]'), { xmin: -2, xmax: 6, ymin: -5, ymax: 5 });
  assert.deepEqual(parseGraphView('["y = x^2", {"x": [-2, 6]}]'), { xmin: -2, xmax: 6 });
  assert.equal(parseGraphView('["y = x^2", {"x": [6, -2]}]'), null);
  assert.equal(parseGraphView('["y = x^2", {"x": ["a", 2]}]'), null);
  assert.equal(parseGraphView('["y = x^2"]'), null);
  const [b] = parseOpenBlocks('Graf.\n<<GRAF ["y = 1/x", {"x": [-3, 3], "y": [-4, 4]}]>>');
  assert.deepEqual(b, { kind: "graph", exprs: ["y = 1/x"], view: { xmin: -3, xmax: 3, ymin: -4, ymax: 4 } });
  assert.deepEqual(parseOpenBlocks('<<GRAF ["y = x"]>>')[0], { kind: "graph", exprs: ["y = x"] });
});
