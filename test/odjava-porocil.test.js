// Odjava od tedenskih poročil (pregled javnih strani 21. 11. 2026, P7): GET pokaže oblikovano stran z gumbom in NE odjavi
// (pregledovalniki pošte povezave odpirajo sami); POST z žetonom odjavi (gumb ali odjava z enim klikom po RFC 8058);
// Mailer pošlje Resendu glavi List-Unsubscribe in List-Unsubscribe-Post.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { Mailer } from "../server/accounts/email.js";

async function withServer(fn) {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, scheduler: false, log: { error() {}, warn() {}, info() {} } });
  const server = app.listen(0);
  const db = store.db;
  db.prepare("INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code, email_verified_at) VALUES ('s@primer.si', 'x', 'v', 'odjava-zeton-123', 'R1', '2026-01-01')").run();
  const weekly = () => db.prepare("SELECT weekly_email FROM parents WHERE email = 's@primer.si'").get().weekly_email;
  try {
    await fn(`http://127.0.0.1:${server.address().port}`, weekly, db);
  } finally {
    server.close();
    db.close();
  }
}

test("GET: stran s potrditvijo (POST gumb), brez odjave; oblikovana kot stran 404, noindex, brez predpomnjenja", async () => {
  await withServer(async (base, weekly) => {
    assert.equal(weekly(), 1);
    const r = await fetch(`${base}/api/account/unsubscribe?token=odjava-zeton-123`);
    assert.equal(r.status, 200);
    assert.match(r.headers.get("content-type"), /text\/html/);
    assert.equal(r.headers.get("cache-control"), "no-store");
    assert.equal(r.headers.get("referrer-policy"), "no-referrer");
    const html = await r.text();
    assert.match(html, /<form method="post" action="\/api\/account\/unsubscribe\?token=odjava-zeton-123">/);
    assert.match(html, /<button class="btn" type="submit">Odjavi me<\/button>/);
    assert.match(html, /prefers-color-scheme:dark/, "temni način kot stran 404");
    assert.match(html, /<meta name="robots" content="noindex">/);
    assert.equal(weekly(), 1, "odpiranje povezave ne odjavi");
  });
});

test("POST z gumba (žeton v obrazcu) in odjava z enim klikom (RFC 8058) odjavita; ponovni GET pove, da je odjava že narejena", async () => {
  await withServer(async (base, weekly, db) => {
    const form = await fetch(`${base}/api/account/unsubscribe`, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: "token=odjava-zeton-123" });
    assert.equal(form.status, 200);
    assert.match(await form.text(), /Odjava je uspela/);
    assert.equal(weekly(), 0);
    assert.match(await (await fetch(`${base}/api/account/unsubscribe?token=odjava-zeton-123`)).text(), /Tedenskih poročil ne boste več prejemali/);
    db.prepare("UPDATE parents SET weekly_email = 1").run();
    const one = await fetch(`${base}/api/account/unsubscribe?token=odjava-zeton-123`, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: "List-Unsubscribe=One-Click" });
    assert.equal(one.status, 200);
    assert.equal(weekly(), 0);
  });
});

test("neveljaven ali manjkajoč žeton: 404 z razlago, nič se ne spremeni", async () => {
  await withServer(async (base, weekly) => {
    for (const [method, url] of [["GET", "/api/account/unsubscribe?token=napacen"], ["GET", "/api/account/unsubscribe"], ["POST", "/api/account/unsubscribe?token=napacen"], ["POST", "/api/account/unsubscribe?token=%3Cscript%3E"]]) {
      const r = await fetch(base + url, { method, headers: { "content-type": "application/x-www-form-urlencoded" }, body: method === "POST" ? "List-Unsubscribe=One-Click" : undefined });
      assert.equal(r.status, 404, `${method} ${url}`);
      const html = await r.text();
      assert.match(html, /Povezava ni veljavna/);
      assert.doesNotMatch(html, /<script>/);
    }
    assert.equal(weekly(), 1);
  });
});

test("Mailer: dodatne glave gredo Resendu, brez njih telo ostane kot prej", async () => {
  const bodies = [];
  const mailer = new Mailer({ apiKey: "re_x", fetchFn: async (_u, init) => (bodies.push(JSON.parse(init.body)), { ok: true, json: async () => ({ id: "e1" }) }) });
  const headers = { "List-Unsubscribe": "<https://evklid.app/api/account/unsubscribe?token=a>", "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" };
  await mailer.send({ to: "a@b.si", subject: "s", html: "<p>h</p>", text: "t", headers });
  await mailer.send({ to: "a@b.si", subject: "s", html: "<p>h</p>", text: "t" });
  assert.deepEqual(bodies[0].headers, headers);
  assert.ok(!("headers" in bodies[1]));
});
