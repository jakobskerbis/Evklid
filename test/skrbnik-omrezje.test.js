// Točka 1.4: skrbniška pot /api/admin/omrezje pokaže req.ip in X-Forwarded-For (preverjanje števila posrednikov
// na Renderju); neskrbnik je zavrnjen, vrednost trust proxy ostane 1.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

test("1.4: /api/admin/omrezje shows req.ip and X-Forwarded-For to the admin only", async () => {
  const store = openDb(":memory:");
  const calls = [];
  const fetchFn = async (url, init = {}) => {
    calls.push({ host: new URL(url).host, body: init.body ? JSON.parse(init.body) : null });
    return { ok: true, status: 200, json: async () => ({ id: "x" }), text: async () => "{}" };
  };
  const app = createApp(store, { accounts: true, scheduler: false, resendKey: "re_x", fetchFn, log: { error() {} } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  let cookie = "";
  const call = async (path, opts = {}) => {
    const res = await fetch(base + path, {
      method: opts.method || "GET",
      redirect: "manual",
      headers: { "Content-Type": "application/json", cookie, ...(opts.headers || {}) },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    for (const c of res.headers.getSetCookie()) cookie = [cookie, c.split(";")[0]].filter(Boolean).join("; ");
    return { status: res.status, body: (res.headers.get("content-type") || "").includes("json") ? await res.json() : null };
  };
  try {
    assert.equal((await call("/api/admin/omrezje")).status, 401);
    await call("/api/auth/register", { method: "POST", body: { email: "skrbnik@primer.si", password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" } });
    const mail = calls.filter((c) => c.host === "api.resend.com").at(-1);
    await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(mail.body.text)[0]);
    assert.equal((await call("/api/admin/omrezje")).status, 403);

    store.db.prepare("UPDATE parents SET is_admin = 1 WHERE email = 'skrbnik@primer.si'").run();
    const r = await call("/api/admin/omrezje", { headers: { "X-Forwarded-For": "203.0.113.7, 198.51.100.2" } });
    assert.equal(r.status, 200);
    assert.equal(r.body.trust_proxy, 1);
    assert.equal(r.body.x_forwarded_for, "203.0.113.7, 198.51.100.2");
    assert.equal(r.body.skokov_v_x_forwarded_for, 2);
    assert.equal(r.body.ip, "198.51.100.2"); // trust proxy 1: zadnji naslov pred našim posrednikom
    assert.match(r.body.neposredni_naslov, /127\.0\.0\.1/);
  } finally {
    server.close();
  }
});
