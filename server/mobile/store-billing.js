// Naročnine iz App Store (StoreKit 2) in Google Play (Play Billing) za mobilno aplikacijo.
// Apple in Google zahtevata, da se digitalna naročnina v aplikaciji iz trgovine kupi pri njiju;
// strežnik nakup preveri sam (podpis Apple, API Google Play) in ga zapiše v iste stolpce kot Stripe
// (parents.sub_*), zato pravice (plans.js accessFor) delujejo enako. sub_provider pove, od kod je naročnina;
// sub_id je "apple:<originalTransactionId>" ali "google:<žeton>", da se ne zamenja s Stripom.
import crypto from "node:crypto";
import express from "express";
import { BRAND } from "../brand.js";
import { PLANS, LEGACY_PLANS, storeAmount } from "../accounts/plans.js";
import { verifyAppleJws, AppleSignatureError } from "./apple-crypto.js";
import { GooglePlay, googleSubscriptionState, loadServiceAccount } from "./google-play.js";

// Besedilo iz zahteve; drugačna vrednost (predmet, število) šteje kot prazna, da ni napake 500.
const text = (v) => (typeof v === "string" ? v : "");
const PAID = new Set(["active", "trialing", "past_due"]);
const APP = BRAND.app || {};
export const BUNDLE_ID = process.env.EVKLID_APPLE_BUNDLE_ID || APP.bundle_id;
export const ANDROID_PACKAGE = process.env.EVKLID_ANDROID_PACKAGE || APP.bundle_id;

// Izdelki v obeh trgovinah: <predpona>.<month|year>.<paket>; paket je del ključa v plans.js
// (<slug>_<paket>_<obdobje>): »1« OŠ (stari izdelek, ista cena), »ss«, »faks«, »druzina«, »druzina_student«.
// Stari izdelek ».2« (2 otroka) ni več v ponudbi, obstoječe naročnine iz trgovine pa veljajo naprej.
const STORE_PLAN = (p) => p.key.slice(`${BRAND.slug}_`.length, -`_${p.interval}`.length);
export const STORE_PRODUCTS = [...PLANS, ...LEGACY_PLANS].map((p) => ({
  id: `${APP.product_prefix}.${p.interval}.${STORE_PLAN(p)}`,
  seats: p.seats,
  interval: p.interval,
  plan: p.key,
  level: p.level,
  family: !!p.family,
  legacy: !!p.legacy,
}));
export const productById = (id) => STORE_PRODUCTS.find((p) => p.id === id) || null;

// Osnovne cene v trgovinah (EUR z DDV), vpišejo se v App Store Connect in Google Play Console; drugim državam
// jih trgovini preračunata sami. j 2026-11-01: vsak paket 2 € dražji kot na spletu (plans.js storeAmount),
// splet je privzet. V aplikaciji iz trgovine ne smemo omeniti, da je na spletu ceneje (pravila Apple in Google).
export const STORE_PRICES_EUR = Object.fromEntries(
  ["month", "year"].map((interval) => [interval, Object.fromEntries(PLANS.filter((p) => p.interval === interval).map((p) => [STORE_PLAN(p), storeAmount(p) / 100]))]),
);

