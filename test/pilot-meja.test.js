// Meja inštruktorja: član pilota = meja plačanega paketa (brezplačno do konca pilota), lastnik brez meje (j 2026-11-06).
import test from "node:test";
import assert from "node:assert/strict";
import { withAccounts } from "./racuni-pomoc.js";
import { isPilotParent, isOwnerParent, pilotEndMs, PILOT_DO_DEFAULT } from "../server/accounts/pilot-meja.js";
import { guaranteeUsd, subscriptionCeiling, detailedShare, explanationsFor } from "../server/accounts/plans.js";
import { pricingAdvice } from "../server/advice.js";

const DAY = 86400000;
const dayIso = (days) => new Date(Date.now() + days * DAY).toISOString().slice(0, 10);
const verified = { email: "Ana@X.si", email_verified_at: "2026-11-01 10:00:00" };

test("oznaka: samo potrjen e-naslov s seznama, pilot do vključno datuma konca", () => {
  const env = { EVKLID_PILOT_EMAILS: "ana@x.si, b@x.si", EVKLID_ADMIN_EMAILS: "ana@x.si", EVKLID_PILOT_DO: "2026-12-15" };
  const end = pilotEndMs(env);
  assert.equal(new Date(end).toISOString(), "2026-12-15T23:00:00.000Z", "konec dneva po slovenskem času");
  assert.equal(isPilotParent(verified, Date.parse("2026-12-15T22:00:00Z"), env), true);
  assert.equal(isPilotParent(verified, Date.parse("2026-12-16T00:00:00Z"), env), false, "po datumu nazaj na običajno mejo");
  assert.equal(isPilotParent({ ...verified, email_verified_at: null }, Date.parse("2026-11-20T00:00:00Z"), env), false);
  assert.equal(isPilotParent({ ...verified, email: "c@x.si" }, Date.parse("2026-11-20T00:00:00Z"), env), false, "ne-pilot");
  assert.equal(isPilotParent({ ...verified, is_guest: 1 }, Date.parse("2026-11-20T00:00:00Z"), env), false);
  assert.equal(isOwnerParent(verified, env), true);
  assert.equal(isOwnerParent({ ...verified, email_verified_at: null }, env), false, "skrbnik brez potrjenega naslova");
  assert.equal(isOwnerParent({ ...verified, email: "c@x.si", is_admin: 1 }, env), false, "zastavica v bazi ne zadošča");
  assert.equal(new Date(pilotEndMs({})).toISOString().slice(0, 10), PILOT_DO_DEFAULT, "privzeto 2026-12-15");
  assert.equal(pilotEndMs({ EVKLID_PILOT_DO: "nekoč" }), pilotEndMs({}), "napačen datum: privzeti, ne brez konca");
});

// Pošlje n vprašanj v nov pogovor; vrne odgovore (status, koda).
async function ask(call, kidId, n) {
  const conv = (await call(`/api/students/${kidId}/conversations`, { method: "POST" })).body;
  const out = [];
  for (let i = 0; i < n; i++) {
    const r = await call(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: `vprašanje ${i}` } });
    out.push({ status: r.status, code: typeof r.body === "object" ? r.body.code : null });
  }
  return out;
}
const spend = (store, kid, usd) => {
  const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id;
  store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, parent_id) VALUES (?, 'claude-haiku-5-5', 'chat', ?, ?)").run(kid.id, usd, pid);
};
const usageRows = (store, kid) => store.db.prepare("SELECT COUNT(*) AS n FROM usage WHERE student_id = ? AND cost_usd >= 0").get(kid.id).n;

