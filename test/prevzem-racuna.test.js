// Prevzem računa pred registracijo (Sudhodanan & Paverd 2022, OWASP): vsak razred napada ima svoj test.
// Testi iz pregledov #492 A in B; prej odprte luknje (todo) so zdaj zaprte.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { BUNDLE_ID } from "../server/mobile/store-billing.js";

const ADULT = "1985-04-12";
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const RSA = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
const JWK = { ...RSA.publicKey.export({ format: "jwk" }), kid: "test-kid", alg: "RS256", use: "sig" };
const NONCE = "nakljucni-niz-1234567890";
function identityToken(claims) {
  const input = `${b64({ alg: "RS256", kid: "test-kid" })}.${b64({
    iss: "https://appleid.apple.com",
    aud: BUNDLE_ID,
    exp: Math.floor(Date.now() / 1000) + 600,
    iat: Math.floor(Date.now() / 1000),
    nonce: crypto.createHash("sha256").update(NONCE).digest("hex"),
    ...claims,
  })}`;
  return `${input}.${crypto.sign("RSA-SHA256", Buffer.from(input), RSA.privateKey).toString("base64url")}`;
}
const apple = (claims, extra = {}) => ({ body: { identity_token: identityToken(claims), nonce: NONCE, accept_privacy: true, birth_date: ADULT, ...extra } });
const VICTIM = "zrtev@primer.si";

async function withServer(fn) {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, guest: true, scheduler: false, log: { error() {}, warn() {}, info() {} }, mobile: { appleKeys: [JWK] } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  // Mobilni odjemalec (seja v glavi).
  const appClient = (device = crypto.randomBytes(24).toString("base64url")) => {
    let session = null;
    const call = async (path, opts = {}) => {
      const res = await fetch(base + path, {
        method: opts.method || (opts.body ? "POST" : "GET"),
        headers: { "content-type": "application/json", "x-app-client": "ios/1.0.0", "x-app-device": device, ...(session ? { authorization: `Bearer ${session}` } : {}), ...(opts.headers || {}) },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        redirect: "manual",
      });
      const s = res.headers.get("x-app-session");
      if (s) session = s === "-" ? null : s;
      const type = res.headers.get("content-type") || "";
      return { status: res.status, headers: res.headers, body: type.includes("json") ? await res.json() : await res.text() };
    };
    return call;
  };
  // Spletni odjemalec s piškotki (za skupno geslo in povezave iz e-pošte).
  const webClient = (extraHeaders = {}) => {
    const jar = new Map();
    return async (path, opts = {}) => {
      const res = await fetch(base + path, {
        method: opts.method || (opts.body ? "POST" : "GET"),
        headers: { "content-type": "application/json", cookie: [...jar].map(([k, v]) => `${k}=${v}`).join("; "), ...extraHeaders },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        redirect: "manual",
      });
      for (const c of res.headers.getSetCookie()) {
        const [kv] = c.split(";");
        const i = kv.indexOf("=");
        jar.set(kv.slice(0, i), kv.slice(i + 1));
      }
      const type = res.headers.get("content-type") || "";
      return { status: res.status, headers: res.headers, body: type.includes("json") ? await res.json() : await res.text() };
    };
  };
  const register = (c, email = VICTIM, password = "napadalec1", extra = {}) =>
    c("/api/auth/register", { body: { email, password, accept_privacy: true, birth_date: ADULT, ...extra } });
  try {
    await fn({ base, store, db: store.db, appClient, webClient, register });
  } finally {
    server.close();
  }
}

// 1. Classic-federated merge: napadalec ustvari račun z žrtvinim naslovom, žrtev se prijavi z Apple.
test("1 classic-federated merge: attacker password, session, reset and verify tokens die on Apple link", async () => {
  await withServer(async ({ appClient, register, db }) => {
    const attacker = appClient();
    const reg = await register(attacker);
    assert.equal(reg.status, 201);
    await appClient()("/api/auth/forgot", { body: { email: VICTIM } }); // žeton gre žrtvi, a naj ga Apple vseeno izbriše
    const r = await appClient()("/api/auth/apple", apple({ sub: "apple.v", email: VICTIM, email_verified: "true" }));
    assert.equal(r.status, 200);
    assert.equal(r.body.parent.id, reg.body.parent.id);
    assert.equal((await attacker("/api/account")).status, 401);
    assert.equal((await appClient()("/api/auth/login", { body: { email: VICTIM, password: "napadalec1" } })).status, 401);
    const row = db.prepare("SELECT reset_token_hash, verify_token_hash, email_verified_at FROM parents WHERE id = ?").get(reg.body.parent.id);
    assert.equal(row.reset_token_hash, null);
    assert.equal(row.verify_token_hash, null);
    assert.ok(row.email_verified_at);
  });
});

