// Strežnik za mobilno aplikacijo (server/mobile): seja v glavi, prijava z Apple, nakupi App Store in
// Google Play, potisna obvestila, stran /prenesi.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { verifyAppleJws, AppleSignatureError, APPLE_ROOT_G3 } from "../server/mobile/apple-crypto.js";
import { BUNDLE_ID, STORE_PRODUCTS, appleState } from "../server/mobile/store-billing.js";
import { googleSubscriptionState } from "../server/mobile/google-play.js";
import { goalPushText } from "../server/mobile/push.js";
import { fetchApk } from "../server/mobile/download.js";
import { apkVersion, manifestVersion } from "../server/mobile/apk-info.js";
import os from "node:os";
import path from "node:path";

const CHAIN = JSON.parse(fs.readFileSync(new URL("./fixtures/apple-chain.json", import.meta.url), "utf8"));
const ADULT = "1985-04-12";
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");

// JWS, podpisan s testno verigo (enaka oblika kot Applov).
function appleJws(payload, { x5c = CHAIN.x5c, key = CHAIN.leafKey } = {}) {
  const input = `${b64({ alg: "ES256", x5c })}.${b64(payload)}`;
  const sig = crypto.sign("sha256", Buffer.from(input), { key, dsaEncoding: "ieee-p1363" });
  return `${input}.${sig.toString("base64url")}`;
}
const tx = (over = {}) => ({
  bundleId: BUNDLE_ID,
  productId: STORE_PRODUCTS.find((p) => p.seats === 2 && p.interval === "month").id,
  transactionId: "2000000001",
  originalTransactionId: "1000000001",
  expiresDate: Date.now() + 30 * 86400000,
  environment: "Sandbox",
  ...over,
});

// Prijava z Apple: lasten ključ RSA namesto Applovega.
const RSA = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
const JWK = { ...RSA.publicKey.export({ format: "jwk" }), kid: "test-kid", alg: "RS256", use: "sig" };
function identityToken(claims, nonceRaw) {
  const input = `${b64({ alg: "RS256", kid: "test-kid" })}.${b64({
    iss: "https://appleid.apple.com",
    aud: BUNDLE_ID,
    exp: Math.floor(Date.now() / 1000) + 600,
    iat: Math.floor(Date.now() / 1000),
    nonce: crypto.createHash("sha256").update(nonceRaw).digest("hex"),
    ...claims,
  })}`;
  return `${input}.${crypto.sign("RSA-SHA256", Buffer.from(input), RSA.privateKey).toString("base64url")}`;
}
const NONCE = "nakljucni-niz-1234567890";

async function withServer(fn, mobile = {}) {
  const store = openDb(":memory:");
  const play = { enabled: true, subs: new Map(), async subscription(t) { return this.subs.get(t) || null; } };
  const app = createApp(store, {
    accounts: true,
    scheduler: false,
    log: { error() {}, warn() {}, info() {} },
    mobile: { appleJws: { rootFingerprint: CHAIN.rootFingerprint }, appleKeys: [JWK], play, env: { EVKLID_GOOGLE_RTDN_TOKEN: "skrivnost-rtdn", EVKLID_STORE_TEST_PURCHASES: "1" }, ...mobile },
  });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  // Odjemalec kot mobilna aplikacija: brez piškotkov, seja v glavi.
  const appClient = (device = crypto.randomBytes(24).toString("base64url")) => {
    let session = null;
    const call = async (path, opts = {}) => {
      const res = await fetch(base + path, {
        method: opts.method || (opts.body ? "POST" : "GET"),
        headers: {
          "content-type": "application/json",
          "x-app-client": "ios/1.0.0",
          "x-app-device": device,
          ...(session ? { authorization: `Bearer ${session}` } : {}),
        },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
      });
      const s = res.headers.get("x-app-session");
      if (s) session = s === "-" ? null : s;
      const type = res.headers.get("content-type") || "";
      return { status: res.status, headers: res.headers, body: type.includes("json") ? await res.json() : await res.text() };
    };
    call.session = () => session;
    return call;
  };
  const adult = async (c, email = "starsh@primer.si") => {
    const r = await c("/api/auth/register", { body: { email, password: "geslo12345", accept_privacy: true, birth_date: ADULT } });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    store.db.prepare("UPDATE parents SET email_verified_at = datetime('now') WHERE email = ?").run(email);
    return store.db.prepare("SELECT * FROM parents WHERE email = ?").get(email);
  };
  try {
    await fn({ base, store, appClient, adult, play });
  } finally {
    server.close();
  }
}

test("app session travels in headers, never as cookies", async () => {
  await withServer(async ({ appClient, adult }) => {
    const c = appClient();
    await adult(c);
    assert.ok(c.session()?.length >= 20, "seja v glavi X-App-Session");
    const created = await c("/api/students", { body: { name: "Ana", self: true, consent: true } });
    assert.equal(created.status, 201, JSON.stringify(created.body));
    const list = await c("/api/students");
    assert.equal(list.status, 200);
    assert.equal(list.headers.getSetCookie().length, 0, "aplikacija ne dobi piškotkov");
    // Brez seje ni dostopa, tudi s pravo napravo.
    const anon = appClient();
    assert.equal((await anon("/api/students")).status, 401);
    // Odjava počisti sejo.
    await c("/api/auth/logout", { body: {} });
    assert.equal(c.session(), null);
  });
});

