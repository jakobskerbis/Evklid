// Rok hrambe soglasja plačnika (billing_consents) po izbrisu računa (iskalec napak N2; rok odloči j).
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createApp } from "../server/app.js";
import { runRetention, RETENTION } from "../server/zasebnost.js";

test("soglasje plačnika izbrisanega računa se po roku izbriše, obstoječega računa ostane", () => {
  const store = openDb(":memory:");
  createApp(store, { accounts: true, scheduler: false, newsOffline: true, log: { error() {}, warn() {}, info() {} } });
  const db = store.db;
  const ins = db.prepare("INSERT INTO billing_consents (parent_id, payer_email, kind, text, created_at) VALUES (?, ?, 'sub', 'x', ?)");
  const p = Number(db.prepare("INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code) VALUES ('a@x.si', 'x', 'v', 'u', 'R')").run().lastInsertRowid);
  ins.run(null, "star@x.si", "2015-01-01 00:00:00"); // izbrisan račun, star
  ins.run(null, "nov@x.si", new Date().toISOString().replace("T", " ").slice(0, 19)); // izbrisan račun, nov
  ins.run(p, "a@x.si", "2015-01-01 00:00:00"); // račun obstaja
  const before = RETENTION.billingConsentDays;
  RETENTION.billingConsentDays = 5 * 365;
  try {
    const out = runRetention(db, { log: {} });
    assert.equal(out.billingConsents, 1);
    const left = db.prepare("SELECT payer_email FROM billing_consents ORDER BY payer_email").all().map((r) => r.payer_email);
    assert.deepEqual(left, ["a@x.si", "nov@x.si"]);
  } finally {
    RETENTION.billingConsentDays = before;
  }
});

test("rok hrambe soglasja plačnika je določen (čaka j)", { todo: RETENTION.billingConsentDays == null ? "j izbere rok (N2)" : false }, () => {
  assert.ok(Number.isInteger(RETENTION.billingConsentDays) && RETENTION.billingConsentDays > 0);
});
