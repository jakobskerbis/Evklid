import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { Usage } from "../server/usage.js";
import { paceLevel, budgetMode, periodOf } from "../server/proracun.js";
import { Credits, creditUsdFor, CREDIT_PACKS } from "../server/placila/krediti.js";
import { modeParams, costUsd } from "../server/claude.js";

const day = (d, h = 12) => new Date(Date.UTC(2026, 10, d, h)); // november 2026, 30 dni

test("budget pace: under plan upgrades, ahead of plan saves, at the cap stops", () => {
  assert.equal(paceLevel({ cap: 0, spent: 5 }).level, 1, "brez proračuna kot doslej");
  assert.equal(paceLevel({ cap: 194, spent: 1, now: day(10) }).level, 3);
  assert.equal(paceLevel({ cap: 194, spent: 40, now: day(10) }).level, 2); // načrt ~58 $
  assert.equal(paceLevel({ cap: 194, spent: 60, now: day(10) }).level, 1);
  assert.equal(paceLevel({ cap: 194, spent: 80, now: day(10) }).level, 0);
  assert.equal(paceLevel({ cap: 194, spent: 194, now: day(10) }).level, -1);
  assert.equal(paceLevel({ cap: 194, spent: 186, now: day(30) }).level, 0, "zadnjih 5 % samo hitri model");
  // Prvi dan šteje kot cel dan: en drag odgovor zjutraj ne spusti ravni.
  assert.equal(paceLevel({ cap: 194, spent: 0.5, now: day(1, 1) }).level, 3);
  // Naval: danes že več kot 2× dnevni delež → nadgradnje počakajo do jutri.
  assert.equal(paceLevel({ cap: 194, spent: 20, today: 19, now: day(10) }).level, 1);
  assert.equal(periodOf(day(5)).key, "2026-11");
});

test("budget mode: upgrades respect the plan's strongest model, lite and free never upgrade", () => {
  assert.deepEqual(budgetMode("chat", { level: 3 }), { mode: "deep", boosted: true, saved: false });
  assert.equal(budgetMode("chat", { level: 2 }).mode, "mid");
  assert.equal(budgetMode("think", { level: 3, maxTier: "mid" }).mode, "mid", "koda in šola največ Sonnet");
  assert.equal(budgetMode("chat", { level: 3, maxTier: null }).mode, "chat", "brezplačni paket brez nadgradnje");
  assert.equal(budgetMode("lite", { level: 3 }).mode, "lite");
  assert.equal(budgetMode("chat", { level: 3, lite: true }).mode, "chat");
  assert.equal(budgetMode("chat", { level: 3, overShare: true }).mode, "chat");
  assert.equal(budgetMode("deep", { level: 2 }).mode, "deep", "nikoli slabše od izbranega");
  assert.deepEqual(budgetMode("deep", { level: 0 }), { mode: "think", boosted: false, saved: true });
  assert.equal(budgetMode("chat", { level: 0 }).mode, "chat");
});

function setup() {
  const store = openDb(":memory:");
  const db = store.db;
  db.exec("CREATE TABLE IF NOT EXISTS parents (id INTEGER PRIMARY KEY)");
  const u = new Usage(db);
  const credits = new Credits(db);
  const student = (name, parent) => {
    db.prepare("INSERT OR IGNORE INTO parents (id) VALUES (?)").run(parent);
    return db.prepare("INSERT INTO students (name, settings) VALUES (?, '{}')").run(name).lastInsertRowid;
  };
  return { db, u, credits, student };
}

