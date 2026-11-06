// Šole (j 2026-11-04 »Vse da«): pilotna cena samo za prvih 10 šol in privzeta mesečna meja AI licence.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { pilotOpen, pilotSchoolIds, defaultAiCapUsd, schoolAiEurPerStudent, PILOT_SCHOOLS_MAX, SCHOOL_LICENCE_PRICES } from "../server/schools.js";
import { solePage, pilotPlaces, pilotOpenForOrder } from "../server/sole.js";

const addSchool = (db, n, plan = "pilot") => {
  const id = Number(db.prepare("INSERT INTO schools (name, invite_code) VALUES (?, ?)").run(`Šola ${n}`, `K${n}X${Math.random().toString(36).slice(2, 8)}`).lastInsertRowid);
  db.prepare("INSERT INTO school_licences (school_id, plan, seats, valid_from, valid_until) VALUES (?, ?, 30, '2026-01-01', '2099-01-01')").run(id, plan);
  return id;
};

test("pilotna cena: odprta za prvih 10 šol, pilotna šola lahko podaljša", () => {
  const store = openDb(":memory:");
  createApp(store, { accounts: false, scheduler: false, log: { error() {} } }); // ustvari šolske tabele
  const { db } = store;
  assert.equal(PILOT_SCHOOLS_MAX, 10);
  addSchool(db, 0, "school"); // navadna licenca ne šteje
  const ids = [];
  for (let i = 1; i <= 9; i++) ids.push(addSchool(db, i));
  assert.equal(pilotOpen(db), true);
  ids.push(addSchool(db, 10));
  assert.equal(pilotSchoolIds(db).length, 10);
  assert.equal(pilotOpen(db), false);
  assert.equal(pilotOpen(db, ids[3]), true, "ista pilotna šola dobi novo pilotno licenco");
  // Stran /sole skrije pilotni paket, ko je mest zmanjkalo.
  assert.match(solePage({ pilot: true }), /data-pilot-full="0"/);
  assert.match(solePage({ pilot: false }), /data-pilot-full="1"/);
  assert.match(solePage(), /Samo za prvih 10 šol/);
});

test("meja AI licence: 25 % mesečne cene brez DDV na učenca, EVKLID_SCHOOL_AI_EUR jo nastavi na stalen znesek", () => {
  delete process.env.EVKLID_SCHOOL_AI_EUR;
  assert.equal(schoolAiEurPerStudent("pilot"), (SCHOOL_LICENCE_PRICES.pilot.eur / 1.22 / 12) * 0.25);
  assert.equal(schoolAiEurPerStudent("school"), (SCHOOL_LICENCE_PRICES.school.eur / 1.22 / 12) * 0.25);
  // 30 učencev × 12 € / 1,22 / 12 × 0,25 / 0,92 € za 1 $ = 6,68 $ na mesec za pilotno šolo (navzdol na cent).
  assert.equal(defaultAiCapUsd({ seats: 30, plan: "pilot", price_eur: 12 }), 6.68);
  // Stalen znesek pod 25 % velja; nad 25 % plačila se omeji (trda meja AI, j 2026-11-06).
  process.env.EVKLID_SCHOOL_AI_EUR = "0.2";
  try {
    assert.equal(defaultAiCapUsd({ seats: 30, plan: "pilot", price_eur: 12 }), 6.52);
    process.env.EVKLID_SCHOOL_AI_EUR = "0.5";
    assert.equal(defaultAiCapUsd({ seats: 30, plan: "pilot", price_eur: 12 }), 6.68);
  } finally {
    delete process.env.EVKLID_SCHOOL_AI_EUR;
  }
});

test("naročilo pilotne licence, ko je 10 pilotnih šol: 409, navaden paket gre", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: false, scheduler: false, log: { error() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (let i = 1; i <= 10; i++) addSchool(store.db, i);
    const body = (plan) => ({
      school: "OŠ Prule", address: "Prule 13, 1000 Ljubljana", registrationNo: "5085411", taxId: "SI 12345678", budgetUser: true, budgetCode: "61204",
      contact: "Ana Novak", email: "ana.novak@os-prule.si", phone: "+386 1 234 56 78", plan, students: 120, startDate: `${new Date().getUTCFullYear() + 1}-09-01`, note: "", consent: true,
    });
    const post = (plan) => fetch(`${base}/api/school-orders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body(plan)) });
    const r = await post("pilot");
    assert.equal(r.status, 409);
    assert.match((await r.json()).error, /prvih 10 šol/);
    assert.equal((await post("school")).status, 201);
    const page = await (await fetch(`${base}/sole`)).text();
    assert.match(page, /data-pilot-full="1"/);
  } finally {
    server.close();
  }
});

test("pilotno naročilo zasede mesto: 9 licenc + 1 naročilo = polno; ista šola lahko naroči znova; »lost« mesto sprosti", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: false, scheduler: false, log: { error() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const order = (taxId, plan = "pilot") =>
    fetch(`${base}/api/school-orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        school: "OŠ Prule", address: "Prule 13, 1000 Ljubljana", registrationNo: "5085411", taxId, budgetUser: true, budgetCode: "61204",
        contact: "Ana Novak", email: "ana.novak@os-prule.si", phone: "", plan, students: 120, startDate: `${new Date().getUTCFullYear() + 1}-09-01`, note: "", consent: true,
      }),
    });
  try {
    for (let i = 1; i <= 9; i++) addSchool(store.db, i);
    assert.deepEqual(pilotPlaces(store.db), { max: 10, licences: 9, orders: [], free: 1 });
    const first = await order("SI 12345678");
    assert.equal(first.status, 201);
    assert.equal(pilotPlaces(store.db).free, 0);
    assert.equal(pilotOpenForOrder(store.db), false);
    assert.match(await (await fetch(`${base}/sole`)).text(), /data-pilot-full="1"/);
    const other = await order("87654321");
    assert.equal(other.status, 409);
    assert.match((await other.json()).error, /zasedena/);
    assert.equal((await order("12345678")).status, 201, "ista šola (davčna) ne zasede drugega mesta");
    // Skrbnik naročilo zavrne: mesto je spet prosto.
    const list = await (await fetch(`${base}/api/admin/school-orders`)).json();
    assert.equal(list.pilot.free, 0);
    for (const o of list.orders) {
      const r = await fetch(`${base}/api/admin/school-orders/${o.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "lost" }) });
      assert.equal(r.status, 200);
    }
    assert.equal(pilotPlaces(store.db).free, 1);
    assert.equal((await order("87654321")).status, 201);
  } finally {
    server.close();
  }
});
