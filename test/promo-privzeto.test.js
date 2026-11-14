// Točka A2: aktivacijska koda iz javnega repozitorija (EVKLID3X) ni aktivna, če EVKLID_PROMO_CODE ni nastavljen.
// Obstoječa unovčenja ostanejo (promo_redemptions, parents.promo_until).
// Zagon: node --test test/promo-privzeto.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../server/db.js";
import { createPromo, promoConfig } from "../server/accounts/promo.js";
import { migrateAccounts } from "../server/accounts/schema.js";

test("A2 brez EVKLID_PROMO_CODE koda EVKLID3X ni veljavna, obstoječa unovčenja ostanejo", () => {
  assert.equal(promoConfig({}).code, null);
  const store = openDb(":memory:");
  const db = store.db;
  migrateAccounts(db);
  // Prej: koda iz .env in en račun, ki jo je unovčil.
  const prej = createPromo(db, promoConfig({ EVKLID_PROMO_CODE: "EVKLID3X" }));
  db.prepare("INSERT INTO parents (email, password_hash, privacy_version, unsubscribe_token, referral_code) VALUES ('ana@x.si', 'x', '1', 'u1', 'r1'), ('bor@x.si', 'x', '1', 'u2', 'r2')").run();
  const [ana, bor] = db.prepare("SELECT * FROM parents ORDER BY id").all();
  assert.equal(prej.redeem(ana, "evklid3x").ok, true);
  const until = db.prepare("SELECT promo_until FROM parents WHERE id = ?").get(ana.id).promo_until;
  assert.ok(until);

  // Zagon brez nastavitve: koda ni več veljavna za nove račune.
  const zdaj = createPromo(db, promoConfig({}));
  assert.match(zdaj.redeem(bor, "EVKLID3X").error, /ni veljavna/);
  assert.equal(db.prepare("SELECT promo_until FROM parents WHERE id = ?").get(bor.id).promo_until, null);
  // Ana ohrani unovčenje in rok.
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM promo_redemptions WHERE parent_id = ?").get(ana.id).n, 1);
  assert.equal(db.prepare("SELECT promo_until FROM parents WHERE id = ?").get(ana.id).promo_until, until);
});
