// Cene, pravice in poraba AI po stopnjah (j 2026-11-01, »Predlog cenika«, PR 1 + PR 2).
import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { mountAccounts } from "../server/accounts/index.js";
import {
  PLANS,
  LEGACY_PLANS,
  PASSES,
  FAKS_PASSES,
  GIFT_PRICES,
  SCHOOL_PLANS,
  REGIONAL_PRICES,
  planFor,
  planByKey,
  passByDays,
  passByKey,
  guaranteeUsd,
  explanationsFor,
  allowanceStage,
  storeAmount,
  freeStudentMonthlyUsd,
  freeMonthlyPoolUsd,
  accessFor,
  monthlyOf,
  passLevel,
} from "../server/accounts/plans.js";
import { STORE_PRICES_EUR, STORE_PRODUCTS } from "../server/mobile/store-billing.js";
import { rights, lessonInteractive } from "../server/placila/pravice.js";
import { oneOffer } from "../server/placila/ponudbe.js";
import { Usage } from "../server/usage.js";
import { targetPlan, firstRenewalAfter } from "../server/accounts/billing.js";
import { buildWeeklyReport } from "../server/accounts/weekly.js";
import { levelAdvice } from "../server/advice.js";
import { listPaths, listPrograms, listProgramPaths, getPath } from "../server/curriculum.js";
import { costUsd, modeParams } from "../server/claude.js";

const YEAR = new Date().getFullYear();
const ADULT = "1985-04-12";
const day = 86400000;
const iso = (d) => new Date(Date.now() + d * day).toISOString();
const firstTopic = (key) => getPath(key).units[0].topics[0].id;
const TOPIC = {
  OS: firstTopic(listPaths("MAT").find((p) => p.school === "OS").key),
  SS: firstTopic(listPaths("MAT").find((p) => p.school === "SS").key),
  FAKS: firstTopic(listProgramPaths(listPrograms()[0].id)[0].key),
};
const SETTINGS = {
  OS: { educational_track: "OSNOVNA_SOLA", curriculum_level: "8. razred" },
  SS: { educational_track: "SREDNJA_SOLA", curriculum_level: "2. letnik VR" },
  FAKS: { educational_track: "UNIVERZA", curriculum_level: "1. letnik", study_program: listPrograms()[0].id },
};

test("cene po stopnjah: OŠ 9,99/89, SŠ 12,99/119, faks 16,99/149, Družina 17,99/159, s študentom 24,99/219", () => {
  const by = Object.fromEntries(PLANS.map((p) => [p.key, [p.amount, p.seats, p.level, !!p.family]]));
  assert.deepEqual(by, {
    evklid_1_month: [999, 1, "OS", false],
    evklid_1_year: [8900, 1, "OS", false],
    evklid_ss_month: [1299, 1, "SS", false],
    evklid_ss_year: [11900, 1, "SS", false],
    evklid_faks_month: [1699, 1, "FAKS", false],
    evklid_faks_year: [14900, 1, "FAKS", false],
    evklid_druzina_month: [1799, 4, "SS", true],
    evklid_druzina_year: [15900, 4, "SS", true],
    evklid_druzina_student_month: [2499, 4, "FAKS", true],
    evklid_druzina_student_year: [21900, 4, "FAKS", true],
  });
  // OŠ obdrži stari ključ: obstoječe naročnine ostanejo pri isti ceni v Stripu. Stari »2 otroka« ostane prepoznan.
  assert.equal(planByKey("evklid_1_month").amount, 999);
  assert.deepEqual(LEGACY_PLANS.map((p) => [p.key, p.amount, p.seats]), [["evklid_2_month", 1599, 2], ["evklid_2_year", 13900, 2]]);
  assert.equal(planByKey("evklid_2_year").legacy, true);
  assert.equal(monthlyOf(planByKey("evklid_2_year")).amount, 1599, "dobropis pri priporočilu po mesečni ceni svojega paketa");
  // Nakup: 1 profil po stopnji, več profilov Družina (s študentom, če je stopnja faks).
  assert.equal(planFor(1, "month", "EUR", "SS").key, "evklid_ss_month");
  assert.equal(planFor(1, "year", "EUR", "FAKS").key, "evklid_faks_year");
  assert.equal(planFor(2, "month", "EUR", "SS").key, "evklid_druzina_month");
  assert.equal(planFor(3, "year", "EUR", "FAKS").key, "evklid_druzina_student_year");
  // Nespremenjeno: regijske cene (ena cena za vse stopnje), Osebno ob šolski licenci, paketi OŠ/SŠ, brezplačno 0,2 $.
  assert.deepEqual(REGIONAL_PRICES.INR.prices, [399, 3499, 649, 5599]);
  assert.equal(planFor(1, "month", "INR").level, null);
  assert.equal(planFor(2, "year", "INR").seats, 2);
  assert.deepEqual(SCHOOL_PLANS.map((p) => p.amount), [599, 4900]);
  assert.deepEqual(PASSES.map((p) => [p.days, p.amount, p.aiUsd]), [[7, 519, 0.75], [14, 779, 1.5], [30, 1169, 3]]);
  assert.equal(freeStudentMonthlyUsd(), 0.2);
  assert.equal(freeMonthlyPoolUsd(), 10);
  // Faks paketi pred testom: 6,99 / 9,99 / 14,99 €, meja AI 1,5-krat.
  assert.deepEqual(FAKS_PASSES.map((p) => [p.days, p.amount, p.aiUsd]), [[7, 699, 1.125], [14, 999, 2.25], [30, 1499, 4.5]]);
  assert.equal(passByDays(14, "FAKS").amount, 999);
  assert.equal(passByDays(14, "SS").amount, 779);
  assert.equal(passByKey("evklid_pass_faks_30").level, "FAKS");
  // Darilna koda = letna cena stopnje.
  assert.deepEqual(GIFT_PRICES, { OS: 8900, SS: 11900, FAKS: 14900 });
  // Trgovine z aplikacijami: 2 € dražje kot splet.
  for (const p of PLANS) assert.equal(storeAmount(p), p.amount + 200);
  assert.deepEqual(STORE_PRICES_EUR.month, { 1: 11.99, ss: 14.99, faks: 18.99, druzina: 19.99, druzina_student: 26.99 });
  assert.deepEqual(STORE_PRICES_EUR.year, { 1: 91, ss: 121, faks: 151, druzina: 161, druzina_student: 221 });
  assert.equal(STORE_PRODUCTS.find((p) => p.id.endsWith(".month.2")).legacy, true, "stari izdelek ostane prepoznan");
});

