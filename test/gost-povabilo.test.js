// Povabilo brez e-naslova (j, 2026-11-07): uporaba brez računa samo z lastnikovo povezavo /?gost=<žeton>.
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";

const YEAR = new Date().getFullYear();
const ADULT = "1985-04-12";
const OWNER = "lastnik@evklid.test";

async function withServer(fn) {
  process.env.EVKLID_ADMIN_EMAILS = OWNER;
  const store = openDb(":memory:");
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    resendKey: "",
    log: { error() {} },
    fetchFn: async () => ({ ok: true, status: 200, json: async () => ({}) }),
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = (ip) => {
    const jar = {};
    return async (path, opts = {}) => {
      const res = await fetch(base + path, {
        method: opts.method || "GET",
        redirect: "manual",
        headers: {
          "Content-Type": "application/json",
          cookie: Object.entries(jar).map(([k, v]) => `${k}=${v}`).join("; "),
          ...(ip ? { "X-Forwarded-For": ip } : {}),
        },
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
  };
  try {
    await fn({ client, store });
  } finally {
    server.close();
    delete process.env.EVKLID_ADMIN_EMAILS;
  }
}

// Brez Resenda strežnik e-pošto izpiše v dnevnik. Za naslove skrbnikov (#477) dev_verify_url ni vrnjen,
// zato povezavo za potrditev preberemo iz izpisane e-pošte.
async function verified(call, email) {
  const seen = [];
  const orig = process.stdout.write.bind(process.stdout);
  process.stdout.write = (chunk, ...rest) => { seen.push(String(chunk)); return orig(chunk, ...rest); };
  let r;
  try {
    r = await call("/api/auth/register", { method: "POST", body: { email, password: "geslo1234", accept_privacy: true, birth_date: ADULT } });
    for (let i = 0; i < 20 && !r.body.dev_verify_url && !/api\/auth\/verify\?token=/.test(seen.join("")); i++) await new Promise((ok) => setTimeout(ok, 25));
  } finally {
    process.stdout.write = orig;
  }
  assert.equal(r.status, 201, JSON.stringify(r.body));
  const link = r.body.dev_verify_url || seen.join("\n").match(/https?:\/\/\S+\/api\/auth\/verify\?token=[\w-]+/)?.[0];
  assert.ok(link, "povezava za potrditev ni najdena");
  const v = await call(new URL(link).pathname + new URL(link).search);
  assert.equal(v.status, 302);
}

const tokenOf = (url) => new URL(url).searchParams.get("gost");
const join = (call, invite) => call("/api/auth/guest", { method: "POST", body: { accept_privacy: true, invite } });

test("povabilo: lastnik ustvari povezavo, z njo nastane gost (brezplačni paket, brez e-naslova)", async () => {
  await withServer(async ({ client, store }) => {
    const owner = client();
    await verified(owner, OWNER);
    assert.equal((await owner("/api/account")).body.guest_invite, true);
    const inv = await owner("/api/admin/guest-invite", { method: "POST" });
    assert.equal(inv.status, 201);
    assert.equal(inv.body.max_uses, 10);
    const days = (Date.parse(inv.body.expires_at) - Date.now()) / 86400000;
    assert.ok(days > 13.9 && days <= 14);
    const token = tokenOf(inv.body.url);
    assert.ok(Buffer.from(token, "base64url").length >= 16); // ≥ 128 bitov
    // V bazi je samo zgoščena vrednost.
    const row = store.db.prepare("SELECT * FROM guest_invites").get();
    assert.notEqual(row.token_hash, token);
    assert.ok(!JSON.stringify(row).includes(token));

    const g = client("10.0.0.1");
    assert.equal((await join(g, token)).status, 201);
    const st = (await g("/api/account/status")).body;
    assert.equal(st.parent.guest, true);
    assert.equal(st.parent.email, null);
    assert.equal(st.guest_mode, true);
    const kid = await g("/api/students", { method: "POST", body: { name: "Gost", birth_year: YEAR - 12, consent: true } });
    assert.equal(kid.status, 201, JSON.stringify(kid.body));
    const acc = (await g("/api/account")).body;
    assert.equal(acc.access.tier, "free");
    assert.equal(acc.guest_invite, undefined);
    assert.equal(store.db.prepare("SELECT used FROM guest_invites").get().used, 1);
    // Gost ne more ustvariti povabila.
    assert.equal((await g("/api/admin/guest-invite", { method: "POST" })).status, 403);
    // Pot do pravega računa ostane (isti profil, e-naslov se šele potrdi).
    const up = await g("/api/auth/upgrade", { method: "POST", body: { email: "prijatelj@evklid.test", password: "geslo1234", accept_privacy: true, birth_date: ADULT } });
    assert.equal(up.status, 200, JSON.stringify(up.body));
    assert.equal(up.body.parent.guest, false);
  });
});

test("povabilo: napačen, potekel in porabljen žeton ne odpre uporabe brez računa", async () => {
  await withServer(async ({ client, store }) => {
    const owner = client();
    await verified(owner, OWNER);
    const token = tokenOf((await owner("/api/admin/guest-invite", { method: "POST" })).body.url);

    for (const bad of [undefined, "", "x".repeat(43), token.slice(0, -2) + "AA", { $ne: 1 }]) {
      const r = await join(client("10.0.1.1"), bad);
      assert.equal(r.status, 404, String(bad));
      assert.equal(r.body.invite_invalid, true);
    }

    // Porabljen: 10 gostov (vsak z drugega omrežja), enajsti ne.
    for (let i = 0; i < 10; i++) assert.equal((await join(client(`10.1.${i}.1`), token)).status, 201);
    assert.equal((await join(client("10.2.0.1"), token)).status, 404);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM parents WHERE is_guest = 1").get().n, 10);

    // Potekel.
    const t2 = tokenOf((await owner("/api/admin/guest-invite", { method: "POST" })).body.url);
    store.db.prepare("UPDATE guest_invites SET expires_at = ? WHERE used = 0").run(new Date(Date.now() - 1000).toISOString());
    assert.equal((await join(client("10.3.0.1"), t2)).status, 404);
  });
});

test("povabilo: kvota novih gostov na omrežje velja tudi s povabilom in ne porabi mest", async () => {
  await withServer(async ({ client, store }) => {
    const owner = client();
    await verified(owner, OWNER);
    const token = tokenOf((await owner("/api/admin/guest-invite", { method: "POST" })).body.url);
    for (let i = 0; i < 5; i++) assert.equal((await join(client("10.9.9.9"), token)).status, 201);
    const r = await join(client("10.9.9.9"), token);
    assert.equal(r.status, 429);
    assert.equal(store.db.prepare("SELECT used FROM guest_invites").get().used, 5);
  });
});

test("povabilo: ustvari ga lahko samo lastnik s potrjenim e-naslovom", async () => {
  await withServer(async ({ client }) => {
    assert.equal((await client()("/api/admin/guest-invite", { method: "POST" })).status, 401);
    const other = client();
    await verified(other, "drugi@evklid.test");
    assert.equal((await other("/api/admin/guest-invite", { method: "POST" })).status, 403);
    assert.equal((await other("/api/account")).body.guest_invite, undefined);
    // Lastnikov e-naslov brez potrditve ne zadošča.
    const unverified = client();
    const r = await unverified("/api/auth/register", { method: "POST", body: { email: OWNER, password: "geslo1234", accept_privacy: true, birth_date: ADULT } });
    assert.equal(r.status, 201);
    assert.equal((await unverified("/api/admin/guest-invite", { method: "POST" })).status, 403);
  });
});

test("povabilo: brez žetona je vse kot prej (uporaba brez računa izklopljena)", async () => {
  await withServer(async ({ client, store }) => {
    const a = client();
    assert.equal((await a("/api/account/status")).body.guest_mode, false);
    assert.equal((await a("/api/auth/guest", { method: "POST", body: { accept_privacy: true } })).status, 404);
    // Star gost (brez povabila) ostane izklopljen: lahko samo ustvari račun.
    const owner = client();
    await verified(owner, OWNER);
    const g = client("10.5.0.1");
    assert.equal((await join(g, tokenOf((await owner("/api/admin/guest-invite", { method: "POST" })).body.url))).status, 201);
    store.db.prepare("UPDATE parents SET guest_invite_id = NULL WHERE is_guest = 1").run();
    const off = await g("/api/account");
    assert.equal(off.status, 401);
    assert.equal(off.body.guest_off, true);
    assert.equal((await g("/api/account/status")).body.guest_mode, false);
  });
});
