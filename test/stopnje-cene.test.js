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
  passCapUsd,
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
  worstProfit,
  guaranteeFromPrice,
  planGuarantee,
  regionalGuaranteeUsd,
  plansFor,
  FAST_TAIL,
  ALL_PLANS,
  subscriptionCeiling,
  giftGuarantee,
  MIN_CEILING_USD,
  EUR_PER_UNIT,
  freeStudentMonthlyUsd,
  freeMonthlyPoolUsd,
  accessFor,
  monthlyOf,
  passLevel,
  upgradeMonthUsd,
  upgradeFromUsd,
} from "../server/accounts/plans.js";
import { STORE_PRICES_EUR, STORE_PRODUCTS } from "../server/mobile/store-billing.js";
import { rights, lessonInteractive } from "../server/placila/pravice.js";
import { oneOffer } from "../server/placila/ponudbe.js";
import { Usage } from "../server/usage.js";
import { freeDailyQuestions as freeDaily } from "../server/accounts/plans.js";
import { targetPlan, firstRenewalAfter } from "../server/accounts/billing.js";
import { buildWeeklyReport } from "../server/accounts/weekly.js";
import { levelAdvice } from "../server/advice.js";
import { listPaths, listPrograms, listProgramPaths, getPath } from "../server/curriculum.js";
import { costUsd, modeParams } from "../server/claude.js";
import { Stripe } from "../server/accounts/stripe.js";
import { creditUsdFor, CREDIT_PACKS, Credits } from "../server/placila/krediti.js";

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

