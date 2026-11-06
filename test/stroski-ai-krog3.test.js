// Trda meja AI, krog 3 popravkov PR #462 (pregleda A in B, j 2026-11-06).
import test from "node:test";
import assert from "node:assert/strict";
import { rights } from "../server/placila/pravice.js";

const DAY = 86400000;
const iso = (days) => new Date(Date.now() + days * DAY).toISOString();

test("A4: šolska licenca z mejo AI 0 $ (ali neveljavno) = brez šolskega AI, ne neomejeno", () => {
  const school = { id: 1, subjects: '["MAT"]', grades: null, valid_until: iso(30), ai_month_usd: 0, ai_spent_usd: 0 };
  for (const s of [school, { ...school, ai_month_usd: NaN }, { ...school, ai_month_usd: null }]) {
    const r = rights({ schools: [s], freeDaily: 10 });
    assert.equal(r.school, true, "vsebine licence ostanejo");
    assert.equal(r.schoolAiOut, true);
    assert.equal(r.maxModel, null, "brez Sonneta");
  }
  assert.equal(rights({ schools: [{ ...school, ai_month_usd: 5 }] }).schoolAiOut, false);
});

test("S5: poraba izbrisanega profila brez dela, ki ga je plačal kredit (ni dvojnega štetja)", async () => {
  const { withAccounts } = await import("./racuni-pomoc.js");
  const { Usage } = await import("../server/usage.js");
  const { Credits } = await import("../server/placila/krediti.js");
  await withAccounts({}, async ({ store, kid }) => {
    const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id;
    const credits = new Credits(store.db);
    const u = new Usage(store.db);
    u.configure({ credits });
    store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, parent_id) VALUES (?, 'claude-haiku-5-5', 'chat', 0.5, ?)").run(kid.id, pid);
    credits.use(pid, kid.id, 0.3);
    store.deleteStudent(kid.id);
    assert.ok(Math.abs(u.orphanSpent(pid) - 0.2) < 1e-9, `${u.orphanSpent(pid)}`);
  });
});

test("A1: Haiku 5.5 nad 100k žetonov poziva 5× cena (zapis in rezerva); dolg pogovor gre pod prag", async () => {
  const { costUsd } = await import("../server/claude.js");
  const { callMaxUsd, fitLongPrompt, messageTokens } = await import("../server/meje-ai.js");
  const short = costUsd("claude-haiku-5-5", { input_tokens: 90_000, output_tokens: 1000 });
  assert.ok(Math.abs(short - (90_000 * 0.1 + 1000 * 0.5) / 1e6) < 1e-12);
  const long = costUsd("claude-haiku-5-5", { input_tokens: 20_000, cache_read_input_tokens: 100_000, output_tokens: 1000 });
  assert.ok(Math.abs(long - (20_000 * 0.5 + 100_000 * 0.05 + 1000 * 2.5) / 1e6) < 1e-12, "branje šteje v prag, ves klic po dolgi ceni");
  assert.ok(callMaxUsd("claude-haiku-5-5", 120_000, 1000) >= 5 * (120_000 * 0.2 + 1000 * 0.5) / 1e6 - 1e-12);
  assert.equal(costUsd("claude-opus-5-5", { input_tokens: 200_000 }), (200_000 * 4) / 1e6, "Opus brez doplačila");
  const big = Array.from({ length: 40 }, (_, i) => ({ role: i % 2 ? "assistant" : "user", content: "x".repeat(5000) }));
  const fit = fitLongPrompt({ mode: "chat", system: "s", messages: big });
  assert.ok(messageTokens(fit) < 95_000 && fit.length < big.length && fit[0].role === "user");
  assert.equal(fitLongPrompt({ mode: "deep", system: "s", messages: big }), big, "Opus: brez rezanja");
});

