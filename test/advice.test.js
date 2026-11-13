import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { pricingAdvice, netOf, maxLimitUsd } from "../server/advice.js";

const sum = (costs) => ({
  eur_per_usd: 0.87,
  students: costs.map((c, i) => ({ id: i + 1, name: `U${i}`, calls: c > 0 ? 10 : 0, cost_usd: c })),
});
const NOW = new Date("2026-11-30T12:00:00Z"); // zadnji dan meseca: ocena = dejanska poraba

test("predlog meje: premalo podatkov, nato dvig, ko so učenci pri meji", () => {
  const db = new DatabaseSync(":memory:");
  assert.equal(pricingAdvice(db, sum([0.2, 0.3]), { now: NOW }).limit.status, "data");
  const keep = pricingAdvice(db, sum([0.1, 0.2, 0.3, 0.2, 0.4, 0.3, 0.2, 0.5, 0.3, 0.2]), { now: NOW });
  assert.equal(keep.limit.status, "keep");
  assert.ok(keep.economy.profit_eur > 6);
  const raise = pricingAdvice(db, sum([3.1, 2.9, 0.3, 0.2, 0.4, 0.3, 0.2, 0.5, 0.3, 0.2]), { now: NOW });
  assert.equal(raise.limit.status, "raise");
  assert.ok(raise.limit.suggest_usd > 3 && raise.limit.suggest_usd <= maxLimitUsd(9.99, 0.87));
  // Brez starševskih računov ni podatkov o zanimanju.
  assert.equal(raise.price.status, "data");
  assert.ok(Math.abs(netOf(9.99) - 7.79) < 0.02);
});

test("predlog cene po zanimanju: veliko naročnin → višja cena, malo → izboljšaj prvi teden", () => {
  const db = new DatabaseSync(":memory:");
  db.exec("CREATE TABLE parents (id INTEGER PRIMARY KEY, is_admin INTEGER DEFAULT 0, trial_ends_at TEXT, sub_status TEXT, created_at TEXT, promo_until TEXT)");
  const ins = db.prepare("INSERT INTO parents (trial_ends_at, sub_status, created_at) VALUES (?, ?, ?)");
  for (let i = 0; i < 12; i++) ins.run("2026-11-20T00:00:00.000Z", i < 6 ? "active" : null, "2026-11-13 10:00:00");
  const s = sum([0.3, 0.2, 0.4, 0.3, 0.2, 0.5]);
  const hi = pricingAdvice(db, s, { now: NOW });
  assert.equal(hi.interest.conversion_pct, 50);
  assert.equal(hi.interest.signups_30d, 12);
  assert.equal(hi.price.status, "raise");
  assert.equal(hi.price.suggest_eur, 11.99);
  db.exec("UPDATE parents SET sub_status = NULL");
  const lo = pricingAdvice(db, s, { now: NOW });
  assert.equal(lo.price.status, "lower");
  assert.match(lo.price.text, /Mnenje/);
});