test("cene po stopnjah (75 %): OŠ 9,99/99, SŠ 13,99/139, faks 19,99/199, Družina 18,99/189, s študentom 27,99/269", () => {
  const by = Object.fromEntries(PLANS.map((p) => [p.key, [p.amount, p.seats, p.level, !!p.family]]));
  assert.deepEqual(by, {
    evklid_1_month: [999, 1, "OS", false],
    evklid_1_year: [9900, 1, "OS", false],
    evklid_ss_month: [1399, 1, "SS", false],
    evklid_ss_year: [13900, 1, "SS", false],
    evklid_faks_month: [1999, 1, "FAKS", false],
    evklid_faks_year: [19900, 1, "FAKS", false],
    evklid_druzina_month: [1899, 4, "SS", true],
    evklid_druzina_year: [18900, 4, "SS", true],
    evklid_druzina_student_month: [2799, 4, "FAKS", true],
    evklid_druzina_student_year: [26900, 4, "FAKS", true],
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
  // Nespremenjeno: regijske cene (ena cena za vse stopnje), Osebno ob šolski licenci, brezplačno 0,2 $.
  // Izjema (j 2026-11-04): letni paket za 2 otroka v INR, BDT, IDR malo dražji, da ima zajamčeni AI nad 0.
  assert.deepEqual(REGIONAL_PRICES.INR.prices, [399, 3499, 649, 5699]);
  for (const c of ["INR", "BDT", "IDR"]) assert.ok(planGuarantee(planFor(2, "year", c)).usd > 0, c);
  assert.equal(planFor(1, "month", "INR").level, null);
  assert.equal(planFor(2, "year", "INR").seats, 2);
  assert.deepEqual(SCHOOL_PLANS.map((p) => p.amount), [599, 4900]);
  assert.deepEqual(PASSES.map((p) => [p.days, p.amount, p.aiUsd]), [[7, 549, 0.8], [14, 849, 1.5]]);
  assert.equal(freeStudentMonthlyUsd(), 0.2);
  assert.equal(freeMonthlyPoolUsd(), 10);
  // Faks paketi pred testom: 6,99 / 11,49 € z mejo AI 1,1 / 2,3 $ (30-dnevnega ni več, j 2026-11-04).
  assert.deepEqual(FAKS_PASSES.map((p) => [p.days, p.amount, p.aiUsd]), [[7, 699, 1.1], [14, 1149, 2.3]]);
  assert.equal(passByDays(14, "FAKS").amount, 1149);
  assert.equal(passByDays(14, "SS").amount, 849);
  assert.equal(passByKey("evklid_pass_faks_14").level, "FAKS");
  assert.equal(passByKey("evklid_pass_faks_30"), null);
  assert.equal(passByDays(30, "SS"), null);
  // Darilna koda = letna cena stopnje.
  assert.deepEqual(GIFT_PRICES, { OS: 9900, SS: 13900, FAKS: 19900 });
  // Trgovine z aplikacijami: 2 € dražje kot splet.
  for (const p of PLANS) assert.equal(storeAmount(p), p.amount + 200);
  assert.deepEqual(STORE_PRICES_EUR.month, { 1: 11.99, ss: 15.99, faks: 21.99, druzina: 20.99, druzina_student: 29.99 });
  assert.deepEqual(STORE_PRICES_EUR.year, { 1: 101, ss: 141, faks: 201, druzina: 191, druzina_student: 271 });
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

test("poraba AI: zajamčeni deleži naročnikov imajo prednost pred brezplačnimi v proračunu", () => {
  // Faks in SŠ letno omejeni na 25 % cene brez DDV (trda meja AI, j 2026-11-06).
  assert.deepEqual(["OS", "SS", "FAKS"].map((l) => guaranteeUsd(l)), [1.9, 2.9, 4.452]);
  assert.deepEqual(["OS", "SS", "FAKS"].map((l) => guaranteeUsd(l, "year")), [1.7, 2.58, 3.693]);
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
  // Zajamčenih 5 $ je ves strošek AI paketa (meja): podrobne razlage do 5 / 1,15 $, nato hitri način do 5 $.
  assert.ok(Math.abs(u.studentBudget(sub, state).allowance - 5 / 1.15) < 1e-9, "naročnik dobi svoj zajamčeni delež");
  assert.equal(u.studentBudget(sub, state).ceiling, 5);
  // Brezplačni si delijo ostanek (rezervirana je vsa meja naročnika): (20 − 5) / 2.
  assert.ok(Math.abs(u.studentBudget(free1, state).allowance - 7.5) < 0.01);
  // Naročnik porabi več kot zajamčeno (hitri model): rezervacija raste, brezplačnim ostane manj.
  spend(sub, 5.1); // 5,11 $: nad mejo 5 $, v brezplačnem repu (0,2 $)
  u.shareCache = null;
  assert.ok(Math.abs(u.studentBudget(free1).allowance - (20 - 5.11) / 2) < 0.01);
  // Naročnika skupni proračun ne ustavi; nad deležem odgovarja hitri model (Haiku), nad mejo brezplačni rep.
  assert.equal(u.blockReason(sub), null);
  assert.equal(u.overShare(sub), false);
  assert.ok(u.fastOnly(sub));
  const r = u.route(sub, "deep", { maxTier: "deep" });
  assert.equal(r.mode, "think", "podrobna razlaga v hitrem načinu");
  assert.equal(modeParams(r.mode).model, modeParams("chat").model, "hitri model");
  assert.equal(r.fast, true);
  assert.equal(u.chooseMode(sub, { wantDeep: true }).mode, "think");
  // Brezplačni rep porabljen (meja + 0,2 $ kot brezplačni profil): do novega obdobja paketa ali do dokupa.
  spend(sub, 0.09);
  assert.match(u.blockReason(sub), /V tem obdobju paketa si porabil vsa vprašanja za inštruktorja/);
  // Brezplačni nad svojim delom čaka do 1. v mesecu (s proračunom).
  spend(free1, 10);
  assert.match(u.blockReason(free1), /svoj del inštruktorja/);
});

test("poraba AI brez proračuna: naročnika ne ustavi mesečna meja 3 $; pod deležem podrobne razlage, nad njim Haiku", () => {
  const { u, id, spend } = usageSetup();
  const sub = id("Študent");
  u.configure({ guaranteeOf: () => 5 * 1.15 }); // meja 5,75 $: podrobne razlage do 5 $
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
  assert.deepEqual(adv.map((l) => [l.level, l.price_eur, l.guarantee_usd]), [["OS", 9.99, 1.9], ["SS", 13.99, 2.9], ["FAKS", 19.99, 4.452]]);
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
    if (p === "/billing_portal/configurations") return ok({ id: "bpc_" + ++n });
    if (p === "/billing_portal/sessions") return ok({ id: "bps_" + ++n, url: "https://portal.stripe.test/" + n });
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
    assert.deepEqual(acc.gift_prices, { OS: 9900, SS: 13900, FAKS: 19900 });
    const co = await call("/api/billing/checkout", { method: "POST", body: { seats: 1, interval: "year", adult: true, withdrawal: true } });
    assert.equal(co.status, 200, JSON.stringify(co.body));
    assert.equal(stripe.calls.find((c) => c.path === "/v1/checkout/sessions").body["line_items[0][price]"], "price_evklid_faks_year");
    // Darilna koda za SŠ: letna cena SŠ.
    const g = await call("/api/billing/gift", { method: "POST", body: { level: "SS", adult: true, withdrawal: true } });
    assert.equal(g.status, 200, JSON.stringify(g.body));
    assert.equal(stripe.calls.filter((c) => c.path === "/v1/checkout/sessions").at(-1).body["line_items[0][price_data][unit_amount]"], "13900");
  });
});

test("nadgradnja med mesecem: zajamčeni AI ta mesec po dnevih (stari paket do nadgradnje, novi za preostanek)", async () => {
  // Pure: 30-dnevni mesec, nadgradnja 11. (10 dni starega, 20 dni novega); 1. v mesecu ves novi; prejšnji mesec ali nižji paket: novi.
  const nov = Date.UTC(2026, 10, 15);
  assert.equal(upgradeMonthUsd(1, 4, Date.UTC(2026, 10, 11, 18), nov), 3);
  assert.equal(upgradeMonthUsd(1, 4, Date.UTC(2026, 10, 1, 0, 5), nov), 4);
  assert.equal(upgradeMonthUsd(1, 4, Date.UTC(2026, 9, 31, 23), nov), 4);
  assert.equal(upgradeMonthUsd(4, 1, Date.UTC(2026, 10, 11), nov), 1);
  await withAccounts(async ({ call, kid, subscribe, api, db, pid }) => {
    const ana = kid("Ana", "OS");
    subscribe("evklid_1_month");
    const before = api.guaranteeFor(ana);
    const full = planGuarantee(planByKey("evklid_ss_month")).usd;
    assert.ok(full > before);
    assert.equal((await call("/api/billing/upgrade", { method: "POST", body: { plan: "evklid_ss_month" } })).status, 200);
    const up = JSON.parse(db.prepare("SELECT value FROM kv WHERE key = ?").get(`ai_upgrade_${pid}`).value);
    assert.equal(up.from, "evklid_1_month");
    assert.equal(api.guaranteeFor(ana), upgradeMonthUsd(before, full, up.at));
    assert.ok(api.guaranteeFor(ana) <= full && api.guaranteeFor(ana) >= before);
    // Nadgradnja v prejšnjem mesecu: ta mesec ves novi delež.
    db.prepare("UPDATE kv SET value = ? WHERE key = ?").run(JSON.stringify({ ...up, at: Date.UTC(2000, 0, 15) }), `ai_upgrade_${pid}`);
    assert.equal(api.guaranteeFor(ana), full);
  });
});

test("nadgradnja dvakrat v mesecu: dnevi pred prvo ostanejo pri prvotnem deležu; zapis velja samo za isto naročnino", async () => {
  // Pure: 1 $ do 11., 4 $ do 21., 7 $ do konca (30 dni) = (10 + 40 + 70) / 30 = 4 $, ne (4 · 20 + 7 · 10) / 30.
  const at1 = Date.UTC(2026, 10, 11, 9);
  const at2 = Date.UTC(2026, 10, 21, 9);
  const from2 = upgradeFromUsd({ usd: 1, at: at1 }, 4, at2);
  assert.equal(from2, 2.5);
  assert.equal(upgradeMonthUsd(from2, 7, at2, Date.UTC(2026, 10, 25)), 4);
  assert.equal(upgradeFromUsd({ usd: 4, at: at1 }, 1, at2), 1, "prejšnja zamenjava je bila nižji paket: takoj nižji");
  assert.equal(upgradeFromUsd({ usd: 1, at: Date.UTC(2026, 9, 31) }, 4, at2), 4, "prejšnji mesec: sedanji paket");
  assert.equal(upgradeFromUsd(null, 4, at2), 4);
  assert.equal(upgradeFromUsd({ usd: 1, at: Date.UTC(2026, 10, 1, 3) }, 4, Date.UTC(2026, 10, 1, 9)), 4, "1. v mesecu");
  await withAccounts(async ({ call, kid, subscribe, api, db, pid }) => {
    const ana = kid("Ana", "OS");
    subscribe("evklid_1_month");
    const os = api.guaranteeFor(ana);
    const ss = planGuarantee(planByKey("evklid_ss_month")).usd;
    const faks = planGuarantee(planByKey("evklid_faks_month")).usd;
    const rec = () => JSON.parse(db.prepare("SELECT value FROM kv WHERE key = ?").get(`ai_upgrade_${pid}`).value);
    assert.equal((await call("/api/billing/upgrade", { method: "POST", body: { plan: "evklid_ss_month" } })).status, 200);
    const first = rec();
    assert.equal(first.usd, os);
    assert.equal(first.sub, "sub_a");
    assert.equal((await call("/api/billing/upgrade", { method: "POST", body: { plan: "evklid_faks_month" } })).status, 200);
    const second = rec();
    assert.equal(second.from, "evklid_ss_month");
    assert.equal(second.usd, upgradeFromUsd(first, ss, second.at));
    assert.ok(second.usd >= os && second.usd <= ss);
    const g = api.guaranteeFor(ana);
    assert.equal(g, upgradeMonthUsd(second.usd, faks, second.at));
    assert.ok(g <= faks);
    // Druga naročnina (ali nov račun s ponovno uporabljenim id): zapis ne velja več.
    db.prepare("UPDATE parents SET sub_id = 'sub_b' WHERE id = ?").run(pid);
    assert.equal(api.guaranteeFor(ana), faks);
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
    assert.match(mails()[0].body.text, /13,99/);
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
  process.env.EVKLID_AI_GUARANTEE_OS_USD = "0.2575"; // vrednost 0,2575 $ − brezplačni rep 0,2 $ = meja 0,0575 $ = podrobni del 0,05 $ + 15 % hitrega načina
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
    const done = (sse) => JSON.parse(/event: done\ndata: (.*)/.exec(String(sse))[1]);
    const outSse = await ask();
    const out = events(outSse);
    assert.equal(out[0].stage, "out");
    assert.equal(out[0].left, 0);
    assert.equal(done(outSse).ai_out, true, "100 %: brez »Razloži podrobneje«");
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
    // Dokupljen kredit: podrobne razlage spet na voljo, gumb »Razloži podrobneje« ostane.
    const cr = new Credits(store.db);
    cr.activate(cr.create(reg.body.parent.id, CREDIT_PACKS[0]), "pi_k");
    assert.equal(done(await ask()).ai_out, undefined, "s kreditom gumb ostane");
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
    assert.deepEqual(offer.passes.map((p) => p.amount), [699, 1149], "faks paketi");
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
    // Leto pozneje: obdobje se konča ob effective_at, opomnik o obnovitvi 20 dni prej navede 139 €, ne 99 €.
    db.prepare("UPDATE parents SET sub_period_end = ? WHERE id = ?").run(row.effective_at, pid);
    await run(new Date(Date.parse(row.effective_at) - 20 * day));
    const renewal = stripe.calls.filter((c) => c.host === "api.resend.com" && /obnovila/.test(c.body.text)).at(-1);
    assert.match(renewal.body.text, /139,00/);
  });
});

test("povezava za plačilo s starim paketom »2 otroka«: stran in plačilo po današnjem paketu (Družina)", async () => {
  await withAccounts(async ({ db, call, stripe, kid, pid }) => {
    kid("Ana", "OS");
    kid("Bor", "SS");
    const { sha256 } = await import("../server/accounts/auth.js");
    db.prepare("INSERT INTO pay_links (token_hash, parent_id, kind, plan_key, expires_at) VALUES (?, ?, 'sub', 'evklid_2_month', ?)").run(sha256("t".repeat(30)), pid, iso(5));
    const view = (await call(`/api/pay/${"t".repeat(30)}`)).body;
    assert.equal(view.plan.amount, 1899);
    const co = await call(`/api/pay/${"t".repeat(30)}/checkout`, { method: "POST", body: { email: "oce@p.si", adult: true, withdrawal: true } });
    assert.equal(co.status, 200, JSON.stringify(co.body));
    assert.equal(stripe.calls.filter((c) => c.path === "/v1/checkout/sessions").at(-1).body["line_items[0][price]"], "price_evklid_druzina_month");
  });
});

test("gumb za dokup ob porabi samo polnoletnemu profilu, ne dijaku 15–17 na računu staršev", async () => {
  await withAccounts(async ({ db, api, kid, subscribe }) => {
    const bor = kid("Bor", "SS", YEAR - 16);
    const mama = kid("Mama", "SS", YEAR - 40);
    subscribe("evklid_druzina_month");
    // Skupen delež družine 3,5 $: 2 × 1,45 $ = 83 %.
    for (const id of [bor, mama]) db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, 'claude-haiku', 'chat', 1.45)").run(id);
    assert.equal(api.offerKindFor(bor), "topup");
    assert.equal(api.topupButton(bor), false, "16 let: brez gumba");
    assert.equal(api.topupButton(mama), true, "polnoletna: gumb");
  });
});

test("e-pošta staršu pri 80 %, tudi ko mejo prestopi strošek zunaj odgovora (npr. preverjanje)", async () => {
  const model = modeParams("chat").model;
  const tokens = Math.round(0.02 / costUsd(model, { input_tokens: 1 }));
  process.env.EVKLID_AI_GUARANTEE_OS_USD = "0.775"; // meja 0,575 $ (brez repa 0,2 $), podrobni del 0,5 $
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

// --- cene z najmanj 75 % dobička (j 2026-11-04, »Predlog A«) ---
test("75 %: zajamčeni AI po paketih, skupen delež družine, regijske cene po pravilu, darilo in dokup", () => {
  const g = (key) => planGuarantee(planByKey(key));
  // total = vrednost iz tabele (Predlog A), usd = meja paketa = total − brezplačni rep 0,2 $ na profil (Družina 4 profili).
  const tot = (key) => [g(key).total, g(key).usd];
  assert.deepEqual(["evklid_1_month", "evklid_ss_month", "evklid_faks_month"].map(tot), [[1.9, 1.7], [2.9, 2.7], [4.452, 4.252]]);
  assert.deepEqual(["evklid_1_year", "evklid_ss_year", "evklid_faks_year"].map(tot), [[1.7, 1.5], [2.58, 2.38], [3.693, 3.493]]);
  assert.deepEqual(g("evklid_druzina_month"), { usd: 2.4, total: 3.2, profiles: 4, pool: true });
  assert.deepEqual(g("evklid_druzina_year"), { usd: 1.8, total: 2.6, profiles: 4, pool: true });
  assert.deepEqual(g("evklid_druzina_student_month"), { usd: 4.7, total: 5.5, profiles: 4, pool: true });
  assert.deepEqual(g("evklid_druzina_student_year"), { usd: 3.5, total: 4.3, profiles: 4, pool: true });
  assert.deepEqual(SCHOOL_PLANS.map((p) => [p.interval, planGuarantee(p).total, planGuarantee(p).usd]), [["month", 0.9, 0.7], ["year", 0.6, 0.4]]);
  assert.equal(g("evklid_2_month").pool, true, "stari »2 otroka«: skupen delež");
  assert.equal(subscriptionCeiling(0.3, 2), 0, "nikoli pod 0");
  assert.equal(FAST_TAIL, 0.15);
  assert.equal(freeStudentMonthlyUsd(), 0.2);
  // Najslabši primer: profili paketa porabijo podrobni del, hitri način do meje (server/usage.js studentBudget) in
  // brezplačni rep do 0,2 $ na profil (overFreeTail, nato inštruktor do 1. v mesecu ne odgovarja). Podrobni del =
  // meja / 1,15. Vsak paket (vse valute, stari, šolski, družina) ≥ 75 %.
  const { u, id, spend } = usageSetup();
  const worstAi = (gu) => {
    const ids = Array.from({ length: gu.profiles }, (_, i) => id(`Najslabši ${i}`));
    const ceil = Math.max(gu.usd, MIN_CEILING_USD); // accounts/index.js guaranteeFor
    u.configure({ guaranteeOf: (s) => (ids.includes(s) ? ceil : 0), poolOf: (s) => (gu.pool && ids.includes(s) ? ids : null) });
    const sb = u.studentBudget(ids[0]);
    assert.ok(Math.abs(sb.allowance * (1 + FAST_TAIL) - sb.ceiling) < 1e-9, "hitri način je znotraj meje");
    assert.ok(Math.abs(sb.ceiling - ceil) < 1e-9);
    // Tik pod mejo + repom inštruktor še odgovarja, na meji + repu ne več.
    const worst = ceil + freeStudentMonthlyUsd() * gu.profiles;
    spend(ids[0], worst - 0.001);
    assert.equal(u.overFreeTail(ids.at(-1)), false);
    spend(ids[0], 0.001);
    assert.equal(u.overFreeTail(ids.at(-1)), true);
    assert.ok(u.blockReason(ids.at(-1)));
    return worst;
  };
  const months = (p) => (p.interval === "year" ? 12 : 1);
  const eur = (p) => (p.amount / (["VND", "XOF"].includes(p.currency) ? 1 : 100)) * (p.currency === "EUR" ? 1 : EUR_PER_UNIT[p.currency]);
  const profit = (p) => worstProfit(eur(p) / months(p), worstAi(planGuarantee(p)), { months: months(p), profiles: p.seats || 1 });
  assert.ok(ALL_PLANS.length > 20 && ALL_PLANS.every((p) => p.currency === "EUR" || EUR_PER_UNIT[p.currency]), "vsak paket ima tečaj");
  for (const p of ALL_PLANS) {
    assert.equal(planGuarantee(p).profiles, p.seats || 1, `${p.key}: rep za vsak profil paketa`);
    const pr = profit(p);
    assert.ok(pr >= 0.75 - 1e-9, `${p.key}: ${pr}`);
  }
  // Paketi pred testom: trda meja aiUsd (billing.js passPremium), brez hitrega načina nad njo.
  for (const p of [...PASSES, ...FAKS_PASSES]) assert.ok(worstProfit(p.amount / 100, p.aiUsd) >= 0.75, `${p.key}: ${worstProfit(p.amount / 100, p.aiUsd)}`);
  // Darilo = letna cena stopnje, eno plačilo, zajamčeni AI kot letna naročnina stopnje (accounts/index.js subGuarantee).
  for (const l of ["OS", "SS", "FAKS"]) {
    assert.equal(giftGuarantee(l, l).total, guaranteeUsd(l, "year"));
    const gp = worstProfit(GIFT_PRICES[l] / 100 / 12, worstAi(giftGuarantee(l, l)), { months: 12 });
    assert.ok(gp >= 0.75, `darilo ${l}: ${gp}`);
  }
  // Staro darilo brez stopnje (49 €): po pravilu 75 % iz cene, ne po stopnji profila.
  assert.deepEqual(giftGuarantee(null, "FAKS"), { usd: 0.4, total: 0.6, profiles: 1, pool: false });
  assert.ok(worstProfit(49 / 12, worstAi(giftGuarantee(null, "FAKS")), { months: 12 }) >= 0.75);
  // Regijske cene: (cena v € × (1 − 0,015 − 0,75) − 0,25 − 0,30) / 0,92, navzdol na 0,1 $, najmanj 0.
  assert.equal(guaranteeFromPrice(9.99), 1.9);
  assert.equal(guaranteeFromPrice(49 / 12, { months: 12 }), 0.6, "šolsko leto");
  assert.equal(guaranteeFromPrice(269 / 12, { months: 12, profiles: 4 }), 4.3, "Družina s študentom letno");
  assert.equal(guaranteeFromPrice(1), 0, "nikoli negativno");
  const inr = plansFor("INR");
  assert.equal(regionalGuaranteeUsd(inr[0]), guaranteeFromPrice(399 * 0.0098));
  // Darilo = letna cena stopnje; dokup 75 % (kredit nima hitrega načina): 5 / 10 / 20 € → 1,00 / 2,28 / 4,83 $.
  assert.deepEqual(GIFT_PRICES, { OS: 9900, SS: 13900, FAKS: 19900 });
  assert.deepEqual(CREDIT_PACKS.map((p) => creditUsdFor(p.amount)), [1, 2.22, 4.45]); // največ 25 % plačila brez DDV (j 2026-11-06)
  for (const c of [500, 1000, 2000, 12345]) assert.ok(((c / 100) * 0.985 - 0.25 - creditUsdFor(c) * 0.92) / (c / 100) >= 0.75 - 1e-9, `dokup ${c}`);
});

test("Družina: en skupen delež za ves račun; obvestila in »še N razlag« za skupni delež, ena e-pošta", async () => {
  await withAccounts(async ({ db, api, kid, subscribe, stripe }) => {
    const ana = kid("Ana", "OS", YEAR - 12);
    const bor = kid("Bor", "SS", YEAR - 16);
    subscribe("evklid_druzina_month");
    assert.equal(api.guaranteeFor(ana), 2.4, "3,2 $ − brezplačni rep 4 × 0,2 $");
    assert.deepEqual(api.poolFor(bor), [ana, bor]);
    const spend = (sid, usd) => db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, 'claude-haiku', 'chat', ?)").run(sid, usd);
    spend(ana, 1);
    spend(bor, 1); // skupaj 2 $ od 2,4 / 1,15 = 2,09 $ podrobnega dela = 96 %
    const a = api.aiUsage.allowance(ana);
    const b = api.aiUsage.allowance(bor);
    assert.equal(a.pool, true);
    assert.equal(a.stage, "low");
    assert.deepEqual([b.stage, b.percent, b.explanations_left], [a.stage, a.percent, a.explanations_left], "oba profila vidita isti skupni delež");
    assert.equal(a.explanations_left, explanationsFor(2.4 / 1.15 - 2));
    assert.equal(a.explanations_month, explanationsFor(2.4 / 1.15), "prikazan je podrobni del (meja / 1,15)");
    // Rezervacija v skupnem proračunu enkrat za vso družino.
    api.aiUsage.shareCache = null;
    assert.ok(Math.abs(api.aiUsage.reservedUsd() - 2.4) < 1e-9);
    // E-pošta staršu otroka pod 15 let: ena za skupni delež.
    const mails = () => stripe.calls.filter((c) => c.host === "api.resend.com" && /80 %/.test(c.body.subject || ""));
    await api.billing.allowanceMail(ana, "low");
    await api.billing.allowanceMail(bor, "low");
    assert.equal(mails().length, 1);
    assert.match(mails()[0].body.text, /Skupni delež družine/);
    // Brezplačni rep družine: 0,2 $ na profil skupaj (2 profila = 0,4 $) nad mejo 2,4 $, nato oba profila čakata.
    spend(ana, 0.79); // 2,79 $
    assert.equal(api.aiUsage.blockReason(bor), null);
    spend(bor, 0.01); // 2,80 $
    assert.ok(api.aiUsage.blockReason(ana) && api.aiUsage.blockReason(bor));
    // Paket za en profil: delež po profilu.
    subscribe("evklid_ss_year");
    assert.equal(api.poolFor(bor), null);
    assert.equal(api.guaranteeFor(ana), 2.38, "po plačanem paketu (SŠ letno 2,58 $ − rep 0,2 $; 25 % brez DDV)");
  });
});

test("trda meja: hitri način je znotraj zajamčenega AI (podrobno do meje / 1,15, hitro do meje), nato brezplačni paket z dnevno mejo in mesečnim repom 0,2 $", async () => {
  await withAccounts(async ({ db, api, kid, subscribe }) => {
    const sid = kid("Ema", "OS", YEAR - 13);
    subscribe("evklid_1_month"); // 1,9 $: meja 1,7 $ (+ brezplačni rep 0,2 $), podrobne razlage do 1,7 / 1,15 = 1,478 $
    const spend = (usd) => db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, 'claude-haiku', 'chat', ?)").run(sid, usd);
    spend(1.5);
    const u = api.aiUsage;
    assert.equal(u.fastOnly(sid), true, "delež porabljen: hitri način");
    assert.equal(u.overCeiling(sid), false);
    assert.equal(api.dailyLimitFor(sid), 60, "do meje stalna dnevna meja Osebno");
    assert.equal(u.allowance(sid).stage, "out");
    spend(0.2); // 1,70 $ = meja paketa
    assert.equal(u.overCeiling(sid), true);
    assert.equal(api.dailyLimitFor(sid), freeDaily(), "nad mejo kot brezplačni paket");
    assert.equal(u.blockReason(sid), null, "brezplačni rep");
    spend(0.2); // 1,90 $ = vrednost iz tabele: rep porabljen
    assert.match(u.blockReason(sid), /z novim obdobjem paketa/);
    // Dokupljen kredit odpre naprej.
    api.credits.activate(api.credits.create(api.ownerOf(sid), CREDIT_PACKS[0]), "pi_t");
    assert.equal(u.overCeiling(sid), false);
    assert.equal(u.blockReason(sid), null);
  });
});

test("portal Stripe: preklop samo med mesečnim in letnim obdobjem istega paketa (ne faks → cena OŠ)", async () => {
  await withAccounts(async ({ call, stripe, subscribe, kid }) => {
    kid("Maks", "FAKS", YEAR - 20);
    subscribe("evklid_faks_month");
    const conf = () => stripe.calls.filter((c) => c.path === "/v1/billing_portal/configurations").at(-1)?.body;
    const prices = (b) => Object.entries(b).filter(([k]) => /^features\[subscription_update\]\[products\]\[0\]\[prices\]/.test(k)).map(([, v]) => v).sort();
    let r = await call("/api/billing/portal", { method: "POST" });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.deepEqual(prices(conf()), ["price_evklid_faks_month", "price_evklid_faks_year"]);
    const first = stripe.calls.filter((c) => c.path === "/v1/billing_portal/sessions").at(-1).body.configuration;
    // Isti paket: ista konfiguracija iz predpomnilnika; drug paket: svoja.
    await call("/api/billing/portal", { method: "POST" });
    assert.equal(stripe.calls.filter((c) => c.path === "/v1/billing_portal/configurations").length, 1);
    subscribe("evklid_druzina_year");
    await call("/api/billing/portal", { method: "POST" });
    assert.deepEqual(prices(conf()), ["price_evklid_druzina_month", "price_evklid_druzina_year"]);
    assert.notEqual(stripe.calls.filter((c) => c.path === "/v1/billing_portal/sessions").at(-1).body.configuration, first);
    // Stari »2 otroka«: brez preklopa paketa (samo odpoved, kartica, računi).
    subscribe("evklid_2_month");
    await call("/api/billing/portal", { method: "POST" });
    assert.equal(conf()["features[subscription_update][enabled]"], "false");
    assert.deepEqual(prices(conf()), []);
  });
});

test("Stripe GET /prices: največ 10 lookup_keys na klic", async () => {
  const gets = [];
  const fetchFn = async (url, init) => {
    const u = new URL(url);
    if (init.method === "GET") gets.push([...u.searchParams.keys()].filter((k) => k.startsWith("lookup_keys[")).length);
    return { ok: true, status: 200, json: async () => (init.method === "GET" ? { data: [] } : { id: init.body?.includes("lookup_key") ? "price_x" : "prod_1" }) };
  };
  const stripe = new Stripe({ secretKey: "sk_test_x", fetchFn });
  const plans = Array.from({ length: 23 }, (_, i) => ({ key: `evklid_t${i}_month`, amount: 100 + i, interval: "month", seats: 1, label: `t${i}` }));
  const r = await stripe.ensurePrices("EUR", { plans, cacheKey: "t" });
  assert.deepEqual(gets.slice(0, 3), [10, 10, 3]); // nato še cene v evrih za izdelek (10)
  assert.ok(gets.every((n) => n <= 10));
  assert.equal(Object.keys(r.prices).length, 23);
});

test("trgovina: naročnina za en profil odpre višjo stopnjo profila samo do konca sedanjega obdobja", async () => {
  await withAccounts(async ({ db, api, kid, subscribe, pid }) => {
    const sid = kid("Lan", "SS", YEAR - 16);
    subscribe("evklid_1_month", iso(10));
    if (!db.prepare("PRAGMA table_info(parents)").all().some((c) => c.name === "sub_provider")) db.exec("ALTER TABLE parents ADD COLUMN sub_provider TEXT"); // server/mobile/store-billing.js
    db.prepare("UPDATE parents SET sub_provider = 'apple', sub_id = 'apple:1000' WHERE id = ?").run(pid);
    assert.equal(api.rightsFor(sid).openLevel, "SS", "do konca obdobja odprta stopnja profila");
    // Podaljšanje v trgovini (novo obdobje) ne podaljša odprte višje stopnje.
    db.prepare("UPDATE parents SET sub_period_end = ? WHERE id = ?").run(iso(40), pid);
    assert.equal(api.rightsFor(sid).openLevel, "SS");
    db.prepare("UPDATE store_level_grace SET until = ? WHERE parent_id = ?").run(iso(-1), pid); // prvo obdobje je minilo
    const r = api.rightsFor(sid);
    assert.equal(r.openLevel, "OS", "nato le stopnja izdelka in nižje");
    assert.equal(r.levelLocked, true);
    // Stripe: prehod ureja cena ob podaljšanju (levelChanges), stopnja ostane odprta.
    db.prepare("UPDATE parents SET sub_provider = 'stripe', sub_id = 'sub_a' WHERE id = ?").run(pid);
    assert.equal(api.rightsFor(sid).openLevel, "SS");
  });
});

// --- trda meja AI: popravki po pregledih PR #462 ---
test("trialing (Stripe, še brez plačila): velja meja preizkusa ali kode, ne plačanega paketa; več sedežev skupaj 0,5 $", async () => {
  await withAccounts(async ({ db, api, kid, subscribe, pid }) => {
    const ana = kid("Ana", "OS", YEAR - 12);
    const bor = kid("Bor", "SS", YEAR - 16);
    kid("Cene", "OS", YEAR - 10);
    subscribe("evklid_druzina_month");
    const paid = api.aiUsage.capsFor(ana)[0].usd;
    // Plačana Družina (3 profili): meja paketa + rep 3 × 0,2 $, največ vrednost paketa.
    assert.ok(paid > 2 && paid <= planGuarantee(planByKey("evklid_druzina_month")).total + 1e-9, `plačana: ${paid} $`);
    // Preizkus pri Stripu med aktivacijsko kodo: plačila še ni.
    db.prepare("UPDATE parents SET sub_status = 'trialing', promo_until = ? WHERE id = ?").run(new Date(Date.now() + 200 * 86400000).toISOString(), pid);
    const caps = api.aiUsage.capsFor(ana);
    assert.ok(caps[0].usd <= 0.5 + 1e-9, `meja kode za ves račun, ne Družina (${caps[0].usd} $)`);
    assert.equal(caps[0].key, api.aiUsage.capsFor(bor)[0].key, "en skupen bazen za vse sedeže");
    // Brez kode (Stripe preizkus): meja preizkusa.
    db.prepare("UPDATE parents SET promo_until = NULL WHERE id = ?").run(pid);
    assert.ok(api.aiUsage.capsFor(ana)[0].usd <= 0.5 + 1e-9);
    // Prvi plačan račun (active): meja paketa.
    db.prepare("UPDATE parents SET sub_status = 'active' WHERE id = ?").run(pid);
    assert.ok(Math.abs(api.aiUsage.capsFor(ana)[0].usd - paid) < 1e-9);
  });
});

test("meja po obdobju naročnine, ne po koledarskem mesecu; past_due ne odpre nove meje; preizkus ena meja", async () => {
  await withAccounts(async ({ db, api, kid, subscribe, pid }) => {
    const ana = kid("Ana", "OS", YEAR - 12);
    const ago = (days) => new Date(Date.now() - days * 86400000).toISOString().slice(0, 19).replace("T", " ");
    const spendAt = (days, usd) => db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, created_at) VALUES (?, 'claude-haiku-5-5', 'chat', ?, ?)").run(ana, usd, ago(days));
    const spent = () => api.aiUsage.capsFor(ana)[0].spent;
    // Mesečna naročnina, obdobje se konča čez 3 dni (začelo se je pred ~27–28 dnevi, morda v prejšnjem mesecu).
    subscribe("evklid_1_month", new Date(Date.now() + 3 * 86400000).toISOString());
    spendAt(40, 1); // pred obdobjem: ne šteje
    spendAt(25, 0.3); // v obdobju (lahko v prejšnjem koledarskem mesecu): šteje
    spendAt(1, 0.2);
    assert.ok(Math.abs(spent() - 0.5) < 1e-9, `poraba v obdobju: ${spent()}`);
    // Obnovitev ni uspela: Stripe je premaknil konec obdobja, a nova meja se ne odpre do plačila.
    db.prepare("UPDATE parents SET sub_status = 'past_due', past_due_since = ?, sub_period_end = ? WHERE id = ?").run(new Date(Date.now() - 3600000).toISOString(), new Date(Date.now() + 29 * 86400000).toISOString(), pid);
    spendAt(0, 0.1);
    assert.ok(Math.abs(spent() - 0.6) < 1e-9, `past_due: staro okno (${spent()})`);
    // Plačano: novo obdobje (od pred 1 dneva), stara poraba ne šteje.
    db.prepare("UPDATE parents SET sub_status = 'active', past_due_since = NULL WHERE id = ?").run(pid);
    assert.ok(spent() < 0.35, `novo obdobje: ${spent()}`);
    // Letna naročnina: mesečna okna, sidrana na konec obdobja.
    subscribe("evklid_1_year", new Date(Date.now() + (200 * 86400000)).toISOString());
    assert.ok(spent() <= 0.3 + 1e-9 && spent() >= 0.1 - 1e-9, `letna: mesečno okno (${spent()})`);
    // Preizkus: ena meja za ves preizkus (7 dni), tudi čez prelom meseca.
    db.prepare("UPDATE parents SET sub_status = NULL, sub_plan = NULL, trial_ends_at = ? WHERE id = ?").run(new Date(Date.now() + 2 * 86400000).toISOString(), pid);
    db.prepare("DELETE FROM usage").run();
    spendAt(4.5, 0.2); // v preizkusu
    spendAt(6, 0.3); // pred preizkusom
    assert.ok(Math.abs(spent() - 0.2) < 1e-9, `preizkus: ${spent()}`);
  });
});

