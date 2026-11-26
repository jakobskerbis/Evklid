// Lažni alarmi skenerja, ki jih je našel nabor v2 (N-01, docs/preverjanje.md): pravilen odgovor je dobil »Zaznana
// napaka«. Vsak popravek ima tudi napačno sestro, ki mora ostati ujeta.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { prep } from "../public/scan/solvecore.js";
import { verifyAi } from "../public/scan/verify.js";
import { verifyAiFull } from "../server/scan.js";
import { casAvailable, casStop } from "../server/cas.js";

const HAVE = await casAvailable();
after(() => casStop());
const status = (naloga, sol) => verifyAi(naloga, sol).status;

test("prep: ukaz odreže le kot celo besedo (factorial ni »factor« + »ial«)", () => {
  assert.equal(prep("factorial(14)/factorial(4)"), "factorial(14)/factorial(4)");
  assert.equal(prep("Factorise x^2-4"), "x^2-4");
  assert.equal(prep("factorize: x^2-4"), "x^2-4");
  assert.equal(prep("factor x^2-4"), "x^2-4");
  assert.equal(prep("Reši: x+1=2"), "x+1=2");
  assert.equal(prep("simplifying"), "simplifying");
});

test("določeni integral: meje pi, 10 in v oklepajih se preberejo cele", () => {
  const int = (naloga, value) => status(naloga, { kind: "integral", variable: "x", value });
  assert.equal(int("∫_0^pi sin(x) dx", "2"), "numeric");
  assert.equal(int("∫_0^pi sin(x) dx", "1"), "wrong");
  assert.equal(int("∫_1^10 1/x dx", "ln(10)"), "numeric");
  assert.equal(int("∫_1^10 1/x dx", "ln(9)"), "wrong");
  assert.equal(int("∫_(0)^(pi/2) cos(x) dx", "1"), "numeric");
  assert.equal(int("∫_{-1}^{2} x^2 dx", "3"), "numeric");
  assert.equal(int("∫_0^3 x^2 dx", "9"), "numeric");
  assert.equal(int("∫_0^3 x^2 dx", "27"), "wrong");
  assert.equal(int("∫_-1^1 -1+1*x dx", "-2"), "numeric");
  // brez presledka za zgornjo mejo
  assert.equal(int("∫_0^1x^2 dx", "1/3"), "numeric");
  assert.equal(int("∫_0^2x dx", "2"), "numeric");
  assert.equal(int("∫_0^2x dx", "4"), "wrong");
  assert.equal(int("∫_0^1e^x dx", "e-1"), "numeric");
});

test("račun z zaokroženim decimalnim rezultatom je numerično pravilen, ne napaka", () => {
  const ar = (naloga, value) => status(naloga, { kind: "arith", value });
  assert.equal(ar("1/3", "0.33"), "numeric");
  assert.equal(ar("1/3", "0.34"), "wrong");
  assert.equal(ar("1/3+1/7", "0.476"), "numeric");
  assert.equal(ar("1/3+1/7", "0.477"), "wrong");
  assert.equal(ar("sqrt(2)", "1.414"), "numeric");
  assert.equal(ar("sqrt(2)", "1.415"), "wrong");
  assert.equal(ar("1/3", "0,33"), "numeric");
  assert.equal(ar("pi", "3.14"), "numeric");
  // točna decimalna vrednost ostane točno preverjena
  assert.equal(ar("1.2*0.3", "0.36"), "verified");
  // pregled: zaokrožitev ni sprejeta pri kratkem točnem decimalnem zapisu, pri eni sami števki in pri velikih številih
  assert.equal(ar("1.2*0.3", "0.4"), "wrong");
  assert.equal(ar("1/2+1/4", "0.8"), "wrong");
  assert.equal(ar("1/2+1/4", "0.7"), "wrong");
  assert.equal(ar("0.1*0.2", "0.0"), "wrong");
  assert.equal(ar("1/30000", "0.000"), "wrong");
  assert.equal(ar("1/3", "0.3"), "wrong");
  assert.equal(ar("12345678.9*1234.5", "15240740602.07"), "wrong");
  assert.equal(ar("1/3+10^10", "10000000000.34"), "wrong");
  assert.equal(ar("1/(4/3)", "4/3"), "wrong");
});