test("web inside the app: app session becomes the WebView's cookie, only with app headers and a live session", async () => {
  await withServer(async ({ base, appClient, adult }) => {
    const device = crypto.randomBytes(24).toString("base64url");
    const c = appClient(device);
    await adult(c);
    const session = c.session();
    const open = (to, headers) => fetch(`${base}/api/mobile/web?to=${encodeURIComponent(to)}`, { redirect: "manual", headers });
    const app = { "x-app-client": "android/1.0.0", "x-app-device": device, authorization: `Bearer ${session}` };
    const r = await open("/#path", app);
    assert.equal(r.status, 302);
    assert.equal(r.headers.get("location"), "/#path");
    const cookies = r.headers.getSetCookie();
    assert.ok(cookies.some((x) => x.startsWith(`sm_session=${session};`) && /HttpOnly/.test(x)), JSON.stringify(cookies));
    assert.ok(cookies.some((x) => x.includes(`=${device};`)), "naprava ostane ista");
    assert.equal(r.headers.get("x-app-session"), null);
    // Cilj je vedno na tem strežniku.
    for (const bad of ["//drug.si/x", "/\\drug.si", "https://drug.si", "javascript:alert(1)"]) assert.equal((await open(bad, app)).headers.get("location"), "/", bad);
    // Brez glave aplikacije (navaden brskalnik) ali brez veljavne seje ne gre.
    const plain = await open("/", { authorization: `Bearer ${session}` });
    assert.ok(plain.status >= 400 && !plain.headers.getSetCookie().some((x) => x.includes(session)), String(plain.status));
    assert.equal((await open("/", { ...app, authorization: "Bearer " + "x".repeat(40) })).status, 401);
    await c("/api/auth/logout", { body: {} });
    assert.equal((await open("/", app)).status, 401, "po odjavi seja ne velja več");
  });
});

test("profile open on another device: app gets 409 taken, claim with app headers takes it over", async () => {
  await withServer(async ({ appClient, adult }) => {
    const a = appClient();
    await adult(a);
    const created = await a("/api/students", { body: { name: "Ana", self: true, consent: true } });
    assert.equal(created.status, 201, JSON.stringify(created.body));
    const id = created.body.id;
    assert.equal((await a(`/api/students/${id}`)).status, 200);
    // Isti račun na drugi napravi (aplikacija pošlje POST /claim s telesom {}, kot src/lib/api.ts).
    const b = appClient();
    assert.equal((await b("/api/auth/login", { body: { email: "starsh@primer.si", password: "geslo12345" } })).status, 200);
    const taken = await b(`/api/students/${id}`);
    assert.equal(taken.status, 409);
    assert.equal(taken.body.taken, true);
    assert.equal(taken.body.student_id, id);
    const claim = await b(`/api/students/${id}/claim`, { body: {} });
    assert.equal(claim.status, 200, JSON.stringify(claim.body));
    assert.equal((await b(`/api/students/${id}`)).status, 200);
    // Prva naprava ga zdaj nima več.
    assert.equal((await a(`/api/students/${id}`)).status, 409);
  });
});

test("Apple JWS: test chain verifies, Apple root is pinned, tampering fails", () => {
  const payload = verifyAppleJws(appleJws(tx()), { rootFingerprint: CHAIN.rootFingerprint });
  assert.equal(payload.originalTransactionId, "1000000001");
  // Ista veriga ni Applova: z resničnim korenom zavrnjena.
  assert.throws(() => verifyAppleJws(appleJws(tx())), AppleSignatureError);
  assert.notEqual(APPLE_ROOT_G3, CHAIN.rootFingerprint);
  // Spremenjena vsebina, drugačen ključ ali manjkajoča veriga.
  const [h, , s] = appleJws(tx()).split(".");
  assert.throws(() => verifyAppleJws(`${h}.${b64(tx({ expiresDate: 9e15 }))}.${s}`, { rootFingerprint: CHAIN.rootFingerprint }), AppleSignatureError);
  const other = crypto.generateKeyPairSync("ec", { namedCurve: "P-256" }).privateKey;
  assert.throws(() => verifyAppleJws(appleJws(tx(), { key: other }), { rootFingerprint: CHAIN.rootFingerprint }), AppleSignatureError);
  assert.throws(() => verifyAppleJws(appleJws(tx(), { x5c: CHAIN.x5c.slice(0, 2) }), { rootFingerprint: CHAIN.rootFingerprint }), AppleSignatureError);
  // List brez Applove razširitve za podpis nakupov: veriga, kjer je vmesno potrdilo na mestu lista.
  assert.throws(() => verifyAppleJws(appleJws(tx(), { x5c: [CHAIN.x5c[1], CHAIN.x5c[2], CHAIN.x5c[2]] }), { rootFingerprint: CHAIN.rootFingerprint }), AppleSignatureError);
});

