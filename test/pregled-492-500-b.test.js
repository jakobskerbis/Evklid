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
        headers: { "content-type": "application/json", cookie: [...jar].map(([k, v]) => `${k}=${v}`).join("; "), ...extraHeaders, ...(opts.headers || {}) },
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


// ---- Pregled #492/#500 B (tretji pregledovalec) ----

// Pregledovalniki povezav: HEAD (in GET brez seje) ne smeta ničesar spremeniti.
test("RB-1 HEAD on the verify link (link scanner, prefetch) changes nothing", async () => {
  await withServer(async ({ webClient, register, db }) => {
    const attacker = webClient();
    const reg = await register(attacker);
    const u = new URL(reg.body.dev_verify_url);
    const before = db.prepare("SELECT password_hash, verify_token_hash, email_verified_at FROM parents WHERE id = ?").get(reg.body.parent.id);
    for (const method of ["HEAD", "GET"]) {
      const r = await webClient()(u.pathname + u.search, { method });
      assert.equal(r.status, 302);
      assert.match(r.headers.get("location"), /^\/\?verify=/);
    }
    const after = db.prepare("SELECT password_hash, verify_token_hash, email_verified_at FROM parents WHERE id = ?").get(reg.body.parent.id);
    assert.deepEqual(after, before);
    assert.equal((await attacker("/api/account")).status, 200);
  });
});

// Povezavo odpre brskalnik, v katerem je prijavljen DRUG račun (sorojenec, drug starš): ne potrdi.
test("RB-2 GET verify link with another account's session does not confirm", async () => {
  await withServer(async ({ webClient, register, db }) => {
    const attacker = webClient();
    const reg = await register(attacker);
    const other = webClient();
    assert.equal((await register(other, "drug@primer.si", "drugo-geslo1")).status, 201);
    const u = new URL(reg.body.dev_verify_url);
    const r = await other(u.pathname + u.search);
    assert.match(r.headers.get("location"), /^\/\?verify=/);
    assert.equal(db.prepare("SELECT email_verified_at FROM parents WHERE id = ?").get(reg.body.parent.id).email_verified_at, null);
  });
});

// P2: povezava za potrditev nima roka in je po #492 enaka povezavi za novo geslo (not_mine vrne žeton za ponastavitev
// v odgovoru). Kdor jo najde v zgodovini brskalnika (/api/auth/verify?token=… in /?verify=…), v e-pošti, ki je bila
// posredovana, ali v dnevniku pregledovalnika povezav, prevzame račun lastnika, ki ga je ustvaril sam in še ni potrdil.
// Pričakovano: not_mine zaščiti račun (geslo, seje), novo geslo pa pošlje na e-naslov (ali žeton poteče).
// PADE na 81d17919.
test("RB-3 a leaked verify link must not hand out a password reset token inline", async () => {
  await withServer(async ({ webClient, register }) => {
    const owner = webClient();
    const reg = await register(owner, "lastnik@primer.si", "lastnikovo-geslo");
    const token = new URL(reg.body.dev_verify_url).searchParams.get("token");
    const finder = webClient(); // npr. zgodovina na skupnem računalniku
    const nm = await finder("/api/auth/verify", { body: { token, not_mine: true } });
    assert.equal(nm.status, 200);
    assert.equal(nm.body.reset, undefined, "najditelj povezave dobi žeton za novo geslo in prevzame račun");
  });
});

// P3: meja neuspelih prijav z Apple (30 / 15 min na omrežje) šteje tudi poljubne smeti brez podpisa. En učenec v šolskem
// omrežju (NAT, ena IPv4) s 30 zahtevami zaklene prijavo z Apple za vse na tem omrežju; računi samo z Apple se sploh ne
// morejo prijaviti. Pričakovano: veljaven Applov podpis gre skozi (meja naj varuje samo prenos ključev / neveljavne).
// PADE na 81d17919.
test("RB-4 junk Apple requests from a shared school IP must not block a valid Apple sign-in", async () => {
  await withServer(async ({ appClient }) => {
    const school = { "x-forwarded-for": "193.2.1.66" };
    const kid = appClient();
    for (let i = 0; i < 31; i++) await kid("/api/auth/apple", { body: { identity_token: "x", nonce: "kratek" }, headers: school });
    const teacher = appClient();
    const r = await teacher("/api/auth/apple", { ...apple({ sub: "apple.ucitelj", email: "ucitelj@sola.si", email_verified: true }), headers: school });
    assert.equal(r.status, 201, JSON.stringify(r.body));
  });
});

// P3 (obstaja že na main, #492 se dotika iste vrstice): povezava nepotrjenega nekdanjega gosta z Apple nastavi
// email_verified_at mimo confirmEmail: guest_net ostane, 7-dnevnega preizkusa ni, poraba gosta se ne zapiše za omrežje.
// PADE na 81d17919.
test("RB-5 Apple link of an unverified former guest confirms like the verify link (trial, guest_net)", async () => {
  await withServer(async ({ appClient, db }) => {
    const g = appClient();
    assert.equal((await g("/api/auth/guest", { body: { accept_privacy: true } })).status, 201);
    const up = await g("/api/auth/upgrade", { body: { email: "gost@primer.si", password: "gostovo-geslo", accept_privacy: true, birth_date: ADULT } });
    assert.equal(up.status, 200, JSON.stringify(up.body));
    const r = await appClient()("/api/auth/apple", apple({ sub: "apple.gost", email: "gost@primer.si", email_verified: true }));
    assert.equal(r.status, 200, JSON.stringify(r.body));
    const row = db.prepare("SELECT guest_net, trial_ends_at, email_verified_at FROM parents WHERE id = ?").get(up.body.parent.id);
    assert.ok(row.email_verified_at);
    assert.equal(row.guest_net, null, "guest_net ostane");
    assert.ok(row.trial_ends_at, "ni preizkusa");
  });
});

// Geslo prek strani za potrditev: brez žetona ni orakla; z napačnim žetonom vedno 400, tudi s pravim geslom.
test("RB-6 verify POST without a valid token is no password oracle", async () => {
  await withServer(async ({ webClient, register }) => {
    await register(webClient(), "o@primer.si", "pravo-geslo-1");
    const c = webClient();
    const a = await c("/api/auth/verify", { body: { token: "x".repeat(43), password: "pravo-geslo-1" } });
    const b = await c("/api/auth/verify", { body: { token: "x".repeat(43), password: "napacno" } });
    assert.equal(a.status, 400);
    assert.deepEqual(a.body, b.body);
  });
});

// DoS lastnika: napadalec s sejo nepotrjenega računa izčrpa mejo računa (acct<id>) z izvozom; lastnik z ukradenim naslovom
// mora še vedno imeti izhod »nisem ustvaril«.
test("RB-7 attacker exhausting the account-wide limit cannot stop not_mine", async () => {
  await withServer(async ({ webClient, register }) => {
    const attacker = webClient();
    const reg = await register(attacker);
    for (let i = 0; i < 31; i++) await attacker("/api/account/export", { body: { password: "x" }, headers: { "x-forwarded-for": `10.0.${i}.1` } });
    const token = new URL(reg.body.dev_verify_url).searchParams.get("token");
    const victim = webClient();
    assert.equal((await victim("/api/auth/verify", { body: { token, password: "ugibam" } })).status, 429);
    const nm = await victim("/api/auth/verify", { body: { token, not_mine: true } });
    assert.equal(nm.status, 200);
    assert.equal((await attacker("/api/account")).status, 401);
  });
});