// 1b. Isto prek nadgradnje gosta (gost → račun z žrtvinim naslovom).
test("1b guest upgrade to the victim's address, then Apple: attacker locked out", async () => {
  await withServer(async ({ appClient }) => {
    const attacker = appClient();
    assert.equal((await attacker("/api/auth/guest", { body: { accept_privacy: true } })).status, 201);
    const up = await attacker("/api/auth/upgrade", { body: { email: VICTIM, password: "napadalec1", accept_privacy: true, birth_date: ADULT } });
    assert.equal(up.status, 200, JSON.stringify(up.body));
    assert.equal((await appClient()("/api/auth/apple", apple({ sub: "apple.v", email: VICTIM, email_verified: true }))).status, 200);
    assert.equal((await attacker("/api/account")).status, 401);
    assert.equal((await appClient()("/api/auth/login", { body: { email: VICTIM, password: "napadalec1" } })).status, 401);
  });
});

// 2. Unexpired session: žrtev prevzame račun s ponastavitvijo gesla; napadalčeva seja mora umreti.
test("2 unexpired session: password reset by the victim ends the attacker's session", async () => {
  await withServer(async ({ appClient, register }) => {
    const attacker = appClient();
    await register(attacker);
    const f = await appClient()("/api/auth/forgot", { body: { email: VICTIM } });
    const token = new URL(f.body.dev_reset_url).searchParams.get("reset");
    assert.equal((await appClient()("/api/auth/reset", { body: { token, password: "zrtvino-geslo" } })).status, 200);
    assert.equal((await attacker("/api/account")).status, 401);
  });
});

// 3. Classic merge prek potrditvene povezave: žrtev klikne nezahtevano »Potrdite e-naslov« (naslov je zdaj
// potrjen, geslo pa je napadalčevo), nato se prijavi z Apple. #492 gleda samo email_verified_at.
test("3 victim clicks the unsolicited verify link, then Sign in with Apple: attacker must not keep access", async () => {
  await withServer(async ({ appClient, register, webClient }) => {
    const attacker = appClient();
    const reg = await register(attacker);
    const victimWeb = webClient();
    const v = await victimWeb(new URL(reg.body.dev_verify_url).pathname + new URL(reg.body.dev_verify_url).search);
    assert.equal(v.status, 302);
    // Brez seje GET ne spremeni ničesar; žrtev na strani izbere »Tega računa nisem ustvaril«.
    assert.match(String(v.headers.get("location")), /\?verify=/);
    const token = new URL(reg.body.dev_verify_url).searchParams.get("token");
    assert.equal((await victimWeb("/api/auth/verify", { body: { token, not_mine: true } })).status, 200);
    assert.equal((await appClient()("/api/auth/apple", apple({ sub: "apple.v", email: VICTIM, email_verified: true }))).status, 200);
    assert.equal((await attacker("/api/account")).status, 401, "napadalčeva seja še velja na računu, ki ga zdaj uporablja žrtev");
    assert.equal((await appClient()("/api/auth/login", { body: { email: VICTIM, password: "napadalec1" } })).status, 401, "napadalčevo geslo še odpre račun");
  });
});

// 4a. Trojan: razred z učiteljskim ključem, ki ga je napadalec ustvaril pred prevzemom, ostane žrtvi;
// napadalec s kodo in ključem bere pregled razreda (podatke učencev) brez seje.
test("4a trojan class: teacher key the attacker got before the takeover must stop working", async () => {
  await withServer(async ({ appClient, register }) => {
    const attacker = appClient();
    await register(attacker);
    const cls = await attacker("/api/classes", { body: { name: "8.b" } });
    assert.equal(cls.status, 201, JSON.stringify(cls.body));
    const victim = appClient();
    assert.equal((await victim("/api/auth/apple", apple({ sub: "apple.v", email: VICTIM, email_verified: true }))).status, 200);
    const mine = await victim("/api/teacher/classes");
    assert.ok(JSON.stringify(mine.body).includes("8.b"), "razred je zdaj žrtvin");
    // Napadalec s svojim drugim (lastnim) računom in ključem, ki ga je dobil pred prevzemom.
    const spyAcc = appClient();
    assert.equal((await register(spyAcc, "napadalec@primer.si")).status, 201);
    const spy = await spyAcc(`/api/teacher/classes/${encodeURIComponent(cls.body.code)}/overview`, { headers: { "x-teacher-key": cls.body.teacherKey } });
    assert.notEqual(spy.status, 200, "napadalčev ključ še odpre pregled žrtvinega razreda");
  });
});

