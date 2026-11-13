// Stran za šole /sole, naročila šolske licence in predračun (server/sole.js).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { pilotReport } from "../server/pilot.js";
import { SCHOOL_LICENCE_PRICES } from "../server/schools.js";
import { validateOrder, predracunHtml, CONSENT_TEXT } from "../server/sole.js";
import { BRAND } from "../server/brand.js";

const NOW = new Date("2026-10-30T10:00:00Z");
const good = (over = {}) => ({
  school: "OŠ Prule",
  address: "Prule 13, 1000 Ljubljana",
  registrationNo: "5085411",
  taxId: "SI 12345678",
  budgetUser: true,
  budgetCode: "61204",
  contact: "Ana Novak",
  email: "ana.novak@os-prule.si",
  phone: "+386 1 234 56 78",
  plan: "school",
  students: 120,
  startDate: "2027-09-01",
  note: "7. in 8. razredi",
  consent: true,
  ...over,
});
const post = (base, body, headers = {}) =>
  fetch(`${base}/api/school-orders`, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
const nextYear = `${new Date().getUTCFullYear() + 1}-09-01`;

test("validateOrder: required fields, numbers and limits", () => {
  const ok = validateOrder(good(), NOW);
  assert.ok(ok.order, ok.error);
  assert.equal(ok.order.tax_id, "12345678");
  assert.equal(ok.order.budget_code, "61204");
  assert.equal(ok.order.price_eur, SCHOOL_LICENCE_PRICES.school.eur);
  assert.equal(ok.order.consent_text, CONSENT_TEXT);
  assert.equal(ok.order.consent_at, NOW.toISOString());
  assert.ok(validateOrder(good({ registrationNo: "1234567890", taxId: "12345678", budgetUser: false, budgetCode: "x", phone: "" }), NOW).order);
  assert.equal(validateOrder(good({ budgetUser: false }), NOW).order.budget_code, null);
  const bad = {
    school: "",
    address: "x",
    registrationNo: "12345678", // 8 števk
    taxId: "SI1234567",
    budgetCode: "1234",
    contact: "A",
    email: "ana@",
    phone: "abc",
    plan: "gold",
    students: 0,
    startDate: "2026-02-30",
    note: "x".repeat(1001),
    consent: false,
  };
  for (const [k, v] of Object.entries(bad)) assert.ok(validateOrder(good({ [k]: v }), NOW).error, `${k} = ${String(v).slice(0, 20)}`);
  for (const v of [5001, 1.5, "12a", [], { n: 1 }]) assert.ok(validateOrder(good({ students: v }), NOW).error, `students ${v}`);
  assert.ok(validateOrder(good({ startDate: "2020-01-01" }), NOW).error, "v preteklosti");
  assert.ok(validateOrder(good({ startDate: "2029-01-01" }), NOW).error, "več kot dve leti naprej");
  assert.ok(validateOrder(good({ consent: "true" }), NOW).error, "soglasje samo true");
  assert.ok(validateOrder(null).error);
  assert.ok(validateOrder([]).error);
  assert.equal(validateOrder(good({ students: "40" }), NOW).order.students, 40);
});

test("/sole page, orders without accounts (local admin), status, predračun", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: false, scheduler: false, log: { error() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const ua = { "User-Agent": "Mozilla/5.0 (iPhone)" };
    const page = await fetch(`${base}/sole`, { headers: ua });
    assert.equal(page.status, 200);
    const html = await page.text();
    assert.ok(!/\{\{[\w.]+\}\}/.test(html), "vse spremenljivke so zamenjane");
    assert.ok(html.includes(`<title>${BRAND.name} za šole</title>`));
    for (const p of Object.values(SCHOOL_LICENCE_PRICES)) assert.ok(new RegExp(`>${p.eur}\\s€<`).test(html), `cena ${p.eur}`);
    assert.ok(html.includes("na učenca na leto"));
    assert.ok(html.includes("UJP") && html.includes('id="order-form"') && html.includes('name="website"'));
    assert.ok(!/DDV/.test(html), "na strani ni trditev o DDV");
    assert.equal((await fetch(`${base}/sole.html`, { headers: ua })).status, 200);
    await new Promise((r) => setTimeout(r, 20));
    assert.equal(pilotReport(store.db, { days: 1 }).totals.visits.sole, 2);

    // Naročilo
    const r = await post(base, good({ startDate: nextYear, note: "<script>alert(1)</script>" }));
    assert.equal(r.status, 201);
    const d = await r.json();
    assert.match(d.number, /^\d{4}-0001$/);
    assert.equal(d.total, 120 * SCHOOL_LICENCE_PRICES.school.eur);
    // Napačni podatki: 400, nič se ne shrani; past za robote: 201, nič se ne shrani.
    assert.equal((await post(base, good({ startDate: nextYear, taxId: "123" }))).status, 400);
    assert.equal((await post(base, { ...good({ startDate: nextYear }), consent: undefined })).status, 400);
    assert.equal((await post(base, good({ startDate: nextYear, website: "http://spam" }))).status, 201);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM school_orders").get().n, 1);
    // Največ 5 na uro z enega naslova (past za robote šteje).
    for (let i = 0; i < 3; i++) assert.equal((await post(base, good({ startDate: nextYear, plan: "pilot" }))).status, 201);
    assert.equal((await post(base, good({ startDate: nextYear }))).status, 429);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM school_orders").get().n, 4);

    // Skrbnik (brez računov: samo na računalniku s strežnikom)
    const list = await (await fetch(`${base}/api/admin/school-orders`)).json();
    assert.equal(list.orders.length, 4);
    const first = list.orders.at(-1);
    assert.equal(first.status, "new");
    assert.equal(first.budget_user, true);
    const viaTunnel = { "X-Forwarded-For": "1.2.3.4" };
    assert.equal((await fetch(`${base}/api/admin/school-orders`, { headers: viaTunnel })).status, 403);
    assert.equal((await fetch(`${base}/api/admin/school-orders/${first.id}/predracun`, { headers: viaTunnel })).status, 403);
    const put = (id, body, headers = {}) =>
      fetch(`${base}/api/admin/school-orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
    assert.equal((await put(first.id, { status: "won" }, viaTunnel)).status, 403);
    const upd = await put(first.id, { status: "offer_sent", note: "poslano 30. 10." });
    assert.equal(upd.status, 200);
    assert.equal((await upd.json()).status, "offer_sent");
    assert.equal((await put(first.id, { note: "še pokliči" })).status, 200);
    const row = store.db.prepare("SELECT status, admin_note FROM school_orders WHERE id = ?").get(first.id);
    assert.deepEqual({ ...row }, { status: "offer_sent", admin_note: "še pokliči" });
    assert.equal((await put(first.id, { status: "paid" })).status, 400);
    assert.equal((await put(first.id, { note: 5 })).status, 400);
    assert.equal((await put(9999, { status: "won" })).status, 404);
    assert.equal((await put("1x", { status: "won" })).status, 404);

    // Predračun: podatki kupca so ubežni, znesek in sklic, prodajalec iz .env ali »[izpolni]«.
    delete process.env[`${BRAND.env}_SELLER_IBAN`];
    process.env[`${BRAND.env}_SELLER_NAME`] = "Podjetje <b>d.o.o.</b>";
    const pr = await fetch(`${base}/api/admin/school-orders/${first.id}/predracun`);
    delete process.env[`${BRAND.env}_SELLER_NAME`];
    assert.equal(pr.status, 200);
    assert.match(pr.headers.get("content-type"), /text\/html/);
    const doc = await pr.text();
    assert.ok(!doc.includes("<script>alert(1)</script>"), "opomba šole je ubežna");
    assert.ok(doc.includes("&lt;script&gt;alert(1)&lt;/script&gt;"));
    assert.ok(doc.includes("Podjetje &lt;b&gt;d.o.o.&lt;/b&gt;"));
    assert.ok(doc.includes("[izpolni]"), "manjkajoči IBAN");
    assert.ok(doc.includes(`data-total="${120 * SCHOOL_LICENCE_PRICES.school.eur}"`));
    assert.match(doc, /1\.?680,00\s€/);
    assert.ok(doc.includes(`SI00 ${first.number}`));
    assert.ok(doc.includes("Rok plačila: 30 dni") && doc.includes("UJP"));
    assert.equal((await fetch(`${base}/api/admin/school-orders/9999/predracun`)).status, 404);
  } finally {
    server.close();
  }
});

test("predračun: totals per plan and escaping of every buyer field", () => {
  const o = {
    id: 7,
    created_at: "2026-10-30 10:00:00",
    school_name: `"><img src=x onerror=alert(1)>`,
    address: "<i>Ulica</i>",
    registration_no: "1234567",
    tax_id: "12345678",
    budget_user: 1,
    budget_code: "12345",
    contact_name: "A & B",
    email: "a@b.si",
    phone: "",
    plan: "pilot",
    students: 3,
    price_eur: SCHOOL_LICENCE_PRICES.pilot.eur,
    start_date: "2027-09-01",
    note: "",
  };
  const html = predracunHtml(o, NOW);
  assert.ok(!html.includes("<img") && !html.includes("<i>Ulica"));
  assert.ok(html.includes("A &amp; B"));
  assert.ok(html.includes(`data-total="${3 * SCHOOL_LICENCE_PRICES.pilot.eur}"`));
  assert.ok(html.includes("Predračun št. 2026-0007") && html.includes("SI00 2026-0007"));
  assert.ok(html.includes("Šifra PU"));
  assert.ok(!predracunHtml({ ...o, budget_user: 0, budget_code: null }, NOW).includes("Šifra PU"));
});

test("school orders with accounts: public form, admin only for an admin parent", async () => {
  const store = openDb(":memory:");
  const fetchFn = async () => ({ ok: true, status: 200, json: async () => ({ id: "x" }) });
  const app = createApp(store, { accounts: true, scheduler: false, stripeKey: "", resendKey: "re_x", fetchFn, log: { error() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.equal((await fetch(`${base}/sole`)).status, 200);
    // Obrazec je javen (brez prijave).
    const r = await post(base, good({ startDate: nextYear }));
    assert.equal(r.status, 201);
    const id = store.db.prepare("SELECT id FROM school_orders").get().id;
    const body = JSON.stringify({ email: "sola@pilot.si", password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" });
    const reg = await fetch(`${base}/api/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body });
    assert.equal(reg.status, 201);
    const cookie = reg.headers
      .getSetCookie()
      .map((c) => c.split(";")[0])
      .join("; ");
    assert.equal((await fetch(`${base}/api/admin/school-orders`)).status, 401, "brez prijave");
    assert.equal((await fetch(`${base}/api/admin/school-orders/${id}/predracun`)).status, 401);
    // Tudi na računalniku s strežnikom starš brez pravic skrbnika ne vidi naročil.
    assert.equal((await fetch(`${base}/api/admin/school-orders`, { headers: { cookie } })).status, 403);
    const put = { method: "PUT", headers: { "Content-Type": "application/json", cookie }, body: JSON.stringify({ status: "won" }) };
    assert.equal((await fetch(`${base}/api/admin/school-orders/${id}`, put)).status, 403);
    store.db.prepare("UPDATE parents SET is_admin = 1 WHERE email = ?").run("sola@pilot.si");
    const ok = await fetch(`${base}/api/admin/school-orders`, { headers: { cookie } });
    assert.equal(ok.status, 200);
    assert.equal((await ok.json()).orders.length, 1);
    assert.equal((await fetch(`${base}/api/admin/school-orders/${id}`, put)).status, 200);
    assert.equal((await fetch(`${base}/api/admin/school-orders/${id}/predracun`, { headers: { cookie } })).status, 200);
    // Omejitev na IP: lažna glava Cf-Connecting-Ip je ne obide (na Renderju šteje req.ip).
    for (let i = 0; i < 4; i++) assert.equal((await post(base, good({ startDate: nextYear }), { "cf-connecting-ip": `10.0.0.${i}` })).status, 201);
    assert.equal((await post(base, good({ startDate: nextYear }), { "cf-connecting-ip": "10.0.0.99" })).status, 429);
  } finally {
    server.close();
  }
});