test("lastnik s potrjenim naslovom: inštruktor brez meje (dnevna in mesečna), poraba se še zapiše", async () => {
  await withAccounts({ EVKLID_ADMIN_EMAILS: "meja@x.si", EVKLID_FREE_DAILY_QUESTIONS: "2", EVKLID_OSEBNO_DAILY_QUESTIONS: "2" }, async ({ call, store, kid }) => {
    spend(store, kid, 500); // daleč nad vsako mejo paketa in brezplačnega dela
    const before = usageRows(store, kid);
    const r = await ask(call, kid.id, 4);
    assert.deepEqual(r.map((x) => x.status), [200, 200, 200, 200], JSON.stringify(r));
    assert.ok(usageRows(store, kid) > before, "poraba lastnika je v dnevniku");
    const m = (await call(`/api/students/${kid.id}/usage`)).body;
    assert.equal(m.unlimited, true);
    assert.equal(m.hard_reached, false);
  });
});

test("skrbnik brez potrjenega naslova (ali samo zastavica is_admin): brez izjeme", async () => {
  await withAccounts({ EVKLID_ADMIN_EMAILS: "meja@x.si", EVKLID_FREE_DAILY_QUESTIONS: "2" }, async ({ call, store, kid }) => {
    store.db.prepare("UPDATE parents SET email_verified_at = NULL, is_admin = 1").run();
    const r = await ask(call, kid.id, 3);
    assert.equal(r[2].status, 429, JSON.stringify(r));
  });
  await withAccounts({ EVKLID_ADMIN_EMAILS: "drug@x.si", EVKLID_FREE_DAILY_QUESTIONS: "2" }, async ({ call, store, kid }) => {
    store.db.prepare("UPDATE parents SET is_admin = 1").run();
    const r = await ask(call, kid.id, 3);
    assert.equal(r[2].status, 429, "zastavica v bazi brez e-naslova v EVKLID_ADMIN_EMAILS ne zadošča");
  });
});

const paidCapOf = (level) => subscriptionCeiling(guaranteeUsd(level));

test("pilot pred koncem: meja plačanega paketa (ista vrednost), brez plačila; nad njo ustavljen", async () => {
  await withAccounts({ EVKLID_PILOT_EMAILS: "meja@x.si", EVKLID_PILOT_DO: dayIso(10), EVKLID_FREE_DAILY_QUESTIONS: "2" }, async ({ call, store, kid }) => {
    const m = (await call(`/api/students/${kid.id}/usage`)).body;
    assert.equal(m.guaranteed, true, JSON.stringify(m));
    assert.equal(m.explanations_month, explanationsFor(detailedShare(paidCapOf("OS"))), "meja = meja plačanega paketa stopnje");
    assert.ok(paidCapOf("OS") > 0);
    const r = await ask(call, kid.id, 3);
    assert.deepEqual(r.map((x) => x.status), [200, 200, 200], "dnevna meja paketa, ne brezplačnih 2");
    spend(store, kid, 500);
    const over = await ask(call, kid.id, 1);
    assert.equal(over[0].status, 429, "pilot ima mejo (ni brez meje)");
    assert.equal(store.db.prepare("SELECT sub_status FROM parents").get().sub_status, null, "nič plačila");
  });
});

test("pilot po koncu in ne-pilot: običajna (brezplačna) meja", async () => {
  for (const env of [
    { EVKLID_PILOT_EMAILS: "meja@x.si", EVKLID_PILOT_DO: dayIso(-1) },
    { EVKLID_PILOT_EMAILS: "drug@x.si", EVKLID_PILOT_DO: dayIso(10) },
  ]) {
    await withAccounts({ ...env, EVKLID_FREE_DAILY_QUESTIONS: "2" }, async ({ call, kid }) => {
      const m = (await call(`/api/students/${kid.id}/usage`)).body;
      assert.notEqual(m.guaranteed, true, JSON.stringify(env));
      const r = await ask(call, kid.id, 3);
      assert.equal(r[2].status, 429, JSON.stringify(env));
    });
  }
});

