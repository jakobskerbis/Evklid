// Pregled 3 (B) PR #462: poskusi zlorabe trde meje AI (luknje L1–L4). Pred popravki so padli, zdaj morajo uspeti.
import test from "node:test";
import assert from "node:assert/strict";
import { withAccounts, META } from "./racuni-pomoc.js";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { setClient } from "../server/claude.js";
import { aiCapFromEur } from "../server/accounts/plans.js";

const iso = (ms) => new Date(ms).toISOString();
const sql = (ms) => iso(ms).slice(0, 19).replace("T", " ");
const DAY = 86400000;
const streamFn = async ({ onText }) => {
  onText("ok");
  return { text: "ok" + META, stopReason: "end_turn", model: "claude-haiku-5-5", usage: { input_tokens: 10, output_tokens: 5 } };
};
const ask = async (call, kid) => {
  const conv = (await call(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
  return call(`/api/conversations/${conv.id}/messages`, { method: "POST", body: { text: "Koliko je 2 + 3?" } });
};
const spend = (store, kid, usd, atMs) =>
  store.db.prepare("INSERT INTO usage (student_id, model, kind, cost_usd, created_at, parent_id) VALUES (?, 'claude-haiku-5-5', 'chat', ?, ?, (SELECT parent_id FROM students WHERE id = ?))").run(kid.id, usd, sql(atMs), kid.id);

// L1: nadgradnja se meša po KOLEDARSKEM mesecu (plans.js upgradeMonthUsd), obdobje meje pa je obdobje naročnine.
// Nadgradnja OŠ → Faks 1. v mesecu, 6 dni pred koncem obdobja: Stripe zaračuna razliko le za 6/31 obdobja,
// meja pa je cela meja Faksa za vse obdobje.
test("L1: nadgradnja tik pred koncem obdobja odpre celo mejo višjega paketa (plačano le nekaj dni razlike)", async (t) => {
  await withAccounts({}, async ({ call, store, kid }) => {
    const now = Date.now();
    const d = new Date(now);
    const monthStart = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1) + 60_000;
    const end = now + 1 * DAY;
    const start = end - 31 * DAY;
    if (!(start < monthStart && monthStart < now)) return t.skip("smiseln od 2. dne v mesecu do ~28."); // pregled A3 K3-8
    const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id;
    store.db.prepare("UPDATE parents SET sub_status='active', sub_id='sub_x', sub_provider='stripe', sub_plan='evklid_faks_month', sub_seats=1, sub_period_end=? WHERE id=?").run(iso(end), pid);
    store.db.prepare("INSERT OR REPLACE INTO kv (key, value) VALUES (?, ?)").run(`ai_upgrade_${pid}`, JSON.stringify({ from: "evklid_1_month", usd: 1.7, at: monthStart, sub: "sub_x" }));
    // Pravično: plačano 9,99 € + 10 € × (preostanek po nadgradnji / dolžina obdobja).
    const paid = 9.99 + 10 * ((end - monthStart) / (end - start));
    const fair = aiCapFromEur(paid);
    spend(store, kid, fair + 0.6, now - 2 * DAY);
    const r = await ask(call, kid);
    assert.equal(r.status, 429, `poraba ${(fair + 0.6).toFixed(2)} $ > 25 % plačila (${fair.toFixed(2)} $ pri ${paid.toFixed(2)} €), a inštruktor še odgovarja`);
  }, { streamFn });
});

// L2: preklop mesečno ↔ letno v portalu Stripe (stripe.js: subscription_update, create_prorations) premakne konec obdobja
// (sprememba intervala ponastavi sidro). aiPeriodStart odpre NOVO okno, poraba v starem oknu ne šteje več.
// Preklop nazaj (letno → mesečno) se plača iz dobroimetja stranke (proracija), zato vsak preklop = nova meja brez novega denarja.
test("L2: preklop mesečno ↔ letno odpre novo okno meje (ponavljajoče)", async () => {
  await withAccounts({}, async ({ call, store, kid }) => {
    const now = Date.now();
    const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id;
    store.db.prepare("UPDATE parents SET sub_status='active', sub_id='sub_y', sub_provider='stripe', sub_plan='evklid_1_month', sub_seats=1, sub_period_end=? WHERE id=?").run(iso(now + 20 * DAY), pid);
    spend(store, kid, 2.0, now - 5 * DAY); // meja OŠ mesečno je 1,9 $
    assert.equal((await ask(call, kid)).status, 429, "meja porabljena");
    // Portal: mesečno → letno (Stripe ponastavi sidro, konec obdobja = zdaj + 1 leto)
    store.db.prepare("UPDATE parents SET sub_plan='evklid_1_year', sub_period_end=? WHERE id=?").run(iso(now + 365 * DAY), pid);
    // Portal: letno → mesečno (plačano iz dobroimetja stranke)
    // Stripe: novo obdobje se začne ob preklopu (sidro = trenutek preklopa), konec = isti trenutek čez 1 koledarski mesec.
    const t = new Date(now - 1000);
    t.setUTCMonth(t.getUTCMonth() + 1);
    store.db.prepare("UPDATE parents SET sub_plan='evklid_1_month', sub_period_end=? WHERE id=?").run(t.toISOString(), pid);
    const r = await ask(call, kid);
    assert.equal(r.status, 429, "po dveh preklopih (brez novega denarja) meja spet polna – luknja");
  }, { streamFn });
});

// L3: /scan/solve: drugi klic (ponovitev) pade → strošek PRVEGA klica se ne zapiše (solveWithAi vrže brez usage).
test("L3: skener – napaka pri ponovitvi izgubi strošek prvega klica", async () => {
  const prevKey = process.env.ANTHROPIC_API_KEY;
  const prevMock = process.env.EVKLID_MOCK;
  process.env.ANTHROPIC_API_KEY = "test-ni-pravi";
  delete process.env.EVKLID_MOCK;
  let n = 0;
  setClient({
    messages: {
      create: async () => {
        n++;
        if (n === 1)
          return {
            content: [{ type: "text", text: JSON.stringify({ kind: "equation", variable: "x", problem_tex: "x+1=3", answer_tex: "x=5", solutions: ["5"], methods: [{ name: "a", steps: [{ title: "t", tex: "x=5", why: "w" }] }] }) }],
            usage: { input_tokens: 2000, output_tokens: 8000 },
            model: "claude-sonnet-5-5",
          };
        throw Object.assign(new Error("overloaded"), { status: 529 });
      },
    },
  });
  const store = openDb(":memory:");
  const server = createApp(store, { scheduler: false }).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const s = await (await fetch(`${base}/api/students`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Ana" }) })).json();
    const r = await fetch(`${base}/api/students/${s.id}/scan/solve`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: "x+1=3" }) });
    assert.equal(n, 2, "dva klica");
    // Popravek: ostane prva (nepreverjena) rešitev, strošek prvega klica je zapisan.
    assert.equal(r.status, 200);
    assert.equal((await r.json()).solution.verified, false);
    const logged = store.db.prepare("SELECT COALESCE(SUM(cost_usd),0) s FROM usage").get().s;
    assert.ok(logged > 0, `plačan prvi klic (~0,08 $) ni zapisan: ${logged}`);
  } finally {
    server.close();
    setClient(null);
    if (prevKey === undefined) delete process.env.ANTHROPIC_API_KEY;
    else process.env.ANTHROPIC_API_KEY = prevKey;
    if (prevMock !== undefined) process.env.EVKLID_MOCK = prevMock;
  }
});

// L4: preizkus pri izčrpanem skupnem bazenu (EVKLID_NOPAY_POOL_USD): preizkusni uporabnik dobi MANJ kot brezplačni.
test("L4: izčrpan bazen preizkusov zaklene preizkus (brezplačni paket bi še odgovarjal)", async () => {
  await withAccounts({ EVKLID_NOPAY_POOL_USD: "0.01" }, async ({ call, store, kid }) => {
    const pid = store.db.prepare("SELECT parent_id FROM students WHERE id = ?").get(kid.id).parent_id;
    store.db.prepare("UPDATE parents SET trial_ends_at=? WHERE id=?").run(iso(Date.now() + 5 * DAY), pid);
    spend(store, kid, 0.02, Date.now() - 3600_000); // drugi preizkusi so porabili bazen (tu: ta profil)
    const r = await ask(call, kid);
    assert.equal(r.status, 200, `preizkus pri izčrpanem bazenu: ${r.status} ${r.body?.code}`);
  }, { streamFn });
});
