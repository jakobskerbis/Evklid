// Točka B3 (pilot, j 14. 11.): anketa s tremi vprašanji 7 dni po prvi uporabi, enkrat, samo z vsaj 2 aktivnima dnevoma,
// nikoli med poukom (Urnik) ali v šolskem času brez Urnika; »Pozneje« za 2 dni, največ dvakrat. Skrbnik vidi samo vsote
// od 3 odgovorov naprej. Zagon: node --test test/anketa-teden.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { migrateAccounts } from "../server/accounts/schema.js";
import { Schedules, nowParts } from "../server/schedule.js";
import { createAnketa, tretjeVprasanje } from "../server/anketa-teden.js";
import { withAccounts } from "./racuni-pomoc.js";

const DAY = 86400000;
// Sobota 21. 11. 2026 ob 18.00 v Ljubljani: ni šolski dan.
const T0 = Date.parse("2026-11-21T17:00:00Z");
const ODG = { pomaga: "zelo", naprej: "da", tretje: "mogoce" };

function baza() {
  const { db } = openDb(":memory:");
  const ucenec = (dniNazaj = []) => {
    const s = db.prepare("INSERT INTO students (name, settings) VALUES ('U', '{}')").run().lastInsertRowid;
    for (const d of dniNazaj) db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, 5, 'task', ?)").run(s, new Date(T0 - d * DAY).toISOString().replace("T", " ").slice(0, 19));
    return s;
  };
  return { db, ucenec };
}

test("B3 kdaj: po 7 dneh od prve uporabe in z vsaj 2 aktivnima dnevoma, ne prej", () => {
  const { db, ucenec } = baza();
  const a = createAnketa(db);
  assert.equal(a.stanje(ucenec([8, 1]), T0).pokazi, true);
  assert.equal(a.stanje(ucenec([7, 0]), T0).pokazi, true, "natanko 7 dni");
  assert.equal(a.stanje(ucenec([6, 1]), T0).pokazi, false, "prva uporaba pred 6 dnevi");
  assert.equal(a.stanje(ucenec([9]), T0).pokazi, false, "samo en aktiven dan");
  assert.equal(a.stanje(ucenec([]), T0).pokazi, false);
  // Točke iz nalog pilota (pilot:…) niso uporaba.
  const p = ucenec([9]);
  db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, 10, 'pilot:scan', datetime('now'))").run(p);
  assert.equal(a.stanje(p, T0).pokazi, false);
});

test("B3 tretje vprašanje: plačilo od 15 let, sicer priporočilo (neznana starost = pod 15)", () => {
  assert.equal(tretjeVprasanje(18), "placal");
  assert.equal(tretjeVprasanje(15), "placal");
  assert.equal(tretjeVprasanje(14), "priporocil");
  assert.equal(tretjeVprasanje(null), "priporocil");
  const { db, ucenec } = baza();
  const s = ucenec([8, 1]);
  assert.equal(createAnketa(db, { accounts: { ageOfStudent: () => 17 } }).stanje(s, T0).vprasanje3, "placal");
  assert.equal(createAnketa(db, { accounts: { ageOfStudent: () => 13 } }).stanje(s, T0).vprasanje3, "priporocil");
  assert.equal(createAnketa(db).stanje(s, T0).vprasanje3, "priporocil");
});

test("B3 pouk: med uro po Urniku in v šolskem času brez Urnika (šolski učenec) ne", () => {
  const { db, ucenec } = baza();
  const s = ucenec([8, 1]);
  const pon = Date.parse("2026-11-23T09:00:00Z"); // ponedeljek 10.00 v Ljubljani
  const n = nowParts(new Date(pon));
  new Schedules(db).save(s, { lessons: [{ day: n.day, start: "08:00", end: "13:00", name: "Matematika" }] }, {});
  const a = createAnketa(db);
  assert.equal(a.stanje(s, pon).pokazi, false, "med poukom");
  assert.equal(a.stanje(s, pon + 6 * 3600000).pokazi, true, "po pouku");
  const sola = ucenec([8, 1]);
  const b = createAnketa(db, { accounts: { schools: { membership: () => ({ inSchool: true }) } } });
  assert.equal(b.stanje(sola, pon).pokazi, false, "šolski čas brez Urnika");
  assert.equal(b.stanje(sola, T0).pokazi, true, "sobota");
  const izklop = createAnketa(db, { accounts: { schools: { membership: () => ({ offersOff: true }) } } });
  assert.equal(izklop.stanje(sola, T0).pokazi, false, "učitelj je izklopil");
});

test("B3 Pozneje: skrije za 2 dni, največ dvakrat; tretjič je anketa zaprta brez odgovora", () => {
  const { db, ucenec } = baza();
  const s = ucenec([10, 1]);
  const a = createAnketa(db);
  assert.equal(a.stanje(s, T0).zadnjic, false);
  a.pozneje(s, T0);
  assert.equal(a.stanje(s, T0 + DAY).pokazi, false);
  assert.equal(a.stanje(s, T0 + 2 * DAY).pokazi, true);
  a.pozneje(s, T0 + 2 * DAY);
  assert.equal(a.stanje(s, T0 + 4 * DAY).pokazi, true);
  assert.equal(a.stanje(s, T0 + 4 * DAY).zadnjic, true, "naslednji »Pozneje« je zadnji");
  a.pozneje(s, T0 + 4 * DAY);
  assert.equal(a.stanje(s, T0 + 30 * DAY).pokazi, false, "zaprta za vedno");
  assert.equal(a.oddaj(s, ODG, T0 + 30 * DAY).status, 409);
});

