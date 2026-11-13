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
function identityToken(claims, nonceRaw = NONCE) {
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

test("Apple-only account: export with a fresh Apple sign-in, not without; has_password tells the web", async () => {
  const store = openDb(":memory:");
  const app = createApp(store, { accounts: true, scheduler: false, log: { error() {}, warn() {}, info() {} }, mobile: { appleKeys: [JWK] } });
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  let session = null;
  const call = async (path, body) => {
    const res = await fetch(base + path, {
      method: body ? "POST" : "GET",
      headers: { "content-type": "application/json", "x-app-client": "ios/1.0.0", "x-app-device": "naprava-izvoz-apple-1234567890", ...(session ? { authorization: `Bearer ${session}` } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const s = res.headers.get("x-app-session");
    if (s) session = s === "-" ? null : s;
    return { status: res.status, body: await res.json().catch(() => null) };
  };
  try {
    const claims = { sub: "apple.izvoz", email: "apple@primer.si", email_verified: true };
    const r = await call("/api/auth/apple", { identity_token: identityToken(claims), nonce: NONCE, accept_privacy: true, birth_date: "1985-04-12" });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    assert.equal(r.body.parent.has_password, false);
    assert.equal((await call("/api/account/export", { password: "karkoli123" })).status, 401);
    const N2 = "drugi-svez-niz-1234567";
    const other = await call("/api/account/export", { apple_identity_token: identityToken({ ...claims, sub: "apple.drug" }, N2), apple_nonce: N2 });
    assert.equal(other.status, 401, "tuj Apple ID ne odpre izvoza");
    const N3 = "tretji-svez-niz-1234567";
    const old = await call("/api/account/export", { apple_identity_token: identityToken({ ...claims, iat: Math.floor(Date.now() / 1000) - 600 }, N3), apple_nonce: N3 });
    assert.equal(old.status, 401, "žeton, starejši od 5 minut");
    const N4 = "cetrti-svez-niz-1234567";
    const ok = await call("/api/account/export", { apple_identity_token: identityToken(claims, N4), apple_nonce: N4 });
    assert.equal(ok.status, 200, JSON.stringify(ok.body));
    assert.equal(ok.body.parent.email, "apple@primer.si");
    assert.equal(ok.body.parent.password_hash, undefined);
  } finally {
    server.close();
  }
});
