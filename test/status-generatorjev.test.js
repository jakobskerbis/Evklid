// PV-10 (docs/preverjanje.md, »Status generatorjev«): status vsakega generatorja iz računov, korakov in odgovora.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { vZapisZaKorak, koraki, statusOdgovoraNaloge, popisGeneratorjev, povzemi, porocilo, niKorak, casStatus } from "../scripts/status-generatorjev.mjs";
import * as cas from "../server/cas.js";

const HAVE = await cas.casAvailable();
after(() => cas.casStop());

test("TeX v zapis za korak: le brez izgube", () => {
  assert.equal(vZapisZaKorak("1{,}5x + 25 = 94"), "1.5x + 25 = 94");
  assert.equal(vZapisZaKorak("\\dfrac{x}{2} \\le 3"), "((x)/(2)) <= 3");
  // ± , indeksi, besedilo, funkcije in absolutne vrednosti: ne prevajamo (texToText bi \pm izpustil)
  assert.equal(vZapisZaKorak("x = \\pm 3"), null);
  assert.equal(vZapisZaKorak("x_1 = 2"), null);
  assert.equal(vZapisZaKorak("F(2) = -4"), null);
  assert.equal(vZapisZaKorak("|x - 1| = 2"), null);
  assert.equal(vZapisZaKorak("n = 5\\ \\text{mol}"), null);
  // pregled: \log brez osnove (desetiški v šoli, naravni v workerju), mešano število, x^{2}3
  assert.equal(vZapisZaKorak("\\log(x) = 2"), null);
  assert.equal(vZapisZaKorak("2\\frac{1}{2} = x"), null);
  assert.equal(vZapisZaKorak("x^{2}3 = 1"), null);
  assert.equal(vZapisZaKorak("2\\frac{x}{3} = 4"), "2((x)/(3)) = 4");
});

test("pregled: nadaljevanje »= …« ni korak, i ni neznanka", () => {
  assert.deepEqual(koraki("$(x + 1)^2$\n$= x^2 + 2x + 1$\n$= 5$"), []);
  assert.deepEqual(koraki("$z = 3 + 4i$\n$z = 5i$"), []);
});

test("pregled: izgubljen interval je napaka, izgubljena posamezna rešitev brez statusa", () => {
  assert.equal(casStatus({ ok: false, vrsta: "izguba", why: "manjka del rešitve x ∈ (2, 3]" }), "napaka");
  assert.equal(casStatus({ ok: false, vrsta: "izguba", why: "izgubljena rešitev a = -17" }), "nepreverjeno");
  assert.equal(casStatus({ ok: false, vrsta: "napaka", why: "" }), "napaka");
});

test("pregled: identiteti zapored ali identiteta ob enačbi nista korak", { skip: !HAVE && "SymPy ni na voljo" }, async () => {
  const k = (prej, potem, neznanka = "x") => niKorak(cas, { prej, potem, neznanka });
  assert.equal(await k("(x + 6)^2 = x^2 + 12x + 36", "(4x + 1)(x + 3) = 4x^2 + 13x + 3"), true);
  // dve napačni identiteti: ∅ = ∅ ne sme dobiti potrditve
  assert.equal(await k("(x + 6)^2 = x^2 + 12x + 35", "(4x + 1)(x + 3) = 4x^2 + 13x + 2"), true);
  assert.equal(await k("(a + 4)^2 - a^2 = 8a + 16", "8a + 16 = 176", "a"), true);
  assert.equal(await k("2x + 3 = 7", "2x = 4"), false);
  // pravi korak v protislovje ostane korak (ukaz ga označi za napako)
  assert.equal(await k("x + 1 = 2", "x + 1 = x + 2"), false);
});

test("koraki: čiste vrstice, »ali« kot ena trditev, kandidati in pogoji niso koraki", () => {
  const k = (r) => koraki(r).map((x) => `${x.prej} | ${x.potem}`);
  assert.deepEqual(k("$2x + 3 = 7$\n$2x = 4$\n$x = 2$"), ["2x + 3 = 7 | 2x = 4", "2x = 4 | x = 2"]);
  // isti vrstici, ločeni z vejico
  assert.deepEqual(k("$1{,}5x = 69$, $x = 46$"), ["1.5x = 69 | x = 46"]);
  // razbitje na primere v isti vrstici je ena trditev
  assert.deepEqual(k("$x + 4 \\le -6$ ali $x + 4 \\ge 6$\n$x \\le -10$ ali $x \\ge 2$"), ["x + 4 <= -6 ali x + 4 >= 6 | x <= -10 ali x >= 2"]);
  // zaporedni kandidati za enačbo so ena trditev; za rešeno obliko ni koraka
  assert.deepEqual(k("$(x - 9)(x + 3) = 0$\n$x = 9$\n$x = -3$"), ["(x - 9)(x + 3) = 0 | x = 9 ali x = -3"]);
  // besedilo ob formuli pretrga verigo (»nima rešitve«, »Rešitev:«)
  assert.deepEqual(k("$2^x = -3$ nima rešitve.\nRešitev: $x = 3$"), []);
  // različni neznanki ali oddaljeni vrstici
  assert.deepEqual(k("$x = 42 - y$\n$15(42 - y) + 7y = 510$"), []);
  assert.deepEqual(k("$2x = 4$\n\n\n$x = 3$"), []);
  // celoštevilska neznanka (n ≥ 226 iz 4n > 900) ni korak na realnih številih
  assert.deepEqual(k("$4n > 900$\n$n \\ge 226$"), []);
});

test("odgovor: ujemanje s končno vrednostjo katere od relacij, sicer brez statusa", () => {
  const t = (solution, value, decimals = null) => statusOdgovoraNaloge({ answer: { type: "number", value, decimals }, solution });
  assert.equal(t("$x = 46$", 46).status, "numericno");
  assert.equal(t("$\\delta x = \\frac{9}{296} \\cdot 100\\ \\% \\approx 3{,}0\\ \\%$", 3.0405, 1).status, "numericno");
  assert.equal(t("$p = 1{,}6 \\cdot 10^{7}\\ \\mathrm{Pa}$", 1.6e7).status, "numericno");
  // odgovor ni v rešitvi: ni napaka, le brez statusa
  assert.equal(t("$x_1 = 2$, $x_2 = 3$", 5), null);
  // pregled: pas so decimalke odgovora, ne zapisa (z = 2 ne potrdi 2,28)
  assert.equal(t("$z = \\dfrac{508 - 500}{4} = 2$", 2.28, 2), null);
});

test("popis generatorjev: vsak generator dobi status, poročilo ima vse statuse", { skip: !HAVE && "SymPy ni na voljo" }, async () => {
  const gen = await popisGeneratorjev({ semena: 1, predpona: "dod-mat-ss12-l", cas });
  assert.ok(gen.length > 0);
  for (const g of gen) assert.ok(["izracunano", "numericno", "delno", "napaka", "nepreverjeno"].includes(g.status), g.id);
  const p = povzemi(gen);
  assert.equal(Object.values(p.poStatusu).reduce((a, b) => a + b, 0), gen.length);
  const r = porocilo(gen, { datum: "2026-01-01", commit: "abc", semena: 1, dodatek: "## Pregled\nPREGLED" });
  assert.match(r, /\| napaka \| \d+\/\d+ \(/);
  assert.match(r, /PREGLED[\s\S]*## Omejitve/);
  // linearne in logaritemske enačbe imajo korake, ki jih SymPy potrdi simbolno
  assert.ok(gen.some((g) => g.trditve.some((x) => x.vir === "korak" && x.status === "izracunano")));
});