// 4b. Trojan: napadalčev žeton potisnih obvestil ostane na računu; žrtvini otroci (ime) gredo na njegov telefon.
test("4b trojan push token: attacker's device must not keep getting the account's push notifications", async () => {
  await withServer(async ({ appClient, register, db }) => {
    const attacker = appClient();
    const reg = await register(attacker);
    assert.equal((await attacker("/api/push/register", { body: { token: "ExponentPushToken[napadalec123456]", platform: "ios" } })).status, 200);
    assert.equal((await appClient()("/api/auth/apple", apple({ sub: "apple.v", email: VICTIM, email_verified: true }))).status, 200);
    const n = db.prepare("SELECT COUNT(*) AS n FROM push_tokens WHERE parent_id = ?").get(reg.body.parent.id).n;
    assert.equal(n, 0, "napadalčev žeton obvestil je še na žrtvinem računu");
  });
});

// 4c. Trojan: šola (pridružitev s kodo) zahteva potrjen e-naslov, napadalec je pred prevzemom ne more vezati.
test("4c trojan school membership: unverified account cannot join or create a school", async () => {
  await withServer(async ({ appClient, register }) => {
    const attacker = appClient();
    await register(attacker);
    assert.equal((await attacker("/api/schools", { body: { name: "OŠ Napad" } })).status >= 400, true);
    assert.equal((await attacker("/api/schools/join", { body: { code: "ABCD-EFGH" } })).status >= 400, true);
  });
});

// 5. Unexpired email change: e-naslova ni mogoče zamenjati (PUT /api/account ga prezre).
test("5 unexpired email change: there is no email change path", async () => {
  await withServer(async ({ appClient, register, db }) => {
    const attacker = appClient();
    const reg = await register(attacker, "napadalec@primer.si");
    const r = await attacker("/api/account", { method: "PUT", body: { email: VICTIM, new_email: VICTIM } });
    assert.equal(r.status, 200);
    assert.equal(db.prepare("SELECT email FROM parents WHERE id = ?").get(reg.body.parent.id).email, "napadalec@primer.si");
  });
});

// 6a. Non-verifying IdP: Apple brez email_verified ne poveže obstoječega računa in ne vrne 500.
test("6a Apple token with email_verified=false never links an existing account (and no 5xx)", async () => {
  await withServer(async ({ appClient, register }) => {
    const owner = appClient();
    const reg = await register(owner, VICTIM, "lastnik12345");
    const r = await appClient()("/api/auth/apple", apple({ sub: "apple.x", email: VICTIM, email_verified: "false" }, { accept_privacy: true, birth_date: ADULT }));
    assert.notEqual(r.body?.parent?.id, reg.body.parent.id, "nepotrjen Applov naslov je odprl tuj račun");
    assert.ok(r.status < 500, `strežnik vrne ${r.status}`);
  });
});

// 6b. Non-verifying IdP: z Applovim nepotrjenim naslovom računa sploh ne ustvarimo (pregled #492 B P2-1).
test("6b Apple token with email_verified=false creates no account", async () => {
  await withServer(async ({ appClient, db }) => {
    const r = await appClient()("/api/auth/apple", apple({ sub: "apple.y", email: "nepotrjen@primer.si", email_verified: "false" }, { accept_privacy: true, birth_date: ADULT }));
    assert.equal(r.status, 400, JSON.stringify(r.body));
    assert.equal(r.body.no_email, true);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM parents WHERE email = ?").get("nepotrjen@primer.si").n, 0);
  });
});

