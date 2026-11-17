// Graf v odgovoru inštruktorja: okno po zanimivih točkah in asimptote (public/graph/okno.js, server/odpri.js).
import { test } from "node:test";
import assert from "node:assert/strict";
import { fitView, fitModelView, modelAsymptoteLabels, verticalAsymptotes, endAsymptotes, asymptoteLabel, niceNumber, features, domainEdges } from "../public/graph/okno.js";
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

test("pregled #802: k/x, e^(−x²), log, floor, |x|, √(x² − 4), e^(1/x) in drugi robni primeri", async () => {
  const W = 320, H = 220;
  // k/x: okno pri osi x, y = 0 tudi za velik k
  for (const k of [100, 1000]) {
    const f = (x) => k / x;
    const v = fitView([f], { W, H });
    assert.ok(v.ymin < 0 && v.ymax > 0, `${k}/x ${JSON.stringify(v)}`);
    // krivulja je v oknu vidna (vsaj tretjina vzorcev na vidni osi x)
    const ys = Array.from({ length: 401 }, (_, i) => f(v.xmin + ((v.xmax - v.xmin) * i) / 400));
    assert.ok(ys.filter((y) => y > v.ymin && y < v.ymax).length > 130, `${k}/x krivulja ni vidna ${JSON.stringify(v)}`);
    assert.deepEqual(endAsymptotes(f), [{ k: 0, n: 0, sides: [-1, 1] }]);
  }
  const x2k = fitView([(x) => x * x + 1000], { W, H });
  assert.ok(x2k.ymin > 995 && x2k.ymin < 1000 && x2k.ymax > 1005 && x2k.ymax < 1020, JSON.stringify(x2k));
  // e^(−x²): ničle zaradi podkoračitve niso zanimive točke
  const g = fitView([(x) => Math.exp(-x * x)], { W, H });
  assert.ok(g.xmax < 6 && g.xmin > -6 && inView(g, 0, 1), JSON.stringify(g));
  // log x in 0,5·ln x: navpična asimptota x = 0
  assert.deepEqual(verticalAsymptotes(Math.log10, -1, 5), [0]);
  assert.deepEqual(verticalAsymptotes((x) => 0.5 * Math.log(x), -1, 5), [0]);
  // floor, round, x^x: ni lažnih asimptot
  for (const f of [Math.floor, Math.round, (x) => x ** x]) assert.deepEqual(endAsymptotes(f), [], String(f));
  // |x| in odsekoma podana funkcija: stran, kjer je funkcija sama premica, nima asimptote
  assert.deepEqual(endAsymptotes(Math.abs), []);
  assert.deepEqual(endAsymptotes((x) => (x < 0 ? 1 / x : x)), [{ k: 0, n: 0, sides: [-1] }]);
  // √(x² − 4): oba kraka (robova ±2) in poševni asimptoti y = ±x; √(1 − x²) na sredini
  const sq = (x) => Math.sqrt(x * x - 4);
  const e = domainEdges(sq, -5, 5);
  assert.equal(e.length, 2);
  assert.ok(near(e[0].x, -2) && near(e[1].x, 2));
  const v4 = fitView([sq], { W, H });
  assert.ok(inView(v4, -2, 0) && inView(v4, 2, 0) && near(v4.xmin, -v4.xmax, 1e-6), JSON.stringify(v4));
  assert.deepEqual(endAsymptotes(sq), [{ k: -1, n: 0, sides: [-1] }, { k: 1, n: 0, sides: [1] }]);
  const v1 = fitView([(x) => Math.sqrt(1 - x * x)], { W, H });
  assert.ok(near(v1.xmin, -v1.xmax, 1e-6) && v1.xmax > 1 && v1.xmax < 2, JSON.stringify(v1));
  // e^(1/x): pol pri 0 (ni prekoračitev), y = 1
  assert.deepEqual(verticalAsymptotes((x) => Math.exp(1 / x), -3, 3), [0]);
  assert.deepEqual(verticalAsymptotes(Math.exp, 600, 800), []);
  // bližnja pola, majhne oznake, ena asimptota y = 0 za 1/(x − 1000)
  const two = verticalAsymptotes((x) => 1 / (x * x - 0.000001), -3.6, 3.6);
  assert.equal(two.length, 2);
  assert.equal(asymptoteLabel({ x: two[1] }), "x = 0,001");
  assert.deepEqual(endAsymptotes((x) => 1 / (x - 1000)), [{ k: 0, n: 0, sides: [-1, 1] }]);
  // samo točka (3, 4): vidni osi
  const p = fitView([], { W, H, points: [[3, 4]] });
  assert.ok(inView(p, 0, 0) && inView(p, 3, 4), JSON.stringify(p));
  // krožnica in premica: okna ne prilagajamo (krožnica bi bila odrezana)
  const { buildModel, emptyState, newId } = await import("../public/graph/model.js");
  const st = emptyState();
  st.items = ["x^2 + y^2 = 25", "y = x"].map((text) => ({ id: newId(), type: "expr", text }));
  assert.equal(fitModelView(buildModel(st), { W, H }), null);
  st.items = ["y = x^2 - 4"].map((text) => ({ id: newId(), type: "expr", text }));
  assert.ok(fitModelView(buildModel(st), { W, H }));
  assert.equal(parseGraphView('["y = x", {"x": [1, 1.0000000001]}]'), null);
});

