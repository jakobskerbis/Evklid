// PV-02 (docs/preverjanje.md, »Meritev«): referenčni nabor in meritev preverjanja. Glavna metrika je 0 napačno
// potrjenih trditev v vsem, kar vidi učenec. Znane izjeme spodaj so izmerjeno izhodišče 25. 11. 2026 in čakajo na
// popravek; test pade ob vsaki NOVI napačni potrditvi, novem lažnem alarmu ali izjemi, in kadar motor ujame ali
// potrdi manj kot ob izhodišču (pokvarjen preverjevalnik se ne sme skriti med »nepreverjeno«).
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { naloziNabor, izmeri, razvrsti } from "../scripts/meri-preverjanje.mjs";
import { casAvailable, casStop } from "../server/cas.js";

const nabor = naloziNabor();
const HAVE = await casAvailable();
after(() => casStop());

const LOKALNO_ALARMI = ["luknja-009", "luknja-017", "integral-019", "integral-021", "skoraj-009", "skoraj-016", "skoraj-018", "skoraj-022"];
const IZHODISCE = {
  "skener-lokalno": { potrjene: [], previsoki: [], alarmi: LOKALNO_ALARMI, ujete: 172, potrjena: 101 },
  // Ob počasnem SymPy (rok 9 s) skener uporabi lokalno preverjanje, zato so dovoljeni tudi njegovi znani alarmi.
  skener: {
    // velika koeficienta (vzorčenje v worker.py is_zero) in znanstveni zapis (decimals_tol): docs/preverjanje.md
    potrjene: ["skoraj-002", "skoraj-006", "skoraj-008", "skoraj-010"],
    previsoki: ["skoraj-013"],
    alarmi: ["integral-019", "integral-021", "skoraj-016", "skoraj-018", "skoraj-022", ...LOKALNO_ALARMI],
    ujete: 178,
    potrjena: 153,
  },
};

test("nabor: dovolj trditev, vsaka skupina ima pravilne in napačne", () => {
  assert.ok(nabor.length >= 380, `premalo trditev: ${nabor.length}`);
  assert.equal(new Set(nabor.map((p) => p.id)).size, nabor.length, "id ni enoličen");
  const skupine = new Map();
  for (const p of nabor) {
    assert.equal(typeof p.pravilno, "boolean", p.id);
    assert.ok(p.sol || p.racun, `${p.id}: ni ne rešitve ne ukaza`);
    const s = skupine.get(p.skupina) || { da: 0, ne: 0 };
    s[p.pravilno ? "da" : "ne"]++;
    skupine.set(p.skupina, s);
  }
  for (const [k, s] of skupine) assert.ok(s.da && s.ne, `skupina ${k}: ${JSON.stringify(s)}`);
  const naloge = nabor.map((p) => JSON.stringify([p.naloga, p.sol, p.racun]));
  assert.equal(new Set(naloge).size, naloge.length, "podvojena trditev");
});

test("razvrsti: vsak izid ima svoj razred", () => {
  assert.equal(razvrsti({ pravilno: false }, "izracunano"), "napacno_potrjena");
  assert.equal(razvrsti({ pravilno: false }, "dokazano"), "napacno_potrjena");
  assert.equal(razvrsti({ pravilno: false }, "numericno"), "napacna_sibko");
  assert.equal(razvrsti({ pravilno: false }, "delno"), "napacna_sibko");
  assert.equal(razvrsti({ pravilno: false }, "nepreverjeno"), "nepreverjena");
  assert.equal(razvrsti({ pravilno: true }, "napaka"), "lazni_alarm");
  assert.equal(razvrsti({ pravilno: true, najvec: "numericno" }, "izracunano"), "previsok_status");
  assert.equal(razvrsti({ pravilno: true }, "numericno"), "sibkejsi_status");
  assert.throws(() => razvrsti({ pravilno: true }, "preverjeno"));
});

for (const motor of ["skener-lokalno", "skener"]) {
  test(`meritev ${motor}: nič novih napačnih potrditev, alarmov ali izjem; ne slabše od izhodišča`, { skip: motor === "skener" && !HAVE && "SymPy ni na voljo" }, async () => {
    const r = (await izmeri(nabor, { motorji: [motor] }))[motor];
    const z = IZHODISCE[motor];
    const id = (razred) => r.primeri.filter((v) => v.razred === razred).map((v) => v.id);
    const novi = (razred, znani) => id(razred).filter((x) => !znani.includes(x));
    assert.deepEqual(id("izjema"), []);
    assert.deepEqual(novi("napacno_potrjena", z.potrjene), [], "nova napačno potrjena trditev");
    assert.deepEqual(novi("previsok_status", z.previsoki), [], "nov previsok status");
    assert.deepEqual(novi("lazni_alarm", z.alarmi), [], "nov lažni alarm");
    assert.ok((r.stevci.ujeta_napaka || 0) >= z.ujete, `ujetih napak ${r.stevci.ujeta_napaka} < ${z.ujete}`);
    assert.ok((r.stevci.potrjena || 0) >= z.potrjena, `potrjenih ${r.stevci.potrjena} < ${z.potrjena}`);
  });
}