test("S6: zavrnjen poskus pred nadomestnim modelom je plačan posebej; rezerva Sonneta/Opusa za dva klica", async () => {
  const { costUsd, fallbackExtraUsd, addUsage } = await import("../server/claude.js");
  const { replyReserveUsd, callMaxUsd } = await import("../server/meje-ai.js");
  const usage = {
    input_tokens: 400, output_tokens: 200,
    iterations: [
      { type: "message", model: "claude-opus-5-5", input_tokens: 1000, output_tokens: 500 },
      { type: "fallback_message", model: "claude-sonnet-5-5", input_tokens: 400, output_tokens: 200 },
    ],
  };
  const extra = fallbackExtraUsd(usage);
  assert.ok(Math.abs(extra - (1000 * 4 + 500 * 20) / 1e6) < 1e-12);
  assert.equal(fallbackExtraUsd({ input_tokens: 1 }), 0, "brez nadomestnega modela nič");
  const total = costUsd("claude-sonnet-5-5", addUsage(null, { ...usage, extra_cost_usd: extra }));
  assert.ok(Math.abs(total - ((400 * 2 + 200 * 10) / 1e6 + extra)) < 1e-12);
  const msgs = [{ role: "user", content: "a" }];
  assert.ok(replyReserveUsd({ mode: "deep", system: "s", messages: msgs }) >= 2 * callMaxUsd("claude-opus-5-5", 1, 6000));
  assert.ok(replyReserveUsd({ mode: "chat", system: "s", messages: msgs }) < 2 * callMaxUsd("claude-haiku-5-5", 1, 3000), "Haiku brez nadomestnega modela");
  const one = replyReserveUsd({ mode: "deep", system: "s", messages: msgs, fallback: false });
  assert.ok(Math.abs(2 * one - replyReserveUsd({ mode: "deep", system: "s", messages: msgs })) < 1e-12, "brez nadomestnega modela rezerva enega klica");
});

// Račun naročnine Stripe (invoice.paid) z vrsticami in obdobjem.
const invoice = (id, lines, extra = {}) => ({ id, subscription: "sub_p", currency: "eur", lines: { data: lines }, ...extra });
const line = (amount, startMs, endMs, extra = {}) => ({ amount, period: { start: Math.floor(startMs / 1000), end: Math.floor(endMs / 1000) }, ...extra });

test("A2: dejansko plačilo obdobja – vrstice brez DDV in popustov, proracije po času, vračilo", async () => {
  const { invoiceRows, createPaidPeriods } = await import("../server/placila/placano.js");
  const DAYMS = 86400000;
  const t0 = Date.UTC(2026, 10, 1);
  // 9,99 € z DDV v Sloveniji, brez Stripe Tax: brez DDV 8,19 €.
  const [r] = invoiceRows(invoice("in_1", [line(999, t0, t0 + 30 * DAYMS)]), { country: "SI" });
  assert.ok(Math.abs(r.eur - 9.99 / 1.22) < 1e-9);
  // Stripe Tax (vključen v ceno) in popust 50 %.
  const [t] = invoiceRows(invoice("in_2", [line(999, t0, t0 + 30 * DAYMS, { discount_amounts: [{ amount: 500 }], tax_amounts: [{ amount: 90, inclusive: true }] })]));
  assert.ok(Math.abs(t.eur - 4.09) < 1e-9 && t.cents === 499);
  const store = new Map();
  const kv = { get: (k) => store.get(k) ?? null, set: (k, v) => store.set(k, v) };
  const pp = createPaidPeriods(kv);
  pp.record(1, invoice("in_a", [line(999, t0, t0 + 30 * DAYMS)]), { country: "SI" });
  // Proracija nadgradnje za zadnjih 6 dni (+10 € × 6/30) in preklop nazaj (negativna proracija za iste dni).
  pp.record(1, invoice("in_b", [line(200, t0 + 24 * DAYMS, t0 + 30 * DAYMS)]), { country: "SI" });
  const win = (a, b) => pp.eurIn(1, "sub_p", t0 + a * DAYMS, t0 + b * DAYMS).eur;
  assert.ok(Math.abs(win(0, 30) - (9.99 + 2) / 1.22) < 1e-9);
  assert.ok(Math.abs(win(0, 15) - 9.99 / 1.22 / 2) < 1e-9, "po času");
  pp.record(1, invoice("in_c", [line(-200, t0 + 24 * DAYMS, t0 + 30 * DAYMS)]), { country: "SI" });
  assert.ok(Math.abs(win(0, 30) - 9.99 / 1.22) < 1e-9, "negativna proracija odšteje");
  pp.refund(1, "in_a", 0.5);
  assert.ok(Math.abs(win(0, 30) - 9.99 / 1.22 / 2) < 1e-9, "polovično vračilo");
  assert.equal(pp.eurIn(1, "sub_x", t0, t0 + 30 * DAYMS).rows, 0, "druga naročnina: ni zapisa");
});