test("pravice: naročnina odpre svojo stopnjo in nižje; prehod navzgor do podaljšanja; Družina zaklene faks", () => {
  const sub = (level, extra = {}) => rights({ personal: { tier: "paid", until: null, level, ...extra }, ownLevel: extra.own || level });
  const os = sub("OS");
  assert.deepEqual(os.levels, ["OS"]);
  assert.ok(lessonInteractive(os, TOPIC.OS));
  assert.ok(!lessonInteractive(os, TOPIC.SS), "SŠ šele z nadgradnjo");
  assert.ok(!lessonInteractive(os, TOPIC.FAKS));
  const ss = sub("SS");
  assert.ok(lessonInteractive(ss, TOPIC.OS) && lessonInteractive(ss, TOPIC.SS) && !lessonInteractive(ss, TOPIC.FAKS));
  const faks = sub("FAKS");
  assert.ok(lessonInteractive(faks, TOPIC.SS) && lessonInteractive(faks, TOPIC.FAKS));
  // Dnevna meja: OŠ in SŠ 60, faks 100 vprašanj.
  assert.equal(os.dailyQuestions, 60);
  assert.equal(ss.dailyQuestions, 60);
  assert.equal(faks.dailyQuestions, 100);
  // Profil za en sedež je prešel v SŠ (paket OŠ): SŠ ostane odprta do podaljšanja (grace).
  const moved = rights({ personal: { tier: "paid", level: "OS", grace: "SS" }, ownLevel: "SS" });
  assert.equal(moved.openLevel, "SS");
  assert.ok(lessonInteractive(moved, TOPIC.SS) && !moved.levelLocked);
  // Družina (OŠ/SŠ) in študent: faks zaklenjen, SŠ in OŠ odprti, meje po SŠ.
  const student = rights({ personal: { tier: "paid", level: "SS" }, ownLevel: "FAKS" });
  assert.ok(student.levelLocked);
  assert.equal(student.useLevel, "SS");
  assert.ok(lessonInteractive(student, TOPIC.SS) && !lessonInteractive(student, TOPIC.FAKS));
  assert.equal(student.dailyQuestions, 60);
  // Brez stopnje (preizkus, koda, regijske cene, stara darila): vse stopnje kot doslej.
  const trial = rights({ personal: { tier: "trial", until: null }, ownLevel: "OS" });
  assert.ok(lessonInteractive(trial, TOPIC.FAKS));
  // Stopnja naročnine iz paketa; staro darilo brez stopnje odpre vse, novo svojo.
  const paid = (key) => accessFor({ sub_status: "active", sub_plan: key });
  assert.equal(paid("evklid_ss_year").level, "SS");
  assert.equal(paid("evklid_1_month_inr").level, null);
  assert.equal(paid(SCHOOL_PLANS[0].key).level, null);
  assert.equal(accessFor({ gift_until: iso(30), gift_level: "FAKS" }).level, "FAKS");
});

test("prehod stopnje: nova cena ob podaljšanju, vsaj 30 dni po e-pošti; Družina navzgor samo z nadgradnjo", () => {
  const p = (key) => ({ ...planByKey(key), currency: "EUR" });
  assert.equal(targetPlan(p("evklid_1_month"), ["SS"]).key, "evklid_ss_month");
  assert.equal(targetPlan(p("evklid_faks_year"), ["OS"]).key, "evklid_1_year", "navzdol ob podaljšanju");
  assert.equal(targetPlan(p("evklid_ss_month"), ["SS"]), null);
  assert.equal(targetPlan(p("evklid_druzina_month"), ["SS", "FAKS"]), null, "faks v Družini do nadgradnje zaklenjen");
  assert.equal(targetPlan(p("evklid_druzina_student_year"), ["SS", "OS"]).key, "evklid_druzina_year");
  assert.equal(targetPlan(p("evklid_2_month"), ["OS", "OS"]).key, "evklid_druzina_month", "stari »2 otroka« preide na Družino");
  assert.equal(targetPlan(p("evklid_2_year"), ["OS", "FAKS"]).key, "evklid_druzina_student_year");
  assert.equal(targetPlan(p(SCHOOL_PLANS[0].key), ["SS"]), null, "šolska cena ostane");
  assert.equal(targetPlan({ ...planByKey("evklid_1_month_inr") }, ["FAKS"]), null, "regijske cene ostanejo");
  // Mesečna naročnina, ki se podaljša čez 10 dni: nova cena šele ob naslednjem podaljšanju (≥ 30 dni).
  const now = Date.parse("2026-11-04T00:00:00Z");
  assert.equal(firstRenewalAfter("2026-11-14T00:00:00.000Z", "month", now + 30 * day), "2026-12-14T00:00:00.000Z");
  assert.equal(firstRenewalAfter("2027-03-01T00:00:00.000Z", "year", now + 30 * day), "2027-03-01T00:00:00.000Z");
  assert.equal(firstRenewalAfter("2026-11-20T00:00:00.000Z", "year", now + 30 * day), "2027-11-20T00:00:00.000Z");
});

function usageSetup() {
  const store = openDb(":memory:");
  const db = store.db;
  const u = new Usage(db);
  const id = (name) => db.prepare("INSERT INTO students (name, settings) VALUES (?, '{}')").run(name).lastInsertRowid;
  const spend = (sid, usd) => db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, 'claude-haiku-5-5', 'chat', ?)").run(sid, usd);
  return { db, u, id, spend };
}