test("kredit: pri proračunu 0 se porabi nad mejo paketa; paket pred testom ga ne šteje dvakrat; skupni ključ kredita", async () => {
  await withAccounts(async ({ db, api, kid, subscribe, pid }) => {
    const ana = kid("Ana", "OS", YEAR - 12);
    const bor = kid("Bor", "OS", YEAR - 11);
    subscribe("evklid_1_month");
    assert.equal(api.aiUsage.budget().cap, 0, "brez proračuna");
    assert.ok(api.credits.activate(api.credits.create(pid, CREDIT_PACKS.find((p) => p.id === "k10")), "pi_k"));
    const credit0 = api.credits.balance(pid);
    // Naročnik in brezplačni sorojenec (en sedež) imata skupni ključ kredita.
    const keys = (sid) => api.aiUsage.capsFor(sid).map((c) => c.key);
    assert.ok(keys(ana).includes(`credit:${pid}`) && keys(bor).includes(`credit:${pid}`), `${keys(ana)} / ${keys(bor)}`);
    // Naročnik porabi ves paket in še malo: del nad podrobnim delom plača kredit, tudi brez proračuna.
    const g = planGuarantee(planByKey("evklid_1_month"));
    api.aiUsage.log(ana, "claude-opus-5-5", { output_tokens: Math.round(((g.total + 0.2) * 1e6) / 20) });
    assert.ok(api.credits.balance(pid) < credit0 - 0.2, `kredit porabljen: ${api.credits.balance(pid)} od ${credit0}`);
    const cap = api.aiUsage.capsFor(ana)[0];
    assert.ok(cap.usd - cap.spent <= api.credits.balance(pid) + g.total + 1e-9, "skupna poraba ≤ paket + kupljeni kredit");
    // Paket pred testom: poraba iz kredita se od porabe paketa odšteje.
    const pass = { student_id: bor, starts_at: new Date(Date.now() - 3600000).toISOString() };
    db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, 'claude-haiku-5-5', 'chat', 0.5)").run(bor);
    api.credits.use(pid, bor, 0.2);
    assert.ok(Math.abs(api.billing.passes.spentUsd(pass) - 0.3) < 1e-9);
  });
});