test("pilot: vsi profili računa (j 2026-11-06 17:0x), vsak s svojo mejo; brez potrjenega naslova nič", async () => {
  await withAccounts({ EVKLID_PILOT_EMAILS: "meja@x.si", EVKLID_PILOT_DO: dayIso(10) }, async ({ call, store, kid }) => {
    // Drugi profil iz časa pred pilotom (npr. prej družinski paket): ustvarjanje novih profilov ostane po paketu.
    const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id;
    const second = { id: Number(store.db.prepare("INSERT INTO students (name, settings, parent_id) VALUES ('Eva', ?, ?)").run(store.db.prepare("SELECT settings FROM students WHERE id = ?").get(kid.id).settings, pid).lastInsertRowid) };
    assert.equal((await call(`/api/students/${kid.id}/usage`)).body.guaranteed, true);
    const u2 = await call(`/api/students/${second.id}/usage`);
    assert.equal(u2.body.guaranteed, true, "tudi drugi profil: " + JSON.stringify(u2));
    spend(store, kid, 500);
    assert.equal((await ask(call, kid.id, 1))[0].status, 429, "prvi nad mejo");
    assert.equal((await ask(call, second.id, 1))[0].status, 200, "drugi ima svojo mejo");
    store.db.prepare("UPDATE parents SET email_verified_at = NULL").run();
    assert.notEqual((await call(`/api/students/${kid.id}/usage`)).body.guaranteed, true);
  });
});

test("pilot in lastnik: brez ponudb (paket pred testom, naročnina, dokup)", async () => {
  for (const env of [{ EVKLID_PILOT_EMAILS: "meja@x.si", EVKLID_PILOT_DO: dayIso(10) }, { EVKLID_ADMIN_EMAILS: "meja@x.si" }]) {
    await withAccounts(env, async ({ call, kid }) => {
      const o = (await call(`/api/students/${kid.id}/level-up`)).body.offers;
      assert.equal(o.show, false, JSON.stringify({ env, o }));
    });
  }
  await withAccounts({ EVKLID_PILOT_EMAILS: "drug@x.si" }, async ({ call, kid }) => {
    assert.equal((await call(`/api/students/${kid.id}/level-up`)).body.offers.show, true, "ne-pilot: ponudbe ostanejo");
  });
  {
  }
});

test("datum konca: več kot eno leto naprej → privzeti", () => {
  const now = Date.parse("2026-11-06T12:00:00Z");
  assert.equal(pilotEndMs({ EVKLID_PILOT_DO: "2072-12-15" }, now), pilotEndMs({}, now));
  assert.equal(new Date(pilotEndMs({ EVKLID_PILOT_DO: "2027-01-31" }, now)).toISOString(), "2027-01-31T23:00:00.000Z");
});