test("App Store purchase gives the plan, other account is refused, refund notification ends it", async () => {
  await withServer(async ({ appClient, adult, store, base }) => {
    const c = appClient();
    const p = await adult(c);
    const info = await c("/api/billing/store");
    assert.equal(info.status, 200);
    assert.match(info.body.account_token, /^[0-9a-f-]{36}$/);
    assert.equal(info.body.products.length, 10, "OŠ, SŠ, faks, Družina, Družina s študentom × mesec/leto (stari »2 otroka« ni v ponudbi)");
    const token = info.body.account_token;

    // Nakup drugega računa (drug appAccountToken) je zavrnjen.
    const foreign = await c("/api/billing/apple", { body: { signed_transaction: appleJws(tx({ appAccountToken: crypto.randomUUID() })) } });
    assert.equal(foreign.status, 409);
    // Napačna aplikacija.
    assert.equal((await c("/api/billing/apple", { body: { signed_transaction: appleJws(tx({ bundleId: "com.drug" })) } })).status, 400);

    const ok = await c("/api/billing/apple", { body: { signed_transaction: appleJws(tx({ appAccountToken: token })) } });
    assert.equal(ok.status, 200, JSON.stringify(ok.body));
    assert.equal(ok.body.account.access.tier, "paid");
    assert.equal(ok.body.account.access.seats, 2);
    let row = store.db.prepare("SELECT sub_provider, sub_id, sub_status, sub_plan FROM parents WHERE id = ?").get(p.id);
    assert.deepEqual({ ...row }, { sub_provider: "apple", sub_id: "apple:1000000001", sub_status: "active", sub_plan: "evklid_2_month" });

    // Isti nakup (»Obnovi nakupe«) z drugim računom: zavrnjen.
    const c2 = appClient();
    await adult(c2, "drugi@primer.si");
    assert.equal((await c2("/api/billing/apple", { body: { signed_transaction: appleJws(tx()) } })).status, 409);

    // Obvestilo App Store o vračilu: naročnina se konča.
    const note = { notificationType: "REFUND", data: { bundleId: BUNDLE_ID, signedTransactionInfo: appleJws(tx({ appAccountToken: token, revocationDate: Date.now() })) } };
    const bad = await fetch(`${base}/webhooks/app-store`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ signedPayload: "a.b.c" }) });
    assert.equal(bad.status, 400);
    const r = await fetch(`${base}/webhooks/app-store`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ signedPayload: appleJws(note) }) });
    assert.equal(r.status, 200);
    row = store.db.prepare("SELECT sub_status FROM parents WHERE id = ?").get(p.id);
    assert.equal(row.sub_status, "canceled");
  });
});

// Testni nakupi so brezplačni (TestFlight, peskovnik): veljajo samo za testne račune.
test("test purchases count only for store testers and admins", async () => {
  await withServer(
    async ({ appClient, adult, play }) => {
      const c = appClient();
      await adult(c);
      const token = (await c("/api/billing/store")).body.account_token;
      const apple = await c("/api/billing/apple", { body: { signed_transaction: appleJws(tx({ appAccountToken: token })) } });
      assert.equal(apple.status, 400);
      assert.equal(apple.body.test_purchase, true);
      play.subs.set("testni-zeton-12345", { testPurchase: {}, lineItems: [{ productId: tx().productId, expiryTime: new Date(Date.now() + 86400000).toISOString() }], subscriptionState: "SUBSCRIPTION_STATE_ACTIVE", externalAccountIdentifiers: { obfuscatedExternalAccountId: token } });
      assert.equal((await c("/api/billing/google", { body: { purchase_token: "testni-zeton-12345" } })).status, 400);

      const t = appClient();
      await adult(t, "tester@primer.si");
      const tToken = (await t("/api/billing/store")).body.account_token;
      const ok = await t("/api/billing/apple", { body: { signed_transaction: appleJws(tx({ appAccountToken: tToken, originalTransactionId: "1000000077" })) } });
      assert.equal(ok.status, 200, JSON.stringify(ok.body));
      assert.equal(ok.body.account.access.tier, "paid");
    },
    { env: { EVKLID_STORE_TESTERS: "tester@primer.si" } },
  );
});

test("store purchase never overwrites a paid Stripe subscription", async () => {
  await withServer(async ({ appClient, adult, store }) => {
    const c = appClient();
    const p = await adult(c);
    store.db.prepare("UPDATE parents SET sub_id = 'sub_stripe', sub_status = 'active', sub_plan = 'evklid_1_month', sub_seats = 1, sub_period_end = ? WHERE id = ?").run(new Date(Date.now() + 86400000 * 20).toISOString(), p.id);
    const r = await c("/api/billing/apple", { body: { signed_transaction: appleJws(tx()) } });
    assert.equal(r.status, 200);
    assert.equal(r.body.conflict, "stripe");
    assert.equal(store.db.prepare("SELECT sub_id FROM parents WHERE id = ?").get(p.id).sub_id, "sub_stripe");
  });
});