test("paket pred testom skoraj porabljen: profil preide v brezplačni paket; besedila 429 po meji, ki veže", async () => {
  await withAccounts(async ({ db, api, kid, pid }) => {
    const ana = kid("Ana", "OS", YEAR - 12);
    db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z' WHERE id = ?").run(pid);
    const plan = PASSES[0];
    const id = api.billing.passes.create({ parentId: pid, studentId: ana, plan, testDate: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10) });
    assert.ok(api.billing.passes.activate(id, "pi_pass"));
    assert.equal(api.rightsFor(ana).personalTier, "pass");
    const p = api.billing.passes.activeFor(ana);
    // Ostane manj od najcenejšega klica: paket je porabljen, profil je v brezplačnem paketu (ne zaklenjen).
    db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, created_at) VALUES (?, 'claude-haiku-5-5', 'chat', ?, datetime('now','+1 second'))").run(ana, passCapUsd(p) - api.aiUsage.minCallUsd() / 2);
    assert.notEqual(api.rightsFor(ana).personalTier, "pass");
    assert.equal(api.aiPremiumFor(ana), false);
    // Koda paketa pred testom ima svoje besedilo.
    assert.match(api.aiUsage.blockFor(ana, "block.passOut").error, /Paket pred testom je porabljen/);
    // Preizkus: poziv k naročnini namesto »spet jih dobiš«.
    db.prepare("UPDATE parents SET trial_ends_at = ? WHERE id = ?").run(new Date(Date.now() + 3 * 86400000).toISOString(), pid);
    db.prepare("UPDATE passes SET status = 'refunded'").run();
    const b = api.aiUsage.blockFor(ana, "block.freeTail");
    assert.equal(b.code, "block.trialOut");
    assert.match(b.error, /naročnino/);
    // Brezplačni paket: besedilo brezplačnega paketa (z namigom, kadar ga račun sme videti; accounts freeBlock).
    db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z' WHERE id = ?").run(pid);
    const fb = api.aiUsage.blockFor(ana, "block.freeMonth");
    assert.equal(fb.code, "block.freeMonth");
    assert.match(fb.error, /brezplačna vprašanja/);
  });
});