export function migrateStoreBilling(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS store_subscriptions (
      provider TEXT NOT NULL,                 -- apple | google
      original_id TEXT NOT NULL,              -- Apple originalTransactionId, Google purchaseToken
      parent_id INTEGER REFERENCES parents(id) ON DELETE SET NULL,
      product_id TEXT NOT NULL,
      status TEXT NOT NULL,                   -- active | grace | billing_retry | expired | pending | replaced
      expires_at TEXT,
      will_renew INTEGER NOT NULL DEFAULT 1,
      environment TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (provider, original_id)
    );
    CREATE INDEX IF NOT EXISTS idx_store_subs_parent ON store_subscriptions(parent_id);
  `);
  const cols = db.prepare("PRAGMA table_info(parents)").all().map((c) => c.name);
  if (!cols.includes("sub_provider")) db.exec("ALTER TABLE parents ADD COLUMN sub_provider TEXT"); // stripe | apple | google
  if (!cols.includes("past_due_since")) db.exec("ALTER TABLE parents ADD COLUMN past_due_since TEXT"); // tudi nit plačil (7 dni milosti)
  if (!cols.includes("store_account_token")) db.exec("ALTER TABLE parents ADD COLUMN store_account_token TEXT"); // UUID za appAccountToken / obfuscatedAccountId
}

// Apple: stanje iz podpisane transakcije (in neobvezno podatkov o obnovi).
export function appleState(tx, renewal = null, now = Date.now()) {
  let status = "active";
  if (tx.revocationDate) status = "expired"; // vračilo ali preklic
  else if (tx.expiresDate && tx.expiresDate < now) status = "expired";
  if (renewal?.gracePeriodExpiresDate && renewal.gracePeriodExpiresDate > now && status === "expired") status = "grace";
  else if (renewal?.isInBillingRetryPeriod && status === "expired") status = "billing_retry";
  const expires = Math.max(tx.expiresDate || 0, status === "grace" ? renewal.gracePeriodExpiresDate || 0 : 0);
  return {
    productId: tx.productId,
    expiresAt: expires ? new Date(expires).toISOString() : null,
    status,
    willRenew: renewal ? renewal.autoRenewStatus === 1 : true,
    accountToken: tx.appAccountToken || null,
    environment: tx.environment || null,
  };
}

export function mountStoreBilling(app, ctx, opts = {}) {
  const { db, getParent, accountView } = ctx;
  const env = opts.env || process.env;
  const log = opts.log || console;
  migrateStoreBilling(db);
  const json = express.json({ limit: "64kb" });
  const appleOpts = opts.appleJws || {};
  // Testni nakupi (Applov peskovnik, TestFlight, Googlovi licenčni testerji) so brezplačni, zato veljajo
  // samo za skrbnike in račune v EVKLID_STORE_TESTERS (npr. demo račun za pregled pri Applu in Googlu),
  // ali za vse, dokler je EVKLID_STORE_TEST_PURCHASES=1 (samo med pregledom aplikacije).
  const testers = String(env.EVKLID_STORE_TESTERS || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  const testOk = (p) =>
    env.EVKLID_STORE_TEST_PURCHASES === "1" || !!p.is_admin || (!!p.email_verified_at && testers.includes(String(p.email || "").toLowerCase()));
  const TEST_REFUSED = "Testni nakup velja samo za testne račune.";
  const play = opts.play || new GooglePlay({ serviceAccount: loadServiceAccount(env.EVKLID_GOOGLE_PLAY_KEY), packageName: ANDROID_PACKAGE, fetchFn: opts.fetchFn });

  const accountToken = (p) => {
    if (p.store_account_token) return p.store_account_token;
    const t = crypto.randomUUID();
    db.prepare("UPDATE parents SET store_account_token = ? WHERE id = ?").run(t, p.id);
    return t;
  };
  const parentByToken = (t) => (t ? db.prepare("SELECT * FROM parents WHERE store_account_token = ?").get(String(t).toLowerCase()) : null);
  const row = (provider, id) => db.prepare("SELECT * FROM store_subscriptions WHERE provider = ? AND original_id = ?").get(provider, id);

  // Zapiše stanje naročnine iz trgovine in posodobi naročnino starša.
  // Vrne { ok } ali { conflict } (naročnina pripada drugemu računu ali starš že plačuje prek Stripa).
  // replaces: prejšnji žeton Google ob nadgradnji ali menjavi paketa (linkedPurchaseToken); ta naročnina ni »druga«.
  function apply(provider, originalId, state, parentId, replaces = null) {
    const product = productById(state.productId);
    if (!product) return { error: "Neznan izdelek." };
    const existing = row(provider, originalId);
    if (existing?.parent_id && parentId && existing.parent_id !== parentId) return { conflict: "other_account" };
    const pid = parentId || existing?.parent_id || null;
    db.prepare(
      `INSERT INTO store_subscriptions (provider, original_id, parent_id, product_id, status, expires_at, will_renew, environment, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
       ON CONFLICT(provider, original_id) DO UPDATE SET parent_id = excluded.parent_id, product_id = excluded.product_id, status = excluded.status,
         expires_at = excluded.expires_at, will_renew = excluded.will_renew, environment = excluded.environment, updated_at = excluded.updated_at`,
    ).run(provider, originalId, pid, product.id, state.status, state.expiresAt, state.willRenew === false ? 0 : 1, state.environment);
    if (!pid) return { ok: true, unlinked: true };
    const p = getParent(pid);
    if (!p) return { ok: true, unlinked: true };
    const subId = `${provider}:${originalId}`;
    const replaced = replaces && p.sub_id === `${provider}:${replaces}`;
    const paidElsewhere = p.sub_id && p.sub_id !== subId && !replaced && PAID.has(p.sub_status) && (!p.sub_period_end || Date.parse(p.sub_period_end) > Date.now());
    // Starš že ima drugo plačano naročnino (Stripe ali druga trgovina): te ne povozimo, nakup samo zapišemo.
    if (paidElsewhere) return { ok: true, conflict: p.sub_provider && p.sub_provider !== "stripe" ? "other_store" : "stripe" };
    if (state.status === "pending") return { ok: true };
    const status = state.status === "active" || state.status === "grace" ? "active" : state.status === "billing_retry" ? "past_due" : "canceled";
    db.prepare(
      `UPDATE parents SET sub_provider = ?, sub_id = ?, sub_status = ?, sub_plan = ?, sub_seats = ?, sub_period_end = ?, sub_cancel_at_period_end = ?,
         past_due_since = CASE WHEN ? = 'past_due' THEN COALESCE(past_due_since, datetime('now')) ELSE NULL END WHERE id = ?`,
    ).run(provider, subId, status, product.plan, product.seats, state.expiresAt, state.willRenew === false ? 1 : 0, status, pid);
    return { ok: true };
  }

  // --- za aplikacijo ---
  app.get("/api/billing/store", (req, res) => {
    const p = req.parent;
    res.json({
      account_token: accountToken(p),
      // Ponudba: stopnje in družinska paketa (stari izdelek »2 otroka« samo za obstoječe naročnine).
      products: STORE_PRODUCTS.filter((p) => !p.legacy).map(({ id, seats, interval, level, family }) => ({ id, seats, interval, level, family })),
      provider: p.sub_provider || (p.sub_id ? "stripe" : null),
      apple: true,
      google: play.enabled,
    });
  });

  // StoreKit 2: aplikacija pošlje jwsRepresentation transakcije (ob nakupu in ob »Obnovi nakupe«).
  app.post("/api/billing/apple", json, (req, res) => {
    const p = req.parent;
    if (p.is_guest) return res.status(403).json({ error: "Najprej ustvari račun." });
    let tx;
    try {
      tx = verifyAppleJws(req.body?.signed_transaction, appleOpts);
    } catch (err) {
      if (err instanceof AppleSignatureError) return res.status(400).json({ error: "Nakupa ni bilo mogoče preveriti." });
      throw err;
    }
    if (tx.bundleId !== BUNDLE_ID) return res.status(400).json({ error: "Nakup ni iz te aplikacije." });
    if (tx.environment === "Sandbox" && !testOk(p)) return res.status(400).json({ error: TEST_REFUSED, test_purchase: true });
    if (tx.appAccountToken && tx.appAccountToken.toLowerCase() !== accountToken(p)) return res.status(409).json({ error: "Ta nakup pripada drugemu računu Evklid.", other_account: true });
    const out = apply("apple", String(tx.originalTransactionId), appleState(tx), p.id);
    if (out.error) return res.status(400).json({ error: out.error });
    if (out.conflict === "other_account") return res.status(409).json({ error: "Ta nakup pripada drugemu računu Evklid.", other_account: true });
    res.json({ ok: true, conflict: out.conflict || null, account: accountView(req, getParent(p.id)) });
  });

  // Play Billing: aplikacija pošlje purchaseToken; stanje preberemo pri Googlu (nikoli ne verjamemo aplikaciji).
  app.post("/api/billing/google", json, async (req, res) => {
    const p = req.parent;
    if (p.is_guest) return res.status(403).json({ error: "Najprej ustvari račun." });
    if (!play.enabled) return res.status(503).json({ error: "Plačila prek Google Play še niso nastavljena." });
    const token = text(req.body?.purchase_token);
    if (!/^[A-Za-z0-9._:-]{10,4096}$/.test(token)) return res.status(400).json({ error: "Napačen žeton nakupa." });
    let sub;
    try {
      sub = await play.subscription(token);
    } catch (err) {
      log.error?.("[evklid] Google Play:", err.message);
      return res.status(502).json({ error: "Google Play se ne odziva. Poskusi znova čez nekaj minut." });
    }
    if (!sub) return res.status(400).json({ error: "Nakupa ni bilo mogoče preveriti." });
    const state = googleSubscriptionState(sub);
    if (state.environment === "Sandbox" && !testOk(p)) return res.status(400).json({ error: TEST_REFUSED, test_purchase: true });
    if (state.accountToken && state.accountToken.toLowerCase() !== accountToken(p)) return res.status(409).json({ error: "Ta nakup pripada drugemu računu Evklid.", other_account: true });
    if (state.linkedToken) db.prepare("UPDATE store_subscriptions SET status = 'replaced' WHERE provider = 'google' AND original_id = ?").run(state.linkedToken);
    const out = apply("google", token, state, p.id, state.linkedToken);
    if (out.error) return res.status(400).json({ error: out.error });
    if (out.conflict === "other_account") return res.status(409).json({ error: "Ta nakup pripada drugemu računu Evklid.", other_account: true });
    res.json({ ok: true, conflict: out.conflict || null, account: accountView(req, getParent(p.id)) });
  });

  // --- obvestila trgovin (brez prijave; pristnost iz podpisa oz. skrivnosti) ---
  // App Store Server Notifications V2: https://developer.apple.com/documentation/appstoreservernotifications
  app.post("/webhooks/app-store", json, (req, res) => {
    let note, tx, renewal;
    try {
      note = verifyAppleJws(req.body?.signedPayload, appleOpts);
      if (!note.data?.signedTransactionInfo) return res.json({ ok: true }); // npr. TEST
      tx = verifyAppleJws(note.data.signedTransactionInfo, appleOpts);
      renewal = note.data.signedRenewalInfo ? verifyAppleJws(note.data.signedRenewalInfo, appleOpts) : null;
    } catch (err) {
      if (err instanceof AppleSignatureError) return res.status(400).json({ error: "Napačen podpis." });
      throw err;
    }
    if (note.data.bundleId !== BUNDLE_ID || tx.bundleId !== BUNDLE_ID) return res.status(400).json({ error: "Napačna aplikacija." });
    const state = appleState(tx, renewal);
    if (["REFUND", "REVOKE"].includes(note.notificationType)) state.status = "expired";
    if (note.notificationType === "DID_FAIL_TO_RENEW" && state.status === "expired") state.status = note.subtype === "GRACE_PERIOD" ? "grace" : "billing_retry";
    // Testni nakup posodobi samo naročnino, ki jo je strežnik že sprejel (testni račun).
    if (tx.environment === "Sandbox" && !row("apple", String(tx.originalTransactionId))) return res.json({ ok: true });
    const owner = parentByToken(tx.appAccountToken);
    const out = apply("apple", String(tx.originalTransactionId), state, owner?.id || null);
    if (out.error) log.warn?.(`[evklid] obvestilo App Store za neznan izdelek ${tx.productId}`);
    res.json({ ok: true });
  });

  // Google Play Real-time developer notifications (Pub/Sub push). V naslovu je skrivnost:
  // https://evklid.app/webhooks/google-play?token=<EVKLID_GOOGLE_RTDN_TOKEN>
  app.post("/webhooks/google-play", json, async (req, res) => {
    const secret = env.EVKLID_GOOGLE_RTDN_TOKEN;
    const given = text(req.query.token);
    if (!secret || given.length !== secret.length || !crypto.timingSafeEqual(Buffer.from(given), Buffer.from(secret))) return res.status(403).end();
    let msg;
    try {
      msg = JSON.parse(Buffer.from(String(req.body?.message?.data || ""), "base64").toString("utf8"));
    } catch {
      return res.status(204).end(); // napačno sporočilo: Pub/Sub naj ga ne pošilja znova
    }
    const token = msg.subscriptionNotification?.purchaseToken || msg.voidedPurchaseNotification?.purchaseToken;
    if (msg.packageName !== ANDROID_PACKAGE || !token || !play.enabled) return res.status(204).end();
    try {
      const sub = await play.subscription(token);
      if (sub) {
        const state = googleSubscriptionState(sub);
        if (msg.voidedPurchaseNotification) state.status = "expired"; // vračilo
        if (state.environment === "Sandbox" && !row("google", token) && !(state.linkedToken && row("google", state.linkedToken))) return res.status(204).end();
        if (state.linkedToken) db.prepare("UPDATE store_subscriptions SET status = 'replaced' WHERE provider = 'google' AND original_id = ?").run(state.linkedToken);
        apply("google", token, state, parentByToken(state.accountToken)?.id || null, state.linkedToken);
      }
      res.status(204).end();
    } catch (err) {
      log.error?.("[evklid] Google Play obvestilo:", err.message);
      res.status(500).end(); // Pub/Sub poskusi znova
    }
  });

  return { apply, accountToken };
}
