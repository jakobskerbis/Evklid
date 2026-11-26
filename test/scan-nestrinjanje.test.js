// Skener po meritvi PV-02 (docs/preverjanje.md, »Meritev«): napačen odgovor ne sme dobiti »Preverjeno«, kadar ga SymPy
// sprejme le s preizkusom v točkah ali s toleranco zapisa, točna lokalna algebra pa ga ovrže.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { verifyAi } from "../public/scan/verify.js";
import { verifyAiFull } from "../server/scan.js";
import { casAvailable, casStop } from "../server/cas.js";

const HAVE = await casAvailable();
after(() => casStop());
const eq = (solutions) => ({ kind: "equation", variable: "x", solutions });

test("lokalno: točen protiprimer je označen kot točen", () => {
  const r = verifyAi("(x-2)*(x-2400000)=0", eq(["2", "2*10^6"]));
  assert.equal(r.status, "wrong");
  assert.equal(r.exact, true);
  assert.equal(verifyAi("(x+1000000)^2", { kind: "expression", variable: "x", value: "x^2+1999999*x+1000000000000" }).exact, true);
  // numeričen »ne drži« ni točen
  assert.equal(verifyAi("2^x=3", eq(["1.7"])).exact, undefined);
});

test("lokalno: odvod polinoma se preveri točno", () => {
  const d = (f, v) => verifyAi(`f(x) = ${f}`, { kind: "derivative", variable: "x", value: v });
  assert.equal(d("(x+1000000)^3", "3*x^2+5999999*x+3000000000000").status, "wrong");
  assert.equal(d("(x+1000000)^3", "3*(x+1000000)^2").status, "verified");
  assert.equal(d("x^3-2*x", "3*x^2-2").status, "verified");
  assert.equal(d("a*x^2", "2*a*x").status, "verified"); // druge črke so konstante
  assert.equal(d("sin(x)", "cos(x)").status, "numeric"); // ni polinom: kot prej
});

test("strežnik: SymPy ne preglasi točnega protiprimera, približek ni »Preverjeno«", { skip: !HAVE && "SymPy ni na voljo" }, async () => {
  const s = async (t, sol) => (await verifyAiFull(t, sol)).status;
  assert.notEqual(await s("(x+1000000)^2", { kind: "expression", variable: "x", value: "x^2+1999999*x+1000000000000" }), "verified");
  assert.notEqual(await s("f(x) = (x+1000000)^3", { kind: "derivative", variable: "x", value: "3*x^2+5999999*x+3000000000000" }), "verified");
  assert.notEqual(await s("(x-2)*(x-2400000)=0", eq(["2", "2*10^6"])), "verified");
  assert.notEqual(await s("x-1400000=0", eq(["1e6"])), "verified");
  assert.equal(await s("x^2=2000000", eq(["≈1414", "≈-1414"])), "numeric");
  // pravilni odgovori ostanejo »Preverjeno«
  assert.equal(await s("(x-2)*(x-2400000)=0", eq(["2", "2400000"])), "verified");
  assert.equal(await s("(x+1000000)^2", { kind: "expression", variable: "x", value: "x^2+2000000*x+1000000000000" }), "verified");
  assert.equal(await s("x^2-5*x+6=0", eq(["2", "3"])), "verified");
  // besedilo korakov (»i« = »in« v hrvaščini in italijanščini) ne izklopi točnega protiprimera
  const koraki = { methods: [{ steps: [{ title: "Kvadriramo binom i sredimo", why: "i" }] }] };
  assert.notEqual(await s("(x+1000000)^2", { kind: "expression", variable: "x", value: "x^2+1999999*x+1000000000000", ...koraki }), "verified");
  assert.notEqual(await s("(x-2)*(x-2400000)=0", { ...eq(["2", "2*10^6"]), ...koraki }), "verified");
  // kompleksna števila: i je za SymPy imaginarna enota, lokalno spremenljivka; lokalni »ne drži« tu ni točen
  assert.equal(await s("(1+i)^2", { kind: "arith", value: "2*i" }), "verified");
  assert.equal(await s("(2+3*i)*(2-3*i)", { kind: "arith", value: "13" }), "verified");
  // znanstveni zapis in predznaki se preberejo kot števila, ne kot Eulerjevo število
  assert.equal(await s("1000*x=1", eq(["1e-3"])), "verified");
  assert.equal(await s("x-1400000=0", eq(["1.4e6"])), "verified");
  assert.equal(await s("x^2=2", eq(["−1.414", "1.414"])), "numeric");
  assert.equal(await s("x^2=2", eq(["- 1.414", "1.414"])), "numeric");
});

test("strežnik: SymPy, ki se odloči v naključnih točkah, je največ »Numerično« (PV-03)", { skip: !HAVE && "SymPy ni na voljo" }, async () => {
  const s = async (t, sol) => (await verifyAiFull(t, sol)).status;
  const ex = (value) => ({ kind: "expression", variable: "x", value });
  const dv = (value) => ({ kind: "derivative", variable: "x", value });
  // napačni odgovori z velikimi koeficienti v izrazu, ki ni polinom (pregled popravka skenerja)
  assert.notEqual(await s("(x+1000000)^2 + sin(x)", ex("x^2+1999999*x+1000000000000+sin(x)")), "verified");
  assert.notEqual(await s("f(x) = (x+1000000)^3 + sqrt(2)", dv("3*x^2+5999999*x+3000000000000")), "verified");
  assert.notEqual(await s("f(x) = exp(1)*(x+1000000)^3", dv("exp(1)*(3*x^2+5999999*x+3000000000000)")), "verified");
  // pravilni simbolni ostanejo »Preverjeno«
  assert.equal(await s("(x+1)^2 + sin(x)", ex("x^2+2*x+1+sin(x)")), "verified");
  assert.equal(await s("f(x) = sin(x)^2", dv("2*sin(x)*cos(x)")), "verified");
});

test("lokalno: zapis e se prebere kot desetiška potenca", () => {
  assert.equal(verifyAi("x-1400000=0", eq(["1.4e6"])).status, "verified");
  assert.equal(verifyAi("x-1400000=0", eq(["1e6"])).status, "wrong");
  assert.equal(verifyAi("1000*x=1", eq(["1e-3"])).status, "verified");
  assert.equal(verifyAi("(1+i)^2", { kind: "arith", value: "2*i" }).exact, undefined);
});
