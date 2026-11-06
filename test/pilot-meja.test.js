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

test("pilot: samo prvi profil računa; pilot brez potrjenega naslova nič", async () => {
  await withAccounts({ EVKLID_PILOT_EMAILS: "meja@x.si", EVKLID_PILOT_DO: dayIso(10) }, async ({ call, store, kid }) => {
    const second = (await call("/api/students", { method: "POST", body: { name: "Eva", birth_year: new Date().getFullYear() - 12, consent: true } })).body;
    assert.equal((await call(`/api/students/${kid.id}/usage`)).body.guaranteed, true);
    assert.notEqual((await call(`/api/students/${second.id}/usage`)).body.guaranteed, true);
    store.db.prepare("UPDATE parents SET email_verified_at = NULL").run();
    assert.notEqual((await call(`/api/students/${kid.id}/usage`)).body.guaranteed, true);
  });
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