test("B3 oddaja: vsi trije odgovori iz seznama, enkrat; brez točk XP", () => {
  const { db, ucenec } = baza();
  const s = ucenec([10, 1]);
  const a = createAnketa(db, { accounts: { ageOfStudent: () => 18 } });
  const xp = () => db.prepare("SELECT COUNT(*) AS n FROM xp_events WHERE student_id = ?").get(s).n;
  const prej = xp();
  assert.equal(a.oddaj(s, { pomaga: "zelo", naprej: "da" }, T0).status, 400);
  assert.equal(a.oddaj(s, { ...ODG, pomaga: "constructor" }, T0).status, 400);
  assert.equal(a.oddaj(s, { ...ODG, tretje: ["da"] }, T0).status, 400);
  assert.equal(a.oddaj(s, ODG, T0).status, 200);
  assert.equal(a.oddaj(s, ODG, T0).status, 409, "drugič ne");
  assert.equal(a.stanje(s, T0).pokazi, false);
  assert.equal(xp(), prej);
  const r = db.prepare("SELECT vprasanje3, odgovori, koncano FROM anketa_teden WHERE student_id = ?").get(s);
  assert.deepEqual({ ...r, odgovori: JSON.parse(r.odgovori) }, { vprasanje3: "placal", odgovori: ODG, koncano: "2026-11-21" });
  // Prezgodaj (anketa ni odprta): 409.
  assert.equal(a.oddaj(ucenec([2, 1]), ODG, T0).status, 409);
});

test("B3 poročilo: pod 3 odgovori brez vsot; tretje vprašanje po različicah; skrbnik ni štet", () => {
  const { db, ucenec } = baza();
  migrateAccounts(db);
  const pid = db
    .prepare("INSERT INTO parents (email, password_hash, is_admin, privacy_version, unsubscribe_token, referral_code) VALUES ('j@x.si', 'x', 1, 'v', 'u', 'r')")
    .run().lastInsertRowid;
  const starost = new Map();
  const a = createAnketa(db, { accounts: { ageOfStudent: (id) => starost.get(id) ?? null } });
  const odda = (age, o, admin = false) => {
    const s = ucenec([10, 1]);
    if (admin) db.prepare("UPDATE students SET parent_id = ? WHERE id = ?").run(pid, s);
    starost.set(s, age);
    assert.equal(a.oddaj(s, o, T0).status, 200);
  };
  odda(18, ODG);
  odda(17, { pomaga: "malo", naprej: "mogoce", tretje: "ne" });
  odda(40, ODG, true);
  let r = a.porocilo();
  assert.deepEqual([r.n, r.pomaga, r.placal], [2, null, null], "2 odgovora: brez vsot");
  odda(16, { pomaga: "ne", naprej: "ne", tretje: "da" });
  odda(12, ODG);
  const z = ucenec([10, 1]);
  a.pozneje(z, T0);
  a.pozneje(z, T0 + 2 * DAY);
  a.pozneje(z, T0 + 4 * DAY);
  r = a.porocilo();
  assert.equal(r.n, 4);
  assert.deepEqual(r.pomaga, { zelo: 2, malo: 1, ne: 1 });
  assert.deepEqual(r.naprej, { da: 2, mogoce: 1, ne: 1 });
  assert.deepEqual(r.placal, { da: 1, mogoce: 1, ne: 1 });
  assert.equal(r.priporocil, null, "samo en odgovor pod 15: skrit");
  assert.equal(r.zavrnili, 1);
});

test("B3 poti: stanje, Pozneje, oddaja; tuj profil 404; skrbniško poročilo 403 za starša; izvoz in izbris", async () => {
  await withAccounts({}, async ({ call, kid, store, base, jar }) => {
    const db = store.db;
    for (const d of [9, 1]) db.prepare("INSERT INTO xp_events (student_id, amount, reason, created_at) VALUES (?, 5, 'task', datetime('now', ?))").run(kid.id, `-${d} days`);
    const st = await call(`/api/students/${kid.id}/anketa-teden`);
    assert.equal(st.status, 200);
    assert.equal(typeof st.body.pokazi, "boolean");
    assert.equal(st.body.vprasanje3, "priporocil", "13 let");
    assert.equal((await call(`/api/students/${kid.id}/anketa-teden`, { method: "POST", body: { pomaga: "x" } })).status, 400);
    assert.equal((await call(`/api/students/${kid.id}/anketa-teden`, { method: "POST", body: ODG })).status, 200);
    assert.equal((await call(`/api/students/${kid.id}/anketa-teden`)).body.pokazi, false);
    const tuj = db.prepare("INSERT INTO students (name, settings) VALUES ('Tuj', '{}')").run().lastInsertRowid;
    assert.equal((await call(`/api/students/${tuj}/anketa-teden`)).status, 404);
    assert.equal((await call(`/api/students/${tuj}/anketa-teden/pozneje`, { method: "POST", body: {} })).status, 404);
    const cookie = Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ");
    assert.equal((await fetch(`${base}/api/admin/anketa-teden`, { headers: { cookie, "x-forwarded-for": "203.0.113.5" } })).status, 403);
    const exp = await call("/api/account/export", { method: "POST", body: { password: "geslo1234" } });
    assert.match(JSON.stringify(exp.body), /anketa_teden/);
    assert.equal((await call("/api/account", { method: "DELETE", body: { password: "geslo1234" } })).status, 200);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM anketa_teden").get().n, 0);
  });
});
