// PV-03 (docs/preverjanje.md): worker v odgovoru pove, kako je preveril (how: symbolic | numeric | sampled).
// »Računsko preverjeno« sme biti samo simbolni dokaz; vzorčenje v točkah in toleranca zapisa nista dokaz.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { casCheck, casAvailable, casStop } from "../server/cas.js";

const HAVE = await casAvailable();
after(() => casStop());
const nacin = async (op, args) => {
  const r = await casCheck(op, args);
  return `${r.ok}/${r.how}`;
};

test("worker: način preverjanja", { skip: !HAVE && "SymPy ni na voljo" }, async () => {
  // simbolno
  assert.equal(await nacin("solve", ["x^2-5*x+6=0", "x", "2, 3"]), "true/symbolic");
  assert.equal(await nacin("solve", ["sqrt(x+1)=x-1", "x", "3"]), "true/symbolic");
  assert.equal(await nacin("equal", ["(x+3)^2", "x^2+6*x+9"]), "true/symbolic");
  assert.equal(await nacin("diff", ["x^3", "x", "3*x^2"]), "true/symbolic");
  assert.equal(await nacin("int", ["sin(x)", "x", "0", "pi", "2"]), "true/symbolic");
  assert.equal(await nacin("value", ["3/4+1/2", "5/4"]), "true/symbolic");
  assert.equal(await nacin("ineq", ["x^2-1<0", "x", "(-1, 1)"]), "true/symbolic");
  assert.equal(await nacin("units", ["72*km/h", "20*m/s"]), "true/symbolic");
  assert.equal(await nacin("solve", ["x+y=3, x-y=1", "x, y", "x=2, y=1"]), "true/symbolic");
  // simbolni prepisi, ki jih simplify sam ne najde (pregled PV-03)
  assert.equal(await nacin("equal", ["tan(x)+cot(x)", "2/sin(2*x)"]), "true/symbolic");
  assert.equal(await nacin("equal", ["sqrt(x^2+6*x+9)", "abs(x+3)"]), "true/symbolic");
  assert.equal(await nacin("diff", ["abs(x)", "x", "x/abs(x)"]), "true/symbolic");
  assert.equal(await nacin("diff", ["ln(abs(x))", "x", "1/x"]), "true/symbolic");
  assert.equal(await nacin("equal", ["ln(2)/(ln(3)-ln(2))", "log(2)/log(3/2)"]), "true/symbolic");
  // decimalke: točen račun z ulomki ostane simbolen, 53-bitno zaokroževanje, ki skrije napako, pa ne (pregled PV-03)
  assert.equal(await nacin("value", ["0.05*240", "12"]), "true/symbolic");
  assert.equal(await nacin("value", ["100000000.05*100000001", "10000000105000000"]), "true/numeric");
  assert.equal(await nacin("solve", ["x/100000001=100000000.05", "x", "10000000105000000"]), "true/numeric");
  assert.equal(await nacin("ineq", ["x/3 < 0.1", "x", "x < 0.3"]), "true/symbolic");
  assert.equal((await casCheck("ineq", ["x/100000001 < 100000000.05", "x", "x < 10000000105000000"])).ok, false);
  // sistem s kotnimi funkcijami: sp.solve vrne le glavne rešitve, popolnost ni dokazana
  assert.equal(await nacin("solve", ["sin(x)=y, cos(x)=y", "x, y", "x=pi/4, y=sqrt(2)/2"]), "true/numeric");
  assert.equal(await nacin("solve", ["x^2+y^2=25, x+y=7", "x, y", "x=3, y=4; x=4, y=3"]), "true/symbolic");
  assert.equal(await nacin("solve", ["sin(x)=0, y=x", "x, y", "x=0, y=0; x=pi, y=pi"]), "true/numeric");
  // vzorčeno: velik koeficient, napačen za 1, sprejme le preizkus v točkah
  assert.equal(await nacin("equal", ["(x+1000000)^2", "x^2+1999999*x+1000000000000"]), "true/sampled");
  // številsko: toleranca zapisa, decimalke, popolnost periodičnih rešitev le na odseku
  assert.equal(await nacin("solve", ["x^2-2*x-1=0", "x", "2.414, -0.414"]), "true/numeric");
  assert.equal(await nacin("solve", ["(x-2)*(x-2400000)=0", "x", "2, 2*10^6"]), "true/numeric");
  assert.equal(await nacin("value", ["sqrt(2)", "1.414"]), "true/numeric");
  assert.equal(await nacin("units", ["3.2*kg*9.81*m/s^2", "31.4*N"]), "true/numeric");
  assert.equal(await nacin("solve", ["sin(x)=0", "x", "k*pi"]), "true/numeric");
  assert.equal(await nacin("equal", ["0.1+0.2", "0.3"]), "true/numeric");
  // »ne drži« ostane, kot je bil
  assert.equal((await casCheck("value", ["3/4+1/2", "4/6"])).ok, false);
  assert.equal((await casCheck("solve", ["x^2-5*x+6=0", "x", "2"])).ok, false);
  assert.equal((await casCheck("equal", ["tan(x)+cot(x)", "3/sin(2*x)"])).ok, false);
  assert.equal((await casCheck("equal", ["sqrt(x^2+6*x+9)", "abs(x-3)"])).ok, false);
  // točno število, ki ni 0, a je manjše od 10⁻¹²: prej »enako 0«, zdaj simbolno ne
  assert.equal(await nacin("equal", ["e^(-60)", "0"]), "false/symbolic");
});

test("cas.js: neznan ukaz (ok null) ne dobi polja how", { skip: !HAVE && "SymPy ni na voljo" }, async () => {
  const r = await casCheck("neznan", ["x"]);
  assert.equal(r.ok, null);
  assert.equal("how" in r, false);
});