test("budget is shared by plan weight; over the share the account's bought credit pays", () => {
  const { db, u, credits, student } = setup();
  const paid = student("Plačnik", 1);
  const free = student("Brezplačni", 2);
  const owner = { [paid]: 1, [free]: 2 };
  u.configure({ weightOf: (id) => (id === paid ? 9.99 : 1), ownerOf: (id) => owner[id], credits });
  assert.ok(u.setBudgetBase(100));
  const spend = (id, usd) => db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, 'claude-haiku-5-5', 'chat', ?)").run(id, usd);
  spend(paid, 0.01);
  spend(free, 0.01);
  u.shareCache = null;
  const state = u.budgetState();
  assert.equal(state.cap, 97, "3 % rezerve");
  const a = u.studentBudget(paid, state).allowance;
  const b = u.studentBudget(free, state).allowance;
  assert.ok(Math.abs(a / b - 9.99) < 1e-9, "plačljivi sorazmerno s ceno več");
  assert.ok(Math.abs(a + b - 97) < 1e-9, "delež vseh skupaj je ves proračun");

  // Brezplačni porabi svoj del: inštruktor počaka, ponudi dokup.
  spend(free, b);
  assert.match(u.blockReason(free), /dokupom porabe/);
  assert.equal(u.blockReason(paid), null);
  // Dokup: 10 € → 2,22 $ kredita (25 % plačila brez DDV); s kreditom gre naprej, strošek nad deležem gre iz kredita.
  const pack = CREDIT_PACKS.find((p) => p.id === "k10");
  assert.equal(creditUsdFor(pack.amount), 2.22);
  const id = credits.create(2, pack);
  assert.equal(credits.balance(2), 0, "neplačan nakup ne velja");
  assert.ok(credits.activate(id, "pi_1"));
  assert.ok(!credits.activate(id, "pi_1"), "dvojna potrditev ne pripiše dvakrat");
  assert.equal(credits.balance(2), 2.22);
  assert.equal(u.blockReason(free), null);
  u.log(free, "claude-haiku-5-5", { input_tokens: 1_000_000, output_tokens: 0 }); // 0,10 $
  assert.ok(Math.abs(credits.balance(2) - 2.12) < 1e-6);
  assert.ok(u.budgetState().spent < 0.02 + b + 1e-9, "poraba iz kredita ne šteje v skupni proračun");
  // Vračilo plačila odvzame kredit.
  assert.ok(credits.refund("pi_1"));
  assert.equal(credits.balance(2), 0);
  assert.match(u.blockReason(free), /dokupom porabe/);
});

test("cost uses the model's price also when the API returns a dated model id", () => {
  const u = { input_tokens: 1_000_000 };
  assert.equal(costUsd("claude-haiku-5-5", u), 0.1);
  assert.equal(costUsd("claude-haiku-5-5-20261015", u), 0.1, "ne po ceni Opusa");
  assert.equal(costUsd("claude-sonnet-5-5-20261001", u), 2);
  assert.equal(costUsd("neznan-model", u), 4, "neznan model: najdražja cena (varno)");
});