test("ponovni pregled #802: e^(−x²) ima y = 0, strme funkcije brez prevelike osi x, tan(x)/x brez ostanka", () => {
  const W = 320, H = 220;
  assert.deepEqual(endAsymptotes((x) => Math.exp(-x * x)), [{ k: 0, n: 0, sides: [-1, 1] }]);
  assert.deepEqual(endAsymptotes(Math.abs), []);
  for (const [name, f, max] of [
    ["10⁶·x", (x) => 1e6 * x, 25],
    ["e^x − 1000", (x) => Math.exp(x) - 1000, 40],
    ["1000/x", (x) => 1000 / x, 25],
  ]) {
    const v = fitView([f], { W, H });
    assert.ok(v.xmax - v.xmin <= max, `${name} ${JSON.stringify(v)}`);
  }
  const e = fitView([(x) => Math.exp(x) - 1000], { W, H });
  assert.ok(inView(e, Math.log(1000), 0), JSON.stringify(e)); // ničla ln 1000 ≈ 6,9
  for (const a of endAsymptotes((x) => Math.tan(x) / x)) assert.ok(a.n === 0 || Math.abs(a.n) > 1e-3, JSON.stringify(a));
});

test("pregled 3 #802: ravne funkcije brez tisočev kandidatov za pol, opis asimptot za bralnike zaslona", async () => {
  for (const [name, f] of [["y = 3", () => 3], ["floor", Math.floor], ["sign", Math.sign]]) {
    let n = 0;
    fitView([(x) => (n++, f(x))], { W: 320, H: 220 });
    assert.ok(n < 60000, `${name}: ${n} izračunov`);
  }
  // pri risanju brez drobnega pregleda: pol je še vedno najden
  assert.deepEqual(verticalAsymptotes((x) => 1 / (x - 1), -5, 5, 320, { fine: false }), [1]);
  const { buildModel, emptyState, newId } = await import("../public/graph/model.js");
  const st = emptyState();
  st.items = ["y = (x^2 - 4)/(x - 1)"].map((text) => ({ id: newId(), type: "expr", text }));
  const model = buildModel(st);
  assert.deepEqual(modelAsymptoteLabels(model, fitModelView(model, { W: 320, H: 220 })), ["x = 1", "y = x + 1"]);
});

test("pregled #811: histogram z delnim oknom, krajišči navpične daljice v oknu", async () => {
  const { buildModel, emptyState, newId } = await import("../public/graph/model.js");
  const model = (...texts) => {
    const st = emptyState();
    st.items = texts.map((text) => ({ id: newId(), type: "expr", text }));
    return buildModel(st);
  };
  const W = 320, H = 220;
  const hist = model("0 <= y <= {0 <= x < 2: 30, 2 <= x < 4: 50}");
  // samo os y (visoki stolpci): ostane, os x je običajna
  assert.deepEqual(fitModelView(hist, { W, H, fixed: { ymin: 0, ymax: 60 } }), { xmin: -10, xmax: 10, ymin: 0, ymax: 60 });
  // samo os x: ostane, os y je običajna
  assert.deepEqual(fitModelView(hist, { W, H, fixed: { xmin: 0, xmax: 4 } }), { xmin: 0, xmax: 4, ymin: -7, ymax: 7 });
  assert.deepEqual(fitModelView(hist, { W, H, fixed: { xmin: 0, xmax: 4, ymin: 0, ymax: 60 } }), { xmin: 0, xmax: 4, ymin: 0, ymax: 60 });
  assert.equal(fitModelView(hist, { W, H, fixed: {} }), null);
  assert.equal(fitModelView(hist, { W, H, fixed: { xmin: 4, xmax: 0 } }), null);
  // navpična daljica daleč od izhodišča (tudi s strogo mejo) in skupaj s funkcijo
  for (const [texts, pts] of [
    [["x = 30 {20 <= y <= 40}"], [[30, 20], [30, 40]]],
    [["x = -5 {-12 < y < -9}"], [[-5, -11.99], [-5, -9.01]]],
    [["y = 1", "x = 4 {-1 <= y <= 25}"], [[4, -1], [4, 25]]],
  ]) {
    const v = fitModelView(model(...texts), { W, H, fixed: {} });
    for (const [x, y] of pts) assert.ok(inView(v, x, y), `${texts}: ${JSON.stringify(v)}`);
  }
});
