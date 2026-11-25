// PV-02 (docs/preverjanje.md): referenčni nabor in meritev preverjanja. Glavna metrika je 0 napačno potrjenih
// trditev v vsem, kar vidi učenec. Lažni alarmi se ne smejo povečati čez izmerjeno izhodišče.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { naloziNabor, izmeri, razvrsti } from "../scripts/meri-preverjanje.mjs";
import { casAvailable, casStop } from "../server/cas.js";

const nabor = naloziNabor();
const HAVE = await casAvailable();
after(() => casStop());

// Izhodišče 25. 11. 2026 (docs/preverjanje.md, »Meritev«): znani lažni alarmi, ki čakajo na popravek.
const ZNANI_ALARMI = {
  skener: ["integral-019"],
  "skener-lokalno": ["integral-019", "luknja-001", "luknja-009", "luknja-013"],
};

test("nabor: dovolj trditev, vsaka skupina ima pravilne in napačne", () => {
  assert.ok(nabor.length >= 300, `premalo trditev: ${nabor.length}`);
  assert.equal(new Set(nabor.map((p) => p.id)).size, nabor.length, "id ni enoličen");
  const skupine = new Map();
  for (const p of nabor) {
    assert.equal(typeof p.pravilno, "boolean", p.id);
    assert.ok(p.sol || p.racun, `${p.id}: ni ne rešitve ne ukaza`);
    const s = skupine.get(p.skupina) || { da: 0, ne: 0 };
    s[p.pravilno ? "da" : "ne"]++;
    skupine.set(p.skupina, s);
  }
  for (const [k, s] of skupine) if (k !== "priblizek") assert.ok(s.da && s.ne, `skupina ${k}: ${JSON.stringify(s)}`);
});

test("razvrsti: napačna trditev s potrjenim statusom je napačno potrjena", () => {
  assert.equal(razvrsti({ pravilno: false }, "izracunano"), "napacno_potrjena");
  assert.equal(razvrsti({ pravilno: false }, "dokazano"), "napacno_potrjena");
  assert.equal(razvrsti({ pravilno: false }, "numericno"), "sibkejsi_status");
  assert.equal(razvrsti({ pravilno: true }, "napaka"), "lazni_alarm");
  assert.equal(razvrsti({ pravilno: true, najvec: "numericno" }, "izracunano"), "previsok_status");
  assert.equal(razvrsti({ pravilno: true }, "nepreverjeno"), "nepreverjena");
});

for (const motor of ["skener-lokalno", "skener"]) {
  test(`meritev ${motor}: 0 napačno potrjenih, brez novih lažnih alarmov`, { skip: motor === "skener" && !HAVE && "SymPy ni na voljo" }, async () => {
    const r = (await izmeri(nabor, { motorji: [motor] }))[motor];
    const id = (razred) => r.primeri.filter((v) => v.razred === razred).map((v) => v.id);
    assert.deepEqual(id("napacno_potrjena"), []);
    assert.deepEqual(id("previsok_status"), []);
    const novi = id("lazni_alarm").filter((x) => !ZNANI_ALARMI[motor].includes(x));
    assert.deepEqual(novi, [], "nov lažni alarm");
  });
}
