// Brezplačni rep naročnika po dnevih (j 2026-11-17): ko so porabljene podrobne razlage in hitri način, profil vsak dan
// do konca obdobja dela kot brezplačni paket (10 vprašanj na dan in današnji del repa 0,2 $ na profil), »jutri spet«,
// brez ustavitve do novega obdobja. Trda meja (meja + ves rep) in tabela 25 % ostaneta enaki.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { openDb } from "../server/db.js";
import { Usage, BLOCK_TEXT } from "../server/usage.js";
import { freeStudentMonthlyUsd } from "../server/accounts/plans.js";
import { callMaxUsd } from "../server/meje-ai.js";
import { MODEL, MAX_TOKENS } from "../server/claude.js";

const DAY = 86_400_000;
const sqlTime = (ms) => new Date(ms).toISOString().slice(0, 19).replace("T", " ");
const midnight = (ms) => {
  const d = new Date(ms);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
};

// Naročnik z mejo ceil (en profil ali skupni delež), obdobje od start do end (ms).
function setup({ ceil = 1.7, profiles = 1, start = Date.now() - 10 * DAY, end = Date.now() + 20 * DAY, credit = 0, topup = false } = {}) {
  const store = openDb(":memory:");
  const db = store.db;
  const u = new Usage(db);
  const ids = Array.from({ length: profiles }, (_, i) => db.prepare("INSERT INTO students (name, settings) VALUES (?, '{}')").run(`P${i}`).lastInsertRowid);
  const box = { credit };
  u.configure({
    guaranteeOf: (s) => (ids.includes(s) ? ceil : 0),
    poolOf: (s) => (profiles > 1 && ids.includes(s) ? ids : null),
    totalOf: (s) => (ids.includes(s) ? ceil + freeStudentMonthlyUsd() * profiles : null),
    periodOf: (s) => (ids.includes(s) ? new Date(start).toISOString() : null),
    periodEndOf: (s) => (ids.includes(s) ? new Date(end).toISOString() : null),
    topupPrompt: () => topup,
    ownerOf: () => 1,
    credits: { balance: () => box.credit, usedMonth: () => 0, usedSince: () => 0, orphanUsedSince: () => 0, use() {} },
  });
  const spend = (sid, usd, at = Date.now()) => db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, created_at) VALUES (?, 'claude-haiku-5-5', 'chat', ?, ?)").run(sid, usd, sqlTime(at));
  return { db, u, ids, spend, box };
}

test("rep po dnevih: današnji del porabljen → »jutri spet«, naslednji dan spet odgovarja, nikoli ustavitev za obdobje", () => {
  const { db, u, ids, spend } = setup();
  const [s] = ids;
  spend(s, 1.7, Date.now() - 3 * DAY); // meja paketa porabljena pred tremi dnevi
  assert.equal(u.overCeiling(s), true);
  const t0 = u.tailToday(s);
  assert.equal(t0.over, false);
  assert.equal(t0.days, 21, "danes in 20 dni do konca obdobja");
  // (0,2 $ − rezerva enega klica) / preostali dnevi
  assert.ok(t0.share > 0.008 && t0.share < 0.0095, String(t0.share));
  assert.equal(u.blockInfo(s), null);
  spend(s, t0.share / 2);
  assert.equal(u.blockInfo(s), null, "pod današnjim delom");
  spend(s, t0.share / 2);
  const b = u.blockInfo(s);
  assert.equal(b.code, "block.tailDay");
  assert.match(b.error, /Jutri jih spet dobiš/);
  assert.equal(u.overFreeTail(s), false, "rep za obdobje še ni porabljen");
  // Naslednji dan: današnja poraba postane včerajšnja, nov dnevni del.
  db.prepare("UPDATE usage SET created_at = ? WHERE created_at >= date('now')").run(sqlTime(midnight(Date.now()) - 3600_000));
  assert.equal(u.blockInfo(s), null, "nov dan, nov del");
  assert.ok(u.tailToday(s).share > 0);
});

test("rep po dnevih: cel mesec vsak dan nekaj vprašanj, skupaj nikoli čez mejo + rep (trda meja 25 % ostane)", () => {
  const start = midnight(Date.now()) - 30 * DAY;
  const end = start + 31 * DAY;
  const { u, ids, spend } = setup({ start, end });
  const [s] = ids;
  spend(s, 1.7, start + 3600_000); // prvi dan obdobja porabi vso mejo paketa
  const q = 0.0007; // vprašanje v hitrem načinu (~0,2 $ / 300 vprašanj), en klic lahko preseže dnevni del
  let total = 1.7;
  for (let k = 0; k < 31; k++) {
    const now = new Date(start + k * DAY + 12 * 3600_000);
    let n = 0;
    while (!u.tailToday(s, undefined, now).over && n < 10) {
      spend(s, q, now.getTime());
      total += q;
      n++;
    }
    assert.ok(n >= 7, `dan ${k + 1}: ${n} vprašanj`);
    assert.ok(total <= 1.7 + freeStudentMonthlyUsd() + 1e-9, `dan ${k + 1}: ${total}`);
    assert.equal(u.overFreeTail(s), false, `dan ${k + 1}: brez ustavitve do novega obdobja`);
  }
});