test("poraba AI: zajamčeni deleži naročnikov (2/3/5 $) imajo prednost pred brezplačnimi v proračunu", () => {
  assert.deepEqual(["OS", "SS", "FAKS"].map(guaranteeUsd), [2, 3, 5]);
  const { u, id, spend } = usageSetup();
  const sub = id("Naročnik");
  const free1 = id("Brez 1");
  const free2 = id("Brez 2");
  u.configure({ guaranteeOf: (s) => (s === sub ? 5 : 0), weightOf: () => 1 });
  assert.ok(u.setBudgetBase(20.62)); // cap = 20 $ (3 % rezerve)
  for (const s of [sub, free1, free2]) spend(s, 0.01);
  u.shareCache = null;
  const state = u.budgetState();
  assert.ok(Math.abs(state.cap - 20) < 0.01);
  assert.equal(u.studentBudget(sub, state).allowance, 5, "naročnik dobi svoj zajamčeni delež");
  // Brezplačni si delijo ostanek: (20 − 5) / 2.
  assert.ok(Math.abs(u.studentBudget(free1, state).allowance - 7.5) < 0.01);
  // Naročnik porabi več kot zajamčeno (hitri model): rezervacija raste, brezplačnim ostane manj.
  spend(sub, 7);
  u.shareCache = null;
  assert.ok(Math.abs(u.studentBudget(free1).allowance - (20 - 7.01) / 2) < 0.01);
  // Naročnika proračun nikoli ne ustavi; nad deležem odgovarja hitri model (Haiku).
  assert.equal(u.blockReason(sub), null);
  assert.equal(u.overShare(sub), false);
  assert.ok(u.fastOnly(sub));
  const r = u.route(sub, "deep", { maxTier: "deep" });
  assert.equal(r.mode, "think", "podrobna razlaga v hitrem načinu");
  assert.equal(modeParams(r.mode).model, modeParams("chat").model, "hitri model");
  assert.equal(r.fast, true);
  assert.equal(u.chooseMode(sub, { wantDeep: true }).mode, "think");
  // Brezplačni nad svojim delom čaka do 1. v mesecu (s proračunom).
  spend(free1, 10);
  assert.match(u.blockReason(free1), /svoj del inštruktorja/);
});

test("poraba AI brez proračuna: naročnika ne ustavi mesečna meja 3 $; pod deležem podrobne razlage, nad njim Haiku", () => {
  const { u, id, spend } = usageSetup();
  const sub = id("Študent");
  u.configure({ guaranteeOf: () => 5 });
  assert.equal(u.budget().cap, 0);
  spend(sub, 2);
  assert.equal(u.chooseMode(sub, { wantDeep: true }).mode, "deep", "mehka meja 1 $ za naročnika ne velja");
  spend(sub, 2);
  assert.equal(u.blockReason(sub), null, "nad 3 $ (meja na učenca) naročnik nadaljuje");
  let a = u.allowance(sub);
  assert.equal(a.stage, "low");
  assert.equal(a.percent, 80);
  assert.equal(a.explanations_left, explanationsFor(1));
  spend(sub, 1.5);
  a = u.allowance(sub);
  assert.equal(a.stage, "out");
  assert.equal(a.explanations_left, 0);
  assert.equal(u.chooseMode(sub, { wantDeep: true }).mode, "think");
  assert.equal(u.route(sub, "chat").mode, "chat");
  // Prikaz za starše: brez zneskov, samo odstotek in razlage.
  const m = u.studentMonth(sub);
  assert.equal(m.percent, 100);
  assert.equal(m.fast, true);
  assert.equal(m.hard_reached, false);
  assert.equal(allowanceStage(0.5, 2), "ok");
  assert.equal(allowanceStage(1.6, 2), "low");
  assert.equal(allowanceStage(2, 2), "out");
  assert.equal(allowanceStage(0.04, 0.05), "low", "0,04 / 0,05 je 80 % kljub plavajoči vejici");
});

test("ena ponudba naenkrat: brez naročnine s testom → paket; naročnik nad deležem → dokup; nikoli oboje", () => {
  assert.equal(oneOffer({ subscribed: false, testSoon: true }), "pass");
  assert.equal(oneOffer({ subscribed: false, testSoon: false }), null);
  assert.equal(oneOffer({ subscribed: true, testSoon: true, overShare: false }), null);
  assert.equal(oneOffer({ subscribed: true, testSoon: true, overShare: true }), "topup");
  for (const subscribed of [true, false]) for (const testSoon of [true, false]) for (const overShare of [true, false]) assert.ok(["pass", "topup", null].includes(oneOffer({ subscribed, testSoon, overShare })));
});

test("tedensko poročilo pokaže odstotek porabe; predlog za skrbnika po stopnjah", () => {
  const store = openDb(":memory:");
  const kid = { id: 1, name: "Ana" };
  const r = buildWeeklyReport(store.db, { name: "Mama" }, [kid], { appUrl: "http://x/", unsubscribeUrl: "http://x/u", aiOf: () => ({ guaranteed: true, percent: 45, stage: "ok" }) });
  assert.match(r.html, /Podrobne razlage ta mesec: porabljenih 45 %/);
  assert.match(r.text, /porabljenih 45 %/);
  assert.doesNotMatch(r.html + r.text, /\$|€\s*\d|\d\s*€/, "brez zneskov");
  const none = buildWeeklyReport(store.db, { name: "Mama" }, [kid], { appUrl: "http://x/", unsubscribeUrl: "http://x/u" });
  assert.doesNotMatch(none.text, /porabljenih/);
  const adv = levelAdvice(store.db, []);
  assert.deepEqual(adv.map((l) => [l.level, l.price_eur, l.guarantee_usd]), [["OS", 9.99, 2], ["SS", 12.99, 3], ["FAKS", 16.99, 5]]);
  assert.ok(adv.every((l) => l.worst_profit_eur > 4 && l.status === "keep"), "tudi naročnik, ki porabi ves delež, prinese vsaj 4 €");
});

