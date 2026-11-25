// Točka 37 izboljšav (j 19. 11. 2026, »Da, skrij cene in naročilo«): dokler pravnik ne preveri pravil za UI v šolah,
// /sole ne kaže cen ne obrazca, ampak »kmalu«; POST /api/school-orders vrne 403. EVKLID_SOLE_NAROCILA=1 vse vrne.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { solePage } from "../server/sole.js";
import { SCHOOL_LICENCE_PRICES } from "../server/schools.js";

const eur = (x) => `${x}`.replace(".", ",");

test("solePage: privzeto brez cen in obrazca, z narocila: true kot prej", () => {
  delete process.env.EVKLID_SOLE_NAROCILA;
  const zaprto = solePage();
  assert.match(zaprto, /Šolske licence bodo na voljo/);
  assert.match(zaprto, /href="\/ucitelj.html"/);
  for (const ni of ['id="order-form"', 'id="narocilo"', "Kako poteka plačilo", "Pilotna šola", "na učenca na leto", "UJP", "pilotna cena"])
    assert.ok(!zaprto.includes(ni), `zaprto ne vsebuje »${ni}«`);
  assert.ok(!zaprto.includes(eur(SCHOOL_LICENCE_PRICES.school.eur) + " €") && !/\{\{[\w.]+\}\}|<!--\/?(brez-)?narocil/.test(zaprto), "brez cen, {{…}} in oznak blokov");
  const odprto = solePage({ narocila: true });
  for (const je of ['id="order-form"', 'id="narocilo"', "Kako poteka plačilo", "na učenca na leto"]) assert.ok(odprto.includes(je), je);
  assert.ok(!odprto.includes("Šolske licence bodo na voljo") && !/<!--\/?(brez-)?narocil/.test(odprto));
  process.env.EVKLID_SOLE_NAROCILA = "1";
  assert.ok(solePage().includes('id="order-form"'), "stikalo odpre naročila");
  delete process.env.EVKLID_SOLE_NAROCILA;
});

test("/sole in POST /api/school-orders: zaprto 403, s stikalom spet sprejme", async () => {
  delete process.env.EVKLID_SOLE_NAROCILA;
  const store = openDb(":memory:");
  const server = createApp(store, { scheduler: false, log: { error() {} } }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const post = () => fetch(`${base}/api/school-orders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ school: "" }) });
  try {
    const page = await (await fetch(`${base}/sole`)).text();
    assert.match(page, /Šolske licence bodo na voljo/);
    assert.ok(!page.includes('id="order-form"'));
    const r = await post();
    assert.equal(r.status, 403);
    assert.match((await r.json()).error, /niso odprta/);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM school_orders").get().n, 0);
    process.env.EVKLID_SOLE_NAROCILA = "1";
    assert.ok((await (await fetch(`${base}/sole`)).text()).includes('id="order-form"'), "stran brez predpomnjenja stikala");
    assert.equal((await post()).status, 400, "odprto: do preverjanja polj");
  } finally {
    delete process.env.EVKLID_SOLE_NAROCILA;
    server.close();
  }
});
