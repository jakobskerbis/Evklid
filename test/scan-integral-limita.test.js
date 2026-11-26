// Meritev skenerja 26. 11. (22 slik): AI je pri integralu odgovoril 0 namesto 6, odgovor pa je ostal »nepreverjen«,
// ker AI naloge ni poimenoval »integral« in preverjanje ni teklo (tudi ponovitve ne). Integral in limito zdaj
// prepoznamo po zapisu naloge; preverita ju lokalna numerika (integral) in SymPy (oba). Branje: naloga »predpis
// funkcije« je f(x)=?, ne splošna oblika (slika s08, ugibanje 1/22).
import test, { after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { kindOfText, parseIntegral, parseLimit, verifyAi, bezKonstante } from "../public/scan/verify.js";
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
  // pregled: večmestne in oklepajne meje, faktor pred ∫, d/dx ∫, x*dx, enostranske in neskončne točke
  assert.deepEqual(parseIntegral("∫_0^10 x dx"), { a: "0", b: "10", f: "x", x: "x" });
  assert.deepEqual(parseIntegral("∫_{-1}^{1} x^2 dx"), { a: "-1", b: "1", f: "x^2", x: "x" });
  assert.deepEqual(parseIntegral("\\int_0^{\\pi} sin(x)\\,dx"), { a: "0", b: "pi", f: "sin(x)", x: "x" });
  assert.equal(parseIntegral("∫ x*dx").f, "x");
  for (const t of ["2∫_0^1 x dx", "π∫_0^2 x^2 dx", "d/dx ∫_0^x t^2 dt"]) assert.equal(kindOfText(t), null, t);
  assert.equal(parseLimit("lim_{x\\to 0^+} 1/x").point, "0+");
  assert.equal(parseLimit("lim_{x\\to\\infty} 1/x").point, "oo");
  assert.equal(parseLimit("lim_(x→-∞) e^x").point, "-oo");
  assert.deepEqual(parseLimit("lim_(x->(1/2)) 2*x"), { x: "x", point: "(1/2)", f: "2*x" });
  assert.equal(bezKonstante("x^2 + C"), "x^2");
  assert.equal(bezKonstante("x^2"), "x^2");
  assert.equal(bezKonstante("x^2 + C*x"), null, "C ni le prištet");
  assert.equal(bezKonstante("cos(x)+K"), "cos(x)");
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
  assert.match(READ_PROMPT, /"text" is its name and variable with =\? \(f\(x\)=\?, g\(x\)=\?, p\(t\)=\?\), never a general form such as a\*\(x-p\)\^2\+q, and "sought" names the form asked for/);
  assert.match(READ_PROMPT, /A task with a written formula \(izračunaj f\(3\), odvajaj f\(x\)=x\^2/, "zapisana funkcija ostane naloga");
  // samo iskana neznanka brez podatkov ne gre v lastni reševalnik (bi dal »fx«)
  const src = fs.readFileSync(new URL("../public/scan/scan.js", import.meta.url), "utf8");
  assert.match(src, /const samoNeznanka = \/=\\s\*\\\?\\s\*\$\/\.test\(S\.text\);\s*let r = S\.given\.length \|\| samoNeznanka \?/);
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
  // pregled: nobena napačna trditev ni »preverjena«
  const st = async (t, value) => (await verifyAiFull(t, { kind: "other", value })).status;
  assert.equal(await st("∫_0^10 x dx", "0"), "wrong");
  assert.equal(await st("∫_0^10 x dx", "50"), "verified");
  assert.equal(await st("∫_{-1}^{1} x^2 dx", "2/3"), "verified");
  assert.notEqual(await st("2∫_0^1 x dx", "1/2"), "verified");
  assert.notEqual(await st("π∫_0^2 x^2 dx", "8/3"), "verified");
  assert.notEqual(await st("∫ 2*x dx", "x^2 + C*x"), "verified");
  assert.equal(await st("∫ cos(x) dx", "sin(x)+C"), "verified");
  assert.equal(await st("∫_0^pi sin(x) dx", "0"), "wrong");
  assert.equal(await st("lim_{x\\to 0^+} 1/x", "oo"), "verified");
  assert.equal(await st("lim_{x\\to\\infty} 1/x", "0"), "verified");
});