test("preizkus, koda in bonus: skupni bazen vseh računov brez plačila", async () => {
  process.env.EVKLID_NOPAY_POOL_USD = "0.25";
  try {
    await withAccounts(async ({ db, api, kid, pid }) => {
      const ana = kid("Ana", "OS", YEAR - 12);
      const bor = kid("Bor", "OS", YEAR - 11);
      db.prepare("UPDATE parents SET trial_ends_at = ? WHERE id = ?").run(new Date(Date.now() + 3 * 86400000).toISOString(), pid);
      assert.ok(api.aiUsage.capsFor(ana).some((c) => c.key === "nopaypool"));
      db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, 'claude-haiku-5-5', 'chat', 0.25)").run(bor);
      assert.equal(api.aiUsage.hardBlock(ana), "block.freePool");
    });
  } finally {
    delete process.env.EVKLID_NOPAY_POOL_USD;
  }
});

test("odstop v 14 dneh: vračilo sorazmerno porabi (manjše od deleža časa in neporabljene meje AI)", async () => {
  const { withdrawalRefundCents, WITHDRAWAL_TEXT } = await import("../server/accounts/billing.js");
  const day = 86400000;
  // 2 dni od 30, AI porabljen ves: nič.
  assert.equal(withdrawalRefundCents({ paidCents: 999, startMs: 0, endMs: 30 * day, nowMs: 2 * day, aiCapUsd: 1.9, aiSpentUsd: 1.9 }).cents, 0);
  // 2 dni od 30, AI 10 %: min(28/30 = 0,933; 0,9) = 0,9.
  assert.equal(withdrawalRefundCents({ paidCents: 1000, startMs: 0, endMs: 30 * day, nowMs: 2 * day, aiCapUsd: 2, aiSpentUsd: 0.2 }).cents, 900);
  // Nič porabe AI: delež časa.
  assert.equal(withdrawalRefundCents({ paidCents: 3000, startMs: 0, endMs: 30 * day, nowMs: 10 * day, aiCapUsd: 2, aiSpentUsd: 0 }).cents, 2000);
  assert.match(WITHDRAWAL_TEXT, /14 dneh/);
  assert.doesNotMatch(WITHDRAWAL_TEXT, /sorazmerni del plačila/);
  await withAccounts(async ({ db, api, kid, subscribe, pid, call }) => {
    const ana = kid("Ana", "OS", YEAR - 12);
    subscribe("evklid_1_month", new Date(Date.now() + 28 * day).toISOString());
    const g = planGuarantee(planByKey("evklid_1_month"));
    db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd) VALUES (?, 'claude-opus-5-5', 'chat', ?)").run(ana, g.total / 2);
    assert.equal((await call(`/api/admin/withdrawal/${pid}`)).status, 403, "samo skrbnik");
    db.prepare("UPDATE parents SET is_admin = 1 WHERE id = ?").run(pid);
    const r = (await call(`/api/admin/withdrawal/${pid}`)).body.subscription;
    assert.ok(Math.abs(r.ai_left - 0.5) < 0.01, JSON.stringify(r));
    assert.equal(r.refund_cents, Math.floor(999 * Math.min(r.time_left, r.ai_left)));
    assert.ok(r.refund_cents <= 500 && r.within_14_days);
  });
});
