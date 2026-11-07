// Pregledovalec B, PR #477 (pilot-meja): luknje. Zagon: node --test <ta datoteka> (iz /home/claude/wt-pilot-meja).
import test from "node:test";
import assert from "node:assert/strict";
import { withAccounts } from "./racuni-pomoc.js";
import { pilotEndMs, isOwnerParent } from "../server/accounts/pilot-meja.js";
import { guaranteeUsd, subscriptionCeiling, detailedShare, explanationsFor } from "../server/accounts/plans.js";

const DAY = 86400000;
const dayIso = (d) => new Date(Date.now() + d * DAY).toISOString().slice(0, 10);
const YEAR = new Date().getFullYear();

async function ask(call, kidId, n) {
  const conv = (await call(`/api/students/${kidId}/conversations`, { method: "POST" })).body;
  const out = [];
  for (let i = 0; i < n; i++) {
    const r = await call(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: `v ${i}` } });
    out.push(r.status);
  }
  return out;
}
const spend = (store, kidId, usd) => {
  const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kidId).parent_id;
  store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, parent_id) VALUES (?, 'claude-haiku-5-5', 'chat', ?, ?)").run(kidId, usd, pid);
};

// B1: izbris računa + ponovna registracija z istim pilotnim naslovom = nova polna meja plačanega paketa v istem mesecu.
test("B1 pilot: izbris računa in nov račun z istim e-naslovom ne ponastavi meje", async () => {
  await withAccounts({ EVKLID_PILOT_EMAILS: "meja@x.si", EVKLID_PILOT_DO: dayIso(10) }, async ({ call, store, kid, calls }) => {
    spend(store, kid.id, 500);
    assert.equal((await ask(call, kid.id, 1))[0], 429, "nad mejo");
    const del = await call("/api/account", { method: "DELETE", body: { password: "geslo1234" } });
    assert.equal(del.status, 200, JSON.stringify(del.body));
    const r = await call("/api/auth/register", { method: "POST", body: { email: "meja@x.si", password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" } });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(calls.filter((c) => c.host === "api.resend.com").at(-1).body.text)[0]);
    const kid2 = (await call("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 13, consent: true } })).body;
    store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'").run();
    assert.equal((await ask(call, kid2.id, 1))[0], 429, "isti pilotni e-naslov v istem mesecu: poraba prejšnjega računa bi morala šteti");
  });
});

// B2: pilot sam izbere stopnjo FAKS (nastavitve profila) in dobi mejo FAKS (~2,5 × OŠ); tudi sredi meseca po porabljeni meji OŠ.
test("B2 pilot: menjava stopnje v nastavitvah ne sme odpreti višje meje (odločitev j)", async () => {
  await withAccounts({ EVKLID_PILOT_EMAILS: "meja@x.si", EVKLID_PILOT_DO: dayIso(10) }, async ({ call, store, kid }) => {
    const os = subscriptionCeiling(guaranteeUsd("OS"));
    spend(store, kid.id, os + 0.3); // nad mejo OŠ (meja + brezplačni rep 0,2 $)
    assert.equal((await ask(call, kid.id, 1))[0], 429);
    const put = await call(`/api/students/${kid.id}`, { method: "PUT", body: { settings: { educational_track: "UNIVERZA" } } });
    assert.equal(put.status, 200);
    const m = (await call(`/api/students/${kid.id}/usage`)).body;
    assert.equal(m.explanations_month, explanationsFor(detailedShare(os)), "meja ostane OŠ: " + JSON.stringify(m));
    assert.equal((await ask(call, kid.id, 1))[0], 429, "po menjavi na FAKS ostane ustavljen");
  });
});

// B3: EVKLID_ADMIN_EMAILS z »;« ali presledki: pilot-meja.js ga razbije, accounts/index.js (is_admin) ne.
test("B3 lastnik: isti seznam skrbnikov se razbere enako (meja in skrbniške pravice)", async () => {
  await withAccounts({ EVKLID_ADMIN_EMAILS: "drug@x.si; meja@x.si" }, async ({ call, store }) => {
    const p = store.db.prepare("SELECT * FROM parents").get();
    const unlimited = isOwnerParent(p);
    const admin = !!p.is_admin; // ob potrditvi: isAdminEmail → is_admin = 1
    assert.equal(unlimited, admin, `brez meje=${unlimited}, skrbnik=${admin}`);
  });
});

// B4: poletni datum konca: 23:00 UTC je ob poletnem času že 01:00 naslednjega dne v Ljubljani (pilot traja 1 h dlje).
test("B4 konec pilota po slovenskem času tudi poleti", () => {
  const end = pilotEndMs({ EVKLID_PILOT_DO: "2027-06-30" });
  assert.equal(new Date(end).toISOString(), "2027-06-30T22:00:00.000Z");
});

// B5: neobstoječ datum (31. 11.) se tiho sprejme kot 1. 12.
test("B5 neveljaven datum konca (2026-11-31) ne podaljša/premakne pilota tiho", () => {
  assert.equal(pilotEndMs({ EVKLID_PILOT_DO: "2026-11-31" }), pilotEndMs({}), "neobstoječ dan → privzeti datum (ali napaka ob zagonu)");
});

// B6: poročilo marže: at_hard/at_soft štejeta tudi pilot in lastnika (sum.students), delita pa z active brez njiju.
test("B6 poročilo: lastnik in pilot ne vplivata na at_hard / predlog meje", async () => {
  const { pricingAdvice } = await import("../server/advice.js");
  const db = { prepare: () => ({ get: () => null, all: () => [] }) };
  const st = (id, usd) => ({ id, calls: 5, cost_usd: usd });
  const payers = [1, 2, 3, 4, 5].map((i) => st(i, 0.1));
  const now = new Date(Date.UTC(2026, 10, 28));
  const groupOf = (id) => ({ 6: "owner", 7: "pilot" })[id] || null;
  const a = pricingAdvice(db, { eur_per_usd: 0.9, students: [...payers, st(6, 80), st(7, 5)] }, { now, groupOf });
  const b = pricingAdvice(db, { eur_per_usd: 0.9, students: payers }, { now });
  assert.equal(a.economy.at_hard, b.economy.at_hard, "at_hard");
  assert.equal(a.economy.at_soft, b.economy.at_soft, "at_soft");
  assert.equal(a.limit.status, b.limit.status, `predlog meje: ${a.limit.text}`);
});