// 8. Varnostna mreža: že potrjen račun ohrani geslo (ni regresije za prave uporabnike).
test("8 verified account keeps its password after Apple link", async () => {
  await withServer(async ({ appClient, register, db }) => {
    await register(appClient(), VICTIM, "lastnik12345");
    db.prepare("UPDATE parents SET email_verified_at = datetime('now') WHERE email = ?").run(VICTIM);
    assert.equal((await appClient()("/api/auth/apple", apple({ sub: "apple.v", email: VICTIM, email_verified: true }))).status, 200);
    assert.equal((await appClient()("/api/auth/login", { body: { email: VICTIM, password: "lastnik12345" } })).status, 200);
  });
});

// Pregled #492 A: nepotrjen račun pri povezavi z Apple je nov račun (soglasje, starost, brez tujčevega priporočitelja).
test("unverified account linked by Apple needs the owner's consent and age; the attacker's referrer is dropped", async () => {
  await withServer(async ({ appClient, register, db }) => {
    const refAcc = appClient();
    const ref = await register(refAcc, "napadalec@primer.si");
    const code = db.prepare("SELECT referral_code FROM parents WHERE id = ?").get(ref.body.parent.id).referral_code;
    const reg = await register(appClient(), VICTIM, "napadalec1", { referral_code: code, birth_date: "1970-01-01" });
    assert.equal(reg.status, 201);
    const bare = await appClient()("/api/auth/apple", { body: { identity_token: identityToken({ sub: "apple.v", email: VICTIM, email_verified: true }), nonce: NONCE } });
    assert.equal(bare.status, 400);
    assert.equal(bare.body.need_signup, true);
    const r = await appClient()("/api/auth/apple", apple({ sub: "apple.v", email: VICTIM, email_verified: true }));
    assert.equal(r.status, 200, JSON.stringify(r.body));
    const row = db.prepare("SELECT referred_by, birth_date FROM parents WHERE id = ?").get(reg.body.parent.id);
    assert.equal(row.referred_by, null);
    assert.match(String(row.birth_date), /^1985-04-12/);
  });
});

// Pregled #492 A: ponastavitev gesla izbriše žetone potisnih obvestil starih naprav.
test("password reset drops push tokens", async () => {
  await withServer(async ({ appClient, register, db }) => {
    const attacker = appClient();
    const reg = await register(attacker);
    assert.equal((await attacker("/api/push/register", { body: { token: "ExponentPushToken[napadalec0987654321]", platform: "ios" } })).status, 200);
    const f = await appClient()("/api/auth/forgot", { body: { email: VICTIM } });
    const token = new URL(f.body.dev_reset_url).searchParams.get("reset");
    assert.equal((await appClient()("/api/auth/reset", { body: { token, password: "lastnik12345" } })).status, 200);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM push_tokens WHERE parent_id = ?").get(reg.body.parent.id).n, 0);
  });
});

// Potrditev iz tuje seje: nastavitev novega gesla, staro geslo in seje ne veljajo; potrditev v isti seji ohrani geslo.
test("verify link: without the account session GET changes nothing and not_mine leads to a new password; own session keeps it", async () => {
  await withServer(async ({ webClient, register }) => {
    const own = webClient();
    const reg = await register(own, "lastna@primer.si", "lastnik12345");
    const u = new URL(reg.body.dev_verify_url);
    const v = await own(u.pathname + u.search);
    assert.equal(v.headers.get("location"), "/?verified=1");
    assert.equal((await webClient()("/api/auth/login", { body: { email: "lastna@primer.si", password: "lastnik12345" } })).status, 200);

    const attacker = webClient();
    const reg2 = await register(attacker);
    const u2 = new URL(reg2.body.dev_verify_url);
    const victim = webClient();
    const v2 = await victim(u2.pathname + u2.search);
    assert.equal(v2.headers.get("location"), `/?verify=${u2.searchParams.get("token")}`);
    assert.equal((await attacker("/api/account")).status, 200, "GET brez seje ne spremeni ničesar");
    const nm = await victim("/api/auth/verify", { body: { token: u2.searchParams.get("token"), not_mine: true } });
    assert.equal((await attacker("/api/account")).status, 401);
    assert.equal((await webClient()("/api/auth/login", { body: { email: VICTIM, password: "napadalec1" } })).status, 401);
    const token = nm.body.reset;
    assert.equal((await webClient()("/api/auth/reset", { body: { token, password: "zrtvino-geslo" } })).status, 200);
  });
});
