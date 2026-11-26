// Meritev skenerja 26. 11. (22 slik): AI je pri integralu odgovoril 0 namesto 6, odgovor pa je ostal »nepreverjen«,
// ker AI naloge ni poimenoval »integral« in preverjanje ni teklo (tudi ponovitve ne). Integral in limito zdaj
// prepoznamo po zapisu naloge; preverita ju lokalna numerika (integral) in SymPy (oba). Branje: naloga »predpis
// funkcije« je f(x)=?, ne splošna oblika (slika s08, ugibanje 1/22).
import test, { after } from "node:test";
import assert from "node:assert/strict";
import { kindOfText, parseIntegral, parseLimit, verifyAi } from "../public/scan/verify.js";
import { verifyAiFull, READ_PROMPT } from "../server/scan.js";
import { casAvailable, casStop } from "../server/cas.js";

const HAVE = await casAvailable();
const cas = HAVE ? test : test.skip;
after(() => casStop());

test("vrsta naloge iz zapisa: integral in limita, ne enačba z njima", () => {
  assert.equal(kindOfText("∫_0^2 (3*x^2-2*x+1) dx"), "integral");
  assert.equal(kindOfText("\\int_0^2 x dx"), "integral");
  assert.equal(kindOfText("∫ x^2 dx"), "integral");
  assert.equal(kindOfText("lim_(x->2) (x^2-4)/(x^2-5*x+6)"), "limit");
  assert.equal(kindOfText("\\lim_{x\\to 0} sin(x)/x"), "limit");
  assert.equal(kindOfText("∫_0^a x dx=2"), null, "enačba z integralom ostane enačba");
  assert.equal(kindOfText("lim_(x->a) x^2 = 4"), null);
  assert.equal(kindOfText("x^2-4=0"), null);
  assert.equal(kindOfText("limit"), null);
  assert.deepEqual(parseIntegral("∫_0^2 (3*x^2-2*x+1) dx"), { a: "0", b: "2", f: "(3*x^2-2*x+1)", x: "x" });
  assert.deepEqual(parseIntegral("∫ x^2 dx"), { a: undefined, b: undefined, f: "x^2", x: "x" });
  assert.deepEqual(parseLimit("lim_(x->oo) 1/x"), { x: "x", point: "oo", f: "1/x" });
  assert.deepEqual(parseLimit("\\lim_{x\\to 0} sin(x)/x"), { x: "x", point: "0", f: "sin(x)/x" });
});

test("integral: napačen odgovor je »napačno« (sproži ponovitev), ne glede na vrsto, ki jo je dal AI", () => {
  for (const kind of ["arith", "expression", "other", undefined]) {
    const bad = verifyAi("∫_0^2 (3*x^2-2*x+1) dx", { kind, value: "0" });
    assert.equal(bad.reason, "wrong", String(kind));
    assert.equal(bad.status, "wrong");
    const ok = verifyAi("∫_0^2 (3*x^2-2*x+1) dx", { kind, value: "6" });
    assert.equal(ok.verified, true, String(kind));
  }
});

test("branje: predpis funkcije je f(x)=?, ne splošna oblika", () => {
  assert.match(READ_PROMPT, /"text" is f\(x\)=\? with the function's own name, never a general form such as a\*\(x-p\)\^2\+q/);
});

cas("SymPy: določeni in nedoločeni integral, limita (tudi v ∞), napačen odgovor z razlogom", async () => {
  const r0 = await verifyAiFull("∫_0^2 (3*x^2-2*x+1) dx", { kind: "arith", value: "0" });
  assert.equal(r0.status, "wrong");
  assert.match(r0.cas, /integral je 6/);
  assert.equal((await verifyAiFull("∫_0^2 (3*x^2-2*x+1) dx", { kind: "other", value: "6" })).status, "verified");
  assert.equal((await verifyAiFull("∫ 2*x dx", { kind: "other", value: "x^2+C" })).status, "verified");
  assert.equal((await verifyAiFull("lim_(x->2) (x^2-4)/(x^2-5*x+6)", { kind: "arith", value: "-4" })).status, "verified");
  const l = await verifyAiFull("lim_(x->2) (x^2-4)/(x^2-5*x+6)", { kind: "arith", value: "4" });
  assert.equal(l.status, "wrong");
  assert.match(l.cas, /limita je -4/);
  assert.equal((await verifyAiFull("lim_(x->oo) (2*x+1)/(x-3)", { kind: "limit", value: "2" })).status, "verified");
  assert.equal((await verifyAiFull("lim_(x->0) sin(x)/x", { kind: "limit", value: "1" })).status, "verified");
});