// --- celoten tok prek HTTP: nakup po stopnji, nadgradnja s proracijo, prehod ob podaljšanju, darilo ---
function fakeStripe() {
  const calls = [];
  const subs = {};
  // failMail: Resend vrne napako; sub.declined: kartica zavrne doplačilo (Stripe vrne pending_update).
  const state = { failMail: false };
  let n = 0;
  const fetchFn = async (url, init = {}) => {
    const body = init.body ? (init.headers["Content-Type"]?.includes("json") ? JSON.parse(init.body) : Object.fromEntries(new URLSearchParams(init.body))) : null;
    const u = new URL(url);
    calls.push({ method: init.method, path: u.pathname, body, host: u.host });
    const ok = (data) => ({ ok: true, status: 200, json: async () => data });
    if (u.host === "api.resend.com") return state.failMail ? { ok: false, status: 500, json: async () => ({ message: "napaka" }) } : ok({ id: "email_" + ++n });
    const p = u.pathname.replace("/v1", "");
    if (p === "/customers") return ok({ id: "cus_" + ++n });
    if (p === "/prices" && init.method === "GET") return ok({ data: [] });
    if (p === "/products") return ok({ id: "prod_1" });
    if (p === "/prices") return ok({ id: "price_" + body.lookup_key });
    if (p === "/checkout/sessions") return ok({ id: "cs_" + ++n, url: "https://checkout.stripe.test/" + n });
    const sub = /^\/subscriptions\/(\w+)$/.exec(p);
    if (sub && init.method === "POST" && body["items[0][price]"]) {
      const s = subs[sub[1]];
      if (s.declined && body.payment_behavior === "pending_if_incomplete") return ok({ ...s, pending_update: { subscription_items: [{ price: body["items[0][price]"] }] } });
      s.items.data[0].price = { lookup_key: body["items[0][price]"].replace(/^price_/, "") };
      return ok(s);
    }
    if (sub) return ok(subs[sub[1]] || {});
    return { ok: false, status: 404, json: async () => ({ error: { message: "ni" } }) };
  };
  return { calls, subs, fetchFn, state };
}

async function withAccounts(fn, opts = {}) {
  const store = openDb(":memory:");
  const stripe = fakeStripe();
  const app = express();
  const api = mountAccounts(app, store, { accounts: true, scheduler: false, stripeKey: "sk_test_x", resendKey: "re_x", fetchFn: stripe.fetchFn, log: { error() {} }, ...opts });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const jar = {};
  const call = async (path, o = {}) => {
    const res = await fetch(base + path, {
      method: o.method || "GET",
      redirect: "manual",
      headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") },
      body: o.body ? JSON.stringify(o.body) : undefined,
    });
    for (const c of res.headers.getSetCookie()) {
      const [kv] = c.split(";");
      jar[kv.slice(0, kv.indexOf("="))] = kv.slice(kv.indexOf("=") + 1);
    }
    return { status: res.status, body: (res.headers.get("content-type") || "").includes("json") ? await res.json() : await res.text() };
  };
  const reg = await call("/api/auth/register", { method: "POST", body: { email: "stars@p.si", password: "geslo1234", accept_privacy: true, birth_date: ADULT } });
  assert.equal(reg.status, 201, JSON.stringify(reg.body));
  const mail = stripe.calls.filter((c) => c.host === "api.resend.com").at(-1);
  await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(mail.body.text)[0]);
  const pid = reg.body.parent.id;
  const db = store.db;
  const kid = (name, level, birthYear = YEAR - 16) => {
    const sid = store.createStudent(name, SETTINGS[level]).id;
    db.prepare("UPDATE students SET parent_id = ?, birth_year = ? WHERE id = ?").run(pid, birthYear, sid);
    return sid;
  };
  const subscribe = (plan, end = iso(20)) => {
    db.prepare("UPDATE parents SET sub_status = 'active', sub_plan = ?, sub_seats = ?, sub_period_end = ?, sub_id = 'sub_a', stripe_customer_id = 'cus_a', trial_ends_at = '2020-01-01T00:00:00Z' WHERE id = ?").run(plan, planByKey(plan).seats, end, pid);
    stripe.subs.sub_a = { id: "sub_a", customer: "cus_a", status: "active", items: { data: [{ id: "si_1", price: { lookup_key: plan }, current_period_end: Math.floor(Date.parse(end) / 1000) }] } };
  };
  try {
    await fn({ store, db, api, call, stripe, pid, kid, subscribe });
  } finally {
    server.close();
  }
}

test("Račun: cena stopnje profila, Družina pri ≥ 2 profilih; nakup po stopnji", async () => {
  await withAccounts(async ({ call, stripe, kid }) => {
    kid("Maks", "FAKS", YEAR - 20);
    let acc = (await call("/api/account")).body;
    assert.equal(acc.plan_level, "FAKS");
    assert.equal(acc.family_ok, false, "Družina samo pri vsaj 2 profilih");
    assert.deepEqual(acc.gift_prices, { OS: 8900, SS: 11900, FAKS: 14900 });
    const co = await call("/api/billing/checkout", { method: "POST", body: { seats: 1, interval: "year", adult: true, withdrawal: true } });
    assert.equal(co.status, 200, JSON.stringify(co.body));
    assert.equal(stripe.calls.find((c) => c.path === "/v1/checkout/sessions").body["line_items[0][price]"], "price_evklid_faks_year");
    // Darilna koda za SŠ: letna cena SŠ.
    const g = await call("/api/billing/gift", { method: "POST", body: { level: "SS", adult: true, withdrawal: true } });
    assert.equal(g.status, 200, JSON.stringify(g.body));
    assert.equal(stripe.calls.filter((c) => c.path === "/v1/checkout/sessions").at(-1).body["line_items[0][price_data][unit_amount]"], "11900");
  });
});

