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

test("meja AI licence: 25 % mesečne cene na učenca, EVKLID_SCHOOL_AI_EUR jo nastavi na stalen znesek", () => {
  delete process.env.EVKLID_SCHOOL_AI_EUR;
  assert.equal(schoolAiEurPerStudent("pilot"), (SCHOOL_LICENCE_PRICES.pilot.eur / 12) * 0.25);
  assert.equal(schoolAiEurPerStudent("school"), (SCHOOL_LICENCE_PRICES.school.eur / 12) * 0.25);
  // 30 učencev × 0,25 € / 0,92 € za 1 $ = 8,15 $ na mesec za pilotno šolo.
  assert.equal(defaultAiCapUsd({ seats: 30, plan: "pilot" }), 8.15);
  process.env.EVKLID_SCHOOL_AI_EUR = "0.5";
  try {
    assert.equal(defaultAiCapUsd({ seats: 30, plan: "pilot" }), 16.3);
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

// Neposreden vpis naročila (brez obrazca), za stanje pilotnih mest.
const addOrder = (db, taxId, status = "new", plan = "pilot") =>
  Number(
    db
      .prepare(
        `INSERT INTO school_orders (school_name, address, registration_no, tax_id, contact_name, email, plan, students, price_eur, start_date, consent_text, consent_at, status)
         VALUES ('OŠ Test', 'Ulica 1, 1000 Ljubljana', '5085411', ?, 'Ana', 'ana@sola.si', ?, 50, 12, '2027-09-01', 'x', '2026-11-05', ?)`,
      )
      .run(taxId, plan, status).lastInsertRowid,
  );

test("pilotno naročilo z licenco ne šteje dvakrat, tudi če ni označeno »won«", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: false, scheduler: false, log: { error() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const { db } = store;
    for (let i = 1; i <= 8; i++) addSchool(db, i);
    const a = addOrder(db, "11111111", "offer_sent");
    assert.equal(pilotPlaces(db).free, 1);
    // Skrbnik vpiše licenco iz naročila A, stanja naročila pa (še) ne spremeni.
    const sid = addSchool(db, 9, "school");
    db.prepare("INSERT INTO school_licences (school_id, plan, seats, valid_from, valid_until, order_id) VALUES (?, 'pilot', 30, '2026-01-01', '2099-01-01', ?)").run(sid, a);
    const p = pilotPlaces(db);
    assert.equal(p.licences, 9);
    assert.deepEqual(p.orders, [], "naročilo z licenco ne drži še enega mesta");
    assert.equal(p.free, 1);
    assert.equal(pilotOpenForOrder(db), true);
    assert.equal(pilotOpenForOrder(db, "11111111"), true, "ista šola sme naročiti znova");
    // Druga šola dobi zadnje mesto; potem je polno.
    const post = (taxId) =>
      fetch(`${base}/api/school-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          school: "OŠ Druga", address: "Cesta 2, 2000 Maribor", registrationNo: "5085411", taxId, budgetUser: false,
          contact: "Bor Kos", email: "bor@druga.si", phone: "", plan: "pilot", students: 40, startDate: `${new Date().getUTCFullYear() + 1}-09-01`, note: "", consent: true,
        }),
      });
    assert.equal((await post("22222222")).status, 201);
    assert.equal(pilotPlaces(db).free, 0);
    assert.equal((await post("33333333")).status, 409);
    // »won« pri naročilu z licenco ne spremeni štetja.
    db.prepare("UPDATE school_orders SET status = 'won' WHERE id = ?").run(a);
    assert.equal(pilotPlaces(db).free, 0);
    assert.equal(pilotPlaces(db).licences, 9);
  } finally {
    server.close();
  }
});

test("»lost« pilotno naročilo se znova odpre samo, če je mesto še prosto", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: false, scheduler: false, log: { error() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const put = (id, body) => fetch(`${base}/api/admin/school-orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  try {
    const { db } = store;
    for (let i = 1; i <= 9; i++) addSchool(db, i);
    const lost = addOrder(db, "44444444", "lost");
    const open = addOrder(db, "55555555", "new"); // zasede 10. mesto
    assert.equal(pilotPlaces(db).free, 0);
    for (const status of ["new", "contacted", "offer_sent"]) {
      const r = await put(lost, { status });
      assert.equal(r.status, 409, status);
      assert.equal((await r.json()).pilot_full, true);
    }
    assert.equal(db.prepare("SELECT status FROM school_orders WHERE id = ?").get(lost).status, "lost");
    // Opombo in zaprta stanja lahko skrbnik vedno spremeni.
    assert.equal((await put(lost, { note: "poklicati junija" })).status, 200);
    assert.equal((await put(lost, { status: "won" })).status, 200);
    assert.equal((await put(lost, { status: "lost" })).status, 200);
    // Odprto naročilo med odprtimi stanji: ne zasede novega mesta, zato gre.
    assert.equal((await put(open, { status: "contacted" })).status, 200);
    // Mesto se sprosti → izgubljeno naročilo se lahko znova odpre (in zasede mesto).
    assert.equal((await put(open, { status: "lost" })).status, 200);
    assert.equal((await put(lost, { status: "contacted" })).status, 200);
    assert.equal(pilotPlaces(db).free, 0);
    assert.equal((await put(open, { status: "new" })).status, 409, "zdaj je polno za drugo šolo");
    // Neposredno naročilo (ne pilotno) se odpre brez preverjanja mest.
    const cls = addOrder(db, "66666666", "lost", "class");
    assert.equal((await put(cls, { status: "new" })).status, 200);
  } finally {
    server.close();
  }
});