test("rep po dnevih: ko za preostale dni ni več repa, velja sporočilo konca obdobja (izjema, en klic čez del)", () => {
  const { u, ids, spend } = setup();
  const [s] = ids;
  spend(s, 1.7 + 0.19, Date.now() - 2 * DAY); // rep porabljen do rezerve že pred današnjim dnem
  const t = u.tailToday(s);
  assert.equal(t.over, true);
  assert.equal(t.code, "block.freeTail");
  assert.equal(u.blockInfo(s).code, "block.freeTail");
});

test("rep po dnevih: poziv k dokupu, dokup odpre takoj, brez repa pod mejo paketa", () => {
  const { u, ids, spend, box } = setup({ topup: true });
  const [s] = ids;
  spend(s, 1.6, Date.now() - 2 * DAY);
  assert.equal(u.tailToday(s), null, "pod mejo paketa ni repa");
  spend(s, 0.1, Date.now() - 2 * DAY);
  spend(s, 0.05);
  assert.equal(u.blockInfo(s).code, "block.tailDayTopup");
  assert.match(u.blockInfo(s).error, /sicer jutri/);
  box.credit = 1; // dokupljena poraba
  assert.equal(u.tailToday(s), null);
  assert.equal(u.blockInfo(s), null);
});

test("rep po dnevih: Družina ima skupen rep, dnevni del velja za vsak profil posebej", () => {
  const { u, ids, spend } = setup({ ceil: 2.4, profiles: 2 });
  const [a, b] = ids;
  spend(a, 1.4, Date.now() - 3 * DAY);
  spend(b, 1.0, Date.now() - 3 * DAY); // skupna meja 2,4 $ porabljena
  const ta = u.tailToday(a);
  // Rep 2 × 0,2 $ za oba profila; dnevni del na profil = skupni del / 2.
  assert.ok(Math.abs(ta.share - (0.4 - Math.min(0.1, callMaxUsd(MODEL, 60_000, MAX_TOKENS.chat))) / ta.days / 2) < 1e-6, String(ta.share));
  spend(a, ta.share);
  assert.equal(u.blockInfo(a).code, "block.tailDay", "Ana je porabila svoj današnji del");
  assert.equal(u.blockInfo(b), null, "Bor ima svoj del");
  spend(b, ta.share);
  assert.equal(u.blockInfo(b).code, "block.tailDay");
});

test("rep po dnevih: brezplačni profili in profili brez zajamčenega paketa ostanejo enaki", () => {
  const { u, db } = setup();
  const free = db.prepare("INSERT INTO students (name, settings) VALUES ('Brez', '{}')").run().lastInsertRowid;
  db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, 'claude-haiku-5-5', 'chat', 0.1)").run(free);
  assert.equal(u.tailToday(free), null);
  assert.equal(u.allowance(free).guaranteed, false);
  assert.equal(u.blockInfo(free), null);
});

test("rep po dnevih: števec pokaže »do konca obdobja naročnine vsak dan kot brezplačni paket«", () => {
  const { u, ids, spend } = setup();
  const [s] = ids;
  spend(s, 1.5, Date.now() - 2 * DAY);
  assert.deepEqual([u.allowance(s).stage, u.allowance(s).tail], ["out", false], "hitri način");
  spend(s, 0.2, Date.now() - 2 * DAY);
  assert.deepEqual([u.allowance(s).stage, u.allowance(s).tail], ["out", true], "rep");
});

test("rep po dnevih: besedila v slovenščini in vseh jezikih vmesnika", async () => {
  const { default: sl } = await import("../public/i18n/sl.js");
  for (const k of ["block.tailDay", "block.tailDayTopup", "block.tailDayBirth"]) assert.equal(sl[k], BLOCK_TEXT[k], k);
  const dir = new URL("../public/i18n/ui/", import.meta.url);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  assert.equal(files.length, 32);
  for (const f of files) {
    const j = JSON.parse(fs.readFileSync(new URL(f, dir), "utf8"));
    for (const k of ["ai.then", "ai.tail", "block.tailDay", "block.tailDayTopup", "block.tailDayBirth"]) {
      assert.ok(j[k] && j[k] !== sl[k] && !j[k].includes("{n}"), `${f} ${k}`);
    }
  }
});

test("rep po dnevih: preizkus, koda in bonus (brez plačila) ostanejo kot doslej, brez »jutri spet«", () => {
  const { u, ids, spend } = setup({ ceil: 0.3 });
  const [s] = ids;
  u.configure({ spreadOf: () => false });
  spend(s, 0.3, Date.now() - 2 * DAY);
  spend(s, 0.05);
  assert.equal(u.tailToday(s), null);
  assert.equal(u.blockInfo(s), null, "rep se porablja kot doslej, brez dnevnega dela");
  assert.deepEqual([u.allowance(s).tail, u.allowance(s).spread], [false, false], "brez obvestila »vsak dan kot brezplačni paket«");
  spend(s, 0.15);
  assert.equal(u.blockInfo(s).code, "block.freeTail", "ves rep porabljen: ustavitev kot doslej (accounts: poziv k naročnini)");
});