test("nadgradnja: višja stopnja takoj z doplačilom razlike (proracija Stripa), samo v testnem načinu", async () => {
  await withAccounts(async ({ call, stripe, kid, subscribe, api, db, pid }) => {
    const ana = kid("Ana", "OS");
    kid("Bor", "SS");
    subscribe("evklid_1_month");
    let acc = (await call("/api/account")).body;
    assert.equal(acc.family_ok, true);
    assert.deepEqual(acc.upgrade.options.map((o) => o.key), ["evklid_ss_month", "evklid_faks_month"]);
    assert.ok(!api.lessonInteractive(ana, TOPIC.SS), "paket OŠ: SŠ zaprta");
    assert.equal((await call("/api/billing/upgrade", { method: "POST", body: { plan: "evklid_1_year" } })).status, 400);
    const up = await call("/api/billing/upgrade", { method: "POST", body: { plan: "evklid_ss_month" } });
    assert.equal(up.status, 200, JSON.stringify(up.body));
    const post = stripe.calls.find((c) => c.path === "/v1/subscriptions/sub_a" && c.method === "POST");
    assert.equal(post.body.proration_behavior, "always_invoice");
    assert.equal(post.body["items[0][id]"], "si_1");
    assert.equal(post.body["items[0][price]"], "price_evklid_ss_month");
    assert.equal(up.body.parent.subscription.plan, "evklid_ss_month");
    assert.ok(api.lessonInteractive(ana, TOPIC.SS), "SŠ odprta takoj");
    assert.ok(!api.lessonInteractive(ana, TOPIC.FAKS));
    // Družina z dvema profiloma: študent zaklenjen do Družine s študentom.
    db.prepare("UPDATE students SET settings = ? WHERE id = ?").run(JSON.stringify(SETTINGS.FAKS), ana);
    subscribe("evklid_druzina_month");
    acc = (await call("/api/account")).body;
    assert.equal(acc.children.find((c) => c.id === ana).level_locked, true);
    assert.deepEqual(acc.upgrade.options.map((o) => o.key), ["evklid_druzina_student_month"]);
    assert.ok(!api.lessonInteractive(ana, TOPIC.FAKS));
    assert.equal((await call("/api/billing/upgrade", { method: "POST", body: { plan: "evklid_druzina_student_month" } })).status, 200);
    assert.ok(api.lessonInteractive(ana, TOPIC.FAKS));
    assert.equal(db.prepare("SELECT sub_plan FROM parents WHERE id = ?").get(pid).sub_plan, "evklid_druzina_student_month");
  });
  // Živi ključ Stripa: nadgradnja ni na voljo (j še nima s.p.).
  await withAccounts(
    async ({ call, kid, subscribe }) => {
      kid("Ana", "OS");
      subscribe("evklid_1_month");
      assert.equal((await call("/api/billing/upgrade", { method: "POST", body: { plan: "evklid_ss_month" } })).status, 503);
    },
    { stripeKey: "sk_live_x" },
  );
});

test("prehod stopnje: e-pošta z novo ceno 30 dni prej, do takrat stara cena in odprta nova stopnja, nato zamenjava brez proracije", async () => {
  await withAccounts(async ({ db, api, stripe, kid, subscribe, pid, call }) => {
    const ana = kid("Ana", "SS"); // prešla iz OŠ v SŠ, paket je še OŠ
    subscribe("evklid_1_month", iso(10));
    assert.ok(api.lessonInteractive(ana, TOPIC.SS), "do podaljšanja ima novo stopnjo odprto");
    const run = (now = new Date()) => api.billing.billingDaily(now, { force: true });
    const out = await run();
    assert.equal(out.plan_notified, 1);
    const row = db.prepare("SELECT * FROM plan_changes WHERE parent_id = ?").get(pid);
    assert.equal(row.to_key, "evklid_ss_month");
    assert.ok(Date.parse(row.effective_at) - Date.now() >= 30 * day - 1000, "nova cena šele ob podaljšanju čez vsaj 30 dni");
    const mails = () => stripe.calls.filter((c) => c.host === "api.resend.com" && /nova cena/i.test(c.body.subject));
    assert.equal(mails().length, 1);
    assert.match(mails()[0].body.text, /12,99/);
    assert.equal((await run()).plan_notified, 0, "e-pošta samo enkrat");
    assert.equal(stripe.calls.filter((c) => c.path === "/v1/subscriptions/sub_a" && c.method === "POST").length, 0, "do takrat stara cena");
    assert.equal((await call("/api/account")).body.pending_change.plan, "evklid_ss_month");
    // Obdobje se je podaljšalo (stara cena), naslednje podaljšanje je effective_at: 2 dni prej se cena zamenja.
    db.prepare("UPDATE parents SET sub_period_end = ? WHERE id = ?").run(row.effective_at, pid);
    await run(new Date(Date.parse(row.effective_at) - 2 * day));
    const post = stripe.calls.find((c) => c.path === "/v1/subscriptions/sub_a" && c.method === "POST");
    assert.equal(post.body.proration_behavior, "none");
    assert.equal(post.body["items[0][price]"], "price_evklid_ss_month");
    assert.equal(db.prepare("SELECT sub_plan FROM parents WHERE id = ?").get(pid).sub_plan, "evklid_ss_month");
    // Profil ostane isti (napredek ostane), čakajoče spremembe ni več.
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM students WHERE id = ?").get(ana).n, 1);
    await run();
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM plan_changes").get().n, 0);
  });
});