test("Google Play purchase is read from Google, billing retry keeps access as past_due", async () => {
  await withServer(async ({ appClient, adult, store, play, base }) => {
    const c = appClient();
    const p = await adult(c);
    const token = (await c("/api/billing/store")).body.account_token;
    const sub = (state, days = 30) => ({
      subscriptionState: state,
      externalAccountIdentifiers: { obfuscatedExternalAccountId: token },
      lineItems: [{ productId: "evklid.year.1", expiryTime: new Date(Date.now() + days * 86400000).toISOString(), autoRenewingPlan: { autoRenewEnabled: true } }],
    });
    play.subs.set("tok-google-1234567890", sub("SUBSCRIPTION_STATE_ACTIVE"));
    assert.equal((await c("/api/billing/google", { body: { purchase_token: "neznan-zeton-123" } })).status, 400);
    const r = await c("/api/billing/google", { body: { purchase_token: "tok-google-1234567890" } });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.equal(r.body.account.access.tier, "paid");
    // RTDN: ob neuspeli obnovi (on hold) past_due; brez pravega žetona v naslovu 403.
    play.subs.set("tok-google-1234567890", sub("SUBSCRIPTION_STATE_ON_HOLD", -1));
    const msg = { message: { data: Buffer.from(JSON.stringify({ packageName: BUNDLE_ID, subscriptionNotification: { purchaseToken: "tok-google-1234567890", notificationType: 5 } })).toString("base64") } };
    const post = (q) => fetch(`${base}/webhooks/google-play${q}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(msg) });
    assert.equal((await post("?token=napacen")).status, 403);
    assert.equal((await post("?token=skrivnost-rtdn")).status, 204);
    const row = store.db.prepare("SELECT sub_status, past_due_since FROM parents WHERE id = ?").get(p.id);
    assert.equal(row.sub_status, "past_due");
    assert.ok(row.past_due_since);
  });
});

// Nadgradnja v Google Play (1 → 2 otroka) da nov žeton z linkedPurchaseToken: nova naročnina zamenja
// staro, obvestilo o izteku stare je pozneje ne povozi.
test("Google Play upgrade replaces the linked subscription and the old one's expiry does not cancel it", async () => {
  await withServer(async ({ appClient, adult, store, play, base }) => {
    const c = appClient();
    const p = await adult(c);
    const token = (await c("/api/billing/store")).body.account_token;
    const sub = (productId, state, extra = {}) => ({
      subscriptionState: state,
      externalAccountIdentifiers: { obfuscatedExternalAccountId: token },
      lineItems: [{ productId, expiryTime: new Date(Date.now() + 30 * 86400000).toISOString(), autoRenewingPlan: { autoRenewEnabled: true } }],
      ...extra,
    });
    play.subs.set("tok-stari-1234567890", sub("evklid.month.1", "SUBSCRIPTION_STATE_ACTIVE"));
    assert.equal((await c("/api/billing/google", { body: { purchase_token: "tok-stari-1234567890" } })).status, 200);
    play.subs.set("tok-novi-12345678901", sub("evklid.month.2", "SUBSCRIPTION_STATE_ACTIVE", { linkedPurchaseToken: "tok-stari-1234567890" }));
    const r = await c("/api/billing/google", { body: { purchase_token: "tok-novi-12345678901" } });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.equal(r.body.conflict, null);
    assert.equal(r.body.account.access.seats, 2);
    // RTDN za stari žeton (potekel) ne prekliče nove naročnine.
    play.subs.set("tok-stari-1234567890", sub("evklid.month.1", "SUBSCRIPTION_STATE_EXPIRED"));
    const msg = { message: { data: Buffer.from(JSON.stringify({ packageName: BUNDLE_ID, subscriptionNotification: { purchaseToken: "tok-stari-1234567890", notificationType: 13 } })).toString("base64") } };
    const res = await fetch(`${base}/webhooks/google-play?token=skrivnost-rtdn`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(msg) });
    assert.equal(res.status, 204);
    const row = store.db.prepare("SELECT sub_id, sub_status, sub_seats FROM parents WHERE id = ?").get(p.id);
    assert.deepEqual({ ...row }, { sub_id: "google:tok-novi-12345678901", sub_status: "active", sub_seats: 2 });
  });
});

test("state mapping: Apple grace/retry and Google canceled-but-paid", () => {
  const past = Date.now() - 1000;
  assert.equal(appleState({ productId: "x", expiresDate: past }).status, "expired");
  assert.equal(appleState({ productId: "x", expiresDate: past }, { isInBillingRetryPeriod: true }).status, "billing_retry");
  assert.equal(appleState({ productId: "x", expiresDate: past }, { gracePeriodExpiresDate: Date.now() + 86400000 }).status, "grace");
  assert.equal(appleState({ productId: "x", expiresDate: Date.now() + 1000 }, { autoRenewStatus: 0 }).willRenew, false);
  const g = googleSubscriptionState({ subscriptionState: "SUBSCRIPTION_STATE_CANCELED", lineItems: [{ productId: "evklid.month.1", expiryTime: new Date(Date.now() + 86400000).toISOString() }] });
  assert.equal(g.status, "active");
  assert.equal(g.willRenew, false);
});

test("Sign in with Apple: new account needs age and consent, then logs in by Apple id; deletion via Apple", async () => {
  await withServer(async ({ appClient, store }) => {
    const c = appClient();
    const token = identityToken({ sub: "apple.001", email: "relay@privaterelay.appleid.com", email_verified: "true" }, NONCE);
    assert.equal((await c("/api/auth/apple", { body: { identity_token: token, nonce: "napacen-niz-1234567890" } })).status, 401);
    // Napačna oblika polj: 400, ne 500.
    assert.equal((await c("/api/auth/apple", { body: { identity_token: token, nonce: { toString: 1 } } })).status, 400);
    const first = await c("/api/auth/apple", { body: { identity_token: token, nonce: NONCE } });
    assert.equal(first.status, 400);
    assert.equal(first.body.need_signup, true);
    const young = await c("/api/auth/apple", { body: { identity_token: token, nonce: NONCE, accept_privacy: true, birth_date: `${new Date().getFullYear() - 10}-01-01` } });
    assert.equal(young.status, 403);
    assert.equal(young.body.under_age, true);
    const made = await c("/api/auth/apple", { body: { identity_token: token, nonce: NONCE, accept_privacy: true, birth_date: ADULT, given_name: "Mojca" } });
    assert.equal(made.status, 201, JSON.stringify(made.body));
    assert.equal(made.body.parent.verified, true);
    assert.ok(c.session());

    // Druga naprava: ista Apple identiteta najde isti račun (brez e-naslova v žetonu).
    const c2 = appClient();
    const again = await c2("/api/auth/apple", { body: { identity_token: identityToken({ sub: "apple.001" }, NONCE), nonce: NONCE } });
    assert.equal(again.status, 200);
    assert.equal(again.body.parent.id, made.body.parent.id);

    // Izbris brez gesla: potrditev z novo prijavo z Apple (tuj sub ne zadošča).
    const wrong = await c2("/api/account", { method: "DELETE", body: { apple_identity_token: identityToken({ sub: "apple.999" }, NONCE), apple_nonce: NONCE } });
    assert.equal(wrong.status, 401);
    const del = await c2("/api/account", { method: "DELETE", body: { apple_identity_token: identityToken({ sub: "apple.001" }, NONCE), apple_nonce: NONCE } });
    assert.equal(del.status, 200);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM parents").get().n, 0);
  });
});

test("Sign in with Apple links an existing account with the same verified e-mail", async () => {
  await withServer(async ({ appClient, adult }) => {
    const c = appClient();
    const p = await adult(c, "jaz@primer.si");
    const r = await appClient()("/api/auth/apple", { body: { identity_token: identityToken({ sub: "apple.777", email: "jaz@primer.si", email_verified: true }, NONCE), nonce: NONCE } });
    assert.equal(r.status, 200);
    assert.equal(r.body.parent.id, p.id);
  });
});

test("push tokens: only Expo tokens, tied to the account", async () => {
  await withServer(async ({ appClient, adult, store }) => {
    const c = appClient();
    const p = await adult(c);
    assert.equal((await c("/api/push/register", { body: { token: "nekaj" } })).status, 400);
    assert.equal((await c("/api/push/register", { body: { token: "ExponentPushToken[abcDEF1234567890]", platform: "ios" } })).status, 200);
    assert.equal(store.db.prepare("SELECT parent_id FROM push_tokens").get().parent_id, p.id);
    assert.equal((await appClient()("/api/push/register", { body: { token: "ExponentPushToken[abcDEF1234567890]" } })).status, 401);
    assert.match(goalPushText({ name: "Ana", settings: { goal: "matura" } }, 3).title, /Matura: še 3 dnevi/);
  });
});

test("download page offers the APK when it exists and works without login", async () => {
  await withServer(
    async ({ base }) => {
      const page = await (await fetch(`${base}/prenesi?lang=en`)).text();
      assert.match(page, /\/prenesi\/evklid\.apk/);
      assert.match(page, /TestFlight/);
      const apk = await fetch(`${base}/prenesi/evklid.apk`);
      assert.equal(apk.status, 200);
      assert.equal(apk.headers.get("content-type"), "application/vnd.android.package-archive");
    },
    { apkFile: fileURLToPath(new URL("./fixtures/apple-chain.json", import.meta.url)), env: { EVKLID_TESTFLIGHT_URL: "https://testflight.apple.com/join/TEST" } },
  );
});

test("calculator page for the app works without login and loads only the calculator modules", async () => {
  await withServer(async ({ base }) => {
    const res = await fetch(`${base}/kalkulator?mode=pse&lang=en&theme=dark`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type"), /text\/html/);
    const page = await res.text();
    assert.match(page, /<script type="module" src="zagon\.js" data-moduli="kalkulator\.js"><\/script>/);
    assert.doesNotMatch(page, /src="app\.js"|<script>/); // brez celotne aplikacije in brez vrinjenih skript (CSP)
    assert.match(res.headers.get("content-security-policy"), /script-src 'self'/);
    for (const f of ["kalkulator.js", "kalkulator-nastavi.js", "graph/sci.js", "graph/calc.js", "graph/tools.js"]) assert.equal((await fetch(`${base}/${f}`)).status, 200, f);
  });
});

// Iz brskalnika v aplikacijo brez ponovne prijave (server/mobile/app-link.js).
test("app link: signed-in phone browser opens the app signed in, with its open profile, once", async () => {
  await withServer(async ({ base, store, appClient }) => {
    const ANDROID = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/130 Mobile Safari/537.36";
    // Brskalnik s piškotki.
    const jar = new Map();
    const web = async (path, { body, ua = ANDROID } = {}) => {
      const res = await fetch(base + path, {
        method: body ? "POST" : "GET",
        headers: { "content-type": "application/json", "user-agent": ua, cookie: [...jar].map(([k, v]) => `${k}=${v}`).join("; ") },
        body: body ? JSON.stringify(body) : undefined,
        redirect: "manual",
      });
      for (const c of res.headers.getSetCookie()) {
        const [kv] = c.split(";");
        const i = kv.indexOf("=");
        if (/Max-Age=0/.test(c)) jar.delete(kv.slice(0, i));
        else jar.set(kv.slice(0, i), kv.slice(i + 1));
      }
      const type = res.headers.get("content-type") || "";
      return { status: res.status, headers: res.headers, body: type.includes("json") ? await res.json() : await res.text() };
    };
    const token = (html) => /intent:\/\/prijava\?t=([A-Za-z0-9_-]+)#Intent;scheme=evklid;package=[^;]+;S\.browser_fallback_url=[^;]+;end/.exec(html)?.[1];

    // Brez prijave: ni povezave; stran, ki jo odpre aplikacija, pove, naj se prijavi v aplikaciji.
    assert.equal(token((await web("/prenesi")).body), undefined);
    assert.match((await web("/prenesi?app=1&lang=sl")).body, /Ta brskalnik ni prijavljen/);

    const reg = await web("/api/auth/register", { body: { email: "brskalnik@primer.si", password: "geslo12345", accept_privacy: true, birth_date: ADULT } });
    assert.equal(reg.status, 201, JSON.stringify(reg.body));
    store.db.prepare("UPDATE parents SET email_verified_at = datetime('now') WHERE email = ?").run("brskalnik@primer.si");
    const ana = await web("/api/students", { body: { name: "Ana", self: true, consent: true } });
    assert.equal(ana.status, 201, JSON.stringify(ana.body));
    // En profil brez gesla profila: povezava v aplikacijo ga vseeno odpre na telefonu.
    const t0 = token((await web("/prenesi?app=1")).body);
    assert.equal((await appClient()("/api/auth/app-link", { body: { token: t0 } })).body.student_id, ana.body.id, "en profil: telefon ga prevzame");
    assert.equal((await web(`/api/students/${ana.body.id}/unlock`, { body: { password: "ana1", set: true } })).status, 200);
    // Drugi profil na računu: šele z njim velja geslo profila (račun z enim profilom ga ne potrebuje).
    const bor = await web("/api/students", { body: { name: "Bor", birth_year: new Date().getFullYear() - 10, consent: true } });
    assert.equal(bor.status, 201, JSON.stringify(bor.body));

    // Računalnik: aplikacije ni, gumba tudi ne.
    assert.equal(token((await web("/prenesi", { ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130" })).body), undefined);
    // iPhone: povezava evklid://
    assert.match((await web("/prenesi", { ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)" })).body, /href="evklid:\/\/prijava\?t=[A-Za-z0-9_-]{20,}"/);

    const page = await web("/prenesi?app=1");
    assert.equal(page.headers.get("cache-control"), "no-store");
    const t = token(page.body);
    assert.ok(t, "povezava v aplikacijo");
    assert.ok(page.body.indexOf('id="app"') < page.body.indexOf("<h2>Android"), "?app=1: povezava na vrhu");

    // Samo aplikacija lahko zamenja žeton.
    const plain = await fetch(`${base}/api/auth/app-link`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token: t }) });
    assert.equal(plain.status, 400);

    // Najprej vpraša, za kateri račun je povezava; žeton ostane neporabljen.
    const phone = appClient();
    const peek = await phone("/api/auth/app-link/check", { body: { token: t } });
    assert.equal(peek.status, 200);
    assert.equal(peek.body.email, "brskalnik@primer.si");
    assert.equal(phone.session(), null, "preverjanje še ne prijavi");
    assert.equal((await phone("/api/auth/app-link/check", { body: { token: "x".repeat(40) } })).status, 400);
    const r = await phone("/api/auth/app-link", { body: { token: t } });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.equal(r.body.parent.email, "brskalnik@primer.si");
    assert.equal(r.body.student_id, ana.body.id);
    assert.ok(phone.session(), "seja za aplikacijo");
    const list = await phone("/api/students");
    assert.ok(!list.body.find((s) => s.id === ana.body.id).locked, "profil odprt brez gesla");
    assert.equal((await phone(`/api/students/${ana.body.id}`)).status, 200);
    // Za primerjavo: navadna prijava na drugem telefonu najde profil zaklenjen.
    const other = appClient();
    assert.equal((await other("/api/auth/login", { body: { email: "brskalnik@primer.si", password: "geslo12345" } })).status, 200);
    assert.equal((await other(`/api/students/${ana.body.id}`)).status, 423);

    // Enkrat.
    assert.equal((await appClient()("/api/auth/app-link", { body: { token: t } })).status, 400);
    // Potekla povezava (brskalnik je še prijavljen).
    const t3 = token((await web("/prenesi")).body);
    store.db.prepare("UPDATE app_links SET expires_at = ? WHERE used_at IS NULL").run(Date.now() - 1000);
    assert.equal((await appClient()("/api/auth/app-link", { body: { token: t3 } })).body.expired, true);
    // Odjava v brskalniku razveljavi neporabljeno povezavo.
    const t2 = token((await web("/prenesi")).body);
    await web("/api/auth/logout", { body: {} });
    const late = await appClient()("/api/auth/app-link", { body: { token: t2 } });
    assert.equal(late.status, 400);
    assert.equal(late.body.expired, true);
  });
});

// j 2026-10-30: »nočem, da se ta zaslon prikazuje« – račun z enim profilom gesla profila ne vidi.
test("profile password only when the account has more than one profile", async () => {
  await withServer(async ({ appClient, adult }) => {
    const c = appClient();
    await adult(c, "en@primer.si");
    const ana = await c("/api/students", { body: { name: "Ana", self: true, consent: true } });
    assert.equal(ana.status, 201);
    // Brez gesla profila: nova naprava po prijavi v račun odpre profil takoj.
    const ipad = appClient();
    assert.equal((await ipad("/api/auth/login", { body: { email: "en@primer.si", password: "geslo12345" } })).status, 200);
    const list = await ipad("/api/students");
    assert.deepEqual([list.body[0].locked, list.body[0].needs_password], [undefined, undefined]);
    assert.equal((await ipad(`/api/students/${ana.body.id}/claim`, { body: {} })).status, 200, "prevzem, ne geslo");
    assert.equal((await ipad(`/api/students/${ana.body.id}`)).status, 200);
    // Z geslom, nastavljenim prej (stari računi), prav tako.
    assert.equal((await ipad(`/api/students/${ana.body.id}/unlock`, { body: { password: "ana1", set: true } })).status, 200);
    const ipad2 = appClient();
    assert.equal((await ipad2("/api/auth/login", { body: { email: "en@primer.si", password: "geslo12345" } })).status, 200);
    assert.ok(!(await ipad2("/api/students")).body[0].locked);
    assert.notEqual((await ipad2(`/api/students/${ana.body.id}`)).status, 423, "ni zaklenjen (409 = odprt na drugi napravi)");
  });
});

test("second profile: existing profiles without a password get theirs in the same step", async () => {
  await withServer(async ({ appClient, adult }) => {
    const c = appClient();
    await adult(c, "dva@primer.si");
    const ana = (await c("/api/students", { body: { name: "Ana", birth_year: new Date().getFullYear() - 12, consent: true } })).body;
    const year = new Date().getFullYear() - 10;
    // Prekratko geslo za obstoječi profil: nič se ne ustvari.
    const bad = await c("/api/students", { body: { name: "Bor", birth_year: year, consent: true, profile_password: "bor1", other_passwords: { [ana.id]: "a" } } });
    assert.equal(bad.status, 400);
    assert.equal((await c("/api/students")).body.length, 1);
    const bor = await c("/api/students", { body: { name: "Bor", birth_year: year, consent: true, profile_password: "bor1", other_passwords: { [ana.id]: "ana1" } } });
    assert.equal(bor.status, 201, JSON.stringify(bor.body));
    // Na tej napravi oba odprta; na novi napravi oba zaklenjena, nobeden »brez gesla«.
    assert.deepEqual((await c("/api/students")).body.map((s) => !!(s.locked || s.needs_password)), [false, false]);
    const other = appClient();
    assert.equal((await other("/api/auth/login", { body: { email: "dva@primer.si", password: "geslo12345" } })).status, 200);
    assert.deepEqual((await other("/api/students")).body.map((s) => [!!s.locked, !!s.needs_password]), [[true, false], [true, false]]);
  });
});

// Gumb »Namesti aplikacijo« v spletni aplikaciji vpraša, kje je prava aplikacija za telefon.
test("app links: APK and TestFlight for the install button", async () => {
  await withServer(
    async ({ base }) => {
      const l = await (await fetch(`${base}/api/app-links`)).json(); // javno kot stran /prenesi
      assert.equal(l.apk, "/prenesi/evklid.apk");
      assert.equal(l.testflight, "https://testflight.apple.com/join/TEST");
      assert.equal(l.play, null);
    },
    { apkFile: fileURLToPath(new URL("./fixtures/apple-chain.json", import.meta.url)), env: { EVKLID_TESTFLIGHT_URL: "https://testflight.apple.com/join/TEST" } },
  );
});

// Skrbnik naloži APK s povezave iz expo.dev; strežnik sledi preusmeritvam samo na znane strežnike.
// Prava gradnja 4 (1.0.0): AndroidManifest.xml iz APK z expo.dev, zapakiran v majhen ZIP.
const MINI_APK = fileURLToPath(new URL("./fixtures/mini.apk", import.meta.url));

test("APK version: versionCode and versionName from the binary manifest", () => {
  assert.deepEqual(apkVersion(MINI_APK), { versionCode: 4, versionName: "1.0.0" });
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "apkv-"));
  try {
    const junk = path.join(dir, "x.apk");
    fs.writeFileSync(junk, Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), Buffer.alloc(100, 7)]));
    assert.equal(apkVersion(junk), null);
    assert.equal(apkVersion(path.join(dir, "missing.apk")), null);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  assert.equal(manifestVersion(Buffer.alloc(4)), null);
  assert.equal(manifestVersion(Buffer.from([3, 0, 8, 0, 0xff, 0xff, 0xff, 0x7f])), null); // pokvarjena dolžina
});

test("admin APK upload: only admins, only known hosts, only ZIP files", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "apk-"));
  const file = path.join(dir, "evklid.apk");
  const zip = Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), Buffer.alloc(2048, 7)]);
  const fake = async (url) => {
    // Prava pot expo.dev (30. 10. 2026): expo.dev → api.expo.dev → wf-artifacts.eascdn.net.
    if (url.startsWith("https://expo.dev/artifacts/eas/")) return new Response(null, { status: 307, headers: { location: url.replace("https://expo.dev/artifacts/eas/", "https://api.expo.dev/v2/artifacts/eas/").replace(/\.apk$/, "") } });
    if (url.startsWith("https://api.expo.dev/v2/artifacts/eas/")) return new Response(null, { status: 307, headers: { location: "https://wf-artifacts.eascdn.net/builds/internal-st/x.apk?sig=1" } });
    if (url === "https://wf-artifacts.eascdn.net/builds/internal-st/x.apk?sig=1") return new Response(zip, { status: 200 });
    if (url === "https://storage.googleapis.com/eas/x.apk") return new Response(zip, { status: 200 });
    if (url === "https://expo.dev/evil") return new Response(null, { status: 302, headers: { location: "http://127.0.0.1:3000/x" } });
    if (url === "https://github.com/not-zip") return new Response("<html>", { status: 200 });
    if (url === "https://github.com/bad-location") return new Response(null, { status: 302, headers: { location: "https://[" } });
    if (url === "https://github.com/down") throw new TypeError("fetch failed");
    if (url === "https://github.com/cut")
      return new Response(new ReadableStream({ start: (c) => (c.enqueue(new Uint8Array(zip)), c.error(new TypeError("terminated"))) }), { status: 200 });
    return new Response(null, { status: 404 });
  };
  try {
    assert.match((await fetchApk("https://example.com/x.apk", file, fake)).error, /expo\.dev/);
    assert.match((await fetchApk("https://expo.dev/evil", file, fake)).error, /expo\.dev/);
    assert.match((await fetchApk("https://github.com/not-zip", file, fake)).error, /APK/);
    // napake omrežja in slaba preusmeritev: sporočilo za skrbnika, brez izjeme in brez začasne datoteke
    assert.equal((await fetchApk("https://github.com/bad-location", file, fake)).error, "Povezava ni veljavna.");
    assert.equal((await fetchApk("https://github.com/down", file, fake)).error, "Prenos ni uspel.");
    assert.equal((await fetchApk("https://github.com/cut", file, fake)).error, "Prenos ni uspel.");
    assert.deepEqual(fs.readdirSync(dir), []);
    assert.equal((await fetchApk("https://expo.dev/artifacts/eas/abc.apk", file, fake)).bytes, zip.length);
    assert.deepEqual(fs.readFileSync(file), zip);
    assert.deepEqual(fs.readdirSync(dir), ["evklid.apk"]); // brez ostankov začasnih datotek

    await withServer(
      async ({ appClient, adult, store }) => {
        const c = appClient();
        await adult(c);
        assert.equal((await c("/api/admin/apk")).status, 403);
        assert.equal((await c("/api/admin/apk", { body: { url: "https://expo.dev/artifacts/eas/abc.apk" } })).status, 403);
        store.db.prepare("UPDATE parents SET is_admin = 1").run();
        const r = await c("/api/admin/apk", { body: { url: "https://expo.dev/artifacts/eas/abc.apk" } });
        assert.equal(r.status, 200, JSON.stringify(r.body));
        assert.equal(r.body.file.bytes, zip.length);
        assert.equal((await c("/api/admin/apk", { body: { url: "https://example.com/x.apk" } })).status, 400);
        assert.equal((await c("/api/app-links")).body.apk, "/prenesi/evklid.apk");
        assert.equal((await c("/api/app-links")).body.apkVersion, null); // lažni APK nima manifesta
        // pravi manifest: aplikacija primerja versionCode s svojo gradnjo
        fs.copyFileSync(MINI_APK, path.join(dir, "server.apk"));
        assert.deepEqual((await c("/api/app-links")).body.apkVersion, { versionCode: 4, versionName: "1.0.0" });
        assert.equal((await c("/api/admin/apk")).body.file.version.versionCode, 4);
      },
      { apkFile: path.join(dir, "server.apk"), fetch: fake },
    );
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

// Aplikacija izriše Markdown in formule z istim public/rich.js kot splet, a brez DOMPurify in s
// formulami v MathML (WebView na telefonu jih izriše brez pisav). Odgovor AI ne sme izpisati HTML.
test("mobilni izris: rich.js z MathML in brez DOMPurify, HTML iz AI je izpisan kot besedilo", async () => {
  const { Marked } = await import("marked");
  const katex = (await import("katex")).default;
  const { createRenderer } = await import("../public/rich.js");
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const mathml = { renderToString: (tex, o) => katex.renderToString(tex, { ...o, output: "mathml" }) };
  const ai = createRenderer({ marked: new Marked({ renderer: { html: ({ text }) => esc(text) } }), katex: mathml, sanitize: (h) => h });
  const html = ai.renderRich("Velja $a^2 + b^2 = c^2$.\n\n<img src=x onerror=alert(1)>");
  assert.match(html, /<math/);
  assert.doesNotMatch(html, /class="katex-html"/);
  assert.doesNotMatch(html, /<img/);
});

// Preverjanje odgovora brez povezave uporablja isti modul kot strežnik.
test("mobilno preverjanje brez povezave: server/practice/check.js deluje brez strežnika", async () => {
  const { checkAnswer } = await import("../server/practice/check.js");
  assert.equal(checkAnswer({ type: "number", value: 2 }, "2").kind, "correct");
  assert.notEqual(checkAnswer({ type: "number", value: 2 }, "3").kind, "correct");
});

// Prevzem pred registracijo: napadalec ustvari račun z žrtvinim e-naslovom (ga ne potrdi) in svojim geslom.
// Ko se žrtev prijavi z Apple (Apple e-naslov potrdi), se račun poveže; napadalčevo geslo in seja ne smeta veljati.
test("Sign in with Apple on an unverified account: the old password and sessions stop working", async () => {
  await withServer(async ({ appClient, store }) => {
    const attacker = appClient();
    const reg = await attacker("/api/auth/register", { body: { email: "zrtev@primer.si", password: "napadalec1", accept_privacy: true, birth_date: ADULT } });
    assert.equal(reg.status, 201, JSON.stringify(reg.body));
    assert.equal((await attacker("/api/account")).status, 200);
    const r = await appClient()("/api/auth/apple", { body: { identity_token: identityToken({ sub: "apple.888", email: "zrtev@primer.si", email_verified: true }, NONCE), nonce: NONCE } });
    assert.equal(r.status, 200);
    assert.equal(r.body.parent.id, reg.body.parent.id);
    assert.notEqual((await attacker("/api/account")).status, 200, "napadalčeva seja še velja");
    const login = await appClient()("/api/auth/login", { body: { email: "zrtev@primer.si", password: "napadalec1" } });
    assert.equal(login.status, 401, "napadalčevo geslo še odpre račun");
    assert.ok(store.db.prepare("SELECT email_verified_at FROM parents WHERE id = ?").get(reg.body.parent.id).email_verified_at);
  });
});

test("Sign in with Apple on a verified account keeps its password", async () => {
  await withServer(async ({ appClient, adult }) => {
    await adult(appClient(), "potrjen@primer.si");
    const r = await appClient()("/api/auth/apple", { body: { identity_token: identityToken({ sub: "apple.999", email: "potrjen@primer.si", email_verified: true }, NONCE), nonce: NONCE } });
    assert.equal(r.status, 200);
    assert.equal((await appClient()("/api/auth/login", { body: { email: "potrjen@primer.si", password: "geslo12345" } })).status, 200);
  });
});
