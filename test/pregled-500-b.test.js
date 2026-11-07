// Izvoz podatkov (GDPR čl. 15 in 20) za račun s prijavo z Apple: gesla nima, zato se potrdi z novo prijavo pri Applu.
import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { BUNDLE_ID } from "../server/mobile/store-billing.js";

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

function harness() {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, guest: true, scheduler: false, log: { error() {}, warn() {}, info() {} }, mobile: { appleKeys: [JWK] } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  const client = (device = crypto.randomBytes(24).toString("base64url")) => {
    let session = null;
    return async (path, body) => {
      const res = await fetch(base + path, {
        method: body ? "POST" : "GET",
        headers: { "content-type": "application/json", "x-app-client": "ios/1.0.0", "x-app-device": device, ...(session ? { authorization: `Bearer ${session}` } : {}) },
        body: body ? JSON.stringify(body) : undefined,
      });
      const s = res.headers.get("x-app-session");
      if (s) session = s === "-" ? null : s;
      return { status: res.status, body: await res.json().catch(() => null) };
    };
  };
  return { store, server, client };
}

// P3: Applov identity token velja ~10 min in nonce izbere aplikacija; strežnik si porabljenih ne zapomni. Žeton prijave
// (ali prejšnjega izvoza) zato znova odpre izvoz vseh pogovorov vseh profilov, kolikorkrat hoče, dokler ne poteče.
// Izvoz (in izbris) bi moral zahtevati SVEŽO prijavo: enkraten nonce (zapis sha256 za 15 min) in/ali iat ≤ 5 min.
// PADE na 144e09c1.
test("RE-1 Apple identity token used to sign in cannot be replayed to export; each reauth token works once", async () => {
  const { server, client } = harness();
  try {
    const claims = { sub: "apple.izvoz", email: "apple@primer.si", email_verified: true };
    const signInToken = identityToken(claims);
    const c = client();
    assert.equal((await c("/api/auth/apple", { identity_token: signInToken, nonce: NONCE, accept_privacy: true, birth_date: "1985-04-12" })).status, 201);
    assert.equal((await c("/api/account/export", { apple_identity_token: signInToken, apple_nonce: NONCE })).status, 401, "žeton prijave odpre izvoz");
    const fresh = identityToken({ ...claims, nonce: crypto.createHash("sha256").update("svez-niz-za-izvoz-123").digest("hex") });
    assert.equal((await c("/api/account/export", { apple_identity_token: fresh, apple_nonce: "svez-niz-za-izvoz-123" })).status, 200);
    assert.equal((await c("/api/account/export", { apple_identity_token: fresh, apple_nonce: "svez-niz-za-izvoz-123" })).status, 401, "isti žeton drugič");
  } finally {
    server.close();
  }
});

// Tuj račun: seja računa B z Applovim žetonom računa A ne izvozi ničesar (ne A ne B).
test("RE-2 another account's Apple token opens neither account's export", async () => {
  const { server, client } = harness();
  try {
    const a = client();
    const b = client();
    const ca = { sub: "apple.a", email: "a@primer.si", email_verified: true };
    const cb = { sub: "apple.b", email: "b@primer.si", email_verified: true };
    assert.equal((await a("/api/auth/apple", { identity_token: identityToken(ca), nonce: NONCE, accept_privacy: true, birth_date: "1985-04-12" })).status, 201);
    assert.equal((await b("/api/auth/apple", { identity_token: identityToken(cb), nonce: NONCE, accept_privacy: true, birth_date: "1985-04-12" })).status, 201);
    const r = await b("/api/account/export", { apple_identity_token: identityToken(ca), apple_nonce: NONCE });
    assert.equal(r.status, 401);
    assert.equal(r.body?.parent, undefined);
  } finally {
    server.close();
  }
});

// Gost: has_password false, a izvoz brez gesla dela kot doslej (splet ima zanj ločen pogled).
test("RE-3 guest export still works without password", async () => {
  const { store, server, client } = harness();
  try {
    const g = client();
    const r = await g("/api/auth/guest", { accept_privacy: true });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    assert.equal(r.body.parent.has_password, false);
    assert.equal((await g("/api/account/export", {})).status, 200);
  } finally {
    server.close();
    store.db.close?.();
  }
});