test("razvojna povezava za potrditev: nikoli za naslove pilota ali skrbnikov", async () => {
  const { openDb } = await import("../server/db.js");
  const { createApp } = await import("../server/app.js");
  const prev = { a: process.env.EVKLID_PILOT_EMAILS, b: process.env.EVKLID_ADMIN_EMAILS };
  process.env.EVKLID_PILOT_EMAILS = "pilot@x.si";
  process.env.EVKLID_ADMIN_EMAILS = "lastnik@x.si";
  const app = createApp(openDb(":memory:"), { accounts: true, scheduler: false, resendKey: "", log: { error() {} } });
  const server = app.listen(0);
  try {
    const reg = async (email) => {
      const r = await fetch(`http://127.0.0.1:${server.address().port}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" }),
      });
      return { status: r.status, body: await r.json() };
    };
    const other = await reg("drug@x.si");
    assert.equal(other.status, 201, JSON.stringify(other.body));
    assert.ok(other.body.dev_verify_url, "lokalno brez pošte: povezava za običajen naslov");
    for (const e of ["pilot@x.si", "LASTNIK@x.si"]) {
      const r = await reg(e);
      assert.equal(r.status, 201, JSON.stringify(r.body));
      assert.equal(r.body.dev_verify_url, undefined, e);
    }
  } finally {
    server.close();
    for (const [k, v] of [["EVKLID_PILOT_EMAILS", prev.a], ["EVKLID_ADMIN_EMAILS", prev.b]]) v === undefined ? delete process.env[k] : (process.env[k] = v);
  }
});

test("poročilo marže: pilot in lastnik ločeno, ne v povprečju plačnikov", () => {
  const db = { prepare: () => ({ get: () => null, all: () => [] }) };
  const st = (id, usd) => ({ id, calls: 5, cost_usd: usd });
  const sum = { eur_per_usd: 0.9, students: [st(1, 1), st(2, 1), st(3, 40), st(4, 60)] };
  const groupOf = (id) => ({ 3: "pilot", 4: "owner" })[id] || null;
  const a = pricingAdvice(db, sum, { groupOf });
  const b = pricingAdvice(db, { ...sum, students: sum.students.slice(0, 2) });
  assert.equal(a.economy.ai_avg_eur, b.economy.ai_avg_eur, "pilot in lastnik ne spremenita marže plačnikov");
  assert.equal(a.economy.margin_pct, b.economy.margin_pct);
  assert.equal(a.economy.active, 2);
  assert.equal(a.separate.pilot.n, 1);
  assert.equal(a.separate.owner.n, 1);
  assert.equal(a.separate.pilot.month_eur, 36);
  assert.match(a.separate.text, /Pilot/);
  assert.equal(b.separate.text, null);
});

test("lastnik: kredit se ne porabi (chargeCredit kličeta zapis porabe in rezervacija ob zagonu)", async () => {
  const { Usage } = await import("../server/usage.js");
  await withAccounts({}, async ({ store, kid }) => {
    const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id;
    for (const unlimited of [false, true]) {
      const used = [];
      const u = new Usage(store.db);
      u.configure({ credits: { balance: () => 10, usedMonth: () => 0, use: (...a) => used.push(a) }, ownerOf: () => pid, freeOver: () => true, unlimitedOf: () => unlimited });
      u.chargeCredit(kid.id, 0.5);
      assert.equal(used.length, unlimited ? 0 : 1, `unlimited=${unlimited}`);
    }
  });
});

test("pilot: do 4 profili med pilotom; po koncu ostanejo, novih ni nad paketom (j 2026-11-06 18:3x)", async () => {
  const YEAR = new Date().getFullYear();
  const add = (call, name) => call("/api/students", { method: "POST", body: { name, birth_year: YEAR - 12, consent: true } });
  await withAccounts({ EVKLID_PILOT_EMAILS: "meja@x.si", EVKLID_PILOT_DO: dayIso(10) }, async ({ call, store, kid }) => {
    const ids = [kid.id];
    for (const name of ["Eva", "Tim", "Pia"]) {
      const r = await add(call, name);
      assert.equal(r.status, 201, `${name}: ${JSON.stringify(r.body)}`);
      ids.push(r.body.id);
    }
    const fifth = await add(call, "Nik");
    assert.equal(fifth.status, 400, "največ 4 profili");
    assert.equal(fifth.body.seats, true);
    for (const id of ids) assert.equal((await call(`/api/students/${id}/usage`)).body.guaranteed, true, `profil ${id}`);
    // Konec pilota: profili ostanejo, novega ni (brezplačni paket: 1 profil).
    process.env.EVKLID_PILOT_DO = dayIso(-1);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM students").get().n, 4, "nič izbrisano");
    for (const id of ids) assert.equal((await call(`/api/students/${id}`)).status, 200, `profil ${id} ostane`);
    assert.equal((await add(call, "Nik")).status, 400, "po pilotu po paketu");
    assert.notEqual((await call(`/api/students/${ids[1]}/usage`)).body.guaranteed, true, "po pilotu običajna meja");
  });
  await withAccounts({ EVKLID_PILOT_EMAILS: "drug@x.si" }, async ({ call }) => {
    assert.equal((await add(call, "Eva")).status, 400, "ne-pilot: po paketu (1 profil)");
  });
});