test("odpravljiva vrzel ni rešitev, pol z bližnjo ničlo pa ostane", () => {
  const eq = (naloga, solutions) => status(naloga, { kind: "equation", variable: "x", solutions });
  assert.equal(eq("(x^2-1)/(x+1)=-2", []), "numeric");
  assert.equal(eq("(x^2-1)/(x+1)=-2", ["-1"]), "wrong");
  assert.equal(eq("(x^2-1)/(x-1)=2", []), "numeric");
  assert.equal(eq("(x^2-9)/(x+3)=5", ["8"]), "numeric");
  // vrzel ne pogoltne prave rešitve ob njej
  assert.equal(eq("(x-1)*(x-2)/(x-2)=0", []), "wrong");
  assert.equal(eq("(x-1)*(x-2)/(x-2)=0", ["1"]), "numeric");
  assert.equal(eq("(x-1)*(x-2)/(x-2)=0", ["1", "2"]), "wrong");
  // rešitev tik ob polu, ki leži točno na mreži (prej ostala skrita): »ni rešitve« ne sme obveljati
  assert.equal(eq("1/(x-1)=1000000", []), "wrong");
  assert.equal(eq("1/(x-1)=1000", []), "wrong");
  assert.equal(eq("1/x=5000", []), "wrong");
  assert.equal(eq("1/(x-1)=1000", ["1.001"]), "numeric");
});

test("odvod hitro nihajoče funkcije (cos(x^6)) se primerja dovolj natančno", () => {
  const d = (naloga, value) => status(naloga, { kind: "derivative", variable: "x", value });
  assert.equal(d("f(x) = cos(x^5)", "-5*x^4*sin(x^5)"), "numeric");
  assert.equal(d("f(x) = cos(x^6)", "-6*x^5*sin(x^6)"), "numeric");
  assert.equal(d("f(x) = cos(x^6)", "-sin(x^6)"), "wrong");
  assert.equal(d("f(x) = cos(x^6)", "-6*x^5*sin(x^6)+0.001"), "wrong");
});

test("strežnik: zaokrožen račun SymPy sprejme le numerično, znanstveni zapis ostane strog", { skip: !HAVE && "SymPy ni na voljo" }, async () => {
  const ar = async (naloga, value) => (await verifyAiFull(naloga, { kind: "arith", value })).status;
  assert.equal(await ar("1/3+1/7", "0.476"), "numeric");
  assert.equal(await ar("1/3+1/7", "0.477"), "wrong");
  assert.equal(await ar("sqrt(2)", "1.414"), "numeric");
  assert.equal(await ar("1.2*0.3", "0.36"), "verified");
  // relativna rezerva workerja (1e-12·|v|) ne sme spraviti napačne zadnje števke velikega števila v toleranco
  assert.equal(await ar("12345678.9*1234.5", "15240740602.07"), "wrong");
  assert.equal(await ar("1/3+10^14", "100000000000099.33"), "wrong");
  assert.equal(await ar("123456789*987654321", "121932631112635300.0"), "wrong");
  assert.equal(await ar("1/2+1/4", "0.8"), "wrong");
  // napačna zadnja števka v znanstvenem zapisu: 53-bitni Float bi jo spravil v toleranco, zato tu »equal«
  assert.notEqual(await ar("123456789*987654321", "1.2193263111263526*10^17"), "numeric");
  assert.notEqual(await ar("123456789*987654321", "1.2193263111263526*10^17"), "verified");
  assert.equal(await ar("factorial(14)/factorial(4)", "3632428800"), "verified");
});
