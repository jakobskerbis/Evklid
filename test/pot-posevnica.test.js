// Točka 1.1: poševnica na koncu poti ne obide preverjanj pred potmi (dnevna meja vprašanj inštruktorju).
// Express pot /api/conversations/:id/messages/ ujema kot pot brez poševnice, vmesnik računov pa je mejo
// preverjal z /\/messages$/ nad req.path, zato je bilo s poševnico vprašanj neomejeno (do meje v $).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const YEAR = new Date().getFullYear();

async function withServer(fn) {
  const store = openDb(":memory:");
  const calls = [];
  const fetchFn = async (url, init = {}) => {
    const u = new URL(url);
    calls.push({ host: u.host, path: u.pathname, body: init.body ? JSON.parse(init.body) : null });
    return { ok: true, status: 200, json: async () => ({ id: "x" }), text: async () => "{}" };
  };
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    resendKey: "re_x",
    fetchFn,
    log: { error() {} },
    streamFn: async ({ onText }) => {
      onText("ok");
      return { text: 'ok\n<<META subject=MAT topic="-" error=0 mode=A flag=none>>', stopReason: "end_turn" };
    },
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const jar = {};
  const call = async (path, opts = {}) => {
    const res = await fetch(base + path, {
      method: opts.method || "GET",
      redirect: "manual",
      headers: { "Content-Type": "application/json", cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
    for (const c of res.headers.getSetCookie()) {
      const [kv] = c.split(";");
      const i = kv.indexOf("=");
      jar[kv.slice(0, i)] = kv.slice(i + 1);
    }
    const type = res.headers.get("content-type") || "";
    return { status: res.status, body: type.includes("json") ? await res.json() : await res.text() };
  };
  try {
    await fn({ call, calls, store, base, jar });
  } finally {
    server.close();
  }
}

test("1.1: poševnica na koncu poti ne obide dnevne meje vprašanj", async () => {
  process.env.EVKLID_FREE_DAILY_QUESTIONS = "2";
  try {
    await withServer(async ({ call, calls, store, base, jar }) => {
      const reg = await call("/api/auth/register", { method: "POST", body: { email: "posevnica@primer.si", password: "geslo1234", accept_privacy: true, birth_date: "1985-04-12" } });
      assert.equal(reg.status, 201);
      const mail = calls.filter((c) => c.host === "api.resend.com").at(-1);
      await call(/\/api\/auth\/verify\?token=[\w-]+/.exec(mail.body.text)[0]);
      const kid = (await call("/api/students", { method: "POST", body: { name: "Lan", birth_year: YEAR - 10, consent: true } })).body;
      store.db.prepare("UPDATE parents SET trial_ends_at = '2020-01-01T00:00:00Z'").run(); // brezplačni paket
      const conv = (await call(`/api/students/${kid.id}/conversations`, { method: "POST" })).body;
      const ask = (suffix, t, prefix = "/api") => call(`${prefix}/conversations/${conv.id}/messages${suffix}`, { method: "POST", body: { text: t } });

      // Pot s poševnico deluje kot prej in šteje v mejo.
      assert.equal((await ask("/", "prvo")).status, 200);
      assert.equal((await ask("", "drugo")).status, 200);
      for (const prefix of ["/api", "/API", "/Api"]) {
        for (const suffix of ["", "/", "//", "/?x=1"]) {
          const r = await ask(suffix, "tretje", prefix);
          assert.equal(r.status, 429, `${prefix}…/messages${suffix}`);
          assert.equal(r.body.code, "block.freeDaily", `${prefix}…/messages${suffix}`);
        }
      }
      // Odgovor API z velikimi črkami v predponi tudi ne gre v predpomnilnik.
      const res = await fetch(`${base}/API/conversations/${conv.id}`, { headers: { cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; ") } });
      assert.equal(res.headers.get("cache-control"), "no-store");
      const n = store.db.prepare("SELECT COUNT(*) AS n FROM messages WHERE conversation_id = ? AND role = 'user'").get(conv.id).n;
      assert.equal(n, 2);
    });
  } finally {
    delete process.env.EVKLID_FREE_DAILY_QUESTIONS;
  }
});