test("daily question limit scales with the student's remaining share and the days left in the month", () => {
  const { db, u, credits, student } = setup();
  const a = student("Plačnik", 1);
  const b = student("Drugi", 2);
  const owner = { [a]: 1, [b]: 2 };
  u.configure({ weightOf: () => 9.99, ownerOf: (id) => owner[id], credits });
  const spend = (id, usd, when = "datetime('now')") => db.prepare(`INSERT INTO usage (student_id, model, kind, cost_usd, created_at) VALUES (?, 'claude-haiku-5-5', 'chat', ?, ${when})`).run(id, usd);
  assert.equal(u.dailyLimit(a), null, "brez proračuna: stalne meje iz pravic");
  assert.ok(u.setBudgetBase(100)); // meja 97 $, dva enaka učenca → 48,5 $ vsak
  spend(a, 0);
  spend(b, 0);
  u.shareCache = null;
  const state = u.budgetState();
  const allowance = u.studentBudget(a, state).allowance;
  assert.ok(Math.abs(allowance - 48.5) < 1e-9);
  // Delež / dni do konca meseca (vključno z danes) / 0,005 $ na vprašanje, največ 200.
  process.env.EVKLID_DAILY_QUESTIONS_MAX = "0";
  try {
    assert.equal(u.dailyLimit(a, { state, now: day(1, 0) }), Math.floor(48.5 / 30 / 0.005), "prvi dan: 30 dni");
    assert.equal(u.dailyLimit(a, { state, now: day(16, 23) }), Math.floor(48.5 / 15 / 0.005), "ura v dnevu ne šteje");
    assert.equal(u.dailyLimit(a, { state, now: day(30, 18) }), Math.floor(48.5 / 0.005), "zadnji dan: ves ostanek");
    // Nov mesec ima svoje število dni (december 31); porabo šteje SQL od 1. v tekočem mesecu.
    assert.equal(u.dailyLimit(a, { state, now: new Date(Date.UTC(2026, 11, 1, 6)) }), Math.floor(48.5 / 31 / 0.005));
  } finally {
    delete process.env.EVKLID_DAILY_QUESTIONS_MAX;
  }
  assert.equal(u.dailyLimit(a, { state, now: day(10) }), 200, "zgornja meja");
  // Poraba danes ne zmanjša današnje meje (šteje ostanek na začetku dneva).
  const before = u.dailyLimit(a, { state, now: day(29) });
  spend(a, 20);
  assert.equal(u.dailyLimit(a, { state: u.budgetState(), now: day(29) }), before);
  // Skoraj ničen delež (učenec z majhno utežjo ob velikem): 0 vprašanj iz proračuna (spodnja meja je stalna
  // meja paketa v accounts/index.js); nad deležem blockReason ponudi dokup.
  const c = student("Majhen", 3);
  owner[c] = 3;
  u.configure({ weightOf: (id) => (id === c ? 0.0001 : 9.99), ownerOf: (id) => owner[id], credits });
  spend(c, 0.01);
  u.shareCache = null;
  assert.equal(u.dailyLimit(c, { state: u.budgetState(), now: day(29) }), 0);
  assert.match(u.blockReason(c), /dokupom porabe/);
  // Dokupljeni kredit dvigne mejo: 5,74 $ / 2 dni / 0,05 $ na vprašanje; učenčev del kredita (credit) šteje namesto vsega.
  assert.ok(credits.activate(credits.create(3, CREDIT_PACKS.find((p) => p.id === "k10")), "pi_m"));
  process.env.EVKLID_QUESTION_USD = "0.05";
  try {
    assert.equal(u.dailyLimit(c, { state: u.budgetState(), now: day(29) }), Math.floor(2.22 / 2 / 0.05));
    assert.equal(u.dailyLimit(c, { state: u.budgetState(), now: day(29), credit: 2.22 / 2 }), Math.floor(2.22 / 4 / 0.05), "kredit, deljen med dva otroka");
  } finally {
    delete process.env.EVKLID_QUESTION_USD;
  }
  assert.equal(u.blockReason(c), null, "s kreditom naprej");
});