test("rep po dnevih: razporeditev velja za naročnino, ne za preizkus ali aktivacijsko kodo", async () => {
  const { withAccounts } = await import("./racuni-pomoc.js");
  await withAccounts({}, async ({ store, kid, app }) => {
    const u = app.locals.usage;
    store.db.prepare("UPDATE parents SET trial_ends_at = ?").run(new Date(Date.now() + 5 * DAY).toISOString());
    assert.equal(u.spreadOf(kid.id), false, "preizkus");
    store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z', promo_until = ?").run(new Date(Date.now() + 60 * DAY).toISOString());
    assert.equal(u.spreadOf(kid.id), false, "aktivacijska koda");
    store.db.prepare("UPDATE parents SET promo_until = NULL, sub_status = 'active', sub_seats = 1").run();
    assert.equal(u.spreadOf(kid.id), true, "naročnina");
    assert.equal(u.allowance(kid.id).spread, true);
  });
});

test("rep po dnevih: poraba prejšnjih računov člana pilota ni današnja (ni ustavitve »jutri spet« vsak dan)", () => {
  const { u, ids, spend } = setup();
  const [s] = ids;
  // Prejšnji račun člana pilota je porabil mejo in del repa (priorSpentOf šteje ne glede na dan); danes še nič.
  u.configure({ priorSpentOf: () => 1.75 });
  const t = u.tailToday(s);
  assert.equal(t.spent, 0, "danes ni porabe");
  assert.equal(t.over, false);
  assert.ok(Math.abs(t.share - (0.2 - Math.min(0.05, callMaxUsd(MODEL, 60_000, MAX_TOKENS.chat)) - 0.05) / t.days) < 1e-9, String(t.share));
  assert.equal(u.blockInfo(s), null);
  spend(s, t.share);
  assert.equal(u.blockInfo(s).code, "block.tailDay", "šele današnja poraba porabi današnji del");
});

test("rep po dnevih: ves rep porabljen → števec ne obljublja »vsak dan« (ai.out)", () => {
  const { u, ids, spend } = setup();
  const [s] = ids;
  spend(s, 1.9, Date.now() - 2 * DAY);
  assert.equal(u.overFreeTail(s), true);
  assert.equal(u.allowance(s).tail, false);
});

test("rep po dnevih: obnovitev 31. v mesecu: obdobje traja do 31. 3., ne do 28. 3.", async () => {
  const { withAccounts } = await import("./racuni-pomoc.js");
  await withAccounts({}, async ({ store, kid, app }) => {
    const real = Date.now;
    const now = Date.parse("2027-03-10T12:00:00Z");
    try {
      Date.now = () => now;
      store.db.prepare("UPDATE parents SET sub_status = 'active', sub_seats = 1, sub_period_end = '2027-03-31T08:00:00.000Z'").run();
      const u = app.locals.usage;
      assert.equal(u.periodOf(kid.id), "2027-02-28T08:00:00.000Z", "okno se začne 28. 2.");
      assert.equal(u.periodEndOf(kid.id), "2027-03-31T08:00:00.000Z");
      const days = Math.ceil((Date.parse(u.periodEndOf(kid.id)) - Date.UTC(2027, 2, 10)) / DAY);
      assert.equal(days, 22, "10. 3. do 31. 3. (z današnjim)");
    } finally {
      Date.now = real;
    }
  });
});

test("rep po dnevih: okno zunaj mreže (preklop mesečno ↔ letno) traja do meseca od začetka, ne do novega sidra", async () => {
  const { withAccounts } = await import("./racuni-pomoc.js");
  await withAccounts({}, async ({ store, kid, app }) => {
    const real = Date.now;
    try {
      Date.now = () => Date.parse("2027-11-05T12:00:00Z");
      const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id;
      // Okno 1. 11. – 1. 12. ostane (paidWindow), preklop je sidro premaknil na 10. v mesecu.
      store.db.prepare("UPDATE parents SET sub_status = 'active', sub_seats = 1, sub_id = 'sub_x', sub_period_end = '2028-11-10T08:00:00.000Z'").run();
      store.db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)").run(`ai_window_${pid}`, JSON.stringify({ sub: "sub_x", start: Date.parse("2027-11-01T08:00:00.000Z") }));
      const u = app.locals.usage;
      assert.equal(u.periodOf(kid.id), "2027-11-01T08:00:00.000Z", "staro okno ostane");
      assert.equal(u.periodEndOf(kid.id), "2027-12-01T08:00:00.000Z", "ne 10. 11. (ves rep v enem dnevu)");
    } finally {
      Date.now = real;
    }
  });
});