test("A5: DDV po državi kupca in tečaji z rezervo (sveži 10 %, stalni 20 %)", async () => {
  const P = await import("../server/accounts/plans.js");
  const { parseFx } = await import("../server/tecaji.js");
  assert.equal(P.vatRateFor("HU"), 0.27);
  assert.equal(P.vatRateFor("SI"), 0.22);
  assert.equal(P.vatRateFor("XX"), P.VAT_MAX, "neznana država: najvišja");
  assert.ok(P.aiCapFromEur(19.99, 0.27) < P.aiCapFromEur(19.99, 0.22));
  P.setFxRates({}, 0);
  assert.ok(Math.abs(P.eurPerUnitNow("INR") - P.EUR_PER_UNIT.INR * 0.8) < 1e-12, "brez svežih: stalni − 20 %");
  P.setFxRates(parseFx({ date: new Date().toISOString().slice(0, 10), eur: { inr: 100, ngn: 5000, kes: 1e9 } }), Date.now());
  assert.ok(Math.abs(P.eurPerUnitNow("INR") - 0.01 * 0.9) < 1e-12, "sveži − 10 %");
  assert.ok(Math.abs(P.eurPerUnitNow("NGN") - 0.0002 * 0.9) < 1e-12, "šibkejša valuta velja");
  assert.ok(Math.abs(P.eurPerUnitNow("KES") - P.EUR_PER_UNIT.KES * 0.8) < 1e-12, "napačen podatek zavrnjen");
  assert.equal(P.eurPerUnitNow("XOF"), P.EUR_PER_UNIT.XOF, "vezan na evro");
  P.setFxRates({ INR: 0.01 }, Date.now() - 9 * 86400000);
  assert.ok(Math.abs(P.eurPerUnitNow("INR") - P.EUR_PER_UNIT.INR * 0.8) < 1e-12, "podatki starejši od 8 dni: stalni");
  P.setFxRates({}, 0);
});

test("S4: rezervacija klica je v bazi; ob ponovnem zagonu se ostanek zapiše kot poraba", async () => {
  const { openDb } = await import("../server/db.js");
  const { Usage } = await import("../server/usage.js");
  const store = openDb(":memory:");
  const s = store.createStudent("Ana");
  const u = new Usage(store.db);
  u.configure({ capsOf: () => [{ key: "x", usd: 5, spent: 0 }] });
  const h = u.hold(s.id);
  assert.ok(h.take(0.3));
  assert.equal(store.db.prepare("SELECT usd FROM ai_holds").get().usd, 0.3);
  h.settle(0.1);
  assert.ok(Math.abs(store.db.prepare("SELECT usd FROM ai_holds").get().usd - 0.2) < 1e-12);
  // Strežnik se ustavi med klicem: nov proces najde ostanek.
  const again = new Usage(store.db);
  assert.equal(again.recoverHolds(), 1);
  assert.ok(Math.abs(again.monthTotal(s.id) - 0.2) < 1e-12, "zapisano kot poraba profila");
  assert.equal(store.db.prepare("SELECT COUNT(*) n FROM ai_holds").get().n, 0);
  const h2 = u.hold(s.id);
  h2.take(0.1);
  h2.release();
  assert.equal(store.db.prepare("SELECT COUNT(*) n FROM ai_holds").get().n, 0, "sproščeno: brez vrstice");
});

test("K3-4: osvežitev tečajev – pripeta različica po datumu, rezervni naslov, časovna omejitev, svežost po datumu podatkov", async () => {
  const P = await import("../server/accounts/plans.js");
  const { refreshFx, fxUrls } = await import("../server/tecaji.js");
  const urls = [];
  const rows = new Map();
  const db = { prepare: () => ({ run: (k, v) => rows.set(k, v), get: () => null }) };
  const today = new Date().toISOString().slice(0, 10);
  const fetchFn = async (url, init) => {
    urls.push(url);
    assert.ok(init.signal, "časovna omejitev");
    if (urls.length === 1) return { ok: false, status: 503 };
    return { ok: true, text: async () => JSON.stringify({ date: today, eur: { inr: 1 / (P.EUR_PER_UNIT.INR * 1.05) } }) };
  };
  try {
    assert.ok(fxUrls()[0].includes("@20") && !fxUrls()[0].includes("@latest"), "pripeta različica");
    const r = await refreshFx(db, { fetchFn, log: { warn() {} } });
    assert.equal(urls.length, 2, "rezervni naslov");
    assert.ok(r.INR > 0 && Math.abs(P.eurPerUnitNow("INR") - P.EUR_PER_UNIT.INR * 1.05 * 0.9) < 1e-12);
    assert.ok(JSON.parse(rows.get("fx_eur")).at <= Date.now());
    // Prevelika okrepitev (+20 %) zavrnjena: stalni tečaj.
    P.setFxRates({}, 0);
    const up = await refreshFx(db, { fetchFn: async () => ({ ok: true, json: async () => ({ date: today, eur: { inr: 1 / (P.EUR_PER_UNIT.INR * 1.2) } }) }), log: { warn() {} } });
    assert.equal(up, null);
  } finally {
    P.setFxRates({}, 0);
  }
});