test("admin sets the monthly budget and adds bought credit; the tutor upgrades while under plan", async () => {
  const store = openDb(":memory:");
  const seen = [];
  const streamFn = async ({ messages, mode, onText }) => {
    seen.push({ messages, mode });
    const text = "Odgovor.\n<<META subject=MAT topic=\"ulomki\" error=0 mode=A flag=none done=0>>";
    onText(text);
    return { content: [{ type: "text", text }], text, stopReason: "end_turn", model: modeParams(mode).model, usage: { input_tokens: 100, output_tokens: 50 } };
  };
  const server = createApp(store, { streamFn }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (path, opts = {}) => {
    const res = await fetch(base + path, { method: opts.method || "GET", headers: { "Content-Type": "application/json", ...(opts.headers || {}) }, body: opts.body ? JSON.stringify(opts.body) : undefined });
    return { status: res.status, body: (res.headers.get("content-type") || "").includes("json") ? await res.json() : await res.text() };
  };
  try {
    const s = (await call("/api/students", { method: "POST", body: { name: "Ana" } })).body;
    const c = (await call(`/api/students/${s.id}/conversations`, { method: "POST" })).body;
    await call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: "Koliko je 2 + 3?" } });
    assert.equal(seen.at(-1).mode, "chat", "brez proračuna kot doslej");

    assert.equal((await call("/api/usage/budget", { method: "POST", body: { base_usd: -5 } })).status, 400);
    assert.equal((await call("/api/usage/budget", { method: "POST", body: { base_usd: 200 }, headers: { "X-Forwarded-For": "1.2.3.4" } })).status, 403);
    const r = (await call("/api/usage/budget", { method: "POST", body: { base_usd: 200 } })).body;
    assert.equal(r.budget.total, 200);
    assert.equal((await call("/api/usage/budget", { method: "POST", body: { add_usd: 50 } })).body.budget.total, 250);

    await call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: "Kaj pa 3 + 4?" } });
    assert.equal(seen.at(-1).mode, "deep", "daleč pod načrtom: Opus");
    assert.ok(seen.at(-1).messages.length >= 3, "nadgrajen odgovor ohrani zgodovino pogovora");
    const sum = (await call("/api/usage")).body;
    assert.equal(sum.budget.level, 3);
    assert.ok(sum.by_model.some((m) => m.kind === "boost"));

    // Dnevna meja Opusa dosežena: opomba »hitrejši model« drži, proračun odgovora ne nadgradi.
    process.env.EVKLID_DAILY_DEEP = "1";
    store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, ?, 'chat', 0)").run(s.id, modeParams("deep").model);
    await call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: "Še enkrat.", deep: true } });
    await call(`/api/conversations/${c.id}/messages`, { method: "POST", body: { text: "Še enkrat.", deep: true } });
    assert.equal(seen.at(-1).mode, "think");
  } finally {
    delete process.env.EVKLID_DAILY_DEEP;
    server.close();
  }
});

test("free plan over its own cap with bought credit: the whole cost comes from credit, also without a budget", () => {
  const { u, credits, student } = setup();
  const free = student("Brezplačni", 3);
  let over = false;
  u.configure({ ownerOf: () => 3, credits, freeOver: () => over });
  assert.ok(credits.activate(credits.create(3, CREDIT_PACKS.find((p) => p.id === "k10")), "pi_2"));
  assert.equal(u.budget().cap, 0, "brez proračuna");
  u.log(free, "claude-haiku-5-5", { input_tokens: 1_000_000, output_tokens: 0 }); // 0,10 $, pod mejo
  assert.equal(credits.balance(3), 2.22, "pod mejo brezplačnega paketa kredit ostane");
  over = true;
  u.log(free, "claude-haiku-5-5", { input_tokens: 1_000_000, output_tokens: 0 });
  assert.ok(Math.abs(credits.balance(3) - 2.12) < 1e-6, "nad mejo gre ves strošek iz kredita");
});

test("only the 5 / 10 / 20 € packs can be bought, no custom amount (j 2026-11-04)", async () => {
  const mod = await import("../server/placila/krediti.js");
  assert.deepEqual(mod.CREDIT_PACKS.map((p) => [p.id, p.amount]), [["k5", 500], ["k10", 1000], ["k20", 2000]]);
  assert.equal(mod.packById("custom"), null);
  assert.equal(mod.customPack, undefined);
  // Star nakup s poljubnim zneskom ostane v stanju kredita.
  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(":memory:");
  db.exec("CREATE TABLE parents (id INTEGER PRIMARY KEY); CREATE TABLE students (id INTEGER PRIMARY KEY); INSERT INTO parents (id) VALUES (1);");
  const c = new mod.Credits(db);
  db.prepare("INSERT INTO ai_credit_buys (parent_id, pack, amount, credit_usd, status) VALUES (1, 'custom', 3750, 9.3, 'active')").run();
  assert.equal(c.balance(1), 9.3);
  assert.equal(c.list(1)[0].pack, "custom");
});
