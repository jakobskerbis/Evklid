// Piškotek naprave (sm_device) samo s prijavo (pregled javnih strani 21. 11. 2026, P6): anonimni obiskovalec pristajalne
// strani in javnih klicev API ga ne dobi; prijava in registracija ga nastavita skupaj s sejo; zaklep profila na eno napravo
// ostane (test/accounts.test.js »anti-sharing«). Tabela piškotkov v obvestilu o zasebnosti se ujema s kodo.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { DEVICE_COOKIE, DEVICE_MAX_AGE, Devices } from "../server/accounts/devices.js";
import { COOKIE as SESSION_COOKIE } from "../server/accounts/auth.js";
import { BRAND } from "../server/brand.js";

const ADULT = "1985-04-12";

async function withServer(fn) {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  try {
    await fn(`http://127.0.0.1:${server.address().port}`, store);
  } finally {
    server.close();
    store.db.close();
  }
}
const names = (res) => res.headers.getSetCookie().map((c) => c.split("=")[0]);

test("anonimni obisk: brez piškotka naprave (pristajalna stran, /api/account, cene, stanje)", async () => {
  await withServer(async (base) => {
    for (const [path, accept] of [["/", "text/html"], ["/api/account", "application/json"], ["/api/account/prices", "application/json"], ["/api/account/status", "application/json"], ["/api/config", "application/json"], ["/api/students", "application/json"]]) {
      const r = await fetch(base + path, { headers: { accept } });
      assert.deepEqual(names(r), [], `${path}: ${r.headers.getSetCookie().join(" | ")}`);
    }
  });
});

test("registracija in prijava: piškotek naprave (400 dni) skupaj s sejo; z obstoječim piškotkom ostane isti", async () => {
  await withServer(async (base, store) => {
    const reg = await fetch(`${base}/api/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "nova@primer.si", password: "geslo1234", accept_privacy: true, accept_terms: true, birth_date: ADULT }),
    });
    assert.equal(reg.status, 201);
    const set = reg.headers.getSetCookie();
    assert.ok(names(reg).includes(SESSION_COOKIE) && names(reg).includes(DEVICE_COOKIE), set.join(" | "));
    const dev = set.find((c) => c.startsWith(`${DEVICE_COOKIE}=`));
    assert.match(dev, new RegExp(`Max-Age=${DEVICE_MAX_AGE}(;|$)`));
    assert.equal(DEVICE_MAX_AGE, 400 * 86400);
    assert.match(dev, /HttpOnly/);
    const token = dev.split(";")[0].split("=")[1];
    // Naprava je ob registraciji odklenjena za ta račun (accountLocks.unlock z id-jem te naprave).
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM account_unlocks").get().n, 1);

    // Prijava z istim piškotkom naprave: nov piškotek naprave ni potreben.
    const login = await fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json", cookie: `${DEVICE_COOKIE}=${token}` },
      body: JSON.stringify({ email: "nova@primer.si", password: "geslo1234" }),
    });
    assert.equal(login.status, 200);
    assert.ok(names(login).includes(SESSION_COOKIE));
    assert.ok(!names(login).includes(DEVICE_COOKIE));
    // Prijava brez piškotka naprave ga nastavi.
    const login2 = await fetch(`${base}/api/auth/login`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: "nova@primer.si", password: "geslo1234" }) });
    assert.ok(names(login2).includes(DEVICE_COOKIE));
  });
});

test("uporaba brez računa: piškotek naprave skupaj s sejo, tri vzporedne zahteve ostanejo na eni napravi", async () => {
  // Pregled 2, točka 4: brez piškotka naprave ob ustvaritvi gosta bi vsaka vzporedna zahteva s samo sejo dobila svojo
  // napravo, profil pa bi bil po krivem »odprt na drugi napravi«.
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, guest: true, scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const g = await fetch(`${base}/api/auth/guest`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ accept_privacy: true }) });
    assert.equal(g.status, 201);
    assert.ok(names(g).includes(SESSION_COOKIE) && names(g).includes(DEVICE_COOKIE), g.headers.getSetCookie().join(" | "));
    const cookie = g.headers.getSetCookie().map((c) => c.split(";")[0]).join("; ");
    const device = cookie.match(new RegExp(`${DEVICE_COOKIE}=([^;]+)`))[1];
    const all = await Promise.all([1, 2, 3].map(() => fetch(`${base}/api/account`, { headers: { cookie, accept: "application/json" } })));
    for (const r of all) {
      assert.equal(r.status, 200);
      const again = r.headers.getSetCookie().filter((c) => c.startsWith(`${DEVICE_COOKIE}=`));
      assert.deepEqual(again, [], "brez nove naprave");
    }
    const ids = new Set([device, ...all.flatMap((r) => r.headers.getSetCookie().filter((c) => c.startsWith(`${DEVICE_COOKIE}=`)).map((c) => c.split(";")[0].split("=")[1]))]);
    assert.equal(ids.size, 1, "ena naprava");
  } finally {
    server.close();
    store.db.close();
  }
});

test("Devices.attach: s sejo takoj, brez seje šele ob branju req.deviceId (enkrat)", () => {
  const d = new Devices(null);
  const mkRes = () => ({ cookies: [], append(_k, v) { this.cookies.push(v); } });
  const anon = { headers: {} };
  const r1 = mkRes();
  d.attach(anon, r1);
  assert.equal(r1.cookies.length, 0, "brez branja ni piškotka");
  const id = anon.deviceId;
  assert.match(id, /^[a-f0-9]{64}$/);
  assert.equal(anon.deviceId, id, "isti id ob ponovnem branju");
  assert.equal(r1.cookies.length, 1);
  const logged = { headers: {}, parent: { id: 1 } };
  const r2 = mkRes();
  d.attach(logged, r2);
  assert.equal(r2.cookies.length, 1, "s sejo takoj");
  const known = { headers: { cookie: `${DEVICE_COOKIE}=${"a".repeat(32)}` } };
  const r3 = mkRes();
  d.attach(known, r3);
  assert.ok(known.deviceId && r3.cookies.length === 0, "obstoječ piškotek: brez novega");
});

test("zasebnost.html: tabela piškotkov z imeni in roki iz kode, brez žargona, na telefonu po vrsticah", () => {
  const html = readFileSync(new URL("../public/zasebnost.html", import.meta.url), "utf8");
  const table = html.slice(html.indexOf('<h3 id="piskotki">'), html.indexOf("<h2>6. Vaše pravice</h2>"));
  assert.ok(table.includes('<table class="piskotki">'));
  const cell = (th, v) => `<td data-th="${th}">${v}</td>`;
  for (const name of [SESSION_COOKIE, DEVICE_COOKIE, `${BRAND.slug}_age`, `${BRAND.slug}_geslo`]) assert.ok(table.includes(cell("Piškotek", name)), name);
  for (const d of ["400 dni", "24 ur", "1 leto ali do odjave", "1 leto"]) assert.ok(table.includes(cell("Trajanje", d)), d);
  // Pregled 3, S5: seja in naprava tudi pri uporabi brez računa (/api/auth/guest), pravilna beseda »ustvaritvi«.
  assert.equal((table.match(/Ob prijavi, ustvaritvi računa ali uporabi brez računa/g) || []).length, 2);
  assert.doesNotMatch(table, /ustvarjenju|HttpOnly|SameSite/);
  assert.match(table, /ne uporablja Evklida brez računa, ne dobi nobenega piškotka; izjema je evklid_age/);
  assert.match(html, /\.piskotki td::before \{ content: attr\(data-th\)/);
});
