// Pilot (j 2026-11-10, dodatek k #477): zaklep stopnje šele ob prvi porabi AI v mesecu, brez oznake »stopnja
// zaklenjena«, brez nakupa darilne kode in »Podari Evklid«.
import test from "node:test";
import assert from "node:assert/strict";
import { withAccounts } from "./racuni-pomoc.js";
import { guaranteeUsd, subscriptionCeiling, detailedShare, explanationsFor } from "../server/accounts/plans.js";

const DAY = 86400000;
const dayIso = (d) => new Date(Date.now() + d * DAY).toISOString().slice(0, 10);
const ENV = { EVKLID_PILOT_EMAILS: "meja@x.si", EVKLID_PILOT_DO: dayIso(10) };
const expl = (l) => explanationsFor(detailedShare(subscriptionCeiling(guaranteeUsd(l))));
const lockRows = (store) => store.db.prepare("SELECT key, value FROM kv WHERE key LIKE 'pilot\\_stopnja\\_%' ESCAPE '\\'").all();
const setTrack = (call, id, track) => call(`/api/students/${id}`, { method: "PUT", body: { settings: { educational_track: track } } });
async function ask(call, kidId) {
  const conv = (await call(`/api/students/${kidId}/conversations`, { method: "POST" })).body;
  return (await call(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: "v" } })).status;
}

test("zaklep stopnje: ogledi pred prvo porabo AI ne zaklenejo, menjava stopnje še velja", async () => {
  await withAccounts(ENV, async ({ call, store, kid }) => {
    // Ogledi (račun, poraba) pred prvim klicem AI: nič se ne zapiše.
    assert.equal((await call("/api/account")).status, 200);
    assert.equal((await call(`/api/students/${kid.id}/usage`)).body.explanations_month, expl("OS"));
    assert.deepEqual(lockRows(store), [], "brez zaklepa pred prvo porabo AI");
    // Učenec zamenja na FAKS, še preden je uporabil AI: velja meja FAKS.
    assert.equal((await setTrack(call, kid.id, "UNIVERZA")).status, 200);
    assert.equal((await call(`/api/students/${kid.id}/usage`)).body.explanations_month, expl("FAKS"));
    assert.deepEqual(lockRows(store), []);
    // Prvi klic AI zaklene FAKS.
    assert.equal(await ask(call, kid.id), 200);
    const rows = lockRows(store);
    assert.equal(rows.length, 1, JSON.stringify(rows));
    assert.equal(JSON.parse(rows[0].value).level, "FAKS");
  });
});

test("zaklep stopnje: po prvi porabi AI menjava na višjo stopnjo meje ne dvigne", async () => {
  await withAccounts(ENV, async ({ call, store, kid }) => {
    assert.equal(await ask(call, kid.id), 200); // prva poraba na OŠ
    assert.equal(JSON.parse(lockRows(store)[0].value).level, "OS");
    assert.equal((await setTrack(call, kid.id, "UNIVERZA")).status, 200);
    assert.equal((await call(`/api/students/${kid.id}/usage`)).body.explanations_month, expl("OS"), "meja ostane OŠ do naslednjega meseca");
    // Oznaka »stopnja zaklenjena« se v pilotu ne pokaže (zaklep še velja).
    const acc = (await call("/api/account")).body;
    assert.equal(acc.children[0].level, "FAKS");
    assert.equal(acc.children[0].level_locked, false);
  });
});

test("zaklep stopnje: poraba, zapisana brez rezervacije (npr. ob ponovnem zagonu), tudi zaklene", async () => {
  await withAccounts(ENV, async ({ call, store, kid }) => {
    const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id;
    store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, parent_id) VALUES (?, 'rezerva', 'prekinjeno', 0.01, ?)").run(kid.id, pid);
    await setTrack(call, kid.id, "UNIVERZA");
    // Prvi pogled po zapisani porabi zaklene sedanjo stopnjo; naslednja menjava je ne spremeni.
    assert.equal((await call(`/api/students/${kid.id}/usage`)).body.explanations_month, expl("FAKS"));
    assert.equal(JSON.parse(lockRows(store)[0].value).level, "FAKS");
  });
});

test("pilot: brez nakupa darilne kode in »Podari Evklid« (prikaz in strežnik)", async () => {
  await withAccounts(ENV, async ({ call }) => {
    const acc = (await call("/api/account")).body;
    assert.equal(acc.gift_buy, false);
    assert.equal(acc.podari, null);
    const g = await call("/api/billing/gift", { method: "POST", body: { adult: true, withdrawal: true, level: "OS" } });
    assert.equal(g.status, 409, JSON.stringify(g.body));
    const p = await call("/api/billing/podari", { method: "POST", body: { adult: true, understand: true } });
    assert.equal(p.status, 409, JSON.stringify(p.body));
  });
});

test("ne-pilot: darilna koda in »Podari Evklid« ostaneta", async () => {
  await withAccounts({ EVKLID_PILOT_EMAILS: "drug@x.si" }, async ({ call }) => {
    const acc = (await call("/api/account")).body;
    assert.equal(acc.gift_buy, true);
    assert.notEqual(acc.podari, null);
    assert.notEqual((await call("/api/billing/gift", { method: "POST", body: { adult: true, withdrawal: true, level: "OS" } })).status, 409);
    assert.notEqual((await call("/api/billing/podari", { method: "POST", body: { adult: true, understand: true } })).status, 409);
  });
});

test("pilot po koncu: darila spet vidna", async () => {
  await withAccounts({ EVKLID_PILOT_EMAILS: "meja@x.si", EVKLID_PILOT_DO: dayIso(-2) }, async ({ call }) => {
    const acc = (await call("/api/account")).body;
    assert.equal(acc.gift_buy, true);
    assert.notEqual(acc.podari, null);
  });
});
