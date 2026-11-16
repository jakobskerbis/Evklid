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

test("pilotno naročilo s licenco ne šteje dvakrat; »lost« naročilo se znova odpre samo, ko je mesto prosto", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: false, scheduler: false, log: { error() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const { db } = store;
  const order = (taxId) =>
    fetch(`${base}/api/school-orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        school: "OŠ Prule", address: "Prule 13, 1000 Ljubljana", registrationNo: "5085411", taxId, budgetUser: true, budgetCode: "61204",
        contact: "Ana Novak", email: "ana.novak@os-prule.si", phone: "", plan: "pilot", students: 120, startDate: `${new Date().getUTCFullYear() + 1}-09-01`, note: "", consent: true,
      }),
    });
  const setStatus = (id, status) => fetch(`${base}/api/admin/school-orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
  try {
    for (let i = 1; i <= 8; i++) addSchool(db, i);
    assert.equal((await order("11111111")).status, 201);
    const oid = db.prepare("SELECT id FROM school_orders WHERE tax_id = '11111111'").get().id;
    assert.equal(pilotPlaces(db).free, 1);
    // Skrbnik vpiše pilotno licenco iz naročila (orderId → school_id), naročilo je še »new«: eno mesto, ne dve.
    const sid = addSchool(db, 9);
    db.prepare("UPDATE school_orders SET school_id = ? WHERE id = ?").run(sid, oid);
    assert.deepEqual(pilotPlaces(db), { max: 10, licences: 9, orders: [], free: 1 });
    // Naročilo brez licence (stari zapis brez school_id) šteje kot doslej.
    assert.equal((await order("22222222")).status, 201);
    assert.equal(pilotPlaces(db).free, 0);
    const lost = db.prepare("SELECT id FROM school_orders WHERE tax_id = '22222222'").get().id;
    assert.equal((await setStatus(lost, "lost")).status, 200);
    assert.equal(pilotPlaces(db).free, 1);
    // Mesto zasede druga šola; »lost« naročila ni mogoče znova odpreti.
    assert.equal((await order("33333333")).status, 201);
    const re = await setStatus(lost, "contacted");
    assert.equal(re.status, 409);
    assert.match((await re.json()).error, /zasedena/);
    assert.equal(db.prepare("SELECT status FROM school_orders WHERE id = ?").get(lost).status, "lost");
    // Zaprto stanje (»won«) ali opomba gre vedno; naročilo šole s pilotno licenco se lahko znova odpre.
    assert.equal((await setStatus(lost, "won")).status, 200);
    assert.equal((await setStatus(oid, "lost")).status, 200);
    assert.equal((await setStatus(oid, "offer_sent")).status, 200, "šola že ima pilotno mesto (licenco)");
    // Ko se mesto sprosti, se »lost« naročilo lahko znova odpre.
    const third = db.prepare("SELECT id FROM school_orders WHERE tax_id = '33333333'").get().id;
    assert.equal((await setStatus(third, "lost")).status, 200);
    assert.equal((await setStatus(lost, "lost")).status, 200);
    assert.equal((await setStatus(lost, "contacted")).status, 200);
  } finally {
    server.close();
  }
});

test("licenca iz pilotnega naročila: zadnje mesto preide z naročila na licenco (orderId), brez 409", async () => {
  process.env.EVKLID_ADMIN_EMAILS = "skrbnik@pilot.si";
  const store = openDb(":memory:");
  const calls = [];
  const fetchFn = async (url, init = {}) => {
    calls.push({ host: new URL(url).host, body: init.body ? JSON.parse(init.body) : null });
    return { ok: true, status: 200, json: async () => ({ id: "x" }) };
  };
  const app = createApp(store, { accounts: true, scheduler: false, stripeKey: "", resendKey: "re_x", fetchFn, log: { error() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const jar = {};
  const call = async (path, opts = {}) => {
    const res = await fetch(base + path, {
      method: opts.method || "GET",
      redirect: "manual",
      headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    for (const c of res.headers.getSetCookie()) {
      const [kv] = c.split(";");
      jar[kv.slice(0, kv.indexOf("="))] = kv.slice(kv.indexOf("=") + 1);
    }
    const type = res.headers.get("content-type") || "";
    return { status: res.status, body: type.includes("json") ? await res.json() : await res.text() };
  };
  const { db } = store;
  try {
    assert.equal((await call("/api/auth/register", { method: "POST", body: { email: "skrbnik@pilot.si", password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" } })).status, 201);
    const mail = calls.filter((c) => c.host === "api.resend.com").at(-1);
    await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(mail.body.text)[0]);
    for (let i = 1; i <= 9; i++) addSchool(db, i);
    const r = await call("/api/school-orders", {
      method: "POST",
      body: {
        school: "OŠ Prule", address: "Prule 13, 1000 Ljubljana", registrationNo: "5085411", taxId: "44444444", budgetUser: true, budgetCode: "61204",
        contact: "Ana Novak", email: "ana.novak@os-prule.si", phone: "", plan: "pilot", students: 30, startDate: `${new Date().getUTCFullYear() + 1}-09-01`, note: "", consent: true,
      },
    });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    const oid = db.prepare("SELECT id FROM school_orders").get().id;
    const sid = Number(db.prepare("INSERT INTO schools (name, invite_code) VALUES ('OŠ Prule', 'PRULE1')").run().lastInsertRowid);
    const lic = (body) => call(`/api/admin/schools/${sid}/licences`, { method: "POST", body: { plan: "pilot", seats: 30, validUntil: "2099-08-31", ...body } });
    // Brez naročila je mest zmanjkalo (9 licenc + 1 odprto naročilo).
    assert.equal((await lic({})).status, 409);
    assert.equal((await lic({ orderId: 99999 })).status, 404);
    const ok = await lic({ orderId: oid });
    assert.equal(ok.status, 201, JSON.stringify(ok.body));
    assert.equal(db.prepare("SELECT school_id FROM school_orders WHERE id = ?").get(oid).school_id, sid);
    assert.deepEqual(pilotPlaces(db), { max: 10, licences: 10, orders: [], free: 0 });
  } finally {
    server.close();
    delete process.env.EVKLID_ADMIN_EMAILS;
  }
});
