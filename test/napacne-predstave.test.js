// P1-5: prepoznava napačnih predstav s kodo (server/napacne-predstave.js). Vsak vzorec iz načrta (predznak, obratna
// vrednost, faktor 2, red velikosti, enota) in napaka generatorja; pravilen rezultat (tudi v drugi enoti) in vse, česar
// koda ne prepozna, vrne null; opomba nikoli ne vsebuje pravilnega rezultata.
import test from "node:test";
import assert from "node:assert/strict";
import { napacnaPredstava, KODE } from "../server/napacne-predstave.js";

const np = (pravilno, ucenec) => napacnaPredstava({ pravilno, ucenec });

test("vzorci iz načrta", () => {
  const v = { value: 20, unit: "m/s" };
  assert.equal(np(v, "-20 m/s").koda, "sign");
  assert.deepEqual(np(v, "2000 m/s").params, { smer: "vec", times: "100" });
  assert.equal(np(v, "2000 m/s").koda, "magnitude");
  assert.deepEqual(np(v, "0,2 m/s").params, { smer: "manj", times: "100" });
  assert.equal(np(v, "0,05 m/s").koda, "reciprocal");
  assert.deepEqual(np(v, "40 m/s"), { koda: "factor2", params: { smer: "vec" }, opomba: np(v, "40 m/s").opomba });
  assert.equal(np(v, "10 m/s").params.smer, "manj");
  // enota ni pretvorjena: 72 (km/h) zapisano kot m/s ali brez enote
  assert.equal(np(v, "72 m/s").koda, "unit");
  assert.match(np(v, "72 m/s").opomba, /3,6/);
  assert.equal(np(v, "72").koda, "unit");
  assert.equal(np({ value: 300, unit: "s" }, "5 s").koda, "unit");
  assert.equal(np({ value: 300, unit: "K" }, "26,85 K").koda, "unit");
  // enota druge količine
  assert.deepEqual(np(v, "20 N").params, { ima: "N", prava: "m/s" });
  for (const x of ["-20 m/s", "2000 m/s", "0,05 m/s", "40 m/s", "72 m/s", "20 N"]) assert.ok(KODE.includes(np(v, x).koda));
});

test("napaka, ki jo našteje generator, ima prednost", () => {
  const r = np({ value: 12, mistakes: [{ value: 7, why: "Sešteval si namesto množil." }] }, "7");
  assert.equal(r.koda, "generator");
  assert.match(r.opomba, /Sešteval si namesto množil/);
});

test("pravilen rezultat, tudi v drugi enoti, ne da opombe", () => {
  assert.equal(np({ value: 20, unit: "m/s" }, "20 m/s"), null);
  assert.equal(np({ value: 20, unit: "m/s" }, "72 km/h"), null);
  assert.equal(np({ value: 0.5, unit: "m" }, "50 cm"), null);
  assert.equal(np("12,5 m/s", "45 km/h"), null);
  assert.equal(np(2.4567, "2,46"), null);
});

test("ob dvomu null: neprepoznana napaka, prazen ali predolg vnos, besedilo, neveljaven pravilen rezultat", () => {
  assert.equal(np({ value: 20, unit: "m/s" }, "23 m/s"), null);
  assert.equal(np(20, ""), null);
  assert.equal(np(20, "ne vem"), null);
  assert.equal(np(20, "1".repeat(81)), null);
  assert.equal(np(NaN, "20"), null);
  assert.equal(np(null, "20"), null);
  assert.equal(np("x", "20"), null);
  assert.equal(napacnaPredstava(), null);
});

test("zapis iz klepeta (LaTeX) in besedilo z enoto kot pravilen rezultat", () => {
  assert.equal(np("20 m/s", "$-20\\,\\mathrm{m/s}$").koda, "sign");
  assert.equal(np("12,5 m/s", "$25\\ \\text{m/s}$").koda, "factor2");
});

test("opomba je skrita navodila za inštruktorja: ne izda rezultata", () => {
  const cases = [["-20 m/s"], ["2000 m/s"], ["0,05 m/s"], ["40 m/s"], ["72 m/s"], ["20 N"]];
  for (const [x] of cases) {
    const o = np({ value: 20, unit: "m/s" }, x).opomba;
    assert.match(o, /^Koda: /);
    assert.match(o, /Rezultata ne povej/);
    assert.doesNotMatch(o, /\b20\b/, `opomba ne vsebuje pravilnega rezultata (${x})`);
  }
});