test("obvestila 80 % in 100 % v klepetu; starš otroka pod 15 let dobi e-pošto (enkrat na mejo); brez gumba za nakup", async () => {
  const model = modeParams("chat").model;
  const tokens = Math.round(0.02 / costUsd(model, { input_tokens: 1 })); // vsak odgovor ≈ 0,02 $
  process.env.EVKLID_AI_GUARANTEE_OS_USD = "0.05";
  const store = openDb(":memory:");
  const calls = [];
  const fetchFn = async (url, init = {}) => {
    const u = new URL(url);
    const body = init.body ? (init.headers["Content-Type"]?.includes("json") ? JSON.parse(init.body) : Object.fromEntries(new URLSearchParams(init.body))) : null;
    calls.push({ host: u.host, path: u.pathname, body });
    return { ok: true, status: 200, json: async () => ({ id: "x", data: [] }) };
  };
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    stripeKey: "sk_test_x",
    resendKey: "re_x",
    fetchFn,
    log: { error() {} },
    streamFn: async ({ onText }) => {
      const text = 'Odgovor.\n<<META subject=MAT topic="-" error=0 mode=A flag=none>>';
      onText(text);
      return { text, stopReason: "end_turn", model, usage: { input_tokens: tokens, output_tokens: 0 } };
    },
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const jar = {};
  const call = async (path, o = {}) => {
    const res = await fetch(base + path, { method: o.method || "GET", redirect: "manual", headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") }, body: o.body ? JSON.stringify(o.body) : undefined });
    for (const c of res.headers.getSetCookie()) {
      const [kv] = c.split(";");
      jar[kv.slice(0, kv.indexOf("="))] = kv.slice(kv.indexOf("=") + 1);
    }
    return { status: res.status, body: (res.headers.get("content-type") || "").includes("json") ? await res.json() : await res.text() };
  };
  try {
    const reg = await call("/api/auth/register", { method: "POST", body: { email: "mama@p.si", password: "geslo1234", accept_privacy: true, birth_date: ADULT } });
    await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(calls.filter((c) => c.host === "api.resend.com").at(-1).body.text)[0]);
    const kid = (await call("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 10, consent: true } })).body;
    store.db.prepare("UPDATE parents SET sub_status = 'active', sub_plan = 'evklid_1_month', sub_seats = 1, sub_period_end = ?, sub_id = 'sub_k', trial_ends_at = '2020-01-01T00:00:00Z' WHERE id = ?").run(iso(20), reg.body.parent.id);
    const conv = (await call(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
    let n = 0; // vsako vprašanje drugo, da odgovor ne pride iz predpomnilnika (ta ne stane nič)
    const ask = async () => (await call(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: `Koliko je 2 + ${++n}?` } })).body;
    const events = (sse) => [...String(sse).matchAll(/event: allowance\ndata: (.*)/g)].map((m) => JSON.parse(m[1]));
    const parentMails = () => calls.filter((c) => c.host === "api.resend.com" && /razlag/.test(c.body.subject));
    const settle = () => new Promise((r) => setTimeout(r, 50)); // e-pošta gre po odgovoru (ne zadrži klepeta)
    assert.deepEqual(events(await ask()), [], "40 %: brez obvestila");
    const low = events(await ask());
    assert.equal(low.length, 1);
    assert.equal(low[0].stage, "low");
    assert.equal(low[0].buy, false, "pod 15 let brez poziva k nakupu");
    await settle();
    assert.equal(parentMails().length, 1);
    assert.match(parentMails()[0].body.subject, /80 %/);
    assert.doesNotMatch(parentMails()[0].body.text, /\$/);
    const out = events(await ask());
    assert.equal(out[0].stage, "out");
    assert.equal(out[0].left, 0);
    await settle();
    assert.equal(parentMails().length, 2);
    assert.match(parentMails()[1].body.subject, /porabljene/);
    // Inštruktor nadaljuje (hitri način), brez novih obvestil in e-pošte.
    assert.deepEqual(events(await ask()), []);
    await settle();
    assert.equal(parentMails().length, 2);
    const acc = (await call("/api/account")).body;
    assert.equal(acc.children[0].ai_month.stage, "out");
    assert.equal(acc.children[0].ai_month.explanations_left, 0);
  } finally {
    delete process.env.EVKLID_AI_GUARANTEE_OS_USD;
    server.close();
  }
});

test("ena ponudba: s ponudbo paketa pred testom račun ne ponudi dokupa; naročnik paketa ne dobi", async () => {
  await withAccounts(async ({ call, db, kid, subscribe, api }) => {
    const ana = kid("Ana", "FAKS", YEAR - 20);
    // Test čez 5 dni v Urniku.
    const date = new Date(Date.now() + 5 * day).toISOString().slice(0, 10);
    const { Schedules } = await import("../server/schedule.js");
    const sch = new Schedules(db);
    const cur = sch.get(ana);
    sch.save?.(ana, { ...cur, events: [...(cur.events || []), { id: "t1", name: "Kolokvij", date, kind: "test" }] });
    if (!sch.get(ana).events.some((e) => e.id === "t1")) db.prepare("UPDATE schedules SET data = ? WHERE student_id = ?").run(JSON.stringify({ ...cur, events: [{ id: "t1", name: "Kolokvij", date, kind: "test" }] }), ana);
    db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'").run();
    const offer = (await call(`/api/students/${ana}/pass-offer`)).body;
    assert.ok(offer.offer, JSON.stringify(offer));
    assert.deepEqual(offer.passes.map((p) => p.amount), [699, 999, 1499], "faks paketi");
    assert.equal(api.offerKindFor(ana), "pass");
    assert.deepEqual((await call("/api/billing/credit")).body.packs, [], "dokup se ne ponudi hkrati s paketom");
    subscribe("evklid_faks_month");
    assert.equal((await call(`/api/students/${ana}/pass-offer`)).body.offer, null, "naročnik paketa ne dobi");
    assert.ok((await call("/api/billing/credit")).body.packs.length > 0);
    assert.equal(api.offerKindFor(ana), null, "pod 80 % ni ponudbe");
  });
});

// ---------- pregled 2 (funkcija): popravki denarnih poti ----------

test("paket pred testom, kupljen pred cenami po stopnjah, odpre vse stopnje (študent ne izgubi dostopa)", () => {
  assert.equal(passLevel({ level: null }), null, "stari paket: vse stopnje");
  assert.equal(passLevel({ level: "SS" }), "SS");
  assert.equal(passLevel({ level: "FAKS" }), "FAKS");
  const r = rights({ personal: { tier: "pass", until: iso(5), level: passLevel({ level: null }) }, ownLevel: "FAKS" });
  assert.equal(r.levelLocked, false);
  assert.ok(lessonInteractive(r, TOPIC.FAKS));
  // Nov paket OŠ/SŠ odpre SŠ, ne faksa.
  assert.ok(!lessonInteractive(rights({ personal: { tier: "pass", until: iso(5), level: passLevel({ level: "SS" }) }, ownLevel: "OS" }), TOPIC.FAKS));
  // Manjkajoče število profilov ni tiho en profil.
  assert.equal(planFor(NaN, "month", "EUR", "SS"), null);
  assert.equal(planFor(0, "year"), null);
});

test("nakup: brez števila profilov 400; neznana stopnja darila 400; darilo nižje stopnje ne da brezplačnega preizkusa višjega paketa", async () => {
  await withAccounts(async ({ call, stripe, kid, db, pid }) => {
    kid("Maks", "FAKS", YEAR - 20);
    assert.equal((await call("/api/billing/checkout", { method: "POST", body: { interval: "month", adult: true, withdrawal: true } })).status, 400);
    assert.equal((await call("/api/billing/gift", { method: "POST", body: { level: "faks", adult: true, withdrawal: true } })).status, 400);
    const sessions = () => stripe.calls.filter((c) => c.path === "/v1/checkout/sessions");
    // Darilo OŠ še 200 dni: naročnina faks se plača takoj (brez preizkusa do konca darila).
    db.prepare("UPDATE parents SET gift_until = ?, gift_level = 'OS', trial_ends_at = '2020-01-01T00:00:00Z' WHERE id = ?").run(iso(200), pid);
    assert.equal((await call("/api/billing/checkout", { method: "POST", body: { seats: 1, interval: "month", adult: true, withdrawal: true } })).status, 200);
    assert.equal(sessions().at(-1).body["line_items[0][price]"], "price_evklid_faks_month");
    assert.equal(sessions().at(-1).body["subscription_data[trial_end]"], undefined);
    // Darilo faks (ali staro darilo brez stopnje): preostanek se prenese kot doslej.
    db.prepare("UPDATE parents SET gift_level = 'FAKS' WHERE id = ?").run(pid);
    await call("/api/billing/checkout", { method: "POST", body: { seats: 1, interval: "month", adult: true, withdrawal: true } });
    assert.ok(sessions().at(-1).body["subscription_data[trial_end]"]);
  });
});

test("nadgradnja: zavrnjena kartica pusti stari paket (pending_if_incomplete), višja stopnja ostane zaprta", async () => {
  await withAccounts(async ({ call, stripe, kid, subscribe, api, db, pid }) => {
    const ana = kid("Ana", "OS");
    subscribe("evklid_1_month");
    stripe.subs.sub_a.declined = true;
    const up = await call("/api/billing/upgrade", { method: "POST", body: { plan: "evklid_ss_month" } });
    assert.equal(up.status, 402, JSON.stringify(up.body));
    const post = stripe.calls.find((c) => c.path === "/v1/subscriptions/sub_a" && c.method === "POST");
    assert.equal(post.body.payment_behavior, "pending_if_incomplete");
    assert.equal(post.body.proration_behavior, "always_invoice");
    assert.equal(db.prepare("SELECT sub_plan FROM parents WHERE id = ?").get(pid).sub_plan, "evklid_1_month");
    assert.ok(!api.lessonInteractive(ana, TOPIC.SS));
  });
});

test("prehod navzdol: nižja cena že ob naslednjem podaljšanju; zamujena izvedba se izračuna znova", async () => {
  await withAccounts(async ({ db, api, stripe, kid, subscribe, pid }) => {
    kid("Ana", "SS"); // paket faks, profil zdaj SŠ
    const end = iso(10);
    subscribe("evklid_faks_month", end);
    const run = (now = new Date()) => api.billing.billingDaily(now, { force: true });
    assert.equal((await run()).plan_notified, 1);
    let row = db.prepare("SELECT * FROM plan_changes WHERE parent_id = ?").get(pid);
    assert.equal(row.to_key, "evklid_ss_month");
    assert.equal(row.effective_at, end, "ne šele čez 30 dni: naročnik SŠ ne plača še enega meseca po ceni faksa");
    assert.match(stripe.calls.filter((c) => c.host === "api.resend.com").at(-1).body.text, /cenejša/);
    await run(new Date(Date.parse(end) - 2 * day));
    const post = stripe.calls.find((c) => c.path === "/v1/subscriptions/sub_a" && c.method === "POST");
    assert.equal(post.body["items[0][price]"], "price_evklid_ss_month");
    assert.equal(post.body.proration_behavior, "none");
    // Zamujena izvedba navzgor (strežnik ni tekel pred podaljšanjem): nov rok vsaj 30 dni, ne obtiči.
    db.prepare("DELETE FROM plan_changes").run();
    db.prepare("UPDATE students SET settings = ? WHERE parent_id = ?").run(JSON.stringify(SETTINGS.FAKS), pid);
    subscribe("evklid_ss_month", iso(5));
    db.prepare("INSERT INTO plan_changes (parent_id, sub_id, from_key, to_key, effective_at, notified_at) VALUES (?, 'sub_a', 'evklid_ss_month', 'evklid_faks_month', ?, ?)").run(pid, iso(-25), iso(-60));
    await run();
    row = db.prepare("SELECT * FROM plan_changes WHERE parent_id = ?").get(pid);
    assert.ok(Date.parse(row.effective_at) - Date.now() >= 30 * day - 1000, row.effective_at);
  });
});

test("prehod navzgor: brez poslane e-pošte nova cena ne začne veljati; letni opomnik navede novo ceno", async () => {
  await withAccounts(async ({ db, api, stripe, kid, subscribe, pid }) => {
    kid("Ana", "SS");
    subscribe("evklid_1_year", iso(20));
    const run = (now = new Date()) => api.billing.billingDaily(now, { force: true });
    stripe.state.failMail = true;
    assert.equal((await run()).plan_notified, 0);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM plan_changes").get().n, 0, "brez e-pošte ni spremembe cene");
    stripe.state.failMail = false;
    assert.equal((await run()).plan_notified, 1, "naslednji dan znova");
    const row = db.prepare("SELECT * FROM plan_changes WHERE parent_id = ?").get(pid);
    assert.equal(row.to_key, "evklid_ss_year");
    // Leto pozneje: obdobje se konča ob effective_at, opomnik o obnovitvi 20 dni prej navede 119 €, ne 89 €.
    db.prepare("UPDATE parents SET sub_period_end = ? WHERE id = ?").run(row.effective_at, pid);
    await run(new Date(Date.parse(row.effective_at) - 20 * day));
    const renewal = stripe.calls.filter((c) => c.host === "api.resend.com" && /obnovila/.test(c.body.text)).at(-1);
    assert.match(renewal.body.text, /119,00/);
  });
});

test("povezava za plačilo s starim paketom »2 otroka«: stran in plačilo po današnjem paketu (Družina)", async () => {
  await withAccounts(async ({ db, call, stripe, kid, pid }) => {
    kid("Ana", "OS");
    kid("Bor", "SS");
    const { sha256 } = await import("../server/accounts/auth.js");
    db.prepare("INSERT INTO pay_links (token_hash, parent_id, kind, plan_key, expires_at) VALUES (?, ?, 'sub', 'evklid_2_month', ?)").run(sha256("t".repeat(30)), pid, iso(5));
    const view = (await call(`/api/pay/${"t".repeat(30)}`)).body;
    assert.equal(view.plan.amount, 1799);
    const co = await call(`/api/pay/${"t".repeat(30)}/checkout`, { method: "POST", body: { email: "oce@p.si", adult: true, withdrawal: true } });
    assert.equal(co.status, 200, JSON.stringify(co.body));
    assert.equal(stripe.calls.filter((c) => c.path === "/v1/checkout/sessions").at(-1).body["line_items[0][price]"], "price_evklid_druzina_month");
  });
});

test("gumb za dokup ob porabi samo polnoletnemu profilu, ne dijaku 15–17 na računu staršev", async () => {
  process.env.EVKLID_AI_GUARANTEE_SS_USD = "0.1";
  try {
    await withAccounts(async ({ db, api, kid, subscribe }) => {
      const bor = kid("Bor", "SS", YEAR - 16);
      const mama = kid("Mama", "SS", YEAR - 40);
      subscribe("evklid_druzina_month");
      for (const id of [bor, mama]) db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, 'claude-haiku', 'chat', 0.09)").run(id);
      assert.equal(api.offerKindFor(bor), "topup");
      assert.equal(api.topupButton(bor), false, "16 let: brez gumba");
      assert.equal(api.topupButton(mama), true, "polnoletna: gumb");
    });
  } finally {
    delete process.env.EVKLID_AI_GUARANTEE_SS_USD;
  }
});

test("e-pošta staršu pri 80 %, tudi ko mejo prestopi strošek zunaj odgovora (npr. preverjanje)", async () => {
  const model = modeParams("chat").model;
  const tokens = Math.round(0.02 / costUsd(model, { input_tokens: 1 }));
  process.env.EVKLID_AI_GUARANTEE_OS_USD = "0.5";
  const store = openDb(":memory:");
  const calls = [];
  const fetchFn = async (url, init = {}) => {
    const body = init.body ? (init.headers["Content-Type"]?.includes("json") ? JSON.parse(init.body) : Object.fromEntries(new URLSearchParams(init.body))) : null;
    calls.push({ host: new URL(url).host, body });
    return { ok: true, status: 200, json: async () => ({ id: "x", data: [] }) };
  };
  const streamFn = async ({ onText }) => {
    const text = 'Odgovor.\n<<META subject=MAT topic="-" error=0 mode=A flag=none>>';
    onText(text);
    return { text, stopReason: "end_turn", model, usage: { input_tokens: tokens, output_tokens: 0 } };
  };
  const server = createApp(store, { accounts: true, scheduler: false, stripeKey: "sk_test_x", resendKey: "re_x", fetchFn, log: { error() {} }, streamFn }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const jar = {};
  const call = async (path, o = {}) => {
    const res = await fetch(base + path, { method: o.method || "GET", headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") }, body: o.body ? JSON.stringify(o.body) : undefined });
    for (const c of res.headers.getSetCookie()) jar[c.split(";")[0].split("=")[0]] = c.split(";")[0].slice(c.indexOf("=") + 1);
    return { status: res.status, body: (res.headers.get("content-type") || "").includes("json") ? await res.json() : await res.text() };
  };
  try {
    const reg = await call("/api/auth/register", { method: "POST", body: { email: "oce@p.si", password: "geslo1234", accept_privacy: true, birth_date: ADULT } });
    await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(calls.filter((c) => c.host === "api.resend.com").at(-1).body.text)[0]);
    const kid = (await call("/api/students", { method: "POST", body: { name: "Tim", birth_year: YEAR - 10, consent: true } })).body;
    store.db.prepare("UPDATE parents SET sub_status = 'active', sub_plan = 'evklid_1_month', sub_seats = 1, sub_period_end = ?, sub_id = 'sub_k', trial_ends_at = '2020-01-01T00:00:00Z' WHERE id = ?").run(iso(20), reg.body.parent.id);
    // 80 % porabljenih s preverjanjem odgovorov (ne z odgovorom v klepetu).
    store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, 'claude-haiku', 'verify', 0.4)").run(kid.id);
    const conv = (await call(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
    await call(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: "Koliko je 3 + 4?" } });
    await new Promise((r) => setTimeout(r, 50));
    const mails = calls.filter((c) => c.host === "api.resend.com" && /razlag/.test(c.body.subject));
    assert.equal(mails.length, 1);
    assert.match(mails[0].body.subject, /80 %/);
  } finally {
    delete process.env.EVKLID_AI_GUARANTEE_OS_USD;
    server.close();
  }
});
