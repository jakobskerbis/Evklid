// Skriti nabor (26. 11. 2026, 143 trditev, napisan neodvisno od kode): log z osnovo, faktoriele, kombinatorika,
// enačbe, izrazi, neenačbe. Skener sme reči »Napačno« le z dokazom: 0 lažnih alarmov in 0 napačnih potrditev v obeh
// načinih (s SymPy in brez, kot ob izpadu Pythona), brez SymPy ujame vsaj 95 % napak in pri pravilnih največ 5 %
// »Nepreverjeno« (poseg 1 pregleda pripravljenosti pilota).
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { naloziNabor, izmeri } from "../scripts/meri-preverjanje.mjs";
import { casAvailable, casStop } from "../server/cas.js";

const nabor = naloziNabor(fileURLToPath(new URL("./fixtures/preverjanje/nabor-skrit-2026-11-26.json", import.meta.url)));
const HAVE = await casAvailable();
after(() => casStop());

test("skriti nabor: dovolj trditev, pravilne in napačne", () => {
  assert.ok(nabor.length >= 100);
  assert.ok(nabor.filter((p) => !p.pravilno).length >= 50);
  assert.equal(new Set(nabor.map((p) => p.id)).size, nabor.length);
});

for (const motor of ["skener-lokalno", "skener"]) {
  test(`skriti nabor, ${motor}: »Napačno« samo z dokazom`, { skip: motor === "skener" && !HAVE && "SymPy ni na voljo" }, async () => {
    const r = (await izmeri(nabor, { motorji: [motor] }))[motor];
    const id = (razred) => r.primeri.filter((v) => v.razred === razred).map((v) => v.id);
    for (const razred of ["izjema", "napacno_potrjena", "previsok_status", "lazni_alarm"]) assert.deepEqual(id(razred), [], razred);
    const napacnih = nabor.filter((p) => !p.pravilno).length;
    const pravilnih = nabor.length - napacnih;
    assert.ok(id("ujeta_napaka").length >= 0.95 * napacnih, `ujetih ${id("ujeta_napaka").length}/${napacnih}`);
    const nepreverjene = r.primeri.filter((v) => v.pravilno && v.razred === "nepreverjena").length;
    assert.ok(nepreverjene <= 0.05 * pravilnih, `nepreverjenih pravilnih ${nepreverjene}/${pravilnih}`);
  });
}
