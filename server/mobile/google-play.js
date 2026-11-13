// Google Play Developer API: stanje naročnine iz žetona nakupa (purchases.subscriptionsv2).
// Prijava s servisnim računom (JSON ključ iz Google Cloud, povezan v Play Console → Uporabniki in dovoljenja).
import crypto from "node:crypto";
import fs from "node:fs";

const SCOPE = "https://www.googleapis.com/auth/androidpublisher";

// Ključ servisnega računa: EVKLID_GOOGLE_PLAY_KEY = pot do JSON datoteke ali sam JSON.
export function loadServiceAccount(value) {
  if (!value) return null;
  try {
    const text = value.trim().startsWith("{") ? value : fs.readFileSync(value, "utf8");
    const key = JSON.parse(text);
    return key.client_email && key.private_key ? key : null;
  } catch {
    return null;
  }
}

export class GooglePlay {
  constructor({ serviceAccount, packageName, fetchFn = fetch }) {
    this.sa = serviceAccount;
    this.packageName = packageName;
    this.fetch = fetchFn;
    this.token = { value: null, until: 0 };
  }
  get enabled() {
    return !!(this.sa && this.packageName);
  }

  async accessToken() {
    if (this.token.value && Date.now() < this.token.until - 60000) return this.token.value;
    const enc = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
    const iat = Math.floor(Date.now() / 1000);
    const input = `${enc({ alg: "RS256", typ: "JWT" })}.${enc({ iss: this.sa.client_email, scope: SCOPE, aud: this.sa.token_uri || "https://oauth2.googleapis.com/token", iat, exp: iat + 3600 })}`;
    const sig = crypto.sign("RSA-SHA256", Buffer.from(input), this.sa.private_key).toString("base64url");
    const r = await this.fetch(this.sa.token_uri || "https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${input}.${sig}` }),
      signal: AbortSignal.timeout(10000),
    });
    const out = await r.json().catch(() => ({}));
    if (!r.ok || !out.access_token) throw new Error(`Google OAuth: ${out.error || r.status}`);
    this.token = { value: out.access_token, until: Date.now() + (out.expires_in || 3600) * 1000 };
    return this.token.value;
  }

  // https://developers.google.com/android-publisher/api-ref/rest/v3/purchases.subscriptionsv2/get
  async subscription(purchaseToken) {
    const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(this.packageName)}/purchases/subscriptionsv2/tokens/${encodeURIComponent(purchaseToken)}`;
    const r = await this.fetch(url, { headers: { authorization: `Bearer ${await this.accessToken()}` }, signal: AbortSignal.timeout(10000) });
    const out = await r.json().catch(() => ({}));
    if (r.status === 404 || r.status === 410) return null;
    if (!r.ok) throw new Error(`Google Play: ${out.error?.message || r.status}`);
    return out;
  }
}

// Stanje iz Google Play → enotna oblika (glej store-billing.js).
export function googleSubscriptionState(sub) {
  const item = (sub.lineItems || []).slice().sort((a, b) => Date.parse(b.expiryTime || 0) - Date.parse(a.expiryTime || 0))[0] || {};
  const map = {
    SUBSCRIPTION_STATE_ACTIVE: "active",
    SUBSCRIPTION_STATE_IN_GRACE_PERIOD: "grace",
    SUBSCRIPTION_STATE_ON_HOLD: "billing_retry",
    SUBSCRIPTION_STATE_PAUSED: "expired",
    SUBSCRIPTION_STATE_CANCELED: "active", // preklicana, a plačana do konca obdobja
    SUBSCRIPTION_STATE_EXPIRED: "expired",
    SUBSCRIPTION_STATE_PENDING: "pending",
  };
  let status = map[sub.subscriptionState] || "expired";
  if (status === "active" && item.expiryTime && Date.parse(item.expiryTime) < Date.now()) status = "expired";
  return {
    productId: item.productId || null,
    expiresAt: item.expiryTime ? new Date(item.expiryTime).toISOString() : null,
    status,
    willRenew: sub.subscriptionState === "SUBSCRIPTION_STATE_ACTIVE" && item.autoRenewingPlan?.autoRenewEnabled !== false,
    accountToken: sub.externalAccountIdentifiers?.obfuscatedExternalAccountId || null,
    linkedToken: sub.linkedPurchaseToken || null, // prejšnji žeton ob nadgradnji (npr. 1 → 2 otroka)
    environment: sub.testPurchase ? "Sandbox" : "Production",
  };
}
