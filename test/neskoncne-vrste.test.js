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

test("mejni primeri: kalkulator prizna, da ne ve; končne vsote ostanejo točne", () => {
  assert.equal(run("sum(1/(n·ln(n));n;2;∞)").error?.code, "sumUnknown");
  assert.equal(run("prod((n²−1)/n²;n;2;∞)").error?.code, "sumUnknown");
  const f = run("sum(1/n²;n;1;100)");
  assert.equal(f.est, undefined);
  assert.ok(Math.abs(f.value - 1.6349839001848923) < 1e-15);
  assert.equal(seriesInfo((k) => 1 / (k * k), 1).series, true);
});
