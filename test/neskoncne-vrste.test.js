// AUDIT-002: neskončna vrsta ali produkt ni več delna vsota 100 000 členov. Divergentna vrsta pove, da divergira,
// konvergentna dobi »≈« in le zanesljiva mesta (preverjeno z znanimi vrednostmi), mejne primere kalkulator prizna.
import { test } from "node:test";
import assert from "node:assert/strict";
import { analyze } from "../public/graph/scisolve.js";
import { seriesInfo } from "../public/graph/math.js";

const env = { vars: {}, funcs: {}, ans: 0, deg: false, grad: false, comma: true };
const run = (t) => analyze(t, env);

test("divergentne vrste in produkti: sporočilo, ne število", () => {
  for (const t of ["sum(1/n;n;1;∞)", "∑_(n=1)^(∞) 1/n", "sum(n;n;1;∞)", "sum((−1)^n;n;1;∞)", "sum(1/√(n);n;1;∞)", "sum(2/(n+1);n;1;∞)", "sum(1/ln(n);n;2;∞)", "sum((−1)^n·n/(n+1);n;1;∞)"]) {
    const r = run(t);
    assert.equal(r.error?.code, "sumDiverge", `${t}: ${JSON.stringify(r)}`);
  }
  for (const t of ["prod(1+1/n;n;1;∞)", "prod(2;n;1;∞)"]) assert.equal(run(t).error?.code, "sumDiverge", t);
  assert.equal(run("prod(2;n;1;∞)").error.info.prod, true);
});

test("konvergentne vrste: ≈ in vsa prikazana mesta pravilna", () => {
  const cases = [
    ["sum(1/n²;n;1;∞)", Math.PI ** 2 / 6],
    ["sum(1/2^n;n;1;∞)", 1],
    ["sum((−1)^(n+1)/n;n;1;∞)", Math.LN2],
    ["sum((−1)^n/(2n+1);n;0;∞)", Math.PI / 4],
    ["sum(1/n!;n;0;∞)", Math.E],
    ["sum(1/n^1,5;n;1;∞)", 2.612375348685488],
    ["sum(n²/2^n;n;1;∞)", 6],
    ["sum(1/n⁴;n;1;∞)", Math.PI ** 4 / 90],
    ["prod(1+1/n²;n;1;∞)", Math.sinh(Math.PI) / Math.PI],
    ["prod(1−1/(4n²);n;1;∞)", 2 / Math.PI],
    ["2·sum(1/n²;n;1;∞) + 1", Math.PI ** 2 / 3 + 1],
  ];
  for (const [t, want] of cases) {
    const r = run(t);
    assert.ok(r && !r.error, `${t}: ${JSON.stringify(r?.error)}`);
    assert.equal(r.est, true, `${t}: »≈«`);
    // prikazana vrednost (zaokrožena na zanesljiva mesta) se ujema z resnično na vseh svojih mestih
    const digits = String(Math.abs(r.value)).replace(/^0\.0*|\./g, "").replace(/e.*$/, "").length;
    const tol = 0.51 * 10 ** (Math.floor(Math.log10(Math.abs(want))) - digits + 1);
    assert.ok(Math.abs(r.value - want) <= tol, `${t}: ${r.value} ≠ ${want} (${digits} mest)`);
    if (r.value !== want) assert.ok(digits >= 6, `${t}: le ${digits} mest`);
  }
});

test("pregled #1004: konvergentne vrste niso »divergira«, ničelni členi in izguba mest ne dajo napačnih mest", () => {
  // nikoli »divergira« brez dokaza (Dirichletove vrste: »ne morem zanesljivo«)
  for (const t of ["sum(cos(n)/n;n;1;∞)", "sum(sin(2n)/n;n;1;∞)", "sum(sin(n·π/2)/n;n;1;∞)", "sum((−1)^floor(n/2)/n;n;1;∞)"]) {
    const r = run(t);
    assert.notEqual(r.error?.code, "sumDiverge", t);
    assert.ok(r.error?.code === "sumUnknown" || r.est, t);
  }
  const ok = (t, want) => {
    const r = run(t);
    assert.ok(r && !r.error, `${t}: ${JSON.stringify(r?.error)}`);
    const digits = String(Math.abs(r.value)).replace(/^0\.0*|\./g, "").length;
    // ≈ z zanesljivimi mesti: razlika največ ena enota zadnjega prikazanega mesta
    const tol = 1.01 * 10 ** (Math.floor(Math.log10(Math.abs(r.value))) - digits + 1);
    assert.ok(Math.abs(r.value - want) <= tol, `${t}: ${r.value} ≠ ${want}`);
  };
  ok("sum((−1)^n/n^0,005;n;1;∞)", -0.50112819341117271599);
  ok("sum((−1)^n/ln(n)^0,2;n;2;∞)", 0.5712870729948153837);
  ok("sum((1+(−1)^n)/n^2;n;1;∞)", Math.PI ** 2 / 12);
  ok("sum(sin(n)^2/n^2;n;1;∞)", (Math.PI - 1) / 2);
  ok("sum(ln(1+1/n^2);n;1;∞)", 1.3018463986037126778);
  ok("sum(ln((n+1)^2/(n(n+2)));n;1;∞)", Math.LN2);
  ok("sum(1−cos(1/n);n;1;∞)", 0.77875857955275841504);
  ok("sum(sin(n)/n^2;n;1;∞)", 1.0139591323607684); // (π − 1)/2·… Clausen: Cl₂(1)
  ok("sum((−0,5)^n;n;1;∞)", -1 / 3);
  ok("sum(2^n/n!;n;0;∞)", Math.exp(2));
  const r = run("sum(cos(n·π/2)/n;n;1;∞)");
  assert.ok(r.error?.code === "sumUnknown" || Math.abs(r.value + Math.LN2 / 2) < 1e-6, JSON.stringify(r));
  for (const t of ["sum(sin(n);n;1;∞)", "sum(1/(n+1000);n;1;∞)", "sum(1/n^0,99;n;1;∞)"]) assert.equal(run(t).error?.code, "sumDiverge", t);
});

test("mejni primeri: kalkulator prizna, da ne ve; končne vsote ostanejo točne", () => {
  assert.equal(run("sum(1/(n·ln(n));n;2;∞)").error?.code, "sumUnknown");
  // faktor blizu 1 brez zapisa 1 − bₙ: zaokrožitev ln faktorja je v oceni napake (pregled #1004), ∏ = 1/2
  assert.ok(Math.abs(run("prod((n²−1)/n²;n;2;∞)").value - 0.5) < 1e-9);
  const f = run("sum(1/n²;n;1;100)");
  assert.equal(f.est, undefined);
  assert.ok(Math.abs(f.value - 1.6349839001848923) < 1e-15);
  assert.equal(seriesInfo((k) => 1 / (k * k), 1).series, true);
});
